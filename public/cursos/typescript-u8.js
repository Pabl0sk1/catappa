window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "El sistema de tipos avanzado",
resumen: "Tipos condicionales, infer y distribución, tipos mapeados con renombrado de claves, template literal types, tipos recursivos y branded types",
nivel: "Experto",
color: "#2f6bb2",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"ts7l1",
titulo:"Tipos condicionales e infer",
claves:["T extends U ? X : Y elige un tipo según una condición","infer captura una parte de un tipo dentro de la condición","Sobre una unión desnuda, el condicional se distribuye; [T] extends [U] lo evita"],
pasos:[
 {t:"info", eti:"Lógica en los tipos", h:"Tipos condicionales",
  c:`<div class="termbox">type EsTexto&lt;T&gt; = T extends string ? "si" : "no";
type A = EsTexto&lt;"hola"&gt;;      // "si"
type B = EsTexto&lt;42&gt;;          // "no"

// infer: extraer una parte
type ElementoDe&lt;T&gt; = T extends (infer E)[] ? E : never;
type X = ElementoDe&lt;string[]&gt;;                    // string

type Desenvolver&lt;T&gt; = T extends Promise&lt;infer V&gt; ? Desenvolver&lt;V&gt; : T;
type Y = Desenvolver&lt;Promise&lt;Promise&lt;number&gt;&gt;&gt;;  // number

type MiReturnType&lt;F&gt; = F extends (...args: any[]) =&gt; infer R ? R : never;
type Primero&lt;T&gt; = T extends [infer P, ...unknown[]] ? P : never;</div>
     <p>Así están construidos <code>ReturnType</code>, <code>Awaited</code>, <code>Exclude</code> o <code>Parameters</code>. <code>extends</code> aquí significa «es asignable a», igual que en las restricciones.</p>`},
 {t:"info", eti:"Por dentro", h:"Distribución sobre uniones",
  c:`<div class="dg"><div class="dg-tit">EsTexto&lt;"a" | 1&gt; se evalúa miembro a miembro</div>
       <div class="dg-flujo"><div class="dg-caja acento"><code>"a" | 1</code></div><div class="dg-caja doble"><code>EsTexto&lt;"a"&gt; | EsTexto&lt;1&gt;</code><small>se reparte</small></div><div class="dg-caja ok"><code>"si" | "no"</code></div></div>
     </div>
     <div class="termbox">type SoloTextos&lt;T&gt; = T extends string ? T : never;
type Z = SoloTextos&lt;"a" | 1 | "b"&gt;;       // "a" | "b"   (así funciona Exclude)

type EsTextoEntero&lt;T&gt; = [T] extends [string] ? "si" : "no";
type W = EsTextoEntero&lt;"a" | 1&gt;;         // "no": se evalúa la unión entera

type EsNever&lt;T&gt; = [T] extends [never] ? true : false;   // sin corchetes, EsNever&lt;never&gt; daría never</div>
     <p>Solo se distribuye cuando el tipo comprobado es un parámetro «desnudo» (<code>T extends</code>). Y <code>never</code> es la unión vacía: distribuir sobre ella da <code>never</code>.</p>`},
 {t:"par", p:"Empareja cada tipo con su resultado",
  pares:[["Exclude<\"a\" | \"b\" | \"c\", \"a\">","\"b\" | \"c\""],["Extract<string | number, number>","number"],["ElementoDe<boolean[]>","boolean"],["Desenvolver<Promise<string>>","string"],["EsTexto<\"x\" | 2>","\"si\" | \"no\""]],
  why:"Exclude&lt;T, U&gt; es literalmente T extends U ? never : T, distribuido."},
 {t:"opcion", p:"¿Qué hace <code>infer</code>?",
  ops:["Infiere el tipo de una variable","Dentro de un tipo condicional, declara una variable de tipo que captura la parte que coincide","Convierte any en unknown","Nada, es decorativo"],
  ok:1, why:"Es como un patrón con captura, pero para tipos."},
 {t:"opcion", p:"¿Qué da <code>EsTextoEntero&lt;string | number&gt;</code> con <code>type EsTextoEntero&lt;T&gt; = [T] extends [string] ? \"si\" : \"no\"</code>?",
  ops:["\"si\" | \"no\"","\"no\"","\"si\"","never"],
  ok:1, why:"Al envolver en tupla, se pregunta si la unión completa es asignable a string: no lo es."},
 {t:"hueco", p:"Extrae el tipo de los argumentos de una función (como Parameters)",
  tpl:"type Args<F> = F ___ (...args: ___ A) => any ? A : never;", banco:["extends","infer","keyof","typeof","is"], sol:["extends","infer"],
  why:"El condicional compara con la forma de una función y captura la tupla de argumentos."},
 {t:"escribe", p:"¿Qué tipo resulta de <code>type R = Primero&lt;[boolean, string]&gt;</code>, con el Primero del ejemplo?",
  sol:["boolean"], pista:"Captura el primer elemento de la tupla.",
  why:"[infer P, ...unknown[]] encaja con cualquier tupla de al menos un elemento y captura el primero."}
]},

/* =============== U8 L2 =============== */
{
id:"ts7l2",
titulo:"Tipos mapeados",
claves:["{ [K in keyof T]: ... } recorre las propiedades de un tipo","Modificadores: +/- readonly y +/- ? añaden o quitan","as renombra o filtra claves (devolver never elimina la propiedad)"],
pasos:[
 {t:"info", eti:"Recorrer propiedades", h:"Tipos mapeados",
  c:`<div class="termbox">type Opcional&lt;T&gt; = { [K in keyof T]?: T[K] };          // así es Partial
type Obligatorio&lt;T&gt; = { [K in keyof T]-?: T[K] };     // así es Required
type Mutable&lt;T&gt; = { -readonly [K in keyof T]: T[K] };

type Banderas&lt;T&gt; = { [K in keyof T]: boolean };
type CamposTocados = Banderas&lt;Formulario&gt;;          // { email: boolean; clave: boolean }

type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string &amp; K&gt;}\`]: () =&gt; T[K];
};
type G = Getters&lt;{ nombre: string; edad: number }&gt;;
// { getNombre: () =&gt; string; getEdad: () =&gt; number }

type SoloDatos&lt;T&gt; = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };</div>
     <p>Los tipos mapeados sobre <code>keyof T</code> son «homomórficos»: conservan los <code>readonly</code> y <code>?</code> originales salvo que los cambies. El <code>string &amp; K</code> hace falta porque las claves también pueden ser number o symbol.</p>`},
 {t:"info", eti:"Caso real", h:"Errores de un formulario",
  c:`<div class="termbox">interface Registro { email: string; clave: string; edad: number }

type Errores&lt;T&gt; = { [K in keyof T]?: string };
type Validadores&lt;T&gt; = { [K in keyof T]: (valor: T[K]) =&gt; string | undefined };

const validar: Validadores&lt;Registro&gt; = {
  email: v =&gt; v.includes("@") ? undefined : "Email no válido",   // v: string
  clave: v =&gt; v.length &gt;= 12 ? undefined : "Mínimo 12 caracteres",
  edad:  v =&gt; v &gt;= 18 ? undefined : "Debes ser mayor de edad",    // v: number
};</div>
     <p>Si añades un campo a <code>Registro</code>, el compilador te pedirá su validador. Así funcionan por dentro librerías como React Hook Form.</p>`},
 {t:"par", p:"Empareja cada construcción con su efecto",
  pares:[["[K in keyof T]","Recorrer cada propiedad de T"],["-?","Hacer obligatoria la propiedad"],["-readonly","Quitar el solo lectura"],["as `get${...}`","Renombrar las claves"],["as ... ? never : K","Filtrar claves"]],
  why:"Librerías como Prisma, tRPC o React Hook Form usan estas técnicas para tipos precisos."},
 {t:"opcion", p:"¿Qué tipo es <code>SoloDatos&lt;{ id: number; guardar(): void }&gt;</code>?",
  ops:["{ id: number; guardar(): void }","{ id: number }","{ guardar(): void }","never"],
  ok:1, why:"Para guardar, la condición devuelve never y la clave desaparece."},
 {t:"opcion", p:"¿Qué tipo tiene el parámetro <code>v</code> del validador de <code>edad</code>?",
  ops:["string","number, porque el tipo mapeado usa T[K] para cada clave","unknown","any"],
  ok:1, why:"Cada propiedad recibe su propio tipo: es tipado contextual a partir del tipo mapeado."},
 {t:"hueco", p:"Implementa Readonly a mano",
  tpl:"type SoloLectura<T> = { ___ [K ___ keyof T]: T[K] };", banco:["readonly","in","of","-readonly","extends"], sol:["readonly","in"],
  why:"Es exactamente la definición de Readonly en lib.es5.d.ts."},
 {t:"vf", p:"Un tipo mapeado puede eliminar propiedades devolviendo <code>never</code> en la cláusula <code>as</code>.",
  ok:true, why:"Una clave never no existe: es la forma de filtrar propiedades por su tipo."}
]},

/* =============== U8 L3 =============== */
{
id:"ts8n2",
titulo:"Template literal types",
claves:["`prefijo${Tipo}` construye tipos de texto a partir de otros tipos","Sobre uniones generan el producto de todas las combinaciones","Con infer permiten analizar textos: parámetros de rutas, nombres de eventos"],
pasos:[
 {t:"info", eti:"Textos tipados", h:"Construir textos",
  c:`<div class="termbox">type Evento = "click" | "hover";
type Manejador = \`on\${Capitalize&lt;Evento&gt;}\`;           // "onClick" | "onHover"

type Talla = "s" | "m"; type Color = "rojo" | "azul";
type Variante = \`\${Talla}-\${Color}\`;                  // 4 combinaciones

type Pixeles = \`\${number}px\`;
const ancho: Pixeles = "120px";      // OK
const alto: Pixeles = "10em";        // error

type RutaApi = \`/api/\${"tareas" | "usuarios"}/\${number}\`;</div>
     <p>Utilitarios de texto incluidos: <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code> y <code>Uncapitalize</code>.</p>`},
 {t:"info", eti:"Analizar textos", h:"infer dentro de un texto",
  c:`<div class="termbox">type Params&lt;S extends string&gt; =
  S extends \`\${string}:\${infer P}/\${infer Resto}\` ? P | Params&lt;\`/\${Resto}\`&gt;
  : S extends \`\${string}:\${infer P}\` ? P
  : never;

type P = Params&lt;"/usuarios/:id/pedidos/:pedidoId"&gt;;   // "id" | "pedidoId"

function ruta&lt;S extends string&gt;(patron: S, params: Record&lt;Params&lt;S&gt;, string&gt;) { ... }
ruta("/usuarios/:id", { id: "7" });      // OK
ruta("/usuarios/:id", { uid: "7" });     // error: falta id</div>
     <p>Es lo que hacen los routers tipados (Express 5, Hono, TanStack Router) para que los parámetros de la URL estén tipados sin escribirlos dos veces.</p>`},
 {t:"opcion", p:"¿Qué tipo resulta de <code>`${\"get\" | \"set\"}Nombre`</code>?",
  ops:["string","\"getNombre\" | \"setNombre\"","\"get | setNombre\"","Error"],
  ok:1, why:"Los template literal types se distribuyen sobre las uniones."},
 {t:"opcion", p:"¿Cuántos miembros tiene <code>`${\"a\" | \"b\" | \"c\"}-${1 | 2}`</code>?",
  ops:["5","6","2","1"],
  ok:1, why:"Producto cartesiano: 3 × 2. Cuidado con uniones grandes: el número de combinaciones crece muy rápido."},
 {t:"par", p:"Empareja cada tipo con un valor válido",
  pares:[["`${number}px`","\"16px\""],["`on${Capitalize<\"cambio\">}`","\"onCambio\""],["Uppercase<\"get\">","\"GET\""],["`#${string}`","\"#ff8800\""]],
  why:"Útiles para CSS, nombres de eventos, claves de caché o rutas."},
 {t:"hueco", p:"Construye el nombre del evento de cambio de cada campo",
  tpl:"type Campos = \"email\" | \"clave\";\ntype EventoCambio = `${Campos}___`;   // \"emailCambiado\" | \"claveCambiada\"... casi\ntype Setter = `set${___<Campos>}`;   // \"setEmail\" | \"setClave\"", banco:["Cambiado","Capitalize","Uppercase","string","keyof"], sol:["Cambiado","Capitalize"],
  why:"Texto fijo dentro de la plantilla y Capitalize para la mayúscula inicial."},
 {t:"vf", p:"Un template literal type puede comprobar en ejecución que un texto tiene el formato indicado.",
  ok:false, why:"Como todo tipo, se borra al compilar: solo comprueba literales conocidos en el código. Un texto que llega de fuera hay que validarlo."}
]},

/* =============== U8 L4 =============== */
{
id:"ts7l3",
titulo:"Tipos recursivos",
claves:["Un tipo puede referirse a sí mismo: JSON, árboles, DeepPartial, rutas de objetos","La recursión de tipos tiene límites: «Type instantiation is excessively deep»","No abuses: tipos demasiado ingeniosos son difíciles de leer, mantener y compilar"],
pasos:[
 {t:"info", eti:"Estructuras anidadas", h:"Recursivos",
  c:`<div class="termbox">type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

interface Categoria { nombre: string; hijas: Categoria[] }

type DeepPartial&lt;T&gt; = { [K in keyof T]?: T[K] extends object ? DeepPartial&lt;T[K]&gt; : T[K] };
type DeepReadonly&lt;T&gt; = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly&lt;T[K]&gt; : T[K] };

// todas las rutas "a.b.c" de un objeto
type Ruta&lt;T&gt; = T extends object
  ? { [K in keyof T &amp; string]: K | \`\${K}.\${Ruta&lt;T[K]&gt;}\` }[keyof T &amp; string]
  : never;
type R = Ruta&lt;{ db: { host: string; puerto: number }; debug: boolean }&gt;;
// "db" | "db.host" | "db.puerto" | "debug"</div>`},
 {t:"info", eti:"Límites", h:"Cuando el compilador dice basta",
  c:`<div class="termbox">error TS2589: Type instantiation is excessively deep and possibly infinite.</div>
     <p>El compilador corta la recursión (del orden de 50 niveles de instanciación, hasta 1000 en condicionales con recursión de cola). Si ves este error, el tipo es demasiado ambicioso: limita la profundidad, simplifica o renuncia a tiparlo todo. Además, los tipos recursivos grandes hacen lento el editor para todo el equipo.</p>
     <div class="nota ojo"><b class="tit">La prueba de los tres meses</b>Si en tres meses nadie del equipo entiende un tipo, es deuda técnica. A menudo un tipo algo menos preciso y legible es mejor ingeniería.</div>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["Tipo recursivo","Estructuras anidadas de profundidad variable"],["DeepPartial","Configuraciones anidadas parciales (valores por defecto)"],["Ruta<T>","Claves con puntos para un get(obj, \"db.host\") tipado"],["Json","Describir cualquier valor que JSON.stringify admite"]],
  why:"Los tipos recursivos modelan datos recursivos: no los uses para programar en el sistema de tipos por diversión."},
 {t:"opcion", p:"¿Compila?", c:`<div class="termbox">type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
const j: Json = { creado: new Date() };</div>`,
  ops:["Sí","No: Date no es ninguno de los tipos de Json","Sí, Date se convierte en texto","Solo sin strict"],
  ok:1, why:"Date es un objeto con métodos, no un { [k: string]: Json }. JSON.stringify lo convertiría a texto, pero el tipo no lo acepta: tendrías que guardar la fecha como string."},
 {t:"opcion", p:"Un tipo recursivo que has escrito da <i>Type instantiation is excessively deep and possibly infinite</i>. ¿Qué haces?",
  ops:["Subir un límite en el tsconfig","Simplificar: limitar la profundidad, cortar la recursión o aceptar un tipo menos preciso","Añadir as any en todas partes","Cambiar a TypeScript 7, que no tiene límite"],
  ok:1, why:"El límite no es configurable y existe por buenos motivos: rendimiento y terminación."},
 {t:"vf", p:"<code>Readonly&lt;T&gt;</code> hace inmutables también los objetos anidados.",
  ok:false, why:"Es superficial. Para todos los niveles hace falta un DeepReadonly recursivo."},
 {t:"escribe", p:"¿Qué tipo resulta de <code>Ruta&lt;{ a: { b: number } }&gt;</code> con el Ruta del ejemplo? (escribe la unión)",
  sol:["\"a\" | \"a.b\"","'a' | 'a.b'","\"a.b\" | \"a\"","\"a\"|\"a.b\"","a | a.b"], pista:"La clave de primer nivel y la anidada con punto.",
  why:"Para cada clave K: K y K seguido de las rutas de su valor. b es number, así que Ruta&lt;number&gt; es never y no añade nada."}
]},

/* =============== U8 L5 =============== */
{
id:"ts8n3",
titulo:"Branded types",
claves:["El tipado estructural no distingue un UsuarioId de un PedidoId si ambos son number","Una marca (brand) crea un tipo nominal: number &amp; { [marca]: \"UsuarioId\" }","La marca se pone al validar: el valor marcado demuestra que se comprobó"],
pasos:[
 {t:"info", eti:"Distinguir lo igual", h:"Tipos con marca",
  c:`<div class="termbox">declare const marca: unique symbol;
type Marca&lt;T, M extends string&gt; = T &amp; { readonly [marca]: M };

type UsuarioId = Marca&lt;number, "UsuarioId"&gt;;
type PedidoId  = Marca&lt;number, "PedidoId"&gt;;

function cancelarPedido(id: PedidoId) { ... }

const uid = 7 as UsuarioId;
cancelarPedido(uid);     // error: un UsuarioId no es un PedidoId
cancelarPedido(7);       // error: un number cualquiera tampoco
const n: number = uid;   // OK: sigue siendo un número</div>
     <p>En ejecución es un número normal: la marca solo existe en el tipo. Evita el error clásico de pasar el id de otra entidad, que con <code>number</code> a secas compilaría.</p>`},
 {t:"info", eti:"Patrón", h:"Marcar al validar",
  c:`<div class="termbox">type Email = Marca&lt;string, "Email"&gt;;

function parsearEmail(texto: string): Email | null {
  return /^[^@\\s]+@[^@\\s]+$/.test(texto) ? (texto as Email) : null;
}

function enviarBienvenida(destino: Email) { ... }   // imposible pasar un texto sin validar

// con Zod:  const Email = z.string().email().brand&lt;"Email"&gt;();</div>
     <p>El único <code>as</code> vive dentro de la función que valida. El resto del código recibe la garantía en el tipo: «esto ya se comprobó». Es la idea de <i>parse, don't validate</i>.</p>`},
 {t:"opcion", p:"¿Qué problema resuelven los branded types?",
  ops:["El rendimiento de los números","Que valores con la misma forma pero distinto significado (ids de entidades, euros y céntimos, texto validado y sin validar) se puedan mezclar sin error","Los errores de null","La serialización a JSON"],
  ok:1, why:"El tipado estructural es cómodo, pero a veces necesitas que dos tipos iguales no sean intercambiables."},
 {t:"opcion", p:"¿Qué tipo tiene <code>total</code>?", c:`<div class="termbox">type Euros = Marca&lt;number, "Euros"&gt;;
const total = euros(10) + euros(5);</div>`,
  ops:["Euros","number: las operaciones aritméticas devuelven number y la marca se pierde","never","Marca&lt;number, \"Euros\"&gt;"],
  ok:1, why:"Hay que volver a marcar el resultado (euros(a + b)). Por eso las marcas encajan mejor en identificadores y valores validados que en cantidades con mucha aritmética."},
 {t:"vf", p:"Un branded type añade una propiedad al valor en tiempo de ejecución.",
  ok:false, why:"La propiedad solo existe en el tipo (por eso se declara con declare const y unique symbol). El valor es un número o texto normal."},
 {t:"par", p:"Empareja cada problema con la técnica que lo evita",
  pares:[["Pasar un UsuarioId donde se espera un PedidoId","Branded types"],["Olvidar tratar un estado nuevo","Unión discriminada con comprobación never"],["Enviar un email a un texto sin validar","Marca asignada por la función que valida"],["Mezclar céntimos y euros","Marcas Centimos y Euros distintas"]],
  why:"Cada técnica convierte un error que solo verías en producción en un error de compilación."},
 {t:"hueco", p:"Completa la definición de la marca",
  tpl:"declare const marca: ___ symbol;\ntype Marca<T, M extends string> = T ___ { readonly [marca]: M };", banco:["unique","&","|","readonly","keyof"], sol:["unique","&"],
  why:"unique symbol garantiza que nadie más puede fabricar esa clave; la intersección añade la marca al tipo base."}
]}

]});
