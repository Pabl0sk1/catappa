window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Métricas con Prometheus",
resumen: "El modelo de datos de Prometheus, tipos de métricas, recolección por scrape, exporters, etiquetas y cardinalidad",
nivel: "Fundamentos",
color: "#e46a6a",
lecciones: [

{
id:"ob2l1",
titulo:"Cómo funciona Prometheus",
claves:["Prometheus recoge métricas haciendo scrape (HTTP) a /metrics de cada objetivo","Serie temporal = nombre de métrica + etiquetas; valores con marca de tiempo","Exporters exponen métricas de sistemas que no las tienen (node_exporter, postgres_exporter)"],
pasos:[
 {t:"info", eti:"Recoger", h:"El modelo pull",
  c:`<div class="diag">Prometheus --cada 15 s, GET /metrics--&gt; tu API (Actuator/Micrometer)
           --cada 15 s, GET /metrics--&gt; node_exporter (CPU, disco, red del nodo)
           --cada 15 s, GET /metrics--&gt; postgres_exporter
guarda series temporales en su base de datos local
&lt;-- consultas PromQL desde Grafana y reglas de alerta</div>
     <div class="termbox"># lo que devuelve /metrics (formato de texto)
http_server_requests_seconds_count{method="GET",uri="/api/tareas",status="200"} 18231
http_server_requests_seconds_sum{method="GET",uri="/api/tareas",status="200"} 912.4
jvm_memory_used_bytes{area="heap"} 2.1e+08</div>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["Scrape","Prometheus pide periódicamente las métricas a cada objetivo"],["/metrics","Endpoint donde la aplicación expone sus métricas"],["Exporter","Traduce métricas de un sistema al formato de Prometheus"],["Service discovery","Encontrar objetivos automáticamente (por ejemplo, pods de Kubernetes)"],["Pushgateway","Para trabajos cortos que no viven lo suficiente para ser consultados"]],
  why:"En Kubernetes, el Prometheus Operator descubre objetivos con ServiceMonitor."},
 {t:"vf", p:"Por defecto, las aplicaciones envían (push) sus métricas a Prometheus.",
  ok:false, why:"Prometheus va a buscarlas (pull). Así sabe además si un objetivo está caído (up == 0)."}
]},

{
id:"ob2l2",
titulo:"Tipos de métricas y etiquetas",
claves:["Counter solo sube (peticiones, errores); gauge sube y baja (memoria, cola)","Histogram cuenta observaciones en cubetas para calcular percentiles","Etiquetas multiplican las series: cuidado con la cardinalidad (nada de ids de usuario)"],
pasos:[
 {t:"info", eti:"Tipos", h:"Counter, gauge e histogram",
  c:`<div class="termbox">// Micrometer en Spring
Counter.builder("pedidos_creados_total").tag("canal", "web").register(registry).increment();
Gauge.builder("cola_pendientes", cola, Queue::size).register(registry);
Timer.builder("pago_duracion").publishPercentileHistogram().register(registry)
     .record(() -&gt; pasarela.cobrar(pedido));</div>
     <div class="diag">counter    pedidos_creados_total        solo sube (se reinicia al reiniciar el proceso)
gauge      cola_pendientes              valor actual, sube y baja
histogram  pago_duracion_seconds_bucket cuantas observaciones cayeron en cada cubeta:
           {le="0.1"} 900  {le="0.5"} 980  {le="1"} 995  {le="+Inf"} 1000</div>`},
 {t:"par", p:"Empareja cada métrica con su tipo adecuado",
  pares:[["Número total de peticiones atendidas","Counter"],["Memoria usada ahora mismo","Gauge"],["Distribución de tiempos de respuesta","Histogram"],["Mensajes pendientes en una cola","Gauge (valor actual)"],["Errores de pago acumulados","Counter (total)"]],
  why:"Nunca calcules tasas a partir de un gauge que en realidad es un contador."},
 {t:"info", eti:"El error caro", h:"Cardinalidad",
  c:`<p>Cada combinación distinta de etiquetas es una serie nueva. Con <code>method</code> (5 valores) × <code>uri</code> (40) × <code>status</code> (8) ya tienes 1.600 series por métrica. Si añades <code>usuario_id</code> con un millón de usuarios, tendrás mil millones de series y Prometheus se quedará sin memoria.</p>
     <p>Regla: etiquetas con pocos valores posibles (método, ruta plantilla, código). Nada de ids, emails ni URLs con parámetros.</p>`},
 {t:"opcion", p:"¿Cuál de estas etiquetas es un problema para Prometheus?",
  ops:["method=\"GET\"","status=\"500\"","user_id=\"839274\"","uri=\"/api/pedidos/{id}\""],
  ok:2, why:"Cardinalidad sin límite. Para detalles por usuario están los logs y las trazas."}
]},

{
id:"ob2l3",
titulo:"Instrumentar Spring Boot y Node",
claves:["Spring Boot: Actuator + Micrometer exponen /actuator/prometheus","Node: prom-client con métricas por defecto y propias","Nombres con unidades y sufijos: _seconds, _bytes, _total"],
pasos:[
 {t:"info", eti:"Métricas desde tu código", h:"Micrometer y prom-client",
  c:`<div class="termbox"># Spring Boot: dependencias actuator + micrometer-registry-prometheus
management.endpoints.web.exposure.include: health,prometheus

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
  help: "Duracion", labelNames: ["ruta", "codigo"] });</div>`},
 {t:"par", p:"Empareja cada nombre de métrica con lo que mide",
  pares:[["http_server_requests_seconds","Duración de las peticiones HTTP"],["jvm_memory_used_bytes","Memoria usada por la JVM"],["pedidos_creados_total","Pedidos creados desde el arranque"],["hikaricp_connections_active","Conexiones activas del pool de base de datos"],["process_cpu_usage","Uso de CPU del proceso"]],
  why:"Actuator te da cientos de métricas gratis: HTTP, JVM, pool de conexiones, caché..."},
 {t:"opcion", p:"¿Qué etiqueta NO deberías poner en una métrica?",
  ops:["ruta con la plantilla (/pedidos/{id})","codigo de estado","id del usuario o del pedido","método HTTP"],
  ok:2, why:"Valores ilimitados crean millones de series (cardinalidad) y tumban Prometheus."}
]}

]});
