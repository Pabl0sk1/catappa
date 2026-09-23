window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Servidores HTTP y Express",
resumen: "El módulo http y fetch nativo, Express 5: rutas, middleware, validación y errores, y tiempo real con WebSockets y Server-Sent Events",
nivel: "Intermedio",
color: "#72b24d",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"nd3l1",
titulo:"Un servidor con node:http",
claves:["http.createServer recibe (req, res) por cada petición; req y res son streams","Sin framework, el enrutado, el parseo del cuerpo y sus límites son cosa tuya","fetch viene de serie como cliente HTTP; los tiempos de espera del servidor se configuran"],
pasos:[
 {t:"info", eti:"Sin framework", h:"node:http",
  c:`<div class="termbox">import http from "node:http";

const servidor = http.createServer(async (req, res) =&gt; {
  if (req.method === "GET" &amp;&amp; req.url === "/api/salud") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ estado: "ok" }));
  }
  if (req.method === "POST" &amp;&amp; req.url === "/api/eco") {
    const cuerpo = await leerCuerpo(req, 100_000);           // máximo 100 KB
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(cuerpo);
  }
  res.writeHead(404).end();
});
servidor.listen(3000, () =&gt; console.log("Escuchando en :3000"));

async function leerCuerpo(req, max) {
  const trozos = []; let total = 0;
  for await (const t of req) {                              // el cuerpo llega por trozos
    total += t.length;
    if (total &gt; max) throw Object.assign(new Error("Cuerpo demasiado grande"), { status: 413 });
    trozos.push(t);
  }
  return Buffer.concat(trozos).toString("utf8");
}</div>
     <p>Esta misma plataforma (Catappa) está hecha así: un servidor de Node sin dependencias. Para APIs grandes, un framework ahorra mucho trabajo.</p>`},
 {t:"info", eti:"Cliente y ajustes", h:"fetch y los tiempos de espera",
  c:`<div class="termbox">// cliente HTTP nativo (undici por debajo)
const r = await fetch("https://api.pagos.dev/cobros", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ importe: 1999 }),
  signal: AbortSignal.timeout(5000),          // sin límite, una API colgada te cuelga a ti
});
if (!r.ok) throw new Error(\`pagos respondió \${r.status}\`);
const datos = await r.json();

// servidor: tiempos de espera
servidor.keepAliveTimeout = 65_000;   // mayor que el del balanceador (60 s en un ALB)
servidor.headersTimeout = 66_000;
servidor.requestTimeout = 30_000;</div>
     <div class="nota ojo"><b class="tit">502 intermitentes detrás de un balanceador</b>Si Node cierra una conexión keep-alive inactiva justo cuando el balanceador la reutiliza, el cliente recibe un 502. Por eso <code>keepAliveTimeout</code> debe superar el tiempo de inactividad del balanceador.</div>`},
 {t:"opcion", p:"¿Qué tienes que hacer tú a mano con <code>node:http</code> que Express te da hecho?",
  ops:["Nada","Enrutar por método y ruta, leer y parsear el cuerpo JSON, gestionar errores y middleware","Abrir el puerto","Usar TCP"],
  ok:1, why:"Por eso casi todos los proyectos usan Express, Fastify, NestJS o Hono."},
 {t:"vf", p:"<code>req</code> y <code>res</code> en node:http son streams.",
  ok:true, why:"El cuerpo de la petición llega por trozos (Readable); la respuesta se escribe como un Writable."},
 {t:"opcion", p:"Tu servidor sin framework lee el cuerpo sin límite. ¿Qué riesgo corre?",
  ops:["Ninguno","Que alguien envíe cientos de MB y agote la memoria: hay que cortar al superar un tamaño y responder 413","Que el JSON salga mal formateado","Que se pierdan cabeceras"],
  ok:1, why:"Un ataque de denegación de servicio barato. express.json() trae un límite de 100 KB por defecto."},
 {t:"codigo", p:"Monta un servidor real en un puerto libre, pídele <code>/api/salud</code> con <code>fetch</code> e imprime el código de estado y el campo <code>estado</code> del JSON; después ciérralo",
  lenguaje:"js",
  c:`<p><code>listen(0)</code> elige un puerto libre; lo lees con <code>servidor.address().port</code>. Salida: <code>200</code> y <code>ok</code>.</p>`,
  plantilla:"const http = require(\"node:http\");\n\nconst servidor = http.createServer((req, res) => {\n  // responde {\"estado\":\"ok\"} en GET /api/salud y 404 en lo demás\n});\n\nservidor.listen(0, async () => {\n  const puerto = servidor.address().port;\n  // haz la petición con fetch, imprime y cierra el servidor\n});\n",
  pruebas:[{salida:"200\nok"}],
  pista:"En el manejador: res.writeHead(200, {\"Content-Type\": \"application/json\"}); res.end(JSON.stringify({ estado: \"ok\" })). En el cliente: const r = await fetch(`http://127.0.0.1:${puerto}/api/salud`).",
  solucion:"const http = require(\"node:http\");\n\nconst servidor = http.createServer((req, res) => {\n  if (req.method === \"GET\" && req.url === \"/api/salud\") {\n    res.writeHead(200, { \"Content-Type\": \"application/json\" });\n    return res.end(JSON.stringify({ estado: \"ok\" }));\n  }\n  res.writeHead(404).end();\n});\n\nservidor.listen(0, async () => {\n  const puerto = servidor.address().port;\n  const r = await fetch(\"http://127.0.0.1:\" + puerto + \"/api/salud\");\n  const datos = await r.json();\n  console.log(r.status);\n  console.log(datos.estado);\n  servidor.close();\n});",
  why:"Si no cierras el servidor, el proceso sigue vivo esperando conexiones. Esta técnica (puerto 0 y fetch) es la base de muchas pruebas de integración."},
 {t:"codigo", p:"Escribe un enrutador mínimo: para cada línea <code>MÉTODO RUTA</code> de stdin imprime qué manejador responde",
  lenguaje:"js",
  c:`<p>Rutas: <code>GET /api/tareas</code> → <code>listar</code>; <code>POST /api/tareas</code> → <code>crear</code>; <code>GET /api/tareas/:id</code> → <code>detalle ID</code> (solo si el id es numérico); <code>DELETE /api/tareas/:id</code> → <code>borrar ID</code>; ruta desconocida → <code>404</code>; ruta conocida con otro método → <code>405</code>.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const l of lineas) {\n  const [metodo, ruta] = l.split(\" \");\n  // imprime listar, crear, detalle N, borrar N, 404 o 405\n}\n",
  pruebas:[{entrada:"GET /api/tareas\nPOST /api/tareas\nGET /api/tareas/7\n", salida:"listar\ncrear\ndetalle 7"},{entrada:"DELETE /api/tareas/3\nGET /api/usuarios\nPUT /api/tareas\n", salida:"borrar 3\n404\n405"},{entrada:"GET /api/tareas/abc\nPATCH /api/tareas/9\n", salida:"404\n405", oculta:true}],
  pista:"Usa una expresión regular como /^\\/api\\/tareas\\/(\\d+)$/ para la ruta con id. Primero decide si la ruta existe; después, si el método vale.",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const l of lineas) {\n  const [metodo, ruta] = l.split(\" \");\n  const m = ruta.match(/^\\/api\\/tareas\\/(\\d+)$/);\n  if (ruta === \"/api/tareas\") {\n    if (metodo === \"GET\") console.log(\"listar\");\n    else if (metodo === \"POST\") console.log(\"crear\");\n    else console.log(\"405\");\n  } else if (m) {\n    if (metodo === \"GET\") console.log(\"detalle \" + m[1]);\n    else if (metodo === \"DELETE\") console.log(\"borrar \" + m[1]);\n    else console.log(\"405\");\n  } else {\n    console.log(\"404\");\n  }\n}",
  why:"404 dice «esa ruta no existe»; 405 (Method Not Allowed) dice «existe, pero no con ese método». Es exactamente lo que resuelve el router de un framework."}
]},

/* =============== U5 L2 =============== */
{
id:"nd3l2",
titulo:"Express: rutas y middleware",
claves:["app.get/post/put/delete definen rutas; req.params, req.query y req.body traen los datos","Un middleware es (req, res, next) y se ejecuta en cadena, en el orden en que se registra","express.json() para leer cuerpos JSON; Router para agrupar rutas; Express 5 es la versión actual"],
pasos:[
 {t:"info", eti:"El framework clásico", h:"Una API con Express",
  c:`<div class="termbox">import express from "express";
const app = express();
app.use(express.json({ limit: "100kb" }));           // parsear JSON

app.use((req, res, next) =&gt; {                          // middleware de log
  const inicio = performance.now();
  res.on("finish", () =&gt; console.log(req.method, req.originalUrl, res.statusCode, Math.round(performance.now() - inicio), "ms"));
  next();
});

const tareas = express.Router();
tareas.get("/", async (req, res) =&gt; res.json(await repo.listar(req.query.estado)));
tareas.get("/:id", async (req, res) =&gt; {
  const t = await repo.buscar(Number(req.params.id));
  if (!t) return res.status(404).json({ detail: "No existe" });
  res.json(t);
});
tareas.post("/", async (req, res) =&gt; res.status(201).json(await repo.crear(req.body)));

app.use("/api/tareas", tareas);
export default app;       // el listen va en otro fichero: así se puede probar</div>`},
 {t:"info", eti:"Express 5", h:"Qué cambió en Express 5",
  c:`<p>Express 5 es la versión <code>latest</code> de npm desde 2025 y pide Node 18 o superior. Los cambios que más se notan:</p>
     <ul><li>Los errores de funciones <b>async</b> llegan solos al middleware de errores.</li>
     <li>Sintaxis de rutas más estricta: el comodín ya no es <code>*</code> sino <code>/*nombre</code>, y los opcionales van entre llaves: <code>/archivos{/:formato}</code>.</li>
     <li><code>req.query</code> es de solo lectura y <code>req.body</code> es <code>undefined</code> si no hay parser.</li>
     <li>Se eliminaron métodos obsoletos: <code>res.send(estado, cuerpo)</code>, <code>app.del</code>…</li></ul>`},
 {t:"par", p:"Empareja cada propiedad con de dónde viene el dato",
  pares:[["req.params.id","Segmento de la ruta: /api/tareas/:id"],["req.query.estado","Cadena de consulta: ?estado=pendiente"],["req.body","Cuerpo JSON (con express.json())"],["req.headers.authorization","Cabecera Authorization"]],
  why:"Es exactamente lo mismo que @PathVariable, @RequestParam, @RequestBody y @RequestHeader en Spring."},
 {t:"orden", p:"Ordena por dónde pasa una petición en una app Express típica",
  items:["Middleware de seguridad y CORS","express.json() parsea el cuerpo","Middleware de autenticación","El manejador de la ruta","Middleware de errores si algo lanza"],
  why:"El orden de app.use importa: se ejecutan en el orden en que se registran."},
 {t:"opcion", p:"Un middleware no llama a <code>next()</code> ni responde. ¿Qué pasa con la petición?",
  ops:["Pasa al siguiente automáticamente","Se queda colgada hasta que el cliente agota su timeout","Express devuelve 500","Se reintenta"],
  ok:1, why:"Un middleware debe responder o llamar a next()."},
 {t:"vf", p:"<code>req.params.id</code> llega como número si la ruta es <code>/tareas/:id</code> y la URL es <code>/tareas/7</code>.",
  ok:false, why:"Todo lo que viene de la URL es texto: \"7\". Convierte y valida (Number, parseInt o un esquema de zod con coerce)."},
 {t:"hueco", p:"Completa el middleware que añade un identificador a cada petición",
  tpl:"app.use((req, res, ___) => {\n  req.id = crypto.randomUUID();\n  res.setHeader(\"X-Request-Id\", req.id);\n  ___();\n});",
  banco:["next","next","req","done","return"], sol:["next","next"],
  why:"El tercer parámetro es la función que pasa el control al siguiente eslabón de la cadena."},
 {t:"codigo", p:"Implementa la cadena de middleware de Express: <code>ejecutar(middlewares, req)</code> llama a cada uno con <code>(req, next)</code>, y <code>next()</code> pasa al siguiente",
  lenguaje:"js",
  c:`<p>Con los tres middlewares de la plantilla, la salida debe ser <code>log</code>, <code>auth ana</code>, <code>ruta ana</code>. Si un middleware no llama a <code>next</code>, la cadena se detiene.</p>`,
  plantilla:"function ejecutar(middlewares, req) {\n  // llama al primero con una función next que avance al siguiente\n}\n\nejecutar([\n  (req, next) => { console.log(\"log\"); next(); },\n  (req, next) => { req.usuario = \"ana\"; console.log(\"auth \" + req.usuario); next(); },\n  (req, next) => { console.log(\"ruta \" + req.usuario); },\n  (req, next) => { console.log(\"nunca\"); },\n], {});\n",
  pruebas:[{salida:"log\nauth ana\nruta ana"}],
  pista:"Una función interna paso(i) que, si hay middleware i, lo llama con (req, () => paso(i + 1)). Empieza con paso(0).",
  solucion:"function ejecutar(middlewares, req) {\n  const paso = i => {\n    const mw = middlewares[i];\n    if (mw) mw(req, () => paso(i + 1));\n  };\n  paso(0);\n}\n\nejecutar([\n  (req, next) => { console.log(\"log\"); next(); },\n  (req, next) => { req.usuario = \"ana\"; console.log(\"auth \" + req.usuario); next(); },\n  (req, next) => { console.log(\"ruta \" + req.usuario); },\n  (req, next) => { console.log(\"nunca\"); },\n], {});",
  why:"Así funciona Express por dentro: cada next es un cierre que sabe cuál es el siguiente. Por eso un middleware puede enriquecer req (req.usuario) para los que vienen detrás."}
]},

/* =============== U5 L3 =============== */
{
id:"nd3l3",
titulo:"Errores y validación",
claves:["Un middleware de errores tiene cuatro parámetros (err, req, res, next) y va al final","Express 5 captura errores de funciones async; en Express 4 hay que pasarlos a next","Valida la entrada con zod antes de usarla y responde errores coherentes"],
pasos:[
 {t:"info", eti:"Robustez", h:"Validar y gestionar errores",
  c:`<div class="termbox">import { z } from "zod";

const NuevaTarea = z.object({
  titulo: z.string().trim().min(1).max(200),
  prioridad: z.enum(["baja", "media", "alta"]).default("media"),
});

tareas.post("/", async (req, res) =&gt; {
  const r = NuevaTarea.safeParse(req.body);
  if (!r.success) return res.status(400).json({ detail: "Datos no válidos", errores: r.error.issues });
  res.status(201).json(await repo.crear(r.data));     // r.data ya viene limpio y con valores por defecto
});

// al final de todo
app.use((err, req, res, next) =&gt; {
  req.log?.error(err);
  res.status(err.status ?? 500).json({ detail: err.status ? err.message : "Error interno" });
});</div>`},
 {t:"info", eti:"Express 4", h:"Errores async en código antiguo",
  c:`<p>Express 4 no mira las promesas que devuelven tus rutas: si una ruta <code>async</code> lanza, el error se pierde (rechazo sin gestionar) y el cliente se queda esperando. El parche clásico:</p>
     <div class="termbox">const envolver = fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next);

router.get("/:id", envolver(async (req, res) =&gt; { ... }));</div>
     <p>En Express 5 no hace falta. Si mantienes código en Express 4, migrar suele ser más rentable que envolver cada ruta.</p>
     <div class="nota"><b class="tit">Errores con significado</b>Crea clases como <code>NoEncontrado</code> (404) o <code>Conflicto</code> (409) con una propiedad <code>status</code>. El middleware de errores las traduce, y el resto de fallos son 500 sin detalles internos.</div>`},
 {t:"par", p:"Empareja cada situación con la respuesta adecuada",
  pares:[["Cuerpo que no cumple el esquema","400 con los errores de cada campo"],["Recurso que no existe","404"],["Error inesperado","500 sin detalles internos, registrado en el log"],["Sin token","401"],["Email ya registrado","409"]],
  why:"Igual que en Spring con @RestControllerAdvice: errores coherentes y sin filtrar detalles."},
 {t:"opcion", p:"En Express 4, una ruta <code>async</code> lanza un error y el cliente se queda esperando. ¿Por qué?",
  ops:["Express no admite async","Express 4 no captura las promesas rechazadas: hay que hacer try/catch y next(err), o usar Express 5","Falta express.json()","Falta un return"],
  ok:1, why:"Express 5 ya reenvía automáticamente los errores de funciones async al middleware de errores."},
 {t:"vf", p:"Confiar en <code>req.body</code> sin validarlo es seguro si el frontend ya valida.",
  ok:false, why:"Cualquiera puede llamar a tu API directamente con curl."},
 {t:"opcion", p:"¿Cómo reconoce Express que un middleware es de errores?",
  ops:["Por su nombre","Porque declara cuatro parámetros: (err, req, res, next)","Porque se registra con app.error","Porque va el primero"],
  ok:1, why:"Express mira fn.length. Si le quitas next aunque no lo uses, deja de ser middleware de errores."},
 {t:"codigo", p:"Valida un cuerpo sin librerías: para cada JSON de stdin (uno por línea) imprime <code>ok</code> o los errores separados por <code>; </code>",
  lenguaje:"js",
  c:`<p>Reglas: <code>titulo</code> obligatorio, texto de 1 a 20 caracteres tras quitar espacios (errores <code>titulo obligatorio</code> o <code>titulo largo</code>); <code>prioridad</code>, si viene, debe ser <code>baja</code>, <code>media</code> o <code>alta</code> (error <code>prioridad no válida</code>). Si la línea no es JSON válido: <code>json no válido</code>.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfunction validar(cuerpo) {\n  const errores = [];\n  // ...\n  return errores;\n}\nfor (const l of lineas) {\n  // parsea, valida e imprime\n}\n",
  pruebas:[{entrada:"{\"titulo\":\"Repasar Node\"}\n{\"titulo\":\"  \"}\n", salida:"ok\ntitulo obligatorio"},{entrada:"{\"titulo\":\"x\",\"prioridad\":\"urgente\"}\n{no es json\n", salida:"prioridad no válida\njson no válido"},{entrada:"{\"prioridad\":\"muy\"}\n{\"titulo\":\"un título larguísimo de verdad\"}\n", salida:"titulo obligatorio; prioridad no válida\ntitulo largo", oculta:true}],
  pista:"try { cuerpo = JSON.parse(l) } catch { ... }. Para el título: typeof c.titulo !== \"string\" || c.titulo.trim() === \"\".",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfunction validar(c) {\n  const errores = [];\n  if (typeof c.titulo !== \"string\" || c.titulo.trim() === \"\") errores.push(\"titulo obligatorio\");\n  else if (c.titulo.trim().length > 20) errores.push(\"titulo largo\");\n  if (c.prioridad !== undefined && ![\"baja\", \"media\", \"alta\"].includes(c.prioridad)) errores.push(\"prioridad no válida\");\n  return errores;\n}\nfor (const l of lineas) {\n  let cuerpo;\n  try { cuerpo = JSON.parse(l); } catch { console.log(\"json no válido\"); continue; }\n  const e = validar(cuerpo);\n  console.log(e.length ? e.join(\"; \") : \"ok\");\n}",
  why:"Devolver todos los errores a la vez (no solo el primero) ahorra idas y vueltas al cliente. zod o Ajv hacen esto mismo de forma declarativa y además te dan los tipos."},
 {t:"codigo", p:"Escribe <code>envolver(fn)</code>, el parche de Express 4: devuelve un manejador que ejecuta <code>fn</code> y, si su promesa se rechaza, llama a <code>next(err)</code>",
  lenguaje:"js",
  c:`<p>La plantilla simula dos rutas: una que responde bien y otra que lanza. Salida: <code>respuesta ok</code> y <code>next recibió: base de datos caída</code>.</p>`,
  plantilla:"function envolver(fn) {\n  // devuelve (req, res, next) => ...\n}\n\nconst bien = envolver(async (req, res) => res.send(\"ok\"));\nconst mal = envolver(async () => { throw new Error(\"base de datos caída\"); });\nconst res = { send: t => console.log(\"respuesta \" + t) };\nconst next = e => console.log(\"next recibió: \" + e.message);\n\n(async () => {\n  await bien({}, res, next);\n  await mal({}, res, next);\n})();\n",
  pruebas:[{salida:"respuesta ok\nnext recibió: base de datos caída"}],
  pista:"return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);",
  solucion:"function envolver(fn) {\n  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);\n}\n\nconst bien = envolver(async (req, res) => res.send(\"ok\"));\nconst mal = envolver(async () => { throw new Error(\"base de datos caída\"); });\nconst res = { send: t => console.log(\"respuesta \" + t) };\nconst next = e => console.log(\"next recibió: \" + e.message);\n\n(async () => {\n  await bien({}, res, next);\n  await mal({}, res, next);\n})();",
  why:"Promise.resolve cubre también funciones no async. Devolver la promesa permite esperarla en las pruebas. Express 5 hace esto internamente en cada ruta."}
]},

/* =============== U5 L4 =============== */
{
id:"nd3l4",
titulo:"Tiempo real con WebSockets",
claves:["HTTP es petición-respuesta; WebSocket mantiene un canal bidireccional abierto","Server-Sent Events cuando solo el servidor envía","Con varias réplicas, un bus (Redis pub/sub) reparte los mensajes"],
pasos:[
 {t:"info", eti:"Empujar datos", h:"WebSockets y SSE",
  c:`<div class="termbox">import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ server });           // comparte puerto con Express

wss.on("connection", (socket, req) =&gt; {
  socket.on("message", datos =&gt; {
    for (const cliente of wss.clients) cliente.send(String(datos));   // difundir
  });
});

// Server-Sent Events: solo servidor -&gt; cliente, sobre HTTP normal
app.get("/api/eventos", (req, res) =&gt; {
  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
  const id = setInterval(() =&gt; res.write(\`data: \${JSON.stringify({ hora: Date.now() })}\\n\\n\`), 1000);
  req.on("close", () =&gt; clearInterval(id));
});</div>
     <p>En el servidor, el paquete <code>ws</code> (o Socket.IO, que añade salas y reconexión) sigue siendo lo habitual. Node 22 ya trae un <b>cliente</b> <code>WebSocket</code> global, pero no un servidor.</p>`},
 {t:"info", eti:"En producción", h:"Conexiones que viven mucho",
  c:`<ul><li><b>Autenticación</b>: se hace en el handshake (cookie o token) antes de aceptar la conexión.</li>
     <li><b>Latidos</b>: envía ping cada 30 s y cierra las conexiones que no responden; si no, se acumulan sockets muertos.</li>
     <li><b>Contrapresión</b>: un cliente lento acumula mensajes en <code>socket.bufferedAmount</code>. Pon un tope y desconéctalo.</li>
     <li><b>Varias réplicas</b>: cada una solo conoce sus sockets. Un bus compartido (Redis pub/sub) reparte los mensajes.</li>
     <li><b>Despliegues</b>: al recibir SIGTERM, cierra los sockets con código 1001 para que los clientes reconecten a otra réplica.</li></ul>
     <div class="dg"><div class="dg-tit">difusión entre réplicas</div>
       <div class="dg-flujo"><div class="dg-caja">réplica A<small>recibe un mensaje</small></div><div class="dg-caja acento">Redis pub/sub</div><div class="dg-caja ok">réplicas A, B y C<small>lo envían a sus sockets</small></div></div></div>`},
 {t:"par", p:"Empareja cada técnica con su caso de uso",
  pares:[["WebSocket","Chat o edición colaborativa: mensajes en ambos sentidos"],["Server-Sent Events","Notificaciones o progreso que solo envía el servidor"],["Polling","Consultar cada X segundos (sencillo pero ineficiente)"],["Redis pub/sub","Repartir mensajes entre varias réplicas del servidor"]],
  why:"Node es muy bueno manteniendo miles de conexiones abiertas a la vez."},
 {t:"opcion", p:"Tienes 3 réplicas del servidor de chat detrás de un balanceador y los mensajes solo llegan a quienes están en la misma réplica. ¿Solución?",
  ops:["Una sola réplica","Un bus compartido (Redis pub/sub o similar) para difundir entre réplicas","Polling","Más memoria"],
  ok:1, why:"Cada réplica solo conoce sus propias conexiones."},
 {t:"vf", p:"Server-Sent Events necesita un protocolo distinto de HTTP y un paquete especial en el navegador.",
  ok:false, why:"Es HTTP normal con Content-Type text/event-stream, y el navegador trae EventSource, que además reconecta solo."},
 {t:"opcion", p:"La memoria del servidor de WebSockets crece durante días aunque el número de usuarios activos es estable. ¿Qué revisas primero?",
  ops:["El tamaño de los mensajes","Que haya latidos (ping/pong) que cierren las conexiones muertas y que se quiten los listeners y temporizadores al cerrar","La versión de ws","El número de réplicas"],
  ok:1, why:"Las conexiones que se cortan sin cerrar (móviles que pierden cobertura) no avisan: sin latidos, siguen en memoria para siempre."},
 {t:"codigo", p:"Formatea mensajes de Server-Sent Events: para cada línea <code>evento|id|json</code> de stdin, imprime el bloque SSE",
  lenguaje:"js",
  c:`<p>Formato: <code>event: EVENTO</code>, <code>id: ID</code> y <code>data: JSON</code>, cada uno en su línea, y una línea en blanco tras cada mensaje. Por ejemplo <code>progreso|1|{"pct":50}</code> produce:</p>
     <div class="termbox">event: progreso
id: 1
data: {"pct":50}
</div>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const l of lineas) {\n  const [evento, id, datos] = l.split(\"|\");\n  // escribe el bloque SSE\n}\n",
  pruebas:[{entrada:"progreso|1|{\"pct\":50}\nfin|2|{\"ok\":true}\n", salida:"event: progreso\nid: 1\ndata: {\"pct\":50}\n\nevent: fin\nid: 2\ndata: {\"ok\":true}"},{entrada:"aviso|7|\"hola\"\n", salida:"event: aviso\nid: 7\ndata: \"hola\"", oculta:true}],
  pista:"process.stdout.write(`event: ${evento}\\nid: ${id}\\ndata: ${datos}\\n\\n`);",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const l of lineas) {\n  const [evento, id, datos] = l.split(\"|\");\n  process.stdout.write(\"event: \" + evento + \"\\nid: \" + id + \"\\ndata: \" + datos + \"\\n\\n\");\n}",
  why:"La línea en blanco marca el final de cada mensaje. El id permite al navegador reanudar: al reconectar envía la cabecera Last-Event-ID y el servidor sigue desde ahí."}
]}

]});
