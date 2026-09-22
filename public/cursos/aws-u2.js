window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "IAM: identidades y permisos",
resumen: "Usuarios, grupos y roles, políticas JSON, cómo se evalúan los permisos, roles para servicios y buenas prácticas",
nivel: "Fundamentos",
color: "#f29e4c",
lecciones: [

{
id:"aw2l1",
titulo:"Usuarios, grupos y roles",
claves:["IAM controla quién puede hacer qué en la cuenta","Personas: Identity Center o usuarios en grupos; nunca claves de acceso permanentes si se puede evitar","Roles: identidades temporales que asumen servicios, aplicaciones u otras cuentas"],
pasos:[
 {t:"info", eti:"Quién", h:"Identidades en IAM",
  c:`<ul><li><b>Usuario IAM</b>: una identidad con credenciales permanentes. Hoy se prefiere <b>IAM Identity Center</b> (SSO) para personas.</li>
     <li><b>Grupo</b>: conjunto de usuarios con los mismos permisos (desarrolladores, soporte).</li>
     <li><b>Rol</b>: identidad sin credenciales fijas que alguien <b>asume</b> y recibe credenciales temporales. Lo usan EC2, Lambda, pods de EKS, pipelines de CI o personas de otra cuenta.</li></ul>
     <p>Una aplicación en una EC2 no lleva claves: la instancia tiene un <b>rol</b> y el SDK obtiene credenciales temporales automáticamente.</p>`},
 {t:"par", p:"Empareja cada identidad con su uso típico",
  pares:[["IAM Identity Center","Acceso de personas con SSO y MFA"],["Grupo IAM","Asignar los mismos permisos a varios usuarios"],["Rol para EC2","Que la aplicación acceda a S3 sin claves"],["Rol con OIDC para GitHub Actions","Que el pipeline despliegue sin guardar claves en secretos"],["Usuario raíz","Solo tareas excepcionales de la cuenta"]],
  why:"Credenciales temporales en vez de claves permanentes: menos daño si se filtran."},
 {t:"opcion", p:"Tu aplicación en una EC2 necesita leer de S3. ¿Cuál es la forma correcta?",
  ops:["Poner la access key en application.yml","Asignar a la instancia un rol IAM con permiso de lectura sobre ese bucket","Hacer el bucket público","Usar las credenciales del root"],
  ok:1, why:"El SDK de Java, Python o Node obtiene las credenciales del rol automáticamente."},
 {t:"vf", p:"Un rol IAM tiene una contraseña fija que se comparte con quien lo usa.",
  ok:false, why:"Un rol se asume y entrega credenciales temporales que caducan."}
]},

{
id:"aw2l2",
titulo:"Políticas",
claves:["Una política es un JSON con Effect, Action, Resource y opcionalmente Condition","Por defecto todo está denegado; un Deny explícito gana siempre","Mínimo privilegio: acciones y recursos concretos, no *"],
pasos:[
 {t:"info", eti:"Permisos en JSON", h:"Anatomía de una política",
  c:`<div class="termbox">{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::facturas-catappa/*"
    },
    {
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "*",
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    }
  ]
}</div>
     <p>Los recursos se identifican con <b>ARN</b> (Amazon Resource Name): <code>arn:aws:servicio:región:cuenta:recurso</code>.</p>`},
 {t:"orden", p:"Ordena cómo evalúa AWS una petición",
  items:["Por defecto, todo está denegado","Se revisan todas las políticas aplicables","Si hay algún Deny explícito que coincide, se deniega","Si no, y hay un Allow que coincide, se permite","Si no hay ningún Allow, se deniega"],
  why:"Un Deny explícito gana a cualquier Allow."},
 {t:"par", p:"Empareja cada campo de la política con su significado",
  pares:[["Effect","Allow o Deny"],["Action","Qué operaciones (s3:GetObject)"],["Resource","Sobre qué recursos (ARN)"],["Condition","En qué circunstancias (IP, MFA, etiquetas, HTTPS)"],["Principal","A quién se aplica (en políticas de recurso)"]],
  why:"Las políticas de recurso (como la de un bucket) incluyen Principal; las de identidad, no."},
 {t:"opcion", p:"¿Qué problema tiene una política con <code>\"Action\": \"*\", \"Resource\": \"*\"</code> para una aplicación?",
  ops:["Ninguno","Le da control total de la cuenta: si la aplicación se compromete, el atacante puede hacer cualquier cosa","No funciona","Es más lenta"],
  ok:1, why:"IAM Access Analyzer ayuda a generar políticas mínimas a partir del uso real."}
]},

{
id:"aw2l3",
titulo:"Buenas prácticas de IAM",
claves:["MFA para personas; nada de claves de acceso de larga duración","Roles y credenciales temporales para máquinas y pipelines","Varias cuentas con AWS Organizations para separar entornos"],
pasos:[
 {t:"info", eti:"Seguro por diseño", h:"Lista de comprobación",
  c:`<ul><li>MFA obligatorio; la cuenta raíz guardada bajo llave.</li>
     <li>Personas con <b>Identity Center</b> y permisos por grupo.</li>
     <li>Aplicaciones con <b>roles</b> (EC2, ECS, Lambda, IRSA o Pod Identity en EKS).</li>
     <li>CI/CD con <b>OIDC</b>: GitHub Actions asume un rol sin guardar claves.</li>
     <li><b>Cuentas separadas</b> para producción, staging y desarrollo, bajo AWS Organizations.</li>
     <li>Revisar permisos no usados y activar CloudTrail.</li></ul>`},
 {t:"par", p:"Empareja cada práctica con el riesgo que reduce",
  pares:[["OIDC en GitHub Actions","Claves de AWS robadas de los secretos del repositorio"],["Cuentas separadas por entorno","Que un error en desarrollo afecte a producción"],["MFA","Contraseñas filtradas"],["Access Analyzer","Recursos compartidos públicamente sin querer"],["CloudTrail","No saber quién hizo un cambio"]],
  why:"Estas prácticas aparecen en cualquier auditoría de seguridad en AWS."},
 {t:"vf", p:"Guardar una access key de administrador en los secretos de GitHub es la forma recomendada de desplegar desde el CI.",
  ok:false, why:"Lo recomendado es OIDC: el pipeline asume un rol con credenciales temporales y permisos limitados."}
]},

{
id:"aw2l4",
titulo:"Políticas de recurso y acceso entre cuentas",
claves:["Algunos recursos tienen su propia política: buckets S3, colas SQS, claves KMS","Acceso entre cuentas: la otra cuenta asume un rol con una política de confianza","Permission boundaries y SCP limitan el máximo de permisos posibles"],
pasos:[
 {t:"info", eti:"Dos lados", h:"Identidad y recurso",
  c:`<div class="termbox"># politica de confianza del rol "lector-informes" en la cuenta de datos (111111111111)
{
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::222222222222:role/analitica" },
  "Action": "sts:AssumeRole",
  "Condition": { "StringEquals": { "sts:ExternalId": "catappa-analitica" } }
}

# desde la cuenta 222222222222
aws sts assume-role --role-arn arn:aws:iam::111111111111:role/lector-informes --role-session-name informe</div>
     <p>Para que una petición se permita entre cuentas, <b>ambos lados</b> deben permitirla: la política de la identidad que llama y la política de confianza (o de recurso) del destino.</p>`},
 {t:"par", p:"Empareja cada tipo de política con su función",
  pares:[["Política de identidad","Qué puede hacer un usuario o rol"],["Política de recurso (bucket, cola)","Quién puede acceder a ese recurso"],["Política de confianza de un rol","Quién puede asumir el rol"],["Permission boundary","Máximo de permisos que puede tener una identidad"],["SCP","Máximo de permisos en toda una cuenta de la organización"]],
  why:"Un Deny en cualquiera de ellas gana a todos los Allow."},
 {t:"opcion", p:"Tu equipo de analítica, en otra cuenta, necesita leer un bucket. ¿Cuál es el enfoque recomendado?",
  ops:["Hacer el bucket público","Un rol en la cuenta del bucket con permiso de lectura, cuya política de confianza permita asumirlo al rol de analítica","Compartir las claves de un usuario","Copiar los datos por correo"],
  ok:1, why:"Credenciales temporales, trazables en CloudTrail y revocables."}
]}

]});
