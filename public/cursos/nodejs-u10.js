window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Configuración, logs y apagado ordenado",
resumen: "Variables de entorno validadas al arrancar, logs estructurados con pino y contexto por petición con AsyncLocalStorage, y un cierre ordenado al recibir SIGTERM",
nivel: "Experto",
color: "#589834",
lecciones: [

/* =============== U10 L1 =============== */
{
id:"nd10n1",
titulo:"Configuración y variables de entorno",
claves:["La configuración que cambia entre entornos va en variables de entorno (twelve-factor)","Valídala al arrancar y falla rápido con un mensaje claro","--env-file y process.loadEnvFile sustituyen a dotenv; los secretos nunca en el repositorio"],
pasos:[
 {t:"info", eti:"Twelve-factor", h:"Un solo artefacto, muchos entornos",
  c:`<p>La misma imagen Docker debe servir para desarrollo, staging y producción. Lo que cambia (URL de la base de datos, claves, nivel de log) llega por <b>variables de entorno</b>.</p>
     <div class="termbox">// config.js: el ÚNICO sitio que lee process.env
import { z } from "zod";

const Esquema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRETO: z.string().min(32),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

const r = Esquema.safeParse(process.env);
if (!r.success) {
  console.error("Configuración no válida:", r.error.issues.map(i =&gt; i.path.join(".") + ": " + i.message));
  process.exit(1);                         // fallar al arrancar, no en la primera petición
}
export const config = Object.freeze(r.data);</div>
     <div class="termbox">node --env-file=.env src/server.js          # carga .env (Node 20.6+)
process.loadEnvFile(".env.local");          // lo mismo desde código (Node 20.12+)</div>`},
 {t:"info", eti:"Secretos", h:"Dónde viven los secretos",
  c:`<ul><li><b>.env</b> solo en local y en el <code>.gitignore</code>. Sube un <code>.env.example</code> con los nombres y sin valores.</li>
     <li><b>En producción</b>: el gestor de secretos de la plataforma (AWS Secrets Manager, Vault, Secrets de Kubernetes) inyecta las variables al arrancar.</li>
     <li><b>Nunca</b> los escribas en logs: un <code>log.info(config)</code> los filtra a todo el que lea los logs.</li></ul>
     <div class="nota ojo"><b class="tit">NODE_ENV=production</b>No es decorativo: Express desactiva las trazas de error en las respuestas y activa cachés de plantillas, y muchas librerías cambian su comportamiento. Pero no lo uses para distinguir staging de producción: para eso, variables propias.</div>`},
 {t:"par", p:"Empareja cada práctica con su motivo",
  pares:[["Validar la configuración al arrancar","Fallar en el despliegue y no en la primera petición"],["Un único módulo config","No tener process.env repartido por todo el código"],[".env.example en el repositorio","Documentar qué variables hacen falta"],["Object.freeze(config)","Que nadie la modifique en tiempo de ejecución"]],
  why:"Un pod que no arranca por una variable ausente lo detecta Kubernetes antes de enviarle tráfico. Uno que arranca y falla después, lo detectan tus usuarios."},
 {t:"vf", p:"<code>process.env.PORT</code> es un número si en el entorno pusiste <code>PORT=8080</code>.",
  ok:false, why:"Todas las variables de entorno son texto. Por eso z.coerce.number() o Number(), y validar el rango."},
 {t:"opcion", p:"En producción, la variable <code>FEATURE_PAGOS=false</code> activa los pagos igualmente. ¿Por qué?",
  ops:["Un bug de Node","\"false\" es una cadena no vacía, y en JavaScript las cadenas no vacías son verdaderas: hay que comparar con \"true\" o parsearla","Falta reiniciar","Las variables no se leen en producción"],
  ok:1, why:"Un clásico. if (process.env.FEATURE_PAGOS) es true con cualquier valor, incluido \"false\" y \"0\"."},
 {t:"term", p:"Arranca <code>src/server.js</code> cargando <code>.env</code> pero sin fallar si ese fichero no existe (Node 22+)",
  prompt:"pablo@portatil:~/api$", sol:["node --env-file-if-exists=.env src/server.js","node --env-file-if-exists .env src/server.js"],
  pista:"Es la variante «si existe» de --env-file.",
  salida:`{"level":30,"msg":"arrancado","puerto":3000}`, why:"Útil en contenedores, donde las variables llegan del orquestador y no hay .env."},
 {t:"codigo", p:"Valida la configuración: stdin trae un fichero <code>.env</code>. Imprime la configuración final o, si hay errores, cada error en una línea",
  lenguaje:"js",
  c:`<p>Usa <code>util.parseEnv</code> para leerlo. Reglas: <code>PORT</code> opcional (por defecto 3000), entero de 1 a 65535 (<code>PORT no válido</code>); <code>DATABASE_URL</code> obligatoria (<code>falta DATABASE_URL</code>); <code>LOG_LEVEL</code> opcional (por defecto <code>info</code>), uno de <code>error warn info debug</code> (<code>LOG_LEVEL no válido</code>). Si todo va bien, imprime <code>puerto=… nivel=… db=ok</code>.</p>`,
  plantilla:"const { parseEnv } = require(\"node:util\");\nconst env = parseEnv(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst errores = [];\n// valida y construye la configuración\n",
  pruebas:[{entrada:"PORT=8080\nDATABASE_URL=postgres://db/app\n", salida:"puerto=8080 nivel=info db=ok"},{entrada:"PORT=99999\nLOG_LEVEL=verbose\n", salida:"PORT no válido\nfalta DATABASE_URL\nLOG_LEVEL no válido"},{entrada:"# comentario\nDATABASE_URL=postgres://x\nLOG_LEVEL=debug\n", salida:"puerto=3000 nivel=debug db=ok", oculta:true},{entrada:"PORT=abc\nDATABASE_URL=postgres://x\n", salida:"PORT no válido", oculta:true}],
  pista:"const puerto = env.PORT === undefined ? 3000 : Number(env.PORT); vale si Number.isInteger(puerto) && puerto >= 1 && puerto <= 65535.",
  solucion:"const { parseEnv } = require(\"node:util\");\nconst env = parseEnv(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst errores = [];\nconst puerto = env.PORT === undefined ? 3000 : Number(env.PORT);\nif (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) errores.push(\"PORT no válido\");\nif (!env.DATABASE_URL) errores.push(\"falta DATABASE_URL\");\nconst nivel = env.LOG_LEVEL ?? \"info\";\nif (![\"error\", \"warn\", \"info\", \"debug\"].includes(nivel)) errores.push(\"LOG_LEVEL no válido\");\nif (errores.length) console.log(errores.join(\"\\n\"));\nelse console.log(\"puerto=\" + puerto + \" nivel=\" + nivel + \" db=ok\");",
  why:"Mostrar todos los errores a la vez ahorra ciclos de «arreglo uno, despliego, falla el siguiente». En la app real, tras imprimirlos se sale con código 1."}
]},

/* =============== U10 L2 =============== */
{
id:"nd10n2",
titulo:"Logs estructurados con pino",
claves:["Logs en JSON, una línea por evento, a stdout: los recoge la plataforma","Niveles, loggers hijos con contexto y redacción de datos sensibles","AsyncLocalStorage propaga el id de la petición sin pasarlo a mano"],
pasos:[
 {t:"info", eti:"Buscar y filtrar", h:"pino",
  c:`<div class="termbox">import pino from "pino";
export const log = pino({
  level: config.LOG_LEVEL,
  redact: ["req.headers.authorization", "*.password", "*.token"],   // nunca a los logs
});

log.info({ pedido: 42, total: 89.9 }, "pedido creado");
// {"level":30,"time":1790000000000,"pid":7,"hostname":"api-5d9f","pedido":42,"total":89.9,"msg":"pedido creado"}

const logPagos = log.child({ modulo: "pagos" });    // todo lo que registre lleva modulo
logPagos.error({ err }, "cobro rechazado");          // err se serializa con su pila

// en Express: un log por petición con método, ruta, estado y duración
import pinoHttp from "pino-http";
app.use(pinoHttp({ logger: log }));</div>
     <p>En desarrollo, <code>node server.js | npx pino-pretty</code> lo muestra legible. En producción, JSON tal cual: Loki, CloudWatch o Elasticsearch lo indexan por campos.</p>`},
 {t:"info", eti:"Contexto", h:"AsyncLocalStorage",
  c:`<p>Quieres que cada línea de log de una petición lleve su <code>reqId</code>, también las que se escriben tres capas más abajo en el repositorio. Pasarlo como parámetro a todas partes es inviable. <code>AsyncLocalStorage</code> guarda un contexto que sobrevive a los <code>await</code>:</p>
     <div class="termbox">import { AsyncLocalStorage } from "node:async_hooks";
export const contexto = new AsyncLocalStorage();

app.use((req, res, next) =&gt; {
  const reqId = req.headers["x-request-id"] ?? crypto.randomUUID();
  contexto.run({ reqId, log: log.child({ reqId }) }, next);
});

// en cualquier sitio, en la misma cadena asíncrona:
export const logActual = () =&gt; contexto.getStore()?.log ?? log;</div>
     <div class="nota"><b class="tit">Correlación entre servicios</b>Reenvía el mismo id en la cabecera <code>x-request-id</code> (o <code>traceparent</code> con OpenTelemetry) al llamar a otros servicios: así sigues una petición de punta a punta.</div>`},
 {t:"par", p:"Empareja cada nivel de log con su uso",
  pares:[["fatal","El proceso va a terminar"],["error","Algo falló y requiere atención"],["warn","Situación anómala que se ha podido gestionar"],["info","Eventos de negocio y del ciclo de vida"],["debug","Detalle para diagnosticar; desactivado en producción"]],
  why:"En producción, info. Si todo es error, nada lo es: las alertas se ignoran."},
 {t:"opcion", p:"¿Por qué pino es más rápido que registrar con <code>console.log(JSON.stringify(...))</code> repartido por el código o con loggers más pesados?",
  ops:["Porque comprime","Serializa de forma muy optimizada, escribe de forma asíncrona y deja el formateo bonito y el envío a otros procesos (transports) fuera del hilo principal","Porque escribe en un fichero","Porque no escribe nada"],
  ok:1, why:"En una API con mucho tráfico, el logging puede comerse una parte notable de la CPU. pino está diseñado para minimizarlo."},
 {t:"vf", p:"Escribir los logs en ficheros dentro del contenedor es la práctica recomendada en Kubernetes.",
  ok:false, why:"Se escriben a stdout/stderr y la plataforma los recoge. Los ficheros dentro del contenedor se pierden al reiniciar y pueden llenar el disco."},
 {t:"opcion", p:"Una auditoría encuentra tokens de sesión y contraseñas en los logs. ¿Qué medidas tomas?",
  ops:["Borrar los logs","Configurar redact en el logger para esos campos, no registrar cuerpos de petición completos, rotar las credenciales expuestas y restringir el acceso a los logs","Bajar el nivel a warn","Cifrar el disco"],
  ok:1, why:"Los logs los lee mucha más gente que la base de datos. Lo sensible no debe llegar ahí nunca."},
 {t:"codigo", p:"Escribe un logger JSON mínimo con <code>child</code> y redacción: <code>crearLogger(contexto)</code> devuelve <code>{ info(obj, msg), child(extra) }</code>; cada línea es el JSON de <code>{ nivel, ...contexto, ...obj, msg }</code> y los campos <code>password</code> y <code>token</code> salen como <code>[REDACTED]</code>",
  lenguaje:"js",
  plantilla:"function crearLogger(contexto = {}) {\n  // ...\n}\n\nconst log = crearLogger({ app: \"api\" });\nlog.info({ usuario: \"ana\", password: \"1234\" }, \"login\");\nconst logPagos = log.child({ modulo: \"pagos\" });\nlogPagos.info({ pedido: 42, token: \"abc\" }, \"cobro\");\n",
  pruebas:[{salida:"{\"nivel\":\"info\",\"app\":\"api\",\"usuario\":\"ana\",\"password\":\"[REDACTED]\",\"msg\":\"login\"}\n{\"nivel\":\"info\",\"app\":\"api\",\"modulo\":\"pagos\",\"pedido\":42,\"token\":\"[REDACTED]\",\"msg\":\"cobro\"}"}],
  pista:"info: const linea = { nivel: \"info\", ...contexto, ...obj, msg }; recorre [\"password\", \"token\"] y si están, sustitúyelos. child: extra => crearLogger({ ...contexto, ...extra }).",
  solucion:"function crearLogger(contexto = {}) {\n  return {\n    info(obj, msg) {\n      const linea = { nivel: \"info\", ...contexto, ...obj, msg };\n      for (const k of [\"password\", \"token\"]) if (k in linea) linea[k] = \"[REDACTED]\";\n      console.log(JSON.stringify(linea));\n    },\n    child(extra) {\n      return crearLogger({ ...contexto, ...extra });\n    },\n  };\n}\n\nconst log = crearLogger({ app: \"api\" });\nlog.info({ usuario: \"ana\", password: \"1234\" }, \"login\");\nconst logPagos = log.child({ modulo: \"pagos\" });\nlogPagos.info({ pedido: 42, token: \"abc\" }, \"cobro\");",
  why:"Así funcionan pino.child y redact: el contexto se hereda y los campos sensibles se tapan antes de escribir. Una línea JSON por evento es lo que cualquier plataforma de logs sabe indexar."},
 {t:"codigo", p:"Propaga el id de petición con <code>AsyncLocalStorage</code>: dos peticiones simuladas se ejecutan a la vez y cada log debe llevar su propio id sin pasarlo como parámetro",
  lenguaje:"js",
  c:`<p>Implementa <code>logCtx(msg)</code> para que imprima <code>[ID] msg</code> leyendo el id del almacén, y ejecuta cada petición con <code>als.run</code>. Salida:</p><div class="termbox">[a] inicio
[b] inicio
[b] consulta hecha
[a] consulta hecha</div>`,
  plantilla:"const { AsyncLocalStorage } = require(\"node:async_hooks\");\nconst als = new AsyncLocalStorage();\nconst dormir = ms => new Promise(r => setTimeout(r, ms));\n\nfunction logCtx(msg) {\n  // lee el id del almacén\n}\n\nasync function repositorio() {\n  await dormir(1);\n  return \"filas\";\n}\n\nasync function manejador(ms) {\n  logCtx(\"inicio\");\n  await dormir(ms);\n  await repositorio();\n  logCtx(\"consulta hecha\");\n}\n\n// ejecuta manejador(40) con id \"a\" y manejador(10) con id \"b\", a la vez\n",
  pruebas:[{salida:"[a] inicio\n[b] inicio\n[b] consulta hecha\n[a] consulta hecha"}],
  pista:"logCtx: console.log(\"[\" + als.getStore().id + \"] \" + msg). Luego als.run({ id: \"a\" }, () => manejador(40)); als.run({ id: \"b\" }, () => manejador(10));",
  solucion:"const { AsyncLocalStorage } = require(\"node:async_hooks\");\nconst als = new AsyncLocalStorage();\nconst dormir = ms => new Promise(r => setTimeout(r, ms));\n\nfunction logCtx(msg) {\n  console.log(\"[\" + als.getStore().id + \"] \" + msg);\n}\n\nasync function repositorio() {\n  await dormir(1);\n  return \"filas\";\n}\n\nasync function manejador(ms) {\n  logCtx(\"inicio\");\n  await dormir(ms);\n  await repositorio();\n  logCtx(\"consulta hecha\");\n}\n\nals.run({ id: \"a\" }, () => manejador(40));\nals.run({ id: \"b\" }, () => manejador(10));",
  why:"Aunque las dos peticiones se intercalan en el mismo hilo, cada cadena de await conserva su almacén. Una variable global «peticionActual» mezclaría los ids: ese es el error que evita."}
]},

/* =============== U10 L3 =============== */
{
id:"nd7l1",
titulo:"Apagado ordenado con SIGTERM",
claves:["Al recibir SIGTERM: dejar de aceptar peticiones, terminar las activas y cerrar conexiones","Un plazo máximo (y .unref()) por si algo se cuelga; Kubernetes manda SIGKILL al acabar su gracia","El proceso debe ser PID 1 o tener un init que reenvíe señales: node, no npm start"],
pasos:[
 {t:"info", eti:"Operable", h:"Listo para un orquestador",
  c:`<div class="termbox">const servidor = app.listen(config.PORT, () =&gt; log.info({ puerto: config.PORT }, "arrancado"));
let cerrando = false;

app.get("/salud/lista", (req, res) =&gt; res.sendStatus(cerrando ? 503 : 200));   // readiness

async function apagar(senal) {
  if (cerrando) return;
  cerrando = true;
  log.info({ senal }, "apagando");
  setTimeout(() =&gt; { log.error("cierre forzado"); process.exit(1); }, 25_000).unref();   // plan B
  servidor.close(async () =&gt; {           // no acepta nuevas; espera a las activas
    await pool.end();                     // base de datos
    await redis.quit();                   // colas, caché…
    log.info("apagado limpio");
    process.exit(0);
  });
  servidor.closeIdleConnections();        // soltar las keep-alive que no están haciendo nada
}
process.on("SIGTERM", apagar);
process.on("SIGINT", apagar);</div>`},
 {t:"info", eti:"En Kubernetes", h:"La secuencia completa",
  c:`<div class="dg"><div class="dg-tit">qué pasa al borrar un pod</div>
       <div class="dg-vert"><div class="dg-caja base">Kubernetes marca el pod para borrar<small>y empieza a quitarlo de los Endpoints del Service (tarda unos segundos en propagarse)</small></div><div class="dg-caja">preStop (por ejemplo, sleep 5)<small>da tiempo a que deje de llegar tráfico nuevo</small></div><div class="dg-caja acento">SIGTERM al proceso<small>servidor.close(), terminar peticiones, cerrar pool</small></div><div class="dg-caja ok">process.exit(0)</div><div class="dg-caja aviso">si no ha terminado al acabar terminationGracePeriodSeconds (30 s): SIGKILL</div></div></div>
     <div class="nota ojo"><b class="tit">PID 1 y las señales</b>Con <code>CMD npm start</code>, npm es el PID 1 y no reenvía bien SIGTERM a Node: el apagado ordenado nunca ocurre y al final llega el SIGKILL. Usa <code>CMD ["node", "server.js"]</code> (forma exec, sin shell) o un init mínimo como <code>tini</code> (<code>docker run --init</code>).</div>`},
 {t:"par", p:"Empareja cada práctica con el problema que evita",
  pares:[["Validar el entorno al arrancar","Fallar en la primera petición por una variable ausente"],["Logs JSON","No poder buscar ni filtrar logs en producción"],["Manejar SIGTERM","Cortar peticiones en curso durante un despliegue"],["No usar el usuario root en la imagen","Que un fallo dé control total del contenedor"],["Temporizador de cierre forzado","Que una conexión colgada impida apagar para siempre"]],
  why:"Esta misma plataforma hace el apagado elegante al recibir SIGTERM."},
 {t:"opcion", p:"¿Por qué el comando del contenedor debe ser <code>node server.js</code> y no <code>npm start</code>?",
  ops:["Por velocidad de arranque solamente","npm no reenvía bien las señales (SIGTERM) al proceso de Node, así que el apagado elegante no ocurre","npm no existe en la imagen","Da igual"],
  ok:1, why:"Con npm como PID 1, Docker acaba matando el proceso a los 10 s con SIGKILL."},
 {t:"orden", p:"Ordena lo que debe hacer tu app al recibir SIGTERM",
  items:["Marcarse como no lista (readiness 503)","Dejar de aceptar conexiones nuevas (server.close)","Terminar las peticiones en curso","Cerrar el pool de la base de datos y otras conexiones","Salir con código 0"],
  why:"Cerrar el pool antes de que acaben las peticiones haría fallar justo las que estás intentando terminar bien."},
 {t:"vf", p:"<code>server.close()</code> corta inmediatamente las peticiones que están en curso.",
  ok:false, why:"Deja de aceptar conexiones nuevas y espera a que terminen las activas. Por eso hace falta un plazo máximo por si alguna no termina nunca."},
 {t:"codigo", p:"Implementa <code>apagar()</code>: debe dejar terminar la petición lenta que está en curso, cerrar el servidor y devolver una promesa que se resuelve al cerrar",
  lenguaje:"js",
  c:`<p>La plantilla lanza una petición que tarda 150 ms, llama a <code>apagar()</code> a los 30 ms y después intenta una petición nueva. Salida: <code>apagando</code>, <code>respuesta: informe listo</code>, <code>cerrado</code>, <code>nueva petición rechazada</code>.</p>`,
  plantilla:"const http = require(\"node:http\");\nconst dormir = ms => new Promise(r => setTimeout(r, ms));\n\nconst servidor = http.createServer(async (req, res) => {\n  await dormir(150);\n  res.end(\"informe listo\");\n});\n\nfunction apagar() {\n  // imprime \"apagando\", cierra el servidor y resuelve cuando termine\n}\n\nservidor.listen(0, async () => {\n  const url = \"http://127.0.0.1:\" + servidor.address().port;\n  const lenta = fetch(url);\n  await dormir(30);\n  const cierre = apagar();\n  const r = await lenta;\n  console.log(\"respuesta: \" + await r.text());\n  await cierre;\n  console.log(\"cerrado\");\n  try { await fetch(url); console.log(\"aceptada\"); } catch { console.log(\"nueva petición rechazada\"); }\n});\n",
  pruebas:[{salida:"apagando\nrespuesta: informe listo\ncerrado\nnueva petición rechazada"}],
  pista:"return new Promise(ok => servidor.close(() => ok())); después de console.log(\"apagando\").",
  solucion:"const http = require(\"node:http\");\nconst dormir = ms => new Promise(r => setTimeout(r, ms));\n\nconst servidor = http.createServer(async (req, res) => {\n  await dormir(150);\n  res.end(\"informe listo\");\n});\n\nfunction apagar() {\n  console.log(\"apagando\");\n  return new Promise(ok => servidor.close(() => ok()));\n}\n\nservidor.listen(0, async () => {\n  const url = \"http://127.0.0.1:\" + servidor.address().port;\n  const lenta = fetch(url);\n  await dormir(30);\n  const cierre = apagar();\n  const r = await lenta;\n  console.log(\"respuesta: \" + await r.text());\n  await cierre;\n  console.log(\"cerrado\");\n  try { await fetch(url); console.log(\"aceptada\"); } catch { console.log(\"nueva petición rechazada\"); }\n});",
  why:"La petición en curso termina bien aunque el cierre empezó antes. En la app real, apagar() se engancha a process.on(\"SIGTERM\") y, tras cerrar, libera el pool y sale con código 0."}
]}

]});
