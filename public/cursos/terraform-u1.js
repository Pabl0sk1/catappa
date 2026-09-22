window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Infraestructura como código",
resumen: "Qué es IaC, Terraform y OpenTofu, el flujo init, plan, apply y destroy, y tu primera infraestructura",
nivel: "Fundamentos",
color: "#b58cf5",
lecciones: [

{
id:"tf1l1",
titulo:"Qué es la infraestructura como código",
claves:["IaC: describir la infraestructura en ficheros versionados en Git en vez de hacer clics","Terraform es declarativo: dices el estado deseado y calcula los cambios","Funciona con cientos de proveedores: AWS, Azure, GCP, Kubernetes, GitHub, Cloudflare..."],
pasos:[
 {t:"info", eti:"Empezamos", h:"De clics a código",
  c:`<p>Crear una VPC, subredes, un balanceador y una base de datos a mano en la consola lleva una tarde, no deja rastro de qué se hizo y es imposible de repetir igual en otro entorno.</p>
     <p>Con <b>infraestructura como código</b> (IaC) la describes en ficheros:</p>
     <ul><li><b>Repetible</b>: staging y producción idénticos.</li>
     <li><b>Revisable</b>: los cambios pasan por Pull Request.</li>
     <li><b>Versionada</b>: sabes quién cambió qué y puedes volver atrás.</li>
     <li><b>Documentada</b>: el código es la documentación.</li></ul>`},
 {t:"info", eti:"Terraform", h:"Declarativo",
  c:`<div class="termbox">resource "aws_s3_bucket" "backups" {
  bucket = "backups-catappa-prod"
  tags   = { entorno = "prod" }
}</div>
     <p>No dices «crea un bucket»: dices «debe existir este bucket». Terraform compara con lo que existe y calcula qué crear, modificar o borrar. <b>OpenTofu</b> es la bifurcación libre de Terraform, compatible en la práctica.</p>`},
 {t:"par", p:"Empareja cada herramienta con su enfoque",
  pares:[["Terraform / OpenTofu","Declarativo, multiproveedor, con estado"],["CloudFormation","Declarativo, solo AWS"],["Pulumi","Infraestructura con lenguajes de programación"],["Ansible","Configurar servidores (paquetes, ficheros)"],["Scripts con la CLI","Imperativo: pasos a mano, difícil de mantener"]],
  why:"Terraform crea la infraestructura; Ansible suele configurar lo que hay dentro de los servidores."},
 {t:"opcion", p:"¿Qué significa que Terraform sea declarativo?",
  ops:["Que se escribe en inglés","Que describes el resultado final y Terraform calcula los pasos para llegar a él","Que ejecuta los comandos en orden","Que no guarda nada"],
  ok:1, why:"Si ejecutas dos veces el mismo código sin cambios, la segunda vez no hace nada: es idempotente."},
 {t:"vf", p:"Con IaC, los cambios de infraestructura pueden revisarse en un Pull Request como el código de la aplicación.",
  ok:true, why:"Y el plan de Terraform muestra exactamente qué va a cambiar antes de aplicarlo."}
]},

{
id:"tf1l2",
titulo:"El flujo de trabajo",
claves:["init descarga providers y prepara el backend","plan muestra qué va a cambiar sin tocar nada","apply aplica el plan; destroy lo elimina todo"],
pasos:[
 {t:"info", eti:"Cuatro comandos", h:"init, plan, apply, destroy",
  c:`<div class="termbox">terraform init        # descarga providers y modulos, configura el estado
terraform fmt         # formatea el codigo
terraform validate    # comprueba la sintaxis
terraform plan        # que va a cambiar: + crear, ~ modificar, - destruir
terraform apply       # aplica (pide confirmacion)
terraform destroy     # elimina todo lo gestionado</div>
     <div class="termbox">Terraform will perform the following actions:

  # aws_s3_bucket.backups will be created
  + resource "aws_s3_bucket" "backups" {
      + bucket = "backups-catappa-prod"
      + id     = (known after apply)
    }

Plan: 1 to add, 0 to change, 0 to destroy.</div>`},
 {t:"orden", p:"Ordena el flujo habitual para aplicar un cambio",
  items:["Editar los ficheros .tf","terraform fmt y validate","terraform plan y revisar el resultado","terraform apply","Comprobar el resultado y hacer commit (o fusionar el PR)"],
  why:"El paso crítico es leer el plan: especialmente las líneas con - (destruir) o -/+ (recrear)."},
 {t:"term", p:"Muestra qué cambios aplicaría Terraform sin aplicarlos",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan","tofu plan"],
  pista:"terraform y el subcomando que planifica.",
  salida:`Plan: 3 to add, 1 to change, 0 to destroy.`, why:"plan nunca modifica la infraestructura."},
 {t:"par", p:"Empareja cada símbolo del plan con su significado",
  pares:[["+","Se va a crear"],["~","Se va a modificar sin recrear"],["-","Se va a destruir"],["-/+","Se destruye y se vuelve a crear (reemplazo)"],["(known after apply)","Valor que solo se sabrá al crearlo"]],
  why:"Un -/+ inesperado en una base de datos significa perder datos: detente y revisa."}
]},

{
id:"tf1l3",
titulo:"Tu primera infraestructura",
claves:["Un proyecto es una carpeta con ficheros .tf","El bloque terraform fija versiones; provider configura el proveedor","Un recurso tiene tipo y nombre local: aws_instance.web"],
pasos:[
 {t:"info", eti:"Manos a la obra", h:"Estructura mínima",
  c:`<div class="diag">infra/
  versions.tf    versiones de Terraform y providers
  providers.tf   configuracion del provider
  main.tf        recursos
  variables.tf   entradas
  outputs.tf     salidas</div>
     <div class="termbox">terraform {
  required_version = "&gt;= 1.9"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~&gt; 6.0" }
  }
}

provider "aws" {
  region = "eu-west-1"
  default_tags { tags = { proyecto = "catappa", gestionado = "terraform" } }
}

resource "aws_s3_bucket" "backups" {
  bucket = "backups-catappa-prod"
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id           # referencia a otro recurso
  versioning_configuration { status = "Enabled" }
}</div>`},
 {t:"par", p:"Empareja cada bloque con su función",
  pares:[["terraform { required_providers }","Fijar qué providers y versiones se usan"],["provider \"aws\"","Configurar el proveedor (región, etiquetas por defecto)"],["resource \"tipo\" \"nombre\"","Algo que Terraform crea y gestiona"],["aws_s3_bucket.backups.id","Referencia a un atributo de otro recurso"]],
  why:"Las referencias crean dependencias implícitas: Terraform crea primero el bucket y luego el versionado."},
 {t:"opcion", p:"¿Qué significa <code>version = \"~&gt; 6.0\"</code> en el provider?",
  ops:["Exactamente 6.0","Cualquier 6.x (6.0 o superior, pero menor que 7.0)","Cualquier versión","Menor que 6"],
  ok:1, why:"Evita que una versión mayor con cambios incompatibles entre sin querer. El .terraform.lock.hcl fija la exacta."},
 {t:"vf", p:"El fichero <code>.terraform.lock.hcl</code> debe subirse a Git.",
  ok:true, why:"Fija las versiones exactas de los providers para todo el equipo y el CI (la carpeta .terraform/ no)."}
]},

{
id:"tf1l4",
titulo:"Providers y credenciales",
claves:["Un provider traduce tus recursos a llamadas a la API de una plataforma","Credenciales desde el entorno, perfiles o roles; nunca en el código","alias permite varios proveedores del mismo tipo (otra región u otra cuenta)"],
pasos:[
 {t:"info", eti:"El traductor", h:"Qué hace un provider",
  c:`<p>Terraform en sí no sabe nada de AWS ni de Kubernetes. Los <b>providers</b> son plugins que conocen la API de cada plataforma: <code>hashicorp/aws</code>, <code>hashicorp/kubernetes</code>, <code>integrations/github</code>, <code>cloudflare/cloudflare</code>... Se descargan con <code>terraform init</code> desde el registro.</p>
     <div class="termbox">provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  alias  = "virginia"            # segunda configuracion
  region = "us-east-1"
}

resource "aws_acm_certificate" "cdn" {
  provider    = aws.virginia     # CloudFront exige certificados en us-east-1
  domain_name = "catappa.dev"
  validation_method = "DNS"
}</div>`},
 {t:"info", eti:"Sin secretos en el código", h:"Credenciales",
  c:`<p>El provider de AWS busca credenciales en este orden aproximado: variables de entorno (<code>AWS_ACCESS_KEY_ID</code>...), perfil de <code>~/.aws</code> (incluido SSO), y el <b>rol</b> de la máquina o del pipeline (OIDC). Nunca escribas claves en los ficheros <code>.tf</code>: acabarían en Git y en el estado.</p>
     <div class="termbox">aws sso login --profile catappa-prod
AWS_PROFILE=catappa-prod terraform plan</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["provider \"aws\" { region }","Configurar a qué región y cuenta hablar"],["alias","Tener una segunda configuración del mismo provider"],["provider = aws.virginia","Usar esa configuración concreta en un recurso"],["AWS_PROFILE","Elegir el perfil de credenciales sin tocar el código"],["assume_role en el provider","Trabajar en otra cuenta asumiendo un rol"]],
  why:"Con alias y assume_role, un mismo código gestiona varias regiones o cuentas."},
 {t:"opcion", p:"¿Dónde deben estar las credenciales de AWS que usa Terraform en el pipeline?",
  ops:["En provider \"aws\" { access_key = ... }","En un rol que el pipeline asume con OIDC, sin claves guardadas","En terraform.tfvars","En un comentario"],
  ok:1, why:"Credenciales temporales y sin secretos que robar."},
 {t:"vf", p:"Un proyecto de Terraform puede usar a la vez providers de AWS, Cloudflare y GitHub.",
  ok:true, why:"Por ejemplo: crear la infraestructura, el registro DNS y los secretos del repositorio en un mismo plan."}
]}

]});
