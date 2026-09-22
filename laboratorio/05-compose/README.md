# Módulo 05 — Docker Compose

Tiempo: 2 horas. Segundo módulo más importante. Aquí levantas un stack real:
**API Spring Boot + PostgreSQL + Adminer**, con red privada, volumen
persistente, healthchecks y variables de entorno.

---

## 1. Qué es y por qué existe

Con `docker run` lanzas **un** contenedor. Una aplicación real tiene API + base
de datos + caché + proxy, con su red, sus volúmenes y su orden de arranque.
Hacerlo a mano son 6 comandos larguísimos que nadie recuerda.

**Docker Compose** describe todo eso en un YAML y lo levanta con un comando.

```powershell
docker compose up -d
```

Frase para la entrevista: *"Compose es para definir y ejecutar aplicaciones
multi-contenedor en una sola máquina; para varias máquinas ya hablamos de un
orquestador como Kubernetes."*

> Detalle de versión: lo moderno es `docker compose` (plugin, v2/v5) y el
> fichero `compose.yml`. Lo antiguo era `docker-compose` (guion, Python) y
> `docker-compose.yml` con la clave `version: "3.8"`, **hoy obsoleta**. Si
> mencionas esto, demuestras que estás al día.

---

## 2. Anatomía del fichero

Abre [`compose.yml`](compose.yml) y léelo entero: está comentado línea a línea.
Estructura general:

```yaml
name: mi-proyecto      # nombre del proyecto (prefijo de contenedores y redes)

services:              # los contenedores
  nombre_servicio:
    image: ...         # o build: para construir desde un Dockerfile
    ports: ...
    environment: ...
    volumes: ...
    depends_on: ...
    networks: ...

volumes:               # volúmenes con nombre
networks:              # redes
```

### Las claves que debes conocer

| Clave | Para qué | Ejemplo |
|---|---|---|
| `image` | Imagen a usar | `postgres:16-alpine` |
| `build` | Construir desde un Dockerfile | `build: {context: ./app, dockerfile: Dockerfile}` |
| `container_name` | Nombre fijo del contenedor | `tareas-api` |
| `ports` | Publicar puertos **host:contenedor** | `- "8080:8080"` |
| `expose` | Solo entre contenedores (sin publicar) | `- "8080"` |
| `environment` | Variables de entorno | `POSTGRES_DB: tareas` |
| `env_file` | Variables desde fichero | `- .env.prod` |
| `volumes` | Volúmenes y bind mounts | `- pgdata:/var/lib/postgresql/data` |
| `networks` | Redes a las que se conecta | `- backend` |
| `depends_on` | Orden de arranque | con `condition: service_healthy` |
| `healthcheck` | Comprobar que está sano | `test: ["CMD-SHELL", "pg_isready"]` |
| `restart` | Política de reinicio | `unless-stopped` |
| `command` | Sobrescribe el CMD de la imagen | `command: ["--spring.profiles.active=dev"]` |
| `entrypoint` | Sobrescribe el ENTRYPOINT | |
| `deploy.resources.limits` | CPU/RAM | `memory: 512M` |
| `profiles` | Servicios opcionales | `profiles: ["debug"]` |

### `depends_on`: la trampa clásica

```yaml
depends_on:
  - db                      # SOLO espera a que el contenedor ARRANQUE
```
Postgres tarda unos segundos en aceptar conexiones **después** de arrancar, así
que tu API intenta conectarse y muere. La solución moderna:

```yaml
depends_on:
  db:
    condition: service_healthy   # espera a que el HEALTHCHECK pase
```

> Pregunta de entrevista: *"¿`depends_on` garantiza que la base de datos esté
> lista?"* → **No**, solo el orden de arranque; hace falta `condition:
> service_healthy` o reintentos en la propia aplicación.

### Cómo se hablan los servicios: DNS interno

En `compose.yml` la API se conecta a `jdbc:postgresql://db:5432/tareas`.
**`db` no es una IP ni `localhost`: es el nombre del servicio.** Compose crea
una red bridge propia con un DNS interno que resuelve cada nombre de servicio a
la IP de su contenedor.

Error típico: poner `localhost` en la API. Dentro de un contenedor,
`localhost` es **ese** contenedor, no la máquina ni el otro servicio.

---

## 3. LABORATORIO — levanta el stack

```powershell
cd laboratorio\05-compose
docker compose up -d --build
```

La primera vez tarda unos minutos (compila la app con Maven dentro de Docker).
Verás cómo crea la red, el volumen y los tres contenedores.

```powershell
docker compose ps          # estado de los servicios (incluido healthy)
docker compose logs -f api # logs de un servicio
docker compose logs -f     # logs de todos, mezclados y coloreados
```

Espera a ver `Started TareasApplication` y prueba la API:

```powershell
curl http://localhost:8080/api/tareas
curl http://localhost:8080/api/tareas/info
curl http://localhost:8080/actuator/health
```

Deberías recibir las tres tareas que insertó `init.sql`. **Tu API está hablando
con Postgres por la red interna de Docker.**

Crea una tarea nueva. En PowerShell 7 lo más fiable es la forma nativa:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/tareas `
  -ContentType "application/json" `
  -Body '{"titulo":"Aprobar la entrevista","completada":false}'
```

Y en Git Bash (o con `curl.exe` en PowerShell), la sintaxis universal:

```bash
curl -X POST http://localhost:8080/api/tareas -H "Content-Type: application/json" -d '{"titulo":"Aprobar la entrevista","completada":false}'
```

Marca una como completada y bórrala:

```powershell
Invoke-RestMethod -Method Put    -Uri http://localhost:8080/api/tareas/2
Invoke-RestMethod -Method Delete -Uri http://localhost:8080/api/tareas/3
```

**Adminer** (cliente web de base de datos): http://localhost:8081
- Motor: `PostgreSQL` · Servidor: `db` · Usuario: `tareas_user` ·
  Contraseña: `tareas_pass` · Base de datos: `tareas`

Fíjate en que el servidor es `db`: Adminer también usa el DNS interno.

### La prueba de la persistencia (hazla, es reveladora)

```powershell
docker compose down          # para y borra contenedores y red, NO el volumen
docker compose up -d
curl http://localhost:8080/api/tareas    # tus tareas SIGUEN AHI
```

Y ahora la destructiva:

```powershell
docker compose down -v       # -v BORRA los volumenes
docker compose up -d
curl http://localhost:8080/api/tareas    # vuelta a las 3 tareas de init.sql
```

> `down` = contenedores + red. `down -v` = **además los datos**. Saber esta
> diferencia te evita un desastre en producción, y es pregunta de entrevista.

---

## 4. Comandos de Compose

| Comando | Qué hace |
|---|---|
| `docker compose up -d` | Levanta todo en segundo plano |
| `docker compose up -d --build` | Reconstruye las imágenes antes de levantar |
| `docker compose up -d api` | Levanta solo un servicio (y sus dependencias) |
| `docker compose down` | Para y elimina contenedores y redes |
| `docker compose down -v` | ...y **borra los volúmenes** |
| `docker compose ps` | Estado de los servicios |
| `docker compose logs -f [svc]` | Logs en vivo |
| `docker compose exec api sh` | Shell dentro de un servicio en marcha |
| `docker compose run --rm api env` | Contenedor nuevo de un servicio, de usar y tirar |
| `docker compose restart api` | Reinicia un servicio |
| `docker compose stop / start` | Parar / arrancar sin borrar |
| `docker compose build --no-cache` | Reconstruir ignorando la caché |
| `docker compose config` | **Valida el YAML** y muestra la config final |
| `docker compose pull` | Descarga las imágenes actualizadas |
| `docker compose top` | Procesos de cada servicio |

---

## 5. Variables de entorno y `.env`

Compose lee automáticamente el fichero `.env` de la carpeta y sustituye
`${VARIABLE}` en el YAML. Mira [`.env`](.env) y verás de dónde salen
`POSTGRES_PASSWORD` y `API_PORT`.

```yaml
ports:
  - "${API_PORT:-8080}:8080"    # si API_PORT no existe, usa 8080
```

Buenas prácticas que debes decir:
- `.env` **nunca** se sube al repositorio; se sube `.env.example`.
- Los secretos de producción no van en `.env`, van en el gestor de secretos del
  entorno (Docker secrets, Vault, variables del CI/CD).
- Cuidado: `environment:` en compose se ve con `docker inspect`.

Pruébalo:

```powershell
$env:API_PORT=9090 ; docker compose up -d
```

Ahora la API responde en http://localhost:9090 sin tocar un solo fichero.

---

## 6. Varios ficheros: dev vs producción

Compose fusiona ficheros con `-f` (el último gana):

```powershell
docker compose -f compose.yml -f compose.prod.yml up -d
```

Además, si existe `compose.override.yml`, se aplica **automáticamente** encima
de `compose.yml`. Patrón habitual:

- `compose.yml` → lo común.
- `compose.override.yml` → desarrollo (bind mount del código, puertos abiertos,
  `SPRING_PROFILES_ACTIVE=dev`).
- `compose.prod.yml` → producción (sin bind mounts, réplicas, límites, imagen
  del registry en vez de `build`).

Tienes un ejemplo listo en el módulo [07-servidor](../07-servidor/).

### Perfiles

```yaml
adminer:
  profiles: ["tools"]
```
Ese servicio solo arranca con `docker compose --profile tools up -d`. Útil para
herramientas que no quieres en producción.

---

## 7. Ejercicios

1. Añade un servicio `cache` con `redis:alpine` en la red `backend`, sin
   publicar puertos. Comprueba desde la API que responde:
   `docker compose exec api ping -c2 cache` (si no hay ping, usa
   `docker compose exec cache redis-cli PING`).
2. Cambia el puerto público de la API al 9000 **solo tocando `.env`**.
3. Pon el servicio `adminer` bajo el perfil `tools` y comprueba que
   `docker compose up -d` ya no lo arranca.
4. Añade un healthcheck al servicio `api` en el compose (aunque ya lo tenga la
   imagen) y mira cómo `docker compose ps` muestra `healthy`.
5. Escala la API a 2 instancias: `docker compose up -d --scale api=2`.
   ¿Qué error da y por qué? Arréglalo. *(Pista: `container_name` y el puerto
   fijo. Quita ambos y deja que Docker asigne.)*
6. Rompe algo a propósito: cambia la contraseña de la API en compose y mira el
   error en `docker compose logs api`. Ese mensaje es el que tendrás que
   diagnosticar el martes.

<details>
<summary>Soluciones</summary>

```yaml
# 1
  cache:
    image: redis:alpine
    networks: [backend]
    restart: unless-stopped
```
```powershell
docker compose up -d
docker compose exec cache redis-cli PING     # PONG
docker compose exec api sh -c "nc -z cache 6379 && echo alcanzable"
```
```bash
# 2  en .env
API_PORT=9000
```
```yaml
# 3
  adminer:
    profiles: ["tools"]
#   docker compose --profile tools up -d
```
```yaml
# 4
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/actuator/health"]
      interval: 15s
      timeout: 3s
      retries: 5
      start_period: 45s
```
```
5. Falla porque dos contenedores no pueden compartir container_name ni el
   mismo puerto del host. Quita container_name y usa "ports: - 8080" (puerto
   aleatorio en el host) o un rango.
```
</details>

---

## 8. Preguntas de entrevista de este módulo

- ¿Qué diferencia hay entre `docker run` y `docker compose up`?
- ¿Cómo se comunican dos contenedores del mismo compose? (*red bridge propia +
  DNS por nombre de servicio*)
- ¿Por qué `localhost` no funciona entre contenedores?
- ¿`depends_on` espera a que la base de datos esté lista? ¿Cómo lo resuelves?
- ¿Qué hace `docker compose down -v`?
- ¿Cómo gestionas configuración distinta entre desarrollo y producción?
- ¿Dónde guardas las contraseñas?
- ¿Compose sirve para producción? (*para una sola máquina o entornos pequeños,
  sí; para alta disponibilidad y varios nodos, Kubernetes*)
