window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Maestría: decisiones, incidentes y entrevista",
resumen: "Decisiones de diseño de un backend en Node, un caso completo, incidentes reales de producción y un simulacro de entrevista con ejercicio de pizarra",
nivel: "Maestro",
color: "#4b8a28",
lecciones: [

/* =============== U13 L1 =============== */
{
id:"nd13n1",
titulo:"Decisiones de diseño y un caso completo",
claves:["Elegir framework, acceso a datos y forma de desplegar según el equipo y el problema, no por moda","Idempotencia, tiempos de espera y colas convierten una API frágil en una robusta","Saber cuándo Node no es la herramienta: CPU intensiva sostenida o cálculo numérico"],
pasos:[
 {t:"info", eti:"Elegir", h:"Las decisiones que tomarás",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">decisiones típicas de un backend en Node</div>
       <table class="dg-tabla"><thead><tr><th>decisión</th><th>opción sencilla</th><th>cuándo cambiar</th></tr></thead><tbody>
       <tr><td>framework</td><td>Express 5 o Fastify</td><td>NestJS con equipos grandes y mucho dominio</td></tr>
       <tr><td>acceso a datos</td><td>Drizzle/Kysely o pg con SQL</td><td>Prisma si prima la productividad y el tipado del modelo</td></tr>
       <tr><td>lenguaje</td><td>TypeScript compilado</td><td>JavaScript con JSDoc en scripts y herramientas pequeñas</td></tr>
       <tr><td>trabajo lento</td><td>cola (BullMQ, SQS)</td><td>worker_threads si es CPU corta dentro de la petición</td></tr>
       <tr><td>despliegue</td><td>contenedor, un proceso, varias réplicas</td><td>serverless si el tráfico es muy irregular</td></tr>
       <tr><td>runtime</td><td>Node LTS</td><td>Bun o Deno si el equipo lo domina y las dependencias lo soportan</td></tr>
       </tbody></table></div>
     <p><b>Cuándo no usar Node</b>: cálculo numérico o de CPU sostenido (vídeo, ML, simulaciones) va mejor en Go, Rust, Java o Python con librerías nativas; Node puede orquestarlo.</p>`},
 {t:"info", eti:"Caso completo", h:"API de pedidos que no pierde dinero",
  c:`<p>Enunciado: una API de pedidos que cobra con una pasarela externa, envía un correo y genera la factura en PDF. Debe aguantar reintentos del cliente, caídas de la pasarela y despliegues sin cortar nada.</p>
     <div class="dg"><div class="dg-tit">flujo de POST /pedidos</div>
       <div class="dg-vert"><div class="dg-caja">validar con zod y autenticar (JWT corto)</div><div class="dg-caja acento">Idempotency-Key: si ya se procesó, devolver la misma respuesta</div><div class="dg-caja">transacción: crear pedido + fila en «outbox»</div><div class="dg-caja">cobrar con timeout y reintentos solo si la pasarela admite clave de idempotencia</div><div class="dg-caja ok">201 al cliente</div><div class="dg-caja base">worker: lee el outbox → correo y PDF en una cola, con reintentos</div></div></div>
     <p>Y alrededor: logs de pino con reqId, métricas RED y del event loop, trazas OpenTelemetry, readiness con dependencias, SIGTERM que termina lo que está en curso, imagen sin root y migraciones expandir/contraer.</p>
     <div class="nota dato"><b class="tit">Frase de entrevista</b>«Todo lo que no tiene que pasar dentro de la petición, sale de la petición; y todo lo que puede repetirse, es idempotente.»</div>`},
 {t:"par", p:"Empareja cada requisito con la técnica",
  pares:[["El cliente reintenta un POST de pago por un timeout","Clave de idempotencia"],["Guardar el pedido y avisar a otro servicio sin perder el aviso","Patrón outbox en la misma transacción"],["La pasarela de pagos va lenta","Timeout, reintentos limitados y circuit breaker"],["Generar un PDF de 3 s","Cola de trabajos y responder sin esperar"],["Desplegar sin cortar pedidos","SIGTERM + readiness + réplicas"]],
  why:"Cada técnica tapa un modo de fallo concreto. Juntas son lo que separa una demo de un servicio de producción."},
 {t:"opcion", p:"Un equipo de 4 personas empieza una API sencilla de catálogo. Proponen NestJS, microservicios, Kafka y GraphQL desde el primer día. ¿Qué respondes?",
  ops:["Perfecto, así escala","Empezar simple: un monolito modular con Express o Fastify, PostgreSQL y una cola si hace falta; separar cuando haya un motivo medido","Mejor en Go","Sin base de datos"],
  ok:1, why:"La complejidad tiene un coste diario. Se añade cuando un problema real la justifica, no por si acaso."},
 {t:"opcion", p:"¿Por qué el patrón outbox y no «guardar el pedido y luego publicar el evento en la cola»?",
  ops:["Por rendimiento","Si el proceso muere entre las dos operaciones, el pedido existe pero el evento se pierde. Con outbox, pedido y evento se guardan en la misma transacción y un proceso aparte lo publica","Porque las colas no admiten JSON","Para ahorrar Redis"],
  ok:1, why:"Dos sistemas distintos (base de datos y cola) no comparten transacción. Outbox convierte el problema en uno de una sola base de datos."},
 {t:"vf", p:"Node es una buena elección para un servicio que pasa la mayor parte del tiempo esperando a bases de datos y otras APIs.",
  ok:true, why:"Es justo su punto fuerte: E/S concurrente con poco consumo de memoria."},
 {t:"codigo", p:"Implementa claves de idempotencia: <code>procesar(clave, cuerpo)</code> cobra solo la primera vez que ve una clave; las repeticiones devuelven la misma respuesta sin volver a cobrar. Si la misma clave llega con otro cuerpo, responde <code>422</code>",
  lenguaje:"js",
  c:`<p>stdin: una petición por línea, <code>clave importe</code>. Imprime la respuesta de cada una y al final <code>cobros=N</code>. La respuesta de un cobro nuevo es <code>201 cobro-N</code> (N es el número de cobro).</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst vistas = new Map();\nlet cobros = 0;\n\nfunction procesar(clave, cuerpo) {\n  // ...\n}\n\nfor (const l of lineas) {\n  const [clave, importe] = l.split(\" \");\n  console.log(procesar(clave, importe));\n}\nconsole.log(\"cobros=\" + cobros);\n",
  pruebas:[{entrada:"a1 50\na1 50\nb2 20\n", salida:"201 cobro-1\n201 cobro-1\n201 cobro-2\ncobros=2"},{entrada:"x 10\nx 99\nx 10\n", salida:"201 cobro-1\n422\n201 cobro-1\ncobros=1"},{entrada:"k 5\nm 5\nk 5\nm 6\n", salida:"201 cobro-1\n201 cobro-2\n201 cobro-1\n422\ncobros=2", oculta:true}],
  pista:"Guarda en vistas: clave → { cuerpo, respuesta }. Si existe y el cuerpo coincide, devuelve la respuesta guardada; si no coincide, \"422\". Si no existe, cobros++ y guarda.",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst vistas = new Map();\nlet cobros = 0;\n\nfunction procesar(clave, cuerpo) {\n  const previa = vistas.get(clave);\n  if (previa) return previa.cuerpo === cuerpo ? previa.respuesta : \"422\";\n  cobros++;\n  const respuesta = \"201 cobro-\" + cobros;\n  vistas.set(clave, { cuerpo, respuesta });\n  return respuesta;\n}\n\nfor (const l of lineas) {\n  const [clave, importe] = l.split(\" \");\n  console.log(procesar(clave, importe));\n}\nconsole.log(\"cobros=\" + cobros);",
  why:"Es el modelo de Stripe. En producción las claves van a la base de datos o a Redis con caducidad, con una restricción única y un estado «en curso» para dos peticiones simultáneas con la misma clave."}
]},

/* =============== U13 L2 =============== */
{
id:"nd8l2",
titulo:"Casos reales de Node en producción",
claves:["Latencia global alta: event loop bloqueado (código síncrono, regex, JSON enorme)","Memoria creciente: fugas por cachés, listeners o temporizadores","Reinicios en bucle: errores no capturados, OOMKilled o probes mal configuradas"],
pasos:[
 {t:"info", eti:"Método", h:"Cómo atacar un incidente",
  c:`<div class="dg"><div class="dg-tit">de la alerta a la causa</div>
       <div class="dg-vert"><div class="dg-caja aviso">síntoma<small>p99 alto, 5xx, reinicios, memoria</small></div><div class="dg-caja">¿qué cambió?<small>despliegue, tráfico, dependencia, datos</small></div><div class="dg-caja">¿afecta a todo o a una parte?<small>todas las rutas = proceso; una ruta = su código o su dependencia</small></div><div class="dg-caja acento">medir<small>event loop, heap, pool, trazas, logs con reqId</small></div><div class="dg-caja ok">mitigar primero (revertir, escalar), arreglar después</div></div></div>
     <p>Pregunta clave en Node: <b>¿están lentas todas las rutas a la vez?</b> Si sí, casi siempre es el event loop bloqueado o el proceso sin memoria. Si solo una, su consulta o su dependencia externa.</p>`},
 {t:"opcion", p:"Caso 1: tras añadir una validación con una expresión regular compleja, algunas peticiones tardan 30 segundos y todo el servidor se congela. ¿Qué es?",
  ops:["La red","ReDoS: una regex con retroceso catastrófico bloquea el event loop con ciertas entradas","Falta memoria","Un bug de Express"],
  ok:1, why:"Evita regex con cuantificadores anidados sobre entrada del usuario, limita la longitud y usa librerías probadas."},
 {t:"opcion", p:"Caso 2: el contenedor reinicia cada pocas horas con «JavaScript heap out of memory». ¿Qué haces?",
  ops:["Subir la memoria sin más","Tomar un heap snapshot (--heapsnapshot-near-heap-limit o el inspector), comparar dos momentos y buscar qué crece: cachés sin límite, listeners o closures","Reiniciar cada hora","Quitar los logs"],
  ok:1, why:"Y ajustar --max-old-space-size al límite del contenedor, igual que en Java."},
 {t:"opcion", p:"Caso 3: en cada despliegue en Kubernetes aparecen errores 502 durante unos segundos. ¿Qué revisas?",
  ops:["El DNS","Que la app maneje SIGTERM (terminar peticiones en curso), que el contenedor no arranque con npm, y que haya readinessProbe y un pequeño preStop","El tamaño de la imagen","La versión de npm"],
  ok:1, why:"El apagado elegante del curso de Kubernetes, aplicado a Node."},
 {t:"opcion", p:"Caso 4: con carga moderada, la API empieza a devolver timeouts, la CPU está al 15 % y la base de datos tranquila. Los logs muestran «timeout exceeded when trying to connect». ¿Qué pasa?",
  ops:["Falta CPU","El pool de conexiones está agotado: alguna ruta no libera el cliente (falta release en un camino de error) o hay transacciones abiertas esperando a APIs externas","La base de datos está caída","Un problema de DNS"],
  ok:1, why:"CPU baja y base de datos tranquila con timeouts de conexión es la huella clásica de un pool con fugas. El finally con release() es obligatorio."},
 {t:"opcion", p:"Caso 5: detrás de un balanceador de AWS aparecen 502 sueltos, sin patrón, con tráfico normal. ¿Qué ajuste de Node sospechas?",
  ops:["El tamaño del heap","keepAliveTimeout de Node menor que el tiempo de inactividad del balanceador: Node cierra conexiones que el balanceador cree vivas","El número de réplicas","La versión de Express"],
  ok:1, why:"El balanceador reutiliza una conexión que Node acaba de cerrar. Sube keepAliveTimeout (y headersTimeout) por encima del del balanceador."},
 {t:"par", p:"Empareja cada síntoma con la herramienta de diagnóstico",
  pares:[["CPU al 100 % sin saber por qué","--cpu-prof o clinic flame"],["Memoria creciente","Heap snapshots comparados"],["Latencia alta en todas las rutas","Retraso del event loop (monitorEventLoopDelay)"],["Promesas rechazadas sin gestionar","process.on(\"unhandledRejection\") y logs"],["Una petición lenta entre varios servicios","Trazas de OpenTelemetry"]],
  why:"Medir antes de cambiar nada, como siempre."},
 {t:"codigo", p:"Analiza los logs de un incidente: stdin trae líneas JSON de pino con <code>ruta</code>, <code>estado</code> y <code>ms</code>. Imprime la ruta con más errores 5xx, cuántos tuvo y la duración máxima de esa ruta",
  lenguaje:"js",
  c:`<p>Formato: <code>RUTA errores=N max=M</code>. Ignora las líneas que no sean JSON válido (en los logs reales siempre se cuela alguna). En caso de empate, la que aparece primero.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n// agrupa por ruta y encuentra la peor\n",
  pruebas:[{entrada:"{\"ruta\":\"/api/pedidos\",\"estado\":502,\"ms\":3000}\n{\"ruta\":\"/api/tareas\",\"estado\":200,\"ms\":12}\n{\"ruta\":\"/api/pedidos\",\"estado\":504,\"ms\":10000}\n{\"ruta\":\"/api/tareas\",\"estado\":500,\"ms\":40}\n", salida:"/api/pedidos errores=2 max=10000"},{entrada:"arrancando...\n{\"ruta\":\"/a\",\"estado\":500,\"ms\":5}\n{\"ruta\":\"/b\",\"estado\":503,\"ms\":9}\n{\"ruta\":\"/a\",\"estado\":200,\"ms\":80}\n", salida:"/a errores=1 max=80", oculta:true}],
  pista:"Un Map ruta → { errores, max }. try { JSON.parse } catch { continue }. Error si estado >= 500. Recorre el Map y quédate con la mayor cuenta (con &gt; estricto, gana la primera).",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst rutas = new Map();\nfor (const l of lineas) {\n  let e;\n  try { e = JSON.parse(l); } catch { continue; }\n  const r = rutas.get(e.ruta) ?? { errores: 0, max: 0 };\n  if (e.estado >= 500) r.errores++;\n  r.max = Math.max(r.max, e.ms);\n  rutas.set(e.ruta, r);\n}\nlet peor = null;\nfor (const [ruta, r] of rutas) if (!peor || r.errores > peor[1].errores) peor = [ruta, r];\nconsole.log(peor[0] + \" errores=\" + peor[1].errores + \" max=\" + peor[1].max);",
  why:"En un incidente real harías esta misma pregunta en Loki o CloudWatch Logs Insights. Por eso los logs JSON con campos fijos valen oro: se consultan como una tabla."}
]},

/* =============== U13 L3 =============== */
{
id:"nd8l1",
titulo:"Simulacro de entrevista de Node.js",
claves:["Sabes explicar el event loop, las microtareas, libuv y sus límites","Dominas HTTP, frameworks, bases de datos, seguridad y pruebas","Sabes llevar Node a producción: señales, logs, métricas, réplicas y Docker"],
pasos:[
 {t:"info", eti:"Último tramo", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir. En una entrevista real, la respuesta correcta es el mínimo: lo que puntúa es el porqué, un ejemplo de producción y los límites de cada técnica.</p>`},
 {t:"opcion", p:"«¿Cómo atiende Node miles de conexiones con un solo hilo?»",
  ops:["Crea un hilo por conexión","La E/S es asíncrona: se delega al sistema operativo (y al pool de libuv) y el event loop ejecuta los callbacks cuando terminan, así el hilo nunca espera parado","Usa varios procesos siempre","No puede"],
  ok:1, why:"Añade el límite: el trabajo de CPU sí bloquea."},
 {t:"opcion", p:"«¿Qué ocurre si haces un cálculo síncrono de 2 segundos en una ruta?»",
  ops:["Solo se retrasa esa petición","Se bloquea el event loop: todas las peticiones del proceso esperan esos 2 segundos","Node lo pasa a otro hilo automáticamente","Nada"],
  ok:1, why:"Soluciones: worker_threads, colas o un servicio aparte."},
 {t:"opcion", p:"«¿Diferencia entre process.nextTick, microtareas y setImmediate?»",
  ops:["Son lo mismo","nextTick se ejecuta antes que las microtareas de promesas, ambas antes de la siguiente fase del event loop; setImmediate se ejecuta en la fase check, tras la E/S","setImmediate es inmediato","nextTick es un temporizador"],
  ok:1, why:"Puntos extra: en ES modules el orden entre nextTick y promesas cambia, y abusar de nextTick deja sin turno a la E/S."},
 {t:"opcion", p:"«¿Cómo escalarías una API de Node en un servidor de 8 núcleos o en Kubernetes?»",
  ops:["Subiendo la memoria","Varias réplicas del proceso (cluster, PM2 o pods), sin estado en memoria: sesiones y caché en Redis, y un balanceador delante","Un solo proceso más rápido","Con setTimeout"],
  ok:1, why:"Igual que con cualquier servicio sin estado."},
 {t:"opcion", p:"«¿Cómo manejas los errores en una API de Express?»",
  ops:["try/catch en cada línea","Validar la entrada, lanzar errores con significado, un middleware de errores central que responde de forma coherente sin filtrar detalles, y process.on(\"unhandledRejection\") para registrar y reiniciar si hace falta","Ignorarlos","console.log y seguir"],
  ok:1, why:"Un proceso en estado desconocido es mejor reiniciarlo: el orquestador lo levantará."},
 {t:"opcion", p:"«¿Qué es la contrapresión en streams y qué pasa si la ignoras?»",
  ops:["Un error de compresión","El mecanismo por el que un destino lento frena a un origen rápido (write devuelve false, esperar a drain); si se ignora, los datos se acumulan en memoria hasta agotarla","Una forma de cifrar","Un tipo de stream"],
  ok:1, why:"pipeline la gestiona por ti. Ejemplo real: exportar un CSV enorme a un cliente con mala conexión."},
 {t:"opcion", p:"«¿Qué cosas usan el pool de hilos de libuv y por qué importa?»",
  ops:["Todas las peticiones HTTP","fs, dns.lookup, crypto (pbkdf2, scrypt…) y zlib asíncrono: con 4 hilos por defecto, muchas operaciones de ese tipo hacen cola y se frenan entre sí","Solo los timers","Nada, libuv no tiene hilos"],
  ok:1, why:"UV_THREADPOOL_SIZE lo amplía. La red no usa el pool: usa epoll, kqueue o IOCP."},
 {t:"vf", p:"«ES modules y CommonJS pueden convivir en el mismo proyecto.»",
  ok:true, why:"ESM importa CommonJS directamente; CommonJS carga ESM con import() dinámico y, desde Node 22.12, con require() si el módulo no usa await de nivel superior."},
 {t:"par", p:"Empareja cada síntoma con su causa típica en Node",
  pares:[["Todas las rutas lentas a la vez","Código síncrono que bloquea el event loop"],["La API se cuelga tras un rato con carga","Conexiones del pool no liberadas"],["Memoria que crece sin parar","Fuga: cachés sin límite o listeners acumulados"],["Peticiones cortadas en cada despliegue","No se maneja SIGTERM"]],
  why:"Los mismos patrones de incidentes que en Java, con otro vocabulario."},
 {t:"escribe", p:"¿Qué método del módulo <code>node:stream/promises</code> conecta varios streams, propaga errores y los cierra todos?",
  sol:["pipeline","pipeline()","stream.pipeline"], pista:"Tubería, en inglés.",
  why:"Frente a .pipe() encadenado, que no propaga errores ni cierra el resto."},
 {t:"codigo", p:"Ejercicio de pizarra clásico: implementa tu propio EventEmitter con <code>on</code>, <code>off</code>, <code>once</code> y <code>emit</code> (que devuelve si había listeners)",
  lenguaje:"js",
  c:`<p>Salida con la plantilla: <code>a 1</code>, <code>b 1</code>, <code>true</code>, <code>a 2</code>, <code>false</code>.</p>`,
  plantilla:"class Emisor {\n  constructor() { this.l = new Map(); }\n  on(ev, fn) { /* ... */ return this; }\n  off(ev, fn) { /* ... */ return this; }\n  once(ev, fn) { /* ... */ return this; }\n  emit(ev, ...args) { /* ... */ }\n}\n\nconst e = new Emisor();\nconst a = x => console.log(\"a \" + x);\ne.on(\"dato\", a);\ne.once(\"dato\", x => console.log(\"b \" + x));\nconsole.log(e.emit(\"dato\", 1));\ne.emit(\"dato\", 2);\ne.off(\"dato\", a);\nconsole.log(e.emit(\"dato\", 3));\n",
  pruebas:[{salida:"a 1\nb 1\ntrue\na 2\nfalse"}],
  pista:"emit debe recorrer una COPIA de la lista ([...lista]) para que once pueda quitarse durante el recorrido. once envuelve fn en una función que primero hace off de sí misma.",
  solucion:"class Emisor {\n  constructor() { this.l = new Map(); }\n  on(ev, fn) { if (!this.l.has(ev)) this.l.set(ev, []); this.l.get(ev).push(fn); return this; }\n  off(ev, fn) { const lista = this.l.get(ev); if (lista) this.l.set(ev, lista.filter(f => f !== fn)); return this; }\n  once(ev, fn) { const envoltura = (...args) => { this.off(ev, envoltura); fn(...args); }; return this.on(ev, envoltura); }\n  emit(ev, ...args) {\n    const lista = this.l.get(ev);\n    if (!lista || !lista.length) return false;\n    for (const fn of [...lista]) fn(...args);\n    return true;\n  }\n}\n\nconst e = new Emisor();\nconst a = x => console.log(\"a \" + x);\ne.on(\"dato\", a);\ne.once(\"dato\", x => console.log(\"b \" + x));\nconsole.log(e.emit(\"dato\", 1));\ne.emit(\"dato\", 2);\ne.off(\"dato\", a);\nconsole.log(e.emit(\"dato\", 3));",
  why:"Los detalles que busca el entrevistador: copiar la lista antes de recorrerla, que once se quite antes de llamar (por si el listener vuelve a emitir) y que emit sea síncrono. Menciona también el caso especial del evento «error»."},
 {t:"info", eti:"Terminado", h:"Has completado Node.js",
  c:`<p>Dominas el runtime por dentro (V8, libuv, el event loop y sus colas), módulos y npm, ficheros, buffers y streams, HTTP con Express y Fastify, bases de datos, autenticación y seguridad, pruebas, configuración y logs, concurrencia y rendimiento, y el despliegue y la observabilidad en producción.</p>
     <p>Para consolidarlo: construye la API de pedidos del caso completo con Fastify o Express, PostgreSQL con Drizzle o Prisma, una cola con BullMQ, pruebas con node:test y Testcontainers, pino, métricas y un Dockerfile de producción, y provoca a propósito los incidentes de este curso (bloquear el event loop, agotar el pool, cortar un despliegue) para verlos en tus propias métricas.</p>`}
]}

]});
