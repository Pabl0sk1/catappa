window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Antes de tocar Docker",
resumen: "Qué problema resuelve, qué es un contenedor y cómo se le habla",
nivel: "Fundamentos",
color: "#1668d6",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"dk1l1",
titulo: "Por qué existe Docker",
claves: ["Docker empaqueta la app CON su entorno", "Resuelve el 'en mi máquina funciona'", "Un mismo paquete corre igual en tu PC, en el CI y en el servidor"],
pasos: [
 {t:"info", eti:"Empezamos", h:"El problema real que te vas a encontrar",
  c:`<p>Imagina que terminas tu API en Java. En tu portátil arranca perfecta. La subes al servidor de la empresa y revienta.</p>
     <p>¿Por qué? Porque tu aplicación <b>no es solo tu código</b>. Para funcionar necesita:</p>
     <ul><li>una versión concreta de Java (por ejemplo, el JDK 21)</li>
     <li>unas librerías del sistema operativo</li>
     <li>variables de entorno (usuario y contraseña de la base de datos)</li>
     <li>una versión concreta de PostgreSQL</li></ul>
     <p>Si el servidor tiene Java 17 en vez de 21, tu programa no arranca. A eso se le llama <b>"en mi máquina funciona"</b>, y es la frase más cara del sector.</p>`},

 {t:"info", eti:"La idea", h:"Docker empaqueta la aplicación con su mundo entero",
  c:`<p>Docker resuelve esto metiendo <b>tu aplicación y todo lo que necesita</b> dentro de un paquete cerrado.</p>
     <p>Ese paquete lleva dentro el Java 21, las librerías, la configuración... todo. Y se ejecuta exactamente igual en tu portátil, en el servidor de pruebas y en producción, porque <b>lleva su entorno consigo</b>.</p>
     <div class="nota"><b class="tit">La analogía</b>Un contenedor marítimo. Da igual lo que metas dentro: el barco, el camión y la grúa siempre lo tratan igual, porque por fuera todos los contenedores son iguales. Docker hace eso con el software.</div>`},

 {t:"opcion", p:"Según lo que acabas de leer, ¿qué mete Docker dentro del paquete?",
  ops:["Solo el código fuente de la aplicación",
       "La aplicación y todo lo que necesita para ejecutarse",
       "Una copia entera de Windows",
       "Solo la base de datos"],
  ok:1,
  why:"Exacto: código + runtime + librerías + configuración. Por eso se ejecuta igual en cualquier sitio."},

 {t:"info", eti:"Segundo problema", h:"Y además, aislamiento",
  c:`<p>Hay un segundo problema. En un mismo servidor suele haber varias aplicaciones. Una necesita Java 17 y otra Java 21. Una quiere PostgreSQL 14 y otra la 16.</p>
     <p>Si las instalas todas en la misma máquina, <b>se pisan</b>. Antes esto se resolvía con una máquina virtual por aplicación, que es carísimo en memoria y en tiempo de arranque.</p>
     <p>Con Docker, cada aplicación vive en su propio contenedor, con sus propias versiones, sin enterarse de las demás. Y todas comparten la misma máquina sin conflictos.</p>`},

 {t:"vf", p:"Dos aplicaciones que necesitan versiones distintas de Java pueden convivir en el mismo servidor usando contenedores.",
  ok:true,
  why:"Sí. Cada contenedor lleva su propia versión dentro y no se pisan entre ellas. Ese es el aislamiento."},

 {t:"opcion", p:"Tu compañero dice: «he subido la app al servidor y falla, pero en mi portátil va». ¿Qué le explica Docker?",
  ops:["Que el servidor tiene menos memoria",
       "Que el entorno del servidor no es idéntico al de su portátil, y por eso conviene empaquetar la app con su entorno",
       "Que hay que reinstalar el sistema operativo del servidor",
       "Que el código está mal escrito"],
  ok:1,
  why:"El problema casi nunca es el código: es la diferencia de entorno. Docker elimina esa diferencia."},

 {t:"info", eti:"Vocabulario", h:"Tres palabras que vas a oír todo el rato",
  c:`<p>Vamos a dejarlas claras ya, aunque las trabajaremos una por una:</p>
     <ul><li><b>Imagen</b>: el paquete cerrado. Una plantilla que no cambia.</li>
     <li><b>Contenedor</b>: ese paquete <b>en marcha</b>, ejecutándose.</li>
     <li><b>Docker</b>: el programa que crea imágenes y ejecuta contenedores.</li></ul>
     <p>Lo verás con calma en las siguientes lecciones. Por ahora quédate con que <b>imagen = plantilla</b> y <b>contenedor = plantilla en ejecución</b>.</p>`},

 {t:"par", p:"Empareja cada palabra con lo que significa",
  pares:[["Imagen","El paquete cerrado, una plantilla que no cambia"],
         ["Contenedor","Ese paquete ejecutándose"],
         ["Aislamiento","Que una app no se pise con otra en la misma máquina"]],
  why:"Estas tres ideas son la base de todo lo demás."},

 {t:"opcion", p:"En una entrevista te preguntan: «¿qué problema resuelve Docker?». ¿Cuál es la mejor respuesta corta?",
  ops:["Que los programas vayan más rápido",
       "Que la aplicación se ejecute igual en cualquier entorno, con sus dependencias empaquetadas y aislada de las demás",
       "Sustituir a Java",
       "Hacer copias de seguridad"],
  ok:1,
  why:"Esa es la respuesta: reproducibilidad (mismo comportamiento en todos los entornos) más aislamiento. Apréndela con tus palabras."}
]},

/* =============== U1 L2 =============== */
{
id:"dk1l2",
titulo:"Qué es un contenedor de verdad",
claves:["Un contenedor es un proceso de Linux aislado","namespaces = lo que el proceso VE","cgroups = lo que el proceso CONSUME"],
pasos:[
 {t:"info", eti:"Sin misterio", h:"Un contenedor es un proceso normal",
  c:`<p>Esto es lo que separa a quien ha leído un tutorial de quien entiende Docker.</p>
     <p>Un contenedor <b>no es una mini-máquina</b>. Es <b>un proceso corriente del sistema operativo Linux</b> (como lo es tu navegador o tu editor), al que se le han aplicado tres trucos del núcleo de Linux para que crea que está solo en el mundo.</p>`},

 {t:"info", eti:"Truco 1", h:"namespaces: controlan lo que el proceso VE",
  c:`<p>Un <b>namespace</b> (espacio de nombres) es una forma de recortarle la vista a un proceso. Linux tiene varios:</p>
     <ul><li><b>pid</b>: solo ve sus propios procesos. Cree que es el único.</li>
     <li><b>net</b>: tiene su propia tarjeta de red, su propia IP y sus propios puertos.</li>
     <li><b>mnt</b>: ve su propio sistema de ficheros, no el de tu ordenador.</li>
     <li><b>uts</b>: tiene su propio nombre de máquina (hostname).</li></ul>
     <p>Es como ponerle unas gafas que solo le dejan ver su parcela.</p>`},

 {t:"info", eti:"Truco 2", h:"cgroups: controlan lo que el proceso CONSUME",
  c:`<p>Los <b>cgroups</b> (control groups) ponen límites: «este proceso no puede pasar de 512 MB de RAM ni usar más de media CPU».</p>
     <p>Gracias a ellos un contenedor descontrolado no tumba el servidor entero.</p>
     <div class="nota"><b class="tit">Regla para recordarlo</b>namespaces = lo que <b>ve</b>. cgroups = lo que <b>gasta</b>.</div>`},

 {t:"opcion", p:"Un contenedor tiene su propia IP y sus propios puertos. ¿Gracias a qué?",
  ops:["A los cgroups","Al namespace de red (net)","Al Dockerfile","A la tarjeta de red física"],
  ok:1,
  why:"El namespace de red le da su propia pila de red. Por eso dos contenedores pueden usar el puerto 8080 a la vez sin chocar."},

 {t:"opcion", p:"Quieres impedir que un contenedor consuma más de 512 MB de RAM. ¿Qué mecanismo lo hace posible?",
  ops:["namespaces","cgroups","El kernel de Windows","El registry"],
  ok:1,
  why:"cgroups. En la práctica lo escribirás como docker run -m 512m, pero por debajo es un cgroup."},

 {t:"info", eti:"Truco 3", h:"overlayfs: el sistema de ficheros por capas",
  c:`<p>El tercer truco es el sistema de ficheros por capas (<b>overlay</b>). Lo veremos a fondo cuando construyamos imágenes, pero la idea es:</p>
     <p>La imagen está formada por <b>capas de solo lectura</b> apiladas. Cuando arrancas un contenedor, Docker le añade encima <b>una capa de escritura</b> vacía. Todo lo que el contenedor escriba va ahí.</p>
     <div class="nota ojo"><b class="tit">Muy importante</b>Esa capa de escritura <b>se borra cuando borras el contenedor</b>. Por eso más adelante aparecen los volúmenes: para guardar datos que deben sobrevivir.</div>`},

 {t:"vf", p:"Si borras un contenedor, los ficheros que escribió dentro se pierden (salvo que uses un volumen).",
  ok:true,
  why:"Correcto. La capa de escritura muere con el contenedor. Es una de las preguntas más frecuentes en entrevistas."},

 {t:"par", p:"Empareja cada mecanismo con su función",
  pares:[["namespaces","Aíslan lo que el proceso ve: procesos, red, ficheros"],
         ["cgroups","Limitan los recursos: CPU, memoria"],
         ["overlayfs","Monta la imagen en capas de solo lectura + una capa de escritura"]],
  why:"Si en la entrevista sueltas estas tres palabras con su función, demuestras que entiendes qué hay por debajo."},

 {t:"opcion", p:"«¿Cómo consigue Docker aislar un contenedor?» ¿Cuál es la respuesta completa?",
  ops:["Creando una máquina virtual para cada uno",
       "Con namespaces para la visibilidad, cgroups para los recursos y overlayfs para el sistema de ficheros",
       "Cifrando el disco",
       "Instalando un sistema operativo dentro de cada contenedor"],
  ok:1,
  why:"Esa frase, tal cual, es una respuesta de nivel alto. Memorízala."}
]},

/* =============== U1 L3 =============== */
{
id:"dk1l3",
titulo:"Contenedor contra máquina virtual",
claves:["La VM virtualiza hardware y lleva su propio kernel","El contenedor comparte el kernel del anfitrión","Contenedor: milisegundos y megas. VM: minutos y gigas"],
pasos:[
 {t:"info", eti:"La comparación estrella", h:"Esta pregunta cae casi siempre",
  c:`<p>Antes de Docker, para aislar aplicaciones se usaban <b>máquinas virtuales</b>. Entender la diferencia es obligatorio.</p>
     <p>Una <b>máquina virtual</b> simula un ordenador completo: procesador, disco, memoria. Encima de ese ordenador simulado instalas un sistema operativo entero (con su propio <b>kernel</b>, que es el núcleo del sistema).</p>
     <p>Un <b>contenedor</b> no simula ningún ordenador. Usa <b>el mismo kernel</b> de la máquina en la que está, y solo se aísla con los trucos de la lección anterior.</p>`},

 {t:"info", eti:"Dibújalo", h:"Las dos pilas, una al lado de la otra",
  c:`<div class="dg">
       <div class="dg-cols">
         <div class="dg-col">
           <div class="dg-col-tit">Máquina virtual</div>
           <div class="dg-fila"><div class="dg-caja acento">App A</div><div class="dg-caja acento">App B</div></div>
           <div class="dg-caja">Librerías</div>
           <div class="dg-fila"><div class="dg-caja aviso doble">Sistema operativo invitado<small>su propio kernel</small></div><div class="dg-caja aviso doble">Sistema operativo invitado<small>su propio kernel</small></div></div>
           <div class="dg-caja">Hipervisor</div>
           <div class="dg-caja base">Sistema operativo del anfitrión</div>
           <div class="dg-caja base">Hardware</div>
           <div class="dg-nota">dos sistemas operativos de más: gigas de disco y minutos de arranque</div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">Contenedores</div>
           <div class="dg-fila"><div class="dg-caja acento">App A</div><div class="dg-caja acento">App B</div></div>
           <div class="dg-caja">Librerías</div>
           <div class="dg-caja">Motor de Docker</div>
           <div class="dg-caja ok doble">Sistema operativo<small>un único kernel, compartido</small></div>
           <div class="dg-caja base">Hardware</div>
           <div class="dg-nota">sin sistemas operativos extra: megas y milisegundos</div>
         </div>
       </div>
       <div class="dg-leyenda"><span><i class="acento"></i>tu aplicación</span><span><i></i>capa compartida</span><span><i class="aviso"></i>lo que sobra en la máquina virtual</span></div>
     </div>
     <p>Fíjate en la diferencia clave: a la izquierda hay <b>dos sistemas operativos completos</b> de más. A la derecha, ninguno.</p>`},

 {t:"opcion", p:"¿Por qué un contenedor arranca en milisegundos y una máquina virtual tarda minutos?",
  ops:["Porque el contenedor usa menos disco",
       "Porque el contenedor no tiene que arrancar un sistema operativo entero: reutiliza el kernel que ya está corriendo",
       "Porque Docker está escrito en Go",
       "Porque la máquina virtual usa internet"],
  ok:1,
  why:"Arrancar un contenedor es arrancar un proceso. Arrancar una VM es encender un ordenador entero."},

 {t:"opcion", p:"¿Cuál es la ventaja que SÍ tiene la máquina virtual frente al contenedor?",
  ops:["Arranca más rápido",
       "Ocupa menos espacio",
       "Aislamiento más fuerte, y puede ejecutar un sistema operativo distinto al del anfitrión",
       "No necesita hardware"],
  ok:2,
  why:"Buena señal si lo sabes: la VM aísla más (kernel propio) y puede correr Windows sobre Linux, por ejemplo. Docker no lo hace."},

 {t:"info", eti:"Consecuencia práctica", h:"Un contenedor Linux necesita un kernel Linux",
  c:`<p>Como el contenedor comparte el kernel, <b>una imagen de Linux necesita sí o sí un kernel de Linux por debajo</b>.</p>
     <p>Entonces... ¿cómo funciona Docker en tu Windows 11?</p>
     <p>Docker Desktop arranca <b>una máquina virtual Linux muy ligera</b> usando WSL 2 (el Subsistema de Windows para Linux). El motor de Docker vive ahí dentro. Tú escribes comandos en PowerShell, pero los contenedores corren sobre ese kernel Linux.</p>
     <div class="nota"><b class="tit">Si te lo preguntan</b>«En Windows, Docker Desktop ejecuta el daemon dentro de una VM Linux ligera con WSL 2; los contenedores Linux corren sobre ese kernel, no sobre Windows.»</div>`},

 {t:"vf", p:"En tu Windows, los contenedores Linux se ejecutan directamente sobre el kernel de Windows.",
  ok:false,
  why:"No. Por debajo hay un kernel Linux, dentro de la VM ligera de WSL 2. Windows no sabe ejecutar contenedores Linux por sí mismo."},

 {t:"orden", p:"Ordena de MÁS ligero a MÁS pesado",
  items:["Un proceso normal","Un contenedor","Una máquina virtual","Un servidor físico"],
  why:"El contenedor está justo un escalón por encima de un proceso normal, porque prácticamente lo es."},

 {t:"opcion", p:"Resume la diferencia en una frase de entrevista:",
  ops:["El contenedor es una máquina virtual ligera",
       "La VM virtualiza hardware y lleva su propio kernel; el contenedor virtualiza el sistema operativo y comparte el kernel del anfitrión",
       "Son lo mismo con distinto nombre",
       "El contenedor es más seguro que la VM en todos los casos"],
  ok:1,
  why:'Evita la frase "es una VM ligera": es lo que dice todo el mundo y no demuestra nada. Usa la segunda.'}
]},

/* =============== U1 L4 =============== */
{
id:"dk1l4",
titulo:"Imagen, contenedor y registry",
claves:["Imagen = plantilla inmutable (como una clase)","Contenedor = instancia en ejecución (como un objeto)","Registry = el almacén de imágenes; Docker Hub es el público"],
pasos:[
 {t:"info", eti:"El trío", h:"Imagen, contenedor y registry",
  c:`<p>Estas tres palabras van a aparecer en cada frase a partir de ahora. Vamos una por una, despacio.</p>
     <p><b>1. Imagen.</b> Es el paquete: un fichero de solo lectura que contiene tu aplicación y su entorno. No se ejecuta; está ahí, quieta. <b>No se puede modificar</b>: si quieres cambiar algo, construyes una imagen nueva.</p>`},

 {t:"info", eti:"El trío", h:"2. Contenedor",
  c:`<p>El <b>contenedor</b> es una imagen <b>en marcha</b>. Docker coge la imagen, le pone encima una capa donde escribir, y ejecuta el programa que lleva dentro.</p>
     <p>De <b>una sola imagen</b> puedes arrancar <b>cincuenta contenedores</b> a la vez, todos iguales y todos independientes.</p>
     <div class="nota dato"><b class="tit">Si vienes de Java</b>La imagen es la <b>clase</b>. El contenedor es el <b>objeto</b> que creas con <code>new</code>. Una clase, muchos objetos.</div>`},

 {t:"opcion", p:"Con la analogía de Java: si la imagen es la clase, ¿qué es el contenedor?",
  ops:["El paquete .jar","Una instancia u objeto de esa clase","El método main","La interfaz"],
  ok:1,
  why:"Exacto. Y como con los objetos: muchas instancias de la misma clase, cada una con su propio estado."},

 {t:"info", eti:"El trío", h:"3. Registry",
  c:`<p>¿De dónde salen las imágenes? De un <b>registry</b>: un servidor donde se guardan y se comparten.</p>
     <p>El registry público por defecto es <b>Docker Hub</b>. Ahí están las imágenes oficiales de PostgreSQL, nginx, Java, Python... hechas y mantenidas por sus responsables.</p>
     <ul><li><b>pull</b> = descargar una imagen del registry</li>
     <li><b>push</b> = subir tu imagen al registry</li></ul>
     <p>Las empresas suelen tener su registry privado (GitHub Container Registry, AWS ECR, Harbor) para sus imágenes internas.</p>`},

 {t:"info", eti:"Nomenclatura", h:"El nombre y el tag de una imagen",
  c:`<p>Una imagen se identifica así:</p>
     <div class="termbox">postgres:16-alpine
<span class="cm">   ^         ^</span>
<span class="cm">nombre      tag (la version)</span></div>
     <p>Si no escribes tag, Docker asume <code>:latest</code>. Y <b>eso es una trampa</b>: <code>latest</code> no significa "la última estable", significa "la que alguien etiquetó como latest en ese momento". Hoy puede ser una versión y mañana otra distinta.</p>
     <div class="nota ojo"><b class="tit">Norma profesional</b>Fija siempre el tag: <code>postgres:16-alpine</code>, nunca <code>postgres</code> a secas. Si no, tu build deja de ser reproducible.</div>`},

 {t:"opcion", p:"Escribes <code>docker run postgres</code> sin tag. ¿Qué pasa?",
  ops:["Falla porque falta el tag",
       "Docker usa el tag :latest, que puede cambiar con el tiempo y romper la reproducibilidad",
       "Docker descarga todas las versiones",
       "Docker usa siempre la versión más antigua"],
  ok:1,
  why:"Usa :latest. Funciona, pero mañana puede traerte otra versión distinta. En producción, tag fijo siempre."},

 {t:"hueco", p:"Completa el nombre de la imagen oficial de PostgreSQL versión 16 sobre Alpine",
  tpl:"docker run ___:___", banco:["postgres","16-alpine","latest","mysql","ubuntu"],
  sol:["postgres","16-alpine"],
  why:"nombre:tag. Alpine es una distribución de Linux minúscula (unos 8 MB), por eso esas imágenes pesan mucho menos."},

 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Imagen","Plantilla inmutable con la app y su entorno"],
         ["Contenedor","Instancia en ejecución de una imagen"],
         ["Registry","Servidor donde se publican y descargan imágenes"],
         ["Tag","La etiqueta de versión de una imagen"]],
  why:"Estas cuatro palabras son el vocabulario mínimo para hablar de Docker sin sonar a principiante."},

 {t:"vf", p:"De una misma imagen puedes arrancar varios contenedores a la vez.",
  ok:true,
  why:"Sí, y es lo normal en producción: varias copias idénticas de tu API repartiéndose el tráfico."}
]},

/* =============== U1 L5 =============== */
{
id:"dk1l5",
titulo:"Cómo se le dan órdenes a Docker",
claves:["Tú escribes en el CLI; el trabajo lo hace el daemon","El CLI habla con el daemon por una API","Todos los comandos empiezan por docker"],
pasos:[
 {t:"info", eti:"Las piezas", h:"Tú no hablas con los contenedores: hablas con el daemon",
  c:`<p>Cuando escribes un comando, pasan tres cosas:</p>
     <div class="dg">
       <div class="dg-tit">quién hace qué cuando escribes «docker run»</div>
       <div class="dg-cols">
         <div class="dg-col">
           <div class="dg-col-tit">Tú escribes</div>
           <div class="dg-caja acento doble">docker CLI<small>el comando «docker»</small></div>
           <div class="dg-nota">manda la orden por una API, no hace el trabajo</div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">Quien trabaja</div>
           <div class="dg-caja ok doble">dockerd<small>crea contenedores y construye imágenes</small></div>
           <div class="dg-nota">te devuelve la respuesta</div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">De dónde salen las imágenes</div>
           <div class="dg-caja base doble">Registro<small>Docker Hub y compañía</small></div>
           <div class="dg-nota">el daemon descarga lo que falta</div>
         </div>
       </div>
       <div class="dg-leyenda"><span><i class="acento"></i>lo que tú tocas</span><span><i></i>lo que hace el trabajo</span></div>
     </div>
     <ul><li><b>CLI</b> (Command Line Interface): el comando <code>docker</code> que escribes tú. Solo transmite órdenes.</li>
     <li><b>Daemon</b> (<code>dockerd</code>): un programa que está siempre en marcha de fondo y es quien de verdad crea los contenedores.</li></ul>
     <p>Por eso, si Docker Desktop está cerrado, los comandos fallan: el daemon no está escuchando.</p>`},

 {t:"opcion", p:"Ejecutas <code>docker ps</code> y te dice «cannot connect to the Docker daemon». ¿Qué pasa?",
  ops:["El comando está mal escrito",
       "El daemon no está en marcha: en Windows, hay que abrir Docker Desktop y esperar a que arranque",
       "No tienes internet",
       "Falta instalar Java"],
  ok:1,
  why:"Es el error más común al empezar. El CLI está, pero no hay nadie al otro lado escuchando."},

 {t:"info", eti:"La forma de los comandos", h:"Todos siguen el mismo patrón",
  c:`<p>Los comandos de Docker tienen esta forma:</p>
     <div class="termbox">docker <b>SUSTANTIVO</b> <b>VERBO</b> [opciones] [argumentos]</div>
     <p>Por ejemplo:</p>
     <div class="termbox">docker <b>container</b> <b>ls</b>        <span class="cm"># listar contenedores</span>
docker <b>image</b> <b>ls</b>            <span class="cm"># listar imagenes</span>
docker <b>volume</b> <b>create</b> datos <span class="cm"># crear un volumen</span></div>
     <p>Los más usados tienen <b>atajos</b> que verás por todas partes: <code>docker ps</code> en vez de <code>docker container ls</code>, o <code>docker images</code> en vez de <code>docker image ls</code>. Son lo mismo.</p>`},

 {t:"par", p:"Empareja el comando con lo que hace",
  pares:[["docker ps","Lista los contenedores en ejecución"],
         ["docker images","Lista las imágenes descargadas"],
         ["docker pull","Descarga una imagen del registry"],
         ["docker logs","Muestra lo que ha escrito un contenedor"]],
  why:"Estos cuatro los vas a usar cada día."},

 {t:"info", eti:"Ayuda", h:"El comando que te salva en la entrevista",
  c:`<p>Nadie se acuerda de todos los flags. Si te bloqueas, existe:</p>
     <div class="termbox">docker --help
docker run --help</div>
     <p>Decir «no me lo sé de memoria, pero lo miro con <code>docker run --help</code>» es una respuesta perfectamente válida y honesta en una entrevista técnica.</p>`},

 {t:"escribe", p:"Escribe el comando que muestra la versión de Docker instalada",
  sol:["docker --version","docker version","docker -v"],
  ph:"docker ...",
  pista:"Como en casi cualquier programa de línea de comandos, con dos guiones y la palabra version.",
  why:"<code>docker --version</code> te devuelve algo como «Docker version 29.8.0». Es lo primero que se comprueba cuando algo no va."},

 {t:"escribe", p:"Escribe el comando para ver la lista de contenedores que están ejecutándose ahora mismo",
  sol:["docker ps","docker container ls"],
  ph:"docker ...",
  pista:"El atajo son dos letras, heredado de Linux (process status).",
  why:"<code>docker ps</code> muestra los que están <b>en marcha</b>. Enseguida verás que con <code>-a</code> muestra también los parados."}
]},

/* =============== U1 L6 =============== */
{
id:"dk1l6",
titulo:"Tu primer contenedor, paso a paso",
claves:["docker run descarga (si hace falta) y ejecuta","Si no tienes la imagen, Docker hace pull automáticamente","El contenedor vive mientras viva su proceso"],
pasos:[
 {t:"info", eti:"Manos a la obra", h:"Vamos a ejecutar algo de verdad",
  c:`<p>La imagen <code>hello-world</code> existe solo para comprobar que la instalación funciona: imprime un mensaje y termina.</p>
     <p>En esta lección vas a escribir comandos en una <b>terminal simulada</b>. Escríbelos tú, sin copiar y pegar: la memoria de los dedos existe y en la entrevista se nota.</p>
     <div class="nota"><b class="tit">Además</b>Si tienes Docker Desktop abierto, ejecuta estos mismos comandos en PowerShell y compara. Verás lo mismo.</div>`},

 {t:"term", p:"Ejecuta el contenedor de prueba de Docker",
  cmd:"docker run hello-world",
  sol:["docker run hello-world"],
  pista:"El verbo para ejecutar es <code>run</code>, y la imagen se llama hello-world.",
  salida:`Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:d211f485f2dd1dee407a80973c8f129f00d54604d2c90732e8e320e5038a0348
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.`,
  why:"Has ejecutado tu primer contenedor. Fíjate en las dos primeras líneas: no tenías la imagen, así que Docker la descargó solo."},

 {t:"info", eti:"Qué acaba de pasar", h:"Los cinco pasos, en orden",
  c:`<p>Esto es una pregunta de entrevista clásica: «¿qué hace <code>docker run</code> exactamente?».</p>
     <ul><li><b>1.</b> El CLI le pide al daemon un contenedor de la imagen <code>hello-world</code>.</li>
     <li><b>2.</b> El daemon busca la imagen en local. No la tiene.</li>
     <li><b>3.</b> La descarga de Docker Hub (eso es el <code>pull</code> automático que has visto).</li>
     <li><b>4.</b> Crea un contenedor a partir de ella.</li>
     <li><b>5.</b> Ejecuta el programa que lleva dentro. El programa imprime el mensaje y <b>termina</b>.</li></ul>`},

 {t:"orden", p:"Ordena lo que hace <code>docker run</code> con una imagen que no tienes descargada",
  items:["Busca la imagen en tu máquina","No la encuentra y la descarga del registry","Crea un contenedor a partir de la imagen","Ejecuta el proceso principal dentro del contenedor"],
  why:"Ese es el ciclo completo. Si la imagen ya está descargada, se salta el segundo paso y arranca al instante."},

 {t:"info", eti:"La regla de oro", h:"El contenedor vive mientras viva su proceso",
  c:`<p><code>hello-world</code> imprime el mensaje y su programa termina. En cuanto ese programa termina, <b>el contenedor se para</b>.</p>
     <p>Un contenedor <b>no es una máquina encendida</b>: es un proceso. Si el proceso acaba, se acabó.</p>
     <p>Pero ojo: <b>parado no es borrado</b>. El contenedor sigue existiendo, con su estado y sus logs, hasta que tú lo borres.</p>`},

 {t:"term", p:"Comprueba la lista de contenedores en ejecución",
  cmd:"docker ps",
  sol:["docker ps","docker container ls"],
  pista:"El de la lección anterior: dos letras.",
  salida:`CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES`,
  why:"Sale la cabecera pero ninguna fila: no hay <b>nada en marcha</b>, porque hello-world terminó enseguida. No ha desaparecido: está parado."},

 {t:"info", eti:"Ver también los parados", h:"El flag -a",
  c:`<p>Para ver <b>todos</b> los contenedores, incluidos los que ya terminaron, se añade <code>-a</code> (de <i>all</i>):</p>
     <div class="termbox">docker ps <b>-a</b></div>
     <p>Un <b>flag</b> es una opción que modifica un comando. Empiezan por un guion (<code>-a</code>) o dos si es la versión larga (<code>--all</code>). Son exactamente lo mismo.</p>`},

 {t:"term", p:"Ahora lista TODOS los contenedores, incluidos los parados",
  cmd:"docker ps -a",
  sol:["docker ps -a","docker ps --all","docker container ls -a"],
  pista:"El mismo comando de antes, más el flag de <i>all</i>.",
  antes:`PS C:\\practicar-docker> docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES`,
  salida:`CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      NAMES
3f2a9c1b7e45   hello-world   "/hello"   30 seconds ago   Exited (0) 29 seconds ago   jolly_curie`,
  why:'Ahí está. Estado <b>Exited (0)</b>: terminó sin errores (el 0 es el código de salida). Y como no le pusiste nombre, Docker le inventó uno: "jolly_curie".'},

 {t:"opcion", p:"Ves un contenedor con estado <code>Exited (1)</code>. ¿Qué significa ese 1?",
  ops:["Que lleva 1 minuto parado",
       "Que el programa de dentro terminó con un error",
       "Que tiene 1 réplica",
       "Que usó 1 GB de memoria"],
  ok:1,
  why:"El número es el <b>código de salida</b> del proceso. 0 = todo bien; cualquier otro número = error. Es lo primero que se mira cuando algo falla."},

 {t:"vf", p:"Un contenedor parado sigue existiendo en tu máquina hasta que lo borras.",
  ok:true,
  why:"Sí. Ocupa espacio y conserva sus logs. Por eso existe <code>docker rm</code>, que verás en la unidad siguiente."},

 {t:"escribe", p:"Escribe el comando para ver qué imágenes tienes descargadas en tu máquina",
  sol:["docker images","docker image ls","docker images ls"],
  ph:"docker ...",
  pista:"Sustantivo en plural, sin verbo. Es el atajo de docker image ls.",
  why:"<code>docker images</code>. Ahí aparecerá hello-world, que acabas de descargar sin darte cuenta."}
]}

]});
