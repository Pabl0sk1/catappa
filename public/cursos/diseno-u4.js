window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Datos a escala",
resumen: "SQL o NoSQL, réplicas, particionado y hashing consistente, e índices secundarios en sistemas distribuidos",
nivel: "Intermedio",
color: "#d99c5d",
lecciones: [

{
id:"ds4l1",
titulo:"Elegir la base de datos",
claves:["Relacional por defecto: transacciones, consultas flexibles, integridad","NoSQL cuando el patrón de acceso es simple y la escala o el esquema lo exigen","Cada almacén para lo que hace mejor (persistencia políglota)"],
pasos:[
 {t:"info", eti:"Decidir", h:"SQL y NoSQL",
  c:`<div class="diag">relacional (PostgreSQL)   pedidos, pagos, usuarios: transacciones y relaciones
clave-valor (Redis)       cache, sesiones, contadores, limites de uso
documentos (MongoDB)      catalogos con atributos variables
columnar ancha (Cassandra) escrituras masivas: metricas, mensajes, eventos
busqueda (OpenSearch)     texto completo y filtros facetados
objetos (S3)              ficheros, imagenes, copias
grafos (Neo4j)            relaciones complejas: recomendaciones, fraude</div>`},
 {t:"par", p:"Empareja cada caso con el almacén más adecuado",
  pares:[["Transferencias bancarias","Relacional con transacciones"],["Historial de mensajes de un chat enorme","Columnar ancha (Cassandra)"],["Búsqueda de productos por texto","Motor de búsqueda (OpenSearch)"],["Fotos de perfil","Almacenamiento de objetos"],["Contador de «me gusta» en tiempo real","Redis"]],
  why:"Justificar la elección por patrón de acceso es lo que buscan en la entrevista."},
 {t:"opcion", p:"¿Cuál es una buena respuesta por defecto para la base de datos principal de una aplicación de negocio nueva?",
  ops:["La NoSQL de moda","Una relacional (PostgreSQL) y añadir otros almacenes cuando un patrón de acceso concreto lo justifique","Ficheros JSON","Solo Redis"],
  ok:1, why:"Muchos sistemas enormes empezaron y siguen con PostgreSQL o MySQL bien escalados."}
]},

{
id:"ds4l2",
titulo:"Réplicas y particionado",
claves:["Réplicas: copias para leer más y sobrevivir a fallos; el retraso de replicación es inevitable","Particionado (sharding): repartir los datos entre varias bases por una clave","Hashing consistente minimiza los datos que se mueven al añadir nodos"],
pasos:[
 {t:"info", eti:"Repartir", h:"Sharding",
  c:`<div class="diag">clave de particion: usuario_id
  shard = hash(usuario_id) mod 4
  shard 0: usuarios ...  shard 1: ...  shard 2: ...  shard 3: ...

problema: pasar de 4 a 5 shards cambia casi todos los "mod" -&gt; mover casi todo
hashing consistente: nodos en un anillo; al anadir uno, solo se mueve ~1/N de los datos</div>
     <p>Elegir la <b>clave de partición</b> es crucial: debe repartir bien la carga y hacer que las consultas habituales toquen un solo shard. Particionar por país con la mitad de usuarios en uno crea un shard caliente.</p>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Réplica de lectura","Repartir lecturas y tener una copia lista"],["Sharding","Repartir datos y escrituras entre varias bases"],["Hashing consistente","Mover pocos datos al añadir o quitar nodos"],["Clave de partición","Decide en qué shard vive cada dato"],["Shard caliente","Un shard que recibe mucha más carga que el resto"]],
  why:"Particionar añade complejidad (consultas entre shards, transacciones): se hace cuando hace falta."},
 {t:"opcion", p:"Particionas pedidos por <code>cliente_id</code>. ¿Qué consulta se vuelve cara?",
  ops:["Los pedidos de un cliente","Los pedidos de todos los clientes de un día concreto (hay que preguntar a todos los shards)","Crear un pedido","Borrar un pedido de un cliente"],
  ok:1, why:"Por eso los informes globales suelen ir a un almacén analítico aparte."}
]}

]});
