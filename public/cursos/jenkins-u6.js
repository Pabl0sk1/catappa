window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Multibranch, librerías compartidas y configuración como código",
resumen: "Pipelines por rama y por Pull Request, shared libraries para no repetir código, gestión de plugins y Jenkins Configuration as Code",
nivel: "Avanzado",
color: "#c4513a",
lecciones: [

{
id:"jk6l1",
titulo:"Pipelines multibranch",
claves:["Un Multibranch Pipeline descubre las ramas y Pull Requests que tienen Jenkinsfile y crea un job para cada uno","BRANCH_NAME y CHANGE_ID dicen qué se está construyendo","Organization Folder hace lo mismo para todos los repositorios de una organización de GitHub"],
pasos:[
 {t:"info", eti:"Una rama, un pipeline", h:"Multibranch",
  c:`<div class="diag">api-tareas (Multibranch Pipeline)
├── main            #212 ✔
├── feature/login   #7   ✔
├── PR-58           #3   ✘   ─▶ GitHub marca el Pull Request como fallido
└── PR-61           #1   ▶ en curso</div>
     <p>Jenkins escanea el repositorio y crea un job por cada rama o Pull Request con Jenkinsfile. El resultado se publica en GitHub como un <b>check</b> del PR, así que se puede exigir que pase antes de fusionar (protección de rama).</p>`},
 {t:"par", p:"Empareja cada variable o concepto con su significado",
  pares:[["BRANCH_NAME","La rama que se construye (o PR-58 en un Pull Request)"],["CHANGE_ID","El número del Pull Request"],["CHANGE_TARGET","La rama a la que se quiere fusionar el PR"],["Organization Folder","Descubre todos los repositorios de una organización"],["Protección de rama","GitHub no deja fusionar si el check de Jenkins falla"]],
  why:"Con esto el código de main siempre ha pasado el pipeline."},
 {t:"opcion", p:"¿Qué ventaja tiene multibranch frente a un job por rama creado a mano?",
  ops:["Ninguna","Las ramas y PRs nuevos se construyen solos y los jobs de ramas borradas desaparecen, sin configurar nada","Solo funciona con main","Es más barato en licencias"],
  ok:1, why:"Con decenas de ramas y PRs, crear jobs a mano no escala."},
 {t:"vf", p:"En un multibranch, el pipeline de un Pull Request usa el Jenkinsfile de esa rama, así que un cambio en el pipeline se prueba en el propio PR.",
  ok:true, why:"Por eso conviene proteger qué se ejecuta en PRs de forks (repositorios de terceros)."}
]},

{
id:"jk6l2",
titulo:"Shared libraries",
claves:["Una shared library es un repositorio con código de pipeline reutilizable","vars/ define pasos globales (vars/desplegar.groovy se usa como desplegar()); src/ contiene clases","Se carga con @Library('nombre@version') para fijar una versión"],
pasos:[
 {t:"info", eti:"No repetir", h:"Un pipeline estándar para veinte servicios",
  c:`<div class="termbox">// repositorio jenkins-comun
vars/
  pipelineJava.groovy
  desplegar.groovy
src/com/empresa/Notificador.groovy

// vars/pipelineJava.groovy
def call(Map cfg) {
  pipeline {
    agent { docker { image "maven:3.9-eclipse-temurin-\${cfg.java ?: '21'}" } }
    stages {
      stage('Probar') { steps { sh './mvnw -B verify' } }
      stage('Imagen') { steps { sh "docker build -t \${cfg.imagen}:\${env.GIT_COMMIT} ." } }
    }
  }
}

// Jenkinsfile de cada servicio: dos líneas
@Library('jenkins-comun@v2') _
pipelineJava(imagen: 'ghcr.io/empresa/pagos', java: '21')</div>`},
 {t:"par", p:"Empareja cada parte de una shared library con su función",
  pares:[["vars/","Pasos globales que se llaman como funciones"],["src/","Clases Groovy con lógica más compleja"],["resources/","Ficheros de apoyo (plantillas, scripts)"],["@Library('lib@v2') _","Carga la librería fijando la versión v2"],["def call(Map cfg)","Punto de entrada de un paso de vars/"]],
  why:"Fijar la versión evita que un cambio en la librería rompa todos los pipelines a la vez."},
 {t:"opcion", p:"Veinte servicios tienen Jenkinsfiles casi idénticos y cambiar algo obliga a tocar veinte repositorios. ¿Solución?",
  ops:["Copiar y pegar mejor","Una shared library con el pipeline común y un Jenkinsfile mínimo en cada servicio","Un solo repositorio para todo","Volver a jobs freestyle"],
  ok:1, why:"Es el mismo principio que una librería de código: DRY."}
]},

{
id:"jk6l3",
titulo:"Plugins y Jenkins as Code",
claves:["Pocos plugins, mantenidos y actualizados: cada plugin es superficie de ataque y posible incompatibilidad","JCasC (Configuration as Code) define la configuración de Jenkins en un jenkins.yaml","Una imagen propia con plugins.txt y jenkins.yaml hace Jenkins reproducible"],
pasos:[
 {t:"info", eti:"Reproducible", h:"Jenkins entero como código",
  c:`<div class="termbox"># plugins.txt
configuration-as-code
workflow-aggregator
git
kubernetes
credentials-binding

# Dockerfile
FROM jenkins/jenkins:lts-jdk17
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt
COPY jenkins.yaml /var/jenkins_home/casc/jenkins.yaml
ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc/jenkins.yaml

# jenkins.yaml (JCasC)
jenkins:
  numExecutors: 0
  securityRealm:
    local:
      allowsSignup: false
  authorizationStrategy:
    loggedInUsersCanDoAnything:
      allowAnonymousRead: false</div>`},
 {t:"par", p:"Empareja cada fichero con su papel",
  pares:[["plugins.txt","Lista de plugins (con versión) que lleva la imagen"],["jenkins-plugin-cli","Instala los plugins al construir la imagen"],["jenkins.yaml","Configuración del controlador con JCasC"],["CASC_JENKINS_CONFIG","Indica a Jenkins dónde está el jenkins.yaml"],["Job DSL o multibranch","Crear los jobs también como código"]],
  why:"Así se puede reconstruir el controlador desde cero en minutos."},
 {t:"opcion", p:"¿Qué problema evita configurar Jenkins con JCasC en lugar de a mano?",
  ops:["Ninguno","El «servidor copo de nieve»: una configuración hecha a clics que nadie sabe reproducir ni revisar","Que Jenkins use Java","Que haya que instalar plugins"],
  ok:1, why:"Con JCasC la configuración está versionada, revisada y se aplica igual en cada arranque."},
 {t:"vf", p:"Instalar muchos plugins «por si acaso» es una buena práctica.",
  ok:false, why:"Cada plugin añade dependencias, fallos de compatibilidad en las actualizaciones y posibles vulnerabilidades."}
]}

]});
