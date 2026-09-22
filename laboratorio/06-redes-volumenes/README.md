# Módulo 06 — Redes y volúmenes

Tiempo: 1 hora. Son los dos temas donde más se nota si has usado Docker de
verdad o solo lo has leído.

---

# PARTE A — REDES

## 1. Los drivers de red

| Driver | Qué hace | Cuándo se usa |
|---|---|---|
| **bridge** | Red virtual privada en el host. **Por defecto.** Cada contenedor recibe una IP interna y sale a internet por NAT | Casi siempre |
| **host** | El contenedor usa **directamente** la red del host: sin aislamiento, sin `-p` | Rendimiento extremo, herramientas de red. **No funciona igual en Docker Desktop Windows/Mac** |
| **none** | Sin red | Procesos aislados por seguridad |
| **overlay** | Red entre **varios hosts** | Swarm / clústeres |
| **macvlan** | El contenedor aparece con MAC propia en la LAN física | Integración con redes existentes |

## 2. Bridge por defecto vs bridge personalizada (pregunta muy frecuente)

```powershell
docker network ls          # bridge, host, none + las tuyas
```

- La red `bridge` **por defecto**: los contenedores se ven por IP, **pero no
  por nombre**. Es la antigua, con `--link` (obsoleto).
- Una red bridge **que creas tú**: incluye **DNS interno**, así que los
  contenedores se resuelven **por nombre**. Es la recomendada, y es lo que
  Compose crea automáticamente para cada proyecto.

Compruébalo:

```powershell
# En la red por defecto: sin DNS
docker run -d --name a nginx:alpine
docker run --rm alpine ping -c1 a          # falla: "bad address 'a'"

# En una red propia: con DNS
docker network create mired
docker run -d --name b --network mired nginx:alpine
docker run --rm --network mired alpine ping -c1 b   # responde
```

Limpieza: `docker rm -f a b` y `docker network rm mired`.

## 3. Publicar puertos

```
-p 8080:80        host 8080  ->  contenedor 80
-p 127.0.0.1:8080:80   solo accesible desde la propia maquina (mas seguro)
-p 80             puerto aleatorio del host -> 80
-P                publica todos los EXPOSE en puertos aleatorios
```

Dentro de la red interna **no hace falta publicar nada**: en el módulo 05 la
API llega a Postgres por el puerto 5432 sin que esté publicado al host. Esa es
la respuesta a *"¿por qué no expones la base de datos?"*.

## 4. Cómo llegar al host desde un contenedor

Desde dentro, `localhost` es el propio contenedor. Para hablar con la máquina
anfitriona se usa el nombre especial:

```
host.docker.internal        # Docker Desktop (Windows/Mac)
```

## 5. Comandos de red

```powershell
docker network ls
docker network create --driver bridge mired
docker network inspect mired            # que contenedores hay y con que IP
docker network connect mired micontenedor
docker network disconnect mired micontenedor
docker network rm mired
docker network prune
```

## 6. Lab de red: aislar la base de datos con dos redes

Esta es la arquitectura que quieres poder dibujar en la pizarra:

```
   Internet
      |
   [nginx]  <- red "frontend"
      |
    [api]   <- en AMBAS redes
      |
    [db]    <- red "backend" (sin salida ni entrada desde fuera)
```

En YAML:

```yaml
services:
  nginx:
    networks: [frontend]
  api:
    networks: [frontend, backend]
  db:
    networks: [backend]
networks:
  frontend:
  backend:
    internal: true      # sin acceso a internet: aislamiento real
```

**Resultado:** nginx no puede hablar con la base de datos aunque lo intente.
Eso es segmentación de red, y suena muy bien en una entrevista de DevOps.

---

# PARTE B — VOLÚMENES Y PERSISTENCIA

## 1. El problema

La capa de escritura del contenedor **muere con el contenedor**. Si tu Postgres
guarda ahí, un `docker rm` borra la base de datos entera.

## 2. Las tres formas de persistir

| Tipo | Sintaxis | Dónde vive | Cuándo usarlo |
|---|---|---|---|
| **Named volume** | `-v pgdata:/var/lib/postgresql/data` | Lo gestiona Docker (`/var/lib/docker/volumes/`) | **Datos de producción**: bases de datos, uploads |
| **Bind mount** | `-v C:\proyecto:/app` o `-v .\conf:/etc/nginx:ro` | Una carpeta tuya del host | **Desarrollo** (hot reload) y ficheros de configuración |
| **tmpfs** | `--tmpfs /tmp` | En RAM, se pierde siempre | Datos sensibles o temporales |

Para la entrevista:
> Named volume = Docker gestiona la ruta, es portable, funciona igual en
> cualquier host y se respalda con `docker run --rm -v ...`. Bind mount = yo
> elijo la ruta del host, depende de esa máquina y de sus permisos; perfecto
> para desarrollo, mala idea para datos de producción.

## 3. Lab de volúmenes

```powershell
# Named volume
docker volume create datos
docker run --rm -v datos:/data alpine sh -c "echo 'persisto' > /data/f.txt"
docker run --rm -v datos:/data alpine cat /data/f.txt     # "persisto"
docker volume inspect datos
docker volume ls

# Bind mount: monta ESTA carpeta dentro del contenedor
docker run --rm -v "${PWD}:/host" alpine ls /host
```

En PowerShell usa `${PWD}`; en Git Bash, `$(pwd)`.

**Solo lectura** (buena práctica para configuración):

```powershell
docker run --rm -v "${PWD}:/host:ro" alpine sh -c "touch /host/x"
# -> Read-only file system
```

### Bind mount para desarrollo con hot reload

```yaml
services:
  api:
    volumes:
      - ./src:/app/src          # editas en Windows, el contenedor lo ve al instante
```

Eso es lo que hace que un `docker compose` de desarrollo sea cómodo: no
reconstruyes la imagen en cada cambio.

## 4. Backup y restauración de un volumen (pregunta de DevOps)

```powershell
# BACKUP: monto el volumen y la carpeta actual, y hago tar
docker run --rm -v pgdata:/datos -v "${PWD}:/backup" alpine `
  tar czf /backup/pgdata-backup.tar.gz -C /datos .

# RESTAURAR en un volumen nuevo
docker volume create pgdata_restaurado
docker run --rm -v pgdata_restaurado:/datos -v "${PWD}:/backup" alpine `
  sh -c "tar xzf /backup/pgdata-backup.tar.gz -C /datos"
```

Para una base de datos, lo correcto es un dump lógico:

```powershell
docker compose exec db pg_dump -U tareas_user tareas > backup.sql
```

## 5. Comandos de volúmenes

```powershell
docker volume ls
docker volume create X
docker volume inspect X
docker volume rm X
docker volume prune          # borra los que no usa nadie  (CUIDADO)
docker system df -v          # cuanto ocupa cada volumen
```

---

## Ejercicios

1. Crea una red `lab` y dos contenedores nginx que se vean por nombre.
   Demuestra que fuera de esa red no se ven.
2. Levanta un Postgres con un named volume, crea una tabla, borra el
   contenedor con `-f`, vuelve a levantarlo con el mismo volumen y comprueba
   que la tabla sigue.
3. Monta esta carpeta en un contenedor alpine en **solo lectura** y demuestra
   que no puedes escribir.
4. Haz un backup del volumen `pgdata` del módulo 05 a un `.tar.gz`.
5. Averigua la IP interna de los tres contenedores del módulo 05
   (`docker network inspect practica-docker_backend`).
6. Publica un nginx **solo** en `127.0.0.1:8080` y razona qué ganas con ello.

<details>
<summary>Soluciones</summary>

```powershell
# 1
docker network create lab
docker run -d --name n1 --network lab nginx:alpine
docker run -d --name n2 --network lab nginx:alpine
docker exec n1 ping -c1 n2                 # OK
docker run --rm alpine ping -c1 n2         # falla: otra red
docker rm -f n1 n2; docker network rm lab

# 2
docker volume create pgtest
docker run -d --name pg -e POSTGRES_PASSWORD=x -v pgtest:/var/lib/postgresql/data postgres:16-alpine
docker exec pg psql -U postgres -c "CREATE TABLE prueba(id int);"
docker rm -f pg
docker run -d --name pg -e POSTGRES_PASSWORD=x -v pgtest:/var/lib/postgresql/data postgres:16-alpine
docker exec pg psql -U postgres -c "\dt"   # prueba sigue ahi
docker rm -f pg; docker volume rm pgtest

# 6
docker run -d -p 127.0.0.1:8080:80 nginx:alpine
# Solo accesible desde la propia maquina: nadie de la red lo alcanza.
# Tipico para servicios internos que expones via tunel SSH o reverse proxy.
```
</details>

---

## Preguntas de entrevista de este módulo

- ¿Diferencia entre named volume y bind mount? ¿Cuándo cada uno?
- ¿Qué pasa con los datos de un contenedor cuando lo borras?
- ¿Cómo se comunican dos contenedores por nombre y qué red lo permite?
- ¿Qué hace `-p 8080:80`? ¿Y `-p 127.0.0.1:8080:80`?
- ¿Qué driver de red usarías para que la base de datos no sea accesible desde
  fuera? (*bridge interna, sin `ports`, con `internal: true`*)
- ¿Cómo harías backup de los datos de un contenedor?
- ¿Qué es una red `overlay`?
