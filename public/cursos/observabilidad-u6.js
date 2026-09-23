window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Trazas distribuidas y OpenTelemetry",
resumen: "Spans y propagación de contexto, el SDK y la auto-instrumentación de OpenTelemetry, el Collector, el muestreo head y tail, y Tempo y Jaeger con TraceQL",
nivel: "Avanzado",
color: "#cf5454",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"ob4l2",
titulo:"Trazas distribuidas: spans y contexto",
claves:["Una traza está formada por spans: cada operación con su inicio, duración, atributos, eventos y estado","El contexto viaja entre servicios en la cabecera traceparent (W3C Trace Context): versión, trace-id, span padre y flags","Sin propagación no hay traza distribuida: cada salto que no la lleva parte la traza en dos"],
pasos:[
 {t:"info", eti:"Seguir una petición", h:"Spans y contexto",
  c:`<div class="dg dg-arbol"><div class="dg-tit">una traza y sus spans</div><div class="rama" style="--n:0"><span class="nom carpeta">traceId 4bf92f35...</span></div><div class="rama" style="--n:1"><span class="nom carpeta">GET /api/pedidos/1042</span><span class="coment">api-gateway · 320 ms</span></div><div class="rama" style="--n:2"><span class="nom carpeta">GET /pedidos/1042</span><span class="coment">pedidos · 290 ms</span></div><div class="rama" style="--n:3"><span class="nom">SELECT pedidos</span><span class="coment">postgres · 12 ms</span></div><div class="rama" style="--n:3"><span class="nom carpeta">GET /clientes/42</span><span class="coment">clientes · 260 ms · <b>aquí está el tiempo</b></span></div><div class="rama" style="--n:4"><span class="nom">SELECT clientes</span><span class="coment">postgres · 240 ms · <b>consulta sin índice</b></span></div></div>
     <p>Cada servicio añade sus <b>spans</b> y pasa el contexto en la cabecera <code>traceparent</code> (W3C Trace Context). Con Spring Boot y Micrometer Tracing, o con el agente Java de OpenTelemetry, se instrumenta casi todo sin tocar código.</p>`},
 {t:"info", eti:"Por dentro", h:"Anatomía de un span y de traceparent",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué lleva un span</div><table class="dg-tabla"><tbody>
       <tr><td>trace_id, span_id, parent_span_id</td><td>a qué traza pertenece y quién es su padre</td></tr>
       <tr><td>nombre y tipo (kind)</td><td><code>GET /pedidos/{id}</code>; SERVER, CLIENT, PRODUCER, CONSUMER o INTERNAL</td></tr>
       <tr><td>inicio y fin</td><td>la duración</td></tr>
       <tr><td>atributos</td><td><code>http.route</code>, <code>http.response.status_code</code>, <code>db.system</code>… según las convenciones semánticas</td></tr>
       <tr><td>eventos</td><td>momentos dentro del span, como una excepción con su traza de pila</td></tr>
       <tr><td>estado</td><td>Unset, Ok o Error</td></tr>
       <tr><td>enlaces (links)</td><td>relación con otras trazas: un consumidor que procesa un lote de 50 mensajes</td></tr>
     </tbody></table></div>
     <div class="termbox">traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
tracestate: proveedor=valor           # datos propios de cada sistema de trazas
baggage: cliente.plan=premium         # pares clave-valor que viajan con la petición</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">las cuatro partes de traceparent</div><table class="dg-tabla"><thead><tr><th>Parte</th><th>Valor</th><th>Significado</th></tr></thead><tbody>
       <tr><td>versión</td><td><code>00</code></td><td>versión del formato</td></tr>
       <tr><td>trace-id</td><td><code>4bf92f35…0e0e4736</code></td><td>32 hexadecimales: la traza entera</td></tr>
       <tr><td>span padre</td><td><code>00f067aa0ba902b7</code></td><td>16 hexadecimales: el span que hizo la llamada</td></tr>
       <tr><td>flags</td><td><code>01</code></td><td>bit más bajo a 1: la traza está muestreada</td></tr>
     </tbody></table></div>
     <p>El <b>baggage</b> propaga datos de negocio a todos los servicios de la cadena, pero viaja en cada petición (también a terceros): nada sensible y poco tamaño.</p>`},
 {t:"codigo", p:"Valida cabeceras <code>traceparent</code> y extrae sus partes",
  lenguaje:"js",
  c:`<p>Cada línea es una cabecera. Es válida si tiene 4 partes separadas por <code>-</code>: versión <code>00</code>, trace-id de <b>32</b> caracteres hexadecimales en minúscula que no sean todo ceros, span padre de <b>16</b> hexadecimales que no sean todo ceros y flags de 2 hexadecimales. Imprime <code>traza=… padre=… muestreada=si|no</code> (muestreada si el bit más bajo de los flags es 1) o <code>invalida</code>.</p>`,
  plantilla:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n\nfunction analiza(cabecera) {\n  const partes = cabecera.trim().split(\"-\");\n  // valida y devuelve el texto de salida\n}\n\nfor (const l of lineas) console.log(analiza(l));\n",
  pruebas:[{entrada:"00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00\n00-00000000000000000000000000000000-00f067aa0ba902b7-01\n", salida:"traza=4bf92f3577b34da6a3ce929d0e0e4736 padre=00f067aa0ba902b7 muestreada=si\ntraza=4bf92f3577b34da6a3ce929d0e0e4736 padre=00f067aa0ba902b7 muestreada=no\ninvalida"},{entrada:"00-4bf92f3577b34da6a3ce929d0e0e473-00f067aa0ba902b7-01\n00-4BF92F3577B34DA6A3CE929D0E0E4736-00f067aa0ba902b7-01\n00-a3ce929d0e0e47364bf92f3577b34da6-0000000000000000-01\n00-a3ce929d0e0e47364bf92f3577b34da6-b7ad6b7169203331-03\nhola\n", salida:"invalida\ninvalida\ninvalida\ntraza=a3ce929d0e0e47364bf92f3577b34da6 padre=b7ad6b7169203331 muestreada=si\ninvalida", oculta:true}],
  pista:"Usa expresiones regulares: /^[0-9a-f]{32}$/ y /^[0-9a-f]{16}$/, comprueba que no sean /^0+$/, y parseInt(flags, 16) & 1 para el bit de muestreo.",
  solucion:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n\nfunction analiza(cabecera) {\n  const partes = cabecera.trim().split(\"-\");\n  if (partes.length !== 4) return \"invalida\";\n  const [ver, traza, padre, flags] = partes;\n  if (ver !== \"00\") return \"invalida\";\n  if (!/^[0-9a-f]{32}$/.test(traza) || /^0+$/.test(traza)) return \"invalida\";\n  if (!/^[0-9a-f]{16}$/.test(padre) || /^0+$/.test(padre)) return \"invalida\";\n  if (!/^[0-9a-f]{2}$/.test(flags)) return \"invalida\";\n  const muestreada = (parseInt(flags, 16) & 1) === 1 ? \"si\" : \"no\";\n  return \"traza=\" + traza + \" padre=\" + padre + \" muestreada=\" + muestreada;\n}\n\nfor (const l of lineas) console.log(analiza(l));\n",
  why:"Es lo que hace el propagador de W3C en cada servicio: si la cabecera es inválida, la descarta y empieza una traza nueva. El flag de muestreo es la decisión del primer servicio, que respetan todos los demás."},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Span","Una operación con inicio, duración y atributos"],["Trace","El conjunto de spans de una petición"],["traceparent","Cabecera que propaga el contexto entre servicios"],["Baggage","Pares clave-valor de negocio que viajan con la petición"],["Span link","Relación con spans de otras trazas, por ejemplo al procesar un lote"]],
  why:"Los <i>links</i> resuelven el caso de las colas: un consumidor que procesa 50 mensajes no tiene 50 padres, sino un span enlazado con 50 trazas."},
 {t:"par", p:"Empareja cada tipo de span (kind) con su ejemplo",
  pares:[["SERVER","El controlador que atiende GET /pedidos/{id}"],["CLIENT","La llamada HTTP saliente al servicio de clientes"],["PRODUCER","Publicar el evento PedidoCreado en Kafka"],["CONSUMER","El servicio de correo que procesa ese evento"],["INTERNAL","Un cálculo dentro del proceso, sin red"]],
  why:"El tipo permite a los backends dibujar el mapa de servicios: un CLIENT de A seguido de un SERVER de B es una arista A → B."},
 {t:"opcion", p:"Las trazas de tu sistema aparecen «cortadas»: el servicio de pagos inicia trazas nuevas en vez de continuar la del pedido. ¿Qué falla?",
  ops:["La base de datos","La propagación del contexto: la cabecera traceparent no se envía o no se lee en esa llamada","El muestreo","Grafana"],
  ok:1, why:"Pasa con clientes HTTP creados a mano (fuera del que instrumenta la librería), con colas cuyos mensajes no llevan cabeceras de contexto y con proxies que quitan cabeceras desconocidas."},
 {t:"escribe", p:"¿Cómo se llama la cabecera HTTP estándar (W3C) que lleva el trace-id y el span padre entre servicios?",
  sol:["traceparent"],
  pista:"Una sola palabra: «traza» y «padre» en inglés.",
  why:"Su compañera <code>tracestate</code> lleva datos específicos de cada proveedor. Antes del estándar cada herramienta usaba las suyas (<code>X-B3-TraceId</code> de Zipkin, <code>uber-trace-id</code> de Jaeger)."}
]},

/* =============== U6 L2 =============== */
{
id:"ob6n1",
titulo:"OpenTelemetry: API, SDK y auto-instrumentación",
claves:["OpenTelemetry es el estándar abierto (CNCF) para generar y enviar trazas, métricas y logs, con OTLP como protocolo","La API se usa en el código y en las librerías; el SDK la implementa y se configura en la aplicación","La auto-instrumentación (agente Java, Node, Python, .NET) cubre HTTP, bases de datos y colas sin tocar código; se configura con variables OTEL_*"],
pasos:[
 {t:"info", eti:"El estándar", h:"Las piezas de OpenTelemetry",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué es cada cosa</div><table class="dg-tabla"><tbody>
       <tr><td>API</td><td>interfaces para crear spans y métricas; sin SDK no hace nada (coste casi cero). Las librerías dependen solo de ella</td></tr>
       <tr><td>SDK</td><td>la implementación: muestreo, procesadores, exportadores. Lo configura la aplicación</td></tr>
       <tr><td>Instrumentaciones</td><td>paquetes que crean spans y métricas para HTTP, JDBC, Kafka, Redis…</td></tr>
       <tr><td>Auto-instrumentación</td><td>agente que las aplica solas al arrancar</td></tr>
       <tr><td>OTLP</td><td>el protocolo de envío: gRPC en el puerto 4317, HTTP en el 4318</td></tr>
       <tr><td>Convenciones semánticas</td><td>nombres comunes: <code>service.name</code>, <code>http.route</code>, <code>db.system</code>…</td></tr>
       <tr><td>Resource</td><td>atributos de quién emite: servicio, versión, entorno, pod, nodo</td></tr>
     </tbody></table></div>
     <p>Trazas, métricas y logs son estables; la cuarta señal, los perfiles, está en desarrollo. OpenTelemetry sustituye a OpenTracing y OpenCensus, y los clientes propios de Jaeger ya están retirados.</p>`},
 {t:"info", eti:"En la práctica", h:"Auto-instrumentar y añadir spans propios",
  c:`<div class="termbox"># Java: agente, sin tocar código
export OTEL_SERVICE_NAME=pedidos
export OTEL_RESOURCE_ATTRIBUTES=service.version=1.8.2,deployment.environment.name=prod
export OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
java -javaagent:opentelemetry-javaagent.jar -jar app.jar

# Node
node --require @opentelemetry/auto-instrumentations-node/register server.js

# Python
opentelemetry-bootstrap -a install      # instala las instrumentaciones de tus dependencias
opentelemetry-instrument python app.py</div>
     <div class="termbox">// span propio para una operación de negocio (Java)
Span span = tracer.spanBuilder("calcular-envio").startSpan();
try (Scope s = span.makeCurrent()) {
  span.setAttribute("pedido.lineas", pedido.lineas().size());
  return tarifas.calcular(pedido);
} catch (Exception e) {
  span.recordException(e);
  span.setStatus(StatusCode.ERROR);
  throw e;
} finally {
  span.end();
}</div>
     <p>Lo automático te da la estructura (HTTP, SQL, colas); lo manual, los spans y atributos de <b>negocio</b> que hacen útil la traza. En Spring Boot también puedes usar Micrometer Tracing con el puente de OpenTelemetry.</p>`},
 {t:"term", p:"Arranca <code>app.jar</code> con el agente Java de OpenTelemetry (<code>opentelemetry-javaagent.jar</code>)",
  prompt:"pablo@portatil:~/pedidos$",
  sol:["java -javaagent:opentelemetry-javaagent.jar -jar app.jar","java -javaagent:./opentelemetry-javaagent.jar -jar app.jar"],
  salida:"[otel.javaagent 2026-09-22 10:14:03:118 +0000] [main] INFO io.opentelemetry.javaagent.tooling.VersionLogger - opentelemetry-javaagent - version: 2.x\n  .   ____          _            __ _ _\n...\nStarted PedidosApplication in 4.8 seconds",
  pista:"La opción -javaagent: de la JVM va antes de -jar.",
  why:"El agente modifica el bytecode de las librerías al cargarlas. Añade algo de tiempo de arranque y memoria, a cambio de instrumentar cientos de librerías sin tocar el código."},
 {t:"term", p:"Define el nombre del servicio como <code>pedidos</code> con la variable de entorno estándar de OpenTelemetry",
  prompt:"pablo@portatil:~/pedidos$",
  sol:["export OTEL_SERVICE_NAME=pedidos","export OTEL_SERVICE_NAME=\"pedidos\"","export OTEL_RESOURCE_ATTRIBUTES=service.name=pedidos"],
  salida:"",
  pista:"Todas empiezan por OTEL_; esta termina en SERVICE_NAME.",
  why:"Sin nombre, el servicio aparece como <code>unknown_service:java</code> y no hay forma de filtrarlo. Es el atributo más importante de todos."},
 {t:"par", p:"Empareja cada variable de entorno con lo que configura",
  pares:[["OTEL_SERVICE_NAME","El nombre del servicio"],["OTEL_EXPORTER_OTLP_ENDPOINT","A dónde se envían las señales"],["OTEL_TRACES_SAMPLER","Qué muestreador usa el SDK"],["OTEL_RESOURCE_ATTRIBUTES","Atributos extra del recurso: versión, entorno"],["OTEL_PROPAGATORS","Qué formatos de cabecera se propagan (tracecontext, baggage, b3)"]],
  why:"Las variables funcionan igual en todos los lenguajes: la configuración viaja en el manifiesto de despliegue, no en el código."},
 {t:"vf", p:"Una librería que publicas para otros equipos debe depender del SDK de OpenTelemetry para crear sus spans.",
  ok:false, why:"Las librerías dependen solo de la <b>API</b>. Si la aplicación no instala un SDK, las llamadas no hacen nada; si lo instala, se exportan con su configuración. Así la librería no impone exportadores ni versiones."},
 {t:"opcion", p:"Con la auto-instrumentación ves los spans HTTP y SQL, pero no sabes qué pedido ni qué cliente era cada traza. ¿Qué haces?",
  ops:["Desactivar la auto-instrumentación","Añadir atributos de negocio al span actual (Span.current().setAttribute(\"pedido.id\", id)) y spans manuales en las operaciones clave","Poner el id del pedido como etiqueta de Prometheus","Escribirlo en un log aparte"],
  ok:1, why:"En trazas, la alta cardinalidad sí es bienvenida: el id de pedido como atributo permite buscar «la traza de este pedido» directamente."},
 {t:"escribe", p:"¿En qué puerto recibe OTLP por HTTP un Collector con la configuración por defecto?",
  sol:["4318"],
  pista:"El de gRPC es 4317; el de HTTP, el siguiente.",
  why:"Por HTTP las rutas son <code>/v1/traces</code>, <code>/v1/metrics</code> y <code>/v1/logs</code>. Si una aplicación no envía nada, revisa que protocolo y puerto coincidan: gRPC contra el 4318 falla."}
]},

/* =============== U6 L3 =============== */
{
id:"ob6n2",
titulo:"El OpenTelemetry Collector",
claves:["Receptores, procesadores y exportadores unidos en pipelines por señal; los conectores unen pipelines","Patrón agente (uno por nodo o sidecar) más pasarela (gateway) central","memory_limiter primero y batch después; distribuciones core, contrib y k8s, o una propia con el builder"],
pasos:[
 {t:"info", eti:"El centro de todo", h:"Qué hace el Collector",
  c:`<div class="dg"><div class="dg-tit">el collector recibe, procesa y reparte</div>
       <div class="dg-vert">
         <div class="dg-caja base">apps<small>SDK o agente OTel · envían por OTLP</small></div>
         <div class="dg-caja acento doble">OpenTelemetry Collector<small>procesa: filtra, añade atributos, muestrea</small></div>
         <div class="dg-caja">cada señal a su destino<div class="dg-pila" style="margin-top:8px"><div class="dg-caja ok">trazas → Tempo / Jaeger</div><div class="dg-caja ok">métricas → Prometheus</div><div class="dg-caja ok">logs → Loki</div></div></div>
       </div>
     </div>
     <p>Desacopla las aplicaciones del destino: cambiar de proveedor es cambiar el Collector, no redesplegar cien servicios. Además centraliza el muestreo, el enmascarado de datos sensibles y los reintentos.</p>`},
 {t:"info", eti:"La configuración", h:"Pipelines",
  c:`<div class="termbox">receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }
processors:
  memory_limiter: { check_interval: 1s, limit_percentage: 80, spike_limit_percentage: 20 }
  k8sattributes: {}            # añade namespace, pod, deployment…
  batch: {}
exporters:
  otlp/tempo:            { endpoint: tempo:4317, tls: { insecure: true } }
  otlphttp/loki:         { endpoint: http://loki:3100/otlp }
  prometheusremotewrite: { endpoint: http://prometheus:9090/api/v1/write }
connectors:
  spanmetrics: {}              # genera métricas RED a partir de los spans
service:
  pipelines:
    traces:  { receivers: [otlp], processors: [memory_limiter, k8sattributes, batch], exporters: [otlp/tempo, spanmetrics] }
    metrics: { receivers: [otlp, spanmetrics], processors: [memory_limiter, batch], exporters: [prometheusremotewrite] }
    logs:    { receivers: [otlp], processors: [memory_limiter, k8sattributes, batch], exporters: [otlphttp/loki] }</div>
     <ul><li>Un componente definido pero no usado en <code>service.pipelines</code> no hace nada.</li>
     <li><b>Despliegue</b>: agentes (DaemonSet o sidecar) cerca de las apps, que añaden metadatos del nodo; y una <b>pasarela</b> central (Deployment con varias réplicas) que muestrea y exporta.</li>
     <li><b>Distribuciones</b>: <i>core</i> (lo mínimo), <i>contrib</i> (todo), <i>k8s</i>, o la tuya con el OpenTelemetry Collector Builder (solo los componentes que usas: menos superficie de ataque).</li></ul>`},
 {t:"orden", p:"Ordena los procesadores de un pipeline de trazas como se recomienda",
  items:["memory_limiter: rechaza datos antes de quedarse sin memoria","k8sattributes: añade namespace, pod y deployment","filter / transform: quita spans de salud y enmascara datos sensibles","batch: agrupa para enviar en lotes"],
  why:"El limitador de memoria va primero para proteger todo lo demás; el <code>batch</code>, al final, para enviar lo ya procesado en lotes eficientes."},
 {t:"term", p:"Comprueba que <code>config.yaml</code> es una configuración válida para <code>otelcol-contrib</code>, sin arrancarlo",
  prompt:"pablo@portatil:~/otel$",
  sol:["otelcol-contrib validate --config=config.yaml","otelcol-contrib validate --config config.yaml","otelcol-contrib validate --config=./config.yaml"],
  salida:"",
  pista:"El binario, el subcomando validate y --config.",
  why:"Sin salida y con código 0 significa que es válida. Detecta componentes que no existen en tu distribución, pipelines que usan algo no definido y campos mal escritos."},
 {t:"par", p:"Empareja cada tipo de componente con un ejemplo",
  pares:[["Receiver","otlp, prometheus, filelog, hostmetrics"],["Processor","memory_limiter, batch, k8sattributes, tail_sampling"],["Exporter","otlp, otlphttp, prometheusremotewrite, debug"],["Connector","spanmetrics, servicegraph: salida de un pipeline y entrada de otro"],["Extension","health_check, pprof, zpages"]],
  why:"El exportador <code>debug</code> imprime lo que recibe en la salida del Collector: es la primera herramienta cuando «no llegan las trazas»."},
 {t:"hueco", p:"Completa el pipeline de logs",
  tpl:"service:\n  pipelines:\n    logs:\n      ___: [otlp]\n      processors: [memory_limiter, batch]\n      ___: [otlphttp/loki]",
  banco:["receivers","exporters","connectors","extensions","inputs","outputs"],
  sol:["receivers","exporters"],
  why:"Cada pipeline es de una señal (traces, metrics, logs) y une receptores → procesadores → exportadores."},
 {t:"opcion", p:"Durante un pico de tráfico, el Collector pasarela muere por falta de memoria (OOMKilled) y se pierden todas las trazas de ese rato. ¿Qué faltaba?",
  ops:["Más exportadores","El procesador memory_limiter al principio del pipeline, para rechazar datos (y que el SDK reintente) antes de agotar la memoria","El procesador batch con lotes más grandes","Quitar el receptor gRPC"],
  ok:1, why:"Además: réplicas con autoescalado, colas de envío acotadas y métricas del propio Collector (<code>otelcol_processor_refused_spans</code>, <code>otelcol_exporter_send_failed_spans</code>) con sus alertas."},
 {t:"vf", p:"Para usar OpenTelemetry es obligatorio desplegar un Collector.",
  ok:false, why:"El SDK puede exportar directamente a Tempo, Jaeger o un proveedor. Pero en producción el Collector casi siempre compensa: reintentos, muestreo por cola, enriquecimiento y un único punto donde cambiar el destino."}
]},

/* =============== U6 L4 =============== */
{
id:"ob6n3",
titulo:"Muestreo: head y tail",
claves:["Head sampling: se decide al empezar la traza (barato, pero a ciegas) y la decisión viaja en el flag de traceparent","Tail sampling: se decide al terminar, en el Collector, con políticas (errores, lentas, un porcentaje del resto)","El tail sampling exige que todos los spans de una traza lleguen al mismo Collector: balanceo por trace-id"],
pasos:[
 {t:"info", eti:"No se puede guardar todo", h:"Muestreo por cabecera",
  c:`<p>Con 5.000 peticiones por segundo y 30 spans cada una, guardar todo son 13.000 millones de spans al día. Se muestrea.</p>
     <div class="termbox">export OTEL_TRACES_SAMPLER=parentbased_traceidratio
export OTEL_TRACES_SAMPLER_ARG=0.1       # el 10 % de las trazas nuevas</div>
     <ul><li><b>Head sampling</b>: el primer servicio decide al crear la traza (a partir del trace-id, de forma determinista) y lo marca en el flag de <code>traceparent</code>. Los demás, con <i>parentbased</i>, respetan esa decisión: las trazas salen completas.</li>
     <li>Barato: lo descartado ni se genera. Pero es <b>a ciegas</b>: al empezar no sabes si la petición va a fallar o a tardar 8 segundos. Con un 1 %, casi todos los errores raros se pierden.</li></ul>`},
 {t:"info", eti:"Decidir con toda la información", h:"Muestreo por cola en el Collector",
  c:`<div class="termbox">processors:
  tail_sampling:
    decision_wait: 10s            # espera a que llegue la traza completa
    num_traces: 100000            # trazas en memoria mientras se decide
    policies:
      - name: errores
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: lentas
        type: latency
        latency: { threshold_ms: 500 }
      - name: resto
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }</div>
     <div class="dg" style="margin-top:12px"><div class="dg-tit">dos capas para que funcione</div>
       <div class="dg-flujo">
         <div class="dg-caja base">apps</div>
         <div class="dg-caja">Collectors de capa 1<small>exportador loadbalancing por trace-id</small></div>
         <div class="dg-caja acento">Collectors de capa 2<small>tail_sampling</small></div>
         <div class="dg-caja ok">Tempo / Jaeger</div>
       </div>
     </div>
     <ul><li>Se guarda la traza si cumple <b>alguna</b> política. Coste: memoria para retener trazas durante <code>decision_wait</code>.</li>
     <li>Si los spans de una traza se reparten entre réplicas, cada una ve un trozo y decide mal: por eso la capa 1 enruta por trace-id.</li>
     <li>Las métricas derivadas de spans (<code>spanmetrics</code>) se calculan <b>antes</b> de muestrear, o las tasas saldrán multiplicadas por 0,05.</li></ul>`},
 {t:"codigo", p:"Implementa una decisión de tail sampling",
  lenguaje:"js",
  c:`<p>Cada línea: <code>trace_id duración_ms estado</code>. Guarda la traza si el estado es <code>ERROR</code>, si dura <b>más de 500 ms</b>, o, para el resto, si los últimos 8 caracteres del trace_id leídos como hexadecimal, módulo 100, dan <b>menos de 10</b> (un 10 % determinista). Imprime los 8 primeros caracteres del trace_id y <code>guardar</code> o <code>descartar</code>, y al final <code>guardadas X de N</code>.</p>`,
  plantilla:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nlet guardadas = 0;\n\nfunction decide(traceId, ms, estado) {\n  // devuelve true si hay que guardar la traza\n}\n\nfor (const l of lineas) {\n  const [id, ms, estado] = l.trim().split(/\\s+/);\n  const g = decide(id, Number(ms), estado);\n  if (g) guardadas++;\n  console.log(id.slice(0, 8) + \" \" + (g ? \"guardar\" : \"descartar\"));\n}\nconsole.log(\"guardadas \" + guardadas + \" de \" + lineas.length);\n",
  pruebas:[{entrada:"4bf92f3577b34da6a3ce929d0e0e4736 120 OK\na1b2c3d4e5f60718293a4b5c6d7e8f90 900 OK\n00000000000000000000000000000abc 80 ERROR\nffffffffffffffffffffffff00000005 50 OK\n", salida:"4bf92f35 descartar\na1b2c3d4 guardar\n00000000 guardar\nffffffff guardar\nguardadas 3 de 4"},{entrada:"0123456789abcdef0123456789abcdef 500 OK\n1111111111111111111111110000006e 20 OK\n22222222222222222222222200000009 20 OK\n", salida:"01234567 descartar\n11111111 descartar\n22222222 guardar\nguardadas 1 de 3", oculta:true}],
  pista:"if (estado === \"ERROR\" || ms > 500) return true; return parseInt(traceId.slice(-8), 16) % 100 < 10;",
  solucion:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nlet guardadas = 0;\n\nfunction decide(traceId, ms, estado) {\n  if (estado === \"ERROR\") return true;\n  if (ms > 500) return true;\n  return parseInt(traceId.slice(-8), 16) % 100 < 10;\n}\n\nfor (const l of lineas) {\n  const [id, ms, estado] = l.trim().split(/\\s+/);\n  const g = decide(id, Number(ms), estado);\n  if (g) guardadas++;\n  console.log(id.slice(0, 8) + \" \" + (g ? \"guardar\" : \"descartar\"));\n}\nconsole.log(\"guardadas \" + guardadas + \" de \" + lineas.length);\n",
  why:"Decidir a partir del trace-id y no con un número aleatorio hace que todas las réplicas y servicios tomen la misma decisión para la misma traza: es la idea del muestreador <i>traceidratio</i>."},
 {t:"par", p:"Empareja cada estrategia con su característica",
  pares:[["Head sampling por porcentaje","Barato y sencillo, pero pierde la mayoría de los errores raros"],["parentbased","Respeta la decisión del servicio que inició la traza"],["Tail sampling por estado","Guarda siempre las trazas con errores"],["Tail sampling por latencia","Guarda las trazas más lentas que un umbral"],["Exportador loadbalancing","Envía todos los spans de una traza al mismo Collector"]],
  why:"Lo habitual en producción: head sampling alto (o del 100 %) en las apps y tail sampling en la pasarela."},
 {t:"opcion", p:"Guardas el 1 % de las trazas al azar y nunca encuentras las de las peticiones con error. ¿Qué cambias?",
  ops:["Guardar el 0,1 %","Muestreo por cola: conservar siempre las que tienen error o son lentas, y un porcentaje del resto","Quitar las trazas","Más logs"],
  ok:1, why:"Así pagas poco y conservas lo que importa."},
 {t:"vf", p:"Con head sampling, un servicio puede decidir guardar una traza porque terminó con error.",
  ok:false, why:"La decisión se toma al principio, cuando aún no se sabe cómo acabará. Para decidir por el resultado hace falta tail sampling (o que el error se registre por otra vía: métricas y logs no se muestrean igual)."},
 {t:"term", p:"Configura el SDK para que muestree el 25 % de las trazas nuevas y respete siempre la decisión del padre: escribe la variable del <b>argumento</b> del muestreador",
  prompt:"pablo@portatil:~/pedidos$",
  sol:["export OTEL_TRACES_SAMPLER_ARG=0.25","export OTEL_TRACES_SAMPLER_ARG=\"0.25\"","export OTEL_TRACES_SAMPLER_ARG=.25"],
  salida:"",
  pista:"Es la variable del muestreador con el sufijo _ARG, y un valor entre 0 y 1.",
  why:"Va junto a <code>OTEL_TRACES_SAMPLER=parentbased_traceidratio</code>. El valor es una proporción (0,25), no un porcentaje (25)."},
 {t:"opcion", p:"Tu pasarela tiene 3 réplicas con tail_sampling detrás de un balanceador normal, y ves trazas incompletas y decisiones incoherentes. ¿Por qué?",
  ops:["Porque decision_wait es muy largo","Porque los spans de una misma traza caen en réplicas distintas: cada una decide con información parcial","Porque faltan políticas","Porque el balanceador cifra los datos"],
  ok:1, why:"Solución: una capa previa con el exportador <code>loadbalancing</code> (<code>routing_key: traceID</code>) que envía todos los spans de una traza a la misma réplica."}
]},

/* =============== U6 L5 =============== */
{
id:"ob6n4",
titulo:"Tempo, Jaeger y TraceQL",
claves:["Jaeger: backend y UI clásicos de la CNCF; la v2 está construida sobre el Collector de OpenTelemetry","Grafana Tempo: guarda trazas solo en almacenamiento de objetos, barato, y las busca con TraceQL","Métricas desde trazas (span metrics) y mapa de servicios (service graph)"],
pasos:[
 {t:"info", eti:"Dónde se guardan", h:"Backends de trazas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">los habituales</div><table class="dg-tabla"><thead><tr><th>Backend</th><th>Almacenamiento</th><th>Búsqueda</th><th>Notas</th></tr></thead><tbody>
       <tr><td>Jaeger v2</td><td>Cassandra, Elasticsearch / OpenSearch, Badger, memoria</td><td>por servicio, operación, etiquetas y duración</td><td>interfaz propia (puerto 16686); su antiguo <code>jaeger-agent</code> y sus clientes están retirados: se instrumenta con OpenTelemetry</td></tr>
       <tr><td>Grafana Tempo</td><td>solo almacenamiento de objetos (S3, GCS, Azure)</td><td>TraceQL</td><td>muy barato a gran escala; se consulta desde Grafana</td></tr>
       <tr><td>Proveedores (Datadog, Honeycomb, Elastic, New Relic…)</td><td>gestionado</td><td>propia</td><td>todos aceptan OTLP</td></tr>
     </tbody></table></div>
     <p>Tempo tiene además un <b>generador de métricas</b>: a partir de los spans calcula métricas RED por servicio y operación (span metrics) y las aristas entre servicios (service graph), que Grafana pinta como mapa. El Collector puede hacer lo mismo con los conectores <code>spanmetrics</code> y <code>servicegraph</code>.</p>`},
 {t:"info", eti:"Consultar trazas", h:"TraceQL",
  c:`<div class="termbox"># trazas con errores en pagos
{ resource.service.name = "pagos" &amp;&amp; status = error }

# spans lentos de una ruta
{ span.http.route = "/api/pedidos" &amp;&amp; duration &gt; 2s }

# respuestas 5xx
{ span.http.response.status_code &gt;= 500 }

# estructura: trazas donde la API llama (a cualquier profundidad) a una consulta lenta
{ resource.service.name = "api" } &gt;&gt; { span.db.system = "postgresql" &amp;&amp; duration &gt; 500ms }

# agregados: trazas con más de 20 llamadas a la base de datos (¿un N+1?)
{ span.db.system = "postgresql" } | count() &gt; 20</div>
     <p><code>resource.</code> son atributos de quien emite (servicio, versión, pod); <code>span.</code>, los de cada operación. Las condiciones entre llaves se aplican a un mismo span; <code>&gt;&gt;</code> (descendiente) y <code>&gt;</code> (hijo directo) relacionan spans.</p>`},
 {t:"term", p:"Escribe la consulta TraceQL que encuentra spans del servicio <code>pagos</code> (atributo de recurso <code>service.name</code>) con estado de error",
  prompt:"TraceQL ›",
  sol:['{ resource.service.name = "pagos" && status = error }','{resource.service.name="pagos" && status=error}','{ resource.service.name = "pagos" && status = error}','{ status = error && resource.service.name = "pagos" }','{ .service.name = "pagos" && status = error }'],
  salida:"Trace 7c1e0b…  pagos  POST /api/pagos  1.2s  error\nTrace 91ad44…  pagos  POST /api/pagos  0.4s  error",
  pista:"Llaves, resource.service.name = \"pagos\", &&, y status = error (sin comillas: es una palabra clave).",
  why:"<code>status</code> es un intrínseco del span (como <code>duration</code> o <code>name</code>), por eso no lleva prefijo. Con <code>.service.name</code> (sin ámbito) busca el atributo tanto en recurso como en span, pero es más lento."},
 {t:"term", p:"Busca spans que tarden más de 2 segundos en cualquier servicio",
  prompt:"TraceQL ›",
  sol:["{ duration > 2s }","{duration>2s}","{ duration > 2000ms }","{duration > 2s}"],
  salida:"Trace 4bf92f…  api  GET /api/pedidos/{id}  2.8s\nTrace b20c7e…  api  GET /api/informes  6.1s",
  pista:"El intrínseco duration comparado con 2s.",
  why:"Tras encontrar las trazas lentas, se abre una y se mira qué span hijo se lleva el tiempo: casi siempre una consulta o una llamada externa."},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["TraceQL","Lenguaje de consulta de trazas de Tempo"],["Span metrics","Métricas RED calculadas a partir de los spans"],["Service graph","Mapa de qué servicio llama a cuál, con tasas y errores"],["Jaeger UI","Interfaz de búsqueda y visualización de trazas de Jaeger"],["Almacenamiento de objetos","Donde Tempo guarda las trazas, barato y sin índice pesado"]],
  why:"Tempo apuesta por no indexar casi nada: busca el trace-id directamente y, para lo demás, recorre en paralelo bloques columnares (Parquet)."},
 {t:"opcion", p:"Quieres detectar endpoints con el problema N+1 (una consulta a la base de datos por cada elemento de una lista). ¿Qué consulta TraceQL ayuda?",
  ops:["{ duration &gt; 1s }","{ span.db.system = \"postgresql\" } | count() &gt; 20","{ status = ok }","{ resource.service.name = \"api\" }"],
  ok:1, why:"Trazas con decenas de spans de base de datos casi idénticos son la huella del N+1. En la vista de la traza se ve como una «escalera» de consultas cortas."},
 {t:"vf", p:"En una instalación nueva de Jaeger se recomienda instrumentar las aplicaciones con los clientes propios de Jaeger y enviar a jaeger-agent.",
  ok:false, why:"Los clientes de Jaeger y <code>jaeger-agent</code> están retirados. Se instrumenta con OpenTelemetry y se envía por OTLP; Jaeger v2 recibe OTLP directamente."},
 {t:"escribe", p:"¿Cómo se llama el lenguaje de consulta de trazas de Grafana Tempo?",
  sol:["TraceQL","traceql"],
  pista:"Como PromQL y LogQL, pero para trazas.",
  why:"Con TraceQL también se calculan métricas al vuelo sobre las trazas (<code>{ } | rate()</code>), útiles para investigar dimensiones que no tienes como métrica."}
]}

]});
