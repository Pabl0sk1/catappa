window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Qué es Redis",
resumen: "Una base de datos en memoria, sus estructuras de datos y los comandos esenciales",
nivel: "Fundamentos",
color: "#e3564f",
lecciones: [

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
  ok:false, why:"Tiene estructuras de datos ricas con operaciones atómicas sobre ellas."}
]},

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
  why:"Redis ejecuta los comandos de uno en uno: un KEYS sobre millones de claves bloquea a todos los clientes."}
]},

{
id:"rs1l3",
titulo:"Redis desde tu aplicación",
claves:["Clientes: Lettuce o Jedis en Java (Spring Data Redis), node-redis o ioredis en Node, redis-py en Python","Pipelining envía muchos comandos de una vez; MULTI/EXEC los agrupa","Scripts Lua para operaciones atómicas compuestas"],
pasos:[
 {t:"info", eti:"Desde el código", h:"Clientes y rendimiento",
  c:`<div class="termbox">// Spring Data Redis
@Autowired StringRedisTemplate redis;
redis.opsForValue().set("producto:42", json, Duration.ofMinutes(5));
Long visitas = redis.opsForValue().increment("visitas:" + hoy);
redis.opsForZSet().incrementScore("ranking:semana", "ana", 50);

// pipelining: 1.000 comandos en un solo viaje de red
redis.executePipelined((RedisCallback&lt;Object&gt;) c -&gt; {
    for (var id : ids) c.stringCommands().get(("producto:" + id).getBytes());
    return null;
});</div>
     <p>Cada comando es un viaje de red (~0,5 ms). Mil comandos seguidos son medio segundo; con <b>pipelining</b>, unos milisegundos.</p>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Pipelining","Enviar muchos comandos sin esperar cada respuesta"],["MULTI / EXEC","Ejecutar un grupo de comandos sin que otros se intercalen"],["Script Lua (EVAL)","Lógica atómica compuesta dentro de Redis"],["Pool de conexiones","Reutilizar conexiones entre peticiones"],["MGET","Leer varias claves en un comando"]],
  why:"El cuello de botella con Redis suele ser la red, no Redis."},
 {t:"opcion", p:"Tu API hace 200 GET a Redis por petición, uno tras otro. ¿Qué mejora rápida aplicas?",
  ops:["Más CPU en Redis","MGET o pipelining para agrupar las lecturas en uno o pocos viajes","Quitar la caché","Usar KEYS"],
  ok:1, why:"Menos viajes de red, la misma idea que evitar el N+1 en SQL."}
]}

]});
