window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Bases de datos desde Node",
resumen: "PostgreSQL con pg y pools, consultas parametrizadas y transacciones, Prisma y Drizzle, migraciones, N+1 y paginación, y Redis y MongoDB",
nivel: "Avanzado",
color: "#65a541",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"nd4l1",
titulo:"PostgreSQL con pg",
claves:["Un Pool reutiliza conexiones; se crea una vez al arrancar y se cierra al apagar","Consultas parametrizadas ($1, $2) contra la inyección SQL","Transacciones con un cliente del pool: BEGIN, COMMIT, ROLLBACK y release siempre"],
pasos:[
 {t:"info", eti:"El driver", h:"pg y el pool",
  c:`<div class="termbox">import pg from "pg";
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                          // conexiones por proceso
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,   // no esperar eternamente a una conexión libre
});

const { rows } = await pool.query(
  "SELECT id, titulo, hecha FROM tareas WHERE hecha = $1 ORDER BY id LIMIT $2",
  [false, 20]
);

// transacción
const cliente = await pool.connect();
try {
  await cliente.query("BEGIN");
  await cliente.query("UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2", [100, 1]);
  await cliente.query("UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2", [100, 2]);
  await cliente.query("COMMIT");
} catch (e) {
  await cliente.query("ROLLBACK");
  throw e;
} finally {
  cliente.release();                 // devolver la conexión al pool SIEMPRE
}</div>`},
 {t:"info", eti:"Dimensionar", h:"Cuántas conexiones",
  c:`<p>PostgreSQL admite un número limitado de conexiones (100 por defecto) y cada una cuesta memoria en el servidor. Haz la cuenta: <b>réplicas × max del pool</b> debe quedar por debajo del límite, dejando margen para migraciones y administración.</p>
     <div class="dg"><div class="dg-tit">la cuenta que hay que hacer</div>
       <div class="dg-flujo"><div class="dg-caja">8 réplicas</div><div class="dg-caja">× pool de 10</div><div class="dg-caja acento">80 conexiones</div><div class="dg-caja ok">≤ max_connections con margen</div></div></div>
     <p>Con muchas réplicas o funciones serverless, se pone delante un <b>PgBouncer</b> (o RDS Proxy) que reparte pocas conexiones reales entre muchos clientes.</p>
     <div class="nota"><b class="tit">Para practicar aquí</b>Los ejercicios usan <code>node:sqlite</code>, la base de datos integrada en Node 22.13+ (aún marcada como experimental). Las reglas son las mismas: parámetros con <code>?</code> en vez de <code>$1</code>, sentencias preparadas y transacciones.</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["Pool","Conjunto de conexiones reutilizables"],["$1, $2","Parámetros: el driver los envía aparte del SQL"],["cliente.release()","Devolver la conexión al pool"],["BEGIN / COMMIT / ROLLBACK","Controlar la transacción"],["connectionTimeoutMillis","Fallar pronto si no hay conexiones libres"]],
  why:"Olvidar release() agota el pool y la API se queda colgada."},
 {t:"opcion", p:"¿Qué tiene de peligroso <code>pool.query(\"SELECT * FROM usuarios WHERE email = '\" + email + \"'\")</code>?",
  ops:["Nada","Inyección SQL: el email puede contener SQL que se ejecuta. Usa $1 y pasa el valor aparte","Es más lento","No devuelve filas"],
  ok:1, why:"Es el mismo principio que PreparedStatement en Java."},
 {t:"vf", p:"Conviene crear un Pool nuevo en cada petición HTTP.",
  ok:false, why:"Un pool por proceso, creado al arrancar. Crear pools por petición agota las conexiones de PostgreSQL."},
 {t:"opcion", p:"Una transacción usa <code>pool.query(\"BEGIN\")</code>, luego <code>pool.query(\"UPDATE…\")</code> y <code>pool.query(\"COMMIT\")</code>. A veces los datos quedan a medias. ¿Por qué?",
  ops:["PostgreSQL no admite transacciones","Cada pool.query puede ir por una conexión distinta: el BEGIN y los UPDATE no están en la misma sesión. Hay que usar pool.connect() y un único cliente","Falta un await","Falta un índice"],
  ok:1, why:"Una transacción vive en una conexión. pool.query coge cualquier conexión libre para cada llamada."},
 {t:"codigo", p:"Demuestra que los parámetros frenan la inyección: busca en la tabla <code>usuarios</code> el email que llega por stdin con una sentencia preparada e imprime cuántas filas coinciden",
  lenguaje:"js",
  c:`<p>Con <code>ana@x.es</code> debe salir <code>1</code>; con el intento de inyección <code>' OR '1'='1</code>, <code>0</code>.</p>`,
  plantilla:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(\"CREATE TABLE usuarios (id INTEGER PRIMARY KEY, email TEXT); INSERT INTO usuarios (email) VALUES ('ana@x.es'), ('luis@x.es');\");\nconst email = require(\"node:fs\").readFileSync(0, \"utf8\").trim();\n// consulta con un parámetro ? e imprime el número de filas\n",
  pruebas:[{entrada:"ana@x.es\n", salida:"1"},{entrada:"' OR '1'='1\n", salida:"0"},{entrada:"luis@x.es' --\n", salida:"0", oculta:true}],
  pista:"db.prepare(\"SELECT id FROM usuarios WHERE email = ?\").all(email).length",
  solucion:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(\"CREATE TABLE usuarios (id INTEGER PRIMARY KEY, email TEXT); INSERT INTO usuarios (email) VALUES ('ana@x.es'), ('luis@x.es');\");\nconst email = require(\"node:fs\").readFileSync(0, \"utf8\").trim();\nconst filas = db.prepare(\"SELECT id FROM usuarios WHERE email = ?\").all(email);\nconsole.log(filas.length);",
  why:"El valor viaja aparte del SQL: nunca se interpreta como código. Con concatenación, <code>' OR '1'='1</code> habría devuelto todos los usuarios."},
 {t:"codigo", p:"Haz una transferencia en una transacción: si la cuenta de origen se queda en negativo, deshaz todo con ROLLBACK",
  lenguaje:"js",
  c:`<p>stdin trae el importe a transferir de la cuenta 1 (saldo 100) a la 2 (saldo 50). Imprime <code>ok</code> o <code>rechazada</code> y después los dos saldos separados por un espacio.</p>`,
  plantilla:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(\"CREATE TABLE cuentas (id INTEGER PRIMARY KEY, saldo INTEGER); INSERT INTO cuentas VALUES (1, 100), (2, 50);\");\nconst importe = Number(require(\"node:fs\").readFileSync(0, \"utf8\"));\n\nfunction transferir(de, a, cantidad) {\n  // BEGIN, dos UPDATE, comprobar el saldo, COMMIT o ROLLBACK\n}\n\nconsole.log(transferir(1, 2, importe) ? \"ok\" : \"rechazada\");\nconst s = db.prepare(\"SELECT saldo FROM cuentas ORDER BY id\").all().map(f => f.saldo);\nconsole.log(s.join(\" \"));\n",
  pruebas:[{entrada:"30\n", salida:"ok\n70 80"},{entrada:"150\n", salida:"rechazada\n100 50"},{entrada:"100\n", salida:"ok\n0 150", oculta:true}],
  pista:"db.exec(\"BEGIN\"); los UPDATE con prepare(...).run(cantidad, id); lee el saldo de origen; si es &lt; 0, db.exec(\"ROLLBACK\") y devuelve false; si no, COMMIT y true. Envuelve en try/catch para hacer ROLLBACK si algo lanza.",
  solucion:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(\"CREATE TABLE cuentas (id INTEGER PRIMARY KEY, saldo INTEGER); INSERT INTO cuentas VALUES (1, 100), (2, 50);\");\nconst importe = Number(require(\"node:fs\").readFileSync(0, \"utf8\"));\n\nfunction transferir(de, a, cantidad) {\n  db.exec(\"BEGIN\");\n  try {\n    db.prepare(\"UPDATE cuentas SET saldo = saldo - ? WHERE id = ?\").run(cantidad, de);\n    db.prepare(\"UPDATE cuentas SET saldo = saldo + ? WHERE id = ?\").run(cantidad, a);\n    const { saldo } = db.prepare(\"SELECT saldo FROM cuentas WHERE id = ?\").get(de);\n    if (saldo < 0) { db.exec(\"ROLLBACK\"); return false; }\n    db.exec(\"COMMIT\");\n    return true;\n  } catch (e) {\n    db.exec(\"ROLLBACK\");\n    throw e;\n  }\n}\n\nconsole.log(transferir(1, 2, importe) ? \"ok\" : \"rechazada\");\nconst s = db.prepare(\"SELECT saldo FROM cuentas ORDER BY id\").all().map(f => f.saldo);\nconsole.log(s.join(\" \"));",
  why:"O se aplican los dos UPDATE o ninguno. En PostgreSQL añadirías además una restricción CHECK (saldo &gt;= 0) para que la base de datos lo garantice aunque el código falle."}
]},

/* =============== U7 L2 =============== */
{
id:"nd4l2",
titulo:"ORMs, query builders y migraciones",
claves:["Prisma: esquema propio, cliente generado y tipado, migraciones","Drizzle y Kysely: consultas en TypeScript muy cercanas a SQL","Migraciones versionadas y aplicadas en el despliegue, igual que Flyway"],
pasos:[
 {t:"info", eti:"Productividad", h:"Prisma",
  c:`<div class="termbox">// schema.prisma
model Tarea {
  id        Int      @id @default(autoincrement())
  titulo    String   @db.VarChar(200)
  hecha     Boolean  @default(false)
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId Int
  creadaEn  DateTime @default(now())
  @@index([usuarioId, creadaEn])
}

// uso, con tipos generados
const pendientes = await prisma.tarea.findMany({
  where: { hecha: false, usuarioId },
  orderBy: { creadaEn: "desc" },
  include: { usuario: true },
  take: 20,
});

await prisma.$transaction(async (tx) =&gt; { ... });    // transacción interactiva</div>
     <div class="termbox">npx prisma migrate dev --name anadir_tareas    # crea y aplica una migración en desarrollo
npx prisma migrate deploy                       # aplica las pendientes en producción</div>`},
 {t:"info", eti:"Cerca de SQL", h:"Drizzle y Kysely",
  c:`<div class="termbox">// Drizzle: el esquema es código TypeScript
export const tareas = pgTable("tareas", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  hecha: boolean("hecha").default(false).notNull(),
  usuarioId: integer("usuario_id").references(() =&gt; usuarios.id),
});

const filas = await db.select().from(tareas)
  .where(and(eq(tareas.hecha, false), eq(tareas.usuarioId, uid)))
  .orderBy(desc(tareas.id)).limit(20);

// npx drizzle-kit generate   → crea el SQL de la migración
// npx drizzle-kit migrate    → la aplica</div>
     <p>Si sabes SQL, Drizzle o Kysely se leen solos y el SQL generado es predecible. Prisma abstrae más y es muy productivo, a cambio de controlar menos la consulta exacta.</p>`},
 {t:"par", p:"Empareja cada herramienta con su estilo",
  pares:[["pg (driver)","SQL a mano, control total"],["Prisma","Esquema declarativo, cliente generado y muy tipado"],["Drizzle","Esquema en TypeScript y consultas parecidas a SQL"],["TypeORM","Entidades con decoradores, estilo JPA"],["Kysely","Query builder tipado, sin esquema propio"]],
  why:"Los mismos problemas de JPA existen aquí: N+1, consultas lentas generadas y la necesidad de mirar el SQL."},
 {t:"opcion", p:"¿Qué comando aplicarías en el pipeline de despliegue para ejecutar las migraciones pendientes de Prisma?",
  ops:["npx prisma migrate dev","npx prisma migrate deploy","npx prisma db push --force-reset","npx prisma studio"],
  ok:1, why:"migrate dev es para desarrollo (puede crear migraciones y resetear); deploy solo aplica las existentes."},
 {t:"vf", p:"Con varias réplicas, cada una debería ejecutar las migraciones al arrancar, a la vez.",
  ok:false, why:"Varias réplicas migrando a la vez compiten entre sí. Lo habitual es un paso único antes del despliegue: un job de CI, un initContainer o un Job de Kubernetes."},
 {t:"opcion", p:"Tienes que renombrar una columna en producción sin cortar el servicio mientras conviven la versión vieja y la nueva de la API. ¿Cómo lo haces?",
  ops:["ALTER TABLE ... RENAME en la misma migración que el despliegue","En pasos compatibles: añadir la columna nueva, escribir en ambas, copiar los datos, leer de la nueva y, en un despliegue posterior, borrar la vieja","Parar la API","Crear otra tabla"],
  ok:1, why:"Es el patrón expandir y contraer. Durante un despliegue gradual, las dos versiones del código deben funcionar con el mismo esquema."},
 {t:"codigo", p:"Escribe un mini query builder: convierte un filtro en SQL parametrizado estilo PostgreSQL (<code>$1</code>, <code>$2</code>…)",
  lenguaje:"js",
  c:`<p><code>construir(tabla, filtro, limite)</code> devuelve <code>{ sql, params }</code>. Las claves en camelCase pasan a snake_case (<code>usuarioId</code> → <code>usuario_id</code>). Sin filtro, no hay WHERE. Salida esperada en la plantilla:</p>
     <div class="termbox">SELECT * FROM tareas WHERE hecha = $1 AND usuario_id = $2 LIMIT $3
[false,7,20]
SELECT * FROM usuarios LIMIT $1
[5]</div>`,
  plantilla:"function construir(tabla, filtro, limite) {\n  // ...\n  return { sql, params };\n}\n\nfor (const [t, f, l] of [[\"tareas\", { hecha: false, usuarioId: 7 }, 20], [\"usuarios\", {}, 5]]) {\n  const { sql, params } = construir(t, f, l);\n  console.log(sql);\n  console.log(JSON.stringify(params));\n}\n",
  pruebas:[{salida:"SELECT * FROM tareas WHERE hecha = $1 AND usuario_id = $2 LIMIT $3\n[false,7,20]\nSELECT * FROM usuarios LIMIT $1\n[5]"}],
  pista:"Recorre Object.entries(filtro); por cada clave, params.push(valor) y la condición `${snake} = $${params.length}`. Para snake_case: k.replace(/[A-Z]/g, m => \"_\" + m.toLowerCase()).",
  solucion:"function construir(tabla, filtro, limite) {\n  const params = [];\n  const conds = [];\n  for (const [k, v] of Object.entries(filtro)) {\n    params.push(v);\n    const col = k.replace(/[A-Z]/g, m => \"_\" + m.toLowerCase());\n    conds.push(col + \" = $\" + params.length);\n  }\n  params.push(limite);\n  let sql = \"SELECT * FROM \" + tabla;\n  if (conds.length) sql += \" WHERE \" + conds.join(\" AND \");\n  sql += \" LIMIT $\" + params.length;\n  return { sql, params };\n}\n\nfor (const [t, f, l] of [[\"tareas\", { hecha: false, usuarioId: 7 }, 20], [\"usuarios\", {}, 5]]) {\n  const { sql, params } = construir(t, f, l);\n  console.log(sql);\n  console.log(JSON.stringify(params));\n}",
  why:"Los valores van siempre en params; en el SQL solo entran nombres que controlas tú. Si el nombre de la columna viniera del usuario, habría que validarlo contra una lista blanca: los identificadores no se pueden parametrizar."}
]},

/* =============== U7 L3 =============== */
{
id:"nd7n1",
titulo:"Patrones de acceso: N+1, paginación y rendimiento",
claves:["N+1: una consulta por cada fila de una lista; se arregla con JOIN, IN o DataLoader","Paginación por cursor (WHERE id &gt; último) en lugar de OFFSET grande","Mira el SQL que se ejecuta: logs de consultas, EXPLAIN y tiempos"],
pasos:[
 {t:"info", eti:"El clásico", h:"El problema N+1",
  c:`<div class="termbox">// 1 consulta para las tareas + 1 por cada tarea para su usuario = 101 consultas
const tareas = await db.query("SELECT * FROM tareas LIMIT 100");
for (const t of tareas.rows) {
  t.usuario = (await db.query("SELECT * FROM usuarios WHERE id = $1", [t.usuario_id])).rows[0];
}

// 2 consultas en total
const ids = [...new Set(tareas.rows.map(t =&gt; t.usuario_id))];
const { rows: usuarios } = await db.query("SELECT * FROM usuarios WHERE id = ANY($1)", [ids]);
const porId = new Map(usuarios.map(u =&gt; [u.id, u]));
for (const t of tareas.rows) t.usuario = porId.get(t.usuario_id);</div>
     <p>Con un ORM ocurre sin que lo veas: acceder a <code>tarea.usuario</code> dentro de un bucle. En Prisma se evita con <code>include</code>; en GraphQL, con <b>DataLoader</b>, que agrupa las cargas de un mismo tick en una sola consulta.</p>`},
 {t:"info", eti:"Listas largas", h:"Paginación por cursor",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">OFFSET frente a cursor</div>
       <table class="dg-tabla"><thead><tr><th></th><th>OFFSET 100000 LIMIT 20</th><th>WHERE id &gt; $1 LIMIT 20</th></tr></thead><tbody>
       <tr><td>coste</td><td>lee y descarta 100 000 filas</td><td>salta directo con el índice</td></tr>
       <tr><td>si se insertan filas</td><td>repite o se salta elementos</td><td>estable</td></tr>
       <tr><td>ir a la página N</td><td>sí</td><td>no: solo siguiente/anterior</td></tr>
       </tbody></table></div>
     <div class="termbox">GET /api/tareas?limite=20&amp;despues=4812
→ { "datos": [...], "siguiente": "4832" }</div>
     <p>Para ordenar por algo que no es único (fecha), el cursor combina los dos campos: <code>WHERE (creada_en, id) &lt; ($1, $2) ORDER BY creada_en DESC, id DESC</code>.</p>`},
 {t:"par", p:"Empareja cada síntoma con su causa",
  pares:[["Una página de 50 elementos lanza 51 consultas","N+1"],["Las últimas páginas del listado tardan segundos","OFFSET grande"],["Timeouts esperando conexión con poca carga de CPU","Pool agotado: conexiones sin liberar o transacciones largas"],["Una consulta lenta con un WHERE sin índice","Recorrido secuencial de la tabla (EXPLAIN lo muestra)"]],
  why:"Activa el log de consultas en desarrollo: ver 51 SELECT seguidos delata el N+1 al instante."},
 {t:"opcion", p:"Tu endpoint de listado usa <code>OFFSET</code> y el cliente, al pasar de página mientras se crean tareas nuevas, ve elementos repetidos. ¿Qué cambias?",
  ops:["Subir el LIMIT","Paginación por cursor: pedir los elementos posteriores al último visto","Cachear la primera página","Ordenar al azar"],
  ok:1, why:"Con OFFSET, cada inserción desplaza todas las posiciones. El cursor ancla la página a un valor concreto."},
 {t:"vf", p:"Una transacción abierta mientras se llama a una API externa lenta puede agotar el pool de conexiones.",
  ok:true, why:"La conexión queda ocupada (y con bloqueos) todo ese tiempo. Haz las llamadas externas fuera de la transacción."},
 {t:"codigo", p:"Arregla un N+1: carga los autores de todas las tareas con una sola consulta <code>IN</code> y cuenta las consultas ejecutadas",
  lenguaje:"js",
  c:`<p>La función <code>q(sql, ...params)</code> ya cuenta las consultas. Imprime cada tarea como <code>titulo - autor</code> (en orden de id) y al final <code>consultas=2</code>.</p>`,
  plantilla:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(`CREATE TABLE usuarios (id INTEGER PRIMARY KEY, nombre TEXT);\nCREATE TABLE tareas (id INTEGER PRIMARY KEY, titulo TEXT, usuario_id INTEGER);\nINSERT INTO usuarios VALUES (1, 'ana'), (2, 'luis');\nINSERT INTO tareas VALUES (1, 'streams', 1), (2, 'pool', 2), (3, 'tests', 1);`);\nlet consultas = 0;\nconst q = (sql, ...p) => { consultas++; return db.prepare(sql).all(...p); };\n\nconst tareas = q(\"SELECT * FROM tareas ORDER BY id\");\n// carga los usuarios de golpe y pinta cada tarea\n\nconsole.log(\"consultas=\" + consultas);\n",
  pruebas:[{salida:"streams - ana\npool - luis\ntests - ana\nconsultas=2"}],
  pista:"const ids = [...new Set(tareas.map(t => t.usuario_id))]; q(`SELECT * FROM usuarios WHERE id IN (${ids.map(() => \"?\").join(\",\")})`, ...ids) y un Map por id.",
  solucion:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(`CREATE TABLE usuarios (id INTEGER PRIMARY KEY, nombre TEXT);\nCREATE TABLE tareas (id INTEGER PRIMARY KEY, titulo TEXT, usuario_id INTEGER);\nINSERT INTO usuarios VALUES (1, 'ana'), (2, 'luis');\nINSERT INTO tareas VALUES (1, 'streams', 1), (2, 'pool', 2), (3, 'tests', 1);`);\nlet consultas = 0;\nconst q = (sql, ...p) => { consultas++; return db.prepare(sql).all(...p); };\n\nconst tareas = q(\"SELECT * FROM tareas ORDER BY id\");\nconst ids = [...new Set(tareas.map(t => t.usuario_id))];\nconst usuarios = q(\"SELECT * FROM usuarios WHERE id IN (\" + ids.map(() => \"?\").join(\",\") + \")\", ...ids);\nconst porId = new Map(usuarios.map(u => [u.id, u]));\nfor (const t of tareas) console.log(t.titulo + \" - \" + porId.get(t.usuario_id).nombre);\n\nconsole.log(\"consultas=\" + consultas);",
  why:"Dos consultas, tenga la lista 3 elementos o 3000. Los marcadores ? se generan según cuántos ids hay; los valores siguen yendo como parámetros."},
 {t:"codigo", p:"Pagina por cursor: lee de stdin el tamaño de página y recorre la tabla con <code>WHERE id &gt; ? ORDER BY id LIMIT ?</code>, imprimiendo cada página como ids separados por comas",
  lenguaje:"js",
  c:`<p>La tabla tiene los ids 1 a 7. Con tamaño 3: <code>1,2,3</code>, <code>4,5,6</code>, <code>7</code>.</p>`,
  plantilla:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(\"CREATE TABLE eventos (id INTEGER PRIMARY KEY, tipo TEXT)\");\nconst ins = db.prepare(\"INSERT INTO eventos (tipo) VALUES (?)\");\nfor (let i = 0; i < 7; i++) ins.run(\"e\" + i);\nconst tam = Number(require(\"node:fs\").readFileSync(0, \"utf8\"));\n// recorre página a página usando el último id como cursor\n",
  pruebas:[{entrada:"3\n", salida:"1,2,3\n4,5,6\n7"},{entrada:"5\n", salida:"1,2,3,4,5\n6,7"},{entrada:"7\n", salida:"1,2,3,4,5,6,7", oculta:true}],
  pista:"let cursor = 0; while (true) { const filas = pagina.all(cursor, tam); if (!filas.length) break; imprime; cursor = filas.at(-1).id; }",
  solucion:"const { DatabaseSync } = require(\"node:sqlite\");\nconst db = new DatabaseSync(\":memory:\");\ndb.exec(\"CREATE TABLE eventos (id INTEGER PRIMARY KEY, tipo TEXT)\");\nconst ins = db.prepare(\"INSERT INTO eventos (tipo) VALUES (?)\");\nfor (let i = 0; i < 7; i++) ins.run(\"e\" + i);\nconst tam = Number(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst pagina = db.prepare(\"SELECT id FROM eventos WHERE id > ? ORDER BY id LIMIT ?\");\nlet cursor = 0;\nwhile (true) {\n  const filas = pagina.all(cursor, tam);\n  if (!filas.length) break;\n  console.log(filas.map(f => f.id).join(\",\"));\n  cursor = filas.at(-1).id;\n}",
  why:"Cada página cuesta lo mismo, sea la primera o la diez mil. Es la técnica para exportar tablas enormes por lotes sin cargar todo en memoria."}
]},

/* =============== U7 L4 =============== */
{
id:"nd4l3",
titulo:"Redis y MongoDB",
claves:["Redis: estructuras en memoria para caché, sesiones, contadores y colas","Caché con TTL y el patrón cache-aside; invalidar al escribir","MongoDB guarda documentos JSON; útil con esquemas variables, con sus propios compromisos"],
pasos:[
 {t:"info", eti:"Memoria compartida", h:"Redis",
  c:`<div class="termbox">import { createClient } from "redis";
const redis = await createClient({ url: process.env.REDIS_URL }).connect();

async function productoConCache(id) {                     // cache-aside
  const guardado = await redis.get(\`producto:\${id}\`);
  if (guardado) return JSON.parse(guardado);
  const p = await repo.buscar(id);
  await redis.set(\`producto:\${id}\`, JSON.stringify(p), { EX: 300 });   // 5 minutos
  return p;
}
async function actualizarProducto(id, datos) {
  await repo.actualizar(id, datos);
  await redis.del(\`producto:\${id}\`);                      // invalidar al escribir
}

await redis.incr(\`visitas:\${hoy}\`);                       // contador atómico
await redis.set("bloqueo:informe", "1", { NX: true, EX: 60 }); // bloqueo simple</div>`},
 {t:"info", eti:"Documentos", h:"MongoDB",
  c:`<div class="termbox">import { MongoClient } from "mongodb";
const cliente = new MongoClient(process.env.MONGO_URL);    // gestiona su propio pool
const db = cliente.db("tienda");
const pedidos = db.collection("pedidos");

await pedidos.insertOne({ cliente: "ana", lineas: [{ sku: "TEC-01", cantidad: 1 }], total: 89.9 });
await pedidos.find({ cliente: "ana", total: { $gt: 50 } }).sort({ _id: -1 }).limit(10).toArray();
await pedidos.createIndex({ cliente: 1, _id: -1 });</div>
     <p>Cómodo cuando cada documento tiene una forma distinta o se lee entero. Para datos muy relacionados con transacciones complejas, una base relacional suele ser mejor elección. Mongoose añade esquemas y validación por encima del driver.</p>`},
 {t:"par", p:"Empareja cada necesidad con la herramienta",
  pares:[["Caché de respuestas con caducidad","Redis con TTL"],["Contador de visitas concurrente","Redis INCR"],["Sesiones compartidas entre réplicas","Redis"],["Documentos con estructura variable","MongoDB"],["Transacciones entre muchas tablas relacionadas","PostgreSQL"]],
  why:"Cada almacén en lo que hace mejor."},
 {t:"vf", p:"Una caché sin TTL ni invalidación puede servir datos obsoletos indefinidamente.",
  ok:true, why:"Define siempre caducidad e invalida al escribir."},
 {t:"opcion", p:"La caché de un producto muy visitado caduca y, en ese instante, 500 peticiones van a la vez a la base de datos. ¿Cómo se llama y cómo se mitiga?",
  ops:["Inyección de caché; con HTTPS","Estampida (cache stampede); con un bloqueo para que solo una petición recargue, caducidades con algo de aleatoriedad o refresco anticipado","N+1; con JOIN","Fuga de memoria; con más RAM"],
  ok:1, why:"También se agrupan las peticiones concurrentes de la misma clave en una sola promesa dentro del proceso."},
 {t:"opcion", p:"¿Por qué no guardar la caché en un <code>Map</code> del proceso si tienes 4 réplicas?",
  ops:["Un Map es lento","Cada réplica tendría su copia: al invalidar en una, las otras siguen sirviendo datos viejos; y la memoria no tiene límite si no lo pones","Los Map no admiten objetos","No se puede serializar"],
  ok:1, why:"Una caché local vale para datos casi inmutables con TTL corto. Para datos que cambian, una caché compartida (Redis)."},
 {t:"codigo", p:"Implementa cache-aside con TTL sobre un reloj simulado y cuenta aciertos y fallos",
  lenguaje:"js",
  c:`<p><code>obtener(clave, ahora)</code> devuelve el valor de la caché si no ha caducado; si no, llama a <code>cargar(clave)</code> y lo guarda con <code>TTL</code> = 100. Con los accesos de la plantilla, la salida es <code>aciertos=2 fallos=3</code>.</p>`,
  plantilla:"const TTL = 100;\nconst cache = new Map();\nlet aciertos = 0, fallos = 0;\nconst cargar = clave => \"valor de \" + clave;\n\nfunction obtener(clave, ahora) {\n  // ...\n}\n\nfor (const [clave, t] of [[\"a\", 0], [\"a\", 50], [\"b\", 60], [\"a\", 99], [\"a\", 150]]) obtener(clave, t);\nconsole.log(\"aciertos=\" + aciertos + \" fallos=\" + fallos);\n",
  pruebas:[{salida:"aciertos=2 fallos=3"}],
  pista:"Guarda { valor, caduca: ahora + TTL }. Es acierto si existe y ahora &lt; caduca.",
  solucion:"const TTL = 100;\nconst cache = new Map();\nlet aciertos = 0, fallos = 0;\nconst cargar = clave => \"valor de \" + clave;\n\nfunction obtener(clave, ahora) {\n  const e = cache.get(clave);\n  if (e && ahora < e.caduca) { aciertos++; return e.valor; }\n  fallos++;\n  const valor = cargar(clave);\n  cache.set(clave, { valor, caduca: ahora + TTL });\n  return valor;\n}\n\nfor (const [clave, t] of [[\"a\", 0], [\"a\", 50], [\"b\", 60], [\"a\", 99], [\"a\", 150]]) obtener(clave, t);\nconsole.log(\"aciertos=\" + aciertos + \" fallos=\" + fallos);",
  why:"Inyectar el reloj (ahora) hace la lógica comprobable sin esperar de verdad. La tasa de aciertos es la métrica que dice si una caché merece la pena."}
]}

]});
