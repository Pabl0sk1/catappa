window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Expresiones y repetición",
resumen: "count y for_each, bloques dynamic, condicionales, expresiones for, funciones integradas y ciclo de vida de los recursos",
nivel: "Intermedio",
color: "#a77ee8",
lecciones: [

{
id:"tf4l1",
titulo:"count y for_each",
claves:["count crea N copias identificadas por índice","for_each crea una por cada clave de un mapa o conjunto: más estable","Usa for_each cuando los elementos pueden añadirse o quitarse"],
pasos:[
 {t:"info", eti:"Varios iguales", h:"Repetir recursos",
  c:`<div class="termbox">variable "subredes_privadas" {
  default = {
    a = "10.0.11.0/24"
    b = "10.0.12.0/24"
    c = "10.0.13.0/24"
  }
}

resource "aws_subnet" "privada" {
  for_each          = var.subredes_privadas
  vpc_id            = aws_vpc.principal.id
  cidr_block        = each.value
  availability_zone = "eu-west-1\${each.key}"
  tags              = { Name = "privada-\${each.key}" }
}
# aws_subnet.privada["a"], aws_subnet.privada["b"], ...

resource "aws_instance" "bastion" {
  count = var.entorno == "prod" ? 1 : 0          # crear o no crear
  ...
}</div>`},
 {t:"opcion", p:"Tienes 3 subredes con <code>count</code> y quitas la primera de la lista. ¿Qué propone Terraform?",
  ops:["Borrar solo la primera","Recrear varias, porque los índices se desplazan (la [1] pasa a ser la [0]...)","Nada","Un error"],
  ok:1, why:"Con for_each, cada elemento se identifica por su clave y quitar uno no afecta a los demás."},
 {t:"par", p:"Empareja cada expresión con su significado",
  pares:[["count.index","Posición del elemento con count"],["each.key","Clave del elemento con for_each"],["each.value","Valor del elemento con for_each"],["count = cond ? 1 : 0","Crear el recurso solo si se cumple la condición"],["aws_subnet.privada[\"a\"]","Referencia a un elemento concreto creado con for_each"]],
  why:"for_each es la opción por defecto en código profesional."},
 {t:"vf", p:"<code>for_each</code> acepta un mapa o un conjunto de strings.",
  ok:true, why:"Una lista hay que convertirla con toset()."}
]},

{
id:"tf4l2",
titulo:"Expresiones, funciones y dynamic",
claves:["Expresiones for para transformar listas y mapas","Funciones integradas: merge, lookup, cidrsubnet, jsonencode, templatefile...","dynamic genera bloques anidados repetidos"],
pasos:[
 {t:"info", eti:"Calcular", h:"Expresiones y funciones",
  c:`<div class="termbox">locals {
  azs      = ["a", "b", "c"]
  subredes = { for i, az in local.azs : az =&gt; cidrsubnet("10.0.0.0/16", 8, i + 11) }
  # { a = "10.0.11.0/24", b = "10.0.12.0/24", c = "10.0.13.0/24" }

  etiquetas = merge(var.etiquetas_comunes, { servicio = "api" })
  ids_privadas = [for s in aws_subnet.privada : s.id]
  politica = jsonencode({ Version = "2012-10-17", Statement = [...] })
}

resource "aws_security_group" "api" {
  dynamic "ingress" {
    for_each = var.puertos_abiertos
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["10.0.0.0/16"]
    }
  }
}</div>
     <p><code>terraform console</code> permite probar expresiones y funciones de forma interactiva.</p>`},
 {t:"par", p:"Empareja cada función con su efecto",
  pares:[["merge(a, b)","Combina mapas (el último gana)"],["lookup(mapa, clave, defecto)","Busca una clave con valor por defecto"],["cidrsubnet(\"10.0.0.0/16\", 8, 1)","Calcula la subred 10.0.1.0/24"],["jsonencode(objeto)","Convierte a JSON (políticas IAM)"],["templatefile(ruta, vars)","Rellena una plantilla (user data)"]],
  why:"jsonencode evita escribir JSON a mano con comillas escapadas."},
 {t:"opcion", p:"¿Para qué sirve un bloque <code>dynamic</code>?",
  ops:["Para crear recursos opcionales","Para generar varios bloques anidados (como reglas ingress) a partir de una colección","Para cambiar de provider","Para importar recursos"],
  ok:1, why:"No abuses: si el código se vuelve ilegible, a veces es mejor recursos separados."}
]},

{
id:"tf4l3",
titulo:"Ciclo de vida de los recursos",
claves:["prevent_destroy protege recursos críticos","create_before_destroy evita cortes al reemplazar","ignore_changes para atributos que cambian fuera de Terraform"],
pasos:[
 {t:"info", eti:"Control fino", h:"lifecycle",
  c:`<div class="termbox">resource "aws_db_instance" "principal" {
  ...
  deletion_protection = true
  lifecycle {
    prevent_destroy = true                  # terraform se niega a destruirla
  }
}

resource "aws_launch_template" "api" {
  lifecycle { create_before_destroy = true }   # crear el nuevo antes de borrar el viejo
}

resource "aws_ecs_service" "api" {
  lifecycle { ignore_changes = [desired_count] }   # lo gestiona el autoescalado
}</div>`},
 {t:"par", p:"Empareja cada opción con el problema que evita",
  pares:[["prevent_destroy","Borrar por error la base de datos de producción"],["create_before_destroy","Cortes de servicio al reemplazar un recurso"],["ignore_changes","Pelear con el autoescalado o con cambios gestionados por otro sistema"],["replace_triggered_by","Forzar el reemplazo cuando cambia otro recurso"]],
  why:"Combina prevent_destroy de Terraform con deletion_protection del propio servicio."},
 {t:"opcion", p:"El autoescalado cambia el número de tareas de ECS y cada plan de Terraform quiere devolverlo a 2. ¿Qué haces?",
  ops:["Desactivar el autoescalado","ignore_changes = [desired_count] en el servicio","Borrar el estado","Aplicar cada vez"],
  ok:1, why:"Terraform fija el valor inicial; el autoescalado lo gestiona después."}
]},

{
id:"tf4l4",
titulo:"Provisioners y configuración de servidores",
claves:["Los provisioners (remote-exec, local-exec) son el último recurso","Mejor: user_data/cloud-init, imágenes preparadas (Packer) o contenedores","terraform_data sustituye a null_resource para acciones ligadas a cambios"],
pasos:[
 {t:"info", eti:"El último recurso", h:"Por qué evitar provisioners",
  c:`<div class="termbox">resource "aws_instance" "web" {
  ...
  provisioner "remote-exec" {             # se ejecuta por SSH al crear
    inline = ["sudo apt-get install -y nginx"]
  }
}</div>
     <p>Problemas: necesitan acceso de red y credenciales SSH, no se reejecutan si cambias el script, su fallo deja recursos «contaminados» y Terraform no puede planificar su efecto.</p>
     <p>Alternativas, de más a menos recomendada:</p>
     <ul><li><b>Contenedores</b>: la configuración va dentro de la imagen.</li>
     <li><b>Imágenes preparadas</b> con Packer (AMI con todo instalado).</li>
     <li><b>user_data / cloud-init</b> al arrancar.</li>
     <li><b>Ansible</b> después, para configurar flotas de servidores.</li></ul>`},
 {t:"par", p:"Empareja cada herramienta con su papel",
  pares:[["Terraform","Crear la infraestructura"],["Packer","Construir imágenes de máquina preconfiguradas"],["cloud-init / user_data","Configurar la instancia en su primer arranque"],["Ansible","Configurar y mantener sistemas ya existentes"],["Dockerfile","Empaquetar la aplicación con todo lo que necesita"]],
  why:"Cada herramienta en su sitio evita mezclar creación y configuración."},
 {t:"opcion", p:"Necesitas ejecutar un script local cada vez que cambia la versión de una aplicación. ¿Qué usas?",
  ops:["Un remote-exec","Un recurso terraform_data con triggers_replace = var.version y un provisioner local-exec (o mejor, el propio pipeline)","Un data source","Nada, no se puede"],
  ok:1, why:"terraform_data se recrea cuando cambian sus triggers, y con él el provisioner."},
 {t:"vf", p:"Si modificas el script de un provisioner remote-exec, Terraform lo vuelve a ejecutar en las instancias existentes.",
  ok:false, why:"Los provisioners solo corren al crear (o destruir). Por eso son frágiles para configurar."}
]}

]});
