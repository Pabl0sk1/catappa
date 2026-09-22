window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Observabilidad y seguridad en AWS",
resumen: "CloudWatch, CloudTrail, KMS, Secrets Manager, WAF, GuardDuty, Organizations y detección de configuraciones inseguras",
nivel: "Experto",
color: "#d3781e",
lecciones: [

{
id:"aw9l1",
titulo:"CloudWatch y CloudTrail",
claves:["CloudWatch: métricas, logs, alarmas y paneles","CloudTrail registra cada llamada a la API de AWS: quién hizo qué y cuándo","Alarmas sobre síntomas (errores 5xx, latencia) que avisan por SNS"],
pasos:[
 {t:"info", eti:"Ver qué pasa", h:"CloudWatch",
  c:`<ul><li><b>Métricas</b>: CPU de EC2, errores 5xx del ALB, invocaciones de Lambda, conexiones de RDS... y las tuyas propias.</li>
     <li><b>Logs</b>: los contenedores, Lambdas y servicios envían sus logs a grupos de logs. <b>Logs Insights</b> permite consultarlos.</li>
     <li><b>Alarmas</b>: cuando una métrica cruza un umbral, notifican por SNS (correo, Slack, PagerDuty) o actúan (escalar).</li></ul>
     <div class="termbox">fields @timestamp, @message
| filter @message like /ERROR/
| stats count() by bin(5m)</div>`},
 {t:"par", p:"Empareja cada servicio con la pregunta que responde",
  pares:[["CloudWatch Metrics","¿Cómo de cargado está el sistema?"],["CloudWatch Logs","¿Qué dijo la aplicación?"],["CloudTrail","¿Quién borró ese recurso y cuándo?"],["X-Ray / trazas","¿En qué servicio se va el tiempo de una petición?"],["AWS Config","¿Qué recursos incumplen nuestras reglas?"]],
  why:"CloudTrail activado y enviado a un bucket de otra cuenta es básico para auditoría."},
 {t:"opcion", p:"Alguien abrió el puerto 22 a todo internet en un grupo de seguridad. ¿Cómo sabes quién fue?",
  ops:["Preguntando","Buscando el evento AuthorizeSecurityGroupIngress en CloudTrail","En CloudWatch Metrics","En la factura"],
  ok:1, why:"Toda acción sobre la API queda registrada con usuario, IP y hora."}
]},

{
id:"aw9l2",
titulo:"Cifrado, secretos y protección",
claves:["KMS gestiona claves de cifrado con permisos y auditoría","Secrets Manager guarda y rota secretos; Parameter Store para configuración","WAF protege aplicaciones web; GuardDuty detecta amenazas; Security Hub lo centraliza"],
pasos:[
 {t:"info", eti:"Proteger", h:"Servicios de seguridad",
  c:`<ul><li><b>KMS</b>: claves con las que se cifran EBS, S3, RDS, secretos... Controlas quién puede usarlas.</li>
     <li><b>Secrets Manager</b>: contraseñas y tokens, con rotación automática (por ejemplo, la de RDS).</li>
     <li><b>WAF</b>: reglas delante de CloudFront o el ALB contra inyección SQL, XSS, bots y exceso de peticiones.</li>
     <li><b>Shield</b>: protección DDoS.</li>
     <li><b>GuardDuty</b>: detecta comportamientos sospechosos (claves usadas desde países raros, minería de criptomonedas).</li>
     <li><b>Security Hub</b> e <b>Inspector</b>: estado de seguridad y vulnerabilidades.</li></ul>`},
 {t:"par", p:"Empareja cada necesidad con el servicio",
  pares:[["Rotar la contraseña de la base de datos","Secrets Manager"],["Bloquear peticiones con patrones de inyección SQL","WAF"],["Detectar instancias que minan criptomonedas","GuardDuty"],["Controlar quién puede descifrar los backups","KMS"],["Escanear imágenes de ECR","Inspector"]],
  why:"Activar GuardDuty y Security Hub en todas las cuentas es de lo más rentable en seguridad."},
 {t:"info", eti:"Muchas cuentas", h:"Organizations y SCP",
  c:`<p>Con <b>AWS Organizations</b> agrupas cuentas (producción, staging, desarrollo, seguridad, logs) y aplicas <b>Service Control Policies</b>: límites que ni el administrador de una cuenta puede saltarse, como «prohibido usar regiones fuera de la UE» o «prohibido desactivar CloudTrail».</p>`},
 {t:"opcion", p:"¿Qué garantiza una SCP que prohíbe <code>cloudtrail:StopLogging</code>?",
  ops:["Nada","Que nadie en esas cuentas, ni siquiera un administrador, pueda detener CloudTrail","Que CloudTrail sea gratis","Que se cifren los logs"],
  ok:1, why:"Las SCP limitan el máximo de permisos posibles en la cuenta."}
]},

{
id:"aw9l3",
titulo:"Operación con Systems Manager",
claves:["Session Manager: acceso a instancias sin SSH ni bastión","Parameter Store: configuración y secretos sencillos","Patch Manager, Run Command y Automation para operar flotas"],
pasos:[
 {t:"info", eti:"Operar a escala", h:"AWS Systems Manager",
  c:`<div class="termbox">aws ssm start-session --target i-0abc123              # shell sin puerto 22
aws ssm get-parameter --name /catappa/prod/api/url --with-decryption
aws ssm send-command --document-name "AWS-RunShellScript" \\
  --targets "Key=tag:rol,Values=api" --parameters 'commands=["df -h"]'</div>
     <ul><li><b>Session Manager</b>: sesiones auditadas, sin claves ni puertos abiertos.</li>
     <li><b>Parameter Store</b>: configuración jerárquica (<code>/catappa/prod/...</code>), cifrada con KMS.</li>
     <li><b>Patch Manager</b>: ventanas de parcheo automáticas para toda la flota.</li>
     <li><b>Run Command</b> y <b>Automation</b>: ejecutar acciones en muchas instancias a la vez.</li></ul>`},
 {t:"par", p:"Empareja cada necesidad con la función de Systems Manager",
  pares:[["Entrar a una instancia privada","Session Manager"],["Guardar la URL de un servicio por entorno","Parameter Store"],["Parchear 200 servidores cada semana","Patch Manager"],["Ejecutar un comando en todas las instancias con una etiqueta","Run Command"],["Inventario de software instalado","Inventory"]],
  why:"Con SSM, las instancias no necesitan IP pública, bastión ni claves SSH."},
 {t:"opcion", p:"¿Qué necesita una instancia para aparecer en Session Manager?",
  ops:["Una IP pública","El agente de SSM (incluido en Amazon Linux y Ubuntu) y un rol con la política AmazonSSMManagedInstanceCore, con ruta a los endpoints de SSM","El puerto 22 abierto","Una clave .pem"],
  ok:1, why:"En subredes sin NAT, se añaden VPC endpoints de ssm, ssmmessages y ec2messages."}
]}

]});
