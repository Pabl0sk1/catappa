window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "HTTP y TLS",
resumen: "Peticiones y respuestas, métodos, códigos de estado, cabeceras, versiones de HTTP, TLS y certificados",
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
  ok:false, why:"HTTP no tiene estado. La identidad viaja en cada petición (cookie o token)."}
]},

{
id:"rd6l2",
titulo:"Códigos de estado y cabeceras",
claves:["2xx éxito, 3xx redirección, 4xx error del cliente, 5xx error del servidor","401 no autenticado, 403 sin permiso, 404 no existe, 429 demasiadas peticiones","502/503/504 suelen venir de proxies y balanceadores"],
pasos:[
 {t:"info", eti:"Familias", h:"Códigos de estado",
  c:`<div class="diag">2xx  exito          200 OK, 201 Created, 204 No Content
3xx  redireccion    301 Moved Permanently, 302 Found, 304 Not Modified
4xx  culpa del cliente
                    400 Bad Request, 401 Unauthorized, 403 Forbidden,
                    404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests
5xx  culpa del servidor
                    500 Internal Server Error, 502 Bad Gateway,
                    503 Service Unavailable, 504 Gateway Timeout</div>`},
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
  ok:false, why:"500 es un fallo del servidor. Las peticiones mal formadas son 400."}
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
  ok:1, why:"Es la primera herramienta para ver dónde falla una llamada HTTP."}
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
  c:`<div class="diag">cliente -> servidor: ClientHello (versiones, cifrados, SNI = nombre del dominio, clave temporal)
servidor -> cliente: ServerHello (cifrado elegido, su clave temporal)
                     + certificado + prueba de que tiene la clave privada
cliente: verifica la cadena de certificados hasta una CA de confianza
         y que el nombre coincide con el dominio
ambos: derivan claves de sesion simetricas -> datos cifrados</div>
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
  ok:false, why:"Todo va cifrado; solo ve IPs, puertos y el dominio (por el SNI y el DNS)."}
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
  ok:true, why:"De ahí lo de «mutuo»."}
]}

]});
