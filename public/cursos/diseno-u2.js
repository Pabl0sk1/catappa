window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Escalar la aplicación",
resumen: "Escalado vertical y horizontal, servicios sin estado, autoescalado, balanceadores de carga, DNS y CDN",
nivel: "Fundamentos",
color: "#e3a86b",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"ds2l1",
titulo:"Vertical y horizontal",
claves:["Vertical: una máquina más grande; simple pero con techo y punto único de fallo","Horizontal: más máquinas iguales detrás de un balanceador","Para escalar en horizontal, los servidores no deben guardar estado"],
pasos:[
 {t:"info", eti:"Crecer", h:"Dos formas de escalar",
  c:`<div class="dg"><div class="dg-tit">vertical frente a horizontal</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Vertical</div>
<div class="dg-caja acento doble">un servidor enorme<small>más CPU, más RAM, más disco</small></div>
<div class="dg-caja ok">nada que cambiar en el código</div>
<div class="dg-caja aviso">techo físico y precio que crece rápido</div>
<div class="dg-caja aviso">si cae, cae todo</div></div>
<div class="dg-col"><div class="dg-col-tit">Horizontal</div>
<div class="dg-flujo"><div class="dg-caja base">usuarios</div><div class="dg-caja">balanceador</div><div class="dg-caja acento">app × N</div></div>
<div class="dg-caja ok">casi sin límite y tolera fallos</div>
<div class="dg-caja aviso">la app no puede guardar estado en memoria</div>
<div class="dg-caja aviso">más piezas que operar</div></div>
</div></div>
     <p><b>Sin estado</b> significa que cualquier réplica puede atender cualquier petición: la sesión va en un token o en Redis, los ficheros en almacenamiento de objetos, los datos en la base de datos.</p>`},
 {t:"par", p:"Empareja cada estado con dónde debe vivir para escalar en horizontal",
  pares:[["Sesión del usuario","Token (JWT) o Redis compartido"],["Ficheros subidos","Almacenamiento de objetos (S3)"],["Datos de negocio","Base de datos"],["Caché de consultas","Caché compartida (Redis)"],["Tareas en curso","Cola de mensajes"]],
  why:"Si una réplica muere o se añade otra, no se pierde nada: todo lo importante vive fuera del proceso."},
 {t:"opcion", p:"Tu app guarda los carritos en un HashMap en memoria y pasas de 1 a 4 réplicas. ¿Qué pasa?",
  ops:["Todo sigue igual","Cada réplica tiene su propio mapa: los usuarios pierden el carrito según a qué réplica vayan","Se sincronizan solas","Va más rápido"],
  ok:1, why:"Hay que sacar el estado a un almacén compartido. Las «sesiones pegajosas» lo esconden, pero el carrito se pierde igual cuando esa réplica se reinicia."},
 {t:"info", eti:"Matices", h:"Cuándo vale lo vertical y cómo se autoescala",
  c:`<p>Escalar en vertical no es un pecado: una base de datos PostgreSQL en una máquina de 64 núcleos y 512 GB de RAM aguanta muchísimo, y es mucho más simple que particionar. Muchas empresas escalan la base de datos en vertical y la capa de aplicación en horizontal.</p>
     <p>El <b>autoescalado</b> añade o quita réplicas según una métrica: CPU, peticiones por réplica o longitud de una cola. Tiene letra pequeña:</p>
     <ul><li>Tarda: arrancar una réplica lleva de segundos a minutos. Para picos predecibles (una campaña), se escala <b>antes</b>.</li>
     <li>La métrica debe reflejar la saturación: para workers de una cola, la longitud de la cola es mejor que la CPU.</li>
     <li>Escalar la app no sirve si el cuello de botella es la base de datos: más réplicas = más conexiones contra ella.</li></ul>`},
 {t:"opcion", p:"Tus workers procesan una cola y a veces se acumulan 100.000 mensajes con la CPU al 30%. ¿Qué métrica usarías para autoescalarlos?",
  ops:["CPU","Longitud (o antigüedad) de la cola por worker","Memoria libre","Número de ficheros abiertos"],
  ok:1, why:"Los workers esperan a E/S (red, base de datos), así que la CPU no refleja el retraso. La antigüedad del mensaje más viejo es lo que nota el usuario."},
 {t:"vf", p:"Duplicar las réplicas de la aplicación siempre duplica la capacidad del sistema.",
  ok:false, why:"Solo si el cuello de botella está en la aplicación. Si es la base de datos, un servicio externo o un bloqueo compartido, más réplicas pueden empeorarlo."},
 {t:"opcion", p:"¿Qué son las «sesiones pegajosas» (sticky sessions)?",
  ops:["Sesiones cifradas","El balanceador envía siempre al mismo usuario a la misma réplica, normalmente con una cookie","Sesiones que no caducan","Un tipo de base de datos"],
  ok:1, why:"Sirven de parche para apps con estado, pero reparten peor la carga y pierden la sesión si esa réplica cae. Mejor, estado fuera."},
 {t:"escribe", p:"¿Cómo se llama la propiedad de un servicio en el que cualquier réplica puede atender cualquier petición porque no guarda datos del usuario en memoria? (en inglés)",
  sol:["stateless","sin estado"],
  pista:"«Sin estado» en inglés.",
  why:"Stateless es el requisito previo para escalar en horizontal y para desplegar sin cortar el servicio."}
]},

/* =============== U2 L2 =============== */
{
id:"ds2l2",
titulo:"Balanceo de carga",
claves:["El balanceador reparte, comprueba salud, termina TLS y retira réplicas enfermas","Capa 4 (TCP) frente a capa 7 (HTTP): velocidad frente a enrutado inteligente","Algoritmos: round robin, ponderado, menos conexiones, hash"],
pasos:[
 {t:"info", eti:"La entrada", h:"Arquitectura típica",
  c:`<div class="dg"><div class="dg-tit">el camino de una petición</div>
<div class="dg-vert">
<div class="dg-caja base">usuario</div>
<div class="dg-caja doble">DNS<small>puede enrutar por región</small></div>
<div class="dg-caja doble">CDN<small>estáticos, imágenes, respuestas cacheables</small></div>
<div class="dg-caja doble">balanceador<small>TLS, salud, reparto</small></div>
<div class="dg-caja acento doble">N réplicas de la API<small>sin estado</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-pila"><div class="dg-fila"><div class="dg-caja ok">caché (Redis)</div><div class="dg-caja ok doble">base de datos<small>primaria + réplicas de lectura</small></div></div><div class="dg-fila"><div class="dg-caja ok">cola → workers</div><div class="dg-caja ok">almacenamiento de objetos</div></div></div></div>
</div></div>`},
 {t:"info", eti:"Por dentro", h:"Capa 4, capa 7 y algoritmos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">dos niveles de balanceo</div>
<table class="dg-tabla"><thead><tr><th></th><th>capa 4 (TCP/UDP)</th><th>capa 7 (HTTP)</th></tr></thead><tbody>
<tr><td>ve</td><td>IP y puerto</td><td>URL, cabeceras, cookies</td></tr>
<tr><td>puede</td><td>reenviar conexiones muy rápido</td><td>enrutar <code>/api</code> y <code>/img</code> a sitios distintos, reintentar, terminar TLS</td></tr>
<tr><td>ejemplos</td><td>AWS NLB, IPVS</td><td>AWS ALB, NGINX, Envoy, HAProxy</td></tr>
</tbody></table></div>
     <ul><li><b>Round robin</b>: por turnos. Bien si todas las peticiones cuestan parecido.</li>
     <li><b>Ponderado</b>: más peticiones a las máquinas más grandes.</li>
     <li><b>Menos conexiones</b>: a la réplica con menos trabajo en curso. Mejor con peticiones de duración variable.</li>
     <li><b>Hash</b> (de IP, de usuario): el mismo cliente, a la misma réplica; útil para cachés locales.</li></ul>
     <p><b>Comprobaciones de salud</b>: el balanceador llama a <code>/health</code> y saca las réplicas que fallan. Al desplegar, el <b>drenado de conexiones</b> deja terminar las peticiones en curso antes de retirar una réplica.</p>
     <div class="nota ojo"><b class="tit">El balanceador también cae</b>Se despliega en pareja (activo-pasivo con IP virtual) o se usa uno gestionado que ya es redundante entre zonas.</div>`},
 {t:"par", p:"Empareja cada capa con lo que aporta",
  pares:[["Caché del navegador","Evita incluso la petición"],["CDN","Contenido cerca del usuario y menos carga en el origen"],["Balanceador","Reparte carga y retira réplicas enfermas"],["Caché de aplicación (Redis)","Evita consultas repetidas a la base de datos"],["Réplicas de lectura","Reparten la carga de lectura de la base de datos"]],
  why:"En el diseño de un sistema con muchas lecturas, la caché es casi siempre la primera respuesta."},
 {t:"opcion", p:"Un sistema tiene 100 lecturas por cada escritura. ¿Qué optimización suele dar más resultado?",
  ops:["Más escrituras en paralelo","Cachear las lecturas (CDN y Redis) y añadir réplicas de lectura","Particionar las escrituras","Un servidor más grande de escritura"],
  ok:1, why:"Optimiza la operación que domina."},
 {t:"opcion", p:"Unas peticiones tardan 5 ms y otras (informes) 20 s. ¿Qué algoritmo de balanceo reparte mejor?",
  ops:["Round robin","Menos conexiones (least connections)","Aleatorio puro","Hash de la IP"],
  ok:1, why:"Round robin puede acumular varios informes lentos en la misma réplica; menos conexiones mira el trabajo que hay en curso."},
 {t:"vf", p:"Un balanceador de capa 4 puede enviar <code>/api/*</code> a un grupo de servidores y <code>/static/*</code> a otro.",
  ok:false, why:"En capa 4 solo ve IP y puerto; para enrutar por ruta HTTP necesitas capa 7."},
 {t:"opcion", p:"¿Qué debería comprobar el endpoint de salud que usa el balanceador para sacar réplicas?",
  ops:["Que la réplica puede atender peticiones (proceso vivo y sus recursos propios listos), sin fallar porque una dependencia compartida esté lenta","Que todas las dependencias externas responden, incluida la base de datos, en cada llamada","Nada: basta con devolver 200 siempre","El uso de disco del balanceador"],
  ok:0, why:"Si el health check falla cuando la base de datos va lenta, el balanceador sacará todas las réplicas a la vez y convertirá un problema parcial en una caída total."},
 {t:"codigo", p:"Simula el balanceo por menos conexiones",
  lenguaje:"py",
  c:`<p>Primera línea: conexiones activas de cada réplica, separadas por espacios. Segunda línea: número de peticiones nuevas que llegan (y que no terminan). Cada petición va a la réplica con menos conexiones; si hay empate, a la de índice más bajo. Imprime las conexiones finales separadas por espacios.</p>`,
  plantilla:`activas = list(map(int, input().split()))
nuevas = int(input())
# reparte las peticiones nuevas
print(" ".join(map(str, activas)))
`,
  pruebas:[{entrada:"3 0 1\n4\n", salida:"3 3 2"},{entrada:"0 0\n3\n", salida:"2 1"},{entrada:"10 2 2 5\n7\n", salida:"10 6 5 5", oculta:true}],
  pista:"En cada vuelta, i = activas.index(min(activas)) y suma uno a activas[i]. index() devuelve el primero en caso de empate.",
  solucion:`activas = list(map(int, input().split()))
nuevas = int(input())
for _ in range(nuevas):
    i = activas.index(min(activas))
    activas[i] += 1
print(" ".join(map(str, activas)))
`,
  why:"Los balanceadores reales usan variantes más baratas, como «el mejor de dos al azar»: elegir dos réplicas aleatorias y mandar a la menos cargada da casi el mismo reparto sin mirar todas."}
]},

/* =============== U2 L3 =============== */
{
id:"ds2n1",
titulo:"DNS, CDN y el borde",
claves:["El DNS traduce nombres y puede enrutar por región, latencia o salud","La CDN guarda copias en servidores cercanos al usuario; se controla con Cache-Control","Ficheros estáticos con nombre versionado: caché de un año sin miedo a invalidar"],
pasos:[
 {t:"info", eti:"Antes de llegar", h:"El DNS como primer balanceador",
  c:`<div class="dg"><div class="dg-tit">resolver app.ejemplo.com</div>
<div class="dg-flujo"><div class="dg-caja base">navegador<small>caché local</small></div><div class="dg-caja">resolvedor<small>del operador o 1.1.1.1</small></div><div class="dg-caja">servidores raíz y .com</div><div class="dg-caja acento">DNS autoritativo<small>devuelve la IP</small></div></div>
<div class="dg-nota arriba">cada respuesta se cachea durante su TTL</div></div>
     <ul><li><b>GeoDNS / enrutado por latencia</b>: responde con la IP de la región más cercana al usuario.</li>
     <li><b>Failover por DNS</b>: si la región principal no pasa sus health checks, responde con la secundaria. Lo limita el TTL: con TTL de 1 hora, algunos clientes tardarán una hora en cambiar.</li>
     <li><b>Anycast</b>: la misma IP se anuncia desde muchos puntos del mundo y la red lleva cada paquete al más cercano. Es lo que usan las CDN y los resolvedores públicos.</li></ul>`},
 {t:"info", eti:"El borde", h:"Cómo funciona una CDN",
  c:`<div class="dg"><div class="dg-tit">CDN en modo «pull»</div>
<div class="dg-vert">
<div class="dg-caja base">usuario en Sevilla</div>
<div class="dg-caja acento doble">nodo de la CDN en Madrid<small>¿la tengo en caché? sí → responde en ~10 ms</small></div>
<div class="dg-caja doble">no → la pide al origen<small>y la guarda según Cache-Control</small></div>
<div class="dg-caja ok">tu servidor (origen)</div>
</div></div>
     <ul><li><b>Pull</b> (lo habitual): la CDN pide al origen la primera vez y cachea. <b>Push</b>: subes tú los ficheros a la CDN.</li>
     <li>La cabecera <code>Cache-Control</code> decide: <code>public, max-age=31536000, immutable</code> para ficheros con hash en el nombre (<code>app.3f9a1c.js</code>); <code>no-store</code> para datos personales; <code>s-maxage</code> fija el tiempo solo para cachés compartidas como la CDN.</li>
     <li><b>Invalidar</b> una CDN es lento y a veces cuesta dinero: es mejor cambiar el nombre del fichero en cada versión.</li>
     <li>Las CDN también protegen (absorben ataques DDoS, WAF) y aceleran lo dinámico reutilizando conexiones hasta el origen.</li></ul>`},
 {t:"par", p:"Empareja cada cabecera con su uso",
  pares:[["Cache-Control: public, max-age=31536000, immutable","JavaScript con hash en el nombre del fichero"],["Cache-Control: no-store","Página con los datos bancarios del usuario"],["Cache-Control: private, max-age=60","Respuesta personal que solo puede guardar el navegador"],["Cache-Control: public, s-maxage=30","Portada que la CDN puede servir 30 segundos"]],
  why:"private impide que una caché compartida (CDN, proxy) guarde la respuesta: evita servir los datos de un usuario a otro."},
 {t:"hueco", p:"Completa la cabecera para un fichero <code>app.3f9a1c.js</code> que no cambiará nunca",
  tpl:"Cache-Control: ___, max-age=___, immutable",
  banco:["public","private","31536000","no-store","0"],
  sol:["public","31536000"],
  why:"31.536.000 segundos es un año. Si cambia el código, cambia el hash y por tanto la URL: nunca hay que invalidar."},
 {t:"opcion", p:"Cambias la IP de tu servicio en el DNS y hay usuarios que siguen yendo a la vieja durante horas. ¿Por qué?",
  ops:["El DNS está roto","Los resolvedores y clientes tenían la respuesta en caché durante su TTL","La CDN bloquea el cambio","Los navegadores no usan DNS"],
  ok:1, why:"Antes de una migración se baja el TTL (por ejemplo a 60 s) con antelación; después del cambio se vuelve a subir."},
 {t:"vf", p:"Una CDN solo sirve para imágenes y ficheros estáticos.",
  ok:false, why:"También cachea respuestas de API públicas durante segundos, termina TLS cerca del usuario, absorbe DDoS y puede ejecutar código en el borde."},
 {t:"opcion", p:"Una noticia viral hace que 1 millón de usuarios pidan la misma página en un minuto. ¿Qué la protege mejor?",
  ops:["Más réplicas de la API","Cachearla en la CDN aunque sea con un TTL corto (5–30 s)","Una base de datos más grande","Desactivar la caché"],
  ok:1, why:"Con s-maxage=10, el origen recibe una petición cada 10 s por nodo de la CDN en lugar de un millón por minuto."},
 {t:"escribe", p:"¿Qué técnica de red anuncia la misma IP desde muchos puntos para que cada usuario llegue al más cercano?",
  sol:["anycast","Anycast"],
  pista:"Lo contrario de unicast, que tiene un único destino.",
  why:"Anycast es la base de las CDN y de resolvedores como 1.1.1.1 u 8.8.8.8."}
]}

]});
