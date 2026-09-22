window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Combinar tablas con JOIN",
resumen: "INNER, LEFT, RIGHT y FULL JOIN, uniones de varias tablas, autouniones, CROSS JOIN y errores típicos",
nivel: "Intermedio",
color: "#4583bf",
lecciones: [

{
id:"sq5l1",
titulo:"INNER JOIN",
claves:["JOIN combina filas de dos tablas según una condición","INNER JOIN solo devuelve las filas con pareja en ambas tablas","Usa alias cortos y califica las columnas: c.nombre, p.total"],
pasos:[
 {t:"info", eti:"Juntar tablas", h:"Pedidos con el nombre del cliente",
  c:`<p>El pedido solo guarda <code>cliente_id</code>. Para mostrar el nombre, hay que <b>unir</b> las dos tablas:</p>
     <div class="termbox">SELECT p.id, c.nombre, p.fecha, p.total
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;

 id  |   nombre   |   fecha    | total
-----+------------+------------+-------
 101 | Ana Ruiz   | 2026-09-01 | 45.90
 102 | Ana Ruiz   | 2026-09-03 | 12.00
 103 | Luis Gómez | 2026-09-03 | 89.50</div>
     <p><code>ON</code> dice cómo se emparejan las filas. <code>JOIN</code> a secas es <code>INNER JOIN</code>.</p>`},
 {t:"info", eti:"Lo que queda fuera", h:"Solo las parejas",
  c:`<div class="diag">clientes: Ana(1), Luis(2), Marta(3)      pedidos de: 1, 1, 2
INNER JOIN -> Ana, Ana, Luis             Marta NO sale: no tiene pedidos</div>`},
 {t:"term", p:"Muestra el id de cada pedido junto al email del cliente (alias <code>p</code> y <code>c</code>)",
  prompt:"tienda=#", sol:["select p.id, c.email from pedidos p join clientes c on c.id = p.cliente_id;","select p.id, c.email from pedidos p inner join clientes c on c.id = p.cliente_id;","select p.id, c.email from pedidos p join clientes c on p.cliente_id = c.id;","select p.id, c.email from pedidos p inner join clientes c on p.cliente_id = c.id;"],
  pista:"FROM pedidos p JOIN clientes c ON c.id = p.cliente_id",
  salida:` id  |      email
-----+-----------------
 101 | ana@correo.com
 102 | ana@correo.com
 103 | luis@correo.com
(3 rows)`, why:"Calificar las columnas con el alias evita ambigüedades cuando ambas tablas tienen columnas con el mismo nombre (id)."},
 {t:"opcion", p:"¿Por qué Marta, que no tiene pedidos, no aparece en un INNER JOIN entre clientes y pedidos?",
  ops:["Por un error","INNER JOIN solo devuelve filas que tienen pareja en ambas tablas","Porque está al final","Porque su id es 3"],
  ok:1, why:"Para incluir clientes sin pedidos se usa LEFT JOIN."},
 {t:"vf", p:"<code>JOIN</code> y <code>INNER JOIN</code> son lo mismo.",
  ok:true, why:"INNER es opcional."}
]},

{
id:"sq5l2",
titulo:"LEFT, RIGHT y FULL JOIN",
claves:["LEFT JOIN mantiene todas las filas de la izquierda; si no hay pareja, rellena con NULL","LEFT JOIN ... WHERE derecha.id IS NULL encuentra filas sin pareja","FULL JOIN mantiene todas las filas de ambos lados"],
pasos:[
 {t:"info", eti:"Mantener todo lo de un lado", h:"LEFT JOIN",
  c:`<div class="termbox">SELECT c.nombre, p.id AS pedido
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id;

   nombre    | pedido
-------------+--------
 Ana Ruiz    |    101
 Ana Ruiz    |    102
 Luis Gómez  |    103
 Marta López |          &lt;- sin pedidos: NULL</div>`},
 {t:"info", eti:"El patrón", h:"Encontrar lo que no tiene pareja",
  c:`<div class="termbox"><span class="cm">-- clientes que nunca han comprado</span>
SELECT c.nombre
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;</div>
     <p>Una variante equivalente y muy legible: <code>WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id)</code>.</p>`},
 {t:"par", p:"Empareja cada tipo de JOIN con lo que devuelve",
  pares:[["INNER JOIN","Solo filas con pareja en ambas tablas"],["LEFT JOIN","Todas las de la izquierda y sus parejas si existen"],["RIGHT JOIN","Todas las de la derecha y sus parejas si existen"],["FULL JOIN","Todas las filas de ambas tablas"],["CROSS JOIN","Todas las combinaciones posibles"]],
  why:"RIGHT JOIN casi no se usa: se escribe como LEFT JOIN cambiando el orden de las tablas."},
 {t:"term", p:"Muestra los nombres de los clientes que no tienen ningún pedido usando LEFT JOIN",
  prompt:"tienda=#", sol:["select c.nombre from clientes c left join pedidos p on p.cliente_id = c.id where p.id is null;","select c.nombre from clientes c left join pedidos p on c.id = p.cliente_id where p.id is null;"],
  pista:"LEFT JOIN pedidos ... WHERE p.id IS NULL",
  salida:`   nombre
-------------
 Marta López
(1 row)`, why:"Es una consulta clásica de entrevista: «clientes sin pedidos»."},
 {t:"opcion", p:"Haces <code>LEFT JOIN pedidos p ... WHERE p.estado = 'pagado'</code> y desaparecen los clientes sin pedidos. ¿Por qué?",
  ops:["LEFT JOIN no funciona con WHERE","El WHERE descarta las filas con p.estado NULL, convirtiéndolo en la práctica en un INNER JOIN. La condición debe ir en el ON","Hay que usar RIGHT JOIN","Por el índice"],
  ok:1, why:"LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.estado = 'pagado' conserva a todos los clientes."}
]},

{
id:"sq5l3",
titulo:"Varias tablas y autouniones",
claves:["Se encadenan JOINs para recorrer varias relaciones","Una autounión une una tabla consigo misma usando dos alias","CROSS JOIN genera todas las combinaciones"],
pasos:[
 {t:"info", eti:"En cadena", h:"Cuatro tablas",
  c:`<div class="termbox"><span class="cm">-- que productos compro cada cliente</span>
SELECT c.nombre, pr.nombre AS producto, l.cantidad
FROM clientes c
JOIN pedidos p        ON p.cliente_id = c.id
JOIN lineas_pedido l  ON l.pedido_id = p.id
JOIN productos pr     ON pr.id = l.producto_id
WHERE p.estado = 'pagado';</div>
     <p><code>lineas_pedido</code> es la tabla intermedia de una relación <b>muchos a muchos</b>: un pedido tiene muchos productos y un producto aparece en muchos pedidos.</p>`},
 {t:"info", eti:"Consigo misma", h:"Autounión",
  c:`<div class="termbox"><span class="cm">-- empleados con el nombre de su jefe</span>
SELECT e.nombre AS empleado, j.nombre AS jefe
FROM empleados e
LEFT JOIN empleados j ON j.id = e.jefe_id;</div>
     <p>La misma tabla aparece dos veces con alias distintos. Es LEFT para no perder a quien no tiene jefe.</p>`},
 {t:"orden", p:"Ordena los JOIN para ir de clientes a los productos que compraron",
  items:["FROM clientes c","JOIN pedidos p ON p.cliente_id = c.id","JOIN lineas_pedido l ON l.pedido_id = p.id","JOIN productos pr ON pr.id = l.producto_id"],
  why:"Cada JOIN sigue una clave foránea hacia la siguiente tabla."},
 {t:"opcion", p:"Tras añadir el JOIN con <code>lineas_pedido</code>, <code>SUM(p.total)</code> sale mucho mayor de lo real. ¿Por qué?",
  ops:["Un bug de PostgreSQL","Cada pedido se repite una vez por cada línea, así que su total se suma varias veces","Porque total es numeric","Falta un índice"],
  ok:1, why:"Error muy frecuente: un JOIN a una relación «muchos» multiplica filas. Agrega primero en una subconsulta o suma a nivel de línea."},
 {t:"vf", p:"<code>CROSS JOIN</code> entre una tabla de 100 filas y otra de 50 devuelve 5.000 filas.",
  ok:true, why:"Producto cartesiano: todas las combinaciones. Útil para generar calendarios o combinaciones, peligroso si se hace sin querer."}
]}

]});
