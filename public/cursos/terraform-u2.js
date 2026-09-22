window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "HCL, variables y salidas",
resumen: "La sintaxis HCL, data sources, dependencias, variables con tipos y validación, locals, outputs y valores sensibles",
nivel: "Fundamentos",
color: "#b58cf5",
lecciones: [

{
id:"tf2l1",
titulo:"Sintaxis HCL y data sources",
claves:["Bloques con tipo, etiquetas y argumentos: tipo \"etiqueta\" { clave = valor }","data consulta recursos que ya existen sin gestionarlos","Dependencias implícitas por referencias; depends_on solo si no hay referencia"],
pasos:[
 {t:"info", eti:"El lenguaje", h:"HCL",
  c:`<div class="termbox"># consultar algo que ya existe
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-arm64-server-*"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id          # usa el data source
  instance_type = "t4g.small"
  subnet_id     = aws_subnet.privada_a.id          # dependencia implicita
  tags = {
    Name = "web-\${var.entorno}"                    # interpolacion
  }
}</div>`},
 {t:"par", p:"Empareja cada elemento con su significado",
  pares:[["resource","Algo que Terraform crea y gestiona"],["data","Algo existente que solo se consulta"],["var.entorno","Valor de una variable de entrada"],["\"web-${var.entorno}\"","Texto con un valor interpolado"],["depends_on","Dependencia explícita cuando no hay referencia directa"]],
  why:"Los data sources evitan copiar a mano ids de AMIs, VPCs o zonas DNS."},
 {t:"opcion", p:"¿Cómo sabe Terraform que debe crear la subred antes que la instancia?",
  ops:["Por el orden en el fichero","Porque la instancia referencia aws_subnet.privada_a.id: eso crea una dependencia implícita en el grafo","Hay que indicarlo siempre con depends_on","No lo sabe"],
  ok:1, why:"Terraform construye un grafo de dependencias y crea en paralelo lo que no depende entre sí."}
]},

{
id:"tf2l2",
titulo:"Variables, locals y outputs",
claves:["variable con type, default, description y validation","Valores desde terraform.tfvars, -var o TF_VAR_nombre","locals para valores calculados; output para exponer resultados; sensitive oculta secretos en la salida"],
pasos:[
 {t:"info", eti:"Parametrizar", h:"Entradas y salidas",
  c:`<div class="termbox">variable "entorno" {
  type        = string
  description = "dev, staging o prod"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.entorno)
    error_message = "El entorno debe ser dev, staging o prod."
  }
}

variable "tamano_instancia" {
  type    = string
  default = "t4g.small"
}

variable "clave_bd" {
  type      = string
  sensitive = true
}

locals {
  nombre = "catappa-\${var.entorno}"
  es_prod = var.entorno == "prod"
}

output "url_balanceador" {
  value = aws_lb.api.dns_name
}</div>
     <div class="termbox"># prod.tfvars
entorno = "prod"
tamano_instancia = "m7g.large"

terraform plan -var-file=prod.tfvars
TF_VAR_clave_bd=... terraform apply -var-file=prod.tfvars</div>`},
 {t:"par", p:"Empareja cada bloque con su uso",
  pares:[["variable","Valor de entrada configurable"],["locals","Valor calculado reutilizable dentro del módulo"],["output","Valor que se muestra o que usa otro módulo"],["sensitive = true","No mostrar el valor en plan ni en la salida"],["validation","Rechazar valores de entrada incorrectos"]],
  why:"sensitive oculta el valor en pantalla, pero sigue guardándose en el estado: protege el estado."},
 {t:"opcion", p:"¿Cuál es la forma correcta de pasar la contraseña de la base de datos?",
  ops:["Escribirla en main.tf","En un tfvars subido a Git","Desde una variable de entorno TF_VAR_ o, mejor, que Terraform la lea o genere en Secrets Manager","En un comentario"],
  ok:2, why:"Mejor aún: que RDS la gestione en Secrets Manager (manage_master_user_password) y nunca pase por tus manos."},
 {t:"vf", p:"Una variable marcada como <code>sensitive</code> no se guarda en el fichero de estado.",
  ok:false, why:"Se guarda en claro en el estado. Por eso el estado debe estar cifrado y con acceso restringido."}
]},

{
id:"tf2l3",
titulo:"Tipos complejos y comprobaciones",
claves:["Tipos: string, number, bool, list, set, map, object y tuple","optional() en objetos para atributos opcionales con valor por defecto","precondition, postcondition y check para validar supuestos"],
pasos:[
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
  api = { imagen = "ghcr.io/catappa/api:1.4.0", cpu = 512, publico = true }
  worker = { imagen = "ghcr.io/catappa/worker:1.4.0" }
}</div>`},
 {t:"info", eti:"Supuestos explícitos", h:"precondition, postcondition y check",
  c:`<div class="termbox">resource "aws_instance" "web" {
  instance_type = var.tipo
  lifecycle {
    precondition {
      condition     = !startswith(var.tipo, "t2.")
      error_message = "Usa una generación actual (t3 o t4g)."
    }
    postcondition {
      condition     = self.private_ip != ""
      error_message = "La instancia no obtuvo IP privada."
    }
  }
}

check "web_responde" {
  data "http" "salud" { url = "https://\${aws_lb.api.dns_name}/salud" }
  assert {
    condition     = data.http.salud.status_code == 200
    error_message = "El endpoint de salud no responde 200."
  }
}</div>`},
 {t:"par", p:"Empareja cada tipo con un valor válido",
  pares:[["list(string)","[\"a\", \"b\", \"a\"]"],["set(string)","Colección sin duplicados ni orden"],["map(number)","{ dev = 1, prod = 3 }"],["object({ nombre = string })","{ nombre = \"api\" }"],["tuple([string, number])","[\"api\", 8080]"]],
  why:"Tipos precisos convierten errores de configuración en errores de plan, no de producción."},
 {t:"opcion", p:"¿Qué aporta <code>optional(number, 256)</code> dentro de un <code>object</code>?",
  ops:["Nada","El atributo puede omitirse y entonces vale 256","Obliga a indicarlo","Lo convierte en texto"],
  ok:1, why:"Módulos con entradas cómodas: solo indicas lo que cambia."},
 {t:"vf", p:"Un bloque <code>check</code> que falla detiene el apply.",
  ok:false, why:"Los check solo avisan (warning). Para bloquear se usan precondition o validation."}
]}

]});
