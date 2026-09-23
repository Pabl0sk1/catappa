window.CURSOS = window.CURSOS || {};
(CURSOS.css = CURSOS.css || []).push({
titulo: "Animación y movimiento",
resumen: "Transiciones y curvas de tiempo, @starting-style, transformaciones 2D y 3D, animaciones con @keyframes, rendimiento de las animaciones, movimiento reducido, animaciones ligadas al scroll y view transitions",
nivel: "Experto",
color: "#2147a0",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"cs9n1",
titulo:"Transiciones",
claves:["transition anima el cambio entre dos estados: propiedad, duración, curva y retardo","Nombra las propiedades (no uses all); 150-300 ms para la interfaz; ease-out al entrar","@starting-style y transition-behavior: allow-discrete animan la aparición y display: none"],
pasos:[
 {t:"info", eti:"De A a B", h:"transition",
  c:`<div class="termbox">.boton {
  background: var(--acento);
  transition: background-color 150ms ease, transform 150ms ease;
  /* equivale a: transition-property, -duration, -timing-function, -delay */
}
.boton:hover { background: color-mix(in oklch, var(--acento), black 15%); transform: translateY(-1px); }

.menu { transition: opacity 200ms ease-out 50ms; }   /* 50ms de retardo */</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">curvas de tiempo (timing functions)</div><table class="dg-tabla"><tbody>
<tr><td>ease</td><td>por defecto: arranca rápido y frena al final</td></tr>
<tr><td>linear</td><td>velocidad constante: rotaciones, barras de progreso</td></tr>
<tr><td>ease-out</td><td>rápido al principio, suave al final: lo que ENTRA en pantalla</td></tr>
<tr><td>ease-in</td><td>lento al principio: lo que SALE</td></tr>
<tr><td>cubic-bezier(.2, .8, .2, 1)</td><td>curva a medida</td></tr>
<tr><td>steps(4)</td><td>a saltos: animaciones fotograma a fotograma</td></tr>
<tr><td>linear(0, 1.1 60%, 1)</td><td>curvas por puntos: rebotes y muelles</td></tr>
</tbody></table></div>
<div class="nota ojo"><b class="tit">transition: all</b>Anima cualquier propiedad que cambie, también las que no querías (un padding al cambiar de tamaño de pantalla, un color al cambiar de tema) y las caras de animar. Nombra siempre las propiedades.</div>`},
 {t:"info", eti:"Aparecer", h:"Entradas y display: none",
  c:`<p>Dos cosas que las transiciones no podían hacer: animar un elemento <b>al aparecer</b> (no hay estado «antes») y animar <b>display: none</b> (es un valor discreto, cambia de golpe).</p>
<div class="termbox">.aviso {
  opacity: 1; translate: 0 0;
  transition: opacity .25s, translate .25s, display .25s allow-discrete;
}
.aviso.oculto { display: none; opacity: 0; translate: 0 8px; }

@starting-style {                 /* los valores «de partida» la primera vez que se pinta */
  .aviso { opacity: 0; translate: 0 8px; }
}</div>
<p>Con <code>allow-discrete</code>, el navegador espera a que acabe la transición de salida antes de aplicar <code>display: none</code>, y <code>@starting-style</code> da el estado inicial para la entrada. Así se animan <code>&lt;dialog&gt;</code> y <code>popover</code> sin JavaScript. Ambos están en todos los navegadores desde 2024.</p>
<p>¿Y animar hasta <code>height: auto</code>? El truco que funciona en todos: un grid con <code>grid-template-rows: 0fr</code> → <code>1fr</code> y el hijo con <code>overflow: hidden</code>. (<code>interpolate-size: allow-keywords</code> lo hace directo, de momento solo en Chromium.)</p>`},
 {t:"hueco", p:"Transición de 200ms con salida suave en el color de fondo del botón",
  tpl:".boton { transition: ___ 200ms ___; }", banco:["background-color","ease-out","all","linear","200ms"], sol:["background-color","ease-out"],
  why:"Nombrar la propiedad evita animar cosas que no querías. ease-out da sensación de respuesta inmediata."},
 {t:"par", p:"Empareja cada curva con su uso habitual",
  pares:[["ease-out","Elementos que entran: menús, avisos"],["ease-in","Elementos que salen de la pantalla"],["linear","Rotaciones continuas y barras de progreso"],["steps(8)","Animación por fotogramas de un sprite"],["cubic-bezier(...)","Curva a medida de tu sistema de diseño"]],
  why:"El movimiento natural nunca es lineal: los objetos aceleran y frenan."},
 {t:"opcion", p:"¿Qué pasará? <code>.panel { transition: opacity .3s; }</code> y al ocultarlo le pones <code>display: none; opacity: 0</code>",
  ops:["Se desvanece en 0,3 s","Desaparece de golpe: display: none se aplica al instante y ya no hay nada que animar","Se queda visible","Parpadea"],
  ok:1, why:"Hace falta incluir display en la transición con allow-discrete (o esperar a transitionend en JavaScript, como se hacía antes)."},
 {t:"escribe", p:"Escribe la regla-at que define los estilos iniciales desde los que se anima un elemento la primera vez que aparece",
  sol:["@starting-style","starting-style"], pista:"Empieza por @ y habla del «estilo de partida».",
  why:"Sin ella, un elemento recién insertado se pinta directamente en su estado final: no hay «antes» del que transicionar."},
 {t:"vf", p:"Para microinteracciones de interfaz (hover, abrir un menú), 150-300 ms es una buena duración.",
  ok:true, why:"Menos de 100 ms apenas se percibe; más de 400 ms hace que la interfaz parezca lenta."},
 {t:"opcion", p:"Tu compañero ha puesto <code>* { transition: all .3s }</code> «para que todo sea suave». ¿Qué problema tiene?",
  ops:["Ninguno","Anima cambios que no deberían animarse (tema, tamaño, layout), anima propiedades caras que provocan tirones y no respeta a quien pide menos movimiento","Solo funciona en Chrome","Hace el CSS más largo"],
  ok:1, why:"Las transiciones se deciden componente a componente, con propiedades concretas."}
]},

/* =============== U9 L2 =============== */
{
id:"cs9n2",
titulo:"Transformaciones",
claves:["translate, rotate, scale y skew mueven y deforman sin afectar al layout de los vecinos","El orden de las funciones en transform importa; las propiedades sueltas translate, rotate y scale se aplican en un orden fijo","transform-origin fija el punto de giro; perspective y rotateY dan 3D"],
pasos:[
 {t:"info", eti:"Mover sin recolocar", h:"Funciones de transformación",
  c:`<div class="termbox">.a { transform: translate(20px, -10px); }     /* mover */
.b { transform: rotate(15deg); }                 /* girar */
.c { transform: scale(1.1); }                    /* escalar */
.d { transform: skewX(-10deg); }                 /* inclinar */
.e { transform: translateX(10px) rotate(45deg) scale(1.2); }   /* combinadas */

/* propiedades individuales (todos los navegadores desde 2022): se animan por separado */
.f { translate: 0 -2px; rotate: 5deg; scale: 1.05; }

/* centrar algo absoluto: el % de translate es del PROPIO elemento */
.g { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

.aguja { transform-origin: bottom center; rotate: 30deg; }   /* gira desde abajo */</div>
<p>Una transformación <b>no cambia el layout</b>: el elemento se pinta desplazado, pero su hueco original sigue igual y los vecinos no se mueven. Por eso es barato de animar. Recuerda también que un <code>transform</code> crea un contexto de apilamiento y un bloque contenedor para los hijos <code>fixed</code>.</p>`},
 {t:"info", eti:"Orden y 3D", h:"El orden importa",
  c:`<div class="dg"><div class="dg-tit">mismas funciones, distinto orden</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">translateX(100px) rotate(45deg)</div><div class="dg-caja ok doble">se mueve 100px a la derecha<small>y luego gira sobre sí mismo</small></div></div>
<div class="dg-col"><div class="dg-col-tit">rotate(45deg) translateX(100px)</div><div class="dg-caja aviso doble">gira primero sus ejes<small>y se mueve 100px en diagonal, en la dirección girada</small></div></div>
</div></div>
<p>Cada función transforma el sistema de coordenadas de las siguientes. Las propiedades individuales siempre se aplican en el orden <b>translate → rotate → scale</b>, y después la propiedad <code>transform</code>.</p>
<div class="termbox">.escena { perspective: 800px; }                 /* distancia del ojo: menos = más exagerado */
.carta { transition: rotate .6s; transform-style: preserve-3d; }
.carta:hover { rotate: y 180deg; }                 /* voltear sobre el eje Y */
.cara, .dorso { backface-visibility: hidden; }     /* no ver la cara de atrás */
.dorso { rotate: y 180deg; }</div>`},
 {t:"par", p:"Empareja cada transformación con su efecto",
  pares:[["translate(-50%, -50%)","Desplaza la mitad de su propio tamaño hacia arriba y a la izquierda"],["rotate(90deg)","Gira un cuarto de vuelta en sentido horario"],["scale(0.5)","Lo reduce a la mitad"],["skewX(-10deg)","Lo inclina en horizontal"],["transform-origin: top left","Transforma desde la esquina superior izquierda"]],
  why:"Los porcentajes de translate son del propio elemento; los de left o margin, del contenedor."},
 {t:"opcion", p:"¿Qué pasará? Un botón con <code>:hover { scale: 1.2 }</code> dentro de una fila de botones",
  ops:["Los botones vecinos se desplazan para dejarle sitio","Se ve más grande y puede solaparse con los vecinos, que no se mueven","La fila crece en altura","No pasa nada"],
  ok:1, why:"Las transformaciones no afectan al layout. Si quieres que empuje, tendrías que cambiar su tamaño real (más caro y con saltos)."},
 {t:"hueco", p:"Centra un elemento absoluto respecto a su contenedor",
  tpl:".centro { position: absolute; top: 50%; left: 50%; transform: ___(-50%, -50%); }\n.aguja { ___: bottom center; }", banco:["translate","transform-origin","scale","origin","rotate"], sol:["translate","transform-origin"],
  why:"top y left en 50% ponen la esquina en el centro; translate(-50%, -50%) retrocede la mitad del propio tamaño."},
 {t:"vf", p:"<code>transform: rotate(45deg) translateX(100px)</code> y <code>transform: translateX(100px) rotate(45deg)</code> dejan el elemento en el mismo sitio.",
  ok:false, why:"El orden importa: cada función actúa sobre los ejes ya transformados por las anteriores."},
 {t:"escribe", p:"Con propiedades individuales (no <code>transform</code>), escribe la declaración que gira un elemento 180 grados sobre el eje Y",
  sol:["rotate: y 180deg","rotate:y 180deg","rotate: 0 1 0 180deg"], pista:"rotate: eje ángulo",
  why:"Para ver el 3D, el padre necesita perspective; y para las cartas que se voltean, backface-visibility: hidden en las caras."},
 {t:"opcion", p:"Quieres animar por separado la escala en :hover y un desplazamiento de entrada, sin que uno pise al otro. ¿Qué usas?",
  ops:["Dos transform en la misma regla","Las propiedades individuales scale y translate, que son independientes","margin y width","Dos elementos anidados obligatoriamente"],
  ok:1, why:"Con una sola propiedad transform, el hover reemplazaría el transform entero de la animación. scale y translate son propiedades distintas y conviven."}
]},

/* =============== U9 L3 =============== */
{
id:"cs9n3",
titulo:"@keyframes, rendimiento y movimiento reducido",
claves:["@keyframes define los pasos; animation los aplica con duración, repeticiones, dirección y fill-mode","Anima transform y opacity: el compositor las mueve sin recalcular el layout ni repintar; will-change con moderación","Respeta prefers-reduced-motion; y las animaciones ligadas al scroll (animation-timeline) se hacen sin JavaScript"],
pasos:[
 {t:"info", eti:"Animaciones", h:"@keyframes y animation",
  c:`<div class="termbox">@keyframes aparecer {
  from { opacity: 0; translate: 0 8px; }
  to   { opacity: 1; translate: 0 0; }
}
@keyframes latido {
  0%, 100% { scale: 1; }
  50%      { scale: 1.08; }
}
.toast { animation: aparecer .25s ease-out both; }
.corazon { animation: latido 1.2s ease-in-out infinite; }

/* por partes */
.cargando {
  animation-name: girar;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;   /* o un número */
  animation-direction: alternate;         /* normal | reverse | alternate */
  animation-fill-mode: both;              /* conserva el primer fotograma en el retardo y el último al acabar */
  animation-delay: 200ms;
}
.cargando:hover { animation-play-state: paused; }</div>
<p><code>fill-mode: forwards</code> mantiene el estado final al acabar; sin él, el elemento vuelve de golpe a sus estilos normales.</p>`},
 {t:"info", eti:"Rendimiento", h:"Qué propiedades animar",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">coste de animar cada propiedad (60 fotogramas por segundo = 16 ms por fotograma)</div><table class="dg-tabla"><thead><tr><th>propiedad</th><th>obliga a</th><th>coste</th></tr></thead><tbody>
<tr><td>width, height, top, left, margin, padding, font-size</td><td>layout + paint + composite</td><td>alto: recoloca la página</td></tr>
<tr><td>color, background, box-shadow, border-radius</td><td>paint + composite</td><td>medio: repinta</td></tr>
<tr><td>transform, opacity (y filter en muchos casos)</td><td>solo composite</td><td>bajo: lo hace la GPU</td></tr>
</tbody></table></div>
<div class="termbox">/* mal: anima left, recalcula el layout 60 veces por segundo */
.panel { transition: left .3s; }
/* bien: el mismo efecto con translate */
.panel { transition: translate .3s; }

.menu-que-se-va-a-abrir { will-change: transform; }   /* promueve a capa propia ANTES de animar */</div>
<p><code>will-change</code> reserva memoria en la GPU: úsalo solo en elementos concretos que vas a animar y, si puedes, quítalo al terminar. Ponerlo en todo empeora el rendimiento.</p>`},
 {t:"info", eti:"Personas y scroll", h:"Movimiento reducido y animaciones con el scroll",
  c:`<div class="termbox">/* opción «sin movimiento por defecto»: solo animas si el usuario no ha pedido reducirlo */
@media (prefers-reduced-motion: no-preference) {
  .heroe { animation: aparecer .6s ease-out both; }
}
/* reducir no es quitar todo: un fundido suele estar bien; lo que marea es el desplazamiento y el zoom */
@media (prefers-reduced-motion: reduce) {
  .toast { animation-name: fundido; }
}

/* animaciones ligadas al scroll, sin JavaScript */
@keyframes progreso { from { scale: 0 1; } to { scale: 1 1; } }
.barra-lectura {
  position: fixed; top: 0; left: 0; right: 0; height: 4px;
  transform-origin: left;
  animation: progreso linear both;
  animation-timeline: scroll(root);      /* avanza con el scroll de la página */
}
.tarjeta {
  animation: aparecer linear both;
  animation-timeline: view();            /* avanza mientras entra en la vista */
  animation-range: entry 0% entry 100%;
}</div>
<p>Las animaciones ligadas al scroll todavía no están en todos los navegadores principales: úsalas como mejora, dentro de <code>@supports (animation-timeline: scroll())</code>.</p>`},
 {t:"hueco", p:"Un spinner que gira sin parar a velocidad constante",
  tpl:"@keyframes girar { to { rotate: 1turn; } }\n.spinner { animation: girar 1s ___ ___; }", banco:["linear","infinite","ease","forwards","alternate"], sol:["linear","infinite"],
  why:"Con ease, el giro frenaría y aceleraría en cada vuelta. 1turn es una vuelta completa (360deg)."},
 {t:"opcion", p:"¿Qué pasará? <code>.aviso { animation: aparecer .3s; }</code> con <code>@keyframes aparecer { to { opacity: 0; } }</code>",
  ops:["El aviso se desvanece y se queda invisible","Se desvanece y, al acabar, vuelve a verse de golpe: sin fill-mode forwards no se conserva el último fotograma","No se anima porque falta from","Se queda a media opacidad"],
  ok:1, why:"Si falta from, se usa el valor actual del elemento como inicio. Lo que falta es animation-fill-mode: forwards (o both)."},
 {t:"par", p:"Empareja cada propiedad animada con su coste",
  pares:[["transform: translateX()","Solo composición: el más barato"],["opacity","Solo composición"],["background-color","Repintado"],["width","Layout completo: el más caro"],["top / left","Layout: mejor usar translate"]],
  why:"DevTools, pestaña Performance: si ves bloques morados de «Layout» en cada fotograma de una animación, estás animando una propiedad cara."},
 {t:"opcion", p:"Tu menú lateral se abre animando <code>left</code> de -300px a 0 y en móviles modestos va a tirones. ¿Qué cambias?",
  ops:["Subir la duración","Animar translate (de -100% a 0) en lugar de left","Usar setInterval","will-change: left"],
  ok:1, why:"translate no toca el layout, el compositor lo mueve en la GPU. will-change: left no evita el recálculo del layout."},
 {t:"escribe", p:"Escribe la declaración que pausa una animación mientras el ratón está encima (dentro de un <code>:hover</code>)",
  sol:["animation-play-state: paused","animation-play-state:paused"], pista:"animation-play-state con el valor que la pausa.",
  why:"También se usa para respetar a quien pide menos movimiento: carruseles automáticos que se paran al pasar el ratón o al enfocar."},
 {t:"vf", p:"Respetar <code>prefers-reduced-motion</code> significa eliminar cualquier transición, incluido un simple fundido.",
  ok:false, why:"Lo que causa mareos es el movimiento (desplazamientos, zooms, parallax). Sustituirlos por fundidos suaves suele ser la mejor respuesta."}
]},

/* =============== U9 L4 =============== */
{
id:"cs9n4",
titulo:"View transitions",
claves:["document.startViewTransition() anima entre dos estados del DOM: por defecto, un fundido cruzado","view-transition-name convierte un elemento en compartido: el navegador lo anima de su posición vieja a la nueva","Entre páginas distintas del mismo origen, @view-transition { navigation: auto; } sin JavaScript"],
pasos:[
 {t:"info", eti:"Cómo funciona", h:"Una foto de antes, una de después",
  c:`<div class="dg"><div class="dg-tit">el ciclo de una view transition</div>
<div class="dg-vert">
<div class="dg-caja doble">1. captura del estado viejo<small>el navegador hace una «foto» de la página (y de cada elemento con nombre)</small></div>
<div class="dg-caja acento doble">2. tu función cambia el DOM<small>el navegador no pinta nada mientras tanto</small></div>
<div class="dg-caja doble">3. captura del estado nuevo<small>ahora con el DOM ya cambiado</small></div>
<div class="dg-caja ok doble">4. anima de una a otra<small>con pseudoelementos ::view-transition-* que puedes estilar con CSS</small></div>
</div></div>
<div class="termbox">// JavaScript: envuelve el cambio de DOM
boton.addEventListener("click", () =&gt; {
  if (!document.startViewTransition) return cambiarVista();   // alternativa
  document.startViewTransition(() =&gt; cambiarVista());
});</div>
<div class="termbox">/* CSS: la miniatura de la lista y la foto grande del detalle son «el mismo» elemento */
.lista .producto-7 img  { view-transition-name: foto-producto; }
.detalle img            { view-transition-name: foto-producto; }

::view-transition-group(foto-producto) { animation-duration: .35s; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .2s; }</div>
<p>Las transiciones en la misma página (SPA) están en todos los navegadores principales desde finales de 2025.</p>`},
 {t:"info", eti:"Entre páginas", h:"View transitions entre documentos",
  c:`<div class="termbox">/* en el CSS de las dos páginas (mismo origen) */
@view-transition { navigation: auto; }

.cabecera { view-transition-name: cabecera; }   /* se queda quieta en vez de fundirse */

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none; }
}</div>
<p>Con esa línea, una web de páginas normales (sin framework) navega con transiciones como una app. Llegó primero a Chromium y Safari; en los navegadores que no la entienden simplemente se navega como siempre, así que es una mejora sin riesgo.</p>
<div class="nota ojo"><b class="tit">Nombres únicos</b>Cada <code>view-transition-name</code> debe ser único en la página en el momento de la captura. Si dos elementos visibles comparten nombre, la transición se cancela (y lo verás en la consola).</div>`},
 {t:"orden", p:"Ordena lo que ocurre en una view transition",
  items:["El navegador captura el estado actual","Se ejecuta la función que cambia el DOM","El navegador captura el estado nuevo","Anima entre las dos capturas con pseudoelementos"],
  why:"Mientras la función cambia el DOM, la pantalla se queda congelada en la captura vieja: por eso la función debe ser rápida."},
 {t:"hueco", p:"Haz que la miniatura y la imagen grande se animen como un mismo elemento, y activa las transiciones entre páginas",
  tpl:".miniatura, .foto-grande { ___: foto; }\n@view-transition { navigation: ___; }", banco:["view-transition-name","auto","view-transition","none","smooth"], sol:["view-transition-name","auto"],
  why:"El mismo nombre en el estado viejo y en el nuevo le dice al navegador que es «el mismo» elemento, y anima su tamaño y posición."},
 {t:"opcion", p:"¿Qué pasará? Pones <code>view-transition-name: tarjeta</code> a todas las tarjetas de una lista y lanzas una transición",
  ops:["Todas se animan a la vez","La transición se cancela: el nombre debe ser único entre los elementos visibles","Solo se anima la primera","Se animan en fila"],
  ok:1, why:"Pon un nombre distinto a cada una (tarjeta-1, tarjeta-2…) o, en navegadores que lo admiten, view-transition-name: match-element."},
 {t:"vf", p:"Si el navegador no soporta view transitions, la navegación entre páginas deja de funcionar.",
  ok:false, why:"@view-transition simplemente se ignora y se navega como siempre. En JavaScript, comprueba document.startViewTransition antes de usarlo."},
 {t:"escribe", p:"Escribe el pseudoelemento que controla la animación del grupo de un elemento llamado <code>foto</code>",
  sol:["::view-transition-group(foto)","view-transition-group(foto)"], pista:"::view-transition-…(nombre)",
  why:"El grupo anima tamaño y posición; dentro, ::view-transition-old(foto) y ::view-transition-new(foto) hacen el fundido del contenido."},
 {t:"opcion", p:"¿Cuál es el uso más natural de las view transitions entre documentos?",
  ops:["Animar un botón al pasar el ratón","Que una web multipágina (blog, tienda) tenga transiciones suaves al navegar, sin convertirla en SPA","Sustituir a @keyframes","Cargar páginas más rápido"],
  ok:1, why:"No acelera la carga: la anima. Pero da a una web tradicional la sensación de continuidad de una app."}
]}

]});
