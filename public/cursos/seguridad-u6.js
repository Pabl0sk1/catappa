window.CURSOS = window.CURSOS || {};
(CURSOS.seguridad = CURSOS.seguridad || []).push({
titulo: "Secretos, cadena de suministro y DevSecOps",
resumen: "Gestión de secretos, dependencias vulnerables, SBOM y firma de artefactos, cabeceras de seguridad, registro y monitorización, SAST, DAST y modelado de amenazas",
nivel: "Experto",
color: "#d8554a",
lecciones: [

{
id:"sg6l1",
titulo:"Secretos y cadena de suministro",
claves:["Secretos fuera del código: gestor de secretos, inyectados en ejecución, rotados","Dependencias: inventario (SBOM), escaneo (SCA) y actualizaciones automáticas","Firmar artefactos y verificar su origen (cosign, SLSA)"],
pasos:[
 {t:"info", eti:"Lo que no se ve", h:"Secretos",
  c:`<ul><li>Nunca en el código ni en imágenes: <b>Secrets Manager</b>, <b>Vault</b> o secretos de Kubernetes con cifrado.</li>
     <li>Detectar fugas antes del commit: <b>gitleaks</b> o el secret scanning de GitHub.</li>
     <li>Si se filtra uno: <b>rotarlo inmediatamente</b>; borrar el commit no basta.</li>
     <li>Preferir credenciales temporales (roles, OIDC) a secretos de larga duración.</li></ul>`},
 {t:"info", eti:"Lo que no escribiste tú", h:"Cadena de suministro",
  c:`<p>Tu aplicación es un 10% tu código y un 90% dependencias. Ataques reales: paquetes de npm secuestrados, typosquatting (<code>reqeusts</code> en vez de <code>requests</code>), dependencias con puertas traseras.</p>
     <div class="termbox">trivy fs .                        # vulnerabilidades en dependencias
trivy image api:1.4.0             # y en la imagen
syft api:1.4.0 -o spdx-json       # SBOM: inventario de todo lo que contiene
cosign sign / cosign verify       # firmar y verificar imagenes</div>
     <p>Dependabot o Renovate abren PRs de actualización automáticamente.</p>`},
 {t:"par", p:"Empareja cada práctica con el riesgo que reduce",
  pares:[["gitleaks en pre-commit y CI","Subir secretos al repositorio"],["SCA (Trivy, Dependabot)","Dependencias con vulnerabilidades conocidas"],["SBOM","No saber si te afecta una vulnerabilidad nueva (como Log4Shell)"],["Firma de imágenes y verificación al desplegar","Ejecutar imágenes manipuladas"],["Lockfiles y versiones fijadas","Que entre sin querer una versión maliciosa"]],
  why:"Con un SBOM, responder «¿usamos log4j 2.14?» lleva segundos, no días."},
 {t:"vf", p:"Borrar de la historia de Git una clave filtrada es suficiente para neutralizarla.",
  ok:false, why:"Puede haberse copiado ya. Se rota siempre."}
]},

{
id:"sg6l2",
titulo:"Cabeceras, registro y monitorización",
claves:["Cabeceras: HSTS, CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors","Registrar eventos de seguridad sin datos sensibles","Alertas sobre patrones anómalos: logins fallidos, 403 masivos, cambios de permisos"],
pasos:[
 {t:"info", eti:"Endurecer respuestas", h:"Cabeceras de seguridad",
  c:`<div class="termbox">Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()</div>`},
 {t:"info", eti:"Detectar", h:"Registro y monitorización",
  c:`<ul><li>Registrar: logins (correctos y fallidos), cambios de permisos, accesos denegados, acciones de administración, errores de validación masivos.</li>
     <li><b>No</b> registrar: contraseñas, tokens, números de tarjeta o datos personales innecesarios.</li>
     <li>Centralizar los logs fuera del servidor (un atacante con acceso los borraría) y conservarlos el tiempo necesario.</li>
     <li>Alertas: 50 logins fallidos en un minuto, un pico de 403, un usuario que descarga 10.000 registros.</li></ul>`},
 {t:"par", p:"Empareja cada cabecera con su efecto",
  pares:[["Strict-Transport-Security","Obliga al navegador a usar siempre HTTPS"],["Content-Security-Policy","Limita de dónde se cargan scripts y otros recursos"],["X-Content-Type-Options: nosniff","Impide que el navegador adivine el tipo de un fichero"],["frame-ancestors 'none'","Impide incrustar la web en iframes (clickjacking)"],["Referrer-Policy","Controla qué URL de origen se envía a otros sitios"]],
  why:"securityheaders.com analiza las cabeceras de cualquier web."},
 {t:"opcion", p:"¿Qué NO debería aparecer nunca en los logs?",
  ops:["El id del usuario que hizo login","La contraseña o el token de sesión","La IP de origen","El código de respuesta"],
  ok:1, why:"Los logs los leen muchas personas y sistemas: tratarlos como datos sensibles."}
]},

{
id:"sg6l3",
titulo:"DevSecOps y modelado de amenazas",
claves:["Seguridad integrada en el ciclo: diseño, código, CI, despliegue y operación","SAST analiza el código; DAST ataca la aplicación en marcha; SCA revisa dependencias","Modelado de amenazas (STRIDE) al diseñar funcionalidades sensibles"],
pasos:[
 {t:"info", eti:"Desplazar a la izquierda", h:"Seguridad en el pipeline",
  c:`<div class="diag">diseno       modelado de amenazas
codigo       linters de seguridad en el IDE, revision de PR
commit       gitleaks
CI           SAST (Semgrep, CodeQL), SCA (Trivy, Dependabot), IaC (Checkov)
imagen       escaneo de vulnerabilidades, firma
despliegue   politicas de admision (Kyverno), verificacion de firma
produccion   DAST (OWASP ZAP), WAF, monitorizacion, pentest periodico</div>`},
 {t:"par", p:"Empareja cada categoría STRIDE con su amenaza",
  pares:[["Spoofing","Suplantar la identidad de otro"],["Tampering","Modificar datos sin autorización"],["Repudiation","Negar haber hecho algo por falta de registros"],["Information disclosure","Filtrar información"],["Denial of service","Dejar el servicio sin disponibilidad"],["Elevation of privilege","Conseguir más permisos de los debidos"]],
  why:"Repasar STRIDE sobre un diagrama del flujo destapa riesgos antes de escribir código."},
 {t:"opcion", p:"¿Qué diferencia hay entre SAST y DAST?",
  ops:["Ninguna","SAST analiza el código fuente sin ejecutarlo; DAST prueba la aplicación en marcha desde fuera, como un atacante","DAST es para móviles","SAST solo sirve para Java"],
  ok:1, why:"Se complementan: SAST encuentra patrones en el código; DAST, problemas reales de configuración y ejecución."}
]},

{
id:"sg6l4",
titulo:"Seguridad de contenedores y Kubernetes",
claves:["Imagen mínima, sin root, con dependencias escaneadas y firmada","En el clúster: RBAC mínimo, Pod Security restricted, NetworkPolicies y secretos gestionados","Detectar en ejecución: Falco y alertas de comportamiento anómalo"],
pasos:[
 {t:"info", eti:"De la imagen al clúster", h:"Capas de protección",
  c:`<div class="diag">IMAGEN      base minima o distroless, multi-stage, USER no root,
            escaneo (Trivy), SBOM, firma (cosign)
DESPLIEGUE  Pod Security restricted: runAsNonRoot, readOnlyRootFilesystem,
            drop ALL capabilities; limites de recursos
CLUSTER     RBAC minimo, ServiceAccounts sin token si no hace falta,
            NetworkPolicies deny-all + permisos explicitos,
            secretos desde un gestor (External Secrets), admision (Kyverno)
EJECUCION   Falco: alerta si un contenedor abre una shell o escribe en /etc</div>`},
 {t:"par", p:"Empareja cada medida con el ataque que frena",
  pares:[["Contenedor sin root","Escalar privilegios en el nodo tras comprometer la app"],["readOnlyRootFilesystem","Descargar y guardar herramientas del atacante"],["NetworkPolicy deny-all","Movimiento lateral hacia otros servicios"],["Verificar firmas en la admisión","Desplegar imágenes manipuladas"],["Falco","Pasar desapercibido tras entrar"]],
  why:"Cada una de estas medidas la aplicaste en los cursos de Docker y Kubernetes."},
 {t:"opcion", p:"Un atacante ejecuta código en tu pod de la API. ¿Qué medida limita más que pueda atacar la base de datos de otro servicio?",
  ops:["Una imagen más pequeña","NetworkPolicies que solo permiten a cada pod hablar con lo que necesita","Más réplicas","Cambiar el puerto"],
  ok:1, why:"Microsegmentación: contener el daño al servicio comprometido."}
]}

]});
