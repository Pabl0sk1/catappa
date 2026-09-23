window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Maestría: retos, producción y entrevista",
resumen: "Retos de maquetación resueltos con criterio, los errores de CSS que llegan a producción, decisiones de arquitectura de un sénior y simulacro final de entrevista de CSS",
nivel: "Maestro",
color: "#1a3784",
lecciones: [

/* =============== U11 L1 =============== */
{
id:"hc7l1",
titulo:"Retos de maquetación",
claves:["Elegir Flexbox o Grid según el problema, y lo intrínseco antes que las media queries","Centrar, repartir, pegar el pie abajo, rejillas adaptables, texto sobre imagen, recortes","Pensar primero en el HTML semántico y en los casos límite: textos largos, vacíos, traducciones"],
pasos:[
 {t:"info", eti:"Recetario", h:"Los retos de siempre, resueltos en moderno",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">reto → solución de una o dos líneas</div><table class="dg-tabla"><thead><tr><th>reto</th><th>solución</th></tr></thead><tbody>
<tr><td>centrar cualquier cosa</td><td><code>display: grid; place-items: center;</code></td></tr>
<tr><td>pie siempre abajo</td><td><code>body { display: grid; grid-template-rows: auto 1fr auto; min-height: 100svh; }</code></td></tr>
<tr><td>rejilla adaptable</td><td><code>repeat(auto-fill, minmax(min(15rem, 100%), 1fr))</code></td></tr>
<tr><td>lateral que baja en móvil sin media query</td><td>flex-wrap con <code>flex: 1 1 15rem</code> en el lateral y <code>flex: 999 1 30rem</code> en el contenido</td></tr>
<tr><td>texto sobre imagen</td><td>grid con ambos en <code>grid-area: 1 / 1</code></td></tr>
<tr><td>proporción fija</td><td><code>aspect-ratio: 16 / 9</code> y <code>object-fit: cover</code></td></tr>
<tr><td>texto recortado</td><td>ellipsis (una línea) o line-clamp (varias)</td></tr>
<tr><td>cabecera fija y contenido con scroll</td><td><code>position: sticky; top: 0</code> sin overflow en los ancestros</td></tr>
<tr><td>contenido centrado con elementos a sangre</td><td>grid con líneas <code>completo-start</code> / <code>contenido-start</code></td></tr>
</tbody></table></div>
<p>En una prueba técnica no solo cuenta que se vea bien en tu pantalla: prueba con un texto el triple de largo, con la lista vacía, a 320px y con zoom al 200 %. Ahí se ve quién maqueta con criterio.</p>`},
 {t:"opcion", p:"¿Cómo haces que el pie de página quede abajo aunque el contenido sea corto?",
  ops:["position: absolute en el pie","body como flex en columna con min-height: 100svh y main con flex: 1","margin-top: 900px","Una tabla"],
  ok:1, why:"El «sticky footer» moderno sin trucos. Con Grid: grid-template-rows: auto 1fr auto."},
 {t:"opcion", p:"Quieres una galería que muestre tantas columnas de al menos 200px como quepan. ¿Qué usas?",
  ops:["Flexbox con anchos fijos","grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))","Una media query por cada ancho posible","float: left"],
  ok:1, why:"Rejilla adaptable sin media queries. Añade min(200px, 100%) para no desbordar en contenedores muy estrechos."},
 {t:"par", p:"Empareja cada problema con la solución",
  pares:[["Barra con logo a la izquierda y botones a la derecha","Flexbox con justify-content: space-between"],["Esqueleto con cabecera, lateral, contenido y pie","Grid con grid-template-areas"],["Texto largo que desborda su caja","overflow-wrap: anywhere o text-overflow: ellipsis"],["Imagen que se deforma","object-fit: cover"],["Mantener un vídeo en 16:9","aspect-ratio: 16 / 9"]],
  why:"Resolver estos casos rápido es lo que se espera en una prueba de maquetación."},
 {t:"hueco", p:"El esqueleto de página con el pie siempre abajo, usando Grid",
  tpl:"body {\n  display: grid;\n  grid-template-rows: auto ___ auto;\n  min-height: ___;\n}", banco:["1fr","100svh","100%","auto","100vw"], sol:["1fr","100svh"],
  why:"La fila del medio (main) se lleva todo el espacio libre. 100svh evita que en móvil el pie quede escondido tras la barra del navegador."},
 {t:"escribe", p:"Escribe las dos declaraciones más cortas para centrar un hijo en su contenedor (en el contenedor)",
  sol:["display: grid; place-items: center","display:grid;place-items:center","display: grid; place-items: center;","display:grid; place-items:center"], pista:"Grid y la abreviatura de alineación de los hijos.",
  why:"También vale display: flex con justify-content y align-items en center, pero son tres líneas."},
 {t:"opcion", p:"¿Qué pasará? Un lateral con <code>flex: 1 1 15rem</code> y el contenido con <code>flex: 999 1 30rem</code>, en un contenedor <code>flex-wrap: wrap</code> de 40rem",
  ops:["Quedan uno al lado del otro: 15 + 30 = 45rem, y el contenido encoge","No caben (45rem &gt; 40rem): el contenido baja a otra línea y cada uno ocupa el ancho completo","El lateral desaparece","El contenido crece 999 veces"],
  ok:1, why:"Con wrap, si la suma de las bases no cabe, bajan. Cuando sí caben, el 999 hace que el contenido se lleve casi todo el sobrante. Es el patrón «lateral» de Every Layout, sin media queries."},
 {t:"orden", p:"Ordena cómo abordarías una prueba de maquetación de una tarjeta de producto",
  items:["Escribir el HTML semántico (article, h3, img con alt, button)","Estilos base: tipografía, colores y espacios con variables","Colocación interna con Grid o Flexbox","Estados: hover, focus-visible, disabled","Casos límite: texto largo, sin imagen, 320px, zoom 200 %"],
  why:"Los casos límite al final, pero siempre: son lo que distingue un componente de producción de una maqueta bonita."}
]},

/* =============== U11 L2 =============== */
{
id:"cs11n1",
titulo:"Errores de CSS en producción",
claves:["Los mismos diez errores explican la mayoría de los fallos de maquetación que llegan a producción","Síntoma → causa → arreglo: sticky y overflow, z-index y contextos, min-width: 0, 100vh, zoom en iOS","Arreglar la causa, no tapar el síntoma con overflow: hidden o !important"],
pasos:[
 {t:"info", eti:"Catálogo", h:"Síntoma, causa y arreglo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">los errores que más se repiten</div><table class="dg-tabla"><thead><tr><th>síntoma</th><th>causa habitual</th><th>arreglo</th></tr></thead><tbody>
<tr><td>scroll horizontal en móvil</td><td>ancho fijo, 100vw, imagen sin max-width, URL larga</td><td>encontrar el elemento; max-width, overflow-wrap</td></tr>
<tr><td>sticky no se pega</td><td>ancestro con overflow, falta top, padre sin recorrido</td><td>overflow: clip o quitarlo; top: 0</td></tr>
<tr><td>z-index «no funciona»</td><td>elemento static o atrapado en un contexto de apilamiento</td><td>posicionar; isolation; popover/dialog</td></tr>
<tr><td>modal fixed que se mueve con la página</td><td>ancestro con transform o filter</td><td>sacarlo al body o usar dialog</td></tr>
<tr><td>columna flex o grid que desborda</td><td>min-width: auto</td><td>min-width: 0 o minmax(0, 1fr)</td></tr>
<tr><td>portada cortada en móvil</td><td>100vh con las barras del navegador</td><td>100svh (o dvh)</td></tr>
<tr><td>iOS hace zoom al tocar un campo</td><td>input con font-size menor de 16px</td><td>font-size: max(16px, 1rem) en los campos</td></tr>
<tr><td>inputs blancos en el tema oscuro</td><td>falta color-scheme</td><td>color-scheme: light dark</td></tr>
<tr><td>la página salta al cargar</td><td>imágenes sin dimensiones, fuentes, banners insertados</td><td>width/height, aspect-ratio, size-adjust, reservar hueco</td></tr>
<tr><td>la librería pisa tus estilos</td><td>selectores más específicos que los tuyos</td><td>importarla en una @layer baja</td></tr>
</tbody></table></div>`},
 {t:"opcion", p:"Soporte: «En el iPhone, al tocar el buscador, la página se amplía sola y hay que pellizcar para volver». ¿Qué pasa?",
  ops:["Un bug de iOS sin solución","El input tiene font-size menor de 16px y Safari en iOS amplía la vista para que se lea; ponle al menos 16px","Falta user-scalable=no en el viewport","El buscador tiene position: fixed"],
  ok:1, why:"Desactivar el zoom con user-scalable=no lo «arregla» a costa de impedir hacer zoom a quien lo necesita: es un fallo de accesibilidad."},
 {t:"opcion", p:"Tras añadir una animación de entrada con <code>transform</code> al <code>main</code>, el aviso de cookies (<code>position: fixed; bottom: 0</code>) ya no está abajo de la ventana: está al final del main. ¿Por qué?",
  ops:["El aviso tiene un z-index bajo","Un transform en un ancestro convierte a ese ancestro en el bloque contenedor de los fixed","La animación está mal escrita","bottom: 0 no funciona con fixed"],
  ok:1, why:"Mueve el aviso fuera del main, o anima un envoltorio que no contenga elementos fixed."},
 {t:"opcion", p:"Una tabla de datos dentro de un grid <code>1fr 300px</code> ensancha la primera columna y la página se sale de la pantalla. ¿Arreglo correcto?",
  ops:["overflow: hidden en el body","grid-template-columns: minmax(0, 1fr) 300px y overflow-x: auto en el envoltorio de la tabla","Reducir el font-size de la tabla","Poner la tabla en position: absolute"],
  ok:1, why:"1fr no encoge por debajo de su contenido mínimo; minmax(0, 1fr) sí, y el scroll queda dentro de la tabla."},
 {t:"par", p:"Empareja cada síntoma con su causa más probable",
  pares:[["Sticky no se pega","Un ancestro con overflow"],["Tooltip tapado pese a z-index: 9999","Un ancestro con opacity o transform crea un contexto"],["La portada queda cortada bajo la barra del móvil","100vh"],["Ellipsis que no funciona en un hijo flex","min-width: auto"],["Inputs claros en modo oscuro","Falta color-scheme"]],
  why:"Con este catálogo en la cabeza, la mayoría de los fallos de CSS se diagnostican en minutos."},
 {t:"vf", p:"Poner <code>overflow-x: hidden</code> en el <code>body</code> es una buena solución para el scroll horizontal en móvil.",
  ok:false, why:"Esconde el síntoma, recorta contenido y rompe position: sticky. Hay que encontrar el elemento que se sale."},
 {t:"escribe", p:"Escribe una declaración para que los campos de formulario tengan al menos 16px y no provoquen zoom en iOS, sin dejar de escalar con el usuario",
  sol:["font-size: max(16px, 1rem)","font-size:max(16px,1rem)","font-size: max(1rem, 16px)","font-size:max(1rem,16px)"], pista:"El mayor entre 16px y 1rem.",
  why:"Si el usuario sube su tamaño de letra, 1rem crece; si no, nunca baja de 16px."},
 {t:"opcion", p:"Tras integrar un widget de chat, tus botones han cambiado de color porque su CSS tiene <code>.chat-root button, button { … }</code>. ¿Solución duradera?",
  ops:["Añadir !important a tus botones","Cargar el CSS del widget dentro de una capa baja (@import … layer(terceros)) para que nunca gane a tus capas","Subir la especificidad de tus botones con ids","Pedir al proveedor que cambie su CSS"],
  ok:1, why:"Con capas, la especificidad del CSS ajeno deja de importar. (Si el widget usa Shadow DOM, sus estilos ni siquiera salen de él.)"}
]},

/* =============== U11 L3 =============== */
{
id:"cs11n2",
titulo:"Decisiones de arquitectura",
claves:["Política de soporte basada en Baseline: usar lo «ampliamente disponible» y mejorar con lo «recién disponible»","Migrar un CSS heredado metiéndolo en una capa baja, no reescribiéndolo de golpe","Temas multimarca con tokens en capas y componentes que solo consumen tokens semánticos"],
pasos:[
 {t:"info", eti:"Caso 1", h:"¿Qué CSS puedo usar?",
  c:`<p><b>Baseline</b> es la etiqueta común de los navegadores para saber qué funciona en todos: una característica es <b>recién disponible</b> cuando llega a la última versión de Chrome, Edge, Firefox y Safari, y <b>ampliamente disponible</b> 30 meses después. Aparece en MDN, caniuse y los propios editores.</p>
<div class="dg"><div class="dg-tit">política de soporte razonable para una web pública</div>
<div class="dg-vert">
<div class="dg-caja ok doble">ampliamente disponible<small>úsalo sin más: grid, :is, clamp, aspect-ratio, gap, @layer, :has, anidación</small></div>
<div class="dg-caja acento doble">recién disponible<small>úsalo como mejora progresiva, con alternativa o @supports</small></div>
<div class="dg-caja aviso doble">en uno o dos navegadores<small>solo si su ausencia no rompe nada: view transitions entre páginas, scroll-driven animations</small></div>
</div></div>
<p>La pregunta clave no es «¿lo soporta todo el mundo?», sino «¿qué ve quien no lo soporta?». Si ve algo correcto aunque menos bonito, adelante.</p>`},
 {t:"info", eti:"Caso 2", h:"Migrar 40 000 líneas de CSS heredado",
  c:`<p>Situación: una aplicación con años de CSS global, selectores con ids, cientos de <code>!important</code> y nadie se atreve a tocar nada. Reescribirlo todo de golpe es el camino más seguro para no terminar nunca.</p>
<div class="termbox">/* 1. todo lo viejo, sin cambiar una línea, a una capa baja */
@layer legado, base, componentes, utilidades;
@import url("legacy/todo.css") layer(legado);

/* 2. lo nuevo, en sus capas: gana SIEMPRE al legado, sin pelear con su especificidad */
@layer componentes { .boton { … } }

/* 3. se migra pantalla a pantalla; Coverage indica qué partes del legado ya no se usan */</div>
<div class="nota ojo"><b class="tit">Cuidado con los !important heredados</b>En las capas, <code>!important</code> se invierte: un <code>!important</code> de la capa <code>legado</code> gana a todo lo nuevo. Hay que localizarlos (Stylelint lo cuenta) e ir quitándolos durante la migración.</div>`},
 {t:"info", eti:"Caso 3", h:"Un sistema de diseño para tres marcas",
  c:`<div class="termbox">/* tokens de marca: solo cambia esto */
[data-marca="a"] { --marca-600: oklch(55% .2 262); --radio-base: 12px; --fuente-titulos: "Inter"; }
[data-marca="b"] { --marca-600: oklch(58% .18 25);  --radio-base: 2px;  --fuente-titulos: "Fraunces"; }

/* tokens semánticos: derivados, iguales para todas */
:root {
  --acento: var(--marca-600);
  --acento-hover: oklch(from var(--acento) calc(l - .08) c h);
  --acento-suave: color-mix(in oklch, var(--acento) 12%, var(--fondo));
}
/* componentes: solo semánticos, nunca primitivos */
.boton { background: var(--acento); border-radius: var(--radio-base); }</div>
<p>Con container queries para que los componentes se adapten a cualquier columna, y variantes con variables, la librería se reutiliza en todas las marcas sin duplicar un solo componente.</p>`},
 {t:"orden", p:"Ordena una migración progresiva de un CSS heredado",
  items:["Declarar el orden de capas con legado la primera","Importar todo el CSS viejo dentro de la capa legado","Escribir lo nuevo en capas superiores","Migrar pantalla a pantalla quitando los !important del legado","Borrar lo que Coverage marca como no usado"],
  why:"Así la aplicación funciona en todo momento y cada paso se puede desplegar por separado."},
 {t:"opcion", p:"Quieres usar <code>@scope</code> en una web pública y Baseline lo marca como recién disponible. ¿Qué decides?",
  ops:["No usarlo hasta dentro de cinco años","Usarlo solo donde, si no se aplica, el componente siga viéndose aceptable, o tener una alternativa con clases","Usarlo en todo sin más","Añadir un polyfill de JavaScript enorme"],
  ok:1, why:"Mejora progresiva: el criterio es qué ve quien no lo soporta, no un sí o no absoluto."},
 {t:"vf", p:"Al migrar, basta con meter el CSS heredado en una <code>@layer</code> baja para que nada de él pueda ganar al CSS nuevo.",
  ok:false, why:"Sus declaraciones !important sí ganan, porque en las capas la importancia se invierte. Hay que tratarlas aparte."},
 {t:"par", p:"Empareja cada decisión con su justificación",
  pares:[["Componentes que solo usan tokens semánticos","Cambiar de tema o de marca sin tocar componentes"],["CSS heredado en una capa baja","Lo nuevo gana sin guerras de especificidad"],["Container queries en la librería","Componentes que funcionan en cualquier columna"],["Política de soporte con Baseline","Criterio común para decidir qué CSS usar"],["Stylelint en la integración continua","Que las normas se cumplan sin depender de la memoria"]],
  why:"Un sénior no se distingue por saber más propiedades, sino por estas decisiones."},
 {t:"opcion", p:"Tu jefa pregunta si merece la pena pasar el proyecto de Sass a CSS nativo. ¿Qué respuesta es la más sensata?",
  ops:["Sí, Sass está obsoleto","Depende de qué uses de Sass: variables, anidación y funciones de color ya son nativas; si apenas usas mixins y bucles, quitarlo simplifica la compilación. Se puede hacer poco a poco","No, el CSS nativo no tiene variables","Solo si se cambia también de framework"],
  ok:1, why:"Las decisiones de arquitectura se justifican con lo que se gana y lo que cuesta, no con modas."}
]},

/* =============== U11 L4 =============== */
{
id:"hc7l2",
titulo:"Simulacro de entrevista de CSS",
claves:["Sabes explicar la cascada, la especificidad, la herencia y el modelo de caja","Dominas Flexbox, Grid, el diseño responsive y las container queries","Piensas en accesibilidad, rendimiento y mantenimiento del CSS"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir, como en una entrevista real: la opción correcta es solo el esqueleto de tu respuesta. Añade siempre un ejemplo o un caso que hayas vivido.</p>`},
 {t:"opcion", p:"«Explica cómo decide el navegador qué regla gana»",
  ops:["Gana la última que aparece en el fichero, siempre","La cascada: origen e importancia, estilos en línea, capas (@layer), especificidad y, a igualdad, el orden de aparición","Gana la más específica y punto","Gana la del fichero que se cargó antes"],
  ok:1, why:"Menciona que la especificidad se compara por columnas (ids, clases, tipos) y que conviene mantenerla baja y plana."},
 {t:"opcion", p:"«¿Qué hace box-sizing: border-box y por qué se usa en todas partes?»",
  ops:["Pone un borde a todas las cajas","Hace que width y height incluyan padding y borde, así las medidas son predecibles al añadir relleno","Elimina los márgenes","Solo afecta a las imágenes"],
  ok:1, why:"Con content-box, un 100% más padding desborda el contenedor."},
 {t:"opcion", p:"«¿Qué es el colapso de márgenes?»",
  ops:["Un bug de navegadores antiguos","Que los márgenes verticales contiguos en el flujo de bloques se fusionan en el mayor, incluidos los de padre e hijo sin borde ni padding entre ellos","Que los márgenes negativos no funcionan","Que los márgenes desaparecen en móvil"],
  ok:1, why:"Añade que no ocurre en flex ni grid, y que display: flow-root lo corta en un padre."},
 {t:"opcion", p:"«¿Flexbox o Grid?»",
  ops:["Siempre Grid","Flexbox para alinear en una dimensión (barras, componentes); Grid para dos dimensiones (esqueletos de página, rejillas). Se combinan","Siempre Flexbox","Ninguno, float"],
  ok:1, why:"La respuesta de alguien que maqueta a diario. Un ejemplo: Grid para la rejilla del catálogo, Flexbox dentro de cada tarjeta."},
 {t:"opcion", p:"«¿Qué significa flex: 1?»",
  ops:["Que el elemento mide 1px","flex-grow 1, flex-shrink 1 y flex-basis 0%: parte de cero y se reparte el espacio en partes iguales con sus hermanos","Que el elemento es el primero","display: flex en el hijo"],
  ok:1, why:"Si te preguntan por qué un hijo flex: 1 no encoge, la respuesta es min-width: auto."},
 {t:"opcion", p:"«Tu z-index de 9999 no pone el menú encima. ¿Por qué puede ser?»",
  ops:["Porque el máximo es 999","Porque el menú está dentro de un contexto de apilamiento (un ancestro con z-index, opacity, transform…) que queda por debajo de otro, o porque no está posicionado","Porque hay que usar !important","Porque z-index solo funciona en Chrome"],
  ok:1, why:"Menciona isolation: isolate, las escalas de z-index con variables y la capa superior de dialog y popover."},
 {t:"opcion", p:"«¿Media queries o container queries?»",
  ops:["Son lo mismo","Media queries para la maqueta global según la ventana y las preferencias del usuario; container queries para componentes que se adaptan al hueco donde se colocan","Container queries han sustituido a las media queries","Media queries solo para imprimir"],
  ok:1, why:"Ejemplo: la misma tarjeta en la columna principal y en el lateral de la misma página."},
 {t:"opcion", p:"«¿Qué propiedades animarías para que una animación vaya fluida?»",
  ops:["width y height","transform y opacity, que solo requieren composición; evitar las que provocan layout (width, top, margin) y respetar prefers-reduced-motion","Todas con transition: all","Solo color"],
  ok:1, why:"Si puedes, menciona la pestaña Performance de DevTools para comprobarlo."},
 {t:"opcion", p:"«¿Para qué sirve :has()?»",
  ops:["Para comprobar si existe una clase en el CSS","Para seleccionar un elemento según lo que contiene o lo que le sigue: el «selector de padre» (por ejemplo, un campo cuyo input es inválido)","Para detectar el navegador","Es un alias de :is()"],
  ok:1, why:"Ejemplos buenos: .tarjeta:has(img), form:has(:user-invalid), body:has(dialog[open])."},
 {t:"opcion", p:"«¿Cómo organizarías el CSS de una aplicación grande?»",
  ops:["Un solo fichero enorme","Tokens en variables, capas con @layer (reset, base, componentes, utilidades), una metodología de nombres o ámbito (BEM, CSS Modules, utilidades), especificidad baja y Stylelint","Todo con !important","Con estilos en línea"],
  ok:1, why:"Cuenta qué problema resuelve cada pieza: colisiones de nombres, guerras de especificidad y coherencia visual."},
 {t:"opcion", p:"«¿Qué harías si tu página tiene un CLS alto?»",
  ops:["Nada","Reservar el espacio de imágenes y anuncios (width, height, aspect-ratio), cargar las fuentes sin saltos y no insertar contenido encima del existente","Quitar el CSS","Usar más JavaScript"],
  ok:1, why:"CLS mide cuánto se mueve el contenido mientras se usa la página. DevTools → Rendering → Layout shift regions te enseña qué se mueve."},
 {t:"opcion", p:"«¿Qué haces en CSS para que una web sea accesible?»",
  ops:["Nada, la accesibilidad es cosa del HTML","Foco visible con :focus-visible, contraste suficiente, unidades relativas que respeten el tamaño de letra, prefers-reduced-motion, no ocultar con opacity y soportar forced-colors","Letra muy grande en todo","Quitar los outline"],
  ok:1, why:"Un detalle que impresiona: saber que outline: none sin alternativa deja la web inservible con teclado."},
 {t:"info", eti:"Terminado", h:"Has completado CSS",
  c:`<p>Dominas cómo se aplica el CSS, todos los selectores, la cascada completa con capas, la herencia, el color moderno, las unidades y la tipografía, el modelo de caja y el flujo, el posicionamiento y el apilamiento, Flexbox y Grid a fondo, el diseño responsive con container queries, las variables y los temas, la animación, la arquitectura, el rendimiento y la depuración.</p>
<p>Para consolidarlo: maqueta desde cero la portada de un producto real (cabecera fija, portada, rejilla de tarjetas con subgrid, formulario y pie), con tema claro y oscuro, container queries en las tarjetas, movimiento reducido respetado, que funcione a 320px y con zoom al 200 %, y que obtenga más de 90 en Lighthouse. Después, pasa al curso de JavaScript.</p>`}
]}

]});
