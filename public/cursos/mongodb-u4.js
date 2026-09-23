window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Índices y rendimiento",
resumen: "Cómo se busca de verdad, leer explain, la regla ESR de los índices compuestos e índices especiales",
nivel: "Avanzado",
color: "#4f9e4a",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"mg2l2",
titulo:"Índices: de recorrerlo todo a ir directo",
claves:["Sin índice, una consulta recorre toda la colección (COLLSCAN)","Un índice acelera las lecturas y penaliza un poco las escrituras","El índice se diseña a partir de las consultas reales, no al revés"],
pasos:[
 {t:"info", eti:"Buscar rápido", h:"Qué es un índice aquí",
  c:`<div class="termbox">db.pedidos.createIndex({ clienteId: 1, creadoEn: -1 })
db.pedidos.find({ clienteId: 7 }).sort({ creadoEn: -1 }).limit(10)
  .explain("executionStats")
// winningPlan: IXSCAN { clienteId: 1, creadoEn: -1 }
// totalDocsExamined: 10   nReturned: 10     &lt;- ideal

db.usuarios.createIndex({ email: 1 }, { unique: true })
db.sesiones.createIndex({ creadaEn: 1 }, { expireAfterSeconds: 3600 })   // TTL
db.productos.createIndex({ nombre: "text", descripcion: "text" })</div>
     <p>Un índice es una estructura ordenada aparte que apunta a los documentos. Igual que en SQL: por eso las mismas intuiciones sirven.</p>`},
 {t:"par", p:"Empareja cada tipo de índice con su uso",
  pares:[["Compuesto { clienteId: 1, creadoEn: -1 }","Pedidos de un cliente ordenados por fecha"],["Único","Evitar duplicados (email)"],["TTL","Borrar documentos automáticamente al caducar"],["De texto","Búsqueda de palabras en campos de texto"],["Multikey","Indexar los elementos de un array"]],
  why:"Igual que en SQL: el índice se diseña a partir de las consultas reales."},
 {t:"opcion", p:"explain muestra COLLSCAN con totalDocsExamined: 2.000.000 y nReturned: 5. ¿Qué haces?",
  ops:["Más memoria","Crear un índice que cubra el filtro (y la ordenación) de esa consulta","Reducir la colección","Nada"],
  ok:1, why:"Examinar 2 millones para devolver 5 es la señal de índice que falta."},
 {t:"term", p:"Crea un índice ascendente sobre el campo <code>email</code> de la colección <code>usuarios</code>",
  prompt:"tienda>",
  sol:["db.usuarios.createIndex({ email: 1 })","db.usuarios.createIndex({email:1})"],
  pista:"1 es ascendente, -1 descendente.",
  salida:`email_1`,
  why:"MongoDB devuelve el nombre que le ha puesto al índice: campo y dirección."},
 {t:"vf", p:"Los índices también hacen más lentas las escrituras.",
  ok:true, why:"Cada insert, update o delete tiene que mantener todos los índices de la colección. Por eso no se indexa «por si acaso»."},
 {t:"opcion", p:"¿Qué índice <b>no</b> sirve casi de nada?",
  ops:["Uno sobre email","Uno sobre un campo booleano <code>activo</code> en una colección donde el 99% está activo","Uno compuesto","Uno de fecha"],
  ok:1, why:"Con muy pocos valores distintos (poca cardinalidad), el índice apunta a casi toda la colección: no ahorra trabajo."},
 {t:"info", eti:"Mirar lo que hay", h:"Ver y quitar índices",
  c:`<div class="termbox">db.pedidos.getIndexes()                     // los que hay
db.pedidos.dropIndex("clienteId_1")         // quitar uno
db.pedidos.aggregate([ { $indexStats: {} } ])   // cuantas veces se ha usado cada uno</div>
     <p><code>$indexStats</code> es oro: enseña los índices que nadie usa y que solo están frenando las escrituras.</p>`}
]},

/* =============== U4 L2 =============== */
{
id:"mg4l2",
titulo:"explain: leer lo que hace de verdad",
claves:["winningPlan dice si usó índice (IXSCAN) o recorrió todo (COLLSCAN)","La señal buena: totalDocsExamined parecido a nReturned","Un índice que cubre la consulta ni siquiera lee los documentos (PROJECTION_COVERED)"],
pasos:[
 {t:"info", eti:"La herramienta", h:"Qué mirar en explain",
  c:`<div class="termbox">db.pedidos.find({ clienteId: 7 }).explain("executionStats")

executionStats: {
  nReturned: 10,                 // documentos devueltos
  totalKeysExamined: 10,         // entradas de indice miradas
  totalDocsExamined: 10,         // documentos leidos del disco
  executionTimeMillis: 1,
  winningPlan: { stage: "IXSCAN", indexName: "clienteId_1" }
}</div>
     <p>La comparación que importa: <b>examinados contra devueltos</b>. Si examina 200.000 para devolver 10, algo sobra.</p>`},
 {t:"par", p:"Empareja cada señal de explain con lo que significa",
  pares:[["COLLSCAN","Está recorriendo toda la colección"],["IXSCAN","Está usando un índice"],["SORT","Ordena en memoria: no hay índice para ese orden"],["FETCH","Va a buscar los documentos completos tras el índice"],["PROJECTION_COVERED","El índice bastó: no ha leído ni un documento"]],
  why:"Con estas cinco palabras se diagnostica el 90% de las consultas lentas."},
 {t:"opcion", p:"Aparece la etapa SORT con <code>memLimit</code> y un aviso. ¿Qué significa?",
  ops:["Que va rápido","Que está ordenando en memoria y puede llegar al límite (32 MB): falta un índice que dé ese orden","Que falta RAM en el servidor","Que la colección es pequeña"],
  ok:1, why:"Un índice cuyo orden coincide con el <code>sort</code> elimina esa etapa por completo."},
 {t:"info", eti:"El truco fino", h:"Consultas cubiertas",
  c:`<div class="termbox">db.usuarios.createIndex({ email: 1, nombre: 1 })
db.usuarios.find({ email: "a@b.c" }, { nombre: 1, _id: 0 })
// el indice ya tiene email y nombre: no hace falta leer el documento
// explain -&gt; PROJECTION_COVERED, totalDocsExamined: 0</div>
     <p>Es lo más rápido que puede hacer una base de datos: responder sin tocar los datos. Requiere que <b>todos</b> los campos (filtro y proyección) estén en el índice, y excluir <code>_id</code> si no está.</p>`},
 {t:"vf", p:"<code>explain()</code> sin argumentos ejecuta la consulta.",
  ok:false, why:"Por defecto solo planifica (<code>queryPlanner</code>). Con <code>\"executionStats\"</code> la ejecuta y te da los números reales, que es lo que quieres para diagnosticar."},
 {t:"opcion", p:"Tu consulta tarda 2 segundos y explain dice IXSCAN con totalDocsExamined 150.000 y nReturned 20. ¿Qué pasa?",
  ops:["Todo bien, usa índice","Usa un índice poco selectivo: filtra por él pero luego descarta casi todo; hace falta un índice compuesto que cubra más condiciones","Falta memoria","Hay que reiniciar"],
  ok:1, why:"«Usa índice» no significa «va bien». El número que manda es cuántos documentos examina."},
 {t:"escribe", p:"Escribe la llamada que ejecuta y explica la consulta <code>db.pedidos.find({ clienteId: 7 })</code> con estadísticas reales",
  sol:["db.pedidos.find({ clienteId: 7 }).explain(\"executionStats\")","db.pedidos.find({clienteId:7}).explain(\"executionStats\")","db.pedidos.find({ clienteId: 7 }).explain('executionStats')","db.pedidos.find({clienteId:7}).explain('executionStats')"],
  pista:"explain recibe el modo entre comillas.",
  why:"Este comando es el primero que hay que escribir cuando algo va lento, antes de tocar nada."}
]},

/* =============== U4 L3 =============== */
{
id:"mg4l3",
titulo:"Índices compuestos y la regla ESR",
claves:["En un índice compuesto, el orden de los campos manda","ESR: primero igualdad, después ordenación (sort) y al final rango","Un índice { a, b } sirve para consultas por a, y por a+b, pero no por b sola"],
pasos:[
 {t:"info", eti:"El orden importa", h:"La regla ESR",
  c:`<div class="termbox">// consulta tipica:
db.pedidos.find({ estado: "pagado", total: { $gt: 100 } }).sort({ creadoEn: -1 })
//                 ^ igualdad          ^ rango                  ^ orden

// indice correcto, en ese orden:
db.pedidos.createIndex({ estado: 1, creadoEn: -1, total: 1 })
//                        E            S             R</div>
     <p><b>E</b>quality, <b>S</b>ort, <b>R</b>ange. Poner el rango antes del orden obliga a ordenar en memoria y tira el rendimiento.</p>`},
 {t:"par", p:"Empareja cada parte de la consulta con su sitio en el índice",
  pares:[["Igualdad (estado: \"pagado\")","Primero"],["Ordenación (sort por fecha)","Segundo"],["Rango (total > 100)","Último"],["Campos que no se filtran ni ordenan","Fuera del índice"]],
  why:"Esta regla es la que separa un índice que funciona de uno que parece funcionar."},
 {t:"opcion", p:"Tienes el índice <code>{ a: 1, b: 1 }</code>. ¿Sirve para <code>find({ b: 5 })</code>?",
  ops:["Sí, igual de bien","No: un índice compuesto solo se puede usar desde su prefijo izquierdo (a, o a+b)","Solo si b es numérico","Sí, si hay pocos documentos"],
  ok:1, why:"Es la regla del prefijo. Por eso <code>{ a, b }</code> hace innecesario un índice suelto de <code>a</code>, pero no uno de <code>b</code>."},
 {t:"vf", p:"Tener un índice <code>{ a: 1 }</code> y otro <code>{ a: 1, b: 1 }</code> suele ser redundante.",
  ok:true, why:"El compuesto ya cubre las consultas por <code>a</code>. El suelto solo añade coste de escritura y espacio."},
 {t:"opcion", p:"¿Importa la dirección (1 o -1) en un índice de un solo campo?",
  ops:["Sí, mucho","No: se puede recorrer en los dos sentidos. Importa en los compuestos, cuando ordenas por varios campos en direcciones distintas","Solo en fechas","Solo con sort"],
  ok:1, why:"Para <code>sort({ a: 1, b: -1 })</code> hace falta un índice con esas mismas direcciones (o exactamente las contrarias)."},
 {t:"term", p:"Crea el índice compuesto sobre <code>pedidos</code> con <code>estado</code> ascendente y <code>creadoEn</code> descendente",
  prompt:"tienda>",
  sol:["db.pedidos.createIndex({ estado: 1, creadoEn: -1 })","db.pedidos.createIndex({estado:1,creadoEn:-1})"],
  pista:"Un solo objeto con los dos campos, en el orden correcto.",
  salida:`estado_1_creadoEn_-1`,
  why:"El nombre que devuelve lleva los campos y sus direcciones: útil para identificarlo después."},
 {t:"escribe", p:"Para <code>find({ pais: \"ES\", edad: { $gte: 18 } }).sort({ alta: -1 })</code>, escribe el objeto del índice según la regla ESR",
  sol:["{ pais: 1, alta: -1, edad: 1 }","{pais:1,alta:-1,edad:1}"],
  pista:"Igualdad primero, luego el campo del sort con su dirección, y el rango al final.",
  why:"Si pones <code>edad</code> antes que <code>alta</code>, aparece una etapa SORT en memoria."}
]},

/* =============== U4 L4 =============== */
{
id:"mg4l4",
titulo:"Índices especiales y trabajo en producción",
claves:["Parciales: indexar solo los documentos que importan, y ocupar menos","TTL borra solo; únicos evitan duplicados; de texto buscan palabras","Crear índices en producción, en segundo plano y fuera de hora punta"],
pasos:[
 {t:"info", eti:"Más tipos", h:"Índices que ahorran mucho",
  c:`<div class="termbox">// PARCIAL: solo los pedidos abiertos, que son el 2% de la coleccion
db.pedidos.createIndex({ creadoEn: -1 },
  { partialFilterExpression: { estado: "abierto" } })

// UNICO y parcial a la vez: email unico solo entre los usuarios activos
db.usuarios.createIndex({ email: 1 },
  { unique: true, partialFilterExpression: { activo: true } })

// TEXTO: busqueda por palabras (una coleccion solo puede tener un indice de texto)
db.articulos.createIndex({ titulo: "text", cuerpo: "text" })
db.articulos.find({ $text: { $search: "docker contenedor" } })

// TTL: se borra solo pasado el tiempo
db.codigos.createIndex({ creadoEn: 1 }, { expireAfterSeconds: 900 })</div>`},
 {t:"par", p:"Empareja cada índice especial con su ventaja",
  pares:[["Parcial","Ocupa menos y se mantiene más barato: solo indexa lo que se consulta"],["Único","La base impide duplicados, no tu código"],["De texto","Buscar palabras sin recorrerlo todo"],["TTL","Caducidad automática sin tareas programadas"],["Multikey","Indexa cada elemento de un array"]],
  why:"El parcial es el más infravalorado: en colecciones grandes ahorra gigas."},
 {t:"opcion", p:"Creas un índice único sobre <code>email</code> y falla. ¿Por qué?",
  ops:["Por la versión","Porque ya hay duplicados: hay que limpiarlos antes","Porque email es texto","Porque falta memoria"],
  ok:1, why:"El índice no se crea si los datos actuales lo violan. Primero se buscan los duplicados con una agregación."},
 {t:"info", eti:"Con la base en marcha", h:"Crear índices sin tirar nada",
  c:`<p>Crear un índice sobre una colección enorme lleva tiempo y consume recursos. En un replica set, MongoDB moderno lo hace sin bloquear escrituras, pero sigue costando disco y CPU.</p>
     <div class="termbox">// ver el progreso
db.currentOp({ "command.createIndexes": { $exists: true } })
// cancelar si hace falta
db.adminCommand({ killOp: 1, op: &lt;opid&gt; })</div>
     <p>Reglas de casa: fuera de hora punta, uno a uno, y midiendo antes con <code>explain</code> que ese índice de verdad hacía falta.</p>`},
 {t:"vf", p:"Una colección puede tener varios índices de texto.",
  ok:false, why:"Solo uno (aunque puede cubrir varios campos). Si necesitas búsquedas de texto serias, lo normal es usar Atlas Search o un buscador aparte."},
 {t:"opcion", p:"Una colección de sesiones crece sin parar y nadie borra las viejas. ¿Solución más simple?",
  ops:["Un cron que borre cada noche","Un índice TTL sobre la fecha de creación: MongoDB las borra solo","Más disco","Sharding"],
  ok:1, why:"Menos piezas móviles: no hay tarea que pueda fallar sin que nadie se entere."},
 {t:"escribe", p:"Escribe la creación de un índice TTL sobre <code>creadoEn</code> en <code>sesiones</code> que caduque a la hora (3600 segundos)",
  sol:["db.sesiones.createIndex({ creadoEn: 1 }, { expireAfterSeconds: 3600 })","db.sesiones.createIndex({creadoEn:1},{expireAfterSeconds:3600})"],
  pista:"El segundo argumento son las opciones del índice.",
  why:"Ojo: el campo tiene que ser una fecha de verdad (ISODate), no un texto."}
]}

]});
