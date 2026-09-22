# =========================================================================
#  VERSION 2 - MULTI-STAGE, LA QUE ENSEÑARIAS EN UNA ENTREVISTA
#  docker build -t app-simple:v2 .
#  Sabe explicar CADA linea de este fichero: es el 40% de la entrevista.
# =========================================================================

# ---------- ETAPA 1: BUILD ----------
# "AS builder" da nombre a la etapa para poder copiar desde ella despues.
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# TRUCO DE CACHE: primero SOLO el pom.xml. Si el pom no cambia, Docker
# reutiliza la capa siguiente y NO vuelve a descargar las dependencias.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora si, el codigo fuente (que cambia constantemente).
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- ETAPA 2: RUNTIME ----------
# Partimos de cero con una imagen minima: solo JRE, sin JDK ni Maven.
# alpine = distro Linux de ~5 MB.
FROM eclipse-temurin:21-jre-alpine

# Metadatos de la imagen (buena practica, se ven con docker inspect)
LABEL maintainer="pablo" \
      descripcion="API Spring Boot de practica" \
      version="1.0.0"

# Usuario sin privilegios: NUNCA corras en produccion como root.
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copiamos SOLO el jar desde la etapa builder. Todo lo demas se descarta.
COPY --from=builder /build/target/app.jar app.jar

# El fichero pertenece al usuario no privilegiado
RUN chown spring:spring /app/app.jar
USER spring

# Configuracion por defecto, sobreescribible con -e en tiempo de ejecucion
ENV SERVER_PORT=8080 \
    JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

# EXPOSE es DOCUMENTACION: no publica nada. Publicar es -p en docker run.
EXPOSE 8080

# Docker comprueba periodicamente si la app esta viva (usa el actuator).
# wget viene incluido en alpine (busybox).
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# Forma EXEC (lista JSON): java es PID 1 y recibe SIGTERM -> apagado elegante.
# Usamos sh -c solo porque necesitamos expandir $JAVA_OPTS; si no, iria directo.
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
