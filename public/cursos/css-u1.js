window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "CSS desde cero: reglas y selectores",
resumen: "Cómo llega el CSS a la página, la anatomía de una regla y todos los selectores: básicos, combinadores, atributos, pseudoclases, :is, :where, :not, :has y pseudoelementos",
nivel: "Fundamentos",
color: "#6a9af2",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"cs1n1",
titulo:"Cómo se aplica el CSS",
claves:["Tres formas: &lt;link&gt; a una hoja externa (la buena), &lt;style&gt; en la página y el atributo style","El navegador combina el HTML (DOM) y el CSS (CSSOM) en el árbol de render, y luego calcula el diseño y pinta","Una declaración inválida se ignora sola; un selector inválido tira la regla entera"],
pasos:[
 {t:"info", eti:"Punto de partida", h:"Tres sitios donde escribir CSS",
  c:`<p>CSS (<i>Cascading Style Sheets</i>) describe el aspecto de un documento HTML. Lo puedes poner en tres sitios:</p>
<div class="termbox">&lt;!-- 1. hoja externa: la forma normal. Se descarga una vez y se cachea --&gt;
&lt;link rel="stylesheet" href="/css/estilos.css"&gt;

&lt;!-- 2. bloque &lt;style&gt; en el &lt;head&gt;: útil para el CSS crítico de la primera pantalla --&gt;
&lt;style&gt;
  body { margin: 0; font-family: system-ui, sans-serif; }
&lt;/style&gt;

&lt;!-- 3. atributo style: solo para valores dinámicos que pone JavaScript --&gt;
&lt;div class="barra" style="--progreso: 40%"&gt;&lt;/div&gt;</div>
<p>Además existe <code>@import url("otra.css");</code> dentro de un CSS, pero <b>evítalo en producción</b>: el navegador no descubre el segundo fichero hasta que ha descargado y leído el primero, y las descargas van en cadena en lugar de en paralelo. Si quieres dividir el CSS, usa varios <code>&lt;link&gt;</code> o un empaquetador (Vite, esbuild, Lightning CSS).</p>
<div class="nota"><b class="tit">No partes de cero</b>Cada navegador trae su propia hoja de estilos, la del <b>agente de usuario</b>: por eso un <code>&lt;h1&gt;</code> ya sale grande y en negrita, y el <code>&lt;body&gt;</code> trae un margen de 8px. Tu CSS se aplica encima.</div>`},
 {t:"info", eti:"Por dentro", h:"De los ficheros a los píxeles",
  c:`<div class="dg"><div class="dg-tit">el camino del CSS hasta la pantalla</div>
<div class="dg-cols">
  <div class="dg-col"><div class="dg-col-tit">HTML</div><div class="dg-vert"><div class="dg-caja base">index.html</div><div class="dg-caja">DOM<small>árbol de elementos</small></div></div></div>
  <div class="dg-col"><div class="dg-col-tit">CSS</div><div class="dg-vert"><div class="dg-caja base">estilos.css</div><div class="dg-caja">CSSOM<small>árbol de reglas</small></div></div></div>
</div>
<div class="dg-vert" style="margin-top:12px">
  <div class="dg-caja acento doble">estilo<small>para cada elemento, qué valor gana en cada propiedad</small></div>
  <div class="dg-caja acento doble">layout (diseño)<small>tamaño y posición de cada caja</small></div>
  <div class="dg-caja acento doble">paint (pintado)<small>colores, bordes, texto, sombras</small></div>
  <div class="dg-caja ok doble">composite (composición)<small>se juntan las capas y se muestra</small></div>
</div></div>
<p>El CSS <b>bloquea el renderizado</b>: el navegador no pinta nada hasta tener el CSS del <code>&lt;head&gt;</code>, para no enseñarte la página sin estilos y repintarla después. Por eso las hojas van en el <code>&lt;head&gt;</code> y conviene que sean pequeñas.</p>`},
 {t:"info", eti:"Sintaxis", h:"Anatomía de una regla y tolerancia a errores",
  c:`<div class="termbox">/* comentario: así, nunca con // */
selector {
  propiedad: valor;          /* una declaración */
  otra-propiedad: valor;     /* el ; de la última es opcional, pero ponlo */
}

.boton { colr: red; padding: 8px; }   /* colr no existe: se ignora SOLO esa declaración */
.boton { width: -20px; }              /* valor inválido: se ignora esa declaración */
h1, h2:hovr { color: navy; }          /* :hovr no existe: se ignora la REGLA ENTERA, h1 incluido */</div>
<p>El CSS es tolerante: lo que no entiende lo salta y sigue. Eso permite usar una propiedad nueva con una alternativa antes:</p>
<div class="termbox">.caja {
  height: 100vh;    /* navegadores antiguos se quedan con esta */
  height: 100dvh;   /* los modernos la entienden y la usan, porque va después */
}</div>`},
 {t:"par", p:"Empareja cada forma de incluir CSS con cuándo tiene sentido",
  pares:[["&lt;link rel=\"stylesheet\"&gt;","La forma normal: fichero externo cacheable"],["&lt;style&gt; en el head","CSS crítico de la primera pantalla"],["Atributo style","Valores dinámicos que calcula JavaScript"],["@import en un CSS","Casi nunca: encadena descargas"]],
  why:"El atributo style además gana a casi cualquier regla de tus hojas (luego verás por qué), lo que lo hace difícil de sobrescribir."},
 {t:"hueco", p:"Completa la etiqueta que enlaza la hoja de estilos",
  tpl:"<link ___=\"stylesheet\" ___=\"/css/estilos.css\">", banco:["rel","href","src","type","style"], sol:["rel","href"],
  why:"rel dice qué relación tiene el recurso con la página (una hoja de estilos) y href dónde está. src es para scripts e imágenes."},
 {t:"opcion", p:"¿Qué pasará con esta regla? <code>p, .aviso:hoverr { color: red; }</code>",
  ops:["Los párrafos salen rojos y .aviso no","No se aplica a nada: el selector inválido invalida toda la lista","Todo sale rojo","El navegador corrige :hoverr a :hover"],
  ok:1, why:"En una lista de selectores, uno inválido tira la regla completa. Por eso no se mezclan en la misma lista selectores muy nuevos con otros de siempre (o se usa :is(), que sí perdona)."},
 {t:"opcion", p:"<code>.tarjeta { colour: blue; padding: 16px; }</code> ¿Qué ocurre?",
  ops:["Se ignora la regla entera","Se ignora colour (no existe) y el padding sí se aplica","Da un error y se para la carga del CSS","El texto sale azul"],
  ok:1, why:"Una declaración inválida se descarta sola. DevTools la muestra tachada con un icono de aviso: la forma más rápida de encontrar erratas."},
 {t:"orden", p:"Ordena las fases que sigue el navegador para mostrar una página con estilos",
  items:["Construir el DOM y el CSSOM","Calcular el estilo de cada elemento","Layout: tamaño y posición de las cajas","Paint: pintar colores, texto y bordes","Composite: juntar las capas en pantalla"],
  why:"Tenerlo en la cabeza explica el rendimiento: cambiar un color solo repinta; cambiar un ancho obliga a recalcular el layout y todo lo que viene detrás."},
 {t:"vf", p:"Aunque no escribas ningún CSS, un <code>&lt;h1&gt;</code> se ve grande y en negrita porque el navegador aplica su propia hoja de estilos.",
  ok:true, why:"La hoja del agente de usuario. Los «reset» y «normalize» existen para igualar esas diferencias entre navegadores."}
]},

/* =============== U1 L2 =============== */
{
id:"hc3l1",
titulo:"Selectores básicos y combinadores",
claves:["Una regla CSS: selector { propiedad: valor; }","Selectores de tipo, clase (.clase), id (#id), universal (*) y listas separadas por comas","Combinadores: descendiente (espacio), hijo (&gt;), hermano siguiente (+) y hermanos posteriores (~)"],
pasos:[
 {t:"info", eti:"Dar estilo", h:"Los selectores de siempre",
  c:`<div class="termbox">p { color: #333; line-height: 1.6; }        /* tipo: todos los &lt;p&gt; */
.tarjeta { padding: 16px; }                  /* clase */
#principal { max-width: 960px; }             /* id: úsalo poco para estilos */
* { box-sizing: border-box; }                /* universal: todos */
h1, h2, h3 { font-weight: 700; }             /* lista: la misma regla para varios */
button.primario { background: navy; }        /* compuesto: button Y clase primario */
.boton.grande { font-size: 1.25rem; }        /* elementos con las DOS clases */</div>
<div class="nota ojo"><b class="tit">Un espacio lo cambia todo</b><code>.tarjeta.destacada</code> (sin espacio) es un elemento con las dos clases. <code>.tarjeta .destacada</code> (con espacio) es un elemento <code>.destacada</code> <b>dentro</b> de una <code>.tarjeta</code>.</div>`},
 {t:"info", eti:"Relaciones", h:"Combinadores",
  c:`<div class="dg dg-arbol"><div class="dg-tit">el HTML de ejemplo</div>
<div class="rama" style="--n:0"><span class="nom carpeta">article.post</span></div>
<div class="rama" style="--n:1"><span class="nom">h2</span></div>
<div class="rama" style="--n:1"><span class="nom">p (A)</span><span class="coment">justo después del h2</span></div>
<div class="rama" style="--n:1"><span class="nom">p (B)</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">div.nota</span></div>
<div class="rama" style="--n:2"><span class="nom">p (C)</span><span class="coment">nieto del article</span></div>
</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">qué selecciona cada combinador</div><table class="dg-tabla"><thead><tr><th>selector</th><th>nombre</th><th>coincide con</th></tr></thead><tbody>
<tr><td>.post p</td><td>descendiente</td><td>A, B y C (a cualquier profundidad)</td></tr>
<tr><td>.post &gt; p</td><td>hijo directo</td><td>A y B</td></tr>
<tr><td>h2 + p</td><td>hermano siguiente</td><td>solo A</td></tr>
<tr><td>h2 ~ p</td><td>hermanos posteriores</td><td>A y B</td></tr>
</tbody></table></div>
<p>Los combinadores solo miran <b>hacia abajo</b> (descendientes) o <b>hacia delante</b> (hermanos siguientes). Para mirar hacia arriba o hacia atrás existe <code>:has()</code>, que verás en la lección siguiente.</p>`},
 {t:"par", p:"Empareja cada selector con lo que selecciona",
  pares:[["p","Todos los párrafos"],[".tarjeta","Elementos con class=\"tarjeta\""],["#principal","El elemento con id=\"principal\""],["nav a","Enlaces dentro de un nav, a cualquier profundidad"],[".menu &gt; li","li que son hijos directos de .menu"]],
  why:"En la práctica se estiliza casi todo con clases: son reutilizables y tienen una especificidad baja y predecible."},
 {t:"escribe", p:"Escribe el selector que aplica a los elementos con la clase <code>boton</code> cuando el ratón está encima",
  sol:[".boton:hover"], ph:".boton...", pista:"Punto, nombre de la clase y la pseudoclase :hover.", why:".boton:hover { ... }. Recuerda que en móvil no hay hover real: no escondas nada importante detrás de él."},
 {t:"escribe", p:"Escribe el selector del párrafo que va <b>inmediatamente después</b> de un <code>h2</code> (para quitarle el margen superior)",
  sol:["h2 + p","h2+p"], pista:"El combinador de hermano siguiente es el signo más.",
  why:"h2 + p solo coge el primer párrafo tras el título. Con h2 ~ p cogerías todos los párrafos hermanos que vengan después."},
 {t:"opcion", p:"¿Qué pasará? CSS: <code>.menu .activo { color: red; }</code> — HTML: <code>&lt;ul class=\"menu activo\"&gt;…&lt;/ul&gt;</code>",
  ops:["La lista sale roja","No se aplica: busca un .activo DENTRO de .menu, y aquí es el mismo elemento","Se aplica a todos los li","Da error de sintaxis"],
  ok:1, why:"Para el mismo elemento con las dos clases se escribe junto: .menu.activo."},
 {t:"hueco", p:"Completa: los <code>li</code> hijos directos de <code>.menu</code>, y todos los <code>p</code> que siguen a un <code>h2</code> como hermanos",
  tpl:".menu ___ li { display: inline-block; }\nh2 ___ p { color: gray; }", banco:[">","~","+","*"], sol:[">","~"],
  why:"&gt; es hijo directo, ~ es cualquier hermano posterior, + solo el inmediato."},
 {t:"vf", p:"Un mismo elemento puede tener varias clases: <code>class=\"boton primario grande\"</code>.",
  ok:true, why:"Y se combinan en CSS: .boton.primario selecciona los que tienen ambas. Es la base de metodologías como BEM y de las clases utilitarias."},
 {t:"opcion", p:"¿Por qué se desaconseja usar ids (<code>#cabecera</code>) para dar estilo?",
  ops:["Porque no funcionan en todos los navegadores","Porque tienen una especificidad tan alta que luego cuesta sobrescribirlos, y no son reutilizables","Porque son más lentos","Porque están obsoletos"],
  ok:1, why:"Los ids son útiles para enlaces internos (#seccion) y para asociar label y campo, pero para estilos las clases son más flexibles."}
]},

/* =============== U1 L3 =============== */
{
id:"cs1n2",
titulo:"Atributos y pseudoclases",
claves:["Selectores de atributo: [attr], [attr=\"v\"], ^= (empieza), $= (termina), *= (contiene)","Pseudoclases de estado: :hover, :focus-visible, :focus-within, :checked, :disabled, :user-invalid","Pseudoclases de estructura: :first-child, :nth-child(an+b), :nth-of-type, :empty, :root"],
pasos:[
 {t:"info", eti:"Por atributo", h:"Selectores de atributo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">selectores de atributo</div><table class="dg-tabla"><thead><tr><th>selector</th><th>coincide si el atributo…</th><th>ejemplo</th></tr></thead><tbody>
<tr><td>[disabled]</td><td>existe (con cualquier valor)</td><td><code>button[disabled]</code></td></tr>
<tr><td>[type="email"]</td><td>vale exactamente eso</td><td><code>input[type="email"]</code></td></tr>
<tr><td>[href^="https"]</td><td>empieza por</td><td>enlaces seguros</td></tr>
<tr><td>[href$=".pdf"]</td><td>termina en</td><td>enlaces a PDF</td></tr>
<tr><td>[href*="catappa"]</td><td>contiene</td><td>enlaces a tu dominio</td></tr>
<tr><td>[class~="aviso"]</td><td>tiene esa palabra en una lista separada por espacios</td><td>equivale a .aviso</td></tr>
<tr><td>[lang|="es"]</td><td>vale «es» o empieza por «es-»</td><td>es, es-ES, es-MX</td></tr>
<tr><td>[type="a" i]</td><td>compara sin distinguir mayúsculas</td><td>flag i</td></tr>
</tbody></table></div>
<div class="termbox">a[href$=".pdf"]::after { content: " (PDF)"; }
[aria-expanded="true"] .flecha { rotate: 180deg; }   /* estilar según el estado ARIA */
[data-estado="error"] { border-color: crimson; }        /* atributos data-* propios */</div>
<p>Estilar a partir de atributos ARIA o <code>data-*</code> mantiene una sola fuente de verdad: JavaScript cambia el atributo y el CSS reacciona, sin tener además que añadir y quitar clases.</p>`},
 {t:"info", eti:"Estados", h:"Pseudoclases de estado y de estructura",
  c:`<div class="termbox">/* interacción */
a:hover { }            /* ratón encima */
button:active { }      /* mientras se pulsa */
input:focus { }        /* tiene el foco, venga del ratón o del teclado */
a:focus-visible { }    /* foco que el navegador considera que debe verse (teclado) */
.campo:focus-within { }/* el elemento o algo de dentro tiene el foco */
a:visited { }          /* solo deja cambiar colores, por privacidad */
#seccion:target { }    /* el elemento al que apunta la URL (#seccion) */

/* formularios */
input:checked, input:disabled, input:required, input:placeholder-shown { }
input:invalid { }      /* inválido desde el principio, aunque aún no hayas escrito */
input:user-invalid { } /* inválido DESPUÉS de que el usuario interactúe: el bueno para errores */

/* estructura */
li:first-child, li:last-child, li:only-child { }
tr:nth-child(odd) { background: #f6f6f6; }   /* filas alternas (también: 2n+1) */
li:nth-child(3n) { }       /* la 3.ª, 6.ª, 9.ª… */
li:nth-child(-n + 3) { }   /* las tres primeras */
p:nth-of-type(2) { }       /* el segundo &lt;p&gt; entre sus hermanos */
li:nth-child(2 of .destacado) { }   /* el segundo de los que tienen .destacado */
div:empty { display: none; }   /* sin hijos ni texto */
:root { }                  /* el elemento raíz: &lt;html&gt; */</div>
<div class="nota ojo"><b class="tit">Enlaces: el orden importa</b>Si defines varios estados de un enlace, ponlos en orden <b>:link, :visited, :hover, :active</b> (regla «LoVe HAte»): tienen la misma especificidad y gana el último que coincida.</div>`},
 {t:"par", p:"Empareja cada selector con lo que selecciona",
  pares:[["a[href^=\"https\"]","Enlaces cuya dirección empieza por https"],["img[alt=\"\"]","Imágenes con alt vacío (decorativas)"],["li:nth-child(odd)","Elementos de lista en posición impar"],["input:user-invalid","Campos inválidos tras tocarlos el usuario"],["p:empty","Párrafos sin contenido"]],
  why:":user-invalid llegó a todos los navegadores en 2023 y resuelve el problema clásico de :invalid: marcar en rojo un formulario que aún no has empezado a rellenar."},
 {t:"escribe", p:"Escribe el selector de los enlaces (<code>a</code>) cuyo <code>href</code> termina en <code>.pdf</code>",
  sol:["a[href$=\".pdf\"]","a[href$='.pdf']","a[href$=.pdf]"], pista:"Atributo entre corchetes con el operador de «termina en»: $=",
  why:"Ideal para añadir un icono o el texto «(PDF)» y avisar de que el enlace descarga un fichero."},
 {t:"opcion", p:"Una lista tiene 10 <code>li</code>. ¿Cuáles selecciona <code>li:nth-child(3n + 1)</code>?",
  ops:["El 3, 6 y 9","El 1, 4, 7 y 10","El 1, 3 y 9","Solo el 4"],
  ok:1, why:"n toma los valores 0, 1, 2, 3…: 3·0+1 = 1, 3·1+1 = 4, 7, 10. Para probar fórmulas, sustituye n desde 0."},
 {t:"opcion", p:"¿Qué pasará? HTML: <code>&lt;div&gt;&lt;h2&gt;…&lt;/h2&gt;&lt;p&gt;A&lt;/p&gt;&lt;p&gt;B&lt;/p&gt;&lt;/div&gt;</code> — CSS: <code>p:first-child { color: red }</code>",
  ops:["A sale roja","Ningún párrafo sale rojo: el primer hijo del div es el h2","A y B salen rojas","B sale roja"],
  ok:1, why:":first-child exige ser el primer hijo de su padre, sea del tipo que sea. Aquí querías p:first-of-type, que sí coge A."},
 {t:"hueco", p:"Resalta la tarjeta cuando cualquiera de sus campos tiene el foco, y dibuja el anillo solo con foco de teclado en los botones",
  tpl:".tarjeta:___ { border-color: royalblue; }\nbutton:___ { outline: 3px solid royalblue; }", banco:["focus-within","focus-visible","hover","active","target"], sol:["focus-within","focus-visible"],
  why:":focus-within sube el estado de foco al contenedor. :focus-visible evita el anillo al hacer clic con el ratón, pero lo muestra con teclado, que es quien lo necesita."},
 {t:"orden", p:"Ordena las reglas de estado de un enlace para que todas funcionen",
  items:["a:link","a:visited","a:hover","a:active"],
  why:"Misma especificidad: gana la última que coincide. Si :hover fuera antes que :visited, los enlaces visitados no cambiarían al pasar el ratón."},
 {t:"vf", p:"<code>input:invalid</code> es la mejor forma de pintar errores, porque solo se activa cuando el usuario ya ha escrito algo mal.",
  ok:false, why:"Al revés: :invalid se aplica desde que se carga la página (un campo required vacío ya es inválido). Para eso está :user-invalid."}
]},

/* =============== U1 L4 =============== */
{
id:"cs1n3",
titulo:"Selectores lógicos y pseudoelementos",
claves:[":is() y :where() agrupan selectores; :where() tiene especificidad cero",":not() excluye y :has() selecciona según lo que un elemento contiene o tiene detrás","Pseudoelementos (::before, ::after, ::marker, ::placeholder…) estilan partes que no son elementos"],
pasos:[
 {t:"info", eti:"Lógica", h:":is(), :where(), :not() y :has()",
  c:`<div class="termbox">/* :is() agrupa y acorta. Es «perdonador»: un selector inválido dentro no rompe la regla */
:is(h1, h2, h3):hover { color: teal; }
article :is(h2, h3) a { text-decoration: none; }

/* :where() hace lo mismo, pero con especificidad CERO: perfecto para estilos base fáciles de pisar */
:where(ul, ol)[role="list"] { list-style: none; padding: 0; }

/* :not() excluye; admite listas */
.menu li:not(:last-child) { border-bottom: 1px solid #ddd; }
button:not(.primario, .peligro) { background: white; }

/* :has() mira dentro (o detrás): el «selector de padre» que CSS no tuvo durante 25 años */
.tarjeta:has(img) { padding-top: 0; }               /* tarjetas que contienen una imagen */
.campo:has(input:user-invalid) label { color: crimson; }
h2:has(+ p) { margin-bottom: 4px; }                  /* h2 seguido de un párrafo */
body:has(dialog[open]) { overflow: hidden; }         /* bloquear el scroll con un modal abierto */</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">especificidad que aportan</div><table class="dg-tabla"><thead><tr><th>pseudoclase</th><th>especificidad</th></tr></thead><tbody>
<tr><td>:is(a, .b, #c)</td><td>la de su argumento más específico (aquí, la del id)</td></tr>
<tr><td>:not(...) y :has(...)</td><td>igual que :is(): la del argumento más específico</td></tr>
<tr><td>:where(...)</td><td>siempre 0</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Partes", h:"Pseudoelementos",
  c:`<p>Una <b>pseudoclase</b> (un <code>:</code>) selecciona un elemento en cierto estado. Un <b>pseudoelemento</b> (dos <code>::</code>) selecciona una <b>parte</b> que no existe como elemento en el HTML.</p>
<div class="termbox">.obligatorio::after { content: " *"; color: crimson; }   /* sin content no aparece */
.cita::before { content: "“"; }
.icono::before { content: ""; display: inline-block; width: 1em; height: 1em; background: currentColor; }
p::first-line { font-weight: 600; }
p::first-letter { font-size: 3em; float: left; }   /* letra capital */
li::marker { color: royalblue; }                   /* la viñeta o el número */
input::placeholder { color: #888; }
::selection { background: gold; }                  /* el texto seleccionado */
dialog::backdrop { background: rgb(0 0 0 / 50%); } /* el fondo tras un modal */
input[type="file"]::file-selector-button { border-radius: 6px; }</div>
<div class="dg"><div class="dg-tit">dónde viven ::before y ::after</div>
<div class="dg-caja base" style="text-align:left">&lt;p class="obligatorio"&gt;
<div class="dg-flujo" style="margin-top:6px"><div class="dg-caja acento">::before</div><div class="dg-caja">contenido real del p</div><div class="dg-caja acento">::after</div></div>&lt;/p&gt;</div>
<div class="dg-nota arriba">son hijos generados, dentro del elemento: no funcionan en img ni input, que no tienen contenido</div></div>
<div class="nota ojo"><b class="tit">Accesibilidad</b>El texto de <code>content</code> puede leerlo el lector de pantalla o no, según el navegador. Úsalo para decoración, nunca para información importante.</div>`},
 {t:"opcion", p:"¿Qué pasará? <code>.nuevo::before { color: red; font-weight: bold; }</code>",
  ops:["Aparece un punto rojo antes del elemento","No aparece nada: sin la propiedad content el pseudoelemento no se genera","El texto del elemento sale rojo","Aparece la palabra «before»"],
  ok:1, why:"::before y ::after necesitan content, aunque sea vacío (content: \"\") para dibujar formas con tamaño y fondo."},
 {t:"escribe", p:"Escribe el selector de las <code>.tarjeta</code> que contienen un <code>img</code>",
  sol:[".tarjeta:has(img)"], pista:"La pseudoclase relacional que mira dentro del elemento.",
  why:":has() funciona en todos los navegadores modernos desde finales de 2023. Antes esto requería JavaScript o una clase puesta a mano."},
 {t:"hueco", p:"Estilos base con especificidad cero para las listas de navegación, y separadores en todos los elementos menos el último",
  tpl:":___(nav ul) { list-style: none; }\n.menu li:___(:last-child) { border-bottom: 1px solid #ddd; }", banco:["where","not","is","has","nth-child"], sol:["where","not"],
  why:":where() aporta especificidad 0, así que cualquier clase la pisa sin pelear. :not(:last-child) es el patrón clásico de separadores."},
 {t:"par", p:"Empareja cada selector con su uso",
  pares:[["li::marker","Cambiar el color de la viñeta"],["::selection","Estilo del texto seleccionado con el ratón"],["dialog::backdrop","Oscurecer la página detrás de un modal"],["input::placeholder","El texto de ejemplo de un campo"],["p::first-letter","Hacer una letra capital"]],
  why:"Los pseudoelementos permiten estilar partes que no podrías tocar de otra forma sin añadir HTML."},
 {t:"vf", p:"<code>:is(.a, #b) p</code> y <code>:where(.a, #b) p</code> seleccionan exactamente los mismos elementos.",
  ok:true, why:"Seleccionan lo mismo; lo único que cambia es la especificidad: :is() cuenta como un id (su argumento más fuerte) y :where() cuenta 0."},
 {t:"opcion", p:"Quieres poner en rojo la etiqueta de un campo cuando el input de dentro es inválido tras tocarlo. ¿Qué selector usas?",
  ops:["label + input:invalid","input:user-invalid label",".campo:has(input:user-invalid) label","label:invalid"],
  ok:2, why:"Los combinadores no pueden ir hacia atrás ni hacia arriba; :has() sí: selecciona el .campo que contiene el input inválido, y desde ahí bajas a su label."},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>:hover</code> y <code>::before</code>?",
  ops:["Ninguna, son dos sintaxis de lo mismo","La primera es una pseudoclase (un estado del elemento) y la segunda un pseudoelemento (una parte generada)","::before es la versión moderna de :hover","Una es de CSS2 y la otra no existe"],
  ok:1, why:"Por compatibilidad, los navegadores aceptan :before con un solo signo, pero la forma correcta hoy es ::before."}
]}

]});
