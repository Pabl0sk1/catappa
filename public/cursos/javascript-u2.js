window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Operadores, textos y decisiones",
resumen: "Operadores, == frente a ===, truthy y falsy, textos y plantillas, números, if, switch y bucles",
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
     <p><code>==</code> intenta convertir los tipos antes de comparar, con reglas difíciles de recordar. <b>Usa siempre <code>===</code></b>.</p>`},
 {t:"info", eti:"Valores por defecto", h:"||, ?? y ?.",
  c:`<div class="termbox">const nombre = entrada || "Invitado";    // si entrada es "falsy" ("" 0 null undefined NaN false)
const cantidad = entrada ?? 1;          // solo si entrada es null o undefined
const ciudad = usuario?.direccion?.ciudad;   // undefined si algo intermedio falta, sin error</div>
     <p>Diferencia clave: con <code>cantidad = 0 || 1</code> obtienes 1 (0 es falsy); con <code>0 ?? 1</code> obtienes 0.</p>`},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["5 === \"5\"","false"],["5 == \"5\"","true"],["0 || \"x\"","\"x\""],["0 ?? \"x\"","0"],["null?.nombre","undefined"]],
  why:"?? y ?. llegaron en ES2020 y simplifican muchísimo el código defensivo."},
 {t:"opcion", p:"Un formulario permite 0 unidades. ¿Qué expresión respeta el 0 y solo pone 1 si no hay valor?",
  ops:["unidades || 1","unidades ?? 1","unidades && 1","!unidades"],
  ok:1, why:"|| trataría el 0 como falta de valor."},
 {t:"vf", p:"<code>NaN === NaN</code> es <code>true</code>.",
  ok:false, why:"NaN no es igual a nada, ni a sí mismo. Se comprueba con Number.isNaN(x)."}
]},

{
id:"js2l2",
titulo:"Truthy, falsy y conversiones",
claves:["Valores falsy: false, 0, -0, 0n, \"\", null, undefined, NaN","Todo lo demás es truthy, incluidos [] y {}","Convierte explícitamente: Number(), String(), Boolean()"],
pasos:[
 {t:"info", eti:"Verdadero o falso", h:"Truthy y falsy",
  c:`<p>En un <code>if</code>, JavaScript convierte cualquier valor a booleano. Solo estos son <b>falsy</b>:</p>
     <div class="termbox">false   0   -0   0n   ""   null   undefined   NaN</div>
     <p>Todo lo demás es <b>truthy</b>, incluidos <code>"0"</code>, <code>"false"</code>, <code>[]</code> y <code>{}</code>.</p>
     <div class="termbox">if (lista.length) { ... }        // se ejecuta si la lista NO esta vacia
if ([]) { ... }                  // SIEMPRE se ejecuta: un array vacio es truthy</div>`},
 {t:"opcion", p:"¿Cuál de estos valores es falsy?",
  ops:["\"0\"","[]","\"\"","{}"],
  ok:2, why:"La cadena vacía es falsy; la cadena \"0\" no."},
 {t:"info", eti:"Convertir", h:"Conversiones explícitas",
  c:`<div class="termbox">Number("42")      // 42
Number("42abc")   // NaN
parseInt("42px")  // 42 (lee hasta donde puede)
String(42)        // "42"
Boolean("")       // false
"5" + 3           // "53"  (con un texto, + concatena)
"5" - 3           // 2     (- convierte a numero)</div>`},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["\"5\" + 3","\"53\""],["\"5\" - 3","2"],["Number(\"abc\")","NaN"],["parseInt(\"12px\")","12"],["Boolean(\"0\")","true"]],
  why:"Las conversiones implícitas son fuente de errores sutiles: convierte explícitamente."},
 {t:"vf", p:"Un array vacío <code>[]</code> es falsy.",
  ok:false, why:"Es truthy. Para saber si está vacío: lista.length === 0."}
]},

{
id:"js2l3",
titulo:"Textos y números",
claves:["Template literals con comillas invertidas: `Hola ${nombre}`","Métodos de texto: includes, startsWith, slice, split, trim, replaceAll, padStart","Math y toFixed para números; Intl para formatear moneda y fechas"],
pasos:[
 {t:"info", eti:"Plantillas", h:"Template literals",
  c:`<div class="termbox">const nombre = "Ana";
const total = 42.5;
const mensaje = \`Hola, \${nombre}. Tu pedido suma \${total.toFixed(2)} €\`;
// "Hola, Ana. Tu pedido suma 42.50 €"

const html = \`
  &lt;li class="item"&gt;
    \${nombre}
  &lt;/li&gt;\`;   // multilinea</div>`},
 {t:"info", eti:"Métodos", h:"Trabajar con textos",
  c:`<div class="termbox">"Catappa".length                   // 5
"hola mundo".includes("mundo")   // true
"archivo.pdf".endsWith(".pdf")   // true
"JavaScript".slice(0, 4)         // "Java"
"a,b,c".split(",")               // ["a", "b", "c"]
"  hola ".trim()                 // "hola"
"a-b-c".replaceAll("-", "/")     // "a/b/c"
"7".padStart(3, "0")             // "007"</div>`},
 {t:"hueco", p:"Completa la plantilla para insertar la variable <code>usuario</code>",
  tpl:"const saludo = `Bienvenido, ___`;", banco:["${usuario}","{usuario}","$usuario","#{usuario}"], sol:["${usuario}"],
  why:"Dentro de las comillas invertidas, ${expresión} inserta su valor."},
 {t:"info", eti:"Números", h:"Math e Intl",
  c:`<div class="termbox">Math.round(4.5)     // 5
Math.floor(4.9)     // 4
Math.max(3, 9, 2)   // 9
Math.random()       // entre 0 y 1
(12.345).toFixed(2) // "12.35" (devuelve texto)

new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(1234.5)
// "1234,50 €"</div>`},
 {t:"opcion", p:"¿Qué devuelve <code>(9.99).toFixed(1)</code>?",
  ops:["10","\"10.0\"","9.9","\"9.99\""],
  ok:1, why:"toFixed redondea y devuelve un string."}
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

switch (estado) {
  case "pagado":
  case "enviado":
    mostrarSeguimiento();
    break;
  default:
    mostrarPago();
}</div>`},
 {t:"info", eti:"Repetir", h:"Bucles",
  c:`<div class="termbox">for (let i = 0; i &lt; 3; i++) { ... }

for (const producto of productos) {       // VALORES de un array
  console.log(producto.nombre);
}

for (const clave in usuario) {            // CLAVES de un objeto
  console.log(clave, usuario[clave]);
}

while (cola.length &gt; 0) { procesar(cola.shift()); }</div>`},
 {t:"par", p:"Empareja cada bucle con lo que recorre",
  pares:[["for...of","Los valores de un array, string, Map o Set"],["for...in","Las claves de un objeto"],["for clásico","Un contador con inicio, condición y paso"],["while","Mientras una condición sea cierta"]],
  why:"Para arrays, for...of (o sus métodos como forEach y map); for...in está pensado para objetos."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">for (const letra of "sol") {
  console.log(letra);
}</div>`,
  ops:["sol","s, o, l (una por línea)","0, 1, 2","Error"],
  ok:1, why:"Las cadenas son iterables: for...of recorre sus caracteres."},
 {t:"vf", p:"En un <code>switch</code> de JavaScript, olvidar el <code>break</code> hace que se ejecute también el caso siguiente.",
  ok:true, why:"Igual que en el switch clásico de Java o C."}
]}

]});
