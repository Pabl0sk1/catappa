window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Balanceo, proxies y CDN",
resumen: "Proxy directo e inverso, PROXY protocol, balanceadores de capa 4 y 7, algoritmos y hashing consistente, health checks, alta disponibilidad, CDN y caché",
nivel: "Avanzado",
color: "#3a9fc6",
lecciones: [

{
id:"rd8l1",
titulo:"Proxy directo e inverso",
claves:["Proxy directo: actúa en nombre de los clientes (salida)","Proxy inverso: actúa en nombre de los servidores (entrada)","Nginx, HAProxy, Envoy y Traefik son proxies inversos habituales"],
pasos:[
 {t:"info", eti:"Intermediarios", h:"Dos tipos de proxy",
  c:`<div class="dg"><div class="dg-tit">proxy directo y proxy inverso</div><div class="dg-cols">
     <div class="dg-col"><div class="dg-col-tit">proxy directo (forward)</div><div class="dg-vert"><div class="dg-caja">empleados</div><div class="dg-caja acento">proxy de la empresa</div><div class="dg-caja base">internet</div></div><div class="dg-nota arriba">el servidor ve la IP del proxy, no la de cada empleado</div></div>
     <div class="dg-col"><div class="dg-col-tit">proxy inverso (reverse)</div><div class="dg-vert"><div class="dg-caja base">internet</div><div class="dg-caja acento">nginx</div><div class="dg-caja ok">app-1 · app-2 · app-3</div></div><div class="dg-nota arriba">el cliente cree que habla con nginx; no ve los servidores de detrás</div></div>
     </div></div>
     <p>Un <b>proxy inverso</b> delante de tu aplicación puede: terminar TLS, balancear entre réplicas, comprimir, cachear, limitar peticiones, servir estáticos y ocultar la topología interna.</p>`},
 {t:"info", eti:"Nginx", h:"Un proxy inverso mínimo",
  c:`<div class="termbox">upstream api {
    server 10.0.11.21:8080;
    server 10.0.11.22:8080;
}
server {
    listen 443 ssl;
    server_name api.miempresa.com;
    ssl_certificate     /etc/ssl/api.crt;
    ssl_certificate_key /etc/ssl/api.key;

    location / {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}</div>`},
 {t:"par", p:"Empareja cada directiva de Nginx con su función",
  pares:[["upstream","Grupo de servidores entre los que repartir"],["proxy_pass","Reenviar la petición al grupo"],["ssl_certificate","Certificado para terminar TLS"],["proxy_set_header Host","Conservar el dominio original"],["X-Forwarded-Proto","Contar a la app si el cliente usó HTTPS"]],
  why:"Un proxy directo representa a los clientes; uno inverso, como este Nginx, a los servidores."},
 {t:"opcion", p:"Tu aplicación, detrás de Nginx, genera enlaces con <code>http://</code> aunque el usuario entró por HTTPS. ¿Qué falta?",
  ops:["Un certificado en la app","Pasar X-Forwarded-Proto y configurar la app para confiar en esas cabeceras (en Spring Boot: server.forward-headers-strategy)","Cambiar el puerto","Usar HTTP/2"],
  ok:1, why:"La app solo ve HTTP desde el proxy; las cabeceras X-Forwarded-* le cuentan cómo llegó el cliente."},
 {t:"vf", p:"Un proxy inverso puede ocultar a los clientes cuántos servidores hay detrás.",
  ok:true, why:"El cliente solo ve el proxy. Esto permite cambiar, escalar o reemplazar servidores sin que se note."},
 {t:"escribe", p:"En los servidores de la empresa, todo el tráfico saliente debe pasar por un proxy directo. ¿Qué variable de entorno leen curl, pip, npm y la mayoría de herramientas para usar un proxy en las URL https://?",
  sol:["HTTPS_PROXY","https_proxy","HTTPS_PROXY=","export HTTPS_PROXY"], pista:"Es el nombre del protocolo seguido de _PROXY.",
  why:"Se acompaña de <code>NO_PROXY</code> con los destinos internos (<code>localhost,10.0.0.0/8,.svc.cluster.local</code>). Olvidar NO_PROXY hace que el tráfico interno intente salir por el proxy y falle."},
 {t:"opcion", p:"Tu servicio está detrás de un balanceador de <b>capa 4</b> que no termina TLS. En los logs todas las peticiones vienen de la IP del balanceador. ¿Cómo recuperas la IP real del cliente?",
  ops:["Con la cabecera X-Forwarded-For, que el balanceador añade","Activando PROXY protocol en el balanceador y en el servidor, que antepone la IP original al inicio de la conexión","Con el TTL","No es posible"],
  ok:1, why:"En capa 4 el balanceador no toca el HTTP (que además va cifrado), así que no puede añadir cabeceras. PROXY protocol (de HAProxy, soportado por NLB, Nginx y Envoy) envía los datos de origen en una línea previa. Si solo se activa en un lado, la conexión se rompe."}
]},

{
id:"rd8l2",
titulo:"Balanceadores de carga",
claves:["Capa 4 reparte conexiones TCP/UDP; capa 7 entiende HTTP","Algoritmos: round robin, menos conexiones, hash por IP o por clave","Health checks sacan de rotación a los destinos enfermos"],
pasos:[
 {t:"info", eti:"Dos niveles", h:"Capa 4 frente a capa 7",
  c:`<ul><li><b>Capa 4</b> (NLB de AWS, LoadBalancer de Kubernetes, HAProxy en modo TCP): reparte <b>conexiones</b> sin mirar su contenido. Muy rápido, sirve para cualquier protocolo (bases de datos, gRPC, MQTT).</li>
     <li><b>Capa 7</b> (ALB de AWS, Nginx, Envoy, Ingress): entiende <b>HTTP</b>. Puede enrutar por dominio, ruta o cabecera, terminar TLS, reescribir, añadir cabeceras, reintentar.</li></ul>`},
 {t:"par", p:"Empareja cada algoritmo con su comportamiento",
  pares:[["Round robin","Por turnos: uno a cada servidor"],["Least connections","Al que tenga menos conexiones activas"],["Hash por IP de origen","El mismo cliente va siempre al mismo servidor"],["Ponderado","Más peticiones a los servidores con más peso"]],
  why:"Least connections va mejor cuando las peticiones tienen duraciones muy distintas."},
 {t:"info", eti:"Salud", h:"Health checks",
  c:`<p>El balanceador comprueba periódicamente cada destino (por ejemplo <code>GET /actuator/health</code> cada 10 s). Tras varios fallos seguidos lo <b>saca de rotación</b>; cuando vuelve a responder, lo reincorpora.</p>
     <p>Durante un despliegue, el <b>connection draining</b> (o deregistration delay) deja terminar las peticiones en curso de una instancia antes de retirarla.</p>`},
 {t:"opcion", p:"Quieres enviar <code>/api/*</code> a un grupo de servidores y <code>/</code> a otro, detrás del mismo dominio. ¿Qué balanceador necesitas?",
  ops:["De capa 4","De capa 7","Da igual","Ninguno: DNS"],
  ok:1, why:"Para mirar la ruta hay que entender HTTP."},
 {t:"opcion", p:"Una aplicación guarda la sesión en memoria y los usuarios «pierden la sesión» al azar tras escalar a 3 réplicas. ¿Qué pasa y cuál es la mejor solución?",
  ops:["Un bug del balanceador","Cada petición puede ir a una réplica distinta; lo mejor es sacar la sesión a un almacén compartido (Redis) o usar tokens","Hay que usar capa 4","Bajar a una réplica"],
  ok:1, why:"Las sesiones pegajosas (sticky sessions) lo parchean, pero una aplicación sin estado escala y se recupera mejor."},
 {t:"vf", p:"Un balanceador de capa 4 puede enrutar según la cabecera Host de HTTP.",
  ok:false, why:"Capa 4 no lee el contenido HTTP. Para enrutar por Host o ruta se necesita capa 7."},
 {t:"info", eti:"Nivel sénior", h:"Hashing consistente, timeouts y alta disponibilidad del balanceador",
  c:`<ul><li><b>Hashing consistente</b>: con un hash normal (<code>hash(clave) % N</code>), añadir un servidor cambia el destino de casi todas las claves y vacía todas las cachés. Con un anillo de hash consistente solo se mueve ~1/N de las claves. Lo usan las cachés distribuidas y los balanceadores para afinidad (Maglev, <code>hash … consistent</code> en Nginx).</li>
     <li><b>Timeouts en cadena</b>: el del balanceador debe ser mayor que el de la aplicación, y el del cliente mayor que ambos. Si no, verás 504 mientras el backend sigue trabajando. Y el <i>keep-alive</i> del backend debe durar <b>más</b> que el del balanceador hacia él; si el backend cierra antes, aparecen 502 esporádicos.</li>
     <li><b>Reintentos con presupuesto</b>: reintentar ayuda con fallos sueltos, pero en una caída multiplica la carga. Se limita el porcentaje de reintentos y se usa <i>outlier detection</i> (Envoy) para expulsar un destino que falla.</li>
     <li><b>¿Y quién balancea al balanceador?</b> Dos equipos con una <b>IP virtual</b> que salta de uno a otro con VRRP (keepalived), varias IPs en el DNS o una IP <b>anycast</b> anunciada por BGP desde muchos sitios. En la nube, el balanceador gestionado ya es redundante entre zonas.</li></ul>`},
 {t:"opcion", p:"Una capa de caché de 10 nodos reparte las claves con <code>hash(clave) % 10</code>. Añades un nodo y la base de datos se satura. ¿Por qué, y qué lo evita?",
  ops:["El nodo nuevo es lento; hay que quitarlo","Con % 11 casi todas las claves cambian de nodo y fallan en caché a la vez; el hashing consistente solo mueve una pequeña parte","La base de datos no admite 11 conexiones","Hay que usar round robin"],
  ok:1, why:"Es el clásico «rebalanceo en frío». Con hashing consistente, cada nodo nuevo se queda solo con la parte que le toca del anillo."},
 {t:"hueco", p:"Completa el upstream de Nginx para enviar cada petición al servidor con menos conexiones activas y sacar un servidor tras 3 fallos durante 30 s",
  tpl:"upstream api {\n    ___;\n    server 10.0.11.21:8080 max_fails=3 fail_timeout=___;\n    server 10.0.11.22:8080 ___=3 fail_timeout=30s;\n}",
  banco:["least_conn","30s","max_fails","round_robin","ip_hash","3s"], sol:["least_conn","30s","max_fails"],
  why:"Estos son chequeos <b>pasivos</b> (basados en peticiones reales que fallan). Los chequeos activos periódicos están en Nginx Plus, HAProxy, Envoy y los balanceadores de la nube."}
]},

{
id:"rd8l3",
titulo:"CDN y caché",
claves:["Una CDN sirve contenido desde servidores cercanos al usuario","Cache-Control, ETag y versionado de ficheros controlan qué se cachea y cuánto","También protege el origen: absorbe picos y ataques"],
pasos:[
 {t:"info", eti:"Cerca del usuario", h:"¿Qué es una CDN?",
  c:`<p>Una <b>CDN</b> (CloudFront, Cloudflare, Fastly, Akamai) tiene servidores en cientos de ciudades. El usuario se conecta al más cercano (el <b>edge</b>), que le sirve el contenido desde su caché. Si no lo tiene, lo pide al <b>origen</b> (tu servidor o tu bucket S3) y lo guarda.</p>
     <ul><li>Menos latencia: el contenido está a pocos milisegundos.</li>
     <li>Menos carga en el origen.</li>
     <li>Protección frente a picos y ataques DDoS.</li></ul>`},
 {t:"info", eti:"Controlar la caché", h:"Cabeceras de caché",
  c:`<div class="termbox">Cache-Control: public, max-age=31536000, immutable   <span class="cm"># app.3f9a1c.js: un año</span>
Cache-Control: no-cache                               <span class="cm"># index.html: revalidar siempre</span>
Cache-Control: private, no-store                      <span class="cm"># datos de usuario: no cachear</span>
ETag: "5f3a-19c"                                      <span class="cm"># versión del contenido</span></div>
     <p>Patrón habitual en frontends: los ficheros llevan un <b>hash en el nombre</b> y se cachean para siempre; el <code>index.html</code> no se cachea, y al desplegar apunta a los nuevos nombres.</p>`},
 {t:"par", p:"Empareja cada directiva con su efecto",
  pares:[["max-age=3600","Se puede reutilizar durante una hora"],["no-cache","Se puede guardar pero hay que revalidar antes de usarlo"],["no-store","No guardar nunca"],["private","Solo el navegador, no cachés compartidas"],["ETag","Identificador de versión para revalidar (respuesta 304)"]],
  why:"no-cache no significa «no cachear»: significa «pregunta antes de usarlo». Es una confusión clásica."},
 {t:"opcion", p:"Despliegas un cambio en <code>estilos.css</code> (sin hash en el nombre, max-age de un año) y los usuarios siguen viendo el antiguo. ¿Solución duradera?",
  ops:["Pedir a los usuarios que borren la caché","Añadir un hash de contenido al nombre del fichero en cada build","Quitar la CDN","Usar HTTP/1.1"],
  ok:1, why:"Nombre nuevo = URL nueva = nada que invalidar. Invalidar la CDN a mano es el parche de emergencia."},
 {t:"vf", p:"Cachear en la CDN respuestas de API con datos personales sin <code>private</code> puede mostrar datos de un usuario a otro.",
  ok:true, why:"Un incidente real y grave. Las respuestas personalizadas deben ser private o no-store."},
 {t:"term", p:"Pide solo las cabeceras de <code>https://cdn.miempresa.com/app.3f9a1c.js</code> para comprobar si la CDN lo sirve desde su caché",
  prompt:"pablo@portatil:~$", sol:["curl -I https://cdn.miempresa.com/app.3f9a1c.js","curl --head https://cdn.miempresa.com/app.3f9a1c.js","curl -sI https://cdn.miempresa.com/app.3f9a1c.js","curl -Is https://cdn.miempresa.com/app.3f9a1c.js"],
  salida:`HTTP/2 200
content-type: application/javascript
cache-control: public, max-age=31536000, immutable
age: 5321
x-cache: Hit from cloudfront
via: 1.1 6b2e4c.cloudfront.net (CloudFront)
x-amz-cf-pop: MAD53-P1`,
  pista:"curl con -I, como para cualquier cabecera.",
  why:"<code>x-cache: Hit</code> y <code>age: 5321</code> (segundos en caché) confirman que no llegó al origen. <code>x-amz-cf-pop</code> dice qué edge respondió: MAD es Madrid."},
 {t:"opcion", p:"Tu API devuelve JSON o XML según la cabecera <code>Accept</code>, y a través de la CDN algunos clientes que piden JSON reciben XML. ¿Qué falta?",
  ops:["Un certificado nuevo","Que la respuesta lleve Vary: Accept (o que la CDN incluya Accept en la clave de caché)","Bajar el TTL a 0","Usar HTTP/3"],
  ok:1, why:"La caché guarda por URL; si la respuesta depende de una cabecera, hay que decírselo con <code>Vary</code>. Es el mismo problema con <code>Accept-Encoding</code> o el idioma."}
]}

]});
