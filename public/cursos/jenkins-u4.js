window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Pipeline para Java y Spring Boot",
resumen: "Compilar con Maven, publicar pruebas y cobertura, construir y subir la imagen Docker con credenciales y desplegar por entornos",
nivel: "Intermedio",
color: "#e5734c",
lecciones: [

{
id:"jk4l1",
titulo:"Compilar y probar con Maven",
claves:["./mvnw -B (modo batch) para builds sin interacción y con el Maven del proyecto","junit publica los resultados de las pruebas; archiveArtifacts guarda el .jar","Herramientas como el JDK se fijan con tools { } o usando un agente Docker con la imagen adecuada"],
pasos:[
 {t:"info", eti:"Tu stack", h:"Pipeline de una API Spring Boot",
  c:`<div class="termbox">pipeline {
  agent { docker { image 'maven:3.9-eclipse-temurin-21' } }
  stages {
    stage('Compilar') { steps { sh './mvnw -B -DskipTests package' } }
    stage('Pruebas') {
      steps { sh './mvnw -B verify' }
      post {
        always {
          junit 'target/surefire-reports/*.xml'
          jacoco execPattern: 'target/jacoco.exec'     // cobertura (plugin JaCoCo)
        }
      }
    }
    stage('Guardar el .jar') {
      steps { archiveArtifacts artifacts: 'target/*.jar', fingerprint: true }
    }
  }
}</div>
     <p>Con un <b>agente Docker</b> no hace falta instalar Java ni Maven en los agentes: cada build usa exactamente la imagen indicada.</p>`},
 {t:"par", p:"Empareja cada paso con lo que hace",
  pares:[["./mvnw -B verify","Compila, pasa las pruebas y las verificaciones del proyecto"],["junit 'target/surefire-reports/*.xml'","Publica los resultados de las pruebas en Jenkins"],["archiveArtifacts","Guarda ficheros del build para descargarlos después"],["fingerprint: true","Permite rastrear en qué builds se usó cada artefacto"],["agent { docker { image '...' } }","Ejecuta el build dentro de ese contenedor"]],
  why:"Con junit publicado, Jenkins muestra la tendencia de pruebas y marca UNSTABLE si alguna falla."},
 {t:"opcion", p:"¿Por qué <code>-B</code> en Maven dentro de Jenkins?",
  ops:["Para compilar más rápido","Modo batch: sin preguntas interactivas y con una salida más limpia para la consola","Para saltar las pruebas","Para usar Maven 3"],
  ok:1, why:"En CI nada puede quedarse esperando una respuesta del teclado."},
 {t:"vf", p:"Usar el wrapper <code>./mvnw</code> garantiza que Jenkins use la misma versión de Maven que los desarrolladores.",
  ok:true, why:"La versión va fijada en el repositorio (.mvn/wrapper), igual que el Gradle wrapper."}
]},

{
id:"jk4l2",
titulo:"Imagen Docker y credenciales",
claves:["Las credenciales se guardan en Jenkins y se inyectan con withCredentials; nunca en el Jenkinsfile","docker login --password-stdin para no dejar la contraseña en la línea de comandos","Etiqueta la imagen con el commit o el número de build, no solo con latest"],
pasos:[
 {t:"info", eti:"Publicar", h:"Construir y subir la imagen",
  c:`<div class="termbox">stage('Imagen') {
  environment { IMAGEN = "ghcr.io/pablo/api-tareas:\${GIT_COMMIT.take(7)}" }
  steps {
    sh 'docker build -t $IMAGEN .'
    withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'USU', passwordVariable: 'CLAVE')]) {
      sh 'echo "$CLAVE" | docker login ghcr.io -u "$USU" --password-stdin'
      sh 'docker push $IMAGEN'
    }
  }
  post { always { sh 'docker logout ghcr.io || true' } }
}</div>
     <p>Fíjate en las <b>comillas simples</b> dentro de withCredentials: así la shell lee la variable y el secreto no pasa por Groovy ni queda en el historial. Jenkins además <b>enmascara</b> los secretos en la consola (se ven como ****).</p>`},
 {t:"par", p:"Empareja cada práctica con su motivo",
  pares:[["withCredentials","Inyectar el secreto solo durante esos pasos"],["--password-stdin","Que la contraseña no aparezca en la lista de procesos ni en la consola"],["Etiqueta con el commit","Saber exactamente qué código lleva cada imagen"],["Comillas simples en el sh","Que Groovy no interpole el secreto"],["docker logout en post","No dejar la sesión abierta en el agente"]],
  why:"Todo esto se pregunta en entrevistas de DevOps: cómo gestionas secretos en CI."},
 {t:"opcion", p:"¿Qué está mal en <code>sh \"docker login -u pablo -p \${CLAVE}\"</code>?",
  ops:["Nada","Groovy interpola el secreto (puede quedar registrado) y -p lo deja visible en los procesos; mejor comillas simples y --password-stdin","Falta sudo","docker login no acepta usuario"],
  ok:1, why:"Jenkins incluso avisa: «A secret was passed to sh using Groovy String interpolation, which is insecure»."},
 {t:"escribe", p:"Escribe el comando para subir la imagen cuyo nombre está en la variable de shell <code>IMAGEN</code>",
  sol:["docker push $IMAGEN","docker push \"$IMAGEN\""], ph:"docker …", pista:"docker push y la variable con $.", why:"docker push $IMAGEN."}
]},

{
id:"jk4l3",
titulo:"Desplegar por entornos",
claves:["Una misma imagen recorre los entornos: staging primero, producción después (build once, deploy many)","Producción solo desde main y con aprobación","Pruebas de humo tras el despliegue y marcha atrás preparada"],
pasos:[
 {t:"info", eti:"Hasta producción", h:"Build once, deploy many",
  c:`<div class="diag">commit ─▶ compilar ─▶ pruebas ─▶ imagen :a1b2c3d ─▶ STAGING ─▶ pruebas de humo ─▶ [aprobación] ─▶ PRODUCCIÓN
                                     │                                                      │
                                     └──────────── la MISMA imagen, sin reconstruir ─────────┘</div>
     <div class="termbox">stage('Staging') {
  when { branch 'main' }
  steps { sh 'kubectl --context staging set image deploy/api api=$IMAGEN' }
}
stage('Humo') {
  when { branch 'main' }
  steps { sh 'curl -fsS https://staging.empresa.com/actuator/health' }
}
stage('Producción') {
  when { branch 'main' }
  input { message '¿Desplegar a producción?' }
  steps { sh 'kubectl --context produccion set image deploy/api api=$IMAGEN' }
}</div>`},
 {t:"orden", p:"Ordena un pipeline de entrega continua",
  items:["Compilar y pasar las pruebas","Construir la imagen y etiquetarla con el commit","Subirla al registro","Desplegarla en staging","Pruebas de humo en staging","Aprobación manual","Desplegar la misma imagen en producción"],
  why:"Reconstruir para producción rompe la garantía de que despliegas lo que probaste."},
 {t:"opcion", p:"¿Por qué no se vuelve a construir la imagen para producción?",
  ops:["Por ahorrar disco","Para desplegar exactamente el mismo artefacto que se probó en staging","Porque Docker no lo permite","Porque producción usa otra rama"],
  ok:1, why:"Build once, deploy many: la configuración cambia por entorno (variables), el artefacto no."},
 {t:"vf", p:"Las pruebas de humo tras el despliegue sirven para detectar rápido si la versión nueva ni siquiera arranca bien.",
  ok:true, why:"Si fallan, el pipeline se detiene antes de llegar a producción o activa la marcha atrás."}
]}

]});
