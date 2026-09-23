window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Crear tablas y modificar datos",
resumen: "Tipos de datos, CREATE TABLE, restricciones, INSERT, upsert con ON CONFLICT, UPDATE, DELETE, MERGE, RETURNING, ALTER TABLE y DROP",
nivel: "Fundamentos",
color: "#4f8fca",
lecciones: [

{
id:"sq3l1",
titulo:"Tipos de datos",
claves:["Enteros (integer, bigint), decimales exactos (numeric) y texto (text, varchar)","Fechas: date, timestamp y timestamptz (con zona horaria)","boolean, uuid y jsonb completan los más usados"],
pasos:[
 {t:"info", eti:"Elegir bien", h:"Los tipos más usados en PostgreSQL",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tipos de datos más usados en postgresql</div><table class="dg-tabla"><tbody>
       <tr><td>integer</td><td>entero de 4 bytes, hasta ~2.100 millones</td></tr>
       <tr><td>bigint</td><td>entero de 8 bytes (ids de tablas que crecen)</td></tr>
       <tr><td>numeric(10,2)</td><td>decimal EXACTO: dinero (10 dígitos, 2 decimales)</td></tr>
       <tr><td>real, double precision</td><td>decimal aproximado: medidas científicas, NUNCA dinero</td></tr>
       <tr><td>text</td><td>texto de cualquier longitud</td></tr>
       <tr><td>varchar(100)</td><td>texto con longitud máxima</td></tr>
       <tr><td>boolean</td><td>true / false</td></tr>
       <tr><td>date</td><td>fecha: 2026-09-22</td></tr>
       <tr><td>timestamptz</td><td>instante con zona horaria (la recomendada)</td></tr>
       <tr><td>uuid</td><td>identificador universal: 3f1a...-...</td></tr>
       <tr><td>jsonb</td><td>documento JSON indexable</td></tr>
     </tbody></table></div>
     <p>Los tipos avanzados (arrays, rangos, enums, JSONB a fondo) tienen su propia unidad más adelante.</p>`},
 {t:"info", eti:"Trampas", h:"División entera, coma flotante y conversiones",
  c:`<div class="termbox">SELECT 7 / 2;                 <span class="cm">-- 3   (entero / entero = entero)</span>
SELECT 7 / 2.0;               <span class="cm">-- 3.5000000000000000 (numeric)</span>
SELECT 0.1::float8 + 0.2;     <span class="cm">-- 0.30000000000000004</span>
SELECT 0.1::numeric + 0.2;    <span class="cm">-- 0.3</span>
SELECT '42'::integer + 1;     <span class="cm">-- 43  (:: es el CAST de PostgreSQL)</span>
SELECT CAST('2026-09-22' AS date);</div>
     <p>Si calculas un porcentaje con dos enteros, el resultado se trunca: <code>3 / 4 * 100</code> da 0. Multiplica primero por <code>100.0</code> o convierte uno de los operandos.</p>`},
 {t:"opcion", p:"¿Qué tipo usarías para guardar el precio de un producto?",
  ops:["real","double precision","numeric(10,2)","text"],
  ok:2, why:"Los tipos de coma flotante acumulan errores de redondeo (0.1 + 0.2 ≠ 0.3). Para dinero, numeric (en Java, BigDecimal). Otra opción seria: un bigint con los céntimos."},
 {t:"par", p:"Empareja cada dato con su tipo adecuado",
  pares:[["Precio de un producto","numeric(10,2)"],["Momento en que se creó un pedido","timestamptz"],["Si un cliente está activo","boolean"],["Fecha de nacimiento","date"],["Identificador público no adivinable","uuid"]],
  why:"timestamptz guarda el instante real y lo muestra en la zona de la sesión: evita líos con horarios de verano y usuarios en varios países."},
 {t:"codigo", p:"Arregla la división: la media de 7 puntos entre 2 partidas debe dar 3.5",
  lenguaje:"sql",
  c:`<p>La plantilla divide dos enteros y obtiene 3. Cambia la expresión para que el resultado sea <code>3.5</code>, sin escribir el número a mano: convierte uno de los operandos (<code>7 / 2.0</code> o <code>CAST(7 AS REAL) / 2</code>).</p>
     <p>En PostgreSQL <code>7 / 2.0</code> da <code>3.5000000000000000</code> (numeric); aquí, en SQLite, <code>3.5</code>.</p>`,
  plantilla:`SELECT 7 / 2;
`,
  pruebas:[{salida:"3.5"}],
  pista:"Basta con que uno de los dos números sea decimal: 7 / 2.0",
  solucion:`SELECT 7 / 2.0;
`,
  why:"La división entera es un error silencioso clásico en informes: tasas de conversión que salen 0, medias que pierden decimales. PostgreSQL se comporta igual que SQLite."},
 {t:"opcion", p:"Guardas <code>creado_en</code> como <code>timestamp</code> (sin zona) y tienes servidores en Madrid y en Nueva York escribiendo con su hora local. ¿Qué problema aparece?",
  ops:["Ninguno","Los valores no dicen en qué zona están: ordenar o comparar eventos de ambos servidores da resultados falsos","Ocupa más espacio","No se pueden indexar"],
  ok:1, why:"timestamptz convierte a UTC al guardar y a la zona de la sesión al mostrar: el instante es inequívoco. Es el tipo recomendado para «cuándo pasó algo»."},
 {t:"vf", p:"En PostgreSQL, <code>text</code> es menos eficiente que <code>varchar(255)</code>.",
  ok:false, why:"En PostgreSQL rinden igual. varchar(n) solo añade una comprobación de longitud máxima. El 255 es una costumbre heredada de otros motores."}
]},

{
id:"sq3l2",
titulo:"CREATE TABLE y restricciones",
claves:["CREATE TABLE define columnas, tipos y restricciones","PRIMARY KEY, NOT NULL, UNIQUE, CHECK, DEFAULT y REFERENCES","generated always as identity para ids automáticos"],
pasos:[
 {t:"info", eti:"Definir", h:"Crear las tablas de la tienda",
  c:`<div class="termbox">CREATE TABLE clientes (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre     text        NOT NULL,
    email      text        NOT NULL UNIQUE,
    ciudad     text,
    creado_en  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pedidos (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id  bigint        NOT NULL REFERENCES clientes(id),
    fecha       date          NOT NULL DEFAULT current_date,
    estado      text          NOT NULL DEFAULT 'pendiente'
                CONSTRAINT pedidos_estado_valido
                CHECK (estado IN ('pendiente','pagado','enviado','cancelado')),
    total       numeric(10,2) NOT NULL CHECK (total &gt;= 0)
);</div>
     <p>Ponle <b>nombre</b> a las restricciones importantes (<code>CONSTRAINT pedidos_estado_valido</code>): el mensaje de error lo incluye y tu aplicación puede traducirlo a algo útil para el usuario.</p>`},
 {t:"par", p:"Empareja cada restricción con lo que garantiza",
  pares:[["PRIMARY KEY","Identificador único y no nulo de la fila"],["NOT NULL","La columna siempre tiene valor"],["UNIQUE","No se repite el valor en la tabla"],["CHECK","El valor cumple una condición"],["REFERENCES","El valor existe en otra tabla (clave foránea)"],["DEFAULT","Valor que se usa si no se indica ninguno"]],
  why:"Las restricciones son la última línea de defensa: protegen los datos aunque la aplicación tenga un bug."},
 {t:"hueco", p:"Completa para que el email sea obligatorio y no se repita",
  tpl:"email text ___ ___", banco:["NOT NULL","UNIQUE","DEFAULT","CHECK"], sol:["NOT NULL","UNIQUE"],
  why:"Dos restricciones sobre la misma columna. UNIQUE crea un índice automáticamente."},
 {t:"codigo", p:"Crea la tabla <code>socios</code> con sus restricciones",
  lenguaje:"sql",
  c:`<p>Completa el <code>CREATE TABLE</code> para que:</p>
     <ul><li><code>email</code> sea obligatorio y no se repita.</li>
     <li><code>edad</code> sea obligatoria y como mínimo 18.</li></ul>
     <p>La prueba intenta insertar filas incorrectas con <code>INSERT OR IGNORE</code> (en SQLite, se salta las filas que violan una restricción en vez de fallar) y cuenta cuántas entraron.</p>`,
  plantilla:`CREATE TABLE socios (
  id    INTEGER PRIMARY KEY,
  email TEXT,
  edad  INTEGER
);
`,
  pruebas:[
   {entrada:"INSERT OR IGNORE INTO socios (email, edad) VALUES ('ana@x.com', 30), ('ana@x.com', 41), (NULL, 20), ('luis@x.com', 15), ('marta@x.com', 18);\nSELECT id, email, edad FROM socios;", salida:"1|ana@x.com|30\n2|marta@x.com|18"},
   {entrada:"INSERT OR IGNORE INTO socios (email, edad) VALUES ('bea@x.com', NULL), ('iker@x.com', 17), ('iker@x.com', 60), ('BEA@x.com', 25);\nSELECT count(*) FROM socios;", salida:"2", oculta:true}],
  pista:"email TEXT NOT NULL UNIQUE, edad INTEGER NOT NULL CHECK (edad >= 18)",
  solucion:`CREATE TABLE socios (
  id    INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  edad  INTEGER NOT NULL CHECK (edad >= 18)
);
`,
  why:"Cinco intentos, dos filas válidas: email repetido, email nulo y menor de edad se quedan fuera. Ojo: 'BEA@x.com' y 'bea@x.com' son distintos para UNIQUE; para ignorar mayúsculas se usa un índice único sobre lower(email)."},
 {t:"opcion", p:"Dos peticiones simultáneas registran el mismo email. La aplicación comprueba antes con un SELECT que no existe. ¿Qué evita realmente el duplicado?",
  ops:["El SELECT previo","La restricción UNIQUE en la base de datos","Un try/catch","El frontend"],
  ok:1, why:"Ambas peticiones pueden pasar el SELECT a la vez. Solo la restricción de la base de datos es atómica."},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>GENERATED ALWAYS AS IDENTITY</code> y <code>GENERATED BY DEFAULT AS IDENTITY</code>?",
  ops:["Ninguna","ALWAYS rechaza que insertes un id a mano (salvo OVERRIDING SYSTEM VALUE); BY DEFAULT lo permite","BY DEFAULT no genera ids","ALWAYS usa UUID"],
  ok:1, why:"ALWAYS protege contra ids escritos a mano que luego chocan con la secuencia. BY DEFAULT es útil al migrar datos que ya traen su id."},
 {t:"vf", p:"<code>GENERATED ALWAYS AS IDENTITY</code> hace que PostgreSQL genere el id automáticamente al insertar.",
  ok:true, why:"Es el estándar SQL moderno; sustituye al antiguo serial, que sigue funcionando pero ya no se recomienda."}
]},

{
id:"sq3l3",
titulo:"INSERT y upsert",
claves:["INSERT INTO tabla (columnas) VALUES (valores)","Se pueden insertar varias filas en una sentencia, o el resultado de un SELECT","ON CONFLICT hace upsert; RETURNING devuelve lo insertado"],
pasos:[
 {t:"info", eti:"Añadir filas", h:"INSERT",
  c:`<div class="termbox">INSERT INTO clientes (nombre, email, ciudad)
VALUES ('Ana Ruiz', 'ana@correo.com', 'Madrid');

<span class="cm">-- varias filas a la vez</span>
INSERT INTO productos (nombre, categoria, precio, stock) VALUES
  ('Teclado mecánico', 'perifericos', 89.90, 25),
  ('Ratón inalámbrico', 'perifericos', 24.90, 60);

<span class="cm">-- copiar el resultado de una consulta</span>
INSERT INTO clientes_archivo (id, nombre, email)
SELECT id, nombre, email FROM clientes WHERE activo = false;

<span class="cm">-- devolver el id generado</span>
INSERT INTO pedidos (cliente_id, total) VALUES (1, 45.90) RETURNING id;</div>
     <p>Las columnas que no indicas toman su <code>DEFAULT</code> (o NULL). Nombrar siempre las columnas hace el INSERT robusto frente a cambios en la tabla. Para cargas masivas (millones de filas), <code>COPY</code> es mucho más rápido que INSERT.</p>`},
 {t:"term", p:"Inserta un cliente con nombre <code>Luis Gómez</code>, email <code>luis@correo.com</code> y ciudad <code>Sevilla</code>",
  prompt:"tienda=#", sol:["insert into clientes (nombre, email, ciudad) values ('Luis Gómez', 'luis@correo.com', 'Sevilla');","insert into clientes(nombre,email,ciudad) values('Luis Gómez','luis@correo.com','Sevilla')"],
  pista:"INSERT INTO clientes (nombre, email, ciudad) VALUES (...);",
  salida:`INSERT 0 1`, why:"«INSERT 0 1» significa que se insertó 1 fila."},
 {t:"opcion", p:"Insertas un cliente con un email que ya existe y la columna es UNIQUE. ¿Qué pasa?",
  ops:["Se sobrescribe el anterior","Error: duplicate key value violates unique constraint","Se inserta duplicado","Se ignora sin aviso"],
  ok:1, why:"Si quieres «insertar o actualizar», PostgreSQL tiene INSERT ... ON CONFLICT (email) DO UPDATE (upsert)."},
 {t:"info", eti:"Upsert", h:"ON CONFLICT",
  c:`<div class="termbox">INSERT INTO productos (sku, nombre, precio) VALUES ('TEC-01', 'Teclado', 84.90)
ON CONFLICT (sku) DO UPDATE SET precio = EXCLUDED.precio;

INSERT INTO visitas (pagina) VALUES ('/inicio')
ON CONFLICT DO NOTHING;</div>
     <p><code>EXCLUDED</code> es la fila que se intentaba insertar. Ideal para sincronizaciones y cargas repetibles (idempotentes). El conflicto se detecta por una restricción UNIQUE o PRIMARY KEY concreta, y es seguro con peticiones simultáneas, al contrario que «SELECT y luego INSERT o UPDATE».</p>
     <div class="nota"><b class="tit">Detalle de PostgreSQL</b>Un INSERT que falla o acaba en DO NOTHING consume igualmente un valor de la secuencia del id: los huecos en los ids son normales y no significan que se haya borrado nada.</div>`},
 {t:"codigo", p:"Sincroniza el catálogo con un upsert",
  lenguaje:"sql",
  c:`<p>Llega el catálogo del proveedor con dos filas: <code>('TEC-01','Teclado',84.9)</code>, que ya existe con otro precio, y <code>('MON-27','Monitor 27',239)</code>, que es nueva.</p>
     <p>Escribe <b>un solo INSERT</b> con <code>ON CONFLICT (sku) DO UPDATE</code> que inserte la nueva y actualice el precio de la existente. La plantilla ya muestra el catálogo al final.</p>
     <p>SQLite usa la misma sintaxis que PostgreSQL; <code>excluded</code> puede ir en minúsculas.</p>`,
  plantilla:`CREATE TABLE productos (sku TEXT PRIMARY KEY, nombre TEXT NOT NULL, precio REAL NOT NULL);
INSERT INTO productos VALUES ('TEC-01','Teclado',89.9), ('RAT-01','Ratón',24.9);

-- tu upsert aquí

SELECT sku, nombre, precio FROM productos ORDER BY sku;
`,
  pruebas:[{salida:"MON-27|Monitor 27|239.0\nRAT-01|Ratón|24.9\nTEC-01|Teclado|84.9"}],
  pista:"INSERT INTO productos (sku, nombre, precio) VALUES (...), (...) ON CONFLICT (sku) DO UPDATE SET precio = excluded.precio;",
  solucion:`CREATE TABLE productos (sku TEXT PRIMARY KEY, nombre TEXT NOT NULL, precio REAL NOT NULL);
INSERT INTO productos VALUES ('TEC-01','Teclado',89.9), ('RAT-01','Ratón',24.9);

INSERT INTO productos (sku, nombre, precio) VALUES ('TEC-01','Teclado',84.9), ('MON-27','Monitor 27',239)
ON CONFLICT (sku) DO UPDATE SET precio = excluded.precio;

SELECT sku, nombre, precio FROM productos ORDER BY sku;
`,
  why:"Puedes ejecutar este upsert diez veces y el resultado es el mismo: es idempotente, justo lo que necesita un proceso de sincronización que puede reintentarse."},
 {t:"hueco", p:"Completa el upsert que actualiza el stock con el valor que se intentaba insertar",
  tpl:"INSERT INTO stock (sku, uds) VALUES ('TEC-01', 30)\nON ___ (sku) DO UPDATE SET uds = ___.uds;", banco:["CONFLICT","EXCLUDED","ERROR","NEW","DUPLICATE"], sol:["CONFLICT","EXCLUDED"],
  why:"ON DUPLICATE KEY UPDATE es la sintaxis de MySQL; en PostgreSQL es ON CONFLICT ... DO UPDATE con EXCLUDED."},
 {t:"vf", p:"<code>RETURNING id</code> permite obtener el id generado sin hacer un SELECT adicional.",
  ok:true, why:"Una sola ida y vuelta a la base de datos. Funciona también con UPDATE, DELETE y MERGE."}
]},

{
id:"sq3l4",
titulo:"UPDATE, DELETE y MERGE",
claves:["UPDATE tabla SET columna = valor WHERE condición; DELETE FROM tabla WHERE condición","Sin WHERE afectan a TODAS las filas: revisa antes con un SELECT","UPDATE ... FROM y MERGE actualizan a partir de otra tabla"],
pasos:[
 {t:"info", eti:"Modificar", h:"UPDATE",
  c:`<div class="termbox">UPDATE productos SET precio = 79.90 WHERE id = 1;
UPDATE productos SET precio = precio * 0.9, actualizado_en = now()
WHERE categoria = 'perifericos';

<span class="cm">-- PostgreSQL 18: RETURNING puede devolver el valor anterior y el nuevo</span>
UPDATE productos SET precio = precio * 0.9 WHERE id = 1
RETURNING old.precio AS antes, new.precio AS despues;

<span class="cm">-- actualizar a partir de otra tabla</span>
UPDATE productos p SET stock = p.stock - v.unidades
FROM ventas_hoy v WHERE v.producto_id = p.id;</div>`},
 {t:"info", eti:"Borrar", h:"DELETE, TRUNCATE y MERGE",
  c:`<div class="termbox">DELETE FROM pedidos WHERE estado = 'cancelado' AND fecha &lt; '2025-01-01';
TRUNCATE TABLE logs_temporales;     <span class="cm">-- vaciar una tabla entera, muy rápido</span>

<span class="cm">-- MERGE (PostgreSQL 15+): insertar, actualizar o borrar según coincida</span>
MERGE INTO stock s
USING entradas e ON s.sku = e.sku
WHEN MATCHED THEN UPDATE SET uds = s.uds + e.uds
WHEN NOT MATCHED THEN INSERT (sku, uds) VALUES (e.sku, e.uds);</div>
     <p><b>La regla de oro</b>: antes de un UPDATE o DELETE, ejecuta un <code>SELECT</code> con el mismo WHERE y comprueba qué filas salen. Y en producción, hazlo dentro de una transacción (<code>BEGIN</code>) para poder deshacer.</p>`},
 {t:"term", p:"Pon el estado <code>pagado</code> al pedido con id 102",
  prompt:"tienda=#", sol:["update pedidos set estado = 'pagado' where id = 102;","update pedidos set estado='pagado' where id=102"],
  pista:"UPDATE pedidos SET estado = ... WHERE id = ...;",
  salida:`UPDATE 1`, why:"«UPDATE 1»: una fila modificada. Si ves «UPDATE 50000» cuando esperabas 1, algo va mal."},
 {t:"codigo", p:"Aplica las ventas del día al stock y retira lo que se ha agotado",
  lenguaje:"sql",
  c:`<p>Dos sentencias antes del SELECT final:</p>
     <ol><li>Resta al <code>stock</code> de cada producto las <code>unidades</code> vendidas hoy (tabla <code>ventas_hoy</code>) con <code>UPDATE ... FROM</code>.</li>
     <li>Borra los productos que se hayan quedado con stock 0.</li></ol>
     <p><code>UPDATE ... FROM</code> funciona igual en PostgreSQL y en SQLite (desde la 3.33).</p>`,
  plantilla:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, stock INTEGER);
CREATE TABLE ventas_hoy (producto_id INTEGER, unidades INTEGER);
INSERT INTO productos VALUES (1,'Teclado',25), (2,'Ratón',3), (3,'Monitor',12), (4,'Webcam',7);
INSERT INTO ventas_hoy VALUES (1,5), (2,3), (4,1);

-- 1) resta las ventas  2) borra los agotados

SELECT id, nombre, stock FROM productos ORDER BY id;
`,
  pruebas:[{salida:"1|Teclado|20\n3|Monitor|12\n4|Webcam|6"}],
  pista:"UPDATE productos SET stock = stock - v.unidades FROM ventas_hoy v WHERE v.producto_id = productos.id; y luego DELETE FROM productos WHERE stock = 0;",
  solucion:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, stock INTEGER);
CREATE TABLE ventas_hoy (producto_id INTEGER, unidades INTEGER);
INSERT INTO productos VALUES (1,'Teclado',25), (2,'Ratón',3), (3,'Monitor',12), (4,'Webcam',7);
INSERT INTO ventas_hoy VALUES (1,5), (2,3), (4,1);

UPDATE productos SET stock = stock - v.unidades
FROM ventas_hoy v
WHERE v.producto_id = productos.id;

DELETE FROM productos WHERE stock = 0;

SELECT id, nombre, stock FROM productos ORDER BY id;
`,
  why:"El monitor no tenía ventas: el UPDATE ... FROM solo toca las filas que encuentran pareja. Ojo: si un producto tuviera dos filas en ventas_hoy, solo se aplicaría una; se agrega antes con SUM en una subconsulta."},
 {t:"opcion", p:"Ejecutas <code>DELETE FROM clientes;</code> sin WHERE. ¿Qué pasa?",
  ops:["Error: falta WHERE","Se intentan borrar todos los clientes","Se borra el último","No hace nada"],
  ok:1, why:"SQL no pide confirmación. Por eso existen las transacciones, los backups y la costumbre de probar con SELECT primero."},
 {t:"opcion", p:"Tienes una tabla de entradas de almacén y quieres, en una sola sentencia, sumar unidades a los SKU que ya existen e insertar los nuevos. ¿Qué orden de PostgreSQL está pensada para eso?",
  ops:["UPSERT","MERGE","REPLACE","UPDATE OR INSERT"],
  ok:1, why:"MERGE (estándar SQL, PostgreSQL 15+) compara con otra tabla y decide por fila. INSERT ... ON CONFLICT sigue siendo lo más cómodo para una fila o un lote de VALUES."},
 {t:"vf", p:"<code>TRUNCATE</code> es más rápido que <code>DELETE</code> sin WHERE para vaciar una tabla grande.",
  ok:true, why:"No recorre fila a fila; libera el espacio de golpe. No se puede filtrar y necesita un bloqueo exclusivo de la tabla, aunque en PostgreSQL sí puede deshacerse dentro de una transacción."}
]},

{
id:"sq3l5",
titulo:"ALTER TABLE y DROP",
claves:["ALTER TABLE añade, renombra o elimina columnas y restricciones","DROP TABLE borra la tabla con sus datos","En producción, los cambios de estructura se hacen con migraciones versionadas"],
pasos:[
 {t:"info", eti:"Cambiar la estructura", h:"ALTER TABLE",
  c:`<div class="termbox">ALTER TABLE clientes ADD COLUMN telefono text;
ALTER TABLE clientes RENAME COLUMN ciudad TO localidad;
ALTER TABLE clientes ALTER COLUMN telefono SET NOT NULL;
ALTER TABLE clientes ALTER COLUMN telefono TYPE varchar(20);
ALTER TABLE clientes DROP COLUMN telefono;
ALTER TABLE productos ADD CONSTRAINT precio_positivo CHECK (precio &gt; 0);
DROP TABLE IF EXISTS tabla_vieja;</div>
     <p>Algunos ALTER son instantáneos (añadir una columna nullable, o con un DEFAULT constante desde PostgreSQL 11) y otros <b>reescriben la tabla entera</b> con un bloqueo exclusivo (cambiar el tipo de una columna, casi siempre). En una tabla de 200 GB eso es una caída.</p>`},
 {t:"par", p:"Empareja cada orden con su efecto",
  pares:[["ADD COLUMN","Añadir una columna"],["RENAME COLUMN","Cambiar el nombre de una columna"],["DROP COLUMN","Eliminar una columna y sus datos"],["ADD CONSTRAINT","Añadir una regla a la tabla"],["DROP TABLE","Eliminar la tabla entera"]],
  why:"DROP no se puede deshacer fuera de una transacción: mucho cuidado."},
 {t:"info", eti:"En equipo", h:"Migraciones",
  c:`<p>En un proyecto real nadie ejecuta ALTER TABLE a mano en producción. Los cambios se escriben como <b>migraciones</b> numeradas y versionadas en Git, y una herramienta las aplica en orden:</p>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">src/main/resources/db/migration/</span></div><div class="rama" style="--n:1"><span class="nom">V1__crear_clientes.sql</span></div><div class="rama" style="--n:1"><span class="nom">V2__crear_pedidos.sql</span></div><div class="rama" style="--n:1"><span class="nom">V3__anadir_telefono.sql</span></div></div>
     <p>En Spring Boot, <b>Flyway</b> o <b>Liquibase</b> las ejecutan al arrancar; en otros ecosistemas, Alembic, Prisma Migrate, golang-migrate o Sqitch. Todos los entornos quedan con la misma estructura. Cómo hacerlo sin parar el servicio lo verás en la unidad de la aplicación.</p>`},
 {t:"codigo", p:"Escribe la migración V3: teléfono nuevo y ciudad renombrada",
  lenguaje:"sql",
  c:`<p>Escribe dos <code>ALTER TABLE</code> sobre <code>clientes</code>:</p>
     <ol><li>Añade la columna <code>telefono</code> de tipo TEXT.</li>
     <li>Renombra <code>ciudad</code> a <code>localidad</code>.</li></ol>
     <p>La prueba lista las columnas resultantes con <code>pragma_table_info</code> (el equivalente en SQLite de <code>\\d clientes</code>).</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT);
INSERT INTO clientes (nombre, ciudad) VALUES ('Ana Ruiz', 'Madrid');

-- V3__telefono_y_localidad.sql
`,
  pruebas:[
   {entrada:"SELECT group_concat(name, ',') FROM pragma_table_info('clientes');", salida:"id,nombre,localidad,telefono"},
   {entrada:"SELECT nombre, localidad, coalesce(telefono, '-') FROM clientes;", salida:"Ana Ruiz|Madrid|-", oculta:true}],
  pista:"ALTER TABLE clientes ADD COLUMN telefono TEXT; ALTER TABLE clientes RENAME COLUMN ciudad TO localidad;",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT);
INSERT INTO clientes (nombre, ciudad) VALUES ('Ana Ruiz', 'Madrid');

ALTER TABLE clientes ADD COLUMN telefono TEXT;
ALTER TABLE clientes RENAME COLUMN ciudad TO localidad;
`,
  why:"Los datos de Ana siguen ahí: RENAME solo cambia el nombre. Las filas existentes reciben NULL en la columna nueva, que es por lo que añadirla como NOT NULL sin DEFAULT fallaría."},
 {t:"opcion", p:"Añades <code>ALTER TABLE clientes ADD COLUMN telefono text NOT NULL;</code> en una tabla con datos. ¿Qué pasa?",
  ops:["Funciona","Falla: las filas existentes tendrían NULL en una columna NOT NULL. Hay que dar un DEFAULT o rellenar antes","Borra los clientes","Se ignora NOT NULL"],
  ok:1, why:"Patrón seguro: añadir la columna nullable, rellenarla y después poner NOT NULL (o añadirla con DEFAULT)."},
 {t:"opcion", p:"Quieres eliminar la tabla <code>categorias</code>, pero <code>productos</code> tiene una clave foránea que la referencia. ¿Qué hace <code>DROP TABLE categorias CASCADE</code>?",
  ops:["Borra también la tabla productos","Borra categorias y elimina la restricción de clave foránea de productos, sin borrar sus filas","Falla siempre","Borra solo las filas de categorias"],
  ok:1, why:"CASCADE elimina los objetos que dependen de la tabla (claves foráneas, vistas), no las tablas que la referencian. Aun así, úsalo sabiendo qué se va a llevar por delante."},
 {t:"vf", p:"Con Flyway, cada migración ya aplicada se modifica cuando hace falta cambiar algo.",
  ok:false, why:"Las migraciones aplicadas no se tocan (Flyway detecta el cambio por su checksum). Se crea una migración nueva."}
]}

]});
