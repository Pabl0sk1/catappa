window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Fastify, NestJS y errores robustos",
resumen: "Fastify con esquemas, plugins y hooks; NestJS con módulos e inyección de dependencias; y una estrategia de errores: clases propias, causas, reintentos y fallos del proceso",
nivel: "Avanzado",
color: "#65a541",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"nd6n1",
titulo:"Fastify: esquemas, plugins y hooks",
claves:["Fastify valida la entrada y serializa la salida con JSON Schema: más rápido y más seguro","Todo es un plugin con su propio contexto encapsulado; decorate añade utilidades","Hooks (onRequest, preHandler, onSend…) en lugar de middleware; logger pino integrado"],
pasos:[
 {t:"info", eti:"Alto rendimiento", h:"Una ruta de Fastify",
  c:`<div class="termbox">import Fastify from "fastify";
const app = Fastify({ logger: true });            // pino integrado, un log por petición

app.post("/api/tareas", {
  schema: {
    body: {
      type: "object", required: ["titulo"], additionalProperties: false,
      properties: { titulo: { type: "string", minLength: 1, maxLength: 200 } },
    },
    response: {
      201: { type: "object", properties: { id: { type: "integer" }, titulo: { type: "string" } } },
    },
  },
}, async (req, reply) =&gt; {
  const t = await repo.crear(req.body);            // req.body ya está validado
  return reply.code(201).send(t);                  // solo se serializan id y titulo
});

await app.listen({ port: 3000, host: "0.0.0.0" });</div>
     <p>El esquema de <b>entrada</b> rechaza con 400 lo que no cumple. El de <b>respuesta</b> genera un serializador muy rápido y además <b>filtra</b>: si el objeto trae <code>hashClave</code>, no sale.</p>`},
 {t:"info", eti:"Organización", h:"Plugins, decoradores y hooks",
  c:`<div class="termbox">// plugins/db.js
import fp from "fastify-plugin";
export default fp(async (app) =&gt; {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  app.decorate("db", pool);                         // app.db disponible en toda la app
  app.addHook("onClose", () =&gt; pool.end());         // se cierra con app.close()
});

// rutas/tareas.js: un plugin con su propio contexto
export default async function (app) {
  app.addHook("preHandler", app.autenticar);        // solo afecta a estas rutas
  app.get("/", async () =&gt; (await app.db.query("SELECT * FROM tareas")).rows);
}

app.register(db);
app.register(tareas, { prefix: "/api/tareas" });</div>
     <p>Cada <code>register</code> crea un contexto <b>encapsulado</b>: lo que decoras o enganchas dentro no se ve fuera, salvo que lo envuelvas en <code>fastify-plugin</code>. Así un plugin de un equipo no rompe las rutas de otro.</p>`},
 {t:"par", p:"Empareja cada pieza de Fastify con su función",
  pares:[["schema.body","Validar la entrada (400 si no cumple)"],["schema.response","Serializar rápido y filtrar campos de la salida"],["register","Cargar un plugin en un contexto propio"],["decorate","Añadir una utilidad compartida (app.db)"],["addHook(\"preHandler\")","Ejecutar algo antes del manejador, como la autenticación"]],
  why:"Validación, serialización y logs vienen de serie: en Express son paquetes aparte."},
 {t:"opcion", p:"¿Por qué un esquema de respuesta en Fastify ayuda también a la seguridad?",
  ops:["Cifra la respuesta","Solo serializa las propiedades declaradas: un campo sensible que se cuele en el objeto (hash de la contraseña) no llega al cliente","Añade HTTPS","Impide el CORS"],
  ok:1, why:"Filtrar a la salida es una defensa en profundidad contra la exposición excesiva de datos (OWASP API3)."},
 {t:"vf", p:"En Fastify, un hook registrado dentro de un plugin normal afecta también a las rutas registradas fuera de ese plugin.",
  ok:false, why:"El contexto está encapsulado: el hook solo afecta al plugin y a sus hijos. Para compartirlo hacia fuera se usa fastify-plugin."},
 {t:"opcion", p:"¿Cómo se prueba una ruta de Fastify sin abrir un puerto?",
  ops:["No se puede","Con app.inject({ method, url, payload }), que simula la petición en memoria","Con supertest obligatoriamente","Arrancando Docker"],
  ok:1, why:"inject usa light-my-request: rápido y sin red. Es el equivalente a Supertest para Express."},
 {t:"codigo", p:"Imita el serializador de respuesta de Fastify: dada una lista de propiedades permitidas, devuelve solo esas (en el orden del esquema) y descarta el resto",
  lenguaje:"js",
  c:`<p>La primera línea de stdin es la lista de propiedades separadas por comas; cada línea siguiente, un objeto JSON. Imprime cada objeto filtrado con <code>JSON.stringify</code>. Las propiedades que no vengan se omiten.</p>`,
  plantilla:"const [cabecera, ...objetos] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst permitidas = cabecera.split(\",\");\n// filtra cada objeto\n",
  pruebas:[{entrada:"id,nombre\n{\"id\":1,\"nombre\":\"ana\",\"hashClave\":\"$argon2id$...\"}\n", salida:"{\"id\":1,\"nombre\":\"ana\"}"},{entrada:"id,email,rol\n{\"rol\":\"admin\",\"id\":7,\"token\":\"x\"}\n{\"id\":8}\n", salida:"{\"id\":7,\"rol\":\"admin\"}\n{\"id\":8}", oculta:true}],
  pista:"Recorre permitidas y copia solo las que existen en el objeto: if (k in o) salida[k] = o[k].",
  solucion:"const [cabecera, ...objetos] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst permitidas = cabecera.split(\",\");\nfor (const linea of objetos) {\n  const o = JSON.parse(linea);\n  const salida = {};\n  for (const k of permitidas) if (k in o) salida[k] = o[k];\n  console.log(JSON.stringify(salida));\n}",
  why:"Una lista blanca a la salida: aunque alguien añada un campo sensible al modelo, no se filtra. Es lo que hacen los DTO de respuesta en NestJS o los esquemas de respuesta en Fastify."}
]},

/* =============== U6 L2 =============== */
{
id:"nd7l3",
titulo:"NestJS: arquitectura al estilo Spring",
claves:["NestJS organiza la app en módulos, controladores y proveedores con inyección de dependencias","Pipes validan y transforman; guards autorizan; interceptors envuelven; filtros traducen excepciones","Muy familiar si vienes de Spring Boot; por debajo usa Express o Fastify"],
pasos:[
 {t:"info", eti:"Estructura", h:"Un controlador de NestJS",
  c:`<div class="termbox">@Controller("tareas")
export class TareasController {
  constructor(private readonly servicio: TareasService) {}     // inyección por constructor

  @Get(":id")
  obtener(@Param("id", ParseIntPipe) id: number) {
    return this.servicio.obtener(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearTareaDto) {                          // validado con class-validator
    return this.servicio.crear(dto);
  }
}

@Injectable()
export class TareasService {
  constructor(private readonly repo: TareasRepository) {}
  async obtener(id: number) {
    const t = await this.repo.buscar(id);
    if (!t) throw new NotFoundException();                   // se convierte en 404
    return t;
  }
}

@Module({ controllers: [TareasController], providers: [TareasService, TareasRepository] })
export class TareasModule {}</div>`},
 {t:"info", eti:"El ciclo de una petición", h:"Por dónde pasa en NestJS",
  c:`<div class="dg"><div class="dg-tit">orden de ejecución en NestJS</div>
       <div class="dg-vert"><div class="dg-caja base">middleware</div><div class="dg-caja">guards<small>¿puede pasar? (autorización)</small></div><div class="dg-caja">interceptors (antes)<small>logs, caché, tiempos</small></div><div class="dg-caja">pipes<small>validar y transformar parámetros</small></div><div class="dg-caja acento">método del controlador</div><div class="dg-caja">interceptors (después)<small>transformar la respuesta</small></div><div class="dg-caja aviso">exception filters<small>si algo lanza</small></div></div></div>
     <p>Por debajo usa Express (por defecto) o Fastify. Añade sobre ellos la estructura: la misma forma de organizar el código en todos los proyectos, algo muy valioso con equipos grandes.</p>`},
 {t:"par", p:"Empareja cada concepto de NestJS con su equivalente en Spring",
  pares:[["@Controller","@RestController"],["@Injectable (provider)","@Service"],["@Module","Configuración y agrupación de beans"],["Guard","Reglas de Spring Security"],["Pipe de validación","@Valid con Bean Validation"],["Exception filter","@ControllerAdvice"]],
  why:"Si dominas Spring, NestJS se aprende en días."},
 {t:"opcion", p:"¿Cuándo elegirías NestJS en vez de Express a secas?",
  ops:["Nunca","En proyectos grandes con varios equipos, donde una estructura común, inyección de dependencias y convenciones ahorran discusiones","Solo para scripts","Para páginas estáticas"],
  ok:1, why:"Para una API pequeña, Express o Fastify son más directos."},
 {t:"orden", p:"Ordena lo que ejecuta NestJS al recibir una petición",
  items:["Middleware","Guards","Interceptors (antes)","Pipes","Método del controlador"],
  why:"Primero decide si puede pasar (guard); después valida los datos (pipe). Un usuario sin permiso no llega ni a validar."},
 {t:"vf", p:"Un servicio marcado con <code>@Injectable()</code> se crea por defecto una sola vez para toda la aplicación.",
  ok:true, why:"El ámbito por defecto es singleton, como en Spring. Existen ámbitos REQUEST y TRANSIENT, pero el de petición tiene coste de rendimiento."},
 {t:"codigo", p:"Construye un contenedor de inyección de dependencias mínimo: <code>registrar(nombre, deps, fabrica)</code> y <code>resolver(nombre)</code>, con instancias únicas (singleton)",
  lenguaje:"js",
  c:`<p>Al resolver, primero se resuelven sus dependencias y se pasan a la fábrica. Cada fábrica se ejecuta como mucho una vez. La plantilla ya registra config, repo y servicio. Salida: <code>creo config</code>, <code>creo repo</code>, <code>creo servicio</code>, <code>tareas de postgres://db</code>, <code>true</code>.</p>`,
  plantilla:"const registro = new Map();\nconst instancias = new Map();\nfunction registrar(nombre, deps, fabrica) { registro.set(nombre, { deps, fabrica }); }\nfunction resolver(nombre) {\n  // devuelve la instancia (creándola la primera vez)\n}\n\nregistrar(\"config\", [], () => { console.log(\"creo config\"); return { url: \"postgres://db\" }; });\nregistrar(\"repo\", [\"config\"], cfg => { console.log(\"creo repo\"); return { origen: cfg.url }; });\nregistrar(\"servicio\", [\"repo\"], repo => { console.log(\"creo servicio\"); return { listar: () => \"tareas de \" + repo.origen }; });\n\nconsole.log(resolver(\"servicio\").listar());\nconsole.log(resolver(\"servicio\") === resolver(\"servicio\"));\n",
  pruebas:[{salida:"creo config\ncreo repo\ncreo servicio\ntareas de postgres://db\ntrue"}],
  pista:"if (instancias.has(nombre)) return instancias.get(nombre); const { deps, fabrica } = registro.get(nombre); const inst = fabrica(...deps.map(resolver)); instancias.set(nombre, inst); return inst;",
  solucion:"const registro = new Map();\nconst instancias = new Map();\nfunction registrar(nombre, deps, fabrica) { registro.set(nombre, { deps, fabrica }); }\nfunction resolver(nombre) {\n  if (instancias.has(nombre)) return instancias.get(nombre);\n  const { deps, fabrica } = registro.get(nombre);\n  const inst = fabrica(...deps.map(resolver));\n  instancias.set(nombre, inst);\n  return inst;\n}\n\nregistrar(\"config\", [], () => { console.log(\"creo config\"); return { url: \"postgres://db\" }; });\nregistrar(\"repo\", [\"config\"], cfg => { console.log(\"creo repo\"); return { origen: cfg.url }; });\nregistrar(\"servicio\", [\"repo\"], repo => { console.log(\"creo servicio\"); return { listar: () => \"tareas de \" + repo.origen }; });\n\nconsole.log(resolver(\"servicio\").listar());\nconsole.log(resolver(\"servicio\") === resolver(\"servicio\"));",
  why:"Es lo que hacen el contenedor de NestJS y el de Spring: un grafo de dependencias que se resuelve en profundidad. NestJS lee las dependencias de los tipos del constructor gracias a los metadatos de TypeScript."}
]},

/* =============== U6 L3 =============== */
{
id:"nd6n2",
titulo:"Errores robustos: clases, causas y reintentos",
claves:["Errores operacionales (la red falla) se gestionan; errores de programación (undefined is not a function) se corrigen","Clases de error propias con status y cause para no perder el origen","unhandledRejection y uncaughtException: registrar y reiniciar, nunca seguir como si nada"],
pasos:[
 {t:"info", eti:"Dos familias", h:"Operacionales frente a bugs",
  c:`<div class="dg"><div class="dg-tit">qué hacer con cada tipo de error</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">operacionales</div><div class="dg-pila"><div class="dg-caja">la BD no responde</div><div class="dg-caja">entrada no válida</div><div class="dg-caja">el recurso no existe</div><div class="dg-caja ok">gestionar: reintentar, 4xx, degradar</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">de programación</div><div class="dg-pila"><div class="dg-caja">x is not a function</div><div class="dg-caja">leer propiedad de undefined</div><div class="dg-caja">invariante rota</div><div class="dg-caja aviso">registrar y reiniciar el proceso; corregir el código</div></div></div>
       </div></div>
     <div class="termbox">class ErrorApp extends Error {
  constructor(mensaje, { status = 500, cause } = {}) {
    super(mensaje, { cause });          // cause: el error original, sin perderlo
    this.name = this.constructor.name;
    this.status = status;
  }
}
class NoEncontrado extends ErrorApp { constructor(m) { super(m, { status: 404 }); } }

try { await pagos.cobrar(p); }
catch (e) { throw new ErrorApp("No se pudo cobrar el pedido " + p.id, { status: 502, cause: e }); }</div>`},
 {t:"info", eti:"Último recurso", h:"Errores que escapan",
  c:`<div class="termbox">process.on("unhandledRejection", (motivo) =&gt; {
  log.fatal({ err: motivo }, "promesa rechazada sin gestionar");
  throw motivo;                 // lo convierte en uncaughtException
});
process.on("uncaughtException", (err) =&gt; {
  log.fatal({ err }, "excepción no capturada");
  process.exit(1);              // estado desconocido: que el orquestador lo reinicie
});</div>
     <p>Desde Node 15, una promesa rechazada sin <code>catch</code> <b>termina el proceso</b> por defecto. Es lo correcto: un proceso que ha fallado a medias puede tener conexiones abiertas o datos a medio escribir. Regístralo, sal, y deja que Docker o Kubernetes lo levanten limpio.</p>
     <div class="nota ojo"><b class="tit">Reintentos con cabeza</b>Reintenta solo errores <b>transitorios</b> (tiempo agotado, 503, conexión rechazada), con espera exponencial y algo de aleatoriedad (jitter), un máximo de intentos y solo operaciones <b>idempotentes</b>. Reintentar un 400 o un cobro no idempotente empeora las cosas.</div>`},
 {t:"par", p:"Empareja cada error con su tratamiento",
  pares:[["ECONNREFUSED al llamar a otro servicio","Reintentar con espera exponencial"],["Validación fallida del cuerpo","Responder 400, sin reintentos"],["TypeError: cannot read properties of undefined","Bug: registrar, reiniciar y corregir"],["Promesa rechazada sin catch","Por defecto Node termina el proceso"]],
  why:"Tratar un bug como error operacional (capturar y seguir) esconde el problema y deja el proceso en un estado raro."},
 {t:"opcion", p:"¿Para qué sirve la opción <code>cause</code> al crear un error?",
  ops:["Para cambiar el mensaje","Para envolver el error original: el nuevo aporta contexto y el original conserva la pila y el detalle técnico","Para ocultar el error","Para convertirlo en 500"],
  ok:1, why:"Los loggers como pino muestran la cadena de causas. Sin cause, al envolver un error pierdes el porqué."},
 {t:"vf", p:"Capturar <code>uncaughtException</code> y seguir atendiendo peticiones es una buena forma de dar más disponibilidad.",
  ok:false, why:"Tras una excepción no capturada, el estado del proceso es desconocido (transacciones a medias, recursos sin liberar). Registra y sal: la disponibilidad la dan las réplicas y el reinicio."},
 {t:"opcion", p:"Un servicio reintenta cada petición fallida al instante y sin límite. Cuando la base de datos se ralentiza un momento, todo se hunde. ¿Qué ha pasado?",
  ops:["Mala suerte","Tormenta de reintentos: multiplica la carga justo cuando el sistema está débil. Hace falta espera exponencial con jitter, un máximo y quizá un circuit breaker","Falta un índice","Pocos reintentos"],
  ok:1, why:"Los reintentos agresivos convierten una degradación en una caída total."},
 {t:"codigo", p:"Crea la jerarquía de errores y tradúcela a respuestas HTTP: <code>NoEncontrado</code> (404), <code>Conflicto</code> (409) y cualquier otro error (500, mensaje «Error interno»)",
  lenguaje:"js",
  c:`<p><code>aRespuesta(err)</code> devuelve el texto <code>STATUS mensaje</code>. La plantilla la prueba con tres errores. Salida: <code>404 tarea 9 no existe</code>, <code>409 email repetido</code>, <code>500 Error interno</code>.</p>`,
  plantilla:"class ErrorApp extends Error {\n  constructor(mensaje, status) { super(mensaje); this.status = status; }\n}\n// define NoEncontrado y Conflicto\n\nfunction aRespuesta(err) {\n  // ...\n}\n\nconsole.log(aRespuesta(new NoEncontrado(\"tarea 9 no existe\")));\nconsole.log(aRespuesta(new Conflicto(\"email repetido\")));\nconsole.log(aRespuesta(new TypeError(\"x is not a function\")));\n",
  pruebas:[{salida:"404 tarea 9 no existe\n409 email repetido\n500 Error interno"}],
  pista:"class NoEncontrado extends ErrorApp { constructor(m) { super(m, 404); } }. En aRespuesta: err instanceof ErrorApp ? `${err.status} ${err.message}` : \"500 Error interno\".",
  solucion:"class ErrorApp extends Error {\n  constructor(mensaje, status) { super(mensaje); this.status = status; }\n}\nclass NoEncontrado extends ErrorApp { constructor(m) { super(m, 404); } }\nclass Conflicto extends ErrorApp { constructor(m) { super(m, 409); } }\n\nfunction aRespuesta(err) {\n  if (err instanceof ErrorApp) return err.status + \" \" + err.message;\n  return \"500 Error interno\";\n}\n\nconsole.log(aRespuesta(new NoEncontrado(\"tarea 9 no existe\")));\nconsole.log(aRespuesta(new Conflicto(\"email repetido\")));\nconsole.log(aRespuesta(new TypeError(\"x is not a function\")));",
  why:"El mensaje de un error desconocido no se muestra: puede contener SQL, rutas internas o datos. Se registra completo en el log y al cliente le llega un mensaje genérico."},
 {t:"codigo", p:"Implementa <code>conReintentos(fn, intentos, baseMs)</code>: reintenta solo los errores con <code>transitorio: true</code>, esperando <code>baseMs · 2^n</code> entre intentos",
  lenguaje:"js",
  c:`<p>La plantilla simula un servicio que falla dos veces de forma transitoria y luego responde, y otro que da un error definitivo. Imprime cada espera (<code>espero 10</code>, <code>espero 20</code>) y el resultado. Salida: <code>espero 10</code>, <code>espero 20</code>, <code>resultado ok</code>, <code>definitivo: 400 datos mal</code>.</p>`,
  plantilla:"const dormir = ms => new Promise(r => setTimeout(r, ms));\n\nasync function conReintentos(fn, intentos, baseMs) {\n  // ...\n}\n\nlet llamadas = 0;\nconst inestable = async () => { llamadas++; if (llamadas <= 2) throw Object.assign(new Error(\"timeout\"), { transitorio: true }); return \"ok\"; };\nconst roto = async () => { throw new Error(\"400 datos mal\"); };\n\n(async () => {\n  console.log(\"resultado \" + await conReintentos(inestable, 5, 10));\n  try { await conReintentos(roto, 5, 10); } catch (e) { console.log(\"definitivo: \" + e.message); }\n})();\n",
  pruebas:[{salida:"espero 10\nespero 20\nresultado ok\ndefinitivo: 400 datos mal"}],
  pista:"for (let n = 0; ; n++) { try { return await fn(); } catch (e) { if (!e.transitorio || n + 1 >= intentos) throw e; const ms = baseMs * 2 ** n; console.log(\"espero \" + ms); await dormir(ms); } }",
  solucion:"const dormir = ms => new Promise(r => setTimeout(r, ms));\n\nasync function conReintentos(fn, intentos, baseMs) {\n  for (let n = 0; ; n++) {\n    try {\n      return await fn();\n    } catch (e) {\n      if (!e.transitorio || n + 1 >= intentos) throw e;\n      const ms = baseMs * 2 ** n;\n      console.log(\"espero \" + ms);\n      await dormir(ms);\n    }\n  }\n}\n\nlet llamadas = 0;\nconst inestable = async () => { llamadas++; if (llamadas <= 2) throw Object.assign(new Error(\"timeout\"), { transitorio: true }); return \"ok\"; };\nconst roto = async () => { throw new Error(\"400 datos mal\"); };\n\n(async () => {\n  console.log(\"resultado \" + await conReintentos(inestable, 5, 10));\n  try { await conReintentos(roto, 5, 10); } catch (e) { console.log(\"definitivo: \" + e.message); }\n})();",
  why:"En producción añade jitter (una parte aleatoria de la espera) para que mil clientes no reintenten en el mismo milisegundo, y un tope a la espera máxima."}
]}

]});
