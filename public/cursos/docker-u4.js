window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Construir tus propias imágenes",
resumen: "El Dockerfile instrucción por instrucción, capas, caché y multi-stage",
nivel: "Intermedio",
color: "#d97706",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"dk4l1",
titulo:"Qué hay dentro de una imagen: las capas",
claves:["Una imagen es una pila de capas de solo lectura","Cada instrucción del Dockerfile crea una capa","Las capas se cachean y se comparten entre imágenes"],
pasos:[
 {t:"info", eti:"Abrimos la caja", h:"Una imagen no es un bloque: es una pila",
  c:`<p>Hasta ahora has usado imágenes hechas por otros. Vamos a construir las tuyas, pero primero hay que entender cómo están hechas por dentro.</p>
     <p>Una imagen es una <b>pila de capas</b>, una encima de otra, todas de <b>solo lectura</b>:</p>
     <div class="diag">+--------------------------------+
| capa de escritura              | <- la pone el CONTENEDOR al arrancar
+================================+    (se borra con el)
| COPY app.jar                   | \\
+--------------------------------+  |
| RUN apt-get install curl       |  |  LA IMAGEN
+--------------------------------+  |  (solo lectura)
| FROM eclipse-temurin:21-jre    | /
+--------------------------------+</div>
     <p>Cada instrucción que escribas en el Dockerfile y que modifique ficheros <b>añade una capa nueva</b> encima.</p>`},

 {t:"info", eti:"Tres consecuencias", h:"Por qué esto importa tanto",
  c:`<ul><li><b>1. Se cachean.</b> Si una instrucción no ha cambiado, Docker reutiliza su capa y no la vuelve a ejecutar. De ahí que el orden del Dockerfile sea tan importante.</li>
     <li><b>2. Se comparten.</b> Si diez imágenes tuyas parten de <code>eclipse-temurin:21-jre-alpine</code>, esa capa se guarda <b>una sola vez</b> en el disco. Por eso "300 MB por imagen" no significa 3 GB en total.</li>
     <li><b>3. Son acumulativas.</b> Si una capa añade un fichero de 100 MB y una capa posterior lo borra, <b>la imagen sigue pesando esos 100 MB</b>: la capa anterior sigue ahí, debajo. Solo deja de verse.</li></ul>`},

 {t:"opcion", p:"Añades un fichero de 200 MB en un <code>RUN</code> y lo borras en el <code>RUN</code> siguiente. ¿Cuánto ocupa la imagen?",
  ops:["Nada, porque lo borraste",
       "Sigue ocupando esos 200 MB, porque la capa anterior los contiene",
       "El doble",
       "Depende del sistema operativo"],
  ok:1,
  why:"Esta es LA razón por la que en los Dockerfile ves <code>apt-get install ... && rm -rf /var/lib/apt/lists/*</code> todo en una misma línea: para que el borrado ocurra <b>dentro de la misma capa</b>."},

 {t:"vf", p:"Si dos imágenes distintas parten de la misma imagen base, esa base se guarda dos veces en el disco.",
  ok:false,
  why:"No: las capas se comparten. Se guarda una sola vez y ambas imágenes la referencian."},

 {t:"info", eti:"Verlo", h:"docker history",
  c:`<p>Puedes ver las capas de cualquier imagen y cuánto pesa cada una:</p>
     <div class="termbox">docker history nginx:alpine</div>
     <p>Es el comando para investigar por qué una imagen pesa 1 GB: te enseña qué instrucción la engordó.</p>`},

 {t:"escribe", p:"Escribe el comando que muestra las capas de la imagen <code>postgres:16-alpine</code>",
  sol:["docker history postgres:16-alpine"],
  ph:"docker ...",
  pista:"El sustantivo es «historia» en inglés.",
  why:"<code>docker history</code>. Úsalo cuando tengas que justificar o reducir el tamaño de una imagen."},

 {t:"opcion", p:"¿Dónde va lo que escribe un contenedor en marcha?",
  ops:["En la última capa de la imagen",
       "En una capa de escritura propia, que se crea al arrancar y se borra con el contenedor",
       "En el disco duro del anfitrión, en cualquier sitio",
       "En el registry"],
  ok:1,
  why:"Capa de escritura = efímera. Por eso los datos que deben sobrevivir necesitan un volumen, que veremos más adelante."}
]},

/* =============== U4 L2 =============== */
{
id:"dk4l2",
titulo:"Tu primer Dockerfile",
claves:["FROM, WORKDIR, COPY, CMD: el esqueleto mínimo","docker build -t nombre:tag .","El punto final es el contexto, no una decoración"],
pasos:[
 {t:"info", eti:"Qué es", h:"Un Dockerfile es una receta",
  c:`<p>Un <b>Dockerfile</b> es un fichero de texto (sin extensión, se llama literalmente <code>Dockerfile</code>) con los pasos para construir una imagen.</p>
     <p>Lo importante: al estar en texto, <b>va en el repositorio de Git</b> junto al código. Cualquiera puede reconstruir exactamente la misma imagen. Eso es reproducibilidad.</p>`},

 {t:"info", eti:"El esqueleto", h:"Las cuatro instrucciones mínimas",
  c:`<div class="termbox"><b>FROM</b> eclipse-temurin:21-jre-alpine
<b>WORKDIR</b> /app
<b>COPY</b> app.jar app.jar
<b>CMD</b> ["java","-jar","app.jar"]</div>
     <p>Léelo como una receta, de arriba abajo:</p>
     <ul><li><b>FROM</b>: de qué imagen partimos. Siempre es la primera instrucción. Aquí: un Linux Alpine con Java 21 ya instalado.</li>
     <li><b>WORKDIR</b>: la carpeta de trabajo dentro de la imagen. Si no existe, la crea. Todo lo que venga después ocurre ahí.</li>
     <li><b>COPY</b>: copia un fichero <b>de tu ordenador</b> a <b>dentro de la imagen</b>.</li>
     <li><b>CMD</b>: qué programa se ejecuta cuando alguien arranque un contenedor de esta imagen.</li></ul>`},

 {t:"par", p:"Empareja cada instrucción con lo que hace",
  pares:[["FROM","De qué imagen base partimos"],
         ["WORKDIR","Fija la carpeta de trabajo dentro de la imagen"],
         ["COPY","Lleva ficheros de tu máquina a la imagen"],
         ["CMD","Qué se ejecuta al arrancar el contenedor"]],
  why:"Con estas cuatro ya puedes empaquetar casi cualquier aplicación."},

 {t:"orden", p:"Ordena las instrucciones de un Dockerfile mínimo",
  items:["FROM eclipse-temurin:21-jre-alpine","WORKDIR /app","COPY app.jar app.jar",'CMD ["java","-jar","app.jar"]'],
  why:"FROM siempre primero (necesitas una base antes de copiar nada) y CMD normalmente al final, porque no se ejecuta durante la construcción sino al arrancar."},

 {t:"opcion", p:"¿Por qué <code>WORKDIR /app</code> es mejor que poner <code>RUN cd /app</code>?",
  ops:["Porque es más corto",
       "Porque cada RUN se ejecuta en una capa distinta: el cd no se recuerda en la instrucción siguiente, WORKDIR sí",
       "Porque cd no existe en Linux",
       "Son idénticos"],
  ok:1,
  why:"Cada RUN arranca su propia shell. El <code>cd</code> se olvida. <code>WORKDIR</code> persiste para todas las instrucciones siguientes y también al arrancar el contenedor."},

 {t:"info", eti:"Construir", h:"docker build -t nombre:tag .",
  c:`<div class="termbox">docker build <b>-t</b> mi-api:1.0.0 <span class="hi">.</span></div>
     <ul><li><code>-t</code> (<i>tag</i>): el nombre que le pones a la imagen. Sin esto, la imagen sale sin nombre y es incomodísima de usar.</li>
     <li><span class="hi">.</span> el punto final: <b>no es decoración</b>. Es el <b>contexto de construcción</b>: la carpeta que se le envía al daemon para que pueda copiar ficheros. Lo vemos en la lección siguiente.</li></ul>
     <p>Al terminar, la imagen aparece en <code>docker images</code> y ya puedes hacer <code>docker run mi-api:1.0.0</code>.</p>`},

 {t:"escribe", p:"Escribe el comando que construye una imagen llamada <code>mi-api</code> con el tag <code>1.0.0</code> usando el Dockerfile de la carpeta actual",
  sol:["docker build -t mi-api:1.0.0 .","docker build --tag mi-api:1.0.0 ."],
  ph:"docker build ...",
  pista:"No olvides el punto del final: es la carpeta actual.",
  why:"<code>docker build -t mi-api:1.0.0 .</code> — olvidar el punto es el error más frecuente al construir: Docker te dirá que faltan argumentos."},

 {t:"hueco", p:"Completa el Dockerfile: parte de Alpine con JRE 21, trabaja en /app y arranca el jar",
  tpl:"___ eclipse-temurin:21-jre-alpine\n___ /app\nCOPY app.jar app.jar\n___ [\"java\",\"-jar\",\"app.jar\"]",
  banco:["FROM","WORKDIR","CMD","RUN","COPY"],
  sol:["FROM","WORKDIR","CMD"],
  why:"Ese es el esqueleto que deberías poder escribir de memoria en una pizarra."},

 {t:"opcion", p:"Construyes con <code>docker build .</code> sin <code>-t</code>. ¿Qué pasa?",
  ops:["Falla",
       "La imagen se construye pero queda sin nombre: aparece como &lt;none&gt; y tienes que usar su ID",
       "Se llama latest",
       "Se sube al registry"],
  ok:1,
  why:"Esas imágenes &lt;none&gt; se llaman «dangling» y son las que limpia <code>docker image prune</code>. Pon siempre -t."}
]},

/* =============== U4 L3 =============== */
{
id:"dk4l3",
titulo:"El contexto y el .dockerignore",
claves:["El punto final envía esa carpeta entera al daemon",".dockerignore excluye lo que no debe viajar","Nunca metas .git ni .env en la imagen"],
pasos:[
 {t:"info", eti:"El punto", h:"Qué es el contexto de construcción",
  c:`<p>Cuando ejecutas <code>docker build -t api .</code>, ocurre algo que no se ve: <b>Docker empaqueta toda la carpeta</b> (el punto) <b>y se la envía al daemon</b>.</p>
     <p>Tiene que hacerlo porque el daemon es un proceso aparte (recuerda la arquitectura CLI → daemon) y necesita tener los ficheros a mano para poder copiarlos con <code>COPY</code>.</p>
     <p>Por eso, si en tu carpeta hay una carpeta <code>target/</code> de 800 MB y un <code>.git/</code> de 300 MB, cada construcción empieza mandando <b>1,1 GB</b> por el túnel. Y se nota.</p>`},

 {t:"opcion", p:"Tu build tarda 40 segundos solo en la línea «transferring context». ¿Qué está pasando?",
  ops:["Internet va lento",
       "La carpeta del proyecto tiene mucho peso y se está enviando entera al daemon: falta un .dockerignore",
       "La imagen base es muy grande",
       "El Dockerfile tiene demasiadas instrucciones"],
  ok:1,
  why:"Ese mensaje es literalmente el envío del contexto. Se arregla con un .dockerignore."},

 {t:"info", eti:"La solución", h:"El fichero .dockerignore",
  c:`<p>Funciona igual que un <code>.gitignore</code>: se pone en la misma carpeta que el Dockerfile y lista lo que <b>no</b> debe viajar:</p>
     <div class="termbox"><span class="cm"># .dockerignore</span>
target/
.git/
.idea/
*.log
.env
README.md</div>
     <p>Tiene tres beneficios, y conviene saberlos los tres:</p>
     <ul><li><b>Velocidad</b>: el contexto es pequeño.</li>
     <li><b>Tamaño</b>: si haces <code>COPY . .</code>, no se cuela basura dentro de la imagen.</li>
     <li><b>Seguridad</b>: evita que un <code>.env</code> con contraseñas o el historial de <code>.git</code> acaben dentro de una imagen que luego publicas.</li></ul>`},

 {t:"opcion", p:"¿Cuál es el motivo de SEGURIDAD para tener un .dockerignore?",
  ops:["Cifra la imagen",
       "Evita que ficheros con secretos (.env) o el historial de git acaben dentro de la imagen publicada",
       "Bloquea el acceso al contenedor",
       "Firma la imagen"],
  ok:1,
  why:"Una imagen se publica y cualquiera con acceso puede extraer sus capas. Todo lo que entra, se puede sacar."},

 {t:"vf", p:"El <code>.dockerignore</code> afecta a lo que se envía al daemon y a lo que puede copiar el <code>COPY</code>.",
  ok:true,
  why:"Sí: lo ignorado no viaja, así que <code>COPY . .</code> no puede copiarlo aunque quiera."},

 {t:"info", eti:"COPY y ADD", h:"Dos instrucciones parecidas, una preferida",
  c:`<ul><li><b>COPY origen destino</b>: copia ficheros y carpetas. Simple y predecible.</li>
     <li><b>ADD origen destino</b>: hace lo mismo <b>y además</b> descomprime automáticamente ficheros .tar y puede descargar URLs.</li></ul>
     <p>La recomendación oficial es usar <b>COPY</b> salvo que necesites específicamente descomprimir un tar. ¿Por qué? Porque ADD tiene comportamientos implícitos (descomprime sin avisar) y eso genera sorpresas.</p>
     <div class="nota dato"><b class="tit">Pregunta típica</b>«¿COPY o ADD?» → «COPY, porque es explícito; ADD solo si necesito descomprimir un tar, y para descargar prefiero curl dentro de un RUN, que además me deja limpiar en la misma capa.»</div>`},

 {t:"opcion", p:"¿Cuál usarías para copiar el jar de tu aplicación a la imagen?",
  ops:["ADD, porque es más moderno","COPY, porque es explícito y no tiene comportamientos ocultos","Cualquiera, da igual","MOVE"],
  ok:1,
  why:"COPY. El consejo oficial de Docker y una respuesta que se espera en la entrevista."},

 {t:"hueco", p:"Completa la línea del .dockerignore que evita subir la carpeta de compilación de Maven",
  tpl:"___\n.git/\n.env",
  banco:["target/","src/","pom.xml","Dockerfile"],
  sol:["target/"],
  why:"<code>target/</code> es donde Maven deja los .class y el jar: pesa mucho y no debe viajar, porque el jar se genera durante la construcción."}
]},

/* =============== U4 L4 =============== */
{
id:"dk4l4",
titulo:"RUN y la caché de capas",
claves:["RUN se ejecuta al CONSTRUIR; CMD al ARRANCAR","Si una capa se invalida, todas las siguientes también","Lo que cambia poco va arriba; lo que cambia mucho, abajo"],
pasos:[
 {t:"info", eti:"RUN", h:"RUN ejecuta cosas durante la construcción",
  c:`<p>La instrucción <b>RUN</b> ejecuta un comando <b>mientras se construye la imagen</b>, y el resultado se queda grabado en una capa.</p>
     <div class="termbox">RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*</div>
     <p>No confundas:</p>
     <ul><li><b>RUN</b> → ocurre <b>una vez</b>, al construir. Instalar paquetes, compilar, crear usuarios.</li>
     <li><b>CMD</b> → ocurre <b>cada vez</b> que arranca un contenedor. Arrancar tu aplicación.</li></ul>`},

 {t:"opcion", p:"Quieres que la imagen lleve curl instalado. ¿Qué instrucción usas?",
  ops:["CMD apt-get install curl","RUN apt-get install -y curl","ENTRYPOINT curl","COPY curl"],
  ok:1,
  why:"RUN, porque debe ocurrir al construir y quedarse grabado en la imagen. El -y responde «sí» a las preguntas para que no se quede esperando."},

 {t:"info", eti:"La caché", h:"La regla que lo explica todo",
  c:`<p>Docker recorre el Dockerfile de arriba abajo. Para cada instrucción se pregunta: «¿ha cambiado algo respecto a la última vez?».</p>
     <ul><li>Si <b>no</b> ha cambiado → reutiliza la capa. En la salida verás <b>CACHED</b> y tarda 0 segundos.</li>
     <li>Si <b>sí</b> ha cambiado → la reconstruye... <b>y también todas las que vienen después</b>, aunque esas no hayan cambiado.</li></ul>
     <div class="nota ojo"><b class="tit">La regla de oro</b>En cuanto se rompe la caché en un punto, se rompe desde ahí hacia abajo. Por eso: <b>lo que cambia poco va arriba, lo que cambia mucho va abajo</b>.</div>`},

 {t:"info", eti:"Aplicado a Java", h:"El truco del pom.xml",
  c:`<p>Compara estas dos versiones. Ambas funcionan, pero una tarda 3 minutos en cada cambio de código y la otra 15 segundos:</p>
     <div class="termbox"><span class="cm"># MAL: cualquier cambio en cualquier fichero</span>
<span class="cm">#      obliga a redescargar TODO Maven</span>
COPY . .
RUN mvn package</div>
     <div class="termbox"><span class="cm"># BIEN: las dependencias se cachean aparte</span>
COPY pom.xml .
RUN mvn dependency:go-offline -B   <span class="cm">&lt;- 3 minutos, pero se cachea</span>
COPY src ./src                      <span class="cm">&lt;- esto cambia en cada commit</span>
RUN mvn package -DskipTests -B      <span class="cm">&lt;- solo esto se repite</span></div>
     <p>Como <code>pom.xml</code> casi nunca cambia, la descarga de dependencias se reutiliza una y otra vez. Solo se recompila cuando tocas el código.</p>`},

 {t:"opcion", p:"¿Por qué se copia <code>pom.xml</code> ANTES que <code>src</code>?",
  ops:["Porque Maven lo exige",
       "Para que la descarga de dependencias quede en una capa que se cachea, y solo se repita cuando cambia el pom",
       "Porque el pom.xml pesa menos",
       "Por orden alfabético"],
  ok:1,
  why:"Es LA pregunta de optimización de builds. Sepáralo siempre: primero las dependencias, luego el código fuente."},

 {t:"orden", p:"Ordena las instrucciones para aprovechar al máximo la caché",
  items:["FROM maven:3.9-eclipse-temurin-21","COPY pom.xml .","RUN mvn dependency:go-offline -B","COPY src ./src","RUN mvn package -DskipTests -B"],
  why:"De lo más estable a lo más volátil. Este orden exacto es el que debes poder escribir en una entrevista."},

 {t:"info", eti:"Menos capas", h:"Por qué se encadena con &&",
  c:`<div class="termbox"><span class="cm"># MAL: tres capas, y la cache de apt se queda dentro para siempre</span>
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

<span class="cm"># BIEN: una sola capa; el borrado ocurre DENTRO de ella</span>
RUN apt-get update && apt-get install -y curl \\
    && rm -rf /var/lib/apt/lists/*</div>
     <p>Recuerda la lección de las capas: borrar en una capa posterior <b>no reduce el tamaño</b>. Hay que limpiar en la misma instrucción.</p>
     <p>La barra <code>\\</code> al final permite partir una línea larga en varias para que se lea mejor.</p>`},

 {t:"vf", p:"Poner el <code>rm -rf /var/lib/apt/lists/*</code> en un RUN separado reduce igual el tamaño de la imagen.",
  ok:false,
  why:"No. La capa anterior ya contiene esos ficheros y sigue estando en la imagen. Hay que limpiar en la MISMA instrucción RUN."},

 {t:"opcion", p:"Cambias una línea de código Java y el build vuelve a descargar todas las dependencias de Maven. ¿Qué está mal?",
  ops:["Falta el flag --no-cache",
       "El Dockerfile hace COPY de todo antes de resolver dependencias: hay que separar pom.xml y src",
       "Maven está mal instalado",
       "Hay que borrar la imagen antes de construir"],
  ok:1,
  why:"Caso real de entrevista. La respuesta es reordenar: pom.xml → dependencias → src → package."},

 {t:"info", eti:"Forzar", h:"Cuando quieres ignorar la caché",
  c:`<p>A veces quieres reconstruir desde cero (por ejemplo, para asegurarte de que coges la última versión de un paquete del sistema):</p>
     <div class="termbox">docker build --no-cache -t mi-api:1.0.0 .</div>
     <p>Tarda lo que tarde, pero garantiza que nada viene de una capa vieja.</p>`}
]},

/* =============== U4 L5 =============== */
{
id:"dk4l5",
titulo:"CMD y ENTRYPOINT",
claves:["ENTRYPOINT = el ejecutable fijo; CMD = sus argumentos por defecto","Lo que pasas en docker run sustituye al CMD, no al ENTRYPOINT","Forma exec (corchetes) siempre"],
pasos:[
 {t:"info", eti:"Las dos formas de arrancar", h:"Se parecen, pero no son lo mismo",
  c:`<p>Las dos dicen qué se ejecuta al arrancar el contenedor, pero se comportan distinto cuando el usuario pasa argumentos.</p>
     <p><b>Solo con CMD:</b></p>
     <div class="termbox">CMD ["java","-jar","app.jar"]

docker run mi-api                     <span class="cm">-> java -jar app.jar</span>
docker run mi-api <b>echo hola</b>            <span class="cm">-> echo hola  (SUSTITUYE todo)</span></div>
     <p>Lo que escribes al final de <code>docker run</code> <b>reemplaza el CMD entero</b>. Por eso puedes hacer <code>docker run ubuntu bash</code>.</p>`},

 {t:"info", eti:"ENTRYPOINT", h:"El ejecutable que no se puede cambiar",
  c:`<div class="termbox">ENTRYPOINT ["java","-jar","app.jar"]
CMD ["--spring.profiles.active=dev"]

docker run mi-api
   <span class="cm">-> java -jar app.jar --spring.profiles.active=dev</span>

docker run mi-api <b>--spring.profiles.active=prod</b>
   <span class="cm">-> java -jar app.jar --spring.profiles.active=prod</span>
   <span class="cm">   (solo se sustituyo el CMD; el ENTRYPOINT se mantiene)</span></div>
     <p>Resumen para la entrevista: <b>ENTRYPOINT = qué se ejecuta. CMD = los argumentos por defecto.</b></p>`},

 {t:"opcion", p:"Con <code>ENTRYPOINT [\"java\",\"-jar\",\"app.jar\"]</code> y <code>CMD [\"--profile=dev\"]</code>, ¿qué ejecuta <code>docker run api --profile=prod</code>?",
  ops:["--profile=prod",
       "java -jar app.jar --profile=prod",
       "java -jar app.jar --profile=dev --profile=prod",
       "Da error"],
  ok:1,
  why:"El argumento sustituye al CMD y se añade al ENTRYPOINT. Así se hacen imágenes configurables sin perder el control de qué se ejecuta."},

 {t:"opcion", p:"¿Cuándo te interesa usar solo CMD, sin ENTRYPOINT?",
  ops:["Nunca",
       "Cuando quieres poder sustituir el comando fácilmente, por ejemplo para entrar con una shell a depurar",
       "Siempre, ENTRYPOINT está obsoleto",
       "Solo en imágenes de bases de datos"],
  ok:1,
  why:"Con solo CMD, <code>docker run mi-imagen sh</code> te deja entrar. Con ENTRYPOINT fijo necesitas <code>--entrypoint sh</code>. Es un compromiso entre flexibilidad y control."},

 {t:"info", eti:"Repaso importante", h:"Forma exec contra forma shell (otra vez)",
  c:`<p>Ya lo viste con PID 1, y aquí es donde se aplica:</p>
     <div class="termbox">CMD ["java","-jar","app.jar"]     <span class="cm">EXEC  -> java es PID 1 -> recibe SIGTERM</span>
CMD java -jar app.jar             <span class="cm">SHELL -> sh es PID 1  -> se come la señal</span></div>
     <p>Usa <b>siempre</b> la forma con corchetes. ¿Y si necesitas una variable de shell, como <code>$JAVA_OPTS</code>?</p>
     <div class="termbox">ENTRYPOINT ["sh","-c","<b>exec</b> java $JAVA_OPTS -jar /app/app.jar"]</div>
     <p>Ese <code>exec</code> de dentro hace que java <b>sustituya</b> a la shell y vuelva a ser el PID 1. Es un detalle fino que demuestra que sabes lo que haces.</p>`},

 {t:"vf", p:"<code>CMD java -jar app.jar</code> (sin corchetes) funciona, pero impide el apagado elegante.",
  ok:true,
  why:"Funciona, sí, pero mete una shell como PID 1 que no reenvía el SIGTERM. Se ve como despliegues que cortan peticiones."},

 {t:"hueco", p:"Completa un arranque correcto en forma exec",
  tpl:'CMD [___, "-jar", ___]',
  banco:['"java"','"app.jar"','java','app.jar'],
  sol:['"java"','"app.jar"'],
  why:"En la forma exec es una lista JSON: cada elemento entre comillas dobles y separado por comas. Con comillas simples no es JSON válido y falla."},

 {t:"opcion", p:"Una imagen tiene <code>ENTRYPOINT [\"java\",\"-jar\",\"app.jar\"]</code>. Quieres entrar con una shell para depurar. ¿Cómo?",
  ops:["docker run imagen sh",
       "docker run --entrypoint sh -it imagen",
       "No se puede",
       "docker exec imagen sh"],
  ok:1,
  why:"El flag <code>--entrypoint</code> lo sustituye. (docker exec no vale aquí: eso es para un contenedor ya en marcha.)"}
]},

/* =============== U4 L6 =============== */
{
id:"dk4l6",
titulo:"ENV, ARG, EXPOSE, USER y HEALTHCHECK",
claves:["EXPOSE solo documenta: NO publica","ARG solo existe en build; ENV persiste","Ninguno de los dos vale para secretos"],
pasos:[
 {t:"info", eti:"EXPOSE", h:"La instrucción que engaña a todo el mundo",
  c:`<div class="termbox">EXPOSE 8080</div>
     <p>Parece que abre el puerto 8080. <b>No abre nada.</b></p>
     <p>EXPOSE es <b>documentación</b>: deja escrito en la imagen «esta aplicación escucha en el 8080», para que quien la use sepa qué publicar. Nada más.</p>
     <p>Para abrir de verdad el puerto sigue haciendo falta <code>-p 8080:8080</code> al arrancar, o <code>ports:</code> en compose.</p>
     <div class="nota ojo"><b class="tit">Pregunta trampa</b>«¿Qué hace EXPOSE?» → «Documentar. Publicar es -p.» Si contestas que abre el puerto, es un suspenso directo.</div>`},

 {t:"vf", p:"Si el Dockerfile tiene <code>EXPOSE 8080</code>, puedes entrar desde tu navegador sin usar <code>-p</code>.",
  ok:false,
  why:"No. EXPOSE no publica nada. Sin -p (o ports: en compose) no hay acceso desde el host."},

 {t:"info", eti:"ENV", h:"Variables que viven en la imagen",
  c:`<div class="termbox">ENV SERVER_PORT=8080 \\
    JAVA_OPTS="-XX:MaxRAMPercentage=75.0"</div>
     <p><b>ENV</b> define variables de entorno que existen <b>durante la construcción y dentro del contenedor</b>. Sirven para valores por defecto.</p>
     <p>Y se pueden sobrescribir al arrancar sin reconstruir nada:</p>
     <div class="termbox">docker run -e SERVER_PORT=9000 mi-api</div>
     <p>Eso es lo que permite que la misma imagen valga para todos los entornos.</p>`},

 {t:"info", eti:"ARG", h:"Variables que solo existen mientras se construye",
  c:`<div class="termbox">ARG VERSION=1.0.0
LABEL version=$VERSION</div>
     <div class="termbox">docker build --build-arg VERSION=2.0.0 -t api:2.0.0 .</div>
     <p>Diferencia clave:</p>
     <ul><li><b>ARG</b>: existe solo durante <code>docker build</code>. Al arrancar el contenedor ya no está.</li>
     <li><b>ENV</b>: se queda grabada en la imagen y está disponible en el contenedor.</li></ul>`},

 {t:"opcion", p:"Quieres pasar la versión al construir, pero que no quede como variable dentro del contenedor. ¿Cuál usas?",
  ops:["ENV","ARG","CMD","LABEL"],
  ok:1,
  why:"ARG vive solo durante el build. ENV persistiría dentro del contenedor."},

 {t:"info", eti:"Seguridad", h:"Ni ARG ni ENV sirven para secretos",
  c:`<p>Un error grave y muy común:</p>
     <div class="termbox"><span class="cm"># NUNCA HAGAS ESTO</span>
ENV DB_PASSWORD=supersecreto123</div>
     <p>Esa contraseña queda <b>grabada en la imagen</b>. Cualquiera que tenga la imagen puede verla con <code>docker inspect</code> o <code>docker history</code>. Y con ARG pasa lo mismo: queda en el historial de capas.</p>
     <p>Los secretos se inyectan <b>en tiempo de ejecución</b> (variables de entorno al arrancar, Docker secrets, un gestor como Vault) o, si hacen falta durante el build, con la función de secretos de BuildKit:</p>
     <div class="termbox">RUN --mount=type=secret,id=token ...
docker build --secret id=token,src=token.txt .</div>`},

 {t:"opcion", p:"¿Dónde pones la contraseña de la base de datos?",
  ops:["En un ENV del Dockerfile",
       "En un ARG del Dockerfile",
       "Fuera de la imagen: se inyecta al arrancar, o con secretos del gestor/CI",
       "En un fichero dentro de la imagen"],
  ok:2,
  why:"Fuera de la imagen, siempre. Las tres primeras opciones dejan el secreto dentro de un artefacto que se distribuye."},

 {t:"info", eti:"USER", h:"Dejar de ser root",
  c:`<div class="termbox">RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=builder /build/target/app.jar app.jar
RUN chown spring:spring /app/app.jar
<b>USER spring</b></div>
     <p>A partir de <code>USER</code>, todo (el resto del build y el contenedor en marcha) se ejecuta con ese usuario sin privilegios.</p>
     <p>Ojo al orden: primero copias y das permisos siendo root, y <b>después</b> cambias de usuario. Si cambias antes, no podrás escribir donde haga falta.</p>`},

 {t:"info", eti:"HEALTHCHECK", h:"Que Docker sepa si tu app está viva",
  c:`<div class="termbox">HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1</div>
     <ul><li><b>--interval</b>: cada cuánto comprueba.</li>
     <li><b>--start-period</b>: tiempo de cortesía al arrancar (Spring Boot tarda unos segundos; sin esto lo marcaría como enfermo al principio).</li>
     <li><b>--retries</b>: cuántos fallos seguidos antes de darlo por «unhealthy».</li></ul>
     <p>Con esto, <code>docker ps</code> muestra <code>(healthy)</code> o <code>(unhealthy)</code>. Y lo más útil: en Compose podrás decir «no arranques la API hasta que la base de datos esté <b>healthy</b>».</p>`},

 {t:"par", p:"Empareja cada instrucción con su efecto",
  pares:[["EXPOSE","Solo documenta el puerto"],
         ["ENV","Variable que persiste en el contenedor"],
         ["ARG","Variable solo durante el build"],
         ["USER","Ejecuta como un usuario sin privilegios"],
         ["HEALTHCHECK","Comprueba periódicamente si la app responde"]],
  why:"Estas cinco, más FROM/WORKDIR/COPY/RUN/CMD/ENTRYPOINT, son el Dockerfile completo."}
]},

/* =============== U4 L7 =============== */
{
id:"dk4l7",
titulo:"Multi-stage: de 949 MB a 372 MB",
claves:["Compila en una etapa, ejecuta en otra limpia","COPY --from=builder trae solo el artefacto","Menos peso y menos superficie de ataque"],
pasos:[
 {t:"info", eti:"El problema", h:"Para compilar necesitas mucho más que para ejecutar",
  c:`<p>Para compilar tu aplicación Java necesitas el <b>JDK</b> completo, <b>Maven</b>, y Maven se descarga cientos de megas de dependencias en la carpeta <code>~/.m2</code>.</p>
     <p>Pero para <b>ejecutar</b> el jar solo necesitas el <b>JRE</b>.</p>
     <p>Si construyes todo en una sola imagen, esa imagen se lleva a producción el compilador, Maven, el repositorio de dependencias y tu código fuente. Resultado real medido en tu laboratorio: <b>949 MB</b>.</p>`},

 {t:"info", eti:"La solución", h:"Dos etapas en el mismo fichero",
  c:`<div class="termbox"><span class="cm"># ---------- ETAPA 1: compilar ----------</span>
FROM maven:3.9-eclipse-temurin-21 <b>AS builder</b>
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

<span class="cm"># ---------- ETAPA 2: ejecutar ----------</span>
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY <b>--from=builder</b> /build/target/app.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]</div>
     <p>El segundo <code>FROM</code> <b>empieza de cero</b>: una imagen limpia. Y <code>COPY --from=builder</code> trae <b>solo el jar</b> de la etapa anterior.</p>
     <p>Todo lo demás (JDK, Maven, .m2, código fuente) <b>se descarta</b>. Resultado: <b>372 MB</b>.</p>`},

 {t:"opcion", p:"¿Qué hace exactamente <code>COPY --from=builder /build/target/app.jar app.jar</code>?",
  ops:["Copia un fichero de tu ordenador",
       "Copia un fichero desde la etapa anterior del build a la imagen final",
       "Descarga el jar de internet",
       "Renombra la imagen"],
  ok:1,
  why:"Trae solo ese fichero de la etapa llamada builder. Es la instrucción que hace posible el multi-stage."},

 {t:"opcion", p:"Aparte del tamaño, ¿qué otra ventaja tiene el multi-stage? (la que más valora un entrevistador)",
  ops:["Compila más rápido",
       "Menos superficie de ataque: la imagen de producción no lleva compilador, ni Maven, ni el código fuente",
       "Permite usar más lenguajes",
       "Evita tener que usar tags"],
  ok:1,
  why:"Seguridad. Si alguien entra en tu contenedor, no encuentra herramientas de compilación ni tu código fuente ni las credenciales del repositorio Maven."},

 {t:"vf", p:"En un multi-stage, las capas de la etapa de compilación acaban dentro de la imagen final.",
  ok:false,
  why:"No. La imagen final solo contiene su propia base más lo que copiaste con --from. Lo demás se queda fuera."},

 {t:"orden", p:"Ordena un Dockerfile multi-stage completo",
  items:["FROM maven:3.9-eclipse-temurin-21 AS builder","COPY pom.xml .","RUN mvn dependency:go-offline -B","COPY src ./src","RUN mvn clean package -DskipTests -B","FROM eclipse-temurin:21-jre-alpine","COPY --from=builder /build/target/app.jar app.jar","USER spring",'ENTRYPOINT ["java","-jar","/app/app.jar"]'],
  why:"Este es exactamente el Dockerfile que deberías poder escribir en una pizarra el martes. Repítelo hasta que te salga solo."},

 {t:"info", eti:"Reducir más", h:"El repertorio completo para adelgazar una imagen",
  c:`<p>Si te preguntan «¿cómo reducirías una imagen de 1 GB?», enumera:</p>
     <ul><li><b>Multi-stage</b>: lo que más quita, de largo.</li>
     <li><b>Base mínima</b>: <code>-alpine</code> o <code>-slim</code> en vez de la completa; y si te atreves, <code>distroless</code>.</li>
     <li><b>.dockerignore</b>: que no entre basura.</li>
     <li><b>Encadenar RUN</b> y limpiar cachés en la misma capa.</li>
     <li><b>No instalar</b> lo que no haga falta (nada de vim ni curl en producción si no se usan).</li>
     <li><b>Medir</b> con <code>docker history</code> para ver qué capa engorda.</li></ul>`},

 {t:"opcion", p:"Enumera de memoria: ¿cuál de estas NO reduce el tamaño de la imagen?",
  ops:["Usar multi-stage","Usar una imagen base alpine","Añadir EXPOSE 8080","Encadenar los RUN y limpiar la caché de apt en la misma capa"],
  ok:2,
  why:"EXPOSE no cambia el tamaño: solo documenta. Las otras tres sí."},

 {t:"info", eti:"Otra ventaja", h:"El build ya no depende de tu máquina",
  c:`<p>Fíjate en algo que quizá se te ha pasado: para construir esa imagen <b>no necesitas tener Java ni Maven instalados</b>. Todo ocurre dentro de la etapa <code>builder</code>.</p>
     <p>Eso significa que el build es <b>reproducible</b>: tú, tu compañero y el servidor de integración continua obtenéis exactamente el mismo resultado, con las mismas versiones.</p>
     <div class="nota dato"><b class="tit">Frase para la entrevista</b>«Compilo dentro de Docker: el build no depende de lo que tenga instalado cada máquina, así que es reproducible en local y en el CI.»</div>`}
]},

/* =============== U4 L8 =============== */
{
id:"dk4l8",
titulo:"Repaso: el Dockerfile de producción",
claves:["Sabes escribirlo entero y explicar cada línea","Tag fijo, usuario no root, healthcheck y forma exec","Los 7 fallos clásicos y cómo se arreglan"],
pasos:[
 {t:"info", eti:"El examen", h:"Vamos a revisar un Dockerfile malo",
  c:`<p>Este Dockerfile funciona, pero tiene siete problemas. En las siguientes preguntas los vas a ir detectando tú.</p>
     <div class="termbox">FROM maven:latest
WORKDIR /app
COPY . .
RUN mvn clean package
RUN apt-get update
RUN apt-get install -y curl
ENV DB_PASSWORD=supersecreto123
EXPOSE 8080
CMD mvn spring-boot:run</div>`},

 {t:"opcion", p:"Fallo 1: <code>FROM maven:latest</code>. ¿Qué dos cosas están mal?",
  ops:["Nada, es correcto",
       "El tag latest no es reproducible, y además usar la imagen de Maven como imagen final mete el compilador en producción",
       "Maven no se puede usar en Docker",
       "Falta el nombre de usuario"],
  ok:1,
  why:"Dos fallos en una línea: tag flotante y ausencia de multi-stage. La imagen final debería ser un JRE ligero."},

 {t:"opcion", p:"Fallo 2: <code>COPY . .</code> justo antes de <code>RUN mvn clean package</code>. ¿Por qué es un problema?",
  ops:["Copia demasiados ficheros y ya está",
       "Rompe la caché: cualquier cambio en cualquier fichero obliga a volver a descargar todas las dependencias de Maven",
       "No funciona en Windows",
       "Hay que usar ADD"],
  ok:1,
  why:"Hay que separar: COPY pom.xml → dependencias → COPY src → package."},

 {t:"opcion", p:"Fallo 3: los tres <code>RUN</code> de apt-get separados. ¿Qué problema tienen?",
  ops:["Ninguno",
       "Crean tres capas, y además la caché de apt nunca se limpia dentro de su propia capa",
       "apt-get no existe",
       "Hay que usar apk"],
  ok:1,
  why:"Se encadenan con && y se limpia en la misma instrucción: <code>apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*</code>."},

 {t:"opcion", p:"Fallo 4: <code>ENV DB_PASSWORD=supersecreto123</code>",
  ops:["Está bien, así la app tiene la contraseña",
       "Graba un secreto dentro de la imagen: visible con docker inspect y docker history",
       "Falta ponerlo en mayúsculas",
       "Debería ser un ARG"],
  ok:1,
  why:"Ni ENV ni ARG: los secretos se inyectan al arrancar o con el gestor de secretos."},

 {t:"opcion", p:"Fallo 5: el Dockerfile no tiene <code>USER</code>. ¿Qué implica?",
  ops:["Que no arranca",
       "Que el contenedor corre como root, con el riesgo de seguridad que eso supone",
       "Que no se puede publicar",
       "Que consume más CPU"],
  ok:1,
  why:"Hay que crear un usuario sin privilegios y añadir USER antes del arranque."},

 {t:"opcion", p:"Fallo 6: <code>CMD mvn spring-boot:run</code>. ¿Qué dos cosas están mal?",
  ops:["Nada",
       "Es forma shell (la shell se come el SIGTERM) y además arranca con Maven en producción en vez de ejecutar el jar",
       "Falta el puerto",
       "spring-boot:run no existe"],
  ok:1,
  why:'Lo correcto: <code>ENTRYPOINT ["java","-jar","/app/app.jar"]</code>. Maven no pinta nada en una imagen de producción.'},

 {t:"opcion", p:"Fallo 7: ¿qué le falta para que Docker y Compose sepan si la aplicación está viva?",
  ops:["Un HEALTHCHECK","Un VOLUME","Un LABEL","Un ARG"],
  ok:0,
  why:"Sin HEALTHCHECK, <code>docker ps</code> no puede decir si está sana y Compose no puede esperar a que lo esté."},

 {t:"orden", p:"Escribe el Dockerfile corregido: ordena las instrucciones de la etapa final",
  items:["FROM eclipse-temurin:21-jre-alpine","RUN addgroup -S spring && adduser -S spring -G spring","WORKDIR /app","COPY --from=builder /build/target/app.jar app.jar","USER spring","EXPOSE 8080","HEALTHCHECK CMD wget -qO- http://localhost:8080/actuator/health || exit 1",'ENTRYPOINT ["java","-jar","/app/app.jar"]'],
  why:"Crear el usuario antes, copiar siendo root, cambiar a USER después y arrancar en forma exec. Ese es el orden correcto."},

 {t:"info", eti:"Lo has conseguido", h:"Ya puedes defender un Dockerfile en una entrevista",
  c:`<p>Recapitulando lo que ya sabes explicar:</p>
     <ul><li>Qué es una capa y por qué el orden importa.</li>
     <li>COPY vs ADD, CMD vs ENTRYPOINT, ARG vs ENV, forma exec vs shell.</li>
     <li>Qué hace EXPOSE de verdad.</li>
     <li>Multi-stage y por qué reduce peso <b>y</b> riesgo.</li>
     <li>Los siete fallos típicos y su arreglo.</li></ul>
     <p>En la siguiente unidad, YAML: media hora, y es el idioma de Compose, Kubernetes y GitHub Actions.</p>`}
]}

]});
