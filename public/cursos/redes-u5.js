window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Transporte: puertos, TCP y UDP",
resumen: "Puertos y sockets, el saludo de TCP, ventanas y control de congestión, cierre y TIME_WAIT, UDP, QUIC y HTTP/3",
nivel: "Intermedio",
color: "#4fb8dc",
lecciones: [

{
id:"rd4l1",
titulo:"Puertos y sockets",
claves:["La IP identifica la máquina; el puerto, el programa dentro de ella","Puertos 0-1023 son conocidos (22 SSH, 80 HTTP, 443 HTTPS)","Una conexión se identifica por IP y puerto de origen y de destino (más el protocolo)"],
pasos:[
 {t:"info", eti:"Varios programas, una IP", h:"¿Qué es un puerto?",
  c:`<p>En un servidor corren a la vez un servidor web, SSH y PostgreSQL. Todos comparten la misma IP. ¿Cómo sabe el sistema a cuál entregar cada paquete? Por el <b>puerto</b>: un número de 0 a 65535 que identifica el programa.</p>
     <div class="dg"><div class="dg-tit">un servidor, varios puertos</div><div class="dg-pila"><div class="dg-caja acento">servidor 10.0.1.20</div>
     <div class="dg-fila"><div class="dg-caja"><b style="font-family:var(--mono)">:22</b><small>sshd</small></div><div class="dg-caja"><b style="font-family:var(--mono)">:443</b><small>nginx</small></div></div>
     <div class="dg-fila"><div class="dg-caja"><b style="font-family:var(--mono)">:5432</b><small>postgres</small></div><div class="dg-caja"><b style="font-family:var(--mono)">:8080</b><small>tu API de Spring Boot</small></div></div></div></div>
     <p>Si la IP es la dirección de un edificio, el puerto es el número de puerta.</p>`},
 {t:"par", p:"Empareja cada puerto con su servicio habitual",
  pares:[["22","SSH"],["53","DNS"],["80","HTTP"],["443","HTTPS"],["5432","PostgreSQL"]],
  why:"También conviene recordar 3306 (MySQL), 6379 (Redis), 27017 (MongoDB) y 8080 (aplicaciones)."},
 {t:"info", eti:"Los extremos", h:"Sockets y puertos efímeros",
  c:`<p>El servidor <b>escucha</b> en un puerto fijo (443). El cliente usa un <b>puerto efímero</b> aleatorio (por ejemplo 51234) que el sistema le asigna. Una conexión queda identificada por cinco datos:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">la quíntupla que identifica una conexión</div><table class="dg-tabla"><thead><tr><th>campo</th><th>ejemplo</th></tr></thead><tbody><tr><td>protocolo</td><td>TCP</td></tr><tr><td>IP origen</td><td>192.168.1.10</td></tr><tr><td>puerto origen</td><td>51234</td></tr><tr><td>IP destino</td><td>93.184.216.34</td></tr><tr><td>puerto destino</td><td>443</td></tr></tbody></table></div>
     <p>Por eso un servidor puede atender miles de conexiones en el mismo puerto 443: cada una tiene un origen distinto. Un <b>socket</b> es el extremo de esa conexión en un programa.</p>`},
 {t:"term", p:"Muestra los puertos TCP en escucha de tu servidor Linux, con el proceso que los usa y sin resolver nombres",
  prompt:"pablo@servidor:~$", sol:["sudo ss -tlnp","ss -tlnp","sudo ss -ltnp","ss -ltnp","sudo ss -lntp","ss -lntp","sudo ss -tulnp","ss -tulnp","sudo netstat -tlnp","netstat -tlnp"],
  pista:"ss con t (TCP), l (escucha), n (números) y p (procesos).",
  salida:`State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
LISTEN 0      128    0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=812))
LISTEN 0      511    0.0.0.0:443         0.0.0.0:*     users:(("nginx",pid=1044))
LISTEN 0      100    127.0.0.1:5432      0.0.0.0:*     users:(("postgres",pid=990))`, why:"Fíjate: postgres escucha en 127.0.0.1, así que solo es accesible desde la propia máquina. Eso es seguro."},
 {t:"opcion", p:"Arrancas tu API en el puerto 8080 y falla con «Address already in use». ¿Qué significa?",
  ops:["La red está caída","Otro proceso ya escucha en ese puerto; búscalo con ss -tlnp","Falta permiso de root","El puerto no existe"],
  ok:1, why:"Solo un proceso puede escuchar en una IP y puerto concretos. Los puertos por debajo de 1024, además, requieren privilegios."},
 {t:"vf", p:"Un servidor web puede atender a miles de clientes a la vez en el mismo puerto 443.",
  ok:true, why:"Cada conexión se distingue por la IP y el puerto de origen del cliente."},
 {t:"opcion", p:"Un proxy abre decenas de miles de conexiones por segundo hacia <b>un mismo</b> backend (misma IP y puerto de destino) y empieza a fallar con «Cannot assign requested address». ¿Qué se ha agotado?",
  ops:["La memoria del backend","Los puertos efímeros de origen: con destino fijo, cada conexión necesita un puerto de origen distinto","Las direcciones MAC","El TTL"],
  ok:1, why:"Linux usa por defecto los puertos 32768–60999 (<code>net.ipv4.ip_local_port_range</code>): unos 28.000 por cada IP de destino. Soluciones: reutilizar conexiones (keep-alive, pools), ampliar el rango o usar más IPs de origen o de destino."}
]},

{
id:"rd4l2",
titulo:"TCP: conexión fiable",
claves:["TCP establece una conexión con el saludo de tres pasos: SYN, SYN-ACK, ACK","Garantiza entrega, orden y sin duplicados con números de secuencia y ACKs","Retransmite lo perdido y regula la velocidad (control de flujo y de congestión)"],
pasos:[
 {t:"info", eti:"Antes de hablar", h:"El saludo de tres pasos",
  c:`<div class="dg"><div class="dg-tit">saludo de tres pasos de TCP</div><svg viewBox="0 0 320 288" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Saludo de tres pasos: SYN, SYN-ACK y ACK entre cliente y servidor"><defs><marker id="fl-redes4-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker><marker id="fl-redes4-1-ok" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ok)"/></marker></defs><line x1="60" y1="46" x2="60" y2="284" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="25.54" y="8" width="68.92" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="60" y="31.666666666666668" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--sans)" fill="var(--ink)">cliente</text><line x1="260" y1="46" x2="260" y2="284" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="221.76" y="8" width="76.48" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="260" y="31.666666666666668" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--sans)" fill="var(--ink)">servidor</text><text x="160" y="76" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">SYN</tspan></text><text x="160" y="93" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">quiero hablar, empiezo en x</text><line x1="60" y1="105" x2="257" y2="105" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes4-1)"/><text x="160" y="135" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">SYN-ACK</tspan></text><text x="160" y="152" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">vale, yo empiezo en y</text><line x1="260" y1="164" x2="63" y2="164" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes4-1)"/><text x="160" y="194" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">ACK</tspan></text><text x="160" y="211" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">recibido</text><line x1="60" y1="223" x2="257" y2="223" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes4-1)"/><rect x="30" y="241" width="260" height="29" rx="6" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="1.5"/><text x="160" y="260" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ok)">conexión establecida</text></svg></div>
     <p>Solo después se envían datos. Por eso cada conexión nueva cuesta al menos <b>una ida y vuelta</b> antes del primer byte útil; con TLS, alguna más. De ahí la importancia de <b>reutilizar conexiones</b> (pools de conexiones a la base de datos, keep-alive en HTTP).</p>`},
 {t:"orden", p:"Ordena el establecimiento de una conexión TCP",
  items:["El cliente envía SYN","El servidor responde SYN-ACK","El cliente envía ACK","Empiezan a intercambiarse datos"],
  why:"Pregunta clásica de entrevista: «explícame el three-way handshake»."},
 {t:"info", eti:"Garantías", h:"Cómo consigue TCP la fiabilidad",
  c:`<ul><li><b>Números de secuencia</b>: cada byte está numerado; el receptor reordena y descarta duplicados.</li>
     <li><b>ACKs</b>: el receptor confirma lo recibido. Si el emisor no recibe confirmación a tiempo, <b>retransmite</b>.</li>
     <li><b>Control de flujo</b>: el receptor anuncia cuánto puede aceptar (ventana), para no desbordarlo.</li>
     <li><b>Control de congestión</b>: el emisor empieza despacio y acelera mientras no haya pérdidas; si las hay, frena.</li></ul>
     <p>Para el programa, TCP es simplemente un <b>flujo de bytes</b> fiable. No hay «mensajes»: si necesitas separarlos, lo hace el protocolo de arriba (HTTP, por ejemplo).</p>`},
 {t:"par", p:"Empareja cada mecanismo de TCP con lo que resuelve",
  pares:[["Número de secuencia","Ordenar y detectar duplicados"],["ACK","Confirmar lo recibido"],["Retransmisión","Recuperar paquetes perdidos"],["Ventana (control de flujo)","No desbordar al receptor"],["Control de congestión","No saturar la red"]],
  why:"Todo esto ocurre en el kernel; tu aplicación solo lee y escribe bytes."},
 {t:"opcion", p:"Tu API abre una conexión nueva a la base de datos en cada petición. ¿Qué mejora típica aplicarías?",
  ops:["Usar UDP","Un pool de conexiones (HikariCP en Spring Boot) para reutilizarlas","Aumentar la MTU","Cambiar de puerto"],
  ok:1, why:"Cada conexión nueva paga el saludo TCP, a veces TLS y la autenticación. Reutilizarlas ahorra mucho tiempo."},
 {t:"vf", p:"TCP garantiza que los datos llegan en el mismo orden en que se enviaron.",
  ok:true, why:"Es una de sus garantías principales, gracias a los números de secuencia."},
 {t:"opcion", p:"Un atacante envía millones de SYN con IPs de origen falsas y nunca completa el saludo. ¿Qué defensa del kernel permite seguir aceptando conexiones legítimas?",
  ops:["Bajar la MTU","SYN cookies: el servidor no guarda estado hasta recibir el ACK final","Desactivar TCP","Cerrar el puerto 443"],
  ok:1, why:"Un SYN flood llena la cola de conexiones a medio abrir. Con <code>net.ipv4.tcp_syncookies=1</code> (activo por defecto en Linux), el estado viaja codificado en el número de secuencia."},
 {t:"escribe", p:"En <code>tcpdump</code>, los flags de TCP se muestran abreviados: <code>[S]</code>, <code>[S.]</code>, <code>[.]</code>, <code>[P.]</code>, <code>[F.]</code>, <code>[R]</code>. ¿Qué paquete del saludo es <code>[S.]</code>?",
  sol:["SYN-ACK","SYN ACK","synack","el SYN-ACK","SYN+ACK"], pista:"El punto significa ACK.",
  why:"S = SYN, . = ACK, P = PUSH (datos), F = FIN, R = RST. Leer estos flags de un vistazo es la base para interpretar capturas."}
]},

{
id:"rd5n1",
titulo:"TCP a fondo: ventanas y control de congestión",
claves:["El rendimiento de una conexión está limitado por ventana ÷ RTT","La ventana de congestión arranca pequeña (slow start) y se ajusta con las pérdidas: CUBIC por defecto en Linux, BBR como alternativa","Nagle y los ACK retardados pueden añadir decenas de milisegundos a mensajes pequeños: TCP_NODELAY"],
pasos:[
 {t:"info", eti:"Ventanas", h:"Cuántos datos pueden ir «en vuelo»",
  c:`<p>TCP no espera un ACK por cada segmento: envía varios seguidos. Cuántos bytes sin confirmar puede haber en vuelo lo decide la menor de dos ventanas:</p>
     <ul><li><b>Ventana de recepción</b> (<i>rwnd</i>): la anuncia el receptor, según el hueco que le queda en el búfer. Es el <b>control de flujo</b>. Con la opción <i>window scaling</i> puede pasar de los 64 KB originales a varios MB.</li>
     <li><b>Ventana de congestión</b> (<i>cwnd</i>): la calcula el emisor, según lo que cree que aguanta la red. Es el <b>control de congestión</b>.</li></ul>
     <p>De ahí sale la fórmula más útil de rendimiento de red: <b>caudal máximo ≈ ventana ÷ RTT</b>. Y su inversa, el <b>BDP</b> (<i>bandwidth-delay product</i>): para llenar un enlace de 1 Gbit/s con 100 ms de RTT hacen falta 1 Gbit/s × 0,1 s = 100 Mbit ≈ <b>12,5 MB</b> en vuelo.</p>
     <div class="nota ojo"><b class="tit">Error típico</b>«Tenemos 1 Gbit/s entre Madrid y Virginia y la copia va a 40 Mbit/s». No falta ancho de banda: la ventana (búferes de socket) es demasiado pequeña para ese RTT.</div>`},
 {t:"info", eti:"Congestión", h:"Slow start, pérdidas y algoritmos",
  c:`<ol><li><b>Slow start</b>: la cwnd empieza en 10 segmentos (unos 14 KB) y se <b>duplica</b> cada RTT mientras todo se confirma. Por eso las conexiones nuevas son lentas al principio y conviene reutilizarlas.</li>
     <li><b>Evitación de congestión</b>: pasado un umbral, crece más despacio.</li>
     <li><b>Pérdida</b>: si llegan <b>3 ACK duplicados</b>, el emisor deduce que falta un segmento y lo retransmite ya (<i>fast retransmit</i>) y reduce la cwnd. Si vence el temporizador (RTO), es peor: la cwnd vuelve casi a cero.</li></ol>
     <p>Algoritmos: <b>CUBIC</b> es el predeterminado en Linux y Windows; <b>BBR</b> (Google) estima ancho de banda y RTT en vez de reaccionar a las pérdidas, y rinde mejor en enlaces largos con algo de pérdida.</p>
     <p>Otro clásico: el <b>algoritmo de Nagle</b> junta escrituras pequeñas mientras haya datos sin confirmar, y el receptor retrasa los ACK hasta ~40 ms. Juntos pueden añadir 40 ms a cada petición pequeña. Las aplicaciones interactivas (SSH, bases de datos, gRPC) activan <code>TCP_NODELAY</code> para desactivar Nagle.</p>`},
 {t:"escribe", p:"Una conexión tiene una ventana máxima de 64 KB (65.536 bytes) y un RTT de 100 ms. ¿Cuántos bytes por segundo puede transferir como máximo?",
  sol:["655360","655.360","655 360","655360 bytes","640 KB/s","640 KB"], pista:"Ventana ÷ RTT: 65.536 ÷ 0,1.",
  why:"Unos 5,2 Mbit/s, da igual que el enlace sea de 10 Gbit/s. Por eso existe el <i>window scaling</i> y por eso los búferes de socket importan en enlaces largos."},
 {t:"codigo", p:"Calcula el BDP: lee el ancho de banda en Mbit/s y el RTT en ms (en una línea, separados por un espacio) y escribe cuántos bytes deben ir en vuelo para llenar el enlace, redondeado a entero",
  lenguaje:"py",
  c:`<p>BDP (bytes) = ancho de banda (bit/s) × RTT (s) ÷ 8. Ejemplo: <code>1000 100</code> → <code>12500000</code>.</p>`,
  plantilla:"mbps, rtt_ms = map(float, input().split())\n# calcula el BDP en bytes\n",
  pruebas:[{entrada:"1000 100\n", salida:"12500000"},{entrada:"100 20\n", salida:"250000"},{entrada:"10000 80\n", salida:"100000000", oculta:true},{entrada:"50 35\n", salida:"218750", oculta:true}],
  pista:"mbps * 1_000_000 * (rtt_ms / 1000) / 8, y round().",
  solucion:"mbps, rtt_ms = map(float, input().split())\nprint(round(mbps * 1_000_000 * rtt_ms / 1000 / 8))",
  why:"Si el BDP supera el búfer máximo de socket (<code>net.ipv4.tcp_rmem</code> / <code>tcp_wmem</code>), una sola conexión no llenará nunca el enlace."},
 {t:"opcion", p:"El emisor recibe tres ACK duplicados seguidos que confirman el mismo byte. ¿Qué hace TCP?",
  ops:["Cierra la conexión","Retransmite el segmento que falta sin esperar al temporizador y reduce la ventana de congestión","Duplica la ventana","Nada: espera más ACKs"],
  ok:1, why:"Es el <i>fast retransmit</i>: los ACK duplicados indican que llegan segmentos posteriores pero falta uno. Reaccionar sin esperar al RTO evita el hundimiento del caudal."},
 {t:"term", p:"Consulta qué algoritmo de control de congestión usa el kernel de Linux",
  prompt:"root@srv:~#", sol:["sysctl net.ipv4.tcp_congestion_control","cat /proc/sys/net/ipv4/tcp_congestion_control","sysctl -n net.ipv4.tcp_congestion_control"],
  salida:`net.ipv4.tcp_congestion_control = cubic`,
  pista:"Es un parámetro sysctl de net.ipv4 que acaba en _congestion_control.",
  why:"Para probar BBR: <code>sysctl -w net.ipv4.tcp_congestion_control=bbr</code> (suele ir con <code>net.core.default_qdisc=fq</code>). Afecta a lo que <b>envía</b> esta máquina."},
 {t:"term", p:"Muestra las conexiones TCP establecidas con la información interna de TCP (RTT, cwnd, retransmisiones), sin resolver nombres",
  prompt:"root@srv:~#", sol:["ss -tni","ss -nti","ss -tin","ss -itn","ss -int","ss -nit","ss -tni state established","ss -ti","ss -it"],
  salida:`State Recv-Q Send-Q Local Address:Port   Peer Address:Port
ESTAB 0      0      10.0.1.20:443        81.44.12.9:52814
	 cubic wscale:7,7 rto:232 rtt:31.2/4.1 mss:1448 cwnd:10 bytes_sent:18234 bytes_retrans:2896 retrans:0/2 rcv_space:14480`,
  pista:"ss con -t, -n y la opción -i (info).",
  why:"<code>rtt</code> en ms, <code>cwnd</code> en segmentos y <code>retrans</code> te dicen si una conexión lenta sufre pérdidas o simplemente mucha latencia."},
 {t:"opcion", p:"Un cliente envía peticiones de 50 bytes por una conexión TCP ya abierta y cada una tarda ~40 ms más de lo esperado, aunque el servidor está al lado. ¿Qué ajuste suele resolverlo?",
  ops:["Subir la MTU","Activar TCP_NODELAY en el socket (desactivar Nagle)","Cambiar a IPv6","Aumentar el TTL"],
  ok:1, why:"Nagle retiene el segundo trozo pequeño hasta recibir el ACK del primero, y el receptor retrasa ese ACK. La mayoría de clientes de bases de datos y HTTP ya activan TCP_NODELAY."}
]},

{
id:"rd4l3",
titulo:"Cierre y estados de TCP",
claves:["El cierre normal usa FIN y ACK en ambos sentidos; RST corta de golpe","«Connection refused» = llegó y nadie escucha (RST); «timeout» = no llegó respuesta","TIME_WAIT y CLOSE_WAIT: qué indican cuando se acumulan"],
pasos:[
 {t:"info", eti:"Cerrar", h:"FIN y RST",
  c:`<ul><li><b>FIN</b>: «he terminado de enviar». Cada lado cierra su sentido; el cierre ordenado usa cuatro mensajes (FIN, ACK, FIN, ACK).</li>
     <li><b>RST</b> (reset): «esta conexión no existe o la corto ya». Se envía si llega un SYN a un puerto donde nadie escucha, o si un programa aborta.</li></ul>`},
 {t:"info", eti:"Mensajes de error", h:"Refused frente a timeout",
  c:`<p>La diferencia entre estos dos errores es una de las pistas más útiles al depurar:</p>
     <ul><li><b>Connection refused</b>: el paquete <b>llegó</b> a la máquina, pero nada escucha en ese puerto (respondió con RST). El problema está en el servicio: caído, puerto equivocado, escuchando en 127.0.0.1.</li>
     <li><b>Connection timed out</b>: <b>no llegó respuesta</b>. Algo descarta los paquetes por el camino: un cortafuegos, un grupo de seguridad, una ruta que no existe, una IP equivocada.</li></ul>`},
 {t:"opcion", p:"Desde tu API, conectar a <code>10.0.21.5:5432</code> devuelve «Connection timed out». ¿Dónde miras primero?",
  ops:["En la configuración de PostgreSQL","En cortafuegos, grupos de seguridad y rutas entre ambas subredes","En el código de la API","En el DNS"],
  ok:1, why:"Timeout indica que los paquetes se pierden por el camino. Si fuera «refused», PostgreSQL no estaría escuchando."},
 {t:"par", p:"Empareja cada estado o síntoma con su significado",
  pares:[["LISTEN","El servidor espera conexiones"],["ESTABLISHED","Conexión activa"],["TIME_WAIT","Conexión cerrada que espera un tiempo por si llegan paquetes rezagados"],["CLOSE_WAIT acumulado","La aplicación no está cerrando sus conexiones (fuga)"],["Connection refused","Llegó, pero nadie escucha en ese puerto"]],
  why:"Muchos CLOSE_WAIT suelen ser un bug de la aplicación: recibe el cierre del otro lado y nunca cierra el suyo."},
 {t:"vf", p:"«Connection refused» significa normalmente que un cortafuegos está descartando los paquetes en silencio.",
  ok:false, why:"Un descarte silencioso produce timeout. Refused es una respuesta activa: la máquina existe y no hay nadie en ese puerto (o un cortafuegos configurado para rechazar)."},
 {t:"info", eti:"TIME_WAIT", h:"Por qué existe TIME_WAIT y cuándo molesta",
  c:`<p>Quien cierra <b>primero</b> (envía el primer FIN) pasa por <b>TIME_WAIT</b> y se queda ahí 2×MSL; en Linux, <b>60 segundos</b> fijos. Sirve para dos cosas: poder reenviar el último ACK si se perdió, y que paquetes rezagados de esa conexión no se cuelen en una nueva con la misma quíntupla.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">estados del cierre, según quién cierra</div><table class="dg-tabla"><thead><tr><th>lado</th><th>recorrido</th></tr></thead><tbody><tr><td>cierra primero (activo)</td><td>ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → <b>TIME_WAIT</b> → CLOSED</td></tr><tr><td>recibe el cierre (pasivo)</td><td>ESTABLISHED → <b>CLOSE_WAIT</b> → LAST_ACK → CLOSED</td></tr></tbody></table></div>
     <ul><li>Miles de <b>TIME_WAIT</b> en un servidor suelen ser inofensivos (cuestan poca memoria). Molestan en el <b>cliente</b> que abre y cierra muchas conexiones al mismo destino: bloquean puertos efímeros.</li>
     <li>Remedios: reutilizar conexiones (keep-alive, pools) y, en el lado que conecta, <code>net.ipv4.tcp_tw_reuse=1</code>. La vieja <code>tcp_tw_recycle</code> rompía clientes detrás de NAT y se <b>eliminó</b> en Linux 4.12: si un tutorial te la recomienda, está desfasado.</li>
     <li>Muchos <b>CLOSE_WAIT</b> nunca se arreglan con sysctl: es la aplicación, que no llama a <code>close()</code>.</li></ul>`},
 {t:"term", p:"Muestra un resumen con el número de sockets por estado (incluidos los TIME_WAIT) de la máquina",
  prompt:"root@srv:~#", sol:["ss -s"],
  salida:`Total: 1893
TCP:   14211 (estab 1204, closed 12688, orphaned 3, timewait 12650)

Transport Total     IP        IPv6
RAW	  0         0         0
UDP	  12        8         4
TCP	  1523      1311      212`,
  pista:"ss con la opción de resumen (summary).",
  why:"12.650 TIME_WAIT frente a 1.204 establecidas: este servidor abre y cierra muchas conexiones salientes. Mira si llama a otro servicio sin keep-alive."},
 {t:"opcion", p:"Tras una llamada HTTP entre dos servicios, ¿en qué máquina queda el socket en TIME_WAIT?",
  ops:["Siempre en el servidor","En la que envió el primer FIN (la que cerró primero)","En las dos","En el balanceador, siempre"],
  ok:1, why:"Depende de quién cierre. Por eso los servidores HTTP intentan que cierre el cliente, y por eso los clientes que no reutilizan conexiones acumulan TIME_WAIT."},
 {t:"vf", p:"Para quitarte los TIME_WAIT de encima, lo recomendable hoy es activar <code>net.ipv4.tcp_tw_recycle</code>.",
  ok:false, why:"Esa opción rompía conexiones de clientes detrás de NAT y desapareció del kernel en la versión 4.12. Lo correcto es reutilizar conexiones y, si hace falta, <code>tcp_tw_reuse</code> en el lado cliente."}
]},

{
id:"rd4l4",
titulo:"UDP y cuándo usarlo",
claves:["UDP envía datagramas sin conexión, sin garantías de entrega ni orden","Es más rápido y ligero: DNS, streaming, juegos, VoIP","QUIC (base de HTTP/3) construye fiabilidad y cifrado sobre UDP"],
pasos:[
 {t:"info", eti:"Sin ceremonias", h:"UDP",
  c:`<p><b>UDP</b> envía cada mensaje (<b>datagrama</b>) por separado, sin saludo previo, sin confirmaciones y sin reordenar. Si se pierde, se pierde.</p>
     <p>¿Para qué querrías eso? Para cosas donde <b>llegar tarde es peor que no llegar</b> o donde el mensaje es tan pequeño que reintentarlo es trivial:</p>
     <ul><li><b>DNS</b>: una pregunta y una respuesta pequeñas; si no llega, se repite.</li>
     <li><b>Voz y vídeo en directo</b>, juegos: un fotograma retrasado ya no sirve.</li>
     <li><b>Métricas</b> (StatsD) y logs (syslog) donde perder alguno es aceptable.</li>
     <li><b>QUIC</b> / HTTP/3: implementa su propia fiabilidad sobre UDP para evitar limitaciones de TCP.</li></ul>`},
 {t:"par", p:"Empareja cada uso con el protocolo más adecuado",
  pares:[["Descargar un fichero sin perder nada","TCP"],["Consulta DNS sencilla","UDP"],["Conexión a PostgreSQL","TCP, con su saludo previo"],["Videollamada en directo","UDP, aceptando pérdidas"]],
  why:"Si cada byte importa, TCP; si importa más la puntualidad, UDP."},
 {t:"opcion", p:"¿Qué protocolo de transporte usa normalmente una consulta DNS sencilla?",
  ops:["TCP siempre","UDP (puerto 53), pasando a TCP si la respuesta es grande","ICMP","HTTP"],
  ok:1, why:"Las respuestas grandes y las transferencias de zona usan TCP."},
 {t:"opcion", p:"Una videollamada pierde un 1% de paquetes. ¿Por qué no se usa TCP para reenviarlos?",
  ops:["Porque TCP no funciona en móviles","Porque esperar la retransmisión congelaría la imagen; es mejor saltar ese trozo","Porque UDP cifra","Porque TCP no admite audio"],
  ok:1, why:"En tiempo real, la puntualidad importa más que la completitud."},
 {t:"vf", p:"UDP garantiza que los datagramas llegan en orden.",
  ok:false, why:"No da ninguna garantía de orden ni de entrega; si la aplicación las necesita, debe implementarlas."},
 {t:"escribe", p:"La cabecera TCP ocupa al menos 20 bytes. ¿Cuántos bytes ocupa la cabecera UDP? (solo el número)",
  sol:["8","8 bytes"], pista:"Solo lleva puerto de origen, puerto de destino, longitud y suma de comprobación, de 2 bytes cada uno.",
  why:"Cuatro campos de 16 bits. Esa sencillez es lo que hace a UDP tan ligero y lo que permite construir protocolos como QUIC encima."},
 {t:"term", p:"Muestra los puertos UDP en escucha, con el proceso y sin resolver nombres",
  prompt:"root@srv:~#", sol:["ss -ulnp","ss -lunp","ss -unlp","ss -ulpn","sudo ss -ulnp","sudo ss -lunp","ss -nulp","netstat -ulnp"],
  salida:`State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process
UNCONN 0      0      127.0.0.53%lo:53      0.0.0.0:*     users:(("systemd-resolve",pid=610))
UNCONN 0      0      0.0.0.0:51820         0.0.0.0:*
UNCONN 0      0      0.0.0.0:123           0.0.0.0:*     users:(("chronyd",pid=702))`,
  pista:"Igual que para TCP, pero con -u.",
  why:"En UDP no hay LISTEN: el estado es UNCONN. Aquí se ven el resolvedor local (53), WireGuard (51820, en el kernel, sin proceso) y NTP (123)."},
 {t:"opcion", p:"¿Por qué UDP se usa en ataques de amplificación (DNS, NTP, memcached) y TCP no?",
  ops:["Porque UDP es más rápido","Porque sin saludo previo se puede falsear la IP de origen: la respuesta, mucho mayor que la pregunta, va a la víctima","Porque UDP no tiene puertos","Porque TCP cifra"],
  ok:1, why:"En TCP la IP falsa nunca completaría el saludo. Por eso los servidores DNS abiertos al mundo y los <i>resolvers</i> recursivos públicos mal configurados son un problema."}
]},

{
id:"rd5n2",
titulo:"QUIC y HTTP/3",
claves:["QUIC es un transporte sobre UDP con TLS 1.3 integrado: conexión nueva en 1 RTT","Sus flujos son independientes: una pérdida no bloquea a los demás (sin bloqueo en cabeza de línea de TCP)","Los identificadores de conexión permiten cambiar de red sin reconectar; si UDP está bloqueado, el cliente vuelve a TCP"],
pasos:[
 {t:"info", eti:"El problema", h:"Lo que TCP no puede arreglar",
  c:`<p>HTTP/2 multiplexa muchas peticiones en <b>una</b> conexión TCP. Pero TCP entrega un único flujo de bytes en orden: si se pierde un paquete de la petición A, las respuestas B y C, que ya han llegado, esperan en el búfer del kernel. Es el <b>bloqueo en cabeza de línea</b> (<i>head-of-line blocking</i>). Además, TCP vive en el kernel y en los <i>middleboxes</i>: cambiarlo cuesta décadas.</p>
     <p>La solución fue construir un transporte nuevo sobre UDP, en el espacio de usuario: <b>QUIC</b> (RFC 9000). HTTP/3 (RFC 9114) es HTTP sobre QUIC.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">pilas de HTTP/2 y HTTP/3</div><table class="dg-tabla"><thead><tr><th>capa</th><th>HTTP/2</th><th>HTTP/3</th></tr></thead><tbody><tr><td>aplicación</td><td>HTTP/2</td><td>HTTP/3</td></tr><tr><td>seguridad</td><td>TLS 1.2 o 1.3</td><td rowspan="2">QUIC (con TLS 1.3 dentro)</td></tr><tr><td>transporte</td><td>TCP</td></tr><tr><td>red</td><td>IP</td><td>UDP sobre IP</td></tr></tbody></table></div>`},
 {t:"info", eti:"Qué aporta", h:"QUIC por dentro",
  c:`<ul><li><b>Menos idas y vueltas</b>: TCP + TLS 1.3 necesita 2 RTT antes de enviar la petición (saludo TCP y saludo TLS). QUIC hace ambos a la vez: <b>1 RTT</b>. Con reanudación, <b>0-RTT</b>: la petición viaja en el primer paquete (solo para peticiones idempotentes, porque un atacante podría repetirlas).</li>
     <li><b>Flujos independientes</b>: cada petición es un <i>stream</i>; una pérdida solo retiene a ese flujo.</li>
     <li><b>Migración de conexión</b>: la conexión se identifica por un <i>connection ID</i>, no por la quíntupla. Pasas del Wi-Fi al 5G y la descarga sigue.</li>
     <li><b>Todo cifrado</b>, incluidas casi todas las cabeceras de transporte: los <i>middleboxes</i> no pueden «optimizarlo» ni romperlo.</li></ul>
     <p><b>Cómo se descubre</b>: el servidor responde por HTTP/1.1 o HTTP/2 con la cabecera <code>Alt-Svc: h3=":443"</code>, o lo anuncia un registro DNS <code>HTTPS</code>. Si UDP/443 está bloqueado, el navegador sigue por TCP sin que el usuario lo note.</p>
     <div class="nota"><b class="tit">Para operaciones</b>En los balanceadores y cortafuegos hay que abrir <b>UDP</b> 443, además de TCP 443. Y el tráfico QUIC gasta algo más de CPU que TCP porque no tiene tanta ayuda del hardware.</div>`},
 {t:"escribe", p:"¿Cuántas idas y vueltas (RTT) necesita una conexión nueva con TCP y TLS 1.3 antes de que el cliente pueda enviar la petición HTTP?",
  sol:["2","dos","2 RTT"], pista:"Una del saludo TCP y otra del saludo TLS.",
  why:"Con QUIC es 1, porque el saludo de transporte y el criptográfico van juntos. Con 100 ms de RTT, es la diferencia entre 200 y 100 ms antes del primer byte."},
 {t:"opcion", p:"En HTTP/2 sobre una red móvil con pérdidas, se pierde un paquete de una imagen. ¿Qué les pasa a las otras respuestas de la misma conexión?",
  ops:["Nada, siguen llegando a la aplicación","Esperan: TCP no entrega nada posterior hasta retransmitir el hueco","Se descartan","Se reenvían por UDP"],
  ok:1, why:"Es el bloqueo en cabeza de línea de TCP. HTTP/2 lo resolvió a nivel HTTP, pero no a nivel de transporte; QUIC sí."},
 {t:"par", p:"Empareja cada característica de QUIC con su ventaja",
  pares:[["Connection ID","Seguir la conexión al cambiar de red"],["Flujos independientes","Una pérdida no frena a las demás peticiones"],["TLS 1.3 integrado","Transporte y cifrado en una sola ida y vuelta"],["0-RTT","Enviar la petición en el primer paquete al reconectar"],["Alt-Svc","Anunciar que el servidor habla HTTP/3"]],
  why:"Son las cinco ideas que se preguntan cuando sale HTTP/3 en una entrevista."},
 {t:"vf", p:"Los datos enviados en 0-RTT se pueden reproducir (<i>replay</i>), así que solo deben usarse para peticiones idempotentes como un GET.",
  ok:true, why:"Un atacante que capture ese primer paquete puede reenviarlo. Por eso servidores y CDN solo aceptan 0-RTT para métodos seguros."},
 {t:"term", p:"Haz una petición HEAD por HTTP/3 a <code>https://cloudflare.com</code> con un curl compilado con soporte de HTTP/3",
  prompt:"pablo@portatil:~$", sol:["curl --http3 -I https://cloudflare.com","curl -I --http3 https://cloudflare.com","curl --http3-only -I https://cloudflare.com","curl -I --http3-only https://cloudflare.com","curl --http3 --head https://cloudflare.com","curl --head --http3 https://cloudflare.com"],
  salida:`HTTP/3 301
date: Wed, 23 Sep 2026 09:12:44 GMT
location: https://www.cloudflare.com/
alt-svc: h3=":443"; ma=86400
server: cloudflare`,
  pista:"La opción de curl se llama igual que el protocolo, y -I pide solo cabeceras.",
  why:"<code>--http3</code> intenta HTTP/3 y cae a TCP si no puede; <code>--http3-only</code> no cae, útil para comprobar si UDP/443 está abierto."},
 {t:"opcion", p:"Tras activar HTTP/3 en el balanceador, las métricas muestran que casi nadie lo usa. Los navegadores sí lo soportan. ¿Qué compruebas primero?",
  ops:["Que el certificado sea RSA","Que el tráfico UDP 443 esté permitido en grupos de seguridad y cortafuegos hasta el balanceador","Que HTTP/2 esté desactivado","El TTL del DNS"],
  ok:1, why:"Si UDP/443 no llega, el navegador prueba QUIC, falla y se queda en HTTP/2 sin error visible. Comprueba también que se envía la cabecera <code>Alt-Svc</code>."}
]}

]});
