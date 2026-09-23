window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Tipos utilitarios y satisfies",
resumen: "Partial, Required, Readonly, Pick, Omit y Record, derivar tipos con typeof, ReturnType, Parameters, Awaited, Exclude y Extract, y el operador satisfies",
nivel: "Avanzado",
color: "#3b77bf",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"ts6l1",
titulo:"Transformar objetos",
claves:["Partial, Required y Readonly cambian los modificadores de todas las propiedades","Pick y Omit eligen o quitan propiedades; Record crea objetos con claves y valores tipados","Omit no comprueba que la clave exista y no se distribuye sobre uniones"],
pasos:[
 {t:"info", eti:"Derivar en vez de repetir", h:"Utilitarios de objetos",
  c:`<div class="termbox">interface Usuario { id: number; nombre: string; email: string; clave: string }

type CambioUsuario  = Partial&lt;Omit&lt;Usuario, "id"&gt;&gt;;     // cuerpo de un PATCH
type UsuarioPublico = Omit&lt;Usuario, "clave"&gt;;            // respuesta de la API
type Credenciales   = Pick&lt;Usuario, "email" | "clave"&gt;;  // formulario de login
type Congelado      = Readonly&lt;Usuario&gt;;
type Completo       = Required&lt;Configuracion&gt;;

const permisosPorRol: Record&lt;"admin" | "editor" | "lector", string[]&gt; = {
  admin: ["*"], editor: ["leer", "escribir"], lector: ["leer"],
};</div>
     <p>Si cambias <code>Usuario</code>, todos los tipos derivados se actualizan solos. Es la diferencia entre tener una fuente de verdad o cinco copias que se desincronizan.</p>`},
 {t:"info", eti:"Trampas", h:"Dos sorpresas de Omit",
  c:`<div class="termbox">type SinClave = Omit&lt;Usuario, "claev"&gt;;     // compila: Omit acepta cualquier clave
                                            // (la errata deja pasar la clave)

type Evento = { tipo: "click"; x: number } | { tipo: "tecla"; k: string };
type SinTipo = Omit&lt;Evento, "tipo"&gt;;       // {}  ← se pierden x y k

// versión que se aplica a cada miembro de la unión
type OmitDistributivo&lt;T, K extends PropertyKey&gt; = T extends unknown ? Omit&lt;T, K&gt; : never;
type Bien = OmitDistributivo&lt;Evento, "tipo"&gt;; // { x: number } | { k: string }</div>
     <p><code>Omit</code> trabaja sobre <code>keyof</code> de la unión completa, que solo contiene las claves comunes. El truco de <code>T extends unknown ? ... : never</code> lo verás a fondo con los tipos condicionales.</p>`},
 {t:"par", p:"Empareja cada utilitario con su efecto",
  pares:[["Partial<T>","Todas las propiedades opcionales"],["Required<T>","Todas las propiedades obligatorias"],["Pick<T, K>","Solo las propiedades K"],["Omit<T, K>","Todas menos las propiedades K"],["Record<K, V>","Objeto con claves K y valores V"]],
  why:"Partial&lt;T&gt; es perfecto para el cuerpo de un PATCH."},
 {t:"opcion", p:"Quieres el tipo de la respuesta pública de usuario, igual que Usuario pero sin <code>clave</code>. ¿Qué escribes?",
  ops:["Partial&lt;Usuario&gt;","Omit&lt;Usuario, \"clave\"&gt;","Pick&lt;Usuario, \"clave\"&gt;","Readonly&lt;Usuario&gt;"],
  ok:1, why:"Omit quita propiedades; Pick las selecciona."},
 {t:"vf", p:"Un Record con claves de tipo unión obliga a definir todas las claves de esa unión.",
  ok:true, why:"Si añades un rol nuevo a la unión, el compilador te pedirá sus permisos."},
 {t:"opcion", p:"¿Qué tipo es <code>Readonly&lt;{ etiquetas: string[] }&gt;</code> en la práctica?",
  ops:["No se puede reasignar etiquetas ni modificar el array","No se puede reasignar etiquetas, pero etiquetas.push(\"x\") sigue compilando","Todo es inmutable en ejecución","Error: Readonly no admite arrays"],
  ok:1, why:"Readonly es superficial: solo el primer nivel. Para el array, readonly string[] o un DeepReadonly recursivo."},
 {t:"escribe", p:"Escribe el tipo de un formulario de alta de Usuario: todo menos <code>id</code>",
  sol:["Omit<Usuario, \"id\">","Omit<Usuario, 'id'>","Omit<Usuario,\"id\">"], pista:"El utilitario que quita claves.",
  why:"El id lo genera el servidor: el formulario no debe poder enviarlo."}
]},

/* =============== U7 L2 =============== */
{
id:"ts6l2",
titulo:"Derivar tipos: valores, funciones y uniones",
claves:["typeof valor obtiene el tipo de una variable","ReturnType, Parameters, Awaited e InstanceType extraen tipos de funciones, promesas y clases","Exclude, Extract y NonNullable filtran uniones"],
pasos:[
 {t:"info", eti:"Una sola fuente de verdad", h:"typeof y compañía",
  c:`<div class="termbox">const configPorDefecto = { tema: "oscuro", idioma: "es", avisos: true };
type Config = typeof configPorDefecto;       // { tema: string; idioma: string; avisos: boolean }

async function cargarPerfil(id: number) {
  return { id, nombre: "Ana", pedidos: [] as Pedido[] };
}
type Perfil = Awaited&lt;ReturnType&lt;typeof cargarPerfil&gt;&gt;;     // el objeto, sin la Promise
type ArgsPerfil = Parameters&lt;typeof cargarPerfil&gt;;             // [id: number]

class Cliente { constructor(url: string, reintentos: number) {} }
type Opciones = ConstructorParameters&lt;typeof Cliente&gt;;        // [url: string, reintentos: number]
type Instancia = InstanceType&lt;typeof Cliente&gt;;               // Cliente</div>
     <p>Muy útil con librerías que no exportan sus tipos: los derivas de sus funciones.</p>`},
 {t:"info", eti:"Filtrar uniones", h:"Exclude, Extract y NonNullable",
  c:`<div class="termbox">type Estado = "borrador" | "publicado" | "archivado" | "eliminado";
type Visible = Exclude&lt;Estado, "eliminado" | "archivado"&gt;;    // "borrador" | "publicado"

type Evento =
  | { tipo: "click"; x: number; y: number }
  | { tipo: "tecla"; tecla: string }
  | { tipo: "scroll"; delta: number };
type Click = Extract&lt;Evento, { tipo: "click" }&gt;;              // la variante click entera

type Email = NonNullable&lt;string | null | undefined&gt;;          // string</div>`},
 {t:"par", p:"Empareja cada utilitario con lo que extrae",
  pares:[["ReturnType<typeof f>","El tipo que devuelve f"],["Parameters<typeof f>","Tupla con los tipos de los parámetros de f"],["Awaited<Promise<T>>","T, el valor de la promesa"],["InstanceType<typeof C>","El tipo de los objetos que crea la clase C"],["Exclude<U, X>","Los miembros de U que no son asignables a X"]],
  why:"Todos se construyen con tipos condicionales, que verás en la unidad siguiente."},
 {t:"opcion", p:"¿Qué es <code>typeof</code> en <code>type Config = typeof configPorDefecto</code>?",
  ops:["El typeof de JavaScript que devuelve un string","El operador de tipos de TypeScript: obtiene el tipo de ese valor","Un error","Una función"],
  ok:1, why:"En posición de tipo, typeof es de TypeScript; en una expresión, es el de JavaScript."},
 {t:"opcion", p:"¿Qué tipo es <code>Extract&lt;Evento, { tipo: \"tecla\" | \"scroll\" }&gt;</code> con el Evento del ejemplo?",
  ops:["never","Las variantes tecla y scroll completas","{ tipo: \"tecla\" | \"scroll\" }","Solo la variante tecla"],
  ok:1, why:"Extract se queda con cada miembro de la unión asignable al filtro: ambas variantes lo son."},
 {t:"opcion", p:"Una librería exporta <code>crearCliente(opciones)</code> pero no el tipo de las opciones. ¿Cómo lo obtienes?",
  ops:["Copiarlo a mano del código fuente","Parameters&lt;typeof crearCliente&gt;[0]","ReturnType&lt;typeof crearCliente&gt;","typeof opciones"],
  ok:1, why:"Parameters da la tupla de parámetros; [0] el primero."},
 {t:"hueco", p:"Obtén el tipo del valor que resuelve la función asíncrona <code>cargar</code>",
  tpl:"type Datos = ___<___<typeof cargar>>;", banco:["Awaited","ReturnType","Parameters","Promise","typeof"], sol:["Awaited","ReturnType"],
  why:"ReturnType da Promise&lt;X&gt; y Awaited la desenvuelve (también promesas anidadas)."}
]},

/* =============== U7 L3 =============== */
{
id:"ts7n1",
titulo:"satisfies: comprobar sin perder el tipo",
claves:["valor satisfies Tipo comprueba que el valor encaja, pero conserva su tipo inferido, más preciso","Una anotación (: Tipo) comprueba y además ensancha; as no comprueba casi nada","as const satisfies Tipo: literales exactos y validación a la vez"],
pasos:[
 {t:"info", eti:"TS 4.9", h:"Anotar, afirmar o satisfacer",
  c:`<div class="termbox">type Color = string | [number, number, number];
type Tema = Record&lt;"fondo" | "texto", Color&gt;;

const a: Tema = { fondo: "#fff", texto: [0, 0, 0] };
a.fondo.toUpperCase();        // error: fondo es string | [number, number, number]

const b = { fondo: "#fff", texto: [0, 0, 0] } satisfies Tema;
b.fondo.toUpperCase();        // OK: fondo sigue siendo string
b.texto[0];                   // number: sigue siendo la tupla

const c = { fondo: "#fff", txto: "#000" } satisfies Tema;
//                         ~~~~ error: 'txto' does not exist... (y falta texto)</div>`},
 {t:"info", eti:"Comparación", h:"Tres herramientas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué hace cada una con el valor</div><table class="dg-tabla"><thead><tr><th></th><th>¿comprueba?</th><th>tipo resultante</th></tr></thead><tbody>
<tr><td><code>const x: T = v</code></td><td>Sí</td><td><code>T</code> (se pierde el detalle)</td></tr>
<tr><td><code>const x = v satisfies T</code></td><td>Sí</td><td>El inferido de <code>v</code> (más preciso)</td></tr>
<tr><td><code>const x = v as T</code></td><td>Casi nada (solo que sean compatibles)</td><td><code>T</code></td></tr>
</tbody></table></div>
     <div class="termbox">export const RUTAS = {
  inicio: "/",
  perfil: "/perfil",
} as const satisfies Record&lt;string, \`/\${string}\`&gt;;
// RUTAS.perfil es "/perfil" y una ruta sin barra inicial no compila</div>`},
 {t:"opcion", p:"¿Qué ventaja tiene <code>satisfies</code> sobre la anotación <code>: Tipo</code>?",
  ops:["Ninguna: es igual","Comprueba lo mismo, pero el valor conserva su tipo inferido, más concreto (literales, claves exactas, la variante concreta de una unión)","Es más rápido en ejecución","No comprueba propiedades de más"],
  ok:1, why:"Anotar ensancha al tipo declarado; satisfies valida y deja el tipo preciso."},
 {t:"opcion", p:"¿Compila?", c:`<div class="termbox">type Tema = Record&lt;"fondo" | "texto", string&gt;;
const t = { fondo: "#fff" } satisfies Tema;</div>`,
  ops:["Sí","No: falta la propiedad texto","Sí, texto queda undefined","No: satisfies no admite Record"],
  ok:1, why:"satisfies comprueba igual que una anotación: faltan claves obligatorias."},
 {t:"vf", p:"<code>{ fondo: \"#fff\" } as Tema</code> daría error por faltar texto.",
  ok:false, why:"as solo exige que los tipos sean «comparables»: un objeto con parte de las propiedades pasa. Por eso as es peligroso y satisfies no."},
 {t:"par", p:"Empareja cada caso con la herramienta",
  pares:[["Objeto de configuración que debe cumplir un tipo y conservar sus literales","satisfies"],["Parámetro de una función pública","Anotación : Tipo"],["Elemento del DOM que sabes que es un input","as HTMLInputElement"],["Tabla de rutas inmutable y validada","as const satisfies"]],
  why:"satisfies brilla en objetos de configuración, mapas de rutas, temas y traducciones."},
 {t:"hueco", p:"Valida el mapa de traducciones sin perder sus claves concretas",
  tpl:"const es = {\n  saludo: \"Hola\",\n  despedida: \"Adiós\",\n} ___ Record<string, string>;\ntype Clave = ___ typeof es;   // \"saludo\" | \"despedida\"", banco:["satisfies","keyof","as","implements","typeof"], sol:["satisfies","keyof"],
  why:"Con : Record&lt;string, string&gt; las claves se perderían y keyof daría string."}
]}

]});
