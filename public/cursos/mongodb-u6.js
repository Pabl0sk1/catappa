window.CURSOS = window.CURSOS || {};
(CURSOS.mongodb = CURSOS.mongodb || []).push({
titulo: "Producción: réplicas, seguridad y operación",
resumen: "Transacciones, conjuntos de réplicas, sharding, usuarios y roles, copias de seguridad y qué vigilar",
nivel: "Experto",
color: "#46903f",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"mg3l2",
titulo:"Transacciones, réplicas y sharding",
claves:["Operaciones atómicas a nivel de documento; transacciones multidocumento desde la 4.0","Replica set: primario y secundarios con failover; writeConcern majority para durabilidad","Sharding reparte colecciones entre shards según una clave de shard"],
pasos:[
 {t:"info", eti:"Datos seguros y a escala", h:"Réplicas y sharding",
  c:`<div class="dg">
       <div class="dg-tit">replica set</div>
       <div class="dg-flujo">
         <div class="dg-caja acento doble">primario<small>recibe las escrituras</small></div>
         <div class="dg-caja doble">secundario<small>copia</small></div>
         <div class="dg-caja doble">secundario<small>copia</small></div>
       </div>
       <div class="dg-nota">si cae el primario, los demás eligen otro en segundos</div>
       <div class="dg-tit" style="margin-top:14px">sharding</div>
       <div class="dg-flujo">
         <div class="dg-caja acento">mongos</div>
         <div class="dg-caja">shard A</div>
         <div class="dg-caja">shard B</div>
         <div class="dg-caja">shard C</div>
       </div>
       <div class="dg-nota">la clave de shard decide en qué trozo vive cada documento</div>
     </div>
     <div class="termbox">writeConcern: majority   -&gt; confirmado por la mayoria: no se pierde en un failover
readConcern:  majority   -&gt; leer solo datos confirmados

// Spring Data MongoDB
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
  ok:1, why:"Una clave monótona crea un shard caliente para las escrituras."},
 {t:"info", eti:"El coste real", h:"Transacciones: úsalas, pero poco",
  c:`<div class="termbox">const s = db.getMongo().startSession();
s.startTransaction();
try {
  db.cuentas.updateOne({ _id: 1 }, { $inc: { saldo: -100 } }, { session: s });
  db.cuentas.updateOne({ _id: 2 }, { $inc: { saldo:  100 } }, { session: s });
  s.commitTransaction();
} catch (e) { s.abortTransaction(); throw e; }</div>
     <p>Funcionan, pero cuestan: mantienen estado en el servidor, tienen un tiempo máximo (60 segundos por defecto) y no escalan como las operaciones normales.</p>
     <p>La respuesta típica en MongoDB es <b>modelar para no necesitarlas</b>: si dos datos cambian siempre juntos, a menudo deberían estar en el mismo documento.</p>`},
 {t:"vf", p:"Una actualización sobre un solo documento necesita transacción para ser atómica.",
  ok:false, why:"No: ya lo es, aunque toque veinte campos y arrays. Ese es justo el motivo por el que embeber lo que cambia junto simplifica tanto."},
 {t:"opcion", p:"Tu replica set tiene 3 nodos y se cae uno. ¿Qué pasa?",
  ops:["Se para todo","Sigue funcionando: quedan 2 de 3, hay mayoría y puede elegir primario","Se pierden datos","Pasa a solo lectura para siempre"],
  ok:1, why:"Por eso los replica sets tienen número impar: para que siempre pueda haber mayoría."},
 {t:"opcion", p:"¿Cuándo hace falta sharding de verdad?",
  ops:["Siempre que haya más de un millón de documentos","Cuando los datos o la carga no caben en un solo servidor por mucho que lo agrandes: antes de eso, índices y modelado","Cuando hay varias colecciones","Nunca"],
  ok:1, why:"Sharding añade complejidad de por vida. La mayoría de los sistemas no lo necesitan."}
]},

/* =============== U6 L2 =============== */
{
id:"mg6l1",
titulo:"Seguridad: usuarios, roles y red",
claves:["Autenticación activada siempre, también en desarrollo","Roles por base de datos y por acción: mínimo privilegio","La base nunca expuesta a internet; TLS y cifrado en reposo si aplica"],
pasos:[
 {t:"info", eti:"Lo primero", h:"Usuarios y roles",
  c:`<div class="termbox">use admin
db.createUser({ user: "admin", pwd: passwordPrompt(), roles: [ "root" ] })

use tienda
db.createUser({ user: "api", pwd: passwordPrompt(),
                roles: [ { role: "readWrite", db: "tienda" } ] })
db.createUser({ user: "informes", pwd: passwordPrompt(),
                roles: [ { role: "read", db: "tienda" } ] })

// arrancar con autenticacion
mongod --auth --bind_ip 127.0.0.1,10.0.0.5</div>
     <p>La aplicación no se conecta como <code>root</code>. Nunca. El usuario de la API solo necesita leer y escribir <b>su</b> base.</p>`},
 {t:"par", p:"Empareja cada rol con quién debería tenerlo",
  pares:[["read","Un panel de informes"],["readWrite","La aplicación"],["dbAdmin","Quien gestiona índices y estadísticas"],["root","Solo administración, y casi nunca"],["clusterMonitor","Un sistema de monitorización"]],
  why:"Un usuario por función, con lo mínimo. Así un token filtrado no se lleva todo por delante."},
 {t:"opcion", p:"¿Por qué apareció en su día una oleada de MongoDB «secuestrados» pidiendo rescate?",
  ops:["Un fallo del motor","Estaban expuestas a internet y sin autenticación: cualquiera podía conectarse, copiar los datos y borrarlos","Un virus de Windows","Usaban sharding"],
  ok:1, why:"Red privada, <code>--auth</code> y <code>--bind_ip</code> son el mínimo absoluto."},
 {t:"vf", p:"Con <code>--bind_ip 0.0.0.0</code> MongoDB escucha en todas las interfaces.",
  ok:true, why:"Y si además está en una máquina con IP pública y sin cortafuegos, la base está en internet. Es la receta exacta del desastre."},
 {t:"info", eti:"Más capas", h:"TLS, cifrado y auditoría",
  c:`<ul><li><b>TLS</b> entre la aplicación y la base, y entre los nodos del replica set: si no, las credenciales y los datos viajan en claro por la red interna.</li>
     <li><b>Cifrado en reposo</b>: útil si alguien se lleva el disco o una copia de seguridad; no protege de un atacante que ya tiene credenciales.</li>
     <li><b>Auditoría</b> (en versiones empresariales): quién hizo qué. En entornos regulados, no es opcional.</li>
     <li><b>Campos sensibles</b>: lo que no necesites en claro, cífralo o no lo guardes. Una contraseña se guarda con bcrypt o Argon2, jamás tal cual.</li></ul>`},
 {t:"opcion", p:"Una cadena de conexión con usuario y contraseña acaba en el repositorio. ¿Qué haces primero?",
  ops:["Borrar el commit","Cambiar la contraseña de ese usuario: asume que ya la han leído; después, limpiar el historial","Poner el repositorio privado","Nada, era de desarrollo"],
  ok:1, why:"Revocar primero, limpiar después. El orden inverso es el error habitual."},
 {t:"escribe", p:"Escribe la creación de un usuario <code>lectura</code> con rol <code>read</code> sobre la base <code>tienda</code> (usa <code>passwordPrompt()</code> como contraseña)",
  sol:["db.createUser({ user: \"lectura\", pwd: passwordPrompt(), roles: [ { role: \"read\", db: \"tienda\" } ] })","db.createUser({user:\"lectura\",pwd:passwordPrompt(),roles:[{role:\"read\",db:\"tienda\"}]})"],
  pista:"createUser recibe user, pwd y roles.",
  why:"<code>passwordPrompt()</code> evita que la contraseña quede en el historial del shell."}
]},

/* =============== U6 L3 =============== */
{
id:"mg3l3",
titulo:"Operar MongoDB",
claves:["Copias con mongodump o instantáneas; en Atlas, copias continuas con restauración a un instante","Vigilar operaciones lentas (profiler), conexiones, retraso de réplicas y uso de caché","El working set debe caber en memoria: si no, todo se va al disco"],
pasos:[
 {t:"par", p:"Empareja cada tarea con la herramienta",
  pares:[["Copia lógica de una base","mongodump / mongorestore"],["Consultas lentas","Database profiler y explain"],["Estado del replica set","rs.status()"],["Servicio gestionado con copias y escalado","MongoDB Atlas"],["Métricas en Prometheus","mongodb_exporter"]],
  why:"Como con PostgreSQL: copias probadas, monitorización y mínimo privilegio."},
 {t:"opcion", p:"Aparecen miles de bases MongoDB «secuestradas» con una nota de rescate. ¿Qué tenían en común?",
  ops:["Una versión antigua de Java","Estaban expuestas a internet sin autenticación","Usaban sharding","Tenían índices"],
  ok:1, why:"Red privada, autenticación y roles son lo mínimo."},
 {t:"vf", p:"Leer de los secundarios de un replica set siempre devuelve el último dato escrito.",
  ok:false, why:"Pueden ir con retraso. Para leer lo último, lee del primario (o usa readConcern y sesiones causales)."},
 {t:"info", eti:"El número que lo explica todo", h:"El working set y la memoria",
  c:`<p>MongoDB guarda en memoria los datos e índices que más se usan (el <i>working set</i>). Mientras quepa, todo va rapidísimo. Cuando no cabe, cada consulta va al disco y el rendimiento se cae por un acantilado, sin aviso.</p>
     <div class="termbox">db.serverStatus().wiredTiger.cache
// "bytes currently in the cache", "maximum bytes configured"
// y sobre todo: "pages read into cache" subiendo sin parar = falta memoria</div>
     <p>Por eso un índice que sobra no es solo espacio en disco: ocupa memoria que necesita otra cosa.</p>`},
 {t:"info", eti:"Ver qué está pasando", h:"Operaciones lentas y en curso",
  c:`<div class="termbox">// registrar las consultas de mas de 100 ms
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)

// que se esta ejecutando ahora mismo
db.currentOp({ secs_running: { $gt: 3 } })
db.killOp(&lt;opid&gt;)      // cortar una consulta desbocada</div>`},
 {t:"opcion", p:"Una consulta lleva 20 minutos bloqueando el sistema. ¿Qué haces?",
  ops:["Reiniciar MongoDB","Localizarla con db.currentOp y cortarla con db.killOp, y luego mirar por qué era tan cara","Esperar","Borrar la colección"],
  ok:1, why:"Reiniciar el servidor es la reacción más cara y la que más riesgo tiene."},
 {t:"vf", p:"Una copia de seguridad que nunca se ha restaurado sirve como copia de seguridad.",
  ok:false, why:"No lo sabes hasta que la pruebas. La prueba de restauración, con fecha y resultado, es parte de la copia."}
]},

/* =============== U6 L4 =============== */
{
id:"mg6l2",
titulo:"Copias, restauración y desastres",
claves:["mongodump es una copia lógica; las instantáneas del disco, una física","Restaurar a un instante concreto requiere oplog o un servicio que lo ofrezca","Ensaya la restauración: es la única forma de saber cuánto tardas en volver"],
pasos:[
 {t:"info", eti:"Dos formas de copiar", h:"Lógica o física",
  c:`<div class="termbox">// logica: exporta documentos (lenta con datos grandes, muy portable)
mongodump --uri="mongodb://..." --db=tienda --gzip --out=/copias/2026-09-22
mongorestore --uri="mongodb://..." --gzip --drop /copias/2026-09-22

// fisica: instantanea del volumen (rapida, ata a la misma version y plataforma)
//   - snapshot del disco con la base parada o con journal consistente
//   - en Atlas: copias continuas y restauracion a un instante</div>`},
 {t:"par", p:"Empareja cada estrategia con su punto fuerte",
  pares:[["mongodump","Portable entre versiones y máquinas"],["Instantánea de disco","Rápida con volúmenes grandes"],["Oplog guardado","Restaurar hasta el minuto antes del desastre"],["Réplica retrasada","Un nodo que va 1 hora por detrás: salva de un borrado accidental"]],
  why:"La réplica retrasada es la que salva del error humano, que es el desastre más común."},
 {t:"opcion", p:"Un replica set de tres nodos, ¿es una copia de seguridad?",
  ops:["Sí, hay tres copias","No: si alguien ejecuta deleteMany por error, se replica a los tres en un segundo","Sí, si está en otra región","Depende del disco"],
  ok:1, why:"La réplica protege de fallos de hardware, no de errores ni de ataques. Son cosas distintas."},
 {t:"info", eti:"Los dos números", h:"RPO y RTO",
  c:`<p>Antes de diseñar copias, contesta dos preguntas con números:</p>
     <ul><li><b>RPO</b> (cuántos datos puedes perder): ¿una hora de pedidos? ¿cinco minutos? Eso decide cada cuánto copias y si guardas el oplog.</li>
     <li><b>RTO</b> (cuánto puedes estar caído): ¿dos horas? Eso decide si te vale restaurar un dump de 400 GB… que tarda seis.</li></ul>
     <p>Sin esos dos números, cualquier plan de copias es una opinión.</p>`},
 {t:"vf", p:"<code>mongorestore --drop</code> borra las colecciones antes de restaurarlas.",
  ok:true, why:"Muy útil y muy peligroso: si apuntas al servidor equivocado, te llevas por delante los datos buenos."},
 {t:"opcion", p:"Alguien ha borrado por error una colección hace 20 minutos y tienes copia de anoche. ¿Qué te salva los 20 minutos?",
  ops:["Nada","El oplog: restaurar la copia y reproducir las operaciones hasta justo antes del borrado","Los índices","El replica set"],
  ok:1, why:"Es lo que hacen los servicios gestionados cuando ofrecen «restauración a un instante»."},
 {t:"info", eti:"Ensayo", h:"El simulacro que casi nadie hace",
  c:`<p>Una vez al trimestre: coge la copia de anoche, restáurala en una máquina aparte y <b>cronometra</b>. Comprueba que los datos están, que la aplicación arranca contra ella y apunta el tiempo total.</p>
     <p>Ese número es tu RTO real. Casi siempre es mucho peor de lo que se creía, y es mejor descubrirlo un martes por la mañana que durante un incidente.</p>`}
]}

]});
