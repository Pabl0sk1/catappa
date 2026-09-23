window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "El Linux de dentro",
resumen: "Moverte dentro del contenedor, permisos, root y la señal que mata tu app",
nivel: "Intermedio",
color: "#6b4fd8",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"dk3l1",
titulo:"El sistema de ficheros de Linux",
claves:["Todo cuelga de / , no hay C:\\","/etc configuración, /var/lib datos, /app tu aplicación","Dentro del contenedor tienes un Linux completo"],
pasos:[
 {t:"info", eti:"Por qué esta unidad", h:"Docker es Linux, te guste o no",
  c:`<p>Cada vez que entras en un contenedor estás en un Linux. Si no sabes moverte, te quedas bloqueado justo cuando hay que depurar algo.</p>
     <p>No necesitas ser administrador de sistemas. Necesitas unas quince cosas, y están todas en esta unidad.</p>`},

 {t:"info", eti:"La raíz", h:"En Linux no existe C:\\",
  c:`<p>En Windows cada disco es una letra: <code>C:\\</code>, <code>D:\\</code>. En Linux <b>todo</b> cuelga de un único punto de partida, la raíz, que se escribe con una barra: <code>/</code>.</p>
     <p>Y las barras van al revés que en Windows: <code>/usr/share/nginx/html</code>, no <code>C:\\usr\\share</code>.</p>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">/</span><span class="coment">&lt;- la raiz de todo</span></div><div class="rama" style="--n:1"><span class="nom">bin</span><span class="coment">ejecutables basicos (ls, cat, sh...)</span></div><div class="rama" style="--n:1"><span class="nom">etc</span><span class="coment">FICHEROS DE CONFIGURACION</span></div><div class="rama" style="--n:1"><span class="nom">home</span><span class="coment">carpetas personales de usuarios</span></div><div class="rama" style="--n:1"><span class="nom">opt</span><span class="coment">software opcional</span></div><div class="rama" style="--n:1"><span class="nom">app</span><span class="coment">(por convencion) tu aplicacion</span></div><div class="rama" style="--n:1"><span class="nom">tmp</span><span class="coment">temporales</span></div><div class="rama" style="--n:1"><span class="nom">usr</span><span class="coment">programas y datos del sistema</span></div><div class="rama" style="--n:1"><span class="nom">var</span></div><div class="rama" style="--n:2"><span class="nom">log</span><span class="coment">LOGS</span></div><div class="rama" style="--n:2"><span class="nom">lib</span><span class="coment">DATOS de los servicios (ej: /var/lib/postgresql/data)</span></div></div>`},

 {t:"par", p:"Empareja cada carpeta con lo que contiene",
  pares:[["/etc","Ficheros de configuración"],
         ["/var/log","Los logs"],
         ["/var/lib","Los datos de los servicios (como la base de datos)"],
         ["/bin","Programas básicos como ls o cat"]],
  why:"Las dos que más te van a sonar en Docker: <code>/var/lib/postgresql/data</code> (lo que hay que persistir con un volumen) y <code>/etc/nginx</code> (la configuración que se monta)."},

 {t:"opcion", p:"Vas a montar un volumen para que no se pierdan los datos de PostgreSQL. ¿Qué carpeta del contenedor tienes que persistir?",
  ops:["/etc/postgresql","/var/lib/postgresql/data","/home/postgres","/tmp/postgres"],
  ok:1,
  why:"<code>/var/lib/postgresql/data</code>. Es la ruta exacta que aparecerá en tu compose.yml. Si no la persistes, cada vez que recrees el contenedor pierdes la base de datos."},

 {t:"term", p:"Entra en un contenedor de Ubuntu de forma interactiva (que se borre al salir) y con la shell <code>bash</code>",
  sol:["docker run -it --rm ubuntu:22.04 bash","docker run --rm -it ubuntu:22.04 bash","docker run -it --rm ubuntu bash","docker run -ti --rm ubuntu:22.04 bash"],
  pista:"docker run, los flags -it y --rm, la imagen ubuntu:22.04 y el programa bash.",
  salida:`Unable to find image 'ubuntu:22.04' locally
22.04: Pulling from library/ubuntu
Status: Downloaded newer image for ubuntu:22.04
root@9c3f1a8b2d40:/#`,
  why:'Fíjate en el prompt: <code>root@9c3f1a8b2d40:/#</code> — eres el usuario <b>root</b>, la máquina se llama como el ID del contenedor y estás en la carpeta <code>/</code>.'},

 {t:"info", eti:"Leer el prompt", h:"El prompt te dice dónde estás",
  c:`<div class="termbox">root@9c3f1a8b2d40:/#
<span class="cm">^     ^             ^ ^</span>
<span class="cm">|     |             | +- # significa que eres root ($ si no lo eres)</span>
<span class="cm">|     |             +--- carpeta actual (la raiz)</span>
<span class="cm">|     +----------------- nombre de la maquina = ID del contenedor</span>
<span class="cm">+----------------------- usuario</span></div>
     <p>Cuando veas <code>#</code> al final, ten cuidado: eres administrador y puedes romperlo todo (aunque dentro de un contenedor de pruebas, da igual: lo borras y ya).</p>`},

 {t:"vf", p:"Dentro de un contenedor de Ubuntu tienes un sistema de ficheros Linux completo, aunque tu ordenador sea Windows.",
  ok:true,
  why:"Sí. Ese es el sentido de la imagen: trae su propio sistema de ficheros. Lo que comparte con el anfitrión es el kernel, no los ficheros."}
]},

/* =============== U3 L2 =============== */
{
id:"dk3l2",
titulo:"Los comandos que necesitas dentro",
claves:["ls, cd, cat, pwd para moverte y leer","> escribe en un fichero, >> añade","| encadena comandos"],
pasos:[
 {t:"info", eti:"Moverse", h:"Los cinco comandos básicos",
  c:`<div class="termbox">pwd                <span class="cm"># donde estoy</span>
ls                 <span class="cm"># que hay aqui</span>
ls -la /etc        <span class="cm"># listado detallado, incluidos ocultos</span>
cd /var/log        <span class="cm"># cambiar de carpeta</span>
cat fichero.txt    <span class="cm"># mostrar el contenido de un fichero</span></div>
     <p><code>ls -la</code> es el que más usarás: la <b>l</b> es "formato largo" (con permisos y tamaño) y la <b>a</b> es "todos" (incluidos los ficheros ocultos, los que empiezan por punto, como <code>.env</code>).</p>`},

 {t:"par", p:"Empareja cada comando con su función",
  pares:[["pwd","Mostrar en qué carpeta estoy"],
         ["ls","Listar lo que hay"],
         ["cd","Cambiar de carpeta"],
         ["cat","Mostrar el contenido de un fichero"]],
  why:"Con estos cuatro te mueves por cualquier contenedor."},

 {t:"term", p:"Ya estás dentro de un contenedor. Muestra el contenido del fichero que identifica la distribución de Linux: <code>/etc/os-release</code>",
  prompt:"root@9c3f1a8b2d40:/#",
  sol:["cat /etc/os-release"],
  pista:"El comando de mostrar ficheros + la ruta completa.",
  salida:`PRETTY_NAME="Ubuntu 22.04.5 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
ID=ubuntu`,
  why:"Este es el truco para saber en qué distribución estás cuando entras en una imagen desconocida. Determina si tendrás <code>apt-get</code> (Debian/Ubuntu) o <code>apk</code> (Alpine)."},

 {t:"info", eti:"Crear y escribir", h:"mkdir, touch y el símbolo >",
  c:`<div class="termbox">mkdir -p /app/config      <span class="cm"># crear carpetas (-p crea las intermedias)</span>
touch /app/nota.txt       <span class="cm"># crear un fichero vacio</span>
echo "hola" > f.txt       <span class="cm"># escribir "hola" en f.txt (SOBRESCRIBE)</span>
echo "mas" >> f.txt       <span class="cm"># AÑADIR al final</span>
rm f.txt                  <span class="cm"># borrar</span>
rm -rf /app/config        <span class="cm"># borrar carpeta y todo su contenido</span></div>
     <p>El símbolo <code>&gt;</code> redirige: en vez de imprimir por pantalla, escribe en el fichero. Con <code>&gt;&gt;</code> añade al final sin borrar lo anterior.</p>`},

 {t:"opcion", p:"¿Cuál es la diferencia entre <code>echo hola &gt; f.txt</code> y <code>echo hola &gt;&gt; f.txt</code>?",
  ops:["Ninguna",
       "El primero sobrescribe el fichero entero; el segundo añade al final",
       "El segundo crea el fichero y el primero no",
       "El segundo escribe en mayúsculas"],
  ok:1,
  why:"Una flecha sobrescribe, dos flechas añaden. Confundirlas borra ficheros, así que ten cuidado con la primera."},

 {t:"info", eti:"Encadenar", h:"La tubería | y el operador &&",
  c:`<p>Dos símbolos que verás en todos los Dockerfile:</p>
     <ul><li><b>|</b> (tubería): pasa la salida de un comando como entrada del siguiente.
     <div class="termbox">ls -la | grep conf     <span class="cm"># lista y filtra solo las lineas con "conf"</span></div></li>
     <li><b>&amp;&amp;</b>: ejecuta el segundo comando <b>solo si el primero salió bien</b>.
     <div class="termbox">apt-get update <b>&&</b> apt-get install -y curl</div></li></ul>
     <p>Ese <code>&amp;&amp;</code> es importantísimo en Docker: enlazar comandos en una sola instrucción crea <b>una sola capa</b> en vez de varias. Lo verás en la unidad del Dockerfile.</p>`},

 {t:"opcion", p:"¿Qué hace <code>apt-get update &amp;&amp; apt-get install -y curl</code>?",
  ops:["Ejecuta los dos comandos a la vez",
       "Ejecuta el segundo solo si el primero terminó correctamente",
       "Ejecuta el segundo aunque el primero falle",
       "Instala curl dos veces"],
  ok:1,
  why:"Encadenados con &&. Si actualizar la lista de paquetes falla, no tiene sentido intentar instalar: se para ahí."},

 {t:"info", eti:"Instalar cosas dentro", h:"apt-get o apk, según la distribución",
  c:`<p>Las imágenes vienen desnudas: no traen <code>curl</code>, ni <code>ping</code>, ni editores. Si necesitas algo para depurar:</p>
     <div class="termbox"><span class="cm"># Ubuntu / Debian</span>
apt-get update && apt-get install -y curl iputils-ping

<span class="cm"># Alpine</span>
apk add --no-cache curl</div>
     <div class="nota ojo"><b class="tit">Ojo</b>Lo que instalas así <b>desaparece</b> cuando borras el contenedor: has escrito en la capa de escritura, no en la imagen. Para que quede fijo hay que ponerlo en el Dockerfile.</div>`},

 {t:"vf", p:"Si instalas curl dentro de un contenedor con apt-get, la próxima vez que crees un contenedor de esa imagen curl seguirá instalado.",
  ok:false,
  why:"No. Se instaló en la capa de escritura de <b>ese</b> contenedor. Un contenedor nuevo de la misma imagen sale limpio. Para que persista, va en el Dockerfile."},

 {t:"escribe", p:"Escribe el comando de Linux que crea la carpeta <code>/app/datos</code> creando también las intermedias si no existen",
  sol:["mkdir -p /app/datos"],
  ph:"mkdir ...",
  pista:"El flag es una letra: «parents».",
  why:"<code>mkdir -p</code>. Sin el -p, si no existe <code>/app</code> te da error."}
]},

/* =============== U3 L3 =============== */
{
id:"dk3l3",
titulo:"root, usuarios y permisos",
claves:["Por defecto el contenedor corre como root: es un riesgo","chmod +x hace ejecutable un script","En producción se usa USER con un usuario sin privilegios"],
pasos:[
 {t:"info", eti:"El problema", h:"Por defecto eres root, y eso no es bueno",
  c:`<p>Cuando entras en un contenedor y escribes <code>whoami</code>, responde <b>root</b>: el administrador absoluto.</p>
     <p>¿Por qué es un problema si el contenedor está aislado?</p>
     <ul><li>Si alguien consigue explotar un fallo en tu aplicación, ya tiene <b>root dentro</b> del contenedor, y desde ahí es mucho más fácil intentar escapar al anfitrión.</li>
     <li>Si el contenedor tiene una carpeta de tu máquina montada, puede escribir ahí <b>como root</b> y dejarte ficheros que luego no puedes ni borrar.</li></ul>
     <p>Por eso, en una imagen de producción se crea un usuario normal y se cambia a él.</p>`},

 {t:"info", eti:"La solución", h:"Crear un usuario y usar USER",
  c:`<p>Esto lo pondrás en el Dockerfile (siguiente unidad), pero entiéndelo ahora:</p>
     <div class="termbox"><span class="cm"># en una imagen Alpine</span>
RUN addgroup -S spring && adduser -S spring -G spring
<b>USER spring</b></div>
     <p>A partir de esa línea, todo se ejecuta como <code>spring</code>, un usuario sin privilegios. Si compruebas dentro con <code>whoami</code>, ya no dirá root.</p>
     <div class="nota dato"><b class="tit">Frase de entrevista</b>«Mis imágenes no corren como root: creo un usuario sin privilegios y uso USER. Si comprometen la app, el atacante no hereda root.»</div>`},

 {t:"opcion", p:"¿Cuál es el riesgo real de que el contenedor corra como root?",
  ops:["Que consume más memoria",
       "Que si comprometen la aplicación, el atacante tiene root dentro y más facilidad para escalar al anfitrión o escribir como root en los volúmenes montados",
       "Que no puede escribir ficheros",
       "Que los logs no funcionan"],
  ok:1,
  why:"Exacto, y es de las cosas que más valora un entrevistador con perfil DevOps."},

 {t:"info", eti:"Permisos", h:"Cómo se lee -rw-r--r--",
  c:`<p>Al hacer <code>ls -l</code> ves algo así:</p>
     <div class="termbox">-rw-r--r-- 1 root root  612 Sep 21 09:14 fichero.txt
<span class="cm">^ ^^^ ^^^ ^^^</span>
<span class="cm">| |   |   +--- otros: pueden leer</span>
<span class="cm">| |   +------- grupo: puede leer</span>
<span class="cm">| +----------- dueño: puede leer y escribir</span>
<span class="cm">+------------- tipo: "-" fichero, "d" carpeta</span></div>
     <p>Las tres letras son: <b>r</b> leer, <b>w</b> escribir, <b>x</b> ejecutar. Y se repiten tres veces: dueño, grupo y el resto.</p>`},

 {t:"info", eti:"Números", h:"Por qué se ve chmod 755",
  c:`<p>Cada permiso vale un número: <b>r=4</b>, <b>w=2</b>, <b>x=1</b>. Se suman:</p>
     <ul><li><b>7</b> = 4+2+1 = leer, escribir y ejecutar</li>
     <li><b>5</b> = 4+1 = leer y ejecutar</li>
     <li><b>6</b> = 4+2 = leer y escribir</li></ul>
     <p>Por eso <code>chmod 755 script.sh</code> significa: el dueño todo (7), el grupo y el resto solo leer y ejecutar (5 y 5).</p>`},

 {t:"opcion", p:"<code>chmod 644 config.yml</code> significa:",
  ops:["Todos pueden ejecutar",
       "El dueño lee y escribe; el grupo y el resto solo leen",
       "Nadie puede leer",
       "Solo el grupo puede escribir"],
  ok:1,
  why:"6=leer+escribir para el dueño, 4=solo leer para el grupo y para el resto. Es el permiso típico de un fichero de configuración."},

 {t:"info", eti:"El error clásico", h:"permission denied al arrancar",
  c:`<p>Un fallo que te vas a encontrar seguro. Copias un script al contenedor y al arrancarlo:</p>
     <div class="termbox">/entrypoint.sh: permission denied</div>
     <p>Significa que el fichero <b>no tiene permiso de ejecución</b>. La solución:</p>
     <div class="termbox">chmod +x /entrypoint.sh</div>
     <p>Y en el Dockerfile se pone así:</p>
     <div class="termbox">COPY entrypoint.sh /entrypoint.sh
RUN <b>chmod +x</b> /entrypoint.sh</div>`},

 {t:"escribe", p:"Un script <code>/app/arranque.sh</code> da «permission denied». Escribe el comando que lo arregla",
  sol:["chmod +x /app/arranque.sh","chmod 755 /app/arranque.sh"],
  ph:"chmod ...",
  pista:"Añadir (+) el permiso de ejecución (x).",
  why:"<code>chmod +x</code> añade el permiso de ejecución. Cuando veas «permission denied» en un script, es esto el 90% de las veces."},

 {t:"vf", p:"<code>chown</code> cambia el <b>dueño</b> de un fichero y <code>chmod</code> cambia sus <b>permisos</b>.",
  ok:true,
  why:"Correcto. En los Dockerfile verás <code>RUN chown spring:spring /app/app.jar</code> para que el usuario sin privilegios pueda usar su propio fichero."}
]},

/* =============== U3 L4 =============== */
{
id:"dk3l4",
titulo:"PID 1 y las señales",
claves:["El proceso principal es PID 1; si muere, el contenedor se para","docker stop manda SIGTERM a PID 1","Forma exec = java es PID 1; forma shell = sh se come la señal"],
pasos:[
 {t:"info", eti:"El detalle que casi nadie sabe", h:"Qué es PID 1",
  c:`<p>En Linux cada proceso tiene un número, su <b>PID</b>. El primero que arranca el sistema recibe el número <b>1</b> y tiene responsabilidades especiales.</p>
     <p>Dentro de un contenedor, <b>el proceso principal de tu aplicación es el PID 1</b>. Compruébalo:</p>
     <div class="termbox">docker exec web ps aux
<span class="cm">PID   USER     COMMAND
<b>1</b>     root     nginx: master process nginx -g daemon off;</span></div>
     <p>Consecuencia directa: <b>si el PID 1 termina, el contenedor se para</b>. Siempre. No importa que haya otros procesos dentro.</p>`},

 {t:"opcion", p:"Dentro de un contenedor, ¿qué proceso es el PID 1?",
  ops:["El sistema operativo","El proceso principal de la aplicación","El daemon de Docker","No existe PID 1 en contenedores"],
  ok:1,
  why:"El que arranca el contenedor. Si es Java, java es PID 1. Y cuando termina, el contenedor se para."},

 {t:"info", eti:"Señales", h:"Cómo se le pide a un programa que termine",
  c:`<p>Linux avisa a los procesos con <b>señales</b>:</p>
     <ul><li><b>SIGTERM</b> (15): «termina cuando puedas». El programa puede capturarla, cerrar conexiones y guardar.</li>
     <li><b>SIGKILL</b> (9): «mueres ahora». No se puede capturar ni ignorar. Corta en seco.</li></ul>
     <p>Y ahora enlaza con lo que ya sabes: <code>docker stop</code> manda <b>SIGTERM</b> al PID 1, espera 10 segundos y, si sigue vivo, manda <b>SIGKILL</b>.</p>`},

 {t:"opcion", p:"Ves un contenedor con estado <code>Exited (137)</code>. ¿Qué ha pasado?",
  ops:["Ha terminado correctamente",
       "Lo han matado con SIGKILL: normalmente se quedó sin memoria (OOM) o alguien hizo docker kill",
       "No encontró la imagen",
       "Le falta una variable de entorno"],
  ok:1,
  why:"137 = 128 + 9, y 9 es SIGKILL. Es el código que delata un problema de memoria. Dato que impresiona en una entrevista."},

 {t:"info", eti:"La consecuencia práctica", h:"Forma exec contra forma shell",
  c:`<p>Aquí está la razón por la que en los Dockerfile se escribe con corchetes. Compara:</p>
     <div class="termbox"><span class="cm"># FORMA EXEC (lista JSON) — CORRECTA</span>
CMD <b>["java","-jar","app.jar"]</b>
<span class="cm">-> java es el PID 1, recibe el SIGTERM y Spring Boot cierra ordenadamente</span>

<span class="cm"># FORMA SHELL (texto suelto) — PROBLEMÁTICA</span>
CMD java -jar app.jar
<span class="cm">-> arranca /bin/sh -c "java -jar app.jar"
   el PID 1 es la SHELL, que NO reenvia la señal a java
   resultado: a los 10 segundos, SIGKILL y peticiones cortadas</span></div>`},

 {t:"opcion", p:"¿Por qué se recomienda <code>CMD [\"java\",\"-jar\",\"app.jar\"]</code> con corchetes?",
  ops:["Porque es más rápido de escribir",
       "Porque así la aplicación es el PID 1 y recibe SIGTERM, permitiendo un apagado elegante",
       "Porque los corchetes son obligatorios",
       "Porque ocupa menos"],
  ok:1,
  why:"La forma exec no mete una shell en medio. Es un detalle que muy pocos candidatos saben explicar: úsalo."},

 {t:"vf", p:"Si la aplicación ignora el SIGTERM, <code>docker stop</code> tarda 10 segundos y luego la mata a lo bruto.",
  ok:true,
  why:"Exacto: esos 10 segundos son el periodo de gracia. Si los ves en cada despliegue, tu app no está manejando la señal."},

 {t:"info", eti:"En Spring Boot", h:"Cómo se activa el apagado elegante",
  c:`<p>Spring Boot lo trae, pero hay que encenderlo en <code>application.properties</code>:</p>
     <div class="termbox">server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=20s</div>
     <p>Con eso, al recibir el SIGTERM espera a que terminen las peticiones en curso antes de cerrar. Junto con la forma exec del CMD, tienes despliegues sin cortar peticiones.</p>`},

 {t:"par", p:"Empareja cada elemento con su consecuencia",
  pares:[["PID 1 termina","El contenedor se para"],
         ["docker stop","SIGTERM y, tras 10 s, SIGKILL"],
         ["Exit code 137","Lo mató un SIGKILL (a menudo falta de memoria)"],
         ["Forma shell en CMD","La shell se come el SIGTERM"]],
  why:"Estas cuatro relaciones cubren casi todas las preguntas sobre el ciclo de vida de un contenedor."}
]}

]});
