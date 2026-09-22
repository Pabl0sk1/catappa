window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Servidores HTTP y Express",
resumen: "El módulo http, Express: rutas, middleware, JSON, errores y organización de una API REST",
nivel: "Intermedio",
color: "#72b24d",
lecciones: [

{
id:"nd3l1",
titulo:"Un servidor con node:http",
claves:["http.createServer recibe (req, res) por cada petición","Tienes que parsear el cuerpo, enrutar y poner cabeceras a mano","Frameworks como Express o Fastify lo simplifican"],
pasos:[
 {t:"info", eti:"Sin framework", h:"node:http",
  c:`<div class="termbox">import http from "node:http";

const servidor = http.createServer(async (req, res) =&gt; {
  if (req.method === "GET" &amp;&amp; req.url === "/api/salud") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ estado: "ok" }));
  }
  res.writeHead(404).end();
});

servidor.listen(3000, () =&gt; console.log("Escuchando en :3000"));</div>
     <p>Esta misma plataforma (Catappa) está hecha así: un servidor de Node sin dependencias. Para APIs grandes, un framework ahorra mucho trabajo.</p>`},
 {t:"opcion", p:"¿Qué tienes que hacer tú a mano con <code>node:http</code> que Express te da hecho?",
  ops:["Nada","Enrutar por método y ruta, leer y parsear el cuerpo JSON, gestionar errores y middleware","Abrir el puerto","Usar TCP"],
  ok:1, why:"Por eso casi todos los proyectos usan Express, Fastify, NestJS o Hono."},
 {t:"vf", p:"<code>req</code> y <code>res</code> en node:http son streams.",
  ok:true, why:"El cuerpo de la petición llega por trozos; la respuesta se escribe como un stream."}
]},

{
id:"nd3l2",
titulo:"Express: rutas y middleware",
claves:["app.get/post/put/delete definen rutas; req.params, req.query y req.body traen los datos","Un middleware es (req, res, next) y se ejecuta en cadena","express.json() para leer cuerpos JSON; Router para agrupar rutas"],
pasos:[
 {t:"info", eti:"El framework clásico", h:"Una API con Express",
  c:`<div class="termbox">import express from "express";
const app = express();
app.use(express.json());                              // parsear JSON

app.use((req, res, next) =&gt; {                          // middleware de log
  const inicio = Date.now();
  res.on("finish", () =&gt; console.log(req.method, req.url, res.statusCode, Date.now() - inicio, "ms"));
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
app.listen(3000);</div>`},
 {t:"par", p:"Empareja cada propiedad con de dónde viene el dato",
  pares:[["req.params.id","Segmento de la ruta: /api/tareas/:id"],["req.query.estado","Cadena de consulta: ?estado=pendiente"],["req.body","Cuerpo JSON (con express.json())"],["req.headers.authorization","Cabecera Authorization"]],
  why:"Es exactamente lo mismo que @PathVariable, @RequestParam, @RequestBody y @RequestHeader en Spring."},
 {t:"orden", p:"Ordena por dónde pasa una petición en una app Express típica",
  items:["Middleware de seguridad y CORS","express.json() parsea el cuerpo","Middleware de autenticación","El manejador de la ruta","Middleware de errores si algo lanza"],
  why:"El orden de app.use importa: se ejecutan en el orden en que se registran."},
 {t:"opcion", p:"Un middleware no llama a <code>next()</code> ni responde. ¿Qué pasa con la petición?",
  ops:["Pasa al siguiente automáticamente","Se queda colgada hasta que el cliente agota su timeout","Express devuelve 500","Se reintenta"],
  ok:1, why:"Un middleware debe responder o llamar a next()."}
]},

{
id:"nd3l3",
titulo:"Errores y validación",
claves:["Un middleware de errores tiene cuatro parámetros (err, req, res, next)","Express 5 captura errores de funciones async; en Express 4 hay que pasarlos a next","Valida la entrada con zod antes de usarla"],
pasos:[
 {t:"info", eti:"Robustez", h:"Validar y gestionar errores",
  c:`<div class="termbox">import { z } from "zod";

const NuevaTarea = z.object({ titulo: z.string().trim().min(1).max(200) });

tareas.post("/", async (req, res) =&gt; {
  const r = NuevaTarea.safeParse(req.body);
  if (!r.success) return res.status(400).json({ detail: "Datos no válidos", errores: r.error.flatten() });
  res.status(201).json(await repo.crear(r.data));
});

// al final de todo
app.use((err, req, res, next) =&gt; {
  req.log?.error(err);
  res.status(err.status ?? 500).json({ detail: err.status ? err.message : "Error interno" });
});</div>`},
 {t:"par", p:"Empareja cada situación con la respuesta adecuada",
  pares:[["Cuerpo que no cumple el esquema","400 con los errores de cada campo"],["Recurso que no existe","404"],["Error inesperado","500 sin detalles internos, registrado en el log"],["Sin token","401"]],
  why:"Igual que en Spring con @RestControllerAdvice: errores coherentes y sin filtrar detalles."},
 {t:"opcion", p:"En Express 4, una ruta <code>async</code> lanza un error y el cliente se queda esperando. ¿Por qué?",
  ops:["Express no admite async","Express 4 no captura las promesas rechazadas: hay que hacer try/catch y next(err), o usar Express 5","Falta express.json()","Falta un return"],
  ok:1, why:"Express 5 ya reenvía automáticamente los errores de funciones async al middleware de errores."},
 {t:"vf", p:"Confiar en <code>req.body</code> sin validarlo es seguro si el frontend ya valida.",
  ok:false, why:"Cualquiera puede llamar a tu API directamente."}
]},

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
});</div>`},
 {t:"par", p:"Empareja cada técnica con su caso de uso",
  pares:[["WebSocket","Chat o edición colaborativa: mensajes en ambos sentidos"],["Server-Sent Events","Notificaciones o progreso que solo envía el servidor"],["Polling","Consultar cada X segundos (sencillo pero ineficiente)"],["Redis pub/sub","Repartir mensajes entre varias réplicas del servidor"]],
  why:"Node es muy bueno manteniendo miles de conexiones abiertas a la vez."},
 {t:"opcion", p:"Tienes 3 réplicas del servidor de chat detrás de un balanceador y los mensajes solo llegan a quienes están en la misma réplica. ¿Solución?",
  ops:["Una sola réplica","Un bus compartido (Redis pub/sub o similar) para difundir entre réplicas","Polling","Más memoria"],
  ok:1, why:"Cada réplica solo conoce sus propias conexiones."}
]}

]});
