window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "Observabilidad y fiabilidad",
resumen: "Logs, métricas y trazas, Prometheus y Grafana, alertas, SLOs e incidentes",
color: "#f26d6d",
lecciones: [

/* =============== O6 L1 =============== */
{
id:"o6l1",
titulo:"Los tres pilares: logs, métricas y trazas",
claves:["Logs: qué pasó exactamente, evento a evento","Métricas: números agregados en el tiempo para ver tendencias y alertar","Trazas: el recorrido de una petición por varios servicios"],
pasos:[
 {t:"info", eti:"El concepto", h:"Saber qué pasa dentro sin entrar",
  c:`<p><b>Observabilidad</b> es la capacidad de entender qué está pasando dentro de un sistema a partir de lo que emite hacia fuera. Cuando algo va mal a las tres de la mañana, es lo que te permite responder «¿qué está fallando, dónde y desde cuándo?».</p>
     <p>Se apoya en tres tipos de datos, los <b>tres pilares</b>.</p>`},

 {t:"info", eti:"Los tres", h:"Logs, métricas y trazas",
  c:`<ul><li><b>Logs</b>: registros de eventos concretos. «10:14:02 ERROR no se pudo conectar a la base de datos». Detalle máximo, pero mucho volumen.</li>
     <li><b>Métricas</b>: números medidos a lo largo del tiempo. Peticiones por segundo, latencia, % de CPU, errores por minuto. Poco volumen, perfectas para <b>gráficas y alertas</b>.</li>
     <li><b>Trazas</b>: el recorrido de <b>una petición</b> a través de varios servicios, con el tiempo que pasa en cada uno. Imprescindibles con microservicios.</li></ul>
     <div class="diag">traza de GET /pedidos/42   (total 840 ms)
|-- api-gateway          12 ms
|-- servicio-pedidos     60 ms
|   |-- postgres        710 ms   <- aqui esta el problema
|-- servicio-usuarios    58 ms</div>`},

 {t:"par", p:"Empareja cada pilar con la pregunta que responde",
  pares:[["Métricas","¿Cuántos errores por minuto hay y desde cuándo subieron?"],
         ["Logs","¿Qué error concreto dio esta petición y con qué datos?"],
         ["Trazas","¿En qué servicio se pierde el tiempo de esta petición lenta?"]],
  why:"Se usan juntos: la métrica te avisa, la traza te dice dónde y el log te dice qué."},

 {t:"opcion", p:"Quieres una alerta cuando los errores superen el 1%. ¿Qué pilar es el adecuado?",
  ops:["Logs","Métricas","Trazas","Ninguno"],
  ok:1,
  why:"Las métricas son baratas de consultar continuamente y se prestan a umbrales. Alertar sobre logs es más caro y frágil."},

 {t:"info", eti:"Logs bien hechos", h:"Estructurados y centralizados",
  c:`<p>Dos reglas que ya conoces del curso de Docker, llevadas más lejos:</p>
     <ul><li><b>A la salida estándar</b>, no a ficheros dentro del contenedor.</li>
     <li><b>Estructurados</b> (JSON), para poder filtrar por campos:</li></ul>
     <div class="termbox">{"ts":"2026-09-21T10:14:02Z","nivel":"ERROR","servicio":"api-tareas",
 "traceId":"4bf92f35","usuario":"pablo","msg":"Timeout con la base de datos"}</div>
     <p>Y <b>centralizados</b>: un sistema que recoge los de todos los contenedores (<b>Loki</b>, <b>ELK/OpenSearch</b>, Datadog). El <code>traceId</code> en cada log permite saltar del log a la traza completa.</p>`},

 {t:"vf", p:"Con microservicios, sin trazas distribuidas es muy difícil saber qué servicio hace lenta una petición.",
  ok:true,
  why:"Cada servicio ve solo su parte. La traza une todo el recorrido. El estándar hoy es OpenTelemetry."},

 {t:"info", eti:"El estándar", h:"OpenTelemetry",
  c:`<p><b>OpenTelemetry</b> (OTel) es el estándar abierto para instrumentar aplicaciones y emitir trazas, métricas y logs de forma uniforme, y enviarlos a cualquier herramienta. Para Java hay un agente que se añade al arrancar (<code>-javaagent</code>) y que instrumenta Spring, JDBC y HTTP sin tocar el código.</p>`}
]},

/* =============== O6 L2 =============== */
{
id:"o6l2",
titulo:"Prometheus y Grafana",
claves:["Prometheus recoge métricas haciendo scraping de un endpoint /metrics","Guarda series temporales y se consultan con PromQL","Grafana dibuja paneles sobre esos datos"],
pasos:[
 {t:"info", eti:"Prometheus", h:"El estándar de métricas",
  c:`<p><b>Prometheus</b> es la herramienta de métricas más usada en el mundo de los contenedores. Funciona con un modelo <b>pull</b>: cada X segundos, <b>va a pedir</b> las métricas a cada aplicación a un endpoint HTTP (normalmente <code>/metrics</code>).</p>
     <div class="diag">[ Prometheus ] --cada 15s GET /metrics--> [ api-tareas ]
      |                                  --> [ node-exporter ] (CPU, disco del servidor)
      |                                  --> [ postgres-exporter ]
      v
[ Grafana ]  paneles     [ Alertmanager ]  avisos</div>
     <p>Spring Boot lo trae casi hecho: con Actuator y Micrometer, expone <code>/actuator/prometheus</code>.</p>`},

 {t:"opcion", p:"¿Cómo obtiene Prometheus las métricas de tu aplicación?",
  ops:["La aplicación se las envía por correo",
       "Prometheus consulta periódicamente un endpoint HTTP de la aplicación (modelo pull / scraping)",
       "Lee la base de datos de la aplicación",
       "Las copia del log"],
  ok:1,
  why:"Modelo pull. Si un objetivo no responde al scraping, Prometheus lo marca como caído: eso también es información."},

 {t:"info", eti:"Qué medir", h:"Los métodos RED y USE",
  c:`<p>Para no ahogarte en métricas, dos recetas:</p>
     <ul><li><b>RED</b> para servicios (tu API): <b>R</b>ate (peticiones por segundo), <b>E</b>rrors (cuántas fallan), <b>D</b>uration (cuánto tardan).</li>
     <li><b>USE</b> para recursos (CPU, disco, memoria): <b>U</b>tilization, <b>S</b>aturation, <b>E</b>rrors.</li></ul>
     <p>Google las resume en sus <b>cuatro señales doradas</b>: latencia, tráfico, errores y saturación.</p>`},

 {t:"par", p:"Empareja cada letra del método RED con lo que mide",
  pares:[["Rate","Peticiones por segundo"],
         ["Errors","Peticiones que fallan"],
         ["Duration","Cuánto tardan las peticiones"]],
  why:"Si te preguntan «¿qué métricas pondrías en una API?», RED es la respuesta."},

 {t:"info", eti:"PromQL", h:"Consultar métricas",
  c:`<p>Prometheus se consulta con <b>PromQL</b>. No hace falta dominarlo, pero sí reconocerlo:</p>
     <div class="termbox"><span class="cm"># peticiones por segundo en los ultimos 5 minutos</span>
rate(http_server_requests_seconds_count[5m])

<span class="cm"># porcentaje de errores 5xx</span>
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
  / sum(rate(http_server_requests_seconds_count[5m]))

<span class="cm"># latencia p95</span>
histogram_quantile(0.95, sum by (le) (rate(http_server_requests_seconds_bucket[5m])))</div>`},

 {t:"info", eti:"Percentiles", h:"Por qué la media miente",
  c:`<p>Si 99 peticiones tardan 50 ms y una tarda 10 segundos, la <b>media</b> es 150 ms: parece que todo va bien, pero un usuario de cada cien espera 10 segundos.</p>
     <p>Por eso la latencia se mide en <b>percentiles</b>: <b>p95</b> es el tiempo por debajo del cual está el 95% de las peticiones; <b>p99</b>, el 99%. Te enseñan la experiencia de los usuarios que peor lo pasan.</p>`},

 {t:"opcion", p:"¿Por qué se usa el p95 o p99 de la latencia en lugar de la media?",
  ops:["Porque es más fácil de calcular",
       "Porque la media oculta a los usuarios con peor experiencia; los percentiles altos los muestran",
       "Porque Prometheus no calcula medias",
       "Por costumbre"],
  ok:1,
  why:"Detalle que distingue a quien ha operado sistemas reales."},

 {t:"vf", p:"Grafana es la base de datos donde se guardan las métricas.",
  ok:false,
  why:"Grafana visualiza. Los datos están en Prometheus (u otras fuentes: Loki, bases de datos...)."}
]},

/* =============== O6 L3 =============== */
{
id:"o6l3",
titulo:"Alertas que sirven",
claves:["Alerta sobre síntomas que sufre el usuario, no sobre cada causa","Cada alerta debe ser accionable y tener un runbook","Demasiadas alertas = fatiga = se ignoran todas"],
pasos:[
 {t:"info", eti:"El problema", h:"La fatiga de alertas",
  c:`<p>Un equipo nuevo suele empezar alertando de todo: CPU al 80%, disco al 70%, un reinicio de un pod... Resultado: <b>cientos de avisos a la semana</b>, la mayoría sin importancia. La gente se acostumbra a ignorarlos, y el día que llega uno importante, también lo ignora.</p>
     <p>Se llama <b>fatiga de alertas</b>, y es peligrosa.</p>`},

 {t:"info", eti:"La regla", h:"Síntomas, no causas",
  c:`<p>Alerta de lo que <b>siente el usuario</b>:</p>
     <ul><li>✔ «El 3% de las peticiones están fallando desde hace 5 minutos».</li>
     <li>✔ «La latencia p99 del checkout supera los 2 segundos».</li>
     <li>✘ «La CPU del nodo 3 está al 85%» — si los usuarios no lo notan, no hace falta despertar a nadie. Va a un panel, no al móvil.</li></ul>
     <p>Y cada alerta tiene que ser <b>accionable</b>: si al recibirla no hay nada que hacer, no debería existir.</p>`},

 {t:"opcion", p:"¿Cuál de estas alertas debería despertar a alguien de madrugada?",
  ops:["La CPU de un nodo ha llegado al 80%",
       "El 5% de las peticiones de pago está fallando desde hace 10 minutos",
       "Un pod se ha reiniciado una vez",
       "El disco está al 60%"],
  ok:1,
  why:"Síntoma real que afecta a usuarios y dinero. Lo demás, como mucho, un aviso en horario laboral."},

 {t:"info", eti:"Niveles", h:"No todo es urgente",
  c:`<ul><li><b>Página</b> (despierta a alguien): impacto real en usuarios, ahora.</li>
     <li><b>Ticket</b> (se mira en horario laboral): algo que empeorará si no se atiende. «El disco se llenará en 4 días».</li>
     <li><b>Solo panel</b>: información útil para investigar, sin aviso.</li></ul>
     <p>Y cada alerta de tipo página lleva enlazado su <b>runbook</b>: un documento con qué significa, cómo investigarla y cómo mitigarla.</p>`},

 {t:"par", p:"Empareja cada situación con su nivel de alerta",
  pares:[["La API devuelve errores al 10% de usuarios","Página: despertar a la guardia"],
         ["El disco se llenará en 5 días al ritmo actual","Ticket en horario laboral"],
         ["La CPU tuvo un pico de 2 minutos sin efectos","Solo panel, sin aviso"]],
  why:"Clasificar bien las alertas protege al equipo y protege a los usuarios."},

 {t:"vf", p:"Cuantas más alertas tenga un sistema, mejor vigilado está.",
  ok:false,
  why:"Más alertas suele significar más ruido y más fatiga. Pocas, sobre síntomas, y todas accionables."}
]},

/* =============== O6 L4 =============== */
{
id:"o6l4",
titulo:"SLI, SLO, SLA y error budget",
claves:["SLI: lo que mides (por ejemplo, % de peticiones correctas)","SLO: tu objetivo interno para ese SLI (99,9%)","Error budget: lo que te permites fallar; si se agota, se prioriza fiabilidad"],
pasos:[
 {t:"info", eti:"El punto de partida", h:"El 100% no existe",
  c:`<p>Ningún sistema está disponible el 100% del tiempo. Y perseguirlo es contraproducente: para no romper nunca nada, tendrías que no cambiar nunca nada.</p>
     <p>La idea de SRE es <b>decidir cuánta fiabilidad es suficiente</b>, medirla y usarla para tomar decisiones. Para eso hay tres siglas que se confunden mucho.</p>`},

 {t:"info", eti:"Las tres siglas", h:"SLI, SLO y SLA",
  c:`<ul><li><b>SLI</b> (Service Level <b>Indicator</b>): la <b>medida</b>. «Porcentaje de peticiones que responden bien en menos de 300 ms».</li>
     <li><b>SLO</b> (Service Level <b>Objective</b>): el <b>objetivo interno</b> para ese indicador. «El 99,9% en una ventana de 30 días».</li>
     <li><b>SLA</b> (Service Level <b>Agreement</b>): un <b>contrato</b> con clientes, con consecuencias (reembolsos) si no se cumple. Siempre más laxo que el SLO: «99,5%».</li></ul>
     <div class="diag">SLI  -> lo que mides           99,93% este mes
SLO  -> lo que te propones       99,9%
SLA  -> lo que prometes (contrato) 99,5%</div>`},

 {t:"par", p:"Empareja cada sigla con su definición",
  pares:[["SLI","La métrica que mide la calidad del servicio"],
         ["SLO","El objetivo interno para esa métrica"],
         ["SLA","El compromiso contractual con el cliente"]],
  why:"Confundirlas es muy común. Tenerlas claras en una entrevista de SRE/DevOps es obligatorio."},

 {t:"info", eti:"Hazlo tangible", h:"Cuánto es un 99,9%",
  c:`<div class="dg dg-tabla-caja"><table class="dg-tabla"><tbody><tr><td>SLO</td><td>caida permitida al mes (30 dias)</td></tr><tr><td>99%</td><td>7 h 12 min</td></tr><tr><td>99,9%</td><td>43 min</td></tr><tr><td>99,99%</td><td>4 min 19 s</td></tr><tr><td>99,999%</td><td>26 s</td></tr></tbody></table></div>
     <p>Cada «nueve» extra cuesta mucho más en ingeniería. Por eso el SLO se elige según lo que <b>de verdad necesita el negocio</b>, no el más alto posible.</p>`},

 {t:"opcion", p:"Con un SLO del 99,9% mensual, ¿cuánto tiempo de caída te puedes permitir aproximadamente al mes?",
  ops:["7 horas","43 minutos","4 minutos","Ninguno"],
  ok:1,
  why:"El 0,1% de 30 días son unos 43 minutos."},

 {t:"info", eti:"La idea brillante", h:"El error budget",
  c:`<p>Si tu SLO es 99,9%, tienes un <b>presupuesto de error</b> del 0,1%: unos 43 minutos al mes que puedes «gastar» en fallos.</p>
     <ul><li><b>Si te sobra presupuesto</b>: puedes arriesgar más. Desplegar más a menudo, probar cosas.</li>
     <li><b>Si se agota</b>: se congelan las funcionalidades nuevas y el equipo se dedica a la fiabilidad hasta recuperarlo.</li></ul>
     <p>Resuelve el viejo conflicto Dev contra Ops con un número que ambos aceptan: ya no es una discusión de opiniones.</p>`},

 {t:"opcion", p:"El equipo ha agotado el error budget del mes a mitad de mes. Según la práctica SRE, ¿qué se hace?",
  ops:["Nada, el mes que viene se repone",
       "Priorizar el trabajo de fiabilidad y frenar las funcionalidades nuevas hasta recuperar margen",
       "Subir el SLO",
       "Despedir a alguien"],
  ok:1,
  why:"El presupuesto convierte la fiabilidad en una decisión de prioridades basada en datos."},

 {t:"vf", p:"El SLA suele ser más exigente que el SLO interno.",
  ok:false,
  why:"Al revés: el SLO es más exigente para tener margen antes de incumplir el contrato."}
]},

/* =============== O6 L5 =============== */
{
id:"o6l5",
titulo:"Incidentes, guardias y postmortems",
claves:["Primero mitigar (restaurar el servicio), luego investigar la causa","Roles claros: quien coordina, quien investiga, quien comunica","Postmortem sin culpables: qué falló en el sistema y qué acciones evitan que se repita"],
pasos:[
 {t:"info", eti:"En caliente", h:"Durante un incidente, lo primero es mitigar",
  c:`<p>Cuando producción falla, el objetivo número uno es <b>restaurar el servicio</b>, no entender la causa. Si el despliegue de hace 20 minutos coincide con los errores, <b>haces rollback</b> y después investigas con calma.</p>
     <p>Mitigaciones típicas: rollback, apagar una feature flag, escalar réplicas, desviar tráfico, reiniciar el componente atascado.</p>
     <div class="nota dato"><b class="tit">Frase clave</b>«Primero mitigar, luego investigar». Es lo que un entrevistador quiere oír cuando pregunta qué harías si producción cae.</div>`},

 {t:"opcion", p:"Producción da errores desde justo después del despliegue de las 17:00. ¿Qué haces primero?",
  ops:["Leer todo el código del despliegue hasta encontrar el fallo",
       "Rollback a la versión anterior para restaurar el servicio, y luego investigar",
       "Esperar a ver si se arregla solo",
       "Escribir el postmortem"],
  ok:1,
  why:"Cada minuto de investigación en caliente es un minuto de usuarios afectados. Restaurar primero."},

 {t:"info", eti:"Organización", h:"Roles en un incidente",
  c:`<ul><li><b>Coordinador del incidente</b> (incident commander): no toca teclado. Coordina, decide y mantiene el foco.</li>
     <li><b>Operaciones / investigación</b>: las personas que diagnostican y aplican cambios.</li>
     <li><b>Comunicación</b>: informa a clientes, soporte y dirección, con actualizaciones periódicas en una página de estado.</li></ul>
     <p>Con incidentes pequeños, una persona hace varios roles. Lo importante es que <b>alguien coordine</b> y que no haya diez personas cambiando cosas a la vez sin avisar.</p>`},

 {t:"info", eti:"Después", h:"El postmortem sin culpables",
  c:`<p>Tras el incidente se escribe un <b>postmortem</b>: un documento que cuenta qué pasó, con una cronología, el impacto, la causa raíz y, sobre todo, <b>acciones</b> para que no se repita.</p>
     <p>Es <b>blameless</b> (sin culpables): la pregunta no es «¿quién ejecutó el comando?», sino «¿por qué el sistema permitió que un comando así borrara producción, y qué cambiamos para que no pueda volver a pasar?». Si se castiga a las personas, la próxima vez esconderán los errores.</p>`},

 {t:"orden", p:"Ordena la respuesta a un incidente",
  items:["La alerta detecta el problema","Se declara el incidente y se asigna quien coordina","Se mitiga: rollback, flag, escalar...","Se confirma que el servicio se ha restaurado","Se investiga la causa raíz con calma","Postmortem sin culpables con acciones concretas"],
  why:"Detectar, coordinar, mitigar, verificar, investigar y aprender."},

 {t:"par", p:"Empareja cada práctica con su propósito",
  pares:[["Runbook","Pasos documentados para diagnosticar y mitigar una alerta"],
         ["Guardia (on-call)","Alguien disponible por turnos para responder a incidentes"],
         ["Postmortem","Aprender del incidente y evitar que se repita"],
         ["Página de estado","Informar a los usuarios durante el incidente"]],
  why:"El vocabulario de operaciones que te encontrarás en cualquier empresa con producción real."},

 {t:"vf", p:"El objetivo de un postmortem es identificar a la persona responsable del error.",
  ok:false,
  why:"Es blameless: se buscan fallos del sistema y del proceso. Los errores humanos son inevitables; el sistema debe hacerlos inofensivos."}
]}

]});
