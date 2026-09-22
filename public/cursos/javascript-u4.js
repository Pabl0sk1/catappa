window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Arrays",
resumen: "Crear y modificar arrays, map, filter, reduce, find, some y every, ordenar, desestructurar e inmutabilidad",
nivel: "Intermedio",
color: "#dcc63f",
lecciones: [

{
id:"js4l1",
titulo:"Crear y modificar arrays",
claves:["push/pop al final, unshift/shift al principio, splice en medio","length, includes, indexOf, at(-1)","Métodos que mutan frente a métodos que devuelven un array nuevo"],
pasos:[
 {t:"info", eti:"Listas", h:"Operaciones básicas",
  c:`<div class="termbox">const tareas = ["docker", "git"];
tareas.push("sql");          // al final        -&gt; ["docker", "git", "sql"]
tareas.pop();                // quita el ultimo -&gt; ["docker", "git"]
tareas.unshift("linux");     // al principio    -&gt; ["linux", "docker", "git"]
tareas.shift();              // quita el primero
tareas.length;               // 2
tareas.includes("git");      // true
tareas.indexOf("git");       // 1
tareas.at(-1);               // "git" (ultimo)
tareas.splice(0, 1);         // borra 1 elemento en la posicion 0
[...tareas, "react"];        // copia con un elemento mas (no muta)</div>`},
 {t:"par", p:"Empareja cada método con lo que hace",
  pares:[["push","Añade al final (muta)"],["pop","Quita el último (muta)"],["unshift","Añade al principio (muta)"],["slice(1, 3)","Devuelve una copia de una parte (no muta)"],["splice(1, 2)","Elimina elementos del original (muta)"]],
  why:"slice y splice se confunden mucho: slice copia, splice modifica."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a.length);</div>`,
  ops:["3","4","Error","undefined"],
  ok:1, why:"b y a son el mismo array. Para copiar: const b = [...a]."},
 {t:"vf", p:"<code>[1, 2, 3].at(-1)</code> devuelve 3.",
  ok:true, why:"at acepta índices negativos, contando desde el final."}
]},

{
id:"js4l2",
titulo:"map, filter y reduce",
claves:["map transforma cada elemento; filter se queda con algunos; reduce combina en un valor","Devuelven valores nuevos sin modificar el original","Se encadenan: filter → map → reduce"],
pasos:[
 {t:"info", eti:"El trío esencial", h:"Transformar, filtrar y reducir",
  c:`<div class="termbox">const productos = [
  { nombre: "Teclado", precio: 90, stock: 5 },
  { nombre: "Ratón",   precio: 25, stock: 0 },
  { nombre: "Monitor", precio: 240, stock: 3 },
];

const nombres = productos.map(p =&gt; p.nombre);                  // ["Teclado", "Ratón", "Monitor"]
const disponibles = productos.filter(p =&gt; p.stock &gt; 0);        // Teclado y Monitor
const valorStock = productos.reduce((total, p) =&gt; total + p.precio * p.stock, 0);   // 1170

const caros = productos
  .filter(p =&gt; p.precio &gt; 50)
  .map(p =&gt; p.nombre.toUpperCase());                            // ["TECLADO", "MONITOR"]</div>`},
 {t:"par", p:"Empareja cada método con su resultado",
  pares:[["map","Array del mismo tamaño con cada elemento transformado"],["filter","Array con los elementos que cumplen la condición"],["reduce","Un único valor acumulado"],["forEach","Nada: solo ejecuta algo por cada elemento"]],
  why:"Si usas map y no usas el array que devuelve, probablemente querías forEach."},
 {t:"escribe", p:"A partir del array <code>precios</code>, obtén un array nuevo <code>conIva</code> con cada precio multiplicado por 1.21",
  sol:["const conIva = precios.map(p => p * 1.21);","const conIva = precios.map((p) => p * 1.21);","const conIva = precios.map(precio => precio * 1.21);","const conIva = precios.map((precio) => precio * 1.21);","const conIva = precios.map(x => x * 1.21);"], ph:"const conIva = ...", pista:"precios.map(p => ...)", why:"map crea un array nuevo transformando cada elemento."},
 {t:"opcion", p:"¿Qué devuelve?", c:`<div class="termbox">[1, 2, 3, 4].filter(n =&gt; n % 2 === 0).map(n =&gt; n * 10)</div>`,
  ops:["[10, 20, 30, 40]","[20, 40]","[2, 4]","60"],
  ok:1, why:"filter deja [2, 4] y map los multiplica por 10."},
 {t:"vf", p:"<code>map</code> modifica el array original.",
  ok:false, why:"Devuelve uno nuevo. El original queda intacto."}
]},

{
id:"js4l3",
titulo:"Buscar, comprobar y ordenar",
claves:["find y findIndex encuentran el primero que cumple; some y every comprueban","sort ordena en el sitio y compara como texto si no le das comparador","toSorted, toReversed y with devuelven copias (ES2023)"],
pasos:[
 {t:"info", eti:"Buscar", h:"find, some y every",
  c:`<div class="termbox">const usuario = usuarios.find(u =&gt; u.email === "ana@x.com");   // el objeto o undefined
const pos = usuarios.findIndex(u =&gt; u.id === 7);                 // indice o -1
const hayAdmins = usuarios.some(u =&gt; u.rol === "admin");          // al menos uno
const todosActivos = usuarios.every(u =&gt; u.activo);               // todos</div>`},
 {t:"info", eti:"La trampa de sort", h:"Ordenar",
  c:`<div class="termbox">[10, 9, 100].sort()                     // [10, 100, 9]  compara como TEXTO
[10, 9, 100].sort((a, b) =&gt; a - b)      // [9, 10, 100]  numerico ascendente
productos.sort((a, b) =&gt; b.precio - a.precio)          // por precio descendente
nombres.sort((a, b) =&gt; a.localeCompare(b, "es"))       // alfabetico con tildes bien

const ordenados = productos.toSorted((a, b) =&gt; a.precio - b.precio);   // copia, no muta</div>`},
 {t:"par", p:"Empareja cada método con su resultado",
  pares:[["find","El primer elemento que cumple, o undefined"],["findIndex","La posición del primero que cumple, o -1"],["some","true si al menos uno cumple"],["every","true si todos cumplen"],["includes","true si contiene exactamente ese valor"]],
  why:"find y some paran en cuanto encuentran: más eficientes que filter para estas preguntas."},
 {t:"opcion", p:"¿Qué devuelve <code>[5, 1, 10, 2].sort()</code>?",
  ops:["[1, 2, 5, 10]","[1, 10, 2, 5]","[10, 5, 2, 1]","Error"],
  ok:1, why:"Sin comparador, sort convierte a texto: \"10\" va antes que \"2\". Siempre pasa (a, b) => a - b para números."},
 {t:"vf", p:"<code>sort</code> devuelve un array nuevo y deja el original sin cambios.",
  ok:false, why:"Ordena el original (y lo devuelve). Para no mutar: toSorted o [...arr].sort()."}
]},

{
id:"js4l4",
titulo:"Desestructuración e inmutabilidad",
claves:["const [a, b] = array; const [primero, ...resto] = array","Copias con spread y structuredClone para copias profundas","Actualizar sin mutar: map para cambiar, filter para quitar, spread para añadir"],
pasos:[
 {t:"info", eti:"Extraer", h:"Desestructurar arrays",
  c:`<div class="termbox">const [primero, segundo] = ["oro", "plata", "bronce"];
const [ganador, ...resto] = ["oro", "plata", "bronce"];   // resto = ["plata", "bronce"]
const [, , tercero] = ["oro", "plata", "bronce"];          // saltar posiciones
let a = 1, b = 2;
[a, b] = [b, a];                                           // intercambiar</div>`},
 {t:"info", eti:"Sin mutar", h:"Actualizaciones inmutables",
  c:`<div class="termbox">const tareas = [{ id: 1, hecha: false }, { id: 2, hecha: false }];

const conNueva = [...tareas, { id: 3, hecha: false }];                  // anadir
const sinLa1   = tareas.filter(t =&gt; t.id !== 1);                         // quitar
const marcada  = tareas.map(t =&gt; t.id === 2 ? { ...t, hecha: true } : t); // cambiar una

const copiaProfunda = structuredClone(tareas);   // copia tambien los objetos de dentro</div>
     <p>React y muchas librerías detectan cambios comparando referencias: si mutas el array, no se enteran. Por eso este estilo es imprescindible en frontend.</p>`},
 {t:"par", p:"Empareja cada operación inmutable con su código",
  pares:[["Añadir al final","[...lista, nuevo]"],["Quitar por id","lista.filter(x => x.id !== id)"],["Cambiar uno","lista.map(x => x.id === id ? { ...x, ...cambios } : x)"],["Copia profunda","structuredClone(lista)"]],
  why:"Con estos cuatro patrones gestionarás el estado de casi cualquier interfaz."},
 {t:"opcion", p:"<code>const copia = [...tareas]; copia[0].hecha = true;</code> ¿Cambia también <code>tareas[0]</code>?",
  ops:["No","Sí: spread hace una copia superficial; los objetos de dentro son los mismos","Error","Depende del navegador"],
  ok:1, why:"Copia superficial: nuevo array, mismos objetos. Para cambiar uno sin mutar, crea un objeto nuevo con { ...t }."}
]}

]});
