window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "El Jenkinsfile a fondo",
resumen: "Variables y comillas, qué hacer al terminar (post), opciones del pipeline, condiciones, parámetros, aprobaciones y la sintaxis scripted",
nivel: "Intermedio",
color: "#e06a4a",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"jn6l1",
titulo:"Variables y comillas",
claves:["environment define variables para todo el pipeline o para una etapa","Comillas simples: la variable la resuelve la shell del agente ($VAR)","Comillas dobles: la resuelve Groovy antes de ejecutar, escribiendo ${...}"],
pasos:[
 {t:"info", eti:"Tus variables", h:"El bloque environment",
  c:`<p>Para no repetir valores por todo el pipeline se usa <b>environment</b>, que crea variables de entorno:</p>
     <div class="termbox">pipeline {
    agent any
    environment {
        APP      = 'api-tareas'
        REGISTRO = 'ghcr.io/pablo'
    }
    stages {
        stage('Imagen') {
            steps {
                sh 'docker build -t $REGISTRO/$APP:$BUILD_NUMBER .'
            }
        }
    }
}</div>
     <p>Dentro de <code>environment</code> también están disponibles las variables que pone Jenkins, como <code>BUILD_NUMBER</code>.</p>`},
 {t:"opcion", p:"¿Para qué sirve el bloque <code>environment</code>?",
  ops:["Para elegir el agente","Para definir variables que se usan en los pasos del pipeline","Para instalar plugins","Para borrar el workspace"],
  ok:1, why:"Se puede poner a nivel de pipeline (todas las etapas) o dentro de una etapa concreta."},
 {t:"info", eti:"El detalle que confunde", h:"Comillas simples y comillas dobles",
  c:`<p>Esta es la parte donde más gente se pierde. En Groovy, el texto entre comillas se trata de dos formas distintas:</p>
     <ul><li><b>Comillas simples</b> <code>'…'</code>: el texto se envía tal cual a la terminal. Si dentro hay <code>$APP</code>, lo resuelve <b>la shell del agente</b>, que conoce las variables de entorno.</li>
     <li><b>Comillas dobles</b> <code>"…"</code>: <b>Groovy</b> sustituye lo que haya dentro de <code>\${ }</code> <b>antes</b> de enviar el comando.</li></ul>
     <div class="termbox">sh 'echo $APP'            // la shell sustituye $APP      -&gt; api-tareas
sh "echo \${APP}"          // Groovy sustituye \${APP}     -&gt; api-tareas
sh "echo \${params.VERSION}"   // así se leen los parámetros: necesita comillas dobles</div>
     <p>Las dos funcionan. Regla práctica: usa <b>comillas simples</b> siempre que puedas (es lo más seguro con secretos) y <b>dobles</b> solo cuando necesites algo de Groovy, como <code>params</code>.</p>`},
 {t:"par", p:"Empareja cada forma con quién sustituye la variable",
  pares:[["sh 'echo $APP'","La shell del agente"],["sh \"echo ${APP}\"","Groovy, antes de ejecutar el comando"],["sh \"echo ${params.VERSION}\"","Groovy, porque params solo existe en Groovy"]],
  why:"Si ves ${ } dentro de comillas simples, no se sustituirá nada: se imprimirá tal cual."},
 {t:"opcion", p:"¿Qué imprime <code>sh 'echo ${APP}'</code> (con comillas simples)?",
  ops:["api-tareas","El texto literal ${APP}, porque Groovy no toca las comillas simples y la shell no entiende esa sintaxis","Un error de sintaxis","Nada"],
  ok:1, why:"Con comillas simples y llaves se mezclan las dos formas: o $APP con simples, o ${APP} con dobles."},
 {t:"hueco", p:"Completa para leer un parámetro llamado VERSION dentro de un paso",
  tpl:"sh \"echo desplegando ___\"", banco:["${params.VERSION}","$params.VERSION","VERSION","'VERSION'"], sol:["${params.VERSION}"],
  why:"params es de Groovy: hacen falta comillas dobles y ${ }."},
 {t:"vf", p:"Con secretos (contraseñas o tokens) es preferible usar comillas simples y dejar que los lea la shell.",
  ok:true, why:"Si Groovy interpola un secreto, puede acabar registrado en algún sitio. Jenkins incluso avisa de ello."}
]},

/* =============== U6 L2 =============== */
{
id:"jn6l2",
titulo:"Qué hacer al terminar: post",
claves:["post define acciones que se ejecutan al final del pipeline o de una etapa","Condiciones: always, success, failure, unstable, changed y cleanup","always se usa para publicar resultados de pruebas aunque el build falle"],
pasos:[
 {t:"info", eti:"Después de todo", h:"El bloque post",
  c:`<p>Casi siempre hay algo que hacer al terminar: publicar los resultados de las pruebas, avisar al equipo, limpiar. Para eso está <b>post</b>, que va al final del pipeline (o dentro de una etapa):</p>
     <div class="termbox">pipeline {
    agent any
    stages { /* … */ }
    post {
        always  { junit 'target/surefire-reports/*.xml' }
        success { echo 'Todo bien' }
        failure { echo "Falló el build \${BUILD_NUMBER}" }
        cleanup { cleanWs() }
    }
}</div>
     <p><code>junit</code> publica los informes de pruebas y <code>cleanWs()</code> limpia el workspace.</p>`},
 {t:"par", p:"Empareja cada condición de post con cuándo se ejecuta",
  pares:[["always","Siempre, sea cual sea el resultado"],["success","Solo si el build terminó bien"],["failure","Solo si el build falló"],["unstable","Si hay pruebas fallidas"],["changed","Si el resultado cambió respecto al build anterior"],["cleanup","Al final del todo, después de las demás"]],
  why:"changed es útil para avisar solo cuando algo se rompe o se arregla, sin ruido diario."},
 {t:"opcion", p:"Quieres publicar los resultados de las pruebas aunque el build falle. ¿En qué bloque los pones?",
  ops:["success","always","cleanup","failure"],
  ok:1, why:"Si solo los publicas en success, justo cuando fallan las pruebas no podrías ver cuáles fallaron."},
 {t:"info", eti:"Ejemplo", h:"Avisar al equipo",
  c:`<p>Con un plugin de Slack o de correo, el bloque <code>post</code> es donde se avisa:</p>
     <div class="termbox">post {
    failure {
        mail to: 'equipo@empresa.com',
        subject: "Build roto: \${JOB_NAME} #\${BUILD_NUMBER}",
        body: "Mira \${BUILD_URL}"
    }
}</div>
     <p>Fíjate: comillas dobles porque se usan variables con <code>\${ }</code>.</p>`},
 {t:"vf", p:"El bloque post solo puede ponerse al final del pipeline, nunca dentro de una etapa.",
  ok:false, why:"También puede ir dentro de un stage, para hacer algo al terminar esa etapa concreta."},
 {t:"opcion", p:"¿Qué hace <code>cleanWs()</code> en el bloque cleanup?",
  ops:["Cierra Jenkins","Borra el contenido del workspace para que el siguiente build empiece limpio","Cancela el build","Borra el job"],
  ok:1, why:"Evita que restos de un build afecten al siguiente, a costa de volver a descargarlo todo."}
]},

/* =============== U6 L3 =============== */
{
id:"jn6l3",
titulo:"Opciones del pipeline",
claves:["timeout aborta un build colgado; retry reintenta un paso inestable","buildDiscarder borra builds antiguos y evita llenar el disco","timestamps añade la hora a cada línea; disableConcurrentBuilds evita dos builds a la vez"],
pasos:[
 {t:"info", eti:"Ajustes", h:"El bloque options",
  c:`<div class="termbox">pipeline {
    agent any
    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
        disableConcurrentBuilds()
    }
    stages { /* … */ }
}</div>
     <ul><li><b>timeout</b>: si el build supera ese tiempo, se aborta. Evita builds colgados que ocupan un executor para siempre.</li>
     <li><b>buildDiscarder</b>: guarda solo los últimos 20 builds y borra los anteriores.</li>
     <li><b>timestamps</b>: escribe la hora delante de cada línea de la consola.</li>
     <li><b>disableConcurrentBuilds</b>: si llega un build nuevo mientras hay otro en marcha, espera.</li></ul>`},
 {t:"par", p:"Empareja cada opción con el problema que evita",
  pares:[["timeout","Un build colgado ocupando un executor indefinidamente"],["buildDiscarder","Que el disco se llene con builds antiguos"],["timestamps","No saber cuánto tardó cada parte"],["disableConcurrentBuilds","Dos builds del mismo job pisándose (por ejemplo, desplegando a la vez)"],["retry(3)","Un paso que falla de vez en cuando por causas externas"]],
  why:"Sin buildDiscarder, JENKINS_HOME crece hasta llenar el disco: es un problema clásico."},
 {t:"opcion", p:"Un job de despliegue se lanza dos veces seguidas y los dos builds despliegan a la vez, pisándose. ¿Qué opción lo evita?",
  ops:["timestamps()","disableConcurrentBuilds()","buildDiscarder(...)","retry(2)"],
  ok:1, why:"Obliga a que los builds de ese job se ejecuten de uno en uno."},
 {t:"opcion", p:"¿Cuándo tiene sentido usar <code>retry(3)</code> en un paso?",
  ops:["Siempre, en todos los pasos","Cuando el paso falla a veces por causas externas, como una descarga que se corta","Cuando una prueba detecta un error real","Nunca"],
  ok:1, why:"Reintentar una prueba que falla de verdad solo esconde el problema."},
 {t:"vf", p:"Poner un timeout en el pipeline es una buena práctica aunque los builds suelan tardar poco.",
  ok:true, why:"Un build colgado puede bloquear un executor durante días si nadie se da cuenta."}
]},

/* =============== U6 L4 =============== */
{
id:"jn6l4",
titulo:"Etapas condicionales: when",
claves:["when decide si una etapa se ejecuta o se salta","Condiciones habituales: branch, changeRequest, environment y expression","Sirve para tener un solo Jenkinsfile para todas las ramas"],
pasos:[
 {t:"info", eti:"Solo a veces", h:"El bloque when",
  c:`<p>No todas las etapas deben ejecutarse siempre. El despliegue a producción, por ejemplo, solo debería hacerse desde la rama principal. Eso se controla con <b>when</b>:</p>
     <div class="termbox">stage('Desplegar a producción') {
    when {
        branch 'main'
    }
    steps {
        sh './desplegar.sh produccion'
    }
}</div>
     <p>Si el build es de otra rama, la etapa se <b>salta</b> (aparece como <i>skipped</i> en la vista de etapas) y el pipeline continúa.</p>`},
 {t:"opcion", p:"Un build de la rama <code>feature/login</code> llega a la etapa con <code>when { branch 'main' }</code>. ¿Qué ocurre?",
  ops:["El build falla","La etapa se salta y el pipeline sigue con las siguientes","El build se cancela","Se despliega igualmente"],
  ok:1, why:"Saltarse una etapa no es un error: es una decisión del pipeline."},
 {t:"par", p:"Empareja cada condición con cuándo se cumple",
  pares:[["branch 'main'","El build es de la rama main"],["changeRequest()","El build es de un Pull Request"],["environment name: 'ENTORNO', value: 'prod'","Una variable tiene ese valor"],["expression { params.DESPLEGAR }","Una expresión de Groovy es verdadera"]],
  why:"Se pueden combinar con allOf (todas), anyOf (alguna) y not (lo contrario)."},
 {t:"info", eti:"Combinaciones", h:"allOf, anyOf y not",
  c:`<div class="termbox">when {
    allOf {
        branch 'main'
        not { changeRequest() }
    }
}</div>
     <p>Se lee: «solo si es la rama main <b>y</b> no es un Pull Request».</p>`},
 {t:"opcion", p:"¿Cómo se escribe «solo si la rama es main o release»?",
  ops:["allOf { branch 'main'; branch 'release' }","anyOf { branch 'main'; branch 'release' }","not { branch 'main' }","branch 'main release'"],
  ok:1, why:"anyOf es «alguna de estas»; allOf sería «todas a la vez», imposible con dos ramas."},
 {t:"vf", p:"Gracias a when, un mismo Jenkinsfile puede servir para todas las ramas del proyecto.",
  ok:true, why:"Las etapas peligrosas se limitan por condición, en vez de tener pipelines distintos."}
]},

/* =============== U6 L5 =============== */
{
id:"jn6l5",
titulo:"Parámetros y aprobaciones manuales",
claves:["parameters declara los parámetros en el propio Jenkinsfile","Se leen con params.NOMBRE","input pausa el pipeline hasta que una persona aprueba; conviene ponerle timeout"],
pasos:[
 {t:"info", eti:"En el fichero", h:"Declarar parámetros",
  c:`<p>En la unidad 4 añadiste parámetros con formularios. En un pipeline se declaran en el propio Jenkinsfile:</p>
     <div class="termbox">pipeline {
    agent any
    parameters {
        choice(name: 'ENTORNO', choices: ['staging', 'produccion'], description: 'Dónde desplegar')
        string(name: 'VERSION', defaultValue: '1.0.0', description: 'Versión a desplegar')
        booleanParam(name: 'SALTAR_TESTS', defaultValue: false)
    }
    stages {
        stage('Desplegar') {
            steps { sh "./desplegar.sh \${params.ENTORNO} \${params.VERSION}" }
        }
    }
}</div>
     <div class="nota"><b class="tit">Detalle</b>La primera vez que se ejecuta un pipeline con parameters, Jenkins los «descubre»: ese primer build usa los valores por defecto y a partir del siguiente aparece el formulario.</div>`},
 {t:"opcion", p:"¿Cómo se lee dentro de un paso el parámetro <code>ENTORNO</code>?",
  ops:["$ENTORNO en comillas simples","${params.ENTORNO} en comillas dobles","params(ENTORNO)","ENTORNO"],
  ok:1, why:"params es de Groovy, así que necesita comillas dobles y ${ }."},
 {t:"info", eti:"Pedir permiso", h:"El paso input",
  c:`<p>Para que una persona decida si se sigue adelante (típico antes de producción) se usa <b>input</b>:</p>
     <div class="termbox">stage('Producción') {
    when { branch 'main' }
    steps {
        timeout(time: 1, unit: 'HOURS') {
            input message: '¿Desplegar a producción?', ok: 'Desplegar', submitter: 'lideres'
        }
        sh './desplegar.sh produccion'
    }
}</div>
     <ul><li><b>message</b>: la pregunta que se muestra.</li>
     <li><b>ok</b>: el texto del botón.</li>
     <li><b>submitter</b>: quién puede aprobar (usuario o grupo).</li>
     <li>El <b>timeout</b> alrededor evita que el pipeline espere para siempre.</li></ul>`},
 {t:"par", p:"Empareja cada parte de input con su función",
  pares:[["message","La pregunta que ve la persona"],["ok","El texto del botón de aprobación"],["submitter","Quién tiene permiso para aprobar"],["timeout alrededor","Cancelar si nadie responde a tiempo"]],
  why:"Sin submitter, cualquiera con acceso al job podría aprobar un despliegue a producción."},
 {t:"opcion", p:"¿Por qué conviene envolver el <code>input</code> en un <code>timeout</code>?",
  ops:["Para que sea más rápido","Porque si nadie aprueba, el pipeline se queda esperando y puede tener ocupado un executor","Porque input no funciona sin timeout","Para saltarse la aprobación"],
  ok:1, why:"Un input olvidado un fin de semana puede bloquear capacidad de Jenkins."},
 {t:"vf", p:"El paso input detiene el pipeline hasta que alguien pulsa el botón o se agota el tiempo.",
  ok:true, why:"Es la forma estándar de meter una decisión humana en la entrega continua."}
]},

/* =============== U6 L6 =============== */
{
id:"jn6l6",
titulo:"Declarativo y scripted",
claves:["Declarativo: empieza por pipeline { } y tiene estructura fija; es lo recomendado","Scripted: empieza por node { } y es Groovy libre; más flexible y más fácil de complicar","script { } permite meter un poco de Groovy dentro del declarativo"],
pasos:[
 {t:"info", eti:"Dos formas", h:"El mismo pipeline, escrito de dos maneras",
  c:`<div class="termbox">// DECLARATIVO (lo que has aprendido)
pipeline {
    agent any
    stages {
        stage('Probar') { steps { sh './mvnw -B test' } }
    }
}

// SCRIPTED (Groovy libre)
node {
    stage('Probar') {
        checkout scm
        sh './mvnw -B test'
    }
}</div>
     <p>El <b>declarativo</b> tiene una estructura fija que Jenkins valida antes de ejecutar, y da errores claros. El <b>scripted</b> es Groovy puro: permite bucles y lógica compleja, pero se complica rápido y es más difícil de leer para el resto del equipo.</p>`},
 {t:"par", p:"Empareja cada característica con su sintaxis",
  pares:[["Empieza con pipeline { }","Es declarativo"],["Empieza con node { }","Es scripted"],["Estructura fija que Jenkins valida antes de ejecutar","Ventaja del declarativo"],["Groovy libre, con bucles y condiciones","Ventaja del scripted"],["script { }","Meter un poco de Groovy dentro del declarativo"]],
  why:"En ofertas de trabajo verás las dos; hoy se recomienda declarativo."},
 {t:"info", eti:"Lo mejor de los dos", h:"El bloque script",
  c:`<p>Si dentro de un pipeline declarativo necesitas algo de lógica, puedes abrir un bloque <b>script</b>:</p>
     <div class="termbox">steps {
    script {
        def version = sh(script: 'cat version.txt', returnStdout: true).trim()
        echo "Versión leída: \${version}"
    }
}</div>
     <p>Úsalo con moderación: si tu Jenkinsfile se llena de <code>script { }</code>, esa lógica suele estar mejor en una <b>shared library</b> (unidad 9).</p>`},
 {t:"opcion", p:"Tu equipo empieza un pipeline nuevo. ¿Qué sintaxis eliges?",
  ops:["Scripted, porque es más potente","Declarativo, y solo un script { } puntual si hace falta lógica","Jobs freestyle","Da igual"],
  ok:1, why:"Es la recomendación oficial: más legible y mantenible por todo el equipo."},
 {t:"vf", p:"Dentro de un pipeline declarativo no se puede usar nada de Groovy.",
  ok:false, why:"Se puede, dentro de un bloque script { }; simplemente conviene no abusar."}
]}

]});
