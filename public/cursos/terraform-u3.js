window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Variables, salidas y tipos",
resumen: "Variables de entrada y de dónde toman su valor, locals y outputs, el sistema de tipos, validaciones y valores sensibles",
nivel: "Fundamentos",
color: "#b58cf5",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"tf2l2",
titulo:"Variables de entrada",
claves:["variable con type, description, default y, si hace falta, sensitive o nullable","Valores desde default, TF_VAR_nombre, terraform.tfvars, *.auto.tfvars, -var-file y -var","Lo que se escribe en la línea de comandos gana; el default es lo último que se usa"],
pasos:[
 {t:"info", eti:"Parametrizar", h:"Declarar una variable",
  c:`<div class="termbox">variable "entorno" {
  type        = string
  description = "dev, staging o prod"
}

variable "tamano_instancia" {
  type        = string
  description = "Tipo de instancia EC2 de la API"
  default     = "t4g.small"
}

variable "zonas" {
  type    = list(string)
  default = ["eu-west-1a", "eu-west-1b"]
}

resource "aws_instance" "api" {
  instance_type = var.tamano_instancia
  tags          = { Entorno = var.entorno }
}</div>
     <ul><li>Sin <code>default</code>, la variable es <b>obligatoria</b>: si nadie le da valor, Terraform lo pregunta por teclado (o falla con <code>-input=false</code>, lo habitual en CI).</li>
     <li><code>description</code> es documentación para quien use tu código (y terraform-docs la lee).</li>
     <li>Dentro de la configuración se leen con <code>var.nombre</code>.</li></ul>`},
 {t:"info", eti:"De dónde salen", h:"Orden de precedencia",
  c:`<div class="dg"><div class="dg-tit">de menor a mayor prioridad (gana la de abajo)</div><div class="dg-vert">
       <div class="dg-caja base">default de la declaración</div>
       <div class="dg-caja">variables de entorno TF_VAR_nombre</div>
       <div class="dg-caja">terraform.tfvars y terraform.tfvars.json</div>
       <div class="dg-caja">*.auto.tfvars (en orden alfabético)</div>
       <div class="dg-caja acento">-var y -var-file en la línea de comandos<small>en el orden en que se escriben</small></div>
     </div></div>
     <div class="termbox"># prod.tfvars
entorno          = "prod"
tamano_instancia = "m7g.large"

terraform plan -var-file=prod.tfvars
terraform plan -var-file=prod.tfvars -var="tamano_instancia=m7g.xlarge"
TF_VAR_entorno=dev terraform plan</div>
     <p><code>terraform.tfvars</code> y <code>*.auto.tfvars</code> se cargan solos; cualquier otro nombre hay que pasarlo con <code>-var-file</code>.</p>`},
 {t:"orden", p:"Ordena las fuentes de valor de una variable de MENOR a MAYOR prioridad",
  items:["default en el bloque variable","Variable de entorno TF_VAR_","terraform.tfvars","fichero .auto.tfvars","-var en la línea de comandos"],
  why:"Lo más explícito y cercano a la ejecución gana. Un TF_VAR_ olvidado en tu terminal pierde frente a terraform.tfvars."},
 {t:"term", p:"Planifica usando los valores del fichero <code>prod.tfvars</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan -var-file=prod.tfvars","terraform plan -var-file prod.tfvars","terraform plan -var-file=./prod.tfvars"],
  salida:`Plan: 12 to add, 0 to change, 0 to destroy.`,
  pista:"La opción -var-file= con el nombre del fichero.",
  why:"Un tfvars por entorno es la forma más simple de reutilizar el mismo código con valores distintos."},
 {t:"term", p:"Planifica dando a la variable <code>entorno</code> el valor <code>staging</code> directamente en la línea de comandos",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan -var=\"entorno=staging\"","terraform plan -var=entorno=staging","terraform plan -var 'entorno=staging'","terraform plan -var \"entorno=staging\""],
  salida:`Plan: 12 to add, 0 to change, 0 to destroy.`,
  pista:"-var= con nombre=valor.",
  why:"-var gana a todo lo demás. Cómodo para pruebas; para lo habitual, mejor un tfvars versionado."},
 {t:"escribe", p:"¿Cómo se llama la variable de entorno que da valor a la variable de Terraform <code>region</code>?",
  sol:["TF_VAR_region"], pista:"Prefijo TF_VAR_ y el nombre tal cual.",
  why:"Útil para secretos en el CI: no quedan escritos en ningún fichero ni en el historial de la terminal."},
 {t:"opcion", p:"Una variable sin <code>default</code> no recibe valor por ningún medio y el CI ejecuta <code>terraform plan -input=false</code>. ¿Qué pasa?",
  ops:["Usa una cadena vacía","Falla con «No value for required variable»","Usa null","Pregunta por teclado y el pipeline se queda colgado"],
  ok:1, why:"-input=false evita que un pipeline se quede esperando una respuesta que nunca llegará."},
 {t:"vf", p:"Un fichero llamado <code>prod.tfvars</code> se carga automáticamente en cada plan.",
  ok:false, why:"Solo se cargan solos terraform.tfvars(.json) y *.auto.tfvars(.json). prod.tfvars necesita -var-file."}
]},

/* =============== U3 L2 =============== */
{
id:"tf3n1",
titulo:"Locals y outputs",
claves:["locals: valores calculados con nombre, para no repetir expresiones","output: lo que la configuración o el módulo expone (a la terminal, al CI o a otros módulos)","terraform output, output -raw para scripts y output -json para máquinas"],
pasos:[
 {t:"info", eti:"No repetirse", h:"locals",
  c:`<div class="termbox">locals {
  nombre   = "catappa-\${var.entorno}"
  es_prod  = var.entorno == "prod"
  etiquetas = merge(var.etiquetas_comunes, {
    entorno  = var.entorno
    servicio = "api"
  })
}

resource "aws_s3_bucket" "logs" {
  bucket = "\${local.nombre}-logs"
  tags   = local.etiquetas
}</div>
     <p>Se declaran con <code>locals</code> (plural) y se leen con <code>local.nombre</code> (singular). Úsalos para dar nombre a algo que se calcula o se repite; si abusas, el lector tiene que saltar por todo el código para entender un valor.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">variable, local u output</div><table class="dg-tabla"><thead><tr><th></th><th>quién lo fija</th><th>se parece a</th></tr></thead><tbody>
<tr><td>variable</td><td>quien usa el código</td><td>parámetro de una función</td></tr>
<tr><td>local</td><td>el propio código</td><td>variable local de una función</td></tr>
<tr><td>output</td><td>el propio código, hacia fuera</td><td>valor de retorno</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Hacia fuera", h:"outputs",
  c:`<div class="termbox">output "url_api" {
  description = "URL pública del balanceador"
  value       = "https://\${aws_lb.api.dns_name}"
}

output "cadena_conexion" {
  value     = "postgres://app@\${aws_db_instance.principal.address}:5432/app"
  sensitive = true
}</div>
     <div class="termbox">$ terraform output
cadena_conexion = &lt;sensitive&gt;
url_api = "https://api-prod-123.eu-west-1.elb.amazonaws.com"

$ terraform output -raw url_api       # sin comillas, para scripts
https://api-prod-123.eu-west-1.elb.amazonaws.com</div>
     <p>En un módulo hijo, los outputs son lo único que el padre puede leer: <code>module.red.subredes_privadas</code>.</p>`},
 {t:"hueco", p:"Completa: se declara en plural y se usa en singular",
  tpl:"___ {\n  nombre = \"catappa-${var.entorno}\"\n}\n\nresource \"aws_s3_bucket\" \"b\" {\n  bucket = ___.nombre\n}", banco:["locals","local","self","var","variable"], sol:["locals","local"],
  why:"Es el error de principiante más repetido: locals.nombre no existe."},
 {t:"term", p:"Imprime solo el valor del output <code>url_api</code>, sin comillas, para usarlo en un script",
  prompt:"pablo@portatil:~/infra$", sol:["terraform output -raw url_api","tofu output -raw url_api"],
  salida:`https://api-prod-123.eu-west-1.elb.amazonaws.com`,
  pista:"output con la opción que da el valor en bruto.",
  why:"curl \"$(terraform output -raw url_api)/salud\" funciona; con comillas incluidas, no."},
 {t:"term", p:"Obtén todos los outputs en JSON para procesarlos con <code>jq</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform output -json","tofu output -json"],
  salida:`{
  "url_api": {
    "sensitive": false,
    "type": "string",
    "value": "https://api-prod-123.eu-west-1.elb.amazonaws.com"
  }
}`,
  pista:"output con la opción de formato JSON.",
  why:"Ojo: -json y -raw muestran en claro también los outputs sensitive."},
 {t:"par", p:"Empareja cada pieza con su equivalente en una función",
  pares:[["variable","Parámetro de entrada"],["local","Variable interna calculada"],["output","Valor de retorno"],["module.red.vpc_id","Usar lo que devolvió otra función"]],
  why:"Pensar en un módulo como una función ayuda a diseñar interfaces pequeñas y claras."},
 {t:"opcion", p:"Un output usa la contraseña de una variable <code>sensitive</code> pero no está marcado como sensitive. ¿Qué ocurre?",
  ops:["Se imprime la contraseña","Terraform da error y te obliga a marcar el output como sensitive (o a quitar el dato)","Se imprime cifrada","Nada"],
  ok:1, why:"La marca sensitive se propaga: Terraform no deja que un valor sensible salga por un output sin declararlo."},
 {t:"vf", p:"<code>terraform output</code> necesita volver a consultar la API del proveedor.",
  ok:false, why:"Lee los outputs guardados en el estado. Por eso es rápido y funciona sin cambios pendientes."}
]},

/* =============== U3 L3 =============== */
{
id:"tf2l3",
titulo:"El sistema de tipos",
claves:["Primitivos: string, number, bool. Colecciones: list, set, map. Estructurales: object, tuple","optional() en objetos para atributos opcionales con valor por defecto","Terraform convierte tipos cuando puede; null significa «sin valor» y activa el default"],
pasos:[
 {t:"info", eti:"Tipos", h:"Colecciones y estructuras",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tipos de Terraform</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>ejemplo</th><th>notas</th></tr></thead><tbody>
<tr><td>string, number, bool</td><td>"api", 3, true</td><td>primitivos</td></tr>
<tr><td>list(string)</td><td>["a", "b", "a"]</td><td>ordenada, admite repetidos</td></tr>
<tr><td>set(string)</td><td>toset(["a", "b"])</td><td>sin orden ni repetidos</td></tr>
<tr><td>map(number)</td><td>{ dev = 1, prod = 3 }</td><td>claves string, valores del mismo tipo</td></tr>
<tr><td>object({...})</td><td>{ nombre = "api", cpu = 512 }</td><td>atributos con tipos distintos</td></tr>
<tr><td>tuple([string, number])</td><td>["api", 8080]</td><td>posiciones con tipos distintos</td></tr>
<tr><td>any</td><td>—</td><td>Terraform deduce el tipo (úsalo poco)</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Entradas estructuradas", h:"Objetos con atributos opcionales",
  c:`<div class="termbox">variable "servicios" {
  type = map(object({
    imagen   = string
    cpu      = optional(number, 256)
    memoria  = optional(number, 512)
    replicas = optional(number, 2)
    publico  = optional(bool, false)
  }))
}

# terraform.tfvars
servicios = {
  api    = { imagen = "ghcr.io/catappa/api:1.4.0", cpu = 512, publico = true }
  worker = { imagen = "ghcr.io/catappa/worker:1.4.0" }
}</div>
     <p>Terraform <b>convierte</b> automáticamente cuando puede: <code>"3"</code> sirve donde se espera un number y una lista literal sirve donde se espera un set. Las funciones <code>tostring</code>, <code>tonumber</code>, <code>tolist</code>, <code>toset</code> y <code>tomap</code> lo hacen explícito.</p>
     <p><code>null</code> significa «este argumento no tiene valor»: el provider usa su valor por defecto, como si no lo hubieras escrito.</p>`},
 {t:"par", p:"Empareja cada tipo con un valor válido o su característica",
  pares:[["list(string)","[\"a\", \"b\", \"a\"]"],["set(string)","Colección sin duplicados ni orden"],["map(number)","{ dev = 1, prod = 3 }"],["object({ nombre = string })","{ nombre = \"api\" }"],["tuple([string, number])","[\"api\", 8080]"]],
  why:"Tipos precisos convierten errores de configuración en errores de plan, no de producción."},
 {t:"opcion", p:"¿Qué aporta <code>optional(number, 256)</code> dentro de un <code>object</code>?",
  ops:["Nada","El atributo puede omitirse y entonces vale 256","Obliga a indicarlo","Lo convierte en texto"],
  ok:1, why:"Módulos con entradas cómodas: quien los usa solo indica lo que cambia."},
 {t:"opcion", p:"Declaras <code>type = list(string)</code> y alguien pasa <code>[\"a\", 2, true]</code>. ¿Qué ocurre?",
  ops:["Error: no se puede convertir","Terraform convierte 2 y true a \"2\" y \"true\"","Se descartan los que no son string","Se convierte en tupla"],
  ok:1, why:"number y bool se convierten sin pérdida a string. Al revés (\"hola\" a number) sí fallaría."},
 {t:"hueco", p:"Completa el tipo de una variable que es un mapa de objetos con un atributo opcional",
  tpl:"variable \"colas\" {\n  type = ___(object({\n    retencion = ___(number, 345600)\n  }))\n}", banco:["map","list","optional","default","any"], sol:["map","optional"],
  why:"map(object(...)) es la forma más habitual de describir «varios elementos con nombre y configuración»."},
 {t:"vf", p:"Asignar <code>null</code> a un argumento de un recurso equivale a no escribir ese argumento.",
  ok:true, why:"Muy útil con condicionales: var.kms_key != \"\" ? var.kms_key : null."},
 {t:"escribe", p:"¿Qué función convierte una lista en un conjunto (sin duplicados), por ejemplo para usarla con for_each?",
  sol:["toset","toset()"], pista:"to + el nombre del tipo en inglés.",
  why:"for_each exige un map o un set de strings; toset(var.nombres) es la conversión más común del lenguaje."}
]},

/* =============== U3 L4 =============== */
{
id:"tf3n2",
titulo:"Validaciones y valores sensibles",
claves:["validation rechaza valores incorrectos antes del plan, con un mensaje claro","can(), regex(), contains() y length() son las piezas habituales de una condición","sensitive oculta el valor en pantalla, pero sigue en el estado; nullable = false prohíbe null"],
pasos:[
 {t:"info", eti:"Fallar pronto", h:"Bloques validation",
  c:`<div class="termbox">variable "entorno" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.entorno)
    error_message = "El entorno debe ser dev, staging o prod."
  }
}

variable "nombre_bucket" {
  type = string
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9.-]{2,62}$", var.nombre_bucket))
    error_message = "Nombre de bucket S3 no válido."
  }
}

variable "replicas" {
  type     = number
  nullable = false
  validation {
    condition     = var.replicas &gt;= 1 &amp;&amp; var.replicas &lt;= 20
    error_message = "Entre 1 y 20 réplicas."
  }
}</div>
     <p>Puede haber varios bloques <code>validation</code> por variable. Desde Terraform 1.9 la condición puede usar <b>otras variables</b> (por ejemplo, «si entorno es prod, réplicas al menos 2»).</p>`},
 {t:"info", eti:"Secretos a la vista", h:"sensitive",
  c:`<div class="termbox">variable "clave_api_pagos" {
  type      = string
  sensitive = true
}

  # en el plan:
  ~ environment = (sensitive value)</div>
     <ul><li>La marca <b>se propaga</b>: todo lo calculado a partir de un valor sensible también lo es.</li>
     <li><code>nonsensitive(valor)</code> quita la marca (solo si de verdad no es secreto, como un hash).</li>
     <li>Solo afecta a <b>lo que se muestra</b>: el valor sigue guardado en claro en el estado y en los planes guardados.</li></ul>
     <div class="nota ojo"><b class="tit">No confundir</b>sensitive no cifra nada. Para que un secreto no llegue al estado hay valores ephemeral y argumentos write-only (unidad de secretos).</div>`},
 {t:"hueco", p:"Completa la validación del entorno",
  tpl:"variable \"entorno\" {\n  type = string\n  ___ {\n    condition     = ___([\"dev\", \"prod\"], var.entorno)\n    error_message = \"Entorno no válido.\"\n  }\n}", banco:["validation","check","contains","lookup","precondition"], sol:["validation","contains"],
  why:"contains(lista, valor) devuelve true si el valor está en la lista."},
 {t:"par", p:"Empareja cada función con su uso en validaciones",
  pares:[["contains(lista, v)","Comprobar que un valor está en una lista permitida"],["can(expr)","Convertir un posible error en false"],["regex(patrón, texto)","Exigir un formato (falla si no casa)"],["length(x)","Limitar el número de elementos o caracteres"],["alltrue([for ...])","Comprobar una condición en todos los elementos"]],
  why:"can(regex(...)) es el patrón clásico: regex falla si no casa, y can lo convierte en false."},
 {t:"opcion", p:"¿Qué muestra Terraform si alguien pasa <code>entorno = \"produccion\"</code> con la validación de la lección?",
  ops:["Crea el entorno produccion","Un error con tu error_message, antes de planificar nada","Un aviso y sigue","Nada"],
  ok:1, why:"Error: Invalid value for variable ... El entorno debe ser dev, staging o prod."},
 {t:"vf", p:"Una variable marcada como <code>sensitive</code> no se guarda en el fichero de estado.",
  ok:false, why:"Se guarda en claro en el estado. Por eso el estado debe estar cifrado y con acceso restringido."},
 {t:"opcion", p:"¿Qué hace <code>nullable = false</code> en una variable con default?",
  ops:["Nada","Si alguien pasa null explícitamente, se usa el default en vez de null","Hace la variable obligatoria","La marca como sensitive"],
  ok:1, why:"Así el código del módulo nunca tiene que protegerse contra un null inesperado."},
 {t:"escribe", p:"¿Qué función quita la marca de sensible a un valor que en realidad no es secreto?",
  sol:["nonsensitive","nonsensitive()"], pista:"«no sensible» en inglés, todo junto.",
  why:"Úsala con cuidado: si el valor sí era secreto, acabará impreso en los logs del CI."}
]}

]});
