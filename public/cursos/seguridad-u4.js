window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Criptografía aplicada",
resumen: "Hash, HMAC, cifrado simétrico y asimétrico, firmas, aleatoriedad segura, TLS y los errores más comunes",
nivel: "Avanzado",
color: "#e16053",
lecciones: [

{
id:"sg4l1",
titulo:"Hash, cifrado y firmas",
claves:["Hash: huella de un solo sentido; para contraseñas, hash lento con sal","Cifrado simétrico (AES-GCM) con una clave; asimétrico (RSA, ECC) con pareja pública y privada","Firma digital: demuestra quién lo firmó y que no se ha modificado"],
pasos:[
 {t:"info", eti:"Las piezas", h:"Herramientas criptográficas",
  c:`<div class="diag">HASH (SHA-256)            datos -&gt; huella fija. No se puede revertir.
                          Integridad de ficheros, identificadores de contenido.
HASH DE CONTRASENAS       argon2id / bcrypt: lento y con sal.
HMAC                      hash con clave secreta: autentica mensajes (webhooks, firmas de API).
SIMETRICO (AES-256-GCM)   misma clave para cifrar y descifrar. Rapido: datos en reposo.
ASIMETRICO (RSA, ECDH)    clave publica cifra / privada descifra. Intercambio de claves.
FIRMA (Ed25519, ECDSA)    privada firma / publica verifica. JWT RS256, cosign, git.</div>`},
 {t:"par", p:"Empareja cada necesidad con la herramienta criptográfica",
  pares:[["Guardar contraseñas","argon2id o bcrypt"],["Verificar que un webhook viene de Stripe","HMAC con el secreto compartido"],["Cifrar una columna de la base de datos","AES-GCM con la clave en un KMS"],["Demostrar que una imagen la construyó tu pipeline","Firma digital (cosign)"],["Comprobar que un fichero descargado no se corrompió","Hash SHA-256"]],
  why:"Usar la herramienta equivocada (por ejemplo, cifrar contraseñas en vez de hashearlas) es un error de diseño."},
 {t:"opcion", p:"¿Por qué no se «cifran» las contraseñas en lugar de hashearlas?",
  ops:["Por velocidad","Porque el cifrado es reversible: quien robe la clave obtiene todas las contraseñas. Con un hash no hay nada que descifrar","Porque no se puede cifrar texto","Da igual"],
  ok:1, why:"Solo necesitas comprobar que la contraseña coincide, nunca recuperarla."},
 {t:"vf", p:"MD5 y SHA-1 siguen siendo adecuados para firmas y contraseñas.",
  ok:false, why:"Están rotos para esos usos (colisiones) y son demasiado rápidos para contraseñas."}
]},

{
id:"sg4l2",
titulo:"Errores comunes y buenas prácticas",
claves:["No inventes criptografía: usa librerías de alto nivel","Aleatoriedad segura (SecureRandom, crypto.randomBytes, secrets) para tokens","Gestiona las claves en un KMS y rótalas; cifra en tránsito (TLS) y en reposo"],
pasos:[
 {t:"info", eti:"Lo que sale mal", h:"Errores típicos",
  c:`<ul><li>Generar tokens con <code>Math.random()</code> o <code>java.util.Random</code>: son predecibles. Usa <code>SecureRandom</code>, <code>crypto.randomUUID()</code> o <code>secrets.token_urlsafe()</code>.</li>
     <li>AES en modo ECB (patrones visibles) o reutilizar el mismo nonce en GCM.</li>
     <li>Comparar firmas o tokens con <code>==</code> (ataques de tiempo): usa comparaciones de tiempo constante.</li>
     <li>Claves en el código o en el repositorio.</li>
     <li>Desactivar la verificación de certificados TLS.</li>
     <li>Algoritmos propios «ingeniosos».</li></ul>`},
 {t:"par", p:"Empareja cada error con su corrección",
  pares:[["Token de recuperación con Math.random()","Generador criptográfico seguro"],["Clave de cifrado en application.yml","KMS o gestor de secretos"],["Comparar HMAC con ==","Comparación en tiempo constante"],["verify=False en las peticiones HTTPS","Verificar certificados y confiar en la CA correcta"],["AES-ECB","AES-GCM con nonces únicos"]],
  why:"La mayoría de fallos criptográficos reales son de uso, no de algoritmos."},
 {t:"opcion", p:"¿Qué garantiza TLS y qué no?",
  ops:["Todo","Cifra y autentica la comunicación entre cliente y servidor; no protege los datos una vez guardados ni si el servidor está comprometido","Solo la velocidad","Solo que el servidor existe"],
  ok:1, why:"Por eso también se cifra en reposo y se controla el acceso."}
]},

{
id:"sg4l3",
titulo:"TLS y certificados en profundidad",
claves:["Un certificado vincula un nombre con una clave pública y lo firma una CA de confianza","Cadena de confianza, caducidad, revocación y Certificate Transparency","mTLS para servicios internos; TLS 1.2 como mínimo y renovación automática"],
pasos:[
 {t:"info", eti:"Confianza", h:"Cómo se valida un certificado",
  c:`<ol><li>El servidor envía su certificado y los intermedios.</li>
     <li>El cliente construye la <b>cadena</b> hasta una CA raíz de su almacén de confianza.</li>
     <li>Comprueba que el <b>nombre</b> coincide (SAN), que no ha <b>caducado</b> y que no está revocado.</li>
     <li>Comprueba que el servidor posee la clave privada (en el saludo TLS).</li></ol>
     <p>Todos los certificados públicos se registran en <b>Certificate Transparency</b>: puedes vigilar si alguien emite un certificado para tu dominio sin permiso (crt.sh).</p>`},
 {t:"par", p:"Empareja cada error de certificado con su causa",
  pares:[["NET::ERR_CERT_DATE_INVALID","Certificado caducado"],["NET::ERR_CERT_COMMON_NAME_INVALID","El nombre no coincide con el dominio"],["unable to get local issuer certificate","Falta el certificado intermedio o la CA no es de confianza"],["self signed certificate","Certificado autofirmado sin CA reconocida"]],
  why:"El error del intermedio que falta es muy común al configurar Nginx a mano."},
 {t:"opcion", p:"Un servicio interno usa una CA propia y tu cliente Java falla con PKIX path building failed. ¿Solución correcta?",
  ops:["Desactivar la verificación de certificados","Añadir la CA interna al almacén de confianza (truststore) de la aplicación","Usar HTTP","Cambiar de puerto"],
  ok:1, why:"Desactivar la verificación elimina justo la protección que da TLS."}
]}

]});
