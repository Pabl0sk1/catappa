window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Ficheros, buffers, eventos y streams",
resumen: "fs con promesas y rutas portables, escritura atómica, buffers y codificaciones, EventEmitter y streams con contrapresión y pipeline",
nivel: "Intermedio",
color: "#72b24d",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"nd2l1",
titulo:"Ficheros y rutas",
claves:["node:fs/promises con await para leer y escribir sin bloquear","Las versiones Sync bloquean el event loop: solo en scripts y al arrancar","path.join y path.resolve construyen rutas portables; escribir en temporal y renombrar evita ficheros a medias"],
pasos:[
 {t:"info", eti:"Disco", h:"fs y path",
  c:`<div class="termbox">import { readFile, writeFile, mkdir, readdir, stat, rm, rename } from "node:fs/promises";
import path from "node:path";

const ruta = path.join(import.meta.dirname, "datos", "config.json");   // portable
const config = JSON.parse(await readFile(ruta, "utf8"));

await mkdir("salida", { recursive: true });
await writeFile("salida/informe.txt", "Hola\\n");
await writeFile("salida/log.txt", "otra línea\\n", { flag: "a" });  // añadir al final
const ficheros = await readdir("salida", { withFileTypes: true });
const info = await stat("salida/informe.txt");                      // tamaño, fechas…
await rm("tmp", { recursive: true, force: true });

readFileSync("x.txt");     // bloquea: nunca dentro de una petición HTTP</div>
     <p>Los errores traen un <code>code</code>: <code>ENOENT</code> (no existe), <code>EACCES</code> (sin permiso), <code>EEXIST</code> (ya existe), <code>EISDIR</code> (es una carpeta). Compara por <code>err.code</code>, nunca por el texto del mensaje.</p>`},
 {t:"info", eti:"Sin corromper", h:"Escritura atómica",
  c:`<p>Si el proceso muere a mitad de un <code>writeFile</code>, te quedas con un JSON cortado. La solución clásica: escribir en un temporal y renombrar. En el mismo sistema de ficheros, <code>rename</code> es atómico: o está el fichero viejo entero, o el nuevo entero.</p>
     <div class="termbox">async function guardarAtomico(ruta, datos) {
  const tmp = \`\${ruta}.\${process.pid}.tmp\`;
  await writeFile(tmp, JSON.stringify(datos));
  await rename(tmp, ruta);
}</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">path en una línea</div>
       <table class="dg-tabla"><tbody>
       <tr><td>path.join("a", "b", "../c.txt")</td><td>a/c.txt</td></tr>
       <tr><td>path.resolve("datos")</td><td>ruta absoluta desde process.cwd()</td></tr>
       <tr><td>path.basename("/x/informe.pdf")</td><td>informe.pdf</td></tr>
       <tr><td>path.extname("foto.tar.gz")</td><td>.gz</td></tr>
       <tr><td>path.dirname("/x/y/z.txt")</td><td>/x/y</td></tr>
       </tbody></table></div>`},
 {t:"par", p:"Empareja cada función con su uso",
  pares:[["readFile(ruta, \"utf8\")","Leer un fichero de texto completo"],["writeFile","Escribir (o sobrescribir) un fichero"],["mkdir(ruta, { recursive: true })","Crear carpetas intermedias"],["path.join","Unir partes de una ruta con el separador del sistema"],["readFileSync","Lectura síncrona que bloquea el hilo"]],
  why:"path.join evita problemas entre / en Linux y \\ en Windows."},
 {t:"opcion", p:"¿Por qué no usar <code>fs.readFileSync</code> dentro del manejador de una petición HTTP?",
  ops:["Porque no existe","Bloquea el event loop: mientras lee, el servidor no atiende a nadie más","Porque es más lento de escribir","Porque no lee UTF-8"],
  ok:1, why:"En código de servidor, siempre la versión asíncrona. Al arrancar (leer la configuración una vez) Sync es aceptable."},
 {t:"opcion", p:"Quieres leer <code>ajustes.json</code> y, si no existe, usar valores por defecto. ¿Cómo lo distingues de otros errores?",
  ops:["Comparando err.message con \"no such file\"","Con try/catch y err.code === \"ENOENT\"; cualquier otro error se relanza","Con fs.existsSync antes de leer","Ignorando todos los errores"],
  ok:1, why:"Comprobar con existsSync y luego leer deja una carrera (el fichero puede desaparecer entre medias). Intenta la operación y trata el error concreto."},
 {t:"codigo", p:"Guarda un objeto como JSON en <code>datos/config.json</code> (crea la carpeta), vuelve a leerlo y muestra su propiedad <code>puerto</code> más 1",
  lenguaje:"js",
  c:`<p>El objeto es <code>{ puerto: 3000, entorno: \"dev\" }</code>. Salida: <code>3001</code>. Usa <code>node:fs/promises</code>.</p>`,
  plantilla:"const { mkdir, writeFile, readFile } = require(\"node:fs/promises\");\nconst path = require(\"node:path\");\n\nasync function main() {\n  // crea datos/, escribe el JSON, léelo e imprime puerto + 1\n}\nmain();\n",
  pruebas:[{salida:"3001"}],
  pista:"await mkdir(\"datos\", { recursive: true }); const ruta = path.join(\"datos\", \"config.json\"); JSON.stringify al escribir y JSON.parse al leer.",
  solucion:"const { mkdir, writeFile, readFile } = require(\"node:fs/promises\");\nconst path = require(\"node:path\");\n\nasync function main() {\n  await mkdir(\"datos\", { recursive: true });\n  const ruta = path.join(\"datos\", \"config.json\");\n  await writeFile(ruta, JSON.stringify({ puerto: 3000, entorno: \"dev\" }));\n  const config = JSON.parse(await readFile(ruta, \"utf8\"));\n  console.log(config.puerto + 1);\n}\nmain();",
  why:"Sin recursive: true, mkdir fallaría con EEXIST la segunda vez. Y JSON.parse devuelve números como números: puerto + 1 suma, no concatena."},
 {t:"codigo", p:"Lee un fichero que puede no existir: si da <code>ENOENT</code>, imprime <code>por defecto</code>; si existe, su contenido",
  lenguaje:"js",
  c:`<p>Se llama dos veces: primero con <code>no-existe.txt</code> y después con un fichero que el programa crea con el texto <code>hola</code>. Salida: <code>por defecto</code> y <code>hola</code>.</p>`,
  plantilla:"const fs = require(\"node:fs/promises\");\n\nasync function leerOPorDefecto(ruta) {\n  // devuelve el contenido o \"por defecto\" si no existe\n}\n\n(async () => {\n  console.log(await leerOPorDefecto(\"no-existe.txt\"));\n  await fs.writeFile(\"existe.txt\", \"hola\");\n  console.log(await leerOPorDefecto(\"existe.txt\"));\n})();\n",
  pruebas:[{salida:"por defecto\nhola"}],
  pista:"try { return await fs.readFile(ruta, \"utf8\"); } catch (e) { if (e.code === \"ENOENT\") return \"por defecto\"; throw e; }",
  solucion:"const fs = require(\"node:fs/promises\");\n\nasync function leerOPorDefecto(ruta) {\n  try {\n    return await fs.readFile(ruta, \"utf8\");\n  } catch (e) {\n    if (e.code === \"ENOENT\") return \"por defecto\";\n    throw e;\n  }\n}\n\n(async () => {\n  console.log(await leerOPorDefecto(\"no-existe.txt\"));\n  await fs.writeFile(\"existe.txt\", \"hola\");\n  console.log(await leerOPorDefecto(\"existe.txt\"));\n})();",
  why:"Relanzar el resto de errores es clave: un EACCES (permisos) no debe convertirse silenciosamente en «valores por defecto»."}
]},

/* =============== U4 L2 =============== */
{
id:"nd4n1",
titulo:"Buffers y codificaciones",
claves:["Un Buffer es una secuencia de bytes (un Uint8Array con extras)","Un carácter en UTF-8 ocupa de 1 a 4 bytes: length de un string no son bytes","Codificaciones: utf8, base64, base64url y hex"],
pasos:[
 {t:"info", eti:"Bytes", h:"Qué es un Buffer",
  c:`<p>Los ficheros, sockets y hashes trabajan con <b>bytes</b>, no con texto. Node los representa con <code>Buffer</code>, una subclase de <code>Uint8Array</code>.</p>
     <div class="termbox">const b = Buffer.from("España", "utf8");
b.length;                     // 7: la ñ ocupa 2 bytes
"España".length;              // 6 caracteres
Buffer.byteLength("€");       // 3
b.toString("hex");            // 45737061c3b161
b.toString("base64");         // RXNwYcOxYQ==
Buffer.from("RXNwYcOxYQ==", "base64").toString();   // España

Buffer.alloc(16);             // 16 bytes a cero
Buffer.allocUnsafe(16);       // más rápido, pero con basura previa de la memoria
Buffer.concat([b1, b2]);      // unir trozos</div>
     <div class="nota ojo"><b class="tit">Trozos que parten un carácter</b>Si lees un stream y haces <code>texto += chunk.toString()</code>, un carácter de 2 bytes puede quedar partido entre dos chunks y salir como <code>�</code>. Usa <code>stream.setEncoding("utf8")</code> o <code>StringDecoder</code>, que guardan el byte a medias hasta el siguiente trozo, o junta los Buffers con <code>Buffer.concat</code> y decodifica al final.</div>`},
 {t:"par", p:"Empareja cada codificación con su uso típico",
  pares:[["utf8","Texto en cualquier idioma"],["hex","Mostrar hashes (sha256 de 64 caracteres)"],["base64","Adjuntos en JSON o correos, cabecera Basic"],["base64url","Tokens en URLs y JWT (sin + / =)"]],
  why:"base64 aumenta el tamaño un 33 %: no es cifrado, solo una forma de representar bytes como texto."},
 {t:"opcion", p:"<code>res.setHeader(\"Content-Length\", texto.length)</code> corta la respuesta cuando el texto lleva tildes. ¿Por qué?",
  ops:["Por las tildes en sí","length cuenta caracteres, no bytes; hay que usar Buffer.byteLength(texto)","Content-Length no existe","Falta el charset"],
  ok:1, why:"Con UTF-8, «acción» son 6 caracteres y 7 bytes. El navegador leería 6 bytes y cortaría el último."},
 {t:"vf", p:"Codificar una contraseña en base64 la protege si alguien lee la base de datos.",
  ok:false, why:"base64 se decodifica al instante, no tiene clave. Las contraseñas se guardan con un hash lento (argon2, bcrypt)."},
 {t:"escribe", p:"¿Cuántos bytes ocupa <code>\"año\"</code> en UTF-8? (escribe el número)",
  sol:["4"], pista:"a y o ocupan 1 byte; la ñ, 2.",
  why:"Los caracteres ASCII ocupan 1 byte; la mayoría de letras latinas con tilde, 2; el símbolo del euro y muchos asiáticos, 3; los emojis, 4."},
 {t:"codigo", p:"Para cada línea de stdin, imprime <code>caracteres/bytes</code> (por ejemplo <code>6/7</code> para <code>España</code>)",
  lenguaje:"js",
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(Boolean);\nfor (const l of lineas) {\n  // imprime caracteres/bytes\n}\n",
  pruebas:[{entrada:"España\nhola\n", salida:"6/7\n4/4"},{entrada:"acción\n", salida:"6/7"},{entrada:"año€\n", salida:"4/7", oculta:true}],
  pista:"l.length para caracteres y Buffer.byteLength(l) (o Buffer.from(l).length) para bytes.",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(Boolean);\nfor (const l of lineas) {\n  console.log(l.length + \"/\" + Buffer.byteLength(l));\n}",
  why:"Cualquier límite de tamaño (un campo VARCHAR en bytes, Content-Length, el tamaño máximo de un mensaje) se mide en bytes, no en caracteres."},
 {t:"codigo", p:"Construye la cabecera de autenticación Basic: lee <code>usuario:clave</code> de stdin e imprime <code>Basic</code> seguido del texto en base64; después decodifícala para comprobarla",
  lenguaje:"js",
  c:`<p>Con <code>ana:secreto</code> la salida es <code>Basic YW5hOnNlY3JldG8=</code> y, en la segunda línea, <code>ana:secreto</code>.</p>`,
  plantilla:"const par = require(\"node:fs\").readFileSync(0, \"utf8\").trim();\n// codifica y decodifica\n",
  pruebas:[{entrada:"ana:secreto\n", salida:"Basic YW5hOnNlY3JldG8=\nana:secreto"},{entrada:"admin:1234\n", salida:"Basic YWRtaW46MTIzNA==\nadmin:1234", oculta:true}],
  pista:"Buffer.from(par).toString(\"base64\"); para decodificar, Buffer.from(b64, \"base64\").toString(\"utf8\").",
  solucion:"const par = require(\"node:fs\").readFileSync(0, \"utf8\").trim();\nconst b64 = Buffer.from(par, \"utf8\").toString(\"base64\");\nconsole.log(\"Basic \" + b64);\nconsole.log(Buffer.from(b64, \"base64\").toString(\"utf8\"));",
  why:"Por eso la autenticación Basic solo es aceptable sobre HTTPS: cualquiera que vea la cabecera tiene la contraseña."}
]},

/* =============== U4 L3 =============== */
{
id:"nd2l2",
titulo:"Eventos con EventEmitter",
claves:["EventEmitter: on, once, off y emit; los listeners se ejecutan de forma síncrona y en orden","Un evento \"error\" sin listener tumba el proceso","Demasiados listeners avisan de una posible fuga; events.once los convierte en promesas"],
pasos:[
 {t:"info", eti:"Reaccionar", h:"EventEmitter",
  c:`<div class="termbox">import { EventEmitter, once } from "node:events";

class Pedidos extends EventEmitter {
  pagar(p) { /* ... */ this.emit("pagado", p); }
}
const pedidos = new Pedidos();
pedidos.on("pagado", p =&gt; enviarCorreo(p));
pedidos.on("pagado", p =&gt; avisarAlmacen(p));
pedidos.once("pagado", () =&gt; console.log("primer pedido pagado"));
pedidos.pagar({ id: 42 });

const [p] = await once(pedidos, "pagado");   // esperar un evento como promesa</div>
     <p>Muchas APIs de Node son emisores: servidores (<code>request</code>), streams (<code>data</code>, <code>end</code>), procesos (<code>exit</code>) y el propio <code>process</code> (<code>SIGTERM</code>).</p>`},
 {t:"info", eti:"Trampas", h:"Lo que hay que saber",
  c:`<ul><li><b>Es síncrono</b>: <code>emit</code> llama a los listeners uno tras otro antes de volver. Un listener lento retrasa al que emite.</li>
     <li><b>El evento <code>error</code> es especial</b>: si nadie lo escucha, <code>emit("error")</code> lanza la excepción y, si nadie la captura, el proceso termina.</li>
     <li><b>Fugas</b>: si registras un listener por petición y nunca lo quitas, Node avisa con <code>MaxListenersExceededWarning</code> al pasar de 10 en el mismo evento. No subas el límite a ciegas: busca por qué no se quitan.</li></ul>
     <div class="termbox">const fn = datos =&gt; { ... };
bus.on("precio", fn);
req.on("close", () =&gt; bus.off("precio", fn));    // quitarlo cuando la petición termina</div>`},
 {t:"par", p:"Empareja cada método con su efecto",
  pares:[["on","Escuchar todas las veces que ocurra"],["once","Escuchar solo la primera vez"],["off","Dejar de escuchar"],["emit","Disparar el evento con sus datos"],["listenerCount","Saber cuántos escuchan (útil para detectar fugas)"]],
  why:"on es alias de addListener y off de removeListener."},
 {t:"opcion", p:"Un stream emite <code>error</code> y el proceso entero se cae con «Unhandled 'error' event». ¿Qué faltaba?",
  ops:["Un try/catch alrededor de createReadStream","Un listener stream.on(\"error\", ...) o usar pipeline, que gestiona los errores de todos los streams","Más memoria","await antes del stream"],
  ok:1, why:"Los errores de un emisor llegan por evento, no por excepción: un try/catch síncrono no los ve."},
 {t:"vf", p:"<code>emitter.emit(\"evento\")</code> ejecuta los listeners en una vuelta posterior del event loop.",
  ok:false, why:"Los ejecuta en el momento, de forma síncrona y en el orden en que se registraron. Si quieres diferirlos, el listener puede usar setImmediate o queueMicrotask."},
 {t:"opcion", p:"Aparece <code>MaxListenersExceededWarning: 11 precio listeners added</code> tras unas horas en producción. ¿Qué sospechas?",
  ops:["Que el límite es bajo: se sube a 1000","Una fuga: cada petición o conexión añade un listener que nunca se quita","Un problema de red","Que hay 11 réplicas"],
  ok:1, why:"Cada listener retiene lo que captura su closure: la memoria crece sin parar. Quita el listener al terminar (off, o usa once o un AbortSignal)."},
 {t:"codigo", p:"Crea un emisor de pedidos: registra un listener <code>on</code> que imprima <code>pagado N</code> y un <code>once</code> que imprima <code>primer pago</code>; emite los pedidos 1 y 2 y muestra al final cuántos listeners quedan",
  lenguaje:"js",
  c:`<p>Salida: <code>pagado 1</code>, <code>primer pago</code>, <code>pagado 2</code>, <code>listeners=1</code>.</p>`,
  plantilla:"const { EventEmitter } = require(\"node:events\");\nconst pedidos = new EventEmitter();\n// registra los listeners, emite \"pagado\" con 1 y con 2 e imprime listenerCount\n",
  pruebas:[{salida:"pagado 1\nprimer pago\npagado 2\nlisteners=1"}],
  pista:"pedidos.on(\"pagado\", id => ...) antes que pedidos.once(...). Al final pedidos.listenerCount(\"pagado\").",
  solucion:"const { EventEmitter } = require(\"node:events\");\nconst pedidos = new EventEmitter();\npedidos.on(\"pagado\", id => console.log(\"pagado \" + id));\npedidos.once(\"pagado\", () => console.log(\"primer pago\"));\npedidos.emit(\"pagado\", 1);\npedidos.emit(\"pagado\", 2);\nconsole.log(\"listeners=\" + pedidos.listenerCount(\"pagado\"));",
  why:"Los listeners se ejecutan en orden de registro, de forma síncrona. once se borra solo tras la primera ejecución: por eso queda uno."},
 {t:"codigo", p:"Protege un emisor: emite un evento <code>error</code> con el mensaje <code>fallo de conexión</code> sin que el proceso se caiga, imprimiendo <code>capturado: fallo de conexión</code>, y luego imprime <code>sigo vivo</code>",
  lenguaje:"js",
  plantilla:"const { EventEmitter } = require(\"node:events\");\nconst conexion = new EventEmitter();\n// añade lo necesario antes de emitir\nconexion.emit(\"error\", new Error(\"fallo de conexión\"));\nconsole.log(\"sigo vivo\");\n",
  pruebas:[{salida:"capturado: fallo de conexión\nsigo vivo"}],
  pista:"conexion.on(\"error\", e => console.log(\"capturado: \" + e.message)); antes del emit.",
  solucion:"const { EventEmitter } = require(\"node:events\");\nconst conexion = new EventEmitter();\nconexion.on(\"error\", e => console.log(\"capturado: \" + e.message));\nconexion.emit(\"error\", new Error(\"fallo de conexión\"));\nconsole.log(\"sigo vivo\");",
  why:"Sin el listener, ese emit lanza la excepción y el programa termina antes de «sigo vivo». Todo emisor que pueda fallar necesita su on(\"error\")."}
]},

/* =============== U4 L4 =============== */
{
id:"nd4n2",
titulo:"Streams, contrapresión y pipeline",
claves:["Un stream procesa datos por trozos: memoria constante aunque el fichero sea enorme","Contrapresión: write() devuelve false cuando el destino va lento; pipeline la gestiona por ti","Readable, Writable, Duplex y Transform; se leen con for await y se encadenan con pipeline"],
pasos:[
 {t:"info", eti:"Datos grandes", h:"Streams",
  c:`<div class="termbox">import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

// comprimir un log de 5 GB con unos pocos MB de memoria
await pipeline(
  createReadStream("app.log"),
  createGzip(),
  createWriteStream("app.log.gz"),
);

// servir un fichero grande sin cargarlo entero
app.get("/descarga", async (req, res) =&gt; {
  res.setHeader("Content-Type", "application/pdf");
  await pipeline(createReadStream("informe.pdf"), res);
});</div>
     <p>Con <code>readFile</code>, un fichero de 5 GB acabaría en memoria. Un stream lo procesa en trozos (chunks, de 64 KiB por defecto en los ficheros).</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">los cuatro tipos</div>
       <table class="dg-tabla"><tbody>
       <tr><td>Readable</td><td>fuente: fichero, cuerpo de una petición, process.stdin</td></tr>
       <tr><td>Writable</td><td>destino: fichero, respuesta HTTP, process.stdout</td></tr>
       <tr><td>Duplex</td><td>las dos cosas por separado: un socket TCP</td></tr>
       <tr><td>Transform</td><td>Duplex que transforma lo que pasa: gzip, cifrado, CSV → JSON</td></tr>
       </tbody></table></div>`},
 {t:"info", eti:"Ir al ritmo", h:"Contrapresión (backpressure)",
  c:`<p>Si lees de un disco rápido y escribes a un cliente lento, los datos se acumulan en memoria. La <b>contrapresión</b> lo evita: cada stream tiene un búfer (<code>highWaterMark</code>) y, cuando se llena, <code>write()</code> devuelve <code>false</code>. Quien escribe debe parar hasta el evento <code>drain</code>.</p>
     <div class="dg"><div class="dg-tit">el flujo se regula solo</div>
       <div class="dg-flujo"><div class="dg-caja">Readable<small>disco: rápido</small></div><div class="dg-caja acento">búfer lleno<small>write() → false</small></div><div class="dg-caja aviso">Writable<small>cliente: lento</small></div></div>
       <div class="dg-nota arriba">la lectura se pausa hasta «drain» y se reanuda sola</div></div>
     <div class="termbox">// a mano (lo que pipeline hace por ti)
for (const linea of lineas) {
  if (!destino.write(linea)) await once(destino, "drain");
}

// leer con for await: también respeta la contrapresión
for await (const chunk of createReadStream("datos.csv")) { ... }</div>
     <div class="nota ojo"><b class="tit">Por qué pipeline y no .pipe()</b><code>a.pipe(b).pipe(c)</code> no propaga errores ni cierra los demás streams si uno falla: deja descriptores abiertos y fugas. <code>pipeline</code> (de <code>node:stream/promises</code>) propaga el error, destruye todos los streams y devuelve una promesa.</div>`},
 {t:"par", p:"Empareja cada tipo de stream con un ejemplo",
  pares:[["Readable","Leer un fichero o el cuerpo de una petición"],["Writable","Escribir a un fichero o la respuesta HTTP"],["Transform","Comprimir, cifrar o convertir CSV a JSON por el camino"],["Duplex","Un socket TCP: lees y escribes por separado"]],
  why:"req y res de un servidor HTTP de Node son streams."},
 {t:"opcion", p:"Tienes que procesar un CSV de 10 GB línea a línea. ¿Qué enfoque usas?",
  ops:["readFile y split(\"\\n\")","Un stream de lectura con readline o un parser de CSV en streaming","Subir la memoria de Node a 16 GB","Copiarlo a la base de datos a mano"],
  ok:1, why:"Memoria constante e independiente del tamaño del fichero."},
 {t:"vf", p:"<code>pipeline</code> propaga los errores de cualquier stream de la cadena y cierra todos correctamente.",
  ok:true, why:"Con .pipe() encadenado, los errores y cierres hay que gestionarlos a mano."},
 {t:"opcion", p:"Un exportador escribe un millón de filas con <code>res.write(fila)</code> en un bucle sin mirar lo que devuelve, y con clientes lentos la memoria se dispara. ¿Qué falta?",
  ops:["Un res.end() antes","Respetar la contrapresión: si write() devuelve false, esperar a \"drain\" (o generar las filas como Readable y usar pipeline)","Comprimir","Subir highWaterMark a 1 GB"],
  ok:1, why:"write() nunca rechaza los datos: los encola en memoria. Devolver false es su forma de pedir que pares."},
 {t:"codigo", p:"Escribe un Transform que pase a mayúsculas lo que entra por stdin y lo saque por stdout, conectándolo con <code>pipeline</code>",
  lenguaje:"js",
  plantilla:"const { Transform } = require(\"node:stream\");\nconst { pipeline } = require(\"node:stream/promises\");\n\nconst mayusculas = new Transform({\n  transform(chunk, codificacion, callback) {\n    // pasa el trozo transformado\n  }\n});\n\npipeline(process.stdin, mayusculas, process.stdout);\n",
  pruebas:[{entrada:"hola node\n", salida:"HOLA NODE"},{entrada:"streams\ny pipeline\n", salida:"STREAMS\nY PIPELINE"},{entrada:"año ñu\n", salida:"AÑO ÑU", oculta:true}],
  pista:"callback(null, chunk.toString().toUpperCase());",
  solucion:"const { Transform } = require(\"node:stream\");\nconst { pipeline } = require(\"node:stream/promises\");\n\nconst mayusculas = new Transform({\n  transform(chunk, codificacion, callback) {\n    callback(null, chunk.toString().toUpperCase());\n  }\n});\n\npipeline(process.stdin, mayusculas, process.stdout);",
  why:"callback(null, datos) empuja el resultado y pide el siguiente trozo. En producción, añade setEncoding o un StringDecoder para no partir caracteres multibyte entre chunks."},
 {t:"codigo", p:"Cuenta líneas de un stream sin cargarlo entero: usa <code>readline</code> sobre <code>process.stdin</code> con <code>for await</code> e imprime <code>lineas=N</code> y <code>errores=M</code> (líneas que empiezan por <code>ERROR</code>)",
  lenguaje:"js",
  plantilla:"const readline = require(\"node:readline\");\n\nasync function main() {\n  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });\n  // recorre rl con for await\n}\nmain();\n",
  pruebas:[{entrada:"INFO a\nERROR b\nINFO c\n", salida:"lineas=3\nerrores=1"},{entrada:"ERROR x\nERROR y\n", salida:"lineas=2\nerrores=2"},{entrada:"nada\n", salida:"lineas=1\nerrores=0", oculta:true}],
  pista:"let n = 0, e = 0; for await (const linea of rl) { n++; if (linea.startsWith(\"ERROR\")) e++; }",
  solucion:"const readline = require(\"node:readline\");\n\nasync function main() {\n  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });\n  let n = 0, e = 0;\n  for await (const linea of rl) {\n    n++;\n    if (linea.startsWith(\"ERROR\")) e++;\n  }\n  console.log(\"lineas=\" + n);\n  console.log(\"errores=\" + e);\n}\nmain();",
  why:"Con createReadStream(\"app.log\") como input, esto recorre un fichero de 10 GB con memoria constante. crlfDelay: Infinity trata \\r\\n como un solo salto de línea."}
]}

]});
