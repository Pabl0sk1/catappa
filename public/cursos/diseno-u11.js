window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Seguridad en la arquitectura",
resumen: "Identidad y autorización (OAuth 2, OIDC, JWT, mTLS, RBAC), protección de datos y secretos, multiinquilino, limitación de tasa y defensa del perímetro",
nivel: "Experto",
color: "#c48642",
lecciones: [

/* =============== U11 L1 =============== */
{
id:"ds11n1",
titulo:"Identidad y autorización",
claves:["Autenticación (quién eres) frente a autorización (qué puedes hacer)","OIDC para iniciar sesión y OAuth 2 para delegar acceso; tokens de acceso cortos y de refresco rotatorios","Entre servicios: mTLS e identidades de carga de trabajo; autorización con RBAC, ABAC o por relaciones"],
pasos:[
 {t:"info", eti:"Quién eres", h:"Sesiones, tokens y proveedores de identidad",
  c:`<div class="dg"><div class="dg-tit">inicio de sesión con OIDC (flujo de código con PKCE)</div>
<div class="dg-vert">
<div class="dg-caja base">la app redirige al proveedor de identidad (Keycloak, Auth0, Entra ID…)</div>
<div class="dg-caja doble">el usuario se autentica allí<small>contraseña, passkey, segundo factor</small></div>
<div class="dg-caja doble">vuelve con un código de un solo uso</div>
<div class="dg-caja acento doble">la app lo canjea por tokens<small>ID token (quién es) + access token (5–15 min) + refresh token</small></div>
<div class="dg-caja ok doble">las APIs validan la firma del access token<small>sin consultar a nadie en cada petición</small></div>
</div></div>
     <ul><li><b>Sesión en servidor</b> (cookie + Redis): revocable al instante; exige un almacén compartido.</li>
     <li><b>JWT</b>: se valida localmente con la clave pública (JWKS), escala muy bien, pero <b>no se puede revocar</b> antes de caducar. Por eso duran minutos y se renuevan con un refresh token que sí se puede revocar (y que rota en cada uso).</li>
     <li>En navegadores, cookies <code>HttpOnly; Secure; SameSite</code> mejor que tokens en <code>localStorage</code>, que cualquier XSS puede leer.</li></ul>`},
 {t:"info", eti:"Qué puedes hacer", h:"Autorización y confianza entre servicios",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">modelos de autorización</div>
<table class="dg-tabla"><thead><tr><th>modelo</th><th>decide por</th><th>ejemplo</th></tr></thead><tbody>
<tr><td>RBAC</td><td>roles</td><td>«los editores pueden publicar»</td></tr>
<tr><td>ABAC</td><td>atributos del usuario, recurso y contexto</td><td>«solo su departamento y en horario laboral»</td></tr>
<tr><td>ReBAC</td><td>relaciones</td><td>«puede ver el documento si es miembro de la carpeta que lo contiene» (Google Zanzibar, OpenFGA)</td></tr>
</tbody></table></div>
     <ul><li>El gateway comprueba el token (autenticación); <b>cada servicio</b> comprueba si puede hacer esa acción sobre ese recurso. Comprobar solo en el gateway deja abierto el acceso a pedidos ajenos cambiando un id (IDOR).</li>
     <li><b>Confianza cero</b>: estar dentro de la red no da permiso. Entre servicios, <b>mTLS</b> (los dos lados presentan certificado) con identidades de carga de trabajo (SPIFFE), que suele poner el service mesh.</li>
     <li><b>Mínimo privilegio</b>: cada servicio con las credenciales justas para lo suyo.</li></ul>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["ID token (OIDC)","Contar a la app quién es el usuario"],["Access token","Credencial corta que presentan las peticiones a las APIs"],["Refresh token","Conseguir access tokens nuevos sin volver a iniciar sesión"],["JWKS","Claves públicas para verificar la firma de los tokens"],["mTLS","Autenticación mutua entre servicios con certificados"]],
  why:"OAuth 2 es para delegar acceso; OIDC añade encima la identidad. Usar un access token como prueba de identidad es un error clásico."},
 {t:"opcion", p:"Despides a un empleado y su JWT de acceso dura 24 horas. ¿Cuál es el problema y la solución de diseño?",
  ops:["Ninguno, se puede borrar el JWT","Un JWT no se puede revocar antes de caducar: access tokens de pocos minutos, refresh tokens revocables y, para casos críticos, una lista de revocación","Cambiar la contraseña del servidor","Reiniciar las APIs"],
  ok:1, why:"El diseño asume que un token robado vale hasta que caduca: se acota esa ventana."},
 {t:"opcion", p:"La API valida el token, pero cualquier usuario puede ver el pedido de otro cambiando <code>/pedidos/81</code> por <code>/pedidos/82</code>. ¿Qué falta?",
  ops:["HTTPS","Autorización a nivel de objeto: comprobar que el pedido pertenece al usuario (o que tiene permiso sobre él)","Un token más largo","Un WAF"],
  ok:1, why:"Es la vulnerabilidad número uno del OWASP API Top 10 (BOLA). Autenticar no es autorizar."},
 {t:"vf", p:"Si un servicio está dentro de la red privada, no hace falta que autentique a los servicios que lo llaman.",
  ok:false, why:"Un atacante que entra en un servicio se mueve lateralmente por todo lo que «confía en la red». Confianza cero: cada llamada se autentica y autoriza."},
 {t:"codigo", p:"Evalúa permisos con RBAC",
  lenguaje:"py",
  c:`<p>Cada línea es una de estas órdenes:</p>
<ul><li><code>rol NOMBRE permiso1 permiso2…</code>: define un rol.</li>
<li><code>usuario NOMBRE rol1 rol2…</code>: asigna roles.</li>
<li><code>check USUARIO permiso</code>: imprime <code>USUARIO permiso: permitido</code> o <code>… denegado</code>.</li></ul>`,
  plantilla:`import sys
roles = {}
usuarios = {}
for l in sys.stdin.read().split("\\n"):
    p = l.split()
    if not p:
        continue
    # procesa rol, usuario y check
`,
  pruebas:[{entrada:"rol lector leer\nrol editor leer escribir\nusuario ana editor\nusuario luis lector\ncheck ana escribir\ncheck luis escribir\ncheck luis leer\n", salida:"ana escribir: permitido\nluis escribir: denegado\nluis leer: permitido"},{entrada:"rol admin borrar\nusuario eva\ncheck eva borrar\ncheck nadie leer\n", salida:"eva borrar: denegado\nnadie leer: denegado"},{entrada:"rol a x\nrol b y\nusuario u a b\ncheck u y\ncheck u z\n", salida:"u y: permitido\nu z: denegado", oculta:true}],
  pista:"roles[nombre] = set(permisos); usuarios[nombre] = lista de roles. En check, mira si algún rol del usuario contiene el permiso (usuarios.get(u, [])).",
  solucion:`import sys
roles = {}
usuarios = {}
for l in sys.stdin.read().split("\\n"):
    p = l.split()
    if not p:
        continue
    if p[0] == "rol":
        roles[p[1]] = set(p[2:])
    elif p[0] == "usuario":
        usuarios[p[1]] = p[2:]
    elif p[0] == "check":
        u, perm = p[1], p[2]
        ok = any(perm in roles.get(r, set()) for r in usuarios.get(u, []))
        print(f"{u} {perm}: {'permitido' if ok else 'denegado'}")
`,
  why:"Denegar por defecto: un usuario o un rol desconocidos no tienen ningún permiso. Es la regla más importante de cualquier sistema de autorización."}
]},

/* =============== U11 L2 =============== */
{
id:"ds11n2",
titulo:"Datos, secretos y multiinquilino",
claves:["Cifrado en tránsito (TLS) y en reposo con claves gestionadas (KMS, cifrado de sobre)","Secretos en un gestor, nunca en el código ni en variables sueltas; rotación automática","Aislar inquilinos (fila, esquema o base de datos) y minimizar los datos personales"],
pasos:[
 {t:"info", eti:"Cifrar", h:"En tránsito, en reposo y con sobre",
  c:`<div class="dg"><div class="dg-tit">cifrado de sobre (envelope encryption)</div>
<div class="dg-vert">
<div class="dg-caja acento doble">KMS guarda la clave maestra<small>nunca sale del KMS (o de su HSM)</small></div>
<div class="dg-caja doble">genera una clave de datos por objeto<small>te da la clave en claro y cifrada con la maestra</small></div>
<div class="dg-caja doble">cifras los datos con la clave en claro y la olvidas</div>
<div class="dg-caja ok doble">guardas datos cifrados + clave de datos cifrada<small>para leer, pides al KMS que descifre la clave de datos</small></div>
</div></div>
     <ul><li><b>En tránsito</b>: TLS 1.3 en todo, también dentro de la red (mTLS entre servicios).</li>
     <li><b>En reposo</b>: discos, bases de datos y buckets cifrados con claves del KMS. Rotar la maestra no obliga a recifrar todos los datos.</li>
     <li><b>Borrado criptográfico</b>: si cada cliente tiene su clave, destruir la clave hace ilegibles sus datos, también en las copias de seguridad (útil para el derecho de supresión del RGPD).</li></ul>`},
 {t:"info", eti:"Secretos y clientes", h:"Secretos, datos personales e inquilinos",
  c:`<ul><li><b>Secretos</b> (contraseñas de BD, claves de API) en un gestor: Vault, AWS Secrets Manager. Credenciales dinámicas y de vida corta mejor que una contraseña eterna. Nunca en el repositorio ni en la imagen.</li>
     <li><b>Minimizar</b>: no guardes lo que no necesitas. Los números de tarjeta, mejor que no pasen por tus servidores: la pasarela te da un <b>token</b> y tu alcance PCI DSS se reduce muchísimo.</li>
     <li>Los <b>logs</b> son una fuga clásica: enmascarar datos personales y tokens antes de escribirlos.</li>
     <li><b>Registro de auditoría</b> inmutable: quién hizo qué y cuándo.</li></ul>
     <div class="dg dg-tabla-caja"><div class="dg-tit">aislar inquilinos en un SaaS</div>
<table class="dg-tabla"><thead><tr><th>modelo</th><th>aislamiento</th><th>coste</th></tr></thead><tbody>
<tr><td>tablas compartidas con <code>tenant_id</code> (+ seguridad a nivel de fila)</td><td>lógico: un fallo en un WHERE filtra datos</td><td>el más barato</td></tr>
<tr><td>un esquema por inquilino</td><td>medio</td><td>migraciones × N</td></tr>
<tr><td>una base de datos (o célula) por inquilino</td><td>fuerte, también frente a vecinos ruidosos</td><td>el más caro; para clientes grandes o regulados</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja cada necesidad con la técnica",
  pares:[["No guardar números de tarjeta","Tokenización con la pasarela de pagos"],["Rotar la clave maestra sin recifrar todo","Cifrado de sobre con KMS"],["Hacer ilegibles los datos de un cliente que se va","Borrado criptográfico de su clave"],["Que la contraseña de la BD no esté en el código","Gestor de secretos con credenciales de vida corta"],["Que un cliente no vea filas de otro aunque falte un WHERE","Seguridad a nivel de fila (RLS) por tenant_id"]],
  why:"La seguridad de arquitectura es sobre todo reducir lo que puede salir mal: menos datos, menos secretos duraderos, menos confianza implícita."},
 {t:"opcion", p:"Un SaaS B2B tiene 5.000 clientes pequeños y 3 bancos que exigen aislamiento fuerte. ¿Qué modelo propones?",
  ops:["Una base de datos para cada uno de los 5.003","Híbrido: tablas compartidas con tenant_id y RLS para los pequeños, y células o bases de datos dedicadas para los bancos","Todo compartido sin excepción","Un servidor físico por cliente"],
  ok:1, why:"El modelo de aislamiento puede ser un atributo del plan de cada cliente, con el mismo código detrás."},
 {t:"vf", p:"Cifrar la base de datos en reposo protege los datos frente a una inyección SQL en la aplicación.",
  ok:false, why:"La aplicación lee los datos ya descifrados: el cifrado en reposo protege frente al robo de discos o copias, no frente a quien consulta por la puerta principal."},
 {t:"opcion", p:"Descubres que un token de API de producción se subió a un repositorio público hace una hora. ¿Qué haces primero?",
  ops:["Borrar el commit y ya","Revocar y rotar el secreto de inmediato, y después revisar su uso en los registros y limpiar el historial","Hacer el repositorio privado","Esperar a ver si alguien lo usa"],
  ok:1, why:"Los bots escanean GitHub en segundos. Borrar el commit no sirve: el secreto se considera comprometido y se rota."},
 {t:"escribe", p:"¿Cómo se llama la técnica en la que los datos se cifran con una clave de datos que a su vez se cifra con una clave maestra del KMS?",
  sol:["cifrado de sobre","envelope encryption","cifrado en sobre","cifrado sobre"],
  pista:"Como meter una carta en un sobre.",
  why:"Permite cifrar grandes volúmenes localmente y rápido, llamando al KMS solo para las claves pequeñas."}
]},

/* =============== U11 L3 =============== */
{
id:"ds11n3",
titulo:"Limitación de tasa y defensa del perímetro",
claves:["Limitar peticiones protege de abusos y de clientes con errores: token bucket, ventanas fija y deslizante","El límite se aplica por clave (usuario, clave de API, IP) con un contador compartido","Defensa en capas: CDN y anti-DDoS, WAF, gateway, y la propia aplicación"],
pasos:[
 {t:"info", eti:"Protegerse", h:"Rate limiting",
  c:`<p><b>Token bucket</b>: cada cliente tiene un cubo con capacidad para N fichas que se rellena a un ritmo fijo; cada petición gasta una; sin fichas, <b>429 Too Many Requests</b>. Permite ráfagas cortas (hasta la capacidad) y limita la media.</p>
     <div class="dg"><div class="dg-tit">token bucket: capacidad 5, 1 ficha por segundo</div>
<div class="dg-flujo"><div class="dg-caja ok">ráfaga de 5 peticiones<small>cubo vacío</small></div><div class="dg-caja aviso">6.ª en el mismo segundo<small>429</small></div><div class="dg-caja">pasa 1 s<small>+1 ficha</small></div><div class="dg-caja ok">1 petición más</div></div></div>
     <ul><li><b>Clave del límite</b>: por usuario o clave de API (lo justo), por IP (para anónimos, con cuidado: detrás de un NAT hay miles de personas).</li>
     <li><b>Dónde</b>: en el gateway o la CDN para lo general; en el servicio para límites de negocio («3 intentos de contraseña»).</li>
     <li>Con varias réplicas, el contador debe ser <b>compartido</b> (Redis) o aproximado localmente dividiendo el límite.</li>
     <li>Responder con <code>429</code>, <code>Retry-After</code> y cabeceras <code>RateLimit</code> para que el cliente se adapte.</li></ul>`},
 {t:"info", eti:"En capas", h:"Defensa del perímetro",
  c:`<div class="dg"><div class="dg-tit">cada capa filtra una cosa</div>
<div class="dg-vert">
<div class="dg-caja base doble">CDN / anti-DDoS<small>absorbe inundaciones de red (capa 3-4) con su capacidad global</small></div>
<div class="dg-caja doble">WAF<small>reglas contra inyecciones, bots conocidos, geobloqueo</small></div>
<div class="dg-caja doble">API gateway<small>autenticación, límites por cliente, tamaño máximo de petición</small></div>
<div class="dg-caja acento doble">aplicación<small>validación, autorización por objeto, límites de negocio</small></div>
</div></div>
     <p>Los ataques a la capa 7 (peticiones HTTP caras y legítimas en apariencia, como búsquedas complejas) son los más difíciles: se combaten con límites por cliente, cachés, retos a bots y coste acotado por petición (timeouts, tamaños de página máximos).</p>`},
 {t:"par", p:"Empareja cada algoritmo con su característica",
  pares:[["Ventana fija","Sencillo; permite el doble de peticiones en el borde entre ventanas"],["Ventana deslizante","Más preciso, algo más costoso"],["Token bucket","Permite ráfagas y limita la media"],["Leaky bucket","Procesa a ritmo constante, suaviza picos"]],
  why:"Explicar el problema del borde de la ventana fija suma puntos."},
 {t:"opcion", p:"¿Por qué implementar el límite de peticiones con Redis y no en la memoria de cada réplica?",
  ops:["Por velocidad","Con varias réplicas, cada una vería solo una parte de las peticiones de un usuario; Redis da un contador compartido","Porque Redis es obligatorio","No hay diferencia"],
  ok:1, why:"Estado compartido para una decisión global. Si Redis cae, decide de antemano si dejas pasar (fail open) o bloqueas (fail closed)."},
 {t:"opcion", p:"Una universidad entera sale a Internet con una sola IP y sus alumnos reciben 429 constantemente. ¿Qué cambiarías?",
  ops:["Quitar el límite","Limitar por usuario autenticado o clave de API y dejar el límite por IP, más alto, solo para tráfico anónimo","Bloquear la universidad","Subir el límite global"],
  ok:1, why:"La IP es una mala identidad: detrás de un NAT o un proxy hay muchos usuarios legítimos."},
 {t:"vf", p:"Un WAF sustituye a validar la entrada en la aplicación.",
  ok:false, why:"Es una capa más que para ataques conocidos y ruido. La aplicación sigue validando, parametrizando consultas y autorizando: defensa en profundidad."},
 {t:"codigo", p:"Implementa un token bucket",
  lenguaje:"js",
  c:`<p>Primera línea: <code>capacidad ritmo</code> (fichas por segundo). Segunda línea: instantes (en segundos, crecientes) de las peticiones. El cubo empieza lleno. En cada petición, primero se rellena con <code>(t − t_anterior) × ritmo</code> sin pasar de la capacidad; si hay al menos una ficha, se gasta y se imprime <code>t ok</code>; si no, <code>t 429</code>.</p>`,
  plantilla:`const [l1, l2] = require("fs").readFileSync(0, "utf8").trim().split("\\n");
const [capacidad, ritmo] = l1.trim().split(" ").map(Number);
const tiempos = l2.trim().split(" ").map(Number);
let fichas = capacidad;
let anterior = tiempos[0];
const salida = [];
// procesa cada petición
console.log(salida.join("\\n"));
`,
  pruebas:[{entrada:"2 1\n0 0 0 1 1 3\n", salida:"0 ok\n0 ok\n0 429\n1 ok\n1 429\n3 ok"},{entrada:"3 0.5\n0 0 0 0 2 3 4\n", salida:"0 ok\n0 ok\n0 ok\n0 429\n2 ok\n3 429\n4 ok"},{entrada:"1 2\n0 0 0.5 0.5 10\n", salida:"0 ok\n0 429\n0.5 ok\n0.5 429\n10 ok", oculta:true}],
  pista:"fichas = Math.min(capacidad, fichas + (t - anterior) * ritmo); anterior = t; si fichas >= 1, resta una.",
  solucion:`const [l1, l2] = require("fs").readFileSync(0, "utf8").trim().split("\\n");
const [capacidad, ritmo] = l1.trim().split(" ").map(Number);
const tiempos = l2.trim().split(" ").map(Number);
let fichas = capacidad;
let anterior = tiempos[0];
const salida = [];
for (const t of tiempos) {
  fichas = Math.min(capacidad, fichas + (t - anterior) * ritmo);
  anterior = t;
  if (fichas >= 1) {
    fichas -= 1;
    salida.push(t + " ok");
  } else {
    salida.push(t + " 429");
  }
}
console.log(salida.join("\\n"));
`,
  why:"Solo se guardan dos números por cliente (fichas y último instante): en Redis se implementa con un script Lua para que leer, rellenar y gastar sea atómico."}
]}

]});
