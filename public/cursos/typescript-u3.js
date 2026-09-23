window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Uniones y narrowing",
resumen: "Tipos unión e intersección, null y undefined con strict, estrechamiento con typeof, in, instanceof y comparaciones, uniones discriminadas con exhaustividad, guardas de tipo, aserciones y errores tipados",
nivel: "Intermedio",
color: "#4583cc",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"ts3l1",
titulo:"Uniones y estrechamiento",
claves:["A | B: el valor es de uno de los tipos; solo puedes usar lo común hasta estrechar","Se estrecha con typeof, in, instanceof, Array.isArray, igualdades y comprobaciones de null","TypeScript sigue el flujo del código (control flow analysis), incluidos return y throw"],
pasos:[
 {t:"info", eti:"Uno u otro", h:"Tipos unión",
  c:`<div class="termbox">function formatear(valor: string | number): string {
  if (typeof valor === "number") {
    return valor.toFixed(2);          // aquí valor es number
  }
  return valor.trim();                // aquí valor es string
}

function longitud(x: string[] | null) {
  if (!x) return 0;                   // descarta null
  return x.length;                    // aquí x es string[]
}

function area(f: Circulo | Rectangulo) {
  if ("radio" in f) return Math.PI * f.radio ** 2;   // Circulo
  return f.ancho * f.alto;                            // Rectangulo
}

function fecha(x: Date | string) {
  return x instanceof Date ? x : new Date(x);         // Date en la rama verdadera
}</div>
     <p>TypeScript <b>estrecha</b> (narrowing) el tipo dentro de cada rama según las comprobaciones que haces. Es análisis de flujo: también cuenta un <code>return</code> o un <code>throw</code> anteriores.</p>`},
 {t:"info", eti:"Error típico", h:"La veracidad engaña",
  c:`<div class="termbox">function descuento(porcentaje: number | undefined) {
  if (!porcentaje) return "sin descuento";   // ¡0 también entra aquí!
  return \`\${porcentaje}%\`;
}

function descuentoBien(porcentaje: number | undefined) {
  if (porcentaje === undefined) return "sin descuento";
  return \`\${porcentaje}%\`;                 // 0 llega aquí como número
}</div>
     <p><code>0</code>, <code>""</code> y <code>NaN</code> son falsos. Estrechar con <code>!x</code> es cómodo con objetos, pero con números y textos compara explícitamente con <code>undefined</code> o <code>null</code> (o usa <code>x == null</code>, que cubre los dos).</p>`},
 {t:"par", p:"Empareja cada comprobación con lo que permite estrechar",
  pares:[["typeof x === \"string\"","Tipos primitivos"],["x instanceof Date","Instancias de una clase"],["\"radio\" in figura","Objetos según tengan una propiedad"],["x != null","Quitar null y undefined a la vez"],["Array.isArray(x)","Distinguir arrays"]],
  why:"Sin estrechar, solo puedes usar lo que tengan en común todos los tipos de la unión."},
 {t:"opcion", p:"¿Por qué da error este código?", c:`<div class="termbox">function f(x: string | number) {
  return x.toUpperCase();
}</div>`,
  ops:["toUpperCase no existe","x podría ser number, que no tiene toUpperCase: hay que estrechar antes","Falta el tipo de retorno","No da error"],
  ok:1, why:"Solo se permite lo que es común a todos los miembros de la unión."},
 {t:"opcion", p:"¿Qué tipo tiene <code>x</code> en la última línea?", c:`<div class="termbox">function f(x: string | number | boolean) {
  if (typeof x === "boolean") throw new Error("no");
  if (typeof x === "number") return x * 2;
  x;
}</div>`,
  ops:["string | number | boolean","string","string | number","never"],
  ok:1, why:"El throw descarta boolean y el return descarta number: solo queda string."},
 {t:"vf", p:"<code>if (!cantidad)</code> es una forma segura de comprobar si un <code>number | undefined</code> no tiene valor.",
  ok:false, why:"0 es falso: una cantidad 0 válida se trataría como «sin valor». Compara con undefined."},
 {t:"hueco", p:"Completa las dos guardas",
  tpl:"function describir(x: string[] | Date | number) {\n  if (Array.isArray(x)) return x.join(\", \");\n  if (x ___ Date) return x.toISOString();\n  return ___ x === \"number\" ? x.toFixed(1) : x;\n}", banco:["instanceof","typeof","in","is","keyof"], sol:["instanceof","typeof"],
  why:"instanceof para clases (Date, Error, tus clases); typeof para primitivos."}
]},

/* =============== U3 L2 =============== */
{
id:"ts3n1",
titulo:"null, undefined e intersecciones",
claves:["Con strictNullChecks, null y undefined son tipos aparte que hay que tratar","?. corta si el valor es null o undefined; ?? da un valor por defecto solo en esos casos","A &amp; B combina tipos: el valor cumple los dos a la vez"],
pasos:[
 {t:"info", eti:"El error del billón de dólares", h:"null bajo control",
  c:`<div class="termbox">interface Usuario { nombre: string; direccion?: { ciudad: string } }

function ciudad(u: Usuario | undefined): string {
  return u?.direccion?.ciudad ?? "desconocida";
}

const limite = config.limite ?? 10;    // 0 se respeta
const limite2 = config.limite || 10;   // 0 se convierte en 10: casi nunca es lo que quieres

document.getElementById("app")!.textContent = "hola";   // ! quita null sin comprobar</div>
     <p>Con <code>strictNullChecks</code> (parte de <code>strict</code>), <code>string</code> ya no incluye <code>null</code>: si algo puede faltar, el tipo lo dice (<code>string | null</code>) y el compilador te obliga a tratarlo. Es probablemente la comprobación que más fallos de producción evita.</p>`},
 {t:"info", eti:"Y a la vez", h:"Intersecciones",
  c:`<div class="termbox">type ConId = { id: string };
type ConFechas = { creado: Date; actualizado: Date };
type Tarea = ConId &amp; ConFechas &amp; { titulo: string };

function conAuditoria&lt;T&gt;(obj: T): T &amp; ConFechas {
  const ahora = new Date();
  return { ...obj, creado: ahora, actualizado: ahora };
}</div>
     <p>La unión <code>A | B</code> es «uno u otro»; la intersección <code>A &amp; B</code> es «los dos a la vez». Con objetos, la intersección suma propiedades. Con primitivos incompatibles (<code>string &amp; number</code>) da <code>never</code>.</p>`},
 {t:"par", p:"Empareja cada expresión con su resultado cuando <code>x</code> es <code>null</code>",
  pares:[["x?.nombre","undefined"],["x ?? \"anónimo\"","\"anónimo\""],["x || \"anónimo\"","\"anónimo\" (y también si x fuera \"\" o 0)"],["x!.nombre","TypeError en ejecución"]],
  why:"?? solo reacciona a null y undefined; || reacciona a cualquier valor falso."},
 {t:"opcion", p:"<code>config.reintentos</code> es <code>number | undefined</code> y 0 es un valor válido. ¿Qué escribes?",
  ops:["config.reintentos || 3","config.reintentos ?? 3","config.reintentos!","config.reintentos &amp;&amp; 3"],
  ok:1, why:"Con || un 0 explícito se convertiría en 3."},
 {t:"opcion", p:"¿Qué tipo tiene <code>c</code>?", c:`<div class="termbox">function f(u: { direccion?: { ciudad: string } }) {
  const c = u.direccion?.ciudad;
}</div>`,
  ops:["string","string | undefined","undefined","string | null"],
  ok:1, why:"Si direccion falta, ?. devuelve undefined: el tipo lo refleja."},
 {t:"vf", p:"El operador <code>!</code> (non-null) comprueba en ejecución que el valor no es null.",
  ok:false, why:"Solo silencia al compilador. Si te equivocas, el TypeError aparece en producción. Úsalo cuando realmente lo sepas (un elemento que siempre está en el HTML) y prefiere comprobar."},
 {t:"hueco", p:"Devuelve el nombre de la empresa o \"particular\" si no hay",
  tpl:"const empresa = cliente___empresa___nombre ___ \"particular\";", banco:["?.","?.","??","||","!."], sol:["?.","?.","??"],
  why:"?. en cada nivel que puede faltar y ?? para el valor por defecto."}
]},

/* =============== U3 L3 =============== */
{
id:"ts3l2",
titulo:"Uniones discriminadas y exhaustividad",
claves:["Cada variante tiene una propiedad común con un literal distinto (tipo, kind, estado)","Un switch sobre esa propiedad estrecha a cada variante","never en default garantiza que se tratan todos los casos: añadir una variante rompe la compilación donde falte"],
pasos:[
 {t:"info", eti:"Modelar estados", h:"El patrón más útil de TypeScript",
  c:`<div class="termbox">type Peticion&lt;T&gt; =
  | { estado: "cargando" }
  | { estado: "exito"; datos: T }
  | { estado: "error"; mensaje: string };

function pintar(p: Peticion&lt;Tarea[]&gt;) {
  switch (p.estado) {
    case "cargando": return "Cargando...";
    case "exito":    return \`\${p.datos.length} tareas\`;   // aquí existe datos
    case "error":    return \`Error: \${p.mensaje}\`;         // aquí existe mensaje
    default:         return noDeberiaPasar(p);             // p es never
  }
}

function noDeberiaPasar(x: never): never {
  throw new Error("Caso no tratado: " + JSON.stringify(x));
}</div>
     <p>Es imposible acceder a <code>datos</code> en estado de error, o olvidar tratar un estado: los estados imposibles no se pueden representar.</p>`},
 {t:"info", eti:"Antes y después", h:"Por qué no booleanos sueltos",
  c:`<div class="dg"><div class="dg-tit">el mismo estado, modelado de dos formas</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">flags sueltos</div><div class="dg-pila"><div class="dg-caja aviso"><code>cargando: boolean</code></div><div class="dg-caja aviso"><code>error?: string</code></div><div class="dg-caja aviso"><code>datos?: Tarea[]</code></div><div class="dg-caja base">8 combinaciones, 5 sin sentido (cargando y con error a la vez...)</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">unión discriminada</div><div class="dg-pila"><div class="dg-caja ok"><code>{ estado: "cargando" }</code></div><div class="dg-caja ok"><code>{ estado: "exito"; datos }</code></div><div class="dg-caja ok"><code>{ estado: "error"; mensaje }</code></div><div class="dg-caja base">3 estados, todos válidos</div></div></div>
       </div></div>`},
 {t:"opcion", p:"Añades el estado <code>{ estado: \"vacio\" }</code> a la unión. ¿Qué pasa en el switch con <code>noDeberiaPasar(p)</code>?",
  ops:["Nada","Error de compilación en el default: Argument of type '{ estado: \"vacio\" }' is not assignable to parameter of type 'never'","Se ignora el nuevo estado","Error en ejecución"],
  ok:1, why:"Comprobación exhaustiva: el compilador te lleva a todos los sitios que debes actualizar."},
 {t:"par", p:"Empareja cada parte del patrón con su función",
  pares:[["Propiedad discriminante (estado)","Distingue cada variante con un literal"],["switch (p.estado)","Estrecha a la variante correspondiente"],["noDeberiaPasar(p) en default","Asegura que no queda ningún caso sin tratar"],["Peticion<T>","Unión genérica reutilizable para cualquier dato"]],
  why:"Es lo mismo que hacen las sealed interfaces con switch en Java moderno o los enum de Rust."},
 {t:"vf", p:"Con una unión discriminada, TypeScript permite leer <code>p.datos</code> sin comprobar antes el estado.",
  ok:false, why:"datos solo existe en la variante exito: hay que estrechar primero."},
 {t:"opcion", p:"¿Cuál de estas uniones NO sirve como unión discriminada?",
  ops:["{ tipo: \"a\"; x: number } | { tipo: \"b\"; y: string }","{ tipo: string; x: number } | { tipo: string; y: string }","{ ok: true; valor: T } | { ok: false; error: E }","{ kind: 1; r: number } | { kind: 2; l: number }"],
  ok:1, why:"El discriminante tiene que ser un literal distinto en cada variante (texto, número o booleano). Con string en ambas, el switch no puede distinguirlas."},
 {t:"hueco", p:"Completa la comprobación exhaustiva",
  tpl:"default: {\n  const imposible: ___ = forma;\n  throw new Error(`Forma desconocida: ${JSON.stringify(imposible)}`);\n}", banco:["never","unknown","void","any"], sol:["never"],
  why:"Solo un valor de tipo never se puede asignar a never: si queda una variante sin tratar, error de compilación."},
 {t:"codigo", p:"Implementa en JavaScript la función de área de una unión discriminada. Cada línea de entrada es un JSON con <code>tipo</code> <code>\"circulo\"</code> (radio), <code>\"rect\"</code> (ancho, alto) o <code>\"triangulo\"</code> (base, altura). Imprime el área con dos decimales; si el tipo es desconocido, imprime <code>desconocido</code> (el equivalente en ejecución del default con never).", lenguaje:"js",
  plantilla:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n\nfunction area(f) {\n  // switch (f.tipo) ...\n}\n\nfor (const l of lineas) console.log(area(JSON.parse(l)));\n",
  pruebas:[{entrada:"{\"tipo\":\"rect\",\"ancho\":2,\"alto\":3}\n{\"tipo\":\"circulo\",\"radio\":1}\n", salida:"6.00\n3.14"},{entrada:"{\"tipo\":\"triangulo\",\"base\":4,\"altura\":5}\n{\"tipo\":\"hexagono\",\"lado\":2}\n", salida:"10.00\ndesconocido", oculta:true}],
  pista:"switch (f.tipo) con un case por variante y un default que devuelva \"desconocido\". Math.PI * r ** 2 y .toFixed(2).",
  solucion:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n\nfunction area(f) {\n  switch (f.tipo) {\n    case \"circulo\": return (Math.PI * f.radio ** 2).toFixed(2);\n    case \"rect\": return (f.ancho * f.alto).toFixed(2);\n    case \"triangulo\": return (f.base * f.altura / 2).toFixed(2);\n    default: return \"desconocido\";\n  }\n}\n\nfor (const l of lineas) console.log(area(JSON.parse(l)));\n",
  why:"En TypeScript, el default con never haría que un tipo nuevo sin tratar no compilase; en ejecución, el default te protege de datos inesperados que llegan de fuera."}
]},

/* =============== U3 L4 =============== */
{
id:"ts3l3",
titulo:"Guardas de tipo y aserciones",
claves:["Una guarda personalizada devuelve x is Tipo; una función asserts x is Tipo lanza si no se cumple","Desde TS 5.5, filter(x =&gt; x !== null) ya infiere el predicado solo","as y ! no comprueban nada en ejecución: úsalos poco"],
pasos:[
 {t:"info", eti:"Comprobaciones propias", h:"Guardas de tipo",
  c:`<div class="termbox">function esUsuario(x: unknown): x is Usuario {
  return typeof x === "object" &amp;&amp; x !== null
      &amp;&amp; "id" in x &amp;&amp; typeof x.id === "number"
      &amp;&amp; "email" in x &amp;&amp; typeof x.email === "string";
}

const datos: unknown = await res.json();
if (esUsuario(datos)) {
  datos.email;          // Usuario
}

// función de aserción: si vuelve, el tipo queda estrechado
function asegurarDefinido&lt;T&gt;(x: T, msg: string): asserts x is NonNullable&lt;T&gt; {
  if (x == null) throw new Error(msg);
}
const raiz = document.getElementById("app");
asegurarDefinido(raiz, "Falta #app");
raiz.append("hola");    // HTMLElement, sin !</div>
     <div class="nota ojo"><b class="tit">La guarda es una promesa</b>TypeScript se cree lo que diga tu <code>x is Usuario</code>. Si la comprobación está mal (olvidas un campo), el compilador no lo detecta: la guarda es tan buena como su cuerpo.</div>`},
 {t:"info", eti:"Con cuidado", h:"as, ! y los predicados inferidos",
  c:`<div class="termbox">const input = document.querySelector("#email") as HTMLInputElement;
const boton = document.querySelector("button")!;     // "confía, no es null"
const usuario = JSON.parse(texto) as Usuario;        // NO valida nada
const raro = 42 as unknown as string;                // doble aserción: señal de alarma

const valores = ["a", null, "b"];
const limpios = valores.filter(v =&gt; v !== null);    // string[] (TS 5.5+ infiere el predicado)</div>
     <p><code>as</code> y <code>!</code> no comprueban nada en ejecución: si te equivocas, el error aparece en producción. Prefiere guardas o validación real. Un <code>as unknown as</code> significa casi siempre que el diseño de tipos está mal.</p>`},
 {t:"par", p:"Empareja cada técnica con su nivel de seguridad",
  pares:[["Guarda x is T con comprobaciones reales","Segura si la comprobación es correcta"],["x as T","Sin comprobación: confías en que es cierto"],["x!","Sin comprobación: asumes que no es null"],["Validación con un esquema (Zod)","Segura y además da mensajes de error"]],
  why:"Cuantos menos as y !, más te protege TypeScript."},
 {t:"opcion", p:"<code>const u = JSON.parse(texto) as Usuario;</code> ¿Qué garantiza?",
  ops:["Que el JSON tiene la forma de Usuario","Nada en ejecución: solo le dice al compilador que lo trate como Usuario","Que no es null","Que el email es válido"],
  ok:1, why:"Para datos externos, valida (guarda propia o una librería como Zod)."},
 {t:"opcion", p:"Con TypeScript 5.5 o posterior, ¿qué tipo tiene <code>ids</code>?", c:`<div class="termbox">const posibles: (number | undefined)[] = [1, undefined, 3];
const ids = posibles.filter(x =&gt; x !== undefined);</div>`,
  ops:["(number | undefined)[]","number[]","undefined[]","any[]"],
  ok:1, why:"Desde 5.5 el compilador infiere que la flecha es un predicado x is number. Antes había que escribirlo a mano: .filter((x): x is number =&gt; x !== undefined)."},
 {t:"hueco", p:"Completa la firma de la guarda",
  tpl:"function esTexto(x: unknown): x ___ string {\n  return typeof x === \"string\";\n}", banco:["is","as","extends","in"], sol:["is"],
  why:"El retorno x is string hace que, en un if (esTexto(v)), v pase a ser string."},
 {t:"codigo", p:"Escribe en JavaScript la guarda <code>esUsuario</code>: cada línea es un JSON; es usuario válido si es un objeto no nulo con <code>id</code> numérico y <code>email</code> de texto que contiene <code>@</code>. Imprime <code>ok EMAIL</code> o <code>invalido</code>.", lenguaje:"js",
  plantilla:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n\nfunction esUsuario(x) {\n  return false;\n}\n\nfor (const l of lineas) {\n  const d = JSON.parse(l);\n  console.log(esUsuario(d) ? \"ok \" + d.email : \"invalido\");\n}\n",
  pruebas:[{entrada:"{\"id\":1,\"email\":\"ana@x.com\"}\n{\"id\":\"2\",\"email\":\"luis@x.com\"}\nnull\n", salida:"ok ana@x.com\ninvalido\ninvalido"},{entrada:"[1,2]\n{\"id\":3,\"email\":\"sinarroba\"}\n{\"id\":4,\"email\":\"eva@y.es\",\"extra\":true}\n", salida:"invalido\ninvalido\nok eva@y.es", oculta:true}],
  pista:"typeof x === \"object\" &amp;&amp; x !== null, luego typeof x.id === \"number\" y typeof x.email === \"string\" &amp;&amp; x.email.includes(\"@\").",
  solucion:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\n\nfunction esUsuario(x) {\n  return typeof x === \"object\" && x !== null\n    && typeof x.id === \"number\"\n    && typeof x.email === \"string\" && x.email.includes(\"@\");\n}\n\nfor (const l of lineas) {\n  const d = JSON.parse(l);\n  console.log(esUsuario(d) ? \"ok \" + d.email : \"invalido\");\n}\n",
  why:"Es exactamente el cuerpo de una guarda x is Usuario. Fíjate en que un array también es \"object\": aquí lo descarta el id, pero en guardas reales a veces hace falta !Array.isArray(x)."}
]},

/* =============== U3 L5 =============== */
{
id:"ts3l4",
titulo:"Errores tipados",
claves:["El error de un catch es unknown: compruébalo antes de usarlo","Tipos Result (ok o error) para errores esperados que forman parte del dominio","Excepciones para lo inesperado; resultados para lo previsible"],
pasos:[
 {t:"info", eti:"Errores como datos", h:"El patrón Result",
  c:`<div class="termbox">type Result&lt;T, E = string&gt; =
  | { ok: true; valor: T }
  | { ok: false; error: E };

type ErrorPago = "fondos_insuficientes" | "tarjeta_caducada" | "rechazada";

async function cobrar(importe: number): Promise&lt;Result&lt;string, ErrorPago&gt;&gt; {
  const r = await pasarela.cobrar(importe);
  if (r.codigo === 51) return { ok: false, error: "fondos_insuficientes" };
  return { ok: true, valor: r.idTransaccion };
}

const r = await cobrar(45.9);
if (!r.ok) {
  switch (r.error) {                     // el compilador conoce todos los errores posibles
    case "fondos_insuficientes": ...
  }
} else {
  guardar(r.valor);
}</div>
     <p>TypeScript no tiene excepciones comprobadas como Java: una función que lanza no lo dice en su tipo. El patrón Result pone los errores esperados en la firma, y quien llama no puede ignorarlos.</p>`},
 {t:"info", eti:"Excepciones", h:"catch con unknown",
  c:`<div class="termbox">class ErrorNoEncontrado extends Error {
  constructor(public recurso: string, options?: ErrorOptions) {
    super(\`\${recurso} no encontrado\`, options);
    this.name = "ErrorNoEncontrado";
  }
}

try {
  await cargar();
} catch (e) {                                   // e: unknown
  if (e instanceof ErrorNoEncontrado) return responder404(e.recurso);
  const mensaje = e instanceof Error ? e.message : String(e);
  throw new Error("Fallo al cargar", { cause: e });   // conserva el original
}</div>`},
 {t:"par", p:"Empareja cada situación con la estrategia",
  pares:[["Tarjeta rechazada por el banco","Resultado tipado: es un caso esperado del negocio"],["Base de datos caída","Excepción: es inesperado"],["Error en un catch","Tratarlo como unknown y comprobar si es Error"],["Validación de formulario","Resultado con los errores de cada campo"]],
  why:"Los errores esperados en el tipo obligan a quien llama a gestionarlos."},
 {t:"vf", p:"Con strict, dentro de <code>catch (e)</code> puedes usar <code>e.message</code> directamente.",
  ok:false, why:"e es unknown (useUnknownInCatchVariables, incluida en strict): primero if (e instanceof Error)."},
 {t:"opcion", p:"¿Por qué no se puede escribir <code>catch (e: ErrorNoEncontrado)</code>?",
  ops:["Sí se puede","Porque en JavaScript se puede lanzar cualquier valor desde cualquier sitio: TypeScript solo admite anotar el catch como unknown o any","Porque las clases de error no son tipos","Porque hace falta un genérico"],
  ok:1, why:"Nadie garantiza qué llega al catch. Se estrecha dentro con instanceof."},
 {t:"opcion", p:"Tras <code>if (!r.ok) return;</code>, ¿qué puedes usar de <code>r</code>?",
  ops:["r.error","r.valor, porque r ya es la variante { ok: true; valor: T }","Nada","r.valor y r.error"],
  ok:1, why:"ok: true / ok: false es un discriminante booleano: el return descarta la variante de error."},
 {t:"escribe", p:"¿Qué opción del constructor de <code>Error</code> guarda el error original al envolverlo en otro?",
  sol:["cause","{ cause: e }","{cause: e}","cause: e"], pista:"new Error(\"mensaje\", { ... }).",
  why:"Así no pierdes la traza del fallo real al añadir contexto."}
]}

]});
