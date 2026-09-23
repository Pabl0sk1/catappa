window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Combinar tablas con JOIN",
resumen: "INNER, LEFT, RIGHT y FULL JOIN, uniones de varias tablas, autouniones, filas multiplicadas, USING, semi y anti joins, uniones por rango y LATERAL",
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
     <p><code>ON</code> dice cómo se emparejan las filas. <code>JOIN</code> a secas es <code>INNER JOIN</code>. Conceptualmente, se prueban todas las combinaciones de filas y se quedan las que cumplen el ON; en la práctica, el motor usa índices o tablas hash para no hacerlo a lo bruto.</p>`},
 {t:"info", eti:"Lo que queda fuera", h:"Solo las parejas",
  c:`<div class="dg"><div class="dg-tit">inner join: solo filas con pareja</div>
       <div class="dg-cols" style="gap:10px">
         <div class="dg-col" style="min-width:0;flex-basis:80px"><div class="dg-col-tit">clientes</div><div class="dg-pila"><div class="dg-caja">Ana<small>id 1</small></div><div class="dg-caja">Luis<small>id 2</small></div><div class="dg-caja aviso">Marta<small>id 3</small></div></div></div>
         <div class="dg-col" style="min-width:0;flex-basis:80px"><div class="dg-col-tit">pedidos de</div><div class="dg-pila"><div class="dg-caja base">1</div><div class="dg-caja base">1</div><div class="dg-caja base">2</div></div></div>
         <div class="dg-col" style="min-width:0;flex-basis:80px"><div class="dg-col-tit">INNER JOIN</div><div class="dg-pila"><div class="dg-caja ok">Ana</div><div class="dg-caja ok">Ana</div><div class="dg-caja ok">Luis</div></div></div>
       </div>
       <div class="dg-leyenda"><span><i class="aviso"></i>Marta NO sale: no tiene pedidos</span></div>
     </div>`},
 {t:"term", p:"Muestra el id de cada pedido junto al email del cliente (alias <code>p</code> y <code>c</code>)",
  prompt:"tienda=#", sol:["select p.id, c.email from pedidos p join clientes c on c.id = p.cliente_id;","select p.id, c.email from pedidos p inner join clientes c on c.id = p.cliente_id;","select p.id, c.email from pedidos p join clientes c on p.cliente_id = c.id;","select p.id, c.email from pedidos p inner join clientes c on p.cliente_id = c.id;"],
  pista:"FROM pedidos p JOIN clientes c ON c.id = p.cliente_id",
  salida:` id  |      email
-----+-----------------
 101 | ana@correo.com
 102 | ana@correo.com
 103 | luis@correo.com
(3 rows)`, why:"Calificar las columnas con el alias evita ambigüedades cuando ambas tablas tienen columnas con el mismo nombre (id)."},
 {t:"codigo", p:"Pedidos pagados con el nombre del cliente",
  lenguaje:"sql",
  c:`<p>Muestra el <code>id</code> del pedido, el <code>nombre</code> del cliente y el <code>total</code>, solo de los pedidos <b>pagados</b>, ordenados por id de pedido.</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id), estado TEXT, total INTEGER);
INSERT INTO clientes VALUES (1,'Ana'),(2,'Luis'),(3,'Marta'),(4,'Iker');
INSERT INTO pedidos VALUES (101,1,'pagado',45),(102,1,'pagado',12),(103,2,'pendiente',89),(104,3,'pagado',30),(105,1,'cancelado',99);

-- pedidos pagados con el nombre del cliente
`,
  pruebas:[{salida:"101|Ana|45\n102|Ana|12\n104|Marta|30"}],
  pista:"FROM pedidos p JOIN clientes c ON c.id = p.cliente_id WHERE p.estado = 'pagado' ORDER BY p.id",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id), estado TEXT, total INTEGER);
INSERT INTO clientes VALUES (1,'Ana'),(2,'Luis'),(3,'Marta'),(4,'Iker');
INSERT INTO pedidos VALUES (101,1,'pagado',45),(102,1,'pagado',12),(103,2,'pendiente',89),(104,3,'pagado',30),(105,1,'cancelado',99);

SELECT p.id, c.nombre, p.total
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
WHERE p.estado = 'pagado'
ORDER BY p.id;
`,
  why:"Con INNER JOIN, poner el filtro en WHERE o en el ON da lo mismo. Con LEFT JOIN no: lo verás en la siguiente lección."},
 {t:"opcion", p:"¿Por qué Marta, que no tiene pedidos, no aparece en un INNER JOIN entre clientes y pedidos?",
  ops:["Por un error","INNER JOIN solo devuelve filas que tienen pareja en ambas tablas","Porque está al final","Porque su id es 3"],
  ok:1, why:"Para incluir clientes sin pedidos se usa LEFT JOIN."},
 {t:"opcion", p:"Escribes <code>SELECT id, nombre FROM pedidos p JOIN clientes c ON c.id = p.cliente_id;</code> y PostgreSQL responde <code>column reference \"id\" is ambiguous</code>. ¿Qué pasa?",
  ops:["Falta un índice","Las dos tablas tienen una columna id y no has dicho cuál: hay que escribir p.id o c.id","JOIN no admite alias","nombre no existe"],
  ok:1, why:"Califica siempre las columnas en consultas con JOIN: además de evitar el error, quien lea la consulta sabrá de dónde sale cada dato."},
 {t:"vf", p:"<code>JOIN</code> y <code>INNER JOIN</code> son lo mismo.",
  ok:true, why:"INNER es opcional."}
]},

{
id:"sq5l2",
titulo:"LEFT, RIGHT y FULL JOIN",
claves:["LEFT JOIN mantiene todas las filas de la izquierda; si no hay pareja, rellena con NULL","LEFT JOIN ... WHERE derecha.id IS NULL encuentra filas sin pareja","Los filtros sobre la tabla de la derecha van en el ON, no en el WHERE"],
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
WHERE p.id IS NULL;

<span class="cm">-- conciliar dos listas: lo que sobra en cada lado</span>
SELECT a.sku AS en_almacen, c.sku AS en_contabilidad
FROM almacen a
FULL JOIN contabilidad c ON c.sku = a.sku
WHERE a.sku IS NULL OR c.sku IS NULL;</div>
     <p>Una variante equivalente y muy legible del primero: <code>WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id)</code>.</p>`},
 {t:"par", p:"Empareja cada tipo de JOIN con lo que devuelve",
  pares:[["INNER JOIN","Solo filas con pareja en ambas tablas"],["LEFT JOIN","Todas las de la izquierda y sus parejas si existen"],["RIGHT JOIN","Todas las de la derecha y sus parejas si existen"],["FULL JOIN","Todas las filas de ambas tablas"],["CROSS JOIN","Todas las combinaciones posibles"]],
  why:"RIGHT JOIN casi no se usa: se escribe como LEFT JOIN cambiando el orden de las tablas."},
 {t:"term", p:"Muestra los nombres de los clientes que no tienen ningún pedido usando LEFT JOIN",
  prompt:"tienda=#", sol:["select c.nombre from clientes c left join pedidos p on p.cliente_id = c.id where p.id is null;","select c.nombre from clientes c left join pedidos p on c.id = p.cliente_id where p.id is null;","select c.nombre from clientes c left join pedidos p on p.cliente_id = c.id where p.cliente_id is null;"],
  pista:"LEFT JOIN pedidos ... WHERE p.id IS NULL",
  salida:`   nombre
-------------
 Marta López
(1 row)`, why:"Es una consulta clásica de entrevista: «clientes sin pedidos»."},
 {t:"opcion", p:"Haces <code>LEFT JOIN pedidos p ... WHERE p.estado = 'pagado'</code> y desaparecen los clientes sin pedidos. ¿Por qué?",
  ops:["LEFT JOIN no funciona con WHERE","El WHERE descarta las filas con p.estado NULL, convirtiéndolo en la práctica en un INNER JOIN. La condición debe ir en el ON","Hay que usar RIGHT JOIN","Por el índice"],
  ok:1, why:"LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.estado = 'pagado' conserva a todos los clientes."},
 {t:"codigo", p:"Todos los clientes con lo que han pagado (0 si nada)",
  lenguaje:"sql",
  c:`<p>Muestra <b>todos</b> los clientes, ordenados por nombre, con la suma de sus pedidos <b>pagados</b> (<code>COALESCE(SUM(p.total), 0)</code> para que salga 0 en lugar de NULL).</p>
     <p>Cuidado: Luis solo tiene un pedido pendiente y Ana tiene uno cancelado. Ambos deben salir, y los cancelados o pendientes no deben sumar.</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER, estado TEXT, total INTEGER);
INSERT INTO clientes VALUES (1,'Ana'),(2,'Luis'),(3,'Marta'),(4,'Iker');
INSERT INTO pedidos VALUES (101,1,'pagado',45),(102,1,'pagado',12),(103,2,'pendiente',89),(104,3,'pagado',30),(105,1,'cancelado',99);

-- todos los clientes y su total pagado
`,
  pruebas:[{salida:"Ana|57\nIker|0\nLuis|0\nMarta|30"}],
  pista:"LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.estado = 'pagado' ... GROUP BY c.id, c.nombre ORDER BY c.nombre",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER, estado TEXT, total INTEGER);
INSERT INTO clientes VALUES (1,'Ana'),(2,'Luis'),(3,'Marta'),(4,'Iker');
INSERT INTO pedidos VALUES (101,1,'pagado',45),(102,1,'pagado',12),(103,2,'pendiente',89),(104,3,'pagado',30),(105,1,'cancelado',99);

SELECT c.nombre, COALESCE(SUM(p.total), 0)
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.estado = 'pagado'
GROUP BY c.id, c.nombre
ORDER BY c.nombre;
`,
  why:"Con el filtro en WHERE, Luis e Iker habrían desaparecido del informe. Este error llega a producción muy a menudo porque la consulta «funciona»: solo faltan filas."},
 {t:"vf", p:"<code>FULL JOIN</code> sirve para comparar dos listas y ver qué elementos faltan en cada una.",
  ok:true, why:"Filtrando las filas con NULL en uno u otro lado se obtienen las diferencias en ambas direcciones con una sola consulta."}
]},

{
id:"sq5l3",
titulo:"Varias tablas, autouniones y filas multiplicadas",
claves:["Se encadenan JOINs para recorrer varias relaciones","Una autounión une una tabla consigo misma usando dos alias","Unir con una relación «muchos» multiplica filas: agrega antes de unir"],
pasos:[
 {t:"info", eti:"En cadena", h:"Cuatro tablas",
  c:`<div class="termbox"><span class="cm">-- qué productos compró cada cliente</span>
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
 {t:"codigo", p:"Cada empleado con su jefe (y la directora sin jefe)",
  lenguaje:"sql",
  c:`<p>Muestra el nombre de cada empleado y el de su jefe, ordenado por el id del empleado. Si no tiene jefe, muestra <code>-</code> en su lugar.</p>`,
  plantilla:`CREATE TABLE empleados (id INTEGER PRIMARY KEY, nombre TEXT, jefe_id INTEGER REFERENCES empleados(id));
INSERT INTO empleados VALUES (1,'Carmen',NULL),(2,'Jorge',1),(3,'Lucía',1),(4,'Pablo',2),(5,'Sara',2);

-- empleado y jefe
`,
  pruebas:[{salida:"Carmen|-\nJorge|Carmen\nLucía|Carmen\nPablo|Jorge\nSara|Jorge"}],
  pista:"FROM empleados e LEFT JOIN empleados j ON j.id = e.jefe_id, y COALESCE(j.nombre, '-')",
  solucion:`CREATE TABLE empleados (id INTEGER PRIMARY KEY, nombre TEXT, jefe_id INTEGER REFERENCES empleados(id));
INSERT INTO empleados VALUES (1,'Carmen',NULL),(2,'Jorge',1),(3,'Lucía',1),(4,'Pablo',2),(5,'Sara',2);

SELECT e.nombre, COALESCE(j.nombre, '-')
FROM empleados e
LEFT JOIN empleados j ON j.id = e.jefe_id
ORDER BY e.id;
`,
  why:"Con INNER JOIN, Carmen desaparecería. Para recorrer toda la cadena de mando (jefe del jefe…) hace falta una CTE recursiva, que verás en la próxima unidad."},
 {t:"opcion", p:"Tras añadir el JOIN con <code>lineas_pedido</code>, <code>SUM(p.total)</code> sale mucho mayor de lo real. ¿Por qué?",
  ops:["Un bug de PostgreSQL","Cada pedido se repite una vez por cada línea, así que su total se suma varias veces","Porque total es numeric","Falta un índice"],
  ok:1, why:"Error muy frecuente: un JOIN a una relación «muchos» multiplica filas. Agrega primero en una subconsulta o suma a nivel de línea."},
 {t:"codigo", p:"Arregla el informe inflado: total pagado y unidades por cliente",
  lenguaje:"sql",
  c:`<p>La consulta de la plantilla une pedidos con sus líneas y suma <code>p.total</code>: el pedido 101 tiene dos líneas y su total se suma dos veces (Ana sale con 102 en vez de 57).</p>
     <p>Reescríbela para obtener por cliente (solo pedidos pagados, ordenado por nombre) el <b>total pagado correcto</b> y las <b>unidades</b> compradas. Pista: agrega las líneas por pedido en una subconsulta y une con ese resultado, que ya tiene una fila por pedido.</p>`,
  plantilla:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER, estado TEXT, total INTEGER);
CREATE TABLE lineas (pedido_id INTEGER, producto TEXT, cantidad INTEGER);
INSERT INTO clientes VALUES (1,'Ana'),(2,'Luis'),(3,'Marta');
INSERT INTO pedidos VALUES (101,1,'pagado',45),(102,1,'pagado',12),(103,2,'pendiente',89),(104,3,'pagado',30);
INSERT INTO lineas VALUES (101,'Teclado',1),(101,'Alfombrilla',1),(102,'Cable',2),(104,'Ratón',1);

-- MAL: el total de los pedidos con varias líneas se multiplica
SELECT c.nombre, SUM(p.total), SUM(l.cantidad)
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
JOIN lineas l ON l.pedido_id = p.id
WHERE p.estado = 'pagado'
GROUP BY c.nombre
ORDER BY c.nombre;
`,
  pruebas:[{salida:"Ana|57|4\nMarta|30|1"}],
  pista:"JOIN (SELECT pedido_id, SUM(cantidad) AS uds FROM lineas GROUP BY pedido_id) t ON t.pedido_id = p.id",
  solucion:`CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER, estado TEXT, total INTEGER);
CREATE TABLE lineas (pedido_id INTEGER, producto TEXT, cantidad INTEGER);
INSERT INTO clientes VALUES (1,'Ana'),(2,'Luis'),(3,'Marta');
INSERT INTO pedidos VALUES (101,1,'pagado',45),(102,1,'pagado',12),(103,2,'pendiente',89),(104,3,'pagado',30);
INSERT INTO lineas VALUES (101,'Teclado',1),(101,'Alfombrilla',1),(102,'Cable',2),(104,'Ratón',1);

SELECT c.nombre, SUM(p.total), SUM(t.uds)
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
JOIN (SELECT pedido_id, SUM(cantidad) AS uds FROM lineas GROUP BY pedido_id) t ON t.pedido_id = p.id
WHERE p.estado = 'pagado'
GROUP BY c.nombre
ORDER BY c.nombre;
`,
  why:"Regla práctica: cuando unas dos relaciones «muchos», agrega cada una a la granularidad que necesitas antes de juntarlas. SUM(DISTINCT p.total) parece arreglarlo, pero falla en cuanto dos pedidos cuestan lo mismo."},
 {t:"vf", p:"<code>CROSS JOIN</code> entre una tabla de 100 filas y otra de 50 devuelve 5.000 filas.",
  ok:true, why:"Producto cartesiano: todas las combinaciones. Útil para generar calendarios o combinaciones, peligroso si se hace sin querer."}
]},

{
id:"sq5n1",
titulo:"JOINs avanzados: USING, semi y anti joins, rangos y LATERAL",
claves:["USING (col) une por columnas del mismo nombre; NATURAL JOIN es frágil","EXISTS y NOT EXISTS: semi join y anti join, sin duplicados y a salvo de los NULL","Uniones por rango (non-equi) y LATERAL para «los N últimos de cada uno»"],
pasos:[
 {t:"info", eti:"Atajos", h:"USING y NATURAL",
  c:`<div class="termbox">SELECT * FROM pedidos JOIN lineas_pedido USING (pedido_id);   <span class="cm">-- columna con el mismo nombre</span>
SELECT * FROM pedidos NATURAL JOIN clientes;                  <span class="cm">-- une por TODAS las columnas homónimas</span></div>
     <p><code>USING</code> es cómodo cuando la clave se llama igual en ambas tablas, y la columna sale una sola vez. <code>NATURAL JOIN</code> es peligroso: si mañana alguien añade <code>creado_en</code> a las dos tablas, la condición de unión cambia sola y la consulta deja de devolver filas sin dar ningún error.</p>`},
 {t:"info", eti:"Existir o no", h:"Semi join, anti join y rangos",
  c:`<div class="termbox"><span class="cm">-- semi join: clientes con algún pedido (cada cliente una vez)</span>
SELECT c.* FROM clientes c
WHERE EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id);

<span class="cm">-- anti join: productos que nunca se han vendido</span>
SELECT pr.* FROM productos pr
WHERE NOT EXISTS (SELECT 1 FROM lineas_pedido l WHERE l.producto_id = pr.id);

<span class="cm">-- non-equi join: a cada envío, la tarifa de su tramo de peso</span>
SELECT e.id, t.precio
FROM envios e
JOIN tarifas t ON e.peso_kg &gt;= t.desde_kg AND e.peso_kg &lt; t.hasta_kg;</div>
     <p>Un <code>JOIN</code> normal para «clientes con pedidos» devolvería a Ana dos veces (tiene dos pedidos) y obligaría a un DISTINCT. EXISTS se para en la primera coincidencia, y el planificador lo convierte en un <b>Semi Join</b> o <b>Anti Join</b> eficiente.</p>`},
 {t:"info", eti:"Solo PostgreSQL", h:"LATERAL: una subconsulta por fila",
  c:`<div class="termbox"><span class="cm">-- los 3 últimos pedidos de cada cliente</span>
SELECT c.nombre, u.id, u.fecha
FROM clientes c
CROSS JOIN LATERAL (
    SELECT p.id, p.fecha FROM pedidos p
    WHERE p.cliente_id = c.id          <span class="cm">-- puede usar c: eso es LATERAL</span>
    ORDER BY p.fecha DESC LIMIT 3
) u;</div>
     <p>Una subconsulta normal en el FROM no puede mirar las tablas de su izquierda; con <code>LATERAL</code>, sí: se evalúa una vez por cada cliente. Con un índice en <code>(cliente_id, fecha)</code> es de las formas más rápidas de resolver el «top N por grupo». Usa <code>LEFT JOIN LATERAL (...) ON true</code> para no perder a los clientes sin pedidos. SQLite no tiene LATERAL.</p>`},
 {t:"codigo", p:"Productos que nunca se han vendido",
  lenguaje:"sql",
  c:`<p>Con <code>NOT EXISTS</code>, muestra el nombre de los productos que no aparecen en ninguna línea de pedido, ordenados por nombre.</p>
     <p>Fíjate en que una de las líneas tiene <code>producto_id</code> NULL (un producto borrado del catálogo): con <code>NOT IN</code> la consulta no devolvería nada.</p>`,
  plantilla:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE lineas_pedido (pedido_id INTEGER, producto_id INTEGER, cantidad INTEGER);
INSERT INTO productos VALUES (1,'Teclado'),(2,'Ratón'),(3,'Monitor'),(4,'Webcam'),(5,'Alfombrilla');
INSERT INTO lineas_pedido VALUES (101,1,1),(101,5,2),(102,1,1),(103,NULL,1),(104,2,3);

-- productos sin ventas
`,
  pruebas:[{salida:"Monitor\nWebcam"}],
  pista:"WHERE NOT EXISTS (SELECT 1 FROM lineas_pedido l WHERE l.producto_id = p.id)",
  solucion:`CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT);
CREATE TABLE lineas_pedido (pedido_id INTEGER, producto_id INTEGER, cantidad INTEGER);
INSERT INTO productos VALUES (1,'Teclado'),(2,'Ratón'),(3,'Monitor'),(4,'Webcam'),(5,'Alfombrilla');
INSERT INTO lineas_pedido VALUES (101,1,1),(101,5,2),(102,1,1),(103,NULL,1),(104,2,3);

SELECT p.nombre
FROM productos p
WHERE NOT EXISTS (SELECT 1 FROM lineas_pedido l WHERE l.producto_id = p.id)
ORDER BY p.nombre;
`,
  why:"Prueba a cambiarlo por WHERE id NOT IN (SELECT producto_id FROM lineas_pedido): no sale nada, porque «3 NOT IN (1, 5, NULL, 2)» es desconocido, no verdadero."},
 {t:"codigo", p:"Asigna a cada envío la tarifa de su tramo de peso",
  lenguaje:"sql",
  c:`<p>Cada tarifa cubre un tramo semiabierto <code>[desde_kg, hasta_kg)</code>. Muestra el id de cada envío y el precio de su tarifa, ordenado por id. Es un JOIN sin igualdad: la condición del ON es un rango.</p>`,
  plantilla:`CREATE TABLE tarifas (desde_kg REAL, hasta_kg REAL, precio REAL);
CREATE TABLE envios (id INTEGER PRIMARY KEY, peso_kg REAL);
INSERT INTO tarifas VALUES (0,1,3.5),(1,5,5.9),(5,20,9.9),(20,1000,24.0);
INSERT INTO envios VALUES (1,0.4),(2,1),(3,4.99),(4,5),(5,31);

-- envío y precio de su tramo
`,
  pruebas:[{salida:"1|3.5\n2|5.9\n3|5.9\n4|9.9\n5|24.0"}],
  pista:"JOIN tarifas t ON e.peso_kg >= t.desde_kg AND e.peso_kg < t.hasta_kg",
  solucion:`CREATE TABLE tarifas (desde_kg REAL, hasta_kg REAL, precio REAL);
CREATE TABLE envios (id INTEGER PRIMARY KEY, peso_kg REAL);
INSERT INTO tarifas VALUES (0,1,3.5),(1,5,5.9),(5,20,9.9),(20,1000,24.0);
INSERT INTO envios VALUES (1,0.4),(2,1),(3,4.99),(4,5),(5,31);

SELECT e.id, t.precio
FROM envios e
JOIN tarifas t ON e.peso_kg >= t.desde_kg AND e.peso_kg < t.hasta_kg
ORDER BY e.id;
`,
  why:"Con BETWEEN (que incluye los dos extremos), el envío de 1 kg y el de 5 kg caerían en dos tramos y saldrían duplicados. En PostgreSQL, un tipo rango (numrange) con una restricción de exclusión garantiza además que los tramos no se solapen."},
 {t:"opcion", p:"Quieres, para cada cliente, sus 3 pedidos más recientes, en PostgreSQL y con una tabla de pedidos enorme indexada por <code>(cliente_id, fecha)</code>. ¿Qué es lo más eficiente?",
  ops:["Un JOIN normal y filtrar en la aplicación","CROSS JOIN LATERAL con ORDER BY fecha DESC LIMIT 3 dentro","Un NATURAL JOIN","UNION ALL de una consulta por cliente escrita a mano"],
  ok:1, why:"LATERAL hace tres lecturas del índice por cliente. La alternativa con ROW_NUMBER (unidad de ventanas) es más portable, pero numera todos los pedidos antes de filtrar."},
 {t:"vf", p:"<code>NATURAL JOIN</code> es recomendable porque ahorra escribir la condición de unión.",
  ok:false, why:"Une por todas las columnas con el mismo nombre, así que un cambio de esquema inocente altera el resultado en silencio. Mejor ON explícito, o USING."}
]}

]});
