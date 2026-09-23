window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Asincronía y el event loop",
resumen: "Callbacks, promesas y async/await, las fases del event loop, microtareas y process.nextTick, libuv, el pool de hilos y cómo no bloquear nunca el proceso",
nivel: "Intermedio",
color: "#72b24d",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"nd3n1",
titulo:"Callbacks, promesas y async/await",
claves:["Las APIs clásicas usan callbacks con el error primero; util.promisify las convierte en promesas","await en serie suma los tiempos; Promise.all los solapa","Promise.allSettled, race y any; cancelar con AbortSignal"],
pasos:[
 {t:"info", eti:"Tres estilos", h:"De callbacks a async/await",
  c:`<div class="termbox">// 1. callback con el error primero (estilo clásico de Node)
fs.readFile("config.json", "utf8", (err, texto) =&gt; {
  if (err) return console.error(err);
  console.log(texto);
});

// 2. promesas
import { readFile } from "node:fs/promises";
readFile("config.json", "utf8").then(console.log).catch(console.error);

// 3. async/await: promesas escritas como código secuencial
try {
  const texto = await readFile("config.json", "utf8");
} catch (err) { ... }

// convertir una API de callbacks en promesas
import { promisify } from "node:util";
const scrypt = promisify(crypto.scrypt);</div>
     <p>Casi todos los módulos de Node tienen su versión con promesas: <code>node:fs/promises</code>, <code>node:timers/promises</code>, <code>node:stream/promises</code>, <code>node:dns/promises</code>…</p>`},
 {t:"info", eti:"Paralelo", h:"En serie o a la vez",
  c:`<div class="termbox">// en serie: 300 + 300 + 300 = ~900 ms
const u = await getUsuario(id);
const p = await getPedidos(id);
const f = await getFacturas(id);

// a la vez: ~300 ms (las tres esperas se solapan)
const [u, p, f] = await Promise.all([getUsuario(id), getPedidos(id), getFacturas(id)]);</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">combinadores de promesas</div>
       <table class="dg-tabla"><thead><tr><th>método</th><th>se resuelve cuando…</th><th>falla cuando…</th></tr></thead><tbody>
       <tr><td>Promise.all</td><td>todas se cumplen</td><td>la primera falla</td></tr>
       <tr><td>Promise.allSettled</td><td>todas terminan (bien o mal)</td><td>nunca</td></tr>
       <tr><td>Promise.race</td><td>la primera termina</td><td>la primera que termina falla</td></tr>
       <tr><td>Promise.any</td><td>la primera se cumple</td><td>fallan todas (AggregateError)</td></tr>
       </tbody></table></div>
     <div class="termbox">// cancelar si tarda más de 3 s
const r = await fetch(url, { signal: AbortSignal.timeout(3000) });</div>`},
 {t:"opcion", p:"Un endpoint hace tres consultas independientes con tres <code>await</code> seguidos y tarda 900 ms. ¿Cómo lo mejoras sin tocar la base de datos?",
  ops:["Añadiendo más await","Lanzándolas a la vez con Promise.all: tarda lo que la más lenta","Con setTimeout","Con readFileSync"],
  ok:1, why:"Solo si son independientes. Si la segunda necesita el resultado de la primera, tienen que ir en serie."},
 {t:"par", p:"Empareja cada necesidad con el combinador",
  pares:[["Necesito los tres resultados y si uno falla, todo falla","Promise.all"],["Quiero saber cuáles fueron bien y cuáles mal","Promise.allSettled"],["Me vale la primera réplica que responda bien","Promise.any"],["Poner un límite de tiempo a una operación","Promise.race con un temporizador (o AbortSignal.timeout)"]],
  why:"allSettled es ideal para enviar notificaciones en lote: una que falle no debe anular las demás."},
 {t:"vf", p:"Dentro de <code>arr.forEach(async x =&gt; await guardar(x))</code>, forEach espera a que termine cada guardado.",
  ok:false, why:"forEach ignora las promesas que devuelve el callback: lanza todo a la vez y sigue sin esperar. Usa for...of con await (en serie) o Promise.all(arr.map(...)) (a la vez)."},
 {t:"codigo", p:"Convierte una función de callbacks en promesa con <code>util.promisify</code> y úsala con <code>await</code>",
  lenguaje:"js",
  c:`<p><code>dividir(a, b, cb)</code> llama a <code>cb(error, resultado)</code>. Imprime el resultado de <code>dividir(10, 4)</code> y, para <code>dividir(1, 0)</code>, captura el error e imprime su mensaje. Salida: <code>2.5</code> y <code>división por cero</code>.</p>`,
  plantilla:"const { promisify } = require(\"node:util\");\nfunction dividir(a, b, cb) {\n  setTimeout(() => b === 0 ? cb(new Error(\"división por cero\")) : cb(null, a / b), 10);\n}\n// crea dividirP con promisify y úsala\n",
  pruebas:[{salida:"2.5\ndivisión por cero"}],
  pista:"const dividirP = promisify(dividir); dentro de una función async: console.log(await dividirP(10, 4)); y un try/catch para el segundo.",
  solucion:"const { promisify } = require(\"node:util\");\nfunction dividir(a, b, cb) {\n  setTimeout(() => b === 0 ? cb(new Error(\"división por cero\")) : cb(null, a / b), 10);\n}\nconst dividirP = promisify(dividir);\n(async () => {\n  console.log(await dividirP(10, 4));\n  try {\n    await dividirP(1, 0);\n  } catch (e) {\n    console.log(e.message);\n  }\n})();",
  why:"promisify funciona con cualquier función cuyo último argumento sea un callback (err, valor). El error del callback se convierte en un rechazo que captura try/catch."},
 {t:"codigo", p:"Envía notificaciones en lote con <code>Promise.allSettled</code> e imprime cuántas fueron bien y cuántas fallaron",
  lenguaje:"js",
  c:`<p><code>notificar(id)</code> falla con los ids múltiplos de 3. Para los ids 1 a 7, la salida es <code>ok=5 fallos=2</code>.</p>`,
  plantilla:"const notificar = id => new Promise((ok, mal) => setTimeout(() => id % 3 === 0 ? mal(new Error(\"fallo \" + id)) : ok(id), 5));\nconst ids = [1, 2, 3, 4, 5, 6, 7];\n// lánzalas todas a la vez y cuenta resultados\n",
  pruebas:[{salida:"ok=5 fallos=2"}],
  pista:"const r = await Promise.allSettled(ids.map(notificar)); cada elemento tiene status \"fulfilled\" o \"rejected\".",
  solucion:"const notificar = id => new Promise((ok, mal) => setTimeout(() => id % 3 === 0 ? mal(new Error(\"fallo \" + id)) : ok(id), 5));\nconst ids = [1, 2, 3, 4, 5, 6, 7];\nPromise.allSettled(ids.map(notificar)).then(r => {\n  const ok = r.filter(x => x.status === \"fulfilled\").length;\n  console.log(\"ok=\" + ok + \" fallos=\" + (r.length - ok));\n});",
  why:"Con Promise.all, el primer fallo habría rechazado todo y no sabrías qué notificaciones salieron. En un lote, cada elemento tiene su propio destino."}
]},

/* =============== U3 L2 =============== */
{
id:"nd3n2",
titulo:"El event loop por fases",
claves:["El event loop recorre fases: timers, pending, poll, check y close","poll espera la E/S; check ejecuta setImmediate; timers, los setTimeout vencidos","Un temporizador marca un mínimo, no una hora exacta"],
pasos:[
 {t:"info", eti:"El corazón de Node", h:"Las fases del event loop",
  c:`<p>Cuando tu script principal termina, Node entra en el <b>event loop</b>: una vuelta tras otra, mientras quede algo pendiente (temporizadores, sockets abiertos, ficheros por leer). Cada vuelta pasa por fases, y cada fase tiene su cola de callbacks.</p>
     <div class="dg"><div class="dg-tit">una vuelta del event loop</div>
       <svg viewBox="0 0 340 250" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Ciclo de fases del event loop: timers, pending, poll, check y close, y vuelta a timers; entre callback y callback se vacían nextTick y las microtareas">
         <defs><marker id="fl-nd3-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
         <g stroke="var(--accent)" stroke-width="2" fill="none" marker-end="url(#fl-nd3-1)">
           <path d="M225,42 Q255,55 262,82"/>
           <path d="M272,120 Q275,160 252,183"/>
           <path d="M178,204 L164,204"/>
           <path d="M88,184 Q62,160 66,121"/>
           <path d="M86,84 Q95,52 113,45"/>
         </g>
         <g font-family="var(--mono)" font-size="13" text-anchor="middle">
           <rect x="115" y="24" width="110" height="34" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/>
           <text x="170" y="46" fill="var(--ink)">timers</text>
           <rect x="220" y="84" width="110" height="34" rx="8" fill="var(--bg-2)" stroke="var(--line-2)"/>
           <text x="275" y="106" fill="var(--ink)">pending</text>
           <rect x="180" y="186" width="110" height="34" rx="8" fill="var(--ok-soft)" stroke="var(--ok)"/>
           <text x="235" y="208" fill="var(--ink)">poll (E/S)</text>
           <rect x="50" y="186" width="110" height="34" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/>
           <text x="105" y="208" fill="var(--ink)">check</text>
           <rect x="10" y="84" width="110" height="34" rx="8" fill="var(--bg-2)" stroke="var(--line-2)"/>
           <text x="65" y="106" fill="var(--ink)">close</text>
         </g>
         <g font-family="var(--sans)" font-size="12" text-anchor="middle" fill="var(--ink-2)">
           <text x="170" y="138">entre callback y callback:</text>
           <text x="170" y="155">nextTick y microtareas</text>
         </g>
       </svg></div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué se ejecuta en cada fase</div>
       <table class="dg-tabla"><tbody>
       <tr><td>timers</td><td>callbacks de setTimeout y setInterval ya vencidos</td></tr>
       <tr><td>pending</td><td>algunos callbacks de sistema aplazados (errores TCP…)</td></tr>
       <tr><td>poll</td><td>recoge la E/S terminada y ejecuta sus callbacks; si no hay nada, espera aquí</td></tr>
       <tr><td>check</td><td>callbacks de setImmediate</td></tr>
       <tr><td>close</td><td>eventos close (socket.on("close"))</td></tr>
       </tbody></table></div>`},
 {t:"info", eti:"Consecuencias", h:"Lo que implica en la práctica",
  c:`<ul><li><b>setTimeout(fn, 100)</b> significa «no antes de 100 ms». Si el hilo está ocupado 2 s, se ejecutará a los 2 s.</li>
     <li><b>Dentro de un callback de E/S</b>, <code>setImmediate</code> se ejecuta siempre antes que <code>setTimeout(fn, 0)</code>: tras poll viene check, y los timers esperan a la siguiente vuelta.</li>
     <li><b>Desde el script principal</b>, el orden entre <code>setTimeout(fn, 0)</code> y <code>setImmediate</code> no está garantizado: depende de cuánto tardó en arrancar el proceso.</li>
     <li><b>El proceso termina</b> cuando no queda nada en ninguna cola. <code>timer.unref()</code> hace que un temporizador no mantenga vivo el proceso.</li></ul>
     <div class="termbox">const fs = require("node:fs");
fs.readFile(__filename, () =&gt; {
  setTimeout(() =&gt; console.log("timeout"), 0);
  setImmediate(() =&gt; console.log("immediate"));
});
// siempre: immediate, timeout</div>`},
 {t:"orden", p:"Ordena las fases de una vuelta del event loop, empezando por los temporizadores",
  items:["timers","pending callbacks","poll","check","close callbacks"],
  why:"Internamente hay también idle/prepare, antes de poll, que no ejecutan código tuyo."},
 {t:"opcion", p:"Programas <code>setTimeout(tarea, 50)</code> pero justo después el hilo ejecuta un bucle síncrono de 400 ms. ¿Cuándo se ejecuta <code>tarea</code>?",
  ops:["A los 50 ms, interrumpiendo el bucle","Hacia los 400 ms, cuando el hilo quede libre y el loop llegue a la fase timers","Nunca","A los 450 ms exactos"],
  ok:1, why:"JavaScript no se interrumpe: los callbacks esperan a que la pila quede vacía. Los temporizadores marcan un mínimo."},
 {t:"par", p:"Empareja cada callback con la fase en la que se ejecuta",
  pares:[["setTimeout(fn, 10) vencido","timers"],["Callback de fs.readFile","poll"],["setImmediate(fn)","check"],["socket.on(\"close\")","close callbacks"]],
  why:"Saberlo explica el orden de cosas que parecen aleatorias."},
 {t:"vf", p:"Un <code>setInterval</code> activo impide que el proceso de Node termine por sí solo.",
  ok:true, why:"Mientras haya trabajo programado, el loop sigue dando vueltas. clearInterval o .unref() lo liberan."},
 {t:"escribe", p:"¿Qué método de un temporizador hace que no mantenga vivo el proceso por sí solo?",
  sol:["unref","unref()",".unref()","timer.unref()"], pista:"Lo contrario de ref().",
  why:"Útil para temporizadores de mantenimiento (métricas, un plan B de apagado) que no deben impedir que el proceso termine."},
 {t:"codigo", p:"Demuestra el orden dentro de un callback de E/S: dentro de <code>fs.readFile</code>, programa un <code>setTimeout</code> de 0 ms que imprima <code>timeout</code> y un <code>setImmediate</code> que imprima <code>immediate</code>",
  lenguaje:"js",
  c:`<p>Antes de programar nada, imprime <code>leído</code>. Salida esperada: <code>leído</code>, <code>immediate</code>, <code>timeout</code>.</p>`,
  plantilla:"const fs = require(\"node:fs\");\nfs.readFile(__filename, () => {\n  // tu código\n});\n",
  pruebas:[{salida:"leído\nimmediate\ntimeout"}],
  pista:"Tras la fase poll viene check (setImmediate); los timers llegan en la vuelta siguiente.",
  solucion:"const fs = require(\"node:fs\");\nfs.readFile(__filename, () => {\n  console.log(\"leído\");\n  setTimeout(() => console.log(\"timeout\"), 0);\n  setImmediate(() => console.log(\"immediate\"));\n});",
  why:"Este orden sí está garantizado. Desde el script principal no lo está: por eso nunca escribas código que dependa de él."}
]},

/* =============== U3 L3 =============== */
{
id:"nd3n3",
titulo:"Microtareas, nextTick y setImmediate",
claves:["Tras cada callback se vacían por completo la cola de nextTick y después la de microtareas (promesas)","setImmediate espera a la fase check: cede el paso a la E/S","Un bucle de nextTick o de promesas puede dejar sin turno a la E/S"],
pasos:[
 {t:"info", eti:"Las colas prioritarias", h:"Quién va antes",
  c:`<p>Además de las fases, hay dos colas que se vacían <b>entera</b> después de cada callback, antes de seguir con el event loop:</p>
     <div class="dg"><div class="dg-tit">orden tras terminar cualquier callback</div>
       <div class="dg-vert"><div class="dg-caja">código síncrono en curso</div><div class="dg-caja acento">cola de process.nextTick<small>entera</small></div><div class="dg-caja acento">cola de microtareas<small>then/await de promesas, queueMicrotask</small></div><div class="dg-caja ok">siguiente callback de la fase actual, o siguiente fase</div></div></div>
     <div class="termbox">console.log("1 síncrono");
setTimeout(() =&gt; console.log("5 timeout"), 0);
setImmediate(() =&gt; console.log("5 immediate (puede cambiar con timeout)"));
Promise.resolve().then(() =&gt; console.log("4 promesa"));
process.nextTick(() =&gt; console.log("3 nextTick"));
console.log("2 síncrono");</div>
     <div class="nota ojo"><b class="tit">En ES modules cambia</b>En un módulo ESM, el código de nivel superior ya se ejecuta dentro de una microtarea: ahí <code>Promise.then</code> sale <b>antes</b> que <code>process.nextTick</code>. Es una pregunta trampa de entrevista y otra razón para no depender de ese orden.</div>`},
 {t:"info", eti:"Hambre", h:"Dejar sin turno a la E/S",
  c:`<div class="termbox">function bucle() { process.nextTick(bucle); }   // la cola de nextTick nunca se vacía
bucle();                                         // la E/S no vuelve a atenderse jamás

function trozo() { procesar(100); setImmediate(trozo); }   // bien: cede el paso en cada vuelta</div>
     <p>Regla práctica: usa <code>queueMicrotask</code> o una promesa para «justo después de esto»; <code>setImmediate</code> para «cuando hayas atendido la E/S pendiente». <code>process.nextTick</code> queda para código de librerías que necesita emitir algo después de que el llamador haya registrado sus listeners.</p>`},
 {t:"orden", p:"En un script CommonJS, ordena lo que se imprime: <code>setImmediate</code> «D», <code>Promise.resolve().then</code> «C», <code>process.nextTick</code> «B» y un <code>console.log</code> «A» (programados en el orden D, C, B, A)",
  items:["A (síncrono)","B (nextTick)","C (promesa)","D (setImmediate)"],
  why:"Primero todo lo síncrono; luego nextTick; luego microtareas; setImmediate espera a la fase check."},
 {t:"opcion", p:"¿Qué pasa si una función se vuelve a programar a sí misma con <code>process.nextTick</code> sin fin?",
  ops:["Nada, Node lo detecta","La cola de nextTick nunca se vacía y el event loop no llega a la E/S: el servidor deja de responder","Da error de pila","Se convierte en setImmediate"],
  ok:1, why:"No desborda la pila (cada llamada es nueva), pero deja sin turno a todo lo demás. Con setImmediate no pasa."},
 {t:"vf", p:"<code>await</code> dentro de una función async reanuda la función como una microtarea.",
  ok:true, why:"Todo lo que va tras un await es un then encubierto. Por eso await nunca bloquea el hilo."},
 {t:"par", p:"Empareja cada mecanismo con su momento",
  pares:[["process.nextTick","Nada más terminar el código actual, antes que las promesas"],["queueMicrotask","En la cola de microtareas, junto a los then"],["setImmediate","En la fase check de esta vuelta"],["setTimeout(fn, 0)","En la fase timers, como pronto en la vuelta siguiente"]],
  why:"De más a menos prioritario, salvo el caso especial de ESM."},
 {t:"codigo", p:"Consigue que se imprima <code>1 2 3 4</code> (una por línea) sin cambiar el orden de las cuatro llamadas: implementa <code>programarA</code>, <code>programarB</code> y <code>programarC</code>",
  lenguaje:"js",
  c:`<p>Cada una debe usar un mecanismo distinto: <code>setImmediate</code>, una promesa y <code>process.nextTick</code>. Tú decides cuál va en cada una.</p>`,
  plantilla:"const programarA = fn => { /* ? */ };\nconst programarB = fn => { /* ? */ };\nconst programarC = fn => { /* ? */ };\n\nprogramarA(() => console.log(\"4\"));\nprogramarB(() => console.log(\"3\"));\nprogramarC(() => console.log(\"2\"));\nconsole.log(\"1\");\n",
  pruebas:[{salida:"1\n2\n3\n4"}],
  pista:"El que imprime 4 debe ser el más tardío (setImmediate) y el que imprime 2 el más prioritario (nextTick).",
  solucion:"const programarA = fn => { setImmediate(fn); };\nconst programarB = fn => { Promise.resolve().then(fn); };\nconst programarC = fn => { process.nextTick(fn); };\n\nprogramarA(() => console.log(\"4\"));\nprogramarB(() => console.log(\"3\"));\nprogramarC(() => console.log(\"2\"));\nconsole.log(\"1\");",
  why:"Síncrono, luego nextTick, luego microtareas y por último la fase check. (En un .mjs, 2 y 3 se intercambiarían.)"},
 {t:"codigo", p:"Procesa una lista larga sin monopolizar el hilo: suma los números de 1 a 100000 en trozos de 10000, cediendo con <code>setImmediate</code> entre trozo y trozo, e imprime el total y cuántos trozos hubo",
  lenguaje:"js",
  c:`<p>Salida: <code>5000050000</code> y <code>trozos=10</code>.</p>`,
  plantilla:"const N = 100000, TROZO = 10000;\nlet total = 0, i = 1, trozos = 0;\nfunction procesarTrozo() {\n  // suma hasta TROZO números; si quedan, vuelve a programarte con setImmediate\n}\nprocesarTrozo();\n",
  pruebas:[{salida:"5000050000\ntrozos=10"}],
  pista:"Dentro: const fin = Math.min(i + TROZO - 1, N); for (; i <= fin; i++) total += i; trozos++; if (i <= N) setImmediate(procesarTrozo); else imprime.",
  solucion:"const N = 100000, TROZO = 10000;\nlet total = 0, i = 1, trozos = 0;\nfunction procesarTrozo() {\n  const fin = Math.min(i + TROZO - 1, N);\n  for (; i <= fin; i++) total += i;\n  trozos++;\n  if (i <= N) setImmediate(procesarTrozo);\n  else {\n    console.log(total);\n    console.log(\"trozos=\" + trozos);\n  }\n}\nprocesarTrozo();",
  why:"Entre trozo y trozo, el event loop atiende la E/S pendiente: el servidor sigue respondiendo mientras hace un trabajo largo. Si el cálculo es muy pesado, la solución de verdad es un worker_thread."}
]},

/* =============== U3 L4 =============== */
{
id:"nd3n4",
titulo:"libuv, el pool de hilos y no bloquear",
claves:["La red usa el mecanismo asíncrono del sistema (epoll, kqueue, IOCP); fs, dns.lookup, crypto y zlib usan un pool de 4 hilos","UV_THREADPOOL_SIZE amplía el pool cuando se satura","Bloquean el loop: métodos Sync, JSON enormes, regex catastróficas y bucles largos"],
pasos:[
 {t:"info", eti:"Por debajo", h:"¿Quién hace la E/S?",
  c:`<div class="dg"><div class="dg-tit">adónde va cada operación asíncrona</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">sistema operativo</div><div class="dg-pila"><div class="dg-caja ok">sockets TCP y UDP</div><div class="dg-caja ok">servidores y clientes HTTP</div><div class="dg-caja ok">tuberías y procesos hijos</div></div><div class="dg-nota arriba">miles a la vez sin hilos extra</div></div>
         <div class="dg-col"><div class="dg-col-tit">pool de hilos de libuv (4 por defecto)</div><div class="dg-pila"><div class="dg-caja acento">fs (ficheros)</div><div class="dg-caja acento">dns.lookup</div><div class="dg-caja acento">crypto: pbkdf2, scrypt, randomBytes</div><div class="dg-caja acento">zlib asíncrono</div></div><div class="dg-nota arriba">cola si hay más de 4 a la vez</div></div>
       </div></div>
     <p>Si lanzas 20 hashes <code>scrypt</code> a la vez, solo 4 avanzan; los demás esperan su hilo. Y como <code>fs</code> comparte el mismo pool, las lecturas de ficheros también se atascan.</p>
     <div class="termbox">UV_THREADPOOL_SIZE=16 node server.js    # hasta 1024; se fija al arrancar</div>
     <div class="nota ojo"><b class="tit">DNS lento y fs lento a la vez</b><code>dns.lookup</code> (lo que usan http y fetch para resolver nombres) va al pool. Un DNS que tarda puede ocupar los 4 hilos y frenar la lectura de ficheros sin relación aparente.</div>`},
 {t:"info", eti:"Enemigos del loop", h:"Qué bloquea de verdad",
  c:`<ul><li><b>Métodos Sync</b> en código de servidor: <code>readFileSync</code>, <code>execSync</code>, <code>scryptSync</code>.</li>
     <li><b>JSON gigante</b>: <code>JSON.parse</code> de 50 MB bloquea cientos de milisegundos.</li>
     <li><b>Expresiones regulares</b> con retroceso catastrófico (ReDoS) sobre entrada del usuario.</li>
     <li><b>Bucles largos</b>: ordenar un millón de elementos, generar un PDF, redimensionar imágenes.</li></ul>
     <div class="termbox">import { monitorEventLoopDelay } from "node:perf_hooks";
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
setInterval(() =&gt; log.info({ p99ms: h.percentile(99) / 1e6 }, "retraso del event loop"), 10_000).unref();</div>
     <p>El <b>retraso del event loop</b> es la métrica que delata el bloqueo: con el hilo sano está en pocos milisegundos.</p>`},
 {t:"par", p:"Empareja cada operación con quién la ejecuta",
  pares:[["Aceptar una conexión HTTP","El sistema operativo (epoll/kqueue/IOCP)"],["fs.promises.readFile","Un hilo del pool de libuv"],["crypto.scrypt (asíncrono)","Un hilo del pool (cálculo pesado en C++)"],["JSON.parse de tu respuesta","El hilo principal de JavaScript"]],
  why:"JSON.parse no tiene versión asíncrona: si el JSON es enorme, bloquea."},
 {t:"opcion", p:"Tu servicio de login usa <code>argon2</code> asíncrono y, con muchos logins a la vez, también se ralentizan las lecturas de ficheros estáticos. ¿Qué explica la relación?",
  ops:["Casualidad","Los hashes y el fs comparten el pool de libuv de 4 hilos: se hace cola. Aumentar UV_THREADPOOL_SIZE o sacar el hashing a otro servicio lo alivia","argon2 bloquea la red","Faltan índices"],
  ok:1, why:"Es un clásico de producción: dos cosas sin relación aparente que comparten un recurso escaso."},
 {t:"vf", p:"Subir <code>UV_THREADPOOL_SIZE</code> hace que tu código JavaScript se ejecute en varios hilos.",
  ok:false, why:"Solo amplía el pool que usa libuv para fs, dns.lookup, crypto y zlib. Tu JavaScript sigue en un hilo; para paralelizarlo, worker_threads."},
 {t:"opcion", p:"Una ruta valida emails con una expresión regular como <code>/^(\\w+\\s?)*$/</code> y un atacante congela el servidor con una cadena larga. ¿Cómo se llama el ataque?",
  ops:["XSS","ReDoS: la regex tiene retroceso exponencial con ciertas entradas y bloquea el event loop","CSRF","Inyección SQL"],
  ok:1, why:"Evita cuantificadores anidados, limita la longitud de la entrada y usa validadores probados."},
 {t:"codigo", p:"Usa el pool de hilos bien: calcula tres hashes con <code>crypto.scrypt</code> asíncrono a la vez (con promisify y Promise.all) e imprime la longitud en bytes de cada uno",
  lenguaje:"js",
  c:`<p>Usa la sal <code>\"sal\"</code> y una longitud de clave de 32 bytes. Salida: <code>32 32 32</code> en una línea.</p>`,
  plantilla:"const crypto = require(\"node:crypto\");\nconst { promisify } = require(\"node:util\");\nconst claves = [\"uno\", \"dos\", \"tres\"];\n// hashea las tres en paralelo\n",
  pruebas:[{salida:"32 32 32"}],
  pista:"const scrypt = promisify(crypto.scrypt); Promise.all(claves.map(c => scrypt(c, \"sal\", 32))) y luego map(b => b.length).join(\" \").",
  solucion:"const crypto = require(\"node:crypto\");\nconst { promisify } = require(\"node:util\");\nconst claves = [\"uno\", \"dos\", \"tres\"];\nconst scrypt = promisify(crypto.scrypt);\nPromise.all(claves.map(c => scrypt(c, \"sal\", 32))).then(hs => console.log(hs.map(b => b.length).join(\" \")));",
  why:"Cada scrypt corre en un hilo del pool y el hilo principal queda libre. scryptSync haría los tres uno detrás de otro bloqueando todo el proceso."},
 {t:"codigo", p:"Mide un bloqueo: programa un <code>setTimeout</code> de 10 ms y bloquea el hilo 100 ms con un bucle de espera activa. Dentro del temporizador, imprime <code>retrasado</code> si han pasado 100 ms o más desde que lo programaste",
  lenguaje:"js",
  plantilla:"const t0 = Date.now();\nsetTimeout(() => {\n  // imprime \"retrasado\" o \"a tiempo\"\n}, 10);\n// bloquea el hilo 100 ms\n",
  pruebas:[{salida:"retrasado"}],
  pista:"while (Date.now() - t0 < 100) {} bloquea sin ceder. En el callback compara Date.now() - t0 >= 100.",
  solucion:"const t0 = Date.now();\nsetTimeout(() => {\n  console.log(Date.now() - t0 >= 100 ? \"retrasado\" : \"a tiempo\");\n}, 10);\nwhile (Date.now() - t0 < 100) {}",
  why:"El temporizador venció a los 10 ms, pero nadie pudo ejecutarlo hasta que el bucle soltó el hilo. En un servidor, eso le pasa a todas las peticiones a la vez."}
]}

]});
