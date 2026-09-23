window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "La nube y AWS",
resumen: "Qué es la computación en la nube, regiones y zonas de disponibilidad, la cuenta, la consola y la CLI, responsabilidad compartida y costes",
nivel: "Fundamentos",
color: "#f29e4c",
lecciones: [

{
id:"aw1l1",
titulo:"Qué es la nube",
claves:["La nube alquila infraestructura bajo demanda y se paga por uso","IaaS, PaaS, SaaS y serverless: cuánto gestionas tú","AWS es el proveedor más grande, seguido de Azure y Google Cloud"],
pasos:[
 {t:"info", eti:"Empezamos", h:"De tener servidores a alquilarlos",
  c:`<p>Antes, para lanzar una aplicación había que comprar servidores, instalarlos en un centro de datos y esperar semanas. En la <b>nube</b> pides recursos (máquinas, bases de datos, almacenamiento) por una API y los tienes en minutos. Pagas por lo que usas y los apagas cuando no hacen falta.</p>
     <ul><li><b>Elasticidad</b>: crecer y decrecer con la demanda.</li>
     <li><b>Alcance global</b>: desplegar en otros continentes con unos clics.</li>
     <li><b>Servicios gestionados</b>: el proveedor se encarga de parches, copias o alta disponibilidad.</li></ul>`},
 {t:"par", p:"Empareja cada modelo con quién gestiona qué",
  pares:[["IaaS (EC2)","Tú gestionas el sistema operativo y todo lo de encima"],["PaaS (Elastic Beanstalk, App Runner)","Tú gestionas la aplicación; la plataforma, el resto"],["SaaS (Gmail, Slack)","Usas el software ya hecho"],["Serverless (Lambda)","Solo subes funciones; ni servidores ni escalado"]],
  why:"Cuanto más gestionado el servicio, menos operación y menos control."},
 {t:"opcion", p:"¿Cuál es una ventaja principal de la nube frente a comprar servidores propios?",
  ops:["Siempre es más barata en cualquier caso","Obtener recursos en minutos, pagar por uso y escalar según la demanda","No hay que pensar en seguridad","No necesita internet"],
  ok:1, why:"No siempre es más barata: con cargas constantes y grandes, a veces no. Su ventaja es la agilidad."},
 {t:"vf", p:"En la nube el proveedor es responsable de todo, incluida la seguridad de tu aplicación.",
  ok:false, why:"Responsabilidad compartida: AWS protege la infraestructura; tú, lo que pones en ella."}
]},

{
id:"aw1l2",
titulo:"Regiones y zonas de disponibilidad",
claves:["Una región es una zona geográfica (eu-west-1 Irlanda, eu-south-2 España)","Cada región tiene varias zonas de disponibilidad (AZ): centros de datos separados","Alta disponibilidad = repartir en varias AZ; recuperación ante desastres = otra región"],
pasos:[
 {t:"info", eti:"Geografía", h:"Regiones y AZ",
  c:`<div class="dg"><div class="dg-tit">una región y sus zonas de disponibilidad</div>
<div class="dg-caja acento">Región eu-west-1 (Irlanda)</div>
<div class="dg-fila" style="margin-top:6px"><div class="dg-caja ok doble">AZ eu-west-1a<small>uno o varios centros de datos</small></div><div class="dg-caja ok doble">AZ eu-west-1b<small>uno o varios centros de datos</small></div><div class="dg-caja ok doble">AZ eu-west-1c<small>uno o varios centros de datos</small></div></div>
<div class="dg-nota arriba" style="margin-top:6px">separadas km entre sí, con energía y red propias, y unidas con red de baja latencia</div>
<div class="dg-caja base doble" style="margin-top:12px">Edge locations<small>cientos de puntos para CloudFront (CDN) y Route 53</small></div>
</div>
     <p>Una AZ puede fallar (incendio, corte eléctrico). Por eso una arquitectura seria reparte instancias y bases de datos en <b>al menos dos AZ</b>. La región se elige por latencia a tus usuarios, precio, servicios disponibles y requisitos legales (datos en la UE).</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Región","Área geográfica con varias zonas de disponibilidad"],["Zona de disponibilidad","Uno o más centros de datos aislados dentro de una región"],["Edge location","Punto de presencia para la CDN y el DNS"],["Multi-AZ","Desplegar en varias zonas para sobrevivir al fallo de una"]],
  why:"Casi todos los servicios de AWS son regionales; IAM, Route 53 y CloudFront son globales."},
 {t:"opcion", p:"Tu aplicación debe seguir funcionando si falla un centro de datos entero. ¿Qué haces?",
  ops:["Una instancia más grande","Repartir las instancias y la base de datos en varias zonas de disponibilidad","Cambiar de región","Hacer backups diarios"],
  ok:1, why:"Multi-AZ es la base de la alta disponibilidad; multi-región es para desastres regionales."},
 {t:"vf", p:"Todas las regiones de AWS ofrecen exactamente los mismos servicios y precios.",
  ok:false, why:"Varían los servicios disponibles y los precios según la región."}
]},

{
id:"aw1l3",
titulo:"La cuenta, la consola y la CLI",
claves:["La cuenta raíz solo para tareas excepcionales: protégela con MFA y no la uses a diario","Consola web para explorar; CLI y código para trabajar de forma repetible","Activa alertas de presupuesto desde el primer día"],
pasos:[
 {t:"info", eti:"Primeros pasos seguros", h:"La cuenta",
  c:`<ol><li>Crea la cuenta y activa <b>MFA</b> en el usuario raíz. Guarda sus credenciales y no las vuelvas a usar salvo emergencias.</li>
     <li>Crea un acceso administrativo con <b>IAM Identity Center</b> (o un usuario IAM con MFA).</li>
     <li>Crea un <b>presupuesto</b> (AWS Budgets) con alerta por correo, por ejemplo a 10 €.</li>
     <li>Trabaja con la CLI y, sobre todo, con infraestructura como código (Terraform).</li></ol>`},
 {t:"info", eti:"Terminal", h:"AWS CLI",
  c:`<div class="termbox">aws configure sso                      # iniciar sesion con Identity Center
aws sts get-caller-identity            # quien soy
aws s3 ls                              # listar buckets
aws ec2 describe-instances --region eu-west-1 --query "Reservations[].Instances[].InstanceId"
aws logs tail /aws/lambda/mi-funcion --follow</div>`},
 {t:"term", p:"Comprueba con qué identidad estás usando la CLI de AWS",
  prompt:"pablo@portatil:~$", sol:["aws sts get-caller-identity"],
  pista:"aws sts y la operación get-caller-identity.",
  salida:`{
    "UserId": "AROAXXXXXXXX:pablo",
    "Account": "123456789012",
    "Arn": "arn:aws:sts::123456789012:assumed-role/Administradores/pablo"
}`, why:"Lo primero que se ejecuta cuando algo da «Access Denied»: confirmar quién eres y en qué cuenta."},
 {t:"par", p:"Empareja cada práctica con su motivo",
  pares:[["MFA en la cuenta raíz","La raíz lo puede todo, incluso cerrar la cuenta"],["No usar la raíz a diario","Reducir el riesgo si se filtran credenciales"],["Alerta de presupuesto","Enterarte pronto de un gasto inesperado"],["Infraestructura como código","Cambios revisables y repetibles"]],
  why:"Las facturas sorpresa por claves filtradas que minan criptomonedas son un clásico."}
]},

{
id:"aw1l4",
titulo:"Responsabilidad compartida y costes",
claves:["AWS: seguridad «de» la nube; tú: seguridad «en» la nube","Se paga por cómputo, almacenamiento y, a menudo sorprendentemente, transferencia de datos","Etiquetas (tags) y Cost Explorer para saber quién gasta qué"],
pasos:[
 {t:"info", eti:"Quién responde de qué", h:"Modelo de responsabilidad compartida",
  c:`<div class="dg"><div class="dg-tit">modelo de responsabilidad compartida</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Tu responsabilidad<br><small>seguridad EN la nube</small></div>
<div class="dg-caja acento">datos, cifrado</div><div class="dg-caja acento">IAM y permisos</div><div class="dg-caja acento">configuración de red (grupos de seguridad)</div><div class="dg-caja acento">sistema operativo y parches (en EC2)</div><div class="dg-caja acento">tu aplicación</div></div>
<div class="dg-col"><div class="dg-col-tit">AWS<br><small>seguridad DE la nube</small></div>
<div class="dg-caja base">centros de datos</div><div class="dg-caja base">hardware</div><div class="dg-caja base">red física</div><div class="dg-caja base">hipervisor</div><div class="dg-caja base">el software de los servicios gestionados</div></div>
</div></div>
     <p>Un bucket S3 público con datos de clientes es responsabilidad <b>tuya</b>, no de AWS.</p>`},
 {t:"par", p:"Empareja cada tarea con quién es responsable",
  pares:[["Seguridad física del centro de datos","AWS: es infraestructura suya"],["Parches del sistema operativo de una EC2","Tú: la máquina virtual es tuya"],["Parches del motor de base de datos en RDS","AWS: es un servicio gestionado"],["Permisos de acceso a un bucket","Tú: la configuración de IAM y S3 es tuya"],["Cifrar datos sensibles","Tú, con las herramientas que ofrece AWS (KMS)"]],
  why:"En servicios más gestionados, AWS asume más parte."},
 {t:"info", eti:"Dinero", h:"Cómo se factura",
  c:`<ul><li><b>Cómputo</b>: por segundo u hora (EC2, Fargate) o por invocación (Lambda).</li>
     <li><b>Almacenamiento</b>: por GB al mes (S3, EBS).</li>
     <li><b>Transferencia</b>: la entrada suele ser gratis; la <b>salida</b> a internet y entre AZ se paga. El NAT Gateway cobra por GB procesado.</li>
     <li>Descuentos: <b>Savings Plans</b> y reservas por compromiso de uso; <b>Spot</b> hasta un 90% más barato pero interrumpible.</li></ul>`},
 {t:"opcion", p:"Una factura se dispara por un concepto de «NAT Gateway - Data processed». ¿Qué suele ser?",
  ops:["Un error de AWS","Tráfico de instancias privadas saliendo por el NAT (por ejemplo, descargar imágenes de ECR o datos de S3); se reduce con VPC endpoints","Demasiados usuarios IAM","Logs de CloudTrail"],
  ok:1, why:"Lo viste en el curso de redes: endpoints para S3 y ECR."}
]}

]});
