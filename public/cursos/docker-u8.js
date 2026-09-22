window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Servidor, DevOps y entrevista",
resumen: "Publicar, desplegar, automatizar, asegurar y contarlo bien el martes",
color: "#15803d",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"u8l1",
titulo:"Registry: publicar tu imagen",
claves:["docker tag + docker push","Tags inmutables (versión o SHA), nunca latest en producción","El rollback es volver al tag anterior"],
pasos:[
 {t:"info", eti:"El flujo", h:"Tu imagen tiene que llegar al servidor de algún modo",
  c:`<p>Construyes la imagen en tu máquina o en el CI. ¿Cómo llega al servidor? A través de un <b>registry</b>.</p>
     <div class="termbox">docker build -t mi-api:1.2.0 .
docker <b>tag</b> mi-api:1.2.0 ghcr.io/pablo/mi-api:1.2.0
docker login ghcr.io
docker <b>push</b> ghcr.io/pablo/mi-api:1.2.0</div>
     <p>Y en el servidor, simplemente:</p>
     <div class="termbox">docker compose pull
docker compose up -d</div>
     <p>El nombre completo de una imagen es <code>registry/usuario/nombre:tag</code>. Si no pones registry, se asume Docker Hub.</p>`},

 {t:"opcion", p:"¿Para qué sirve <code>docker tag</code>?",
  ops:["Para renombrar una imagen o darle un nombre adicional, por ejemplo el del registry donde la vas a publicar",
       "Para borrar la imagen",
       "Para comprimirla",
       "Para firmarla"],
  ok:0,
  why:"No copia nada: crea otro nombre que apunta a la misma imagen. Por eso es instantáneo."},

 {t:"info", eti:"El tema de los tags", h:"Por qué latest es un problema serio",
  c:`<p>Si despliegas <code>mi-api:latest</code>:</p>
     <ul><li>No sabes <b>qué versión</b> está corriendo en producción ahora mismo.</li>
     <li>No puedes hacer <b>rollback</b>, porque no hay a dónde volver.</li>
     <li>Dos servidores pueden acabar con imágenes distintas bajo el mismo nombre.</li></ul>
     <p>La práctica correcta es usar <b>tags inmutables</b>: la versión (<code>1.2.0</code>) o el <b>SHA del commit</b> (<code>sha-9f3c1a2</code>). Ese tag apunta siempre a la misma imagen exacta.</p>
     <div class="nota dato"><b class="tit">La frase</b>«Uso tags inmutables por commit: sé exactamente qué hay desplegado y el rollback es trivial, solo hay que volver al tag anterior.»</div>`},

 {t:"opcion", p:"¿Cómo se hace un rollback de un despliegue con Docker?",
  ops:["Restaurando una copia de seguridad del servidor",
       "Volviendo a desplegar el tag anterior de la imagen: docker compose up -d con la versión previa",
       "Reconstruyendo la imagen del commit anterior",
       "No se puede"],
  ok:1,
  why:"Y es casi instantáneo, porque esa imagen ya está descargada en el servidor. Por eso importan los tags inmutables."},

 {t:"escribe", p:"Escribe el comando que etiqueta la imagen <code>mi-api:1.2.0</code> como <code>ghcr.io/pablo/mi-api:1.2.0</code>",
  sol:["docker tag mi-api:1.2.0 ghcr.io/pablo/mi-api:1.2.0"],
  ph:"docker tag ...",
  pista:"docker tag ORIGEN DESTINO.",
  why:"Origen primero, destino después. Luego <code>docker push</code> con el nombre completo."},

 {t:"info", eti:"Registries", h:"Cuáles existen",
  c:`<ul><li><b>Docker Hub</b> — el público por defecto. Ojo: tiene límites de descargas para usuarios anónimos.</li>
     <li><b>GHCR</b> (GitHub Container Registry) — gratis para repositorios de GitHub, muy cómodo con Actions.</li>
     <li><b>AWS ECR / Google Artifact Registry / Azure ACR</b> — los de las nubes.</li>
     <li><b>Harbor / Nexus</b> — para alojarlo tú en la empresa.</li></ul>
     <p>En todos funcionan igual: <code>login</code>, <code>tag</code>, <code>push</code>, <code>pull</code>.</p>`},

 {t:"vf", p:"Al hacer <code>docker push</code> se suben todas las capas de la imagen, incluso las que el registry ya tiene.",
  ok:false,
  why:"No: solo sube las capas que faltan. Por eso el primer push tarda y los siguientes son rápidos si solo cambió tu código."}
]},

/* =============== U8 L2 =============== */
{
id:"u8l2",
titulo:"Desplegar en un servidor",
claves:["Nunca construir en producción: pull y up","restart: unless-stopped + systemd para sobrevivir a reinicios","docker context permite operar el servidor desde tu máquina"],
pasos:[
 {t:"info", eti:"Instalación", h:"Poner Docker en un servidor Ubuntu",
  c:`<div class="termbox"><span class="cm"># 1. instalar</span>
curl -fsSL https://get.docker.com | sh

<span class="cm"># 2. poder usar docker sin sudo</span>
sudo usermod -aG docker $USER      <span class="cm"># cerrar sesion y volver a entrar</span>

<span class="cm"># 3. que arranque con la maquina</span>
sudo systemctl enable --now docker</div>
     <div class="nota ojo"><b class="tit">Detalle de seguridad</b>Pertenecer al grupo <code>docker</code> equivale a ser root en esa máquina (puedes montar el disco entero en un contenedor). No se reparte a la ligera.</div>`},

 {t:"info", eti:"Las tres formas", h:"Cómo llega tu aplicación al servidor",
  c:`<p><b>A) La sencilla</b> — git pull y construir allí:</p>
     <div class="termbox">ssh usuario@servidor
cd /opt/mi-app && git pull && docker compose up -d --build</div>
     <p>Vale para proyectos pequeños, pero compila en producción: consume CPU y RAM del servidor y no garantiza que despliegues lo probado.</p>
     <p><b>B) La correcta</b> — registry:</p>
     <div class="termbox">ssh usuario@servidor
cd /opt/mi-app && docker compose pull && docker compose up -d</div>
     <p><b>C) La elegante</b> — sin entrar al servidor:</p>
     <div class="termbox">docker context create prod --docker "host=ssh://usuario@servidor"
docker context use prod
docker compose up -d          <span class="cm"># se ejecuta EN EL SERVIDOR</span>
docker context use default</div>`},

 {t:"opcion", p:"¿Por qué no conviene construir la imagen en el servidor de producción?",
  ops:["Porque tarda más",
       "Porque consume recursos del servidor y, sobre todo, no garantiza que lo que despliegas sea exactamente lo que se probó",
       "Porque Docker no lo permite",
       "Porque hace falta Java instalado"],
  ok:1,
  why:"El principio es <b>artefacto inmutable</b>: la misma imagen que pasó los tests es la que llega a producción."},

 {t:"info", eti:"Sobrevivir a reinicios", h:"restart y systemd",
  c:`<p>Dos capas, y conviene mencionar las dos:</p>
     <ul><li><b>restart: unless-stopped</b> en cada servicio: si el contenedor se cae o se reinicia el servidor, Docker lo vuelve a levantar.</li>
     <li><b>Una unidad de systemd</b> que ejecute <code>docker compose up -d</code> al arrancar la máquina, para el stack completo.</li></ul>
     <div class="termbox"><span class="cm"># /etc/systemd/system/mi-app.service</span>
[Unit]
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/mi-app
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target</div>`},

 {t:"opcion", p:"Reinician el servidor. ¿Qué garantiza que tu stack vuelva a levantarse?",
  ops:["Nada, hay que entrar a mano",
       "restart: unless-stopped en los servicios, y una unidad de systemd que ejecute docker compose up -d al arrancar",
       "El healthcheck",
       "El volumen"],
  ok:1,
  why:"Las dos cosas juntas. Es una pregunta muy habitual para perfiles con algo de DevOps."},

 {t:"info", eti:"Logs en el servidor", h:"Que no te llenen el disco",
  c:`<p>Un contenedor que lleva meses corriendo puede generar gigas de logs. Se limita en el compose:</p>
     <div class="termbox">    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"</div>
     <p>Máximo 3 ficheros de 10 MB por servicio: 30 MB y se van rotando. Si no lo pones, el disco se llena tarde o temprano.</p>`},

 {t:"opcion", p:"Un servidor lleva un año en marcha y se ha quedado sin disco. Además de la caché de build, ¿qué sueles mirar?",
  ops:["Los logs de los contenedores, si no tienen rotación configurada",
       "El tamaño de las redes",
       "Los nombres de los contenedores",
       "El fichero .env"],
  ok:0,
  why:"Logs sin rotar + imágenes viejas de despliegues anteriores + caché de build: el trío clásico."}
]},

/* =============== U8 L3 =============== */
{
id:"u8l3",
titulo:"Nginx delante: la arquitectura de producción",
claves:["Un solo puerto público; el resto, red interna","TLS, balanceo y cabeceras los hace el proxy","La API no publica puertos: expone"],
pasos:[
 {t:"info", eti:"El dibujo", h:"Así se despliega de verdad",
  c:`<div class="diag">        Internet
           |  443 / 80   <- unico punto de entrada
      [ nginx ]          red frontend
           |
      [  api  ] x N      en ambas redes, SIN puerto publicado
           |
      [postgres]         red backend (internal), con volumen</div>
     <p>Solo nginx publica puertos. La API se alcanza <b>a través</b> de nginx, y la base de datos solo desde la API.</p>`},

 {t:"opcion", p:"¿Por qué poner nginx delante? Enumera el motivo principal.",
  ops:["Para que la web sea más bonita",
       "Para centralizar TLS/HTTPS, exponer un único puerto público, repartir carga entre varias instancias y gestionar cabeceras y caché",
       "Porque Spring Boot no sabe servir HTTP",
       "Para ahorrar memoria"],
  ok:1,
  why:"Cinco razones en una frase. Si añades «y permite despliegues sin caída cambiando el upstream», mejor todavía."},

 {t:"info", eti:"La configuración", h:"Lo mínimo de un reverse proxy",
  c:`<div class="termbox">upstream api_backend {
    server <b>api</b>:8080;          <span class="cm"># "api" = nombre del servicio en compose</span>
}

server {
    listen 80;
    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}</div>
     <p>Esas cabeceras <code>X-Forwarded-*</code> son importantes: sin ellas, tu aplicación cree que todas las peticiones vienen de nginx y pierde la IP real del cliente.</p>`},

 {t:"opcion", p:"En la configuración de nginx pones <code>server api:8080</code>. ¿De dónde sale ese nombre?",
  ops:["Es fijo en nginx",
       "Es el nombre del servicio en el compose, resuelto por el DNS interno de la red de Docker",
       "Es la IP del servidor",
       "Es el nombre de la imagen"],
  ok:1,
  why:"Todo encaja: el DNS interno que aprendiste en Compose es lo que hace funcionar el proxy sin IPs fijas."},

 {t:"info", eti:"Escalar", h:"Balanceo de carga casi gratis",
  c:`<div class="termbox">docker compose up -d --scale api=3</div>
     <p>Nginx resuelve <code>api</code> y reparte las peticiones entre las tres instancias. Tienes balanceo básico sin configurar nada más.</p>
     <p>Requisitos, que ya conoces: el servicio <code>api</code> no puede tener <code>container_name</code> ni publicar un puerto fijo del host.</p>
     <div class="nota dato"><b class="tit">Alternativa moderna</b>Menciona <b>Traefik</b> o <b>Caddy</b>: detectan los contenedores automáticamente por sus etiquetas y gestionan los certificados de Let's Encrypt solos. Queda muy bien saber que existen.</div>`},

 {t:"vf", p:"En esa arquitectura, la API debe publicar su puerto 8080 con <code>ports:</code> para que nginx la alcance.",
  ok:false,
  why:"No. Nginx la alcanza por la red interna. Publicar la API abriría una puerta trasera que se salta el proxy."},

 {t:"info", eti:"HTTPS", h:"Cómo se resuelve el certificado",
  c:`<p>La respuesta corta que se espera: <b>el certificado se gestiona en el proxy</b>, no en la aplicación.</p>
     <ul><li>Con nginx + <b>certbot</b> (Let's Encrypt), renovando automáticamente.</li>
     <li>O con <b>Traefik/Caddy</b>, que lo hacen solos.</li></ul>
     <p>La aplicación sigue hablando HTTP por dentro; el cifrado termina en el proxy. Eso se llama <b>terminación TLS</b>.</p>`}
]},

/* =============== U8 L4 =============== */
{
id:"u8l4",
titulo:"CI/CD: automatizar el despliegue",
claves:["CI valida cada cambio; CD lo despliega","El pipeline: tests → build → escaneo → push → deploy","La imagen se construye una vez y se promociona entre entornos"],
pasos:[
 {t:"info", eti:"Vocabulario", h:"CI y CD, en una frase cada una",
  c:`<ul><li><b>CI</b> (Integración Continua): cada vez que alguien sube código, se compila y se pasan los tests automáticamente. Si algo falla, se entera enseguida.</li>
     <li><b>CD</b> (Despliegue Continuo): si el CI pasa, el cambio se despliega automáticamente al entorno correspondiente.</li></ul>
     <p>Docker es la pieza que une las dos: el CI produce <b>una imagen</b>, y esa misma imagen es la que se despliega.</p>`},

 {t:"info", eti:"El pipeline", h:"Los pasos, en orden",
  c:`<div class="diag">codigo -> git push -> [CI] tests -> build imagen -> escaneo -> push al registry
                                                                      |
                                        [CD] deploy en servidor <-----+
                                                |
                                          smoke test + monitorizacion</div>
     <p>Un ejemplo en GitHub Actions, resumido:</p>
     <div class="termbox">- run: mvn -B test
- uses: docker/build-push-action@v6
  with:
    push: true
    tags: ghcr.io/pablo/mi-api:sha-\${{ github.sha }}
    cache-from: type=gha          <span class="cm"># reutiliza capas entre ejecuciones</span>
- uses: appleboy/ssh-action@v1    <span class="cm"># deploy por SSH</span>
  with:
    script: cd /opt/app && docker compose pull && docker compose up -d</div>`},

 {t:"orden", p:"Ordena los pasos de un pipeline de CI/CD con Docker",
  items:["Descargar el código (checkout)","Ejecutar los tests","Construir la imagen","Escanear la imagen en busca de vulnerabilidades","Subirla al registry con el tag del commit","Desplegar en el servidor (pull + up -d)","Comprobar que responde (smoke test)"],
  why:"Si te preguntan «¿cómo automatizarías esto?», enumerar estos siete pasos es una respuesta completa."},

 {t:"opcion", p:"¿Qué ventaja tiene que el CI construya la imagen y el servidor solo haga pull?",
  ops:["Es más barato",
       "Se despliega exactamente el artefacto que pasó los tests, y el servidor no gasta recursos compilando",
       "Permite usar más lenguajes",
       "Evita tener que usar Git"],
  ok:1,
  why:"Artefacto inmutable otra vez. Es el concepto central del despliegue moderno."},

 {t:"info", eti:"Promoción", h:"La misma imagen recorre los entornos",
  c:`<p>Lo correcto <b>no</b> es construir una imagen para pruebas y otra para producción. Es construir <b>una</b> y promocionarla:</p>
     <div class="termbox">mi-api:sha-9f3c1a2   ->  desplegada en pruebas
                     ->  si todo va bien, la MISMA se despliega en produccion</div>
     <p>Lo único que cambia entre entornos es la <b>configuración inyectada</b> (variables de entorno y secretos).</p>`},

 {t:"vf", p:"Para producción conviene reconstruir la imagen con la configuración de producción dentro.",
  ok:false,
  why:"No. Se despliega la misma imagen y se le inyecta la configuración al arrancar. Si la reconstruyes, ya no es lo que probaste."},

 {t:"opcion", p:"¿Qué es <code>cache-from: type=gha</code> en un pipeline?",
  ops:["Un antivirus",
       "Reutilizar la caché de capas entre ejecuciones del CI para que el build no empiece de cero cada vez",
       "Un tipo de tag",
       "Una política de reinicio"],
  ok:1,
  why:"Sin caché, cada build del CI vuelve a descargar todas las dependencias. Con ella, los builds bajan de minutos a segundos."}
]},

/* =============== U8 L5 =============== */
{
id:"u8l5",
titulo:"Seguridad: la lista que hay que recitar",
claves:["Usuario no root, base mínima, escaneo, secretos fuera","No montar /var/run/docker.sock","Límites de recursos y puertos mínimos"],
pasos:[
 {t:"info", eti:"La lista", h:"Ocho puntos que debes poder enumerar",
  c:`<ul><li><b>1.</b> Usuario <b>no root</b> en la imagen (<code>USER</code>).</li>
     <li><b>2.</b> Imagen base <b>oficial, mínima y con tag fijo</b>; actualizarla periódicamente.</li>
     <li><b>3.</b> <b>Escanear</b> las imágenes: <code>docker scout cves</code> o Trivy en el CI.</li>
     <li><b>4.</b> <b>Secretos fuera</b> de la imagen y del repositorio.</li>
     <li><b>5.</b> <b>Publicar solo</b> los puertos imprescindibles; base de datos en red interna.</li>
     <li><b>6.</b> <b>Límites</b> de CPU y memoria, para que un contenedor no tumbe el host.</li>
     <li><b>7.</b> Endurecer: <code>--read-only</code>, <code>--cap-drop ALL</code>, <code>--security-opt no-new-privileges</code>.</li>
     <li><b>8.</b> <b>No montar</b> <code>/var/run/docker.sock</code> dentro de un contenedor.</li></ul>`},

 {t:"opcion", p:"¿Por qué es peligroso montar <code>/var/run/docker.sock</code> en un contenedor?",
  ops:["Porque ocupa espacio",
       "Porque ese socket es la API del daemon: quien lo controla puede crear contenedores privilegiados y tomar el control del host",
       "Porque ralentiza la red",
       "Porque no funciona en Windows"],
  ok:1,
  why:"Equivale a dar root del anfitrión. A veces se hace (agentes de CI, Portainer), pero sabiendo el riesgo y limitándolo."},

 {t:"opcion", p:"Te preguntan cómo asegurarías una imagen. Di tres cosas:",
  ops:["Cifrarla, comprimirla y firmarla",
       "Usuario no root, base mínima con tag fijo y escaneo de vulnerabilidades en el CI",
       "Ponerle contraseña, usar latest y publicarla en privado",
       "Aumentar la memoria, usar bind mounts y abrir puertos"],
  ok:1,
  why:"Esas tres son las que espera oír cualquier entrevistador. Si añades «y los secretos nunca dentro», redondeas."},

 {t:"info", eti:"Escanear", h:"Cómo se comprueba si una imagen tiene fallos conocidos",
  c:`<div class="termbox">docker scout cves mi-api:1.2.0
<span class="cm"># o en el CI, con Trivy:</span>
trivy image mi-api:1.2.0 --severity CRITICAL,HIGH</div>
     <p>Te lista las vulnerabilidades conocidas de los paquetes que lleva la imagen. Una imagen alpine tendrá muy pocas; una basada en Ubuntu completo, bastantes más. Otro argumento para las bases mínimas.</p>`},

 {t:"vf", p:"Una imagen construida hace un año pero que no has tocado sigue siendo igual de segura hoy.",
  ok:false,
  why:"No: se van descubriendo vulnerabilidades en los paquetes que lleva dentro. Por eso se reconstruyen y actualizan periódicamente."},

 {t:"info", eti:"Límites", h:"Que un contenedor no tumbe el servidor",
  c:`<div class="termbox">    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 768M</div>
     <p>Y en Java, un detalle importante: la JVM moderna respeta los límites del contenedor, pero conviene ser explícito:</p>
     <div class="termbox">JAVA_OPTS: "-XX:MaxRAMPercentage=75.0"</div>
     <p>Así la JVM usa como máximo el 75% de la memoria <b>del contenedor</b>, dejando margen para el resto del proceso. Sin esto, es fácil ver contenedores Java muriendo con <b>Exited (137)</b>.</p>`},

 {t:"opcion", p:"Tu contenedor Java muere con <code>Exited (137)</code> cada pocas horas. ¿Qué investigas?",
  ops:["El puerto",
       "Memoria: el límite del contenedor y cuánta reserva la JVM (MaxRAMPercentage)",
       "El DNS",
       "El tag de la imagen"],
  ok:1,
  why:"137 = SIGKILL, casi siempre el OOM killer. Ajusta el límite del contenedor y la memoria de la JVM."}
]},

/* =============== U8 L6 =============== */
{
id:"u8l6",
titulo:"Simulacro de entrevista",
claves:["Has repasado las preguntas más frecuentes","Sabes qué decir cuando no sabes algo","Estás listo"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas, como en la entrevista real",
  c:`<p>Estas son las preguntas más frecuentes, sin orden y sin avisar de qué unidad son. Contéstalas mentalmente <b>en voz alta</b> antes de elegir.</p>`},

 {t:"opcion", p:"«Explícame la diferencia entre un contenedor y una máquina virtual.»",
  ops:["El contenedor es una VM más ligera",
       "La VM virtualiza hardware y lleva su propio kernel y SO completo; el contenedor comparte el kernel del anfitrión y solo aísla procesos con namespaces y recursos con cgroups",
       "El contenedor no necesita sistema operativo",
       "La VM es más moderna"],
  ok:1,
  why:"La respuesta completa en una frase. Evita decir solo «es una VM ligera»."},

 {t:"opcion", p:"«¿Qué hace EXPOSE en un Dockerfile?»",
  ops:["Abre el puerto en el host",
       "Solo documenta qué puerto usa la aplicación; para publicarlo hace falta -p o ports:",
       "Crea una red",
       "Expone la imagen en el registry"],
  ok:1,
  why:"Trampa clásica superada."},

 {t:"opcion", p:"«Tengo una imagen de 1 GB. ¿Cómo la reduzco?»",
  ops:["Comprimiéndola con zip",
       "Multi-stage, base alpine o slim, .dockerignore, encadenar RUN limpiando en la misma capa, y medir con docker history",
       "Borrando los logs",
       "Usando latest"],
  ok:1,
  why:"Enumerar cinco medidas concretas es mucho mejor que decir solo «usaría multi-stage»."},

 {t:"opcion", p:"«Mi API no conecta con la base de datos en Compose. ¿Qué miras?»",
  ops:["Reinicio Docker",
       "Si la URL usa localhost en vez del nombre del servicio, si están en la misma red y si la base de datos ya acepta conexiones (healthcheck)",
       "Cambio de imagen de base de datos",
       "Abro el puerto 5432 al exterior"],
  ok:1,
  why:"Las tres causas por orden de frecuencia. Y remata contando el método: ps -a, logs, inspect, exec."},

 {t:"opcion", p:"«¿Qué pasa con los datos cuando borro un contenedor?»",
  ops:["Se guardan automáticamente",
       "Se pierde su capa de escritura: solo sobrevive lo que esté en un volumen o bind mount",
       "Se copian a la imagen",
       "Se mueven al registry"],
  ok:1,
  why:"Y añade: «por eso la base de datos va siempre con un named volume»."},

 {t:"opcion", p:"«¿depends_on espera a que la base de datos esté lista?»",
  ops:["Sí",
       "No: solo ordena el arranque. Para esperar de verdad hace falta un healthcheck con condition: service_healthy, y además la app debería reintentar",
       "Solo con restart: always",
       "Solo en Kubernetes"],
  ok:1,
  why:"La respuesta larga, con los reintentos incluidos, es la que distingue."},

 {t:"opcion", p:"«¿Cómo despliegas y cómo haces rollback?»",
  ops:["Copio los ficheros por FTP",
       "El CI construye la imagen y la sube al registry con un tag inmutable; el servidor hace pull y up -d. El rollback es volver al tag anterior",
       "Hago git pull en el servidor y compilo allí",
       "Reinstalo el servidor"],
  ok:1,
  why:"Menciona artefacto inmutable y tags por commit: son las palabras que buscan."},

 {t:"opcion", p:"«¿Por qué no correr como root dentro del contenedor?»",
  ops:["Consume más memoria",
       "Porque si comprometen la aplicación el atacante hereda root, con más opciones de escapar al host o escribir como root en los volúmenes montados",
       "Porque Docker lo prohíbe",
       "Porque los logs no funcionan"],
  ok:1,
  why:"Y la solución en una línea: crear un usuario y usar USER."},

 {t:"opcion", p:"«¿Qué diferencia hay entre CMD y ENTRYPOINT?»",
  ops:["Ninguna",
       "ENTRYPOINT es el ejecutable fijo; CMD son los argumentos por defecto, y lo que pasas en docker run sustituye al CMD, no al ENTRYPOINT",
       "CMD es más moderno",
       "ENTRYPOINT solo vale para bases de datos"],
  ok:1,
  why:"Y si añades lo de la forma exec y el SIGTERM, te ganas la entrevista."},

 {t:"opcion", p:"«¿Conoces Kubernetes?» — y no lo has usado nunca. ¿Qué contestas?",
  ops:["Digo que sí y improviso",
       "Digo que no lo he usado en producción, pero explico que Compose orquesta en una máquina y Kubernetes en un clúster, con autoescalado, autocuración y rolling updates, y que un pod es la unidad mínima",
       "Digo que no sé nada y cambio de tema",
       "Digo que Kubernetes está obsoleto"],
  ok:1,
  why:"Reconocer el límite y demostrar el modelo mental correcto puntúa muchísimo más que fingir experiencia. Y es verdad."},

 {t:"info", eti:"Lo último", h:"Tres consejos para el martes",
  c:`<ul><li><b>Piensa en voz alta.</b> Cuando te den un problema («no arranca el contenedor»), narra tu método: ps -a, logs, inspect, exec. Valoran el proceso tanto como la solución.</li>
     <li><b>Usa ejemplos tuyos.</b> «Dockericé una API Spring Boot con multi-stage y pasó de 949 MB a 372 MB» vale más que cualquier definición.</li>
     <li><b>Si no sabes algo</b>, di: «No lo he usado en producción, pero lo que entiendo es esto... ¿va por ahí?» Es honesto y demuestra criterio.</li></ul>
     <p>Has terminado el curso. Repasa las lecciones que te costaron, levanta el stack una última vez en la terminal de verdad, y ve tranquilo.</p>`}
]}

]});
