window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Maestría: diseñar con Redis",
resumen: "Un caso completo de principio a fin y el simulacro de entrevista",
nivel: "Maestro",
color: "#b0332d",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"rs7l1",
titulo:"Caso real: la tienda en hora punta",
claves:["Cada problema pide una estructura distinta: elegirla es el trabajo","Todo lo cacheable lleva TTL y clave versionada","Lo que no puede perderse no vive solo en Redis"],
pasos:[
 {t:"info", eti:"El encargo", h:"Lo que hay que sostener",
  c:`<p>Una tienda espera 20.000 visitas por minuto en el lanzamiento de un producto. Necesita:</p>
     <ul><li>la ficha del producto, que ahora tarda 300 ms en la base de datos</li>
     <li>que cada usuario no pueda pasar de 60 peticiones por minuto a la API</li>
     <li>un ranking de los productos más vistos de la hora</li>
     <li>sesiones compartidas entre 8 réplicas</li>
     <li>que el correo de confirmación se envíe una sola vez por pedido</li></ul>
     <p>Piensa qué estructura usarías para cada cosa antes de seguir.</p>`},
 {t:"par", p:"Empareja cada necesidad con la solución en Redis",
  pares:[["Ficha de producto","String con el JSON y TTL corto, clave cache:v1:producto:42"],["Límite por usuario","INCR con EXPIRE por ventana"],["Más vistos de la hora","Sorted set con ZINCRBY y clave por hora"],["Sesiones entre réplicas","Hash o string por sesión con TTL"],["Correo una sola vez","SET NX con TTL largo"]],
  why:"Cinco problemas, cinco estructuras. Ese es el trabajo real con Redis."},
 {t:"opcion", p:"La ficha del producto se consulta 20.000 veces por minuto y cambia como mucho una vez al día. ¿Qué TTL pones?",
  ops:["1 segundo","Minutos, con algo de aleatoriedad, e invalidación explícita cuando el producto cambie","Ninguno","Una semana"],
  ok:1, why:"TTL corto y además invalidar al escribir: lo primero limita el daño si falla lo segundo."},
 {t:"info", eti:"La clave del ranking", h:"Por qué lleva la hora dentro",
  c:`<div class="termbox">ZINCRBY vistos:2026-09-22T18 1 producto:42
EXPIRE  vistos:2026-09-22T18 7200        # se borra solo a las dos horas
ZREVRANGE vistos:2026-09-22T18 0 9 WITHSCORES</div>
     <p>Con la ventana en el nombre de la clave, el «ranking de la hora» se vacía solo y no hay que borrar nada a mano. Es el mismo truco que en el limitador de peticiones.</p>`},
 {t:"opcion", p:"El producto se agota y hay que dejar de venderlo <b>ya</b>. ¿Puedes confiar en la caché?",
  ops:["Sí, caducará","No para el stock: lo que no puede estar obsoleto ni un segundo se lee de la base de datos, o se invalida explícitamente al cambiar","Sí, con TTL de 1 s","Da igual"],
  ok:1, why:"Se cachea lo que puede estar un poco viejo. El stock en el momento de comprar, no."},
 {t:"vf", p:"Meter las sesiones en Redis significa que si Redis se cae, todo el mundo pierde la sesión.",
  ok:true, why:"Por eso las sesiones llevan persistencia y réplica, o se firman en una cookie (JWT) y Redis solo guarda lo revocado. Es una decisión consciente, no un descuido."},
 {t:"opcion", p:"Con 8 réplicas, ¿dónde pones el contador de «vistas» de un producto?",
  ops:["En memoria de cada réplica y luego se suma","En Redis con INCR: es el único sitio donde las 8 réplicas ven el mismo número","En la base de datos, con UPDATE en cada visita","En un fichero"],
  ok:1, why:"Un <code>UPDATE</code> por visita en la base relacional es justo lo que Redis viene a evitar."}
]},

/* =============== U7 L2 =============== */
{
id:"rs4l1",
titulo:"Simulacro de entrevista de Redis",
claves:["Sabes elegir la estructura de datos adecuada","Conoces los patrones de caché, límites, bloqueos y rankings","Sabes operarlo: persistencia, memoria, alta disponibilidad y seguridad"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Por qué Redis es tan rápido?»",
  ops:["Por usar SQL","Datos en memoria, estructuras eficientes y un modelo de un solo hilo para los comandos que evita bloqueos, con E/S de red multiplexada","Porque comprime todo","Porque no tiene red"],
  ok:1, why:"Y su punto débil: una operación lenta bloquea a todos."},
 {t:"opcion", p:"«¿Cómo implementarías un ranking en tiempo real?»",
  ops:["Una tabla SQL con ORDER BY en cada petición","Un sorted set: ZINCRBY para sumar puntos y ZREVRANGE para el top, ambos en O(log n)","Una lista","Un string por usuario"],
  ok:1, why:"Es el ejemplo canónico de sorted set."},
 {t:"opcion", p:"«¿Redis como base de datos principal?»",
  ops:["Siempre","Posible para casos concretos con persistencia AOF y réplicas, pero normalmente es caché o almacén auxiliar; la memoria es cara y el modelo de consultas es limitado","Nunca, pierde datos","Solo con SQL"],
  ok:1, why:"Una respuesta matizada según el caso."},
 {t:"opcion", p:"«Tu caché tiene una tasa de aciertos del 30%. ¿Qué investigas?»",
  ops:["Nada, es normal","Si los TTL son demasiado cortos, si las claves incluyen algo que las hace casi únicas, o si hay expulsiones por falta de memoria","Cambiar de caché","Más réplicas"],
  ok:1, why:"Una clave que incluye la hora exacta o un identificador de petición no se reutiliza jamás: es un error muy común."},
 {t:"opcion", p:"«¿Cómo harías que una tarea programada se ejecute una sola vez con 5 réplicas?»",
  ops:["Ejecutarla en todas y que dé igual","Un bloqueo con SET NX EX y valor único, liberado con un script Lua que compruebe que sigue siendo suyo","Desactivarla en cuatro réplicas a mano","Con pub/sub"],
  ok:1, why:"Y mencionar el matiz de la caducidad frente a la duración de la tarea suma muchos puntos."},
 {t:"par", p:"Empareja cada problema con la solución",
  pares:[["Caché que sirve datos viejos","TTL e invalidación al escribir"],["Redis lleno de memoria","maxmemory y política de expulsión adecuada"],["Bloqueos por una clave gigante","Dividir la clave y usar UNLINK"],["Caída del primario","Réplicas con Sentinel o servicio gestionado con failover"],["Mismo usuario en varias réplicas de la API","Sesiones en Redis"],["Todo caduca a la vez y tumba la base","Repartir los TTL y proteger el recálculo"]],
  why:"Estas situaciones aparecen en cualquier sistema con Redis en producción."},
 {t:"info", eti:"Terminado", h:"Has completado Redis",
  c:`<p>Dominas las estructuras de datos y cuándo usar cada una, la caducidad, los patrones de caché, sesiones, límites, bloqueos, rankings, colas y pub/sub, el trabajo desde la aplicación con pipelining y Lua, la memoria y la persistencia, y la operación en producción.</p>
     <p>Para consolidarlo: añade a tu API de tareas caché de lecturas con invalidación, límite de peticiones por usuario y un ranking de tareas completadas, con Redis en Docker Compose.</p>`}
]}

]});
