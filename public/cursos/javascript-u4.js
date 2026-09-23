window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Arrays",
resumen: "Crear y modificar arrays, map, filter y reduce, buscar y ordenar, métodos modernos que no mutan, agrupar, desestructurar e inmutabilidad",
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
tareas.pop();                // quita el último -&gt; ["docker", "git"]
tareas.unshift("linux");     // al principio    -&gt; ["linux", "docker", "git"]
tareas.shift();              // quita el primero
tareas.length;               // 2
tareas.includes("git");      // true
tareas.indexOf("git");       // 1
tareas.at(-1);               // "git" (último)
tareas.splice(0, 1);         // borra 1 elemento en la posición 0
[...tareas, "react"];        // copia con un elemento más (no muta)
tareas.join(", ");           // texto: "git"</div>`},
 {t:"info", eti:"Otras formas de crearlos", h:"Array.from, fill y of",
  c:`<div class="termbox">Array.from({ length: 3 }, (_, i) =&gt; i * 10);   // [0, 10, 20]
Array.from("hola");                              // ["h", "o", "l", "a"]
Array.from(document.querySelectorAll("li"));     // NodeList -&gt; array
new Array(3).fill(0);                            // [0, 0, 0]
Array.of(7);                                     // [7]  (new Array(7) serían 7 huecos)</div>
     <div class="nota ojo"><b class="tit">Rellenar con objetos</b><code>new Array(3).fill({})</code> mete <b>el mismo objeto</b> tres veces. Para objetos distintos: <code>Array.from({ length: 3 }, () =&gt; ({}))</code>.</div>`},
 {t:"par", p:"Empareja cada método con lo que hace",
  pares:[["push","Añade al final (muta)"],["pop","Quita el último (muta)"],["unshift","Añade al principio (muta)"],["slice(1, 3)","Devuelve una copia de una parte (no muta)"],["splice(1, 2)","Elimina elementos del original (muta)"]],
  why:"slice y splice se confunden mucho: slice copia, splice modifica."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a.length);</div>`,
  ops:["3","4","Error","undefined"],
  ok:1, why:"b y a son el mismo array. Para copiar: const b = [...a]."},
 {t:"codigo", p:"Lee una lista de palabras separadas por comas y devuelve un array con la primera y la última, unidas por <code> - </code>",
  lenguaje:"js",
  c:`<p>Con <code>rojo,verde,azul</code> imprime <code>rojo - azul</code>. Usa <code>split</code>, <code>at</code> y <code>join</code>.</p>`,
  plantilla:`const palabras = require("fs").readFileSync(0, "utf8").trim().split(",");
// imprime primera - última
`,
  pruebas:[{entrada:"rojo,verde,azul\n", salida:"rojo - azul"},{entrada:"uno,dos\n", salida:"uno - dos", oculta:true}],
  pista:"[palabras[0], palabras.at(-1)].join(\" - \")",
  solucion:`const palabras = require("fs").readFileSync(0, "utf8").trim().split(",");
console.log([palabras[0], palabras.at(-1)].join(" - "));`,
  why:"at(-1) evita el clásico palabras[palabras.length - 1]."},
 {t:"codigo", p:"Genera con <code>Array.from</code> la tabla del 7 (del 7 al 70) e imprímela separada por espacios",
  lenguaje:"js",
  plantilla:`const tabla = []; // créala con Array.from
console.log(tabla.join(" "));
`,
  pruebas:[{salida:"7 14 21 28 35 42 49 56 63 70"}],
  pista:"Array.from({ length: 10 }, (_, i) => (i + 1) * 7)",
  solucion:`const tabla = Array.from({ length: 10 }, (_, i) => (i + 1) * 7);
console.log(tabla.join(" "));`,
  why:"El segundo argumento de Array.from es una función de mapeo que recibe (elemento, índice)."},
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
  .map(p =&gt; p.nombre.toUpperCase());                            // ["TECLADO", "MONITOR"]</div>
     <div class="dg"><div class="dg-tit">una cadena de transformaciones</div>
<div class="dg-flujo">
<div class="dg-caja base">3 productos</div>
<div class="dg-caja">filter<small>precio &gt; 50</small></div>
<div class="dg-caja">map<small>nombre en mayúsculas</small></div>
<div class="dg-caja ok">["TECLADO", "MONITOR"]</div>
</div></div>`},
 {t:"info", eti:"reduce por dentro", h:"El acumulador",
  c:`<div class="termbox">[3, 5, 2].reduce((acc, n) =&gt; acc + n, 0);
// vuelta 1: acc = 0,  n = 3  -&gt; 3
// vuelta 2: acc = 3,  n = 5  -&gt; 8
// vuelta 3: acc = 8,  n = 2  -&gt; 10

// contar apariciones
const votos = ["sí", "no", "sí"];
votos.reduce((cuenta, v) =&gt; ({ ...cuenta, [v]: (cuenta[v] ?? 0) + 1 }), {});
// { sí: 2, no: 1 }</div>
     <p>Pasa <b>siempre</b> el valor inicial: sin él, <code>[].reduce(fn)</code> lanza <code>TypeError</code>, y el primer elemento hace de acumulador (con objetos suele ser un error).</p>`},
 {t:"par", p:"Empareja cada método con su resultado",
  pares:[["map","Array del mismo tamaño con cada elemento transformado"],["filter","Array con los elementos que cumplen la condición"],["reduce","Un único valor acumulado"],["forEach","Nada: solo ejecuta algo por cada elemento"]],
  why:"Si usas map y no usas el array que devuelve, probablemente querías forEach."},
 {t:"escribe", p:"A partir del array <code>precios</code>, obtén un array nuevo <code>conIva</code> con cada precio multiplicado por 1.21",
  sol:["const conIva = precios.map(p => p * 1.21);","const conIva = precios.map((p) => p * 1.21);","const conIva = precios.map(precio => precio * 1.21);","const conIva = precios.map((precio) => precio * 1.21);","const conIva = precios.map(x => x * 1.21);","const conIva = precios.map(p => p * 1.21)"], ph:"const conIva = ...", pista:"precios.map(p => ...)", why:"map crea un array nuevo transformando cada elemento."},
 {t:"opcion", p:"¿Qué devuelve?", c:`<div class="termbox">[1, 2, 3, 4].filter(n =&gt; n % 2 === 0).map(n =&gt; n * 10)</div>`,
  ops:["[10, 20, 30, 40]","[20, 40]","[2, 4]","60"],
  ok:1, why:"filter deja [2, 4] y map los multiplica por 10."},
 {t:"opcion", p:"¿Qué devuelve <code>[\"1\", \"2\", \"3\"].map(parseInt)</code>?",
  ops:["[1, 2, 3]","[1, NaN, NaN]","[\"1\", \"2\", \"3\"]","Error"],
  ok:1, why:"map pasa (elemento, índice): parseInt(\"2\", 1) y parseInt(\"3\", 2) usan bases inválidas. Usa .map(Number) o .map(s => parseInt(s, 10))."},
 {t:"codigo", p:"Con el array de pedidos, imprime el total facturado de los pedidos <b>pagados</b>",
  lenguaje:"js",
  plantilla:`const pedidos = [
  { id: 1, total: 40, estado: "pagado" },
  { id: 2, total: 15, estado: "pendiente" },
  { id: 3, total: 60, estado: "pagado" },
  { id: 4, total: 25, estado: "cancelado" },
];
// filter + reduce
`,
  pruebas:[{salida:"100"}],
  pista:"pedidos.filter(p => p.estado === \"pagado\").reduce((s, p) => s + p.total, 0)",
  solucion:`const pedidos = [
  { id: 1, total: 40, estado: "pagado" },
  { id: 2, total: 15, estado: "pendiente" },
  { id: 3, total: 60, estado: "pagado" },
  { id: 4, total: 25, estado: "cancelado" },
];
console.log(pedidos.filter(p => p.estado === "pagado").reduce((s, p) => s + p.total, 0));`,
  why:"filter + reduce es el patrón de cualquier informe: quedarte con lo que cuenta y acumularlo."},
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
const pos = usuarios.findIndex(u =&gt; u.id === 7);                 // índice o -1
const ultimo = pedidos.findLast(p =&gt; p.estado === "pagado");      // empezando por el final
const hayAdmins = usuarios.some(u =&gt; u.rol === "admin");          // al menos uno
const todosActivos = usuarios.every(u =&gt; u.activo);               // todos
[].every(x =&gt; false);                                             // true (verdad vacía)</div>`},
 {t:"info", eti:"La trampa de sort", h:"Ordenar",
  c:`<div class="termbox">[10, 9, 100].sort()                     // [10, 100, 9]  compara como TEXTO
[10, 9, 100].sort((a, b) =&gt; a - b)      // [9, 10, 100]  numérico ascendente
productos.sort((a, b) =&gt; b.precio - a.precio)          // por precio descendente
nombres.sort((a, b) =&gt; a.localeCompare(b, "es"))       // alfabético con tildes bien

// varios criterios: por categoría y, dentro, por precio
productos.sort((a, b) =&gt; a.categoria.localeCompare(b.categoria) || a.precio - b.precio);

const ordenados = productos.toSorted((a, b) =&gt; a.precio - b.precio);   // copia, no muta</div>
     <p>El comparador devuelve un número <b>negativo</b> si a va antes, <b>positivo</b> si va después y <b>0</b> si da igual. Desde ES2019, <code>sort</code> es <b>estable</b>: los empates conservan su orden original.</p>`},
 {t:"par", p:"Empareja cada método con su resultado",
  pares:[["find","El primer elemento que cumple, o undefined"],["findIndex","La posición del primero que cumple, o -1"],["some","true si al menos uno cumple"],["every","true si todos cumplen"],["includes","true si contiene exactamente ese valor"]],
  why:"find y some paran en cuanto encuentran: más eficientes que filter para estas preguntas."},
 {t:"opcion", p:"¿Qué devuelve <code>[5, 1, 10, 2].sort()</code>?",
  ops:["[1, 2, 5, 10]","[1, 10, 2, 5]","[10, 5, 2, 1]","Error"],
  ok:1, why:"Sin comparador, sort convierte a texto: \"10\" va antes que \"2\". Siempre pasa (a, b) => a - b para números."},
 {t:"codigo", p:"Ordena los alumnos por nota descendente y, si empatan, por nombre ascendente. Imprime <code>nombre nota</code> por línea",
  lenguaje:"js",
  plantilla:`const alumnos = [
  { nombre: "Luis", nota: 7 },
  { nombre: "Ana", nota: 9 },
  { nombre: "Eva", nota: 7 },
  { nombre: "Blas", nota: 9 },
];
// ordena e imprime
`,
  pruebas:[{salida:"Ana 9\nBlas 9\nEva 7\nLuis 7"}],
  pista:"(a, b) => b.nota - a.nota || a.nombre.localeCompare(b.nombre)",
  solucion:`const alumnos = [
  { nombre: "Luis", nota: 7 },
  { nombre: "Ana", nota: 9 },
  { nombre: "Eva", nota: 7 },
  { nombre: "Blas", nota: 9 },
];
const orden = alumnos.toSorted((a, b) => b.nota - a.nota || a.nombre.localeCompare(b.nombre));
for (const a of orden) console.log(a.nombre, a.nota);`,
  why:"Si la resta da 0 (empate), || pasa al segundo criterio. Es el truco estándar para ordenar por varias claves."},
 {t:"codigo", p:"Imprime <code>true</code> o <code>false</code>: ¿todos los productos tienen precio positivo? Y en otra línea: ¿alguno está agotado?",
  lenguaje:"js",
  plantilla:`const productos = [
  { nombre: "A", precio: 10, stock: 2 },
  { nombre: "B", precio: 5, stock: 0 },
  { nombre: "C", precio: 8, stock: 1 },
];
// every y some
`,
  pruebas:[{salida:"true\ntrue"}],
  pista:"productos.every(p => p.precio > 0) y productos.some(p => p.stock === 0)",
  solucion:`const productos = [
  { nombre: "A", precio: 10, stock: 2 },
  { nombre: "B", precio: 5, stock: 0 },
  { nombre: "C", precio: 8, stock: 1 },
];
console.log(productos.every(p => p.precio > 0));
console.log(productos.some(p => p.stock === 0));`,
  why:"every y some expresan la intención mejor que un bucle con una bandera."},
 {t:"vf", p:"<code>sort</code> devuelve un array nuevo y deja el original sin cambios.",
  ok:false, why:"Ordena el original (y lo devuelve). Para no mutar: toSorted o [...arr].sort()."}
]},

{
id:"js4n1",
titulo:"Métodos modernos: aplanar, agrupar y copiar",
claves:["flat y flatMap aplanan; Object.groupBy y Map.groupBy agrupan (ES2024)","toSorted, toReversed, toSpliced y with: versiones que no mutan (ES2023)","findLast y findLastIndex buscan desde el final"],
pasos:[
 {t:"info", eti:"Lo nuevo", h:"Métodos que llegaron en los últimos años",
  c:`<div class="termbox">[[1, 2], [3, [4]]].flat();          // [1, 2, 3, [4]]  (un nivel)
[[1, 2], [3, [4]]].flat(Infinity);  // [1, 2, 3, 4]
pedidos.flatMap(p =&gt; p.lineas);      // todas las líneas de todos los pedidos

const porEstado = Object.groupBy(pedidos, p =&gt; p.estado);
// { pagado: [...], pendiente: [...] }
const porCliente = Map.groupBy(pedidos, p =&gt; p.cliente);   // claves de cualquier tipo

const lista = [3, 1, 2];
lista.toSorted();          // [1, 2, 3]   lista sigue igual
lista.toReversed();        // [2, 1, 3]
lista.toSpliced(0, 1);     // [1, 2]
lista.with(0, 99);         // [99, 1, 2]</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">muta frente a copia</div>
<table class="dg-tabla"><thead><tr><th>muta el original</th><th>devuelve copia</th></tr></thead><tbody>
<tr><td>sort()</td><td>toSorted()</td></tr>
<tr><td>reverse()</td><td>toReversed()</td></tr>
<tr><td>splice()</td><td>toSpliced()</td></tr>
<tr><td>lista[i] = x</td><td>lista.with(i, x)</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja cada método con lo que hace",
  pares:[["flat(Infinity)","Aplana todos los niveles"],["flatMap(fn)","map y después aplana un nivel"],["Object.groupBy","Agrupa en un objeto según una clave"],["with(i, x)","Copia con la posición i cambiada"],["findLast","El último elemento que cumple"]],
  why:"Estos métodos sustituyen muchos reduce difíciles de leer."},
 {t:"opcion", p:"¿Qué devuelve <code>[\"a b\", \"c\"].flatMap(s =&gt; s.split(\" \"))</code>?",
  ops:["[[\"a\", \"b\"], [\"c\"]]","[\"a\", \"b\", \"c\"]","[\"a b\", \"c\"]","\"a b c\""],
  ok:1, why:"map daría un array de arrays; flatMap lo aplana un nivel."},
 {t:"codigo", p:"Agrupa las tareas por responsable con <code>Object.groupBy</code> e imprime <code>responsable: n</code> por línea, en orden de aparición",
  lenguaje:"js",
  plantilla:`const tareas = [
  { titulo: "Diseño", quien: "ana" },
  { titulo: "API", quien: "luis" },
  { titulo: "Tests", quien: "ana" },
  { titulo: "Deploy", quien: "eva" },
];
// agrupa e imprime cuántas tiene cada uno
`,
  pruebas:[{salida:"ana: 2\nluis: 1\neva: 1"}],
  pista:"const grupos = Object.groupBy(tareas, t => t.quien); luego recorre Object.entries(grupos).",
  solucion:`const tareas = [
  { titulo: "Diseño", quien: "ana" },
  { titulo: "API", quien: "luis" },
  { titulo: "Tests", quien: "ana" },
  { titulo: "Deploy", quien: "eva" },
];
const grupos = Object.groupBy(tareas, t => t.quien);
for (const [quien, lista] of Object.entries(grupos)) console.log(\`\${quien}: \${lista.length}\`);`,
  why:"Object.groupBy devuelve un objeto sin prototipo cuyas claves siguen el orden de inserción (salvo claves numéricas)."},
 {t:"codigo", p:"Obtén todas las etiquetas únicas de los artículos, ordenadas alfabéticamente, sin modificar nada",
  lenguaje:"js",
  plantilla:`const articulos = [
  { titulo: "A", etiquetas: ["js", "web"] },
  { titulo: "B", etiquetas: ["css", "web"] },
  { titulo: "C", etiquetas: ["js", "node"] },
];
// flatMap + Set + toSorted
`,
  pruebas:[{salida:"css,js,node,web"}],
  pista:"[...new Set(articulos.flatMap(a => a.etiquetas))].toSorted().join(\",\")",
  solucion:`const articulos = [
  { titulo: "A", etiquetas: ["js", "web"] },
  { titulo: "B", etiquetas: ["css", "web"] },
  { titulo: "C", etiquetas: ["js", "node"] },
];
const unicas = [...new Set(articulos.flatMap(a => a.etiquetas))].toSorted();
console.log(unicas.join(","));`,
  why:"flatMap junta, Set quita duplicados y toSorted ordena sin tocar el array intermedio."},
 {t:"vf", p:"<code>lista.with(1, \"x\")</code> cambia la posición 1 de <code>lista</code>.",
  ok:false, why:"Devuelve una copia con el cambio; lista queda intacta. Ideal para estado inmutable en React."}
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
const [a = 0, b = 0] = [5];                                // valores por defecto: a = 5, b = 0
let x = 1, y = 2;
[x, y] = [y, x];                                           // intercambiar

for (const [i, valor] of ["a", "b"].entries()) console.log(i, valor);</div>`},
 {t:"info", eti:"Sin mutar", h:"Actualizaciones inmutables",
  c:`<div class="termbox">const tareas = [{ id: 1, hecha: false }, { id: 2, hecha: false }];

const conNueva = [...tareas, { id: 3, hecha: false }];                  // añadir
const sinLa1   = tareas.filter(t =&gt; t.id !== 1);                         // quitar
const marcada  = tareas.map(t =&gt; t.id === 2 ? { ...t, hecha: true } : t); // cambiar una

const copiaProfunda = structuredClone(tareas);   // copia también los objetos de dentro</div>
     <div class="dg"><div class="dg-tit">copia superficial con spread</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">tareas</div><div class="dg-caja">array A</div></div>
<div class="dg-col"><div class="dg-col-tit">[...tareas]</div><div class="dg-caja acento">array B (nuevo)</div></div>
</div>
<div class="dg-fila" style="margin-top:10px"><div class="dg-caja aviso doble">{ id: 1 }<small>compartido por A y B</small></div><div class="dg-caja aviso doble">{ id: 2 }<small>compartido por A y B</small></div></div></div>
     <p>React y muchas librerías detectan cambios comparando referencias: si mutas el array, no se enteran. Por eso este estilo es imprescindible en frontend.</p>`},
 {t:"par", p:"Empareja cada operación inmutable con su código",
  pares:[["Añadir al final","[...lista, nuevo]"],["Quitar por id","lista.filter(x => x.id !== id)"],["Cambiar uno","lista.map(x => x.id === id ? { ...x, ...cambios } : x)"],["Copia profunda","structuredClone(lista)"]],
  why:"Con estos cuatro patrones gestionarás el estado de casi cualquier interfaz."},
 {t:"opcion", p:"<code>const copia = [...tareas]; copia[0].hecha = true;</code> ¿Cambia también <code>tareas[0]</code>?",
  ops:["No","Sí: spread hace una copia superficial; los objetos de dentro son los mismos","Error","Depende del navegador"],
  ok:1, why:"Copia superficial: nuevo array, mismos objetos. Para cambiar uno sin mutar, crea un objeto nuevo con { ...t }."},
 {t:"hueco", p:"Completa para quedarte con el primer elemento y el resto por separado",
  tpl:"const [___, ___resto] = cola;", banco:["primero","...","..","*"], sol:["primero","..."],
  why:"El rest (...) siempre va al final y recoge lo que queda en un array nuevo."},
 {t:"codigo", p:"Implementa <code>alternar(tareas, id)</code> sin mutar: devuelve un array nuevo con <code>hecha</code> invertida en la tarea con ese id",
  lenguaje:"js",
  plantilla:`function alternar(tareas, id) {
  // sin mutar tareas ni sus objetos
}
const tareas = [{ id: 1, hecha: false }, { id: 2, hecha: true }];
const nuevas = alternar(tareas, 2);
console.log(JSON.stringify(nuevas));
console.log(JSON.stringify(tareas));
console.log(nuevas[0] === tareas[0], nuevas[1] === tareas[1]);
`,
  pruebas:[{salida:"[{\"id\":1,\"hecha\":false},{\"id\":2,\"hecha\":false}]\n[{\"id\":1,\"hecha\":false},{\"id\":2,\"hecha\":true}]\ntrue false"}],
  pista:"tareas.map(t => t.id === id ? { ...t, hecha: !t.hecha } : t)",
  solucion:`function alternar(tareas, id) {
  return tareas.map(t => t.id === id ? { ...t, hecha: !t.hecha } : t);
}
const tareas = [{ id: 1, hecha: false }, { id: 2, hecha: true }];
const nuevas = alternar(tareas, 2);
console.log(JSON.stringify(nuevas));
console.log(JSON.stringify(tareas));
console.log(nuevas[0] === tareas[0], nuevas[1] === tareas[1]);`,
  why:"La tarea no cambiada conserva su referencia (true) y la cambiada es un objeto nuevo (false): así React sabe exactamente qué volver a pintar."},
 {t:"vf", p:"<code>structuredClone</code> puede copiar objetos con fechas, Map y Set, pero no funciones.",
  ok:true, why:"Usa el algoritmo de clonado estructurado: fechas, Map, Set, arrays tipados y referencias circulares sí; funciones y nodos del DOM no (lanza DataCloneError)."}
]}

]});
