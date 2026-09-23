window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Docker, despliegue y observabilidad",
resumen: "Una imagen Docker de producción para Node, TypeScript en producción, comprobaciones de salud, límites de memoria, métricas con Prometheus y trazas con OpenTelemetry",
nivel: "Experto",
color: "#589834",
lecciones: [

/* =============== U12 L1 =============== */
{
id:"nd7l2",
titulo:"Imagen Docker para Node",
claves:["Imagen multi-stage: dependencias de build separadas, npm ci --omit=dev y usuario node","Copiar package*.json antes que el código para aprovechar la caché de capas","CMD en forma exec con node (o un init), .dockerignore y etiqueta de versión fija"],
pasos:[
 {t:"info", eti:"Empaquetar", h:"Dockerfile para Node",
  c:`<div class="termbox">FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build &amp;&amp; npm prune --omit=dev

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/salud || exit 1
CMD ["node", "dist/server.js"]</div>
     <div class="termbox"># .dockerignore
node_modules
.git
.env*
coverage
dist</div>`},
 {t:"info", eti:"Detalles", h:"Lo que marca la diferencia",
  c:`<ul><li><b>Versión fija</b>: <code>node:24-alpine</code> (o incluso con el parche y el digest), nunca <code>node:latest</code>, que cambia de versión mayor sin avisar.</li>
     <li><b>Alpine usa musl</b>: algunos módulos nativos (sharp, bcrypt, canvas) necesitan binarios para musl o compilar. Si da guerra, <code>node:24-slim</code> (Debian).</li>
     <li><b>Distroless</b> (las imágenes <code>gcr.io/distroless/nodejs…</code> de Google): sin shell ni gestor de paquetes, superficie mínima; a cambio, depurar dentro es más difícil.</li>
     <li><b>Señales</b>: <code>CMD ["node", …]</code> en forma exec; si tu app lanza procesos hijos, añade <code>tini</code> o <code>docker run --init</code> para recoger zombis.</li>
     <li><b>Memoria</b>: fija <code>NODE_OPTIONS=--max-old-space-size</code> por debajo del límite del contenedor (por ejemplo, 75 %).</li></ul>`},
 {t:"par", p:"Empareja cada instrucción con su motivo",
  pares:[["COPY package*.json y npm ci antes de COPY .","Caché de la capa de dependencias"],["npm prune --omit=dev","Quitar Vitest, ESLint y compañía de la imagen final"],["USER node","No ejecutar como root"],["CMD [\"node\", \"dist/server.js\"]","Que SIGTERM llegue directamente a Node"],[".dockerignore con node_modules","No copiar dependencias del host (quizá de otro sistema operativo)"]],
  why:"Cada línea responde a un problema real de producción."},
 {t:"opcion", p:"¿Por qué copiar <code>package*.json</code> y ejecutar <code>npm ci</code> antes de copiar el resto del código?",
  ops:["Por orden alfabético","Para que la capa de dependencias quede en caché y no se reinstale en cada cambio de código","Porque npm lo exige","Para reducir el tamaño"],
  ok:1, why:"Es la misma técnica de capas que viste en el curso de Docker."},
 {t:"vf", p:"<code>npm ci --omit=dev</code> instala también herramientas como Vitest y ESLint en la imagen final.",
  ok:false, why:"Omite las devDependencies: imagen más pequeña y con menos superficie de ataque."},
 {t:"opcion", p:"La imagen funciona en tu Mac pero en el servidor falla con «Error loading shared library» al cargar <code>bcrypt</code>. ¿Qué pasó?",
  ops:["bcrypt no funciona en Linux","Se copió node_modules del host (binarios nativos compilados para macOS) o se compiló para glibc y la imagen es Alpine (musl): hay que instalar dentro de la imagen y con .dockerignore","Falta memoria","Es un problema de red"],
  ok:1, why:"Los módulos nativos se compilan para un sistema concreto. Instala siempre dentro de la imagen, en la misma base que la de ejecución."},
 {t:"codigo", p:"Escribe un revisor de Dockerfiles para Node: lee el Dockerfile por stdin e imprime cada problema encontrado (en este orden) o <code>sin problemas</code>",
  lenguaje:"js",
  c:`<p>Problemas: <code>imagen sin versión fija</code> (algún FROM con <code>:latest</code> o sin etiqueta), <code>usa npm install en vez de npm ci</code>, <code>se ejecuta como root</code> (no hay ninguna línea USER), <code>CMD no llama a node directamente</code> (el último CMD no empieza por <code>["node"</code>).</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").map(l => l.trim());\nconst problemas = [];\n// revisa las cuatro reglas\nconsole.log(problemas.length ? problemas.join(\"\\n\") : \"sin problemas\");\n",
  pruebas:[{entrada:"FROM node:latest\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD npm start\n", salida:"imagen sin versión fija\nusa npm install en vez de npm ci\nse ejecuta como root\nCMD no llama a node directamente"},{entrada:"FROM node:24-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nUSER node\nCMD [\"node\", \"server.js\"]\n", salida:"sin problemas"},{entrada:"FROM node AS build\nRUN npm ci\nFROM node:24-slim\nUSER node\nCMD [\"npm\", \"start\"]\n", salida:"imagen sin versión fija\nCMD no llama a node directamente", oculta:true}],
  pista:"Para FROM: la imagen es la segunda palabra; falla si no contiene \":\" o termina en \":latest\". Para CMD: busca la última línea que empiece por \"CMD\" y comprueba startsWith('CMD [\"node\"').",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").map(l => l.trim());\nconst problemas = [];\nconst froms = lineas.filter(l => /^FROM\\s/i.test(l)).map(l => l.split(/\\s+/)[1]);\nif (froms.some(img => !img.includes(\":\") || img.endsWith(\":latest\"))) problemas.push(\"imagen sin versión fija\");\nif (lineas.some(l => /^RUN\\s.*npm (install|i)(\\s|$)/.test(l))) problemas.push(\"usa npm install en vez de npm ci\");\nif (!lineas.some(l => /^USER\\s/i.test(l))) problemas.push(\"se ejecuta como root\");\nconst cmd = lineas.filter(l => /^CMD\\s/i.test(l)).pop();\nif (!cmd || !cmd.startsWith('CMD [\"node\"')) problemas.push(\"CMD no llama a node directamente\");\nconsole.log(problemas.length ? problemas.join(\"\\n\") : \"sin problemas\");",
  why:"Herramientas como hadolint hacen esto con decenas de reglas y se meten en CI. Automatizar la revisión evita que la misma mala práctica vuelva en cada servicio nuevo."}
]},

/* =============== U12 L2 =============== */
{
id:"nd12n1",
titulo:"Desplegar y observar: salud, métricas y trazas",
claves:["Liveness (¿está vivo?) y readiness (¿puede recibir tráfico?) son comprobaciones distintas","Métricas RED con prom-client (peticiones, errores, duración) y del runtime (event loop, heap, GC)","OpenTelemetry instrumenta HTTP, bases de datos y colas para ver trazas entre servicios"],
pasos:[
 {t:"info", eti:"Salud", h:"Liveness y readiness",
  c:`<div class="termbox">app.get("/salud/viva", (req, res) =&gt; res.sendStatus(200));     // liveness: el proceso responde

app.get("/salud/lista", async (req, res) =&gt; {                 // readiness: puedo atender
  if (cerrando) return res.sendStatus(503);
  try {
    await Promise.race([pool.query("SELECT 1"), rechazarTras(1000)]);
    res.sendStatus(200);
  } catch { res.sendStatus(503); }
});</div>
     <div class="nota ojo"><b class="tit">No metas la base de datos en liveness</b>Si la base de datos cae y la liveness la comprueba, Kubernetes reinicia todos tus pods en bucle… y no arregla nada. Liveness solo mira si el proceso responde; readiness decide si recibe tráfico.</div>
     <p><b>TypeScript en producción</b>: lo habitual es compilar (tsc, esbuild, tsup) y ejecutar el JavaScript. Node 22.18+ y 24 también ejecutan <code>.ts</code> directamente quitando los tipos (sin comprobarlos ni admitir enum o namespace): cómodo para scripts y herramientas.</p>`},
 {t:"info", eti:"Observar", h:"Métricas y trazas",
  c:`<div class="termbox">import client from "prom-client";
client.collectDefaultMetrics();          // heap, GC, retraso del event loop, descriptores…

const duracion = new client.Histogram({
  name: "http_duracion_segundos", help: "Duración de las peticiones",
  labelNames: ["metodo", "ruta", "estado"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5],
});
app.use((req, res, next) =&gt; {
  const fin = duracion.startTimer();
  res.on("finish", () =&gt; fin({ metodo: req.method, ruta: req.route?.path ?? "otra", estado: res.statusCode }));
  next();
});
app.get("/metrics", async (req, res) =&gt; res.type("text/plain").send(await client.register.metrics()));</div>
     <div class="termbox">// trazas: se carga ANTES que el resto de la app
node --import ./otel.js dist/server.js
// otel.js: NodeSDK con getNodeAutoInstrumentations() y exportador OTLP</div>
     <div class="nota ojo"><b class="tit">Cardinalidad</b>Usa la ruta con parámetros (<code>/api/tareas/:id</code>), nunca la URL real (<code>/api/tareas/48213</code>) como etiqueta: cada valor distinto crea una serie nueva y Prometheus acaba sin memoria.</div>`},
 {t:"par", p:"Empareja cada señal con lo que responde",
  pares:[["Métricas","¿Cuánto y con qué tendencia? (tasa de errores, p99)"],["Logs","¿Qué pasó exactamente en este caso?"],["Trazas","¿Por qué servicios pasó esta petición y dónde tardó?"],["Readiness probe","¿Debe este pod recibir tráfico ahora?"]],
  why:"Los tres pilares se enlazan: el trace id en los logs permite saltar de una traza a sus líneas de log."},
 {t:"opcion", p:"Tras un despliegue, la memoria del contenedor sube hasta el límite y Kubernetes lo mata (OOMKilled) cada pocas horas. ¿Qué métricas miras primero?",
  ops:["Solo la CPU","nodejs_heap_size_used_bytes frente al RSS del proceso y su tendencia desde el despliegue, para saber si es el heap (fuga en JS) o memoria nativa, y compararlo con la versión anterior","El número de peticiones","La latencia del DNS"],
  ok:1, why:"Las métricas por defecto de prom-client ya traen el heap y el GC. Si crece el heap, heap snapshots; si solo el RSS, buffers o módulos nativos."},
 {t:"vf", p:"La liveness probe debería fallar si la base de datos no responde, para que Kubernetes reinicie el pod.",
  ok:false, why:"Reiniciar la app no arregla la base de datos y provoca reinicios en cascada. Eso es trabajo de la readiness (dejar de recibir tráfico) y de las alertas."},
 {t:"opcion", p:"¿Por qué el SDK de OpenTelemetry se carga con <code>--import</code> antes que la aplicación?",
  ops:["Por estética","Porque la instrumentación automática necesita parchear http, pg o express antes de que la app los importe; si se carga después, no ve esas llamadas","Porque es más rápido","Porque lo exige Docker"],
  ok:1, why:"Con ESM, la instrumentación se engancha a la carga de módulos: tiene que estar lista antes del primer import."},
 {t:"codigo", p:"Genera un histograma al estilo Prometheus: stdin trae duraciones en segundos (una por línea). Imprime, para cada límite <code>0.1</code>, <code>0.5</code>, <code>1</code> y <code>+Inf</code>, cuántas duraciones son menores o iguales, y al final la cuenta y la suma",
  lenguaje:"js",
  c:`<p>Formato exacto de cada línea: <code>http_duracion_segundos_bucket{le="0.1"} 2</code>; después <code>http_duracion_segundos_count 5</code> y <code>http_duracion_segundos_sum 3.4</code> (suma redondeada a 3 decimales con <code>Number(x.toFixed(3))</code>). Los buckets son acumulativos.</p>`,
  plantilla:"const d = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(Number);\nconst limites = [0.1, 0.5, 1, Infinity];\n// imprime buckets, count y sum\n",
  pruebas:[{entrada:"0.05\n0.08\n0.3\n0.97\n2\n", salida:"http_duracion_segundos_bucket{le=\"0.1\"} 2\nhttp_duracion_segundos_bucket{le=\"0.5\"} 3\nhttp_duracion_segundos_bucket{le=\"1\"} 4\nhttp_duracion_segundos_bucket{le=\"+Inf\"} 5\nhttp_duracion_segundos_count 5\nhttp_duracion_segundos_sum 3.4"},{entrada:"0.1\n0.1\n", salida:"http_duracion_segundos_bucket{le=\"0.1\"} 2\nhttp_duracion_segundos_bucket{le=\"0.5\"} 2\nhttp_duracion_segundos_bucket{le=\"1\"} 2\nhttp_duracion_segundos_bucket{le=\"+Inf\"} 2\nhttp_duracion_segundos_count 2\nhttp_duracion_segundos_sum 0.2", oculta:true}],
  pista:"Para cada límite: d.filter(x => x <= l).length. La etiqueta de Infinity se escribe \"+Inf\".",
  solucion:"const d = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(Number);\nconst limites = [0.1, 0.5, 1, Infinity];\nfor (const l of limites) {\n  const et = l === Infinity ? \"+Inf\" : String(l);\n  console.log(\"http_duracion_segundos_bucket{le=\\\"\" + et + \"\\\"} \" + d.filter(x => x <= l).length);\n}\nconsole.log(\"http_duracion_segundos_count \" + d.length);\nconsole.log(\"http_duracion_segundos_sum \" + Number(d.reduce((a, b) => a + b, 0).toFixed(3)));",
  why:"Un histograma guarda cuentas por intervalo, no cada valor: por eso es barato. Con los buckets, Prometheus estima percentiles con histogram_quantile, y con count y sum, la media."},
 {t:"codigo", p:"Implementa la comprobación de readiness: ejecuta todas las comprobaciones a la vez, cada una con un límite de 100 ms, e imprime <code>200 listo</code> o <code>503</code> seguido de las que fallaron",
  lenguaje:"js",
  c:`<p>La plantilla prueba dos escenarios. Salida: <code>200 listo</code> y <code>503 redis,cola</code> (redis tarda demasiado y cola falla).</p>`,
  plantilla:"const dormir = ms => new Promise(r => setTimeout(r, ms));\nconst conLimite = (p, ms) => Promise.race([p, dormir(ms).then(() => { throw new Error(\"tiempo agotado\"); })]);\n\nasync function readiness(checks) {\n  // checks: { nombre: () => Promise }. Devuelve el texto de la respuesta\n}\n\n(async () => {\n  console.log(await readiness({ db: () => dormir(10), redis: () => dormir(20) }));\n  console.log(await readiness({ db: () => dormir(10), redis: () => dormir(500), cola: async () => { throw new Error(\"caída\"); } }));\n  process.exit(0);\n})();\n",
  pruebas:[{salida:"200 listo\n503 redis,cola"}],
  pista:"const nombres = Object.keys(checks); const r = await Promise.allSettled(nombres.map(n => conLimite(checks[n](), 100))); los que tengan status \"rejected\" son los fallidos.",
  solucion:"const dormir = ms => new Promise(r => setTimeout(r, ms));\nconst conLimite = (p, ms) => Promise.race([p, dormir(ms).then(() => { throw new Error(\"tiempo agotado\"); })]);\n\nasync function readiness(checks) {\n  const nombres = Object.keys(checks);\n  const r = await Promise.allSettled(nombres.map(n => conLimite(checks[n](), 100)));\n  const fallidos = nombres.filter((n, i) => r[i].status === \"rejected\");\n  return fallidos.length ? \"503 \" + fallidos.join(\",\") : \"200 listo\";\n}\n\n(async () => {\n  console.log(await readiness({ db: () => dormir(10), redis: () => dormir(20) }));\n  console.log(await readiness({ db: () => dormir(10), redis: () => dormir(500), cola: async () => { throw new Error(\"caída\"); } }));\n  process.exit(0);\n})();",
  why:"Una comprobación de salud sin límite de tiempo puede colgarse tanto como la dependencia que vigila, y la sonda de Kubernetes la daría por fallida sin saber por qué. Decir qué dependencia falla ahorra minutos en un incidente."}
]},

/* =============== U12 L3 =============== */
{
id:"nd12n2",
titulo:"TypeScript, build y actualizar de versión",
claves:["tsconfig para Node: module nodenext, target moderno y comprobación de tipos en CI con tsc --noEmit","Compilar (tsc, esbuild, tsup) y ejecutar JavaScript con --enable-source-maps; Node 22.18+ también ejecuta .ts quitando los tipos","Subir de LTS en LTS: leer los cambios incompatibles, probar en CI con las dos versiones y desplegar gradualmente"],
pasos:[
 {t:"info", eti:"TypeScript", h:"TypeScript para un servicio de Node",
  c:`<div class="termbox">// tsconfig.json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",              // resuelve como Node: ESM/CJS según package.json
    "outDir": "dist",
    "strict": true,
    "sourceMap": true,
    "verbatimModuleSyntax": true,      // import type explícito
    "erasableSyntaxOnly": true         // sin enum ni namespace: compatible con quitar tipos
  }
}</div>
     <div class="termbox">npx tsc --noEmit                         # CI: solo comprobar tipos
npx tsc                                  # compilar a dist/
node --enable-source-maps dist/server.js # errores con líneas del .ts original
node src/script.ts                       # Node 22.18+ y 24: quita los tipos y ejecuta
npx tsx watch src/server.ts              # desarrollo con recarga</div>
     <div class="nota ojo"><b class="tit">Quitar tipos no es comprobarlos</b>Cuando Node ejecuta un <code>.ts</code>, borra las anotaciones sin mirar si son correctas. La comprobación sigue siendo cosa de <code>tsc</code> en tu editor y en CI.</div>`},
 {t:"info", eti:"Mantenimiento", h:"Subir de versión de Node",
  c:`<div class="dg"><div class="dg-tit">de Node 22 a Node 24 sin sustos</div>
       <div class="dg-vert"><div class="dg-caja">leer las notas de la versión mayor<small>cambios incompatibles y APIs retiradas</small></div><div class="dg-caja">CI con una matriz: 22 y 24<small>pruebas y avisos de deprecación (--throw-deprecation)</small></div><div class="dg-caja">actualizar dependencias nativas<small>sharp, bcrypt, argon2… se compilan contra la versión de Node</small></div><div class="dg-caja acento">cambiar la imagen base, .nvmrc y engines</div><div class="dg-caja ok">despliegue gradual (canary) vigilando p99, errores y memoria</div></div></div>
     <p>Hazlo mientras la versión vieja aún tiene soporte, no el mes en que caduca.</p>`},
 {t:"par", p:"Empareja cada herramienta con su papel",
  pares:[["tsc --noEmit","Comprobar tipos sin generar ficheros"],["esbuild o tsup","Compilar y empaquetar muy rápido (sin comprobar tipos)"],["tsx","Ejecutar TypeScript en desarrollo con recarga"],["--enable-source-maps","Pilas de error con las líneas del código TypeScript"]],
  why:"Lo habitual: tsc para comprobar y un compilador rápido (o tsc mismo) para generar dist."},
 {t:"opcion", p:"El equipo quiere desplegar ejecutando directamente <code>node src/server.ts</code> en Node 24. ¿Qué tienes que tener en cuenta?",
  ops:["Nada, es idéntico a compilar","Que Node solo quita los tipos: no admite sintaxis que genere código (enum, namespace, parameter properties), no comprueba tipos y las importaciones deben llevar la extensión .ts; la comprobación sigue en CI","Que no funciona con ESM","Que necesita Deno"],
  ok:1, why:"Por eso existe erasableSyntaxOnly en tsconfig: te avisa de lo que Node no podría ejecutar tal cual."},
 {t:"vf", p:"Al subir de versión mayor de Node conviene reinstalar las dependencias con módulos nativos, porque se compilan para una versión concreta del runtime.",
  ok:true, why:"Si no, al arrancar aparece «was compiled against a different Node.js version». Los módulos basados en Node-API suelen ser compatibles entre versiones, pero no todos lo son."},
 {t:"opcion", p:"Un servicio en producción imprime errores con líneas como <code>dist/server.js:1:48213</code>, imposibles de leer. ¿Qué te falta?",
  ops:["Más logs","Generar mapas de fuente (sourceMap en tsconfig o en el empaquetador) y arrancar con --enable-source-maps","Desactivar la minificación en todos los casos","Usar console.error"],
  ok:1, why:"Con los mapas de fuente, la pila apunta al .ts original y a la línea exacta."},
 {t:"codigo", p:"Planifica una actualización: para cada versión de Node de stdin, indica si carga ESM con <code>require()</code> sin opciones y si sigue con soporte en septiembre de 2026",
  lenguaje:"js",
  c:`<p>Reglas: <code>require(esm)</code> sin opciones desde 20.19 (línea 20), 22.12 (línea 22) y en cualquier versión 23 o posterior. Con soporte en septiembre de 2026: las líneas 22 y 24 (LTS) y la 26 (Current). Formato: <code>VERSION require-esm=si|no soporte=si|no</code>.</p>`,
  plantilla:"const versiones = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const v of versiones) {\n  const [mayor, menor] = v.split(\".\").map(Number);\n  // decide e imprime\n}\n",
  pruebas:[{entrada:"22.11.0\n22.12.0\n24.8.0\n", salida:"22.11.0 require-esm=no soporte=si\n22.12.0 require-esm=si soporte=si\n24.8.0 require-esm=si soporte=si"},{entrada:"20.18.1\n20.19.0\n18.20.4\n", salida:"20.18.1 require-esm=no soporte=no\n20.19.0 require-esm=si soporte=no\n18.20.4 require-esm=no soporte=no"},{entrada:"23.0.0\n26.1.0\n25.2.0\n", salida:"23.0.0 require-esm=si soporte=no\n26.1.0 require-esm=si soporte=si\n25.2.0 require-esm=si soporte=no", oculta:true}],
  pista:"requireEsm = mayor >= 23 || (mayor === 22 && menor >= 12) || (mayor === 20 && menor >= 19). soporte = [22, 24, 26].includes(mayor).",
  solucion:"const versiones = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const v of versiones) {\n  const [mayor, menor] = v.split(\".\").map(Number);\n  const requireEsm = mayor >= 23 || (mayor === 22 && menor >= 12) || (mayor === 20 && menor >= 19);\n  const soporte = [22, 24, 26].includes(mayor);\n  console.log(v + \" require-esm=\" + (requireEsm ? \"si\" : \"no\") + \" soporte=\" + (soporte ? \"si\" : \"no\"));\n}",
  why:"Las impares (23, 25) tienen las funciones nuevas pero caducan pronto: no son para producción. Comparar números y no cadenas evita el clásico «22.9» mayor que «22.12»."}
]}

]});
