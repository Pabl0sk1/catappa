window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Pruebas y rendimiento",
resumen: "Pruebas con node:test o Vitest y Supertest, perfilar y no bloquear el event loop, worker_threads, cluster, caché y colas de trabajos",
nivel: "Avanzado",
color: "#65a541",
lecciones: [

{
id:"nd6l1",
titulo:"Probar una API",
claves:["node:test integrado o Vitest para pruebas unitarias","Supertest hace peticiones a la app de Express sin abrir un puerto","Base de datos real en pruebas de integración con Testcontainers"],
pasos:[
 {t:"info", eti:"Probar", h:"Supertest",
  c:`<div class="termbox">import { describe, it, expect } from "vitest";
import request from "supertest";
import { crearApp } from "../src/app.js";

describe("POST /api/tareas", () =&gt; {
  const app = crearApp({ repo: repoEnMemoria() });

  it("crea una tarea válida", async () =&gt; {
    const res = await request(app).post("/api/tareas").send({ titulo: "Repasar Node" });
    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe("Repasar Node");
  });

  it("rechaza un título vacío", async () =&gt; {
    const res = await request(app).post("/api/tareas").send({ titulo: "" });
    expect(res.status).toBe(400);
  });
});</div>
     <p>Separar <code>crearApp()</code> de <code>app.listen()</code> permite probar la app e inyectar dependencias falsas.</p>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["node:test","Ejecutor de pruebas integrado en Node"],["Vitest","Pruebas rápidas con API compatible con Jest"],["Supertest","Peticiones HTTP a la app sin servidor real"],["Testcontainers","PostgreSQL o Redis reales en Docker durante las pruebas"]],
  why:"Este proyecto usa pruebas de API y de navegador muy parecidas."},
 {t:"vf", p:"Para probar una app de Express con Supertest hace falta arrancarla con listen en un puerto.",
  ok:false, why:"Supertest recibe la app y gestiona el servidor por ti."}
]},

{
id:"nd6l2",
titulo:"Rendimiento y escalado",
claves:["Mide antes: --cpu-prof, clinic.js, métricas de latencia del event loop","worker_threads para CPU intensiva; cluster o varias réplicas para usar todos los núcleos","Caché (Redis) y colas de trabajos (BullMQ) para sacar trabajo de la petición"],
pasos:[
 {t:"info", eti:"Un hilo, bien usado", h:"Escalar Node",
  c:`<ul><li><b>Varias réplicas</b>: un proceso de Node usa un núcleo para tu JavaScript. En producción se ejecutan varias réplicas (contenedores en Kubernetes, o el módulo <code>cluster</code>/PM2 en un servidor).</li>
     <li><b>worker_threads</b>: cálculo pesado (imágenes, PDFs, criptografía) fuera del hilo principal.</li>
     <li><b>Colas</b>: enviar correos, generar informes o procesar vídeos en un worker aparte (BullMQ sobre Redis). La petición responde enseguida con 202.</li>
     <li><b>Caché</b>: Redis para resultados costosos o sesiones compartidas entre réplicas.</li></ul>
     <div class="termbox">import { monitorEventLoopDelay } from "node:perf_hooks";
const h = monitorEventLoopDelay(); h.enable();
setInterval(() =&gt; console.log("p99 event loop", h.percentile(99) / 1e6, "ms"), 10_000);</div>`},
 {t:"par", p:"Empareja cada problema con la solución",
  pares:[["Generar un PDF tarda 3 s y bloquea el servidor","worker_thread o cola de trabajos"],["El servidor tiene 8 núcleos y Node usa uno","Varias réplicas o cluster"],["La misma consulta costosa se repite mucho","Caché en Redis con TTL"],["Enviar 10.000 correos tras una acción","Cola de trabajos con reintentos"]],
  why:"El retraso del event loop es la métrica que delata código bloqueante."},
 {t:"opcion", p:"La latencia de todas las rutas sube a la vez cuando alguien exporta un informe grande. ¿Qué sospechas?",
  ops:["La red","Código síncrono pesado en la exportación que bloquea el event loop para todos","El DNS","Poca memoria"],
  ok:1, why:"Mueve ese trabajo a un worker o una cola."}
]},

{
id:"nd6l3",
titulo:"Colas de trabajos con BullMQ",
claves:["Una cola saca el trabajo lento de la petición: la API responde 202 y un worker lo procesa","BullMQ sobre Redis: reintentos con espera, prioridades, trabajos programados","Workers escalables por separado y trabajos idempotentes"],
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
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["attempts: 5","Reintentar hasta 5 veces si falla"],["backoff exponencial","Esperar cada vez más entre reintentos"],["jobId fijo","Evitar trabajos duplicados"],["concurrency: 4","Procesar 4 trabajos a la vez por worker"],["202 Accepted","La petición se aceptó y se procesará después"]],
  why:"Es el mismo patrón que SQS + worker en AWS o @Async con colas en Spring."},
 {t:"opcion", p:"¿Qué ventaja tiene ejecutar los workers en contenedores separados de la API?",
  ops:["Ninguna","Escalan de forma independiente y un pico de trabajos pesados no ralentiza las peticiones de la API","Son más baratos siempre","Evitan usar Redis"],
  ok:1, why:"En Kubernetes, incluso pueden escalar según la longitud de la cola (KEDA)."}
]}

]});
