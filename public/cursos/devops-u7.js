window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "Cloud, seguridad y entrevista",
resumen: "Modelos cloud, IAM, DevSecOps, gestión de secretos y simulacro final",
color: "#6dd3f2",
lecciones: [

/* =============== O7 L1 =============== */
{
id:"o7l1",
titulo:"La nube en lo esencial",
claves:["IaaS, PaaS y SaaS: cuánto gestionas tú y cuánto el proveedor","Regiones y zonas de disponibilidad para la alta disponibilidad","Los servicios básicos: cómputo, almacenamiento, bases de datos, red e identidades"],
pasos:[
 {t:"info", eti:"Los modelos", h:"¿Cuánto gestionas tú?",
  c:`<div class="diag">                 tu gestionas                 el proveedor gestiona
On-premise       todo                         nada
IaaS (EC2)       SO, runtime, app, datos      hardware, red, virtualizacion
PaaS (App Engine,
  Elastic Beanstalk) app y datos              todo lo demas
SaaS (Gmail)     solo lo usas                 todo</div>
     <p>Cuanto más subes, <b>menos control</b> pero <b>menos trabajo</b>. Los contenedores gestionados (EKS, Cloud Run, ECS Fargate) están a medio camino entre IaaS y PaaS.</p>`},

 {t:"par", p:"Empareja cada modelo con un ejemplo",
  pares:[["IaaS","Una máquina virtual en EC2 donde instalas todo"],
         ["PaaS","Subes el código y la plataforma lo ejecuta y escala"],
         ["SaaS","Usas un producto terminado, como Gmail o Slack"]],
  why:"La pregunta clásica de «qué es la nube» se responde con estos tres modelos."},

 {t:"info", eti:"Geografía", h:"Regiones y zonas de disponibilidad",
  c:`<ul><li>Una <b>región</b> es una zona geográfica (Irlanda, Frankfurt, Virginia) con varios centros de datos.</li>
     <li>Una <b>zona de disponibilidad</b> (AZ) es uno o varios centros de datos independientes dentro de la región: electricidad, red y refrigeración separadas.</li></ul>
     <p>Repartir tu aplicación en <b>varias AZ</b> te protege si cae un centro de datos. Es la base de la alta disponibilidad en la nube.</p>`},

 {t:"opcion", p:"Quieres que tu API siga funcionando si cae un centro de datos entero. ¿Qué haces?",
  ops:["Poner una máquina más grande","Repartir las réplicas en varias zonas de disponibilidad de la región","Hacer backups diarios","Usar otra región para los logs"],
  ok:1,
  why:"Multi-AZ. Los backups sirven para recuperar datos, no para seguir funcionando."},

 {t:"info", eti:"El mapa de AWS", h:"Los servicios que más se nombran",
  c:`<div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:14px">
     <tr><td style="padding:5px 8px"><b>EC2</b></td><td style="padding:5px 8px">Máquinas virtuales</td></tr>
     <tr><td style="padding:5px 8px"><b>S3</b></td><td style="padding:5px 8px">Almacenamiento de objetos (ficheros, backups, estáticos)</td></tr>
     <tr><td style="padding:5px 8px"><b>RDS</b></td><td style="padding:5px 8px">Bases de datos gestionadas (PostgreSQL, MySQL)</td></tr>
     <tr><td style="padding:5px 8px"><b>VPC</b></td><td style="padding:5px 8px">Tu red privada: subredes, rutas, grupos de seguridad</td></tr>
     <tr><td style="padding:5px 8px"><b>IAM</b></td><td style="padding:5px 8px">Usuarios, roles y permisos</td></tr>
     <tr><td style="padding:5px 8px"><b>EKS / ECS</b></td><td style="padding:5px 8px">Kubernetes gestionado / contenedores gestionados</td></tr>
     <tr><td style="padding:5px 8px"><b>ECR</b></td><td style="padding:5px 8px">Registry de imágenes Docker</td></tr>
     <tr><td style="padding:5px 8px"><b>CloudWatch</b></td><td style="padding:5px 8px">Métricas, logs y alarmas</td></tr></table></div>
     <p>Azure y Google tienen el equivalente de cada uno con otro nombre (Azure VM, Blob Storage, GKE...). Los conceptos se trasladan.</p>`},

 {t:"par", p:"Empareja cada servicio de AWS con su función",
  pares:[["S3","Almacenamiento de ficheros y objetos"],
         ["RDS","Base de datos gestionada"],
         ["IAM","Identidades y permisos"],
         ["ECR","Registry de imágenes de contenedor"]],
  why:"No hace falta ser experto en AWS, pero sí saber qué es cada pieza."},

 {t:"vf", p:"Usar una base de datos gestionada (RDS) te libra de gestionar backups, parches y réplicas de forma manual.",
  ok:true,
  why:"Por eso muchas empresas no meten la base de datos en Kubernetes: la operación la hace el proveedor."}
]},

/* =============== O7 L2 =============== */
{
id:"o7l2",
titulo:"IAM y mínimo privilegio",
claves:["Cada identidad con los permisos justos para su tarea","Roles con credenciales temporales en vez de claves permanentes","Nada de usar la cuenta raíz para el día a día"],
pasos:[
 {t:"info", eti:"El principio", h:"Mínimo privilegio",
  c:`<p>Ya lo has visto con <code>USER</code> en Docker, con los usuarios de servicio en Linux y con <code>permissions</code> en GitHub Actions. En la nube se aplica igual: <b>cada persona, servicio o pipeline con los permisos justos</b> para hacer su trabajo, y nada más.</p>
     <p>Si comprometen algo, el daño queda limitado a lo que ese algo podía hacer.</p>`},

 {t:"info", eti:"IAM", h:"Usuarios, grupos, roles y políticas",
  c:`<ul><li><b>Usuarios</b>: personas (o, mal hecho, aplicaciones) con credenciales propias.</li>
     <li><b>Grupos</b>: agrupan usuarios con los mismos permisos.</li>
     <li><b>Roles</b>: identidades que se <b>asumen temporalmente</b>. Una máquina EC2, un pod o un pipeline asume un rol y recibe credenciales que caducan en minutos u horas.</li>
     <li><b>Políticas</b>: documentos JSON que dicen qué acciones se permiten sobre qué recursos.</li></ul>
     <div class="termbox">{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::pablo-backups-tareas/*"
}</div>`},

 {t:"opcion", p:"Tu aplicación en EC2 necesita leer de un bucket de S3. ¿Cómo le das acceso?",
  ops:["Pongo mi clave de acceso personal en el código",
       "Le asigno a la máquina un rol IAM con permiso solo de lectura sobre ese bucket",
       "Hago el bucket público",
       "Le doy permisos de administrador por si acaso"],
  ok:1,
  why:"Rol con credenciales temporales y permisos mínimos. Sin claves que se puedan filtrar."},

 {t:"info", eti:"Sin claves permanentes", h:"OIDC: el pipeline sin secretos de la nube",
  c:`<p>La forma moderna de que GitHub Actions despliegue en AWS <b>sin guardar ninguna clave</b>: <b>OIDC</b>. GitHub emite un token firmado para esa ejecución, AWS confía en GitHub y le deja asumir un rol durante unos minutos.</p>
     <div class="termbox">permissions:
  id-token: write
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/deploy-api
      aws-region: eu-west-1</div>
     <p>No hay claves de larga duración que puedan filtrarse. Mencionarlo en una entrevista es nota alta.</p>`},

 {t:"vf", p:"Es buena práctica usar la cuenta raíz (root) de AWS para el trabajo diario si se protege con una contraseña fuerte.",
  ok:false,
  why:"La cuenta raíz se protege con MFA y se guarda en un cajón. El día a día, con identidades con permisos limitados."},

 {t:"par", p:"Empareja cada mala práctica con su alternativa correcta",
  pares:[["Claves de acceso en el código","Roles IAM con credenciales temporales"],
         ["Permisos de administrador por comodidad","Políticas con solo las acciones necesarias"],
         ["Claves de la nube guardadas en el CI","OIDC entre el CI y el proveedor"],
         ["Usar la cuenta raíz","Usuarios o SSO con MFA y la raíz bloqueada"]],
  why:"Esta tabla resume la seguridad de identidades en la nube."}
]},

/* =============== O7 L3 =============== */
{
id:"o7l3",
titulo:"DevSecOps: seguridad desde el principio",
claves:["Shift left: encontrar problemas de seguridad lo antes posible","SAST analiza el código; SCA las dependencias; escaneo de imágenes; DAST la app en marcha","La seguridad se automatiza en el pipeline, no se deja para el final"],
pasos:[
 {t:"info", eti:"La idea", h:"Shift left",
  c:`<p>Tradicionalmente, la seguridad era una auditoría <b>al final</b>, justo antes de publicar. Encontrar un problema ahí es caro: hay que rehacer trabajo, y retrasa todo.</p>
     <p><b>DevSecOps</b> propone <b>desplazar la seguridad a la izquierda</b> (shift left) en el ciclo: comprobarla <b>automáticamente en cada cambio</b>, como los tests.</p>
     <div class="diag">code --> build --> test --> release --> deploy --> operate
 ^         ^          ^         ^
 secretos  SAST       SCA       escaneo de imagen,     DAST, monitorizacion
 (hooks)   (codigo)   (deps)    firma, SBOM</div>`},

 {t:"info", eti:"Las herramientas", h:"Qué se analiza y cuándo",
  c:`<ul><li><b>Escaneo de secretos</b>: busca contraseñas y tokens en el código (gitleaks, GitHub secret scanning).</li>
     <li><b>SAST</b> (análisis estático): revisa el código fuente en busca de patrones peligrosos, como inyección SQL (CodeQL, SonarQube, Semgrep).</li>
     <li><b>SCA</b> (análisis de dependencias): tus librerías tienen vulnerabilidades conocidas (Dependabot, Snyk, OWASP Dependency-Check).</li>
     <li><b>Escaneo de imágenes</b>: vulnerabilidades en los paquetes de tu imagen Docker (Trivy, Docker Scout).</li>
     <li><b>DAST</b> (análisis dinámico): ataca la aplicación <b>en marcha</b> como lo haría un atacante (OWASP ZAP).</li></ul>`},

 {t:"par", p:"Empareja cada técnica con lo que analiza",
  pares:[["SAST","El código fuente, sin ejecutarlo"],
         ["SCA","Las dependencias y sus vulnerabilidades conocidas"],
         ["DAST","La aplicación en ejecución, desde fuera"],
         ["Escaneo de imágenes","Los paquetes dentro de la imagen de contenedor"]],
  why:"Las siglas se confunden mucho. Tenerlas claras en una entrevista de DevOps suma."},

 {t:"opcion", p:"Una librería de logging que usas tiene una vulnerabilidad crítica publicada. ¿Qué herramienta la habría detectado?",
  ops:["DAST","SCA / análisis de dependencias (Dependabot, Snyk...)","Un linter de formato","Grafana"],
  ok:1,
  why:"Es el caso de Log4Shell en 2021: millones de aplicaciones Java afectadas por una dependencia. SCA existe para esto."},

 {t:"info", eti:"Cadena de suministro", h:"¿De dónde viene lo que despliegas?",
  c:`<p>Los ataques modernos no van a tu código: van a <b>tus dependencias y a tu pipeline</b> (supply chain). Prácticas para defenderse:</p>
     <ul><li><b>Fijar versiones</b> de imágenes base y dependencias (nada de <code>latest</code>).</li>
     <li><b>SBOM</b> (Software Bill of Materials): la lista de todo lo que lleva tu artefacto, para saber en minutos si te afecta una vulnerabilidad nueva.</li>
     <li><b>Firmar las imágenes</b> (cosign) y verificar la firma antes de desplegar.</li>
     <li>Fijar las actions de terceros por <b>SHA</b> en los workflows, no por etiqueta.</li></ul>`},

 {t:"vf", p:"En DevSecOps, la seguridad se revisa una sola vez justo antes de publicar la versión.",
  ok:false,
  why:"Justo lo contrario: se automatiza en cada paso del pipeline, desde el primer commit."}
]},

/* =============== O7 L4 =============== */
{
id:"o7l4",
titulo:"Gestión de secretos",
claves:["Los secretos nunca en el código, en la imagen ni en el repositorio","Un gestor de secretos centraliza, cifra, audita y rota","Rotar periódicamente y tras cualquier sospecha de filtración"],
pasos:[
 {t:"info", eti:"Recopilación", h:"Dónde NO van los secretos",
  c:`<p>A lo largo de los tres cursos has visto este principio muchas veces. Juntándolo todo, un secreto <b>nunca</b> va en:</p>
     <ul><li>el código fuente ni el repositorio de Git (ni siquiera en un commit antiguo),</li>
     <li>la imagen Docker (<code>ENV</code>, <code>ARG</code> o un fichero copiado),</li>
     <li>el YAML del pipeline,</li>
     <li>un Secret de Kubernetes guardado en Git sin cifrar,</li>
     <li>los logs.</li></ul>`},

 {t:"info", eti:"La solución", h:"Un gestor de secretos",
  c:`<p>Un <b>gestor de secretos</b> (HashiCorp <b>Vault</b>, AWS <b>Secrets Manager</b>, Azure <b>Key Vault</b>, Google Secret Manager) guarda los secretos cifrados y ofrece:</p>
     <ul><li><b>Control de acceso</b>: qué aplicación puede leer qué secreto.</li>
     <li><b>Auditoría</b>: quién leyó qué y cuándo.</li>
     <li><b>Rotación</b>: cambiar la contraseña periódicamente sin tocar el código.</li>
     <li><b>Secretos dinámicos</b> (Vault): credenciales de base de datos que se crean al pedirlas y caducan en una hora.</li></ul>
     <p>La aplicación los obtiene al arrancar (o un operador como External Secrets los sincroniza en Kubernetes), usando una identidad (rol IAM, service account), no otra contraseña.</p>`},

 {t:"opcion", p:"¿Qué aporta un gestor de secretos frente a variables de entorno escritas en un fichero del servidor?",
  ops:["Nada",
       "Cifrado, control de acceso por aplicación, auditoría de quién lee qué y rotación sin tocar el código",
       "Que los secretos son más cortos",
       "Que no hace falta red"],
  ok:1,
  why:"Centralizar, auditar y rotar. Y si un secreto se filtra, se cambia en un solo sitio."},

 {t:"info", eti:"Rotación", h:"Cambiar los secretos antes de que haga falta",
  c:`<p><b>Rotar</b> es sustituir un secreto por uno nuevo. Se hace:</p>
     <ul><li><b>periódicamente</b> (cada 30, 60 o 90 días, según la política),</li>
     <li>cuando <b>alguien deja el equipo</b> y tenía acceso,</li>
     <li>y de inmediato ante <b>cualquier sospecha</b> de filtración.</li></ul>
     <p>Un sistema bien hecho permite rotar sin cortar el servicio: durante un periodo conviven la credencial vieja y la nueva.</p>`},

 {t:"orden", p:"Ordena la evolución de la gestión de secretos, de peor a mejor",
  items:["Contraseña escrita en el código","Contraseña en un fichero .env en el servidor","Secretos del CI/CD inyectados como variables","Gestor de secretos con acceso por identidad y auditoría","Secretos dinámicos que caducan solos"],
  why:"Cada escalón reduce el riesgo y el impacto de una filtración."},

 {t:"vf", p:"Si un secreto se filtra, basta con borrarlo del sitio donde apareció.",
  ok:false,
  why:"Hay que rotarlo: darlo por comprometido y sustituirlo. Borrar el rastro no invalida la copia que ya pudo tener alguien."}
]},

/* =============== O7 L5 =============== */
{
id:"o7l5",
titulo:"Simulacro de entrevista DevOps",
claves:["Has repasado las preguntas más frecuentes de DevOps","Sabes contar un pipeline completo de principio a fin","Sabes responder a «producción se ha caído, ¿qué haces?»"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas, como en la entrevista",
  c:`<p>Contesta en voz alta antes de elegir. Muchas de estas preguntas combinan lo que has visto en los tres cursos.</p>`},

 {t:"opcion", p:"«Descríbeme el camino de un cambio desde el commit hasta producción.»",
  ops:["Lo subo por FTP al servidor",
       "Commit en una rama, PR con revisión; el CI compila, prueba, escanea y construye una imagen etiquetada por SHA que sube al registry; se despliega en staging, se valida y se promociona a producción con rolling o canary, vigilando métricas y con rollback preparado",
       "Hago merge a main y reinicio el servidor",
       "Lo prueba QA a mano y luego sistemas lo instala"],
  ok:1,
  why:"La respuesta completa encadena Git, CI, Docker, registry, estrategias de despliegue y observabilidad."},

 {t:"opcion", p:"«Producción está caída. ¿Qué haces?»",
  ops:["Busco el fallo en el código hasta encontrarlo",
       "Confirmo el impacto con métricas, miro qué cambió recientemente, mitigo primero (rollback, flag, escalar), verifico que se recupera, comunico, y después investigo la causa y hago un postmortem sin culpables",
       "Reinicio todos los servidores",
       "Espero a que alguien más lo arregle"],
  ok:1,
  why:"Mitigar primero, investigar después. Y comunicar durante."},

 {t:"opcion", p:"«¿Qué diferencia hay entre Terraform y Ansible?»",
  ops:["Son lo mismo",
       "Terraform aprovisiona infraestructura de forma declarativa y guarda estado; Ansible configura lo que hay dentro de las máquinas por SSH, de forma idempotente",
       "Ansible es solo para Windows",
       "Terraform solo funciona en AWS"],
  ok:1,
  why:"Aprovisionar contra configurar. Y se complementan."},

 {t:"opcion", p:"«¿Liveness o readiness probe?»",
  ops:["Son iguales",
       "Liveness reinicia el contenedor si deja de responder; readiness lo saca del balanceo mientras no está listo, sin reiniciarlo",
       "Readiness reinicia y liveness no",
       "Solo existen en Docker"],
  ok:1,
  why:"Confundirlas causa reinicios en bucle de aplicaciones lentas en arrancar."},

 {t:"opcion", p:"«¿Qué son SLO y error budget?»",
  ops:["Tipos de servidor",
       "El SLO es el objetivo de fiabilidad (por ejemplo, 99,9%); el error budget es el margen de fallo que deja, y si se agota se prioriza la fiabilidad sobre las funcionalidades",
       "Métricas de CPU",
       "Contratos con el proveedor cloud"],
  ok:1,
  why:"Convierte la fiabilidad en una decisión con datos."},

 {t:"opcion", p:"«¿Cómo gestionas los secretos?»",
  ops:["En un .env dentro del repositorio",
       "Fuera del código y de las imágenes: en un gestor de secretos o en los secretos del CI, con acceso por identidad, mínimo privilegio, auditoría y rotación; y OIDC en lugar de claves permanentes en los pipelines",
       "Cifrados en base64",
       "En variables ENV del Dockerfile"],
  ok:1,
  why:"Y la trampa de la opción de base64: no es cifrado."},

 {t:"opcion", p:"«¿Qué métricas vigilarías en una API?»",
  ops:["Solo la CPU",
       "RED: tasa de peticiones, errores y duración (en percentiles p95/p99), más saturación de recursos; y alertas sobre síntomas que afecten a usuarios",
       "El número de líneas de código",
       "La memoria del portátil del desarrollador"],
  ok:1,
  why:"RED + percentiles + alertas sobre síntomas: una respuesta de nivel."},

 {t:"opcion", p:"«Te preguntan por una herramienta que no has usado, por ejemplo Argo CD.» ¿Qué respondes?",
  ops:["Invento que la uso a diario",
       "Digo que no la he usado en producción, pero explico lo que sé: es una herramienta GitOps que sincroniza el clúster con lo declarado en Git, y relaciono el concepto con lo que sí conozco",
       "Digo que no sé nada y cambio de tema",
       "Digo que es mala herramienta"],
  ok:1,
  why:"Honestidad más el modelo mental correcto. Un buen entrevistador valora eso por encima de fingir."},

 {t:"info", eti:"Terminado", h:"Has completado la ruta DevOps",
  c:`<p>Con Docker, Git y GitHub y este curso, tienes una visión completa del ciclo: desde el primer commit hasta operar el servicio en producción, pasando por contenedores, pipelines, infraestructura como código, Kubernetes, observabilidad y seguridad.</p>
     <p>El siguiente paso es <b>practicar con proyectos reales</b>: dockeriza una aplicación tuya, súbela a GitHub con un pipeline de Actions que construya la imagen, y despliégala en un servidor o en un clúster local. Y cuenta tu experiencia en la comunidad: explicar lo aprendido es la mejor forma de fijarlo.</p>`}
]}

]});
