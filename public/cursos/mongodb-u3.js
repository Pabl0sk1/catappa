window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Agregaciones, transacciones y escala",
resumen: "El pipeline de agregación, transacciones multidocumento, conjuntos de réplicas, sharding y Spring Data MongoDB",
nivel: "Avanzado",
color: "#4d9949",
lecciones: [

{
id:"mg3l1",
titulo:"El pipeline de agregación",
claves:["Una agregación es una cadena de etapas: $match, $group, $sort, $project, $lookup, $unwind","$match pronto para aprovechar índices y reducir datos","$lookup une colecciones (como un LEFT JOIN)"],
pasos:[
 {t:"info", eti:"Analizar datos", h:"Etapas",
  c:`<div class="termbox">// facturacion por categoria en septiembre, de mayor a menor
db.pedidos.aggregate([
  { $match: { estado: "pagado", creadoEn: { $gte: ISODate("2026-09-01"), $lt: ISODate("2026-10-01") } } },
  { $unwind: "$lineas" },
  { $group: { _id: "$lineas.categoria",
              total: { $sum: { $multiply: ["$lineas.precio", "$lineas.cantidad"] } },
              pedidos: { $addToSet: "$_id" } } },
  { $project: { total: 1, numPedidos: { $size: "$pedidos" } } },
  { $sort: { total: -1 } }
])</div>`},
 {t:"par", p:"Empareja cada etapa con su equivalente en SQL",
  pares:[["$match","WHERE"],["$group","GROUP BY"],["$sort","ORDER BY"],["$project","La lista del SELECT"],["$lookup","LEFT JOIN"],["$unwind","Una fila por cada elemento de un array"]],
  why:"Si conoces SQL, las agregaciones se aprenden rápido."},
 {t:"opcion", p:"¿Por qué conviene poner <code>$match</code> al principio del pipeline?",
  ops:["Por estilo","Porque puede usar índices y reduce los documentos que procesan las etapas siguientes","Porque es obligatorio","Porque ordena"],
  ok:1, why:"Filtrar pronto: la misma idea que en los streams de Java."}
]},

{
id:"mg3l2",
titulo:"Transacciones, réplicas y sharding",
claves:["Operaciones atómicas a nivel de documento; transacciones multidocumento desde la 4.0","Replica set: primario y secundarios con failover; writeConcern majority para durabilidad","Sharding reparte colecciones entre shards según una clave de shard"],
pasos:[
 {t:"info", eti:"Datos seguros y a escala", h:"Réplicas y sharding",
  c:`<div class="diag">REPLICA SET   primario (escrituras) + 2 secundarios (copias, lecturas opcionales)
              si cae el primario, se elige otro en segundos
              writeConcern: majority  -&gt; confirmado en la mayoria: no se pierde
              readConcern:  majority  -&gt; leer solo datos confirmados

SHARDING      mongos (enrutador) -&gt; shard A | shard B | shard C
              clave de shard: { clienteId: "hashed" } reparte uniformemente</div>
     <div class="termbox">// Spring Data MongoDB
public interface PedidoRepo extends MongoRepository&lt;Pedido, String&gt; {
    List&lt;Pedido&gt; findByClienteIdOrderByCreadoEnDesc(long clienteId, Pageable p);
}

@Transactional     // transaccion multidocumento (requiere replica set)
public void transferir(...) { ... }</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Replica set","Grupo de nodos con los mismos datos y failover automático"],["writeConcern majority","La escritura se confirma cuando la tiene la mayoría"],["Clave de shard","Decide en qué shard vive cada documento"],["mongos","Enrutador que envía cada consulta a los shards adecuados"],["Transacción multidocumento","Varias escrituras en varios documentos, todas o ninguna"]],
  why:"Si un diseño necesita muchas transacciones multidocumento, quizá encaja mejor una base relacional."},
 {t:"opcion", p:"¿Qué clave de shard evitarías para una colección de eventos que crece sin parar?",
  ops:["{ usuarioId: \"hashed\" }","{ creadoEn: 1 } (creciente): todas las escrituras nuevas irían al mismo shard","{ _id: \"hashed\" }","Una clave compuesta bien repartida"],
  ok:1, why:"Una clave monótona crea un shard caliente para las escrituras."}
]},

{
id:"mg3l3",
titulo:"Operar MongoDB",
claves:["Copias con mongodump o instantáneas; en Atlas, copias continuas con restauración a un instante","Vigilar operaciones lentas (profiler), conexiones, retraso de réplicas y uso de caché","Seguridad: autenticación, roles, TLS y nada expuesto a internet"],
pasos:[
 {t:"par", p:"Empareja cada tarea con la herramienta",
  pares:[["Copia lógica de una base","mongodump / mongorestore"],["Consultas lentas","Database profiler y explain"],["Estado del replica set","rs.status()"],["Servicio gestionado con copias y escalado","MongoDB Atlas"],["Métricas en Prometheus","mongodb_exporter"]],
  why:"Como con PostgreSQL: copias probadas, monitorización y mínimo privilegio."},
 {t:"opcion", p:"Aparecen miles de bases MongoDB «secuestradas» con una nota de rescate. ¿Qué tenían en común?",
  ops:["Una versión antigua de Java","Estaban expuestas a internet sin autenticación","Usaban sharding","Tenían índices"],
  ok:1, why:"Red privada, autenticación y roles son lo mínimo."},
 {t:"vf", p:"Leer de los secundarios de un replica set siempre devuelve el último dato escrito.",
  ok:false, why:"Pueden ir con retraso. Para leer lo último, lee del primario (o usa readConcern y sesiones causales)."}
]}

]});
