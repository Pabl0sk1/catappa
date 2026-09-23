window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Redis desde tu aplicación",
resumen: "Clientes, pipelining, transacciones, scripts Lua y cómo nombrar y serializar lo que guardas",
nivel: "Intermedio",
color: "#d94c45",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"rs1l3",
titulo:"Clientes y viajes de red",
claves:["Clientes: Lettuce o Jedis en Java (Spring Data Redis), node-redis o ioredis en Node, redis-py en Python","Cada comando es un viaje de red: agrupar es lo que más se nota","Pool de conexiones: ni una por petición ni una sola para todo"],
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
  ok:1, why:"Menos viajes de red, la misma idea que evitar el N+1 en SQL."},
 {t:"info", eti:"Conexiones", h:"El pool, ni grande ni pequeño",
  c:`<p>Abrir una conexión por petición es carísimo. Tener una sola compartida convierte a Redis en un cuello de botella artificial (cada petición espera su turno).</p>
     <p>Lo normal: un <b>pool</b> de unas pocas decenas por instancia de la aplicación, y vigilar <code>connected_clients</code> en Redis. Si ves miles de conexiones, casi siempre es una aplicación que no devuelve las conexiones al pool.</p>
     <div class="termbox">INFO clients
# connected_clients:1842     &lt;- con 4 replicas, esto huele a fuga</div>`},
 {t:"vf", p:"Un cliente de Redis con timeout infinito es buena idea porque Redis es muy rápido.",
  ok:false, why:"Justo al revés: si Redis se atasca, tu aplicación se queda colgada esperando. Timeouts cortos y un camino alternativo cuando la caché no responde."},
 {t:"opcion", p:"Redis deja de responder un segundo. ¿Qué debería hacer una aplicación bien hecha?",
  ops:["Caerse","Agotar el timeout e ir a la base de datos: la caché es una optimización, no una dependencia dura","Reintentar cien veces","Guardar en memoria local para siempre"],
  ok:1, why:"Con cuidado de no tumbar la base de datos al hacerlo: ahí entran los límites de concurrencia."}
]},

/* =============== U3 L2 =============== */
{
id:"rs3l4",
titulo:"Transacciones, pipelining y Lua",
claves:["MULTI/EXEC agrupa comandos: se ejecutan seguidos, sin intercalarse","No hay rollback: si un comando falla, los demás igualmente se ejecutan","Para lógica condicional atómica, un script Lua"],
pasos:[
 {t:"info", eti:"Agrupar", h:"MULTI, EXEC y WATCH",
  c:`<div class="termbox">MULTI
INCR visitas
LPUSH ultimas "x"
EXEC                     # los dos, seguidos, sin que nadie se cuele

# comprobar-y-actuar sin carreras
WATCH saldo:7            # vigila la clave
val = GET saldo:7
MULTI
SET saldo:7 (val - 10)
EXEC                     # si saldo:7 cambio desde el WATCH, devuelve nil: reintenta</div>
     <p>Ojo con el nombre: una «transacción» de Redis <b>no tiene rollback</b>. Si un comando falla en ejecución, los otros se aplican igual. Garantiza aislamiento, no atomicidad de negocio.</p>`},
 {t:"opcion", p:"Dentro de un MULTI/EXEC, el segundo comando falla porque la clave es de otro tipo. ¿Qué pasa con el primero?",
  ops:["Se deshace","Se queda aplicado: no hay rollback","Falla todo","Depende de la versión"],
  ok:1, why:"Si necesitas «todo o nada» de verdad, la herramienta es un script Lua, no MULTI."},
 {t:"info", eti:"Lógica dentro de Redis", h:"Scripts Lua",
  c:`<div class="termbox"># liberar un bloqueo SOLO si sigue siendo nuestro
EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then
        return redis.call('DEL', KEYS[1])
      else return 0 end" 1 bloqueo:informe uuid-de-esta-replica</div>
     <p>El script se ejecuta <b>entero y sin interrupciones</b>: nadie puede colarse entre el GET y el DEL. Eso es justo lo que no puedes conseguir con dos comandos sueltos.</p>
     <p>Reglas: scripts cortos (bloquean Redis mientras corren), sin bucles largos, y pasando las claves por <code>KEYS</code> para que funcionen también en Cluster.</p>`},
 {t:"par", p:"Empareja cada herramienta con cuándo usarla",
  pares:[["Pipelining","Muchos comandos independientes: ahorrar viajes"],["MULTI/EXEC","Un grupo que no debe intercalarse con otros clientes"],["WATCH","Comprobar y actuar sin que nadie cambie el valor por medio"],["Script Lua","Lógica condicional atómica (bloqueos, límites finos)"],["Funciones (Redis 7)","Scripts con nombre, gestionados como una biblioteca"]],
  why:"Pipelining es rendimiento; MULTI y Lua son corrección."},
 {t:"vf", p:"El pipelining garantiza que los comandos se ejecutan juntos sin que otro cliente se cuele.",
  ok:false, why:"No: solo agrupa el envío para ahorrar viajes. Otros clientes pueden ejecutarse entre medias. Para eso está MULTI o Lua."},
 {t:"opcion", p:"Necesitas «si el contador es menor que 100, incrementa y devuelve el nuevo valor; si no, devuelve -1». ¿Cómo lo haces sin carreras?",
  ops:["GET y luego INCR desde el código","Con un script Lua: la comprobación y el incremento ocurren sin interrupciones","Con pipelining","Con un bloqueo en la base de datos"],
  ok:1, why:"Es exactamente cómo se implementan los limitadores de peticiones más finos."},
 {t:"escribe", p:"Escribe el comando que empieza una transacción de Redis",
  sol:["MULTI","multi"],
  pista:"Una sola palabra.",
  why:"A partir de ahí, los comandos se encolan hasta el <code>EXEC</code>."}
]},

/* =============== U3 L3 =============== */
{
id:"rs3l5",
titulo:"Claves, serialización y versiones",
claves:["El nombre de la clave es tu esquema: piénsalo antes","Versionar la clave permite cambiar el formato sin migrar nada","Lo que se guarda debe ser pequeño: Redis es memoria, no disco"],
pasos:[
 {t:"info", eti:"Nombrar bien", h:"El esquema invisible",
  c:`<div class="termbox">cache:v2:producto:42          # tipo : version : entidad : id
sesion:7f3a9c                 # con TTL
rl:api:7:202609221002         # limite por usuario y ventana
lock:informe:mensual          # bloqueo
zset:ranking:2026-W38         # ranking por semana</div>
     <p>Reglas que ahorran disgustos: prefijo por <b>tipo de uso</b>, la <b>versión</b> del formato serializado, y la <b>ventana de tiempo</b> cuando la hay. Con eso puedes borrar por familias y entender un <code>SCAN</code> de un vistazo.</p>`},
 {t:"opcion", p:"Cambias el formato del JSON que cacheas y despliegas. ¿Qué pasa con lo que ya estaba en Redis?",
  ops:["Se convierte solo","Sigue ahí con el formato viejo, y tu código nuevo puede reventar al deserializarlo","Se borra","Da error al escribir"],
  ok:1, why:"Por eso se pone la versión en la clave: <code>cache:v3:…</code> nace vacía y la vieja caduca sola."},
 {t:"info", eti:"Qué guardar", h:"Tamaño y formato",
  c:`<ul><li><b>JSON</b> es lo más común: legible, fácil de depurar, algo grande.</li>
     <li><b>MessagePack o Protobuf</b>: bastante más pequeños, ilegibles a simple vista.</li>
     <li>Comprimir (gzip) merece la pena a partir de unos pocos KB, no para valores pequeños.</li></ul>
     <p>Y la regla de oro: <b>una clave no debería pasar de unos pocos cientos de KB</b>. Los valores gigantes bloquean Redis al leerlos, escribirlos y borrarlos.</p>`},
 {t:"vf", p:"Guardar la sesión completa con todo el carrito y el historial en una clave de Redis es buena práctica.",
  ok:false, why:"Cuanto más pesa la sesión, más cuesta cada petición. En la sesión va lo mínimo (id de usuario, permisos); lo demás se guarda aparte."},
 {t:"par", p:"Empareja cada decisión con su motivo",
  pares:[["Prefijo cache: en las claves de caché","Poder borrarlas todas sin tocar sesiones ni colas"],["Versión en la clave","Cambiar el formato sin migrar datos"],["TTL en todo lo cacheable","Que la memoria no crezca sin control"],["Valores pequeños","No bloquear el hilo único de Redis"]],
  why:"El nombre de la clave es la única «estructura» que Redis te deja: aprovéchala."},
 {t:"opcion", p:"¿Cómo borrarías todas las claves de caché sin tocar sesiones ni colas?",
  ops:["FLUSHALL","Recorrer con SCAN MATCH cache:* y borrar por lotes con UNLINK","DEL *","Reiniciar Redis"],
  ok:1, why:"<code>FLUSHALL</code> borra <b>todo</b>, incluidas sesiones y colas. Y <code>UNLINK</code> borra en segundo plano, sin bloquear."},
 {t:"escribe", p:"Escribe el comando que borra la clave <code>vieja</code> sin bloquear el hilo principal",
  sol:["UNLINK vieja","unlink vieja"],
  pista:"Como DEL, pero liberando la memoria en segundo plano.",
  why:"Con claves grandes, <code>DEL</code> puede congelar Redis; <code>UNLINK</code> la desengancha al instante y libera después."}
]}

]});
