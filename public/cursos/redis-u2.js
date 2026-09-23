window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Las estructuras de datos",
resumen: "Hashes, listas, conjuntos, conjuntos ordenados, streams y las estructuras especiales",
nivel: "Fundamentos",
color: "#dd514a",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"rs2l4",
titulo:"Hashes: objetos con campos",
claves:["Un hash guarda campos y valores bajo una sola clave","Se puede leer o escribir un campo suelto sin tocar el resto","Ocupa menos memoria que muchas claves sueltas y agrupa lo que va junto"],
pasos:[
 {t:"info", eti:"Objetos", h:"HSET y compañía",
  c:`<div class="termbox">HSET usuario:7 nombre Ana plan pro visitas 0
HGET usuario:7 plan               # "pro"
HMGET usuario:7 nombre plan       # varios campos
HGETALL usuario:7                 # todo el objeto
HINCRBY usuario:7 visitas 1       # contador dentro del hash
HDEL usuario:7 plan
HEXISTS usuario:7 nombre
HLEN usuario:7</div>
     <p>Frente a guardar un JSON en un string: con hash puedes leer o cambiar <b>un campo</b> sin serializar ni deserializar el objeto entero.</p>`},
 {t:"term", p:"Guarda en el hash <code>usuario:7</code> el campo <code>nombre</code> con valor <code>Ana</code>",
  prompt:"127.0.0.1:6379>", sol:["HSET usuario:7 nombre Ana","hset usuario:7 nombre Ana"],
  pista:"HSET clave campo valor.",
  salida:`(integer) 1`,
  why:"Devuelve 1 si el campo es nuevo y 0 si ya existía y lo ha sobrescrito."},
 {t:"par", p:"Empareja cada situación con la estructura correcta",
  pares:[["Perfil de usuario con 10 campos que se leen sueltos","Hash"],["Una respuesta JSON completa que siempre se lee entera","String"],["Contador de visitas por usuario dentro de su perfil","Campo de hash con HINCRBY"],["Un millón de claves usuario:7:nombre, usuario:7:plan…","Mala idea: cada clave tiene su coste"]],
  why:"Agrupar en un hash ahorra memoria y hace más fácil borrar todo el objeto de golpe."},
 {t:"opcion", p:"¿Se puede poner caducidad a <b>un campo</b> de un hash?",
  ops:["Sí, con HEXPIRE en cualquier versión","Solo desde Redis 7.4; antes, el TTL era siempre de la clave entera","Sí, con EXPIRE campo","No, nunca"],
  ok:1, why:"Es una limitación clásica: si necesitas caducidades distintas por campo, a menudo es señal de que deberían ser claves separadas."},
 {t:"vf", p:"<code>HGETALL</code> sobre un hash con un millón de campos es una operación barata.",
  ok:false, why:"Es O(n) y devuelve todo de golpe: bloquea Redis mientras lo hace. Para hashes grandes está <code>HSCAN</code>."},
 {t:"escribe", p:"Escribe el comando que suma 1 al campo <code>visitas</code> del hash <code>usuario:7</code>",
  sol:["HINCRBY usuario:7 visitas 1","hincrby usuario:7 visitas 1"],
  pista:"Como INCRBY, pero dentro de un hash.",
  why:"Atómico igual que <code>INCR</code>: no hay que leer, sumar y escribir."}
]},

/* =============== U2 L2 =============== */
{
id:"rs2l5",
titulo:"Listas: colas y últimos N",
claves:["Una lista es una lista doblemente enlazada: añadir y quitar por los extremos es O(1)","LPUSH + LTRIM mantiene «los últimos N» con coste constante","BRPOP espera bloqueado hasta que llega algo: colas sencillas"],
pasos:[
 {t:"info", eti:"Por los extremos", h:"Listas",
  c:`<div class="termbox">LPUSH ultimas:7 "curso:docker"     # anade por la izquierda
RPUSH cola:correos "id:42"          # anade por la derecha
LRANGE ultimas:7 0 9                # los 10 primeros
LTRIM ultimas:7 0 9                 # recorta: deja solo esos 10
LLEN cola:correos
RPOP cola:correos                   # saca por la derecha
BRPOP cola:correos 30               # espera hasta 30 s a que haya algo
LMOVE cola:correos procesando LEFT RIGHT   # mover entre listas, atomico</div>
     <p>El patrón <code>LPUSH</code> + <code>LTRIM</code> es la forma de tener «los últimos 10 vistos» sin que la lista crezca jamás.</p>`},
 {t:"par", p:"Empareja cada comando con su uso",
  pares:[["LPUSH + LTRIM","Mantener los últimos N elementos"],["RPUSH + BRPOP","Cola sencilla de trabajos"],["LRANGE 0 -1","Leer la lista entera (con cuidado si es grande)"],["LMOVE","Mover un elemento a otra lista sin perderlo por el camino"],["LLEN","Saber cuánto hay pendiente"]],
  why:"<code>LMOVE</code> a una lista «procesando» es lo que evita perder trabajos si el consumidor muere a medias."},
 {t:"opcion", p:"¿Por qué <code>BRPOP</code> es mejor que preguntar cada segundo con <code>RPOP</code>?",
  ops:["Es igual","Porque el consumidor se queda esperando sin gastar viajes de red ni CPU, y reacciona al instante","Porque guarda más","Porque bloquea Redis"],
  ok:1, why:"Y ojo con el nombre: bloquea al <b>cliente</b> que espera, no al servidor."},
 {t:"term", p:"Añade el valor <code>id:42</code> al final de la lista <code>cola:correos</code>",
  prompt:"127.0.0.1:6379>", sol:["RPUSH cola:correos id:42","rpush cola:correos id:42"],
  pista:"Por la derecha se añade con RPUSH.",
  salida:`(integer) 1`,
  why:"Devuelve la longitud de la lista tras añadir."},
 {t:"vf", p:"Una cola con listas garantiza que ningún trabajo se pierde si el consumidor se cae a mitad.",
  ok:false, why:"Con <code>RPOP</code> a secas, sí se pierde: ya salió de la lista. Por eso se usa <code>LMOVE</code> a una lista de «en proceso», o directamente Streams con confirmación."},
 {t:"opcion", p:"Guardas el historial completo de acciones de cada usuario en una lista y la memoria se dispara. ¿Qué haces?",
  ops:["Más memoria","LTRIM para quedarte con los últimos N, y el histórico completo en la base de datos de verdad","Borrar todo","Usar un set"],
  ok:1, why:"Redis es memoria cara: guarda lo que se consulta al instante, no el archivo histórico."}
]},

/* =============== U2 L3 =============== */
{
id:"rs2l6",
titulo:"Sets y sorted sets",
claves:["Un set guarda elementos únicos sin orden, con operaciones de conjuntos","Un sorted set mantiene los elementos ordenados por puntuación","Los rankings y las colas por prioridad son sorted sets"],
pasos:[
 {t:"info", eti:"Conjuntos", h:"Sets",
  c:`<div class="termbox">SADD vistos:post:9 7 12 31        # anade (sin repetir)
SISMEMBER vistos:post:9 12        # ¿esta? -&gt; 1 o 0
SCARD vistos:post:9               # cuantos hay
SMEMBERS vistos:post:9            # todos (cuidado si son muchos)
SREM vistos:post:9 7

SINTER amigos:1 amigos:2          # amigos en comun
SUNION etiquetas:a etiquetas:b
SDIFF todos:activos ya:avisados   # a quien falta avisar</div>
     <p>La pregunta «¿está este elemento?» es O(1). Por eso los sets sirven para deduplicar, para permisos y para «ya lo vi».</p>`},
 {t:"info", eti:"Con puntuación", h:"Sorted sets",
  c:`<div class="termbox">ZADD ranking 1520 ana 980 luis
ZINCRBY ranking 50 ana            # sumar puntos
ZREVRANGE ranking 0 9 WITHSCORES  # top 10
ZRANK ranking luis                # posicion (desde abajo)
ZREVRANK ranking ana              # posicion (desde arriba)
ZRANGEBYSCORE ranking 1000 2000   # por rango de puntuacion
ZREMRANGEBYRANK ranking 0 -101    # dejar solo el top 100</div>
     <p>Como la puntuación puede ser cualquier número, un sorted set también sirve como <b>cola por prioridad</b> o como <b>índice por fecha</b> (puntuación = marca de tiempo).</p>`},
 {t:"par", p:"Empareja cada necesidad con la estructura",
  pares:[["Usuarios únicos que vieron un post","Set"],["Ranking de puntos","Sorted set"],["Los amigos comunes de dos personas","SINTER de dos sets"],["Tareas programadas por hora de ejecución","Sorted set con la hora como puntuación"],["Saber si un correo ya se envió","Set (o SET NX)"]],
  why:"Ese uso del sorted set como agenda de tareas es la base de muchas colas con retardo."},
 {t:"term", p:"Añade a <code>ranking</code> el miembro <code>ana</code> con 1520 puntos",
  prompt:"127.0.0.1:6379>", sol:["ZADD ranking 1520 ana","zadd ranking 1520 ana"],
  pista:"ZADD clave puntuación miembro (en ese orden).",
  salida:`(integer) 1`,
  why:"El orden puntuación-miembro se olvida siempre; en el resto de comandos va al revés."},
 {t:"opcion", p:"¿Cuánto cuesta sacar el top 10 de un sorted set con un millón de miembros?",
  ops:["Recorre el millón","Es barato: la estructura ya está ordenada, cuesta O(log n) más los 10 que devuelve","Depende de la memoria","No se puede"],
  ok:1, why:"Por eso el ranking de esta plataforma, o el de cualquier juego, se hace así y no con una consulta SQL ordenada."},
 {t:"vf", p:"<code>SMEMBERS</code> sobre un set de dos millones de elementos es seguro en producción.",
  ok:false, why:"Devuelve los dos millones y bloquea Redis mientras. Para recorrer sets grandes está <code>SSCAN</code>."},
 {t:"escribe", p:"Escribe el comando que suma 50 puntos a <code>ana</code> en el sorted set <code>ranking:semana</code>",
  sol:["ZINCRBY ranking:semana 50 ana","zincrby ranking:semana 50 ana"],
  pista:"Como INCRBY, pero de sorted set.",
  why:"Si <code>ana</code> no estaba, la crea con 50. Es la forma de llevar puntuaciones acumuladas."}
]},

/* =============== U2 L4 =============== */
{
id:"rs2l7",
titulo:"Streams y estructuras especiales",
claves:["Un stream es un registro de eventos con id por marca de tiempo y grupos de consumidores","HyperLogLog cuenta únicos aproximados con 12 KB fijos","Bitmaps y geo resuelven casos concretos con muy poca memoria"],
pasos:[
 {t:"info", eti:"Eventos duraderos", h:"Streams",
  c:`<div class="termbox">XADD pedidos * id 1042 total 45.9      # * = id automatico por tiempo
XLEN pedidos
XRANGE pedidos - +                      # todo el rango

# grupo de consumidores: reparto + confirmacion
XGROUP CREATE pedidos facturacion 0
XREADGROUP GROUP facturacion w1 COUNT 10 STREAMS pedidos &gt;
XACK pedidos facturacion 1695372131-0   # confirmado: ya no se reentrega
XPENDING pedidos facturacion            # lo entregado y sin confirmar</div>
     <p>Es lo más parecido a Kafka dentro de Redis: los mensajes <b>se guardan</b>, se reparten entre consumidores y se confirman uno a uno.</p>`},
 {t:"par", p:"Empareja cada mecanismo con su garantía",
  pares:[["Pub/sub","Solo lo recibe quien está conectado; no se guarda"],["Lista con BRPOP","Un consumidor por elemento, sin confirmación"],["Stream con grupo","Se guarda, se reparte y se confirma; se puede reintentar"],["Kafka","Lo mismo a gran escala y con retención larga"]],
  why:"La pregunta que decide: ¿puedo permitirme perder un mensaje?"},
 {t:"opcion", p:"Un consumidor coge diez mensajes de un stream y se cae antes de confirmarlos. ¿Qué pasa?",
  ops:["Se pierden","Quedan como pendientes: otro consumidor puede reclamarlos con XAUTOCLAIM","Se borran del stream","Se duplican para todos"],
  ok:1, why:"Esa lista de pendientes es justo lo que no tienen ni pub/sub ni las listas."},
 {t:"info", eti:"Poca memoria, mucho dato", h:"HyperLogLog, bitmaps y geo",
  c:`<div class="termbox"># visitantes unicos del dia: error ~0,8%, y ocupa 12 KB pase lo que pase
PFADD unicos:2026-09-22 usuario:7 usuario:12
PFCOUNT unicos:2026-09-22

# bitmap: un bit por usuario. ¿entro hoy el usuario 4567?
SETBIT activos:2026-09-22 4567 1
BITCOUNT activos:2026-09-22          # cuantos entraron

# geo: cosas cerca de un punto
GEOADD tiendas -3.70 40.41 "madrid-centro"
GEOSEARCH tiendas FROMLONLAT -3.70 40.42 BYRADIUS 5 km ASC</div>`},
 {t:"par", p:"Empareja cada estructura especial con su caso",
  pares:[["HyperLogLog","Contar visitantes únicos con memoria fija"],["Bitmap","Marcar presencia diaria de millones de usuarios"],["Geo","Buscar lo más cercano a unas coordenadas"],["Stream","Cola de eventos con confirmación"]],
  why:"Son estructuras muy especializadas: cuando encajan, ahorran una barbaridad."},
 {t:"opcion", p:"Necesitas «usuarios únicos al día» de 50 millones de eventos y no te importa un 1% de error. ¿Qué usas?",
  ops:["Un set con 50 millones de miembros","HyperLogLog: 12 KB por día en vez de gigas","Una lista","La base de datos"],
  ok:1, why:"Un set exacto costaría gigas de memoria. Aquí la aproximación vale y el ahorro es brutal."},
 {t:"vf", p:"Un stream de Redis crece indefinidamente salvo que lo recortes.",
  ok:true, why:"Se recorta al añadir: <code>XADD pedidos MAXLEN ~ 100000 *</code>. La virgulilla permite a Redis recortar de forma aproximada, que es mucho más barato."}
]}

]});
