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
     <p>JavaScript es el <b>único lenguaje</b> que los navegadores ejecutan directamente (WebAssembly es un formato binario que se carga <i>desde</i> JavaScript). Nada que ver con Java, pese al nombre: se llamó así por marketing en 1995.</p>`},
 {t:"info", eti:"No solo navegadores", h:"Dónde se ejecuta",
  c:`<div class="dg"><div class="dg-tit">un lenguaje, muchos entornos</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Navegador</div><div class="dg-pila">
<div class="dg-caja acento doble">V8<small>Chrome, Edge</small></div>
<div class="dg-caja acento doble">SpiderMonkey<small>Firefox</small></div>
<div class="dg-caja acento doble">JavaScriptCore<small>Safari</small></div></div></div>
<div class="dg-col"><div class="dg-col-tit">Servidor y herramientas</div><div class="dg-pila">
<div class="dg-caja ok doble">Node.js<small>V8 fuera del navegador</small></div>
<div class="dg-caja ok doble">Deno y Bun<small>alternativas modernas</small></div>
<div class="dg-caja base doble">Electron, React Native<small>escritorio y móvil</small></div></div></div>
</div></div>
     <p>El estándar del lenguaje se llama <b>ECMAScript</b> (lo mantiene el comité TC39). ES2015 (o «ES6») fue la gran modernización: <code>let</code>, <code>const</code>, clases, módulos, promesas. Desde entonces sale una versión cada junio: ES2024, ES2025…</p>
     <p>Lo que el lenguaje define (tipos, funciones, promesas) es igual en todas partes. Lo que da el <b>entorno</b> cambia: el navegador trae <code>document</code> y <code>window</code>; Node trae ficheros, procesos y red.</p>`},
 {t:"par", p:"Empareja cada tecnología con su papel",
  pares:[["HTML","Estructura y contenido de la página"],["CSS","Aspecto visual"],["JavaScript","Comportamiento e interactividad"],["Node.js","Ejecutar JavaScript fuera del navegador"],["ECMAScript","El estándar que define el lenguaje"]],
  why:"Con JavaScript puedes trabajar en frontend, backend y herramientas: por eso es tan popular."},
 {t:"opcion", p:"¿Qué relación hay entre Java y JavaScript?",
  ops:["JavaScript es una versión ligera de Java","Ninguna técnica: son lenguajes distintos con nombres parecidos por marketing","JavaScript compila a Java","Comparten la misma máquina virtual"],
  ok:1, why:"Una confusión frecuente que conviene aclarar en una entrevista si surge."},
 {t:"opcion", p:"Tu script usa <code>document.querySelector</code> y funciona en el navegador, pero en Node da <code>ReferenceError: document is not defined</code>. ¿Por qué?",
  ops:["Node usa otra versión de JavaScript","document lo aporta el navegador (el entorno), no el lenguaje: Node no tiene página que manipular","Falta instalar un paquete de npm llamado document","Hay que escribirlo con mayúscula"],
  ok:1, why:"El lenguaje es el mismo; las APIs del entorno cambian. En Node tienes fs, process o http; en el navegador, document, window o localStorage."},
 {t:"escribe", p:"¿Cómo se llama el motor de JavaScript que comparten Chrome y Node.js?",
  sol:["V8","v8","el V8","motor V8"], pista:"Nombre corto: una letra y un número.",
  why:"V8 compila JavaScript a código máquina al vuelo (JIT). Por eso JavaScript moderno es rápido."},
 {t:"vf", p:"Para ejecutar JavaScript en el navegador hace falta instalar algo aparte.",
  ok:false, why:"Todos los navegadores lo traen de serie."}
]},

{
id:"js1l2",
titulo:"La consola y tu primer script",
claves:["La consola del navegador (F12) ejecuta JavaScript al momento","console.log muestra valores; es la herramienta de depuración básica","Un script se carga en HTML con &lt;script src&gt; y defer, o como módulo con type=\"module\""],
pasos:[
 {t:"info", eti:"Probar al instante", h:"La consola",
  c:`<p>Abre cualquier web, pulsa <b>F12</b> y ve a la pestaña <b>Consola</b>. Escribe y pulsa Enter:</p>
     <div class="termbox">&gt; 2 + 3
5
&gt; console.log("Hola, Catappa")
Hola, Catappa
&gt; "catappa".toUpperCase()
'CATAPPA'</div>
     <p>Con Node.js instalado, escribir <code>node</code> en la terminal abre una consola equivalente (REPL). Y <code>node app.js</code> ejecuta un fichero.</p>
     <p>Además de <code>console.log</code> tienes <code>console.error</code> (sale en rojo y va a la salida de errores), <code>console.warn</code> y <code>console.table</code> (pinta un array de objetos como tabla).</p>`},
 {t:"term", p:"Estás en la consola. Muestra el texto <code>Hola</code> con console.log",
  prompt:">", sol:["console.log(\"Hola\")","console.log('Hola')","console.log(\"Hola\");","console.log('Hola');","console.log(`Hola`)","console.log(`Hola`);"],
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
     <div class="dg dg-tabla-caja"><div class="dg-tit">cómo se carga cada script</div>
<table class="dg-tabla"><thead><tr><th>atributo</th><th>descarga</th><th>ejecución</th></tr></thead><tbody>
<tr><td>(ninguno)</td><td>bloquea el HTML</td><td>al momento, en orden</td></tr>
<tr><td>defer</td><td>en paralelo</td><td>con el HTML ya leído, en orden</td></tr>
<tr><td>async</td><td>en paralelo</td><td>en cuanto llega, sin orden</td></tr>
<tr><td>type="module"</td><td>en paralelo</td><td>como defer, y permite import</td></tr>
</tbody></table></div>`},
 {t:"opcion", p:"Tu script busca un botón y obtiene <code>null</code>. El <code>&lt;script&gt;</code> está en el <code>&lt;head&gt;</code> sin atributos. ¿Por qué?",
  ops:["El botón no existe","El script se ejecuta antes de que el navegador haya leído el HTML del botón; usa defer o ponlo al final del body","console.log está roto","Falta un punto y coma"],
  ok:1, why:"El navegador procesa la página de arriba abajo."},
 {t:"par", p:"Empareja cada método de consola con su uso",
  pares:[["console.log","Mostrar valores mientras depuras"],["console.error","Mostrar un error (en rojo, a la salida de errores)"],["console.table","Pintar un array de objetos como tabla"],["console.time / timeEnd","Medir cuánto tarda un trozo de código"]],
  why:"console.table es perfecto para inspeccionar la respuesta de una API de un vistazo."},
 {t:"codigo", p:"Imprime tres líneas: <code>uno</code>, <code>dos</code> y <code>tres</code>",
  lenguaje:"js",
  c:`<p>Cada <code>console.log</code> escribe una línea.</p>`,
  plantilla:`console.log("uno");
// añade las otras dos
`,
  pruebas:[{salida:"uno\ndos\ntres"}],
  pista:"Tres llamadas a console.log, una por línea.",
  solucion:`console.log("uno");
console.log("dos");
console.log("tres");`,
  why:"La salida se compara línea a línea: el orden importa."},
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
puntos += 5;                // atajo: puntos = puntos + 5
puntos++;                   // suma 1
nombre = "Eva";             // TypeError: Assignment to constant variable.</div>
     <p>Regla práctica: usa <b>const</b> siempre, y <b>let</b> solo cuando sepas que el valor va a cambiar. Así, al leer el código, sabes qué puede cambiar y qué no.</p>
     <p><code>var</code> es la forma de antes de 2015: tiene reglas de ámbito confusas. No la uses en código nuevo.</p>
     <p>Nombres: <b>camelCase</b> (<code>precioTotal</code>), sin empezar por número, distinguiendo mayúsculas (<code>total</code> y <code>Total</code> son distintas). Las constantes «de configuración» suelen ir en mayúsculas: <code>MAX_INTENTOS</code>.</p>`},
 {t:"info", eti:"Ojo", h:"const no significa inmutable",
  c:`<div class="termbox">const carrito = [];
carrito.push("teclado");     // permitido: se modifica el contenido
carrito = [];                // error: no se puede reasignar la variable</div>
     <p><code>const</code> impide <b>reasignar</b> la variable, no modificar el objeto al que apunta. La variable guarda una <i>referencia</i> al array; el array en sí puede cambiar.</p>
     <div class="nota ojo"><b class="tit">Ámbito de bloque</b>let y const solo existen dentro de las llaves <code>{ }</code> donde se declaran. Declarar dos veces el mismo nombre con let en el mismo bloque es un error de sintaxis.</div>`},
 {t:"par", p:"Empareja cada declaración con su comportamiento",
  pares:[["const","No se puede reasignar; ámbito de bloque"],["let","Se puede reasignar; ámbito de bloque"],["var","Antigua: ámbito de función y se «eleva» (hoisting)"]],
  why:"Ámbito de bloque: la variable solo existe dentro de las llaves donde se declara."},
 {t:"escribe", p:"Declara una constante llamada <code>iva</code> con valor 0.21",
  sol:["const iva = 0.21;","const iva = 0.21","const iva=0.21;","const iva=0.21"], ph:"const ...", pista:"const, nombre, = y el valor.", why:"const iva = 0.21;"},
 {t:"opcion", p:"¿Qué ocurre?", c:`<div class="termbox">const lista = [1, 2];
lista.push(3);
console.log(lista);</div>`,
  ops:["Error: lista es const","Imprime [1, 2, 3]","Imprime [1, 2]","Imprime undefined"],
  ok:1, why:"Se modifica el array, no se reasigna la variable."},
 {t:"opcion", p:"¿Qué ocurre?", c:`<div class="termbox">let x = 1;
{
  let x = 2;
  console.log(x);
}
console.log(x);</div>`,
  ops:["Error: x ya está declarada","Imprime 2 y luego 1","Imprime 2 y luego 2","Imprime 1 y luego 1"],
  ok:1, why:"El x de dentro del bloque es otra variable que «tapa» (shadowing) a la de fuera solo dentro de las llaves."},
 {t:"codigo", p:"Parte de <code>puntos = 10</code>, súmale 5, luego multiplícalo por 2 e imprime el resultado",
  lenguaje:"js",
  plantilla:`let puntos = 10;
// suma 5, multiplica por 2 e imprime
`,
  pruebas:[{salida:"30"}],
  pista:"puntos += 5; puntos *= 2; console.log(puntos);",
  solucion:`let puntos = 10;
puntos += 5;
puntos *= 2;
console.log(puntos);`,
  why:"+=, -=, *= y /= son atajos de «operar y reasignar»; por eso puntos tiene que ser let."}
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
null             // "sin valor" puesto a propósito
10n              // bigint: enteros enormes
Symbol("id")     // symbol: identificador único

{ nombre: "Ana" }   // object
[1, 2, 3]           // object (array)
function () {}      // object (función; typeof dice "function")</div>
     <p>JavaScript es de <b>tipado dinámico</b>: una variable puede guardar un número y luego un texto. Esto da flexibilidad y también muchos errores; por eso existe TypeScript.</p>
     <p>Los <b>primitivos</b> son inmutables y se copian por valor. Los <b>objetos</b> se manejan por referencia: dos variables pueden apuntar al mismo objeto.</p>`},
 {t:"par", p:"Empareja cada expresión con lo que devuelve <code>typeof</code>",
  pares:[["typeof \"hola\"","\"string\""],["typeof 42","\"number\""],["typeof true","\"boolean\""],["typeof undefined","\"undefined\""],["typeof null","\"object\" (un fallo histórico del lenguaje)"],["typeof [1, 2]","\"object\" (usa Array.isArray)"]],
  why:"typeof null === \"object\" es un error de 1995 que no se puede corregir sin romper la web. Para arrays, Array.isArray(x)."},
 {t:"info", eti:"Dos vacíos", h:"undefined y null",
  c:`<ul><li><b>undefined</b>: «no tiene valor todavía». Variables sin asignar, propiedades que no existen, funciones sin return.</li>
     <li><b>null</b>: «no hay valor», puesto a propósito por el programador.</li></ul>
     <div class="termbox">let x;
console.log(x);              // undefined
const usuario = { nombre: "Ana" };
console.log(usuario.email);  // undefined
const seleccionado = null;   // todavía no hay nada seleccionado</div>`},
 {t:"opcion", p:"¿Qué muestra <code>console.log(0.1 + 0.2)</code>?",
  ops:["0.3","0.30000000000000004","Error","NaN"],
  ok:1, why:"Los number son decimales binarios de 64 bits (IEEE 754), igual que double en Java. Para dinero, trabaja en céntimos enteros."},
 {t:"opcion", p:"¿Cómo compruebas de forma fiable que <code>datos</code> es un array?",
  ops:["typeof datos === \"array\"","Array.isArray(datos)","datos instanceof Object","typeof datos === \"object\""],
  ok:1, why:"typeof nunca devuelve \"array\"; y un objeto normal también es \"object\"."},
 {t:"codigo", p:"Imprime el <code>typeof</code> de cada valor del array, uno por línea",
  lenguaje:"js",
  c:`<p>Salida esperada:</p><div class="termbox">string
number
boolean
undefined
object
bigint</div>`,
  plantilla:`const valores = ["hola", 42, true, undefined, null, 10n];
// recorre valores e imprime typeof de cada uno
`,
  pruebas:[{salida:"string\nnumber\nboolean\nundefined\nobject\nbigint"}],
  pista:"for (const v of valores) console.log(typeof v);",
  solucion:`const valores = ["hola", 42, true, undefined, null, 10n];
for (const v of valores) console.log(typeof v);`,
  why:"Fíjate en null: typeof dice \"object\". Para comprobar null, compara directamente: x === null."},
 {t:"vf", p:"En JavaScript hay un tipo distinto para enteros y otro para decimales.",
  ok:false, why:"Ambos son number. Solo bigint es un tipo aparte para enteros muy grandes."}
]},

{
id:"js1l5",
titulo:"Practica: tu primer código en el navegador",
claves:["console.log() imprime en la consola","En Catappa el código se ejecuta con Node en el servidor","Los casos de prueba comparan la salida exacta, y algunos te pasan datos por la entrada estándar"],
pasos:[
 {t:"info", eti:"Novedad", h:"Escribe JavaScript de verdad",
  c:`<p>En los pasos de <b>código</b> escribes JavaScript y Catappa lo ejecuta con <b>Node</b>, el mismo motor que usarás en el servidor. Lo que imprimas con <code>console.log()</code> es lo que se compara con la salida esperada.</p>
     <p>Algunas pruebas son <b>ocultas</b> y te pasan datos por la <b>entrada estándar</b> (stdin), como si alguien los tecleara. Se leen así:</p>
     <div class="termbox">const entrada = require("fs").readFileSync(0, "utf8").trim();
// si la entrada es "5\n", entrada vale "5" (texto)
const n = Number(entrada);</div>
     <p>El <code>0</code> es el descriptor de la entrada estándar. Lo que llega siempre es <b>texto</b>: conviértelo a número con <code>Number()</code>.</p>`},

 {t:"codigo", p:"Imprime exactamente <code>Hola, Catappa</code>",
  lenguaje:"js",
  plantilla:"// escribe tu código aquí\n",
  pruebas:[{salida:"Hola, Catappa"}],
  pista:"console.log(\"Hola, Catappa\");",
  solucion:"console.log(\"Hola, Catappa\");",
  why:"console.log() escribe una línea en la salida."},

 {t:"codigo", p:"Declara <code>precio = 20</code> e <code>iva = 0.21</code> e imprime el total con IVA",
  lenguaje:"js",
  c:`<p>El resultado esperado es <code>24.2</code>. En JavaScript, <code>20 * 1.21</code> da <code>24.2</code>.</p>`,
  plantilla:"const precio = 20;\nconst iva = 0.21;\n// imprime el total\n",
  pruebas:[{salida:"24.2"}],
  pista:"El total es precio + precio * iva, o precio * (1 + iva).",
  solucion:"const precio = 20;\nconst iva = 0.21;\nconsole.log(precio * (1 + iva));",
  why:"Cuidado con los decimales: 20 * 1.21 da 24.2, pero otras operaciones pueden dar 24.200000000000003."},

 {t:"codigo", p:"Escribe una función <code>doble(n)</code> que devuelva el doble y muestra <code>doble(21)</code>",
  lenguaje:"js",
  plantilla:"function doble(n) {\n  // devuelve el doble\n}\nconsole.log(doble(21));\n",
  pruebas:[{salida:"42"}],
  pista:"return n * 2; dentro de la función.",
  solucion:"function doble(n) {\n  return n * 2;\n}\nconsole.log(doble(21));",
  why:"Sin return, la función devuelve undefined y se imprimiría «undefined»."},

 {t:"codigo", p:"Lee un nombre de la entrada estándar e imprime <code>Hola, &lt;nombre&gt;!</code>",
  lenguaje:"js",
  c:`<p>Con la entrada <code>Ana</code> debe imprimir <code>Hola, Ana!</code>. Usa una plantilla de texto con comillas invertidas.</p>`,
  plantilla:`const nombre = require("fs").readFileSync(0, "utf8").trim();
// imprime el saludo
`,
  pruebas:[{entrada:"Ana\n", salida:"Hola, Ana!"},{entrada:"Pablo\n", salida:"Hola, Pablo!", oculta:true}],
  pista:"console.log(`Hola, ${nombre}!`);",
  solucion:`const nombre = require("fs").readFileSync(0, "utf8").trim();
console.log(\`Hola, \${nombre}!\`);`,
  why:"trim() quita el salto de línea final que trae la entrada; sin él, el ! saldría en la línea siguiente."},

 {t:"codigo", p:"Lee un número de la entrada e imprime su cuadrado",
  lenguaje:"js",
  c:`<p>Con la entrada <code>7</code> debe imprimir <code>49</code>.</p>`,
  plantilla:`const texto = require("fs").readFileSync(0, "utf8").trim();
// conviértelo a número e imprime su cuadrado
`,
  pruebas:[{entrada:"7\n", salida:"49"},{entrada:"12\n", salida:"144", oculta:true}],
  pista:"const n = Number(texto); console.log(n * n);",
  solucion:`const texto = require("fs").readFileSync(0, "utf8").trim();
const n = Number(texto);
console.log(n * n);`,
  why:"Si olvidas Number(), \"7\" * \"7\" daría 49 igualmente (el * convierte), pero \"7\" + \"7\" daría \"77\". Convierte siempre de forma explícita."},

 {t:"vf", p:"Lo que se lee de la entrada estándar llega como número si el usuario escribe un número.",
  ok:false, why:"Siempre llega como texto (string). Hay que convertirlo con Number() o parseInt()."}
]}

]});
