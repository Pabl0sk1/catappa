window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Cachés",
resumen: "Patrones de caché, políticas de expulsión, invalidación, avalanchas y claves calientes",
nivel: "Intermedio",
color: "#d99c5d",
lecciones: [

{
id:"ds3l1",
titulo:"Patrones de caché",
claves:["Cache-aside: la aplicación mira la caché y, si no está, lee de la base de datos y la guarda","Write-through: escribir en caché y base de datos a la vez; write-behind: escribir en caché y persistir después","Expulsión LRU cuando la caché se llena; TTL para caducar"],
pasos:[
 {t:"info", eti:"Dónde y cómo", h:"Estrategias",
  c:`<div class="diag">CACHE-ASIDE (el mas comun)
  leer:    cache? -&gt; si: devolver | no: BD -&gt; guardar en cache con TTL -&gt; devolver
  escribir: BD -&gt; borrar la clave de la cache

WRITE-THROUGH
  escribir: cache + BD en la misma operacion (la cache siempre al dia)

WRITE-BEHIND
  escribir: cache -&gt; se persiste en BD en segundo plano (rapido, riesgo de perder datos)</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Cache-aside","La aplicación rellena la caché al fallar la lectura"],["Write-through","Cada escritura actualiza caché y base de datos"],["Write-behind","Se escribe en caché y se persiste más tarde"],["LRU","Expulsar lo que hace más tiempo que no se usa"],["TTL","Tiempo tras el que una entrada caduca"]],
  why:"Cache-aside + TTL + invalidar al escribir cubre la mayoría de casos."},
 {t:"opcion", p:"Al actualizar un producto, ¿qué es más seguro en cache-aside: actualizar la entrada de la caché o borrarla?",
  ops:["Actualizarla","Borrarla: la siguiente lectura la recargará de la base de datos, evitando condiciones de carrera que dejarían un valor viejo","Da igual","Ninguna"],
  ok:1, why:"Dos escrituras concurrentes que actualizan la caché pueden dejarla con el valor antiguo."}
]},

{
id:"ds3l2",
titulo:"Problemas de las cachés",
claves:["Invalidación: el problema difícil; decide cuánta obsolescencia es aceptable","Avalancha (thundering herd): muchas peticiones recalculan lo mismo cuando caduca","Claves calientes: una clave concentra la carga; replicar o cachear localmente"],
pasos:[
 {t:"info", eti:"Lo que sale mal", h:"Problemas típicos",
  c:`<ul><li><b>Datos obsoletos</b>: el usuario cambia su nombre y ve el antiguo. Define TTL según cuánto retraso es aceptable e invalida al escribir.</li>
     <li><b>Avalancha</b>: la portada caduca y 10.000 peticiones van a la base de datos a la vez. Soluciones: un único recálculo con bloqueo, servir el valor viejo mientras se recalcula, TTL con variación aleatoria.</li>
     <li><b>Clave caliente</b>: el perfil de un famoso recibe millones de lecturas. Replicar la clave, caché local en memoria de cada réplica, CDN.</li>
     <li><b>Caché fría</b> tras un reinicio: precalentar lo más usado.</li></ul>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Muchas peticiones recalculan la misma clave al caducar","Bloqueo o recálculo único y servir el valor antiguo mientras tanto"],["Todas las claves caducan a la vez","TTL con variación aleatoria (jitter)"],["Una clave recibe muchísimo tráfico","Réplicas de la clave o caché local"],["Datos obsoletos tras actualizar","Invalidar al escribir y TTL adecuado"]],
  why:"Nombrar estos problemas demuestra experiencia en una entrevista."},
 {t:"vf", p:"Una caché elimina por completo el problema de la consistencia de los datos.",
  ok:false, why:"Lo añade: ahora hay dos copias que pueden divergir."}
]}

]});
