window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Modelar para las consultas",
resumen: "Embeber o referenciar, patrones de modelado, relaciones muchos a muchos y cómo cambiar el esquema sin parar nada",
nivel: "Intermedio",
color: "#56a651",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"mg2l1",
titulo:"Embeber o referenciar",
claves:["Modela según cómo se leen los datos, no según las entidades","Embeber lo que se lee junto y tiene tamaño acotado","Referenciar lo que crece sin límite o se comparte entre muchos documentos"],
pasos:[
 {t:"info", eti:"La decisión clave", h:"Dos formas de relacionar",
  c:`<div class="dg">
       <div class="dg-cols">
         <div class="dg-col">
           <div class="dg-col-tit">Embeber</div>
           <div class="dg-caja acento doble">pedido { lineas: [ … ] }<small>se leen siempre con el pedido y son pocas</small></div>
           <div class="dg-caja acento doble">usuario { direcciones: [ … ] }<small>tamaño acotado</small></div>
           <div class="dg-nota">una lectura, sin uniones</div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">Referenciar</div>
           <div class="dg-caja doble">comentario { postId }<small>un post puede tener 100.000</small></div>
           <div class="dg-caja doble">pedido { clienteId }<small>el cliente se comparte y cambia por su cuenta</small></div>
           <div class="dg-nota">crece sin límite o se comparte</div>
         </div>
       </div>
       <div class="dg-leyenda"><span><i class="acento"></i>dentro del documento</span><span><i></i>en otra colección</span></div>
     </div>
     <p>El tope duro: un documento no puede pasar de <b>16 MB</b>. Pero mucho antes de eso, un documento enorme ya hace lenta cada lectura.</p>`},
 {t:"par", p:"Empareja cada caso con la mejor opción",
  pares:[["Líneas de un pedido","Embeber: se leen siempre con el pedido"],["Comentarios de un post muy popular","Referenciar: colección aparte, crecen sin límite"],["Dirección de envío en el momento de la compra","Embeber una copia en el pedido"],["Autor de miles de artículos","Referenciar por id del autor"],["Preferencias de un usuario","Embeber en el propio usuario"]],
  why:"Copiar la dirección en el pedido es correcto: es un dato histórico de esa compra."},
 {t:"opcion", p:"Guardas todos los comentarios dentro del documento del post y algunos posts se vuelven lentísimos. ¿Qué pasa?",
  ops:["Nada","El documento crece sin límite: cada lectura carga miles de comentarios y se acerca al límite de 16 MB; hay que llevarlos a su propia colección","Falta un índice en el título","MongoDB no admite arrays"],
  ok:1, why:"Arrays que crecen sin límite son un antipatrón clásico."},
 {t:"info", eti:"La pregunta que decide", h:"¿Cómo lees este dato?",
  c:`<p>Antes de modelar nada, escribe las <b>consultas</b> que va a hacer tu aplicación. Literalmente, en una lista:</p>
     <ul><li>«la ficha del pedido, con sus líneas» → las líneas se embeben</li>
     <li>«los últimos 20 pedidos de un cliente» → pedidos aparte, con índice por cliente</li>
     <li>«todos los comentarios de un post, paginados» → comentarios aparte</li></ul>
     <p>En SQL se modela por entidades y después se consulta. En MongoDB es al revés: <b>se modela a partir de las consultas</b>. Quien no hace ese cambio de chip acaba con Mongo usado como una base relacional peor.</p>`},
 {t:"vf", p:"Duplicar datos en varios documentos está mal en MongoDB.",
  ok:false, why:"A menudo es lo correcto. Lo que hay que decidir es si la copia es histórica (no se actualiza) o debe seguir al original (y entonces, quién la actualiza)."},
 {t:"opcion", p:"Un catálogo tiene productos con hasta 30 atributos distintos según la categoría. ¿Cómo lo modelas?",
  ops:["Una colección por categoría","Un documento por producto con sus atributos dentro: justo el caso donde el esquema flexible gana","Una tabla de atributos como en SQL","No se puede"],
  ok:1, why:"En SQL esto acaba en una tabla de pares clave-valor incomodísima. Aquí es natural."},
 {t:"opcion", p:"¿Cuál es el límite real que hay que vigilar al embeber?",
  ops:["El número de campos","Que el array no crezca sin control: el documento tiene un tope de 16 MB y las lecturas se vuelven caras mucho antes","El nombre de la colección","Los índices"],
  ok:1, why:"Si no puedes responder «¿cuántos como mucho?», probablemente hay que referenciar."}
]},

/* =============== U3 L2 =============== */
{
id:"mg2l3",
titulo:"Patrones de modelado",
claves:["Referencia extendida: copiar los campos que siempre se muestran para evitar uniones","Patrón bucket: agrupar muchos datos pequeños (métricas) en documentos por periodo","Valores calculados guardados para no recalcular en cada lectura"],
pasos:[
 {t:"info", eti:"Diseñar para las lecturas", h:"Patrones habituales",
  c:`<div class="termbox">REFERENCIA EXTENDIDA
  pedido { cliente: { id: 7, nombre: "Ana" } }     // nombre copiado: la lista de pedidos no necesita $lookup

BUCKET (series temporales)
  { sensor: 12, hora: 2026-09-22T10:00, lecturas: [ {m: 0, t: 21.3}, {m: 1, t: 21.4}, ... ] }
  // un documento por sensor y hora en vez de uno por lectura

CALCULADO
  post { comentarios: 1532, ultimaActividad: ... }  // se actualiza al comentar con $inc

SUBCONJUNTO
  post { ultimosComentarios: [ ...10... ] }         // los 10 ultimos embebidos, el resto aparte</div>`},
 {t:"par", p:"Empareja cada patrón con el problema que resuelve",
  pares:[["Referencia extendida","Evitar uniones frecuentes para mostrar datos básicos"],["Bucket","Millones de documentos diminutos de series temporales"],["Calculado","Recalcular totales o contadores en cada lectura"],["Subconjunto","Documentos enormes: guardar solo lo más reciente embebido"]],
  why:"La contrapartida: al duplicar datos hay que decidir cómo y cuándo actualizarlos."},
 {t:"opcion", p:"Si el cliente cambia su nombre, ¿qué pasa con la copia en sus pedidos (referencia extendida)?",
  ops:["Se actualiza sola","Queda la antigua salvo que la actualices; a menudo es correcto (el nombre en el momento del pedido) o se actualiza en segundo plano","MongoDB lo impide","Se borra"],
  ok:1, why:"Decide conscientemente si la copia es histórica o debe seguir al original."},
 {t:"info", eti:"Por qué el bucket funciona", h:"Menos documentos, menos trabajo",
  c:`<p>Un sensor que manda una lectura por minuto produce <b>525.600 documentos al año</b>. Cada documento tiene su <code>_id</code>, su entrada en los índices y su coste al leerlo.</p>
     <p>Agrupando por hora: 8.760 documentos al año, cada uno con 60 lecturas dentro. Las consultas «dame el día de ayer» pasan de 1.440 documentos a 24.</p>
     <p>MongoDB tiene colecciones de series temporales que hacen esto por ti (<code>timeseries</code>), pero entender el patrón sirve para cualquier caso parecido: eventos, logs, marcadores.</p>`},
 {t:"opcion", p:"Tu portada muestra «1.532 comentarios» en cada post. ¿Cómo lo consigues sin contar en cada visita?",
  ops:["Contando con countDocuments cada vez","Guardando el contador en el post y actualizándolo con $inc al comentar (patrón calculado)","Con un índice","Con $lookup"],
  ok:1, why:"Contar un millón de documentos en cada carga de la portada es el camino directo a una web lenta."},
 {t:"vf", p:"El patrón calculado puede desincronizarse del valor real.",
  ok:true, why:"Puede pasar (un borrado que no descuenta, por ejemplo). Por eso se recalcula de vez en cuando con una tarea, y se asume que es un valor «casi exacto»."},
 {t:"escribe", p:"Escribe la actualización que suma 1 al contador <code>comentarios</code> del post con <code>_id: 5</code>",
  sol:["db.posts.updateOne({ _id: 5 }, { $inc: { comentarios: 1 } })","db.posts.updateOne({_id:5},{$inc:{comentarios:1}})"],
  pista:"El patrón calculado se mantiene con $inc.",
  why:"Atómico, barato y sin leer el documento antes."}
]},

/* =============== U3 L3 =============== */
{
id:"mg3l4",
titulo:"Muchos a muchos y documentos que engordan",
claves:["Muchos a muchos: array de ids en el lado que se consulta, o colección intermedia si hay datos de la relación","El array de referencias debe tener un tamaño razonable","Si no sabes cuántos habrá como mucho, no lo embebas"],
pasos:[
 {t:"info", eti:"Relaciones", h:"Tres formas de hacer un muchos a muchos",
  c:`<div class="termbox">// 1) array de ids en el lado que mas se consulta
alumno { _id: 1, nombre: "Ana", cursosIds: [ 10, 11, 12 ] }

// 2) array en los dos lados (duplica, pero evita consultas extra)
curso  { _id: 10, titulo: "Docker", alumnosIds: [ 1, 2, 3 ] }

// 3) coleccion intermedia, cuando la relacion tiene datos propios
matricula { alumnoId: 1, cursoId: 10, nota: 8.5, matriculadoEn: ISODate(...) }</div>
     <p>La tercera es la de toda la vida en SQL, y aquí sigue siendo la correcta en cuanto la relación tiene atributos.</p>`},
 {t:"par", p:"Empareja cada situación con la forma adecuada",
  pares:[["Un alumno con 5 cursos, y siempre se consulta desde el alumno","Array de ids en el alumno"],["Una relación con nota y fecha de matrícula","Colección intermedia"],["Un curso con 50.000 alumnos","Nunca un array: colección intermedia con índice"],["Etiquetas de un artículo","Array de textos embebido"]],
  why:"El tamaño máximo del lado «muchos» es lo que decide."},
 {t:"opcion", p:"¿Por qué no guardar los 50.000 alumnos de un curso en un array dentro del curso?",
  ops:["Porque MongoDB no admite arrays grandes","Porque cada lectura del curso carga 50.000 ids, las actualizaciones reescriben el documento entero y se acerca al límite de 16 MB","Porque no se puede indexar","Porque es feo"],
  ok:1, why:"Y además crece: hoy 50.000, mañana 200.000."},
 {t:"vf", p:"Un array de ids se puede indexar y consultar con <code>$in</code>.",
  ok:true, why:"Los índices sobre arrays se llaman multikey: indexan cada elemento. Funcionan bien si el array es pequeño."},
 {t:"info", eti:"La señal de alarma", h:"Documentos que engordan",
  c:`<p>Un documento que crece con el tiempo obliga a MongoDB a reescribirlo entero cada vez, y a mover los datos cuando ya no caben donde estaban.</p>
     <p>Síntomas: escrituras cada vez más lentas, uso de disco que sube sin motivo, lecturas que traen megas para usar tres campos.</p>
     <p>Regla práctica: si el array puede llegar a <b>cientos</b> de elementos, referencia. Si es de <b>decenas</b> y acotado, embebe.</p>`},
 {t:"opcion", p:"Estás modelando «un usuario y sus notificaciones». ¿Qué haces?",
  ops:["Array de notificaciones en el usuario","Colección aparte con usuarioId e índice, quizá con las 5 últimas embebidas (patrón subconjunto) para la campanita","Todo en un documento global","Una colección por usuario"],
  ok:1, why:"Las notificaciones crecen sin límite; lo que se ve siempre (las últimas) puede embeberse como subconjunto."},
 {t:"escribe", p:"Escribe el filtro que busca en <code>alumnos</code> los que tengan el curso 10 en su array <code>cursosIds</code>",
  sol:["{ cursosIds: 10 }","{cursosIds:10}"],
  pista:"Para buscar un elemento dentro de un array se consulta el campo directamente, como si fuera un valor suelto.",
  why:"MongoDB entiende que si el campo es un array, basta con que <b>alguno</b> de sus elementos coincida."}
]},

/* =============== U3 L4 =============== */
{
id:"mg3l5",
titulo:"Cambiar el esquema con datos dentro",
claves:["Versionar los documentos permite convivir versiones viejas y nuevas","Migración progresiva: leer las dos formas y escribir siempre la nueva","Las migraciones masivas se hacen por lotes, no de una vez"],
pasos:[
 {t:"info", eti:"El problema", h:"Cambiar de forma sin parar el servicio",
  c:`<p>Un día decides partir <code>nombreCompleto</code> en <code>nombre</code> y <code>apellidos</code>. Ya tienes 4 millones de usuarios.</p>
     <p>No puedes parar la aplicación una hora. Tampoco puedes tener la mitad del código leyendo un campo y la otra mitad el otro. Esto se hace en <b>tres pasos</b>.</p>
     <div class="termbox">1. el codigo aprende a leer las dos formas, y escribe SIEMPRE la nueva
2. una tarea en segundo plano convierte los documentos viejos, por lotes
3. cuando no queda ninguno viejo, se quita el codigo de compatibilidad</div>`},
 {t:"opcion", p:"¿Por qué no lanzar un <code>updateMany</code> sobre los 4 millones de golpe?",
  ops:["Porque no funciona","Porque bloquea recursos mucho tiempo, hincha el journal y puede afectar al resto de operaciones: se hace por lotes","Porque updateMany no existe","Porque hay que parar la base"],
  ok:1, why:"Lotes de unos miles, con pausa entre ellos, y se puede reanudar si falla."},
 {t:"info", eti:"Versionar", h:"El campo que te salva",
  c:`<div class="termbox">{ _id: ..., esquema: 2, nombre: "Ana", apellidos: "Ruiz" }

// el codigo:
if (doc.esquema >= 2) { nombre = doc.nombre; }
else { nombre = doc.nombreCompleto.split(" ")[0]; }

// y la migracion por lotes:
db.usuarios.find({ esquema: { $exists: false } }).limit(1000)</div>
     <p>Con un campo <code>esquema</code> sabes en todo momento cuántos documentos quedan por migrar, y puedes parar y reanudar sin miedo.</p>`},
 {t:"vf", p:"Que MongoDB no tenga esquema significa que no hacen falta migraciones.",
  ok:false, why:"Significa que la base no te obliga. Las migraciones siguen existiendo: ahora las gestiona tu código, que es más flexible y también más fácil de olvidar."},
 {t:"par", p:"Empareja cada paso de la migración con su objetivo",
  pares:[["Leer las dos formas","Que nada se rompa mientras conviven"],["Escribir siempre la nueva","Que el problema deje de crecer"],["Convertir por lotes","Terminar sin afectar al servicio"],["Quitar el código antiguo","Que la deuda no se quede para siempre"]],
  why:"El cuarto paso es el que casi nadie hace, y por eso hay código de compatibilidad de hace cinco años en todas partes."},
 {t:"opcion", p:"Añades un campo nuevo obligatorio con validación estricta y empiezan a fallar actualizaciones de documentos viejos. ¿Qué haces?",
  ops:["Quitar la validación","Usar validationLevel: moderate mientras migras, y pasar a strict cuando ya no quede ninguno sin el campo","Borrar los viejos","Ignorar los errores"],
  ok:1, why:"Es exactamente para lo que existe <code>moderate</code>."},
 {t:"escribe", p:"Escribe el filtro que encuentra los documentos que <b>todavía no</b> tienen el campo <code>esquema</code>",
  sol:["{ esquema: { $exists: false } }","{esquema:{$exists:false}}"],
  pista:"El operador que comprueba si un campo está o no está.",
  why:"Con ese filtro y un <code>countDocuments</code> sabes cuánto te queda de migración."}
]}

]});
