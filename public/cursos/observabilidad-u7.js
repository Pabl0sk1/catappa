window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Correlación, profiling y SLOs",
resumen: "Conectar métricas, logs y trazas con exemplars, profiling continuo, SLI, SLO, SLA y presupuesto de error, y alertas por burn rate multiventana",
nivel: "Experto",
color: "#ca4f4f",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"ob4l3",
titulo:"Correlacionar métricas, logs y trazas",
claves:["El trace_id en cada línea de log enlaza el log con su traza","Exemplars: un punto de una métrica apunta a una traza concreta","Los mismos nombres de servicio y etiquetas en las tres señales: sin eso, los saltos no funcionan"],
pasos:[
 {t:"info", eti:"Los tres pilares juntos", h:"Del panel al problema",
  c:`<div class="dg"><div class="dg-tit">de la métrica a la causa en cuatro saltos</div>
       <div class="dg-vert">
         <div class="dg-caja aviso">panel: p99 se dispara a las 10:02</div>
         <div class="dg-caja">exemplar del punto</div>
         <div class="dg-caja">traza <code>4bf92f35...</code><small>muestra 1,8 s en "SELECT pedidos" en servicio-pedidos</small></div>
         <div class="dg-caja">logs filtrados por <code>trace_id=4bf92f35...</code></div>
         <div class="dg-caja acento">"pool agotado, esperando conexión"</div>
       </div>
     </div>
     <p>Con OpenTelemetry, el <b>trace_id</b> viaja en la cabecera <code>traceparent</code> entre servicios y la librería de logs lo añade a cada línea (MDC en Java, o el puente de logs de OTel).</p>`},
 {t:"info", eti:"Cablearlo", h:"Qué hay que configurar",
  c:`<div class="termbox"># exemplar en el formato OpenMetrics: la muestra lleva la traza que la produjo
http_server_requests_seconds_bucket{uri="/api/pedidos",le="2.0"} 18231 # {trace_id="4bf92f3577b34da6a3ce929d0e0e4736"} 1.83 1758535331.2</div>
     <ul><li><b>Métricas → trazas</b>: la librería (Micrometer con tracing, SDK de OTel) adjunta exemplars; Prometheus los guarda con <code>--enable-feature=exemplar-storage</code>; en Grafana activas «Exemplars» en el panel y los enlazas a Tempo.</li>
     <li><b>Logs → trazas</b>: en la fuente de datos de Loki, un <i>derived field</i> extrae el <code>trace_id</code> con una regex y lo convierte en enlace.</li>
     <li><b>Trazas → logs y métricas</b>: en la fuente de Tempo, «trace to logs» y «trace to metrics» construyen la consulta de Loki o Prometheus con el servicio y la franja horaria del span.</li>
     <li>Lo que más se olvida: que el servicio se llame <b>igual</b> en todas partes (<code>service.name="pedidos"</code>, <code>job="pedidos"</code>, <code>servicio="pedidos"</code>). Los atributos de recurso de OpenTelemetry resuelven esto de raíz.</li></ul>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["trace_id en los logs","Encontrar todos los logs de una petición"],["Exemplars","Saltar de una métrica a una traza de ejemplo"],["Derived field en Loki","Convertir el trace_id de un log en un enlace a la traza"],["Trace to logs en Tempo","Abrir los logs del servicio en la franja del span"],["Atributos de recurso comunes","Que las tres señales usen el mismo nombre de servicio"]],
  why:"Cada salto se configura una vez en las fuentes de datos de Grafana; el trabajo de verdad es que las aplicaciones emitan el contexto."},
 {t:"term", p:"Tienes el trace_id <code>4bf92f3577b34da6a3ce929d0e0e4736</code>. Busca en Loki todas las líneas de los servicios de producción (<code>entorno=\"prod\"</code>) que lo contienen",
  prompt:"LogQL ›",
  sol:['{entorno="prod"} |= "4bf92f3577b34da6a3ce929d0e0e4736"','{entorno="prod"}|="4bf92f3577b34da6a3ce929d0e0e4736"','{entorno="prod"} | json | trace_id="4bf92f3577b34da6a3ce929d0e0e4736"','{entorno="prod"} |= "4bf92f3577b34da6a3ce929d0e0e4736" | json'],
  salida:"10:02:11.482 pedidos  {\"nivel\":\"WARN\",\"msg\":\"esperando conexión del pool\",\"trace_id\":\"4bf92f35…\",\"espera_ms\":1790}\n10:02:13.301 pedidos  {\"nivel\":\"ERROR\",\"msg\":\"pool agotado\",\"trace_id\":\"4bf92f35…\"}\n10:02:13.340 api      {\"nivel\":\"ERROR\",\"msg\":\"503 desde pedidos\",\"trace_id\":\"4bf92f35…\"}",
  pista:"Selector por entorno y un filtro de línea que contenga el id.",
  why:"El filtro de línea <code>|=</code> es la forma más rápida: no parsea nada. Si guardas el trace_id como metadato estructurado en Loki 3, puedes filtrar por él directamente sin buscar en el texto."},
 {t:"opcion", p:"Pinchas en un exemplar de un pico de latencia y Tempo dice «trace not found». ¿Cuál es la causa más probable?",
  ops:["Que Prometheus está caído","Que esa traza se descartó en el muestreo (o aún no ha llegado): el exemplar se generó en la app, pero la traza no se guardó","Que el panel está mal","Que la métrica no es un histograma"],
  ok:1, why:"Con tail sampling, las trazas lentas deberían guardarse; con head sampling bajo, muchos exemplars apuntan a trazas descartadas. Algunas librerías solo adjuntan exemplars de trazas muestreadas, justo para evitarlo."},
 {t:"vf", p:"Prometheus guarda los exemplars por defecto, sin configurar nada.",
  ok:false, why:"Hay que activarlo con <code>--enable-feature=exemplar-storage</code> y exponer las métricas en formato OpenMetrics. Se guardan en un búfer circular en memoria de tamaño limitado, no para siempre."},
 {t:"escribe", p:"En Java (SLF4J/Logback), ¿cómo se llama el mapa por hilo donde se pone el trace_id para que aparezca en cada línea de log?",
  sol:["MDC","mdc","Mapped Diagnostic Context"],
  pista:"Tres letras: Mapped Diagnostic Context.",
  why:"El agente de OpenTelemetry y Micrometer Tracing rellenan el MDC con <code>trace_id</code> y <code>span_id</code> solos; solo falta que el formato JSON del log los incluya."}
]},

/* =============== U7 L2 =============== */
{
id:"ob7n1",
titulo:"Profiling continuo",
claves:["Un perfil dice en qué funciones se va la CPU, la memoria o la espera; los muestreadores tienen poco coste y valen en producción","Gráfico de llamas: el ancho es la proporción de muestras, no el tiempo; lo ancho arriba del todo es lo que consume","Pyroscope, Parca y agentes eBPF perfilan siempre, y se comparan perfiles antes y después de un despliegue"],
pasos:[
 {t:"info", eti:"La cuarta señal", h:"Qué es un perfil",
  c:`<p>Un profiler de muestreo mira decenas de veces por segundo qué pila de llamadas se está ejecutando y cuenta. Con suficientes muestras sabes qué porcentaje de la CPU se va en cada función, sin instrumentar nada.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">tipos de perfil</div><table class="dg-tabla"><tbody>
       <tr><td>CPU</td><td>dónde se gasta el procesador</td></tr>
       <tr><td>Asignaciones (alloc)</td><td>quién crea más objetos: presión sobre el recolector de basura</td></tr>
       <tr><td>Memoria viva (heap)</td><td>qué ocupa la memoria ahora: fugas</td></tr>
       <tr><td>Bloqueos (lock / mutex)</td><td>dónde esperan los hilos por un cerrojo</td></tr>
       <tr><td>Reloj de pared (wall)</td><td>tiempo total incluida la espera de E/S: por qué va lento aunque la CPU esté baja</td></tr>
     </tbody></table></div>
     <p><b>Continuo</b> significa perfilar siempre, en producción, con poco coste, y guardar los perfiles como una serie temporal: puedes ver el perfil de ayer a las 10:02 o comparar dos versiones. Herramientas: Grafana Pyroscope, Parca, los de los proveedores; agentes por lenguaje (async-profiler en Java, pprof en Go, py-spy en Python) o <b>eBPF</b>, que perfila todos los procesos del nodo sin tocarlos. OpenTelemetry está incorporando los perfiles como cuarta señal (aún en desarrollo).</p>`},
 {t:"info", eti:"Leerlo", h:"El gráfico de llamas",
  c:`<div class="dg"><div class="dg-tit">gráfico de llamas simplificado de una API</div>
<svg viewBox="0 0 320 150" width="100%" style="max-width:520px;display:block;margin:auto" role="img" aria-label="Gráfico de llamas: main ocupa todo el ancho; encima, atender petición el 90 %; encima, serializar JSON el 55 % y consultar base de datos el 30 %; encima de serializar, reflexión el 40 %">
  <rect x="0" y="120" width="320" height="26" fill="var(--bg-3)" stroke="var(--line-2)"/>
  <text x="160" y="138" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">main · 100 %</text>
  <rect x="0" y="92" width="288" height="26" fill="var(--bg-3)" stroke="var(--line-2)"/>
  <text x="144" y="110" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">atenderPeticion · 90 %</text>
  <rect x="0" y="64" width="176" height="26" fill="var(--accent-soft)" stroke="var(--accent)"/>
  <text x="88" y="82" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">serializarJson · 55 %</text>
  <rect x="178" y="64" width="96" height="26" fill="var(--bg-3)" stroke="var(--line-2)"/>
  <text x="226" y="82" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">BD · 30 %</text>
  <rect x="0" y="36" width="128" height="26" fill="var(--bad-soft)" stroke="var(--bad)"/>
  <text x="64" y="54" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">reflexión · 40 %</text>
  <text x="200" y="30" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">ancho = % de muestras</text>
</svg></div>
     <ul><li>Cada caja es una función; encima de ella, las que llama. El <b>ancho</b> es el porcentaje de muestras en que aparecía, no el orden ni el momento.</li>
     <li>Busca las cajas <b>anchas sin nada encima</b> (tiempo propio): aquí, la reflexión del serializador JSON se lleva el 40 % de la CPU.</li>
     <li>Un <b>gráfico diferencial</b> entre dos versiones colorea lo que creció y lo que bajó: la forma más rápida de encontrar una regresión de rendimiento.</li></ul>`},
 {t:"opcion", p:"En el gráfico de llamas de la CPU, <code>serializarJson</code> ocupa el 55 % del ancho y, encima, <code>reflexión</code> el 40 %. ¿Qué conclusión sacas?",
  ops:["Que serializar JSON tarda 55 segundos","Que la mayor parte de la CPU se va en la reflexión que usa el serializador: compensa configurarlo para evitarla o cachear los metadatos","Que la base de datos es el problema","Que hay que añadir más réplicas"],
  ok:1, why:"El ancho es la proporción de CPU. Optimizar algo que ocupa el 2 % no se notará; atacar el 40 % puede ahorrar máquinas."},
 {t:"term", p:"Tu servicio en Go expone <code>net/http/pprof</code> en el puerto 6060. Captura un perfil de CPU de 30 segundos y ábrelo en la interfaz web local en el puerto 8081",
  prompt:"pablo@portatil:~$",
  sol:["go tool pprof -http=:8081 http://localhost:6060/debug/pprof/profile?seconds=30","go tool pprof -http=:8081 'http://localhost:6060/debug/pprof/profile?seconds=30'","go tool pprof -http :8081 http://localhost:6060/debug/pprof/profile?seconds=30","go tool pprof -http=localhost:8081 http://localhost:6060/debug/pprof/profile?seconds=30"],
  salida:"Fetching profile over HTTP from http://localhost:6060/debug/pprof/profile?seconds=30\nSaved profile in /home/pablo/pprof/pprof.api.samples.cpu.001.pb.gz\nServing web UI on http://localhost:8081",
  pista:"go tool pprof, la opción -http con el puerto y la URL de /debug/pprof/profile con seconds=30.",
  why:"La interfaz trae la vista de gráfico de llamas. Esto es perfilar a demanda; el profiling continuo hace lo mismo cada pocos segundos y guarda el resultado."},
 {t:"term", p:"En Java, con async-profiler, perfila durante 30 segundos el proceso con PID <code>4242</code> y guarda el gráfico de llamas en <code>perfil.html</code>",
  prompt:"pablo@servidor:~$",
  sol:["asprof -d 30 -f perfil.html 4242","asprof -d 30 -f ./perfil.html 4242","asprof -f perfil.html -d 30 4242"],
  salida:"Profiling for 30 seconds\nDone",
  pista:"El lanzador es asprof: -d para la duración, -f para el fichero y el PID al final.",
  why:"async-profiler no sufre el sesgo de «safepoints» de los profilers clásicos de Java y ve también el código nativo y el del kernel. Pyroscope lo usa por dentro para Java."},
 {t:"par", p:"Empareja cada problema con el tipo de perfil que lo explica",
  pares:[["La CPU está al 90 % tras el despliegue","Perfil de CPU, comparado con la versión anterior"],["El recolector de basura se come el 30 % del tiempo","Perfil de asignaciones"],["La memoria crece sin parar hasta el OOMKill","Perfil de memoria viva (heap)"],["Hilos bloqueados y CPU baja con latencia alta","Perfil de bloqueos o de reloj de pared"]],
  why:"Las métricas te dicen que algo consume; el perfil te dice qué línea de código."},
 {t:"vf", p:"En un gráfico de llamas, el eje horizontal representa el paso del tiempo: lo de la izquierda ocurrió antes.",
  ok:false, why:"Las funciones se ordenan alfabéticamente (o por agrupación) y el ancho es la proporción de muestras. La vista con el tiempo en horizontal es otra, el <i>flame chart</i>, que es lo que dibujan las trazas."},
 {t:"opcion", p:"¿Qué aporta enlazar perfiles con trazas (span profiles)?",
  ops:["Nada, son señales independientes","Ver el perfil de CPU de exactamente lo que ejecutó un span lento: por qué ese tramo tardó, a nivel de función","Sustituir a los logs","Reducir el muestreo"],
  ok:1, why:"La traza dice «este span tardó 800 ms en el servicio de precios»; el perfil de ese span dice «600 de ellos en esta expresión regular». Pyroscope lo soporta etiquetando las muestras con el span_id."}
]},

/* =============== U7 L3 =============== */
{
id:"ob7n2",
titulo:"SLI, SLO, SLA y presupuesto de error",
claves:["SLI: indicador medido (eventos buenos / eventos válidos); SLO: objetivo interno sobre una ventana; SLA: contrato con penalizaciones, más laxo que el SLO","Presupuesto de error = 1 − SLO: cuánto puedes fallar en la ventana","Una política de presupuesto convierte los números en decisiones: si se agota, se prioriza la fiabilidad"],
pasos:[
 {t:"info", eti:"Vocabulario", h:"Indicador, objetivo y contrato",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tres siglas que no son lo mismo</div><table class="dg-tabla"><thead><tr><th></th><th>Qué es</th><th>Ejemplo</th></tr></thead><tbody>
       <tr><td>SLI</td><td>indicador: proporción de eventos buenos sobre eventos válidos</td><td>peticiones a /api/pedidos que responden sin 5xx y en menos de 300 ms, entre todas las que no son 4xx</td></tr>
       <tr><td>SLO</td><td>objetivo interno para el SLI en una ventana</td><td>99,9 % en los últimos 30 días</td></tr>
       <tr><td>SLA</td><td>compromiso contractual con consecuencias</td><td>99,5 % mensual; si no, se devuelve el 10 % de la cuota</td></tr>
     </tbody></table></div>
     <ul><li>Tipos de SLI habituales: <b>disponibilidad</b>, <b>latencia</b>, <b>frescura</b> (datos de hace menos de X), <b>corrección</b>, <b>cobertura</b> (trabajos por lotes).</li>
     <li><b>Dónde medir</b>: cuanto más cerca del usuario, más fiel (balanceador o cliente mejor que el propio servicio, que no ve sus caídas).</li>
     <li><b>El SLO nunca es 100 %</b>: cada nueve extra cuesta mucho más y el usuario no lo nota si su red móvil falla más que tú. Se elige a partir de lo que necesita el usuario y de lo que el sistema consigue hoy.</li></ul>`},
 {t:"info", eti:"Hacer cuentas", h:"El presupuesto de error",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">presupuesto en una ventana de 30 días</div><table class="dg-tabla"><thead><tr><th>SLO</th><th>Presupuesto</th><th>Tiempo de caída total permitido</th></tr></thead><tbody>
       <tr><td>99 %</td><td>1 %</td><td>7 h 12 min</td></tr>
       <tr><td>99,5 %</td><td>0,5 %</td><td>3 h 36 min</td></tr>
       <tr><td>99,9 %</td><td>0,1 %</td><td>43,2 min</td></tr>
       <tr><td>99,95 %</td><td>0,05 %</td><td>21,6 min</td></tr>
       <tr><td>99,99 %</td><td>0,01 %</td><td>4,3 min</td></tr>
     </tbody></table></div>
     <p>Con SLI por peticiones, el presupuesto se cuenta en peticiones: con 10 millones al mes y SLO del 99,9 %, puedes fallar 10.000. Un fallo parcial (el 5 % de las peticiones durante una hora) gasta menos que una caída total de una hora.</p>
     <p><b>Política de presupuesto</b>, acordada con producto: si queda presupuesto, se despliega y se experimenta; si se agota, se congelan las funcionalidades no urgentes y el equipo trabaja en fiabilidad hasta recuperarlo. Sin política, el SLO es un número decorativo.</p>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["SLI","Proporción medida de eventos buenos sobre válidos"],["SLO","Objetivo interno para un indicador en una ventana"],["SLA","Contrato con el cliente, con penalizaciones"],["Presupuesto de error","Cuánto se puede fallar sin incumplir el objetivo"],["Política de presupuesto","Qué se hace cuando el presupuesto se agota"]],
  why:"En entrevista, la trampa típica es confundir SLO con SLA: el SLA es externo y legal; el SLO, interno y más exigente."},
 {t:"codigo", p:"Calcula el presupuesto de error y cuánto se ha consumido",
  lenguaje:"js",
  c:`<p>Entrada: <code>slo dias total fallidas</code>, por ejemplo <code>99.9 30 10000000 4000</code> (SLO en porcentaje, ventana en días, peticiones totales y fallidas). Imprime <code>minutos=43.2 presupuesto=10000 consumido=40.0% restante=6000</code>: minutos de caída total que permite el SLO en la ventana (1 decimal), presupuesto en peticiones (redondeado), porcentaje consumido (1 decimal, calculado con el presupuesto redondeado) y peticiones restantes (negativas si se ha pasado).</p>`,
  plantilla:"const [slo, dias, total, fallidas] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\nconst fraccion = (100 - slo) / 100;   // el presupuesto como fracción\n\n// calcula minutos, presupuesto, consumido y restante\n",
  pruebas:[{entrada:"99.9 30 10000000 4000\n", salida:"minutos=43.2 presupuesto=10000 consumido=40.0% restante=6000"},{entrada:"99.95 28 2000000 1500\n", salida:"minutos=20.2 presupuesto=1000 consumido=150.0% restante=-500", oculta:true},{entrada:"99 30 50000 0\n", salida:"minutos=432.0 presupuesto=500 consumido=0.0% restante=500", oculta:true}],
  pista:"minutos = dias * 24 * 60 * fraccion; presupuesto = Math.round(total * fraccion); consumido = fallidas / presupuesto * 100.",
  solucion:"const [slo, dias, total, fallidas] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\nconst fraccion = (100 - slo) / 100;\n\nconst minutos = dias * 24 * 60 * fraccion;\nconst presupuesto = Math.round(total * fraccion);\nconst consumido = fallidas / presupuesto * 100;\nconst restante = presupuesto - fallidas;\nconsole.log(\"minutos=\" + minutos.toFixed(1) + \" presupuesto=\" + presupuesto + \" consumido=\" + consumido.toFixed(1) + \"% restante=\" + restante);\n",
  why:"Un consumo del 150 % significa SLO incumplido en esa ventana: según la política, se congela el trabajo de funcionalidades. Ojo con el redondeo: en coma flotante, 100 − 99,9 no da exactamente 0,1."},
 {t:"term", p:"Escribe el SLI de disponibilidad de los últimos 30 días: peticiones sin 5xx (<code>codigo!~\"5..\"</code>) entre todas, con el contador <code>http_requests_total</code>",
  prompt:"PromQL ›",
  sol:['sum(increase(http_requests_total{codigo!~"5.."}[30d])) / sum(increase(http_requests_total[30d]))','sum(rate(http_requests_total{codigo!~"5.."}[30d])) / sum(rate(http_requests_total[30d]))','sum(increase(http_requests_total{codigo!~"5.."}[30d]))/sum(increase(http_requests_total[30d]))','sum(rate(http_requests_total{codigo!~"5.."}[30d]))/sum(rate(http_requests_total[30d]))'],
  salida:"{}   0.99962",
  pista:"Dos sumas de increase (o de rate) con ventana [30d], la de arriba filtrando los 5xx con !~.",
  why:"99,962 % frente a un SLO del 99,9 %: queda el 62 % del presupuesto. Con ventanas tan largas, la consulta es cara: en producción se calcula con reglas de grabación de ventanas cortas y se agrega (<code>avg_over_time</code> sobre ellas)."},
 {t:"escribe", p:"Con un SLO del 99,9 % en una ventana de 30 días, ¿cuántos minutos de caída total se pueden permitir?",
  sol:["43.2","43,2","43.2 minutos","43,2 minutos","43.2 min","43,2 min"],
  pista:"30 días × 24 h × 60 min × 0,001.",
  why:"43.200 minutos × 0,001 = 43,2. Conviene saberse de memoria el orden de magnitud: tres nueves son unos 43 minutos al mes; cuatro nueves, unos 4."},
 {t:"vf", p:"El SLO interno debería ser más laxo que el SLA firmado con el cliente, para no agobiar al equipo.",
  ok:false, why:"Al revés: el SLO es más exigente que el SLA (por ejemplo, 99,9 % frente a 99,5 %), para que el equipo reaccione antes de que haya penalizaciones."},
 {t:"opcion", p:"Producto quiere un SLO del 100 % para el checkout. ¿Qué respondes?",
  ops:["Que sí, con más réplicas","Que 100 % es inalcanzable y paraliza los cambios; se propone un objetivo basado en lo que el usuario nota y en el historial, por ejemplo 99,95 %, con su presupuesto y su política","Que no se pueden poner SLO al checkout","Que el SLO lo decide el proveedor de nube"],
  ok:1, why:"Con 100 %, cualquier despliegue es un riesgo inaceptable y el presupuesto no existe. Además, las dependencias (red del usuario, pasarela de pago) ya fallan más que eso."}
]},

/* =============== U7 L4 =============== */
{
id:"ob5l2",
titulo:"Alertas por burn rate multiventana",
claves:["Burn rate: la velocidad a la que se consume el presupuesto de errores (1 = se agota justo al final de la ventana)","Varias parejas de ventanas: larga para no avisar por picos, corta para dejar de avisar en cuanto se arregla","Página con 14,4× (1 h y 5 min) o 6× (6 h y 30 min); ticket con 1× (3 días y 6 h)"],
pasos:[
 {t:"info", eti:"Alertar por objetivos", h:"Burn rate",
  c:`<p><b>Burn rate = tasa de errores actual / presupuesto</b>. Con SLO del 99,9 % (presupuesto 0,1 %), un 1,44 % de errores es un burn rate de 14,4: a ese ritmo, el presupuesto de 30 días se acaba en poco más de 2 días.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">slo 99,9 % en 30 días: las alertas recomendadas (libro de SRE de Google)</div><table class="dg-tabla"><thead><tr><th>Burn rate</th><th>Presupuesto gastado</th><th>Ventanas</th><th>Qué hacer</th></tr></thead><tbody>
       <tr><td>14,4</td><td>2 % en 1 hora (se agotaría en ~2 días)</td><td>1 h y 5 min</td><td><b>página urgente</b></td></tr>
       <tr><td>6</td><td>5 % en 6 horas (se agotaría en 5 días)</td><td>6 h y 30 min</td><td><b>página urgente</b></td></tr>
       <tr><td>1</td><td>10 % en 3 días (se agota justo en 30 días)</td><td>3 días y 6 h</td><td>ticket, no urgente</td></tr>
     </tbody></table></div>
     <p>La <b>ventana larga</b> exige que el problema sea significativo; la <b>corta</b> (1/12 de la larga) hace que la alerta se apague pocos minutos después de arreglarlo, en vez de seguir disparada una hora.</p>`},
 {t:"info", eti:"En Prometheus", h:"Reglas y alerta",
  c:`<div class="termbox">- record: job:slo_errors:ratio_rate5m
  expr: |
    sum by (job) (rate(http_requests_total{codigo=~"5.."}[5m]))
    / sum by (job) (rate(http_requests_total[5m]))
# … y lo mismo con 30m, 1h, 6h y 3d

- alert: PresupuestoErroresRapido
  expr: |
    (job:slo_errors:ratio_rate1h{job="api"} &gt; (14.4 * 0.001)
      and job:slo_errors:ratio_rate5m{job="api"} &gt; (14.4 * 0.001))
    or
    (job:slo_errors:ratio_rate6h{job="api"} &gt; (6 * 0.001)
      and job:slo_errors:ratio_rate30m{job="api"} &gt; (6 * 0.001))
  labels: { severidad: critica }
  annotations:
    resumen: "api consume el presupuesto de errores demasiado rápido"</div>
     <p>Nadie escribe esto a mano para cada servicio: herramientas como <b>Sloth</b> o <b>Pyrra</b> (o la especificación OpenSLO) generan las reglas de grabación, las alertas y los paneles a partir de una definición corta del SLO.</p>`},
 {t:"codigo", p:"Calcula el burn rate y decide si hay que avisar",
  lenguaje:"js",
  c:`<p>La primera línea es el SLO (por ejemplo <code>99.9</code>). Después, cinco líneas <code>ventana tasa_de_error</code> para <code>5m</code>, <code>30m</code>, <code>1h</code>, <code>6h</code> y <code>3d</code>. Con presupuesto <code>b = (100 − slo) / 100</code>:</p>
     <ul><li><code>PAGINA</code> si (1h &gt; 14,4·b y 5m &gt; 14,4·b) o (6h &gt; 6·b y 30m &gt; 6·b)</li><li>si no, <code>TICKET</code> si 3d &gt; b y 6h &gt; b</li><li>si no, <code>NADA</code></li></ul>
     <p>Imprime <code>burn1h=16.0 burn6h=3.0 decision=PAGINA</code> (burn rates con un decimal).</p>`,
  plantilla:"const [sloTxt, ...resto] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst b = (100 - Number(sloTxt)) / 100;\nconst t = {};\nfor (const l of resto) { const [v, x] = l.trim().split(/\\s+/); t[v] = Number(x); }\n\nlet decision = \"NADA\";\n// aplica las reglas de las ventanas\n\nconsole.log(\"burn1h=\" + (t[\"1h\"] / b).toFixed(1) + \" burn6h=\" + (t[\"6h\"] / b).toFixed(1) + \" decision=\" + decision);\n",
  pruebas:[{entrada:"99.9\n5m 0.02\n30m 0.004\n1h 0.016\n6h 0.003\n3d 0.0012\n", salida:"burn1h=16.0 burn6h=3.0 decision=PAGINA"},{entrada:"99.9\n5m 0.001\n30m 0.008\n1h 0.007\n6h 0.0065\n3d 0.002\n", salida:"burn1h=7.0 burn6h=6.5 decision=PAGINA", oculta:true},{entrada:"99.9\n5m 0.0005\n30m 0.0015\n1h 0.0012\n6h 0.0015\n3d 0.0011\n", salida:"burn1h=1.2 burn6h=1.5 decision=TICKET", oculta:true},{entrada:"99.5\n5m 0.01\n30m 0.004\n1h 0.02\n6h 0.003\n3d 0.004\n", salida:"burn1h=4.0 burn6h=0.6 decision=NADA", oculta:true}],
  pista:"if ((t[\"1h\"] > 14.4 * b && t[\"5m\"] > 14.4 * b) || (t[\"6h\"] > 6 * b && t[\"30m\"] > 6 * b)) decision = \"PAGINA\"; else if (…) decision = \"TICKET\";",
  solucion:"const [sloTxt, ...resto] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst b = (100 - Number(sloTxt)) / 100;\nconst t = {};\nfor (const l of resto) { const [v, x] = l.trim().split(/\\s+/); t[v] = Number(x); }\n\nlet decision = \"NADA\";\nif ((t[\"1h\"] > 14.4 * b && t[\"5m\"] > 14.4 * b) || (t[\"6h\"] > 6 * b && t[\"30m\"] > 6 * b)) decision = \"PAGINA\";\nelse if (t[\"3d\"] > b && t[\"6h\"] > b) decision = \"TICKET\";\n\nconsole.log(\"burn1h=\" + (t[\"1h\"] / b).toFixed(1) + \" burn6h=\" + (t[\"6h\"] / b).toFixed(1) + \" decision=\" + decision);\n",
  why:"Fíjate en el tercer caso: un 0,12 % de errores sostenido no despierta a nadie, pero abre un ticket, porque a ese ritmo el SLO del mes se incumple. Y en el cuarto, un 2 % de errores en la última hora no avisa con un SLO del 99,5 %: es un burn rate de 4."},
 {t:"par", p:"Empareja cada pareja de ventanas con su propósito",
  pares:[["1 h y 5 min, burn 14,4","Caídas graves: avisar en minutos"],["6 h y 30 min, burn 6","Degradaciones serias pero más lentas"],["3 días y 6 h, burn 1","Erosión lenta: ticket para esta semana"],["La ventana corta de cada pareja","Que la alerta se apague poco después de arreglarlo"]],
  why:"Con una sola ventana larga, la alerta tarda en saltar y tarda en apagarse; con una sola corta, salta con cada pico."},
 {t:"opcion", p:"¿Qué ventaja tiene alertar por burn rate frente a «error rate &gt; 1%»?",
  ops:["Ninguna","Relaciona la alerta con el objetivo real: avisa rápido de lo grave y no molesta por picos que no ponen en riesgo el SLO","Es más fácil de escribir","No necesita métricas"],
  ok:1, why:"Un umbral fijo es a la vez demasiado sensible (picos de un minuto) y demasiado ciego (un 0,5 % sostenido que se come el SLO sin avisar)."},
 {t:"hueco", p:"Completa la condición de la alerta rápida para un SLO del 99,9 %",
  tpl:"job:slo_errors:ratio_rate1h > (___ * 0.001)\n  ___ job:slo_errors:ratio_rate5m > (14.4 * 0.001)",
  banco:["14.4","and","or","6","unless","1"],
  sol:["14.4","and"],
  why:"<code>and</code> exige que se cumplan las dos ventanas a la vez. Las parejas entre sí se unen con <code>or</code>."},
 {t:"vf", p:"Un burn rate de 1 sostenido durante toda la ventana significa que se incumple el SLO.",
  ok:false, why:"Burn rate 1 gasta exactamente el presupuesto al terminar la ventana: se cumple justo. Por encima de 1 sostenido, se incumple."},
 {t:"escribe", p:"Con un SLO del 99,9 %, la tasa de errores de la última hora es del 0,6 %. ¿Cuál es el burn rate?",
  sol:["6","6x","6×","seis"],
  pista:"Tasa de errores dividida entre el presupuesto (0,1 %).",
  why:"0,6 / 0,1 = 6. Si dura 6 horas, habrás gastado el 5 % del presupuesto del mes: dispara la segunda alerta de página."}
]}

]});
