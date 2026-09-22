window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Agregar y agrupar",
resumen: "COUNT, SUM, AVG, MIN y MAX, GROUP BY, HAVING, funciones de texto y de fecha, y el orden lógico de una consulta",
nivel: "Intermedio",
color: "#4f8fca",
lecciones: [

{
id:"sq4l1",
titulo:"Funciones de agregación",
claves:["COUNT, SUM, AVG, MIN y MAX resumen muchas filas en un valor","COUNT(*) cuenta filas; COUNT(columna) ignora los NULL","Las agregaciones ignoran los NULL"],
pasos:[
 {t:"info", eti:"Resumir", h:"Cinco funciones esenciales",
  c:`<div class="termbox">SELECT COUNT(*)            FROM pedidos;                 <span class="cm">-- cuantos pedidos</span>
SELECT SUM(total)           FROM pedidos;                 <span class="cm">-- facturacion total</span>
SELECT AVG(total)           FROM pedidos;                 <span class="cm">-- ticket medio</span>
SELECT MIN(precio), MAX(precio) FROM productos;           <span class="cm">-- mas barato y mas caro</span>
SELECT COUNT(DISTINCT cliente_id) FROM pedidos;           <span class="cm">-- clientes que han comprado</span></div>`},
 {t:"par", p:"Empareja cada función con lo que calcula",
  pares:[["COUNT(*)","Número de filas"],["SUM(total)","Suma de los valores"],["AVG(total)","Media de los valores"],["MAX(precio)","Valor más alto"],["COUNT(DISTINCT cliente_id)","Número de valores distintos"]],
  why:"Casi todos los paneles de negocio están hechos de estas cinco funciones."},
 {t:"term", p:"Calcula el precio medio de los productos",
  prompt:"tienda=#", sol:["select avg(precio) from productos;"],
  pista:"SELECT AVG(columna) FROM tabla.",
  salida:`         avg
---------------------
 94.0142857142857143
(1 row)`, why:"Para redondear: ROUND(AVG(precio), 2)."},
 {t:"opcion", p:"La tabla clientes tiene 10 filas, y 3 de ellas tienen <code>telefono</code> NULL. ¿Qué devuelve <code>COUNT(telefono)</code>?",
  ops:["10","7","3","NULL"],
  ok:1, why:"COUNT(columna) solo cuenta los valores no nulos. COUNT(*) daría 10."},
 {t:"vf", p:"<code>AVG(descuento)</code> trata los NULL como ceros al calcular la media.",
  ok:false, why:"Los ignora: divide solo entre las filas con valor. Si quieres contarlos como 0, AVG(COALESCE(descuento, 0))."}
]},

{
id:"sq4l2",
titulo:"GROUP BY",
claves:["GROUP BY calcula una agregación por cada grupo","Toda columna del SELECT que no esté agregada debe estar en el GROUP BY","Se puede agrupar por varias columnas o por expresiones"],
pasos:[
 {t:"info", eti:"Por grupos", h:"Una fila por grupo",
  c:`<div class="termbox">SELECT categoria, COUNT(*) AS productos, AVG(precio) AS precio_medio
FROM productos
GROUP BY categoria;

  categoria  | productos | precio_medio
-------------+-----------+--------------
 perifericos |         4 |        52.10
 monitores   |         2 |       189.50
 mobiliario  |         1 |       199.00</div>
     <p>GROUP BY junta las filas con el mismo valor de <code>categoria</code> y calcula las agregaciones para cada grupo.</p>`},
 {t:"term", p:"Muestra cuántos clientes hay en cada ciudad",
  prompt:"tienda=#", sol:["select ciudad, count(*) from clientes group by ciudad;","select ciudad, count(*) as clientes from clientes group by ciudad;","select ciudad, count(*) as total from clientes group by ciudad;"],
  pista:"SELECT ciudad, COUNT(*) FROM clientes GROUP BY ciudad;",
  salida:`  ciudad  | count
---------+-------
 Bilbao  |     1
 Madrid  |     2
 Sevilla |     1
(3 rows)`, why:"La consulta más típica de informes: contar por categoría."},
 {t:"opcion", p:"¿Por qué falla <code>SELECT ciudad, nombre, COUNT(*) FROM clientes GROUP BY ciudad;</code>?",
  ops:["COUNT no admite *","nombre no está agregado ni en el GROUP BY: hay varios nombres por ciudad y no se sabe cuál mostrar","Falta ORDER BY","ciudad es texto"],
  ok:1, why:"Error típico: «column nombre must appear in the GROUP BY clause or be used in an aggregate function»."},
 {t:"info", eti:"Por fecha", h:"Agrupar por expresiones",
  c:`<div class="termbox">SELECT date_trunc('month', fecha) AS mes, SUM(total) AS facturado
FROM pedidos
GROUP BY mes
ORDER BY mes;</div>
     <p><code>date_trunc('month', ...)</code> redondea la fecha al primer día del mes: así sale una fila por mes.</p>`},
 {t:"vf", p:"Se puede agrupar por varias columnas, por ejemplo <code>GROUP BY ciudad, estado</code>.",
  ok:true, why:"Sale una fila por cada combinación distinta de ciudad y estado."}
]},

{
id:"sq4l3",
titulo:"HAVING y el orden lógico",
claves:["WHERE filtra filas antes de agrupar; HAVING filtra grupos después","Orden lógico: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT","Por eso un alias del SELECT no se puede usar en WHERE"],
pasos:[
 {t:"info", eti:"Filtrar grupos", h:"HAVING",
  c:`<div class="termbox"><span class="cm">-- clientes con mas de 5 pedidos pagados</span>
SELECT cliente_id, COUNT(*) AS pedidos
FROM pedidos
WHERE estado = 'pagado'          <span class="cm">-- filtra FILAS</span>
GROUP BY cliente_id
HAVING COUNT(*) &gt; 5              <span class="cm">-- filtra GRUPOS</span>
ORDER BY pedidos DESC;</div>`},
 {t:"orden", p:"Ordena las cláusulas según el orden en que la base de datos las evalúa",
  items:["FROM","WHERE","GROUP BY","HAVING","SELECT","ORDER BY","LIMIT"],
  why:"Entender este orden explica muchos errores: por ejemplo, que un alias definido en SELECT no exista todavía en WHERE."},
 {t:"hueco", p:"Completa para ver solo las categorías con más de 3 productos",
  tpl:"SELECT categoria, COUNT(*) FROM productos GROUP BY categoria ___ COUNT(*) > 3;", banco:["HAVING","WHERE","FILTER","AND"], sol:["HAVING"],
  why:"La condición es sobre el grupo (el recuento), así que va en HAVING."},
 {t:"opcion", p:"¿Por qué falla <code>SELECT precio * 1.21 AS con_iva FROM productos WHERE con_iva &gt; 100;</code>?",
  ops:["La multiplicación no está permitida","WHERE se evalúa antes que SELECT, así que el alias con_iva aún no existe","Falta GROUP BY","El alias es demasiado largo"],
  ok:1, why:"Repite la expresión en el WHERE o usa una subconsulta o CTE. En ORDER BY sí puedes usar el alias."},
 {t:"vf", p:"Si una condición puede ir en WHERE o en HAVING, es mejor ponerla en WHERE.",
  ok:true, why:"Filtrar antes reduce las filas que hay que agrupar."}
]},

{
id:"sq4l4",
titulo:"Funciones de texto, número y fecha",
claves:["Texto: lower, upper, length, trim, concat o ||, substring, replace","Números: round, ceil, floor, abs","Fechas: now(), current_date, date_trunc, extract, intervalos"],
pasos:[
 {t:"info", eti:"Texto y números", h:"Funciones habituales",
  c:`<div class="termbox">SELECT lower(email), upper(nombre), length(nombre) FROM clientes;
SELECT nombre || ' (' || ciudad || ')' AS etiqueta FROM clientes;
SELECT trim('  hola  '), replace(telefono, ' ', ''), substring(sku FROM 1 FOR 3);
SELECT round(precio * 1.21, 2), ceil(4.1), floor(4.9) FROM productos;</div>`},
 {t:"info", eti:"Tiempo", h:"Fechas e intervalos",
  c:`<div class="termbox">SELECT now(), current_date;
SELECT * FROM pedidos WHERE fecha &gt;= current_date - interval '7 days';
SELECT extract(year FROM fecha) AS anio, extract(dow FROM fecha) AS dia_semana FROM pedidos;
SELECT age(now(), creado_en) FROM clientes;      <span class="cm">-- tiempo transcurrido</span>
SELECT to_char(fecha, 'DD/MM/YYYY') FROM pedidos;</div>`},
 {t:"par", p:"Empareja cada función con su resultado",
  pares:[["lower('Ana')","ana"],["length('Madrid')","6"],["round(3.14159, 2)","3.14"],["'Ana' || ' ' || 'Ruiz'","Ana Ruiz"],["date_trunc('month', fecha)","Primer día del mes de esa fecha"]],
  why:"|| es el operador de concatenación en PostgreSQL (y en SQL estándar)."},
 {t:"term", p:"Muestra los pedidos de los últimos 30 días",
  prompt:"tienda=#", sol:["select * from pedidos where fecha >= current_date - interval '30 days';","select * from pedidos where fecha > current_date - interval '30 days';","select * from pedidos where fecha >= now() - interval '30 days';"],
  pista:"WHERE fecha >= current_date - interval '30 days'",
  salida:` id  | cliente_id |   fecha    |  estado   | total
-----+------------+------------+-----------+-------
 101 |          1 | 2026-09-01 | pagado    | 45.90
 102 |          1 | 2026-09-03 | pagado    | 12.00
 103 |          2 | 2026-09-03 | pendiente | 89.50
(3 rows)`, why:"Los intervalos hacen muy legible la aritmética de fechas."},
 {t:"vf", p:"Buscar por email sin distinguir mayúsculas con <code>WHERE lower(email) = lower('Ana@Correo.com')</code> es correcto.",
  ok:true, why:"Para que sea rápido, se crea un índice sobre lower(email). También existe el tipo citext."}
]}

]});
