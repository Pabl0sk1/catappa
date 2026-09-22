# Multi-stage: compila con Maven+JDK, ejecuta solo con JRE.
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
LABEL descripcion="API de tareas (Spring Boot + Postgres)"

RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY --from=builder /build/target/app.jar app.jar
RUN chown spring:spring /app/app.jar
USER spring

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=45s --retries=5 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
