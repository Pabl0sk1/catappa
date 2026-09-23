window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Unidades, color y tipografía",
resumen: "Unidades relativas y de viewport, calc(), min(), max() y clamp(); color moderno con oklch, color-mix y colores relativos; tipografía y fuentes web",
nivel: "Fundamentos",
color: "#4f82e6",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"hc3l3",
titulo:"Unidades y funciones matemáticas",
claves:["px es fijo; rem depende de la raíz; em del propio elemento (y se acumula al anidar)","Viewport: vw/vh, y en móvil svh, lvh y dvh; ch para anchos de texto","calc(), min(), max() y clamp() mezclan unidades y crean tamaños fluidos con límites"],
pasos:[
 {t:"info", eti:"Medidas", h:"Unidades absolutas y relativas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">las unidades que usarás a diario</div><table class="dg-tabla"><thead><tr><th>unidad</th><th>relativa a</th><th>uso típico</th></tr></thead><tbody>
<tr><td>px</td><td>nada (píxel CSS)</td><td>bordes, sombras, detalles finos</td></tr>
<tr><td>rem</td><td>font-size de la raíz (&lt;html&gt;), 16px por defecto</td><td>textos, espacios, casi todo</td></tr>
<tr><td>em</td><td>font-size del propio elemento</td><td>padding de un botón que escala con su texto</td></tr>
<tr><td>%</td><td>el contenedor (depende de la propiedad)</td><td>anchos fluidos</td></tr>
<tr><td>vw / vh</td><td>1 % del ancho / alto de la ventana</td><td>secciones a pantalla completa</td></tr>
<tr><td>svh / lvh / dvh</td><td>alto pequeño / grande / dinámico en móvil</td><td>la portada que cabe en la pantalla</td></tr>
<tr><td>ch</td><td>ancho del carácter «0» de la fuente</td><td>max-width: 65ch para textos legibles</td></tr>
<tr><td>lh</td><td>la altura de línea del elemento</td><td>espacios que encajan con el texto</td></tr>
</tbody></table></div>
<div class="nota ojo"><b class="tit">El % engaña</b>En <code>width</code> es del ancho del contenedor. En <code>height</code>, del alto del contenedor, y solo funciona si ese alto está definido. Y en <code>padding</code> y <code>margin</code>, <b>incluso los verticales</b>, es del <b>ancho</b> del contenedor.</div>`},
 {t:"info", eti:"Móvil", h:"El problema de 100vh",
  c:`<div class="dg"><div class="dg-tit">alturas de viewport en un móvil</div>
<div class="dg-cols"><div class="dg-col"><div class="dg-col-tit">barras del navegador visibles</div><div class="dg-pila"><div class="dg-caja base">barra de direcciones</div><div class="dg-caja ok doble">100svh<small>alto pequeño: lo que siempre se ve</small></div><div class="dg-caja base">barra inferior</div></div></div>
<div class="dg-col"><div class="dg-col-tit">barras ocultas al hacer scroll</div><div class="dg-pila"><div class="dg-caja acento doble">100lvh<small>alto grande: pantalla entera</small></div></div></div></div>
<div class="dg-nota arriba">100dvh cambia en vivo entre uno y otro; el viejo 100vh equivale a lvh y deja contenido tapado por las barras</div></div>
<div class="termbox">.portada { min-height: 100vh; min-height: 100svh; }   /* alternativa + moderno */</div>
<p><code>dvh</code> parece el ideal, pero recalcula el diseño mientras aparecen y desaparecen las barras al hacer scroll: úsalo con moderación. Para una portada, <code>svh</code> suele ser la mejor elección.</p>`},
 {t:"info", eti:"Calcular", h:"calc(), min(), max() y clamp()",
  c:`<div class="termbox">.lateral { width: calc(100% - 240px); }         /* mezcla unidades; los espacios alrededor de + y - son obligatorios */
.contenedor { width: min(100% - 2rem, 70rem); margin-inline: auto; }   /* el menor: nunca más de 70rem */
.boton { min-height: max(44px, 2.5rem); }        /* el mayor: al menos 44px de área táctil */
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3rem); }   /* mínimo, preferido, máximo */</div>
<p><code>clamp(MIN, PREFERIDO, MAX)</code> es la base de la <b>tipografía fluida</b>: el tamaño crece con la ventana pero nunca baja de MIN ni pasa de MAX. Mezcla siempre <code>rem</code> con <code>vw</code> en el preferido: con <code>vw</code> solo, el texto no crecería al hacer zoom, y eso es un fallo de accesibilidad.</p>`},
 {t:"par", p:"Empareja cada unidad con su referencia",
  pares:[["px","Píxel CSS, tamaño fijo"],["rem","Tamaño de letra de la raíz (html)"],["em","Tamaño de letra del propio elemento"],["%","Porcentaje del contenedor"],["vw / vh","1% del ancho o alto de la ventana"],["ch","Ancho del carácter 0"]],
  why:"rem para textos y espacios respeta el tamaño de letra que el usuario elija en su navegador."},
 {t:"opcion", p:"¿Por qué usar <code>rem</code> para el tamaño de los textos en lugar de <code>px</code>?",
  ops:["Por estética","Porque escala si el usuario aumenta el tamaño de letra del navegador (accesibilidad)","Porque px no funciona en móviles","Por rendimiento"],
  ok:1, why:"Muchos usuarios con baja visión aumentan el tamaño base. Con px ignoras su preferencia (el zoom sí funcionaría, pero no el ajuste de tamaño de letra)."},
 {t:"opcion", p:"¿Qué pasará? <code>li { font-size: 1.2em }</code> con listas anidadas tres niveles, y el body a 16px",
  ops:["Todos los li miden 19,2px","Cada nivel es un 20 % mayor que el anterior: 19,2px, 23px, 27,6px","Todos miden 16px","El tercer nivel vuelve a 16px"],
  ok:1, why:"em se multiplica por el tamaño del padre, y el padre de un li anidado es otro li ya agrandado. Con 1.2rem todos medirían 19,2px."},
 {t:"hueco", p:"Un contenedor centrado que ocupa todo el ancho menos 2rem de margen pero no pasa de 70rem, y un título fluido",
  tpl:".contenedor { width: ___(100% - 2rem, 70rem); }\nh1 { font-size: ___(1.75rem, 1rem + 3vw, 3rem); }", banco:["min","clamp","max","calc","minmax"], sol:["min","clamp"],
  why:"min() coge el menor de los dos: en móvil 100% - 2rem, en pantallas grandes 70rem. minmax() existe, pero solo dentro de Grid."},
 {t:"escribe", p:"Escribe la declaración que limita un bloque de texto a unos 65 caracteres por línea",
  sol:["max-width: 65ch","max-width:65ch","max-inline-size: 65ch","max-inline-size:65ch"], pista:"Usa la unidad que mide el ancho de un carácter.",
  why:"Entre 45 y 75 caracteres por línea es lo cómodo de leer. Líneas más largas cansan: el ojo se pierde al volver al principio de la siguiente."},
 {t:"codigo", p:"Genera el <code>clamp()</code> de una tipografía fluida: lee <code>min max vpMin vpMax</code> (en px) e imprime la declaración",
  lenguaje:"js",
  c:`<p>El tamaño debe valer <code>min</code> con la ventana a <code>vpMin</code> y <code>max</code> a <code>vpMax</code>, en línea recta. Pendiente = (max − min) / (vpMax − vpMin); término fijo = min − pendiente × vpMin.</p>
<p>Salida: <code>clamp(MINrem, FIJOrem + PENDIENTEvw, MAXrem)</code>, con rem = px / 16, vw = pendiente × 100, y cada número redondeado a 3 decimales sin ceros sobrantes (<code>String(+x.toFixed(3))</code>).</p>
<p>Ejemplo: <code>16 32 320 960</code> → <code>clamp(1rem, 0.5rem + 2.5vw, 2rem)</code></p>`,
  plantilla:"const [min, max, vpMin, vpMax] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\n// calcula la pendiente y el término fijo\n",
  pruebas:[{entrada:"16 32 320 960\n", salida:"clamp(1rem, 0.5rem + 2.5vw, 2rem)"},{entrada:"20 40 400 1400\n", salida:"clamp(1.25rem, 0.75rem + 2vw, 2.5rem)"},{entrada:"18 24 360 1200\n", salida:"clamp(1.125rem, 0.964rem + 0.714vw, 1.5rem)", oculta:true}],
  pista:"const r = x =&gt; String(+x.toFixed(3)); la pendiente en vw es pendiente * 100 y el término fijo en rem es fijo / 16.",
  solucion:"const [min, max, vpMin, vpMax] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\nconst r = x => String(+x.toFixed(3));\nconst pendiente = (max - min) / (vpMax - vpMin);\nconst fijo = min - pendiente * vpMin;\nconsole.log(\"clamp(\" + r(min / 16) + \"rem, \" + r(fijo / 16) + \"rem + \" + r(pendiente * 100) + \"vw, \" + r(max / 16) + \"rem)\");",
  why:"Es lo que hacen generadores como Utopia. Al tener parte en rem, el tamaño sigue respondiendo al zoom y al tamaño de letra del usuario."}
]},

/* =============== U3 L2 =============== */
{
id:"cs3n1",
titulo:"Color moderno",
claves:["hex, rgb() y hsl() de siempre; oklch() para paletas uniformes y colores de pantallas modernas","color-mix() mezcla colores y la sintaxis relativa (from) deriva variantes de un color base","Contraste mínimo WCAG: 4,5:1 para texto normal y 3:1 para texto grande"],
pasos:[
 {t:"info", eti:"Formatos", h:"Maneras de escribir un color",
  c:`<div class="termbox">color: rebeccapurple;                 /* nombre */
color: #2563eb;                       /* hex: rr gg bb */
color: #2563eb80;                     /* hex con alfa (80 = 50 %) */
color: rgb(37 99 235);                /* sintaxis moderna: espacios, sin comas */
color: rgb(37 99 235 / 60%);          /* alfa tras la barra */
color: hsl(221 83% 53%);              /* tono, saturación, luminosidad */
color: oklch(55% 0.2 262);            /* luminosidad, croma, tono: perceptual */
color: oklch(70% 0.25 145);           /* un verde que solo cabe en pantallas P3 */
background: transparent;
border-color: currentColor;           /* el color del texto del elemento */</div>
<p><b>¿Por qué oklch?</b> En <code>hsl</code>, un amarillo y un azul con la misma «L» no parecen igual de claros: la luminosidad de HSL es matemática, no perceptual. En <code>oklch</code>, la L sí corresponde a lo que ve el ojo, así que puedes generar una paleta cambiando solo la L y todos los tonos se ven coherentes. Además llega a colores más vivos que sRGB en las pantallas que los admiten (P3), y el navegador ajusta en las que no.</p>`},
 {t:"info", eti:"Derivar", h:"color-mix(), colores relativos y light-dark()",
  c:`<div class="termbox">:root { --acento: oklch(60% 0.18 262); }

.boton:hover { background: color-mix(in oklch, var(--acento), black 15%); }   /* 15 % más oscuro */
.fondo-suave { background: color-mix(in srgb, var(--acento) 12%, white); }

/* sintaxis relativa: parte de un color y cambia sus canales */
.borde  { border-color: oklch(from var(--acento) calc(l - 0.1) c h); }   /* más oscuro */
.velo   { background: rgb(from var(--acento) r g b / 30%); }             /* con transparencia */

/* dos valores según el tema claro u oscuro (requiere color-scheme) */
:root { color-scheme: light dark; }
body { color: light-dark(#1f2328, #e6e9ef); }</div>
<p>Con esto, un sistema de diseño se construye a partir de <b>un solo color de marca</b>: hover, bordes, fondos y estados se derivan en CSS, sin una lista interminable de hexadecimales.</p>
<div class="nota ojo"><b class="tit">opacity o alfa</b><code>opacity: .5</code> vuelve semitransparente el elemento <b>entero con sus hijos</b> (texto incluido). Para que solo el fondo sea transparente, usa un color con alfa: <code>background: rgb(0 0 0 / 50%)</code>.</div>`},
 {t:"info", eti:"Accesibilidad", h:"Contraste",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">niveles de contraste WCAG 2</div><table class="dg-tabla"><thead><tr><th>nivel</th><th>texto normal</th><th>texto grande (≥ 24px, o ≥ 18,66px en negrita)</th></tr></thead><tbody>
<tr><td>AA (lo exigible)</td><td>4,5 : 1</td><td>3 : 1</td></tr>
<tr><td>AAA</td><td>7 : 1</td><td>4,5 : 1</td></tr>
<tr><td>iconos y bordes de controles</td><td colspan="2">3 : 1 con lo que tienen al lado</td></tr>
</tbody></table></div>
<p>El gris <code>#777</code> sobre blanco da 4,48:1 y <b>suspende</b> por poco; <code>#767676</code> da 4,54:1 y aprueba. DevTools te enseña el contraste al inspeccionar un color de texto.</p>`},
 {t:"par", p:"Empareja cada función con lo que hace",
  pares:[["rgb(0 0 0 / 50%)","Negro al 50 % de opacidad"],["oklch(60% 0.18 262)","Color por luminosidad perceptual, croma y tono"],["color-mix(in oklch, red, blue)","Mezcla a partes iguales de dos colores"],["oklch(from var(--c) l c h / 40%)","El mismo color con transparencia"],["light-dark(white, black)","Un valor para tema claro y otro para oscuro"]],
  why:"color-mix y la sintaxis relativa llevan desde 2023-2024 en todos los navegadores modernos."},
 {t:"opcion", p:"¿Qué pasará? Una tarjeta con <code>opacity: .5</code> para que su fondo se vea translúcido",
  ops:["Solo el fondo queda translúcido","El texto y todos los hijos también quedan al 50 %, y no se puede deshacer desde un hijo","Solo afecta al borde","No hace nada si hay texto"],
  ok:1, why:"Un hijo con opacity: 1 no recupera la opacidad: opacity se aplica al grupo entero. Para el fondo, un color con alfa."},
 {t:"hueco", p:"Genera el hover 20 % más oscuro mezclando con negro, y un borde que es el acento con 30 % de opacidad",
  tpl:".boton:hover { background: ___(in oklch, var(--acento), black 20%); }\n.boton { border-color: oklch(___ var(--acento) l c h / 30%); }", banco:["color-mix","from","mix","rgba","with"], sol:["color-mix","from"],
  why:"color-mix(in espacio, color1, color2 porcentaje). La sintaxis relativa empieza por from y luego nombra los canales, que puedes modificar con calc()."},
 {t:"vf", p:"En <code>hsl()</code>, dos colores con la misma luminosidad (la L) parecen igual de claros al ojo.",
  ok:false, why:"Ese es precisamente el defecto que corrige oklch: hsl(60 100% 50%) (amarillo) parece mucho más claro que hsl(240 100% 50%) (azul)."},
 {t:"codigo", p:"Calcula el contraste WCAG entre dos colores hex de cada línea de stdin e imprime la razón con 2 decimales y el nivel",
  lenguaje:"js",
  c:`<p>Para cada canal: <code>c = valor / 255</code>; lineal = <code>c &lt;= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4</code>. Luminancia <code>L = 0.2126 R + 0.7152 G + 0.0722 B</code>. Razón = <code>(Lclara + 0.05) / (Loscura + 0.05)</code>.</p>
<p>Nivel: <code>AAA</code> si ≥ 7, <code>AA</code> si ≥ 4.5, <code>AA grande</code> si ≥ 3, si no <code>no</code>. Ejemplo: <code>#777777 #ffffff</code> → <code>4.48 AA grande</code></p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const linea of lineas) {\n  const [a, b] = linea.split(\" \");\n  // calcula la luminancia de cada uno y la razón\n}\n",
  pruebas:[{entrada:"#000000 #ffffff\n#777777 #ffffff\n", salida:"21.00 AAA\n4.48 AA grande"},{entrada:"#767676 #ffffff\n#f5b642 #ffffff\n", salida:"4.54 AA\n1.80 no"},{entrada:"#ffffff #2563eb\n#1f2328 #f6f8fa\n#ff0000 #ffffff\n", salida:"5.17 AA\n14.84 AAA\n4.00 AA grande", oculta:true}],
  pista:"parseInt(hex.slice(1, 3), 16) da el rojo. Ordena las dos luminancias para que la mayor vaya arriba.",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst lum = hex => {\n  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)\n    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);\n  return 0.2126 * r + 0.7152 * g + 0.0722 * b;\n};\nfor (const linea of lineas) {\n  const [a, b] = linea.split(\" \");\n  const [claro, oscuro] = [lum(a), lum(b)].sort((x, y) => y - x);\n  const razon = (claro + 0.05) / (oscuro + 0.05);\n  const nivel = razon >= 7 ? \"AAA\" : razon >= 4.5 ? \"AA\" : razon >= 3 ? \"AA grande\" : \"no\";\n  console.log(razon.toFixed(2) + \" \" + nivel);\n}",
  why:"Es la fórmula de WCAG 2 que usan DevTools, Lighthouse y axe. El rojo puro sobre blanco se queda en 4:1: no vale para texto normal."},
 {t:"opcion", p:"Tu gris de texto secundario es <code>#999</code> sobre blanco (2,85:1). ¿Qué haces?",
  ops:["Nada, el gris claro es elegante","Oscurecerlo hasta al menos 4,5:1 (por ejemplo #767676) y comprobarlo en DevTools","Ponerlo en negrita y ya","Usar opacity en lugar de gris"],
  ok:1, why:"El texto gris claro es el fallo de accesibilidad más común de la web. En negrita solo bajaría el requisito a 3:1 si además es grande, y aun así 2,85 no llega."}
]},

/* =============== U3 L3 =============== */
{
id:"cs3n2",
titulo:"Tipografía",
claves:["font-family con alternativas terminando en una familia genérica; font como abreviatura","line-height sin unidad, medida de 45-75 caracteres y text-wrap: balance en títulos","Recortar texto con text-overflow: ellipsis o line-clamp; partir palabras largas con overflow-wrap"],
pasos:[
 {t:"info", eti:"Texto", h:"Las propiedades de texto que importan",
  c:`<div class="termbox">body {
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.6;           /* sin unidad: se hereda como factor */
  font-weight: 400;           /* 100 a 900; normal = 400, bold = 700 */
  -webkit-font-smoothing: antialiased;
}
code { font-family: ui-monospace, "Cascadia Code", Consolas, monospace; }

h1, h2 { line-height: 1.15; text-wrap: balance; }   /* reparte el título en líneas parejas */
p { text-wrap: pretty; max-width: 65ch; }          /* evita la palabra huérfana al final */
.versalitas { font-variant-caps: small-caps; letter-spacing: .05em; }
.cifras { font-variant-numeric: tabular-nums; }    /* números de igual ancho en tablas */
a { text-decoration-thickness: 2px; text-underline-offset: 3px; }
.etiqueta { text-transform: uppercase; }

/* abreviatura: estilo peso tamaño/altura familia (tamaño y familia obligatorios) */
.aviso { font: italic 600 1.125rem/1.4 system-ui, sans-serif; }</div>
<p>Termina siempre la lista de <code>font-family</code> en una <b>familia genérica</b> (<code>sans-serif</code>, <code>serif</code>, <code>monospace</code>, <code>system-ui</code>): si ninguna fuente está disponible, el navegador elige una del tipo correcto.</p>
<div class="nota"><b class="tit">text-wrap</b><code>balance</code> está en todos los navegadores modernos desde 2024; <code>pretty</code> aún no en todos. Ambas son mejoras progresivas: donde no se entienden, el texto se parte como siempre.</div>`},
 {t:"info", eti:"Recortar", h:"Texto que no cabe",
  c:`<div class="termbox">/* una línea con puntos suspensivos: hacen falta las tres */
.titulo-corto { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* varias líneas (hoy se escribe con prefijo, y funciona en todos) */
.resumen { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }

/* URLs o palabras enormes que rompen el diseño en móvil */
.comentario { overflow-wrap: anywhere; }
p { hyphens: auto; }   /* guiones de verdad; necesita lang="es" en el HTML */</div>`},
 {t:"hueco", p:"Recorta el título en una sola línea con puntos suspensivos",
  tpl:".titulo { white-space: ___; overflow: ___; text-overflow: ellipsis; }", banco:["nowrap","hidden","pre","visible","clip"], sol:["nowrap","hidden"],
  why:"Sin nowrap el texto salta de línea y nunca desborda; sin overflow: hidden desborda pero se ve entero. Las tres propiedades a la vez."},
 {t:"opcion", p:"¿Qué pasará? <code>font: bold 16px;</code>",
  ops:["Texto en negrita a 16px","Se ignora la declaración entera: la abreviatura font exige también la familia","Solo se aplica la negrita","Solo se aplica el tamaño"],
  ok:1, why:"En font, el tamaño y la familia son obligatorios. Y ojo: la abreviatura reinicia a su valor inicial todo lo que no pongas (line-height incluido)."},
 {t:"par", p:"Empareja cada propiedad con su efecto",
  pares:[["text-wrap: balance","Reparte un título en líneas de longitud parecida"],["font-variant-numeric: tabular-nums","Cifras del mismo ancho, alineadas en columnas"],["overflow-wrap: anywhere","Parte una palabra larguísima para que no desborde"],["text-underline-offset","Separa el subrayado del texto"],["hyphens: auto","Añade guiones al partir palabras"]],
  why:"Detalles pequeños que separan una web cuidada de una que «funciona»."},
 {t:"escribe", p:"Escribe una lista de <code>font-family</code> que use la fuente del sistema operativo y, si no, cualquier sans-serif",
  sol:["font-family: system-ui, sans-serif","system-ui, sans-serif","font-family:system-ui,sans-serif"], pista:"La genérica que representa la fuente del sistema, seguida de sans-serif.",
  why:"system-ui es la fuente de la interfaz del sistema (San Francisco, Segoe UI, Roboto…): cero descargas y aspecto nativo."},
 {t:"vf", p:"<code>line-height: 1.6</code> (sin unidad) se multiplica por el tamaño de letra de cada elemento.",
  ok:true, why:"Sin unidad se hereda como factor, lo que evita alturas de línea raras en elementos con otro tamaño. Para títulos grandes, baja a 1.1-1.25."},
 {t:"opcion", p:"Un comentario con una URL larguísima desborda la tarjeta en móvil y crea scroll horizontal. ¿Qué pones?",
  ops:["overflow: scroll en el body","overflow-wrap: anywhere (o word-break: break-word) en el texto","font-size más pequeño","white-space: nowrap"],
  ok:1, why:"overflow-wrap solo parte palabras cuando no caben, así que no afecta al texto normal."}
]},

/* =============== U3 L4 =============== */
{
id:"cs3n3",
titulo:"Fuentes web y fuentes variables",
claves:["@font-face declara una fuente propia; WOFF2 es el único formato que necesitas","font-display: swap muestra texto al momento; optional evita saltos; preload adelanta la descarga","Una fuente variable cubre todos los pesos en un fichero; size-adjust ajusta la alternativa para evitar saltos (CLS)"],
pasos:[
 {t:"info", eti:"Fuentes propias", h:"@font-face",
  c:`<div class="termbox">@font-face {
  font-family: "Inter";
  src: url("/fuentes/inter-var.woff2") format("woff2");
  font-weight: 100 900;          /* fuente VARIABLE: un fichero, todos los pesos */
  font-style: normal;
  font-display: swap;            /* muestra ya el texto con la alternativa y cambia al llegar */
  unicode-range: U+0000-00FF, U+0131, U+2000-206F;   /* solo se descarga si la página usa esos caracteres */
}
body { font-family: "Inter", system-ui, sans-serif; }
h1 { font-weight: 650; }          /* cualquier peso intermedio en una variable */
.estrecho { font-stretch: 85%; }
.ajuste { font-variation-settings: "wght" 520, "slnt" -6; }   /* ejes a mano */</div>
<div class="termbox">&lt;!-- en el &lt;head&gt;: descarga la fuente de la primera pantalla cuanto antes --&gt;
&lt;link rel="preload" href="/fuentes/inter-var.woff2" as="font" type="font/woff2" crossorigin&gt;</div>
<p>Sin <code>crossorigin</code>, el preload de una fuente se descarga dos veces: las fuentes siempre se piden en modo CORS.</p>`},
 {t:"info", eti:"Cargar sin saltos", h:"font-display y el salto de la fuente",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">font-display: qué se ve mientras llega la fuente</div><table class="dg-tabla"><thead><tr><th>valor</th><th>comportamiento</th><th>cuándo</th></tr></thead><tbody>
<tr><td>block</td><td>texto invisible hasta ~3 s (FOIT)</td><td>fuentes de iconos</td></tr>
<tr><td>swap</td><td>alternativa ya; cambia cuando llega (FOUT)</td><td>el más común</td></tr>
<tr><td>fallback</td><td>~100 ms invisible; si tarda más de ~3 s se queda la alternativa</td><td>término medio</td></tr>
<tr><td>optional</td><td>solo la usa si llega casi al instante (o está en caché)</td><td>cero saltos de diseño</td></tr>
</tbody></table></div>
<p>El cambio de fuente mueve el texto (la alternativa tiene otras medidas) y eso cuenta en el <b>CLS</b>. Se suaviza ajustando la alternativa a las métricas de la fuente web:</p>
<div class="termbox">@font-face {
  font-family: "Inter Alternativa";
  src: local("Arial");
  size-adjust: 107%;          /* iguala el ancho medio de las letras */
  ascent-override: 90%;
}
body { font-family: "Inter", "Inter Alternativa", sans-serif; }</div>
<p>Next.js (<code>next/font</code>) y herramientas como Fontaine calculan estos valores solos.</p>
<div class="nota ojo"><b class="tit">Alojarlas tú</b>Sirve las fuentes desde tu dominio en vez de enlazar a Google Fonts: te ahorras una conexión a otro servidor y evitas enviar la IP de tus visitantes a un tercero (en 2022 un tribunal alemán condenó a una web a indemnizar a un visitante por eso).</div>`},
 {t:"par", p:"Empareja cada valor de <code>font-display</code> con su comportamiento",
  pares:[["block","Texto invisible un rato mientras llega la fuente"],["swap","Alternativa inmediata y cambio al llegar"],["optional","Solo usa la fuente si llega casi al instante"],["fallback","Un momento invisible y, si tarda, se queda la alternativa"]],
  why:"swap para la mayoría de webs; optional si el CLS es crítico y la fuente es decorativa."},
 {t:"hueco", p:"Completa el preload de la fuente de la portada",
  tpl:"<link rel=\"preload\" href=\"/f/inter.woff2\" as=\"___\" type=\"font/woff2\" ___>", banco:["font","crossorigin","style","async","defer"], sol:["font","crossorigin"],
  why:"as=\"font\" le dice al navegador la prioridad y el tipo; crossorigin hace que la petición coincida con la que hará @font-face y se reutilice."},
 {t:"opcion", p:"Tu web carga 6 ficheros de Inter (400, 500, 600, 700 y sus cursivas). ¿Qué mejora tienes a mano?",
  ops:["Cambiar a TTF","Usar la versión variable de Inter: un fichero para todos los pesos (y otro para las cursivas)","Cargar las fuentes con JavaScript","Usar font-display: block"],
  ok:1, why:"Una fuente variable suele pesar menos que 3-4 estáticas juntas y te da cualquier peso intermedio."},
 {t:"vf", p:"Hoy basta con servir las fuentes en formato WOFF2.",
  ok:true, why:"Todos los navegadores actuales lo soportan y es el formato más comprimido. EOT, TTF y SVG son de otra época."},
 {t:"opcion", p:"Lighthouse marca CLS por el cambio de fuente en el título principal. ¿Qué haces?",
  ops:["Quitar el título","Ajustar la fuente alternativa con size-adjust y ascent-override (o usar font-display: optional) y hacer preload de la fuente","Poner el título en una imagen","Subir el font-size"],
  ok:1, why:"El salto viene de la diferencia de métricas entre alternativa y fuente final: se reduce igualándolas o evitando el cambio."}
]}

]});
