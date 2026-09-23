window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Patrones con Redis",
resumen: "Caché, sesiones compartidas, limitación de peticiones, bloqueos distribuidos, rankings, colas y pub/sub",
nivel: "Intermedio",
color: "#d0453e",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"rs2l1",
titulo:"Caché y sesiones",
claves:["Cache-aside con TTL; invalidar al escribir","Sesiones compartidas entre réplicas (Spring Session, express-session con Redis)","Serializar en JSON y versionar las claves (producto:v2:42)"],
pasos:[
 {t:"info", eti:"Lo más habitual", h:"Caché en Spring Boot",
  c:`<div class="termbox">spring:
  data:
    redis:
      host: redis
  cache:
    type: redis
    redis:
      time-to-live: 10m

@Cacheable(cacheNames = "productos", key = "#id")
public ProductoDto producto(long id) { ... }

@CacheEvict(cacheNames = "productos", key = "#id")
public void actualizar(long id, CambioProducto c) { ... }</div>
     <p>Con <b>Spring Session</b> y Redis, la sesión HTTP deja de vivir en la memoria de cada réplica: cualquier réplica atiende a cualquier usuario.</p>`},
 {t:"par", p:"Empareja cada práctica con su motivo",
  pares:[["TTL en todas las entradas","Que los datos obsoletos desaparezcan solos"],["Invalidar al escribir","No servir datos viejos tras un cambio"],["Prefijo de versión en la clave","Cambiar el formato sin leer datos antiguos incompatibles"],["Sesiones en Redis","Escalar en horizontal sin sesiones pegajosas"]],
  why:"Todo lo de la unidad de cachés del curso de Diseño de sistemas, aplicado."},
 {t:"vf", p:"Si Redis se cae, una aplicación bien diseñada que lo usa como caché debería seguir funcionando, aunque más lenta.",
  ok:true, why:"La caché es una optimización: ante un fallo, se va a la base de datos (con cuidado de no saturarla)."},
 {t:"info", eti:"Las tres estrategias", h:"Cómo se llena la caché",
  c:`<div class="dg">
       <div class="dg-tit">cache-aside (la habitual)</div>
       <div class="dg-flujo">
         <div class="dg-caja acento">¿está en caché?</div>
         <div class="dg-caja aviso">no: leer de la BD</div>
         <div class="dg-caja ok">guardar con TTL</div>
       </div>
       <div class="dg-nota">la aplicación manda: la caché no sabe nada de la base de datos</div>
     </div>
     <ul><li><b>Cache-aside</b>: la aplicación mira, y si no está, va a la base y guarda. Simple y con control total.</li>
     <li><b>Write-through</b>: al escribir, se actualiza caché y base a la vez. Datos siempre frescos, escrituras más lentas.</li>
     <li><b>Write-behind</b>: se escribe en caché y a la base después. Muy rápido y muy peligroso: si Redis cae, se pierde.</li></ul>`},
 {t:"opcion", p:"Actualizas un producto en la base de datos. ¿Qué es más seguro con la caché?",
  ops:["Actualizar la entrada de caché con el nuevo valor","Borrarla (invalidar): la próxima lectura la recalcula y no hay riesgo de dejar un valor a medias","No hacer nada","Vaciar toda la caché"],
  ok:1, why:"Invalidar es más simple y más robusto que intentar mantener dos copias sincronizadas."},
 {t:"opcion", p:"¿Qué es una sesión pegajosa y por qué molesta?",
  ops:["Una sesión larga","Que el balanceador tenga que mandar siempre al mismo usuario a la misma réplica porque la sesión vive en su memoria: complica desplegar y escalar","Una cookie sin caducidad","Una sesión sin cifrar"],
  ok:1, why:"Con las sesiones en Redis, cualquier réplica sirve y puedes reiniciar sin echar a nadie."},
 {t:"vf", p:"Cachear datos de un usuario con una clave sin su identificador es un error grave.",
  ok:true, why:"Es la receta para servirle a alguien los datos de otra persona. La clave de caché debe incluir <b>todo</b> lo que hace distinta la respuesta."}
]},

/* =============== U4 L2 =============== */
{
id:"rs2l2",
titulo:"Límites, bloqueos, rankings y colas",
claves:["Rate limiting con INCR y EXPIRE (o scripts Lua para algoritmos más finos)","Bloqueo con SET NX EX y un valor único; liberar solo si es tuyo","Sorted sets para rankings; Streams para colas con grupos de consumidores"],
pasos:[
 {t:"info", eti:"Coordinar réplicas", h:"Patrones",
  c:`<div class="termbox"># limite: 100 peticiones por minuto por usuario
n = INCR rl:7:202609221002
if n == 1: EXPIRE rl:7:202609221002 60
if n &gt; 100: responder 429

# bloqueo distribuido para que solo una replica ejecute el informe
SET bloqueo:informe &lt;uuid-de-esta-replica&gt; NX EX 300
# ... trabajo ...
# liberar SOLO si sigue siendo nuestro (script Lua atomico)
if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) end

# ranking
ZINCRBY ranking:semana 50 ana
ZREVRANK ranking:semana ana        # posicion de ana

# cola con stream y grupo de consumidores
XADD pedidos * id 1042 total 45.9
XREADGROUP GROUP facturacion w1 COUNT 10 STREAMS pedidos &gt;
XACK pedidos facturacion 1695372131-0</div>`},
 {t:"par", p:"Empareja cada problema con la solución en Redis",
  pares:[["Limitar peticiones por usuario","INCR con EXPIRE por ventana"],["Que solo una réplica ejecute una tarea programada","SET NX EX con valor único"],["Ranking semanal de puntos","Sorted set con ZINCRBY"],["Cola con confirmación y reintentos","Stream con grupos de consumidores"],["Contar usuarios únicos aproximados con poca memoria","HyperLogLog (PFADD, PFCOUNT)"]],
  why:"El ranking de esta plataforma es exactamente un caso de sorted set."},
 {t:"opcion", p:"¿Por qué el bloqueo guarda un valor único y se libera comprobándolo?",
  ops:["Por estética","Si el bloqueo caducó y otra réplica lo tomó, un DEL a ciegas borraría el bloqueo ajeno","Porque DEL no existe","Para ocupar menos"],
  ok:1, why:"Para bloqueos críticos hay que pensar en caducidades y relojes: a veces es mejor un bloqueo en la base de datos."},
 {t:"info", eti:"El límite por ventana", h:"Fija contra deslizante",
  c:`<p>El contador con <code>INCR</code> por minuto es una <b>ventana fija</b>: sencillo, pero permite el doble de peticiones en el cambio de minuto (59 al final de uno y 59 al principio del siguiente).</p>
     <p>Para límites más justos:</p>
     <ul><li><b>Ventana deslizante</b>: un sorted set con la marca de tiempo de cada petición, y se cuentan las del último minuto.</li>
     <li><b>Cubo de fichas</b> (token bucket): un script Lua que rellena fichas con el tiempo y descuenta una por petición. Permite ráfagas controladas.</li></ul>
     <p>Para el 90% de las APIs, la ventana fija sobra y cuesta dos comandos.</p>`},
 {t:"opcion", p:"Un bloqueo con TTL de 30 s protege una tarea que a veces tarda 5 minutos. ¿Qué puede pasar?",
  ops:["Nada","Que el bloqueo caduque a mitad y otra réplica empiece la misma tarea en paralelo","Que se borre la tarea","Que Redis falle"],
  ok:1, why:"O TTL mayor que el peor caso, o ir renovándolo mientras la tarea sigue viva (lo que hacen las librerías serias)."},
 {t:"vf", p:"Un bloqueo en Redis garantiza exclusión mutua perfecta, incluso con un failover del primario.",
  ok:false, why:"Si el primario cae justo después de conceder el bloqueo y la réplica promovida no lo tenía, dos procesos pueden creerse dueños. Para casos críticos de dinero, el bloqueo va en la base de datos transaccional."},
 {t:"escribe", p:"Escribe el comando que suma 1 al contador <code>rl:7:202609221002</code>",
  sol:["INCR rl:7:202609221002","incr rl:7:202609221002"],
  pista:"El contador atómico de siempre.",
  why:"Y si devuelve 1, se le pone el <code>EXPIRE</code> de la ventana: esos dos comandos son un limitador entero."}
]},

/* =============== U4 L3 =============== */
{
id:"rs2l3",
titulo:"Pub/sub y notificaciones",
claves:["PUBLISH y SUBSCRIBE difunden mensajes a los suscriptores conectados en ese momento","Pub/sub no guarda mensajes: si nadie escucha, se pierden","Para mensajes duraderos, Streams; para eventos a gran escala, Kafka"],
pasos:[
 {t:"info", eti:"Difundir", h:"Publicar y suscribirse",
  c:`<div class="termbox"># consola 1
SUBSCRIBE chat:sala-7
# consola 2
PUBLISH chat:sala-7 '{"de":"ana","texto":"hola"}'
(integer) 3          # suscriptores que lo recibieron</div>
     <p>Uso típico: repartir mensajes en tiempo real entre las réplicas de un servidor de WebSockets (como viste en Node y en Diseño de sistemas), invalidar cachés locales en todas las réplicas o avisos entre servicios en los que perder un mensaje no es grave.</p>`},
 {t:"par", p:"Empareja cada mecanismo con su garantía",
  pares:[["Pub/sub","Entrega solo a quien está conectado; sin persistencia"],["Streams con grupos","Mensajes guardados, confirmados y reintentables"],["Kafka","Registro duradero y particionado para grandes volúmenes"],["Listas con BRPOP","Cola sencilla: un consumidor recibe cada elemento"]],
  why:"Elegir según si puedes permitirte perder mensajes."},
 {t:"vf", p:"Con Redis pub/sub, un suscriptor que se desconecta un minuto recibe al volver los mensajes que se publicaron mientras tanto.",
  ok:false, why:"Se pierden. Si importa, usa Streams."},
 {t:"info", eti:"Un caso que se ve mucho", h:"Invalidar cachés locales",
  c:`<p>Muchas aplicaciones tienen una caché en memoria además de Redis (rapidísima, pero una por réplica). El problema: cuando un dato cambia, las otras réplicas no se enteran.</p>
     <div class="termbox"># la replica que cambia el dato avisa
PUBLISH cache:invalidar producto:42

# todas las replicas estan suscritas y borran su copia local
SUBSCRIBE cache:invalidar</div>
     <p>Aquí perder un mensaje sí importa algo (esa réplica serviría un dato viejo hasta que caduque), por eso se combina con un TTL corto.</p>`},
 {t:"opcion", p:"¿Cuántos mensajes guarda Redis pub/sub si no hay ningún suscriptor?",
  ops:["Todos","Ninguno: se descartan al instante","Los últimos 100","Depende de la memoria"],
  ok:1, why:"<code>PUBLISH</code> devuelve 0 (los que lo recibieron) y el mensaje desaparece."},
 {t:"par", p:"Empareja cada caso con la herramienta adecuada",
  pares:[["Chat en tiempo real entre réplicas","Pub/sub: llega a quien está conectado"],["Procesar pagos sin perder ninguno","Stream con confirmación"],["Avisar de un cambio de configuración","Pub/sub con TTL corto de respaldo"],["Enviar 10.000 correos con reintentos","Cola con confirmación y reintento"]],
  why:"La pregunta siempre es la misma: ¿qué pasa si este mensaje se pierde?"},
 {t:"escribe", p:"Escribe el comando que publica el texto <code>hola</code> en el canal <code>avisos</code>",
  sol:["PUBLISH avisos hola","publish avisos hola"],
  pista:"PUBLISH canal mensaje.",
  why:"Devuelve cuántos suscriptores lo recibieron: si es 0, no lo ha oído nadie."}
]}

]});
