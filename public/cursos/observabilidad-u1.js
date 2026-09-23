window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Qué es la observabilidad",
resumen: "Monitorizar frente a observar, los tres pilares y sus límites, qué medir con señales doradas, RED y USE, y por qué la latencia se mide con percentiles",
nivel: "Fundamentos",
color: "#e46a6a",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"ob1l1",
titulo:"Monitorizar y observar",
claves:["Monitorizar: vigilar lo que ya sabes que puede fallar","Observar: poder responder preguntas nuevas sobre el sistema a partir de sus datos","Caja negra (desde fuera, como un usuario) y caja blanca (desde dentro, con lo que emite la aplicación)"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Por qué hace falta",
  c:`<p>Un usuario dice «la web va lenta». ¿Es la base de datos, la red, un servicio externo, un despliegue reciente, un solo cliente? Sin datos, se adivina. La <b>observabilidad</b> es la capacidad de entender qué pasa dentro de un sistema a partir de lo que emite.</p>
     <ul><li><b>Monitorizar</b>: paneles y alertas sobre lo conocido («CPU alta», «disco lleno»). Responde a preguntas que hiciste de antemano.</li>
     <li><b>Observar</b>: poder preguntar cosas que no habías previsto («¿qué tienen en común las peticiones lentas de hoy?», «¿solo le pasa a los clientes con la app 4.2 en Android?»).</li></ul>
     <p>No compiten: la monitorización es una parte de la observabilidad. Primero te avisa de que algo va mal; después la observabilidad te deja averiguar por qué.</p>`},
 {t:"info", eti:"Dos miradas", h:"Caja negra y caja blanca",
  c:`<div class="dg"><div class="dg-tit">desde fuera y desde dentro</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">Caja negra</div><div class="dg-pila"><div class="dg-caja base">sonda que hace <code>GET /salud</code> cada minuto<small>desde otra red, como un usuario</small></div><div class="dg-caja">responde: ¿está roto AHORA?</div><div class="dg-caja aviso">no sabe por qué</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">Caja blanca</div><div class="dg-pila"><div class="dg-caja acento">métricas, logs y trazas que emite la app<small>pool de conexiones, colas, errores internos</small></div><div class="dg-caja">responde: ¿por qué? ¿va a romperse?</div><div class="dg-caja aviso">si la app está caída, calla</div></div></div>
       </div>
     </div>
     <p>Se necesitan las dos. La caja negra (sondas sintéticas, <code>blackbox_exporter</code>) detecta lo que ve el usuario aunque tu aplicación no emita nada; la caja blanca explica la causa y avisa antes de que el usuario lo note.</p>
     <div class="nota dato"><b class="tit">Frase de entrevista</b>«Monitorizar responde a preguntas que ya conozco; observabilidad es poder hacer preguntas que no sabía que tendría que hacer, sin desplegar código nuevo.»</div>`},
 {t:"par", p:"Empareja cada señal con lo que aporta",
  pares:[["Métricas","Números agregados en el tiempo: cuántas peticiones, cuánto tardan"],["Logs","Eventos detallados con contexto: qué ocurrió exactamente"],["Trazas","El recorrido de una petición a través de varios servicios"],["Perfiles","En qué funciones se gasta la CPU y la memoria"]],
  why:"Métricas para detectar, trazas para localizar, logs para entender el detalle y perfiles para ver qué línea de código gasta los recursos."},
 {t:"opcion", p:"Detectas que la latencia subió. ¿Qué señal te dice en qué servicio de una cadena de cinco se pierde el tiempo?",
  ops:["Las métricas de CPU","Las trazas distribuidas","El log del balanceador","La factura"],
  ok:1, why:"Una traza muestra cada salto con su duración: ves de un vistazo qué tramo de la petición se come los milisegundos."},
 {t:"vf", p:"Con muchos paneles de CPU y memoria ya tienes un sistema observable.",
  ok:false, why:"Eso es monitorización de recursos. Para observar hay que poder relacionar señales y responder preguntas nuevas: métricas de aplicación, logs estructurados y trazas conectadas por un mismo identificador."},
 {t:"opcion", p:"Tu API está completamente caída (el proceso no arranca). ¿Qué te avisa?",
  ops:["Las métricas internas de la aplicación","Una sonda de caja negra que hace peticiones desde fuera","Los logs de depuración","Las trazas"],
  ok:1, why:"Si el proceso no arranca, no emite nada. Por eso toda plataforma seria combina sondas externas con las señales internas (y en Prometheus, la alerta sobre <code>up == 0</code>)."},
 {t:"escribe", p:"¿Cómo se llama la monitorización que mira el sistema desde fuera, como lo haría un usuario, sin saber nada de su interior?",
  sol:["caja negra","de caja negra","monitorización de caja negra","monitorizacion de caja negra","black-box","black box","blackbox","sintética","sintetica","monitorización sintética"],
  pista:"Lo contrario de «caja blanca».",
  why:"Las comprobaciones sintéticas (un robot que hace login o compra de prueba) son la versión elaborada de la caja negra."},
 {t:"par", p:"Empareja cada pregunta con el enfoque que la responde",
  pares:[["¿Responde la web desde Europa ahora mismo?","Sonda de caja negra"],["¿Cuántas conexiones del pool están ocupadas?","Métrica de caja blanca"],["¿Qué tienen en común las peticiones lentas de hoy?","Observabilidad: explorar eventos con muchas dimensiones"],["¿Está el disco por encima del 90 %?","Monitorización clásica con umbral"]],
  why:"Las dos primeras y la última son preguntas previstas; la tercera no la habías escrito en ningún panel: ahí se nota si el sistema es observable."}
]},

/* =============== U1 L2 =============== */
{
id:"ob1n1",
titulo:"Los tres pilares y sus límites",
claves:["Métricas baratas y agregadas; logs caros y detallados; trazas con la estructura de la petición","Por separado son silos: el valor está en conectarlas con un identificador común","Alta cardinalidad y eventos anchos: poder cortar por cualquier campo es lo que permite depurar lo imprevisto"],
pasos:[
 {t:"info", eti:"Cada uno con su precio", h:"Qué da y qué cuesta cada señal",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">los pilares, comparados</div><table class="dg-tabla"><thead><tr><th>Señal</th><th>Fuerte en</th><th>Débil en</th><th>Coste crece con</th></tr></thead><tbody>
       <tr><td>Métricas</td><td>alertas, tendencias, paneles; baratas de guardar y consultar</td><td>el detalle: ya vienen agregadas, no sabes qué petición concreta falló</td><td>el número de series (etiquetas)</td></tr>
       <tr><td>Logs</td><td>el detalle de un evento: mensaje, error, contexto</td><td>ver el conjunto; buscar en terabytes es lento y caro</td><td>el volumen (GB al día)</td></tr>
       <tr><td>Trazas</td><td>dónde se va el tiempo entre servicios</td><td>casi siempre muestreadas: la que buscas puede no estar</td><td>peticiones × spans</td></tr>
       <tr><td>Perfiles</td><td>qué función gasta CPU o memoria</td><td>no explican una petición concreta</td><td>frecuencia de muestreo</td></tr>
     </tbody></table></div>
     <p>Por eso se usan juntas: métricas para <b>detectar</b>, trazas para <b>localizar</b>, logs para <b>explicar</b> y perfiles para <b>optimizar</b>.</p>`},
 {t:"info", eti:"El límite", h:"Pilares sueltos no son observabilidad",
  c:`<p>Tener Prometheus, Elasticsearch y Jaeger sin conexión entre ellos es tener tres silos: en un incidente saltas de herramienta en herramienta alineando horas a ojo. Los límites clásicos:</p>
     <ul><li><b>Las métricas pierden las dimensiones</b>: no puedes poner el id de cliente como etiqueta, así que no puedes preguntar «¿solo le pasa a este cliente?».</li>
     <li><b>Los logs sin estructura</b> no se pueden agregar: buscar texto no es analizar.</li>
     <li><b>Pagas tres veces</b> por el mismo evento: una métrica, una línea de log y un span.</li></ul>
     <p>La respuesta moderna: emitir <b>eventos anchos</b> (un evento por petición con decenas de campos: ruta, cliente, versión, región, duración, error…) y conectar todo con el mismo <code>trace_id</code>. OpenTelemetry pone ese contexto común a métricas, logs y trazas.</p>
     <div class="nota ojo"><b class="tit">Cardinalidad</b>En métricas, la alta cardinalidad (muchos valores distintos de una etiqueta) es un problema. Para depurar, en cambio, es justo lo que quieres: poder filtrar por id de usuario. Por eso esos campos van en logs, trazas o eventos, nunca en etiquetas de métricas.</div>`},
 {t:"par", p:"Empareja cada límite con la señal que lo sufre",
  pares:[["Ya vienen agregadas y no permiten ids de usuario","Métricas"],["Buscar texto en terabytes es lento y caro","Logs"],["La petición que buscas puede no haberse guardado por el muestreo","Trazas"],["No explican una petición concreta, sino el consumo agregado del código","Perfiles"]],
  why:"Conocer el límite de cada señal te dice a cuál acudir para cada pregunta."},
 {t:"opcion", p:"Un cliente importante se queja de errores, pero la tasa de errores global es del 0,1 %. ¿Qué te permite comprobar si le afecta solo a él?",
  ops:["Añadir la etiqueta cliente_id a todas las métricas","Logs estructurados o trazas con el campo cliente_id, filtrando por ese valor","Subir la frecuencia de scrape","Un panel de CPU"],
  ok:1, why:"El id de cliente tiene cardinalidad ilimitada: en métricas haría explotar las series, pero en logs y trazas es un campo más por el que filtrar."},
 {t:"vf", p:"Si un sistema tiene métricas, logs y trazas, es observable por definición.",
  ok:false, why:"Hacen falta datos ricos en contexto y conectados entre sí (el mismo <code>trace_id</code>, los mismos nombres de servicio). Tres silos sin relación te obligan a investigar a ciegas."},
 {t:"escribe", p:"¿Qué identificador, presente en logs, trazas y exemplars de métricas, permite saltar de una señal a otra?",
  sol:["trace_id","traceid","trace id","el trace_id","el traceid","id de traza","identificador de traza"],
  pista:"Lo genera el primer servicio que recibe la petición y viaja en la cabecera traceparent.",
  why:"Con el trace_id en cada línea de log y en los exemplars, pasas de un pico en una gráfica a la traza y de la traza a sus logs en tres clics."},
 {t:"opcion", p:"¿Qué es un «evento ancho» (<i>wide event</i>)?",
  ops:["Un log de más de 1 MB","Un único registro por unidad de trabajo (por ejemplo, por petición) con muchos campos de contexto, sobre el que se puede filtrar y agregar por cualquier dimensión","Una métrica con muchas etiquetas","Una alerta que afecta a varios servicios"],
  ok:1, why:"Es la base de herramientas como Honeycomb y del enfoque «observabilidad 2.0»: de un evento rico se derivan las métricas, en vez de guardar tres cosas separadas."},
 {t:"orden", p:"Ordena el uso típico de las señales en un incidente",
  items:["Una métrica dispara la alerta: sube la tasa de errores","El panel acota el síntoma: qué servicio y desde cuándo","Una traza de ejemplo muestra qué tramo falla","Los logs de esa traza dan el error exacto","Un perfil o un análisis más fino explica el consumo, si hace falta"],
  why:"Detectar, localizar, explicar. Cada señal entra cuando la anterior ya no da más de sí."}
]},

/* =============== U1 L3 =============== */
{
id:"ob1l2",
titulo:"Qué medir: señales doradas, RED y USE",
claves:["Señales doradas: latencia, tráfico, errores y saturación","RED para servicios: Rate, Errors, Duration","USE para recursos: Utilization, Saturation, Errors"],
pasos:[
 {t:"info", eti:"Método", h:"Tres listas que cubren casi todo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué medir según lo que observas</div><table class="dg-tabla"><thead><tr><th>Método</th><th>Para</th><th>Qué mide</th></tr></thead><tbody><tr><td>Señales doradas (Google SRE)</td><td>cualquier sistema de cara al usuario</td><td>latencia, tráfico, errores, saturación</td></tr><tr><td>RED (Tom Wilkie)</td><td>servicios: APIs, microservicios, consumidores</td><td>peticiones/s, errores/s, duración (percentiles)</td></tr><tr><td>USE (Brendan Gregg)</td><td>recursos: CPU, memoria, disco, red, pool de conexiones</td><td>utilización, saturación (colas, esperas), errores</td></tr></tbody></table></div>
     <p>Para una API: RED por endpoint. Para una máquina, un disco o un pool de conexiones: USE. Las señales doradas son RED más la saturación.</p>`},
 {t:"info", eti:"Aplicarlo", h:"Ejemplos concretos",
  c:`<ul><li><b>API HTTP</b> (RED): peticiones por segundo por ruta, porcentaje de 5xx, p95 y p99 de duración.</li>
     <li><b>Consumidor de una cola</b> (RED + saturación): mensajes procesados por segundo, mensajes fallidos, tiempo de proceso y el <b>retraso</b> (lag) acumulado.</li>
     <li><b>Pool de conexiones a base de datos</b> (USE): conexiones en uso sobre el máximo, hilos esperando una conexión, tiempos de espera agotados.</li>
     <li><b>Disco</b> (USE): % de uso del dispositivo, longitud de la cola de E/S, errores de E/S.</li></ul>
     <div class="nota ojo"><b class="tit">Errores que no son 5xx</b>Una respuesta 200 que tarda 30 s, o un 200 con el cuerpo vacío, también es un fallo para el usuario. Define «error» desde su punto de vista, no solo por el código HTTP.</div>`},
 {t:"par", p:"Empareja cada métrica con su categoría",
  pares:[["Peticiones por segundo","Tráfico (Rate)"],["Porcentaje de respuestas 5xx","Errores"],["p99 del tiempo de respuesta","Latencia (Duration)"],["Hilos esperando una conexión a la base de datos","Saturación"],["CPU al 70%","Utilización"]],
  why:"La saturación suele anunciar problemas antes que la utilización: una CPU al 70 % no dice nada, pero una cola de trabajos que crece sí."},
 {t:"opcion", p:"Tienes que decidir qué medir del pool de conexiones de tu base de datos. ¿Qué método encaja mejor?",
  ops:["RED","USE","DORA","Ninguno, los pools no se miden"],
  ok:1, why:"Un pool es un recurso: cuánto se usa, cuánta gente espera en cola por él y cuántos errores de tiempo agotado da."},
 {t:"escribe", p:"En el método USE, ¿qué significa la S?",
  sol:["saturación","saturacion","saturation"],
  pista:"Es el trabajo que espera porque el recurso está ocupado.",
  why:"La saturación se mide como cola o espera: longitud de la cola de ejecución de la CPU, hilos bloqueados esperando conexión, paquetes descartados."},
 {t:"vf", p:"Para un servicio de pagos, basta con medir la CPU y la memoria de sus pods.",
  ok:false, why:"Eso es USE de los recursos. Lo que dice si los usuarios pagan bien es RED del servicio: tasa, errores y duración de las peticiones de pago."},
 {t:"hueco", p:"Completa las cuatro señales doradas",
  tpl:"latencia, ___, errores y ___",
  banco:["tráfico","saturación","utilización","memoria","disponibilidad"],
  sol:["tráfico","saturación"],
  why:"Son las cuatro del capítulo de monitorización del libro de SRE de Google: si solo pudieras medir cuatro cosas de un sistema de cara al usuario, serían estas."},
 {t:"opcion", p:"Un consumidor de Kafka procesa bien cada mensaje (sin errores, 20 ms cada uno), pero los usuarios ven los pedidos con 10 minutos de retraso. ¿Qué señal se te escapaba?",
  ops:["La latencia de cada mensaje","La saturación: el retraso (lag) de mensajes pendientes en el topic","Los errores","La CPU"],
  ok:1, why:"Cada mensaje va rápido, pero llegan más de los que se procesan: la cola crece. En sistemas asíncronos, el lag es la señal de saturación clave."}
]},

/* =============== U1 L4 =============== */
{
id:"ob1n2",
titulo:"Percentiles y distribuciones",
claves:["La media oculta las peticiones lentas: la latencia se mide con percentiles (p50, p95, p99)","Los percentiles no se promedian ni se suman: se calculan sobre la distribución completa","En sistemas con muchas llamadas en paralelo, la cola (p99) de cada pieza la sufre casi todo el mundo"],
pasos:[
 {t:"info", eti:"Ojo con las medias", h:"Qué es un percentil",
  c:`<p>El <b>p95</b> es el valor por debajo del cual queda el 95 % de las observaciones. Si el p95 de latencia es 300 ms, el 5 % de las peticiones tarda más de 300 ms.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">diez peticiones, una muy lenta</div><table class="dg-tabla"><thead><tr><th>Medida</th><th>Valor</th><th>Qué cuenta</th></tr></thead><tbody>
       <tr><td>latencias</td><td><code>11 11 12 12 13 14 15 15 16 900</code> ms</td><td>los datos</td></tr>
       <tr><td>media</td><td>101,9 ms</td><td>no describe a nadie: ni a los nueve rápidos ni al lento</td></tr>
       <tr><td>p50 (mediana)</td><td>13 ms</td><td>la experiencia típica</td></tr>
       <tr><td>p99</td><td>900 ms</td><td>lo que sufren tus peores casos</td></tr>
     </tbody></table></div>
     <p>Los peores casos suelen ser tus mejores clientes: los que tienen más datos, más productos en el carrito o más historial.</p>`},
 {t:"info", eti:"La cola manda", h:"Por qué el p99 importa más de lo que parece",
  c:`<p>Si una página hace <b>100 llamadas en paralelo</b> a un servicio cuyo p99 es 1 s, la página tarda lo que tarde la más lenta. La probabilidad de que las 100 sean rápidas es 0,99<sup>100</sup> ≈ 0,37. Es decir, <b>el 63 % de las páginas</b> sufre la latencia del p99.</p>
     <div class="nota ojo"><b class="tit">Los percentiles no se promedian</b>El p99 de un servicio con tres réplicas no es la media de los tres p99. Para combinarlos hace falta la distribución completa: por eso Prometheus guarda <b>histogramas</b> (cuántas peticiones cayeron en cada tramo) y calcula el percentil al consultar.</div>
     <p>Para ver la distribución entera, el panel adecuado es un <b>mapa de calor</b> (heatmap): tiempo en horizontal, tramos de latencia en vertical, color según cuántas peticiones. Ahí se ven cosas que un percentil esconde, como dos grupos de peticiones (las que van a la caché y las que no).</p>`},
 {t:"opcion", p:"¿Por qué la latencia media es una mala métrica?",
  ops:["Porque es difícil de calcular","Porque oculta las peticiones lentas: unos pocos valores extremos quedan diluidos, o un solo valor enorme la dispara sin representar a nadie","Porque siempre es cero","Porque no existe en Prometheus"],
  ok:1, why:"Mide percentiles con histogramas. La media sí es útil para otra cosa: multiplicada por la tasa te da el tiempo total ocupado (ley de Little)."},
 {t:"codigo", p:"Calcula la media y los percentiles 50, 95 y 99 de una lista de latencias",
  lenguaje:"js",
  c:`<p>La entrada son latencias en milisegundos separadas por espacios. Usa el método del <b>rango más cercano</b>: ordena de menor a mayor y el percentil <code>p</code> es el elemento en la posición <code>ceil(p/100 × n)</code> (contando desde 1).</p><p>Salida: <code>media=101.9 p50=13 p95=900 p99=900</code></p>`,
  plantilla:"const datos = require(\"fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\nconst media = datos.reduce((a, b) => a + b, 0) / datos.length;\n\nfunction percentil(lista, p) {\n  // ordena una copia y devuelve el elemento de la posición ceil(p/100 * n)\n}\n\nconsole.log(\"media=\" + media + \" p50=\" + percentil(datos, 50) + \" p95=\" + percentil(datos, 95) + \" p99=\" + percentil(datos, 99));\n",
  pruebas:[{entrada:"12 15 11 14 13 900 16 12 11 15\n", salida:"media=101.9 p50=13 p95=900 p99=900"},{entrada:"5 1 4 2 3\n", salida:"media=3 p50=3 p95=5 p99=5", oculta:true},{entrada:"20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1\n", salida:"media=10.5 p50=10 p95=19 p99=20", oculta:true}],
  pista:"const o = [...lista].sort((a, b) => a - b); y devuelve o[Math.ceil(p / 100 * o.length) - 1]. Ojo: sort() sin comparador ordena como texto.",
  solucion:"const datos = require(\"fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\nconst media = datos.reduce((a, b) => a + b, 0) / datos.length;\n\nfunction percentil(lista, p) {\n  const o = [...lista].sort((a, b) => a - b);\n  const r = Math.max(1, Math.ceil(p / 100 * o.length));\n  return o[r - 1];\n}\n\nconsole.log(\"media=\" + media + \" p50=\" + percentil(datos, 50) + \" p95=\" + percentil(datos, 95) + \" p99=\" + percentil(datos, 99));\n",
  why:"Con diez datos, el p95 y el p99 caen en el mismo elemento: con pocas muestras los percentiles altos no significan mucho. Por eso se calculan sobre ventanas con suficiente tráfico."},
 {t:"vf", p:"Si tres réplicas tienen un p99 de 100, 200 y 900 ms, el p99 del servicio es 400 ms.",
  ok:false, why:"Los percentiles no se promedian. Depende de cuántas peticiones atiende cada réplica y de cómo se reparten: hay que juntar las distribuciones (sumar los tramos de los histogramas) y calcular el percentil sobre el total."},
 {t:"opcion", p:"Una página hace 100 llamadas en paralelo a un servicio y espera a todas. ¿Qué percentil del servicio acaba marcando la experiencia de la mayoría de las páginas?",
  ops:["El p50","Los percentiles altos, como el p99: con 100 llamadas, casi dos de cada tres páginas se topan con al menos una lenta","La media","Ninguno, las llamadas en paralelo no suman"],
  ok:1, why:"0,99 elevado a 100 ≈ 0,37: solo el 37 % de las páginas se libra de la cola. En arquitecturas con mucho reparto (fan-out), reducir el p99 es más importante que reducir la mediana."},
 {t:"par", p:"Empareja cada visualización con lo que muestra mejor",
  pares:[["Línea del p99","Cómo evoluciona la experiencia de los peores casos"],["Mapa de calor de latencias","La distribución completa en el tiempo, incluidos grupos separados"],["Línea de la media","Poca cosa: mezcla rápidos y lentos en un número que no describe a nadie"],["Tasa de peticiones más lentas que el objetivo","Cuántos usuarios incumplen el SLO de latencia"]],
  why:"Para SLOs se suele medir «qué fracción de peticiones tarda menos de X», que sí se puede sumar entre réplicas y es fácil de explicar."}
]}

]});
