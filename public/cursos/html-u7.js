window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "SEO, metadatos y rendimiento",
resumen: "SEO técnico, Open Graph y datos estructurados JSON-LD, cómo se cargan los recursos (defer, async, preload, prioridades) y Core Web Vitals desde el HTML",
nivel: "Experto",
color: "#d9643f",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"ht7n1",
titulo:"SEO técnico desde el HTML",
claves:["title único y descriptivo, meta description, un h1 claro y enlaces rastreables con a href","canonical elige la URL oficial; noindex saca una página del índice; robots.txt solo controla el rastreo","hreflang enlaza versiones de idioma; el contenido importante, en el HTML y no solo tras JavaScript"],
pasos:[
 {t:"info", eti:"Lo que lee el buscador", h:"Señales en el HTML",
  c:`<div class="termbox">&lt;title&gt;Curso de HTML gratis: de cero a profesional · Catappa&lt;/title&gt;
&lt;meta name="description" content="30 lecciones prácticas: semántica, formularios, accesibilidad y SEO."&gt;
&lt;link rel="canonical" href="https://catappa.dev/cursos/html"&gt;
&lt;link rel="alternate" hreflang="es" href="https://catappa.dev/cursos/html"&gt;
&lt;link rel="alternate" hreflang="en" href="https://catappa.dev/en/courses/html"&gt;
&lt;link rel="alternate" hreflang="x-default" href="https://catappa.dev/en/courses/html"&gt;

&lt;meta name="robots" content="noindex, follow"&gt;   &lt;!-- solo en páginas que NO deben salir --&gt;

&lt;a href="/cursos/css"&gt;Curso de CSS&lt;/a&gt;              &lt;!-- enlace rastreable --&gt;
&lt;a href="https://patrocinador.com" rel="sponsored"&gt;…&lt;/a&gt;
&lt;a href="https://perfil-de-usuario.com" rel="ugc nofollow"&gt;…&lt;/a&gt;</div>
     <ul><li><b>title</b>: único por página, lo importante al principio; Google corta por anchura (unos 60 caracteres) y a veces lo reescribe.</li>
     <li><b>canonical</b>: cuando el mismo contenido tiene varias URL (<code>?utm=…</code>, <code>?orden=precio</code>, con y sin barra final) indica cuál indexar.</li>
     <li><b>Enlaces</b>: el buscador sigue <code>&lt;a href&gt;</code>; un <code>&lt;span onclick&gt;</code> no es un enlace para nadie.</li>
     <li><b>JavaScript</b>: Google ejecuta JS, pero en una segunda fase y no todos los buscadores ni las vistas previas de redes lo hacen. Renderizar en el servidor (SSR o estático) es lo seguro.</li></ul>`},
 {t:"info", eti:"Rastreo e índice", h:"robots.txt, noindex y sitemap",
  c:`<div class="dg"><div class="dg-tit">tres herramientas que se confunden</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">robots.txt</div><div class="dg-pila"><div class="dg-caja doble">Disallow: /admin/<small>no visites esto (rastreo)</small></div><div class="dg-caja aviso doble">No impide indexar<small>la URL puede salir si otros la enlazan</small></div></div></div>
         <div class="dg-col"><div class="dg-col-tit">meta robots noindex</div><div class="dg-pila"><div class="dg-caja doble">No me indexes<small>la página tiene que poder rastrearse para leerlo</small></div><div class="dg-caja ok doble">Saca la página de resultados</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">sitemap.xml</div><div class="dg-pila"><div class="dg-caja doble">Lista de URL que quieres indexar<small>se declara en robots.txt y en Search Console</small></div></div></div>
       </div></div>
     <div class="nota ojo"><b class="tit">El error clásico</b>Bloquear en robots.txt una página con noindex: el buscador no puede entrar a leer el noindex y la URL puede seguir apareciendo. Y el otro clásico: el <code>noindex</code> del entorno de pruebas que llega a producción.</div>`},
 {t:"par", p:"Empareja cada herramienta con lo que controla",
  pares:[["robots.txt","Qué rutas se pueden rastrear"],['<meta name="robots" content="noindex">',"Que la página no aparezca en resultados"],['<link rel="canonical">',"Cuál de varias URL duplicadas es la oficial"],["hreflang","Qué versión mostrar según el idioma"],["sitemap.xml","Lista de URL que quieres indexar"]],
  why:"Mezclarlas es la fuente de la mitad de los desastres de SEO técnico."},
 {t:"opcion", p:"Tras un despliegue, el tráfico orgánico cae a cero en dos semanas. ¿Qué miras primero en el HTML?",
  ops:["Las clases CSS","Si se ha colado un &lt;meta name=\"robots\" content=\"noindex\"&gt; (o una cabecera X-Robots-Tag) del entorno de pruebas","El favicon","Las fuentes"],
  ok:1, why:"Es el error más caro y más común. Automatiza un test que falle si producción sirve noindex."},
 {t:"hueco", p:"Completa la URL oficial y la versión en inglés de la página",
  tpl:'<link rel="___" href="https://tienda.es/sillas">\n<link rel="alternate" ___="en" href="https://tienda.es/en/chairs">',
  banco:["canonical","hreflang","lang","official","alternate","srclang"], sol:["canonical","hreflang"],
  why:"Cada versión debe enlazar a todas las demás (incluida ella misma) con hreflang, y <code>x-default</code> señala la de por defecto."},
 {t:"vf", p:"Bloquear una URL en robots.txt garantiza que nunca aparezca en Google.",
  ok:false, why:"robots.txt impide rastrear, no indexar: si hay enlaces hacia ella, puede aparecer sin descripción. Para sacarla, noindex (y dejar que se rastree) o protegerla con contraseña."},
 {t:"opcion", p:"Un listado de productos tiene URL con <code>?orden=precio</code> y <code>?orden=nombre</code> con el mismo contenido. ¿Qué haces?",
  ops:["noindex en todas","Un canonical en cada variante apuntando a la URL sin parámetros","Bloquearlas en robots.txt","Nada"],
  ok:1, why:"canonical consolida las señales en una URL. Ojo: es una sugerencia fuerte, no una orden; Google puede elegir otra si las señales se contradicen."},
 {t:"escribe", p:"¿Qué valor de <code>rel</code> marca un enlace pagado o patrocinado?",
  sol:["sponsored","rel=\"sponsored\"","rel=sponsored"],
  pista:"«Patrocinado» en inglés.",
  why:"<code>sponsored</code> para publicidad, <code>ugc</code> para contenido de usuarios (comentarios, foros) y <code>nofollow</code> para lo demás que no quieres avalar."}
]},

/* =============== U7 L2 =============== */
{
id:"ht7n2",
titulo:"Open Graph y datos estructurados JSON-LD",
claves:["Open Graph (og:title, og:image…) controla la vista previa al compartir en redes y mensajería","JSON-LD con vocabulario schema.org describe la página para los buscadores","Los datos estructurados deben coincidir con lo visible; valida con la prueba de resultados enriquecidos"],
pasos:[
 {t:"info", eti:"Al compartir", h:"Open Graph y tarjetas",
  c:`<div class="termbox">&lt;meta property="og:type" content="article"&gt;
&lt;meta property="og:title" content="Guía de formularios accesibles"&gt;
&lt;meta property="og:description" content="Errores, ayudas y validación que funcionan con lector de pantalla."&gt;
&lt;meta property="og:image" content="https://catappa.dev/og/formularios.png"&gt;   &lt;!-- 1200×630, URL absoluta --&gt;
&lt;meta property="og:image:alt" content="Formulario con un error resaltado"&gt;
&lt;meta property="og:url" content="https://catappa.dev/blog/formularios"&gt;
&lt;meta property="og:locale" content="es_ES"&gt;
&lt;meta name="twitter:card" content="summary_large_image"&gt;</div>
     <p>Los usan WhatsApp, LinkedIn, Slack, Telegram, X, Facebook… Detalles: Open Graph usa <code>property</code>, no <code>name</code>; la imagen necesita URL absoluta; los robots de las redes <b>no ejecutan JavaScript</b>, así que estas etiquetas tienen que venir en el HTML del servidor. Las plataformas cachean la vista previa: tras cambiarla, hay que forzar que la vuelvan a leer con sus herramientas de depuración.</p>`},
 {t:"info", eti:"Para buscadores", h:"Datos estructurados con JSON-LD",
  c:`<div class="termbox">&lt;script type="application/ld+json"&gt;
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Silla de roble",
  "image": "https://tienda.es/img/silla.avif",
  "offers": {
    "@type": "Offer",
    "price": "89.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.6", "reviewCount": "132" }
}
&lt;/script&gt;</div>
     <p>Google recomienda <b>JSON-LD</b> (frente a Microdata o RDFa) porque va separado del HTML visible. Tipos habituales: <code>Article</code>, <code>Product</code>, <code>BreadcrumbList</code>, <code>Organization</code>, <code>LocalBusiness</code>, <code>Event</code>, <code>Recipe</code>, <code>JobPosting</code>. Pueden dar <b>resultados enriquecidos</b> (estrellas, precio, migas), pero no mejoran la posición por sí mismos y Google decide si los muestra (por ejemplo, desde 2023 limitó mucho los de FAQ y retiró los de HowTo). Lo marcado debe <b>verse en la página</b>: inventar valoraciones es motivo de penalización manual.</p>`},
 {t:"hueco", p:"Completa la etiqueta Open Graph de la imagen para compartir",
  tpl:'<meta ___="og:image" ___="https://catappa.dev/og/html.png">',
  banco:["property","content","name","value","src","href"], sol:["property","content"],
  why:"Open Graph nació sobre RDFa, por eso usa <code>property</code>. Muchas plataformas aceptan también name, pero lo correcto es property."},
 {t:"opcion", p:"Compartes tu nueva entrada en LinkedIn y sale la vista previa de la versión anterior. ¿Qué pasa?",
  ops:["Las etiquetas og están mal escritas","La plataforma cachea la vista previa: hay que pedirle que vuelva a leer la URL con su herramienta de depuración (Post Inspector)","Falta el JSON-LD","El title es demasiado largo"],
  ok:1, why:"Cada red guarda su copia. Por eso conviene poner bien las etiquetas antes de compartir por primera vez."},
 {t:"codigo", p:"Genera el bloque JSON-LD de un artículo: entrada con tres líneas (título, autor, fecha ISO); imprime la etiqueta <code>script</code> completa en una línea",
  lenguaje:"js",
  c:`<p>Formato exacto: <code>&lt;script type="application/ld+json"&gt;{…}&lt;/script&gt;</code> con <code>@context</code>, <code>@type</code> (Article), <code>headline</code>, <code>author</code> (objeto Person con <code>name</code>) y <code>datePublished</code>, en ese orden, generado con <code>JSON.stringify</code>. Por seguridad, sustituye cada <code>&lt;</code> del JSON por <code>\\u003c</code>: si el título contuviera <code>&lt;/script&gt;</code>, cerraría la etiqueta.</p>`,
  plantilla:"const [titulo, autor, fecha] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n// construye el objeto y escribe la etiqueta\n",
  pruebas:[
   {entrada:"Formularios accesibles\nAna Ruiz\n2026-09-23\n", salida:"<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"Formularios accesibles\",\"author\":{\"@type\":\"Person\",\"name\":\"Ana Ruiz\"},\"datePublished\":\"2026-09-23\"}</script>"},
   {entrada:"Qué es \"semántica\"\nLuis\n2026-01-02\n", salida:"<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"Qué es \\\"semántica\\\"\",\"author\":{\"@type\":\"Person\",\"name\":\"Luis\"},\"datePublished\":\"2026-01-02\"}</script>"},
   {entrada:"Cierra </script> así\nEva\n2026-05-05\n", salida:"<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"Cierra \\u003c/script> así\",\"author\":{\"@type\":\"Person\",\"name\":\"Eva\"},\"datePublished\":\"2026-05-05\"}</script>", oculta:true}],
  pista:"JSON.stringify(obj).replace(/&lt;/g, \"\\\\u003c\") y lo envuelves entre las dos etiquetas.",
  solucion:"const [titulo, autor, fecha] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst datos = {\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Article\",\n  headline: titulo,\n  author: { \"@type\": \"Person\", name: autor },\n  datePublished: fecha\n};\nconst json = JSON.stringify(datos).replace(/</g, \"\\\\u003c\");\nconsole.log('<script type=\"application/ld+json\">' + json + \"</script>\");",
  why:"Meter datos del usuario dentro de un <code>&lt;script&gt;</code> es un clásico agujero XSS. <code>\\u003c</code> sigue siendo un «&lt;» válido para el parser JSON, pero el de HTML ya no ve una etiqueta de cierre."},
 {t:"par", p:"Empareja cada tipo de schema.org con su página",
  pares:[["Product","Ficha de un producto con precio"],["BreadcrumbList","Migas de pan"],["Article","Entrada de blog o noticia"],["LocalBusiness","Ficha de un restaurante con dirección y horario"],["Event","Un concierto con fecha y lugar"]],
  why:"Valida siempre con la Prueba de resultados enriquecidos de Google y el validador de schema.org: un error de sintaxis invalida el bloque entero."},
 {t:"vf", p:"Puedes marcar en JSON-LD una valoración de 5 estrellas aunque la página no muestre ninguna opinión.",
  ok:false, why:"Las directrices exigen que los datos estructurados describan contenido visible. Marcar lo que no existe lleva a acciones manuales y a perder los resultados enriquecidos de todo el sitio."},
 {t:"escribe", p:"¿Qué valor lleva el atributo <code>type</code> del script que contiene datos estructurados JSON-LD?",
  sol:["application/ld+json"],
  pista:"application/… + json.",
  why:"Con ese tipo, el navegador no lo ejecuta: es un bloque de datos. Puede ir en el head o en el body."}
]},

/* =============== U7 L3 =============== */
{
id:"ht7n3",
titulo:"Cómo se cargan los recursos: defer, async, preload y prioridades",
claves:["Un script clásico detiene el parser; defer ejecuta en orden al acabar; async ejecuta en cuanto llega","El CSS bloquea el renderizado: solo el crítico en el head","preload, preconnect y fetchpriority adelantan lo que el navegador descubriría tarde"],
pasos:[
 {t:"info", eti:"Scripts", h:"Normal, defer y async",
  c:`<div class="dg"><div class="dg-tit">qué pasa con el parser en cada caso</div>
<svg viewBox="0 0 340 170" width="100%" style="max-width:520px;display:block;margin:auto" role="img" aria-label="Línea de tiempo: el script normal detiene el análisis del HTML mientras se descarga y ejecuta; defer descarga en paralelo y ejecuta al final; async descarga en paralelo y detiene el análisis solo para ejecutar">
  <text x="4" y="34" font-size="12" font-family="var(--mono)" fill="var(--ink)">normal</text>
  <rect x="70" y="22" width="50" height="16" fill="var(--ok-soft)" stroke="var(--ok)"/>
  <rect x="120" y="26" width="60" height="8" fill="var(--line-2)"/>
  <rect x="180" y="22" width="30" height="16" fill="var(--accent)"/>
  <rect x="210" y="22" width="120" height="16" fill="var(--ok-soft)" stroke="var(--ok)"/>
  <text x="4" y="79" font-size="12" font-family="var(--mono)" fill="var(--ink)">defer</text>
  <rect x="70" y="67" width="230" height="16" fill="var(--ok-soft)" stroke="var(--ok)"/>
  <rect x="110" y="87" width="60" height="6" fill="var(--line-2)"/>
  <rect x="300" y="67" width="30" height="16" fill="var(--accent)"/>
  <text x="4" y="124" font-size="12" font-family="var(--mono)" fill="var(--ink)">async</text>
  <rect x="70" y="112" width="100" height="16" fill="var(--ok-soft)" stroke="var(--ok)"/>
  <rect x="110" y="132" width="60" height="6" fill="var(--line-2)"/>
  <rect x="170" y="112" width="30" height="16" fill="var(--accent)"/>
  <rect x="200" y="112" width="130" height="16" fill="var(--ok-soft)" stroke="var(--ok)"/>
  <rect x="70" y="152" width="12" height="10" fill="var(--ok-soft)" stroke="var(--ok)"/>
  <text x="86" y="161" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">análisis</text>
  <rect x="150" y="154" width="12" height="6" fill="var(--line-2)"/>
  <text x="166" y="161" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">descarga</text>
  <rect x="236" y="152" width="12" height="10" fill="var(--accent)"/>
  <text x="252" y="161" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">ejecución</text>
</svg></div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">atributos de script</div><table class="dg-tabla"><tbody>
     <tr><td>&lt;script src&gt;</td><td>Detiene el análisis del HTML mientras se descarga y ejecuta.</td></tr>
     <tr><td>defer</td><td>Descarga en paralelo; ejecuta al terminar el análisis, en orden, antes de DOMContentLoaded. Lo normal para tu aplicación.</td></tr>
     <tr><td>async</td><td>Descarga en paralelo; ejecuta en cuanto llega, sin orden. Para scripts independientes (analítica).</td></tr>
     <tr><td>type="module"</td><td>Diferido por defecto (como defer); con async, en cuanto esté listo con sus dependencias.</td></tr></tbody></table></div>`},
 {t:"info", eti:"Pistas al navegador", h:"preload, preconnect y compañía",
  c:`<div class="termbox">&lt;link rel="preconnect" href="https://cdn.catappa.dev" crossorigin&gt;      &lt;!-- DNS + TCP + TLS por adelantado --&gt;
&lt;link rel="dns-prefetch" href="https://analitica.ejemplo"&gt;             &lt;!-- solo la resolución DNS --&gt;
&lt;link rel="preload" href="/fuentes/inter.woff2" as="font" type="font/woff2" crossorigin&gt;
&lt;link rel="preload" href="/img/portada.avif" as="image" fetchpriority="high"&gt;
&lt;link rel="modulepreload" href="/js/app.js"&gt;                            &lt;!-- módulo y sus dependencias --&gt;
&lt;link rel="prefetch" href="/cursos/css"&gt;                                 &lt;!-- para la PRÓXIMA navegación --&gt;</div>
     <ul><li><b>preload</b> es para recursos de <b>esta</b> página que el navegador descubriría tarde (fuentes pedidas desde el CSS, una imagen de fondo LCP). <code>as</code> es obligatorio; en fuentes, <code>crossorigin</code> también, aunque sean del mismo origen, o se descargan dos veces.</li>
     <li>Precargar demasiado es contraproducente: todo compite por el ancho de banda. Unas pocas cosas críticas.</li>
     <li>El <b>CSS bloquea el renderizado</b>: la página no se pinta hasta tenerlo. Mantén en el head solo el necesario y carga el resto después.</li>
     <li>El navegador tiene un <b>escáner de precarga</b> que lee el HTML por delante del parser: lo que está en el HTML inicial se descubre pronto; lo que inyecta JavaScript, tarde.</li></ul>`},
 {t:"par", p:"Empareja cada atributo o enlace con su efecto",
  pares:[["defer","Ejecuta en orden al terminar de analizar el HTML"],["async","Ejecuta en cuanto se descarga, sin orden"],['rel="preload"',"Descarga ya un recurso crítico de esta página"],['rel="preconnect"',"Abre la conexión a otro origen por adelantado"],['rel="prefetch"',"Descarga en reposo algo para la siguiente página"]],
  why:"La regla práctica: tu código con defer (o module), la analítica con async y muy pocos preload bien elegidos."},
 {t:"opcion", p:"Tienes <code>app.js</code>, que depende de <code>libreria.js</code>. Ambos en el head. ¿Qué atributos pones?",
  ops:["async en los dos","defer en los dos (o type=\"module\" con import)","Ninguno","async en la librería y defer en app.js"],
  ok:1, why:"defer respeta el orden del documento; con async, app.js podría ejecutarse antes que la librería y fallar a veces, según qué llegue primero: el peor tipo de error."},
 {t:"hueco", p:"Completa la precarga de la fuente principal",
  tpl:'<link rel="___" href="/fuentes/inter.woff2" ___="font" type="font/woff2" crossorigin>',
  banco:["preload","as","prefetch","type","preconnect","for"], sol:["preload","as"],
  why:"Sin <code>as</code> el navegador no sabe qué prioridad darle ni puede reutilizarlo; sin <code>crossorigin</code>, la fuente se descarga dos veces."},
 {t:"vf", p:"Con <code>type=\"module\"</code> hay que añadir <code>defer</code> para que no bloquee el análisis.",
  ok:false, why:"Los módulos ya se comportan como defer. El atributo defer no tiene efecto en ellos; async sí cambia su comportamiento."},
 {t:"orden", p:"Ordena el head para que lo crítico se descubra primero",
  items:['<meta charset="utf-8">','<meta name="viewport" …>',"<title>…</title>",'<link rel="preconnect" href="https://cdn…">','<link rel="stylesheet" href="/css/critico.css">','<script src="/js/app.js" defer></script>'],
  why:"charset en los primeros bytes; las conexiones y el CSS crítico cuanto antes; los scripts con defer pueden ir en el head sin bloquear."},
 {t:"opcion", p:"Añades <code>rel=\"preload\"</code> a 25 recursos «para que todo cargue antes» y el LCP empeora. ¿Por qué?",
  ops:["preload no funciona en producción","Todo compite por el ancho de banda y lo realmente crítico llega más tarde","Hay que usar prefetch","Falta async"],
  ok:1, why:"Si todo es prioritario, nada lo es. Precarga solo lo que el escáner no puede descubrir a tiempo y afecta a la primera pantalla."}
]},

/* =============== U7 L4 =============== */
{
id:"hc6l2",
titulo:"Core Web Vitals desde el HTML",
claves:["Core Web Vitals: LCP (carga), INP (respuesta) y CLS (estabilidad), medidos en el percentil 75","El HTML decide mucho: dimensiones de imágenes, prioridad de la imagen principal, menos JavaScript","Datos de campo (usuarios reales, CrUX) frente a datos de laboratorio (Lighthouse)"],
pasos:[
 {t:"info", eti:"Rápida y encontrable", h:"Core Web Vitals",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">umbrales de «bueno» (percentil 75 de las visitas)</div><table class="dg-tabla"><thead><tr><th>métrica</th><th>nombre</th><th>bueno</th><th>mide</th></tr></thead><tbody><tr><td>LCP</td><td>Largest Contentful Paint</td><td>&lt; 2,5 s</td><td>cuánto tarda en verse lo principal</td></tr><tr><td>INP</td><td>Interaction to Next Paint</td><td>&lt; 200 ms</td><td>cuánto tarda en responder a un clic o tecla</td></tr><tr><td>CLS</td><td>Cumulative Layout Shift</td><td>&lt; 0,1</td><td>cuánto «salta» el contenido</td></tr></tbody></table></div>
     <p>INP sustituyó a FID en marzo de 2024: mide todas las interacciones de la visita, no solo la primera. Google usa estas métricas, con datos reales de Chrome (CrUX), como una señal más de posicionamiento.</p>`},
 {t:"info", eti:"Palancas en el HTML", h:"Qué mejora cada métrica",
  c:`<div class="dg"><div class="dg-tit">qué hacer desde el HTML</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">LCP</div><div class="dg-pila">
           <div class="dg-caja">Imagen principal en el HTML inicial, con fetchpriority="high"</div>
           <div class="dg-caja aviso">Nunca loading="lazy" en ella</div>
           <div class="dg-caja">AVIF/WebP con srcset y sizes</div>
           <div class="dg-caja">HTML servido rápido (SSR, caché, CDN)</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">CLS</div><div class="dg-pila">
           <div class="dg-caja">width y height en img, video e iframe</div>
           <div class="dg-caja">Hueco reservado para anuncios y banners</div>
           <div class="dg-caja">Fuentes precargadas (menos saltos al cambiar)</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">INP</div><div class="dg-pila">
           <div class="dg-caja">Menos JavaScript: elementos nativos (details, dialog, popover)</div>
           <div class="dg-caja">Scripts con defer o async</div>
           <div class="dg-caja">DOM contenido (miles de nodos lo hacen lento)</div></div></div>
       </div></div>
     <p>Mide en <b>campo</b> (PageSpeed Insights con datos de CrUX, Search Console, la librería <code>web-vitals</code>) y diagnostica en <b>laboratorio</b> (Lighthouse, panel Rendimiento de DevTools). Un 100 en Lighthouse con un portátil potente no significa buen INP en un móvil de gama baja.</p>`},
 {t:"par", p:"Empareja cada problema con la métrica que empeora",
  pares:[["Imagen principal enorme sin optimizar","LCP: tarda en verse lo principal"],["Un clic que tarda en responder por JavaScript pesado","INP: la interacción va lenta"],["Anuncio que aparece y empuja el contenido","CLS: el contenido salta"],["Fuente web que tarda en cargar y bloquea el texto","FCP y LCP: se ve la página en blanco más tiempo"]],
  why:"Google usa estas métricas como factor de posicionamiento."},
 {t:"par", p:"Empareja cada elemento con su papel en el SEO",
  pares:[["<title>","Título del resultado en el buscador"],['<meta name="description">',"Texto del resultado"],["Un único <h1> descriptivo","Tema principal de la página"],["alt en las imágenes","Que el buscador entienda las imágenes"],["URLs legibles","/cursos/docker mejor que /p?id=17"]],
  why:"Un buen HTML semántico ya es la mitad del SEO técnico."},
 {t:"opcion", p:"El LCP de tu portada es una imagen de cabecera con <code>loading=\"lazy\"</code> y se pinta a los 4 s. ¿Qué cambias primero?",
  ops:["Convertirla a GIF","Quitar loading=\"lazy\" y añadir fetchpriority=\"high\"","Añadir decoding=\"sync\"","Moverla al pie"],
  ok:1, why:"Es de los arreglos con más impacto por línea cambiada: la imagen pasa de esperar al layout a pedirse de las primeras."},
 {t:"vf", p:"Un 100 en Lighthouse garantiza que las Core Web Vitals de los usuarios reales sean buenas.",
  ok:false, why:"Lighthouse es una simulación en una máquina concreta y no mide INP real (no hay interacciones). Lo que cuenta para Google son los datos de campo del percentil 75."},
 {t:"escribe", p:"¿Qué métrica de Core Web Vitals sustituyó a FID en 2024? (siglas)",
  sol:["INP","interaction to next paint"],
  pista:"Interaction to Next Paint.",
  why:"FID solo medía el retraso de la primera interacción; INP mide la latencia completa (hasta pintar) de todas, y reporta casi la peor."},
 {t:"opcion", p:"El CLS de un artículo es 0,35 y casi todo viene de un iframe de vídeo incrustado. ¿Qué haces?",
  ops:["Quitar todos los vídeos","Darle width y height al iframe (o aspect-ratio en CSS) para reservar su hueco","Cargarlo con async","Ponerle loading=\"eager\""],
  ok:1, why:"Igual que con las imágenes: si el navegador conoce la proporción antes de cargar, no hay salto."}
]}

]});
