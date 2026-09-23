window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Objetos, JSON, Map y Set",
resumen: "Objetos literales, propiedades y congelación, desestructuración, spread, recorrer objetos, JSON, Map, Set y sus operaciones, WeakMap y Symbol",
nivel: "Intermedio",
color: "#d0b834",
lecciones: [

{
id:"js5l1",
titulo:"Objetos literales",
claves:["Un objeto agrupa propiedades clave-valor","Acceso con punto (obj.nombre) o corchetes (obj[clave]) para claves dinámicas","Object.freeze impide cambios (solo en el primer nivel); get y set definen propiedades calculadas"],
pasos:[
 {t:"info", eti:"Agrupar datos", h:"Crear y usar objetos",
  c:`<div class="termbox">const nombre = "Ana";
const campo = "ciudad";

const usuario = {
  nombre,                        // abreviado: nombre: nombre
  edad: 31,
  [campo]: "Madrid",             // clave calculada: ciudad: "Madrid"
  saludar() {                    // método
    return \`Hola, soy \${this.nombre}\`;
  },
  get esMayor() { return this.edad &gt;= 18; },   // getter: se lee sin paréntesis
};

usuario.edad;           // 31
usuario["ciudad"];      // "Madrid"
usuario.esMayor;        // true
usuario.email = "ana@x.com";   // añadir
delete usuario.edad;           // quitar
"email" in usuario;            // true (también mira la cadena de prototipos)
Object.hasOwn(usuario, "email");  // true (solo propias)</div>`},
 {t:"info", eti:"Proteger", h:"freeze, seal y descriptores",
  c:`<div class="termbox">const CONFIG = Object.freeze({ api: "/v1", reintentos: 3, limites: { max: 10 } });
CONFIG.api = "/v2";          // se ignora (en modo estricto, TypeError)
CONFIG.limites.max = 99;     // ¡funciona! freeze es superficial

Object.isFrozen(CONFIG);     // true
Object.seal(obj);            // no se añaden ni borran propiedades, pero sí se cambian

Object.defineProperty(usuario, "id", { value: 7, writable: false, enumerable: false });
Object.getOwnPropertyDescriptor(usuario, "id");
// { value: 7, writable: false, enumerable: false, configurable: false }</div>
     <p>Cada propiedad tiene un <b>descriptor</b>: si se puede escribir, si aparece al recorrer (enumerable) y si se puede reconfigurar. Los módulos ES y las clases se ejecutan en <b>modo estricto</b>, donde escribir en algo congelado lanza error en vez de fallar en silencio.</p>`},
 {t:"par", p:"Empareja cada sintaxis con su efecto",
  pares:[["obj.clave","Leer una propiedad de nombre fijo"],["obj[variable]","Leer una propiedad cuyo nombre está en una variable"],["{ nombre }","Crear la propiedad nombre con el valor de la variable nombre"],["{ [k]: v }","Clave calculada a partir de una expresión"],["delete obj.clave","Eliminar una propiedad"],["Object.freeze(obj)","Impedir cambios en el primer nivel"]],
  why:"Los corchetes son imprescindibles cuando la clave viene de un dato (un campo de formulario, por ejemplo)."},
 {t:"opcion", p:"¿Qué devuelve <code>usuario.telefono</code> si esa propiedad no existe?",
  ops:["null","undefined","Error","\"\""],
  ok:1, why:"Leer una propiedad inexistente da undefined. Leer una propiedad DE undefined sí lanza error (por eso existe ?.)."},
 {t:"codigo", p:"Crea un objeto <code>rect</code> con <code>ancho</code> 4, <code>alto</code> 3, un getter <code>area</code> y un método <code>escalar(f)</code> que multiplique ambos lados",
  lenguaje:"js",
  plantilla:`const rect = {
  ancho: 4,
  alto: 3,
  // getter area y método escalar
};
console.log(rect.area);
rect.escalar(2);
console.log(rect.ancho, rect.alto, rect.area);
`,
  pruebas:[{salida:"12\n8 6 48"}],
  pista:"get area() { return this.ancho * this.alto; }, escalar(f) { this.ancho *= f; this.alto *= f; }",
  solucion:`const rect = {
  ancho: 4,
  alto: 3,
  get area() { return this.ancho * this.alto; },
  escalar(f) { this.ancho *= f; this.alto *= f; },
};
console.log(rect.area);
rect.escalar(2);
console.log(rect.ancho, rect.alto, rect.area);`,
  why:"El getter se recalcula en cada lectura: nunca se desincroniza con ancho y alto."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">"use strict";
const c = Object.freeze({ tema: "claro", colores: ["azul"] });
c.colores.push("rojo");
console.log(c.colores.length);</div>`,
  ops:["1","2","TypeError","undefined"],
  ok:1, why:"freeze no es profundo: el array de dentro sigue siendo modificable. Para congelar todo, hay que recorrer y congelar cada nivel."},
 {t:"vf", p:"Dos objetos con las mismas propiedades y valores son iguales con <code>===</code>.",
  ok:false, why:"=== compara referencias: son objetos distintos. Para comparar contenido hay que hacerlo propiedad a propiedad."}
]},

{
id:"js5l2",
titulo:"Desestructurar, spread y recorrer",
claves:["const { nombre, edad = 0 } = usuario; renombrar con { nombre: n }","{ ...a, ...b } copia y combina (la última gana)","Object.keys, values y entries para recorrer; fromEntries para volver"],
pasos:[
 {t:"info", eti:"Extraer y combinar", h:"Desestructuración y spread",
  c:`<div class="termbox">const { nombre, edad = 18, direccion: { ciudad } } = usuario;   // anidado
const { nombre: n } = usuario;                                   // renombrar
const { password, ...publico } = usuario;                        // quitar un campo

const config = { ...porDefecto, ...delUsuario };                 // combinar: gana el último
const actualizado = { ...usuario, edad: 32 };                    // copia con cambio

function mostrar({ nombre, rol = "lector" }) { ... }              // en parámetros</div>
     <div class="nota ojo"><b class="tit">Anidado y ausente</b>Si <code>usuario.direccion</code> no existe, <code>const { direccion: { ciudad } } = usuario</code> lanza TypeError. Pon un valor por defecto: <code>{ direccion: { ciudad } = {} }</code>.</div>`},
 {t:"info", eti:"Recorrer", h:"keys, values y entries",
  c:`<div class="termbox">const stock = { teclado: 5, raton: 0, monitor: 3 };
Object.keys(stock);      // ["teclado", "raton", "monitor"]
Object.values(stock);    // [5, 0, 3]
Object.entries(stock);   // [["teclado", 5], ["raton", 0], ["monitor", 3]]

for (const [producto, unidades] of Object.entries(stock)) {
  console.log(producto, unidades);
}
const agotados = Object.entries(stock).filter(([, u]) =&gt; u === 0).map(([p]) =&gt; p);
Object.fromEntries([["a", 1], ["b", 2]]);   // { a: 1, b: 2 }

// transformar valores de un objeto: entries -&gt; map -&gt; fromEntries
const conIva = Object.fromEntries(Object.entries(precios).map(([k, v]) =&gt; [k, v * 1.21]));</div>
     <p>Orden de las claves: primero las que parecen enteros (en orden numérico) y después las de texto, en orden de inserción.</p>`},
 {t:"opcion", p:"¿Qué vale <code>{ ...{ a: 1, b: 2 }, ...{ b: 3 } }</code>?",
  ops:["{ a: 1, b: 2 }","{ a: 1, b: 3 }","{ b: 3 }","Error"],
  ok:1, why:"Al combinar, la propiedad que aparece después sobrescribe a la anterior."},
 {t:"escribe", p:"Extrae las propiedades <code>id</code> y <code>titulo</code> del objeto <code>tarea</code> en dos constantes",
  sol:["const { id, titulo } = tarea;","const { titulo, id } = tarea;","const {id, titulo} = tarea;","const { id, titulo } = tarea","const {titulo, id} = tarea;"], ph:"const { ... } = tarea;", pista:"const { id, titulo } = tarea;", why:"La desestructuración crea constantes con los nombres de las propiedades."},
 {t:"codigo", p:"Aplica un descuento del 10 % a cada precio del objeto y quita los que queden por debajo de 5",
  lenguaje:"js",
  c:`<p>Usa <code>Object.entries</code>, <code>filter</code>, <code>map</code> y <code>Object.fromEntries</code>. Se imprime con <code>JSON.stringify</code>.</p>`,
  plantilla:`const precios = { cafe: 2, tostada: 4, menu: 12, zumo: 6 };
const rebajados = {}; // calcula
console.log(JSON.stringify(rebajados));
`,
  pruebas:[{salida:"{\"menu\":10.8,\"zumo\":5.4}"}],
  pista:"Object.fromEntries(Object.entries(precios).map(([k, v]) => [k, v * 0.9]).filter(([, v]) => v >= 5))",
  solucion:`const precios = { cafe: 2, tostada: 4, menu: 12, zumo: 6 };
const rebajados = Object.fromEntries(
  Object.entries(precios)
    .map(([k, v]) => [k, Math.round(v * 0.9 * 100) / 100])
    .filter(([, v]) => v >= 5)
);
console.log(JSON.stringify(rebajados));`,
  why:"entries → operaciones de array → fromEntries es la forma idiomática de «mapear» un objeto. Redondear a céntimos evita arrastrar decimales binarios."},
 {t:"codigo", p:"Escribe <code>combinarOpciones(usuario)</code>: parte de los valores por defecto y sobrescribe con los del usuario, pero ignorando los que sean <code>undefined</code>",
  lenguaje:"js",
  plantilla:`const PORDEFECTO = { tema: "claro", idioma: "es", avisos: true };
function combinarOpciones(usuario) {
  // completa
}
console.log(JSON.stringify(combinarOpciones({ tema: "oscuro", idioma: undefined })));
console.log(JSON.stringify(combinarOpciones({ avisos: false })));
`,
  pruebas:[{salida:"{\"tema\":\"oscuro\",\"idioma\":\"es\",\"avisos\":true}\n{\"tema\":\"claro\",\"idioma\":\"es\",\"avisos\":false}"}],
  pista:"Filtra las entradas del usuario con v !== undefined y combina: { ...PORDEFECTO, ...Object.fromEntries(filtradas) }",
  solucion:`const PORDEFECTO = { tema: "claro", idioma: "es", avisos: true };
function combinarOpciones(usuario) {
  const definidas = Object.entries(usuario).filter(([, v]) => v !== undefined);
  return { ...PORDEFECTO, ...Object.fromEntries(definidas) };
}
console.log(JSON.stringify(combinarOpciones({ tema: "oscuro", idioma: undefined })));
console.log(JSON.stringify(combinarOpciones({ avisos: false })));`,
  why:"Un spread directo copiaría idioma: undefined y machacaría el valor por defecto. Fíjate en que avisos: false sí se respeta."},
 {t:"vf", p:"<code>const { password, ...publico } = usuario</code> modifica el objeto usuario.",
  ok:false, why:"Crea publico como copia sin password; usuario no cambia. Útil para no enviar campos sensibles."}
]},

{
id:"js5l3",
titulo:"JSON",
claves:["JSON es un formato de texto para intercambiar datos, derivado de la sintaxis de objetos","JSON.stringify convierte a texto; JSON.parse lo lee (y lanza SyntaxError si no es válido)","JSON no admite funciones, undefined, fechas como tales ni comentarios; replacer, reviver y toJSON personalizan"],
pasos:[
 {t:"info", eti:"Intercambiar datos", h:"Qué es JSON",
  c:`<div class="termbox">{
  "id": 42,
  "titulo": "Preparar entrevista",
  "hecha": false,
  "etiquetas": ["docker", "spring"],
  "responsable": { "nombre": "Pablo" },
  "fechaLimite": null
}</div>
     <p>Es el formato de casi todas las APIs REST. Reglas: claves siempre entre <b>comillas dobles</b>, textos con comillas dobles, sin comas finales ni comentarios.</p>
     <div class="termbox">const texto = JSON.stringify(tarea);             // objeto -&gt; texto
const bonito = JSON.stringify(tarea, null, 2);    // con sangría
const objeto = JSON.parse(texto);                 // texto -&gt; objeto
JSON.parse("{nombre: 'Ana'}");                    // SyntaxError: no es JSON válido</div>`},
 {t:"info", eti:"Personalizar", h:"replacer, reviver y toJSON",
  c:`<div class="termbox">// replacer: elegir o transformar lo que se serializa
JSON.stringify(usuario, ["id", "nombre"]);                 // solo esas claves
JSON.stringify(usuario, (k, v) =&gt; k === "password" ? undefined : v);

// reviver: reconstruir tipos al leer
const pedido = JSON.parse(texto, (k, v) =&gt;
  k === "fecha" ? new Date(v) : v);

// toJSON: un objeto decide cómo se serializa (Date ya lo trae)
class Dinero { constructor(c) { this.centimos = c; } toJSON() { return (this.centimos / 100).toFixed(2); } }
JSON.stringify({ total: new Dinero(1999) });               // {"total":"19.99"}

// BigInt no se serializa: TypeError. Referencias circulares: TypeError.</div>`},
 {t:"par", p:"Empareja cada valor con cómo queda en JSON.stringify",
  pares:[["{ a: undefined }","{} (la propiedad desaparece)"],["new Date(2026, 8, 22)","Un texto en formato ISO"],["{ f() {} }","{} (las funciones se omiten)"],["[1, \"dos\", true]","[1,\"dos\",true]"],["[undefined]","[null]"],["NaN","null"]],
  why:"Las fechas vuelven como texto: al hacer JSON.parse hay que convertirlas con new Date(...) o con un reviver."},
 {t:"opcion", p:"¿Cuál de estos textos es JSON válido?",
  ops:["{nombre: \"Ana\"}","{'nombre': 'Ana'}","{\"nombre\": \"Ana\"}","{\"nombre\": \"Ana\",}"],
  ok:2, why:"Claves y textos con comillas dobles y sin coma final."},
 {t:"codigo", p:"Lee JSON de la entrada. Si es válido, imprime cuántas claves tiene el objeto; si no, imprime <code>JSON no válido</code>",
  lenguaje:"js",
  plantilla:`const texto = require("fs").readFileSync(0, "utf8");
// JSON.parse puede lanzar: captúralo
`,
  pruebas:[{entrada:"{\"a\": 1, \"b\": 2}\n", salida:"2"},{entrada:"{a: 1}\n", salida:"JSON no válido", oculta:true},{entrada:"{\"x\": [1, 2, 3]}\n", salida:"1", oculta:true}],
  pista:"try { const obj = JSON.parse(texto); console.log(Object.keys(obj).length); } catch { console.log(\"JSON no válido\"); }",
  solucion:`const texto = require("fs").readFileSync(0, "utf8");
try {
  const obj = JSON.parse(texto);
  console.log(Object.keys(obj).length);
} catch {
  console.log("JSON no válido");
}`,
  why:"Todo JSON que venga de fuera (una API, localStorage, un fichero) puede estar roto: JSON.parse siempre dentro de try/catch."},
 {t:"codigo", p:"Serializa el usuario sin el campo <code>password</code> y con sangría de 2 espacios usando un replacer",
  lenguaje:"js",
  plantilla:`const usuario = { id: 7, nombre: "Ana", password: "secreto" };
// JSON.stringify con replacer y sangría
`,
  pruebas:[{salida:"{\n  \"id\": 7,\n  \"nombre\": \"Ana\"\n}"}],
  pista:"JSON.stringify(usuario, (k, v) => k === \"password\" ? undefined : v, 2)",
  solucion:`const usuario = { id: 7, nombre: "Ana", password: "secreto" };
console.log(JSON.stringify(usuario, (k, v) => k === "password" ? undefined : v, 2));`,
  why:"Devolver undefined desde el replacer omite la propiedad. Aun así, lo más seguro es no tener el password en el objeto que se serializa."},
 {t:"vf", p:"<code>JSON.parse(JSON.stringify(obj))</code> es una forma perfecta de copiar cualquier objeto.",
  ok:false, why:"Pierde fechas, undefined, funciones, Map, Set... Para copias profundas, structuredClone."}
]},

{
id:"js5l4",
titulo:"Map y Set",
claves:["Map: pares clave-valor con claves de cualquier tipo y orden de inserción","Set: valores únicos; [...new Set(array)] elimina duplicados","ES2025 añade union, intersection, difference y compañía a Set"],
pasos:[
 {t:"info", eti:"Estructuras", h:"Map y Set",
  c:`<div class="termbox">const visitas = new Map();
visitas.set("/inicio", 10);
visitas.set("/precios", 3);
visitas.get("/inicio");          // 10
visitas.has("/blog");            // false
visitas.size;                    // 2
visitas.delete("/precios");
for (const [ruta, n] of visitas) console.log(ruta, n);
new Map(Object.entries(obj));    // de objeto a Map
Object.fromEntries(visitas);     // de Map a objeto

const etiquetas = new Set(["js", "css", "js"]);
etiquetas.size;                  // 2
etiquetas.add("html");
etiquetas.has("css");            // true

const unicos = [...new Set([3, 1, 3, 2, 1])];   // [3, 1, 2]</div>`},
 {t:"info", eti:"ES2025", h:"Operaciones de conjuntos",
  c:`<div class="termbox">const frontend = new Set(["js", "css", "html"]);
const backend  = new Set(["js", "sql", "java"]);

frontend.union(backend);               // {js, css, html, sql, java}
frontend.intersection(backend);        // {js}
frontend.difference(backend);          // {css, html}
frontend.symmetricDifference(backend); // {css, html, sql, java}
new Set(["js"]).isSubsetOf(frontend);  // true
frontend.isDisjointFrom(new Set(["go"]));  // true</div>
     <p>Devuelven un <b>Set nuevo</b> sin tocar los originales. Disponibles en todos los navegadores actuales y en Node 22.</p>`},
 {t:"par", p:"Empareja cada estructura con su mejor uso",
  pares:[["Objeto literal","Datos con propiedades conocidas (un usuario)"],["Map","Diccionario dinámico, claves de cualquier tipo, muchas altas y bajas"],["Set","Colección sin duplicados, comprobar pertenencia rápido"],["Array","Lista ordenada que puede repetir valores"]],
  why:"Set.has y Map.get son de tiempo constante; array.includes recorre la lista entera."},
 {t:"escribe", p:"Obtén en <code>unicos</code> un array sin duplicados a partir de <code>emails</code>",
  sol:["const unicos = [...new Set(emails)];","const unicos = Array.from(new Set(emails));","const unicos = [...new Set(emails)]","const unicos = Array.from(new Set(emails))"], ph:"const unicos = ...", pista:"Spread de un new Set(emails) dentro de corchetes.", why:"El Set elimina duplicados y el spread lo vuelve a convertir en array."},
 {t:"codigo", p:"Cuenta la frecuencia de cada palabra de la entrada con un <code>Map</code> e imprime <code>palabra n</code> en orden de primera aparición",
  lenguaje:"js",
  plantilla:`const palabras = require("fs").readFileSync(0, "utf8").trim().toLowerCase().split(/\\s+/);
const cuenta = new Map();
// cuenta e imprime
`,
  pruebas:[{entrada:"el gato y el perro y el pez\n", salida:"el 3\ngato 1\ny 2\nperro 1\npez 1"},{entrada:"Hola hola HOLA\n", salida:"hola 3", oculta:true}],
  pista:"cuenta.set(p, (cuenta.get(p) ?? 0) + 1); después for (const [p, n] of cuenta) console.log(p, n);",
  solucion:`const palabras = require("fs").readFileSync(0, "utf8").trim().toLowerCase().split(/\\s+/);
const cuenta = new Map();
for (const p of palabras) cuenta.set(p, (cuenta.get(p) ?? 0) + 1);
for (const [p, n] of cuenta) console.log(p, n);`,
  why:"Map conserva el orden de inserción y no tiene claves heredadas: con un objeto, una palabra como «constructor» daría sorpresas."},
 {t:"codigo", p:"Con los permisos de dos roles, imprime los comunes y los que solo tiene <code>editor</code>, ordenados y separados por comas",
  lenguaje:"js",
  plantilla:`const editor = new Set(["leer", "escribir", "publicar", "comentar"]);
const lector = new Set(["leer", "comentar", "exportar"]);
// intersection y difference
`,
  pruebas:[{salida:"comentar,leer\nescribir,publicar"}],
  pista:"[...editor.intersection(lector)].sort().join(\",\") y [...editor.difference(lector)].join(\",\") (este último en orden de inserción).",
  solucion:`const editor = new Set(["leer", "escribir", "publicar", "comentar"]);
const lector = new Set(["leer", "comentar", "exportar"]);
console.log([...editor.intersection(lector)].sort().join(","));
console.log([...editor.difference(lector)].join(","));`,
  why:"Las operaciones de Set expresan la intención («lo que tienen ambos», «lo que falta») sin bucles anidados."},
 {t:"vf", p:"Un Map puede usar un objeto como clave.",
  ok:true, why:"A diferencia de los objetos literales, cuyas claves se convierten a texto."}
]},

{
id:"js5n1",
titulo:"WeakMap, WeakSet, WeakRef y Symbol",
claves:["WeakMap y WeakSet guardan objetos sin impedir que el recolector los libere","Symbol crea claves únicas que no chocan con otras propiedades","Los símbolos bien conocidos (Symbol.iterator, Symbol.toPrimitive) personalizan el lenguaje"],
pasos:[
 {t:"info", eti:"Referencias débiles", h:"WeakMap y WeakSet",
  c:`<div class="termbox">const metadatos = new WeakMap();

function registrar(nodo) {
  metadatos.set(nodo, { vistas: 0, creado: Date.now() });
}
// si el nodo se elimina y nadie más lo referencia, su entrada desaparece sola

const procesados = new WeakSet();
function procesarUnaVez(pedido) {
  if (procesados.has(pedido)) return;
  procesados.add(pedido);
  // ...
}</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">Map frente a WeakMap</div>
<table class="dg-tabla"><thead><tr><th></th><th>Map</th><th>WeakMap</th></tr></thead><tbody>
<tr><td>claves</td><td>cualquier valor</td><td>solo objetos (y símbolos no registrados)</td></tr>
<tr><td>retiene la clave</td><td>sí: puede provocar fugas</td><td>no</td></tr>
<tr><td>se puede recorrer</td><td>sí, y tiene size</td><td>no: ni size ni for...of</td></tr>
<tr><td>uso típico</td><td>diccionarios</td><td>datos asociados a objetos ajenos, cachés</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Claves únicas", h:"Symbol",
  c:`<div class="termbox">const ID = Symbol("id");
const usuario = { nombre: "Ana", [ID]: 123 };
usuario[ID];                  // 123
Object.keys(usuario);         // ["nombre"]: los símbolos no salen
JSON.stringify(usuario);      // {"nombre":"Ana"}
Symbol("id") === Symbol("id");       // false: cada uno es único
Symbol.for("app.id") === Symbol.for("app.id");   // true: registro global

// símbolos bien conocidos
const temperatura = {
  grados: 21,
  [Symbol.toPrimitive](tipo) { return tipo === "number" ? this.grados : \`\${this.grados} °C\`; },
};
+temperatura;        // 21
\`\${temperatura}\`;   // "21 °C"</div>
     <p><b>WeakRef</b> y <b>FinalizationRegistry</b> existen para casos muy concretos (cachés grandes). El momento en que actúa el recolector no está garantizado: no construyas lógica que dependa de él.</p>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["WeakMap","Asociar datos a objetos sin impedir que se liberen"],["WeakSet","Marcar objetos ya vistos o procesados"],["Symbol(\"x\")","Clave única que no choca con otras propiedades"],["Symbol.iterator","Hacer que un objeto funcione con for...of"],["Symbol.for(\"x\")","Símbolo compartido a través de un registro global"]],
  why:"Las librerías usan símbolos para añadir datos a objetos ajenos sin riesgo de pisar sus propiedades."},
 {t:"opcion", p:"Guardas en un <code>Map</code> global datos de cada elemento del DOM que pintas. Al cambiar de pantalla, la memoria no baja. ¿Qué harías?",
  ops:["Llamar al recolector a mano","Usar un WeakMap: cuando el elemento deja de estar referenciado, su entrada se libera sola","Usar un array","Guardarlo en localStorage"],
  ok:1, why:"El Map mantiene vivos los elementos como claves aunque ya no estén en la página: fuga clásica."},
 {t:"opcion", p:"¿Por qué no puedes hacer <code>for (const [k, v] of miWeakMap)</code>?",
  ops:["Por un fallo del lenguaje","Porque su contenido depende de cuándo actúe el recolector: recorrerlo daría resultados no deterministas","Porque está deprecado","Porque es asíncrono"],
  ok:1, why:"Por la misma razón no tiene size."},
 {t:"codigo", p:"Usa un <code>Symbol</code> para dar a un objeto una clave oculta <code>version</code> que no aparezca en <code>Object.keys</code> ni en JSON",
  lenguaje:"js",
  plantilla:`// crea el símbolo VERSION y úsalo como clave
const doc = { titulo: "Informe" };
// asigna la versión 3 con el símbolo
console.log(Object.keys(doc).join(","));
console.log(JSON.stringify(doc));
console.log(doc[VERSION]);
`,
  pruebas:[{salida:"titulo\n{\"titulo\":\"Informe\"}\n3"}],
  pista:"const VERSION = Symbol(\"version\"); doc[VERSION] = 3;",
  solucion:`const VERSION = Symbol("version");
const doc = { titulo: "Informe" };
doc[VERSION] = 3;
console.log(Object.keys(doc).join(","));
console.log(JSON.stringify(doc));
console.log(doc[VERSION]);`,
  why:"No es privacidad real (Object.getOwnPropertySymbols lo encuentra), pero evita choques y no ensucia la serialización."},
 {t:"codigo", p:"Implementa <code>memo(fn)</code>: cachea el resultado por objeto argumento con un WeakMap",
  lenguaje:"js",
  plantilla:`function memo(fn) {
  // devuelve una función que use un WeakMap como caché
}
let llamadas = 0;
const total = memo(pedido => { llamadas++; return pedido.lineas.reduce((s, l) => s + l, 0); });
const p = { lineas: [10, 20, 5] };
console.log(total(p), total(p), total({ lineas: [1] }));
console.log(llamadas);
`,
  pruebas:[{salida:"35 35 1\n2"}],
  pista:"const cache = new WeakMap(); return obj => { if (!cache.has(obj)) cache.set(obj, fn(obj)); return cache.get(obj); };",
  solucion:`function memo(fn) {
  const cache = new WeakMap();
  return obj => {
    if (!cache.has(obj)) cache.set(obj, fn(obj));
    return cache.get(obj);
  };
}
let llamadas = 0;
const total = memo(pedido => { llamadas++; return pedido.lineas.reduce((s, l) => s + l, 0); });
const p = { lineas: [10, 20, 5] };
console.log(total(p), total(p), total({ lineas: [1] }));
console.log(llamadas);`,
  why:"La segunda llamada con p sale de la caché. Y cuando p deja de usarse, su entrada se libera sin que tengas que limpiar nada."}
]}

]});
