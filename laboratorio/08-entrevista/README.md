# Módulo 08 — Preparación de la entrevista

60 preguntas con respuesta corta (la que dirías en voz alta), 8 escenarios de
depuración en [`escenarios-debug.md`](escenarios-debug.md) y un simulacro final.

**Cómo usarlo:** tapa la respuesta, contesta en voz alta, y solo entonces mira.
Marca con ✗ las que falles y repásalas el martes por la mañana.

---

## A. Conceptos (1-12)

**1. ¿Qué es Docker?**
Una plataforma para empaquetar una aplicación y todas sus dependencias en una
imagen, y ejecutarla de forma aislada y reproducible como contenedor en
cualquier máquina con un runtime de contenedores.

**2. ¿Contenedor vs máquina virtual?**
La VM virtualiza hardware y lleva su propio kernel y SO completo: pesada, lenta
de arrancar, aislamiento total. El contenedor virtualiza el SO: comparte el
kernel del host, aísla procesos con namespaces y limita recursos con cgroups.
Arranca en milisegundos y pesa megas.

**3. ¿Qué tecnologías del kernel usa?**
Namespaces (pid, net, mnt, uts, ipc, user) para aislar lo que el proceso ve;
cgroups para limitar CPU/RAM/IO; y un union filesystem (overlay2) para las capas.

**4. ¿Imagen vs contenedor?**
La imagen es una plantilla inmutable de solo lectura; el contenedor es una
instancia en ejecución de esa imagen, con una capa de escritura encima. Clase
vs objeto.

**5. ¿Qué es una capa?**
Cada instrucción del Dockerfile que modifica el filesystem genera una capa de
solo lectura. Se cachean, se reutilizan entre imágenes y se apilan con overlay.

**6. ¿Qué es un registry?**
El almacén de imágenes (Docker Hub, GHCR, ECR, Harbor). `push` para publicar,
`pull` para descargar.

**7. ¿Qué es Docker Hub?**
El registry público por defecto.

**8. ¿Arquitectura de Docker?**
CLI → API REST → daemon (`dockerd`) → containerd → runc → kernel. El daemon
construye imágenes, corre contenedores y gestiona redes y volúmenes.

**9. ¿Docker funciona en Windows?**
Sí, con Docker Desktop, que ejecuta el daemon dentro de una VM Linux ligera
(WSL 2). Los contenedores Linux necesitan siempre un kernel Linux. También
existen contenedores Windows nativos, más raros.

**10. ¿Qué es Docker Desktop?**
La aplicación de escritorio que incluye el motor (sobre WSL2/Hyper-V/HyperKit),
la CLI, Compose, Kubernetes opcional e interfaz gráfica.

**11. ¿Qué es OCI?**
Open Container Initiative: el estándar de formato de imagen y runtime. Por eso
Podman, containerd o Kubernetes pueden usar las mismas imágenes.

**12. ¿Cuándo NO usarías Docker?**
Aplicaciones de escritorio con GUI pesada, cargas que necesitan acceso directo
a hardware específico, o casos donde se requiere aislamiento de seguridad
total: ahí una VM sigue siendo mejor.

---

## B. Comandos (13-24)

**13. ¿`docker run` vs `docker start`?**
`run` crea un contenedor nuevo desde una imagen; `start` rearranca uno que ya
existe y está parado.

**14. ¿`docker exec` vs `docker attach`?**
`exec` lanza un proceso nuevo dentro del contenedor (lo normal: `exec -it X sh`).
`attach` te conecta al proceso principal, y si sales mal puedes pararlo.

**15. En `-p 8080:80`, ¿qué es cada número?**
`host:contenedor`. 8080 es el del host.

**16. ¿Qué hace `docker stop`?**
Envía SIGTERM al PID 1, espera 10 segundos de gracia y luego SIGKILL.
`docker kill` manda SIGKILL directamente.

**17. ¿Por qué mi contenedor se para nada más arrancar?**
Porque su proceso principal terminó. Un contenedor vive mientras viva PID 1:
un `ls` o una app que casca en el arranque terminan inmediatamente.
Se diagnostica con `docker logs` y el exit code de `docker ps -a`.

**18. ¿Cómo ves los logs?**
`docker logs -f --tail 100 nombre`. La aplicación debe escribir a stdout/stderr,
no a ficheros.

**19. ¿Cómo entras en un contenedor sin bash?**
`docker exec -it X sh` (las imágenes alpine solo traen `sh`). Si no hay ninguna
shell (imagen distroless), se depura con `docker debug`, `docker cp`,
`docker inspect` o un contenedor efímero con `--pid container:X`.

**20. ¿Cómo copias un fichero dentro/fuera?**
`docker cp fichero X:/ruta` y al revés.

**21. ¿Cómo limitas recursos?**
`docker run -m 512m --cpus 0.5` o en compose con
`deploy.resources.limits`. Por debajo son cgroups.

**22. ¿Cómo liberas espacio?**
`docker system df` para ver, y `docker system prune -a` (con cuidado);
`image prune`, `container prune`, `volume prune` por separado.

**23. ¿Qué hace `--rm`?**
Borra el contenedor automáticamente al terminar. Ideal para pruebas.

**24. ¿Cómo ves la configuración completa de un contenedor?**
`docker inspect nombre` (JSON: red, IPs, volúmenes, variables, healthcheck...).

---

## C. Dockerfile (25-38)

**25. ¿Qué es un Dockerfile?**
El fichero de texto con las instrucciones para construir una imagen, de forma
reproducible y versionable en git.

**26. ¿`COPY` vs `ADD`?**
`COPY` solo copia. `ADD` además descomprime tars y admite URLs. Se recomienda
`COPY` por ser explícito y predecible.

**27. ¿`CMD` vs `ENTRYPOINT`?**
`ENTRYPOINT` define el ejecutable fijo; `CMD` sus argumentos por defecto (o el
comando entero si no hay ENTRYPOINT). Lo que pasas en `docker run` sustituye al
CMD, no al ENTRYPOINT (salvo `--entrypoint`).

**28. ¿Forma exec vs forma shell?**
Exec = lista JSON: el proceso es PID 1 y recibe las señales → apagado elegante.
Shell = cadena: arranca `/bin/sh -c`, y la shell se come el SIGTERM.

**29. ¿Qué hace `EXPOSE`?**
Solo documenta el puerto. **No** publica nada; publicar es `-p` o `ports:`.

**30. ¿`ARG` vs `ENV`?**
`ARG` solo existe durante el build (`--build-arg`); `ENV` persiste en la imagen
y en el contenedor. Ninguno de los dos sirve para secretos: quedan registrados
en la imagen o en su historia.

**31. ¿Cómo funciona la caché de capas?**
Docker reutiliza una capa si la instrucción y el contexto que copia no han
cambiado. Al invalidarse una, se invalidan todas las siguientes. Por eso se
copian primero los ficheros de dependencias y luego el código.

**32. ¿Qué es un multi-stage build?**
Varias etapas `FROM` en el mismo Dockerfile: una compila (JDK + Maven) y la
final solo copia el artefacto sobre una imagen mínima (JRE). Imagen más pequeña
y sin herramientas de build ni código fuente en producción.

**33. ¿Cómo reduces el tamaño de una imagen?**
Multi-stage, base alpine/slim/distroless, `.dockerignore`, encadenar `RUN` y
limpiar cachés en la misma capa, no instalar paquetes innecesarios, y revisar
con `docker history`.

**34. ¿Para qué sirve `.dockerignore`?**
Excluir ficheros del contexto de build: builds más rápidos, imágenes más
pequeñas y evita filtrar `.git`, `.env` o credenciales.

**35. ¿Por qué no usar el tag `latest`?**
No es inmutable: el mismo Dockerfile puede dar imágenes distintas en fechas
distintas. Adiós reproducibilidad y rollback fiable.

**36. ¿Por qué no correr como root?**
Si se compromete la app, el atacante tiene root dentro del contenedor y más
posibilidades de escapar al host o escribir como root en volúmenes montados.
Se crea un usuario y se usa `USER`.

**37. ¿Cómo pasas un secreto al build?**
Con BuildKit: `RUN --mount=type=secret,id=token ...` y `docker build --secret`.
Nunca con ARG/ENV/COPY, porque quedan en las capas.

**38. ¿Qué es `HEALTHCHECK`?**
Un comando periódico que determina si la app está sana. Afecta al estado
`healthy/unhealthy` y permite `depends_on: condition: service_healthy` o que el
orquestador reinicie/retire la instancia.

---

## D. Compose, redes y volúmenes (39-50)

**39. ¿Qué es Docker Compose?**
Herramienta para definir y ejecutar aplicaciones multi-contenedor en una sola
máquina a partir de un YAML declarativo.

**40. ¿Cómo se comunican dos servicios?**
Compose crea una red bridge propia con DNS interno: cada servicio es alcanzable
por su nombre (`db:5432`).

**41. ¿Por qué `localhost` no funciona entre contenedores?**
Cada contenedor tiene su propio namespace de red: `localhost` es él mismo.

**42. ¿`depends_on` garantiza que la BD esté lista?**
No, solo el orden de arranque. Hay que usar `condition: service_healthy` con un
healthcheck, o reintentos de conexión en la aplicación.

**43. ¿`docker compose down` vs `down -v`?**
`down` borra contenedores y redes; `-v` borra además los volúmenes, es decir,
los datos.

**44. ¿Named volume vs bind mount?**
El volumen lo gestiona Docker, es portable y es lo adecuado para datos de
producción. El bind mount apunta a una carpeta concreta del host: ideal en
desarrollo (hot reload) y para ficheros de configuración.

**45. ¿Qué pasa con los datos al borrar un contenedor?**
Se pierde la capa de escritura. Solo sobrevive lo que esté en volúmenes o bind
mounts.

**46. ¿Cómo haces backup de un volumen?**
Un contenedor efímero que monta el volumen y hace `tar` a una carpeta del host;
para bases de datos, mejor un dump lógico (`pg_dump`).

**47. ¿Tipos de red?**
bridge (por defecto), host (sin aislamiento de red), none, overlay (multi-host)
y macvlan.

**48. ¿Cómo aíslas la base de datos?**
No publicarle puertos, ponerla en una red propia marcada como `internal: true`,
y que solo la API esté en las dos redes.

**49. ¿Cómo manejas configuración distinta por entorno?**
Variables de entorno + `.env` + varios ficheros compose
(`-f compose.yml -f compose.prod.yml`) o perfiles. Los secretos, fuera del repo.

**50. ¿Compose vale para producción?**
Para un solo servidor o entornos pequeños, sí (con restart policies, límites y
healthchecks). Para alta disponibilidad, escalado y varios nodos, Kubernetes.

---

## E. DevOps, despliegue y seguridad (51-60)

**51. ¿Cómo despliegas una app dockerizada?**
CI construye la imagen y la sube a un registry con un tag inmutable; el
servidor hace `pull` y `up -d` con ese tag. Rollback = volver al tag anterior.

**52. ¿Por qué no construir en producción?**
Consume recursos del servidor, no es reproducible y puedes desplegar algo
distinto a lo que se probó. El principio es *artefacto inmutable*: la misma
imagen que pasó los tests es la que se despliega.

**53. ¿Qué pasos tendría tu pipeline?**
Checkout → tests → build de la imagen → escaneo de vulnerabilidades → push al
registry con tag del commit → deploy → smoke test → monitorización.

**54. ¿Cómo garantizas que los contenedores arranquen tras un reinicio?**
`restart: unless-stopped` y, para el stack completo, una unidad systemd que
ejecuta `docker compose up -d`.

**55. ¿Para qué un reverse proxy delante?**
TLS centralizado, un único puerto público, balanceo entre réplicas, cabeceras,
caché y despliegues sin caída.

**56. ¿Cómo gestionas secretos?**
Fuera de la imagen y del repositorio: variables inyectadas en runtime, Docker
secrets/Swarm, o un gestor (Vault, AWS Secrets Manager). En el CI, secrets del
propio CI.

**57. ¿Cómo aseguras una imagen?**
Base mínima oficial con tag fijo, usuario no root, escaneo (Trivy,
`docker scout`), actualizaciones periódicas, `--cap-drop ALL`,
`no-new-privileges`, filesystem de solo lectura y límites de recursos.

**58. ¿Qué diferencia hay entre Compose y Kubernetes?**
Compose: multi-contenedor en **una** máquina, sin autorreparación. Kubernetes:
clúster multi-nodo con autoescalado, autocuración, rolling updates, service
discovery, ConfigMaps y Secrets. La imagen Docker es el mismo artefacto.

**59. ¿Qué es un pod?**
La unidad mínima de despliegue en Kubernetes: uno o varios contenedores que
comparten red y almacenamiento y se programan juntos.

**60. ¿Cómo monitorizas contenedores?**
Logs a stdout centralizados (Loki/ELK), métricas con Prometheus + Grafana
(Actuator expone `/actuator/prometheus`), cAdvisor para métricas por contenedor
y healthchecks + alertas.

---

## Simulacro final (20 minutos, en voz alta)

Hazlo el martes antes de salir. Cronometra 20 minutos y responde sin mirar:

1. Explícame qué es Docker y qué problema resuelve. *(2 min)*
2. Dibuja/describe en voz alta la diferencia con una VM. *(1 min)*
3. Escribe en un papel un Dockerfile multi-stage para una app Spring Boot. *(5 min)*
4. Explica cada línea de lo que has escrito. *(3 min)*
5. Escribe un compose con API + Postgres, red, volumen y healthcheck. *(5 min)*
6. Te digo: "la API no conecta con la base de datos". ¿Qué haces? *(2 min)*
7. ¿Cómo lo llevarías a un servidor y cómo harías rollback? *(2 min)*

Si completas esto sin mirar, vas preparado.

---

## Frases que suman puntos (úsalas si encaja)

- "Uso multi-stage para que la imagen de producción no lleve ni el JDK ni el
  código fuente: menos peso y menos superficie de ataque."
- "El contenedor corre con un usuario sin privilegios, nunca root."
- "`depends_on` solo ordena el arranque; para esperar a la base de datos uso un
  healthcheck con `condition: service_healthy`."
- "Prefiero tags inmutables por commit: hacen el rollback trivial."
- "La base de datos no publica puertos; vive en una red interna."
- "La configuración va por variables de entorno; la imagen es la misma en todos
  los entornos."
- "El `ENTRYPOINT` en forma exec asegura que Java sea PID 1 y reciba el SIGTERM
  para el apagado elegante."

## Y si no sabes algo

No improvises. Di: *"No lo he usado en producción, pero lo que entiendo es
esto... ¿va por ahí?"* Reconocer el límite y mostrar el modelo mental correcto
puntúa mucho más que inventar.
