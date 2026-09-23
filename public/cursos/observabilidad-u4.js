window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "PromQL de verdad",
resumen: "Selectores, rate e increase, agregaciones y emparejamiento de vectores, percentiles con histogram_quantile, funciones útiles y reglas de grabación con pruebas",
nivel: "Intermedio",
color: "#da5f5f",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"ob3l1",
titulo:"Selectores, rate e increase",
claves:["Vector instantáneo (un valor por serie) frente a vector de rango ([5m]: todas las muestras de la ventana)","rate() convierte un contador en tasa por segundo y corrige los reinicios; increase() da el aumento en la ventana","Primero rate y después sum: nunca al revés; la ventana debe cubrir al menos cuatro scrapes"],
pasos:[
 {t:"info", eti:"El lenguaje", h:"Selectores y tipos",
  c:`<div class="termbox"># vector instantáneo: el último valor de cada serie que coincide
http_server_requests_seconds_count{job="tareas-api", status=~"5..", uri!="/salud"}

=   igual      !=  distinto      =~  cumple la regex      !~  no la cumple

# vector de rango: las muestras de los últimos 5 minutos de cada serie
http_server_requests_seconds_count{job="tareas-api"}[5m]

# desplazado en el tiempo: lo mismo hace una semana
rate(http_server_requests_seconds_count[5m] offset 1w)</div>
     <p>Un vector de rango no se puede pintar: hay que pasarlo por una función (<code>rate</code>, <code>avg_over_time</code>…) que lo convierta en un valor por serie. Las regex de PromQL están <b>ancladas</b>: <code>status=~"5.."</code> equivale a <code>^5..$</code>.</p>`},
 {t:"info", eti:"La función clave", h:"rate, irate e increase",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tres formas de leer un contador</div><table class="dg-tabla"><thead><tr><th>Función</th><th>Qué da</th><th>Para</th></tr></thead><tbody>
       <tr><td><code>rate(x[5m])</code></td><td>media por segundo en la ventana</td><td>paneles y alertas: suave y estable</td></tr>
       <tr><td><code>irate(x[5m])</code></td><td>tasa entre las dos últimas muestras</td><td>ver picos en paneles muy detallados; nunca en alertas</td></tr>
       <tr><td><code>increase(x[1h])</code></td><td>aumento en la ventana (<code>rate × segundos</code>)</td><td>«cuántos pedidos en la última hora»</td></tr>
     </tbody></table></div>
     <ul><li>Las tres detectan los <b>reinicios</b> del contador (cuando el valor baja, el proceso se reinició) y los compensan.</li>
     <li>Extrapolan a los bordes de la ventana: <code>increase</code> puede dar 99,7 en vez de 100. No es un error.</li>
     <li>La ventana debe contener varias muestras: con scrape cada 15 s, <b>al menos <code>[1m]</code></b>, y mejor <code>[2m]</code>–<code>[5m]</code>. En Grafana usa <code>$__rate_interval</code>, que lo calcula solo.</li></ul>
     <div class="nota ojo"><b class="tit">rate y después sum</b><code>sum(rate(x[5m]))</code> es correcto. Sumar primero y aplicar rate después mezcla contadores de procesos distintos: cuando uno se reinicia, la suma baja y se interpreta como un reinicio falso.</div>`},
 {t:"term", p:"Escribe la consulta de peticiones por segundo de <code>http_server_requests_seconds_count</code> por <code>uri</code>, en ventanas de 5 minutos",
  prompt:"PromQL ›",
  sol:["sum by (uri) (rate(http_server_requests_seconds_count[5m]))","sum(rate(http_server_requests_seconds_count[5m])) by (uri)","sum by(uri)(rate(http_server_requests_seconds_count[5m]))"],
  salida:"{uri=\"/api/tareas\"}        48.2\n{uri=\"/api/tareas/{id}\"}   12.9\n{uri=\"/actuator/health\"}    0.2",
  pista:"sum by (uri) de un rate de 5 minutos.",
  why:"Es el tráfico (la R de RED) por endpoint. <code>by (uri)</code> conserva solo esa etiqueta; el resto de dimensiones (instancia, estado, método) se suman."},
 {t:"term", p:"Ahora el porcentaje de errores: peticiones con <code>status</code> 5xx entre todas las peticiones (sin agrupar), ventana de 5 minutos",
  prompt:"PromQL ›",
  sol:['sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))','sum(rate(http_server_requests_seconds_count{status=~"5.*"}[5m])) / sum(rate(http_server_requests_seconds_count[5m]))','sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))/sum(rate(http_server_requests_seconds_count[5m]))'],
  salida:"{}   0.0127",
  pista:"Dos sumas de rate divididas: arriba con el filtro status=~\"5..\", abajo sin filtro.",
  why:"0,0127 es un 1,27 %. Sin el <code>sum</code> a cada lado, la división empareja serie a serie por etiquetas y el resultado sería el porcentaje de cada combinación, no el global."},
 {t:"term", p:"¿Cuántos pedidos se crearon en las últimas 24 horas? (contador <code>pedidos_creados_total</code>, sumando todas las réplicas)",
  prompt:"PromQL ›",
  sol:["sum(increase(pedidos_creados_total[24h]))","sum(increase(pedidos_creados_total[1d]))","increase(pedidos_creados_total[24h])","sum(rate(pedidos_creados_total[24h])) * 86400","sum(rate(pedidos_creados_total[24h]))*86400"],
  salida:"{}   18422.6",
  pista:"increase sobre una ventana de 24h, y sum para juntar réplicas.",
  why:"El decimal sale de la extrapolación a los bordes. Para cifras exactas de negocio, la fuente de verdad es la base de datos; las métricas son para tendencias y alertas."},
 {t:"codigo", p:"Calcula el aumento y la tasa de un contador, corrigiendo los reinicios",
  lenguaje:"js",
  c:`<p>Cada línea de la entrada es una muestra: <code>segundo valor</code>. Si un valor es <b>menor</b> que el anterior, el proceso se reinició y el contador volvió a 0: el aumento de ese tramo es el valor nuevo entero. Imprime <code>aumento=100 tasa=1.67/s</code> (la tasa con dos decimales, dividiendo entre el tiempo de la primera a la última muestra).</p>`,
  plantilla:"const muestras = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(l => l.trim().split(/\\s+/).map(Number));\nlet aumento = 0;\n\nfor (let i = 1; i < muestras.length; i++) {\n  const anterior = muestras[i - 1][1], actual = muestras[i][1];\n  // suma la diferencia, o el valor entero si hubo reinicio\n}\n\nconst segundos = muestras[muestras.length - 1][0] - muestras[0][0];\nconsole.log(\"aumento=\" + aumento + \" tasa=\" + (aumento / segundos).toFixed(2) + \"/s\");\n",
  pruebas:[{entrada:"0 100\n15 130\n30 160\n45 10\n60 40\n", salida:"aumento=100 tasa=1.67/s"},{entrada:"0 0\n30 60\n60 120\n", salida:"aumento=120 tasa=2.00/s", oculta:true},{entrada:"0 5\n10 2\n20 4\n", salida:"aumento=4 tasa=0.20/s", oculta:true}],
  pista:"aumento += actual >= anterior ? actual - anterior : actual;",
  solucion:"const muestras = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(l => l.trim().split(/\\s+/).map(Number));\nlet aumento = 0;\n\nfor (let i = 1; i < muestras.length; i++) {\n  const anterior = muestras[i - 1][1], actual = muestras[i][1];\n  aumento += actual >= anterior ? actual - anterior : actual;\n}\n\nconst segundos = muestras[muestras.length - 1][0] - muestras[0][0];\nconsole.log(\"aumento=\" + aumento + \" tasa=\" + (aumento / segundos).toFixed(2) + \"/s\");\n",
  why:"Sin corregir el reinicio, el tramo 160 → 10 restaría 150 y la tasa saldría negativa. Por eso <code>rate</code> solo se aplica a contadores: en un gauge, una bajada es real y la «corrección» inventaría datos."},
 {t:"opcion", p:"¿Por qué no se grafica directamente <code>http_server_requests_seconds_count</code>?",
  ops:["Porque es un gauge","Porque es un contador acumulado que solo crece; lo útil es su tasa con rate()","Porque no tiene etiquetas","Porque es texto"],
  ok:1, why:"El valor absoluto depende de cuándo arrancó el proceso: dos réplicas idénticas con distinto tiempo de vida darían líneas distintas."},
 {t:"opcion", p:"Con <code>scrape_interval: 30s</code>, un panel con <code>rate(x[30s])</code> sale con huecos y la línea aparece y desaparece. ¿Por qué?",
  ops:["Porque Prometheus está caído","Porque en una ventana de 30 s a menudo hay una sola muestra, y rate necesita al menos dos","Porque rate no funciona con 30 s","Porque falta un sum"],
  ok:1, why:"Regla práctica: la ventana, al menos cuatro veces el intervalo de scrape (aquí, <code>[2m]</code>). En Grafana, <code>$__rate_interval</code> lo resuelve según el intervalo configurado en la fuente de datos."}
]},

/* =============== U4 L2 =============== */
{
id:"ob4n1",
titulo:"Agregaciones y emparejamiento de vectores",
claves:["sum, avg, max, count, topk… con by (conservar etiquetas) o without (quitar etiquetas)","Las operaciones entre vectores emparejan series con las mismas etiquetas; on() e ignoring() cambian el criterio","group_left para uniones de muchos a uno, por ejemplo añadir el nodo o la versión desde una métrica info"],
pasos:[
 {t:"info", eti:"Agregar", h:"by y without",
  c:`<div class="termbox"># CPU por namespace
sum by (namespace) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))

# lo mismo, pero quitando solo las etiquetas de réplica
sum without (instance, pod) (rate(http_requests_total[5m]))

# los 5 pods que más memoria usan
topk(5, container_memory_working_set_bytes{container!=""})

# cuántas réplicas responden por job
count by (job) (up == 1)</div>
     <p><code>by</code> dice qué etiquetas se quedan; <code>without</code>, cuáles se van. <code>without</code> es más robusto en reglas: si mañana alguien añade una etiqueta útil (<code>region</code>), se conserva sola.</p>
     <p>Operadores de agregación: <code>sum</code>, <code>avg</code>, <code>min</code>, <code>max</code>, <code>count</code>, <code>group</code>, <code>stddev</code>, <code>topk</code>, <code>bottomk</code>, <code>quantile</code>, <code>count_values</code>.</p>`},
 {t:"info", eti:"Juntar series", h:"Emparejamiento: on, ignoring y group_left",
  c:`<p>En <code>a / b</code>, PromQL empareja cada serie de <code>a</code> con la de <code>b</code> que tenga <b>exactamente las mismas etiquetas</b>. Si no coinciden, no hay resultado (y no da error: sale vacío).</p>
     <div class="termbox"># errores / total por servicio: las dos partes agregadas por lo mismo
sum by (servicio) (rate(http_requests_total{codigo=~"5.."}[5m]))
  / sum by (servicio) (rate(http_requests_total[5m]))

# emparejar solo por algunas etiquetas
a / on (servicio) b          a / ignoring (codigo) b

# muchos a uno: memoria de cada pod con el nodo donde corre
sum by (node) (
  container_memory_working_set_bytes{container!=""}
  * on (namespace, pod) group_left (node) kube_pod_info
)

# comparaciones: filtran series... o devuelven 0/1 con bool
http_requests_total &gt; 100           http_requests_total &gt; bool 100

# operadores de conjuntos
a and b      a or b      a unless b</div>
     <p>Las métricas <b>info</b> (<code>kube_pod_info</code>, <code>app_build_info{version="1.8.2"}</code>) valen siempre 1 y existen para esto: multiplicar por ellas añade etiquetas sin cambiar el valor.</p>`},
 {t:"term", p:"Escribe la CPU usada por namespace: suma de <code>rate</code> de <code>container_cpu_usage_seconds_total</code> a 5 minutos, agrupada por <code>namespace</code>",
  prompt:"PromQL ›",
  sol:["sum by (namespace) (rate(container_cpu_usage_seconds_total[5m]))","sum(rate(container_cpu_usage_seconds_total[5m])) by (namespace)",'sum by (namespace) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))','sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (namespace)'],
  salida:"{namespace=\"pagos\"}         3.41\n{namespace=\"pedidos\"}       1.87\n{namespace=\"monitorizacion\"} 0.96",
  pista:"sum by (namespace) ( rate( … [5m] ) )",
  why:"El resultado está en núcleos: 3,41 significa tres núcleos y medio ocupados de media. El filtro <code>container!=\"\"</code> quita la serie que cAdvisor da para el pod entero, que contaría doble."},
 {t:"term", p:"Los 5 pods con más memoria en uso (<code>container_memory_working_set_bytes</code>), sumando sus contenedores",
  prompt:"PromQL ›",
  sol:["topk(5, sum by (pod) (container_memory_working_set_bytes))","topk(5, sum(container_memory_working_set_bytes) by (pod))",'topk(5, sum by (pod) (container_memory_working_set_bytes{container!=""}))','topk(5, sum(container_memory_working_set_bytes{container!=""}) by (pod))',"topk(5, sum by (namespace, pod) (container_memory_working_set_bytes))"],
  salida:"{pod=\"kafka-0\"}               6.2e+09\n{pod=\"prometheus-k8s-0\"}      4.8e+09\n{pod=\"pagos-7d9f8\"}           1.1e+09\n...",
  pista:"topk(5, …) de un sum by (pod).",
  why:"Working set es lo que el kubelet usa para decidir desalojos y lo que cuenta para el OOMKill: es la métrica de memoria que hay que mirar, no <code>container_memory_usage_bytes</code> (que incluye caché recuperable)."},
 {t:"hueco", p:"Completa la consulta que añade la etiqueta <code>node</code> a la memoria de cada pod, uniendo con <code>kube_pod_info</code>",
  tpl:"container_memory_working_set_bytes * ___ (namespace, pod) ___ (node) kube_pod_info",
  banco:["on","group_left","ignoring","group_right","by","without"],
  sol:["on","group_left"],
  why:"<code>on</code> dice por qué etiquetas emparejar; <code>group_left</code> permite que muchas series de la izquierda (un pod tiene varios contenedores) casen con una de la derecha y copia <code>node</code> de ella."},
 {t:"opcion", p:"Tu consulta <code>a * on (pod) b</code> falla con «found duplicate series for the match group». ¿Qué pasa?",
  ops:["Prometheus está sobrecargado","En un lado hay varias series por cada valor de pod (muchos a uno) y hace falta group_left o group_right, o agregar antes","La consulta es demasiado larga","Falta un rate"],
  ok:1, why:"Por defecto el emparejamiento es uno a uno. Si un lado tiene varias series por clave, indica cuál es el «muchos» con <code>group_left</code>/<code>group_right</code>, o agrega ese lado con <code>sum by (pod)</code>."},
 {t:"par", p:"Empareja cada operador con su resultado",
  pares:[["a and b","Series de a que también existen en b"],["a or b","Series de a, más las de b que no están en a"],["a unless b","Series de a que no existen en b"],["a > bool 0.5","1 o 0 por serie, en vez de filtrar"],["a > 0.5","Solo las series de a que superan 0,5"]],
  why:"<code>unless</code> es útil en alertas: «pods sin réplicas disponibles, salvo los que están en mantenimiento»."},
 {t:"escribe", p:"Quieres sumar quitando solo las etiquetas <code>instance</code> y <code>pod</code> y conservando todas las demás. ¿Qué palabra usas en lugar de <code>by</code>?",
  sol:["without"],
  pista:"En inglés, «sin».",
  why:"<code>sum without (instance, pod) (…)</code>. Es lo recomendado en reglas de grabación, porque conserva etiquetas que se añadan en el futuro."}
]},

/* =============== U4 L3 =============== */
{
id:"ob3l3",
titulo:"Percentiles y funciones avanzadas",
claves:["histogram_quantile sobre rate de las cubetas, sumando por le: el percentil se interpola dentro de la cubeta","Fracción de peticiones por debajo de un umbral: la cubeta del umbral entre el total","predict_linear, absent, *_over_time, offset y subconsultas para alertas y comparaciones"],
pasos:[
 {t:"info", eti:"Percentiles", h:"Cómo calcula histogram_quantile",
  c:`<div class="termbox"># p95 de latencia por ruta (sumando réplicas)
histogram_quantile(0.95,
  sum by (le, ruta) (rate(http_request_duration_seconds_bucket[5m])))

# qué fracción de peticiones tarda 250 ms o menos (hace falta cubeta en 0.25)
sum(rate(http_request_duration_seconds_bucket{le="0.25"}[5m]))
  / sum(rate(http_request_duration_seconds_count[5m]))

# latencia media
sum(rate(http_request_duration_seconds_sum[5m]))
  / sum(rate(http_request_duration_seconds_count[5m]))</div>
     <p>Por dentro: con 1.000 peticiones y φ = 0,99 busca la posición 990, encuentra la primera cubeta acumulada que la alcanza y <b>interpola linealmente</b> dentro de ella suponiendo reparto uniforme. Consecuencias:</p>
     <ul><li>El resultado nunca es más preciso que las cubetas: con cubetas 0,5 y 1, un p99 de «0,83» significa «entre 0,5 y 1».</li>
     <li>Si el percentil cae en la cubeta <code>+Inf</code>, devuelve el límite de la última cubeta finita: un p99 «plano» en ese valor significa «por encima de lo que medimos».</li>
     <li>La etiqueta <code>le</code> tiene que sobrevivir a la agregación: <code>sum by (le, …)</code> siempre.</li></ul>`},
 {t:"codigo", p:"Implementa <code>histogram_quantile</code> como lo hace Prometheus",
  lenguaje:"js",
  c:`<p>La primera línea es el cuantil (por ejemplo <code>0.99</code>). Las siguientes, cubetas acumuladas <code>le cuenta</code>, la última con <code>+Inf</code>. Calcula la posición <code>rango = q × total</code> (total = cuenta de <code>+Inf</code>), busca la primera cubeta cuya cuenta sea ≥ rango e interpola entre el límite de la cubeta anterior (0 para la primera) y el suyo. Si cae en <code>+Inf</code>, devuelve el límite de la última cubeta finita. Imprime con 3 decimales.</p>`,
  plantilla:"const [qTxt, ...resto] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst q = Number(qTxt);\nconst cubetas = resto.map(l => { const [le, c] = l.trim().split(/\\s+/); return { le: le === \"+Inf\" ? Infinity : Number(le), c: Number(c) }; });\n\nfunction cuantil(q, cubetas) {\n  const total = cubetas[cubetas.length - 1].c;\n  const rango = q * total;\n  // recorre las cubetas e interpola\n}\n\nconsole.log(cuantil(q, cubetas).toFixed(3));\n",
  pruebas:[{entrada:"0.99\n0.1 900\n0.5 980\n1 995\n+Inf 1000\n", salida:"0.833"},{entrada:"0.5\n0.1 900\n0.5 980\n1 995\n+Inf 1000\n", salida:"0.056", oculta:true},{entrada:"0.999\n0.1 900\n0.5 980\n1 995\n+Inf 1000\n", salida:"1.000", oculta:true},{entrada:"0.9\n0.25 40\n0.5 80\n1 100\n+Inf 100\n", salida:"0.750", oculta:true}],
  pista:"Guarda el límite y la cuenta de la cubeta anterior (0 y 0 al principio). Al encontrar la cubeta: si le es Infinity, devuelve el límite anterior; si no, anterior + (le - anterior) * (rango - cuentaAnterior) / (c - cuentaAnterior).",
  solucion:"const [qTxt, ...resto] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst q = Number(qTxt);\nconst cubetas = resto.map(l => { const [le, c] = l.trim().split(/\\s+/); return { le: le === \"+Inf\" ? Infinity : Number(le), c: Number(c) }; });\n\nfunction cuantil(q, cubetas) {\n  const total = cubetas[cubetas.length - 1].c;\n  const rango = q * total;\n  let limAnt = 0, cAnt = 0;\n  for (const b of cubetas) {\n    if (b.c >= rango) {\n      if (b.le === Infinity) return limAnt;\n      return limAnt + (b.le - limAnt) * (rango - cAnt) / (b.c - cAnt);\n    }\n    limAnt = b.le; cAnt = b.c;\n  }\n  return limAnt;\n}\n\nconsole.log(cuantil(q, cubetas).toFixed(3));\n",
  why:"El caso 0,999 devuelve 1,000 aunque haya peticiones de 10 segundos: el histograma no sabe nada por encima de su última cubeta finita. Elige cubetas que cubran la cola que te importa."},
 {t:"term", p:"Escribe el p95 de <code>http_request_duration_seconds</code> por <code>ruta</code>, sumando todas las réplicas, con ventana de 5 minutos",
  prompt:"PromQL ›",
  sol:["histogram_quantile(0.95, sum by (le, ruta) (rate(http_request_duration_seconds_bucket[5m])))","histogram_quantile(0.95, sum by (ruta, le) (rate(http_request_duration_seconds_bucket[5m])))","histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, ruta))","histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (ruta, le))"],
  salida:"{ruta=\"/api/pedidos\"}        0.212\n{ruta=\"/api/pedidos/:id\"}    0.087\n{ruta=\"/api/pagos\"}          0.940",
  pista:"histogram_quantile(0.95, sum by (le, ruta) (rate(…_bucket[5m])))",
  why:"Si olvidas <code>le</code> en el <code>by</code>, la función no tiene cubetas con las que trabajar y devuelve vacío o NaN."},
 {t:"term", p:"Alerta preventiva: escribe la condición «el espacio libre del sistema de ficheros raíz (<code>node_filesystem_avail_bytes</code> con <code>mountpoint=\"/\"</code>) llegará a 0 en 4 horas», extrapolando las últimas 6 horas",
  prompt:"PromQL ›",
  sol:['predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 4*3600) < 0','predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 4 * 3600) < 0','predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 14400) < 0','predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h],4*3600)<0','predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 4*60*60) < 0'],
  salida:"{device=\"/dev/nvme0n1p1\", instance=\"nodo-3:9100\", mountpoint=\"/\"}   -1.83e+09",
  pista:"predict_linear(serie[6h], segundos_hacia_delante) < 0",
  why:"Avisa horas antes de que el disco se llene, en vez de cuando ya está al 95 %. Combínala con <code>and</code> sobre un umbral de uso para evitar falsos positivos en discos casi vacíos que crecen rápido un momento."},
 {t:"par", p:"Empareja cada consulta con su resultado",
  pares:[["histogram_quantile(0.99, ...)","El percentil 99 de latencia"],["topk(5, ...)","Las 5 series con mayor valor"],["absent(up{job=\"api\"})","Devuelve 1 si la serie ni siquiera existe"],["max_over_time(x[1h])","El valor máximo de cada serie en la última hora"],["rate(x[5m]) / rate(x[5m] offset 1w)","El tráfico de ahora comparado con el de hace una semana"],["max_over_time(rate(x[5m])[1h:1m])","Subconsulta: el pico de la tasa en la última hora"]],
  why:"<code>absent</code> cubre un hueco de las alertas: si el job desaparece del todo (lo borró un despliegue), <code>up == 0</code> no dispara porque no hay serie."},
 {t:"vf", p:"Para calcular el p95 global de varias réplicas basta con hacer la media de los p95 de cada réplica.",
  ok:false, why:"Los percentiles no se promedian: se suman las cubetas (<code>sum by (le)</code>) y luego se calcula el cuantil."},
 {t:"opcion", p:"El panel del p99 de una ruta marca exactamente 2,5 s durante media hora, sin moverse ni un milisegundo. La última cubeta finita del histograma es 2,5. ¿Qué significa?",
  ops:["Que todas las peticiones tardan exactamente 2,5 s","Que más del 1 % de las peticiones cae en la cubeta +Inf: tardan más de 2,5 s y el histograma no puede decir cuánto","Que Prometheus está caído","Que hay un error de redondeo en Grafana"],
  ok:1, why:"Un percentil clavado en el límite de la última cubeta es la señal de «nos salimos de la escala». Añade cubetas más altas o usa histogramas nativos."}
]},

/* =============== U4 L4 =============== */
{
id:"ob4n2",
titulo:"Reglas de grabación y consultas que escalan",
claves:["Una regla de grabación calcula una consulta cada intervalo y guarda el resultado como una serie nueva","Convención de nombres nivel:métrica:operaciones, por ejemplo job:http_requests:rate5m","Se prueban con promtool (check rules y test rules) y solo existen desde que se crean"],
pasos:[
 {t:"info", eti:"Precalcular", h:"Reglas de grabación",
  c:`<div class="termbox"># reglas/api.yml
groups:
  - name: api-recording
    interval: 30s
    rules:
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))

      - record: job:http_requests_errors:rate5m
        expr: sum by (job) (rate(http_requests_total{codigo=~"5.."}[5m]))

      - record: job:http_requests_errors:ratio_rate5m
        expr: job:http_requests_errors:rate5m / job:http_requests:rate5m</div>
     <ul><li><b>Para qué</b>: paneles que agregan miles de series cada 10 segundos, alertas de SLO con ventanas de días, y datos que se envían a otro sistema (federación o <code>remote_write</code>).</li>
     <li><b>Nombre</b>: <code>nivel:métrica:operaciones</code>. Nivel = etiquetas que quedan (<code>job</code>); métrica sin <code>_total</code> si se le aplicó rate; operaciones de dentro a fuera (<code>rate5m</code>, <code>ratio_rate5m</code>).</li>
     <li>Las reglas de un grupo se evalúan <b>en orden</b>: la tercera puede usar las dos anteriores del mismo ciclo.</li></ul>`},
 {t:"info", eti:"Probar y no romper", h:"promtool, staleness y consultas pesadas",
  c:`<div class="termbox"># tests/api_test.yml
rule_files: [../reglas/api.yml]
evaluation_interval: 1m
tests:
  - interval: 1m
    input_series:
      - series: 'http_requests_total{job="api",codigo="200"}'
        values: '0+54x10'          # empieza en 0 y suma 54 cada minuto
      - series: 'http_requests_total{job="api",codigo="500"}'
        values: '0+6x10'
    promql_expr_test:
      - expr: job:http_requests_errors:ratio_rate5m
        eval_time: 10m
        exp_samples:
          - labels: 'job:http_requests_errors:ratio_rate5m{job="api"}'
            value: 0.1</div>
     <ul><li><b>Staleness</b>: una consulta instantánea mira hacia atrás hasta 5 minutos buscando la última muestra. Si un objetivo desaparece, Prometheus marca sus series como obsoletas y dejan de salir.</li>
     <li><b>Consultas pesadas</b>: filtra siempre por <code>job</code> o <code>namespace</code>, evita regex sobre <code>__name__</code> en paneles, y usa reglas para lo que se repite. Prometheus corta las que tocan demasiadas muestras (<code>--query.max-samples</code>).</li></ul>`},
 {t:"term", p:"Comprueba la sintaxis del fichero de reglas <code>reglas/api.yml</code>",
  prompt:"pablo@portatil:~/monitorizacion$",
  sol:["promtool check rules reglas/api.yml","promtool check rules ./reglas/api.yml"],
  salida:"Checking reglas/api.yml\n  SUCCESS: 3 rules found",
  pista:"El mismo promtool, con check rules.",
  why:"Detecta YAML roto y expresiones PromQL inválidas. En el CI va antes de desplegar las reglas, igual que un linter."},
 {t:"term", p:"Ejecuta las pruebas unitarias de reglas de <code>tests/api_test.yml</code>",
  prompt:"pablo@portatil:~/monitorizacion$",
  sol:["promtool test rules tests/api_test.yml","promtool test rules ./tests/api_test.yml"],
  salida:"Unit Testing:  tests/api_test.yml\n  SUCCESS",
  pista:"promtool test rules y el fichero de pruebas.",
  why:"Con series de entrada inventadas compruebas que la regla calcula lo que crees y que las alertas saltan (o no) cuando deben. Es la única forma de probar una alerta sin esperar a un incidente."},
 {t:"escribe", p:"Siguiendo la convención, ¿cómo se llamaría la regla que guarda <code>sum by (job) (rate(http_requests_total[5m]))</code>?",
  sol:["job:http_requests:rate5m"],
  pista:"nivel:métrica:operaciones, y la métrica pierde el _total al aplicarle rate.",
  why:"Al ver <code>job:http_requests:rate5m</code> sabes, sin abrir el fichero, que está agregada por job y que es una tasa a 5 minutos."},
 {t:"opcion", p:"¿Cuándo merece la pena una regla de grabación?",
  ops:["Para cada consulta que alguien escriba","Para consultas caras que se repiten mucho (paneles populares, alertas de SLO con ventanas largas) o que alimentan otras reglas","Nunca, Prometheus ya es rápido","Solo para métricas de tipo gauge"],
  ok:1, why:"Cada regla crea series nuevas que también cuestan memoria. Se precalcula lo caro y frecuente, no todo."},
 {t:"vf", p:"Al crear una regla de grabación nueva, Prometheus calcula sus valores también para los días anteriores.",
  ok:false, why:"Solo existe desde que se empieza a evaluar. Si necesitas historia (por ejemplo, para una alerta de SLO de 30 días), se puede rellenar con <code>promtool tsdb create-blocks-from rules</code>, o esperar."},
 {t:"par", p:"Empareja cada pieza del nombre <code>job:http_requests_errors:ratio_rate5m</code> con su significado",
  pares:[["job","Etiquetas que quedan tras agregar"],["http_requests_errors","La métrica de origen, sin _total"],["ratio_rate5m","Operaciones aplicadas: cociente de tasas a 5 minutos"]],
  why:"La convención viene de la documentación de Prometheus y la siguen kube-prometheus y casi todos los paquetes de reglas públicos."}
]}

]});
