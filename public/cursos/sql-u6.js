window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Subconsultas, CTEs y conjuntos",
resumen: "Subconsultas escalares y de lista, EXISTS, subconsultas correlacionadas, WITH, CTEs recursivas, UNION y CASE",
nivel: "Intermedio",
color: "#4583bf",
lecciones: [

{
id:"sq6l1",
titulo:"Subconsultas",
claves:["Una subconsulta es un SELECT dentro de otro","Puede devolver un valor, una lista (IN) o una tabla (en FROM)","EXISTS comprueba si hay al menos una fila"],
pasos:[
 {t:"info", eti:"Consultas dentro de consultas", h:"Tres formas",
  c:`<div class="termbox"><span class="cm">-- 1. un valor: productos mas caros que la media</span>
SELECT nombre, precio FROM productos
WHERE precio &gt; (SELECT AVG(precio) FROM productos);

<span class="cm">-- 2. una lista: clientes que han hecho algun pedido pagado</span>
SELECT nombre FROM clientes
WHERE id IN (SELECT cliente_id FROM pedidos WHERE estado = 'pagado');

<span class="cm">-- 3. una tabla derivada en FROM</span>
SELECT ciudad, AVG(num_pedidos)
FROM (SELECT c.ciudad, COUNT(p.id) AS num_pedidos
      FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id
      GROUP BY c.id, c.ciudad) AS t
GROUP BY ciudad;</div>`},
 {t:"term", p:"Muestra nombre y precio de los productos cuyo precio es mayor que la media",
  prompt:"tienda=#", sol:["select nombre, precio from productos where precio > (select avg(precio) from productos);"],
  pista:"WHERE precio > (SELECT AVG(precio) FROM productos)",
  salida:`   nombre    | precio
-------------+--------
 Monitor 27" | 239.00
 Silla ergo  | 199.00
(2 rows)`, why:"La subconsulta se calcula una vez y su resultado se usa como un número."},
 {t:"info", eti:"Existencia", h:"EXISTS y correlación",
  c:`<div class="termbox">SELECT c.nombre FROM clientes c
WHERE EXISTS (
    SELECT 1 FROM pedidos p
    WHERE p.cliente_id = c.id AND p.total &gt; 100
);</div>
     <p>Esta subconsulta es <b>correlacionada</b>: usa <code>c.id</code> de la consulta de fuera, así que conceptualmente se evalúa por cada cliente. EXISTS para en cuanto encuentra una fila.</p>`},
 {t:"opcion", p:"¿Qué problema tiene <code>WHERE id NOT IN (SELECT cliente_id FROM pedidos)</code> si <code>cliente_id</code> puede ser NULL?",
  ops:["Ninguno","Si la subconsulta devuelve algún NULL, NOT IN no devuelve ninguna fila","Es más rápido","Da error de sintaxis"],
  ok:1, why:"Trampa clásica: x NOT IN (1, NULL) es desconocido. NOT EXISTS no tiene este problema."},
 {t:"vf", p:"Una subconsulta en el FROM necesita un alias en PostgreSQL.",
  ok:true, why:"«subquery in FROM must have an alias» en versiones anteriores a la 16; ponerlo siempre es buena práctica."}
]},

{
id:"sq6l2",
titulo:"CTEs con WITH",
claves:["WITH nombre AS (SELECT ...) define una consulta con nombre reutilizable","Hace legibles las consultas largas: pasos con nombre","WITH RECURSIVE recorre jerarquías y árboles"],
pasos:[
 {t:"info", eti:"Legibilidad", h:"Common Table Expressions",
  c:`<div class="termbox">WITH ventas_cliente AS (
    SELECT cliente_id, SUM(total) AS gastado
    FROM pedidos
    WHERE estado = 'pagado'
    GROUP BY cliente_id
),
top AS (
    SELECT * FROM ventas_cliente WHERE gastado &gt; 500
)
SELECT c.nombre, t.gastado
FROM top t
JOIN clientes c ON c.id = t.cliente_id
ORDER BY t.gastado DESC;</div>
     <p>Cada CTE es un paso con nombre. La consulta se lee de arriba abajo como una receta.</p>`},
 {t:"hueco", p:"Completa la definición de la CTE",
  tpl:"___ activos ___ (SELECT * FROM clientes WHERE activo)\nSELECT count(*) FROM activos;", banco:["WITH","AS","FROM","SELECT"], sol:["WITH","AS"],
  why:"WITH nombre AS (consulta), y después la consulta principal la usa como una tabla."},
 {t:"info", eti:"Árboles", h:"WITH RECURSIVE",
  c:`<div class="termbox"><span class="cm">-- todas las subcategorias de "Informatica" a cualquier profundidad</span>
WITH RECURSIVE arbol AS (
    SELECT id, nombre, padre_id, 1 AS nivel
    FROM categorias WHERE nombre = 'Informática'
  UNION ALL
    SELECT c.id, c.nombre, c.padre_id, a.nivel + 1
    FROM categorias c
    JOIN arbol a ON c.padre_id = a.id
)
SELECT * FROM arbol;</div>
     <p>Una parte inicial y una parte recursiva que se une a lo ya encontrado, hasta que no aparecen filas nuevas. Sirve para organigramas, categorías, hilos de comentarios o grafos.</p>`},
 {t:"par", p:"Empareja cada técnica con su mejor uso",
  pares:[["Subconsulta escalar","Comparar con un valor calculado (la media)"],["EXISTS","Comprobar si existe al menos una fila relacionada"],["CTE","Dividir una consulta larga en pasos con nombre"],["WITH RECURSIVE","Recorrer jerarquías de profundidad variable"]],
  why:"Las CTEs son una de las herramientas que más se valoran en entrevistas de SQL."},
 {t:"vf", p:"Una CTE puede referenciar a otra CTE definida antes en el mismo WITH.",
  ok:true, why:"Como en el ejemplo: top usa ventas_cliente."}
]},

{
id:"sq6l3",
titulo:"UNION, INTERSECT, EXCEPT y CASE",
claves:["UNION junta resultados y elimina duplicados; UNION ALL los mantiene y es más rápido","INTERSECT: lo común; EXCEPT: lo del primero que no está en el segundo","CASE WHEN añade lógica condicional dentro de una consulta"],
pasos:[
 {t:"info", eti:"Operaciones de conjuntos", h:"Combinar resultados",
  c:`<div class="termbox">SELECT email FROM clientes
UNION
SELECT email FROM suscriptores_newsletter;       <span class="cm">-- todos, sin repetir</span>

SELECT email FROM clientes
INTERSECT
SELECT email FROM suscriptores_newsletter;       <span class="cm">-- los que estan en ambas</span>

SELECT email FROM suscriptores_newsletter
EXCEPT
SELECT email FROM clientes;                      <span class="cm">-- suscriptores que no son clientes</span></div>
     <p>Las consultas deben tener el mismo número de columnas y tipos compatibles.</p>`},
 {t:"par", p:"Empareja cada operador con su resultado",
  pares:[["UNION","Todas las filas de ambas, sin duplicados"],["UNION ALL","Todas las filas de ambas, con duplicados"],["INTERSECT","Solo las filas presentes en ambas"],["EXCEPT","Las filas de la primera que no están en la segunda"]],
  why:"Si sabes que no hay duplicados, UNION ALL evita un paso de ordenación o hash."},
 {t:"info", eti:"Condiciones", h:"CASE",
  c:`<div class="termbox">SELECT nombre, precio,
       CASE
         WHEN precio &lt; 30  THEN 'barato'
         WHEN precio &lt; 100 THEN 'medio'
         ELSE 'caro'
       END AS gama
FROM productos;

<span class="cm">-- contar condicionalmente en una sola pasada</span>
SELECT COUNT(*) FILTER (WHERE estado = 'pagado')    AS pagados,
       COUNT(*) FILTER (WHERE estado = 'cancelado') AS cancelados
FROM pedidos;</div>`},
 {t:"opcion", p:"Quieres contar pedidos pagados y cancelados en columnas separadas con una sola consulta. ¿Qué usas?",
  ops:["Dos consultas","COUNT(*) FILTER (WHERE ...) o SUM(CASE WHEN ... THEN 1 ELSE 0 END)","UNION","Un JOIN consigo misma"],
  ok:1, why:"La agregación condicional (pivotar) es muy habitual en informes."},
 {t:"vf", p:"<code>UNION</code> es más rápido que <code>UNION ALL</code>.",
  ok:false, why:"UNION tiene que eliminar duplicados, un trabajo extra. UNION ALL simplemente concatena."}
]}

]});
