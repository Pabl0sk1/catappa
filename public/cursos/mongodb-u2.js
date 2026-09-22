window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Modelado e índices",
resumen: "Embeber o referenciar, patrones de modelado según los accesos, índices compuestos y explain",
nivel: "Intermedio",
color: "#56a651",
lecciones: [

{
id:"mg2l1",
titulo:"Embeber o referenciar",
claves:["Modela según cómo se leen los datos, no según las entidades","Embeber lo que se lee junto y tiene tamaño acotado","Referenciar lo que crece sin límite o se comparte entre muchos documentos"],
pasos:[
 {t:"info", eti:"La decisión clave", h:"Dos formas de relacionar",
  c:`<div class="diag">EMBEBER (dentro del documento)
  pedido { lineas: [...] }            las lineas se leen siempre con el pedido y son pocas
  usuario { direcciones: [...] }

REFERENCIAR (por id, como una clave foranea)
  comentario { postId: ... }          un post puede tener 100.000 comentarios
  pedido { clienteId: ... }           el cliente se comparte y cambia por su cuenta

limite: un documento no puede superar 16 MB</div>`},
 {t:"par", p:"Empareja cada caso con la mejor opción",
  pares:[["Líneas de un pedido","Embeber: se leen siempre con el pedido"],["Comentarios de un post muy popular","Referenciar: colección aparte, crecen sin límite"],["Dirección de envío en el momento de la compra","Embeber una copia en el pedido"],["Autor de miles de artículos","Referenciar por id del autor"],["Preferencias de un usuario","Embeber en el propio usuario"]],
  why:"Copiar la dirección en el pedido es correcto: es un dato histórico de esa compra."},
 {t:"opcion", p:"Guardas todos los comentarios dentro del documento del post y algunos posts se vuelven lentísimos. ¿Qué pasa?",
  ops:["Nada","El documento crece sin límite: cada lectura carga miles de comentarios y se acerca al límite de 16 MB; hay que llevarlos a su propia colección","Falta un índice en el título","MongoDB no admite arrays"],
  ok:1, why:"Arrays que crecen sin límite son un antipatrón clásico."}
]},

{
id:"mg2l2",
titulo:"Índices y rendimiento",
claves:["Sin índice, una consulta recorre toda la colección (COLLSCAN)","Índices compuestos en el orden: igualdad, ordenación, rango (regla ESR)","explain(\"executionStats\") muestra si se usó un índice y cuántos documentos se examinaron"],
pasos:[
 {t:"info", eti:"Buscar rápido", h:"Índices",
  c:`<div class="termbox">db.pedidos.createIndex({ clienteId: 1, creadoEn: -1 })
db.pedidos.find({ clienteId: 7 }).sort({ creadoEn: -1 }).limit(10)
  .explain("executionStats")
// winningPlan: IXSCAN { clienteId: 1, creadoEn: -1 }
// totalDocsExamined: 10   nReturned: 10     &lt;- ideal

db.usuarios.createIndex({ email: 1 }, { unique: true })
db.sesiones.createIndex({ creadaEn: 1 }, { expireAfterSeconds: 3600 })   // TTL: borrado automatico
db.productos.createIndex({ nombre: "text", descripcion: "text" })</div>`},
 {t:"par", p:"Empareja cada tipo de índice con su uso",
  pares:[["Compuesto { clienteId: 1, creadoEn: -1 }","Pedidos de un cliente ordenados por fecha"],["Único","Evitar duplicados (email)"],["TTL","Borrar documentos automáticamente al caducar"],["De texto","Búsqueda de palabras en campos de texto"],["Multikey","Indexar los elementos de un array"]],
  why:"Igual que en SQL: el índice se diseña a partir de las consultas reales."},
 {t:"opcion", p:"explain muestra COLLSCAN con totalDocsExamined: 2.000.000 y nReturned: 5. ¿Qué haces?",
  ops:["Más memoria","Crear un índice que cubra el filtro (y la ordenación) de esa consulta","Reducir la colección","Nada"],
  ok:1, why:"Examinar 2 millones para devolver 5 es la señal de índice que falta."}
]},

{
id:"mg2l3",
titulo:"Patrones de modelado",
claves:["Referencia extendida: copiar los campos que siempre se muestran para evitar uniones","Patrón bucket: agrupar muchos datos pequeños (métricas) en documentos por periodo","Valores calculados guardados para no recalcular en cada lectura"],
pasos:[
 {t:"info", eti:"Diseñar para las lecturas", h:"Patrones habituales",
  c:`<div class="diag">REFERENCIA EXTENDIDA
  pedido { cliente: { id: 7, nombre: "Ana" } }     // nombre copiado: la lista de pedidos no necesita $lookup

BUCKET (series temporales)
  { sensor: 12, hora: 2026-09-22T10:00, lecturas: [ {m: 0, t: 21.3}, {m: 1, t: 21.4}, ... ] }
  // un documento por sensor y hora en vez de uno por lectura

CALCULADO
  post { comentarios: 1532, ultimaActividad: ... }  // se actualiza al comentar con $inc</div>`},
 {t:"par", p:"Empareja cada patrón con el problema que resuelve",
  pares:[["Referencia extendida","Evitar uniones frecuentes para mostrar datos básicos"],["Bucket","Millones de documentos diminutos de series temporales"],["Calculado","Recalcular totales o contadores en cada lectura"],["Subconjunto","Documentos enormes: guardar solo lo más reciente embebido"]],
  why:"La contrapartida: al duplicar datos hay que decidir cómo y cuándo actualizarlos."},
 {t:"opcion", p:"Si el cliente cambia su nombre, ¿qué pasa con la copia en sus pedidos (referencia extendida)?",
  ops:["Se actualiza sola","Queda la antigua salvo que la actualices; a menudo es correcto (el nombre en el momento del pedido) o se actualiza en segundo plano","MongoDB lo impide","Se borra"],
  ok:1, why:"Decide conscientemente si la copia es histórica o debe seguir al original."}
]}

]});
