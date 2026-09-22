# Módulo 03 — Dockerfile (el módulo más importante)

Tiempo: 2 horas. Si el martes solo te preguntan una cosa, será esta. Aquí
construyes una imagen de Spring Boot mal hecha, mides el desastre, y la
conviertes en una imagen de producción.

**No necesitas Java ni Maven instalados en tu PC.** Se compila dentro de un
contenedor. Eso mismo es una respuesta de entrevista: *"el build es
reproducible, no depende de lo que tenga instalado la máquina".*

---

## 1. Qué es un Dockerfile

Un fichero de texto con las instrucciones para construir una imagen. Docker lo
lee **de arriba abajo**, y cada instrucción produce una **capa**.

```dockerfile
FROM eclipse-temurin:21-jre-alpine   # imagen base
WORKDIR /app                          # directorio de trabajo
COPY app.jar .                        # copiar ficheros
RUN chmod +x app.jar                  # ejecutar algo AL CONSTRUIR
EXPOSE 8080                           # documentar el puerto
CMD ["java", "-jar", "app.jar"]       # que se ejecuta AL ARRANCAR
```

Se construye con:

```powershell
docker build -t nombre:tag .
```

Ese `.` final es el **contexto de build**: la carpeta que se envía al daemon.
Todo lo que esté ahí (salvo lo del `.dockerignore`) viaja al daemon. Por eso
un contexto de 2 GB hace que el build tarde una eternidad.

---

## 2. Todas las instrucciones que debes conocer

| Instrucción | Para qué sirve | Detalle que te pueden preguntar |
|---|---|---|
| `FROM imagen:tag` | Imagen base. Siempre la primera (salvo `ARG`) | `FROM scratch` = imagen vacía. Usa tags fijos, nunca `latest` |
| `WORKDIR /app` | Fija el directorio de trabajo (lo crea si no existe) | Mejor que `RUN cd /app`, porque `cd` no persiste entre capas |
| `COPY origen destino` | Copia del contexto a la imagen | Es la opción por defecto |
| `ADD origen destino` | Igual que COPY + descomprime .tar + acepta URLs | **Usa COPY** salvo que necesites esos extras. Pregunta clásica |
| `RUN comando` | Ejecuta algo **durante el build** y crea una capa | Encadena con `&&` para no crear capas de más |
| `CMD ["a","b"]` | Comando **por defecto** al arrancar | Se puede sobreescribir: `docker run img otro-comando` |
| `ENTRYPOINT ["a"]` | Ejecutable **fijo** al arrancar | Lo de `docker run img X` pasa como argumentos, no lo reemplaza |
| `ENV K=V` | Variable de entorno persistente (build y runtime) | Se ve con `docker inspect`: **nunca metas secretos** |
| `ARG K=V` | Variable **solo durante el build** | `docker build --build-arg K=V .` |
| `EXPOSE 8080` | Documenta el puerto | **NO publica nada.** Publicar es `-p`. Pregunta trampa muy común |
| `VOLUME /datos` | Declara un punto de montaje persistente | Crea un volumen anónimo si no montas otro |
| `USER spring` | Cambia el usuario para las siguientes instrucciones y el runtime | Seguridad: no correr como root |
| `HEALTHCHECK CMD ...` | Cómo saber si la app está sana | Lo usa `docker ps` (healthy/unhealthy) y `depends_on: condition: service_healthy` |
| `LABEL k="v"` | Metadatos | Útil para trazabilidad (commit, versión) |
| `ONBUILD` | Instrucción diferida para imágenes hijas | Raro; basta con saber que existe |

### CMD vs ENTRYPOINT (pregunta garantizada)

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--spring.profiles.active=dev"]
```
- `docker run img` → `java -jar app.jar --spring.profiles.active=dev`
- `docker run img --spring.profiles.active=prod` → sustituye **solo el CMD**.

Resumen: **ENTRYPOINT = qué se ejecuta. CMD = argumentos por defecto.**
Si solo pones `CMD`, cualquier comando en `docker run` lo reemplaza entero.

### Forma exec vs forma shell (el detalle que casi nadie sabe)

```dockerfile
CMD ["java", "-jar", "app.jar"]    # EXEC: java es PID 1, recibe SIGTERM -> apagado elegante
CMD java -jar app.jar              # SHELL: arranca /bin/sh -c "...", sh es PID 1 y se come la señal
```
Usa **siempre** la forma exec (lista JSON). Si necesitas variables de shell,
usa `ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar app.jar"]`: ese `exec`
hace que java **reemplace** a la shell y vuelva a ser PID 1.

---

## 3. La caché de capas (aquí se gana o se pierde el build)

Reglas de la caché:

1. Docker recorre las instrucciones en orden y reutiliza la capa si la
   instrucción **y los ficheros que copia** no han cambiado.
2. **En cuanto una capa se invalida, TODAS las siguientes se reconstruyen.**
3. Conclusión: **pon primero lo que cambia poco y al final lo que cambia mucho.**

Por eso, en Java:

```dockerfile
COPY pom.xml .                  # cambia rara vez
RUN mvn dependency:go-offline   # 2 minutos... pero se cachea
COPY src ./src                  # cambia en cada commit
RUN mvn package -DskipTests     # solo esto se repite
```

Si hicieras `COPY . .` antes, **cada cambio de una línea de código volvería a
descargar todo Maven**. Es la pregunta de optimización más frecuente.

---

## 4. Multi-stage builds (tu mejor argumento)

**El problema:** para compilar Java necesitas JDK + Maven (~500 MB). Para
*ejecutar* solo necesitas un JRE. Multi-stage permite compilar en una etapa y
copiar solo el resultado a otra imagen limpia.

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS builder
...compila...

FROM eclipse-temurin:21-jre-alpine
COPY --from=builder /build/target/app.jar app.jar
```

Ventajas para decir en voz alta:
- Imagen final mucho más pequeña (menos descarga, despliegues más rápidos).
- **Menor superficie de ataque**: sin compilador, sin Maven, sin código fuente
  dentro de la imagen de producción.
- No hay secretos del build (tokens del repositorio Maven) en la imagen final.

---

## 5. LABORATORIO — mide la diferencia tú mismo

La app está en [`app-simple/`](app-simple/): una API Spring Boot con `/` y
`/api/ping`. Colócate ahí:

```powershell
cd laboratorio\03-dockerfile\app-simple
```

### Paso 1 — construye la versión mala

```powershell
docker build -f Dockerfile.v1-malo -t app-simple:v1 .
```

La primera vez tarda varios minutos (descarga Maven y las dependencias).

### Paso 2 — construye la versión buena

```powershell
docker build -t app-simple:v2 .
```

### Paso 3 — compara

```powershell
docker images app-simple --format "table {{.Tag}}\t{{.Size}}"
```

Salida real en tu máquina (medida al preparar este laboratorio):

```
TAG       SIZE
v1        949MB      <- JDK + Maven + repositorio .m2 + codigo fuente
v2        372MB      <- solo JRE alpine + el jar
```

**Una imagen 2,5 veces más pequeña, con el mismo código.** Y de esos 372 MB, la
mayoría es el JRE: la capa de tu aplicación son unos 25 MB, que es lo único que
viaja en cada despliegue nuevo porque el resto de capas ya están en el servidor.

**Ese número es tu respuesta cuando te pregunten "¿cómo optimizarías una
imagen?"**: multi-stage, base alpine/slim, `.dockerignore`, orden de capas,
menos capas con `&&`.

### Paso 4 — ejecútala

```powershell
docker run -d --name api -p 8080:8080 app-simple:v2
docker logs -f api
```

Cuando veas `Started AppSimpleApplication`, abre http://localhost:8080 y
http://localhost:8080/api/ping.

Fíjate en la respuesta: `hostname` es el ID del contenedor y `usuario` es
`spring`, **no root** (funcionó el `USER spring`).

### Paso 5 — comprueba el healthcheck

```powershell
docker ps        # STATUS: Up 40 seconds (healthy)
```

Ese `(healthy)` lo produce la instrucción `HEALTHCHECK`. En el módulo 05 lo
usaremos para que la API espere a que Postgres esté lista.

### Paso 6 — configura sin reconstruir

```powershell
docker rm -f api
docker run -d --name api -p 8080:8080 -e APP_MENSAJE="Listo para la entrevista" app-simple:v2
curl http://localhost:8080
```

**La misma imagen, distinta configuración.** Esa es la regla: una imagen por
artefacto, la configuración va por variables de entorno.

### Paso 7 — la caché en acción

Edita un `System.out` o el texto por defecto en
`src/main/java/com/practica/AppSimpleApplication.java` y reconstruye:

```powershell
docker build -t app-simple:v2 .
```

Mira la salida: las capas del `pom.xml` y de las dependencias dicen `CACHED` y
el build tarda segundos en vez de minutos. **Eso es el orden de capas
funcionando.** Ahora haz lo mismo con `Dockerfile.v1-malo` y compara el tiempo.

### Paso 8 — inspecciona las capas

```powershell
docker history app-simple:v2
docker inspect app-simple:v2
```

Limpieza:

```powershell
docker rm -f api
```

---

## 6. Buenas prácticas (lista para recitar)

1. **Multi-stage** para lenguajes compilados.
2. Imagen base **mínima y con tag fijo** (`21-jre-alpine`, nunca `latest`).
3. **`.dockerignore`** siempre (contexto pequeño, sin secretos, sin `target/`).
4. **Orden de capas**: dependencias antes que código fuente.
5. **Menos capas**: encadena `RUN a && b && c` y limpia en la misma capa
   (`apt-get install ... && rm -rf /var/lib/apt/lists/*`). Si borras en una
   capa posterior, **el peso sigue en la imagen**.
6. **Usuario no root** (`USER`).
7. **Nunca secretos** en `ENV`, `ARG` ni en la imagen: van por variables en
   runtime, Docker secrets o un gestor de secretos.
8. **HEALTHCHECK** para que el orquestador sepa si la app está viva.
9. **Forma exec** en CMD/ENTRYPOINT (señales y apagado elegante).
10. Fija versiones de paquetes cuando importe la reproducibilidad.

---

## 7. Ejercicios

1. Añade al Dockerfile un `ARG VERSION=1.0.0` y conviértelo en un `LABEL
   version=$VERSION`. Construye con `--build-arg VERSION=2.0.0` y compruébalo
   con `docker inspect`.
2. Haz que la app arranque por defecto en el puerto 9000 **sin tocar el código
   Java** (pista: `ENV SERVER_PORT`). Publícalo en el 9000 del host.
3. Cambia el `ENTRYPOINT` para que el perfil de Spring se pueda pasar como
   argumento en `docker run`, con `dev` por defecto (pista: ENTRYPOINT + CMD).
4. Construye una imagen `alpine` propia que solo imprima la fecha al arrancar.
5. Rompe la caché a propósito: mueve `COPY src ./src` antes del `pom.xml`,
   reconstruye y mide cuánto tarda. Luego deshazlo.
6. Sin mirar: ¿qué pasa si quitas `USER spring`? Compruébalo con
   `docker run --rm app-simple:v2 whoami` (ojo: con `ENTRYPOINT` fijo tendrás
   que usar `--entrypoint whoami`).

<details>
<summary>Soluciones</summary>

```dockerfile
# 1
ARG VERSION=1.0.0
LABEL version=$VERSION
```
```powershell
docker build --build-arg VERSION=2.0.0 -t app-simple:v3 .
docker inspect -f "{{.Config.Labels.version}}" app-simple:v3
```
```dockerfile
# 2
ENV SERVER_PORT=9000
EXPOSE 9000
```
```powershell
docker run -d -p 9000:9000 app-simple:v2   # o mas simple, sin tocar nada:
docker run -d -p 9000:9000 -e SERVER_PORT=9000 app-simple:v2
```
```dockerfile
# 3
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
CMD ["--spring.profiles.active=dev"]
#   docker run img --spring.profiles.active=prod
```
```dockerfile
# 4
FROM alpine:3.20
CMD ["date"]
```
```powershell
# 6
docker run --rm --entrypoint whoami app-simple:v2     # -> spring
```
</details>

---

## 8. Preguntas de entrevista de este módulo

- ¿Diferencia entre `COPY` y `ADD`? ¿Cuál usas y por qué?
- ¿Diferencia entre `CMD` y `ENTRYPOINT`?
- ¿Qué hace `EXPOSE`? (*documentar; no abre ningún puerto*)
- ¿Qué es un multi-stage build y qué ganas con él?
- ¿Cómo funciona la caché de capas y cómo ordenas el Dockerfile para aprovecharla?
- ¿Cómo reducirías el tamaño de una imagen de 1 GB?
- ¿Por qué `RUN apt-get install x && rm -rf /var/lib/apt/lists/*` va en la misma línea?
- ¿Cómo pasas un secreto al build sin que quede en la imagen?
  (*`--secret`/BuildKit, nunca `ARG`/`ENV`; los `ARG` quedan en la historia de la imagen*)
- ¿Qué diferencia hay entre `ARG` y `ENV`?
- ¿Por qué `latest` es mala idea? (*no es inmutable: el build de hoy y el de
  mañana pueden dar imágenes distintas; adiós reproducibilidad*)
