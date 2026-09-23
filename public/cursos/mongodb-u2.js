window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Escribir datos",
resumen: "Actualizar con operadores, trabajar con arrays, upsert, borrados seguros y escrituras masivas",
nivel: "Fundamentos",
color: "#5aae55",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"mg2l4",
titulo:"Actualizar de verdad: $set, $inc y compañía",
claves:["$set cambia campos, $unset los quita, $inc suma y $rename renombra","updateOne cambia uno; updateMany, todos los que encajan","Una actualización sobre un documento es atómica, aunque toque varios campos"],
pasos:[
 {t:"info", eti:"Operadores de actualización", h:"Cambiar sin reemplazar",
  c:`<div class="termbox">db.productos.updateOne({ sku: "TEC-01" }, {
  $set:   { precio: 79.9, "stock.almacen": 8 },   // cambia o crea
  $unset: { descuentoAntiguo: "" },                // quita el campo
  $inc:   { visitas: 1, stock: -1 },               // suma (o resta)
  $min:   { precioMinimo: 79.9 },                  // solo si es menor
  $currentDate: { actualizadoEn: true }            // pone la fecha de ahora
})

db.productos.updateMany({ categoria: "teclados" }, { $inc: { precio: 5 } })</div>
     <p>Todo eso ocurre en una sola operación atómica sobre el documento: o se aplica entero o no se aplica.</p>`},
 {t:"par", p:"Empareja cada operador con lo que hace",
  pares:[["$set","Cambia el valor de un campo (y lo crea si no está)"],["$unset","Elimina el campo del documento"],["$inc","Suma una cantidad, que puede ser negativa"],["$rename","Cambia el nombre de un campo"],["$currentDate","Guarda la fecha y hora actuales"],["$mul","Multiplica el valor"]],
  why:"Con estos se resuelve casi todo sin leer el documento antes."},
 {t:"term", p:"Suma 1 al campo <code>visitas</code> del producto con <code>sku</code> igual a <code>TEC-01</code>",
  prompt:"tienda>",
  sol:["db.productos.updateOne({ sku: \"TEC-01\" }, { $inc: { visitas: 1 } })","db.productos.updateOne({sku:\"TEC-01\"},{$inc:{visitas:1}})","db.productos.updateOne({ sku: 'TEC-01' }, { $inc: { visitas: 1 } })","db.productos.updateOne({sku:'TEC-01'},{$inc:{visitas:1}})"],
  pista:"El operador de incremento suma al valor que ya hay.",
  salida:`{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }`,
  why:"Contar así evita la carrera clásica de leer, sumar en el código y volver a escribir: si dos peticiones lo hacen a la vez, una de las dos visitas se pierde."},
 {t:"opcion", p:"Dos peticiones simultáneas hacen <code>$inc: { stock: -1 }</code> sobre el mismo producto. ¿Qué pasa?",
  ops:["Se pierde una resta","Las dos se aplican: el servidor las serializa sobre el documento","Error de concurrencia","El documento se bloquea para siempre"],
  ok:1, why:"Por eso los contadores se llevan con <code>$inc</code> y no leyendo y escribiendo desde la aplicación."},
 {t:"vf", p:"<code>updateMany</code> puede dejar la mitad de los documentos actualizados si falla a medias.",
  ok:true, why:"La atomicidad es por documento, no por operación. Si necesitas todo o nada entre varios documentos, hace falta una transacción."},
 {t:"opcion", p:"Quieres subir un 10% el precio de toda una categoría. ¿Qué usas?",
  ops:["Leer todos y actualizar uno a uno desde el código","updateMany con $mul: { precio: 1.1 }","Borrar y volver a insertar","No se puede"],
  ok:1, why:"Una sola orden al servidor, sin traerte los documentos ni arriesgarte a pisar cambios de otros."},
 {t:"escribe", p:"Escribe la actualización que pone <code>activo: false</code> en <b>todos</b> los usuarios cuyo campo <code>ultimoAcceso</code> sea menor que <code>corte</code> (usa la variable <code>corte</code>)",
  sol:["db.usuarios.updateMany({ ultimoAcceso: { $lt: corte } }, { $set: { activo: false } })","db.usuarios.updateMany({ultimoAcceso:{$lt:corte}},{$set:{activo:false}})"],
  pista:"updateMany, filtro con $lt y $set en la actualización.",
  why:"Este es el patrón de las tareas de limpieza y de los avisos por inactividad."}
]},

/* =============== U2 L2 =============== */
{
id:"mg2l5",
titulo:"Arrays: el terreno donde todos tropiezan",
claves:["$push añade, $pull quita por criterio, $addToSet añade solo si no está","$elemMatch exige que un mismo elemento cumpla varias condiciones","El operador posicional $ actualiza el elemento que encontró el filtro"],
pasos:[
 {t:"info", eti:"Modificar arrays", h:"Añadir y quitar",
  c:`<div class="termbox">db.posts.updateOne({ _id: 1 }, { $push: { etiquetas: "docker" } })
db.posts.updateOne({ _id: 1 }, { $addToSet: { etiquetas: "docker" } })   // no duplica
db.posts.updateOne({ _id: 1 }, { $pull: { etiquetas: "wip" } })          // quita por valor
db.posts.updateOne({ _id: 1 }, { $pop: { comentarios: -1 } })            // -1 el primero, 1 el ultimo

// añadir varios y quedarse solo con los 10 ultimos
db.posts.updateOne({ _id: 1 }, {
  $push: { ultimos: { $each: [ {texto:"a"}, {texto:"b"} ], $slice: -10, $sort: { fecha: -1 } } }
})</div>`},
 {t:"par", p:"Empareja cada operador de array con su efecto",
  pares:[["$push","Añade al final, aunque ya esté"],["$addToSet","Añade solo si no estaba"],["$pull","Quita los elementos que cumplen un criterio"],["$pop","Quita el primero o el último"],["$each + $slice","Añade varios y recorta el array a un tamaño"]],
  why:"<code>$push</code> con <code>$slice</code> es la forma de tener «los últimos N» sin que el array crezca sin fin."},
 {t:"info", eti:"Consultar arrays", h:"El detalle que confunde a todo el mundo",
  c:`<div class="termbox">// pedidos con ALGUNA linea de categoria "teclados" Y ALGUNA linea de precio &gt; 100
db.pedidos.find({ "lineas.categoria": "teclados", "lineas.precio": { $gt: 100 } })
//  ^ ojo: pueden ser lineas DISTINTAS

// pedidos con UNA MISMA linea que cumpla las dos cosas
db.pedidos.find({ lineas: { $elemMatch: { categoria: "teclados", precio: { $gt: 100 } } } })</div>
     <p>Sin <code>$elemMatch</code>, cada condición se evalúa contra el array entero por separado. Este malentendido produce informes mal contados que nadie detecta durante meses.</p>`},
 {t:"opcion", p:"Un pedido tiene una línea de teclados a 40 € y otra de monitores a 200 €. ¿Encaja con <code>{ \"lineas.categoria\": \"teclados\", \"lineas.precio\": { $gt: 100 } }</code>?",
  ops:["No","Sí, porque una línea cumple lo primero y otra lo segundo","Solo si están ordenadas","Error"],
  ok:1, why:"Y casi seguro no era lo que querías. Para eso está <code>$elemMatch</code>."},
 {t:"term", p:"Añade la etiqueta <code>mongo</code> al array <code>etiquetas</code> del post con <code>_id: 1</code>, sin duplicarla si ya está",
  prompt:"blog>",
  sol:["db.posts.updateOne({ _id: 1 }, { $addToSet: { etiquetas: \"mongo\" } })","db.posts.updateOne({_id:1},{$addToSet:{etiquetas:\"mongo\"}})","db.posts.updateOne({ _id: 1 }, { $addToSet: { etiquetas: 'mongo' } })","db.posts.updateOne({_id:1},{$addToSet:{etiquetas:'mongo'}})"],
  pista:"El operador que añade «al conjunto», no a la lista.",
  salida:`{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }`,
  why:"Si ya estaba, <code>modifiedCount</code> sería 0: no hay nada que cambiar."},
 {t:"info", eti:"Actualizar dentro del array", h:"El operador posicional",
  c:`<div class="termbox">// sube a "enviada" la linea con sku TEC-01 de ese pedido
db.pedidos.updateOne(
  { _id: 7, "lineas.sku": "TEC-01" },
  { $set: { "lineas.$.estado": "enviada" } }        //  $  = la que encontro el filtro
)

// todas las lineas que cumplan algo: filtros con arrayFilters
db.pedidos.updateOne(
  { _id: 7 },
  { $set: { "lineas.$[l].estado": "cancelada" } },
  { arrayFilters: [ { "l.precio": { $lt: 10 } } ] }
)</div>`},
 {t:"vf", p:"El operador posicional <code>$</code> actualiza todos los elementos del array que encajan.",
  ok:false, why:"Solo el <b>primero</b> que encontró el filtro. Para varios se usan <code>$[]</code> (todos) o <code>arrayFilters</code> (los que cumplan una condición)."},
 {t:"opcion", p:"¿Cuál es el antipatrón clásico con arrays en MongoDB?",
  ops:["Usar $push","Dejar que un array crezca sin límite dentro del documento (comentarios, eventos, logs)","Usar $pull","Tener dos arrays"],
  ok:1, why:"El documento tiene un tope de 16 MB, pero mucho antes de llegar ahí cada lectura ya se vuelve carísima."}
]},

/* =============== U2 L3 =============== */
{
id:"mg2l6",
titulo:"Upsert y borrados que no dan sustos",
claves:["upsert: actualiza si existe y crea si no, en una sola operación atómica","$setOnInsert pone valores solo cuando se crea","findOneAndUpdate devuelve el documento (antes o después) y sirve para colas simples"],
pasos:[
 {t:"info", eti:"Crear o actualizar", h:"Upsert",
  c:`<div class="termbox">db.contadores.updateOne(
  { dia: "2026-09-22" },
  { $inc: { visitas: 1 }, $setOnInsert: { creadoEn: new Date() } },
  { upsert: true }
)
// si no existe el documento del dia, lo crea con visitas: 1 y la fecha
// si existe, solo suma</div>
     <p>Sin <code>upsert</code>, esto serían dos viajes al servidor y una carrera entre peticiones simultáneas: dos podrían comprobar a la vez que «no existe» y crear dos documentos.</p>`},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>$set</code> y <code>$setOnInsert</code> en un upsert?",
  ops:["Ninguna","$set se aplica siempre; $setOnInsert solo cuando el documento se crea","$setOnInsert es más rápido","$set no funciona con upsert"],
  ok:1, why:"Es la forma de poner <code>creadoEn</code> sin pisarlo en cada actualización."},
 {t:"term", p:"Incrementa en 1 el campo <code>visitas</code> del documento con <code>dia: \"2026-09-22\"</code> en <code>contadores</code>, creándolo si no existe",
  prompt:"analitica>",
  sol:["db.contadores.updateOne({ dia: \"2026-09-22\" }, { $inc: { visitas: 1 } }, { upsert: true })","db.contadores.updateOne({dia:\"2026-09-22\"},{$inc:{visitas:1}},{upsert:true})","db.contadores.updateOne({ dia: '2026-09-22' }, { $inc: { visitas: 1 } }, { upsert: true })","db.contadores.updateOne({dia:'2026-09-22'},{$inc:{visitas:1}},{upsert:true})"],
  pista:"El tercer argumento son las opciones.",
  salida:`{
  acknowledged: true,
  matchedCount: 0,
  modifiedCount: 0,
  upsertedId: ObjectId('66f0a1b2c3d4e5f6a7b8c9d0')
}`,
  why:"<code>upsertedId</code> aparece solo cuando ha tenido que crearlo."},
 {t:"info", eti:"Leer y modificar a la vez", h:"findOneAndUpdate",
  c:`<div class="termbox">// coger el siguiente trabajo pendiente y marcarlo como mio, sin que otro lo coja
db.trabajos.findOneAndUpdate(
  { estado: "pendiente" },
  { $set: { estado: "en curso", trabajador: "worker-3", tomadoEn: new Date() } },
  { sort: { creadoEn: 1 }, returnDocument: "after" }
)</div>
     <p>Es una operación atómica: nadie puede coger el mismo trabajo entre la lectura y la escritura. Con esto se hace una cola sencilla sin sistemas extra.</p>`},
 {t:"opcion", p:"¿Por qué <code>findOneAndUpdate</code> es mejor que <code>find</code> y luego <code>updateOne</code> para repartir trabajos?",
  ops:["Es más corto","Porque es atómico: entre el find y el update, otro proceso podría coger el mismo trabajo","Usa menos memoria","No hay diferencia"],
  ok:1, why:"La ventana entre dos operaciones es donde viven los errores de concurrencia."},
 {t:"vf", p:"<code>deleteMany({})</code> borra todos los documentos de la colección.",
  ok:true, why:"Y no pide confirmación. Por eso conviene contar antes, y en producción trabajar con usuarios sin permiso de borrado masivo."},
 {t:"info", eti:"Borrar con cabeza", h:"Borrado lógico y TTL",
  c:`<p>En muchos sistemas no se borra de verdad: se marca (<code>borradoEn: fecha</code>) y las consultas filtran. Así se puede deshacer, auditar y no se rompen referencias.</p>
     <p>Y para lo que sí debe desaparecer solo (sesiones, códigos de un solo uso, cachés), el índice TTL lo hace por ti:</p>
     <div class="termbox">db.sesiones.createIndex({ creadaEn: 1 }, { expireAfterSeconds: 3600 })</div>
     <p>MongoDB pasa cada minuto y borra lo caducado. Sin cron, sin código.</p>`}
]},

/* =============== U2 L4 =============== */
{
id:"mg2l7",
titulo:"Escrituras masivas y durabilidad",
claves:["insertMany y bulkWrite agrupan operaciones en un solo viaje","ordered:false sigue tras un fallo; ordered:true se para","writeConcern decide cuándo se considera confirmada una escritura"],
pasos:[
 {t:"info", eti:"Muchas de golpe", h:"bulkWrite",
  c:`<div class="termbox">db.productos.bulkWrite([
  { insertOne: { document: { sku: "NUE-01", precio: 10 } } },
  { updateOne: { filter: { sku: "TEC-01" }, update: { $inc: { stock: -1 } } } },
  { deleteOne: { filter: { sku: "VIE-99" } } }
], { ordered: false })</div>
     <p>Un solo viaje de ida y vuelta en vez de tres. Con miles de operaciones, la diferencia es de minutos a segundos.</p>`},
 {t:"opcion", p:"¿Qué cambia entre <code>ordered: true</code> y <code>ordered: false</code>?",
  ops:["Nada","Con true se para en el primer fallo; con false sigue con las demás y te informa al final de las que fallaron","false es más lento","true no existe"],
  ok:1, why:"Para importaciones masivas suele interesar <code>false</code>: que entren todas las buenas y te digan cuáles no."},
 {t:"info", eti:"¿Cuándo es «escrito»?", h:"writeConcern",
  c:`<div class="termbox">// confirmado por la mayoria del replica set (no se pierde en un failover)
db.pedidos.insertOne(doc, { writeConcern: { w: "majority", j: true, wtimeout: 5000 } })

// w: 1        -> basta con el primario
// j: true     -> ademas escrito en el journal (disco)
// w: 0        -> ni siquiera espera confirmacion (metricas, logs)</div>`},
 {t:"par", p:"Empareja cada writeConcern con su caso",
  pares:[["w: \"majority\", j: true","Un pago: no se puede perder"],["w: 1","Lo normal en una aplicación web"],["w: 0","Métricas o trazas donde perder alguna da igual"],["wtimeout","Evitar quedarse esperando para siempre si faltan nodos"]],
  why:"Es un mando de durabilidad contra velocidad: se elige según lo que cueste perder ese dato."},
 {t:"vf", p:"Con <code>w: 1</code> una escritura confirmada nunca se pierde.",
  ok:false, why:"Si el primario cae justo después de confirmar y esa escritura no llegó a los secundarios, se pierde en la elección del nuevo primario. Para eso está <code>majority</code>."},
 {t:"opcion", p:"Importas 2 millones de documentos y va lentísimo porque insertas uno a uno desde el código. ¿Qué haces?",
  ops:["Más CPU","Agrupar en lotes con insertMany o bulkWrite (por ejemplo de 1.000) y ordered:false","Quitar todos los índices para siempre","Nada"],
  ok:1, why:"Y un truco extra: crear los índices <b>después</b> de la carga inicial, no antes."},
 {t:"escribe", p:"Escribe la inserción de dos documentos (<code>{ n: 1 }</code> y <code>{ n: 2 }</code>) en la colección <code>datos</code> en una sola operación",
  sol:["db.datos.insertMany([{ n: 1 }, { n: 2 }])","db.datos.insertMany([{n:1},{n:2}])"],
  pista:"El plural de insertOne recibe un array.",
  why:"Un viaje en vez de dos. Con miles, esta diferencia es todo."}
]}

]});
