window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Fundamentos de seguridad",
resumen: "Confidencialidad, integridad y disponibilidad, amenazas y superficie de ataque, principios de diseño seguro y el OWASP Top 10",
nivel: "Fundamentos",
color: "#f27a6d",
lecciones: [

{
id:"sg1l1",
titulo:"Qué protegemos y de quién",
claves:["Tríada CIA: confidencialidad, integridad y disponibilidad","Amenaza, vulnerabilidad y riesgo no son lo mismo","La superficie de ataque es todo lo que un atacante puede tocar"],
pasos:[
 {t:"info", eti:"Empezamos", h:"La tríada CIA",
  c:`<ul><li><b>Confidencialidad</b>: solo quien debe puede ver los datos (una filtración de datos de clientes la rompe).</li>
     <li><b>Integridad</b>: los datos no se modifican sin autorización (alguien cambia el precio de un pedido).</li>
     <li><b>Disponibilidad</b>: el sistema funciona cuando se necesita (un ataque DDoS la rompe).</li></ul>
     <p>Cada medida de seguridad protege una o varias de estas propiedades.</p>`},
 {t:"par", p:"Empareja cada incidente con la propiedad que rompe",
  pares:[["Se filtra la base de datos de clientes","Confidencialidad"],["Un atacante cambia el IBAN de las facturas","Integridad"],["La tienda cae por un ataque de denegación de servicio","Disponibilidad"],["Ransomware cifra los servidores","Disponibilidad (y a menudo confidencialidad)"]],
  why:"Pensar en la tríada ayuda a no olvidar ninguna dimensión."},
 {t:"info", eti:"Vocabulario", h:"Amenaza, vulnerabilidad y riesgo",
  c:`<ul><li><b>Vulnerabilidad</b>: un fallo explotable (una consulta SQL concatenada).</li>
     <li><b>Amenaza</b>: quién o qué podría explotarlo (un atacante, un bot, un empleado descontento).</li>
     <li><b>Riesgo</b>: probabilidad × impacto. Guía qué arreglar primero.</li>
     <li><b>Superficie de ataque</b>: endpoints, formularios, dependencias, puertos abiertos, paneles de administración, personas...</li></ul>`},
 {t:"opcion", p:"Tienes dos vulnerabilidades: una grave en un panel interno solo accesible por VPN, y una media en el login público. ¿Cómo priorizas?",
  ops:["Siempre la de mayor gravedad técnica","Según el riesgo: probabilidad de explotación × impacto; el login público probablemente va primero","Por orden alfabético","La más fácil de arreglar"],
  ok:1, why:"La exposición cambia mucho la probabilidad."},
 {t:"vf", p:"Reducir la superficie de ataque (quitar endpoints, puertos y dependencias innecesarias) mejora la seguridad.",
  ok:true, why:"Lo que no existe no se puede atacar."}
]},

{
id:"sg1l2",
titulo:"Principios de diseño seguro",
claves:["Mínimo privilegio y defensa en profundidad","Seguro por defecto y fallar de forma segura","No confiar nunca en la entrada ni en el cliente"],
pasos:[
 {t:"info", eti:"Cómo pensar", h:"Principios",
  c:`<ul><li><b>Mínimo privilegio</b>: cada usuario, servicio y proceso con los permisos justos.</li>
     <li><b>Defensa en profundidad</b>: varias capas; si una falla, las demás contienen el daño.</li>
     <li><b>Seguro por defecto</b>: lo nuevo nace cerrado (buckets privados, endpoints autenticados).</li>
     <li><b>Fallar de forma segura</b>: ante un error, denegar, no permitir.</li>
     <li><b>No confiar en la entrada</b>: todo lo que viene de fuera (usuarios, APIs, ficheros, cabeceras) se valida.</li>
     <li><b>Simplicidad</b>: lo complejo esconde fallos.</li></ul>`},
 {t:"par", p:"Empareja cada práctica con el principio que aplica",
  pares:[["Rol de IAM con solo s3:GetObject sobre un bucket","Mínimo privilegio"],["WAF + validación + consultas parametrizadas","Defensa en profundidad"],["Endpoints nuevos protegidos salvo que se abran explícitamente","Seguro por defecto"],["Si el servicio de permisos no responde, se deniega","Fallar de forma segura"],["Validar en el servidor aunque el frontend ya valide","No confiar en el cliente"]],
  why:"Estos principios aparecen en todo el curso aplicados a casos concretos."},
 {t:"opcion", p:"El servicio que comprueba permisos da timeout. ¿Qué debe hacer tu API?",
  ops:["Permitir la acción para no molestar al usuario","Denegarla (fallar de forma segura) y registrar el error","Reintentar indefinidamente","Ignorarlo"],
  ok:1, why:"Fail open convierte una caída en un agujero de seguridad."}
]},

{
id:"sg1l3",
titulo:"OWASP Top 10",
claves:["OWASP publica los riesgos más críticos de las aplicaciones web","Control de acceso roto encabeza la lista","También existe el OWASP API Security Top 10"],
pasos:[
 {t:"info", eti:"La referencia", h:"OWASP Top 10 (2021)",
  c:`<div class="diag">A01 Control de acceso roto              (ver datos o acciones de otros)
A02 Fallos criptograficos                (datos sin cifrar, algoritmos debiles)
A03 Inyeccion                            (SQL, comandos, XSS)
A04 Diseno inseguro
A05 Configuracion de seguridad incorrecta
A06 Componentes vulnerables y obsoletos
A07 Fallos de identificacion y autenticacion
A08 Fallos de integridad de software y datos (cadena de suministro)
A09 Fallos de registro y monitorizacion
A10 Server-Side Request Forgery (SSRF)</div>
     <p>Cada unidad de este curso recorre estas categorías con ejemplos y defensas concretas.</p>`},
 {t:"par", p:"Empareja cada ejemplo con su categoría del OWASP Top 10",
  pares:[["Ver el pedido de otro cambiando el id en la URL","Control de acceso roto"],["Consulta SQL construida concatenando texto","Inyección"],["Librería con una vulnerabilidad conocida sin actualizar","Componentes vulnerables"],["Panel de administración con la contraseña por defecto","Configuración incorrecta"],["Nadie detecta un ataque durante meses","Fallos de registro y monitorización"]],
  why:"Saber nombrar la categoría ayuda a comunicarse con equipos de seguridad."},
 {t:"vf", p:"La inyección SQL es el riesgo número uno del OWASP Top 10 2021.",
  ok:false, why:"El primero es el control de acceso roto; la inyección está en el tercer puesto."}
]},

{
id:"sg1l4",
titulo:"Las herramientas del oficio",
claves:["DevTools del navegador: ver peticiones, cabeceras, cookies y almacenamiento","Proxies de interceptación (OWASP ZAP, Burp Suite) para inspeccionar y modificar tráfico","Solo contra sistemas propios o con autorización expresa, y en laboratorios legales"],
pasos:[
 {t:"info", eti:"Ver lo que viaja", h:"Inspeccionar una aplicación",
  c:`<ul><li><b>DevTools → Network</b>: cada petición con su método, cabeceras, cuerpo, cookies y respuesta. Puedes copiarla como <code>curl</code> y repetirla cambiando datos.</li>
     <li><b>DevTools → Application</b>: cookies (¿HttpOnly? ¿Secure? ¿SameSite?), localStorage y service workers.</li>
     <li><b>OWASP ZAP</b> o <b>Burp Suite</b>: se colocan entre el navegador y el servidor, permiten interceptar y modificar peticiones y lanzar escaneos automáticos.</li>
     <li>Laboratorios legales: <b>PortSwigger Web Security Academy</b>, <b>OWASP Juice Shop</b>, <b>DVWA</b>.</li></ul>
     <p>Probar sistemas ajenos sin permiso es ilegal. Todo lo de este curso se practica contra tus aplicaciones o laboratorios pensados para ello.</p>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["Pestaña Network","Ver y copiar las peticiones que hace la página"],["Pestaña Application","Revisar cookies y almacenamiento local"],["OWASP ZAP","Proxy libre para interceptar y escanear"],["curl","Repetir una petición modificando parámetros"],["OWASP Juice Shop","Aplicación vulnerable a propósito para practicar"]],
  why:"Ver la aplicación como la ve un atacante es la mejor forma de aprender a defenderla."},
 {t:"opcion", p:"Quieres comprobar si tu API permite ver pedidos ajenos. ¿Cómo lo haces?",
  ops:["Probar contra la tienda de otra empresa","Con dos usuarios de prueba en tu entorno: copiar la petición del usuario A y repetirla con el token del usuario B","Preguntando en un foro","No se puede comprobar"],
  ok:1, why:"Es exactamente lo que hacen las pruebas de autorización automatizadas."},
 {t:"vf", p:"Escanear con ZAP la web de una empresa sin su permiso es legal si no rompes nada.",
  ok:false, why:"Sin autorización expresa es ilegal en la mayoría de países. Usa tus sistemas o laboratorios."}
]}

]});
