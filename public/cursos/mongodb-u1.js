window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Documentos y colecciones",
resumen: "Qué es MongoDB, documentos BSON, colecciones y las operaciones CRUD con mongosh",
nivel: "Fundamentos",
color: "#5fb35a",
lecciones: [

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
  ok:false, why:"El esquema es flexible, aunque se puede imponer validación con JSON Schema."}
]},

{
id:"mg1l2",
titulo:"CRUD con mongosh",
claves:["insertOne/insertMany, find/findOne, updateOne/updateMany, deleteOne/deleteMany","Operadores de consulta: $eq, $gt, $in, $and, $or, $exists","Operadores de actualización: $set, $inc, $push, $pull"],
pasos:[
 {t:"info", eti:"La consola", h:"Operaciones básicas",
  c:`<div class="termbox">use tienda
db.productos.insertOne({ nombre: "Teclado", categoria: "perifericos", precio: 89.9, stock: 25 })
db.productos.find({ categoria: "perifericos", precio: { $lt: 50 } })
db.productos.find({ stock: { $gt: 0 } }, { nombre: 1, precio: 1, _id: 0 })   // proyeccion
db.productos.updateOne({ nombre: "Teclado" }, { $set: { precio: 79.9 }, $inc: { stock: -1 } })
db.pedidos.updateOne({ _id: id }, { $push: { lineas: { sku: "CAB-01", cantidad: 1 } } })
db.productos.deleteMany({ stock: 0, descatalogado: true })
db.productos.countDocuments({ categoria: "monitores" })</div>`},
 {t:"par", p:"Empareja cada operador con su significado",
  pares:[["$gt","Mayor que"],["$in","Está en una lista de valores"],["$set","Asignar un campo"],["$inc","Sumar a un campo numérico"],["$push","Añadir un elemento a un array"]],
  why:"Las actualizaciones con $inc son atómicas: sirven para contadores sin carreras."},
 {t:"term", p:"Busca en la colección <code>productos</code> los documentos con <code>stock</code> igual a 0",
  prompt:"tienda>", sol:["db.productos.find({ stock: 0 })","db.productos.find({stock: 0})","db.productos.find({ stock: { $eq: 0 } })","db.productos.find({stock:0})"],
  pista:"db.coleccion.find con un filtro { campo: valor }.", re:"^db\\.productos\\.find\\(\\{\\s*stock\\s*:\\s*0\\s*\\}\\)$",
  salida:`[ { _id: ObjectId("66f0c2..."), nombre: 'Webcam HD', categoria: 'perifericos', precio: 45, stock: 0 } ]`, why:"El filtro es un documento con los campos que deben coincidir."}
]},

{
id:"mg1l3",
titulo:"Tipos BSON, ObjectId y validación",
claves:["BSON añade tipos a JSON: ObjectId, Date, Decimal128, enteros de 32 y 64 bits","ObjectId incluye una marca de tiempo: se puede ordenar por creación","Validación con JSON Schema en la colección"],
pasos:[
 {t:"info", eti:"Más que JSON", h:"Tipos y validación",
  c:`<div class="termbox">{
  _id: ObjectId("66f0c1a2e4b0f2a1c3d4e5f6"),   // 12 bytes: marca de tiempo + aleatorio + contador
  total: NumberDecimal("138.90"),              // Decimal128 para dinero
  creadoEn: ISODate("2026-09-22T10:02:11Z"),
  unidades: NumberInt(3)
}

db.createCollection("pedidos", { validator: { $jsonSchema: {
  bsonType: "object",
  required: ["clienteId", "total", "estado"],
  properties: {
    estado: { enum: ["pendiente", "pagado", "enviado", "cancelado"] },
    total: { bsonType: "decimal", minimum: 0 }
  }
}}})</div>`},
 {t:"par", p:"Empareja cada tipo BSON con su uso",
  pares:[["ObjectId","Identificador único generado, ordenable por fecha"],["Date","Instantes en UTC"],["Decimal128","Importes de dinero sin errores de redondeo"],["Array","Listas embebidas en el documento"],["$jsonSchema","Reglas que deben cumplir los documentos"]],
  why:"Guardar dinero como double tiene los mismos problemas que en Java y JavaScript."},
 {t:"vf", p:"Del ObjectId se puede obtener la fecha aproximada de creación del documento.",
  ok:true, why:"Sus primeros 4 bytes son una marca de tiempo en segundos."}
]}

]});
