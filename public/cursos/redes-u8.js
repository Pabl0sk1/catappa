window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Balanceo, proxies y CDN",
resumen: "Proxy directo e inverso, balanceadores de capa 4 y 7, algoritmos, health checks, CDN y caché",
nivel: "Avanzado",
color: "#3a9fc6",
lecciones: [

{
id:"rd8l1",
titulo:"Proxy directo e inverso",
claves:["Proxy directo: actúa en nombre de los clientes (salida)","Proxy inverso: actúa en nombre de los servidores (entrada)","Nginx, HAProxy, Envoy y Traefik son proxies inversos habituales"],
pasos:[
 {t:"info", eti:"Intermediarios", h:"Dos tipos de proxy",
  c:`<div class="diag">PROXY DIRECTO (forward)
  empleados --> [proxy de la empresa] --> internet
  el servidor ve la IP del proxy, no la de cada empleado

PROXY INVERSO (reverse)
  internet --> [nginx] --> app-1, app-2, app-3
  el cliente cree que habla con nginx; no ve los servidores de detras</div>
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
  ok:true, why:"El cliente solo ve el proxy. Esto permite cambiar, escalar o reemplazar servidores sin que se note."}
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
  ok:false, why:"Capa 4 no lee el contenido HTTP. Para enrutar por Host o ruta se necesita capa 7."}
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
ETag: "5f3a-19c"                                      <span class="cm"># version del contenido</span></div>
     <p>Patrón habitual en frontends: los ficheros llevan un <b>hash en el nombre</b> y se cachean para siempre; el <code>index.html</code> no se cachea, y al desplegar apunta a los nuevos nombres.</p>`},
 {t:"par", p:"Empareja cada directiva con su efecto",
  pares:[["max-age=3600","Se puede reutilizar durante una hora"],["no-cache","Se puede guardar pero hay que revalidar antes de usarlo"],["no-store","No guardar nunca"],["private","Solo el navegador, no cachés compartidas"],["ETag","Identificador de versión para revalidar (respuesta 304)"]],
  why:"no-cache no significa «no cachear»: significa «pregunta antes de usarlo». Es una confusión clásica."},
 {t:"opcion", p:"Despliegas un cambio en <code>estilos.css</code> (sin hash en el nombre, max-age de un año) y los usuarios siguen viendo el antiguo. ¿Solución duradera?",
  ops:["Pedir a los usuarios que borren la caché","Añadir un hash de contenido al nombre del fichero en cada build","Quitar la CDN","Usar HTTP/1.1"],
  ok:1, why:"Nombre nuevo = URL nueva = nada que invalidar. Invalidar la CDN a mano es el parche de emergencia."},
 {t:"vf", p:"Cachear en la CDN respuestas de API con datos personales sin <code>private</code> puede mostrar datos de un usuario a otro.",
  ok:true, why:"Un incidente real y grave. Las respuestas personalizadas deben ser private o no-store."}
]}

]});
