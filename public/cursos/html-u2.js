window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "Enlaces, imágenes y multimedia",
resumen: "Rutas y enlaces, imágenes con alt bien escrito, imágenes responsive con srcset y picture, audio, vídeo con subtítulos, iframes y SVG en línea",
nivel: "Fundamentos",
color: "#f0875a",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"ht2n1",
titulo:"Enlaces y rutas",
claves:["Rutas absolutas, relativas al sitio (/…) y relativas a la página (../…)","#id enlaza a una parte de la página; mailto: y tel: abren correo y teléfono","El texto del enlace debe tener sentido fuera de contexto: nada de «haz clic aquí»"],
pasos:[
 {t:"info", eti:"A dónde apunta", h:"Tipos de ruta",
  c:`<div class="termbox">&lt;a href="https://github.com/catappa"&gt;GitHub&lt;/a&gt;       &lt;!-- absoluta: otro sitio --&gt;
&lt;a href="/perfil"&gt;Mi perfil&lt;/a&gt;                       &lt;!-- desde la raíz del sitio --&gt;
&lt;a href="ejercicios.html"&gt;Ejercicios&lt;/a&gt;              &lt;!-- relativa a la página actual --&gt;
&lt;a href="../css/"&gt;Curso de CSS&lt;/a&gt;                    &lt;!-- sube una carpeta --&gt;
&lt;a href="#formularios"&gt;Ir a formularios&lt;/a&gt;         &lt;!-- al elemento con id="formularios" --&gt;
&lt;a href="mailto:hola@catappa.dev"&gt;Escríbenos&lt;/a&gt;
&lt;a href="tel:+34910000000"&gt;910 000 000&lt;/a&gt;
&lt;a href="/informe.pdf" download&gt;Descargar informe (PDF, 2 MB)&lt;/a&gt;</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">desde https://catappa.dev/cursos/html/intro.html</div><table class="dg-tabla"><thead><tr><th>href</th><th>resultado</th></tr></thead><tbody>
     <tr><td>img/logo.png</td><td>https://catappa.dev/cursos/html/img/logo.png</td></tr>
     <tr><td>../css/</td><td>https://catappa.dev/cursos/css/</td></tr>
     <tr><td>/perfil</td><td>https://catappa.dev/perfil</td></tr>
     <tr><td>#formularios</td><td>https://catappa.dev/cursos/html/intro.html#formularios</td></tr>
     <tr><td>?pagina=2</td><td>https://catappa.dev/cursos/html/intro.html?pagina=2</td></tr></tbody></table></div>`},
 {t:"info", eti:"Buenas prácticas", h:"Enlaces que se entienden",
  c:`<ul><li><b>Texto descriptivo</b>: los lectores de pantalla ofrecen una lista de todos los enlaces de la página. Diez «haz clic aquí» no dicen nada; «Descargar el temario (PDF)» sí (WCAG 2.4.4).</li>
     <li><b>Enlace o botón</b>: si lleva a otra URL, es <code>&lt;a href&gt;</code>; si hace algo en la página (abrir, guardar, borrar), es <code>&lt;button&gt;</code>. Un <code>&lt;a href="#"&gt;</code> con JavaScript es un botón disfrazado: no se abre en otra pestaña, se anuncia mal y salta al principio de la página.</li>
     <li><b>target="_blank"</b>: abre una pestaña nueva. Los navegadores actuales ya aplican <code>rel="noopener"</code> implícitamente (la página abierta no puede tocar la tuya vía <code>window.opener</code>); se sigue escribiendo por los navegadores antiguos. <code>noreferrer</code> además oculta desde dónde vienes. Úsalo con moderación y avisa: «(se abre en otra pestaña)».</li>
     <li>Un <code>&lt;a&gt;</code> sin <code>href</code> no es un enlace: no recibe foco ni se anuncia como tal.</li></ul>`},
 {t:"escribe", p:"Escribe un enlace a <code>/cursos</code> con el texto Cursos",
  sol:["<a href=\"/cursos\">Cursos</a>","<a href='/cursos'>Cursos</a>","<a href=/cursos>Cursos</a>"], ph:"<a ...",
  pista:"La etiqueta a con el atributo href y el texto dentro.",
  why:"&lt;a href=\"/cursos\"&gt;Cursos&lt;/a&gt;: al empezar por barra, funciona igual desde cualquier página del sitio."},
 {t:"opcion", p:"Estás en <code>https://tienda.es/blog/2026/post.html</code>. ¿Adónde lleva <code>href=\"../fotos/a.jpg\"</code>?",
  ops:["https://tienda.es/fotos/a.jpg","https://tienda.es/blog/fotos/a.jpg","https://tienda.es/blog/2026/fotos/a.jpg","https://fotos/a.jpg"],
  ok:1, why:"La base es la carpeta de la página (<code>/blog/2026/</code>); <code>..</code> sube a <code>/blog/</code> y ahí se añade <code>fotos/a.jpg</code>."},
 {t:"codigo", p:"Resuelve rutas como lo hace el navegador: la primera línea es la URL de la página y cada línea siguiente, un <code>href</code>. Imprime la URL completa de cada uno",
  lenguaje:"js",
  c:`<p>Usa la clase <code>URL</code> (existe igual en el navegador y en Node): <code>new URL(ruta, base).href</code> aplica el mismo algoritmo que sigue un <code>&lt;a href&gt;</code>.</p>`,
  plantilla:"const [base, ...rutas] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n// imprime la URL absoluta de cada ruta\n",
  pruebas:[
   {entrada:"https://catappa.dev/cursos/html/intro.html\nimg/logo.png\n../css/\n/perfil\n", salida:"https://catappa.dev/cursos/html/img/logo.png\nhttps://catappa.dev/cursos/css/\nhttps://catappa.dev/perfil"},
   {entrada:"https://catappa.dev/cursos/html/intro.html\n#formularios\n?pagina=2\n", salida:"https://catappa.dev/cursos/html/intro.html#formularios\nhttps://catappa.dev/cursos/html/intro.html?pagina=2"},
   {entrada:"https://tienda.es/blog/2026/post.html\n../fotos/a.jpg\n//cdn.tienda.es/x.js\n", salida:"https://tienda.es/blog/fotos/a.jpg\nhttps://cdn.tienda.es/x.js", oculta:true}],
  pista:"for (const r of rutas) console.log(new URL(r.trim(), base.trim()).href);",
  solucion:"const [base, ...rutas] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const r of rutas) console.log(new URL(r.trim(), base.trim()).href);",
  why:"Fíjate en <code>//cdn…</code>: una ruta «relativa al protocolo» hereda https de la página. Hoy se escribe siempre <code>https://</code> completo."},
 {t:"hueco", p:"Completa un enlace a una sección de la misma página y otro que abra el correo",
  tpl:'<a href="___precios">Ver precios</a>\n<a href="___hola@catappa.dev">Escríbenos</a>',
  banco:["#","mailto:","/","tel:","email:","?"], sol:["#","mailto:"],
  why:"El fragmento <code>#precios</code> salta al elemento con <code>id=\"precios\"</code> (y lo pone en <code>:target</code>). <code>email:</code> no existe: el esquema es <code>mailto:</code>."},
 {t:"opcion", p:"¿Cuál es el mejor texto para un enlace al temario en PDF?",
  ops:["Haz clic aquí","Aquí","Descargar el temario del curso (PDF, 2 MB)","https://catappa.dev/docs/temario-final-v3.pdf"],
  ok:2, why:"Se entiende sin leer lo que lo rodea, dice qué pasará (descarga de PDF) y cuánto pesa. Es el enlace que un lector de pantalla puede elegir desde la lista de enlaces."},
 {t:"vf", p:"Un botón «Borrar» que ejecuta JavaScript debería ser <code>&lt;a href=\"#\" onclick=\"borrar()\"&gt;</code>.",
  ok:false, why:"Es una acción, no una navegación: <code>&lt;button type=\"button\"&gt;</code>. Se activa con Espacio y Enter, se anuncia como botón y no cambia la URL."}
]},

/* =============== U2 L2 =============== */
{
id:"ht2n2",
titulo:"Imágenes: alt, formatos y dimensiones",
claves:["El alt dice lo que la imagen aporta; decorativa → alt vacío","width y height reservan el hueco y evitan saltos (CLS)","AVIF y WebP para fotos, SVG para iconos y logos, PNG solo si hace falta"],
pasos:[
 {t:"info", eti:"La etiqueta img", h:"Una imagen bien puesta",
  c:`<div class="termbox">&lt;img src="/img/equipo.avif" alt="El equipo de Catappa celebrando el lanzamiento"
     width="1200" height="800" decoding="async"&gt;

&lt;figure&gt;
  &lt;img src="grafico.png" alt="Las visitas se duplicaron entre enero y junio" width="800" height="400"&gt;
  &lt;figcaption&gt;Figura 1. Visitas mensuales en 2026.&lt;/figcaption&gt;
&lt;/figure&gt;</div>
     <p><b>width y height</b> (en píxeles, sin unidad) dan el tamaño por defecto, pero sobre todo le dicen al navegador la <b>proporción</b> antes de descargar la imagen; con CSS (<code>max-width: 100%; height: auto</code>) la imagen se adapta al ancho disponible sin deformarse. Así reserva el hueco y el texto no salta (CLS). <code>figure</code> + <code>figcaption</code> asocian una imagen, gráfico o bloque de código con su pie.</p>`},
 {t:"info", eti:"El alt", h:"Cómo escribir un texto alternativo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué poner en alt según la imagen</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>alt</th></tr></thead><tbody>
     <tr><td>Informativa</td><td>Lo que aporta, en una frase: «Gráfico: las ventas se duplicaron en junio».</td></tr>
     <tr><td>Decorativa</td><td><code>alt=""</code> (vacío, no ausente): el lector de pantalla la salta.</td></tr>
     <tr><td>Funcional (dentro de un enlace o botón)</td><td>La acción o el destino: el logo que enlaza a inicio → «Catappa, inicio».</td></tr>
     <tr><td>Con texto</td><td>El mismo texto que aparece en la imagen.</td></tr>
     <tr><td>Compleja (diagrama, mapa)</td><td>Resumen breve en alt y la explicación completa en el texto o en figcaption.</td></tr></tbody></table></div>
     <p>No empieces por «Imagen de…»: el lector ya dice «imagen». Si falta el atributo alt, muchos lectores leen el <b>nombre del fichero</b> («IMG guion bajo 2026 punto jpg»).</p>
     <div class="dg dg-tabla-caja" style="margin-top:12px"><div class="dg-tit">formatos</div><table class="dg-tabla"><tbody>
     <tr><td>AVIF</td><td>Fotos: el más eficiente; soportado por todos los navegadores actuales.</td></tr>
     <tr><td>WebP</td><td>Fotos y transparencias: universal y más ligero que JPEG y PNG.</td></tr>
     <tr><td>JPEG</td><td>Fotos: el comodín de respaldo.</td></tr>
     <tr><td>PNG</td><td>Capturas con texto nítido o transparencia sin pérdidas.</td></tr>
     <tr><td>SVG</td><td>Logos, iconos, ilustraciones planas: vectorial, escala sin perder calidad.</td></tr>
     <tr><td>GIF animado</td><td>Evítalo: un vídeo MP4 o WebM pesa muchísimo menos.</td></tr></tbody></table></div>`},
 {t:"vf", p:"El atributo <code>alt</code> de una imagen es opcional y no tiene ningún efecto.",
  ok:false, why:"Lo leen los lectores de pantalla, aparece si la imagen no carga y lo usan los buscadores. En imágenes decorativas se deja vacío: alt=\"\"."},
 {t:"opcion", p:"El logo de la cabecera es una imagen dentro de un enlace a la portada. ¿Qué alt le pones?",
  ops:["alt=\"logo\"","alt=\"\"","alt=\"Catappa, inicio\"","alt=\"Imagen del logotipo de Catappa en color naranja\""],
  ok:2, why:"En una imagen funcional el alt es el nombre del enlace. Con <code>alt=\"\"</code> el enlace se quedaría sin nombre y el lector diría solo «enlace»."},
 {t:"par", p:"Empareja cada imagen con el formato más adecuado",
  pares:[["Foto de producto","AVIF o WebP"],["Logotipo","SVG"],["Captura de pantalla con texto pequeño","PNG"],["Animación de 5 segundos","Vídeo MP4 o WebM"]],
  why:"Un GIF de 5 MB suele quedarse en 300 KB como vídeo. Y el SVG pesa poco y se ve nítido a cualquier tamaño."},
 {t:"opcion", p:"Al cargar la página, el texto salta hacia abajo cuando aparece cada imagen. ¿Qué falta?",
  ops:["loading=\"lazy\"","Los atributos width y height en las img","Un alt más largo","Convertirlas a PNG"],
  ok:1, why:"Con las dimensiones, el navegador calcula <code>aspect-ratio</code> y reserva el espacio exacto. Es la causa número uno de CLS alto."},
 {t:"hueco", p:"Completa una imagen con su pie de figura",
  tpl:'<___>\n  <img src="mapa.webp" alt="Ruta de 12 km desde el puerto" width="800" height="600">\n  <___>La ruta de la costa, marcada en rojo.</figcaption>\n</figure>',
  banco:["figure","figcaption","caption","div","legend","section"], sol:["figure","figcaption"],
  why:"<code>caption</code> es de las tablas y <code>legend</code> de los fieldset. El pie de una figura es <code>figcaption</code>, primer o último hijo de <code>figure</code>."},
 {t:"escribe", p:"Escribe el atributo alt correcto para una imagen puramente decorativa (una línea ondulada de adorno)",
  sol:["alt=\"\"","alt=''","alt"],
  pista:"Tiene que estar el atributo, pero sin contenido.",
  why:"Sin atributo, el lector lee el nombre del fichero; con <code>alt=\"\"</code> la ignora. Mejor aún: si es puro adorno, que sea un fondo de CSS."}
]},

/* =============== U2 L3 =============== */
{
id:"ht2n3",
titulo:"Imágenes responsive: srcset, sizes y picture",
claves:["srcset ofrece varios tamaños y sizes dice cuánto ocupará la imagen: el navegador elige","picture con source type sirve formatos modernos con respaldo; con media, recortes distintos","loading=\"lazy\" para lo que está bajo el pliegue; fetchpriority=\"high\" para la imagen principal"],
pasos:[
 {t:"info", eti:"El problema", h:"Una sola imagen no sirve para todas las pantallas",
  c:`<p>Una foto de 2400 px es perfecta para un monitor 4K y un desperdicio de 1 MB en un móvil. Con <code>srcset</code> das opciones y el navegador, que conoce la pantalla y la conexión, elige:</p>
     <div class="termbox">&lt;img src="foto-800.jpg"
     srcset="foto-480.jpg 480w, foto-800.jpg 800w, foto-1200.jpg 1200w, foto-2400.jpg 2400w"
     sizes="(min-width: 60rem) 50vw, 100vw"
     alt="Terraza del bar al atardecer" width="2400" height="1600"&gt;</div>
     <div class="dg"><div class="dg-tit">cómo elige el navegador</div>
       <div class="dg-flujo">
         <div class="dg-caja doble">sizes<small>pantalla de 400 px → la imagen ocupará 100vw = 400 px</small></div>
         <div class="dg-caja doble">× densidad<small>pantalla 2x → hacen falta 800 px reales</small></div>
         <div class="dg-caja ok doble">srcset<small>el candidato más ajustado: foto-800.jpg</small></div>
       </div></div>
     <p>El descriptor <code>w</code> es el ancho real del fichero. <code>sizes</code> es obligatorio con descriptores w (si falta, vale <code>100vw</code>). Para imágenes de tamaño fijo (un avatar de 64 px) basta con densidades: <code>srcset="avatar.png 1x, avatar@2x.png 2x"</code>. El navegador puede elegir otra (por ejemplo, una más pequeña con ahorro de datos o una ya en caché).</p>`},
 {t:"info", eti:"picture", h:"Formatos y dirección de arte",
  c:`<div class="termbox">&lt;picture&gt;
  &lt;source media="(max-width: 40rem)" srcset="cabecera-recorte.avif" type="image/avif"&gt;
  &lt;source srcset="cabecera.avif" type="image/avif"&gt;
  &lt;source srcset="cabecera.webp" type="image/webp"&gt;
  &lt;img src="cabecera.jpg" alt="Equipo trabajando en la oficina" width="1600" height="600"
       fetchpriority="high"&gt;
&lt;/picture&gt;</div>
     <ul><li>El navegador recorre los <code>source</code> en orden y usa el <b>primero</b> que cumple su <code>type</code> y su <code>media</code>. El <code>&lt;img&gt;</code> final es obligatorio: es el que se pinta, lleva el alt y es el respaldo.</li>
     <li><b>Dirección de arte</b>: con <code>media</code> sirves un recorte distinto en móvil, no solo la misma foto más pequeña.</li>
     <li><code>loading="lazy"</code> retrasa la descarga hasta que la imagen se acerca a la pantalla. <b>Nunca</b> en la imagen principal (LCP): al revés, a esa ponle <code>fetchpriority="high"</code>.</li></ul>`},
 {t:"hueco", p:"Completa la imagen responsive",
  tpl:'<img src="foto-800.jpg"\n     ___="foto-400.jpg 400w, foto-800.jpg 800w"\n     ___="(min-width: 50rem) 33vw, 100vw"\n     alt="Plato del día">',
  banco:["srcset","sizes","src","media","width","type"], sol:["srcset","sizes"],
  why:"srcset da las opciones (con su ancho real) y sizes cuánto ocupará en la maqueta. Con esos dos datos y la densidad de la pantalla, el navegador decide."},
 {t:"codigo", p:"Simula la elección de <code>srcset</code>: dado el ancho de la ranura (px CSS), la densidad y los candidatos, imprime el fichero elegido",
  lenguaje:"js",
  c:`<p>Entrada: primera línea <code>ancho densidad</code>; segunda, los candidatos como en srcset (<code>fichero NNNw</code> separados por comas, en cualquier orden). Regla simplificada: el candidato más pequeño cuyo ancho sea ≥ ancho × densidad; si ninguno llega, el más grande.</p>`,
  plantilla:"const [l1, l2] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst [ancho, densidad] = l1.split(\" \").map(Number);\n// elige el candidato de l2\n",
  pruebas:[
   {entrada:"400 2\nfoto-480.jpg 480w, foto-800.jpg 800w, foto-1200.jpg 1200w\n", salida:"foto-800.jpg"},
   {entrada:"360 1\nfoto-480.jpg 480w, foto-800.jpg 800w, foto-1200.jpg 1200w\n", salida:"foto-480.jpg"},
   {entrada:"1000 2\nfoto-480.jpg 480w, foto-800.jpg 800w, foto-1200.jpg 1200w\n", salida:"foto-1200.jpg", oculta:true},
   {entrada:"300 3\na.jpg 1000w, b.jpg 600w, c.jpg 900w\n", salida:"c.jpg", oculta:true}],
  pista:"Convierte cada candidato en {f, w}, ordénalos por w y busca el primero con w &gt;= ancho * densidad.",
  solucion:"const [l1, l2] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst [ancho, densidad] = l1.split(\" \").map(Number);\nconst necesita = ancho * densidad;\nconst cands = l2.split(\",\").map(s => s.trim().split(/\\s+/)).map(([f, w]) => ({ f, w: parseInt(w) })).sort((a, b) => a.w - b.w);\nconst elegido = cands.find(c => c.w >= necesita) || cands[cands.length - 1];\nconsole.log(elegido.f);",
  why:"Por esto un <code>sizes</code> mal puesto (dejarlo en 100vw cuando la imagen ocupa un tercio) hace descargar imágenes tres veces más grandes de lo necesario."},
 {t:"orden", p:"Ordena el contenido de un <code>&lt;picture&gt;</code> que sirve AVIF, luego WebP y por último JPEG",
  items:["<picture>",'<source srcset="a.avif" type="image/avif">','<source srcset="a.webp" type="image/webp">','<img src="a.jpg" alt="…" width="800" height="600">',"</picture>"],
  why:"Gana el primer source compatible, así que el formato más eficiente va primero y el img siempre al final."},
 {t:"opcion", p:"En móvil quieres mostrar un recorte vertical de la foto, no la misma imagen más pequeña. ¿Qué usas?",
  ops:["Solo srcset con descriptores w","&lt;picture&gt; con &lt;source media=\"…\"&gt;","CSS object-fit","Dos img y display: none en una"],
  ok:1, why:"srcset deja la elección al navegador (mismo contenido, distinto tamaño); <code>media</code> en source es una orden: con ese ancho, esta imagen. Con dos img y display: none, algunos navegadores descargan las dos."},
 {t:"vf", p:"Conviene poner <code>loading=\"lazy\"</code> en todas las imágenes, incluida la grande de la cabecera.",
  ok:false, why:"La imagen principal suele ser el elemento LCP: con lazy, el navegador espera al layout para pedirla y la carga se retrasa. Lazy solo para lo que está fuera de la primera pantalla."},
 {t:"escribe", p:"¿Qué atributo con qué valor pones en la imagen principal para que el navegador la pida antes que el resto?",
  sol:["fetchpriority=\"high\"","fetchpriority=high","fetchpriority='high'"],
  pista:"fetch + priority.",
  why:"Es una pista de prioridad soportada por todos los navegadores actuales. Útil sobre todo en la imagen LCP y, al revés (<code>low</code>), en carruseles ocultos."}
]},

/* =============== U2 L4 =============== */
{
id:"ht2n4",
titulo:"Audio y vídeo",
claves:["video y audio con controls; varios source para distintos formatos","Subtítulos con track y ficheros WebVTT: obligatorios para ser accesible","autoplay solo funciona con muted; nunca sonido automático"],
pasos:[
 {t:"info", eti:"Multimedia nativa", h:"El elemento video",
  c:`<div class="termbox">&lt;video controls width="1280" height="720" preload="metadata"
       poster="portada.jpg"&gt;
  &lt;source src="clase.webm" type="video/webm"&gt;
  &lt;source src="clase.mp4" type="video/mp4"&gt;
  &lt;track kind="captions" src="clase.es.vtt" srclang="es" label="Español" default&gt;
  &lt;track kind="subtitles" src="clase.en.vtt" srclang="en" label="English"&gt;
  &lt;p&gt;Tu navegador no reproduce vídeo. &lt;a href="clase.mp4"&gt;Descárgalo&lt;/a&gt;.&lt;/p&gt;
&lt;/video&gt;

&lt;audio controls src="podcast.mp3"&gt;&lt;/audio&gt;</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">atributos clave</div><table class="dg-tabla"><tbody>
     <tr><td>controls</td><td>Muestra los controles nativos (accesibles con teclado). Sin él no hay forma de pausar.</td></tr>
     <tr><td>poster</td><td>Imagen que se ve antes de reproducir.</td></tr>
     <tr><td>preload</td><td><code>none</code> (nada), <code>metadata</code> (duración y dimensiones) o <code>auto</code>. Es una pista.</td></tr>
     <tr><td>autoplay + muted</td><td>Los navegadores solo permiten la reproducción automática si está silenciado.</td></tr>
     <tr><td>playsinline</td><td>En iPhone, reproduce dentro de la página, no a pantalla completa.</td></tr>
     <tr><td>loop</td><td>Vuelve a empezar al terminar.</td></tr></tbody></table></div>`},
 {t:"info", eti:"Accesible", h:"Subtítulos, transcripciones y WebVTT",
  c:`<div class="termbox">WEBVTT

00:00:01.000 --&gt; 00:00:04.000
Hola, bienvenidos al curso de HTML.

00:00:04.500 --&gt; 00:00:08.000
[música de fondo] Empezamos por el DOM.</div>
     <ul><li><code>kind="captions"</code>: subtítulos para personas sordas, con sonidos relevantes ([música], [risas]). <code>subtitles</code>: traducción del diálogo. También existen <code>descriptions</code> y <code>chapters</code>.</li>
     <li>WCAG pide subtítulos en vídeo grabado (1.2.2) y una transcripción o alternativa para audio (1.2.1). Una transcripción también la leen los buscadores.</li>
     <li>Audio que suena solo más de 3 segundos sin forma de pararlo incumple WCAG 1.4.2. Y respeta <code>prefers-reduced-motion</code> con los vídeos decorativos.</li></ul>`},
 {t:"par", p:"Empareja cada atributo de <code>video</code> con lo que hace",
  pares:[["controls","Muestra play, pausa, volumen y pantalla completa"],["poster","Imagen antes de reproducir"],['preload="none"',"No descarga nada hasta que se pulsa play"],["muted","Arranca sin sonido"],["playsinline","Reproduce dentro de la página en iPhone"]],
  why:"preload es una sugerencia: en móviles con ahorro de datos el navegador puede ignorar <code>auto</code>."},
 {t:"hueco", p:"Completa los subtítulos en español activados por defecto",
  tpl:'<___ kind="captions" src="clase.es.vtt" ___="es" label="Español" default>',
  banco:["track","srclang","source","lang","subtitle","caption"], sol:["track","srclang"],
  why:"<code>track</code> es un elemento vacío dentro de video. El idioma del fichero va en <code>srclang</code> (no en <code>lang</code>, que es el idioma del propio elemento)."},
 {t:"opcion", p:"Quieres una animación en bucle en la portada (antes era un GIF de 6 MB). ¿Qué pones?",
  ops:["Un GIF optimizado","&lt;video autoplay muted loop playsinline&gt; con un MP4 o WebM","&lt;video autoplay loop&gt; con sonido","Un iframe de YouTube"],
  ok:1, why:"Mismo efecto, una fracción del peso. Sin <code>muted</code>, el navegador bloquea el autoplay; sin <code>playsinline</code>, el iPhone lo abre a pantalla completa."},
 {t:"vf", p:"Un vídeo de fondo con música que empieza a sonar solo al abrir la página es aceptable si el volumen es bajo.",
  ok:false, why:"Interfiere con el lector de pantalla y los navegadores lo bloquean de todos modos. Si hay sonido, lo inicia la persona."},
 {t:"escribe", p:"¿Cómo se llama el formato de texto de los ficheros de subtítulos que usa <code>&lt;track&gt;</code>?",
  sol:["WebVTT","vtt","web vtt","webvtt"],
  pista:"Su extensión es .vtt.",
  why:"WebVTT empieza con la línea <code>WEBVTT</code> y luego bloques de tiempo <code>inicio --&gt; fin</code>. Se sirve con el tipo <code>text/vtt</code>."},
 {t:"orden", p:"Ordena el contenido de un <code>&lt;video&gt;</code>",
  items:['<video controls poster="p.jpg">','<source src="v.webm" type="video/webm">','<source src="v.mp4" type="video/mp4">','<track kind="captions" src="v.vtt" srclang="es" label="Español">',"<p>Texto de respaldo con enlace de descarga</p>","</video>"],
  why:"Los source van primero (gana el primero compatible), luego las pistas y al final el contenido de respaldo."}
]},

/* =============== U2 L5 =============== */
{
id:"ht2n5",
titulo:"Iframes, embebidos y SVG en línea",
claves:["iframe con title, loading=\"lazy\" y sandbox para contenido de terceros","sandbox vacío es lo más restrictivo; allow-scripts + allow-same-origin anula la protección","SVG como img para mostrar; en línea para estilarlo con CSS: role=\"img\" y title, o aria-hidden si es decorativo"],
pasos:[
 {t:"info", eti:"Páginas dentro de páginas", h:"iframe con seguridad",
  c:`<div class="termbox">&lt;iframe src="https://www.youtube-nocookie.com/embed/abc123"
        title="Vídeo: introducción a HTML"
        width="560" height="315" loading="lazy"
        allow="fullscreen; picture-in-picture"
        referrerpolicy="strict-origin-when-cross-origin"&gt;&lt;/iframe&gt;

&lt;iframe src="https://widgets.ejemplo.com/chat" title="Chat de soporte"
        sandbox="allow-scripts allow-forms"&gt;&lt;/iframe&gt;</div>
     <ul><li><b>title</b>: el lector de pantalla lo anuncia al entrar en el iframe. Sin él, «marco» y nada más.</li>
     <li><b>sandbox</b> sin valor bloquea scripts, formularios, ventanas emergentes y trata el contenido como de un origen único. Cada <code>allow-*</code> reabre una cosa. Ojo: <code>allow-scripts allow-same-origin</code> juntos, con contenido de tu mismo origen, permiten al iframe quitarse el sandbox.</li>
     <li><b>allow</b> (Permissions Policy) concede APIs: cámara, micrófono, geolocalización, pantalla completa.</li>
     <li>Un sitio puede impedir que lo incrusten con la cabecera <code>Content-Security-Policy: frame-ancestors</code> (o la antigua <code>X-Frame-Options</code>): por eso algunos iframes salen en blanco. Así se evita el <i>clickjacking</i>.</li>
     <li><code>&lt;object&gt;</code> y <code>&lt;embed&gt;</code> quedan para casos concretos (un PDF); Flash y los plugins desaparecieron.</li></ul>`},
 {t:"info", eti:"Gráficos vectoriales", h:"SVG: como imagen o en línea",
  c:`<div class="termbox">&lt;!-- 1. Como imagen: se cachea, no se puede estilar por dentro --&gt;
&lt;img src="logo.svg" alt="Catappa" width="120" height="40"&gt;

&lt;!-- 2. En línea con significado --&gt;
&lt;svg viewBox="0 0 24 24" width="24" height="24" role="img" aria-labelledby="t1"&gt;
  &lt;title id="t1"&gt;Aviso&lt;/title&gt;
  &lt;path d="M12 2 1 21h22z" fill="currentColor"/&gt;
&lt;/svg&gt;

&lt;!-- 3. Icono decorativo junto a un texto --&gt;
&lt;button type="button"&gt;
  &lt;svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="16" height="16"&gt;
    &lt;use href="/iconos.svg#papelera"/&gt;
  &lt;/svg&gt;
  Borrar
&lt;/button&gt;</div>
     <p><code>viewBox</code> define el sistema de coordenadas interno: el dibujo escala al tamaño que le des sin perder nitidez. <code>fill="currentColor"</code> hace que el icono tome el color del texto, así cambia con el tema y con <code>:hover</code>. Un <b>sprite</b> reúne todos los iconos en un fichero y cada uno se pinta con <code>&lt;use href="#id"&gt;</code>.</p>`},
 {t:"opcion", p:"Incrustas un widget de un tercero y solo necesita ejecutar scripts. ¿Qué sandbox le pones?",
  ops:["Ninguno: confías en ellos","sandbox=\"allow-scripts\"","sandbox=\"allow-scripts allow-same-origin allow-top-navigation allow-popups\"","sandbox=\"none\""],
  ok:1, why:"Mínimo privilegio: solo lo que necesita. Sin <code>allow-top-navigation</code> no puede redirigir tu página y sin <code>allow-popups</code> no abre ventanas."},
 {t:"par", p:"Empareja cada atributo de iframe con su función",
  pares:[["title","Nombre accesible del marco"],["sandbox","Restringe lo que puede hacer el contenido"],["allow","Concede APIs como cámara o pantalla completa"],['loading="lazy"',"No lo carga hasta que se acerca a la pantalla"],["srcdoc","HTML en línea en lugar de una URL"]],
  why:"Un iframe de vídeo o mapa pesa mucho: con loading=\"lazy\" no penaliza la carga inicial si está abajo en la página."},
 {t:"opcion", p:"Tu iframe con <code>src=\"https://banco.ejemplo\"</code> sale en blanco y la consola dice <i>refused to frame</i>. ¿Por qué?",
  ops:["Falta el atributo title","El sitio envía frame-ancestors (CSP) o X-Frame-Options y prohíbe que lo incrusten","Hace falta sandbox","El iframe necesita width"],
  ok:1, why:"Lo decide el sitio incrustado, no tú. Es la defensa contra el clickjacking: poner una página legítima invisible encima de un botón trampa."},
 {t:"hueco", p:"Completa el icono SVG decorativo que va junto al texto «Descargar»",
  tpl:'<svg ___="true" viewBox="0 0 24 24" width="16" height="16">\n  <path d="…" fill="___"/>\n</svg> Descargar',
  banco:["aria-hidden","currentColor","role","black","alt","inherit"], sol:["aria-hidden","currentColor"],
  why:"El texto ya dice lo que hace: el icono se oculta al lector para no leerlo dos veces. <code>currentColor</code> hereda el color del texto."},
 {t:"vf", p:"Un SVG cargado con <code>&lt;img src=\"logo.svg\"&gt;</code> se puede recolorear desde el CSS de la página.",
  ok:false, why:"Como imagen es una caja cerrada: el CSS de la página no llega dentro. Para estilarlo (colores, hover, animaciones) hay que meterlo en línea o usar un sprite con <code>use</code>."},
 {t:"escribe", p:"¿Qué atributo del <code>&lt;svg&gt;</code> define su sistema de coordenadas para que escale sin deformarse?",
  sol:["viewBox","viewbox"],
  pista:"Cuatro números: x, y, ancho y alto.",
  why:"Con <code>viewBox=\"0 0 24 24\"</code> puedes pintarlo a 16 o a 200 px y el dibujo se adapta. Ojo: se escribe con B mayúscula (SVG sí distingue mayúsculas)."}
]}

]});
