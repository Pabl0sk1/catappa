window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Índices y rendimiento",
resumen: "Cómo funciona un índice B-tree, índices compuestos, parciales y de expresión, EXPLAIN ANALYZE y optimización de consultas",
nivel: "Avanzado",
color: "#346ba8",
lecciones: [

{
id:"sq9l1",
titulo:"Qué es un índice",
claves:["Sin índice, la base de datos lee toda la tabla (Seq Scan)","Un índice B-tree es un árbol ordenado que encuentra valores en pocos pasos","Acelera lecturas pero cuesta espacio y ralentiza escrituras"],
pasos:[
 {t:"info", eti:"El índice de un libro", h:"Encontrar sin leerlo todo",
  c:`<p>Buscar <code>WHERE email = 'ana@correo.com'</code> en una tabla de 10 millones de clientes sin índice obliga a leer las 10 millones de filas: un <b>Seq Scan</b> (lectura secuencial).</p>
     <p>Un <b>índice</b> es una estructura aparte, ordenada, que apunta a las filas. El tipo por defecto, <b>B-tree</b>, es un árbol equilibrado: con 3 o 4 saltos encuentra cualquier valor entre millones.</p>
     <div class="termbox">CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);
CREATE UNIQUE INDEX idx_clientes_email ON clientes (email);
CREATE INDEX CONCURRENTLY idx_pedidos_fecha ON pedidos (fecha);  <span class="cm">-- sin bloquear escrituras</span></div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Seq Scan","Leer la tabla entera fila a fila"],["Index Scan","Usar el índice y luego leer las filas de la tabla"],["Index Only Scan","Responder solo con el índice, sin tocar la tabla"],["B-tree","Árbol ordenado: igualdad, rangos y ordenación"]],
  why:"Estos nombres aparecen en los planes de ejecución que verás con EXPLAIN."},
 {t:"info", eti:"El coste", h:"Nada es gratis",
  c:`<ul><li>Cada índice <b>ocupa espacio</b>.</li>
     <li>Cada INSERT, UPDATE o DELETE debe <b>actualizar todos los índices</b> de la tabla.</li>
     <li>Un índice que ninguna consulta usa es puro coste.</li></ul>
     <p>PostgreSQL crea índices automáticamente para PRIMARY KEY y UNIQUE, pero <b>no para las claves foráneas</b>: créalos tú, porque se usan en JOINs y en los borrados del padre.</p>`},
 {t:"opcion", p:"Tu consulta <code>SELECT * FROM pedidos WHERE cliente_id = 42</code> va lenta en una tabla grande. ¿Qué es lo primero que comprobarías?",
  ops:["La red","Si existe un índice en pedidos.cliente_id (PostgreSQL no lo crea solo para claves foráneas)","El tipo de total","El número de columnas"],
  ok:1, why:"Olvidar indexar claves foráneas es una causa clásica de lentitud."},
 {t:"vf", p:"Añadir índices a todas las columnas es una buena práctica general.",
  ok:false, why:"Ralentiza escrituras y ocupa espacio. Se indexa según las consultas reales."}
]},

{
id:"sq9l2",
titulo:"Tipos de índices",
claves:["Compuesto: el orden de columnas importa (regla del prefijo izquierdo)","Parcial (WHERE) y de expresión (lower(email))","GIN para jsonb, arrays y texto completo; BRIN para tablas enormes ordenadas por tiempo"],
pasos:[
 {t:"info", eti:"Varias columnas", h:"Índices compuestos",
  c:`<div class="termbox">CREATE INDEX idx_pedidos_cliente_fecha ON pedidos (cliente_id, fecha DESC);</div>
     <p>Sirve para:</p>
     <ul><li><code>WHERE cliente_id = 42</code></li>
     <li><code>WHERE cliente_id = 42 AND fecha &gt; '2026-01-01'</code></li>
     <li><code>WHERE cliente_id = 42 ORDER BY fecha DESC LIMIT 10</code> (ya viene ordenado)</li></ul>
     <p>Pero <b>no</b> para <code>WHERE fecha &gt; '2026-01-01'</code> sola: el índice está ordenado primero por cliente. Es la <b>regla del prefijo izquierdo</b>, como una guía telefónica ordenada por apellido y luego nombre.</p>`},
 {t:"info", eti:"Especializados", h:"Parciales, de expresión y otros tipos",
  c:`<div class="termbox"><span class="cm">-- parcial: solo pedidos pendientes (pocos), indice pequeno y rapido</span>
CREATE INDEX idx_pendientes ON pedidos (fecha) WHERE estado = 'pendiente';

<span class="cm">-- de expresion: para WHERE lower(email) = ...</span>
CREATE INDEX idx_email_lower ON clientes (lower(email));

<span class="cm">-- cubriente: incluye columnas para Index Only Scan</span>
CREATE INDEX idx_ped_cli ON pedidos (cliente_id) INCLUDE (total);

<span class="cm">-- GIN para jsonb y busqueda de texto</span>
CREATE INDEX idx_atributos ON productos USING gin (atributos);

<span class="cm">-- BRIN para tablas enormes que crecen en orden (logs, eventos)</span>
CREATE INDEX idx_eventos_fecha ON eventos USING brin (creado_en);</div>`},
 {t:"par", p:"Empareja cada índice con su caso",
  pares:[["Compuesto (cliente_id, fecha)","Filtrar por cliente y ordenar por fecha"],["Parcial WHERE estado = 'pendiente'","Consultas que solo miran una pequeña parte de la tabla"],["Expresión lower(email)","Búsquedas sin distinguir mayúsculas"],["GIN","Contenido de jsonb, arrays o texto completo"],["BRIN","Tablas de miles de millones de filas ordenadas por tiempo"]],
  why:"Elegir el tipo de índice adecuado puede reducir una consulta de segundos a milisegundos."},
 {t:"opcion", p:"Tienes el índice <code>(cliente_id, fecha)</code>. ¿Qué consulta NO puede aprovecharlo bien?",
  ops:["WHERE cliente_id = 5","WHERE cliente_id = 5 AND fecha > '2026-01-01'","WHERE fecha > '2026-01-01'","WHERE cliente_id = 5 ORDER BY fecha"],
  ok:2, why:"Sin la primera columna del índice, no se puede usar su orden (prefijo izquierdo)."},
 {t:"vf", p:"Un índice sobre <code>email</code> se usa en una consulta con <code>WHERE lower(email) = 'ana@correo.com'</code>.",
  ok:false, why:"La función cambia el valor buscado. Hace falta un índice de expresión sobre lower(email)."}
]},

{
id:"sq9l3",
titulo:"EXPLAIN ANALYZE",
claves:["EXPLAIN muestra el plan; EXPLAIN ANALYZE lo ejecuta y da tiempos reales","Busca Seq Scan en tablas grandes, estimaciones muy alejadas de las filas reales y bucles enormes","ANALYZE actualiza las estadísticas que usa el planificador"],
pasos:[
 {t:"info", eti:"Ver el plan", h:"Leer un plan de ejecución",
  c:`<div class="termbox">EXPLAIN ANALYZE SELECT * FROM pedidos WHERE cliente_id = 42;

Seq Scan on pedidos  (cost=0.00..18334.00 rows=48 width=40)
                     (actual time=0.03..142.7 rows=51 loops=1)
  Filter: (cliente_id = 42)
  Rows Removed by Filter: 999949
Execution Time: 142.9 ms

CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);

Index Scan using idx_pedidos_cliente on pedidos
                     (actual time=0.02..0.09 rows=51 loops=1)
Execution Time: 0.12 ms</div>
     <p>De 143 ms a 0,1 ms. «Rows Removed by Filter: 999949» delata que se leían casi un millón de filas para devolver 51.</p>`},
 {t:"par", p:"Empareja cada señal del plan con lo que suele indicar",
  pares:[["Seq Scan en tabla grande con pocas filas devueltas","Falta un índice adecuado"],["rows estimadas 10, reales 500.000","Estadísticas desactualizadas: ejecutar ANALYZE"],["Nested Loop con loops=100000","Un bucle que se repite demasiado; quizá falta índice en el JOIN"],["Sort con «external merge Disk»","La ordenación no cabe en memoria (work_mem)"]],
  why:"Leer planes es la habilidad que separa a quien escribe SQL de quien lo optimiza."},
 {t:"term", p:"Muestra el plan real con tiempos de <code>SELECT * FROM pedidos WHERE estado = 'pendiente'</code>",
  prompt:"tienda=#", sol:["explain analyze select * from pedidos where estado = 'pendiente';"],
  pista:"Antepón EXPLAIN ANALYZE a la consulta.",
  salida:`Index Scan using idx_pendientes on pedidos (actual time=0.015..0.21 rows=37 loops=1)
Planning Time: 0.09 ms
Execution Time: 0.24 ms`, why:"Aquí se usa el índice parcial de la lección anterior."},
 {t:"opcion", p:"¿Por qué hay que tener cuidado con <code>EXPLAIN ANALYZE</code> sobre un <code>DELETE</code>?",
  ops:["No funciona con DELETE","Porque ANALYZE ejecuta de verdad la sentencia: borraría las filas. Hazlo dentro de BEGIN ... ROLLBACK","Porque es lento","Porque bloquea la base de datos entera"],
  ok:1, why:"EXPLAIN a secas no ejecuta; EXPLAIN ANALYZE sí."},
 {t:"vf", p:"El planificador puede decidir no usar un índice aunque exista, si cree que leer la tabla es más barato.",
  ok:true, why:"Si la consulta devuelve gran parte de la tabla, un Seq Scan puede ser más rápido que saltar por el índice."}
]},

{
id:"sq9l4",
titulo:"Escribir consultas rápidas",
claves:["Evita funciones sobre columnas indexadas en el WHERE y SELECT *","Paginación por clave en lugar de OFFSET grande","pg_stat_statements encuentra las consultas que más tiempo consumen"],
pasos:[
 {t:"info", eti:"Buenas costumbres", h:"Patrones que ayudan al optimizador",
  c:`<ul><li><code>WHERE fecha &gt;= '2026-09-01' AND fecha &lt; '2026-10-01'</code> en vez de <code>WHERE extract(month FROM fecha) = 9</code>: la función impide usar el índice de fecha.</li>
     <li>Pedir solo las columnas necesarias.</li>
     <li>Paginación por clave: <code>WHERE id &lt; :ultimo ORDER BY id DESC LIMIT 20</code>.</li>
     <li>Operaciones en bloque: un <code>INSERT</code> de 1.000 filas, no 1.000 INSERT.</li>
     <li>Tipos coherentes: comparar <code>bigint</code> con <code>bigint</code>, no con texto.</li></ul>`},
 {t:"info", eti:"Encontrar lo lento", h:"pg_stat_statements",
  c:`<div class="termbox">SELECT calls, round(total_exec_time) AS ms_total, round(mean_exec_time, 1) AS ms_media, query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;</div>
     <p>No optimices la consulta más lenta: optimiza la que <b>más tiempo total</b> consume. Una consulta de 5 ms que se ejecuta un millón de veces pesa más que una de 2 s que se ejecuta una vez.</p>`},
 {t:"opcion", p:"¿Qué versión de este filtro puede usar un índice sobre <code>creado_en</code>?",
  ops:["WHERE date(creado_en) = '2026-09-22'","WHERE creado_en >= '2026-09-22' AND creado_en < '2026-09-23'","WHERE to_char(creado_en, 'YYYY-MM-DD') = '2026-09-22'","WHERE extract(day FROM creado_en) = 22"],
  ok:1, why:"Un rango sobre la columna sin transformar es «sargable»: el índice se puede usar."},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["OFFSET 200000 lento","Paginación por clave (keyset)"],["Función sobre la columna en WHERE","Reescribir como rango o crear índice de expresión"],["Miles de INSERT individuales","Inserción por lotes o COPY"],["No sé qué consulta optimizar","pg_stat_statements ordenado por tiempo total"]],
  why:"Medir primero, optimizar después."},
 {t:"vf", p:"La consulta que más conviene optimizar es siempre la que más tarda en una ejecución.",
  ok:false, why:"Importa el tiempo total (duración × número de ejecuciones)."}
]}

]});
