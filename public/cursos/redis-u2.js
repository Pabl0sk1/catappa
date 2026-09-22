window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Patrones con Redis",
resumen: "Caché, sesiones compartidas, limitación de peticiones, bloqueos distribuidos, rankings y colas",
nivel: "Intermedio",
color: "#d94c45",
lecciones: [

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
  ok:true, why:"La caché es una optimización: ante un fallo, se va a la base de datos (con cuidado de no saturarla)."}
]},

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
  ok:1, why:"Para bloqueos críticos hay que pensar en caducidades y relojes: a veces es mejor un bloqueo en la base de datos."}
]},

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
  ok:false, why:"Se pierden. Si importa, usa Streams."}
]}

]});
