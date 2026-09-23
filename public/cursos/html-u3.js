window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "HTML semántico, landmarks y tablas",
resumen: "Etiquetas con significado, regiones de la página y navegación, tablas de datos accesibles y cómo escribir HTML válido",
nivel: "Intermedio",
color: "#ec7f52",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"hc2l1",
titulo:"HTML semántico",
claves:["Usa la etiqueta que describe el contenido: header, nav, main, article, section, aside, footer","article se entiende solo fuera de la página; section es un apartado con su propio título","div y span son la última opción: cajas sin significado para agrupar o estilar"],
pasos:[
 {t:"info", eti:"Significado", h:"Estructura de una página",
  c:`<div class="termbox">&lt;header&gt;
  &lt;nav aria-label="Principal"&gt;&lt;a href="/"&gt;Inicio&lt;/a&gt; &lt;a href="/cursos"&gt;Cursos&lt;/a&gt;&lt;/nav&gt;
&lt;/header&gt;
&lt;main&gt;
  &lt;article&gt;
    &lt;h1&gt;Cómo funciona Docker&lt;/h1&gt;
    &lt;p&gt;Publicado el &lt;time datetime="2026-09-01"&gt;1 de septiembre&lt;/time&gt;&lt;/p&gt;
    &lt;section&gt;&lt;h2&gt;Imágenes&lt;/h2&gt;...&lt;/section&gt;
    &lt;section&gt;&lt;h2&gt;Contenedores&lt;/h2&gt;...&lt;/section&gt;
  &lt;/article&gt;
  &lt;aside&gt;&lt;h2&gt;Lecturas relacionadas&lt;/h2&gt;...&lt;/aside&gt;
&lt;/main&gt;
&lt;footer&gt;© 2026 Catappa · &lt;address&gt;&lt;a href="mailto:hola@catappa.dev"&gt;hola@catappa.dev&lt;/a&gt;&lt;/address&gt;&lt;/footer&gt;</div>
     <p>Con <code>&lt;div&gt;</code> para todo, la página se ve igual, pero un lector de pantalla no sabe dónde está la navegación ni el contenido principal, un buscador entiende peor la página y el siguiente desarrollador tampoco.</p>`},
 {t:"info", eti:"Elegir bien", h:"article, section, aside o div",
  c:`<div class="dg"><div class="dg-tit">qué contenedor elegir</div>
       <div class="dg-vert">
         <div class="dg-caja doble">¿Tendría sentido suelto, en otra web o en un RSS?<small>sí → &lt;article&gt; (entrada de blog, producto, comentario, tarjeta de noticia)</small></div>
         <div class="dg-caja doble">¿Es un apartado temático con su propio título?<small>sí → &lt;section&gt; con un h2/h3</small></div>
         <div class="dg-caja doble">¿Es complementario, se podría quitar sin romper el tema?<small>sí → &lt;aside&gt; (barra lateral, nota al margen)</small></div>
         <div class="dg-caja base doble">¿Solo necesitas una caja para CSS?<small>&lt;div&gt; (o &lt;span&gt; en línea)</small></div>
       </div></div>
     <div class="nota ojo"><b class="tit">El «outline» de HTML5 nunca existió</b>Se decía que cada section reiniciaba los niveles y que podías usar h1 en todas. Ningún navegador ni lector de pantalla lo implementó y la especificación lo retiró en 2022. Usa los niveles h1–h6 reales según la jerarquía.</div>`},
 {t:"par", p:"Empareja cada etiqueta semántica con su contenido",
  pares:[["<header>","Cabecera de la página o de una sección"],["<nav>","Bloque de enlaces de navegación importantes"],["<main>","Contenido principal (uno por página)"],["<article>","Contenido independiente: una entrada, una noticia"],["<aside>","Contenido complementario, al margen"],["<footer>","Pie con información secundaria"]],
  why:"div y span siguen siendo útiles cuando no hay una etiqueta con significado."},
 {t:"opcion", p:"¿Qué es mejor para una acción que no navega a otra página, como «Guardar»?",
  ops:["&lt;div onclick=...&gt;Guardar&lt;/div&gt;","&lt;button type=\"button\"&gt;Guardar&lt;/button&gt;","&lt;a href=\"#\"&gt;Guardar&lt;/a&gt;","&lt;span&gt;Guardar&lt;/span&gt;"],
  ok:1, why:"button es accesible por teclado, se anuncia como botón y tiene comportamiento nativo."},
 {t:"opcion", p:"Una tienda muestra una rejilla de productos, cada uno con foto, nombre, precio y botón. ¿Qué elemento envuelve cada producto?",
  ops:["&lt;section&gt;","&lt;article&gt;","&lt;aside&gt;","&lt;main&gt;"],
  ok:1, why:"Cada ficha tiene sentido por sí sola (podría compartirse o aparecer en otra página): es un article. Y la rejilla entera suele ser una lista (<code>ul</code>) o una section con título."},
 {t:"vf", p:"Si metes cada apartado en un <code>&lt;section&gt;</code>, puedes usar <code>&lt;h1&gt;</code> en todos y el navegador ajusta los niveles solo.",
  ok:false, why:"Ese «algoritmo de esquema» nunca se implementó y ya no está en la norma. Los lectores de pantalla anuncian «encabezado nivel 1» en todos: la jerarquía se pierde."},
 {t:"escribe", p:"¿Cuántos elementos <code>&lt;main&gt;</code> visibles puede tener una página? (escribe el número)",
  sol:["1","uno"],
  pista:"Es el contenido principal.",
  why:"Puede haber más si los demás llevan <code>hidden</code> (en aplicaciones que cambian de vista), pero solo uno visible a la vez."},
 {t:"hueco", p:"Completa la estructura con las etiquetas semánticas",
  tpl:"<___>\n  <h1>Receta de tortilla</h1>\n  <___><h2>Ingredientes</h2>…</section>\n  <___><h2>Otras recetas</h2>…</aside>\n</article>",
  banco:["article","section","aside","div","main","nav"], sol:["article","section","aside"],
  why:"La receta es independiente (article), los ingredientes son un apartado con título (section) y otras recetas es complementario (aside)."}
]},

/* =============== U3 L2 =============== */
{
id:"ht3n1",
titulo:"Landmarks y navegación dentro de la página",
claves:["Los elementos semánticos crean landmarks: regiones a las que el lector de pantalla salta directamente","Varios nav se distinguen con aria-label; las migas de pan marcan la página actual con aria-current","Un enlace «Saltar al contenido» evita tabular por todo el menú en cada página"],
pasos:[
 {t:"info", eti:"Regiones", h:"Elementos que son landmarks",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">elemento → landmark (rol implícito)</div><table class="dg-tabla"><thead><tr><th>elemento</th><th>rol</th><th>cuándo</th></tr></thead><tbody>
     <tr><td>header</td><td>banner</td><td>Solo el de la página, no el que está dentro de article, section, aside o main.</td></tr>
     <tr><td>nav</td><td>navigation</td><td>Siempre.</td></tr>
     <tr><td>main</td><td>main</td><td>Siempre.</td></tr>
     <tr><td>aside</td><td>complementary</td><td>Siempre en el nivel superior.</td></tr>
     <tr><td>footer</td><td>contentinfo</td><td>Solo el de la página.</td></tr>
     <tr><td>section</td><td>region</td><td>Solo si tiene nombre accesible (aria-label o aria-labelledby).</td></tr>
     <tr><td>form</td><td>form</td><td>Solo si tiene nombre accesible.</td></tr>
     <tr><td>search</td><td>search</td><td>Elemento nuevo (2023) para envolver un buscador.</td></tr></tbody></table></div>
     <p>Los lectores de pantalla tienen un menú de landmarks (en VoiceOver, el rotor; en NVDA, la tecla D salta de uno a otro). Una página bien marcada se «hojea» igual que una persona vidente echa un vistazo.</p>`},
 {t:"info", eti:"Patrones", h:"Saltar al contenido y migas de pan",
  c:`<div class="termbox">&lt;body&gt;
  &lt;a class="saltar" href="#contenido"&gt;Saltar al contenido&lt;/a&gt;   &lt;!-- lo primero del body --&gt;
  &lt;header&gt;
    &lt;nav aria-label="Principal"&gt;…&lt;/nav&gt;
  &lt;/header&gt;
  &lt;main id="contenido" tabindex="-1"&gt;
    &lt;nav aria-label="Migas de pan"&gt;
      &lt;ol&gt;
        &lt;li&gt;&lt;a href="/"&gt;Inicio&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="/cursos"&gt;Cursos&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="/cursos/html" aria-current="page"&gt;HTML&lt;/a&gt;&lt;/li&gt;
      &lt;/ol&gt;
    &lt;/nav&gt;
    &lt;search&gt;&lt;form action="/buscar"&gt;…&lt;/form&gt;&lt;/search&gt;</div>
     <ul><li>El enlace de salto se oculta visualmente y aparece al recibir el foco (con CSS en <code>:focus</code>). Cumple WCAG 2.4.1 (evitar bloques).</li>
     <li>Dos <code>nav</code> sin nombre se anuncian igual: «navegación». Con <code>aria-label</code> son «navegación Principal» y «navegación Migas de pan» (no pongas la palabra «navegación» en la etiqueta: se repetiría).</li>
     <li><code>aria-current="page"</code> marca el enlace de la página actual, también en el menú principal.</li></ul>`},
 {t:"par", p:"Empareja cada elemento con el landmark que crea",
  pares:[["<header> de la página","banner"],["<nav>","navigation"],["<aside>","complementary"],["<footer> de la página","contentinfo"],['<section aria-label="Ofertas">',"region"]],
  why:"Un section sin nombre no es landmark: sería ruido. Por eso solo se convierte en region cuando le das un nombre."},
 {t:"opcion", p:"Tu página tiene un menú principal y otro de enlaces legales en el pie, los dos con <code>&lt;nav&gt;</code>. ¿Qué haces?",
  ops:["Quitar uno de los nav","Darles nombres distintos con aria-label (\"Principal\", \"Legal\")","Poner role=\"navigation\" en los dos","Nada, el lector los distingue solo"],
  ok:1, why:"Sin nombre, la lista de landmarks muestra dos «navegación» iguales. El rol ya lo tienen por ser nav: añadir role=\"navigation\" es redundante."},
 {t:"hueco", p:"Completa las migas de pan marcando la página actual",
  tpl:'<nav ___="Migas de pan">\n  <ol>\n    <li><a href="/">Inicio</a></li>\n    <li><a href="/blog" ___="page">Blog</a></li>\n  </ol>\n</nav>',
  banco:["aria-label","aria-current","title","aria-selected","role","class"], sol:["aria-label","aria-current"],
  why:"<code>aria-selected</code> es para pestañas y opciones de listas, no para navegación. En las migas se usa <code>ol</code> porque el orden importa."},
 {t:"orden", p:"Ordena el principio del body de una página accesible",
  items:['<a class="saltar" href="#contenido">Saltar al contenido</a>','<header> con el logo y <nav aria-label="Principal">','<main id="contenido">','<footer> con los enlaces legales'],
  why:"El enlace de salto tiene que ser lo primero que alcanza el tabulador, o no ahorra nada."},
 {t:"vf", p:"Un <code>&lt;header&gt;</code> dentro de un <code>&lt;article&gt;</code> crea un landmark banner.",
  ok:false, why:"Solo el header de nivel de página es banner. Dentro de article o section es una simple cabecera de ese contenido, igual que el footer interno no es contentinfo."},
 {t:"escribe", p:"¿Qué atributo con qué valor marca en un menú el enlace de la página en la que estás?",
  sol:["aria-current=\"page\"","aria-current=page","aria-current='page'"],
  pista:"aria + «actual».",
  why:"El lector dice «página actual» y además puedes estilarlo en CSS con <code>[aria-current=\"page\"]</code>: una sola fuente de verdad."}
]},

/* =============== U3 L3 =============== */
{
id:"ht3n2",
titulo:"Tablas de datos accesibles",
claves:["table con caption, thead, tbody y tfoot; th para encabezados con scope","colspan y rowspan unen celdas; en tablas complejas, headers e id","Las tablas son para datos, nunca para maquetar"],
pasos:[
 {t:"info", eti:"Datos en filas y columnas", h:"Una tabla completa",
  c:`<div class="termbox">&lt;table&gt;
  &lt;caption&gt;Pedidos del tercer trimestre&lt;/caption&gt;
  &lt;thead&gt;
    &lt;tr&gt;&lt;th scope="col"&gt;Mes&lt;/th&gt;&lt;th scope="col"&gt;Pedidos&lt;/th&gt;&lt;th scope="col"&gt;Total&lt;/th&gt;&lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Julio&lt;/th&gt;&lt;td&gt;120&lt;/td&gt;&lt;td&gt;5.400 €&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Agosto&lt;/th&gt;&lt;td&gt;95&lt;/td&gt;&lt;td&gt;4.100 €&lt;/td&gt;&lt;/tr&gt;
  &lt;/tbody&gt;
  &lt;tfoot&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Total&lt;/th&gt;&lt;td&gt;215&lt;/td&gt;&lt;td&gt;9.500 €&lt;/td&gt;&lt;/tr&gt;
  &lt;/tfoot&gt;
&lt;/table&gt;</div>
     <p>Al moverse a la celda «4.100 €», el lector de pantalla dice «Agosto, Total, 4.100 €»: por eso los encabezados son <code>th</code> y no <code>td</code> en negrita. <code>caption</code> es el título de la tabla (primer hijo) y el lector lo anuncia al entrar.</p>`},
 {t:"info", eti:"Casos difíciles", h:"Celdas combinadas y tablas anchas",
  c:`<div class="termbox">&lt;tr&gt;&lt;th colspan="2" scope="colgroup"&gt;Primer semestre&lt;/th&gt;&lt;/tr&gt;   &lt;!-- ocupa dos columnas --&gt;
&lt;tr&gt;&lt;td rowspan="3"&gt;Madrid&lt;/td&gt;…&lt;/tr&gt;                                &lt;!-- ocupa tres filas --&gt;

&lt;!-- tabla muy compleja: cada celda dice explícitamente sus encabezados --&gt;
&lt;th id="h-ene"&gt;Enero&lt;/th&gt; … &lt;td headers="h-ene h-madrid"&gt;42&lt;/td&gt;

&lt;!-- en móvil: desplazamiento horizontal accesible con teclado --&gt;
&lt;div role="region" aria-labelledby="cap-pedidos" tabindex="0" style="overflow-x: auto"&gt;
  &lt;table&gt;&lt;caption id="cap-pedidos"&gt;Pedidos&lt;/caption&gt;…&lt;/table&gt;
&lt;/div&gt;</div>
     <p>Si una tabla necesita muchos <code>headers</code>, suele ser mejor partirla en varias tablas sencillas. Y si solo es para colocar cosas en columnas, es trabajo de CSS Grid: una tabla de maquetación hace que el lector anuncie «tabla de 3 columnas» sobre algo que no lo es.</p>`},
 {t:"par", p:"Empareja cada etiqueta con su significado",
  pares:[["<caption>","Título de la tabla"],["<th>","Celda de encabezado"],["<td>","Celda de datos"],["<tfoot>","Filas de resumen o totales"],["<tr>","Fila"]],
  why:"thead, tbody y tfoot agrupan filas: ayudan a la lectura y permiten, por ejemplo, repetir la cabecera en cada página al imprimir."},
 {t:"opcion", p:"¿Para qué NO deberías usar una tabla?",
  ops:["Mostrar pedidos con sus columnas","Colocar el menú a la izquierda y el contenido a la derecha","Comparar precios de planes","Mostrar horarios"],
  ok:1, why:"La maquetación se hace con CSS (Flexbox y Grid). Las tablas son para datos tabulares."},
 {t:"hueco", p:"Completa los encabezados de fila y columna",
  tpl:'<tr><th ___="col">Plan</th><th scope="col">Precio</th></tr>\n<tr><th scope="___">Pro</th><td>9 €</td></tr>',
  banco:["scope","row","col","headers","span","id"], sol:["scope","row"],
  why:"<code>scope=\"col\"</code> dice que el th manda sobre la columna; <code>scope=\"row\"</code>, sobre la fila. En tablas simples el navegador lo deduce, pero explícito no falla."},
 {t:"orden", p:"Ordena los hijos de una tabla completa",
  items:["<caption>","<thead>","<tbody>","<tfoot>"],
  why:"caption tiene que ser el primer hijo. tfoot va tras tbody (hace años se permitía antes, ya no)."},
 {t:"escribe", p:"¿Qué atributo hace que una celda ocupe tres columnas? (con su valor)",
  sol:["colspan=\"3\"","colspan=3","colspan='3'"],
  pista:"column + span.",
  why:"Para filas es <code>rowspan</code>. Cada fila tiene que seguir sumando el mismo número de columnas o la tabla se descuadra."},
 {t:"vf", p:"Poner los encabezados como <code>&lt;td&gt;&lt;b&gt;Mes&lt;/b&gt;&lt;/td&gt;</code> es equivalente a usar <code>&lt;th&gt;</code>.",
  ok:false, why:"Visualmente parecido, semánticamente no: el lector de pantalla no puede asociar los datos con su encabezado y lee números sueltos sin contexto."}
]},

/* =============== U3 L4 =============== */
{
id:"ht3n3",
titulo:"HTML válido: modelos de contenido y validación",
claves:["Cada elemento tiene un modelo de contenido: qué puede ir dentro","Un párrafo no admite bloques; un enlace o botón no admite otros elementos interactivos","Valida con el Nu HTML Checker y automatiza en CI con html-validate"],
pasos:[
 {t:"info", eti:"Reglas del juego", h:"Qué puede ir dentro de qué",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">errores de anidamiento frecuentes</div><table class="dg-tabla"><thead><tr><th>incorrecto</th><th>por qué</th><th>correcto</th></tr></thead><tbody>
     <tr><td>&lt;p&gt;&lt;div&gt;…&lt;/div&gt;&lt;/p&gt;</td><td>p solo admite contenido en línea (<i>phrasing</i>)</td><td>div con p dentro, o solo p</td></tr>
     <tr><td>&lt;a href&gt;&lt;button&gt;…&lt;/button&gt;&lt;/a&gt;</td><td>nada interactivo dentro de un enlace o botón</td><td>un a con estilo de botón, o un button</td></tr>
     <tr><td>&lt;ul&gt;&lt;div&gt;&lt;li&gt;…&lt;/li&gt;&lt;/div&gt;&lt;/ul&gt;</td><td>ul solo admite li</td><td>el div fuera o dentro del li</td></tr>
     <tr><td>&lt;form&gt;&lt;form&gt;…&lt;/form&gt;&lt;/form&gt;</td><td>no se anidan formularios</td><td>atributo form="id" en los campos</td></tr>
     <tr><td>id="precio" dos veces</td><td>los id son únicos</td><td>class, o id distintos</td></tr>
     <tr><td>&lt;h2&gt; justo tras &lt;h4&gt;… saltos de nivel</td><td>no es un error de validación, sí de accesibilidad</td><td>niveles consecutivos</td></tr></tbody></table></div>
     <p>Desde HTML5 un <code>&lt;a&gt;</code> puede envolver bloques enteros (una tarjeta con título y párrafo): su modelo es «transparente». Lo que no puede contener es otro elemento interactivo.</p>`},
 {t:"info", eti:"Herramientas", h:"Validar a mano y en CI",
  c:`<ul><li><b>Nu HTML Checker</b> (<code>validator.w3.org/nu</code>): el validador de referencia. Pega el HTML o la URL.</li>
     <li><b>html-validate</b> o <b>HTMLHint</b>: validan en tu editor y en el pipeline, con reglas de accesibilidad incluidas.</li>
     <li><b>axe</b> y <b>Lighthouse</b>: auditorías de accesibilidad sobre el DOM real.</li></ul>
     <div class="termbox">$ npx html-validate "dist/**/*.html"
dist/index.html
  12:5  error  Element &lt;div&gt; is not permitted as content under &lt;p&gt;   element-permitted-content
  30:9  error  Duplicate ID "precio"                                  no-dup-id
✖ 2 problems (2 errors, 0 warnings)</div>
     <p>¿Por qué importa si el navegador lo arregla? Porque cada navegador lo arregla según unas reglas que casi nadie conoce: el CSS no se aplica donde esperas, el JavaScript no encuentra el nodo y el árbol de accesibilidad sale roto.</p>`},
 {t:"opcion", p:"Una tarjeta entera tiene que ser clicable y llevar a la ficha del producto. ¿Qué es válido?",
  ops:["&lt;div onclick=\"location='/p/1'\"&gt;…&lt;/div&gt;","&lt;a href=\"/p/1\"&gt;&lt;h3&gt;Silla&lt;/h3&gt;&lt;p&gt;45 €&lt;/p&gt;&lt;/a&gt;","&lt;button&gt;&lt;a href=\"/p/1\"&gt;Silla&lt;/a&gt;&lt;/button&gt;","&lt;p&gt;&lt;a href=\"/p/1\"&gt;&lt;div&gt;Silla&lt;/div&gt;&lt;/a&gt;&lt;/p&gt;"],
  ok:1, why:"El enlace es transparente: puede contener bloques si su padre los admite. Si la tarjeta tiene además un botón «Añadir al carrito», ya no vale: se enlaza solo el título y se extiende el área de clic con CSS."},
 {t:"par", p:"Empareja cada error con su arreglo",
  pares:[["Un div dentro de un p","Cambiar el p por un div o sacar el div"],["Un button dentro de un a","Dejar uno de los dos"],["Dos elementos con el mismo id","Usar class o id distintos"],["Un form dentro de otro form","Usar el atributo form en los campos"],["Un li suelto dentro de un div","Meterlo en un ul u ol"]],
  why:"El validador te da la línea exacta; la mayoría de errores son de anidamiento."},
 {t:"codigo", p:"Detecta saltos en la jerarquía de títulos: por cada línea <code>hN texto</code>, si su nivel sube más de uno respecto al anterior, imprime <code>salto: hA → hN (texto)</code>. Si no hay ninguno, imprime <code>ok</code>",
  lenguaje:"js",
  c:`<p>Bajar de nivel (de h4 a h2) siempre es válido. Subir más de uno de golpe (de h2 a h4) no. El primer título solo se compara si hay anterior.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n// cada línea: \"h2 Instalación\"\n",
  pruebas:[
   {entrada:"h1 Guía\nh2 Instalación\nh4 En Windows\nh2 Uso\n", salida:"salto: h2 → h4 (En Windows)"},
   {entrada:"h1 Guía\nh2 Uso\nh3 Detalles\nh2 Fin\n", salida:"ok"},
   {entrada:"h1 Portada\nh3 Novedades\nh2 Blog\nh5 Etiquetas\n", salida:"salto: h1 → h3 (Novedades)\nsalto: h2 → h5 (Etiquetas)", oculta:true}],
  pista:"Guarda el nivel anterior; el nivel es Number(linea[1]) y el texto, linea.slice(3).",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nlet anterior = null, saltos = 0;\nfor (const l of lineas) {\n  const n = Number(l[1]), texto = l.slice(3);\n  if (anterior !== null && n > anterior + 1) { console.log(\"salto: h\" + anterior + \" → h\" + n + \" (\" + texto + \")\"); saltos++; }\n  anterior = n;\n}\nif (!saltos) console.log(\"ok\");",
  why:"Es exactamente la regla que aplican axe (heading-order) y los plugins de lectores de pantalla. Muchos equipos la comprueban en CI."},
 {t:"vf", p:"Como el navegador corrige solo el HTML inválido, validar no aporta nada.",
  ok:false, why:"El DOM corregido puede no coincidir con lo que tu CSS, tu JavaScript y los lectores de pantalla esperan. Y cada error que pasa desapercibido es un fallo raro dentro de seis meses."},
 {t:"opcion", p:"El validador dice <i>Element &lt;li&gt; not allowed as child of element &lt;div&gt;</i>. ¿Qué pasa?",
  ops:["El li necesita una clase","Hay un li fuera de un ul u ol (o un div entre la lista y sus li)","Falta el cierre del div","El div necesita role=\"list\""],
  ok:1, why:"Suele venir de un componente que envuelve cada elemento en un div. Los li tienen que ser hijos directos de la lista."},
 {t:"escribe", p:"Un campo queda fuera del form por la maquetación. ¿Qué atributo le pones para asociarlo a <code>&lt;form id=\"pedido\"&gt;</code>? (con su valor)",
  sol:["form=\"pedido\"","form=pedido","form='pedido'"],
  pista:"El atributo se llama igual que el elemento.",
  why:"El atributo <code>form</code> asocia un campo o botón a cualquier formulario de la página por su id, sin anidarlo."}
]}

]});
