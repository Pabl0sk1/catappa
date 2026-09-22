window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Módulos, herramientas y errores",
resumen: "Módulos ES, npm y package.json, empaquetadores como Vite, linters y formateadores, errores, depuración y pruebas",
nivel: "Avanzado",
color: "#baa020",
lecciones: [

{
id:"js10l1",
titulo:"Módulos ES",
claves:["export e import dividen el código en ficheros con dependencias explícitas","Exportaciones con nombre y por defecto","import() dinámico carga código bajo demanda"],
pasos:[
 {t:"info", eti:"Dividir el código", h:"export e import",
  c:`<div class="termbox">// precios.js
export const IVA = 0.21;
export function conIva(p) { return p * (1 + IVA); }
export default class Carrito { ... }

// app.js
import Carrito, { conIva, IVA } from "./precios.js";
import * as precios from "./precios.js";          // todo como objeto

// carga bajo demanda
const { exportarPdf } = await import("./pdf.js");</div>
     <div class="termbox">&lt;script type="module" src="app.js"&gt;&lt;/script&gt;</div>
     <p>Cada módulo tiene su propio ámbito (nada se vuelve global) y se ejecuta una sola vez aunque se importe desde varios sitios. En Node existe también el sistema antiguo <b>CommonJS</b> (<code>require</code> y <code>module.exports</code>).</p>`},
 {t:"par", p:"Empareja cada sintaxis con su significado",
  pares:[["export function f","Exportación con nombre"],["export default","La exportación principal del módulo"],["import { f } from","Importar una exportación con nombre"],["import X from","Importar la exportación por defecto"],["require(\"x\")","Importar en CommonJS (Node antiguo)"]],
  why:"Las exportaciones con nombre facilitan el autocompletado y eliminar código no usado (tree shaking)."},
 {t:"opcion", p:"¿Qué ventaja tiene <code>import()</code> dinámico?",
  ops:["Ninguna","Carga el módulo solo cuando hace falta, reduciendo lo que se descarga al principio","Es síncrono","Permite importar CSS"],
  ok:1, why:"Se usa para dividir el código por rutas o funciones poco usadas (code splitting)."},
 {t:"vf", p:"Las variables de nivel superior de un módulo ES son globales en la página.",
  ok:false, why:"Cada módulo tiene su ámbito; solo es visible lo que exporta."}
]},

{
id:"js10l2",
titulo:"npm, package.json y herramientas",
claves:["package.json declara dependencias y scripts; package-lock fija versiones exactas","npm ci en CI; dependencies frente a devDependencies","Vite para desarrollar y empaquetar; ESLint y Prettier para calidad y formato"],
pasos:[
 {t:"info", eti:"Ecosistema", h:"npm y package.json",
  c:`<div class="termbox">{
  "name": "tareas-web",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": { "dayjs": "^1.11.13" },
  "devDependencies": { "vite": "^6.0.0", "vitest": "^3.0.0", "eslint": "^9.0.0" }
}</div>
     <div class="termbox">npm install dayjs          # anade a dependencies
npm install -D vitest      # anade a devDependencies
npm run dev                # ejecuta un script
npm ci                     # instalacion exacta segun package-lock (CI)
npm audit                  # vulnerabilidades conocidas</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["package.json","Nombre, scripts y rangos de dependencias"],["package-lock.json","Versiones exactas instaladas (commitéalo)"],["node_modules/","Las dependencias descargadas (no se sube a Git)"],["^1.11.13","Acepta 1.x.x compatibles a partir de 1.11.13"],["npm ci","Instalación limpia y reproducible"]],
  why:"Commitear el lock hace que todos (y el CI) usen exactamente lo mismo."},
 {t:"term", p:"Instala <code>vitest</code> como dependencia de desarrollo",
  prompt:"pablo@portatil:~/tareas-web$", sol:["npm install -D vitest","npm i -D vitest","npm install --save-dev vitest","npm i --save-dev vitest"],
  pista:"npm install con -D y el nombre del paquete.",
  salida:`added 38 packages, and audited 112 packages in 4s
found 0 vulnerabilities`, why:"Las herramientas de pruebas y build van en devDependencies: no hacen falta en producción."},
 {t:"info", eti:"Calidad", h:"Vite, ESLint y Prettier",
  c:`<ul><li><b>Vite</b>: servidor de desarrollo instantáneo y empaquetado optimizado para producción (minifica, divide el código, añade hashes a los ficheros).</li>
     <li><b>ESLint</b>: detecta errores y malas prácticas (variables no usadas, == en vez de ===).</li>
     <li><b>Prettier</b>: formatea el código automáticamente; se acabaron las discusiones de estilo.</li></ul>`},
 {t:"vf", p:"La carpeta <code>node_modules</code> debe subirse al repositorio Git.",
  ok:false, why:"Se regenera con npm ci a partir del lock. Va en .gitignore."}
]},

{
id:"js10l3",
titulo:"Errores, depuración y pruebas",
claves:["throw new Error, try/catch/finally y clases de error propias","DevTools: breakpoints, debugger, pestaña Network","Vitest o Jest para pruebas unitarias; Playwright para extremo a extremo"],
pasos:[
 {t:"info", eti:"Errores", h:"Lanzar y capturar",
  c:`<div class="termbox">class ErrorValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.campo = campo;
  }
}

try {
  if (!email.includes("@")) throw new ErrorValidacion("email", "Email no válido");
} catch (e) {
  if (e instanceof ErrorValidacion) marcarCampo(e.campo, e.message);
  else throw e;                       // no te tragues lo que no sabes gestionar
}

window.addEventListener("unhandledrejection", e =&gt; reportar(e.reason));</div>`},
 {t:"info", eti:"Depurar", h:"Las DevTools",
  c:`<ul><li><b>Sources</b>: pon un breakpoint en una línea (o escribe <code>debugger;</code> en el código) y ejecuta paso a paso viendo las variables.</li>
     <li><b>Network</b>: cada petición, su estado, cabeceras, cuerpo y tiempo.</li>
     <li><b>Console</b>: errores con enlace a la línea.</li>
     <li><b>Performance</b>: qué bloquea el hilo principal.</li></ul>`},
 {t:"info", eti:"Probar", h:"Pruebas con Vitest",
  c:`<div class="termbox">// precios.test.js
import { describe, it, expect } from "vitest";
import { conIva } from "./precios.js";

describe("conIva", () =&gt; {
  it("aplica el 21%", () =&gt; {
    expect(conIva(100)).toBeCloseTo(121);
  });
});</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["Breakpoint","Pausar la ejecución en una línea"],["Pestaña Network","Ver las peticiones HTTP y sus respuestas"],["Vitest / Jest","Pruebas unitarias de funciones y módulos"],["Playwright","Pruebas que manejan un navegador real"],["unhandledrejection","Detectar promesas rechazadas sin catch"]],
  why:"Playwright es a la web lo que el e2e de esta plataforma: un navegador que hace clic por ti."},
 {t:"vf", p:"Un catch vacío es una buena forma de evitar que la aplicación falle.",
  ok:false, why:"Esconde los errores. Gestiona los que entiendes y relanza o reporta el resto."}
]}

]});
