window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Qué es la observabilidad",
resumen: "Monitorizar frente a observar, métricas, logs y trazas, y los métodos de las señales doradas, RED y USE",
nivel: "Fundamentos",
color: "#e46a6a",
lecciones: [

{
id:"ob1l1",
titulo:"Monitorizar y observar",
claves:["Monitorizar: vigilar lo que ya sabes que puede fallar","Observar: poder responder preguntas nuevas sobre el sistema a partir de sus datos","Tres señales: métricas, logs y trazas (y cada vez más, perfiles)"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Por qué hace falta",
  c:`<p>Un usuario dice «la web va lenta». ¿Es la base de datos, la red, un servicio externo, un despliegue reciente, un solo cliente? Sin datos, se adivina. La <b>observabilidad</b> es la capacidad de entender qué pasa dentro de un sistema a partir de lo que emite.</p>
     <ul><li><b>Monitorizar</b>: paneles y alertas sobre lo conocido («CPU alta», «disco lleno»).</li>
     <li><b>Observar</b>: poder preguntar cosas que no habías previsto («¿qué tienen en común las peticiones lentas de hoy?»).</li></ul>`},
 {t:"par", p:"Empareja cada señal con lo que aporta",
  pares:[["Métricas","Números agregados en el tiempo: cuántas peticiones, cuánto tardan"],["Logs","Eventos detallados con contexto: qué ocurrió exactamente"],["Trazas","El recorrido de una petición a través de varios servicios"],["Perfiles","En qué funciones se gasta la CPU y la memoria"]],
  why:"Métricas para detectar, trazas para localizar, logs para entender el detalle."},
 {t:"opcion", p:"Detectas que la latencia subió. ¿Qué señal te dice en qué servicio de una cadena de cinco se pierde el tiempo?",
  ops:["Las métricas de CPU","Las trazas distribuidas","El log del balanceador","La factura"],
  ok:1, why:"Una traza muestra cada salto con su duración."},
 {t:"vf", p:"Con muchos paneles de CPU y memoria ya tienes un sistema observable.",
  ok:false, why:"Hay que poder relacionar señales y responder preguntas nuevas: métricas de aplicación, logs estructurados y trazas conectadas."}
]},

{
id:"ob1l2",
titulo:"Qué medir: señales doradas, RED y USE",
claves:["Señales doradas: latencia, tráfico, errores y saturación","RED para servicios: Rate, Errors, Duration","USE para recursos: Utilization, Saturation, Errors"],
pasos:[
 {t:"info", eti:"Método", h:"Tres listas que cubren casi todo",
  c:`<div class="diag">SENALES DORADAS (Google SRE)   latencia, trafico, errores, saturacion
RED (servicios)                peticiones/s, errores/s, duracion (percentiles)
USE (recursos)                 utilizacion, saturacion (colas), errores
                               de CPU, memoria, disco, red, pool de conexiones</div>
     <p>Para una API: RED por endpoint. Para una máquina, un disco o un pool de conexiones: USE.</p>`},
 {t:"par", p:"Empareja cada métrica con su categoría",
  pares:[["Peticiones por segundo","Tráfico (Rate)"],["Porcentaje de respuestas 5xx","Errores"],["p99 del tiempo de respuesta","Latencia (Duration)"],["Hilos esperando una conexión a la base de datos","Saturación"],["CPU al 70%","Utilización"]],
  why:"La saturación suele anunciar problemas antes que la utilización."},
 {t:"info", eti:"Ojo con las medias", h:"Percentiles",
  c:`<p>Una media de 100 ms puede esconder que el 1% de las peticiones tarda 5 segundos. Por eso la latencia se mide con <b>percentiles</b>: p50 (la mediana), p95, p99. El p99 es lo que sufren tus peores usuarios, que a menudo son los que más usan el sistema.</p>`},
 {t:"opcion", p:"¿Por qué la latencia media es una mala métrica?",
  ops:["Porque es difícil de calcular","Porque oculta las peticiones lentas: unos pocos valores extremos quedan diluidos","Porque siempre es cero","Porque no existe en Prometheus"],
  ok:1, why:"Mide percentiles con histogramas."}
]}

]});
