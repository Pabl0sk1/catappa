window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Agregación: los informes",
resumen: "El pipeline etapa a etapa, uniones con $lookup, $facet y agregaciones que aguantan datos de verdad",
nivel: "Avanzado",
color: "#4d9949",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"mg3l1",
titulo:"El pipeline de agregación",
claves:["Una agregación es una cadena de etapas: $match, $group, $sort, $project, $lookup, $unwind","$match pronto para aprovechar índices y reducir datos","$group construye el resultado con acumuladores: $sum, $avg, $max, $push"],
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
])</div>
     <p>Cada etapa recibe lo que soltó la anterior. Es exactamente la idea de una tubería de Unix, aplicada a documentos.</p>`},
 {t:"par", p:"Empareja cada etapa con su equivalente en SQL",
  pares:[["$match","WHERE"],["$group","GROUP BY"],["$sort","ORDER BY"],["$project","La lista del SELECT"],["$lookup","LEFT JOIN"],["$unwind","Una fila por cada elemento de un array"]],
  why:"Si conoces SQL, las agregaciones se aprenden rápido."},
 {t:"opcion", p:"¿Por qué conviene poner <code>$match</code> al principio del pipeline?",
  ops:["Por estilo","Porque puede usar índices y reduce los documentos que procesan las etapas siguientes","Porque es obligatorio","Porque ordena"],
  ok:1, why:"Filtrar pronto: la misma idea que en los streams de Java."},
 {t:"info", eti:"Los acumuladores", h:"Qué puede calcular $group",
  c:`<div class="termbox">{ $group: {
    _id: "$categoria",                    // por que agrupamos (null = todo junto)
    total:   { $sum: "$importe" },
    media:   { $avg: "$importe" },
    maximo:  { $max: "$importe" },
    cuantos: { $sum: 1 },                  // contar
    skus:    { $addToSet: "$sku" },         // lista sin repetidos
    primero: { $first: "$creadoEn" }        // requiere haber ordenado antes
} }</div>
     <p><code>_id</code> en <code>$group</code> no es el <code>_id</code> del documento: es <b>la clave por la que agrupas</b>. Confundir esto es el tropiezo número uno.</p>`},
 {t:"opcion", p:"Quieres el total de toda la colección, sin agrupar por nada. ¿Qué pones en <code>_id</code>?",
  ops:["\"$_id\"","null","0","Se omite"],
  ok:1, why:"<code>_id: null</code> mete todos los documentos en un solo grupo."},
 {t:"escribe", p:"Escribe la etapa que cuenta cuántos documentos hay por <code>estado</code> (el campo del contador se llama <code>cuantos</code>)",
  sol:["{ $group: { _id: \"$estado\", cuantos: { $sum: 1 } } }","{$group:{_id:\"$estado\",cuantos:{$sum:1}}}","{ $group: { _id: '$estado', cuantos: { $sum: 1 } } }","{$group:{_id:'$estado',cuantos:{$sum:1}}}"],
  pista:"Para contar se suma 1 por documento.",
  why:"El <code>$</code> delante del nombre del campo significa «el valor de ese campo», no el texto."},
 {t:"vf", p:"El resultado de una agregación siempre cabe en memoria.",
  ok:false, why:"Cada etapa tiene un límite de 100 MB. Con <code>allowDiskUse: true</code> puede usar disco, pero si lo necesitas a menudo, el pipeline (o el modelado) se puede mejorar."},
 {t:"info", eti:"Cómo se depura", h:"Por etapas, de una en una",
  c:`<p>Un pipeline de ocho etapas que no da lo esperado no se depura mirándolo fijamente. Se ejecuta con <b>las dos primeras</b> etapas y un <code>$limit</code>, se mira la salida, y se van añadiendo etapas.</p>
     <div class="termbox">db.pedidos.aggregate([ { $match: {...} }, { $limit: 3 } ])          // ¿entra lo que creo?
db.pedidos.aggregate([ { $match: {...} }, { $unwind: "$lineas" }, { $limit: 3 } ])</div>
     <p>En cinco minutos encuentras la etapa donde se pierde la información.</p>`}
]},

/* =============== U5 L2 =============== */
{
id:"mg5l1",
titulo:"$lookup y $unwind a fondo",
claves:["$lookup trae documentos de otra colección: es el LEFT JOIN de MongoDB","Sin $unwind, el resultado del lookup es siempre un array","Un $lookup sin índice en la colección de destino es carísimo"],
pasos:[
 {t:"info", eti:"Unir colecciones", h:"La forma de $lookup",
  c:`<div class="termbox">db.pedidos.aggregate([
  { $lookup: {
      from: "clientes",            // coleccion de destino
      localField: "clienteId",     // campo de aqui
      foreignField: "_id",         // campo de alli
      as: "cliente"                // donde se guarda: SIEMPRE un array
  } },
  { $unwind: "$cliente" },          // lo convierte en objeto (y descarta si no hubo)
  { $project: { total: 1, "cliente.nombre": 1 } }
])</div>
     <p>Detalle que sorprende: aunque solo encaje un documento, <code>as</code> es un array de uno. Por eso casi siempre va seguido de <code>$unwind</code>.</p>`},
 {t:"opcion", p:"Tras un <code>$lookup</code> sin <code>$unwind</code>, ¿qué contiene el campo <code>cliente</code>?",
  ops:["El documento del cliente","Un array con los documentos que encajaron (vacío si no hubo ninguno)","El _id","Nada"],
  ok:1, why:"Y si lo tratas como objeto en el código, obtienes <code>undefined</code> sin que nadie te avise."},
 {t:"info", eti:"Cuidado", h:"$unwind descarta los vacíos",
  c:`<div class="termbox">// por defecto: si el array esta vacio, el documento DESAPARECE del resultado
{ $unwind: "$cliente" }

// para que se comporte como un LEFT JOIN de verdad:
{ $unwind: { path: "$cliente", preserveNullAndEmptyArrays: true } }</div>
     <p>Este detalle explica informes donde «faltan pedidos»: eran los que no tenían cliente asociado.</p>`},
 {t:"vf", p:"<code>$unwind</code> sobre un array de 5 elementos produce 5 documentos.",
  ok:true, why:"Uno por elemento, repitiendo el resto de campos. Es justo lo que permite agrupar después por algo que está dentro del array."},
 {t:"opcion", p:"Un <code>$lookup</code> sobre una colección de 10 millones va lentísimo. ¿Qué miras primero?",
  ops:["La memoria","Si existe un índice sobre el foreignField de la colección de destino","El tamaño del documento","La versión"],
  ok:1, why:"Sin índice, cada documento de entrada provoca un recorrido completo de la otra colección."},
 {t:"par", p:"Empareja cada situación con la decisión correcta",
  pares:[["Necesito el nombre del cliente en cada pedido, siempre","Copiar el nombre en el pedido (referencia extendida) y ahorrarse el lookup"],["Un informe mensual que cruza dos colecciones","$lookup está bien: se ejecuta pocas veces"],["Un lookup en cada petición de la web","Señal de que el modelado no encaja con las consultas"],["Lookup con condiciones complejas","La forma con pipeline dentro del $lookup"]],
  why:"En MongoDB, necesitar uniones constantemente suele ser una pista de modelado, no un problema de rendimiento."},
 {t:"escribe", p:"Escribe la etapa <code>$unwind</code> del campo <code>lineas</code> que conserve los pedidos sin líneas",
  sol:["{ $unwind: { path: \"$lineas\", preserveNullAndEmptyArrays: true } }","{$unwind:{path:\"$lineas\",preserveNullAndEmptyArrays:true}}","{ $unwind: { path: '$lineas', preserveNullAndEmptyArrays: true } }","{$unwind:{path:'$lineas',preserveNullAndEmptyArrays:true}}"],
  pista:"La forma larga de $unwind es un objeto con path y opciones.",
  why:"La diferencia entre un informe correcto y uno al que le faltan filas sin que nadie sepa por qué."}
]},

/* =============== U5 L3 =============== */
{
id:"mg5l2",
titulo:"$facet, $bucket y formas de agrupar",
claves:["$facet ejecuta varios pipelines a la vez sobre los mismos datos","$bucket reparte en rangos; $sortByCount cuenta y ordena de una vez","$addFields y $set añaden campos calculados sin perder los demás"],
pasos:[
 {t:"info", eti:"Varias respuestas de una vez", h:"$facet",
  c:`<div class="termbox">// la tipica pagina de resultados: los productos, el total y las facetas
db.productos.aggregate([
  { $match: { categoria: "teclados" } },
  { $facet: {
      resultados: [ { $sort: { precio: 1 } }, { $limit: 20 } ],
      total:      [ { $count: "n" } ],
      porMarca:   [ { $sortByCount: "$marca" } ],
      porPrecio:  [ { $bucket: { groupBy: "$precio",
                                 boundaries: [ 0, 50, 100, 200, 1000 ],
                                 default: "mas",
                                 output: { n: { $sum: 1 } } } } ]
  } }
])</div>
     <p>Una sola consulta en lugar de cuatro. Es como se construyen los filtros laterales de cualquier tienda.</p>`},
 {t:"par", p:"Empareja cada etapa con lo que resuelve",
  pares:[["$facet","Varias agregaciones sobre los mismos datos, en una sola pasada"],["$bucket","Repartir en rangos (precios, edades)"],["$sortByCount","Contar por valor y ordenar de mayor a menor"],["$count","Cuántos documentos quedan"],["$addFields","Añadir un campo calculado sin quitar los demás"]],
  why:"<code>$sortByCount</code> es el atajo de un <code>$group</code> más un <code>$sort</code>."},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>$project</code> y <code>$addFields</code>?",
  ops:["Ninguna","$project decide exactamente qué campos salen; $addFields añade sin quitar nada","$addFields es más lento","$project no existe"],
  ok:1, why:"Con <code>$project</code> se te olvida un campo y desaparece. <code>$addFields</code> (o su alias <code>$set</code>) es más seguro cuando solo quieres añadir."},
 {t:"info", eti:"Campos calculados", h:"Operadores de expresión",
  c:`<div class="termbox">{ $addFields: {
    totalLinea: { $multiply: ["$precio", "$cantidad"] },
    esCaro:     { $gt: ["$precio", 100] },
    mes:        { $dateToString: { format: "%Y-%m", date: "$creadoEn" } },
    nombre:     { $concat: ["$nombre", " ", "$apellidos"] },
    seguro:     { $ifNull: ["$descuento", 0] }
} }</div>
     <p>Fíjate en la forma: dentro de una expresión, los operadores reciben <b>arrays</b> de argumentos. Es otra sintaxis distinta a la de los filtros, y confundirlas es normal al principio.</p>`},
 {t:"vf", p:"Agrupar por mes se hace con <code>$dateToString</code> o con <code>$dateTrunc</code>.",
  ok:true, why:"Cualquiera de los dos sirve: convertir la fecha a «2026-09» y agrupar por ese texto, o truncarla al mes y agrupar por la fecha."},
 {t:"opcion", p:"Necesitas «los 20 primeros resultados y además cuántos hay en total». ¿Cómo lo haces en una sola consulta?",
  ops:["Dos consultas","Con $facet: una rama con sort y limit, y otra con $count","Con $lookup","No se puede"],
  ok:1, why:"Además de ser una sola ida y vuelta, garantiza que el total corresponde exactamente a los mismos datos."},
 {t:"escribe", p:"Escribe la etapa que cuenta cuántos productos hay de cada marca, ordenados de más a menos",
  sol:["{ $sortByCount: \"$marca\" }","{$sortByCount:\"$marca\"}","{ $sortByCount: '$marca' }","{$sortByCount:'$marca'}"],
  pista:"Hay una etapa que hace las dos cosas de golpe.",
  why:"Equivale a <code>$group</code> con <code>$sum: 1</code> más <code>$sort</code> descendente."}
]},

/* =============== U5 L4 =============== */
{
id:"mg5l3",
titulo:"Agregaciones que aguantan datos de verdad",
claves:["El límite de 100 MB por etapa se levanta con allowDiskUse, pero conviene evitarlo","$merge y $out guardan el resultado en una colección: informes precalculados","Las vistas guardan un pipeline con nombre y se consultan como una colección"],
pasos:[
 {t:"info", eti:"Cuando los datos crecen", h:"Guardar el resultado",
  c:`<div class="termbox">// escribir el resultado en una coleccion (la reemplaza)
db.pedidos.aggregate([ ...etapas... , { $out: "ventas_por_mes" } ])

// o mezclarlo con lo que ya hay (incremental, lo normal en informes)
db.pedidos.aggregate([ ...etapas... , { $merge: {
   into: "ventas_por_mes", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } } ])</div>
     <p>Con esto, el informe pesado se calcula una vez por la noche y la web solo lee una colección pequeña ya resumida.</p>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["$out","Reemplazar entera una colección de resultados"],["$merge","Actualizar un informe de forma incremental"],["Vista","Guardar un pipeline con nombre y consultarlo como una colección"],["allowDiskUse","Permitir que una etapa use disco si pasa de 100 MB"],["$limit temprano","Reducir datos cuanto antes"]],
  why:"Precalcular es la respuesta habitual cuando un informe tarda demasiado para pedirlo en vivo."},
 {t:"opcion", p:"Un informe mensual tarda 40 segundos y lo abre todo el mundo cada mañana. ¿Qué haces?",
  ops:["Más CPU","Calcularlo una vez con $merge en una colección de resultados y que la web lea de ahí","Quitar etapas","Cachear en el navegador"],
  ok:1, why:"Nadie necesita recalcular lo mismo cien veces. Esto es, en pequeño, lo que hace un almacén de datos."},
 {t:"info", eti:"Vistas", h:"Un pipeline con nombre",
  c:`<div class="termbox">db.createView("pedidos_pagados", "pedidos", [
  { $match: { estado: "pagado" } },
  { $project: { clienteId: 1, total: 1, creadoEn: 1 } }
])

db.pedidos_pagados.find({ clienteId: 7 })   // se consulta como una coleccion normal</div>
     <p>Las vistas son de solo lectura y se calculan al consultarlas: no ocupan espacio, pero tampoco ahorran trabajo. Sirven para simplificar y para dar acceso limitado a ciertos datos.</p>`},
 {t:"vf", p:"Una vista de MongoDB guarda los datos.",
  ok:false, why:"No: ejecuta el pipeline cada vez. Si quieres datos guardados, eso es <code>$merge</code> o <code>$out</code> (lo que en SQL sería una vista materializada)."},
 {t:"opcion", p:"Te aparece el error de que una etapa pasa de 100 MB. ¿Cuál es la <b>mejor</b> primera reacción?",
  ops:["Poner allowDiskUse y olvidarlo","Mirar si se puede filtrar antes, proyectar menos campos o apoyarse en un índice: el disco es el último recurso","Subir el límite","Partir la colección"],
  ok:1, why:"<code>allowDiskUse</code> soluciona el error, pero un pipeline que llega a 100 MB en una etapa casi siempre está trayendo cosas que no necesita."},
 {t:"escribe", p:"Escribe la etapa final que guarda el resultado en la colección <code>informe_mensual</code>, reemplazándola",
  sol:["{ $out: \"informe_mensual\" }","{$out:\"informe_mensual\"}","{ $out: 'informe_mensual' }","{$out:'informe_mensual'}"],
  pista:"La etapa que «saca» el resultado a una colección.",
  why:"Debe ser la última del pipeline: después de ella no puede ir nada."}
]}

]});
