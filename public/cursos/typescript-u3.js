window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Uniones y narrowing",
resumen: "Tipos unión, estrechamiento con typeof, in e instanceof, uniones discriminadas, guardas de tipo y comprobación exhaustiva",
nivel: "Intermedio",
color: "#4583cc",
lecciones: [

{
id:"ts3l1",
titulo:"Uniones y estrechamiento",
claves:["A | B: el valor es de uno de los tipos","Antes de usarlo, estrecha el tipo con typeof, in, instanceof o comprobaciones de null","TypeScript sigue el flujo del código (control flow analysis)"],
pasos:[
 {t:"info", eti:"Uno u otro", h:"Tipos unión",
  c:`<div class="termbox">function formatear(valor: string | number): string {
  if (typeof valor === "number") {
    return valor.toFixed(2);          // aqui valor es number
  }
  return valor.trim();                // aqui valor es string
}

function longitud(x: string[] | null) {
  if (!x) return 0;                   // descarta null
  return x.length;                    // aqui x es string[]
}

function area(f: Circulo | Rectangulo) {
  if ("radio" in f) return Math.PI * f.radio ** 2;   // Circulo
  return f.ancho * f.alto;                            // Rectangulo
}</div>
     <p>TypeScript <b>estrecha</b> (narrowing) el tipo dentro de cada rama según las comprobaciones que haces.</p>`},
 {t:"par", p:"Empareja cada comprobación con lo que permite estrechar",
  pares:[["typeof x === \"string\"","Tipos primitivos"],["x instanceof Date","Instancias de una clase"],["\"radio\" in figura","Objetos según tengan una propiedad"],["x !== null","Quitar null de la unión"],["Array.isArray(x)","Distinguir arrays"]],
  why:"Sin estrechar, solo puedes usar lo que tengan en común todos los tipos de la unión."},
 {t:"opcion", p:"¿Por qué da error este código?", c:`<div class="termbox">function f(x: string | number) {
  return x.toUpperCase();
}</div>`,
  ops:["toUpperCase no existe","x podría ser number, que no tiene toUpperCase: hay que estrechar antes","Falta el tipo de retorno","No da error"],
  ok:1, why:"Solo se permite lo que es común a todos los miembros de la unión."},
 {t:"vf", p:"Después de <code>if (typeof x === \"number\") return;</code>, TypeScript sabe que x ya no es number en el resto de la función.",
  ok:true, why:"El análisis del flujo de control tiene en cuenta los return."}
]},

{
id:"ts3l2",
titulo:"Uniones discriminadas",
claves:["Cada variante tiene una propiedad común con un literal distinto (tipo, kind, estado)","Un switch sobre esa propiedad estrecha a cada variante","never en default garantiza que se tratan todos los casos"],
pasos:[
 {t:"info", eti:"Modelar estados", h:"El patrón más útil de TypeScript",
  c:`<div class="termbox">type Peticion&lt;T&gt; =
  | { estado: "cargando" }
  | { estado: "exito"; datos: T }
  | { estado: "error"; mensaje: string };

function pintar(p: Peticion&lt;Tarea[]&gt;) {
  switch (p.estado) {
    case "cargando": return "Cargando...";
    case "exito":    return \`\${p.datos.length} tareas\`;   // aqui existe datos
    case "error":    return \`Error: \${p.mensaje}\`;         // aqui existe mensaje
    default: {
      const imposible: never = p;     // si falta un caso, esto da error
      return imposible;
    }
  }
}</div>
     <p>Es imposible acceder a <code>datos</code> en estado de error, o olvidar tratar un estado: los estados imposibles no se pueden representar.</p>`},
 {t:"opcion", p:"Añades el estado <code>{ estado: \"vacio\" }</code> a la unión. ¿Qué pasa en el switch con el <code>never</code>?",
  ops:["Nada","Error de compilación en el default: «vacio» no se puede asignar a never, así que te obliga a tratarlo","Se ignora el nuevo estado","Error en ejecución"],
  ok:1, why:"Comprobación exhaustiva: el compilador te avisa de todos los sitios que debes actualizar."},
 {t:"par", p:"Empareja cada parte del patrón con su función",
  pares:[["Propiedad discriminante (estado)","Distingue cada variante con un literal"],["switch (p.estado)","Estrecha a la variante correspondiente"],["const x: never = p","Asegura que no queda ningún caso sin tratar"],["Peticion<T>","Unión genérica reutilizable para cualquier dato"]],
  why:"Es exactamente lo que hacen las clases selladas con switch en Java moderno."},
 {t:"vf", p:"Con una unión discriminada, TypeScript permite leer <code>p.datos</code> sin comprobar antes el estado.",
  ok:false, why:"datos solo existe en la variante exito: hay que estrechar primero."}
]},

{
id:"ts3l3",
titulo:"Guardas de tipo y aserciones",
claves:["Una guarda personalizada devuelve x is Tipo","as es una aserción: le dices al compilador que confíe en ti (úsala poco)","El operador ! (non-null) quita null y undefined sin comprobar"],
pasos:[
 {t:"info", eti:"Comprobaciones propias", h:"Guardas de tipo",
  c:`<div class="termbox">function esUsuario(x: unknown): x is Usuario {
  return typeof x === "object" &amp;&amp; x !== null
      &amp;&amp; "id" in x &amp;&amp; typeof (x as any).id === "number"
      &amp;&amp; "email" in x;
}

const datos: unknown = await res.json();
if (esUsuario(datos)) {
  datos.email;          // Usuario
}

const lista = valores.filter((v): v is string =&gt; v !== null);   // string[]</div>`},
 {t:"info", eti:"Con cuidado", h:"as y !",
  c:`<div class="termbox">const input = document.querySelector("#email") as HTMLInputElement;
const boton = document.querySelector("button")!;     // "confia, no es null"

const usuario = JSON.parse(texto) as Usuario;        // NO valida nada</div>
     <p><code>as</code> y <code>!</code> no comprueban nada en ejecución: si te equivocas, el error aparece en producción. Prefiere guardas o validación real.</p>`},
 {t:"par", p:"Empareja cada técnica con su nivel de seguridad",
  pares:[["Guarda x is T con comprobaciones reales","Segura: comprueba en ejecución"],["x as T","Sin comprobación: confías en que es cierto"],["x!","Sin comprobación: asumes que no es null"],["Validación con un esquema (zod)","Segura y además da mensajes de error"]],
  why:"Cuantos menos as y !, más te protege TypeScript."},
 {t:"opcion", p:"<code>const u = JSON.parse(texto) as Usuario;</code> ¿Qué garantiza?",
  ops:["Que el JSON tiene la forma de Usuario","Nada en ejecución: solo le dice al compilador que lo trate como Usuario","Que no es null","Que el email es válido"],
  ok:1, why:"Para datos externos, valida (guarda propia o una librería como zod)."}
]},

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
}

try { ... } catch (e) {
  const mensaje = e instanceof Error ? e.message : String(e);   // e es unknown
}</div>`},
 {t:"par", p:"Empareja cada situación con la estrategia",
  pares:[["Tarjeta rechazada por el banco","Resultado tipado: es un caso esperado del negocio"],["Base de datos caída","Excepción: es inesperado"],["Error en un catch","Tratarlo como unknown y comprobar si es Error"],["Validación de formulario","Resultado con los errores de cada campo"]],
  why:"Los errores esperados en el tipo obligan a quien llama a gestionarlos."},
 {t:"vf", p:"Con strict, dentro de <code>catch (e)</code> puedes usar <code>e.message</code> directamente.",
  ok:false, why:"e es unknown: primero if (e instanceof Error)."}
]}

]});
