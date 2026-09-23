window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Documentos y colecciones",
resumen: "Qué es MongoDB, documentos BSON, el CRUD con mongosh y cómo se consulta de verdad",
nivel: "Fundamentos",
color: "#5fb35a",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"mg1l1",
titulo:"Bases de datos de documentos",
claves:["MongoDB guarda documentos parecidos a JSON (BSON) en colecciones","Cada documento puede tener una estructura distinta; _id lo identifica","Útil cuando los datos se leen como un todo y su forma varía"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Documentos en vez de filas",
  c:`<div class="termbox">// un pedido con sus lineas, en un solo documento
{
  "_id": ObjectId("66f0c1..."),
  "cliente": { "id": 7, "nombre": "Ana" },
  "estado": "pagado",
  "lineas": [
    { "sku": "TEC-01", "cantidad": 1, "precio": 89.9 },
    { "sku": "RAT-02", "cantidad": 2, "precio": 24.5 }
  ],
  "total": 138.9,
  "creadoEn": ISODate("2026-09-22T10:02:11Z")
}</div>
     <p>En SQL, ese pedido estaría repartido en tres tablas (pedidos, líneas, clientes) y habría que unirlas. En MongoDB se lee y se escribe de una vez. A cambio, las relaciones entre documentos distintos son menos cómodas.</p>`},
 {t:"par", p:"Empareja cada concepto de MongoDB con su equivalente relacional",
  pares:[["Base de datos","Base de datos"],["Colección","Tabla"],["Documento","Fila (pero con estructura anidada)"],["Campo","Columna"],["_id","Clave primaria"]],
  why:"La gran diferencia: un documento puede contener arrays y subdocumentos."},
 {t:"opcion", p:"¿Cuándo encaja bien MongoDB?",
  ops:["Transacciones bancarias entre muchas tablas relacionadas","Catálogo de productos con atributos muy distintos por categoría que se lee producto a producto","Contabilidad con informes complejos","Nunca"],
  ok:1, why:"Esquemas variables y lectura del documento completo son su punto fuerte."},
 {t:"vf", p:"En una colección de MongoDB todos los documentos deben tener exactamente los mismos campos.",
  ok:false, why:"El esquema es flexible, aunque se puede imponer validación con JSON Schema."},
 {t:"info", eti:"El matiz importante", h:"«Sin esquema» no significa «sin diseño»",
  c:`<p>Que MongoDB no te obligue a declarar el esquema no quiere decir que no lo haya: <b>el esquema está en tu código</b>, en cada sitio donde lees <code>pedido.total</code>.</p>
     <p>La diferencia es quién lo vigila. En SQL, el motor. En MongoDB, tú. Por eso los proyectos serios acaban poniendo <b>validación</b> (lo verás en esta misma unidad) y modelando con la misma disciplina que en SQL.</p>
     <p>El error clásico de quien viene de SQL es el contrario: tratar MongoDB como si fueran tablas, con una colección por entidad y uniones por todas partes. Eso desperdicia lo único que MongoDB hace mejor.</p>`},
 {t:"opcion", p:"Tu equipo lleva seis meses con MongoDB y la mitad de los documentos de <code>usuarios</code> tienen <code>telefono</code> y la otra mitad <code>movil</code>. ¿Qué ha pasado?",
  ops:["Un fallo de MongoDB","Nadie vigilaba el esquema: sin validación ni disciplina, cada trozo de código escribió lo que quiso","La colección está corrupta","Falta un índice"],
  ok:1, why:"Esto pasa de verdad, y arreglarlo después cuesta mucho más que haberlo evitado."},
 {t:"vf", p:"BSON es exactamente JSON.",
  ok:false, why:"BSON es binario y añade tipos que JSON no tiene: fechas, ObjectId, decimales, binarios... Por eso una fecha en MongoDB es una fecha, no un texto."}
]},

/* =============== U1 L2 =============== */
{
id:"mg1l2",
titulo:"CRUD con mongosh",
claves:["insertOne/insertMany, find, updateOne con $set, deleteOne","find devuelve un cursor: .toArray() o iterar","Los operadores de actualización van con $: sin ellos se reemplaza el documento entero"],
pasos:[
 {t:"info", eti:"Las cuatro operaciones", h:"Crear, leer, actualizar y borrar",
  c:`<div class="termbox">use tienda

db.productos.insertOne({ sku: "TEC-01", nombre: "Teclado", precio: 89.9, stock: 12 })
db.productos.insertMany([ { sku: "RAT-02", precio: 24.5 }, { sku: "MON-03", precio: 199 } ])

db.productos.find({ precio: { $lt: 100 } })
db.productos.findOne({ sku: "TEC-01" })

db.productos.updateOne({ sku: "TEC-01" }, { $set: { precio: 79.9 } })
db.productos.deleteOne({ sku: "MON-03" })</div>
     <p><code>use tienda</code> no crea nada: la base de datos y la colección aparecen con la primera escritura.</p>`},
 {t:"term", p:"Inserta un documento en la colección <code>usuarios</code> con <code>nombre: \"ana\"</code>",
  prompt:"test>",
  sol:["db.usuarios.insertOne({ nombre: \"ana\" })","db.usuarios.insertOne({nombre:\"ana\"})","db.usuarios.insertOne({ nombre: 'ana' })","db.usuarios.insertOne({nombre:'ana'})"],
  pista:"db.&lt;colección&gt;.insertOne({ campo: valor })",
  salida:`{
  acknowledged: true,
  insertedId: ObjectId('66f0a1b2c3d4e5f6a7b8c9d0')
}`,
  why:"El <code>_id</code> lo genera MongoDB si no lo pones tú."},
 {t:"term", p:"Busca en <code>usuarios</code> el documento cuyo nombre sea <code>ana</code>, devolviendo solo uno",
  prompt:"test>",
  sol:["db.usuarios.findOne({ nombre: \"ana\" })","db.usuarios.findOne({nombre:\"ana\"})","db.usuarios.findOne({ nombre: 'ana' })","db.usuarios.findOne({nombre:'ana'})"],
  pista:"Como find, pero devolviendo un único documento.",
  salida:`{ _id: ObjectId('66f0a1b2c3d4e5f6a7b8c9d0'), nombre: 'ana' }`,
  why:"<code>findOne</code> devuelve el documento; <code>find</code> devuelve un cursor."},
 {t:"opcion", p:"¿Qué hace <code>db.usuarios.updateOne({ nombre: \"ana\" }, { edad: 31 })</code>, sin <code>$set</code>?",
  ops:["Añade el campo edad","Falla o reemplaza el documento entero, perdiendo los demás campos","Actualiza todos los documentos","Nada"],
  ok:1, why:"En versiones modernas da error; en las antiguas reemplazaba el documento. Con <code>$set</code> se actualiza solo lo que dices."},
 {t:"term", p:"Cambia a 31 la edad del usuario <code>ana</code>, sin tocar el resto de campos",
  prompt:"test>",
  sol:["db.usuarios.updateOne({ nombre: \"ana\" }, { $set: { edad: 31 } })","db.usuarios.updateOne({nombre:\"ana\"},{$set:{edad:31}})","db.usuarios.updateOne({ nombre: 'ana' }, { $set: { edad: 31 } })","db.usuarios.updateOne({nombre:'ana'},{$set:{edad:31}})"],
  pista:"El segundo argumento lleva el operador $set.",
  salida:`{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1
}`,
  why:"<code>matchedCount</code> dice cuántos encontró y <code>modifiedCount</code> cuántos cambiaron de verdad."},
 {t:"opcion", p:"<code>matchedCount: 1</code> pero <code>modifiedCount: 0</code>. ¿Qué significa?",
  ops:["Ha fallado","Encontró el documento, pero ya tenía ese valor: no hubo nada que cambiar","No existe la colección","Faltan permisos"],
  ok:1, why:"Es normal y conviene distinguirlo de «no lo encontré», que sería matchedCount 0."},
 {t:"vf", p:"<code>deleteOne</code> sin filtro borra la colección entera.",
  ok:false, why:"<code>deleteOne({})</code> borra <b>un</b> documento cualquiera. El peligroso es <code>deleteMany({})</code>, que los borra todos."},
 {t:"info", eti:"Costumbre sana", h:"Primero find, después update o delete",
  c:`<p>Antes de un <code>updateMany</code> o un <code>deleteMany</code>, ejecuta el mismo filtro con <code>countDocuments</code> o <code>find</code>:</p>
     <div class="termbox">db.pedidos.countDocuments({ estado: "borrador", creadoEn: { $lt: ISODate("2026-01-01") } })
// 128  &lt;- ¿esperabas 128? entonces sí, borra
db.pedidos.deleteMany({ estado: "borrador", creadoEn: { $lt: ISODate("2026-01-01") } })</div>
     <p>Dos segundos que evitan el borrado del que se habla durante años.</p>`}
]},

/* =============== U1 L3 =============== */
{
id:"mg1l3",
titulo:"Tipos BSON, ObjectId y validación",
claves:["BSON añade tipos a JSON: ObjectId, Date, Decimal128, binarios","ObjectId incluye la fecha de creación: no hace falta un campo aparte para ordenar por antigüedad","JSON Schema permite exigir campos y tipos sin perder flexibilidad"],
pasos:[
 {t:"info", eti:"Tipos", h:"Lo que JSON no tiene",
  c:`<div class="termbox">{
  _id:       ObjectId("66f0c1a2b3c4d5e6f7a8b9c0"),   // 12 bytes: fecha + maquina + contador
  creadoEn:  ISODate("2026-09-22T10:02:11Z"),         // fecha de verdad, no texto
  precio:    NumberDecimal("89.90"),                   // decimal exacto: para dinero
  visitas:   NumberInt(42),
  foto:      BinData(0, "...")
}</div>
     <p>Guardar dinero en <code>double</code> es el mismo error que en cualquier lenguaje: <code>0.1 + 0.2</code> no da <code>0.3</code>. Para dinero, <code>Decimal128</code>.</p>`},
 {t:"par", p:"Empareja cada tipo con para qué se usa",
  pares:[["ObjectId","Identificador único con fecha dentro"],["ISODate","Fechas y horas comparables y ordenables"],["Decimal128","Importes de dinero sin errores de redondeo"],["BinData","Ficheros pequeños o hashes"],["NumberLong","Enteros grandes (más de 2^31)"]],
  why:"Elegir bien el tipo evita conversiones raras y comparaciones que fallan."},
 {t:"vf", p:"Un ObjectId lleva dentro el momento en que se creó el documento.",
  ok:true, why:"Sus primeros 4 bytes son la marca de tiempo: <code>ObjectId.getTimestamp()</code> la devuelve, y ordenar por _id es casi ordenar por antigüedad."},
 {t:"opcion", p:"Guardas fechas como texto <code>\"22/09/2026\"</code>. ¿Qué se rompe?",
  ops:["Nada","Ordenar, comparar rangos y usar operadores de fecha: para MongoDB es un texto cualquiera","Solo la estética","El índice"],
  ok:1, why:"Con ese formato, «22/09/2026» es menor que «3/01/2027» alfabéticamente. Usa ISODate siempre."},
 {t:"info", eti:"Poner reglas", h:"Validación con JSON Schema",
  c:`<div class="termbox">db.createCollection("usuarios", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["email", "creadoEn"],
    properties: {
      email:    { bsonType: "string", pattern: "^.+@.+$" },
      edad:     { bsonType: "int", minimum: 0, maximum: 130 },
      creadoEn: { bsonType: "date" }
    }
  } },
  validationLevel: "strict",       // moderate: solo valida documentos que ya cumplian
  validationAction: "error"        // warn: solo avisa en el log
})</div>
     <p>Así tienes lo mejor de los dos mundos: campos opcionales donde quieres flexibilidad y reglas donde no.</p>`},
 {t:"opcion", p:"Tienes una colección con años de datos sucios y quieres empezar a validar sin romper nada. ¿Qué usas?",
  ops:["strict y error","validationLevel: moderate, que solo aplica a documentos nuevos o que ya cumplían","Borrar la colección","Nada"],
  ok:1, why:"<code>moderate</code> es la forma de meter reglas en una colección viva sin bloquear actualizaciones de los documentos viejos."},
 {t:"vf", p:"Si defines <code>required: [\"email\"]</code>, los documentos que ya estaban sin email se borran.",
  ok:false, why:"No se borra nada: la validación afecta a las escrituras, no a lo que ya está guardado."}
]},

/* =============== U1 L4 =============== */
{
id:"mg1l4",
titulo:"Consultar: los operadores de filtro",
claves:["Los operadores llevan $: $gt, $lt, $in, $ne, $exists, $regex","Los filtros se combinan con AND implícito; $or y $and son explícitos","Consultar dentro de subdocumentos se hace con la notación de punto"],
pasos:[
 {t:"info", eti:"Filtrar", h:"El vocabulario de las consultas",
  c:`<div class="termbox">db.productos.find({ precio: { $gt: 50, $lte: 200 } })        // entre 50 (excl.) y 200
db.productos.find({ categoria: { $in: ["teclados", "ratones"] } })
db.productos.find({ stock: { $ne: 0 } })                      // distinto de cero
db.productos.find({ descuento: { $exists: false } })          // el campo no existe
db.productos.find({ nombre: { $regex: /^tec/i } })            // empieza por "tec"

// AND implicito: los dos a la vez
db.productos.find({ categoria: "teclados", precio: { $lt: 100 } })
// OR explicito
db.productos.find({ $or: [ { stock: 0 }, { descatalogado: true } ] })

// dentro de un subdocumento: notacion de punto, entre comillas
db.pedidos.find({ "cliente.nombre": "Ana" })</div>`},
 {t:"par", p:"Empareja cada operador con lo que hace",
  pares:[["$gt / $gte","Mayor que / mayor o igual"],["$in","El valor está en una lista"],["$ne","Distinto de"],["$exists","El campo está (o no está) en el documento"],["$regex","El texto encaja con una expresión regular"],["$nin","No está en la lista"]],
  why:"Con estos seis se resuelven casi todas las consultas del día a día."},
 {t:"term", p:"Busca en <code>productos</code> los que tengan un precio mayor que 100",
  prompt:"tienda>",
  sol:["db.productos.find({ precio: { $gt: 100 } })","db.productos.find({precio:{$gt:100}})"],
  pista:"El operador de «mayor que» va dentro de un objeto, como valor del campo.",
  salida:`[
  { _id: ObjectId('66f0...a1'), sku: 'MON-03', nombre: 'Monitor', precio: 199 },
  { _id: ObjectId('66f0...b2'), sku: 'POR-09', nombre: 'Portatil', precio: 899 }
]`,
  why:"Fíjate en la forma: <code>{ campo: { $operador: valor } }</code>."},
 {t:"opcion", p:"¿Qué devuelve <code>db.usuarios.find({ edad: { $ne: 30 } })</code> si hay documentos sin campo <code>edad</code>?",
  ops:["Solo los que tienen edad distinta de 30","También los que no tienen el campo edad: para MongoDB, «no existe» es distinto de 30","Ninguno","Error"],
  ok:1, why:"Este detalle sorprende a todo el mundo. Si no los quieres, añade <code>edad: { $exists: true, $ne: 30 }</code>."},
 {t:"vf", p:"<code>{ \"cliente.nombre\": \"Ana\" }</code> busca dentro del subdocumento <code>cliente</code>.",
  ok:true, why:"La notación de punto atraviesa subdocumentos y arrays. Las comillas son obligatorias porque la clave lleva un punto."},
 {t:"opcion", p:"Quieres los pedidos del cliente 7 <b>o</b> los de importe mayor de 1000. ¿Cómo se escribe?",
  ops:["{ clienteId: 7, total: { $gt: 1000 } }","{ $or: [ { clienteId: 7 }, { total: { $gt: 1000 } } ] }","{ $in: [7, 1000] }","No se puede"],
  ok:1, why:"La primera opción es un AND: pedidos del cliente 7 que además pasen de 1000."},
 {t:"escribe", p:"Escribe el filtro (solo el objeto) que encuentra documentos cuyo campo <code>estado</code> sea <code>\"pagado\"</code> o <code>\"enviado\"</code>",
  sol:["{ estado: { $in: [\"pagado\", \"enviado\"] } }","{estado:{$in:[\"pagado\",\"enviado\"]}}","{ estado: { $in: ['pagado', 'enviado'] } }","{estado:{$in:['pagado','enviado']}}"],
  pista:"Con $in se evita escribir un $or de dos condiciones sobre el mismo campo.",
  why:"<code>$in</code> es la forma corta y además aprovecha índices igual de bien."},
 {t:"info", eti:"Aviso", h:"Cuidado con $regex",
  c:`<p>Una expresión regular <b>anclada al principio</b> (<code>/^tec/</code>) puede usar un índice. Una que empieza por comodín (<code>/tec/</code> o <code>/.*tec/</code>) <b>no</b>: recorre toda la colección.</p>
     <p>Si necesitas buscar palabras dentro de textos largos, lo correcto es un <b>índice de texto</b> o un buscador aparte, no un <code>$regex</code> sin ancla.</p>`}
]},

/* =============== U1 L5 =============== */
{
id:"mg1l5",
titulo:"Proyección, orden y paginación",
claves:["La proyección elige qué campos vuelven: menos datos por la red","sort, skip y limit ordenan y paginan; skip grande es lento","Paginar por cursor (_id o fecha) escala mucho mejor que skip"],
pasos:[
 {t:"info", eti:"Devolver solo lo necesario", h:"Proyección",
  c:`<div class="termbox">// segundo argumento de find: 1 incluye, 0 excluye
db.productos.find({ categoria: "teclados" }, { nombre: 1, precio: 1, _id: 0 })

// ordenar, saltar y limitar
db.pedidos.find({ clienteId: 7 })
  .sort({ creadoEn: -1 })    // -1 descendente, 1 ascendente
  .skip(20)
  .limit(10)</div>
     <p>Traer el documento entero para usar dos campos es de los desperdicios más comunes: gasta red, memoria y tiempo de serialización.</p>`},
 {t:"term", p:"Devuelve de <code>productos</code> solo el campo <code>nombre</code>, sin el <code>_id</code>",
  prompt:"tienda>",
  sol:["db.productos.find({}, { nombre: 1, _id: 0 })","db.productos.find({},{nombre:1,_id:0})"],
  pista:"El segundo argumento de find es la proyección; el _id sale siempre salvo que lo quites.",
  salida:`[ { nombre: 'Teclado' }, { nombre: 'Raton' }, { nombre: 'Monitor' } ]`,
  why:"<code>_id: 0</code> es la única exclusión que se puede mezclar con inclusiones."},
 {t:"opcion", p:"¿Por qué <code>.skip(100000).limit(10)</code> es lento?",
  ops:["Por el limit","Porque para saltar 100.000 documentos tiene que recorrerlos y descartarlos uno a uno","Porque skip no existe","Por el orden"],
  ok:1, why:"El coste crece con el número de página. Es el problema de paginar con skip en cualquier base de datos."},
 {t:"info", eti:"La forma que escala", h:"Paginar por cursor",
  c:`<div class="termbox">// primera pagina
db.pedidos.find({ clienteId: 7 }).sort({ _id: -1 }).limit(10)

// siguiente: desde el ultimo _id que enseñaste
db.pedidos.find({ clienteId: 7, _id: { $lt: ultimoIdDeLaPagina } })
  .sort({ _id: -1 }).limit(10)</div>
     <p>Así cada página cuesta lo mismo, sea la primera o la mil. Es lo que hacen los «cargar más» de las aplicaciones grandes.</p>`},
 {t:"vf", p:"Ordenar por un campo sin índice puede fallar en MongoDB si hay muchos documentos.",
  ok:true, why:"La ordenación en memoria tiene un límite (32 MB por defecto). Con índice, el orden ya viene dado y no hay nada que ordenar."},
 {t:"opcion", p:"Una API devuelve 50 campos por documento y el móvil solo usa 3. ¿Qué haces?",
  ops:["Nada, es igual","Proyectar los 3 campos: menos datos por la red, menos memoria y respuestas más rápidas","Comprimir","Más índices"],
  ok:1, why:"Es una mejora de una línea que se nota de verdad en móviles y en conexiones lentas."},
 {t:"escribe", p:"Escribe la llamada que devuelve los 5 pedidos más recientes de la colección <code>pedidos</code> (ordenados por <code>creadoEn</code> descendente)",
  sol:["db.pedidos.find().sort({ creadoEn: -1 }).limit(5)","db.pedidos.find().sort({creadoEn:-1}).limit(5)","db.pedidos.find({}).sort({ creadoEn: -1 }).limit(5)","db.pedidos.find({}).sort({creadoEn:-1}).limit(5)"],
  pista:"find, luego sort con -1, luego limit.",
  why:"Este trío (find, sort, limit) es el 80% de las consultas de una aplicación."}
]}

]});
