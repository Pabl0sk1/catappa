window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Objetos y funciones tipados",
resumen: "type e interface, propiedades opcionales y readonly, arrays y tuplas, tipos de funciones y sobrecargas",
nivel: "Fundamentos",
color: "#4f8fd9",
lecciones: [

{
id:"ts2l1",
titulo:"type e interface",
claves:["interface y type describen la forma de un objeto","Opcionales con ? y de solo lectura con readonly","interface se extiende con extends; type se combina con &"],
pasos:[
 {t:"info", eti:"Describir datos", h:"Formas de objetos",
  c:`<div class="termbox">interface Usuario {
  readonly id: number;
  nombre: string;
  email: string;
  telefono?: string;            // opcional: string | undefined
}

type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

interface Admin extends Usuario { permisos: string[] }
type ProductoConStock = Producto &amp; { stock: number };    // interseccion

const u: Usuario = { id: 1, nombre: "Ana", email: "ana@x.com" };
u.id = 2;       // error: readonly</div>`},
 {t:"par", p:"Empareja cada sintaxis con su significado",
  pares:[["telefono?: string","Propiedad opcional"],["readonly id: number","No se puede reasignar tras crear el objeto"],["interface B extends A","B tiene todo lo de A y más"],["type C = A & B","C tiene las propiedades de A y de B"],["Record<string, number>","Objeto con claves string y valores number"]],
  why:"¿type o interface? Para objetos, cualquiera sirve; elige una convención. type es necesario para uniones y tipos avanzados."},
 {t:"opcion", p:"¿Qué ocurre al crear un objeto con una propiedad que no está en la interface?", c:`<div class="termbox">const p: Producto = { id: 1, nombre: "Teclado", precio: 90, color: "negro" };</div>`,
  ops:["Se ignora","Error: Object literal may only specify known properties","Se añade al tipo","Error en ejecución"],
  ok:1, why:"En literales, TypeScript detecta propiedades de más (a menudo erratas)."},
 {t:"vf", p:"Una propiedad opcional <code>telefono?: string</code> puede valer <code>undefined</code>.",
  ok:true, why:"Por eso, antes de usarla, hay que comprobarla o usar ?. y ??."}
]},

{
id:"ts2l2",
titulo:"Arrays, tuplas y funciones",
claves:["string[] o Array&lt;string&gt;; readonly string[] para no modificar","Tuplas: [string, number] con longitud y tipos por posición","Tipos de función: (a: number) => string"],
pasos:[
 {t:"info", eti:"Colecciones", h:"Arrays y tuplas",
  c:`<div class="termbox">const nombres: string[] = ["Ana", "Luis"];
const fijos: readonly string[] = ["lun", "mar"];
fijos.push("mie");                         // error: no existe push en readonly

const punto: [number, number] = [40.4, -3.7];               // tupla
const respuesta: [ok: boolean, datos: string] = [true, "hola"];   // con nombres

function useEstado(): [number, (n: number) =&gt; void] { ... }  // como useState de React</div>`},
 {t:"info", eti:"Funciones", h:"Tipar funciones",
  c:`<div class="termbox">type Comparador&lt;T&gt; = (a: T, b: T) =&gt; number;
type Manejador = (evento: MouseEvent) =&gt; void;

function aplicar(valores: number[], fn: (n: number) =&gt; number): number[] {
  return valores.map(fn);
}

function saludar(nombre: string, saludo?: string): string { ... }   // parametro opcional
function sumar(...nums: number[]): number { ... }                  // rest</div>`},
 {t:"par", p:"Empareja cada tipo con un valor válido",
  pares:[["string[]","[\"a\", \"b\"]"],["[string, number]","[\"edad\", 30]"],["(n: number) => boolean","n => n > 0"],["readonly number[]","Un array de números que no se puede modificar"]],
  why:"Las tuplas son la base del patrón [valor, setValor] de React."},
 {t:"opcion", p:"¿Qué tipo describe una función que recibe un id numérico y devuelve una promesa de Usuario?",
  ops:["(id: number) => Usuario","(id: number) => Promise&lt;Usuario&gt;","Promise&lt;(id: number) => Usuario&gt;","async number"],
  ok:1, why:"Las funciones async siempre devuelven Promise&lt;...&gt;."},
 {t:"vf", p:"Una tupla <code>[string, number]</code> acepta <code>[5, \"cinco\"]</code>.",
  ok:false, why:"El orden importa: primero string y luego number."}
]},

{
id:"ts2l3",
titulo:"Tipos literales y alias",
claves:["Un tipo literal admite solo un valor concreto: \"pendiente\"","Uniones de literales sustituyen a muchos enums","as const convierte valores en literales de solo lectura"],
pasos:[
 {t:"info", eti:"Valores concretos", h:"Tipos literales",
  c:`<div class="termbox">type Estado = "pendiente" | "pagado" | "enviado" | "cancelado";
type Tamano = "s" | "m" | "l";
type Dado = 1 | 2 | 3 | 4 | 5 | 6;

let estado: Estado = "pagado";
estado = "perdido";     // error: no es uno de los permitidos

const RUTAS = { inicio: "/", perfil: "/perfil" } as const;
// RUTAS.inicio es de tipo "/" (literal) y es readonly

const ESTADOS = ["pendiente", "pagado", "enviado"] as const;
type EstadoDeLista = typeof ESTADOS[number];   // "pendiente" | "pagado" | "enviado"</div>`},
 {t:"opcion", p:"¿Qué ventaja tiene <code>type Estado = \"pendiente\" | \"pagado\"</code> frente a usar <code>string</code>?",
  ops:["Ninguna","El compilador rechaza erratas y valores no previstos, y el editor autocompleta los valores válidos","Es más rápido en ejecución","Ocupa menos memoria"],
  ok:1, why:"Y con switch, TypeScript puede comprobar que tratas todos los casos."},
 {t:"par", p:"Empareja cada expresión con su tipo",
  pares:[["\"a\" | \"b\"","Solo los textos a o b"],["as const","Valores literales y de solo lectura"],["typeof LISTA[number]","Unión de los elementos de un array as const"],["1 | 2 | 3","Solo esos tres números"]],
  why:"as const + typeof permite definir los valores una vez y derivar el tipo."},
 {t:"vf", p:"Un tipo literal <code>\"pagado\"</code> solo admite exactamente ese texto.",
  ok:true, why:"Es un subtipo de string con un único valor posible."}
]},

{
id:"ts2l4",
titulo:"Firmas de índice y sobrecargas",
claves:["Firma de índice { [clave: string]: T } para objetos con claves arbitrarias","Record&lt;K, V&gt; como alternativa más legible","Sobrecargas de funciones para distintas combinaciones de parámetros"],
pasos:[
 {t:"info", eti:"Claves dinámicas", h:"Objetos diccionario",
  c:`<div class="termbox">interface Traducciones {
  [clave: string]: string;               // cualquier clave, valores string
}
const es: Traducciones = { hola: "Hola", adios: "Adiós" };

type StockPorProducto = Record&lt;string, number&gt;;

// sobrecargas: el tipo de retorno depende de los argumentos
function buscar(id: number): Usuario | undefined;
function buscar(email: string): Usuario | undefined;
function buscar(clave: number | string): Usuario | undefined {
  return typeof clave === "number" ? porId(clave) : porEmail(clave);
}</div>`},
 {t:"par", p:"Empareja cada construcción con su uso",
  pares:[["{ [k: string]: number }","Objeto con claves libres y valores numéricos"],["Record<\"es\" | \"en\", string>","Objeto con exactamente esas claves"],["Map<string, number>","Diccionario en ejecución con claves de cualquier tipo"],["Sobrecarga","Varias firmas públicas para una misma función"]],
  why:"Con noUncheckedIndexedAccess, leer es[\"x\"] da string | undefined: más seguro."},
 {t:"opcion", p:"¿Qué ventaja tiene <code>Record&lt;\"es\" | \"en\", string&gt;</code> frente a <code>{ [k: string]: string }</code>?",
  ops:["Ninguna","Obliga a definir exactamente las claves es y en, y rechaza otras","Es más rápido","Permite números"],
  ok:1, why:"Si añades un idioma a la unión, el compilador te pedirá su traducción."}
]}

]});
