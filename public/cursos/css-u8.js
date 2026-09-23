window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Variables, temas y CSS moderno",
resumen: "Variables CSS a fondo y @property, temas claro y oscuro con color-scheme y light-dark(), anidación nativa, propiedades lógicas, scroll moderno y posicionamiento con anclas",
nivel: "Avanzado",
color: "#2650ae",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"hc5l2",
titulo:"Variables CSS (custom properties)",
claves:["--nombre: valor define una variable; var(--nombre, alternativa) la usa","Se heredan y se pueden redefinir en cualquier elemento: el componente cambia sin tocar sus reglas","Un var() que produce un valor inválido deja la propiedad en unset; @property le da tipo, valor inicial y la hace animable"],
pasos:[
 {t:"info", eti:"Tokens de diseño", h:"Definir, usar y redefinir",
  c:`<div class="termbox">:root {
  --acento: #2563eb;
  --radio: 12px;
  --espacio: 1rem;
}
.boton {
  background: var(--acento);
  border-radius: var(--radio);
  padding: calc(var(--espacio) / 2) var(--espacio);
  color: var(--boton-texto, white);          /* alternativa si --boton-texto no existe */
}
.boton.peligro { --acento: crimson; }          /* la variante solo cambia la variable */
.compacto { --espacio: .5rem; }                /* todo lo de dentro se compacta */

/* números sin unidad: la unidad se pone al usarlos */
.barra { --progreso: 40; width: calc(var(--progreso) * 1%); }</div>
<p>Las variables son propiedades normales con dos diferencias: se <b>heredan</b> siempre y su valor no se interpreta hasta que se usa con <code>var()</code>. Por eso se pueden cambiar desde JavaScript o desde un atributo <code>style</code> sin tocar el CSS:</p>
<div class="termbox">el.style.setProperty("--progreso", 75);
getComputedStyle(document.documentElement).getPropertyValue("--acento");   // "#2563eb"</div>
<div class="nota ojo"><b class="tit">Límites</b>Distinguen mayúsculas (<code>--Acento</code> ≠ <code>--acento</code>). No sirven en las condiciones de una media query (<code>@media (min-width: var(--x))</code> no funciona) ni para construir nombres de propiedades o selectores.</div>`},
 {t:"info", eti:"Por dentro", h:"Inválido en tiempo de cálculo y @property",
  c:`<div class="termbox">.aviso {
  color: blue;
  color: var(--color-aviso);    /* si --color-aviso vale "20px"... */
}
/* ...el color NO vuelve al blue de arriba: la segunda declaración ganó la cascada
   (en ese momento no se sabe qué valdrá la variable) y al calcularla es inválida,
   así que la propiedad pasa a unset: color heredado del padre. */</div>
<div class="termbox">@property --angulo {
  syntax: "&lt;angle&gt;";      /* tipo: &lt;length&gt;, &lt;color&gt;, &lt;number&gt;, &lt;percentage&gt;... */
  inherits: false;
  initial-value: 0deg;
}
.anillo {
  background: conic-gradient(var(--acento) var(--angulo), transparent 0);
  transition: --angulo 1s;      /* ¡se puede animar! sin @property, saltaría de golpe */
}
.anillo:hover { --angulo: 270deg; }</div>
<p>Una variable normal es texto: el navegador no sabe si <code>270deg</code> es un ángulo, así que no puede interpolar. Con <code>@property</code> sí, y además un valor del tipo incorrecto se descarta y se usa <code>initial-value</code>. Funciona en todos los navegadores desde 2024.</p>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["--acento: #2563eb","Definir un token reutilizable"],["var(--acento)","Usar el token"],["var(--x, 8px)","Usar el token con un valor de reserva"],[".peligro { --acento: crimson }","Crear una variante redefiniendo la variable"],["@property --angulo","Registrar la variable con tipo para poder animarla"]],
  why:"Redefinir variables en vez de reescribir propiedades hace que las variantes sean una línea."},
 {t:"opcion", p:"¿Qué pasará? <code>p { color: red; color: var(--no-existe); }</code> dentro de un <code>div</code> de color azul",
  ops:["Rojo: la segunda declaración falla y se usa la primera","Azul: la segunda gana la cascada, al calcularla es inválida y color pasa a unset (heredado)","Negro","Transparente"],
  ok:1, why:"Es «inválido en tiempo de cálculo»: la alternativa anterior ya fue descartada por la cascada. Por eso se usa var(--x, reserva) cuando la variable puede no existir."},
 {t:"hueco", p:"Usa el color de texto de la variable o, si no existe, blanco; y crea la variante de peligro",
  tpl:".boton { color: var(--texto___ white); }\n.boton.peligro { ___: crimson; }", banco:[",","--acento","var(--acento)",";","acento"], sol:[",","--acento"],
  why:"La alternativa va tras una coma dentro de var(). La variante redefine la variable, no la propiedad."},
 {t:"escribe", p:"Escribe la línea de JavaScript que pone <code>--progreso</code> a 75 en el elemento <code>el</code>",
  sol:["el.style.setProperty(\"--progreso\", 75)","el.style.setProperty('--progreso', 75)","el.style.setProperty(\"--progreso\", \"75\")","el.style.setProperty('--progreso', '75')","el.style.setProperty(\"--progreso\",75);"], pista:"el.style.setProperty(nombre, valor)",
  why:"Así se conectan datos de JavaScript (progreso, posición del ratón, colores elegidos) con el CSS, sin generar estilos en línea para cada propiedad."},
 {t:"vf", p:"<code>@media (min-width: var(--movil))</code> funciona si defines <code>--movil</code> en <code>:root</code>.",
  ok:false, why:"Las variables pertenecen a elementos, y una media query no se evalúa sobre ningún elemento. Para compartir puntos de ruptura se usan preprocesadores o variables del empaquetador."},
 {t:"opcion", p:"Quieres animar con <code>transition</code> un degradado que depende de <code>--angulo</code>, pero salta de golpe. ¿Qué falta?",
  ops:["Un !important","Registrar --angulo con @property y syntax: \"&lt;angle&gt;\"","Poner la transición en background","Usar JavaScript"],
  ok:1, why:"Sin tipo, el navegador no puede calcular los valores intermedios de un texto. Con @property sabe que es un ángulo e interpola."}
]},

/* =============== U8 L2 =============== */
{
id:"cs8n1",
titulo:"Temas claro y oscuro",
claves:["Tokens en dos niveles: primitivos (azul-500) y semánticos (--fondo, --texto) que cambian con el tema","color-scheme: light dark adapta controles, barras de scroll y colores del sistema; light-dark() elige valor","Tema del sistema por defecto, elección manual con data-theme guardada, y sin parpadeo al cargar"],
pasos:[
 {t:"info", eti:"Arquitectura", h:"Tokens semánticos",
  c:`<div class="dg"><div class="dg-tit">tres niveles: nadie usa los primitivos directamente</div>
<div class="dg-vert">
<div class="dg-caja base doble">primitivos<small>--gris-50: #f6f8fa; --gris-900: #0d1016; --azul-600: #2563eb</small></div>
<div class="dg-caja acento doble">semánticos (cambian con el tema)<small>--fondo, --texto, --texto-suave, --borde, --acento</small></div>
<div class="dg-caja ok doble">componentes<small>.tarjeta { background: var(--fondo-elevado); color: var(--texto); }</small></div>
</div></div>
<div class="termbox">:root {
  color-scheme: light dark;              /* esta página sabe pintarse en los dos */
  --fondo: #ffffff;  --texto: #1f2328;  --borde: #d0d7de;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --fondo: #0d1016; --texto: #e6e9ef; --borde: #30363d; }
}
:root[data-theme="dark"] { color-scheme: dark; --fondo: #0d1016; --texto: #e6e9ef; --borde: #30363d; }
:root[data-theme="light"] { color-scheme: light; }

body { background: var(--fondo); color: var(--texto); }</div>
<p>Así el tema sigue al sistema por defecto, y si el usuario elige uno a mano (<code>data-theme</code>), ese manda.</p>`},
 {t:"info", eti:"Detalles", h:"color-scheme, light-dark() y el parpadeo",
  c:`<div class="termbox">/* light-dark(): un valor para cada esquema, sin media query (requiere color-scheme) */
:root { color-scheme: light dark; }
.tarjeta { background: light-dark(#fff, #161b22); box-shadow: 0 1px 3px light-dark(#0002, #0008); }</div>
<p><code>color-scheme</code> hace mucho más que parece: cambia el fondo por defecto de la página, los campos de formulario, las casillas, las barras de scroll y los colores del sistema. Sin él, en tu tema oscuro aparecen inputs blancos y barras de scroll claras.</p>
<div class="termbox">&lt;!-- en el &lt;head&gt;, ANTES del CSS: aplica el tema guardado sin parpadeo --&gt;
&lt;meta name="color-scheme" content="light dark"&gt;
&lt;script&gt;
  const t = localStorage.getItem("tema");
  if (t) document.documentElement.dataset.theme = t;
&lt;/script&gt;</div>
<div class="nota"><b class="tit">Oscuro bien hecho</b>Evita el negro puro (#000) de fondo y el blanco puro de texto: cansan la vista. Las sombras casi no se ven en oscuro: la elevación se expresa con fondos un poco más claros. Y revisa el contraste de los dos temas, no solo del claro.</div>`},
 {t:"opcion", p:"Tu tema oscuro queda bien, pero los campos de formulario siguen blancos y la barra de scroll es clara. ¿Qué falta?",
  ops:["Estilar cada input a mano","color-scheme: dark (o light dark) en :root","Una imagen de fondo","filter: invert(1)"],
  ok:1, why:"color-scheme le dice al navegador que pinte sus propios controles en oscuro."},
 {t:"hueco", p:"Declara que la página admite ambos esquemas y da un fondo distinto a cada uno sin media query",
  tpl:":root { ___: light dark; }\n.tarjeta { background: ___(#ffffff, #161b22); }", banco:["color-scheme","light-dark","prefers-color-scheme","theme","color-mix"], sol:["color-scheme","light-dark"],
  why:"light-dark() lleva en todos los navegadores desde 2024. El primer valor es para claro y el segundo para oscuro."},
 {t:"opcion", p:"Al recargar, tu web aparece un instante en claro y luego salta al oscuro que eligió el usuario. ¿Cómo lo evitas?",
  ops:["Con una animación de fundido","Aplicando el data-theme guardado con un script pequeño en el &lt;head&gt;, antes de que se pinte nada","Cargando el CSS al final","Guardando el tema en una cookie y esperando al servidor"],
  ok:1, why:"Si el tema se aplica en un script al final del body o tras cargar el framework, el navegador ya ha pintado el tema por defecto."},
 {t:"par", p:"Empareja cada nivel de token con un ejemplo",
  pares:[["Primitivo","--azul-600: #2563eb"],["Semántico","--acento: var(--azul-600)"],["De componente","--boton-fondo: var(--acento)"],["Preferencia del sistema","@media (prefers-color-scheme: dark)"]],
  why:"Cambiar de tema es redefinir los semánticos; cambiar de marca, los primitivos. Los componentes no se tocan."},
 {t:"vf", p:"Un tema oscuro se consigue bien con <code>html { filter: invert(1) }</code>.",
  ok:false, why:"Invierte también fotos, logos y vídeos, rompe los colores de marca y cuesta rendimiento. Un tema de verdad se construye con variables."},
 {t:"escribe", p:"Escribe la media query que detecta que el sistema del usuario está en modo oscuro",
  sol:["@media (prefers-color-scheme: dark)","@media(prefers-color-scheme:dark)","@media (prefers-color-scheme:dark)","(prefers-color-scheme: dark)"], pista:"@media (prefers-color-scheme: …)",
  why:"Esta plataforma la usa para su tema «sistema»."}
]},

/* =============== U8 L3 =============== */
{
id:"hc5l3",
titulo:"Anidación nativa y propiedades lógicas",
claves:["La anidación nativa permite escribir reglas dentro de otras, con &amp; para el propio selector","Se comporta como :is(): la especificidad la marca el selector más fuerte de la lista del padre; no concatena como Sass (&amp;__titulo no existe)","Propiedades lógicas (inline/block, start/end) que funcionan en cualquier dirección de escritura"],
pasos:[
 {t:"info", eti:"Anidar", h:"Anidación nativa",
  c:`<div class="termbox">.tarjeta {
  padding: 1rem;
  border: 1px solid var(--borde);

  &amp;:hover { border-color: var(--acento); }       /* .tarjeta:hover */
  &amp;.destacada { border-width: 2px; }              /* .tarjeta.destacada */
  .titulo { font-weight: 700; }                     /* .tarjeta .titulo */
  &gt; img { border-radius: 8px; }                     /* .tarjeta &gt; img */
  &amp; + &amp; { margin-top: 1rem; }                       /* .tarjeta + .tarjeta */
  .tema-oscuro &amp; { background: #161b22; }          /* .tema-oscuro .tarjeta */

  @media (width &gt;= 48rem) { padding: 2rem; }       /* media queries dentro */
}</div>
<p>Está en todos los navegadores desde 2023 (y desde finales de 2023 ya no hace falta el <code>&amp;</code> delante de un selector de tipo). Para mucha gente elimina la última razón para usar Sass.</p>
<div class="nota ojo"><b class="tit">No es Sass</b><code>&amp;__titulo</code> en Sass genera <code>.tarjeta__titulo</code>. En CSS nativo, <code>&amp;</code> representa al selector entero como un <code>:is()</code>, no un texto que se concatena: <code>&amp;__titulo</code> no produce lo que esperas. Y como es un <code>:is()</code>, <code>#a, .b { &amp; p {} }</code> da a <code>.b p</code> la especificidad de un id.</div>`},
 {t:"info", eti:"Cualquier idioma", h:"Propiedades lógicas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">físicas y lógicas (en español, de izquierda a derecha y de arriba abajo)</div><table class="dg-tabla"><thead><tr><th>física</th><th>lógica</th></tr></thead><tbody>
<tr><td>margin-left / margin-right</td><td>margin-inline-start / margin-inline-end</td></tr>
<tr><td>padding-top y padding-bottom</td><td>padding-block</td></tr>
<tr><td>width / height</td><td>inline-size / block-size</td></tr>
<tr><td>top / left</td><td>inset-block-start / inset-inline-start</td></tr>
<tr><td>text-align: left</td><td>text-align: start</td></tr>
<tr><td>border-top-left-radius</td><td>border-start-start-radius</td></tr>
</tbody></table></div>
<p>En árabe o hebreo (<code>dir="rtl"</code>), <code>margin-inline-start</code> pasa a ser el margen derecho sin que cambies nada. Con <code>writing-mode: vertical-rl</code> (japonés vertical, rótulos de tablas), <b>inline</b> pasa a ser vertical. Las abreviaturas <code>margin-inline</code> y <code>padding-block</code> son además más cortas: úsalas por defecto.</p>`},
 {t:"hueco", p:"Anida el hover y la variante destacada dentro de la regla de la tarjeta",
  tpl:".tarjeta {\n  ___:hover { border-color: blue; }\n  &.___ { border-width: 2px; }\n}", banco:["&","destacada","&&","this",":scope"], sol:["&","destacada"],
  why:"&amp;:hover y &amp;.destacada se pegan al selector padre. Sin el &amp;, :hover anidado significaría «un descendiente en hover»."},
 {t:"opcion", p:"¿Qué pasará en CSS nativo? <code>.tarjeta { &amp;__titulo { color: red; } }</code>",
  ops:["Se aplica a .tarjeta__titulo, como en Sass","No selecciona .tarjeta__titulo: el &amp; no concatena texto, representa al selector completo","Da color rojo a .tarjeta","Selecciona todos los títulos"],
  ok:1, why:"Si usas BEM con CSS nativo, escribe .tarjeta__titulo como regla aparte (o sigue usando Sass para eso)."},
 {t:"par", p:"Empareja cada propiedad física con su equivalente lógica",
  pares:[["margin-left","margin-inline-start"],["padding-top y padding-bottom","padding-block"],["width","inline-size"],["text-align: right","text-align: end"]],
  why:"En un idioma de derecha a izquierda, las lógicas se dan la vuelta solas."},
 {t:"escribe", p:"Escribe la declaración lógica que centra un bloque horizontalmente con márgenes automáticos",
  sol:["margin-inline: auto","margin-inline:auto"], pista:"margin en el eje inline, automático.",
  why:"Equivale a margin-left: auto; margin-right: auto; en español."},
 {t:"vf", p:"Una regla anidada <code>.menu { a { color: red } }</code> selecciona los enlaces descendientes de <code>.menu</code>.",
  ok:true, why:"Sin &amp;, un selector anidado se une con un espacio: .menu a. Desde finales de 2023 no hace falta anteponer &amp; a los selectores de tipo."},
 {t:"opcion", p:"Tu web se va a traducir al árabe. ¿Qué parte del CSS te ahorra más trabajo si ya está bien hecha?",
  ops:["Los colores","Haber usado propiedades lógicas (margin-inline-start, inset-inline, text-align: start) en vez de left y right","Las fuentes web","Las animaciones"],
  ok:1, why:"Con dir=\"rtl\" en el HTML, todo lo lógico se refleja solo. Lo físico hay que reescribirlo a mano."}
]},

/* =============== U8 L4 =============== */
{
id:"cs8n2",
titulo:"Scroll moderno y posicionamiento con anclas",
claves:["scroll-behavior: smooth y scroll-margin-top para que los enlaces internos no queden bajo la cabecera fija","scroll-snap crea carruseles y galerías que encajan sin JavaScript","anchor positioning coloca tooltips y menús junto a su elemento, con alternativas si no caben"],
pasos:[
 {t:"info", eti:"Desplazamiento", h:"Scroll suave y anclas bajo la cabecera",
  c:`<div class="termbox">@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }      /* solo si el usuario no pidió menos movimiento */
}
/* la cabecera sticky mide 4rem: que el destino de #seccion no quede tapado */
:target, h2[id] { scroll-margin-top: 5rem; }
/* o en el contenedor de scroll, para todos los destinos */
html { scroll-padding-top: 5rem; }</div>`},
 {t:"info", eti:"Carruseles", h:"scroll-snap",
  c:`<div class="termbox">.carrusel {
  display: flex; gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;   /* eje x; mandatory siempre encaja, proximity solo si está cerca */
  overscroll-behavior-x: contain;
  scroll-padding-inline: 1rem;
}
.carrusel &gt; * {
  flex: 0 0 80%;
  scroll-snap-align: start;        /* dónde encaja cada tarjeta: start, center, end */
  scroll-snap-stop: always;        /* no saltarse tarjetas con un gesto rápido */
}</div>
<div class="dg"><div class="dg-tit">scroll-snap-type: x mandatory</div>
<div class="dg-flujo"><div class="dg-caja base">tarjeta 1 (ya pasada)</div><div class="dg-caja acento">tarjeta 2: encaja al inicio</div><div class="dg-caja">tarjeta 3 (asoma)</div></div>
<div class="dg-nota arriba">que asome la siguiente tarjeta le dice al usuario que puede deslizar</div></div>
<div class="nota ojo"><b class="tit">mandatory con cuidado</b>Si un elemento es más alto (o ancho) que el contenedor, <code>mandatory</code> puede impedir ver su parte central. Para páginas de secciones verticales, <code>proximity</code> es más amable.</div>`},
 {t:"info", eti:"Anclas", h:"Posicionamiento con anclas",
  c:`<div class="termbox">.boton-ayuda { anchor-name: --ayuda; }

.globo {
  position: absolute;
  position-anchor: --ayuda;
  position-area: top;                 /* encima del ancla, centrado */
  margin-bottom: 8px;
  position-try-fallbacks: flip-block; /* si no cabe arriba, debajo */
}
/* o con más control: top: anchor(bottom); left: anchor(center); */</div>
<p>Es la pieza que faltaba para tooltips, menús desplegables y globos de ayuda sin librerías de JavaScript de posicionamiento. Combinado con el atributo <code>popover</code> (capa superior) resuelve también el z-index y el overflow. Llegó a Chromium en 2024 y a Safari en 2025: comprueba el soporte en Baseline para tu público y úsalo con <code>@supports (anchor-name: --a)</code> y una alternativa.</p>`},
 {t:"opcion", p:"Al pulsar un enlace del índice (<code>#precios</code>), el título de la sección queda escondido bajo tu cabecera sticky. ¿Qué pones?",
  ops:["Un div vacío de 80px antes de cada título","scroll-margin-top en los destinos (o scroll-padding-top en html) con la altura de la cabecera","JavaScript que resta 80px","position: fixed en los títulos"],
  ok:1, why:"scroll-margin afecta solo a dónde se detiene el scroll al saltar a ese elemento, sin cambiar el diseño."},
 {t:"hueco", p:"Un carrusel horizontal que siempre encaja cada tarjeta al principio",
  tpl:".carrusel { overflow-x: auto; scroll-snap-type: x ___; }\n.carrusel > * { scroll-snap-___: start; }", banco:["mandatory","align","proximity","stop","type"], sol:["mandatory","align"],
  why:"scroll-snap-type va en el contenedor de scroll; scroll-snap-align en cada hijo."},
 {t:"vf", p:"<code>scroll-behavior: smooth</code> debería respetar <code>prefers-reduced-motion</code>.",
  ok:true, why:"Un scroll animado largo puede marear. Aplícalo solo dentro de @media (prefers-reduced-motion: no-preference)."},
 {t:"par", p:"Empareja cada propiedad con su efecto",
  pares:[["scroll-snap-type: x mandatory","El contenedor siempre encaja en un hijo al deslizar"],["scroll-snap-stop: always","No se salta hijos con un gesto rápido"],["scroll-margin-top","Margen al saltar a un destino con un enlace"],["anchor-name","Marca un elemento como ancla para otros"],["position-try-fallbacks","Posiciones alternativas si no cabe"]],
  why:"Todo esto antes requería JavaScript y escuchar el evento scroll."},
 {t:"escribe", p:"Escribe la declaración que hace que el destino de un enlace interno se detenga 5rem por debajo del borde superior",
  sol:["scroll-margin-top: 5rem","scroll-margin-top:5rem","scroll-margin-block-start: 5rem","scroll-margin-block-start:5rem"], pista:"scroll-margin en el lado de arriba.",
  why:"La versión lógica es scroll-margin-block-start."},
 {t:"opcion", p:"Tus menús desplegables se cortan porque su contenedor tiene <code>overflow: hidden</code>, y además quedan detrás de otros elementos. ¿La solución moderna?",
  ops:["Quitar todos los overflow de la página","Convertirlos en popover (capa superior, fuera de overflow y z-index) y colocarlos junto al botón con anchor positioning","z-index: 99999","Duplicar el menú fuera del contenedor con JavaScript"],
  ok:1, why:"La capa superior no está sujeta al overflow ni a los contextos de apilamiento de sus ancestros. Anchor positioning la vuelve a pegar al botón."}
]}

]});
