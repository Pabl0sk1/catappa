window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Crear tablas y modificar datos",
resumen: "Tipos de datos, CREATE TABLE, restricciones, INSERT, UPDATE, DELETE, ALTER TABLE y RETURNING",
nivel: "Fundamentos",
color: "#4f8fca",
lecciones: [

{
id:"sq3l1",
titulo:"Tipos de datos",
claves:["Enteros (integer, bigint), decimales exactos (numeric) y texto (text, varchar)","Fechas: date, timestamp y timestamptz (con zona horaria)","boolean, uuid y jsonb completan los más usados"],
pasos:[
 {t:"info", eti:"Elegir bien", h:"Los tipos más usados en PostgreSQL",
  c:`<div class="diag">integer        entero hasta ~2.100 millones
bigint         entero enorme (ids de tablas grandes)
numeric(10,2)  decimal EXACTO: dinero (10 digitos, 2 decimales)
real, double   decimal aproximado: medidas cientificas, NUNCA dinero
text           texto de cualquier longitud
varchar(100)   texto con longitud maxima
boolean        true / false
date           fecha: 2026-09-22
timestamptz    fecha y hora con zona horaria (la recomendada)
uuid           identificador universal: 3f1a...-...
jsonb          documento JSON indexable</div>`},
 {t:"opcion", p:"¿Qué tipo usarías para guardar el precio de un producto?",
  ops:["real","double precision","numeric(10,2)","text"],
  ok:2, why:"Los tipos de coma flotante acumulan errores de redondeo (0.1 + 0.2 ≠ 0.3). Para dinero, numeric (en Java, BigDecimal)."},
 {t:"par", p:"Empareja cada dato con su tipo adecuado",
  pares:[["Precio de un producto","numeric(10,2)"],["Momento en que se creó un pedido","timestamptz"],["Si un cliente está activo","boolean"],["Fecha de nacimiento","date"],["Identificador público no adivinable","uuid"]],
  why:"timestamptz guarda el instante real y lo muestra en la zona de la sesión: evita líos con horarios de verano y usuarios en varios países."},
 {t:"vf", p:"En PostgreSQL, <code>text</code> es menos eficiente que <code>varchar(255)</code>.",
  ok:false, why:"En PostgreSQL rinden igual. varchar(n) solo añade una comprobación de longitud máxima."}
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
                CHECK (estado IN ('pendiente','pagado','enviado','cancelado')),
    total       numeric(10,2) NOT NULL CHECK (total &gt;= 0)
);</div>`},
 {t:"par", p:"Empareja cada restricción con lo que garantiza",
  pares:[["PRIMARY KEY","Identificador único y no nulo de la fila"],["NOT NULL","La columna siempre tiene valor"],["UNIQUE","No se repite el valor en la tabla"],["CHECK","El valor cumple una condición"],["REFERENCES","El valor existe en otra tabla (clave foránea)"],["DEFAULT","Valor que se usa si no se indica ninguno"]],
  why:"Las restricciones son la última línea de defensa: protegen los datos aunque la aplicación tenga un bug."},
 {t:"hueco", p:"Completa para que el email sea obligatorio y no se repita",
  tpl:"email text ___ ___", banco:["NOT NULL","UNIQUE","DEFAULT","CHECK"], sol:["NOT NULL","UNIQUE"],
  why:"Dos restricciones sobre la misma columna. UNIQUE crea un índice automáticamente."},
 {t:"opcion", p:"Dos peticiones simultáneas registran el mismo email. La aplicación comprueba antes con un SELECT que no existe. ¿Qué evita realmente el duplicado?",
  ops:["El SELECT previo","La restricción UNIQUE en la base de datos","Un try/catch","El frontend"],
  ok:1, why:"Ambas peticiones pueden pasar el SELECT a la vez. Solo la restricción de la base de datos es atómica."},
 {t:"vf", p:"<code>GENERATED ALWAYS AS IDENTITY</code> hace que PostgreSQL genere el id automáticamente al insertar.",
  ok:true, why:"Es el estándar SQL moderno; sustituye al antiguo serial."}
]},

{
id:"sq3l3",
titulo:"INSERT",
claves:["INSERT INTO tabla (columnas) VALUES (valores)","Se pueden insertar varias filas en una sentencia","RETURNING devuelve lo insertado, por ejemplo el id generado"],
pasos:[
 {t:"info", eti:"Añadir filas", h:"INSERT",
  c:`<div class="termbox">INSERT INTO clientes (nombre, email, ciudad)
VALUES ('Ana Ruiz', 'ana@correo.com', 'Madrid');

<span class="cm">-- varias filas a la vez</span>
INSERT INTO productos (nombre, categoria, precio, stock) VALUES
  ('Teclado mecánico', 'perifericos', 89.90, 25),
  ('Ratón inalámbrico', 'perifericos', 24.50, 60);

<span class="cm">-- devolver el id generado</span>
INSERT INTO pedidos (cliente_id, total) VALUES (1, 45.90) RETURNING id;</div>
     <p>Las columnas que no indicas toman su <code>DEFAULT</code> (o NULL). Nombrar siempre las columnas hace el INSERT robusto frente a cambios en la tabla.</p>`},
 {t:"term", p:"Inserta un cliente con nombre <code>Luis Gómez</code>, email <code>luis@correo.com</code> y ciudad <code>Sevilla</code>",
  prompt:"tienda=#", sol:["insert into clientes (nombre, email, ciudad) values ('Luis Gómez', 'luis@correo.com', 'Sevilla');"],
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
     <p><code>EXCLUDED</code> es la fila que se intentaba insertar. Ideal para sincronizaciones y cargas repetibles.</p>`},
 {t:"vf", p:"<code>RETURNING id</code> permite obtener el id generado sin hacer un SELECT adicional.",
  ok:true, why:"Una sola ida y vuelta a la base de datos. Funciona también con UPDATE y DELETE."}
]},

{
id:"sq3l4",
titulo:"UPDATE y DELETE",
claves:["UPDATE tabla SET columna = valor WHERE condición","DELETE FROM tabla WHERE condición","Sin WHERE afectan a TODAS las filas: revisa antes con un SELECT"],
pasos:[
 {t:"info", eti:"Modificar", h:"UPDATE",
  c:`<div class="termbox">UPDATE productos SET precio = 79.90 WHERE id = 1;
UPDATE productos SET precio = precio * 0.9, actualizado_en = now()
WHERE categoria = 'perifericos';
UPDATE pedidos SET estado = 'enviado' WHERE id = 103 RETURNING *;</div>`},
 {t:"info", eti:"Borrar", h:"DELETE",
  c:`<div class="termbox">DELETE FROM pedidos WHERE estado = 'cancelado' AND fecha &lt; '2025-01-01';
TRUNCATE TABLE logs_temporales;     <span class="cm">-- vaciar una tabla entera, muy rapido</span></div>
     <p><b>La regla de oro</b>: antes de un UPDATE o DELETE, ejecuta un <code>SELECT</code> con el mismo WHERE y comprueba qué filas salen. Y en producción, hazlo dentro de una transacción (<code>BEGIN</code>) para poder deshacer.</p>`},
 {t:"term", p:"Pon el estado <code>pagado</code> al pedido con id 102",
  prompt:"tienda=#", sol:["update pedidos set estado = 'pagado' where id = 102;"],
  pista:"UPDATE pedidos SET estado = ... WHERE id = ...;",
  salida:`UPDATE 1`, why:"«UPDATE 1»: una fila modificada. Si ves «UPDATE 50000» cuando esperabas 1, algo va mal."},
 {t:"opcion", p:"Ejecutas <code>DELETE FROM clientes;</code> sin WHERE. ¿Qué pasa?",
  ops:["Error: falta WHERE","Se intentan borrar todos los clientes","Se borra el último","No hace nada"],
  ok:1, why:"SQL no pide confirmación. Por eso existen las transacciones, los backups y la costumbre de probar con SELECT primero."},
 {t:"vf", p:"<code>TRUNCATE</code> es más rápido que <code>DELETE</code> sin WHERE para vaciar una tabla grande.",
  ok:true, why:"No recorre fila a fila; libera el espacio de golpe. No se puede filtrar."}
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
ALTER TABLE clientes DROP COLUMN telefono;
ALTER TABLE productos ADD CONSTRAINT precio_positivo CHECK (precio &gt; 0);
DROP TABLE IF EXISTS tabla_vieja;</div>`},
 {t:"par", p:"Empareja cada orden con su efecto",
  pares:[["ADD COLUMN","Añadir una columna"],["RENAME COLUMN","Cambiar el nombre de una columna"],["DROP COLUMN","Eliminar una columna y sus datos"],["ADD CONSTRAINT","Añadir una regla a la tabla"],["DROP TABLE","Eliminar la tabla entera"]],
  why:"DROP no se puede deshacer fuera de una transacción: mucho cuidado."},
 {t:"info", eti:"En equipo", h:"Migraciones",
  c:`<p>En un proyecto real nadie ejecuta ALTER TABLE a mano en producción. Los cambios se escriben como <b>migraciones</b> numeradas y versionadas en Git, y una herramienta las aplica en orden:</p>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">src/main/resources/db/migration/</span></div><div class="rama" style="--n:1"><span class="nom">V1__crear_clientes.sql</span></div><div class="rama" style="--n:1"><span class="nom">V2__crear_pedidos.sql</span></div><div class="rama" style="--n:1"><span class="nom">V3__anadir_telefono.sql</span></div></div>
     <p>En Spring Boot, <b>Flyway</b> o <b>Liquibase</b> las ejecutan al arrancar. Todos los entornos quedan con la misma estructura.</p>`},
 {t:"opcion", p:"Añades <code>ALTER TABLE clientes ADD COLUMN telefono text NOT NULL;</code> en una tabla con datos. ¿Qué pasa?",
  ops:["Funciona","Falla: las filas existentes tendrían NULL en una columna NOT NULL. Hay que dar un DEFAULT o rellenar antes","Borra los clientes","Se ignora NOT NULL"],
  ok:1, why:"Patrón seguro: añadir la columna nullable, rellenarla y después poner NOT NULL (o añadirla con DEFAULT)."},
 {t:"vf", p:"Con Flyway, cada migración ya aplicada se modifica cuando hace falta cambiar algo.",
  ok:false, why:"Las migraciones aplicadas no se tocan (Flyway detecta el cambio por su checksum). Se crea una migración nueva."}
]}

]});
