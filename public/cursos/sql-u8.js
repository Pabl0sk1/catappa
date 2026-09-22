window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Funciones de ventana",
resumen: "OVER y PARTITION BY, ROW_NUMBER, RANK y DENSE_RANK, LAG y LEAD, totales acumulados y medias móviles",
nivel: "Avanzado",
color: "#346ba8",
lecciones: [

{
id:"sq8l1",
titulo:"OVER y PARTITION BY",
claves:["Una función de ventana calcula sobre un grupo de filas sin colapsarlas","OVER (PARTITION BY ...) define los grupos; ORDER BY dentro define el orden","A diferencia de GROUP BY, cada fila se conserva"],
pasos:[
 {t:"info", eti:"Agregar sin agrupar", h:"La diferencia con GROUP BY",
  c:`<p>Quieres cada pedido junto al total gastado por su cliente. Con GROUP BY pierdes el detalle de cada pedido. Con una <b>función de ventana</b>, no:</p>
     <div class="termbox">SELECT id, cliente_id, total,
       SUM(total) OVER (PARTITION BY cliente_id) AS total_cliente
FROM pedidos;

 id  | cliente_id | total | total_cliente
-----+------------+-------+---------------
 101 |          1 | 45.90 |         57.90
 102 |          1 | 12.00 |         57.90
 103 |          2 | 89.50 |         89.50</div>
     <p><code>OVER</code> convierte una agregación en función de ventana. <code>PARTITION BY</code> es como un GROUP BY que no junta las filas.</p>`},
 {t:"opcion", p:"¿Qué calcula <code>AVG(precio) OVER (PARTITION BY categoria)</code> en cada fila de productos?",
  ops:["La media de toda la tabla","La media de precio de la categoría de ese producto","El precio del producto","El número de categorías"],
  ok:1, why:"Permite comparar cada producto con la media de su categoría en la misma fila."},
 {t:"term", p:"Muestra nombre, precio y la media de precio de toda la tabla en cada fila (sin PARTITION BY)",
  prompt:"tienda=#", sol:["select nombre, precio, avg(precio) over () from productos;","select nombre, precio, avg(precio) over () as media from productos;"],
  pista:"AVG(precio) OVER () con los paréntesis vacíos.",
  salida:`      nombre       | precio |         avg
-------------------+--------+---------------------
 Teclado mecánico  |  89.90 | 94.0142857142857143
 Ratón inalámbrico |  24.50 | 94.0142857142857143
 ...`, why:"OVER () sin nada: la ventana es la tabla entera."},
 {t:"vf", p:"Una función de ventana reduce el número de filas del resultado, como GROUP BY.",
  ok:false, why:"Justo lo contrario: mantiene todas las filas y añade el cálculo a cada una."}
]},

{
id:"sq8l2",
titulo:"Rankings: ROW_NUMBER, RANK y DENSE_RANK",
claves:["ROW_NUMBER numera sin empates; RANK deja huecos tras empates; DENSE_RANK no","El «top N por grupo» se resuelve con ROW_NUMBER y un filtro","Es de las preguntas de SQL más frecuentes en entrevistas"],
pasos:[
 {t:"info", eti:"Numerar", h:"Tres formas de ordenar",
  c:`<div class="termbox">SELECT nombre, precio,
       ROW_NUMBER() OVER (ORDER BY precio DESC) AS fila,
       RANK()       OVER (ORDER BY precio DESC) AS rank,
       DENSE_RANK() OVER (ORDER BY precio DESC) AS dense
FROM productos;

  nombre  | precio | fila | rank | dense
----------+--------+------+------+-------
 Monitor  | 239.00 |    1 |    1 |     1
 Silla    | 199.00 |    2 |    2 |     2
 Mesa     | 199.00 |    3 |    2 |     2
 Teclado  |  89.90 |    4 |    4 |     3</div>`},
 {t:"par", p:"Empareja cada función con su comportamiento ante empates",
  pares:[["ROW_NUMBER","Números distintos aunque empaten (1, 2, 3)"],["RANK","Mismo puesto y salta números (1, 2, 2, 4)"],["DENSE_RANK","Mismo puesto sin saltar (1, 2, 2, 3)"]],
  why:"Para «el segundo precio más alto» se usa DENSE_RANK."},
 {t:"info", eti:"El clásico", h:"Top N por grupo",
  c:`<div class="termbox"><span class="cm">-- los 2 productos mas caros de cada categoria</span>
SELECT categoria, nombre, precio
FROM (
    SELECT categoria, nombre, precio,
           ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY precio DESC) AS rn
    FROM productos
) t
WHERE rn &lt;= 2;</div>
     <p>No se puede filtrar por una función de ventana en el WHERE de la misma consulta (se calcula después), así que se envuelve en una subconsulta o CTE.</p>`},
 {t:"opcion", p:"«Obtén el último pedido de cada cliente». ¿Qué enfoque es el estándar?",
  ops:["MAX(id) y listo, sin más columnas","ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY fecha DESC) y filtrar rn = 1","Un CROSS JOIN","UNION de todos los clientes"],
  ok:1, why:"En PostgreSQL también existe DISTINCT ON (cliente_id) ... ORDER BY cliente_id, fecha DESC."},
 {t:"vf", p:"Se puede escribir <code>WHERE ROW_NUMBER() OVER (...) = 1</code> directamente.",
  ok:false, why:"Las funciones de ventana se evalúan después del WHERE. Hace falta una subconsulta o CTE (o QUALIFY en otras bases de datos)."}
]},

{
id:"sq8l3",
titulo:"LAG, LEAD y acumulados",
claves:["LAG y LEAD acceden a la fila anterior o siguiente","SUM(...) OVER (ORDER BY ...) calcula totales acumulados","ROWS BETWEEN define ventanas móviles, por ejemplo de 7 días"],
pasos:[
 {t:"info", eti:"Mirar a los lados", h:"LAG y LEAD",
  c:`<div class="termbox">WITH mensual AS (
    SELECT date_trunc('month', fecha) AS mes, SUM(total) AS ventas
    FROM pedidos GROUP BY 1
)
SELECT mes, ventas,
       LAG(ventas) OVER (ORDER BY mes) AS mes_anterior,
       round(100.0 * (ventas - LAG(ventas) OVER (ORDER BY mes))
             / LAG(ventas) OVER (ORDER BY mes), 1) AS crecimiento_pct
FROM mensual;</div>
     <p><code>LAG(col)</code> trae el valor de la fila anterior según el orden de la ventana; <code>LEAD(col)</code>, el de la siguiente.</p>`},
 {t:"info", eti:"Acumular", h:"Totales acumulados y medias móviles",
  c:`<div class="termbox">SELECT fecha, total,
       SUM(total) OVER (ORDER BY fecha) AS acumulado,
       AVG(total) OVER (ORDER BY fecha
                        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS media_7
FROM ventas_diarias;</div>
     <p>Con ORDER BY dentro de OVER, SUM se vuelve <b>acumulativa</b>. El marco <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code> toma la fila actual y las 6 anteriores: una media móvil de 7 días.</p>`},
 {t:"par", p:"Empareja cada expresión con lo que calcula",
  pares:[["LAG(ventas) OVER (ORDER BY mes)","Ventas del mes anterior"],["LEAD(fecha) OVER (ORDER BY fecha)","Fecha de la fila siguiente"],["SUM(total) OVER (ORDER BY fecha)","Total acumulado hasta esa fecha"],["AVG(x) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)","Media móvil de 7 filas"]],
  why:"Con estas cuatro puedes construir casi cualquier informe de evolución temporal."},
 {t:"opcion", p:"¿Qué devuelve LAG en la primera fila de la ventana?",
  ops:["0","NULL (o el valor por defecto indicado como tercer argumento)","La misma fila","Error"],
  ok:1, why:"LAG(ventas, 1, 0) devolvería 0 en lugar de NULL."},
 {t:"vf", p:"Las funciones de ventana permiten calcular la diferencia entre cada pedido de un cliente y su pedido anterior sin autouniones.",
  ok:true, why:"total - LAG(total) OVER (PARTITION BY cliente_id ORDER BY fecha). Antes de las ventanas esto requería autouniones complicadas."}
]}

]});
