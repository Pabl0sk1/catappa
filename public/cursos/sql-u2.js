window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Consultar datos con SELECT",
resumen: "SELECT y FROM, filtrar con WHERE, ordenar, limitar, operadores, LIKE, IN, BETWEEN y el valor NULL",
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
 Ratón inalámbrico |  24.50
 Monitor 27"       | 239.00
(3 rows)</div>
     <ul><li><code>SELECT</code>: qué columnas quieres.</li>
     <li><code>FROM</code>: de qué tabla.</li></ul>
     <p><code>SELECT *</code> trae todas. Es cómodo para explorar, pero en el código de una aplicación conviene nombrar las columnas: si alguien añade una columna pesada, no la arrastras sin querer.</p>`},
 {t:"term", p:"Muestra el nombre y el email de todos los clientes",
  prompt:"tienda=#", sol:["select nombre, email from clientes;","select nombre,email from clientes"],
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
       precio * 1.21 AS precio_con_iva
FROM productos;</div>
     <p>Puedes calcular en el SELECT, y <code>AS</code> da un nombre (alias) a la columna resultante. También se usa con tablas: <code>FROM productos AS p</code> (o simplemente <code>FROM productos p</code>).</p>`},
 {t:"hueco", p:"Completa para mostrar el precio con un alias llamado <code>importe</code>",
  tpl:"SELECT nombre, precio ___ importe FROM productos;", banco:["AS","IS","TO","="], sol:["AS"],
  why:"AS asigna el alias. En PostgreSQL se puede omitir, pero ponerlo es más claro."},
 {t:"vf", p:"<code>SELECT *</code> es la mejor práctica en el código de una aplicación en producción.",
  ok:false, why:"Mejor listar las columnas: más claro, más eficiente y no se rompe si cambia la tabla."}
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
     <ul><li>Los textos y las fechas van entre <b>comillas simples</b>: <code>'Madrid'</code>, <code>'2026-09-01'</code>.</li>
     <li><code>&lt;&gt;</code> (o <code>!=</code>) significa «distinto de».</li>
     <li>La comparación de textos distingue mayúsculas: <code>'madrid'</code> no es <code>'Madrid'</code>.</li></ul>`},
 {t:"info", eti:"Combinar", h:"AND, OR y NOT",
  c:`<div class="termbox">SELECT * FROM productos
WHERE categoria = 'perifericos' AND precio &lt; 50;

SELECT * FROM clientes
WHERE ciudad = 'Madrid' OR ciudad = 'Sevilla';

SELECT * FROM productos
WHERE categoria = 'monitores' AND (precio &lt; 200 OR stock &gt; 10);</div>
     <p>AND se evalúa antes que OR. Ante la duda, <b>paréntesis</b>.</p>`},
 {t:"term", p:"Muestra todas las columnas de los productos con precio mayor que 100",
  prompt:"tienda=#", sol:["select * from productos where precio > 100;","select * from productos where precio>100"],
  pista:"SELECT * FROM productos WHERE y la condición.",
  salida:` id |   nombre    |  categoria | precio | stock
----+-------------+------------+--------+-------
  3 | Monitor 27" | monitores  | 239.00 |    12
  7 | Silla ergo  | mobiliario | 199.00 |     4
(2 rows)`, why:"WHERE se evalúa fila a fila y solo pasan las que cumplen."},
 {t:"opcion", p:"¿Qué devuelve <code>WHERE ciudad = 'Madrid' OR ciudad = 'Sevilla' AND activo = true</code>?",
  ops:["Clientes activos de Madrid o de Sevilla","Todos los de Madrid (activos o no) y los activos de Sevilla","Nada","Error de sintaxis"],
  ok:1, why:"AND va antes: se lee como Madrid OR (Sevilla AND activo). Con paréntesis: (Madrid OR Sevilla) AND activo."},
 {t:"vf", p:"En SQL, los textos se escriben entre comillas dobles: <code>WHERE ciudad = \"Madrid\"</code>.",
  ok:false, why:"Comillas simples para textos. Las dobles son para nombres de columnas o tablas con mayúsculas o espacios."}
]},

{
id:"sq2l3",
titulo:"Ordenar y limitar",
claves:["ORDER BY columna ASC o DESC","Se puede ordenar por varias columnas","LIMIT y OFFSET para paginar"],
pasos:[
 {t:"info", eti:"Orden", h:"ORDER BY",
  c:`<div class="termbox">SELECT nombre, precio FROM productos ORDER BY precio;          <span class="cm">-- de menor a mayor (ASC por defecto)</span>
SELECT nombre, precio FROM productos ORDER BY precio DESC;     <span class="cm">-- de mayor a menor</span>
SELECT * FROM clientes ORDER BY ciudad, nombre;               <span class="cm">-- por ciudad y, dentro, por nombre</span></div>
     <p>Los comentarios en SQL empiezan por <code>--</code>.</p>`},
 {t:"info", eti:"Cuántas", h:"LIMIT y OFFSET",
  c:`<div class="termbox">SELECT nombre, precio FROM productos ORDER BY precio DESC LIMIT 3;   <span class="cm">-- los 3 mas caros</span>

<span class="cm">-- paginacion: 20 por pagina, pagina 3</span>
SELECT * FROM pedidos ORDER BY fecha DESC LIMIT 20 OFFSET 40;</div>
     <p>Sin ORDER BY, LIMIT devuelve filas «cualesquiera». Para paginar, ordena siempre por algo único y estable.</p>`},
 {t:"term", p:"Muestra nombre y precio de los 5 productos más caros",
  prompt:"tienda=#", sol:["select nombre, precio from productos order by precio desc limit 5;"],
  pista:"ORDER BY precio DESC y LIMIT 5.",
  salida:`    nombre     | precio
---------------+--------
 Monitor 27"   | 239.00
 Silla ergo    | 199.00
 Teclado mec.  |  89.90
 Auriculares   |  59.00
 Webcam HD     |  45.00
(5 rows)`, why:"El «top N» es una de las consultas más habituales."},
 {t:"orden", p:"Ordena las cláusulas tal como se escriben en una consulta",
  items:["SELECT nombre, precio","FROM productos","WHERE stock > 0","ORDER BY precio DESC","LIMIT 10"],
  why:"El orden de escritura es fijo. Verás más adelante que el orden en que se ejecutan es distinto."},
 {t:"opcion", p:"¿Por qué OFFSET grande (por ejemplo OFFSET 500000) es lento?",
  ops:["No es lento","La base de datos debe recorrer y descartar todas las filas anteriores","Porque LIMIT es lento","Porque ordena dos veces"],
  ok:1, why:"Para tablas grandes se usa paginación por clave (keyset): WHERE id < último_id_visto ORDER BY id DESC LIMIT 20."}
]},

{
id:"sq2l4",
titulo:"LIKE, IN, BETWEEN y DISTINCT",
claves:["LIKE con % (cualquier texto) y _ (un carácter); ILIKE ignora mayúsculas","IN (lista) y BETWEEN a AND b (incluye extremos)","DISTINCT elimina filas repetidas"],
pasos:[
 {t:"info", eti:"Patrones", h:"LIKE e ILIKE",
  c:`<div class="termbox">SELECT * FROM clientes WHERE email LIKE '%@gmail.com';   <span class="cm">-- termina en @gmail.com</span>
SELECT * FROM productos WHERE nombre LIKE 'Tec%';      <span class="cm">-- empieza por Tec</span>
SELECT * FROM productos WHERE nombre ILIKE '%ratón%';  <span class="cm">-- contiene, sin distinguir mayusculas</span>
SELECT * FROM clientes WHERE codigo LIKE 'A_1';        <span class="cm">-- A, un caracter cualquiera, 1</span></div>`},
 {t:"info", eti:"Listas y rangos", h:"IN, BETWEEN y DISTINCT",
  c:`<div class="termbox">SELECT * FROM clientes WHERE ciudad IN ('Madrid', 'Sevilla', 'Bilbao');
SELECT * FROM productos WHERE precio BETWEEN 20 AND 50;           <span class="cm">-- incluye 20 y 50</span>
SELECT * FROM pedidos WHERE fecha BETWEEN '2026-09-01' AND '2026-09-30';
SELECT DISTINCT ciudad FROM clientes;                              <span class="cm">-- cada ciudad una vez</span></div>`},
 {t:"par", p:"Empareja cada condición con lo que selecciona",
  pares:[["nombre LIKE 'A%'","Nombres que empiezan por A"],["nombre LIKE '%a'","Nombres que terminan en a"],["nombre ILIKE '%pro%'","Contienen «pro» sin importar mayúsculas"],["precio BETWEEN 10 AND 20","Precios de 10 a 20, ambos incluidos"],["ciudad IN ('Madrid','Bilbao')","Clientes de Madrid o de Bilbao"]],
  why:"IN es más legible que encadenar muchos OR."},
 {t:"term", p:"Muestra las ciudades distintas en las que hay clientes",
  prompt:"tienda=#", sol:["select distinct ciudad from clientes;"],
  pista:"SELECT DISTINCT seguido de la columna.",
  salida:`  ciudad
----------
 Bilbao
 Madrid
 Sevilla
(3 rows)`, why:"DISTINCT aplica a la combinación de todas las columnas del SELECT."},
 {t:"vf", p:"<code>LIKE '%texto%'</code> puede aprovechar un índice normal para buscar muy rápido en tablas enormes.",
  ok:false, why:"Con % al principio, un índice B-tree normal no sirve. Para búsquedas así se usan índices trigram (pg_trgm) o búsqueda de texto completo."}
]},

{
id:"sq2l5",
titulo:"El valor NULL",
claves:["NULL significa «desconocido» o «sin valor», no cero ni texto vacío","Se comprueba con IS NULL / IS NOT NULL, nunca con = NULL","COALESCE devuelve el primer valor no nulo"],
pasos:[
 {t:"info", eti:"La ausencia", h:"¿Qué es NULL?",
  c:`<p><code>NULL</code> representa un valor <b>desconocido</b> o que <b>no existe</b>: un cliente sin teléfono, un pedido aún sin fecha de envío. No es 0 ni una cadena vacía.</p>
     <p>Su lógica es especial: cualquier comparación con NULL da <b>desconocido</b>, que WHERE trata como falso.</p>
     <div class="termbox">SELECT * FROM clientes WHERE telefono = NULL;     <span class="cm">-- NO devuelve nada, nunca</span>
SELECT * FROM clientes WHERE telefono IS NULL;    <span class="cm">-- correcto</span>
SELECT * FROM clientes WHERE telefono IS NOT NULL;</div>`},
 {t:"term", p:"Muestra los pedidos que todavía no tienen fecha de envío (columna <code>enviado_en</code>)",
  prompt:"tienda=#", sol:["select * from pedidos where enviado_en is null;"],
  pista:"WHERE enviado_en IS NULL.",
  salida:` id  | cliente_id |   fecha    |  estado   | total | enviado_en
-----+------------+------------+-----------+-------+------------
 103 |          2 | 2026-09-03 | pendiente | 89.50 |
(1 row)`, why:"IS NULL es la única forma correcta de buscar valores ausentes."},
 {t:"info", eti:"Valores por defecto", h:"COALESCE",
  c:`<div class="termbox">SELECT nombre, COALESCE(telefono, 'sin teléfono') AS telefono FROM clientes;
SELECT SUM(COALESCE(descuento, 0)) FROM pedidos;</div>
     <p><code>COALESCE(a, b, c)</code> devuelve el primero que no sea NULL. Ojo también con la aritmética: <code>precio + NULL</code> es NULL.</p>`},
 {t:"opcion", p:"¿Qué devuelve <code>SELECT 10 + NULL;</code>?",
  ops:["10","0","NULL","Error"],
  ok:2, why:"Cualquier operación con NULL da NULL. Por eso se usa COALESCE para dar un valor por defecto."},
 {t:"vf", p:"<code>WHERE telefono = NULL</code> devuelve los clientes sin teléfono.",
  ok:false, why:"Comparar con = NULL da desconocido, nunca verdadero. Hay que usar IS NULL."}
]}

]});
