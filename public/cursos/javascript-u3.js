window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Funciones",
resumen: "Declaraciones, expresiones y funciones flecha, parámetros, ámbito y hoisting, funciones de orden superior y recursión",
nivel: "Fundamentos",
color: "#dcc63f",
lecciones: [

{
id:"js3l1",
titulo:"Tres formas de crear funciones",
claves:["Declaración: function nombre() {} — se puede llamar antes de definirla","Expresión: const f = function () {}","Flecha: const f = (a, b) =&gt; a + b — corta, sin this ni arguments propios"],
pasos:[
 {t:"info", eti:"Reutilizar código", h:"Declaración, expresión y flecha",
  c:`<div class="termbox">// declaración
function sumar(a, b) {
  return a + b;
}

// expresión
const restar = function (a, b) {
  return a - b;
};

// función flecha
const multiplicar = (a, b) =&gt; a * b;          // return implícito
const cuadrado = x =&gt; x * x;                   // un parámetro: sin paréntesis
const saludar = () =&gt; console.log("Hola");     // sin parámetros
const crear = nombre =&gt; ({ nombre, activo: true });   // devolver objeto: paréntesis</div>`},
 {t:"info", eti:"Diferencias reales", h:"Cuándo usar cada una",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">declaración frente a flecha</div>
<table class="dg-tabla"><thead><tr><th></th><th>function</th><th>flecha</th></tr></thead><tbody>
<tr><td>hoisting</td><td>la declaración, sí</td><td>no (es una const)</td></tr>
<tr><td>this propio</td><td>sí (depende de la llamada)</td><td>no: usa el de fuera</td></tr>
<tr><td>arguments</td><td>sí</td><td>no (usa ...args)</td></tr>
<tr><td>se puede usar con new</td><td>sí</td><td>no</td></tr>
</tbody></table></div>
     <p>Costumbre habitual: <b>declaraciones</b> para las funciones con nombre de un módulo, y <b>flechas</b> para callbacks cortos (<code>lista.map(x =&gt; x * 2)</code>) y para no perder <code>this</code> dentro de métodos.</p>`},
 {t:"par", p:"Empareja cada forma con su característica",
  pares:[["function nombre() {}","Se puede llamar antes de su definición (hoisting)"],["const f = function () {}","Se asigna a una variable como cualquier valor"],["(a, b) => a + b","Sintaxis corta con return implícito"],["x => ({ a: x })","Devuelve un objeto literal: necesita paréntesis"]],
  why:"Las funciones flecha no tienen su propio this, algo que verás en la unidad de closures y clases."},
 {t:"escribe", p:"Escribe una función flecha llamada <code>doble</code> que reciba <code>n</code> y devuelva <code>n * 2</code>",
  sol:["const doble = n => n * 2;","const doble = (n) => n * 2;","const doble = n => n * 2","const doble = (n) => n * 2","const doble = (n) => { return n * 2; };","const doble = n => { return n * 2; };"], ph:"const doble = ...", pista:"const doble = n => ...", why:"const doble = n => n * 2;"},
 {t:"opcion", p:"¿Qué devuelve <code>const f = () =&gt; { valor: 1 };</code> al llamarla?",
  ops:["{ valor: 1 }","undefined: las llaves se interpretan como el cuerpo de la función, no como un objeto","1","Error"],
  ok:1, why:"Para devolver un objeto: () => ({ valor: 1 })."},
 {t:"codigo", p:"Escribe la función flecha <code>area(base, altura)</code> para un triángulo e imprime <code>area(10, 4)</code> y <code>area(3, 3)</code>",
  lenguaje:"js",
  plantilla:`const area = // completa
console.log(area(10, 4));
console.log(area(3, 3));
`,
  pruebas:[{salida:"20\n4.5"}],
  pista:"const area = (base, altura) => base * altura / 2;",
  solucion:`const area = (base, altura) => base * altura / 2;
console.log(area(10, 4));
console.log(area(3, 3));`,
  why:"Con dos parámetros los paréntesis son obligatorios; con una sola expresión, el return es implícito."},
 {t:"vf", p:"En JavaScript las funciones son valores: se pueden guardar en variables y pasar como argumentos.",
  ok:true, why:"Son «ciudadanos de primera clase»: la base de callbacks, eventos y métodos como map."}
]},

{
id:"js3l2",
titulo:"Parámetros y retorno",
claves:["Parámetros por defecto: function f(x = 1)","Rest (...args) recoge varios argumentos en un array; spread (...) los expande","Sin return, una función devuelve undefined; los primitivos se pasan por valor y los objetos por referencia compartida"],
pasos:[
 {t:"info", eti:"Entradas flexibles", h:"Por defecto, rest y spread",
  c:`<div class="termbox">function saludar(nombre = "Invitado") {
  return \`Hola, \${nombre}\`;
}
saludar();          // "Hola, Invitado"
saludar(undefined); // "Hola, Invitado"
saludar(null);      // "Hola, null"  (el valor por defecto solo cubre undefined)

function sumarTodo(...numeros) {        // rest: un array con todos
  return numeros.reduce((acc, n) =&gt; acc + n, 0);
}
sumarTodo(1, 2, 3); // 6

const valores = [4, 9, 2];
Math.max(...valores);   // spread: Math.max(4, 9, 2) =&gt; 9

// parámetros con nombre usando un objeto
function crearUsuario({ nombre, rol = "lector" } = {}) { ... }
crearUsuario({ nombre: "Ana" });</div>`},
 {t:"info", eti:"Qué recibe la función", h:"Valor y referencia",
  c:`<div class="termbox">function cambiar(n, lista) {
  n = 99;            // copia local: no afecta a fuera
  lista.push(99);    // mismo array que fuera: SÍ se nota
  lista = [];        // reasignar el parámetro no cambia la variable de fuera
}
let x = 1, arr = [1];
cambiar(x, arr);
x;    // 1
arr;  // [1, 99]</div>
     <p>JavaScript siempre pasa <b>por valor</b>, pero el valor de un objeto es su <b>referencia</b>. Por eso mutar un parámetro objeto modifica el original: un efecto secundario que conviene evitar.</p>`},
 {t:"par", p:"Empareja cada sintaxis con su efecto",
  pares:[["function f(x = 5)","Valor por defecto si x es undefined"],["function f(...args)","Recoge todos los argumentos en un array"],["f(...lista)","Pasa cada elemento del array como argumento"],["function f({ a, b })","Recibe un objeto y extrae sus propiedades"]],
  why:"Pasar un objeto de opciones evita errores de orden cuando una función tiene muchos parámetros."},
 {t:"opcion", p:"¿Qué devuelve <code>function f() { const x = 1; }</code> al llamarla?",
  ops:["1","undefined","null","Error"],
  ok:1, why:"Sin return explícito, el resultado es undefined."},
 {t:"codigo", p:"Escribe <code>media(...numeros)</code> que devuelva la media, o 0 si no recibe nada",
  lenguaje:"js",
  plantilla:`function media(...numeros) {
  // completa
}
console.log(media(2, 4, 9));
console.log(media());
`,
  pruebas:[{salida:"5\n0"}],
  pista:"Si numeros.length es 0, devuelve 0. Si no, suma con un bucle o reduce y divide entre numeros.length.",
  solucion:`function media(...numeros) {
  if (numeros.length === 0) return 0;
  let suma = 0;
  for (const n of numeros) suma += n;
  return suma / numeros.length;
}
console.log(media(2, 4, 9));
console.log(media());`,
  why:"Sin el caso vacío, 0 / 0 daría NaN. Los casos límite (vacío, uno, negativos) son lo primero que se prueba."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">function agregar(lista) { lista.push("x"); }
const mia = [];
agregar(mia);
console.log(mia.length);</div>`,
  ops:["0","1","undefined","Error: mia es const"],
  ok:1, why:"La función recibe la referencia al mismo array y lo muta. const no lo impide."},
 {t:"vf", p:"Llamar a una función con menos argumentos de los que declara produce un error.",
  ok:false, why:"Los que faltan valen undefined (o su valor por defecto). JavaScript no comprueba el número de argumentos."}
]},

{
id:"js3l3",
titulo:"Ámbito y hoisting",
claves:["Ámbito de bloque (let, const) y de función (var)","Cada ámbito ve los de fuera (cadena de ámbitos), no al revés; el ámbito es léxico: depende de dónde se escribe el código","Hoisting: las declaraciones se registran antes de ejecutar; let y const tienen zona muerta temporal"],
pasos:[
 {t:"info", eti:"Dónde existe cada variable", h:"Ámbito y cadena de ámbitos",
  c:`<div class="termbox">const global = "visible en todo el fichero";

function exterior() {
  const deFuncion = "solo dentro de exterior";
  if (true) {
    const deBloque = "solo dentro del if";
    console.log(global, deFuncion, deBloque);   // todo visible
  }
  console.log(deBloque);   // ReferenceError
}</div>
     <div class="dg"><div class="dg-tit">búsqueda de una variable: de dentro hacia fuera</div>
<div class="dg-vert">
<div class="dg-caja acento doble">bloque del if<small>deBloque</small></div>
<div class="dg-caja doble">función exterior<small>deFuncion</small></div>
<div class="dg-caja doble">módulo o script<small>global</small></div>
<div class="dg-caja base doble">ámbito global del entorno<small>globalThis: window, console, setTimeout…</small></div>
</div>
<div class="dg-nota arriba">si no la encuentra en ninguno: ReferenceError</div></div>
     <p>El ámbito es <b>léxico</b>: lo decide dónde está escrito el código, no desde dónde se llama. Esta cadena es la base de los <b>closures</b>.</p>`},
 {t:"info", eti:"Elevación", h:"Hoisting y zona muerta temporal",
  c:`<p>Antes de ejecutar un ámbito, el motor registra todas sus declaraciones. Lo que cambia es con qué valor empiezan:</p>
     <div class="termbox">sumar(1, 2);                 // funciona: la función entera se eleva
function sumar(a, b) { return a + b; }

console.log(x);              // undefined (var se eleva, pero sin su valor)
var x = 5;

console.log(y);              // ReferenceError: zona muerta temporal (TDZ)
let y = 5;

restar(3, 1);                // ReferenceError: restar es una const aún sin inicializar
const restar = (a, b) =&gt; a - b;</div>
     <p>La <b>zona muerta temporal</b> va desde el inicio del bloque hasta la línea de la declaración: la variable existe pero no se puede tocar. Es una ayuda, no un fallo: convierte un <code>undefined</code> silencioso en un error visible.</p>`},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">for (var i = 0; i &lt; 3; i++) {
  setTimeout(() =&gt; console.log(i), 0);
}</div>`,
  ops:["0 1 2","3 3 3","undefined x3","Error"],
  ok:1, why:"var tiene un único i para todo el bucle; cuando se ejecutan los setTimeout vale 3. Con let, cada vuelta tiene su propio i y se imprime 0 1 2. Pregunta clásica."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">const color = "rojo";
function pintar() { console.log(color); }
function probar() {
  const color = "azul";
  pintar();
}
probar();</div>`,
  ops:["azul","rojo","undefined","ReferenceError"],
  ok:1, why:"Ámbito léxico: pintar se escribió fuera de probar, así que ve el color de fuera, no el de quien la llama."},
 {t:"par", p:"Empareja cada acceso antes de la declaración con su resultado",
  pares:[["var a = 1","undefined"],["let b = 1","ReferenceError: zona muerta temporal"],["function c() {}","La función ya se puede llamar"],["const d = () => {}","Tampoco: es una const sin inicializar"]],
  why:"Por eso las funciones flecha asignadas a const deben definirse antes de usarse."},
 {t:"codigo", p:"Arregla el bucle para que imprima <code>0</code>, <code>1</code> y <code>2</code> cuando se ejecuten los temporizadores",
  lenguaje:"js",
  plantilla:`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
`,
  pruebas:[{salida:"0\n1\n2"}],
  pista:"Cambia una sola palabra de la primera línea.",
  solucion:`for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
  why:"Con let, el bucle crea una variable i nueva en cada vuelta, y cada callback captura la suya."},
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

function multiplicarPor(factor) {               // devuelve una función
  return numero =&gt; numero * factor;
}
const triple = multiplicarPor(3);
triple(5);   // 15

boton.addEventListener("click", () =&gt; { ... });  // callback de evento
setTimeout(() =&gt; console.log("1 s después"), 1000);</div>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Callback","Función que se pasa para que otra la ejecute más tarde"],["Función de orden superior","Recibe o devuelve funciones"],["Función pura","Mismo resultado para la misma entrada y sin efectos secundarios"],["Efecto secundario","Modificar algo fuera de la función (DOM, red, variables globales)"]],
  why:"Las funciones puras son fáciles de probar y de razonar: base de React y de la programación funcional."},
 {t:"opcion", p:"¿Qué devuelve <code>multiplicarPor(2)(7)</code> con la función del ejemplo?",
  ops:["9","14","Una función","Error"],
  ok:1, why:"multiplicarPor(2) devuelve una función que multiplica por 2; se llama con 7."},
 {t:"opcion", p:"Escribes <code>boton.addEventListener(\"click\", guardar())</code> y se guarda al cargar la página, no al pulsar. ¿Por qué?",
  ops:["El evento click se dispara al cargar","Con los paréntesis llamas a guardar en ese momento y pasas lo que devuelve; hay que pasar la función: guardar","addEventListener está mal escrito","Falta async"],
  ok:1, why:"Pasa la referencia (guardar) o una flecha (() => guardar(id)) si necesitas argumentos."},
 {t:"codigo", p:"Implementa <code>aplicarNVeces(f, n, x)</code>, que aplica <code>f</code> n veces sobre x",
  lenguaje:"js",
  c:`<p><code>aplicarNVeces(x =&gt; x * 2, 3, 1)</code> es <code>f(f(f(1)))</code> = 8.</p>`,
  plantilla:`function aplicarNVeces(f, n, x) {
  // completa
}
console.log(aplicarNVeces(x => x * 2, 3, 1));
console.log(aplicarNVeces(s => s + "!", 2, "hola"));
console.log(aplicarNVeces(x => x + 1, 0, 5));
`,
  pruebas:[{salida:"8\nhola!!\n5"}],
  pista:"Un bucle de n vueltas que hace x = f(x), y devuelve x.",
  solucion:`function aplicarNVeces(f, n, x) {
  for (let i = 0; i < n; i++) x = f(x);
  return x;
}
console.log(aplicarNVeces(x => x * 2, 3, 1));
console.log(aplicarNVeces(s => s + "!", 2, "hola"));
console.log(aplicarNVeces(x => x + 1, 0, 5));`,
  why:"La función no sabe qué hace f: por eso vale igual para números que para textos."},
 {t:"codigo", p:"Escribe <code>crearSaludo(saludo)</code>, que devuelva una función que reciba un nombre y devuelva el saludo completo",
  lenguaje:"js",
  plantilla:`function crearSaludo(saludo) {
  // devuelve una función
}
const hola = crearSaludo("Hola");
const buenas = crearSaludo("Buenas tardes");
console.log(hola("Ana"));
console.log(buenas("Luis"));
`,
  pruebas:[{salida:"Hola, Ana\nBuenas tardes, Luis"}],
  pista:"return nombre => `${saludo}, ${nombre}`;",
  solucion:`function crearSaludo(saludo) {
  return nombre => \`\${saludo}, \${nombre}\`;
}
const hola = crearSaludo("Hola");
const buenas = crearSaludo("Buenas tardes");
console.log(hola("Ana"));
console.log(buenas("Luis"));`,
  why:"Una fábrica de funciones: cada función devuelta recuerda su propio saludo. Es un closure, el tema de una unidad próxima."},
 {t:"vf", p:"<code>setTimeout(fn, 0)</code> ejecuta <code>fn</code> inmediatamente, antes de la siguiente línea.",
  ok:false, why:"La programa para después de que termine el código actual. Lo entenderás del todo en la unidad del event loop."}
]},

{
id:"js3n1",
titulo:"Recursión",
claves:["Una función recursiva se llama a sí misma con un problema más pequeño","Siempre necesita un caso base que detenga las llamadas","Cada llamada ocupa la pila: con miles de niveles, RangeError: Maximum call stack size exceeded"],
pasos:[
 {t:"info", eti:"Llamarse a sí misma", h:"Caso base y caso recursivo",
  c:`<div class="termbox">function factorial(n) {
  if (n &lt;= 1) return 1;           // caso base
  return n * factorial(n - 1);    // caso recursivo: problema más pequeño
}
factorial(4);   // 4 * 3 * 2 * 1 = 24</div>
     <div class="dg"><div class="dg-tit">la pila de llamadas de factorial(3)</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">bajando</div><div class="dg-vert">
<div class="dg-caja">factorial(3)<small>espera a factorial(2)</small></div>
<div class="dg-caja">factorial(2)<small>espera a factorial(1)</small></div>
<div class="dg-caja ok">factorial(1)<small>caso base: devuelve 1</small></div></div></div>
<div class="dg-col"><div class="dg-col-tit">subiendo</div><div class="dg-vert">
<div class="dg-caja ok">1</div>
<div class="dg-caja">2 * 1 = 2</div>
<div class="dg-caja acento">3 * 2 = 6</div></div></div>
</div></div>`},
 {t:"info", eti:"Dónde brilla", h:"Estructuras anidadas",
  c:`<p>La recursión es natural con datos que contienen datos del mismo tipo: árboles de carpetas, menús con submenús, comentarios con respuestas, JSON anidado.</p>
     <div class="termbox">function contarArchivos(carpeta) {
  let total = carpeta.archivos.length;
  for (const sub of carpeta.subcarpetas) total += contarArchivos(sub);
  return total;
}</div>
     <div class="nota ojo"><b class="tit">Límite de pila</b>JavaScript no garantiza la optimización de llamadas en cola (solo Safari la implementa). Con profundidades de decenas de miles, usa un bucle con una pila propia.</div>`},
 {t:"orden", p:"Ordena las llamadas y retornos de <code>factorial(3)</code>",
  items:["Se llama factorial(3)","Se llama factorial(2)","Se llama factorial(1) y devuelve 1","factorial(2) devuelve 2","factorial(3) devuelve 6"],
  why:"Las llamadas se apilan al bajar y se resuelven al subir, en orden inverso."},
 {t:"opcion", p:"Una función recursiva lanza <code>RangeError: Maximum call stack size exceeded</code>. ¿Causa más probable?",
  ops:["Un número demasiado grande","Falta el caso base o el caso recursivo no se acerca a él, y se llama sin fin","Un error de sintaxis","Falta memoria RAM"],
  ok:1, why:"Revisa que cada llamada reduzca el problema y que el caso base se alcance siempre."},
 {t:"codigo", p:"Escribe <code>sumaDigitos(n)</code> recursiva: <code>sumaDigitos(1234)</code> es 10",
  lenguaje:"js",
  plantilla:`function sumaDigitos(n) {
  // caso base y caso recursivo
}
const n = Number(require("fs").readFileSync(0, "utf8").trim());
console.log(sumaDigitos(n));
`,
  pruebas:[{entrada:"1234\n", salida:"10"},{entrada:"7\n", salida:"7", oculta:true},{entrada:"99999\n", salida:"45", oculta:true}],
  pista:"Si n &lt; 10, devuelve n. Si no, n % 10 + sumaDigitos(Math.floor(n / 10)).",
  solucion:`function sumaDigitos(n) {
  if (n < 10) return n;
  return (n % 10) + sumaDigitos(Math.floor(n / 10));
}
const n = Number(require("fs").readFileSync(0, "utf8").trim());
console.log(sumaDigitos(n));`,
  why:"n % 10 es la última cifra y Math.floor(n / 10) el número sin ella: el problema se hace más pequeño en cada llamada."},
 {t:"codigo", p:"Aplana un array anidado a cualquier profundidad sin usar <code>flat</code>",
  lenguaje:"js",
  c:`<p><code>aplanar([1, [2, [3, [4]], 5]])</code> debe dar <code>[1, 2, 3, 4, 5]</code>. Se imprime con <code>JSON.stringify</code>.</p>`,
  plantilla:`function aplanar(lista) {
  // recorre: si un elemento es array, aplánalo recursivamente
}
console.log(JSON.stringify(aplanar([1, [2, [3, [4]], 5]])));
console.log(JSON.stringify(aplanar([])));
`,
  pruebas:[{salida:"[1,2,3,4,5]\n[]"}],
  pista:"Crea un array resultado; para cada elemento, si Array.isArray(e) haz resultado.push(...aplanar(e)), si no, resultado.push(e).",
  solucion:`function aplanar(lista) {
  const resultado = [];
  for (const e of lista) {
    if (Array.isArray(e)) resultado.push(...aplanar(e));
    else resultado.push(e);
  }
  return resultado;
}
console.log(JSON.stringify(aplanar([1, [2, [3, [4]], 5]])));
console.log(JSON.stringify(aplanar([])));`,
  why:"En código real usarías lista.flat(Infinity), pero implementarlo es un ejercicio de entrevista clásico."},
 {t:"vf", p:"Todo problema que se resuelve con recursión puede resolverse también con un bucle y una pila propia.",
  ok:true, why:"La recursión usa la pila de llamadas del motor; un bucle con un array como pila hace lo mismo sin su límite de profundidad."}
]}

]});
