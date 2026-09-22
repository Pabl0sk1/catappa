window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Funciones",
resumen: "Declaraciones, expresiones y funciones flecha, parámetros por defecto y rest, ámbito, hoisting y funciones de orden superior",
nivel: "Fundamentos",
color: "#dcc63f",
lecciones: [

{
id:"js3l1",
titulo:"Tres formas de crear funciones",
claves:["Declaración: function nombre() {} — se puede llamar antes de definirla","Expresión: const f = function () {}","Flecha: const f = (a, b) => a + b — corta y sin this propio"],
pasos:[
 {t:"info", eti:"Reutilizar código", h:"Declaración, expresión y flecha",
  c:`<div class="termbox">// declaracion
function sumar(a, b) {
  return a + b;
}

// expresion
const restar = function (a, b) {
  return a - b;
};

// funcion flecha
const multiplicar = (a, b) =&gt; a * b;          // return implicito
const cuadrado = x =&gt; x * x;                   // un parametro: sin parentesis
const saludar = () =&gt; console.log("Hola");     // sin parametros
const crear = nombre =&gt; ({ nombre, activo: true });   // devolver objeto: parentesis</div>`},
 {t:"par", p:"Empareja cada forma con su característica",
  pares:[["function nombre() {}","Se puede llamar antes de su definición (hoisting)"],["const f = function () {}","Se asigna a una variable como cualquier valor"],["(a, b) => a + b","Sintaxis corta con return implícito"],["x => ({ a: x })","Devuelve un objeto literal: necesita paréntesis"]],
  why:"Las funciones flecha no tienen su propio this, algo que verás en la unidad de objetos."},
 {t:"escribe", p:"Escribe una función flecha llamada <code>doble</code> que reciba <code>n</code> y devuelva <code>n * 2</code>",
  sol:["const doble = n => n * 2;","const doble = (n) => n * 2;","const doble = n => n * 2","const doble = (n) => n * 2","const doble = (n) => { return n * 2; };","const doble = n => { return n * 2; };"], ph:"const doble = ...", pista:"const doble = n => ...", why:"const doble = n => n * 2;"},
 {t:"opcion", p:"¿Qué devuelve <code>const f = () =&gt; { valor: 1 };</code> al llamarla?",
  ops:["{ valor: 1 }","undefined: las llaves se interpretan como el cuerpo de la función, no como un objeto","1","Error"],
  ok:1, why:"Para devolver un objeto: () => ({ valor: 1 })."},
 {t:"vf", p:"En JavaScript las funciones son valores: se pueden guardar en variables y pasar como argumentos.",
  ok:true, why:"Son «ciudadanos de primera clase»: la base de callbacks, eventos y métodos como map."}
]},

{
id:"js3l2",
titulo:"Parámetros y retorno",
claves:["Parámetros por defecto: function f(x = 1)","Rest (...args) recoge varios argumentos en un array; spread (...) los expande","Sin return, una función devuelve undefined"],
pasos:[
 {t:"info", eti:"Entradas flexibles", h:"Por defecto, rest y spread",
  c:`<div class="termbox">function saludar(nombre = "Invitado") {
  return \`Hola, \${nombre}\`;
}
saludar();          // "Hola, Invitado"

function sumarTodo(...numeros) {        // rest: un array con todos
  return numeros.reduce((acc, n) =&gt; acc + n, 0);
}
sumarTodo(1, 2, 3); // 6

const valores = [4, 9, 2];
Math.max(...valores);   // spread: Math.max(4, 9, 2) =&gt; 9

// parametros con nombre usando un objeto
function crearUsuario({ nombre, rol = "lector" }) { ... }
crearUsuario({ nombre: "Ana" });</div>`},
 {t:"par", p:"Empareja cada sintaxis con su efecto",
  pares:[["function f(x = 5)","Valor por defecto si no se pasa x"],["function f(...args)","Recoge todos los argumentos en un array"],["f(...lista)","Pasa cada elemento del array como argumento"],["function f({ a, b })","Recibe un objeto y extrae sus propiedades"]],
  why:"Pasar un objeto de opciones evita errores de orden cuando una función tiene muchos parámetros."},
 {t:"opcion", p:"¿Qué devuelve <code>function f() { const x = 1; }</code> al llamarla?",
  ops:["1","undefined","null","Error"],
  ok:1, why:"Sin return explícito, el resultado es undefined."},
 {t:"vf", p:"Llamar a una función con menos argumentos de los que declara produce un error.",
  ok:false, why:"Los que faltan valen undefined (o su valor por defecto). JavaScript no comprueba el número de argumentos."}
]},

{
id:"js3l3",
titulo:"Ámbito y hoisting",
claves:["Ámbito de bloque (let, const) y de función (var)","Las funciones internas ven las variables de fuera, no al revés","Hoisting: las declaraciones se «elevan»; let y const tienen zona muerta temporal"],
pasos:[
 {t:"info", eti:"Dónde existe cada variable", h:"Ámbito",
  c:`<div class="termbox">const global = "visible en todo el fichero";

function exterior() {
  const deFuncion = "solo dentro de exterior";
  if (true) {
    const deBloque = "solo dentro del if";
    console.log(global, deFuncion, deBloque);   // todo visible
  }
  console.log(deBloque);   // ReferenceError
}</div>
     <p>Cada bloque puede ver las variables de los bloques que lo contienen, pero no al revés. Esta «cadena» de ámbitos es la base de los <b>closures</b>.</p>`},
 {t:"info", eti:"Elevación", h:"Hoisting",
  c:`<div class="termbox">sumar(1, 2);                 // funciona: las declaraciones de funcion se elevan
function sumar(a, b) { return a + b; }

console.log(x);              // undefined (var se eleva sin su valor)
var x = 5;

console.log(y);              // ReferenceError: zona muerta temporal
let y = 5;</div>`},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">for (var i = 0; i &lt; 3; i++) {
  setTimeout(() =&gt; console.log(i), 0);
}</div>`,
  ops:["0 1 2","3 3 3","undefined x3","Error"],
  ok:1, why:"var tiene un único i para todo el bucle; cuando se ejecutan los setTimeout vale 3. Con let, cada vuelta tiene su propio i y se imprime 0 1 2. Pregunta clásica."},
 {t:"vf", p:"Acceder a una variable <code>let</code> antes de su declaración devuelve <code>undefined</code>.",
  ok:false, why:"Lanza ReferenceError (zona muerta temporal). Es var la que da undefined."}
]},

{
id:"js3l4",
titulo:"Funciones de orden superior y callbacks",
claves:["Una función de orden superior recibe o devuelve funciones","Un callback es una función que se pasa para que otra la llame","Base de eventos, temporizadores y métodos de arrays"],
pasos:[
 {t:"info", eti:"Funciones que usan funciones", h:"Orden superior",
  c:`<div class="termbox">function repetir(veces, accion) {
  for (let i = 0; i &lt; veces; i++) accion(i);
}
repetir(3, i =&gt; console.log("vuelta", i));      // accion es un callback

function multiplicarPor(factor) {               // devuelve una funcion
  return numero =&gt; numero * factor;
}
const triple = multiplicarPor(3);
triple(5);   // 15

boton.addEventListener("click", () =&gt; { ... });  // callback de evento
setTimeout(() =&gt; console.log("1 s despues"), 1000);</div>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Callback","Función que se pasa para que otra la ejecute más tarde"],["Función de orden superior","Recibe o devuelve funciones"],["Función pura","Mismo resultado para la misma entrada y sin efectos secundarios"],["Efecto secundario","Modificar algo fuera de la función (DOM, red, variables globales)"]],
  why:"Las funciones puras son fáciles de probar y de razonar: base de React y de la programación funcional."},
 {t:"opcion", p:"¿Qué devuelve <code>multiplicarPor(2)(7)</code> con la función del ejemplo?",
  ops:["9","14","Una función","Error"],
  ok:1, why:"multiplicarPor(2) devuelve una función que multiplica por 2; se llama con 7."},
 {t:"vf", p:"<code>setTimeout(fn, 0)</code> ejecuta <code>fn</code> inmediatamente, antes de la siguiente línea.",
  ok:false, why:"La programa para después de que termine el código actual. Lo entenderás del todo en la unidad del event loop."}
]}

]});
