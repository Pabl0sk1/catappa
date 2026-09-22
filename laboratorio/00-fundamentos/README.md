# Módulo 00 — Fundamentos: qué es Docker de verdad

Tiempo: 45 minutos. Objetivo: que puedas explicar qué es un contenedor sin
decir "es como una máquina virtual ligera" (esa respuesta suspende).

---

## 1. El problema que resuelve

"En mi máquina funciona." Una aplicación necesita: código, runtime (JDK 21),
librerías del sistema, variables de entorno, una versión concreta de Postgres...
Si el servidor tiene otra versión de algo, revienta.

Docker empaqueta **la aplicación + todo lo que necesita para ejecutarse** en
una unidad que se ejecuta igual en tu portátil, en el CI y en producción.

Además resuelve el **aislamiento**: cinco aplicaciones en el mismo servidor sin
que se pisen las dependencias, y sin el coste de cinco máquinas virtuales.

---

## 2. Contenedor vs máquina virtual (pregunta clásica de entrevista)

```
   MÁQUINA VIRTUAL                        CONTENEDOR
+---------+---------+                 +---------+---------+
|  App A  |  App B  |                 |  App A  |  App B  |
+---------+---------+                 +---------+---------+
| Libs    | Libs    |                 | Libs    | Libs    |
+---------+---------+                 +---------+---------+
| SO      | SO      |  <- 2 kernels   |   Docker Engine   |
| invitado| invitado|     completos   +-------------------+
+---------+---------+                 |  SO anfitrion     |  <- 1 solo kernel
|    Hipervisor     |                 |  (kernel Linux)   |
+-------------------+                 +-------------------+
|  SO anfitrion     |                 |    Hardware       |
+-------------------+                 +-------------------+
|    Hardware       |
+-------------------+
```

**La frase para la entrevista:**
> Una máquina virtual virtualiza *hardware*: cada VM lleva su propio kernel y
> su propio sistema operativo completo, arranca en minutos y pesa gigas.
> Un contenedor virtualiza el *sistema operativo*: todos los contenedores
> comparten el kernel del anfitrión y solo aíslan procesos, red y sistema de
> ficheros. Arranca en milisegundos y pesa megas. A cambio, un contenedor
> Linux necesita un kernel Linux, mientras que una VM puede ejecutar cualquier SO.

---

## 3. Un contenedor NO es magia: es un proceso Linux

Esto separa a un candidato bueno de uno mediocre. Un contenedor es **un proceso
normal del kernel Linux** al que se le han aplicado tres cosas:

| Mecanismo | Qué hace | Ejemplo |
|-----------|----------|---------|
| **namespaces** | Aíslan *lo que el proceso ve* | `pid` (solo ve sus procesos), `net` (su propia IP y puertos), `mnt` (su propio filesystem), `uts` (su propio hostname), `ipc`, `user` |
| **cgroups** (control groups) | Limitan *lo que el proceso consume* | máximo 512 MB de RAM, 0.5 CPU |
| **union filesystem** (overlay2) | Monta el filesystem como capas de solo lectura + una capa de escritura | las capas de la imagen |

> Si te preguntan "¿cómo aísla Docker?": *namespaces para la visibilidad,
> cgroups para los recursos y overlayfs para el sistema de ficheros.*

**Consecuencia práctica:** si haces `ps aux` en la máquina Linux anfitriona
mientras corre un contenedor, **ves el proceso**. No está "dentro" de nada:
solo tiene una vista recortada de la realidad.

---

## 4. Imagen vs contenedor

| Imagen | Contenedor |
|--------|------------|
| Plantilla **inmutable**, de solo lectura | Instancia **en ejecución** de una imagen |
| Se construye con `docker build` desde un `Dockerfile` | Se crea con `docker run` desde una imagen |
| Como una *clase* en Java | Como un *objeto* de esa clase |
| Se publica en un **registry** (Docker Hub) | Vive en tu máquina y se puede borrar |

De una sola imagen puedes arrancar 50 contenedores a la vez.

---

## 5. Capas (layers) — clave para el módulo 03

Una imagen está formada por **capas apiladas de solo lectura**. Cada
instrucción del Dockerfile que modifica el filesystem crea una capa nueva.

```
+------------------------------+
| capa de escritura (contenedor)|  <- efimera: muere con el contenedor
+------------------------------+
| COPY app.jar                 |   \
+------------------------------+    |
| RUN apt-get install curl     |    |- imagen (solo lectura, compartida)
+------------------------------+    |
| FROM eclipse-temurin:21-jre  |   /
+------------------------------+
```

Tres consecuencias que debes saber explicar:

1. **Las capas se cachean.** Si no cambia una instrucción ni los ficheros que
   toca, Docker reutiliza la capa y no la vuelve a ejecutar. De ahí que el
   orden del Dockerfile importe tanto (módulo 03).
2. **Las capas se comparten entre imágenes.** Diez imágenes basadas en
   `eclipse-temurin:21-jre` guardan esa capa **una sola vez** en disco.
3. **Lo que escribe el contenedor va a la capa de escritura y se pierde al
   borrarlo.** Por eso existen los volúmenes (módulo 06).

---

## 6. Arquitectura de Docker

```
  tu escribes            habla por API REST           hace el trabajo real
+------------+   ----------------------------->  +----------------------+
| docker CLI |                                   |  dockerd (daemon)    |
+------------+   <-----------------------------  |  - construye imagenes|
                    socket /var/run/docker.sock   |  - corre contenedores|
                                                  |  - gestiona redes    |
                                                  +----------+-----------+
                                                             | pull/push
                                                  +----------v-----------+
                                                  | Registry (Docker Hub)|
                                                  +----------------------+
```

- **Docker CLI**: el comando `docker`. Solo manda órdenes.
- **Docker daemon (`dockerd`)**: el servicio que realmente crea contenedores.
- **containerd / runc**: por debajo, quienes hablan con el kernel. Mencionarlo
  suma puntos; no necesitas más detalle.
- **Registry**: almacén de imágenes. Docker Hub es el público por defecto.

**En Windows** (tu caso): Docker Desktop ejecuta el daemon dentro de una
máquina virtual Linux ligera vía **WSL 2**. Por eso tienes `Ubuntu-22.04` y
`docker-desktop` en `wsl -l -v`. Tus contenedores Linux corren sobre ese kernel
Linux, no sobre Windows. **Esa es la relación Docker ↔ Linux, y te la pueden
preguntar.**

---

## 7. Vocabulario que debes usar bien

| Término | Significado en una frase |
|---------|--------------------------|
| **Imagen** | Plantilla inmutable con la app y sus dependencias |
| **Contenedor** | Instancia en ejecución de una imagen |
| **Dockerfile** | Receta de texto para construir una imagen |
| **Registry** | Servidor donde se publican y descargan imágenes |
| **Tag** | Etiqueta de versión de una imagen: `mi-api:1.2.0` |
| **Volumen** | Almacenamiento persistente gestionado por Docker |
| **Bind mount** | Carpeta del anfitrión montada dentro del contenedor |
| **Red bridge** | Red virtual privada donde los contenedores se ven por nombre |
| **Compose** | Herramienta para definir varios contenedores en un YAML |
| **Orquestador** | Kubernetes / Swarm: gestiona contenedores en muchas máquinas |

---

## Checklist antes de pasar al módulo 01

Contéstalas en voz alta. Si dudas en alguna, relee la sección.

1. ¿Por qué un contenedor arranca en milisegundos y una VM en minutos?
2. ¿Qué tres mecanismos del kernel Linux hacen posible un contenedor?
3. ¿Puedes ejecutar un contenedor Linux sobre Windows? ¿Cómo?
4. ¿Dónde se pierden los datos que escribe un contenedor y por qué?
5. Diferencia entre imagen y contenedor, con una analogía de programación.
6. ¿Qué es `dockerd` y quién le habla?

> Respuestas resumidas: 1) comparte el kernel, no arranca un SO entero.
> 2) namespaces, cgroups, overlayfs. 3) Sí, pero por debajo hay un kernel Linux
> (WSL2 o una VM). 4) En la capa de escritura, que muere con el contenedor.
> 5) Clase vs objeto. 6) El daemon que crea los contenedores; le habla el CLI
> por su API REST a través del socket.
