window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Clases, enums y decoradores",
resumen: "Clases con modificadores de acceso, implements, abstractas y override, private frente a #campo, enums y sus alternativas, decoradores estándar y fusión de declaraciones",
nivel: "Avanzado",
color: "#3b77bf",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"ts5l1",
titulo:"Clases en TypeScript",
claves:["public, private, protected y readonly en propiedades","Parámetros de propiedad en el constructor: declaran y asignan a la vez","implements comprueba que la clase cumple una interfaz"],
pasos:[
 {t:"info", eti:"POO tipada", h:"Clases",
  c:`<div class="termbox">interface Repositorio&lt;T&gt; {
  buscar(id: number): Promise&lt;T | undefined&gt;;
  guardar(item: T): Promise&lt;void&gt;;
}

class TareaRepoHttp implements Repositorio&lt;Tarea&gt; {
  private cache = new Map&lt;number, Tarea&gt;();              // tipo inferido del inicializador
  constructor(private readonly baseUrl: string) {}      // crea y asigna la propiedad

  async buscar(id: number) {
    const res = await fetch(\`\${this.baseUrl}/tareas/\${id}\`);
    return res.ok ? (await res.json() as Tarea) : undefined;
  }
  async guardar(t: Tarea) { ... }
}</div>
     <p>Con <code>strict</code> (<code>strictPropertyInitialization</code>), cada propiedad debe inicializarse en su declaración o en el constructor; si la rellena otro (un framework), se marca con <code>!</code>: <code>nombre!: string</code>.</p>`},
 {t:"par", p:"Empareja cada modificador con su efecto",
  pares:[["private","Solo accesible dentro de la clase (comprobado al compilar)"],["#campo","Privado real del lenguaje, también en ejecución"],["protected","Clase y subclases"],["readonly","No se puede reasignar tras el constructor"],["implements","La clase debe cumplir la interfaz"]],
  why:"private de TypeScript desaparece al compilar; #campo es privado de verdad en JavaScript."},
 {t:"vf", p:"<code>constructor(private nombre: string) {}</code> declara y asigna la propiedad nombre automáticamente.",
  ok:true, why:"Son los parámetros de propiedad: ahorran la declaración y la asignación. Ojo: no son «sintaxis borrable», así que no funcionan con erasableSyntaxOnly ni al ejecutar .ts directamente en Node."},
 {t:"opcion", p:"¿Compila?", c:`<div class="termbox">class Cuenta {
  saldo: number;
  titular: string;
  constructor(titular: string) { this.titular = titular; }
}</div>`,
  ops:["Sí","No: Property 'saldo' has no initializer and is not definitely assigned in the constructor","No: falta public","Solo si saldo es readonly"],
  ok:1, why:"strictPropertyInitialization evita objetos a medio construir. Arreglo: saldo = 0, o asignarlo en el constructor."},
 {t:"opcion", p:"¿Qué garantiza <code>implements Repositorio&lt;Tarea&gt;</code>?",
  ops:["Que la clase hereda el código de la interfaz","Que el compilador comprueba al declarar la clase que tiene todos los miembros con los tipos correctos","Que solo esa clase puede usarse como Repositorio","Que se comprueba en ejecución"],
  ok:1, why:"Las interfaces no aportan código. Y por el tipado estructural, cualquier objeto con la forma adecuada sería un Repositorio aunque no lo declare."},
 {t:"hueco", p:"Declara una propiedad privada de solo lectura desde el constructor",
  tpl:"class Servicio {\n  constructor(___ ___ repo: Repositorio<Tarea>) {}\n}", banco:["private","readonly","static","public","abstract"], sol:["private","readonly"],
  why:"private readonly es la combinación habitual para dependencias inyectadas (lo verás en NestJS y Angular)."},
 {t:"escribe", p:"¿Qué carácter se pone tras el nombre de una propiedad para decir «confía, la inicializa otro» (<code>nombre?: string</code> no vale porque no es opcional)?",
  sol:["!"], pista:"El mismo que el operador non-null.",
  why:"Se llama definite assignment assertion: nombre!: string. Úsalo solo cuando realmente la inicialice otro código."}
]},

/* =============== U5 L2 =============== */
{
id:"ts5n1",
titulo:"Clases a fondo",
claves:["abstract define una plantilla que las subclases completan","override (con noImplicitOverride) evita sobrescribir por accidente o sin darte cuenta","private es de TypeScript; #campo, de JavaScript: elige según necesites privacidad real"],
pasos:[
 {t:"info", eti:"Herencia", h:"abstract y override",
  c:`<div class="termbox">abstract class Notificador {
  abstract enviar(destino: string, texto: string): Promise&lt;void&gt;;
  async avisar(destinos: string[], texto: string) {           // método concreto
    await Promise.all(destinos.map(d =&gt; this.enviar(d, texto)));
  }
}

class NotificadorEmail extends Notificador {
  override async enviar(destino: string, texto: string) { ... }
}

new Notificador();   // error: Cannot create an instance of an abstract class</div>
     <p>Con <code>noImplicitOverride</code>, sobrescribir un método sin escribir <code>override</code> es error. Y si escribes <code>override</code> en un método que el padre ya no tiene (porque lo renombraron), también: te enteras en vez de tener un método huérfano que nadie llama.</p>`},
 {t:"info", eti:"Privacidad", h:"private frente a #",
  c:`<div class="dg"><div class="dg-tit">dos formas de privado</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">private (TypeScript)</div><div class="dg-pila"><div class="dg-caja">Solo lo comprueba el compilador</div><div class="dg-caja aviso">En ejecución, <code>obj["clave"]</code> lo lee</div><div class="dg-caja">Se ve en <code>JSON.stringify</code> y en la consola</div></div></div>
         <div class="dg-col"><div class="dg-col-tit">#clave (JavaScript)</div><div class="dg-pila"><div class="dg-caja ok">Privado real en ejecución</div><div class="dg-caja">Inaccesible desde fuera, incluso con trucos</div><div class="dg-caja">No sale en <code>JSON.stringify</code></div></div></div>
       </div></div>
     <div class="termbox">class Sesion {
  #token: string;
  static readonly DURACION = 3600;      // miembro de la clase, no de cada instancia
  accessor intentos = 0;                // auto-accessor (get/set generados)
  constructor(token: string) { this.#token = token; }
  get caducada(): boolean { return ... } // getter tipado
}</div>`},
 {t:"opcion", p:"Guardas un token de acceso en un objeto que se puede acabar registrando en logs. ¿Qué eliges?",
  ops:["private token","#token, porque es privado de verdad y no aparece al serializar","public token","protected token"],
  ok:1, why:"private solo protege de tus compañeros al compilar; # protege en ejecución."},
 {t:"par", p:"Empareja cada palabra clave con su efecto",
  pares:[["abstract class","No se puede instanciar: solo se hereda"],["abstract método()","La subclase está obligada a implementarlo"],["override","Declara que sobrescribes un método del padre"],["static","Pertenece a la clase, no a cada instancia"],["accessor","Genera get y set para un campo"]],
  why:"abstract y override solo existen en TypeScript; static es JavaScript normal, y accessor viene de la propuesta estándar de decoradores (TypeScript lo convierte en get y set)."},
 {t:"vf", p:"Con <code>noImplicitOverride</code>, si el padre renombra un método, la subclase que lo sobrescribía con <code>override</code> deja de compilar.",
  ok:true, why:"This member cannot have an 'override' modifier because it is not declared in the base class. Justo lo que quieres saber."},
 {t:"opcion", p:"¿Qué tipo devuelve <code>donde(\"x\")</code> al llamarlo sobre un <code>ConsultaUsuarios</code>?", c:`<div class="termbox">class Consulta {
  donde(c: string): this { ...; return this; }
}
class ConsultaUsuarios extends Consulta {
  activos() { return this.donde("activo = true"); }
}
new ConsultaUsuarios().donde("x").activos();</div>`,
  ops:["Consulta: la llamada a activos() da error","ConsultaUsuarios: el tipo this se refiere a la clase real del objeto","any","void"],
  ok:1, why:"El tipo de retorno this permite APIs encadenables que conservan el tipo de la subclase."},
 {t:"hueco", p:"Completa la clase abstracta y su implementación",
  tpl:"___ class Forma {\n  abstract area(): number;\n}\nclass Cuadrado extends Forma {\n  constructor(private lado: number) { super(); }\n  ___ area() { return this.lado ** 2; }\n}", banco:["abstract","override","static","virtual","implements"], sol:["abstract","override"],
  why:"abstract en la clase y el método; override en la implementación."}
]},

/* =============== U5 L3 =============== */
{
id:"ts5l2",
titulo:"Enums y sus alternativas",
claves:["enum genera código JavaScript; las uniones de literales no","Las uniones de literales y los objetos as const suelen ser la opción preferida","erasableSyntaxOnly y el TypeScript nativo de Node no admiten enums"],
pasos:[
 {t:"info", eti:"Tres opciones", h:"Comparación",
  c:`<div class="termbox">// enum: existe en ejecución (genera un objeto)
enum Estado { Pendiente = "pendiente", Pagado = "pagado" }
const e = Estado.Pagado;

// unión de literales: sin código extra
type Estado2 = "pendiente" | "pagado";

// objeto as const: valores en ejecución + tipo derivado
const ESTADO = { Pendiente: "pendiente", Pagado: "pagado" } as const;
type Estado3 = typeof ESTADO[keyof typeof ESTADO];   // "pendiente" | "pagado"</div>
     <p>Muchos equipos evitan <code>enum</code> y usan uniones de literales. Con <code>erasableSyntaxOnly</code> (TS 5.8) o al ejecutar TypeScript directamente en Node, los enums ni siquiera están permitidos: no se pueden «borrar», generan código.</p>`},
 {t:"info", eti:"Rarezas", h:"Lo que hace un enum por dentro",
  c:`<div class="termbox">enum Prioridad { Baja, Media, Alta }        // 0, 1, 2
Prioridad[0];                               // "Baja": mapeo inverso (solo numéricos)
Object.keys(Prioridad);                     // ["0", "1", "2", "Baja", "Media", "Alta"]

let p: Prioridad = 7;                       // error desde TS 5.0
const n: number = 7;
let q: Prioridad = n;                       // compila: cualquier number vale

enum Rol { Admin = "admin" }
const r: Rol = "admin";                     // error: los enums de texto son nominales</div>
     <p>Los enums numéricos aceptan cualquier <code>number</code> no literal y tienen mapeo inverso (sorpresas al iterarlos). Los de texto son más seguros, pero son el único tipo nominal del lenguaje: <code>"admin"</code> no vale como <code>Rol.Admin</code>, lo que complica recibir datos de una API.</p>`},
 {t:"par", p:"Empareja cada opción con su característica",
  pares:[["enum numérico","Genera código, tiene mapeo inverso y acepta cualquier number"],["enum de strings","Genera un objeto y no acepta el texto literal"],["Unión de literales","Solo existe en tipos, cero coste"],["Objeto as const","Valores en ejecución y tipo derivado de ellos"]],
  why:"La opción más simple suele ser la unión de literales; si necesitas iterar los valores, el objeto o array as const."},
 {t:"opcion", p:"Necesitas un tipo para el rol del usuario y también mostrar la lista de roles en un desplegable. ¿Qué eliges?",
  ops:["Un enum numérico","Un array as const de roles y el tipo derivado con typeof ROLES[number]","any","Un string"],
  ok:1, why:"Una sola fuente de verdad para valores y tipo, sin las rarezas de los enums."},
 {t:"opcion", p:"La API devuelve <code>{ rol: \"admin\" }</code> y tu tipo es <code>enum Rol { Admin = \"admin\" }</code>. ¿Qué pasa al asignar <code>const r: Rol = datos.rol</code> si <code>datos.rol</code> es <code>string</code>?",
  ops:["Compila sin problemas","Error: string no es asignable a Rol; con una unión \"admin\" | \"editor\" bastaría con validar el texto","Se convierte automáticamente","Error en ejecución"],
  ok:1, why:"Los enums de texto son nominales: hace falta validar y convertir. Una unión de literales encaja directamente tras validar."},
 {t:"vf", p:"Un <code>const enum</code> es una buena opción en una librería compilada con herramientas que procesan fichero a fichero (<code>isolatedModules</code>).",
  ok:false, why:"const enum se sustituye por sus valores en quien lo usa, lo que exige ver otros ficheros: es incompatible con esbuild, SWC o Babel. Por eso muchos proyectos lo prohíben."},
 {t:"hueco", p:"Sustituye el enum por un objeto y su tipo",
  tpl:"const TALLA = { S: \"s\", M: \"m\", L: \"l\" } ___;\ntype Talla = (typeof TALLA)[___ typeof TALLA];", banco:["as const","keyof","readonly","number","enum"], sol:["as const","keyof"],
  why:"TALLA.M se usa como un enum y Talla es \"s\" | \"m\" | \"l\"."}
]},

/* =============== U5 L4 =============== */
{
id:"ts5l4",
titulo:"Decoradores y fusión de declaraciones",
claves:["Decoradores estándar (TS 5.0): funciones que envuelven clases, métodos, campos y accessors","NestJS y Angular siguen usando la variante antigua experimentalDecorators","Las interfaces con el mismo nombre se fusionan (declaration merging): así se amplían tipos ajenos"],
pasos:[
 {t:"info", eti:"Anotaciones", h:"Decoradores estándar",
  c:`<div class="termbox">function registrar&lt;This, Args extends unknown[], R&gt;(
  metodo: (this: This, ...args: Args) =&gt; R,
  contexto: ClassMethodDecoratorContext&lt;This, (this: This, ...args: Args) =&gt; R&gt;
) {
  return function (this: This, ...args: Args): R {
    console.log(\`→ \${String(contexto.name)}\`, args);
    return metodo.apply(this, args);
  };
}

class PedidoService {
  @registrar
  confirmar(id: number) { ... }
}</div>
     <p>Un decorador recibe lo decorado y un <b>contexto</b> (nombre, tipo, <code>addInitializer</code>...) y puede devolver un reemplazo. Es la misma idea que los decoradores de Python o las anotaciones con proxies de Spring.</p>`},
 {t:"info", eti:"Dos variantes", h:"Estándar o experimentales",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">decoradores en 2026</div><table class="dg-tabla"><thead><tr><th></th><th>estándar (TS 5.0+)</th><th>experimentalDecorators</th></tr></thead><tbody>
<tr><td>Configuración</td><td>Ninguna</td><td><code>"experimentalDecorators": true</code></td></tr>
<tr><td>Decorar parámetros</td><td>No</td><td>Sí (<code>@Inject()</code> en un constructor)</td></tr>
<tr><td>Metadatos de tipos</td><td><code>Symbol.metadata</code> (TS 5.2)</td><td><code>emitDecoratorMetadata</code> + reflect-metadata</td></tr>
<tr><td>Quién lo usa</td><td>Código nuevo, Lit, MobX</td><td>NestJS, Angular, TypeORM</td></tr>
</tbody></table></div>
     <p>No se mezclan: si tu framework pide <code>experimentalDecorators</code>, úsalo en todo el proyecto.</p>`},
 {t:"info", eti:"Ampliar tipos", h:"Declaration merging",
  c:`<div class="termbox">// ampliar el objeto Request de Express con el usuario autenticado
declare global {
  namespace Express {
    interface Request { usuario?: { id: string; rol: "admin" | "usuario" } }
  }
}

// ampliar un módulo ajeno (module augmentation)
declare module "vue" {
  interface ComponentCustomProperties { $formatear: (n: number) =&gt; string }
}</div>
     <p>El fichero que contiene estas declaraciones debe ser un módulo (con algún <code>import</code> o <code>export {}</code>) y estar incluido en la compilación.</p>`},
 {t:"par", p:"Empareja cada elemento con su uso",
  pares:[["@Decorador en un método","Envolver el método con lógica extra (logs, caché, permisos)"],["experimentalDecorators","Variante antigua usada por NestJS y Angular"],["declare global","Añadir tipos al ámbito global"],["declare module \"x\"","Ampliar los tipos de un paquete concreto"],["Fusión de interfaces","Sumar propiedades a una interfaz ya existente"]],
  why:"Ampliar Request de Express es el uso más habitual de la fusión de declaraciones."},
 {t:"vf", p:"Dos declaraciones <code>interface Usuario</code> en el mismo ámbito se combinan en una sola.",
  ok:true, why:"Con type daría error de identificador duplicado. Por eso las librerías exponen interfaces cuando quieren que las amplíes."},
 {t:"opcion", p:"Añades <code>req.usuario</code> con <code>declare global</code> en <code>src/tipos/express.d.ts</code>, pero el compilador sigue diciendo <i>Property 'usuario' does not exist</i>. ¿Qué es lo primero que miras?",
  ops:["Reinstalar Express","Que el fichero esté incluido en el tsconfig (include) y que sea un módulo con export {} o un import","Cambiar interface por type","Activar experimentalDecorators"],
  ok:1, why:"Es el fallo más común: el .d.ts no entra en la compilación o, al no ser módulo, declare global no se interpreta como ampliación."},
 {t:"escribe", p:"¿Qué opción del <code>tsconfig</code> necesitas activar para usar los decoradores de NestJS (<code>@Controller</code>, <code>@Inject</code>...)?",
  sol:["experimentalDecorators","\"experimentalDecorators\": true","experimentalDecorators: true"], pista:"La variante antigua de los decoradores.",
  why:"NestJS la necesita (junto con emitDecoratorMetadata para la inyección de dependencias por tipo). La plantilla de nest new ya las trae activadas."}
]}

]});
