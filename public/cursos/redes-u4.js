window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Transporte: puertos, TCP y UDP",
resumen: "Puertos y sockets, el saludo de TCP, fiabilidad y control de flujo, estados de conexión y UDP",
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
     <div class="diag">servidor 10.0.1.20
  :22    sshd
  :443   nginx
  :5432  postgres
  :8080  tu API de Spring Boot</div>
     <p>Si la IP es la dirección de un edificio, el puerto es el número de puerta.</p>`},
 {t:"par", p:"Empareja cada puerto con su servicio habitual",
  pares:[["22","SSH"],["53","DNS"],["80","HTTP"],["443","HTTPS"],["5432","PostgreSQL"]],
  why:"También conviene recordar 3306 (MySQL), 6379 (Redis), 27017 (MongoDB) y 8080 (aplicaciones)."},
 {t:"info", eti:"Los extremos", h:"Sockets y puertos efímeros",
  c:`<p>El servidor <b>escucha</b> en un puerto fijo (443). El cliente usa un <b>puerto efímero</b> aleatorio (por ejemplo 51234) que el sistema le asigna. Una conexión queda identificada por cinco datos:</p>
     <div class="diag">(protocolo, IP origen, puerto origen, IP destino, puerto destino)
(TCP,  192.168.1.10, 51234,  93.184.216.34, 443)</div>
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
  ok:true, why:"Cada conexión se distingue por la IP y el puerto de origen del cliente."}
]},

{
id:"rd4l2",
titulo:"TCP: conexión fiable",
claves:["TCP establece una conexión con el saludo de tres pasos: SYN, SYN-ACK, ACK","Garantiza entrega, orden y sin duplicados con números de secuencia y ACKs","Retransmite lo perdido y regula la velocidad (control de flujo y de congestión)"],
pasos:[
 {t:"info", eti:"Antes de hablar", h:"El saludo de tres pasos",
  c:`<div class="diag">cliente                         servidor
   | -- SYN (quiero hablar, empiezo en x) --> |
   | &lt;-- SYN-ACK (vale, yo empiezo en y) ---- |
   | -- ACK (recibido) ---------------------> |
   |         conexion establecida            |</div>
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
  ok:true, why:"Es una de sus garantías principales, gracias a los números de secuencia."}
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
  ok:false, why:"Un descarte silencioso produce timeout. Refused es una respuesta activa: la máquina existe y no hay nadie en ese puerto (o un cortafuegos configurado para rechazar)."}
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
  ok:false, why:"No da ninguna garantía de orden ni de entrega; si la aplicación las necesita, debe implementarlas."}
]}

]});
