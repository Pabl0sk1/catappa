window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Contenedores en AWS",
resumen: "ECR para imágenes, ECS con Fargate, EKS para Kubernetes y cómo elegir entre ellos",
nivel: "Avanzado",
color: "#db8229",
lecciones: [

{
id:"aw7l1",
titulo:"ECR y ECS con Fargate",
claves:["ECR es el registry privado de imágenes de AWS, con escaneo de vulnerabilidades","ECS ejecuta contenedores con definiciones de tarea y servicios","Fargate: sin servidores que gestionar; pagas por CPU y memoria de cada tarea"],
pasos:[
 {t:"info", eti:"Imágenes", h:"ECR",
  c:`<div class="termbox">aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.eu-west-1.amazonaws.com
docker tag tareas-api:1.4.0 123456789012.dkr.ecr.eu-west-1.amazonaws.com/tareas-api:1.4.0
docker push 123456789012.dkr.ecr.eu-west-1.amazonaws.com/tareas-api:1.4.0</div>`},
 {t:"info", eti:"Orquestador de AWS", h:"ECS y Fargate",
  c:`<ul><li><b>Task definition</b>: qué imagen, CPU, memoria, puertos, variables, secretos y rol (como un pod).</li>
     <li><b>Service</b>: mantiene N tareas en marcha detrás de un ALB, con despliegues rolling o blue/green (como un Deployment).</li>
     <li><b>Fargate</b>: AWS pone las máquinas; tú solo las tareas.</li></ul>
     <div class="termbox">aws ecs update-service --cluster prod --service tareas-api --force-new-deployment</div>`},
 {t:"par", p:"Empareja cada concepto de ECS con su equivalente en Kubernetes",
  pares:[["Task definition","Especificación del pod"],["Task","Pod en ejecución"],["Service","Deployment + Service"],["Cluster","Clúster"],["Task role","ServiceAccount con permisos de AWS"]],
  why:"Si sabes Kubernetes, ECS se aprende en una tarde."},
 {t:"opcion", p:"¿Cómo pasa ECS los secretos (contraseña de la base de datos) a un contenedor de forma segura?",
  ops:["En la imagen","Referenciando Secrets Manager o Parameter Store en la task definition; se inyectan como variables al arrancar","En el código","En un fichero público de S3"],
  ok:1, why:"El rol de ejecución de la tarea necesita permiso para leer ese secreto."}
]},

{
id:"aw7l2",
titulo:"EKS y cómo elegir",
claves:["EKS es Kubernetes gestionado: AWS opera el plano de control","Nodos gestionados, Fargate o Karpenter; Pod Identity o IRSA para permisos de AWS","Elegir: App Runner o ECS por simplicidad; EKS por ecosistema y portabilidad"],
pasos:[
 {t:"info", eti:"Kubernetes gestionado", h:"EKS",
  c:`<ul><li>AWS gestiona el API server y etcd, en varias AZ.</li>
     <li>Tú eliges los nodos: <b>grupos gestionados</b>, <b>Karpenter</b> o <b>Fargate</b>.</li>
     <li><b>AWS Load Balancer Controller</b> crea ALB/NLB a partir de Ingress y Services.</li>
     <li><b>EKS Pod Identity</b> (o IRSA) da a cada ServiceAccount su propio rol de IAM.</li>
     <li>Complementos: VPC CNI (IPs de la VPC para los pods), CoreDNS, EBS CSI driver.</li></ul>`},
 {t:"par", p:"Empareja cada servicio con cuándo elegirlo",
  pares:[["App Runner","Una API o web sencilla desde una imagen, sin gestionar casi nada"],["ECS con Fargate","Varios servicios en AWS con poca complejidad operativa"],["EKS","Plataforma Kubernetes, ecosistema (Helm, Argo CD) y portabilidad"],["Lambda","Funciones cortas dirigidas por eventos"]],
  why:"EKS da más poder a cambio de más operación: no siempre compensa."},
 {t:"opcion", p:"¿Cómo da permisos a un pod de EKS para escribir en un bucket, sin claves?",
  ops:["Montando las claves en un Secret","Asociando a su ServiceAccount un rol de IAM con EKS Pod Identity o IRSA","Dando el permiso al nodo entero","Haciendo el bucket público"],
  ok:1, why:"Permisos por aplicación, no por nodo: mínimo privilegio."}
]},

{
id:"aw7l3",
titulo:"Laboratorio: tu API en ECS Fargate",
claves:["Imagen en ECR, task definition con secretos de Secrets Manager y logs en CloudWatch","Servicio ECS con ALB, en subredes privadas y con autoescalado","Despliegue desde GitHub Actions con OIDC"],
pasos:[
 {t:"orden", p:"Ordena el despliegue de tu API de Spring en ECS Fargate",
  items:["Crear el repositorio de ECR y subir la imagen","Guardar la URL y la contraseña de la base de datos en Secrets Manager","Crear la task definition con la imagen, CPU, memoria, secretos y logs","Crear el servicio ECS con el ALB y las subredes privadas","Configurar el autoescalado del servicio por CPU o peticiones","Automatizar: GitHub Actions construye, sube a ECR y actualiza el servicio"],
  why:"Es el mismo flujo que harías con Kubernetes, con menos piezas que gestionar."},
 {t:"par", p:"Empareja cada parte de la task definition con su contenido",
  pares:[["image","La imagen de ECR con su tag"],["secrets","Referencias a Secrets Manager que se inyectan como variables"],["logConfiguration","Envío de la salida a CloudWatch Logs"],["taskRoleArn","Permisos de la aplicación (por ejemplo, S3)"],["executionRoleArn","Permisos de ECS para descargar la imagen y leer secretos"]],
  why:"Dos roles distintos: uno para la plataforma y otro para tu aplicación."},
 {t:"opcion", p:"La tarea arranca y se para enseguida con «ResourceInitializationError: unable to pull secrets». ¿Qué falta?",
  ops:["Más memoria","Permiso del execution role para leer ese secreto (y ruta de red a Secrets Manager: NAT o endpoint)","Un Ingress","Un health check"],
  ok:1, why:"El execution role es quien lee los secretos al arrancar."}
]}

]});
