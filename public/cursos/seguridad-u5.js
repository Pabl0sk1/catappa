window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Más ataques a aplicaciones",
resumen: "SSRF, subida de ficheros, path traversal, deserialización insegura, XXE, redirecciones abiertas y configuración insegura",
nivel: "Avanzado",
color: "#e16053",
lecciones: [

{
id:"sg5l1",
titulo:"SSRF y ficheros",
claves:["SSRF: engañar al servidor para que haga peticiones a destinos internos","Validar URLs contra una lista permitida y bloquear IPs internas y de metadatos","Subidas: validar tipo real y tamaño, renombrar, guardar fuera del servidor web"],
pasos:[
 {t:"info", eti:"Tu servidor como herramienta", h:"Server-Side Request Forgery",
  c:`<div class="termbox">POST /api/importar-imagen   {"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}
# el servidor descarga "la imagen" y devuelve... las credenciales del rol de la instancia</div>
     <p>Defensas: lista de dominios permitidos, resolver el DNS y rechazar IPs privadas, locales y de metadatos, no seguir redirecciones sin validar, IMDSv2 en AWS, y salida de red restringida (egress) para el servicio.</p>`},
 {t:"info", eti:"Subir ficheros", h:"Subidas y path traversal",
  c:`<ul><li>Validar el <b>tipo real</b> (no la extensión ni el Content-Type que envía el cliente) y el tamaño máximo.</li>
     <li>Generar un nombre propio; nunca usar el nombre que envía el usuario.</li>
     <li>Guardar en S3 o fuera de la carpeta servida, y servir con <code>Content-Disposition: attachment</code>.</li>
     <li>Escanear con antivirus si otros usuarios los descargan.</li></ul>
     <div class="termbox">GET /api/descargas?fichero=../../../../etc/passwd      # path traversal
Path base = Path.of("/datos/facturas").toRealPath();
Path pedido = base.resolve(nombre).normalize();
if (!pedido.startsWith(base)) throw new AccessDeniedException(nombre);</div>`},
 {t:"par", p:"Empareja cada ataque con su defensa",
  pares:[["SSRF","Lista permitida de destinos y bloqueo de IPs internas"],["Path traversal","Normalizar la ruta y comprobar que sigue dentro de la carpeta base"],["Subida de un script disfrazado de imagen","Comprobar el tipo real y no servirlo como ejecutable"],["Fichero gigante para agotar el disco","Límite de tamaño"]],
  why:"SSRF entró en el OWASP Top 10 por su impacto en la nube."},
 {t:"vf", p:"Comprobar que el nombre del fichero termina en .jpg basta para saber que es una imagen.",
  ok:false, why:"La extensión la elige el atacante. Hay que comprobar el contenido."}
]},

{
id:"sg5l2",
titulo:"Deserialización, XXE y configuración",
claves:["Deserializar objetos de fuentes no confiables puede ejecutar código","XXE: parsers XML que resuelven entidades externas; desactívalas","Configuración insegura: valores por defecto, errores detallados, endpoints de depuración expuestos"],
pasos:[
 {t:"info", eti:"Datos que se convierten en código", h:"Deserialización insegura y XXE",
  c:`<ul><li><b>Deserialización</b>: <code>ObjectInputStream</code> en Java, <code>pickle</code> en Python o YAML con tipos arbitrarios pueden instanciar objetos peligrosos y ejecutar código. Usa formatos de datos simples (JSON) con esquemas.</li>
     <li><b>XXE</b>: un XML con <code>&lt;!ENTITY x SYSTEM "file:///etc/passwd"&gt;</code> hace que el parser lea ficheros internos. Desactiva DTD y entidades externas.</li>
     <li><b>Redirección abierta</b>: <code>/login?volver=https://malo.com</code> usado en phishing. Permite solo rutas relativas o una lista de destinos.</li></ul>`},
 {t:"info", eti:"Lo que viene de serie", h:"Configuración insegura",
  c:`<ul><li>Contraseñas por defecto en paneles y bases de datos.</li>
     <li>Mensajes de error con trazas de pila o consultas SQL.</li>
     <li>Actuator, Swagger o consolas de administración expuestos a internet.</li>
     <li>Listados de directorios activados, CORS abierto a cualquiera, cabeceras de seguridad ausentes.</li>
     <li>Servicios y puertos innecesarios abiertos.</li></ul>`},
 {t:"par", p:"Empareja cada fallo con su categoría",
  pares:[["pickle.loads de datos del usuario","Deserialización insegura"],["Parser XML con entidades externas activas","XXE"],["/actuator/env público","Configuración insegura"],["?volver=https://web-falsa.com","Redirección abierta"]],
  why:"Muchos incidentes graves empiezan por algo que «venía así por defecto»."},
 {t:"opcion", p:"¿Qué formato es más seguro para recibir datos de clientes?",
  ops:["Objetos serializados de Java","JSON validado contra un esquema","pickle","YAML con tipos personalizados"],
  ok:1, why:"JSON solo describe datos, no tipos ejecutables."}
]},

{
id:"sg5l3",
titulo:"Seguridad de APIs",
claves:["OWASP API Security Top 10: BOLA, autenticación rota, exposición de propiedades, consumo de recursos sin límites...","Paginación, límites de tamaño y de frecuencia en todos los endpoints","Inventario de APIs: versiones antiguas y endpoints olvidados son puertas abiertas"],
pasos:[
 {t:"info", eti:"El Top 10 de APIs", h:"Riesgos más frecuentes",
  c:`<div class="diag">API1 Autorizacion a nivel de objeto rota (BOLA / IDOR)
API2 Autenticacion rota
API3 Autorizacion a nivel de propiedad (exponer o permitir escribir campos que no tocan)
API4 Consumo de recursos sin limites
API5 Autorizacion a nivel de funcion (usuarios normales llamando a endpoints de admin)
API6 Acceso sin control a flujos de negocio sensibles
API7 SSRF
API8 Configuracion incorrecta
API9 Inventario deficiente (versiones viejas, endpoints de pruebas expuestos)
API10 Consumo inseguro de APIs de terceros</div>`},
 {t:"par", p:"Empareja cada escenario con su riesgo del API Top 10",
  pares:[["GET /api/pedidos/1043 devuelve el pedido de otro","Autorización a nivel de objeto (BOLA)"],["La respuesta incluye el hash de la contraseña","Exposición de propiedades"],["GET /api/productos?size=1000000","Consumo de recursos sin límites"],["/api/v1 antigua sin los parches de /api/v2","Inventario deficiente"],["Confiar ciegamente en la respuesta de una API externa","Consumo inseguro de APIs de terceros"]],
  why:"Coincide casi punto por punto con lo que viste en Spring Security y Node."},
 {t:"opcion", p:"¿Cómo evitas exponer campos internos (como <code>esAdmin</code> o <code>hashClave</code>) en las respuestas?",
  ops:["Borrándolos en el frontend","Devolviendo DTOs con solo los campos públicos, nunca las entidades directamente","Cifrando la respuesta","No se puede"],
  ok:1, why:"Lo mismo en la entrada: DTOs de entrada evitan el mass assignment."}
]}

]});
