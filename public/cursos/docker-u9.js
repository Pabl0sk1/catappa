window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Depuración: cuando algo no funciona",
resumen: "El método para diagnosticar, y los diez fallos que más aparecen en el trabajo y en las entrevistas: contenedores que se paran, puertos ocupados, red, datos perdidos, permisos y ficheros rotos",
nivel: "Experto",
color: "#1f5fb8",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"dk9l1",
titulo:"El método: ver, leer, entrar",
claves:["1) docker ps -a para ver el estado y el código de salida","2) docker logs para leer lo que dijo la aplicación","3) docker inspect o docker exec para mirar dentro"],
pasos:[
 {t:"info", eti:"Antes de tocar nada", h:"Tres preguntas, siempre en este orden",
  c:`<p>Cuando algo falla con contenedores, la tentación es cambiar cosas al azar. El método es siempre el mismo:</p>
     <ol><li><b>¿Está vivo?</b> → <code>docker ps -a</code> (con <code>-a</code> también salen los parados y su código de salida).</li>
     <li><b>¿Qué dijo?</b> → <code>docker logs &lt;nombre&gt;</code>: la salida de la aplicación.</li>
     <li><b>¿Cómo está por dentro?</b> → <code>docker inspect &lt;nombre&gt;</code> (configuración real) o <code>docker exec -it &lt;nombre&gt; sh</code> (entrar).</li></ol>
     <div class="nota"><b class="tit">Dilo así en una entrevista</b>«Primero miro el estado con ps -a, luego los logs, y si hace falta entro con exec o miro inspect». Esa frase sola ya demuestra que has depurado contenedores de verdad.</div>`},
 {t:"orden", p:"Ordena el método de diagnóstico",
  items:["docker ps -a: ver estado y código de salida","docker logs: leer lo que dijo la aplicación","docker inspect o docker exec: mirar por dentro","Corregir la causa y volver a probar"],
  why:"Cada paso descarta una parte del problema."},
 {t:"info", eti:"Escenario 1", h:"«El contenedor se para nada más arrancar»",
  c:`<div class="termbox">$ docker ps -a
CONTAINER ID   IMAGE       STATUS                     NAMES
9f2c1a7b3e4d   api:1.0     Exited (1) 3 seconds ago   api</div>
     <p><b>Exited (1)</b> significa que el proceso principal terminó con error. Las causas típicas:</p>
     <ul><li>La aplicación falló al arrancar (por ejemplo, no encuentra la base de datos) → lo dirán los <b>logs</b>.</li>
     <li>El <code>CMD</code> no es un proceso que se quede en marcha (recuerda: si PID 1 termina, el contenedor termina).</li></ul>
     <p><b>Exited (0)</b> sería distinto: terminó bien, simplemente no era un proceso de larga duración.</p>`},
 {t:"par", p:"Empareja cada estado con lo que significa",
  pares:[["Exited (0)","El proceso terminó correctamente y el contenedor se paró"],["Exited (1)","El proceso falló al arrancar o durante la ejecución"],["Exited (137)","Lo mató el sistema: normalmente se quedó sin memoria"],["Restarting","Arranca y se cae en bucle"],["Up 2 minutes (healthy)","En marcha y su healthcheck responde bien"]],
  why:"137 = 128 + 9 (señal KILL): casi siempre falta de memoria."},
 {t:"term", p:"Muestra todos los contenedores, incluidos los parados",
  prompt:"pablo@portatil:~$", sol:["docker ps -a","docker ps --all","docker container ls -a"],
  pista:"docker ps con la opción de «todos».",
  salida:`CONTAINER ID   IMAGE      STATUS                      NAMES
9f2c1a7b3e4d   api:1.0    Exited (1) 3 seconds ago    api
2b7d9c1e5f8a   postgres   Up 4 minutes (healthy)      db`, why:"Sin -a solo se ven los que están en marcha, y el que falló no aparecería."},
 {t:"opcion", p:"Un contenedor está en <code>Exited (137)</code> y en los logs no hay ningún error de la aplicación. ¿Qué sospechas?",
  ops:["Un fallo del código","Que se quedó sin memoria y el sistema lo mató","Que el puerto estaba ocupado","Que falta el CMD"],
  ok:1, why:"Se comprueba con docker inspect (OOMKilled: true) y se corrige dando más memoria o ajustando la JVM."}
]},

/* =============== U9 L2 =============== */
{
id:"dk9l2",
titulo:"Puertos: ocupado y no accesible",
claves:["«port is already allocated»: otro proceso usa ese puerto del host; cámbialo o para el otro","Si no puedes abrir la app en el navegador: revisa -p, y que la app escuche en 0.0.0.0","Dentro del contenedor, 127.0.0.1 es el propio contenedor, no tu máquina"],
pasos:[
 {t:"info", eti:"Escenario 2", h:"«port is already allocated»",
  c:`<div class="termbox">$ docker run -d -p 8080:8080 api:1.0
docker: Error response from daemon: driver failed programming external connectivity:
Bind for 0.0.0.0:8080 failed: port is already allocated.</div>
     <p>Significa que <b>algo ya está usando el puerto 8080 de tu máquina</b>: otro contenedor u otro programa. Dos salidas:</p>
     <ul><li>Usar otro puerto del host: <code>-p 8081:8080</code>.</li>
     <li>Encontrar y parar al que lo ocupa: <code>docker ps</code> y mirar la columna PORTS.</li></ul>`},
 {t:"opcion", p:"Te da «port is already allocated» con <code>-p 8080:8080</code>. ¿Qué solución es correcta?",
  ops:["Reiniciar Docker siempre","Publicar en otro puerto del host, por ejemplo -p 8081:8080, o parar el contenedor que ya usa el 8080","Cambiar el puerto dentro de la aplicación","Borrar la imagen"],
  ok:1, why:"El conflicto es del lado izquierdo (el puerto de tu máquina); el de dentro puede repetirse sin problema."},
 {t:"info", eti:"Escenario 5", h:"«No puedo abrir la app en el navegador»",
  c:`<p>El contenedor está <b>Up</b>, pero <code>http://localhost:8080</code> no responde. Repasa en este orden:</p>
     <ol><li>¿Publicaste el puerto? Sin <code>-p</code> no hay acceso desde fuera. <code>docker ps</code> debe mostrar <code>0.0.0.0:8080-&gt;8080/tcp</code>.</li>
     <li>¿Coinciden los puertos? En <code>-p 8080:3000</code>, el de la derecha es donde escucha la aplicación <b>dentro</b>.</li>
     <li>¿La aplicación escucha en <b>0.0.0.0</b>? Si escucha solo en <code>127.0.0.1</code>, dentro del contenedor eso significa «solo yo»: nadie de fuera llega.</li></ol>
     <div class="nota"><b class="tit">La confusión clásica</b>Dentro de un contenedor, <code>localhost</code> es <b>ese</b> contenedor. Si tu aplicación busca la base de datos en localhost y la base de datos está en otro contenedor, no la encontrará.</div>`},
 {t:"par", p:"Empareja cada síntoma con su causa",
  pares:[["No sale nada en la columna PORTS","Falta -p al arrancar el contenedor"],["La app escucha en 127.0.0.1 dentro del contenedor","Solo acepta conexiones internas: hay que escuchar en 0.0.0.0"],["-p 8080:3000 pero la app usa el 8080 dentro","El puerto de la derecha no coincide con el de la aplicación"],["port is already allocated","Otro proceso ocupa ese puerto del host"]],
  why:"Los cuatro se resuelven mirando docker ps y la configuración de la aplicación."},
 {t:"opcion", p:"Tu API escucha en el puerto 8080 dentro del contenedor y quieres abrirla en <code>http://localhost:9000</code>. ¿Qué opción usas?",
  ops:["-p 8080:9000","-p 9000:8080","-p 9000:9000","--expose 9000"],
  ok:1, why:"Se lee «puerto de mi máquina : puerto del contenedor»."},
 {t:"escribe", p:"Escribe el comando para arrancar en segundo plano la imagen <code>api:1.0</code> publicando el 8080 del contenedor en el 9000 de tu máquina",
  sol:["docker run -d -p 9000:8080 api:1.0","docker run -p 9000:8080 -d api:1.0"], ph:"docker run …", pista:"docker run -d -p host:contenedor imagen.", why:"docker run -d -p 9000:8080 api:1.0."}
]},

/* =============== U9 L3 =============== */
{
id:"dk9l3",
titulo:"Cuando la aplicación no encuentra la base de datos",
claves:["Entre contenedores se usa el nombre del servicio como si fuera un dominio, no localhost","Los dos contenedores deben estar en la misma red de Docker","Que la base de datos esté «Up» no significa que ya acepte conexiones: por eso healthcheck"],
pasos:[
 {t:"info", eti:"Escenario 3", h:"«Connection refused» contra la base de datos",
  c:`<div class="termbox">$ docker logs api
org.postgresql.util.PSQLException: Connection to localhost:5432 refused.</div>
     <p>Tres causas posibles, en orden de probabilidad:</p>
     <ol><li><b>Nombre equivocado</b>: la aplicación busca <code>localhost</code>, pero dentro de su contenedor eso es ella misma. Debe usar el <b>nombre del servicio</b>: <code>jdbc:postgresql://db:5432/tareas</code>.</li>
     <li><b>Redes distintas</b>: si cada contenedor está en una red diferente, no se ven. Con Compose comparten red automáticamente.</li>
     <li><b>La base de datos aún no está lista</b>: el contenedor está Up pero PostgreSQL todavía arranca.</li></ol>`},
 {t:"opcion", p:"La API busca la base de datos en <code>localhost:5432</code> y falla. ¿Qué hay que poner en su configuración?",
  ops:["La IP del contenedor de la base de datos","El nombre del servicio, por ejemplo db:5432","El nombre de la imagen","El id del contenedor"],
  ok:1, why:"Docker resuelve el nombre del servicio a la IP interna, que además puede cambiar al reiniciar."},
 {t:"info", eti:"Comprobarlo", h:"Probar desde dentro",
  c:`<p>La forma rápida de confirmarlo es entrar en el contenedor de la API y probar la conexión:</p>
     <div class="termbox">$ docker exec -it api sh
/ # getent hosts db            # ¿se resuelve el nombre?
172.18.0.3      db
/ # nc -zv db 5432             # ¿responde el puerto?
db (172.18.0.3:5432) open</div>
     <p>Si el nombre no se resuelve, el problema es de <b>red</b>. Si se resuelve pero el puerto no responde, la base de datos <b>aún no está lista</b> o no escucha ahí.</p>`},
 {t:"par", p:"Empareja cada comprobación con lo que descarta",
  pares:[["docker network inspect","Que los dos contenedores estén en la misma red"],["getent hosts db","Que el nombre del servicio se resuelva"],["nc -zv db 5432","Que el puerto de la base de datos responda"],["docker logs db","Que la base de datos haya terminado de arrancar"]],
  why:"Con estas cuatro pruebas se localiza el fallo en un minuto."},
 {t:"info", eti:"El orden de arranque", h:"depends_on no espera a que esté lista",
  c:`<p>Ya lo viste en la unidad de Compose y aquí se entiende por qué importa: <code>depends_on</code> sin condición solo espera a que el contenedor <b>arranque</b>, no a que la base de datos acepte conexiones. Por eso se combina con un <b>healthcheck</b>:</p>
     <div class="termbox">db:
  image: postgres:16-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER"]
    interval: 5s
    retries: 10
api:
  depends_on:
    db:
      condition: service_healthy</div>`},
 {t:"opcion", p:"Tu API arranca antes que PostgreSQL y falla. ¿Cuál es la solución más correcta?",
  ops:["Poner un sleep 30 en la API","depends_on con condition: service_healthy y un healthcheck en la base de datos (y, aun así, reintentos en la aplicación)","Arrancar los contenedores a mano en orden","Quitar depends_on"],
  ok:1, why:"Una aplicación robusta reintenta la conexión: los servicios se reinician también en producción."}
]},

/* =============== U9 L4 =============== */
{
id:"dk9l4",
titulo:"Datos perdidos, permisos y disco lleno",
claves:["Sin volumen, los datos viven en la capa del contenedor y desaparecen con él; docker compose down -v los borra","«Permission denied» en un volumen: el usuario del contenedor no es dueño de esa carpeta","Limpia por nombre o por proyecto; nunca prune general si hay otros proyectos"],
pasos:[
 {t:"info", eti:"Escenario 4", h:"«Se han perdido todos los datos»",
  c:`<p>Las dos causas casi siempre son estas:</p>
     <ul><li>El servicio <b>no tenía volumen</b>: los datos estaban dentro del contenedor y se fueron con él al recrearlo.</li>
     <li>Alguien ejecutó <code>docker compose down <b>-v</b></code>, que borra también los volúmenes del proyecto.</li></ul>
     <div class="termbox">services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data   # ◀ sin esta línea, los datos son temporales
volumes:
  pgdata:</div>`},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>docker compose down</code> y <code>docker compose down -v</code>?",
  ops:["Ninguna","Sin -v se paran y borran los contenedores pero se conservan los volúmenes; con -v se borran también los volúmenes (y los datos)","-v es más rápido","-v solo borra las redes"],
  ok:1, why:"Es la forma más habitual de perder datos sin querer."},
 {t:"info", eti:"Escenario 10", h:"«Permission denied» al escribir en un volumen",
  c:`<div class="termbox">$ docker logs api
java.io.FileNotFoundException: /datos/informe.pdf (Permission denied)</div>
     <p>Recuerda de la unidad de Linux: dentro del contenedor tu aplicación corre con un usuario (por buenas prácticas, no root). Si la carpeta montada pertenece a otro usuario, no puede escribir. Soluciones:</p>
     <ul><li>Dar la propiedad en el Dockerfile: <code>RUN chown -R app:app /datos</code>.</li>
     <li>O montar con el usuario adecuado: <code>user: "1000:1000"</code> en Compose.</li></ul>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Los datos desaparecen al recrear el contenedor","Montar un volumen con nombre en la carpeta de datos"],["Permission denied al escribir en el volumen","Ajustar el usuario o el propietario de esa carpeta"],["El disco del servidor se llena","Borrar imágenes y contenedores antiguos por nombre y limitar los logs"],["Los logs ocupan gigas","Configurar max-size y max-file en el logging"]],
  why:"Los cuatro aparecen en cuanto llevas contenedores a un servidor real."},
 {t:"info", eti:"Escenario 9", h:"«Se ha llenado el disco del servidor»",
  c:`<div class="termbox">$ docker system df            # qué ocupa: imágenes, contenedores, volúmenes, caché
TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images          38      4        22.4GB    18.1GB
Build Cache     212     0        9.8GB     9.8GB</div>
     <p>Limpieza <b>con cuidado</b>: borra por nombre lo que sabes que sobra (<code>docker rmi imagen:tag</code>, <code>docker rm nombre</code>) o usa <code>docker builder prune</code> para la caché de construcción.</p>
     <div class="nota"><b class="tit">Cuidado</b><code>docker system prune -a --volumes</code> borra imágenes, contenedores <b>y volúmenes</b> no usados de <b>todo el equipo</b>: si tienes otros proyectos parados, te llevas sus datos por delante.</div>`},
 {t:"opcion", p:"El disco está lleno y tienes otros proyectos con contenedores parados. ¿Qué haces?",
  ops:["docker system prune -a --volumes","Mirar qué ocupa con docker system df y borrar por nombre, o limpiar la caché de construcción con docker builder prune","Borrar la carpeta /var/lib/docker a mano","Reinstalar Docker"],
  ok:1, why:"El prune general es cómodo y peligroso: en equipos compartidos se evita."},
 {t:"term", p:"Muestra cuánto espacio ocupan las imágenes, los contenedores, los volúmenes y la caché",
  prompt:"pablo@portatil:~$", sol:["docker system df"],
  pista:"docker system y «df», como en Linux.",
  salida:`TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          38        4         22.4GB    18.1GB
Containers      12        3         1.2GB     900MB
Local Volumes   9         2         3.1GB     2.4GB
Build Cache     212       0         9.8GB     9.8GB`, why:"RECLAIMABLE es lo que podrías recuperar limpiando."}
]},

/* =============== U9 L5 =============== */
{
id:"dk9l5",
titulo:"Arreglar un Dockerfile y un compose rotos",
claves:["Errores típicos del Dockerfile: orden de capas que rompe la caché, COPY antes de tiempo, CMD sin forma exec","Errores típicos del compose: indentación, tabuladores, puertos con formato raro, depends_on mal usado","docker compose config valida el fichero antes de arrancar nada"],
pasos:[
 {t:"info", eti:"Escenario 6", h:"«El build tarda 8 minutos por cambiar una línea»",
  c:`<div class="termbox">FROM maven:3.9-eclipse-temurin-21
WORKDIR /app
COPY . .                      # ◀ copia TODO antes de bajar dependencias
RUN mvn package</div>
     <p>Al copiar todo el proyecto antes de resolver dependencias, <b>cualquier</b> cambio en el código invalida la caché y Maven vuelve a descargarlo todo. El arreglo es copiar primero lo que cambia poco:</p>
     <div class="termbox">COPY pom.xml .
RUN mvn -B dependency:go-offline     # esta capa se reutiliza mientras no cambie el pom
COPY src ./src
RUN mvn -B package</div>`},
 {t:"opcion", p:"¿Por qué copiar primero el <code>pom.xml</code> acelera los builds?",
  ops:["Porque el pom es más pequeño","Porque la capa de dependencias se reutiliza de la caché mientras el pom no cambie","Porque Maven lo exige","Porque evita las pruebas"],
  ok:1, why:"Es la optimización de caché más rentable en proyectos Java."},
 {t:"info", eti:"Escenario 7", h:"Un Dockerfile con cuatro fallos",
  c:`<div class="termbox">FROM openjdk:latest              # 1) etiqueta latest: no reproducible y enorme
WORKDIR /app
COPY . .                         # 2) copia todo, incluido target/ y .git
RUN mvn package                  # 3) compila en la imagen final: se queda Maven dentro
CMD mvn spring-boot:run          # 4) forma shell y arranca con Maven en producción</div>
     <p>Versión corregida, con lo que ya sabes de la unidad de Dockerfile:</p>
     <div class="termbox">FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
USER 1000
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</div>`},
 {t:"par", p:"Empareja cada fallo del Dockerfile con su corrección",
  pares:[["FROM openjdk:latest","Fijar una imagen y etiqueta concretas"],["COPY . . al principio","Copiar primero el pom y aprovechar la caché"],["Compilar en la imagen final","Multi-stage: compilar en una imagen y copiar solo el .jar"],["CMD mvn spring-boot:run","ENTRYPOINT en forma exec ejecutando el .jar"],["Ejecutar como root","USER con un usuario sin privilegios"]],
  why:"Estos cinco arreglos son exactamente lo que se espera que detectes en una entrevista."},
 {t:"info", eti:"Escenario 8", h:"Un compose.yml roto",
  c:`<div class="termbox">services:
  db:
	image: postgres:16-alpine      # ◀ indentado con TABULADOR: YAML no lo permite
    environment:
      POSTGRES_PASSWORD: secreto
  api:
    build: .
    ports:
      - 8080:8080                  # ◀ sin comillas puede interpretarse mal (base 60)
    depends_on: db                 # ◀ debe ser una lista o un mapa</div>
     <p>Y así se valida antes de arrancar nada:</p>
     <div class="termbox">$ docker compose config
services.db: found character that cannot start any token (tabulador)</div>`},
 {t:"opcion", p:"¿Qué comando comprueba si tu <code>compose.yml</code> es válido, sin levantar nada?",
  ops:["docker compose up --check","docker compose config","docker compose validate","docker inspect compose.yml"],
  ok:1, why:"Muestra el fichero ya interpretado, con las variables sustituidas: útil también para ver qué valores se están usando."},
 {t:"term", p:"Valida el fichero de Compose de la carpeta actual sin arrancar servicios",
  prompt:"pablo@portatil:~/api$", sol:["docker compose config","docker compose config -q","docker compose config --quiet"],
  pista:"docker compose y «config».",
  salida:`name: api
services:
  api:
    build:
      context: /home/pablo/api
    ports:
      - mode: ingress
        target: 8080
        published: "8080"`, why:"Si hay un error de sintaxis, lo dice aquí en vez de fallar a medio arrancar."},
 {t:"vf", p:"Escribir los puertos entre comillas (\"8080:8080\") en el compose evita interpretaciones raras de YAML.",
  ok:true, why:"Sin comillas, valores como 22:22 pueden leerse como números en base 60. Las comillas los dejan como texto."}
]}

]});
