window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Módulos y declaraciones",
resumen: "Módulos ES, import type y verbatimModuleSyntax, resolución de módulos con nodenext y bundler, ESM frente a CommonJS, ficheros .d.ts, DefinitelyTyped y publicar tipos",
nivel: "Avanzado",
color: "#3b77bf",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"ts5l3",
titulo:"Módulos ES e import type",
claves:["Cada fichero con import o export es un módulo con su propio ámbito","import type importa solo tipos y se borra al compilar; verbatimModuleSyntax lo exige","Con module nodenext, los imports relativos llevan extensión .js (o .ts con rewriteRelativeImportExtensions)"],
pasos:[
 {t:"info", eti:"Organizar código", h:"Módulos",
  c:`<div class="termbox">// tipos.ts
export interface Tarea { id: number; titulo: string }
export type Estado = "pendiente" | "hecha";
export const ESTADOS: Estado[] = ["pendiente", "hecha"];

// app.ts
import type { Tarea } from "./tipos.js";      // solo tipo: desaparece del .js
import { ESTADOS, type Estado } from "./tipos.js";   // valor + tipo en la misma línea
export default function crear(titulo: string): Tarea { ... }</div>
     <p>¿Por qué <code>./tipos.js</code> si el fichero es <code>tipos.ts</code>? Porque TypeScript no reescribe las rutas: el JavaScript generado importará <code>tipos.js</code>, que es lo que existirá en <code>dist/</code>. Con <code>module: nodenext</code> es obligatorio poner la extensión, como exige Node en ESM.</p>`},
 {t:"info", eti:"Opciones clave", h:"verbatimModuleSyntax e isolatedModules",
  c:`<div class="termbox">{ "compilerOptions": { "verbatimModuleSyntax": true, "isolatedModules": true } }

import { Tarea } from "./tipos.js";
// error TS1484: 'Tarea' is a type and must be imported using a type-only import
//               when 'verbatimModuleSyntax' is enabled.</div>
     <p>Las herramientas rápidas (esbuild, SWC, Node) transforman <b>fichero a fichero</b> sin mirar los demás: no pueden saber si <code>Tarea</code> es un tipo o un valor. Con <code>verbatimModuleSyntax</code>, lo que no lleva <code>type</code> se queda en el JavaScript tal cual, así que el compilador te obliga a marcarlo. Resultado: el código se comporta igual lo compile quien lo compile.</p>
     <div class="nota dato"><b class="tit">Importar .ts directamente</b>Si ejecutas con Node sin compilar, puedes escribir <code>import "./tipos.ts"</code> con <code>allowImportingTsExtensions</code> (y sin emitir), o con <code>rewriteRelativeImportExtensions</code> (TS 5.7), que convierte <code>.ts</code> en <code>.js</code> al compilar.</div>`},
 {t:"opcion", p:"Con <code>module: nodenext</code> y un proyecto ESM, escribes <code>import { x } from \"./util\"</code>. ¿Qué pasa?",
  ops:["Compila y funciona","Error TS2835: los imports relativos necesitan extensión explícita; ¿quisiste decir './util.js'?","TypeScript añade la extensión al compilar","Solo falla en Windows"],
  ok:1, why:"Node en ESM no adivina extensiones. Con un bundler (moduleResolution: bundler) sí puedes omitirla, porque el bundler resuelve."},
 {t:"par", p:"Empareja cada forma de importar con su efecto",
  pares:[["import type { A } from \"./a.js\"","Solo el tipo; se borra al compilar"],["import { type A, b } from \"./a.js\"","El valor b se queda; el tipo A se borra"],["import { A } from \"./a.js\" (A es tipo)","Error con verbatimModuleSyntax"],["import \"./polyfill.js\"","Solo ejecuta el módulo por sus efectos"]],
  why:"Marcar los tipos con type deja claro qué importaciones existen en ejecución."},
 {t:"vf", p:"Con <code>verbatimModuleSyntax</code>, un <code>import type</code> aparece en el JavaScript generado.",
  ok:false, why:"Todo lo marcado como type se borra; lo demás se deja exactamente como está."},
 {t:"hueco", p:"Importa el valor <code>crearTarea</code> y el tipo <code>Tarea</code> en una sola línea compatible con verbatimModuleSyntax",
  tpl:"import { crearTarea, ___ Tarea } from \"./tareas___\";", banco:["type",".js","typeof",".ts.d","as"], sol:["type",".js"],
  why:"El modificador type en línea y la extensión .js que tendrá el fichero compilado."},
 {t:"opcion", p:"¿Por qué existe <code>isolatedModules</code>?",
  ops:["Para compilar más lento pero mejor","Para avisar de construcciones que una herramienta que compila fichero a fichero (esbuild, SWC, Babel, Node) no puede transformar bien, como re-exportar un tipo sin type o usar const enum","Para prohibir los imports","Para aislar los tests"],
  ok:1, why:"Si tu código se compila con Vite, Next.js o Node directamente, necesitas esa garantía."}
]},

/* =============== U6 L2 =============== */
{
id:"ts6n1",
titulo:"Resolución de módulos: nodenext y bundler",
claves:["module y moduleResolution dicen cómo se buscan los imports: nodenext para Node, bundler para Vite y similares","El campo type de package.json y la extensión (.mts, .cts) deciden si un fichero es ESM o CommonJS","paths crea alias de importación; baseUrl y moduleResolution node desaparecen en TypeScript 7"],
pasos:[
 {t:"info", eti:"Dónde busca", h:"Dos estrategias modernas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué configuración usar</div><table class="dg-tabla"><thead><tr><th>tu código se ejecuta con...</th><th>module</th><th>moduleResolution</th></tr></thead><tbody>
<tr><td>Node (API, CLI, librería para Node)</td><td><code>nodenext</code></td><td><code>nodenext</code> (implícito)</td></tr>
<tr><td>Vite, webpack, esbuild, Next.js</td><td><code>esnext</code> o <code>preserve</code></td><td><code>bundler</code></td></tr>
<tr><td>Bun o Deno</td><td><code>preserve</code> / <code>esnext</code></td><td><code>bundler</code></td></tr>
</tbody></table></div>
     <p><code>nodenext</code> imita exactamente lo que hará Node: extensiones obligatorias en ESM, respeto al campo <code>exports</code> de los paquetes y a sus condiciones. <code>bundler</code> es más permisivo (sin extensiones) porque el bundler resolverá después. El valor antiguo <code>moduleResolution: node</code> (node10) se deprecó en 6.0 y ya no existe en 7.0.</p>`},
 {t:"info", eti:"ESM y CommonJS", h:"¿Qué es cada fichero?",
  c:`<div class="dg"><div class="dg-tit">cómo decide node el formato</div>
       <div class="dg-fila"><div class="dg-caja doble"><code>.mts</code> / <code>.mjs</code><small>siempre ESM</small></div><div class="dg-caja doble"><code>.cts</code> / <code>.cjs</code><small>siempre CommonJS</small></div><div class="dg-caja acento doble"><code>.ts</code> / <code>.js</code><small>según "type" del package.json más cercano</small></div></div>
       <div class="dg-nota arriba">"type": "module" → ESM · sin type o "commonjs" → CommonJS</div>
     </div>
     <div class="termbox">// alias de importación (sin baseUrl: las rutas son relativas al tsconfig)
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }

import { db } from "@/infra/db.js";</div>
     <div class="nota ojo"><b class="tit">paths no reescribe nada</b><code>paths</code> solo le dice al compilador dónde buscar. En ejecución, alguien más tiene que entender el alias: el bundler, o los <code>imports</code> de package.json (<code>"#infra/*"</code>) en Node.</div>`},
 {t:"par", p:"Empareja cada situación con su configuración",
  pares:[["API con Express ejecutada por Node","module: nodenext"],["SPA de React con Vite","moduleResolution: bundler"],["Fichero que debe ser CommonJS en un paquete ESM","Extensión .cts"],["Alias @/ para importar desde src","paths en el tsconfig"]],
  why:"La regla: configura la resolución según lo que ejecutará el código de verdad."},
 {t:"opcion", p:"Actualizas a TypeScript 7 y aparece <i>Option 'baseUrl' has been removed</i>. Usabas baseUrl para importar <code>\"utils/fecha\"</code> desde <code>src/utils/fecha.ts</code>. ¿Qué haces?",
  ops:["Bajar a TypeScript 5","Quitar baseUrl y declarar el alias en paths, por ejemplo \"utils/*\": [\"./src/utils/*\"] (o \"*\": [\"./src/*\"])","Añadir ignoreDeprecations: \"7.0\"","Renombrar los ficheros a .mts"],
  ok:1, why:"En 6.0 bastaba ignoreDeprecations: \"6.0\" para seguir; en 7.0 la opción ya no existe. El propio mensaje sugiere paths con \"*\"."},
 {t:"vf", p:"Con <code>moduleResolution: bundler</code> puedes omitir la extensión en los imports relativos.",
  ok:true, why:"El bundler resolverá la ruta. Pero si ese código lo ejecuta Node sin bundler, fallará: por eso las librerías y APIs de Node usan nodenext."},
 {t:"opcion", p:"Tu paquete tiene <code>\"type\": \"module\"</code>. ¿Qué formato tiene <code>src/config.ts</code> para <code>module: nodenext</code>?",
  ops:["CommonJS","ESM, porque .ts sigue al campo type del package.json más cercano","Depende del target","Los dos a la vez"],
  ok:1, why:"Es la misma regla que aplica Node a los .js."},
 {t:"escribe", p:"¿Qué valor de <code>moduleResolution</code> usas en un frontend compilado con Vite?",
  sol:["bundler","\"bundler\""], pista:"El nombre describe al que resuelve de verdad.",
  why:"Es el valor que traen las plantillas de Vite, junto con module: esnext (o preserve)."}
]},

/* =============== U6 L3 =============== */
{
id:"ts6n2",
titulo:"Ficheros .d.ts y DefinitelyTyped",
claves:["Un .d.ts declara tipos sin implementación: así viajan los tipos en los paquetes","Los paquetes JavaScript sin tipos los obtienen de DefinitelyTyped como @types/paquete","Desde TypeScript 6 types vale [] por defecto: los @types globales (node, jest) se listan en types"],
pasos:[
 {t:"info", eti:"Tipos de terceros", h:"@types y .d.ts",
  c:`<div class="termbox">npm install -D @types/express          # tipos de un paquete que no los trae

// tsconfig.json
{ "compilerOptions": { "types": ["node", "vitest/globals"] } }

// src/tipos/globales.d.ts: declarar lo que no tiene tipos
declare module "libreria-antigua" {
  export function calcular(x: number): number;
}
declare module "*.svg" {                   // imports de ficheros no JS
  const url: string;
  export default url;
}</div>
     <p>Muchos paquetes modernos ya incluyen sus tipos (campo <code>types</code> o condición <code>"types"</code> en <code>exports</code>). Para los que no, la comunidad los publica en <b>DefinitelyTyped</b> como <code>@types/nombre</code>. Los paquetes <code>@types</code> son siempre dependencias de desarrollo.</p>`},
 {t:"info", eti:"Por dentro", h:"Qué hay en un .d.ts",
  c:`<div class="termbox">// dist/carrito.d.ts (generado con "declaration": true)
export interface Linea { precio: number; cantidad: number }
export declare function total(lineas: Linea[]): number;
export declare class Carrito {
  #private;
  añadir(l: Linea): this;
}</div>
     <p>Solo firmas: nada de cuerpos. <code>skipLibCheck: true</code> evita volver a comprobar todos los <code>.d.ts</code> de <code>node_modules</code> en cada compilación (más rápido y sin errores ajenos). Y <code>isolatedDeclarations</code> (TS 5.5) exige anotar los tipos exportados para que otras herramientas generen los <code>.d.ts</code> sin el compilador completo.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["@types/node","Tipos de las APIs de Node.js"],["archivo.d.ts","Declaraciones de tipos sin implementación"],["declare module \"x\"","Describir un módulo que no trae tipos"],["\"types\": [\"node\"]","Incluir los tipos globales de Node en la compilación"],["skipLibCheck","No comprobar los .d.ts de las dependencias"]],
  why:"«Could not find a declaration file for module» se resuelve con @types o un declare module."},
 {t:"term", p:"Instala los tipos de Node como dependencia de desarrollo",
  prompt:"pablo@portatil:~/api$", sol:["npm install -D @types/node","npm i -D @types/node","npm install --save-dev @types/node","npm i --save-dev @types/node","pnpm add -D @types/node"],
  pista:"npm install -D y el paquete @types/node.",
  salida:`added 2 packages in 1s`, why:"Los tipos solo se usan al compilar: siempre en devDependencies."},
 {t:"opcion", p:"Actualizas un proyecto de TypeScript 5.9 a 7 y aparece <i>Cannot find name 'process'. Do you need to install type definitions for node?</i>, aunque <code>@types/node</code> está instalado. ¿Por qué?",
  ops:["TypeScript 7 no soporta Node","Desde 6.0, types vale [] por defecto y ya no se cargan todos los @types automáticamente: hay que añadir \"types\": [\"node\"]","Hay que reinstalar node_modules","Falta skipLibCheck"],
  ok:1, why:"Antes se incluían todos los paquetes de node_modules/@types; ahora solo los que declaras, lo que acelera la compilación y evita tipos globales sorpresa."},
 {t:"opcion", p:"Importas <code>logo.png</code> en un componente y el compilador dice <i>Cannot find module './logo.png'</i>. ¿Qué falta?",
  ops:["Instalar @types/png","Una declaración declare module \"*.png\" (las plantillas de Vite la traen con /// &lt;reference types=\"vite/client\" /&gt;)","Cambiar a require","Nada: es un error de ejecución"],
  ok:1, why:"TypeScript no sabe qué exporta un fichero que no es de código hasta que se lo declaras."},
 {t:"vf", p:"<code>skipLibCheck: true</code> desactiva la comprobación de tipos de tu propio código.",
  ok:false, why:"Solo se salta la comprobación interna de los ficheros .d.ts (sobre todo los de node_modules). Tu código se sigue comprobando contra esos tipos."}
]}

]});
