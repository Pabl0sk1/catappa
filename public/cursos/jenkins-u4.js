window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Tu primer job",
resumen: "Crear un job paso a paso, ejecutarlo y leer su consola, conectarlo a un repositorio, lanzarlo solo con disparadores y usar parámetros",
nivel: "Fundamentos",
color: "#dd5e42",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"jn4l1",
titulo:"Crear un job freestyle",
claves:["Un job (también «tarea» o «proyecto») es la receta: qué hacer y cuándo","Freestyle: el tipo más sencillo, se configura con formularios","Un paso «Ejecutar línea de comandos» (Execute shell) lanza comandos de terminal"],
pasos:[
 {t:"info", eti:"Vocabulario", h:"Qué es un job",
  c:`<p>Un <b>job</b> es una tarea configurada en Jenkins: <b>qué</b> tiene que hacer (los pasos), <b>de dónde</b> saca el código y <b>cuándo</b> se ejecuta. En la interfaz en español aparece como <b>«tarea»</b> o <b>«proyecto»</b>.</p>
     <p>Cada vez que un job se ejecuta, se produce un <b>build</b> (ya lo conoces): el job es la receta y el build es cada vez que se cocina.</p>`},
 {t:"opcion", p:"¿Cuál es la relación entre un job y un build?",
  ops:["Son lo mismo","El job es la configuración (la receta) y cada ejecución de ese job es un build","El build crea los jobs","Un job solo puede tener un build"],
  ok:1, why:"Un job puede tener cientos de builds: #1, #2, #3…"},
 {t:"info", eti:"El tipo más simple", h:"Freestyle",
  c:`<p>Jenkins tiene varios tipos de job. El más sencillo es el <b>freestyle</b> («estilo libre»): lo configuras rellenando formularios en la web. Es perfecto para aprender; en la unidad 5 verás los <b>pipelines</b>, que son lo que se usa hoy en empresas.</p>
     <p>Para crear uno:</p>
     <ol><li>Pulsa <b>Nueva tarea</b> (New Item).</li>
     <li>Escribe un nombre, por ejemplo <code>hola-jenkins</code>.</li>
     <li>Elige <b>Crear un proyecto de estilo libre</b> (Freestyle project) y pulsa OK.</li></ol>`},
 {t:"orden", p:"Ordena cómo se crea un job freestyle",
  items:["Pulsar «Nueva tarea»","Escribir el nombre del job","Elegir «Proyecto de estilo libre»","Pulsar OK y abrir la configuración"],
  why:"A continuación verás la pantalla de configuración."},
 {t:"info", eti:"Añadir un paso", h:"Ejecutar un comando",
  c:`<p>En la configuración del job, baja hasta <b>Pasos de ejecución</b> (Build Steps) → <b>Añadir un nuevo paso</b> → <b>Ejecutar línea de comandos (shell)</b> (Execute shell). Ahí escribes comandos como en una terminal de Linux:</p>
     <div class="termbox">echo "Hola desde Jenkins"
date
java -version</div>
     <p>Pulsa <b>Guardar</b>. Ya tienes tu primer job. Todavía no se ha ejecutado: lo harás en la siguiente lección.</p>
     <div class="nota"><b class="tit">¿Y en Windows?</b>Si el agente fuera Windows, usarías «Ejecutar comando de Windows» (Execute Windows batch command). En Docker, Jenkins es Linux, así que se usa shell.</div>`},
 {t:"opcion", p:"¿Dónde escribes los comandos que debe ejecutar un job freestyle?",
  ops:["En el nombre del job","En un paso «Ejecutar línea de comandos (shell)» dentro de Pasos de ejecución","En Administrar Jenkins","En el correo de aviso"],
  ok:1, why:"Cada paso de ejecución es un comando o una acción de un plugin."},
 {t:"vf", p:"Al pulsar Guardar, el job se ejecuta automáticamente por primera vez.",
  ok:false, why:"Guardar solo guarda la configuración. Para ejecutarlo hay que lanzarlo (a mano o con un disparador)."}
]},

/* =============== U4 L2 =============== */
{
id:"jn4l2",
titulo:"Ejecutar el job y leer el resultado",
claves:["«Construir ahora» (Build Now) lanza el job a mano","Cada build tiene número, estado y una salida de consola (Console Output)","Estados: SUCCESS, FAILURE, UNSTABLE y ABORTED"],
pasos:[
 {t:"info", eti:"A mano", h:"Construir ahora",
  c:`<p>En la página del job pulsa <b>Construir ahora</b> (Build Now). En la parte izquierda aparece el build <b>#1</b> en <b>Historial de tareas</b> (Build History). Entra en él y pulsa <b>Salida de consola</b> (Console Output):</p>
     <div class="termbox">Started by user Pablo
Running as SYSTEM
Building in workspace /var/jenkins_home/workspace/hola-jenkins
[hola-jenkins] $ /bin/sh -xe /tmp/jenkins123.sh
+ echo Hola desde Jenkins
Hola desde Jenkins
+ date
Mon Sep 22 10:31:07 UTC 2026
+ java -version
openjdk version "17.0.12" 2024-07-16
Finished: SUCCESS</div>
     <p>Las líneas con <b>+</b> son los comandos que ejecutó; debajo, lo que respondieron. La última línea es el <b>resultado</b>.</p>`},
 {t:"opcion", p:"En la consola, ¿qué indican las líneas que empiezan por <code>+</code>?",
  ops:["Errores","Los comandos que Jenkins ejecutó, justo antes de su salida","Comentarios","Líneas añadidas por un plugin"],
  ok:1, why:"Así puedes seguir paso a paso qué se ejecutó y qué respondió cada comando."},
 {t:"info", eti:"Resultados", h:"Los estados de un build",
  c:`<ul><li><b>SUCCESS</b> (verde): todos los pasos terminaron bien.</li>
     <li><b>FAILURE</b> (rojo): un comando falló y el build se detuvo. En Linux, un comando «falla» cuando termina con un código distinto de 0.</li>
     <li><b>UNSTABLE</b> (amarillo): el build llegó al final, pero hay <b>pruebas que fallaron</b>. Lo verás cuando publiquemos resultados de pruebas.</li>
     <li><b>ABORTED</b> (gris): alguien lo canceló o superó el tiempo máximo.</li></ul>`},
 {t:"par", p:"Empareja cada estado con su significado",
  pares:[["SUCCESS","Todo terminó bien"],["FAILURE","Un paso falló y el build se detuvo"],["UNSTABLE","Terminó, pero hay pruebas fallidas"],["ABORTED","Se canceló o superó el tiempo máximo"]],
  why:"UNSTABLE es muy de Jenkins: compila, pero no todo está bien."},
 {t:"info", eti:"Un fallo", h:"Así se ve un build roto",
  c:`<div class="termbox">+ echo Compilando...
Compilando...
+ ./mvnw package
/tmp/jenkins456.sh: 3: ./mvnw: not found
Build step 'Execute shell' marked build as failure
Finished: FAILURE</div>
     <p>Para encontrar la causa, lee la consola <b>desde el final hacia arriba</b> hasta el primer error. Aquí: el comando <code>./mvnw</code> no existe en esa carpeta.</p>`},
 {t:"opcion", p:"Un build acaba en FAILURE. ¿Cuál es la forma correcta de empezar a investigar?",
  ops:["Reinstalar Jenkins","Abrir la Salida de consola de ese build y leer desde el final hacia arriba hasta el primer error","Borrar el job y crearlo de nuevo","Ejecutarlo diez veces más"],
  ok:1, why:"La consola casi siempre dice exactamente qué comando falló y por qué."},
 {t:"vf", p:"Un build UNSTABLE significa que ni siquiera compiló.",
  ok:false, why:"UNSTABLE significa que llegó al final pero hay pruebas fallidas. Si no compila, es FAILURE."}
]},

/* =============== U4 L3 =============== */
{
id:"jn4l3",
titulo:"El workspace y el código de Git",
claves:["El workspace es la carpeta del agente donde se ejecuta el build y se descarga el código","En «Configurar el origen del código fuente» (Source Code Management) se indica el repositorio Git y la rama","Si el repositorio es privado, hace falta una credencial"],
pasos:[
 {t:"info", eti:"Dónde trabaja", h:"El workspace",
  c:`<p>Cada job tiene una carpeta de trabajo en el agente, llamada <b>workspace</b>. En la consola lo viste: <code>Building in workspace /var/jenkins_home/workspace/hola-jenkins</code>.</p>
     <ul><li>Ahí se descarga el código del repositorio.</li>
     <li>Ahí se ejecutan los comandos (compilar, probar…).</li>
     <li>Por defecto <b>se reutiliza</b> entre builds: si un build deja ficheros, el siguiente los encuentra. Por eso a veces se limpia al empezar.</li></ul>`},
 {t:"opcion", p:"¿Qué es el workspace de un job?",
  ops:["La pantalla principal de Jenkins","La carpeta del agente donde se descarga el código y se ejecutan los pasos del build","Una copia de seguridad","El repositorio en GitHub"],
  ok:1, why:"Es la mesa de trabajo del build."},
 {t:"info", eti:"Traer el código", h:"Conectar el job a un repositorio",
  c:`<p>Un job útil no hace «echo»: trabaja sobre tu código. En la configuración del job, en <b>Configurar el origen del código fuente</b> (Source Code Management), elige <b>Git</b> y rellena:</p>
     <ul><li><b>Repository URL</b>: por ejemplo <code>https://github.com/pablo/api-tareas.git</code></li>
     <li><b>Credentials</b>: solo si el repositorio es privado (verás cómo crearlas en la unidad 7).</li>
     <li><b>Branch Specifier</b>: la rama, por ejemplo <code>*/main</code>.</li></ul>
     <p>Al ejecutarse, lo primero que hace el build es descargar ese código al workspace (un <code>git clone</code> o <code>git fetch</code>), y después ejecuta tus pasos, por ejemplo <code>./mvnw package</code>.</p>`},
 {t:"orden", p:"Ordena lo que hace un build de un job conectado a Git",
  items:["Jenkins prepara el workspace en el agente","Descarga el código de la rama indicada","Ejecuta los pasos (por ejemplo ./mvnw package)","Guarda el resultado del build"],
  why:"Descargar el código siempre va primero: los pasos trabajan sobre él."},
 {t:"par", p:"Empareja cada campo con lo que se escribe",
  pares:[["Repository URL","La dirección del repositorio, acabada en .git"],["Branch Specifier","La rama que se construye, como */main"],["Credentials","Usuario y token si el repositorio es privado"]],
  why:"Con un repositorio público basta con la URL y la rama."},
 {t:"vf", p:"Si el repositorio de GitHub es público, no hace falta ninguna credencial para descargarlo.",
  ok:true, why:"Las credenciales solo hacen falta para repositorios privados o para escribir en ellos."}
]},

/* =============== U4 L4 =============== */
{
id:"jn4l4",
titulo:"Que el job se lance solo: disparadores",
claves:["Webhook: GitHub avisa a Jenkins en cuanto hay un push (lo recomendado)","Consultar repositorio (Poll SCM): Jenkins pregunta cada cierto tiempo si hay cambios","Ejecutar periódicamente (cron): a horas fijas; la H reparte la carga"],
pasos:[
 {t:"info", eti:"Sin pulsar botones", h:"Los disparadores (triggers)",
  c:`<p>Pulsar «Construir ahora» no es integración continua: la gracia es que el build se lance <b>solo</b>. Para eso están los <b>disparadores</b> (en inglés, <i>triggers</i>), en la sección <b>Disparadores de ejecución</b> (Build Triggers) del job. Los tres más usados:</p>
     <ul><li><b>Webhook de GitHub</b>: GitHub avisa a Jenkins <b>en el mismo momento</b> en que alguien hace push.</li>
     <li><b>Consultar repositorio (Poll SCM)</b>: Jenkins pregunta al repositorio cada X minutos «¿hay algo nuevo?».</li>
     <li><b>Ejecutar periódicamente</b> (Build periodically): a una hora fija, haya cambios o no. Por ejemplo, un build nocturno.</li></ul>`},
 {t:"par", p:"Empareja cada disparador con cuándo lanza el build",
  pares:[["Webhook","En cuanto alguien hace push"],["Consultar repositorio (Poll SCM)","Cuando Jenkins, al preguntar cada X minutos, encuentra cambios"],["Ejecutar periódicamente","A una hora fija, haya cambios o no"],["Construir ahora","Cuando una persona pulsa el botón"]],
  why:"Para CI, lo ideal es el webhook."},
 {t:"info", eti:"El mejor", h:"Por qué se prefiere el webhook",
  c:`<p>Con un <b>webhook</b>, en la configuración del repositorio de GitHub (Settings → Webhooks) pones la dirección de tu Jenkins, por ejemplo <code>https://jenkins.empresa.com/github-webhook/</code>. Cada push, GitHub envía un aviso y el build empieza al instante.</p>
     <p>Con <b>Poll SCM</b>, Jenkins pregunta aunque no haya cambios: más retraso y más carga. Solo se usa cuando GitHub <b>no puede llegar</b> a tu Jenkins (por ejemplo, si está en tu portátil o en una red cerrada).</p>`},
 {t:"opcion", p:"Tu Jenkins está en tu portátil y GitHub no puede conectarse a él. ¿Qué disparador usas para detectar los push?",
  ops:["Webhook","Consultar repositorio (Poll SCM): Jenkins pregunta a GitHub cada cierto tiempo","Ninguno","Construir ahora"],
  ok:1, why:"Si GitHub no puede avisar a Jenkins, es Jenkins quien pregunta."},
 {t:"info", eti:"Horarios", h:"La sintaxis cron, campo por campo",
  c:`<p>Poll SCM y «Ejecutar periódicamente» usan la sintaxis <b>cron</b>: cinco campos separados por espacios.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">los cinco campos de cron</div><table class="dg-tabla"><thead><tr><th>minuto</th><th>hora</th><th>día del mes</th><th>mes</th><th>día de la semana</th><th>significa</th></tr></thead><tbody>
<tr><td><code>H</code></td><td><code>2</code></td><td><code>*</code></td><td><code>*</code></td><td><code>1-5</code></td><td>de lunes (1) a viernes (5), hacia las 2:00</td></tr>
<tr><td><code>H/15</code></td><td><code>*</code></td><td><code>*</code></td><td><code>*</code></td><td><code>*</code></td><td>cada 15 minutos</td></tr>
<tr><td><code>0</code></td><td><code>*</code></td><td><code>*</code></td><td><code>*</code></td><td><code>*</code></td><td>al minuto 0 de cada hora</td></tr>
</tbody></table></div>
     <ul><li><code>*</code> significa «cualquiera».</li>
     <li><code>H/15</code> significa «cada 15 minutos».</li>
     <li>La <b>H</b> es propia de Jenkins: elige un minuto concreto según el nombre del job, para que cien jobs «cada 15 minutos» no arranquen todos en el mismo segundo.</li></ul>`},
 {t:"par", p:"Empareja cada expresión cron con su significado",
  pares:[["H/15 * * * *","Cada 15 minutos"],["H 2 * * *","Una vez al día, hacia las 2:00"],["H 2 * * 1-5","De lunes a viernes, hacia las 2:00"],["0 * * * *","Al minuto 0 de cada hora"]],
  why:"Recuerda el orden: minuto, hora, día del mes, mes, día de la semana."},
 {t:"escribe", p:"Escribe la expresión cron de Jenkins para ejecutar un job <b>cada 30 minutos</b>",
  sol:["H/30 * * * *"], ph:"H/…", pista:"Igual que H/15 * * * *, pero con 30.", why:"H/30 * * * *: cada 30 minutos, repartiendo el minuto exacto entre jobs."},
 {t:"vf", p:"La H en la sintaxis cron de Jenkins sirve para que muchos jobs con el mismo horario no se lancen todos en el mismo instante.",
  ok:true, why:"Es una particularidad de Jenkins que no existe en el cron normal de Linux."}
]},

/* =============== U4 L5 =============== */
{
id:"jn4l5",
titulo:"Parámetros y variables de entorno",
claves:["Un job con parámetros pregunta valores al lanzarlo: texto, lista de opciones, casilla…","Jenkins pone variables en cada build: BUILD_NUMBER, JOB_NAME, WORKSPACE, BUILD_URL","En un comando de shell se leen con $: $BUILD_NUMBER"],
pasos:[
 {t:"info", eti:"Preguntar al lanzar", h:"Parámetros",
  c:`<p>A veces un job necesita un dato distinto cada vez: ¿en qué entorno despliego?, ¿qué versión? Para eso se marca <b>Esta ejecución debe parametrizarse</b> (This project is parameterized) y se añaden parámetros:</p>
     <ul><li><b>Parámetro de cadena</b> (String): un texto, por ejemplo <code>VERSION</code> = 1.0.0.</li>
     <li><b>Parámetro de elección</b> (Choice): una lista, por ejemplo <code>ENTORNO</code> = staging o produccion.</li>
     <li><b>Parámetro booleano</b>: una casilla, por ejemplo <code>SALTAR_TESTS</code>.</li></ul>
     <p>El botón «Construir ahora» pasa a llamarse <b>Construir con parámetros</b> y muestra un formulario.</p>`},
 {t:"opcion", p:"Quieres que al lanzar el job se elija entre «staging» y «produccion». ¿Qué tipo de parámetro usas?",
  ops:["De cadena (texto libre)","De elección (lista de opciones)","Booleano","Ninguno"],
  ok:1, why:"Con una lista cerrada nadie puede escribir un entorno que no existe."},
 {t:"info", eti:"Datos gratis", h:"Variables que Jenkins pone siempre",
  c:`<p>Además de tus parámetros, Jenkins crea en cada build unas <b>variables de entorno</b> con información útil:</p>
     <ul><li><code>BUILD_NUMBER</code>: el número del build (48).</li>
     <li><code>JOB_NAME</code>: el nombre del job (api-tareas).</li>
     <li><code>WORKSPACE</code>: la ruta del workspace.</li>
     <li><code>BUILD_URL</code>: el enlace a la página de este build.</li>
     <li><code>GIT_COMMIT</code>: el identificador del commit que se está construyendo (si el job usa Git).</li></ul>
     <p>En un paso de shell se leen con <code>$</code>, igual que cualquier variable de Linux:</p>
     <div class="termbox">echo "Build $BUILD_NUMBER del job $JOB_NAME"
echo "Desplegando la versión $VERSION en $ENTORNO"</div>`},
 {t:"par", p:"Empareja cada variable con su contenido",
  pares:[["BUILD_NUMBER","El número del build actual"],["JOB_NAME","El nombre del job"],["WORKSPACE","La carpeta de trabajo del build"],["BUILD_URL","El enlace a la página del build"],["GIT_COMMIT","El identificador del commit que se construye"]],
  why:"BUILD_NUMBER y GIT_COMMIT se usan mucho para ponerle versión a lo que se construye."},
 {t:"opcion", p:"En un paso de shell quieres mostrar el número de build. ¿Qué escribes?",
  ops:["echo BUILD_NUMBER","echo $BUILD_NUMBER","echo {BUILD_NUMBER}","echo %BUILD_NUMBER%"],
  ok:1, why:"En la shell de Linux las variables se leen con $. %VAR% es la sintaxis de Windows."},
 {t:"escribe", p:"Escribe un comando de shell que muestre el nombre del job usando su variable",
  sol:["echo $JOB_NAME","echo \"$JOB_NAME\""], ph:"echo …", pista:"echo y la variable JOB_NAME con $.", why:"echo $JOB_NAME."},
 {t:"vf", p:"Un parámetro de tipo contraseña es la forma recomendada de pasar las contraseñas de producción a un job.",
  ok:false, why:"Lo recomendado es guardarlas como credenciales de Jenkins (unidad 7), que están cifradas y no se muestran en la consola."}
]}

]});
