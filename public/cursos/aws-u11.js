window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Maestría: casos reales y entrevista",
resumen: "Incidentes típicos en AWS, preguntas de entrevista de cloud y el camino de las certificaciones",
nivel: "Maestro",
color: "#c66d14",
lecciones: [

{
id:"aw11l1",
titulo:"Incidentes en AWS",
claves:["Access Denied: identidad, política, límites de la organización o del recurso","Timeouts: grupos de seguridad, rutas, NACL o endpoints","Costes inesperados: NAT, transferencia, recursos olvidados o claves filtradas"],
pasos:[
 {t:"opcion", p:"Caso 1: tu pod en EKS recibe «AccessDenied» al leer un bucket, aunque el rol tiene s3:GetObject. ¿Qué revisas?",
  ops:["Reiniciar el clúster","Que el pod usa de verdad ese rol (ServiceAccount y Pod Identity/IRSA), que el ARN del recurso en la política es correcto (bucket/*) y que no hay un Deny en la política del bucket o en una SCP","Hacer el bucket público","Cambiar de región"],
  ok:1, why:"aws sts get-caller-identity desde el pod confirma qué identidad usa."},
 {t:"opcion", p:"Caso 2: tras desplegar en una VPC nueva, las tareas de Fargate fallan con «CannotPullContainerError». Están en subredes privadas. ¿Causa probable?",
  ops:["La imagen es muy grande","No tienen salida a ECR: falta NAT Gateway o los VPC endpoints de ECR (api y dkr) y S3","Falta memoria","El ALB está mal"],
  ok:1, why:"Descargar imágenes requiere llegar a ECR y a S3."},
 {t:"opcion", p:"Caso 3: la factura sube 3.000 € en un día. En Cost Explorer ves EC2 en una región que no usáis. ¿Qué pasa y qué haces?",
  ops:["Un error de facturación","Probablemente unas credenciales filtradas se están usando para minar: desactivar y rotar las claves, terminar las instancias, revisar CloudTrail y GuardDuty, y abrir caso con soporte","Esperar a fin de mes","Subir el presupuesto"],
  ok:1, why:"Por eso SCP que limitan regiones y alertas de presupuesto desde el primer día."},
 {t:"par", p:"Empareja cada síntoma con la primera comprobación",
  pares:[["AccessDenied","Identidad real (sts get-caller-identity) y políticas aplicables"],["Timeout entre servicios","Grupos de seguridad y tablas de rutas"],["No se descargan imágenes en subred privada","NAT o VPC endpoints"],["503 en el ALB","Health checks del target group"],["Coste inesperado","Cost Explorer por servicio, región y etiqueta"]],
  why:"El mismo método por capas de siempre, con los servicios de AWS."}
]},

{
id:"aw11l2",
titulo:"Simulacro de entrevista de AWS",
claves:["Sabes explicar IAM, VPC, cómputo, almacenamiento y bases de datos","Diseñas arquitecturas con alta disponibilidad, seguridad y control de costes","Conoces el camino de certificaciones"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Diferencia entre grupo de seguridad y NACL?»",
  ops:["Son iguales","El grupo de seguridad es con estado, por interfaz y solo permite; la NACL es sin estado, por subred y admite permitir y denegar","La NACL es más moderna","El grupo de seguridad es por región"],
  ok:1, why:"Clásica de la certificación Solutions Architect."},
 {t:"opcion", p:"«¿Cómo darías acceso a S3 a una aplicación en EC2?»",
  ops:["Con claves en el código","Con un rol de IAM asociado a la instancia (perfil de instancia) con una política de mínimo privilegio","Haciendo el bucket público","Con el usuario raíz"],
  ok:1, why:"Credenciales temporales, sin secretos en el código."},
 {t:"opcion", p:"«Diseña una aplicación web con alta disponibilidad»",
  ops:["Una EC2 grande","CloudFront y ALB delante, cómputo en varias AZ con autoescalado (ECS, EKS o ASG), base de datos Multi-AZ, sin estado en las instancias, caché gestionada, y todo en código con Terraform","Una EC2 en cada región sin balanceador","Lambda sin base de datos"],
  ok:1, why:"Menciona también copias, monitorización y alarmas."},
 {t:"opcion", p:"«¿Cómo desplegarías desde GitHub Actions a AWS de forma segura?»",
  ops:["Access keys de administrador en los secretos","OIDC: el workflow asume un rol con permisos limitados y credenciales temporales; imagen a ECR y despliegue a ECS o EKS (o GitOps con Argo CD)","Subiendo por SSH","Desde el portátil"],
  ok:1, why:"Conecta con lo que ya practicaste en el curso de DevOps."},
 {t:"par", p:"Empareja cada certificación con su perfil",
  pares:[["Cloud Practitioner","Fundamentos de la nube y de AWS"],["Solutions Architect Associate","Diseñar arquitecturas en AWS (la más demandada)"],["Developer Associate","Construir y desplegar aplicaciones en AWS"],["SysOps Administrator / DevOps Engineer","Operar, automatizar y desplegar"],["Security Specialty","Seguridad en AWS en profundidad"]],
  why:"Solutions Architect Associate es el paso natural tras este curso."},
 {t:"info", eti:"Terminado", h:"Has completado AWS",
  c:`<p>Dominas los fundamentos de la nube, IAM, VPC, EC2 y balanceo, S3, bases de datos gestionadas, contenedores, serverless y mensajería, observabilidad, seguridad, arquitectura y costes.</p>
     <p>Para consolidarlo: despliega tu API de tareas en AWS con Terraform (VPC, ECS Fargate, ALB, RDS, Secrets Manager) y un pipeline con OIDC. Destruye todo al terminar para no pagar: ese proyecto, documentado en tu GitHub, habla por ti en una entrevista.</p>`}
]}

]});
