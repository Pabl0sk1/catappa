window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Bases de datos",
resumen: "SQL o NoSQL según el patrón de acceso, índices y motores de almacenamiento (árbol B y LSM), transacciones, aislamiento y bloqueos",
nivel: "Intermedio",
color: "#d99c5d",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"ds4l1",
titulo:"Elegir la base de datos",
claves:["Relacional por defecto: transacciones, consultas flexibles, integridad","NoSQL cuando el patrón de acceso es simple y la escala o el esquema lo exigen","Cada almacén para lo que hace mejor (persistencia políglota), con su coste de operación"],
pasos:[
 {t:"info", eti:"Decidir", h:"SQL y NoSQL",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué base de datos para qué</div>
<table class="dg-tabla"><thead><tr><th>tipo</th><th>ejemplo</th><th>para qué</th></tr></thead><tbody>
<tr><td>relacional</td><td>PostgreSQL, MySQL</td><td>pedidos, pagos, usuarios: transacciones y relaciones</td></tr>
<tr><td>clave-valor</td><td>Redis, DynamoDB</td><td>caché, sesiones, contadores, acceso por clave a escala enorme</td></tr>
<tr><td>documentos</td><td>MongoDB</td><td>catálogos con atributos variables, agregados que se leen enteros</td></tr>
<tr><td>columnar ancha</td><td>Cassandra, ScyllaDB</td><td>escrituras masivas: mensajes, eventos, series</td></tr>
<tr><td>series temporales</td><td>Prometheus, TimescaleDB</td><td>métricas con marca de tiempo</td></tr>
<tr><td>búsqueda</td><td>OpenSearch, Elasticsearch</td><td>texto completo y filtros facetados</td></tr>
<tr><td>analítica (OLAP)</td><td>ClickHouse, BigQuery</td><td>agregar miles de millones de filas por columnas</td></tr>
<tr><td>objetos</td><td>S3</td><td>ficheros, imágenes, copias</td></tr>
<tr><td>grafos</td><td>Neo4j</td><td>relaciones complejas: recomendaciones, fraude</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Criterio", h:"Preguntas que deciden",
  c:`<ul><li>¿Necesito <b>transacciones</b> que abarquen varias entidades (mover dinero entre cuentas)? → relacional.</li>
     <li>¿Conozco todas las consultas de antemano y son por clave (<i>dame los mensajes de la conversación X</i>)? → clave-valor o columnar, diseñando las tablas <b>a partir de las consultas</b>.</li>
     <li>¿Consultas ad hoc, informes, uniones? → relacional o analítica.</li>
     <li>¿Volumen de escritura más allá de lo que un primario aguanta (cientos de miles por segundo)? → almacén particionado de fábrica.</li></ul>
     <div class="nota ojo"><b class="tit">El coste escondido</b>Cada almacén nuevo es algo más que operar, respaldar, monitorizar y mantener sincronizado. «Uso Postgres para todo hasta que duela» es una postura defendible en una entrevista si explicas cuándo dolería.</div>`},
 {t:"par", p:"Empareja cada caso con el almacén más adecuado",
  pares:[["Transferencias bancarias","Relacional con transacciones"],["Historial de mensajes de un chat enorme","Columnar ancha (Cassandra)"],["Búsqueda de productos por texto","Motor de búsqueda (OpenSearch)"],["Fotos de perfil","Almacenamiento de objetos"],["Contador de «me gusta» en tiempo real","Redis"]],
  why:"Justificar la elección por patrón de acceso es lo que buscan en la entrevista."},
 {t:"opcion", p:"¿Cuál es una buena respuesta por defecto para la base de datos principal de una aplicación de negocio nueva?",
  ops:["La NoSQL de moda","Una relacional (PostgreSQL) y añadir otros almacenes cuando un patrón de acceso concreto lo justifique","Ficheros JSON","Solo Redis"],
  ok:1, why:"Muchos sistemas enormes empezaron y siguen con PostgreSQL o MySQL bien escalados."},
 {t:"opcion", p:"En Cassandra o DynamoDB, ¿cómo se diseñan las tablas?",
  ops:["Igual que en SQL, normalizando","A partir de las consultas: una tabla (o índice) por patrón de acceso, duplicando datos si hace falta","Con muchas uniones","Da igual, se arregla con índices después"],
  ok:1, why:"No hay uniones ni consultas flexibles: si mañana necesitas una consulta nueva, suele hacer falta otra tabla y rellenarla."},
 {t:"vf", p:"Las bases de datos NoSQL no pueden ofrecer ninguna garantía transaccional.",
  ok:false, why:"MongoDB tiene transacciones multidocumento, DynamoDB tiene TransactWriteItems, Cassandra tiene transacciones ligeras (LWT) por partición. Lo que cambia es el alcance y el coste."},
 {t:"opcion", p:"El equipo de datos quiere informes que suman las ventas de 3.000 millones de filas por mes y región. ¿Dónde los haces?",
  ops:["En la base de datos transaccional de producción","En un almacén analítico columnar (ClickHouse, BigQuery) alimentado por CDC o por lotes","En Redis","En la caché de la CDN"],
  ok:1, why:"Separar OLTP (transacciones cortas) de OLAP (agregados enormes) evita que un informe tumbe la tienda."}
]},

/* =============== U4 L2 =============== */
{
id:"ds4n1",
titulo:"Índices y motores de almacenamiento",
claves:["Un índice convierte un recorrido completo en una búsqueda logarítmica, a cambio de escrituras más caras","Índice compuesto: el orden de las columnas importa (primero la igualdad, luego el rango)","Árbol B para lecturas equilibradas; LSM (memtable + SSTables) para escrituras masivas"],
pasos:[
 {t:"info", eti:"Buscar rápido", h:"Qué hace un índice",
  c:`<p>Sin índice, buscar los pedidos del cliente 42 entre 100 millones es leer 100 millones de filas. Con un <b>árbol B</b> sobre <code>cliente_id</code>, son 3 o 4 saltos entre páginas: el árbol es muy ancho (cientos de claves por nodo) y por eso muy bajo.</p>
     <div class="dg"><div class="dg-tit">índice compuesto (cliente_id, fecha)</div>
<div class="dg-vert">
<div class="dg-caja acento doble">ordenado por cliente_id y, dentro, por fecha<small>(41, 2026-03-01) (42, 2025-12-30) (42, 2026-01-05) (42, 2026-02-11) (43, …)</small></div>
<div class="dg-caja ok doble"><code>WHERE cliente_id = 42 AND fecha &gt;= '2026-01-01'</code><small>salta al primer 42 de 2026 y lee seguido: rango contiguo</small></div>
<div class="dg-caja aviso doble"><code>WHERE fecha &gt;= '2026-01-01'</code><small>no puede usarlo bien: las fechas están desperdigadas por clientes</small></div>
</div></div>
     <ul><li>Regla del orden: <b>columnas de igualdad primero, la de rango al final</b>.</li>
     <li><b>Índice cubriente</b>: si incluye todas las columnas que pide la consulta, ni siquiera se lee la tabla.</li>
     <li>Cada índice se actualiza en cada escritura: cinco índices son cinco escrituras más.</li></ul>`},
 {t:"info", eti:"Por dentro", h:"Árbol B frente a LSM",
  c:`<div class="dg"><div class="dg-tit">dos formas de guardar en disco</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Árbol B<br><small>PostgreSQL, MySQL</small></div>
<div class="dg-caja">actualiza páginas en su sitio (más WAL)</div>
<div class="dg-caja ok">lecturas predecibles</div>
<div class="dg-caja aviso">escrituras aleatorias en disco</div></div>
<div class="dg-col"><div class="dg-col-tit">LSM<br><small>Cassandra, RocksDB, ScyllaDB</small></div>
<div class="dg-vert"><div class="dg-caja">escribe en memoria (memtable) + log</div><div class="dg-caja">vuelca ficheros ordenados (SSTables)</div><div class="dg-caja">compactación en segundo plano</div></div>
<div class="dg-caja ok">escrituras secuenciales muy rápidas</div>
<div class="dg-caja aviso">una lectura puede mirar varios ficheros (filtros de Bloom ayudan)</div></div>
</div></div>
     <p>Por eso los almacenes pensados para escrituras masivas (mensajes, métricas, eventos) suelen ser LSM.</p>`},
 {t:"opcion", p:"Tienes un índice sobre <code>(pais, ciudad, apellido)</code>. ¿Qué consulta <b>no</b> puede aprovecharlo bien?",
  ops:["WHERE pais = 'ES'","WHERE pais = 'ES' AND ciudad = 'Madrid'","WHERE ciudad = 'Madrid' AND apellido = 'López'","WHERE pais = 'ES' AND ciudad = 'Madrid' AND apellido = 'López'"],
  ok:2, why:"Un índice compuesto se usa por su prefijo izquierdo. Sin pais, los datos de Madrid están repartidos por todo el índice."},
 {t:"vf", p:"Añadir un índice por cada columna de la tabla es una buena práctica para que todas las consultas vayan rápidas.",
  ok:false, why:"Cada índice ocupa espacio y ralentiza cada INSERT y UPDATE. Se crean los que piden las consultas reales, mirando el plan de ejecución."},
 {t:"par", p:"Empareja cada concepto con su descripción",
  pares:[["Árbol B","Estructura ancha y baja que busca en pocos saltos de página"],["LSM","Memtable en RAM que se vuelca a ficheros ordenados y se compactan"],["Índice cubriente","Contiene todas las columnas que pide la consulta"],["Amplificación de escritura","Un cambio lógico provoca varias escrituras físicas"],["Plan de ejecución","Cómo decide la base de datos resolver una consulta"]],
  why:"En PostgreSQL, EXPLAIN ANALYZE enseña el plan y los tiempos reales."},
 {t:"opcion", p:"Un servicio de métricas escribe 500.000 puntos por segundo y casi nunca actualiza. ¿Qué motor encaja mejor?",
  ops:["Árbol B con muchos índices","Uno basado en LSM (o una base de series temporales)","Una hoja de cálculo","Un árbol B sin WAL"],
  ok:1, why:"LSM convierte escrituras aleatorias en secuenciales; las series temporales además comprimen muchísimo valores parecidos."},
 {t:"codigo", p:"Crea el índice que hace que la consulta use SEARCH en vez de SCAN",
  lenguaje:"sql",
  c:`<p>La consulta busca los pedidos de un cliente desde una fecha. Añade <b>un índice compuesto de dos columnas</b> llamado exactamente <code>ix_pedidos_cliente_fecha</code> para que el plan use las dos condiciones. SQLite imprimirá su plan con <code>EXPLAIN QUERY PLAN</code>.</p>`,
  plantilla:`CREATE TABLE pedidos(id INTEGER PRIMARY KEY, cliente_id INT, fecha TEXT, total REAL);
-- crea aquí el índice

EXPLAIN QUERY PLAN SELECT id, total FROM pedidos WHERE cliente_id = 42 AND fecha >= '2026-01-01' ORDER BY fecha;
`,
  pruebas:[{salida:"QUERY PLAN\n`--SEARCH pedidos USING INDEX ix_pedidos_cliente_fecha (cliente_id=? AND fecha>?)"}],
  pista:"Igualdad primero, rango después: CREATE INDEX ix_pedidos_cliente_fecha ON pedidos(…, …);",
  solucion:`CREATE TABLE pedidos(id INTEGER PRIMARY KEY, cliente_id INT, fecha TEXT, total REAL);
CREATE INDEX ix_pedidos_cliente_fecha ON pedidos(cliente_id, fecha);

EXPLAIN QUERY PLAN SELECT id, total FROM pedidos WHERE cliente_id = 42 AND fecha >= '2026-01-01' ORDER BY fecha;
`,
  why:"Con (fecha, cliente_id) el plan solo aprovecharía «fecha>?». Y como el índice ya está ordenado por fecha dentro del cliente, el ORDER BY sale gratis: sin índice aparecería «USE TEMP B-TREE FOR ORDER BY»."}
]},

/* =============== U4 L3 =============== */
{
id:"ds4n2",
titulo:"Transacciones y concurrencia",
claves:["ACID: atomicidad, consistencia, aislamiento y durabilidad","Niveles de aislamiento y sus anomalías: actualización perdida, lectura no repetible, sesgo de escritura","Bloqueo pesimista (SELECT … FOR UPDATE) u optimista (columna de versión)"],
pasos:[
 {t:"info", eti:"Todo o nada", h:"ACID y aislamiento",
  c:`<ul><li><b>Atomicidad</b>: o se aplican todos los cambios de la transacción o ninguno.</li>
     <li><b>Consistencia</b>: se respetan las restricciones (claves foráneas, CHECK, únicos).</li>
     <li><b>Aislamiento</b>: transacciones concurrentes no se pisan… según el nivel.</li>
     <li><b>Durabilidad</b>: lo confirmado sobrevive a un corte de luz (gracias al WAL).</li></ul>
     <div class="dg dg-tabla-caja"><div class="dg-tit">niveles de aislamiento</div>
<table class="dg-tabla"><thead><tr><th>nivel</th><th>evita</th><th>aún permite</th></tr></thead><tbody>
<tr><td>read committed</td><td>leer lo no confirmado</td><td>lecturas no repetibles, actualizaciones perdidas</td></tr>
<tr><td>repeatable read / snapshot</td><td>lo anterior; ves una foto fija</td><td>sesgo de escritura (write skew)</td></tr>
<tr><td>serializable</td><td>todo: como si fueran en fila</td><td>nada, pero aborta más transacciones que hay que reintentar</td></tr>
</tbody></table></div>
     <p>PostgreSQL usa <b>read committed</b> por defecto; MySQL (InnoDB), <b>repeatable read</b>.</p>`},
 {t:"info", eti:"Dos que compran", h:"La última entrada del concierto",
  c:`<div class="dg"><div class="dg-tit">actualización perdida</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Transacción A</div><div class="dg-vert"><div class="dg-caja">lee stock = 1</div><div class="dg-caja">escribe stock = 0</div><div class="dg-caja aviso">vende la entrada</div></div></div>
<div class="dg-col"><div class="dg-col-tit">Transacción B</div><div class="dg-vert"><div class="dg-caja">lee stock = 1</div><div class="dg-caja">escribe stock = 0</div><div class="dg-caja aviso">vende la misma entrada</div></div></div>
</div></div>
     <div class="dg"><div class="dg-tit">tres arreglos</div>
<div class="dg-pila">
<div class="dg-caja ok doble">operación atómica<small><code>UPDATE entradas SET stock = stock - 1 WHERE id = 7 AND stock &gt; 0</code> y mirar cuántas filas cambió</small></div>
<div class="dg-caja ok doble">pesimista<small><code>SELECT … FOR UPDATE</code> bloquea la fila hasta el COMMIT</small></div>
<div class="dg-caja ok doble">optimista<small><code>UPDATE … SET stock = 0, version = 8 WHERE id = 7 AND version = 7</code>; si cambia 0 filas, alguien se adelantó: reintentar</small></div>
</div></div>`},
 {t:"par", p:"Empareja cada técnica con cuándo conviene",
  pares:[["Bloqueo pesimista","Mucha contención sobre las mismas filas y transacciones cortas"],["Bloqueo optimista con versión","Conflictos raros; no se quiere bloquear mientras el usuario piensa"],["UPDATE atómico con condición","Un contador o un stock que se decrementa"],["Serializable","Reglas entre varias filas difíciles de proteger a mano"]],
  why:"El optimista es el habitual en APIs web: el usuario abre un formulario, tarda 5 minutos y al guardar se comprueba la versión."},
 {t:"opcion", p:"Dos médicos de guardia se quitan a la vez del turno; la regla es que quede al menos uno. Cada transacción comprueba «hay 2 de guardia» y se borra. Quedan cero. ¿Qué anomalía es?",
  ops:["Lectura sucia","Sesgo de escritura (write skew)","Lectura fantasma resuelta","Interbloqueo"],
  ok:1, why:"Cada una lee lo mismo y escribe filas distintas, así que snapshot isolation no detecta el choque. Se evita con serializable o bloqueando las filas leídas (FOR UPDATE)."},
 {t:"vf", p:"La durabilidad de una base de datos relacional se consigue escribiendo primero en el registro de escritura anticipada (WAL) y sincronizándolo a disco antes de confirmar.",
  ok:true, why:"Si se va la luz, al arrancar se reproduce el WAL. Por eso el commit cuesta un fsync y agrupar escrituras en una transacción acelera mucho."},
 {t:"hueco", p:"Completa la actualización optimista del stock del producto 7 que se leyó con versión 3",
  tpl:"UPDATE productos SET stock = stock - 1, version = ___ WHERE id = 7 AND version = ___",
  banco:["4","3","2","version"],
  sol:["4","3"],
  why:"Si otra transacción ya subió la versión a 4, esta actualización no cambia ninguna fila y la aplicación sabe que debe releer y reintentar."},
 {t:"codigo", p:"Simula el bloqueo optimista",
  lenguaje:"py",
  c:`<p>Primera línea: stock inicial (la versión empieza en 1). Después, una línea por intento: <code>versión_leída cantidad</code>. Si la versión leída coincide con la actual y hay stock suficiente, resta la cantidad, sube la versión e imprime <code>OK</code>; si la versión no coincide, <code>CONFLICTO</code>; si coincide pero no hay stock, <code>SIN STOCK</code>. Al final imprime <code>stock=X version=Y</code>.</p>`,
  plantilla:`import sys
lineas = sys.stdin.read().split("\\n")
stock = int(lineas[0])
version = 1
for l in lineas[1:]:
    if not l.strip():
        continue
    leida, cantidad = map(int, l.split())
    # comprueba y aplica
print(f"stock={stock} version={version}")
`,
  pruebas:[{entrada:"5\n1 2\n1 1\n2 1\n", salida:"OK\nCONFLICTO\nOK\nstock=2 version=3"},{entrada:"1\n1 1\n2 1\n", salida:"OK\nSIN STOCK\nstock=0 version=2"},{entrada:"10\n1 3\n2 3\n2 1\n3 9\n3 4\n", salida:"OK\nOK\nCONFLICTO\nSIN STOCK\nOK\nstock=0 version=4", oculta:true}],
  pista:"Primero compara versiones (si no coinciden, CONFLICTO); después el stock.",
  solucion:`import sys
lineas = sys.stdin.read().split("\\n")
stock = int(lineas[0])
version = 1
for l in lineas[1:]:
    if not l.strip():
        continue
    leida, cantidad = map(int, l.split())
    if leida != version:
        print("CONFLICTO")
    elif cantidad > stock:
        print("SIN STOCK")
    else:
        stock -= cantidad
        version += 1
        print("OK")
print(f"stock={stock} version={version}")
`,
  why:"Es exactamente lo que hace JPA con @Version: añade «AND version = ?» al UPDATE y lanza una excepción si no cambió ninguna fila."}
]}

]});
