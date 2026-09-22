# Chuleta Docker — para el martes por la mañana

## Ciclo de vida

```powershell
docker run -d --name api -p 8080:8080 imagen:tag   # crear + arrancar
docker ps / docker ps -a                            # listar / incluidos parados
docker stop|start|restart api                       # parar/arrancar/reiniciar
docker rm -f api                                    # borrar (forzado)
docker exec -it api sh                              # entrar en uno vivo
docker logs -f --tail 100 api                       # logs
docker inspect api                                  # JSON completo
docker stats / docker top api                       # recursos / procesos
docker cp api:/app/f.log .                          # copiar fuera
```

### Flags de `docker run`
`-d` fondo · `-it` interactivo · `--rm` autoborrado · `--name` nombre
`-p 8080:80` **host:contenedor** · `-e K=V` variable · `--env-file .env`
`-v vol:/ruta` volumen · `-v .:/app` bind mount · `:ro` solo lectura
`--network red` · `-w /app` workdir · `-u 1000:1000` usuario
`--restart unless-stopped` · `-m 512m --cpus 0.5` límites

## Imágenes

```powershell
docker build -t app:1.0 .            # construir (el "." es el CONTEXTO)
docker build --no-cache -t app:1.0 . # sin cache
docker images / docker rmi app:1.0
docker history app:1.0               # capas y peso
docker tag app:1.0 ghcr.io/yo/app:1.0
docker push / docker pull
```

## Dockerfile

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B        # cache de dependencias
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY --from=builder /build/target/app.jar app.jar
USER spring
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
EXPOSE 8080
HEALTHCHECK --interval=30s --start-period=40s CMD wget -qO- localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

| Instrucción | Clave |
|---|---|
| `COPY` vs `ADD` | usa COPY; ADD descomprime y admite URLs |
| `CMD` vs `ENTRYPOINT` | ENTRYPOINT = ejecutable fijo; CMD = argumentos por defecto |
| exec vs shell | `["a","b"]` → PID 1 recibe SIGTERM. String → lo arranca `sh` |
| `EXPOSE` | solo documenta, **no publica** |
| `ARG` vs `ENV` | ARG solo en build; ENV persiste (ninguno para secretos) |
| Caché | lo que cambia poco, arriba; lo que cambia mucho, abajo |

## Compose

```yaml
name: mi-proyecto
services:
  api:
    build: ./app
    image: app:1.0
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/tareas
    depends_on:
      db: {condition: service_healthy}
    networks: [backend]
    restart: unless-stopped
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10
    networks: [backend]
volumes: {pgdata: {}}
networks: {backend: {driver: bridge}}
```

```powershell
docker compose up -d --build       docker compose down        # -v borra DATOS
docker compose ps                  docker compose logs -f api
docker compose exec api sh         docker compose config      # valida el YAML
docker compose up -d --scale api=3
```

## Redes y volúmenes

```powershell
docker network create mired        docker network inspect mired
docker volume create datos         docker volume ls / inspect / rm
```
- Red bridge propia → **DNS por nombre de servicio** (`db:5432`).
- `localhost` dentro de un contenedor = ese contenedor.
- Named volume = datos de producción. Bind mount = desarrollo y configuración.
- `docker compose down` conserva volúmenes; `down -v` los borra.

## Limpieza

```powershell
docker system df            docker system prune -a --volumes   # ¡cuidado!
docker image prune -a       docker builder prune
```

## Diagnóstico rápido

| Síntoma | Primer comando |
|---|---|
| No arranca | `docker ps -a` (exit code) + `docker logs` |
| Exit 137 | sin memoria (OOM) o SIGKILL |
| No conecta a la BD | ¿`localhost` en vez del nombre del servicio? ¿misma red? |
| Puerto ocupado | `docker ps --filter publish=8080` |
| No responde en el navegador | `docker port X`, ¿publicaste? ¿puerto interno correcto? |
| Build lento | orden de capas + `.dockerignore` |
| Disco lleno | `docker system df` → `builder prune` |

## Definiciones de un renglón

- **Contenedor**: proceso aislado con namespaces, limitado con cgroups, sobre
  un filesystem de capas. Comparte el kernel del host.
- **Imagen**: plantilla inmutable en capas; el contenedor es su instancia.
- **Multi-stage**: compilar en una etapa y copiar solo el artefacto a una
  imagen mínima → menos peso y menos superficie de ataque.
- **Compose**: multi-contenedor en una máquina. **Kubernetes**: en un clúster.
- **Registry**: almacén de imágenes; tags inmutables → rollback fiable.
- **12-factor**: config por entorno, sin estado, logs a stdout, paridad dev/prod.

## Los 6 errores que no debes cometer al hablar

1. Decir que un contenedor "es una VM ligera" sin matizar lo del kernel.
2. Decir que `EXPOSE` abre el puerto.
3. Decir que `depends_on` espera a que la base de datos esté lista.
4. Invertir `host:contenedor` en `-p`.
5. Olvidar que los datos se pierden sin volumen.
6. Meter secretos en la imagen.
