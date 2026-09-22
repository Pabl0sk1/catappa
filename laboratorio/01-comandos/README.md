# Módulo 01 — Comandos básicos (laboratorio)

Tiempo: 60 minutos. **Este módulo se hace ejecutando, no leyendo.** Abre la
terminal y ve copiando bloque a bloque, mirando la salida de cada uno.

---

## Lab 1 — Tu primer contenedor

```powershell
docker run hello-world
```

Qué acaba de pasar, en orden (te lo pueden preguntar tal cual):

1. El CLI pide al daemon un contenedor de la imagen `hello-world`.
2. El daemon no la tiene en local, así que hace `pull` desde Docker Hub.
3. Crea un contenedor a partir de esa imagen.
4. Ejecuta su proceso, que imprime el mensaje.
5. El proceso termina, y con él el contenedor (queda en estado `Exited`).

```powershell
docker ps            # contenedores EN EJECUCION -> aparece vacio
docker ps -a         # TODOS, incluidos los parados -> ahi esta hello-world
docker images        # imagenes descargadas en tu maquina
```

**Regla clave:** un contenedor vive mientras viva su **proceso principal**
(PID 1). Si ese proceso termina, el contenedor se para. No es una VM que "está
encendida".

---

## Lab 2 — Un contenedor interactivo (aquí se entiende todo)

```powershell
docker run -it --name prueba ubuntu:22.04 bash
```

- `-i` = interactive (mantiene STDIN abierto)
- `-t` = TTY (terminal). Casi siempre van juntos: `-it`.
- `--name prueba` = le pones nombre en vez de uno aleatorio.
- `ubuntu:22.04` = imagen:tag.
- `bash` = el comando a ejecutar **en lugar** del comando por defecto.

Ya estás dentro de un Ubuntu. Prueba:

```bash
whoami              # root
hostname            # un hash: es el ID del contenedor
ls /                # un filesystem Linux completo
cat /etc/os-release # Ubuntu 22.04, aunque tu PC es Windows
ps aux              # SOLO ves bash y ps -> namespace de PID
touch /hola.txt     # escribes en la capa de escritura
exit                # termina bash -> el contenedor se para
```

Ahora comprueba que el fichero se perdió... o no:

```powershell
docker ps -a                       # prueba esta Exited
docker start -ai prueba            # lo vuelves a arrancar y te reconectas
ls /hola.txt                       # ¡SIGUE AHI!  (mismo contenedor, misma capa)
exit
docker rm prueba                   # borras el contenedor
docker run -it --name prueba ubuntu:22.04 bash
ls /hola.txt                       # "No such file" -> contenedor NUEVO, capa nueva
exit
```

**Esta es la lección más importante del módulo:** los datos sobreviven a un
`stop/start`, pero **no** a un `rm`. Un contenedor nuevo de la misma imagen
empieza siempre limpio.

```powershell
docker rm prueba
```

---

## Lab 3 — Un servicio de verdad en segundo plano

```powershell
docker run -d --name web -p 8080:80 nginx:alpine
```

- `-d` = detached (segundo plano, te devuelve el prompt).
- `-p 8080:80` = **puerto_del_host : puerto_del_contenedor**. Memoriza el
  orden: *"fuera:dentro"*. Es una pregunta de entrevista con trampa.

Abre http://localhost:8080 en el navegador. Ahí tienes nginx.

```powershell
docker ps                     # ahora si aparece, con STATUS "Up"
docker logs web               # logs del proceso principal (STDOUT/STDERR)
docker logs -f web            # en vivo; recarga el navegador y miralo. Ctrl+C para salir
docker inspect web            # TODO en JSON: IP, montajes, env, red...
docker stats --no-stream      # CPU y RAM que consume (esto es cgroups en accion)
docker top web                # procesos dentro del contenedor
```

**Entrar en un contenedor que ya corre** (esto lo harás a diario):

```powershell
docker exec -it web sh
# dentro:
ls /usr/share/nginx/html
cat /usr/share/nginx/html/index.html
echo "<h1>Hola Pablo</h1>" > /usr/share/nginx/html/index.html
exit
```

Recarga el navegador: cambió. Acabas de modificar la capa de escritura.

> `docker run` crea un contenedor NUEVO. `docker exec` entra en uno que YA
> está corriendo. Confundirlos es el error número uno de los principiantes.

Limpieza:

```powershell
docker stop web        # manda SIGTERM, espera 10s, luego SIGKILL
docker rm web          # borra el contenedor
# o en un paso:  docker rm -f web
```

---

## Lab 4 — Variables de entorno y limpieza automática

```powershell
docker run --rm -e MI_VAR="hola entrevista" alpine env
```

- `--rm` = borra el contenedor al terminar. Úsalo siempre en pruebas.
- `-e CLAVE=valor` = variable de entorno. Es **la** forma de configurar un
  contenedor (puertos, credenciales, perfiles de Spring...).

```powershell
docker run --rm alpine echo "hola"
docker run --rm alpine ls /
docker run --rm -e SPRING_PROFILES_ACTIVE=prod alpine env
```

---

## Lab 5 — Una base de datos en 10 segundos (esto impresiona)

```powershell
docker run -d --name pg -e POSTGRES_PASSWORD=secreto -p 5432:5432 postgres:16-alpine
docker logs pg
docker exec -it pg psql -U postgres -c "SELECT version();"
docker rm -f pg
```

Argumento de venta para la entrevista: *"levanto la base de datos exacta de
producción en 10 segundos, sin instalar nada, y la borro sin dejar rastro."*

---

## Chuleta de comandos del módulo

### Ciclo de vida
| Comando | Qué hace |
|---------|----------|
| `docker run IMG` | crear + arrancar un contenedor nuevo |
| `docker start / stop / restart NOMBRE` | arrancar / parar / reiniciar uno existente |
| `docker pause / unpause NOMBRE` | congelar procesos (cgroup freezer) |
| `docker rm NOMBRE` | borrar un contenedor parado (`-f` fuerza) |
| `docker kill NOMBRE` | SIGKILL inmediato (sin los 10s de cortesía) |

### Flags de `docker run` que debes saber de memoria
| Flag | Significado |
|------|-------------|
| `-d` | segundo plano |
| `-it` | interactivo con terminal |
| `--rm` | autoborrado al salir |
| `--name X` | nombre fijo |
| `-p 8080:80` | publicar puerto host:contenedor |
| `-e K=V` | variable de entorno |
| `--env-file .env` | variables desde fichero |
| `-v datos:/var/lib/postgresql/data` | volumen |
| `--network mired` | conectar a una red |
| `-w /app` | directorio de trabajo |
| `-u 1000:1000` | usuario/grupo |
| `--restart unless-stopped` | reinicio automático |
| `-m 512m --cpus 0.5` | límites de recursos (cgroups) |

### Inspección y depuración
| Comando | Uso |
|---------|-----|
| `docker ps` / `docker ps -a` | listar en ejecución / todos |
| `docker logs -f --tail 100 X` | ver logs |
| `docker exec -it X sh` | entrar en un contenedor vivo |
| `docker inspect X` | JSON completo |
| `docker stats` | consumo en vivo |
| `docker top X` | procesos internos |
| `docker port X` | mapeo de puertos |
| `docker diff X` | ficheros cambiados respecto a la imagen |
| `docker cp X:/ruta ./local` | copiar ficheros dentro/fuera |

### Imágenes
| Comando | Uso |
|---------|-----|
| `docker images` | listar |
| `docker pull img:tag` | descargar |
| `docker rmi img` | borrar |
| `docker tag a b` | poner otro nombre/tag |
| `docker history img` | ver las capas y su peso |
| `docker save/load` | exportar/importar a .tar |

### Limpieza (pregunta habitual: "se me llenó el disco")
```powershell
docker system df           # cuanto ocupa cada cosa
docker container prune     # borra contenedores parados
docker image prune         # borra imagenes huerfanas (dangling)
docker image prune -a      # borra TODA imagen sin contenedor asociado
docker volume prune        # borra volumenes sin usar  (CUIDADO: datos)
docker system prune -a --volumes   # la bomba nuclear
```

---

## Ejercicios (hazlos sin mirar arriba)

1. Levanta un nginx llamado `ej1` accesible en el puerto **9090** del host.
2. Entra en él y cambia la home por `<h1>Ejercicio 1</h1>`. Compruébalo en el navegador.
3. Mira sus logs en vivo mientras recargas la página.
4. Averigua **la IP interna** del contenedor (pista: `docker inspect`).
5. Arranca un `redis:alpine` en segundo plano, ejecuta `redis-cli PING` dentro
   y comprueba que responde `PONG`.
6. Limita un contenedor a 256 MB de RAM y compruébalo con `docker stats`.
7. Borra todo lo que has creado y deja `docker ps -a` vacío.

<details>
<summary>Soluciones</summary>

```powershell
# 1
docker run -d --name ej1 -p 9090:80 nginx:alpine
# 2
docker exec -it ej1 sh -c "echo '<h1>Ejercicio 1</h1>' > /usr/share/nginx/html/index.html"
# 3
docker logs -f ej1
# 4
docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" ej1
# 5
docker run -d --name cache redis:alpine
docker exec -it cache redis-cli PING
# 6
docker run -d --name limitado -m 256m nginx:alpine
docker stats --no-stream limitado
# 7
docker rm -f ej1 cache limitado
```
</details>

---

## Preguntas de entrevista de este módulo

- ¿Qué diferencia hay entre `docker run` y `docker start`?
- En `-p 8080:80`, ¿cuál es el puerto del host?
- ¿Por qué un contenedor se para solo nada más arrancar?
  (*porque su proceso principal terminó; ej. le pasaste un comando que acaba*)
- ¿Cómo entras en un contenedor que ya está corriendo? ¿Y si no tiene `bash`?
  (*`docker exec -it X sh`; las imágenes alpine solo traen `sh`*)
- ¿Qué hace exactamente `docker stop`? (*SIGTERM, espera 10 s, SIGKILL*)
- ¿Cómo ves por qué se cayó un contenedor? (*`docker logs`, `docker ps -a` para
  el exit code, `docker inspect`*)
