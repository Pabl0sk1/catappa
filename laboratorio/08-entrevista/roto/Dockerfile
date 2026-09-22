# EJERCICIO: este Dockerfile tiene 7 fallos. Encuéntralos antes de mirar
# las soluciones en escenarios-debug.md (escenario 7).
# Pista: piensa en tamaño, caché, seguridad, señales y reproducibilidad.

FROM maven:latest

WORKDIR /app

COPY . .

RUN mvn clean package

RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

ENV DB_PASSWORD=supersecreto123

EXPOSE 8080

CMD mvn spring-boot:run
