window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Objetos y funciones tipados",
resumen: "type e interface, opcionales y readonly, arrays y tuplas, literales y as const, funciones a fondo con sobrecargas, y firmas de índice, Record y Map",
nivel: "Fundamentos",
color: "#4f8fd9",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"ts2l1",
titulo:"type e interface",
claves:["interface y type describen la forma de un objeto; opcionales con ? y de solo lectura con readonly","interface se extiende con extends y se puede reabrir; type admite uniones, tuplas y tipos calculados","Para objetos, cualquiera sirve: elige una convención de equipo"],
pasos:[
 {t:"info", eti:"Describir datos", h:"Formas de objetos",
  c:`<div class="termbox">interface Usuario {
  readonly id: number;
  nombre: string;
  email: string;
  telefono?: string;            // opcional: puede faltar
}

type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

interface Admin extends Usuario { permisos: string[] }
type ProductoConStock = Producto &amp; { stock: number };    // intersección

const u: Usuario = { id: 1, nombre: "Ana", email: "ana@x.com" };
u.id = 2;       // error: Cannot assign to 'id' because it is a read-only property</div>
     <p><code>readonly</code> solo existe al compilar: no congela el objeto en ejecución (eso lo hace <code>Object.freeze</code>).</p>`},
 {t:"info", eti:"Diferencias", h:"¿type o interface?",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">lo que solo puede hacer cada uno</div><table class="dg-tabla"><thead><tr><th>capacidad</th><th>interface</th><th>type</th></tr></thead><tbody>
<tr><td>Describir objetos y clases</td><td>sí</td><td>sí</td></tr>
<tr><td>Uniones, tuplas, primitivos</td><td>no</td><td>sí: <code>type Id = string | number</code></td></tr>
<tr><td>Tipos mapeados y condicionales</td><td>no</td><td>sí</td></tr>
<tr><td>Reabrirse (fusión de declaraciones)</td><td>sí: dos <code>interface Window</code> se suman</td><td>no: identificador duplicado</td></tr>
<tr><td>Herencia con conflictos</td><td><code>extends</code> avisa del conflicto</td><td><code>&amp;</code> lo convierte en <code>never</code> sin avisar</td></tr>
</tbody></table></div>
     <p>Convención habitual: <code>interface</code> para formas de objetos que se extienden (y en librerías, para que los usuarios puedan ampliarlas), <code>type</code> para todo lo demás. Lo importante es ser consistente.</p>`},
 {t:"par", p:"Empareja cada sintaxis con su significado",
  pares:[["telefono?: string","Propiedad opcional"],["readonly id: number","No se puede reasignar tras crear el objeto"],["interface B extends A","B tiene todo lo de A y más"],["type C = A & B","C tiene las propiedades de A y de B"],["type Id = string | number","Alias de una unión (imposible con interface)"]],
  why:"type es imprescindible para uniones y tipos avanzados; para objetos, cualquiera sirve."},
 {t:"opcion", p:"¿Qué ocurre al crear un objeto con una propiedad que no está en el tipo?", c:`<div class="termbox">const p: Producto = { id: 1, nombre: "Teclado", precio: 90, color: "negro" };</div>`,
  ops:["Se ignora","Error: Object literal may only specify known properties","Se añade al tipo","Error en ejecución"],
  ok:1, why:"En literales, TypeScript detecta propiedades de más (a menudo erratas)."},
 {t:"opcion", p:"¿Qué tipo tiene la propiedad <code>id</code> de <code>C</code>?", c:`<div class="termbox">type A = { id: string };
type B = { id: number };
type C = A &amp; B;</div>`,
  ops:["string | number","never: ningún valor es a la vez string y number","string","Error de compilación en la línea de C"],
  ok:1, why:"La intersección no avisa: simplemente id pasa a ser string &amp; number, que es never. Con interface C extends A, B tendrías un error claro."},
 {t:"vf", p:"Una propiedad <code>readonly</code> no se puede modificar en tiempo de ejecución.",
  ok:false, why:"readonly lo comprueba el compilador; en el JavaScript generado el objeto es normal. Para congelarlo en ejecución, Object.freeze."},
 {t:"hueco", p:"Completa: Cliente extiende Persona y añade un nivel opcional",
  tpl:"interface Cliente ___ Persona {\n  nivel___: \"oro\" | \"plata\";\n}", banco:["extends","?","implements","!","&"], sol:["extends","?"],
  why:"extends para heredar la forma; ? para hacer la propiedad opcional."}
]},

/* =============== U2 L2 =============== */
{
id:"ts2l2",
titulo:"Arrays y tuplas",
claves:["string[] o Array&lt;string&gt;; readonly string[] para no modificar","Tuplas: [string, number] con longitud y tipos por posición, admiten nombres y opcionales","Las tuplas son la base de patrones como [valor, setValor] de React"],
pasos:[
 {t:"info", eti:"Colecciones", h:"Arrays y tuplas",
  c:`<div class="termbox">const nombres: string[] = ["Ana", "Luis"];
const fijos: readonly string[] = ["lun", "mar"];
fijos.push("mie");                  // error: Property 'push' does not exist on type 'readonly string[]'

const punto: [number, number] = [40.4, -3.7];                    // tupla
const respuesta: [ok: boolean, datos: string] = [true, "hola"];   // con nombres
const rango: [number, number?] = [5];                             // segundo opcional
const ruta: [string, ...number[]] = ["A", 1, 2, 3];               // resto variable

function useContador(): [number, (n: number) =&gt; void] { ... }    // como useState
const [valor, cambiar] = useContador();</div>
     <div class="nota ojo"><b class="tit">Las tuplas no son inmutables</b>Una tupla <code>[number, number]</code> sigue teniendo <code>push</code> (es un array en ejecución). Si quieres impedirlo, <code>readonly [number, number]</code>.</div>`},
 {t:"info", eti:"Métodos", h:"Lo que infiere cada método",
  c:`<div class="termbox">const precios = [10, 25, 7];
const caros = precios.filter(p =&gt; p &gt; 9);           // number[]
const textos = precios.map(p =&gt; \`\${p} €\`);          // string[]
const primero = precios.find(p =&gt; p &gt; 100);        // number | undefined
const total = precios.reduce((s, p) =&gt; s + p, 0);   // number
const mezcla = [1, "a", null];                       // (string | number | null)[]</div>
     <p>Fíjate en <code>find</code>: puede no encontrar nada, así que el resultado incluye <code>undefined</code> y tendrás que comprobarlo.</p>`},
 {t:"par", p:"Empareja cada tipo con un valor válido",
  pares:[["string[]","[\"a\", \"b\"]"],["[string, number]","[\"edad\", 30]"],["[string, number?]","[\"solo\"]"],["readonly number[]","Un array de números que no se puede modificar"]],
  why:"En una tupla importan la posición y la longitud."},
 {t:"vf", p:"Una tupla <code>[string, number]</code> acepta <code>[5, \"cinco\"]</code>.",
  ok:false, why:"El orden importa: primero string y luego number."},
 {t:"opcion", p:"¿Qué tipo infiere TypeScript para <code>x</code>?", c:`<div class="termbox">const usuarios = [{ id: 1, nombre: "Ana" }, { id: 2, nombre: "Luis" }];
const x = usuarios.find(u =&gt; u.id === 3);</div>`,
  ops:["{ id: number; nombre: string }","{ id: number; nombre: string } | undefined","any","never"],
  ok:1, why:"find devuelve undefined si no encuentra nada: antes de usar x.nombre tienes que comprobarlo (o usar x?.nombre)."},
 {t:"opcion", p:"¿Qué tipo tiene <code>par</code>?", c:`<div class="termbox">const par = ["Ana", 31];</div>`,
  ops:["[string, number]","(string | number)[]","readonly [\"Ana\", 31]","any[]"],
  ok:1, why:"Un literal de array se infiere como array, no como tupla. Para tupla, anótala ([string, number]) o usa as const (readonly [\"Ana\", 31])."},
 {t:"escribe", p:"Escribe el tipo de una tupla de solo lectura con dos números",
  sol:["readonly [number, number]","readonly [number,number]"], pista:"readonly delante de la tupla.",
  why:"Útil para coordenadas o rangos que no deben cambiar."}
]},

/* =============== U2 L3 =============== */
{
id:"ts2l3",
titulo:"Tipos literales y as const",
claves:["Un tipo literal admite solo un valor concreto: \"pendiente\"","Las uniones de literales sustituyen a muchos enums y autocompletan en el editor","as const convierte valores en literales de solo lectura y permite derivar tipos de ellos"],
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
 {t:"info", eti:"Error típico", h:"Cuando el literal se pierde",
  c:`<div class="termbox">function pedir(metodo: "GET" | "POST", url: string) { ... }

const opciones = { metodo: "GET", url: "/api" };
pedir(opciones.metodo, opciones.url);
//    ~~~~~~~~~~~~~~ Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.</div>
     <p><code>opciones.metodo</code> se amplió a <code>string</code> porque la propiedad se podría cambiar. Tres arreglos, de mejor a peor:</p>
     <ul><li>Anotar el objeto: <code>const opciones: { metodo: "GET" | "POST"; url: string } = ...</code></li>
     <li><code>as const</code> en el objeto (o solo en el valor: <code>"GET" as const</code>).</li>
     <li><code>opciones.metodo as "GET"</code>: funciona, pero es una aserción que no comprueba nada.</li></ul>`},
 {t:"opcion", p:"¿Qué ventaja tiene <code>type Estado = \"pendiente\" | \"pagado\"</code> frente a usar <code>string</code>?",
  ops:["Ninguna","El compilador rechaza erratas y valores no previstos, y el editor autocompleta los valores válidos","Es más rápido en ejecución","Ocupa menos memoria"],
  ok:1, why:"Y con switch, TypeScript puede comprobar que tratas todos los casos."},
 {t:"par", p:"Empareja cada expresión con su tipo",
  pares:[["\"a\" | \"b\"","Solo los textos a o b"],["as const","Valores literales y de solo lectura"],["typeof LISTA[number]","Unión de los elementos de un array as const"],["1 | 2 | 3","Solo esos tres números"]],
  why:"as const + typeof permite definir los valores una vez y derivar el tipo."},
 {t:"opcion", p:"¿Qué tipo tiene <code>COLORES</code>?", c:`<div class="termbox">const COLORES = ["rojo", "verde"] as const;</div>`,
  ops:["string[]","readonly [\"rojo\", \"verde\"]","(\"rojo\" | \"verde\")[]","[string, string]"],
  ok:1, why:"as const produce una tupla de solo lectura con los literales exactos."},
 {t:"vf", p:"Un tipo literal <code>\"pagado\"</code> solo admite exactamente ese texto.",
  ok:true, why:"Es un subtipo de string con un único valor posible."},
 {t:"hueco", p:"Deriva la unión de roles a partir del array",
  tpl:"const ROLES = [\"admin\", \"editor\", \"lector\"] ___;\ntype Rol = typeof ROLES[___];", banco:["as const","number","string","keyof","readonly"], sol:["as const","number"],
  why:"typeof ROLES[number] es «el tipo de cualquier elemento»: \"admin\" | \"editor\" | \"lector\". Una única fuente de verdad para el valor y el tipo."}
]},

/* =============== U2 L4 =============== */
{
id:"ts2n1",
titulo:"Funciones a fondo",
claves:["Tipos de función: (a: number) =&gt; string; parámetros opcionales, por defecto y rest","Un callback que devuelve void puede devolver algo: se ignora","Sobrecargas: varias firmas públicas y una implementación que las cubre"],
pasos:[
 {t:"info", eti:"Firmas", h:"Tipar funciones",
  c:`<div class="termbox">type Comparador&lt;T&gt; = (a: T, b: T) =&gt; number;
type Manejador = (evento: MouseEvent) =&gt; void;

function aplicar(valores: number[], fn: (n: number) =&gt; number): number[] {
  return valores.map(fn);
}

function saludar(nombre: string, saludo?: string): string { ... }   // opcional
function paginar(pagina = 1, tamano = 20) { ... }                   // por defecto: se infiere number
function sumar(...nums: number[]): number { ... }                  // rest

// firma de llamada con propiedades
type Contador = { (): number; reiniciar(): void };</div>
     <p>Un parámetro opcional debe ir detrás de los obligatorios. Y un <code>async</code> siempre devuelve <code>Promise&lt;...&gt;</code>: <code>async function cargar(): Promise&lt;Usuario&gt;</code>.</p>`},
 {t:"info", eti:"Varias firmas", h:"Sobrecargas",
  c:`<div class="termbox">function crearFecha(timestamp: number): Date;
function crearFecha(anio: number, mes: number, dia: number): Date;
function crearFecha(a: number, mes?: number, dia?: number): Date {   // implementación
  return mes !== undefined &amp;&amp; dia !== undefined ? new Date(a, mes - 1, dia) : new Date(a);
}

crearFecha(1700000000000);    // OK
crearFecha(2026, 9, 23);      // OK
crearFecha(2026, 9);          // error: No overload expects 2 arguments</div>
     <p>Solo las firmas de arriba son públicas: la de implementación no se puede llamar desde fuera. Antes de escribir sobrecargas, pregúntate si basta con una unión o con parámetros opcionales: suelen ser más simples.</p>`},
 {t:"opcion", p:"¿Qué tipo describe una función que recibe un id numérico y devuelve una promesa de Usuario?",
  ops:["(id: number) =&gt; Usuario","(id: number) =&gt; Promise&lt;Usuario&gt;","Promise&lt;(id: number) =&gt; Usuario&gt;","async number"],
  ok:1, why:"Las funciones async siempre devuelven Promise&lt;...&gt;."},
 {t:"opcion", p:"¿Compila?", c:`<div class="termbox">const nums: number[] = [];
[1, 2, 3].forEach(n =&gt; nums.push(n));   // push devuelve un number</div>`,
  ops:["No: forEach espera un callback que devuelva void","Sí: un tipo de función que devuelve void acepta funciones que devuelven algo; el valor se ignora","No: falta anotar n","Solo sin strict"],
  ok:1, why:"Es a propósito: si no, no podrías pasar funciones flecha de una línea que casualmente devuelven un valor. Ojo: en una declaración function f(): void { return 1 } sí da error."},
 {t:"vf", p:"En unas sobrecargas, la firma de la implementación también se puede llamar desde fuera.",
  ok:false, why:"Solo son visibles las firmas de sobrecarga; la implementación debe ser compatible con todas, pero queda oculta."},
 {t:"par", p:"Empareja cada firma con lo que permite",
  pares:[["(nombre: string, saludo?: string)","Llamar con uno o dos argumentos"],["(...ids: number[])","Cualquier número de ids"],["(pagina = 1)","Omitirlo y usar 1; el tipo se infiere number"],["(cb: () => void)","Pasar cualquier función sin parámetros; su retorno se ignora"]],
  why:"Los parámetros por defecto se infieren del valor: no hace falta anotarlos."},
 {t:"hueco", p:"Tipa el callback: recibe un texto y devuelve un booleano",
  tpl:"function filtrar(lista: string[], cond: (s: ___) ___ boolean) { return lista.filter(cond); }", banco:["string","=>",":","any","->"], sol:["string","=>"],
  why:"En tipos de función, el retorno va tras =&gt;; en una declaración function, tras los dos puntos."}
]},

/* =============== U2 L5 =============== */
{
id:"ts2l4",
titulo:"Firmas de índice, Record y Map",
claves:["Firma de índice { [clave: string]: T } para objetos con claves arbitrarias","Record&lt;K, V&gt; es más legible y, con una unión de claves, obliga a tenerlas todas","Con noUncheckedIndexedAccess, leer una clave dinámica devuelve T | undefined"],
pasos:[
 {t:"info", eti:"Claves dinámicas", h:"Objetos diccionario",
  c:`<div class="termbox">interface Traducciones {
  [clave: string]: string;               // cualquier clave, valores string
}
const es: Traducciones = { hola: "Hola", adios: "Adiós" };
const t = es["gracias"];                 // string... ¡aunque no exista!

type StockPorProducto = Record&lt;string, number&gt;;
type Idiomas = Record&lt;"es" | "en", string&gt;;   // exactamente esas dos claves

const visitas = new Map&lt;string, number&gt;();
visitas.set("/inicio", 1);
visitas.get("/inicio");                  // number | undefined (Map siempre avisa)</div>
     <p>Con la opción <code>noUncheckedIndexedAccess</code> (la trae el <code>tsconfig</code> que genera <code>tsc --init</code>), <code>es["gracias"]</code> pasa a ser <code>string | undefined</code>: más honesto.</p>`},
 {t:"info", eti:"Cuál elegir", h:"Objeto o Map",
  c:`<div class="dg"><div class="dg-tit">diccionarios en typescript</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">Record / objeto</div><div class="dg-pila"><div class="dg-caja">Claves string o number</div><div class="dg-caja">Se serializa a JSON directamente</div><div class="dg-caja ok">Claves fijas conocidas: Record&lt;Union, V&gt;</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">Map</div><div class="dg-pila"><div class="dg-caja">Claves de cualquier tipo (objetos incluidos)</div><div class="dg-caja">Mantiene orden de inserción y tiene size</div><div class="dg-caja ok">Muchas altas y bajas dinámicas</div></div></div>
       </div></div>`},
 {t:"par", p:"Empareja cada construcción con su uso",
  pares:[["{ [k: string]: number }","Objeto con claves libres y valores numéricos"],["Record<\"es\" | \"en\", string>","Objeto con exactamente esas claves"],["Map<string, number>","Diccionario en ejecución con altas y bajas frecuentes"],["Partial<Record<\"es\" | \"en\", string>>","Esas claves, pero todas opcionales"]],
  why:"Si las claves son un conjunto conocido, Record con una unión te protege de olvidar alguna."},
 {t:"opcion", p:"¿Qué ventaja tiene <code>Record&lt;\"es\" | \"en\", string&gt;</code> frente a <code>{ [k: string]: string }</code>?",
  ops:["Ninguna","Obliga a definir exactamente las claves es y en, y rechaza otras","Es más rápido","Permite números"],
  ok:1, why:"Si añades un idioma a la unión, el compilador te pedirá su traducción en todos los sitios."},
 {t:"opcion", p:"Con <code>noUncheckedIndexedAccess</code> activado, ¿qué tipo tiene <code>precio</code>?", c:`<div class="termbox">const precios: Record&lt;string, number&gt; = { pan: 1.2 };
const precio = precios["leche"];</div>`,
  ops:["number","number | undefined","undefined","any"],
  ok:1, why:"Con claves libres nadie garantiza que exista: la opción te obliga a comprobarlo antes de operar."},
 {t:"vf", p:"<code>map.get(clave)</code> de un <code>Map&lt;string, number&gt;</code> devuelve <code>number | undefined</code> aunque no actives ninguna opción.",
  ok:true, why:"La firma de get ya lo declara así. Si acabas de comprobar has(clave), igualmente tendrás que tratar el undefined (o usar el valor de get directamente)."},
 {t:"escribe", p:"Escribe el tipo de un objeto cuyas claves son los días <code>\"lun\" | \"mar\"</code> y cuyos valores son números, usando el utilitario de TypeScript",
  sol:["Record<\"lun\" | \"mar\", number>","Record<'lun' | 'mar', number>","Record<\"lun\"|\"mar\", number>","Record<'lun'|'mar', number>","Record<\"lun\" | \"mar\",number>"], pista:"Record&lt;claves, valores&gt;.",
  why:"Record&lt;K, V&gt; es un tipo mapeado: { [P in K]: V }."}
]}

]});
