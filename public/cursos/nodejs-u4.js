window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Bases de datos desde Node",
resumen: "PostgreSQL con el driver pg y pools, consultas parametrizadas, transacciones, ORMs como Prisma y Drizzle, y migraciones",
nivel: "Intermedio",
color: "#72b24d",
lecciones: [

{
id:"nd4l1",
titulo:"PostgreSQL con pg",
claves:["Un Pool reutiliza conexiones; se crea una vez al arrancar","Consultas parametrizadas ($1, $2) contra la inyección SQL","Transacciones con un cliente del pool: BEGIN, COMMIT, ROLLBACK y release"],
pasos:[
 {t:"info", eti:"El driver", h:"pg y el pool",
  c:`<div class="termbox">import pg from "pg";
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

const { rows } = await pool.query(
  "SELECT id, titulo, hecha FROM tareas WHERE hecha = $1 ORDER BY id LIMIT $2",
  [false, 20]
);

// transaccion
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
  cliente.release();                 // devolver la conexion al pool SIEMPRE
}</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["Pool","Conjunto de conexiones reutilizables"],["$1, $2","Parámetros: el driver los envía aparte del SQL"],["cliente.release()","Devolver la conexión al pool"],["BEGIN / COMMIT / ROLLBACK","Controlar la transacción"]],
  why:"Olvidar release() agota el pool y la API se queda colgada."},
 {t:"opcion", p:"¿Qué tiene de peligroso <code>pool.query(\"SELECT * FROM usuarios WHERE email = '\" + email + \"'\")</code>?",
  ops:["Nada","Inyección SQL: el email puede contener SQL que se ejecuta. Usa $1 y pasa el valor aparte","Es más lento","No devuelve filas"],
  ok:1, why:"Es el mismo principio que PreparedStatement en Java."},
 {t:"vf", p:"Conviene crear un Pool nuevo en cada petición HTTP.",
  ok:false, why:"Un pool por proceso, creado al arrancar. Crear pools por petición agota las conexiones de PostgreSQL."}
]},

{
id:"nd4l2",
titulo:"ORMs y migraciones",
claves:["Prisma: esquema propio, cliente generado y tipado, migraciones","Drizzle: esquema en TypeScript, cercano a SQL","Migraciones versionadas y aplicadas en el despliegue, igual que Flyway"],
pasos:[
 {t:"info", eti:"Productividad", h:"Prisma y Drizzle",
  c:`<div class="termbox">// schema.prisma
model Tarea {
  id        Int      @id @default(autoincrement())
  titulo    String   @db.VarChar(200)
  hecha     Boolean  @default(false)
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId Int
  creadaEn  DateTime @default(now())
}

// uso, con tipos generados
const pendientes = await prisma.tarea.findMany({
  where: { hecha: false, usuarioId },
  orderBy: { creadaEn: "desc" },
  include: { usuario: true },
});</div>
     <div class="termbox">npx prisma migrate dev --name anadir_tareas    # crea y aplica una migracion en desarrollo
npx prisma migrate deploy                       # aplica las pendientes en produccion</div>`},
 {t:"par", p:"Empareja cada herramienta con su estilo",
  pares:[["pg (driver)","SQL a mano, control total"],["Prisma","Esquema declarativo, cliente generado y muy tipado"],["Drizzle","Esquema en TypeScript y consultas parecidas a SQL"],["TypeORM","Entidades con decoradores, estilo JPA"]],
  why:"Los mismos problemas de JPA existen aquí: N+1, consultas lentas generadas y la necesidad de mirar el SQL."},
 {t:"opcion", p:"¿Qué comando aplicarías en el pipeline de despliegue para ejecutar las migraciones pendientes de Prisma?",
  ops:["npx prisma migrate dev","npx prisma migrate deploy","npx prisma db push --force-reset","npx prisma studio"],
  ok:1, why:"migrate dev es para desarrollo (puede crear migraciones y resetear); deploy solo aplica las existentes."}
]},

{
id:"nd4l3",
titulo:"Redis y MongoDB",
claves:["Redis: estructuras en memoria para caché, sesiones, contadores y colas","Caché con TTL y el patrón cache-aside","MongoDB guarda documentos JSON; útil con esquemas variables, con sus propios compromisos"],
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

await redis.incr(\`visitas:\${hoy}\`);                       // contador atomico
await redis.set(\`bloqueo:informe\`, "1", { NX: true, EX: 60 }); // bloqueo simple</div>`},
 {t:"info", eti:"Documentos", h:"MongoDB",
  c:`<div class="termbox">const pedidos = db.collection("pedidos");
await pedidos.insertOne({ cliente: "ana", lineas: [{ sku: "TEC-01", cantidad: 1 }], total: 89.9 });
await pedidos.find({ cliente: "ana", total: { $gt: 50 } }).sort({ _id: -1 }).limit(10).toArray();
await pedidos.createIndex({ cliente: 1, _id: -1 });</div>
     <p>Cómodo cuando cada documento tiene una forma distinta o se lee entero. Para datos muy relacionados con transacciones complejas, una base relacional suele ser mejor elección.</p>`},
 {t:"par", p:"Empareja cada necesidad con la herramienta",
  pares:[["Caché de respuestas con caducidad","Redis con TTL"],["Contador de visitas concurrente","Redis INCR"],["Sesiones compartidas entre réplicas","Redis"],["Documentos con estructura variable","MongoDB"],["Transacciones entre muchas tablas relacionadas","PostgreSQL"]],
  why:"Cada almacén en lo que hace mejor."},
 {t:"vf", p:"Una caché sin TTL ni invalidación puede servir datos obsoletos indefinidamente.",
  ok:true, why:"Define siempre caducidad e invalida al escribir."}
]}

]});
