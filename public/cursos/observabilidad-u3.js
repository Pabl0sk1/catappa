window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Métricas con Prometheus",
resumen: "Cómo funciona Prometheus por dentro, tipos de métricas, cardinalidad, instrumentar aplicaciones, exporters, service discovery y relabeling",
nivel: "Intermedio",
color: "#dc6060",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"ob2l1",
titulo:"Cómo funciona Prometheus",
claves:["Prometheus recoge métricas haciendo scrape (HTTP) a /metrics de cada objetivo","Serie temporal = nombre de métrica + etiquetas; valores con marca de tiempo","Base de datos local: bloque en memoria con WAL, bloques de 2 h en disco y retención por tiempo o tamaño"],
pasos:[
 {t:"info", eti:"Recoger", h:"El modelo pull",
  c:`<div class="dg"><div class="dg-tit">prometheus va a buscar las métricas</div>
       <div class="dg-pila">
         <div class="dg-pila"><div class="dg-caja base">tu API<small>Actuator/Micrometer, prom-client…</small></div><div class="dg-caja base">node_exporter<small>CPU, disco, red del nodo</small></div><div class="dg-caja base">postgres_exporter</div></div>
         <div class="dg-nota arriba">cada 15 s, <code>GET /metrics</code> a cada uno</div>
         <div class="dg-caja acento doble">Prometheus<small>guarda series temporales en su base de datos local</small></div>
         <div class="dg-nota arriba">consultas PromQL</div>
         <div class="dg-fila"><div class="dg-caja ok">Grafana</div><div class="dg-caja ok">reglas de alerta</div></div>
       </div>
     </div>
     <div class="termbox"># lo que devuelve /metrics (formato de texto)
# HELP http_server_requests_seconds Duración de las peticiones HTTP
# TYPE http_server_requests_seconds histogram
http_server_requests_seconds_count{method="GET",uri="/api/tareas",status="200"} 18231
http_server_requests_seconds_sum{method="GET",uri="/api/tareas",status="200"} 912.4
jvm_memory_used_bytes{area="heap"} 2.1e+08</div>
     <p>Cada línea es una <b>serie temporal</b>: nombre más etiquetas. En cada scrape, Prometheus añade una muestra (marca de tiempo, valor) a cada serie. Además genera la serie <code>up</code> por objetivo: 1 si el scrape fue bien, 0 si falló.</p>`},
 {t:"info", eti:"Por dentro", h:"Configuración y almacenamiento",
  c:`<div class="termbox"># prometheus.yml
global:
  scrape_interval: 15s        # cada cuánto se recoge
  evaluation_interval: 15s    # cada cuánto se evalúan las reglas

rule_files: ["reglas/*.yml"]

scrape_configs:
  - job_name: tareas-api
    metrics_path: /actuator/prometheus
    static_configs:
      - targets: ["tareas-api:8080"]
        labels: { entorno: prod }</div>
     <ul><li>Las muestras recientes viven en memoria (el <b>head block</b>) y se protegen con un <b>WAL</b> en disco para no perderlas si el proceso cae.</li>
     <li>Cada 2 horas se escriben en un <b>bloque</b> inmutable, y los bloques se compactan en otros mayores.</li>
     <li>La retención por defecto son <b>15 días</b> (<code>--storage.tsdb.retention.time</code>, o por tamaño con <code>--storage.tsdb.retention.size</code>).</li>
     <li>Un Prometheus es <b>un solo nodo</b>: para alta disponibilidad y retención larga se añaden Thanos, Mimir o VictoriaMetrics (lo verás más adelante).</li></ul>`},
 {t:"term", p:"Antes de recargar Prometheus, comprueba que <code>prometheus.yml</code> es válido",
  prompt:"pablo@servidor:~/monitorizacion$",
  sol:["promtool check config prometheus.yml","promtool check config ./prometheus.yml"],
  salida:"Checking prometheus.yml\n  SUCCESS: prometheus.yml is valid prometheus config file syntax",
  pista:"promtool, subcomando check, y qué compruebas.",
  why:"<code>promtool</code> viene con Prometheus. Úsalo en el CI: un YAML roto en la configuración deja a Prometheus con la configuración anterior (al recargar) o sin arrancar (al reiniciar)."},
 {t:"term", p:"Prometheus arrancó con <code>--web.enable-lifecycle</code>. Pídele que recargue la configuración sin reiniciar",
  prompt:"pablo@servidor:~/monitorizacion$",
  sol:["curl -X POST http://localhost:9090/-/reload","curl -X POST localhost:9090/-/reload","curl -XPOST http://localhost:9090/-/reload","curl -XPOST localhost:9090/-/reload","curl -X POST http://127.0.0.1:9090/-/reload","kill -HUP $(pidof prometheus)"],
  salida:"",
  pista:"Una petición POST al endpoint /-/reload del puerto 9090.",
  why:"También vale enviar la señal SIGHUP al proceso. Recargar no pierde datos; reiniciar obliga a reproducir el WAL, que en instancias grandes tarda minutos."},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["Scrape","Prometheus pide periódicamente las métricas a cada objetivo"],["/metrics","Endpoint donde la aplicación expone sus métricas"],["Exporter","Traduce métricas de un sistema al formato de Prometheus"],["Service discovery","Encontrar objetivos automáticamente (por ejemplo, pods de Kubernetes)"],["Pushgateway","Para trabajos cortos que no viven lo suficiente para ser consultados"]],
  why:"En Kubernetes, el Prometheus Operator descubre objetivos con ServiceMonitor y PodMonitor."},
 {t:"vf", p:"Por defecto, las aplicaciones envían (push) sus métricas a Prometheus.",
  ok:false, why:"Prometheus va a buscarlas (pull). Así sabe además si un objetivo está caído (<code>up == 0</code>) y controla él el ritmo, en vez de que mil aplicaciones lo saturen. (Prometheus 3 también puede recibir OTLP por push, pero el modelo base es pull.)"},
 {t:"opcion", p:"La serie <code>up{job=\"tareas-api\", instance=\"10.0.3.7:8080\"}</code> vale 0. ¿Qué significa?",
  ops:["Que la aplicación no tiene tráfico","Que el último scrape a ese objetivo falló: no respondió, dio error o tardó más que el scrape_timeout","Que la CPU está al 0 %","Que no hay errores"],
  ok:1, why:"Es la alerta más básica de todas (<code>up == 0</code> durante unos minutos). En la página Targets verás el motivo: conexión rechazada, timeout, 404 en la ruta…"},
 {t:"escribe", p:"¿En qué puerto escucha Prometheus por defecto?",
  sol:["9090"],
  pista:"Cuatro cifras; empieza por 90.",
  why:"Ayuda conocer los habituales: 9090 Prometheus, 9093 Alertmanager, 9100 node_exporter, 3000 Grafana, 3100 Loki."}
]},

/* =============== U3 L2 =============== */
{
id:"ob2l2",
titulo:"Tipos de métricas y etiquetas",
claves:["Counter solo sube (peticiones, errores); gauge sube y baja (memoria, cola)","Histogram cuenta observaciones en cubetas acumuladas para calcular percentiles al consultar; summary los calcula en el cliente y no se puede agregar","Nombres con unidad base y sufijo: _seconds, _bytes, _total"],
pasos:[
 {t:"info", eti:"Tipos", h:"Counter, gauge, histogram y summary",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">los tipos de métrica</div><table class="dg-tabla"><thead><tr><th>Tipo</th><th>Ejemplo</th><th>Qué guarda</th></tr></thead><tbody>
       <tr><td>counter</td><td><code>pedidos_creados_total</code></td><td>solo sube (vuelve a 0 al reiniciar el proceso)</td></tr>
       <tr><td>gauge</td><td><code>cola_pendientes</code></td><td>valor actual, sube y baja</td></tr>
       <tr><td>histogram</td><td><code>pago_duracion_seconds</code></td><td>cubetas acumuladas: <code>_bucket{le="0.1"} 900</code> <code>{le="0.5"} 980</code> <code>{le="1"} 995</code> <code>{le="+Inf"} 1000</code>, más <code>_sum</code> y <code>_count</code></td></tr>
       <tr><td>summary</td><td><code>pago_duracion_seconds{quantile="0.99"}</code></td><td>percentiles ya calculados en el proceso, más <code>_sum</code> y <code>_count</code></td></tr>
     </tbody></table></div>
     <div class="termbox">// Micrometer en Spring
Counter.builder("pedidos_creados").tag("canal", "web").register(registry).increment();
Gauge.builder("cola_pendientes", cola, Queue::size).register(registry);
Timer.builder("pago_duracion").publishPercentileHistogram().register(registry)
     .record(() -&gt; pasarela.cobrar(pedido));</div>`},
 {t:"info", eti:"La letra pequeña", h:"Histogram frente a summary",
  c:`<ul><li>Las cubetas del histograma son <b>acumuladas</b>: <code>le="0.5"</code> cuenta todo lo que tardó 0,5 s o menos (incluye lo de <code>le="0.1"</code>). <code>le="+Inf"</code> es igual a <code>_count</code>.</li>
     <li>Un <b>histograma se puede agregar</b>: sumas las cubetas de todas las réplicas y calculas el percentil del total. Un <b>summary no</b>: el p99 de cada réplica ya viene calculado y los percentiles no se suman ni se promedian.</li>
     <li>La precisión del histograma depende de las cubetas: si tu objetivo es «300 ms», pon una cubeta en 0,3.</li>
     <li><b>Histogramas nativos</b>: Prometheus 3 y las librerías principales admiten cubetas exponenciales automáticas en una sola serie, más precisas y baratas. Según la versión hay que activarlos en el servidor y en el cliente.</li></ul>
     <div class="nota ojo"><b class="tit">Unidades</b>Siempre en unidad base: segundos (no milisegundos) y bytes (no megas). El sufijo lo dice: <code>_seconds</code>, <code>_bytes</code>, y los contadores terminan en <code>_total</code>.</div>`},
 {t:"par", p:"Empareja cada métrica con su tipo adecuado",
  pares:[["Número total de peticiones atendidas","Counter"],["Memoria usada ahora mismo","Gauge"],["Distribución de tiempos de respuesta de todas las réplicas","Histogram"],["Mensajes pendientes en una cola","Gauge (valor actual)"],["Errores de pago acumulados","Counter (total)"]],
  why:"Nunca calcules tasas a partir de un gauge que en realidad es un contador: <code>rate</code> solo tiene sentido sobre contadores."},
 {t:"hueco", p:"Un histograma llamado <code>http_request_duration_seconds</code> expone tres familias de series. Complétalas",
  tpl:"http_request_duration_seconds___{le=\"0.5\"}   http_request_duration_seconds_sum   http_request_duration_seconds___",
  banco:["_bucket","_count","_total","_quantile","_max"],
  sol:["_bucket","_count"],
  why:"<code>_sum / _count</code> da la media; <code>_bucket</code> da los percentiles con <code>histogram_quantile</code>; <code>_count</code> es además el contador de peticiones (el tráfico de RED sale gratis)."},
 {t:"vf", p:"Si cada réplica expone un summary con su p99, el p99 del servicio es la media de esos valores.",
  ok:false, why:"Los percentiles no se promedian. Para percentiles agregables usa histogramas; los summary solo sirven para ver cada proceso por separado."},
 {t:"escribe", p:"Por convención, ¿con qué sufijo termina el nombre de un contador en Prometheus?",
  sol:["_total","total"],
  pista:"Guion bajo y una palabra inglesa.",
  why:"Las librerías lo añaden solas (en Micrometer escribes <code>pedidos_creados</code> y se expone <code>pedidos_creados_total</code>). Ver <code>_total</code> te dice que hay que usar <code>rate</code> o <code>increase</code>."},
 {t:"opcion", p:"¿Cuál de estas etiquetas es un problema para Prometheus?",
  ops:["method=\"GET\"","status=\"500\"","user_id=\"839274\"","uri=\"/api/pedidos/{id}\""],
  ok:2, why:"Cardinalidad sin límite: cada usuario sería una serie nueva. Para detalles por usuario están los logs y las trazas."},
 {t:"opcion", p:"Tu SLO dice «el 99 % de las peticiones en menos de 250 ms», pero tus cubetas son 0,1, 0,5 y 1 s. ¿Qué problema hay?",
  ops:["Ninguno","No puedes saber con precisión cuántas peticiones tardan menos de 250 ms: queda en medio de una cubeta y el cálculo interpola","Que hay demasiadas cubetas","Que el histograma no tiene _sum"],
  ok:1, why:"Pon una cubeta justo en el umbral del SLO (0,25). Así «cuántas por debajo de 250 ms» es un dato exacto, no una estimación."}
]},

/* =============== U3 L3 =============== */
{
id:"ob3n1",
titulo:"Cardinalidad: el error caro",
claves:["Series = producto de los valores de todas las etiquetas; la memoria de Prometheus crece con las series activas","Encontrar a los culpables: count by (__name__), la página TSDB Status y promtool tsdb analyze","Defenderse: etiquetas acotadas, sample_limit y descartar con metric_relabel_configs"],
pasos:[
 {t:"info", eti:"La multiplicación", h:"Por qué explota",
  c:`<p>Cada combinación distinta de etiquetas es una serie. Un histograma de latencia con <code>method</code> (5 valores) × <code>uri</code> (40) × <code>status</code> (8) × 12 cubetas ya son 19.200 series por réplica; con 30 pods, más de medio millón. Si alguien añade <code>usuario_id</code>, son miles de millones y Prometheus muere por falta de memoria.</p>
     <ul><li>El coste lo marcan las <b>series activas</b> en el head block: cada una ocupa del orden de unos pocos KB de memoria.</li>
     <li><b>Rotación de series</b> (<i>churn</i>): cada despliegue crea pods con nombres nuevos, y cada pod estrena series. Muchos despliegues al día multiplican las series de las últimas horas.</li>
     <li>Culpables habituales: la URL real en vez de la plantilla (<code>/pedidos/1042</code> en vez de <code>/pedidos/{id}</code>), mensajes de error como etiqueta, ids, emails, direcciones IP de clientes.</li></ul>`},
 {t:"info", eti:"Encontrar al culpable", h:"Herramientas",
  c:`<div class="termbox"># las 10 métricas con más series
topk(10, count by (__name__) ({__name__=~".+"}))

# series activas en el head block
prometheus_tsdb_head_series

# qué etiqueta de una métrica tiene más valores
count(count by (uri) (http_server_requests_seconds_count))

$ promtool tsdb analyze /prometheus/data     # sobre los bloques en disco
# y en la web: Status → TSDB Status</div>
     <div class="termbox"># defensa en la configuración del scrape
scrape_configs:
  - job_name: pods
    sample_limit: 50000        # si un objetivo expone más, el scrape falla (up = 0)
    label_limit: 30
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: "http_client_requests_seconds_bucket"
        action: drop           # descartar lo que nadie consulta</div>`},
 {t:"term", p:"Escribe la consulta PromQL que muestra las 10 métricas con más series",
  prompt:"PromQL ›",
  sol:['topk(10, count by (__name__) ({__name__=~".+"}))','topk(10, count by (__name__)({__name__=~".+"}))','topk(10, count({__name__=~".+"}) by (__name__))','topk(10, count by (__name__) ({__name__!=""}))','topk(10, count({__name__!=""}) by (__name__))'],
  salida:"{__name__=\"http_server_requests_seconds_bucket\"}   412880\n{__name__=\"hikaricp_connections_usage_seconds_bucket\"}  58320\n{__name__=\"jvm_gc_pause_seconds_bucket\"}    21600\n...",
  pista:"topk(10, …) sobre un count by (__name__) de todas las series. El selector {__name__=~\".+\"} las elige todas.",
  why:"Es cara (toca todas las series): úsala para investigar, no en un panel que se refresca cada 10 segundos."},
 {t:"opcion", p:"Tras un despliegue, la memoria de Prometheus pasa de 6 a 28 GB en una hora. ¿Qué es lo más probable?",
  ops:["Que hay más tráfico","Que el despliegue añadió una etiqueta de cardinalidad alta, por ejemplo la URL real con ids en vez de la ruta plantilla","Que el disco está lleno","Que Grafana consulta mucho"],
  ok:1, why:"Más tráfico no crea series nuevas: solo incrementa las existentes. Lo que dispara la memoria son combinaciones de etiquetas nuevas. Compara <code>count by (__name__)</code> antes y después."},
 {t:"opcion", p:"Una métrica histograma tiene 5 métodos × 40 rutas × 8 códigos × 12 cubetas y la sirven 30 pods. ¿Cuántas series genera, como máximo?",
  ops:["1.600","19.200","576.000","12.000"],
  ok:2, why:"5 × 40 × 8 × 12 = 19.200 por pod, × 30 = 576.000. En la práctica no todas las combinaciones existen, pero así se estima el peor caso antes de añadir una etiqueta."},
 {t:"vf", p:"Aunque no se consulte nunca, una serie que se recoge sigue ocupando memoria y disco.",
  ok:true, why:"Por eso se descartan en el scrape (<code>metric_relabel_configs</code> con <code>action: drop</code>) las métricas que nadie usa. Es una de las formas más eficaces de bajar el coste."},
 {t:"par", p:"Empareja cada herramienta con lo que hace",
  pares:[["sample_limit","Hace fallar el scrape de un objetivo que expone demasiadas series"],["metric_relabel_configs con drop","Descarta series concretas antes de guardarlas"],["prometheus_tsdb_head_series","Cuántas series activas hay ahora"],["promtool tsdb analyze","Analiza los bloques en disco y señala etiquetas con muchos valores"]],
  why:"<code>sample_limit</code> es un cortafuegos: prefieres perder las métricas de un servicio mal instrumentado a que caiga Prometheus entero."},
 {t:"escribe", p:"Cada despliegue crea pods con nombres nuevos y, con ellos, series nuevas. ¿Cómo se llama en inglés ese fenómeno de series que aparecen y dejan de recibir datos?",
  sol:["churn","series churn","rotación de series","rotacion de series"],
  pista:"Palabra inglesa de cinco letras que también se usa para clientes que se dan de baja.",
  why:"Las series viejas siguen en el head block hasta que se compacta. Autoescalados agresivos o CronJobs muy frecuentes disparan el churn."}
]},

/* =============== U3 L4 =============== */
{
id:"ob2l3",
titulo:"Instrumentar aplicaciones",
claves:["Spring Boot: Actuator + Micrometer exponen /actuator/prometheus; Node: prom-client; Python: prometheus_client; Go: client_golang","Métricas técnicas gratis (HTTP, runtime, pool) y métricas de negocio propias","Nombres con unidades y sufijos (_seconds, _bytes, _total) y etiquetas acotadas"],
pasos:[
 {t:"info", eti:"Métricas desde tu código", h:"Micrometer y prom-client",
  c:`<div class="termbox"># Spring Boot: dependencias actuator + micrometer-registry-prometheus
management.endpoints.web.exposure.include: health,prometheus
management.metrics.distribution.percentiles-histogram.http.server.requests: true

@Component
class MetricasPedidos {
  private final Counter creados;
  MetricasPedidos(MeterRegistry r) {
    creados = Counter.builder("pedidos_creados").tag("canal", "web").register(r);
  }
  void creado() { creados.increment(); }
}

// Node
const client = require("prom-client");
client.collectDefaultMetrics();
const duracion = new client.Histogram({ name: "http_request_duration_seconds",
  help: "Duración de las peticiones", labelNames: ["ruta", "codigo"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5] });
const fin = duracion.startTimer();
// … atender la petición …
fin({ ruta: req.route.path, codigo: res.statusCode });</div>`},
 {t:"info", eti:"Qué instrumentar", h:"Técnicas y de negocio",
  c:`<ul><li><b>Gratis</b> con la librería: peticiones HTTP entrantes y salientes, runtime (memoria, GC, hilos, event loop), pool de conexiones.</li>
     <li><b>A mano</b>, las de negocio: pedidos creados, pagos rechazados por motivo, importe cobrado. Son las que detectan fallos que no dan 500 («nadie compra desde hace 20 minutos»).</li>
     <li><b>Etiquetas</b>: la ruta como plantilla (<code>req.route.path</code>, no <code>req.url</code>), el código de estado agrupado si hace falta (<code>2xx</code>, <code>5xx</code>), nunca ids.</li>
     <li><b>OpenTelemetry Metrics</b> es la alternativa neutral: instrumentas con el SDK de OTel y exportas a Prometheus (o a cualquier otro). Lo verás en la unidad de trazas.</li></ul>`},
 {t:"term", p:"Comprueba que tu API Spring Boot expone la métrica de peticiones HTTP: pide el endpoint de Prometheus de Actuator y filtra por <code>http_server_requests_seconds_count</code>",
  prompt:"pablo@portatil:~$",
  sol:["curl -s localhost:8080/actuator/prometheus | grep http_server_requests_seconds_count","curl -s http://localhost:8080/actuator/prometheus | grep http_server_requests_seconds_count","curl localhost:8080/actuator/prometheus | grep http_server_requests_seconds_count","curl http://localhost:8080/actuator/prometheus | grep http_server_requests_seconds_count"],
  salida:"http_server_requests_seconds_count{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/tareas\"} 18231\nhttp_server_requests_seconds_count{error=\"none\",exception=\"none\",method=\"POST\",outcome=\"SUCCESS\",status=\"201\",uri=\"/api/tareas\"} 912",
  pista:"curl -s a la ruta /actuator/prometheus del puerto 8080, y una tubería a grep.",
  why:"Fíjate en <code>uri=\"/api/tareas\"</code>: Spring pone la plantilla de la ruta, no la URL real. Si ves ids en esa etiqueta, tienes un problema de cardinalidad."},
 {t:"hueco", p:"Completa el código de Node que mide la duración de cada petición con la <b>ruta plantilla</b>",
  tpl:"const fin = duracion.___();\n// … atender …\nfin({ ruta: req.___.path, codigo: res.statusCode });",
  banco:["startTimer","route","url","observe","now","originalUrl"],
  sol:["startTimer","route"],
  why:"<code>req.url</code> incluiría ids y parámetros (<code>/pedidos/1042?x=1</code>); <code>req.route.path</code> es la plantilla (<code>/pedidos/:id</code>)."},
 {t:"par", p:"Empareja cada nombre de métrica con lo que mide",
  pares:[["http_server_requests_seconds","Duración de las peticiones HTTP"],["jvm_memory_used_bytes","Memoria usada por la JVM"],["pedidos_creados_total","Pedidos creados desde el arranque"],["hikaricp_connections_active","Conexiones activas del pool de base de datos"],["process_cpu_usage","Uso de CPU del proceso"]],
  why:"Actuator te da cientos de métricas gratis: HTTP, JVM, pool de conexiones, caché…"},
 {t:"opcion", p:"¿Qué etiqueta NO deberías poner en una métrica?",
  ops:["ruta con la plantilla (/pedidos/{id})","código de estado","id del usuario o del pedido","método HTTP"],
  ok:2, why:"Valores ilimitados crean millones de series (cardinalidad) y tumban Prometheus."},
 {t:"opcion", p:"Tu tienda no da ningún error 5xx, pero hace 30 minutos que no entra ningún pedido porque el botón de pagar está roto en el frontal. ¿Qué métrica lo habría detectado?",
  ops:["La CPU del backend","Una métrica de negocio: pedidos creados por minuto, comparada con lo normal a esa hora","La memoria de la JVM","up"],
  ok:1, why:"Las métricas técnicas no ven lo que no llega. Una alerta del tipo «pedidos por minuto 80 % por debajo de la misma hora la semana pasada» (con <code>offset 1w</code>) atrapa fallos silenciosos."},
 {t:"vf", p:"Es mejor medir la duración en milisegundos (<code>_ms</code>) porque los números son más legibles.",
  ok:false, why:"La convención de Prometheus es la unidad base: segundos, con decimales. Grafana ya formatea «250 ms» al pintar. Mezclar unidades entre servicios acaba en paneles con errores de 1.000×."}
]},

/* =============== U3 L5 =============== */
{
id:"ob3n2",
titulo:"Exporters, service discovery y relabeling",
claves:["Exporters para lo que no expone métricas: node_exporter, blackbox_exporter, exporters de bases de datos","Service discovery encuentra los objetivos (Kubernetes, nube, ficheros) y relabel_configs decide cuáles y con qué etiquetas","metric_relabel_configs actúa después del scrape, sobre cada serie: renombrar o descartar"],
pasos:[
 {t:"info", eti:"Lo que no habla Prometheus", h:"Exporters",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">exporters habituales</div><table class="dg-tabla"><thead><tr><th>Exporter</th><th>Puerto</th><th>Mide</th></tr></thead><tbody>
       <tr><td>node_exporter</td><td>9100</td><td>CPU, memoria, disco, red y sistema de ficheros de la máquina</td></tr>
       <tr><td>blackbox_exporter</td><td>9115</td><td>sondas de caja negra: HTTP, TCP, DNS, ICMP, caducidad de certificados</td></tr>
       <tr><td>postgres_exporter</td><td>9187</td><td>conexiones, transacciones, bloqueos, réplicas</td></tr>
       <tr><td>mysqld_exporter / redis_exporter</td><td>9104 / 9121</td><td>lo equivalente para MySQL y Redis</td></tr>
       <tr><td>JMX exporter</td><td>—</td><td>métricas JMX de Kafka, Cassandra o aplicaciones Java antiguas</td></tr>
     </tbody></table></div>
     <p>El <b>Pushgateway</b> es otra cosa: un sitio donde un trabajo por lotes (un CronJob de 30 s) deja su resultado para que Prometheus lo recoja. No sirve para convertir servicios normales en push: pierdes <code>up</code> y las métricas de una instancia muerta se quedan ahí para siempre.</p>`},
 {t:"info", eti:"Encontrar y etiquetar", h:"Service discovery y relabeling",
  c:`<div class="termbox">scrape_configs:
  - job_name: pods
    kubernetes_sd_configs:
      - role: pod                       # también: node, service, endpoints, endpointslice, ingress
    relabel_configs:                    # ANTES del scrape, sobre cada objetivo
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        regex: "true"
        action: keep                    # solo pods con la anotación
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
    metric_relabel_configs:             # DESPUÉS del scrape, sobre cada serie
      - source_labels: [__name__]
        regex: "go_gc_.*"
        action: drop</div>
     <p>El descubrimiento entrega cada objetivo con etiquetas <code>__meta_*</code> (namespace, anotaciones, etiquetas del pod, zona de la instancia EC2…). Con <code>relabel_configs</code> eliges qué objetivos se quedan y conviertes esos metadatos en etiquetas. Todo lo que empieza por <code>__</code> se descarta al terminar, salvo que lo copies. <code>__address__</code> y <code>__metrics_path__</code> deciden a dónde se hace el scrape.</p>`},
 {t:"orden", p:"Ordena lo que pasa desde que existe un pod hasta que sus series se guardan",
  items:["El service discovery de Kubernetes descubre el pod con sus etiquetas __meta_*","relabel_configs decide si se queda y le pone etiquetas","Prometheus hace el scrape a __address__ y __metrics_path__","metric_relabel_configs filtra o reescribe cada serie","Las muestras se guardan en la base de datos"],
  why:"La diferencia entre <code>relabel_configs</code> (objetivos) y <code>metric_relabel_configs</code> (series) es pregunta típica de entrevista."},
 {t:"par", p:"Empareja cada acción de relabeling con su efecto",
  pares:[["keep","Conserva solo los objetivos o series cuyas etiquetas cumplen la regex"],["drop","Descarta los que la cumplen"],["replace","Escribe en target_label un valor construido con la regex"],["labelmap","Copia varias etiquetas cambiando su nombre según un patrón"],["labeldrop","Elimina las etiquetas cuyo nombre cumple la regex"]],
  why:"<code>replace</code> es la acción por defecto: si no escribes <code>action</code>, se hace un replace."},
 {t:"opcion", p:"Quieres dejar de guardar la métrica <code>http_client_requests_seconds_bucket</code>, que nadie usa y ocupa 200.000 series. ¿Dónde lo haces?",
  ops:["En relabel_configs con action: drop sobre __name__","En metric_relabel_configs con action: drop sobre __name__","En Grafana","Bajando el scrape_interval"],
  ok:1, why:"<code>relabel_configs</code> actúa sobre objetivos, antes del scrape: ahí aún no existen las series. Los nombres de métrica solo se ven en <code>metric_relabel_configs</code>."},
 {t:"term", p:"Tienes blackbox_exporter sondeando tus webs públicas. Escribe la consulta que muestra las sondas que están fallando",
  prompt:"PromQL ›",
  sol:["probe_success == 0","probe_success==0","probe_success < 1","probe_success{job=\"blackbox\"} == 0"],
  salida:"probe_success{instance=\"https://catappa.dev/salud\", job=\"blackbox\"}   0",
  pista:"La métrica que exporta blackbox es probe_success: 1 si la sonda fue bien.",
  why:"Otra muy útil del mismo exporter: <code>probe_ssl_earliest_cert_expiry - time() &lt; 14 * 86400</code>, que avisa de certificados que caducan en menos de 14 días."},
 {t:"vf", p:"El Pushgateway es la forma recomendada de enviar métricas desde microservicios que están detrás de un cortafuegos.",
  ok:false, why:"Está pensado solo para trabajos por lotes de vida corta. Para servicios, la alternativa correcta es poner un Prometheus en modo agente o un Collector de OpenTelemetry cerca de ellos y enviar con <code>remote_write</code> u OTLP."},
 {t:"escribe", p:"¿Qué exporter oficial instalarías en cada máquina Linux para tener CPU, memoria, disco y red?",
  sol:["node_exporter","node exporter","node-exporter","prometheus-node-exporter"],
  pista:"Se llama como un nodo.",
  why:"En Kubernetes va como DaemonSet (uno por nodo); en máquinas sueltas, como servicio de systemd. Sus métricas empiezan por <code>node_</code>."}
]}

]});
