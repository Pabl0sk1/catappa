window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Infraestructura como código",
resumen: "Qué es IaC, Terraform y OpenTofu, la CLI, el flujo init, plan, apply y destroy, tu primera infraestructura y los providers",
nivel: "Fundamentos",
color: "#b58cf5",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"tf1l1",
titulo:"Qué es la infraestructura como código",
claves:["IaC: describir la infraestructura en ficheros versionados en Git en vez de hacer clics","Terraform es declarativo e idempotente: dices el estado deseado y calcula los cambios","OpenTofu es la bifurcación libre de Terraform; ambos comparten lenguaje y casi todo el ecosistema"],
pasos:[
 {t:"info", eti:"Empezamos", h:"De clics a código",
  c:`<p>Crear una VPC, subredes, un balanceador y una base de datos a mano en la consola lleva una tarde, no deja rastro de qué se hizo y es imposible de repetir igual en otro entorno. Con el tiempo cada entorno se convierte en un «copo de nieve»: único, frágil y que nadie se atreve a tocar.</p>
     <p>Con <b>infraestructura como código</b> (IaC) la describes en ficheros:</p>
     <ul><li><b>Repetible</b>: staging y producción salen de la misma receta.</li>
     <li><b>Revisable</b>: los cambios pasan por Pull Request, con el plan de lo que va a pasar.</li>
     <li><b>Versionada</b>: sabes quién cambió qué, cuándo y por qué, y puedes volver atrás.</li>
     <li><b>Documentada</b>: el código es la documentación que nunca se queda vieja.</li>
     <li><b>Recuperable</b>: si una región cae o alguien borra algo, se vuelve a crear en minutos.</li></ul>`},
 {t:"info", eti:"Declarativo", h:"Describes el resultado, no los pasos",
  c:`<div class="dg"><div class="dg-tit">imperativo frente a declarativo</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">Imperativo (script)</div><div class="dg-vert">
           <div class="dg-caja aviso">¿existe el bucket?<small>si no, créalo</small></div>
           <div class="dg-caja aviso">¿tiene versionado?<small>si no, actívalo</small></div>
           <div class="dg-caja aviso">¿etiquetas bien?<small>cámbialas una a una</small></div></div></div>
         <div class="dg-col"><div class="dg-col-tit">Declarativo (Terraform)</div><div class="dg-vert">
           <div class="dg-caja acento">código: «debe existir esto»</div>
           <div class="dg-caja">Terraform compara con lo que hay</div>
           <div class="dg-caja ok">aplica solo la diferencia</div></div></div>
       </div></div>
     <div class="termbox">resource "aws_s3_bucket" "backups" {
  bucket = "backups-catappa-prod"
  tags   = { entorno = "prod" }
}</div>
     <p>No dices «crea un bucket»: dices «debe existir este bucket». Si ya existe tal cual, no hace nada. Eso es la <b>idempotencia</b>: aplicar dos veces el mismo código da el mismo resultado que aplicarlo una.</p>`},
 {t:"info", eti:"El ecosistema", h:"Terraform y OpenTofu",
  c:`<p><b>Terraform</b> lo creó HashiCorp en 2014 (hoy parte de IBM). En agosto de 2023 cambió su licencia de MPL a <b>BSL</b>: puedes usarlo libremente en tu empresa, pero no construir un producto que compita con HashiCorp.</p>
     <p>Como respuesta nació <b>OpenTofu</b>, bifurcación libre bajo la Linux Foundation. Se usa igual cambiando el comando: <code>tofu init</code>, <code>tofu plan</code>… Lee los mismos ficheros <code>.tf</code> y usa los mismos providers.</p>
     <div class="nota"><b class="tit">¿Cuál aprendo?</b>El lenguaje (HCL), el estado, los módulos y el flujo son comunes: este curso sirve para los dos. Desde 2024 cada uno añade funciones propias (OpenTofu, por ejemplo, cifrado del estado), así que antes de usar una novedad comprueba que tu herramienta la tiene.</div>`},
 {t:"par", p:"Empareja cada herramienta con su enfoque",
  pares:[["Terraform / OpenTofu","Declarativo, multiproveedor, con estado"],["CloudFormation","Declarativo, solo AWS"],["Pulumi","Infraestructura con lenguajes de programación"],["Ansible","Configurar servidores (paquetes, ficheros)"],["Scripts con la CLI","Imperativo: pasos a mano, difícil de mantener"]],
  why:"Terraform crea la infraestructura; Ansible suele configurar lo que hay dentro de los servidores. Se complementan."},
 {t:"opcion", p:"¿Qué significa que Terraform sea declarativo?",
  ops:["Que se escribe en inglés","Que describes el resultado final y Terraform calcula los pasos para llegar a él","Que ejecuta los comandos en el orden del fichero","Que no guarda nada entre ejecuciones"],
  ok:1, why:"El orden de los bloques en el fichero da igual: Terraform deduce el orden real a partir de las dependencias."},
 {t:"opcion", p:"Aplicas un cambio y, sin tocar nada, vuelves a ejecutar <code>terraform apply</code>. ¿Qué ocurre la segunda vez?",
  ops:["Crea todo por duplicado","Informa de que no hay cambios: la infraestructura ya coincide con el código","Borra y vuelve a crear los recursos","Da un error porque ya existen"],
  ok:1, why:"«No changes. Your infrastructure matches the configuration.» Es la idempotencia en acción."},
 {t:"vf", p:"La licencia BSL de Terraform prohíbe usarlo para gestionar la infraestructura de tu propia empresa.",
  ok:false, why:"El uso interno está permitido. Lo que la BSL restringe es ofrecer un producto comercial que compita con los de HashiCorp."},
 {t:"escribe", p:"¿Qué comando sustituye a <code>terraform</code> cuando usas OpenTofu?",
  sol:["tofu"], pista:"Es el apodo corto del proyecto.",
  why:"tofu init, tofu plan, tofu apply: mismos subcomandos, mismos ficheros .tf."},
 {t:"vf", p:"Con IaC, los cambios de infraestructura pueden revisarse en un Pull Request como el código de la aplicación.",
  ok:true, why:"Y el plan de Terraform muestra exactamente qué va a cambiar antes de aplicarlo."}
]},

/* =============== U1 L2 =============== */
{
id:"tf1n1",
titulo:"Instalar Terraform y conocer la CLI",
claves:["Se instala como un único binario; en equipos, un gestor de versiones (tenv, mise) fija la misma versión para todos","terraform version, -help y -chdir para trabajar en otra carpeta sin cambiar de directorio","Subcomandos del día a día: init, fmt, validate, plan, apply, destroy, output, state, console"],
pasos:[
 {t:"info", eti:"Instalación", h:"Un binario y ya",
  c:`<p>Terraform es un único ejecutable escrito en Go. Formas habituales de instalarlo:</p>
     <div class="termbox"># macOS
brew tap hashicorp/tap &amp;&amp; brew install hashicorp/tap/terraform
# Windows
winget install Hashicorp.Terraform
# Debian / Ubuntu: repositorio oficial apt.releases.hashicorp.com
sudo apt install terraform
# OpenTofu
brew install opentofu        # o su script de instalación oficial</div>
     <p>En un equipo interesa que todos usen <b>la misma versión</b>. Para eso existen gestores de versiones como <b>tenv</b> o <b>mise</b>, que leen la versión deseada de un fichero del repositorio (por ejemplo <code>.terraform-version</code>) y la instalan sola.</p>`},
 {t:"info", eti:"La CLI", h:"Los subcomandos que usarás",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">subcomandos principales</div><table class="dg-tabla"><thead><tr><th>comando</th><th>para qué</th></tr></thead><tbody>
<tr><td>init</td><td>preparar la carpeta: providers, módulos y backend</td></tr>
<tr><td>fmt</td><td>formatear el código al estilo canónico</td></tr>
<tr><td>validate</td><td>comprobar sintaxis, tipos y referencias</td></tr>
<tr><td>plan</td><td>calcular qué cambiaría</td></tr>
<tr><td>apply / destroy</td><td>aplicar cambios / eliminar todo lo gestionado</td></tr>
<tr><td>output</td><td>leer las salidas</td></tr>
<tr><td>show</td><td>ver el estado o un plan guardado</td></tr>
<tr><td>state</td><td>operaciones sobre el estado (list, show, mv, rm)</td></tr>
<tr><td>console</td><td>probar expresiones de forma interactiva</td></tr>
<tr><td>test</td><td>ejecutar pruebas *.tftest.hcl</td></tr>
</tbody></table></div>
     <div class="termbox">terraform -chdir=entornos/prod plan    # trabaja en otra carpeta
terraform plan -help                    # ayuda de un subcomando
terraform -install-autocomplete         # autocompletado en bash/zsh</div>`},
 {t:"term", p:"Comprueba qué versión de Terraform tienes instalada",
  prompt:"pablo@portatil:~/infra$", sol:["terraform version","terraform -version","terraform -v","terraform --version"],
  salida:`Terraform v1.13.3
on linux_amd64`,
  pista:"El subcomando se llama igual que lo que buscas.",
  why:"Si hay providers inicializados en la carpeta, también muestra sus versiones."},
 {t:"term", p:"Sin salir de la raíz del repositorio, ejecuta un plan en la carpeta <code>entornos/prod</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform -chdir=entornos/prod plan","terraform -chdir=./entornos/prod plan","terraform -chdir=entornos/prod/ plan"],
  salida:`No changes. Your infrastructure matches the configuration.`,
  pista:"La opción global -chdir= va antes del subcomando.",
  why:"-chdir es muy cómodo en scripts y pipelines que trabajan con varias carpetas."},
 {t:"par", p:"Empareja cada subcomando con lo que hace",
  pares:[["terraform fmt","Reescribe los ficheros con el formato estándar"],["terraform validate","Detecta errores de sintaxis y referencias sin llamar a la nube"],["terraform console","Evalúa expresiones y funciones al momento"],["terraform show","Muestra el estado actual o un plan guardado"],["terraform output","Imprime los valores de salida"]],
  why:"validate no necesita credenciales: es perfecto como primer paso del CI."},
 {t:"opcion", p:"¿Por qué conviene fijar la versión de Terraform del equipo con un gestor de versiones y <code>required_version</code>?",
  ops:["Para que el binario ocupe menos","Para que todos, incluido el CI, ejecuten la misma versión y los planes sean reproducibles","Porque las versiones nuevas no funcionan","Para no necesitar providers"],
  ok:1, why:"Una versión distinta puede cambiar el formato, los avisos o el comportamiento. Mismo binario en todas partes, mismo resultado."},
 {t:"vf", p:"<code>terraform fmt</code> puede cambiar el comportamiento de tu infraestructura.",
  ok:false, why:"Solo cambia espacios, alineación y saltos de línea. Por eso es seguro ejecutarlo siempre (y comprobarlo en CI con fmt -check)."},
 {t:"hueco", p:"Completa el comando que comprueba en el CI, sin modificar nada, que todo el repositorio está bien formateado",
  tpl:"terraform fmt ___ ___", banco:["-check","-recursive","-write","-diff","-upgrade"], sol:["-check","-recursive"],
  why:"-check devuelve un código de error si algún fichero no está formateado; -recursive entra en subcarpetas."}
]},

/* =============== U1 L3 =============== */
{
id:"tf1l2",
titulo:"El flujo de trabajo",
claves:["init descarga providers y módulos y prepara el backend","plan muestra qué va a cambiar sin tocar nada; -out lo guarda para aplicar exactamente eso","apply aplica; destroy lo elimina todo. Leer el plan es el hábito más importante"],
pasos:[
 {t:"info", eti:"Cuatro comandos", h:"init, plan, apply, destroy",
  c:`<div class="dg"><div class="dg-tit">el ciclo de trabajo</div><div class="dg-flujo">
       <div class="dg-caja">editar .tf</div>
       <div class="dg-caja">init<small>una vez o al cambiar providers</small></div>
       <div class="dg-caja acento">plan<small>leer con calma</small></div>
       <div class="dg-caja ok">apply</div>
     </div></div>
     <div class="termbox">terraform init        # descarga providers y módulos, configura el estado
terraform fmt         # formatea el código
terraform validate    # comprueba la sintaxis
terraform plan        # qué va a cambiar: + crear, ~ modificar, - destruir
terraform apply       # aplica (enseña el plan y pide confirmación)
terraform destroy     # elimina todo lo gestionado</div>
     <div class="termbox">Terraform will perform the following actions:

  # aws_s3_bucket.backups will be created
  + resource "aws_s3_bucket" "backups" {
      + bucket = "backups-catappa-prod"
      + id     = (known after apply)
    }

Plan: 1 to add, 0 to change, 0 to destroy.</div>`},
 {t:"info", eti:"Por dentro", h:"Qué hace cada paso",
  c:`<ul><li><b>init</b> crea la carpeta <code>.terraform/</code> (providers y módulos descargados, que no se sube a Git) y el fichero <code>.terraform.lock.hcl</code> (versiones exactas, que sí se sube).</li>
     <li><b>plan</b> lee el estado, consulta la API real (refresco) y compara con el código.</li>
     <li><b>plan -out=plan.tfplan</b> guarda el plan. Después <code>terraform apply plan.tfplan</code> aplica <b>exactamente</b> eso, sin volver a preguntar. Es lo que hacen los pipelines.</li>
     <li><b>apply -auto-approve</b> se salta la confirmación: solo en automatizaciones con un plan ya revisado.</li></ul>
     <div class="nota ojo"><b class="tit">Lo peligroso</b>Mira siempre las líneas <code>-</code> (destruir) y <code>-/+</code> (reemplazar). Un reemplazo de una base de datos es perder sus datos.</div>`},
 {t:"orden", p:"Ordena el flujo habitual para aplicar un cambio",
  items:["Editar los ficheros .tf","terraform fmt y validate","terraform plan y revisar el resultado","terraform apply","Comprobar el resultado y hacer commit (o fusionar el PR)"],
  why:"El paso crítico es leer el plan: especialmente las líneas con - (destruir) o -/+ (recrear)."},
 {t:"term", p:"Muestra qué cambios aplicaría Terraform sin aplicarlos",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan","tofu plan"],
  pista:"terraform y el subcomando que planifica.",
  salida:`Plan: 3 to add, 1 to change, 0 to destroy.`, why:"plan nunca modifica la infraestructura (solo lee)."},
 {t:"term", p:"Genera el plan y guárdalo en el fichero <code>plan.tfplan</code> para aplicarlo después",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan -out=plan.tfplan","terraform plan -out plan.tfplan","tofu plan -out=plan.tfplan"],
  salida:`Plan: 3 to add, 1 to change, 0 to destroy.

Saved the plan to: plan.tfplan

To perform exactly these actions, run the following command to apply:
    terraform apply "plan.tfplan"`,
  pista:"La opción -out= con el nombre del fichero.",
  why:"Así lo que se aplica es exactamente lo que se revisó, aunque alguien cambie algo entre medias."},
 {t:"term", p:"Aplica el plan guardado en <code>plan.tfplan</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform apply plan.tfplan","terraform apply \"plan.tfplan\"","tofu apply plan.tfplan"],
  salida:`aws_s3_bucket.backups: Creating...
aws_s3_bucket.backups: Creation complete after 2s [id=backups-catappa-prod]

Apply complete! Resources: 3 added, 1 changed, 0 destroyed.`,
  pista:"apply seguido del nombre del fichero del plan.",
  why:"Si el estado cambió desde que se generó el plan, Terraform lo rechaza por «plan obsoleto» (stale plan)."},
 {t:"par", p:"Empareja cada símbolo del plan con su significado",
  pares:[["+","Se va a crear"],["~","Se va a modificar sin recrear"],["-","Se va a destruir"],["-/+","Se destruye y se vuelve a crear (reemplazo)"],["(known after apply)","Valor que solo se sabrá al crearlo"]],
  why:"Un -/+ inesperado en una base de datos significa perder datos: detente y revisa."},
 {t:"vf", p:"<code>terraform apply plan.tfplan</code> vuelve a pedir que escribas «yes» antes de aplicar.",
  ok:false, why:"Un plan guardado se considera ya aprobado: se aplica sin preguntar. Por eso solo se aplica un plan que alguien ha revisado."},
 {t:"opcion", p:"¿Qué ficheros de los que crea <code>init</code> van al repositorio?",
  ops:["La carpeta .terraform/ entera","Solo .terraform.lock.hcl; .terraform/ va en .gitignore","Ninguno","Los dos, para no tener que ejecutar init"],
  ok:1, why:".terraform/ contiene binarios de providers (cientos de MB y dependientes del sistema); el lock fija versiones para todo el equipo."}
]},

/* =============== U1 L4 =============== */
{
id:"tf1l3",
titulo:"Tu primera infraestructura",
claves:["Un proyecto (módulo raíz) es una carpeta con ficheros .tf, que Terraform lee todos juntos","El bloque terraform fija versiones; provider configura el proveedor; resource declara lo que debe existir","Un recurso se identifica por tipo y nombre local: aws_s3_bucket.backups"],
pasos:[
 {t:"info", eti:"Manos a la obra", h:"Estructura mínima",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">infra/</div><table class="dg-tabla"><tbody><tr><td>versions.tf</td><td>versiones de Terraform y providers</td></tr><tr><td>providers.tf</td><td>configuración del provider</td></tr><tr><td>main.tf</td><td>recursos</td></tr><tr><td>variables.tf</td><td>entradas</td></tr><tr><td>outputs.tf</td><td>salidas</td></tr></tbody></table></div>
     <div class="termbox">terraform {
  required_version = "&gt;= 1.10"
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
}</div>
     <p>Los nombres de fichero son una convención: Terraform lee <b>todos</b> los <code>.tf</code> de la carpeta como si fueran uno.</p>`},
 {t:"info", eti:"Sin nube", h:"Practicar gratis con providers locales",
  c:`<p>Para aprender el ciclo sin cuenta en la nube sirven los providers <code>hashicorp/local</code> y <code>hashicorp/random</code>:</p>
     <div class="termbox">resource "random_pet" "nombre" {
  length = 2
}

resource "local_file" "saludo" {
  filename = "\${path.module}/saludo.txt"
  content  = "Hola, \${random_pet.nombre.id}\\n"
}</div>
     <div class="termbox">$ terraform init
Initializing provider plugins...
- Installing hashicorp/local v2.5.3...
- Installing hashicorp/random v3.7.2...
Terraform has been successfully initialized!

$ terraform apply
Plan: 2 to add, 0 to change, 0 to destroy.
...
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.</div>
     <p>Tras el apply aparece <code>terraform.tfstate</code>: la memoria de lo que Terraform ha creado. Lo estudiarás a fondo más adelante.</p>`},
 {t:"par", p:"Empareja cada bloque con su función",
  pares:[["terraform { required_providers }","Fijar qué providers y versiones se usan"],["provider \"aws\"","Configurar el proveedor (región, etiquetas por defecto)"],["resource \"tipo\" \"nombre\"","Algo que Terraform crea y gestiona"],["aws_s3_bucket.backups.id","Referencia a un atributo de otro recurso"]],
  why:"Las referencias crean dependencias implícitas: Terraform crea primero el bucket y luego el versionado."},
 {t:"hueco", p:"Completa el recurso para que escriba un fichero local",
  tpl:"___ \"local_file\" \"saludo\" {\n  filename = \"saludo.txt\"\n  ___  = \"Hola\"\n}", banco:["resource","data","content","output","variable","text"], sol:["resource","content"],
  why:"resource declara algo que Terraform crea; filename y content son argumentos de local_file."},
 {t:"escribe", p:"¿Cuál es la dirección (address) del recurso declarado como <code>resource \"aws_s3_bucket\" \"backups\"</code>?",
  sol:["aws_s3_bucket.backups"], pista:"tipo.nombre",
  why:"Esa dirección es la que usas en referencias, en terraform state show y en bloques moved o import."},
 {t:"opcion", p:"¿Qué significa <code>version = \"~&gt; 6.0\"</code> en el provider?",
  ops:["Exactamente 6.0","Cualquier 6.x (6.0 o superior, pero menor que 7.0)","Cualquier versión","Menor que 6"],
  ok:1, why:"Evita que una versión mayor con cambios incompatibles entre sin querer. El .terraform.lock.hcl fija la exacta."},
 {t:"vf", p:"El orden en que escribes los bloques <code>resource</code> dentro de los ficheros decide el orden en que se crean.",
  ok:false, why:"Terraform construye un grafo con las referencias y crea en paralelo todo lo que no depende entre sí."},
 {t:"vf", p:"El fichero <code>.terraform.lock.hcl</code> debe subirse a Git.",
  ok:true, why:"Fija las versiones exactas de los providers (y sus sumas de comprobación) para todo el equipo y el CI."}
]},

/* =============== U1 L5 =============== */
{
id:"tf1l4",
titulo:"Providers y credenciales",
claves:["Un provider traduce tus recursos a llamadas a la API de una plataforma","Credenciales desde el entorno, perfiles SSO o roles (OIDC); nunca en el código","alias permite varias configuraciones del mismo provider (otra región u otra cuenta)"],
pasos:[
 {t:"info", eti:"El traductor", h:"Qué hace un provider",
  c:`<p>Terraform en sí no sabe nada de AWS ni de Kubernetes. Los <b>providers</b> son plugins que conocen la API de cada plataforma: <code>hashicorp/aws</code>, <code>hashicorp/azurerm</code>, <code>hashicorp/google</code>, <code>hashicorp/kubernetes</code>, <code>integrations/github</code>, <code>cloudflare/cloudflare</code>... Hay miles en el registro, y <code>terraform init</code> los descarga.</p>
     <div class="dg"><div class="dg-tit">de tu código a la API</div><div class="dg-flujo">
       <div class="dg-caja">ficheros .tf</div><div class="dg-caja acento">Terraform core<small>grafo, plan, estado</small></div><div class="dg-caja">provider aws<small>proceso aparte (gRPC)</small></div><div class="dg-caja base">API de AWS</div>
     </div></div>
     <div class="termbox">provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  alias  = "virginia"            # segunda configuración
  region = "us-east-1"
}

resource "aws_acm_certificate" "cdn" {
  provider          = aws.virginia     # CloudFront exige certificados en us-east-1
  domain_name       = "catappa.dev"
  validation_method = "DNS"
}</div>`},
 {t:"info", eti:"Sin secretos en el código", h:"Credenciales",
  c:`<p>El provider de AWS busca credenciales en este orden aproximado: variables de entorno (<code>AWS_ACCESS_KEY_ID</code>, <code>AWS_PROFILE</code>...), ficheros de <code>~/.aws</code> (incluido SSO), y el <b>rol</b> de la máquina o del pipeline (OIDC). Nunca escribas claves en los ficheros <code>.tf</code>: acabarían en Git y en el estado.</p>
     <div class="termbox">aws sso login --profile catappa-prod
AWS_PROFILE=catappa-prod terraform plan

provider "aws" {
  region = "eu-west-1"
  assume_role {
    role_arn = "arn:aws:iam::222233334444:role/terraform"   # trabajar en otra cuenta
  }
}</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["provider \"aws\" { region }","Configurar a qué región hablar"],["alias","Tener una segunda configuración del mismo provider"],["provider = aws.virginia","Usar esa configuración concreta en un recurso"],["AWS_PROFILE","Elegir el perfil de credenciales sin tocar el código"],["assume_role en el provider","Trabajar en otra cuenta asumiendo un rol"]],
  why:"Con alias y assume_role, un mismo código gestiona varias regiones o cuentas."},
 {t:"term", p:"Lista los providers que necesita la configuración actual y de dónde sale cada requisito",
  prompt:"pablo@portatil:~/infra$", sol:["terraform providers","tofu providers"],
  salida:`Providers required by configuration:
.
├── provider[registry.terraform.io/hashicorp/aws] ~> 6.0
└── module.vpc
    └── provider[registry.terraform.io/hashicorp/aws] >= 6.0

Providers required by state:

    provider[registry.terraform.io/hashicorp/aws]`,
  pista:"Es un subcomando con el nombre en plural.",
  why:"Útil para entender por qué un módulo obliga a una versión mínima de un provider."},
 {t:"hueco", p:"Completa para crear el certificado con la configuración del provider de us-east-1",
  tpl:"provider \"aws\" {\n  ___  = \"virginia\"\n  region = \"us-east-1\"\n}\n\nresource \"aws_acm_certificate\" \"cdn\" {\n  provider = ___\n}", banco:["alias","name","aws.virginia","virginia","provider.virginia"], sol:["alias","aws.virginia"],
  why:"La referencia es tipo.alias, sin comillas: aws.virginia."},
 {t:"opcion", p:"¿Dónde deben estar las credenciales de AWS que usa Terraform en el pipeline?",
  ops:["En provider \"aws\" { access_key = ... }","En un rol que el pipeline asume con OIDC, sin claves guardadas","En terraform.tfvars","En un comentario del código"],
  ok:1, why:"Credenciales temporales y sin secretos que robar."},
 {t:"escribe", p:"¿Qué variable de entorno usarías para elegir el perfil de <code>~/.aws/config</code> sin tocar el código?",
  sol:["AWS_PROFILE"], pista:"AWS_ y lo que quieres elegir, en inglés.",
  why:"Permite que cada persona use su perfil SSO y que el código no sepa nada de credenciales."},
 {t:"vf", p:"Un proyecto de Terraform puede usar a la vez providers de AWS, Cloudflare y GitHub.",
  ok:true, why:"Por ejemplo: crear la infraestructura, el registro DNS y los secretos del repositorio en un mismo plan."}
]}

]});
