window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Agentes, paralelismo y velocidad",
resumen: "Elegir agente por etiqueta o por contenedor, ejecutar etapas en paralelo, pasar ficheros entre etapas y agentes efímeros en Kubernetes",
nivel: "Avanzado",
color: "#cf5a3e",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"jn8l1",
titulo:"Elegir agente con etiquetas",
claves:["Cada agente tiene etiquetas (labels) que describen lo que ofrece: linux, docker, windows…","agent { label 'docker' } pide un agente con esa etiqueta","agent none obliga a que cada etapa elija el suyo"],
pasos:[
 {t:"info", eti:"Recuerda", h:"Por qué hay varios agentes",
  c:`<p>En la unidad 2 viste que los builds se ejecutan en <b>agentes</b>. En una empresa hay varios y no todos sirven para lo mismo: unos tienen Java, otros Node.js, otros son Windows, otros tienen Docker instalado.</p>
     <p>Para distinguirlos se les ponen <b>etiquetas</b> (labels): <code>linux</code>, <code>docker</code>, <code>windows</code>, <code>gpu</code>… Y en el pipeline pides el que necesitas.</p>`},
 {t:"info", eti:"Sintaxis", h:"Formas de elegir agente",
  c:`<div class="termbox">agent any                                   // cualquiera libre
agent { label 'linux' }                     // uno con la etiqueta linux
agent { label 'linux && docker' }           // uno que tenga las DOS etiquetas
agent { docker { image 'maven:3.9-eclipse-temurin-21' } }   // dentro de ese contenedor
agent none                                  // ninguno: lo elige cada etapa</div>
     <p>Las expresiones admiten <code>&amp;&amp;</code> (y), <code>||</code> (o) y <code>!</code> (no).</p>`},
 {t:"par", p:"Empareja cada forma de elegir agente con su efecto",
  pares:[["agent any","Cualquier agente con un executor libre"],["agent { label 'windows' }","Un agente con esa etiqueta"],["agent { docker { image '…' } }","Dentro de un contenedor de esa imagen"],["agent none","Ninguno global: cada etapa elige el suyo"]],
  why:"Elegir bien el agente evita errores del tipo «comando no encontrado»."},
 {t:"info", eti:"Por etapa", h:"Un agente distinto en cada etapa",
  c:`<div class="termbox">pipeline {
    agent none
    stages {
        stage('Backend') {
            agent { docker { image 'maven:3.9-eclipse-temurin-21' } }
            steps { sh './mvnw -B verify' }
        }
        stage('Frontend') {
            agent { docker { image 'node:22-alpine' } }
            steps { sh 'npm ci' }
        }
    }
}</div>
     <p>Cada etapa usa exactamente las herramientas que necesita, sin instalar nada en los agentes.</p>`},
 {t:"opcion", p:"Con <code>agent none</code> a nivel de pipeline, una etapa sin su propio <code>agent</code> intenta ejecutar un <code>sh</code>. ¿Qué pasa?",
  ops:["Se ejecuta en el controlador","Falla: esa etapa no tiene dónde ejecutarse","Se ejecuta en cualquier agente","Se salta"],
  ok:1, why:"Con agent none, cada etapa debe declarar su agente."},
 {t:"vf", p:"Un paso <code>sh</code> no funciona en un agente Windows: allí se usa <code>bat</code> o <code>powershell</code>.",
  ok:true, why:"sh necesita una shell de Unix. Por eso importa elegir bien el agente."}
]},

/* =============== U8 L2 =============== */
{
id:"jn8l2",
titulo:"Etapas en paralelo",
claves:["parallel ejecuta varias etapas a la vez y acorta el tiempo total","El pipeline tarda lo que tarde la rama más lenta (si hay executors libres)","failFast true cancela el resto en cuanto una rama falla"],
pasos:[
 {t:"info", eti:"Ganar tiempo", h:"El bloque parallel",
  c:`<p>Si las pruebas unitarias, las de integración y el análisis de seguridad no dependen entre sí, no tiene sentido hacerlas una detrás de otra:</p>
     <div class="termbox">stage('Pruebas') {
    failFast true
    parallel {
        stage('Unitarias')   { steps { sh './mvnw -B test' } }
        stage('Integración') { steps { sh './mvnw -B verify -Pintegracion' } }
        stage('Seguridad')   { steps { sh 'trivy fs --exit-code 1 .' } }
    }
}</div>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom">EN SERIE</span><span class="coment">6 min ─▶ 8 min ─▶ 4 min   = 18 minutos</span></div><div class="rama" style="--n:0"><span class="nom">EN PARALELO</span><span class="coment">┌ 6 min ┐</span></div><div class="rama" style="--n:4"><span class="nom">8 min ┤</span><span class="coment">= 8 minutos (la más lenta)</span></div><div class="rama" style="--n:4"><span class="nom">4 min ┘</span></div></div>`},
 {t:"opcion", p:"Tres etapas de 6, 8 y 4 minutos se ejecutan en paralelo y hay executors libres. ¿Cuánto tarda la etapa?",
  ops:["18 minutos","Unos 8 minutos: lo que tarda la más lenta","4 minutos","6 minutos"],
  ok:1, why:"Por eso conviene mirar cuál es la rama más lenta si quieres acortar más."},
 {t:"opcion", p:"Las tres ramas paralelas necesitan un executor cada una, pero solo hay uno libre. ¿Qué pasa?",
  ops:["Fallan","Se ejecutan según haya executors libres: el paralelismo real depende de la capacidad de Jenkins","Se ejecutan igual de rápido","Jenkins crea executors solo"],
  ok:1, why:"Paralelizar sin capacidad no acelera nada: hacen falta agentes o executors suficientes."},
 {t:"info", eti:"Cortar pronto", h:"failFast",
  c:`<p>Con <code>failFast true</code>, en cuanto una rama falla se cancelan las demás. Ahorra tiempo y recursos: si las unitarias ya fallaron, no hace falta esperar a las de integración.</p>`},
 {t:"vf", p:"<code>failFast true</code> cancela el resto de ramas paralelas cuando una falla.",
  ok:true, why:"Útil cuando un fallo ya invalida el build entero."},
 {t:"par", p:"Empareja cada técnica con lo que consigue",
  pares:[["parallel","Ejecutar etapas a la vez"],["failFast true","Cancelar las demás ramas si una falla"],["Más agentes o executors","Que el paralelismo sea real"]],
  why:"Las tres cosas van juntas cuando quieres acortar un pipeline."}
]},

/* =============== U8 L3 =============== */
{
id:"jn8l3",
titulo:"Pasar ficheros entre etapas: stash",
claves:["Cada agente tiene su propio workspace: lo que compila uno no está en el otro","stash guarda ficheros y unstash los recupera en otra etapa o agente","stash dura solo lo que dura el build; para conservar algo, archiveArtifacts"],
pasos:[
 {t:"info", eti:"El problema", h:"Dos etapas, dos máquinas",
  c:`<p>Si la etapa «Compilar» corre en un agente y la etapa «Imagen» en otro, el <code>.jar</code> que generó la primera <b>no existe</b> en el workspace de la segunda: son máquinas distintas.</p>
     <div class="termbox">stage('Compilar') {
    agent { docker { image 'maven:3.9-eclipse-temurin-21' } }
    steps {
        sh './mvnw -B package'
        stash name: 'jar', includes: 'target/*.jar'
    }
}
stage('Imagen') {
    agent { label 'docker' }
    steps {
        unstash 'jar'
        sh 'docker build -t api-tareas .'
    }
}</div>
     <p><code>stash</code> guarda esos ficheros en el controlador con un nombre; <code>unstash</code> los deja en el workspace de la otra etapa.</p>`},
 {t:"opcion", p:"¿Por qué hace falta stash en ese ejemplo?",
  ops:["Para comprimir el .jar","Porque cada agente tiene su propio workspace y el .jar no está en el segundo","Para publicarlo en Jenkins","Para acelerar la compilación"],
  ok:1, why:"Sin stash, el docker build no encontraría el .jar."},
 {t:"par", p:"Empareja cada paso con su propósito",
  pares:[["stash","Guardar ficheros para otra etapa del mismo build"],["unstash","Recuperarlos en otra etapa o agente"],["archiveArtifacts","Conservarlos en Jenkins después del build"]],
  why:"stash es temporal; archiveArtifacts queda en el historial del build."},
 {t:"vf", p:"Lo guardado con stash sigue disponible en el siguiente build.",
  ok:false, why:"Solo vive durante ese build. Para conservar algo entre builds: archiveArtifacts o un registro."},
 {t:"opcion", p:"¿Qué conviene NO meter en un stash?",
  ops:["El .jar del proyecto","Carpetas enormes como todas las dependencias descargadas","Un informe pequeño","Un fichero de configuración"],
  ok:1, why:"El stash viaja por la red hasta el controlador: con carpetas grandes ralentiza el build."}
]},

/* =============== U8 L4 =============== */
{
id:"jn8l4",
titulo:"Agentes efímeros en Kubernetes",
claves:["Con el plugin de Kubernetes, cada build se ejecuta en un pod que se crea y se borra","Cada contenedor del pod aporta una herramienta; container('maven') elige dónde ejecutar","Ventajas: entorno limpio siempre, escalado automático y sin agentes encendidos sin usar"],
pasos:[
 {t:"info", eti:"A escala", h:"Un pod por build",
  c:`<p>Mantener agentes encendidos tiene dos problemas: cuestan dinero aunque no se usen, y van acumulando restos de builds anteriores. En Kubernetes se resuelve creando <b>un pod nuevo para cada build</b> y borrándolo al terminar. Son los <b>agentes efímeros</b>.</p>
     <div class="dg"><div class="dg-tit">agentes efímeros en kubernetes</div>
<div class="dg-flujo" style="row-gap:8px">
<div class="dg-caja acento">llega un build</div><div class="dg-caja">Kubernetes crea un pod</div><div class="dg-caja">se ejecuta el pipeline</div><div class="dg-caja base">el pod se borra</div>
</div></div>`},
 {t:"info", eti:"Sintaxis", h:"Declarar el pod",
  c:`<div class="termbox">agent {
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
        '''
    }
}
// y dentro de los pasos:
steps {
    container('maven') { sh './mvnw -B verify' }
}</div>
     <p>El pod puede tener varios contenedores (uno con Maven, otro para construir imágenes…) y con <code>container('nombre')</code> eliges en cuál se ejecuta cada paso.</p>`},
 {t:"par", p:"Empareja cada ventaja con su motivo",
  pares:[["Entorno limpio en cada build","El pod se crea desde cero y se borra al terminar"],["Escalado automático","Kubernetes crea tantos pods como builds haya"],["Sin coste en reposo","No hay agentes encendidos esperando"],["Herramientas por proyecto","Cada pipeline declara las imágenes que necesita"]],
  why:"Es la arquitectura habitual de Jenkins en empresas hoy."},
 {t:"opcion", p:"¿Por qué se evita montar el socket de Docker (<code>/var/run/docker.sock</code>) en los pods de build?",
  ops:["Porque va lento","Porque da control del Docker del nodo: un build podría afectar a todo el clúster","Porque no existe en Kubernetes","Porque Jenkins lo prohíbe"],
  ok:1, why:"Para construir imágenes sin ese riesgo se usan herramientas como Kaniko o Buildah."},
 {t:"vf", p:"Con agentes efímeros, un build no puede verse afectado por restos que dejó el build anterior.",
  ok:true, why:"Cada uno empieza en un pod limpio: desaparece toda una categoría de errores «raros»."}
]}

]});
