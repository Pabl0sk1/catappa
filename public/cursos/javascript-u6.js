window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Closures, this, prototipos y clases",
resumen: "Closures y sus usos, cómo se decide this, call, apply y bind, la cadena de prototipos, las clases modernas con campos privados, y herencia frente a composición",
nivel: "Intermedio",
color: "#d0b834",
lecciones: [

{
id:"js6l1",
titulo:"Closures",
claves:["Un closure es una función que recuerda las variables del ámbito donde se creó","Permiten estado privado, funciones configuradas y memoización","Pregunta clásica de entrevista: explícalo con un contador"],
pasos:[
 {t:"info", eti:"Funciones con memoria", h:"¿Qué es un closure?",
  c:`<div class="termbox">function crearContador() {
  let cuenta = 0;                    // variable privada
  return {
    incrementar: () =&gt; ++cuenta,
    valor: () =&gt; cuenta,
  };
}

const c = crearContador();
c.incrementar();   // 1
c.incrementar();   // 2
c.valor();         // 2
c.cuenta;          // undefined: no se puede tocar desde fuera</div>
     <p>Cuando <code>crearContador</code> termina, <code>cuenta</code> no desaparece: las funciones devueltas la siguen «encerrando» (<b>closure</b>). Cada llamada a <code>crearContador</code> crea su propio <code>cuenta</code> independiente.</p>
     <div class="dg"><div class="dg-tit">dos contadores, dos entornos</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">const a = crearContador()</div><div class="dg-vert"><div class="dg-caja acento">incrementar, valor</div><div class="dg-caja ok">entorno 1: cuenta = 2</div></div></div>
<div class="dg-col"><div class="dg-col-tit">const b = crearContador()</div><div class="dg-vert"><div class="dg-caja acento">incrementar, valor</div><div class="dg-caja ok">entorno 2: cuenta = 0</div></div></div>
</div></div>`},
 {t:"info", eti:"Por dentro", h:"Lo que se captura es la variable, no el valor",
  c:`<div class="termbox">let mensaje = "hola";
const decir = () =&gt; console.log(mensaje);
mensaje = "adiós";
decir();            // "adiós": el closure ve el valor ACTUAL de la variable

function crearFunciones() {
  const fns = [];
  for (let i = 0; i &lt; 3; i++) fns.push(() =&gt; i);   // let: un i por vuelta
  return fns;
}
crearFunciones().map(f =&gt; f());   // [0, 1, 2]</div>
     <p>Un closure mantiene vivo todo su entorno mientras la función exista. Si captura un objeto enorme sin necesidad, ese objeto no se libera: una fuente sutil de fugas de memoria.</p>`},
 {t:"par", p:"Empareja cada uso de los closures con su ejemplo",
  pares:[["Estado privado","Un contador que solo cambia mediante sus funciones"],["Funciones configuradas","multiplicarPor(3) devuelve una función que triplica"],["Callbacks con contexto","Un manejador de clic que recuerda el id del elemento"],["Memoización","Una función que guarda en una caché interna resultados anteriores"]],
  why:"Los hooks de React (useState, useEffect) se basan por completo en closures."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">function crear() {
  let x = 10;
  return () =&gt; x++;
}
const f = crear();
f(); f();
console.log(f());</div>`,
  ops:["10","11","12","13"],
  ok:2, why:"x++ devuelve el valor antes de incrementar: 10, 11 y la tercera llamada devuelve 12."},
 {t:"codigo", p:"Implementa <code>crearContador(inicio = 0)</code> con <code>sumar</code>, <code>restar</code> y <code>valor</code>, sin exponer la variable",
  lenguaje:"js",
  plantilla:`function crearContador(inicio = 0) {
  // variable privada y objeto con tres funciones
}
const a = crearContador(5);
const b = crearContador();
a.sumar(); a.sumar(); b.restar();
console.log(a.valor(), b.valor(), a.cuenta);
`,
  pruebas:[{salida:"7 -1 undefined"}],
  pista:"let cuenta = inicio; return { sumar: () => ++cuenta, restar: () => --cuenta, valor: () => cuenta };",
  solucion:`function crearContador(inicio = 0) {
  let cuenta = inicio;
  return {
    sumar: () => ++cuenta,
    restar: () => --cuenta,
    valor: () => cuenta,
  };
}
const a = crearContador(5);
const b = crearContador();
a.sumar(); a.sumar(); b.restar();
console.log(a.valor(), b.valor(), a.cuenta);`,
  why:"a y b tienen cada uno su cuenta; desde fuera no hay forma de leerla ni cambiarla salvo por sus funciones."},
 {t:"codigo", p:"Implementa <code>memoizar(fn)</code> para funciones de un argumento primitivo, y comprueba que la segunda llamada no recalcula",
  lenguaje:"js",
  plantilla:`function memoizar(fn) {
  // usa un Map dentro del closure
}
let calculos = 0;
const cuadrado = memoizar(n => { calculos++; return n * n; });
console.log(cuadrado(9), cuadrado(9), cuadrado(3));
console.log(calculos);
`,
  pruebas:[{salida:"81 81 9\n2"}],
  pista:"const cache = new Map(); return x => { if (!cache.has(x)) cache.set(x, fn(x)); return cache.get(x); };",
  solucion:`function memoizar(fn) {
  const cache = new Map();
  return x => {
    if (!cache.has(x)) cache.set(x, fn(x));
    return cache.get(x);
  };
}
let calculos = 0;
const cuadrado = memoizar(n => { calculos++; return n * n; });
console.log(cuadrado(9), cuadrado(9), cuadrado(3));
console.log(calculos);`,
  why:"La caché vive en el closure: privada y persistente entre llamadas. Solo tiene sentido con funciones puras."},
 {t:"vf", p:"Dos contadores creados con dos llamadas a <code>crearContador()</code> comparten la misma variable cuenta.",
  ok:false, why:"Cada llamada crea un ámbito nuevo con su propia variable."}
]},

{
id:"js6l2",
titulo:"this",
claves:["this depende de cómo se llama la función, no de dónde se define","En un método (obj.metodo()) this es obj; suelta, undefined en modo estricto","Las funciones flecha no tienen this propio: usan el del ámbito exterior; call, apply y bind lo fijan"],
pasos:[
 {t:"info", eti:"Quién llama", h:"Las reglas de this",
  c:`<div class="termbox">const usuario = {
  nombre: "Ana",
  saludar() { return "Hola, " + this.nombre; },
};
usuario.saludar();             // "Hola, Ana"      (this = usuario)

const suelta = usuario.saludar;
suelta();                      // TypeError en modo estricto: this es undefined

const ligada = usuario.saludar.bind(usuario);
ligada();                      // "Hola, Ana"

const temporizador = {
  segundos: 0,
  iniciar() {
    setInterval(() =&gt; { this.segundos++; }, 1000);   // flecha: this es temporizador
  },
};</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué vale this, por orden de prioridad</div>
<table class="dg-tabla"><tbody>
<tr><td>new F()</td><td>el objeto nuevo</td></tr>
<tr><td>f.call(x) / f.apply(x) / f.bind(x)</td><td>x</td></tr>
<tr><td>obj.f()</td><td>obj</td></tr>
<tr><td>f() suelta</td><td>undefined en modo estricto (globalThis si no)</td></tr>
<tr><td>función flecha</td><td>el this de donde se escribió (ninguna regla la cambia)</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Fijar this", h:"call, apply y bind",
  c:`<div class="termbox">function presentar(saludo, signo) { return \`\${saludo}, soy \${this.nombre}\${signo}\`; }
const ana = { nombre: "Ana" };

presentar.call(ana, "Hola", "!");      // argumentos sueltos
presentar.apply(ana, ["Hola", "!"]);   // argumentos en array
const deAna = presentar.bind(ana, "Buenas");   // nueva función con this (y argumentos) fijados
deAna(".");                            // "Buenas, soy Ana."</div>`},
 {t:"par", p:"Empareja cada forma de llamar con el valor de this",
  pares:[["obj.metodo()","obj"],["funcion() suelta en modo estricto","undefined"],["new Clase()","El objeto nuevo que se está creando"],["f.call(otro, ...)","otro"],["Función flecha","El this del ámbito donde se definió"]],
  why:"Casi todos los errores de this vienen de pasar un método como callback y perder su objeto."},
 {t:"opcion", p:"Pasas <code>boton.addEventListener(\"click\", carrito.vaciar)</code> y dentro de vaciar <code>this.items</code> falla. ¿Solución?",
  ops:["Usar var","Pasar () =&gt; carrito.vaciar() o carrito.vaciar.bind(carrito)","Llamarlo dos veces","Quitar this"],
  ok:1, why:"Al pasar el método suelto, pierde su objeto; la flecha o bind lo conservan."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">const obj = {
  valor: 42,
  normal() { return this.valor; },
  flecha: () =&gt; this?.valor,
};
console.log(obj.normal(), obj.flecha());</div>`,
  ops:["42 42","42 undefined","undefined 42","Error"],
  ok:1, why:"La flecha no toma this del objeto: toma el del ámbito donde se escribió el literal (el módulo o el script). Nunca uses flechas como métodos de objeto si necesitas this."},
 {t:"codigo", p:"Arregla el código para que imprima <code>Ana tiene 3 tareas</code> sin cambiar la llamada a <code>ejecutar</code>",
  lenguaje:"js",
  plantilla:`"use strict";
const usuario = {
  nombre: "Ana",
  tareas: ["a", "b", "c"],
  resumen() { return \`\${this.nombre} tiene \${this.tareas.length} tareas\`; },
};
function ejecutar(fn) { console.log(fn()); }
ejecutar(usuario.resumen);
`,
  pruebas:[{salida:"Ana tiene 3 tareas"}],
  pista:"Pasa usuario.resumen.bind(usuario) o () => usuario.resumen().",
  solucion:`"use strict";
const usuario = {
  nombre: "Ana",
  tareas: ["a", "b", "c"],
  resumen() { return \`\${this.nombre} tiene \${this.tareas.length} tareas\`; },
};
function ejecutar(fn) { console.log(fn()); }
ejecutar(usuario.resumen.bind(usuario));`,
  why:"ejecutar llama a fn() suelta: sin bind, this es undefined y this.nombre lanza TypeError."},
 {t:"vf", p:"Dentro de una función flecha, <code>this</code> es el objeto sobre el que se llamó.",
  ok:false, why:"La flecha no tiene this propio: toma el del ámbito donde se creó."}
]},

{
id:"js6l3",
titulo:"Prototipos",
claves:["Cada objeto tiene un prototipo del que hereda propiedades","Si una propiedad no está en el objeto, se busca en la cadena de prototipos","Las clases de JavaScript son una sintaxis sobre prototipos y funciones constructoras"],
pasos:[
 {t:"info", eti:"Herencia a la JavaScript", h:"La cadena de prototipos",
  c:`<div class="termbox">const animal = { respirar() { return "respirando"; } };
const perro = Object.create(animal);      // su prototipo es animal
perro.ladrar = () =&gt; "guau";

perro.ladrar();      // propia
perro.respirar();    // heredada de animal
Object.getPrototypeOf(perro) === animal;  // true

[1, 2].map           // map viene de Array.prototype
"hola".toUpperCase   // viene de String.prototype</div>
     <div class="dg"><div class="dg-tit">cadena de prototipos</div>
<div class="dg-flujo" style="row-gap:8px">
<div class="dg-caja acento">perro</div>
<div class="dg-caja">animal</div>
<div class="dg-caja">Object.prototype</div>
<div class="dg-caja base">null</div>
</div>
<div class="dg-nota arriba" style="margin-top:8px">se busca en este orden hasta encontrar la propiedad</div></div>`},
 {t:"info", eti:"Antes de class", h:"Funciones constructoras y prototype",
  c:`<div class="termbox">function Punto(x, y) {           // función constructora
  this.x = x;
  this.y = y;
}
Punto.prototype.distancia = function () {     // compartido por todas las instancias
  return Math.hypot(this.x, this.y);
};
const p = new Punto(3, 4);
p.distancia();                               // 5
Object.getPrototypeOf(p) === Punto.prototype;  // true
p instanceof Punto;                          // true: Punto.prototype está en su cadena</div>
     <p>Qué hace <code>new</code>: crea un objeto vacío, le pone como prototipo <code>F.prototype</code>, ejecuta <code>F</code> con <code>this</code> apuntando a él y lo devuelve. <b>Escribir</b> una propiedad siempre la crea en el propio objeto (la «tapa»); solo la <b>lectura</b> recorre la cadena.</p>`},
 {t:"opcion", p:"¿De dónde sale el método <code>push</code> de un array?",
  ops:["Del propio array","De Array.prototype, a través de la cadena de prototipos","Del objeto window","De JSON"],
  ok:1, why:"Todos los arrays comparten los métodos de Array.prototype."},
 {t:"orden", p:"Ordena lo que hace <code>new Punto(3, 4)</code>",
  items:["Crea un objeto vacío","Enlaza su prototipo con Punto.prototype","Ejecuta Punto con this apuntando al objeto nuevo","Devuelve el objeto (salvo que la función devuelva otro objeto)"],
  why:"Entender estos cuatro pasos explica tanto las funciones constructoras como las clases."},
 {t:"codigo", p:"Crea <code>Vector</code> con una función constructora y pon el método <code>sumar(otro)</code> en su prototipo, que devuelva un Vector nuevo",
  lenguaje:"js",
  plantilla:`function Vector(x, y) {
  // guarda x e y
}
// Vector.prototype.sumar = ...
const v = new Vector(1, 2).sumar(new Vector(3, 4));
console.log(v.x, v.y, v instanceof Vector);
console.log(Object.hasOwn(v, "sumar"));
`,
  pruebas:[{salida:"4 6 true\nfalse"}],
  pista:"this.x = x; this.y = y; y Vector.prototype.sumar = function (o) { return new Vector(this.x + o.x, this.y + o.y); };",
  solucion:`function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.sumar = function (o) {
  return new Vector(this.x + o.x, this.y + o.y);
};
const v = new Vector(1, 2).sumar(new Vector(3, 4));
console.log(v.x, v.y, v instanceof Vector);
console.log(Object.hasOwn(v, "sumar"));`,
  why:"sumar no es propiedad propia de cada vector: está una sola vez en el prototipo y todos la comparten."},
 {t:"opcion", p:"<code>const o = Object.create(null)</code>. ¿Qué pasa con <code>o.toString()</code>?",
  ops:["Devuelve \"[object Object]\"","TypeError: o no tiene prototipo, así que no hereda toString","Devuelve \"\"","Devuelve null"],
  ok:1, why:"Object.create(null) crea un diccionario «limpio», sin propiedades heredadas: útil para evitar claves como __proto__ o constructor."},
 {t:"vf", p:"Modificar <code>Array.prototype</code> para añadir métodos propios es una buena práctica.",
  ok:false, why:"Afecta a todo el código y a librerías, y puede chocar con métodos futuros del lenguaje (pasó con Array.prototype.flatten, que acabó llamándose flat)."}
]},

{
id:"js6l4",
titulo:"Clases",
claves:["class, constructor, métodos, extends y super","Campos privados con # y métodos estáticos con static","get y set para propiedades calculadas"],
pasos:[
 {t:"info", eti:"Sintaxis moderna", h:"Clases en JavaScript",
  c:`<div class="termbox">class Cuenta {
  #saldo = 0;                       // campo privado
  static comision = 0.01;           // de la clase

  constructor(titular) {
    this.titular = titular;
  }

  ingresar(importe) {
    if (importe &lt;= 0) throw new Error("Importe no válido");
    this.#saldo += importe;
    return this;                    // permite encadenar
  }

  get saldo() { return this.#saldo; }
}

class CuentaPremium extends Cuenta {
  constructor(titular, limite) {
    super(titular);
    this.limite = limite;
  }
  ingresar(importe) {               // sobrescribe
    console.log("premium");
    return super.ingresar(importe); // y reutiliza el del padre
  }
}

const c = new CuentaPremium("Ana", 500).ingresar(100);
c.saldo;      // 100
c.#saldo;     // SyntaxError: campo privado</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["constructor","Inicializa el objeto al hacer new"],["#campo","Propiedad privada, inaccesible desde fuera"],["static","Pertenece a la clase, no a las instancias"],["get saldo()","Propiedad calculada que se lee sin paréntesis"],["super(...)","Llama al constructor de la clase padre"],["super.metodo()","Llama a la versión del padre de un método"]],
  why:"Los campos # son privacidad real del lenguaje, no una convención como el guion bajo."},
 {t:"opcion", p:"¿Qué pasa si en el constructor de una clase hija usas <code>this</code> antes de llamar a <code>super()</code>?",
  ops:["Nada","ReferenceError: hay que llamar a super antes de usar this","this es undefined","Se llama a super automáticamente"],
  ok:1, why:"Igual que en Java, el padre se inicializa primero."},
 {t:"codigo", p:"Crea la clase <code>Pila</code> con un array privado <code>#items</code>, <code>apilar</code>, <code>desapilar</code>, un getter <code>tamano</code> y un getter <code>vacia</code>",
  lenguaje:"js",
  plantilla:`class Pila {
  // completa
}
const p = new Pila();
p.apilar(1); p.apilar(2); p.apilar(3);
console.log(p.desapilar(), p.tamano, p.vacia);
p.desapilar(); p.desapilar();
console.log(p.desapilar(), p.vacia, p.items);
`,
  pruebas:[{salida:"3 2 false\nundefined true undefined"}],
  pista:"#items = []; apilar(x) { this.#items.push(x); } desapilar() { return this.#items.pop(); } get tamano() { return this.#items.length; } get vacia() { return this.#items.length === 0; }",
  solucion:`class Pila {
  #items = [];
  apilar(x) { this.#items.push(x); }
  desapilar() { return this.#items.pop(); }
  get tamano() { return this.#items.length; }
  get vacia() { return this.#items.length === 0; }
}
const p = new Pila();
p.apilar(1); p.apilar(2); p.apilar(3);
console.log(p.desapilar(), p.tamano, p.vacia);
p.desapilar(); p.desapilar();
console.log(p.desapilar(), p.vacia, p.items);`,
  why:"p.items es undefined: nadie puede saltarse la interfaz y romper la pila desde fuera."},
 {t:"codigo", p:"Crea <code>Figura</code> con un método <code>describir()</code> que use <code>this.area()</code>, y las hijas <code>Circulo(r)</code> y <code>Cuadrado(l)</code> que implementen <code>area</code>",
  lenguaje:"js",
  c:`<p><code>describir()</code> devuelve <code>&lt;nombre de la clase&gt;: &lt;área con 2 decimales&gt;</code>. El nombre sale de <code>this.constructor.name</code>.</p>`,
  plantilla:`class Figura {
  describir() { /* completa */ }
}
// class Circulo extends Figura ...
// class Cuadrado extends Figura ...
for (const f of [new Circulo(1), new Cuadrado(3)]) console.log(f.describir());
`,
  pruebas:[{salida:"Circulo: 3.14\nCuadrado: 9.00"}],
  pista:"describir() { return `${this.constructor.name}: ${this.area().toFixed(2)}`; }",
  solucion:`class Figura {
  describir() { return \`\${this.constructor.name}: \${this.area().toFixed(2)}\`; }
}
class Circulo extends Figura {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
}
class Cuadrado extends Figura {
  constructor(l) { super(); this.l = l; }
  area() { return this.l ** 2; }
}
for (const f of [new Circulo(1), new Cuadrado(3)]) console.log(f.describir());`,
  why:"Polimorfismo: el padre llama a area() sin saber qué figura es; cada hija aporta la suya."},
 {t:"vf", p:"Las clases de JavaScript funcionan por debajo con prototipos.",
  ok:true, why:"class es azúcar sintáctico: los métodos van al prototipo de la clase. Pero añade reglas propias: exige new, su cuerpo es estricto y los campos # no existen sin class."}
]},

{
id:"js6n1",
titulo:"Clases a fondo y composición",
claves:["Métodos privados #m(), bloques static {} y la comprobación #campo in obj","instanceof mira la cadena de prototipos; Symbol.hasInstance lo personaliza","Favorece la composición sobre la herencia profunda"],
pasos:[
 {t:"info", eti:"Lo que trajo ES2022", h:"Privados, estáticos y más",
  c:`<div class="termbox">class Conexion {
  static #instancias = 0;               // privado de la clase
  static { Conexion.version = "2.1"; }  // bloque de inicialización estática

  #url;
  constructor(url) { this.#url = url; Conexion.#instancias++; }

  #validar() { return this.#url.startsWith("https://"); }   // método privado
  abrir() { if (!this.#validar()) throw new Error("Solo HTTPS"); }

  static cuantas() { return Conexion.#instancias; }
  static esConexion(x) { return #url in x; }   // ¿tiene mi campo privado?
}</div>
     <p><code>#url in x</code> comprueba si un objeto es una instancia «de verdad» de la clase (tiene su campo privado), algo que <code>instanceof</code> no garantiza: el prototipo se puede falsificar con <code>Object.setPrototypeOf</code>.</p>`},
 {t:"info", eti:"Diseño", h:"Herencia frente a composición",
  c:`<div class="dg"><div class="dg-tit">dos formas de reutilizar comportamiento</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">herencia: «es un»</div><div class="dg-vert">
<div class="dg-caja">Animal</div><div class="dg-caja">Ave</div><div class="dg-caja aviso doble">Pingüino<small>hereda volar()… y no vuela</small></div></div></div>
<div class="dg-col"><div class="dg-col-tit">composición: «tiene un»</div><div class="dg-pila">
<div class="dg-caja acento doble">Pingüino<small>se construye con piezas</small></div>
<div class="dg-fila"><div class="dg-caja ok">nadar</div><div class="dg-caja ok">caminar</div></div></div></div>
</div></div>
     <div class="termbox">const puedeNadar = obj =&gt; ({ nadar: () =&gt; \`\${obj.nombre} nada\` });
const puedeCaminar = obj =&gt; ({ caminar: () =&gt; \`\${obj.nombre} camina\` });

function crearPinguino(nombre) {
  const estado = { nombre };
  return { ...puedeNadar(estado), ...puedeCaminar(estado) };
}</div>
     <p>Las jerarquías profundas se vuelven rígidas: un cambio en la base rompe a todos los hijos. Hereda solo cuando la relación «es un» es estable; para el resto, compón.</p>`},
 {t:"par", p:"Empareja cada característica con su sintaxis",
  pares:[["Método privado","#calcular() { }"],["Inicialización estática","static { }"],["Campo privado estático","static #cache = new Map()"],["¿Tiene el campo privado?","#campo in obj"],["Getter estático","static get defecto() { }"]],
  why:"Todo esto funciona en navegadores actuales y en Node desde la versión 16."},
 {t:"opcion", p:"Tu jerarquía es <code>Usuario → Empleado → Gerente → GerenteRegional</code> y cambiar <code>Usuario</code> rompe cosas en cadena. ¿Qué propones?",
  ops:["Añadir otro nivel","Aplanar: usar composición (un usuario con un rol y permisos como objetos) en vez de herencia profunda","Copiar el código en cada clase","Usar var"],
  ok:1, why:"«Favorece la composición sobre la herencia» (Gang of Four). Los roles cambian; la herencia es para siempre."},
 {t:"codigo", p:"Implementa la clase <code>Temperatura</code> con un campo privado en Celsius, un getter/setter <code>fahrenheit</code> y un método estático <code>desdeFahrenheit(f)</code>",
  lenguaje:"js",
  plantilla:`class Temperatura {
  // #celsius, constructor(c), get celsius, get/set fahrenheit, static desdeFahrenheit
}
const t = new Temperatura(100);
console.log(t.fahrenheit);
t.fahrenheit = 32;
console.log(t.celsius);
console.log(Temperatura.desdeFahrenheit(212).celsius);
`,
  pruebas:[{salida:"212\n0\n100"}],
  pista:"F = C * 9 / 5 + 32 y C = (F - 32) * 5 / 9.",
  solucion:`class Temperatura {
  #celsius;
  constructor(c) { this.#celsius = c; }
  get celsius() { return this.#celsius; }
  get fahrenheit() { return this.#celsius * 9 / 5 + 32; }
  set fahrenheit(f) { this.#celsius = (f - 32) * 5 / 9; }
  static desdeFahrenheit(f) { return new Temperatura((f - 32) * 5 / 9); }
}
const t = new Temperatura(100);
console.log(t.fahrenheit);
t.fahrenheit = 32;
console.log(t.celsius);
console.log(Temperatura.desdeFahrenheit(212).celsius);`,
  why:"Un único dato guardado (celsius) y el resto calculado: imposible que las dos escalas se desincronicen. El método estático es una «fábrica» con nombre claro."},
 {t:"codigo", p:"Composición: escribe <code>conHistorial(obj)</code>, que añade a cualquier objeto con <code>valor</code> un método <code>cambiar(v)</code> que guarde los valores anteriores y un <code>deshacer()</code>",
  lenguaje:"js",
  plantilla:`function conHistorial(obj) {
  // devuelve un objeto nuevo con los datos de obj y los métodos
}
const campo = conHistorial({ nombre: "email", valor: "" });
campo.cambiar("a"); campo.cambiar("ab"); campo.cambiar("abc");
campo.deshacer();
console.log(campo.nombre, campo.valor);
campo.deshacer(); campo.deshacer(); campo.deshacer();
console.log(JSON.stringify(campo.valor));
`,
  pruebas:[{salida:"email ab\n\"\""}],
  pista:"const historial = []; return { ...obj, cambiar(v) { historial.push(this.valor); this.valor = v; }, deshacer() { if (historial.length) this.valor = historial.pop(); } };",
  solucion:`function conHistorial(obj) {
  const historial = [];
  return {
    ...obj,
    cambiar(v) { historial.push(this.valor); this.valor = v; },
    deshacer() { if (historial.length) this.valor = historial.pop(); },
  };
}
const campo = conHistorial({ nombre: "email", valor: "" });
campo.cambiar("a"); campo.cambiar("ab"); campo.cambiar("abc");
campo.deshacer();
console.log(campo.nombre, campo.valor);
campo.deshacer(); campo.deshacer(); campo.deshacer();
console.log(JSON.stringify(campo.valor));`,
  why:"El comportamiento se añade a cualquier objeto sin herencia, y el historial queda privado en el closure."},
 {t:"vf", p:"<code>obj instanceof Clase</code> comprueba si <code>Clase.prototype</code> está en la cadena de prototipos de obj.",
  ok:true, why:"Por eso falla entre ventanas o iframes (cada una tiene su propio Array) y por eso existen Array.isArray y la comprobación #campo in obj."}
]}

]});
