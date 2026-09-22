window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Objetos, JSON, Map y Set",
resumen: "Objetos literales, propiedades dinámicas, desestructuración, spread, recorrer objetos, JSON, Map y Set",
nivel: "Intermedio",
color: "#d0b834",
lecciones: [

{
id:"js5l1",
titulo:"Objetos literales",
claves:["Un objeto agrupa propiedades clave-valor","Acceso con punto (obj.nombre) o corchetes (obj[clave]) para claves dinámicas","Atajos: propiedades abreviadas, métodos y claves calculadas"],
pasos:[
 {t:"info", eti:"Agrupar datos", h:"Crear y usar objetos",
  c:`<div class="termbox">const nombre = "Ana";
const campo = "ciudad";

const usuario = {
  nombre,                        // abreviado: nombre: nombre
  edad: 31,
  [campo]: "Madrid",             // clave calculada: ciudad: "Madrid"
  saludar() {                    // metodo
    return \`Hola, soy \${this.nombre}\`;
  },
};

usuario.edad;           // 31
usuario["ciudad"];      // "Madrid"
usuario.email = "ana@x.com";   // anadir
delete usuario.edad;           // quitar
"email" in usuario;            // true</div>`},
 {t:"par", p:"Empareja cada sintaxis con su efecto",
  pares:[["obj.clave","Leer una propiedad de nombre fijo"],["obj[variable]","Leer una propiedad cuyo nombre está en una variable"],["{ nombre }","Crear la propiedad nombre con el valor de la variable nombre"],["{ [k]: v }","Clave calculada a partir de una expresión"],["delete obj.clave","Eliminar una propiedad"]],
  why:"Los corchetes son imprescindibles cuando la clave viene de un dato (un campo de formulario, por ejemplo)."},
 {t:"opcion", p:"¿Qué devuelve <code>usuario.telefono</code> si esa propiedad no existe?",
  ops:["null","undefined","Error","\"\""],
  ok:1, why:"Leer una propiedad inexistente da undefined. Leer una propiedad DE undefined sí lanza error (por eso existe ?.)."},
 {t:"vf", p:"Dos objetos con las mismas propiedades y valores son iguales con <code>===</code>.",
  ok:false, why:"=== compara referencias: son objetos distintos. Para comparar contenido hay que hacerlo propiedad a propiedad."}
]},

{
id:"js5l2",
titulo:"Desestructurar, spread y recorrer",
claves:["const { nombre, edad = 0 } = usuario; renombrar con { nombre: n }","{ ...a, ...b } copia y combina (la última gana)","Object.keys, values y entries para recorrer"],
pasos:[
 {t:"info", eti:"Extraer y combinar", h:"Desestructuración y spread",
  c:`<div class="termbox">const { nombre, edad = 18, direccion: { ciudad } } = usuario;   // anidado
const { nombre: n } = usuario;                                   // renombrar
const { password, ...publico } = usuario;                        // quitar un campo

const config = { ...porDefecto, ...delUsuario };                 // combinar: gana el ultimo
const actualizado = { ...usuario, edad: 32 };                    // copia con cambio

function mostrar({ nombre, rol = "lector" }) { ... }              // en parametros</div>`},
 {t:"info", eti:"Recorrer", h:"keys, values y entries",
  c:`<div class="termbox">const stock = { teclado: 5, raton: 0, monitor: 3 };
Object.keys(stock);      // ["teclado", "raton", "monitor"]
Object.values(stock);    // [5, 0, 3]
Object.entries(stock);   // [["teclado", 5], ["raton", 0], ["monitor", 3]]

for (const [producto, unidades] of Object.entries(stock)) {
  console.log(producto, unidades);
}
const agotados = Object.entries(stock).filter(([, u]) =&gt; u === 0).map(([p]) =&gt; p);
Object.fromEntries([["a", 1], ["b", 2]]);   // { a: 1, b: 2 }</div>`},
 {t:"opcion", p:"¿Qué vale <code>{ ...{ a: 1, b: 2 }, ...{ b: 3 } }</code>?",
  ops:["{ a: 1, b: 2 }","{ a: 1, b: 3 }","{ b: 3 }","Error"],
  ok:1, why:"Al combinar, la propiedad que aparece después sobrescribe a la anterior."},
 {t:"escribe", p:"Extrae las propiedades <code>id</code> y <code>titulo</code> del objeto <code>tarea</code> en dos constantes",
  sol:["const { id, titulo } = tarea;","const { titulo, id } = tarea;","const {id, titulo} = tarea;","const { id, titulo } = tarea"], ph:"const { ... } = tarea;", pista:"const { id, titulo } = tarea;", why:"La desestructuración crea constantes con los nombres de las propiedades."},
 {t:"vf", p:"<code>const { password, ...publico } = usuario</code> modifica el objeto usuario.",
  ok:false, why:"Crea publico como copia sin password; usuario no cambia. Útil para no enviar campos sensibles."}
]},

{
id:"js5l3",
titulo:"JSON",
claves:["JSON es un formato de texto para intercambiar datos, derivado de la sintaxis de objetos","JSON.stringify convierte a texto; JSON.parse lo lee","JSON no admite funciones, undefined, fechas como tales ni comentarios"],
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
const bonito = JSON.stringify(tarea, null, 2);    // con sangria
const objeto = JSON.parse(texto);                 // texto -&gt; objeto
JSON.parse("{nombre: 'Ana'}");                    // SyntaxError: no es JSON valido</div>`},
 {t:"par", p:"Empareja cada valor con cómo queda en JSON.stringify",
  pares:[["{ a: undefined }","{} (la propiedad desaparece)"],["new Date(2026, 8, 22)","Un texto en formato ISO"],["{ f() {} }","{} (las funciones se omiten)"],["[1, \"dos\", true]","[1,\"dos\",true]"]],
  why:"Las fechas vuelven como texto: al hacer JSON.parse hay que convertirlas con new Date(...)."},
 {t:"opcion", p:"¿Cuál de estos textos es JSON válido?",
  ops:["{nombre: \"Ana\"}","{'nombre': 'Ana'}","{\"nombre\": \"Ana\"}","{\"nombre\": \"Ana\",}"],
  ok:2, why:"Claves y textos con comillas dobles y sin coma final."},
 {t:"vf", p:"<code>JSON.parse(JSON.stringify(obj))</code> es una forma perfecta de copiar cualquier objeto.",
  ok:false, why:"Pierde fechas, undefined, funciones, Map, Set... Para copias profundas, structuredClone."}
]},

{
id:"js5l4",
titulo:"Map y Set",
claves:["Map: pares clave-valor con claves de cualquier tipo y orden de inserción","Set: valores únicos; [...new Set(array)] elimina duplicados","Úsalos cuando el objeto literal se queda corto"],
pasos:[
 {t:"info", eti:"Estructuras", h:"Map y Set",
  c:`<div class="termbox">const visitas = new Map();
visitas.set("/inicio", 10);
visitas.set("/precios", 3);
visitas.get("/inicio");          // 10
visitas.has("/blog");            // false
visitas.size;                    // 2
for (const [ruta, n] of visitas) console.log(ruta, n);

const etiquetas = new Set(["js", "css", "js"]);
etiquetas.size;                  // 2
etiquetas.add("html");
etiquetas.has("css");            // true

const unicos = [...new Set([3, 1, 3, 2, 1])];   // [3, 1, 2]</div>`},
 {t:"par", p:"Empareja cada estructura con su mejor uso",
  pares:[["Objeto literal","Datos con propiedades conocidas (un usuario)"],["Map","Diccionario dinámico, claves de cualquier tipo, muchas altas y bajas"],["Set","Colección sin duplicados, comprobar pertenencia rápido"],["Array","Lista ordenada que puede repetir valores"]],
  why:"Set.has es mucho más rápido que array.includes en colecciones grandes."},
 {t:"escribe", p:"Obtén en <code>unicos</code> un array sin duplicados a partir de <code>emails</code>",
  sol:["const unicos = [...new Set(emails)];","const unicos = Array.from(new Set(emails));","const unicos = [...new Set(emails)]"], ph:"const unicos = ...", pista:"Spread de un new Set(emails) dentro de corchetes.", why:"El Set elimina duplicados y el spread lo vuelve a convertir en array."},
 {t:"vf", p:"Un Map puede usar un objeto como clave.",
  ok:true, why:"A diferencia de los objetos literales, cuyas claves se convierten a texto."}
]}

]});
