window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Memoria y persistencia",
resumen: "RDB y AOF, cuánta memoria usa de verdad, políticas de expulsión y las claves que bloquean Redis",
nivel: "Avanzado",
color: "#c93f38",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"rs3l1",
titulo:"Persistencia y memoria",
claves:["RDB hace instantáneas periódicas; AOF registra cada escritura; se pueden combinar","maxmemory limita la memoria y maxmemory-policy decide qué expulsar","Claves grandes (big keys) y comandos lentos bloquean el hilo principal"],
pasos:[
 {t:"info", eti:"Que no se pierda", h:"RDB y AOF",
  c:`<div class="dg">
       <div class="dg-cols">
         <div class="dg-col">
           <div class="dg-col-tit">RDB</div>
           <div class="dg-caja acento doble">instantánea cada X minutos<small>rápido de restaurar</small></div>
           <div class="dg-caja aviso doble">puede perder los últimos minutos</div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">AOF</div>
           <div class="dg-caja acento doble">registra cada escritura<small>fsync cada segundo</small></div>
           <div class="dg-caja ok doble">pierde como mucho ~1 segundo</div>
         </div>
       </div>
       <div class="dg-nota">si los datos importan, lo normal es tener los dos</div>
     </div>
     <div class="termbox">maxmemory 2gb
maxmemory-policy allkeys-lru     # cache: expulsar lo menos usado
maxmemory-policy noeviction      # datos importantes: dar error antes que borrar</div>`},
 {t:"par", p:"Empareja cada política de expulsión con su uso",
  pares:[["allkeys-lru","Caché: expulsar las claves menos usadas recientemente"],["volatile-ttl","Expulsar primero las que tienen TTL más corto"],["noeviction","No borrar nada: errores al escribir cuando se llena"],["allkeys-lfu","Expulsar las usadas con menos frecuencia"]],
  why:"Para una caché, allkeys-lru o allkeys-lfu; para colas o datos, noeviction."},
 {t:"opcion", p:"Redis se congela unos segundos de vez en cuando. SLOWLOG muestra un DEL sobre una lista de 10 millones de elementos. ¿Solución?",
  ops:["Más CPU","Evitar claves gigantes y usar UNLINK (borrado en segundo plano)","Desactivar AOF","Reiniciar Redis"],
  ok:1, why:"Redis ejecuta los comandos en un solo hilo: una operación enorme bloquea a todos."},
 {t:"info", eti:"Lo que cuesta guardar", h:"El fork que sorprende",
  c:`<p>Para hacer una instantánea RDB (o reescribir el AOF), Redis hace un <code>fork</code> del proceso. Gracias a la copia al escribir, al principio no duplica memoria… pero cuanto más cambien los datos durante el guardado, <b>más memoria extra</b> necesita.</p>
     <p>Por eso la recomendación clásica: no llenar la máquina más de la mitad si vas a persistir. Con 8 GB de datos en una máquina de 8 GB, el guardado puede acabar matando el proceso.</p>
     <div class="termbox">INFO persistence
# rdb_last_bgsave_status:ok
# aof_rewrite_in_progress:0
# latest_fork_usec:120000   &lt;- 120 ms parado haciendo el fork</div>`},
 {t:"vf", p:"Activar AOF hace que Redis no pueda perder ni un solo dato.",
  ok:false, why:"Con el ajuste normal (<code>everysec</code>) puede perder hasta un segundo. Con <code>always</code> no, pero el rendimiento se desploma."},
 {t:"opcion", p:"Usas Redis solo como caché. ¿Qué persistencia te conviene?",
  ops:["AOF con always","Ninguna o solo RDB ocasional: si se pierde, se recalcula desde la base de datos","AOF y RDB","Depende del tamaño"],
  ok:1, why:"Persistir una caché cuesta CPU y memoria para proteger datos que son desechables por definición."},
 {t:"escribe", p:"Escribe el comando de redis-cli que consulta la política de expulsión configurada",
  sol:["CONFIG GET maxmemory-policy","config get maxmemory-policy"],
  pista:"CONFIG GET seguido del nombre del ajuste.",
  why:"Si responde <code>noeviction</code> y lo estás usando como caché, tienes un problema esperando: al llenarse, las escrituras empezarán a fallar."}
]},

/* =============== U5 L2 =============== */
{
id:"rs5l1",
titulo:"Cuánta memoria usa de verdad",
claves:["used_memory no es lo mismo que la memoria del sistema: hay fragmentación","Cada clave tiene un coste fijo además de su valor","MEMORY USAGE y --bigkeys dicen dónde se va la memoria"],
pasos:[
 {t:"info", eti:"Medir", h:"Los números que importan",
  c:`<div class="termbox">INFO memory
# used_memory_human:1.85G          lo que Redis cree que usa
# used_memory_rss_human:2.40G      lo que el sistema operativo le ha dado
# mem_fragmentation_ratio:1.30     rss / used: por encima de 1,5 hay fragmentacion
# maxmemory_human:2.00G
# evicted_keys:18234               claves expulsadas por falta de memoria

MEMORY USAGE carrito:7             # bytes de una clave concreta
redis-cli --bigkeys                # las mayores por tipo
redis-cli --memkeys                # las que mas memoria ocupan</div>`},
 {t:"par", p:"Empareja cada métrica con lo que te dice",
  pares:[["used_memory","Lo que Redis ha reservado para datos"],["used_memory_rss","Lo que el sistema le ha entregado de verdad"],["mem_fragmentation_ratio","Cuánta memoria se está desperdiciando"],["evicted_keys","Cuántas claves ha tenido que tirar por falta de sitio"],["keyspace_hits / misses","Si la caché está sirviendo de algo"]],
  why:"<code>evicted_keys</code> subiendo es la señal más clara de que Redis se queda pequeño."},
 {t:"opcion", p:"Guardas 10 millones de claves con un número pequeño cada una. ¿Por qué ocupa mucho más de lo que suman los valores?",
  ops:["Por un fallo","Porque cada clave tiene su propio coste fijo (nombre, metadatos, TTL, punteros): decenas de bytes por clave","Por la fragmentación","Por el AOF"],
  ok:1, why:"Por eso agrupar en hashes (un hash con 100 campos en vez de 100 claves) puede ahorrar una barbaridad."},
 {t:"vf", p:"Si <code>evicted_keys</code> no para de crecer, Redis está funcionando como debería.",
  ok:false, why:"Significa que no cabe lo que le pides y está tirando datos continuamente. O sobra basura, o falta memoria, o los TTL están mal."},
 {t:"info", eti:"Ahorrar memoria", h:"Trucos que funcionan",
  c:`<ul><li><b>Nombres de clave más cortos</b>: con millones de claves, <code>u:7:p</code> frente a <code>usuario:7:perfil</code> son megas.</li>
     <li><b>Hashes pequeños</b>: por debajo de cierto tamaño, Redis los guarda en una codificación compacta que ocupa muchísimo menos.</li>
     <li><b>TTL en todo lo que se pueda</b>: la basura que caduca sola no ocupa.</li>
     <li><b>No guardar lo que no se consulta</b>: el histórico va a la base de datos.</li></ul>`},
 {t:"opcion", p:"<code>mem_fragmentation_ratio</code> es 1.8. ¿Qué significa?",
  ops:["Que falta memoria","Que el sistema le ha dado a Redis un 80% más de lo que usa: memoria desperdiciada, normalmente tras muchas expulsiones o borrados","Que hay demasiadas claves","Que el AOF está creciendo"],
  ok:1, why:"Se puede activar la desfragmentación activa, o reiniciar en una ventana de mantenimiento."},
 {t:"escribe", p:"Escribe el comando que consulta cuántos bytes ocupa la clave <code>carrito:7</code>",
  sol:["MEMORY USAGE carrito:7","memory usage carrito:7"],
  pista:"Dos palabras y la clave.",
  why:"Útil para cazar la clave que se comió la memoria sin tener que adivinar."}
]},

/* =============== U5 L3 =============== */
{
id:"rs5l2",
titulo:"Claves grandes y comandos peligrosos",
claves:["Una clave enorme bloquea Redis al leerla, escribirla o borrarla","KEYS, FLUSHALL, SMEMBERS y HGETALL sobre datos grandes son armas cargadas","Partir por rangos y usar los comandos SCAN es la salida"],
pasos:[
 {t:"info", eti:"Lo que congela Redis", h:"Los sospechosos habituales",
  c:`<div class="termbox">KEYS *                 # O(n) sobre TODAS las claves: bloquea
SMEMBERS set-enorme    # devuelve millones de elementos de golpe
HGETALL hash-enorme    # idem
LRANGE lista 0 -1      # idem
DEL lista-de-10M       # liberar esa memoria lleva tiempo
FLUSHALL               # borra todo, sin preguntar
DEBUG SLEEP 10         # literalmente, duerme Redis 10 segundos</div>
     <p>En producción estos comandos se <b>desactivan</b> por configuración o se renombran, y se usan sus alternativas: <code>SCAN</code>, <code>HSCAN</code>, <code>SSCAN</code>, <code>ZSCAN</code> y <code>UNLINK</code>.</p>`},
 {t:"par", p:"Empareja cada comando peligroso con su alternativa",
  pares:[["KEYS patrón","SCAN con MATCH, por lotes"],["HGETALL en hash grande","HSCAN"],["SMEMBERS en set grande","SSCAN"],["DEL de una clave enorme","UNLINK"],["FLUSHALL","Borrado selectivo con SCAN y UNLINK"]],
  why:"Todas hacen lo mismo, pero sin dejar a los demás clientes esperando."},
 {t:"opcion", p:"¿Qué es una «clave caliente» y por qué es un problema en Cluster?",
  ops:["Una clave con TTL corto","Una clave que recibe una parte enorme del tráfico: vive en un solo nodo, así que ese nodo se satura por mucho que añadas más","Una clave grande","Una clave sin TTL"],
  ok:1, why:"Se resuelve replicando el valor en varias claves (sufijo aleatorio) o cacheándolo también en memoria de la aplicación."},
 {t:"vf", p:"Repartir una clave gigante en muchas pequeñas suele mejorar el comportamiento de Redis.",
  ok:true, why:"Operaciones más cortas, menos bloqueo del hilo único y, en Cluster, reparto real entre nodos."},
 {t:"info", eti:"En producción", h:"Protegerse por configuración",
  c:`<div class="termbox"># redis.conf: desactivar o renombrar lo peligroso
rename-command FLUSHALL ""
rename-command KEYS ""
rename-command CONFIG "CONFIG_a8f3c1"

# y limitar lo que puede hacer cada aplicacion con ACL (Redis 6+)
ACL SETUSER api on &gt;clave ~cache:* ~sesion:* +@read +@write -@dangerous</div>
     <p>Con ACL, el usuario de la API solo ve sus prefijos de clave y no puede ejecutar comandos de administración. Es el mínimo privilegio de siempre, aplicado a Redis.</p>`},
 {t:"opcion", p:"Alguien ejecuta <code>KEYS *</code> en el Redis de producción con 20 millones de claves. ¿Qué pasa?",
  ops:["Nada, es rápido","Redis se queda bloqueado varios segundos y toda la aplicación se para","Solo se ralentiza esa consulta","Devuelve error"],
  ok:1, why:"Es el error clásico de una tarde tranquila. Por eso <code>KEYS</code> se desactiva."},
 {t:"escribe", p:"Escribe el comando de redis-cli que busca las claves más grandes por tipo",
  sol:["redis-cli --bigkeys","--bigkeys"],
  pista:"Es una opción de la propia herramienta de línea de comandos.",
  why:"Es lo primero que se ejecuta cuando la memoria sube sin explicación."}
]}

]});
