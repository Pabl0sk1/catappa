# =========================================================================
#  Catappa: servidor Node sin dependencias externas + web app estática.
#  Aplica lo que enseñan los propios cursos:
#   - imagen base mínima con tag fijo
#   - usuario sin privilegios
#   - healthcheck
#   - forma exec en CMD (node es PID 1 y recibe SIGTERM)
# =========================================================================
FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/data

# intérpretes para los ejercicios de código que se ejecutan de verdad
# (el código lo escribe quien aprende y corre con un usuario sin privilegios)
RUN apk add --no-cache python3 php83-cli openjdk21-jdk bash sqlite

WORKDIR /app

# Solo lo necesario (ver .dockerignore)
COPY server ./server
COPY herramientas ./herramientas
COPY public ./public

# índice ligero de cursos + versión del service worker (falla el build si algún curso tiene errores)
RUN node herramientas/indice.js \
    && addgroup -S catappa && adduser -S catappa -G catappa \
    && mkdir -p /data && chown catappa:catappa /data

USER catappa

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/estado || exit 1

CMD ["node", "server/server.js"]
