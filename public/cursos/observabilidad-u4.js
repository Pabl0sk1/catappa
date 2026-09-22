window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Logs y trazas",
resumen: "Logs estructurados, Loki y LogQL, trazas distribuidas, OpenTelemetry, el Collector y el muestreo",
nivel: "Avanzado",
color: "#da5f5f",
lecciones: [

{
id:"ob4l1",
titulo:"Logs estructurados y Loki",
claves:["Logs en JSON con campos: nivel, mensaje, servicio, traceId, usuario","Recoger de stdout con un agente (Alloy, Fluent Bit, Promtail) y enviar a Loki o Elasticsearch","LogQL filtra por etiquetas y contenido, y puede calcular métricas"],
pasos:[
 {t:"info", eti:"Logs que se pueden consultar", h:"Estructura y recogida",
  c:`<div class="termbox">{"ts":"2026-09-22T10:02:11Z","nivel":"ERROR","servicio":"pagos","traceId":"4bf92f35...","pedido":1042,"msg":"Pago rechazado","motivo":"fondos"}</div>
     <div class="termbox"># LogQL (Loki)
{servicio="pagos"} |= "rechazado"                         # lineas que contienen el texto
{servicio="pagos"} | json | nivel="ERROR" | motivo="fondos"
sum by (motivo) (count_over_time({servicio="pagos"} | json | nivel="ERROR" [5m]))</div>
     <p>Loki indexa solo las <b>etiquetas</b> (servicio, entorno), no el contenido: es barato de operar. Por eso las etiquetas deben tener poca cardinalidad, igual que en Prometheus.</p>`},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["Logs en JSON","Filtrar y agregar por campos"],["traceId en cada línea","Saltar de un log a la traza completa"],["Escribir a stdout","La plataforma recoge los logs sin configurar ficheros"],["Etiquetas de baja cardinalidad en Loki","Índices pequeños y consultas rápidas"],["No registrar datos sensibles","Cumplir privacidad y seguridad"]],
  why:"Un log sin contexto (qué pedido, qué usuario, qué traza) sirve de poco."},
 {t:"vf", p:"En Loki conviene poner el id del pedido como etiqueta para buscar rápido.",
  ok:false, why:"Sería cardinalidad enorme. Va como campo del JSON y se filtra con | json."}
]},

{
id:"ob4l2",
titulo:"Trazas distribuidas y OpenTelemetry",
claves:["Una traza está formada por spans: cada operación con su inicio, duración y atributos","El contexto (traceparent) viaja en las cabeceras entre servicios","OpenTelemetry es el estándar abierto para instrumentar y exportar señales"],
pasos:[
 {t:"info", eti:"Seguir una petición", h:"Spans y contexto",
  c:`<div class="diag">traceId 4bf92f35...
|-- GET /api/pedidos/1042          (api-gateway)      320 ms
|   |-- GET /pedidos/1042          (pedidos)          290 ms
|   |   |-- SELECT pedidos         (postgres)          12 ms
|   |   '-- GET /clientes/42       (clientes)         260 ms   &lt;- aqui esta el tiempo
|   |       '-- SELECT clientes    (postgres)         240 ms   &lt;- consulta sin indice</div>
     <p>Cada servicio añade sus <b>spans</b> y pasa el contexto en la cabecera <code>traceparent</code> (W3C Trace Context). Con Spring Boot y Micrometer Tracing, o con el agente Java de OpenTelemetry, se instrumenta casi todo sin tocar código.</p>`},
 {t:"info", eti:"El estándar", h:"OpenTelemetry y el Collector",
  c:`<div class="diag">apps (SDK o agente OTel) --OTLP--&gt; OpenTelemetry Collector
                                      |-- procesa: filtra, anade atributos, muestrea
                                      |-- trazas  --&gt; Tempo / Jaeger
                                      |-- metricas --&gt; Prometheus
                                      '-- logs    --&gt; Loki</div>
     <p>El <b>muestreo</b> evita guardar todas las trazas: por ejemplo el 10%, pero el 100% de las que tienen errores o son lentas (<i>tail sampling</i> en el Collector).</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Span","Una operación con inicio, duración y atributos"],["Trace","El conjunto de spans de una petición"],["traceparent","Cabecera que propaga el contexto entre servicios"],["OTLP","Protocolo de OpenTelemetry para enviar señales"],["Tail sampling","Decidir qué trazas guardar después de verlas completas"]],
  why:"OpenTelemetry evita atarte a un proveedor: cambias el destino en el Collector."},
 {t:"opcion", p:"Las trazas de tu sistema aparecen «cortadas»: el servicio de pagos inicia trazas nuevas en vez de continuar la del pedido. ¿Qué falla?",
  ops:["La base de datos","La propagación del contexto: la cabecera traceparent no se envía o no se lee en esa llamada","El muestreo","Grafana"],
  ok:1, why:"Pasa con clientes HTTP o colas no instrumentados."}
]},

{
id:"ob4l3",
titulo:"Correlacionar métricas, logs y trazas",
claves:["El trace_id en cada línea de log enlaza el log con su traza","Exemplars: un punto de una métrica apunta a una traza concreta","Muestreo: por cabecera (head) o por cola (tail) para quedarse con las trazas interesantes"],
pasos:[
 {t:"info", eti:"Los tres pilares juntos", h:"Del panel al problema",
  c:`<div class="diag">panel: p99 se dispara a las 10:02
   -> exemplar del punto -> traza 4bf92f35...
   -> la traza muestra 1,8 s en "SELECT pedidos" en servicio-pedidos
   -> logs filtrados por trace_id=4bf92f35... -> "pool agotado, esperando conexion"</div>
     <p>Con OpenTelemetry, el <b>trace_id</b> viaja en la cabecera <code>traceparent</code> entre servicios y la librería de logs lo añade a cada línea (MDC en Java).</p>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["trace_id en los logs","Encontrar todos los logs de una petición"],["Exemplars","Saltar de una métrica a una traza de ejemplo"],["Muestreo por cabecera","Decidir al inicio si se guarda la traza (barato)"],["Muestreo por cola","Guardar las trazas lentas o con error al terminar"],["Cabecera traceparent","Propagar el contexto entre servicios"]],
  why:"El muestreo por cola necesita un collector que retenga las trazas completas antes de decidir."},
 {t:"opcion", p:"Guardas el 1 % de las trazas al azar y nunca encuentras las de las peticiones con error. ¿Qué cambias?",
  ops:["Guardar el 0,1 %","Muestreo por cola: conservar siempre las que tienen error o son lentas, y un porcentaje del resto","Quitar las trazas","Más logs"],
  ok:1, why:"Así pagas poco y conservas lo que importa."}
]}

]});
