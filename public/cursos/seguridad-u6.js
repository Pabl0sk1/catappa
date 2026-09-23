window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Tokens, OAuth 2.1 y OpenID Connect",
resumen: "JWT por dentro y sus errores clásicos (alg none, confusión de algoritmos, claims sin validar), OAuth 2.1 con PKCE y los flujos que quedan, OpenID Connect, y dónde guardar los tokens en una SPA: patrón BFF y tokens ligados con DPoP",
nivel: "Avanzado",
color: "#e16053",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"sg6n1",
titulo:"JWT y sus errores",
claves:["Un JWT firmado (JWS) se lee con Base64: firma no es cifrado","Fijar el algoritmo esperado: nada de alg none ni de dejar que el token elija (confusión RS256/HS256)","Validar firma, exp, nbf, iss, aud y el tipo; vida corta porque revocar es difícil"],
pasos:[
 {t:"info", eti:"Por dentro", h:"Anatomía de un JWT",
  c:`<div class="dg"><div class="dg-tit">tres partes en base64url separadas por puntos</div><div class="dg-flujo">
       <div class="dg-caja acento doble">cabecera<small>{"alg":"RS256","kid":"k1","typ":"at+jwt"}</small></div>
       <div class="dg-caja acento doble">payload<small>{"sub":"u42","iss":"...","aud":"api","exp":...}</small></div>
       <div class="dg-caja ok doble">firma<small>sobre cabecera.payload</small></div>
     </div></div>
     <p>La firma garantiza <b>integridad y origen</b>, no confidencialidad: cualquiera lee el payload decodificando Base64. Nada de datos personales sensibles ni secretos dentro (para eso existe JWE, el formato cifrado).</p>
     <ul><li><b>HS256</b>: HMAC con un secreto compartido; quien verifica también puede emitir.</li>
     <li><b>RS256 / ES256 / EdDSA</b>: firma con clave privada, verificación con la pública (publicada en un JWKS). Lo normal cuando un proveedor de identidad emite y muchas APIs verifican.</li></ul>`},
 {t:"info", eti:"Lo que sale mal", h:"Errores clásicos (RFC 8725)",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">ataques a jwt y su defensa</div><table class="dg-tabla"><thead><tr><th>Ataque</th><th>Defensa</th></tr></thead><tbody>
       <tr><td><code>"alg":"none"</code> sin firma</td><td>lista permitida de algoritmos en la verificación</td></tr>
       <tr><td>Confusión de algoritmos: token HS256 firmado con la clave <b>pública</b> RSA</td><td>el algoritmo lo decide el servidor, no la cabecera; cada clave con su algoritmo</td></tr>
       <tr><td>Secreto HS256 débil crackeado con hashcat</td><td>secreto aleatorio de 256 bits o firma asimétrica</td></tr>
       <tr><td><code>jku</code>/<code>x5u</code> apuntando a claves del atacante; <code>kid</code> con rutas o SQL</td><td>ignorar esas cabeceras o validarlas contra una lista fija</td></tr>
       <tr><td>Token de otra aplicación aceptado</td><td>validar <code>iss</code> y <code>aud</code></td></tr>
       <tr><td>Un id_token usado como access token</td><td>validar <code>typ</code> (<code>at+jwt</code>, RFC 9068) y la audiencia</td></tr>
     </tbody></table></div>`},
 {t:"par", p:"Empareja cada claim con lo que hay que comprobar",
  pares:[["exp","Que el token no ha caducado"],["nbf","Que ya se puede usar"],["iss","Que lo emitió tu proveedor de identidad"],["aud","Que se emitió para esta API"],["sub","Quién es el usuario (identificador estable)"]],
  why:"Las librerías maduras (jose, PyJWT, Nimbus, spring-security-oauth2-resource-server) validan todo esto si se lo configuras: no escribas la verificación a mano."},
 {t:"opcion", p:"Tu API verifica tokens con <code>jwt.verify(token, clavePublica)</code> sin indicar algoritmos, y la librería acepta HS256 o RS256 según la cabecera. ¿Qué puede hacer un atacante?",
  ops:["Nada, la clave pública no es secreta pero no sirve para firmar","Firmar un token HS256 usando la clave pública (que es pública) como secreto HMAC, y la API lo aceptará","Solo leer tokens ajenos","Forzar HTTP"],
  ok:1, why:"Es la confusión de algoritmos. La solución: jwt.verify(token, clave, { algorithms: [\"RS256\"] }) y claves tipadas."},
 {t:"opcion", p:"Un usuario es dado de baja, pero su access token JWT sigue siendo válido 24 horas. ¿Cuál es el diseño correcto?",
  ops:["Tokens de 24 horas son lo normal","Tokens de acceso de vida corta (5–15 minutos) y refresh tokens revocables; para bajas urgentes, lista de revocación o introspección","Poner la contraseña en el token","Cambiar la clave de firma de todos los usuarios"],
  ok:1, why:"Un JWT no se puede «desemitir». La vida corta limita el daño; la revocación se hace en el refresh token, que sí consulta al servidor."},
 {t:"vf", p:"Un JWT firmado con HS256 oculta el contenido del payload a quien intercepte el token.",
  ok:false, why:"El payload es Base64url, no cifrado. jwt.io lo muestra con solo pegarlo."},
 {t:"codigo", p:"Verifica un JWT HS256", lenguaje:"py",
  c:`<p>La entrada tiene tres líneas: el token, el secreto y la hora actual (Unix). Verifica en este orden e imprime la primera condición que falle:</p>
     <ol><li>La cabecera debe tener <code>"alg": "HS256"</code> exactamente; si no, <code>alg no permitido</code>.</li>
     <li>La firma HMAC-SHA256 de <code>cabecera.payload</code> debe coincidir (en tiempo constante); si no, <code>firma invalida</code>.</li>
     <li>Si <code>exp</code> falta o es menor o igual que la hora actual, <code>caducado</code>.</li></ol>
     <p>Si todo va bien, imprime <code>valido sub=&lt;sub&gt;</code>.</p>`,
  plantilla:"import base64, hashlib, hmac, json\n\ndef b64d(s):\n    return base64.urlsafe_b64decode(s + \"=\" * (-len(s) % 4))\n\ntoken = input().strip()\nsecreto = input().strip()\nahora = int(input())\n# verifica alg, firma y exp\n",
  pruebas:[
   {entrada:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmEiLCJleHAiOjE5MDAwMDAwMDB9.e_vfeV7MYVcjjuMsM0PxKC6MOfwNoLeDIfalQEP9xWY\nclave-de-pruebas-larga-y-aleatoria-0123456789\n1800000000\n", salida:"valido sub=ana"},
   {entrada:"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTkwMDAwMDAwMH0.\nclave-de-pruebas-larga-y-aleatoria-0123456789\n1800000000\n", salida:"alg no permitido"},
   {entrada:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTkwMDAwMDAwMH0.e_vfeV7MYVcjjuMsM0PxKC6MOfwNoLeDIfalQEP9xWY\nclave-de-pruebas-larga-y-aleatoria-0123456789\n1800000000\n", salida:"firma invalida", oculta:true},
   {entrada:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmEiLCJleHAiOjE3MDAwMDAwMDB9._CHo1B6PyDBr655S570FZip1yD-szos4rWHDbvlfbYA\nclave-de-pruebas-larga-y-aleatoria-0123456789\n1800000000\n", salida:"caducado", oculta:true},
   {entrada:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsdWlzIiwiZXhwIjoxOTAwMDAwMDAwfQ.e5w7nkFAc2PHXuqdQi51H3-aT_E9Lwg6IPgGubpbtuU\nclave-de-pruebas-larga-y-aleatoria-0123456789\n1800000000\n", salida:"firma invalida", oculta:true}
  ],
  pista:"La firma se calcula sobre el texto exacto «cabecera.payload» (los dos primeros trozos tal cual) y se compara con b64d del tercero.",
  solucion:"import base64, hashlib, hmac, json\n\ndef b64d(s):\n    return base64.urlsafe_b64decode(s + \"=\" * (-len(s) % 4))\n\ntoken = input().strip()\nsecreto = input().strip()\nahora = int(input())\n\ndef verificar():\n    cab, carga, firma = token.split(\".\")\n    if json.loads(b64d(cab)).get(\"alg\") != \"HS256\":\n        return \"alg no permitido\"\n    esperada = hmac.new(secreto.encode(), (cab + \".\" + carga).encode(), hashlib.sha256).digest()\n    if not hmac.compare_digest(esperada, b64d(firma)):\n        return \"firma invalida\"\n    datos = json.loads(b64d(carga))\n    if datos.get(\"exp\", 0) <= ahora:\n        return \"caducado\"\n    return \"valido sub=\" + str(datos.get(\"sub\"))\n\nprint(verificar())\n",
  why:"Fíjate en el orden: primero el algoritmo (lo decide el servidor), después la firma y solo entonces se confía en el contenido. En producción esto lo hace una librería; entenderlo te permite revisar que está bien configurada."}
]},

/* =============== U6 L2 =============== */
{
id:"sg6n2",
titulo:"OAuth 2.1: flujos y PKCE",
claves:["OAuth delega acceso limitado (scopes) sin compartir la contraseña; no es un protocolo de login","OAuth 2.1 consolida las buenas prácticas: código de autorización con PKCE para todos, adiós a implícito y password","Redirect URI con coincidencia exacta, state contra CSRF, refresh tokens rotados o ligados al cliente"],
pasos:[
 {t:"info", eti:"Delegar", h:"El flujo de código de autorización con PKCE",
  c:`<div class="dg"><div class="dg-tit">authorization code + pkce</div>
       <div class="dg-vert">
         <div class="dg-caja base">la app genera code_verifier aleatorio y code_challenge = BASE64URL(SHA256(verifier))</div>
         <div class="dg-caja">redirige al servidor de autorización<small>client_id, redirect_uri, scope, state, code_challenge, method=S256</small></div>
         <div class="dg-caja base">el usuario inicia sesión y da su consentimiento</div>
         <div class="dg-caja">vuelve a redirect_uri con code y state<small>la app comprueba que state es el suyo</small></div>
         <div class="dg-caja acento">la app intercambia code + code_verifier por tokens<small>el servidor comprueba que el verifier corresponde al challenge</small></div>
         <div class="dg-caja ok">access_token (y refresh_token)</div>
       </div></div>
     <p>Si alguien roba el <code>code</code> (una app maliciosa que registra el mismo esquema de URL, un log), no le sirve sin el <code>code_verifier</code>, que nunca salió de la app legítima.</p>`},
 {t:"info", eti:"2.1", h:"Qué cambia con OAuth 2.1",
  c:`<p>OAuth 2.1 (borrador de la IETF en su recta final) no inventa nada: recoge lo que ya exige el documento de buenas prácticas de seguridad (RFC 9700, de 2025).</p>
     <ul><li><b>PKCE obligatorio</b> en el flujo de código, también para clientes con secreto.</li>
     <li><b>Eliminados</b> el flujo implícito (tokens en la URL) y el de contraseña (la app ve la contraseña del usuario).</li>
     <li><b>Redirect URI</b> comparada con coincidencia exacta de cadena, sin comodines.</li>
     <li><b>Refresh tokens</b> de clientes públicos: rotados en cada uso (y si se reutiliza uno viejo, se revoca la familia) o ligados al cliente (DPoP, mTLS).</li>
     <li>Tokens nunca en la query string.</li></ul>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué flujo usar</div><table class="dg-tabla"><tbody>
       <tr><td>Web, SPA, móvil</td><td>código de autorización + PKCE</td></tr>
       <tr><td>Servicio a servicio</td><td>client credentials (sin usuario)</td></tr>
       <tr><td>TV, CLI, dispositivos sin teclado</td><td>device authorization (RFC 8628)</td></tr>
     </tbody></table></div>`},
 {t:"par", p:"Empareja cada parámetro con su función",
  pares:[["state","Evitar CSRF en la vuelta: que la respuesta corresponde a una petición tuya"],["code_verifier","Demostrar que quien canjea el code es quien lo pidió"],["scope","Limitar lo que el token permite hacer"],["redirect_uri","A dónde vuelve el code (comparación exacta)"],["refresh_token","Pedir nuevos access tokens sin el usuario delante"]],
  why:"Un redirect_uri validado con comodines o prefijos permite enviar el code a una ruta controlada por el atacante (un open redirect en tu propio dominio basta)."},
 {t:"opcion", p:"Un microservicio de facturación necesita llamar a la API de clientes, sin ningún usuario de por medio. ¿Qué flujo usa?",
  ops:["Código de autorización con PKCE","Implícito","Client credentials, con un scope limitado a lo que necesita","El flujo de contraseña con una cuenta de servicio"],
  ok:2, why:"Client credentials autentica al propio servicio. Mejor aún con autenticación del cliente por clave privada (private_key_jwt) o mTLS en lugar de un secreto compartido."},
 {t:"vf", p:"OAuth 2.0 por sí solo es un protocolo de autenticación: el access token te dice quién es el usuario.",
  ok:false, why:"OAuth es de autorización delegada: el access token dice qué puede hacer el portador, y su formato no está definido para el cliente. Para saber quién es el usuario está OpenID Connect."},
 {t:"opcion", p:"Detectas que un refresh token ya rotado se ha vuelto a presentar. ¿Qué hace un servidor de autorización bien diseñado?",
  ops:["Lo acepta, puede ser un reintento","Revoca toda la familia de tokens de esa sesión: o el legítimo o el atacante tiene una copia robada","Devuelve el mismo token otra vez","Nada, los refresh tokens no caducan"],
  ok:1, why:"Es la detección de reutilización: como no sabe cuál de los dos es el atacante, corta a ambos y obliga a iniciar sesión de nuevo."},
 {t:"codigo", p:"Calcula el code_challenge de PKCE", lenguaje:"py",
  c:`<p>Lee un <code>code_verifier</code> e imprime su <code>code_challenge</code> con el método S256: <code>BASE64URL(SHA256(verifier))</code>, sin el relleno <code>=</code> final.</p>`,
  plantilla:"import base64, hashlib\n\nverifier = input().strip()\n# calcula el challenge\n",
  pruebas:[
   {entrada:"dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk\n", salida:"E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"},
   {entrada:"abc\n", salida:"ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0", oculta:true}
  ],
  pista:"base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b\"=\").decode().",
  solucion:"import base64, hashlib\n\nverifier = input().strip()\ndigest = hashlib.sha256(verifier.encode(\"ascii\")).digest()\nprint(base64.urlsafe_b64encode(digest).rstrip(b\"=\").decode())\n",
  why:"El primer caso es el vector oficial del RFC 7636. El verifier debe ser aleatorio (43 a 128 caracteres) y nuevo en cada inicio de sesión."}
]},

/* =============== U6 L3 =============== */
{
id:"sg6n3",
titulo:"OpenID Connect y tokens en el navegador",
claves:["OIDC añade identidad: el id_token es para el cliente y se valida (firma, iss, aud, exp, nonce)","Identificar al usuario por iss + sub, nunca por email","En SPAs, el patrón BFF deja los tokens en el servidor y al navegador solo una cookie; DPoP liga el token a una clave"],
pasos:[
 {t:"info", eti:"Quién es", h:"OpenID Connect",
  c:`<p>OIDC es una capa sobre OAuth 2: con el scope <code>openid</code>, además del access token llega un <b>id_token</b>, un JWT firmado por el proveedor que dice quién se autenticó, cuándo y cómo.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">id_token frente a access_token</div><table class="dg-tabla"><thead><tr><th></th><th>id_token</th><th>access_token</th></tr></thead><tbody>
       <tr><td>Para quién</td><td>el cliente (tu app)</td><td>la API (el recurso)</td></tr>
       <tr><td>Qué dice</td><td>quién es el usuario</td><td>qué puede hacer el portador</td></tr>
       <tr><td>aud</td><td>el client_id de tu app</td><td>la API</td></tr>
       <tr><td>¿Se envía a APIs?</td><td>no</td><td>sí, en Authorization: Bearer</td></tr>
     </tbody></table></div>
     <p>El cliente valida el id_token: firma con las claves del JWKS (sacadas de <code>/.well-known/openid-configuration</code>), <code>iss</code>, <code>aud</code> = su client_id, <code>exp</code> y que el <code>nonce</code> coincide con el que envió (evita la reutilización de tokens).</p>`},
 {t:"info", eti:"Un clásico", h:"El email no es un identificador",
  c:`<p>Enlazar cuentas por email es una fuente habitual de secuestros: un proveedor que permite emails sin verificar (o un inquilino de Azure AD / Entra ID multi-tenant donde el atacante pone el email que quiera) devuelve <code>email: ana@tienda.com</code> y tu app lo asocia a la cuenta de Ana.</p>
     <ul><li>La clave del usuario es <b><code>iss</code> + <code>sub</code></b>: estable y única por proveedor.</li>
     <li>El email solo se usa si viene con <code>email_verified: true</code> de un proveedor en el que confías para ese dominio, y aun así para mostrar, no para identificar.</li></ul>`},
 {t:"info", eti:"SPAs", h:"Dónde guardar los tokens: BFF y DPoP",
  c:`<div class="dg"><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">tokens en el navegador</div><div class="dg-pila">
         <div class="dg-caja aviso doble">localStorage<small>cualquier XSS los lee y se los lleva</small></div>
         <div class="dg-caja doble">en memoria<small>mejor, pero un XSS aún puede usarlos</small></div></div></div>
       <div class="dg-col"><div class="dg-col-tit">backend for frontend</div><div class="dg-pila">
         <div class="dg-caja ok doble">el BFF hace OAuth y guarda los tokens<small>cliente confidencial en el servidor</small></div>
         <div class="dg-caja ok doble">el navegador solo tiene una cookie __Host- HttpOnly<small>el BFF reenvía las llamadas a las APIs</small></div></div></div>
     </div></div>
     <p>El BFF es la recomendación actual de la IETF para aplicaciones de navegador con datos sensibles. Si los tokens tienen que estar en el cliente, <b>DPoP</b> (RFC 9449) los liga a una clave privada no exportable: un token robado no sirve sin esa clave.</p>`},
 {t:"par", p:"Empareja cada validación del id_token con el ataque que evita",
  pares:[["Firma con el JWKS del proveedor","Tokens fabricados por el atacante"],["aud igual a tu client_id","Aceptar un token emitido para otra aplicación"],["nonce igual al enviado","Reutilizar un id_token capturado antes"],["iss igual al proveedor esperado","Aceptar tokens de otro emisor, incluido otro inquilino"],["exp","Tokens caducados"]],
  why:"Las librerías certificadas de OIDC hacen todas estas comprobaciones; tu parte es configurarlas con el emisor y el client_id correctos."},
 {t:"opcion", p:"Tu SPA guarda el access token en localStorage y encuentras un XSS. ¿Qué supone?",
  ops:["Nada, el token está firmado","El script inyectado puede leer el token y usarlo desde cualquier sitio hasta que caduque","Solo afecta a la pestaña actual","El navegador cifra localStorage"],
  ok:1, why:"Por eso el BFF: con una cookie HttpOnly el XSS sigue siendo grave (puede hacer peticiones desde la página), pero no puede llevarse la credencial."},
 {t:"vf", p:"Es correcto que tu API acepte el id_token como credencial en la cabecera Authorization, ya que también es un JWT firmado por el proveedor.",
  ok:false, why:"Su audiencia es el cliente, no la API. Aceptarlo abre la puerta a que cualquier app que reciba id_tokens de ese proveedor llame a tu API."},
 {t:"codigo", p:"Valida los claims de un id_token", lenguaje:"py",
  c:`<p>Suponiendo que la firma ya se verificó, la entrada tiene cinco líneas: el JSON de claims, el emisor esperado, tu client_id, el nonce que enviaste y la hora actual. Comprueba en este orden e imprime el primer fallo: <code>iss</code>, <code>aud</code> (puede ser un texto o una lista que debe incluir tu client_id), <code>exp</code> (debe ser mayor que la hora), <code>nonce</code>. Si todo va bien, imprime <code>usuario iss|sub</code> (por ejemplo, <code>usuario https://id.tienda.com|248289761001</code>). Los fallos se imprimen como <code>fallo iss</code>, <code>fallo aud</code>, <code>fallo exp</code> o <code>fallo nonce</code>.</p>`,
  plantilla:"import json\n\nclaims = json.loads(input())\niss, client_id, nonce, ahora = input().strip(), input().strip(), input().strip(), int(input())\n# valida en orden\n",
  pruebas:[
   {entrada:"{\"iss\":\"https://id.tienda.com\",\"sub\":\"248289761001\",\"aud\":\"app-web\",\"exp\":1900000000,\"nonce\":\"n-0S6_WzA2Mj\"}\nhttps://id.tienda.com\napp-web\nn-0S6_WzA2Mj\n1800000000\n", salida:"usuario https://id.tienda.com|248289761001"},
   {entrada:"{\"iss\":\"https://id.tienda.com\",\"sub\":\"1\",\"aud\":\"otra-app\",\"exp\":1900000000,\"nonce\":\"x\"}\nhttps://id.tienda.com\napp-web\nx\n1800000000\n", salida:"fallo aud"},
   {entrada:"{\"iss\":\"https://id.tienda.com\",\"sub\":\"7\",\"aud\":[\"otra\",\"app-web\"],\"exp\":1900000000,\"nonce\":\"abc\"}\nhttps://id.tienda.com\napp-web\nabc\n1800000000\n", salida:"usuario https://id.tienda.com|7", oculta:true},
   {entrada:"{\"iss\":\"https://login.malo.com\",\"sub\":\"7\",\"aud\":\"app-web\",\"exp\":1,\"nonce\":\"abc\"}\nhttps://id.tienda.com\napp-web\nabc\n1800000000\n", salida:"fallo iss", oculta:true},
   {entrada:"{\"iss\":\"https://id.tienda.com\",\"sub\":\"7\",\"aud\":\"app-web\",\"exp\":1900000000,\"nonce\":\"viejo\"}\nhttps://id.tienda.com\napp-web\nnuevo\n1800000000\n", salida:"fallo nonce", oculta:true}
  ],
  pista:"Si aud es un str, conviértelo en [aud] antes de comprobar si contiene el client_id.",
  solucion:"import json\n\nclaims = json.loads(input())\niss, client_id, nonce, ahora = input().strip(), input().strip(), input().strip(), int(input())\n\ndef validar():\n    if claims.get(\"iss\") != iss:\n        return \"fallo iss\"\n    aud = claims.get(\"aud\")\n    if isinstance(aud, str):\n        aud = [aud]\n    if not isinstance(aud, list) or client_id not in aud:\n        return \"fallo aud\"\n    if claims.get(\"exp\", 0) <= ahora:\n        return \"fallo exp\"\n    if claims.get(\"nonce\") != nonce:\n        return \"fallo nonce\"\n    return \"usuario \" + claims[\"iss\"] + \"|\" + str(claims[\"sub\"])\n\nprint(validar())\n",
  why:"La clave compuesta iss|sub es lo que guardas en tu tabla de identidades federadas. Si mañana añades otro proveedor, no hay choques aunque dos usuarios tengan el mismo sub."}
]}

]});
