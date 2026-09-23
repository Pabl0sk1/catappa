window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Concurrencia y rendimiento",
resumen: "worker_threads para CPU, procesos hijos y cluster, medir y perfilar (CPU, memoria y event loop), fugas de memoria y colas de trabajos con BullMQ",
nivel: "Experto",
color: "#589834",
lecciones: [

/* =============== U11 L1 =============== */
{
id:"nd11n1",
titulo:"worker_threads: CPU en paralelo",
claves:["Un Worker es otro hilo con su propio event loop y su propio V8: no comparte variables","Se comunican con mensajes (postMessage, copia estructurada) o memoria compartida (SharedArrayBuffer y Atomics)","Crear hilos cuesta: usa un pool (piscina) para trabajo de CPU recurrente"],
pasos:[
 {t:"info", eti:"Paralelismo real", h:"Hilos en Node",
  c:`<div class="termbox">// principal.js
import { Worker } from "node:worker_threads";

function redimensionar(ruta) {
  return new Promise((ok, mal) =&gt; {
    const w = new Worker(new URL("./tarea.js", import.meta.url), { workerData: { ruta } });
    w.once("message", ok);
    w.once("error", mal);
    w.once("exit", c =&gt; c !== 0 &amp;&amp; mal(new Error("worker terminó con " + c)));
  });
}

// tarea.js
import { parentPort, workerData } from "node:worker_threads";
const resultado = procesarImagen(workerData.ruta);     // CPU pura, fuera del hilo principal
parentPort.postMessage(resultado);</div>
     <div class="dg"><div class="dg-tit">hilo principal y workers</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">hilo principal</div><div class="dg-pila"><div class="dg-caja acento">event loop: atiende HTTP</div><div class="dg-caja">envía tareas y recibe resultados</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">pool de workers (uno por núcleo)</div><div class="dg-fila"><div class="dg-caja ok">worker 1</div><div class="dg-caja ok">worker 2</div><div class="dg-caja ok">worker 3</div></div><div class="dg-nota arriba">cada uno con su V8 y su heap</div></div>
       </div></div>
     <p>Crear un worker tarda milisegundos y reserva memoria: para tareas frecuentes, un pool como <b>Piscina</b> los reutiliza. Los objetos se <b>copian</b> al enviarlos; los <code>ArrayBuffer</code> se pueden <b>transferir</b> sin copia, y un <code>SharedArrayBuffer</code> se comparte de verdad (con <code>Atomics</code> para sincronizar).</p>`},
 {t:"par", p:"Empareja cada herramienta con su caso",
  pares:[["worker_threads","Cálculo de CPU (hashing, imágenes, parseo enorme) dentro del mismo proceso"],["child_process","Ejecutar otro programa (ffmpeg, git) o aislar código en otro proceso"],["cluster","Varios procesos que comparten el mismo puerto HTTP"],["Cola de trabajos","Trabajo diferido, con reintentos, en otras máquinas"]],
  why:"Los workers no aceleran la E/S (ya es asíncrona): solo ayudan con la CPU."},
 {t:"opcion", p:"Mueves las consultas a PostgreSQL a worker_threads para «ir más rápido». ¿Qué pasa?",
  ops:["Van 4 veces más rápido","Nada útil: la E/S ya no bloqueaba el hilo principal. Solo añades el coste de crear hilos y copiar datos","Se bloquea el servidor","PostgreSQL rechaza las conexiones"],
  ok:1, why:"Workers para CPU, no para E/S. Si la base de datos es lenta, el problema está en la consulta o en el pool."},
 {t:"vf", p:"Un worker puede leer y modificar directamente las variables globales del hilo principal.",
  ok:false, why:"Cada worker tiene su propio aislamiento de V8. Solo comparten lo que se envía por mensajes o un SharedArrayBuffer."},
 {t:"opcion", p:"¿Cuántos workers de CPU tiene sentido crear en un contenedor limitado a 2 CPU?",
  ops:["100","Alrededor de 2 (os.availableParallelism() o el límite de CPU del contenedor): más hilos que núcleos solo añaden cambios de contexto","Uno por petición","Ninguno"],
  ok:1, why:"Ojo: os.cpus().length puede devolver los núcleos de la máquina anfitriona, no los que te deja el límite del contenedor."},
 {t:"codigo", p:"Cuenta los primos menores de N en un worker: el hilo principal lee N de stdin, lanza un Worker (con <code>eval: true</code>) y muestra lo que devuelve",
  lenguaje:"js",
  c:`<p>El código del worker ya está en la cadena <code>CODIGO</code>; recibe N en <code>workerData</code>. Te falta crear el Worker y esperar su mensaje.</p>`,
  plantilla:"const { Worker } = require(\"node:worker_threads\");\nconst N = Number(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst CODIGO = `\nconst { parentPort, workerData } = require(\"node:worker_threads\");\nlet c = 0;\nfor (let n = 2; n < workerData; n++) {\n  let primo = true;\n  for (let d = 2; d * d <= n; d++) if (n % d === 0) { primo = false; break; }\n  if (primo) c++;\n}\nparentPort.postMessage(c);\n`;\n// crea el worker, escucha \"message\" e imprime el resultado\n",
  pruebas:[{entrada:"100\n", salida:"25"},{entrada:"1000\n", salida:"168"},{entrada:"100000\n", salida:"9592", oculta:true}],
  pista:"const w = new Worker(CODIGO, { eval: true, workerData: N }); w.once(\"message\", c => console.log(c));",
  solucion:"const { Worker } = require(\"node:worker_threads\");\nconst N = Number(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst CODIGO = `\nconst { parentPort, workerData } = require(\"node:worker_threads\");\nlet c = 0;\nfor (let n = 2; n < workerData; n++) {\n  let primo = true;\n  for (let d = 2; d * d <= n; d++) if (n % d === 0) { primo = false; break; }\n  if (primo) c++;\n}\nparentPort.postMessage(c);\n`;\nconst w = new Worker(CODIGO, { eval: true, workerData: N });\nw.once(\"message\", c => console.log(c));\nw.once(\"error\", e => { console.error(e); process.exitCode = 1; });",
  why:"Mientras el worker calcula, el hilo principal sigue libre para atender peticiones. En código real el worker va en su propio fichero; eval: true es cómodo para ejemplos."},
 {t:"codigo", p:"Reparte el trabajo: divide el rango [0, 1000000) en 4 trozos, cuenta los primos de cada uno en su propio worker a la vez y suma los resultados",
  lenguaje:"js",
  c:`<p>Imprime los cuatro resultados parciales separados por espacios y, en otra línea, el total. Salida: <code>22044 19494 18700 18260</code> y <code>78498</code>.</p>`,
  plantilla:"const { Worker } = require(\"node:worker_threads\");\nconst CODIGO = `\nconst { parentPort, workerData } = require(\"node:worker_threads\");\nlet c = 0;\nfor (let n = workerData.desde; n < workerData.hasta; n++) {\n  let primo = n > 1;\n  for (let d = 2; d * d <= n; d++) if (n % d === 0) { primo = false; break; }\n  if (primo) c++;\n}\nparentPort.postMessage(c);\n`;\nfunction contar(desde, hasta) {\n  // devuelve una promesa con el resultado del worker\n}\n// lanza los 4 trozos con Promise.all\n",
  pruebas:[{salida:"22044 19494 18700 18260\n78498"}],
  pista:"contar: new Promise((ok, mal) => { const w = new Worker(CODIGO, { eval: true, workerData: { desde, hasta } }); w.once(\"message\", ok); w.once(\"error\", mal); }). Los trozos: [0, 250000), [250000, 500000)…",
  solucion:"const { Worker } = require(\"node:worker_threads\");\nconst CODIGO = `\nconst { parentPort, workerData } = require(\"node:worker_threads\");\nlet c = 0;\nfor (let n = workerData.desde; n < workerData.hasta; n++) {\n  let primo = n > 1;\n  for (let d = 2; d * d <= n; d++) if (n % d === 0) { primo = false; break; }\n  if (primo) c++;\n}\nparentPort.postMessage(c);\n`;\nfunction contar(desde, hasta) {\n  return new Promise((ok, mal) => {\n    const w = new Worker(CODIGO, { eval: true, workerData: { desde, hasta } });\n    w.once(\"message\", ok);\n    w.once(\"error\", mal);\n  });\n}\nconst T = 250000;\nPromise.all([0, 1, 2, 3].map(i => contar(i * T, (i + 1) * T))).then(r => {\n  console.log(r.join(\" \"));\n  console.log(r.reduce((a, b) => a + b, 0));\n});",
  why:"Con 4 núcleos libres, tarda aproximadamente lo que el trozo más lento. Promise.all conserva el orden de los resultados aunque los workers terminen en otro orden."}
]},

/* =============== U11 L2 =============== */
{
id:"nd2l3",
titulo:"Procesos hijos y cluster",
claves:["child_process: execFile y spawn para ejecutar programas; evita exec con datos externos","fork abre otro proceso de Node con canal de mensajes; cluster reparte un puerto entre varios","En contenedores, mejor varias réplicas que cluster: un proceso por contenedor"],
pasos:[
 {t:"info", eti:"Hablar con el sistema", h:"Ejecutar programas",
  c:`<div class="termbox">import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
const execFileP = promisify(execFile);

// salida corta: execFile con argumentos separados (sin shell)
const { stdout } = await execFileP("git", ["rev-parse", "--short", "HEAD"]);

// salida larga o en directo: spawn con streams
const pg = spawn("pg_dump", ["-Fc", "tareas"]);
await pipeline(pg.stdout, createWriteStream("tareas.dump"));
pg.on("close", codigo =&gt; console.log("pg_dump terminó con", codigo));

import os from "node:os";
os.availableParallelism(); os.freemem(); os.hostname();</div>
     <p><code>exec("rm -rf " + ruta)</code> pasa por la shell: con datos externos permite inyección de comandos, igual que en Python con shell=True.</p>`},
 {t:"info", eti:"Varios procesos", h:"cluster frente a réplicas",
  c:`<div class="termbox">import cluster from "node:cluster";
import os from "node:os";

if (cluster.isPrimary) {
  for (let i = 0; i &lt; os.availableParallelism(); i++) cluster.fork();
  cluster.on("exit", (w, codigo) =&gt; { log.warn({ pid: w.process.pid, codigo }, "worker caído"); cluster.fork(); });
} else {
  crearApp().listen(3000);          // todos comparten el puerto 3000
}</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">¿cluster o réplicas?</div>
       <table class="dg-tabla"><thead><tr><th></th><th>cluster / PM2</th><th>réplicas (Kubernetes, ECS)</th></tr></thead><tbody>
       <tr><td>dónde</td><td>un servidor o VM</td><td>contenedores</td></tr>
       <tr><td>reinicio</td><td>el primario vuelve a hacer fork</td><td>el orquestador</td></tr>
       <tr><td>métricas y límites</td><td>mezclados en un contenedor</td><td>por réplica, claros</td></tr>
       </tbody></table></div>
     <p>Con contenedores, la regla es <b>un proceso por contenedor</b> y escalar réplicas. cluster o PM2 tienen sentido en una VM sin orquestador.</p>`},
 {t:"par", p:"Empareja cada función con su uso",
  pares:[["execFile","Ejecutar un programa con argumentos y recoger su salida"],["spawn","Procesos largos con salida en streaming"],["exec","Pasa por la shell: peligroso con datos externos"],["fork","Otro proceso de Node con canal de mensajes (process.send)"],["cluster.fork","Un worker que comparte el puerto del servidor"]],
  why:"Las mismas reglas que con subprocess en Python."},
 {t:"opcion", p:"¿Por qué preferir <code>execFile(\"convert\", [entrada, salida])</code> a <code>exec(\"convert \" + entrada + \" \" + salida)</code>?",
  ops:["Por velocidad únicamente","Sin shell no hay inyección de comandos: cada argumento llega tal cual al programa","exec no existe","Por el formato de la salida"],
  ok:1, why:"Un nombre de fichero como \"a.png; rm -rf /\" sería desastroso con exec."},
 {t:"vf", p:"En Kubernetes, lo recomendable es arrancar cluster con un worker por núcleo dentro de cada pod.",
  ok:false, why:"Un proceso por contenedor: el orquestador escala, reinicia y mide cada réplica. cluster dentro del pod duplica ese trabajo y complica los límites de memoria."},
 {t:"opcion", p:"Tu servicio lanza <code>ffmpeg</code> con spawn y, bajo carga, el servidor se queda sin memoria aunque el vídeo se escribe en disco. ¿Qué sospechas?",
  ops:["ffmpeg es lento","Se acumula la salida del proceso en memoria (por ejemplo, con execFile y maxBuffer enorme, o leyendo stdout sin consumirlo); hay que tratarla como stream con pipeline","Falta un índice","El disco está lleno"],
  ok:1, why:"execFile guarda toda la salida en memoria: vale para salidas pequeñas. Para salidas grandes o continuas, spawn y streams."},
 {t:"codigo", p:"Ejecuta otro proceso de Node con <code>execFile</code>: pasa como argumento la palabra leída de stdin y recoge lo que imprime el hijo",
  lenguaje:"js",
  c:`<p>El hijo es <code>process.execPath</code> (el mismo binario de Node) con los argumentos <code>["-e", "console.log(process.argv[1].toUpperCase())", palabra]</code>. Imprime <code>hijo dijo: …</code>. Como no pasa por la shell, un texto como <code>a; rm -rf /</code> llega como argumento literal.</p>`,
  plantilla:"const { execFile } = require(\"node:child_process\");\nconst { promisify } = require(\"node:util\");\nconst execFileP = promisify(execFile);\nconst palabra = require(\"node:fs\").readFileSync(0, \"utf8\").trim();\n// ejecuta el hijo e imprime su salida\n",
  pruebas:[{entrada:"hola\n", salida:"hijo dijo: HOLA"},{entrada:"a; rm -rf /\n", salida:"hijo dijo: A; RM -RF /"},{entrada:"$(whoami)\n", salida:"hijo dijo: $(WHOAMI)", oculta:true}],
  pista:"const { stdout } = await execFileP(process.execPath, [\"-e\", \"console.log(process.argv[1].toUpperCase())\", palabra]); console.log(\"hijo dijo: \" + stdout.trim());",
  solucion:"const { execFile } = require(\"node:child_process\");\nconst { promisify } = require(\"node:util\");\nconst execFileP = promisify(execFile);\nconst palabra = require(\"node:fs\").readFileSync(0, \"utf8\").trim();\n(async () => {\n  const { stdout } = await execFileP(process.execPath, [\"-e\", \"console.log(process.argv[1].toUpperCase())\", palabra]);\n  console.log(\"hijo dijo: \" + stdout.trim());\n})();",
  why:"El caso con $(whoami) demuestra que no hubo shell: con exec se habría ejecutado el comando. Con -e, process.argv[1] es el primer argumento tras el código."},
 {t:"codigo", p:"Arranca dos workers con <code>cluster</code>: cada uno envía al primario <code>worker-ID</code>; el primario los recoge, los imprime ordenados separados por comas y los termina",
  lenguaje:"js",
  c:`<p>Salida: <code>worker-1,worker-2</code>. El mismo fichero hace de primario o de worker según <code>cluster.isPrimary</code>.</p>`,
  plantilla:"const cluster = require(\"node:cluster\");\n\nif (cluster.isPrimary) {\n  // haz fork dos veces, escucha \"message\" y cuando tengas los dos imprime y mata a los workers\n} else {\n  // envía \"worker-\" + cluster.worker.id al primario\n}\n",
  pruebas:[{salida:"worker-1,worker-2"}],
  pista:"En el primario: const recibidos = []; w.on(\"message\", m => { recibidos.push(m); if (recibidos.length === 2) { console.log(recibidos.sort().join(\",\")); for (const x of Object.values(cluster.workers)) x.kill(); } }). En el worker: process.send(...).",
  solucion:"const cluster = require(\"node:cluster\");\n\nif (cluster.isPrimary) {\n  const recibidos = [];\n  for (let i = 0; i < 2; i++) {\n    const w = cluster.fork();\n    w.on(\"message\", m => {\n      recibidos.push(m);\n      if (recibidos.length === 2) {\n        console.log(recibidos.sort().join(\",\"));\n        for (const x of Object.values(cluster.workers)) x.kill();\n      }\n    });\n  }\n} else {\n  process.send(\"worker-\" + cluster.worker.id);\n}",
  why:"Los workers terminan en un orden imprevisible: por eso se ordena antes de imprimir. En un servidor real, cada worker haría listen en el mismo puerto y el primario repartiría las conexiones."}
]},

/* =============== U11 L3 =============== */
{
id:"nd6l2",
titulo:"Medir, perfilar y cazar fugas de memoria",
claves:["Mide antes: latencia por percentiles, retraso del event loop, CPU y memoria","Perfil de CPU (--cpu-prof, --inspect, clinic flame) y heap snapshots comparados para fugas","Las fugas típicas: cachés sin límite, listeners acumulados, closures y temporizadores olvidados"],
pasos:[
 {t:"info", eti:"Diagnosticar", h:"Herramientas de perfilado",
  c:`<div class="termbox">node --cpu-prof server.js                  # al salir, deja un .cpuprofile (ábrelo en Chrome DevTools)
node --inspect server.js                   # chrome://inspect: perfiles y snapshots en vivo
node --heapsnapshot-signal=SIGUSR2 server.js   # kill -USR2 &lt;pid&gt; genera un snapshot
node --heapsnapshot-near-heap-limit=2 server.js  # snapshot automático antes de morir por memoria
npx clinic doctor -- node server.js        # diagnóstico guiado (event loop, CPU, memoria)
npx autocannon -c 100 -d 20 http://localhost:3000/api/tareas   # generar carga</div>
     <p>Un <b>flame graph</b> muestra qué funciones consumen la CPU: las barras más anchas son donde se va el tiempo. Para memoria, se toman <b>dos heap snapshots</b> separados por un rato de carga y se comparan: lo que crece y no se libera es la fuga.</p>`},
 {t:"info", eti:"Fugas", h:"Por qué crece la memoria",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">fugas típicas en Node</div>
       <table class="dg-tabla"><tbody>
       <tr><td>caché en un Map sin límite</td><td>LRU con tamaño máximo (lru-cache) o TTL</td></tr>
       <tr><td>listeners que nunca se quitan</td><td>off al terminar, once, o AbortSignal</td></tr>
       <tr><td>setInterval por petición sin clearInterval</td><td>limpiar en req.on("close")</td></tr>
       <tr><td>closures que retienen objetos grandes</td><td>no capturar más de lo necesario</td></tr>
       <tr><td>arrays globales de «últimos eventos»</td><td>buffer circular con tamaño fijo</td></tr>
       </tbody></table></div>
     <div class="nota"><b class="tit">rss frente a heapUsed</b><code>process.memoryUsage()</code>: si crece <code>heapUsed</code>, la fuga está en objetos de JavaScript; si crece <code>rss</code> pero no el heap, busca en Buffers, memoria nativa de módulos o fragmentación.</div>`},
 {t:"par", p:"Empareja cada síntoma con la herramienta de diagnóstico",
  pares:[["CPU al 100 % sin saber por qué","--cpu-prof o clinic flame"],["Memoria creciente","Heap snapshots comparados"],["Latencia alta en todas las rutas","Retraso del event loop (monitorEventLoopDelay)"],["Saber cuánto aguanta el servicio","Prueba de carga con autocannon o k6"]],
  why:"Medir antes de cambiar nada, como siempre."},
 {t:"opcion", p:"La latencia de todas las rutas sube a la vez cuando alguien exporta un informe grande. ¿Qué sospechas?",
  ops:["La red","Código síncrono pesado en la exportación que bloquea el event loop para todos","El DNS","Poca memoria"],
  ok:1, why:"Mueve ese trabajo a un worker o una cola."},
 {t:"opcion", p:"¿Por qué se mide la latencia con percentiles (p50, p95, p99) y no con la media?",
  ops:["Es más fácil de calcular","La media esconde la cola: con 99 peticiones de 10 ms y una de 5 s, la media es 60 ms pero un usuario de cada cien espera 5 s","Porque lo exige Prometheus","No hay diferencia"],
  ok:1, why:"Los usuarios que sufren están en la cola. Los SLO se definen sobre p95 o p99."},
 {t:"vf", p:"Si <code>heapUsed</code> sube durante una prueba de carga y vuelve a bajar al terminar, hay una fuga de memoria.",
  ok:false, why:"Eso es el recolector trabajando con normalidad. Una fuga es memoria que no baja tras la carga y sigue creciendo en cada ciclo."},
 {t:"codigo", p:"Calcula percentiles de latencia: stdin trae una latencia en ms por línea. Imprime <code>p50=… p95=… p99=… max=…</code> usando el método del rango más cercano",
  lenguaje:"js",
  c:`<p>Ordena de menor a mayor; el percentil p es el elemento en la posición <code>Math.ceil(p / 100 · n) − 1</code>.</p>`,
  plantilla:"const ms = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(Number);\n// ordena y calcula\n",
  pruebas:[{entrada:"10\n12\n11\n13\n5000\n9\n10\n11\n12\n10\n", salida:"p50=11 p95=5000 p99=5000 max=5000"},{entrada:"1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n", salida:"p50=10 p95=19 p99=20 max=20"},{entrada:"42\n", salida:"p50=42 p95=42 p99=42 max=42", oculta:true}],
  pista:"const o = [...ms].sort((a, b) => a - b); const p = q => o[Math.ceil(q / 100 * o.length) - 1]; ¡sort() sin comparador ordena como texto!",
  solucion:"const ms = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(Number);\nconst o = [...ms].sort((a, b) => a - b);\nconst p = q => o[Math.ceil(q / 100 * o.length) - 1];\nconsole.log(\"p50=\" + p(50) + \" p95=\" + p(95) + \" p99=\" + p(99) + \" max=\" + o[o.length - 1]);",
  why:"En el primer caso la media sería 510 ms, un número que no describe a nadie: nueve peticiones van en ~11 ms y una tarda 5 s. Los percentiles lo cuentan tal cual."},
 {t:"codigo", p:"Arregla una fuga: implementa una caché LRU con tamaño máximo usando un <code>Map</code> (que conserva el orden de inserción)",
  lenguaje:"js",
  c:`<p><code>get</code> mueve la clave al final (la más reciente); <code>set</code> inserta al final y, si se supera el máximo, borra la más antigua (la primera del Map). Con la plantilla, la salida es <code>tamaño=3</code>, <code>b expulsada=true</code> y <code>claves=a,d,e</code>.</p>`,
  plantilla:"class LRU {\n  constructor(max) { this.max = max; this.m = new Map(); }\n  get(k) {\n    // ...\n  }\n  set(k, v) {\n    // ...\n  }\n}\n\nconst c = new LRU(3);\nc.set(\"a\", 1); c.set(\"b\", 2); c.set(\"c\", 3);\nc.get(\"a\");\nc.set(\"d\", 4);\nc.set(\"e\", 5);\nconsole.log(\"tamaño=\" + c.m.size);\nconsole.log(\"b expulsada=\" + (c.get(\"b\") === undefined));\nconsole.log(\"claves=\" + [...c.m.keys()].join(\",\"));\n",
  pruebas:[{salida:"tamaño=3\nb expulsada=true\nclaves=a,d,e"}],
  pista:"get: si existe, delete y vuelve a set para moverla al final. set: delete(k) primero, set(k, v) y si size &gt; max, delete(this.m.keys().next().value).",
  solucion:"class LRU {\n  constructor(max) { this.max = max; this.m = new Map(); }\n  get(k) {\n    if (!this.m.has(k)) return undefined;\n    const v = this.m.get(k);\n    this.m.delete(k);\n    this.m.set(k, v);\n    return v;\n  }\n  set(k, v) {\n    this.m.delete(k);\n    this.m.set(k, v);\n    if (this.m.size > this.max) this.m.delete(this.m.keys().next().value);\n  }\n}\n\nconst c = new LRU(3);\nc.set(\"a\", 1); c.set(\"b\", 2); c.set(\"c\", 3);\nc.get(\"a\");\nc.set(\"d\", 4);\nc.set(\"e\", 5);\nconsole.log(\"tamaño=\" + c.m.size);\nconsole.log(\"b expulsada=\" + (c.get(\"b\") === undefined));\nconsole.log(\"claves=\" + [...c.m.keys()].join(\",\"));",
  why:"Una caché sin límite es la fuga más común en Node. Con LRU la memoria queda acotada y se conserva lo que más se usa: por eso sobrevive «a» (se leyó) y caen «b» y «c»."}
]},

/* =============== U11 L4 =============== */
{
id:"nd6l3",
titulo:"Colas de trabajos con BullMQ",
claves:["Una cola saca el trabajo lento de la petición: la API responde 202 y un worker lo procesa","BullMQ sobre Redis: reintentos con espera, prioridades, trabajos programados y límite de concurrencia","Workers escalables por separado y trabajos idempotentes"],
pasos:[
 {t:"info", eti:"Trabajo en segundo plano", h:"Productor y worker",
  c:`<div class="termbox">import { Queue, Worker } from "bullmq";
const conexion = { url: process.env.REDIS_URL };

// en la API
const informes = new Queue("informes", { connection: conexion });
app.post("/api/informes", async (req, res) =&gt; {
  const trabajo = await informes.add("mensual", { mes: req.body.mes, usuario: req.usuario.sub },
    { attempts: 5, backoff: { type: "exponential", delay: 2000 }, jobId: \`mensual-\${req.body.mes}\` });
  res.status(202).json({ id: trabajo.id });
});

// en otro proceso (otro contenedor)
new Worker("informes", async trabajo =&gt; {
  const pdf = await generarInforme(trabajo.data.mes);
  await s3.putObject({ Bucket: "informes", Key: \`\${trabajo.data.mes}.pdf\`, Body: pdf });
}, { connection: conexion, concurrency: 4 });</div>`},
 {t:"info", eti:"Garantías", h:"Al menos una vez",
  c:`<p>Un worker puede morir a mitad de un trabajo; BullMQ lo detecta (el trabajo queda «estancado») y lo reintenta. Consecuencia: un trabajo puede ejecutarse <b>más de una vez</b>. Por eso los trabajos deben ser <b>idempotentes</b>: ejecutar dos veces «enviar la factura 42» no puede mandar dos correos.</p>
     <div class="dg"><div class="dg-tit">ciclo de vida de un trabajo</div>
       <div class="dg-flujo"><div class="dg-caja">waiting</div><div class="dg-caja acento">active</div><div class="dg-caja ok">completed</div></div>
       <div class="dg-nota arriba">si falla: vuelve a esperar con backoff; agotados los intentos, queda en failed para revisarlo</div></div>
     <p>Al apagar un worker, <code>await worker.close()</code> deja terminar los trabajos activos: parte del cierre ordenado.</p>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["attempts: 5","Reintentar hasta 5 veces si falla"],["backoff exponencial","Esperar cada vez más entre reintentos"],["jobId fijo","Evitar trabajos duplicados"],["concurrency: 4","Procesar 4 trabajos a la vez por worker"],["202 Accepted","La petición se aceptó y se procesará después"]],
  why:"Es el mismo patrón que SQS + worker en AWS o @Async con colas en Spring."},
 {t:"opcion", p:"¿Qué ventaja tiene ejecutar los workers en contenedores separados de la API?",
  ops:["Ninguna","Escalan de forma independiente y un pico de trabajos pesados no ralentiza las peticiones de la API","Son más baratos siempre","Evitan usar Redis"],
  ok:1, why:"En Kubernetes, incluso pueden escalar según la longitud de la cola (KEDA)."},
 {t:"vf", p:"Con BullMQ y reintentos, cada trabajo se ejecuta exactamente una vez.",
  ok:false, why:"La garantía es «al menos una vez». Diseña trabajos idempotentes: comprueba si ya se hizo, usa claves únicas o registra lo procesado."},
 {t:"opcion", p:"Un trabajo de «enviar newsletter» falla siempre por un dato mal formado y agota los reintentos. ¿Qué debe pasar?",
  ops:["Reintentar para siempre","Que quede en la lista de fallidos (dead letter) con su error, generar una alerta y poder reprocesarlo tras corregir el dato","Borrarlo sin avisar","Parar toda la cola"],
  ok:1, why:"Un error permanente no se arregla reintentando. Se aparta para no bloquear a los demás y se revisa."},
 {t:"codigo", p:"Implementa un procesador con límite de concurrencia: ejecuta todas las tareas pero nunca más de <code>limite</code> a la vez; imprime los resultados en el orden original y la concurrencia máxima observada",
  lenguaje:"js",
  c:`<p>Seis tareas de distinta duración con límite 2. Salida: <code>t1,t2,t3,t4,t5,t6</code> y <code>max=2</code>.</p>`,
  plantilla:"const dormir = ms => new Promise(r => setTimeout(r, ms));\nlet activas = 0, max = 0;\nconst tarea = (id, ms) => async () => {\n  activas++; max = Math.max(max, activas);\n  await dormir(ms);\n  activas--;\n  return id;\n};\nconst tareas = [tarea(\"t1\", 30), tarea(\"t2\", 10), tarea(\"t3\", 20), tarea(\"t4\", 5), tarea(\"t5\", 15), tarea(\"t6\", 5)];\n\nasync function limitar(tareas, limite) {\n  // lanza \"limite\" consumidores que van cogiendo la siguiente tarea libre\n}\n\nlimitar(tareas, 2).then(r => {\n  console.log(r.join(\",\"));\n  console.log(\"max=\" + max);\n});\n",
  pruebas:[{salida:"t1,t2,t3,t4,t5,t6\nmax=2"}],
  pista:"const res = []; let i = 0; const consumidor = async () => { while (i < tareas.length) { const k = i++; res[k] = await tareas[k](); } }; await Promise.all(Array.from({ length: limite }, consumidor)); return res;",
  solucion:"const dormir = ms => new Promise(r => setTimeout(r, ms));\nlet activas = 0, max = 0;\nconst tarea = (id, ms) => async () => {\n  activas++; max = Math.max(max, activas);\n  await dormir(ms);\n  activas--;\n  return id;\n};\nconst tareas = [tarea(\"t1\", 30), tarea(\"t2\", 10), tarea(\"t3\", 20), tarea(\"t4\", 5), tarea(\"t5\", 15), tarea(\"t6\", 5)];\n\nasync function limitar(tareas, limite) {\n  const res = [];\n  let i = 0;\n  const consumidor = async () => {\n    while (i < tareas.length) {\n      const k = i++;\n      res[k] = await tareas[k]();\n    }\n  };\n  await Promise.all(Array.from({ length: limite }, consumidor));\n  return res;\n}\n\nlimitar(tareas, 2).then(r => {\n  console.log(r.join(\",\"));\n  console.log(\"max=\" + max);\n});",
  why:"Es lo que hace concurrency en un worker de BullMQ (o p-limit): Promise.all sin límite sobre 10 000 tareas abriría 10 000 conexiones a la vez. Tomar el índice con i++ es seguro porque JavaScript no se interrumpe entre medias."}
]}

]});
