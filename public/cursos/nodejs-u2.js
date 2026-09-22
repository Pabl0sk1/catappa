window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Ficheros, streams y eventos",
resumen: "fs con promesas, rutas con path, EventEmitter, buffers y streams para procesar datos grandes",
nivel: "Fundamentos",
color: "#7fbf5a",
lecciones: [

{
id:"nd2l1",
titulo:"Ficheros y rutas",
claves:["node:fs/promises con await para leer y escribir sin bloquear","Las versiones Sync bloquean el event loop: solo en scripts de arranque","path.join y path.resolve construyen rutas portables"],
pasos:[
 {t:"info", eti:"Disco", h:"fs y path",
  c:`<div class="termbox">import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const ruta = path.join(import.meta.dirname, "datos", "config.json");   // portable
const config = JSON.parse(await readFile(ruta, "utf8"));

await mkdir("salida", { recursive: true });
await writeFile("salida/informe.txt", "Hola\\n");
const ficheros = await readdir("salida");

readFileSync("x.txt");     // bloquea: nunca dentro de una peticion HTTP</div>`},
 {t:"par", p:"Empareja cada función con su uso",
  pares:[["readFile(ruta, \"utf8\")","Leer un fichero de texto completo"],["writeFile","Escribir (o sobrescribir) un fichero"],["mkdir(ruta, { recursive: true })","Crear carpetas intermedias"],["path.join","Unir partes de una ruta con el separador del sistema"],["readFileSync","Lectura síncrona que bloquea el hilo"]],
  why:"path.join evita problemas entre / en Linux y \\ en Windows."},
 {t:"opcion", p:"¿Por qué no usar <code>fs.readFileSync</code> dentro del manejador de una petición HTTP?",
  ops:["Porque no existe","Bloquea el event loop: mientras lee, el servidor no atiende a nadie más","Porque es más lento de escribir","Porque no lee UTF-8"],
  ok:1, why:"En código de servidor, siempre la versión asíncrona."}
]},

{
id:"nd2l2",
titulo:"Eventos y streams",
claves:["EventEmitter: emitir y escuchar eventos con nombre","Un stream procesa datos por trozos: memoria constante aunque el fichero sea enorme","pipeline conecta streams y gestiona errores y contrapresión"],
pasos:[
 {t:"info", eti:"Reaccionar", h:"EventEmitter",
  c:`<div class="termbox">import { EventEmitter } from "node:events";

const pedidos = new EventEmitter();
pedidos.on("pagado", p =&gt; enviarCorreo(p));
pedidos.on("pagado", p =&gt; avisarAlmacen(p));
pedidos.emit("pagado", { id: 42 });</div>
     <p>Muchas APIs de Node (servidores, streams, procesos) son emisores de eventos.</p>`},
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
app.get("/descarga", (req, res) =&gt; createReadStream("informe.pdf").pipe(res));</div>
     <p>Con <code>readFile</code>, un fichero de 5 GB acabaría en memoria. Un stream lo procesa en trozos (chunks). La <b>contrapresión</b> frena la lectura si la escritura va más lenta.</p>`},
 {t:"par", p:"Empareja cada tipo de stream con un ejemplo",
  pares:[["Readable","Leer un fichero o el cuerpo de una petición"],["Writable","Escribir a un fichero o la respuesta HTTP"],["Transform","Comprimir, cifrar o convertir CSV a JSON por el camino"],["pipeline","Conectar varios streams con gestión de errores"]],
  why:"req y res de un servidor HTTP de Node son streams."},
 {t:"opcion", p:"Tienes que procesar un CSV de 10 GB línea a línea. ¿Qué enfoque usas?",
  ops:["readFile y split(\"\\n\")","Un stream de lectura con readline o un parser de CSV en streaming","Subir la memoria de Node a 16 GB","Copiarlo a la base de datos a mano"],
  ok:1, why:"Memoria constante e independiente del tamaño del fichero."},
 {t:"vf", p:"<code>pipeline</code> propaga los errores de cualquier stream de la cadena y cierra todos correctamente.",
  ok:true, why:"Con .pipe() encadenado, los errores y cierres hay que gestionarlos a mano."}
]},

{
id:"nd2l3",
titulo:"Procesos y el sistema operativo",
claves:["child_process: execFile y spawn para ejecutar programas; evita exec con datos externos","os y process para información del sistema y señales","Buffers para datos binarios"],
pasos:[
 {t:"info", eti:"Hablar con el sistema", h:"Ejecutar programas",
  c:`<div class="termbox">import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
const execFileP = promisify(execFile);

// salida corta: execFile con argumentos separados (sin shell)
const { stdout } = await execFileP("git", ["rev-parse", "--short", "HEAD"]);

// salida larga o en directo: spawn con streams
const pg = spawn("pg_dump", ["-Fc", "tareas"]);
pg.stdout.pipe(createWriteStream("tareas.dump"));
pg.on("close", codigo =&gt; console.log("pg_dump terminó con", codigo));

import os from "node:os";
os.cpus().length; os.freemem(); os.hostname();</div>
     <p><code>exec("rm -rf " + ruta)</code> pasa por la shell: con datos externos permite inyección de comandos, igual que en Python con shell=True.</p>`},
 {t:"par", p:"Empareja cada función con su uso",
  pares:[["execFile","Ejecutar un programa con argumentos y recoger su salida"],["spawn","Procesos largos con salida en streaming"],["exec","Pasa por la shell: peligroso con datos externos"],["os.cpus()","Saber cuántos núcleos hay"],["Buffer","Manejar datos binarios (ficheros, red)"]],
  why:"Las mismas reglas que con subprocess en Python."},
 {t:"opcion", p:"¿Por qué preferir <code>execFile(\"convert\", [entrada, salida])</code> a <code>exec(\"convert \" + entrada + \" \" + salida)</code>?",
  ops:["Por velocidad únicamente","Sin shell no hay inyección de comandos: cada argumento llega tal cual al programa","exec no existe","Por el formato de la salida"],
  ok:1, why:"Un nombre de fichero como \"a.png; rm -rf /\" sería desastroso con exec."}
]}

]});
