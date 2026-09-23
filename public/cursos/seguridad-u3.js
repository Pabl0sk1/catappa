window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Inyección",
resumen: "Inyección SQL (clásica, ciega y de segundo orden), NoSQL con operadores, comandos del sistema y argumentos, plantillas del servidor, y las dos reglas de fondo: validar la entrada y codificar la salida",
nivel: "Intermedio",
color: "#ea6d60",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"sg2l1",
titulo:"Inyección SQL",
claves:["Inyección: datos del usuario interpretados como código por otro intérprete","Defensa principal: consultas parametrizadas; los identificadores (columnas, orden) con lista permitida","Capas extra: usuario de base de datos con mínimo privilegio, errores genéricos y SAST que detecta concatenaciones"],
pasos:[
 {t:"info", eti:"El clásico", h:"Cómo funciona una inyección SQL",
  c:`<div class="termbox">// código vulnerable
String sql = "SELECT * FROM usuarios WHERE email = '" + email + "' AND clave = '" + clave + "'";

// el atacante escribe como email:   ' OR '1'='1' --
SELECT * FROM usuarios WHERE email = '' OR '1'='1' --' AND clave = '...'
// la condición siempre es cierta y el resto queda comentado: entra sin contraseña</div>
     <p>El problema de fondo: el texto del usuario pasa a formar parte del <b>código</b> SQL. La solución es separar código y datos con <b>parámetros</b>: la consulta se envía y se compila por un lado, y los valores viajan aparte. El motor nunca los interpreta como SQL.</p>
     <div class="termbox">// Java (JDBC)
PreparedStatement ps = con.prepareStatement("SELECT * FROM usuarios WHERE email = ?");
ps.setString(1, email);

// Node (pg)
await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

# Python (sqlite3 / psycopg)
cur.execute("SELECT * FROM usuarios WHERE email = ?", (email,))</div>`},
 {t:"info", eti:"Variantes", h:"Ciega, de segundo orden y en identificadores",
  c:`<ul><li><b>Ciega</b>: la respuesta no muestra datos, pero el atacante pregunta sí/no (<code>AND SUBSTR(clave,1,1)='a'</code>) y mira si cambia la página o cuánto tarda (<code>pg_sleep(5)</code>). Automatizada con sqlmap, extrae la base entera.</li>
     <li><b>De segundo orden</b>: el dato se guarda bien parametrizado, pero otro proceso lo lee de la base y lo <b>concatena</b> después («si viene de mi base, es de fiar» es falso).</li>
     <li><b>En identificadores</b>: <code>ORDER BY</code>, nombres de columna o de tabla no admiten parámetros. Se resuelven con una <b>lista permitida</b>: el usuario elige una clave y tu código pone el nombre real.</li>
     <li><b>En procedimientos almacenados</b> que construyen SQL dinámico por dentro con <code>EXEC</code> o <code>EXECUTE</code>: siguen siendo vulnerables.</li></ul>
     <div class="nota ojo"><b class="tit">Detectarla</b>SAST (Semgrep, CodeQL) marca las concatenaciones que llegan a <code>execute</code>; en producción, un pico de errores de sintaxis SQL en los logs o de respuestas lentas en un endpoint concreto es una señal de alguien probando.</div>`},
 {t:"opcion", p:"¿Por qué escapar comillas a mano no es una buena defensa contra la inyección SQL?",
  ops:["Porque es más lento que los parámetros","Es fácil equivocarse (codificaciones, contextos, números sin comillas, identificadores); los parámetros resuelven el problema de raíz","Porque los ORM lo prohíben","Sí es una buena defensa si se hace bien"],
  ok:1, why:"Con parámetros, el motor nunca interpreta el valor como SQL, venga como venga codificado."},
 {t:"vf", p:"Usar un ORM como Hibernate o Prisma hace imposible la inyección SQL en cualquier caso.",
  ok:false, why:"Si construyes JPQL, HQL o SQL nativo concatenando texto (o usas <code>$queryRawUnsafe</code> en Prisma), sigues siendo vulnerable."},
 {t:"hueco", p:"Completa la consulta parametrizada en Node con el driver pg",
  tpl:"await pool.query(\"SELECT * FROM pedidos WHERE cliente_id = ___ AND estado = ___\", [clienteId, estado]);",
  banco:["$1","$2","'\" + clienteId + \"'","?","%s"],
  sol:["$1","$2"],
  why:"pg usa marcadores numerados; JDBC y sqlite usan ?, psycopg usa %s. El marcador cambia, la idea no."},
 {t:"opcion", p:"El endpoint <code>GET /productos?orden=precio</code> hace <code>\"ORDER BY \" + orden</code>. ¿Cómo lo arreglas?",
  ops:["Con un parámetro ? en el ORDER BY","Quitando los espacios del valor","Con una lista permitida que traduce la clave del usuario al nombre real de la columna y rechaza lo demás","Escapando las comillas del valor"],
  ok:2, why:"Los identificadores no se pueden parametrizar: el ? en ORDER BY ordenaría por un valor constante. La lista permitida es la única defensa sólida."},
 {t:"codigo", p:"Arregla la inyección", lenguaje:"py",
  c:`<p>El programa busca un usuario por email concatenando texto. Con la entrada <code>' OR '1'='1</code> devuelve todos los usuarios. Reescríbelo con una consulta parametrizada. Debe imprimir cuántas filas encuentra y el nombre de cada una.</p>`,
  plantilla:"import sqlite3\n\ncon = sqlite3.connect(\":memory:\")\ncon.execute(\"CREATE TABLE usuarios (email TEXT, nombre TEXT)\")\ncon.executemany(\"INSERT INTO usuarios VALUES (?, ?)\", [(\"ana@x.es\", \"Ana\"), (\"luis@x.es\", \"Luis\")])\n\nemail = input().strip()\nfilas = con.execute(\"SELECT nombre FROM usuarios WHERE email = '\" + email + \"'\").fetchall()\nprint(len(filas))\nfor (nombre,) in filas:\n    print(nombre)\n",
  pruebas:[
   {entrada:"ana@x.es\n", salida:"1\nAna"},
   {entrada:"' OR '1'='1\n", salida:"0"},
   {entrada:"x' OR 1=1 --\n", salida:"0", oculta:true}
  ],
  pista:"Pon ? en la consulta y pasa (email,) como segundo argumento de execute.",
  solucion:"import sqlite3\n\ncon = sqlite3.connect(\":memory:\")\ncon.execute(\"CREATE TABLE usuarios (email TEXT, nombre TEXT)\")\ncon.executemany(\"INSERT INTO usuarios VALUES (?, ?)\", [(\"ana@x.es\", \"Ana\"), (\"luis@x.es\", \"Luis\")])\n\nemail = input().strip()\nfilas = con.execute(\"SELECT nombre FROM usuarios WHERE email = ?\", (email,)).fetchall()\nprint(len(filas))\nfor (nombre,) in filas:\n    print(nombre)\n",
  why:"Con el parámetro, «' OR '1'='1» es solo un email raro que no existe: 0 filas. El mismo cambio sirve para cualquier motor y cualquier lenguaje."}
]},

/* =============== U3 L2 =============== */
{
id:"sg3n1",
titulo:"Inyección NoSQL",
claves:["En MongoDB la inyección suele ser de operadores: un objeto {\"$ne\": null} donde esperabas un texto","Defensa: validar tipos con un esquema (zod, Joi, Pydantic) antes de construir la consulta","Nunca $where, $function ni mapReduce con datos del usuario: ejecutan JavaScript en el servidor"],
pasos:[
 {t:"info", eti:"Sin SQL no es sin inyección", h:"Inyección de operadores",
  c:`<div class="termbox">// Express + MongoDB, código vulnerable
const u = await db.collection("usuarios").findOne({
  email: req.body.email,
  clave: req.body.clave          // ¡se espera un texto!
});

// el atacante envía JSON:
{ "email": "admin@tienda.com", "clave": { "$ne": null } }
// la consulta pasa a ser "clave distinta de null": entra como admin</div>
     <p>Con JSON en el cuerpo, o con parámetros como <code>?clave[$ne]=x</code> que algunos parsers de query string convierten en objetos, el atacante no inyecta texto sino <b>estructura</b>: operadores como <code>$ne</code>, <code>$gt</code>, <code>$regex</code> o <code>$where</code>.</p>`},
 {t:"info", eti:"Defensa", h:"Validar la forma antes de consultar",
  c:`<div class="termbox">import { z } from "zod";
const Login = z.object({
  email: z.string().email().max(254),
  clave: z.string().min(1).max(200)
}).strict();                       // rechaza campos que no esperas

const datos = Login.parse(req.body);   // si clave es un objeto, lanza error
const u = await db.collection("usuarios").findOne({ email: datos.email });
// y la contraseña se compara con su hash en el código, no en la consulta</div>
     <ul><li>Validar <b>tipos</b> con un esquema en la frontera: zod, Joi, class-validator, Pydantic.</li>
     <li>Mongoose con esquemas convierte tipos (<i>casting</i>) y la opción <code>sanitizeFilter</code> neutraliza operadores en filtros.</li>
     <li>Desactivar el JavaScript en el servidor si no se usa (<code>security.javascriptEnabled: false</code>).</li></ul>`},
 {t:"opcion", p:"¿Cuál es la causa raíz de la inyección de operadores en MongoDB?",
  ops:["Que MongoDB no cifra las consultas","Aceptar un objeto donde el código esperaba un valor simple y meterlo tal cual en el filtro","Que MongoDB no tiene usuarios","Usar índices"],
  ok:1, why:"Por eso la defensa es validar el tipo: si «clave» debe ser un texto, un objeto se rechaza antes de llegar a la base de datos."},
 {t:"vf", p:"Buscar al usuario solo por email y comparar el hash de la contraseña en el código es más seguro que meter la contraseña en el filtro de la consulta.",
  ok:true, why:"Además de evitar la inyección en ese campo, es la única forma correcta con hashes lentos con sal: la base no puede comparar argon2 por ti."},
 {t:"par", p:"Empareja cada carga con lo que intenta",
  pares:[["{\"clave\": {\"$ne\": null}}","Saltarse la comprobación de contraseña"],["{\"email\": {\"$regex\": \"^a\"}}","Adivinar datos carácter a carácter"],["{\"$where\": \"sleep(5000)\"}","Ejecutar JavaScript en el servidor"],["?precio[$gt]=0","Colar un operador por la query string"]],
  why:"Todas se cortan igual: si el campo debe ser un texto o un número, solo se acepta un texto o un número."},
 {t:"codigo", p:"Valida el cuerpo del login", lenguaje:"js",
  c:`<p>Lee de la entrada un JSON con el cuerpo de un login. Imprime <code>OK</code> solo si es un objeto con exactamente las claves <code>email</code> y <code>clave</code>, ambas de tipo texto y no vacías. En cualquier otro caso (JSON inválido, un objeto donde va un texto, claves de más o de menos) imprime <code>RECHAZADO</code>.</p>`,
  plantilla:"const texto = require(\"fs\").readFileSync(0, \"utf8\");\n// parsea y valida\n",
  pruebas:[
   {entrada:"{\"email\":\"ana@x.es\",\"clave\":\"s3creta\"}", salida:"OK"},
   {entrada:"{\"email\":\"admin@x.es\",\"clave\":{\"$ne\":null}}", salida:"RECHAZADO"},
   {entrada:"{\"email\":\"ana@x.es\",\"clave\":\"x\",\"rol\":\"admin\"}", salida:"RECHAZADO", oculta:true},
   {entrada:"no es json", salida:"RECHAZADO", oculta:true},
   {entrada:"[\"email\",\"clave\"]", salida:"RECHAZADO", oculta:true}
  ],
  pista:"Comprueba que no es null ni array, compara las claves ordenadas y usa typeof v === \"string\".",
  solucion:"const texto = require(\"fs\").readFileSync(0, \"utf8\");\nfunction valido(t) {\n  let d;\n  try { d = JSON.parse(t); } catch { return false; }\n  if (d === null || typeof d !== \"object\" || Array.isArray(d)) return false;\n  const claves = Object.keys(d).sort();\n  if (claves.join(\",\") !== \"clave,email\") return false;\n  return [d.email, d.clave].every(v => typeof v === \"string\" && v.length > 0);\n}\nconsole.log(valido(texto) ? \"OK\" : \"RECHAZADO\");\n",
  why:"Es lo que hace un esquema estricto de zod o Pydantic por ti. Validar la forma en la frontera corta de raíz la inyección de operadores y el mass assignment."}
]},

/* =============== U3 L3 =============== */
{
id:"sg3n2",
titulo:"Comandos, argumentos y plantillas",
claves:["Inyección de comandos: nunca pasar datos del usuario por una shell; usar la API con lista de argumentos","Inyección de argumentos: un valor que empieza por «-» se convierte en una opción; separar con «--» y validar","SSTI: compilar una plantilla construida con datos del usuario ejecuta código en el servidor"],
pasos:[
 {t:"info", eti:"La shell es otro intérprete", h:"Inyección de comandos",
  c:`<div class="termbox"># Python, vulnerable: el texto pasa por /bin/sh
os.system("ping -c 1 " + host)
# host = "8.8.8.8; cat /etc/passwd"   -&gt;  se ejecutan los dos comandos

# seguro: sin shell, cada argumento por separado
subprocess.run(["ping", "-c", "1", host], check=True, timeout=5)

// Node: exec() usa shell; execFile() no
execFile("ping", ["-c", "1", host]);</div>
     <p>Los metacaracteres de la shell (<code>; | &amp; $() \` &gt;</code> y saltos de línea) solo son peligrosos si hay una shell que los interprete. Sin shell, <code>8.8.8.8; cat /etc/passwd</code> es un único argumento raro que ping rechaza.</p>
     <p>Mejor aún: <b>no lanzar procesos</b> si hay una librería que haga lo mismo (una librería de imágenes en vez de llamar a ImageMagick por línea de comandos).</p>`},
 {t:"info", eti:"Aun sin shell", h:"Inyección de argumentos",
  c:`<p>Sin shell todavía queda un hueco: si el valor empieza por <code>-</code>, el programa lo interpreta como una <b>opción</b>.</p>
     <div class="termbox">subprocess.run(["git", "clone", url, destino])
# url = "--upload-pack=touch /tmp/pwned"  -&gt;  git lo toma como opción y ejecuta el comando

subprocess.run(["git", "clone", "--", url, destino])   # «--» = fin de las opciones</div>
     <p>Defensas: validar con una <b>lista permitida</b> (formato exacto, sin <code>-</code> inicial), poner <code>--</code> antes de los argumentos del usuario cuando el programa lo admita y, en lo posible, no dejar que el usuario elija el programa ni las opciones.</p>`},
 {t:"par", p:"Empareja cada API con su comportamiento",
  pares:[["os.system(cadena)","Pasa por la shell: vulnerable a ; y |"],["subprocess.run(lista)","Sin shell por defecto: cada elemento es un argumento"],["child_process.exec(cadena)","Node con shell"],["child_process.execFile(programa, lista)","Node sin shell"],["Runtime.exec(\"sh -c \" + cmd)","Java invocando la shell a propósito"]],
  why:"shell=True en subprocess, o exec en Node, reintroducen el problema aunque uses la API «buena»."},
 {t:"info", eti:"Plantillas", h:"Server-Side Template Injection (SSTI)",
  c:`<div class="termbox"># Flask, vulnerable: la PLANTILLA se construye con datos del usuario
return render_template_string("Hola " + request.args["nombre"])
# nombre = {{7*7}}  -&gt; responde «Hola 49»; con más ingenio, ejecución de código

# seguro: la plantilla es fija y el dato es una variable
return render_template_string("Hola {{ nombre }}", nombre=request.args["nombre"])</div>
     <p>Pasa en Jinja2, Twig, Freemarker, Velocity, Thymeleaf (con expresiones de preprocesado), Handlebars... La regla: las plantillas son <b>código</b>; los datos se pasan como variables. Si el negocio necesita plantillas editables por usuarios (correos personalizados), usa un motor sin lógica o en modo <i>sandbox</i>.</p>`},
 {t:"opcion", p:"Un endpoint de previsualización de correos hace <code>Template(textoDelCliente).render()</code> en Jinja2 y alguien envía <code>{{ config }}</code>. ¿Qué ocurre y qué haces?",
  ops:["Nada, Jinja2 escapa todo","Se ejecuta la expresión en el servidor (SSTI): puede filtrar la configuración y escalar a ejecución de código. Plantilla fija con variables, o un motor sin lógica / sandbox","Solo es un XSS en el navegador","Se soluciona escapando las llaves con una expresión regular"],
  ok:1, why:"El autoescapado de Jinja2 protege el HTML de salida, no la compilación de una plantilla escrita por el atacante."},
 {t:"vf", p:"<code>subprocess.run(cmd, shell=True)</code> con <code>cmd</code> construido con datos del usuario es seguro si validas que no haya punto y coma.",
  ok:false, why:"Hay muchos más metacaracteres: |, &amp;, $(), comillas invertidas, saltos de línea... Las listas prohibidas siempre se quedan cortas. Quita la shell."},
 {t:"codigo", p:"Valida el host antes de hacer ping", lenguaje:"py",
  c:`<p>Un diagnóstico de red hace <code>subprocess.run(["ping", "-c", "1", host])</code>. Escribe la validación: imprime <code>OK</code> si el host es un nombre de dominio o una IPv4 formados solo por letras minúsculas, dígitos, puntos y guiones, de 1 a 253 caracteres, y <b>no empieza por guion</b>. Si no, imprime <code>RECHAZADO</code>. (Pasa a minúsculas antes de validar.)</p>`,
  plantilla:"import re\n\nhost = input().strip()\n# valida con una lista permitida\n",
  pruebas:[
   {entrada:"api.tienda.com\n", salida:"OK"},
   {entrada:"8.8.8.8; cat /etc/passwd\n", salida:"RECHAZADO"},
   {entrada:"-oProxyCommand=id\n", salida:"RECHAZADO", oculta:true},
   {entrada:"Servidor-01.local\n", salida:"OK", oculta:true},
   {entrada:"$(id)\n", salida:"RECHAZADO", oculta:true}
  ],
  pista:"re.fullmatch(r\"[a-z0-9.-]{1,253}\", host) y host.startswith(\"-\").",
  solucion:"import re\n\nhost = input().strip().lower()\nif re.fullmatch(r\"[a-z0-9.-]{1,253}\", host) and not host.startswith(\"-\"):\n    print(\"OK\")\nelse:\n    print(\"RECHAZADO\")\n",
  why:"fullmatch (o ^...$ con cuidado del salto de línea final) evita que un sufijo malicioso pase la validación. Lista permitida + sin shell + sin guion inicial cierra comandos y argumentos."}
]},

/* =============== U3 L4 =============== */
{
id:"sg2l4",
titulo:"Validar la entrada y codificar la salida",
claves:["Validar la entrada: tipo, longitud, formato y listas permitidas, en el servidor","Codificar la salida según el contexto donde se inserta (HTML, atributo, URL, SQL, shell)","Canonicalizar antes de validar (rutas, Unicode, mayúsculas) y validar después de decodificar"],
pasos:[
 {t:"info", eti:"Las dos reglas", h:"Entrada y salida",
  c:`<p><b>Validar la entrada</b> reduce lo que puede llegar: un id es un número positivo, un email tiene formato de email, un estado es uno de una lista. Mejor <b>listas permitidas</b> que listas prohibidas (es imposible enumerar todo lo malo).</p>
     <p><b>Codificar la salida</b> impide que lo que llega se interprete como código en el sitio donde se inserta. Ninguna de las dos basta sola: un comentario de un foro puede contener legítimamente <code>&lt;</code>, así que no puedes rechazarlo en la entrada; lo codificas al pintarlo.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">cómo codificar según dónde va el dato</div><table class="dg-tabla"><thead><tr><th>Contexto</th><th>Técnica</th><th>Ejemplo</th></tr></thead><tbody>
       <tr><td>HTML</td><td><code>&amp;lt; &amp;gt; &amp;amp; &amp;quot; &amp;#39;</code></td><td>textContent, plantillas que escapan</td></tr>
       <tr><td>atributo HTML</td><td>entre comillas y codificado</td><td><code>value="..."</code></td></tr>
       <tr><td>URL</td><td><code>encodeURIComponent</code></td><td><code>?q=...</code></td></tr>
       <tr><td>SQL</td><td>parámetros</td><td><code>WHERE email = ?</code></td></tr>
       <tr><td>shell</td><td>argumentos separados</td><td><code>execFile("git", [rama])</code></td></tr>
     </tbody></table></div>`},
 {t:"info", eti:"El orden importa", h:"Canonicalizar y luego validar",
  c:`<p>Un mismo valor se puede escribir de muchas formas: <code>../</code>, <code>..%2f</code>, <code>%252e%252e%252f</code> (doble codificación), <code>..\\</code> en Windows, caracteres Unicode que se normalizan a otros (<code>ｓｃｒｉｐｔ</code> de ancho completo pasa a <code>script</code> con NFKC). Si validas antes de decodificar o normalizar, validas algo distinto de lo que luego usas.</p>
     <ol><li>Decodificar <b>una vez</b> (el framework ya lo hace; no decodifiques de nuevo a mano).</li>
     <li>Normalizar: Unicode NFC/NFKC, rutas con <code>normalize</code>/<code>realpath</code>, minúsculas si procede.</li>
     <li>Validar el resultado contra la lista permitida.</li>
     <li>Usar exactamente ese valor validado.</li></ol>`},
 {t:"par", p:"Empareja cada entrada con su validación adecuada",
  pares:[["Id de pedido","Entero positivo"],["Estado del pedido","Uno de una lista cerrada de valores"],["Nombre de fichero para descargar","Normalizar la ruta y comprobar que queda dentro de la carpeta"],["Campo de ordenación ?sort=","Lista permitida de columnas (nunca directo al SQL)"],["Texto libre de un comentario","Longitud máxima y codificar al mostrar"]],
  why:"Cada tipo de dato pide su propia validación; la codificación depende del destino, no del origen."},
 {t:"opcion", p:"¿Por qué una lista prohibida (bloquear «&lt;script&gt;») no protege contra XSS?",
  ops:["Porque es lenta","Porque los navegadores ya bloquean script","Hay infinitas variantes (mayúsculas, eventos como onerror, SVG, codificaciones) que la saltan; la defensa es codificar la salida","Sí protege si la lista es larga"],
  ok:2, why:"<code>&lt;img src=x onerror=alert(1)&gt;</code> no contiene la palabra script. Los filtros de palabras prohibidas siempre se acaban saltando."},
 {t:"vf", p:"Validar con la expresión regular <code>^[a-z]+$</code> en JavaScript acepta como mucho letras minúsculas, aunque la entrada tenga varias líneas.",
  ok:true, why:"En JavaScript, sin el flag m, ^ y $ anclan al principio y final de toda la cadena. Ojo en Ruby y en Python con re.match y $: $ también casa antes de un salto de línea final. Por eso en Python se prefiere re.fullmatch."},
 {t:"codigo", p:"ORDER BY con lista permitida", lenguaje:"py",
  c:`<p>La entrada tiene un campo de ordenación y una dirección, por ejemplo <code>precio desc</code>. Las claves permitidas son <code>precio</code> → <code>p.precio</code>, <code>nombre</code> → <code>p.nombre</code> y <code>fecha</code> → <code>p.creado_en</code>; las direcciones, <code>asc</code> y <code>desc</code> (sin distinguir mayúsculas). Imprime el fragmento <code>ORDER BY columna DIRECCION</code> con la dirección en mayúsculas, o <code>RECHAZADO</code> si algo no está permitido.</p>`,
  plantilla:"campo, direccion = input().split()\n# traduce con una lista permitida\n",
  pruebas:[
   {entrada:"precio desc\n", salida:"ORDER BY p.precio DESC"},
   {entrada:"fecha ASC\n", salida:"ORDER BY p.creado_en ASC"},
   {entrada:"(SELECT clave FROM admin) asc\n", salida:"RECHAZADO", oculta:true},
   {entrada:"nombre desc;DROP\n", salida:"RECHAZADO", oculta:true}
  ],
  pista:"Un diccionario para las columnas y un conjunto para las direcciones. Si la entrada no son exactamente dos palabras, también se rechaza.",
  solucion:"COLUMNAS = {\"precio\": \"p.precio\", \"nombre\": \"p.nombre\", \"fecha\": \"p.creado_en\"}\npartes = input().split()\nif len(partes) == 2 and partes[0] in COLUMNAS and partes[1].lower() in (\"asc\", \"desc\"):\n    print(f\"ORDER BY {COLUMNAS[partes[0]]} {partes[1].upper()}\")\nelse:\n    print(\"RECHAZADO\")\n",
  why:"El usuario nunca escribe SQL: elige una clave y tu código pone el identificador real. Fíjate en que la plantilla revienta con entradas de más de dos palabras: validar también la forma evita errores 500 que dan pistas."}
]}

]});
