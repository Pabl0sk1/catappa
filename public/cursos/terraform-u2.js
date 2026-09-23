window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "El lenguaje HCL y los recursos",
resumen: "Sintaxis HCL, recursos y sus direcciones, data sources, dependencias y el grafo, y versiones de Terraform y providers",
nivel: "Fundamentos",
color: "#b58cf5",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"tf2l1",
titulo:"Sintaxis HCL",
claves:["Bloques con tipo, etiquetas y cuerpo: tipo \"etiqueta\" { argumento = valor }","Valores: string, number, bool, listas [ ] y mapas { }; interpolación con ${ }","Comentarios con #, // o /* */; heredoc &lt;&lt;-EOT para textos largos"],
pasos:[
 {t:"info", eti:"El lenguaje", h:"Bloques, argumentos y expresiones",
  c:`<p>HCL (HashiCorp Configuration Language) tiene tres piezas: <b>bloques</b>, <b>argumentos</b> y <b>expresiones</b>.</p>
     <div class="termbox"># tipo de bloque, etiquetas (tipo y nombre del recurso) y cuerpo
resource "aws_instance" "web" {
  ami           = "ami-0abc1234"       # argumento = expresión
  instance_type = "t4g.small"
  monitoring    = true                  # bool
  count         = 2                     # number
  vpc_security_group_ids = [aws_security_group.web.id]   # lista
  tags = {                              # mapa
    Name    = "web-\${var.entorno}"      # interpolación
    Entorno = var.entorno
  }

  root_block_device {                   # bloque anidado (sin =)
    volume_size = 20
  }
}</div>
     <p>Una diferencia sutil: <code>tags = { }</code> es un <b>argumento</b> cuyo valor es un mapa; <code>root_block_device { }</code> es un <b>bloque anidado</b> que define el esquema del provider. Los bloques anidados pueden repetirse; los argumentos no.</p>`},
 {t:"info", eti:"Más sintaxis", h:"Comentarios, heredoc y plantillas",
  c:`<div class="termbox"># comentario de una línea (el estilo recomendado)
// también vale, pero terraform fmt no lo cambia a #
/* comentario
   de varias líneas */

locals {
  user_data = &lt;&lt;-EOT
    #!/bin/bash
    echo "entorno \${var.entorno}" &gt; /etc/entorno
  EOT

  saludo = "Hola, %{ if var.entorno == "prod" }producción%{ else }pruebas%{ endif }"
}</div>
     <ul><li><code>&lt;&lt;-EOT</code> (con guion) quita la sangría común; <code>&lt;&lt;EOT</code> la conserva.</li>
     <li><code>\${ }</code> inserta un valor; <code>%{ if }</code> y <code>%{ for }</code> son directivas dentro de un texto.</li>
     <li>Existe una variante JSON (<code>.tf.json</code>) pensada para ficheros generados por programas.</li></ul>`},
 {t:"par", p:"Empareja cada fragmento con lo que es",
  pares:[["resource \"aws_vpc\" \"principal\" { }","Bloque con dos etiquetas"],["cidr_block = \"10.0.0.0/16\"","Argumento con un string"],["[\"a\", \"b\"]","Lista (tupla literal)"],["{ Name = \"web\" }","Mapa (objeto literal)"],["\"web-${var.entorno}\"","Texto con interpolación"]],
  why:"Todo el lenguaje se construye con estas piezas; los providers deciden qué argumentos y bloques acepta cada recurso."},
 {t:"opcion", p:"Tienes <code>main.tf</code>, <code>red.tf</code> y <code>datos.tf</code> en la misma carpeta. ¿Cómo los procesa Terraform?",
  ops:["Solo lee main.tf","Los lee todos como una única configuración; el reparto en ficheros es solo para organizarse","Los aplica en orden alfabético","Cada fichero es un estado distinto"],
  ok:1, why:"Una carpeta es un módulo. Dividir en ficheros es cuestión de legibilidad."},
 {t:"hueco", p:"Completa el heredoc que quita la sangría común del script",
  tpl:"user_data = ___\n  #!/bin/bash\n  apt-get update\n___", banco:["<<-EOT","<<EOT","EOT","\"\"\"","END"], sol:["<<-EOT","EOT"],
  why:"El delimitador de cierre debe coincidir con el de apertura (EOT es solo una convención)."},
 {t:"vf", p:"Un bloque anidado como <code>root_block_device { }</code> se escribe igual que un argumento de tipo mapa: <code>root_block_device = { }</code>.",
  ok:false, why:"Son cosas distintas. Si el provider define un bloque, escribir = da error: «An argument named ... is not expected here. Did you mean to define a block?»."},
 {t:"escribe", p:"¿Qué carácter inicia un comentario de una línea en el estilo recomendado de HCL?",
  sol:["#"], pista:"El mismo que en Bash o Python.",
  why:"// también funciona, pero # es el estilo idiomático."},
 {t:"opcion", p:"¿Qué produce <code>\"%{ if var.prod }grande%{ else }pequeña%{ endif }\"</code> si <code>var.prod</code> es <code>false</code>?",
  ops:["grande","pequeña","Un error","false"],
  ok:1, why:"Las directivas %{ } permiten lógica sencilla dentro de un texto; para algo más complejo, mejor una expresión condicional o templatefile."}
]},

/* =============== U2 L2 =============== */
{
id:"tf2n1",
titulo:"Recursos: argumentos, atributos y direcciones",
claves:["Argumentos: lo que tú fijas; atributos: lo que el recurso expone (algunos solo se conocen tras crearlo)","Cada cambio es en el sitio (~) o fuerza reemplazo (-/+) según el esquema del provider","Meta-argumentos comunes a todos: count, for_each, depends_on, provider, lifecycle"],
pasos:[
 {t:"info", eti:"Anatomía", h:"Lo que escribes y lo que obtienes",
  c:`<div class="termbox">resource "aws_security_group" "web" {
  name   = "web-prod"                      # argumento
  vpc_id = aws_vpc.principal.id            # argumento que usa un atributo de otro recurso
}

# atributos que el recurso expone después:
#   aws_security_group.web.id    -&gt; "sg-0a1b2c3d4e"   (known after apply)
#   aws_security_group.web.arn
#   aws_security_group.web.name  -&gt; "web-prod"</div>
     <ul><li>Los <b>argumentos</b> los fijas tú en el código.</li>
     <li>Los <b>atributos</b> los puedes leer; los «computed» (id, arn, ip) no se saben hasta crear el recurso, y el plan los muestra como <code>(known after apply)</code>.</li>
     <li>La <b>dirección</b> <code>aws_security_group.web</code> identifica el recurso en el estado. Dentro de un módulo: <code>module.red.aws_vpc.principal</code>; con for_each: <code>aws_subnet.privada["a"]</code>.</li></ul>`},
 {t:"info", eti:"Cambios", h:"Modificar en el sitio o reemplazar",
  c:`<p>El provider decide, argumento a argumento, si un cambio puede hacerse con una llamada de actualización o si obliga a crear otro recurso:</p>
     <div class="termbox">  # aws_instance.web will be updated in-place
  ~ resource "aws_instance" "web" {
      ~ tags = { "Name" = "web" -&gt; "web-prod" }
    }

  # aws_db_instance.principal must be replaced
-/+ resource "aws_db_instance" "principal" {
      ~ identifier = "catappa" -&gt; "catappa-prod" # forces replacement
    }</div>
     <p>El comentario <code># forces replacement</code> te dice qué argumento provoca el reemplazo. Por defecto Terraform <b>destruye primero y crea después</b>; <code>create_before_destroy</code> invierte ese orden.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">meta-argumentos</div><table class="dg-tabla"><tbody>
<tr><td>count / for_each</td><td>crear varias instancias del recurso</td></tr>
<tr><td>depends_on</td><td>dependencia explícita</td></tr>
<tr><td>provider</td><td>elegir una configuración con alias</td></tr>
<tr><td>lifecycle</td><td>controlar creación, borrado y cambios ignorados</td></tr>
</tbody></table></div>`},
 {t:"opcion", p:"El plan muestra <code>~ tags</code> en una instancia EC2. ¿Qué va a pasar?",
  ops:["Se destruye y se recrea la instancia","Se actualizan las etiquetas en el sitio, sin recrear la instancia","Nada","Se crea una segunda instancia"],
  ok:1, why:"~ es modificación en el sitio. Cambiar la AMI, en cambio, forzaría un reemplazo."},
 {t:"par", p:"Empareja cada dirección con lo que identifica",
  pares:[["aws_vpc.principal","Un recurso del módulo raíz"],["module.red.aws_vpc.principal","Un recurso dentro del módulo red"],["aws_subnet.privada[\"a\"]","La instancia con clave a de un for_each"],["aws_instance.web[0]","La primera instancia de un count"],["data.aws_ami.ubuntu","Un data source"]],
  why:"Estas direcciones son las que usarás en state show, -replace, moved, import y removed."},
 {t:"escribe", p:"En el plan, ¿qué comentario acompaña al argumento que obliga a destruir y crear de nuevo un recurso?",
  sol:["# forces replacement","forces replacement"], pista:"Dos palabras en inglés: «fuerza reemplazo».",
  why:"Buscar «forces replacement» en un plan largo es un hábito que salva bases de datos."},
 {t:"vf", p:"Todos los atributos de un recurso se conocen ya durante el plan.",
  ok:false, why:"Los computados (id, arn, IP...) aparecen como (known after apply) hasta que el recurso existe."},
 {t:"hueco", p:"Completa para usar el id de la VPC en la subred",
  tpl:"resource \"aws_subnet\" \"a\" {\n  vpc_id     = ___.___\n  cidr_block = \"10.0.1.0/24\"\n}", banco:["aws_vpc.principal","id","arn","vpc.principal","name"], sol:["aws_vpc.principal","id"],
  why:"tipo.nombre.atributo. Esa referencia además crea la dependencia: primero la VPC."},
 {t:"opcion", p:"¿Cuál de estos NO es un meta-argumento común a todos los recursos?",
  ops:["for_each","depends_on","lifecycle","instance_type"],
  ok:3, why:"instance_type es un argumento propio de aws_instance; los meta-argumentos los entiende Terraform, no el provider."}
]},

/* =============== U2 L3 =============== */
{
id:"tf2n2",
titulo:"Data sources: consultar lo que ya existe",
claves:["data lee información de fuera sin gestionarla: AMIs, zonas, cuentas, VPCs existentes","Se leen durante el plan, salvo que dependan de algo que aún no existe","aws_iam_policy_document genera políticas IAM en HCL en vez de JSON a mano"],
pasos:[
 {t:"info", eti:"Solo lectura", h:"data frente a resource",
  c:`<div class="termbox">data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]        # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-arm64-server-*"]
  }
}

data "aws_caller_identity" "actual" {}
data "aws_region" "actual" {}
data "aws_availability_zones" "disponibles" { state = "available" }

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t4g.small"
}

output "cuenta" { value = data.aws_caller_identity.actual.account_id }</div>
     <ul><li>Un <b>resource</b> se crea, se modifica y se destruye con Terraform.</li>
     <li>Un <b>data</b> solo se <b>consulta</b>: destruir la configuración no lo borra.</li>
     <li>Se lee en el plan. Si depende de un valor «known after apply», se aplaza al apply y el plan lo avisa.</li></ul>`},
 {t:"info", eti:"El más útil", h:"Políticas IAM sin JSON a mano",
  c:`<div class="termbox">data "aws_iam_policy_document" "leer_backups" {
  statement {
    actions   = ["s3:GetObject", "s3:ListBucket"]
    resources = [aws_s3_bucket.backups.arn, "\${aws_s3_bucket.backups.arn}/*"]
  }
}

resource "aws_iam_policy" "leer_backups" {
  name   = "leer-backups"
  policy = data.aws_iam_policy_document.leer_backups.json
}</div>
     <p>Se valida como HCL, admite referencias y <code>dynamic</code>, y genera un JSON correcto. Es un data source que no llama a ninguna API: calcula en local.</p>
     <div class="nota ojo"><b class="tit">Trampa típica</b>Un data source que busca «la VPC con la etiqueta X» falla si encuentra cero o más de una. Filtra de forma que el resultado sea único.</div>`},
 {t:"par", p:"Empareja cada data source con lo que obtiene",
  pares:[["aws_caller_identity","El id de la cuenta y el ARN con el que estás autenticado"],["aws_ami","La imagen más reciente que cumple un filtro"],["aws_availability_zones","Las zonas de disponibilidad de la región"],["aws_iam_policy_document","Un JSON de política IAM generado en local"],["aws_vpc con filtro por tags","Una VPC que otro equipo creó"]],
  why:"Los data sources evitan pegar ids a mano: el código funciona igual en cualquier cuenta y región."},
 {t:"opcion", p:"Ejecutas <code>terraform destroy</code> en una configuración que tiene un <code>data \"aws_vpc\"</code>. ¿Qué pasa con esa VPC?",
  ops:["Se destruye","Nada: los data sources solo se leen, Terraform no la gestiona","Se desasocia de la cuenta","Da error"],
  ok:1, why:"Esa VPC pertenece a otra configuración (u otro equipo). Tú solo la consultas."},
 {t:"hueco", p:"Completa para usar el JSON generado por el documento de política",
  tpl:"resource \"aws_iam_policy\" \"p\" {\n  policy = ___.aws_iam_policy_document.leer.___\n}", banco:["data","resource","json","policy","arn"], sol:["data","json"],
  why:"Los data sources se referencian con el prefijo data. El atributo json contiene la política lista."},
 {t:"vf", p:"Un data source cuyo filtro encuentra dos VPCs devuelve la primera y sigue adelante.",
  ok:false, why:"Falla con un error de «multiple VPCs matched». Es una protección: prefiere que lo arregles a que elija al azar."},
 {t:"opcion", p:"El plan muestra <code>data.aws_ami.ubuntu will be read during apply</code>. ¿Qué suele significar?",
  ops:["Que el provider está roto","Que el data source depende de un valor que aún no se conoce (known after apply), así que se lee más tarde","Que no hay credenciales","Que la AMI no existe"],
  ok:1, why:"Es normal si depende de algo que se crea en ese mismo apply; si no debería, revisa depends_on innecesarios."},
 {t:"escribe", p:"¿Qué atributo de <code>data.aws_caller_identity.actual</code> contiene el número de cuenta de AWS?",
  sol:["account_id"], pista:"«cuenta» e «id», en inglés y con guion bajo.",
  why:"Muy usado para construir ARNs y nombres únicos de buckets sin escribir el número a mano."}
]},

/* =============== U2 L4 =============== */
{
id:"tf2n3",
titulo:"Dependencias y el grafo",
claves:["Las referencias crean dependencias implícitas; depends_on solo cuando no hay referencia posible","Terraform crea en paralelo (10 operaciones por defecto) lo que no depende entre sí, y destruye en orden inverso","-target es una herramienta de emergencia, no de uso diario"],
pasos:[
 {t:"info", eti:"El grafo", h:"Quién va antes",
  c:`<div class="dg"><div class="dg-tit">grafo de dependencias</div>
<svg viewBox="0 0 340 190" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="La VPC va primero; de ella dependen dos subredes y el grupo de seguridad; la instancia depende de la subred a y del grupo de seguridad">
  <defs><marker id="fl-tf2n3-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
  <rect x="120" y="10" width="100" height="32" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
  <text x="170" y="31" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">aws_vpc</text>
  <rect x="10" y="80" width="100" height="32" rx="6" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/>
  <text x="60" y="101" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">subnet a</text>
  <rect x="120" y="80" width="100" height="32" rx="6" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/>
  <text x="170" y="101" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">subnet b</text>
  <rect x="230" y="80" width="100" height="32" rx="6" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/>
  <text x="280" y="101" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">sec. group</text>
  <rect x="120" y="148" width="100" height="32" rx="6" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="2"/>
  <text x="170" y="169" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">instancia</text>
  <line x1="150" y1="42" x2="75" y2="78" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-tf2n3-1)"/>
  <line x1="170" y1="42" x2="170" y2="78" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-tf2n3-1)"/>
  <line x1="190" y1="42" x2="265" y2="78" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-tf2n3-1)"/>
  <line x1="75" y1="112" x2="150" y2="146" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-tf2n3-1)"/>
  <line x1="265" y1="112" x2="190" y2="146" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-tf2n3-1)"/>
</svg>
<div class="dg-nota arriba">las tres del medio se crean en paralelo; al destruir, el orden se invierte</div></div>
     <p>Cada referencia (<code>aws_vpc.principal.id</code>) es una arista del grafo. Terraform recorre el grafo y lanza en paralelo hasta 10 operaciones (<code>-parallelism=N</code> lo cambia). <code>terraform graph</code> lo exporta en formato DOT para dibujarlo.</p>`},
 {t:"info", eti:"Casos especiales", h:"depends_on y -target",
  c:`<div class="termbox">resource "aws_iam_role_policy" "lectura" { ... }

resource "aws_instance" "app" {
  iam_instance_profile = aws_iam_instance_profile.app.name
  # la app arranca y lee S3 al instante: necesita que la política
  # ya esté puesta, pero ningún argumento la referencia
  depends_on = [aws_iam_role_policy.lectura]
}</div>
     <ul><li><b>depends_on</b> solo cuando la dependencia es real pero invisible (efectos colaterales). Abusar de él hace los planes más lentos y aplaza lecturas de data sources.</li>
     <li><b>-target=dirección</b> limita el plan a un recurso y sus dependencias. Terraform avisa de que el resultado puede quedar incompleto: úsalo para salir de un apuro, nunca como costumbre.</li></ul>`},
 {t:"opcion", p:"¿Cuándo está justificado <code>depends_on</code>?",
  ops:["Siempre, para dejar claro el orden","Cuando existe una dependencia real que no se expresa con ninguna referencia entre argumentos","Nunca: está deprecado","Para acelerar el plan"],
  ok:1, why:"Si puedes referenciar un atributo, hazlo: la dependencia queda implícita y además documentada."},
 {t:"orden", p:"Ordena cómo destruiría Terraform esta cadena: VPC → subred → instancia",
  items:["La instancia","La subred","La VPC"],
  why:"Al destruir recorre el grafo al revés: primero lo que depende de otros."},
 {t:"term", p:"Exporta el grafo de dependencias de la configuración (formato DOT) a un fichero <code>grafo.dot</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform graph > grafo.dot","terraform graph >grafo.dot","tofu graph > grafo.dot"],
  salida:``,
  pista:"El subcomando graph y una redirección de la salida.",
  why:"Luego dot -Tsvg grafo.dot > grafo.svg (Graphviz) lo dibuja. Útil para entender configuraciones heredadas."},
 {t:"term", p:"Planifica solo el recurso <code>aws_instance.app</code> y lo que necesita (una emergencia, no una costumbre)",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan -target=aws_instance.app","terraform plan -target aws_instance.app","terraform plan -target='aws_instance.app'"],
  salida:`Plan: 1 to add, 0 to change, 0 to destroy.

Warning: Resource targeting is in effect

You are creating a plan with the -target option, which means that the result
of this plan may not represent all of the changes requested by the current
configuration.`,
  pista:"La opción -target= con la dirección del recurso.",
  why:"Tras usar -target, ejecuta un plan completo para comprobar que no queda nada pendiente."},
 {t:"vf", p:"Por defecto Terraform crea los recursos de uno en uno, en el orden del fichero.",
  ok:false, why:"Crea en paralelo (hasta 10 a la vez) todo lo que no depende entre sí."},
 {t:"hueco", p:"Completa la dependencia explícita de la instancia con la política",
  tpl:"resource \"aws_instance\" \"app\" {\n  ___ = [___]\n}", banco:["depends_on","aws_iam_role_policy.lectura","depends","\"aws_iam_role_policy.lectura\"","after"], sol:["depends_on","aws_iam_role_policy.lectura"],
  why:"depends_on recibe una lista de direcciones sin comillas (referencias, no textos)."}
]},

/* =============== U2 L5 =============== */
{
id:"tf2n4",
titulo:"Versiones de Terraform y de los providers",
claves:["required_version limita qué versiones de Terraform pueden ejecutar el código","Restricciones: =, !=, &gt;, &gt;=, &lt;, &lt;=, ~&gt;; el operador ~&gt; solo deja subir el último número indicado","El lock file fija versiones exactas; init -upgrade las actualiza dentro de lo permitido"],
pasos:[
 {t:"info", eti:"Restricciones", h:"Cómo se lee cada operador",
  c:`<div class="termbox">terraform {
  required_version = "&gt;= 1.10, &lt; 2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"          # registry.terraform.io/hashicorp/aws
      version = "~&gt; 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "&gt;= 3.6"
    }
  }
}</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">restricciones de versión</div><table class="dg-tabla"><thead><tr><th>restricción</th><th>admite</th></tr></thead><tbody>
<tr><td>= 6.2.0</td><td>solo 6.2.0</td></tr>
<tr><td>&gt;= 6.2</td><td>6.2 o cualquier superior (también 7, 8...)</td></tr>
<tr><td>~&gt; 6.2</td><td>&gt;= 6.2 y &lt; 7.0</td></tr>
<tr><td>~&gt; 6.2.0</td><td>&gt;= 6.2.0 y &lt; 6.3.0 (solo parches)</td></tr>
<tr><td>&gt;= 6.0, != 6.4.1</td><td>excluir una versión con un fallo conocido</td></tr>
</tbody></table></div>
     <p>Regla: en el <b>módulo raíz</b>, <code>~&gt;</code> para no saltar de versión mayor sin querer; en <b>módulos reutilizables</b>, solo mínimos (<code>&gt;=</code>) para no bloquear a quien los usa.</p>`},
 {t:"info", eti:"El lock file", h:".terraform.lock.hcl",
  c:`<div class="termbox">provider "registry.terraform.io/hashicorp/aws" {
  version     = "6.14.1"
  constraints = "~&gt; 6.0"
  hashes = [
    "h1:Qm9...",
    "zh:0a1...",
  ]
}</div>
     <ul><li><code>init</code> respeta la versión del lock aunque haya una más nueva.</li>
     <li><code>init -upgrade</code> busca la más nueva que cumpla las restricciones y reescribe el lock: es un cambio que se revisa en un PR.</li>
     <li>Los <b>hashes</b> dependen del sistema operativo. Si el equipo usa macOS y el CI Linux, genera los de todas las plataformas: <code>terraform providers lock -platform=linux_amd64 -platform=darwin_arm64</code>.</li></ul>
     <div class="nota ojo"><b class="tit">Versiones mayores</b>El provider de AWS 6.0 (2025) cambió y eliminó argumentos. Un salto de mayor se hace a propósito: leyendo la guía de actualización y revisando el plan.</div>`},
 {t:"opcion", p:"¿Qué versiones admite <code>version = \"~&gt; 1.2.3\"</code>?",
  ops:["Solo la 1.2.3","De la 1.2.3 hasta antes de la 1.3.0","De la 1.2.3 hasta antes de la 2.0.0","Cualquier 1.x"],
  ok:1, why:"~&gt; deja variar solo el último número que escribes: con tres números, solo el parche."},
 {t:"term", p:"Actualiza los providers a la versión más nueva que permitan las restricciones",
  prompt:"pablo@portatil:~/infra$", sol:["terraform init -upgrade","tofu init -upgrade"],
  salida:`Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 6.0"...
- Installing hashicorp/aws v6.14.1...
- Installed hashicorp/aws v6.14.1 (signed by HashiCorp)

Terraform has made some changes to the provider dependency selections recorded
in the .terraform.lock.hcl file. Review those changes and commit them to your
version control system if they represent changes you intended to make.`,
  pista:"init con la opción de actualizar.",
  why:"El cambio en el lock va a un PR con su plan: si el provider nuevo cambia algo, lo verás."},
 {t:"term", p:"Añade al lock los hashes de Linux (amd64) y macOS (arm64) para que el CI y los Mac del equipo validen igual",
  prompt:"pablo@portatil:~/infra$", sol:["terraform providers lock -platform=linux_amd64 -platform=darwin_arm64","terraform providers lock -platform=darwin_arm64 -platform=linux_amd64"],
  salida:`- Fetching hashicorp/aws 6.14.1 for linux_amd64...
- Retrieved hashicorp/aws 6.14.1 for linux_amd64 (signed by HashiCorp)
- Fetching hashicorp/aws 6.14.1 for darwin_arm64...
- Retrieved hashicorp/aws 6.14.1 for darwin_arm64 (signed by HashiCorp)

Success! Terraform has updated the lock file.`,
  pista:"terraform providers lock y una opción -platform= por cada sistema.",
  why:"Sin esto, el CI puede fallar con «the current package doesn't match any of the checksums previously recorded»."},
 {t:"par", p:"Empareja cada restricción con su efecto",
  pares:[["~> 6.0","Cualquier 6.x"],["~> 6.2.0","Solo parches de la 6.2"],[">= 5.0","Esa o cualquier superior, incluidas mayores"],["= 6.2.0","Exactamente esa"],["!= 6.4.1","Todas menos esa"]],
  why:"En módulos que publicas, >= es lo más amable; en tu raíz, ~> te protege."},
 {t:"vf", p:"Si el lock file fija aws 6.10.0 y ya existe la 6.14.1, un <code>terraform init</code> normal instala la 6.14.1.",
  ok:false, why:"init respeta el lock. Solo init -upgrade cambia la versión elegida."},
 {t:"opcion", p:"Tu módulo reutilizable declara <code>aws = \"= 6.2.0\"</code>. ¿Qué problema causa?",
  ops:["Ninguno","Obliga a todos los que lo usan a esa versión exacta y choca con cualquier otro módulo que pida otra","Hace el módulo más rápido","Impide usar alias"],
  ok:1, why:"Terraform necesita una única versión de cada provider que satisfaga a todos los módulos. En módulos, pon mínimos."}
]}

]});
