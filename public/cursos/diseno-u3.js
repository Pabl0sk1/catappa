window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Cachés",
resumen: "Patrones de caché, políticas de expulsión, invalidación, estampidas, claves calientes y cachés en varias capas",
nivel: "Intermedio",
color: "#d99c5d",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"ds3l1",
titulo:"Patrones de caché",
claves:["Cache-aside: la aplicación mira la caché y, si no está, lee de la base de datos y la guarda","Write-through: escribir en caché y base de datos a la vez; write-behind: escribir en caché y persistir después","Expulsión LRU o LFU cuando la caché se llena; TTL para caducar"],
pasos:[
 {t:"info", eti:"Dónde y cómo", h:"Estrategias",
  c:`<div class="dg"><div class="dg-tit">tres estrategias de caché</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Cache-aside<br><small>el más común</small></div>
<div class="dg-vert">
<div class="dg-caja acento">leer: ¿está en la caché?</div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja ok doble">sí<small>devolver</small></div><div class="dg-caja doble">no<small>BD → guardar en caché con TTL → devolver</small></div></div></div>
</div>
<div class="dg-caja doble" style="margin-top:8px">escribir<small>BD → borrar la clave de la caché</small></div></div>
<div class="dg-col"><div class="dg-col-tit">Write-through</div>
<div class="dg-caja doble">escribir<small>caché + BD en la misma operación</small></div>
<div class="dg-caja ok">la caché siempre al día</div></div>
<div class="dg-col"><div class="dg-col-tit">Write-behind</div>
<div class="dg-caja doble">escribir<small>caché → se persiste en BD en segundo plano</small></div>
<div class="dg-fila"><div class="dg-caja ok">rápido</div><div class="dg-caja aviso">riesgo de perder datos</div></div></div>
</div></div>
     <p>Dos variantes más: <b>read-through</b> (la propia caché sabe cargar de la base de datos, la aplicación solo habla con la caché) y <b>refresh-ahead</b> (se recarga una entrada muy usada antes de que caduque).</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Cache-aside","La aplicación rellena la caché al fallar la lectura"],["Write-through","Cada escritura actualiza caché y base de datos"],["Write-behind","Se escribe en caché y se persiste más tarde"],["LRU","Expulsar lo que hace más tiempo que no se usa"],["TTL","Tiempo tras el que una entrada caduca"]],
  why:"Cache-aside + TTL + invalidar al escribir cubre la mayoría de casos."},
 {t:"opcion", p:"Al actualizar un producto, ¿qué es más seguro en cache-aside: actualizar la entrada de la caché o borrarla?",
  ops:["Actualizarla","Borrarla: la siguiente lectura la recargará de la base de datos, evitando condiciones de carrera que dejarían un valor viejo","Da igual","Ninguna"],
  ok:1, why:"Dos escrituras concurrentes que actualizan la caché pueden llegar en orden distinto al de la base de datos y dejar el valor antiguo para siempre (hasta el TTL)."},
 {t:"info", eti:"Cuando se llena", h:"Políticas de expulsión",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué se expulsa</div>
<table class="dg-tabla"><thead><tr><th>política</th><th>expulsa</th><th>bien para</th></tr></thead><tbody>
<tr><td>LRU</td><td>lo usado hace más tiempo</td><td>la mayoría de cargas: lo reciente suele volver a usarse</td></tr>
<tr><td>LFU</td><td>lo usado menos veces</td><td>populares estables (un catálogo con superventas)</td></tr>
<tr><td>FIFO</td><td>lo más antiguo en entrar</td><td>casos simples; ignora el uso</td></tr>
<tr><td>TTL</td><td>lo caducado</td><td>acotar lo desfasado que puede estar un dato</td></tr>
</tbody></table></div>
     <p>Redis se configura con <code>maxmemory</code> y <code>maxmemory-policy</code> (<code>allkeys-lru</code>, <code>allkeys-lfu</code>, <code>volatile-ttl</code>…). Sin política, al llenarse rechaza escrituras.</p>
     <p>Por dentro, una LRU es un <b>mapa hash + lista doblemente enlazada</b>: el mapa encuentra la entrada en O(1) y la lista la mueve al principio en O(1).</p>`},
 {t:"vf", p:"Con write-behind, si el nodo de caché se cae antes de persistir, se pueden perder escrituras que el usuario ya vio confirmadas.",
  ok:true, why:"Por eso write-behind se usa donde perder algo es aceptable (contadores, métricas) o con una caché que persiste y replica."},
 {t:"opcion", p:"Una tienda con un catálogo de 10 millones de productos donde 1.000 superventas acaparan casi todas las visitas y un rastreador recorre de vez en cuando todo el catálogo. ¿Qué política protege mejor la caché?",
  ops:["FIFO","LFU (o una LRU resistente a recorridos)","Ninguna","Expulsar al azar"],
  ok:1, why:"Un recorrido completo expulsaría los superventas de una LRU pura; LFU recuerda que se usan mucho. Redis ofrece allkeys-lfu."},
 {t:"codigo", p:"Implementa una caché LRU",
  lenguaje:"js",
  c:`<p>La primera línea es la capacidad. Después, operaciones <code>put clave valor</code> y <code>get clave</code>. Imprime una línea por cada <code>get</code>: el valor o <code>-1</code> si no está. Un <code>get</code> o un <code>put</code> cuentan como uso.</p>
<p>Truco: un <code>Map</code> de JavaScript recuerda el orden de inserción; borrar y volver a insertar mueve una clave al final.</p>`,
  plantilla:`const lineas = require("fs").readFileSync(0, "utf8").trim().split("\\n").map(l => l.trim());
const capacidad = Number(lineas[0]);
const cache = new Map();
const salida = [];
for (const l of lineas.slice(1)) {
  const [op, k, v] = l.split(" ");
  // implementa get y put
}
console.log(salida.join("\\n"));
`,
  pruebas:[{entrada:"2\nput a 1\nput b 2\nget a\nput c 3\nget b\nget a\nget c\n", salida:"1\n-1\n1\n3"},{entrada:"1\nput x 9\nput y 8\nget x\nget y\n", salida:"-1\n8"},{entrada:"2\nput a 1\nput b 2\nput a 5\nput c 3\nget b\nget a\nget c\n", salida:"-1\n5\n3", oculta:true}],
  pista:"En get: si existe, bórrala y vuelve a meterla. En put: bórrala si existe, métela, y si el tamaño supera la capacidad, borra cache.keys().next().value (la más antigua).",
  solucion:`const lineas = require("fs").readFileSync(0, "utf8").trim().split("\\n").map(l => l.trim());
const capacidad = Number(lineas[0]);
const cache = new Map();
const salida = [];
for (const l of lineas.slice(1)) {
  const [op, k, v] = l.split(" ");
  if (op === "get") {
    if (cache.has(k)) {
      const x = cache.get(k);
      cache.delete(k);
      cache.set(k, x);
      salida.push(x);
    } else salida.push("-1");
  } else {
    if (cache.has(k)) cache.delete(k);
    cache.set(k, v);
    if (cache.size > capacidad) cache.delete(cache.keys().next().value);
  }
}
console.log(salida.join("\\n"));
`,
  why:"Es una pregunta clásica de entrevista (LeetCode 146). En Java, LinkedHashMap con accessOrder=true y removeEldestEntry hace lo mismo."}
]},

/* =============== U3 L2 =============== */
{
id:"ds3l2",
titulo:"Problemas de las cachés",
claves:["Invalidación: el problema difícil; decide cuánta obsolescencia es aceptable","Estampida (thundering herd): muchas peticiones recalculan lo mismo cuando caduca; se evita con recálculo único y servir lo viejo","Claves calientes, penetración de caché y avalancha por caducidad simultánea"],
pasos:[
 {t:"info", eti:"Lo que sale mal", h:"Problemas típicos",
  c:`<ul><li><b>Datos obsoletos</b>: el usuario cambia su nombre y ve el antiguo. Define el TTL según cuánto retraso es aceptable e invalida al escribir.</li>
     <li><b>Estampida</b>: la portada caduca y 10.000 peticiones van a la base de datos a la vez. Soluciones: un único recálculo con bloqueo (<i>single flight</i>), servir el valor viejo mientras se recalcula (<i>stale-while-revalidate</i>), o recalcular antes de tiempo con cierta probabilidad.</li>
     <li><b>Avalancha</b>: muchas claves se cargaron a la vez con el mismo TTL y caducan a la vez. TTL con variación aleatoria (<i>jitter</i>).</li>
     <li><b>Clave caliente</b>: el perfil de un famoso recibe millones de lecturas y satura un nodo de Redis. Replicar la clave (<code>perfil:42#1</code> … <code>#8</code>), caché local en memoria de cada réplica, CDN.</li>
     <li><b>Penetración</b>: peticiones a claves que no existen (un bot probando ids) atraviesan la caché siempre. Cachear también el «no existe» con TTL corto, o un filtro de Bloom.</li>
     <li><b>Caché fría</b> tras un reinicio: precalentar lo más usado o arrancar poco a poco.</li></ul>`},
 {t:"info", eti:"En detalle", h:"Estampida: un solo recálculo",
  c:`<div class="dg"><div class="dg-tit">single flight con un cerrojo en Redis</div>
<div class="dg-vert">
<div class="dg-caja aviso">caduca <code>portada</code>; llegan 10.000 peticiones</div>
<div class="dg-caja acento doble"><code>SET lock:portada 1 NX EX 10</code><small>solo una petición consigue el cerrojo</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja ok doble">la ganadora<small>consulta la BD, guarda el valor, suelta el cerrojo</small></div><div class="dg-caja doble">las demás<small>sirven el valor viejo o esperan unos ms y reintentan</small></div></div></div>
</div></div>
     <p>Para poder servir el valor viejo, se guarda con un TTL «lógico» dentro del valor más corto que el TTL real de Redis: cuando pasa el lógico, se recalcula en segundo plano pero se sigue sirviendo el viejo.</p>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Muchas peticiones recalculan la misma clave al caducar","Recálculo único con cerrojo y servir el valor antiguo mientras tanto"],["Todas las claves caducan a la vez","TTL con variación aleatoria (jitter)"],["Una clave recibe muchísimo tráfico","Réplicas de la clave o caché local"],["Datos obsoletos tras actualizar","Invalidar al escribir y TTL adecuado"],["Un bot pide ids que no existen","Cachear el «no existe» o un filtro de Bloom"]],
  why:"Nombrar estos problemas y sus remedios demuestra experiencia en una entrevista."},
 {t:"vf", p:"Una caché elimina por completo el problema de la consistencia de los datos.",
  ok:false, why:"Lo añade: ahora hay dos copias que pueden divergir."},
 {t:"opcion", p:"Borras la clave en la caché y <i>después</i> actualizas la base de datos. Entre medias, otra petición lee. ¿Qué puede pasar?",
  ops:["Nada","La lectura no encuentra la clave, lee el valor viejo de la base de datos y lo vuelve a meter en la caché: queda obsoleto hasta el TTL","Se corrompe la base de datos","Redis lo impide"],
  ok:1, why:"Por eso el orden recomendado es: actualizar la base de datos y después borrar la clave. Aun así hay carreras raras; algunos sistemas borran otra vez al cabo de unos cientos de ms (doble borrado) o invalidan a partir del CDC de la base de datos."},
 {t:"opcion", p:"Cargas 1 millón de claves en un arranque con TTL de 3.600 s exactos. ¿Qué pasará dentro de una hora?",
  ops:["Nada especial","Caducarán todas a la vez y la base de datos recibirá una avalancha de lecturas","Redis las renovará solo","Se duplicarán"],
  ok:1, why:"Con TTL = 3.600 + aleatorio(0, 600) las caducidades se reparten en diez minutos."},
 {t:"hueco", p:"Completa el comando de Redis que coge un cerrojo solo si no existe y lo hace caducar a los 10 segundos",
  tpl:"SET lock:portada 1 ___ ___ 10",
  banco:["NX","XX","EX","PX","KEEPTTL"],
  sol:["NX","EX"],
  why:"NX = solo si no existe; EX = caducidad en segundos. La caducidad evita que el cerrojo se quede para siempre si el proceso que lo tenía muere."},
 {t:"escribe", p:"¿Qué estructura probabilística responde «seguro que no está» o «puede que esté» y se usa para frenar consultas a claves inexistentes?",
  sol:["filtro de bloom","bloom filter","filtro bloom","bloom"],
  pista:"Lleva el apellido de quien la inventó en 1970.",
  why:"Un filtro de Bloom nunca da falsos negativos, solo falsos positivos, y ocupa muy poco: unos 10 bits por elemento para un 1% de falsos positivos."}
]},

/* =============== U3 L3 =============== */
{
id:"ds3n1",
titulo:"Cachés en varias capas y distribuidas",
claves:["Caché local (en el proceso) frente a distribuida (Redis, Memcached): velocidad frente a coherencia","La tasa de aciertos manda: latencia media = aciertos × rápido + fallos × lento","HTTP también cachea: ETag y 304 Not Modified ahorran ancho de banda"],
pasos:[
 {t:"info", eti:"Capas", h:"Local, distribuida o las dos",
  c:`<div class="dg"><div class="dg-tit">caché en dos niveles</div>
<div class="dg-vert">
<div class="dg-caja acento doble">L1: caché en memoria del proceso<small>~100 ns · pequeña · cada réplica la suya</small></div>
<div class="dg-caja doble">L2: Redis o Memcached<small>~0,5 ms · compartida · GB o TB repartidos en nodos</small></div>
<div class="dg-caja ok doble">base de datos<small>~5–50 ms</small></div>
</div>
<div class="dg-nota">la L1 absorbe las claves calientes; la L2 da coherencia entre réplicas</div></div>
     <ul><li><b>Local</b> (Caffeine en Java, un LRU en memoria): rapidísima, pero cada réplica tiene su copia y pueden divergir. Para datos que cambian poco o con TTL de segundos.</li>
     <li><b>Distribuida</b>: una sola copia lógica compartida. Redis Cluster reparte las claves en 16.384 <i>slots</i> entre nodos; Memcached reparte con hashing consistente en el cliente.</li>
     <li>Para invalidar las L1 de todas las réplicas se publica la clave por pub/sub y cada réplica la borra.</li></ul>`},
 {t:"info", eti:"Cuentas", h:"Tasa de aciertos y tamaño",
  c:`<div class="termbox">latencia media = aciertos × latencia_caché + fallos × latencia_BD

aciertos 90%:  0,90 × 0,5 ms + 0,10 × 10 ms = 1,45 ms
aciertos 99%:  0,99 × 0,5 ms + 0,01 × 10 ms = 0,60 ms
carga en la BD:  del 10% al 1% de las lecturas  -&gt; 10 veces menos</div>
     <p>Pasar del 90% al 99% de aciertos divide por diez la carga en la base de datos. El tamaño se estima con el <b>conjunto de trabajo</b>: lo que se usa en un periodo. Regla habitual: el 20% de los datos recibe el 80% de las lecturas, así que se cachea ese 20%.</p>
     <p><b>HTTP</b>: el servidor manda <code>ETag: "v42"</code>; el cliente la reenvía en <code>If-None-Match</code> y, si no ha cambiado, recibe <code>304 Not Modified</code> sin cuerpo.</p>`},
 {t:"opcion", p:"Hay 20 réplicas con una caché local de precios con TTL de 5 minutos y cambias un precio. ¿Qué ven los usuarios?",
  ops:["El precio nuevo en todas las réplicas al instante","Precios distintos según la réplica que les toque, hasta 5 minutos","Un error","Nada cambia nunca"],
  ok:1, why:"Soluciones: TTL más corto, invalidación por pub/sub, o no usar caché local para datos que deben verse iguales en todas partes (el precio al pagar se lee siempre de la fuente)."},
 {t:"opcion", p:"Tu caché acierta el 95% con 0,5 ms y la base de datos tarda 20 ms. ¿Latencia media aproximada?",
  ops:["~0,5 ms","~1,5 ms","~10 ms","~20 ms"],
  ok:1, why:"0,95 × 0,5 + 0,05 × 20 = 0,475 + 1 ≈ 1,5 ms. Los fallos dominan la media aunque sean pocos."},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["Caffeine / caché en proceso","Nivel 1, nanosegundos, una copia por réplica"],["Redis Cluster","Caché compartida repartida en 16.384 slots"],["ETag + If-None-Match","Evitar reenviar un cuerpo que no ha cambiado"],["Pub/sub de invalidación","Avisar a todas las réplicas de que borren una clave"]],
  why:"En una entrevista, decir en qué capa cacheas cada cosa y cómo la invalidas vale más que decir «pongo Redis»."},
 {t:"vf", p:"Una respuesta 304 Not Modified incluye el cuerpo completo del recurso.",
  ok:false, why:"Precisamente no lo incluye: el cliente usa la copia que ya tenía. Ahorra ancho de banda, no la ida y vuelta."},
 {t:"codigo", p:"Calcula la latencia media y la carga que llega a la base de datos",
  lenguaje:"py",
  c:`<p>Lee cuatro líneas: tasa de aciertos (0–1), latencia de la caché en ms, latencia de la BD en ms y lecturas por segundo. Imprime la latencia media con 2 decimales y las lecturas por segundo que llegan a la BD (redondeadas):</p>
<div class="termbox">media: 1.45 ms
bd: 1000/s</div>`,
  plantilla:`aciertos = float(input())
lat_cache = float(input())
lat_bd = float(input())
lecturas = int(input())
# calcula
`,
  pruebas:[{entrada:"0.9\n0.5\n10\n10000\n", salida:"media: 1.45 ms\nbd: 1000/s"},{entrada:"0.99\n0.5\n10\n10000\n", salida:"media: 0.60 ms\nbd: 100/s"},{entrada:"0.8\n1\n25\n5000\n", salida:"media: 5.80 ms\nbd: 1000/s", oculta:true}],
  pista:"fallos = 1 - aciertos. Usa f\"{valor:.2f}\" para los dos decimales.",
  solucion:`aciertos = float(input())
lat_cache = float(input())
lat_bd = float(input())
lecturas = int(input())
fallos = 1 - aciertos
media = aciertos * lat_cache + fallos * lat_bd
print(f"media: {media:.2f} ms")
print(f"bd: {round(lecturas * fallos)}/s")
`,
  why:"Esta cuenta justifica en una entrevista por qué merece la pena subir la tasa de aciertos: cada punto que ganas se lo quitas a la base de datos."}
]}

]});
