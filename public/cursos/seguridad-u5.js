window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Autenticación y sesiones",
resumen: "Contraseñas según NIST 800-63B-4, credential stuffing y enumeración, hash con Argon2id y bcrypt, MFA con TOTP y passkeys (WebAuthn), y sesiones con cookies bien configuradas",
nivel: "Intermedio",
color: "#ea6d60",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"sg3l1",
titulo:"Autenticación robusta",
claves:["Contraseñas largas, sin reglas de composición ni caducidad forzada, y comprobadas contra listas de filtradas","Credential stuffing y fuerza bruta: límites por cuenta y por IP, detección de bots y MFA","Mensajes y tiempos iguales exista o no el usuario; recuperación con tokens de un solo uso"],
pasos:[
 {t:"info", eti:"Quién eres", h:"Contraseñas: lo que dice NIST hoy",
  c:`<p>La guía NIST SP 800-63B-4 (2025) desmontó muchas costumbres:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">política de contraseñas actual</div><table class="dg-tabla"><thead><tr><th>Sí</th><th>No</th></tr></thead><tbody>
       <tr><td>Mínimo 15 caracteres si la contraseña es el único factor (8 si hay MFA)</td><td>Exigir mayúscula + número + símbolo</td></tr>
       <tr><td>Permitir al menos 64 caracteres, espacios y Unicode</td><td>Caducidad cada 90 días sin motivo</td></tr>
       <tr><td>Comprobar contra listas de contraseñas filtradas y obvias</td><td>Preguntas de seguridad («¿nombre de tu mascota?»)</td></tr>
       <tr><td>Permitir pegar y los gestores de contraseñas</td><td>Pistas de contraseña visibles</td></tr>
       <tr><td>Forzar el cambio solo si hay indicios de compromiso</td><td>Truncar la contraseña en silencio</td></tr>
     </tbody></table></div>
     <p>Las reglas de composición empujan a <code>Verano2026!</code>, que cumple todo y está en cualquier diccionario de ataque.</p>`},
 {t:"info", eti:"Ataques reales", h:"Credential stuffing y enumeración",
  c:`<ul><li><b>Credential stuffing</b>: bots que prueban millones de pares email/contraseña filtrados en otras webs. Es el ataque más común contra logins. Defensas: MFA, comprobar contraseñas filtradas, límites de velocidad por IP y por cuenta, detección de bots y avisos de inicio de sesión nuevo.</li>
     <li><b>Fuerza bruta y password spraying</b> (una contraseña común contra muchas cuentas): retrasos crecientes por cuenta y límites por IP. Bloquear la cuenta en seco permite a un atacante bloquear a quien quiera.</li>
     <li><b>Enumeración</b>: el login, el registro y la recuperación no deben revelar si un email existe («si existe, te enviaremos un correo»), ni con el mensaje ni con el tiempo de respuesta.</li>
     <li><b>Recuperación</b>: token aleatorio de un solo uso, que caduca pronto, guardado como hash, y que al usarse cierra las demás sesiones.</li></ul>`},
 {t:"par", p:"Empareja cada ataque con su defensa",
  pares:[["Fuerza bruta contra una cuenta","Retrasos crecientes y límites por cuenta"],["Credential stuffing (contraseñas filtradas de otras webs)","MFA y comprobar contraseñas comprometidas"],["Enumeración de usuarios","Mensajes y tiempos de respuesta iguales exista o no"],["Robo de la base de datos de contraseñas","Hash lento con sal"],["Phishing","Passkeys (ligadas al dominio real)"],["Password spraying desde muchas IP","Detección de patrones globales y MFA"]],
  why:"Ninguna defensa aislada basta: el credential stuffing llega desde miles de IP residenciales, así que los límites por IP solos no lo frenan."},
 {t:"opcion", p:"Tu login responde «el email no existe» o «contraseña incorrecta» según el caso. ¿Qué problema hay?",
  ops:["Ninguno, es más amable","Es más lento","Permite averiguar qué emails están registrados (enumeración) y centrar ataques en ellos","Rompe el MFA"],
  ok:2, why:"Mensaje genérico en ambos casos. Y ojo con el tiempo: si con un email inexistente no calculas ningún hash, la respuesta es mucho más rápida y delata lo mismo."},
 {t:"vf", p:"Obligar a cambiar la contraseña cada 90 días mejora la seguridad según las recomendaciones actuales de NIST.",
  ok:false, why:"Provoca contraseñas previsibles (Verano2026!, Otono2026!). Solo se fuerza el cambio si hay indicios de compromiso."},
 {t:"codigo", p:"¿Está filtrada? (k-anonimato)", lenguaje:"py",
  c:`<p>El servicio Pwned Passwords permite comprobar una contraseña sin enviarla: calculas su SHA-1, envías solo los <b>5 primeros caracteres</b> y te devuelve todos los sufijos que empiezan así, con cuántas veces aparecen en filtraciones.</p>
     <p>La primera línea de la entrada es la contraseña; las siguientes, la respuesta del servicio (<code>SUFIJO:VECES</code>). Imprime el prefijo enviado en la primera línea y, en la segunda, <code>filtrada N veces</code> o <code>no aparece</code>. Usa el hash en hexadecimal y mayúsculas.</p>`,
  plantilla:"import hashlib, sys\n\nlineas = sys.stdin.read().splitlines()\nclave = lineas[0]\nrespuesta = lineas[1:]\n# calcula el SHA-1, separa prefijo y sufijo, busca el sufijo\n",
  pruebas:[
   {entrada:"password\n1D2DA4053E34E76F6576ED1DA63134B5E2A:2\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:10434004\n1E4E9B1B5A2D0FD4B3A2E6F77B8C9B0D0E1:3\n", salida:"5BAA6\nfiltrada 10434004 veces"},
   {entrada:"CaballoGrapaBateria-Correcta\n2C9531AE74DF10FB9BB9150A922EF4B58A8:1\n", salida:"870A2\nno aparece", oculta:true}
  ],
  pista:"hashlib.sha1(clave.encode()).hexdigest().upper(); prefijo = h[:5], sufijo = h[5:].",
  solucion:"import hashlib, sys\n\nlineas = sys.stdin.read().splitlines()\nclave = lineas[0]\nrespuesta = lineas[1:]\nh = hashlib.sha1(clave.encode()).hexdigest().upper()\nprefijo, sufijo = h[:5], h[5:]\nprint(prefijo)\nveces = None\nfor linea in respuesta:\n    if \":\" in linea:\n        s, n = linea.strip().split(\":\")\n        if s == sufijo:\n            veces = int(n)\nprint(f\"filtrada {veces} veces\" if veces else \"no aparece\")\n",
  why:"El servicio nunca ve la contraseña ni su hash completo: entre los cientos de sufijos que devuelve no sabe cuál era el tuyo. Es la forma estándar de aplicar la recomendación de NIST sin exponer nada."}
]},

/* =============== U5 L2 =============== */
{
id:"sg5n1",
titulo:"Guardar contraseñas: Argon2id, bcrypt y compañía",
claves:["Hash lento, con sal única por usuario y parámetros de coste que se revisan con los años","Argon2id es la primera opción; bcrypt (con su límite de 72 bytes), scrypt y PBKDF2 son válidos con los parámetros adecuados","Rehash transparente al iniciar sesión cuando cambian los parámetros; pepper opcional en un KMS"],
pasos:[
 {t:"info", eti:"Por qué lento", h:"Hash de contraseñas",
  c:`<p>Un SHA-256 se calcula miles de millones de veces por segundo en una GPU: con la base robada, las contraseñas débiles caen en minutos. Los algoritmos de contraseñas son <b>lentos a propósito</b> y, los modernos, <b>costosos en memoria</b> (lo que frena GPUs y ASICs).</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">parámetros mínimos recomendados por owasp</div><table class="dg-tabla"><thead><tr><th>Algoritmo</th><th>Configuración</th></tr></thead><tbody>
       <tr><td>Argon2id</td><td>19 MiB de memoria, 2 iteraciones, 1 hilo (o más memoria y menos iteraciones)</td></tr>
       <tr><td>scrypt</td><td>N=2^17, r=8, p=1</td></tr>
       <tr><td>bcrypt</td><td>coste 10 o más; solo usa los primeros 72 bytes de la contraseña</td></tr>
       <tr><td>PBKDF2-HMAC-SHA256</td><td>600.000 iteraciones; cuando se exige FIPS-140</td></tr>
     </tbody></table></div>
     <p>La <b>sal</b> (aleatoria, única por usuario, guardada junto al hash) hace que dos usuarios con la misma contraseña tengan hashes distintos e inutiliza las tablas precalculadas. Las librerías la generan y la incluyen en el propio resultado: <code>$argon2id$v=19$m=19456,t=2,p=1$sal$hash</code>.</p>`},
 {t:"info", eti:"En el día a día", h:"Verificar, migrar y pepper",
  c:`<div class="termbox"># Python con argon2-cffi
from argon2 import PasswordHasher
ph = PasswordHasher()                  # parámetros actuales recomendados
h = ph.hash(clave)                     # al registrarse
ph.verify(h, intento)                  # al iniciar sesión (lanza excepción si no coincide)
if ph.check_needs_rehash(h):           # parámetros antiguos
    guardar(ph.hash(intento))          # se actualiza sin molestar al usuario</div>
     <ul><li><b>Migrar desde MD5/SHA-1</b>: no esperes a que cada usuario entre. Envuelve los hashes viejos ya (<code>argon2(md5_viejo)</code>), marca el formato y pasa al esquema limpio en su siguiente login.</li>
     <li><b>Pepper</b>: un secreto adicional fuera de la base de datos (en un KMS o HSM), aplicado con HMAC. Si solo roban la base, no les basta.</li>
     <li><b>bcrypt y 72 bytes</b>: lo que pase de ahí se ignora; con frases de contraseña largas o multibyte, o eliges Argon2id, o limitas la longitud de forma explícita.</li></ul>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["Sal","Que la misma contraseña produzca hashes distintos en cada usuario"],["Coste o iteraciones","Hacer cara cada prueba del atacante"],["Memoria en Argon2id","Frenar el ataque con GPUs y hardware específico"],["Pepper","Secreto fuera de la base de datos que también hace falta"],["check_needs_rehash","Actualizar parámetros cuando el usuario inicia sesión"]],
  why:"Con sal, el atacante tiene que atacar cada hash por separado; con coste alto, cada intento le sale caro."},
 {t:"opcion", p:"Heredas una base con contraseñas en SHA-1 sin sal. ¿Qué haces?",
  ops:["Esperar a que cada usuario inicie sesión para rehashear","Descifrarlas y volver a guardarlas con argon2","Envolver ya todos los hashes (argon2id del SHA-1 existente), y al siguiente login de cada usuario pasar a argon2id directo sobre la contraseña","Añadir una sal al SHA-1 y dejarlo así"],
  ok:2, why:"Esperar deja expuestos para siempre a los usuarios que no vuelven. Y los hashes no se «descifran»: por eso se envuelven."},
 {t:"vf", p:"Con bcrypt, las contraseñas «AAAA...A» (80 veces A) y «AAAA...AB» (80 veces A y una B) producen el mismo resultado al verificar.",
  ok:true, why:"bcrypt solo mira los primeros 72 bytes: todo lo que va después se ignora. Es un límite conocido que conviene tratar de forma explícita."},
 {t:"codigo", p:"Verifica y decide si hay que rehashear", lenguaje:"py",
  c:`<p>La primera línea es un hash guardado con el formato <code>pbkdf2_sha256$iteraciones$sal_hex$hash_hex</code>; la segunda, la contraseña que escribe el usuario. Calcula <code>hashlib.pbkdf2_hmac("sha256", clave, sal, iteraciones)</code> y compáralo con <code>hmac.compare_digest</code>.</p>
     <p>Imprime <code>correcta</code> o <code>incorrecta</code>. Si es correcta y las iteraciones son menos de 600000, imprime además <code>rehash</code> en otra línea.</p>`,
  plantilla:"import hashlib, hmac\n\nguardado = input().strip()\nintento = input()\n# separa el formato, calcula y compara en tiempo constante\n",
  pruebas:[
   {entrada:"pbkdf2_sha256$1000$a1b2c3d4e5f60718$86380ff0917d7fc569a89ea02f13e2f98eb124205f90469ca89ef7eb8dd4084c\nMandarina-Azul-42\n", salida:"correcta\nrehash"},
   {entrada:"pbkdf2_sha256$1000$a1b2c3d4e5f60718$86380ff0917d7fc569a89ea02f13e2f98eb124205f90469ca89ef7eb8dd4084c\nmandarina-azul-42\n", salida:"incorrecta"},
   {entrada:"pbkdf2_sha256$600000$a1b2c3d4e5f60718$3a0969bdef58054a4926e03498111099bdffe770676f12212b60411f1ad3f8ad\nMandarina-Azul-42\n", salida:"correcta", oculta:true}
  ],
  pista:"algoritmo, iteraciones, sal, esperado = guardado.split(\"$\"); bytes.fromhex(sal).",
  solucion:"import hashlib, hmac\n\nguardado = input().strip()\nintento = input()\nalgoritmo, iteraciones, sal, esperado = guardado.split(\"$\")\niteraciones = int(iteraciones)\ncalculado = hashlib.pbkdf2_hmac(\"sha256\", intento.encode(), bytes.fromhex(sal), iteraciones)\nif hmac.compare_digest(calculado, bytes.fromhex(esperado)):\n    print(\"correcta\")\n    if iteraciones < 600000:\n        print(\"rehash\")\nelse:\n    print(\"incorrecta\")\n",
  why:"Guardar el algoritmo y los parámetros junto al hash es lo que permite subir el coste con los años sin romper los hashes antiguos. compare_digest evita filtrar información por el tiempo de comparación."}
]},

/* =============== U5 L3 =============== */
{
id:"sg5n2",
titulo:"MFA, TOTP y passkeys",
claves:["Factores: algo que sabes, algo que tienes, algo que eres; el SMS es el segundo factor más débil","TOTP: código de 6 dígitos derivado de un secreto compartido y la hora (RFC 6238)","Passkeys (WebAuthn/FIDO2): clave privada en el dispositivo, ligada al dominio; resistentes al phishing"],
pasos:[
 {t:"info", eti:"Más de un factor", h:"Qué segundo factor elegir",
  c:`<div class="dg"><div class="dg-tit">de más débil a más fuerte frente al phishing</div><div class="dg-vert">
       <div class="dg-caja aviso doble">SMS o llamada<small>duplicado de SIM, interceptación, reenvío por phishing</small></div>
       <div class="dg-caja doble">Notificación push<small>fatiga de MFA: el usuario acaba aceptando; mejor con número a teclear</small></div>
       <div class="dg-caja doble">TOTP (app de autenticación)<small>sin red; pero el código se puede teclear en una web falsa</small></div>
       <div class="dg-caja ok doble">Passkeys / llaves FIDO2<small>la firma va ligada al dominio real: una web falsa no obtiene nada útil</small></div>
     </div></div>
     <p>Cualquier MFA es mucho mejor que ninguno. Pero ante el phishing con proxy en tiempo real (kits tipo <i>adversary-in-the-middle</i> que roban el código y la cookie de sesión), solo las opciones ligadas al origen, como las passkeys, resisten.</p>`},
 {t:"info", eti:"Cómo funciona", h:"TOTP y WebAuthn por dentro",
  c:`<p><b>TOTP</b> (RFC 6238): servidor y app comparten un secreto (el QR). Cada 30 segundos, ambos calculan <code>HMAC-SHA1(secreto, floor(hora_unix / 30))</code>, toman 4 bytes según el último nibble y se quedan con 6 dígitos. El servidor acepta la ventana actual y, como mucho, una a cada lado, y no acepta dos veces el mismo código.</p>
     <p><b>WebAuthn / passkeys</b>: al registrarse, el dispositivo crea un par de claves <b>para ese dominio</b> y envía la pública. Al entrar, el servidor manda un reto aleatorio; el dispositivo lo firma con la privada tras desbloquearse (huella, cara, PIN). El navegador incluye el origen en lo firmado, así que una web de phishing obtendría una firma para <b>su</b> dominio, inútil en el tuyo. En el servidor no hay nada que robar que sirva para entrar.</p>`},
 {t:"par", p:"Empareja cada ataque con el factor que lo resiste mejor",
  pares:[["Duplicado de SIM","Cualquiera salvo SMS"],["Web de phishing que retransmite en tiempo real","Passkeys o llaves FIDO2"],["Bombardeo de notificaciones push","Push con número a teclear o passkeys"],["Robo de la base de datos del servidor","Passkeys (solo hay claves públicas)"]],
  why:"Las passkeys sincronizadas (iCloud, Google, gestores de contraseñas) quitaron la principal barrera: perder el dispositivo ya no significa perder la cuenta."},
 {t:"opcion", p:"¿Por qué una passkey no sirve si el usuario la usa sin querer en <code>tienda-login.com</code> (una web falsa)?",
  ops:["Porque la web falsa no tiene HTTPS","Porque la credencial está ligada al identificador de la parte que confía (el dominio real): el navegador ni la ofrece para otro dominio","Porque caduca a los 30 segundos","Porque la passkey se guarda en el servidor"],
  ok:1, why:"Es la diferencia clave con TOTP: con un código, es el usuario quien decide dónde teclearlo; con una passkey decide el navegador, que no se deja engañar por un dominio parecido."},
 {t:"vf", p:"Un servidor TOTP bien hecho acepta el mismo código dos veces si llega dentro de los mismos 30 segundos.",
  ok:false, why:"Debe recordar el último paso de tiempo usado por cada usuario y rechazar la reutilización; si no, un código capturado se puede reenviar."},
 {t:"codigo", p:"Calcula un código TOTP", lenguaje:"py",
  c:`<p>Implementa TOTP (RFC 6238, SHA-1, 6 dígitos, pasos de 30 s). La entrada es el secreto en base32 y la hora Unix. Pasos:</p>
     <ol><li><code>clave = base64.b32decode(secreto)</code> y <code>contador = hora // 30</code> como 8 bytes big-endian.</li>
     <li><code>h = hmac.new(clave, contador, "sha1").digest()</code>; <code>o = h[-1] &amp; 15</code>.</li>
     <li>Toma los 4 bytes desde <code>o</code>, quita el bit alto (<code>&amp; 0x7fffffff</code>) y haz módulo 1.000.000.</li>
     <li>Imprime con 6 dígitos y ceros a la izquierda.</li></ol>`,
  plantilla:"import base64, hmac, struct\n\nsecreto = input().strip()\nhora = int(input())\n# calcula el código\n",
  pruebas:[
   {entrada:"GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\n59\n", salida:"287082"},
   {entrada:"GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\n1111111109\n", salida:"081804"},
   {entrada:"GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\n1234567890\n", salida:"005924", oculta:true},
   {entrada:"GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\n2000000000\n", salida:"279037", oculta:true}
  ],
  pista:"struct.pack(\">Q\", hora // 30) y struct.unpack(\">I\", h[o:o+4])[0].",
  solucion:"import base64, hmac, struct\n\nsecreto = input().strip()\nhora = int(input())\nclave = base64.b32decode(secreto)\ncontador = struct.pack(\">Q\", hora // 30)\nh = hmac.new(clave, contador, \"sha1\").digest()\no = h[-1] & 15\nnumero = (struct.unpack(\">I\", h[o:o + 4])[0] & 0x7fffffff) % 1000000\nprint(f\"{numero:06d}\")\n",
  why:"Los casos de prueba son los vectores oficiales del RFC 6238. Todo el «misterio» de las apps de autenticación son estas siete líneas: por eso el secreto del QR hay que guardarlo cifrado."}
]},

/* =============== U5 L4 =============== */
{
id:"sg3l2",
titulo:"Sesiones y cookies seguras",
claves:["Identificador de sesión aleatorio (128 bits o más), guardado en una cookie HttpOnly, Secure y SameSite con prefijo __Host-","Regenerar el identificador al iniciar sesión y al cambiar privilegios; invalidar en el servidor al salir","Caducidad por inactividad y absoluta; reautenticación para acciones sensibles"],
pasos:[
 {t:"info", eti:"La sesión", h:"Una cookie bien puesta",
  c:`<div class="termbox">Set-Cookie: __Host-sid=Vx3k9...; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=28800</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué aporta cada atributo</div><table class="dg-tabla"><tbody>
       <tr><td>__Host-</td><td>el navegador exige Secure, Path=/ y ningún Domain: la cookie no la puede fijar ni pisar un subdominio</td></tr>
       <tr><td>Secure</td><td>solo viaja por HTTPS</td></tr>
       <tr><td>HttpOnly</td><td>JavaScript no puede leerla</td></tr>
       <tr><td>SameSite=Lax</td><td>no viaja en peticiones entre sitios salvo navegaciones GET</td></tr>
       <tr><td>Max-Age</td><td>caducidad en el navegador (la de verdad se controla en el servidor)</td></tr>
     </tbody></table></div>
     <p>Sin atributo <code>Domain</code>, la cookie solo se envía al host exacto; con <code>Domain=tienda.com</code> se envía también a todos los subdominios, incluido el blog olvidado.</p>`},
 {t:"info", eti:"Ciclo de vida", h:"Fijación, caducidad y cierre",
  c:`<ul><li><b>Fijación de sesión</b>: el atacante consigue que la víctima use un identificador que él conoce y, si no cambia al iniciar sesión, entra con ella. Solución: <b>regenerar</b> el identificador al autenticarse y al elevar privilegios.</li>
     <li><b>Caducidad</b>: por inactividad (por ejemplo, 30 minutos) y absoluta (8–12 horas), controladas en el servidor.</li>
     <li><b>Cerrar sesión</b> invalida la sesión en el servidor, no solo borra la cookie. Cambiar la contraseña debería cerrar las demás sesiones.</li>
     <li><b>Reautenticación</b> (o MFA de nuevo) para acciones sensibles: cambiar email, contraseña, datos de pago.</li>
     <li>Identificador con al menos 128 bits de un generador criptográfico. Nunca en la URL: acaba en logs, historiales y cabeceras Referer.</li></ul>`},
 {t:"par", p:"Empareja cada atributo o práctica con el ataque que frena",
  pares:[["HttpOnly","Que un XSS lea la cookie"],["Secure","Que viaje en claro por una red Wi-Fi"],["SameSite","CSRF desde otros sitios"],["Prefijo __Host-","Que un subdominio fije o sobrescriba la cookie"],["Regenerar el id al iniciar sesión","Fijación de sesión"]],
  why:"Todos juntos cuestan una línea de configuración; en Spring, Express o Django son opciones de la sesión."},
 {t:"opcion", p:"¿Qué debe hacer tu aplicación al iniciar sesión un usuario con sesiones por cookie?",
  ops:["Mantener el mismo identificador de sesión para no perder el carrito","Guardar la contraseña cifrada en la cookie","Nada especial si la cookie es HttpOnly","Regenerar el identificador de sesión (copiando los datos que haga falta, como el carrito)"],
  ok:3, why:"Session fixation: el atacante fija un id antes del login y lo reutiliza después. Los frameworks lo hacen por defecto (Spring Security: sessionFixation().changeSessionId())."},
 {t:"vf", p:"Borrar la cookie en el navegador al pulsar «Cerrar sesión» es suficiente, aunque el servidor siga considerando válida la sesión.",
  ok:false, why:"Si alguien copió la cookie (un portátil compartido, un proxy, un XSS anterior), seguirá entrando. La sesión se invalida en el servidor."},
 {t:"hueco", p:"Completa la cookie de sesión más estricta posible para una web que no necesita enviarla en ninguna navegación desde otros sitios",
  tpl:"Set-Cookie: ___sid=abc; Path=/; ___; HttpOnly; SameSite=___",
  banco:["__Host-","__Secure-","Secure","Strict","Lax","None","Domain=tienda.com"],
  sol:["__Host-","Secure","Strict"],
  why:"Strict tiene un coste: al llegar desde un enlace externo (un email), el usuario aparece como no autenticado en esa primera carga. Por eso Lax es el valor habitual."},
 {t:"codigo", p:"¿Sigue viva la sesión?", lenguaje:"py",
  c:`<p>Cada línea tiene tres marcas de tiempo en segundos: <code>creada ultima_actividad ahora</code>. La sesión caduca por inactividad si han pasado <b>más de 1800 s</b> desde la última actividad, y de forma absoluta si han pasado <b>más de 28800 s</b> desde su creación. Imprime por línea <code>valida</code>, <code>caducada absoluta</code> (tiene prioridad) o <code>caducada inactividad</code>.</p>`,
  plantilla:"import sys\n\nfor linea in sys.stdin:\n    if not linea.strip():\n        continue\n    creada, ultima, ahora = map(int, linea.split())\n    # decide\n",
  pruebas:[
   {entrada:"1000 2000 3000\n1000 2000 4000\n1000 29000 30000\n", salida:"valida\ncaducada inactividad\ncaducada absoluta"},
   {entrada:"0 0 1800\n0 28000 28800\n0 28799 28801\n", salida:"valida\nvalida\ncaducada absoluta", oculta:true}
  ],
  pista:"Comprueba primero la absoluta: ahora - creada &gt; 28800.",
  solucion:"import sys\n\nfor linea in sys.stdin:\n    if not linea.strip():\n        continue\n    creada, ultima, ahora = map(int, linea.split())\n    if ahora - creada > 28800:\n        print(\"caducada absoluta\")\n    elif ahora - ultima > 1800:\n        print(\"caducada inactividad\")\n    else:\n        print(\"valida\")\n",
  why:"Sin caducidad absoluta, una sesión robada que se usa cada pocos minutos vive para siempre. Las dos se comprueban en el servidor en cada petición."}
]}

]});
