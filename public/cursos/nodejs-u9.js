window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Pruebas",
resumen: "node:test y assert, Vitest, probar una API con Supertest, dobles de prueba y mocks, el tiempo simulado y pruebas de integración con bases de datos reales",
nivel: "Avanzado",
color: "#65a541",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"nd9n1",
titulo:"node:test y assert",
claves:["node --test ejecuta las pruebas sin instalar nada: describe, it, hooks y subpruebas","node:assert/strict: equal, deepEqual, throws y rejects","--watch, --test-name-pattern y cobertura con --experimental-test-coverage"],
pasos:[
 {t:"info", eti:"De serie", h:"El ejecutor de pruebas de Node",
  c:`<div class="termbox">// src/precio.test.js
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { totalConIva, parsearCupon } from "./precio.js";

describe("totalConIva", () =&gt; {
  it("aplica el 21 %", () =&gt; {
    assert.equal(totalConIva(100), 121);
  });
  it("rechaza precios negativos", () =&gt; {
    assert.throws(() =&gt; totalConIva(-1), { name: "RangeError" });
  });
});

it("parsea un cupón", async () =&gt; {
  assert.deepEqual(await parsearCupon("VERANO-10"), { codigo: "VERANO", pct: 10 });
  await assert.rejects(parsearCupon("roto"), /cupón no válido/);
});</div>
     <div class="termbox">node --test                                  # busca *.test.js, *_test.js, test/**…
node --test --watch                          # vuelve a ejecutar al guardar
node --test --experimental-test-coverage     # informe de cobertura
node --test --test-name-pattern="cupón"      # solo las que coinciden</div>`},
 {t:"info", eti:"Comparar bien", h:"Las aserciones que importan",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">assert/strict</div>
       <table class="dg-tabla"><tbody>
       <tr><td>equal(a, b)</td><td>igualdad estricta (===) de valores simples</td></tr>
       <tr><td>deepEqual(a, b)</td><td>compara objetos y arrays por contenido</td></tr>
       <tr><td>throws(fn, esperado)</td><td>la función síncrona lanza</td></tr>
       <tr><td>rejects(promesa, esperado)</td><td>la promesa se rechaza (con await)</td></tr>
       <tr><td>match(texto, /regex/)</td><td>el texto cumple el patrón</td></tr>
       </tbody></table></div>
     <div class="nota ojo"><b class="tit">El error más común</b><code>assert.rejects(...)</code> sin <code>await</code>: la prueba termina antes de comprobar nada y pasa siempre. Lo mismo con <code>expect(...).rejects</code> en Vitest.</div>`},
 {t:"par", p:"Empareja cada aserción con lo que comprueba",
  pares:[["assert.equal(x, 3)","Que x es exactamente 3"],["assert.deepEqual(obj, { a: 1 })","Que el objeto tiene ese contenido"],["assert.throws(fn)","Que la función lanza un error"],["await assert.rejects(p)","Que la promesa se rechaza"]],
  why:"Con objetos, equal compara referencias: dos objetos iguales pero distintos no son equal. Para eso está deepEqual."},
 {t:"term", p:"Ejecuta todas las pruebas del proyecto con el ejecutor integrado de Node",
  prompt:"pablo@portatil:~/api$", sol:["node --test","npm test","node --run test"],
  pista:"node con una opción de dos guiones.",
  salida:`✔ totalConIva &gt; aplica el 21 % (0.8ms)
✔ totalConIva &gt; rechaza precios negativos (0.4ms)
✔ parsea un cupón (1.2ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0`, why:"Sin Jest ni Vitest: para librerías y servicios pequeños, node:test es suficiente y no añade dependencias."},
 {t:"vf", p:"<code>assert.equal({ a: 1 }, { a: 1 })</code> pasa con <code>node:assert/strict</code>.",
  ok:false, why:"Son dos objetos distintos: === es false. Para comparar contenido, deepEqual."},
 {t:"codigo", p:"Arregla la función hasta que pasen las pruebas: <code>slug(texto)</code> debe pasar a minúsculas, quitar tildes, cambiar cualquier grupo de caracteres no alfanuméricos por un guion y quitar guiones al principio y al final",
  lenguaje:"js",
  c:`<p>Las pruebas ya están escritas con <code>assert</code>. Si una falla, el programa termina con error. Cuando todas pasen, se imprime <code>3 pruebas ok</code>.</p>`,
  plantilla:"const assert = require(\"node:assert/strict\");\n\nfunction slug(texto) {\n  return texto.toLowerCase();\n}\n\nassert.equal(slug(\"Hola Mundo\"), \"hola-mundo\");\nassert.equal(slug(\"  Node.js: ¡Streams y más!  \"), \"node-js-streams-y-mas\");\nassert.equal(slug(\"Año 2026\"), \"ano-2026\");\nconsole.log(\"3 pruebas ok\");\n",
  pruebas:[{salida:"3 pruebas ok"}],
  pista:"texto.normalize(\"NFD\").replace(/[\\u0300-\\u036f]/g, \"\") quita las tildes; luego .toLowerCase().replace(/[^a-z0-9]+/g, \"-\").replace(/^-|-$/g, \"\").",
  solucion:"const assert = require(\"node:assert/strict\");\n\nfunction slug(texto) {\n  return texto\n    .normalize(\"NFD\").replace(/[\\u0300-\\u036f]/g, \"\")\n    .toLowerCase()\n    .replace(/[^a-z0-9]+/g, \"-\")\n    .replace(/^-|-$/g, \"\");\n}\n\nassert.equal(slug(\"Hola Mundo\"), \"hola-mundo\");\nassert.equal(slug(\"  Node.js: ¡Streams y más!  \"), \"node-js-streams-y-mas\");\nassert.equal(slug(\"Año 2026\"), \"ano-2026\");\nconsole.log(\"3 pruebas ok\");",
  why:"Así se trabaja con TDD: las pruebas describen el comportamiento y el código se ajusta hasta cumplirlo. normalize(\"NFD\") separa la letra de su tilde para poder quitarla."},
 {t:"codigo", p:"Escribe un ejecutor de pruebas mínimo: <code>prueba(nombre, fn)</code> las registra y <code>ejecutar()</code> las lanza en orden (también async), imprime <code>ok nombre</code> o <code>FALLA nombre: mensaje</code> y un resumen",
  lenguaje:"js",
  c:`<p>Salida con las pruebas de la plantilla:</p><div class="termbox">ok suma
FALLA resta: 2 !== 1
ok async
pasan=2 fallan=1</div>`,
  plantilla:"const assert = require(\"node:assert/strict\");\nconst pruebas = [];\nfunction prueba(nombre, fn) { pruebas.push({ nombre, fn }); }\n\nasync function ejecutar() {\n  // recorre, ejecuta con await, captura errores e imprime\n}\n\nprueba(\"suma\", () => assert.equal(1 + 1, 2));\nprueba(\"resta\", () => { if (3 - 1 !== 1) throw new Error(\"2 !== 1\"); });\nprueba(\"async\", async () => assert.equal(await Promise.resolve(5), 5));\nejecutar();\n",
  pruebas:[{salida:"ok suma\nFALLA resta: 2 !== 1\nok async\npasan=2 fallan=1"}],
  pista:"for (const { nombre, fn } of pruebas) { try { await fn(); ok++; console.log(\"ok \" + nombre); } catch (e) { mal++; console.log(\"FALLA \" + nombre + \": \" + e.message); } }",
  solucion:"const assert = require(\"node:assert/strict\");\nconst pruebas = [];\nfunction prueba(nombre, fn) { pruebas.push({ nombre, fn }); }\n\nasync function ejecutar() {\n  let ok = 0, mal = 0;\n  for (const { nombre, fn } of pruebas) {\n    try {\n      await fn();\n      ok++;\n      console.log(\"ok \" + nombre);\n    } catch (e) {\n      mal++;\n      console.log(\"FALLA \" + nombre + \": \" + e.message);\n    }\n  }\n  console.log(\"pasan=\" + ok + \" fallan=\" + mal);\n}\n\nprueba(\"suma\", () => assert.equal(1 + 1, 2));\nprueba(\"resta\", () => { if (3 - 1 !== 1) throw new Error(\"2 !== 1\"); });\nprueba(\"async\", async () => assert.equal(await Promise.resolve(5), 5));\nejecutar();",
  why:"Es la esencia de node:test, Vitest o Jest. El await dentro del try es lo que hace que una prueba async que falla cuente como fallo. Los ejecutores reales, además, terminan con código de salida 1 si algo falla (process.exitCode = 1): así CI se pone en rojo."}
]},

/* =============== U9 L2 =============== */
{
id:"nd6l1",
titulo:"Probar una API",
claves:["Separa crearApp() de listen(): la app se prueba sin puerto e inyectando dependencias","Supertest (Express) o app.inject (Fastify) hacen peticiones en memoria","Prueba lo que ve el cliente: códigos de estado, cuerpo y cabeceras, incluidos los casos de error"],
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

  it("exige autenticación para borrar", async () =&gt; {
    await request(app).delete("/api/tareas/1").expect(401);
  });
});</div>
     <p>Separar <code>crearApp()</code> de <code>app.listen()</code> permite probar la app e inyectar dependencias falsas.</p>`},
 {t:"info", eti:"Diseño", h:"Código fácil de probar",
  c:`<div class="dg"><div class="dg-tit">capas de una API y qué se inyecta</div>
       <div class="dg-vert"><div class="dg-caja base">server.js<small>lee la config, crea el pool, llama a crearApp y hace listen</small></div><div class="dg-caja acento">app.js: crearApp({ repo, reloj, log })<small>rutas y middleware; no sabe de dónde vienen sus dependencias</small></div><div class="dg-caja">servicios<small>reglas de negocio puras: lo más fácil de probar</small></div><div class="dg-caja ok">repositorios<small>SQL; en pruebas, uno en memoria o una BD real en Docker</small></div></div></div>
     <p>Nada de <code>import { pool } from "./db.js"</code> dentro de las rutas: si la dependencia se recibe como parámetro, en la prueba le pasas la que quieras.</p>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["node:test","Ejecutor de pruebas integrado en Node"],["Vitest","Pruebas rápidas con API compatible con Jest"],["Supertest","Peticiones HTTP a la app sin servidor real"],["Testcontainers","PostgreSQL o Redis reales en Docker durante las pruebas"],["Playwright","Pruebas de extremo a extremo en un navegador"]],
  why:"Este proyecto usa pruebas de API y de navegador muy parecidas."},
 {t:"vf", p:"Para probar una app de Express con Supertest hace falta arrancarla con listen en un puerto.",
  ok:false, why:"Supertest recibe la app y gestiona el servidor por ti."},
 {t:"opcion", p:"¿Qué pruebas de API dan más valor por su coste?",
  ops:["Solo las del caso feliz","El caso feliz y, sobre todo, los bordes: validación (400), permisos (401/403), no encontrado (404), conflictos (409) y que los errores no filtren detalles","Solo los errores 500","Las de rendimiento"],
  ok:1, why:"Los fallos de seguridad viven en los caminos de error: un 200 donde debería haber un 403 es una vulnerabilidad."},
 {t:"opcion", p:"Tus pruebas pasan en local pero fallan a veces en CI porque comparten la misma base de datos y se pisan los datos. ¿Qué haces?",
  ops:["Reintentar las pruebas hasta que pasen","Aislar cada prueba: transacción que se deshace al final, esquema o base de datos por ejecución, o datos con identificadores únicos","Ejecutarlas de noche","Quitar las que fallan"],
  ok:1, why:"Las pruebas intermitentes (flaky) destruyen la confianza en la suite. Casi siempre es estado compartido o dependencia del tiempo."},
 {t:"codigo", p:"Prueba una app de verdad: <code>crearApp(repo)</code> devuelve un servidor HTTP. Arráncalo en el puerto 0 con un repositorio en memoria, lanza las tres peticiones y muestra el código de cada una",
  lenguaje:"js",
  c:`<p>Peticiones: <code>GET /tareas/1</code> (existe), <code>GET /tareas/99</code> (no existe) y <code>GET /tareas/abc</code> (id no válido). Salida: <code>200 streams</code>, <code>404</code>, <code>400</code>. Cierra el servidor al terminar.</p>`,
  plantilla:"const http = require(\"node:http\");\n\nfunction crearApp(repo) {\n  return http.createServer(async (req, res) => {\n    const m = req.url.match(/^\\/tareas\\/(.+)$/);\n    if (!m) return res.writeHead(404).end();\n    if (!/^\\d+$/.test(m[1])) return res.writeHead(400).end();\n    const t = await repo.buscar(Number(m[1]));\n    if (!t) return res.writeHead(404).end();\n    res.writeHead(200, { \"Content-Type\": \"application/json\" }).end(JSON.stringify(t));\n  });\n}\n\n// crea un repo en memoria con la tarea { id: 1, titulo: \"streams\" }, arranca y prueba\n",
  pruebas:[{salida:"200 streams\n404\n400"}],
  pista:"const repo = { buscar: async id => id === 1 ? { id: 1, titulo: \"streams\" } : null }; app.listen(0, async () => { ... fetch ... app.close(); });",
  solucion:"const http = require(\"node:http\");\n\nfunction crearApp(repo) {\n  return http.createServer(async (req, res) => {\n    const m = req.url.match(/^\\/tareas\\/(.+)$/);\n    if (!m) return res.writeHead(404).end();\n    if (!/^\\d+$/.test(m[1])) return res.writeHead(400).end();\n    const t = await repo.buscar(Number(m[1]));\n    if (!t) return res.writeHead(404).end();\n    res.writeHead(200, { \"Content-Type\": \"application/json\" }).end(JSON.stringify(t));\n  });\n}\n\nconst repo = { buscar: async id => id === 1 ? { id: 1, titulo: \"streams\" } : null };\nconst app = crearApp(repo);\napp.listen(0, async () => {\n  const base = \"http://127.0.0.1:\" + app.address().port;\n  const r1 = await fetch(base + \"/tareas/1\");\n  console.log(r1.status + \" \" + (await r1.json()).titulo);\n  console.log((await fetch(base + \"/tareas/99\")).status);\n  console.log((await fetch(base + \"/tareas/abc\")).status);\n  app.close();\n});",
  why:"La app no sabe si el repositorio es PostgreSQL o un objeto en memoria: eso es lo que la hace comprobable. Supertest hace exactamente esto por debajo (puerto efímero y peticiones reales)."}
]},

/* =============== U9 L3 =============== */
{
id:"nd9n2",
titulo:"Dobles de prueba, tiempo e integración",
claves:["Stubs, spies y mocks: mock.fn y mock.method en node:test; vi.fn y vi.mock en Vitest","Simula el reloj (mock.timers, vi.useFakeTimers) en lugar de esperar","Pruebas de integración con la base de datos real en Docker (Testcontainers)"],
pasos:[
 {t:"info", eti:"Dobles", h:"Espiar y sustituir",
  c:`<div class="termbox">import { mock, it } from "node:test";
import assert from "node:assert/strict";

it("envía un correo al registrarse", async () =&gt; {
  const correo = { enviar: mock.fn(async () =&gt; {}) };          // doble que registra llamadas
  const servicio = crearServicioUsuarios({ repo: repoEnMemoria(), correo });
  await servicio.registrar("ana@x.es");
  assert.equal(correo.enviar.mock.callCount(), 1);
  assert.deepEqual(correo.enviar.mock.calls[0].arguments, ["ana@x.es", "bienvenida"]);
});

// Vitest
const enviar = vi.fn().mockResolvedValue(undefined);
vi.mock("../src/correo.js", () =&gt; ({ enviar }));          // sustituye el módulo entero
expect(enviar).toHaveBeenCalledWith("ana@x.es", "bienvenida");</div>
     <div class="nota ojo"><b class="tit">No mockees lo que no es tuyo</b>Si mockeas el cliente de pg con respuestas inventadas, la prueba pasa aunque tu SQL esté mal. Para el acceso a datos, mejor una base de datos real en Docker. Los dobles, para los bordes caros o externos: correo, pagos, APIs de terceros, el reloj.</div>`},
 {t:"info", eti:"El reloj", h:"Tiempo simulado e integración",
  c:`<div class="termbox">// node:test (en Node 22 aún avisa de que es experimental)
mock.timers.enable({ apis: ["setTimeout", "Date"] });
iniciarSesion();
mock.timers.tick(15 * 60_000);          // 15 minutos en un instante
assert.equal(sesionCaducada(), true);

// Vitest
vi.useFakeTimers();
vi.advanceTimersByTime(15 * 60_000);</div>
     <div class="termbox">// integración con PostgreSQL real
import { PostgreSqlContainer } from "@testcontainers/postgresql";
const pg = await new PostgreSqlContainer("postgres:17").start();
const pool = new Pool({ connectionString: pg.getConnectionUri() });
await migrar(pool);
// ...pruebas contra una BD de verdad...
await pool.end(); await pg.stop();</div>`},
 {t:"par", p:"Empareja cada doble con su definición",
  pares:[["Stub","Devuelve respuestas preparadas"],["Spy","Registra cómo se le llamó"],["Mock","Doble con expectativas sobre las llamadas"],["Fake","Implementación simplificada que funciona (repositorio en memoria)"]],
  why:"En la práctica, mock.fn y vi.fn hacen de stub y de spy a la vez."},
 {t:"opcion", p:"Una prueba de caducidad de sesión hace <code>await dormir(15 * 60_000)</code>. ¿Qué harías?",
  ops:["Nada, es realista","Simular el reloj (mock.timers o vi.useFakeTimers) o inyectar una función ahora(): la prueba tarda milisegundos y es determinista","Reducir a 1 minuto","Ejecutarla solo en CI"],
  ok:1, why:"El tiempo real hace las pruebas lentas e intermitentes."},
 {t:"vf", p:"Una suite con un 100 % de cobertura garantiza que el código no tiene errores.",
  ok:false, why:"La cobertura dice qué líneas se ejecutaron, no si se comprobó algo útil. Es buena para encontrar zonas sin probar, mala como objetivo en sí."},
 {t:"opcion", p:"¿Qué probarías con Testcontainers y no con un repositorio en memoria?",
  ops:["La lógica de descuentos","El SQL real: consultas, restricciones UNIQUE y CHECK, transacciones y migraciones","El formato del JSON","La validación con zod"],
  ok:1, why:"El repositorio en memoria no sabe que el email es único ni que tu JOIN está mal. La base de datos real sí."},
 {t:"codigo", p:"Usa <code>mock.fn</code> y <code>mock.timers</code> de <code>node:test</code> para comprobar un <code>debounce</code>: tras 5 llamadas seguidas, la función real se ejecuta una sola vez, con el último argumento, 300 ms después",
  lenguaje:"js",
  c:`<p>Implementa <code>debounce(fn, ms)</code>. La plantilla simula el tiempo. Salida: <code>tras 299 ms: 0</code>, <code>tras 300 ms: 1</code> y <code>argumento: e</code>.</p>`,
  plantilla:"const { mock } = require(\"node:test\");\n\nfunction debounce(fn, ms) {\n  // cada llamada cancela la anterior y programa una nueva\n}\n\nmock.timers.enable({ apis: [\"setTimeout\"] });\nconst guardar = mock.fn();\nconst guardarPronto = debounce(guardar, 300);\nfor (const letra of [\"a\", \"b\", \"c\", \"d\", \"e\"]) guardarPronto(letra);\nmock.timers.tick(299);\nconsole.log(\"tras 299 ms: \" + guardar.mock.callCount());\nmock.timers.tick(1);\nconsole.log(\"tras 300 ms: \" + guardar.mock.callCount());\nconsole.log(\"argumento: \" + guardar.mock.calls[0].arguments[0]);\n",
  pruebas:[{salida:"tras 299 ms: 0\ntras 300 ms: 1\nargumento: e"}],
  pista:"let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };",
  solucion:"const { mock } = require(\"node:test\");\n\nfunction debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}\n\nmock.timers.enable({ apis: [\"setTimeout\"] });\nconst guardar = mock.fn();\nconst guardarPronto = debounce(guardar, 300);\nfor (const letra of [\"a\", \"b\", \"c\", \"d\", \"e\"]) guardarPronto(letra);\nmock.timers.tick(299);\nconsole.log(\"tras 299 ms: \" + guardar.mock.callCount());\nmock.timers.tick(1);\nconsole.log(\"tras 300 ms: \" + guardar.mock.callCount());\nconsole.log(\"argumento: \" + guardar.mock.calls[0].arguments[0]);",
  why:"Sin reloj simulado, esta prueba necesitaría esperar de verdad y sería frágil. Con él, comprueba el límite exacto (299 frente a 300 ms) en microsegundos."},
 {t:"codigo", p:"Sustituye un método con <code>mock.method</code>: haz que <code>pagos.cobrar</code> falle y comprueba que el servicio marca el pedido como <code>pago_fallido</code> sin llamar a <code>almacen.reservar</code>",
  lenguaje:"js",
  c:`<p>Salida: <code>pago_fallido</code>, <code>cobros=1</code>, <code>reservas=0</code>.</p>`,
  plantilla:"const { mock } = require(\"node:test\");\nconst pagos = { cobrar: async () => \"ok\" };\nconst almacen = { reservar: async () => \"ok\" };\n\nasync function procesarPedido(p) {\n  try { await pagos.cobrar(p.total); } catch { return \"pago_fallido\"; }\n  await almacen.reservar(p.id);\n  return \"confirmado\";\n}\n\n(async () => {\n  // sustituye pagos.cobrar por uno que lance, espía almacen.reservar, ejecuta e imprime\n})();\n",
  pruebas:[{salida:"pago_fallido\ncobros=1\nreservas=0"}],
  pista:"mock.method(pagos, \"cobrar\", async () => { throw new Error(\"tarjeta rechazada\"); }); mock.method(almacen, \"reservar\"); luego pagos.cobrar.mock.callCount().",
  solucion:"const { mock } = require(\"node:test\");\nconst pagos = { cobrar: async () => \"ok\" };\nconst almacen = { reservar: async () => \"ok\" };\n\nasync function procesarPedido(p) {\n  try { await pagos.cobrar(p.total); } catch { return \"pago_fallido\"; }\n  await almacen.reservar(p.id);\n  return \"confirmado\";\n}\n\n(async () => {\n  mock.method(pagos, \"cobrar\", async () => { throw new Error(\"tarjeta rechazada\"); });\n  mock.method(almacen, \"reservar\");\n  console.log(await procesarPedido({ id: 1, total: 50 }));\n  console.log(\"cobros=\" + pagos.cobrar.mock.callCount());\n  console.log(\"reservas=\" + almacen.reservar.mock.callCount());\n})();",
  why:"Probar el camino de error de un servicio externo sin depender de él. mock.method sin implementación deja el método original pero lo espía; mock.restoreAll() lo devuelve todo a su estado."}
]}

]});
