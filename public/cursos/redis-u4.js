window.CURSOS = window.CURSOS || {};
(CURSOS.redis = CURSOS.redis || []).push({
titulo: "Maestría: entrevista de Redis",
resumen: "Preguntas frecuentes sobre Redis y su papel en la arquitectura",
nivel: "Maestro",
color: "#bf3a33",
lecciones: [

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
 {t:"par", p:"Empareja cada problema con la solución",
  pares:[["Caché que sirve datos viejos","TTL e invalidación al escribir"],["Redis lleno de memoria","maxmemory y política de expulsión adecuada"],["Bloqueos por una clave gigante","Dividir la clave y usar UNLINK"],["Caída del primario","Réplicas con Sentinel o servicio gestionado con failover"],["Mismo usuario en varias réplicas de la API","Sesiones en Redis"]],
  why:"Estas situaciones aparecen en cualquier sistema con Redis en producción."},
 {t:"info", eti:"Terminado", h:"Has completado Redis",
  c:`<p>Dominas las estructuras de datos, los comandos esenciales, los patrones de caché, sesiones, límites, bloqueos, rankings y colas, y la operación con persistencia, memoria, alta disponibilidad y seguridad.</p>
     <p>Para consolidarlo: añade a tu API de tareas caché de lecturas, límite de peticiones por usuario y un ranking de tareas completadas, con Redis en Docker Compose.</p>`}
]}

]});
