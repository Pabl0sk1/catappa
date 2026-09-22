# Módulo 02 — El Linux que necesitas para Docker

Tiempo: 45 minutos. No necesitas ser administrador de sistemas. Necesitas
moverte dentro de un contenedor y entender **por qué** Docker y Linux son
inseparables.

Todo este módulo se practica **dentro de un contenedor**, así que no rompes nada:

```powershell
docker run -it --rm --name linuxlab ubuntu:22.04 bash
```

---

## 1. El filesystem de Linux

Linux no tiene `C:\`. Todo cuelga de la raíz `/`.

| Ruta | Qué contiene | Te importa porque... |
|------|--------------|----------------------|
| `/bin`, `/usr/bin` | ejecutables | ahí está `java`, `sh`, `curl` |
| `/etc` | configuración | `nginx.conf`, `/etc/passwd`, `/etc/hosts` |
| `/var/log` | logs | logs de servicios |
| `/var/lib` | datos de servicios | `/var/lib/postgresql/data` ← el volumen de Postgres |
| `/tmp` | temporales | se borra al reiniciar |
| `/home` | carpetas de usuario | |
| `/opt`, `/app` | software propio | por convención metemos ahí nuestra app |
| `/proc`, `/sys` | kernel virtual | `/proc/1/` es tu PID 1 |

Practica dentro del contenedor:

```bash
pwd                 # donde estoy
ls -la /            # listar con detalles y ocultos
cd /etc && ls
cat /etc/hosts      # ver un fichero
cat /etc/os-release
head -5 /etc/passwd # primeras 5 lineas
find / -name "*.conf" 2>/dev/null | head   # buscar
grep -r "root" /etc/passwd                 # buscar texto
df -h               # espacio en disco
free -h             # memoria (puede no existir en la imagen)
```

---

## 2. Comandos imprescindibles

```bash
# Ficheros y carpetas
mkdir -p /app/config          # crear (con padres)
touch /app/config/a.yml       # crear fichero vacio
cp a.yml b.yml                # copiar
mv b.yml c.yml                # mover / renombrar
rm -rf /app/config            # borrar recursivo y forzado
echo "hola" > f.txt           # escribir (sobrescribe)
echo "mas" >> f.txt           # anadir al final
cat f.txt                     # ver
tail -f /var/log/algo.log     # seguir un log en vivo

# Procesos
ps aux                        # procesos
kill -TERM 1                  # mandar senal
top                           # monitor

# Red (hay que instalarlos en imagenes minimas)
apt-get update && apt-get install -y curl iputils-ping net-tools
curl -I http://localhost
ping -c 2 8.8.8.8
netstat -tulpn                # puertos a la escucha
```

**Tubería y redirección**, que verás en todos los Dockerfiles:

```bash
ls -la | grep conf            # "|" pasa la salida de un comando al siguiente
comando > salida.txt          # redirige STDOUT a fichero
comando 2> error.txt          # redirige STDERR
comando > /dev/null 2>&1      # silencia todo
comando1 && comando2          # ejecuta el 2 solo si el 1 fue bien
```

---

## 3. Usuarios y permisos (esto SÍ cae en la entrevista)

```bash
whoami                # root por defecto dentro del contenedor
id                    # uid=0(root) gid=0(root)
ls -l /etc/passwd     # -rw-r--r-- 1 root root
```

Lectura de `-rw-r--r--`:

```
 -    rw-      r--      r--
tipo  dueño   grupo   otros
```
- `r` = 4 (leer), `w` = 2 (escribir), `x` = 1 (ejecutar).
- `chmod 755 script.sh` → dueño rwx(7), grupo r-x(5), otros r-x(5).
- `chmod +x entrypoint.sh` → hacerlo ejecutable. **Si tu `entrypoint.sh` falla
  con "permission denied", es esto.**
- `chown -R appuser:appgroup /app` → cambiar dueño.

**Por qué importa en Docker:** por defecto el contenedor corre como **root**, y
eso es un riesgo de seguridad. En un Dockerfile de producción se hace:

```dockerfile
RUN groupadd -r spring && useradd -r -g spring spring
USER spring
```

> Pregunta típica: *"¿Qué problema hay en correr contenedores como root?"*
> Respuesta: si alguien escapa del contenedor o explota la app, hereda root; y
> si montas un volumen del host, puede escribir ficheros como root en el host.
> Buena práctica: usuario no privilegiado, `--read-only`, `--cap-drop ALL`.

---

## 4. PID 1, señales y por qué muere tu contenedor

Dentro del contenedor:

```bash
ps aux
```

Tu proceso principal es **PID 1**. En Linux, PID 1 es especial:

- Si PID 1 muere, **el contenedor se para**. Siempre.
- PID 1 debe reenviar las señales y recoger procesos zombies.
- `docker stop` envía **SIGTERM** a PID 1. Si la app no lo captura en 10
  segundos, llega **SIGKILL** y se corta en seco (peticiones perdidas,
  transacciones a medias).

Esto explica dos cosas que verás en el módulo 03:

1. `CMD ["java","-jar","app.jar"]` (forma **exec**) hace que Java sea PID 1 y
   reciba SIGTERM → Spring Boot hace *graceful shutdown*.
   `CMD java -jar app.jar` (forma **shell**) arranca `/bin/sh -c ...`, y la
   shell es PID 1: **no** reenvía SIGTERM y tu app muere a lo bruto.
2. Por eso existe `--init` o `tini`: un PID 1 mínimo que gestiona señales.

> Es un detalle que muy pocos candidatos saben explicar. Suéltalo si puedes.

---

## 5. Variables de entorno

```bash
echo $PATH
export MI_VAR=hola
echo $MI_VAR
env                     # todas
```

En Docker son el mecanismo oficial de configuración (12-factor app):
`-e SPRING_DATASOURCE_URL=...`. Spring Boot las mapea automáticamente:
`SPRING_DATASOURCE_URL` → `spring.datasource.url`.

---

## 6. Por qué Docker necesita Linux

- Namespaces, cgroups y overlayfs son **funciones del kernel Linux**. No
  existen en Windows.
- Una imagen Linux solo puede correr sobre un kernel Linux.
- **En tu Windows 11**, Docker Desktop arranca una VM Linux ligera con WSL 2
  (`docker-desktop` en `wsl -l -v`) y ahí vive el daemon. Tú escribes `docker`
  en PowerShell, pero los contenedores corren sobre ese kernel Linux.
- Por eso las rutas de los bind mounts en Windows se traducen (`C:\proyecto` →
  `/mnt/c/proyecto`) y por eso el I/O es más rápido si el código está dentro de
  WSL.

Pruébalo:

```powershell
wsl -d Ubuntu-22.04 uname -a     # el kernel Linux real de tu maquina
docker run --rm alpine uname -a  # el contenedor ve ESE MISMO kernel
```

Las dos salidas comparten versión de kernel. **Ese es el argumento definitivo
de que el contenedor no lleva su propio SO.**

---

## Ejercicios

1. Entra en un `ubuntu:22.04`, instala `curl` y descarga `https://example.com`.
2. Crea `/app/datos/prueba.txt` con el texto `docker`, y muéstralo con `cat`.
3. Crea un script `/app/run.sh` que imprima "hola", hazlo ejecutable y ejecútalo.
4. Averigua qué proceso es el PID 1 en un contenedor de `nginx:alpine`.
5. Crea un usuario `appuser` y ejecuta un comando como ese usuario.

<details>
<summary>Soluciones</summary>

```bash
# 1
docker run -it --rm ubuntu:22.04 bash
apt-get update && apt-get install -y curl && curl https://example.com

# 2
mkdir -p /app/datos && echo "docker" > /app/datos/prueba.txt && cat /app/datos/prueba.txt

# 3
printf '#!/bin/sh\necho hola\n' > /app/run.sh && chmod +x /app/run.sh && /app/run.sh

# 4  (desde PowerShell)
docker run -d --name n nginx:alpine
docker exec n ps aux        # PID 1 = "nginx: master process"
docker rm -f n

# 5
useradd -m appuser && su appuser -c "whoami"
```
</details>

---

## Preguntas de entrevista de este módulo

- ¿Qué es PID 1 en un contenedor y por qué importa?
- ¿Qué señal manda `docker stop` y qué pasa si la app la ignora?
- ¿Por qué no deberías correr un contenedor como root y cómo lo evitas?
- ¿Cómo se ejecutan contenedores Linux en Windows?
- ¿Qué significa `chmod +x` y cuándo lo has necesitado en un Dockerfile?
