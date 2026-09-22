window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Genéricos",
resumen: "Funciones y tipos genéricos, restricciones con extends, keyof y valores por defecto de parámetros de tipo",
nivel: "Intermedio",
color: "#4583cc",
lecciones: [

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

async function obtener&lt;T&gt;(url: string): Promise&lt;T&gt; {
  const res = await fetch(url);
  return res.json() as Promise&lt;T&gt;;
}
const tareas = await obtener&lt;Paginado&lt;Tarea&gt;&gt;("/api/tareas");</div>`},
 {t:"par", p:"Empareja cada declaración con su significado",
  pares:[["function f<T>(x: T): T","Devuelve el mismo tipo que recibe"],["interface Caja<T> { valor: T }","Contenedor de cualquier tipo"],["Promise<Usuario>","Promesa que se resuelve con un Usuario"],["Array<number>","Lo mismo que number[]"]],
  why:"Los genéricos son a los tipos lo que los parámetros a las funciones."},
 {t:"opcion", p:"¿Qué tipo tiene <code>x</code>?", c:`<div class="termbox">function envolver&lt;T&gt;(v: T) { return { valor: v }; }
const x = envolver(true);</div>`,
  ops:["{ valor: any }","{ valor: boolean }","boolean","T"],
  ok:1, why:"TypeScript infiere T = boolean a partir del argumento."},
 {t:"vf", p:"Con genéricos casi nunca necesitas escribir el tipo al llamar a la función: se infiere de los argumentos.",
  ok:true, why:"Solo hace falta indicarlo cuando no se puede deducir (como en obtener&lt;T&gt;(url))."}
]},

{
id:"ts4l2",
titulo:"Restricciones y keyof",
claves:["T extends X limita qué tipos acepta el genérico","keyof T es la unión de las claves de T","K extends keyof T permite acceder a T[K] con seguridad"],
pasos:[
 {t:"info", eti:"Poner límites", h:"extends en genéricos",
  c:`<div class="termbox">function masLargo&lt;T extends { length: number }&gt;(a: T, b: T): T {
  return a.length &gt;= b.length ? a : b;
}
masLargo("hola", "adios");       // ok
masLargo([1, 2], [3]);           // ok
masLargo(5, 7);                  // error: number no tiene length

function propiedad&lt;T, K extends keyof T&gt;(obj: T, clave: K): T[K] {
  return obj[clave];
}
const u = { nombre: "Ana", edad: 31 };
propiedad(u, "edad");            // number
propiedad(u, "email");           // error: "email" no es una clave de u</div>`},
 {t:"par", p:"Empareja cada expresión con su resultado sobre <code>type U = { id: number; nombre: string }</code>",
  pares:[["keyof U","\"id\" | \"nombre\""],["U[\"id\"]","number"],["U[keyof U]","number | string"],["T extends U","T debe tener al menos id y nombre"]],
  why:"keyof y el acceso indexado son la base de los tipos utilitarios."},
 {t:"opcion", p:"¿Qué aporta <code>K extends keyof T</code> en la función propiedad?",
  ops:["Nada","Que solo se acepten claves que existen en el objeto y que el retorno tenga el tipo exacto de esa propiedad","Que el objeto sea inmutable","Que la función sea más rápida"],
  ok:1, why:"Errores de erratas en nombres de propiedades detectados al compilar."},
 {t:"hueco", p:"Completa para que T tenga obligatoriamente una propiedad <code>id</code> numérica",
  tpl:"function porId<T ___ { id: number }>(lista: T[], id: number) {}", banco:["extends","implements","keyof","is"], sol:["extends"],
  why:"En genéricos, extends significa «debe ser asignable a»."}
]},

{
id:"ts4l3",
titulo:"Genéricos en la práctica",
claves:["Parámetros de tipo con valor por defecto: &lt;T = unknown&gt;","Un cliente HTTP tipado reutilizable","No abuses: si un genérico solo aparece una vez, probablemente sobra"],
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
const porEstado = agruparPor(tareas.items, t =&gt; t.estado);</div>`},
 {t:"opcion", p:"¿Qué problema tiene <code>function log&lt;T&gt;(x: T): void { console.log(x); }</code>?",
  ops:["Ninguno","El genérico no aporta nada: T solo aparece una vez; basta con x: unknown","No compila","Es más lento"],
  ok:1, why:"Un genérico sirve para relacionar tipos (entrada con salida o entre parámetros)."},
 {t:"par", p:"Empareja cada firma con lo que relaciona",
  pares:[["<T>(x: T) => T","La salida tiene el mismo tipo que la entrada"],["<T>(lista: T[]) => T | undefined","El elemento devuelto es del tipo de la lista"],["<K extends keyof T>(o: T, k: K) => T[K]","La clave existe y el retorno es el tipo de esa propiedad"],["<T = unknown>","Si no se indica T, vale unknown"]],
  why:"Si no relaciona nada, no hace falta un genérico."}
]}

]});
