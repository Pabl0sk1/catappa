window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "La cascada, la especificidad y la herencia",
resumen: "Quién gana cuando dos reglas chocan: origen, importancia, capas (@layer), especificidad y orden; y qué se hereda, con inherit, initial, unset y revert",
nivel: "Fundamentos",
color: "#5b8def",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"hc3l2",
titulo:"Especificidad",
claves:["La especificidad es un trío (ids, clases/atributos/pseudoclases, tipos/pseudoelementos) que se compara columna a columna","A igualdad de especificidad gana la regla que aparece después","El atributo style y !important se saltan la especificidad: úsalos con cuidado"],
pasos:[
 {t:"info", eti:"Quién gana", h:"Cómo se calcula",
  c:`<p>Cuando dos reglas dan valores distintos a la misma propiedad del mismo elemento, una de las formas de desempatar es la <b>especificidad</b>: cuánto «apunta» el selector. Se cuenta en tres columnas:</p>
<div class="dg dg-tabla-caja"><div class="dg-tit">las tres columnas (A-B-C)</div><table class="dg-tabla"><thead><tr><th>columna</th><th>qué cuenta</th><th>ejemplos</th></tr></thead><tbody>
<tr><td>A</td><td>ids</td><td><code>#principal</code></td></tr>
<tr><td>B</td><td>clases, atributos y pseudoclases</td><td><code>.aviso</code>, <code>[type="email"]</code>, <code>:hover</code></td></tr>
<tr><td>C</td><td>tipos y pseudoelementos</td><td><code>p</code>, <code>li</code>, <code>::before</code></td></tr>
<tr><td>—</td><td>no cuentan</td><td><code>*</code>, combinadores, <code>:where()</code></td></tr>
</tbody></table></div>
<div class="termbox">p                        /* 0-0-1 */
.aviso                   /* 0-1-0: gana a p */
p.aviso                  /* 0-1-1: gana a .aviso */
nav ul li a:hover        /* 0-1-4 */
.menu .enlace            /* 0-2-0: gana a la anterior, B pesa más que cualquier número de C */
#alerta                  /* 1-0-0: gana a todas las anteriores */
:is(#a, .b) p            /* 1-0-1: :is cuenta su argumento más fuerte */
:where(#a, .b) p         /* 0-0-1: :where cuenta cero */</div>
<p>Se compara <b>columna a columna</b>, de izquierda a derecha, sin «llevarse una»: once clases (0-11-0) <b>no</b> ganan a un id (1-0-0).</p>`},
 {t:"info", eti:"Por encima", h:"El atributo style y !important",
  c:`<div class="termbox">&lt;p class="aviso" style="color: green"&gt;   &lt;!-- gana a cualquier selector de tus hojas --&gt;

.aviso { color: blue !important; }   /* gana incluso al atributo style */</div>
<p>Mantén la especificidad <b>baja y plana</b> (casi todo con una sola clase) para que los estilos sean fáciles de sobrescribir. <code>!important</code> suele ser síntoma de una guerra de especificidad: lo usas para ganar, luego alguien lo necesita para ganarte a ti, y así hasta que nada se puede tocar.</p>
<div class="nota dato"><b class="tit">Usos legítimos de !important</b>Clases utilitarias que deben ganar siempre (<code>.oculto { display: none !important; }</code>) y pisar estilos de terceros que no controlas.</div>`},
 {t:"orden", p:"Ordena estos selectores de menor a mayor especificidad",
  items:["p",".aviso",".tarjeta .titulo","#principal"],
  why:"0-0-1 &lt; 0-1-0 &lt; 0-2-0 &lt; 1-0-0. Etiqueta, una clase, dos clases, un id."},
 {t:"opcion", p:"<code>.titulo { color: blue }</code> y más abajo <code>h2 { color: red }</code>. ¿De qué color es <code>&lt;h2 class=\"titulo\"&gt;</code>?",
  ops:["Rojo, porque está después","Azul, porque la clase es más específica que la etiqueta","Morado","Negro"],
  ok:1, why:"El orden solo desempata a igualdad de especificidad. 0-1-0 gana a 0-0-1 esté donde esté."},
 {t:"escribe", p:"¿Qué especificidad tiene <code>#menu .item a:hover</code>? Escríbela como A-B-C",
  sol:["1-2-1","1,2,1","(1,2,1)","1 2 1"], pista:"Un id; una clase y una pseudoclase; un tipo.",
  why:"#menu (A=1), .item y :hover (B=2), a (C=1)."},
 {t:"opcion", p:"¿Qué pasará? <code>.a.b.c.d.e.f.g.h.i.j.k { color: red }</code> contra <code>#x { color: blue }</code> sobre un elemento que coincide con los dos",
  ops:["Rojo: 11 clases suman más que 1 id","Azul: se compara columna a columna y el id gana antes de mirar las clases","Depende del orden","Negro"],
  ok:1, why:"0-11-0 contra 1-0-0: en la primera columna gana el id y ya no se mira más."},
 {t:"codigo", p:"Calcula la especificidad: para cada selector de stdin (uno por línea), imprime <code>A-B-C</code>",
  lenguaje:"js",
  c:`<p>Selectores simples: ids (<code>#x</code>), clases (<code>.x</code>), atributos (<code>[x=\"y\"]</code>), pseudoclases (<code>:x</code>), pseudoelementos (<code>::x</code>), tipos (<code>div</code>), universal y combinadores (<code>* &gt; + ~</code> y espacio). No hace falta tratar <code>:is()</code> ni <code>:not()</code>.</p>
<p>Ejemplo: <code>#nav .item a:hover</code> → <code>1-2-1</code>.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const sel of lineas) {\n  // cuenta ids (A), clases/atributos/pseudoclases (B) y tipos/pseudoelementos (C)\n}\n",
  pruebas:[{entrada:"p\n#nav .item a:hover\nul li::marker\n", salida:"0-0-1\n1-2-1\n0-0-3"},{entrada:"input[type=\"email\"]:focus\n* > .a + .b ~ div\n", salida:"0-2-1\n0-2-1"},{entrada:"#a#b .c\na::before\n.btn-primario.grande\n", salida:"2-1-0\n0-0-2\n0-2-0", oculta:true}],
  pista:"Ve quitando piezas con replace y contando: primero los atributos (su valor puede tener letras), luego ::pseudoelementos, #ids, .clases y :pseudoclases. Lo que quede con letras son tipos.",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const sel of lineas) {\n  let s = sel;\n  const quita = re => { const n = (s.match(re) || []).length; s = s.replace(re, \" \"); return n; };\n  let b = quita(/\\[[^\\]]*\\]/g);\n  let c = quita(/::[\\w-]+/g);\n  const a = quita(/#[\\w-]+/g);\n  b += quita(/\\.[\\w-]+/g);\n  b += quita(/:[\\w-]+/g);\n  c += (s.match(/[a-zA-Z][\\w-]*/g) || []).length;\n  console.log(a + \"-\" + b + \"-\" + c);\n}",
  why:"Es lo que hace DevTools cuando pasas el ratón por un selector en el panel Styles: te enseña su especificidad. Saber calcularla de cabeza evita la tentación del !important."},
 {t:"vf", p:"Un estilo en el atributo <code>style</code> gana a una regla con id de tu hoja, pero pierde contra una regla con <code>!important</code>.",
  ok:true, why:"style está por encima de cualquier selector, pero !important cambia de «nivel» la declaración y gana a los estilos normales, incluidos los del atributo style."},
 {t:"opcion", p:"Un compañero ha llenado el CSS de <code>!important</code> para que «funcione». ¿Cuál es la solución de fondo?",
  ops:["Añadir más !important donde falle","Bajar y aplanar la especificidad (una clase por regla, :where() para estilos base) y ordenar el CSS en capas con @layer","Pasar todo a atributos style","Usar ids en todo"],
  ok:1, why:"Con especificidad plana, el orden decide, y el orden lo controlas con la estructura de ficheros y @layer (lo verás en la siguiente lección)."}
]},

/* =============== U2 L2 =============== */
{
id:"cs2n1",
titulo:"La cascada completa y @layer",
claves:["La cascada decide en orden: origen e importancia, estilos del atributo style, capas, especificidad y orden de aparición","@layer declara capas con prioridad explícita: las posteriores ganan, y lo que no está en ninguna capa gana a todas","Con !important el orden se invierte: la importancia de las capas anteriores y de los orígenes «débiles» gana"],
pasos:[
 {t:"info", eti:"El algoritmo", h:"Los criterios de la cascada, en orden",
  c:`<p>La especificidad es solo <b>uno</b> de los criterios. Cuando varias declaraciones compiten por la misma propiedad de un elemento, el navegador las compara con esta lista y se para en el primer criterio que desempata:</p>
<div class="dg"><div class="dg-tit">la cascada: de arriba abajo, hasta que uno desempate</div>
<div class="dg-vert">
  <div class="dg-caja acento doble">1. origen e importancia<small>navegador, usuario o autor; normal o !important</small></div>
  <div class="dg-caja acento doble">2. estilos del atributo style<small>los pegados al elemento ganan a las reglas de las hojas</small></div>
  <div class="dg-caja acento doble">3. capas (@layer)<small>la capa declarada después gana; sin capa gana a todas</small></div>
  <div class="dg-caja acento doble">4. especificidad<small>A-B-C, columna a columna</small></div>
  <div class="dg-caja ok doble">5. orden de aparición<small>a igualdad de todo, la última</small></div>
</div></div>
<div class="dg dg-tabla-caja"><div class="dg-tit">1. origen e importancia (de más a menos fuerza)</div><table class="dg-tabla"><tbody>
<tr><td>transiciones en curso</td><td>ganan a todo mientras duran</td></tr>
<tr><td>!important del navegador</td><td>muy pocas reglas: comportamientos que el navegador protege</td></tr>
<tr><td>!important del usuario</td><td>extensiones o ajustes del usuario</td></tr>
<tr><td>!important del autor (tú)</td><td></td></tr>
<tr><td>animaciones (@keyframes)</td><td>ganan a tus estilos normales</td></tr>
<tr><td>normal del autor</td><td>casi todo tu CSS está aquí</td></tr>
<tr><td>normal del usuario</td><td></td></tr>
<tr><td>normal del navegador</td><td>la hoja del agente de usuario</td></tr>
</tbody></table></div>
<p>Fíjate en la simetría: en lo normal gana el autor; en lo <code>!important</code> el orden se invierte, para que el usuario (por ejemplo, alguien que necesita letra grande) pueda imponerse a la web.</p>`},
 {t:"info", eti:"Capas", h:"@layer: orden explícito",
  c:`<div class="termbox">/* 1. declara el orden una vez, al principio: la última gana */
@layer reset, base, componentes, utilidades;

@layer base {
  #app a { color: navy; }          /* 1-0-1, pero en la capa «base» */
}
@layer componentes {
  .boton { color: white; }         /* 0-1-0 en «componentes»: GANA a la de arriba */
}
@layer utilidades {
  .texto-rojo { color: crimson; }
}

a { color: purple; }               /* sin capa: gana a TODAS las capas */

/* importar CSS de terceros dentro de una capa, para que no pelee con el tuyo */
@import url("vendor/libreria.css") layer(vendor);</div>
<p>Entre capas <b>no se mira la especificidad</b>: la capa posterior gana siempre. Así acabas con las guerras de especificidad por diseño: el reset y las librerías van en capas bajas y nunca podrán ganar a tus componentes, tengan los selectores que tengan.</p>
<div class="nota ojo"><b class="tit">!important invierte las capas</b>Una declaración <code>!important</code> de la capa <code>reset</code> gana a una <code>!important</code> de <code>utilidades</code>, y cualquier <code>!important</code> dentro de una capa gana al <code>!important</code> sin capa. Es coherente con los orígenes: las capas «débiles» se protegen con !important.</div>`},
 {t:"orden", p:"Ordena los criterios de la cascada, del que se mira primero al último",
  items:["Origen e importancia","Estilos del atributo style","Capas (@layer)","Especificidad","Orden de aparición"],
  why:"Por eso una regla sin capa con un selector de tipo gana a una regla con id dentro de una capa: las capas se miran antes que la especificidad."},
 {t:"opcion", p:"¿Qué pasará? <code>@layer base, temas;</code> — en <code>base</code>: <code>#app .boton { background: gray }</code> — en <code>temas</code>: <code>button { background: gold }</code>. ¿De qué color es el botón?",
  ops:["Gris, el selector es mucho más específico","Dorado: temas va después y entre capas no se mira la especificidad","Depende del orden de los ficheros","Transparente"],
  ok:1, why:"Las capas se comparan antes que la especificidad. La especificidad solo desempata dentro de la misma capa."},
 {t:"vf", p:"Una regla que no está dentro de ninguna <code>@layer</code> gana a las reglas normales de todas las capas.",
  ok:true, why:"Los estilos sin capa se tratan como una capa implícita final. Útil para migrar poco a poco: lo viejo sin capa sigue mandando."},
 {t:"hueco", p:"Declara el orden de las capas (el reset el más débil) y mete una librería externa en su propia capa",
  tpl:"@layer reset, vendor, ___, utilidades;\n@import url(\"lib.css\") ___(vendor);", banco:["componentes","layer","scope","import","important"], sol:["componentes","layer"],
  why:"La declaración inicial fija el orden aunque luego las capas se rellenen en cualquier orden o en ficheros distintos."},
 {t:"opcion", p:"Un usuario con baja visión configura su navegador con <code>font-size: 24px !important</code> para todo. Tu web tiene <code>body { font-size: 14px !important }</code>. ¿Qué gana?",
  ops:["Tu web, porque el autor siempre gana","El usuario: en !important el orden de los orígenes se invierte y el usuario va por delante del autor","El que tenga más especificidad","El que esté después"],
  ok:1, why:"Es una decisión de diseño de CSS a favor de la accesibilidad: la última palabra la tiene quien lee."},
 {t:"par", p:"Empareja cada situación con el criterio que la decide",
  pares:[["Dos reglas .aviso seguidas con distinto color","Orden de aparición"],["Una regla de capa «base» contra otra de capa «componentes»","Capas"],["p contra .aviso en la misma capa","Especificidad"],["style=\"color: red\" contra .aviso","Estilos del atributo style"],["Tu CSS contra la hoja del navegador","Origen"]],
  why:"Saber qué criterio decide cada conflicto es el 90 % de depurar CSS."},
 {t:"escribe", p:"¿Qué regla-at de CSS usas para agrupar reglas en niveles de prioridad explícitos, por encima de la especificidad?",
  sol:["@layer","layer"], pista:"Empieza por @ y significa «capa».",
  why:"@layer está en todos los navegadores desde 2022. Tailwind v4 la usa internamente para ordenar base, componentes y utilidades."}
]},

/* =============== U2 L3 =============== */
{
id:"cs2n2",
titulo:"Herencia y valores globales",
claves:["Las propiedades de texto se heredan (color, font, line-height); las de caja no (margin, border, background)","inherit, initial, unset, revert y revert-layer funcionan en cualquier propiedad","Un valor pasa por especificado → calculado → usado: se hereda el calculado"],
pasos:[
 {t:"info", eti:"De padres a hijos", h:"Qué se hereda",
  c:`<div class="dg-cols dg"><div class="dg-col"><div class="dg-col-tit">se heredan</div><div class="dg-pila">
<div class="dg-caja ok">color</div><div class="dg-caja ok">font-family, font-size, font-weight</div><div class="dg-caja ok">line-height, letter-spacing</div><div class="dg-caja ok">text-align, text-transform</div><div class="dg-caja ok">visibility, cursor, list-style</div><div class="dg-caja ok">variables CSS (--algo)</div></div></div>
<div class="dg-col"><div class="dg-col-tit">no se heredan</div><div class="dg-pila">
<div class="dg-caja aviso">margin, padding, border</div><div class="dg-caja aviso">background</div><div class="dg-caja aviso">width, height</div><div class="dg-caja aviso">display, position</div><div class="dg-caja aviso">overflow, opacity</div><div class="dg-caja aviso">box-shadow, transform</div></div></div></div>
<p>La regla intuitiva: se hereda lo que tiene que ver con el <b>texto</b>; no se hereda lo que tiene que ver con la <b>caja</b>. Por eso basta con poner la fuente y el color en <code>body</code>.</p>
<div class="nota ojo"><b class="tit">El caso de los formularios</b>Botones, inputs y selects <b>no heredan la fuente</b> en la hoja del navegador: salen con una fuente distinta de la de tu página. Casi todos los reset incluyen <code>button, input, select, textarea { font: inherit; }</code>.</div>`},
 {t:"info", eti:"Palabras clave", h:"inherit, initial, unset, revert",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">valores globales (valen en cualquier propiedad)</div><table class="dg-tabla"><thead><tr><th>valor</th><th>qué hace</th></tr></thead><tbody>
<tr><td>inherit</td><td>toma el valor calculado del padre, aunque la propiedad no se herede</td></tr>
<tr><td>initial</td><td>el valor inicial de la especificación (¡no el del navegador!)</td></tr>
<tr><td>unset</td><td>inherit si la propiedad se hereda; initial si no</td></tr>
<tr><td>revert</td><td>vuelve a lo que diría el origen anterior (normalmente, la hoja del navegador)</td></tr>
<tr><td>revert-layer</td><td>vuelve a lo que diría la capa anterior</td></tr>
</tbody></table></div>
<div class="termbox">div { display: initial; }      /* ¡inline! el valor inicial de display es inline, no block */
h1 { font-weight: revert; }    /* vuelve al bold del navegador */
.enlace-limpio { all: unset; } /* borra todo (menos direction y unicode-bidi) */
.icono { fill: currentColor; } /* currentColor = el valor de color de este elemento */</div>`},
 {t:"info", eti:"Por dentro", h:"De lo que escribes a lo que se pinta",
  c:`<div class="dg"><div class="dg-tit">etapas de un valor: font-size y line-height de un párrafo</div>
<div class="dg-vert">
<div class="dg-caja doble">especificado<small>el que gana la cascada: font-size: 1.25em; line-height: 1.5</small></div>
<div class="dg-caja acento doble">calculado<small>resuelto lo relativo al padre: 20px; 1.5 (sin unidad se queda como factor)</small></div>
<div class="dg-caja doble">usado<small>tras el layout: anchos en % pasan a píxeles</small></div>
<div class="dg-caja ok doble">real<small>redondeado a lo que la pantalla puede pintar</small></div>
</div><div class="dg-nota arriba">los hijos heredan el valor CALCULADO</div></div>
<p>Por eso <code>line-height: 1.5em</code> y <code>line-height: 1.5</code> no son lo mismo: con <code>em</code> se calcula en píxeles en el padre y los hijos heredan esos píxeles fijos (un título grande dentro queda apelotonado); sin unidad se hereda el factor y cada hijo lo multiplica por su propio tamaño.</p>`},
 {t:"par", p:"Empareja cada propiedad con si se hereda",
  pares:[["color","Se hereda: los hijos toman el color del padre"],["font-family","Se hereda: basta con ponerla en body"],["margin","No se hereda: cada caja tiene el suyo"],["border","No se hereda: sería raro que los hijos tuvieran borde"],["inherit (valor)","Fuerza a tomar el valor del padre"]],
  why:"Si algo «no se hereda» y lo quieres heredar, border: inherit o background: inherit funcionan igual."},
 {t:"opcion", p:"¿Qué pasará? <code>div.tarjeta { display: initial; }</code>",
  ops:["El div vuelve a ser block, como en la hoja del navegador","El div pasa a inline, porque el valor inicial de display en la especificación es inline","No cambia nada","El div desaparece"],
  ok:1, why:"initial es el valor de la especificación, no el del navegador. Para volver a lo del navegador (block en un div) se usa revert."},
 {t:"escribe", p:"¿Qué valor global devuelve una propiedad al estilo que le da la hoja del navegador?",
  sol:["revert"], pista:"Significa «revertir».",
  why:"revert deshace tus estilos de autor para esa propiedad. revert-layer hace lo mismo pero solo retrocede una capa."},
 {t:"hueco", p:"Haz que los controles de formulario usen la tipografía de la página y que un icono SVG tome el color del texto",
  tpl:"button, input, select { font: ___; }\n.icono { fill: ___; }", banco:["inherit","currentColor","initial","unset","auto"], sol:["inherit","currentColor"],
  why:"currentColor hace que el icono cambie solo con el color del texto, también en :hover o en el tema oscuro."},
 {t:"opcion", p:"El padre tiene <code>font-size: 20px; line-height: 1.5em</code>. Dentro hay un <code>h2</code> con <code>font-size: 40px</code>. ¿Qué altura de línea tiene el h2?",
  ops:["60px: 1.5 × 40","30px: hereda los píxeles ya calculados en el padre, y las líneas se montan unas sobre otras","1.5em","Depende del navegador"],
  ok:1, why:"Se hereda el valor calculado (30px). Con line-height: 1.5, sin unidad, el h2 tendría 60px. Por eso se recomienda sin unidad."},
 {t:"vf", p:"<code>unset</code> se comporta como <code>inherit</code> en <code>color</code> y como <code>initial</code> en <code>margin</code>.",
  ok:true, why:"color se hereda, así que unset = inherit; margin no, así que unset = initial (0)."}
]}

]});
