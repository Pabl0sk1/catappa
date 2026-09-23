window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Autenticación y seguridad",
resumen: "Contraseñas con hash lento, sesiones y cookies, JWT por dentro, endurecer una API, subidas de ficheros, dependencias y los fallos de OWASP en Node",
nivel: "Avanzado",
color: "#65a541",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"nd5l1",
titulo:"Contraseñas, sesiones y cookies",
claves:["Hashea contraseñas con argon2id, scrypt o bcrypt (nunca SHA o MD5)","Cookies de sesión HttpOnly, Secure y SameSite para aplicaciones web","Compara secretos en tiempo constante (timingSafeEqual)"],
pasos:[
 {t:"info", eti:"Identidad", h:"Registro y login",
  c:`<div class="termbox">import argon2 from "argon2";

const hash = await argon2.hash(clave);                           // registro: argon2id por defecto
const ok = await argon2.verify(usuario.hash, claveIntroducida);  // login

// sin dependencias: scrypt de node:crypto
const sal = crypto.randomBytes(16);
const derivada = await scrypt(clave, sal, 64);                 // promisify(crypto.scrypt)
guardar(\`\${sal.toString("hex")}:\${derivada.toString("hex")}\`);</div>
     <p>Un hash de contraseñas debe ser <b>lento</b> a propósito y llevar <b>sal</b> aleatoria por usuario: así, con la base de datos robada, cada intento cuesta caro y las contraseñas iguales no producen el mismo hash.</p>
     <div class="nota ojo"><b class="tit">Mensajes de login</b>Responde siempre «usuario o contraseña incorrectos», sin distinguir. Si dices «ese usuario no existe», regalas una forma de averiguar qué emails están registrados.</div>`},
 {t:"info", eti:"Sesiones", h:"Sesión con cookie",
  c:`<div class="termbox">import session from "express-session";
import { RedisStore } from "connect-redis";

app.use(session({
  store: new RedisStore({ client: redis }),       // compartida entre réplicas
  secret: process.env.SESSION_SECRET,
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: "lax", maxAge: 8 * 3600_000 },
}));

app.post("/login", async (req, res) =&gt; {
  // ...verificar la contraseña...
  req.session.regenerate(() =&gt; {                 // nuevo id tras el login: evita fijación de sesión
    req.session.usuarioId = usuario.id;
    res.sendStatus(204);
  });
});</div>
     <p>Para una aplicación web propia, una <b>cookie de sesión</b> <code>HttpOnly</code> (JavaScript no puede leerla) es más resistente a XSS que guardar un JWT en localStorage. Y cerrar sesión de verdad es tan fácil como borrar la sesión del almacén.</p>`},
 {t:"par", p:"Empareja cada atributo de cookie con lo que aporta",
  pares:[["HttpOnly","JavaScript de la página no puede leerla"],["Secure","Solo se envía por HTTPS"],["SameSite=Lax","No se envía en peticiones de otros sitios (mitiga CSRF)"],["Max-Age","Cuándo caduca"]],
  why:"Esta plataforma usa un token en cabecera; en producción pública, cookies HttpOnly serían preferibles."},
 {t:"opcion", p:"¿Por qué argon2 o bcrypt y no SHA-256 para las contraseñas?",
  ops:["SHA-256 no existe en Node","SHA-256 es muy rápido: con la base de datos robada se prueban miles de millones de contraseñas por segundo. argon2 y bcrypt son lentos a propósito y llevan sal","Por el tamaño","Da igual"],
  ok:1, why:"Los mismos principios que en Spring Security."},
 {t:"vf", p:"Comparar dos tokens con <code>===</code> puede filtrar información por el tiempo que tarda la comparación.",
  ok:true, why:"=== se detiene en el primer carácter distinto. Para secretos, crypto.timingSafeEqual tarda lo mismo sea cual sea la diferencia."},
 {t:"opcion", p:"¿Por qué llamar a <code>req.session.regenerate()</code> justo después de un login correcto?",
  ops:["Para que la cookie dure más","Para evitar la fijación de sesión: si un atacante consiguió plantar un id de sesión antes del login, deja de valer","Para cifrar la sesión","Por rendimiento"],
  ok:1, why:"Todo cambio de privilegios (login, pasar a administrador) debe emitir un id de sesión nuevo."},
 {t:"codigo", p:"Guarda y verifica contraseñas con <code>crypto.scryptSync</code> y sal: implementa <code>hashear(clave)</code> (devuelve <code>salHex:hashHex</code>) y <code>verificar(clave, guardado)</code> con comparación en tiempo constante",
  lenguaje:"js",
  c:`<p>La plantilla hashea <code>correcta-caballo-bateria</code> dos veces y verifica. Salida: <code>false</code> (los dos hashes difieren por la sal), <code>true</code> y <code>false</code>. Aquí se usa la versión Sync por sencillez; en un servidor, la asíncrona.</p>`,
  plantilla:"const crypto = require(\"node:crypto\");\n\nfunction hashear(clave) {\n  // sal aleatoria de 16 bytes y scryptSync(clave, sal, 32)\n}\nfunction verificar(clave, guardado) {\n  // separa sal y hash, recalcula y compara con timingSafeEqual\n}\n\nconst h1 = hashear(\"correcta-caballo-bateria\");\nconst h2 = hashear(\"correcta-caballo-bateria\");\nconsole.log(h1 === h2);\nconsole.log(verificar(\"correcta-caballo-bateria\", h1));\nconsole.log(verificar(\"123456\", h1));\n",
  pruebas:[{salida:"false\ntrue\nfalse"}],
  pista:"const sal = crypto.randomBytes(16); return sal.toString(\"hex\") + \":\" + crypto.scryptSync(clave, sal, 32).toString(\"hex\"). Al verificar, Buffer.from(salHex, \"hex\") y crypto.timingSafeEqual(a, b).",
  solucion:"const crypto = require(\"node:crypto\");\n\nfunction hashear(clave) {\n  const sal = crypto.randomBytes(16);\n  return sal.toString(\"hex\") + \":\" + crypto.scryptSync(clave, sal, 32).toString(\"hex\");\n}\nfunction verificar(clave, guardado) {\n  const [salHex, hashHex] = guardado.split(\":\");\n  const esperado = Buffer.from(hashHex, \"hex\");\n  const calculado = crypto.scryptSync(clave, Buffer.from(salHex, \"hex\"), 32);\n  return crypto.timingSafeEqual(esperado, calculado);\n}\n\nconst h1 = hashear(\"correcta-caballo-bateria\");\nconst h2 = hashear(\"correcta-caballo-bateria\");\nconsole.log(h1 === h2);\nconsole.log(verificar(\"correcta-caballo-bateria\", h1));\nconsole.log(verificar(\"123456\", h1));",
  why:"La sal se guarda junto al hash (no es secreta): su trabajo es que dos usuarios con la misma contraseña tengan hashes distintos y que no sirvan tablas precalculadas."}
]},

/* =============== U8 L2 =============== */
{
id:"nd8n1",
titulo:"JWT por dentro: firmar, verificar y renovar",
claves:["Un JWT es cabecera.carga.firma en base64url: la carga se lee, no está cifrada","Verifica firma, algoritmo permitido, exp, iss y aud; nunca aceptes alg none","Access token corto y refresh token largo, rotado y revocable"],
pasos:[
 {t:"info", eti:"Anatomía", h:"Qué es un JWT",
  c:`<div class="dg"><div class="dg-tit">las tres partes de un JWT</div>
       <div class="dg-flujo"><div class="dg-caja">cabecera<small>{"alg":"HS256","typ":"JWT"}</small></div><div class="dg-caja acento">carga (claims)<small>{"sub":"42","rol":"admin","exp":…}</small></div><div class="dg-caja ok">firma<small>HMAC-SHA256(cabecera.carga, secreto)</small></div></div>
       <div class="dg-nota arriba">cada parte en base64url, unidas por puntos</div></div>
     <div class="termbox">import jwt from "jsonwebtoken";

const token = jwt.sign({ sub: String(u.id), rol: u.rol }, process.env.JWT_SECRETO,
  { expiresIn: "15m", issuer: "api.catappa.dev", audience: "catappa-web" });

function autenticar(req, res, next) {
  const [tipo, t] = (req.headers.authorization ?? "").split(" ");
  if (tipo !== "Bearer" || !t) return res.status(401).json({ detail: "No autenticado" });
  try {
    req.usuario = jwt.verify(t, process.env.JWT_SECRETO,
      { algorithms: ["HS256"], issuer: "api.catappa.dev", audience: "catappa-web" });
    next();
  } catch { res.status(401).json({ detail: "No autenticado" }); }
}</div>
     <div class="nota ojo"><b class="tit">La carga no es secreta</b>Cualquiera puede decodificar la carga en base64url y leerla. La firma solo impide <b>modificarla</b>. Nunca metas datos sensibles en un JWT.</div>`},
 {t:"info", eti:"Ciclo de vida", h:"Access y refresh tokens",
  c:`<p>Un JWT no se puede revocar antes de que caduque (el servidor no guarda nada). Por eso se combinan dos:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">dos tokens, dos papeles</div>
       <table class="dg-tabla"><thead><tr><th></th><th>access token</th><th>refresh token</th></tr></thead><tbody>
       <tr><td>duración</td><td>5–15 minutos</td><td>días o semanas</td></tr>
       <tr><td>se envía</td><td>en cada petición (Authorization)</td><td>solo a /auth/renovar, en cookie HttpOnly</td></tr>
       <tr><td>se guarda en el servidor</td><td>no</td><td>sí (para poder revocarlo)</td></tr>
       <tr><td>al usarlo</td><td>—</td><td>se rota: se emite uno nuevo y se invalida el viejo</td></tr>
       </tbody></table></div>
     <p>Si un refresh token ya usado vuelve a aparecer, alguien lo ha robado: se revoca toda la familia de tokens de ese usuario. Con varios servicios, firma con clave asimétrica (RS256 o EdDSA) y publica la clave pública en un endpoint JWKS.</p>`},
 {t:"par", p:"Empareja cada claim estándar con su significado",
  pares:[["sub","A quién se refiere (id del usuario)"],["exp","Cuándo caduca (segundos desde 1970)"],["iss","Quién lo emitió"],["aud","Para quién está pensado"],["iat","Cuándo se emitió"]],
  why:"Comprobar iss y aud evita que un token emitido para otro servicio sirva en el tuyo."},
 {t:"opcion", p:"Un atacante cambia la cabecera de un token a <code>{\"alg\":\"none\"}</code>, borra la firma y pone <code>\"rol\":\"admin\"</code>. ¿Qué lo impide?",
  ops:["Nada: los JWT son seguros por sí solos","Verificar con una lista cerrada de algoritmos (algorithms: [\"HS256\"]) y rechazar cualquier otro, incluido none","Usar HTTPS","Que el token sea largo"],
  ok:1, why:"Es un ataque clásico contra librerías mal configuradas. Nunca dejes que el propio token decida con qué algoritmo se verifica."},
 {t:"vf", p:"Guardar el JWT en <code>localStorage</code> lo protege de ataques XSS.",
  ok:false, why:"Todo lo que hay en localStorage es legible por cualquier script de la página. Una cookie HttpOnly no lo es."},
 {t:"codigo", p:"Firma un JWT HS256 a mano con <code>node:crypto</code>: la primera línea de stdin es la carga (JSON) y la segunda el secreto",
  lenguaje:"js",
  c:`<p>Cabecera fija <code>{"alg":"HS256","typ":"JWT"}</code>. Codifica cabecera y carga con <code>Buffer.from(JSON.stringify(x)).toString("base64url")</code>, firma <code>cabecera.carga</code> con HMAC-SHA256 y añade la firma en base64url.</p>`,
  plantilla:"const crypto = require(\"node:crypto\");\nconst [cargaJson, secreto] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst carga = JSON.parse(cargaJson);\n// imprime el token\n",
  pruebas:[{entrada:"{\"sub\":\"1234567890\",\"name\":\"John Doe\",\"iat\":1516239022}\nyour-256-bit-secret\n", salida:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"},{entrada:"{\"sub\":\"42\",\"rol\":\"admin\",\"exp\":2000000000}\nsecreto\n", salida:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsInJvbCI6ImFkbWluIiwiZXhwIjoyMDAwMDAwMDAwfQ.LkoOcebbczeNPW1LSBw2xcr_HMERtDbX_K5XnHALpL8", oculta:true}],
  pista:"const b64 = o => Buffer.from(JSON.stringify(o)).toString(\"base64url\"); const entrada = b64(cabecera) + \".\" + b64(carga); la firma: crypto.createHmac(\"sha256\", secreto).update(entrada).digest(\"base64url\").",
  solucion:"const crypto = require(\"node:crypto\");\nconst [cargaJson, secreto] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst carga = JSON.parse(cargaJson);\nconst b64 = o => Buffer.from(JSON.stringify(o)).toString(\"base64url\");\nconst entrada = b64({ alg: \"HS256\", typ: \"JWT\" }) + \".\" + b64(carga);\nconst firma = crypto.createHmac(\"sha256\", secreto).update(entrada).digest(\"base64url\");\nconsole.log(entrada + \".\" + firma);",
  why:"El primer caso es el ejemplo oficial de jwt.io: tu firma coincide con la de cualquier librería. Ya sabes que un JWT no tiene magia: es base64url y un HMAC."},
 {t:"codigo", p:"Verifica tokens: para cada token de stdin imprime <code>valido SUB</code>, <code>algoritmo no permitido</code>, <code>firma no válida</code> o <code>caducado</code> (en ese orden de comprobación)",
  lenguaje:"js",
  c:`<p>Secreto <code>secreto</code>. La hora actual es fija: <code>ahora = 1700000000</code>. Solo se acepta <code>HS256</code>. Compara la firma con <code>timingSafeEqual</code> (comprueba antes que las longitudes coinciden).</p>`,
  plantilla:"const crypto = require(\"node:crypto\");\nconst SECRETO = \"secreto\", ahora = 1700000000;\nconst tokens = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst leer = parte => JSON.parse(Buffer.from(parte, \"base64url\").toString());\n\nfor (const t of tokens) {\n  const [cab, carga, firma] = t.split(\".\");\n  // comprueba algoritmo, firma y caducidad\n}\n",
  pruebas:[{entrada:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsInJvbCI6ImFkbWluIiwiZXhwIjoyMDAwMDAwMDAwfQ.LkoOcebbczeNPW1LSBw2xcr_HMERtDbX_K5XnHALpL8\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsInJvbCI6ImFkbWluIiwiZXhwIjoyMDAwMDAwMDAwfQ.5tKiTtLGiKqK0dB4g2BFr1NQwUEEvIB5La1EWXiyKiQ\n", salida:"valido 42\nfirma no válida"},{entrada:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3IiwiZXhwIjoxMDAwfQ.pqVlzr0r2gzzf6QXTbskS7eW239NjCIgEv5qhOOhnQI\neyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxIiwicm9sIjoiYWRtaW4iLCJleHAiOjIwMDAwMDAwMDB9.\n", salida:"caducado\nalgoritmo no permitido", oculta:true}],
  pista:"if (leer(cab).alg !== \"HS256\") ...; const esperada = crypto.createHmac(\"sha256\", SECRETO).update(cab + \".\" + carga).digest(); const dada = Buffer.from(firma, \"base64url\"); si las longitudes difieren o !timingSafeEqual → firma no válida; luego leer(carga).exp &lt;= ahora → caducado.",
  solucion:"const crypto = require(\"node:crypto\");\nconst SECRETO = \"secreto\", ahora = 1700000000;\nconst tokens = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst leer = parte => JSON.parse(Buffer.from(parte, \"base64url\").toString());\n\nfor (const t of tokens) {\n  const [cab, carga, firma] = t.split(\".\");\n  if (leer(cab).alg !== \"HS256\") { console.log(\"algoritmo no permitido\"); continue; }\n  const esperada = crypto.createHmac(\"sha256\", SECRETO).update(cab + \".\" + carga).digest();\n  const dada = Buffer.from(firma || \"\", \"base64url\");\n  if (dada.length !== esperada.length || !crypto.timingSafeEqual(dada, esperada)) { console.log(\"firma no válida\"); continue; }\n  const c = leer(carga);\n  if (typeof c.exp !== \"number\" || c.exp <= ahora) { console.log(\"caducado\"); continue; }\n  console.log(\"valido \" + c.sub);\n}",
  why:"El orden importa: primero el algoritmo (antes de confiar en nada del token), luego la firma, y solo entonces se leen los claims. timingSafeEqual lanza si las longitudes difieren: por eso se comprueban antes."}
]},

/* =============== U8 L3 =============== */
{
id:"nd5l2",
titulo:"Endurecer una API",
claves:["helmet añade cabeceras de seguridad; CORS solo para orígenes conocidos","Rate limiting contra fuerza bruta y abuso, con almacén compartido si hay réplicas","Límites de tamaño, timeouts y secretos fuera del repositorio"],
pasos:[
 {t:"info", eti:"Capas", h:"Medidas básicas",
  c:`<div class="termbox">import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

app.use(helmet());                                        // CSP, HSTS, nosniff, frameguard…
app.use(cors({ origin: ["https://app.catappa.dev"], credentials: true }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60_000, limit: 20 }));
app.use(express.json({ limit: "100kb" }));                // cuerpos enormes = ataque barato
app.disable("x-powered-by");
app.set("trust proxy", 1);                                // detrás de un balanceador: IP real del cliente</div>
     <div class="nota ojo"><b class="tit">trust proxy</b>Detrás de un balanceador, todas las peticiones llegan desde su IP. Sin <code>trust proxy</code>, el rate limit trataría a todos los usuarios como uno solo. Con un valor demasiado permisivo, un atacante falsifica <code>X-Forwarded-For</code> y esquiva el límite. Ajusta el número de saltos a tu infraestructura.</div>`},
 {t:"info", eti:"Algoritmos", h:"Cómo limita un rate limiter",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">algoritmos de limitación</div>
       <table class="dg-tabla"><thead><tr><th>algoritmo</th><th>idea</th><th>pega</th></tr></thead><tbody>
       <tr><td>ventana fija</td><td>contador por minuto</td><td>ráfaga doble en el cambio de ventana</td></tr>
       <tr><td>ventana deslizante</td><td>cuenta los últimos 60 s reales</td><td>algo más de memoria</td></tr>
       <tr><td>token bucket</td><td>fichas que se recargan a ritmo fijo; cada petición gasta una</td><td>permite ráfagas controladas (suele ser lo deseado)</td></tr>
       </tbody></table></div>
     <p>Con varias réplicas, el contador debe estar en un almacén compartido (Redis). Si no, cada réplica permite el límite completo.</p>`},
 {t:"par", p:"Empareja cada amenaza con su defensa",
  pares:[["Fuerza bruta en el login","Rate limiting y bloqueo progresivo"],["Cuerpos de petición gigantes","Límite de tamaño en express.json"],["Dependencia con vulnerabilidad conocida","npm audit, Dependabot y actualizar"],["Secreto subido a Git","Rotarlo de inmediato y usar variables de entorno o un gestor"],["Inyección en consultas","Parámetros y validación de entrada"]],
  why:"La mayoría de incidentes reales vienen de dependencias y secretos, no de ataques sofisticados."},
 {t:"opcion", p:"Alguien subió por error el <code>.env</code> con la clave de la base de datos a un repositorio público. ¿Qué es lo primero?",
  ops:["Borrar el commit y listo","Rotar la clave de inmediato (asume que ya está comprometida), luego limpiar el historial y revisar accesos","Hacer el repositorio privado","Esperar a ver si pasa algo"],
  ok:1, why:"Los bots escanean GitHub en segundos. Borrar el commit no anula lo que ya se copió."},
 {t:"vf", p:"<code>cors({ origin: \"*\" })</code> con credenciales es una configuración adecuada para una API con sesiones.",
  ok:false, why:"Los navegadores no lo permiten con credenciales y, conceptualmente, abre la API a cualquier web. Lista los orígenes."},
 {t:"vf", p:"CORS protege tu API de peticiones hechas con curl o desde otro servidor.",
  ok:false, why:"CORS es una regla del navegador para proteger al usuario. curl o un servidor lo ignoran. La autorización real la hace tu API."},
 {t:"codigo", p:"Implementa un rate limiter token bucket: capacidad 3 fichas, se recarga 1 ficha por segundo. Para cada instante (en segundos) de stdin imprime <code>200</code> o <code>429</code>",
  lenguaje:"js",
  c:`<p>El cubo empieza lleno. Al llegar una petición en el instante <code>t</code>, primero se suman las fichas recargadas desde la última vez (sin pasar de 3); si hay al menos una, se gasta y responde 200.</p>`,
  plantilla:"const instantes = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(Number);\nconst CAPACIDAD = 3, RITMO = 1;\nlet fichas = CAPACIDAD, ultimo = instantes[0];\nfor (const t of instantes) {\n  // recarga, decide e imprime\n}\n",
  pruebas:[{entrada:"0\n0\n0\n0\n1\n", salida:"200\n200\n200\n429\n200"},{entrada:"0\n0\n0\n0\n0\n5\n5\n", salida:"200\n200\n200\n429\n429\n200\n200"},{entrada:"0\n0.5\n1\n1\n1\n1\n", salida:"200\n200\n200\n200\n429\n429", oculta:true}],
  pista:"fichas = Math.min(CAPACIDAD, fichas + (t - ultimo) * RITMO); ultimo = t; if (fichas >= 1) { fichas--; 200 } else 429.",
  solucion:"const instantes = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(Number);\nconst CAPACIDAD = 3, RITMO = 1;\nlet fichas = CAPACIDAD, ultimo = instantes[0];\nfor (const t of instantes) {\n  fichas = Math.min(CAPACIDAD, fichas + (t - ultimo) * RITMO);\n  ultimo = t;\n  if (fichas >= 1) { fichas--; console.log(200); }\n  else console.log(429);\n}",
  why:"No hace falta un temporizador que recargue: basta con calcular lo recargado al llegar cada petición. En Redis se hace igual, con un script Lua para que sea atómico. Acompaña el 429 con la cabecera Retry-After."}
]},

/* =============== U8 L4 =============== */
{
id:"nd5l3",
titulo:"Subidas de ficheros y datos de usuario",
claves:["Limita tamaño y tipo, y comprueba el contenido real (bytes mágicos)","Genera tú el nombre y evita el path traversal; no guardes nada en la carpeta pública","Mejor: subida directa a S3 con URL prefirmada"],
pasos:[
 {t:"info", eti:"Ficheros", h:"Subidas seguras",
  c:`<div class="termbox">import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

const subir = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.post("/api/avatar", autenticar, subir.single("imagen"), async (req, res) =&gt; {
  const tipo = await fileTypeFromBuffer(req.file.buffer);       // tipo REAL, no el que dice el cliente
  if (!tipo || !["image/png", "image/jpeg", "image/webp"].includes(tipo.mime)) {
    return res.status(415).json({ detail: "Formato no permitido" });
  }
  const clave = \`avatares/\${req.usuario.sub}/\${crypto.randomUUID()}.\${tipo.ext}\`;
  await s3.putObject({ Bucket: "catappa-usuarios", Key: clave, Body: req.file.buffer, ContentType: tipo.mime });
  res.status(201).json({ clave });
});</div>`},
 {t:"info", eti:"Rutas", h:"Path traversal",
  c:`<div class="termbox">// MAL: GET /descargas?f=../../etc/passwd
res.sendFile(path.join(BASE, req.query.f));

// BIEN: resolver y comprobar que sigue dentro de la carpeta
const ruta = path.resolve(BASE, req.query.f);
if (!ruta.startsWith(BASE + path.sep)) return res.sendStatus(403);
res.sendFile(ruta);</div>
     <p>La regla general: el nombre con el que guardas un fichero lo generas tú (un UUID); el nombre original, si hace falta, va a la base de datos como dato, nunca como ruta.</p>`},
 {t:"par", p:"Empareja cada medida con el ataque que previene",
  pares:[["Límite de tamaño","Agotar la memoria o el disco"],["Comprobar el tipo real","Subir un script disfrazado de imagen"],["Nombre generado por el servidor","Path traversal y sobrescribir ficheros"],["Guardar fuera de la carpeta pública","Que se ejecute o sirva algo peligroso"],["URL prefirmada de S3","Que los ficheros pasen por tu servidor y lo saturen"]],
  why:"Las mismas reglas que viste en el curso de Seguridad."},
 {t:"opcion", p:"¿Qué cabecera usarías al servir ficheros subidos por usuarios para que se descarguen en vez de abrirse?",
  ops:["Cache-Control: no-store","Content-Disposition: attachment","Accept: */*","Connection: close"],
  ok:1, why:"Junto a X-Content-Type-Options: nosniff, evita que el navegador interprete el contenido."},
 {t:"vf", p:"Comprobar que el nombre del fichero termina en <code>.png</code> basta para saber que es una imagen PNG.",
  ok:false, why:"El nombre y el Content-Type los decide el cliente. El tipo real se mira en los primeros bytes del contenido."},
 {t:"codigo", p:"Detecta el tipo real por los bytes mágicos: cada línea de stdin son los primeros bytes de un fichero en hexadecimal. Imprime <code>png</code>, <code>jpeg</code>, <code>pdf</code> o <code>desconocido</code>",
  lenguaje:"js",
  c:`<p>Firmas: PNG empieza por <code>89 50 4E 47</code>; JPEG por <code>FF D8 FF</code>; PDF por los caracteres <code>%PDF</code> (<code>25 50 44 46</code>).</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const hex of lineas) {\n  const b = Buffer.from(hex, \"hex\");\n  // compara el principio del buffer con cada firma\n}\n",
  pruebas:[{entrada:"89504e470d0a1a0a\nffd8ffe000104a46\n", salida:"png\njpeg"},{entrada:"255044462d312e37\n3c3f706870206563\n", salida:"pdf\ndesconocido"},{entrada:"ffd8\n89504e46\n", salida:"desconocido\ndesconocido", oculta:true}],
  pista:"Define las firmas como Buffer.from(\"89504e47\", \"hex\") y usa b.subarray(0, firma.length).equals(firma).",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst firmas = [[\"png\", \"89504e47\"], [\"jpeg\", \"ffd8ff\"], [\"pdf\", \"25504446\"]].map(([n, h]) => [n, Buffer.from(h, \"hex\")]);\nfor (const hex of lineas) {\n  const b = Buffer.from(hex, \"hex\");\n  const tipo = firmas.find(([, f]) => b.length >= f.length && b.subarray(0, f.length).equals(f));\n  console.log(tipo ? tipo[0] : \"desconocido\");\n}",
  why:"Es lo que hace el paquete file-type con cientos de formatos. El <code>3c3f706870</code> del ejemplo es <code>&lt;?php</code>: un script que alguien intentaba subir como imagen."},
 {t:"codigo", p:"Evita el path traversal: para cada nombre pedido (stdin) imprime la ruta final dentro de <code>/srv/ficheros</code> o <code>prohibido</code> si se sale de la carpeta",
  lenguaje:"js",
  c:`<p>Usa <code>path.posix</code> (rutas con /) para que el resultado sea igual en cualquier sistema.</p>`,
  plantilla:"const path = require(\"node:path\").posix;\nconst BASE = \"/srv/ficheros\";\nconst pedidos = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const p of pedidos) {\n  // resuelve y comprueba\n}\n",
  pruebas:[{entrada:"informe.pdf\n../../etc/passwd\n", salida:"/srv/ficheros/informe.pdf\nprohibido"},{entrada:"fotos/../informe.pdf\n/etc/shadow\n", salida:"/srv/ficheros/informe.pdf\nprohibido"},{entrada:"../ficheros-secretos/x\nfotos/a.png\n", salida:"prohibido\n/srv/ficheros/fotos/a.png", oculta:true}],
  pista:"const ruta = path.resolve(BASE, p); vale si ruta.startsWith(BASE + \"/\"). Ojo: sin la barra, /srv/ficheros-secretos también empezaría por BASE.",
  solucion:"const path = require(\"node:path\").posix;\nconst BASE = \"/srv/ficheros\";\nconst pedidos = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const p of pedidos) {\n  const ruta = path.resolve(BASE, p);\n  console.log(ruta.startsWith(BASE + \"/\") ? ruta : \"prohibido\");\n}",
  why:"path.resolve normaliza los .. y trata una ruta absoluta (/etc/shadow) como nuevo origen: por eso hay que comprobar el resultado, no la entrada. El caso oculto es la trampa del prefijo sin barra."}
]},

/* =============== U8 L5 =============== */
{
id:"nd8n2",
titulo:"Dependencias, cadena de suministro y OWASP en Node",
claves:["npm audit, lockfile, npm ci y actualizaciones automáticas; cuidado con los scripts de instalación","Fallos propios de JavaScript: prototype pollution, eval, deserialización y ReDoS","SSRF al hacer fetch a URLs del usuario; el modelo de permisos de Node limita el daño"],
pasos:[
 {t:"info", eti:"Cadena de suministro", h:"Tus dependencias son tu código",
  c:`<p>Una API típica tiene cientos de paquetes indirectos. Cualquiera puede tener una vulnerabilidad, ser abandonado o ser secuestrado (han ocurrido: event-stream, ua-parser-js, y oleadas de paquetes comprometidos con gusanos que roban tokens de npm).</p>
     <div class="termbox">npm audit                      # vulnerabilidades conocidas del árbol
npm audit --omit=dev           # solo lo que llega a producción
npm audit fix                  # sube versiones compatibles
npm audit signatures           # firmas y procedencia de lo instalado
npm ci --ignore-scripts        # no ejecuta postinstall de terceros
npm outdated                   # qué está desactualizado</div>
     <ul><li><b>Lockfile</b> siempre en el repositorio y <code>npm ci</code> en CI.</li>
     <li><b>Dependabot o Renovate</b> para actualizaciones pequeñas y frecuentes.</li>
     <li><b>Typosquatting</b>: revisa el nombre antes de instalar (<code>expres</code>, <code>lodahs</code>…).</li>
     <li><b>Menos dependencias</b>: Node trae fetch, test, --watch, --env-file, crypto.randomUUID, structuredClone… muchos paquetes ya sobran.</li></ul>`},
 {t:"info", eti:"Fallos de JavaScript", h:"Vulnerabilidades típicas en Node",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">vulnerabilidad → defensa</div>
       <table class="dg-tabla"><tbody>
       <tr><td>prototype pollution</td><td>un merge de JSON con <code>__proto__</code> contamina todos los objetos: ignora esas claves, usa <code>Object.create(null)</code> o <code>Map</code></td></tr>
       <tr><td>eval y new Function</td><td>nunca con datos externos; tampoco <code>vm</code> como «sandbox» de seguridad</td></tr>
       <tr><td>SSRF</td><td>un <code>fetch(urlDelUsuario)</code> puede llegar a 169.254.169.254 (metadatos de la nube) o a servicios internos: lista blanca de dominios</td></tr>
       <tr><td>inyección de comandos</td><td>execFile con argumentos separados, nunca exec con texto concatenado</td></tr>
       <tr><td>NoSQL injection</td><td><code>{ "clave": { "$ne": "" } }</code> en un filtro de Mongo: valida tipos</td></tr>
       </tbody></table></div>
     <div class="termbox"># modelo de permisos (estable desde Node 22.13): limita lo que el proceso puede tocar
node --permission --allow-fs-read=/app --allow-fs-write=/app/tmp server.js</div>`},
 {t:"par", p:"Empareja cada comando con lo que hace",
  pares:[["npm audit","Lista vulnerabilidades conocidas del árbol de dependencias"],["npm ci --ignore-scripts","Instala sin ejecutar scripts de instalación de terceros"],["npm outdated","Muestra qué paquetes tienen versiones nuevas"],["npm audit signatures","Comprueba las firmas de los paquetes del registro"]],
  why:"Meter npm audit --omit=dev --audit-level=high en CI hace fallar el pipeline ante vulnerabilidades graves."},
 {t:"opcion", p:"Tu API recibe una URL para generar la vista previa de un enlace y hace <code>fetch(url)</code>. ¿Qué riesgo tiene?",
  ops:["Ninguno","SSRF: el atacante pasa http://169.254.169.254/ o http://localhost:6379 y tu servidor hace de puente hacia la red interna","Solo que tarde mucho","XSS en el navegador"],
  ok:1, why:"Valida el esquema y el dominio contra una lista, resuelve la IP y rechaza rangos privados, pon timeout y límite de tamaño. En AWS, exige IMDSv2."},
 {t:"vf", p:"<code>npm install</code> puede ejecutar código arbitrario del paquete en tu máquina o en CI a través de scripts como <code>postinstall</code>.",
  ok:true, why:"Es la vía favorita de los paquetes maliciosos para robar tokens y variables de entorno. --ignore-scripts, o pnpm, que no los ejecuta salvo que los autorices, reducen el riesgo."},
 {t:"opcion", p:"<code>npm audit</code> avisa de una vulnerabilidad crítica en una dependencia indirecta y la directa aún no ha publicado arreglo. ¿Qué haces?",
  ops:["Nada hasta que publiquen","Evaluar si te afecta; si sí, forzar la versión corregida con overrides en package.json y probar, o sustituir la dependencia","Borrar package-lock.json","Desactivar npm audit"],
  ok:1, why:"overrides fuerza la versión de un paquete en todo el árbol. Documenta por qué y quítalo cuando la dependencia directa se actualice."},
 {t:"codigo", p:"Escribe un <code>fusionar(destino, origen)</code> recursivo que NO permita prototype pollution: ignora las claves <code>__proto__</code>, <code>constructor</code> y <code>prototype</code>",
  lenguaje:"js",
  c:`<p>La plantilla fusiona un JSON malicioso y comprueba si todos los objetos se han contaminado. Salida: <code>{"tema":"oscuro","avisos":{"email":false}}</code> y <code>undefined</code>.</p>`,
  plantilla:"function fusionar(destino, origen) {\n  for (const clave of Object.keys(origen)) {\n    // ignora las claves peligrosas\n    if (origen[clave] && typeof origen[clave] === \"object\") {\n      if (!destino[clave] || typeof destino[clave] !== \"object\") destino[clave] = {};\n      fusionar(destino[clave], origen[clave]);\n    } else {\n      destino[clave] = origen[clave];\n    }\n  }\n  return destino;\n}\n\nconst ajustes = fusionar({ tema: \"claro\" }, JSON.parse('{\"tema\":\"oscuro\",\"avisos\":{\"email\":false},\"__proto__\":{\"esAdmin\":true}}'));\nconsole.log(JSON.stringify(ajustes));\nconsole.log(({}).esAdmin);\n",
  pruebas:[{salida:"{\"tema\":\"oscuro\",\"avisos\":{\"email\":false}}\nundefined"}],
  pista:"Al principio del bucle: if (clave === \"__proto__\" || clave === \"constructor\" || clave === \"prototype\") continue;",
  solucion:"function fusionar(destino, origen) {\n  for (const clave of Object.keys(origen)) {\n    if (clave === \"__proto__\" || clave === \"constructor\" || clave === \"prototype\") continue;\n    if (origen[clave] && typeof origen[clave] === \"object\") {\n      if (!destino[clave] || typeof destino[clave] !== \"object\") destino[clave] = {};\n      fusionar(destino[clave], origen[clave]);\n    } else {\n      destino[clave] = origen[clave];\n    }\n  }\n  return destino;\n}\n\nconst ajustes = fusionar({ tema: \"claro\" }, JSON.parse('{\"tema\":\"oscuro\",\"avisos\":{\"email\":false},\"__proto__\":{\"esAdmin\":true}}'));\nconsole.log(JSON.stringify(ajustes));\nconsole.log(({}).esAdmin);",
  why:"Sin el filtro, destino[\"__proto__\"] es Object.prototype y la fusión le añade esAdmin: true a TODOS los objetos del proceso. Así se han saltado comprobaciones de permisos en aplicaciones reales."}
]}

]});
