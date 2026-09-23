window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "Maestría en HTML",
resumen: "Decisiones de diseño con criterio, auditoría y reescritura de una página real, errores de producción y simulacro de entrevista",
nivel: "Maestro",
color: "#c95535",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"ht9n1",
titulo:"Elegir el elemento correcto",
claves:["Primero el elemento nativo con la semántica y el comportamiento que necesitas; ARIA y JavaScript solo para lo que falte","Navegar es a, actuar es button; datos en filas es table, colocar cajas es CSS","Cada widget propio es una deuda: teclado, foco, anuncios, móviles, pruebas"],
pasos:[
 {t:"info", eti:"Criterio", h:"Un árbol de decisión que usan los sénior",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">necesidad → elemento</div><table class="dg-tabla"><thead><tr><th>necesitas…</th><th>usa</th><th>no uses</th></tr></thead><tbody>
     <tr><td>Ir a otra URL</td><td>a href</td><td>button con location.href</td></tr>
     <tr><td>Ejecutar una acción</td><td>button type="button"</td><td>a href="#", div onclick</td></tr>
     <tr><td>Mostrar u ocultar un bloque de contenido</td><td>details / summary</td><td>div + JS de acordeón</td></tr>
     <tr><td>Bloquear hasta que respondan</td><td>dialog + showModal()</td><td>div con z-index</td></tr>
     <tr><td>Menú flotante que se cierra al pulsar fuera</td><td>popover</td><td>librería de dropdown</td></tr>
     <tr><td>Elegir una de pocas opciones visibles</td><td>radios en fieldset</td><td>botones con estado a mano</td></tr>
     <tr><td>Elegir una de muchas</td><td>select (o input + datalist si se escribe)</td><td>combobox propio sin necesidad</td></tr>
     <tr><td>Datos con filas y columnas</td><td>table con th</td><td>divs con grid</td></tr>
     <tr><td>Icono con significado</td><td>svg con role="img" y title, o img con alt</td><td>fuente de iconos sin texto</td></tr>
     <tr><td>Imagen de contenido</td><td>img / picture</td><td>background-image de CSS</td></tr></tbody></table></div>
     <p>La pregunta que hace un sénior antes de escribir un componente: «¿qué me da gratis el navegador?». Un <code>select</code> nativo funciona con teclado, lector, móvil (con su selector propio) y autocompletado; un desplegable a medida tiene que reimplementarlo todo. Si el problema es solo el aspecto, se ataca con CSS (el <code>select</code> personalizable con <code>appearance: base-select</code> está llegando a los navegadores).</p>`},
 {t:"opcion", p:"El equipo de diseño quiere pestañas (tabs) en la ficha de producto. ¿Qué planteas primero?",
  ops:["Una librería de pestañas cualquiera","Si de verdad hacen falta: a menudo secciones con títulos, o details, resuelven lo mismo sin ocultar contenido; si sí, el patrón ARIA de tabs completo (roles, flechas, aria-selected)","Divs con display: none y onclick","Un iframe por pestaña"],
  ok:1, why:"Las pestañas no tienen elemento nativo: hacerlas bien exige roving tabindex, roles tablist/tab/tabpanel y estados. Muchas veces el contenido se lee mejor sin esconderlo."},
 {t:"par", p:"Empareja cada necesidad con el elemento nativo",
  pares:[["Aviso de cookies que no bloquea","popover=\"manual\" o una región normal"],["«¿Seguro que quieres salir sin guardar?»","dialog con showModal()"],["Preguntas frecuentes","details y summary"],["Comparativa de planes con precios","table"],["Filtro de talla entre 4 opciones","Radios en un fieldset"]],
  why:"El aviso de cookies que bloquea toda la página es una mala práctica y además suele tapar el foco (WCAG 2.4.11)."},
 {t:"opcion", p:"La tarjeta de un producto tiene enlace a la ficha y un botón «Añadir al carrito». ¿Cómo haces clicable toda la tarjeta?",
  ops:["Envolver toda la tarjeta en un &lt;a&gt;, botón incluido","Enlazar solo el título y ampliar su zona de clic a toda la tarjeta con un ::after posicionado; el botón queda encima","onclick en el div de la tarjeta","Un &lt;button&gt; que envuelve todo"],
  ok:1, why:"Un botón dentro de un enlace es HTML inválido y un caos para el lector (¿qué hace el clic?). El truco del pseudoelemento mantiene un solo enlace con nombre claro y el botón independiente."},
 {t:"vf", p:"Un menú de navegación de un sitio web debe usar <code>role=\"menu\"</code> y <code>role=\"menuitem\"</code>.",
  ok:false, why:"Esos roles son para menús de aplicación (como el de un editor) y obligan a navegar con flechas. Un menú de sitio es <code>nav</code> con una lista de enlaces; los submenús, botones con aria-expanded."},
 {t:"opcion", p:"Necesitas mostrar un logo que también es el enlace a la portada. ¿Qué es mejor?",
  ops:["&lt;div class=\"logo\" onclick=\"location='/'\"&gt;&lt;/div&gt; con background-image","&lt;a href=\"/\"&gt;&lt;img src=\"logo.svg\" alt=\"Catappa, inicio\"&gt;&lt;/a&gt;","&lt;a href=\"/\"&gt;&lt;img src=\"logo.svg\" alt=\"\"&gt;&lt;/a&gt;","&lt;button&gt;&lt;img src=\"logo.svg\"&gt;&lt;/button&gt;"],
  ok:1, why:"Es navegación (a) y la imagen le da el nombre al enlace. Con alt vacío el enlace se quedaría sin nombre; con un fondo de CSS, también."},
 {t:"escribe", p:"Completa la frase de la primera regla de ARIA: «Si existe un elemento HTML ___, úsalo». (una palabra)",
  sol:["nativo","nativos"],
  pista:"Lo contrario de «hecho a mano».",
  why:"Es la respuesta corta que se espera en cualquier entrevista cuando sale ARIA."},
 {t:"orden", p:"Ordena el proceso para construir un componente interactivo nuevo",
  items:["Buscar un elemento nativo que lo resuelva (o se acerque)","Si no existe, consultar el patrón en la guía de patrones de ARIA (APG)","Implementar roles, estados y soporte completo de teclado","Probar con teclado y al menos un lector de pantalla","Documentarlo y reutilizarlo en lugar de reinventarlo"],
  why:"La ARIA Authoring Practices Guide (APG) del W3C describe teclado y roles de cada patrón: pestañas, combobox, árbol, carrusel…"}
]},

/* =============== U9 L2 =============== */
{
id:"ht9n2",
titulo:"Caso completo: auditar y reescribir una página",
claves:["Se audita en orden: estructura y semántica, formularios, imágenes, head y carga","Cada problema se traduce en un arreglo concreto y comprobable","La versión buena suele tener menos código que la mala"],
pasos:[
 {t:"info", eti:"El caso", h:"La página heredada",
  c:`<p>Te pasan esta página de suscripción. Funciona «en el portátil del jefe», pero tiene quejas de accesibilidad, de SEO y de móviles:</p>
     <div class="termbox">&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Home&lt;/title&gt;
  &lt;meta name="viewport" content="width=device-width, maximum-scale=1"&gt;
  &lt;script src="jquery.js"&gt;&lt;/script&gt;&lt;script src="app.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div class="header"&gt;&lt;img src="logo.png"&gt;&lt;/div&gt;
  &lt;div class="title"&gt;Boletín semanal&lt;/div&gt;
  &lt;img src="portada.jpg" loading="lazy"&gt;
  &lt;div class="form"&gt;
    &lt;input placeholder="Email"&gt;
    &lt;div class="btn" onclick="enviar()"&gt;Suscribirme&lt;/div&gt;
    &lt;span style="color:red" id="err"&gt;&lt;/span&gt;
  &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</div>`},
 {t:"info", eti:"La solución", h:"La misma página, bien hecha",
  c:`<div class="termbox">&lt;!DOCTYPE html&gt;
&lt;html lang="es"&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
  &lt;title&gt;Boletín semanal de desarrollo web · Catappa&lt;/title&gt;
  &lt;meta name="description" content="Cada lunes, cinco enlaces útiles de HTML, CSS y accesibilidad."&gt;
  &lt;script src="app.js" type="module"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;&lt;a href="/"&gt;&lt;img src="logo.svg" alt="Catappa, inicio" width="120" height="40"&gt;&lt;/a&gt;&lt;/header&gt;
  &lt;main&gt;
    &lt;h1&gt;Boletín semanal&lt;/h1&gt;
    &lt;img src="portada.avif" alt="" width="1200" height="600" fetchpriority="high"&gt;
    &lt;form action="/suscripcion" method="post"&gt;
      &lt;label for="email"&gt;Tu email&lt;/label&gt;
      &lt;input id="email" name="email" type="email" required autocomplete="email"
             aria-describedby="err"&gt;
      &lt;p id="err" role="status"&gt;&lt;/p&gt;
      &lt;button&gt;Suscribirme&lt;/button&gt;
    &lt;/form&gt;
  &lt;/main&gt;
&lt;/body&gt;
&lt;/html&gt;</div>
     <p>Sin JavaScript, el formulario ya funciona (se envía y valida el email); <code>app.js</code> solo lo mejora. La portada es decorativa (el título ya dice lo que hay), por eso <code>alt=""</code>.</p>`},
 {t:"opcion", p:"En la página heredada, ¿qué problema impide por completo suscribirse con el teclado?",
  ops:["El title «Home»","El botón es un div con onclick: no recibe foco ni responde a Intro","Falta el charset","La imagen no tiene alt"],
  ok:1, why:"Los demás empeoran la experiencia; este la bloquea. En una auditoría, lo que impide completar la tarea va primero."},
 {t:"par", p:"Empareja cada problema de la página heredada con su arreglo",
  pares:[["Sin DOCTYPE ni lang","<!DOCTYPE html> y <html lang=\"es\">"],["maximum-scale=1 en el viewport","initial-scale=1, sin bloquear el zoom"],["Scripts que bloquean en el head","type=\"module\" o defer"],["loading=\"lazy\" en la portada","Quitarlo y añadir fetchpriority=\"high\""],["El placeholder como única etiqueta","Un label asociado al input"],["Título en un div","Un h1"]],
  why:"Cada arreglo es pequeño; juntos cambian la página para buscadores, lectores de pantalla y Core Web Vitals."},
 {t:"hueco", p:"Reescribe el campo del formulario heredado",
  tpl:'<label ___="email">Tu email</label>\n<input id="email" ___="email" type="email" required autocomplete="email">',
  banco:["for","name","id","placeholder","value","aria-label"], sol:["for","name"],
  why:"Sin name el valor no se envía; sin label (for → id) el campo no tiene nombre accesible."},
 {t:"orden", p:"Ordena la auditoría de la página de más a menos impacto",
  items:["Lo que bloquea la tarea: el botón div y el campo sin etiqueta","Estructura: DOCTYPE, lang, landmarks y h1","El head: charset, viewport sin bloqueo de zoom, title y description","Carga: scripts con defer o module, imagen principal sin lazy y con dimensiones","Mejoras: formatos modernos, autocompletado, mensajes de error"],
  why:"Primero lo que impide usarla, después lo que la hace entendible y encontrable, y al final lo que la hace rápida y agradable."},
 {t:"vf", p:"En la versión buena, el mensaje de error va en un <code>&lt;p role=\"status\"&gt;</code> que existe desde el principio aunque esté vacío.",
  ok:true, why:"Las regiones vivas deben estar en el DOM antes de que cambie su contenido; así el lector anuncia el error cuando app.js lo escribe."},
 {t:"escribe", p:"La portada de la página heredada es decorativa. ¿Qué alt le pones? (escribe el atributo completo)",
  sol:["alt=\"\"","alt=''","alt"],
  pista:"Vacío, pero presente.",
  why:"El h1 ya dice lo que hay: repetirlo en el alt haría que el lector lo leyera dos veces."},
 {t:"opcion", p:"Tras los cambios, ¿qué pruebas haces antes de dar por buena la página?",
  ops:["Solo abrirla en Chrome","Validador de HTML, axe o Lighthouse, recorrido con teclado, lector de pantalla y prueba a 320 px y al 200 % de zoom","Preguntar al jefe","Ninguna, el código es correcto"],
  ok:1, why:"Cada prueba detecta cosas distintas, y juntas llevan menos de media hora en una página así."}
]},

/* =============== U9 L3 =============== */
{
id:"ht9n3",
titulo:"Errores de producción",
claves:["Síntoma → causa en el HTML → arreglo → prueba automática para que no vuelva","Los errores caros son silenciosos: noindex, CLS, formularios que no envían, foco perdido","Todo lo que se pueda comprobar en CI (validador, axe, Lighthouse CI, tests) se comprueba"],
pasos:[
 {t:"info", eti:"Casos reales", h:"Síntomas y causas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">errores que llegan a producción</div><table class="dg-tabla"><thead><tr><th>síntoma</th><th>causa</th><th>arreglo</th></tr></thead><tbody>
     <tr><td>El tráfico orgánico cae a cero</td><td>noindex del entorno de pruebas</td><td>Configuración por entorno + test que lo busque</td></tr>
     <tr><td>Al abrir el filtro, el formulario se envía</td><td>button sin type dentro del form</td><td>type="button"</td></tr>
     <tr><td>Tildes rotas solo en algunas páginas</td><td>El servidor envía otro charset en Content-Type</td><td>charset=utf-8 en la cabecera y en la meta</td></tr>
     <tr><td>CLS alto en móvil</td><td>Imágenes, anuncios o iframes sin espacio reservado</td><td>width/height o aspect-ratio</td></tr>
     <tr><td>El lector de pantalla no lee nada tras cerrar un modal</td><td>aria-hidden="true" en el contenedor principal que nadie quitó</td><td>dialog nativo (o inert gestionado)</td></tr>
     <tr><td>Los gestores de contraseñas no rellenan el login</td><td>autocomplete="off" o nombres raros</td><td>autocomplete="username" y "current-password"</td></tr>
     <tr><td>La vista previa en WhatsApp sale sin imagen</td><td>og:image relativa o inyectada con JavaScript</td><td>URL absoluta en el HTML del servidor</td></tr>
     <tr><td>Pulsar una etiqueta enfoca otro campo</td><td>id duplicados al repetir un componente</td><td>id únicos generados por instancia</td></tr></tbody></table></div>`},
 {t:"opcion", p:"Tras publicar un rediseño, el CLS pasa de 0,02 a 0,3. En el diff ves que las imágenes se generan con un componente nuevo. ¿Qué compruebas?",
  ops:["Que tengan alt","Que el componente siga poniendo width y height (o aspect-ratio) en las img","Que sean AVIF","Que tengan loading=\"lazy\""],
  ok:1, why:"Un componente que «limpia» atributos es un clásico. Lighthouse CI con un umbral de CLS lo habría parado antes de producción."},
 {t:"opcion", p:"Usuarios de lector de pantalla dicen que, tras cerrar el aviso de novedades, «la página se queda muda». ¿Qué sospechas?",
  ops:["Un problema de contraste","El modal casero puso aria-hidden=\"true\" en el resto de la página al abrirse y no lo quita al cerrarse","Falta el title","El lector está mal configurado"],
  ok:1, why:"Es exactamente lo que dialog con showModal() evita: gestiona la inercia del resto de la página por ti, abriendo y cerrando."},
 {t:"par", p:"Empareja cada síntoma con su causa más probable",
  pares:[["Formulario que se envía al pulsar «Mostrar filtros»","Un button sin type=\"button\""],["El gestor de contraseñas no ofrece la clave guardada","autocomplete=\"off\" en el login"],["La página no sale en Google","Un noindex olvidado"],["Clic en la etiqueta «Email» enfoca otro campo","id duplicados"],["Vista previa sin imagen al compartir","og:image relativa o añadida con JS"]],
  why:"Casi todos se detectan con pruebas automáticas baratas: validador (id duplicados), test de noindex, Lighthouse, depuradores de Open Graph."},
 {t:"hueco", p:"Arregla el login para que los gestores de contraseñas funcionen",
  tpl:'<input name="usuario" autocomplete="___">\n<input name="clave" type="password" autocomplete="___">',
  banco:["username","current-password","new-password","off","email","password"], sol:["username","current-password"],
  why:"<code>current-password</code> en el login y <code>new-password</code> en registro y cambio de clave. Es también lo que pide WCAG 3.3.8."},
 {t:"vf", p:"Un componente de campo reutilizable con <code>id=\"email\"</code> fijo en su plantilla puede usarse dos veces en la misma página sin problemas.",
  ok:false, why:"Dos id iguales: el segundo label apunta al primer input, aria-describedby lee el error equivocado y getElementById devuelve el primero. Genera id únicos por instancia (en React, useId)."},
 {t:"orden", p:"Ordena la respuesta a un incidente de «nadie puede enviar el formulario de contacto»",
  items:["Reproducirlo (navegador, teclado, móvil) y mirar la consola y la pestaña Red","Encontrar la causa en el HTML o el JS (un button sin type, un required en un campo oculto…)","Arreglar y desplegar","Añadir una prueba automática que envíe el formulario","Contar en el post mortem qué faltaba para detectarlo antes"],
  why:"Un clásico: un campo required dentro de una sección oculta. El navegador bloquea el envío, intenta enfocar el campo, no puede, y la persona no ve nada."},
 {t:"escribe", p:"Las tildes salen rotas aunque tu HTML tiene <code>&lt;meta charset=\"utf-8\"&gt;</code>. ¿Qué cabecera HTTP del servidor revisas?",
  sol:["Content-Type","content-type","Content-Type: text/html; charset=utf-8"],
  pista:"La que dice el tipo del documento.",
  why:"La cabecera tiene prioridad sobre la meta. Si el servidor manda <code>charset=iso-8859-1</code>, el navegador le hace caso."}
]},

/* =============== U9 L4 =============== */
{
id:"ht9n4",
titulo:"Simulacro de entrevista de HTML",
claves:["Responde con el porqué y un ejemplo, no con definiciones de memoria","Las preguntas de HTML van de semántica y accesibilidad, carga de recursos, formularios y seguridad","Si no sabes algo, di cómo lo comprobarías"],
pasos:[
 {t:"info", eti:"Cómo responder", h:"Lo que busca quien entrevista",
  c:`<p>En frontend, las preguntas de HTML filtran rápido: quien solo ha usado frameworks suele fallar en semántica, formularios y accesibilidad. Estructura de una buena respuesta:</p>
     <div class="dg"><div class="dg-tit">respuesta en tres tiempos</div>
       <div class="dg-flujo">
         <div class="dg-caja acento doble">Qué es<small>una frase precisa</small></div>
         <div class="dg-caja doble">Por qué importa<small>usuarios, buscadores, rendimiento</small></div>
         <div class="dg-caja ok doble">Ejemplo o error real<small>«me pasó que…»</small></div>
       </div></div>
     <div class="nota dato"><b class="tit">Frase de entrevista</b>«Empiezo por el elemento nativo porque me da teclado, foco y accesibilidad gratis; ARIA lo reservo para patrones que HTML no tiene, como las pestañas.»</div>`},
 {t:"opcion", p:"«¿Qué diferencia hay entre <code>defer</code> y <code>async</code>?» ¿Cuál es la mejor respuesta?",
  ops:["Son lo mismo","Ambos descargan sin bloquear el parser; defer ejecuta en orden al acabar de analizar el HTML y async en cuanto llega, sin orden. Uso defer para mi código y async para scripts independientes como analítica","async es más moderno que defer","defer es para CSS y async para JS"],
  ok:1, why:"Dice qué hace cada uno, la diferencia clave (orden y momento) y cuándo usar cada cual."},
 {t:"opcion", p:"«¿Por qué importa el HTML semántico si con divs se ve igual?»",
  ops:["Por moda","Porque el DOM alimenta el árbol de accesibilidad y a los buscadores: los landmarks, títulos y controles nativos permiten navegar con lector, dan comportamiento de teclado gratis y mejoran el SEO y el mantenimiento","Porque los divs están obsoletos","Porque ocupa menos"],
  ok:1, why:"Menciona a quién beneficia (lectores de pantalla, buscadores, desarrolladores) y el mecanismo (árbol de accesibilidad), no solo «es buena práctica»."},
 {t:"par", p:"Empareja cada pregunta típica con la idea clave de la respuesta",
  pares:[["¿Para qué sirve DOCTYPE?","Activar el modo estándar y evitar el modo quirks"],["¿Qué es el DOM?","El árbol de objetos que el navegador construye a partir del HTML"],["¿Cuándo alt vacío?","Imágenes decorativas, para que el lector las salte"],["¿Qué hace data-*?","Guardar datos propios en elementos, accesibles con dataset"],["¿GET o POST en un form?","GET para leer y compartir, POST para acciones con efecto"]],
  why:"Son las preguntas de calentamiento; responderlas con precisión y un ejemplo da confianza para las difíciles."},
 {t:"escribe", p:"«¿Qué propiedad de JavaScript lee el atributo <code>data-id-curso</code> de un elemento?» Escribe la expresión sobre <code>el</code>",
  sol:["el.dataset.idCurso","el.dataset[\"idCurso\"]","el.getAttribute(\"data-id-curso\")"],
  pista:"dataset convierte los guiones a camelCase.",
  why:"data-id-curso → dataset.idCurso. Los valores siempre son cadenas; y no guardes ahí nada secreto: se ve en el HTML."},
 {t:"opcion", p:"«¿Cómo harías accesible un modal?»",
  ops:["Con role=\"dialog\" basta","Con &lt;dialog&gt; y showModal(): foco dentro al abrir, resto inerte, Escape cierra, foco de vuelta al cerrar; un título asociado con aria-labelledby y probado con teclado y lector","Con z-index alto","Poniendo tabindex en todo"],
  ok:1, why:"Nombra el elemento nativo y los cuatro comportamientos clave; si te piden hacerlo sin dialog, esos cuatro puntos son lo que tendrías que implementar."},
 {t:"opcion", p:"«¿Cómo evitas el XSS al pintar datos del usuario?»",
  ops:["Con innerHTML y cuidado","Tratándolos como texto (textContent o el escapado por defecto del framework); si hay que admitir HTML, sanitizándolo, y además CSP","Validando en el cliente","Con HTTPS"],
  ok:1, why:"HTTPS protege el transporte, no la inserción. La validación en el cliente se salta. La defensa es no interpretar como HTML lo que es texto."},
 {t:"vf", p:"En una entrevista, si no sabes la respuesta, es mejor inventar algo que parezca convincente.",
  ok:false, why:"Di lo que sí sabes y cómo lo comprobarías («lo miraría en la especificación o en MDN, y lo probaría en DevTools»). Inventar se nota y resta mucho más."},
 {t:"orden", p:"Ordena tu respuesta a «Cuéntame cómo carga el navegador una página»",
  items:["Petición HTTP y respuesta con el HTML","Análisis del HTML y construcción del DOM; el escáner de precarga descubre recursos","El CSS construye el CSSOM y bloquea el pintado; los scripts sin defer bloquean el análisis","Árbol de renderizado, layout y pintado","Scripts diferidos, DOMContentLoaded y después load"],
  why:"Con este orden puedes profundizar donde te pregunten: parser, bloqueo, Core Web Vitals."}
]}

]});
