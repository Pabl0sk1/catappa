window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Maestría: retos y entrevista",
resumen: "Ejercicios de SQL típicos de entrevista, diagnóstico de problemas reales y simulacro final",
nivel: "Maestro",
color: "#1f4778",
lecciones: [

{
id:"sq13l1",
titulo:"Retos de SQL de entrevista",
claves:["Segundo salario más alto, duplicados, top N por grupo, clientes sin pedidos","Piensa en NULLs, empates y duplicados antes de responder","Explica la consulta en voz alta mientras la escribes"],
pasos:[
 {t:"info", eti:"Cómo abordarlos", h:"Método",
  c:`<ol><li>Repite el enunciado y pregunta por los casos límite: ¿empates?, ¿NULLs?, ¿qué si no hay datos?</li>
     <li>Identifica las tablas y cómo se unen.</li>
     <li>Escribe por pasos (una CTE por paso si ayuda).</li>
     <li>Comprueba con un ejemplo pequeño mental.</li>
     <li>Menciona qué índice ayudaría.</li></ol>`},
 {t:"opcion", p:"«Obtén el segundo precio más alto de productos, teniendo en cuenta empates». ¿Qué consulta es correcta?",
  ops:["SELECT precio FROM productos ORDER BY precio DESC LIMIT 1 OFFSET 1","SELECT DISTINCT precio FROM productos ORDER BY precio DESC LIMIT 1 OFFSET 1","SELECT MAX(precio) FROM productos","SELECT precio FROM productos WHERE precio < 1000"],
  ok:1, why:"Sin DISTINCT, si dos productos empatan en el más caro, OFFSET 1 devolvería el mismo precio. También vale DENSE_RANK() = 2."},
 {t:"term", p:"Encuentra los emails repetidos en la tabla <code>clientes</code> junto con cuántas veces aparecen",
  prompt:"tienda=#", sol:["select email, count(*) from clientes group by email having count(*) > 1;","select email, count(*) as veces from clientes group by email having count(*) > 1;","select email, count(*) as total from clientes group by email having count(*) > 1;"],
  pista:"GROUP BY email y HAVING COUNT(*) > 1.",
  salida:`      email       | count
------------------+-------
 luis@correo.com  |     2
(1 row)`, why:"Buscar duplicados es un clásico, sobre todo antes de añadir una restricción UNIQUE."},
 {t:"opcion", p:"«Clientes que compraron en septiembre pero no en octubre». ¿Qué enfoque es correcto y claro?",
  ops:["Un JOIN con OR","Clientes con pedidos en septiembre EXCEPT clientes con pedidos en octubre (o NOT EXISTS)","UNION de ambos meses","GROUP BY mes"],
  ok:1, why:"EXCEPT o NOT EXISTS expresan directamente «está en uno y no en otro»."},
 {t:"opcion", p:"«Porcentaje de pedidos cancelados por mes». ¿Cuál es el cálculo adecuado?",
  ops:["COUNT(*) / 100","100.0 * COUNT(*) FILTER (WHERE estado = 'cancelado') / COUNT(*), agrupando por date_trunc('month', fecha)","SUM(estado)","AVG(total)"],
  ok:1, why:"Ojo con 100.0: si divides enteros, PostgreSQL hace división entera y el resultado sería 0."},
 {t:"par", p:"Empareja cada reto con la técnica clave",
  pares:[["Top 3 productos por categoría","ROW_NUMBER() OVER (PARTITION BY ...)"],["Clientes sin pedidos","LEFT JOIN ... IS NULL o NOT EXISTS"],["Crecimiento mes a mes","LAG() sobre ventas mensuales"],["Total acumulado","SUM() OVER (ORDER BY fecha)"],["Jerarquía de categorías","WITH RECURSIVE"]],
  why:"Con estas técnicas se resuelve la gran mayoría de los ejercicios de SQL de entrevista."}
]},

{
id:"sq13l2",
titulo:"Problemas reales de base de datos",
claves:["Lentitud: medir con pg_stat_statements y EXPLAIN ANALYZE","Bloqueos: pg_stat_activity y pg_locks","Mitigar, luego corregir la causa y prevenir con alertas"],
pasos:[
 {t:"info", eti:"Caso 1", h:"«La API va lenta desde el lunes»",
  c:`<ol><li>pg_stat_statements: una consulta nueva de búsqueda de pedidos consume el 60% del tiempo total.</li>
     <li>EXPLAIN ANALYZE: Seq Scan sobre 8 millones de filas filtrando por <code>cliente_id</code> y <code>estado</code>.</li>
     <li>Solución: <code>CREATE INDEX CONCURRENTLY ON pedidos (cliente_id, estado)</code>. De 900 ms a 2 ms.</li>
     <li>Prevención: revisar el SQL generado en las pull requests y alertas de latencia por endpoint.</li></ol>`},
 {t:"opcion", p:"Caso 2: todas las peticiones que tocan la tabla <code>pedidos</code> se quedan colgadas. En pg_stat_activity ves un <code>ALTER TABLE</code> esperando y detrás cientos de consultas. ¿Qué pasa?",
  ops:["La red","El ALTER espera un bloqueo exclusivo detrás de una transacción larga, y todas las consultas nuevas se ponen en cola detrás del ALTER","Falta un índice","VACUUM"],
  ok:1, why:"Por eso las migraciones usan lock_timeout: si no consiguen el bloqueo rápido, fallan en vez de bloquear a todos."},
 {t:"opcion", p:"Caso 3: la aplicación falla con «FATAL: sorry, too many clients already» en los picos. ¿Qué haces?",
  ops:["Subir max_connections a 5000","Revisar el tamaño de los pools por instancia, buscar fugas de conexiones y poner PgBouncer si hay muchas instancias","Reiniciar PostgreSQL cada hora","Quitar el pool"],
  ok:1, why:"Más conexiones no significa más rendimiento: con demasiadas, PostgreSQL empeora."},
 {t:"opcion", p:"Caso 4: el disco de la base de datos crece sin parar aunque el número de filas es estable. ¿Qué sospechas?",
  ops:["Logs de la aplicación","Bloat: autovacuum no consigue limpiar, a menudo por una transacción abierta durante días o una réplica con hot_standby_feedback bloqueando","Índices nuevos","El WAL es normal"],
  ok:1, why:"Busca la transacción más antigua en pg_stat_activity y los slots de replicación inactivos."},
 {t:"par", p:"Empareja cada síntoma con la primera herramienta que usarías",
  pares:[["Consultas lentas en general","pg_stat_statements"],["Una consulta concreta lenta","EXPLAIN ANALYZE"],["Peticiones colgadas","pg_stat_activity y pg_locks"],["Disco que crece","Tamaños de tablas y transacciones antiguas"]],
  why:"Medir antes de tocar nada."}
]},

{
id:"sq13l3",
titulo:"Simulacro de entrevista de SQL",
claves:["Has repasado las preguntas más frecuentes de bases de datos","Sabes explicar joins, índices, transacciones y diseño","Estás preparado para entrevistas de backend y datos"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Diferencia entre WHERE y HAVING?»",
  ops:["Ninguna","WHERE filtra filas antes de agrupar; HAVING filtra grupos después de agregar","HAVING es más rápido","WHERE solo sirve con números"],
  ok:1, why:"Y ejemplo: HAVING COUNT(*) > 5."},
 {t:"opcion", p:"«¿Diferencia entre INNER JOIN y LEFT JOIN?»",
  ops:["Son iguales","INNER solo devuelve filas con pareja en ambas tablas; LEFT conserva todas las de la izquierda y rellena con NULL","LEFT es más rápido siempre","INNER admite NULL"],
  ok:1, why:"Menciona el patrón LEFT JOIN ... IS NULL para encontrar filas sin pareja."},
 {t:"opcion", p:"«¿Qué es un índice y cuándo no conviene crearlo?»",
  ops:["Una copia de la tabla","Una estructura ordenada que acelera búsquedas; no conviene en columnas que no se consultan, en tablas muy pequeñas o si la tabla recibe muchísimas escrituras y el índice no compensa","Siempre conviene","Solo para claves primarias"],
  ok:1, why:"Añadir: el orden en índices compuestos importa y las claves foráneas no se indexan solas en PostgreSQL."},
 {t:"opcion", p:"«Explica ACID»",
  ops:["Un tipo de índice","Atomicidad (todo o nada), Consistencia (restricciones siempre cumplidas), Aislamiento (transacciones concurrentes no se interfieren) y Durabilidad (lo confirmado persiste)","Un comando de PostgreSQL","Un nivel de aislamiento"],
  ok:1, why:"Ilustrarlo con la transferencia bancaria lo hace memorable."},
 {t:"opcion", p:"«¿Qué es el problema N+1 y cómo lo resuelves?»",
  ops:["Un error de sintaxis","Cargar una lista con una consulta y luego hacer una consulta más por cada elemento para su relación; se resuelve con JOIN FETCH, EntityGraph o cargas por lotes","Un tipo de deadlock","Una clave duplicada"],
  ok:1, why:"Pregunta casi segura en entrevistas de Spring con JPA."},
 {t:"opcion", p:"«¿Cómo evitarías la inyección SQL?»",
  ops:["Escapando comillas a mano","Consultas parametrizadas (PreparedStatement, parámetros de JPA), nunca concatenar entrada del usuario, y un usuario de base de datos con mínimos permisos","Con un WAF únicamente","Usando NoSQL"],
  ok:1, why:"Parametrizar es la defensa real; el resto son capas adicionales."},
 {t:"opcion", p:"«¿Normalizar o desnormalizar?»",
  ops:["Siempre desnormalizar","Normalizar por defecto (hasta 3FN) para evitar duplicados y anomalías; desnormalizar de forma puntual y medida para lecturas críticas, asumiendo el coste de mantener la coherencia","Nunca usar claves foráneas","Guardar todo en JSON"],
  ok:1, why:"Una respuesta con matices demuestra experiencia."},
 {t:"info", eti:"Terminado", h:"Has completado SQL y PostgreSQL de cero a experto",
  c:`<p>Dominas consultas, filtros y agregaciones, JOINs, subconsultas y CTEs, diseño y normalización, funciones de ventana, índices y planes de ejecución, transacciones y concurrencia, PostgreSQL avanzado, SQL desde la aplicación y la operación en producción.</p>
     <p>Para consolidarlo: carga un conjunto de datos real (por ejemplo, la base de datos de ejemplo «pagila»), resuelve 20 preguntas de negocio con ventanas y CTEs, y optimiza la más lenta con EXPLAIN ANALYZE. Después conéctala a tu API de Spring Boot con Flyway y revisa el SQL que genera JPA.</p>`}
]}

]});
