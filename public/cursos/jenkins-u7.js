window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "El pipeline de una API Spring Boot",
resumen: "Maven en Jenkins, publicar pruebas y artefactos, credenciales, imagen Docker y despliegue por entornos hasta producción",
nivel: "Intermedio",
color: "#e5734c",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"jn7l1",
titulo:"Recordatorio: qué hace Maven",
claves:["Maven compila, pasa las pruebas y empaqueta un proyecto Java con un solo comando","./mvnw es el wrapper: usa la versión de Maven fijada en el repositorio","-B (batch) evita preguntas interactivas; en CI siempre se usa"],
pasos:[
 {t:"info", eti:"Antes del pipeline", h:"Maven en dos minutos",
  c:`<p>Antes de escribir el pipeline conviene tener claro qué comandos va a ejecutar. En un proyecto Java con <b>Maven</b>:</p>
     <ul><li><code>./mvnw compile</code>: compila el código.</li>
     <li><code>./mvnw test</code>: compila y <b>pasa las pruebas</b>.</li>
     <li><code>./mvnw package</code>: compila, prueba y crea el <b>.jar</b> en la carpeta <code>target/</code>.</li>
     <li><code>./mvnw verify</code>: todo lo anterior más las verificaciones extra (por ejemplo, pruebas de integración).</li></ul>
     <p><code>./mvnw</code> es el <b>Maven wrapper</b>: un script incluido en el repositorio que descarga y usa <b>la versión exacta</b> de Maven que el proyecto necesita. Por eso en CI se usa <code>./mvnw</code> y no <code>mvn</code>: así no depende de lo que haya instalado el agente.</p>`},
 {t:"par", p:"Empareja cada comando con lo que hace",
  pares:[["./mvnw compile","Compila el código"],["./mvnw test","Compila y pasa las pruebas"],["./mvnw package","Compila, prueba y crea el .jar"],["./mvnw verify","Añade las verificaciones e integraciones"]],
  why:"Cada uno incluye lo anterior: package ya pasa las pruebas."},
 {t:"opcion", p:"¿Por qué en Jenkins se usa <code>./mvnw</code> en vez de <code>mvn</code>?",
  ops:["Porque es más corto","Porque usa la versión de Maven fijada en el repositorio, sin depender de lo instalado en el agente","Porque mvn no existe en Linux","Porque compila más rápido"],
  ok:1, why:"Es la misma idea de reproducibilidad que persigue Docker."},
 {t:"info", eti:"Modo batch", h:"La opción -B",
  c:`<p>En CI siempre verás <code>./mvnw -B</code>. La <b>B</b> es de <i>batch</i>: sin preguntas interactivas y con una salida más limpia. Un build automático no puede quedarse esperando a que alguien conteste algo por teclado.</p>`},
 {t:"vf", p:"La opción -B de Maven sirve para saltarse las pruebas.",
  ok:false, why:"-B es el modo batch. Saltarse las pruebas sería -DskipTests (y solo se hace en etapas donde ya se probaron)."},
 {t:"info", eti:"Informes", h:"Dónde deja Maven los resultados",
  c:`<p>Cuando Maven pasa las pruebas, escribe un informe en XML por cada clase de prueba en <code>target/surefire-reports/</code>. Esos ficheros son los que Jenkins lee para mostrar cuántas pruebas pasaron y cuáles fallaron. Lo usarás en la siguiente lección.</p>`},
 {t:"opcion", p:"¿Dónde deja Maven los informes de las pruebas?",
  ops:["En Jenkins directamente","En ficheros XML dentro de target/surefire-reports/","En el repositorio","En la consola solamente"],
  ok:1, why:"Jenkins los recoge de ahí con el paso junit."}
]},

/* =============== U7 L2 =============== */
{
id:"jn7l2",
titulo:"Compilar y probar en el pipeline",
claves:["Con agent docker no hace falta instalar Java ni Maven en el agente","junit publica los informes y marca el build como UNSTABLE si hay pruebas fallidas","Publicar las pruebas siempre (post always), fallen o no"],
pasos:[
 {t:"info", eti:"El agente", h:"Un contenedor con Maven",
  c:`<p>Para compilar Java, el agente necesita Java y Maven. En vez de instalarlos, se le pide a Jenkins que ejecute la etapa <b>dentro de un contenedor</b>:</p>
     <div class="termbox">pipeline {
    agent { docker { image 'maven:3.9-eclipse-temurin-21' } }
    stages {
        stage('Compilar y probar') {
            steps { sh './mvnw -B verify' }
        }
    }
}</div>
     <p>Jenkins arranca ese contenedor, monta dentro el workspace, ejecuta los pasos y lo borra al terminar. Requisito: que el agente tenga Docker (el plugin Docker Pipeline).</p>`},
 {t:"opcion", p:"¿Qué ventaja tiene <code>agent { docker { image 'maven:3.9-eclipse-temurin-21' } }</code>?",
  ops:["Que el build va más rápido siempre","Que no hace falta instalar Java ni Maven en el agente, y cada proyecto usa exactamente la versión que quiere","Que no necesita repositorio","Que evita las pruebas"],
  ok:1, why:"Es la forma más limpia de tener herramientas distintas por proyecto."},
 {t:"info", eti:"Publicar pruebas", h:"El paso junit",
  c:`<p>Que las pruebas se ejecuten no basta: queremos <b>verlas en Jenkins</b>. El paso <code>junit</code> lee los informes XML y los muestra en el build: cuántas pruebas hay, cuáles fallaron y la tendencia respecto a builds anteriores.</p>
     <div class="termbox">stage('Compilar y probar') {
    steps { sh './mvnw -B verify' }
    post {
        always { junit 'target/surefire-reports/*.xml' }
    }
}</div>
     <p>Va en <b>post always</b> porque, si una prueba falla, el paso <code>sh</code> devuelve error y sin el <code>post</code> nunca llegaríamos a publicar el informe.</p>`},
 {t:"opcion", p:"Una prueba falla. ¿En qué estado queda el build si publicas los informes con <code>junit</code>?",
  ops:["SUCCESS","UNSTABLE (amarillo): terminó, pero hay pruebas fallidas","ABORTED","No cambia"],
  ok:1, why:"Ahora tiene sentido el estado UNSTABLE que viste en la unidad 4."},
 {t:"par", p:"Empareja cada elemento con su papel",
  pares:[["./mvnw -B verify","Ejecuta las pruebas"],["target/surefire-reports/*.xml","Los informes que genera Maven"],["junit","El paso que publica esos informes en Jenkins"],["post always","Que se publiquen fallen o no las pruebas"]],
  why:"Esta combinación aparece en casi todos los pipelines de Java."},
 {t:"vf", p:"Si no usas el paso junit, Jenkins no puede mostrar qué pruebas fallaron; solo lo verás en el texto de la consola.",
  ok:true, why:"junit es lo que convierte el texto en informes navegables con historial."}
]},

/* =============== U7 L3 =============== */
{
id:"jn7l3",
titulo:"Guardar el artefacto",
claves:["archiveArtifacts guarda ficheros del build para descargarlos después desde Jenkins","Se usa para el .jar, informes o cualquier resultado que quieras conservar","No es un sustituto de un repositorio de artefactos como Nexus o un registro de imágenes"],
pasos:[
 {t:"info", eti:"Conservar", h:"El paso archiveArtifacts",
  c:`<p>Cuando Maven termina, el <code>.jar</code> queda en <code>target/</code> dentro del workspace del agente… que se puede limpiar o reutilizar en el siguiente build. Para conservarlo, se <b>archiva</b>:</p>
     <div class="termbox">stage('Empaquetar') {
    steps {
        sh './mvnw -B -DskipTests package'
        archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
    }
}</div>
     <p>A partir de ahí, en la página del build aparece el <code>.jar</code> para descargarlo. Con <code>fingerprint: true</code>, Jenkins guarda además una huella del fichero, lo que permite saber en qué otros builds se usó ese mismo artefacto.</p>`},
 {t:"opcion", p:"¿Para qué sirve <code>archiveArtifacts</code>?",
  ops:["Para subir el fichero a GitHub","Para guardar ficheros del build en Jenkins y poder descargarlos después","Para borrar el workspace","Para publicar las pruebas"],
  ok:1, why:"Es útil para el .jar, informes de cobertura o capturas de pruebas de interfaz."},
 {t:"info", eti:"Ojo con el espacio", h:"Archivar con cabeza",
  c:`<p>Los artefactos archivados ocupan espacio en JENKINS_HOME. Si cada build guarda un <code>.jar</code> de 60 MB y haces 50 builds al día, el disco se llena en poco tiempo. Por eso:</p>
     <ul><li>Archiva solo lo necesario.</li>
     <li>Usa <code>buildDiscarder</code> para conservar solo los últimos builds.</li>
     <li>Para artefactos que van a producción, mejor un <b>registro de imágenes</b> (como ghcr.io) o un repositorio como <b>Nexus</b>.</li></ul>`},
 {t:"vf", p:"Archivar artefactos en Jenkins es la forma recomendada de guardar todas las versiones que van a producción.",
  ok:false, why:"Para eso están los registros de imágenes o repositorios de artefactos; Jenkins guarda lo reciente para consultarlo."},
 {t:"opcion", p:"¿Qué opción combina bien con archiveArtifacts para que el disco no se llene?",
  ops:["timestamps()","buildDiscarder(logRotator(numToKeepStr: '20'))","retry(3)","disableConcurrentBuilds()"],
  ok:1, why:"Conserva solo los últimos builds y borra los artefactos antiguos con ellos."}
]},

/* =============== U7 L4 =============== */
{
id:"jn7l4",
titulo:"Credenciales: contraseñas sin escribirlas",
claves:["Las credenciales se guardan cifradas en Jenkins y se usan por su identificador (credentialsId)","withCredentials las inyecta como variables solo durante esos pasos","Jenkins enmascara los secretos en la consola, pero no los protege si los imprimes transformados"],
pasos:[
 {t:"info", eti:"El problema", h:"Nunca escribas una contraseña en el Jenkinsfile",
  c:`<p>Para subir una imagen a un registro o desplegar en un servidor hacen falta contraseñas o tokens. Escribirlos en el Jenkinsfile sería un desastre: el Jenkinsfile está en el repositorio, lo ve todo el equipo y queda en el historial de Git para siempre.</p>
     <p>Jenkins tiene un <b>almacén de credenciales</b>: las guarda cifradas y tú solo usas su <b>identificador</b>.</p>`},
 {t:"info", eti:"Crear una", h:"Dónde se guardan",
  c:`<p>Se crean en <b>Administrar Jenkins → Credenciales</b> (Manage Jenkins → Credentials). Al crear una eliges el tipo:</p>
     <ul><li><b>Usuario y contraseña</b>: para registros de imágenes, repositorios privados…</li>
     <li><b>Texto secreto</b> (Secret text): un token de API.</li>
     <li><b>Clave SSH</b>: para conectarse a servidores.</li>
     <li><b>Fichero secreto</b>: por ejemplo un <code>kubeconfig</code>.</li></ul>
     <p>Y le pones un <b>ID</b>, por ejemplo <code>ghcr</code>. Ese ID es lo único que aparece en el Jenkinsfile.</p>`},
 {t:"par", p:"Empareja cada tipo de credencial con su uso",
  pares:[["Usuario y contraseña","Entrar en un registro de imágenes"],["Texto secreto","Un token de una API"],["Clave SSH","Conectarse a un servidor por SSH"],["Fichero secreto","Un kubeconfig completo"]],
  why:"En el pipeline solo se usa el ID; el valor nunca aparece."},
 {t:"info", eti:"Usarla", h:"El bloque withCredentials",
  c:`<div class="termbox">withCredentials([usernamePassword(credentialsId: 'ghcr',
                                 usernameVariable: 'USU',
                                 passwordVariable: 'CLAVE')]) {
    sh 'echo "$CLAVE" | docker login ghcr.io -u "$USU" --password-stdin'
}</div>
     <p>Dentro de ese bloque existen las variables <code>USU</code> y <code>CLAVE</code>; fuera, no. Fíjate en dos detalles importantes:</p>
     <ul><li><b>Comillas simples</b> en el <code>sh</code>: así el secreto lo lee la shell y Groovy no lo toca.</li>
     <li><code>--password-stdin</code>: la contraseña entra por la entrada estándar en vez de escribirse en el comando, donde sería visible en la lista de procesos.</li></ul>`},
 {t:"opcion", p:"¿Qué está mal en <code>sh \"docker login -u pablo -p \${CLAVE}\"</code>?",
  ops:["Nada","Que Groovy interpola el secreto (puede acabar registrado) y -p lo deja visible; lo correcto es comillas simples y --password-stdin","Que falta sudo","Que docker login no acepta usuario"],
  ok:1, why:"Jenkins incluso avisa de la interpolación de secretos en comillas dobles."},
 {t:"info", eti:"Enmascarado", h:"Hasta dónde protege Jenkins",
  c:`<p>Jenkins sustituye los secretos por <code>****</code> si aparecen en la consola. Pero solo reconoce el <b>valor exacto</b>: si lo transformas (por ejemplo, lo codificas en base64) y lo imprimes, saldrá en claro. Regla: <b>nunca imprimas secretos</b>, ni siquiera «para depurar».</p>`},
 {t:"vf", p:"Si haces <code>echo $TOKEN | base64</code>, Jenkins seguirá enmascarando el valor.",
  ok:false, why:"El enmascarado compara con el valor exacto; el token codificado aparecería tal cual en la consola."}
]},

/* =============== U7 L5 =============== */
{
id:"jn7l5",
titulo:"Construir y subir la imagen Docker",
claves:["El registro es el almacén de imágenes (Docker Hub, ghcr.io, ECR…)","La imagen se etiqueta con el commit o el número de build, no solo con latest","Secuencia: build, login con credenciales, push y logout"],
pasos:[
 {t:"info", eti:"Recuerda Docker", h:"Registro y etiquetas",
  c:`<p>Del curso de Docker: un <b>registro</b> es donde se guardan las imágenes (Docker Hub, GitHub Container Registry, Amazon ECR). Una imagen se identifica así:</p>
     <div class="dg"><div class="dg-tit">las partes del nombre de una imagen</div>
<svg viewBox="0 0 305 72" width="100%" style="max-width:420px;display:block;margin:auto" role="img" aria-label="ghcr.io es el registro, pablo el usuario, api-tareas el nombre y a1b2c3d la etiqueta"><defs><marker id="fl-jenkins7-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs><text x="47.4" y="24" text-anchor="middle" font-size="14" font-family="var(--mono)" font-weight="700" fill="var(--ink)">ghcr.io</text><path d="M19.0 34 V40 H75.8 V34 M47.4 40 V46" fill="none" stroke="var(--accent)" stroke-width="1.5"/><text x="47.4" y="62" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)">registro</text><text x="81.0" y="24" text-anchor="middle" font-size="14" font-family="var(--mono)" font-weight="700" fill="var(--ink-3)">/</text><text x="106.2" y="24" text-anchor="middle" font-size="14" font-family="var(--mono)" font-weight="700" fill="var(--ink)">pablo</text><path d="M86.2 34 V40 H126.2 V34 M106.2 40 V46" fill="none" stroke="var(--accent)" stroke-width="1.5"/><text x="106.2" y="62" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)">usuario</text><text x="131.4" y="24" text-anchor="middle" font-size="14" font-family="var(--mono)" font-weight="700" fill="var(--ink-3)">/</text><text x="177.6" y="24" text-anchor="middle" font-size="14" font-family="var(--mono)" font-weight="700" fill="var(--ink)">api-tareas</text><path d="M136.6 34 V40 H218.6 V34 M177.6 40 V46" fill="none" stroke="var(--accent)" stroke-width="1.5"/><text x="177.6" y="62" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)">nombre</text><text x="223.8" y="24" text-anchor="middle" font-size="14" font-family="var(--mono)" font-weight="700" fill="var(--ink-3)">:</text><text x="257.4" y="24" text-anchor="middle" font-size="14" font-family="var(--mono)" font-weight="700" fill="var(--ink)">a1b2c3d</text><path d="M229.0 34 V40 H285.8 V34 M257.4 40 V46" fill="none" stroke="var(--accent)" stroke-width="1.5"/><text x="257.4" y="62" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)">etiqueta</text></svg></div>
     <p>La <b>etiqueta</b> (tag) es la versión. Si siempre usas <code>latest</code>, nunca sabrás qué código lleva la imagen que está en producción. Por eso se etiqueta con algo único: el <b>identificador del commit</b> o el número de build.</p>`},
 {t:"opcion", p:"¿Por qué no basta con etiquetar las imágenes como <code>latest</code>?",
  ops:["Porque ocupa más","Porque latest cambia con cada build: no sabrías qué código está realmente en producción ni podrías volver a una versión anterior","Porque Docker no lo permite","Porque es más lento"],
  ok:1, why:"Etiquetar con el commit permite decir «producción tiene el commit a1b2c3d»."},
 {t:"info", eti:"La etapa", h:"Construir, entrar, subir",
  c:`<div class="termbox">stage('Imagen') {
    environment {
        IMAGEN = "ghcr.io/pablo/api-tareas:\${GIT_COMMIT.take(7)}"
    }
    steps {
        sh 'docker build -t $IMAGEN .'
        withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'USU', passwordVariable: 'CLAVE')]) {
            sh 'echo "$CLAVE" | docker login ghcr.io -u "$USU" --password-stdin'
            sh 'docker push $IMAGEN'
        }
    }
    post {
        always { sh 'docker logout ghcr.io || true' }
    }
}</div>
     <p><code>GIT_COMMIT.take(7)</code> coge los 7 primeros caracteres del identificador del commit (a1b2c3d), que es como se suele nombrar en Git.</p>`},
 {t:"orden", p:"Ordena los pasos de la etapa de imagen",
  items:["Construir la imagen con docker build","Entrar en el registro con docker login usando la credencial","Subir la imagen con docker push","Salir del registro con docker logout"],
  why:"El logout va en post always para que se ejecute aunque el push falle."},
 {t:"opcion", p:"¿Por qué el <code>docker logout</code> está en <code>post { always { … } }</code>?",
  ops:["Por costumbre","Para que la sesión se cierre en el agente aunque el push falle","Porque logout debe ir antes del push","Para acelerar el build"],
  ok:1, why:"Si el build falla justo después del login, el agente se quedaría con la sesión abierta."},
 {t:"vf", p:"<code>docker logout ghcr.io || true</code> evita que el propio logout haga fallar el build si no había sesión.",
  ok:true, why:"«|| true» significa «si el comando falla, sigue igualmente»."}
]},

/* =============== U7 L6 =============== */
{
id:"jn7l6",
titulo:"Desplegar por entornos hasta producción",
claves:["Build once, deploy many: la misma imagen probada pasa de staging a producción","Pruebas de humo después de desplegar, para comprobar que la versión arranca y responde","Producción: solo desde main y con aprobación"],
pasos:[
 {t:"info", eti:"La idea", h:"Construir una vez, desplegar muchas",
  c:`<div class="dg"><div class="dg-tit">construir una vez, desplegar muchas</div>
<div class="dg-flujo" style="row-gap:8px">
<div class="dg-caja">commit</div><div class="dg-caja">compilar</div><div class="dg-caja">probar</div>
<div class="dg-caja acento doble">imagen<small><code>:a1b2c3d</code></small></div>
<div class="dg-caja doble">STAGING<small><code>:a1b2c3d</code></small></div>
<div class="dg-caja">humo</div>
<div class="dg-caja">aprobación</div>
<div class="dg-caja ok doble">PRODUCCIÓN<small><code>:a1b2c3d</code></small></div>
</div>
<div class="dg-nota arriba" style="margin-top:8px">la MISMA imagen, sin reconstruir</div></div>
     <p>Si para producción volvieras a construir la imagen, ya <b>no sería la misma</b> que probaste: podrían haber cambiado dependencias o la imagen base. Lo que cambia entre entornos es la <b>configuración</b> (variables de entorno, contraseñas), no el artefacto.</p>`},
 {t:"opcion", p:"¿Por qué no se reconstruye la imagen para producción?",
  ops:["Para ahorrar tiempo de build","Para desplegar exactamente el mismo artefacto que pasó las pruebas en staging","Porque Docker no deja","Porque producción usa otra rama"],
  ok:1, why:"Es la regla «build once, deploy many»: se construye una vez y se promociona."},
 {t:"info", eti:"Las etapas", h:"Staging, humo y producción",
  c:`<div class="termbox">stage('Staging') {
    when { branch 'main' }
    steps { sh './desplegar.sh staging $IMAGEN' }
}
stage('Pruebas de humo') {
    when { branch 'main' }
    steps { sh 'curl -fsS https://staging.empresa.com/actuator/health' }
}
stage('Producción') {
    when { branch 'main' }
    steps {
        timeout(time: 1, unit: 'HOURS') {
            input message: '¿Desplegar a producción?', ok: 'Desplegar'
        }
        sh './desplegar.sh produccion $IMAGEN'
    }
}</div>
     <p>Las <b>pruebas de humo</b> (smoke tests) son comprobaciones mínimas: que la aplicación arranca y responde. En Spring Boot, <code>/actuator/health</code> es el clásico. La opción <code>-f</code> de curl hace que devuelva error si la respuesta no es correcta, y así el pipeline se detiene.</p>`},
 {t:"par", p:"Empareja cada etapa con su propósito",
  pares:[["Staging","Desplegar en una copia parecida a producción"],["Pruebas de humo","Comprobar que la versión desplegada arranca y responde"],["input de aprobación","Que una persona decida el paso a producción"],["when branch 'main'","Que esto solo ocurra en la rama principal"]],
  why:"Es el esqueleto de la entrega continua que se pide en las entrevistas."},
 {t:"orden", p:"Ordena el pipeline completo de la API",
  items:["Descargar el código","Compilar y pasar las pruebas","Publicar los informes de pruebas","Construir la imagen y etiquetarla con el commit","Subirla al registro","Desplegar en staging","Pruebas de humo","Aprobación manual","Desplegar la misma imagen en producción"],
  why:"Si te preguntan «diséñame un pipeline», este es el guion."},
 {t:"opcion", p:"Las pruebas de humo en staging fallan. ¿Qué debería ocurrir?",
  ops:["Seguir con producción","El pipeline se detiene ahí y no llega a producción","Reintentar el despliegue diez veces","Ignorarlo si las pruebas unitarias pasaron"],
  ok:1, why:"Detectar en staging que la versión no arranca es justo el objetivo de esa etapa."},
 {t:"vf", p:"Entre staging y producción suele cambiar la configuración (variables, contraseñas), pero no el artefacto.",
  ok:true, why:"Misma imagen, distinta configuración: así lo que pruebas es lo que despliegas."}
]}

]});
