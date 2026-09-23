window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Agregar y agrupar",
resumen: "COUNT, SUM, AVG, MIN, MAX, string_agg y FILTER, GROUP BY, ROLLUP y GROUPING SETS, HAVING, el orden lógico de una consulta y funciones de texto, número y fecha",
nivel: "Intermedio",
color: "#4f8fca",
lecciones: [

{
id:"sq4l1",
titulo:"Funciones de agregación",
claves:["COUNT, SUM, AVG, MIN y MAX resumen muchas filas en un valor","COUNT(*) cuenta filas; COUNT(columna) ignora los NULL","FILTER y string_agg: contar con condición y juntar textos"],
pasos:[
 {t:"info", eti:"Resumir", h:"Cinco funciones esenciales",
  c:`<div class="termbox">SELECT COUNT(*)            FROM pedidos;                 <span class="cm">-- cuántos pedidos</span>
SELECT SUM(total)           FROM pedidos;                 <span class="cm">-- facturación total</span>
SELECT AVG(total)           FROM pedidos;                 <span class="cm">-- ticket medio</span>
SELECT MIN(precio), MAX(precio) FROM productos;           <span class="cm">-- más barato y más caro</span>
SELECT COUNT(DISTINCT cliente_id) FROM pedidos;           <span class="cm">-- clientes que han comprado</span></div>
     <p>Todas ignoran los NULL salvo <code>COUNT(*)</code>, que cuenta filas. Sobre una tabla vacía, <code>COUNT</code> devuelve 0 y las demás devuelven <b>NULL</b> (la suma de nada no es 0): por eso se ve tanto <code>COALESCE(SUM(total), 0)</code>.</p>`},
 {t:"info", eti:"Más allá de las cinco", h:"FILTER, string_agg y compañía",
  c:`<div class="termbox"><span class="cm">-- agregación condicional: varias cuentas en una sola pasada</span>
SELECT COUNT(*)                                   AS pedidos,
       COUNT(*) FILTER (WHERE estado = 'pagado')  AS pagados,
       SUM(total) FILTER (WHERE estado = 'pagado') AS facturado
FROM pedidos;

<span class="cm">-- juntar textos o valores de un grupo</span>
SELECT string_agg(nombre, ', ' ORDER BY nombre) FROM clientes;   <span class="cm">-- 'Ana, Luis, Marta'</span>
SELECT array_agg(id) FROM pedidos WHERE estado = 'pendiente';    <span class="cm">-- {103,110}</span>
SELECT bool_and(activo), bool_or(moroso) FROM clientes;</div>
     <p><code>FILTER</code> es estándar SQL y lo entienden PostgreSQL y SQLite. En otros motores se escribe <code>SUM(CASE WHEN ... THEN 1 ELSE 0 END)</code>.</p>`},
 {t:"par", p:"Empareja cada función con lo que calcula",
  pares:[["COUNT(*)","Número de filas"],["SUM(total)","Suma de los valores"],["AVG(total)","Media de los valores"],["MAX(precio)","Valor más alto"],["COUNT(DISTINCT cliente_id)","Número de valores distintos"],["string_agg(nombre, ', ')","Los textos del grupo unidos en uno"]],
  why:"Casi todos los paneles de negocio están hechos de estas funciones."},
 {t:"term", p:"Calcula el precio medio de los productos, redondeado a 2 decimales",
  prompt:"tienda=#", sol:["select round(avg(precio), 2) from productos;","select round(avg(precio),2) as media from productos;","select round(avg(precio), 2) as precio_medio from productos;"],
  pista:"ROUND(AVG(columna), 2).",
  salida:` round
-------
 115.11
(1 row)`, why:"Sin round, PostgreSQL devuelve numeric con muchos decimales (115.1142857142857143)."},
 {t:"codigo", p:"El resumen del panel: pedidos, pedidos con cupón, facturación y ticket medio",
  lenguaje:"sql",
  c:`<p>Una sola consulta con cuatro columnas, en este orden:</p>
     <ol><li>número de pedidos,</li><li>cuántos usaron cupón (la columna <code>cupon</code> es NULL si no),</li><li>suma de <code>total</code>,</li><li>media de <code>total</code> redondeada a 2 decimales.</li></ol>`,
  plantilla:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, fecha TEXT, estado TEXT, total REAL, cupon TEXT);
INSERT INTO pedidos VALUES
 (1,'ana','2026-07-03','pagado',45.5,'VERANO'), (2,'luis','2026-07-15','cancelado',12,NULL),
 (3,'ana','2026-08-02','pagado',89.5,NULL),     (4,'marta','2026-08-20','pagado',30,'VERANO'),
 (5,'luis','2026-09-01','pendiente',23,NULL);

-- el resumen en una sola consulta
`,
  pruebas:[{salida:"5|2|200.0|40.0"}],
  pista:"COUNT(*), COUNT(cupon), SUM(total), ROUND(AVG(total), 2)",
  solucion:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, fecha TEXT, estado TEXT, total REAL, cupon TEXT);
INSERT INTO pedidos VALUES
 (1,'ana','2026-07-03','pagado',45.5,'VERANO'), (2,'luis','2026-07-15','cancelado',12,NULL),
 (3,'ana','2026-08-02','pagado',89.5,NULL),     (4,'marta','2026-08-20','pagado',30,'VERANO'),
 (5,'luis','2026-09-01','pendiente',23,NULL);

SELECT COUNT(*), COUNT(cupon), SUM(total), ROUND(AVG(total), 2) FROM pedidos;
`,
  why:"COUNT(cupon) no cuenta los NULL: 2 de 5. En un informe real filtrarías los cancelados; aquí se ve el efecto de cada función por separado."},
 {t:"opcion", p:"La tabla clientes tiene 10 filas, y 3 de ellas tienen <code>telefono</code> NULL. ¿Qué devuelve <code>COUNT(telefono)</code>?",
  ops:["10","7","3","NULL"],
  ok:1, why:"COUNT(columna) solo cuenta los valores no nulos. COUNT(*) daría 10."},
 {t:"opcion", p:"¿Qué devuelve <code>SELECT SUM(total) FROM pedidos WHERE cliente_id = 999;</code> si ese cliente no tiene pedidos?",
  ops:["0","NULL","Error","Una fila vacía sin columnas"],
  ok:1, why:"Una fila con NULL. Si tu código espera un número, usa COALESCE(SUM(total), 0)."},
 {t:"vf", p:"<code>AVG(descuento)</code> trata los NULL como ceros al calcular la media.",
  ok:false, why:"Los ignora: divide solo entre las filas con valor. Si quieres contarlos como 0, AVG(COALESCE(descuento, 0))."}
]},

{
id:"sq4l2",
titulo:"GROUP BY, ROLLUP y GROUPING SETS",
claves:["GROUP BY calcula una agregación por cada grupo","Toda columna del SELECT que no esté agregada debe estar en el GROUP BY","ROLLUP, CUBE y GROUPING SETS añaden subtotales y totales en una sola consulta"],
pasos:[
 {t:"info", eti:"Por grupos", h:"Una fila por grupo",
  c:`<div class="termbox">SELECT categoria, COUNT(*) AS productos, round(AVG(precio), 2) AS precio_medio
FROM productos
GROUP BY categoria;

  categoria  | productos | precio_medio
-------------+-----------+--------------
 perifericos |         4 |        52.10
 monitores   |         2 |       194.00
 mobiliario  |         1 |       199.00</div>
     <p>GROUP BY junta las filas con el mismo valor de <code>categoria</code> y calcula las agregaciones para cada grupo. Los NULL forman <b>un grupo propio</b>.</p>
     <p>Excepción útil de PostgreSQL: si agrupas por la <b>clave primaria</b> de una tabla, puedes poner en el SELECT cualquier otra columna de esa tabla (dependen de la clave).</p>`},
 {t:"term", p:"Muestra cuántos clientes hay en cada ciudad",
  prompt:"tienda=#", sol:["select ciudad, count(*) from clientes group by ciudad;","select ciudad, count(*) as clientes from clientes group by ciudad;","select ciudad, count(*) as total from clientes group by ciudad;","select ciudad, count(*) from clientes group by ciudad order by ciudad;"],
  pista:"SELECT ciudad, COUNT(*) FROM clientes GROUP BY ciudad;",
  salida:`  ciudad  | count
---------+-------
 Bilbao  |     1
 Madrid  |     2
 Sevilla |     1
(3 rows)`, why:"La consulta más típica de informes: contar por categoría."},
 {t:"opcion", p:"¿Por qué falla <code>SELECT ciudad, nombre, COUNT(*) FROM clientes GROUP BY ciudad;</code>?",
  ops:["COUNT no admite *","nombre no está agregado ni en el GROUP BY: hay varios nombres por ciudad y no se sabe cuál mostrar","Falta ORDER BY","ciudad es texto"],
  ok:1, why:"Error típico: «column nombre must appear in the GROUP BY clause or be used in an aggregate function». SQLite, en cambio, lo acepta y devuelve un nombre cualquiera: más peligroso todavía."},
 {t:"info", eti:"Subtotales", h:"Por fecha, y con totales",
  c:`<div class="termbox">SELECT date_trunc('month', fecha) AS mes, SUM(total) AS facturado
FROM pedidos
GROUP BY mes
ORDER BY mes;

<span class="cm">-- subtotal por categoría y total general en la misma consulta</span>
SELECT categoria, marca, SUM(unidades)
FROM ventas
GROUP BY ROLLUP (categoria, marca);    <span class="cm">-- (categoria, marca), (categoria), ()</span>

GROUP BY CUBE (categoria, marca);      <span class="cm">-- todas las combinaciones</span>
GROUP BY GROUPING SETS ((categoria), (marca), ());</div>
     <p><code>date_trunc('month', ...)</code> redondea la fecha al primer día del mes: así sale una fila por mes. En las filas de subtotal, las columnas «agregadas del todo» salen NULL; <code>GROUPING(marca)</code> vale 1 en esas filas para distinguirlas de un NULL de verdad.</p>`},
 {t:"codigo", p:"Facturación por mes, sin contar los cancelados",
  lenguaje:"sql",
  c:`<p>Muestra por cada mes (<code>AAAA-MM</code>) el número de pedidos y la suma de <code>total</code>, excluyendo los cancelados, ordenado por mes.</p>
     <p>En SQLite el mes se saca con <code>strftime('%Y-%m', fecha)</code>. En PostgreSQL usarías <code>date_trunc('month', fecha)</code> o <code>to_char(fecha, 'YYYY-MM')</code>.</p>`,
  plantilla:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, fecha TEXT, estado TEXT, total REAL);
INSERT INTO pedidos VALUES
 (1,'ana','2026-07-03','pagado',45.5),  (2,'luis','2026-07-15','cancelado',12),
 (3,'ana','2026-08-02','pagado',89.5),  (4,'marta','2026-08-20','pagado',30),
 (5,'luis','2026-09-01','pendiente',23);

-- mes, número de pedidos y facturación
`,
  pruebas:[{salida:"2026-07|1|45.5\n2026-08|2|119.5\n2026-09|1|23.0"}],
  pista:"SELECT strftime('%Y-%m', fecha) AS mes, COUNT(*), SUM(total) FROM pedidos WHERE estado <> 'cancelado' GROUP BY mes ORDER BY mes;",
  solucion:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, fecha TEXT, estado TEXT, total REAL);
INSERT INTO pedidos VALUES
 (1,'ana','2026-07-03','pagado',45.5),  (2,'luis','2026-07-15','cancelado',12),
 (3,'ana','2026-08-02','pagado',89.5),  (4,'marta','2026-08-20','pagado',30),
 (5,'luis','2026-09-01','pendiente',23);

SELECT strftime('%Y-%m', fecha) AS mes, COUNT(*), SUM(total)
FROM pedidos
WHERE estado <> 'cancelado'
GROUP BY mes
ORDER BY mes;
`,
  why:"El WHERE quita los cancelados antes de agrupar. Un mes sin pedidos no saldría: para rellenar huecos del calendario se une con generate_series en PostgreSQL."},
 {t:"codigo", p:"Una fila por estado con los clientes implicados",
  lenguaje:"sql",
  c:`<p>Por cada <code>estado</code>, muestra cuántos pedidos hay y la lista de clientes separados por coma y ordenados alfabéticamente (con repetidos). Ordena por estado.</p>
     <p><code>string_agg(cliente, ',' ORDER BY cliente)</code> funciona igual en PostgreSQL y en SQLite 3.44+.</p>`,
  plantilla:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, estado TEXT);
INSERT INTO pedidos VALUES (1,'marta','pagado'),(2,'luis','cancelado'),(3,'ana','pagado'),(4,'ana','pagado'),(5,'luis','pendiente');

-- estado, número de pedidos y clientes
`,
  pruebas:[{salida:"cancelado|1|luis\npagado|3|ana,ana,marta\npendiente|1|luis"}],
  pista:"SELECT estado, COUNT(*), string_agg(cliente, ',' ORDER BY cliente) FROM pedidos GROUP BY estado ORDER BY estado;",
  solucion:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, estado TEXT);
INSERT INTO pedidos VALUES (1,'marta','pagado'),(2,'luis','cancelado'),(3,'ana','pagado'),(4,'ana','pagado'),(5,'luis','pendiente');

SELECT estado, COUNT(*), string_agg(cliente, ',' ORDER BY cliente)
FROM pedidos
GROUP BY estado
ORDER BY estado;
`,
  why:"Con string_agg(DISTINCT cliente, ',') quitarías los repetidos. Es muy útil para informes y para depurar qué filas cayeron en cada grupo."},
 {t:"opcion", p:"<code>GROUP BY ROLLUP (categoria, marca)</code> devuelve filas agrupadas por...",
  ops:["solo (categoria, marca)","(categoria, marca), (categoria) y el total general ()","todas las combinaciones, incluida (marca) sola","solo el total general"],
  ok:1, why:"ROLLUP es jerárquico: va quitando columnas por la derecha. CUBE sí incluiría (marca) sola."},
 {t:"vf", p:"Se puede agrupar por varias columnas, por ejemplo <code>GROUP BY ciudad, estado</code>.",
  ok:true, why:"Sale una fila por cada combinación distinta de ciudad y estado."}
]},

{
id:"sq4l3",
titulo:"HAVING y el orden lógico",
claves:["WHERE filtra filas antes de agrupar; HAVING filtra grupos después","Orden lógico: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT","Por eso un alias del SELECT no se puede usar en WHERE"],
pasos:[
 {t:"info", eti:"Filtrar grupos", h:"HAVING",
  c:`<div class="termbox"><span class="cm">-- clientes con más de 5 pedidos pagados</span>
SELECT cliente_id, COUNT(*) AS pedidos
FROM pedidos
WHERE estado = 'pagado'          <span class="cm">-- filtra FILAS</span>
GROUP BY cliente_id
HAVING COUNT(*) &gt; 5              <span class="cm">-- filtra GRUPOS</span>
ORDER BY pedidos DESC;</div>`},
 {t:"info", eti:"Cómo se ejecuta", h:"El orden lógico",
  c:`<div class="dg"><div class="dg-tit">orden en que se evalúa una consulta</div>
       <div class="dg-flujo">
         <div class="dg-caja base">FROM / JOIN<small>qué filas hay</small></div>
         <div class="dg-caja">WHERE<small>filtra filas</small></div>
         <div class="dg-caja">GROUP BY<small>forma grupos</small></div>
         <div class="dg-caja">HAVING<small>filtra grupos</small></div>
         <div class="dg-caja acento">SELECT<small>calcula columnas y alias</small></div>
         <div class="dg-caja">ORDER BY<small>ya ve los alias</small></div>
         <div class="dg-caja ok">LIMIT<small>corta</small></div>
       </div>
     </div>
     <p>Es un orden <b>lógico</b>: el optimizador puede hacer las cosas de otra manera por dentro, pero el resultado es siempre el de este orden. Las funciones de ventana (unidad 8) se calculan justo después de HAVING, dentro del SELECT.</p>`},
 {t:"orden", p:"Ordena las cláusulas según el orden en que la base de datos las evalúa",
  items:["FROM","WHERE","GROUP BY","HAVING","SELECT","ORDER BY","LIMIT"],
  why:"Entender este orden explica muchos errores: por ejemplo, que un alias definido en SELECT no exista todavía en WHERE."},
 {t:"hueco", p:"Completa para ver solo las categorías con más de 3 productos",
  tpl:"SELECT categoria, COUNT(*) FROM productos GROUP BY categoria ___ COUNT(*) > 3;", banco:["HAVING","WHERE","FILTER","AND"], sol:["HAVING"],
  why:"La condición es sobre el grupo (el recuento), así que va en HAVING."},
 {t:"codigo", p:"Clientes fieles: al menos 2 pedidos pagados y más de 100 € en total",
  lenguaje:"sql",
  c:`<p>Muestra <code>cliente</code>, número de pedidos pagados y suma pagada, solo de los clientes que tengan <b>2 o más</b> pedidos pagados <b>y</b> más de 100 en total pagado. Ordena por la suma, de mayor a menor.</p>
     <p>Piensa qué condición va en WHERE (sobre filas) y cuál en HAVING (sobre grupos).</p>`,
  plantilla:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, estado TEXT, total REAL);
INSERT INTO pedidos VALUES
 (1,'ana','pagado',45.5),(2,'ana','pagado',89.5),(3,'ana','cancelado',500),
 (4,'luis','pagado',60),(5,'luis','pagado',30),(6,'marta','pagado',150),
 (7,'iker','pagado',80),(8,'iker','pagado',70),(9,'iker','pendiente',10);

-- clientes fieles
`,
  pruebas:[{salida:"iker|2|150.0\nana|2|135.0"}],
  pista:"WHERE estado = 'pagado' ... GROUP BY cliente HAVING COUNT(*) >= 2 AND SUM(total) > 100 ORDER BY SUM(total) DESC",
  solucion:`CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente TEXT, estado TEXT, total REAL);
INSERT INTO pedidos VALUES
 (1,'ana','pagado',45.5),(2,'ana','pagado',89.5),(3,'ana','cancelado',500),
 (4,'luis','pagado',60),(5,'luis','pagado',30),(6,'marta','pagado',150),
 (7,'iker','pagado',80),(8,'iker','pagado',70),(9,'iker','pendiente',10);

SELECT cliente, COUNT(*) AS pedidos, SUM(total) AS pagado
FROM pedidos
WHERE estado = 'pagado'
GROUP BY cliente
HAVING COUNT(*) >= 2 AND SUM(total) > 100
ORDER BY pagado DESC;
`,
  why:"Si el filtro de estado fuera en HAVING, los 500 cancelados de ana contarían en la suma. Luis tiene 2 pedidos pero solo 90; marta supera 100 con un solo pedido."},
 {t:"opcion", p:"¿Por qué falla <code>SELECT precio * 1.21 AS con_iva FROM productos WHERE con_iva &gt; 100;</code>?",
  ops:["La multiplicación no está permitida","WHERE se evalúa antes que SELECT, así que el alias con_iva aún no existe","Falta GROUP BY","El alias es demasiado largo"],
  ok:1, why:"Repite la expresión en el WHERE o usa una subconsulta o CTE. En ORDER BY sí puedes usar el alias."},
 {t:"vf", p:"Si una condición puede ir en WHERE o en HAVING, es mejor ponerla en WHERE.",
  ok:true, why:"Filtrar antes reduce las filas que hay que agrupar."}
]},

{
id:"sq4l4",
titulo:"Funciones de texto, número y fecha",
claves:["Texto: lower, upper, length, trim, concat o ||, substring, replace, split_part","Números: round, ceil, floor, abs y el operador % (módulo)","Fechas: now(), current_date, date_trunc, extract, intervalos y generate_series"],
pasos:[
 {t:"info", eti:"Texto y números", h:"Funciones habituales",
  c:`<div class="termbox">SELECT lower(email), upper(nombre), length(nombre) FROM clientes;
SELECT nombre || ' (' || ciudad || ')' AS etiqueta FROM clientes;
SELECT concat_ws(' ', nombre, segundo_nombre, apellido) FROM clientes;  <span class="cm">-- salta los NULL</span>
SELECT trim('  hola  '), replace(telefono, ' ', ''), substring(sku FROM 1 FOR 3);
SELECT split_part('ana@correo.com', '@', 2);                             <span class="cm">-- correo.com</span>
SELECT round(precio * 1.21, 2), ceil(4.1), floor(4.9), 17 % 5 FROM productos;</div>
     <p>Ojo: <code>'Ana' || NULL</code> es NULL. <code>concat()</code> y <code>concat_ws()</code> tratan los NULL como cadena vacía.</p>`},
 {t:"info", eti:"Tiempo", h:"Fechas e intervalos",
  c:`<div class="termbox">SELECT now(), current_date;
SELECT * FROM pedidos WHERE fecha &gt;= current_date - interval '7 days';
SELECT extract(year FROM fecha) AS anio, extract(dow FROM fecha) AS dia_semana FROM pedidos;
SELECT age(now(), creado_en) FROM clientes;      <span class="cm">-- tiempo transcurrido</span>
SELECT to_char(fecha, 'DD/MM/YYYY') FROM pedidos;

<span class="cm">-- una fila por día de septiembre, aunque no haya pedidos</span>
SELECT d::date FROM generate_series('2026-09-01'::date, '2026-09-30', interval '1 day') AS d;</div>
     <p><code>now()</code> devuelve la hora de <b>inicio de la transacción</b> (todas las filas de un INSERT masivo reciben la misma); <code>clock_timestamp()</code>, la del instante exacto.</p>`},
 {t:"par", p:"Empareja cada función con su resultado",
  pares:[["lower('Ana')","ana"],["length('Madrid')","6"],["round(3.14159, 2)","3.14"],["'Ana' || ' ' || 'Ruiz'","Ana Ruiz"],["date_trunc('month', fecha)","Primer día del mes de esa fecha"],["split_part('a-b-c', '-', 2)","b"]],
  why:"|| es el operador de concatenación en PostgreSQL (y en SQL estándar)."},
 {t:"term", p:"Muestra los pedidos de los últimos 30 días",
  prompt:"tienda=#", sol:["select * from pedidos where fecha >= current_date - interval '30 days';","select * from pedidos where fecha > current_date - interval '30 days';","select * from pedidos where fecha >= now() - interval '30 days';","select * from pedidos where fecha >= current_date - 30;"],
  pista:"WHERE fecha >= current_date - interval '30 days'",
  salida:` id  | cliente_id |   fecha    |  estado   | total
-----+------------+------------+-----------+-------
 101 |          1 | 2026-09-01 | pagado    | 45.90
 102 |          1 | 2026-09-03 | pagado    | 12.00
 103 |          2 | 2026-09-03 | pendiente | 89.50
(3 rows)`, why:"Los intervalos hacen muy legible la aritmética de fechas. Con una columna date, restar un entero también resta días."},
 {t:"codigo", p:"Genera la etiqueta de envío de cada cliente",
  lenguaje:"sql",
  c:`<p>Para cada cliente, en orden de <code>id</code>, genera un único texto con este formato:</p>
     <div class="termbox">RUIZ, Ana (MAD)</div>
     <p>Apellido en mayúsculas, coma, nombre y, entre paréntesis, las tres primeras letras de la ciudad en mayúsculas. Usa <code>||</code>, <code>upper()</code> y <code>substr(texto, desde, cuántos)</code>.</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT, ciudad TEXT);
INSERT INTO clientes VALUES (1,'Ana','Ruiz','Madrid'),(2,'Luis','Moreno','Sevilla'),(3,'Iker','Etxeberria','Bilbao');

-- la etiqueta de cada cliente
`,
  pruebas:[{salida:"RUIZ, Ana (MAD)\nMORENO, Luis (SEV)\nETXEBERRIA, Iker (BIL)"}],
  pista:"upper(apellido) || ', ' || nombre || ' (' || upper(substr(ciudad, 1, 3)) || ')'",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT, ciudad TEXT);
INSERT INTO clientes VALUES (1,'Ana','Ruiz','Madrid'),(2,'Luis','Moreno','Sevilla'),(3,'Iker','Etxeberria','Bilbao');

SELECT upper(apellido) || ', ' || nombre || ' (' || upper(substr(ciudad, 1, 3)) || ')'
FROM clientes
ORDER BY id;
`,
  why:"substr existe en PostgreSQL con el mismo significado (y también substring(... FROM 1 FOR 3) y left(ciudad, 3)). Diferencia: upper() de SQLite solo convierte letras sin tilde (upper('Gómez') da 'GóMEZ'); PostgreSQL convierte también las acentuadas según la intercalación de la base de datos."},
 {t:"opcion", p:"Un INSERT de 10.000 filas usa <code>DEFAULT now()</code> en <code>creado_en</code> y tarda 3 segundos. ¿Qué valor reciben las filas?",
  ops:["Cada una la hora exacta en que se insertó","Todas la misma: la hora de inicio de la transacción","La hora a la que terminó el INSERT","NULL"],
  ok:1, why:"now() (igual que current_timestamp) es estable dentro de la transacción. Si necesitas el reloj real, clock_timestamp()."},
 {t:"vf", p:"Buscar por email sin distinguir mayúsculas con <code>WHERE lower(email) = lower('Ana@Correo.com')</code> es correcto.",
  ok:true, why:"Para que sea rápido, se crea un índice sobre lower(email). También existe el tipo citext o una intercalación no determinista."}
]}

]});
