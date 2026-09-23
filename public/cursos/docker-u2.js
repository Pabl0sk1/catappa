window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Los comandos del día a día",
resumen: "run, ps, puertos, logs, exec y el ciclo de vida completo",
nivel: "Fundamentos",
color: "#0e97b4",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"dk2l1",
titulo:"La anatomía de docker run",
claves:["docker run [flags] IMAGEN [comando]","El orden importa: los flags van ANTES de la imagen","Lo que pones después de la imagen sustituye al programa por defecto"],
pasos:[
 {t:"info", eti:"Estructura", h:"Todo comando docker run tiene tres partes",
  c:`<div class="termbox">docker run <span class="hi">[flags]</span> <b>IMAGEN</b> <span class="cm">[comando]</span></div>
     <ul><li><span class="hi">flags</span>: opciones que configuran el contenedor (puertos, nombre, memoria...). Van <b>antes</b> de la imagen.</li>
     <li><b>IMAGEN</b>: qué imagen usar. Es lo único obligatorio.</li>
     <li>comando: opcional. Si lo pones, <b>sustituye</b> al programa que la imagen ejecuta por defecto.</li></ul>
     <p>Ejemplo completo:</p>
     <div class="termbox">docker run <span class="hi">-d --name web -p 8080:80</span> <b>nginx:alpine</b></div>`},

 {t:"opcion", p:"¿Por qué <code>docker run nginx -d</code> NO funciona como esperas?",
  ops:["Porque nginx no admite -d",
       "Porque todo lo que va después de la imagen se interpreta como el comando a ejecutar dentro, no como un flag",
       "Porque falta el tag",
       "Porque -d va siempre al final"],
  ok:1,
  why:"Docker intentaría ejecutar el programa «-d» dentro del contenedor. Los flags SIEMPRE van antes de la imagen. Es un fallo clásico."},

 {t:"info", eti:"Sustituir el comando", h:"Lo que va después de la imagen manda",
  c:`<p>Cada imagen trae un programa por defecto. La de <code>ubuntu</code> trae <code>bash</code>; la de <code>nginx</code> arranca el servidor web.</p>
     <p>Si escribes algo después de la imagen, <b>reemplazas</b> ese programa por defecto:</p>
     <div class="termbox">docker run alpine <b>echo hola</b>     <span class="cm"># ejecuta "echo hola" y termina</span>
docker run alpine <b>ls /</b>           <span class="cm"># lista la raiz y termina</span>
docker run ubuntu <b>cat /etc/os-release</b></div>
     <p>Como esos programas terminan enseguida, el contenedor termina con ellos.</p>`},

 {t:"term", p:"Ejecuta un contenedor de <code>alpine</code> que imprima la palabra <code>hola</code>",
  sol:["docker run alpine echo hola"],
  pista:"docker run + imagen + el comando a ejecutar dentro.",
  salida:`Unable to find image 'alpine:latest' locally
latest: Pulling from library/alpine
Status: Downloaded newer image for alpine:latest
hola`,
  why:"Alpine es una distribución de Linux de solo 8 MB. Ha arrancado, ha impreso «hola» y ha terminado, todo en menos de un segundo."},

 {t:"info", eti:"Flag útil", h:"--rm: no dejar basura",
  c:`<p>Cada <code>docker run</code> deja un contenedor parado ocupando espacio. Si estás haciendo pruebas, añade <code>--rm</code>: el contenedor <b>se borra solo</b> al terminar.</p>
     <div class="termbox">docker run <b>--rm</b> alpine echo hola</div>
     <p>Regla práctica: para pruebas, siempre <code>--rm</code>. Para algo que quieras conservar, sin él.</p>`},

 {t:"hueco", p:"Completa: ejecuta alpine imprimiendo «adios» y sin dejar el contenedor parado después",
  tpl:"docker run ___ alpine echo adios",
  banco:["--rm","-d","-p","--name"],
  sol:["--rm"],
  why:"<code>--rm</code> = remove al terminar. Es el flag que más vas a usar mientras practicas."},

 {t:"info", eti:"Interactivo", h:"-it: meterte dentro del contenedor",
  c:`<p>Para trabajar <b>dentro</b> de un contenedor necesitas dos flags, que casi siempre van juntos:</p>
     <ul><li><code>-i</code> (<i>interactive</i>): mantiene abierta la entrada de teclado.</li>
     <li><code>-t</code> (<i>tty</i>): te da una terminal de verdad, con su prompt.</li></ul>
     <p>Se escriben juntos como <code>-it</code>:</p>
     <div class="termbox">docker run <b>-it</b> ubuntu:22.04 bash</div>
     <p>Eso te deja dentro de un Ubuntu, con su shell, como si te hubieras conectado a otra máquina. Se sale escribiendo <code>exit</code>.</p>`},

 {t:"opcion", p:"¿Qué hace <code>docker run -it ubuntu:22.04 bash</code>?",
  ops:["Instala Ubuntu en tu ordenador",
       "Arranca un contenedor de Ubuntu y te deja dentro, con una shell interactiva",
       "Descarga Ubuntu y lo borra",
       "Convierte tu Windows en Ubuntu"],
  ok:1,
  why:"Te mete dentro. Es la forma más rápida de trastear con un sistema Linux sin instalar nada y sin riesgo: al salir, lo borras y no queda rastro."},

 {t:"par", p:"Empareja cada flag con su significado",
  pares:[["--rm","Borra el contenedor al terminar"],
         ["-it","Interactivo, con terminal"],
         ["-d","En segundo plano"],
         ["--name","Le pone un nombre fijo"]],
  why:"Estos cuatro son los que más vas a escribir. -d y --name los trabajamos en la siguiente lección."},

 {t:"escribe", p:"Escribe el comando que abre una shell (<code>sh</code>) dentro de un contenedor de <code>alpine</code>, de forma interactiva y borrándolo al salir",
  sol:["docker run -it --rm alpine sh","docker run --rm -it alpine sh","docker run -ti --rm alpine sh","docker run --rm -ti alpine sh"],
  ph:"docker run ...",
  pista:"Dos flags antes de la imagen, y el programa <code>sh</code> después.",
  why:"Alpine no trae <code>bash</code>, solo <code>sh</code>. Si escribes bash en una imagen alpine te dará «executable file not found»: lo verás en la unidad de Linux."}
]},

/* =============== U2 L2 =============== */
{
id:"dk2l2",
titulo:"Segundo plano y nombres",
claves:["-d lo deja corriendo de fondo y te devuelve el prompt","--name evita nombres aleatorios","docker ps muestra lo que está en marcha"],
pasos:[
 {t:"info", eti:"El problema", h:"Un servidor no puede bloquearte la terminal",
  c:`<p>Si arrancas un servidor web sin más, se queda escribiendo sus registros en tu terminal y no puedes hacer nada más hasta que lo pares.</p>
     <p>Para servicios de larga duración se usa <code>-d</code> (<i>detached</i>, "desacoplado"): el contenedor arranca <b>de fondo</b> y te devuelve el control inmediatamente.</p>
     <div class="termbox">docker run <b>-d</b> nginx:alpine
<span class="cm">3f2a9c1b7e45a8d3... (te devuelve el ID y sigues trabajando)</span></div>`},

 {t:"info", eti:"Nombres", h:"--name, porque el ID no hay quien lo recuerde",
  c:`<p>Cada contenedor tiene un identificador de 64 caracteres. Docker además le pone un nombre aleatorio simpático (<code>jolly_curie</code>, <code>vibrant_tesla</code>...).</p>
     <p>Eso está bien para una prueba, pero si vas a interactuar con él, ponle nombre tú:</p>
     <div class="termbox">docker run -d <b>--name web</b> nginx:alpine</div>
     <p>A partir de ahí puedes referirte a él como <code>web</code> en todos los comandos: <code>docker logs web</code>, <code>docker stop web</code>...</p>
     <div class="nota ojo"><b class="tit">Cuidado</b>Los nombres son únicos. Si ya existe un contenedor llamado <code>web</code>, aunque esté parado, no puedes crear otro con ese nombre: dará error de «Conflict».</div>`},

 {t:"term", p:"Arranca nginx (imagen <code>nginx:alpine</code>) en segundo plano y llámalo <code>web</code>",
  sol:["docker run -d --name web nginx:alpine","docker run --name web -d nginx:alpine"],
  pista:"Dos flags: uno para el segundo plano y otro para el nombre. Luego la imagen.",
  salida:`Unable to find image 'nginx:alpine' locally
alpine: Pulling from library/nginx
Status: Downloaded newer image for nginx:alpine
9b1d5c7e2a4f8c0b3e6d1a9f4c7b2e5a8d3f6c1b9e4a7d2f5c8b1e6a9d4f7c2b`,
  why:"Ese churro es el ID completo del contenedor. Como usaste -d, has recuperado el prompt inmediatamente."},

 {t:"term", p:"Comprueba que está en marcha",
  sol:["docker ps","docker container ls"],
  pista:"El comando de listar lo que está corriendo.",
  salida:`CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS     NAMES
9b1d5c7e2a4f   nginx:alpine   "/docker-entrypoint.…"   12 seconds ago   Up 11 seconds   80/tcp    web`,
  why:"Ahora sí aparece, con estado <b>Up</b> (en marcha) y con tu nombre: <b>web</b>."},

 {t:"info", eti:"Leer la tabla", h:"Qué significa cada columna",
  c:`<ul><li><b>CONTAINER ID</b>: los primeros 12 caracteres del identificador.</li>
     <li><b>IMAGE</b>: de qué imagen salió.</li>
     <li><b>COMMAND</b>: el programa principal que está ejecutando.</li>
     <li><b>STATUS</b>: <code>Up X</code> si corre, <code>Exited (n)</code> si terminó.</li>
     <li><b>PORTS</b>: puertos. Ahora pone <code>80/tcp</code>, que significa "el programa escucha en el 80 <b>dentro</b>", pero <b>aún no puedes entrar desde fuera</b>. Eso se arregla en la lección siguiente.</li>
     <li><b>NAMES</b>: el nombre.</li></ul>`},

 {t:"opcion", p:"En la columna STATUS ves <code>Up 3 minutes</code>. ¿Qué significa?",
  ops:["Que lleva 3 minutos sin responder",
       "Que el contenedor lleva 3 minutos en marcha",
       "Que se apagará en 3 minutos",
       "Que tardó 3 minutos en arrancar"],
  ok:1,
  why:"Up = corriendo, y el tiempo es cuánto lleva levantado."},

 {t:"opcion", p:"Intentas crear otro contenedor con <code>--name web</code> y te sale «Conflict. The container name /web is already in use». ¿Qué haces?",
  ops:["Reiniciar Docker",
       "Borrar o renombrar el contenedor anterior, o usar otro nombre",
       "Esperar a que caduque",
       "Cambiar de imagen"],
  ok:1,
  why:"Los nombres son únicos, incluso entre los contenedores parados. <code>docker rm web</code> y listo (lo ves en la lección del ciclo de vida)."},

 {t:"vf", p:"Con <code>-d</code>, si cierras la terminal, el contenedor se para.",
  ok:false,
  why:"No. El contenedor lo ejecuta el daemon, no tu terminal. Puedes cerrar PowerShell y seguirá corriendo. Esa es la gracia del segundo plano."},

 {t:"hueco", p:"Completa: arranca redis en segundo plano con el nombre <code>cache</code>",
  tpl:"docker run ___ ___ cache redis:alpine",
  banco:["-d","--name","-p","--rm"],
  sol:["-d","--name"],
  why:"Orden habitual: primero -d, luego --name con su valor, y al final la imagen."}
]},

/* =============== U2 L3 =============== */
{
id:"dk2l3",
titulo:"Puertos: abrir la puerta al exterior",
claves:["-p HOST:CONTENEDOR (fuera:dentro)","Sin -p, el servicio no es accesible desde tu máquina","El puerto de dentro lo decide la app; el de fuera lo eliges tú"],
pasos:[
 {t:"info", eti:"El concepto", h:"El contenedor tiene su propia red",
  c:`<p>¿Recuerdas el namespace de red? El contenedor tiene <b>su propia pila de red</b>, aislada. Nginx está escuchando en el puerto 80... pero en el puerto 80 <b>de dentro del contenedor</b>, que no es el 80 de tu Windows.</p>
     <p>Por eso, aunque el contenedor esté corriendo, si abres el navegador no ves nada. Falta <b>abrir la puerta</b>.</p>`},

 {t:"info", eti:"El flag", h:"-p PUERTO_DE_FUERA:PUERTO_DE_DENTRO",
  c:`<div class="termbox">docker run -d -p <b>8080</b>:<span class="hi">80</span> nginx:alpine
<span class="cm">               ^        ^</span>
<span class="cm">       tu maquina    dentro del contenedor</span></div>
     <p>Esto significa: «todo lo que llegue al puerto <b>8080 de mi ordenador</b>, mándalo al puerto <span class="hi">80 del contenedor</span>».</p>
     <p>Ahora sí: abres <code>http://localhost:8080</code> y ves la página de nginx.</p>
     <div class="nota ojo"><b class="tit">El orden se pregunta en las entrevistas</b><b>fuera:dentro</b>. Primero el del host, después el del contenedor. Si lo inviertes, no funciona.</div>`},

 {t:"opcion", p:"En <code>-p 3000:8080</code>, ¿en qué dirección del navegador entrarías?",
  ops:["http://localhost:8080","http://localhost:3000","En las dos","En ninguna"],
  ok:1,
  why:"El primero es el de TU máquina, que es por donde entras: localhost:3000. Dentro, la aplicación sigue escuchando en el 8080."},

 {t:"opcion", p:"Tu aplicación Spring Boot escucha en el 8080 dentro del contenedor y quieres entrar por <code>localhost:9000</code>. ¿Qué escribes?",
  ops:["-p 8080:9000","-p 9000:8080","-p 9000:9000","-p 8080:8080"],
  ok:1,
  why:"fuera:dentro → 9000:8080. El de dentro lo fija la aplicación; el de fuera lo eliges tú."},

 {t:"term", p:"Arranca nginx en segundo plano, con nombre <code>web2</code>, accesible desde el puerto 8080 de tu máquina",
  sol:["docker run -d --name web2 -p 8080:80 nginx:alpine","docker run -d -p 8080:80 --name web2 nginx:alpine","docker run --name web2 -d -p 8080:80 nginx:alpine","docker run -p 8080:80 -d --name web2 nginx:alpine"],
  pista:"Tres flags: -d, --name web2 y -p con fuera:dentro. Nginx escucha en el 80 por dentro.",
  salida:`a7c3e1f9b2d84a6c5e0f3b8d1c7a9e2f4b6d8a0c3e5f7b9d1a3c5e7f9b1d3a5c`,
  why:"Ya puedes abrir http://localhost:8080 en el navegador y ver la página de bienvenida de nginx."},

 {t:"info", eti:"Comprobarlo sin navegador", h:"curl",
  c:`<p><code>curl</code> es una herramienta de línea de comandos que hace peticiones HTTP. Sirve para comprobar que un servicio responde sin abrir el navegador:</p>
     <div class="termbox">curl http://localhost:8080</div>
     <p>Te devolverá el HTML de la página. En las APIs, el JSON.</p>`},

 {t:"term", p:"Comprueba con curl que nginx responde en el puerto 8080",
  sol:["curl http://localhost:8080","curl localhost:8080","curl http://localhost:8080/"],
  prompt:"PS C:\\practicar-docker>",
  pista:"curl + la dirección completa con el puerto.",
  salida:`<!DOCTYPE html>
<html>
<head><title>Welcome to nginx!</title></head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed.</p>
</body>
</html>`,
  why:"Responde. Acabas de servir una web desde un contenedor sin instalar nginx en tu ordenador."},

 {t:"vf", p:"Dos contenedores distintos pueden usar el puerto 8080 <b>dentro</b> de cada uno sin chocar.",
  ok:true,
  why:"Sí, porque cada uno tiene su propia red aislada. Lo que NO puede repetirse es el puerto de fuera: solo un contenedor puede ocupar el 8080 de tu máquina."},

 {t:"opcion", p:"Te sale el error «Bind for 0.0.0.0:8080 failed: port is already allocated». ¿Qué pasa?",
  ops:["La imagen está corrupta",
       "Otro contenedor (o programa) ya está ocupando el puerto 8080 de tu máquina",
       "Falta el flag -d",
       "El contenedor no tiene EXPOSE"],
  ok:1,
  why:"Solo un proceso puede escuchar en un puerto del host. Soluciones: parar el que lo ocupa, o publicar en otro puerto (-p 8081:80)."},

 {t:"hueco", p:"Completa para que una API que escucha en el 3000 por dentro sea accesible en el 80 de tu máquina",
  tpl:"docker run -d -p ___:___ mi-api",
  banco:["80","3000","8080","443"],
  sol:["80","3000"],
  why:"fuera:dentro = 80:3000. El 80 es el puerto por defecto de HTTP, así que entrarías con http://localhost sin escribir puerto."}
]},

/* =============== U2 L4 =============== */
{
id:"dk2l4",
titulo:"Logs: ver qué está pasando dentro",
claves:["docker logs NOMBRE muestra la salida del proceso principal","-f sigue los logs en vivo","La app debe escribir a la salida estándar, no a ficheros"],
pasos:[
 {t:"info", eti:"El concepto", h:"Los logs son la salida del programa",
  c:`<p>Dentro del contenedor no hay nadie mirando la pantalla. Todo lo que el programa principal imprime (su salida estándar y sus errores) lo <b>captura Docker</b> y lo guarda.</p>
     <div class="termbox">docker logs web</div>
     <p>Eso te muestra todo lo que ha escrito ese contenedor desde que arrancó. Es <b>lo primero que se mira</b> cuando algo falla.</p>`},

 {t:"term", p:"Mira los logs del contenedor llamado <code>web</code>",
  sol:["docker logs web"],
  pista:"docker + logs + el nombre del contenedor.",
  salida:`/docker-entrypoint.sh: Configuration complete; ready for start up
2026/09/21 09:14:02 [notice] 1#1: nginx/1.27.2
2026/09/21 09:14:02 [notice] 1#1: start worker processes`,
  why:"Ahí ves el arranque de nginx. Fíjate en <b>1#1</b>: ese 1 es el identificador del proceso (PID 1), que trabajaremos en la unidad de Linux."},

 {t:"info", eti:"Flags útiles", h:"-f y --tail",
  c:`<ul><li><code>docker logs <b>-f</b> web</code> — <i>follow</i>: se queda enganchado mostrando los logs <b>en vivo</b>. Se sale con Ctrl+C.</li>
     <li><code>docker logs <b>--tail 50</b> web</code> — solo las últimas 50 líneas. Muy útil cuando hay miles.</li>
     <li>Se combinan: <code>docker logs -f --tail 100 web</code>.</li></ul>
     <p>Mientras tienes <code>-f</code> abierto, recarga la página en el navegador: verás aparecer las peticiones en tiempo real.</p>`},

 {t:"opcion", p:"Quieres ver en directo lo que va imprimiendo una API mientras la pruebas. ¿Qué usas?",
  ops:["docker logs api","docker logs -f api","docker ps api","docker inspect api"],
  ok:1,
  why:"El flag -f (follow) deja la ventana enganchada. Es lo que tendrás abierto en una pantalla mientras depuras en la otra."},

 {t:"info", eti:"Regla de oro", h:"Tu app debe escribir a la consola, no a un fichero",
  c:`<p>Esto es un principio de las aplicaciones modernas (lo verás como <b>12-factor app</b>):</p>
     <p>Una aplicación en contenedor <b>no debe escribir sus logs en un fichero</b> dentro del contenedor. Debe imprimirlos por pantalla (salida estándar), y dejar que la plataforma los recoja.</p>
     <p>¿Por qué? Porque el contenedor es efímero: si lo borras, el fichero de log desaparece. En cambio, si sale por pantalla, Docker (y luego herramientas como Loki o ELK) puede recogerlo y centralizarlo.</p>
     <div class="nota dato"><b class="tit">Para la entrevista</b>«Los logs van a stdout y se centralizan fuera; dentro del contenedor no se guardan ficheros de log.»</div>`},

 {t:"vf", p:"Es buena práctica que la aplicación escriba sus logs en <code>/var/log/miapp.log</code> dentro del contenedor.",
  ok:false,
  why:"No. Si se borra el contenedor se pierden, y no se pueden centralizar fácilmente. Deben ir a la salida estándar."},

 {t:"info", eti:"Diagnóstico", h:"El orden en el que se depura",
  c:`<p>Memoriza esta secuencia, porque es una respuesta de entrevista completa:</p>
     <ul><li><b>1.</b> <code>docker ps -a</code> — ¿está corriendo? ¿con qué código de salida terminó?</li>
     <li><b>2.</b> <code>docker logs</code> — ¿qué dijo la aplicación antes de morir?</li>
     <li><b>3.</b> <code>docker inspect</code> — ¿tiene bien los puertos, la red y las variables?</li>
     <li><b>4.</b> <code>docker exec -it ... sh</code> — entrar y reproducirlo desde dentro.</li></ul>`},

 {t:"orden", p:"Ordena los pasos para diagnosticar un contenedor que no funciona",
  items:["docker ps -a  (ver estado y código de salida)","docker logs  (leer qué dijo la app)","docker inspect  (revisar puertos, red y variables)","docker exec -it  (entrar y reproducirlo dentro)"],
  why:"De lo más barato y rápido a lo más manual. Contar este método vale tanto como acertar la causa."},

 {t:"escribe", p:"Escribe el comando que muestra las últimas 100 líneas de log del contenedor <code>api</code>, en vivo",
  sol:["docker logs -f --tail 100 api","docker logs --tail 100 -f api","docker logs -f --tail=100 api","docker logs --tail=100 -f api"],
  ph:"docker logs ...",
  pista:"Dos flags: seguir en vivo y limitar las líneas.",
  why:"<code>docker logs -f --tail 100 api</code>. El comando que más veces escribirás cuando algo falla en producción."}
]},

/* =============== U2 L5 =============== */
{
id:"dk2l5",
titulo:"Entrar dentro de un contenedor",
claves:["docker exec entra en uno que YA corre","docker run crea uno nuevo","Las imágenes alpine solo traen sh, no bash"],
pasos:[
 {t:"info", eti:"La confusión número 1", h:"run crea, exec entra",
  c:`<p>Este es <b>el error más repetido</b> de quien empieza:</p>
     <ul><li><code>docker run</code> → crea un contenedor <b>NUEVO</b> a partir de una imagen.</li>
     <li><code>docker exec</code> → ejecuta algo <b>DENTRO de uno que ya está corriendo</b>.</li></ul>
     <p>Si tienes nginx corriendo y quieres mirar sus ficheros, no haces <code>docker run</code> (eso te crearía un segundo nginx vacío). Haces <code>docker exec</code>.</p>`},

 {t:"info", eti:"La forma", h:"docker exec -it NOMBRE sh",
  c:`<div class="termbox">docker exec <b>-it</b> web <span class="hi">sh</span></div>
     <ul><li><code>-it</code>: otra vez interactivo con terminal (si no, no podrías escribir).</li>
     <li><code>web</code>: el contenedor donde entrar.</li>
     <li><code>sh</code>: el programa a lanzar dentro. Aquí, una shell.</li></ul>
     <p>El prompt cambia a algo como <code>/ #</code>: ya estás <b>dentro</b>. Se sale con <code>exit</code> (y el contenedor <b>sigue corriendo</b>).</p>`},

 {t:"opcion", p:"Tienes <code>web</code> corriendo y quieres mirar sus ficheros internos. ¿Qué comando?",
  ops:["docker run -it web sh","docker exec -it web sh","docker logs web","docker start web"],
  ok:1,
  why:"exec entra en el que ya está en marcha. Con run crearías otro contenedor distinto y no verías lo que buscas."},

 {t:"info", eti:"sh o bash", h:"Por qué a veces bash no existe",
  c:`<p><code>bash</code> es una shell completa y cómoda, pero <b>ocupa</b>. Las imágenes basadas en <b>Alpine</b> (las que acaban en <code>-alpine</code>) son minúsculas y solo traen <code>sh</code>, una shell más básica.</p>
     <div class="termbox">docker exec -it web bash
<span class="cm">OCI runtime exec failed: exec: "bash": executable file not found in $PATH</span></div>
     <p>No es un error tuyo: es que esa imagen no lleva bash. Prueba con <code>sh</code> y funcionará.</p>
     <div class="nota"><b class="tit">Regla</b>Imagen <code>-alpine</code> → usa <code>sh</code>. Imagen basada en Ubuntu o Debian → suele tener <code>bash</code>.</div>`},

 {t:"opcion", p:"Ejecutas <code>docker exec -it web bash</code> y te dice «executable file not found». ¿Qué pruebas?",
  ops:["Reinstalar Docker","Probar con sh en vez de bash","Reiniciar el contenedor","Cambiar el puerto"],
  ok:1,
  why:"La imagen (alpine) no trae bash. Con sh entras sin problema."},

 {t:"term", p:"Entra con una shell en el contenedor <code>web</code>",
  sol:["docker exec -it web sh","docker exec -ti web sh","docker exec -it web /bin/sh"],
  pista:"exec + los dos flags de interactividad + el nombre + sh.",
  salida:`/ # (ya estas dentro del contenedor)`,
  why:"Estás dentro de nginx. Desde aquí puedes mirar la configuración, los ficheros servidos o comprobar la red."},

 {t:"info", eti:"Ejecutar sin entrar", h:"Un solo comando, sin shell",
  c:`<p>No hace falta abrir una shell si solo quieres ejecutar una cosa. Sin <code>-it</code> y con el comando directamente:</p>
     <div class="termbox">docker exec web ls /usr/share/nginx/html
<span class="cm">50x.html
index.html</span></div>
     <p>Muy práctico para automatizar o para comprobaciones rápidas.</p>`},

 {t:"escribe", p:"Ejecuta <code>whoami</code> dentro del contenedor <code>web</code>, sin abrir una shell interactiva",
  sol:["docker exec web whoami"],
  ph:"docker exec ...",
  pista:"Sin -it, porque no necesitas escribir nada: solo el contenedor y el comando.",
  why:"Te dirá <code>root</code>. Por defecto los contenedores corren como root, y eso es un problema de seguridad que resolveremos en el Dockerfile."},

 {t:"par", p:"Empareja cada comando con su uso",
  pares:[["docker run","Crear y arrancar un contenedor nuevo"],
         ["docker exec","Ejecutar algo dentro de uno que ya corre"],
         ["docker start","Volver a arrancar uno que estaba parado"],
         ["docker logs","Ver lo que ha impreso"]],
  why:"run / exec / start son las tres que se confunden. Ténlas claras."}
]},

/* =============== U2 L6 =============== */
{
id:"dk2l6",
titulo:"Ciclo de vida: parar, arrancar, borrar",
claves:["stop manda SIGTERM, espera 10s y luego SIGKILL","stop ≠ rm: parado sigue existiendo","docker rm -f para y borra de una vez"],
pasos:[
 {t:"info", eti:"Los estados", h:"Un contenedor solo tiene tres estados que te importen",
  c:`<div class="dg">
       <div class="dg-tit">ciclo de vida de un contenedor</div>
       <div class="dg-flujo">
         <div class="dg-caja acento doble">En marcha<small>docker run</small></div>
         <div class="dg-caja doble">Parado<small>docker stop</small></div>
         <div class="dg-caja aviso doble">Borrado<small>docker rm</small></div>
       </div>
       <div class="dg-nota arriba">de «parado» se vuelve a «en marcha» con docker start: el contenedor sigue existiendo, con sus datos</div>
       <div class="dg-nota">de «borrado» no se vuelve: eso sí desaparece</div>
     </div>
     <p>La diferencia clave: <b>parar no es borrar</b>. Un contenedor parado conserva su sistema de ficheros, sus logs y su configuración. Puedes volver a arrancarlo y sigue donde lo dejaste.</p>`},

 {t:"info", eti:"Parar bien", h:"Qué hace exactamente docker stop",
  c:`<p>Esto se pregunta en las entrevistas y casi nadie lo sabe:</p>
     <ul><li><b>1.</b> <code>docker stop</code> envía la señal <b>SIGTERM</b> al proceso principal. Es una petición educada: «ve terminando».</li>
     <li><b>2.</b> Espera <b>10 segundos</b> de cortesía para que la aplicación cierre conexiones, termine las peticiones en curso y guarde lo que tenga pendiente.</li>
     <li><b>3.</b> Si a los 10 segundos sigue vivo, envía <b>SIGKILL</b>, que lo mata sin contemplaciones.</li></ul>
     <p><code>docker kill</code> se salta la cortesía y manda SIGKILL directamente.</p>
     <div class="nota dato"><b class="tit">Por qué importa</b>Si tu aplicación no escucha el SIGTERM, cada despliegue corta peticiones a medias. A eso se le llama <b>apagado elegante</b> (graceful shutdown).</div>`},

 {t:"opcion", p:"¿Qué señal envía primero <code>docker stop</code>?",
  ops:["SIGKILL","SIGTERM, y solo después de 10 segundos SIGKILL","SIGHUP","Ninguna, corta la luz"],
  ok:1,
  why:"SIGTERM primero (petición de cierre ordenado), SIGKILL como último recurso. docker kill va directo al SIGKILL."},

 {t:"term", p:"Para el contenedor llamado <code>web</code>",
  sol:["docker stop web"],
  pista:"El verbo es literalmente el inglés de «parar».",
  salida:`web`,
  why:"Docker te devuelve el nombre como confirmación. Si tarda 10 segundos, es que la aplicación no atendió el SIGTERM."},

 {t:"term", p:"Comprueba que sigue existiendo aunque esté parado",
  sol:["docker ps -a","docker ps --all","docker container ls -a"],
  pista:"Listar TODOS, incluidos los parados.",
  salida:`CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                     NAMES
9b1d5c7e2a4f   nginx:alpine   "/docker-entrypoint.…"   5 minutes ago   Exited (0) 8 seconds ago   web`,
  why:"Ahí sigue: <b>Exited (0)</b>. No se ha borrado. Ocupa espacio y conserva todo su estado."},

 {t:"info", eti:"Borrar", h:"docker rm, y el atajo -f",
  c:`<div class="termbox">docker rm web            <span class="cm"># borra un contenedor PARADO</span>
docker rm <b>-f</b> web         <span class="cm"># lo para Y lo borra de una vez</span></div>
     <p>Si intentas borrar uno que está corriendo sin <code>-f</code>, Docker te avisa: «You cannot remove a running container». Es una protección.</p>
     <p>Para borrar <b>imágenes</b> el comando es distinto: <code>docker rmi nombre:tag</code> (rm <b>i</b>mage).</p>`},

 {t:"opcion", p:"¿Cuál es la diferencia entre <code>docker stop web</code> y <code>docker rm -f web</code>?",
  ops:["Ninguna",
       "stop lo deja parado pero existiendo; rm -f lo para y además lo elimina",
       "stop borra los logs",
       "rm -f borra también la imagen"],
  ok:1,
  why:"stop = pausa que se puede deshacer con start. rm = desaparece, junto con su capa de escritura y sus logs. La imagen no se toca."},

 {t:"vf", p:"Si borras un contenedor con <code>docker rm</code>, también se borra la imagen de la que salió.",
  ok:false,
  why:"No. La imagen sigue descargada y puedes crear otro contenedor al instante. Para borrar imágenes está <code>docker rmi</code>."},

 {t:"escribe", p:"Escribe el comando que para y borra de una sola vez el contenedor <code>web2</code>",
  sol:["docker rm -f web2","docker rm --force web2"],
  ph:"docker rm ...",
  pista:"El flag de «forzar» es una sola letra.",
  why:"<code>docker rm -f web2</code>. Es el que usarás mil veces mientras practicas."},

 {t:"info", eti:"Limpieza", h:"Cuando se te llena el disco",
  c:`<p>Los contenedores parados, las imágenes viejas y la caché de construcción se acumulan. Para ver cuánto ocupan:</p>
     <div class="termbox">docker system df</div>
     <p>Y para limpiar, por partes:</p>
     <div class="termbox">docker container prune   <span class="cm"># borra los contenedores parados</span>
docker image prune -a    <span class="cm"># borra imagenes sin usar</span>
docker builder prune     <span class="cm"># borra la cache de construccion</span></div>
     <div class="nota ojo"><b class="tit">Peligro</b><code>docker system prune -a --volumes</code> borra TODO, incluidos los volúmenes con datos. En tu máquina tienes contenedores de otros proyectos: no lo ejecutes a la ligera.</div>`},

 {t:"opcion", p:"Un compañero dice: «se me ha llenado el disco por Docker». ¿Cuál es el primer comando que le dices?",
  ops:["docker system prune -a --volumes","docker system df, para ver primero qué ocupa","docker rm -f $(docker ps -aq)","Reinstalar Docker"],
  ok:1,
  why:"Primero mirar, después borrar. Lanzar un prune total sin mirar puede borrar datos de producción."}
]},

/* =============== U2 L7 =============== */
{
id:"dk2l7",
titulo:"Configurar sin tocar el código",
claves:["-e pasa variables de entorno","La misma imagen sirve para dev y para producción","Los secretos nunca van dentro de la imagen"],
pasos:[
 {t:"info", eti:"El principio", h:"Una imagen, muchos entornos",
  c:`<p>Una regla profesional importante: <b>la misma imagen</b> debe ir a desarrollo, a pruebas y a producción. Lo único que cambia es <b>la configuración</b>.</p>
     <p>¿Y cómo se le pasa esa configuración? Con <b>variables de entorno</b>, usando el flag <code>-e</code>:</p>
     <div class="termbox">docker run -d <b>-e</b> SPRING_PROFILES_ACTIVE=prod <b>-e</b> SERVER_PORT=8080 mi-api:1.0.0</div>
     <p>Si necesitaras construir una imagen distinta por entorno, ya estarías haciéndolo mal: no podrías garantizar que lo que probaste es lo que despliegas.</p>`},

 {t:"opcion", p:"¿Por qué es mala idea construir una imagen distinta para desarrollo y otra para producción?",
  ops:["Porque ocupa más disco",
       "Porque entonces lo que pruebas no es exactamente lo que despliegas: pierdes la garantía del artefacto inmutable",
       "Porque Docker no lo permite",
       "Porque tarda más"],
  ok:1,
  why:"Se llama <b>artefacto inmutable</b>: la misma imagen que pasó los tests es la que llega a producción. Solo cambia la configuración inyectada."},

 {t:"info", eti:"Spring Boot", h:"Cómo mapea Spring las variables",
  c:`<p>Esto te viene directo para tu stack. Spring Boot convierte automáticamente las variables de entorno en propiedades:</p>
     <div class="termbox">SPRING_DATASOURCE_URL       ->  spring.datasource.url
SPRING_DATASOURCE_USERNAME  ->  spring.datasource.username
SERVER_PORT                 ->  server.port</div>
     <p>Regla: mayúsculas y los puntos se convierten en guiones bajos. Por eso puedes configurar una app Spring entera sin tocar el <code>application.properties</code>.</p>`},

 {t:"hueco", p:"Completa el comando para arrancar la API con el perfil de Spring <code>prod</code>",
  tpl:"docker run -d ___ SPRING_PROFILES_ACTIVE=prod mi-api:1.0.0",
  banco:["-e","-p","-v","--name"],
  sol:["-e"],
  why:"<code>-e CLAVE=valor</code>. Puedes repetir -e tantas veces como variables necesites."},

 {t:"info", eti:"Muchas variables", h:"--env-file",
  c:`<p>Cuando son diez variables, la línea se hace ilegible. Se meten en un fichero:</p>
     <div class="termbox"><span class="cm"># fichero .env</span>
POSTGRES_USER=tareas_user
POSTGRES_PASSWORD=tareas_pass
SPRING_PROFILES_ACTIVE=prod</div>
     <div class="termbox">docker run -d <b>--env-file .env</b> mi-api:1.0.0</div>
     <div class="nota ojo"><b class="tit">Norma de seguridad</b>El fichero <code>.env</code> <b>nunca</b> se sube al repositorio (va en <code>.gitignore</code>). Se sube un <code>.env.example</code> con las claves vacías, para que otro sepa qué variables hacen falta.</div>`},

 {t:"vf", p:"El fichero <code>.env</code> con las contraseñas reales debe subirse a Git para que el equipo lo tenga.",
  ok:false,
  why:"Nunca. Se sube .env.example sin valores. Las contraseñas reales van en el gestor de secretos del entorno o en los secrets del CI."},

 {t:"term", p:"Arranca un PostgreSQL 16 en segundo plano, llamado <code>bd</code>, con la contraseña <code>secreto</code> en la variable <code>POSTGRES_PASSWORD</code>",
  sol:["docker run -d --name bd -e postgres_password=secreto postgres:16-alpine",
       "docker run -d -e postgres_password=secreto --name bd postgres:16-alpine",
       "docker run --name bd -d -e postgres_password=secreto postgres:16-alpine"],
  pista:"Tres flags: -d, --name bd y -e POSTGRES_PASSWORD=secreto. La imagen es postgres:16-alpine.",
  salida:`b4d2f8a1c6e93b7d5a0f2c8e4b6d9a1f3c5e7b9d2a4f6c8e0b3d5a7f9c1e3b5d`,
  why:"Acabas de levantar una base de datos completa en segundos, sin instalador. Esa imagen exige POSTGRES_PASSWORD: si no la pasas, se niega a arrancar."},

 {t:"opcion", p:"Arrancas postgres sin <code>-e POSTGRES_PASSWORD</code> y el contenedor muere al instante. ¿Por qué?",
  ops:["Porque falta el puerto",
       "Porque la propia imagen se niega a arrancar sin contraseña de superusuario, y lo dice en los logs",
       "Porque hace falta más memoria",
       "Porque postgres no funciona en Docker"],
  ok:1,
  why:"Y lo avisa en los logs: «You must specify POSTGRES_PASSWORD». Otra vez: ante un contenedor que muere, lee los logs."},

 {t:"info", eti:"Recapitulación", h:"Ya sabes manejar contenedores",
  c:`<p>Con lo de esta unidad ya puedes trabajar con cualquier servicio del mundo sin instalarlo:</p>
     <div class="termbox">docker run -d --name bd -e POSTGRES_PASSWORD=x -p 5432:5432 postgres:16-alpine
docker ps
docker logs -f bd
docker exec -it bd sh
docker stop bd
docker rm bd</div>
     <p>En la siguiente unidad bajamos un nivel: qué hay <b>dentro</b> de ese Linux al que acabas de entrar.</p>`}
]}

]});
