window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Módulos y npm",
resumen: "ES modules y CommonJS, cómo resuelve Node un import, package.json, semver, lockfiles y el día a día con npm",
nivel: "Fundamentos",
color: "#7fbf5a",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"nd1l3",
titulo:"Módulos: ES modules y CommonJS",
claves:["ES modules (import/export, \"type\": \"module\") y CommonJS (require, module.exports)","Módulos integrados con prefijo node: (node:fs, node:path, node:http)","Un módulo se evalúa una sola vez y queda en caché: todos reciben la misma instancia"],
pasos:[
 {t:"info", eti:"Organizar", h:"Dos sistemas de módulos",
  c:`<div class="termbox">// ES modules (recomendado): package.json con "type": "module" o ficheros .mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
export function leerConfig() { ... }
export default class Repositorio { ... }

// CommonJS (código antiguo y muchos paquetes): .cjs o sin "type": "module"
const fs = require("node:fs");
module.exports = { leerConfig };</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">diferencias que importan</div>
       <table class="dg-tabla"><thead><tr><th></th><th>ES modules</th><th>CommonJS</th></tr></thead><tbody>
       <tr><td>carga</td><td>estática, se analiza antes de ejecutar</td><td>dinámica, al llegar a require()</td></tr>
       <tr><td>await en el nivel superior</td><td>sí</td><td>no</td></tr>
       <tr><td>__dirname</td><td>import.meta.dirname</td><td>__dirname</td></tr>
       <tr><td>extensión en rutas relativas</td><td>obligatoria: "./db.js"</td><td>opcional: "./db"</td></tr>
       <tr><td>modo estricto</td><td>siempre</td><td>solo con "use strict"</td></tr>
       </tbody></table></div>
     <p>El prefijo <code>node:</code> deja claro que es un módulo integrado y no un paquete de npm que se llame igual.</p>`},
 {t:"info", eti:"Caché", h:"Un módulo se ejecuta una vez",
  c:`<p>La primera vez que se importa un módulo, Node lo ejecuta y guarda lo que exporta. Los siguientes <code>import</code> o <code>require</code> reciben <b>el mismo objeto</b>. Por eso un módulo <code>db.js</code> que crea un pool de conexiones funciona como un singleton.</p>
     <div class="termbox">// db.js
import pg from "pg";
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });   // se crea UNA vez

// usuarios.js y pedidos.js importan el mismo pool
import { pool } from "./db.js";</div>
     <div class="nota ojo"><b class="tit">Dependencias circulares</b>Si <code>a.js</code> importa <code>b.js</code> y <code>b.js</code> importa <code>a.js</code>, uno de los dos verá al otro a medio cargar (valores <code>undefined</code> o un error de acceso antes de inicializar). Suele delatar un mal reparto de responsabilidades: extrae lo común a un tercer módulo.</div>`},
 {t:"par", p:"Empareja cada sintaxis con su sistema de módulos",
  pares:[["import x from \"y\"","Importar en ES modules"],["require(\"y\")","Importar en CommonJS"],["export default","Exportar en ES modules"],["module.exports","Exportar en CommonJS"],["import(\"y\")","Importación dinámica (funciona en los dos)"]],
  why:"En un proyecto nuevo, ES modules. Verás CommonJS en código y paquetes más antiguos."},
 {t:"opcion", p:"En un proyecto con <code>\"type\": \"module\"</code>, <code>import { db } from \"./db\"</code> falla con <code>ERR_MODULE_NOT_FOUND</code>. ¿Por qué?",
  ops:["El fichero no exporta db","En ES modules las rutas relativas deben llevar la extensión: \"./db.js\"","Falta instalar db con npm","Hay que usar require"],
  ok:1, why:"ESM sigue las reglas del navegador: no adivina extensiones ni busca index.js en carpetas. TypeScript con \"module\": \"nodenext\" te obliga a escribirlo también."},
 {t:"hueco", p:"Completa el módulo en ES modules que exporta una función y la importa en otro fichero",
  tpl:"// saludo.js\n___ function saludar(n) { return `Hola ${n}`; }\n// main.js\n___ { saludar } from \"./saludo.js\";",
  banco:["export","import","module.exports","require","exports"], sol:["export","import"],
  why:"Exportación con nombre: se importa entre llaves y con el mismo nombre."},
 {t:"vf", p:"Si dos ficheros hacen <code>require(\"./config.js\")</code>, el código de config.js se ejecuta dos veces.",
  ok:false, why:"Se ejecuta la primera vez y el resultado queda en caché (require.cache en CommonJS). Los dos reciben el mismo objeto."},
 {t:"codigo", p:"Comprueba la caché de módulos: crea el fichero <code>contador.js</code>, haz <code>require</code> dos veces e incrementa desde cada una",
  lenguaje:"js",
  c:`<p>El código escribe un módulo con <code>fs.writeFileSync</code>. Complétalo para cargarlo dos veces (en <code>a</code> y <code>b</code>), llamar a <code>a.sumar()</code> y <code>b.sumar()</code>, e imprimir <code>a.valor()</code> y <code>a === b</code>. Salida: <code>2</code> y <code>true</code>.</p>`,
  plantilla:"const fs = require(\"node:fs\");\nfs.writeFileSync(\"contador.js\", \"let n = 0; module.exports = { sumar: () => ++n, valor: () => n };\");\n// carga el módulo dos veces\n",
  pruebas:[{salida:"2\ntrue"}],
  pista:"const a = require(\"./contador.js\"); const b = require(\"./contador.js\");",
  solucion:"const fs = require(\"node:fs\");\nfs.writeFileSync(\"contador.js\", \"let n = 0; module.exports = { sumar: () => ++n, valor: () => n };\");\nconst a = require(\"./contador.js\");\nconst b = require(\"./contador.js\");\na.sumar();\nb.sumar();\nconsole.log(a.valor());\nconsole.log(a === b);",
  why:"Estado de módulo compartido: útil para un pool o una configuración, peligroso si guardas datos de una petición en una variable de módulo (se mezclan entre usuarios)."}
]},

/* =============== U2 L2 =============== */
{
id:"nd2n1",
titulo:"Paquetes por dentro: resolución e interoperabilidad",
claves:["Node busca los paquetes subiendo por las carpetas node_modules","El campo \"exports\" de package.json define la API pública del paquete","ESM puede importar CommonJS; desde Node 22.12, require() también carga ESM sin await de nivel superior"],
pasos:[
 {t:"info", eti:"Resolver", h:"¿Dónde encuentra Node un import?",
  c:`<div class="dg"><div class="dg-tit">qué hace Node con un import</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">"node:fs"</div><div class="dg-caja ok">módulo integrado</div></div>
         <div class="dg-col"><div class="dg-col-tit">"./util.js"</div><div class="dg-caja ok">ruta relativa al fichero actual</div></div>
         <div class="dg-col"><div class="dg-col-tit">"express"</div><div class="dg-vert"><div class="dg-caja">./node_modules/express</div><div class="dg-caja">../node_modules/express</div><div class="dg-caja">… hasta la raíz del disco</div></div></div>
       </div></div>
     <p>Dentro del paquete, <code>package.json</code> dice qué fichero cargar. Los paquetes modernos usan <b>exports</b>:</p>
     <div class="termbox">{
  "name": "mi-lib",
  "type": "module",
  "exports": {
    ".": { "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./utils": "./dist/utils.js"
  }
}</div>
     <p>Con <code>exports</code>, solo se puede importar lo declarado: <code>import "mi-lib/dist/interno.js"</code> falla con <code>ERR_PACKAGE_PATH_NOT_EXPORTED</code>. Así el autor protege lo que no es API pública.</p>`},
 {t:"info", eti:"Mezclar", h:"ESM y CommonJS juntos",
  c:`<ul><li><b>ESM importa CommonJS</b>: <code>import pkg from "paquete-cjs"</code> recibe <code>module.exports</code> como export por defecto.</li>
     <li><b>CommonJS carga ESM</b>: con <code>await import("paquete-esm")</code>, o, desde Node 22.12 (y 20.19), directamente con <code>require()</code> si el módulo no usa await en el nivel superior.</li>
     <li><b>Detección automática</b>: desde Node 22.7, un <code>.js</code> sin <code>"type"</code> que use <code>import</code>/<code>export</code> se ejecuta como ESM.</li></ul>
     <div class="termbox">// ESM no tiene __dirname ni require, pero tiene equivalentes
const aqui = import.meta.dirname;                 // Node 20.11+
const fichero = import.meta.filename;
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);   // para cargar un .json o algo CJS
const datos = require("./datos.json");</div>`},
 {t:"par", p:"Empareja cada error con su causa",
  pares:[["ERR_MODULE_NOT_FOUND con \"./db\"","Falta la extensión .js en ESM"],["ERR_PACKAGE_PATH_NOT_EXPORTED","Importas una ruta interna que el paquete no expone en exports"],["require is not defined in ES module scope","Usas require dentro de un módulo ESM"],["Cannot use import statement outside a module","Sintaxis import en un fichero tratado como CommonJS"]],
  why:"Son los cuatro errores de módulos más buscados en Internet. Ya sabes de dónde viene cada uno."},
 {t:"opcion", p:"Tu servidor en CommonJS necesita un paquete que solo se publica como ESM. ¿Qué haces en Node 24?",
  ops:["Nada: es imposible","require() lo carga directamente si no usa await de nivel superior; si lo usa, await import(\"paquete\")","Copiar el código del paquete","Bajar a Node 16"],
  ok:1, why:"require(esm) llegó sin opciones en 22.12. Antes, la única vía desde CommonJS era import() dinámico."},
 {t:"opcion", p:"¿Qué valor tiene <code>import.meta.dirname</code> en <code>/app/src/servidor.js</code>?",
  ops:["/app","/app/src","/app/src/servidor.js","El directorio desde el que ejecutaste node"],
  ok:1, why:"Es la carpeta del fichero, igual que __dirname. process.cwd(), en cambio, depende de desde dónde lanzaste el proceso."},
 {t:"vf", p:"Con un campo <code>exports</code> en su package.json, un paquete puede impedir que importes sus ficheros internos.",
  ok:true, why:"Encapsulación a nivel de paquete: el autor puede reorganizar sus ficheros internos sin romperte."},
 {t:"codigo", p:"Carga un módulo integrado con importación dinámica: usa <code>import(\"node:path\")</code> para imprimir la extensión de <code>informe.final.pdf</code> y el nombre sin extensión",
  lenguaje:"js",
  c:`<p>Salida: <code>.pdf</code> y <code>informe.final</code>. <code>import()</code> devuelve una promesa, también desde CommonJS.</p>`,
  plantilla:"// usa import(\"node:path\") y then (o una función async)\n",
  pruebas:[{salida:".pdf\ninforme.final"}],
  pista:"import(\"node:path\").then(({ default: path }) => { ... path.extname(...) ... path.basename(nombre, ext) })",
  solucion:"import(\"node:path\").then(({ default: path }) => {\n  const nombre = \"informe.final.pdf\";\n  const ext = path.extname(nombre);\n  console.log(ext);\n  console.log(path.basename(nombre, ext));\n});",
  why:"import() sirve para cargar módulos bajo demanda (planes de pago, plugins) y para usar ESM desde CommonJS en versiones antiguas. path.extname solo toma lo que hay tras el último punto."}
]},

/* =============== U2 L3 =============== */
{
id:"nd2n2",
titulo:"package.json, semver y lockfiles",
claves:["dependencies, devDependencies y peerDependencies; scripts y engines","Semver: MAYOR.MENOR.PARCHE; ^ acepta menores y parches, ~ solo parches","package-lock.json fija el árbol exacto: npm ci en CI y Docker, y se sube al repositorio"],
pasos:[
 {t:"info", eti:"El manifiesto", h:"package.json",
  c:`<div class="termbox">{
  "name": "api-tareas",
  "version": "1.4.0",
  "type": "module",
  "engines": { "node": "&gt;=22" },
  "scripts": {
    "dev": "node --watch --env-file=.env src/server.js",
    "test": "node --test",
    "start": "node src/server.js"
  },
  "dependencies": { "express": "^5.1.0", "pg": "^8.16.0" },
  "devDependencies": { "vitest": "^3.2.0" }
}</div>
     <div class="termbox">npm init -y                  # crea package.json
npm install express          # dependencia de producción
npm install -D vitest        # de desarrollo
npm run dev                  # ejecuta un script (o node --run dev)
npx prisma migrate dev       # ejecuta un binario de un paquete
npm ci --omit=dev            # instalación exacta de producción</div>`},
 {t:"info", eti:"Versiones", h:"Semver y el lockfile",
  c:`<p>Semver: <b>MAYOR.MENOR.PARCHE</b>. Una mayor puede romper la API; una menor añade sin romper; un parche solo corrige.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué acepta cada rango</div>
       <table class="dg-tabla"><thead><tr><th>rango</th><th>acepta</th><th>no acepta</th></tr></thead><tbody>
       <tr><td>^1.2.3</td><td>1.2.3 … 1.99.99</td><td>2.0.0</td></tr>
       <tr><td>~1.2.3</td><td>1.2.3 … 1.2.99</td><td>1.3.0</td></tr>
       <tr><td>1.2.3</td><td>solo 1.2.3</td><td>todo lo demás</td></tr>
       <tr><td>^0.2.3</td><td>0.2.3 … 0.2.99</td><td>0.3.0 (en 0.x, la menor puede romper)</td></tr>
       </tbody></table></div>
     <p>El <b>package-lock.json</b> apunta la versión exacta de cada paquete del árbol (también las dependencias de tus dependencias) y su hash de integridad. Se sube a Git. <code>npm ci</code> instala exactamente eso, falla si no cuadra con package.json y nunca lo modifica.</p>
     <div class="nota ojo"><b class="tit">«En mi máquina funciona»</b>Sin lockfile, cada <code>npm install</code> puede traer versiones nuevas de dependencias indirectas. Así es como un despliegue sin cambios de código se rompe un lunes por la mañana.</div>`},
 {t:"par", p:"Empareja cada tipo de dependencia con su caso",
  pares:[["dependencies","Lo que la app necesita al ejecutarse (express, pg)"],["devDependencies","Solo para desarrollar y probar (vitest, eslint)"],["peerDependencies","Un plugin que exige que el proyecto ya tenga cierta librería (react, eslint)"],["overrides","Forzar la versión de una dependencia indirecta vulnerable"]],
  why:"En la imagen de producción se instala con --omit=dev: menos tamaño y menos superficie de ataque."},
 {t:"opcion", p:"Con <code>\"express\": \"^5.1.0\"</code> en package.json y sin lockfile, ¿qué puede instalar npm?",
  ops:["Solo 5.1.0","Cualquier 5.x.y igual o mayor que 5.1.0, pero no 6.0.0","Cualquier versión","Solo parches de 5.1"],
  ok:1, why:"El acento circunflejo acepta menores y parches. El lockfile es lo que congela la versión exacta."},
 {t:"opcion", p:"¿Qué comando usarías en el pipeline de CI y en el Dockerfile para instalar dependencias?",
  ops:["npm install","npm ci","npm update","npx install"],
  ok:1, why:"npm ci es reproducible (respeta el lockfile al pie de la letra), más rápido y borra node_modules antes de instalar. npm install puede modificar el lockfile."},
 {t:"vf", p:"El fichero package-lock.json debe añadirse al .gitignore.",
  ok:false, why:"Se versiona: es lo que garantiza que CI, tus compañeros y producción instalan el mismo árbol. node_modules, en cambio, nunca se sube."},
 {t:"term", p:"Añade <code>vitest</code> como dependencia de desarrollo",
  prompt:"pablo@portatil:~/api$", sol:["npm install -D vitest","npm i -D vitest","npm install --save-dev vitest","npm i --save-dev vitest","npm install vitest -D","npm i vitest -D"],
  pista:"npm install con la opción de desarrollo.",
  salida:`added 38 packages, and audited 104 packages in 4s
found 0 vulnerabilities`, why:"Queda en devDependencies y no se instala en producción con --omit=dev."},
 {t:"codigo", p:"Implementa la comprobación de rangos de semver: para cada línea <code>version rango</code> de stdin, imprime <code>si</code> o <code>no</code>",
  lenguaje:"js",
  c:`<p>Rangos posibles: exacto (<code>1.2.3</code>), tilde (<code>~1.2.3</code>: misma mayor y menor, parche ≥) y circunflejo (<code>^1.2.3</code>: misma mayor y ≥ que el rango; si la mayor es 0, además la misma menor).</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const linea of lineas) {\n  const [version, rango] = linea.split(\" \");\n  // imprime si o no\n}\n",
  pruebas:[{entrada:"1.4.0 ^1.2.3\n2.0.0 ^1.2.3\n1.2.9 ~1.2.3\n1.3.0 ~1.2.3\n", salida:"si\nno\nsi\nno"},{entrada:"1.2.3 1.2.3\n1.2.2 ^1.2.3\n", salida:"si\nno"},{entrada:"0.2.5 ^0.2.3\n0.3.0 ^0.2.3\n1.10.0 ^1.9.0\n", salida:"si\nno\nsi", oculta:true}],
  pista:"Convierte a números con split(\".\").map(Number). Compara la mayor, luego la menor, luego el parche; nunca compares versiones como texto (\"1.10\" &lt; \"1.9\" como cadena).",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst num = v => v.split(\".\").map(Number);\nconst cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];\nfor (const linea of lineas) {\n  const [version, rango] = linea.split(\" \");\n  const v = num(version);\n  let ok;\n  if (rango[0] === \"^\") {\n    const r = num(rango.slice(1));\n    ok = v[0] === r[0] && cmp(v, r) >= 0 && (r[0] !== 0 || v[1] === r[1]);\n  } else if (rango[0] === \"~\") {\n    const r = num(rango.slice(1));\n    ok = v[0] === r[0] && v[1] === r[1] && v[2] >= r[2];\n  } else {\n    ok = cmp(v, num(rango)) === 0;\n  }\n  console.log(ok ? \"si\" : \"no\");\n}",
  why:"Así decide npm qué versiones valen. En código real usa el paquete <code>semver</code>, que además gestiona prereleases (1.0.0-beta.1) y rangos compuestos."}
]}

]});
