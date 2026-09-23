window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Maestría: investigar, diseñar y defenderlo",
resumen: "Investigar un incidente de la métrica a la causa, diseñar la observabilidad de una plataforma, los errores de producción clásicos y un simulacro de entrevista",
nivel: "Maestro",
color: "#c24a4a",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"ob6l1",
titulo:"Del síntoma a la causa",
claves:["Empieza por los síntomas (RED) y acota por dimensiones: endpoint, réplica, zona, versión, cliente","Compara con lo normal (offset 1w) y pregunta qué cambió: despliegues, configuración, tráfico, dependencias","Salta de la métrica a una traza de ejemplo y de la traza a sus logs; mitiga antes de entender del todo"],
pasos:[
 {t:"info", eti:"Método", h:"Acotar, comparar, saltar",
  c:`<p>Investigar no es mirar paneles al azar: es reducir el espacio de búsqueda con cada consulta.</p>
     <ol><li><b>Confirmar el síntoma</b> y su tamaño: qué porcentaje de peticiones, desde cuándo, cuánto presupuesto se gasta.</li>
     <li><b>Acotar por dimensiones</b>: ¿todos los endpoints o uno?, ¿todas las réplicas o las de un nodo?, ¿una zona?, ¿una versión?, ¿un cliente? Cada <code>sum by (…)</code> descarta hipótesis.</li>
     <li><b>Comparar con lo normal</b>: <code>offset 1w</code> dice si el tráfico es el de siempre; las anotaciones, si hubo despliegue.</li>
     <li><b>Saltar</b> a trazas de ejemplo del grupo afectado y, de ahí, a sus logs.</li>
     <li><b>Mitigar</b> en cuanto haya una acción razonable; la causa raíz, después.</li></ol>
     <div class="nota ojo"><b class="tit">La trampa</b>Encariñarse con la primera hipótesis. Si «es la base de datos» no explica por qué solo fallan los pods de un nodo, no es (solo) la base de datos.</div>`},
 {t:"orden", p:"Ordena la investigación de «la API va lenta desde las 10:05»",
  items:["Confirmar el síntoma en el panel: p99 de latencia y errores","Acotar: qué endpoints, qué réplicas, qué clientes","Buscar qué cambió a las 10:05 (despliegue, configuración, tráfico)","Abrir trazas lentas de ejemplo y ver qué span consume el tiempo","Leer los logs de ese servicio en esa traza","Mitigar (rollback) y después corregir la causa"],
  why:"Los exemplars de Prometheus enlazan un punto de la gráfica con una traza concreta: el paso 4 puede ser un clic."},
 {t:"term", p:"Caso: el p99 del job <code>pedidos</code> ha subido. Calcula el p99 <b>por pod</b> (métrica <code>http_server_requests_seconds_bucket</code>, ventana de 5 minutos) para ver si afecta a todas las réplicas",
  prompt:"PromQL ›",
  sol:['histogram_quantile(0.99, sum by (le, pod) (rate(http_server_requests_seconds_bucket{job="pedidos"}[5m])))','histogram_quantile(0.99, sum by (pod, le) (rate(http_server_requests_seconds_bucket{job="pedidos"}[5m])))','histogram_quantile(0.99, sum(rate(http_server_requests_seconds_bucket{job="pedidos"}[5m])) by (le, pod))','histogram_quantile(0.99, sum(rate(http_server_requests_seconds_bucket{job="pedidos"}[5m])) by (pod, le))'],
  salida:"{pod=\"pedidos-5c4b2-7xk2p\"}   0.180\n{pod=\"pedidos-5c4b2-m9q4d\"}   0.175\n{pod=\"pedidos-5c4b2-t2v8s\"}   2.410\n{pod=\"pedidos-5c4b2-zz81c\"}   2.380",
  pista:"El p99 de siempre, con pod junto a le en el sum by, y el filtro job=\"pedidos\".",
  why:"Dos réplicas van bien y dos van mal: no es el código (es el mismo en todas). Siguiente pregunta: ¿qué tienen en común las dos lentas? Con <code>kube_pod_info</code> ves que ambas están en <code>nodo-3</code>."},
 {t:"term", p:"Comprueba si el tráfico de <code>pedidos</code> es anormal: divide la tasa de peticiones actual (5 minutos) entre la de hace una semana a la misma hora",
  prompt:"PromQL ›",
  sol:['sum(rate(http_server_requests_seconds_count{job="pedidos"}[5m])) / sum(rate(http_server_requests_seconds_count{job="pedidos"}[5m] offset 1w))','sum(rate(http_server_requests_seconds_count{job="pedidos"}[5m]))/sum(rate(http_server_requests_seconds_count{job="pedidos"}[5m] offset 1w))','sum(rate(http_server_requests_seconds_count{job="pedidos"}[5m])) / sum(rate(http_server_requests_seconds_count{job="pedidos"}[5m] offset 7d))'],
  salida:"{}   1.04",
  pista:"La misma suma de rate arriba y abajo; abajo con offset 1w dentro del selector.",
  why:"1,04: el tráfico es el normal. Descartas «nos ha llegado el triple de gente» y te centras en el nodo. Allí, <code>node_disk_io_time_seconds_total</code> muestra el disco saturado por un proceso de copia de seguridad."},
 {t:"term", p:"Para confirmarlo con trazas, busca en Tempo los spans del servicio <code>pedidos</code> que tardan más de 1 segundo",
  prompt:"TraceQL ›",
  sol:['{ resource.service.name = "pedidos" && duration > 1s }','{resource.service.name="pedidos" && duration>1s}','{ duration > 1s && resource.service.name = "pedidos" }','{ resource.service.name = "pedidos" && duration > 1000ms }'],
  salida:"Trace 4bf92f…  pedidos  GET /api/pedidos/{id}  2.4s  k8s.node.name=nodo-3\nTrace 9c02ad…  pedidos  GET /api/pedidos       2.1s  k8s.node.name=nodo-3",
  pista:"Llaves, el atributo de recurso service.name y el intrínseco duration.",
  why:"El atributo <code>k8s.node.name</code> (lo añade el procesador <code>k8sattributes</code> del Collector) confirma la hipótesis. Mitigación: acordonar y drenar <code>nodo-3</code>; causa: la copia de seguridad en horario de tráfico."},
 {t:"opcion", p:"La latencia subió justo tras un despliegue y las trazas muestran un span de base de datos de 2 s que antes tardaba 5 ms. ¿Qué haces primero?",
  ops:["Reiniciar la base de datos","Hacer rollback para mitigar y después revisar la consulta nueva (plan de ejecución, índice que falta o N+1)","Subir el tamaño de las máquinas","Esperar"],
  ok:1, why:"Mitigar primero, causa raíz después. El plan de ejecución (<code>EXPLAIN ANALYZE</code>) de la consulta nueva suele dar la respuesta en minutos."},
 {t:"par", p:"Empareja cada pregunta con la señal que mejor la responde",
  pares:[["¿Cuántos usuarios están afectados?","Métricas de errores y latencia"],["¿En qué servicio se va el tiempo?","Trazas"],["¿Qué error exacto dio este pedido?","Logs con el traceId"],["¿Qué función consume la CPU?","Perfiles (profiling continuo)"],["¿Coincide con un cambio?","Anotaciones de despliegue"]],
  why:"Las señales conectadas por el traceId y por los mismos atributos de recurso son la clave."},
 {t:"opcion", p:"Los errores 5xx solo afectan a peticiones de la app móvil versión 4.2, y no tienes la versión del cliente en ninguna métrica. ¿Dónde lo habrías visto?",
  ops:["En ningún sitio: no se puede saber","En trazas o logs estructurados con el atributo de versión del cliente (de la cabecera User-Agent), filtrando por él","Añadiendo la versión como etiqueta de Prometheus durante el incidente","En el panel de CPU"],
  ok:1, why:"Es el ejemplo típico de pregunta imprevista: la respuesta está en datos con muchas dimensiones (eventos, trazas), no en métricas preagregadas."}
]},

/* =============== U9 L2 =============== */
{
id:"ob9n1",
titulo:"Caso: diseñar la observabilidad de una plataforma",
claves:["Estándares primero: OpenTelemetry, atributos de recurso comunes, etiquetas de dueño y SLOs por servicio","Estimar volúmenes (series, GB de logs, spans por segundo) antes de elegir herramientas y presupuesto","Comprar o construir: equipo disponible, coste, residencia de datos; OpenTelemetry reduce la dependencia del proveedor"],
pasos:[
 {t:"info", eti:"El enunciado", h:"Una plataforma de 60 microservicios",
  c:`<p>Te piden diseñar la observabilidad de una empresa con <b>60 microservicios</b> en <b>3 clústeres de Kubernetes</b>, 2.000 peticiones por segundo en hora punta, un equipo de plataforma de 4 personas y datos de clientes europeos.</p>
     <div class="dg"><div class="dg-tit">una propuesta razonable</div>
       <div class="dg-vert">
         <div class="dg-caja base">apps con SDK o agente de OpenTelemetry<small>service.name, service.version, deployment.environment.name, equipo</small></div>
         <div class="dg-caja">Collector agente por nodo<small>k8sattributes, filelog para los logs de stdout</small></div>
         <div class="dg-caja acento doble">Collector pasarela por clúster<small>memory_limiter, tail sampling, spanmetrics, enmascarado de datos</small></div>
         <div class="dg-fila"><div class="dg-caja ok">Mimir<small>métricas</small></div><div class="dg-caja ok">Loki<small>logs</small></div><div class="dg-caja ok">Tempo<small>trazas</small></div><div class="dg-caja ok">Pyroscope<small>perfiles</small></div></div>
         <div class="dg-caja">Grafana, SLOs generados con Sloth o Pyrra, Alertmanager, todo en Git</div>
       </div>
     </div>`},
 {t:"info", eti:"Echar la cuenta", h:"Volúmenes y decisiones",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">estimación de volúmenes</div><table class="dg-tabla"><thead><tr><th>Señal</th><th>Cálculo</th><th>Resultado</th></tr></thead><tbody>
       <tr><td>Series activas</td><td>60 servicios × 10 pods × 2.000 series + infraestructura</td><td>≈ 1,5 millones</td></tr>
       <tr><td>Logs</td><td>2.000 pet/s × 2 líneas × 500 bytes × 86.400 s</td><td>≈ 173 GB al día</td></tr>
       <tr><td>Spans</td><td>2.000 pet/s × 25 spans</td><td>50.000 spans/s antes de muestrear</td></tr>
       <tr><td>Spans guardados</td><td>tail sampling: errores, lentas y 5 % del resto</td><td>≈ 3.000 spans/s</td></tr>
     </tbody></table></div>
     <ul><li><b>Comprar</b> (Grafana Cloud, Datadog, Honeycomb, New Relic…): operación cero y funcionalidades, a cambio de factura variable y datos fuera. Con 4 personas en plataforma, a menudo es lo sensato.</li>
     <li><b>Construir</b> (la pila abierta): coste predecible y control, a cambio de operar Mimir, Loki y Tempo con sus actualizaciones.</li>
     <li>Con OpenTelemetry en las aplicaciones, cambiar de un lado a otro es cambiar exportadores del Collector, no tocar 60 servicios.</li>
     <li>Lo que no se negocia: <b>dueño</b> de cada servicio en sus metadatos, <b>SLO</b> por servicio de cara al usuario, <b>retención</b> por tipo de dato y <b>presupuesto</b> de observabilidad con reparto por equipo.</li></ul>`},
 {t:"orden", p:"Ordena la implantación en una plataforma que hoy no tiene nada",
  items:["Acordar estándares: OpenTelemetry, atributos de recurso y etiquetas comunes","Métricas RED de todos los servicios y paneles homogéneos","Logs estructurados centralizados con trace_id","Trazas distribuidas con propagación de contexto y muestreo","SLOs por servicio y alertas por burn rate que sustituyen a las alertas de causas","Profiling continuo y optimización de costes"],
  why:"Primero lo que da más valor con menos esfuerzo y hace posible lo siguiente: sin atributos comunes, nada se correlaciona; sin RED, no hay SLOs."},
 {t:"escribe", p:"Un sistema recibe 1.000 peticiones por segundo y escribe 3 líneas de log de 400 bytes por petición. ¿Cuántos GB de logs genera al día (en GB de 10⁹ bytes, con un decimal)?",
  sol:["103.7","103,7","103.7 GB","103,7 GB","103.68","103,68","104"],
  pista:"1.000 × 3 × 400 bytes por segundo, por 86.400 segundos.",
  why:"1,2 MB/s × 86.400 = 103,68 GB al día, antes de comprimir y sin réplicas. Hacer esta cuenta en voz alta en una entrevista de diseño da mucha credibilidad."},
 {t:"opcion", p:"Una startup de 8 ingenieros, sin equipo de plataforma, quiere observabilidad completa ya. ¿Qué recomiendas?",
  ops:["Montar Mimir, Loki, Tempo y Pyroscope en alta disponibilidad","Un servicio gestionado, instrumentando con OpenTelemetry para poder cambiar después, con límites de volumen y muestreo desde el primer día","No tener observabilidad hasta tener más gente","Solo logs en ficheros"],
  ok:1, why:"Operar la pila completa necesita personas dedicadas. Lo gestionado cuesta dinero, pero menos que el tiempo del equipo; OpenTelemetry mantiene la puerta abierta."},
 {t:"par", p:"Empareja cada decisión con su motivo",
  pares:[["Atributo de dueño (equipo) en todas las señales","Saber a quién avisar y a quién repartir el coste"],["Collector pasarela por clúster","Muestreo por cola y enmascarado centralizados"],["SLOs por servicio de cara al usuario","Alertas por síntomas y conversaciones de prioridades con datos"],["Paneles y alertas en Git","Revisión, historia y reproducibilidad"],["Retención distinta por tipo de dato","Coste acorde al valor y cumplimiento legal"]],
  why:"En una entrevista de diseño, cada pieza debe venir con su porqué y con su coste."},
 {t:"vf", p:"Instrumentar con el SDK propietario de un proveedor da el mismo grado de libertad para cambiar de herramienta que hacerlo con OpenTelemetry.",
  ok:false, why:"Con un SDK propietario, cambiar de proveedor obliga a reinstrumentar cada servicio. Con OpenTelemetry, el cambio se hace en el Collector. Casi todos los proveedores aceptan OTLP."},
 {t:"opcion", p:"Los datos incluyen información de clientes europeos. ¿Qué afecta al diseño?",
  ops:["Nada, la observabilidad no tiene datos personales","La residencia de los datos (región del proveedor o del almacenamiento), el enmascarado de datos personales en el Collector y retenciones acordes al RGPD","Solo el color de los paneles","Que no se pueden usar trazas"],
  ok:1, why:"Logs y atributos de trazas acaban llevando emails, IPs o ids. Se minimizan en origen y se enmascaran en el Collector antes de salir del clúster."}
]},

/* =============== U9 L3 =============== */
{
id:"ob9n2",
titulo:"Errores de producción clásicos",
claves:["Alertas que no pueden saltar: ventanas demasiado cortas, métricas que desaparecen, reglas que nadie probó","Datos que mienten: medias, percentiles promediados, sum antes de rate, cubetas que no cubren el SLO","Plataforma frágil: explosión de cardinalidad, vigilante sin vigilar, datos personales en logs y atributos"],
pasos:[
 {t:"info", eti:"Aprender de otros", h:"El catálogo de fallos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">errores que se ven en producción</div><table class="dg-tabla"><thead><tr><th>Error</th><th>Síntoma</th><th>Arreglo</th></tr></thead><tbody>
       <tr><td>Ventana de rate más corta que dos scrapes</td><td>la alerta no salta nunca o el panel tiene huecos</td><td>ventana ≥ 4 × scrape_interval</td></tr>
       <tr><td>La métrica desaparece</td><td>tras renombrarla una actualización de librería, las alertas ya no evalúan nada</td><td>alertas con <code>absent()</code> y pruebas de reglas</td></tr>
       <tr><td>Etiqueta con ids</td><td>memoria de Prometheus disparada</td><td><code>sample_limit</code>, revisión de métricas, drop</td></tr>
       <tr><td>Nadie vigila al vigilante</td><td>Prometheus caído una semana sin que nadie lo sepa</td><td>Watchdog y sonda externa</td></tr>
       <tr><td>Muestreo a ciegas</td><td>no hay trazas de los errores</td><td>tail sampling</td></tr>
       <tr><td>Relojes desincronizados</td><td>logs de dos servicios en orden imposible</td><td>NTP/chrony en los nodos; ordenar por traza, no por hora</td></tr>
       <tr><td>DEBUG olvidado en producción</td><td>factura de logs multiplicada</td><td>nivel por configuración y alerta sobre el volumen de ingesta</td></tr>
       <tr><td>Datos personales en logs</td><td>incumplimiento legal</td><td>enmascarado en el agente o el Collector</td></tr>
     </tbody></table></div>`},
 {t:"info", eti:"El caso de la alerta muda", h:"Cuando lo peor es el silencio",
  c:`<p>Actualizas Spring Boot y la métrica <code>http_server_requests_seconds_count</code> sigue existiendo, pero la etiqueta <code>status</code> se llama distinto en tu nueva configuración, o pasas de las convenciones antiguas de OpenTelemetry (<code>http.status_code</code>) a las estables (<code>http.response.status_code</code>). La expresión de tu alerta devuelve <b>vacío</b>: no dispara, no da error, y nadie se entera hasta el incidente.</p>
     <div class="termbox"># defensa 1: avisar si la serie que alimenta la alerta desaparece
- alert: MetricaSLOAusente
  expr: absent(http_server_requests_seconds_count{job="pagos"})
  for: 15m

# defensa 2: pruebas de reglas en el CI (promtool test rules)
# defensa 3: revisar en cada actualización de librerías las notas sobre métricas</div>`},
 {t:"term", p:"Escribe la expresión que devuelve un valor si <b>no existe</b> ninguna serie <code>up</code> con <code>job=\"pagos\"</code>",
  prompt:"PromQL ›",
  sol:['absent(up{job="pagos"})','absent(up{job="pagos"}) == 1','absent_over_time(up{job="pagos"}[5m])'],
  salida:"{job=\"pagos\"}   1",
  pista:"La función que devuelve 1 cuando el selector no encuentra nada.",
  why:"Si el job desaparece (un cambio en el ServiceMonitor, un namespace renombrado), <code>up == 0</code> no dispara porque no hay serie que valga 0. <code>absent</code> cubre ese hueco."},
 {t:"opcion", p:"Una alerta usa <code>rate(pagos_fallidos_total[1m]) &gt; 0.5</code> y el scrape es cada 60 s. Nunca ha saltado, ni siquiera en el último incidente. ¿Por qué?",
  ops:["Porque el umbral es alto","Porque en una ventana de 1 minuto con scrape de 60 s casi nunca hay dos muestras: rate devuelve vacío y la alerta no evalúa nada","Porque falta for","Porque rate no funciona con contadores de pagos"],
  ok:1, why:"Ventana mínima razonable: 4 veces el intervalo (<code>[4m]</code> o <code>[5m]</code>). Y prueba la alerta con <code>promtool test rules</code>: habría salido vacía."},
 {t:"par", p:"Empareja cada error con su consecuencia",
  pares:[["Promediar los p99 de las réplicas","Un percentil que no corresponde a ninguna distribución real"],["sum antes de rate","Reinicios falsos cuando un proceso reinicia su contador"],["Cubetas que no incluyen el umbral del SLO","SLI de latencia estimado por interpolación"],["Alerta sin for","Páginas por picos de segundos"],["Silencio sin fecha de fin","Una alerta importante que no vuelve a sonar"]],
  why:"Casi todos estos se detectan en revisión de código de reglas y paneles: por eso van en Git con revisión obligatoria."},
 {t:"vf", p:"Si Prometheus se cae, Alertmanager avisará de que no recibe alertas.",
  ok:false, why:"Alertmanager no sabe distinguir «no hay alertas» de «nadie me envía alertas». Por eso existe el Watchdog (una alerta siempre disparada, vigilada por un servicio externo) o sondas externas sobre Prometheus."},
 {t:"opcion", p:"En Loki, los logs de <code>api</code> y <code>pagos</code> de una misma petición aparecen en un orden imposible: la respuesta antes que la petición. ¿Qué es lo más probable?",
  ops:["Un error de Loki","Los relojes de los nodos están desincronizados; conviene revisar NTP/chrony y reconstruir el orden con la traza","Que la petición fue muy rápida","Que falta un índice"],
  ok:1, why:"Unos cientos de milisegundos de desfase bastan. La traza ordena por relación padre-hijo, no solo por marca de tiempo, y es más fiable para reconstruir la secuencia."},
 {t:"opcion", p:"Una auditoría encuentra emails y números de teléfono en los atributos de las trazas. ¿Qué arreglo es más completo?",
  ops:["Borrar Tempo","Dejar de capturar esos atributos en origen, enmascararlos en el Collector (procesadores attributes/transform/redaction) y revisar la retención de lo ya guardado","Hacer el bucket privado","Bajar el muestreo al 1 %"],
  ok:1, why:"Defensa en profundidad: minimizar en la aplicación, enmascarar en el Collector por si algo se escapa, y limpiar lo existente según la política de retención."}
]},

/* =============== U9 L4 =============== */
{
id:"ob6l2",
titulo:"Simulacro de entrevista de observabilidad",
claves:["Sabes qué medir y cómo (RED, USE, percentiles, cardinalidad)","Dominas Prometheus, PromQL, Alertmanager, Grafana, Loki, OpenTelemetry y Tempo","Diseñas SLOs y alertas por burn rate, operas guardias e incidentes, y controlas costes"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir. En una entrevista real, cada respuesta va con un ejemplo de algo que te haya pasado y con el porqué.</p>`},
 {t:"opcion", p:"«¿Qué diferencia hay entre monitorización y observabilidad?»",
  ops:["Ninguna","Monitorizar es vigilar lo conocido con paneles y alertas; observabilidad es poder investigar preguntas nuevas combinando métricas, logs y trazas","Observabilidad es solo logs","Monitorizar es más moderno"],
  ok:1, why:"Añade un ejemplo de pregunta imprevista: «¿solo falla para la app 4.2 en Android?»."},
 {t:"opcion", p:"«¿Qué métricas pondrías a una API nueva?»",
  ops:["Solo CPU","RED por endpoint (tasa, errores, latencia en percentiles con histogramas), saturación del pool de conexiones e hilos, y métricas de negocio como pedidos creados","Número de líneas de código","Ninguna"],
  ok:1, why:"Con Spring Boot, Actuator y Micrometer dan casi todas gratis; las de negocio se añaden a mano."},
 {t:"opcion", p:"«¿Qué es la cardinalidad y por qué importa?»",
  ops:["El número de servidores","El número de combinaciones distintas de etiquetas (series); si crece sin límite, dispara la memoria y el coste del sistema de métricas","El tamaño de los logs","La latencia"],
  ok:1, why:"El ejemplo clásico: poner el id de usuario como etiqueta. Y el remate: esa dimensión va en logs o trazas."},
 {t:"opcion", p:"«¿Histograma o summary para la latencia de un servicio con 20 réplicas?»",
  ops:["Summary, porque ya trae los percentiles","Histograma: sus cubetas se suman entre réplicas y el percentil se calcula al consultar; los percentiles de un summary no se pueden agregar","Da igual","Un gauge con la media"],
  ok:1, why:"Menciona también elegir cubetas alrededor del SLO o usar histogramas nativos."},
 {t:"opcion", p:"«¿Por qué rate y no irate en una alerta?»",
  ops:["irate no existe","rate promedia toda la ventana y es estable; irate usa solo las dos últimas muestras y salta con cualquier pico","irate es más lento","rate no admite contadores"],
  ok:1, why:"irate sirve para ver picos en paneles con mucho zoom; para alertar quieres estabilidad."},
 {t:"opcion", p:"«¿Cómo diseñarías las alertas de un servicio?»",
  ops:["Una alerta por cada métrica","Definir SLOs, alertar por burn rate en varias ventanas, que cada alerta sea accionable y tenga runbook, y dejar las causas en paneles o avisos no urgentes","Alertar por CPU","Sin alertas"],
  ok:1, why:"Es la respuesta de alguien que ha hecho guardias. Remata con el Watchdog: quién avisa si falla el sistema de alertas."},
 {t:"opcion", p:"«¿Head sampling o tail sampling?»",
  ops:["Siempre head, es gratis","Head es barato pero decide a ciegas; tail decide con la traza completa (guarda errores y lentas) a cambio de memoria en el Collector y de enrutar por trace-id","Siempre tail en el SDK","Ninguno: se guarda todo siempre"],
  ok:1, why:"La respuesta madura combina los dos: head alto en las apps y tail en la pasarela, con spanmetrics calculado antes de muestrear."},
 {t:"escribe", p:"«Con un SLO del 99,95 % mensual (30 días), ¿cuántos minutos de caída total te puedes permitir?» (un decimal)",
  sol:["21.6","21,6","21.6 minutos","21,6 minutos","21.6 min","21,6 min"],
  pista:"43.200 minutos × 0,0005.",
  why:"21,6 minutos. Tener estas cifras a mano (43 min para tres nueves, 4 min para cuatro) muestra que has vivido con SLOs."},
 {t:"opcion", p:"«La factura de observabilidad se ha duplicado en un trimestre. ¿Por dónde empiezas?»",
  ops:["Borrar todos los paneles","Medir qué crece y quién lo genera (series por métrica, GB de logs por servicio, spans por servicio), y atacar lo que no aporta: métricas sin uso, logs de salud y DEBUG, muestreo de trazas","Bajar la retención de todo a un día","Cambiar de proveedor sin analizar"],
  ok:1, why:"Primero datos y reparto por equipo; luego palancas por señal. Recortar a ciegas suele quitar justo lo que hará falta en el próximo incidente."},
 {t:"opcion", p:"«Cuéntame cómo sería un buen postmortem.»",
  ops:["Un documento que identifica quién se equivocó","Sin culpas: impacto, cronología, factores contribuyentes, qué fue bien y mal, y acciones de prevenir, detectar y mitigar con responsable y fecha, revisadas hasta cerrarlas","Un correo al cliente","Una lista de bugs"],
  ok:1, why:"Añade un ejemplo con una acción de detección (una alerta que faltaba) y cómo se comprobó que se cerró."},
 {t:"info", eti:"Terminado", h:"Has completado Observabilidad",
  c:`<p>Dominas qué medir y por qué, Prometheus por dentro y PromQL de verdad, Alertmanager y paneles útiles, logs estructurados con Loki y Elasticsearch, trazas con OpenTelemetry y Tempo, correlación y profiling, SLOs con burn rate, guardias, incidentes, postmortems y costes.</p>
     <p>Para consolidarlo: levanta con Docker Compose tu API, Prometheus, Alertmanager, Grafana, Loki y Tempo con el Collector de OpenTelemetry; crea un panel RED, un SLO con alertas por burn rate multiventana y provoca un fallo para investigarlo de la métrica a la traza y al log. Después escribe su postmortem.</p>`}
]}

]});
