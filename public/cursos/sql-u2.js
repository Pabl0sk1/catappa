window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Consultar datos con SELECT",
resumen: "SELECT y FROM, alias y expresiones, filtrar con WHERE, ordenar, limitar y paginar, LIKE, IN, BETWEEN, DISTINCT y el valor NULL",
nivel: "Fundamentos",
color: "#5b9bd5",
lecciones: [

{
id:"sq2l1",
titulo:"SELECT y FROM",
claves:["SELECT columnas FROM tabla: la consulta más básica","SELECT * trae todas las columnas; en código real, mejor nombrarlas","AS pone alias a columnas y tablas"],
pasos:[
 {t:"info", eti:"La consulta básica", h:"Pedir columnas de una tabla",
  c:`<div class="termbox">SELECT nombre, precio FROM productos;

      nombre       | precio
-------------------+--------
 Teclado mecánico  |  89.90
 Ratón inalámbrico |  24.90
 Monitor 27        | 239.00
(3 rows)</div>
     <ul><li><code>SELECT</code>: qué columnas quieres.</li>
     <li><code>FROM</code>: de qué tabla.</li></ul>
     <p><code>SELECT *</code> trae todas. Es cómodo para explorar, pero en el código de una aplicación conviene nombrar las columnas: si alguien añade una columna pesada, no la arrastras sin querer.</p>`},
 {t:"term", p:"Muestra el nombre y el email de todos los clientes",
  prompt:"tienda=#", sol:["select nombre, email from clientes;","select nombre,email from clientes","select c.nombre, c.email from clientes c;"],
  pista:"SELECT las dos columnas separadas por coma FROM la tabla.",
  salida:`    nombre    |       email
--------------+-------------------
 Ana Ruiz     | ana@correo.com
 Luis Gómez   | luis@correo.com
 Marta López  | marta@correo.com
(3 rows)`, why:"Las columnas salen en el orden en que las pides."},
 {t:"info", eti:"Renombrar y calcular", h:"Alias y expresiones",
  c:`<div class="termbox">SELECT nombre,
       precio,
       precio * 1.21 AS precio_con_iva,
       round(precio * 1.21, 2) AS "PVP redondeado"
FROM productos AS p;</div>
     <p>Puedes calcular en el SELECT, y <code>AS</code> da un nombre (alias) a la columna resultante. También se usa con tablas: <code>FROM productos AS p</code> (o simplemente <code>FROM productos p</code>).</p>
     <p>Los identificadores sin comillas se pasan a <b>minúsculas</b> en PostgreSQL: <code>Precio</code> y <code>precio</code> son lo mismo. Si un alias lleva espacios o mayúsculas que quieras conservar, va entre <b>comillas dobles</b>. Consejo: evítalo en nombres de tablas y columnas, obliga a entrecomillar siempre.</p>`},
 {t:"hueco", p:"Completa para mostrar el precio con un alias llamado <code>importe</code>",
  tpl:"SELECT nombre, precio ___ importe FROM productos;", banco:["AS","IS","TO","="], sol:["AS"],
  why:"AS asigna el alias. En PostgreSQL se puede omitir, pero ponerlo es más claro."},
 {t:"codigo", p:"Muestra el nombre de cada producto y su precio con IVA (21%) redondeado a 2 decimales",
  lenguaje:"sql",
  c:`<p>Dos columnas: <code>nombre</code> y <code>round(precio * 1.21, 2)</code> con el alias <code>con_iva</code>. Sin filtrar ni ordenar.</p>
     <div class="nota ojo"><b class="tit">SQLite y el dinero</b>Aquí <code>precio</code> es REAL (coma flotante) porque SQLite no tiene decimal exacto. En PostgreSQL el precio sería <code>numeric(10,2)</code> y el redondeo, exacto.</div>`,
  plantilla:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, categoria TEXT NOT NULL, precio REAL NOT NULL, stock INTEGER NOT NULL);
INSERT INTO productos VALUES
 (1,'Teclado mecánico','perifericos',89.9,25),(2,'Ratón inalámbrico','perifericos',24.9,60),
 (3,'Monitor 27','monitores',239,12),(4,'Webcam HD','perifericos',45,0);

-- nombre y precio con IVA
`,
  pruebas:[{salida:"Teclado mecánico|108.78\nRatón inalámbrico|30.13\nMonitor 27|289.19\nWebcam HD|54.45"}],
  pista:"SELECT nombre, round(precio * 1.21, 2) AS con_iva FROM productos;",
  solucion:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, categoria TEXT NOT NULL, precio REAL NOT NULL, stock INTEGER NOT NULL);
INSERT INTO productos VALUES
 (1,'Teclado mecánico','perifericos',89.9,25),(2,'Ratón inalámbrico','perifericos',24.9,60),
 (3,'Monitor 27','monitores',239,12),(4,'Webcam HD','perifericos',45,0);

SELECT nombre, round(precio * 1.21, 2) AS con_iva FROM productos;
`,
  why:"Las expresiones del SELECT se calculan fila a fila. El alias no cambia el resultado, pero da nombre a la columna para quien lo lea (y para tu código, que la leerá por nombre)."},
 {t:"opcion", p:"Escribes <code>SELECT precio AS Precio Final FROM productos;</code> y da error. ¿Cómo se arregla?",
  ops:["Con comillas simples: AS 'Precio Final'","Con comillas dobles: AS \"Precio Final\", o mejor un alias sin espacios como precio_final","Quitando el AS","Escribiendo todo en mayúsculas"],
  ok:1, why:"Las comillas simples son para valores de texto; las dobles, para identificadores. Lo más cómodo a largo plazo: snake_case en minúsculas."},
 {t:"vf", p:"<code>SELECT *</code> es la mejor práctica en el código de una aplicación en producción.",
  ok:false, why:"Mejor listar las columnas: más claro, más eficiente (no arrastra columnas grandes) y no se rompe si cambia la tabla."}
]},

{
id:"sq2l2",
titulo:"Filtrar con WHERE",
claves:["WHERE se queda solo con las filas que cumplen la condición","Operadores: =, &lt;&gt;, &lt;, &gt;, &lt;=, &gt;=","Combinar con AND, OR y NOT; paréntesis para agrupar"],
pasos:[
 {t:"info", eti:"Filtrar", h:"WHERE",
  c:`<div class="termbox">SELECT nombre, precio FROM productos WHERE precio &lt; 50;
SELECT * FROM clientes WHERE ciudad = 'Madrid';
SELECT * FROM pedidos WHERE estado &lt;&gt; 'cancelado';</div>
     <ul><li>Los textos y las fechas van entre <b>comillas simples</b>: <code>'Madrid'</code>, <code>'2026-09-01'</code>. Si el texto lleva un apóstrofo, se duplica: <code>'O''Brien'</code>.</li>
     <li><code>&lt;&gt;</code> (o <code>!=</code>) significa «distinto de».</li>
     <li>La comparación de textos distingue mayúsculas: <code>'madrid'</code> no es <code>'Madrid'</code>.</li></ul>`},
 {t:"info", eti:"Combinar", h:"AND, OR y NOT",
  c:`<div class="termbox">SELECT * FROM productos
WHERE categoria = 'perifericos' AND precio &lt; 50;

SELECT * FROM clientes
WHERE ciudad = 'Madrid' OR ciudad = 'Sevilla';

SELECT * FROM productos
WHERE categoria = 'monitores' AND (precio &lt; 200 OR stock &gt; 10);

SELECT * FROM productos WHERE NOT (stock &gt; 0);</div>
     <p>Precedencia: primero <code>NOT</code>, luego <code>AND</code>, luego <code>OR</code>. Ante la duda, <b>paréntesis</b>: cuestan poco y evitan bugs que devuelven filas de más.</p>`},
 {t:"term", p:"Muestra todas las columnas de los productos con precio mayor que 100",
  prompt:"tienda=#", sol:["select * from productos where precio > 100;","select * from productos where precio>100","select * from productos where 100 < precio;"],
  pista:"SELECT * FROM productos WHERE y la condición.",
  salida:` id |   nombre   |  categoria | precio | stock
----+------------+------------+--------+-------
  3 | Monitor 27 | monitores  | 239.00 |    12
  6 | Monitor 24 | monitores  | 149.00 |     5
  7 | Silla ergo | mobiliario | 199.00 |     4
(3 rows)`, why:"WHERE se evalúa fila a fila y solo pasan las que cumplen."},
 {t:"codigo", p:"Muestra nombre y precio de los periféricos que cuestan menos de 50 y tienen stock",
  lenguaje:"sql",
  c:`<p>Tres condiciones a la vez: <code>categoria = 'perifericos'</code>, precio menor que 50 y <code>stock &gt; 0</code>. Ordena por <code>id</code> para que la salida sea estable (<code>ORDER BY id</code>, lo verás en la próxima lección).</p>`,
  plantilla:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, categoria TEXT NOT NULL, precio REAL NOT NULL, stock INTEGER NOT NULL);
INSERT INTO productos VALUES
 (1,'Teclado mecánico','perifericos',89.9,25),(2,'Ratón inalámbrico','perifericos',24.9,60),
 (3,'Monitor 27','monitores',239,12),(4,'Webcam HD','perifericos',45,0),
 (5,'Alfombrilla','perifericos',9.5,100),(6,'Monitor 24','monitores',149,5);

-- periféricos baratos y con stock
`,
  pruebas:[{salida:"Ratón inalámbrico|24.9\nAlfombrilla|9.5"}],
  pista:"WHERE categoria = 'perifericos' AND precio < 50 AND stock > 0 ORDER BY id",
  solucion:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, categoria TEXT NOT NULL, precio REAL NOT NULL, stock INTEGER NOT NULL);
INSERT INTO productos VALUES
 (1,'Teclado mecánico','perifericos',89.9,25),(2,'Ratón inalámbrico','perifericos',24.9,60),
 (3,'Monitor 27','monitores',239,12),(4,'Webcam HD','perifericos',45,0),
 (5,'Alfombrilla','perifericos',9.5,100),(6,'Monitor 24','monitores',149,5);

SELECT nombre, precio FROM productos
WHERE categoria = 'perifericos' AND precio < 50 AND stock > 0
ORDER BY id;
`,
  why:"La webcam cuesta menos de 50 pero no tiene stock: el AND exige que se cumplan todas las condiciones."},
 {t:"opcion", p:"¿Qué devuelve <code>WHERE ciudad = 'Madrid' OR ciudad = 'Sevilla' AND activo = true</code>?",
  ops:["Clientes activos de Madrid o de Sevilla","Todos los de Madrid (activos o no) y los activos de Sevilla","Nada","Error de sintaxis"],
  ok:1, why:"AND va antes: se lee como Madrid OR (Sevilla AND activo). Con paréntesis: (Madrid OR Sevilla) AND activo."},
 {t:"escribe", p:"Además de <code>!=</code>, ¿qué operador de SQL estándar significa «distinto de»?",
  sol:["<>","&lt;&gt;"], pista:"Menor que y mayor que, juntos.",
  why:"Los dos funcionan en PostgreSQL; <> es el del estándar SQL."},
 {t:"vf", p:"En SQL, los textos se escriben entre comillas dobles: <code>WHERE ciudad = \"Madrid\"</code>.",
  ok:false, why:"Comillas simples para textos. Las dobles son para nombres de columnas o tablas con mayúsculas o espacios: PostgreSQL buscaría una columna llamada Madrid."}
]},

{
id:"sq2l3",
titulo:"Ordenar, limitar y paginar",
claves:["ORDER BY columna ASC o DESC, con NULLS FIRST o NULLS LAST","Se puede ordenar por varias columnas; desempata siempre con algo único","LIMIT y OFFSET para paginar; en tablas grandes, paginación por clave"],
pasos:[
 {t:"info", eti:"Orden", h:"ORDER BY",
  c:`<div class="termbox">SELECT nombre, precio FROM productos ORDER BY precio;          <span class="cm">-- de menor a mayor (ASC por defecto)</span>
SELECT nombre, precio FROM productos ORDER BY precio DESC;     <span class="cm">-- de mayor a menor</span>
SELECT * FROM clientes ORDER BY ciudad, nombre;               <span class="cm">-- por ciudad y, dentro, por nombre</span>
SELECT * FROM clientes ORDER BY telefono NULLS FIRST;         <span class="cm">-- dónde van los NULL</span></div>
     <p>Los comentarios en SQL empiezan por <code>--</code>. En PostgreSQL los NULL van <b>al final</b> en orden ascendente (como si fueran el valor más grande) y al principio en descendente. SQLite hace justo lo contrario, por eso conviene decirlo con <code>NULLS FIRST</code> o <code>NULLS LAST</code> cuando importa.</p>`},
 {t:"info", eti:"Cuántas", h:"LIMIT, OFFSET y paginación por clave",
  c:`<div class="termbox">SELECT nombre, precio FROM productos ORDER BY precio DESC LIMIT 3;   <span class="cm">-- los 3 más caros</span>
SELECT nombre, precio FROM productos ORDER BY precio DESC
FETCH FIRST 3 ROWS ONLY;                                             <span class="cm">-- lo mismo, en SQL estándar</span>

<span class="cm">-- paginación: 20 por página, página 3</span>
SELECT * FROM pedidos ORDER BY fecha DESC, id DESC LIMIT 20 OFFSET 40;

<span class="cm">-- paginación por clave (keyset): «dame los 20 siguientes al último que vi»</span>
SELECT * FROM pedidos
WHERE (fecha, id) &lt; ('2026-09-03', 102)
ORDER BY fecha DESC, id DESC LIMIT 20;</div>
     <p>Sin ORDER BY, LIMIT devuelve filas «cualesquiera». Para paginar, ordena siempre por algo <b>único y estable</b>: si dos pedidos tienen la misma fecha y no desempatas por id, pueden repetirse o saltarse entre páginas.</p>`},
 {t:"term", p:"Muestra nombre y precio de los 5 productos más caros",
  prompt:"tienda=#", sol:["select nombre, precio from productos order by precio desc limit 5;","select nombre, precio from productos order by precio desc fetch first 5 rows only;"],
  pista:"ORDER BY precio DESC y LIMIT 5.",
  salida:`     nombre       | precio
------------------+--------
 Monitor 27       | 239.00
 Silla ergo       | 199.00
 Monitor 24       | 149.00
 Teclado mecánico |  89.90
 Auriculares      |  59.00
(5 rows)`, why:"El «top N» es una de las consultas más habituales."},
 {t:"codigo", p:"Página 2 del catálogo: productos ordenados por precio ascendente, 3 por página",
  lenguaje:"sql",
  c:`<p>Muestra <code>nombre</code> y <code>precio</code> de la <b>segunda página</b> (filas 4 a 6) ordenando por precio de menor a mayor. Dos productos cuestan lo mismo: desempata por <code>id</code> para que la paginación sea estable.</p>`,
  plantilla:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, precio REAL NOT NULL);
INSERT INTO productos VALUES
 (1,'Teclado',89.9),(2,'Ratón',24.9),(3,'Monitor 27',239),(4,'Webcam',45),
 (5,'Auriculares',59),(6,'Monitor 24',149),(7,'Alfombrilla',9.5),(8,'Hub USB',45);

-- segunda página, 3 por página
`,
  pruebas:[{salida:"Hub USB|45.0\nAuriculares|59.0\nTeclado|89.9"}],
  pista:"ORDER BY precio, id LIMIT 3 OFFSET 3",
  solucion:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, precio REAL NOT NULL);
INSERT INTO productos VALUES
 (1,'Teclado',89.9),(2,'Ratón',24.9),(3,'Monitor 27',239),(4,'Webcam',45),
 (5,'Auriculares',59),(6,'Monitor 24',149),(7,'Alfombrilla',9.5),(8,'Hub USB',45);

SELECT nombre, precio FROM productos ORDER BY precio, id LIMIT 3 OFFSET 3;
`,
  why:"Página n con tamaño t: OFFSET (n - 1) * t. La webcam y el hub empatan a 45; el id decide que la webcam va en la página 1 y el hub en la 2, siempre igual."},
 {t:"orden", p:"Ordena las cláusulas tal como se escriben en una consulta",
  items:["SELECT nombre, precio","FROM productos","WHERE stock > 0","ORDER BY precio DESC","LIMIT 10"],
  why:"El orden de escritura es fijo. Verás más adelante que el orden en que se ejecutan es distinto."},
 {t:"opcion", p:"¿Por qué OFFSET grande (por ejemplo OFFSET 500000) es lento?",
  ops:["No es lento","La base de datos debe recorrer y descartar todas las filas anteriores","Porque LIMIT es lento","Porque ordena dos veces"],
  ok:1, why:"Para tablas grandes se usa paginación por clave (keyset): WHERE id &lt; último_id_visto ORDER BY id DESC LIMIT 20, que con un índice va igual de rápido en la página 1 que en la 10.000."},
 {t:"vf", p:"En PostgreSQL, <code>ORDER BY telefono</code> (ascendente) coloca los NULL al final.",
  ok:true, why:"PostgreSQL trata NULL como mayor que cualquier valor. Con DESC salen primero. NULLS FIRST / NULLS LAST lo cambia."}
]},

{
id:"sq2l4",
titulo:"LIKE, IN, BETWEEN y DISTINCT",
claves:["LIKE con % (cualquier texto) y _ (un carácter); ILIKE ignora mayúsculas","IN (lista) y BETWEEN a AND b (incluye extremos)","DISTINCT elimina filas repetidas; DISTINCT ON es propio de PostgreSQL"],
pasos:[
 {t:"info", eti:"Patrones", h:"LIKE e ILIKE",
  c:`<div class="termbox">SELECT * FROM clientes WHERE email LIKE '%@gmail.com';   <span class="cm">-- termina en @gmail.com</span>
SELECT * FROM productos WHERE nombre LIKE 'Tec%';      <span class="cm">-- empieza por Tec</span>
SELECT * FROM productos WHERE nombre ILIKE '%ratón%';  <span class="cm">-- contiene, sin distinguir mayúsculas</span>
SELECT * FROM clientes WHERE codigo LIKE 'A_1';        <span class="cm">-- A, un carácter cualquiera, 1</span>
SELECT * FROM productos WHERE nombre ~ '^Monitor [0-9]+$';  <span class="cm">-- expresión regular (PostgreSQL)</span></div>
     <div class="nota ojo"><b class="tit">Diferencia con SQLite</b>En PostgreSQL, <code>LIKE</code> distingue mayúsculas y <code>ILIKE</code> no. En SQLite, <code>LIKE</code> no distingue mayúsculas (en letras sin tilde) y no existe ILIKE.</div>`},
 {t:"info", eti:"Listas y rangos", h:"IN, BETWEEN y DISTINCT",
  c:`<div class="termbox">SELECT * FROM clientes WHERE ciudad IN ('Madrid', 'Sevilla', 'Bilbao');
SELECT * FROM productos WHERE precio BETWEEN 20 AND 50;           <span class="cm">-- incluye 20 y 50</span>
SELECT DISTINCT ciudad FROM clientes;                              <span class="cm">-- cada ciudad una vez</span>

<span class="cm">-- solo PostgreSQL: la primera fila de cada grupo según el ORDER BY</span>
SELECT DISTINCT ON (cliente_id) cliente_id, id, fecha
FROM pedidos ORDER BY cliente_id, fecha DESC;                      <span class="cm">-- último pedido de cada cliente</span></div>
     <p>Cuidado con <code>BETWEEN</code> y las fechas con hora: <code>creado_en BETWEEN '2026-09-01' AND '2026-09-30'</code> se deja fuera todo el día 30 después de las 00:00. Para instantes, usa un rango semiabierto: <code>&gt;= '2026-09-01' AND &lt; '2026-10-01'</code>.</p>`},
 {t:"par", p:"Empareja cada condición con lo que selecciona",
  pares:[["nombre LIKE 'A%'","Nombres que empiezan por A"],["nombre LIKE '%a'","Nombres que terminan en a"],["nombre ILIKE '%pro%'","Contienen «pro» sin importar mayúsculas"],["precio BETWEEN 10 AND 20","Precios de 10 a 20, ambos incluidos"],["ciudad IN ('Madrid','Bilbao')","Clientes de Madrid o de Bilbao"]],
  why:"IN es más legible que encadenar muchos OR."},
 {t:"term", p:"Muestra las ciudades distintas en las que hay clientes",
  prompt:"tienda=#", sol:["select distinct ciudad from clientes;","select distinct ciudad from clientes order by ciudad;"],
  pista:"SELECT DISTINCT seguido de la columna.",
  salida:`  ciudad
----------
 Bilbao
 Madrid
 Sevilla
(3 rows)`, why:"DISTINCT aplica a la combinación de todas las columnas del SELECT."},
 {t:"codigo", p:"Clientes de Madrid o Bilbao con correo de gmail.com",
  lenguaje:"sql",
  c:`<p>Muestra el <code>nombre</code> de los clientes cuya ciudad está en la lista (Madrid, Bilbao) <b>y</b> cuyo email termina en <code>@gmail.com</code>. Usa <code>IN</code> y <code>LIKE</code>, y ordena por nombre.</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, email TEXT, ciudad TEXT);
INSERT INTO clientes VALUES
 (1,'Ana Ruiz','ana@gmail.com','Madrid'),(2,'Luis Gómez','luis@gmail.com','Sevilla'),
 (3,'Marta López','marta@correo.es','Madrid'),(4,'Iker Etxeberria','iker@gmail.com','Bilbao'),
 (5,'Bea Sanz','bea@gmail.com.ar','Bilbao');

-- clientes de Madrid o Bilbao con gmail.com
`,
  pruebas:[{salida:"Ana Ruiz\nIker Etxeberria"}],
  pista:"WHERE ciudad IN ('Madrid', 'Bilbao') AND email LIKE '%@gmail.com' ORDER BY nombre",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, email TEXT, ciudad TEXT);
INSERT INTO clientes VALUES
 (1,'Ana Ruiz','ana@gmail.com','Madrid'),(2,'Luis Gómez','luis@gmail.com','Sevilla'),
 (3,'Marta López','marta@correo.es','Madrid'),(4,'Iker Etxeberria','iker@gmail.com','Bilbao'),
 (5,'Bea Sanz','bea@gmail.com.ar','Bilbao');

SELECT nombre FROM clientes
WHERE ciudad IN ('Madrid', 'Bilbao') AND email LIKE '%@gmail.com'
ORDER BY nombre;
`,
  why:"Bea queda fuera: su email contiene @gmail.com pero no termina ahí. '%@gmail.com' fija el final; '%@gmail.com%' la habría colado."},
 {t:"opcion", p:"Quieres los pedidos creados el 30 de septiembre de 2026 y <code>creado_en</code> es <code>timestamptz</code>. ¿Qué filtro es correcto?",
  ops:["creado_en = '2026-09-30'","creado_en BETWEEN '2026-09-30' AND '2026-09-30'","creado_en &gt;= '2026-09-30' AND creado_en &lt; '2026-10-01'","creado_en LIKE '2026-09-30%'"],
  ok:2, why:"Un rango semiabierto incluye todo el día sin depender de la precisión de la hora y, además, puede usar un índice sobre creado_en."},
 {t:"vf", p:"<code>LIKE '%texto%'</code> puede aprovechar un índice normal para buscar muy rápido en tablas enormes.",
  ok:false, why:"Con % al principio, un índice B-tree normal no sirve. Para búsquedas así se usan índices trigram (pg_trgm) o búsqueda de texto completo."}
]},

{
id:"sq2l5",
titulo:"El valor NULL",
claves:["NULL significa «desconocido» o «sin valor», no cero ni texto vacío","Se comprueba con IS NULL / IS NOT NULL, nunca con = NULL","COALESCE da un valor por defecto; NULLIF y IS DISTINCT FROM completan la caja de herramientas"],
pasos:[
 {t:"info", eti:"La ausencia", h:"¿Qué es NULL?",
  c:`<p><code>NULL</code> representa un valor <b>desconocido</b> o que <b>no existe</b>: un cliente sin teléfono, un pedido aún sin fecha de envío. No es 0 ni una cadena vacía.</p>
     <p>Su lógica es especial: cualquier comparación con NULL da <b>desconocido</b> (UNKNOWN), que WHERE trata como falso.</p>
     <div class="termbox">SELECT * FROM clientes WHERE telefono = NULL;     <span class="cm">-- NO devuelve nada, nunca</span>
SELECT * FROM clientes WHERE telefono IS NULL;    <span class="cm">-- correcto</span>
SELECT * FROM clientes WHERE telefono IS NOT NULL;</div>`},
 {t:"info", eti:"Lógica de tres valores", h:"Verdadero, falso y desconocido",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">and y or cuando interviene null</div><table class="dg-tabla"><thead><tr><th>expresión</th><th>resultado</th></tr></thead><tbody>
       <tr><td>TRUE AND NULL</td><td>NULL (desconocido)</td></tr>
       <tr><td>FALSE AND NULL</td><td>FALSE</td></tr>
       <tr><td>TRUE OR NULL</td><td>TRUE</td></tr>
       <tr><td>FALSE OR NULL</td><td>NULL (desconocido)</td></tr>
       <tr><td>NOT NULL</td><td>NULL (desconocido)</td></tr>
       <tr><td>NULL = NULL</td><td>NULL (desconocido)</td></tr>
     </tbody></table></div>
     <div class="termbox">SELECT COALESCE(telefono, 'sin teléfono') FROM clientes;   <span class="cm">-- primer valor no nulo</span>
SELECT total / NULLIF(unidades, 0) FROM ventas;              <span class="cm">-- NULL en vez de dividir entre 0</span>
SELECT * FROM clientes WHERE ciudad IS DISTINCT FROM 'Madrid'; <span class="cm">-- incluye los que tienen ciudad NULL</span></div>
     <p><code>ciudad &lt;&gt; 'Madrid'</code> descarta en silencio las filas con ciudad NULL; <code>IS DISTINCT FROM</code> las trata como un valor más. Es uno de los bugs más frecuentes en informes.</p>`},
 {t:"term", p:"Muestra los pedidos que todavía no tienen fecha de envío (columna <code>enviado_en</code>)",
  prompt:"tienda=#", sol:["select * from pedidos where enviado_en is null;"],
  pista:"WHERE enviado_en IS NULL.",
  salida:` id  | cliente_id |   fecha    |  estado   | total | enviado_en
-----+------------+------------+-----------+-------+------------
 103 |          2 | 2026-09-03 | pendiente | 89.50 |
(1 row)`, why:"IS NULL es la única forma correcta de buscar valores ausentes."},
 {t:"codigo", p:"Lista de contacto: nombre y teléfono, con «sin teléfono» cuando falte",
  lenguaje:"sql",
  c:`<p>Muestra <code>nombre</code> y <code>COALESCE(telefono, 'sin teléfono')</code> de los clientes <b>que no sean de Madrid</b>, incluidos los que no tienen ciudad (NULL). Ordena por nombre.</p>
     <p>La trampa: <code>ciudad &lt;&gt; 'Madrid'</code> se deja fuera a quien tiene ciudad NULL. <code>IS DISTINCT FROM</code> (que SQLite también entiende, igual que PostgreSQL) no.</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, ciudad TEXT, telefono TEXT);
INSERT INTO clientes VALUES
 (1,'Ana Ruiz','Madrid','600111222'),(2,'Luis Gómez','Sevilla',NULL),
 (3,'Marta López',NULL,'600333444'),(4,'Iker Etxeberria','Bilbao','600555666'),
 (5,'Bea Sanz',NULL,NULL);

-- clientes que no son de Madrid, con su teléfono o «sin teléfono»
`,
  pruebas:[{salida:"Bea Sanz|sin teléfono\nIker Etxeberria|600555666\nLuis Gómez|sin teléfono\nMarta López|600333444"}],
  pista:"WHERE ciudad IS DISTINCT FROM 'Madrid' ORDER BY nombre",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, ciudad TEXT, telefono TEXT);
INSERT INTO clientes VALUES
 (1,'Ana Ruiz','Madrid','600111222'),(2,'Luis Gómez','Sevilla',NULL),
 (3,'Marta López',NULL,'600333444'),(4,'Iker Etxeberria','Bilbao','600555666'),
 (5,'Bea Sanz',NULL,NULL);

SELECT nombre, COALESCE(telefono, 'sin teléfono')
FROM clientes
WHERE ciudad IS DISTINCT FROM 'Madrid'
ORDER BY nombre;
`,
  why:"Con <> habrían salido solo dos filas. Equivale a WHERE ciudad <> 'Madrid' OR ciudad IS NULL."},
 {t:"opcion", p:"¿Qué devuelve <code>SELECT 10 + NULL;</code>?",
  ops:["10","0","NULL","Error"],
  ok:2, why:"Cualquier operación con NULL da NULL. Por eso se usa COALESCE para dar un valor por defecto."},
 {t:"opcion", p:"¿Qué devuelve <code>SELECT 100 / NULLIF(0, 0);</code>?",
  ops:["Error de división entre cero","NULL","0","100"],
  ok:1, why:"NULLIF(a, b) devuelve NULL si a = b. Dividir entre NULL da NULL en lugar de un error: el truco clásico para porcentajes con denominador cero."},
 {t:"vf", p:"<code>WHERE telefono = NULL</code> devuelve los clientes sin teléfono.",
  ok:false, why:"Comparar con = NULL da desconocido, nunca verdadero. Hay que usar IS NULL."}
]}

]});
