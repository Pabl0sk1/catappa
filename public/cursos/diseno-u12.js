window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Casos clásicos I",
resumen: "Acortador de URLs, limitador de peticiones distribuido, sistema de notificaciones y almacenamiento y sincronización de ficheros, diseñados paso a paso",
nivel: "Experto",
color: "#c48642",
lecciones: [

/* =============== U12 L1 =============== */
{
id:"ds7l1",
titulo:"Acortador de URLs",
claves:["Generar identificadores cortos únicos: contador (por rangos o tipo Snowflake) + base62, o hash con control de colisiones","Muchas más lecturas que escrituras: caché y CDN para las redirecciones","301 frente a 302 según se quieran contar las visitas; analítica fuera del camino crítico"],
pasos:[
 {t:"info", eti:"Caso 1", h:"Requisitos, cuentas y API",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">acotar el problema</div>
<table class="dg-tabla"><tbody>
<tr><td>funcionales</td><td>acortar una URL (opcional: alias propio, caducidad); redirigir; ver visitas</td></tr>
<tr><td>no funcionales</td><td>redirección &lt; 50 ms p99, 99,99%, códigos no adivinables en secuencia</td></tr>
<tr><td>escala</td><td>100M enlaces/mes (≈ 40 escrituras/s), 100:1 lecturas (≈ 4.000/s, picos de 12.000)</td></tr>
<tr><td>datos</td><td>6.000M enlaces en 5 años × 500 B ≈ 3 TB</td></tr>
</tbody></table></div>
     <div class="termbox">POST /api/enlaces        {"url": "https://…", "alias": null, "caduca": null}
  -&gt; 201 {"codigo": "aZ3k9Q", "corta": "https://ac.to/aZ3k9Q"}
GET  /aZ3k9Q             -&gt; 302 Location: https://…
GET  /api/enlaces/aZ3k9Q/estadisticas</div>`},
 {t:"info", eti:"Diseño", h:"Crear y redirigir",
  c:`<div class="dg"><div class="dg-tit">acortador: crear y redirigir</div>
<div class="dg-flujo"><div class="dg-caja acento"><code>POST /api/enlaces {url}</code></div><div class="dg-caja">genera el código "aZ3k9Q"</div><div class="dg-caja ok">guarda (código, url, dueño, fecha)</div></div>
<div class="dg-flujo" style="margin-top:10px"><div class="dg-caja acento"><code>GET /aZ3k9Q</code></div><div class="dg-caja">caché → BD</div><div class="dg-caja ok"><code>302 Location: url</code></div><div class="dg-caja base">evento de visita → cola</div></div>
</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">decisiones del acortador</div>
<table class="dg-tabla"><tbody>
<tr><td>código</td><td>7 caracteres base62 (a-z, A-Z, 0-9) = 62^7 ≈ 3,5 billones de combinaciones</td></tr>
<tr><td>generación</td><td>contador distribuido (cada servidor reserva rangos de 1.000 ids) o ids tipo Snowflake (tiempo + máquina + secuencia), convertidos a base62; para que no sean consecutivos, se barajan con una permutación reversible</td></tr>
<tr><td>alternativa</td><td>hash de la url recortado + comprobar colisión con un índice único y reintentar</td></tr>
<tr><td>lecturas</td><td>caché Redis código → url (y CDN); BD clave-valor o relacional con índice único</td></tr>
<tr><td>analítica</td><td>eventos de visita a una cola → almacén analítico</td></tr>
<tr><td>abuso</td><td>comprobar URLs contra listas de malware y limitar la creación por usuario</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja cada decisión con su justificación",
  pares:[["Base62 de 7 caracteres","Miles de millones de códigos cortos y legibles en URL"],["Caché de código a URL","Las redirecciones son la inmensa mayoría del tráfico"],["302 en vez de 301","Que cada visita pase por el servicio y se pueda contar"],["Eventos de visita a una cola","No ralentizar la redirección con la analítica"],["Índice único sobre el código","Garantizar que no hay duplicados"]],
  why:"El 301 lo cachean los navegadores: más rápido, pero no ves las visitas repetidas."},
 {t:"opcion", p:"¿Por qué no usar un hash MD5 de la URL recortado a 7 caracteres sin más?",
  ops:["Es perfecto","Puede haber colisiones entre URLs distintas: hay que detectarlas y resolverlas (o usar un contador)","MD5 es lento","No se puede convertir a texto"],
  ok:1, why:"Con miles de millones de enlaces, las colisiones son seguras."},
 {t:"opcion", p:"Usas un contador global en una sola base de datos para los ids. ¿Qué problema tiene a escala y cómo lo evitas?",
  ops:["Ninguno","Es un punto único de fallo y de contención: cada servidor reserva un rango (p. ej. 1.000 ids) de golpe y los reparte en memoria","Hay que usar UUID de 36 caracteres","Hay que bloquear la tabla"],
  ok:1, why:"Con rangos, el contador central se consulta una vez cada mil enlaces. Si un servidor muere, pierde los ids no usados de su rango: no importa, sobran."},
 {t:"vf", p:"Si los códigos son un contador en base62 sin más, cualquiera puede recorrer todos los enlaces probando códigos consecutivos.",
  ok:true, why:"Por eso se baraja el contador con una permutación (por ejemplo, un cifrado de bloque pequeño) o se añaden bits aleatorios: sigue siendo único y deja de ser predecible."},
 {t:"codigo", p:"Convierte un id numérico a base62",
  lenguaje:"py",
  c:`<p>Usa el alfabeto <code>0-9a-zA-Z</code> (el 0 es «0», el 10 es «a», el 36 es «A», el 61 es «Z»). Lee un entero no negativo e imprime su representación en base62.</p>`,
  plantilla:`ALFABETO = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
n = int(input())
# convierte a base62
`,
  pruebas:[{entrada:"61\n", salida:"Z"},{entrada:"62\n", salida:"10"},{entrada:"125\n", salida:"21"},{entrada:"0\n", salida:"0", oculta:true},{entrada:"3521614606207\n", salida:"ZZZZZZZ", oculta:true}],
  pista:"Mientras n &gt; 0: añade ALFABETO[n % 62] y haz n //= 62; al final, invierte. Cuidado con el caso n = 0.",
  solucion:`ALFABETO = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
n = int(input())
if n == 0:
    print("0")
else:
    cifras = []
    while n > 0:
        cifras.append(ALFABETO[n % 62])
        n //= 62
    print("".join(reversed(cifras)))
`,
  why:"62^7 − 1 = 3.521.614.606.207 es el mayor id que cabe en 7 caracteres: a 40 enlaces por segundo, hay para más de 2.000 años."}
]},

/* =============== U12 L2 =============== */
{
id:"ds7l2",
titulo:"Limitador de peticiones distribuido",
claves:["Requisitos: límites por cliente y regla, en todas las réplicas, añadiendo menos de 1 ms, y decidir qué pasa si el almacén cae","Contadores atómicos en Redis (INCR + EXPIRE o un script Lua); ventana deslizante aproximada con dos contadores","Reglas configurables, cabeceras informativas y límites por región"],
pasos:[
 {t:"info", eti:"Caso 2", h:"Diseño",
  c:`<div class="dg"><div class="dg-tit">limitador de peticiones</div>
<div class="dg-caja acento">requisito: 100 peticiones por minuto por usuario, en 20 réplicas</div>
<div class="dg-cols" style="margin-top:12px">
<div class="dg-col"><div class="dg-col-tit">Ventana fija en Redis</div><div class="dg-vert">
<div class="dg-caja">clave = <code>"rl:{usuario}:{minuto actual}"</code></div>
<div class="dg-caja"><code>n = INCR clave</code>; si <code>n == 1</code>: <code>EXPIRE clave 60</code></div>
<div class="dg-caja aviso">si <code>n &gt; 100</code> → <code>429 Too Many Requests</code> + <code>Retry-After</code></div>
</div></div>
<div class="dg-col"><div class="dg-col-tit">Alternativas</div>
<div class="dg-caja doble">token bucket<small>permite ráfagas (hasta la capacidad) y limita el ritmo medio</small></div>
<div class="dg-caja doble">ventana deslizante<small>evita el pico doble en el cambio de minuto</small></div></div>
</div></div>`},
 {t:"info", eti:"En detalle", h:"Ventana deslizante, reglas y fallos",
  c:`<div class="termbox">ventana deslizante aproximada (dos contadores por clave)
estimado = previa × (1 − transcurrido / 60) + actual

previa = 80, actual = 30, transcurridos 15 s del minuto:
estimado = 80 × 0,75 + 30 = 90   -&gt; por debajo de 100: se permite</div>
     <ul><li><b>Atomicidad</b>: leer, decidir e incrementar en un solo paso (script Lua en Redis). Si no, dos réplicas leen 99 a la vez y pasan las dos.</li>
     <li><b>Reglas</b> en un servicio de configuración («plan gratuito: 60/min; /login: 5/min por IP»), cacheadas en cada réplica.</li>
     <li><b>Si Redis cae</b>: <i>fail open</i> (dejar pasar, con un límite local aproximado) para no convertir el limitador en un punto único de fallo; <i>fail closed</i> solo donde el abuso es peor que la caída (inicio de sesión).</li>
     <li><b>Multirregión</b>: contador por región con el límite repartido, o sincronización asíncrona aceptando algo de exceso.</li>
     <li>Latencia: una ida y vuelta a Redis (&lt; 1 ms en la misma zona); con canalización o límites locales por lotes se reduce aún más.</li></ul>`},
 {t:"par", p:"Empareja cada algoritmo con su característica",
  pares:[["Ventana fija con INCR","Una clave por minuto; hasta el doble en el borde"],["Registro de marcas de tiempo (sorted set)","Exacto, pero guarda cada petición"],["Contador deslizante aproximado","Dos contadores y una ponderación"],["Token bucket","Dos valores por cliente; ráfagas controladas"]],
  why:"El contador deslizante aproximado es el compromiso habitual en producción: preciso y barato."},
 {t:"opcion", p:"¿Qué debería devolver la API cuando se supera el límite?",
  ops:["500","429 Too Many Requests con Retry-After","200 sin datos","404"],
  ok:1, why:"Y cabeceras como RateLimit-Remaining para que el cliente se adapte."},
 {t:"opcion", p:"Dos réplicas hacen <code>GET contador</code>, ven 99, deciden que se permite y hacen <code>SET 100</code>. ¿Qué ha pasado?",
  ops:["Nada, es correcto","Una condición de carrera: han pasado 101 peticiones; hay que usar INCR (atómico) o un script Lua","Redis ha fallado","Falta un índice"],
  ok:1, why:"Leer-modificar-escribir en dos pasos no es atómico. INCR devuelve el valor ya incrementado y la decisión se toma sobre él."},
 {t:"vf", p:"Si el Redis del limitador cae, lo más seguro para el negocio es siempre rechazar todas las peticiones.",
  ok:false, why:"Eso convierte el limitador en el punto único de fallo de toda la API. Lo habitual es dejar pasar (fail open) con un límite local de emergencia y alertar."},
 {t:"codigo", p:"Aplica la ventana deslizante aproximada",
  lenguaje:"py",
  c:`<p>Primera línea: <code>limite ventana</code> (segundos). Después, una línea por consulta: <code>previa actual transcurrido</code>. Calcula <code>estimado = previa × (1 − transcurrido / ventana) + actual</code> e imprime el estimado con un decimal y <code>permitida</code> si es menor que el límite o <code>429</code> si no.</p>`,
  plantilla:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
limite, ventana = int(lineas[0][0]), int(lineas[0][1])
for previa, actual, transcurrido in lineas[1:]:
    previa, actual, transcurrido = int(previa), int(actual), int(transcurrido)
    # calcula y decide
`,
  pruebas:[{entrada:"100 60\n80 30 15\n80 50 15\n", salida:"90.0 permitida\n110.0 429"},{entrada:"10 60\n12 0 30\n0 9 59\n0 10 1\n", salida:"6.0 permitida\n9.0 permitida\n10.0 429"},{entrada:"50 10\n40 20 5\n40 5 9\n", salida:"40.0 permitida\n9.0 permitida", oculta:true}],
  pista:"estimado = previa * (1 - transcurrido / ventana) + actual; formatea con f\"{estimado:.1f}\".",
  solucion:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
limite, ventana = int(lineas[0][0]), int(lineas[0][1])
for previa, actual, transcurrido in lineas[1:]:
    previa, actual, transcurrido = int(previa), int(actual), int(transcurrido)
    estimado = previa * (1 - transcurrido / ventana) + actual
    print(f"{estimado:.1f} " + ("permitida" if estimado < limite else "429"))
`,
  why:"Supone que las peticiones de la ventana anterior se repartieron de forma uniforme. En las mediciones públicas de Cloudflare, el error de esta aproximación fue muy pequeño."}
]},

/* =============== U12 L3 =============== */
{
id:"ds12n1",
titulo:"Sistema de notificaciones",
claves:["Varios canales (push, correo, SMS, dentro de la app) detrás de una API única con preferencias y plantillas","Colas por canal y prioridad: un código de acceso no espera detrás de una campaña de marketing","Deduplicar, respetar preferencias y horas de silencio, reintentar con proveedores externos y medir entregas"],
pasos:[
 {t:"info", eti:"Caso 3", h:"Requisitos y arquitectura",
  c:`<ul><li><b>Funcionales</b>: enviar por push (APNs en iOS, FCM en Android), correo, SMS y dentro de la app; plantillas e idiomas; preferencias por usuario y tipo; programar envíos.</li>
     <li><b>No funcionales</b>: 50M notificaciones al día con picos de campañas (millones en minutos); las transaccionales (códigos, avisos de pago) en segundos; no duplicar; no perder.</li></ul>
     <div class="dg"><div class="dg-tit">tubería de notificaciones</div>
<div class="dg-vert">
<div class="dg-caja base">servicios de negocio: «notifica a 42: pedido enviado»</div>
<div class="dg-caja acento doble">API de notificaciones<small>valida, clave de deduplicación, preferencias, plantilla</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja doble">cola push<small>alta / baja</small></div><div class="dg-caja doble">cola correo<small>alta / baja</small></div><div class="dg-caja doble">cola SMS<small>alta</small></div></div></div>
<div class="dg-caja doble">workers por canal<small>límites de cada proveedor, reintentos, DLQ</small></div>
<div class="dg-caja ok doble">APNs, FCM, proveedor de correo y de SMS<small>los acuses y rebotes vuelven por webhooks → estado de entrega</small></div>
</div></div>`},
 {t:"info", eti:"Detalles", h:"Lo que distingue un buen diseño",
  c:`<ul><li><b>Prioridades</b>: colas separadas (o topics) para transaccional y marketing; los workers de alta prioridad nunca esperan.</li>
     <li><b>Fan-out de campañas</b>: «avisa a 10M de usuarios» no se procesa en una petición: un trabajo trocea la audiencia en lotes y los encola poco a poco (respetando los límites de los proveedores).</li>
     <li><b>Deduplicación</b>: clave por evento y usuario (<code>pedido-81-enviado:42</code>) guardada con TTL: los reintentos de quien llama no duplican.</li>
     <li><b>Preferencias y horas de silencio</b>: consultadas (con caché) antes de encolar; lo no urgente de noche se retrasa o se agrupa en un resumen.</li>
     <li><b>Tokens de dispositivo</b>: un usuario tiene varios; los que el proveedor marca como inválidos se borran.</li>
     <li><b>Medir</b>: enviadas, entregadas, abiertas, rebotadas; y alertar si cae la tasa de entrega de un proveedor (y cambiar a otro).</li></ul>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["El código de acceso tarda 20 minutos durante una campaña","Colas separadas por prioridad"],["El servicio de pedidos reintenta y el usuario recibe dos avisos","Clave de deduplicación con TTL"],["Notificaciones de marketing a las 3 de la mañana","Horas de silencio en las preferencias"],["El proveedor de SMS limita a 100 envíos por segundo","Workers con limitador por proveedor"],["El proveedor de correo principal falla","Conmutar a un proveedor secundario"]],
  why:"En este caso, los requisitos no funcionales (prioridad, duplicados, límites externos) son todo el diseño."},
 {t:"opcion", p:"Marketing lanza una campaña a 20M de usuarios. ¿Cómo se procesa?",
  ops:["Una petición HTTP con 20M de destinatarios","Un trabajo que trocea la audiencia en lotes y los encola en la cola de baja prioridad, al ritmo que permiten los proveedores","20M de llamadas síncronas al proveedor","Enviar a todos con un solo correo en copia"],
  ok:1, why:"Lotes + cola de baja prioridad: la campaña tarda lo que tenga que tardar sin molestar a lo transaccional."},
 {t:"vf", p:"Que el proveedor de push acepte la petición garantiza que la notificación llegó al móvil.",
  ok:false, why:"APNs y FCM aceptan y entregan cuando pueden (el móvil puede estar apagado, o la app desinstalada). La entrega se mide con acuses y eventos del cliente."},
 {t:"opcion", p:"¿Dónde guardas el historial de notificaciones de cada usuario (bandeja dentro de la app), con miles de millones de filas?",
  ops:["En la misma tabla relacional sin particionar","En un almacén particionado por usuario y ordenado por fecha (Cassandra, DynamoDB), con retención","En Redis sin caducidad","En los logs"],
  ok:1, why:"El acceso es siempre «las últimas N del usuario X»: clave de partición usuario, clave de ordenación fecha."},
 {t:"codigo", p:"Filtra notificaciones por preferencias y duplicados",
  lenguaje:"py",
  c:`<p>Líneas <code>pref usuario canal1 canal2…</code> indican los canales que acepta cada usuario (sin línea pref, no acepta ninguno). Líneas <code>notif clave usuario canal</code> son notificaciones a enviar. Para cada notif imprime <code>clave enviada</code>, <code>clave omitida</code> (canal no aceptado) o <code>clave duplicada</code> (esa clave ya se procesó antes, se enviara o no).</p>`,
  plantilla:`import sys
prefs = {}
vistas = set()
for l in sys.stdin.read().split("\\n"):
    p = l.split()
    if not p:
        continue
    # procesa pref y notif
`,
  pruebas:[{entrada:"pref ana push correo\npref luis correo\nnotif k1 ana push\nnotif k2 luis push\nnotif k1 ana push\nnotif k3 luis correo\n", salida:"k1 enviada\nk2 omitida\nk1 duplicada\nk3 enviada"},{entrada:"notif a eva sms\nnotif a eva sms\n", salida:"a omitida\na duplicada"},{entrada:"pref u sms\nnotif x u sms\npref u correo\nnotif y u sms\nnotif z u correo\n", salida:"x enviada\ny omitida\nz enviada", oculta:true}],
  pista:"Comprueba primero el duplicado (y añade la clave a vistas), después la preferencia. Una línea pref nueva sustituye a la anterior.",
  solucion:`import sys
prefs = {}
vistas = set()
for l in sys.stdin.read().split("\\n"):
    p = l.split()
    if not p:
        continue
    if p[0] == "pref":
        prefs[p[1]] = set(p[2:])
    elif p[0] == "notif":
        clave, usuario, canal = p[1], p[2], p[3]
        if clave in vistas:
            print(f"{clave} duplicada")
            continue
        vistas.add(clave)
        if canal in prefs.get(usuario, set()):
            print(f"{clave} enviada")
        else:
            print(f"{clave} omitida")
`,
  why:"El orden importa: deduplicar primero evita que un reintento se procese de otra forma si las preferencias cambiaron entre medias."}
]},

/* =============== U12 L4 =============== */
{
id:"ds12n2",
titulo:"Almacenamiento y sincronización de ficheros",
claves:["Dividir los ficheros en bloques con hash de contenido: solo se suben los bloques que cambian y se deduplica","Servicio de metadatos (árbol, versiones, bloques) separado del almacén de bloques","Notificar cambios a los otros dispositivos y resolver conflictos con copias en conflicto"],
pasos:[
 {t:"info", eti:"Caso 4", h:"Un Dropbox o Google Drive",
  c:`<ul><li><b>Funcionales</b>: subir, descargar, sincronizar entre dispositivos, compartir, historial de versiones, funcionar sin conexión.</li>
     <li><b>No funcionales</b>: 500M de usuarios, ficheros de hasta decenas de GB, durabilidad máxima, sincronizar en segundos, ahorrar ancho de banda.</li></ul>
     <div class="dg"><div class="dg-tit">arquitectura</div>
<div class="dg-vert">
<div class="dg-caja base doble">cliente de escritorio o móvil<small>vigila la carpeta, trocea en bloques de ~4 MB, calcula SHA-256 de cada uno</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja acento doble">servicio de metadatos<small>ficheros, carpetas, versiones, lista de bloques; SQL particionado por cuenta</small></div><div class="dg-caja ok doble">almacén de bloques<small>S3: clave = hash del bloque</small></div></div></div>
<div class="dg-caja doble">servicio de notificaciones<small>long polling o WebSocket: «tu cuenta cambió, versión 812»</small></div>
<div class="dg-caja base">los otros dispositivos piden los cambios desde su última versión</div>
</div></div>`},
 {t:"info", eti:"En detalle", h:"Bloques, deduplicación y conflictos",
  c:`<div class="dg"><div class="dg-tit">editar un fichero de 100 MB</div>
<div class="dg-flujo"><div class="dg-caja">25 bloques de 4 MB</div><div class="dg-caja">cambia uno</div><div class="dg-caja acento">el cliente pregunta qué hashes faltan</div><div class="dg-caja ok">sube 4 MB, no 100</div><div class="dg-caja">nueva versión = nueva lista de hashes</div></div></div>
     <ul><li><b>Direccionamiento por contenido</b>: el bloque se guarda por su hash. Si mil usuarios suben el mismo PDF, se guarda una vez (deduplicación; con cuidado por privacidad entre cuentas).</li>
     <li>Una <b>versión</b> es solo una lista de hashes: el historial cuesta poco. Los bloques sin referencias se recogen más tarde.</li>
     <li><b>Conflictos</b>: si dos dispositivos editan sin conexión la misma versión, el segundo en subir recibe «versión base no coincide» (control optimista) y se guarda una «copia en conflicto» en vez de pisar al otro.</li>
     <li>Troceado por contenido (<i>content-defined chunking</i>) en lugar de tamaño fijo: insertar un byte al principio no cambia todos los bloques.</li></ul>`},
 {t:"par", p:"Empareja cada decisión con su ventaja",
  pares:[["Bloques con hash SHA-256","Subir solo lo que cambia y deduplicar"],["Metadatos en SQL particionado por cuenta","Transacciones sobre el árbol de carpetas de un usuario"],["Bloques en almacenamiento de objetos","Durabilidad y capacidad casi ilimitadas"],["Notificación por long polling","Los dispositivos se enteran de cambios en segundos sin sondear sin parar"],["Copia en conflicto","No perder ninguna de las dos ediciones"]],
  why:"Separar metadatos (pequeños, transaccionales) de contenido (enorme, inmutable) es el corazón de este diseño."},
 {t:"opcion", p:"¿Por qué los bloques se guardan con su hash como clave y nunca se modifican?",
  ops:["Por estética","Inmutables y direccionados por contenido: se cachean y replican sin problemas de consistencia, se deduplican, y una versión es solo una lista de hashes","Porque S3 no permite sobrescribir","Para cifrarlos"],
  ok:1, why:"La inmutabilidad elimina carreras: dos bloques con el mismo hash son el mismo bloque."},
 {t:"opcion", p:"Ana y Luis editan el mismo documento sin conexión y se conectan después. ¿Qué hace el sistema?",
  ops:["Se queda con el último que sube","El primero se guarda como versión nueva; al segundo se le rechaza por versión base desfasada y su edición se guarda como «copia en conflicto»","Fusiona los binarios automáticamente","Borra los dos"],
  ok:1, why:"Para ficheros binarios no hay fusión automática fiable; los editores colaborativos (tipo Google Docs) resuelven esto con OT o CRDT, pero es otro diseño."},
 {t:"vf", p:"Con bloques de tamaño fijo, insertar un párrafo al principio de un fichero de texto grande obliga a volver a subir casi todos los bloques.",
  ok:true, why:"Todo se desplaza y cambian todos los hashes. El troceado por contenido corta donde el contenido lo marca (hash rodante) y solo cambian los bloques cercanos a la edición."},
 {t:"codigo", p:"Decide qué bloques hay que subir",
  lenguaje:"py",
  c:`<p>Primera línea: hashes de los bloques que ya están en el almacén (puede estar vacía). Segunda línea: hashes de los bloques del fichero nuevo, en orden (pueden repetirse). Imprime <code>subir: …</code> con los hashes que faltan, sin repetir y en orden de primera aparición, y <code>reutilizados: N</code> con cuántos bloques del fichero no hay que subir.</p>`,
  plantilla:`import sys
lineas = sys.stdin.read().split("\\n")
almacen = set(lineas[0].split())
fichero = lineas[1].split()
# decide qué subir
`,
  pruebas:[{entrada:"a1 b2 c3\na1 x9 c3 x9 d4\n", salida:"subir: x9 d4\nreutilizados: 3"},{entrada:"\nk k k\n", salida:"subir: k\nreutilizados: 2"},{entrada:"a b c\na b c\n", salida:"subir:\nreutilizados: 3", oculta:true}],
  pista:"Recorre el fichero: si el hash está en el almacén o ya lo vas a subir, cuenta un reutilizado; si no, añádelo a la lista de subida y al conjunto.",
  solucion:`import sys
lineas = sys.stdin.read().split("\\n")
almacen = set(lineas[0].split())
fichero = lineas[1].split()
subir = []
reutilizados = 0
for h in fichero:
    if h in almacen:
        reutilizados += 1
    else:
        subir.append(h)
        almacen.add(h)
print(("subir: " + " ".join(subir)).strip())
print(f"reutilizados: {reutilizados}")
`,
  why:"Es la conversación real entre cliente y servidor: «tengo estos hashes, ¿cuáles te faltan?». Ahorra la mayor parte del ancho de banda en ediciones pequeñas."}
]}

]});
