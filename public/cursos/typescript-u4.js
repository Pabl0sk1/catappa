window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Genéricos",
resumen: "Funciones y tipos genéricos, restricciones con extends, keyof, typeof y acceso indexado, genéricos en código real y genéricos avanzados: const, NoInfer y varianza",
nivel: "Intermedio",
color: "#4583cc",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"ts4l1",
titulo:"Funciones y tipos genéricos",
claves:["Un genérico es un parámetro de tipo: &lt;T&gt; se decide al usar la función","Mantiene la relación entre entrada y salida sin perder información","Tipos genéricos reutilizables: Respuesta&lt;T&gt;, Paginado&lt;T&gt;"],
pasos:[
 {t:"info", eti:"Tipos como parámetros", h:"Por qué genéricos",
  c:`<div class="termbox">function primero(lista: any[]): any { return lista[0]; }        // pierde el tipo
function primero&lt;T&gt;(lista: T[]): T | undefined { return lista[0]; }

const n = primero([1, 2, 3]);         // number | undefined
const s = primero(["a", "b"]);        // string | undefined

interface Paginado&lt;T&gt; {
  items: T[];
  total: number;
  pagina: number;
}

const tareas: Paginado&lt;Tarea&gt; = { items: [], total: 0, pagina: 1 };</div>
     <p>Un genérico es a los tipos lo que un parámetro a una función: un hueco que se rellena al usarlo. <code>Array&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code> o <code>Map&lt;K, V&gt;</code> son genéricos que ya usas a diario.</p>`},
 {t:"info", eti:"Cómo se decide T", h:"Inferencia de argumentos de tipo",
  c:`<div class="termbox">function envolver&lt;T&gt;(v: T) { return { valor: v }; }

envolver(true);              // T = boolean (inferido del argumento)
envolver&lt;string&gt;("hola");    // T = string (explícito)
envolver&lt;string&gt;(42);        // error: 42 no es string

function crearLista&lt;T&gt;(): T[] { return []; }
crearLista();                // T = unknown: no hay de dónde deducirlo
crearLista&lt;Tarea&gt;();         // aquí sí hace falta indicarlo</div>
     <p>Casi nunca escribes el tipo al llamar: se deduce de los argumentos. Solo hace falta cuando T no aparece en ningún parámetro.</p>`},
 {t:"par", p:"Empareja cada declaración con su significado",
  pares:[["function f<T>(x: T): T","Devuelve el mismo tipo que recibe"],["interface Caja<T> { valor: T }","Contenedor de cualquier tipo"],["Promise<Usuario>","Promesa que se resuelve con un Usuario"],["Array<number>","Lo mismo que number[]"],["Map<string, Tarea>","Diccionario de claves string y valores Tarea"]],
  why:"Los genéricos son a los tipos lo que los parámetros a las funciones."},
 {t:"opcion", p:"¿Qué tipo tiene <code>x</code>?", c:`<div class="termbox">function envolver&lt;T&gt;(v: T) { return { valor: v }; }
const x = envolver(true);</div>`,
  ops:["{ valor: any }","{ valor: boolean }","boolean","T"],
  ok:1, why:"TypeScript infiere T = boolean a partir del argumento."},
 {t:"opcion", p:"¿Qué tipo tiene <code>par</code>?", c:`<div class="termbox">function juntar&lt;A, B&gt;(a: A, b: B): [A, B] { return [a, b]; }
const par = juntar("id", 7);</div>`,
  ops:["[string, number]","[\"id\", 7]","(string | number)[]","[A, B]"],
  ok:0, why:"Cada parámetro de tipo se infiere de su argumento, ampliado a string y number porque no son parámetros const."},
 {t:"vf", p:"Con genéricos casi nunca necesitas escribir el tipo al llamar a la función: se infiere de los argumentos.",
  ok:true, why:"Solo hace falta indicarlo cuando no se puede deducir, como en crearLista&lt;Tarea&gt;()."},
 {t:"hueco", p:"Completa la función genérica que devuelve el último elemento",
  tpl:"function ultimo___(lista: ___[]): T | undefined {\n  return lista[lista.length - 1];\n}", banco:["<T>","T","any","<any>","unknown"], sol:["<T>","T"],
  why:"El parámetro de tipo se declara tras el nombre y se usa en parámetros y retorno."}
]},

/* =============== U4 L2 =============== */
{
id:"ts4l2",
titulo:"Restricciones genéricas",
claves:["T extends X limita qué tipos acepta el genérico y permite usar lo que X garantiza","K extends keyof T permite acceder a T[K] con seguridad","Parámetros de tipo con valor por defecto: &lt;T = unknown&gt;"],
pasos:[
 {t:"info", eti:"Poner límites", h:"extends en genéricos",
  c:`<div class="termbox">function masLargo&lt;T extends { length: number }&gt;(a: T, b: T): T {
  return a.length &gt;= b.length ? a : b;
}
masLargo("hola", "adios");       // OK
masLargo([1, 2], [3]);           // OK
masLargo(5, 7);                  // error: number no tiene length

function propiedad&lt;T, K extends keyof T&gt;(obj: T, clave: K): T[K] {
  return obj[clave];
}
const u = { nombre: "Ana", edad: 31 };
propiedad(u, "edad");            // number
propiedad(u, "email");           // error: "email" no es una clave de u</div>
     <p>Sin la restricción, dentro de la función <code>a.length</code> daría error: un <code>T</code> cualquiera podría no tenerlo. <code>extends</code> aquí significa «debe ser asignable a», no herencia de clases.</p>`},
 {t:"info", eti:"Error típico", h:"«could be instantiated with a different subtype»",
  c:`<div class="termbox">function conId&lt;T extends { id: number }&gt;(x: T): T {
  return { id: 0 };
  // error: '{ id: number; }' is assignable to the constraint of type 'T',
  //        but 'T' could be instantiated with a different subtype of constraint
}</div>
     <p>Quien llama decide <code>T</code>. Si pide <code>conId&lt;Usuario&gt;</code>, espera un <code>Usuario</code> completo, no un objeto con solo <code>id</code>. Cuando veas este error, el arreglo suele ser devolver algo construido a partir de <code>x</code> (<code>{ ...x, id: 0 }</code>) o no usar genérico en el retorno.</p>`},
 {t:"par", p:"Empareja cada firma con lo que exige",
  pares:[["<T extends string>","T debe ser texto (o un literal de texto)"],["<T extends { id: number }>","T debe tener al menos id numérico"],["<K extends keyof T>","K debe ser una clave de T"],["<T = unknown>","Si no se indica ni se infiere, T vale unknown"]],
  why:"Las restricciones documentan y hacen cumplir lo que la función necesita."},
 {t:"opcion", p:"¿Qué aporta <code>K extends keyof T</code> en la función propiedad?",
  ops:["Nada","Que solo se acepten claves que existen en el objeto y que el retorno tenga el tipo exacto de esa propiedad","Que el objeto sea inmutable","Que la función sea más rápida"],
  ok:1, why:"Erratas en nombres de propiedades detectadas al compilar, y autocompletado de las claves."},
 {t:"hueco", p:"Completa para que T tenga obligatoriamente una propiedad <code>id</code> numérica",
  tpl:"function porId<T ___ { id: number }>(lista: T[], id: number) {}", banco:["extends","implements","keyof","is"], sol:["extends"],
  why:"En genéricos, extends significa «debe ser asignable a»."},
 {t:"opcion", p:"¿Compila la llamada?", c:`<div class="termbox">function ordenarPor&lt;T, K extends keyof T&gt;(lista: T[], clave: K): T[] { ... }
const tareas = [{ id: 1, titulo: "a" }];
ordenarPor(tareas, "fecha");</div>`,
  ops:["Sí","No: \"fecha\" no es asignable a \"id\" | \"titulo\"","Sí, pero devuelve any","No: faltan los argumentos de tipo"],
  ok:1, why:"T se infiere de tareas, así que keyof T es \"id\" | \"titulo\"."},
 {t:"vf", p:"En <code>&lt;T extends { length: number }&gt;</code>, T solo puede ser exactamente <code>{ length: number }</code>.",
  ok:false, why:"Puede ser cualquier tipo que tenga length numérico: string, arrays, tuplas o tus objetos."}
]},

/* =============== U4 L3 =============== */
{
id:"ts4n1",
titulo:"keyof, typeof y acceso indexado",
claves:["keyof T es la unión de las claves de T","typeof valor da el tipo de una variable; keyof typeof obj, las claves de un objeto real","T[\"prop\"], T[number] y T[keyof T] extraen tipos de otros tipos"],
pasos:[
 {t:"info", eti:"Operadores de tipos", h:"Tipos a partir de tipos",
  c:`<div class="termbox">interface Tarea { id: number; titulo: string; hecha: boolean }

type Claves = keyof Tarea;              // "id" | "titulo" | "hecha"
type Titulo = Tarea["titulo"];          // string
type IdOTitulo = Tarea["id" | "titulo"];// number | string
type Valores = Tarea[keyof Tarea];      // number | string | boolean

const PRECIOS = { basico: 5, pro: 12, empresa: 40 };
type Plan = keyof typeof PRECIOS;       // "basico" | "pro" | "empresa"

const tareas = [{ id: 1, titulo: "a", hecha: false }];
type Elemento = typeof tareas[number];  // { id: number; titulo: string; hecha: boolean }

type Respuesta = { datos: { usuarios: { id: number; nombre: string }[] } };
type UsuarioApi = Respuesta["datos"]["usuarios"][number];   // tipo de un elemento</div>`},
 {t:"info", eti:"Dos mundos", h:"Valores y tipos",
  c:`<div class="dg"><div class="dg-tit">typeof según dónde se escriba</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">en una expresión (JavaScript)</div><div class="dg-pila"><div class="dg-caja"><code>typeof x === "string"</code></div><div class="dg-caja base">devuelve un texto en ejecución</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">en un tipo (TypeScript)</div><div class="dg-pila"><div class="dg-caja acento"><code>type C = typeof config</code></div><div class="dg-caja base">da el tipo del valor al compilar</div></div></div>
       </div></div>
     <p><code>keyof</code> solo trabaja con tipos: con un objeto real necesitas <code>keyof typeof obj</code>. Y el acceso indexado va con corchetes (<code>Tarea["id"]</code>), nunca con punto.</p>`},
 {t:"par", p:"Empareja cada expresión con su resultado sobre <code>type U = { id: number; nombre: string }</code>",
  pares:[["keyof U","\"id\" | \"nombre\""],["U[\"id\"]","number"],["U[keyof U]","number | string"],["Pick<U, \"id\">","{ id: number }"]],
  why:"keyof y el acceso indexado son la base de los tipos utilitarios."},
 {t:"opcion", p:"Tienes <code>const ICONOS = { ok: \"✓\", error: \"✗\" }</code>. ¿Cómo obtienes el tipo <code>\"ok\" | \"error\"</code>?",
  ops:["keyof ICONOS","keyof typeof ICONOS","typeof keyof ICONOS","ICONOS[keyof]"],
  ok:1, why:"ICONOS es un valor: primero typeof para pasar a su tipo, y luego keyof."},
 {t:"opcion", p:"¿Qué tipo es <code>typeof listado[number]</code>?", c:`<div class="termbox">const listado = [{ sku: "A1", stock: 3 }, { sku: "B2", stock: 0 }];</div>`,
  ops:["number","{ sku: string; stock: number }","{ sku: string; stock: number }[]","\"A1\" | \"B2\""],
  ok:1, why:"Indexar un tipo array con number da el tipo de sus elementos."},
 {t:"escribe", p:"Escribe el tipo de la propiedad <code>email</code> del tipo <code>Usuario</code> usando acceso indexado",
  sol:["Usuario[\"email\"]","Usuario['email']"], pista:"Corchetes y el nombre de la propiedad entre comillas.",
  why:"Si cambias el tipo de email en Usuario, todo lo derivado se actualiza."},
 {t:"hueco", p:"Obtén la unión de los valores de un objeto <code>as const</code>",
  tpl:"const ESTADO = { Abierto: \"abierto\", Cerrado: \"cerrado\" } as const;\ntype Estado = (___ ESTADO)[___ typeof ESTADO];", banco:["typeof","keyof","number","in"], sol:["typeof","keyof"],
  why:"(typeof ESTADO)[keyof typeof ESTADO] da \"abierto\" | \"cerrado\": el patrón para sustituir enums."}
]},

/* =============== U4 L4 =============== */
{
id:"ts4l3",
titulo:"Genéricos en la práctica",
claves:["Un cliente HTTP tipado y utilidades como agruparPor","Regla de oro: un parámetro de tipo debe aparecer al menos dos veces","Un genérico en el retorno sin validar es una aserción disfrazada"],
pasos:[
 {t:"info", eti:"Código real", h:"Un cliente de API tipado",
  c:`<div class="termbox">type Paginado&lt;T&gt; = { items: T[]; total: number; pagina: number };

async function api&lt;T = unknown&gt;(ruta: string, init?: RequestInit): Promise&lt;T&gt; {
  const res = await fetch(\`/api\${ruta}\`, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as Promise&lt;T&gt;;
}

const tareas = await api&lt;Paginado&lt;Tarea&gt;&gt;("/tareas?pagina=0");
tareas.items[0]?.titulo;                  // tipado

function agruparPor&lt;T, K extends PropertyKey&gt;(lista: T[], clave: (x: T) =&gt; K): Record&lt;K, T[]&gt; {
  return lista.reduce((acc, x) =&gt; {
    (acc[clave(x)] ??= []).push(x);
    return acc;
  }, {} as Record&lt;K, T[]&gt;);
}
const porEstado = agruparPor(tareas.items, t =&gt; t.estado);</div>
     <div class="nota ojo"><b class="tit">La mentira del api&lt;T&gt;</b>Este <code>api&lt;Tarea&gt;</code> no comprueba nada: es un <code>as</code> escondido tras un genérico. Es aceptable si confías en tu backend; si no, pasa un esquema de validación y deriva el tipo de él (lo verás con Zod).</div>`},
 {t:"opcion", p:"¿Qué problema tiene <code>function log&lt;T&gt;(x: T): void { console.log(x); }</code>?",
  ops:["Ninguno","El genérico no aporta nada: T solo aparece una vez; basta con x: unknown","No compila","Es más lento"],
  ok:1, why:"Un genérico sirve para relacionar tipos (entrada con salida o entre parámetros)."},
 {t:"par", p:"Empareja cada firma con lo que relaciona",
  pares:[["<T>(x: T) => T","La salida tiene el mismo tipo que la entrada"],["<T>(lista: T[]) => T | undefined","El elemento devuelto es del tipo de la lista"],["<K extends keyof T>(o: T, k: K) => T[K]","La clave existe y el retorno es el tipo de esa propiedad"],["<T>(a: T, b: T) => boolean","Los dos argumentos son del mismo tipo"]],
  why:"Si no relaciona nada, no hace falta un genérico."},
 {t:"opcion", p:"¿Por qué <code>function parsear&lt;T&gt;(json: string): T</code> es una mala firma?",
  ops:["Porque JSON.parse no existe en TypeScript","Porque T solo aparece en el retorno: quien llama elige T sin que nada lo compruebe, igual que un as","Porque falta async","Porque debería devolver never"],
  ok:1, why:"Mejor devolver unknown y validar, o recibir un esquema: parsear(json, EsquemaTarea)."},
 {t:"escribe", p:"¿Qué tipo predefinido de TypeScript representa cualquier tipo válido como clave de objeto (<code>string | number | symbol</code>)?",
  sol:["PropertyKey"], pista:"Se usa en la restricción de agruparPor.",
  why:"K extends PropertyKey permite usar K como clave de un Record."},
 {t:"codigo", p:"Implementa <code>agruparPor(lista, clave)</code> en JavaScript. La entrada tiene líneas <code>titulo;estado</code>. Agrupa por estado e imprime cada estado en orden de primera aparición con sus títulos: <code>estado: t1, t2</code>.", lenguaje:"js",
  plantilla:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst tareas = lineas.map(l => { const [titulo, estado] = l.split(\";\"); return { titulo, estado }; });\n\nfunction agruparPor(lista, clave) {\n  // devuelve un objeto { valorDeClave: [elementos] }\n}\n\nconst g = agruparPor(tareas, t => t.estado);\nfor (const [k, v] of Object.entries(g)) console.log(k + \": \" + v.map(t => t.titulo).join(\", \"));\n",
  pruebas:[{entrada:"comprar pan;hecha\nllamar;pendiente\nregar;hecha\n", salida:"hecha: comprar pan, regar\npendiente: llamar"},{entrada:"a;x\nb;y\nc;z\nd;y\n", salida:"x: a\ny: b, d\nz: c", oculta:true}],
  pista:"reduce con un objeto vacío y (acc[k] ??= []).push(x).",
  solucion:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst tareas = lineas.map(l => { const [titulo, estado] = l.split(\";\"); return { titulo, estado }; });\n\nfunction agruparPor(lista, clave) {\n  return lista.reduce((acc, x) => {\n    (acc[clave(x)] ??= []).push(x);\n    return acc;\n  }, {});\n}\n\nconst g = agruparPor(tareas, t => t.estado);\nfor (const [k, v] of Object.entries(g)) console.log(k + \": \" + v.map(t => t.titulo).join(\", \"));\n",
  why:"En TypeScript, la firma &lt;T, K extends PropertyKey&gt;(lista: T[], clave: (x: T) =&gt; K): Record&lt;K, T[]&gt; hace que el resultado tenga exactamente las claves posibles. (Desde ES2024 existe Object.groupBy, que hace lo mismo.)"}
]},

/* =============== U4 L5 =============== */
{
id:"ts4n2",
titulo:"Genéricos avanzados: const, NoInfer y varianza",
claves:["&lt;const T&gt; infiere literales como si el llamante hubiera escrito as const","NoInfer&lt;T&gt; impide que un parámetro participe en la inferencia de T","Varianza: los arrays son covariantes (y no del todo seguros); los parámetros de función, contravariantes"],
pasos:[
 {t:"info", eti:"Inferir más fino", h:"const y NoInfer",
  c:`<div class="termbox">function rutas&lt;const T extends readonly string[]&gt;(r: T): T { return r; }
const r = rutas(["/", "/perfil"]);      // readonly ["/", "/perfil"], sin as const

function crearSemaforo&lt;C extends string&gt;(colores: C[], inicial: NoInfer&lt;C&gt;) { ... }
crearSemaforo(["rojo", "verde"], "azul");
// sin NoInfer: C = "rojo" | "verde" | "azul" y no hay error
// con NoInfer: error, "azul" no está entre los colores</div>
     <p>Los parámetros <code>const</code> (TS 5.0) y <code>NoInfer</code> (TS 5.4) sirven sobre todo a quien escribe librerías: dan a quien las usa tipos exactos sin pedirle anotaciones.</p>`},
 {t:"info", eti:"Por dentro", h:"Varianza",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">si Perro es un subtipo de Animal...</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>relación</th><th>nombre</th></tr></thead><tbody>
<tr><td><code>Perro[]</code> → <code>Animal[]</code></td><td>se puede asignar</td><td>covariante</td></tr>
<tr><td><code>(a: Animal) =&gt; void</code> → <code>(p: Perro) =&gt; void</code></td><td>se puede asignar</td><td>contravariante</td></tr>
<tr><td><code>(p: Perro) =&gt; void</code> → <code>(a: Animal) =&gt; void</code></td><td>error con <code>strictFunctionTypes</code></td><td>no seguro</td></tr>
</tbody></table></div>
     <div class="termbox">const perros: Perro[] = [];
const animales: Animal[] = perros;   // permitido por comodidad...
animales.push(new Gato());           // ...y ahora hay un gato en la lista de perros</div>
     <p>TypeScript acepta esa covarianza de arrays a sabiendas: es un agujero conocido del sistema de tipos. Si una función no debe modificar la lista, recibe <code>readonly Animal[]</code>. Las anotaciones <code>in</code> y <code>out</code> (<code>interface Productor&lt;out T&gt;</code>) permiten declarar la varianza a mano en tipos genéricos.</p>`},
 {t:"opcion", p:"¿Qué tipo tiene <code>x</code>?", c:`<div class="termbox">function fijar&lt;const T&gt;(v: T) { return v; }
const x = fijar({ modo: "oscuro", zoom: 2 });</div>`,
  ops:["{ modo: string; zoom: number }","{ readonly modo: \"oscuro\"; readonly zoom: 2 }","any","T"],
  ok:1, why:"Un parámetro de tipo const infiere como si el argumento llevara as const."},
 {t:"opcion", p:"¿Para qué sirve <code>NoInfer&lt;C&gt;</code> en el parámetro <code>inicial</code>?",
  ops:["Para que inicial sea opcional","Para que C se deduzca solo de colores y el valor inicial tenga que ser uno de ellos","Para desactivar la comprobación de inicial","Para que C sea unknown"],
  ok:1, why:"Sin él, el compilador ampliaría C para que encajase el valor erróneo."},
 {t:"vf", p:"Con <code>strictFunctionTypes</code>, una función que acepta <code>Perro</code> se puede usar donde se espera una que acepte cualquier <code>Animal</code>.",
  ok:false, why:"Al revés: quien llame podría pasarle un Gato. Sí vale una que acepta Animal donde se espera una que acepta Perro (contravarianza)."},
 {t:"par", p:"Empareja cada herramienta con su versión y uso",
  pares:[["<const T>","TS 5.0: inferir literales sin as const"],["NoInfer<T>","TS 5.4: excluir un parámetro de la inferencia"],["<out T>","Declarar un genérico covariante"],["readonly T[]","Aceptar listas sin poder modificarlas"]],
  why:"Son piezas de diseño de APIs tipadas: tu código de aplicación las usa poco, las librerías mucho."},
 {t:"hueco", p:"Haz que el argumento se infiera como tupla de literales",
  tpl:"function columnas<___ T extends readonly string[]>(c: T) { return c; }\nconst cols = columnas([\"id\", \"nombre\"]);  // readonly [\"id\", \"nombre\"]", banco:["const","readonly","as","infer"], sol:["const"],
  why:"El modificador const va en la declaración del parámetro de tipo; la restricción readonly string[] permite que se infiera la tupla de solo lectura."}
]}

]});
