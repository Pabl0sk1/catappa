window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Arquitectura, rendimiento y depuración",
resumen: "Organizar el CSS de un proyecto grande (BEM, utilidades, CSS Modules, @scope, @layer), reset y tokens, rendimiento de render y depuración con DevTools",
nivel: "Experto",
color: "#1d3f92",
lecciones: [

/* =============== U10 L1 =============== */
{
id:"hc6l3",
titulo:"Metodologías: BEM, utilidades y CSS con ámbito",
claves:["BEM (bloque__elemento--modificador) da nombres predecibles con especificidad plana","Utilidades (Tailwind): una clase por declaración, sin inventar nombres; CSS Modules y @scope limitan el alcance","Cada enfoque resuelve el mismo problema: que cambiar un estilo no rompa otra parte de la web"],
pasos:[
 {t:"info", eti:"A escala", h:"El problema y las soluciones",
  c:`<p>En un proyecto grande el CSS es global: cualquier regla puede afectar a cualquier elemento. Sin disciplina, nadie se atreve a borrar nada y cada cambio necesita un selector más fuerte. Hay cuatro familias de soluciones:</p>
<div class="termbox">/* 1. BEM: convención de nombres. bloque__elemento--modificador */
.tarjeta { }
.tarjeta__titulo { }
.tarjeta__boton { }
.tarjeta--destacada { }
.tarjeta--destacada .tarjeta__titulo { }   /* el único anidamiento habitual */

/* 2. utilidades (Tailwind): clases de una responsabilidad en el HTML */
&lt;button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"&gt;

/* 3. CSS Modules: el empaquetador reescribe los nombres para que sean únicos */
/* Tarjeta.module.css */  .titulo { }   →   .Tarjeta_titulo__x7f2a

/* 4. @scope: ámbito nativo, con límite inferior opcional */
@scope (.tarjeta) to (.contenido-usuario) {
  img { border-radius: 8px; }             /* imágenes de la tarjeta, no las del contenido anidado */
}</div>`},
 {t:"info", eti:"Comparar", h:"Ventajas e inconvenientes",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">enfoques de arquitectura</div><table class="dg-tabla"><thead><tr><th>enfoque</th><th>a favor</th><th>en contra</th></tr></thead><tbody>
<tr><td>BEM</td><td>sin herramientas; nombres que explican la estructura</td><td>nombres largos; depende de la disciplina del equipo</td></tr>
<tr><td>Utilidades (Tailwind)</td><td>no inventas nombres; el CSS deja de crecer; todo a la vista en el HTML</td><td>HTML cargado; hay que aprender el vocabulario</td></tr>
<tr><td>CSS Modules</td><td>colisiones imposibles; CSS normal</td><td>necesita empaquetador; los estilos globales requieren :global</td></tr>
<tr><td>CSS-in-JS en tiempo de ejecución</td><td>estilos junto al componente, dinámicos con props</td><td>coste en el navegador y problemas con el renderizado en servidor</td></tr>
<tr><td>@scope nativo</td><td>ámbito sin herramientas ni nombres raros; límite inferior</td><td>reciente: Chromium y Safari desde 2024, Firefox después; comprueba Baseline</td></tr>
</tbody></table></div>
<p>Tailwind v4 se configura en CSS (<code>@theme</code> con variables) y ordena su salida con <code>@layer</code>. Las librerías de CSS-in-JS han ido pasando a generar CSS en la compilación (sin coste en el navegador) por los problemas con el renderizado en servidor.</p>`},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["BEM","Nombres predecibles que evitan choques de estilos"],["@layer","Controlar la prioridad entre grupos de reglas"],["Variables CSS","Cambiar colores o espacios en un solo sitio"],["Stylelint","Detectar errores y malas prácticas en el CSS"],["CSS Modules","Nombres de clase únicos generados al compilar"]],
  why:"Sin convenciones, el CSS crece y nadie se atreve a borrar nada."},
 {t:"opcion", p:"En BEM, ¿cómo se llama la clase del botón de una tarjeta en su variante destacada?",
  ops:[".tarjeta .boton .destacado",".tarjeta__boton--destacado",".tarjeta-boton-destacado",".destacado__tarjeta--boton"],
  ok:1, why:"Bloque (tarjeta), elemento (__boton) y modificador (--destacado). Si el modificador es de todo el bloque, va en el bloque: .tarjeta--destacada."},
 {t:"hueco", p:"Estilos con ámbito nativo: imágenes dentro de la tarjeta, pero sin entrar en el contenido que escribe el usuario",
  tpl:"@___ (.tarjeta) ___ (.contenido-usuario) {\n  img { border-radius: 8px; }\n}", banco:["scope","to","layer","until","container"], sol:["scope","to"],
  why:"El límite inferior (to) crea un «donut»: aplica desde .tarjeta hacia abajo, pero se detiene al llegar a .contenido-usuario."},
 {t:"vf", p:"Con CSS Modules, dos componentes pueden usar la clase <code>.titulo</code> sin pisarse.",
  ok:true, why:"El empaquetador genera nombres únicos (Tarjeta_titulo__x7f2a) y los exporta a JavaScript."},
 {t:"opcion", p:"Un equipo nuevo empieza un proyecto React con varios desarrolladores. ¿Qué criterio es el más importante al elegir entre BEM, Tailwind o CSS Modules?",
  ops:["El que tenga más estrellas en GitHub","Que el equipo lo conozca y lo aplique de forma consistente; cualquiera funciona mal si cada uno hace una cosa","Siempre CSS-in-JS","El que genere el CSS más pequeño"],
  ok:1, why:"Los tres resuelven el problema. La mezcla sin reglas es lo que falla."},
 {t:"escribe", p:"En BEM, ¿qué separador va entre el bloque y el elemento? (escribe los caracteres)",
  sol:["__","dos guiones bajos"], pista:"Dos caracteres iguales, por debajo de la línea.",
  why:"__ para elementos y -- para modificadores: .menu__enlace--activo."}
]},

/* =============== U10 L2 =============== */
{
id:"cs10n1",
titulo:"Arquitectura con @layer, reset y tokens",
claves:["Una estructura de capas: reset, tokens, base, layouts, componentes, utilidades (y terceros abajo)","Un reset moderno corto: box-sizing, márgenes, medios en bloque, fuentes heredadas en formularios","Herramientas: Lightning CSS o PostCSS para compilar y prefijar, Stylelint para vigilar"],
pasos:[
 {t:"info", eti:"Estructura", h:"Un CSS que escala",
  c:`<div class="dg dg-arbol"><div class="dg-tit">estructura de estilos de un proyecto</div>
<div class="rama" style="--n:0"><span class="nom carpeta">estilos/</span></div>
<div class="rama" style="--n:1"><span class="nom">main.css</span><span class="coment">declara las capas e importa lo demás</span></div>
<div class="rama" style="--n:1"><span class="nom">reset.css</span><span class="coment">@layer reset</span></div>
<div class="rama" style="--n:1"><span class="nom">tokens.css</span><span class="coment">variables: colores, espacios, tipografía, z-index</span></div>
<div class="rama" style="--n:1"><span class="nom">base.css</span><span class="coment">@layer base: body, enlaces, títulos, con :where()</span></div>
<div class="rama" style="--n:1"><span class="nom">layouts.css</span><span class="coment">@layer layouts: .pila, .racimo, .lateral, .rejilla</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">componentes/</span><span class="coment">@layer componentes: un fichero por componente</span></div>
<div class="rama" style="--n:1"><span class="nom">utilidades.css</span><span class="coment">@layer utilidades: .oculto, .visualmente-oculto</span></div>
</div>
<div class="termbox">/* main.css */
@layer reset, terceros, base, layouts, componentes, utilidades;
@import url("reset.css") layer(reset);
@import url("vendor/datepicker.css") layer(terceros);
@import url("tokens.css");            /* variables: sin capa, no compiten con nada */
@import url("base.css") layer(base);
/* ...el empaquetador une todo en un solo fichero para producción */</div>`},
 {t:"info", eti:"Reset", h:"Un reset moderno",
  c:`<div class="termbox">@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  body { min-height: 100svh; line-height: 1.5; }
  img, picture, video, canvas, svg { display: block; max-width: 100%; }
  input, button, textarea, select { font: inherit; }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
  :where(ul, ol)[role="list"] { list-style: none; padding: 0; }
}</div>
<p>Los reset antiguos lo borraban <b>todo</b> (incluidos los estilos útiles del navegador). Los modernos son cortos: corrigen lo que casi siempre molesta y dejan el resto. Composiciones de maquetación reutilizables (las de <i>Every Layout</i>: pila, racimo, lateral, conmutador) evitan reescribir el mismo Flexbox en cada componente:</p>
<div class="termbox">.pila &gt; * + * { margin-block-start: var(--espacio, 1rem); }
.racimo { display: flex; flex-wrap: wrap; gap: var(--espacio, 1rem); align-items: center; }</div>`},
 {t:"info", eti:"Herramientas", h:"La cadena de compilación del CSS",
  c:`<div class="dg"><div class="dg-tit">del código fuente al fichero de producción</div>
<div class="dg-flujo"><div class="dg-caja">CSS moderno<small>anidación, @layer, oklch</small></div><div class="dg-caja acento">Lightning CSS / PostCSS<small>une ficheros, añade prefijos, convierte para navegadores antiguos (browserslist)</small></div><div class="dg-caja ok">un .css minificado<small>con hash en el nombre para la caché</small></div></div></div>
<p>Vite usa PostCSS por defecto y puede usar Lightning CSS. <b>Autoprefixer</b> (o Lightning CSS) añade los <code>-webkit-</code> que hagan falta según tu lista de navegadores: no los escribas a mano. <b>Stylelint</b> en el editor y en la integración continua detecta propiedades mal escritas, selectores demasiado específicos o colores fuera de los tokens.</p>
<p>¿Sigue haciendo falta Sass? Variables, anidación y funciones de color ya son nativas. Sass aporta aún mixins, bucles y partir en ficheros sin coste, pero muchos proyectos nuevos ya no lo usan.</p>`},
 {t:"orden", p:"Ordena las capas de una arquitectura típica, de menor a mayor prioridad",
  items:["reset","terceros","base","layouts","componentes","utilidades"],
  why:"Las utilidades al final para que siempre ganen; el reset y las librerías al principio para que nunca ganen a lo tuyo."},
 {t:"par", p:"Empareja cada herramienta con su función",
  pares:[["Lightning CSS","Compilar, prefijar y minificar CSS muy rápido"],["Autoprefixer","Añadir prefijos de navegador según browserslist"],["Stylelint","Revisar el CSS con reglas, como un linter"],["browserslist","Declarar a qué navegadores das soporte"],["Sass","Preprocesador con mixins y bucles"]],
  why:"En un proyecto moderno, el empaquetador (Vite) orquesta todo esto sin configuración apenas."},
 {t:"opcion", p:"¿Por qué el reset usa <code>:where(ul, ol)[role=\"list\"]</code> en lugar de <code>ul[role=\"list\"], ol[role=\"list\"]</code>?",
  ops:["Porque es más corto de escribir, nada más","Porque :where() deja la especificidad en 0-1-0 (solo el atributo) y cualquier clase de un componente lo pisa sin esfuerzo","Porque ul no funciona sin :where","Porque así no se aplica en Safari"],
  ok:1, why:"Los estilos base deben ser fáciles de sobrescribir. :where es la herramienta para bajar la especificidad."},
 {t:"hueco", p:"Importa una librería externa en una capa baja y declara el orden de capas",
  tpl:"@___ reset, terceros, base, componentes;\n@import url(\"lib.css\") layer(___);", banco:["layer","terceros","import","base","scope"], sol:["layer","terceros"],
  why:"Así ninguna regla de la librería, por específica que sea, gana a tus componentes."},
 {t:"vf", p:"Conviene escribir a mano los prefijos <code>-webkit-</code> y <code>-moz-</code> de todas las propiedades nuevas.",
  ok:false, why:"Hoy casi no hacen falta, y los que sí, los añade la herramienta según tu browserslist. Escritos a mano se quedan obsoletos."},
 {t:"opcion", p:"Tu reset lleva <code>* { margin: 0 }</code>. ¿Qué hay que hacer luego con el espaciado entre párrafos?",
  ops:["Nada, el texto irá pegado","Darlo explícitamente en base o en composiciones como .pila (margin-block-start entre hermanos) o con gap","Volver a quitar el reset","Usar br entre párrafos"],
  ok:1, why:"El reset deja el espaciado bajo tu control, en un solo sitio y coherente con tus tokens."}
]},

/* =============== U10 L3 =============== */
{
id:"cs10n2",
titulo:"Rendimiento del CSS",
claves:["El CSS bloquea el renderizado: pequeño, en el head, crítico en línea y lo demás sin bloquear","content-visibility: auto salta el trabajo de lo que está fuera de pantalla; contain aísla","Evita el layout forzado desde JavaScript y los saltos de diseño (CLS); los selectores casi nunca son el problema"],
pasos:[
 {t:"info", eti:"Primera pintura", h:"CSS y el camino crítico",
  c:`<p>El navegador no pinta hasta tener todo el CSS que bloquea el renderizado. Cuanto antes llegue y menos pese, antes ve algo el usuario (FCP y LCP).</p>
<div class="termbox">&lt;!-- CSS crítico de la primera pantalla, en línea: no espera a ninguna descarga --&gt;
&lt;style&gt;/* cabecera, portada, tipografía base */&lt;/style&gt;

&lt;!-- el resto: una hoja cacheable --&gt;
&lt;link rel="stylesheet" href="/css/app.4f2a.css"&gt;

&lt;!-- las hojas con media que no coincide se descargan sin bloquear --&gt;
&lt;link rel="stylesheet" href="/css/print.css" media="print"&gt;</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">qué ralentiza de verdad</div><table class="dg-tabla"><tbody>
<tr><td>@import en cadena</td><td>descargas en serie en vez de en paralelo</td></tr>
<tr><td>CSS sin usar</td><td>frameworks enteros para usar un 10 % (pestaña Coverage de DevTools)</td></tr>
<tr><td>fuentes sin preload ni font-display</td><td>texto invisible o saltos</td></tr>
<tr><td>animar propiedades de layout</td><td>tirones</td></tr>
<tr><td>layout forzado desde JS</td><td>recálculos en bucle</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Páginas largas", h:"content-visibility y contain",
  c:`<div class="termbox">/* no calcula layout ni pinta las secciones fuera de pantalla hasta que se acercan */
.seccion {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;   /* tamaño estimado para que la barra de scroll no baile */
}

/* promete que lo de dentro no afecta a lo de fuera: el navegador limita los recálculos */
.widget { contain: layout paint; }</div>
<p>En páginas con listas enormes, <code>content-visibility: auto</code> puede reducir el tiempo de renderizado inicial a una fracción. Está en todos los navegadores desde 2024.</p>
<div class="termbox">// layout forzado: alternar escritura y lectura obliga a recalcular en cada vuelta
for (const el of tarjetas) {
  el.style.width = contenedor.offsetWidth / 3 + "px";   // leer offsetWidth tras escribir → layout
}
// mejor: leer una vez, escribir después
const ancho = contenedor.offsetWidth / 3;
for (const el of tarjetas) el.style.width = ancho + "px";
// (y aún mejor: que lo haga el CSS con Grid)</div>`},
 {t:"info", eti:"Mitos", h:"¿Importan los selectores?",
  c:`<p>Los navegadores leen los selectores de <b>derecha a izquierda</b>: para <code>.menu li a</code> buscan primero cada <code>a</code> y luego suben comprobando. Por eso se decía que los selectores largos eran lentos. Hoy los motores son tan rápidos que en casi cualquier web la diferencia es de microsegundos: prioriza selectores legibles y con poca especificidad.</p>
<p>Excepciones que sí se notan en DOM muy grandes: <code>:has()</code> amplios en la raíz (<code>body:has(.x)</code> obliga a revisar mucho en cada cambio) y hojas con decenas de miles de reglas.</p>`},
 {t:"opcion", p:"Lighthouse dice que tu CSS de 400 KB bloquea el renderizado y la pestaña Coverage muestra que el 85 % no se usa en la portada. ¿Qué haces primero?",
  ops:["Cargar el CSS con JavaScript al final","Eliminar el CSS que no se usa (purgar el framework, dividir por páginas) y poner en línea el crítico","Minificarlo más","Pasar todo a atributos style"],
  ok:1, why:"Cargarlo tarde provoca un parpadeo sin estilos. Primero se reduce, luego se decide qué es crítico."},
 {t:"hueco", p:"Que las secciones fuera de pantalla no se calculen hasta acercarse, reservando un alto estimado",
  tpl:".seccion { content-visibility: ___; contain-intrinsic-size: ___ 800px; }", banco:["auto","auto","hidden","visible","800px"], sol:["auto","auto"],
  why:"contain-intrinsic-size: auto 800px usa 800px hasta la primera vez que se pinta, y después recuerda el tamaño real."},
 {t:"vf", p:"Una hoja enlazada con <code>media=\"print\"</code> bloquea el primer pintado de la página en pantalla.",
  ok:false, why:"El navegador la descarga con prioridad baja y sin bloquear, porque sabe que no afecta a la pantalla."},
 {t:"opcion", p:"Un script recorre 500 elementos y en cada vuelta lee <code>offsetHeight</code> y cambia un <code>style.height</code>. La página se congela. ¿Qué pasa?",
  ops:["offsetHeight es lento de por sí","Layout forzado (layout thrashing): cada lectura tras una escritura obliga a recalcular el layout, 500 veces","Falta requestAnimationFrame","El CSS tiene demasiados selectores"],
  ok:1, why:"Agrupa las lecturas y luego las escrituras, y mejor aún, resuelve el diseño con CSS."},
 {t:"par", p:"Empareja cada problema de rendimiento con su solución",
  pares:[["CSS gigante que bloquea el pintado","CSS crítico en línea y eliminar lo que no se usa"],["Página larguísima lenta al cargar","content-visibility: auto en las secciones"],["Animación a tirones","Animar transform y opacity"],["Texto que salta al cargar la fuente","size-adjust en la alternativa o font-display: optional"],["Cadena de @import","Unir en el empaquetador o varios link"]],
  why:"Mide antes de optimizar: Lighthouse y la pestaña Performance te dicen cuál de estos es tu problema."},
 {t:"escribe", p:"¿En qué sentido evalúan los navegadores las partes de un selector como <code>.menu li a</code>? (dos palabras: «de … a …»)",
  sol:["de derecha a izquierda","derecha a izquierda","derecha izquierda"], pista:"Empiezan por el selector clave, el último.",
  why:"Empiezan por el elemento candidato (a) y suben comprobando ancestros. Por eso el selector «clave» es el de más a la derecha."}
]},

/* =============== U10 L4 =============== */
{
id:"cs10n3",
titulo:"Depurar CSS con DevTools",
claves:["Styles muestra qué reglas coinciden, cuáles están tachadas (anuladas) y cuáles son inválidas","Computed da el valor final y de qué regla sale; los distintivos grid y flex dibujan la rejilla","Rendering emula modo oscuro, movimiento reducido y deficiencias visuales; Coverage y Performance miden"],
pasos:[
 {t:"info", eti:"El método", h:"«Mi estilo no se aplica»",
  c:`<div class="dg"><div class="dg-tit">diagnóstico en DevTools (clic derecho → Inspeccionar)</div>
<div class="dg-vert">
<div class="dg-caja doble">¿aparece mi regla en Styles?<small>si no aparece, el selector no coincide o la hoja no se carga (pestaña Network)</small></div>
<div class="dg-caja doble">¿está tachada?<small>otra regla gana: pasa el ratón por el selector para ver su especificidad, o mira el nombre de la capa</small></div>
<div class="dg-caja doble">¿tiene un icono de aviso?<small>propiedad o valor inválido, o una propiedad que no hace nada ahí (width en un inline)</small></div>
<div class="dg-caja acento doble">Computed<small>el valor final y la regla exacta de la que sale, con su fichero y línea</small></div>
</div></div>
<p>Chrome incluso te explica las propiedades inactivas: «<code>justify-content</code> no tiene efecto porque el padre no es flex ni grid».</p>`},
 {t:"info", eti:"Herramientas", h:"Lo que hay más allá de Styles",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">rincones de DevTools para CSS</div><table class="dg-tabla"><tbody>
<tr><td>:hov</td><td>fuerza estados: :hover, :focus-visible, :active… sin tener que mantener el ratón</td></tr>
<tr><td>.cls</td><td>activa y desactiva clases del elemento</td></tr>
<tr><td>distintivos grid / flex</td><td>dibujan la rejilla, las líneas numeradas, las áreas y los huecos</td></tr>
<tr><td>diagrama de caja</td><td>margin, border, padding y contenido con sus medidas</td></tr>
<tr><td>Rendering</td><td>emular prefers-color-scheme, prefers-reduced-motion, forced-colors, visión reducida; resaltar repintados y saltos de diseño</td></tr>
<tr><td>Coverage</td><td>qué porcentaje de cada CSS se usa en la página</td></tr>
<tr><td>Changes</td><td>todo lo que has tocado en vivo, para copiarlo a tu código</td></tr>
<tr><td>modo dispositivo</td><td>anchos de pantalla, táctil, densidad de píxeles</td></tr>
</tbody></table></div>
<div class="termbox">/* el truco universal cuando la maqueta hace cosas raras */
* { outline: 1px solid rgb(255 0 0 / 50%); }</div>`},
 {t:"orden", p:"Ordena los pasos para depurar un estilo que no se aplica",
  items:["Inspeccionar el elemento correcto","Comprobar si la regla aparece en Styles","Ver si está tachada y qué la anula","Revisar si tiene aviso de valor inválido o inactivo","Confirmar el valor final en Computed"],
  why:"Seguir siempre el mismo orden evita el reflejo de añadir !important a ciegas."},
 {t:"opcion", p:"Un estilo no se aplica y no sabes por qué. ¿Qué haces primero?",
  ops:["Añadir !important","Inspeccionar el elemento en DevTools y ver qué regla lo anula o si el selector no coincide","Reescribir todo el CSS","Cambiar de navegador"],
  ok:1, why:"DevTools muestra las reglas tachadas y su origen."},
 {t:"par", p:"Empareja cada necesidad con la herramienta de DevTools",
  pares:[["Ver el estilo de :hover sin mover el ratón","El botón :hov (forzar estado)"],["Ver las líneas y áreas de un grid","El distintivo grid del elemento"],["Probar la web en modo oscuro","Rendering → emular prefers-color-scheme"],["Saber cuánto CSS sobra","La pestaña Coverage"],["Recuperar los cambios hechos en vivo","La pestaña Changes"]],
  why:"La mitad de estas herramientas no se ven a primera vista: están en el menú de tres puntos → More tools."},
 {t:"escribe", p:"¿Qué pestaña del panel Elements muestra el valor final de cada propiedad y la regla de la que sale?",
  sol:["Computed","computed","calculado","calculados"], pista:"Su nombre significa «calculado».",
  why:"Especialmente útil con herencia y variables: te dice que el color viene de body y en qué línea."},
 {t:"opcion", p:"En Styles ves <code>z-index: 10</code> con un icono gris que dice que no tiene efecto. ¿Qué te está diciendo?",
  ops:["Que hay un error de sintaxis","Que el elemento es static y no es hijo de flex o grid, así que z-index no se aplica","Que otra regla lo anula","Que el navegador no soporta z-index"],
  ok:1, why:"DevTools detecta propiedades inactivas por el contexto (z-index sin posicionar, width en inline, align-items fuera de flex/grid) y lo explica."},
 {t:"vf", p:"Una regla tachada en el panel Styles significa que hay un error de sintaxis en ella.",
  ok:false, why:"Tachada suele significar anulada por otra regla que gana la cascada. Las declaraciones inválidas también salen tachadas, pero con un icono de aviso al lado: ese icono es lo que las distingue."}
]}

]});
