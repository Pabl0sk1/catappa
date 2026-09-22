window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Maestría: casos reales y entrevista",
resumen: "Qué pasa al escribir una URL, incidentes de red resueltos paso a paso y simulacro de entrevista",
nivel: "Maestro",
color: "#1f7aa3",
lecciones: [

{
id:"rd11l1",
titulo:"¿Qué pasa al escribir una URL?",
claves:["DNS → TCP → TLS → HTTP → servidor → respuesta → renderizado","Cada fase tiene su latencia y sus posibles fallos","Es la pregunta de redes más famosa de las entrevistas"],
pasos:[
 {t:"info", eti:"La pregunta estrella", h:"https://tienda.com/carrito, de principio a fin",
  c:`<ol><li><b>URL</b>: el navegador separa esquema (https), dominio (tienda.com) y ruta (/carrito).</li>
     <li><b>DNS</b>: busca en cachés; si no, el resolvedor recursivo recorre raíz → .com → autoritativo y obtiene la IP (quizá de una CDN o balanceador).</li>
     <li><b>Ruta</b>: el sistema ve que la IP no es local y envía los paquetes a la puerta de enlace (ARP para su MAC). El router hace NAT y los paquetes cruzan internet salto a salto.</li>
     <li><b>TCP</b>: saludo SYN, SYN-ACK, ACK al puerto 443.</li>
     <li><b>TLS</b>: ClientHello con SNI, certificado verificado, claves de sesión.</li>
     <li><b>HTTP</b>: GET /carrito con cabeceras y cookies.</li>
     <li><b>Servidor</b>: CDN o balanceador → proxy inverso → aplicación → base de datos o caché → respuesta.</li>
     <li><b>Navegador</b>: recibe el HTML, pide CSS, JS e imágenes (muchas desde caché o CDN) y pinta la página.</li></ol>`},
 {t:"orden", p:"Ordena las fases al abrir una URL nueva",
  items:["Resolver el nombre con DNS","Establecer la conexión TCP","Negociar TLS","Enviar la petición HTTP","El servidor procesa y responde","El navegador pinta la página y pide los recursos"],
  why:"Contarlo con este orden y con detalle en cada fase demuestra una base sólida."},
 {t:"opcion", p:"¿En qué fase interviene el SNI?",
  ops:["DNS","TCP","TLS: en el ClientHello, para que el servidor elija el certificado","HTTP"],
  ok:2, why:"Permite que una sola IP sirva certificados de muchos dominios."},
 {t:"par", p:"Empareja cada fase con un fallo típico",
  pares:[["DNS","NXDOMAIN o IP antigua en caché"],["TCP","Timeout por cortafuegos"],["TLS","Certificado caducado o nombre que no coincide"],["HTTP","404, 401 o 5xx"],["Servidor","Base de datos lenta que provoca 504"]],
  why:"Este mapa te permite ubicar cualquier error que te describan."}
]},

{
id:"rd11l2",
titulo:"Incidentes de red reales",
claves:["Aislar el problema por capa y por ubicación","Comparar lo que funciona con lo que no","Mitigar primero, causa raíz después"],
pasos:[
 {t:"info", eti:"Caso 1", h:"«Desde mi portátil funciona, desde el servidor no»",
  c:`<p>La API llama a un proveedor externo. En local va bien; en producción, timeout.</p>
     <ol><li><code>dig proveedor.com</code> en el servidor: resuelve. DNS descartado.</li>
     <li><code>nc -vz proveedor.com 443</code>: timeout. Hay un bloqueo.</li>
     <li>El servidor está en una subred privada: ¿tiene ruta 0.0.0.0/0 al NAT? Sí.</li>
     <li>El proveedor tiene <b>lista blanca de IPs</b>: añadieron la IP de la oficina, no la IP pública del NAT Gateway.</li></ol>
     <p>Solución: dar al proveedor la IP elástica del NAT.</p>`},
 {t:"opcion", p:"Caso 2: tras migrar la web a un nuevo servidor, la mitad de los usuarios sigue viendo la versión vieja durante horas. ¿Causa?",
  ops:["Un bug del navegador","El TTL del registro DNS era alto y los resolvedores siguen con la IP antigua en caché","El certificado","El balanceador"],
  ok:1, why:"Lección: bajar el TTL antes de migrar y mantener el servidor antiguo funcionando hasta que caduque."},
 {t:"opcion", p:"Caso 3: dentro de una VPN, las peticiones pequeñas funcionan pero las descargas grandes se cuelgan. ¿Qué sospechas?",
  ops:["Falta de ancho de banda","Problema de MTU: los paquetes grandes, con la cabecera extra del túnel, no caben y se descartan","DNS","TLS"],
  ok:1, why:"Se soluciona bajando la MTU del túnel o ajustando el MSS de TCP (MSS clamping)."},
 {t:"opcion", p:"Caso 4: un pod no puede llamar a <code>api.pagos</code> desde que se aplicó una NetworkPolicy de «denegar salida» en su namespace. La política permite el puerto 8080 hacia pagos. ¿Qué falta?",
  ops:["Nada","Permitir la salida DNS (UDP y TCP 53) hacia kube-dns: sin ella el nombre no se resuelve","Un Ingress","Más réplicas"],
  ok:1, why:"Olvidar el DNS en las políticas de salida es de los fallos más comunes."},
 {t:"opcion", p:"Caso 5: tu API detrás de un balanceador registra siempre la misma IP de cliente (10.0.1.37). ¿Por qué?",
  ops:["Solo hay un usuario","Es la IP del balanceador; la real llega en X-Forwarded-For y hay que configurar la app para usarla","Un error de DNS","NAT del usuario"],
  ok:1, why:"Importante para logs, límites de peticiones y seguridad. Confía solo en esa cabecera si viene de tu propio proxy."},
 {t:"par", p:"Empareja cada síntoma con su primera sospecha",
  pares:[["Timeout al conectar","Cortafuegos, grupo de seguridad o ruta"],["Connection refused","Servicio caído o escuchando en otra IP o puerto"],["Nombre no resuelve","DNS o dominios de búsqueda"],["Funciona a ratos tras migrar","Cachés de DNS y TTL"],["Grandes cuelgan, pequeñas no","MTU"]],
  why:"Este mapa es tu primer minuto de cualquier incidente de red."}
]},

{
id:"rd11l3",
titulo:"Simulacro de entrevista de redes",
claves:["Has repasado las preguntas de redes más frecuentes","Sabes explicar TCP, DNS, HTTP, TLS, subredes y balanceo","Estás preparado para preguntas de backend, DevOps y cloud"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir. Si fallas, repasa la unidad correspondiente.</p>`},
 {t:"opcion", p:"«¿Diferencia entre TCP y UDP?»",
  ops:["Ninguna relevante","TCP: orientado a conexión, fiable y ordenado, con control de flujo. UDP: sin conexión, sin garantías, más ligero; DNS, streaming, QUIC","UDP es más seguro","TCP solo sirve para web"],
  ok:1, why:"Añade ejemplos de uso de cada uno."},
 {t:"opcion", p:"«¿Cuántas direcciones tiene un /26 y cuántas son usables en una red clásica?»",
  ops:["26 y 24","64 y 62","256 y 254","32 y 30"],
  ok:1, why:"2⁽³²⁻²⁶⁾ = 64; menos red y broadcast, 62."},
 {t:"opcion", p:"«¿Qué es un registro CNAME y cuándo lo usarías?»",
  ops:["Un registro de correo","Un alias de un nombre hacia otro; por ejemplo apuntar api.miempresa.com al nombre del balanceador de AWS, cuyas IPs cambian","Una IP fija","Un certificado"],
  ok:1, why:"Los balanceadores de la nube cambian de IP: se apunta a su nombre, no a sus IPs."},
 {t:"opcion", p:"«¿Diferencia entre balanceador de capa 4 y de capa 7?»",
  ops:["Solo el precio","Capa 4 reparte conexiones TCP/UDP sin mirar el contenido; capa 7 entiende HTTP y enruta por dominio, ruta o cabeceras, termina TLS y puede reintentar","Capa 7 es más rápida siempre","Capa 4 entiende HTTP"],
  ok:1, why:"Ejemplos en AWS: NLB (capa 4) y ALB (capa 7)."},
 {t:"opcion", p:"«¿Qué diferencia hay entre 401 y 403?»",
  ops:["Son iguales","401: no autenticado (falta o es inválida la credencial). 403: autenticado pero sin permiso","403 es de servidor","401 es de red"],
  ok:1, why:"Pregunta sencilla que se falla a menudo."},
 {t:"opcion", p:"«¿Cómo harías que una base de datos no sea accesible desde internet pero sí desde tu aplicación?»",
  ops:["Contraseña fuerte y ya","Subred privada sin ruta a internet, sin IP pública, grupo de seguridad que solo admite el puerto desde el grupo de la aplicación, y TLS en la conexión","Puerto no estándar","Una VPN para cada usuario"],
  ok:1, why:"Defensa en profundidad: red, filtrado, identidad y cifrado."},
 {t:"opcion", p:"«Una llamada entre dos servicios da timeout. ¿Cómo lo diagnosticas?»",
  ops:["Reinicio todo","Desde el origen: DNS con dig, puerto con nc, ruta y reglas (grupos de seguridad, NetworkPolicies), escucha en el destino con ss, y tcpdump si hace falta","Cambio el timeout a 10 minutos","Abro todos los puertos"],
  ok:1, why:"Método por capas y desde el lugar que falla."},
 {t:"info", eti:"Terminado", h:"Has completado Redes de cero a experto",
  c:`<p>Dominas modelos en capas, Ethernet y ARP, IP y subredes, TCP y UDP, DNS, HTTP y TLS, enrutamiento, NAT y cortafuegos, balanceo y CDN, diagnóstico con herramientas reales, y las redes de contenedores, Kubernetes y la nube.</p>
     <p>Para consolidarlo: diseña en papel la VPC de un proyecto (subredes, rutas, grupos de seguridad), captura con tcpdump una petición HTTP de tu propia API en Docker y localiza el saludo TCP. Si te interesa certificarte: CompTIA Network+ o AWS Advanced Networking.</p>`}
]}

]});
