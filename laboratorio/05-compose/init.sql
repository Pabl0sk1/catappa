-- Postgres ejecuta automáticamente los .sql de /docker-entrypoint-initdb.d
-- LA PRIMERA VEZ que se crea el volumen de datos (y solo esa vez).
-- Si cambias este fichero, hace falta: docker compose down -v && docker compose up -d

CREATE TABLE IF NOT EXISTS tareas (
    id         BIGSERIAL PRIMARY KEY,
    titulo     VARCHAR(255) NOT NULL,
    completada BOOLEAN      NOT NULL DEFAULT FALSE
);

INSERT INTO tareas (titulo, completada) VALUES
    ('Estudiar Dockerfile', TRUE),
    ('Practicar docker compose', FALSE),
    ('Repasar preguntas de entrevista', FALSE);
