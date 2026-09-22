window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Autenticación y seguridad",
resumen: "Contraseñas con bcrypt o argon2, sesiones con cookies y JWT, cabeceras de seguridad, CORS, límites de peticiones y secretos",
nivel: "Avanzado",
color: "#65a541",
lecciones: [

{
id:"nd5l1",
titulo:"Contraseñas, sesiones y tokens",
claves:["Hashea contraseñas con argon2 o bcrypt (nunca SHA o MD5)","Cookies de sesión HttpOnly, Secure y SameSite para aplicaciones web","JWT firmados y cortos para APIs; verifica firma, caducidad y emisor"],
pasos:[
 {t:"info", eti:"Identidad", h:"Registro y login",
  c:`<div class="termbox">import argon2 from "argon2";
import jwt from "jsonwebtoken";

const hash = await argon2.hash(clave);                         // registro
const ok = await argon2.verify(usuario.hash, claveIntroducida);  // login

const token = jwt.sign({ sub: String(usuario.id), rol: usuario.rol }, process.env.JWT_SECRETO!, { expiresIn: "15m" });

function autenticar(req, res, next) {
  const [, t] = (req.headers.authorization ?? "").split(" ");
  try { req.usuario = jwt.verify(t, process.env.JWT_SECRETO!); next(); }
  catch { res.status(401).json({ detail: "No autenticado" }); }
}</div>
     <p>Para una aplicación web propia, una <b>cookie de sesión</b> <code>HttpOnly</code> (JavaScript no puede leerla) es más resistente a XSS que guardar un JWT en localStorage.</p>`},
 {t:"par", p:"Empareja cada atributo de cookie con lo que aporta",
  pares:[["HttpOnly","JavaScript de la página no puede leerla"],["Secure","Solo se envía por HTTPS"],["SameSite=Lax","No se envía en peticiones de otros sitios (mitiga CSRF)"],["Max-Age","Cuándo caduca"]],
  why:"Esta plataforma usa un token en cabecera; en producción pública, cookies HttpOnly serían preferibles."},
 {t:"opcion", p:"¿Por qué argon2 o bcrypt y no SHA-256 para las contraseñas?",
  ops:["SHA-256 no existe en Node","SHA-256 es muy rápido: con la base de datos robada se prueban miles de millones de contraseñas por segundo. argon2 y bcrypt son lentos a propósito y llevan sal","Por el tamaño","Da igual"],
  ok:1, why:"Los mismos principios que en Spring Security."}
]},

{
id:"nd5l2",
titulo:"Endurecer una API",
claves:["helmet añade cabeceras de seguridad; CORS solo para orígenes conocidos","Rate limiting contra fuerza bruta y abuso","Secretos en variables de entorno o un gestor, nunca en el repositorio; npm audit y dependencias al día"],
pasos:[
 {t:"info", eti:"Capas", h:"Medidas básicas",
  c:`<div class="termbox">import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

app.use(helmet());
app.use(cors({ origin: ["https://app.catappa.dev"], credentials: true }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60_000, limit: 20 }));
app.use(express.json({ limit: "100kb" }));        // cuerpos enormes = ataque barato
app.disable("x-powered-by");</div>`},
 {t:"par", p:"Empareja cada amenaza con su defensa",
  pares:[["Fuerza bruta en el login","Rate limiting y bloqueo progresivo"],["Cuerpos de petición gigantes","Límite de tamaño en express.json"],["Dependencia con vulnerabilidad conocida","npm audit, Dependabot y actualizar"],["Secreto subido a Git","Rotarlo de inmediato y usar variables de entorno o un gestor"],["Inyección en consultas","Parámetros y validación de entrada"]],
  why:"La mayoría de incidentes reales vienen de dependencias y secretos, no de ataques sofisticados."},
 {t:"opcion", p:"Alguien subió por error el <code>.env</code> con la clave de la base de datos a un repositorio público. ¿Qué es lo primero?",
  ops:["Borrar el commit y listo","Rotar la clave de inmediato (asume que ya está comprometida), luego limpiar el historial y revisar accesos","Hacer el repositorio privado","Esperar a ver si pasa algo"],
  ok:1, why:"Los bots escanean GitHub en segundos. Borrar el commit no anula lo que ya se copió."},
 {t:"vf", p:"<code>cors({ origin: \"*\" })</code> con credenciales es una configuración adecuada para una API con sesiones.",
  ok:false, why:"Los navegadores no lo permiten con credenciales y, conceptualmente, abre la API a cualquier web. Lista los orígenes."}
]},

{
id:"nd5l3",
titulo:"Subidas de ficheros y datos de usuario",
claves:["Limita tamaño y tipo, y comprueba el contenido real","No guardes ficheros subidos dentro de la carpeta pública del servidor","Mejor: subida directa a S3 con URL prefirmada"],
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
 {t:"par", p:"Empareja cada medida con el ataque que previene",
  pares:[["Límite de tamaño","Agotar la memoria o el disco"],["Comprobar el tipo real","Subir un script disfrazado de imagen"],["Nombre generado por el servidor","Path traversal y sobrescribir ficheros"],["Guardar fuera de la carpeta pública","Que se ejecute o sirva algo peligroso"],["URL prefirmada de S3","Que los ficheros pasen por tu servidor y lo saturen"]],
  why:"Las mismas reglas que viste en el curso de Seguridad."},
 {t:"opcion", p:"¿Qué cabecera usarías al servir ficheros subidos por usuarios para que se descarguen en vez de abrirse?",
  ops:["Cache-Control: no-store","Content-Disposition: attachment","Accept: */*","Connection: close"],
  ok:1, why:"Junto a X-Content-Type-Options: nosniff, evita que el navegador interprete el contenido."}
]}

]});
