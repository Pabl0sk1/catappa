window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Pipelines declarativos",
resumen: "Pipeline as code con Jenkinsfile: estructura, post, environment, options, when, parámetros, aprobaciones manuales y la diferencia con scripted",
nivel: "Intermedio",
color: "#df6545",
lecciones: [

{
id:"jk3l1",
titulo:"El Jenkinsfile",
claves:["Pipeline as code: el pipeline vive en el repositorio, en un fichero Jenkinsfile, y se revisa como el código","Estructura: pipeline → agent → stages → stage → steps","Cada stage aparece como una columna en la vista del pipeline"],
pasos:[
 {t:"info", eti:"Pipeline as code", h:"Estructura mínima",
  c:`<div class="termbox">pipeline {
  agent any                      // en qué agente se ejecuta
  stages {
    stage('Compilar') {
      steps { sh './mvnw -B -DskipTests package' }
    }
    stage('Probar') {
      steps { sh './mvnw -B test' }
    }
    stage('Empaquetar') {
      steps { sh 'docker build -t api-tareas:$BUILD_NUMBER .' }
    }
  }
}</div>
     <p>El <b>Jenkinsfile</b> se guarda en la raíz del repositorio. Así el pipeline tiene historial, se revisa en los Pull Requests y cada rama puede tener el suyo.</p>`},
 {t:"orden", p:"Ordena los bloques de un pipeline declarativo, del más externo al más interno",
  items:["pipeline","stages","stage('Probar')","steps","sh './mvnw test'"],
  why:"agent va dentro de pipeline, al mismo nivel que stages (o dentro de un stage concreto)."},
 {t:"hueco", p:"Completa el pipeline",
  tpl:"pipeline { ___ any  stages { stage('Probar') { ___ { sh './mvnw test' } } } }", banco:["agent","steps","node","script"], sol:["agent","steps"],
  why:"node y script pertenecen a la sintaxis scripted o a bloques especiales."},
 {t:"opcion", p:"¿Cuál es la principal ventaja de tener el pipeline en un Jenkinsfile en lugar de configurarlo en la interfaz?",
  ops:["Es más rápido de ejecutar","Queda versionado con el código: tiene historial, se revisa en PRs y cada rama puede cambiarlo","No necesita agentes","Jenkins deja de necesitar plugins"],
  ok:1, why:"Es el mismo principio que la infraestructura como código."}
]},

{
id:"jk3l2",
titulo:"post, environment y options",
claves:["post se ejecuta al final según el resultado: always, success, failure, unstable, changed, cleanup","environment define variables para todo el pipeline o para un stage","options: timeout, retry, buildDiscarder, timestamps, disableConcurrentBuilds"],
pasos:[
 {t:"info", eti:"Más allá de los pasos", h:"Un pipeline profesional",
  c:`<div class="termbox">pipeline {
  agent any
  options {
    timeout(time: 30, unit: 'MINUTES')          // aborta si se cuelga
    buildDiscarder(logRotator(numToKeepStr: '20')) // guarda solo los 20 últimos
    timestamps()
    disableConcurrentBuilds()
  }
  environment {
    REGISTRO = 'ghcr.io/pablo'
    IMAGEN   = "\${REGISTRO}/api-tareas:\${BUILD_NUMBER}"
  }
  stages { /* ... */ }
  post {
    always  { junit 'target/surefire-reports/*.xml' }
    failure { echo "Falló el build \${BUILD_NUMBER}: \${BUILD_URL}" }
    cleanup { cleanWs() }
  }
}</div>`},
 {t:"par", p:"Empareja cada condición de post con cuándo se ejecuta",
  pares:[["always","Siempre, sea cual sea el resultado"],["success","Solo si todo fue bien"],["failure","Solo si el build falló"],["unstable","Si hay pruebas fallidas"],["changed","Si el resultado es distinto al del build anterior"],["cleanup","Al final de todo, después del resto de bloques post"]],
  why:"changed es útil para avisar solo cuando algo se rompe o se arregla."},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["timeout","Aborta el build si tarda demasiado"],["retry(3)","Reintenta un paso que falla de forma intermitente"],["buildDiscarder","Borra builds antiguos para no llenar el disco"],["disableConcurrentBuilds","Impide dos builds del mismo job a la vez"],["timestamps","Añade la hora a cada línea de la consola"]],
  why:"Sin buildDiscarder, JENKINS_HOME crece hasta llenar el disco: un clásico."},
 {t:"opcion", p:"Quieres publicar los resultados de las pruebas aunque el build falle. ¿Dónde pones <code>junit</code>?",
  ops:["En post { success { } }","En post { always { } }","En el primer stage","En environment"],
  ok:1, why:"Si solo se publica en success, justo cuando fallan las pruebas no verás cuáles."}
]},

{
id:"jk3l3",
titulo:"Condiciones, parámetros y aprobaciones",
claves:["when decide si un stage se ejecuta: branch, environment, expression, changeRequest, anyOf/allOf","input pausa el pipeline hasta que una persona aprueba (con submitter para limitar quién)","No dejes un input ocupando un executor: úsalo fuera de un agente o con timeout"],
pasos:[
 {t:"info", eti:"Control del flujo", h:"when e input",
  c:`<div class="termbox">stage('Desplegar a producción') {
  when {
    branch 'main'                         // solo en la rama main
    not { changeRequest() }               // y no en Pull Requests
  }
  steps {
    timeout(time: 1, unit: 'HOURS') {
      input message: '¿Desplegar a producción?', ok: 'Desplegar', submitter: 'lideres'
    }
    sh './desplegar.sh produccion'
  }
}</div>`},
 {t:"par", p:"Empareja cada condición when con cuándo se cumple",
  pares:[["branch 'main'","El build es de la rama main"],["changeRequest()","El build es de un Pull Request"],["expression { params.SALTAR_TESTS == false }","Una expresión Groovy devuelve verdadero"],["environment name: 'ENTORNO', value: 'prod'","Una variable tiene un valor concreto"],["anyOf { branch 'main'; branch 'release' }","Se cumple alguna de las condiciones"]],
  why:"when evita tener pipelines distintos por rama."},
 {t:"opcion", p:"El stage de despliegue tiene un <code>input</code> y nadie lo aprueba durante el fin de semana. ¿Qué problema puede causar y cómo se evita?",
  ops:["Ninguno","Mantiene ocupado un executor todo ese tiempo; se evita con timeout y pidiendo la aprobación sin agente asignado","Borra el workspace","Hace que Jenkins se reinicie"],
  ok:1, why:"Un input dentro de un agente bloquea un executor esperando a una persona."},
 {t:"vf", p:"Con <code>submitter: 'lideres'</code>, solo los usuarios o grupos indicados pueden aprobar el input.",
  ok:true, why:"Sin submitter, cualquiera con permiso sobre el job podría aprobar un paso a producción."}
]},

{
id:"jk3l4",
titulo:"Declarativo frente a scripted",
claves:["Declarativo: estructura fija, más legible y validada; es lo recomendado","Scripted: Groovy libre con node { }; más flexible pero más fácil de complicar","Dentro del declarativo, script { } permite un poco de Groovy cuando hace falta"],
pasos:[
 {t:"info", eti:"Dos sintaxis", h:"Lo mismo, escrito de dos formas",
  c:`<div class="termbox">// DECLARATIVO                          // SCRIPTED
pipeline {                               node('linux') {
  agent { label 'linux' }                  stage('Probar') {
  stages {                                   checkout scm
    stage('Probar') {                        sh './mvnw test'
      steps { sh './mvnw test' }           }
    }                                    }
  }
}</div>
     <p>El declarativo valida la estructura antes de ejecutar y da errores claros. El scripted es Groovy puro: todo es posible, incluido complicarlo mucho. Para lógica puntual dentro del declarativo existe <code>script { }</code>.</p>`},
 {t:"par", p:"Empareja cada característica con la sintaxis",
  pares:[["Empieza con pipeline { }","Declarativo"],["Empieza con node { }","Scripted"],["Bloque para meter Groovy dentro del declarativo","script { }"],["Lo recomendado para pipelines nuevos","Declarativo con script solo cuando haga falta"]],
  why:"Si un Jenkinsfile necesita mucho script { }, esa lógica suele ir mejor en una shared library."},
 {t:"opcion", p:"Tu equipo empieza un pipeline nuevo. ¿Qué sintaxis eliges?",
  ops:["Scripted, porque es más potente","Declarativo: más legible, validado y fácil de mantener por todo el equipo","Da igual","Jobs freestyle"],
  ok:1, why:"Es la recomendación de la documentación de Jenkins."}
]}

]});
