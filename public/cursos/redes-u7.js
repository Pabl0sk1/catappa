window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "HTTP y TLS",
resumen: "Peticiones y respuestas, métodos, códigos de estado y redirecciones, HTTP/1.1 y HTTP/2 por dentro, TLS, cadena de certificados, ACME, mTLS y HSTS",
nivel: "Intermedio",
color: "#44acd2",
lecciones: [

{
id:"rd6l1",
titulo:"Petición y respuesta HTTP",
claves:["HTTP es texto: línea de petición, cabeceras, línea en blanco y cuerpo","Métodos: GET leer, POST crear, PUT reemplazar, PATCH modificar, DELETE borrar","HTTP no guarda estado entre peticiones; se usan cookies o tokens"],
pasos:[
 {t:"info", eti:"El protocolo de la web", h:"Qué viaja realmente",
  c:`<p>HTTP es un protocolo de texto. Una petición y su respuesta son literalmente esto:</p>
     <div class="termbox">POST /api/tareas HTTP/1.1
Host: api.miempresa.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...
Content-Length: 27

{"titulo":"Preparar demo"}</div>
     <div class="termbox">HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/tareas/42

{"id":42,"titulo":"Preparar demo"}</div>
     <p>Estructura: línea inicial, <b>cabeceras</b>, una línea en blanco y el <b>cuerpo</b> (opcional).</p>`},
 {t:"par", p:"Empareja cada método HTTP con su uso habitual en una API REST",
  pares:[["GET","Leer un recurso"],["POST","Crear un recurso nuevo"],["PUT","Reemplazar un recurso completo"],["PATCH","Modificar parte de un recurso"],["DELETE","Eliminar un recurso"]],
  why:"GET, PUT y DELETE son idempotentes: repetirlos deja el mismo resultado. POST no."},
 {t:"info", eti:"Sin memoria", h:"HTTP no tiene estado",
  c:`<p>Cada petición es independiente: el servidor no «recuerda» la anterior. Para saber quién eres, cada petición lleva algo que te identifica:</p>
     <ul><li>una <b>cookie</b> de sesión que el navegador envía automáticamente, o</li>
     <li>un <b>token</b> en la cabecera <code>Authorization</code> (por ejemplo un JWT).</li></ul>
     <p>Que HTTP no tenga estado es lo que permite poner diez réplicas de tu API detrás de un balanceador: cualquiera puede atender cualquier petición.</p>`},
 {t:"opcion", p:"¿Qué significa que un método sea idempotente?",
  ops:["Que es más rápido","Que repetirlo varias veces tiene el mismo efecto que hacerlo una","Que no lleva cuerpo","Que está cifrado"],
  ok:1, why:"Importa para los reintentos: reintentar un PUT es seguro; reintentar un POST puede crear duplicados."},
 {t:"vf", p:"Un servidor HTTP recuerda por sí mismo qué usuario hizo la petición anterior en la misma pestaña.",
  ok:false, why:"HTTP no tiene estado. La identidad viaja en cada petición (cookie o token)."},
 {t:"escribe", p:"¿Qué cabecera es obligatoria en toda petición HTTP/1.1, y es la que permite alojar muchos dominios en una misma IP?",
  sol:["Host","Host:","cabecera Host"], pista:"Indica el nombre del sitio al que va la petición.",
  why:"Con <code>Host</code> un solo Nginx sirve cien dominios (<i>virtual hosts</i>). En HTTP/2 y HTTP/3 su papel lo hace la pseudocabecera <code>:authority</code>."},
 {t:"opcion", p:"Un cliente reintenta automáticamente las peticiones que dan timeout. ¿En cuál de estas es más peligroso reintentar sin más?",
  ops:["GET /api/pedidos/42","PUT /api/pedidos/42 con el pedido completo","POST /api/pagos para cobrar 50 €","DELETE /api/pedidos/42"],
  ok:2, why:"POST no es idempotente: si la primera llegó y solo se perdió la respuesta, cobrarías dos veces. Las APIs de pago piden una cabecera <code>Idempotency-Key</code> para poder reintentar con seguridad."}
]},

{
id:"rd6l2",
titulo:"Códigos de estado y cabeceras",
claves:["2xx éxito, 3xx redirección, 4xx error del cliente, 5xx error del servidor","401 no autenticado, 403 sin permiso, 404 no existe, 429 demasiadas peticiones","502/503/504 suelen venir de proxies y balanceadores"],
pasos:[
 {t:"info", eti:"Familias", h:"Códigos de estado",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">códigos de estado HTTP</div><table class="dg-tabla"><thead><tr><th>familia</th><th>significado</th><th>ejemplos</th></tr></thead><tbody><tr><td>2xx</td><td>éxito</td><td>200 OK, 201 Created, 204 No Content</td></tr><tr><td>3xx</td><td>redirección</td><td>301 Moved Permanently, 302 Found, 304 Not Modified</td></tr><tr><td>4xx</td><td>culpa del cliente</td><td>400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests</td></tr><tr><td>5xx</td><td>culpa del servidor</td><td>500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout</td></tr></tbody></table></div>`},
 {t:"par", p:"Empareja cada código con su significado",
  pares:[["401","No autenticado: falta o es inválida la credencial"],["403","Autenticado pero sin permiso"],["404","El recurso no existe"],["429","Demasiadas peticiones: límite de uso"],["503","Servicio no disponible temporalmente"]],
  why:"La diferencia 401/403 es una pregunta muy repetida en entrevistas."},
 {t:"info", eti:"Los errores del proxy", h:"502, 503 y 504",
  c:`<p>Cuando hay un proxy o balanceador delante (Nginx, un ALB, un Ingress), estos errores suelen generarlos <b>ellos</b>, no tu aplicación:</p>
     <ul><li><b>502 Bad Gateway</b>: el proxy contactó con la aplicación y recibió algo inválido o la conexión se cortó (app caída, reiniciándose, puerto equivocado).</li>
     <li><b>503 Service Unavailable</b>: no hay destinos sanos disponibles (todos fallan el health check) o la app está sobrecargada.</li>
     <li><b>504 Gateway Timeout</b>: la aplicación tardó más que el timeout del proxy.</li></ul>`},
 {t:"opcion", p:"Tras un despliegue, el balanceador devuelve 504 en el endpoint de informes, que tarda 70 segundos. El timeout del balanceador es de 60. ¿Qué pasa?",
  ops:["La app está caída","El proxy corta la espera a los 60 s; hay que acelerar el endpoint, hacerlo asíncrono o ajustar el timeout","Un problema de DNS","Falta autenticación"],
  ok:1, why:"La solución buena suele ser hacer el proceso asíncrono (202 Accepted y consultar el resultado después)."},
 {t:"par", p:"Empareja cada cabecera con su función",
  pares:[["Content-Type","Formato del cuerpo (application/json)"],["Authorization","Credencial del cliente"],["Cache-Control","Cómo se puede cachear la respuesta"],["Location","Dónde está el recurso creado o a dónde redirigir"],["X-Forwarded-For","IP original del cliente cuando hay proxies"]],
  why:"Detrás de un balanceador, la IP que ve tu app es la del balanceador: la real va en X-Forwarded-For."},
 {t:"vf", p:"Un error 500 indica que el cliente envió una petición mal formada.",
  ok:false, why:"500 es un fallo del servidor. Las peticiones mal formadas son 400."},
 {t:"par", p:"Empareja cada redirección con su comportamiento",
  pares:[["301","Permanente; el cliente puede cambiar POST por GET"],["302","Temporal; el cliente puede cambiar POST por GET"],["307","Temporal, conservando método y cuerpo"],["308","Permanente, conservando método y cuerpo"],["304","No es redirección: «tu copia en caché sigue valiendo»"]],
  why:"Para redirigir una API que recibe POST, usa 307 o 308: con 301 o 302 muchos clientes repiten la petición como GET y pierden el cuerpo."}
]},

{
id:"rd6l3",
titulo:"curl y las versiones de HTTP",
claves:["curl -v muestra toda la conversación; -I solo cabeceras; -X, -H y -d para construir peticiones","HTTP/1.1 reutiliza conexiones; HTTP/2 multiplexa; HTTP/3 va sobre QUIC (UDP)","Keep-alive evita repetir el saludo TCP y TLS"],
pasos:[
 {t:"info", eti:"La navaja suiza", h:"curl",
  c:`<div class="termbox">curl https://api.miempresa.com/salud                      <span class="cm"># GET simple</span>
curl -I https://miempresa.com                             <span class="cm"># solo cabeceras</span>
curl -v https://api.miempresa.com/salud                   <span class="cm"># todo: DNS, TCP, TLS, cabeceras</span>
curl -X POST https://api.miempresa.com/api/tareas \\
     -H "Content-Type: application/json" \\
     -d '{"titulo":"demo"}'
curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" https://miempresa.com</div>`},
 {t:"term", p:"Pide solo las cabeceras de la respuesta de <code>https://miempresa.com</code>",
  prompt:"pablo@portatil:~$", sol:["curl -I https://miempresa.com","curl --head https://miempresa.com","curl -si https://miempresa.com -o /dev/null"],
  pista:"curl con la opción -I (i mayúscula).",
  salida:`HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: max-age=300
strict-transport-security: max-age=31536000`, why:"Útil para ver redirecciones, caché y cabeceras de seguridad sin descargar la página."},
 {t:"info", eti:"Evolución", h:"HTTP/1.1, HTTP/2 y HTTP/3",
  c:`<ul><li><b>HTTP/1.1</b>: texto; una petición a la vez por conexión; <b>keep-alive</b> para reutilizar la conexión.</li>
     <li><b>HTTP/2</b>: binario, <b>multiplexa</b> muchas peticiones en una sola conexión, comprime cabeceras. Base de gRPC.</li>
     <li><b>HTTP/3</b>: sobre <b>QUIC</b> (UDP). Evita que un paquete perdido bloquee todas las peticiones de la conexión y combina el saludo de transporte y cifrado.</li></ul>`},
 {t:"par", p:"Empareja cada versión con su característica principal",
  pares:[["HTTP/1.1","Texto y conexiones reutilizables con keep-alive"],["HTTP/2","Multiplexación binaria en una conexión"],["HTTP/3","Funciona sobre QUIC y UDP"],["gRPC","RPC que usa HTTP/2 por debajo"]],
  why:"Si te preguntan por gRPC, recuerda que depende de HTTP/2 y eso afecta a los balanceadores que uses."},
 {t:"opcion", p:"¿Qué muestra <code>curl -v</code> que no muestra un curl normal?",
  ops:["Nada","La conexión, el saludo TLS, las cabeceras enviadas y recibidas","Solo el cuerpo","El código fuente del servidor"],
  ok:1, why:"Es la primera herramienta para ver dónde falla una llamada HTTP."},
 {t:"info", eti:"Por dentro", h:"HTTP/2 y cómo se negocia la versión",
  c:`<ul><li>HTTP/1.1 solo tiene una petición en curso por conexión, así que los navegadores abren hasta <b>6 conexiones por dominio</b>. Trucos antiguos como repartir recursos en varios subdominios (<i>domain sharding</i>) hoy perjudican.</li>
     <li>HTTP/2 divide cada petición en <b>tramas</b> de un <b>flujo</b> (<i>stream</i>) numerado, y muchos flujos se intercalan en una sola conexión TCP. Comprime cabeceras con <b>HPACK</b>.</li>
     <li>La versión se negocia dentro del saludo TLS con <b>ALPN</b>: el cliente ofrece <code>h2</code> y <code>http/1.1</code>, y el servidor elige. Los navegadores solo usan HTTP/2 sobre TLS; en claro (<code>h2c</code>) se usa solo entre servicios, por ejemplo gRPC dentro de un clúster.</li></ul>
     <p>Para medir dónde se va el tiempo de una petición, curl tiene variables de tiempo:</p>
     <div class="termbox">pablo@portatil:~$ curl -s -o /dev/null -w "dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n" https://miempresa.com
dns=0.004 tcp=0.031 tls=0.068 ttfb=0.912 total=0.915</div>
     <p>Los tiempos son acumulados desde el inicio.</p>`},
 {t:"opcion", p:"Con la salida anterior (<code>dns=0.004 tcp=0.031 tls=0.068 ttfb=0.912 total=0.915</code>), ¿dónde se va el tiempo?",
  ops:["En resolver el DNS","En el saludo TLS","En el servidor: desde que acaba TLS hasta el primer byte pasan unos 844 ms","En descargar el cuerpo"],
  ok:2, why:"Red y TLS suman 68 ms; el primer byte llega a los 912 ms. La aplicación (o su base de datos) es la lenta, no la red."},
 {t:"vf", p:"Los navegadores solo usan HTTP/2 sobre conexiones cifradas con TLS.",
  ok:true, why:"La versión se negocia con ALPN durante el saludo TLS. HTTP/2 sin cifrar (h2c) existe, pero solo lo usan clientes y servidores de backend."}
]},

{
id:"rd6l4",
titulo:"TLS y certificados",
claves:["TLS cifra, garantiza integridad y autentica al servidor","El certificado vincula un dominio a una clave pública, firmado por una autoridad (CA)","Let's Encrypt emite certificados gratuitos y automáticos de 90 días"],
pasos:[
 {t:"info", eti:"La S de HTTPS", h:"Qué aporta TLS",
  c:`<ul><li><b>Confidencialidad</b>: nadie en el camino puede leer los datos.</li>
     <li><b>Integridad</b>: nadie puede modificarlos sin que se note.</li>
     <li><b>Autenticación</b>: estás hablando con el <code>miempresa.com</code> de verdad, no con un impostor.</li></ul>
     <p>Esta última se consigue con un <b>certificado</b>: un documento que dice «esta clave pública pertenece a miempresa.com», firmado por una <b>autoridad de certificación</b> (CA) en la que confía tu navegador o sistema.</p>`},
 {t:"info", eti:"El saludo", h:"Handshake de TLS 1.3 (simplificado)",
  c:`<div class="dg"><div class="dg-tit">handshake de TLS 1.3</div><svg viewBox="0 0 340 503" width="100%" style="max-width:460px;display:block;margin:auto" role="img" aria-label="Handshake TLS: ClientHello, ServerHello con certificado, verificación del cliente y claves de sesión"><defs><marker id="fl-redes6-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker><marker id="fl-redes6-1-ok" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ok)"/></marker></defs><line x1="55" y1="46" x2="55" y2="499" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="20.54" y="8" width="68.92" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="55" y="31.666666666666668" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--sans)" fill="var(--ink)">cliente</text><line x1="285" y1="46" x2="285" y2="499" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="246.76" y="8" width="76.48" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="285" y="31.666666666666668" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--sans)" fill="var(--ink)">servidor</text><text x="170" y="76" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">ClientHello</tspan></text><text x="170" y="93" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">versiones, cifrados,</text><text x="170" y="110" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">SNI = nombre del dominio,</text><text x="170" y="127" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">clave temporal</text><line x1="55" y1="139" x2="282" y2="139" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes6-1)"/><text x="170" y="169" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">ServerHello</tspan></text><text x="170" y="186" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">cifrado elegido,</text><text x="170" y="203" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">su clave temporal</text><text x="170" y="220" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">+ certificado</text><text x="170" y="237" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">+ prueba de que tiene</text><text x="170" y="254" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">la clave privada</text><line x1="285" y1="266" x2="58" y2="266" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes6-1)"/><rect x="6" y="284" width="234" height="97" rx="6" fill="var(--bg-3)" stroke="var(--line-2)" stroke-width="1.5"/><text x="123" y="303" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)"><tspan font-weight="700">el cliente verifica</tspan></text><text x="123" y="320" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)">la cadena de certificados</text><text x="123" y="337" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)">hasta una CA de confianza</text><text x="123" y="354" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)">y que el nombre coincide</text><text x="123" y="371" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)">con el dominio</text><rect x="30" y="397" width="280" height="46" rx="6" fill="var(--bg-3)" stroke="var(--line-2)" stroke-width="1.5"/><text x="170" y="416" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)"><tspan font-weight="700">ambos</tspan> derivan claves</text><text x="170" y="433" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)">de sesión simétricas</text><text x="170" y="471" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">datos cifrados</text><line x1="58" y1="483" x2="282" y2="483" stroke="var(--ok)" stroke-width="2" marker-start="url(#fl-redes6-1-ok)" marker-end="url(#fl-redes6-1-ok)"/></svg></div>
     <p>El <b>SNI</b> indica el dominio en el primer mensaje: así un mismo servidor e IP pueden servir certificados de muchos dominios.</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Certificado","Vincula un dominio con una clave pública"],["CA","Autoridad que firma certificados"],["Cadena de confianza","Certificado, intermedios y raíz de confianza"],["SNI","Nombre del dominio enviado al iniciar TLS"],["Terminación TLS","Punto donde se descifra el tráfico (balanceador, Ingress)"]],
  why:"Lo habitual es terminar TLS en el balanceador o el Ingress y hablar con la app por dentro de la red."},
 {t:"opcion", p:"El navegador muestra «NET::ERR_CERT_DATE_INVALID» en tu web. ¿Causa más probable?",
  ops:["El DNS","El certificado ha caducado: la renovación automática ha fallado","El puerto 80 está cerrado","HTTP/2"],
  ok:1, why:"Automatiza la renovación (cert-manager, certbot) y pon una alerta de caducidad. Es uno de los incidentes más evitables."},
 {t:"term", p:"Muestra con openssl el certificado que presenta <code>miempresa.com</code> en el puerto 443",
  prompt:"pablo@portatil:~$", sol:["openssl s_client -connect miempresa.com:443 -servername miempresa.com","openssl s_client -connect miempresa.com:443","openssl s_client -servername miempresa.com -connect miempresa.com:443"],
  pista:"openssl s_client -connect dominio:puerto (y -servername para el SNI).",
  salida:`depth=2 C = US, O = Internet Security Research Group, CN = ISRG Root X1
depth=1 C = US, O = Let's Encrypt, CN = R11
depth=0 CN = miempresa.com
verify return:1
Verify return code: 0 (ok)`, why:"Ves la cadena completa: raíz, intermedio y el certificado del dominio."},
 {t:"vf", p:"Con TLS, un intermediario en la misma red Wi-Fi puede ver la URL completa y el cuerpo de tus peticiones.",
  ok:false, why:"Todo va cifrado; solo ve IPs, puertos y el dominio (por el SNI y el DNS)."},
 {t:"opcion", p:"Accedes a <code>https://10.0.1.20</code> y el cliente dice «certificate is not valid for 10.0.1.20», aunque el certificado de <code>api.miempresa.com</code> es correcto y está en vigor. ¿Por qué?",
  ops:["El certificado ha caducado","El nombre al que te conectas no está en el certificado (SAN): hay que usar el nombre, no la IP","TLS no funciona con IPs privadas","Falta el puerto"],
  ok:1, why:"El cliente comprueba que el nombre que pidió aparece en el <i>Subject Alternative Name</i> del certificado. Es lo que impide que un certificado robado de otro dominio sirva para suplantarte."}
]},

{
id:"rd7n1",
titulo:"Certificados en la práctica: cadena, ACME y openssl",
claves:["El servidor debe enviar su certificado y los intermedios; la raíz ya la tiene el cliente","ACME (Let's Encrypt, cert-manager) automatiza la emisión con retos HTTP-01 o DNS-01; los comodines exigen DNS-01","openssl s_client y openssl x509 son las herramientas para inspeccionar certificados y fechas"],
pasos:[
 {t:"info", eti:"La cadena", h:"Hoja, intermedios y raíz",
  c:`<div class="dg"><div class="dg-tit">cadena de confianza de un certificado</div><div class="dg-vert">
     <div class="dg-caja base">CA raíz: ISRG Root X1<small>viene instalada en el sistema o el navegador</small></div>
     <div class="dg-caja">intermedio: Let's Encrypt R11<small>firmado por la raíz; lo envía el servidor</small></div>
     <div class="dg-caja acento">hoja: miempresa.com<small>SAN: miempresa.com, www.miempresa.com</small></div>
     </div></div>
     <ul><li>El servidor debe enviar <b>la hoja y los intermedios</b> (el fichero <code>fullchain.pem</code>). Si solo envía la hoja, los navegadores a veces lo arreglan descargando el intermedio, pero <code>curl</code>, Java o Python fallan con «unable to get local issuer certificate». Es el clásico «en el navegador funciona».</li>
     <li>Los nombres válidos van en el <b>SAN</b>. Un comodín <code>*.miempresa.com</code> cubre <code>api.miempresa.com</code>, pero no <code>miempresa.com</code> ni <code>a.b.miempresa.com</code>.</li>
     <li><b>Validez</b>: desde marzo de 2026 un certificado público dura como máximo 200 días, y el límite bajará a 100 en 2027 y a 47 en 2029. Renovar a mano ya no es una opción.</li>
     <li>La clave privada nunca sale del servidor. Hoy se prefieren claves <b>ECDSA</b> (más pequeñas y rápidas) a RSA.</li></ul>`},
 {t:"info", eti:"Automatizar", h:"ACME: certificados sin intervención humana",
  c:`<p>El protocolo <b>ACME</b> (RFC 8555) lo usan Let's Encrypt y otras CA. El cliente (certbot, Caddy, Traefik, cert-manager en Kubernetes) demuestra que controla el dominio con un <b>reto</b>:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">retos de ACME</div><table class="dg-tabla"><thead><tr><th>reto</th><th>cómo se demuestra</th><th>cuándo usarlo</th></tr></thead><tbody><tr><td>HTTP-01</td><td>servir un fichero en <code>http://dominio/.well-known/acme-challenge/</code> por el puerto 80</td><td>servidor accesible desde internet</td></tr><tr><td>DNS-01</td><td>crear un TXT en <code>_acme-challenge.dominio</code></td><td>comodines, servidores internos, varios balanceadores</td></tr><tr><td>TLS-ALPN-01</td><td>responder por el 443 con un certificado especial</td><td>cuando solo tienes el 443</td></tr></tbody></table></div>
     <p>Para tráfico interno y mTLS se usa una <b>CA privada</b> (Vault, step-ca, AWS Private CA, la de la malla de servicios) con certificados de horas o días.</p>
     <div class="termbox">root@web:~# certbot certonly --webroot -w /var/www/html -d miempresa.com -d www.miempresa.com
root@web:~# openssl x509 -in /etc/letsencrypt/live/miempresa.com/cert.pem -noout -subject -enddate
subject=CN = miempresa.com
notAfter=Dec 21 23:59:59 2026 GMT</div>`},
 {t:"term", p:"Muestra solo la fecha de caducidad del certificado guardado en <code>cert.pem</code>",
  prompt:"pablo@portatil:~$", sol:["openssl x509 -in cert.pem -noout -enddate","openssl x509 -noout -enddate -in cert.pem","openssl x509 -enddate -noout -in cert.pem","openssl x509 -in cert.pem -enddate -noout"],
  salida:`notAfter=Dec 21 23:59:59 2026 GMT`,
  pista:"openssl x509, el fichero con -in, sin imprimir el certificado (-noout) y la opción de la fecha final.",
  why:"<code>-dates</code> muestra inicio y fin; <code>-checkend 2592000</code> devuelve error si caduca en menos de 30 días, perfecto para un script de alerta."},
 {t:"opcion", p:"Tras renovar el certificado, los navegadores cargan la web bien, pero una aplicación Java que la llama falla con «PKIX path building failed». ¿Causa más probable?",
  ops:["Java no soporta TLS 1.3","El servidor solo envía la hoja y no el intermedio: hay que configurar fullchain.pem","El certificado es de 90 días","El DNS"],
  ok:1, why:"Los navegadores completan la cadena por su cuenta; Java, curl y Python no. Compruébalo con <code>openssl s_client -showcerts</code>: deberías ver al menos dos certificados."},
 {t:"opcion", p:"Tienes un certificado <code>*.miempresa.com</code>. ¿Cuál de estos nombres NO cubre?",
  ops:["api.miempresa.com","www.miempresa.com","v2.api.miempresa.com","panel.miempresa.com"],
  ok:2, why:"El asterisco cubre una sola etiqueta. Para <code>v2.api.miempresa.com</code> haría falta <code>*.api.miempresa.com</code> o el nombre concreto en el SAN."},
 {t:"escribe", p:"Quieres un certificado comodín de Let's Encrypt para <code>*.miempresa.com</code>. ¿Qué tipo de reto ACME es obligatorio? (su nombre)",
  sol:["DNS-01","dns-01","dns01","DNS","el DNS-01"], pista:"Se demuestra con un registro TXT.",
  why:"Para comodines solo vale DNS-01: el cliente ACME necesita credenciales de la API de tu proveedor DNS para crear el TXT <code>_acme-challenge</code>."},
 {t:"codigo", p:"Escribe un comprobador de caducidad: lee la línea <code>notAfter=…</code> de openssl y la fecha de hoy (<code>AAAA-MM-DD</code>), y escribe los días que quedan y el estado",
  lenguaje:"py",
  c:`<p>Salida: <code>dias=N</code> y, en otra línea, <code>CADUCADO</code> si N &lt; 0, <code>RENOVAR</code> si N &lt; 30, o <code>OK</code>. Los días se cuentan entre fechas (sin horas).</p><div class="termbox">notAfter=Dec 21 23:59:59 2026 GMT
2026-09-23</div><p>→ <code>dias=89</code> y <code>OK</code>. Ojo: openssl rellena los días de una cifra con un espacio (<code>Oct  5</code>).</p>`,
  plantilla:"from datetime import datetime, date\nfin = input().strip().split('=', 1)[1]\nhoy = date.fromisoformat(input().strip())\n# convierte fin a fecha y calcula los días\n",
  pruebas:[{entrada:"notAfter=Dec 21 23:59:59 2026 GMT\n2026-09-23\n", salida:"dias=89\nOK"},{entrada:"notAfter=Oct  5 12:00:00 2026 GMT\n2026-09-23\n", salida:"dias=12\nRENOVAR"},{entrada:"notAfter=Sep  1 08:30:00 2026 GMT\n2026-09-23\n", salida:"dias=-22\nCADUCADO", oculta:true},{entrada:"notAfter=Oct 23 00:00:00 2026 GMT\n2026-09-23\n", salida:"dias=30\nOK", oculta:true}],
  pista:"datetime.strptime(' '.join(fin.split()), '%b %d %H:%M:%S %Y %Z').date() y resta las fechas con .days.",
  solucion:"from datetime import datetime, date\nfin = input().strip().split('=', 1)[1]\nhoy = date.fromisoformat(input().strip())\nf = datetime.strptime(' '.join(fin.split()), '%b %d %H:%M:%S %Y %Z').date()\ndias = (f - hoy).days\nprint(f'dias={dias}')\nif dias < 0:\n    print('CADUCADO')\nelif dias < 30:\n    print('RENOVAR')\nelse:\n    print('OK')",
  why:"Esto, lanzado cada día contra tus dominios con <code>openssl s_client … | openssl x509 -noout -enddate</code>, evita el incidente más tonto y más frecuente de TLS. En producción se suele usar el exportador blackbox de Prometheus, que da esta métrica ya calculada."}
]},

{
id:"rd6l5",
titulo:"mTLS, HSTS y buenas prácticas",
claves:["mTLS: también el cliente presenta certificado; común entre servicios","HSTS obliga al navegador a usar siempre HTTPS","TLS 1.2 como mínimo, redirigir HTTP a HTTPS, renovar automáticamente"],
pasos:[
 {t:"info", eti:"Ambos lados", h:"TLS mutuo (mTLS)",
  c:`<p>En TLS normal, solo el servidor demuestra quién es. En <b>mTLS</b>, el <b>cliente también presenta un certificado</b>. Se usa para comunicación entre servicios: solo los servicios con un certificado válido de la organización pueden llamar.</p>
     <p>Las mallas de servicios (Istio, Linkerd) activan mTLS entre todos los pods automáticamente, con rotación de certificados incluida.</p>`},
 {t:"info", eti:"Endurecer", h:"Buenas prácticas de HTTPS",
  c:`<ul><li>Redirigir todo el HTTP (80) a HTTPS (443) con un 301.</li>
     <li><b>HSTS</b> (<code>Strict-Transport-Security</code>): el navegador recordará usar siempre HTTPS con ese dominio.</li>
     <li>Solo <b>TLS 1.2 y 1.3</b>; desactivar versiones antiguas.</li>
     <li>Renovación <b>automática</b> de certificados y alerta si falta poco para caducar.</li>
     <li>Nunca desactivar la verificación de certificados en clientes (<code>curl -k</code>, <code>verify=False</code>) fuera de pruebas locales.</li></ul>`},
 {t:"par", p:"Empareja cada práctica con lo que previene",
  pares:[["Redirigir HTTP a HTTPS","Tráfico sin cifrar por despiste"],["HSTS","Ataques que degradan la conexión a HTTP"],["Renovación automática","Certificados caducados"],["Verificar certificados en el cliente","Suplantación del servidor"],["mTLS entre servicios","Llamadas de servicios no autorizados"]],
  why:"Todas son baratas de aplicar y evitan incidentes serios."},
 {t:"opcion", p:"Un compañero pone <code>curl -k</code> en el pipeline porque «falla el certificado». ¿Qué le dices?",
  ops:["Perfecto","-k desactiva la verificación: cualquiera podría suplantar al servidor. Hay que arreglar el certificado o añadir la CA interna de confianza","Que use HTTP","Que use UDP"],
  ok:1, why:"Desactivar la verificación elimina justo la protección que da TLS."},
 {t:"vf", p:"En mTLS, tanto el cliente como el servidor presentan un certificado.",
  ok:true, why:"De ahí lo de «mutuo»."},
 {t:"hueco", p:"Completa la cabecera HSTS que obliga a usar HTTPS durante un año en el dominio y todos sus subdominios",
  tpl:"___: max-age=___; ___",
  banco:["Strict-Transport-Security","31536000","includeSubDomains","Content-Security-Policy","3600","preload-only"], sol:["Strict-Transport-Security","31536000","includeSubDomains"],
  why:"31.536.000 segundos son 365 días. Empieza con un max-age corto: si algún subdominio aún no tiene HTTPS, HSTS lo dejará inaccesible para quien ya visitó el dominio."},
 {t:"opcion", p:"El balanceador termina TLS y reenvía a los pods por HTTP en claro dentro de la VPC. Auditoría exige cifrado extremo a extremo. ¿Qué opción es la habitual?",
  ops:["Quitar el balanceador","Recifrar: el balanceador abre una nueva conexión TLS hacia el backend (o mTLS con una malla de servicios)","Usar HTTP/1.0","Poner el certificado público en cada pod"],
  ok:1, why:"Terminar y volver a cifrar permite al balanceador ver HTTP (enrutar por ruta, añadir cabeceras) sin dejar tramos en claro. La alternativa es el <i>passthrough</i> TLS en capa 4, pero entonces el balanceador no ve nada de HTTP."}
]}

]});
