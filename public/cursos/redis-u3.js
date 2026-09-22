window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Operar Redis",
resumen: "Persistencia RDB y AOF, memoria y políticas de expulsión, replicación, Sentinel y Cluster, seguridad",
nivel: "Avanzado",
color: "#cf423b",
lecciones: [

{
id:"rs3l1",
titulo:"Persistencia y memoria",
claves:["RDB hace instantáneas periódicas; AOF registra cada escritura; se pueden combinar","maxmemory limita la memoria y maxmemory-policy decide qué expulsar","Claves grandes (big keys) y comandos lentos bloquean el hilo principal"],
pasos:[
 {t:"info", eti:"Que no se pierda", h:"RDB y AOF",
  c:`<div class="diag">RDB   instantanea cada X minutos: rapido de restaurar, puede perder los ultimos minutos
AOF   registra cada escritura (fsync cada segundo): pierde como mucho ~1 s
ambos lo habitual si Redis guarda datos que importan

maxmemory 2gb
maxmemory-policy allkeys-lru     # cache: expulsar lo menos usado
maxmemory-policy noeviction      # datos importantes: dar error antes que borrar</div>`},
 {t:"par", p:"Empareja cada política de expulsión con su uso",
  pares:[["allkeys-lru","Caché: expulsar las claves menos usadas recientemente"],["volatile-ttl","Expulsar primero las que tienen TTL más corto"],["noeviction","No borrar nada: errores al escribir cuando se llena"],["allkeys-lfu","Expulsar las usadas con menos frecuencia"]],
  why:"Para una caché, allkeys-lru o allkeys-lfu; para colas o datos, noeviction."},
 {t:"opcion", p:"Redis se congela unos segundos de vez en cuando. SLOWLOG muestra un DEL sobre una lista de 10 millones de elementos. ¿Solución?",
  ops:["Más CPU","Evitar claves gigantes y usar UNLINK (borrado en segundo plano)","Desactivar AOF","Reiniciar Redis"],
  ok:1, why:"Redis ejecuta los comandos en un solo hilo: una operación enorme bloquea a todos."}
]},

{
id:"rs3l2",
titulo:"Alta disponibilidad y seguridad",
claves:["Réplicas para leer y como reserva; Sentinel para failover automático","Redis Cluster reparte las claves en 16.384 slots entre varios nodos","Nunca expuesto a internet: red privada, contraseña o ACL, TLS"],
pasos:[
 {t:"info", eti:"Escalar", h:"Sentinel y Cluster",
  c:`<div class="diag">SENTINEL   un primario + replicas; los sentinels vigilan y promueven una replica si cae
CLUSTER    datos repartidos: hash(clave) -&gt; slot (0..16383) -&gt; nodo
           {usuario:7}:carrito y {usuario:7}:perfil comparten slot (hash tag)
GESTIONADO ElastiCache / MemoryDB en AWS, Memorystore en GCP</div>
     <p>En Cluster, una operación con varias claves solo funciona si todas están en el mismo slot: por eso existen los <b>hash tags</b> entre llaves.</p>`},
 {t:"par", p:"Empareja cada medida con su propósito",
  pares:[["Red privada (sin IP pública)","Que nadie de internet llegue a Redis"],["ACL con usuarios y permisos","Limitar qué comandos y claves usa cada aplicación"],["TLS","Cifrar el tráfico"],["Deshabilitar comandos peligrosos (FLUSHALL, CONFIG)","Evitar desastres por error o ataque"],["Sentinel","Failover automático del primario"]],
  why:"Miles de Redis expuestos sin contraseña han sido comprometidos para minar criptomonedas."},
 {t:"vf", p:"En Redis Cluster, un MGET con claves de usuarios distintos siempre funciona.",
  ok:false, why:"Si caen en slots distintos da error CROSSSLOT; hay que agrupar con hash tags o hacer varias peticiones."}
]},

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
  ok:1, why:"Mide antes de dar por hecho que la caché funciona."}
]}

]});
