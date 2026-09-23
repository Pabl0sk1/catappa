window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Logs: estructura, recogida y agregación",
resumen: "Logs estructurados que se pueden consultar, agentes y pipelines de recogida, Loki y LogQL, y Elasticsearch u OpenSearch",
nivel: "Fundamentos",
color: "#e06565",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"ob2n1",
titulo:"Logs estructurados bien hechos",
claves:["Un log es un evento con campos (JSON o logfmt), no una frase: nivel, servicio, mensaje fijo y contexto","Niveles con significado: ERROR es algo que alguien debe mirar; DEBUG no va a producción por defecto","A stdout, con trace_id, y sin secretos ni datos personales"],
pasos:[
 {t:"info", eti:"De frase a evento", h:"Texto libre frente a estructura",
  c:`<div class="termbox"># texto libre: fácil de escribir, imposible de agregar
2026-09-22 10:02:11 ERROR Pago del pedido 1042 rechazado para ana@x.com por fondos insuficientes

# JSON: cada dato en su campo
{"ts":"2026-09-22T10:02:11.482Z","nivel":"ERROR","servicio":"pagos","version":"1.8.2",
 "trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","msg":"Pago rechazado","pedido":1042,"motivo":"fondos"}

# logfmt: lo mismo, más legible en consola
ts=2026-09-22T10:02:11.482Z nivel=ERROR servicio=pagos msg="Pago rechazado" pedido=1042 motivo=fondos</div>
     <p>Con estructura puedes preguntar «¿cuántos pagos se rechazaron por <code>motivo</code> en la última hora?» sin expresiones regulares frágiles. Tres reglas:</p>
     <ul><li><b>Mensaje fijo, datos en campos</b>: <code>msg:"Pago rechazado"</code> y aparte <code>pedido:1042</code>. Si metes el número dentro del mensaje, cada línea es distinta y no se pueden agrupar.</li>
     <li><b>Hora en UTC e ISO 8601</b>, con milisegundos.</li>
     <li><b>Contexto de correlación</b>: <code>trace_id</code>, <code>span_id</code>, servicio, versión, entorno.</li></ul>`},
 {t:"info", eti:"Disciplina", h:"Niveles, destino y lo que nunca se registra",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">niveles con significado</div><table class="dg-tabla"><thead><tr><th>Nivel</th><th>Cuándo</th></tr></thead><tbody>
       <tr><td>ERROR</td><td>falló algo que alguien debería mirar: la operación no se completó</td></tr>
       <tr><td>WARN</td><td>algo raro pero recuperado: reintento que funcionó, valor por defecto aplicado</td></tr>
       <tr><td>INFO</td><td>hechos de negocio y del ciclo de vida: arranque, pedido creado, trabajo terminado</td></tr>
       <tr><td>DEBUG</td><td>detalle para desarrollar; apagado en producción salvo cuando se investiga</td></tr>
     </tbody></table></div>
     <ul><li><b>A stdout</b>: en contenedores la aplicación no gestiona ficheros ni rotación; la plataforma recoge la salida estándar (factor XI de las <i>twelve-factor apps</i>).</li>
     <li><b>Nunca</b>: contraseñas, tokens, cabeceras <code>Authorization</code>, números de tarjeta. Con datos personales (emails, DNI), mínimo imprescindible o seudonimizados: el RGPD también se aplica a los logs.</li>
     <li><b>Coste</b>: un log por petición a INFO en un servicio de 5.000 peticiones por segundo son más de 400 millones de líneas al día. Registra lo que aporta.</li></ul>`},
 {t:"opcion", p:"¿Qué línea de log es mejor?",
  ops:["<code>log.info(\"Usuario \" + id + \" ha comprado \" + n + \" productos\")</code>","<code>log.info(\"Compra realizada\", kv(\"usuario\", id), kv(\"productos\", n))</code> con salida JSON","<code>System.out.println(\"compra ok\")</code>","<code>log.error(\"Compra realizada\")</code>"],
  ok:1, why:"Mensaje fijo y datos en campos: se puede contar «Compra realizada» y filtrar por usuario o por número de productos. El nivel ERROR para una compra correcta haría saltar alertas sin motivo."},
 {t:"par", p:"Empareja cada situación con su nivel de log",
  pares:[["No se pudo guardar el pedido tras tres reintentos","ERROR"],["La pasarela tardó, se reintentó y funcionó","WARN"],["Pedido 1042 creado","INFO"],["Valor de cada variable dentro de un bucle","DEBUG"]],
  why:"Si todo es ERROR, nada lo es: las alertas basadas en logs se vuelven ruido."},
 {t:"codigo", p:"Cuenta los errores por servicio en un flujo de logs JSON",
  lenguaje:"js",
  c:`<p>Cada línea de la entrada es un log en JSON. Cuenta las líneas con <code>nivel</code> igual a <code>ERROR</code> agrupadas por <code>servicio</code> e imprime una línea por servicio, <b>ordenados por nombre</b>: <code>pagos 2</code>. Al final imprime <code>ilegibles N</code> con las líneas que no son JSON válido (los logs reales siempre traen alguna).</p>`,
  plantilla:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l.trim());\nconst errores = {};\nlet ilegibles = 0;\n\nfor (const linea of lineas) {\n  // intenta JSON.parse; si falla, suma a ilegibles\n}\n\n// imprime los servicios ordenados y después las ilegibles\n",
  pruebas:[{entrada:"{\"nivel\":\"INFO\",\"servicio\":\"pedidos\",\"msg\":\"Pedido creado\"}\n{\"nivel\":\"ERROR\",\"servicio\":\"pagos\",\"msg\":\"Pago rechazado\"}\nesto no es json\n{\"nivel\":\"ERROR\",\"servicio\":\"pedidos\",\"msg\":\"Timeout\"}\n{\"nivel\":\"ERROR\",\"servicio\":\"pagos\",\"msg\":\"Pago rechazado\"}\n", salida:"pagos 2\npedidos 1\nilegibles 1"},{entrada:"{\"nivel\":\"ERROR\",\"servicio\":\"web\"}\n{\"nivel\":\"WARN\",\"servicio\":\"api\"}\n{roto\n{\"nivel\":\"ERROR\",\"servicio\":\"api\"}\n[1,2\n", salida:"api 1\nweb 1\nilegibles 2", oculta:true}],
  pista:"try { const e = JSON.parse(linea); if (e.nivel === \"ERROR\") errores[e.servicio] = (errores[e.servicio] || 0) + 1; } catch { ilegibles++; } y luego Object.keys(errores).sort().",
  solucion:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l.trim());\nconst errores = {};\nlet ilegibles = 0;\n\nfor (const linea of lineas) {\n  try {\n    const e = JSON.parse(linea);\n    if (e.nivel === \"ERROR\") errores[e.servicio] = (errores[e.servicio] || 0) + 1;\n  } catch {\n    ilegibles++;\n  }\n}\n\nfor (const s of Object.keys(errores).sort()) console.log(s + \" \" + errores[s]);\nconsole.log(\"ilegibles \" + ilegibles);\n",
  why:"Esto es lo que hacen por dentro Loki con <code>| json</code> o un agente como Fluent Bit al parsear: las líneas que no son JSON no se pierden, pero se quedan sin campos. Contarlas te dice si alguien está escribiendo logs a mano."},
 {t:"escribe", p:"En un contenedor, ¿a dónde debe escribir los logs la aplicación?",
  sol:["stdout","a stdout","salida estándar","la salida estándar","salida estandar","a la salida estándar","stdout y stderr","stdout/stderr"],
  pista:"No a un fichero: a un flujo que la plataforma ya recoge.",
  why:"El runtime de contenedores guarda stdout y stderr, <code>kubectl logs</code> y <code>docker logs</code> los leen, y el agente de logs los recoge del nodo. Escribir a ficheros dentro del contenedor obliga a montar volúmenes y gestionar rotación."},
 {t:"vf", p:"En producción conviene registrar el cuerpo completo de cada petición y respuesta a nivel INFO, por si hace falta.",
  ok:false, why:"Coste enorme y riesgo legal: los cuerpos llevan contraseñas, tokens y datos personales. Registra identificadores y campos concretos; para el detalle de una petición están las trazas (con atributos cuidadosamente elegidos)."}
]},

/* =============== U2 L2 =============== */
{
id:"ob2n2",
titulo:"Recoger y enviar: agentes y pipelines",
claves:["Un agente por nodo (DaemonSet) lee los logs de los contenedores, los enriquece y los envía","Fluent Bit, Vector, Grafana Alloy y el Collector de OpenTelemetry; Promtail está obsoleto","Problemas reales: trazas de pila en varias líneas, contrapresión, búferes en disco y filtrado en origen"],
pasos:[
 {t:"info", eti:"El camino de una línea", h:"De stdout al almacén",
  c:`<div class="dg"><div class="dg-tit">pipeline de logs en kubernetes</div>
       <div class="dg-vert">
         <div class="dg-caja base">la app escribe en stdout</div>
         <div class="dg-caja">el runtime lo guarda en el nodo<small><code>/var/log/pods/&lt;ns&gt;_&lt;pod&gt;_&lt;uid&gt;/&lt;contenedor&gt;/0.log</code> y rota los ficheros</small></div>
         <div class="dg-caja acento doble">agente en cada nodo (DaemonSet)<small>lee, junta líneas, parsea, añade metadatos de Kubernetes, filtra, guarda en búfer</small></div>
         <div class="dg-caja ok">almacén: Loki, Elasticsearch / OpenSearch, o un servicio en la nube</div>
       </div>
     </div>
     <div class="dg dg-tabla-caja" style="margin-top:12px"><div class="dg-tit">agentes habituales en 2026</div><table class="dg-tabla"><tbody>
       <tr><td>Fluent Bit</td><td>ligero, en C, muy extendido; proyecto de la CNCF</td></tr>
       <tr><td>Vector</td><td>en Rust, con un lenguaje (VRL) para transformar eventos</td></tr>
       <tr><td>Grafana Alloy</td><td>el agente de Grafana: logs, métricas, trazas y perfiles; sustituye a Promtail y a Grafana Agent</td></tr>
       <tr><td>OpenTelemetry Collector</td><td>receptor <code>filelog</code>: un solo agente para las tres señales</td></tr>
     </tbody></table></div>
     <div class="nota ojo"><b class="tit">Promtail</b>Está obsoleto: Grafana dejó de mantenerlo a principios de 2026. Si lo encuentras en un clúster, el camino es migrar a Alloy (tiene un comando para convertir la configuración).</div>`},
 {t:"info", eti:"Lo que se rompe", h:"Varias líneas, contrapresión y filtros",
  c:`<div class="termbox"># Fluent Bit (formato clásico)
[INPUT]
    Name              tail
    Path              /var/log/containers/*.log
    multiline.parser  cri, java
    Tag               kube.*
    storage.type      filesystem

[FILTER]
    Name              kubernetes
    Match             kube.*

[FILTER]
    Name              grep
    Match             kube.*
    Exclude           log DEBUG

[OUTPUT]
    Name              loki
    Match             kube.*
    Host              loki.monitorizacion
    Port              3100
    Labels            job=fluent-bit</div>
     <ul><li><b>Varias líneas</b>: una traza de pila de Java son 40 líneas; sin un parser multilínea llegan como 40 logs sueltos.</li>
     <li><b>Contrapresión</b>: si el almacén va lento o está caído, el agente debe guardar en <b>búfer en disco</b> (<code>storage.type filesystem</code>) en vez de perder logs o llenar la memoria.</li>
     <li><b>Filtrar en origen</b>: descartar DEBUG, muestrear logs muy repetitivos y <b>enmascarar datos sensibles</b> antes de enviar es lo más barato que existe.</li></ul>`},
 {t:"orden", p:"Ordena lo que le pasa a una línea de log en el pipeline",
  items:["La aplicación la escribe en stdout","El runtime la guarda en un fichero del nodo","El agente la lee y junta las líneas de una traza de pila","El agente la parsea y añade namespace, pod y contenedor","El agente filtra y la guarda en búfer","Se envía al almacén, que la indexa"],
  why:"Cada paso puede perder o duplicar logs: por eso los agentes exponen sus propias métricas (registros leídos, enviados, reintentados, descartados)."},
 {t:"term", p:"El pod <code>pagos-7d9f8</code> se ha reiniciado. Muestra los logs del contenedor <b>anterior</b>, el que murió",
  prompt:"pablo@portatil:~$",
  sol:["kubectl logs pagos-7d9f8 --previous","kubectl logs pagos-7d9f8 -p","kubectl logs --previous pagos-7d9f8","kubectl logs -p pagos-7d9f8"],
  salida:"{\"ts\":\"2026-09-22T10:02:10Z\",\"nivel\":\"ERROR\",\"msg\":\"No se pudo conectar a la base de datos\",\"intentos\":5}\nException in thread \"main\" java.lang.IllegalStateException: pool agotado",
  pista:"kubectl logs con la opción que pide la instancia previa del contenedor.",
  why:"Sin <code>--previous</code> verías los logs del contenedor nuevo, que acaba de arrancar. Aun así, lo que no llegó al almacén central se pierde cuando el pod desaparece: por eso se centralizan."},
 {t:"par", p:"Empareja cada problema con su solución en el pipeline",
  pares:[["Una traza de pila llega como 40 logs sueltos","Parser multilínea en el agente"],["El almacén se cae 10 minutos y se pierden logs","Búfer en disco en el agente"],["Aparecen tokens de sesión en los logs","Regla de enmascarado antes de enviar"],["La factura se dispara por logs DEBUG","Filtrar en origen por nivel"],["No sabes de qué pod viene una línea","Enriquecer con metadatos de Kubernetes"]],
  why:"Casi todo se arregla en el agente, antes de pagar por guardar el dato."},
 {t:"vf", p:"En una instalación nueva de Loki en 2026, lo recomendado es recoger los logs con Promtail.",
  ok:false, why:"Promtail está obsoleto y sin mantenimiento. Lo actual es Grafana Alloy, o cualquier agente compatible (Fluent Bit, Vector, el Collector de OpenTelemetry, que puede enviar a Loki por OTLP)."},
 {t:"opcion", p:"En Kibana ves que cada línea de una excepción de Java aparece como un log distinto, sin el mensaje de error arriba. ¿Qué falta?",
  ops:["Más réplicas de Elasticsearch","Configurar el parser multilínea del agente para que junte la traza de pila con la línea que la inicia","Cambiar a nivel DEBUG","Rotar los ficheros más a menudo"],
  ok:1, why:"La solución definitiva es que la aplicación escriba JSON: la traza de pila va entera dentro de un campo y el problema desaparece."}
]},

/* =============== U2 L3 =============== */
{
id:"ob4l1",
titulo:"Loki y LogQL",
claves:["Loki indexa solo las etiquetas de cada flujo; el contenido se guarda comprimido en almacenamiento de objetos","LogQL: selector de flujo, filtros de línea, parsers (json, logfmt, pattern) y filtros de campos","Consultas de métricas sobre logs: rate, count_over_time, unwrap y quantile_over_time"],
pasos:[
 {t:"info", eti:"Por qué es barato", h:"Cómo guarda Loki",
  c:`<p>Loki agrupa los logs en <b>flujos</b> (streams): cada combinación distinta de etiquetas, como <code>{servicio="pagos", entorno="prod"}</code>, es un flujo. Solo indexa esas etiquetas; el texto se guarda comprimido en trozos (<i>chunks</i>) en S3, GCS o similar. Consultar es: elegir flujos por etiqueta y recorrer su contenido en paralelo.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué va en etiqueta y qué no</div><table class="dg-tabla"><thead><tr><th>Dónde</th><th>Ejemplos</th><th>Por qué</th></tr></thead><tbody>
       <tr><td>etiqueta</td><td>servicio, entorno, namespace, clúster</td><td>pocos valores: pocos flujos, índice pequeño</td></tr>
       <tr><td>metadatos estructurados</td><td><code>trace_id</code>, pod</td><td>alta cardinalidad pero útiles para filtrar (Loki 3)</td></tr>
       <tr><td>dentro de la línea</td><td>pedido, usuario, motivo, duración</td><td>se extraen al consultar con <code>| json</code></td></tr>
     </tbody></table></div>
     <div class="nota ojo"><b class="tit">El error típico</b>Poner <code>pedido_id</code> o <code>usuario</code> como etiqueta: millones de flujos diminutos, el índice explota y las consultas van más lentas, no más rápidas.</div>`},
 {t:"info", eti:"El lenguaje", h:"Anatomía de una consulta LogQL",
  c:`<div class="termbox"># selector de flujo (obligatorio)  |  filtro de línea  |  parser  |  filtro de campo
{servicio="pagos", entorno="prod"} |= "rechazado" | json | motivo="fondos"

|=  contiene        !=  no contiene        |~  cumple la regex        !~  no la cumple

# parsers
{servicio="web"} | logfmt | duracion &gt; 500ms
{servicio="nginx"} | pattern "&lt;ip&gt; - - &lt;_&gt; \"&lt;metodo&gt; &lt;ruta&gt; &lt;_&gt;\" &lt;codigo&gt; &lt;_&gt;" | codigo &gt;= 500

# reformatear la salida
{servicio="pagos"} | json | line_format "{{.pedido}} {{.motivo}}"

# métricas a partir de logs
sum by (servicio) (rate({entorno="prod"} | json | nivel="ERROR" [5m]))
quantile_over_time(0.99, {servicio="api"} | json | unwrap duracion_ms [5m]) by (ruta)</div>
     <p>Pon los <b>filtros de línea antes del parser</b>: <code>|= "rechazado"</code> descarta líneas sin descomprimir campos, y es mucho más rápido que parsear todo con <code>| json</code> y filtrar después.</p>`},
 {t:"term", p:"En Grafana Explore, consulta las líneas del servicio <code>pagos</code> que contienen el texto <code>timeout</code>",
  prompt:"LogQL ›",
  sol:['{servicio="pagos"} |= "timeout"','{servicio="pagos"}|="timeout"','{servicio="pagos"} |~ "timeout"'],
  salida:"2026-09-22 10:02:11  {\"nivel\":\"ERROR\",\"servicio\":\"pagos\",\"msg\":\"timeout llamando a la pasarela\",\"ms\":5000}\n2026-09-22 10:01:57  {\"nivel\":\"WARN\",\"servicio\":\"pagos\",\"msg\":\"timeout, reintentando\",\"intento\":2}",
  pista:"Selector entre llaves con la etiqueta servicio y después el filtro «contiene».",
  why:"El selector de flujo es obligatorio: Loki necesita saber qué flujos leer. Una consulta sin etiquetas concretas tendría que recorrerlo todo."},
 {t:"term", p:"Ahora quédate solo con las líneas de <code>pagos</code> cuyo campo JSON <code>nivel</code> sea <code>ERROR</code>",
  prompt:"LogQL ›",
  sol:['{servicio="pagos"} | json | nivel="ERROR"','{servicio="pagos"} | json | nivel = "ERROR"','{servicio="pagos"}|json|nivel="ERROR"','{servicio="pagos"} | json | nivel=`ERROR`'],
  salida:"2026-09-22 10:02:11  {\"nivel\":\"ERROR\",\"servicio\":\"pagos\",\"msg\":\"timeout llamando a la pasarela\",\"ms\":5000}\n2026-09-22 09:58:40  {\"nivel\":\"ERROR\",\"servicio\":\"pagos\",\"msg\":\"Pago rechazado\",\"motivo\":\"fondos\"}",
  pista:"Selector, luego el parser json, y luego el filtro por el campo nivel.",
  why:"<code>| json</code> convierte cada campo del JSON en una etiqueta temporal de la consulta, sobre la que ya se puede filtrar con =, !=, &gt;, &lt;…"},
 {t:"term", p:"Calcula cuántos errores por segundo tiene cada servicio en producción (etiqueta <code>entorno=\"prod\"</code>, campo <code>nivel</code>), en ventanas de 5 minutos",
  prompt:"LogQL ›",
  sol:['sum by (servicio) (rate({entorno="prod"} | json | nivel="ERROR" [5m]))','sum by(servicio)(rate({entorno="prod"}|json|nivel="ERROR"[5m]))','sum(rate({entorno="prod"} | json | nivel="ERROR" [5m])) by (servicio)','sum by (servicio) (rate({entorno="prod"} | json | nivel="ERROR"[5m]))'],
  salida:"{servicio=\"pagos\"}     0.42\n{servicio=\"pedidos\"}   0.03\n{servicio=\"web\"}       0",
  pista:"sum by (servicio) ( rate( selector | json | filtro [5m] ) )",
  why:"Es la misma forma que en PromQL: <code>rate</code> sobre un rango y <code>sum by</code> para agrupar. Con esto puedes hacer paneles y alertas a partir de logs cuando la aplicación no expone la métrica."},
 {t:"hueco", p:"Completa la consulta que calcula el p99 del campo <code>duracion_ms</code> por ruta",
  tpl:"___(0.99, {servicio=\"api\"} | json | ___ duracion_ms [5m]) by (ruta)",
  banco:["quantile_over_time","unwrap","histogram_quantile","rate","line_format","sum"],
  sol:["quantile_over_time","unwrap"],
  why:"<code>unwrap</code> toma el valor numérico de un campo para usarlo como muestra. Útil, pero calcularlo leyendo logs es caro: si lo consultas a menudo, mejor una métrica de verdad."},
 {t:"term", p:"Desde la terminal, con <code>logcli</code>, busca las líneas de <code>pagos</code> que contienen <code>rechazado</code> en la última hora",
  prompt:"pablo@portatil:~$",
  sol:["logcli query '{servicio=\"pagos\"} |= \"rechazado\"' --since=1h","logcli query '{servicio=\"pagos\"} |= \"rechazado\"' --since 1h","logcli query --since=1h '{servicio=\"pagos\"} |= \"rechazado\"'"],
  salida:"2026-09-22T09:58:40Z {servicio=\"pagos\"} {\"nivel\":\"ERROR\",\"msg\":\"Pago rechazado\",\"motivo\":\"fondos\",\"pedido\":1042}\n2026-09-22T09:31:05Z {servicio=\"pagos\"} {\"nivel\":\"ERROR\",\"msg\":\"Pago rechazado\",\"motivo\":\"cvv\",\"pedido\":1031}",
  pista:"logcli query 'consulta' y la opción para el periodo.",
  why:"<code>logcli</code> lee la dirección de <code>LOKI_ADDR</code>. Viene bien en scripts y cuando Grafana no está a mano."},
 {t:"vf", p:"En Loki conviene poner el id del pedido como etiqueta para buscar rápido.",
  ok:false, why:"Sería una cardinalidad enorme: un flujo por pedido. Va como campo del JSON (y se filtra con <code>| json | pedido=1042</code>), o como metadato estructurado si se busca muy a menudo."},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["Logs en JSON","Filtrar y agregar por campos"],["trace_id en cada línea","Saltar de un log a la traza completa"],["Filtro de línea antes del parser","Consultas más rápidas: se descartan líneas sin parsearlas"],["Etiquetas de baja cardinalidad en Loki","Índices pequeños y pocos flujos"],["No registrar datos sensibles","Cumplir privacidad y seguridad"]],
  why:"Un log sin contexto (qué pedido, qué usuario, qué traza) sirve de poco; un log con contexto en etiquetas sale carísimo."}
]},

/* =============== U2 L4 =============== */
{
id:"ob2n3",
titulo:"Elasticsearch y OpenSearch",
claves:["Indexan el contenido entero (índice invertido): búsqueda de texto y agregaciones muy rápidas, a cambio de más disco, memoria y operación","Mapeos, shards y ciclo de vida de los índices (ILM en Elastic, ISM en OpenSearch)","Loki frente a Elasticsearch: índice mínimo y barato frente a índice completo y potente"],
pasos:[
 {t:"info", eti:"La otra escuela", h:"Indexar todo",
  c:`<p>Elasticsearch (y OpenSearch, su bifurcación abierta mantenida por la Linux Foundation) crea un <b>índice invertido</b> de cada campo: para cada palabra, la lista de documentos donde aparece. Buscar <code>"pool agotado"</code> en mil millones de líneas tarda milisegundos, y puedes agregar por cualquier campo al vuelo.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">loki frente a elasticsearch / opensearch</div><table class="dg-tabla"><thead><tr><th></th><th>Loki</th><th>Elasticsearch / OpenSearch</th></tr></thead><tbody>
       <tr><td>Qué indexa</td><td>solo etiquetas</td><td>todos los campos y el texto</td></tr>
       <tr><td>Búsqueda de texto libre</td><td>fuerza bruta en paralelo</td><td>instantánea</td></tr>
       <tr><td>Coste de almacenamiento</td><td>bajo (objetos comprimidos)</td><td>alto (índices en disco rápido, réplicas)</td></tr>
       <tr><td>Operación</td><td>sencilla</td><td>exigente: shards, memoria, mapeos</td></tr>
       <tr><td>Encaja con</td><td>logs de plataforma, depurar por servicio y hora</td><td>búsqueda, análisis de seguridad (SIEM), auditoría</td></tr>
     </tbody></table></div>
     <p>La pila clásica: <b>Beats / Elastic Agent / Logstash</b> (o Fluent Bit) → <b>Elasticsearch</b> → <b>Kibana</b>. En OpenSearch, <b>OpenSearch Dashboards</b>.</p>`},
 {t:"info", eti:"Operarlo", h:"Mapeos, shards y ciclo de vida",
  c:`<ul><li><b>Mapeo</b>: el tipo de cada campo. Con mapeo dinámico, un campo con claves variables (<code>{"cabeceras":{"x-lo-que-sea":…}}</code>) crea miles de campos: <b>explosión de mapeo</b>. Hay un límite por índice (1.000 campos por defecto) y se rechazan documentos.</li>
     <li><b>Shards</b>: cada índice se parte en shards repartidos por los nodos. Pocos y enormes, o miles diminutos, son malos; la guía habitual es entre 10 y 50 GB por shard.</li>
     <li><b>Ciclo de vida</b>: los logs van a <i>data streams</i> que rotan índices; una política mueve los datos de nodos rápidos (<i>hot</i>) a baratos (<i>warm</i>, <i>cold</i>) y los borra al vencer. En Elastic se llama <b>ILM</b>; en OpenSearch, <b>ISM</b>.</li></ul>
     <div class="termbox">$ curl -s 'localhost:9200/_cat/indices/.ds-logs-*?v&amp;s=index'
health status index                                pri rep docs.count store.size
green  open   .ds-logs-pagos-prod-2026.09.21-000041  1   1   18234012     12.1gb
green  open   .ds-logs-pagos-prod-2026.09.22-000042  1   1    9120455      6.3gb</div>`},
 {t:"par", p:"Empareja cada fase del ciclo de vida con lo que hace",
  pares:[["hot","Recibe escrituras en nodos con disco rápido"],["warm","Solo lectura, en nodos más baratos, con menos réplicas"],["cold","Consultas raras, almacenamiento lo más barato posible"],["delete","Borra el índice al vencer la retención"]],
  why:"Sin política de ciclo de vida, el clúster crece hasta llenarse. Es el incidente más típico de un ELK desatendido."},
 {t:"escribe", p:"En Kibana (KQL), escribe el filtro para ver los logs del servicio <code>pagos</code> con nivel <code>ERROR</code> (campos <code>servicio</code> y <code>nivel</code>)",
  sol:["servicio:pagos and nivel:ERROR","servicio:pagos AND nivel:ERROR","nivel:ERROR and servicio:pagos","nivel:ERROR AND servicio:pagos","servicio : pagos and nivel : ERROR","servicio:\"pagos\" and nivel:\"ERROR\""],
  pista:"campo:valor, unidos con and.",
  why:"KQL (Kibana Query Language) es lo que se escribe en la barra de búsqueda. OpenSearch Dashboards acepta una sintaxis equivalente (DQL)."},
 {t:"opcion", p:"El equipo de seguridad necesita buscar por cualquier palabra en los logs de los últimos 90 días y cruzar campos al vuelo. El de plataforma solo filtra por servicio y hora para depurar. ¿Qué encaja?",
  ops:["Loki para todo","Elasticsearch u OpenSearch para seguridad; Loki (más barato) para los logs de plataforma","Ningún almacén: grep en los nodos","Prometheus"],
  ok:1, why:"No hay una herramienta para todo: indexar todo sale caro y solo compensa cuando la búsqueda libre es el caso de uso principal."},
 {t:"vf", p:"Con el mapeo dinámico de Elasticsearch no hace falta preocuparse de la forma de los logs: cualquier JSON vale.",
  ok:false, why:"Un campo con claves variables provoca la explosión de mapeo y los documentos acaban rechazados. Se define el mapeo de los campos importantes y los variables se guardan como objeto no indexado o como <code>flattened</code>."},
 {t:"opcion", p:"El clúster de logs se ha quedado sin disco y rechaza escrituras. ¿Qué faltaba?",
  ops:["Más CPU","Una política de ciclo de vida (ILM/ISM) que rote y borre índices según la retención acordada","Más campos en el mapeo","Kibana"],
  ok:1, why:"La retención se decide (7, 30, 90 días según el tipo de log y las obligaciones legales) y se automatiza. Cuando Elasticsearch supera la marca de disco máxima, bloquea los índices en solo lectura."}
]}

]});
