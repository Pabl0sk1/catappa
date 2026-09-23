window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Maestría: diseñar y defenderlo",
resumen: "Un caso de diseño completo de principio a fin y el simulacro de entrevista",
nivel: "Maestro",
color: "#428c3e",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"mg7l1",
titulo:"Caso real: diseñar una tienda",
claves:["Se empieza por las consultas, no por las entidades","Cada decisión de modelado se justifica con una consulta concreta","Los índices salen de la lista de consultas, uno por uno"],
pasos:[
 {t:"info", eti:"El encargo", h:"Lo que hay que sostener",
  c:`<p>Una tienda con 200.000 productos, 50.000 pedidos al mes y estas pantallas:</p>
     <ul><li>ficha de producto (la más visitada)</li>
     <li>listado por categoría con filtros de marca y precio</li>
     <li>«mis pedidos» de un cliente, paginado</li>
     <li>detalle de un pedido con sus líneas</li>
     <li>informe mensual de ventas por categoría</li></ul>
     <p>Antes de seguir, piensa tú: ¿qué colecciones harías y qué iría embebido?</p>`},
 {t:"opcion", p:"Las <b>líneas</b> de un pedido: ¿colección aparte o embebidas?",
  ops:["Colección aparte, como en SQL","Embebidas: se leen siempre con el pedido, son pocas y no cambian después","Depende del cliente","En otra base"],
  ok:1, why:"Un pedido con sus líneas es el ejemplo de manual de documento autocontenido."},
 {t:"opcion", p:"El <b>cliente</b> en el pedido: ¿embebido o referenciado?",
  ops:["Embebido entero","Referenciado por id, más una copia de nombre y dirección de envío tal como estaban en la compra","Solo el id","No hace falta"],
  ok:1, why:"El cliente vive por su cuenta y cambia; pero la dirección de envío de ese pedido es un dato histórico y debe quedarse congelada."},
 {t:"info", eti:"El modelo", h:"Cómo queda",
  c:`<div class="termbox">productos  { _id, sku, nombre, categoria, marca, precio, stock, atributos: {...} }
pedidos    { _id, clienteId, estado, creadoEn, total,
             cliente: { id, nombre },                    // copia para la lista
             envio:   { calle, ciudad, cp },             // historico
             lineas:  [ { sku, nombre, categoria, precio, cantidad } ] }
clientes   { _id, email, nombre, creadoEn }
ventas_mes { _id: "2026-09|teclados", total, unidades }   // informe precalculado</div>
     <p>Fíjate en que <code>lineas</code> también copia el nombre y la categoría del producto: el pedido debe poder leerse dentro de diez años aunque el producto ya no exista.</p>`},
 {t:"par", p:"Empareja cada consulta con el índice que necesita",
  pares:[["Ficha por sku","{ sku: 1 } único"],["Listado por categoría ordenado por precio","{ categoria: 1, precio: 1 }"],["Mis pedidos, los más recientes primero","{ clienteId: 1, creadoEn: -1 }"],["Informe mensual por categoría","{ estado: 1, creadoEn: 1 }"],["Buscar por nombre de producto","Índice de texto o buscador aparte"]],
  why:"Cada índice responde a una consulta de la lista. Ningún índice «por si acaso»."},
 {t:"opcion", p:"El informe mensual tarda 30 segundos sobre 600.000 pedidos. ¿Qué haces?",
  ops:["Sharding","Precalcularlo cada noche con una agregación y $merge en ventas_mes","Más RAM","Quitar el informe"],
  ok:1, why:"Y de paso el informe pasa a responder en milisegundos, que es lo que espera quien lo abre."},
 {t:"vf", p:"Duplicar el nombre del producto dentro de la línea del pedido es un error de normalización.",
  ok:false, why:"En SQL lo sería; aquí es lo correcto. El pedido es un documento histórico: si el producto cambia de nombre o se borra, el pedido debe seguir siendo legible."}
]},

/* =============== U7 L2 =============== */
{
id:"mg4l1",
titulo:"Simulacro de entrevista de MongoDB",
claves:["Sabes cuándo encaja una base de documentos y cuándo no","Modelas según los patrones de acceso","Conoces índices, agregaciones, réplicas y sharding"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿MongoDB o PostgreSQL para un nuevo sistema de pedidos?»",
  ops:["MongoDB siempre","Depende: PostgreSQL si hay muchas relaciones, transacciones e informes flexibles; MongoDB si los datos son documentos autocontenidos con estructura variable y se leen enteros. PostgreSQL con jsonb cubre muchos casos mixtos","PostgreSQL nunca escala","Da igual"],
  ok:1, why:"Una respuesta con criterio, no de moda."},
 {t:"opcion", p:"«¿Cómo modelarías usuarios y sus pedidos?»",
  ops:["Todos los pedidos dentro del usuario","Colecciones separadas con clienteId en cada pedido (e índice), embebiendo en el pedido las líneas y una copia de los datos de envío","Una colección por pedido","Todo en un único documento global"],
  ok:1, why:"Los pedidos crecen sin límite: se referencian; las líneas se embeben."},
 {t:"opcion", p:"«Una consulta va lenta. ¿Qué haces?»",
  ops:["Reiniciar","explain(\"executionStats\") para ver si hay COLLSCAN y cuántos documentos examina, crear el índice adecuado (regla ESR) y revisar el modelado","Subir la memoria","Cambiar a SQL"],
  ok:1, why:"El mismo método que con PostgreSQL."},
 {t:"opcion", p:"«¿Qué garantiza MongoDB sobre la atomicidad?»",
  ops:["Nada","Atomicidad por documento siempre, y transacciones multidocumento cuando hay replica set, con su coste","Todo es transaccional","Solo con sharding"],
  ok:1, why:"Y el matiz que gusta oír: por eso se modela para que lo que cambia junto viva junto."},
 {t:"opcion", p:"«¿Cuándo NO usarías MongoDB?»",
  ops:["Nunca","Con datos muy relacionales, informes ad-hoc con muchas uniones, o cuando el equipo ya domina SQL y no hay una razón clara para cambiar","Con más de 1 TB","Con Java"],
  ok:1, why:"Saber decir cuándo una herramienta no encaja es lo que separa criterio de entusiasmo."},
 {t:"par", p:"Empareja cada error de modelado con su corrección",
  pares:[["Arrays que crecen sin límite","Colección aparte con referencia"],["Consultas sin índice","Índices diseñados según las consultas"],["Clave de shard monótona","Clave con buen reparto (hashed o compuesta)"],["Escrituras que pueden perderse","writeConcern majority"],["Validación inexistente","JSON Schema en la colección"],["Informes pesados en vivo","Precalcular con $merge"]],
  why:"Esquema flexible no significa sin esquema."},
 {t:"info", eti:"Terminado", h:"Has completado MongoDB",
  c:`<p>Dominas documentos y colecciones, el CRUD completo, consultas con operadores, arrays, modelado embebido y referenciado, migraciones de esquema, índices y explain, agregaciones, réplicas, transacciones, seguridad y copias.</p>
     <p>Para consolidarlo: coge el caso de la tienda de la lección anterior, móntalo en una base local con datos de prueba, crea los índices de la lista y escribe la agregación de ventas por categoría con <code>$merge</code>.</p>`}
]}

]});
