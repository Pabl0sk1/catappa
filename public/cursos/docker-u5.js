window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "YAML sin dolor",
resumen: "El idioma de Compose, Kubernetes y GitHub Actions, en tres lecciones",
color: "#0f766e",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"u5l1",
titulo:"Qué es YAML y cómo se escribe",
claves:["YAML representa mapas, listas y valores","La indentación es SIEMPRE con espacios, nunca tabuladores","clave: valor, con espacio obligatorio tras los dos puntos"],
pasos:[
 {t:"info", eti:"Para qué", h:"Vas a escribirlo todos los días",
  c:`<p><b>YAML</b> es un formato para escribir datos de forma legible. Lo usan:</p>
     <ul><li><b>Docker Compose</b> (<code>compose.yml</code>) — la siguiente unidad</li>
     <li><b>Kubernetes</b> (todos sus manifiestos)</li>
     <li><b>GitHub Actions</b> (los pipelines de CI/CD)</li>
     <li><b>Spring Boot</b> (<code>application.yml</code>)</li></ul>
     <p>Media hora aquí te ahorra horas de errores raros después.</p>`},

 {t:"info", eti:"Lo básico", h:"Clave y valor",
  c:`<div class="termbox">nombre: mi-api
puerto: 8080
activo: true</div>
     <p>Una clave, dos puntos, <b>un espacio</b> y el valor. Ese espacio después de los dos puntos <b>es obligatorio</b>: <code>nombre:mi-api</code> no es válido.</p>
     <p>YAML entiende tipos automáticamente: <code>8080</code> es un número, <code>true</code> un booleano, <code>mi-api</code> un texto.</p>`},

 {t:"opcion", p:"¿Cuál de estas líneas es válida en YAML?",
  ops:["puerto:8080","puerto : 8080","puerto: 8080","puerto = 8080"],
  ok:2,
  why:"Dos puntos pegados a la clave y un espacio antes del valor. Es la forma canónica."},

 {t:"info", eti:"Anidar", h:"La indentación crea la jerarquía",
  c:`<div class="termbox">servidor:
  host: localhost
  puerto: 8080
  ssl:
    activo: false
    certificado: /etc/ssl/cert.pem</div>
     <p>Lo que está indentado <b>pertenece</b> a la clave de arriba. Aquí <code>host</code> y <code>puerto</code> están dentro de <code>servidor</code>, y <code>activo</code> está dentro de <code>ssl</code>.</p>
     <div class="nota ojo"><b class="tit">LA regla de YAML</b>La indentación se hace <b>solo con espacios</b>. Los <b>tabuladores están prohibidos</b> y dan un error críptico: «found character that cannot start any token». Es el error número uno del mundo YAML.</div>
     <p>Configura tu editor: «insertar espacios en lugar de tabulador», 2 espacios.</p>`},

 {t:"opcion", p:"Un compañero te enseña este error: «yaml: line 7: found character that cannot start any token». ¿Qué le dices?",
  ops:["Que le falta una comilla",
       "Que hay un tabulador en esa línea: YAML solo admite espacios",
       "Que el fichero está corrupto",
       "Que le falta la clave version"],
  ok:1,
  why:"Ese mensaje concreto es casi siempre un tabulador. Saber identificarlo de memoria te hace quedar muy bien."},

 {t:"vf", p:"En YAML puedes mezclar tabuladores y espacios mientras seas consistente.",
  ok:false,
  why:"No. Los tabuladores están prohibidos, sin excepciones. Solo espacios."},

 {t:"info", eti:"Listas", h:"Guion y espacio",
  c:`<div class="termbox">puertos:
  - "8080:8080"
  - "9090:9090"

<span class="cm"># forma equivalente en una linea</span>
puertos: ["8080:8080", "9090:9090"]</div>
     <p>Cada elemento empieza con <code>-</code> seguido de un espacio. Los dos formatos son idénticos para el programa que los lee; el primero es más legible.</p>`},

 {t:"hueco", p:"Completa la lista de puertos: falta la marca de elemento de lista",
  tpl:"ports:\n  ___ \"8080:8080\"\n  - \"9090:9090\"",
  banco:["-","*",">","|"],
  sol:["-"],
  why:"Guion y espacio. Es la marca de elemento de lista en YAML."},

 {t:"opcion", p:"¿Cuántos espacios se usan por nivel de indentación por convención?",
  ops:["1","2","4 obligatoriamente","8"],
  ok:1,
  why:"Dos espacios es lo habitual en Compose y Kubernetes. Lo que importa de verdad es ser coherente en todo el fichero."}
]},

/* =============== U5 L2 =============== */
{
id:"u5l2",
titulo:"Comillas, listas de objetos y anclas",
claves:['Entrecomilla puertos y versiones: "8080:80"','Una lista de objetos empieza cada bloque con -','&ancla define y *ancla reutiliza'],
pasos:[
 {t:"info", eti:"Comillas", h:"Cuándo hacen falta (y por qué)",
  c:`<p>YAML intenta adivinar el tipo, y a veces se equivoca a tu favor... o en tu contra:</p>
     <div class="termbox">version: 3.9        <span class="cm"># lo lee como NUMERO 3.9</span>
version: "3.9"      <span class="cm"># lo lee como TEXTO "3.9"  &lt;- correcto</span>

puerto: 22:22       <span class="cm"># puede interpretarse raro</span>
puerto: "22:22"     <span class="cm"># texto, sin sorpresas      &lt;- correcto</span>

activo: yes         <span class="cm"># en YAML 1.1 esto es TRUE, no la palabra "yes"</span>
activo: "yes"       <span class="cm"># texto</span>

clave: 012345       <span class="cm"># numero, se come el cero de delante</span>
clave: "012345"     <span class="cm"># texto</span></div>
     <p>Regla práctica: <b>entrecomilla siempre los puertos, las versiones y cualquier cosa que solo sea texto aunque parezca número</b>.</p>`},

 {t:"opcion", p:"¿Por qué en Compose se escribe <code>- \"8080:80\"</code> con comillas?",
  ops:["Por estética",
       "Para que YAML lo trate como texto y no intente interpretar los dos puntos como otra cosa",
       "Porque lo exige Docker",
       "Para que funcione en Windows"],
  ok:1,
  why:"Es texto con dos puntos dentro, justo el carácter que YAML usa para las claves. Con comillas no hay ambigüedad."},

 {t:"info", eti:"Listas de objetos", h:"Lo que verás en Kubernetes y GitHub Actions",
  c:`<div class="termbox">servicios:
  - nombre: api
    puerto: 8080
  - nombre: db
    puerto: 5432</div>
     <p>Cada <code>-</code> abre un objeto nuevo. Las claves siguientes del mismo objeto se alinean <b>con la primera</b>, sin el guion.</p>
     <p>Léelo así: «la lista <b>servicios</b> tiene dos elementos; el primero es un objeto con nombre <i>api</i> y puerto 8080».</p>`},

 {t:"opcion", p:"¿Cuántos elementos tiene esta lista?<br><code>pasos:<br>&nbsp;&nbsp;- nombre: a<br>&nbsp;&nbsp;&nbsp;&nbsp;valor: 1<br>&nbsp;&nbsp;- nombre: b<br>&nbsp;&nbsp;&nbsp;&nbsp;valor: 2</code>",
  ops:["1","2","4","Ninguno, es inválido"],
  ok:1,
  why:"Dos guiones, dos elementos. Cada uno con dos claves dentro."},

 {t:"info", eti:"Texto largo", h:"Los símbolos | y >",
  c:`<div class="termbox">literal: |
  Esta linea y
  esta otra conservan
  los saltos de linea.

plegado: >
  Estas lineas se
  unen en una sola
  separadas por espacios.</div>
     <p><b>|</b> conserva los saltos de línea (útil para scripts). <b>&gt;</b> los convierte en espacios (útil para textos largos). Los verás en GitHub Actions para escribir varios comandos seguidos.</p>`},

 {t:"info", eti:"Anclas", h:"Reutilizar bloques con & y *",
  c:`<div class="termbox">x-comun: <b>&comun</b>
  restart: unless-stopped
  networks: [backend]

services:
  api:
    <b>&lt;&lt;: *comun</b>
    image: mi-api:1.0
  worker:
    <b>&lt;&lt;: *comun</b>
    image: mi-worker:1.0</div>
     <ul><li><code>&amp;comun</code> pone nombre a un bloque (lo "ancla").</li>
     <li><code>*comun</code> lo referencia.</li>
     <li><code>&lt;&lt;:</code> fusiona ese bloque dentro del actual.</li></ul>
     <p>No es obligatorio saber usarlo, pero sí <b>reconocerlo</b> cuando lo veas en un compose ajeno.</p>`},

 {t:"par", p:"Empareja cada símbolo de YAML con su función",
  pares:[["-","Elemento de una lista"],
         ["&nombre","Define un ancla reutilizable"],
         ["*nombre","Referencia un ancla"],
         ["|","Texto multilínea conservando saltos"],
         ["#","Comentario"]],
  why:"Con esto puedes leer cualquier YAML que te pongan delante sin bloquearte."},

 {t:"vf", p:"Si repites dos veces la misma clave en un YAML, el programa avisa con un error.",
  ok:false,
  why:"Normalmente NO avisa: se queda con la última en silencio. Es una fuente clásica de horas perdidas depurando."}
]},

/* =============== U5 L3 =============== */
{
id:"u5l3",
titulo:"Encuentra el error",
claves:["docker compose config valida el YAML y te da la línea","Los 5 errores clásicos: tabulador, indentación, espacio, comillas, clave duplicada"],
pasos:[
 {t:"info", eti:"Tu validador", h:"No adivines: valida",
  c:`<p>Antes de perder media hora, usa el validador que ya tienes:</p>
     <div class="termbox">docker compose config</div>
     <p>Si el YAML está mal, te dice <b>la línea exacta</b>. Si está bien, te imprime la configuración final ya resuelta (con las variables sustituidas), que además sirve para comprobar que las variables se están aplicando.</p>`},

 {t:"escribe", p:"Escribe el comando que valida el fichero compose y muestra la configuración final",
  sol:["docker compose config"],
  ph:"docker ...",
  pista:"compose + el sustantivo «configuración» en inglés.",
  why:"<code>docker compose config</code>. Que lo uses antes de depurar a ciegas dice mucho de ti."},

 {t:"opcion", p:"Encuentra el error:<br><code>services:<br>&nbsp;&nbsp;api:<br>&nbsp;&nbsp;&nbsp;&nbsp;image:mi-api:1.0</code>",
  ops:["Falta el espacio después de <code>image:</code>",
       "Falta una lista",
       "La indentación está mal",
       "No hay error"],
  ok:0,
  why:"<code>image:mi-api:1.0</code> sin espacio. Debe ser <code>image: mi-api:1.0</code>."},

 {t:"opcion", p:"Encuentra el error:<br><code>services:<br>&nbsp;&nbsp;api:<br>&nbsp;&nbsp;&nbsp;&nbsp;image: mi-api:1.0<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ports:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- \"8080:8080\"</code>",
  ops:["Faltan comillas",
       "<code>ports</code> está indentado de más: debería estar al mismo nivel que <code>image</code>",
       "Falta la clave version",
       "No hay error"],
  ok:1,
  why:"<code>ports</code> e <code>image</code> son hermanos: mismo nivel de indentación. Si lo indentas más, YAML cree que es parte del valor anterior y falla."},

 {t:"opcion", p:"Encuentra el error:<br><code>environment:<br>&nbsp;&nbsp;&nbsp;&nbsp;POSTGRES_PASSWORD: admin</code><br>...sabiendo que esa línea indentada usa un TABULADOR",
  ops:["El tabulador: YAML solo admite espacios",
       "La contraseña es muy corta",
       "Falta el guion",
       "environment no existe"],
  ok:0,
  why:"Y el mensaje que verás será «found character that cannot start any token». Cámbialo por espacios y listo."},

 {t:"orden", p:"Ordena los pasos para depurar un compose que no arranca",
  items:["docker compose config  (¿el YAML es válido?)","Leer la línea que indica el error y corregirla","docker compose up -d","docker compose logs  (si un servicio se cae)"],
  why:"Primero la sintaxis, luego el arranque, luego los logs. En ese orden ahorras mucho tiempo."},

 {t:"info", eti:"Los 5 clásicos", h:"Guárdate esta lista",
  c:`<ul><li><b>Tabuladores</b> → «found character that cannot start any token».</li>
     <li><b>Indentación inconsistente</b> → «mapping values are not allowed here».</li>
     <li><b>Falta el espacio tras los dos puntos</b> → el valor se lee mal.</li>
     <li><b>Puertos o versiones sin comillas</b> → se interpretan como números.</li>
     <li><b>Clave duplicada</b> → gana la última, sin avisar.</li></ul>
     <p>Con esto, YAML deja de ser un problema. Vamos a Compose.</p>`}
]}

]});
