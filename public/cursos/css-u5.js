window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Flexbox a fondo",
resumen: "Ejes y alineación, cómo reparte el espacio flex-grow, flex-shrink y flex-basis, el problema de min-width: auto y los patrones de maquetación con Flexbox",
nivel: "Intermedio",
color: "#3b6dd2",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"hc4l3",
titulo:"Flexbox: ejes y alineación",
claves:["Flexbox reparte elementos en una dimensión: el eje principal (flex-direction) y el cruzado","justify-content alinea en el eje principal; align-items en el cruzado (por defecto stretch)","flex-wrap permite varias líneas, align-content las reparte y gap separa sin márgenes"],
pasos:[
 {t:"info", eti:"Una dimensión", h:"Los dos ejes",
  c:`<div class="dg"><div class="dg-tit">flex-direction: row (por defecto)</div>
<svg viewBox="0 0 320 170" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Contenedor flex con tres elementos en fila; el eje principal va de izquierda a derecha y el eje cruzado de arriba abajo">
<defs><marker id="fl-css5-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
<rect x="40" y="30" width="250" height="100" rx="8" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/>
<rect x="52" y="42" width="60" height="76" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
<rect x="120" y="42" width="60" height="76" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
<rect x="188" y="42" width="60" height="76" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
<text x="82" y="85" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">1</text>
<text x="150" y="85" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">2</text>
<text x="218" y="85" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">3</text>
<line x1="52" y1="150" x2="285" y2="150" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-css5-1)"/>
<text x="165" y="166" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">eje principal: justify-content</text>
<line x1="20" y1="34" x2="20" y2="126" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-css5-1)"/>
<text x="16" y="20" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">eje cruzado: align-items</text>
</svg>
<div class="dg-nota arriba">con flex-direction: column los ejes se intercambian: justify-content pasa a ser vertical</div></div>
<div class="termbox">.barra {
  display: flex;
  flex-direction: row;              /* row | row-reverse | column | column-reverse */
  justify-content: space-between;   /* eje principal */
  align-items: center;              /* eje cruzado (por defecto: stretch) */
  gap: 12px;
}
.barra .buscador { flex: 1; }       /* ocupa el espacio sobrante */
.centrar { display: flex; justify-content: center; align-items: center; }   /* centrar de verdad */
.etiquetas { display: flex; flex-wrap: wrap; gap: 8px; }   /* varias líneas si no caben */</div>`},
 {t:"info", eti:"Repartir", h:"Valores de justify-content y align-items",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">justify-content (eje principal)</div><table class="dg-tabla"><tbody>
<tr><td>flex-start</td><td>todos al principio (por defecto)</td></tr>
<tr><td>center</td><td>todos en el centro</td></tr>
<tr><td>flex-end</td><td>todos al final</td></tr>
<tr><td>space-between</td><td>el primero pegado al inicio, el último al final, el resto repartido</td></tr>
<tr><td>space-around</td><td>mismo espacio a cada lado de cada uno (en los bordes queda la mitad)</td></tr>
<tr><td>space-evenly</td><td>exactamente el mismo espacio en todos los huecos</td></tr>
</tbody></table></div>
<div class="dg dg-tabla-caja"><div class="dg-tit">align-items (eje cruzado)</div><table class="dg-tabla"><tbody>
<tr><td>stretch</td><td>se estiran a la altura de la línea (por defecto)</td></tr>
<tr><td>flex-start / center / flex-end</td><td>arriba, centro, abajo (en una fila)</td></tr>
<tr><td>baseline</td><td>alinea la línea base del texto: botones y textos de distinto tamaño</td></tr>
</tbody></table></div>
<p>Con <code>flex-wrap: wrap</code> y varias líneas, <code>align-content</code> reparte las <b>líneas</b> en el eje cruzado (con los mismos valores que justify-content).</p>`},
 {t:"par", p:"Empareja cada propiedad con su efecto",
  pares:[["justify-content","Alinea en el eje principal"],["align-items","Alinea en el eje cruzado"],["flex: 1","El elemento crece para ocupar el espacio libre"],["gap","Espacio entre elementos"],["flex-wrap: wrap","Permite que los elementos bajen a otra línea"]],
  why:"Regla práctica: Flexbox para componentes en línea, Grid para el esqueleto de la página y las rejillas."},
 {t:"opcion", p:"¿Qué CSS centra un elemento vertical y horizontalmente dentro de su contenedor?",
  ops:["margin: auto sin más","display: flex; justify-content: center; align-items: center en el contenedor","text-align: center","vertical-align: middle en el hijo"],
  ok:1, why:"O con Grid: display: grid; place-items: center. vertical-align solo sirve para elementos inline y celdas de tabla."},
 {t:"opcion", p:"¿Qué pasará? Un contenedor con <code>display: flex; flex-direction: column; justify-content: center</code> y sin altura definida",
  ops:["Los hijos se centran en vertical en la pantalla","No se nota nada: el contenedor mide exactamente lo que sus hijos y no hay espacio que repartir","Los hijos se centran en horizontal","Los hijos se ponen en fila"],
  ok:1, why:"En columna, justify-content trabaja en vertical, pero solo hay espacio que repartir si el contenedor es más alto que su contenido (min-height, height o estirado por su padre)."},
 {t:"hueco", p:"Una barra con el logo a la izquierda y el menú a la derecha, alineados por el centro en vertical",
  tpl:".barra { display: flex; justify-content: ___; align-items: ___; }", banco:["space-between","center","stretch","space-evenly","baseline"], sol:["space-between","center"],
  why:"space-between empuja el primer y el último hijo a los extremos."},
 {t:"vf", p:"Por defecto, los hijos de un contenedor flex en fila se estiran hasta la altura de la fila.",
  ok:true, why:"align-items vale stretch por defecto. Por eso dos tarjetas en fila salen igual de altas, y por eso una imagen dentro de un flex puede deformarse (se arregla con align-self: start o align-items: flex-start)."},
 {t:"escribe", p:"Escribe la declaración que alinea por la línea base del texto los hijos de un flex (botones con textos de distinto tamaño)",
  sol:["align-items: baseline","align-items:baseline"], pista:"El valor se llama igual que la línea sobre la que se apoyan las letras.",
  why:"Con center se centran las cajas, pero los textos de distinto tamaño quedan a alturas distintas; con baseline las letras se apoyan en la misma línea."}
]},

/* =============== U5 L2 =============== */
{
id:"cs5n1",
titulo:"flex-grow, flex-shrink y flex-basis",
claves:["flex-basis es el tamaño de partida; grow reparte el espacio sobrante y shrink quita el que falta","flex: 1 = 1 1 0%; flex: auto = 1 1 auto; flex: none = 0 0 auto; por defecto 0 1 auto","Un elemento flex no encoge por debajo de su contenido (min-width: auto): con texto largo o código, pon min-width: 0"],
pasos:[
 {t:"info", eti:"El algoritmo", h:"Cómo reparte Flexbox el espacio",
  c:`<div class="dg"><div class="dg-tit">contenedor de 600px: A (basis 100px, grow 1) y B (basis 100px, grow 2)</div>
<div class="dg-vert">
<div class="dg-caja doble">1. tamaño de partida (flex-basis)<small>100 + 100 = 200px ocupados</small></div>
<div class="dg-caja doble">2. espacio libre<small>600 − 200 = 400px</small></div>
<div class="dg-caja acento doble">3. reparto según flex-grow (1 : 2)<small>A recibe 400 × 1/3 = 133,3px; B recibe 400 × 2/3 = 266,7px</small></div>
<div class="dg-caja ok doble">4. tamaños finales<small>A = 233,3px · B = 366,7px</small></div>
</div></div>
<p>Si el espacio libre es <b>negativo</b> (no caben), se quita según <code>flex-shrink</code> <b>multiplicado por el flex-basis</b>: los elementos grandes encogen más en píxeles.</p>
<div class="dg dg-tabla-caja"><div class="dg-tit">la abreviatura flex</div><table class="dg-tabla"><thead><tr><th>escribes</th><th>equivale a (grow shrink basis)</th><th>resultado</th></tr></thead><tbody>
<tr><td>(nada)</td><td>0 1 auto</td><td>su tamaño; encoge si no cabe</td></tr>
<tr><td>flex: 1</td><td>1 1 0%</td><td>partes iguales del total, sin importar el contenido</td></tr>
<tr><td>flex: auto</td><td>1 1 auto</td><td>su tamaño y reparte lo que sobra</td></tr>
<tr><td>flex: none</td><td>0 0 auto</td><td>rígido: ni crece ni encoge</td></tr>
<tr><td>flex: 0 0 240px</td><td>0 0 240px</td><td>exactamente 240px (un lateral fijo)</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"El bug", h:"min-width: auto: el elemento que no encoge",
  c:`<div class="termbox">.fila { display: flex; }
.fila .principal { flex: 1; }            /* con un &lt;pre&gt; de código dentro... */
/* ...la columna no encoge: el pre empuja y la página se sale por la derecha */

.fila .principal { flex: 1; min-width: 0; }   /* ahora sí puede encoger por debajo de su contenido */</div>
<p>Los elementos flex tienen <code>min-width: auto</code>, que significa «no encojas por debajo de tu contenido mínimo» (la palabra más larga, la imagen, el bloque de código). Pasa lo mismo en columna con <code>min-height</code>. Es la causa de «el text-overflow: ellipsis no funciona dentro de un flex» y de muchos desbordamientos en móvil. En Grid ocurre igual con <code>1fr</code>: se arregla con <code>minmax(0, 1fr)</code>.</p>`},
 {t:"par", p:"Empareja cada abreviatura con su comportamiento",
  pares:[["flex: 1","Partes iguales del espacio, ignorando el contenido"],["flex: auto","Parte de su tamaño y reparte lo que sobra"],["flex: none","Rígido: ni crece ni encoge"],["flex: 0 0 240px","Siempre 240px"],["sin flex (0 1 auto)","Su tamaño, y encoge si no cabe"]],
  why:"flex: 1 en todos los hijos da columnas iguales; flex: auto da columnas proporcionales a su contenido."},
 {t:"opcion", p:"Contenedor de 900px con tres hijos <code>flex: 1</code>; uno de ellos contiene una palabra enorme. ¿Qué pasará?",
  ops:["Los tres miden 300px siempre","El de la palabra no encoge por debajo de ella (min-width: auto) y los otros dos se reparten lo que queda","La palabra se parte sola","Aparece scroll en el hijo"],
  ok:1, why:"flex-basis 0% da partes iguales solo si el contenido lo permite. min-width: 0 (y overflow-wrap en el texto) lo arreglan."},
 {t:"escribe", p:"Un título con <code>text-overflow: ellipsis</code> dentro de un hijo <code>flex: 1</code> no se recorta y desborda. ¿Qué declaración añades al hijo flex?",
  sol:["min-width: 0","min-width:0","overflow: hidden","overflow:hidden"], pista:"Le quitas el tamaño mínimo automático.",
  why:"min-width: 0 le permite encoger por debajo del ancho del texto, y entonces el ellipsis puede actuar."},
 {t:"hueco", p:"Un lateral rígido de 240px y un contenido que ocupa el resto (y puede encoger)",
  tpl:".lateral { flex: ___; }\n.contenido { flex: 1; min-width: ___; }", banco:["0 0 240px","0","1 1 240px","auto","none"], sol:["0 0 240px","0"],
  why:"0 0 240px: ni crece ni encoge. En el contenido, min-width: 0 evita que un bloque de código lo reviente."},
 {t:"codigo", p:"Simula el reparto de Flexbox: calcula el tamaño final de cada elemento",
  lenguaje:"js",
  c:`<p>Entrada: la primera línea es el ancho del contenedor; cada línea siguiente, <code>basis grow shrink</code> de un elemento (sin gap ni min-width).</p>
<ul><li>Si sobra espacio: cada uno recibe <code>libre × grow / sumaGrow</code> (si la suma es 0, nadie crece).</li>
<li>Si falta: cada uno pierde <code>falta × (shrink × basis) / suma(shrink × basis)</code>.</li></ul>
<p>Imprime cada tamaño en una línea con <code>String(+x.toFixed(2))</code>. Ejemplo: <code>600</code>, <code>100 1 1</code>, <code>100 2 1</code> → <code>233.33</code> y <code>366.67</code>.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst ancho = Number(lineas[0]);\nconst items = lineas.slice(1).map(l => l.split(\" \").map(Number));   // [basis, grow, shrink]\n// reparte el espacio libre (o el que falta)\n",
  pruebas:[{entrada:"600\n100 1 1\n100 2 1\n", salida:"233.33\n366.67"},{entrada:"400\n300 0 1\n200 0 3\n", salida:"266.67\n133.33"},{entrada:"800\n100 0 1\n100 0 1\n", salida:"100\n100"},{entrada:"1000\n200 1 1\n200 0 1\n100 3 1\n", salida:"325\n200\n475", oculta:true},{entrada:"500\n300 1 1\n300 1 1\n", salida:"250\n250", oculta:true}],
  pista:"libre = ancho − suma de basis. Si libre &gt;= 0 reparte por grow; si no, por shrink × basis (libre es negativo, así que se suma y resta solo).",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst ancho = Number(lineas[0]);\nconst items = lineas.slice(1).map(l => l.split(\" \").map(Number));\nconst r = x => String(+x.toFixed(2));\nconst libre = ancho - items.reduce((s, [b]) => s + b, 0);\nlet finales;\nif (libre >= 0) {\n  const g = items.reduce((s, [, grow]) => s + grow, 0);\n  finales = items.map(([b, grow]) => g ? b + libre * grow / g : b);\n} else {\n  const pesos = items.reduce((s, [b, , sh]) => s + b * sh, 0);\n  finales = items.map(([b, , sh]) => pesos ? b + libre * (b * sh) / pesos : b);\n}\nfinales.forEach(x => console.log(r(x)));",
  why:"Es el corazón del algoritmo real. El navegador añade después las restricciones de min-width y max-width y vuelve a repartir si alguno choca con su límite."},
 {t:"vf", p:"Con el espacio negativo, dos elementos con el mismo <code>flex-shrink</code> pero distinto <code>flex-basis</code> encogen los mismos píxeles.",
  ok:false, why:"El encogimiento se pondera por shrink × basis: el que parte más grande pierde más píxeles, así encogen en proporción a su tamaño."},
 {t:"opcion", p:"Quieres tres columnas exactamente iguales aunque tengan textos de distinta longitud. ¿Qué pones en los hijos?",
  ops:["flex: auto","flex: 1 (y min-width: 0 si algún contenido es muy largo)","width: 33%","flex-grow: 1 sin más"],
  ok:1, why:"flex-grow: 1 solo deja flex-basis en auto, y el sobrante se reparte a partir del tamaño de cada contenido. flex: 1 pone basis a 0%: parten todas de cero."}
]},

/* =============== U5 L3 =============== */
{
id:"cs5n2",
titulo:"Patrones con Flexbox",
claves:["align-self alinea un elemento suelto; margin: auto empuja y absorbe el espacio libre","order y *-reverse cambian el orden visual pero no el de lectura ni el del tabulador","Patrones: barra de navegación, objeto multimedia, pie abajo, tarjetas con botón al fondo, lista de etiquetas"],
pasos:[
 {t:"info", eti:"Elementos sueltos", h:"align-self, margin: auto y order",
  c:`<div class="termbox">.fila { display: flex; align-items: center; }
.fila .alto { align-self: stretch; }        /* solo este, distinto */

.menu { display: flex; gap: 1rem; }
.menu .cuenta { margin-left: auto; }        /* empuja este y los siguientes a la derecha */

.tarjeta { display: flex; flex-direction: column; }
.tarjeta .boton { margin-top: auto; }       /* el botón baja al fondo de la tarjeta */

.destacado { order: -1; }                   /* se pinta el primero (por defecto order: 0) */</div>
<div class="nota ojo"><b class="tit">Orden visual y orden real</b><code>order</code>, <code>row-reverse</code> y <code>column-reverse</code> solo cambian dónde se <b>pinta</b>. El lector de pantalla y la tecla Tab siguen el orden del HTML: si lo cambias mucho, quien navega con teclado salta de un sitio a otro sin sentido. Si el orden importa, cámbialo en el HTML.</div>`},
 {t:"info", eti:"Recetas", h:"Patrones que usarás cada semana",
  c:`<div class="termbox">/* pie siempre abajo (sticky footer) */
body { display: flex; flex-direction: column; min-height: 100svh; }
main { flex: 1; }

/* objeto multimedia: avatar + texto que ocupa el resto */
.comentario { display: flex; gap: 12px; align-items: flex-start; }
.comentario img { flex: none; width: 48px; }
.comentario .texto { flex: 1; min-width: 0; }

/* campo + botón pegados */
.buscador { display: flex; }
.buscador input { flex: 1; min-width: 0; }

/* etiquetas que bajan de línea */
.etiquetas { display: flex; flex-wrap: wrap; gap: 6px; }

/* elementos que pasan a columna cuando no caben, sin media queries */
.opciones { display: flex; flex-wrap: wrap; gap: 1rem; }
.opciones &gt; * { flex: 1 1 15rem; }       /* mínimo 15rem, y crecen para llenar */</div>`},
 {t:"opcion", p:"En una barra flex, quieres el logo a la izquierda, el menú justo al lado y el botón «Entrar» pegado a la derecha. ¿La forma más sencilla?",
  ops:["justify-content: space-between en la barra","margin-left: auto en el botón «Entrar»","position: absolute en el botón","order: 99 en el botón"],
  ok:1, why:"space-between separaría también el menú del logo. margin-left: auto absorbe todo el espacio libre justo a la izquierda del botón."},
 {t:"opcion", p:"¿Qué pasará? Una <code>&lt;img&gt;</code> de 200px de alto dentro de un flex en fila junto a un texto largo de 400px de alto",
  ops:["La imagen mantiene su proporción","La imagen se estira hasta 400px de alto y se deforma, porque align-items es stretch","La imagen desaparece","El texto se corta"],
  ok:1, why:"Los hijos flex se estiran en el eje cruzado. align-self: flex-start (o align-items en el contenedor) en la imagen lo evita."},
 {t:"hueco", p:"Tarjetas en columna con el botón empujado al fondo, y un pie de página que siempre queda abajo",
  tpl:".tarjeta { display: flex; flex-direction: column; }\n.tarjeta .boton { margin-top: ___; }\nbody { display: flex; flex-direction: column; min-height: 100svh; }\nmain { flex: ___; }", banco:["auto","1","0","none","100%"], sol:["auto","1"],
  why:"margin-top: auto absorbe el espacio sobrante encima del botón. flex: 1 en main hace que ocupe todo el alto libre y empuje el pie."},
 {t:"vf", p:"Con <code>flex-direction: row-reverse</code>, la tecla Tab recorre los enlaces de derecha a izquierda, igual que se ven.",
  ok:false, why:"El foco sigue el orden del HTML, así que recorre de izquierda a derecha el orden original, que visualmente va al revés. Es un fallo de accesibilidad (WCAG 2.4.3, orden del foco)."},
 {t:"escribe", p:"Escribe la propiedad que cambia la alineación en el eje cruzado de un único hijo flex",
  sol:["align-self"], pista:"Como align-items, pero para «uno mismo».",
  why:"No existe justify-self en Flexbox (en Grid sí): para mover un hijo suelto en el eje principal se usan márgenes automáticos."},
 {t:"par", p:"Empareja cada necesidad con su receta Flexbox",
  pares:[["El pie de página siempre abajo","body flex en columna y main con flex: 1"],["Avatar fijo y texto que ocupa el resto","img con flex: none y texto con flex: 1"],["Etiquetas que bajan de línea","flex-wrap: wrap con gap"],["Un botón pegado a la derecha","margin-left: auto en el botón"],["Tarjetas iguales en alto","align-items: stretch, que ya es el valor por defecto"]],
  why:"Casi todas las interfaces se construyen combinando estos cinco patrones."},
 {t:"opcion", p:"Quieres que unas opciones estén en fila en escritorio y en columna en móvil, sin media queries. ¿Qué escribes?",
  ops:["flex-direction: column siempre","flex-wrap: wrap en el contenedor y flex: 1 1 15rem en los hijos","display: block","order en cada hijo"],
  ok:1, why:"Cada hijo quiere al menos 15rem; cuando no caben en la fila, bajan a la siguiente y crecen para ocupar todo el ancho."}
]}

]});
