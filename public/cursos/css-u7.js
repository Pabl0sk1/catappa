window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Diseño responsive",
resumen: "Mobile first y media queries, container queries, imágenes adaptables con object-fit y aspect-ratio, preferencias del usuario, tipos de entrada, impresión y @supports",
nivel: "Avanzado",
color: "#2c59bb",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"hc5l1",
titulo:"Mobile first y media queries",
claves:["Sin &lt;meta name=\"viewport\"&gt; el móvil simula una pantalla de escritorio y nada de lo demás funciona","Mobile first: estilos base para móvil y min-width (o width &gt;=) para ir añadiendo","Puntos de ruptura donde se rompa el contenido, no por modelos de móvil; lo fluido primero"],
pasos:[
 {t:"info", eti:"Todas las pantallas", h:"Mobile first",
  c:`<div class="termbox">&lt;!-- imprescindible en el &lt;head&gt; --&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</div>
<div class="termbox">/* base: móvil, una columna */
.pagina { display: grid; gap: 16px; padding: 16px; }
.lateral { display: none; }

/* a partir de 48rem (768px): añade lo que cabe */
@media (min-width: 48rem) {
  .pagina { grid-template-columns: 15rem 1fr; }
  .lateral { display: block; }
}

/* sintaxis de rangos (todos los navegadores desde 2023): más legible */
@media (width &gt;= 64rem) { .pagina { grid-template-columns: 15rem 1fr 18rem; } }
@media (40rem &lt;= width &lt; 64rem) { .anuncio { display: none; } }</div>
<p>Sin la etiqueta <code>viewport</code>, el móvil pinta la página como si midiera unos 980px y la reduce: el texto sale diminuto y tus media queries de móvil nunca se activan.</p>`},
 {t:"info", eti:"Criterio", h:"Dónde poner los puntos de ruptura",
  c:`<div class="dg"><div class="dg-tit">antes de escribir una media query</div>
<div class="dg-vert">
<div class="dg-caja ok doble">1. diseño intrínseco<small>max-width, min(), clamp(), flex-wrap, auto-fit: muchas cosas ya se adaptan solas</small></div>
<div class="dg-caja acento doble">2. container queries<small>si lo que cambia es un componente según su hueco</small></div>
<div class="dg-caja doble">3. media queries<small>para la maqueta general de la página, donde el contenido se rompa</small></div>
</div></div>
<p>Abre la página, estrecha la ventana poco a poco y pon un punto de ruptura justo donde algo se vea mal. Eso es mejor que copiar los anchos de los iPhone de este año: mañana habrá otros. Escribirlos en <code>em</code> o <code>rem</code> hace que también reaccionen al tamaño de letra del usuario.</p>`},
 {t:"par", p:"Empareja cada media query con cuándo se aplica",
  pares:[["@media (min-width: 48rem)","A partir de 48rem de ancho"],["@media (max-width: 47.99rem)","Por debajo de 48rem"],["@media (width >= 64rem)","A partir de 64rem, con la sintaxis de rangos"],["@media (orientation: landscape)","Con la pantalla en horizontal"],["@media print","Al imprimir"]],
  why:"Con min-width y max-width hay que evitar que dos queries se solapen en el píxel exacto; la sintaxis de rangos con &lt; y &gt;= lo resuelve limpio."},
 {t:"opcion", p:"¿Qué significa diseñar «mobile first»?",
  ops:["Hacer solo la versión móvil","Escribir los estilos base para pantallas pequeñas y añadir con min-width lo necesario para las grandes","Usar solo porcentajes","Hacer una app nativa"],
  ok:1, why:"Suele dar CSS más sencillo: se añade complejidad cuando hay más espacio, en vez de deshacerla para el móvil."},
 {t:"opcion", p:"Has escrito media queries para móvil pero en tu teléfono la página se ve como en escritorio, en miniatura. ¿Qué falta?",
  ops:["Un reset CSS","La etiqueta &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"&gt;","Usar max-width en vez de min-width","JavaScript que detecte el móvil"],
  ok:1, why:"Sin viewport, el navegador del móvil usa un ancho virtual de escritorio y escala la página entera."},
 {t:"escribe", p:"Escribe la media query (con la sintaxis de rangos) que se aplica a partir de 48rem de ancho",
  sol:["@media (width >= 48rem)","@media(width>=48rem)","@media (width>=48rem)","@media (min-width: 48rem)","@media (min-width:48rem)"], pista:"@media (width ... 48rem)",
  why:"Equivale a (min-width: 48rem). La sintaxis de rangos admite también intervalos: (40rem &lt;= width &lt; 64rem)."},
 {t:"hueco", p:"Mobile first: una columna por defecto y dos a partir de 48rem",
  tpl:".pagina { display: grid; }\n@media (___: 48rem) {\n  .pagina { grid-template-columns: ___; }\n}", banco:["min-width","15rem 1fr","max-width","1fr","min-height"], sol:["min-width","15rem 1fr"],
  why:"En mobile first las media queries son casi siempre de min-width: van añadiendo."},
 {t:"vf", p:"Conviene definir los puntos de ruptura con los anchos exactos de los móviles más vendidos.",
  ok:false, why:"Los dispositivos cambian cada año. Los puntos de ruptura se ponen donde tu contenido deja de verse bien."}
]},

/* =============== U7 L2 =============== */
{
id:"cs7n1",
titulo:"Container queries",
claves:["container-type: inline-size convierte un elemento en contenedor consultable","@container (width &gt; 400px) aplica estilos según el hueco del componente, no según la pantalla","Unidades cqi/cqw y consultas con nombre; un contenedor no puede consultarse a sí mismo"],
pasos:[
 {t:"info", eti:"Componentes", h:"El componente que se adapta a su hueco",
  c:`<p>Una tarjeta de producto puede vivir en la columna principal (ancha) o en un lateral (estrecho) de la <b>misma</b> pantalla. Con media queries solo puedes preguntar por la pantalla; con <b>container queries</b> preguntas por el sitio donde está el componente.</p>
<div class="termbox">.zona { container-type: inline-size; }            /* se puede consultar su ancho */
.lateral { container: lateral / inline-size; }    /* con nombre: nombre / tipo */

.tarjeta { display: grid; gap: .75rem; }
@container (width &gt; 28rem) {                      /* contenedor más cercano */
  .tarjeta { grid-template-columns: 8rem 1fr; }   /* imagen al lado del texto */
}
@container lateral (width &lt; 20rem) {              /* solo el contenedor llamado «lateral» */
  .tarjeta .descripcion { display: none; }
}

.tarjeta h3 { font-size: clamp(1rem, 4cqi, 1.5rem); }   /* 4 % del ancho del contenedor */</div>
<div class="dg"><div class="dg-tit">la misma tarjeta en dos huecos de la misma página</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">columna principal (40rem)</div><div class="dg-flujo"><div class="dg-caja acento">imagen</div><div class="dg-caja">título, texto y precio</div></div></div>
<div class="dg-col"><div class="dg-col-tit">lateral (18rem)</div><div class="dg-vert"><div class="dg-caja acento">imagen</div><div class="dg-caja">título y precio</div></div></div>
</div></div>`},
 {t:"info", eti:"Trampas", h:"Lo que hay que saber",
  c:`<ul><li><b>No te consultas a ti mismo</b>: los estilos de <code>@container</code> se aplican a los <b>descendientes</b> del contenedor. Por eso se suele envolver el componente en un elemento que hace de contenedor.</li>
<li><b>El contenedor deja de medirse por su contenido</b> en ese eje. Un bloque normal ocupa el ancho disponible y no pasa nada, pero un contenedor que es hijo flex sin tamaño, <code>inline-block</code> o <code>float</code> puede colapsar a ancho 0.</li>
<li><code>container-type: size</code> consulta ancho y alto, pero exige que el alto esté definido desde fuera: casi siempre quieres <code>inline-size</code>.</li>
<li><b>Consultas de estilo</b>: <code>@container style(--variante: compacta)</code> consulta el valor de una variable del contenedor. Funcionan en Chromium y Safari, todavía no en todos: úsalas como mejora.</li></ul>`},
 {t:"hueco", p:"Declara el contenedor y adapta la tarjeta cuando su hueco pasa de 28rem",
  tpl:".zona { container-type: ___; }\n@___ (width > 28rem) {\n  .tarjeta { grid-template-columns: 8rem 1fr; }\n}", banco:["inline-size","container","size","media","supports"], sol:["inline-size","container"],
  why:"inline-size consulta el ancho (en español, el eje inline es el horizontal) sin imponer restricciones al alto."},
 {t:"vf", p:"Las media queries y las container queries son lo mismo con distinto nombre.",
  ok:false, why:"Las media queries miran la ventana (o el dispositivo); las container queries, el tamaño de un ancestro concreto del componente."},
 {t:"opcion", p:"¿Qué pasará? <code>.tarjeta { container-type: inline-size; }</code> y <code>@container (width &gt; 30rem) { .tarjeta { display: flex; } }</code>",
  ops:["La tarjeta pasa a flex cuando mide más de 30rem","Nada: la regla busca un contenedor ANCESTRO de .tarjeta, y un elemento no puede consultarse a sí mismo","Da error de sintaxis","Se aplica siempre"],
  ok:1, why:"Pon el container-type en el envoltorio (o en el padre) y la regla sobre la tarjeta. Dentro de la tarjeta, sus hijos sí pueden reaccionar al tamaño de la tarjeta."},
 {t:"opcion", p:"Tu componente con container queries de repente mide 0 de ancho dentro de un <code>display: flex</code>. ¿Por qué?",
  ops:["Bug del navegador","El contenedor con inline-size ya no toma su ancho del contenido, y como hijo flex sin flex-grow ni width su tamaño natural queda en 0","Falta container-name","Hay que usar size"],
  ok:1, why:"Dale un tamaño desde fuera: flex: 1, width: 100% o un flex-basis."},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["container-type: inline-size","Convierte el elemento en contenedor consultable por ancho"],["container-name: lateral","Da nombre al contenedor para consultarlo en concreto"],["@container lateral (width < 20rem)","Estilos cuando ese contenedor es estrecho"],["4cqi","El 4 % del tamaño inline del contenedor"]],
  why:"Con esto, un sistema de diseño puede ofrecer componentes que funcionan en cualquier columna sin saber nada de la página."},
 {t:"escribe", p:"Escribe la abreviatura que declara un contenedor llamado <code>tarjeta</code> que se consulta por ancho",
  sol:["container: tarjeta / inline-size","container:tarjeta/inline-size","container: tarjeta/inline-size"], pista:"container: nombre / tipo",
  why:"Equivale a container-name: tarjeta; container-type: inline-size."}
]},

/* =============== U7 L3 =============== */
{
id:"cs7n2",
titulo:"Imágenes y medios adaptables",
claves:["img { max-width: 100%; height: auto; } y width/height en el HTML para reservar el espacio","aspect-ratio fija la proporción; object-fit: cover recorta sin deformar","srcset y sizes eligen el fichero; image-set() hace lo mismo en fondos CSS"],
pasos:[
 {t:"info", eti:"Imágenes", h:"Que se adapten sin deformarse ni mover la página",
  c:`<div class="termbox">img, video, svg { display: block; max-width: 100%; height: auto; }

/* recortes con proporción fija: miniaturas, avatares, portadas */
.miniatura { aspect-ratio: 4 / 3; width: 100%; object-fit: cover; }
.avatar { width: 48px; aspect-ratio: 1; border-radius: 50%; object-fit: cover; }
.foto-producto { object-fit: contain; background: #f4f4f4; }   /* entera, con bandas */
.retrato { object-fit: cover; object-position: top; }          /* recorta sin cortar la cabeza */

.video { aspect-ratio: 16 / 9; width: 100%; }                  /* iframe de vídeo sin trucos de padding */</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">object-fit (imagen en una caja de otra proporción)</div><table class="dg-tabla"><tbody>
<tr><td>fill</td><td>por defecto: se estira y se deforma</td></tr>
<tr><td>cover</td><td>llena la caja y recorta lo que sobra</td></tr>
<tr><td>contain</td><td>entera dentro de la caja, con bandas vacías</td></tr>
<tr><td>none / scale-down</td><td>tamaño natural / el menor entre natural y contain</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Sin saltos", h:"Reservar el espacio y servir el fichero justo",
  c:`<div class="termbox">&lt;!-- width y height dan la PROPORCIÓN; el CSS (height: auto) decide el tamaño real --&gt;
&lt;img src="foto-800.jpg" width="800" height="600" alt="…"
     srcset="foto-400.jpg 400w, foto-800.jpg 800w, foto-1600.jpg 1600w"
     sizes="(min-width: 48rem) 50vw, 100vw"
     loading="lazy" decoding="async"&gt;</div>
<p>Con <code>width</code> y <code>height</code> en el HTML, el navegador calcula la proporción antes de descargar la imagen y reserva el hueco: el texto no salta cuando la imagen llega (buen <b>CLS</b>). <code>srcset</code> ofrece varios ficheros y <code>sizes</code> dice cuánto ocupará la imagen, para que el navegador descargue el más pequeño que se vea nítido.</p>
<div class="termbox">.portada {
  background-image: image-set(url("portada.avif") type("image/avif"), url("portada.jpg") type("image/jpeg"));
  background-size: cover;        /* el equivalente a object-fit para fondos */
  background-position: center;
}</div>
<div class="nota ojo"><b class="tit">loading="lazy" no va en la portada</b>La imagen principal de la primera pantalla (la del LCP) debe cargar cuanto antes: sin lazy, y si acaso con <code>fetchpriority="high"</code>.</div>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["object-fit: cover","Llenar la caja recortando sin deformar"],["aspect-ratio: 16 / 9","Mantener una proporción fija"],["srcset y sizes","Que el navegador descargue el tamaño adecuado"],["width y height en el img","Reservar el hueco y evitar saltos (CLS)"],["loading=\"lazy\"","No descargar hasta que se acerca a la pantalla"]],
  why:"Las imágenes suelen ser lo que más pesa y lo que más mueve la página: estas cinco técnicas atacan las dos cosas."},
 {t:"opcion", p:"¿Qué pasará? Una foto de 1200×800 con <code>width: 200px; height: 200px</code> y sin más estilos",
  ops:["Se recorta a un cuadrado","Se estira y se ve deformada: object-fit vale fill por defecto","Mantiene la proporción con bandas","Se ignora el height"],
  ok:1, why:"Añade object-fit: cover para recortar sin deformar (y object-position si el recorte corta lo importante)."},
 {t:"hueco", p:"Miniaturas cuadradas que recortan sin deformar",
  tpl:".miniatura { width: 100%; ___: 1; object-fit: ___; }", banco:["aspect-ratio","cover","contain","ratio","fill"], sol:["aspect-ratio","cover"],
  why:"aspect-ratio: 1 equivale a 1 / 1. Con width fijado, el alto se deduce de la proporción."},
 {t:"escribe", p:"Escribe la regla CSS básica para que ninguna imagen se salga de su contenedor y mantenga su proporción",
  sol:["img { max-width: 100%; height: auto; }","img{max-width:100%;height:auto}","img { max-width: 100%; height: auto }","img {max-width: 100%; height: auto;}"], pista:"img { ancho máximo 100 %; alto automático }",
  why:"max-width y no width: una imagen pequeña no se estira hasta ocupar todo el ancho y pixelarse."},
 {t:"vf", p:"Poner <code>width</code> y <code>height</code> en un <code>&lt;img&gt;</code> impide que la imagen sea responsive.",
  ok:false, why:"Con height: auto en el CSS, esos atributos solo aportan la proporción para reservar espacio. Es la práctica recomendada."},
 {t:"opcion", p:"Tu portada es una imagen de fondo de 3 MB en JPEG que en móvil también se descarga entera. ¿Qué mejoras tienes en CSS?",
  ops:["background-size: contain","image-set() con AVIF/WebP y, con media queries, una versión más pequeña para móvil","opacity: 0 en móvil","Ninguna, las imágenes de fondo no se optimizan"],
  ok:1, why:"Ocultar con opacity o display: none no siempre evita la descarga. Cambiar la URL con media queries o image-set sí lo evita."}
]},

/* =============== U7 L4 =============== */
{
id:"cs7n3",
titulo:"Preferencias, entrada, impresión y @supports",
claves:["prefers-reduced-motion, prefers-color-scheme, prefers-contrast y forced-colors respetan los ajustes del usuario","(hover: hover) y (pointer: coarse) adaptan la interfaz a ratón o dedo","@media print para imprimir bien; @supports para usar lo nuevo con alternativa"],
pasos:[
 {t:"info", eti:"Preferencias", h:"Lo que el usuario ya te ha dicho",
  c:`<div class="termbox">@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
@media (prefers-color-scheme: dark) { :root { --fondo: #0d1016; --texto: #e6e9ef; } }
@media (prefers-contrast: more) { :root { --borde: #000; } }

/* modo de alto contraste de Windows: el sistema impone sus colores */
@media (forced-colors: active) {
  .boton { border: 2px solid ButtonText; }       /* colores del sistema */
}
.tarjeta { border: 1px solid transparent; }      /* en alto contraste el borde transparente SE VE */</div>
<p>En el modo de colores forzados desaparecen fondos y sombras: si un botón solo se distinguía por su fondo, se queda como texto suelto. Un borde transparente es invisible normalmente pero aparece en ese modo.</p>`},
 {t:"info", eti:"Entrada e impresión", h:"Ratón o dedo, pantalla o papel",
  c:`<div class="termbox">/* efectos hover solo donde hay ratón de verdad (en móvil el hover se queda «pegado») */
@media (hover: hover) and (pointer: fine) {
  .tarjeta:hover { transform: translateY(-2px); }
}
/* objetivos táctiles más grandes con dedo */
@media (pointer: coarse) { .boton { min-height: 44px; } }

@media print {
  nav, .anuncios, .boton { display: none; }
  body { font: 12pt/1.5 Georgia, serif; color: #000; background: none; }
  a[href^="http"]::after { content: " (" attr(href) ")"; }   /* la URL visible en papel */
  h2, h3 { break-after: avoid; }        /* no dejar un título solo al final de página */
  figure, tr { break-inside: avoid; }
}
@page { margin: 2cm; }

/* @supports: consultas de características */
.galeria { display: flex; flex-wrap: wrap; }
@supports (display: grid) and (grid-template-rows: subgrid) {
  .galeria { display: grid; grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); }
}
@supports selector(:has(a)) { /* estilos que dependen de :has */ }
@supports not (anchor-name: --a) { /* alternativa para navegadores sin anchor positioning */ }</div>`},
 {t:"par", p:"Empareja cada media feature con su uso",
  pares:[["prefers-reduced-motion: reduce","Quitar animaciones a quien se marea con ellas"],["forced-colors: active","Adaptarse al modo de alto contraste de Windows"],["hover: hover","Aplicar efectos hover solo con ratón"],["pointer: coarse","Agrandar los objetivos táctiles"],["prefers-contrast: more","Aumentar el contraste para quien lo pide"]],
  why:"Son ajustes que el usuario configura en su sistema operativo: respetarlos no cuesta casi nada."},
 {t:"opcion", p:"En móvil, al tocar una tarjeta se queda «levantada» con el efecto hover hasta que tocas otra cosa. ¿Cómo lo evitas?",
  ops:["Quitando el hover para todos","Envolviendo el efecto en @media (hover: hover) and (pointer: fine)","Con JavaScript que detecta el móvil","Con :active en lugar de :hover"],
  ok:1, why:"Los navegadores táctiles emulan :hover al tocar y lo mantienen. La media feature hover describe el dispositivo de entrada principal."},
 {t:"hueco", p:"Usa Grid solo si el navegador entiende subgrid, y oculta la navegación al imprimir",
  tpl:"@___ (grid-template-rows: subgrid) { .lista { display: grid; } }\n@media ___ { nav { display: none; } }", banco:["supports","print","screen","container","layer"], sol:["supports","print"],
  why:"@supports pregunta si el navegador entiende una declaración; @media print se aplica solo al imprimir o generar un PDF."},
 {t:"escribe", p:"Escribe la media query para quienes han pedido menos movimiento en su sistema",
  sol:["@media (prefers-reduced-motion: reduce)","@media(prefers-reduced-motion:reduce)","@media (prefers-reduced-motion:reduce)","(prefers-reduced-motion: reduce)"], pista:"@media (prefers-reduced-...: reduce)",
  why:"Hay personas con trastornos vestibulares a las que el parallax o los zooms les provocan mareo de verdad."},
 {t:"vf", p:"En el modo de colores forzados de Windows, un botón que solo se distingue por su color de fondo puede verse como texto normal.",
  ok:true, why:"El sistema sustituye fondos y colores. Añade un borde (aunque sea transparente) para que el contorno se mantenga."},
 {t:"opcion", p:"Quieres usar <code>display: grid</code> con <code>subgrid</code> pero tu empresa aún da soporte a un navegador antiguo sin subgrid. ¿Qué haces?",
  ops:["No usar subgrid nunca","Escribir primero una maqueta que funcione en todos y mejorarla dentro de @supports (grid-template-rows: subgrid)","Detectar el navegador con JavaScript","Mostrar un aviso para que actualicen"],
  ok:1, why:"Mejora progresiva: todos ven algo correcto y los navegadores modernos ven la versión mejor."}
]}

]});
