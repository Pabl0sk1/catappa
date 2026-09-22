window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Closures, this, prototipos y clases",
resumen: "Closures y sus usos, cómo se decide this, call, apply y bind, la cadena de prototipos y las clases modernas",
nivel: "Intermedio",
color: "#d0b834",
lecciones: [

{
id:"js6l1",
titulo:"Closures",
claves:["Un closure es una función que recuerda las variables del ámbito donde se creó","Permiten estado privado y funciones configurables","Pregunta clásica de entrevista: explícalo con un contador"],
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
     <p>Cuando <code>crearContador</code> termina, <code>cuenta</code> no desaparece: las funciones devueltas la siguen «encerrando» (<b>closure</b>). Cada llamada a <code>crearContador</code> crea su propio <code>cuenta</code> independiente.</p>`},
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
 {t:"vf", p:"Dos contadores creados con dos llamadas a <code>crearContador()</code> comparten la misma variable cuenta.",
  ok:false, why:"Cada llamada crea un ámbito nuevo con su propia variable."}
]},

{
id:"js6l2",
titulo:"this",
claves:["this depende de cómo se llama la función, no de dónde se define","En un método (obj.metodo()) this es obj; suelta, undefined en modo estricto","Las funciones flecha no tienen this propio: usan el del ámbito exterior"],
pasos:[
 {t:"info", eti:"Quién llama", h:"Las reglas de this",
  c:`<div class="termbox">const usuario = {
  nombre: "Ana",
  saludar() { return "Hola, " + this.nombre; },
};
usuario.saludar();             // "Hola, Ana"      (this = usuario)

const suelta = usuario.saludar;
suelta();                      // Error o "Hola, undefined": this ya no es usuario

const ligada = usuario.saludar.bind(usuario);
ligada();                      // "Hola, Ana"

const temporizador = {
  segundos: 0,
  iniciar() {
    setInterval(() =&gt; { this.segundos++; }, 1000);   // flecha: this es temporizador
  },
};</div>`},
 {t:"par", p:"Empareja cada forma de llamar con el valor de this",
  pares:[["obj.metodo()","obj"],["funcion() suelta en modo estricto","undefined"],["new Clase()","El objeto nuevo que se está creando"],["f.call(otro, ...)","otro"],["Función flecha","El this del ámbito donde se definió"]],
  why:"Casi todos los errores de this vienen de pasar un método como callback y perder su objeto."},
 {t:"opcion", p:"Pasas <code>boton.addEventListener(\"click\", carrito.vaciar)</code> y dentro de vaciar <code>this.items</code> falla. ¿Solución?",
  ops:["Usar var","Pasar () =&gt; carrito.vaciar() o carrito.vaciar.bind(carrito)","Llamarlo dos veces","Quitar this"],
  ok:1, why:"Al pasar el método suelto, pierde su objeto; la flecha o bind lo conservan."},
 {t:"vf", p:"Dentro de una función flecha, <code>this</code> es el objeto sobre el que se llamó.",
  ok:false, why:"La flecha no tiene this propio: toma el del ámbito donde se creó."}
]},

{
id:"js6l3",
titulo:"Prototipos",
claves:["Cada objeto tiene un prototipo del que hereda propiedades","Si una propiedad no está en el objeto, se busca en la cadena de prototipos","Las clases de JavaScript son una sintaxis sobre prototipos"],
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
     <div class="diag">perro --&gt; animal --&gt; Object.prototype --&gt; null
(se busca en este orden hasta encontrar la propiedad)</div>`},
 {t:"opcion", p:"¿De dónde sale el método <code>push</code> de un array?",
  ops:["Del propio array","De Array.prototype, a través de la cadena de prototipos","Del objeto window","De JSON"],
  ok:1, why:"Todos los arrays comparten los métodos de Array.prototype."},
 {t:"vf", p:"Modificar <code>Array.prototype</code> para añadir métodos propios es una buena práctica.",
  ok:false, why:"Afecta a todo el código y a librerías, y puede chocar con métodos futuros del lenguaje."}
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
}

const c = new CuentaPremium("Ana", 500).ingresar(100);
c.saldo;      // 100
c.#saldo;     // SyntaxError: campo privado</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["constructor","Inicializa el objeto al hacer new"],["#campo","Propiedad privada, inaccesible desde fuera"],["static","Pertenece a la clase, no a las instancias"],["get saldo()","Propiedad calculada que se lee sin paréntesis"],["super(...)","Llama al constructor de la clase padre"]],
  why:"Los campos # son privacidad real del lenguaje, no una convención."},
 {t:"opcion", p:"¿Qué pasa si en el constructor de una clase hija usas <code>this</code> antes de llamar a <code>super()</code>?",
  ops:["Nada","ReferenceError: hay que llamar a super antes de usar this","this es undefined","Se llama a super automáticamente"],
  ok:1, why:"Igual que en Java, el padre se inicializa primero."},
 {t:"vf", p:"Las clases de JavaScript funcionan por debajo con prototipos.",
  ok:true, why:"class es azúcar sintáctico: los métodos van al prototipo de la clase."}
]}

]});
