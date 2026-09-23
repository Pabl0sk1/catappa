window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Pipelines como código",
resumen: "Por qué se escriben los pipelines en un Jenkinsfile, cómo se lee uno línea a línea, cómo se conecta a Jenkins y cómo se ven sus etapas",
nivel: "Intermedio",
color: "#df6545",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"jn5l1",
titulo:"De formularios a código",
claves:["Pipeline as code: el pipeline se escribe en un fichero llamado Jenkinsfile","El Jenkinsfile vive en el repositorio, junto al código de la aplicación","Ventajas: historial, revisión en Pull Requests y un pipeline distinto por rama"],
pasos:[
 {t:"info", eti:"El problema", h:"Los límites del freestyle",
  c:`<p>El job freestyle se configura con clics. Funciona para cosas pequeñas, pero en un proyecto real aparecen problemas:</p>
     <ul><li>Si alguien cambia la configuración y rompe algo, <b>no hay historial</b>: nadie sabe qué cambió ni quién.</li>
     <li>No se puede <b>revisar</b> un cambio antes de aplicarlo.</li>
     <li>Si Jenkins se pierde, hay que <b>volver a hacer los clics</b> de memoria.</li>
     <li>Un proceso con muchas etapas (compilar, probar, imagen, desplegar) se vuelve un formulario enorme.</li></ul>`},
 {t:"info", eti:"La solución", h:"Pipeline as code y el Jenkinsfile",
  c:`<p>La solución es <b>escribir el pipeline como código</b> (<i>pipeline as code</i>) en un fichero de texto llamado <b>Jenkinsfile</b> (sin extensión), que se guarda <b>en el repositorio</b>, junto al código de la aplicación:</p>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">api-tareas/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/</span><span class="coment">código de la aplicación</span></div><div class="rama" style="--n:1"><span class="nom">pom.xml</span><span class="coment">configuración de Maven</span></div><div class="rama" style="--n:1"><span class="nom">Dockerfile</span></div><div class="rama" style="--n:1"><span class="nom">Jenkinsfile</span><span class="coment">◀─ el pipeline</span></div></div>
     <p>Así el pipeline tiene historial en Git, se revisa en los Pull Requests como cualquier código y, si Jenkins se pierde, el pipeline sigue en el repositorio.</p>
     <div class="nota"><b class="tit">Te suena</b>Es la misma idea que el Dockerfile: en vez de montar la imagen a mano, la describes en un fichero de texto que vive con el código.</div>`},
 {t:"opcion", p:"¿Dónde se guarda el Jenkinsfile?",
  ops:["En la configuración de Jenkins","En el repositorio del proyecto, normalmente en la raíz, junto al código","En el navegador","En una base de datos aparte"],
  ok:1, why:"Vive con el código: si cambias el proceso, lo cambias con un commit."},
 {t:"par", p:"Empareja cada problema del freestyle con cómo lo resuelve el Jenkinsfile",
  pares:[["Nadie sabe quién cambió la configuración","El historial de Git muestra cada cambio y su autor"],["Los cambios se aplican sin revisar","Se revisan en un Pull Request"],["Si se pierde Jenkins hay que rehacerlo a mano","El pipeline sigue guardado en el repositorio"]],
  why:"Son las tres grandes ventajas del pipeline as code."},
 {t:"info", eti:"El lenguaje", h:"¿En qué se escribe?",
  c:`<p>El Jenkinsfile se escribe en <b>Groovy</b>, un lenguaje parecido a Java. Pero no tienes que aprender Groovy: Jenkins ofrece una forma sencilla y estructurada de escribirlo, llamada <b>pipeline declarativo</b>, que es casi como rellenar una plantilla con bloques entre llaves <code>{ }</code>. Es la que usarás en el curso.</p>`},
 {t:"vf", p:"Para escribir un Jenkinsfile declarativo hay que dominar el lenguaje Groovy.",
  ok:false, why:"El declarativo es una estructura fija de bloques; con saber leer llaves y comillas es suficiente para empezar."},
 {t:"opcion", p:"¿Por qué el Jenkinsfile se parece a la idea del Dockerfile?",
  ops:["Porque los dos los ejecuta Docker","Porque los dos describen en un fichero de texto versionado algo que antes se hacía a mano","Porque tienen la misma sintaxis","Porque los dos crean imágenes"],
  ok:1, why:"Todo «como código»: infraestructura, imágenes y pipelines."}
]},

/* =============== U5 L2 =============== */
{
id:"jn5l2",
titulo:"Tu primer Jenkinsfile, línea a línea",
claves:["pipeline { } envuelve todo","agent dice en qué máquina se ejecuta; stages contiene las etapas; cada stage tiene steps","sh 'comando' ejecuta un comando de terminal"],
pasos:[
 {t:"info", eti:"El fichero entero", h:"Un pipeline de tres etapas",
  c:`<div class="termbox">pipeline {
    agent any
    stages {
        stage('Compilar') {
            steps {
                sh './mvnw -B -DskipTests package'
            }
        }
        stage('Probar') {
            steps {
                sh './mvnw -B test'
            }
        }
        stage('Empaquetar') {
            steps {
                sh 'docker build -t api-tareas .'
            }
        }
    }
}</div>
     <p>Parece mucho, pero solo hay <b>cinco palabras nuevas</b>. Las vemos una a una en los siguientes pasos.</p>`},
 {t:"info", eti:"Las llaves", h:"Bloques dentro de bloques",
  c:`<p>Lo primero: las <b>llaves</b> <code>{ }</code> abren y cierran un bloque. Todo lo que está entre <code>stages {</code> y su <code>}</code> pertenece a <code>stages</code>. Es como una caja dentro de otra caja:</p>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom">pipeline { ................................................... }</span></div><div class="rama" style="--n:2"><span class="nom">stages { ........................................... }</span></div><div class="rama" style="--n:3"><span class="nom">stage('Probar') { ............................. }</span></div><div class="rama" style="--n:4"><span class="nom">steps { sh './mvnw -B test' }</span></div></div>
     <p>La sangría (los espacios al principio de cada línea) no es obligatoria, pero ayuda muchísimo a ver qué va dentro de qué.</p>`},
 {t:"info", eti:"Palabra por palabra", h:"pipeline, agent, stages, stage, steps",
  c:`<ul><li><code>pipeline { }</code>: envuelve todo el pipeline. Es obligatorio y va el primero.</li>
     <li><code>agent any</code>: <b>dónde</b> se ejecuta. <code>any</code> = en cualquier agente con un executor libre.</li>
     <li><code>stages { }</code>: contiene todas las etapas, en orden.</li>
     <li><code>stage('Probar') { }</code>: una etapa, con su nombre entre comillas simples y paréntesis. Ese nombre es el que verás en Jenkins.</li>
     <li><code>steps { }</code>: los pasos de esa etapa.</li>
     <li><code>sh './mvnw -B test'</code>: un paso que ejecuta un comando de terminal (<code>sh</code> = shell).</li></ul>`},
 {t:"par", p:"Empareja cada palabra con su función",
  pares:[["pipeline","Envuelve todo el pipeline"],["agent any","Ejecutar en cualquier agente libre"],["stages","Contiene todas las etapas"],["stage('Probar')","Una etapa con su nombre"],["steps","Los pasos de una etapa"],["sh","Ejecuta un comando de terminal"]],
  why:"Con estas seis piezas se escribe la mayoría de pipelines sencillos."},
 {t:"orden", p:"Ordena los bloques del más externo al más interno",
  items:["pipeline","stages","stage('Probar')","steps","sh './mvnw -B test'"],
  why:"agent va dentro de pipeline, al mismo nivel que stages."},
 {t:"hueco", p:"Completa el Jenkinsfile",
  tpl:"pipeline { agent ___  stages { stage('Probar') { ___ { sh './mvnw -B test' } } } }", banco:["any","steps","stages","docker"], sol:["any","steps"],
  why:"agent any: cualquier agente. steps: el bloque que contiene los comandos."},
 {t:"opcion", p:"En el pipeline de ejemplo, ¿qué hace <code>sh './mvnw -B test'</code>?",
  ops:["Crea una etapa","Ejecuta en la terminal del agente el comando que pasa las pruebas con Maven","Instala Maven","Descarga el repositorio"],
  ok:1, why:"sh ejecuta el texto entre comillas como un comando de terminal. -B es el modo batch de Maven (sin preguntas)."},
 {t:"vf", p:"El nombre que pones en stage('Compilar') es el que aparecerá en la interfaz de Jenkins para esa etapa.",
  ok:true, why:"Por eso conviene usar nombres claros y cortos."}
]},

/* =============== U5 L3 =============== */
{
id:"jn5l3",
titulo:"Conectar el Jenkinsfile a Jenkins",
claves:["Se crea un job de tipo Pipeline","En la definición se elige «Pipeline script from SCM»: Jenkins lee el Jenkinsfile del repositorio","El build descarga el código y ejecuta lo que dice el Jenkinsfile"],
pasos:[
 {t:"info", eti:"Paso a paso", h:"Un job de tipo Pipeline",
  c:`<ol><li><b>Nueva tarea</b> → nombre <code>api-tareas</code> → elige <b>Pipeline</b> → OK.</li>
     <li>En la sección <b>Pipeline</b>, en <b>Definition</b>, elige <b>Pipeline script from SCM</b> («script del pipeline desde el control de versiones»).</li>
     <li><b>SCM</b>: Git. <b>Repository URL</b>: la de tu repositorio. <b>Branch</b>: <code>*/main</code>.</li>
     <li><b>Script Path</b>: <code>Jenkinsfile</code> (la ruta del fichero dentro del repo).</li>
     <li>Guardar y <b>Construir ahora</b>.</li></ol>
     <p>SCM significa <i>Source Code Management</i>: el sistema que gestiona el código, en este caso Git.</p>`},
 {t:"orden", p:"Ordena la creación de un job de pipeline que lee el Jenkinsfile del repositorio",
  items:["Nueva tarea y elegir el tipo Pipeline","Definition: Pipeline script from SCM","Indicar Git, la URL del repositorio y la rama","Script Path: Jenkinsfile","Guardar y construir"],
  why:"A partir de aquí, cambiar el pipeline es cambiar el Jenkinsfile con un commit."},
 {t:"opcion", p:"¿Qué significa elegir «Pipeline script from SCM»?",
  ops:["Escribir el pipeline en un cuadro de texto de Jenkins","Que Jenkins lea el pipeline del Jenkinsfile que está en el repositorio","Crear un job freestyle","Descargar plugins"],
  ok:1, why:"La otra opción, «Pipeline script», permite pegarlo en Jenkins; sirve para probar, pero pierdes las ventajas del pipeline as code."},
 {t:"info", eti:"Qué pasa al construir", h:"Del repositorio a las etapas",
  c:`<div class="diag">Construir ─▶ Jenkins descarga el repo ─▶ lee el Jenkinsfile ─▶ ejecuta: Compilar ─▶ Probar ─▶ Empaquetar</div>
     <p>Si mañana alguien añade una etapa nueva al Jenkinsfile y hace push, el siguiente build ya la ejecuta, <b>sin tocar Jenkins</b>.</p>`},
 {t:"vf", p:"Para añadir una etapa nueva al pipeline hay que entrar en la configuración del job en Jenkins.",
  ok:false, why:"Basta con editar el Jenkinsfile y hacer push: el siguiente build ya la incluye."},
 {t:"par", p:"Empareja cada campo de la configuración con su valor típico",
  pares:[["Definition","Pipeline script from SCM"],["SCM","Git"],["Branch Specifier","*/main"],["Script Path","Jenkinsfile"]],
  why:"Son los cuatro campos que siempre vas a rellenar."}
]},

/* =============== U5 L4 =============== */
{
id:"jn5l4",
titulo:"Ver las etapas y encontrar el fallo",
claves:["La vista de etapas muestra cada stage como una columna con su tiempo y su resultado","Si una etapa falla, las siguientes no se ejecutan","Se puede abrir el registro de una sola etapa para ver su error"],
pasos:[
 {t:"info", eti:"La vista del pipeline", h:"Una columna por etapa",
  c:`<p>En la página de un job de pipeline, Jenkins muestra una tabla con una <b>columna por etapa</b> y una <b>fila por build</b> (<i>Stage View</i>; con el plugin Blue Ocean o la nueva vista <i>Pipeline Overview</i> se ve como un diagrama):</p>
     <div class="dg dg-tabla-caja"><table class="dg-tabla"><thead><tr><th></th><th>Compilar</th><th>Probar</th><th>Empaquetar</th><th></th></tr></thead><tbody><tr><td>Build #12</td><td>25 s</td><td>1 min</td><td>40 s</td><td>✔ todo verde</td></tr><tr><td>Build #13</td><td>24 s</td><td>✘ 38 s</td><td>—</td><td>✘ falló en Probar</td></tr><tr><td>Build #14</td><td>26 s</td><td>1 min</td><td>41 s</td><td>✔ arreglado</td></tr></tbody></table></div>
     <p>De un vistazo sabes <b>en qué etapa</b> falló cada build y <b>cuánto tarda</b> cada etapa.</p>`},
 {t:"opcion", p:"En el build #13, ¿por qué la etapa Empaquetar aparece vacía (—)?",
  ops:["Porque se ejecutó muy rápido","Porque la etapa Probar falló y el pipeline se detuvo: Empaquetar no llegó a ejecutarse","Porque se borró","Porque tardó cero segundos"],
  ok:1, why:"Lo viste en la unidad 1: si una etapa falla, las siguientes no se ejecutan."},
 {t:"info", eti:"Investigar", h:"El registro de una etapa",
  c:`<p>Al pulsar la casilla roja de una etapa se abre <b>solo su registro</b> (log). Es la misma información que la Salida de consola, pero filtrada a esa etapa, así que el error se encuentra antes:</p>
     <div class="termbox">+ ./mvnw -B test
[ERROR] Tests run: 42, Failures: 1
[ERROR]   TareaControllerTest.devuelve404SiNoExiste:31 expected:&lt;404&gt; but was:&lt;500&gt;
[INFO] BUILD FAILURE</div>
     <p>Aquí una prueba esperaba un 404 y la API devolvió un 500: hay un error en el código, no en Jenkins.</p>`},
 {t:"opcion", p:"La prueba dice <code>expected:404 but was:500</code>. ¿Dónde está el problema?",
  ops:["En Jenkins, hay que reinstalarlo","En el código de la aplicación: ante un recurso que no existe devuelve 500 en vez de 404","En el agente","En GitHub"],
  ok:1, why:"Jenkins solo ejecuta las pruebas; si una falla, casi siempre el problema está en el código probado."},
 {t:"vf", p:"La vista de etapas también sirve para ver qué etapa se está volviendo más lenta con el tiempo.",
  ok:true, why:"Cada celda muestra la duración; si Probar pasa de 1 a 6 minutos, lo verás enseguida."},
 {t:"opcion", p:"Resumen de la unidad: ¿qué ganas al escribir el pipeline en un Jenkinsfile?",
  ops:["Nada, es igual que freestyle","Historial y revisión de cambios, el pipeline guardado con el código y una vista por etapas para encontrar fallos","Que no hacen falta agentes","Que no hacen falta pruebas"],
  ok:1, why:"Por eso hoy prácticamente todos los proyectos usan Jenkinsfile."}
]}

]});
