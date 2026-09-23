window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Ficheros, búsqueda y tiempo real",
resumen: "Almacenamiento de objetos con URLs prefirmadas y subidas por partes, motores de búsqueda con índice invertido, y comunicación en tiempo real con SSE y WebSocket",
nivel: "Avanzado",
color: "#c98b49",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"ds9n1",
titulo:"Almacenamiento de objetos",
claves:["Los ficheros van a un almacén de objetos (S3 y compatibles); en la base de datos solo sus metadatos y su clave","El cliente sube y descarga directamente con URLs prefirmadas: el servidor no toca los bytes","Subida por partes para ficheros grandes, clases de almacenamiento y reglas de ciclo de vida"],
pasos:[
 {t:"info", eti:"Ficheros a escala", h:"Por qué un almacén de objetos",
  c:`<ul><li>Guarda <b>objetos</b> (bytes + metadatos) bajo una <b>clave</b> dentro de un <b>bucket</b>: <code>s3://fotos-prod/usuarios/42/avatar-9f1c.jpg</code>. No hay carpetas de verdad, solo prefijos.</li>
     <li>Durabilidad altísima (S3 está diseñado para 99,999999999%, «once nueves»), porque replica en varias zonas. Capacidad prácticamente ilimitada y se paga por GB y por petición.</li>
     <li>S3 tiene consistencia fuerte de lectura tras escritura desde 2020: leer justo después de subir devuelve el objeto nuevo.</li>
     <li>No sirve como base de datos: no hay consultas, y listar millones de claves es lento. Los metadatos (dueño, tamaño, nombre original, estado) van en tu base de datos.</li></ul>
     <div class="dg"><div class="dg-tit">subida directa con URL prefirmada</div>
<div class="dg-vert">
<div class="dg-caja base">cliente: «quiero subir foto.jpg (3 MB)»</div>
<div class="dg-caja acento doble">API: valida, crea el registro (pendiente) y firma una URL<small>PUT válido 10 minutos, solo para esa clave y ese tipo</small></div>
<div class="dg-caja doble">el cliente sube los bytes directamente a S3</div>
<div class="dg-caja ok doble">S3 emite un evento → worker<small>comprueba, genera miniaturas y marca «lista»</small></div>
</div></div>`},
 {t:"info", eti:"Grandes y baratos", h:"Subidas por partes y ciclo de vida",
  c:`<ul><li><b>Subida por partes</b> (multipart): el fichero se divide en partes (en S3, de 5 MiB a 5 GiB, hasta 10.000 partes) que se suben en paralelo y se reintentan por separado. Si se corta la conexión en el minuto 20 de un vídeo, solo se repite una parte.</li>
     <li><b>Clases de almacenamiento</b>: estándar para lo que se lee a menudo; de acceso infrecuente y de archivo (Glacier) para lo que casi nunca se lee, mucho más barato pero con cargo por lectura y, en archivo, horas de espera.</li>
     <li><b>Reglas de ciclo de vida</b>: «pasa a acceso infrecuente a los 30 días, a archivo a los 180 y borra a los 7 años». También limpiar subidas por partes abandonadas.</li>
     <li>Delante, una <b>CDN</b> para servir las imágenes, con el bucket privado y solo accesible desde la CDN.</li></ul>`},
 {t:"par", p:"Empareja cada necesidad con la herramienta",
  pares:[["Que el móvil suba un vídeo sin pasar por tu API","URL prefirmada"],["Subir un fichero de 20 GB con una red inestable","Subida por partes (multipart)"],["Abaratar copias que casi nunca se leen","Clase de archivo con regla de ciclo de vida"],["Saber quién subió cada fichero y buscarlos por fecha","Metadatos en tu base de datos"],["Servir imágenes rápido en todo el mundo","CDN delante de un bucket privado"]],
  why:"El patrón completo (URL prefirmada + evento + worker + metadatos + CDN) aparece en casi cualquier diseño con ficheros."},
 {t:"opcion", p:"Tu API recibe las fotos en el cuerpo del POST y las reenvía a S3. Con muchas subidas simultáneas, las réplicas se quedan sin memoria y sin hilos. ¿Qué cambias?",
  ops:["Más memoria a las réplicas","URLs prefirmadas: el cliente sube directo a S3 y la API solo firma y registra","Comprimir las fotos en la API","Guardar las fotos en la base de datos"],
  ok:1, why:"La API deja de transportar gigas: solo gestiona metadatos, que es lo que escala bien."},
 {t:"vf", p:"Guardar las imágenes como BLOB en la base de datos relacional principal es la mejor opción a gran escala.",
  ok:false, why:"Infla la base de datos, sus copias y su réplica; y la base de datos es el recurso más caro y difícil de escalar. Los bytes, al almacén de objetos."},
 {t:"opcion", p:"¿Cómo evitas que alguien use una URL prefirmada para subir un fichero de 5 GB cuando esperabas una foto?",
  ops:["No se puede","Firmar con condiciones (tamaño máximo, tipo de contenido) mediante un POST con política, caducidad corta, y validar el objeto al recibir el evento","Confiar en el cliente","Ponerlo en el README"],
  ok:1, why:"Nunca confíes en lo que el cliente dice que sube: el worker comprueba tamaño y tipo real antes de marcar el fichero como válido."},
 {t:"codigo", p:"Calcula las partes de una subida multipart",
  lenguaje:"py",
  c:`<p>Lee el tamaño del fichero en MiB y el tamaño de parte deseado en MiB. S3 admite como mucho 10.000 partes. Si hacen falta más, sube el tamaño de parte al mínimo que lo permita (<code>ceil(tamaño / 10000)</code>). Imprime <code>parte: P MiB</code> y <code>partes: N</code>.</p>`,
  plantilla:`import math
tam = int(input())
parte = int(input())
# ajusta la parte si hace falta y calcula
`,
  pruebas:[{entrada:"1000\n64\n", salida:"parte: 64 MiB\npartes: 16"},{entrada:"200000\n8\n", salida:"parte: 20 MiB\npartes: 10000"},{entrada:"50\n100\n", salida:"parte: 100 MiB\npartes: 1", oculta:true},{entrada:"100001\n10\n", salida:"parte: 11 MiB\npartes: 9091", oculta:true}],
  pista:"partes = ceil(tam / parte); si pasa de 10000, parte = ceil(tam / 10000) y recalcula.",
  solucion:`import math
tam = int(input())
parte = int(input())
if math.ceil(tam / parte) > 10000:
    parte = math.ceil(tam / 10000)
print(f"parte: {parte} MiB")
print(f"partes: {math.ceil(tam / parte)}")
`,
  why:"Los SDK (por ejemplo el TransferManager de AWS) hacen esta cuenta por ti, pero conviene saberla: con partes de 8 MiB el límite práctico ronda los 78 GiB."}
]},

/* =============== U9 L2 =============== */
{
id:"ds9n2",
titulo:"Búsqueda",
claves:["Índice invertido: de cada término, la lista de documentos que lo contienen","Analizadores (minúsculas, raíces, sinónimos) y relevancia con BM25","El motor de búsqueda es una copia derivada: se alimenta de la base de datos (CDC o eventos) y se puede reconstruir"],
pasos:[
 {t:"info", eti:"Por dentro", h:"El índice invertido",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tres documentos indexados</div>
<table class="dg-tabla"><thead><tr><th>término</th><th>documentos</th></tr></thead><tbody>
<tr><td>zapatilla</td><td>1, 3</td></tr>
<tr><td>running</td><td>1, 2</td></tr>
<tr><td>roja</td><td>2, 3</td></tr>
</tbody></table></div>
     <p>Buscar «zapatilla roja» es cruzar dos listas ordenadas: {1, 3} ∩ {2, 3} = {3}. Por eso es rapidísimo aunque haya millones de documentos. <code>LIKE '%roja%'</code> en SQL, en cambio, recorre toda la tabla.</p>
     <ul><li>El <b>analizador</b> convierte el texto en términos: minúsculas, quitar tildes, raíces («zapatillas» → «zapatill»), sinónimos, palabras vacías.</li>
     <li>La <b>relevancia</b> se calcula con <b>BM25</b>: pesa más un término raro en la colección y que aparece en un documento corto.</li>
     <li>Motores: Elasticsearch, OpenSearch, Solr (todos sobre Lucene); también PostgreSQL con <code>tsvector</code> para casos modestos.</li></ul>`},
 {t:"info", eti:"En el sistema", h:"Cómo encaja la búsqueda",
  c:`<div class="dg"><div class="dg-tit">la búsqueda es una vista derivada</div>
<div class="dg-flujo"><div class="dg-caja ok">PostgreSQL<small>fuente de la verdad</small></div><div class="dg-caja">CDC (Debezium) o eventos</div><div class="dg-caja">indexador</div><div class="dg-caja acento">OpenSearch<small>shards + réplicas</small></div></div></div>
     <ul><li>Nunca es la fuente de la verdad: si se corrompe, se reconstruye desde la base de datos (reindexar en un índice nuevo y cambiar un <b>alias</b>).</li>
     <li>Es <b>casi en tiempo real</b>: un documento nuevo aparece tras el siguiente <i>refresh</i> (por defecto, en torno a 1 s).</li>
     <li>Un índice se reparte en <b>shards</b> (cada búsqueda consulta todos y junta resultados) con <b>réplicas</b> para leer más y tolerar fallos.</li>
     <li>Para paginar a fondo, <code>search_after</code> (cursor) en vez de <code>from</code> enorme.</li></ul>`},
 {t:"par", p:"Empareja cada concepto con su descripción",
  pares:[["Índice invertido","De cada término, los documentos que lo contienen"],["Analizador","Convierte el texto en términos normalizados"],["BM25","Fórmula de relevancia que premia términos raros"],["Refresh","Momento en que lo indexado se vuelve buscable"],["Alias","Nombre estable que apunta al índice activo"]],
  why:"Con alias se reindexa sin cortar: se construye productos_v2 y se mueve el alias de golpe."},
 {t:"opcion", p:"Tu buscador de productos usa <code>WHERE nombre ILIKE '%zapatilla%'</code> sobre 20 millones de filas y tarda 4 s. ¿Qué haces?",
  ops:["Añadir un índice B-tree normal sobre nombre","Llevar el catálogo a un motor de búsqueda (o índices de texto completo / trigramas) alimentado desde la base de datos","Cachear todas las búsquedas posibles","Más CPU"],
  ok:1, why:"Un comodín al principio impide usar un índice B-tree. Para texto hace falta un índice invertido (o pg_trgm como paso intermedio)."},
 {t:"vf", p:"Es buena idea que el motor de búsqueda sea la única copia de los productos.",
  ok:false, why:"Los motores de búsqueda no ofrecen las garantías transaccionales de una base de datos y a veces hay que reindexar desde cero: necesitan una fuente de la que reconstruirse."},
 {t:"opcion", p:"Un producto recién creado no aparece en la búsqueda hasta pasado un segundo. ¿Es un fallo?",
  ops:["Sí, hay que reiniciar el clúster","No: es el intervalo de refresh; la búsqueda es casi en tiempo real por diseño","Sí, falta un índice","Es la CDN"],
  ok:1, why:"Si el usuario debe ver lo que acaba de crear, la pantalla de detalle se lee de la base de datos, no del buscador."},
 {t:"codigo", p:"Construye un índice invertido y busca con AND",
  lenguaje:"py",
  c:`<p>Primera línea: número de documentos D. Siguientes D líneas: el texto de cada documento (ids 1, 2, 3…). Última línea: la consulta. Pasa todo a minúsculas y separa por espacios. Imprime los ids que contienen <b>todos</b> los términos de la consulta, en orden, separados por espacios, o <code>sin resultados</code>.</p>`,
  plantilla:`d = int(input())
docs = [input() for _ in range(d)]
consulta = input()
indice = {}
# construye el índice: término -> conjunto de ids
`,
  pruebas:[{entrada:"3\nZapatilla running azul\nCamiseta running roja\nzapatilla roja de paseo\nzapatilla roja\n", salida:"3"},{entrada:"3\nZapatilla running azul\nCamiseta running roja\nzapatilla roja de paseo\nrunning\n", salida:"1 2"},{entrada:"2\nhola mundo\nadios mundo\ngato\n", salida:"sin resultados", oculta:true},{entrada:"4\na b c\nb c d\nc d e\nB C\nb c\n", salida:"1 2 4", oculta:true}],
  pista:"Para cada documento i, para cada palabra en texto.lower().split(), añade i a indice.setdefault(palabra, set()). Después intersecta los conjuntos de los términos de la consulta.",
  solucion:`d = int(input())
docs = [input() for _ in range(d)]
consulta = input()
indice = {}
for i, texto in enumerate(docs, 1):
    for palabra in texto.lower().split():
        indice.setdefault(palabra, set()).add(i)
res = None
for t in consulta.lower().split():
    ids = indice.get(t, set())
    res = ids if res is None else res & ids
if res:
    print(" ".join(map(str, sorted(res))))
else:
    print("sin resultados")
`,
  why:"Los motores reales guardan las listas ordenadas y comprimidas y las cruzan saltando (skip lists), además de puntuar cada resultado."}
]},

/* =============== U9 L3 =============== */
{
id:"ds9n3",
titulo:"Tiempo real: polling, SSE y WebSocket",
claves:["Polling (corto o largo), Server-Sent Events (servidor → cliente sobre HTTP) y WebSocket (bidireccional)","Cada conexión abierta consume memoria: se usan gateways de conexiones y un bus pub/sub detrás","Latidos, reconexión con reanudación y equilibrio al desplegar"],
pasos:[
 {t:"info", eti:"Empujar datos", h:"Cuatro técnicas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">cómo recibe novedades el cliente</div>
<table class="dg-tabla"><thead><tr><th>técnica</th><th>cómo</th><th>cuándo</th></tr></thead><tbody>
<tr><td>polling corto</td><td>pregunta cada N segundos</td><td>simple; datos que cambian poco</td></tr>
<tr><td>polling largo</td><td>el servidor retiene la petición hasta que hay algo (o timeout)</td><td>cuando no se puede otra cosa</td></tr>
<tr><td>SSE</td><td>una respuesta HTTP que no termina y envía eventos</td><td>servidor → cliente: notificaciones, marcadores, progreso</td></tr>
<tr><td>WebSocket</td><td>canal TCP bidireccional tras un «upgrade» HTTP</td><td>chat, juegos, edición colaborativa</td></tr>
</tbody></table></div>
     <p>SSE es texto sobre HTTP normal: pasa por proxies, funciona sobre HTTP/2 y el navegador reconecta solo enviando <code>Last-Event-ID</code> para reanudar donde se quedó. WebSocket da dos sentidos y datos binarios, pero la reconexión y la reanudación son cosa tuya.</p>`},
 {t:"info", eti:"A escala", h:"Millones de conexiones",
  c:`<div class="dg"><div class="dg-tit">arquitectura de tiempo real</div>
<div class="dg-vert">
<div class="dg-caja base">millones de clientes conectados</div>
<div class="dg-caja acento doble">gateways de conexiones<small>solo mantienen sockets; decenas o cientos de miles por nodo</small></div>
<div class="dg-caja doble">registro de conexiones<small>usuario → gateway (Redis con TTL)</small></div>
<div class="dg-caja ok doble">bus pub/sub<small>Redis Pub/Sub, NATS, Kafka</small></div>
<div class="dg-caja">servicios de negocio publican «notificar a usuario 42»</div>
</div></div>
     <ul><li><b>Latidos</b> (ping/pong) cada 20–30 s: detectan conexiones muertas y evitan que los proxies las corten por inactividad.</li>
     <li>Al <b>desplegar</b> un gateway se cortan todas sus conexiones: los clientes deben reconectar con espera aleatoria para no llegar todos a la vez.</li>
     <li>Los balanceadores deben soportar conexiones largas (y el upgrade a WebSocket).</li></ul>`},
 {t:"par", p:"Empareja cada caso con la técnica más razonable",
  pares:[["Marcador de un partido en directo","SSE"],["Chat con escritura en los dos sentidos","WebSocket bidireccional"],["Estado de un informe que tarda 5 minutos","Polling cada pocos segundos o SSE"],["Editor colaborativo con cursores de otros","WebSocket con estado compartido (CRDT u OT)"]],
  why:"No todo necesita WebSocket: si solo habla el servidor, SSE es más sencillo y aprovecha la infraestructura HTTP."},
 {t:"opcion", p:"Despliegas una versión nueva de los gateways de WebSocket y 2 millones de clientes reconectan en el mismo segundo, tumbando la autenticación. ¿Qué faltó?",
  ops:["Más CPU en los gateways","Reconexión con espera exponencial y jitter en el cliente, y drenado gradual de los gateways al desplegar","Quitar la autenticación","Usar polling"],
  ok:1, why:"Es una estampida de reconexiones. El drenado corta las conexiones poco a poco y el jitter reparte los reintentos."},
 {t:"vf", p:"Con SSE, si se corta la conexión, el navegador reconecta solo y puede indicar el último evento recibido.",
  ok:true, why:"EventSource reconecta automáticamente y envía la cabecera Last-Event-ID; el servidor reenvía lo que falte si lo tiene guardado."},
 {t:"opcion", p:"¿Cómo sabe el servicio de pedidos a qué gateway enviar la notificación para el usuario 42?",
  ops:["Pregunta a todos los gateways uno a uno","Publica en el bus; o consulta el registro usuario → gateway y envía al canal de ese gateway","Guarda la conexión en su propia memoria","Lo decide el DNS"],
  ok:1, why:"Los servicios de negocio no mantienen sockets: separarlo permite escalar conexiones y lógica por separado."},
 {t:"codigo", p:"Reanuda un flujo de eventos tras una reconexión",
  lenguaje:"py",
  c:`<p>Primera línea: los ids de los eventos que el servidor tiene guardados, en orden. Segunda línea: el <code>Last-Event-ID</code> que envía el cliente al reconectar (o <code>-</code> si es su primera conexión). Imprime los ids que hay que reenviar separados por espacios. Si el id del cliente no está en el buffer (es demasiado viejo), imprime <code>resincronizar</code>: el cliente debe recargar el estado completo. Si no falta ninguno, <code>al dia</code>.</p>`,
  plantilla:`ids = input().split()
ultimo = input().strip()
# decide qué reenviar
`,
  pruebas:[{entrada:"101 102 103 104 105\n103\n", salida:"104 105"},{entrada:"101 102 103\n103\n", salida:"al dia"},{entrada:"201 202 203\n150\n", salida:"resincronizar"},{entrada:"7 8 9\n-\n", salida:"7 8 9", oculta:true}],
  pista:"Si ultimo es «-», reenvía todo. Si no está en ids, resincronizar. Si está, lo que viene después de ids.index(ultimo).",
  solucion:`ids = input().split()
ultimo = input().strip()
if ultimo == "-":
    pendientes = ids
elif ultimo not in ids:
    pendientes = None
else:
    pendientes = ids[ids.index(ultimo) + 1:]
if pendientes is None:
    print("resincronizar")
elif pendientes:
    print(" ".join(pendientes))
else:
    print("al dia")
`,
  why:"Todo sistema en tiempo real necesita este plan B: el buffer es finito y un cliente que vuelve tras horas no puede recibir todo por el canal en vivo."}
]}

]});
