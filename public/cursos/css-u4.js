window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "El modelo de caja y el flujo",
resumen: "Cajas, box-sizing y tamaños intrínsecos; márgenes que colapsan; display, flujo normal y contextos de formato de bloque; overflow; posicionamiento, z-index y contextos de apilamiento",
nivel: "Intermedio",
color: "#4577dc",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"hc4l1",
titulo:"El modelo de caja",
claves:["Cada elemento es una caja: contenido, padding, borde y margen","box-sizing: border-box hace que width incluya padding y borde","Tamaños: width/height, min-/max-, y los intrínsecos min-content, max-content y fit-content"],
pasos:[
 {t:"info", eti:"Todo son cajas", h:"Contenido, relleno, borde y margen",
  c:`<div class="dg"><div class="dg-tit">el modelo de caja</div>
<div class="dg-caja base" style="border-style:dashed;text-align:left">margin
<div class="dg-caja" style="margin-top:6px;border-width:3px;text-align:left">border
<div class="dg-caja ok" style="margin-top:6px;text-align:left">padding
<div class="dg-caja acento" style="margin-top:6px">contenido</div>
</div></div></div></div>
     <div class="termbox">*, *::before, *::after { box-sizing: border-box; }   /* casi todos los proyectos lo ponen */
.tarjeta { width: 300px; padding: 16px; border: 1px solid #ddd; margin-bottom: 24px; }
/* con border-box la tarjeta mide 300px en total; sin él (content-box), 300 + 32 + 2 = 334px */</div>
<p>El fondo (<code>background</code>) se pinta bajo el contenido, el padding y el borde; el margen siempre es transparente. <code>outline</code> y <code>box-shadow</code> se dibujan fuera de la caja <b>sin ocupar espacio</b>: no mueven nada.</p>`},
 {t:"info", eti:"Abreviaturas", h:"Uno, dos, tres o cuatro valores",
  c:`<div class="termbox">padding: 16px;                 /* los cuatro lados */
padding: 8px 16px;             /* vertical | horizontal */
padding: 8px 16px 24px;        /* arriba | horizontal | abajo */
padding: 8px 16px 24px 4px;    /* arriba | derecha | abajo | izquierda: como las agujas del reloj */

/* propiedades lógicas: siguen la dirección del texto (también en árabe o en vertical) */
padding-block: 8px;            /* arriba y abajo en español */
padding-inline: 16px;          /* izquierda y derecha en español */
margin-inline-start: auto;     /* margin-left en español, margin-right en árabe */</div>`},
 {t:"info", eti:"Tamaños", h:"Límites y tamaños intrínsecos",
  c:`<div class="termbox">.contenedor { max-width: 70rem; }        /* crece hasta ahí, nunca más */
.boton { min-width: 8rem; }              /* nunca más estrecho que esto */
.panel { min-height: 50vh; }             /* crece con el contenido, pero al menos esto */

.etiqueta { width: max-content; }        /* tan ancho como su contenido sin partir líneas */
.columna  { width: min-content; }        /* lo más estrecho posible: la palabra más larga */
.globo    { width: fit-content; }        /* como max-content, pero sin pasar del hueco disponible */</div>
<div class="nota ojo"><b class="tit">height fijo = desbordamiento</b>Un <code>height: 200px</code> en un bloque con texto desborda en cuanto el texto crece (traducciones, zoom, móvil). Casi siempre quieres <code>min-height</code>: deja crecer.</div>`},
 {t:"par", p:"Empareja cada parte de la caja con su definición",
  pares:[["Contenido","El texto o los elementos de dentro"],["Padding","Espacio interior entre el contenido y el borde"],["Border","El borde de la caja"],["Margin","Espacio exterior que separa de otras cajas"],["box-sizing: border-box","El ancho incluye padding y borde"]],
  why:"El padding forma parte del área clicable y tiene fondo; el margen no."},
 {t:"opcion", p:"¿Qué pasará? Sin reset, <code>.caja { width: 200px; padding: 20px; border: 5px solid; }</code>. ¿Cuánto ocupa de ancho?",
  ops:["200px","250px: 200 de contenido + 40 de padding + 10 de borde","240px","210px"],
  ok:1, why:"Por defecto box-sizing es content-box: width es solo el contenido. Con border-box ocuparía 200px exactos y el contenido se quedaría en 150px."},
 {t:"escribe", p:"Escribe la declaración que hace que <code>width</code> incluya el padding y el borde",
  sol:["box-sizing: border-box","box-sizing:border-box"], pista:"box-sizing con el valor que incluye el borde.",
  why:"Por eso casi todos los reset empiezan con *, *::before, *::after { box-sizing: border-box; }."},
 {t:"hueco", p:"Padding de 8px arriba y abajo y 16px a los lados; y una etiqueta tan ancha como su texto",
  tpl:".boton { padding: ___; }\n.etiqueta { width: ___; }", banco:["8px 16px","16px 8px","max-content","min-content","auto"], sol:["8px 16px","max-content"],
  why:"Con dos valores, el primero es vertical y el segundo horizontal. max-content ajusta al texto sin partirlo."},
 {t:"vf", p:"Añadir <code>outline: 3px solid</code> a un elemento empuja a sus vecinos 3px.",
  ok:false, why:"outline (y box-shadow) no ocupa espacio en el layout. Por eso es ideal para el anillo de foco y para depurar: * { outline: 1px solid red } no descoloca nada."},
 {t:"opcion", p:"Un bloque de texto tiene <code>height: 120px</code> y en alemán el texto se sale por debajo. ¿Qué cambias?",
  ops:["overflow: hidden para esconderlo","height por min-height: 120px, para que pueda crecer","Bajar el font-size en alemán","line-height: 0"],
  ok:1, why:"Esconder texto es perder contenido. min-height mantiene el tamaño mínimo del diseño y deja crecer cuando hace falta."}
]},

/* =============== U4 L2 =============== */
{
id:"cs4n1",
titulo:"Márgenes: auto, negativos y colapso",
claves:["Los márgenes verticales de bloques contiguos colapsan: queda el mayor, no la suma","El margen del primer hijo puede «escaparse» del padre si este no tiene borde, padding ni es un contexto de formato de bloque","margin: auto reparte el espacio libre; en flex y grid no hay colapso y se usa gap"],
pasos:[
 {t:"info", eti:"Colapso", h:"Cuando 30 + 20 son 30",
  c:`<div class="dg"><div class="dg-tit">dos bloques seguidos: margin-bottom 30px y margin-top 20px</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">lo que esperas: 50px</div><div class="dg-pila"><div class="dg-caja">h2 (margin-bottom: 30px)</div><div class="dg-caja aviso">30px + 20px</div><div class="dg-caja">p (margin-top: 20px)</div></div></div>
<div class="dg-col"><div class="dg-col-tit">lo que pasa: 30px</div><div class="dg-pila"><div class="dg-caja">h2</div><div class="dg-caja ok">max(30px, 20px) = 30px</div><div class="dg-caja">p</div></div></div>
</div></div>
<p>En el <b>flujo normal de bloques</b>, los márgenes <b>verticales</b> que se tocan se fusionan en uno: el mayor (si hay negativos, se suma el mayor positivo con el más negativo). Pasa en tres casos:</p>
<ul><li><b>Hermanos</b> seguidos, como en el diagrama.</li>
<li><b>Padre y primer (o último) hijo</b>, si entre ellos no hay borde, padding, contenido inline ni un contexto de formato de bloque: el margen del hijo «sale» del padre.</li>
<li><b>Bloques vacíos</b>: su margen superior e inferior se funden.</li></ul>
<p><b>No colapsan</b>: los márgenes horizontales, los de elementos flex o grid, floats, absolutos e inline-block.</p>`},
 {t:"info", eti:"El bug clásico", h:"El margen que se escapa",
  c:`<div class="termbox">&lt;header class="cabecera"&gt;          /* fondo azul, sin padding */
  &lt;h1&gt;Hola&lt;/h1&gt;                   /* h1 trae margin-top del navegador */
&lt;/header&gt;

/* resultado: aparece una franja blanca ENCIMA del fondo azul.
   El margen del h1 ha colapsado con el del header y se ha salido de él. */

/* soluciones */
.cabecera { padding-block: 1px; }        /* cualquier padding o borde lo separa */
.cabecera { display: flow-root; }        /* crea un contexto de formato de bloque */
.cabecera { display: flex; flex-direction: column; }  /* en flex no hay colapso */
h1 { margin-top: 0; }                    /* o quita el margen al origen */</div>
<p>Una estrategia moderna para evitar sorpresas: márgenes <b>en una sola dirección</b> (solo <code>margin-block-end</code>) y, en los contenedores, <code>gap</code> en vez de márgenes entre hijos.</p>
<div class="termbox">.pila { display: flex; flex-direction: column; gap: 1rem; }   /* espacio entre hijos, sin colapsos */
.flujo &gt; * + * { margin-block-start: 1em; }              /* «búho»: margen solo entre hermanos */</div>`},
 {t:"info", eti:"auto y negativos", h:"margin: auto y márgenes negativos",
  c:`<div class="termbox">.contenedor { max-width: 60rem; margin-inline: auto; }   /* centrar un bloque: necesita un ancho */
.menu .salir { margin-left: auto; }                       /* en flex: empuja al final de la fila */
.foto-a-sangre { margin-inline: -1rem; }                  /* salir del padding del padre */</div>
<p>En un bloque normal, <code>margin: auto</code> vertical vale 0 (no centra en vertical). En flex y grid, <code>margin: auto</code> absorbe el espacio libre en ambos ejes: <code>margin: auto</code> en un hijo único lo centra del todo.</p>`},
 {t:"opcion", p:"¿Qué pasará? Dos párrafos seguidos, el primero con <code>margin-bottom: 24px</code> y el segundo con <code>margin-top: 40px</code>. ¿Cuánto espacio queda entre ellos?",
  ops:["64px","40px","24px","16px"],
  ok:1, why:"Colapso de márgenes: se queda el mayor. Si el contenedor fuera flex en columna, serían 64px."},
 {t:"opcion", p:"Tu cabecera tiene fondo de color y dentro un <code>h1</code>. Aparece una franja sin color encima de la cabecera. ¿Qué pasa?",
  ops:["Es el padding del body","El margin-top del h1 colapsa con el de la cabecera y se sale fuera de ella","Es un bug del navegador","El h1 tiene position: relative"],
  ok:1, why:"Padre sin borde ni padding + primer hijo con margen = el margen del hijo se convierte en margen del padre. display: flow-root en la cabecera lo corta."},
 {t:"vf", p:"Los márgenes horizontales (izquierda y derecha) también colapsan entre elementos inline-block contiguos.",
  ok:false, why:"Solo colapsan los verticales, y solo en el flujo de bloques. Los horizontales siempre se suman."},
 {t:"escribe", p:"Escribe la declaración de <code>display</code> que convierte un elemento en contexto de formato de bloque sin más efectos secundarios (y así evita que se le escapen los márgenes de los hijos)",
  sol:["display: flow-root","display:flow-root","flow-root"], pista:"Su nombre habla de la «raíz» de un flujo.",
  why:"flow-root se creó precisamente para esto, y también contiene floats: sustituye al viejo truco del clearfix."},
 {t:"hueco", p:"Centra horizontalmente un bloque de ancho máximo 60rem y separa los hijos de una lista vertical sin márgenes",
  tpl:".contenedor { max-width: 60rem; margin-inline: ___; }\n.lista { display: flex; flex-direction: column; ___: 1rem; }", banco:["auto","gap","0","padding","center"], sol:["auto","gap"],
  why:"margin-inline: auto reparte el espacio sobrante a los dos lados. gap separa hijos de flex y grid sin colapsos ni márgenes sobrantes en el último."},
 {t:"par", p:"Empareja cada situación con si sus márgenes verticales colapsan",
  pares:[["Dos p seguidos en un div normal","Colapsan: queda el mayor"],["Dos hijos de un contenedor display: flex","No colapsan: se suman"],["Un div vacío con margin-top y margin-bottom","Colapsan entre sí"],["Padre con padding-top y su primer hijo con margin-top","No colapsan: el padding los separa"]],
  why:"Regla práctica: si algo se separa distinto de lo que esperabas, piensa en colapso de márgenes antes que en un bug."}
]},

/* =============== U4 L3 =============== */
{
id:"cs4n2",
titulo:"display, flujo normal y contextos de formato",
claves:["Flujo normal: los bloques se apilan en vertical y lo inline fluye en líneas","display tiene un tipo exterior (block/inline) y uno interior (flow, flex, grid): inline-flex = inline + flex","Un contexto de formato de bloque (BFC) aísla su interior: contiene floats y corta el colapso de márgenes"],
pasos:[
 {t:"info", eti:"Flujo normal", h:"Bloques y líneas",
  c:`<div class="dg"><div class="dg-tit">flujo normal</div>
<div class="dg-pila">
<div class="dg-caja">&lt;h1&gt; bloque: ocupa todo el ancho, empieza en línea nueva</div>
<div class="dg-caja" style="text-align:left">&lt;p&gt; bloque que contiene una caja de línea:
<div class="dg-flujo" style="margin-top:6px"><div class="dg-caja ok">texto</div><div class="dg-caja acento">&lt;a&gt; inline</div><div class="dg-caja ok">más texto</div><div class="dg-caja acento">&lt;img&gt; inline</div></div></div>
<div class="dg-caja">&lt;ul&gt; bloque</div>
</div></div>
<div class="dg dg-tabla-caja"><div class="dg-tit">display: exterior e interior</div><table class="dg-tabla"><thead><tr><th>valor</th><th>se comporta por fuera como</th><th>coloca a sus hijos con</th></tr></thead><tbody>
<tr><td>block</td><td>bloque</td><td>flujo normal</td></tr>
<tr><td>inline</td><td>texto (ignora width, height y márgenes verticales)</td><td>flujo normal</td></tr>
<tr><td>inline-block</td><td>texto, pero acepta tamaño</td><td>flujo normal (y crea BFC)</td></tr>
<tr><td>flex / inline-flex</td><td>bloque / texto</td><td>Flexbox</td></tr>
<tr><td>grid / inline-grid</td><td>bloque / texto</td><td>Grid</td></tr>
<tr><td>flow-root</td><td>bloque</td><td>flujo normal en un BFC nuevo</td></tr>
<tr><td>contents</td><td>desaparece su caja; los hijos suben un nivel</td><td>—</td></tr>
<tr><td>none</td><td>no se genera caja (ni él ni sus hijos)</td><td>—</td></tr>
</tbody></table></div>
<p>La sintaxis de dos valores lo deja explícito: <code>display: inline flex</code> es lo mismo que <code>inline-flex</code>.</p>`},
 {t:"info", eti:"Contextos", h:"El contexto de formato de bloque (BFC)",
  c:`<p>Un <b>BFC</b> es una región que maqueta su interior de forma independiente. Se crea con: la raíz, <code>display: flow-root</code>, floats, <code>position: absolute/fixed</code>, <code>inline-block</code>, <code>overflow</code> distinto de visible, elementos flex y grid (sus hijos), celdas de tabla y <code>contain: layout</code>.</p>
<div class="dg dg-tabla-caja"><div class="dg-tit">qué cambia dentro de un BFC</div><table class="dg-tabla"><tbody>
<tr><td>contiene los floats</td><td>el padre crece para incluir a sus hijos flotantes</td></tr>
<tr><td>corta el colapso de márgenes</td><td>los márgenes de los hijos no salen fuera</td></tr>
<tr><td>no se mete debajo de un float</td><td>se coloca al lado del float en vez de rodearlo</td></tr>
</tbody></table></div>
<div class="termbox">/* float: hoy solo para que el texto rodee una imagen */
.articulo img.lateral { float: left; margin: 0 1rem 1rem 0; max-width: 40%; }
.articulo { display: flow-root; }   /* contiene el float: adiós clearfix */</div>
<div class="nota ojo"><b class="tit">El hueco bajo las imágenes</b>Una <code>&lt;img&gt;</code> es inline y se apoya en la línea base del texto, dejando unos píxeles debajo para los trazos de letras como la g o la p. Se quita con <code>img { display: block; }</code> o <code>vertical-align: middle</code>.</div>`},
 {t:"par", p:"Empareja cada valor de display con su comportamiento",
  pares:[["block","Ocupa todo el ancho y empieza en línea nueva (div, p)"],["inline","Fluye con el texto; ignora width y height (span, a)"],["inline-block","Fluye con el texto pero acepta tamaño"],["none","No se muestra ni ocupa espacio"],["contents","Su caja desaparece y los hijos pasan a su padre"]],
  why:"display: contents es útil para que los hijos de un envoltorio participen en el grid del abuelo. Evítalo en botones y elementos interactivos: algunos navegadores les quitaban su papel accesible."},
 {t:"opcion", p:"¿Qué pasará? <code>span.insignia { width: 80px; height: 24px; margin-top: 10px; }</code>",
  ops:["La insignia mide 80×24 y baja 10px","Se ignoran width, height y el margen vertical: un span es inline","Solo se aplica el margen","Se convierte en bloque"],
  ok:1, why:"Los elementos inline no aceptan tamaño ni márgenes verticales. Con display: inline-block (o inline-flex) sí."},
 {t:"escribe", p:"Tus imágenes de una galería dejan un hueco de unos 4px debajo. Escribe la declaración más habitual para quitarlo",
  sol:["display: block","display:block","vertical-align: middle","vertical-align:middle","vertical-align: top","vertical-align:top"], pista:"El hueco existe porque la imagen es inline y se alinea con la línea base.",
  why:"Casi todos los reset modernos incluyen img, svg, video { display: block; max-width: 100%; }."},
 {t:"par", p:"Empareja cada forma de ocultar con su efecto",
  pares:[["display: none","No ocupa espacio ni lo lee el lector de pantalla"],["visibility: hidden","Ocupa su hueco pero no se ve ni se lee"],["opacity: 0","Invisible pero ocupa espacio, recibe clics y se lee"],["Clase .visualmente-oculto","No se ve pero el lector de pantalla sí lo lee"]],
  why:"opacity: 0 es una trampa: el elemento sigue ahí, clicable y con foco. Para ocultar de verdad, display: none o el atributo hidden."},
 {t:"vf", p:"<code>display: inline flex</code> y <code>display: inline-flex</code> son equivalentes.",
  ok:true, why:"La sintaxis de dos valores (exterior e interior) está en todos los navegadores desde 2023. inline-flex es la forma antigua, que se sigue aceptando."},
 {t:"opcion", p:"Una tarjeta contiene una imagen flotante y su borde no la rodea: la imagen se sale por abajo. ¿La solución moderna?",
  ops:["Un div vacío con clear: both","display: flow-root en la tarjeta","height fijo en la tarjeta","position: absolute en la imagen"],
  ok:1, why:"flow-root crea un BFC, y un BFC contiene a sus floats. El div vacío con clear era el truco de hace quince años."}
]},

/* =============== U4 L4 =============== */
{
id:"cs4n4",
titulo:"overflow y desbordamientos",
claves:["overflow: visible (por defecto), hidden, clip, scroll y auto","overflow distinto de visible crea un contenedor de scroll, y eso rompe position: sticky dentro","El scroll horizontal no deseado casi siempre es un elemento más ancho que la pantalla: búscalo, no lo tapes"],
pasos:[
 {t:"info", eti:"Lo que no cabe", h:"Los valores de overflow",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">overflow</div><table class="dg-tabla"><thead><tr><th>valor</th><th>qué hace</th><th>contenedor de scroll</th></tr></thead><tbody>
<tr><td>visible</td><td>el contenido se sale y se ve</td><td>no</td></tr>
<tr><td>hidden</td><td>recorta; se puede desplazar por código o al enfocar algo dentro</td><td>sí</td></tr>
<tr><td>clip</td><td>recorta y punto: nada de scroll</td><td>no</td></tr>
<tr><td>scroll</td><td>barras siempre (en sistemas que las muestran)</td><td>sí</td></tr>
<tr><td>auto</td><td>barras solo si hace falta</td><td>sí</td></tr>
</tbody></table></div>
<div class="termbox">.tabla-ancha { overflow-x: auto; }             /* tablas en móvil: scroll solo en su caja */
.panel { max-height: 60vh; overflow-y: auto; }
.avatar { overflow: clip; border-radius: 50%; }
html { scrollbar-gutter: stable; }            /* reserva el hueco de la barra: la página no «salta» */
.modal { overscroll-behavior: contain; }      /* el scroll no se contagia a la página de detrás */</div>
<div class="nota ojo"><b class="tit">Rareza</b>Si pones <code>overflow-x: hidden</code> y dejas <code>overflow-y: visible</code>, el visible se convierte en <code>auto</code>: no se puede recortar en un eje y desbordar en el otro. Con <code>clip</code> sí se puede.</div>`},
 {t:"info", eti:"Depurar", h:"El scroll horizontal fantasma",
  c:`<p>Síntoma: en móvil la página se mueve a los lados y hay una franja en blanco a la derecha. Causa: algún elemento es más ancho que la ventana (un <code>width</code> fijo, una imagen sin <code>max-width</code>, una palabra larguísima, un <code>100vw</code> que no cuenta la barra de scroll, un margen negativo…).</p>
<div class="termbox">/* 1. hazlo visible: dibuja el contorno de todo */
* { outline: 1px solid red; }

/* 2. o en la consola, busca quién se sale */
document.querySelectorAll("*").forEach(el =&gt; {
  if (el.getBoundingClientRect().right &gt; document.documentElement.clientWidth) console.log(el);
});</div>
<p>Poner <code>body { overflow-x: hidden }</code> esconde el síntoma pero no el problema, y además rompe <code>position: sticky</code> en toda la página. Si de verdad necesitas recortar, usa <code>overflow-x: clip</code>, que no crea contenedor de scroll.</p>`},
 {t:"par", p:"Empareja cada valor con su efecto",
  pares:[["overflow: auto","Barras de scroll solo cuando hacen falta"],["overflow: clip","Recorta sin crear contenedor de scroll"],["overflow: visible","El contenido desborda y se ve"],["scrollbar-gutter: stable","Reserva el hueco de la barra aunque no haya scroll"],["overscroll-behavior: contain","Al llegar al final, el scroll no pasa al padre"]],
  why:"overscroll-behavior es la solución limpia al «scroll chaining» de los modales y menús laterales."},
 {t:"opcion", p:"¿Qué pasará? La cabecera tiene <code>position: sticky; top: 0</code>, pero el <code>main</code> que la contiene tiene <code>overflow: hidden</code>",
  ops:["Funciona igual","La cabecera deja de pegarse: sticky se pega respecto al contenedor de scroll más cercano, que ahora es main (y main no se desplaza)","La cabecera desaparece","Se pega abajo"],
  ok:1, why:"Es el motivo número uno de «sticky no funciona». overflow: clip no tiene este problema."},
 {t:"escribe", p:"Escribe la declaración que da scroll horizontal solo a una tabla ancha cuando no cabe",
  sol:["overflow-x: auto","overflow-x:auto","overflow: auto","overflow:auto"], pista:"overflow en el eje x, con barras solo si hace falta.",
  why:"Envuelve la tabla en un div con overflow-x: auto: la página no se ensancha y solo la tabla se desplaza."},
 {t:"opcion", p:"Tu página tiene scroll horizontal en móvil. ¿Qué es lo correcto?",
  ops:["html, body { overflow-x: hidden }","Encontrar el elemento que se sale (outline rojo o DevTools) y corregir su ancho","Poner width: 100vw en el body","Añadir un meta viewport con user-scalable=no"],
  ok:1, why:"Esconderlo deja el contenido recortado y rompe sticky. Y user-scalable=no impide hacer zoom: un fallo de accesibilidad."},
 {t:"vf", p:"<code>width: 100vw</code> es seguro para un bloque a ancho completo en escritorio.",
  ok:false, why:"100vw incluye el ancho de la barra de scroll vertical en Windows, así que el bloque se pasa unos 15px y genera scroll horizontal. Mejor width: 100%."},
 {t:"hueco", p:"Un panel con alto máximo que hace scroll dentro, sin que el scroll se pase a la página al llegar al final",
  tpl:".panel { max-height: 60vh; overflow-y: ___; overscroll-behavior: ___; }", banco:["auto","contain","hidden","visible","none-scroll"], sol:["auto","contain"],
  why:"overscroll-behavior: contain corta el encadenamiento de scroll (y el rebote de «tirar para recargar» en móvil)."}
]},

/* =============== U4 L5 =============== */
{
id:"hc4l2",
titulo:"Posicionamiento",
claves:["static (normal), relative, absolute, fixed y sticky","absolute se coloca respecto al ancestro posicionado más cercano; fixed respecto a la ventana... salvo que un ancestro tenga transform","sticky necesita un umbral (top), espacio en su padre y ningún overflow por medio"],
pasos:[
 {t:"info", eti:"Sacar del flujo", h:"position",
  c:`<div class="termbox">.tarjeta { position: relative; }            /* referencia para sus hijos absolute */
.tarjeta .insignia {
  position: absolute; top: 8px; right: 8px; /* esquina superior derecha de la tarjeta */
}
.cabecera { position: sticky; top: 0; }      /* se pega arriba al hacer scroll */
.aviso-cookies { position: fixed; bottom: 16px; left: 16px; }   /* fijo en la ventana */
.modal { position: fixed; inset: 0; z-index: 100; }            /* inset: 0 = top, right, bottom y left a 0 */
.centrado { position: absolute; inset: 0; margin: auto; width: 20rem; height: 10rem; }   /* centrado absoluto */</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">respecto a qué se coloca (bloque contenedor)</div><table class="dg-tabla"><thead><tr><th>position</th><th>¿ocupa su hueco?</th><th>se coloca respecto a</th></tr></thead><tbody>
<tr><td>static</td><td>sí</td><td>no admite top/left</td></tr>
<tr><td>relative</td><td>sí (se desplaza, pero el hueco se queda)</td><td>su propia posición normal</td></tr>
<tr><td>absolute</td><td>no</td><td>la caja de padding del ancestro posicionado más cercano</td></tr>
<tr><td>fixed</td><td>no</td><td>la ventana</td></tr>
<tr><td>sticky</td><td>sí</td><td>su contenedor de scroll, dentro de los límites de su padre</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Trampas", h:"Cuando fixed y sticky no hacen lo que esperas",
  c:`<div class="nota ojo"><b class="tit">fixed dentro de un transform</b>Si un ancestro tiene <code>transform</code>, <code>filter</code>, <code>perspective</code>, <code>contain: paint</code> o <code>will-change: transform</code>, pasa a ser el bloque contenedor de sus descendientes <code>fixed</code>: tu modal «fijo» se queda atrapado dentro de esa caja y se desplaza con ella. Solución: saca el modal al final del <code>body</code> (o usa <code>&lt;dialog&gt;</code>, que va a la capa superior).</div>
<p><b>Lista de comprobación de sticky:</b></p>
<ul><li>Tiene un umbral: <code>top</code> (o bottom, left, right). Sin él no se pega.</li>
<li>Su padre es más alto que él: sticky solo se mueve dentro de su padre. En un padre del mismo alto, no tiene recorrido.</li>
<li>Ningún ancestro entre él y el scroll tiene <code>overflow: hidden/auto/scroll</code>.</li>
<li>En un contenedor flex o grid, que no esté estirado (<code>align-self: start</code>).</li></ul>`},
 {t:"par", p:"Empareja cada valor de position con su comportamiento",
  pares:[["static","Flujo normal (por defecto)"],["relative","Flujo normal, desplazable y referencia para hijos absolute"],["absolute","Fuera del flujo, respecto al ancestro posicionado"],["fixed","Respecto a la ventana: no se mueve al hacer scroll"],["sticky","Normal hasta un umbral de scroll, luego se queda pegado"]],
  why:"El error clásico: un absolute que aparece en una esquina de la página porque su padre no es relative."},
 {t:"opcion", p:"Tu insignia con <code>position: absolute; top: 0; right: 0</code> aparece en la esquina de la página, no de la tarjeta. ¿Qué falta?",
  ops:["Un z-index","position: relative en la tarjeta","display: flex","Un margin"],
  ok:1, why:"absolute busca el ancestro posicionado (cualquier position distinta de static) más cercano; si no hay, usa el bloque inicial (la página)."},
 {t:"opcion", p:"¿Qué pasará? Un modal con <code>position: fixed; inset: 0</code> vive dentro de un <code>.panel</code> con <code>transform: translateX(0)</code>",
  ops:["Cubre toda la ventana","Solo cubre el .panel y se desplaza con él: el transform crea un nuevo bloque contenedor para fixed","No se ve","Da error"],
  ok:1, why:"Un bug de producción muy común tras añadir una animación con transform a un contenedor. Los modales, mejor como hijos directos del body o con &lt;dialog&gt;."},
 {t:"hueco", p:"Un fondo absoluto que cubre toda su tarjeta, y una barra que se pega arriba al hacer scroll",
  tpl:".fondo { position: absolute; ___: 0; }\n.barra { position: ___; top: 0; }", banco:["inset","sticky","fixed","margin","relative"], sol:["inset","sticky"],
  why:"inset es la abreviatura de top, right, bottom y left. sticky se queda en el flujo y se pega al llegar a top: 0."},
 {t:"vf", p:"<code>position: sticky</code> funciona sin necesidad de indicar <code>top</code> ni ningún otro desplazamiento.",
  ok:false, why:"Sin umbral no sabe cuándo pegarse y se comporta como relative."},
 {t:"escribe", p:"Escribe la propiedad abreviada que equivale a <code>top: 0; right: 0; bottom: 0; left: 0</code>",
  sol:["inset: 0","inset:0","inset"], pista:"Cinco letras, significa «insertado».",
  why:"inset también acepta 2 o 4 valores como margin, y tiene versiones lógicas: inset-inline, inset-block."}
]},

/* =============== U4 L6 =============== */
{
id:"cs4n3",
titulo:"z-index y contextos de apilamiento",
claves:["z-index funciona en elementos posicionados y en hijos de flex y grid","Un contexto de apilamiento encierra a sus hijos: un z-index de 9999 no sale de un padre con z-index 1","Lo crean position + z-index, opacity &lt; 1, transform, filter, isolation: isolate y otros; la capa superior (dialog, popover) está por encima de todo"],
pasos:[
 {t:"info", eti:"Capas", h:"El problema del z-index 9999",
  c:`<div class="dg"><div class="dg-tit">dos contextos de apilamiento hermanos</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">.cabecera (z-index: 1)</div><div class="dg-pila"><div class="dg-caja aviso doble">.menu-desplegable<small>z-index: 9999, pero solo DENTRO de la cabecera</small></div></div></div>
<div class="dg-col"><div class="dg-col-tit">.contenido (z-index: 2)</div><div class="dg-pila"><div class="dg-caja ok doble">todo el contenido<small>queda encima del menú entero</small></div></div></div>
</div><div class="dg-nota arriba">se comparan 1 contra 2; el 9999 solo ordena dentro de la cabecera</div></div>
<p>Un <b>contexto de apilamiento</b> es un grupo que se pinta como una unidad. Los z-index de dentro solo ordenan a los hermanos de ese grupo; hacia fuera, el grupo entero tiene el nivel de su raíz.</p>`},
 {t:"info", eti:"Quién los crea", h:"Contextos de apilamiento y orden de pintado",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">crean un contexto de apilamiento</div><table class="dg-tabla"><tbody>
<tr><td>position relative/absolute + z-index distinto de auto</td><td>el caso de libro</td></tr>
<tr><td>position fixed o sticky</td><td>siempre</td></tr>
<tr><td>hijo de flex o grid con z-index</td><td>aunque sea static</td></tr>
<tr><td>opacity menor que 1</td><td>la sorpresa habitual</td></tr>
<tr><td>transform, filter, backdrop-filter, perspective, clip-path, mask</td><td>cualquier valor distinto de none</td></tr>
<tr><td>mix-blend-mode, isolation: isolate</td><td>isolation existe solo para esto</td></tr>
<tr><td>will-change con alguna de las anteriores, contain: paint/layout</td><td></td></tr>
</tbody></table></div>
<div class="dg"><div class="dg-tit">orden de pintado dentro de un contexto (de abajo arriba)</div>
<div class="dg-vert">
<div class="dg-caja base">fondo y borde de la raíz del contexto</div>
<div class="dg-caja">hijos con z-index negativo</div>
<div class="dg-caja">bloques en el flujo normal</div>
<div class="dg-caja">floats</div>
<div class="dg-caja">contenido inline</div>
<div class="dg-caja">posicionados con z-index auto o 0</div>
<div class="dg-caja acento">z-index positivo, de menor a mayor</div>
</div></div>`},
 {t:"info", eti:"Soluciones", h:"Controlar las capas",
  c:`<div class="termbox">/* 1. escala de z-index en variables: nada de 9999 al azar */
:root { --z-desplegable: 100; --z-cabecera: 200; --z-modal: 1000; --z-aviso: 1100; }

/* 2. aísla componentes: sus z-index internos no se mezclan con la página */
.tarjeta { isolation: isolate; }

/* 3. la capa superior (top layer): por encima de todo, sin z-index */
dialog (con showModal()), [popover]   /* el navegador los pinta en una capa aparte */</div>
<p>Para menús, tooltips y modales, <code>&lt;dialog&gt;</code> y el atributo <code>popover</code> son la solución moderna: van a la <b>capa superior</b>, que está por encima de cualquier contexto de apilamiento, y no les afecta el <code>overflow</code> de sus ancestros.</p>`},
 {t:"opcion", p:"¿Qué pasará? Un tooltip con <code>z-index: 9999</code> está dentro de una tarjeta con <code>opacity: .99</code>. La tarjeta siguiente (sin nada especial) lo tapa. ¿Por qué?",
  ops:["El 9999 es demasiado alto y el navegador lo ignora","opacity menor que 1 crea un contexto de apilamiento: el tooltip queda encerrado en su tarjeta","Falta !important","Las tarjetas son flex"],
  ok:1, why:"Cualquier cosa que cree un contexto (opacity, transform, filter…) encierra los z-index de dentro. La solución: sacar el tooltip de ahí (popover) o dar z-index a la tarjeta."},
 {t:"vf", p:"<code>z-index: 10</code> en un elemento con <code>position: static</code> dentro de un bloque normal no tiene ningún efecto.",
  ok:true, why:"z-index solo afecta a elementos posicionados y a hijos de flex o grid. Es la primera comprobación cuando «el z-index no funciona»."},
 {t:"escribe", p:"Escribe la declaración que crea un contexto de apilamiento sin efectos visuales, solo para aislar los z-index de un componente",
  sol:["isolation: isolate","isolation:isolate"], pista:"La propiedad se llama «aislamiento».",
  why:"Así los z-index internos del componente nunca compiten con los del resto de la página."},
 {t:"orden", p:"Ordena lo que se pinta dentro de un contexto de apilamiento, de más abajo a más arriba",
  items:["Fondo y borde de la raíz del contexto","Hijos con z-index negativo","Bloques en flujo normal","Posicionados con z-index auto o 0","Hijos con z-index positivo"],
  why:"Por eso un hijo con z-index: -1 puede quedar detrás del fondo de su padre solo si el padre NO es un contexto de apilamiento; si lo es, se queda encima de su fondo."},
 {t:"par", p:"Empareja cada declaración con si crea un contexto de apilamiento",
  pares:[["transform: translateX(0)","Sí, cualquier transform distinto de none"],["position: relative sin z-index","No, hasta que tenga un z-index"],["opacity: 0.9","Sí, cualquier opacidad menor que 1"],["color: red","No, no afecta al apilamiento"],["position: fixed","Sí, siempre"]],
  why:"Cuando un z-index no funciona, abre DevTools y busca en los ancestros alguna de estas propiedades."},
 {t:"opcion", p:"Tu equipo tiene z-index de 10, 999, 9999 y 99999 repartidos por el CSS y nadie sabe qué tapa a qué. ¿Qué propones?",
  ops:["Subir todo a 999999","Una escala de z-index en variables (--z-modal, --z-cabecera…), isolation: isolate en los componentes y dialog/popover para lo flotante","Quitar todos los z-index","Usar solo position: static"],
  ok:1, why:"Con nombres, cualquiera entiende la jerarquía y no hay carreras de números."}
]}

]});
