window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Qué es Node.js",
resumen: "JavaScript en el servidor, el runtime y su event loop, ejecutar scripts, módulos, npm y las versiones LTS",
nivel: "Fundamentos",
color: "#7fbf5a",
lecciones: [

{
id:"nd1l1",
titulo:"JavaScript fuera del navegador",
claves:["Node.js es un runtime que ejecuta JavaScript con el motor V8 fuera del navegador","Su E/S es asíncrona y no bloqueante: un solo hilo atiende muchas conexiones","Ideal para APIs, herramientas y tiempo real; menos para cálculo intensivo"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es Node.js?",
  c:`<p><b>Node.js</b> toma el motor de JavaScript de Chrome (<b>V8</b>) y le añade lo que un navegador no tiene: acceso a ficheros, red, procesos y sistema operativo. Así puedes escribir servidores, scripts y herramientas en JavaScript.</p>
     <p>Su característica central: la entrada/salida es <b>asíncrona</b>. Mientras espera a la base de datos o a la red, el hilo atiende otras peticiones. Por eso un solo proceso de Node maneja miles de conexiones simultáneas con poca memoria.</p>
     <div class="diag">peticion 1 -&gt; consulta BD (espera) ...............-&gt; responde
peticion 2 ------&gt; lee fichero (espera) .....-&gt; responde
peticion 3 -----------&gt; llama a otra API (espera) ....-&gt; responde
      un solo hilo de JavaScript, nunca bloqueado esperando</div>`},
 {t:"par", p:"Empareja cada caso con lo bien que encaja Node",
  pares:[["API REST con mucha E/S","Encaja muy bien"],["Chat o notificaciones en tiempo real","Encaja muy bien (WebSockets)"],["Herramientas de línea de comandos y build","Encaja muy bien (npm, Vite, ESLint)"],["Procesar vídeo o cálculo numérico intenso","Encaja mal: bloquea el hilo; mejor otro servicio o workers"]],
  why:"Node brilla cuando se espera mucho y se calcula poco."},
 {t:"opcion", p:"¿Qué relación hay entre Node.js y el navegador?",
  ops:["Node es un navegador sin ventanas","Comparten el lenguaje (y el motor V8 con Chrome), pero Node no tiene DOM ni window, y sí acceso a ficheros, red y procesos","Node solo ejecuta TypeScript","Ninguna"],
  ok:1, why:"document o window no existen en Node; fs, process o http no existen en el navegador."},
 {t:"vf", p:"Node.js ejecuta tu código JavaScript en muchos hilos, uno por petición.",
  ok:false, why:"Tu JavaScript corre en un hilo con un event loop; la E/S se delega al sistema operativo y a un pequeño pool interno (libuv)."}
]},

{
id:"nd1l2",
titulo:"Ejecutar código y versiones",
claves:["node fichero.js ejecuta un script; node sin argumentos abre el REPL","Usa versiones LTS (pares: 20, 22, 24) en producción","nvm o fnm gestionan varias versiones; process y los argumentos de línea de comandos"],
pasos:[
 {t:"info", eti:"Primeros pasos", h:"Ejecutar",
  c:`<div class="termbox">pablo@portatil:~$ node --version
v22.11.0
pablo@portatil:~$ node hola.js
Hola desde Node
pablo@portatil:~$ node --watch servidor.js     # reinicia al guardar
pablo@portatil:~$ node --env-file=.env app.js   # carga variables de entorno</div>
     <div class="termbox">// hola.js
console.log("Hola desde Node");
console.log(process.version, process.platform);
console.log(process.argv.slice(2));       // argumentos: node hola.js a b =&gt; ["a", "b"]
console.log(process.env.HOME);            // variables de entorno
process.exit(0);                          // codigo de salida</div>
     <p>Las versiones <b>pares</b> pasan a <b>LTS</b> (soporte largo): son las de producción. Con <b>nvm</b> o <b>fnm</b> cambias de versión por proyecto (fichero <code>.nvmrc</code>).</p>`},
 {t:"term", p:"Ejecuta el script <code>servidor.js</code> para que se reinicie solo al guardar cambios",
  prompt:"pablo@portatil:~/api$", sol:["node --watch servidor.js"],
  pista:"node con la opción --watch y el fichero.",
  salida:`Servidor escuchando en http://localhost:3000`, why:"Desde Node 18 ya no hace falta nodemon para esto."},
 {t:"par", p:"Empareja cada elemento de process con lo que contiene",
  pares:[["process.argv","Los argumentos de la línea de comandos"],["process.env","Las variables de entorno"],["process.exit(1)","Terminar con código de error"],["process.cwd()","El directorio de trabajo actual"],["process.on(\"SIGTERM\")","Reaccionar a la señal de parada (apagado elegante)"]],
  why:"SIGTERM es lo que envían Docker y Kubernetes al parar un contenedor."},
 {t:"vf", p:"Node 23 es una versión LTS recomendada para producción.",
  ok:false, why:"Las impares no pasan a LTS. Para producción, una par en fase LTS (22, 24...)."}
]},

{
id:"nd1l3",
titulo:"Módulos y npm",
claves:["ES modules (import/export, \"type\": \"module\") y CommonJS (require)","Módulos integrados con prefijo node: (node:fs, node:path, node:http)","npm init, dependencias, scripts y npx"],
pasos:[
 {t:"info", eti:"Organizar", h:"Dos sistemas de módulos",
  c:`<div class="termbox">// ES modules (recomendado): package.json con "type": "module" o ficheros .mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
export function leerConfig() { ... }

// CommonJS (codigo antiguo y muchos paquetes): .cjs o sin "type": "module"
const fs = require("node:fs");
module.exports = { leerConfig };</div>
     <p>El prefijo <code>node:</code> deja claro que es un módulo integrado y no un paquete de npm.</p>`},
 {t:"info", eti:"Paquetes", h:"npm",
  c:`<div class="termbox">npm init -y                  # crea package.json
npm install express          # dependencia de produccion
npm install -D vitest        # de desarrollo
npm run dev                  # ejecuta un script de package.json
npx prisma migrate dev       # ejecuta un binario de un paquete
npm ci --omit=dev            # instalacion de produccion en una imagen Docker</div>`},
 {t:"par", p:"Empareja cada sintaxis con su sistema de módulos",
  pares:[["import x from \"y\"","Importar en ES modules"],["require(\"y\")","Importar en CommonJS"],["export default","Exportar en ES modules"],["module.exports","Exportar en CommonJS"]],
  why:"En un proyecto nuevo, ES modules. Verás CommonJS en código y paquetes más antiguos."},
 {t:"term", p:"Instala <code>express</code> como dependencia del proyecto",
  prompt:"pablo@portatil:~/api$", sol:["npm install express","npm i express"],
  pista:"npm install y el nombre del paquete.",
  salida:`added 65 packages, and audited 66 packages in 3s
found 0 vulnerabilities`, why:"Se añade a dependencies y a package-lock.json."}
]}

]});
