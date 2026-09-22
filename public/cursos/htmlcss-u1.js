window.CURSOS = window.CURSOS || {};
(CURSOS.htmlcss = CURSOS.htmlcss || []).push({
titulo: "HTML desde cero",
resumen: "Qué es HTML, la estructura de un documento, etiquetas y atributos, textos, enlaces, imágenes y listas",
nivel: "Fundamentos",
color: "#f0875a",
lecciones: [

{
id:"hc1l1",
titulo:"Qué es HTML",
claves:["HTML describe la estructura y el significado del contenido de una página","Se escribe con etiquetas: apertura, contenido y cierre","El navegador lee el HTML y construye el DOM"],
pasos:[
 {t:"info", eti:"Empezamos", h:"El esqueleto de la web",
  c:`<p><b>HTML</b> (HyperText Markup Language) es el lenguaje que describe <b>qué hay</b> en una página: un título, un párrafo, una imagen, un formulario. No es un lenguaje de programación: no tiene variables ni bucles; es un lenguaje de <b>marcado</b>.</p>
     <div class="termbox">&lt;h1&gt;Mis tareas&lt;/h1&gt;
&lt;p&gt;Tienes &lt;strong&gt;3 tareas&lt;/strong&gt; pendientes.&lt;/p&gt;</div>
     <p>Cada elemento se marca con una <b>etiqueta de apertura</b> (<code>&lt;p&gt;</code>), su <b>contenido</b> y una <b>etiqueta de cierre</b> (<code>&lt;/p&gt;</code>). CSS se encarga del aspecto y JavaScript del comportamiento.</p>`},
 {t:"par", p:"Empareja cada lenguaje con su papel en una página",
  pares:[["HTML","Estructura y significado del contenido"],["CSS","Aspecto visual: colores, tamaños, disposición"],["JavaScript","Comportamiento e interactividad"]],
  why:"Separar las tres capas hace las páginas más fáciles de mantener."},
 {t:"opcion", p:"¿Qué es HTML?",
  ops:["Un lenguaje de programación","Un lenguaje de marcado que describe la estructura del contenido","Un servidor web","Un tipo de base de datos"],
  ok:1, why:"No calcula nada: etiqueta el contenido para que el navegador sepa qué es cada cosa."},
 {t:"vf", p:"Casi todos los elementos de HTML tienen una etiqueta de apertura y otra de cierre.",
  ok:true, why:"Algunos no tienen contenido y no se cierran, como &lt;img&gt;, &lt;br&gt; o &lt;input&gt;."}
]},

{
id:"hc1l2",
titulo:"La estructura de un documento",
claves:["&lt;!DOCTYPE html&gt;, &lt;html&gt;, &lt;head&gt; y &lt;body&gt; forman el esqueleto","&lt;head&gt; contiene metadatos: codificación, título, viewport, CSS","&lt;body&gt; contiene lo que se ve"],
pasos:[
 {t:"info", eti:"El esqueleto", h:"Un documento completo",
  c:`<div class="termbox">&lt;!DOCTYPE html&gt;
&lt;html lang="es"&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;title&gt;Mis tareas&lt;/title&gt;
    &lt;link rel="stylesheet" href="estilos.css"&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Mis tareas&lt;/h1&gt;
    &lt;script src="app.js" defer&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</div>`},
 {t:"par", p:"Empareja cada parte con su función",
  pares:[["<!DOCTYPE html>","Indica que es HTML moderno"],["<html lang=\"es\">","Raíz del documento e idioma del contenido"],["<meta charset=\"utf-8\">","Codificación: tildes y eñes correctas"],["<meta name=\"viewport\">","Que la página se adapte al ancho del móvil"],["<title>","Texto de la pestaña y del resultado en buscadores"]],
  why:"Sin el viewport, los móviles muestran la página como si fuera de escritorio, diminuta."},
 {t:"orden", p:"Ordena las etiquetas tal como aparecen en un documento",
  items:["<!DOCTYPE html>","<html lang=\"es\">","<head> con los metadatos","<body> con el contenido visible","</html>"],
  why:"head antes que body: primero la información sobre la página y luego la página."},
 {t:"opcion", p:"Las tildes de tu página salen como símbolos raros (Ã¡). ¿Qué falta?",
  ops:["Un CSS","La etiqueta &lt;meta charset=\"utf-8\"&gt; (y guardar el fichero en UTF-8)","JavaScript","Un servidor"],
  ok:1, why:"Es el problema de codificación más común."}
]},

{
id:"hc1l3",
titulo:"Textos, enlaces e imágenes",
claves:["Títulos h1 a h6 en orden jerárquico; párrafos con p","Enlaces con a href; imágenes con img src y alt","El texto alternativo describe la imagen para quien no la ve"],
pasos:[
 {t:"info", eti:"Contenido", h:"Etiquetas esenciales",
  c:`<div class="termbox">&lt;h1&gt;Título principal (uno por página)&lt;/h1&gt;
&lt;h2&gt;Sección&lt;/h2&gt;
&lt;h3&gt;Subsección&lt;/h3&gt;
&lt;p&gt;Un párrafo con &lt;strong&gt;importancia&lt;/strong&gt; y &lt;em&gt;énfasis&lt;/em&gt;.&lt;/p&gt;

&lt;a href="https://catappa.dev/cursos"&gt;Ver cursos&lt;/a&gt;
&lt;a href="/perfil"&gt;Mi perfil&lt;/a&gt;                               &lt;!-- ruta del mismo sitio --&gt;
&lt;a href="https://github.com" target="_blank" rel="noopener"&gt;GitHub&lt;/a&gt;

&lt;img src="foto.jpg" alt="Equipo celebrando el lanzamiento" width="800" height="450"&gt;</div>
     <p>Los <b>atributos</b> (<code>href</code>, <code>src</code>, <code>alt</code>) dan información extra a la etiqueta. Indicar <code>width</code> y <code>height</code> evita que la página «salte» mientras cargan las imágenes.</p>`},
 {t:"par", p:"Empareja cada etiqueta con su uso",
  pares:[["<h1>","Título principal de la página"],["<p>","Párrafo"],["<a href>","Enlace a otra página"],["<img src alt>","Imagen con descripción alternativa"],["<strong>","Texto importante"]],
  why:"Los títulos no se eligen por tamaño (eso es CSS), sino por jerarquía."},
 {t:"escribe", p:"Escribe un enlace a <code>/cursos</code> con el texto Cursos",
  sol:["<a href=\"/cursos\">Cursos</a>","<a href='/cursos'>Cursos</a>","<a href=/cursos>Cursos</a>"], ph:"<a ...", pista:"La etiqueta a con el atributo href y el texto dentro.", why:"&lt;a href=\"/cursos\"&gt;Cursos&lt;/a&gt;"},
 {t:"vf", p:"El atributo <code>alt</code> de una imagen es opcional y no tiene ningún efecto.",
  ok:false, why:"Lo leen los lectores de pantalla, aparece si la imagen no carga y lo usan los buscadores. En imágenes decorativas se deja vacío: alt=\"\"."}
]},

{
id:"hc1l4",
titulo:"Listas y tablas",
claves:["ul para listas sin orden, ol para listas numeradas, li para cada elemento","table con thead, tbody, tr, th y td para datos tabulares","Las tablas son para datos, no para maquetar"],
pasos:[
 {t:"info", eti:"Organizar", h:"Listas y tablas",
  c:`<div class="termbox">&lt;ul&gt;
  &lt;li&gt;Repasar Docker&lt;/li&gt;
  &lt;li&gt;Practicar Spring&lt;/li&gt;
&lt;/ul&gt;

&lt;ol&gt;
  &lt;li&gt;Crear la cuenta&lt;/li&gt;
  &lt;li&gt;Empezar el primer curso&lt;/li&gt;
&lt;/ol&gt;

&lt;table&gt;
  &lt;caption&gt;Pedidos de septiembre&lt;/caption&gt;
  &lt;thead&gt;&lt;tr&gt;&lt;th&gt;Pedido&lt;/th&gt;&lt;th&gt;Total&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;&lt;td&gt;101&lt;/td&gt;&lt;td&gt;45,90 €&lt;/td&gt;&lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</div>`},
 {t:"par", p:"Empareja cada etiqueta con su significado",
  pares:[["<ul>","Lista sin orden (viñetas)"],["<ol>","Lista ordenada (números)"],["<li>","Elemento de una lista"],["<th>","Celda de encabezado de una tabla"],["<td>","Celda de datos"]],
  why:"Los menús de navegación suelen ser listas ul dentro de un nav."},
 {t:"opcion", p:"¿Para qué NO deberías usar una tabla?",
  ops:["Mostrar pedidos con sus columnas","Colocar el menú a la izquierda y el contenido a la derecha","Comparar precios de planes","Mostrar horarios"],
  ok:1, why:"La maquetación se hace con CSS (Flexbox y Grid). Las tablas son para datos tabulares."}
]}

]});
