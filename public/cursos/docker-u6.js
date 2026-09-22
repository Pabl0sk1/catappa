window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Docker Compose",
resumen: "Levantar API + base de datos con un solo comando, y entender por qué funciona",
color: "#1668d6",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"u6l1",
titulo:"Por qué existe Compose",
claves:["Compose define varios contenedores en un YAML","Un comando levanta todo el stack","Compose = una máquina; Kubernetes = un clúster"],
pasos:[
 {t:"info", eti:"El problema", h:"Una aplicación real no es un contenedor",
  c:`<p>Tu aplicación de verdad necesita, como mínimo: la <b>API</b>, una <b>base de datos</b> y quizá un <b>proxy</b> o una <b>caché</b>. Cuatro contenedores, con su red, sus volúmenes, sus variables y un orden de arranque.</p>
     <p>Hacerlo a mano sería esto, cada vez:</p>
     <div class="termbox">docker network create mired
docker volume create pgdata
docker run -d --name db --network mired -e POSTGRES_PASSWORD=... -v pgdata:/var/lib/postgresql/data postgres:16-alpine
docker run -d --name api --network mired -e SPRING_DATASOURCE_URL=... -p 8080:8080 mi-api:1.0.0
docker run -d --name adminer --network mired -p 8081:8080 adminer</div>
     <p>Nadie recuerda eso, y menos a las nueve de la noche en producción.</p>`},

 {t:"info", eti:"La solución", h:"Escribirlo una vez en un fichero",
  c:`<p><b>Docker Compose</b> permite describir todo eso en un fichero YAML llamado <code>compose.yml</code>, y levantarlo con:</p>
     <div class="termbox">docker compose up -d</div>
     <p>Ventajas, que son también la respuesta de entrevista:</p>
     <ul><li>Queda <b>documentado</b> y versionado en Git: cualquiera del equipo levanta el entorno idéntico.</li>
     <li>Es <b>declarativo</b>: describes el estado que quieres, no los pasos.</li>
     <li>Un comando para levantar, otro para tirar. Sin dejar restos.</li></ul>`},

 {t:"opcion", p:"¿Cuál es la definición correcta de Docker Compose?",
  ops:["Un sustituto de Docker",
       "Una herramienta para definir y ejecutar aplicaciones de varios contenedores en una máquina, a partir de un fichero YAML",
       "Un orquestador de clústeres",
       "Un registry de imágenes"],
  ok:1,
  why:"Ojo al matiz: <b>en una máquina</b>. Cuando son varias máquinas, ya hablamos de Kubernetes."},

 {t:"opcion", p:"Te preguntan la diferencia entre Compose y Kubernetes. ¿Qué respondes?",
  ops:["Son lo mismo",
       "Compose orquesta contenedores en un solo host; Kubernetes los orquesta en un clúster de varias máquinas, con autoescalado, autocuración y rolling updates",
       "Kubernetes es más antiguo",
       "Compose es para Windows y Kubernetes para Linux"],
  ok:1,
  why:"Y añade el remate: «la imagen Docker es exactamente el mismo artefacto en ambos casos»."},

 {t:"info", eti:"Versiones", h:"docker compose, no docker-compose",
  c:`<p>Detalle que delata si estás al día:</p>
     <ul><li><b>Antiguo</b>: <code>docker-compose</code> (con guion), una herramienta aparte escrita en Python. El fichero empezaba con <code>version: "3.8"</code>.</li>
     <li><b>Actual</b>: <code>docker compose</code> (sin guion), integrado en Docker. El fichero se llama <code>compose.yml</code> y <b>la clave <code>version:</code> está obsoleta</b>: si la pones, te avisa.</li></ul>
     <div class="nota dato"><b class="tit">Si ves un compose con version: "3.8"</b>Puedes comentar: «eso es de la v1; en Compose v2 la clave version ya no se usa». Punto para ti.</div>`},

 {t:"vf", p:"En un <code>compose.yml</code> moderno hay que poner <code>version: \"3.8\"</code> en la primera línea.",
  ok:false,
  why:"Ya no. Está obsoleta desde Compose v2. Se empieza directamente por name o services."},

 {t:"opcion", p:"¿Compose vale para producción?",
  ops:["Nunca",
       "Sí para un solo servidor o entornos pequeños, con restart policies, límites y healthchecks; para alta disponibilidad en varios nodos, Kubernetes",
       "Solo para desarrollo, en ningún caso más",
       "Solo si usas Swarm"],
  ok:1,
  why:"Respuesta matizada y honesta. Muchísimas empresas pequeñas tienen producción en Compose sobre un VPS, y funciona perfectamente."}
]},

/* =============== U6 L2 =============== */
{
id:"u6l2",
titulo:"La estructura del compose.yml",
claves:["services: los contenedores; volumes: y networks: al final","image: usar una imagen ya hecha; build: construir la tuya","ports, environment, restart"],
pasos:[
 {t:"info", eti:"El esqueleto", h:"Tres secciones y ya está",
  c:`<div class="termbox">name: practica-docker      <span class="cm"># nombre del proyecto (prefijo de todo)</span>

<b>services:</b>                  <span class="cm"># los contenedores</span>
  api:
    ...
  db:
    ...

<b>volumes:</b>                   <span class="cm"># almacenamiento persistente</span>
  pgdata:

<b>networks:</b>                  <span class="cm"># redes</span>
  backend:</div>
     <p>El 90% del fichero está dentro de <code>services:</code>. Cada clave de ahí (<code>api</code>, <code>db</code>) es el <b>nombre del servicio</b>, y lo eliges tú.</p>
     <div class="nota"><b class="tit">Importante</b>Ese nombre no es decorativo: es el nombre por el que los contenedores se encontrarán entre ellos en la red. Lo verás en la lección siguiente.</div>`},

 {t:"info", eti:"image o build", h:"Las dos formas de tener imagen",
  c:`<div class="termbox">services:
  db:
    <b>image: postgres:16-alpine</b>        <span class="cm"># usar una imagen ya publicada</span>

  api:
    <b>build: ./app-tareas</b>              <span class="cm"># construir desde MI Dockerfile</span>
    image: app-tareas:1.0.0          <span class="cm"># y etiquetar el resultado asi</span></div>
     <ul><li><code>image:</code> → descarga esa imagen del registry.</li>
     <li><code>build:</code> → construye desde el Dockerfile de esa carpeta. Si además pones <code>image:</code>, le da ese nombre a lo construido.</li></ul>
     <p>Forma larga de build, cuando el Dockerfile no se llama así o está en otro sitio:</p>
     <div class="termbox">    build:
      context: ./app-tareas
      dockerfile: Dockerfile.prod</div>`},

 {t:"opcion", p:"En producción, ¿qué es mejor: <code>build:</code> o <code>image:</code> apuntando al registry?",
  ops:["build, para tener siempre lo último",
       "image con un tag fijo: la imagen se construye en el CI y el servidor solo la descarga",
       "Da igual",
       "build, porque ahorra espacio"],
  ok:1,
  why:"Construir en producción consume recursos del servidor y no garantiza que despliegues lo que probaste. En el servidor: solo pull y up."},

 {t:"info", eti:"Las claves del día a día", h:"ports, environment, restart",
  c:`<div class="termbox">  api:
    image: app-tareas:1.0.0
    <b>ports:</b>
      - "8080:8080"                <span class="cm"># host:contenedor, entre comillas</span>
    <b>environment:</b>
      SPRING_PROFILES_ACTIVE: prod
      SERVER_PORT: "8080"
    <b>restart:</b> unless-stopped     <span class="cm"># que vuelva a levantarse solo</span></div>
     <p>Fíjate: es lo mismo que ya sabías de <code>docker run</code>, pero escrito en YAML.</p>
     <ul><li><code>-p 8080:8080</code> → <code>ports: ["8080:8080"]</code></li>
     <li><code>-e CLAVE=valor</code> → <code>environment:</code></li>
     <li><code>--restart unless-stopped</code> → <code>restart: unless-stopped</code></li></ul>`},

 {t:"par", p:"Empareja el flag de docker run con su equivalente en compose",
  pares:[["-p 8080:80","ports:"],
         ["-e CLAVE=valor","environment:"],
         ["--name","container_name:"],
         ["-v datos:/ruta","volumes:"],
         ["--network mired","networks:"]],
  why:"Compose no es magia: es el mismo docker run escrito de forma declarativa y ordenada."},

 {t:"info", eti:"restart", h:"Las cuatro políticas de reinicio",
  c:`<ul><li><b>no</b> — por defecto, no reinicia nunca.</li>
     <li><b>on-failure</b> — solo si termina con error.</li>
     <li><b>always</b> — siempre, incluso tras reiniciar la máquina.</li>
     <li><b>unless-stopped</b> — como always, salvo si lo paraste tú a mano. <b>Es la que se usa en producción.</b></li></ul>
     <p>Diferencia entre las dos últimas: si tú paras un contenedor y reinicias el servidor, <code>always</code> lo volvería a levantar (ignorando tu decisión) y <code>unless-stopped</code> lo respeta.</p>`},

 {t:"opcion", p:"¿Qué política de reinicio usarías en un servidor de producción?",
  ops:["no","on-failure","unless-stopped","Ninguna, mejor a mano"],
  ok:2,
  why:"unless-stopped: se recupera solo de caídas y reinicios del servidor, pero respeta que tú lo pares a propósito."},

 {t:"hueco", p:"Completa el servicio de base de datos",
  tpl:"services:\n  db:\n    ___: postgres:16-alpine\n    ___:\n      POSTGRES_PASSWORD: secreto\n    ___: unless-stopped",
  banco:["image","environment","restart","ports","build"],
  sol:["image","environment","restart"],
  why:"Imagen ya hecha, sus variables y la política de reinicio: el servicio de base de datos mínimo."}
]},

/* =============== U6 L3 =============== */
{
id:"u6l3",
titulo:"Cómo se hablan los servicios",
claves:["Compose crea una red propia con DNS interno","El host es el NOMBRE DEL SERVICIO, no localhost","Dentro de un contenedor, localhost es él mismo"],
pasos:[
 {t:"info", eti:"El fallo estrella", h:"localhost no es lo que crees",
  c:`<p>Este es <b>el error que más veces te van a pedir diagnosticar</b> en una entrevista.</p>
     <p>Tu API tiene esta configuración y no conecta:</p>
     <div class="termbox">SPRING_DATASOURCE_URL: jdbc:postgresql://<b>localhost</b>:5432/tareas</div>
     <div class="termbox"><span class="cm">org.postgresql.util.PSQLException: Connection to localhost:5432 refused.</span></div>
     <p>¿Por qué? Porque <b>dentro del contenedor de la API, <code>localhost</code> es el propio contenedor de la API</b>. Y ahí no hay ninguna base de datos escuchando.</p>
     <p>Recuerda el namespace de red: cada contenedor tiene su propia pila de red. Su localhost es suyo.</p>`},

 {t:"info", eti:"La solución", h:"El nombre del servicio es el nombre de host",
  c:`<p>Compose crea automáticamente una <b>red privada</b> para el proyecto, con un <b>DNS interno</b>. En esa red, cada servicio es alcanzable <b>por su nombre</b>:</p>
     <div class="termbox">services:
  <b>db:</b>                          <span class="cm">&lt;- este nombre...</span>
    image: postgres:16-alpine

  api:
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://<b>db</b>:5432/tareas   <span class="cm">&lt;- ...se usa aqui</span></div>
     <p>Si renombras el servicio a <code>basedatos</code>, la URL pasa a ser <code>jdbc:postgresql://basedatos:5432/tareas</code>. El nombre del servicio <b>es</b> el nombre de red.</p>`},

 {t:"opcion", p:"En tu compose el servicio se llama <code>db</code> y Postgres escucha en el 5432. ¿Qué URL pones en la API?",
  ops:["jdbc:postgresql://localhost:5432/tareas",
       "jdbc:postgresql://db:5432/tareas",
       "jdbc:postgresql://127.0.0.1:5432/tareas",
       "jdbc:postgresql://172.17.0.2:5432/tareas"],
  ok:1,
  why:"Por el nombre del servicio. Nunca por IP: las IPs cambian cada vez que se recrea el contenedor."},

 {t:"opcion", p:"¿Por qué NO se usa la IP del contenedor en la configuración?",
  ops:["Porque es más largo de escribir",
       "Porque las IPs cambian cada vez que el contenedor se recrea; el nombre siempre funciona",
       "Porque Docker las oculta",
       "Porque las IPs son de pago"],
  ok:1,
  why:"El DNS interno resuelve el nombre a la IP que toque en cada momento. Es la razón de que exista."},

 {t:"info", eti:"Matiz importante", h:"Desde fuera sí es localhost",
  c:`<p>Cuidado con no liarte:</p>
     <ul><li><b>Entre contenedores</b> (API → base de datos): se usa el <b>nombre del servicio</b> y el <b>puerto interno</b>. → <code>db:5432</code></li>
     <li><b>Desde tu Windows</b> (navegador o Postman → API): se usa <b>localhost</b> y el <b>puerto publicado</b>. → <code>localhost:8080</code></li></ul>
     <p>Son dos mundos: dentro de la red de Docker, y fuera.</p>`},

 {t:"opcion", p:"Desde tu navegador quieres abrir la API, que tiene <code>ports: [\"8080:8080\"]</code>. ¿Qué escribes?",
  ops:["http://api:8080","http://localhost:8080","http://db:8080","http://0.0.0.0:8080"],
  ok:1,
  why:"Desde fuera, localhost y el puerto publicado. El nombre <code>api</code> solo existe dentro de la red de Docker."},

 {t:"info", eti:"Aislar la base de datos", h:"Lo que NO debe tener la base de datos",
  c:`<p>Mira este servicio de base de datos:</p>
     <div class="termbox">  db:
    image: postgres:16-alpine
    <span class="cm"># ports:            &lt;- FIJATE: NO publicamos el 5432</span>
    <span class="cm">#   - "5432:5432"</span>
    networks:
      - backend</div>
     <p>La API llega a la base de datos por la red interna, <b>sin necesidad de publicar ningún puerto</b>. Publicar el 5432 significaría exponer tu base de datos al exterior: un fallo de seguridad clásico.</p>
     <div class="nota dato"><b class="tit">Frase de entrevista</b>«La base de datos no publica puertos: vive en la red interna y solo la API la alcanza.»</div>`},

 {t:"vf", p:"Para que la API pueda conectarse a la base de datos, hay que publicar el puerto 5432 con <code>ports:</code>.",
  ok:false,
  why:"No. <code>ports:</code> es solo para acceder desde FUERA (tu máquina). Entre contenedores de la misma red no hace falta publicar nada."},

 {t:"hueco", p:"Completa la URL de conexión sabiendo que el servicio de base de datos se llama <code>db</code>",
  tpl:"SPRING_DATASOURCE_URL: jdbc:postgresql://___:___/tareas",
  banco:["db","5432","localhost","8080"],
  sol:["db","5432"],
  why:"Nombre del servicio + puerto INTERNO. Aunque no esté publicado, dentro de la red se alcanza."}
]},

/* =============== U6 L4 =============== */
{
id:"u6l4",
titulo:"Volúmenes: que los datos no se pierdan",
claves:["Named volume para datos de producción; bind mount para desarrollo","down conserva los volúmenes, down -v los borra","La ruta a persistir la marca la imagen"],
pasos:[
 {t:"info", eti:"El problema", h:"Sin volumen, tu base de datos es un castillo de arena",
  c:`<p>Ya lo sabes: el contenedor escribe en su capa de escritura, y esa capa <b>muere con él</b>.</p>
     <p>Si tu PostgreSQL no tiene volumen, en cuanto recrees el contenedor (un cambio de versión, un <code>docker compose down</code>) <b>pierdes la base de datos entera</b>.</p>`},

 {t:"info", eti:"La solución", h:"Volumen con nombre",
  c:`<div class="termbox">services:
  db:
    image: postgres:16-alpine
    <b>volumes:
      - pgdata:/var/lib/postgresql/data</b>

<b>volumes:
  pgdata:</b>                    <span class="cm">&lt;- hay que declararlo aqui tambien</span></div>
     <p>Se lee: «el volumen <b>pgdata</b> se monta en la carpeta <b>/var/lib/postgresql/data</b> del contenedor».</p>
     <p>Esa ruta no te la inventas: es donde <b>esa imagen concreta</b> guarda sus datos, y está en su documentación. Para MySQL sería <code>/var/lib/mysql</code>.</p>`},

 {t:"opcion", p:"Se te olvida declarar <code>pgdata:</code> en la sección <code>volumes:</code> de abajo. ¿Qué pasa?",
  ops:["Funciona igual",
       "Compose da un error diciendo que el volumen no está definido",
       "Se borra la base de datos",
       "Se crea un bind mount"],
  ok:1,
  why:"Los volúmenes con nombre hay que declararlos en la sección de primer nivel. Es un olvido habitual."},

 {t:"info", eti:"Los dos tipos", h:"Volumen con nombre contra bind mount",
  c:`<div class="termbox">volumes:
  - <b>pgdata</b>:/var/lib/postgresql/data       <span class="cm"># VOLUMEN: lo gestiona Docker</span>
  - <b>./init.sql</b>:/docker-entrypoint-initdb.d/init.sql:ro   <span class="cm"># BIND MOUNT: carpeta mia</span></div>
     <p>¿Cómo se distinguen? Si empieza por <code>./</code> o <code>/</code> es una ruta del host (bind mount). Si es solo un nombre, es un volumen gestionado por Docker.</p>
     <ul><li><b>Volumen</b>: Docker decide dónde guardarlo. Portable, rápido, ideal para <b>datos de producción</b>.</li>
     <li><b>Bind mount</b>: tú eliges la carpeta de tu máquina. Ideal para <b>configuración</b> y para <b>desarrollo</b> (editas en tu editor y el contenedor lo ve al instante).</li></ul>
     <p>El <code>:ro</code> del final significa <b>read-only</b>: el contenedor puede leerlo pero no modificarlo. Buena práctica para ficheros de configuración.</p>`},

 {t:"opcion", p:"Quieres que el contenedor de nginx use tu fichero de configuración local y no pueda modificarlo. ¿Cómo lo montas?",
  ops:["- nginx.conf:/etc/nginx/nginx.conf",
       "- ./nginx.conf:/etc/nginx/nginx.conf:ro",
       "- /etc/nginx/nginx.conf:./nginx.conf",
       "- nginxconf:/etc/nginx:rw"],
  ok:1,
  why:"Ruta local (./), ruta dentro del contenedor, y :ro para solo lectura. El orden es siempre origen:destino."},

 {t:"info", eti:"El comando peligroso", h:"down contra down -v",
  c:`<div class="termbox">docker compose down       <span class="cm"># borra contenedores y redes. LOS DATOS SE QUEDAN</span>
docker compose down <b>-v</b>    <span class="cm"># borra ADEMAS los volumenes: ADIOS DATOS</span></div>
     <p>Esta diferencia es pregunta de entrevista <b>y</b> causa de desastres reales.</p>
     <p>Regla: <code>down</code> es seguro y reversible. <code>down -v</code> es para empezar de cero a propósito (por ejemplo, cuando quieres que se vuelva a ejecutar el <code>init.sql</code>).</p>`},

 {t:"opcion", p:"Has hecho <code>docker compose down</code> y vuelves a hacer <code>up -d</code>. ¿Siguen tus datos?",
  ops:["No, se borró todo","Sí: down no toca los volúmenes","Depende de la imagen","Solo si usaste -v"],
  ok:1,
  why:"Por eso puedes apagar el entorno cada noche sin perder nada. Lo que borra los datos es el -v."},

 {t:"vf", p:"<code>docker compose down -v</code> es un comando seguro para ejecutar en producción.",
  ok:false,
  why:"Es exactamente lo contrario: borra los volúmenes, es decir, los datos. En producción, jamás sin estar muy seguro."},

 {t:"info", eti:"Truco útil", h:"Cargar datos iniciales",
  c:`<p>La imagen de PostgreSQL ejecuta automáticamente cualquier <code>.sql</code> que encuentre en <code>/docker-entrypoint-initdb.d/</code>, pero <b>solo la primera vez</b>, cuando el volumen está vacío:</p>
     <div class="termbox">    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro</div>
     <p>Si cambias el <code>init.sql</code> y no ves los cambios, es porque el volumen ya existe: hay que hacer <code>down -v</code> para que vuelva a ejecutarse.</p>`}
]},

/* =============== U6 L5 =============== */
{
id:"u6l5",
titulo:"depends_on y healthcheck",
claves:["depends_on solo ordena el arranque, no espera a que esté lista","condition: service_healthy sí espera","El healthcheck lo define el servicio del que dependes"],
pasos:[
 {t:"info", eti:"La trampa", h:"«Arrancado» no es «listo»",
  c:`<p>Escribes esto y parece razonable:</p>
     <div class="termbox">  api:
    depends_on:
      - db</div>
     <p>Y aun así, tu API se cae al arrancar con «connection refused».</p>
     <p>¿Por qué? Porque <code>depends_on</code> en su forma simple solo garantiza <b>el orden de arranque</b>: primero se pone en marcha el contenedor de la base de datos, y a continuación el de la API. Pero PostgreSQL <b>tarda unos segundos</b> en estar listo para aceptar conexiones. Tu API llega antes y se encuentra la puerta cerrada.</p>`},

 {t:"opcion", p:"«¿<code>depends_on</code> garantiza que la base de datos esté lista?» ¿Qué respondes?",
  ops:["Sí, para eso está",
       "No: solo garantiza el orden de arranque; para esperar a que esté lista hace falta un healthcheck con condition: service_healthy",
       "Sí, si pones restart: always",
       "Solo en Kubernetes"],
  ok:1,
  why:"Esta pregunta aparece constantemente. Contestarla bien te sitúa por encima de la mayoría."},

 {t:"info", eti:"La solución", h:"healthcheck + condition: service_healthy",
  c:`<div class="termbox">  db:
    image: postgres:16-alpine
    <b>healthcheck:</b>
      test: ["CMD-SHELL", "pg_isready -U tareas_user -d tareas"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  api:
    <b>depends_on:
      db:
        condition: service_healthy</b></div>
     <p>Ahora Compose <b>espera</b> a que el healthcheck de <code>db</code> pase antes de arrancar la API. En la salida verás literalmente <code>Container db Healthy</code> antes de <code>Container api Started</code>.</p>
     <p><code>pg_isready</code> es una herramienta que trae la propia imagen de Postgres y responde cuando acepta conexiones.</p>`},

 {t:"par", p:"Empareja cada parámetro del healthcheck con su significado",
  pares:[["test","El comando que comprueba si está sano"],
         ["interval","Cada cuánto se repite la comprobación"],
         ["retries","Cuántos fallos seguidos antes de declararlo enfermo"],
         ["start_period","Tiempo de cortesía inicial mientras arranca"]],
  why:"<code>start_period</code> es clave con Spring Boot: si tarda 30 segundos en arrancar, sin ese margen lo marcaría como enfermo desde el principio."},

 {t:"opcion", p:"Tu API Spring Boot tarda 30 segundos en arrancar y Compose la marca como <code>unhealthy</code> nada más levantarla. ¿Qué ajustas?",
  ops:["El interval a 1s","El start_period, para darle margen de arranque","El puerto","Quitar el healthcheck"],
  ok:1,
  why:"<code>start_period: 45s</code>, por ejemplo. Durante ese tiempo los fallos no cuentan."},

 {t:"info", eti:"La otra solución", h:"Reintentos en la aplicación",
  c:`<p>Hay una segunda respuesta, y darla te hace parecer más experimentado:</p>
     <p>Aunque uses healthchecks, <b>la aplicación debería saber reintentar la conexión</b>. En producción real la base de datos puede reiniciarse en cualquier momento y tu API no se va a recrear por eso.</p>
     <div class="nota dato"><b class="tit">Respuesta completa</b>«Uso <code>condition: service_healthy</code> para el arranque, pero además la aplicación reintenta la conexión: en producción la dependencia puede caerse en cualquier momento, no solo al arrancar.»</div>`},

 {t:"vf", p:"Aunque uses <code>condition: service_healthy</code>, sigue siendo buena idea que la app reintente conectarse.",
  ok:true,
  why:"Sí. El healthcheck resuelve el arranque; los reintentos resuelven la vida entera del servicio."},

 {t:"hueco", p:"Completa para que la API espere a que la base de datos esté realmente lista",
  tpl:"  api:\n    depends_on:\n      db:\n        ___: service_healthy",
  banco:["condition","restart","status","health"],
  sol:["condition"],
  why:"<code>condition: service_healthy</code>. Existen también service_started (el comportamiento antiguo) y service_completed_successfully (para tareas que terminan, como migraciones)."}
]},

/* =============== U6 L6 =============== */
{
id:"u6l6",
titulo:"Variables, .env y entornos",
claves:["Compose lee .env automáticamente y sustituye ${VARIABLE}",".env nunca se sube al repositorio","Varios ficheros -f para dev y producción"],
pasos:[
 {t:"info", eti:"Variables", h:"No escribas contraseñas dentro del compose",
  c:`<p>Esto está mal:</p>
     <div class="termbox">    environment:
      POSTGRES_PASSWORD: admin123    <span class="cm">&lt;- en el fichero que subes a Git</span></div>
     <p>Compose sustituye automáticamente <code>\${VARIABLE}</code> por su valor:</p>
     <div class="termbox">    environment:
      POSTGRES_PASSWORD: <b>\${POSTGRES_PASSWORD}</b></div>
     <p>Y los valores se ponen en un fichero llamado <code>.env</code>, en la misma carpeta, que Compose lee <b>solo</b>:</p>
     <div class="termbox"><span class="cm"># .env</span>
POSTGRES_DB=tareas
POSTGRES_USER=tareas_user
POSTGRES_PASSWORD=tareas_pass
API_PORT=8080</div>`},

 {t:"opcion", p:"¿Qué fichero se sube al repositorio de Git?",
  ops:[".env con los valores reales",
       ".env.example con las claves pero sin valores, y el .env real en el .gitignore",
       "Los dos",
       "Ninguno"],
  ok:1,
  why:"El .env.example documenta qué variables hacen falta. Los valores reales nunca entran en el repositorio."},

 {t:"info", eti:"Valores por defecto", h:"La sintaxis con dos puntos y guion",
  c:`<div class="termbox">    ports:
      - "<b>\${API_PORT:-8080}</b>:8080"</div>
     <p>Se lee: «usa <code>API_PORT</code>; si no existe, usa <code>8080</code>». Así el compose funciona aunque falte el <code>.env</code>.</p>
     <p>Y como las variables se resuelven al ejecutar, puedes cambiar el puerto sin tocar ningún fichero:</p>
     <div class="termbox">$env:API_PORT=9090 ; docker compose up -d</div>`},

 {t:"opcion", p:"¿Qué hace <code>\${API_PORT:-8080}</code> si la variable API_PORT no está definida?",
  ops:["Falla","Usa 8080 como valor por defecto","Deja el puerto vacío","Usa el puerto 80"],
  ok:1,
  why:"Valor por defecto. Muy útil para que el proyecto arranque «de fábrica» aunque no hayas creado el .env."},

 {t:"info", eti:"Varios entornos", h:"Componer ficheros con -f",
  c:`<p>Compose puede fusionar varios ficheros; el último gana:</p>
     <div class="termbox">docker compose -f compose.yml -f compose.prod.yml up -d</div>
     <p>El patrón habitual:</p>
     <ul><li><b>compose.yml</b> — lo común a todos los entornos.</li>
     <li><b>compose.override.yml</b> — desarrollo. <b>Se aplica solo, sin poner -f</b>: si existe ese fichero, Compose lo fusiona automáticamente.</li>
     <li><b>compose.prod.yml</b> — producción: sin bind mounts, con límites de recursos, imagen del registry en vez de build.</li></ul>`},

 {t:"vf", p:"Si existe un fichero <code>compose.override.yml</code>, Compose lo aplica automáticamente sobre <code>compose.yml</code>.",
  ok:true,
  why:"Sí, sin que tengas que indicarlo. Por eso el entorno de desarrollo suele «funcionar solo» y en el servidor se usa -f explícito."},

 {t:"info", eti:"Perfiles", h:"Servicios que no siempre quieres",
  c:`<div class="termbox">  adminer:
    image: adminer
    <b>profiles: ["tools"]</b></div>
     <p>Ese servicio <b>no arranca</b> con un <code>docker compose up -d</code> normal. Solo si lo pides:</p>
     <div class="termbox">docker compose --profile tools up -d</div>
     <p>Ideal para herramientas de desarrollo (clientes de base de datos, paneles) que no deben acabar en producción por descuido.</p>`},

 {t:"opcion", p:"¿Dónde guardarías la contraseña de producción de la base de datos?",
  ops:["En el compose.yml",
       "En el .env del repositorio",
       "Fuera del repositorio: en el gestor de secretos del entorno, en los secrets del CI o en Docker secrets",
       "En un comentario del Dockerfile"],
  ok:2,
  why:"Regla general: un secreto nunca viaja en un fichero versionado ni dentro de una imagen."}
]},

/* =============== U6 L7 =============== */
{
id:"u6l7",
titulo:"Los comandos de Compose",
claves:["up -d --build, ps, logs -f, exec, down","config valida el YAML","--scale para varias instancias"],
pasos:[
 {t:"info", eti:"Los que usarás", h:"Seis comandos y te defiendes",
  c:`<div class="termbox">docker compose up -d           <span class="cm"># levantar todo en segundo plano</span>
docker compose up -d --build   <span class="cm"># reconstruyendo las imagenes antes</span>
docker compose ps              <span class="cm"># estado de los servicios</span>
docker compose logs -f api     <span class="cm"># logs de un servicio, en vivo</span>
docker compose exec api sh     <span class="cm"># entrar en un servicio</span>
docker compose down            <span class="cm"># parar y limpiar (sin tocar datos)</span></div>
     <p>Todos se ejecutan <b>desde la carpeta donde está el compose.yml</b>. Si estás en otra carpeta, usa <code>-f ruta/compose.yml</code>.</p>`},

 {t:"escribe", p:"Escribe el comando que levanta todo el stack en segundo plano reconstruyendo las imágenes",
  sol:["docker compose up -d --build","docker compose up --build -d"],
  ph:"docker compose ...",
  pista:"up, el flag de segundo plano y el de reconstruir.",
  why:"<code>docker compose up -d --build</code>. Sin --build, si cambiaste el código, Compose reutiliza la imagen vieja y te vuelves loco."},

 {t:"escribe", p:"Escribe el comando que muestra en vivo los logs del servicio <code>api</code>",
  sol:["docker compose logs -f api","docker compose logs --follow api","docker compose logs -f  api"],
  ph:"docker compose ...",
  pista:"logs + el flag de seguir + el nombre del servicio.",
  why:"Sin nombre de servicio te muestra los de todos mezclados y coloreados, que también es útil al arrancar."},

 {t:"info", eti:"Diferencia fina", h:"exec contra run",
  c:`<ul><li><code>docker compose <b>exec</b> api sh</code> — entra en el contenedor que <b>ya está corriendo</b>.</li>
     <li><code>docker compose <b>run</b> --rm api sh</code> — crea un contenedor <b>nuevo</b> de ese servicio, para una tarea puntual, y lo borra al salir.</li></ul>
     <p><code>run</code> es lo que se usa para lanzar migraciones o comandos de mantenimiento sin tocar el servicio en marcha.</p>`},

 {t:"opcion", p:"Quieres abrir una shell en la API que está levantada ahora mismo. ¿Cuál?",
  ops:["docker compose run api sh","docker compose exec api sh","docker compose start api sh","docker run api sh"],
  ok:1,
  why:"exec entra en el que corre. run crearía otro contenedor distinto."},

 {t:"info", eti:"Escalar", h:"--scale y sus dos condiciones",
  c:`<div class="termbox">docker compose up -d --scale api=3</div>
     <p>Levanta <b>tres instancias</b> del servicio api. Pero solo funciona si ese servicio cumple dos condiciones:</p>
     <ul><li><b>Sin <code>container_name</code></b>: los nombres son únicos, no puede haber tres iguales.</li>
     <li><b>Sin puerto de host fijo</b>: tres contenedores no pueden ocupar el mismo 8080 de tu máquina.</li></ul>
     <p>En producción el tráfico se reparte con un reverse proxy (nginx) delante, que es lo que verás en la última unidad.</p>`},

 {t:"opcion", p:"Haces <code>--scale api=3</code> y falla con un error de puerto. ¿Por qué?",
  ops:["Falta memoria",
       "El servicio publica un puerto fijo del host: tres contenedores no pueden ocupar el mismo puerto",
       "La imagen no soporta escalado",
       "Hay que usar Kubernetes"],
  ok:1,
  why:"Quita el <code>ports:</code> fijo (y el container_name) y pon un proxy delante que reparta."},

 {t:"orden", p:"Ordena una sesión de trabajo típica con Compose",
  items:["docker compose config   (validar el YAML)","docker compose up -d --build   (levantar)","docker compose ps   (comprobar que están healthy)","docker compose logs -f api   (mirar el arranque)","docker compose down   (recoger al terminar)"],
  why:"Esa es la rutina. Si el martes te dicen «levanta esto», sale sola."},

 {t:"info", eti:"Ya tienes el stack", h:"Lo que sabes hacer ahora",
  c:`<p>Con esta unidad puedes escribir, de memoria, un compose con API + base de datos que:</p>
     <ul><li>Construye tu imagen o usa una del registry.</li>
     <li>Conecta los servicios por nombre en una red privada.</li>
     <li>Persiste los datos en un volumen.</li>
     <li>Espera a que la base de datos esté sana antes de arrancar la API.</li>
     <li>Saca las contraseñas a un <code>.env</code>.</li></ul>
     <p>Eso es exactamente lo que suele pedirse en un ejercicio de entrevista.</p>`}
]}

]});
