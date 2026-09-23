window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "Accesibilidad a fondo",
resumen: "WCAG 2.2 y la ley, ARIA y cuándo no usarlo, teclado y gestión del foco, lectores de pantalla y cómo auditar una página",
nivel: "Avanzado",
color: "#df6b45",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"hc6l1",
titulo:"Accesibilidad web y WCAG 2.2",
claves:["WCAG: perceptible, operable, comprensible y robusto; el objetivo habitual es el nivel AA","Contraste suficiente, foco visible, teclado, textos alternativos y etiquetas","WCAG 2.2 añade foco no tapado, tamaño mínimo de objetivo, arrastre y autenticación accesible"],
pasos:[
 {t:"info", eti:"Para todas las personas", h:"Lo esencial",
  c:`<ul><li><b>Contraste</b> de al menos 4,5:1 entre texto y fondo (3:1 en textos grandes y en bordes de controles e iconos).</li>
     <li><b>Teclado</b>: todo lo interactivo se alcanza con Tab y se activa con Enter o Espacio; el <b>foco se ve</b> (<code>:focus-visible</code>).</li>
     <li><b>Textos alternativos</b> en imágenes con información.</li>
     <li><b>Etiquetas</b> en todos los campos; errores anunciados.</li>
     <li><b>Idioma</b> del documento (<code>lang="es"</code>) y jerarquía de títulos coherente.</li>
     <li>No transmitir información <b>solo con color</b> (un error en rojo también lleva texto o icono).</li>
     <li>Que se pueda ampliar al 200 % y que a 320 px de ancho no haga falta desplazamiento horizontal (<i>reflow</i>).</li></ul>`},
 {t:"info", eti:"La norma", h:"WCAG 2.2, niveles y ley",
  c:`<div class="dg"><div class="dg-tit">los cuatro principios (POUR)</div>
       <div class="dg-fila">
         <div class="dg-caja acento doble">Perceptible<small>alt, subtítulos, contraste</small></div>
         <div class="dg-caja acento doble">Operable<small>teclado, tiempo, foco</small></div>
         <div class="dg-caja acento doble">Comprensible<small>idioma, errores, coherencia</small></div>
         <div class="dg-caja acento doble">Robusto<small>HTML válido, nombres y roles</small></div>
       </div></div>
     <p>Cada criterio tiene nivel <b>A</b> (mínimo), <b>AA</b> (el exigido por las normas y contratos, como la europea EN 301 549) o <b>AAA</b>. En la UE, la <b>Ley Europea de Accesibilidad</b> se aplica desde el 28 de junio de 2025 a comercio electrónico, banca, transporte y otros servicios privados, no solo a la administración.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">novedades de WCAG 2.2 (nivel A y AA)</div><table class="dg-tabla"><tbody>
     <tr><td>2.4.11 Foco no tapado</td><td>El elemento con foco no puede quedar oculto del todo por una cabecera fija o un banner de cookies.</td></tr>
     <tr><td>2.5.7 Movimientos de arrastre</td><td>Todo lo que se hace arrastrando tiene alternativa con clics simples.</td></tr>
     <tr><td>2.5.8 Tamaño del objetivo</td><td>Objetivos de al menos 24 × 24 px CSS (o separación suficiente).</td></tr>
     <tr><td>3.2.6 Ayuda coherente</td><td>La ayuda (chat, teléfono) en el mismo sitio en todas las páginas.</td></tr>
     <tr><td>3.3.7 Entrada redundante</td><td>No pedir dos veces el mismo dato en un proceso.</td></tr>
     <tr><td>3.3.8 Autenticación accesible</td><td>Sin pruebas cognitivas: permitir pegar, gestores de contraseñas, enlaces mágicos.</td></tr></tbody></table></div>
     <p>WCAG 2.2 eliminó el criterio 4.1.1 (análisis sintáctico): los navegadores ya reparan el HTML de forma uniforme. Validar sigue siendo buena práctica.</p>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Texto gris claro sobre blanco","Aumentar el contraste"],["outline: none sin alternativa","Estilo de :focus-visible bien visible"],["Botón que es un div","Usar un button"],["Error indicado solo en rojo","Añadir texto e icono al error"],["Modal que no atrapa el foco","Usar dialog con showModal()"]],
  why:"La accesibilidad también es un requisito legal en muchos sectores y países."},
 {t:"opcion", p:"¿Cuál es la forma más rápida de detectar problemas de accesibilidad en tu página?",
  ops:["No hay forma","Recorrerla solo con el teclado y pasar Lighthouse o axe DevTools","Mirarla en otro navegador","Poner más imágenes"],
  ok:1, why:"Las herramientas automáticas detectan parte; el teclado revela lo demás."},
 {t:"par", p:"Empareja cada criterio con su principio de WCAG",
  pares:[["Texto alternativo en imágenes","Perceptible"],["Todo funciona con teclado","Operable"],["Mensajes de error que explican cómo corregir","Comprensible"],["Nombre y rol correctos en cada control","Robusto"]],
  why:"Robusto significa que las tecnologías de apoyo pueden interpretar la página: ahí entra el HTML semántico y el ARIA bien usado."},
 {t:"opcion", p:"La cabecera fija tapa por completo el enlace que tiene el foco al tabular hacia abajo. ¿Qué criterio de WCAG 2.2 incumple?",
  ops:["1.1.1 Contenido no textual","2.4.11 Foco no tapado","1.4.3 Contraste","3.1.1 Idioma de la página"],
  ok:1, why:"Se arregla con <code>scroll-padding-top</code> en CSS igual a la altura de la cabecera: el navegador deja ese margen al desplazar hasta el elemento con foco."},
 {t:"escribe", p:"¿Qué relación de contraste mínima pide WCAG AA para texto normal? (formato N:1)",
  sol:["4.5:1","4,5:1","4.5 : 1"],
  pista:"Entre 4 y 5.",
  why:"3:1 para texto grande (24 px, o 18,66 px en negrita) y para componentes de interfaz. DevTools muestra la relación al inspeccionar un texto."},
 {t:"vf", p:"Un botón de icono de 16 × 16 px, sin espacio alrededor, cumple WCAG 2.2 AA.",
  ok:false, why:"El criterio 2.5.8 pide 24 × 24 px CSS como mínimo, o que haya separación suficiente con los objetivos vecinos. Para móviles, 44 × 44 sigue siendo la recomendación cómoda."}
]},

/* =============== U6 L2 =============== */
{
id:"ht6n1",
titulo:"ARIA: roles, estados y cuándo no usarlo",
claves:["Primera regla de ARIA: si hay un elemento HTML nativo, úsalo","ARIA cambia lo que se anuncia, nunca el comportamiento: no añade teclado ni foco","Nombre accesible: aria-labelledby, luego aria-label, luego el nativo (label, alt, contenido)"],
pasos:[
 {t:"info", eti:"Qué es", h:"ARIA solo cambia el anuncio",
  c:`<p><b>WAI-ARIA</b> son atributos que modifican el <b>árbol de accesibilidad</b>: roles (<code>role="tab"</code>), estados (<code>aria-expanded</code>, <code>aria-checked</code>, <code>aria-disabled</code>) y propiedades (<code>aria-label</code>, <code>aria-controls</code>, <code>aria-describedby</code>). No cambian nada más:</p>
     <div class="termbox">&lt;!-- MAL: se anuncia como botón, pero no recibe foco ni responde a Intro/Espacio --&gt;
&lt;div role="button" onclick="guardar()"&gt;Guardar&lt;/div&gt;

&lt;!-- lo que haría falta para igualar a un button nativo --&gt;
&lt;div role="button" tabindex="0" onclick="guardar()"
     onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); guardar(); }"&gt;Guardar&lt;/div&gt;

&lt;!-- BIEN --&gt;
&lt;button type="button" onclick="guardar()"&gt;Guardar&lt;/button&gt;</div>
     <div class="nota ojo"><b class="tit">Las reglas de ARIA</b>1) Si existe un elemento nativo, úsalo. 2) No cambies la semántica nativa (<code>&lt;h2 role="tab"&gt;</code>). 3) Todo control ARIA debe funcionar con teclado. 4) Nunca <code>aria-hidden="true"</code> ni <code>role="presentation"</code> en algo que recibe foco. 5) Todo elemento interactivo necesita nombre accesible. Las auditorías lo confirman año tras año: las páginas con más ARIA tienen de media más errores.</div>`},
 {t:"info", eti:"Nombres y avisos", h:"Nombre accesible y regiones vivas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">de dónde sale el nombre accesible (gana el primero)</div><table class="dg-tabla"><tbody>
     <tr><td>1. aria-labelledby</td><td>Texto de otros elementos por id: <code>aria-labelledby="titulo-dlg"</code>.</td></tr>
     <tr><td>2. aria-label</td><td>Texto directo, invisible: <code>&lt;button aria-label="Cerrar"&gt;×&lt;/button&gt;</code>.</td></tr>
     <tr><td>3. Nativo</td><td>label del campo, alt de la imagen, caption de la tabla, legend, contenido del botón o enlace.</td></tr>
     <tr><td>4. title</td><td>Último recurso; poco fiable (no se ve en táctil ni con teclado).</td></tr></tbody></table></div>
     <div class="termbox">&lt;!-- región viva: lo que cambie dentro se anuncia sin mover el foco --&gt;
&lt;div role="status"&gt;&lt;/div&gt;             &lt;!-- = aria-live="polite": espera a que calle --&gt;
&lt;div role="alert"&gt;&lt;/div&gt;              &lt;!-- = aria-live="assertive": interrumpe --&gt;

carrito.textContent = "3 productos en el carrito";   // se anuncia</div>
     <p>La región viva tiene que <b>existir en el DOM antes</b> del cambio: si insertas el div ya con el texto, muchos lectores no lo anuncian. Y un <code>aria-label</code> debe contener el texto visible (WCAG 2.5.3): si el botón dice «Enviar», no le pongas <code>aria-label="Mandar formulario"</code>, porque quien usa control por voz dirá «pulsa Enviar».</p>`},
 {t:"opcion", p:"¿Qué dice la primera regla de uso de ARIA?",
  ops:["Pon role en todos los elementos","Si hay un elemento o atributo HTML nativo con la semántica y el comportamiento que necesitas, úsalo en lugar de ARIA","Usa siempre aria-label en lugar de label","ARIA sustituye al HTML semántico"],
  ok:1, why:"El nativo trae teclado, foco, estados y anuncios probados en todos los navegadores y lectores. ARIA solo añade el anuncio, y lo demás corre de tu cuenta."},
 {t:"par", p:"Empareja cada atributo ARIA con su uso",
  pares:[["aria-expanded","Si un desplegable está abierto o cerrado"],["aria-label","Nombre para un control sin texto visible"],["aria-describedby","Descripción adicional (ayuda, error)"],["aria-hidden","Oculta al lector algo decorativo"],["aria-live","Anuncia cambios de contenido"]],
  why:"aria-hidden solo afecta al árbol de accesibilidad: el elemento se sigue viendo y, si es enfocable, se puede tabular a un «hueco» sin nombre."},
 {t:"hueco", p:"Completa el botón de menú que muestra u oculta la navegación",
  tpl:'<button type="button" ___="false" ___="menu-principal">Menú</button>\n<nav id="menu-principal" hidden>…</nav>',
  banco:["aria-expanded","aria-controls","aria-hidden","aria-pressed","aria-label","role"], sol:["aria-expanded","aria-controls"],
  why:"aria-expanded se actualiza a true al abrir. aria-pressed es para botones de alternar (negrita sí/no), no para desplegables."},
 {t:"opcion", p:"Un botón solo muestra un icono de lupa (SVG). ¿Cómo le das nombre?",
  ops:["title=\"Buscar\" en el svg","aria-label=\"Buscar\" en el button (y aria-hidden en el svg)","role=\"img\" en el button","alt=\"Buscar\" en el button"],
  ok:1, why:"El nombre va en el elemento interactivo. alt solo existe en img, input type=image y area; title es poco fiable. Alternativa: texto visualmente oculto dentro del botón."},
 {t:"vf", p:"Poner <code>aria-hidden=\"true\"</code> en un contenedor que tiene enlaces dentro los hace inalcanzables con el tabulador.",
  ok:false, why:"Siguen recibiendo foco: el lector llega a un elemento que «no existe» y no dice nada. Para desactivar de verdad una zona se usa <code>inert</code>."},
 {t:"opcion", p:"Tras añadir al carrito, insertas <code>&lt;div role=\"alert\"&gt;Añadido&lt;/div&gt;</code> nuevo en el DOM y el lector no dice nada. ¿Por qué?",
  ops:["role=\"alert\" no existe","Las regiones vivas deben existir antes del cambio; hay que tenerla vacía en la página y rellenar su texto","Falta aria-hidden","Hay que usar title"],
  ok:1, why:"Los lectores registran las regiones vivas al cargar y anuncian los cambios dentro. Para mensajes no urgentes, mejor <code>role=\"status\"</code> que alert."},
 {t:"escribe", p:"¿Qué atributo ARIA usas para que un control tome como nombre el texto de otro elemento, indicado por su id?",
  sol:["aria-labelledby"],
  pista:"«etiquetado por».",
  why:"Tiene prioridad sobre todo lo demás y admite varios id: <code>aria-labelledby=\"titulo precio\"</code> concatena ambos textos."}
]},

/* =============== U6 L3 =============== */
{
id:"ht6n2",
titulo:"Teclado y gestión del foco",
claves:["El orden del tabulador sigue el DOM: no lo desordenes con CSS ni con tabindex positivos","tabindex=\"0\" hace enfocable, tabindex=\"-1\" solo por script; nunca valores mayores que 0","En una SPA, al cambiar de vista mueve el foco al nuevo título; tras borrar, a un sitio lógico"],
pasos:[
 {t:"info", eti:"Reglas", h:"tabindex y orden del foco",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tabindex</div><table class="dg-tabla"><tbody>
     <tr><td>sin tabindex</td><td>Enfocables solo los nativos: a con href, button, input, select, textarea, summary…</td></tr>
     <tr><td>tabindex="0"</td><td>Entra en el orden del tabulador en su posición del DOM (para widgets propios, regiones con scroll).</td></tr>
     <tr><td>tabindex="-1"</td><td>Fuera del tabulador, pero enfocable con <code>el.focus()</code>: títulos de destino, contenedores de diálogos.</td></tr>
     <tr><td>tabindex="3"</td><td><b>Nunca</b>: salta por delante de todo y rompe el orden de la página entera.</td></tr></tbody></table></div>
     <p>El foco sigue el <b>orden del DOM</b>. Si con CSS (<code>order</code>, <code>flex-direction: row-reverse</code>, grid) colocas las cosas en otro orden visual, el foco salta de forma incoherente (WCAG 2.4.3). El foco tiene que <b>verse</b> (2.4.7): nunca <code>outline: none</code> sin sustituto.</p>`},
 {t:"info", eti:"Patrones", h:"Mover el foco con intención",
  c:`<div class="termbox">// 1. SPA: al cambiar de ruta, llevar el foco al nuevo título
const h1 = document.querySelector("main h1");
h1.setAttribute("tabindex", "-1");
h1.focus();

// 2. Tras borrar un elemento de una lista, no dejar el foco en el vacío
siguiente ? siguiente.querySelector("button").focus() : lista.previousElementSibling.focus();

// 3. Dentro de un grupo (pestañas, barra de herramientas): «roving tabindex»
//    un solo elemento con tabindex="0", los demás "-1"; las flechas mueven entre ellos</div>
     <p>Convenciones de teclado: <b>Tab</b> va de un control a otro; las <b>flechas</b> se mueven dentro de un grupo (radios, pestañas, menús, listas); <b>Escape</b> cierra lo flotante; <b>Intro</b> activa enlaces y botones; <b>Espacio</b> activa botones y marca casillas. Nunca atrapes el foco donde no se pueda salir con el teclado (2.1.2), salvo en un modal que se cierra con Escape.</p>`},
 {t:"par", p:"Empareja cada valor de tabindex con su efecto",
  pares:[['tabindex="0"',"Enfocable con Tab, en el orden del DOM"],['tabindex="-1"',"Solo enfocable desde JavaScript"],['tabindex="5"',"Se adelanta a todo: rompe el orden"],["Sin tabindex en un button","Enfocable de serie"]],
  why:"Si necesitas tabindex positivo para arreglar el orden, lo que está mal es el orden del HTML."},
 {t:"opcion", p:"En tu aplicación de una sola página, al pulsar un enlace del menú cambia el contenido pero el lector de pantalla no dice nada y el foco sigue en el menú. ¿Qué haces?",
  ops:["Recargar la página entera","Mover el foco al h1 de la nueva vista (con tabindex=\"-1\") y actualizar document.title","Poner aria-live en todo el main","Nada, es normal en las SPA"],
  ok:1, why:"Es lo que ocurre de forma natural en una navegación completa. Los enrutadores modernos lo hacen o lo permiten; conviene comprobarlo."},
 {t:"orden", p:"Ordena la gestión del foco al borrar la tarea 2 de una lista de tres",
  items:["El foco está en «Borrar» de la tarea 2","Se elimina la tarea 2 del DOM","Se mueve el foco a «Borrar» de la tarea que ocupa su lugar (la antigua 3)","Se anuncia «Tarea borrada» en una región role=\"status\""],
  why:"Si no mueves el foco, el navegador lo deja en el body y quien usa teclado vuelve al principio de la página."},
 {t:"opcion", p:"Con CSS pones el botón «Enviar» a la izquierda de «Cancelar» usando <code>flex-direction: row-reverse</code>. ¿Qué problema aparece?",
  ops:["Ninguno","El tabulador sigue el orden del HTML y no el visual, y el foco parece saltar al revés","El botón deja de funcionar","Se pierde el contraste"],
  ok:1, why:"Si el orden visual importa, cambia el orden en el HTML. CSS no debe contradecir la secuencia de lectura."},
 {t:"vf", p:"Para quitar el anillo de foco que sale al hacer clic con el ratón, lo correcto es <code>*:focus { outline: none; }</code>.",
  ok:false, why:"Eso lo quita también para el teclado. <code>:focus-visible</code> resuelve justo eso: el navegador solo muestra el foco cuando es útil (teclado), no en clics de ratón sobre botones."},
 {t:"escribe", p:"¿Qué valor de <code>tabindex</code> hace que un elemento se pueda enfocar con <code>.focus()</code> pero no con el tabulador?",
  sol:["-1","tabindex=\"-1\"","tabindex=-1"],
  pista:"Un número negativo.",
  why:"Es el valor para destinos de foco programado: títulos, contenedores de error, el main del enlace «Saltar al contenido»."}
]},

/* =============== U6 L4 =============== */
{
id:"ht6n3",
titulo:"Lectores de pantalla y auditoría",
claves:["NVDA y JAWS en Windows, VoiceOver en Apple, TalkBack en Android: se navega por títulos, landmarks, enlaces y campos","Las herramientas automáticas solo detectan una parte: siempre prueba con teclado y lector","Texto visualmente oculto para lo que el lector necesita y la pantalla no"],
pasos:[
 {t:"info", eti:"Cómo se usan", h:"Navegar sin ver la pantalla",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">lectores de pantalla más usados</div><table class="dg-tabla"><tbody>
     <tr><td>NVDA</td><td>Windows, gratuito, el más usado junto a JAWS. Pruébalo con Firefox o Chrome.</td></tr>
     <tr><td>JAWS</td><td>Windows, de pago, habitual en empresas.</td></tr>
     <tr><td>VoiceOver</td><td>macOS e iOS, integrado (Cmd + F5). Pruébalo con Safari.</td></tr>
     <tr><td>TalkBack</td><td>Android, integrado.</td></tr>
     <tr><td>Narrador</td><td>Windows, integrado.</td></tr></tbody></table></div>
     <div class="dg dg-tabla-caja" style="margin-top:12px"><div class="dg-tit">teclas rápidas de NVDA en modo exploración</div><table class="dg-tabla"><tbody>
     <tr><td>H / 1…6</td><td>siguiente encabezado / de ese nivel</td></tr>
     <tr><td>D</td><td>siguiente landmark (región)</td></tr>
     <tr><td>K</td><td>siguiente enlace</td></tr>
     <tr><td>F</td><td>siguiente campo de formulario</td></tr>
     <tr><td>T</td><td>siguiente tabla</td></tr>
     <tr><td>Insert + F7</td><td>lista de elementos (enlaces, títulos, landmarks)</td></tr></tbody></table></div>
     <p>Las encuestas de WebAIM muestran que la mayoría de usuarios de lector de pantalla empiezan buscando <b>por encabezados</b>. Por eso la jerarquía de títulos es lo primero que se audita.</p>`},
 {t:"info", eti:"Auditar", h:"Un método que funciona",
  c:`<div class="dg"><div class="dg-tit">auditoría en capas</div>
       <div class="dg-vert">
         <div class="dg-caja doble">1. Automática<small>axe DevTools, Lighthouse, WAVE; en CI con axe-core o Pa11y. Detecta contraste, alt ausente, etiquetas, ARIA inválido: solo una parte de los problemas</small></div>
         <div class="dg-caja doble">2. Teclado<small>todo alcanzable, foco visible, orden lógico, sin trampas, Escape cierra</small></div>
         <div class="dg-caja doble">3. Zoom y reflow<small>200 % sin pérdida; a 320 px de ancho sin scroll horizontal</small></div>
         <div class="dg-caja doble">4. Lector de pantalla<small>títulos, landmarks, nombres de controles, anuncios de cambios</small></div>
         <div class="dg-caja ok doble">5. Personas reales<small>pruebas con usuarios con discapacidad cuando sea posible</small></div>
       </div></div>
     <div class="termbox">/* texto que se lee pero no se ve: «Leer más &lt;span class="visualmente-oculto"&gt;sobre Docker&lt;/span&gt;» */
.visualmente-oculto {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}</div>
     <p>En DevTools, el panel <b>Accesibilidad</b> muestra el árbol de accesibilidad: nombre, rol y estado calculados de cada nodo. Es lo que «ve» el lector. Y <code>display: none</code> o <code>hidden</code> ocultan a todos; la clase anterior oculta solo a la vista.</p>`},
 {t:"par", p:"Empareja cada tecla de NVDA (modo exploración) con lo que hace",
  pares:[["H","Salta al siguiente encabezado"],["D","Salta al siguiente landmark"],["K","Salta al siguiente enlace"],["F","Salta al siguiente campo de formulario"],["T","Salta a la siguiente tabla"]],
  why:"Así es como se «hojea» una página. Si tus títulos son divs con letra grande, esa navegación no existe."},
 {t:"opcion", p:"Lighthouse da un 100 en accesibilidad. ¿Significa que la página es accesible?",
  ops:["Sí, está certificada","No: las pruebas automáticas solo cubren parte de los criterios; faltan las pruebas con teclado y lector","Sí, si también da 100 en rendimiento","Solo si es móvil"],
  ok:1, why:"Una herramienta no sabe si un alt describe bien la imagen, si el orden del foco tiene sentido o si un modal devuelve el foco. Lo automático es el suelo, no el techo."},
 {t:"orden", p:"Ordena una auditoría de accesibilidad de menos a más esfuerzo",
  items:["Pasar axe o Lighthouse","Recorrer la página solo con el teclado","Ampliar al 200 % y probar a 320 px de ancho","Recorrerla con un lector de pantalla","Probarla con personas usuarias de tecnologías de apoyo"],
  why:"Cada capa encuentra problemas que la anterior no ve. Las dos primeras las puede hacer cualquiera en diez minutos."},
 {t:"opcion", p:"Tienes muchos enlaces «Leer más» en una lista de artículos. ¿Cómo los haces distinguibles sin cambiar el diseño?",
  ops:["Añadir title a cada enlace","Añadir texto visualmente oculto: «Leer más &lt;span class=\"visualmente-oculto\"&gt;sobre Docker&lt;/span&gt;»","Ponerles aria-hidden","Quitarlos"],
  ok:1, why:"El nombre accesible pasa a ser «Leer más sobre Docker» y además empieza por el texto visible, que es lo que dirá quien use control por voz."},
 {t:"vf", p:"Un elemento con <code>display: none</code> sigue siendo leído por los lectores de pantalla.",
  ok:false, why:"display: none, visibility: hidden y el atributo hidden lo quitan del árbol de accesibilidad. Para ocultar solo a la vista se usa la técnica de «visualmente oculto»."},
 {t:"escribe", p:"¿Cómo se llama el lector de pantalla gratuito y de código abierto más usado en Windows?",
  sol:["NVDA","nonvisual desktop access"],
  pista:"Cuatro letras: NonVisual Desktop Access.",
  why:"Instalarlo cuesta dos minutos. Con NVDA + Firefox o Chrome y VoiceOver + Safari cubres la mayoría de combinaciones reales."}
]}

]});
