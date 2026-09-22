window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "Qué es DevOps de verdad",
resumen: "La cultura, el ciclo, las métricas DORA y los roles del sector",
color: "#7fd1b9",
lecciones: [

/* =============== O1 L1 =============== */
{
id:"o1l1",
titulo:"El muro entre desarrollo y operaciones",
claves:["DevOps nace para romper la separación entre quien desarrolla y quien opera","No es una herramienta ni un puesto: es una forma de trabajar","Objetivo: entregar cambios rápido y con fiabilidad"],
pasos:[
 {t:"info", eti:"La historia", h:"Cómo se trabajaba antes",
  c:`<p>Durante años, en casi todas las empresas había dos equipos separados por un muro:</p>
     <ul><li><b>Desarrollo (Dev)</b>: escribe código nuevo. Le miden por <b>entregar funcionalidades</b>, así que quiere cambiar cosas rápido.</li>
     <li><b>Operaciones (Ops)</b>: mantiene los servidores funcionando. Le miden por la <b>estabilidad</b>, así que quiere cambiar lo menos posible.</li></ul>
     <p>Desarrollo terminaba una versión y la «tiraba por encima del muro». Operaciones la instalaba a mano un sábado de madrugada. Si fallaba, cada equipo culpaba al otro: «en mi máquina funciona» contra «vuestro código es un desastre».</p>`},

 {t:"info", eti:"Las consecuencias", h:"Por qué eso no escala",
  c:`<ul><li>Despliegues <b>una vez al trimestre</b>, enormes y con miedo.</li>
     <li>Cuanto más grande el despliegue, <b>más cosas fallan</b> a la vez y más difícil es saber cuál.</li>
     <li>Tiempos de espera entre equipos: tickets, aprobaciones, esperas.</li>
     <li>Nadie se siente responsable del sistema completo.</li></ul>
     <p>Mientras tanto, empresas como Amazon o Netflix empezaron a desplegar <b>miles de veces al día</b>. Algo estaban haciendo distinto.</p>`},

 {t:"opcion", p:"¿Cuál era el conflicto de fondo entre Dev y Ops?",
  ops:["Que usaban lenguajes distintos",
       "Que Dev buscaba cambiar rápido y Ops buscaba estabilidad, con objetivos enfrentados y sin responsabilidad compartida",
       "Que Ops no sabía programar",
       "Que trabajaban en horarios distintos"],
  ok:1,
  why:"Incentivos opuestos. DevOps alinea a ambos alrededor de un objetivo común."},

 {t:"info", eti:"La definición", h:"Entonces, ¿qué es DevOps?",
  c:`<p><b>DevOps</b> es una <b>cultura y un conjunto de prácticas</b> que unen el desarrollo y la operación del software para <b>entregar cambios de forma rápida, frecuente y fiable</b>.</p>
     <p>Se apoya en tres ideas:</p>
     <ul><li><b>Responsabilidad compartida</b>: quien construye algo también se preocupa de cómo funciona en producción («you build it, you run it»).</li>
     <li><b>Automatización</b> de todo lo repetitivo: tests, construcción, despliegue, infraestructura.</li>
     <li><b>Cambios pequeños y frecuentes</b> en lugar de grandes y escasos, con medición constante.</li></ul>`},

 {t:"vf", p:"DevOps es, sobre todo, un conjunto de herramientas como Docker, Jenkins o Kubernetes.",
  ok:false,
  why:"Las herramientas ayudan, pero DevOps es primero una forma de trabajar. Puedes tener Kubernetes y seguir trabajando con un muro entre equipos."},

 {t:"opcion", p:"«Cambios pequeños y frecuentes» es mejor que «grandes y escasos» porque...",
  ops:["Así se trabaja menos",
       "Cada cambio tiene menos riesgo, se revisa mejor y, si falla, es fácil saber qué lo causó y deshacerlo",
       "Los servidores lo prefieren",
       "Es obligatorio por ley"],
  ok:1,
  why:"Menos cosas cambian a la vez, menos cosas pueden fallar a la vez. Es contraintuitivo pero demostrado."},

 {t:"opcion", p:"En una entrevista: «¿Qué es DevOps para ti?»",
  ops:["Un puesto que maneja servidores",
       "Una cultura y prácticas que unen desarrollo y operaciones para entregar software rápido y fiable, con responsabilidad compartida, automatización y mejora continua medida",
       "Usar Docker",
       "Hacer deploys los viernes"],
  ok:1,
  why:"Cultura + prácticas + objetivo. Y si añades un ejemplo tuyo (un pipeline que montaste), mejor."}
]},

/* =============== O1 L2 =============== */
{
id:"o1l2",
titulo:"CALMS: los pilares de la cultura DevOps",
claves:["Culture, Automation, Lean, Measurement, Sharing","Sin cultura, la automatización no basta","Medir para mejorar; compartir para no depender de héroes"],
pasos:[
 {t:"info", eti:"El marco", h:"CALMS en cinco letras",
  c:`<p>Un marco muy usado para explicar DevOps son las siglas <b>CALMS</b>:</p>
     <ul><li><b>C</b>ulture — cultura: colaboración, confianza y responsabilidad compartida.</li>
     <li><b>A</b>utomation — automatizar lo repetitivo.</li>
     <li><b>L</b>ean — eliminar desperdicio: esperas, trabajo a medias, pasos que no aportan.</li>
     <li><b>M</b>easurement — medir para decidir con datos.</li>
     <li><b>S</b>haring — compartir conocimiento, herramientas y aprendizajes.</li></ul>`},

 {t:"par", p:"Empareja cada letra de CALMS con un ejemplo real",
  pares:[["Culture","Postmortems sin buscar culpables"],
         ["Automation","Un pipeline que prueba y despliega en cada push"],
         ["Lean","Reducir el tiempo que un cambio espera aprobación"],
         ["Measurement","Medir cuánto tardamos en recuperarnos de una caída"],
         ["Sharing","Documentar el runbook para que cualquiera pueda operar el servicio"]],
  why:"Cada letra se traduce en prácticas concretas. Así se explica en una entrevista sin quedarse en la teoría."},

 {t:"info", eti:"La C es la primera", h:"Por qué la cultura va antes que las herramientas",
  c:`<p>Si en tu empresa cuando algo falla se busca a quién despedir, la gente <b>esconde los errores</b>, no experimenta y no despliega. Da igual que tengas el mejor pipeline del mundo.</p>
     <p>Por eso las organizaciones DevOps practican la <b>cultura sin culpa</b> (blameless): ante un incidente se pregunta «¿qué falló en el sistema para que esto fuera posible?», no «¿quién ha sido?».</p>`},

 {t:"vf", p:"Una empresa puede ser DevOps comprando herramientas de automatización aunque sus equipos no colaboren.",
  ok:false,
  why:"La automatización sin colaboración solo automatiza el muro. La cultura es la base."},

 {t:"info", eti:"Sharing", h:"Evitar al «héroe»",
  c:`<p>Un antipatrón muy común: una sola persona sabe cómo desplegar o cómo arreglar la base de datos. Cuando se va de vacaciones, el equipo se paraliza. Se llama <b>factor autobús</b> (¿cuántas personas tendrían que caer para que el proyecto se pare?).</p>
     <p>Se combate con documentación (runbooks), automatización (el despliegue es un botón, no un ritual) y rotación de responsabilidades.</p>`},

 {t:"opcion", p:"Solo Carlos sabe cómo desplegar a producción. ¿Qué pilar de CALMS falla, sobre todo?",
  ops:["Measurement","Sharing (y Automation)","Lean","Ninguno"],
  ok:1,
  why:"El conocimiento no está compartido, y además el despliegue no está automatizado: si fuera un pipeline, no dependería de Carlos."}
]},

/* =============== O1 L3 =============== */
{
id:"o1l3",
titulo:"El ciclo DevOps",
claves:["Plan, code, build, test, release, deploy, operate, monitor","Es un bucle infinito: lo que aprendes operando vuelve a la planificación","Cada fase se automatiza todo lo posible"],
pasos:[
 {t:"info", eti:"El dibujo famoso", h:"El símbolo de infinito",
  c:`<div class="diag">        DEV                              OPS
   plan -> code -> build -> test -> release -> deploy -> operate -> monitor
    ^                                                                  |
    +------------------------- feedback -------------------------------+</div>
     <p>Se dibuja como un <b>ocho tumbado (∞)</b> porque no termina nunca: lo que aprendes al operar y monitorizar vuelve a la planificación de lo siguiente.</p>`},

 {t:"orden", p:"Ordena las fases del ciclo DevOps",
  items:["Plan","Code","Build","Test","Release","Deploy","Operate","Monitor"],
  why:"Y vuelta a empezar. En una entrevista es muy útil situar cada herramienta en su fase."},

 {t:"par", p:"Empareja cada fase con una herramienta típica",
  pares:[["Code","Git y GitHub"],
         ["Build","Maven, Docker build"],
         ["Test / CI","GitHub Actions, Jenkins, GitLab CI"],
         ["Deploy","Kubernetes, Argo CD, Ansible"],
         ["Monitor","Prometheus, Grafana"]],
  why:"Situar herramientas en el ciclo demuestra que entiendes para qué sirve cada una, no solo sus nombres."},

 {t:"info", eti:"Continuous everything", h:"Los «continuos»",
  c:`<ul><li><b>Integración continua (CI)</b>: cada cambio se integra en la rama principal y se valida automáticamente (build + tests), varias veces al día.</li>
     <li><b>Entrega continua (Continuous Delivery)</b>: el código está <b>siempre listo</b> para desplegarse; el paso a producción es un botón.</li>
     <li><b>Despliegue continuo (Continuous Deployment)</b>: ni botón: todo lo que pasa los tests <b>llega solo</b> a producción.</li></ul>
     <p>Los verás a fondo en la unidad de CI/CD.</p>`},

 {t:"opcion", p:"¿Diferencia entre entrega continua y despliegue continuo?",
  ops:["Son lo mismo",
       "En entrega continua el código está siempre listo y el paso a producción es manual; en despliegue continuo llega solo si pasa los tests",
       "La entrega continua no tiene tests",
       "El despliegue continuo es solo para móviles"],
  ok:1,
  why:"La diferencia es ese último botón. Pregunta frecuente."},

 {t:"vf", p:"La fase de monitorización es la última y no afecta a las demás.",
  ok:false,
  why:"Es la que cierra el bucle: lo que ves en producción (errores, lentitud, uso) decide qué se planifica después."}
]},

/* =============== O1 L4 =============== */
{
id:"o1l4",
titulo:"Métricas DORA: medir si lo haces bien",
claves:["Frecuencia de despliegue y tiempo de entrega miden la velocidad","Tasa de fallos y tiempo de recuperación miden la estabilidad","Los mejores equipos son rápidos Y estables a la vez"],
pasos:[
 {t:"info", eti:"El estudio", h:"Cuatro números que explican a un equipo",
  c:`<p>El equipo de investigación <b>DORA</b> (DevOps Research and Assessment, hoy en Google) estudió miles de organizaciones durante años y encontró <b>cuatro métricas</b> que distinguen a los equipos de alto rendimiento:</p>
     <ul><li><b>Frecuencia de despliegue</b>: cada cuánto llega un cambio a producción.</li>
     <li><b>Tiempo de entrega de cambios</b> (lead time): desde el commit hasta que está en producción.</li>
     <li><b>Tasa de fallos en cambios</b> (change failure rate): qué porcentaje de despliegues causa un problema.</li>
     <li><b>Tiempo de recuperación</b> (MTTR, time to restore): cuánto tardas en arreglar una caída.</li></ul>`},

 {t:"par", p:"Empareja cada métrica DORA con lo que mide",
  pares:[["Frecuencia de despliegue","Cuántas veces llegamos a producción"],
         ["Lead time de cambios","Del commit a producción, cuánto tiempo"],
         ["Change failure rate","Porcentaje de despliegues que causan fallos"],
         ["Tiempo de recuperación","Cuánto tardamos en restaurar el servicio"]],
  why:"Nombrar las cuatro métricas DORA en una entrevista de DevOps es un punto seguro."},

 {t:"info", eti:"El hallazgo clave", h:"Velocidad y estabilidad no se oponen",
  c:`<p>La intuición dice: «si despliegas más a menudo, romperás más cosas». Los datos de DORA dicen lo contrario: <b>los equipos que despliegan más a menudo también fallan menos y se recuperan antes</b>.</p>
     <p>¿Por qué? Porque para desplegar a menudo necesitas automatización, tests y cambios pequeños, y eso mismo es lo que te da estabilidad.</p>
     <div class="diag">               bajo rendimiento     alto rendimiento
frecuencia     mensual              varias veces al dia
lead time      semanas o meses      menos de un dia
fallos         ~40%                 ~5%
recuperacion   dias                 menos de una hora</div>`},

 {t:"vf", p:"Según DORA, los equipos que despliegan con más frecuencia tienden a tener más fallos.",
  ok:false,
  why:"Al contrario: los de alto rendimiento son a la vez más rápidos y más estables."},

 {t:"opcion", p:"Tu equipo despliega una vez al mes y cada despliegue rompe algo. ¿Qué recomendarías primero?",
  ops:["Desplegar todavía menos para romper menos",
       "Automatizar el pipeline y desplegar cambios más pequeños y frecuentes",
       "Añadir más aprobaciones manuales",
       "Contratar más testers manuales"],
  ok:1,
  why:"Lotes pequeños y automatización. Más aprobaciones solo alargan el lead time sin mejorar la estabilidad."},

 {t:"info", eti:"MTTR", h:"Recuperarse rápido importa más que no fallar nunca",
  c:`<p>Todo sistema falla alguna vez. Un equipo maduro no presume de «nunca caemos»; presume de <b>detectar y recuperar en minutos</b>. Eso se consigue con buena monitorización, alertas, rollback de un clic y runbooks. Lo trabajarás en la unidad de observabilidad.</p>`}
]},

/* =============== O1 L5 =============== */
{
id:"o1l5",
titulo:"Los roles: DevOps, SRE y Platform",
claves:["DevOps Engineer: automatiza entrega e infraestructura","SRE: aplica ingeniería a la fiabilidad, con SLOs y error budgets","Platform Engineering: construye una plataforma interna para los equipos"],
pasos:[
 {t:"info", eti:"El mercado", h:"Tres nombres que verás en las ofertas",
  c:`<p>Aunque DevOps es una cultura, en las ofertas de trabajo aparecen puestos concretos:</p>
     <ul><li><b>DevOps Engineer</b>: construye y mantiene pipelines de CI/CD, infraestructura como código, contenedores y el despliegue. Es el puente entre desarrollo y la infraestructura.</li>
     <li><b>SRE (Site Reliability Engineer)</b>: nació en Google. Trata la operación como un problema de ingeniería: mide la fiabilidad con <b>SLOs</b>, automatiza el trabajo manual repetitivo (<i>toil</i>) y lleva las guardias.</li>
     <li><b>Platform Engineer</b>: construye una <b>plataforma interna</b> (plantillas, pipelines estándar, un portal) para que los equipos de desarrollo desplieguen solos sin pelearse con la infraestructura.</li></ul>`},

 {t:"par", p:"Empareja cada rol con su foco principal",
  pares:[["DevOps Engineer","Pipelines, infraestructura como código y despliegues"],
         ["SRE","Fiabilidad medida con SLOs y reducción del trabajo manual"],
         ["Platform Engineer","Una plataforma interna de autoservicio para los equipos"]],
  why:"En la práctica se solapan mucho. Lo importante es entender el énfasis de cada uno."},

 {t:"info", eti:"Toil", h:"El enemigo del SRE",
  c:`<p>Google define el <b>toil</b> como el trabajo operativo que es <b>manual, repetitivo, automatizable</b> y que crece con el tamaño del servicio: reiniciar un servicio a mano cada semana, crear usuarios uno a uno, copiar ficheros de configuración...</p>
     <p>La regla de los SRE: como máximo el <b>50%</b> del tiempo en toil; el resto, en ingeniería que elimine ese toil.</p>`},

 {t:"opcion", p:"Cada lunes alguien reinicia a mano un servicio que se queda sin memoria. En términos SRE, eso es...",
  ops:["Un SLO","Toil: trabajo manual y repetitivo que habría que automatizar o, mejor, arreglar de raíz","Un runbook","Un error budget"],
  ok:1,
  why:"Toil. La solución no es un script que reinicie cada lunes: es encontrar la fuga de memoria."},

 {t:"info", eti:"Tu camino", h:"Dónde encajas tú",
  c:`<p>Con este curso más los de Docker y Git tienes la base de un perfil <b>DevOps junior</b>: sabes contenedores, control de versiones, pipelines, algo de infraestructura como código y Kubernetes, y los conceptos de fiabilidad.</p>
     <p>Viniendo de desarrollo (Java), tu gran ventaja es que <b>entiendes el código</b> que despliegas. Es exactamente el puente que DevOps quiere construir.</p>`},

 {t:"vf", p:"Un SRE mide la fiabilidad del servicio con objetivos concretos (SLOs) en lugar de intentar el 100% de disponibilidad.",
  ok:true,
  why:"Correcto. El 100% no existe y perseguirlo impide cambiar nada. Lo verás en la unidad de observabilidad."}
]}

]});
