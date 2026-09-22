window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Maestría: incidentes y entrevista",
resumen: "Responder a un incidente de seguridad, revisar código con ojos de atacante y simulacro de entrevista",
nivel: "Maestro",
color: "#c9483d",
lecciones: [

{
id:"sg7l1",
titulo:"Respuesta a incidentes y revisión de código",
claves:["Fases: preparar, detectar, contener, erradicar, recuperar y aprender","Contener primero: rotar credenciales, aislar sistemas, preservar evidencias","Revisar código buscando entradas no validadas, autorización y secretos"],
pasos:[
 {t:"orden", p:"Ordena las fases de respuesta a un incidente",
  items:["Preparación (planes, contactos, logs disponibles)","Detección y análisis","Contención (limitar el daño)","Erradicación (eliminar la causa)","Recuperación (volver a la normalidad)","Lecciones aprendidas (postmortem)"],
  why:"El marco del NIST: tenerlo preparado antes del incidente marca la diferencia."},
 {t:"opcion", p:"GuardDuty avisa de que una clave de acceso de CI se está usando desde un país desconocido. ¿Primer paso?",
  ops:["Esperar a ver qué hace","Contener: desactivar y rotar esa clave de inmediato, y después investigar en CloudTrail qué hizo","Borrar los logs","Avisar a los clientes antes de nada"],
  ok:1, why:"Contener primero; preservar evidencias (no borrar logs) para entender el alcance."},
 {t:"opcion", p:"Revisando un PR ves: <code>repo.findById(id)</code> en <code>GET /api/facturas/{id}</code>, sin más comprobaciones. ¿Qué comentas?",
  ops:["Aprobado","Falta autorización por objeto: cualquiera autenticado vería facturas ajenas. Filtrar por el cliente autenticado","Cambiar a POST","Añadir caché"],
  ok:1, why:"IDOR: el fallo más frecuente y más fácil de detectar en una revisión."},
 {t:"par", p:"Empareja cada señal en una revisión de código con el riesgo",
  pares:[["Concatenar texto en una consulta","Inyección"],["innerHTML con datos del usuario","XSS"],["Buscar por id sin comprobar el propietario","IDOR"],["Una URL del usuario que el servidor descarga","SSRF"],["Una clave API escrita en el código","Filtración de secretos"]],
  why:"Estas cinco señales cubren una gran parte de las vulnerabilidades reales."}
]},

{
id:"sg7l2",
titulo:"Simulacro de entrevista de seguridad",
claves:["Sabes explicar las vulnerabilidades del OWASP Top 10 y sus defensas","Aplicas mínimo privilegio y defensa en profundidad","Sabes integrar la seguridad en el desarrollo y la operación"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Cómo previenes la inyección SQL?»",
  ops:["Escapando comillas","Consultas parametrizadas u ORM sin concatenar, validación de entrada y un usuario de base de datos con mínimos permisos","Con un WAF únicamente","Ocultando los errores"],
  ok:1, why:"Parametrizar es la defensa; lo demás son capas adicionales."},
 {t:"opcion", p:"«¿Diferencia entre XSS y CSRF?»",
  ops:["Son lo mismo","XSS inyecta código que se ejecuta en el navegador de la víctima en tu web; CSRF hace que el navegador de la víctima envíe una petición a tu web desde otra, aprovechando sus cookies","CSRF es del servidor","XSS solo afecta a formularios"],
  ok:1, why:"Defensas: escapar y CSP para XSS; SameSite y tokens para CSRF."},
 {t:"opcion", p:"«¿Dónde guardarías el token de sesión en una aplicación web?»",
  ops:["En localStorage siempre","En una cookie HttpOnly, Secure y SameSite, para que un XSS no pueda leerlo; si es una API con JWT, tokens de corta duración","En la URL","En un campo oculto"],
  ok:1, why:"Menciona el equilibrio entre CSRF (cookies) y XSS (localStorage)."},
 {t:"opcion", p:"«¿Cómo gestionas los secretos de una aplicación en producción?»",
  ops:["En el repositorio cifrados con base64","En un gestor de secretos, inyectados en ejecución, con rotación, acceso mínimo, detección de fugas en el CI y credenciales temporales donde sea posible","En variables del Dockerfile","En un Excel compartido"],
  ok:1, why:"Base64 no es cifrado: cualquiera lo decodifica."},
 {t:"opcion", p:"«¿Qué es el principio de mínimo privilegio y dónde lo aplicas?»",
  ops:["Dar pocos privilegios a los jefes","Cada identidad con los permisos justos para su tarea: usuarios de base de datos, roles de IAM, ServiceAccounts de Kubernetes, contenedores sin root, tokens con alcance limitado","Solo en Linux","No compartir contraseñas"],
  ok:1, why:"Conecta todos los cursos: Linux, Docker, Kubernetes, AWS y Spring."},
 {t:"info", eti:"Terminado", h:"Has completado Seguridad web",
  c:`<p>Dominas los fundamentos y principios de diseño seguro, inyección, XSS y CSRF, autenticación, sesiones, OAuth y control de acceso, criptografía aplicada, SSRF y otros ataques, secretos, cadena de suministro, DevSecOps y respuesta a incidentes.</p>
     <p>Para consolidarlo: pasa OWASP ZAP contra tu API de tareas en local, añade Trivy, gitleaks y Semgrep a su pipeline, y practica en laboratorios legales como PortSwigger Web Security Academy u OWASP Juice Shop.</p>`}
]},

{
id:"sg7l3",
titulo:"Privacidad y datos personales",
claves:["El RGPD protege los datos personales de las personas en la UE","Minimización: recoger solo lo necesario y conservarlo el tiempo justo","Derechos de acceso y borrado, registro de tratamientos y notificación de brechas en 72 horas"],
pasos:[
 {t:"info", eti:"Más allá de la técnica", h:"Privacidad por diseño",
  c:`<ul><li><b>Minimización</b>: si no necesitas la fecha de nacimiento, no la pidas.</li>
     <li><b>Retención</b>: borra o anonimiza lo que ya no hace falta (los logs también contienen datos personales).</li>
     <li><b>Seudonimización y cifrado</b> de datos sensibles.</li>
     <li><b>Derechos</b>: el usuario puede pedir sus datos (acceso) y su eliminación: diseña para poder cumplirlo.</li>
     <li><b>Brechas</b>: en la UE, notificar a la autoridad en 72 horas si hay riesgo para las personas.</li>
     <li>Entornos de pruebas con datos <b>anonimizados</b>, nunca copias de producción tal cual.</li></ul>`},
 {t:"par", p:"Empareja cada práctica con el principio que aplica",
  pares:[["No pedir datos que no usas","Minimización"],["Borrar logs con datos personales a los 30 días","Limitación del plazo de conservación"],["Endpoint para exportar y borrar la cuenta","Derechos de acceso y supresión"],["Datos de pruebas anonimizados","Protección de datos en entornos no productivos"],["Plan para avisar en 72 horas","Notificación de brechas"]],
  why:"Cada vez más entrevistas preguntan cómo tratarías datos personales en un diseño."},
 {t:"opcion", p:"Para depurar un problema, alguien propone copiar la base de datos de producción al entorno de desarrollo. ¿Qué respondes?",
  ops:["Perfecto","Solo con los datos personales anonimizados o con datos sintéticos; producción tal cual expone datos de clientes en un entorno menos protegido","Solo los viernes","Cifrarla con base64"],
  ok:1, why:"Los entornos de desarrollo suelen tener controles más débiles: son un objetivo fácil."}
]}

]});
