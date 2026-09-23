window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "El navegador: XSS, CSRF, CORS y cabeceras",
resumen: "XSS almacenado, reflejado y en el DOM, escapado por contexto, Trusted Types, Content-Security-Policy estricta con nonces, CSRF con SameSite y Fetch Metadata, clickjacking, CORS bien entendido y las cabeceras de seguridad",
nivel: "Intermedio",
color: "#ea6d60",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"sg2l2",
titulo:"Cross-Site Scripting (XSS)",
claves:["XSS: inyectar JavaScript que se ejecuta en tu origen, en el navegador de otros usuarios","Almacenado, reflejado y basado en el DOM","Escapar la salida según el contexto, frameworks que escapan por defecto y CSP como segunda capa"],
pasos:[
 {t:"info", eti:"JavaScript ajeno", h:"Tipos de XSS",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">los tres tipos de xss</div><table class="dg-tabla"><thead><tr><th>Tipo</th><th>Dónde vive la carga</th><th>Ejemplo</th></tr></thead><tbody>
       <tr><td>Almacenado</td><td>en tu base de datos</td><td>comentario con <code>&lt;img src=x onerror=...&gt;</code> que ven todos</td></tr>
       <tr><td>Reflejado</td><td>en la petición (URL, formulario)</td><td><code>/buscar?q=&lt;script&gt;...</code> y la página pinta q sin escapar</td></tr>
       <tr><td>DOM</td><td>solo en el navegador</td><td>el JS de la página mete <code>location.hash</code> en <code>innerHTML</code></td></tr>
     </tbody></table></div>
     <p>El script inyectado se ejecuta <b>en tu origen</b>, así que la política del mismo origen ya no protege: actúa como la víctima. Puede leer lo que hay en la página, hacer peticiones a tu API con su sesión (cambiar su email, crear un administrador), leer tokens guardados en <code>localStorage</code>, capturar lo que teclea o mostrar un formulario de login falso.</p>
     <div class="nota ojo"><b class="tit">HttpOnly no basta</b>Una cookie HttpOnly impide que el script la <b>lea</b>, pero no que haga peticiones con ella: el navegador la adjunta igual. HttpOnly limita el daño; no evita el ataque.</div>`},
 {t:"par", p:"Empareja cada escenario con el tipo de XSS",
  pares:[["Un comentario del foro con un script que se ejecuta a cada visitante","Almacenado"],["Un enlace con el script en el parámetro de búsqueda","Reflejado"],["El JavaScript de la página copia location.hash en innerHTML","Basado en el DOM"],["El nombre de perfil con HTML aparece en el panel del administrador","Almacenado (y además llega a un usuario con privilegios)"]],
  why:"El XSS almacenado que llega al panel de administración es especialmente grave: el script corre con la sesión del administrador."},
 {t:"info", eti:"Defensas", h:"Escapar, sanear y restringir",
  c:`<ul><li><b>Escapar la salida</b> según el contexto. React, Angular, Vue, Thymeleaf, Jinja2 y Razor escapan por defecto. Los peligros son las vías de escape: <code>dangerouslySetInnerHTML</code>, <code>v-html</code>, <code>innerHTML</code>, <code>th:utext</code>, <code>|safe</code> en Jinja2, <code>&lt;%- %&gt;</code> en EJS.</li>
     <li><b>Sanear</b> con DOMPurify si de verdad necesitas HTML de usuarios (un editor de texto enriquecido). Nunca con expresiones regulares caseras.</li>
     <li><b>Validar URLs</b>: <code>&lt;a href={url}&gt;</code> con <code>javascript:alert(1)</code> ejecuta código aunque el texto esté escapado.</li>
     <li><b>Content-Security-Policy</b> estricta y <b>Trusted Types</b>: si se cuela un XSS, el navegador lo bloquea.</li>
     <li>Cookies de sesión <b>HttpOnly</b> y tokens fuera de <code>localStorage</code>.</li></ul>`},
 {t:"opcion", p:"¿Qué aporta una Content-Security-Policy estricta si ya escapas la salida?",
  ops:["Nada, es redundante","Una segunda capa: si se cuela un XSS, el navegador bloquea los scripts en línea y de orígenes no autorizados","Cifra la página","Evita el CSRF"],
  ok:1, why:"Defensa en profundidad aplicada al navegador: basta un único olvido de escapado en toda la aplicación para tener un XSS."},
 {t:"opcion", p:"En React, ¿cuál de estas líneas es vulnerable a XSS si <code>bio</code> la escribe el usuario?",
  ops:["&lt;p&gt;{bio}&lt;/p&gt;","&lt;p title={bio}&gt;Perfil&lt;/p&gt;","&lt;div dangerouslySetInnerHTML={{__html: bio}} /&gt;","&lt;input value={bio} /&gt;"],
  ok:2, why:"Las llaves de JSX escapan el texto y los atributos. dangerouslySetInnerHTML se salta el escapado a propósito: el nombre ya avisa."},
 {t:"vf", p:"Si la cookie de sesión es HttpOnly, un XSS no puede hacer nada en nombre del usuario.",
  ok:false, why:"Puede hacer peticiones fetch a tu API y el navegador adjuntará la cookie. HttpOnly solo evita que se la lleve para usarla desde otro sitio."},
 {t:"codigo", p:"Escapa HTML", lenguaje:"js",
  c:`<p>Escribe <code>escaparHtml(texto)</code> que sustituya <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>"</code> y <code>'</code> por <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code> y <code>&amp;#39;</code>. El programa lee una línea y la imprime escapada.</p>`,
  plantilla:"function escaparHtml(texto) {\n  // sustituye los cinco caracteres\n  return texto;\n}\nconst linea = require(\"fs\").readFileSync(0, \"utf8\").replace(/\\n$/, \"\");\nconsole.log(escaparHtml(linea));\n",
  pruebas:[
   {entrada:"<script>alert(1)</script>\n", salida:"&lt;script&gt;alert(1)&lt;/script&gt;"},
   {entrada:"Tom & Jerry\n", salida:"Tom &amp; Jerry"},
   {entrada:"\" onmouseover=\"alert('x')\n", salida:"&quot; onmouseover=&quot;alert(&#39;x&#39;)", oculta:true},
   {entrada:"&lt;\n", salida:"&amp;lt;", oculta:true}
  ],
  pista:"Sustituye primero el &amp;; si no, estropeas los &amp;lt; que acabas de generar.",
  solucion:"function escaparHtml(texto) {\n  return texto\n    .replace(/&/g, \"&amp;\")\n    .replace(/</g, \"&lt;\")\n    .replace(/>/g, \"&gt;\")\n    .replace(/\"/g, \"&quot;\")\n    .replace(/'/g, \"&#39;\");\n}\nconst linea = require(\"fs\").readFileSync(0, \"utf8\").replace(/\\n$/, \"\");\nconsole.log(escaparHtml(linea));\n",
  why:"Es exactamente lo que hacen las plantillas por debajo. En la práctica no la escribes tú: usas el escapado del framework o textContent, pero entender el orden (el &amp; primero) evita dobles codificaciones y agujeros."}
]},

/* =============== U4 L2 =============== */
{
id:"sg4n1",
titulo:"XSS en el DOM, contextos y Trusted Types",
claves:["Fuentes (location, postMessage, storage) que llegan a sumideros peligrosos (innerHTML, eval, href)","Cada contexto tiene su codificación; algunos, como dentro de un script, conviene evitarlos","Trusted Types hace que el navegador rechace cadenas en los sumideros peligrosos"],
pasos:[
 {t:"info", eti:"Fuentes y sumideros", h:"Cómo se busca un XSS en el DOM",
  c:`<div class="dg"><div class="dg-tit">de una fuente controlada por el atacante a un sumidero</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">fuentes</div><div class="dg-pila">
         <div class="dg-caja base"><code>location.hash / search</code></div>
         <div class="dg-caja base"><code>postMessage</code> sin comprobar origin</div>
         <div class="dg-caja base"><code>localStorage</code>, respuestas de API</div>
         <div class="dg-caja base"><code>document.referrer</code>, <code>window.name</code></div></div></div>
       <div class="dg-col"><div class="dg-col-tit">sumideros peligrosos</div><div class="dg-pila">
         <div class="dg-caja aviso"><code>innerHTML</code>, <code>outerHTML</code>, <code>insertAdjacentHTML</code></div>
         <div class="dg-caja aviso"><code>document.write</code>, <code>$(html)</code> de jQuery</div>
         <div class="dg-caja aviso"><code>eval</code>, <code>new Function</code>, <code>setTimeout(cadena)</code></div>
         <div class="dg-caja aviso"><code>a.href</code>, <code>iframe.src</code>, <code>location =</code> con URLs</div></div></div>
     </div></div>
     <p>Alternativas seguras: <code>textContent</code>, <code>createElement</code> + <code>setAttribute</code> para atributos que no son URL, y validar el esquema de toda URL antes de asignarla.</p>`},
 {t:"info", eti:"Cada sitio, su regla", h:"Escapado por contexto",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">dónde acaba el dato y qué hacer</div><table class="dg-tabla"><thead><tr><th>Contexto</th><th>Qué hacer</th></tr></thead><tbody>
       <tr><td>Texto dentro de HTML</td><td>escapar entidades HTML (lo que hacen las plantillas)</td></tr>
       <tr><td>Atributo</td><td>siempre entre comillas y con entidades escapadas; nunca atributos de evento (<code>onclick</code>)</td></tr>
       <tr><td>URL en href/src</td><td>validar esquema (solo http, https, mailto) y codificar parámetros con <code>encodeURIComponent</code></td></tr>
       <tr><td>Dentro de <code>&lt;script&gt;</code></td><td>evitarlo: pasar datos en un atributo <code>data-*</code> o en un JSON que se lee con <code>JSON.parse</code></td></tr>
       <tr><td>CSS</td><td>evitarlo; si no hay más remedio, lista permitida de valores</td></tr>
     </tbody></table></div>
     <p>El escapado HTML <b>no</b> sirve en un <code>href</code>: <code>javascript:alert(1)</code> no tiene ningún carácter que escapar.</p>`},
 {t:"opcion", p:"Una página hace <code>window.addEventListener(\"message\", e =&gt; { panel.innerHTML = e.data; })</code>. ¿Qué dos fallos tiene?",
  ops:["Ninguno, postMessage es seguro","No comprueba e.origin (cualquier web que la incruste o la abra puede enviarle mensajes) y mete el dato en innerHTML","Solo que es lento","Que debería usar localStorage"],
  ok:1, why:"Con postMessage, compara siempre e.origin con una lista exacta de orígenes y trata e.data como datos: textContent o validación de un esquema."},
 {t:"info", eti:"Que lo imponga el navegador", h:"Trusted Types y DOMPurify",
  c:`<div class="termbox">Content-Security-Policy: require-trusted-types-for 'script'; trusted-types app-sanitizer

// con esto, element.innerHTML = "texto" lanza un error: solo acepta TrustedHTML
const politica = trustedTypes.createPolicy("app-sanitizer", {
  createHTML: (html) =&gt; DOMPurify.sanitize(html)
});
editor.innerHTML = politica.createHTML(htmlDelUsuario);</div>
     <p><b>Trusted Types</b> convierte los sumideros peligrosos en un punto único y revisable: solo las políticas que declaras pueden producir HTML. Está soportado en los navegadores basados en Chromium y se va extendiendo; puede desplegarse primero en modo <code>Content-Security-Policy-Report-Only</code> para ver qué rompería.</p>`},
 {t:"par", p:"Empareja cada código con su alternativa segura",
  pares:[["div.innerHTML = nombre","div.textContent = nombre"],["setTimeout(\"guardar(\" + id + \")\", 100)","setTimeout(() =&gt; guardar(id), 100)"],["a.href = urlDelUsuario","Validar que el esquema es http o https antes de asignar"],["html de un editor enriquecido en innerHTML","DOMPurify.sanitize o una política de Trusted Types"],["var datos = &lt;%= json %&gt; dentro de un script","Un atributo data-* o un JSON leído con JSON.parse"]],
  why:"Ninguna alternativa necesita escapar a mano: usan APIs que tratan el dato como dato."},
 {t:"vf", p:"Escapar las entidades HTML de una URL es suficiente para poder ponerla en un <code>href</code>.",
  ok:false, why:"«javascript:alert(document.cookie)» no contiene ningún carácter HTML especial. En un href hay que validar el esquema."},
 {t:"codigo", p:"Valida URLs antes de ponerlas en un enlace", lenguaje:"js",
  c:`<p>Lee una URL escrita por el usuario (puede ser relativa). Resuélvela contra <code>https://tienda.com</code> con <code>new URL(valor, base)</code>. Si el protocolo resultante es <code>http:</code> o <code>https:</code>, imprime la URL normalizada (<code>.href</code>); si no, o si no se puede parsear, imprime <code>RECHAZADO</code>.</p>`,
  plantilla:"const valor = require(\"fs\").readFileSync(0, \"utf8\").replace(/\\n$/, \"\");\n// resuelve y valida el protocolo\n",
  pruebas:[
   {entrada:"/perfil?id=3\n", salida:"https://tienda.com/perfil?id=3"},
   {entrada:"javascript:alert(1)\n", salida:"RECHAZADO"},
   {entrada:"  JaVaScRiPt:alert(1)\n", salida:"RECHAZADO", oculta:true},
   {entrada:"data:text/html,<script>alert(1)</script>\n", salida:"RECHAZADO", oculta:true},
   {entrada:"https://ejemplo.com/a b\n", salida:"https://ejemplo.com/a%20b", oculta:true}
  ],
  pista:"try { const u = new URL(valor, \"https://tienda.com\"); ... } catch { ... } y compara u.protocol.",
  solucion:"const valor = require(\"fs\").readFileSync(0, \"utf8\").replace(/\\n$/, \"\");\nlet salida = \"RECHAZADO\";\ntry {\n  const u = new URL(valor, \"https://tienda.com\");\n  if (u.protocol === \"http:\" || u.protocol === \"https:\") salida = u.href;\n} catch {}\nconsole.log(salida);\n",
  why:"Usar el parser del navegador (el mismo que interpretará el enlace) evita los trucos de mayúsculas, espacios y caracteres de control que se saltan un startsWith(\"javascript:\")."}
]},

/* =============== U4 L3 =============== */
{
id:"sg4n2",
titulo:"Content-Security-Policy en serio",
claves:["CSP estricta: scripts con nonce aleatorio por respuesta (o hash) y 'strict-dynamic'","Las CSP por lista de dominios se saltan con facilidad; 'unsafe-inline' las anula","Desplegar primero en Report-Only, recoger informes y endurecer"],
pasos:[
 {t:"info", eti:"Qué scripts valen", h:"CSP estricta con nonces",
  c:`<div class="termbox">Content-Security-Policy:
  script-src 'nonce-4f9aKq2Lx8' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';
  report-to csp

&lt;script nonce="4f9aKq2Lx8" src="/app.js"&gt;&lt;/script&gt;   &lt;!-- se ejecuta --&gt;
&lt;script&gt;alert(1)&lt;/script&gt;                            &lt;!-- inyectado: bloqueado --&gt;</div>
     <ul><li><b>nonce</b>: valor aleatorio distinto en <b>cada respuesta</b>; solo los scripts que lo llevan se ejecutan. El atacante no puede adivinarlo. Para páginas estáticas se usan <b>hashes</b> (<code>'sha256-...'</code>).</li>
     <li><b>'strict-dynamic'</b>: los scripts de confianza pueden cargar otros (bundlers, analítica) sin listar dominios.</li>
     <li><b>object-src 'none'</b> y <b>base-uri 'none'</b>: cierran plugins y el secuestro de rutas relativas con <code>&lt;base&gt;</code>.</li></ul>`},
 {t:"info", eti:"Lo que no funciona", h:"Listas de dominios y unsafe-inline",
  c:`<ul><li><code>script-src 'self' https://cdn.jsdelivr.net</code>: cualquiera puede publicar un paquete en ese CDN, o hay endpoints JSONP o bibliotecas antiguas que permiten ejecutar código. Las investigaciones de Google encontraron que la inmensa mayoría de CSP basadas en listas se podían saltar.</li>
     <li><code>'unsafe-inline'</code> permite cualquier script en línea: justo lo que inyecta un XSS. (Si hay un nonce o un hash, los navegadores modernos ignoran <code>'unsafe-inline'</code>, por eso se añade a veces como compatibilidad con navegadores muy antiguos.)</li>
     <li><code>'unsafe-eval'</code> permite <code>eval</code> y <code>new Function</code>.</li>
     <li>Controladores en línea (<code>onclick="..."</code>) no aceptan nonce: hay que pasarlos a <code>addEventListener</code>.</li></ul>
     <div class="nota"><b class="tit">Despliegue sin romper nada</b>Empieza con <code>Content-Security-Policy-Report-Only</code> y una cabecera <code>Reporting-Endpoints: csp="https://tienda.com/csp-informes"</code>. El navegador no bloquea, solo informa. Cuando los informes estén limpios, cambias a la cabecera normal.</div>`},
 {t:"opcion", p:"Tu CSP es <code>script-src 'self' 'unsafe-inline'</code>. ¿Protege frente a un XSS almacenado que inyecta <code>&lt;script&gt;...&lt;/script&gt;</code>?",
  ops:["Sí, porque solo permite 'self'","No: 'unsafe-inline' permite precisamente los scripts en línea que inyecta el atacante","Sí, si además hay HTTPS","Solo en Firefox"],
  ok:1, why:"Es la CSP «decorativa» más común: cumple el checklist pero no bloquea nada relevante."},
 {t:"par", p:"Empareja cada directiva con su función",
  pares:[["script-src","De dónde y qué scripts se ejecutan"],["object-src 'none'","Prohíbe plugins como embed y object"],["base-uri 'none'","Impide inyectar una etiqueta base que cambie las rutas relativas"],["frame-ancestors","Quién puede incrustar la página en un iframe"],["report-to","A dónde se envían los informes de violaciones"],["default-src","Valor por defecto de las directivas de carga no indicadas"]],
  why:"frame-ancestors y report-to no heredan de default-src: hay que ponerlas explícitamente."},
 {t:"vf", p:"El nonce de la CSP puede ser un valor fijo configurado en el servidor, mientras sea largo.",
  ok:false, why:"Si es fijo, el atacante lo lee una vez en el HTML y lo reutiliza en su inyección. Debe ser aleatorio (al menos 128 bits) y nuevo en cada respuesta."},
 {t:"codigo", p:"Revisa una CSP", lenguaje:"py",
  c:`<p>Lee una CSP e imprime sus problemas, uno por línea y en este orden (o <code>OK</code> si no hay ninguno):</p>
     <ol><li><code>falta script-src</code> si no hay <code>script-src</code> ni <code>default-src</code> (si solo hay default-src, se usa como script-src).</li>
     <li><code>unsafe-inline sin nonce</code> si el script-src efectivo tiene <code>'unsafe-inline'</code> y ningún valor que empiece por <code>'nonce-</code> o <code>'sha256-</code>.</li>
     <li><code>unsafe-eval</code> si lo tiene.</li>
     <li><code>script-src con comodines</code> si tiene <code>*</code>, <code>https:</code>, <code>http:</code> o <code>data:</code>.</li>
     <li><code>object-src no es 'none'</code> si el object-src efectivo (o default-src) no es exactamente <code>'none'</code>.</li>
     <li><code>falta base-uri</code> si no aparece.</li></ol>`,
  plantilla:"csp = input().strip()\ndirectivas = {}\nfor parte in csp.split(\";\"):\n    trozos = parte.split()\n    if trozos:\n        directivas[trozos[0].lower()] = trozos[1:]\n# revisa las reglas en orden\n",
  pruebas:[
   {entrada:"script-src 'nonce-abc123' 'strict-dynamic'; object-src 'none'; base-uri 'none'\n", salida:"OK"},
   {entrada:"default-src 'self' 'unsafe-inline'\n", salida:"unsafe-inline sin nonce\nobject-src no es 'none'\nfalta base-uri"},
   {entrada:"script-src * 'unsafe-eval'; object-src 'none'\n", salida:"unsafe-eval\nscript-src con comodines\nfalta base-uri", oculta:true},
   {entrada:"img-src 'self'\n", salida:"falta script-src\nobject-src no es 'none'\nfalta base-uri", oculta:true},
   {entrada:"script-src 'self' 'unsafe-inline' 'sha256-AbC='; object-src 'none'; base-uri 'self'\n", salida:"OK", oculta:true}
  ],
  pista:"script = directivas.get(\"script-src\", directivas.get(\"default-src\")). Ojo: si no hay ninguna de las dos, script es None.",
  solucion:"csp = input().strip()\ndirectivas = {}\nfor parte in csp.split(\";\"):\n    trozos = parte.split()\n    if trozos:\n        directivas[trozos[0].lower()] = trozos[1:]\n\nproblemas = []\nscript = directivas.get(\"script-src\", directivas.get(\"default-src\"))\nif script is None:\n    problemas.append(\"falta script-src\")\n    script = []\ntiene_nonce = any(v.startswith(\"'nonce-\") or v.startswith(\"'sha256-\") for v in script)\nif \"'unsafe-inline'\" in script and not tiene_nonce:\n    problemas.append(\"unsafe-inline sin nonce\")\nif \"'unsafe-eval'\" in script:\n    problemas.append(\"unsafe-eval\")\nif any(v in (\"*\", \"https:\", \"http:\", \"data:\") for v in script):\n    problemas.append(\"script-src con comodines\")\nobjeto = directivas.get(\"object-src\", directivas.get(\"default-src\"))\nif objeto != [\"'none'\"]:\n    problemas.append(\"object-src no es 'none'\")\nif \"base-uri\" not in directivas:\n    problemas.append(\"falta base-uri\")\nprint(\"\\n\".join(problemas) if problemas else \"OK\")\n",
  why:"Es una versión mínima de lo que hace CSP Evaluator de Google. Revisar la CSP en CI evita que alguien añada 'unsafe-inline' «solo para probar» y se quede para siempre."}
]},

/* =============== U4 L4 =============== */
{
id:"sg2l3",
titulo:"CSRF y clickjacking",
claves:["CSRF: otra web hace que el navegador de la víctima envíe una petición con sus cookies","Defensas: SameSite, tokens anti-CSRF, Fetch Metadata (Sec-Fetch-Site) y nunca cambiar estado con GET","Clickjacking: tu web dentro de un iframe invisible; se evita con frame-ancestors"],
pasos:[
 {t:"info", eti:"Peticiones en tu nombre", h:"Cross-Site Request Forgery",
  c:`<div class="termbox">&lt;!-- en web-maliciosa.com, visitada por alguien con sesión abierta en su banco --&gt;
&lt;form action="https://banco.com/transferir" method="POST"&gt;
  &lt;input name="iban" value="ES00ATACANTE..."&gt;
  &lt;input name="importe" value="1000"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</div>
     <p>La SOP impide que la web maliciosa <b>lea</b> la respuesta, pero la petición se <b>envía</b> y, sin defensas, con las cookies del banco. El ataque solo necesita que el servidor acepte una petición que otra web puede fabricar: formularios, imágenes (GET), <code>fetch</code> sin cabeceras especiales.</p>`},
 {t:"info", eti:"Defensas", h:"SameSite, tokens y Fetch Metadata",
  c:`<ul><li><b>SameSite=Lax</b> (valor por defecto en Chrome y Edge para cookies sin atributo): la cookie no viaja en peticiones entre sitios salvo navegaciones GET de nivel superior. <b>Strict</b> no viaja nunca entre sitios. <b>None</b> exige <code>Secure</code> y viaja siempre.</li>
     <li><b>Tokens anti-CSRF</b> (patrón sincronizador, o doble envío de cookie firmado con HMAC y ligado a la sesión) en aplicaciones con sesión por cookie. Frameworks como Spring Security, Django o Rails lo traen activado.</li>
     <li><b>Fetch Metadata</b>: los navegadores envían <code>Sec-Fetch-Site</code> (<code>same-origin</code>, <code>same-site</code>, <code>cross-site</code>, <code>none</code>). El servidor puede rechazar peticiones <code>cross-site</code> que no sean navegaciones.</li>
     <li>Comprobar la cabecera <b>Origin</b> en peticiones que cambian estado.</li>
     <li>No cambiar estado con <b>GET</b>: SameSite=Lax deja pasar las navegaciones GET.</li></ul>
     <div class="nota ojo"><b class="tit">SameSite no cubre todo</b>Es por <b>sitio</b>: un subdominio comprometido o con XSS es «mismo sitio» y puede hacer CSRF. Por eso los tokens o Fetch Metadata siguen siendo necesarios en aplicaciones sensibles.</div>`},
 {t:"par", p:"Empareja cada ataque con su defensa principal",
  pares:[["CSRF","Cookies SameSite y tokens anti-CSRF"],["Clickjacking","frame-ancestors en CSP (o X-Frame-Options)"],["XSS","Escapar la salida y CSP"],["Robo de cookie de sesión por script","Atributo HttpOnly"],["Cookie enviada por HTTP sin cifrar","Atributo Secure y HSTS"]],
  why:"Cada atributo de la cookie cierra una puerta distinta; una cookie de sesión debería llevar HttpOnly, Secure y SameSite."},
 {t:"opcion", p:"Tu API usa un token en la cabecera <code>Authorization</code>, sin cookies. ¿Es vulnerable a CSRF?",
  ops:["Sí, siempre","Solo con GET","Solo en móviles","No en esencia: otra web no puede hacer que el navegador añada esa cabecera por sí solo"],
  ok:3, why:"El CSRF explota que el navegador añade las cookies automáticamente. A cambio, un token accesible desde JavaScript queda expuesto a XSS: es el equilibrio que verás en la unidad de tokens."},
 {t:"info", eti:"Hacer clic sin saberlo", h:"Clickjacking",
  c:`<p>La web maliciosa carga la tuya en un <code>&lt;iframe&gt;</code> transparente encima de un botón señuelo («¡Reclama tu premio!»). El clic cae en tu botón «Borrar cuenta», con la sesión de la víctima.</p>
     <div class="termbox">Content-Security-Policy: frame-ancestors 'none'         # nadie puede incrustarte
Content-Security-Policy: frame-ancestors 'self' https://socio.com
X-Frame-Options: DENY                                    # equivalente antiguo</div>`},
 {t:"vf", p:"Con cookies SameSite=Lax, un enlace desde otra web a <code>https://tienda.com/cuenta/borrar</code> (GET) llega sin la cookie de sesión.",
  ok:false, why:"Lax sí envía la cookie en navegaciones GET de nivel superior (hacer clic en un enlace). Por eso nunca se cambia estado con GET."},
 {t:"codigo", p:"Política de aislamiento con Fetch Metadata", lenguaje:"js",
  c:`<p>Cada línea es una petición: <code>MÉTODO Sec-Fetch-Site Sec-Fetch-Mode Sec-Fetch-Dest</code> (un <code>-</code> significa que la cabecera no vino). Imprime <code>PERMITIDO</code> o <code>BLOQUEADO</code> según esta política:</p>
     <ol><li>Sin <code>Sec-Fetch-Site</code> (navegador antiguo o cliente no navegador): permitido.</li>
     <li><code>same-origin</code>, <code>same-site</code> o <code>none</code> (el usuario escribió la URL): permitido.</li>
     <li>Navegación: modo <code>navigate</code>, método <code>GET</code> y destino que no sea <code>object</code> ni <code>embed</code>: permitido.</li>
     <li>Todo lo demás: bloqueado.</li></ol>`,
  plantilla:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfor (const linea of lineas) {\n  const [metodo, sitio, modo, destino] = linea.trim().split(/\\s+/);\n  // decide\n}\n",
  pruebas:[
   {entrada:"POST same-origin cors empty\nPOST cross-site navigate document\nGET cross-site navigate document\n", salida:"PERMITIDO\nBLOQUEADO\nPERMITIDO"},
   {entrada:"GET - - -\nGET cross-site no-cors image\nGET none navigate document\nGET cross-site navigate embed\n", salida:"PERMITIDO\nBLOQUEADO\nPERMITIDO\nBLOQUEADO", oculta:true}
  ],
  pista:"Tres condiciones que permiten y un else que bloquea.",
  solucion:"const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nfunction permitir(metodo, sitio, modo, destino) {\n  if (sitio === \"-\") return true;\n  if ([\"same-origin\", \"same-site\", \"none\"].includes(sitio)) return true;\n  if (modo === \"navigate\" && metodo === \"GET\" && ![\"object\", \"embed\"].includes(destino)) return true;\n  return false;\n}\nfor (const linea of lineas) {\n  const [metodo, sitio, modo, destino] = linea.trim().split(/\\s+/);\n  console.log(permitir(metodo, sitio, modo, destino) ? \"PERMITIDO\" : \"BLOQUEADO\");\n}\n",
  why:"Es la «resource isolation policy» que recomienda web.dev: unas líneas en un middleware que cortan CSRF, XSSI y fugas por timing entre sitios, sin tocar los formularios."}
]},

/* =============== U4 L5 =============== */
{
id:"sg4n3",
titulo:"CORS bien entendido",
claves:["CORS no protege tu servidor: relaja la política del mismo origen para que otra web pueda LEER tus respuestas","Reflejar cualquier Origin con Allow-Credentials: true equivale a no tener SOP","Lista exacta de orígenes, Vary: Origin, nada de null ni comparaciones con endsWith"],
pasos:[
 {t:"info", eti:"Qué es y qué no", h:"CORS relaja, no protege",
  c:`<p>Por defecto, el JavaScript de <code>https://app.com</code> no puede leer respuestas de <code>https://api.otra.com</code>. <b>CORS</b> es la forma en que el servidor dice «a este origen le dejo leer»:</p>
     <div class="termbox">GET /api/perfil
Origin: https://app.tienda.com

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.tienda.com
Access-Control-Allow-Credentials: true
Vary: Origin</div>
     <p>Para peticiones no simples (<code>PUT</code>, <code>DELETE</code>, JSON con <code>Content-Type: application/json</code>, cabeceras propias) el navegador envía antes una petición <b>preflight</b> <code>OPTIONS</code> preguntando si puede.</p>
     <div class="nota ojo"><b class="tit">No es una defensa CSRF</b>CORS decide quién puede <b>leer</b> la respuesta en un navegador. Un formulario simple de otra web se envía igual, y curl ignora CORS por completo. La autorización va en el servidor.</div>`},
 {t:"info", eti:"El error clásico", h:"Reflejar el Origin",
  c:`<div class="termbox">// MAL: devuelve el Origin que le llegue, con credenciales
res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
res.setHeader("Access-Control-Allow-Credentials", "true");
// cualquier web lee /api/perfil con la sesión de la víctima

// MAL: comparación con sufijo
if (origin.endsWith("tienda.com")) ...     // acepta https://malatienda.com

// BIEN: lista exacta
const PERMITIDOS = new Set(["https://tienda.com", "https://app.tienda.com"]);
if (PERMITIDOS.has(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
}</div>
     <p>El navegador prohíbe <code>Access-Control-Allow-Origin: *</code> junto a credenciales; por eso la gente «lo arregla» reflejando el Origin, que es peor. El origen <code>null</code> (iframes con sandbox, ficheros locales) tampoco debe estar en la lista.</p>`},
 {t:"opcion", p:"Una API pública de solo lectura, sin cookies ni tokens (catálogo de productos), ¿puede usar <code>Access-Control-Allow-Origin: *</code>?",
  ops:["No, nunca","Sí: no hay credenciales ni datos privados, así que dejar que cualquier web lea la respuesta no expone nada","Solo con HTTP","Solo si añade Allow-Credentials: true"],
  ok:1, why:"El comodín es razonable para datos públicos. El problema aparece cuando la respuesta depende de la identidad de quien llama."},
 {t:"par", p:"Empareja cada configuración con su consecuencia",
  pares:[["Reflejar Origin con Allow-Credentials: true","Cualquier web lee datos privados de la víctima"],["Access-Control-Allow-Origin: * sin credenciales","Cualquier web lee respuestas públicas"],["Permitir el origen null","Un iframe con sandbox de un atacante pasa el filtro"],["Olvidar Vary: Origin","Una caché puede servir la cabecera de un origen a otro"],["Comparar con endsWith(\"tienda.com\")","Un dominio como eviltienda.com se cuela"]],
  why:"CORS mal configurado es un clásico de los informes de pentest y bug bounty."},
 {t:"vf", p:"Si configuro CORS para permitir solo a mi frontend, nadie más puede llamar a mi API.",
  ok:false, why:"CORS solo lo aplican los navegadores y solo afecta a la lectura desde JavaScript. curl, Postman, un script o un servidor llaman a tu API sin ninguna restricción."},
 {t:"codigo", p:"Decide las cabeceras CORS", lenguaje:"js",
  c:`<p>Los orígenes permitidos son <code>https://tienda.com</code> y <code>https://app.tienda.com</code>. Lee el valor de la cabecera <code>Origin</code> y, si está en la lista <b>exacta</b>, imprime dos líneas: <code>Access-Control-Allow-Origin: &lt;origen&gt;</code> y <code>Vary: Origin</code>. Si no, imprime <code>sin CORS</code>.</p>`,
  plantilla:"const origin = require(\"fs\").readFileSync(0, \"utf8\").trim();\n// compara con la lista exacta\n",
  pruebas:[
   {entrada:"https://app.tienda.com\n", salida:"Access-Control-Allow-Origin: https://app.tienda.com\nVary: Origin"},
   {entrada:"https://tienda.com.malo.net\n", salida:"sin CORS"},
   {entrada:"null\n", salida:"sin CORS", oculta:true},
   {entrada:"https://maltienda.com\n", salida:"sin CORS", oculta:true},
   {entrada:"http://tienda.com\n", salida:"sin CORS", oculta:true}
  ],
  pista:"Un Set con los dos orígenes y .has(origin).",
  solucion:"const origin = require(\"fs\").readFileSync(0, \"utf8\").trim();\nconst PERMITIDOS = new Set([\"https://tienda.com\", \"https://app.tienda.com\"]);\nif (PERMITIDOS.has(origin)) {\n  console.log(\"Access-Control-Allow-Origin: \" + origin);\n  console.log(\"Vary: Origin\");\n} else {\n  console.log(\"sin CORS\");\n}\n",
  why:"Comparación exacta, sin expresiones regulares ni sufijos: es la forma que no se equivoca. Si necesitas subdominios dinámicos, parsea el origen con new URL y compara el hostname exacto."}
]},

/* =============== U4 L6 =============== */
{
id:"sg6l2",
titulo:"Cabeceras de seguridad",
claves:["HSTS obliga a HTTPS; CSP y frame-ancestors limitan scripts e incrustaciones","nosniff, Referrer-Policy, Permissions-Policy y aislamiento entre orígenes (COOP, CORP)","Quitar lo que sobra: versiones del servidor y cabeceras obsoletas como X-XSS-Protection"],
pasos:[
 {t:"info", eti:"Endurecer respuestas", h:"Las cabeceras que importan",
  c:`<div class="termbox">Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: script-src 'nonce-...' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Cache-Control: no-store                  # en respuestas con datos personales</div>
     <ul><li><b>HSTS</b>: tras la primera visita, el navegador ya no intenta HTTP. Con <code>preload</code> y el alta en la lista de precarga, ni siquiera la primera vez. Cuidado: <code>includeSubDomains</code> rompe los subdominios que aún no tengan HTTPS.</li>
     <li><b>COOP</b> separa tu ventana de las que abras o te abran (frena ataques vía <code>window.opener</code> y fugas entre orígenes).</li>
     <li><b>CORP</b> impide que otros sitios incrusten tus recursos.</li></ul>`},
 {t:"par", p:"Empareja cada cabecera con su efecto",
  pares:[["Strict-Transport-Security","Obliga al navegador a usar siempre HTTPS"],["X-Content-Type-Options: nosniff","Impide que el navegador adivine el tipo de un fichero"],["Referrer-Policy","Controla qué URL de origen se envía a otros sitios"],["Permissions-Policy","Desactiva APIs del navegador como cámara o geolocalización"],["Cross-Origin-Opener-Policy","Aísla tu ventana de las ventanas de otros orígenes"]],
  why:"securityheaders.com y el escáner pasivo de ZAP las revisan en segundos."},
 {t:"info", eti:"Lo que sobra", h:"Cabeceras obsoletas y fugas",
  c:`<ul><li><code>X-XSS-Protection</code>: el filtro XSS de los navegadores se retiró porque en sí creaba vulnerabilidades. No la pongas, o ponla a <code>0</code>.</li>
     <li><code>X-Frame-Options</code>: sustituida por <code>frame-ancestors</code>; se mantiene solo por compatibilidad.</li>
     <li><code>Server: nginx/1.18.0</code>, <code>X-Powered-By: Express</code>: regalan versiones a quien busca CVE concretos. Quítalas (<code>server_tokens off</code>, <code>app.disable("x-powered-by")</code>).</li>
     <li><code>Expect-CT</code> y <code>Public-Key-Pins</code> (HPKP): obsoletas; HPKP podía dejar tu dominio inaccesible.</li></ul>`},
 {t:"opcion", p:"Tu web devuelve los ficheros subidos por usuarios y alguien sube un <code>.txt</code> con HTML y script. ¿Qué cabecera evita que el navegador lo ejecute como HTML?",
  ops:["X-XSS-Protection: 1","X-Content-Type-Options: nosniff junto a un Content-Type correcto (y mejor aún, servirlo desde otro dominio con Content-Disposition: attachment)","Referrer-Policy: no-referrer","Strict-Transport-Security"],
  ok:1, why:"Sin nosniff, algunos navegadores «adivinan» que el contenido es HTML y lo ejecutan en tu origen."},
 {t:"vf", p:"HSTS protege también la primera visita de un usuario que nunca ha entrado en tu web, aunque tu dominio no esté en la lista de precarga.",
  ok:false, why:"Sin precarga, la primera petición puede ir por HTTP y ser interceptada. La lista de precarga (hstspreload.org) cierra ese hueco."},
 {t:"term", p:"Escribe el comando que muestra las cabeceras de https://tienda.com y filtra solo la de HSTS (sin distinguir mayúsculas)",
  sol:["curl -sI https://tienda.com | grep -i strict-transport-security","curl -I https://tienda.com | grep -i strict-transport-security","curl -sI https://tienda.com | grep -i strict","curl -s -I https://tienda.com | grep -i strict-transport-security","curl -Is https://tienda.com | grep -i strict-transport-security","curl -I -s https://tienda.com | grep -i strict-transport-security"],
  salida:"strict-transport-security: max-age=63072000; includeSubDomains; preload",
  pista:"curl -sI y una tubería a grep -i.",
  why:"Meter comprobaciones así en un test de humo después de cada despliegue evita que un cambio de proxy o CDN se lleve las cabeceras por delante."},
 {t:"codigo", p:"Cabeceras que faltan", lenguaje:"py",
  c:`<p>La entrada son las cabeceras de una respuesta, una por línea (<code>Nombre: valor</code>). Imprime, en este orden, las que falten de: <code>strict-transport-security</code>, <code>content-security-policy</code>, <code>x-content-type-options</code>, <code>referrer-policy</code> (en minúsculas, una por línea). Si además aparece <code>x-powered-by</code>, imprime al final <code>sobra x-powered-by</code>. Si todo está bien, <code>OK</code>.</p>`,
  plantilla:"import sys\n\nnombres = set()\nfor linea in sys.stdin:\n    if \":\" in linea:\n        pass  # guarda el nombre en minúsculas\n",
  pruebas:[
   {entrada:"Content-Type: text/html\nStrict-Transport-Security: max-age=63072000\nX-Powered-By: Express\n", salida:"content-security-policy\nx-content-type-options\nreferrer-policy\nsobra x-powered-by"},
   {entrada:"strict-transport-security: max-age=1\nCONTENT-SECURITY-POLICY: default-src 'self'\nX-Content-Type-Options: nosniff\nReferrer-Policy: no-referrer\n", salida:"OK", oculta:true}
  ],
  pista:"linea.split(\":\", 1)[0].strip().lower().",
  solucion:"import sys\n\nOBLIGATORIAS = [\"strict-transport-security\", \"content-security-policy\", \"x-content-type-options\", \"referrer-policy\"]\nnombres = set()\nfor linea in sys.stdin:\n    if \":\" in linea:\n        nombres.add(linea.split(\":\", 1)[0].strip().lower())\n\nsalida = [c for c in OBLIGATORIAS if c not in nombres]\nif \"x-powered-by\" in nombres:\n    salida.append(\"sobra x-powered-by\")\nprint(\"\\n\".join(salida) if salida else \"OK\")\n",
  why:"Los nombres de cabecera HTTP no distinguen mayúsculas: compararlos sin normalizar es un fallo típico de estas comprobaciones."}
]}

]});
