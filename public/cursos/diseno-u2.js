window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Escalar la aplicación",
resumen: "Escalado vertical y horizontal, servicios sin estado, balanceadores, CDN y cachés en varias capas",
nivel: "Fundamentos",
color: "#e3a86b",
lecciones: [

{
id:"ds2l1",
titulo:"Vertical y horizontal",
claves:["Vertical: una máquina más grande; simple pero con techo y punto único de fallo","Horizontal: más máquinas iguales detrás de un balanceador","Para escalar en horizontal, los servidores no deben guardar estado"],
pasos:[
 {t:"info", eti:"Crecer", h:"Dos formas de escalar",
  c:`<div class="diag">VERTICAL                          HORIZONTAL
[ servidor enorme ]               usuarios -&gt; balanceador -&gt; [app] [app] [app] [app]
+ nada que cambiar                + casi sin limite, tolera fallos
- techo fisico y precio           - la app no puede guardar estado en memoria
- si cae, cae todo                - mas piezas que operar</div>
     <p><b>Sin estado</b> significa que cualquier réplica puede atender cualquier petición: la sesión va en un token o en Redis, los ficheros en S3, los datos en la base de datos.</p>`},
 {t:"par", p:"Empareja cada estado con dónde debe vivir para escalar en horizontal",
  pares:[["Sesión del usuario","Token (JWT) o Redis compartido"],["Ficheros subidos","Almacenamiento de objetos (S3)"],["Datos de negocio","Base de datos"],["Caché de consultas","Caché compartida (Redis)"],["Tareas en curso","Cola de mensajes"]],
  why:"Es exactamente por qué los beans de Spring deben ser sin estado."},
 {t:"opcion", p:"Tu app guarda los carritos en un HashMap en memoria y pasas de 1 a 4 réplicas. ¿Qué pasa?",
  ops:["Todo sigue igual","Cada réplica tiene su propio mapa: los usuarios pierden el carrito según a qué réplica vayan","Se sincronizan solas","Va más rápido"],
  ok:1, why:"Hay que sacar el estado a un almacén compartido."}
]},

{
id:"ds2l2",
titulo:"Balanceadores, CDN y capas de caché",
claves:["El balanceador reparte, comprueba salud y termina TLS","La CDN sirve contenido estático (y cacheable) cerca del usuario","Cachear en cada capa: navegador, CDN, aplicación, base de datos"],
pasos:[
 {t:"info", eti:"La entrada", h:"Arquitectura típica",
  c:`<div class="diag">usuario
  -&gt; DNS (puede enrutar por region)
  -&gt; CDN (estaticos, imagenes, respuestas cacheables)
  -&gt; balanceador (TLS, salud, reparto)
  -&gt; N replicas de la API (sin estado)
       -&gt; cache (Redis)
       -&gt; base de datos (primaria + replicas de lectura)
       -&gt; cola -&gt; workers
       -&gt; almacenamiento de objetos</div>`},
 {t:"par", p:"Empareja cada capa con lo que aporta",
  pares:[["Caché del navegador","Evita incluso la petición"],["CDN","Contenido cerca del usuario y menos carga en el origen"],["Balanceador","Reparte carga y retira réplicas enfermas"],["Caché de aplicación (Redis)","Evita consultas repetidas a la base de datos"],["Réplicas de lectura","Reparten la carga de lectura de la base de datos"]],
  why:"En el diseño de un sistema con muchas lecturas, la caché es casi siempre la primera respuesta."},
 {t:"opcion", p:"Un sistema tiene 100 lecturas por cada escritura. ¿Qué optimización suele dar más resultado?",
  ops:["Más escrituras en paralelo","Cachear las lecturas (CDN y Redis) y añadir réplicas de lectura","Particionar las escrituras","Un servidor más grande de escritura"],
  ok:1, why:"Optimiza la operación que domina."}
]}

]});
