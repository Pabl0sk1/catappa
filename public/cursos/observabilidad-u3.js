window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "PromQL y Grafana",
resumen: "Consultar métricas con PromQL: rate, sum by, percentiles con histogram_quantile; paneles en Grafana y reglas de grabación",
nivel: "Intermedio",
color: "#da5f5f",
lecciones: [

{
id:"ob3l1",
titulo:"Consultas PromQL",
claves:["rate() convierte un contador en tasa por segundo","sum by (etiqueta) agrega series manteniendo esa etiqueta","histogram_quantile calcula percentiles a partir de un histograma"],
pasos:[
 {t:"info", eti:"Preguntar a las métricas", h:"Las consultas que más usarás",
  c:`<div class="termbox"># peticiones por segundo por endpoint (ultimos 5 minutos)
sum by (uri) (rate(http_server_requests_seconds_count[5m]))

# porcentaje de errores 5xx
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
  / sum(rate(http_server_requests_seconds_count[5m]))

# p99 de latencia por endpoint
histogram_quantile(0.99,
  sum by (le, uri) (rate(http_server_requests_seconds_bucket[5m])))

# objetivos caidos
up == 0

# pedidos creados en las ultimas 24 h
increase(pedidos_creados_total[24h])</div>`},
 {t:"par", p:"Empareja cada función de PromQL con su uso",
  pares:[["rate(x[5m])","Tasa por segundo de un contador"],["increase(x[1h])","Cuánto creció un contador en ese periodo"],["sum by (uri)","Sumar series agrupando por uri"],["histogram_quantile(0.95, ...)","Percentil 95 a partir de las cubetas"],["x{status=~\"5..\"}","Filtrar series con una expresión regular"]],
  why:"rate sobre un contador es la base de casi todas las consultas útiles."},
 {t:"opcion", p:"¿Por qué no se grafica directamente <code>http_server_requests_seconds_count</code>?",
  ops:["Porque es un gauge","Porque es un contador acumulado que solo crece; lo útil es su tasa con rate()","Porque no tiene etiquetas","Porque es texto"],
  ok:1, why:"El valor absoluto depende de cuándo arrancó el proceso."},
 {t:"vf", p:"Para calcular un percentil entre varias réplicas hay que sumar las cubetas (le) antes de aplicar histogram_quantile.",
  ok:true, why:"Los percentiles no se pueden promediar entre réplicas; las cubetas sí se pueden sumar."}
]},

{
id:"ob3l2",
titulo:"Paneles con Grafana",
claves:["Grafana visualiza métricas, logs y trazas de muchas fuentes","Un buen panel responde a preguntas: ¿funciona?, ¿desde cuándo no?, ¿dónde?","Variables para filtrar por servicio o entorno; paneles como código"],
pasos:[
 {t:"info", eti:"Visualizar", h:"Un panel útil",
  c:`<p>Un panel de servicio típico, de arriba abajo:</p>
     <ol><li>Tráfico, tasa de errores y p99 de latencia (RED), con las líneas de los SLO.</li>
     <li>Los mismos datos por endpoint.</li>
     <li>Saturación: pool de conexiones, hilos, colas.</li>
     <li>Recursos: CPU, memoria, GC.</li>
     <li>Marcas de despliegue (anotaciones) para ver si un cambio coincide con un problema.</li></ol>
     <p>Con <b>variables</b> (<code>$servicio</code>, <code>$entorno</code>) el mismo panel sirve para todos los servicios. Y guardado como JSON en Git (o con Terraform), se versiona como el código.</p>`},
 {t:"par", p:"Empareja cada elemento de Grafana con su utilidad",
  pares:[["Fuente de datos","Prometheus, Loki, Tempo, PostgreSQL..."],["Variable de panel","Cambiar de servicio o entorno con un desplegable"],["Anotación","Marcar despliegues o incidentes en las gráficas"],["Umbral","Colorear cuando se supera un valor"],["Explore","Investigar consultas sin crear un panel"]],
  why:"Las anotaciones de despliegue ahorran mucho tiempo en los incidentes."},
 {t:"opcion", p:"¿Qué debería mostrar arriba del todo el panel de un servicio?",
  ops:["La CPU de cada nodo","Tráfico, errores y latencia frente a sus objetivos: si los usuarios están bien o no","El número de commits","La temperatura del centro de datos"],
  ok:1, why:"Primero los síntomas; las causas, más abajo."}
]},

{
id:"ob3l3",
titulo:"PromQL avanzado",
claves:["histogram_quantile sobre rate de los buckets para percentiles","Agregar con sum by (etiqueta) antes de calcular cocientes","Reglas de grabación (recording rules) para consultas caras y frecuentes"],
pasos:[
 {t:"info", eti:"Más allá de rate", h:"Percentiles y cocientes",
  c:`<div class="termbox"># p95 de latencia por ruta
histogram_quantile(0.95,
  sum by (le, ruta) (rate(http_request_duration_seconds_bucket[5m])))

# porcentaje de errores 5xx
sum(rate(http_requests_total{codigo=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m]))

# top 5 pods por CPU
topk(5, sum by (pod) (rate(container_cpu_usage_seconds_total[5m])))

# el objetivo lleva caido
up == 0</div>`},
 {t:"par", p:"Empareja cada consulta con su resultado",
  pares:[["histogram_quantile(0.99, ...)","El percentil 99 de latencia"],["topk(5, ...)","Las 5 series con mayor valor"],["increase(x_total[1h])","Cuánto creció el contador en la última hora"],["absent(up{job='api'})","Avisar si la métrica ni siquiera existe"],["predict_linear(disco[6h], 4*3600)","Estimar el valor dentro de 4 horas"]],
  why:"predict_linear permite alertar antes de que el disco se llene."},
 {t:"vf", p:"Para calcular el p95 global de varias réplicas basta con hacer la media de los p95 de cada réplica.",
  ok:false, why:"Los percentiles no se promedian: se suman los buckets (sum by le) y luego se calcula el cuantil."}
]}

]});
