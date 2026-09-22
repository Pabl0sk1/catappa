window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Qué es JavaScript",
resumen: "Dónde se ejecuta, la consola, tu primer script, variables con let y const, y los tipos de datos",
nivel: "Fundamentos",
color: "#e8d44d",
lecciones: [

{
id:"js1l1",
titulo:"El lenguaje de la web",
claves:["JavaScript es el único lenguaje que ejecutan los navegadores de forma nativa","También se ejecuta en servidores con Node.js, Deno o Bun","ECMAScript es el estándar; cada año trae una versión nueva"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es JavaScript?",
  c:`<p>Una página web tiene tres piezas:</p>
     <ul><li><b>HTML</b>: el contenido y su estructura (títulos, párrafos, botones).</li>
     <li><b>CSS</b>: el aspecto (colores, tamaños, posiciones).</li>
     <li><b>JavaScript</b>: el comportamiento (qué pasa al pulsar un botón, pedir datos al servidor, validar un formulario).</li></ul>
     <p>JavaScript es el <b>único lenguaje</b> que los navegadores ejecutan directamente. Nada que ver con Java, pese al nombre: se llamó así por marketing en 1995.</p>`},
 {t:"info", eti:"No solo navegadores", h:"Dónde se ejecuta",
  c:`<ul><li><b>Navegador</b>: cada navegador trae un motor (V8 en Chrome y Edge, SpiderMonkey en Firefox, JavaScriptCore en Safari).</li>
     <li><b>Servidor</b>: <b>Node.js</b> usa el motor V8 fuera del navegador. Con él se hacen APIs, herramientas de línea de comandos y scripts.</li>
     <li>Apps de escritorio (Electron: VS Code, Slack) y móviles (React Native).</li></ul>
     <p>El estándar del lenguaje se llama <b>ECMAScript</b>; «ES2015» (o ES6) fue la gran modernización, y desde entonces sale una versión cada año.</p>`},
 {t:"par", p:"Empareja cada tecnología con su papel",
  pares:[["HTML","Estructura y contenido de la página"],["CSS","Aspecto visual"],["JavaScript","Comportamiento e interactividad"],["Node.js","Ejecutar JavaScript fuera del navegador"],["ECMAScript","El estándar que define el lenguaje"]],
  why:"Con JavaScript puedes trabajar en frontend, backend y herramientas: por eso es tan popular."},
 {t:"opcion", p:"¿Qué relación hay entre Java y JavaScript?",
  ops:["JavaScript es una versión ligera de Java","Ninguna técnica: son lenguajes distintos con nombres parecidos por marketing","JavaScript compila a Java","Comparten la misma máquina virtual"],
  ok:1, why:"Una confusión frecuente que conviene aclarar en una entrevista si surge."},
 {t:"vf", p:"Para ejecutar JavaScript en el navegador hace falta instalar algo aparte.",
  ok:false, why:"Todos los navegadores lo traen de serie."}
]},

{
id:"js1l2",
titulo:"La consola y tu primer script",
claves:["La consola del navegador (F12) ejecuta JavaScript al momento","console.log muestra valores; es la herramienta de depuración básica","Un script se carga en HTML con &lt;script src&gt; al final o con defer"],
pasos:[
 {t:"info", eti:"Probar al instante", h:"La consola",
  c:`<p>Abre cualquier web, pulsa <b>F12</b> y ve a la pestaña <b>Consola</b>. Escribe y pulsa Enter:</p>
     <div class="termbox">&gt; 2 + 3
5
&gt; console.log("Hola, Catappa")
Hola, Catappa
&gt; "catappa".toUpperCase()
'CATAPPA'</div>
     <p>Con Node.js instalado, escribir <code>node</code> en la terminal abre una consola equivalente (REPL).</p>`},
 {t:"term", p:"Estás en la consola. Muestra el texto <code>Hola</code> con console.log",
  prompt:">", sol:["console.log(\"Hola\")","console.log('Hola')","console.log(\"Hola\");","console.log('Hola');"],
  pista:"console.log( y el texto entre comillas ).",
  salida:`Hola`, why:"console.log es la forma más rápida de ver qué vale algo mientras programas."},
 {t:"info", eti:"En una página", h:"Cargar un script",
  c:`<div class="termbox">&lt;!DOCTYPE html&gt;
&lt;html lang="es"&gt;
&lt;head&gt;
  &lt;title&gt;Mi página&lt;/title&gt;
  &lt;script src="app.js" defer&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;button id="saludar"&gt;Saludar&lt;/button&gt;
&lt;/body&gt;
&lt;/html&gt;</div>
     <div class="termbox">// app.js
document.querySelector("#saludar").addEventListener("click", () =&gt; {
  alert("¡Hola!");
});</div>
     <p><code>defer</code> hace que el script se ejecute cuando el HTML ya está cargado; así puede encontrar el botón.</p>`},
 {t:"opcion", p:"Tu script busca un botón y obtiene <code>null</code>. El <code>&lt;script&gt;</code> está en el <code>&lt;head&gt;</code> sin atributos. ¿Por qué?",
  ops:["El botón no existe","El script se ejecuta antes de que el navegador haya leído el HTML del botón; usa defer o ponlo al final del body","console.log está roto","Falta un punto y coma"],
  ok:1, why:"El navegador procesa la página de arriba abajo."},
 {t:"vf", p:"Node.js ofrece una consola interactiva al escribir <code>node</code> en la terminal.",
  ok:true, why:"Se llama REPL (Read-Eval-Print Loop). Se sale con .exit o Ctrl+D."}
]},

{
id:"js1l3",
titulo:"Variables: let y const",
claves:["const para valores que no se reasignan (la opción por defecto)","let para variables que cambian","var es la forma antigua: evítala"],
pasos:[
 {t:"info", eti:"Guardar valores", h:"Declarar variables",
  c:`<div class="termbox">const nombre = "Ana";       // no se puede reasignar
let puntos = 0;             // se puede cambiar
puntos = puntos + 10;
nombre = "Eva";             // TypeError: Assignment to constant variable.</div>
     <p>Regla práctica: usa <b>const</b> siempre, y <b>let</b> solo cuando sepas que el valor va a cambiar. Así, al leer el código, sabes qué puede cambiar y qué no.</p>
     <p><code>var</code> es la forma de antes de 2015: tiene reglas de ámbito confusas. No la uses en código nuevo.</p>`},
 {t:"info", eti:"Ojo", h:"const no significa inmutable",
  c:`<div class="termbox">const carrito = [];
carrito.push("teclado");     // permitido: se modifica el contenido
carrito = [];                // error: no se puede reasignar la variable</div>
     <p><code>const</code> impide <b>reasignar</b> la variable, no modificar el objeto al que apunta.</p>`},
 {t:"par", p:"Empareja cada declaración con su comportamiento",
  pares:[["const","No se puede reasignar; ámbito de bloque"],["let","Se puede reasignar; ámbito de bloque"],["var","Antigua: ámbito de función y se «eleva» (hoisting)"]],
  why:"Ámbito de bloque: la variable solo existe dentro de las llaves donde se declara."},
 {t:"escribe", p:"Declara una constante llamada <code>iva</code> con valor 0.21",
  sol:["const iva = 0.21;","const iva = 0.21"], ph:"const ...", pista:"const, nombre, = y el valor.", why:"const iva = 0.21;"},
 {t:"opcion", p:"¿Qué ocurre?", c:`<div class="termbox">const lista = [1, 2];
lista.push(3);
console.log(lista);</div>`,
  ops:["Error: lista es const","Imprime [1, 2, 3]","Imprime [1, 2]","Imprime undefined"],
  ok:1, why:"Se modifica el array, no se reasigna la variable."}
]},

{
id:"js1l4",
titulo:"Tipos de datos",
claves:["Primitivos: string, number, boolean, undefined, null, bigint, symbol","Todo lo demás es un objeto (arrays y funciones incluidos)","typeof indica el tipo; JavaScript es de tipado dinámico"],
pasos:[
 {t:"info", eti:"Los tipos", h:"Primitivos y objetos",
  c:`<div class="termbox">"hola"           // string
42, 3.14, NaN    // number (un solo tipo para enteros y decimales)
true, false      // boolean
undefined        // variable declarada sin valor
null             // "sin valor" puesto a proposito
10n              // bigint: enteros enormes
Symbol("id")     // symbol: identificador unico

{ nombre: "Ana" }   // object
[1, 2, 3]           // object (array)
function () {}      // object (funcion)</div>
     <p>JavaScript es de <b>tipado dinámico</b>: una variable puede guardar un número y luego un texto. Esto da flexibilidad y también muchos errores; por eso existe TypeScript.</p>`},
 {t:"par", p:"Empareja cada expresión con lo que devuelve <code>typeof</code>",
  pares:[["typeof \"hola\"","\"string\""],["typeof 42","\"number\""],["typeof true","\"boolean\""],["typeof undefined","\"undefined\""],["typeof null","\"object\" (un fallo histórico del lenguaje)"]],
  why:"typeof null === \"object\" es un error de 1995 que no se puede corregir sin romper la web."},
 {t:"info", eti:"Dos vacíos", h:"undefined y null",
  c:`<ul><li><b>undefined</b>: «no tiene valor todavía». Variables sin asignar, propiedades que no existen, funciones sin return.</li>
     <li><b>null</b>: «no hay valor», puesto a propósito por el programador.</li></ul>
     <div class="termbox">let x;
console.log(x);              // undefined
const usuario = { nombre: "Ana" };
console.log(usuario.email);  // undefined
const seleccionado = null;   // todavia no hay nada seleccionado</div>`},
 {t:"opcion", p:"¿Qué muestra <code>console.log(0.1 + 0.2)</code>?",
  ops:["0.3","0.30000000000000004","Error","NaN"],
  ok:1, why:"Los number son decimales binarios de 64 bits (IEEE 754), igual que double en Java. Para dinero, trabaja en céntimos enteros."},
 {t:"vf", p:"En JavaScript hay un tipo distinto para enteros y otro para decimales.",
  ok:false, why:"Ambos son number. Solo bigint es un tipo aparte para enteros muy grandes."}
]}

]});
