window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Inyección, XSS y CSRF",
resumen: "Inyección SQL y de comandos, XSS almacenado, reflejado y en el DOM, Content-Security-Policy, CSRF y clickjacking",
nivel: "Intermedio",
color: "#ea6d60",
lecciones: [

{
id:"sg2l1",
titulo:"Inyección SQL y de comandos",
claves:["Inyección: datos del usuario interpretados como código","Defensa principal: consultas parametrizadas y APIs sin shell","Validación de entrada y mínimo privilegio como capas extra"],
pasos:[
 {t:"info", eti:"El clásico", h:"Cómo funciona una inyección SQL",
  c:`<div class="termbox">// codigo vulnerable
String sql = "SELECT * FROM usuarios WHERE email = '" + email + "' AND clave = '" + clave + "'";

// el atacante escribe como email:   ' OR '1'='1' --
SELECT * FROM usuarios WHERE email = '' OR '1'='1' --' AND clave = '...'
// la condicion siempre es cierta y el resto queda comentado: entra sin contrasena</div>
     <div class="termbox">// seguro: el valor viaja separado del SQL
PreparedStatement ps = con.prepareStatement("SELECT * FROM usuarios WHERE email = ?");
ps.setString(1, email);</div>
     <p>Lo mismo aplica a comandos del sistema: <code>Runtime.exec("ping " + host)</code> con host = <code>8.8.8.8; cat /etc/passwd</code>. Usa listas de argumentos sin shell y valida contra una lista permitida.</p>`},
 {t:"par", p:"Empareja cada tipo de inyección con su defensa",
  pares:[["SQL","Consultas parametrizadas u ORM sin concatenar"],["Comandos del sistema","Evitar la shell, argumentos separados y lista permitida"],["NoSQL (MongoDB)","Validar tipos: no aceptar objetos donde se espera un texto"],["Plantillas del servidor","No construir plantillas con datos del usuario"],["LDAP","Escapar los valores con las funciones de la librería"]],
  why:"El patrón es siempre el mismo: separar código y datos."},
 {t:"opcion", p:"¿Por qué escapar comillas a mano no es una buena defensa contra la inyección SQL?",
  ops:["Sí lo es","Es fácil equivocarse (codificaciones, contextos, números sin comillas); los parámetros resuelven el problema de raíz","Porque es lento","Porque los ORMs lo prohíben"],
  ok:1, why:"Con parámetros, el motor nunca interpreta el valor como SQL."},
 {t:"vf", p:"Usar un ORM como Hibernate hace imposible la inyección SQL en cualquier caso.",
  ok:false, why:"Si construyes JPQL o SQL nativo concatenando texto, sigues siendo vulnerable."}
]},

{
id:"sg2l2",
titulo:"Cross-Site Scripting (XSS)",
claves:["XSS: inyectar JavaScript que se ejecuta en el navegador de otros usuarios","Almacenado, reflejado y basado en el DOM","Escapar la salida según el contexto, frameworks que escapan por defecto y CSP"],
pasos:[
 {t:"info", eti:"JavaScript ajeno", h:"Tipos de XSS",
  c:`<ul><li><b>Almacenado</b>: el atacante guarda un comentario con <code>&lt;script&gt;</code>; se ejecuta para todos los que lo ven.</li>
     <li><b>Reflejado</b>: la carga viaja en la URL (<code>?q=&lt;script&gt;...</code>) y la página la devuelve sin escapar.</li>
     <li><b>DOM</b>: el propio JavaScript de la página mete datos de la URL en <code>innerHTML</code>.</li></ul>
     <p>Con XSS, el atacante actúa como la víctima: lee datos de la página, hace peticiones en su nombre o roba tokens accesibles a JavaScript.</p>`},
 {t:"info", eti:"Defensas", h:"Escapar y restringir",
  c:`<ul><li><b>Escapar la salida</b> según el contexto (HTML, atributo, JavaScript, URL). React, Angular y Thymeleaf lo hacen por defecto; los peligros son <code>dangerouslySetInnerHTML</code>, <code>innerHTML</code> y <code>th:utext</code>.</li>
     <li><b>Sanear</b> con DOMPurify si de verdad necesitas HTML de usuarios.</li>
     <li><b>Content-Security-Policy</b>: el navegador solo ejecuta scripts de orígenes permitidos.</li>
     <li>Cookies de sesión <b>HttpOnly</b>: el script inyectado no puede leerlas.</li></ul>
     <div class="termbox">Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'</div>`},
 {t:"par", p:"Empareja cada escenario con el tipo de XSS",
  pares:[["Un comentario del foro con un script que se ejecuta a cada visitante","Almacenado"],["Un enlace con el script en el parámetro de búsqueda","Reflejado"],["El JavaScript de la página copia location.hash en innerHTML","Basado en el DOM"]],
  why:"Los tres se previenen igual: nunca tratar datos como código."},
 {t:"opcion", p:"¿Qué aporta una Content-Security-Policy estricta si ya escapas la salida?",
  ops:["Nada","Una segunda capa: si se cuela un XSS, el navegador bloquea scripts en línea y de orígenes no permitidos","Cifra la página","Acelera la carga"],
  ok:1, why:"Defensa en profundidad aplicada al navegador."}
]},

{
id:"sg2l3",
titulo:"CSRF y clickjacking",
claves:["CSRF: otra web hace que el navegador de la víctima envíe una petición con sus cookies","Defensas: SameSite, tokens anti-CSRF y no usar GET para cambios","Clickjacking: tu web dentro de un iframe invisible; se evita con frame-ancestors"],
pasos:[
 {t:"info", eti:"Peticiones en tu nombre", h:"Cross-Site Request Forgery",
  c:`<div class="termbox">&lt;!-- en web-maliciosa.com, visitada por alguien con sesion abierta en tu banco --&gt;
&lt;form action="https://banco.com/transferir" method="POST"&gt;
  &lt;input name="iban" value="ES00ATACANTE..."&gt;
  &lt;input name="importe" value="1000"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</div>
     <p>El navegador adjunta la cookie de sesión del banco automáticamente. Defensas:</p>
     <ul><li>Cookies <b>SameSite=Lax</b> o <b>Strict</b>: no se envían en peticiones iniciadas desde otros sitios.</li>
     <li><b>Tokens anti-CSRF</b> en formularios con sesión por cookie.</li>
     <li>Las APIs con token en la cabecera <code>Authorization</code> no son vulnerables (el navegador no la añade solo).</li>
     <li>Nunca cambiar estado con GET.</li></ul>`},
 {t:"par", p:"Empareja cada ataque con su defensa principal",
  pares:[["CSRF","Cookies SameSite y tokens anti-CSRF"],["Clickjacking","frame-ancestors en CSP (o X-Frame-Options)"],["XSS","Escapar la salida y CSP"],["Robo de cookie de sesión por script","Atributo HttpOnly"]],
  why:"Por eso Spring Security desactiva CSRF solo en APIs sin estado con tokens."},
 {t:"opcion", p:"Tu API usa JWT en la cabecera Authorization, sin cookies. ¿Es vulnerable a CSRF?",
  ops:["Sí, siempre","No en esencia: otra web no puede hacer que el navegador añada esa cabecera por sí solo","Solo con GET","Solo en móviles"],
  ok:1, why:"El CSRF explota que el navegador añade las cookies automáticamente."}
]},

{
id:"sg2l4",
titulo:"Validar la entrada y codificar la salida",
claves:["Validar la entrada: tipo, longitud, formato y listas permitidas","Codificar la salida según el contexto donde se inserta","Canonicalizar antes de validar (rutas, Unicode, mayúsculas)"],
pasos:[
 {t:"info", eti:"Las dos reglas", h:"Entrada y salida",
  c:`<p><b>Validar la entrada</b> reduce lo que puede llegar: un id es un número positivo, un email tiene formato de email, un estado es uno de una lista. Mejor <b>listas permitidas</b> que listas prohibidas (es imposible enumerar todo lo malo).</p>
     <p><b>Codificar la salida</b> impide que lo que llega se interprete como código en el sitio donde se inserta:</p>
     <div class="diag">contexto            codificacion                 ejemplo
HTML                &amp;lt; &amp;gt; &amp;amp; &amp;quot;      textContent, plantillas que escapan
atributo HTML       comillas y codificacion      value="..."
URL                 encodeURIComponent           ?q=...
SQL                 parametros                   WHERE email = ?
shell               argumentos separados         execFile("git", [rama])</div>`},
 {t:"par", p:"Empareja cada entrada con su validación adecuada",
  pares:[["Id de pedido","Entero positivo"],["Estado del pedido","Uno de una lista cerrada de valores"],["Nombre de fichero para descargar","Normalizar la ruta y comprobar que queda dentro de la carpeta"],["Campo de ordenación ?sort=","Lista permitida de columnas (nunca directo al SQL)"],["Texto libre de un comentario","Longitud máxima y codificar al mostrar"]],
  why:"ORDER BY no admite parámetros en la mayoría de drivers: por eso se usa una lista de columnas permitidas."},
 {t:"opcion", p:"¿Por qué una lista prohibida (bloquear «&lt;script&gt;») no protege contra XSS?",
  ops:["Sí protege","Hay infinitas variantes (mayúsculas, eventos como onerror, codificaciones) que la saltan; la defensa es codificar la salida","Porque es lenta","Porque no existe"],
  ok:1, why:"Los filtros de palabras prohibidas siempre se acaban saltando."}
]}

]});
