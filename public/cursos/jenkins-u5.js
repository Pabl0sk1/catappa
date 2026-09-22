window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Agentes, paralelismo y rendimiento",
resumen: "Etiquetas y agentes por etapa, agentes Docker y efímeros en Kubernetes, parallel, matrix, stash y cómo hacer pipelines rápidos",
nivel: "Avanzado",
color: "#cf5a3e",
lecciones: [

{
id:"jk5l1",
titulo:"Agentes y etiquetas",
claves:["Las etiquetas (labels) describen a los agentes: linux, docker, windows, gpu…","agent none arriba y un agent por stage para usar la herramienta justa en cada paso","Los agentes se conectan por SSH o con el agente inbound (JNLP) por el puerto 50000"],
pasos:[
 {t:"info", eti:"Dónde se ejecuta", h:"Un agente para cada etapa",
  c:`<div class="termbox">pipeline {
  agent none                                   // cada stage elige el suyo
  stages {
    stage('Backend') {
      agent { docker { image 'maven:3.9-eclipse-temurin-21' } }
      steps { sh './mvnw -B verify' }
    }
    stage('Frontend') {
      agent { docker { image 'node:22-alpine' } }
      steps { sh 'npm ci &amp;&amp; npm test' }
    }
    stage('App de Windows') {
      agent { label 'windows' }
      steps { bat 'build.cmd' }
    }
  }
}</div>`},
 {t:"par", p:"Empareja cada forma de elegir agente con su efecto",
  pares:[["agent any","Cualquier agente con un executor libre"],["agent none","Ninguno a nivel global: cada stage declara el suyo"],["agent { label 'linux && docker' }","Un agente que tenga las dos etiquetas"],["agent { docker { image 'node:22' } }","Un contenedor de esa imagen en un agente con Docker"],["agent { dockerfile true }","Construye la imagen con el Dockerfile del repo y ejecuta dentro"]],
  why:"Las expresiones de etiquetas admiten &amp;&amp;, || y !."},
 {t:"opcion", p:"Un stage usa <code>bat</code> en vez de <code>sh</code>. ¿Qué indica?",
  ops:["Que es más rápido","Que se ejecuta en un agente Windows: bat lanza comandos de cmd","Que es un paso de Docker","Nada, son sinónimos"],
  ok:1, why:"sh necesita una shell Unix; en Windows se usa bat o powershell."},
 {t:"vf", p:"Con <code>agent none</code> a nivel de pipeline, un stage sin su propio agent no puede ejecutar pasos como sh.",
  ok:true, why:"Necesita un agente donde ejecutarse; por eso cada stage declara el suyo."}
]},

{
id:"jk5l2",
titulo:"parallel, matrix y stash",
claves:["parallel ejecuta stages a la vez; failFast true corta el resto si uno falla","matrix genera combinaciones (por ejemplo, Java 17 y 21 en Linux y Windows)","stash guarda ficheros para usarlos en otro stage o agente; unstash los recupera"],
pasos:[
 {t:"info", eti:"Más rápido", h:"Trabajo en paralelo",
  c:`<div class="termbox">stage('Pruebas') {
  failFast true
  parallel {
    stage('Unitarias')    { steps { sh './mvnw -B test' } }
    stage('Integración')  { steps { sh './mvnw -B verify -Pintegracion' } }
    stage('Seguridad')    { steps { sh 'trivy fs --exit-code 1 .' } }
  }
}
stage('Compatibilidad') {
  matrix {
    axes { axis { name 'JAVA'; values '17', '21' } }
    stages { stage('Probar') { steps { sh "./probar-con-java.sh \${JAVA}" } } }
  }
}
// pasar el .jar de un agente a otro
stage('Compilar') { steps { sh './mvnw -B package'; stash name: 'jar', includes: 'target/*.jar' } }
stage('Imagen')   { agent { label 'docker' }; steps { unstash 'jar'; sh 'docker build .' } }</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["parallel","Ejecutar varias etapas a la vez"],["failFast true","Cancelar las ramas paralelas en cuanto una falla"],["matrix","Probar todas las combinaciones de varios ejes"],["stash / unstash","Pasar ficheros entre etapas que corren en agentes distintos"],["archiveArtifacts","Guardar ficheros para descargarlos después del build"]],
  why:"stash es temporal (solo ese build); archiveArtifacts queda en el historial."},
 {t:"opcion", p:"Las pruebas unitarias tardan 6 min, las de integración 8 y el análisis de seguridad 4. En paralelo, ¿cuánto tarda la etapa aproximadamente?",
  ops:["18 minutos","Unos 8 minutos, lo que tarda la más lenta (si hay executors para las tres)","4 minutos","6 minutos"],
  ok:1, why:"El paralelismo está limitado por la rama más lenta y por los executors disponibles."},
 {t:"vf", p:"Un <code>stash</code> sirve para guardar dependencias de Maven entre builds distintos.",
  ok:false, why:"Stash solo vive durante un build; para cachear entre builds se usan volúmenes, cachés del agente o un repositorio como Nexus."}
]},

{
id:"jk5l3",
titulo:"Agentes efímeros en Kubernetes",
claves:["El plugin de Kubernetes crea un pod por build y lo borra al terminar","Cada contenedor del pod aporta una herramienta; container('maven') { } elige dónde ejecutar","Ventajas: entorno limpio, escalado automático y sin agentes ociosos"],
pasos:[
 {t:"info", eti:"A escala", h:"Un pod por build",
  c:`<div class="termbox">pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: maven
            image: maven:3.9-eclipse-temurin-21
            command: ["sleep"]
            args: ["infinity"]
          - name: kaniko
            image: gcr.io/kaniko-project/executor:debug
            command: ["sleep"]
            args: ["infinity"]
      '''
    }
  }
  stages {
    stage('Probar') { steps { container('maven') { sh './mvnw -B verify' } } }
    stage('Imagen') { steps { container('kaniko') { sh '/kaniko/executor --destination=$IMAGEN' } } }
  }
}</div>
     <p>Para construir imágenes dentro de Kubernetes sin montar el socket de Docker se usan herramientas como <b>Kaniko</b> o <b>Buildah</b>.</p>`},
 {t:"par", p:"Empareja cada problema con cómo lo resuelven los agentes efímeros",
  pares:[["Agentes con restos de builds anteriores","Cada build empieza en un pod limpio"],["Agentes ociosos gastando dinero","Los pods solo existen mientras dura el build"],["Picos de builds los lunes","Kubernetes crea tantos pods como haga falta"],["Versiones de herramientas distintas","Cada pipeline declara sus imágenes"]],
  why:"Es la arquitectura habitual de Jenkins moderno en empresas."},
 {t:"opcion", p:"¿Por qué evitar montar /var/run/docker.sock en los pods de build?",
  ops:["Porque es lento","Porque da control total del Docker del nodo: un build podría escapar y afectar a todo el clúster","Porque no funciona en Kubernetes","Porque Jenkins lo prohíbe"],
  ok:1, why:"El socket de Docker equivale a root en el nodo; Kaniko o Buildah construyen imágenes sin él."}
]}

]});
