window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Qué es Node.js",
resumen: "JavaScript en el servidor, el runtime por dentro (V8 y libuv), ejecutar scripts, entrada y salida estándar, process y las versiones LTS",
nivel: "Fundamentos",
color: "#7fbf5a",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"nd1l1",
titulo:"JavaScript fuera del navegador",
claves:["Node.js es un runtime que ejecuta JavaScript con el motor V8 fuera del navegador","Su E/S es asíncrona y no bloqueante: un solo hilo atiende muchas conexiones","Ideal para APIs, herramientas y tiempo real; menos para cálculo intensivo"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es Node.js?",
  c:`<p><b>Node.js</b> toma el motor de JavaScript de Chrome (<b>V8</b>) y le añade lo que un navegador no tiene: acceso a ficheros, red, procesos y sistema operativo. Así puedes escribir servidores, scripts y herramientas en JavaScript.</p>
     <p>Su característica central: la entrada/salida es <b>asíncrona</b>. Mientras espera a la base de datos o a la red, el hilo atiende otras peticiones. Por eso un solo proceso de Node maneja miles de conexiones simultáneas con poca memoria.</p>
     <div class="dg"><div class="dg-tit">tres peticiones a la vez con un solo hilo</div>
       <svg viewBox="0 0 340 200" width="100%" style="max-width:480px;display:block;margin:auto" role="img" aria-label="Tres peticiones que esperan a la vez a la base de datos, a un fichero y a otra API mientras un solo hilo de JavaScript atiende a todas sin bloquearse">
         <g font-family="var(--sans)" font-size="12" fill="var(--ink-2)">
           <text x="20" y="22">petición 1 · consulta BD (espera) → responde</text>
           <text x="20" y="64">petición 2 · lee fichero (espera) → responde</text>
           <text x="20" y="106">petición 3 · llama a otra API (espera) → responde</text>
         </g>
         <g stroke-width="8" stroke-linecap="round">
           <line x1="24" y1="36" x2="40" y2="36" stroke="var(--accent)"/>
           <line x1="46" y1="36" x2="226" y2="36" stroke="var(--line-2)" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="butt"/>
           <line x1="234" y1="36" x2="250" y2="36" stroke="var(--accent)"/>
           <line x1="50" y1="78" x2="66" y2="78" stroke="var(--accent)"/>
           <line x1="72" y1="78" x2="176" y2="78" stroke="var(--line-2)" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="butt"/>
           <line x1="184" y1="78" x2="200" y2="78" stroke="var(--accent)"/>
           <line x1="76" y1="120" x2="92" y2="120" stroke="var(--accent)"/>
           <line x1="98" y1="120" x2="276" y2="120" stroke="var(--line-2)" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="butt"/>
           <line x1="284" y1="120" x2="300" y2="120" stroke="var(--accent)"/>
         </g>
         <line x1="20" y1="146" x2="320" y2="146" stroke="var(--line)" stroke-width="1"/>
         <rect x="20" y="156" width="300" height="12" rx="6" fill="var(--bg-3)" stroke="var(--line)"/>
         <g fill="var(--accent)">
           <rect x="20" y="156" width="24" height="12" rx="3"/>
           <rect x="46" y="156" width="24" height="12" rx="3"/>
           <rect x="72" y="156" width="24" height="12" rx="3"/>
           <rect x="180" y="156" width="24" height="12" rx="3"/>
           <rect x="230" y="156" width="24" height="12" rx="3"/>
           <rect x="280" y="156" width="24" height="12" rx="3"/>
         </g>
         <text x="170" y="190" text-anchor="middle" font-family="var(--sans)" font-size="12" fill="var(--ink)">un solo hilo de JavaScript, nunca bloqueado esperando</text>
       </svg>
       <div class="dg-leyenda"><span><i class="acento"></i>el hilo trabaja</span><span><i></i>espera (el hilo queda libre)</span></div>
     </div>`},
 {t:"info", eti:"Dónde se usa", h:"Para qué se usa Node hoy",
  c:`<ul><li><b>APIs y backends</b>: Express, Fastify, NestJS. Empresas como Netflix, PayPal o LinkedIn lo usan en producción.</li>
     <li><b>Herramientas</b>: npm, Vite, ESLint, Prettier, TypeScript… casi todo el ecosistema frontend corre sobre Node.</li>
     <li><b>Tiempo real</b>: chats, notificaciones y paneles con WebSockets.</li>
     <li><b>Scripts y automatización</b>: el mismo lenguaje en el front, el back y los scripts del equipo.</li></ul>
     <div class="nota ojo"><b class="tit">Su límite</b>Tu JavaScript corre en <b>un solo hilo</b>. Si un cálculo tarda 2 segundos, durante esos 2 segundos el proceso no atiende a nadie. Para cálculo intensivo hay <code>worker_threads</code>, colas o directamente otro lenguaje.</div>
     <p>Alternativas con el mismo lenguaje: <b>Deno</b> y <b>Bun</b>. Node sigue siendo, con diferencia, el más usado en producción.</p>`},
 {t:"par", p:"Empareja cada caso con lo bien que encaja Node",
  pares:[["API REST con mucha E/S","Encaja muy bien"],["Chat o notificaciones en tiempo real","Encaja muy bien (WebSockets)"],["Herramientas de línea de comandos y build","Encaja muy bien (npm, Vite, ESLint)"],["Procesar vídeo o cálculo numérico intenso","Encaja mal: bloquea el hilo; mejor otro servicio o workers"]],
  why:"Node brilla cuando se espera mucho y se calcula poco."},
 {t:"opcion", p:"¿Qué relación hay entre Node.js y el navegador?",
  ops:["Node es un navegador sin ventanas","Comparten el lenguaje (y el motor V8 con Chrome), pero Node no tiene DOM ni window, y sí acceso a ficheros, red y procesos","Node solo ejecuta TypeScript","Ninguna"],
  ok:1, why:"document o window no existen en Node; fs, process o http no existen en el navegador."},
 {t:"vf", p:"Node.js ejecuta tu código JavaScript en muchos hilos, uno por petición.",
  ok:false, why:"Tu JavaScript corre en un hilo con un event loop; la E/S se delega al sistema operativo y a un pequeño pool interno (libuv)."},
 {t:"escribe", p:"¿Cómo se llama el motor de JavaScript de Chrome que usa Node.js?",
  sol:["V8","v8"], pista:"Una letra y un número.",
  why:"V8 compila JavaScript a código máquina. Node le añade las APIs de sistema y el event loop."},
 {t:"codigo", p:"Comprueba en qué entorno estás: imprime <code>typeof window</code> y <code>typeof process</code> separados por un espacio",
  lenguaje:"js",
  c:`<p>En un navegador saldría <code>object undefined</code>. En Node, al revés.</p>`,
  plantilla:"// imprime typeof window y typeof process en una línea\n",
  pruebas:[{salida:"undefined object"}],
  pista:"console.log(typeof window, typeof process);",
  solucion:"console.log(typeof window, typeof process);",
  why:"<code>typeof</code> no lanza error con variables no declaradas: es la forma clásica de detectar el entorno. En código moderno se usa <code>globalThis</code>, que existe en los dos."}
]},

/* =============== U1 L2 =============== */
{
id:"nd1l2",
titulo:"Ejecutar código y versiones",
claves:["node fichero.js ejecuta un script; node sin argumentos abre el REPL","Usa versiones LTS (pares: 22, 24) en producción","nvm o fnm gestionan varias versiones; --watch y --env-file vienen de serie"],
pasos:[
 {t:"info", eti:"Primeros pasos", h:"Ejecutar",
  c:`<div class="termbox">pablo@portatil:~$ node --version
v24.8.0
pablo@portatil:~$ node hola.js
Hola desde Node
pablo@portatil:~$ node --watch servidor.js     # reinicia al guardar
pablo@portatil:~$ node --env-file=.env app.js   # carga variables de entorno
pablo@portatil:~$ node --run test               # ejecuta un script de package.json (Node 22+)
pablo@portatil:~$ node                          # REPL: prueba cosas al vuelo (.exit para salir)</div>
     <div class="termbox">// hola.js
console.log("Hola desde Node");
console.log(process.version, process.platform);
console.log(process.argv.slice(2));       // argumentos: node hola.js a b =&gt; ["a", "b"]
console.log(process.env.HOME);            // variables de entorno</div>`},
 {t:"info", eti:"Versiones", h:"El calendario de versiones",
  c:`<p>Sale una versión mayor cada seis meses. Las <b>pares</b> pasan a <b>LTS</b> (soporte largo, unos 30 meses): son las de producción. Las impares son de prueba y caducan pronto.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">estado de las versiones en septiembre de 2026</div>
       <table class="dg-tabla"><thead><tr><th>versión</th><th>estado</th><th>fin de soporte</th></tr></thead><tbody>
       <tr><td>20</td><td>sin soporte</td><td>abril de 2026</td></tr>
       <tr><td>22</td><td>LTS en mantenimiento (solo parches)</td><td>abril de 2027</td></tr>
       <tr><td>24</td><td>LTS activa: la recomendada</td><td>abril de 2028</td></tr>
       <tr><td>26</td><td>Current: pasa a LTS en octubre de 2026</td><td>—</td></tr>
       </tbody></table></div>
     <div class="termbox">fnm install 24 &amp;&amp; fnm use 24      # o nvm install 24
echo "24" &gt; .nvmrc                   # fija la versión del proyecto</div>
     <p>En <code>package.json</code>, <code>"engines": { "node": "&gt;=22" }</code> documenta qué versiones soportas.</p>`},
 {t:"term", p:"Ejecuta el script <code>servidor.js</code> para que se reinicie solo al guardar cambios",
  prompt:"pablo@portatil:~/api$", sol:["node --watch servidor.js"],
  pista:"node con la opción --watch y el fichero.",
  salida:`Servidor escuchando en http://localhost:3000`, why:"Desde Node 18 ya no hace falta nodemon para esto; en 22 es estable."},
 {t:"term", p:"Arranca <code>app.js</code> cargando las variables del fichero <code>.env</code> sin instalar ningún paquete",
  prompt:"pablo@portatil:~/api$", sol:["node --env-file=.env app.js","node --env-file .env app.js"],
  pista:"Una opción de node con el nombre del fichero.",
  salida:`API en el puerto 3000 (entorno: desarrollo)`, why:"--env-file (Node 20.6+) sustituye a dotenv en muchos proyectos. Con --env-file-if-exists no falla si el fichero no está."},
 {t:"par", p:"Empareja cada elemento de process con lo que contiene",
  pares:[["process.argv","Los argumentos de la línea de comandos"],["process.env","Las variables de entorno"],["process.exit(1)","Terminar con código de error"],["process.cwd()","El directorio de trabajo actual"],["process.on(\"SIGTERM\")","Reaccionar a la señal de parada (apagado elegante)"]],
  why:"SIGTERM es lo que envían Docker y Kubernetes al parar un contenedor."},
 {t:"vf", p:"Node 25 es una versión LTS recomendada para producción.",
  ok:false, why:"Las impares no pasan a LTS. Para producción, una par en fase LTS (24, o 22 mientras dure su mantenimiento)."},
 {t:"opcion", p:"Tu servidor de producción sigue en Node 20 en septiembre de 2026. ¿Qué implica?",
  ops:["Nada, funciona igual","Ya no recibe parches de seguridad: hay que planificar la subida a 22 o, mejor, a 24","Que npm deja de funcionar","Que hay que pasar a una versión impar"],
  ok:1, why:"Una versión sin soporte acumula vulnerabilidades sin corregir. Sube de LTS en LTS y ejecuta las pruebas antes."},
 {t:"escribe", p:"¿Qué fichero, en la raíz del proyecto, le dice a nvm o fnm qué versión de Node usar?",
  sol:[".nvmrc",".node-version"], pista:"Empieza por punto y lleva el nombre de nvm.",
  why:"nvm y fnm lo leen al entrar en la carpeta (fnm también acepta .node-version). Así todo el equipo usa la misma versión."}
]},

/* =============== U1 L3 =============== */
{
id:"nd1n1",
titulo:"Entrada, salida y códigos de salida",
claves:["stdin, stdout y stderr: leer con fs.readFileSync(0) o readline; escribir con console.log y console.error","El código de salida (0 bien, distinto de 0 mal) lo leen la shell, CI y Docker","process.exitCode deja terminar lo pendiente; process.exit corta en seco"],
pasos:[
 {t:"info", eti:"Herramientas de terminal", h:"Los tres canales",
  c:`<p>Todo proceso tiene tres canales: <b>stdin</b> (entrada), <b>stdout</b> (salida normal) y <b>stderr</b> (errores y diagnóstico). Separarlos permite encadenar programas con tuberías sin mezclar los mensajes de error con los datos.</p>
     <div class="dg"><div class="dg-tit">una herramienta de Node en una tubería</div>
       <div class="dg-flujo"><div class="dg-caja base">cat ventas.csv</div><div class="dg-caja acento">node total.js<small>stdin → stdout</small></div><div class="dg-caja ok">sort -n</div></div>
       <div class="dg-nota arriba">los errores van a stderr y no ensucian la tubería</div></div>
     <div class="termbox">const fs = require("node:fs");
const texto = fs.readFileSync(0, "utf8");     // 0 = descriptor de stdin: lee todo
const lineas = texto.trim().split("\\n");

console.log("total:", lineas.length);          // stdout
console.error("aviso: 2 líneas vacías");       // stderr
process.stdout.write("sin salto de línea");    // escritura directa</div>`},
 {t:"info", eti:"Terminar bien", h:"Códigos de salida",
  c:`<p>El código de salida es cómo un programa le dice a quien lo lanzó si fue bien: <b>0</b> es éxito; cualquier otro, fallo. Lo leen la shell (<code>$?</code>), los pipelines de CI y Docker.</p>
     <div class="termbox">if (errores &gt; 0) {
  console.error(\`\${errores} filas no válidas\`);
  process.exitCode = 1;       // bien: termina lo pendiente y sale con 1
}

process.exit(1);              // corta YA: puede perder logs o escrituras sin volcar</div>
     <div class="nota ojo"><b class="tit">Error típico</b><code>process.exit()</code> justo después de escribir mucho en stdout (redirigido a un fichero o una tubería) puede cortar la salida. Prefiere <code>process.exitCode</code> y deja que el proceso termine solo cuando no quede trabajo pendiente.</div>`},
 {t:"codigo", p:"Lee números (uno por línea) de la entrada estándar e imprime su suma",
  lenguaje:"js",
  c:`<p>Ignora las líneas vacías. Con la entrada <code>3</code>, <code>4</code>, <code>5</code> debe imprimir <code>12</code>.</p>`,
  plantilla:"const texto = require(\"node:fs\").readFileSync(0, \"utf8\");\n// suma los números y muestra el total\n",
  pruebas:[{entrada:"3\n4\n5\n", salida:"12"},{entrada:"10\n\n-2\n", salida:"8"},{entrada:"1.5\n2.5\n", salida:"4", oculta:true}],
  pista:"texto.split(\"\\n\").filter(l => l.trim() !== \"\").map(Number) y después reduce.",
  solucion:"const texto = require(\"node:fs\").readFileSync(0, \"utf8\");\nconst nums = texto.split(\"\\n\").filter(l => l.trim() !== \"\").map(Number);\nconsole.log(nums.reduce((a, b) => a + b, 0));",
  why:"<code>readFileSync(0)</code> lee stdin entero de una vez: perfecto para entradas pequeñas. Para entradas enormes, línea a línea con <code>readline</code>."},
 {t:"codigo", p:"Haz un filtro estilo Unix: imprime solo las líneas de stdin que contienen <code>ERROR</code> y, al final, <code>coincidencias=N</code>",
  lenguaje:"js",
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\");\n",
  pruebas:[{entrada:"INFO arranque\nERROR sin conexión\nINFO ok\nERROR tiempo agotado\n", salida:"ERROR sin conexión\nERROR tiempo agotado\ncoincidencias=2"},{entrada:"INFO todo bien\n", salida:"coincidencias=0"},{entrada:"ERROR a\nerror b\n", salida:"ERROR a\ncoincidencias=1", oculta:true}],
  pista:"Filtra con l.includes(\"ERROR\"), imprime cada una y luego la cuenta.",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\");\nconst hay = lineas.filter(l => l.includes(\"ERROR\"));\nfor (const l of hay) console.log(l);\nconsole.log(\"coincidencias=\" + hay.length);",
  why:"Es un <code>grep</code> en miniatura. Las herramientas que leen stdin y escriben stdout se combinan con cualquier otra de la terminal."},
 {t:"par", p:"Empareja cada forma de escribir con adónde va",
  pares:[["console.log","stdout, con salto de línea"],["console.error","stderr"],["process.stdout.write","stdout, sin añadir salto de línea"],["process.exitCode = 2","Código de salida al terminar"]],
  why:"En contenedores, stdout y stderr los recoge Docker o Kubernetes: por eso las apps no escriben logs en ficheros."},
 {t:"opcion", p:"Tu script de migración falla pero el pipeline de CI lo marca en verde. ¿Qué pasa?",
  ops:["CI no lee la salida","El script imprime el error pero termina con código 0: debe salir con un código distinto de 0 (process.exitCode = 1)","Falta console.error","El error va a stdout"],
  ok:1, why:"CI, Docker y la shell solo miran el código de salida. Un error que termina en 0 es un éxito para ellos."},
 {t:"vf", p:"Si ejecutas <code>node informe.js &gt; salida.txt</code>, lo que escribes con <code>console.error</code> también acaba en <code>salida.txt</code>.",
  ok:false, why:"<code>&gt;</code> solo redirige stdout. stderr sigue saliendo por la terminal (o se redirige aparte con <code>2&gt;</code>)."},
 {t:"term", p:"Ejecuta <code>validar.js</code> y muestra a continuación su código de salida",
  prompt:"pablo@portatil:~/scripts$", sol:["node validar.js; echo $?","node validar.js ; echo $?"],
  pista:"En bash, $? guarda el código de salida del último comando.",
  salida:`3 filas no válidas
1`, why:"Un 1 significa fallo. <code>&amp;&amp;</code> y <code>||</code> de la shell también deciden según ese código."}
]},

/* =============== U1 L4 =============== */
{
id:"nd1n2",
titulo:"Por dentro: V8, libuv y el runtime",
claves:["V8 compila JavaScript a código máquina (JIT) y gestiona la memoria con un recolector generacional","libuv aporta el event loop, la E/S asíncrona y un pool de hilos","Node implementa APIs web estándar: fetch, URL, AbortController, structuredClone, WebSocket"],
pasos:[
 {t:"info", eti:"Arquitectura", h:"Las piezas de Node",
  c:`<div class="dg"><div class="dg-tit">capas de Node.js</div>
       <div class="dg-pila">
         <div class="dg-caja acento">tu código JavaScript<small>y los paquetes de npm</small></div>
         <div class="dg-caja">biblioteca estándar de Node<small>node:fs, node:http, node:crypto… escrita en JavaScript</small></div>
         <div class="dg-caja">enlaces en C++ (bindings)</div>
         <div class="dg-fila"><div class="dg-caja doble ok">V8<small>ejecuta JS, memoria y GC</small></div><div class="dg-caja doble ok">libuv<small>event loop, E/S y pool de hilos</small></div><div class="dg-caja doble ok">otras<small>OpenSSL, zlib, llhttp, c-ares</small></div></div>
         <div class="dg-caja base">sistema operativo<small>epoll (Linux), kqueue (macOS), IOCP (Windows)</small></div>
       </div></div>
     <p><b>V8</b> no sabe nada de ficheros ni de red: solo ejecuta JavaScript. <b>libuv</b> es la biblioteca en C que da el event loop y la E/S asíncrona en todos los sistemas. Node las une y expone todo como módulos <code>node:</code>.</p>`},
 {t:"info", eti:"V8", h:"JIT y memoria",
  c:`<p>V8 empieza <b>interpretando</b> tu código (Ignition) y, cuando una función se ejecuta mucho, la <b>compila optimizada</b> (Maglev, TurboFan) según los tipos que ha visto. Si luego llegan tipos distintos, <b>desoptimiza</b>. Por eso las funciones con tipos estables son más rápidas.</p>
     <p>La memoria se gestiona con un <b>recolector generacional</b>: los objetos nuevos van a un espacio pequeño que se limpia a menudo y muy rápido; los que sobreviven pasan al espacio viejo, que se limpia con menos frecuencia.</p>
     <div class="termbox">node --max-old-space-size=1536 server.js   # límite del heap viejo en MB
node -p "process.memoryUsage()"             # rss, heapTotal, heapUsed, external…</div>
     <div class="nota ojo"><b class="tit">En contenedores</b>Si el contenedor tiene 2 GB y el heap puede crecer más que eso, el sistema mata el proceso (OOMKilled) sin un error de JavaScript. Ajusta <code>--max-old-space-size</code> por debajo del límite, dejando margen para buffers y la memoria nativa.</div>`},
 {t:"info", eti:"Estándares", h:"APIs web en Node",
  c:`<p>Node ha ido adoptando las APIs del navegador. Hoy vienen de serie, sin instalar nada:</p>
     <div class="termbox">const r = await fetch("https://api.github.com/repos/nodejs/node");   // cliente HTTP (undici)
const url = new URL("/api?x=1", "https://catappa.dev");               // parsear URLs
const copia = structuredClone({ fecha: new Date(), mapa: new Map() }); // copia profunda
const ctrl = new AbortController();                                  // cancelar operaciones
setTimeout(() =&gt; ctrl.abort(), 5000);
const ws = new WebSocket("wss://eco.ejemplo.dev");                  // cliente WebSocket (Node 22+)
crypto.randomUUID();                                                 // Web Crypto</div>
     <p>Ventaja: el mismo código funciona en el navegador, Node, Deno, Bun y entornos edge.</p>`},
 {t:"par", p:"Empareja cada pieza con su responsabilidad",
  pares:[["V8","Compilar y ejecutar JavaScript y recolectar la basura"],["libuv","Event loop, E/S asíncrona y pool de hilos"],["OpenSSL","TLS y criptografía"],["llhttp","Parsear peticiones HTTP a gran velocidad"],["Bindings de C++","Conectar las APIs de JS con las bibliotecas nativas"]],
  why:"Cuando algo va lento, saber en qué capa ocurre es media solución."},
 {t:"opcion", p:"Un contenedor de Node con 512 MB de límite se reinicia con «OOMKilled» y sin ningún error de JavaScript en los logs. ¿Qué ajustas primero?",
  ops:["Nada, es normal","El límite del heap (--max-old-space-size) por debajo de la memoria del contenedor, y buscar qué hace crecer la memoria","Cambiar de Node a Bun","Subir el número de réplicas"],
  ok:1, why:"Si V8 cree que puede crecer más de lo que permite el contenedor, el kernel lo mata antes de que salte el error «heap out of memory». Luego, a buscar la fuga."},
 {t:"vf", p:"Una función que recibe a veces números y a veces cadenas puede ser más lenta porque V8 no consigue mantenerla optimizada.",
  ok:true, why:"V8 optimiza según los tipos observados. Los tipos cambiantes provocan desoptimizaciones. No lo obsesiones, pero en código muy caliente se nota."},
 {t:"codigo", p:"Usa las APIs estándar: parsea <code>https://catappa.dev/cursos?nivel=maestro&amp;pag=2</code> con <code>URL</code> e imprime el host, el valor de <code>nivel</code> y el de <code>pag</code> más uno",
  lenguaje:"js",
  c:`<p>Salida esperada, una por línea: <code>catappa.dev</code>, <code>maestro</code>, <code>3</code>.</p>`,
  plantilla:"const url = new URL(\"https://catappa.dev/cursos?nivel=maestro&pag=2\");\n// usa url.host y url.searchParams\n",
  pruebas:[{salida:"catappa.dev\nmaestro\n3"}],
  pista:"url.searchParams.get(\"nivel\") y Number(url.searchParams.get(\"pag\")) + 1.",
  solucion:"const url = new URL(\"https://catappa.dev/cursos?nivel=maestro&pag=2\");\nconsole.log(url.host);\nconsole.log(url.searchParams.get(\"nivel\"));\nconsole.log(Number(url.searchParams.get(\"pag\")) + 1);",
  why:"Nunca parsees URLs con split o expresiones regulares: <code>URL</code> decodifica, normaliza y es la misma API que en el navegador. Los parámetros siempre llegan como texto."},
 {t:"codigo", p:"Demuestra que <code>structuredClone</code> hace una copia profunda: clona el objeto, cambia <code>copia.etiquetas[0]</code> a <code>\"cambiada\"</code> e imprime la etiqueta original y la de la copia",
  lenguaje:"js",
  plantilla:"const original = { nombre: \"node\", etiquetas: [\"runtime\"], creado: new Date(0) };\n// clona, modifica la copia e imprime las dos etiquetas\n",
  pruebas:[{salida:"runtime\ncambiada\ntrue"}],
  c:`<p>Imprime además, en una tercera línea, si <code>copia.creado</code> sigue siendo un <code>Date</code> (<code>instanceof Date</code>).</p>`,
  pista:"const copia = structuredClone(original); luego console.log de original.etiquetas[0], copia.etiquetas[0] y copia.creado instanceof Date.",
  solucion:"const original = { nombre: \"node\", etiquetas: [\"runtime\"], creado: new Date(0) };\nconst copia = structuredClone(original);\ncopia.etiquetas[0] = \"cambiada\";\nconsole.log(original.etiquetas[0]);\nconsole.log(copia.etiquetas[0]);\nconsole.log(copia.creado instanceof Date);",
  why:"El truco antiguo <code>JSON.parse(JSON.stringify(x))</code> convierte las fechas en texto y pierde Map, Set y undefined. structuredClone los conserva (no copia funciones ni clases propias)."}
]}

]});
