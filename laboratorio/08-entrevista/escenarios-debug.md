# Escenarios de depuración

En una entrevista técnica es muy probable que te den un caso: *"esto no
funciona, ¿qué harías?"*. No buscan la solución exacta, buscan **tu método**.

## El método (memorízalo y dilo en voz alta)

1. `docker ps -a` → ¿está corriendo? ¿qué exit code tiene?
2. `docker logs --tail 100 NOMBRE` → ¿qué dice la aplicación?
3. `docker inspect NOMBRE` → puertos, red, variables, montajes.
4. `docker exec -it NOMBRE sh` → entrar y reproducir desde dentro.
5. Aislar la capa: ¿es red, configuración, imagen o la propia app?

---

## Escenario 1 — "El contenedor se para nada más arrancar"

**Diagnóstico:**
```powershell
docker ps -a                  # STATUS: Exited (1) hace 2 segundos
docker logs mi-contenedor
```
**Causas típicas:**
- El proceso principal termina (le pasaste un comando que acaba: `ls`, `echo`).
- La app casca al arrancar (exit 1): falta una variable, no encuentra la BD.
- Exit 137 = SIGKILL → **se quedó sin memoria** (OOM) o `docker kill`.
- Exit 143 = SIGTERM → alguien lo paró.

**Respuesta:** "Un contenedor vive mientras viva su PID 1. Miro `docker ps -a`
para el exit code y `docker logs` para la causa; si no hay logs, arranco la
imagen con `docker run -it --entrypoint sh imagen` para inspeccionarla por dentro."

**Reprodúcelo:**
```powershell
docker run --name muere alpine ls
docker ps -a                  # Exited (0)
docker run --name oom -m 6m --memory-swap 6m alpine sh -c "yes > /dev/null"
```

---

## Escenario 2 — "Error: port is already allocated"

```
Bind for 0.0.0.0:8080 failed: port is already allocated
```
**Qué haces:**
```powershell
docker ps --filter "publish=8080"     # quien lo tiene
netstat -ano | findstr :8080          # o un proceso de Windows
```
Solución: parar el contenedor que lo ocupa o publicar en otro puerto
(`-p 8081:8080`). **El del contenedor no hay que cambiarlo nunca**, solo el del
host.

---

## Escenario 3 — "La API no conecta con la base de datos"

El error clásico en los logs:
```
Connection to localhost:5432 refused
```
**La causa casi siempre es una de estas tres:**
1. La URL apunta a `localhost`. Dentro del contenedor, `localhost` es **el
   propio contenedor**. Debe ser el **nombre del servicio**: `db:5432`.
2. No están en la misma red.
3. La base de datos aún no acepta conexiones: falta `depends_on` con
   `condition: service_healthy`.

**Cómo lo compruebas:**
```powershell
docker compose exec api sh
# dentro:
nc -z db 5432 && echo "alcanzable"      # o: wget -qO- db:5432
```
```powershell
docker network inspect practica-docker_backend   # que contenedores hay
docker compose logs db
```

**Reprodúcelo** en el módulo 05: cambia `db` por `localhost` en la URL, haz
`docker compose up -d` y lee el error. Luego arréglalo.

---

## Escenario 4 — "Se han perdido todos los datos"

**Causas:**
- Hicieron `docker compose down -v` (la `-v` borra volúmenes).
- El servicio no tenía volumen: los datos estaban en la capa de escritura y
  murieron con el contenedor.
- Recrearon el contenedor con `docker rm` + `docker run` sin montar el volumen.

**Prevención que debes nombrar:** named volume para los datos, backups
programados (`pg_dump` a un almacenamiento externo), y nunca `-v` ni
`volume prune` en producción sin pensarlo dos veces.

---

## Escenario 5 — "No puedo acceder a la app desde el navegador"

Revisa **en este orden**:
1. ¿El contenedor está `Up`? → `docker ps`
2. ¿El puerto está publicado? → `docker port NOMBRE`. Recuerda: `EXPOSE` **no
   publica nada**, hace falta `-p` o `ports:`.
3. ¿Coincide el puerto interno? Si la app escucha en 9000 y mapeas `8080:8080`,
   no hay nada al otro lado.
4. ¿La app escucha en `0.0.0.0` o solo en `127.0.0.1` **dentro** del contenedor?
   Si escucha solo en localhost interno, el mapeo no la alcanza. (En Spring
   Boot: `server.address=0.0.0.0`, que es el valor por defecto.)
5. ¿Está sana? → `docker logs`, `docker ps` (healthy/unhealthy).

---

## Escenario 6 — "El build tarda 8 minutos en cada cambio de una línea"

**Causa:** el orden de las capas. Si haces `COPY . .` antes de resolver
dependencias, cualquier cambio invalida la caché y Maven vuelve a descargarlo todo.

**Solución:**
```dockerfile
COPY pom.xml .
RUN mvn dependency:go-offline -B    # se cachea
COPY src ./src                      # lo que cambia, al final
RUN mvn package -DskipTests -B
```
Añade también `.dockerignore` (sin `target/` ni `.git/`) y, en el CI, caché de
capas (`cache-from: type=gha`).

---

## Escenario 7 — Arregla el Dockerfile roto

Abre [`roto/Dockerfile`](roto/Dockerfile) y encuentra los 7 fallos.

<details>
<summary>Soluciones</summary>

1. `FROM maven:latest` → tag flotante **y** imagen de build usada como runtime.
   Debe ser multi-stage con tag fijo: `maven:3.9-eclipse-temurin-21 AS builder`
   + `eclipse-temurin:21-jre-alpine`.
2. `COPY . .` antes de las dependencias → rompe la caché en cada cambio.
3. `mvn clean package` sin `-DskipTests` en la imagen y sin multi-stage: la
   imagen final arrastra JDK, Maven, `~/.m2` y el código fuente.
4. Tres `RUN` de apt separados → tres capas; además el `rm -rf` en una capa
   distinta **no reduce el tamaño** (la capa anterior ya contiene la caché).
   Correcto: `RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*`.
5. `ENV DB_PASSWORD=supersecreto123` → secreto grabado en la imagen, visible
   con `docker inspect` y `docker history`. Fuera: va en runtime.
6. No hay `USER` → corre como root.
7. `CMD mvn spring-boot:run` → forma shell (PID 1 es `sh`, no recibe SIGTERM) y
   además arranca con Maven en producción. Debe ser
   `ENTRYPOINT ["java","-jar","/app/app.jar"]`.

Extra: falta `HEALTHCHECK` y falta `.dockerignore`.

El resultado correcto es exactamente
[`03-dockerfile/app-simple/Dockerfile`](../03-dockerfile/app-simple/Dockerfile).
</details>

---

## Escenario 8 — Arregla el compose roto

```powershell
cd laboratorio\08-entrevista\roto
docker compose -f compose-roto.yml config
```

El primer error te lo dirá el validador. Encuentra los 8.

<details>
<summary>Soluciones</summary>

1. **Tabulador** en la línea `POSTGRES_PASSWORD` → YAML no admite tabuladores.
   Es el error que impide leer el fichero.
2. `version: "3.8"` → obsoleto en Compose v2+; se elimina.
3. `SPRING_DATASOURCE_URL: ...//localhost:5432/...` → debe ser `db:5432`.
4. `depends_on: - db` → no espera a que Postgres acepte conexiones; hace falta
   un `healthcheck` en `db` y `condition: service_healthy`.
5. `image: postgres` → sin tag (= `latest`): no reproducible. `postgres:16-alpine`.
6. `ports: - 5432:5432` en la base de datos → la expone al exterior sin
   necesidad. Se quita: la API la alcanza por la red interna.
7. Contraseñas en claro dentro del YAML → deben venir de `.env` / gestor de
   secretos: `${POSTGRES_PASSWORD}`.
8. `volumes: - ./datos:/var/lib/postgresql/data` → bind mount para datos de
   base de datos: da problemas de permisos y rendimiento (sobre todo en
   Windows/Mac). Usa un named volume declarado en la sección `volumes:`.

Extra: los puertos deberían ir entrecomillados (`"8080:8080"`) y no hay
`restart:` ni redes explícitas.

El resultado correcto es [`05-compose/compose.yml`](../05-compose/compose.yml).
</details>

---

## Escenario 9 — "Se ha llenado el disco del servidor"

```bash
docker system df            # ver el reparto: imagenes, contenedores, volumenes, cache
docker system df -v         # detalle
docker image prune -a       # imagenes sin usar
docker container prune
docker builder prune        # cache de build, suele ser el gran culpable
```
**Prevención:** límites de logs (`max-size`, `max-file`), prune programado, y
no dejar imágenes viejas acumuladas tras cada despliegue.

---

## Escenario 10 — "Permission denied al escribir en un volumen"

Pasa al usar `USER` no root con un bind mount: el UID de dentro no coincide con
el dueño de la carpeta del host.

**Soluciones:** `chown` en el Dockerfile sobre las rutas que la app escribe,
ejecutar con `-u $(id -u):$(id -g)`, o usar un named volume (Docker copia los
permisos iniciales de la imagen).

---

## Cómo contarlo en la entrevista

Aunque no sepas la causa exacta, **describe el método**: "primero miro si está
corriendo y con qué exit code, después los logs, después inspecciono la red y
las variables, y por último entro al contenedor y lo reproduzco desde dentro".
Eso ya es media respuesta bien dada.
