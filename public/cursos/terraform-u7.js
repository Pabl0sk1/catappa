window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Módulos",
resumen: "Crear y usar módulos, fuentes y versiones, el registro, diseño de buenas interfaces, módulos con for_each, providers en módulos y composición",
nivel: "Avanzado",
color: "#9a70dc",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"tf5l1",
titulo:"Crear y usar módulos",
claves:["Un módulo es una carpeta de ficheros .tf con variables (entradas) y outputs (salidas)","Se llama con module \"nombre\" { source = ... } y se leen sus salidas con module.nombre.salida","Encapsula buenas prácticas: una vez bien hecho, se reutiliza en todos los entornos"],
pasos:[
 {t:"info", eti:"Reutilizar", h:"Estructura de un módulo",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">infra/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">modulos/servicio-ecs/</span><span class="coment">módulo hijo</span></div><div class="rama" style="--n:2"><span class="nom">variables.tf</span><span class="coment">nombre, imagen, cpu, memoria, subredes, puerto...</span></div><div class="rama" style="--n:2"><span class="nom">main.tf</span><span class="coment">task definition, service, target group, logs, alarmas</span></div><div class="rama" style="--n:2"><span class="nom">outputs.tf</span><span class="coment">url, nombre del servicio, rol</span></div><div class="rama" style="--n:2"><span class="nom">versions.tf</span><span class="coment">required_providers con versiones mínimas</span></div><div class="rama" style="--n:2"><span class="nom">README.md</span></div><div class="rama" style="--n:1"><span class="nom carpeta">entornos/prod/</span><span class="coment">módulo raíz: aquí se ejecuta terraform</span></div><div class="rama" style="--n:2"><span class="nom">main.tf</span><span class="coment">llama a los módulos</span></div></div>
     <div class="termbox"># entornos/prod/main.tf
module "api" {
  source   = "../../modulos/servicio-ecs"
  nombre   = "tareas-api"
  imagen   = "123456789012.dkr.ecr.eu-west-1.amazonaws.com/tareas-api:1.4.0"
  cpu      = 512
  memoria  = 1024
  subredes = module.red.subredes_privadas      # salida de otro módulo
}

output "url_api" {
  value = module.api.url
}</div>`},
 {t:"info", eti:"Vocabulario", h:"Raíz, hijo y lo que se ve",
  c:`<ul><li><b>Módulo raíz</b>: la carpeta donde ejecutas <code>terraform</code>. Tiene backend y providers.</li>
     <li><b>Módulo hijo</b>: el que se llama con <code>module</code>. Solo ve lo que le pasas como variables.</li>
     <li>Desde fuera solo se ven sus <b>outputs</b>: <code>module.api.url</code>. Sus recursos internos no se pueden referenciar.</li>
     <li>En el estado sus recursos aparecen con prefijo: <code>module.api.aws_ecs_service.this</code>.</li></ul>
     <div class="nota"><b class="tit">Convención</b>Cuando un módulo tiene un único recurso principal de un tipo, se suele llamar <code>this</code> o <code>main</code>: <code>aws_s3_bucket.this</code>.</div>`},
 {t:"par", p:"Empareja cada elemento con su papel en un módulo",
  pares:[["variables.tf","Las entradas que acepta el módulo"],["outputs.tf","Lo que el módulo expone a quien lo usa"],["source","Dónde está el módulo (carpeta, Git o registro)"],["module.red.subredes_privadas","Usar la salida de otro módulo"]],
  why:"Un buen módulo tiene pocas entradas obligatorias y valores por defecto seguros."},
 {t:"opcion", p:"¿Qué ventaja tiene un módulo «servicio-ecs» usado por 15 servicios?",
  ops:["Ninguna","Las buenas prácticas (logs, alarmas, permisos mínimos) se definen una vez y se aplican a todos; mejorar el módulo mejora todos los servicios","Es más rápido de ejecutar","Evita el estado"],
  ok:1, why:"Es la base de una plataforma interna."},
 {t:"hueco", p:"Completa la llamada al módulo y el uso de su salida",
  tpl:"___ \"red\" {\n  ___ = \"../../modulos/red\"\n  cidr = \"10.0.0.0/16\"\n}\n\nvpc_id = ___.red.vpc_id", banco:["module","source","module","path","modules","var"], sol:["module","source","module"],
  why:"La salida se lee como module.NOMBRE.SALIDA, donde NOMBRE es la etiqueta del bloque, no la carpeta."},
 {t:"opcion", p:"Desde el módulo raíz intentas usar <code>module.api.aws_ecs_service.this.name</code>. ¿Qué pasa?",
  ops:["Funciona","Error: solo se pueden leer los outputs del módulo; hay que exponer el nombre con un output","Devuelve null","Funciona solo con plan"],
  ok:1, why:"El módulo es una caja negra con una interfaz: variables de entrada y outputs de salida."},
 {t:"vf", p:"Tras añadir o cambiar la fuente de un módulo hay que ejecutar <code>terraform init</code>.",
  ok:true, why:"init descarga o enlaza los módulos. Si no, el plan falla con «Module not installed»."},
 {t:"escribe", p:"¿Cómo se llama la carpeta donde ejecutas terraform, la que tiene backend y providers?",
  sol:["módulo raíz","modulo raiz","raíz","raiz","root module","el módulo raíz"], pista:"Es el módulo del que cuelgan todos los demás.",
  why:"Los módulos hijos no deberían configurar backend ni providers: eso es cosa del raíz."}
]},

/* =============== U7 L2 =============== */
{
id:"tf5l2",
titulo:"Fuentes, versiones y el registro",
claves:["Fuentes: carpeta local, registro (público o privado), Git con ?ref=, S3 o HTTP","Fija versiones de módulos como de cualquier dependencia","El registro público ofrece módulos mantenidos (terraform-aws-modules); léelos antes de usarlos"],
pasos:[
 {t:"info", eti:"No reinventar", h:"Módulos del registro y de Git",
  c:`<div class="termbox">module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"      # registro: organización/nombre/provider
  version = "~&gt; 6.0"

  name            = "catappa-prod"
  cidr            = "10.0.0.0/16"
  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  enable_nat_gateway     = true
  one_nat_gateway_per_az = true
}

# módulo propio desde Git con una versión fija (etiqueta)
module "api" {
  source = "git::https://github.com/catappa/infra-modulos.git//servicio-ecs?ref=v2.3.0"
}</div>`},
 {t:"info", eti:"Fuentes", h:"De dónde puede venir un módulo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">formas de source</div><table class="dg-tabla"><thead><tr><th>fuente</th><th>ejemplo</th><th>versión</th></tr></thead><tbody>
<tr><td>carpeta local</td><td>"../modulos/red"</td><td>la del propio repositorio</td></tr>
<tr><td>registro público</td><td>"terraform-aws-modules/vpc/aws"</td><td>argumento version</td></tr>
<tr><td>registro privado</td><td>"app.terraform.io/catappa/red/aws"</td><td>argumento version</td></tr>
<tr><td>Git</td><td>"git::https://...git//carpeta?ref=v2.3.0"</td><td>?ref= etiqueta o commit</td></tr>
<tr><td>S3 / HTTP</td><td>"s3::https://.../red.zip"</td><td>la del fichero</td></tr>
</tbody></table></div>
     <p><code>version</code> solo funciona con registros. En Git, la versión va en <code>?ref=</code>; <code>//carpeta</code> indica un subdirectorio del repositorio.</p>
     <div class="nota ojo"><b class="tit">Antes de usar un módulo ajeno</b>Lee qué crea, qué permisos pide y quién lo mantiene. Un módulo es código que se ejecuta con tus credenciales.</div>`},
 {t:"par", p:"Empareja cada capa con lo que contiene y con qué frecuencia cambia",
  pares:[["Cuenta y red","VPC, subredes, DNS: cambia muy poco"],["Datos","RDS, S3, caché: cambia poco y es crítica"],["Plataforma","Clúster EKS o ECS, balanceadores"],["Servicios","Cada aplicación: cambia a menudo"]],
  why:"Estados separados por capa: un error al desplegar una aplicación nunca puede tocar la red o la base de datos."},
 {t:"opcion", p:"¿Por qué fijar <code>ref=v2.3.0</code> al usar un módulo desde Git?",
  ops:["Por estética","Para que un cambio en la rama principal del módulo no altere sin querer tu infraestructura en el siguiente plan","Porque Git lo exige","Para ir más rápido"],
  ok:1, why:"Actualizar la versión del módulo es un cambio explícito y revisado."},
 {t:"hueco", p:"Completa la fuente Git para usar la carpeta <code>red</code> en la etiqueta <code>v1.4.0</code>",
  tpl:"source = \"git::https://github.com/catappa/modulos.git___red___v1.4.0\"", banco:["//","?ref=","/","?version=","#"], sol:["//","?ref="],
  why:"// separa el repositorio del subdirectorio; ?ref= elige etiqueta, rama o commit."},
 {t:"vf", p:"El argumento <code>version</code> de un bloque module funciona con cualquier fuente, incluida Git.",
  ok:false, why:"Solo con registros. Con Git se usa ?ref= en la propia URL."},
 {t:"opcion", p:"Actualizas el módulo de VPC de la 5.x a la 6.x. ¿Qué haces antes de aplicar?",
  ops:["Aplicar directamente","Leer las notas de la versión mayor, ejecutar terraform init -upgrade y revisar con lupa el plan en busca de reemplazos","Borrar el estado de la red","Nada, las mayores son compatibles"],
  ok:1, why:"Una versión mayor de un módulo puede renombrar recursos internos: si los autores no incluyeron bloques moved, verás reemplazos."},
 {t:"escribe", p:"¿Qué argumento del bloque module fija la versión cuando la fuente es un registro?",
  sol:["version"], pista:"El mismo nombre que en required_providers.",
  why:"version = \"~> 6.0\" usa las mismas restricciones que los providers."}
]},

/* =============== U7 L3 =============== */
{
id:"tf5l3",
titulo:"Diseñar buenos módulos",
claves:["Interfaz pequeña: pocas variables obligatorias y valores por defecto seguros","Los módulos no configuran providers; los recibe quien los usa","Versionado semántico, ejemplos, README generado y pruebas"],
pasos:[
 {t:"info", eti:"Buenas prácticas", h:"Un módulo que otros quieran usar",
  c:`<ul><li><b>Una responsabilidad</b>: «servicio ECS», «bucket seguro», no «toda la infraestructura».</li>
     <li><b>Seguro por defecto</b>: cifrado activo, sin acceso público, logs activados; lo inseguro hay que pedirlo explícitamente.</li>
     <li><b>Sin bloques provider</b> dentro: el llamador decide región y cuenta.</li>
     <li><b>Versiones mínimas</b> de providers (<code>&gt;=</code>), no exactas.</li>
     <li><b>Salidas útiles</b>: ids, ARNs, nombres, URLs.</li>
     <li><b>Versionado semántico</b>: 2.3.0 → 2.4.0 añade, 3.0.0 rompe compatibilidad.</li>
     <li>Carpeta <code>examples/</code>, pruebas con <code>terraform test</code> y README generado con <b>terraform-docs</b>.</li></ul>`},
 {t:"info", eti:"Ni muy fino ni muy gordo", h:"El tamaño adecuado",
  c:`<div class="dg"><div class="dg-tit">tres niveles de módulo</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">demasiado fino</div><div class="dg-caja aviso">módulo «aws_s3_bucket»<small>envuelve un recurso sin aportar nada</small></div></div>
       <div class="dg-col"><div class="dg-col-tit">adecuado</div><div class="dg-caja ok">«bucket-seguro»<small>bucket + cifrado + versionado + bloqueo público + política</small></div></div>
       <div class="dg-col"><div class="dg-col-tit">demasiado gordo</div><div class="dg-caja aviso">«toda-la-app»<small>red, datos y servicios juntos: imposible de reutilizar</small></div></div>
     </div></div>
     <div class="termbox">variable "retencion" {
  description = "Días que se conservan las versiones antiguas"
  type        = number
  default     = 30
}

variable "acceso_publico" {
  description = "Permitir lectura pública. Casi nunca es lo que quieres."
  type        = bool
  default     = false            # lo seguro por defecto
}</div>`},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["Valores por defecto seguros","Nadie crea un bucket público por olvido"],["Sin provider dentro del módulo","El módulo sirve para cualquier región o cuenta"],["Versionado semántico","Saber si una actualización rompe algo"],["Carpeta examples/","Documentación ejecutable de cómo usarlo"],["terraform-docs","README siempre al día con entradas y salidas"]],
  why:"Un catálogo de módulos bien hechos es la base de una plataforma interna."},
 {t:"opcion", p:"Tu módulo de bucket tiene 40 variables y todas obligatorias. ¿Qué mejorarías?",
  ops:["Nada","Reducir las obligatorias al mínimo (nombre) y dar valores por defecto seguros al resto, agrupando opciones en objetos con optional()","Añadir más variables","Quitar las salidas"],
  ok:1, why:"Un módulo difícil de usar acaba copiado y modificado, que es justo lo que se quería evitar."},
 {t:"vf", p:"Cambiar el nombre de una variable obligatoria de un módulo es un cambio compatible (versión menor).",
  ok:false, why:"Rompe a todos los que lo usan: es un cambio mayor, o se añade la nueva manteniendo la antigua un tiempo."},
 {t:"opcion", p:"Refactorizas el módulo y renombras <code>aws_s3_bucket.bucket</code> a <code>aws_s3_bucket.this</code>. ¿Qué incluyes para no romper a quien lo usa?",
  ops:["Nada","Un bloque moved dentro del propio módulo, para que cada estado que lo use migre sin destruir","Una nota en el README pidiendo que borren el bucket","Una versión mayor y que cada equipo lo arregle"],
  ok:1, why:"Los bloques moved dentro de un módulo se aplican en todos los estados que lo usan."},
 {t:"orden", p:"Ordena la publicación de una nueva versión de un módulo interno",
  items:["Cambio en una rama con sus pruebas (terraform test)","Revisión del PR y del ejemplo actualizado","Fusionar y crear la etiqueta semántica (v2.4.0)","Los equipos suben la versión en su código con un PR","Cada equipo revisa su plan y aplica"],
  why:"Nadie recibe cambios sin pedirlos: cada consumidor elige cuándo subir de versión."},
 {t:"escribe", p:"¿Qué herramienta genera automáticamente el README de un módulo con sus variables y outputs?",
  sol:["terraform-docs","terraform docs"], pista:"terraform- y «documentación» en inglés.",
  why:"Se suele ejecutar en un hook de pre-commit o en el CI para que el README nunca se quede viejo."}
]},

/* =============== U7 L4 =============== */
{
id:"tf7n1",
titulo:"Módulos avanzados: repetición, providers y composición",
claves:["count y for_each también sirven en bloques module: module.bucket[\"logs\"]","providers = { aws = aws.virginia } pasa otra configuración de provider al módulo; configuration_aliases la exige","Composición: módulos pequeños combinados en el raíz, mejor que módulos que llaman a módulos que llaman a módulos"],
pasos:[
 {t:"info", eti:"Repetir módulos", h:"for_each en módulos",
  c:`<div class="termbox">variable "buckets" {
  type = map(object({
    retencion = optional(number, 30)
    publico   = optional(bool, false)
  }))
}

module "bucket" {
  source   = "../modulos/bucket-seguro"
  for_each = var.buckets
  nombre   = "catappa-\${each.key}"
  retencion = each.value.retencion
}

output "arns" {
  value = { for k, m in module.bucket : k =&gt; m.arn }
}
# en el estado: module.bucket["logs"].aws_s3_bucket.this</div>
     <div class="nota ojo"><b class="tit">Módulos con provider dentro</b>Un módulo que declara sus propios bloques provider no puede usarse con count, for_each ni depends_on. Otra razón para no poner providers en los módulos.</div>`},
 {t:"info", eti:"Otra región", h:"Pasar providers a un módulo",
  c:`<div class="termbox"># raíz
provider "aws" { region = "eu-west-1" }
provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

module "cdn" {
  source = "../modulos/cdn"
  providers = {
    aws        = aws               # el de siempre
    aws.global = aws.virginia      # el que el módulo llama aws.global
  }
}

# modulos/cdn/versions.tf
terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "&gt;= 6.0"
      configuration_aliases = [aws.global]
    }
  }
}
# dentro del módulo: resource "aws_acm_certificate" "this" { provider = aws.global ... }</div>`},
 {t:"hueco", p:"Completa para que el módulo use la configuración del provider de us-east-1",
  tpl:"module \"cdn\" {\n  source = \"../modulos/cdn\"\n  ___ = {\n    aws.global = ___\n  }\n}", banco:["providers","provider","aws.virginia","aws.global","virginia"], sol:["providers","aws.virginia"],
  why:"A la izquierda, el nombre que usa el módulo; a la derecha, la configuración del raíz que le pasas."},
 {t:"term", p:"Lista las direcciones del estado que pertenecen a las instancias del módulo <code>bucket</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform state list module.bucket","tofu state list module.bucket"],
  salida:`module.bucket["logs"].aws_s3_bucket.this
module.bucket["logs"].aws_s3_bucket_versioning.this
module.bucket["media"].aws_s3_bucket.this
module.bucket["media"].aws_s3_bucket_versioning.this`,
  pista:"state list admite una dirección como filtro.",
  why:"Cada clave del for_each es una instancia completa del módulo con todos sus recursos."},
 {t:"opcion", p:"¿Qué efecto tiene poner <code>depends_on = [module.red]</code> en un módulo que no lo necesita?",
  ops:["Ninguno","Todo el módulo espera a la red y sus data sources pueden aplazarse al apply, haciendo planes menos informativos","Acelera el plan","Evita la deriva"],
  ok:1, why:"depends_on en módulos es una dependencia gruesa: úsalo solo si no puedes pasar una referencia concreta."},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["for_each en module","Varias instancias del mismo módulo con clave"],["providers = { ... }","Asignar configuraciones de provider al módulo"],["configuration_aliases","Declarar que el módulo necesita un provider con alias"],["module.bucket[\"logs\"].arn","Salida de una instancia concreta"],["{ for k, m in module.bucket : k => m.arn }","Recoger las salidas de todas las instancias"]],
  why:"Con estas piezas, un mismo módulo sirve para cualquier número de copias, regiones o cuentas."},
 {t:"vf", p:"Un módulo que contiene su propio bloque <code>provider \"aws\"</code> puede usarse con <code>for_each</code>.",
  ok:false, why:"No: Terraform lo prohíbe. Los providers se configuran en el raíz y se pasan a los módulos."},
 {t:"opcion", p:"El módulo A llama a B, que llama a C, que llama a D, y cada nivel reenvía 30 variables. ¿Qué propones?",
  ops:["Añadir un nivel más","Aplanar: componer módulos pequeños directamente en el raíz, pasando salidas de unos como entradas de otros","Pasar todas las variables como any","Copiar el código de D en A"],
  ok:1, why:"La composición plana es más fácil de leer, probar y versionar que una cadena de módulos anidados."}
]}

]});
