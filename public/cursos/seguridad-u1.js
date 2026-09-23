window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Fundamentos de seguridad",
resumen: "Confidencialidad, integridad y disponibilidad, riesgo, cómo confía la web (origen y sitio), el OWASP Top 10:2025 y las herramientas para ver una aplicación como la ve un atacante",
nivel: "Fundamentos",
color: "#f27a6d",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"sg1l1",
titulo:"Qué protegemos y de quién",
claves:["Tríada CIA: confidencialidad, integridad y disponibilidad","Amenaza, vulnerabilidad y riesgo no son lo mismo: riesgo = probabilidad × impacto","La superficie de ataque es todo lo que un atacante puede tocar, y conviene que sea pequeña"],
pasos:[
 {t:"info", eti:"Empezamos", h:"La tríada CIA",
  c:`<div class="dg"><div class="dg-tit">las tres propiedades que protege la seguridad</div>
       <div class="dg-fila">
         <div class="dg-caja acento doble">Confidencialidad<small>solo quien debe ve los datos</small></div>
         <div class="dg-caja acento doble">Integridad<small>nadie los cambia sin permiso</small></div>
         <div class="dg-caja acento doble">Disponibilidad<small>funciona cuando se necesita</small></div>
       </div></div>
     <ul><li>Una filtración de la base de clientes rompe la <b>confidencialidad</b>.</li>
     <li>Alguien que cambia el precio de un pedido rompe la <b>integridad</b>.</li>
     <li>Un ataque de denegación de servicio rompe la <b>disponibilidad</b>.</li></ul>
     <p>A la tríada se suelen añadir dos propiedades más: <b>autenticidad</b> (saber quién es quién) y <b>no repudio</b> (que nadie pueda negar lo que hizo, porque queda registrado). Cada control de este curso protege una o varias de ellas.</p>`},
 {t:"par", p:"Empareja cada incidente con la propiedad que rompe",
  pares:[["Se filtra la base de datos de clientes","Confidencialidad"],["Un atacante cambia el IBAN de las facturas","Integridad"],["La tienda cae por un ataque de denegación de servicio","Disponibilidad"],["Un usuario niega haber borrado un registro y no hay logs","No repudio"],["Alguien entra con la sesión robada de otro","Autenticidad"]],
  why:"Pensar en las propiedades evita olvidar dimensiones: el ransomware, por ejemplo, rompe la disponibilidad y, cuando además roba datos para extorsionar, la confidencialidad."},
 {t:"info", eti:"Vocabulario", h:"Amenaza, vulnerabilidad y riesgo",
  c:`<ul><li><b>Activo</b>: lo que tiene valor (datos de clientes, dinero, reputación, la propia disponibilidad).</li>
     <li><b>Vulnerabilidad</b>: un fallo explotable (una consulta SQL concatenada, un bucket público).</li>
     <li><b>Amenaza</b>: quién o qué podría explotarla (un bot que prueba contraseñas, un empleado descontento, un error humano).</li>
     <li><b>Riesgo</b>: probabilidad × impacto. Es lo que guía qué arreglar primero.</li>
     <li><b>Superficie de ataque</b>: endpoints, formularios, dependencias, puertos, paneles de administración, integraciones, personas...</li></ul>
     <div class="nota ojo"><b class="tit">La gravedad técnica no es el riesgo</b>Una vulnerabilidad «crítica» en un servicio sin acceso desde fuera puede importar menos que una «media» en el login público. El contexto (exposición, datos afectados, controles alrededor) cambia la prioridad.</div>`},
 {t:"opcion", p:"Tienes dos vulnerabilidades: una grave en un panel interno solo accesible por VPN, y una media en el login público. ¿Cómo priorizas?",
  ops:["Según el riesgo: probabilidad de explotación × impacto; el login público probablemente va primero","Siempre la de mayor gravedad técnica","Por orden de llegada del informe","La más fácil de arreglar, para cerrar tickets"],
  ok:0, why:"La exposición cambia mucho la probabilidad. Priorizar por la etiqueta de la herramienta y no por el riesgo real es un error clásico."},
 {t:"vf", p:"Reducir la superficie de ataque (quitar endpoints, puertos y dependencias innecesarias) mejora la seguridad aunque no arregles ninguna vulnerabilidad concreta.",
  ok:true, why:"Lo que no existe no se puede atacar. Por eso se eliminan endpoints de depuración, versiones viejas de la API y paquetes que ya no se usan."},
 {t:"opcion", p:"¿Cuál de estas cosas es una <b>amenaza</b> (y no una vulnerabilidad ni un activo)?",
  ops:["La tabla de tarjetas de los clientes","Un parámetro de la URL que se concatena en una consulta","Una red de bots que prueba contraseñas filtradas contra tu login","El certificado TLS de la web"],
  ok:2, why:"La amenaza es el agente o el suceso; la vulnerabilidad es el fallo que aprovecha; el activo es lo que pierdes."},
 {t:"codigo", p:"Prioriza hallazgos por riesgo", lenguaje:"py",
  c:`<p>Cada línea de la entrada es un hallazgo: <code>nombre probabilidad impacto</code> (ambos de 1 a 5). Imprime cada hallazgo como <code>nombre riesgo</code>, con riesgo = probabilidad × impacto, ordenados de mayor a menor riesgo. Si empatan, por nombre alfabético.</p>`,
  plantilla:"import sys\n\nhallazgos = []\nfor linea in sys.stdin:\n    if not linea.strip():\n        continue\n    nombre, prob, imp = linea.split()\n    # calcula el riesgo y guarda (nombre, riesgo)\n\n# ordena e imprime\n",
  pruebas:[
   {entrada:"sqli-login 4 5\nxss-perfil 3 3\npanel-vpn 1 5\n", salida:"sqli-login 20\nxss-perfil 9\npanel-vpn 5"},
   {entrada:"b 2 2\na 4 1\nc 5 5\n", salida:"c 25\na 4\nb 4", oculta:true}
  ],
  pista:"Ordena con una clave (-riesgo, nombre).",
  solucion:"import sys\n\nhallazgos = []\nfor linea in sys.stdin:\n    if not linea.strip():\n        continue\n    nombre, prob, imp = linea.split()\n    hallazgos.append((nombre, int(prob) * int(imp)))\n\nfor nombre, riesgo in sorted(hallazgos, key=lambda h: (-h[1], h[0])):\n    print(nombre, riesgo)\n",
  why:"Es la lógica que hay detrás de cualquier matriz de riesgos: no hace falta precisión científica, hace falta un orden defendible para decidir qué se arregla antes."}
]},

/* =============== U1 L2 =============== */
{
id:"sg1n1",
titulo:"Cómo confía la web: HTTP, origen y sitio",
claves:["El navegador aísla por origen: esquema + host + puerto (política del mismo origen)","«Sitio» es más amplio: esquema + dominio registrable; lo usan SameSite y el aislamiento entre sitios","Todo lo que llega en una petición HTTP lo controla el cliente: el servidor no puede fiarse de nada"],
pasos:[
 {t:"info", eti:"La regla básica", h:"La política del mismo origen",
  c:`<p>Un <b>origen</b> es la tupla <b>esquema + host + puerto</b>. La <b>política del mismo origen</b> (SOP) impide que el JavaScript de un origen <b>lea</b> las respuestas de otro. Es la base de casi todo lo que viene después: XSS la esquiva ejecutando código dentro de tu origen, CSRF la aprovecha porque enviar sí se puede (lo prohibido es leer) y CORS es la forma controlada de relajarla.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">¿mismo origen que https://tienda.com?</div><table class="dg-tabla"><thead><tr><th>URL</th><th>¿Mismo origen?</th><th>Por qué</th></tr></thead><tbody>
       <tr><td><code>https://tienda.com/carrito</code></td><td>sí</td><td>solo cambia la ruta</td></tr>
       <tr><td><code>http://tienda.com</code></td><td>no</td><td>cambia el esquema</td></tr>
       <tr><td><code>https://api.tienda.com</code></td><td>no</td><td>cambia el host</td></tr>
       <tr><td><code>https://tienda.com:8443</code></td><td>no</td><td>cambia el puerto</td></tr>
     </tbody></table></div>`},
 {t:"info", eti:"Más ancho que el origen", h:"Origen frente a sitio",
  c:`<p>Un <b>sitio</b> es esquema + <b>dominio registrable</b> (el dominio que compras, calculado con la Public Suffix List). <code>https://api.tienda.com</code> y <code>https://www.tienda.com</code> son <b>orígenes distintos</b> pero el <b>mismo sitio</b>. <code>tienda.github.io</code> y <code>otra.github.io</code> son sitios distintos, porque <code>github.io</code> está en esa lista.</p>
     <ul><li>La SOP y CORS trabajan con <b>orígenes</b>.</li>
     <li>Las cookies <code>SameSite</code> y la cabecera <code>Sec-Fetch-Site</code> trabajan con <b>sitios</b>.</li></ul>
     <div class="nota ojo"><b class="tit">Consecuencia práctica</b>Un subdominio comprometido (un blog viejo en <code>blog.tienda.com</code>) es «del mismo sitio»: SameSite no te protege de él. Los subdominios olvidados son superficie de ataque.</div>`},
 {t:"par", p:"Empareja cada par de URLs con su relación",
  pares:[["https://tienda.com/a y https://tienda.com/b","Mismo origen"],["https://www.tienda.com y https://api.tienda.com","Mismo sitio, distinto origen"],["https://tienda.com y https://tienda.es","Sitios distintos"],["http://tienda.com y https://tienda.com","Distinto esquema: ni mismo origen ni mismo sitio"]],
  why:"Los navegadores modernos incluyen el esquema en el concepto de sitio («schemeful same-site»), así que http y https no son el mismo sitio."},
 {t:"info", eti:"Nada es de fiar", h:"Lo que controla el cliente",
  c:`<p>En una petición HTTP <b>todo</b> lo elige quien la envía: método, ruta, parámetros, cuerpo, cookies y cabeceras como <code>User-Agent</code>, <code>Referer</code> o <code>X-Forwarded-For</code>. Con <code>curl</code> se fabrica cualquier petición sin pasar por tu frontend.</p>
     <div class="termbox">curl -X PUT https://api.tienda.com/usuarios/7 -H "Authorization: Bearer eyJ..." -H "X-Forwarded-For: 127.0.0.1" -d '{"nombre":"Ana","rol":"admin","precio":-10}'</div>
     <p>Esa petición prueba tres ideas malas a la vez: fiarse de <code>X-Forwarded-For</code> para decidir que viene «de dentro», aceptar un campo <code>rol</code> que el formulario no muestra y no validar rangos. La frontera de confianza está en el <b>servidor</b>: la validación del frontend es comodidad para el usuario, no seguridad.</p>`},
 {t:"opcion", p:"Tu API permite el panel de administración si <code>X-Forwarded-For</code> es una IP interna. ¿Qué problema hay?",
  ops:["Ninguno si el balanceador añade la cabecera","Que cualquiera puede enviar esa cabecera con el valor que quiera; solo vale la que añade tu propio proxy de confianza, y aun así la IP no debe ser la única barrera","Que la cabecera solo funciona con IPv4","Que es lenta"],
  ok:1, why:"Si el proxy añade la IP al final de la lista pero tu código lee la primera, lees la que escribió el atacante. Configura qué proxies son de confianza y autentica siempre."},
 {t:"vf", p:"La política del mismo origen impide que otra web <b>envíe</b> un formulario POST a tu dominio.",
  ok:false, why:"La SOP impide leer la respuesta, no enviar la petición. Precisamente por eso existe el CSRF y hacen falta defensas específicas."},
 {t:"codigo", p:"¿Mismo origen?", lenguaje:"py",
  c:`<p>Lee dos URLs (una por línea) e imprime <code>mismo origen</code> o <code>distinto origen</code>. Recuerda: el host no distingue mayúsculas y el puerto por defecto es 80 para <code>http</code> y 443 para <code>https</code>.</p>`,
  plantilla:"from urllib.parse import urlsplit\n\na = input().strip()\nb = input().strip()\n# compara esquema, host y puerto\n",
  pruebas:[
   {entrada:"https://tienda.com/a\nhttps://tienda.com:443/b\n", salida:"mismo origen"},
   {entrada:"https://tienda.com\nhttp://tienda.com\n", salida:"distinto origen"},
   {entrada:"https://TIENDA.com/x\nhttps://tienda.com/y?z=1\n", salida:"mismo origen", oculta:true},
   {entrada:"https://api.tienda.com\nhttps://tienda.com\n", salida:"distinto origen", oculta:true}
  ],
  pista:"urlsplit(u).hostname ya viene en minúsculas; urlsplit(u).port es None si no se indica.",
  solucion:"from urllib.parse import urlsplit\n\ndef origen(u):\n    p = urlsplit(u)\n    puerto = p.port or {\"http\": 80, \"https\": 443}[p.scheme]\n    return (p.scheme, p.hostname, puerto)\n\na = input().strip()\nb = input().strip()\nprint(\"mismo origen\" if origen(a) == origen(b) else \"distinto origen\")\n",
  why:"Comparar orígenes con cadenas (startsWith, contains) es fuente de fallos: https://tienda.com.malo.net empieza por https://tienda.com. Se compara la tupla ya parseada."}
]},

/* =============== U1 L3 =============== */
{
id:"sg1l3",
titulo:"OWASP Top 10:2025",
claves:["OWASP publica los riesgos más críticos de las aplicaciones web; la edición vigente es la de 2025","Control de acceso roto sigue en cabeza y absorbe SSRF; la cadena de suministro sube al tercer puesto","Es una lista de concienciación, no un estándar de verificación: para requisitos se usa OWASP ASVS"],
pasos:[
 {t:"info", eti:"La referencia", h:"OWASP Top 10:2025",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">owasp top 10, edición 2025</div><table class="dg-tabla"><tbody>
       <tr><td>A01</td><td>Control de acceso roto <small>(ver o tocar lo ajeno; incluye SSRF)</small></td></tr>
       <tr><td>A02</td><td>Configuración de seguridad incorrecta</td></tr>
       <tr><td>A03</td><td>Fallos en la cadena de suministro de software <small>(dependencias, CI/CD, artefactos)</small></td></tr>
       <tr><td>A04</td><td>Fallos criptográficos</td></tr>
       <tr><td>A05</td><td>Inyección <small>(SQL, comandos, XSS...)</small></td></tr>
       <tr><td>A06</td><td>Diseño inseguro</td></tr>
       <tr><td>A07</td><td>Fallos de autenticación</td></tr>
       <tr><td>A08</td><td>Fallos de integridad de software o datos</td></tr>
       <tr><td>A09</td><td>Fallos de registro y alertas</td></tr>
       <tr><td>A10</td><td>Mala gestión de condiciones excepcionales <small>(errores que dejan la puerta abierta)</small></td></tr>
     </tbody></table></div>
     <p>Frente a la edición de 2021: SSRF deja de ser categoría propia y entra en A01, «componentes vulnerables» se amplía a toda la <b>cadena de suministro</b> y aparece A10, sobre fallar de forma insegura ante errores.</p>`},
 {t:"par", p:"Empareja cada ejemplo con su categoría del Top 10:2025",
  pares:[["Ver el pedido de otro cambiando el id en la URL","A01 Control de acceso roto"],["Consulta SQL construida concatenando texto","A05 Inyección"],["Un paquete npm secuestrado entra en tu build","A03 Cadena de suministro"],["Panel de administración con la contraseña por defecto","A02 Configuración incorrecta"],["Nadie detecta un ataque durante meses","A09 Registro y alertas"],["Si falla el servicio de permisos, la API deja pasar","A10 Condiciones excepcionales"]],
  why:"Saber nombrar la categoría ayuda a hablar con equipos de seguridad y a buscar la guía de defensa adecuada."},
 {t:"vf", p:"La inyección es el riesgo número uno del OWASP Top 10:2025.",
  ok:false, why:"El primero sigue siendo el control de acceso roto. La inyección baja al quinto puesto: los frameworks modernos la han hecho menos frecuente, aunque sigue siendo muy grave cuando aparece."},
 {t:"info", eti:"Cómo usarlo", h:"Lista, estándar y guías",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué documento de owasp usar para qué</div><table class="dg-tabla"><thead><tr><th>Documento</th><th>Para qué sirve</th></tr></thead><tbody>
       <tr><td>Top 10</td><td>Concienciación: los riesgos más frecuentes e importantes. No es una checklist completa.</td></tr>
       <tr><td>API Security Top 10</td><td>Lo mismo, centrado en APIs (BOLA, consumo sin límites...).</td></tr>
       <tr><td>ASVS</td><td>Estándar de verificación: requisitos concretos y comprobables por niveles (L1, L2, L3).</td></tr>
       <tr><td>Cheat Sheet Series</td><td>Guías prácticas de defensa: contraseñas, sesiones, XSS, CSP...</td></tr>
       <tr><td>WSTG</td><td>Guía de pruebas: cómo comprobar cada control.</td></tr>
     </tbody></table></div>
     <p>Decir «cumplimos el Top 10» no significa nada verificable. Decir «cumplimos ASVS nivel 2» sí.</p>`},
 {t:"opcion", p:"Tu empresa quiere un criterio concreto y comprobable para decidir si una aplicación es «suficientemente segura» antes de salir a producción. ¿Qué documento usarías?",
  ops:["El OWASP Top 10","OWASP ASVS, eligiendo el nivel según el riesgo de la aplicación","La lista de CVE del año","Un escaneo automático sin más"],
  ok:1, why:"El Top 10 es para concienciar; ASVS tiene requisitos numerados que se pueden verificar uno a uno y convertir en criterios de aceptación."},
 {t:"opcion", p:"Tu API devuelve un 500 con la traza completa y, en otro endpoint, una excepción no controlada deja una transacción a medias que regala saldo. ¿En qué categoría nueva del 2025 encaja mejor lo segundo?",
  ops:["A04 Fallos criptográficos","A07 Fallos de autenticación","A10 Mala gestión de condiciones excepcionales","A08 Integridad de datos"],
  ok:2, why:"A10 cubre lo que pasa cuando algo falla: errores sin capturar, estados a medias, fallar abierto. La traza en la respuesta es además configuración incorrecta (A02)."},
 {t:"escribe", p:"¿Qué categoría del OWASP Top 10:2025 ocupa el primer puesto? (en español)",
  sol:["control de acceso roto","control de acceso","broken access control","a01"],
  pista:"Ver o modificar lo que no es tuyo.",
  why:"Lleva en cabeza desde 2021: los frameworks resuelven bien la inyección, pero la autorización depende de la lógica de cada aplicación y nadie la genera por ti."}
]},

/* =============== U1 L4 =============== */
{
id:"sg1l4",
titulo:"Las herramientas del oficio",
claves:["DevTools del navegador: peticiones, cabeceras, cookies y almacenamiento","Proxies de interceptación (OWASP ZAP, Burp Suite) y curl para repetir y modificar tráfico","Solo contra sistemas propios o con autorización expresa, y en laboratorios legales"],
pasos:[
 {t:"info", eti:"Ver lo que viaja", h:"Inspeccionar una aplicación",
  c:`<ul><li><b>DevTools → Network</b>: cada petición con su método, cabeceras, cuerpo, cookies y respuesta. Clic derecho → <i>Copy as cURL</i> para repetirla cambiando datos.</li>
     <li><b>DevTools → Application</b>: cookies (¿HttpOnly? ¿Secure? ¿SameSite?), localStorage, sessionStorage, IndexedDB y service workers.</li>
     <li><b>DevTools → Console</b>: los errores de CSP y CORS aparecen aquí con el motivo exacto.</li>
     <li><b>OWASP ZAP</b> (libre) o <b>Burp Suite</b>: proxy entre el navegador y el servidor; interceptan, modifican, repiten peticiones y lanzan escaneos.</li>
     <li>Laboratorios legales: <b>PortSwigger Web Security Academy</b>, <b>OWASP Juice Shop</b>, <b>DVWA</b>.</li></ul>
     <div class="nota ojo"><b class="tit">Legalidad</b>Probar sistemas ajenos sin permiso por escrito es delito en la mayoría de países (en España, el acceso ilícito a sistemas del Código Penal), aunque «no rompas nada». Todo lo de este curso se practica contra tus aplicaciones o laboratorios pensados para ello.</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["Pestaña Network","Ver y copiar las peticiones que hace la página"],["Pestaña Application","Revisar cookies y almacenamiento local"],["OWASP ZAP","Proxy libre para interceptar y escanear"],["curl","Repetir una petición modificando parámetros"],["OWASP Juice Shop","Aplicación vulnerable a propósito para practicar"]],
  why:"Ver la aplicación como la ve un atacante es la mejor forma de aprender a defenderla."},
 {t:"info", eti:"Probar autorización", h:"El truco de los dos usuarios",
  c:`<p>La prueba de seguridad más rentable que existe: crea dos usuarios de prueba, <b>A</b> y <b>B</b>. Con A, recorre la aplicación y copia sus peticiones. Repítelas con el token o la cookie de B.</p>
     <div class="termbox"># token del usuario B, pedido del usuario A
curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN_B" https://localhost:8443/api/pedidos/1042
404</div>
     <p>Si B recibe 200 con los datos de A, tienes un control de acceso roto. Extensiones de Burp como <i>Autorize</i> o los contextos de ZAP automatizan exactamente esto para cada petición.</p>`},
 {t:"opcion", p:"Quieres comprobar si tu API permite ver pedidos ajenos. ¿Cómo lo haces?",
  ops:["Probar contra la tienda de otra empresa para comparar","Mirando si el botón aparece en la interfaz","Con dos usuarios de prueba en tu entorno: copiar la petición del usuario A y repetirla con el token del usuario B","No se puede comprobar sin el código fuente"],
  ok:2, why:"Es exactamente lo que automatizan las pruebas de autorización en CI."},
 {t:"term", p:"Escribe el comando curl que muestra solo las cabeceras de respuesta de https://localhost:8443/",
  sol:["curl -I https://localhost:8443/","curl --head https://localhost:8443/","curl -sI https://localhost:8443/","curl -I -s https://localhost:8443/","curl -s -I https://localhost:8443/","curl -Is https://localhost:8443/"],
  salida:"HTTP/2 200\ncontent-type: text/html; charset=utf-8\nstrict-transport-security: max-age=63072000; includeSubDomains\ncontent-security-policy: default-src 'self'\nx-content-type-options: nosniff",
  pista:"La opción que hace una petición HEAD.",
  why:"Es la forma más rápida de revisar cabeceras de seguridad y cookies (Set-Cookie) sin abrir el navegador."},
 {t:"vf", p:"Escanear con ZAP la web de una empresa sin su permiso es legal si no rompes nada.",
  ok:false, why:"Sin autorización expresa es ilegal. Muchas empresas tienen programas de bug bounty con reglas y alcance: solo dentro de ese alcance estás autorizado."},
 {t:"opcion", p:"Encuentras por casualidad un fallo grave en la web de otra empresa. ¿Qué es lo correcto?",
  ops:["Publicarlo en redes para presionar","Explotarlo un poco más para demostrar el impacto","Buscar su política de divulgación (security.txt, programa de bug bounty) y avisar de forma privada, sin seguir explorando","Venderlo"],
  ok:2, why:"Divulgación responsable: aviso privado, plazo razonable para corregir y nada de acceder a datos. El fichero /.well-known/security.txt indica a quién escribir."}
]}

]});
