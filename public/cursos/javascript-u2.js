window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Operadores, textos y decisiones",
resumen: "Operadores, == frente a ===, coerción de tipos, textos y números, if, switch, bucles y expresiones regulares",
nivel: "Fundamentos",
color: "#e8d44d",
lecciones: [

{
id:"js2l1",
titulo:"Operadores y comparación",
claves:["Usa siempre === y !== (comparación estricta, sin conversión de tipos)","&& y || devuelven uno de los operandos; ?? solo reemplaza null y undefined","?. accede a propiedades sin fallar si algo es null o undefined"],
pasos:[
 {t:"info", eti:"Comparar bien", h:"== frente a ===",
  c:`<div class="termbox">5 == "5"       // true   (convierte tipos: peligroso)
5 === "5"      // false  (tipo distinto)
0 == false     // true
"" == 0        // true
null == undefined   // true
null === undefined  // false</div>
     <p><code>==</code> intenta convertir los tipos antes de comparar, con reglas difíciles de recordar. <b>Usa siempre <code>===</code></b>. La única excepción aceptada en muchos equipos: <code>x == null</code>, que es cierto tanto para <code>null</code> como para <code>undefined</code>.</p>
     <p>Operadores aritméticos: <code>+ - * /</code>, <code>%</code> (resto: <code>7 % 3</code> es 1) y <code>**</code> (potencia: <code>2 ** 10</code> es 1024).</p>`},
 {t:"info", eti:"Valores por defecto", h:"&&, ||, ?? y ?.",
  c:`<p><code>&amp;&amp;</code> y <code>||</code> no devuelven <code>true</code> o <code>false</code>: devuelven <b>uno de los operandos</b> y dejan de evaluar en cuanto saben el resultado (cortocircuito).</p>
     <div class="termbox">const nombre = entrada || "Invitado";    // si entrada es "falsy" ("" 0 null undefined NaN false)
const cantidad = entrada ?? 1;          // solo si entrada es null o undefined
const ciudad = usuario?.direccion?.ciudad;   // undefined si algo intermedio falta, sin error
usuario.onGuardar?.();                  // llama solo si la función existe
logueado &amp;&amp; mostrarMenu();              // solo llama si logueado es truthy

opciones.limite ??= 10;                 // asigna solo si es null o undefined
contador ||= 1;                         // asigna si es falsy</div>
     <p>Diferencia clave: con <code>0 || 1</code> obtienes 1 (0 es falsy); con <code>0 ?? 1</code> obtienes 0.</p>`},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["5 === \"5\"","false"],["5 == \"5\"","true"],["0 || \"x\"","\"x\""],["0 ?? \"x\"","0"],["null?.nombre","undefined"],["\"a\" && \"b\"","\"b\""]],
  why:"&& devuelve el primer falsy o, si no hay, el último operando. ?? y ?. llegaron en ES2020 y simplifican muchísimo el código defensivo."},
 {t:"opcion", p:"Un formulario permite 0 unidades. ¿Qué expresión respeta el 0 y solo pone 1 si no hay valor?",
  ops:["unidades || 1","unidades ?? 1","unidades &amp;&amp; 1","!unidades"],
  ok:1, why:"|| trataría el 0 como falta de valor."},
 {t:"hueco", p:"Completa para leer el código postal sin fallar si falta la dirección, y poner <code>\"—\"</code> si no hay",
  tpl:"const cp = cliente___direccion___cp ___ \"—\";", banco:["?.","?.","??","||","."], sol:["?.","?.","??"],
  why:"?. corta la cadena y devuelve undefined si algo falta; ?? pone el valor por defecto solo en ese caso."},
 {t:"codigo", p:"Imprime el resto de dividir 17 entre 5 y después 2 elevado a 10",
  lenguaje:"js",
  plantilla:`// imprime 17 % 5 y 2 ** 10, uno por línea
`,
  pruebas:[{salida:"2\n1024"}],
  pista:"console.log(17 % 5); console.log(2 ** 10);",
  solucion:`console.log(17 % 5);
console.log(2 ** 10);`,
  why:"% se usa muchísimo: saber si un número es par (n % 2 === 0), repartir en columnas, hacer ciclos."},
 {t:"vf", p:"<code>NaN === NaN</code> es <code>true</code>.",
  ok:false, why:"NaN no es igual a nada, ni a sí mismo. Se comprueba con Number.isNaN(x) (o Object.is(x, NaN))."}
]},

{
id:"js2l2",
titulo:"Truthy, falsy y conversiones",
claves:["Valores falsy: false, 0, -0, 0n, \"\", null, undefined, NaN","Todo lo demás es truthy, incluidos [] y {}","La coerción implícita tiene reglas: + con un texto concatena; - * / convierten a número"],
pasos:[
 {t:"info", eti:"Verdadero o falso", h:"Truthy y falsy",
  c:`<p>En un <code>if</code>, JavaScript convierte cualquier valor a booleano. Solo estos son <b>falsy</b>:</p>
     <div class="termbox">false   0   -0   0n   ""   null   undefined   NaN</div>
     <p>Todo lo demás es <b>truthy</b>, incluidos <code>"0"</code>, <code>"false"</code>, <code>[]</code> y <code>{}</code>.</p>
     <div class="termbox">if (lista.length) { ... }        // se ejecuta si la lista NO está vacía
if ([]) { ... }                  // SIEMPRE se ejecuta: un array vacío es truthy
const tieneNombre = !!nombre;    // !! convierte a booleano</div>`},
 {t:"opcion", p:"¿Cuál de estos valores es falsy?",
  ops:["\"0\"","[]","\"\"","{}"],
  ok:2, why:"La cadena vacía es falsy; la cadena \"0\" no."},
 {t:"info", eti:"Coerción", h:"Cómo convierte JavaScript por su cuenta",
  c:`<div class="termbox">Number("42")      // 42
Number("")        // 0      (¡ojo!)
Number("42abc")   // NaN
Number(null)      // 0
Number(undefined) // NaN
parseInt("42px")  // 42 (lee hasta donde puede)
parseFloat("3.5€")// 3.5
String(42)        // "42"
"5" + 3           // "53"  (con un texto, + concatena)
"5" - 3           // 2     (- convierte a número)
"5" * "2"         // 10
[1, 2] + ""       // "1,2" (los objetos se convierten primero a primitivo)
{} + []           // depende de dónde lo escribas: evita estas cosas</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">reglas que sí conviene saber</div>
<table class="dg-tabla"><tbody>
<tr><td>+ con algún texto</td><td>convierte el otro a texto y concatena</td></tr>
<tr><td>- * / % **</td><td>convierten ambos a número</td></tr>
<tr><td>if, !, &amp;&amp;, ||</td><td>convierten a booleano (truthy/falsy)</td></tr>
<tr><td>objeto a primitivo</td><td>llama a valueOf() y luego a toString()</td></tr>
<tr><td>== entre tipos distintos</td><td>casi siempre acaba comparando números</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["\"5\" + 3","\"53\""],["\"5\" - 3","2"],["Number(\"abc\")","NaN"],["parseInt(\"12px\")","12"],["Boolean(\"0\")","true"],["Number(\"\")","0"]],
  why:"Las conversiones implícitas son fuente de errores sutiles: convierte explícitamente."},
 {t:"opcion", p:"Un campo de formulario vacío llega como <code>\"\"</code> y haces <code>const edad = Number(campo)</code>. ¿Qué pasa?",
  ops:["edad es NaN","edad es 0, y un campo vacío pasa por una edad válida","edad es undefined","Lanza un error"],
  ok:1, why:"Number(\"\") es 0. Comprueba antes si el texto está vacío (campo.trim() === \"\")."},
 {t:"codigo", p:"Cuenta cuántos valores del array son falsy e imprime el número",
  lenguaje:"js",
  plantilla:`const valores = [0, "0", "", [], null, "false", NaN, {}, undefined, -1];
let falsy = 0;
// recorre y cuenta
console.log(falsy);
`,
  pruebas:[{salida:"5"}],
  pista:"for (const v of valores) if (!v) falsy++;",
  solucion:`const valores = [0, "0", "", [], null, "false", NaN, {}, undefined, -1];
let falsy = 0;
for (const v of valores) if (!v) falsy++;
console.log(falsy);`,
  why:"Son falsy 0, \"\", null, NaN y undefined. \"0\", \"false\", [], {} y -1 son truthy."},
 {t:"vf", p:"Un array vacío <code>[]</code> es falsy.",
  ok:false, why:"Es truthy. Para saber si está vacío: lista.length === 0."}
]},

{
id:"js2l3",
titulo:"Textos y números",
claves:["Template literals con comillas invertidas: `Hola ${nombre}`","Métodos de texto: includes, startsWith, slice, split, trim, replaceAll, padStart","number es un double de 64 bits: enteros seguros hasta 2^53 − 1; para más, bigint"],
pasos:[
 {t:"info", eti:"Plantillas", h:"Template literals",
  c:`<div class="termbox">const nombre = "Ana";
const total = 42.5;
const mensaje = \`Hola, \${nombre}. Tu pedido suma \${total.toFixed(2)} €\`;
// "Hola, Ana. Tu pedido suma 42.50 €"

const html = \`
  &lt;li class="item"&gt;
    \${nombre}
  &lt;/li&gt;\`;   // multilínea</div>
     <p>Los textos son <b>inmutables</b>: ningún método cambia el original, todos devuelven uno nuevo.</p>`},
 {t:"info", eti:"Métodos", h:"Trabajar con textos",
  c:`<div class="termbox">"Catappa".length                   // 7
"hola mundo".includes("mundo")   // true
"archivo.pdf".endsWith(".pdf")   // true
"JavaScript".slice(0, 4)         // "Java"
"JavaScript".slice(-6)           // "Script"
"a,b,c".split(",")               // ["a", "b", "c"]
"  hola ".trim()                 // "hola"
"a-b-c".replaceAll("-", "/")     // "a/b/c"
"7".padStart(3, "0")             // "007"
"ab".repeat(3)                   // "ababab"
"Ana".at(-1)                     // "a"
"ÁRBOL".toLowerCase()            // "árbol"
"b".localeCompare("a", "es")     // 1 (para ordenar con tildes)</div>`},
 {t:"hueco", p:"Completa la plantilla para insertar la variable <code>usuario</code>",
  tpl:"const saludo = `Bienvenido, ___`;", banco:["${usuario}","{usuario}","$usuario","#{usuario}"], sol:["${usuario}"],
  why:"Dentro de las comillas invertidas, ${expresión} inserta su valor."},
 {t:"info", eti:"Números", h:"Precisión, Math e Intl",
  c:`<div class="termbox">Math.round(4.5)     // 5
Math.floor(4.9)     // 4
Math.trunc(-4.9)    // -4
Math.max(3, 9, 2)   // 9
Math.random()       // entre 0 (incluido) y 1 (excluido)
(12.345).toFixed(2) // "12.35" (devuelve TEXTO)
Number.isInteger(5.0)          // true
Number.MAX_SAFE_INTEGER        // 9007199254740991 (2^53 - 1)
9007199254740993n + 1n         // bigint: 9007199254740994n
1 / 0                          // Infinity

new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(1234.5)
// "1234,50 €"</div>
     <div class="nota ojo"><b class="tit">Dinero</b>Nunca sumes euros con decimales: <code>0.1 + 0.2</code> no da 0.3. Guarda <b>céntimos enteros</b> (1999 en vez de 19.99) y formatea solo al mostrar.</div>`},
 {t:"opcion", p:"¿Qué devuelve <code>(9.99).toFixed(1)</code>?",
  ops:["10","\"10.0\"","9.9","\"9.99\""],
  ok:1, why:"toFixed redondea y devuelve un string."},
 {t:"codigo", p:"Lee un nombre completo de la entrada e imprime sus iniciales en mayúsculas, separadas por puntos",
  lenguaje:"js",
  c:`<p>Con la entrada <code>ada lovelace</code> debe imprimir <code>A.L.</code></p>`,
  plantilla:`const nombre = require("fs").readFileSync(0, "utf8").trim();
// imprime las iniciales
`,
  pruebas:[{entrada:"ada lovelace\n", salida:"A.L."},{entrada:"grace brewster hopper\n", salida:"G.B.H.", oculta:true}],
  pista:"split(\" \"), toma la primera letra de cada parte con [0] o at(0), pásala a mayúsculas y añade un punto.",
  solucion:`const nombre = require("fs").readFileSync(0, "utf8").trim();
let iniciales = "";
for (const parte of nombre.split(" ")) iniciales += parte[0].toUpperCase() + ".";
console.log(iniciales);`,
  why:"split, acceso por índice y toUpperCase: tres métodos que usarás a diario."},
 {t:"codigo", p:"Tienes precios en céntimos. Imprime el total en euros con dos decimales y un espacio y € al final",
  lenguaje:"js",
  c:`<p>La suma de <code>[1999, 250, 5]</code> es 2254 céntimos: debe imprimir <code>22.54 €</code>.</p>`,
  plantilla:`const centimos = [1999, 250, 5];
// suma en céntimos y luego formatea
`,
  pruebas:[{salida:"22.54 €"}],
  pista:"Suma los enteros, divide entre 100 y usa toFixed(2).",
  solucion:`const centimos = [1999, 250, 5];
let total = 0;
for (const c of centimos) total += c;
console.log((total / 100).toFixed(2) + " €");`,
  why:"Sumar enteros es exacto; solo al final se divide y se formatea. Así nunca aparecen los 0.30000000000000004."}
]},

{
id:"js2l4",
titulo:"Condiciones y bucles",
claves:["if/else, el ternario y switch como en otros lenguajes","for...of recorre valores de arrays y cadenas; for...in recorre claves de objetos","break y continue controlan los bucles"],
pasos:[
 {t:"info", eti:"Decidir", h:"if, ternario y switch",
  c:`<div class="termbox">if (edad &gt;= 18) {
  acceso = "completo";
} else if (edad &gt;= 14) {
  acceso = "limitado";
} else {
  acceso = "ninguno";
}

const etiqueta = stock &gt; 0 ? "Disponible" : "Agotado";

switch (estado) {          // compara con ===
  case "pagado":
  case "enviado":
    mostrarSeguimiento();
    break;
  default:
    mostrarPago();
}</div>
     <p>Estilo profesional: <b>retorno temprano</b>. En vez de anidar <code>if</code> dentro de <code>if</code>, sal de la función en cuanto algo no cumpla (<code>if (!usuario) return;</code>) y deja el caso normal sin sangrar.</p>`},
 {t:"info", eti:"Repetir", h:"Bucles",
  c:`<div class="termbox">for (let i = 0; i &lt; 3; i++) { ... }

for (const producto of productos) {       // VALORES de un array
  if (producto.oculto) continue;          // salta a la siguiente vuelta
  if (producto.id === buscado) break;     // sale del bucle
  console.log(producto.nombre);
}

for (const clave in usuario) {            // CLAVES de un objeto
  console.log(clave, usuario[clave]);
}

while (cola.length &gt; 0) { procesar(cola.shift()); }
do { intento++; } while (!ok &amp;&amp; intento &lt; 3);   // al menos una vez</div>`},
 {t:"par", p:"Empareja cada bucle con lo que recorre",
  pares:[["for...of","Los valores de un array, string, Map o Set"],["for...in","Las claves de un objeto"],["for clásico","Un contador con inicio, condición y paso"],["while","Mientras una condición sea cierta"],["do...while","Al menos una vez y luego mientras se cumpla"]],
  why:"Para arrays, for...of (o sus métodos como forEach y map); for...in está pensado para objetos y además recorre propiedades heredadas."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">for (const letra of "sol") {
  console.log(letra);
}</div>`,
  ops:["sol","s, o, l (una por línea)","0, 1, 2","Error"],
  ok:1, why:"Las cadenas son iterables: for...of recorre sus caracteres."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">for (const i in ["a", "b"]) {
  console.log(typeof i);
}</div>`,
  ops:["number y number","string y string","undefined","a y b"],
  ok:1, why:"for...in da las claves como texto (\"0\", \"1\"). Otro motivo para no usarlo con arrays."},
 {t:"codigo", p:"FizzBuzz: lee n e imprime del 1 al n, cambiando múltiplos de 3 por Fizz, de 5 por Buzz y de ambos por FizzBuzz",
  lenguaje:"js",
  c:`<p>Con <code>5</code>: <code>1, 2, Fizz, 4, Buzz</code>, uno por línea.</p>`,
  plantilla:`const n = Number(require("fs").readFileSync(0, "utf8").trim());
for (let i = 1; i <= n; i++) {
  // decide qué imprimir
}
`,
  pruebas:[{entrada:"5\n", salida:"1\n2\nFizz\n4\nBuzz"},{entrada:"15\n", salida:"1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", oculta:true}],
  pista:"Comprueba primero el caso de 15 (i % 15 === 0), luego 3 y luego 5.",
  solucion:`const n = Number(require("fs").readFileSync(0, "utf8").trim());
for (let i = 1; i <= n; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`,
  why:"El orden de las condiciones importa: si compruebas 3 antes que 15, nunca llegarás a FizzBuzz."},
 {t:"vf", p:"En un <code>switch</code> de JavaScript, olvidar el <code>break</code> hace que se ejecute también el caso siguiente.",
  ok:true, why:"Igual que en el switch clásico de Java o C (fall-through)."}
]},

{
id:"js2n1",
titulo:"Expresiones regulares",
claves:["Una expresión regular describe un patrón de texto: /^\\d{5}$/","test comprueba, match y matchAll extraen, replace sustituye","Flags: g (todas), i (sin mayúsculas), u y v (Unicode), s, m y d; grupos con nombre (?&lt;año&gt;…)"],
pasos:[
 {t:"info", eti:"Patrones", h:"Qué es una expresión regular",
  c:`<div class="termbox">const cp = /^\\d{5}$/;             // exactamente 5 dígitos
cp.test("28013");                  // true
cp.test("2801");                   // false

"Pedido 42 y 7".match(/\\d+/g);     // ["42", "7"]
"2026-09-23".replace(/(\\d+)-(\\d+)-(\\d+)/, "$3/$2/$1");   // "23/09/2026"

const fecha = /(?&lt;año&gt;\\d{4})-(?&lt;mes&gt;\\d{2})/.exec("2026-09");
fecha.groups.año;                  // "2026"

for (const m of "a=1;b=2".matchAll(/(\\w)=(\\d)/g)) console.log(m[1], m[2]);</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">piezas básicas</div>
<table class="dg-tabla"><tbody>
<tr><td>\\d \\w \\s</td><td>dígito, letra/dígito/guion bajo, espacio</td></tr>
<tr><td>.</td><td>cualquier carácter (menos salto de línea sin la flag s)</td></tr>
<tr><td>[abc] [^abc] [a-z]</td><td>uno de, ninguno de, rango</td></tr>
<tr><td>* + ? {2,4}</td><td>0 o más, 1 o más, 0 o 1, entre 2 y 4</td></tr>
<tr><td>^ $</td><td>inicio y fin del texto (o de línea con m)</td></tr>
<tr><td>( ) (?:) (?&lt;n&gt;)</td><td>grupo, grupo sin captura, grupo con nombre</td></tr>
<tr><td>a|b</td><td>una cosa u otra</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja cada flag con su efecto",
  pares:[["g","Buscar todas las coincidencias, no solo la primera"],["i","Ignorar mayúsculas y minúsculas"],["m","^ y $ funcionan por línea"],["s","El punto también encaja con saltos de línea"],["u","Modo Unicode: emojis y \\p{L} para letras de cualquier idioma"]],
  why:"La flag v (ES2024) amplía u con operaciones de conjuntos en las clases de caracteres."},
 {t:"opcion", p:"¿Qué expresión valida un texto que sea SOLO un número de 3 a 5 dígitos?",
  ops:["/\\d{3,5}/","/^\\d{3,5}$/","/[3-5]/","/^\\d+$/"],
  ok:1, why:"Sin ^ y $, /\\d{3,5}/ también acepta \"abc1234xyz\" porque busca el patrón en cualquier parte."},
 {t:"codigo", p:"Lee un texto y extrae todos los números que aparezcan, imprimiendo su suma",
  lenguaje:"js",
  c:`<p>Con <code>3 cafés, 12 tostadas y 1 zumo</code> debe imprimir <code>16</code>. Si no hay números, <code>0</code>.</p>`,
  plantilla:`const texto = require("fs").readFileSync(0, "utf8");
// extrae los números con una expresión regular y súmalos
`,
  pruebas:[{entrada:"3 cafés, 12 tostadas y 1 zumo\n", salida:"16"},{entrada:"sin números\n", salida:"0", oculta:true},{entrada:"100 y 250\n", salida:"350", oculta:true}],
  pista:"texto.match(/\\d+/g) devuelve un array de textos o null. Usa ?? [] para el caso sin números.",
  solucion:`const texto = require("fs").readFileSync(0, "utf8");
const numeros = texto.match(/\\d+/g) ?? [];
let suma = 0;
for (const n of numeros) suma += Number(n);
console.log(suma);`,
  why:"match con la flag g devuelve null cuando no hay coincidencias, no un array vacío: el ?? [] evita el TypeError."},
 {t:"codigo", p:"Valida emails de forma sencilla: imprime <code>válido</code> o <code>no válido</code> para cada línea de la entrada",
  lenguaje:"js",
  c:`<p>Regla simplificada: algo sin espacios ni @, una @, algo sin espacios ni @, un punto y al menos dos letras. Ejemplo: <code>ana@correo.es</code> es válido; <code>ana@correo</code> y <code>ana correo@x.com</code> no.</p>`,
  plantilla:`const lineas = require("fs").readFileSync(0, "utf8").trim().split("\\n");
const email = /cambia-esto/;
for (const l of lineas) console.log(email.test(l) ? "válido" : "no válido");
`,
  pruebas:[{entrada:"ana@correo.es\nana@correo\n", salida:"válido\nno válido"},{entrada:"ana correo@x.com\nb.c@d.org\n@x.com\n", salida:"no válido\nválido\nno válido", oculta:true}],
  pista:"/^[^\\s@]+@[^\\s@]+\\.[a-z]{2,}$/i",
  solucion:`const lineas = require("fs").readFileSync(0, "utf8").trim().split("\\n");
const email = /^[^\\s@]+@[^\\s@]+\\.[a-z]{2,}$/i;
for (const l of lineas) console.log(email.test(l) ? "válido" : "no válido");`,
  why:"Validar emails «perfectamente» con una regex es imposible en la práctica: compruebas la forma básica y confirmas enviando un correo."},
 {t:"vf", p:"Una expresión regular con la flag <code>g</code> guardada en una constante y usada con <code>test</code> varias veces puede dar resultados alternos.",
  ok:true, why:"Con g, la regex guarda lastIndex entre llamadas. Para test, no uses g; o crea la regex cada vez."},
 {t:"opcion", p:"Tu validación con <code>/^(a+)+$/</code> tarda minutos con ciertos textos largos y bloquea el servidor. ¿Qué pasa?",
  ops:["Node es lento con regex","Retroceso catastrófico (ReDoS): cuantificadores anidados prueban una cantidad exponencial de combinaciones","Falta la flag g","El texto tiene tildes"],
  ok:1, why:"Evita cuantificadores anidados sobre lo mismo, limita la longitud de la entrada y revisa las regex con herramientas de análisis."}
]}

]});
