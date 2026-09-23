window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "Infraestructura como código",
resumen: "Terraform, estado, módulos, Ansible e idempotencia",
nivel: "Intermedio",
color: "#c49bf2",
lecciones: [

/* =============== O4 L1 =============== */
{
id:"o4l1",
titulo:"Qué es la infraestructura como código",
claves:["Describir servidores, redes y bases de datos en ficheros de texto versionados","Reproducible, revisable y auditable, como el código","Declarativo: describes el estado final, no los pasos"],
pasos:[
 {t:"info", eti:"El problema", h:"La infraestructura hecha a clics",
  c:`<p>Imagina que el servidor de producción se creó hace dos años haciendo clics en la consola de AWS: una máquina, una red, un grupo de seguridad, una base de datos... Nadie recuerda exactamente qué se configuró.</p>
     <ul><li>¿Cómo creas un entorno de pruebas <b>idéntico</b>? No puedes.</li>
     <li>¿Quién abrió el puerto 5432 al mundo y cuándo? No hay registro.</li>
     <li>Si se borra por error, ¿cómo lo recreas? Rezando.</li></ul>
     <p>A esto se le llama con sorna <b>ClickOps</b>.</p>`},

 {t:"info", eti:"La solución", h:"La infraestructura, en ficheros",
  c:`<p><b>Infraestructura como código (IaC)</b> significa describir tu infraestructura en <b>ficheros de texto</b> que una herramienta convierte en recursos reales:</p>
     <div class="termbox">resource "aws_instance" "api" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.small"
  tags = { Name = "api-produccion" }
}</div>
     <p>Y como son ficheros, tienes todo lo que ya conoces del código: <b>Git</b> (historial, quién cambió qué), <b>Pull Requests</b> (revisión antes de tocar producción), <b>CI</b> (validación automática) y <b>reproducibilidad</b> (el mismo fichero crea el mismo entorno cien veces).</p>`},

 {t:"opcion", p:"¿Cuál es la ventaja principal de la infraestructura como código?",
  ops:["Que los servidores son más baratos",
       "Que la infraestructura se vuelve reproducible, versionada y revisable, igual que el código",
       "Que no hace falta la nube",
       "Que se crea más rápido a clics"],
  ok:1,
  why:"Reproducibilidad y trazabilidad. Crear un entorno de pruebas idéntico al de producción pasa a ser trivial."},

 {t:"info", eti:"Dos enfoques", h:"Declarativo contra imperativo",
  c:`<ul><li><b>Imperativo</b>: describes <b>los pasos</b>. «Crea una máquina. Luego ábrele el puerto 80. Luego...» (un script de bash).</li>
     <li><b>Declarativo</b>: describes <b>el estado final</b>. «Quiero que existan 3 máquinas t3.small con el puerto 80 abierto». La herramienta calcula qué pasos hacen falta.</li></ul>
     <p>La gran ventaja del declarativo: si ya existen 2 máquinas y pides 3, solo crea 1. Si ya están las 3, no hace nada. Compose, Kubernetes y Terraform son declarativos.</p>`},

 {t:"par", p:"Empareja cada enfoque con su descripción",
  pares:[["Declarativo","Describes el estado final y la herramienta calcula los pasos"],
         ["Imperativo","Describes paso a paso lo que hay que hacer"],
         ["ClickOps","Configurar a mano en la consola web, sin registro"]],
  why:"Te preguntarán por qué Terraform o Kubernetes son declarativos: por esto."},

 {t:"vf", p:"docker compose es una herramienta declarativa.",
  ok:true,
  why:"Sí: describes los servicios que quieres y compose up hace lo necesario para llegar ahí. Ya llevas un tiempo usando IaC sin saberlo."}
]},

/* =============== O4 L2 =============== */
{
id:"o4l2",
titulo:"Terraform: el ciclo básico",
claves:["Providers conectan con AWS, Azure, GCP...","Resources describen lo que quieres crear","init, plan, apply, destroy"],
pasos:[
 {t:"info", eti:"Qué es", h:"Terraform: la herramienta de IaC más usada",
  c:`<p><b>Terraform</b> (o su versión libre, <b>OpenTofu</b>) crea y gestiona infraestructura en casi cualquier proveedor: AWS, Azure, Google Cloud, pero también GitHub, Cloudflare o Kubernetes. Se escribe en un lenguaje propio, <b>HCL</b>, en ficheros <code>.tf</code>.</p>
     <div class="termbox">terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

<b>provider</b> "aws" {
  region = "eu-west-1"
}

<b>resource</b> "aws_s3_bucket" "backups" {
  bucket = "pablo-backups-tareas"
}</div>`},

 {t:"info", eti:"Las piezas", h:"provider y resource",
  c:`<ul><li><b>provider</b>: el «conector» con un proveedor. Sabe hablar con la API de AWS.</li>
     <li><b>resource "TIPO" "NOMBRE"</b>: algo que quieres que exista. El tipo lo define el provider (<code>aws_s3_bucket</code>, <code>aws_instance</code>); el nombre es tuyo, para referirte a él dentro de Terraform.</li></ul>
     <p>Los recursos se pueden referenciar entre sí: <code>aws_instance.api.public_ip</code> es la IP pública de la máquina llamada <code>api</code>. Terraform deduce solo el orden en que tiene que crearlos.</p>`},

 {t:"info", eti:"El ciclo", h:"init, plan, apply",
  c:`<div class="termbox">terraform init      <span class="cm"># descarga los providers (una vez, o al cambiarlos)</span>
terraform fmt       <span class="cm"># formatea los ficheros</span>
terraform validate  <span class="cm"># comprueba la sintaxis</span>
terraform plan      <span class="cm"># ENSEÑA lo que va a hacer, sin hacer nada</span>
terraform apply     <span class="cm"># lo hace (te pide confirmacion)</span>
terraform destroy   <span class="cm"># borra todo lo que gestiona</span></div>
     <p>El paso clave es <code>plan</code>: un informe de qué se va a <b>crear (+)</b>, <b>modificar (~)</b> o <b>destruir (-)</b>. Nunca se hace apply sin leer el plan.</p>`},

 {t:"orden", p:"Ordena el flujo de trabajo con Terraform",
  items:["Escribir o modificar los ficheros .tf","terraform init","terraform plan  (revisar qué va a cambiar)","terraform apply","Commit y PR con los cambios"],
  why:"En equipos maduros, el plan lo genera el CI en el Pull Request y el apply lo hace el pipeline al fusionar."},

 {t:"term", p:"Ya has escrito tus ficheros y hecho init. Muestra qué cambios haría Terraform, sin aplicar nada",
  prompt:"pablo@portatil:~/infra$",
  sol:["terraform plan"],
  pista:"El verbo es «planificar».",
  salida:`Terraform will perform the following actions:

  # aws_s3_bucket.backups will be created
  + resource "aws_s3_bucket" "backups" {
      + bucket = "pablo-backups-tareas"
      + id     = (known after apply)
    }

Plan: 1 to add, 0 to change, 0 to destroy.`,
  why:"Un recurso a crear, ninguno a cambiar ni a destruir. Si vieras «1 to destroy» inesperado, sería el momento de pararse."},

 {t:"opcion", p:"En el plan ves <code>Plan: 0 to add, 1 to change, 3 to destroy</code> y tú solo querías cambiar una etiqueta. ¿Qué haces?",
  ops:["apply, que Terraform sabe lo que hace",
       "No aplico: investigo por qué quiere destruir 3 recursos antes de seguir",
       "destroy directamente",
       "Borro el estado"],
  ok:1,
  why:"El plan existe para esto. Un «destroy» inesperado puede ser una base de datos de producción."},

 {t:"vf", p:"<code>terraform plan</code> modifica la infraestructura real.",
  ok:false,
  why:"Solo consulta y calcula. Quien cambia algo es apply."}
]},

/* =============== O4 L3 =============== */
{
id:"o4l3",
titulo:"Estado, variables y módulos",
claves:["El state guarda qué recursos reales corresponden a tu código","En equipo, estado remoto con bloqueo (S3 + lock, Terraform Cloud)","Variables para parametrizar y módulos para reutilizar"],
pasos:[
 {t:"info", eti:"El estado", h:"Cómo sabe Terraform qué existe",
  c:`<p>Terraform guarda un fichero <b>terraform.tfstate</b> con la correspondencia entre tu código y los recursos reales: «el recurso <code>aws_instance.api</code> es la máquina <code>i-0a1b2c3d</code>».</p>
     <p>Con él calcula el plan: compara lo que dice tu código, lo que dice el estado y lo que hay de verdad en la nube.</p>
     <div class="nota ojo"><b class="tit">Dos cuidados</b>El estado puede contener <b>datos sensibles</b> (contraseñas de bases de datos en texto plano): nunca va a Git. Y si lo pierdes, Terraform «olvida» lo que gestiona.</div>`},

 {t:"info", eti:"En equipo", h:"Estado remoto con bloqueo",
  c:`<p>Si el estado está en tu portátil, nadie más puede trabajar. Y si dos personas hacen apply a la vez con copias distintas, corrompen la infraestructura. Solución: <b>estado remoto</b> con <b>bloqueo</b>:</p>
     <div class="termbox">terraform {
  backend "s3" {
    bucket       = "empresa-terraform-state"
    key          = "api/produccion.tfstate"
    region       = "eu-west-1"
    use_lockfile = true      <span class="cm"># bloqueo: un apply a la vez</span>
    encrypt      = true
  }
}</div>
     <p>Alternativas: Terraform Cloud / HCP, o los backends de Azure y GCP.</p>`},

 {t:"opcion", p:"¿Por qué no se sube <code>terraform.tfstate</code> a Git?",
  ops:["Porque ocupa mucho",
       "Porque puede contener secretos en texto plano y porque en equipo hace falta un estado compartido con bloqueo, no copias en cada rama",
       "Porque Git no admite ficheros JSON",
       "Sí se sube siempre"],
  ok:1,
  why:"Secretos + concurrencia. Estado remoto, cifrado y con bloqueo."},

 {t:"info", eti:"Variables", h:"Parametrizar para varios entornos",
  c:`<div class="termbox"><span class="cm"># variables.tf</span>
variable "entorno" {
  type = string
}
variable "tipo_instancia" {
  type    = string
  default = "t3.small"
}

<span class="cm"># main.tf</span>
resource "aws_instance" "api" {
  instance_type = <b>var.tipo_instancia</b>
  tags = { Name = "api-\${var.entorno}" }
}

<span class="cm"># produccion.tfvars</span>
entorno        = "produccion"
tipo_instancia = "t3.large"</div>
     <div class="termbox">terraform apply -var-file=produccion.tfvars</div>
     <p>Mismo código, distintos entornos. Y con <b>outputs</b> expones valores (la IP, la URL) para usarlos después.</p>`},

 {t:"info", eti:"Módulos", h:"Reutilizar bloques de infraestructura",
  c:`<p>Un <b>módulo</b> es una carpeta de ficheros <code>.tf</code> que se usa como una función: le pasas parámetros y crea un conjunto de recursos.</p>
     <div class="termbox">module "red" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "produccion"
  cidr   = "10.0.0.0/16"
}</div>
     <p>Hay módulos públicos muy usados (como el de VPC de la comunidad) y las empresas crean los suyos para estandarizar: «así se crea un servicio en nuestra empresa».</p>`},

 {t:"par", p:"Empareja cada concepto de Terraform con su función",
  pares:[["state","Relaciona tu código con los recursos reales"],
         ["backend remoto","Estado compartido y bloqueado para el equipo"],
         ["variable","Parametrizar el código por entorno"],
         ["output","Exponer valores como IPs o URLs"],
         ["module","Reutilizar un conjunto de recursos"]],
  why:"Con esto puedes mantener una conversación técnica sobre Terraform."},

 {t:"vf", p:"Si alguien cambia un recurso a mano en la consola de AWS, Terraform lo detectará en el siguiente plan.",
  ok:true,
  why:"Sí: se llama drift (deriva). Terraform propondrá devolverlo al estado declarado en el código."}
]},

/* =============== O4 L4 =============== */
{
id:"o4l4",
titulo:"Ansible: configurar servidores",
claves:["Ansible configura máquinas existentes por SSH, sin instalar agentes","Inventario: qué máquinas; playbook: qué hacer en ellas","Idempotencia: ejecutarlo dos veces deja el mismo resultado"],
pasos:[
 {t:"info", eti:"Qué es", h:"Terraform crea la máquina; Ansible la configura",
  c:`<p>Con Terraform tienes un servidor vacío. Falta instalar Docker, crear usuarios, configurar nginx, copiar ficheros... Para eso está <b>Ansible</b>.</p>
     <p>Ansible se conecta a las máquinas <b>por SSH</b> (lo que ya sabes) y ejecuta tareas. No hay que instalar nada en los servidores: se dice que es <b>agentless</b>.</p>`},

 {t:"info", eti:"Las piezas", h:"Inventario y playbook",
  c:`<div class="termbox"><span class="cm"># inventario.ini: QUE maquinas</span>
[web]
203.0.113.10
203.0.113.11

[db]
203.0.113.20</div>
     <div class="termbox"><span class="cm"># docker.yml: QUE hacer (un playbook, en YAML)</span>
- name: Preparar servidores web
  hosts: web
  become: true                  <span class="cm"># usar sudo</span>
  tasks:
    - name: Instalar Docker
      ansible.builtin.apt:
        name: docker.io
        state: present
        update_cache: true
    - name: Docker arrancado y habilitado
      ansible.builtin.service:
        name: docker
        state: started
        enabled: true</div>
     <div class="termbox">ansible-playbook -i inventario.ini docker.yml</div>`},

 {t:"par", p:"Empareja cada pieza de Ansible con lo que define",
  pares:[["Inventario","Las máquinas y sus grupos"],
         ["Playbook","La lista de tareas a aplicar, en YAML"],
         ["Módulo (apt, service, copy...)","Una acción concreta e idempotente"],
         ["become: true","Ejecutar con privilegios (sudo)"]],
  why:"Otra vez YAML: ya ves por qué merecía una unidad entera en el curso de Docker."},

 {t:"info", eti:"El concepto clave", h:"Idempotencia",
  c:`<p>Una operación es <b>idempotente</b> si ejecutarla una vez o diez veces da el <b>mismo resultado</b>.</p>
     <p><code>state: present</code> no significa «instala docker», significa «asegúrate de que docker está instalado». Si ya lo está, Ansible no hace nada y lo marca como <i>ok</i>; si no, lo instala y lo marca como <i>changed</i>.</p>
     <p>Compáralo con un script: <code>echo "linea" >> config</code> ejecutado diez veces añade diez líneas. El módulo <code>lineinfile</code> de Ansible la añade solo si no está.</p>`},

 {t:"opcion", p:"¿Qué significa que un playbook sea idempotente?",
  ops:["Que se ejecuta muy rápido",
       "Que ejecutarlo varias veces deja el sistema en el mismo estado que ejecutarlo una vez",
       "Que solo se puede ejecutar una vez",
       "Que no necesita SSH"],
  ok:1,
  why:"Por eso puedes relanzarlo sin miedo tras un fallo a medias, o periódicamente para corregir cambios manuales."},

 {t:"vf", p:"Ansible necesita instalar un agente en cada servidor que gestiona.",
  ok:false,
  why:"Es agentless: solo necesita SSH y Python en la máquina destino. Otras herramientas (Puppet, Chef) sí usan agentes."}
]},

/* =============== O4 L5 =============== */
{
id:"o4l5",
titulo:"Terraform, Ansible e infraestructura inmutable",
claves:["Terraform = aprovisionar (crear recursos); Ansible = configurar (lo que hay dentro)","Infraestructura inmutable: no se parchea, se sustituye","Los contenedores llevan la idea de inmutabilidad al extremo"],
pasos:[
 {t:"info", eti:"Cada uno lo suyo", h:"Aprovisionar contra configurar",
  c:`<ul><li><b>Aprovisionamiento</b> (Terraform): <b>crear</b> la infraestructura. Máquinas, redes, bases de datos gestionadas, balanceadores, DNS.</li>
     <li><b>Gestión de configuración</b> (Ansible): lo que hay <b>dentro</b> de las máquinas. Paquetes, usuarios, ficheros, servicios.</li></ul>
     <p>Se combinan: Terraform crea tres máquinas y exporta sus IPs; Ansible las usa como inventario y las configura.</p>`},

 {t:"par", p:"Empareja cada tarea con la herramienta más adecuada",
  pares:[["Crear una VPC con subredes en AWS","Terraform: aprovisionar la red"],
         ["Instalar nginx y copiar su configuración","Ansible: configurar paquetes y ficheros"],
         ["Crear un registro DNS en Cloudflare","Terraform: un recurso de un proveedor"],
         ["Añadir un usuario a 40 servidores","Ansible: configurar muchas máquinas a la vez"]],
  why:"Las fronteras no son rígidas, pero esta división es la que se espera oír."},

 {t:"info", eti:"Cambio de mentalidad", h:"Infraestructura inmutable",
  c:`<p>En el modelo clásico, los servidores se <b>actualizan en el sitio</b>: se instala un parche, se cambia una configuración... Con los años, cada servidor acaba siendo único e irrepetible. Se les llama <b>mascotas</b> (pets): tienen nombre y los cuidas.</p>
     <p>En el modelo <b>inmutable</b>, un servidor <b>nunca se modifica</b>: si hay que cambiar algo, se construye una imagen nueva y se <b>sustituye</b> el servidor entero. Son <b>ganado</b> (cattle): numerados e intercambiables.</p>
     <div class="nota dato"><b class="tit">¿Te suena?</b>Es exactamente lo que ya haces con Docker: no parcheas un contenedor en marcha, construyes una imagen nueva y lo reemplazas.</div>`},

 {t:"opcion", p:"En infraestructura inmutable, hay que aplicar un parche de seguridad. ¿Qué se hace?",
  ops:["Entrar por SSH en cada servidor y aplicarlo",
       "Construir una imagen nueva con el parche y sustituir los servidores",
       "Esperar a la siguiente versión",
       "Aplicarlo solo en producción"],
  ok:1,
  why:"Nunca se toca lo que está en marcha: se reemplaza. Así todos los servidores son idénticos y reproducibles."},

 {t:"vf", p:"«Mascotas contra ganado» describe la diferencia entre servidores únicos cuidados a mano y servidores intercambiables que se reemplazan.",
  ok:true,
  why:"Una metáfora muy conocida en el sector. Si la usas en una entrevista, la entenderán."},

 {t:"info", eti:"El mapa completo", h:"Cómo encaja todo",
  c:`<div class="diag">Terraform  -> crea la red, las maquinas / el cluster, la BD gestionada
Ansible    -> (si hay maquinas) instala Docker, usuarios, seguridad
Docker     -> empaqueta la aplicacion de forma inmutable
CI/CD      -> construye la imagen y la despliega
Kubernetes -> la ejecuta, la escala y la mantiene viva (siguiente unidad)</div>
     <p>Y todo en ficheros de texto, en Git, revisado con Pull Requests.</p>`}
]}

]});
