window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Qué es Redis",
resumen: "Una base de datos en memoria, los comandos esenciales, la caducidad de las claves y los contadores",
nivel: "Fundamentos",
color: "#e3564f",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"rs1l1",
titulo:"Datos en memoria",
claves:["Redis guarda datos en memoria: respuestas en microsegundos","Es clave-valor, pero los valores tienen estructura: strings, listas, hashes, sets, sorted sets, streams","Se usa como caché, almacén de sesiones, contador, cola, bloqueo o ranking"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es Redis?",
  c:`<p><b>Redis</b> es una base de datos que guarda todo en <b>memoria RAM</b>, así que lee y escribe en microsegundos. Cada dato está bajo una <b>clave</b> (<code>sesion:7f3a</code>, <code>producto:42</code>), pero el valor no es solo texto: puede ser una lista, un mapa, un conjunto ordenado...</p>
     <p>Casi todas las arquitecturas que has visto en los cursos de Spring, Node y Diseño de sistemas tienen un Redis: para cachear, compartir sesiones entre réplicas, limitar peticiones o contar cosas al instante. Existe también <b>Valkey</b>, la bifurcación libre, compatible con Redis.</p>`},
 {t:"par", p:"Empareja cada estructura con un uso típico",
  pares:[["String","Caché de una respuesta o un contador"],["Hash","Un objeto con campos (perfil de usuario)"],["List","Cola sencilla o últimos N elementos"],["Set","Elementos únicos (usuarios que vieron un post)"],["Sorted set","Ranking por puntuación"],["Stream","Registro de eventos con grupos de consumidores"]],
  why:"Elegir la estructura adecuada hace que la operación sea O(1) o O(log n)."},
 {t:"opcion", p:"¿Qué ventaja principal tiene Redis frente a consultar la base de datos relacional?",
  ops:["Guarda más datos","Latencia de microsegundos al estar en memoria, ideal para datos muy consultados","Tiene SQL más potente","Es gratis y PostgreSQL no"],
  ok:1, why:"A cambio, la memoria es cara y limitada: no es la fuente de verdad de todo."},
 {t:"vf", p:"Redis solo puede guardar cadenas de texto.",
  ok:false, why:"Tiene estructuras de datos ricas con operaciones atómicas sobre ellas."},
 {t:"info", eti:"Lo que explica todo lo demás", h:"Un solo hilo",
  c:`<p>Redis atiende los comandos <b>de uno en uno</b>, en un único hilo. Suena a limitación y es justo lo contrario: como nadie se ejecuta a la vez, cada comando es atómico sin bloqueos ni transacciones.</p>
     <p>La consecuencia práctica: <b>un comando lento bloquea a todos los demás</b>. Un <code>KEYS *</code> sobre diez millones de claves, o un <code>DEL</code> de una lista gigante, congelan Redis para todo el mundo durante ese tiempo.</p>
     <p>Por eso en Redis no se habla de «consultas pesadas»: se habla de comandos O(1) y de evitar los O(n) sobre cosas grandes.</p>`},
 {t:"opcion", p:"¿Por qué un <code>INCR</code> en Redis no necesita ningún mecanismo de bloqueo?",
  ops:["Porque los bloqueos son automáticos","Porque Redis ejecuta un comando cada vez: cuando el tuyo se ejecuta, nadie más está tocando esa clave","Porque usa transacciones","Porque el contador está en disco"],
  ok:1, why:"Esta es la razón por la que Redis se usa tanto para coordinar cosas entre varias réplicas de una aplicación."},
 {t:"vf", p:"Si el servidor de Redis se apaga, todos los datos desaparecen siempre.",
  ok:false, why:"Puede guardar en disco (RDB y AOF, lo verás más adelante). Pero sí: su casa es la memoria, y hay que decidir conscientemente cuánto quieres poder perder."}
]},

/* =============== U1 L2 =============== */
{
id:"rs1l2",
titulo:"Comandos esenciales",
claves:["SET y GET con caducidad (EX) y condición (NX)","INCR, HSET, LPUSH, SADD, ZADD operan de forma atómica","TTL y EXPIRE controlan la caducidad; SCAN en vez de KEYS en producción"],
pasos:[
 {t:"info", eti:"redis-cli", h:"Lo básico",
  c:`<div class="termbox">SET producto:42 '{"nombre":"Teclado","precio":89.9}' EX 300   # caduca en 5 min
GET producto:42
TTL producto:42                 # segundos que le quedan
INCR visitas:2026-09-22         # contador atomico
HSET usuario:7 nombre Ana plan pro
HGET usuario:7 plan
LPUSH ultimas:7 "curso:docker"   # anadir al principio
LTRIM ultimas:7 0 9              # quedarse con los 10 ultimos
SADD vistos:post:9 7 12 31
ZADD ranking 1520 ana 980 luis
ZREVRANGE ranking 0 9 WITHSCORES # top 10
SET bloqueo:informe 1 NX EX 60   # solo si no existe: bloqueo sencillo
SCAN 0 MATCH sesion:* COUNT 100  # recorrer claves sin bloquear</div>`},
 {t:"term", p:"Guarda la clave <code>saludo</code> con el valor <code>hola</code> para que caduque en 60 segundos",
  prompt:"127.0.0.1:6379>", sol:["set saludo hola ex 60","SET saludo hola EX 60","setex saludo 60 hola","SETEX saludo 60 hola"],
  pista:"SET clave valor EX segundos.",
  salida:`OK`, why:"Todo lo que se cachea debería tener caducidad."},
 {t:"par", p:"Empareja cada comando con su efecto",
  pares:[["INCR clave","Suma 1 de forma atómica y devuelve el nuevo valor"],["EXPIRE clave 60","Hace que la clave caduque en 60 s"],["SET k v NX","Guarda solo si la clave no existe"],["ZREVRANGE ranking 0 9","Los 10 con mayor puntuación"],["KEYS *","Lista todas las claves bloqueando Redis (evitar en producción)"]],
  why:"Redis ejecuta los comandos de uno en uno: un KEYS sobre millones de claves bloquea a todos los clientes."},
 {t:"term", p:"Consulta el valor de la clave <code>saludo</code>",
  prompt:"127.0.0.1:6379>", sol:["get saludo","GET saludo"],
  pista:"El comando más corto de todos.",
  salida:`"hola"`,
  why:"Si la clave no existe o ya caducó, devuelve <code>(nil)</code>."},
 {t:"opcion", p:"¿Qué devuelve <code>TTL</code> sobre una clave que existe pero no tiene caducidad?",
  ops:["0","-1","-2","Error"],
  ok:1, why:"Y <code>-2</code> significa que la clave ya no existe. Distinguirlos ahorra confusiones al depurar."},
 {t:"term", p:"Recorre las claves que empiezan por <code>sesion:</code> sin bloquear Redis, empezando por el cursor 0",
  prompt:"127.0.0.1:6379>", sol:["scan 0 match sesion:*","SCAN 0 MATCH sesion:*","scan 0 match sesion:* count 100","SCAN 0 MATCH sesion:* COUNT 100"],
  pista:"El comando que recorre poco a poco, no el que lista todo de golpe.",
  salida:`1) "17"
2) 1) "sesion:7f3a"
   2) "sesion:91bd"`,
  why:"Devuelve un cursor nuevo (17): se vuelve a llamar con él hasta que devuelva 0."},
 {t:"vf", p:"<code>SCAN</code> garantiza que verás cada clave exactamente una vez.",
  ok:false, why:"Garantiza que verás las que estaban desde el principio hasta el final, pero puede repetir alguna. A cambio, no bloquea. Es el compromiso correcto en producción."},
 {t:"info", eti:"Convención", h:"Nombres de clave con espacio de nombres",
  c:`<div class="termbox">usuario:7:perfil          # objeto:id:atributo
sesion:7f3a9c            # el id va al final
rl:api:7:202609221002    # limitador: recurso, usuario, ventana
cache:v2:producto:42     # version en la clave: cambiar el formato sin romper nada</div>
     <p>Los dos puntos no significan nada para Redis: es solo una convención, pero es <b>la</b> convención. Permite hacer <code>SCAN MATCH usuario:7:*</code> y entender de un vistazo qué hay en la memoria.</p>`}
]},

/* =============== U1 L3 =============== */
{
id:"rs1l4",
titulo:"Caducidad: la clave de todo",
claves:["Toda clave de caché debería tener TTL; sin él, la memoria solo crece","Redis borra lo caducado de forma perezosa y con un muestreo periódico","Cuidado con la estampida: muchas claves que caducan a la vez"],
pasos:[
 {t:"info", eti:"Poner fecha de caducidad", h:"Las formas de caducar",
  c:`<div class="termbox">SET clave valor EX 300        # 300 segundos
SET clave valor PX 1500       # 1500 milisegundos
SET clave valor EXAT 1790000000   # caduca en ese instante (unix)
EXPIRE clave 60               # poner TTL a una clave que ya existe
PERSIST clave                 # quitarle el TTL
TTL clave                     # cuanto le queda</div>
     <p>Ojo con un detalle que muerde: <b>algunos comandos borran el TTL</b>. Un <code>SET</code> sobre una clave que ya tenía caducidad la deja sin ella, salvo que uses <code>KEEPTTL</code>.</p>`},
 {t:"opcion", p:"Tienes <code>producto:42</code> con TTL de 300 s y haces <code>SET producto:42 nuevoValor</code>. ¿Qué pasa con la caducidad?",
  ops:["Se conserva","Se pierde: la clave pasa a ser eterna, salvo que uses SET ... KEEPTTL","Se reinicia a 300","Da error"],
  ok:1, why:"Así se llenan las memorias de claves inmortales que nadie esperaba."},
 {t:"info", eti:"Cómo borra Redis", h:"Perezoso y por muestreo",
  c:`<p>Redis no tiene un temporizador por clave. Hace dos cosas:</p>
     <ul><li><b>Perezoso</b>: cuando alguien pide una clave caducada, la borra y contesta que no existe.</li>
     <li><b>Muestreo</b>: varias veces por segundo coge unas cuantas claves con TTL al azar y borra las caducadas; si encuentra muchas, repite.</li></ul>
     <p>Consecuencia: una clave caducada puede seguir ocupando memoria un rato. Para el cliente ya no existe, pero el gráfico de memoria no baja al instante.</p>`},
 {t:"vf", p:"Una clave caducada desaparece de la memoria en el mismo instante en que vence su TTL.",
  ok:false, why:"Deja de estar disponible inmediatamente, pero la memoria se libera cuando alguien la pide o cuando el muestreo la encuentra."},
 {t:"info", eti:"El problema serio", h:"La estampida de caché",
  c:`<p>Si mil claves caducan en el mismo segundo y mil peticiones llegan a la vez, las mil van a la base de datos al mismo tiempo. La base se cae, y entonces sí que no hay caché.</p>
     <div class="termbox"># mal: todas caducan exactamente a los 300 s
SET producto:42 ... EX 300

# bien: un poco de aleatoriedad
SET producto:42 ... EX 300 + random(0..60)</div>
     <p>Y para la clave que arrasa (la portada, el producto de moda), además: que solo <b>una</b> petición vaya a recalcularla y las demás esperen o sirvan el valor viejo. Eso se hace con un bloqueo, que verás en los patrones.</p>`},
 {t:"opcion", p:"Tu caché tiene TTL de 60 s para todo y cada minuto se te hunde la base de datos durante un segundo. ¿Qué es?",
  ops:["Falta memoria","Una estampida: todo caduca a la vez y todas las peticiones van a la base al mismo tiempo","Redis está roto","La red"],
  ok:1, why:"Se arregla repartiendo las caducidades y protegiendo el recálculo de las claves más pedidas."},
 {t:"escribe", p:"Escribe el comando que guarda <code>clave</code> con valor <code>1</code> y caducidad de 90 segundos",
  sol:["SET clave 1 EX 90","set clave 1 ex 90","SETEX clave 90 1","setex clave 90 1"],
  pista:"SET, el valor y la opción de segundos.",
  why:"Acostúmbrate a escribir el TTL en el mismo comando: así no se te olvida nunca."}
]},

/* =============== U1 L4 =============== */
{
id:"rs1l5",
titulo:"Strings y contadores",
claves:["El string de Redis guarda hasta 512 MB: texto, JSON o binario","INCR, DECR e INCRBY son atómicos: el contador nunca se pierde","SET con NX y EX es la base de los bloqueos y de «hazlo solo una vez»"],
pasos:[
 {t:"info", eti:"Más que texto", h:"El tipo string",
  c:`<div class="termbox">SET clave "hola"                  # texto
SET clave '{"a":1}'               # json serializado
APPEND log:7 "linea nueva\\n"      # anadir al final
STRLEN clave                      # longitud
GETRANGE clave 0 3                # subcadena
SETRANGE clave 5 "XX"             # sobreescribir a partir de una posicion
MSET a 1 b 2 c 3                  # varios de una vez
MGET a b c                        # leer varios en un viaje</div>
     <p><code>MGET</code> y <code>MSET</code> parecen un detalle y no lo son: cien <code>GET</code> son cien viajes de red; un <code>MGET</code> de cien claves es uno.</p>`},
 {t:"term", p:"Incrementa en 1 el contador <code>visitas</code>",
  prompt:"127.0.0.1:6379>", sol:["incr visitas","INCR visitas"],
  pista:"El comando de incrementar, sin más argumentos.",
  salida:`(integer) 1`,
  why:"Si la clave no existía, Redis la crea con 0 y suma: devuelve 1."},
 {t:"par", p:"Empareja cada comando de contador con lo que hace",
  pares:[["INCR","Suma 1"],["INCRBY 10","Suma la cantidad que le digas"],["DECR","Resta 1"],["INCRBYFLOAT 0.5","Suma decimales"],["GETSET","Lee el valor viejo y escribe el nuevo, de una vez"]],
  why:"<code>GETSET</code> (o <code>SET ... GET</code>) sirve para vaciar un contador sin perder ninguna cuenta: lees y reinicias en la misma operación."},
 {t:"opcion", p:"Dos réplicas de tu API hacen <code>INCR visitas</code> exactamente a la vez. ¿Cuál es el resultado?",
  ops:["Se pierde una","Se suman las dos: los comandos se ejecutan uno tras otro","Error de concurrencia","Depende de la red"],
  ok:1, why:"Este es el motivo por el que los contadores compartidos se llevan en Redis y no en la memoria de cada réplica."},
 {t:"info", eti:"El patrón que más se usa", h:"SET NX: hazlo solo una vez",
  c:`<div class="termbox">SET procesado:pedido:1042 1 NX EX 86400
# si devuelve OK  -&gt; nadie lo habia procesado: procesa
# si devuelve nil -&gt; ya estaba: no hagas nada</div>
     <p>Con dos líneas tienes <b>idempotencia</b>: el webhook que llega repetido, el mensaje que se reentrega, el botón que alguien pulsa dos veces.</p>
     <p>Es el mismo mecanismo de un bloqueo distribuido, que verás en los patrones: la diferencia está en el TTL y en cómo se libera.</p>`},
 {t:"term", p:"Guarda <code>bloqueo:informe</code> con valor <code>1</code> solo si no existe, con caducidad de 60 segundos",
  prompt:"127.0.0.1:6379>", sol:["SET bloqueo:informe 1 NX EX 60","set bloqueo:informe 1 nx ex 60"],
  pista:"Dos opciones en el mismo SET: la condición y la caducidad.",
  salida:`OK`,
  why:"Si otro lo tuviera cogido, devolvería <code>(nil)</code> y tu código sabría que no le toca."},
 {t:"vf", p:"Un contador en Redis sin caducidad crece para siempre en memoria.",
  ok:true, why:"Por eso los contadores por ventana llevan la fecha en la clave (<code>visitas:2026-09-22</code>) y un TTL: al pasar el día, se borran solos."}
]}

]});
