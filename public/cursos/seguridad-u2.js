window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Diseño seguro y modelado de amenazas",
resumen: "Principios de diseño seguro, modelado de amenazas con STRIDE sobre un diagrama de flujo de datos y cómo convertir amenazas en requisitos verificables con OWASP ASVS",
nivel: "Fundamentos",
color: "#f27a6d",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"sg1l2",
titulo:"Principios de diseño seguro",
claves:["Mínimo privilegio y defensa en profundidad","Seguro por defecto y fallar de forma segura","No confiar nunca en la entrada ni en el cliente; mediación completa en cada petición"],
pasos:[
 {t:"info", eti:"Cómo pensar", h:"Principios",
  c:`<ul><li><b>Mínimo privilegio</b>: cada usuario, servicio y proceso con los permisos justos, y durante el tiempo justo.</li>
     <li><b>Defensa en profundidad</b>: varias capas independientes; si una falla, las demás contienen el daño.</li>
     <li><b>Seguro por defecto</b>: lo nuevo nace cerrado (buckets privados, endpoints autenticados, CORS cerrado).</li>
     <li><b>Fallar de forma segura</b>: ante un error, denegar, no permitir (<i>fail closed</i>).</li>
     <li><b>Mediación completa</b>: comprobar la autorización en cada acceso, no solo al entrar.</li>
     <li><b>No confiar en la entrada</b>: todo lo que viene de fuera (usuarios, APIs de terceros, ficheros, cabeceras, colas) se valida.</li>
     <li><b>Separación de funciones</b>: nadie debería poder hacer solo una acción crítica (desplegar sin revisión, aprobar su propio pago).</li>
     <li><b>Simplicidad</b>: lo complejo esconde fallos; menos código y menos opciones, menos superficie.</li></ul>`},
 {t:"par", p:"Empareja cada práctica con el principio que aplica",
  pares:[["Rol de IAM con solo s3:GetObject sobre un bucket","Mínimo privilegio"],["WAF + validación + consultas parametrizadas","Defensa en profundidad"],["Endpoints nuevos protegidos salvo que se abran explícitamente","Seguro por defecto"],["Si el servicio de permisos no responde, se deniega","Fallar de forma segura"],["Validar en el servidor aunque el frontend ya valide","No confiar en el cliente"],["Un pull request no se puede fusionar sin la aprobación de otra persona","Separación de funciones"]],
  why:"Estos principios aparecen en todo el curso aplicados a casos concretos."},
 {t:"opcion", p:"El servicio que comprueba permisos da timeout. ¿Qué debe hacer tu API?",
  ops:["Permitir la acción para no molestar al usuario","Reintentar indefinidamente hasta que responda","Denegarla (fallar de forma segura), registrar el error y alertar si se repite","Usar el último permiso que tuviera en caché sin límite de tiempo"],
  ok:2, why:"Fail open convierte una caída en un agujero de seguridad. Es justo lo que describe A10:2025."},
 {t:"info", eti:"En código", h:"Fallar cerrado de verdad",
  c:`<p>El error más habitual no es decidir «permitir» a propósito, sino que el flujo lo permita sin querer:</p>
     <div class="termbox">// MAL: si comprobar() lanza una excepción inesperada, se ignora y se sigue
let permitido = true;
try { permitido = await permisos.comprobar(usuario, "borrar", doc); } catch (e) { log(e); }
if (permitido) await borrar(doc);

// BIEN: el valor por defecto es denegar y el error corta el flujo
let permitido = false;
try { permitido = await permisos.comprobar(usuario, "borrar", doc) === true; }
catch (e) { log(e); throw new Error("no se pudo verificar el permiso"); }
if (!permitido) throw new Forbidden();</div>
     <p>Fíjate también en el <code>=== true</code>: si la función devuelve <code>undefined</code> o un objeto de error, no cuenta como permiso.</p>`},
 {t:"vf", p:"Inicializar <code>permitido = true</code> y ponerlo a <code>false</code> solo si la comprobación dice que no es un patrón seguro.",
  ok:false, why:"Cualquier camino que no llegue a la comprobación (una excepción, un return anticipado) deja el permiso concedido. El valor por defecto debe ser denegar."},
 {t:"opcion", p:"Un microservicio de informes necesita leer la tabla de pedidos. ¿Qué credenciales de base de datos le das?",
  ops:["Las del usuario administrador, así no falla nada","Un usuario propio con SELECT solo sobre las tablas que lee","El mismo usuario que la API principal, que ya funciona","Un usuario con todos los permisos sobre el esquema de pedidos"],
  ok:1, why:"Si el servicio de informes se ve comprometido (o tiene una inyección), el daño se limita a leer esas tablas."},
 {t:"escribe", p:"¿Cómo se llama el principio de que cada identidad tenga solo los permisos necesarios para su tarea?",
  sol:["mínimo privilegio","minimo privilegio","principio de mínimo privilegio","least privilege","privilegio mínimo"],
  pista:"Lo menos posible.",
  why:"Aparece en IAM, bases de datos, contenedores, tokens OAuth (scopes) y ServiceAccounts de Kubernetes."}
]},

/* =============== U2 L2 =============== */
{
id:"sg2n1",
titulo:"Modelado de amenazas con STRIDE",
claves:["Modelar amenazas es preguntar qué puede salir mal antes de construir","Se dibuja un diagrama de flujo de datos con sus límites de confianza","STRIDE recorre cada elemento: suplantación, manipulación, repudio, divulgación, denegación y elevación de privilegios"],
pasos:[
 {t:"info", eti:"Antes de escribir código", h:"Las cuatro preguntas",
  c:`<p>El modelado de amenazas se resume en cuatro preguntas (el marco de Adam Shostack y el <i>Threat Modeling Manifesto</i>):</p>
     <div class="dg"><div class="dg-tit">el ciclo de un modelo de amenazas</div><div class="dg-vert">
       <div class="dg-caja">¿En qué estamos trabajando?<small>diagrama de flujo de datos</small></div>
       <div class="dg-caja acento">¿Qué puede salir mal?<small>STRIDE sobre cada elemento</small></div>
       <div class="dg-caja">¿Qué vamos a hacer al respecto?<small>mitigar, eliminar, transferir o aceptar</small></div>
       <div class="dg-caja ok">¿Lo hicimos bien?<small>pruebas y revisión del modelo</small></div>
     </div></div>
     <p>No hace falta un documento de 40 páginas: una sesión de una hora con una pizarra, antes de construir una funcionalidad sensible (pagos, login, subida de ficheros, permisos), encuentra fallos de diseño que ningún escáner verá.</p>`},
 {t:"info", eti:"El dibujo", h:"Diagrama de flujo de datos y límites de confianza",
  c:`<div class="dg"><div class="dg-tit">dfd de «subir factura en pdf»</div>
       <div class="dg-flujo">
         <div class="dg-caja base">Usuario<small>entidad externa</small></div>
         <div class="dg-caja acento">API<small>proceso</small></div>
         <div class="dg-caja acento">Worker de PDF<small>proceso</small></div>
         <div class="dg-caja ok">S3 facturas<small>almacén</small></div>
       </div>
       <div class="dg-nota arriba">las flechas son flujos de datos; entre Usuario y API hay un límite de confianza (Internet), y otro entre la API y el worker (cola)</div>
     </div>
     <p>Cuatro tipos de elemento: <b>entidades externas</b> (usuarios, APIs de terceros), <b>procesos</b> (tu código), <b>almacenes</b> (bases de datos, buckets, colas) y <b>flujos</b>. Los <b>límites de confianza</b> son donde cambia quién controla los datos: ahí se concentran las amenazas.</p>`},
 {t:"par", p:"Empareja cada categoría STRIDE con su amenaza y la propiedad que rompe",
  pares:[["Spoofing (suplantación)","Hacerse pasar por otro: rompe la autenticidad"],["Tampering (manipulación)","Modificar datos o código: rompe la integridad"],["Repudiation (repudio)","Negar haber hecho algo: rompe el no repudio"],["Information disclosure","Filtrar datos: rompe la confidencialidad"],["Denial of service","Dejar sin servicio: rompe la disponibilidad"],["Elevation of privilege","Obtener más permisos: rompe la autorización"]],
  why:"Cada letra de STRIDE es la negación de una propiedad de seguridad; por eso sirve como checklist sistemática."},
 {t:"opcion", p:"En el DFD de la factura, ¿qué amenaza STRIDE describe «un usuario sube un PDF que hace que el worker consuma toda la memoria y se caiga»?",
  ops:["Spoofing","Repudiation","Denial of service","Information disclosure"],
  ok:2, why:"Mitigaciones: límite de tamaño, tiempo máximo de procesado, límites de memoria del contenedor y cola con reintentos acotados."},
 {t:"opcion", p:"Y «el worker lee de la cola cualquier mensaje, así que quien pueda escribir en ella le hace procesar ficheros de otros clientes». ¿Qué categorías encajan mejor?",
  ops:["Spoofing y elevation of privilege: el worker confía en un emisor que no autentica","Solo denial of service","Solo repudiation","Ninguna: la cola es interna"],
  ok:0, why:"«Es interno» no es un control. Hay que restringir quién escribe en la cola y validar en el worker que el mensaje corresponde al cliente."},
 {t:"vf", p:"A un flujo de datos (una flecha del DFD) se le aplican sobre todo manipulación, divulgación y denegación de servicio.",
  ok:true, why:"Los datos en tránsito se pueden alterar, leer o cortar: TLS o mTLS cubren las dos primeras. La suplantación y la elevación aplican a los procesos y entidades."},
 {t:"codigo", p:"STRIDE por elemento", lenguaje:"py",
  c:`<p>Cada línea tiene <code>tipo nombre</code>, con tipo <code>entidad</code>, <code>proceso</code>, <code>almacen</code> o <code>flujo</code>. Imprime <code>nombre: letras</code> con las categorías STRIDE que aplican según la tabla clásica:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">stride por tipo de elemento</div><table class="dg-tabla"><tbody>
       <tr><td>entidad</td><td>S R</td></tr><tr><td>proceso</td><td>S T R I D E</td></tr>
       <tr><td>almacen</td><td>T I D</td></tr><tr><td>flujo</td><td>T I D</td></tr></tbody></table></div>
     <p>Formato: letras separadas por comas, en el orden S, T, R, I, D, E. Ejemplo: <code>usuario: S,R</code>.</p>`,
  plantilla:"import sys\n\nfor linea in sys.stdin:\n    if not linea.strip():\n        continue\n    tipo, nombre = linea.split()\n    # imprime nombre: letras\n",
  pruebas:[
   {entrada:"entidad usuario\nproceso api\n", salida:"usuario: S,R\napi: S,T,R,I,D,E"},
   {entrada:"almacen s3\nflujo usuario-api\nentidad pasarela\n", salida:"s3: T,I,D\nusuario-api: T,I,D\npasarela: S,R", oculta:true}
  ],
  pista:"Un diccionario de tipo a lista de letras y ','.join().",
  solucion:"import sys\n\nSTRIDE = {\n    \"entidad\": \"SR\",\n    \"proceso\": \"STRIDE\",\n    \"almacen\": \"TID\",\n    \"flujo\": \"TID\",\n}\nfor linea in sys.stdin:\n    if not linea.strip():\n        continue\n    tipo, nombre = linea.split()\n    print(f\"{nombre}: {','.join(STRIDE[tipo])}\")\n",
  why:"Herramientas como OWASP Threat Dragon o Microsoft Threat Modeling Tool generan exactamente esta lista inicial de amenazas a partir del diagrama; el trabajo humano es decidir cuáles son reales."}
]},

/* =============== U2 L3 =============== */
{
id:"sg2n2",
titulo:"De las amenazas a los requisitos",
claves:["Cada amenaza se mitiga, se elimina, se transfiere o se acepta por escrito","Casos de abuso: historias de usuario escritas desde el atacante","Requisitos verificables con OWASP ASVS y criterios de aceptación en cada historia"],
pasos:[
 {t:"info", eti:"Decidir", h:"Qué hacer con cada amenaza",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">las cuatro respuestas a un riesgo</div><table class="dg-tabla"><thead><tr><th>Respuesta</th><th>Qué significa</th><th>Ejemplo</th></tr></thead><tbody>
       <tr><td>Mitigar</td><td>añadir un control que reduce probabilidad o impacto</td><td>límite de intentos en el login</td></tr>
       <tr><td>Eliminar</td><td>quitar la funcionalidad o el dato</td><td>no guardar el número de tarjeta</td></tr>
       <tr><td>Transferir</td><td>que lo gestione otro con garantías</td><td>pasarela de pago, seguro, proveedor de identidad</td></tr>
       <tr><td>Aceptar</td><td>convivir con él, con decisión firmada y fecha de revisión</td><td>riesgo bajo en una herramienta interna</td></tr>
     </tbody></table></div>
     <p>«Eliminar» es la respuesta más infravalorada: el dato que no guardas no se puede filtrar. Delegar el pago con tarjeta en una pasarela saca la mayor parte de PCI DSS de tu sistema.</p>`},
 {t:"par", p:"Empareja cada decisión con la respuesta al riesgo que aplica",
  pares:[["Usar Stripe Checkout en vez de recibir tarjetas","Transferir"],["Dejar de pedir el DNI porque no se usa","Eliminar"],["Añadir MFA obligatorio a los administradores","Mitigar"],["Documentar que el panel interno no tendrá WAF este trimestre","Aceptar"]],
  why:"Aceptar un riesgo es legítimo si lo decide quien tiene autoridad, queda escrito y tiene fecha de revisión. Lo que no vale es aceptarlo por omisión."},
 {t:"info", eti:"Desde el otro lado", h:"Casos de abuso y requisitos",
  c:`<p>Junto a cada historia de usuario, escribe su <b>caso de abuso</b>:</p>
     <div class="dg"><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">historia</div><div class="dg-caja ok doble">Como cliente, quiero descargar mis facturas<small>GET /facturas/{id}</small></div></div>
       <div class="dg-col"><div class="dg-col-tit">caso de abuso</div><div class="dg-caja aviso doble">Como atacante, quiero descargar las facturas de otros cambiando el id<small>IDOR</small></div></div>
     </div></div>
     <p>Y convierte la defensa en un <b>criterio de aceptación comprobable</b>: «pedir la factura de otro cliente devuelve 404 y queda registrado». <b>OWASP ASVS</b> (versión 5.0, de 2025) ofrece cientos de requisitos numerados por capítulos (autenticación, sesiones, control de acceso, validación, criptografía...) y niveles: <b>L1</b> lo mínimo para cualquier aplicación, <b>L2</b> la mayoría de aplicaciones con datos sensibles, <b>L3</b> las más críticas.</p>`},
 {t:"opcion", p:"¿Cuál es un buen criterio de aceptación de seguridad para la historia «restablecer contraseña»?",
  ops:["La funcionalidad debe ser segura","El enlace de restablecimiento es de un solo uso, caduca en 30 minutos, invalida las sesiones abiertas y la respuesta es idéntica exista o no el email","Usar las mejores prácticas del sector","Pasar el escáner sin avisos"],
  ok:1, why:"Un requisito de seguridad útil se puede convertir en una prueba automática. «Debe ser segura» no se puede comprobar."},
 {t:"orden", p:"Ordena una sesión de modelado de amenazas de una nueva funcionalidad",
  items:["Dibujar el flujo de datos y marcar los límites de confianza","Recorrer cada elemento con STRIDE y apuntar amenazas","Estimar el riesgo de cada amenaza","Decidir mitigar, eliminar, transferir o aceptar","Convertir las mitigaciones en requisitos y pruebas","Revisar el modelo cuando cambie el diseño"],
  why:"El modelo es un documento vivo: un modelo que no se actualiza cuando cambia la arquitectura se queda describiendo un sistema que ya no existe."},
 {t:"vf", p:"El modelado de amenazas solo tiene sentido al principio del proyecto.",
  ok:false, why:"Se repite con cada cambio relevante: una integración nueva, un nuevo tipo de dato sensible, un endpoint público. Muchos equipos lo hacen como parte del diseño de cada épica."},
 {t:"opcion", p:"Estás diseñando la exportación de datos personales de un usuario (RGPD). ¿Qué amenaza te preocuparía más?",
  ops:["Que el fichero tarde en generarse","Que otro usuario obtenga la exportación ajena (enlace adivinable, falta de autorización) o que el enlace quede en logs o cachés","Que el fichero sea grande","Que el usuario la pida dos veces"],
  ok:1, why:"Una exportación de datos personales es un paquete perfecto para un atacante: enlace firmado y de corta duración, descarga autenticada y registro del evento."},
 {t:"escribe", p:"¿Cómo se llama el estándar de OWASP con requisitos de seguridad verificables por niveles L1, L2 y L3? (siglas)",
  sol:["ASVS","owasp asvs","application security verification standard"],
  pista:"Application Security Verification Standard.",
  why:"Muchas empresas lo usan como base de su checklist de revisión y de los criterios que exige un pentest."}
]}

]});
