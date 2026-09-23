window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Qué es TypeScript",
resumen: "Por qué tipos, el compilador tsc (y el nuevo tsc nativo de TypeScript 7), anotaciones e inferencia, tipado estructural y any, unknown, never y void",
nivel: "Fundamentos",
color: "#4f8fd9",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"ts1l1",
titulo:"JavaScript con tipos",
claves:["TypeScript añade tipos estáticos a JavaScript y se compila a JavaScript normal","Detecta errores al escribir, antes de ejecutar, y da autocompletado y refactorizaciones seguras","Los tipos desaparecen al compilar: no existen en tiempo de ejecución"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué problema resuelve?",
  c:`<div class="termbox">// JavaScript: el error aparece al ejecutar... o en producción
function total(pedido) {
  return pedido.lineas.reduce((s, l) =&gt; s + l.precio * l.cantidad, 0);
}
total({ lineas: [{ precio: "10", cantidad: 2 }] });   // 20: "10" * 2 funciona por casualidad
total({ linea: [] });                                 // TypeError: Cannot read properties of undefined</div>
     <p><b>TypeScript</b> es JavaScript con <b>tipos</b>. Describes la forma de tus datos y el editor te avisa mientras escribes:</p>
     <div class="termbox">interface Linea { precio: number; cantidad: number }
function total(pedido: { lineas: Linea[] }): number { ... }
total({ lineas: [{ precio: "10", cantidad: 2 }] });
//                         ~~~~~ Type 'string' is not assignable to type 'number'.
total({ linea: [] });
//      ~~~~~ Object literal may only specify known properties...</div>
     <p>El valor real no está solo en cazar erratas: con tipos, el editor <b>autocompleta</b>, <b>renombra</b> un campo en cien ficheros sin romper nada y te dice qué devuelve cada función sin abrirla. En un proyecto grande, eso es lo que permite cambiar código con confianza.</p>`},
 {t:"info", eti:"Cómo funciona", h:"Comprobar y borrar",
  c:`<div class="dg"><div class="dg-tit">de typescript a javascript</div>
       <div class="dg-flujo"><div class="dg-caja acento"><code>app.ts</code></div><div class="dg-caja doble"><code>tsc</code><small>comprueba tipos y los elimina</small></div><div class="dg-caja ok"><code>app.js</code></div><div class="dg-caja base">navegador o Node</div></div>
     </div>
     <p>El compilador hace dos trabajos independientes: <b>comprobar</b> los tipos y <b>emitir</b> JavaScript quitándolos. Incluso si hay errores de tipos, por defecto sigue generando el <code>.js</code>: los tipos no cambian lo que hace el programa.</p>
     <p>Consecuencias: TypeScript no cambia el rendimiento, y tampoco valida los datos que llegan en ejecución (una API, un formulario, un fichero): eso requiere validación aparte, que verás más adelante.</p>
     <div class="nota dato"><b class="tit">Dónde se usa</b>La mayoría de proyectos profesionales de frontend y Node: Angular está escrito en TypeScript, y React, Vue, Next.js, Express o NestJS se usan casi siempre con él.</div>`},
 {t:"par", p:"Empareja cada afirmación con si es cierta en TypeScript",
  pares:[["Detecta errores de tipos al escribir","Sí, en el editor y al compilar"],["Existe en tiempo de ejecución","No: se compila a JavaScript sin tipos"],["Valida el JSON que llega de una API","No por sí solo: hace falta validación en runtime"],["Es compatible con el JavaScript existente","Sí: se puede migrar fichero a fichero"]],
  why:"Entender que los tipos se borran evita muchos malentendidos: todo lo que hace TypeScript ocurre antes de ejecutar."},
 {t:"opcion", p:"¿Qué le llega al navegador cuando despliegas una app escrita en TypeScript?",
  ops:["El código .ts con los tipos","JavaScript normal generado por el compilador o el bundler","Bytecode de TypeScript","WebAssembly"],
  ok:1, why:"Los navegadores no ejecutan TypeScript. Node (22.18+) y Deno sí pueden ejecutar .ts, pero lo hacen quitando los tipos al vuelo, sin comprobarlos."},
 {t:"vf", p:"Una anotación de tipo en TypeScript comprueba en tiempo de ejecución que el valor es correcto.",
  ok:false, why:"Solo se comprueba al compilar. En ejecución, un JSON mal formado pasaría sin avisar."},
 {t:"opcion", p:"Un compañero escribe esto y espera que funcione. ¿Qué pasa?", c:`<div class="termbox">interface Usuario { id: number; nombre: string }
if (typeof datos === Usuario) { ... }</div>`,
  ops:["Funciona: comprueba que datos es un Usuario","Error: Usuario es un tipo y no existe en ejecución; typeof de JavaScript devuelve un texto como \"object\"","Funciona solo con strict","Funciona si Usuario es una clase exportada"],
  ok:1, why:"Una interface no deja rastro en el JavaScript generado. Para comprobar en ejecución hacen falta comprobaciones reales (guardas o un esquema de validación)."},
 {t:"escribe", p:"¿Qué extensión usan los ficheros TypeScript que contienen JSX (componentes de React)?",
  sol:[".tsx","tsx"], pista:"Como .jsx, pero de TypeScript.",
  why:"Los .ts normales no admiten JSX porque la sintaxis &lt;Tipo&gt;valor chocaría con las etiquetas."}
]},

/* =============== U1 L2 =============== */
{
id:"ts1l2",
titulo:"Instalar y compilar",
claves:["npm install -D typescript; npx tsc --init crea un tsconfig.json moderno y estricto","tsc compila; tsc --noEmit solo comprueba tipos (lo típico en CI)","TypeScript 7 reescribió el compilador en Go: el mismo tsc, del orden de 10 veces más rápido"],
pasos:[
 {t:"info", eti:"Puesta en marcha", h:"El compilador",
  c:`<div class="termbox">npm install -D typescript       # por proyecto, nunca global
npx tsc --init                   # crea tsconfig.json
npx tsc                          # compila según tsconfig
npx tsc --noEmit                 # solo comprueba tipos (típico en CI)
npx tsc --watch                  # recompila al guardar
npx tsc -v
Version 7.0.2</div>
     <p>En la práctica rara vez llamas a <code>tsc</code> para generar código: <b>Vite</b> (frontend), <b>tsx</b> (scripts de Node), el propio Node o frameworks como Next.js quitan los tipos por ti con herramientas rapidísimas (esbuild, SWC) que <b>no comprueban</b> nada. Por eso <code>tsc --noEmit</code> sigue siendo el paso que valida los tipos en el pipeline.</p>`},
 {t:"info", eti:"Versiones", h:"De TypeScript 5.9 a TypeScript 7",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">las versiones que vas a encontrar</div><table class="dg-tabla"><thead><tr><th>versión</th><th>qué supuso</th></tr></thead><tbody>
<tr><td>5.x (hasta 5.9, 2025)</td><td>El compilador escrito en TypeScript. Muchísimos proyectos siguen en 5.9.</td></tr>
<tr><td>6.0 (marzo 2026)</td><td>Versión puente: <code>strict</code> pasa a estar activado por defecto y se deprecan opciones antiguas (<code>baseUrl</code>, <code>moduleResolution: node</code>, <code>target: es5</code>, <code>outFile</code>...).</td></tr>
<tr><td>7.0 (julio 2026)</td><td>El compilador nativo, reescrito en Go: mismo lenguaje y mismo <code>tsc</code>, del orden de 10 veces más rápido. Las opciones deprecadas en 6.0 ya no existen.</td></tr>
</tbody></table></div>
     <p>El lenguaje que escribes es el mismo en las tres: lo que cambia es la velocidad del compilador y las opciones de configuración admitidas.</p>`},
 {t:"term", p:"Comprueba los tipos de todo el proyecto sin generar ficheros",
  prompt:"pablo@portatil:~/tareas-web$", sol:["npx tsc --noEmit","tsc --noEmit","npx tsc --noemit","npx tsc -p . --noEmit"],
  pista:"npx tsc con la opción --noEmit.",
  salida:`src/api.ts:14:5 - error TS2322: Type 'string' is not assignable to type 'number'.

14     precio: "10",
       ~~~~~~

Found 1 error in src/api.ts:14`, why:"Añádelo al CI: si hay errores de tipos, el pipeline falla. El código TS2322 se puede buscar para entender el error."},
 {t:"term", p:"Crea el fichero de configuración del compilador en un proyecto nuevo",
  prompt:"pablo@portatil:~/api$", sol:["npx tsc --init","tsc --init"],
  pista:"tsc con la opción que inicializa.",
  salida:`Created a new tsconfig.json

You can learn more at https://aka.ms/tsconfig`, why:"Desde TypeScript 5.9 el tsconfig generado es corto y moderno: strict, noUncheckedIndexedAccess, module nodenext, verbatimModuleSyntax..."},
 {t:"par", p:"Empareja cada comando con su uso",
  pares:[["npx tsc --init","Crear tsconfig.json"],["npx tsc","Compilar a JavaScript"],["npx tsc --noEmit","Solo comprobar tipos"],["npx tsx script.ts","Ejecutar TypeScript en Node sin compilar a mano"],["node script.ts","Ejecutar TypeScript en Node 22.18+ quitando los tipos al vuelo"]],
  why:"Ejecutar no es comprobar: tsx y node script.ts ejecutan aunque haya errores de tipos."},
 {t:"vf", p:"<code>node servidor.ts</code> en Node 22.18 o posterior comprueba los tipos antes de ejecutar el fichero.",
  ok:false, why:"Node solo borra la sintaxis de tipos (type stripping). Si hay un error de tipos, ejecuta igual. La comprobación sigue siendo cosa de tsc."},
 {t:"opcion", p:"Tu proyecto usa Vite para el frontend. ¿Qué paso añades al CI para no desplegar con errores de tipos?",
  ops:["Ninguno: Vite ya comprueba los tipos al compilar","<code>tsc --noEmit</code> (o <code>tsc -b</code>) antes del build","<code>npm install typescript -g</code>","Activar <code>sourceMap</code>"],
  ok:1, why:"Vite usa esbuild para quitar los tipos a toda velocidad, sin comprobarlos. Por eso las plantillas de Vite ejecutan tsc -b antes de vite build."}
]},

/* =============== U1 L3 =============== */
{
id:"ts1l3",
titulo:"Anotaciones e inferencia",
claves:["variable: tipo anota; casi siempre TypeScript lo infiere solo","let amplía el tipo (widening); const conserva el literal","Anota parámetros y retornos de funciones públicas; deja inferir lo local"],
pasos:[
 {t:"info", eti:"Poner tipos", h:"Anotar o dejar inferir",
  c:`<div class="termbox">let nombre: string = "Ana";            // anotado (innecesario: se infiere)
let edad = 31;                        // inferido: number
const activo = true;                  // inferido: true (literal, porque es const)
let etiquetas: string[] = [];         // aquí SÍ hace falta: [] solo no dice de qué
let puntos: Array&lt;number&gt; = [1, 2];

function precioConIva(base: number, iva = 0.21): number {
  return base * (1 + iva);
}

edad = "treinta";   // error: Type 'string' is not assignable to type 'number'</div>
     <p>Regla práctica: anota los <b>parámetros</b> (no se pueden inferir) y los <b>retornos</b> de funciones exportadas (protegen el contrato); deja que TypeScript <b>infiera</b> las variables locales.</p>`},
 {t:"info", eti:"Por dentro", h:"Ampliación y tipado contextual",
  c:`<div class="termbox">let modo = "oscuro";          // string: con let podrías reasignarlo
const modo2 = "oscuro";       // "oscuro": con const nunca cambiará

const config = { modo: "oscuro" };   // { modo: string }: las propiedades se pueden cambiar

["a", "b"].map(s =&gt; s.toUpperCase());          // s es string: lo deduce del array
window.addEventListener("keydown", e =&gt; e.key); // e es KeyboardEvent: lo deduce del nombre del evento</div>
     <p>A esto último se le llama <b>tipado contextual</b>: el tipo del parámetro de un callback se deduce de dónde se usa. Por eso casi nunca anotas los parámetros de funciones flecha que pasas a <code>map</code>, <code>filter</code> o manejadores de eventos.</p>`},
 {t:"escribe", p:"Declara una variable <code>ciudad</code> de tipo string con valor Madrid",
  sol:["let ciudad: string = \"Madrid\";","const ciudad: string = \"Madrid\";","let ciudad: string = 'Madrid';","const ciudad: string = 'Madrid';","let ciudad: string = \"Madrid\"","const ciudad: string = \"Madrid\"","let ciudad:string = \"Madrid\";","const ciudad:string = \"Madrid\";"], ph:"let ciudad: ...", pista:"let, el nombre, dos puntos, el tipo y el valor.", why:"let ciudad: string = \"Madrid\"; aunque en la práctica let ciudad = \"Madrid\" ya se infiere como string."},
 {t:"par", p:"Empareja cada declaración con el tipo que infiere TypeScript",
  pares:[["let x = 5","number"],["const y = 5","5 (tipo literal)"],["let z = [1, 2]","number[]"],["const m = [1, \"a\"]","(string | number)[]"],["const f = (a: number) => a > 0","(a: number) => boolean"]],
  why:"Pasa el ratón por encima de una variable en VS Code y verás el tipo inferido."},
 {t:"opcion", p:"¿Qué tipo infiere TypeScript para <code>config.modo</code>?", c:`<div class="termbox">const config = { modo: "oscuro", zoom: 1 };</div>`,
  ops:["\"oscuro\"","string","any","readonly \"oscuro\""],
  ok:1, why:"const protege la variable, no las propiedades del objeto: config.modo = \"claro\" es válido, así que se amplía a string. Para conservar el literal: as const."},
 {t:"opcion", p:"¿Dónde aportan más las anotaciones explícitas?",
  ops:["En cada variable local","En los parámetros y retornos de funciones, sobre todo las exportadas","En los comentarios","En ningún sitio: todo se infiere"],
  ok:1, why:"Los parámetros no se pueden inferir, y el retorno explícito hace que un cambio accidental en el cuerpo dé error en la función y no en quien la llama."},
 {t:"hueco", p:"Completa para que la lista vacía sea de textos y la función devuelva número",
  tpl:"const nombres: ___ = [];\nfunction contar(lista: string[]): ___ { return lista.length; }", banco:["string[]","number","any[]","void","Array"], sol:["string[]","number"],
  why:"Sin anotar, un [] vacío con let o const se infiere de forma poco útil: anótalo cuando el valor inicial no diga el tipo."}
]},

/* =============== U1 L4 =============== */
{
id:"ts1n1",
titulo:"Tipado estructural",
claves:["TypeScript compara formas, no nombres: si tiene las propiedades necesarias, encaja","Un objeto con propiedades de más es asignable, salvo en literales frescos (excess property check)","{} significa «cualquier cosa no nula», no «objeto vacío»"],
pasos:[
 {t:"info", eti:"Si parece un pato", h:"Formas, no nombres",
  c:`<div class="termbox">interface Punto { x: number; y: number }
class Coordenada { constructor(public x: number, public y: number, public z = 0) {} }

function pintar(p: Punto) { ... }

pintar(new Coordenada(1, 2));        // OK: tiene x e y (y además z)
const p3 = { x: 1, y: 2, z: 3 };
pintar(p3);                          // OK: sobran propiedades, pero no es un literal fresco
pintar({ x: 1, y: 2, z: 3 });        // error: 'z' does not exist in type 'Punto'</div>
     <p>En Java o C#, un tipo solo es compatible si <b>declara</b> que implementa la interfaz (tipado nominal). En TypeScript basta con que tenga la forma: es <b>tipado estructural</b>, igual que el «duck typing» de JavaScript pero comprobado al compilar.</p>
     <p>La excepción del último caso es la <b>comprobación de propiedades de más</b>: en un literal escrito directamente, una propiedad sobrante casi siempre es una errata, así que TypeScript avisa.</p>`},
 {t:"info", eti:"Trampas", h:"Los tipos «anchos»",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué acepta cada tipo</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>acepta</th></tr></thead><tbody>
<tr><td><code>{}</code></td><td>Todo salvo null y undefined (también 5 y "hola")</td></tr>
<tr><td><code>object</code></td><td>Cualquier valor no primitivo: objetos, arrays, funciones</td></tr>
<tr><td><code>Object</code></td><td>Casi lo mismo que <code>{}</code>: no lo uses</td></tr>
<tr><td><code>Record&lt;string, unknown&gt;</code></td><td>Objetos con claves de texto: lo habitual para «un objeto cualquiera»</td></tr>
</tbody></table></div>`},
 {t:"opcion", p:"¿Compila?", c:`<div class="termbox">interface Animal { nombre: string }
const perro = { nombre: "Toby", raza: "beagle" };
const a: Animal = perro;</div>`,
  ops:["No: perro tiene una propiedad raza que Animal no declara","Sí: perro tiene nombre, y como no es un literal fresco no se comprueban las propiedades de más","No: hay que escribir implements Animal","Solo si raza es opcional"],
  ok:1, why:"La comprobación de propiedades sobrantes solo se aplica al asignar un literal directamente. Asignando una variable, basta con tener la forma."},
 {t:"opcion", p:"¿Compila?", c:`<div class="termbox">const a: Animal = { nombre: "Toby", raza: "beagle" };</div>`,
  ops:["Sí, igual que con la variable","No: Object literal may only specify known properties, and 'raza' does not exist in type 'Animal'","Sí, pero raza se borra","No: falta un as"],
  ok:1, why:"Es un literal fresco: la propiedad de más se considera una probable errata."},
 {t:"vf", p:"En TypeScript, una clase solo es asignable a una interfaz si la declara con <code>implements</code>.",
  ok:false, why:"implements solo sirve para que el compilador compruebe la clase al declararla. Cualquier objeto con la forma adecuada es compatible."},
 {t:"vf", p:"Una variable de tipo <code>{}</code> admite el número 42.",
  ok:true, why:"{} significa «cualquier valor que no sea null ni undefined». Para «un objeto» usa object o Record&lt;string, unknown&gt;."},
 {t:"par", p:"Empareja cada tipo con lo que acepta",
  pares:[["{}","Cualquier cosa salvo null y undefined"],["object","Cualquier valor no primitivo"],["Record<string, unknown>","Objetos con claves de texto y valores sin comprobar"],["{ id: number }","Cualquier valor que tenga al menos id numérico"]],
  why:"Elegir el tipo ancho correcto evita que se cuelen valores inesperados."}
]},

/* =============== U1 L5 =============== */
{
id:"ts1l4",
titulo:"any, unknown, never y void",
claves:["any desactiva la comprobación de tipos y se contagia: evítalo","unknown obliga a comprobar el tipo antes de usar el valor","never representa lo que no puede ocurrir; void, una función sin valor de retorno útil"],
pasos:[
 {t:"info", eti:"Tipos especiales", h:"La vía de escape y la segura",
  c:`<div class="termbox">let a: any = JSON.parse(texto);
a.lo.que.sea();           // compila... y explota en ejecución
const n: number = a;      // any se asigna a todo: el agujero se propaga

let u: unknown = JSON.parse(texto);
u.nombre;                 // error: 'u' is of type 'unknown'
if (typeof u === "object" &amp;&amp; u !== null &amp;&amp; "nombre" in u) {
  console.log(u.nombre);  // ahora sí (u.nombre es unknown)
}

function fallar(msg: string): never {   // nunca devuelve
  throw new Error(msg);
}
function log(msg: string): void { console.log(msg); }</div>
     <div class="nota ojo"><b class="tit">any se contagia</b>Un <code>any</code> que entra por una función acaba en variables, retornos y props de componentes sin que nadie lo vea. Muchos equipos activan la regla <code>no-explicit-any</code> de typescript-eslint para vigilarlo.</div>`},
 {t:"info", eti:"La jerarquía", h:"Arriba y abajo",
  c:`<div class="dg"><div class="dg-tit">de más ancho a más estrecho</div>
       <div class="dg-vert"><div class="dg-caja acento doble"><code>unknown</code><small>tipo superior: acepta cualquier valor</small></div><div class="dg-caja doble"><code>string</code>, <code>number</code>, <code>Usuario</code>...<small>los tipos normales</small></div><div class="dg-caja aviso doble"><code>never</code><small>tipo inferior: no tiene ningún valor</small></div></div>
       <div class="dg-nota">any está fuera de la jerarquía: se asigna a todo y todo se le asigna</div>
     </div>
     <p>Todo es asignable a <code>unknown</code>; <code>never</code> es asignable a todo. Por eso <code>never</code> aparece en ramas imposibles y en funciones que siempre lanzan.</p>`},
 {t:"par", p:"Empareja cada tipo con su significado",
  pares:[["any","Cualquier cosa, sin comprobaciones (desactiva TypeScript)"],["unknown","Cualquier cosa, pero hay que comprobarla antes de usarla"],["never","Un valor que nunca existe (función que siempre lanza, caso imposible)"],["void","La función no devuelve un valor útil"]],
  why:"Para datos externos (JSON, catch), unknown es la opción segura."},
 {t:"opcion", p:"Recibes datos de una API y aún no los has validado. ¿Qué tipo usas?",
  ops:["any","unknown, y lo estrechas tras validarlo","never","string"],
  ok:1, why:"unknown te obliga a comprobar; any deja pasar errores."},
 {t:"opcion", p:"¿Compila?", c:`<div class="termbox">const v: unknown = 42;
const n: number = v;</div>`,
  ops:["Sí: 42 es un número","No: unknown no se puede asignar a number sin estrecharlo antes","Sí, pero n vale undefined","No: 42 no es unknown"],
  ok:1, why:"unknown solo se asigna a unknown y a any. Primero if (typeof v === \"number\") y dentro ya es number."},
 {t:"vf", p:"Con la opción <code>strict</code>, el error de un <code>catch (e)</code> es de tipo <code>unknown</code>.",
  ok:true, why:"Porque se puede lanzar cualquier cosa (throw \"texto\" es válido): hay que comprobar if (e instanceof Error)."},
 {t:"hueco", p:"Completa las firmas: una función que siempre lanza y otra que solo escribe en consola",
  tpl:"function abortar(m: string): ___ { throw new Error(m); }\nfunction avisar(m: string): ___ { console.warn(m); }", banco:["never","void","undefined","any","unknown"], sol:["never","void"],
  why:"never: nunca termina con normalidad. void: termina, pero no devuelve nada que se deba usar."}
]}

]});
