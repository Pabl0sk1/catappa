window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "HTML desde cero",
resumen: "Qué es HTML, cómo lo convierte el navegador en una página, la estructura del documento, el head, el texto con significado y las listas",
nivel: "Fundamentos",
color: "#f0875a",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"hc1l1",
titulo:"Qué es HTML: elementos, etiquetas y atributos",
claves:["HTML describe la estructura y el significado del contenido, no su aspecto","Un elemento = etiqueta de apertura + contenido + etiqueta de cierre; los elementos vacíos no se cierran","Los atributos dan información extra; los booleanos se activan solo con estar presentes"],
pasos:[
 {t:"info", eti:"Empezamos", h:"El esqueleto de la web",
  c:`<p><b>HTML</b> (HyperText Markup Language) es el lenguaje que describe <b>qué hay</b> en una página: un título, un párrafo, una imagen, un formulario. No es un lenguaje de programación: no tiene variables ni bucles; es un lenguaje de <b>marcado</b>. La norma vigente es el <b>HTML Living Standard</b> del WHATWG, que se actualiza continuamente (ya no hay «HTML6»: HTML5 fue la última versión con número).</p>
     <div class="termbox">&lt;h1&gt;Mis tareas&lt;/h1&gt;
&lt;p&gt;Tienes &lt;strong&gt;3 tareas&lt;/strong&gt; pendientes.&lt;/p&gt;</div>
     <p>Cada elemento se marca con una <b>etiqueta de apertura</b> (<code>&lt;p&gt;</code>), su <b>contenido</b> y una <b>etiqueta de cierre</b> (<code>&lt;/p&gt;</code>). CSS se encarga del aspecto y JavaScript del comportamiento.</p>`},
 {t:"info", eti:"Anatomía", h:"Las piezas de un elemento",
  c:`<div class="dg"><div class="dg-tit">anatomía de un elemento</div>
       <div class="dg-flujo">
         <div class="dg-caja acento doble"><code>&lt;a</code><small>apertura: nombre del elemento</small></div>
         <div class="dg-caja doble"><code>href="/cursos"</code><small>atributo: nombre="valor"</small></div>
         <div class="dg-caja ok doble"><code>Cursos</code><small>contenido</small></div>
         <div class="dg-caja acento doble"><code>&lt;/a&gt;</code><small>cierre</small></div>
       </div></div>
     <ul><li><b>Elementos vacíos</b> (<i>void</i>): no tienen contenido ni cierre: <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;hr&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;meta&gt;</code>, <code>&lt;link&gt;</code>. La barra final (<code>&lt;br /&gt;</code>) se admite pero no hace nada en HTML.</li>
     <li><b>Anidamiento</b>: los elementos se cierran en orden inverso al que se abren, como paréntesis: <code>&lt;p&gt;&lt;em&gt;…&lt;/em&gt;&lt;/p&gt;</code>.</li>
     <li><b>Atributos booleanos</b>: basta con que estén: <code>&lt;input disabled&gt;</code>. Escribir <code>disabled="false"</code> <b>también</b> lo desactiva.</li>
     <li>Etiquetas y atributos no distinguen mayúsculas, pero la convención es escribirlos en minúscula. Comentarios: <code>&lt;!-- así --&gt;</code>.</li>
     <li>Atributos globales que valen para cualquier elemento: <code>id</code> (único en la página), <code>class</code>, <code>lang</code>, <code>title</code>, <code>hidden</code>, <code>data-*</code>.</li></ul>`},
 {t:"par", p:"Empareja cada lenguaje con su papel en una página",
  pares:[["HTML","Estructura y significado del contenido"],["CSS","Aspecto visual: colores, tamaños, disposición"],["JavaScript","Comportamiento e interactividad"]],
  why:"Separar las tres capas hace las páginas más fáciles de mantener, y una página con buen HTML se puede usar incluso si el CSS o el JavaScript fallan."},
 {t:"opcion", p:"¿Qué es HTML?",
  ops:["Un lenguaje de programación","Un lenguaje de marcado que describe la estructura del contenido","Un servidor web","Un tipo de base de datos"],
  ok:1, why:"No calcula nada: etiqueta el contenido para que el navegador sepa qué es cada cosa."},
 {t:"hueco", p:"Completa el enlace a la página de cursos",
  tpl:'<a ___="/cursos">Cursos</___>',
  banco:["href","src","a","link","p"], sol:["href","a"],
  why:"El destino de un enlace va en <code>href</code>; <code>src</code> es para recursos incrustados (imágenes, scripts). Y se cierra con el mismo nombre con que se abrió."},
 {t:"opcion", p:"¿Cuál de estos fragmentos está bien anidado?",
  ops:["&lt;p&gt;&lt;strong&gt;Hola&lt;/p&gt;&lt;/strong&gt;","&lt;p&gt;&lt;strong&gt;Hola&lt;/strong&gt;&lt;/p&gt;","&lt;strong&gt;&lt;p&gt;Hola&lt;/strong&gt;&lt;/p&gt;","&lt;p&gt;&lt;strong&gt;Hola&lt;/p&gt;"],
  ok:1, why:"El último en abrirse es el primero en cerrarse. El navegador «arregla» los otros casos, pero cada uno a su manera y a veces no como esperabas."},
 {t:"vf", p:"<code>&lt;button disabled=\"false\"&gt;</code> deja el botón activo.",
  ok:false, why:"Los atributos booleanos funcionan por presencia: si el atributo está, vale verdadero, diga lo que diga su valor. Para activar el botón hay que quitar el atributo."},
 {t:"escribe", p:"¿Cómo se llaman los elementos como <code>&lt;img&gt;</code> o <code>&lt;br&gt;</code>, que no tienen contenido ni etiqueta de cierre? (dos palabras)",
  sol:["elementos vacíos","elementos vacios","vacíos","vacios","void","elementos void","void elements"],
  pista:"En inglés se llaman <i>void elements</i>.",
  why:"Escribir <code>&lt;/img&gt;</code> o <code>&lt;/br&gt;</code> es un error: el primero se ignora y el segundo el navegador lo convierte en otro <code>&lt;br&gt;</code>."}
]},

/* =============== U1 L2 =============== */
{
id:"ht1n1",
titulo:"Del HTML a la pantalla: cómo trabaja el navegador",
claves:["El navegador descarga bytes, los decodifica, los trocea en tokens y construye el DOM","El parser de HTML nunca falla: corrige los errores a su manera","Lo que ves en DevTools es el DOM, no tu fichero: pueden no coincidir"],
pasos:[
 {t:"info", eti:"Por dentro", h:"De los bytes a los píxeles",
  c:`<div class="dg"><div class="dg-tit">el camino de una página</div>
       <div class="dg-vert">
         <div class="dg-caja base doble">Petición HTTP<small>el servidor responde con bytes y un Content-Type: text/html; charset=utf-8</small></div>
         <div class="dg-caja doble">Decodificación<small>bytes → caracteres, según el charset</small></div>
         <div class="dg-caja doble">Tokenización<small>caracteres → etiquetas de apertura, cierre, texto, comentarios</small></div>
         <div class="dg-caja acento doble">Construcción del árbol<small>tokens → DOM (en paralelo, el CSS → CSSOM)</small></div>
         <div class="dg-caja doble">Árbol de renderizado y layout<small>qué se ve y dónde va cada caja</small></div>
         <div class="dg-caja ok doble">Pintado y composición<small>píxeles en pantalla</small></div>
       </div></div>
     <p>El <b>DOM</b> (Document Object Model) es el árbol de objetos que el navegador crea a partir de tu HTML. Es lo que CSS estiliza, lo que JavaScript modifica y lo que el lector de pantalla recorre (a través del <b>árbol de accesibilidad</b>, derivado del DOM).</p>`},
 {t:"info", eti:"Tolerante", h:"El parser nunca da error",
  c:`<p>A diferencia de un compilador, el parser de HTML <b>no se detiene nunca</b>: la especificación dice exactamente cómo recuperarse de cada error. Por eso una página mal escrita «funciona», pero el DOM resultante puede no ser el que imaginabas:</p>
     <div class="termbox">Escribes:  &lt;p&gt;uno&lt;div&gt;dos&lt;/div&gt;&lt;/p&gt;
DOM real:  &lt;p&gt;uno&lt;/p&gt;&lt;div&gt;dos&lt;/div&gt;&lt;p&gt;&lt;/p&gt;

Escribes:  &lt;table&gt;&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;
DOM real:  &lt;table&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;</div>
     <p>Un <code>&lt;p&gt;</code> no puede contener un <code>&lt;div&gt;</code>: el parser cierra el párrafo al ver el div, y el <code>&lt;/p&gt;</code> huérfano crea un párrafo vacío. Además, un <code>&lt;script&gt;</code> clásico <b>detiene</b> la construcción del DOM hasta que se descarga y ejecuta (por eso existen <code>defer</code> y <code>async</code>, que verás más adelante).</p>
     <div class="nota ojo"><b class="tit">Código fuente frente a DOM</b>«Ver código fuente» muestra el fichero que llegó; la pestaña Elementos de DevTools muestra el DOM actual, ya corregido y quizá modificado por JavaScript.</div>`},
 {t:"orden", p:"Ordena lo que hace el navegador con una página",
  items:["Recibe los bytes de la respuesta HTTP","Los decodifica a caracteres con el charset","Los trocea en tokens","Construye el DOM","Calcula el layout","Pinta los píxeles"],
  why:"Si el charset es incorrecto, todo lo demás hereda el error: por eso las tildes rotas se arreglan en el primer paso, no con CSS."},
 {t:"opcion", p:"En la pestaña Elementos ves un <code>&lt;tbody&gt;</code> que tú no escribiste. ¿Por qué?",
  ops:["Lo ha añadido una extensión del navegador","El parser de HTML lo inserta siempre en las tablas que no lo tienen","Es un error de DevTools","Lo añade el servidor"],
  ok:1, why:"Es una de las correcciones automáticas del algoritmo de parsing. Ojo con los selectores CSS como <code>table &gt; tr</code>: no encuentran nada, porque en el DOM hay un tbody en medio."},
 {t:"vf", p:"Si tu HTML tiene un error de sintaxis, el navegador muestra una página de error en lugar del contenido.",
  ok:false, why:"El parser siempre produce un DOM. Eso hace a HTML muy robusto, y también hace que los errores pasen desapercibidos: por eso conviene pasar un validador."},
 {t:"par", p:"Empareja cada estructura con lo que representa",
  pares:[["DOM","Árbol de nodos construido a partir del HTML"],["CSSOM","Árbol de reglas construido a partir del CSS"],["Árbol de accesibilidad","Lo que recorren los lectores de pantalla"],["Layout","Tamaño y posición de cada caja"],["Paint","Convertir las cajas en píxeles"]],
  why:"El árbol de accesibilidad sale del DOM: si el HTML no tiene semántica, el lector de pantalla no tiene nada útil que leer."},
 {t:"opcion", p:"Escribes <code>&lt;p&gt;uno&lt;div&gt;dos&lt;/div&gt;&lt;/p&gt;</code>. ¿Cuántos elementos <code>p</code> hay en el DOM?",
  ops:["Uno, que contiene el div","Dos: uno con «uno» y otro vacío tras el div","Ninguno: el parser lo borra","Uno sin el div"],
  ok:1, why:"El div cierra el párrafo abierto y el <code>&lt;/p&gt;</code> sin pareja genera un <code>&lt;p&gt;&lt;/p&gt;</code> vacío. Un párrafo solo admite contenido de texto y elementos en línea."},
 {t:"escribe", p:"¿Qué siglas tiene el árbol de objetos que construye el navegador a partir del HTML?",
  sol:["DOM","document object model"],
  pista:"Document Object Model.",
  why:"Cuando JavaScript hace <code>document.querySelector(...)</code>, busca en el DOM, no en el fichero."}
]},

/* =============== U1 L3 =============== */
{
id:"hc1l2",
titulo:"La estructura de un documento",
claves:["&lt;!DOCTYPE html&gt;, &lt;html lang&gt;, &lt;head&gt; y &lt;body&gt; forman el esqueleto","Sin DOCTYPE el navegador entra en modo quirks y renderiza distinto","lang dice el idioma a lectores de pantalla, traductores y buscadores"],
pasos:[
 {t:"info", eti:"El esqueleto", h:"Un documento completo",
  c:`<div class="termbox">&lt;!DOCTYPE html&gt;
&lt;html lang="es"&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;title&gt;Mis tareas&lt;/title&gt;
    &lt;link rel="stylesheet" href="estilos.css"&gt;
    &lt;script src="app.js" defer&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Mis tareas&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</div>
     <div class="dg dg-arbol"><div class="dg-tit">árbol del documento</div><div class="rama" style="--n:0"><span class="nom carpeta">html</span><span class="coment">raíz, con lang</span></div><div class="rama" style="--n:1"><span class="nom carpeta">head</span><span class="coment">información sobre la página (no se ve)</span></div><div class="rama" style="--n:2"><span class="nom">meta, title, link, script</span></div><div class="rama" style="--n:1"><span class="nom carpeta">body</span><span class="coment">todo lo que se ve</span></div><div class="rama" style="--n:2"><span class="nom">h1, p, img…</span></div></div>`},
 {t:"info", eti:"Los detalles", h:"DOCTYPE y lang",
  c:`<ul><li><code>&lt;!DOCTYPE html&gt;</code> no es una etiqueta: le dice al navegador que use el <b>modo estándar</b>. Sin él entra en <b>modo quirks</b>, que imita errores de navegadores de los años 90 (el modelo de caja y los tamaños de tabla cambian). Debe ser lo primero del fichero.</li>
     <li><code>lang="es"</code> en el <code>&lt;html&gt;</code>: el lector de pantalla elige la voz y la pronunciación, el traductor sabe de qué idioma parte y el navegador separa bien las sílabas (<code>hyphens: auto</code>). Un fragmento en otro idioma lleva su propio <code>lang</code>: <code>&lt;span lang="en"&gt;deploy&lt;/span&gt;</code>.</li>
     <li><code>&lt;html&gt;</code>, <code>&lt;head&gt;</code> y <code>&lt;body&gt;</code> son técnicamente opcionales (el parser los crea), pero se escriben siempre: dejan claro dónde va cada cosa y permiten poner <code>lang</code>.</li></ul>`},
 {t:"par", p:"Empareja cada parte con su función",
  pares:[["<!DOCTYPE html>","Activa el modo estándar"],['<html lang="es">',"Raíz del documento e idioma del contenido"],['<meta charset="utf-8">',"Codificación: tildes y eñes correctas"],['<meta name="viewport">',"Que la página se adapte al ancho del móvil"],["<title>","Texto de la pestaña y del resultado en buscadores"]],
  why:"Sin el viewport, los móviles muestran la página como si fuera de escritorio, diminuta."},
 {t:"orden", p:"Ordena las etiquetas tal como aparecen en un documento",
  items:["<!DOCTYPE html>",'<html lang="es">',"<head> con los metadatos","<body> con el contenido visible","</html>"],
  why:"head antes que body: primero la información sobre la página y luego la página."},
 {t:"opcion", p:"Las tildes de tu página salen como símbolos raros (Ã¡). ¿Qué falta?",
  ops:["Un CSS","La etiqueta &lt;meta charset=\"utf-8\"&gt; (y guardar el fichero en UTF-8)","JavaScript","Un servidor"],
  ok:1, why:"Es el problema de codificación más común: el fichero está en UTF-8 pero el navegador lo lee como Windows-1252. Lo ideal es que el servidor también lo diga en la cabecera <code>Content-Type</code>."},
 {t:"hueco", p:"Completa el inicio de un documento en español y en UTF-8",
  tpl:'<!DOCTYPE html>\n<html ___="es">\n<head>\n  <meta ___="utf-8">',
  banco:["lang","charset","language","encoding","idioma"], sol:["lang","charset"],
  why:"<code>lang</code> es un atributo global y <code>charset</code> es un atributo de <code>meta</code>. Los nombres «language» o «encoding» no existen en HTML."},
 {t:"vf", p:"Si quitas <code>&lt;!DOCTYPE html&gt;</code>, la página se ve exactamente igual.",
  ok:false, why:"Entra en modo quirks: por ejemplo, las alturas en porcentaje y el tamaño de letra de las tablas se calculan distinto. Muchas «rarezas de CSS» son en realidad un DOCTYPE olvidado."},
 {t:"escribe", p:"Escribe la declaración que debe ir en la primera línea de todo documento HTML moderno",
  sol:["<!DOCTYPE html>","<!doctype html>"],
  pista:"Empieza por &lt;! y no lleva versión.",
  why:"No distingue mayúsculas. Las declaraciones largas de HTML 4 o XHTML con URL ya no hacen falta."}
]},

/* =============== U1 L4 =============== */
{
id:"ht1n2",
titulo:"El head a fondo: metadatos y recursos",
claves:["charset lo primero, luego viewport y title; description, canonical e iconos después","link rel enlaza recursos: stylesheet, icon, canonical, manifest, preload…","Nunca bloquees el zoom con maximum-scale o user-scalable=no"],
pasos:[
 {t:"info", eti:"Todo lo que no se ve", h:"Un head profesional",
  c:`<div class="termbox">&lt;head&gt;
  &lt;meta charset="utf-8"&gt;                                  &lt;!-- en los primeros 1024 bytes --&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
  &lt;title&gt;Curso de HTML · Catappa&lt;/title&gt;
  &lt;meta name="description" content="Aprende HTML desde cero hasta nivel profesional."&gt;
  &lt;link rel="canonical" href="https://catappa.dev/cursos/html"&gt;

  &lt;link rel="icon" href="/favicon.ico" sizes="32x32"&gt;
  &lt;link rel="icon" href="/icono.svg" type="image/svg+xml"&gt;
  &lt;link rel="apple-touch-icon" href="/apple-touch-icon.png"&gt;   &lt;!-- 180×180 --&gt;
  &lt;link rel="manifest" href="/manifest.webmanifest"&gt;
  &lt;meta name="theme-color" content="#f0875a"&gt;
  &lt;meta name="color-scheme" content="light dark"&gt;

  &lt;link rel="stylesheet" href="/css/app.css"&gt;
  &lt;script src="/js/app.js" type="module"&gt;&lt;/script&gt;
&lt;/head&gt;</div>`},
 {t:"info", eti:"Por qué así", h:"Cada línea tiene su motivo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">elementos del head</div><table class="dg-tabla"><thead><tr><th>elemento</th><th>para qué</th></tr></thead><tbody>
     <tr><td>meta charset</td><td>Codificación. Debe aparecer en los primeros 1024 bytes, o el navegador puede tener que reinterpretar la página.</td></tr>
     <tr><td>meta viewport</td><td>Sin él, el móvil simula una pantalla de ~980 px y encoge todo.</td></tr>
     <tr><td>title</td><td>Pestaña, historial, marcadores, resultado de búsqueda y lo primero que anuncia el lector de pantalla. Único por página.</td></tr>
     <tr><td>meta description</td><td>Texto candidato para el resultado del buscador (no mejora la posición, sí los clics).</td></tr>
     <tr><td>link rel</td><td>Relaciona la página con otro recurso: stylesheet, icon, canonical, manifest, alternate, preload, preconnect…</td></tr>
     <tr><td>color-scheme</td><td>Avisa de que la página soporta tema claro y oscuro: los controles nativos y las barras de desplazamiento se adaptan.</td></tr></tbody></table></div>
     <div class="nota ojo"><b class="tit">No bloquees el zoom</b><code>maximum-scale=1</code> o <code>user-scalable=no</code> impiden ampliar la página a quien ve mal, y incumplen WCAG (1.4.4, cambiar el tamaño del texto). La <code>meta keywords</code> tampoco sirve: Google la ignora desde 2009.</div>`},
 {t:"par", p:"Empareja cada valor de <code>rel</code> con lo que enlaza",
  pares:[["stylesheet","Una hoja de estilos"],["icon","El icono de la pestaña"],["canonical","La URL oficial de este contenido"],["manifest","La ficha de la aplicación web instalable"],["alternate","La misma página en otro idioma o formato"]],
  why:"<code>rel</code> describe la relación entre la página y el recurso; el navegador y los buscadores actúan según esa relación."},
 {t:"opcion", p:"Un diseñador pide añadir <code>maximum-scale=1, user-scalable=no</code> al viewport «para que no se descuadre». ¿Qué respondes?",
  ops:["Perfecto, así queda más limpio","No: impide que la gente con baja visión amplíe la página e incumple WCAG; hay que arreglar el diseño","Solo si la página es para móvil","Mejor poner maximum-scale=5"],
  ok:1, why:"Además, Safari en iOS ignora hoy el bloqueo del zoom por accesibilidad, así que ni siquiera consigue lo que busca."},
 {t:"hueco", p:"Completa el enlace a la hoja de estilos y el icono en SVG",
  tpl:'<link ___="stylesheet" ___="/css/app.css">\n<link rel="___" href="/icono.svg" type="image/svg+xml">',
  banco:["rel","href","icon","src","favicon","type"], sol:["rel","href","icon"],
  why:"<code>link</code> usa <code>href</code> (no <code>src</code>) y el tipo de relación va en <code>rel</code>. «favicon» no es un valor válido de rel: es <code>icon</code>."},
 {t:"escribe", p:"Escribe el valor del atributo <code>content</code> de la meta viewport estándar",
  sol:["width=device-width, initial-scale=1","width=device-width,initial-scale=1","width=device-width, initial-scale=1.0","initial-scale=1, width=device-width"],
  pista:"Dos pares: el ancho del dispositivo y la escala inicial.",
  why:"<code>width=device-width</code> hace que 1 píxel CSS se ajuste a la pantalla real, e <code>initial-scale=1</code> arranca sin zoom."},
 {t:"vf", p:"La etiqueta <code>&lt;meta name=\"keywords\"&gt;</code> ayuda a posicionar en Google.",
  ok:false, why:"Google la ignora desde 2009 porque se abusaba de ella. Lo que cuenta es el contenido real, el título, los encabezados y los enlaces."},
 {t:"opcion", p:"¿Qué elemento del head es obligatorio para que un documento HTML sea válido?",
  ops:["&lt;meta name=\"description\"&gt;","&lt;title&gt;","&lt;link rel=\"icon\"&gt;","&lt;base&gt;"],
  ok:1, why:"El validador marca como error un documento sin <code>&lt;title&gt;</code> no vacío. Y es lo primero que un lector de pantalla anuncia al abrir la página."}
]},

/* =============== U1 L5 =============== */
{
id:"hc1l3",
titulo:"Texto: títulos, párrafos y semántica en línea",
claves:["h1…h6 por jerarquía, no por tamaño; un h1 por página y sin saltar niveles","strong es importancia y em énfasis; b e i son estilo sin énfasis","abbr, time, code, kbd, mark, q, blockquote… dan significado preciso al texto"],
pasos:[
 {t:"info", eti:"Bloques de texto", h:"Títulos y párrafos",
  c:`<div class="termbox">&lt;h1&gt;Guía de Docker&lt;/h1&gt;              &lt;!-- tema de la página --&gt;
&lt;h2&gt;Instalación&lt;/h2&gt;
&lt;h3&gt;En Windows&lt;/h3&gt;
&lt;p&gt;Descarga el instalador y reinicia.&lt;/p&gt;
&lt;h2&gt;Primeros pasos&lt;/h2&gt;               &lt;!-- vuelve a h2: nueva sección --&gt;

&lt;blockquote cite="https://example.org/entrevista"&gt;
  &lt;p&gt;Los contenedores no son máquinas virtuales ligeras.&lt;/p&gt;
&lt;/blockquote&gt;
&lt;p&gt;Primera línea&lt;br&gt;segunda línea de la misma dirección postal&lt;/p&gt;
&lt;hr&gt;                                  &lt;!-- cambio de tema, no una raya decorativa --&gt;
&lt;pre&gt;&lt;code&gt;docker run -d nginx&lt;/code&gt;&lt;/pre&gt;</div>
     <p>Los títulos forman el <b>índice</b> de la página: los lectores de pantalla saltan de uno a otro (en NVDA, con la tecla H) y los buscadores los usan para entender el tema. El tamaño se cambia con CSS, nunca eligiendo otro nivel. <code>&lt;br&gt;</code> es para saltos que forman parte del contenido (poemas, direcciones), no para separar párrafos.</p>`},
 {t:"info", eti:"En línea", h:"Semántica dentro de la frase",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">elementos de texto en línea</div><table class="dg-tabla"><thead><tr><th>elemento</th><th>significa</th><th>ejemplo</th></tr></thead><tbody>
     <tr><td>strong</td><td>importancia, urgencia</td><td>&lt;strong&gt;No apagues el equipo&lt;/strong&gt;</td></tr>
     <tr><td>em</td><td>énfasis que cambia el sentido</td><td>Yo &lt;em&gt;no&lt;/em&gt; dije eso</td></tr>
     <tr><td>b / i</td><td>resaltado sin importancia / voz distinta (términos, otro idioma)</td><td>&lt;i lang="en"&gt;deploy&lt;/i&gt;</td></tr>
     <tr><td>mark</td><td>resaltado por relevancia (coincidencia de búsqueda)</td><td>&lt;mark&gt;docker&lt;/mark&gt;</td></tr>
     <tr><td>abbr</td><td>abreviatura</td><td>&lt;abbr title="Content Delivery Network"&gt;CDN&lt;/abbr&gt;</td></tr>
     <tr><td>time</td><td>fecha u hora legible por máquina</td><td>&lt;time datetime="2026-09-23"&gt;23 de septiembre&lt;/time&gt;</td></tr>
     <tr><td>code / kbd / samp</td><td>código / tecla que pulsa el usuario / salida de un programa</td><td>&lt;kbd&gt;Ctrl&lt;/kbd&gt; + &lt;kbd&gt;C&lt;/kbd&gt;</td></tr>
     <tr><td>q / cite</td><td>cita corta en línea / título de una obra</td><td>&lt;cite&gt;El Quijote&lt;/cite&gt;</td></tr>
     <tr><td>small</td><td>letra pequeña legal, aclaraciones</td><td>&lt;small&gt;IVA incluido&lt;/small&gt;</td></tr>
     <tr><td>del / ins / s</td><td>texto eliminado / añadido / ya no vigente</td><td>&lt;s&gt;30 €&lt;/s&gt; 20 €</td></tr>
     <tr><td>sub / sup</td><td>subíndice / superíndice</td><td>H&lt;sub&gt;2&lt;/sub&gt;O, m&lt;sup&gt;2&lt;/sup&gt;</td></tr></tbody></table></div>
     <p><b>Entidades</b>: con UTF-8 puedes escribir «ñ», «€» o «©» directamente. Solo hace falta escapar <code>&amp;lt;</code> (&lt;) y <code>&amp;amp;</code> (&amp;) en el texto, y <code>&amp;quot;</code> dentro de atributos entre comillas. <code>&amp;nbsp;</code> es un espacio que no parte línea: «10&amp;nbsp;km».</p>`},
 {t:"par", p:"Empareja cada elemento con su significado",
  pares:[["<strong>","Importancia o urgencia"],["<em>","Énfasis que cambia el sentido de la frase"],["<mark>","Resaltado por relevancia, como una coincidencia de búsqueda"],["<kbd>","Tecla o entrada del usuario"],["<small>","Letra pequeña o aclaración legal"]],
  why:"Los lectores de pantalla apenas cambian la voz con estos elementos, pero el significado queda en el DOM para buscadores, traductores y herramientas."},
 {t:"vf", p:"Si un <code>&lt;h2&gt;</code> se ve demasiado grande, lo correcto es cambiarlo por un <code>&lt;h4&gt;</code>.",
  ok:false, why:"El nivel expresa jerarquía, no tamaño. Se deja el h2 y se ajusta con CSS. Saltarse niveles confunde a quien navega por títulos."},
 {t:"hueco", p:"Completa la abreviatura y la fecha para que las máquinas las entiendan",
  tpl:'<abbr ___="Interfaz de programación de aplicaciones">API</abbr>\npublicada el <time ___="2026-09-23">23 de septiembre</time>',
  banco:["title","datetime","alt","date","value","href"], sol:["title","datetime"],
  why:"<code>datetime</code> lleva el formato ISO (<code>AAAA-MM-DD</code>, <code>HH:MM</code>, duraciones como <code>PT2H</code>) para que buscadores y calendarios lo interpreten."},
 {t:"opcion", p:"Quieres poner una línea en blanco entre dos párrafos. ¿Qué haces?",
  ops:["Dos &lt;br&gt; seguidos","Un &lt;p&gt; vacío","Dos párrafos &lt;p&gt; y el espacio con CSS (margin)","Muchos &amp;nbsp;"],
  ok:2, why:"El espaciado es presentación: CSS. Los <code>&lt;br&gt;</code> y los párrafos vacíos ensucian el DOM y un lector de pantalla puede anunciarlos como líneas en blanco."},
 {t:"escribe", p:"¿Qué entidad escribes en HTML para mostrar el signo <code>&lt;</code> en el texto?",
  sol:["&lt;","&#60;","&#x3c;"],
  pista:"Viene de <i>less than</i>.",
  why:"Sin escapar, el parser creería que empieza una etiqueta. Es también la base de la defensa contra XSS: el texto del usuario se escapa antes de meterlo en el HTML."},
 {t:"opcion", p:"¿Qué elemento usas para mostrar un bloque de código de varias líneas respetando espacios y saltos?",
  ops:["&lt;code&gt; solo","&lt;pre&gt;&lt;code&gt;…&lt;/code&gt;&lt;/pre&gt;","&lt;p&gt; con muchos &lt;br&gt;","&lt;samp&gt;"],
  ok:1, why:"<code>pre</code> conserva el espacio en blanco tal cual y <code>code</code> dice que es código. Dentro, los <code>&lt;</code> se siguen escapando."}
]},

/* =============== U1 L6 =============== */
{
id:"hc1l4",
titulo:"Listas",
claves:["ul para listas sin orden, ol para secuencias, li para cada elemento","dl con dt y dd para pares término–descripción","Las listas anidadas van dentro de un li; los menús son listas de enlaces"],
pasos:[
 {t:"info", eti:"Organizar", h:"Tres tipos de lista",
  c:`<div class="termbox">&lt;ul&gt;                                   &lt;!-- el orden no importa --&gt;
  &lt;li&gt;Repasar Docker&lt;/li&gt;
  &lt;li&gt;Practicar Spring
    &lt;ul&gt;                               &lt;!-- sublista DENTRO del li --&gt;
      &lt;li&gt;Controladores&lt;/li&gt;
      &lt;li&gt;JPA&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/ul&gt;

&lt;ol start="3" reversed&gt;                 &lt;!-- secuencia: 3, 2, 1 --&gt;
  &lt;li&gt;Crear la cuenta&lt;/li&gt;
  &lt;li&gt;Elegir curso&lt;/li&gt;
  &lt;li&gt;Empezar&lt;/li&gt;
&lt;/ol&gt;

&lt;dl&gt;                                   &lt;!-- término y descripción --&gt;
  &lt;dt&gt;DNS&lt;/dt&gt;&lt;dd&gt;Traduce nombres a direcciones IP.&lt;/dd&gt;
  &lt;dt&gt;TLS&lt;/dt&gt;&lt;dd&gt;Cifra la conexión.&lt;/dd&gt;
&lt;/dl&gt;</div>
     <p>Un lector de pantalla anuncia «lista, 3 elementos» antes de leerla: quien la escucha sabe cuánto le queda. Por eso un menú de navegación es una lista de enlaces dentro de un <code>&lt;nav&gt;</code>.</p>
     <div class="nota ojo"><b class="tit">list-style: none en Safari</b>Si quitas las viñetas con CSS, Safari con VoiceOver deja de anunciarla como lista. Si la semántica importa, se puede reponer con <code>role="list"</code> en el ul.</div>`},
 {t:"par", p:"Empareja cada etiqueta con su significado",
  pares:[["<ul>","Lista sin orden (viñetas)"],["<ol>","Lista ordenada, una secuencia"],["<li>","Elemento de una lista"],["<dl>","Lista de términos y descripciones"],["<dd>","Descripción de un término"]],
  why:"La elección depende del significado: una receta son pasos (ol), la lista de la compra no tiene orden (ul) y un glosario son pares (dl)."},
 {t:"opcion", p:"¿Dónde va una sublista anidada?",
  ops:["Directamente dentro del &lt;ul&gt;, entre dos &lt;li&gt;","Dentro del &lt;li&gt; del que depende","Después del &lt;/ul&gt;","En un &lt;div&gt; aparte"],
  ok:1, why:"Un <code>ul</code> solo puede tener <code>li</code> como hijos (más <code>script</code> y <code>template</code>). La sublista pertenece a un elemento concreto, así que va dentro de él."},
 {t:"orden", p:"Ordena las líneas para crear un menú con dos enlaces",
  items:["<nav>","<ul>",'<li><a href="/">Inicio</a></li>','<li><a href="/cursos">Cursos</a></li>',"</ul>","</nav>"],
  why:"nav &gt; ul &gt; li &gt; a es el patrón clásico de navegación: landmark, recuento de elementos y enlaces accesibles."},
 {t:"hueco", p:"Completa un glosario con la lista de descripción",
  tpl:"<___>\n  <___>HTTP</dt>\n  <dd>Protocolo de la web.</dd>\n</dl>",
  banco:["dl","dt","ul","li","dd","ol"], sol:["dl","dt"],
  why:"<code>dl</code> sirve para glosarios, fichas técnicas (clave: valor) y preguntas frecuentes. Un <code>dt</code> puede tener varios <code>dd</code>."},
 {t:"escribe", p:"¿Qué atributo de <code>&lt;ol&gt;</code> hace que la numeración empiece en 5?",
  sol:["start","start=\"5\"","start=5"],
  pista:"Significa «empezar» en inglés.",
  why:"<code>start</code> fija el primer número, <code>reversed</code> cuenta hacia atrás y <code>value</code> en un <code>li</code> fuerza el número de ese elemento."},
 {t:"vf", p:"Un <code>&lt;ul&gt;</code> puede tener un <code>&lt;p&gt;</code> como hijo directo.",
  ok:false, why:"El modelo de contenido de ul solo admite li (y elementos de script). El párrafo tiene que ir dentro de un li. El navegador no se queja, pero el lector de pantalla cuenta mal los elementos."}
]}

]});
