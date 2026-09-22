window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Qué es TypeScript",
resumen: "JavaScript con tipos, el compilador tsc, anotaciones e inferencia, tipos básicos y any, unknown y never",
nivel: "Fundamentos",
color: "#4f8fd9",
lecciones: [

{
id:"ts1l1",
titulo:"JavaScript con tipos",
claves:["TypeScript añade tipos estáticos a JavaScript y se compila a JavaScript normal","Detecta errores al escribir, antes de ejecutar","Los tipos desaparecen al compilar: no existen en tiempo de ejecución"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué problema resuelve?",
  c:`<div class="termbox">// JavaScript: el error aparece al ejecutar... o en produccion
function total(pedido) {
  return pedido.lineas.reduce((s, l) =&gt; s + l.precio * l.cantidad, 0);
}
total({ lineas: [{ precio: "10", cantidad: 2 }] });   // "0102"... sin avisar</div>
     <p><b>TypeScript</b> es JavaScript con <b>tipos</b>. Tú describes la forma de tus datos y el editor te avisa mientras escribes:</p>
     <div class="termbox">interface Linea { precio: number; cantidad: number }
function total(pedido: { lineas: Linea[] }): number { ... }
total({ lineas: [{ precio: "10", cantidad: 2 }] });
//                         ~~~~~ Type 'string' is not assignable to type 'number'.</div>`},
 {t:"info", eti:"Cómo funciona", h:"Compilar a JavaScript",
  c:`<div class="diag">app.ts  --(tsc: comprueba tipos y los elimina)--&gt;  app.js  --&gt; navegador o Node</div>
     <p>Los tipos son solo para el desarrollo: el JavaScript resultante no los tiene. Por eso TypeScript no cambia el rendimiento, y por eso tampoco valida datos que llegan en tiempo de ejecución (una API, un formulario): eso requiere validación aparte.</p>
     <p>Lo usan la mayoría de proyectos profesionales de frontend y Node: Angular está escrito en TypeScript, y React, Vue, Express o NestJS se usan habitualmente con él.</p>`},
 {t:"par", p:"Empareja cada afirmación con si es cierta en TypeScript",
  pares:[["Detecta errores de tipos al escribir","Sí, en el editor y al compilar"],["Existe en tiempo de ejecución","No: se compila a JavaScript sin tipos"],["Valida el JSON que llega de una API","No por sí solo: hace falta validación en runtime"],["Es compatible con el JavaScript existente","Sí: todo JavaScript válido es casi siempre TypeScript válido"]],
  why:"Entender que los tipos se borran evita muchos malentendidos."},
 {t:"opcion", p:"¿Qué le llega al navegador cuando despliegas una app escrita en TypeScript?",
  ops:["El código .ts con los tipos","JavaScript normal generado por el compilador","Bytecode","WebAssembly"],
  ok:1, why:"Los navegadores no ejecutan TypeScript. (Node 22+ y Deno pueden ejecutar .ts quitando los tipos al vuelo.)"},
 {t:"vf", p:"Una anotación de tipo en TypeScript comprueba en tiempo de ejecución que el valor es correcto.",
  ok:false, why:"Solo se comprueba al compilar. En ejecución, un JSON mal formado pasaría sin avisar."}
]},

{
id:"ts1l2",
titulo:"Instalar y compilar",
claves:["npm install -D typescript y npx tsc --init crea tsconfig.json","tsc compila; tsc --noEmit solo comprueba tipos","En proyectos reales, Vite, tsx o el propio framework compilan por ti"],
pasos:[
 {t:"info", eti:"Puesta en marcha", h:"El compilador",
  c:`<div class="termbox">npm install -D typescript
npx tsc --init                 # crea tsconfig.json
npx tsc                        # compila segun tsconfig
npx tsc --noEmit               # solo comprueba tipos (tipico en CI)
npx tsc --watch                # recompila al guardar</div>
     <p>En la práctica rara vez llamas a <code>tsc</code> para generar código: <b>Vite</b> (frontend), <b>tsx</b> (scripts de Node) o frameworks como Next.js lo hacen solos. Pero <code>tsc --noEmit</code> sigue siendo el paso que comprueba los tipos en el pipeline.</p>`},
 {t:"term", p:"Comprueba los tipos de todo el proyecto sin generar ficheros",
  prompt:"pablo@portatil:~/tareas-web$", sol:["npx tsc --noEmit","tsc --noEmit","npx tsc --noemit"],
  pista:"npx tsc con la opción --noEmit.",
  salida:`src/api.ts:14:5 - error TS2322: Type 'string' is not assignable to type 'number'.

Found 1 error in src/api.ts:14`, why:"Añádelo al CI: si hay errores de tipos, el pipeline falla."},
 {t:"par", p:"Empareja cada comando con su uso",
  pares:[["npx tsc --init","Crear tsconfig.json"],["npx tsc","Compilar a JavaScript"],["npx tsc --noEmit","Solo comprobar tipos"],["npx tsx script.ts","Ejecutar un fichero TypeScript en Node sin compilar a mano"]],
  why:"El código de error (TS2322) se puede buscar para entender el problema."},
 {t:"vf", p:"<code>tsc --noEmit</code> genera los ficheros .js en la carpeta de salida.",
  ok:false, why:"noEmit: comprueba tipos sin escribir nada."}
]},

{
id:"ts1l3",
titulo:"Anotaciones e inferencia",
claves:["variable: tipo anota; muchas veces TypeScript lo infiere solo","Anota parámetros y retornos de funciones públicas; deja inferir lo local","Tipos básicos: string, number, boolean, arrays (string[]), null, undefined"],
pasos:[
 {t:"info", eti:"Poner tipos", h:"Anotar o dejar inferir",
  c:`<div class="termbox">let nombre: string = "Ana";
let edad = 31;                       // inferido: number
const activo = true;                 // inferido: true (literal, porque es const)
let etiquetas: string[] = [];
let puntos: Array&lt;number&gt; = [1, 2];

function precioConIva(base: number, iva = 0.21): number {
  return base * (1 + iva);
}

edad = "treinta";   // error: Type 'string' is not assignable to type 'number'</div>
     <p>Regla práctica: anota los <b>parámetros</b> y los <b>retornos</b> de funciones exportadas; deja que TypeScript <b>infiera</b> las variables locales.</p>`},
 {t:"escribe", p:"Declara una variable <code>ciudad</code> de tipo string con valor Madrid",
  sol:["let ciudad: string = \"Madrid\";","const ciudad: string = \"Madrid\";","let ciudad: string = 'Madrid';","const ciudad: string = 'Madrid';","let ciudad: string = \"Madrid\"","const ciudad: string = \"Madrid\""], ph:"let ciudad: ...", pista:"let, el nombre, dos puntos, el tipo y el valor.", why:"let ciudad: string = \"Madrid\";"},
 {t:"par", p:"Empareja cada declaración con el tipo que infiere TypeScript",
  pares:[["let x = 5","number"],["const y = 5","5 (tipo literal)"],["let z = [1, 2]","number[]"],["let w = null","any (o null con strict)"],["const f = (a: number) => a > 0","(a: number) => boolean"]],
  why:"Pasa el ratón por encima de una variable en VS Code y verás el tipo inferido."},
 {t:"opcion", p:"¿Dónde aportan más las anotaciones explícitas?",
  ops:["En cada variable local","En los parámetros y retornos de funciones, sobre todo las exportadas","En los comentarios","En ningún sitio: todo se infiere"],
  ok:1, why:"Los parámetros no se pueden inferir, y el retorno explícito protege el contrato de la función."}
]},

{
id:"ts1l4",
titulo:"any, unknown y never",
claves:["any desactiva la comprobación de tipos: evítalo","unknown obliga a comprobar el tipo antes de usar el valor","never representa lo que no puede ocurrir; void, una función sin valor de retorno"],
pasos:[
 {t:"info", eti:"Tipos especiales", h:"La vía de escape y la segura",
  c:`<div class="termbox">let a: any = JSON.parse(texto);
a.lo.que.sea();           // compila... y explota en ejecucion

let u: unknown = JSON.parse(texto);
u.nombre;                 // error: 'u' is of type 'unknown'
if (typeof u === "object" &amp;&amp; u !== null &amp;&amp; "nombre" in u) {
  console.log(u.nombre);  // ahora si
}

function fallar(msg: string): never {   // nunca devuelve
  throw new Error(msg);
}
function log(msg: string): void { console.log(msg); }</div>`},
 {t:"par", p:"Empareja cada tipo con su significado",
  pares:[["any","Cualquier cosa, sin comprobaciones (desactiva TypeScript)"],["unknown","Cualquier cosa, pero hay que comprobarla antes de usarla"],["never","Un valor que nunca existe (función que siempre lanza, caso imposible)"],["void","La función no devuelve un valor útil"]],
  why:"Para datos externos (JSON, catch), unknown es la opción segura."},
 {t:"opcion", p:"Recibes datos de una API y aún no los has validado. ¿Qué tipo usas?",
  ops:["any","unknown, y lo estrechas tras validarlo","never","string"],
  ok:1, why:"unknown te obliga a comprobar; any deja pasar errores."},
 {t:"vf", p:"Con la opción <code>strict</code>, el error de un <code>catch (e)</code> es de tipo <code>unknown</code>.",
  ok:true, why:"Porque se puede lanzar cualquier cosa: hay que comprobar if (e instanceof Error)."}
]}

]});
