window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "El sistema de tipos avanzado",
resumen: "Tipos condicionales e infer, tipos mapeados, template literal types, tipos recursivos y branded types",
nivel: "Experto",
color: "#2f6bb2",
lecciones: [

{
id:"ts7l1",
titulo:"Tipos condicionales e infer",
claves:["T extends U ? X : Y elige un tipo según una condición","infer captura una parte de un tipo dentro de la condición","Sobre uniones, los condicionales se distribuyen"],
pasos:[
 {t:"info", eti:"Lógica en los tipos", h:"Tipos condicionales",
  c:`<div class="termbox">type EsTexto&lt;T&gt; = T extends string ? "si" : "no";
type A = EsTexto&lt;"hola"&gt;;      // "si"
type B = EsTexto&lt;42&gt;;          // "no"

// infer: extraer una parte
type ElementoDe&lt;T&gt; = T extends (infer E)[] ? E : never;
type X = ElementoDe&lt;string[]&gt;;           // string

type Desenvolver&lt;T&gt; = T extends Promise&lt;infer V&gt; ? V : T;
type Y = Desenvolver&lt;Promise&lt;number&gt;&gt;;   // number

// distribucion sobre uniones
type SoloTextos&lt;T&gt; = T extends string ? T : never;
type Z = SoloTextos&lt;"a" | 1 | "b"&gt;;       // "a" | "b"</div>
     <p>Así están construidos utilitarios como <code>ReturnType</code>, <code>Awaited</code> o <code>Exclude</code>.</p>`},
 {t:"par", p:"Empareja cada tipo con su resultado",
  pares:[["Exclude<\"a\" | \"b\" | \"c\", \"a\">","\"b\" | \"c\""],["Extract<string | number, number>","number"],["ElementoDe<boolean[]>","boolean"],["Desenvolver<Promise<string>>","string"]],
  why:"Exclude&lt;T, U&gt; es literalmente T extends U ? never : T."},
 {t:"opcion", p:"¿Qué hace <code>infer</code>?",
  ops:["Infiere el tipo de una variable","Dentro de un tipo condicional, declara una variable de tipo que captura la parte que coincide","Convierte any en unknown","Nada, es decorativo"],
  ok:1, why:"Es como un patrón con captura, pero para tipos."}
]},

{
id:"ts7l2",
titulo:"Tipos mapeados y template literals",
claves:["{ [K in keyof T]: ... } recorre las propiedades de un tipo","Modificadores: -? quita el opcional, -readonly quita el readonly; as renombra claves","Template literal types combinan textos a nivel de tipos"],
pasos:[
 {t:"info", eti:"Recorrer propiedades", h:"Tipos mapeados",
  c:`<div class="termbox">type Opcional&lt;T&gt; = { [K in keyof T]?: T[K] };          // asi es Partial
type Mutable&lt;T&gt;  = { -readonly [K in keyof T]: T[K] };

type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string &amp; K&gt;}\`]: () =&gt; T[K];
};
type G = Getters&lt;{ nombre: string; edad: number }&gt;;
// { getNombre: () =&gt; string; getEdad: () =&gt; number }

type Evento = "click" | "hover";
type Manejador = \`on\${Capitalize&lt;Evento&gt;}\`;           // "onClick" | "onHover"
type RutaApi = \`/api/\${"tareas" | "usuarios"}/\${number}\`;</div>`},
 {t:"par", p:"Empareja cada construcción con su efecto",
  pares:[["[K in keyof T]","Recorrer cada propiedad de T"],["-?","Hacer obligatoria la propiedad"],["as `get${...}`","Renombrar las claves"],["`on${Capitalize<E>}`","Construir textos a partir de otros tipos"]],
  why:"Librerías como Prisma, tRPC o React Hook Form usan estas técnicas para tipos precisos."},
 {t:"opcion", p:"¿Qué tipo resulta de <code>`${\"get\" | \"set\"}Nombre`</code>?",
  ops:["string","\"getNombre\" | \"setNombre\"","\"get | setNombre\"","Error"],
  ok:1, why:"Los template literal types se distribuyen sobre las uniones."}
]},

{
id:"ts7l3",
titulo:"Tipos recursivos y branded types",
claves:["Un tipo puede referirse a sí mismo: JSON, árboles, DeepPartial","Branded types distinguen valores con la misma forma (UsuarioId frente a PedidoId)","No abuses: tipos demasiado ingeniosos son difíciles de mantener"],
pasos:[
 {t:"info", eti:"Estructuras anidadas", h:"Recursivos",
  c:`<div class="termbox">type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

type DeepPartial&lt;T&gt; = { [K in keyof T]?: T[K] extends object ? DeepPartial&lt;T[K]&gt; : T[K] };

interface Categoria { nombre: string; hijas: Categoria[] }</div>`},
 {t:"info", eti:"Distinguir lo igual", h:"Branded types",
  c:`<div class="termbox">type UsuarioId = number &amp; { readonly __marca: "UsuarioId" };
type PedidoId  = number &amp; { readonly __marca: "PedidoId" };

const usuarioId = (n: number) =&gt; n as UsuarioId;

function cancelarPedido(id: PedidoId) { ... }
cancelarPedido(usuarioId(7));     // error: un UsuarioId no es un PedidoId</div>
     <p>Evita el error clásico de pasar un id de otra entidad, que con <code>number</code> a secas compilaría.</p>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["Tipo recursivo","Estructuras anidadas de profundidad variable"],["Branded type","Evitar mezclar valores del mismo tipo base"],["DeepPartial","Configuraciones anidadas parciales"],["satisfies","Comprobar que un valor cumple un tipo sin perder su tipo literal"]],
  why:"const config = {...} satisfies Config valida y conserva los literales exactos."},
 {t:"vf", p:"Cuanto más complejo sea un tipo, mejor es el código.",
  ok:false, why:"Los tipos deben ayudar a leer y a evitar errores. Si nadie entiende un tipo, es deuda técnica."}
]}

]});
