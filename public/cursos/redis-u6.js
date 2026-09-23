window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Producción: disponibilidad, seguridad y diagnóstico",
resumen: "Réplicas, Sentinel, Cluster, ACL y TLS, qué mirar cuando algo va mal y cómo hacer copias",
nivel: "Experto",
color: "#bf3a33",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"rs3l2",
titulo:"Alta disponibilidad y seguridad",
claves:["Réplicas para leer y como reserva; Sentinel para failover automático","Redis Cluster reparte las claves en 16.384 slots entre varios nodos","Nunca expuesto a internet: red privada, contraseña o ACL, TLS"],
pasos:[
 {t:"info", eti:"Escalar", h:"Sentinel y Cluster",
  c:`<div class="dg">
       <div class="dg-tit">sentinel: un primario con réplicas</div>
       <div class="dg-flujo">
         <div class="dg-caja acento doble">primario<small>escrituras</small></div>
         <div class="dg-caja doble">réplica</div>
         <div class="dg-caja doble">réplica</div>
       </div>
       <div class="dg-nota">los sentinels vigilan y promueven una réplica si el primario cae</div>
       <div class="dg-tit" style="margin-top:14px">cluster: los datos repartidos</div>
       <div class="dg-flujo">
         <div class="dg-caja">slots 0-5460</div>
         <div class="dg-caja">slots 5461-10922</div>
         <div class="dg-caja">slots 10923-16383</div>
       </div>
       <div class="dg-nota">hash(clave) decide el slot, y el slot decide el nodo</div>
     </div>
     <p>En Cluster, una operación con varias claves solo funciona si todas están en el mismo slot: por eso existen los <b>hash tags</b>, <code>{usuario:7}:carrito</code> y <code>{usuario:7}:perfil</code> caen juntas.</p>`},
 {t:"par", p:"Empareja cada medida con su propósito",
  pares:[["Red privada (sin IP pública)","Que nadie de internet llegue a Redis"],["ACL con usuarios y permisos","Limitar qué comandos y claves usa cada aplicación"],["TLS","Cifrar el tráfico"],["Deshabilitar comandos peligrosos (FLUSHALL, CONFIG)","Evitar desastres por error o ataque"],["Sentinel","Failover automático del primario"]],
  why:"Miles de Redis expuestos sin contraseña han sido comprometidos para minar criptomonedas."},
 {t:"vf", p:"En Redis Cluster, un MGET con claves de usuarios distintos siempre funciona.",
  ok:false, why:"Si caen en slots distintos da error CROSSSLOT; hay que agrupar con hash tags o hacer varias peticiones."},
 {t:"opcion", p:"¿Cuándo hace falta Cluster de verdad?",
  ops:["Siempre que haya más de un millón de claves","Cuando los datos no caben en la memoria de una máquina o el tráfico satura un solo nodo; antes de eso, una réplica y buen uso de memoria","Cuando hay dos aplicaciones","Nunca"],
  ok:1, why:"Cluster añade restricciones para siempre (operaciones multiclave, scripts, transacciones). No se entra ahí sin necesitarlo."},
 {t:"info", eti:"Leer de las réplicas", h:"Rápido, pero con letra pequeña",
  c:`<p>Las réplicas sirven para repartir lecturas, pero la replicación es <b>asíncrona</b>: una réplica puede ir unos milisegundos (o segundos, si va cargada) por detrás.</p>
     <p>Consecuencia real: escribes un dato y lo lees inmediatamente de una réplica… y todavía no está. Si eso importa, se lee del primario.</p>
     <div class="termbox">INFO replication
# master_repl_offset:8829213
# slave0:...,offset=8829100,lag=0     &lt;- diferencia y retraso</div>`},
 {t:"opcion", p:"Tras un failover con Sentinel, ¿qué tiene que hacer tu aplicación?",
  ops:["Reiniciarse","Nada si el cliente habla con Sentinel: le pregunta quién es el primario ahora y se reconecta","Cambiar la configuración a mano","Vaciar la caché"],
  ok:1, why:"Por eso los clientes se configuran con la lista de sentinels, no con la IP del primario."},
 {t:"escribe", p:"Escribe el comando que muestra el estado de la replicación",
  sol:["INFO replication","info replication"],
  pista:"El comando de información, con la sección concreta.",
  why:"Es lo primero que se mira cuando se sospecha que una réplica va retrasada."}
]},

/* =============== U6 L2 =============== */
{
id:"rs3l3",
titulo:"Diagnosticar Redis",
claves:["INFO muestra memoria, clientes, persistencia y estadísticas","SLOWLOG lista los comandos lentos; LATENCY DOCTOR explica picos","redis-cli --bigkeys y MEMORY USAGE encuentran claves grandes"],
pasos:[
 {t:"info", eti:"Qué le pasa", h:"Herramientas",
  c:`<div class="termbox">INFO memory              # used_memory_human, fragmentacion
INFO stats               # keyspace_hits / keyspace_misses (tasa de aciertos de la cache)
INFO clients             # connected_clients, blocked_clients
SLOWLOG GET 10           # los 10 comandos mas lentos recientes
MEMORY USAGE carrito:7   # bytes de una clave
redis-cli --bigkeys      # buscar las claves mas grandes por tipo
redis-cli --latency      # medir la latencia continuamente</div>`},
 {t:"par", p:"Empareja cada síntoma con la herramienta",
  pares:[["Picos de latencia puntuales","SLOWLOG y LATENCY DOCTOR"],["Memoria disparada","INFO memory, --bigkeys y MEMORY USAGE"],["La caché no ayuda","keyspace_hits frente a keyspace_misses"],["Demasiadas conexiones","INFO clients y revisar los pools de las aplicaciones"],["Réplica desfasada","INFO replication"]],
  why:"Una tasa de aciertos baja significa que la caché no está sirviendo de mucho: revisa claves y TTL."},
 {t:"opcion", p:"<code>keyspace_misses</code> es cinco veces mayor que <code>keyspace_hits</code>. ¿Qué indica?",
  ops:["Que Redis está roto","Que la caché acierta poco: TTL demasiado corto, claves que no se reutilizan o expulsiones por falta de memoria","Que hay demasiados aciertos","Nada"],
  ok:1, why:"Mide antes de dar por hecho que la caché funciona."},
 {t:"info", eti:"Ver en vivo", h:"MONITOR, con mucho cuidado",
  c:`<div class="termbox">redis-cli MONITOR        # enseña TODOS los comandos que llegan, en tiempo real</div>
     <p>Es la herramienta más útil para entender qué hace tu aplicación de verdad… y también una que puede hundir el rendimiento en un servidor cargado, porque tiene que enviarte cada comando.</p>
     <p>En producción: unos segundos, y fuera. O mejor, <code>SLOWLOG</code> y las métricas.</p>`},
 {t:"term", p:"Pide los 10 comandos más lentos registrados",
  prompt:"127.0.0.1:6379>", sol:["SLOWLOG GET 10","slowlog get 10"],
  pista:"SLOWLOG, la acción y cuántos.",
  salida:`1) 1) (integer) 14
   2) (integer) 1758531200
   3) (integer) 128432
   4) 1) "KEYS"
      2) "*"`,
  why:"128432 microsegundos son 128 ms de Redis parado por un solo <code>KEYS *</code>."},
 {t:"opcion", p:"Tu API va lenta y sospechas de Redis. ¿Cómo lo confirmas o lo descartas rápido?",
  ops:["Reiniciando Redis","Con redis-cli --latency desde la misma red: si la latencia es de microsegundos, el problema está en tu aplicación o en la red","Mirando los logs","Cambiando de caché"],
  ok:1, why:"Casi siempre el problema resulta ser el número de viajes o el pool de conexiones, no Redis."},
 {t:"vf", p:"Un <code>blocked_clients</code> alto siempre indica un problema.",
  ok:false, why:"Si usas <code>BRPOP</code> o <code>XREADGROUP</code> con espera, es normal: son consumidores esperando trabajo. Hay que saber qué es normal en tu sistema."}
]},

/* =============== U6 L3 =============== */
{
id:"rs6l1",
titulo:"Copias, migraciones y actualizaciones",
claves:["El RDB es un fichero: copiarlo es la copia de seguridad","Migrar de una instancia a otra con réplica temporal es lo más seguro","Actualizar de versión mayor pide leer las notas: hay cambios de comportamiento"],
pasos:[
 {t:"info", eti:"Copiar", h:"Qué copiar y cómo",
  c:`<div class="termbox">BGSAVE                          # instantanea en segundo plano
CONFIG GET dir                  # donde deja el dump.rdb
# y se copia ese fichero a otro sitio

# restaurar: parar redis, poner dump.rdb en su sitio, arrancar

# ver cuando fue la ultima copia buena
INFO persistence
# rdb_last_bgsave_status:ok
# rdb_last_save_time:1758531200</div>
     <p>Si Redis es solo caché, no hace falta copia: se repuebla sola. Si guarda colas, sesiones o datos que no están en otro sitio, entonces sí, y con la misma disciplina que cualquier base de datos.</p>`},
 {t:"par", p:"Empareja cada operación con su forma segura",
  pares:[["Mover Redis a otra máquina","Levantar la nueva como réplica, esperar a que sincronice y promoverla"],["Copia de seguridad","Copiar el dump.rdb tras un BGSAVE"],["Vaciar una caché entera","SCAN + UNLINK por prefijo, no FLUSHALL"],["Actualizar de versión mayor","Leer las notas, probar en preproducción y hacerlo con réplica"]],
  why:"La réplica temporal es el truco: migras sin cortar y con marcha atrás."},
 {t:"opcion", p:"¿Por qué migrar con una réplica es mejor que exportar e importar?",
  ops:["Es más rápido de escribir","Porque la réplica se mantiene al día sola: solo hay que cambiar el primario en el momento elegido, con un corte de segundos","Porque copia menos datos","Porque no hace falta parar nada nunca"],
  ok:1, why:"Con exportación e importación, todo lo que cambie durante el proceso se pierde."},
 {t:"vf", p:"Se puede restaurar un dump.rdb de Redis 7 en un Redis 6.",
  ok:false, why:"Hacia atrás no: el formato cambia entre versiones. Hacia delante sí. Es un motivo más para no dejar las versiones muy desfasadas."},
 {t:"info", eti:"Antes de actualizar", h:"Lo que hay que mirar",
  c:`<ul><li><b>Comandos que cambian o desaparecen</b>: cada versión mayor tiene su lista.</li>
     <li><b>Formato de RDB y AOF</b>: hacia delante sí, hacia atrás no.</li>
     <li><b>Valores por defecto</b>: alguna versión cambia políticas de memoria o de persistencia.</li>
     <li><b>La licencia</b>: Redis cambió de licencia en 2024, y por eso existe <b>Valkey</b> (bifurcación libre, compatible). Muchas distribuciones y nubes se han movido allí.</li></ul>`},
 {t:"opcion", p:"Tu Redis solo guarda caché y sesiones. Hay que reiniciarlo para actualizar. ¿Qué preparas?",
  ops:["Nada, es caché","Que la aplicación sobreviva a perder las sesiones (o persistirlas) y que la base de datos aguante el pico de peticiones sin caché","Copia completa","Cluster"],
  ok:1, why:"El «pico de frío» después de vaciar una caché es un incidente clásico: la base recibe de golpe todo el tráfico que Redis absorbía."},
 {t:"escribe", p:"Escribe el comando que lanza una instantánea en segundo plano",
  sol:["BGSAVE","bgsave"],
  pista:"SAVE bloquea; la versión en segundo plano lleva un prefijo.",
  why:"<code>SAVE</code> a secas bloquea Redis hasta terminar: en producción, nunca."}
]}

]});
