window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Grid a fondo",
resumen: "Pistas, fr y líneas; rejilla implícita; áreas con nombre y alineación; rejillas adaptables con auto-fit y minmax; subgrid; y cuándo usar Grid o Flexbox",
nivel: "Avanzado",
color: "#3363c7",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"cs6n1",
titulo:"Grid: pistas, fr y líneas",
claves:["Grid organiza en dos dimensiones: defines columnas y filas (pistas) en el contenedor","fr reparte el espacio libre después de restar tamaños fijos y gaps; repeat() y minmax() evitan repetir","Los hijos se colocan por números de línea (1 a n+1, y -1 es la última) o con span"],
pasos:[
 {t:"info", eti:"Dos dimensiones", h:"Pistas y líneas",
  c:`<div class="termbox">.rejilla {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;   /* 3 columnas: fija, una parte, dos partes */
  grid-template-rows: auto 1fr auto;      /* 3 filas */
  gap: 16px;                              /* row-gap y column-gap a la vez */
}
.cabecera { grid-column: 1 / -1; }        /* de la línea 1 a la última: todo el ancho */
.lateral  { grid-row: 2 / 4; }            /* de la línea 2 a la 4: dos filas */
.destacado { grid-column: span 2; }       /* ocupa dos columnas desde donde caiga */</div>
<div class="dg"><div class="dg-tit">3 columnas = 4 líneas verticales</div>
<svg viewBox="0 0 320 150" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Rejilla de tres columnas y dos filas con las líneas numeradas del 1 al 4 arriba y del -4 al -1 abajo; en la primera fila un elemento ocupa de la línea 1 a la -1">
<rect x="30" y="30" width="260" height="40" rx="4" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
<rect x="30" y="80" width="80" height="40" rx="4" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="1.5"/>
<rect x="120" y="80" width="80" height="40" rx="4" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="1.5"/>
<rect x="210" y="80" width="80" height="40" rx="4" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="1.5"/>
<text x="160" y="55" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">grid-column: 1 / -1</text>
<g font-size="12" font-family="var(--mono)" fill="var(--accent)" text-anchor="middle">
<text x="25" y="20">1</text><text x="115" y="20">2</text><text x="205" y="20">3</text><text x="295" y="20">4</text>
<text x="25" y="140">-4</text><text x="115" y="140">-3</text><text x="205" y="140">-2</text><text x="295" y="140">-1</text>
</g>
<g stroke="var(--accent)" stroke-width="1" stroke-dasharray="3 3">
<line x1="25" y1="24" x2="25" y2="126"/><line x1="115" y1="24" x2="115" y2="126"/><line x1="205" y1="24" x2="205" y2="126"/><line x1="295" y1="24" x2="295" y2="126"/>
</g>
</svg></div>
<p>Las líneas se numeran desde 1; con números negativos se cuentan desde el final. La cabecera, de 1 a -1, ocupa la fila entera tenga las columnas que tenga.</p>`},
 {t:"info", eti:"Por dentro", h:"fr, repeat(), minmax() y la rejilla implícita",
  c:`<div class="termbox">grid-template-columns: repeat(4, 1fr);             /* 4 columnas iguales */
grid-template-columns: 250px repeat(2, 1fr);       /* se pueden mezclar */
grid-template-columns: minmax(200px, 300px) 1fr;   /* entre 200 y 300px */
grid-template-columns: repeat(3, minmax(0, 1fr));  /* iguales DE VERDAD, aunque haya contenido largo */

/* rejilla implícita: lo que no has definido, Grid lo crea */
.galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;          /* altura de las filas que se creen solas */
  grid-auto-flow: row dense;      /* rellena huecos con elementos que quepan después */
}</div>
<p><b>Cómo calcula fr:</b> resta del ancho del contenedor las pistas fijas y los gaps, y lo que queda lo divide entre la suma de fr. Por eso <code>fr</code> es mejor que <code>%</code>: con porcentajes, <code>33% 33% 33%</code> más dos gaps se sale del contenedor.</p>
<div class="nota ojo"><b class="tit">1fr no siempre es igual</b><code>1fr</code> significa <code>minmax(auto, 1fr)</code>: no encoge por debajo del contenido mínimo (como <code>min-width: auto</code> en flex). Si una columna tiene una URL larga, se ensancha. Para columnas iguales pase lo que pase: <code>minmax(0, 1fr)</code>.</div>`},
 {t:"opcion", p:"Contenedor de 620px con <code>grid-template-columns: 1fr 2fr</code> y <code>gap: 20px</code>. ¿Cuánto mide la segunda columna?",
  ops:["413,3px","400px: (620 − 20) / 3 × 2","420px","310px"],
  ok:1, why:"Primero se resta el gap: 600px libres. 1fr = 200px, 2fr = 400px."},
 {t:"hueco", p:"Una cabecera que ocupa todas las columnas y una tarjeta destacada que ocupa dos",
  tpl:".cabecera { grid-column: 1 / ___; }\n.destacada { grid-column: ___ 2; }", banco:["-1","span","4","auto","end"], sol:["-1","span"],
  why:"-1 es la última línea de la rejilla explícita, sea cual sea el número de columnas. span 2 ocupa dos pistas desde su posición."},
 {t:"escribe", p:"Escribe la declaración que crea 3 columnas iguales usando repeat",
  sol:["grid-template-columns: repeat(3, 1fr)","grid-template-columns:repeat(3,1fr)","grid-template-columns: repeat(3, minmax(0, 1fr))","grid-template-columns:repeat(3,minmax(0,1fr))"], pista:"grid-template-columns: repeat(número, tamaño)",
  why:"repeat(3, 1fr) equivale a 1fr 1fr 1fr."},
 {t:"opcion", p:"¿Qué pasará? <code>grid-template-columns: repeat(3, 1fr)</code> con 7 hijos y sin <code>grid-template-rows</code>",
  ops:["Solo se ven 3 hijos","Grid crea filas implícitas: 3 filas (3 + 3 + 1), con altura auto salvo que definas grid-auto-rows","Los 7 se ponen en una fila","Da error"],
  ok:1, why:"Las pistas que no defines las crea la rejilla implícita. grid-auto-rows controla su tamaño y grid-auto-flow la dirección en que se rellenan."},
 {t:"vf", p:"<code>grid-template-columns: 33.33% 33.33% 33.33%</code> con <code>gap: 16px</code> cabe exactamente en el contenedor.",
  ok:false, why:"Los porcentajes no descuentan el gap: suman 100% + 32px y desbordan. fr sí reparte solo lo que queda tras los gaps."},
 {t:"par", p:"Empareja cada propiedad con su efecto",
  pares:[["grid-template-columns","Define las columnas explícitas"],["grid-auto-rows","Tamaño de las filas que Grid crea solas"],["grid-auto-flow: dense","Rellena huecos con elementos posteriores"],["grid-column: span 3","Ocupa tres columnas"],["minmax(0, 1fr)","Una parte que puede encoger por debajo del contenido"]],
  why:"dense cambia el orden visual respecto al HTML: úsalo en galerías, no en contenido que se lee en orden."}
]},

/* =============== U6 L2 =============== */
{
id:"cs6n2",
titulo:"Áreas con nombre y alineación",
claves:["grid-template-areas dibuja la maqueta con nombres; cada hijo se coloca con grid-area","Cambiar de diseño en otra pantalla es redefinir las áreas, sin tocar el HTML","justify-* e align-* alinean en filas y columnas; place-items: center centra todo; varios hijos pueden compartir celda"],
pasos:[
 {t:"info", eti:"Dibujar la maqueta", h:"grid-template-areas",
  c:`<div class="termbox">.pagina {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "cabecera cabecera"
    "lateral  contenido"
    "pie      pie";
  min-height: 100svh;
}
.cabecera  { grid-area: cabecera; }
.lateral   { grid-area: lateral; }
.contenido { grid-area: contenido; }
.pie       { grid-area: pie; }

@media (max-width: 700px) {       /* en móvil: una columna, mismo HTML */
  .pagina {
    grid-template-columns: 1fr;
    grid-template-areas: "cabecera" "contenido" "lateral" "pie";
  }
}</div>
<div class="dg"><div class="dg-tit">la maqueta que dibujan las áreas</div><div class="dg-pila">
<div class="dg-fila"><div class="dg-caja acento">cabecera</div></div>
<div class="dg-fila" style="grid-template-columns:1fr 3fr;grid-auto-flow:row"><div class="dg-caja base">lateral</div><div class="dg-caja ok">contenido</div></div>
<div class="dg-fila"><div class="dg-caja acento">pie</div></div>
</div></div>
<p>Reglas: todas las filas con el mismo número de celdas, cada área un <b>rectángulo</b>, y un punto (<code>.</code>) para una celda vacía. Si no se cumple, la declaración entera es inválida y se ignora.</p>`},
 {t:"info", eti:"Alinear y superponer", h:"Alineación en Grid y celdas compartidas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">alineación en Grid</div><table class="dg-tabla"><thead><tr><th>propiedad</th><th>dónde</th><th>qué alinea</th></tr></thead><tbody>
<tr><td>justify-items / align-items</td><td>contenedor</td><td>cada hijo dentro de su celda (horizontal / vertical)</td></tr>
<tr><td>place-items</td><td>contenedor</td><td>las dos a la vez: <code>place-items: center</code></td></tr>
<tr><td>justify-self / align-self</td><td>hijo</td><td>solo ese hijo dentro de su celda</td></tr>
<tr><td>justify-content / align-content</td><td>contenedor</td><td>las pistas enteras, si sobra espacio en la rejilla</td></tr>
</tbody></table></div>
<div class="termbox">/* texto sobre una imagen sin position: absolute: los dos en la misma celda */
.heroe { display: grid; }
.heroe &gt; * { grid-area: 1 / 1; }          /* fila 1, columna 1: se apilan */
.heroe .texto { align-self: end; padding: 2rem; z-index: 1; }</div>
<p>La superposición con <code>grid-area: 1 / 1</code> es mejor que <code>position: absolute</code>: el contenedor sigue midiendo lo que mide el hijo más grande, así que un texto largo nunca se sale de la imagen.</p>`},
 {t:"hueco", p:"Completa la maqueta: cabecera arriba ocupando las dos columnas y el contenido colocado en su área",
  tpl:".pagina { grid-template-___:\n  \"cabecera cabecera\"\n  \"lateral contenido\"; }\n.main { grid-___: contenido; }", banco:["areas","area","columns","rows","template"], sol:["areas","area"],
  why:"grid-template-areas en el contenedor, grid-area en cada hijo. Repetir el nombre en varias celdas hace que el área se extienda."},
 {t:"opcion", p:"¿Qué pasará? <code>grid-template-areas: \"a a\" \"b a\"</code>",
  ops:["El área a tiene forma de L","La declaración es inválida y se ignora: el área a no es un rectángulo","b ocupa toda la fila","Funciona solo en Firefox"],
  ok:1, why:"Las áreas deben ser rectangulares. DevTools marca la declaración como inválida, y todos los hijos acaban en la colocación automática."},
 {t:"escribe", p:"Escribe la declaración del contenedor grid que centra cada hijo dentro de su celda en los dos ejes",
  sol:["place-items: center","place-items:center"], pista:"place- es la abreviatura de align- y justify- a la vez.",
  why:"display: grid; place-items: center; son dos líneas para centrar cualquier cosa."},
 {t:"par", p:"Empareja cada propiedad de alineación con lo que mueve",
  pares:[["justify-items","Los hijos dentro de su celda, en horizontal"],["align-self","Un hijo concreto, en vertical"],["justify-content","Las columnas enteras cuando sobra espacio"],["place-items","Hijos en los dos ejes a la vez"]],
  why:"En Grid hay justify-self (en Flexbox no): puedes mover un hijo en horizontal dentro de su celda."},
 {t:"vf", p:"Para cambiar la maqueta en móvil con áreas, basta con redefinir <code>grid-template-areas</code> (y las pistas) en una media query, sin tocar el HTML.",
  ok:true, why:"Es la gran ventaja de las áreas: el orden visual se decide en CSS. Ojo, eso sí, con que el orden visual no contradiga demasiado al del HTML."},
 {t:"opcion", p:"Quieres un texto encima de una imagen de portada, abajo a la izquierda, sin que se salga nunca aunque el texto sea largo. ¿Qué haces?",
  ops:["position: absolute; bottom: 0 en el texto","Contenedor grid con imagen y texto en grid-area: 1 / 1 y align-self: end en el texto","float en la imagen","margin-top negativo en el texto"],
  ok:1, why:"Al compartir celda, el contenedor crece si el texto es más alto que la imagen. Con absolute, el texto largo se saldría por arriba."}
]},

/* =============== U6 L3 =============== */
{
id:"cs6n3",
titulo:"Rejillas adaptables y subgrid",
claves:["repeat(auto-fit, minmax(240px, 1fr)): tantas columnas como quepan, sin media queries","auto-fill conserva las columnas vacías; auto-fit las colapsa y estira los elementos","subgrid hace que los hijos compartan las pistas del abuelo: tarjetas con títulos y botones alineados entre sí"],
pasos:[
 {t:"info", eti:"Sin media queries", h:"auto-fill y auto-fit",
  c:`<div class="termbox">.catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 16px;
}</div>
<p>Se lee así: «crea tantas columnas como quepan de al menos 240px, y reparte lo que sobre». El <code>min(240px, 100%)</code> evita desbordar si el contenedor mide menos de 240px (un móvil muy estrecho).</p>
<div class="dg"><div class="dg-tit">2 tarjetas en un contenedor donde caben 4 columnas</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">auto-fill</div><div class="dg-fila"><div class="dg-caja acento">A</div><div class="dg-caja acento">B</div><div class="dg-caja base" style="border-style:dashed">vacía</div><div class="dg-caja base" style="border-style:dashed">vacía</div></div></div>
<div class="dg-col"><div class="dg-col-tit">auto-fit</div><div class="dg-fila"><div class="dg-caja ok">A (estirada)</div><div class="dg-caja ok">B (estirada)</div></div></div>
</div><div class="dg-nota arriba">con muchos elementos se comportan igual; la diferencia solo se ve cuando sobran columnas</div></div>`},
 {t:"info", eti:"Alinear entre tarjetas", h:"subgrid",
  c:`<p>Problema: tres tarjetas en fila, cada una con título, texto y botón. Si un título ocupa dos líneas, los textos y los botones de las tarjetas quedan a alturas distintas. Cada tarjeta es su propio mundo.</p>
<div class="termbox">.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}
.tarjeta {
  display: grid;
  grid-row: span 3;                 /* la tarjeta ocupa 3 filas del padre... */
  grid-template-rows: subgrid;      /* ...y sus hijos usan ESAS filas */
  gap: .5rem;
}
/* ahora los títulos, textos y botones de todas las tarjetas de una fila se alinean */</div>
<p><code>subgrid</code> está en todos los navegadores desde 2023. Sirve también para formularios (etiquetas y campos alineados en varios bloques) y para listas con columnas.</p>
<div class="nota"><b class="tit">¿Y el masonry?</b>La rejilla tipo Pinterest (columnas con elementos de alturas distintas, sin huecos) está en pleno proceso de estandarización. Hasta que esté en todos los navegadores, se hace con <code>columns</code> (orden por columnas) o con JavaScript.</div>`},
 {t:"opcion", p:"¿Qué pasará? <code>repeat(auto-fit, minmax(200px, 1fr))</code> con solo 2 elementos en un contenedor de 1200px",
  ops:["Dos columnas de 200px y el resto vacío","Los dos elementos se estiran hasta 600px cada uno: auto-fit colapsa las columnas vacías","Seis columnas con dos ocupadas y cuatro visibles vacías","Una sola columna"],
  ok:1, why:"Con auto-fill tendrías 6 pistas de 200px (4 vacías que siguen ocupando sitio). Elige auto-fit si quieres que llenen el ancho y auto-fill si prefieres que mantengan el tamaño."},
 {t:"hueco", p:"La rejilla adaptable que no se desborda en contenedores estrechos",
  tpl:"grid-template-columns: repeat(___, minmax(___(240px, 100%), 1fr));", banco:["auto-fit","min","max","auto","clamp"], sol:["auto-fit","min"],
  why:"Sin el min(), en un contenedor de 200px la columna seguiría pidiendo 240px y desbordaría."},
 {t:"escribe", p:"Escribe la declaración que hace que las filas de una tarjeta sean las de la rejilla del padre",
  sol:["grid-template-rows: subgrid","grid-template-rows:subgrid"], pista:"grid-template-rows con el valor que reutiliza las pistas del padre.",
  why:"La tarjeta debe ocupar varias filas del padre (grid-row: span N) para que haya pistas que heredar."},
 {t:"vf", p:"<code>auto-fill</code> y <code>auto-fit</code> dan exactamente el mismo resultado cuando hay elementos de sobra para llenar todas las columnas.",
  ok:true, why:"Solo se diferencian cuando quedan columnas vacías."},
 {t:"opcion", p:"Tres tarjetas en fila: los botones «Comprar» quedan a alturas distintas porque los títulos tienen distinta longitud. ¿La solución más limpia?",
  ops:["Altura fija en los títulos","Cada tarjeta ocupa 3 filas del padre con grid-template-rows: subgrid","Un margin-top distinto en cada botón","JavaScript que iguala alturas"],
  ok:1, why:"Con subgrid, los títulos comparten fila entre sí, los textos también y los botones también. (Si solo quieres el botón al fondo, basta con flex en columna y margin-top: auto.)"},
 {t:"par", p:"Empareja cada técnica con su resultado",
  pares:[["repeat(auto-fill, minmax(200px, 1fr))","Columnas de al menos 200px, conservando las vacías"],["repeat(auto-fit, minmax(200px, 1fr))","Columnas que se estiran si sobran huecos"],["grid-template-rows: subgrid","Hijos alineados con las filas del abuelo"],["grid-auto-rows: minmax(150px, auto)","Filas de al menos 150px que crecen con el contenido"]],
  why:"Esta plataforma usa repeat(auto-fill, minmax(...)) en su catálogo: varias columnas en escritorio, una en móvil."}
]},

/* =============== U6 L4 =============== */
{
id:"cs6n4",
titulo:"Grid o Flexbox: decidir y combinar",
claves:["Flexbox: una dimensión, el contenido manda. Grid: dos dimensiones, la rejilla manda","Se combinan: Grid para el esqueleto y las rejillas, Flexbox dentro de los componentes","Líneas con nombre (nombre-start / nombre-end) para maquetas de contenido centrado con elementos a sangre"],
pasos:[
 {t:"info", eti:"Decidir", h:"¿Cuál uso?",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">Flexbox o Grid</div><table class="dg-tabla"><thead><tr><th>pregunta</th><th>Flexbox</th><th>Grid</th></tr></thead><tbody>
<tr><td>dimensiones</td><td>una (fila o columna)</td><td>dos (filas y columnas a la vez)</td></tr>
<tr><td>quién decide el tamaño</td><td>el contenido (de dentro afuera)</td><td>la rejilla (de fuera adentro)</td></tr>
<tr><td>alinear en columnas entre filas</td><td>no</td><td>sí</td></tr>
<tr><td>superponer elementos</td><td>no</td><td>sí (misma celda)</td></tr>
<tr><td>típico</td><td>barras, botones con icono, listas de etiquetas, centrar</td><td>esqueleto de página, galerías, formularios, paneles</td></tr>
</tbody></table></div>
<p>Pista práctica: si al usar Flexbox acabas poniendo anchos en porcentaje a los hijos para que «cuadren» con la fila de abajo, lo que querías era Grid.</p>`},
 {t:"info", eti:"Patrón", h:"Contenido centrado con elementos a sangre",
  c:`<div class="termbox">.articulo {
  display: grid;
  grid-template-columns:
    [completo-start] minmax(1rem, 1fr)
    [contenido-start] min(65ch, 100% - 2rem) [contenido-end]
    minmax(1rem, 1fr) [completo-end];
}
.articulo &gt; * { grid-column: contenido; }            /* todo en la columna de lectura */
.articulo &gt; .a-sangre { grid-column: completo; }     /* imágenes de lado a lado */</div>
<p>Las líneas llamadas <code>algo-start</code> y <code>algo-end</code> crean automáticamente un área implícita llamada <code>algo</code>, por eso funciona <code>grid-column: contenido</code>. Los sufijos tienen que ser exactamente <code>-start</code> y <code>-end</code>.</p>`},
 {t:"par", p:"Empareja cada problema con la herramienta más natural",
  pares:[["Barra con logo, menú y botón","Flexbox"],["Esqueleto con cabecera, lateral, contenido y pie","Grid con áreas"],["Galería de fotos adaptable","Grid con auto-fill y minmax"],["Botón con icono y texto centrados","Flexbox (o inline-flex)"],["Formulario con etiquetas y campos alineados en columnas","Grid de dos columnas"]],
  why:"No son rivales: una página típica tiene un Grid fuera y decenas de Flexbox dentro."},
 {t:"opcion", p:"Tienes una lista de tarjetas en Flexbox con <code>flex-wrap</code>. La última fila, con 2 tarjetas, las estira a lo ancho y no quedan alineadas con las columnas de arriba. ¿Qué haces?",
  ops:["Añadir tarjetas invisibles de relleno","Pasar a Grid con repeat(auto-fill, minmax(...)): las columnas son las mismas en todas las filas","Poner justify-content: center","flex-grow: 0 y anchos en px"],
  ok:1, why:"Es el síntoma clásico de un problema bidimensional resuelto con una herramienta de una dimensión."},
 {t:"hueco", p:"Un artículo con columna de lectura centrada y una imagen de lado a lado",
  tpl:".articulo > * { grid-column: contenido; }\n.articulo > .foto { grid-column: ___; }\n/* líneas: [completo-___] ... [contenido-start] ... [contenido-end] ... [completo-end] */", banco:["completo","start","inicio","contenido","full"], sol:["completo","start"],
  why:"Las líneas completo-start y completo-end crean el área implícita «completo». Con completo-inicio no funcionaría: el sufijo tiene que ser -start/-end."},
 {t:"orden", p:"Ordena los pasos al maquetar una página nueva",
  items:["Escribir el HTML semántico con el contenido real","Estilos base: tipografía, colores, reset","Esqueleto de la página con Grid","Componentes internos con Flexbox","Ajustes responsive donde el contenido lo pida"],
  why:"Maquetar sobre contenido real (no lorem ipsum) evita sorpresas con textos largos, traducciones y datos vacíos."},
 {t:"vf", p:"Un elemento puede ser a la vez hijo de un grid y contenedor flex de sus propios hijos.",
  ok:true, why:"Cada contenedor decide cómo coloca a sus hijos directos. Grid fuera y Flexbox dentro es la combinación más habitual."},
 {t:"opcion", p:"«Nunca uso Grid, con Flexbox hago todo.» ¿Qué le responderías en una revisión de código?",
  ops:["Tiene razón, Grid es más lento","Flexbox sirve para una dimensión; para alinear filas y columnas a la vez, Grid da menos CSS, menos anchos mágicos y un HTML más limpio","Grid solo funciona en Chrome","Hay que usar tablas"],
  ok:1, why:"Grid lleva en todos los navegadores desde 2017. Elegir la herramienta adecuada reduce CSS y errores."}
]}

]});
