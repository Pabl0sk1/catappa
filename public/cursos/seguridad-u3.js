window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Autenticación, sesiones y control de acceso",
resumen: "Contraseñas y MFA, fuerza bruta y enumeración, sesiones seguras, OAuth 2.0 y OpenID Connect, errores con JWT y control de acceso roto",
nivel: "Intermedio",
color: "#ea6d60",
lecciones: [

{
id:"sg3l1",
titulo:"Autenticación robusta",
claves:["Hash lento con sal (argon2, bcrypt) y comprobar contraseñas filtradas","MFA, preferiblemente con passkeys o TOTP antes que SMS","Limitar intentos y no revelar si un usuario existe"],
pasos:[
 {t:"info", eti:"Quién eres", h:"Buenas prácticas de login",
  c:`<ul><li>Contraseñas guardadas con <b>argon2id</b> o <b>bcrypt</b>.</li>
     <li>Longitud mínima razonable (12+) y comprobar contra listas de contraseñas filtradas, en vez de reglas raras de símbolos.</li>
     <li><b>MFA</b>: passkeys (WebAuthn) o aplicaciones TOTP; el SMS es el más débil.</li>
     <li><b>Límite de intentos</b> por usuario y por IP, con retrasos crecientes.</li>
     <li>Mensajes genéricos: «usuario o contraseña incorrectos», también en la recuperación («si existe, te enviaremos un correo»).</li>
     <li>Tokens de recuperación de un solo uso, aleatorios y que caducan.</li></ul>`},
 {t:"par", p:"Empareja cada ataque con su defensa",
  pares:[["Fuerza bruta contra una cuenta","Limitar intentos y bloqueo progresivo"],["Credential stuffing (contraseñas filtradas de otras webs)","MFA y comprobar contraseñas comprometidas"],["Enumeración de usuarios","Mensajes y tiempos de respuesta iguales exista o no"],["Robo de la base de datos de contraseñas","Hash lento con sal"],["Phishing","Passkeys (ligadas al dominio real)"]],
  why:"El credential stuffing es de los ataques más comunes contra logins reales."},
 {t:"opcion", p:"Tu login responde «el email no existe» o «contraseña incorrecta» según el caso. ¿Qué problema hay?",
  ops:["Ninguno, es más amable","Permite averiguar qué emails están registrados (enumeración) y centrar ataques en ellos","Es más lento","Rompe el MFA"],
  ok:1, why:"Mensaje genérico en ambos casos."}
]},

{
id:"sg3l2",
titulo:"Sesiones, OAuth 2.0 y JWT",
claves:["Sesiones: identificador aleatorio, cookie HttpOnly/Secure/SameSite, regenerar al iniciar sesión, caducidad","OAuth 2.0 delega autorización; OpenID Connect añade identidad (login con Google)","JWT: verificar firma y algoritmo, caducidad corta, no guardar secretos dentro"],
pasos:[
 {t:"info", eti:"Delegar", h:"OAuth 2.0 y OpenID Connect",
  c:`<div class="diag">Authorization Code + PKCE (el flujo recomendado para webs y apps)

usuario -&gt; tu app -&gt; redirige al proveedor de identidad (Keycloak, Google, Auth0)
          el usuario inicia sesion alli
proveedor -&gt; redirige a tu app con un "code" de un solo uso
tu backend -&gt; intercambia code + verificador PKCE por tokens
          id_token (quien es: OIDC)  +  access_token (que puede hacer)  +  refresh_token</div>
     <p>Los flujos «implícito» y «password» están desaconsejados.</p>`},
 {t:"info", eti:"Errores con JWT", h:"Lo que sale mal",
  c:`<ul><li>Aceptar <code>alg: none</code> o no fijar el algoritmo esperado.</li>
     <li>Firmar con un secreto débil que se puede adivinar por fuerza bruta.</li>
     <li>No comprobar <code>exp</code>, <code>iss</code> o <code>aud</code>.</li>
     <li>Tokens de acceso de larga duración sin forma de revocarlos.</li>
     <li>Guardar datos sensibles en el payload (se lee con Base64).</li></ul>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["OAuth 2.0","Delegar acceso limitado a recursos sin compartir la contraseña"],["OpenID Connect","Capa de identidad sobre OAuth: quién es el usuario"],["PKCE","Protege el intercambio del code frente a su robo"],["Refresh token","Obtener nuevos tokens de acceso sin volver a iniciar sesión"],["aud (audience)","Para qué API se emitió el token"]],
  why:"Validar aud evita aceptar un token emitido para otra aplicación."},
 {t:"opcion", p:"¿Qué debe hacer tu aplicación al iniciar sesión un usuario con sesiones por cookie?",
  ops:["Mantener el mismo identificador de sesión","Regenerar el identificador de sesión para evitar la fijación de sesión","Guardar la contraseña en la cookie","Nada"],
  ok:1, why:"Session fixation: el atacante fija un id antes del login y lo reutiliza después."}
]},

{
id:"sg3l3",
titulo:"Control de acceso roto",
claves:["Autorizar cada petición en el servidor, objeto por objeto (BOLA/IDOR)","Comprobar la función además del dato: rutas de administración","Evitar mass assignment con DTOs de entrada explícitos"],
pasos:[
 {t:"info", eti:"El número 1", h:"Qué puede hacer cada uno",
  c:`<div class="termbox">GET /api/pedidos/1042            -&gt; mi pedido
GET /api/pedidos/1043            -&gt; ¿el de otro cliente? (IDOR / BOLA)
PUT /api/usuarios/7 {"rol":"admin"}   -&gt; ¿me he hecho admin? (mass assignment)
GET /api/admin/usuarios          -&gt; ¿un usuario normal puede llamar a esto?</div>
     <p>Esconder un botón en el frontend no es control de acceso. Cada endpoint debe comprobar en el servidor: ¿está autenticado?, ¿tiene el rol?, ¿<b>este objeto concreto</b> es suyo o tiene permiso sobre él?</p>`},
 {t:"par", p:"Empareja cada fallo con su defensa",
  pares:[["Ver recursos de otros cambiando el id","Filtrar siempre por el usuario autenticado (o comprobar la propiedad)"],["Asignarse campos protegidos en el cuerpo","DTO de entrada solo con los campos permitidos"],["Llamar a endpoints de administración siendo usuario","Autorización por rol en el servidor"],["Ids secuenciales fáciles de adivinar","UUIDs (dificulta, pero no sustituye la autorización)"]],
  why:"Un UUID no es control de acceso: solo hace más difícil adivinar."},
 {t:"opcion", p:"¿Cuál es la forma más robusta de evitar IDOR al obtener un pedido?",
  ops:["Ocultar el id en el frontend","Consultar findByIdAndClienteId(id, usuarioAutenticado) y devolver 404 si no es suyo","Usar ids aleatorios y nada más","Comprobarlo en JavaScript"],
  ok:1, why:"404 en vez de 403 evita además confirmar que ese id existe."},
 {t:"vf", p:"Si un botón no aparece en la interfaz para usuarios normales, el endpoint ya está protegido.",
  ok:false, why:"Cualquiera puede llamar a la API directamente con curl."}
]},

{
id:"sg3l4",
titulo:"Abuso de la lógica de negocio",
claves:["Fallos que no son técnicos: aplicar un cupón dos veces, precios negativos, saltarse pasos","Condiciones de carrera en operaciones de dinero o stock","Límites de uso por usuario y por operación"],
pasos:[
 {t:"info", eti:"Cuando todo «funciona»", h:"Fallos de lógica",
  c:`<ul><li>Un carrito acepta <b>cantidades negativas</b> y el total baja.</li>
     <li>El cupón «bienvenida» se puede aplicar <b>varias veces</b>.</li>
     <li>Se puede llamar directamente al paso 3 de un proceso (confirmar pago) <b>sin pasar por el 2</b>.</li>
     <li>Dos peticiones simultáneas canjean el <b>mismo saldo</b> dos veces (condición de carrera).</li>
     <li>Un endpoint de envío de SMS sin límites acaba generando una factura enorme.</li></ul>
     <p>Ningún escáner automático los encuentra: hay que pensar como alguien que quiere aprovecharse de las reglas.</p>`},
 {t:"par", p:"Empareja cada fallo con su defensa",
  pares:[["Cantidad negativa en el carrito","Validar rangos en el servidor"],["Cupón usado varias veces","Restricción única (usuario, cupón) en la base de datos"],["Canjear el saldo dos veces a la vez","Operación atómica o bloqueo (UPDATE con condición)"],["Saltar pasos de un proceso","Estado del proceso guardado y comprobado en el servidor"],["Envío masivo de SMS","Límites por usuario, por IP y por destino"]],
  why:"Las restricciones de la base de datos son la última línea de defensa frente a las carreras."},
 {t:"opcion", p:"Dos peticiones simultáneas canjean la misma tarjeta regalo de 50 €. ¿Cómo lo evitas?",
  ops:["Comprobar el saldo con un SELECT antes","UPDATE tarjetas SET saldo = saldo - 50 WHERE id = ? AND saldo >= 50, y comprobar que se actualizó una fila","Poner un sleep","Hacerlo en el frontend"],
  ok:1, why:"La base de datos garantiza la atomicidad; el SELECT previo deja la puerta abierta a la carrera."}
]}

]});
