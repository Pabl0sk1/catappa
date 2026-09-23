window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "Elementos interactivos nativos",
resumen: "Acordeones con details y summary, ventanas modales con dialog, popovers sin JavaScript e inert: interacción accesible que ya trae el navegador",
nivel: "Avanzado",
color: "#e4714a",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"ht5n1",
titulo:"details y summary: desplegables sin JavaScript",
claves:["details + summary crean un bloque que se abre y se cierra, accesible con teclado","El atributo open indica el estado; el evento toggle avisa de los cambios","Varios details con el mismo name forman un acordeón exclusivo"],
pasos:[
 {t:"info", eti:"Nativo", h:"Un desplegable en dos etiquetas",
  c:`<div class="termbox">&lt;details&gt;
  &lt;summary&gt;¿Puedo cancelar cuando quiera?&lt;/summary&gt;
  &lt;p&gt;Sí. La suscripción se cancela desde tu perfil y no se renueva.&lt;/p&gt;
&lt;/details&gt;

&lt;details name="faq" open&gt;                  &lt;!-- abierto de inicio --&gt;
  &lt;summary&gt;¿Hay versión gratuita?&lt;/summary&gt;&lt;p&gt;…&lt;/p&gt;
&lt;/details&gt;
&lt;details name="faq"&gt;                       &lt;!-- mismo name: al abrir uno se cierra el otro --&gt;
  &lt;summary&gt;¿Emitís factura?&lt;/summary&gt;&lt;p&gt;…&lt;/p&gt;
&lt;/details&gt;</div>
     <p>Sin una línea de JavaScript tienes: foco con el tabulador, apertura con Intro o Espacio, anuncio «contraído/expandido» en el lector de pantalla y estado reflejado en el atributo <code>open</code> (que puedes usar en CSS: <code>details[open]</code>). El atributo <code>name</code> para acordeones exclusivos funciona en todos los navegadores actuales desde 2024.</p>
     <div class="nota ojo"><b class="tit">Lo que no es</b>No sirve para menús de navegación desplegables complejos ni para pestañas: es un bloque de contenido que se muestra u oculta. Y el summary no debe contener otros elementos interactivos (enlaces, botones).</div>`},
 {t:"hueco", p:"Completa la pregunta frecuente desplegable",
  tpl:"<___>\n  <___>¿Cuánto tarda el envío?</summary>\n  <p>Entre 24 y 48 horas.</p>\n</details>",
  banco:["details","summary","dialog","legend","section","label"], sol:["details","summary"],
  why:"summary es el primer hijo y hace de botón; el resto del contenido es lo que se despliega."},
 {t:"opcion", p:"Quieres que en una lista de preguntas solo pueda estar abierta una a la vez. ¿Qué es lo más sencillo?",
  ops:["Un script que cierre las demás al abrir una","Poner el mismo atributo name en todos los details","Usar radios ocultos y CSS","Usar un select"],
  ok:1, why:"El navegador se encarga del comportamiento exclusivo. Es el mismo principio que los radios: mismo name, un solo elemento activo."},
 {t:"vf", p:"Un <code>&lt;details&gt;</code> se puede abrir y cerrar con el teclado sin añadir tabindex ni JavaScript.",
  ok:true, why:"summary es focusable y se activa con Intro y Espacio. Replicarlo con divs exigiría role, tabindex, aria-expanded y manejadores de teclado."},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["<summary>","El texto visible que abre y cierra"],["open","Atributo presente cuando está desplegado"],["toggle","Evento al cambiar de estado"],["name","Agrupa varios en un acordeón exclusivo"]],
  why:"El evento toggle permite, por ejemplo, cargar el contenido pesado solo la primera vez que se abre."},
 {t:"escribe", p:"¿Qué selector CSS apunta a un details que está abierto?",
  sol:["details[open]"],
  pista:"Selector de atributo.",
  why:"El estado vive en el DOM, así que CSS lo lee directamente: por ejemplo, para girar una flecha en <code>details[open] summary::before</code>."},
 {t:"opcion", p:"¿Qué NO debes meter dentro de <code>&lt;summary&gt;</code>?",
  ops:["Texto","Un icono SVG decorativo","Un enlace o un botón","Un título h3"],
  ok:2, why:"summary ya es interactivo: otro control dentro crea un conflicto (¿el clic abre o navega?) y el lector anuncia algo confuso. Un encabezado dentro sí está permitido."}
]},

/* =============== U5 L2 =============== */
{
id:"ht5n2",
titulo:"dialog: ventanas modales de verdad",
claves:["showModal() abre en modo modal: el resto de la página queda inerte y Escape cierra","form method=\"dialog\" cierra el diálogo y deja el botón pulsado en returnValue","El foco entra en el diálogo al abrir y vuelve al botón que lo abrió al cerrar"],
pasos:[
 {t:"info", eti:"El elemento", h:"Un modal con lo difícil ya resuelto",
  c:`<div class="termbox">&lt;button type="button" id="abrir"&gt;Borrar cuenta&lt;/button&gt;

&lt;dialog id="confirmar" aria-labelledby="titulo-conf"&gt;
  &lt;h2 id="titulo-conf"&gt;¿Borrar la cuenta?&lt;/h2&gt;
  &lt;p&gt;Se eliminarán tus cursos y tu progreso. No se puede deshacer.&lt;/p&gt;
  &lt;form method="dialog"&gt;
    &lt;button value="cancelar" autofocus&gt;Cancelar&lt;/button&gt;
    &lt;button value="borrar"&gt;Borrar&lt;/button&gt;
  &lt;/form&gt;
&lt;/dialog&gt;

&lt;script&gt;
  const dlg = document.getElementById("confirmar");
  document.getElementById("abrir").addEventListener("click", () =&gt; dlg.showModal());
  dlg.addEventListener("close", () =&gt; {
    if (dlg.returnValue === "borrar") borrarCuenta();
  });
&lt;/script&gt;</div>`},
 {t:"info", eti:"Por qué usarlo", h:"Lo que hace showModal() por ti",
  c:`<div class="dg"><div class="dg-tit">show() frente a showModal()</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">showModal()</div><div class="dg-pila">
           <div class="dg-caja acento">Capa superior (top layer): encima de todo, sin z-index</div>
           <div class="dg-caja acento">El resto de la página, inerte: ni clic ni tabulador</div>
           <div class="dg-caja acento">Escape cierra (evento cancel)</div>
           <div class="dg-caja acento">Fondo estilable con ::backdrop</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">show()</div><div class="dg-pila">
           <div class="dg-caja">Se muestra en su sitio del flujo</div>
           <div class="dg-caja">La página sigue siendo usable</div>
           <div class="dg-caja">Escape no hace nada</div>
           <div class="dg-caja">Para paneles no modales</div></div></div>
       </div></div>
     <p>Al abrir, el foco va al elemento con <code>autofocus</code> o al primero enfocable; al cerrar, vuelve al que lo abrió. Un modal hecho con divs necesita reimplementar todo eso (trampa de foco, Escape, <code>aria-modal</code>, devolver el foco) y casi siempre se olvida algo. No abras un modal con el atributo <code>open</code> a mano: eso lo abre como no modal.</p>`},
 {t:"par", p:"Empareja cada pieza de dialog con lo que hace",
  pares:[["showModal()","Abre como modal y deja inerte el resto"],["show()","Abre sin bloquear la página"],["close(valor)","Cierra y fija returnValue"],['<form method="dialog">',"Al enviar, cierra el diálogo"],["::backdrop","Pseudoelemento del fondo oscurecido"]],
  why:"returnValue recoge el value del botón que cerró el diálogo: no hace falta un manejador por botón."},
 {t:"opcion", p:"Tu modal casero con divs deja tabular a los enlaces de detrás. ¿Cuál es la mejor solución?",
  ops:["Poner tabindex=\"-1\" a todos los enlaces de la página","Reescribirlo con &lt;dialog&gt; y showModal(), que deja inerte el resto","Subir el z-index","Añadir role=\"dialog\" al div"],
  ok:1, why:"role=\"dialog\" solo cambia el anuncio, no el comportamiento. showModal() hace inerte el resto de verdad: ni ratón, ni teclado, ni lector de pantalla."},
 {t:"hueco", p:"Completa la apertura del modal y el formulario que lo cierra",
  tpl:'boton.addEventListener("click", () => dlg.___());\n\n<dialog id="dlg">\n  <form method="___">\n    <button value="ok">Aceptar</button>\n  </form>\n</dialog>',
  banco:["showModal","dialog","open","post","show","close"], sol:["showModal","dialog"],
  why:"method=\"dialog\" no envía nada al servidor: cierra el diálogo y pone el value del botón pulsado en returnValue."},
 {t:"vf", p:"En un diálogo abierto con <code>showModal()</code>, pulsar Escape lo cierra sin que escribas código.",
  ok:true, why:"Dispara el evento cancel y luego close. Si necesitas impedirlo (un formulario a medio rellenar), puedes llamar a preventDefault en cancel, con mesura."},
 {t:"orden", p:"Ordena lo que pasa con el foco en un modal bien hecho",
  items:["El foco está en el botón «Borrar cuenta»","Se llama a showModal()","El foco pasa al botón con autofocus dentro del diálogo","El tabulador solo recorre el diálogo","Al cerrar, el foco vuelve a «Borrar cuenta»"],
  why:"Si el foco no vuelve, quien usa teclado o lector se encuentra al principio de la página y pierde el sitio."},
 {t:"escribe", p:"¿Qué pseudoelemento de CSS estila el fondo que hay detrás de un dialog modal?",
  sol:["::backdrop",":backdrop","backdrop","dialog::backdrop"],
  pista:"En inglés, telón de fondo.",
  why:"Por ejemplo <code>dialog::backdrop { background: rgb(0 0 0 / .5); }</code>. Solo existe en elementos de la capa superior: modales, popovers y pantalla completa."}
]},

/* =============== U5 L3 =============== */
{
id:"ht5n3",
titulo:"Popover e inert",
claves:["popover + popovertarget abren menús, avisos y tooltips interactivos sin JavaScript","auto: se cierra al pulsar fuera o Escape y solo hay uno abierto; manual: lo cierras tú","inert desactiva por completo una zona: ni foco, ni clic, ni lector de pantalla"],
pasos:[
 {t:"info", eti:"Sin JavaScript", h:"La API Popover",
  c:`<div class="termbox">&lt;button type="button" popovertarget="menu-usuario"&gt;Mi cuenta&lt;/button&gt;
&lt;div id="menu-usuario" popover&gt;
  &lt;a href="/perfil"&gt;Perfil&lt;/a&gt;
  &lt;a href="/ajustes"&gt;Ajustes&lt;/a&gt;
  &lt;a href="/salir"&gt;Salir&lt;/a&gt;
&lt;/div&gt;

&lt;div id="aviso" popover="manual" role="status"&gt;Guardado&lt;/div&gt;
&lt;button type="button" popovertarget="aviso" popovertargetaction="hide"&gt;Cerrar aviso&lt;/button&gt;</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">popover auto frente a manual</div><table class="dg-tabla"><thead><tr><th></th><th>popover (auto)</th><th>popover="manual"</th></tr></thead><tbody>
     <tr><td>Pulsar fuera o Escape</td><td>Lo cierra (<i>light dismiss</i>)</td><td>No hace nada</td></tr>
     <tr><td>Abrir otro</td><td>Cierra los demás auto (salvo los anidados)</td><td>Pueden convivir varios</td></tr>
     <tr><td>Usos</td><td>Menús, selectores, tarjetas informativas</td><td>Notificaciones, avisos</td></tr></tbody></table></div>
     <p>El popover va a la <b>capa superior</b> (sin líos de z-index ni overflow), el botón recibe automáticamente <code>aria-expanded</code> y el foco vuelve al botón al cerrar. <b>No es modal</b>: la página sigue usable. Posicionarlo junto al botón es cosa de CSS (<i>anchor positioning</i>). Desde JavaScript: <code>showPopover()</code>, <code>hidePopover()</code>, <code>togglePopover()</code> y el evento <code>toggle</code>.</p>`},
 {t:"info", eti:"Elegir", h:"dialog, popover o inert",
  c:`<div class="dg"><div class="dg-tit">qué usar</div>
       <div class="dg-pila">
         <div class="dg-caja acento doble">Hay que responder antes de seguir<small>&lt;dialog&gt; con showModal(): confirmaciones, formularios que bloquean</small></div>
         <div class="dg-caja ok doble">Contenido flotante que se descarta al pulsar fuera<small>popover: menús, desplegables, tarjetas de ayuda</small></div>
         <div class="dg-caja doble">Mensaje que aparece y no roba el foco<small>popover="manual" + role="status" (o una región aria-live)</small></div>
         <div class="dg-caja base doble">Desactivar una parte de la página<small>atributo inert: un panel cerrado, el contenido detrás de un menú lateral</small></div>
       </div></div>
     <p>El atributo booleano <code>inert</code> hace que un subárbol no pueda recibir foco, clics ni ser leído por el lector de pantalla. Es lo que showModal() aplica al resto de la página. Además existen los atributos <code>command</code> y <code>commandfor</code> (2025), que permiten a un botón abrir un dialog (<code>command="show-modal"</code>) sin JavaScript; son recientes, así que comprueba el soporte antes de depender de ellos.</p>`},
 {t:"hueco", p:"Completa el botón que abre el panel de ayuda",
  tpl:'<button type="button" ___="ayuda">?</button>\n<div id="ayuda" ___>Pulsa Ctrl + K para buscar.</div>',
  banco:["popovertarget","popover","aria-controls","hidden","for","dialog"], sol:["popovertarget","popover"],
  why:"El botón apunta al id del popover. Si el botón solo muestra un «?», añádele un nombre accesible: <code>aria-label=\"Ayuda\"</code>."},
 {t:"opcion", p:"Tu popover de notificación desaparece cada vez que la persona hace clic en otra parte. ¿Qué cambias?",
  ops:["Nada, es inevitable","popover=\"manual\"","Añadir inert","Subir el z-index"],
  ok:1, why:"El valor por defecto (auto) aplica el cierre al pulsar fuera. En manual solo se cierra cuando tú (o un botón con popovertargetaction=\"hide\") lo decides."},
 {t:"par", p:"Empareja cada necesidad con la herramienta nativa",
  pares:[["Confirmar antes de borrar","dialog con showModal()"],["Menú de usuario desplegable","popover"],["Aviso «Guardado» que no roba el foco",'popover="manual" con role="status"'],["Contenido de fondo tras un menú lateral abierto","Atributo inert"]],
  why:"Elegir bien ahorra cientos de líneas de JavaScript de gestión de foco, y los errores de accesibilidad que traen."},
 {t:"vf", p:"Un popover abierto deja el resto de la página inerte, como un modal.",
  ok:false, why:"Los popovers no son modales: se puede seguir interactuando con la página. Si necesitas bloquear, usa dialog con showModal()."},
 {t:"escribe", p:"¿Qué atributo booleano quita el foco, los clics y la lectura por el lector de pantalla a toda una sección?",
  sol:["inert"],
  pista:"Significa «sin vida» o «inactivo».",
  why:"Sustituye a la vieja receta de poner tabindex=\"-1\" y aria-hidden en cada elemento. Añade también un estilo visual para que se note que está desactivado."},
 {t:"opcion", p:"¿Qué valor de <code>popovertargetaction</code> hace que un botón solo cierre el popover?",
  ops:["close","hide","toggle","dismiss"],
  ok:1, why:"Los valores son <code>toggle</code> (por defecto), <code>show</code> y <code>hide</code>."}
]}

]});
