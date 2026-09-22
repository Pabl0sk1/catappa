window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Tu primer job",
resumen: "Jobs freestyle, builds y su consola, disparadores (webhooks, sondeo y cron), parámetros y variables de entorno",
nivel: "Fundamentos",
color: "#d9573f",
lecciones: [

{
id:"jk2l1",
titulo:"Jobs, builds y la consola",
claves:["Un job define qué hacer; cada ejecución es un build numerado (#1, #2…)","Estados: SUCCESS (verde), UNSTABLE (amarillo: pruebas fallidas), FAILURE (rojo), ABORTED","El workspace es la carpeta del agente donde se descarga el código y se ejecuta el build"],
pasos:[
 {t:"info", eti:"Lo básico", h:"Anatomía de un build",
  c:`<p>Un <b>job</b> (o proyecto) es la receta: de dónde sale el código, cuándo se ejecuta y qué pasos hace. Cada vez que se ejecuta nace un <b>build</b> con un número creciente. En un job <b>freestyle</b> los pasos se configuran con formularios; en un <b>pipeline</b> se escriben como código (lo verás en la siguiente unidad).</p>
     <div class="termbox">Started by user Pablo
Building in workspace /var/jenkins_home/workspace/api-tareas
 &gt; git fetch --tags --force https://github.com/pablo/api-tareas.git
+ ./mvnw -B package
[INFO] Tests run: 42, Failures: 0, Errors: 0
[INFO] BUILD SUCCESS
Finished: SUCCESS</div>
     <p>La <b>Console Output</b> es lo primero que se mira cuando algo falla: muestra cada comando y su salida.</p>`},
 {t:"par", p:"Empareja cada estado de un build con su significado",
  pares:[["SUCCESS","Todo terminó bien"],["UNSTABLE","El build terminó pero hay pruebas fallidas"],["FAILURE","Un paso falló y el build se detuvo"],["ABORTED","Alguien lo canceló o superó el tiempo máximo"],["NOT_BUILT","Una etapa se saltó y no llegó a ejecutarse"]],
  why:"UNSTABLE es típico de Jenkins: compila, pero los informes de pruebas tienen fallos."},
 {t:"opcion", p:"Un build falla y no sabes por qué. ¿Dónde miras primero?",
  ops:["En la configuración del sistema","En la Console Output de ese build, desde el final hacia arriba","En la lista de plugins","En el tablero de inicio"],
  ok:1, why:"El error suele estar en las últimas líneas; subiendo encuentras el comando que lo provocó."},
 {t:"vf", p:"Cada build de un job usa el mismo workspace del agente, así que los ficheros de un build anterior pueden seguir ahí si no se limpian.",
  ok:true, why:"Por eso se usa cleanWs() o checkouts limpios cuando un build depende de empezar de cero."}
]},

{
id:"jk2l2",
titulo:"Disparadores: webhooks, sondeo y cron",
claves:["Webhook: GitHub avisa a Jenkins en cuanto hay un push (lo recomendado)","Poll SCM: Jenkins pregunta al repositorio cada cierto tiempo (más lento y costoso)","Cron de Jenkins con H para repartir la carga: H/15 * * * *"],
pasos:[
 {t:"info", eti:"Cuándo se ejecuta", h:"Formas de lanzar un build",
  c:`<div class="diag">MANUAL        botón «Construir ahora»
WEBHOOK       GitHub ──push──▶ https://jenkins.empresa.com/github-webhook/   (inmediato)
POLL SCM      Jenkins ──¿hay cambios?──▶ Git   cada X minutos             (con retraso)
CRON          a una hora fija: builds nocturnos, informes
UPSTREAM      al terminar otro job</div>
     <div class="termbox">triggers {
  cron('H 2 * * 1-5')        // de lunes a viernes, hacia las 2:00
  pollSCM('H/15 * * * *')    // cada 15 minutos (si no hay webhook)
}</div>
     <p>La <b>H</b> (hash) reparte los jobs dentro del intervalo según su nombre, para que cien jobs con «cada 15 minutos» no arranquen todos a la vez.</p>`},
 {t:"par", p:"Empareja cada expresión cron de Jenkins con su significado",
  pares:[["H/15 * * * *","Cada 15 minutos, repartido entre jobs"],["H 2 * * *","Una vez al día, hacia las 2 de la madrugada"],["H 2 * * 1-5","De lunes a viernes, hacia las 2 de la madrugada"],["0 * * * *","Al minuto 0 de cada hora exacta"]],
  why:"Los cinco campos son: minuto, hora, día del mes, mes y día de la semana."},
 {t:"opcion", p:"¿Por qué es mejor un webhook que Poll SCM?",
  ops:["Porque el webhook es gratis y el sondeo es de pago","El build empieza en cuanto hay un push y Jenkins no tiene que preguntar al repositorio continuamente","Porque Poll SCM no funciona con Git","No hay diferencia"],
  ok:1, why:"El sondeo añade retraso y carga a Jenkins y al servidor Git; se usa solo si el repositorio no puede llegar a Jenkins."},
 {t:"escribe", p:"Escribe la expresión cron de Jenkins para ejecutar un job <b>cada 30 minutos</b>, repartido entre jobs",
  sol:["H/30 * * * *"], ph:"H/…", pista:"Como H/15 * * * *, pero cada 30.", why:"H/30 * * * * reparte los jobs dentro de cada media hora."}
]},

{
id:"jk2l3",
titulo:"Parámetros y variables de entorno",
claves:["Un job con parámetros pide valores al lanzarlo: texto, elección, booleano, contraseña","Variables que Jenkins pone siempre: BUILD_NUMBER, JOB_NAME, WORKSPACE, BUILD_URL, GIT_COMMIT","En la shell se leen como $BUILD_NUMBER; en Groovy como env.BUILD_NUMBER"],
pasos:[
 {t:"info", eti:"Datos del build", h:"Parámetros y variables",
  c:`<div class="termbox">parameters {
  choice(name: 'ENTORNO', choices: ['staging', 'produccion'], description: 'Dónde desplegar')
  booleanParam(name: 'SALTAR_TESTS', defaultValue: false)
  string(name: 'VERSION', defaultValue: '1.0.0')
}
...
sh 'echo "Build $BUILD_NUMBER del job $JOB_NAME en $WORKSPACE"'
sh "echo Desplegando la versión \${params.VERSION} en \${params.ENTORNO}"</div>
     <p>Con comillas simples, la variable la sustituye la <b>shell</b> (<code>$BUILD_NUMBER</code>). Con comillas dobles, la sustituye <b>Groovy</b> antes de ejecutar (<code>\${params.VERSION}</code>).</p>`},
 {t:"par", p:"Empareja cada variable con su contenido",
  pares:[["BUILD_NUMBER","El número del build actual"],["JOB_NAME","El nombre del job"],["WORKSPACE","La carpeta de trabajo en el agente"],["BUILD_URL","El enlace a la página de este build"],["GIT_COMMIT","El hash del commit que se está construyendo"],["BRANCH_NAME","La rama (en pipelines multibranch)"]],
  why:"BUILD_NUMBER y GIT_COMMIT se usan mucho para etiquetar imágenes y artefactos."},
 {t:"opcion", p:"Quieres etiquetar la imagen Docker con el número de build. ¿Cuál es correcto dentro de un <code>sh</code> con comillas simples?",
  ops:["docker build -t api:{BUILD_NUMBER} .","docker build -t api:$BUILD_NUMBER .","docker build -t api:BUILD_NUMBER .","docker build -t api:%BUILD_NUMBER% ."],
  ok:1, why:"Jenkins exporta sus variables al entorno de la shell; %VAR% es la sintaxis de cmd de Windows."},
 {t:"vf", p:"Un parámetro de tipo contraseña es la forma recomendada de pasar credenciales de producción a un pipeline.",
  ok:false, why:"Lo recomendado es guardarlas en el almacén de credenciales de Jenkins y usarlas con withCredentials (unidad 7)."}
]}

]});
