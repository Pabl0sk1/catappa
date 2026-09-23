window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Ciclo de vida, comprobaciones y secretos",
resumen: "El bloque lifecycle, precondiciones, postcondiciones y check, secretos sin fugas (sensitive, ephemeral y write-only) y por qué evitar los provisioners",
nivel: "Avanzado",
color: "#9a70dc",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"tf4l3",
titulo:"Ciclo de vida de los recursos",
claves:["prevent_destroy protege recursos críticos (mientras el bloque siga en el código)","create_before_destroy evita cortes al reemplazar; ignore_changes convive con cambios de otros sistemas","replace_triggered_by recrea un recurso cuando cambia otro"],
pasos:[
 {t:"info", eti:"Control fino", h:"lifecycle",
  c:`<div class="termbox">resource "aws_db_instance" "principal" {
  # ...
  deletion_protection = true                # protección del propio servicio
  lifecycle {
    prevent_destroy = true                  # terraform se niega a destruirla
  }
}

resource "aws_launch_template" "api" {
  name_prefix = "api-"                       # nombre único: permite que convivan dos
  lifecycle { create_before_destroy = true } # crear el nuevo antes de borrar el viejo
}

resource "aws_ecs_service" "api" {
  lifecycle { ignore_changes = [desired_count] }   # lo gestiona el autoescalado
}

resource "aws_instance" "worker" {
  lifecycle {
    replace_triggered_by = [aws_launch_template.api.latest_version]
  }
}</div>`},
 {t:"info", eti:"Letra pequeña", h:"Lo que no te cuentan",
  c:`<ul><li><b>prevent_destroy</b> solo actúa si el bloque sigue en el código. Si alguien borra el recurso entero del fichero, la protección se va con él: combínalo con <code>deletion_protection</code> del servicio.</li>
     <li><b>create_before_destroy</b> exige que el nuevo y el viejo puedan existir a la vez: nombres únicos (<code>name_prefix</code>) o fallará con «already exists». Además se contagia a los recursos de los que depende.</li>
     <li><b>ignore_changes = all</b> ignora cualquier cambio posterior: Terraform solo crea el recurso. Úsalo casi nunca.</li>
     <li>Los valores de lifecycle deben ser literales: no admiten variables.</li></ul>
     <div class="nota ojo"><b class="tit">Error típico</b>«Instance cannot be destroyed: Resource aws_db_instance.principal has lifecycle.prevent_destroy set». Si ves esto, algo en tu cambio iba a borrar la base de datos: no quites la protección sin entender por qué.</div>`},
 {t:"par", p:"Empareja cada opción con el problema que evita",
  pares:[["prevent_destroy","Borrar por error la base de datos de producción"],["create_before_destroy","Cortes de servicio al reemplazar un recurso"],["ignore_changes","Pelear con el autoescalado o con cambios gestionados por otro sistema"],["replace_triggered_by","Que un recurso no se renueve cuando cambia otro del que depende"]],
  why:"Combina prevent_destroy de Terraform con deletion_protection del propio servicio: dos capas."},
 {t:"opcion", p:"El autoescalado cambia el número de tareas de ECS y cada plan de Terraform quiere devolverlo a 2. ¿Qué haces?",
  ops:["Desactivar el autoescalado","ignore_changes = [desired_count] en el servicio","Borrar el estado","Aplicar cada vez"],
  ok:1, why:"Terraform fija el valor inicial; el autoescalado lo gestiona después."},
 {t:"hueco", p:"Completa para que el certificado nuevo exista antes de borrar el viejo",
  tpl:"resource \"aws_acm_certificate\" \"web\" {\n  domain_name = \"catappa.dev\"\n  ___ {\n    ___ = true\n  }\n}", banco:["lifecycle","create_before_destroy","prevent_destroy","ignore_changes","depends_on"], sol:["lifecycle","create_before_destroy"],
  why:"El balanceador sigue usando el certificado viejo hasta que el nuevo está listo."},
 {t:"opcion", p:"Una compañera borra del código el bloque entero de <code>aws_db_instance.principal</code>, que tenía <code>prevent_destroy = true</code>. ¿Qué propone el plan?",
  ops:["Nada: prevent_destroy lo impide","Destruir la base de datos, porque la protección estaba en el bloque que se ha borrado","Un error de sintaxis","Mover la base de datos a otro estado"],
  ok:1, why:"Por eso existe deletion_protection en el servicio y por eso los planes se revisan: «1 to destroy» en datos es una alarma."},
 {t:"vf", p:"<code>create_before_destroy</code> funciona siempre, aunque el recurso tenga un nombre fijo que debe ser único.",
  ok:false, why:"Si el nombre es único (un bucket, un rol con name fijo), el nuevo no puede crearse mientras exista el viejo. Usa name_prefix o nombres con sufijo."},
 {t:"escribe", p:"¿Qué valor especial de <code>ignore_changes</code> hace que Terraform ignore cualquier cambio posterior del recurso?",
  sol:["all"], pista:"En inglés, «todos».",
  why:"Convierte el recurso en «créalo y olvídate»: casi siempre es mejor listar los atributos concretos."}
]},

/* =============== U6 L2 =============== */
{
id:"tf6n1",
titulo:"Precondiciones, postcondiciones y check",
claves:["precondition comprueba supuestos antes de crear o cambiar; postcondition, el resultado después","Ambas detienen la ejecución con un error; check solo avisa","validation para entradas, condiciones para supuestos internos, check para la salud del conjunto"],
pasos:[
 {t:"info", eti:"Supuestos explícitos", h:"precondition y postcondition",
  c:`<div class="termbox">data "aws_ami" "base" {
  most_recent = true
  owners      = ["self"]
  filter {
    name   = "name"
    values = ["catappa-base-*"]
  }
  lifecycle {
    postcondition {
      condition     = self.architecture == "arm64"
      error_message = "La AMI base debe ser arm64 (instancias Graviton)."
    }
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.base.id
  instance_type = var.tipo
  lifecycle {
    precondition {
      condition     = !startswith(var.tipo, "t2.")
      error_message = "Usa una generación actual (t4g o superior)."
    }
  }
}

output "url" {
  value = "https://\${aws_lb.api.dns_name}"
  precondition {
    condition     = aws_lb.api.internal == false
    error_message = "El balanceador de la API debe ser público."
  }
}</div>
     <p><code>self</code> solo existe en postcondition: es el propio objeto ya leído o creado.</p>`},
 {t:"info", eti:"Vigilar", h:"Bloques check",
  c:`<div class="termbox">check "web_responde" {
  data "http" "salud" {                # data source con ámbito solo dentro del check
    url = "https://\${aws_lb.api.dns_name}/salud"
  }
  assert {
    condition     = data.http.salud.status_code == 200
    error_message = "El endpoint de salud no responde 200."
  }
}</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué usar para qué</div><table class="dg-tabla"><thead><tr><th>herramienta</th><th>dónde</th><th>si falla</th></tr></thead><tbody>
<tr><td>validation</td><td>variables</td><td>error antes del plan</td></tr>
<tr><td>precondition</td><td>recursos, data, outputs</td><td>error, no se aplica ese objeto</td></tr>
<tr><td>postcondition</td><td>recursos, data</td><td>error tras leer o crear</td></tr>
<tr><td>check</td><td>bloque propio</td><td>solo un aviso (warning)</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja cada situación con la herramienta adecuada",
  pares:[["La variable entorno solo admite dev o prod","validation"],["La AMI encontrada debe ser arm64","postcondition en el data source"],["No crear la instancia si el tipo es t2","precondition en el recurso"],["Avisar si la web no responde, sin bloquear","check con assert"]],
  why:"Cada una se evalúa en un momento distinto: elige según qué quieres comprobar y cuándo."},
 {t:"vf", p:"Un bloque <code>check</code> que falla detiene el apply.",
  ok:false, why:"Los check solo avisan (warning). Para bloquear se usan precondition, postcondition o validation."},
 {t:"hueco", p:"Completa la postcondición que usa el propio objeto",
  tpl:"lifecycle {\n  ___ {\n    condition     = ___.architecture == \"arm64\"\n    error_message = \"Debe ser arm64.\"\n  }\n}", banco:["postcondition","precondition","self","this","check"], sol:["postcondition","self"],
  why:"self solo está disponible en postcondition, cuando el objeto ya existe."},
 {t:"opcion", p:"Quieres que el despliegue falle si el data source de la VPC devuelve una VPC sin soporte DNS. ¿Qué pones?",
  ops:["Un check","Una postcondition en el data source con condition = self.enable_dns_support","Un comentario","Una variable con validation"],
  ok:1, why:"Postcondition sobre un data source: el supuesto sobre algo externo queda escrito y comprobado."},
 {t:"opcion", p:"¿Qué tiene de especial el data source declarado dentro de un bloque <code>check</code>?",
  ops:["Nada","Tiene ámbito solo en el check y, si falla, genera un aviso en vez de un error","Se ejecuta antes que todo","Solo funciona con HTTP"],
  ok:1, why:"Así una comprobación de salud caída no bloquea un apply que quizá viene justo a arreglarla."},
 {t:"escribe", p:"¿Qué bloque, dentro de <code>check</code>, contiene la condición y el mensaje de error?",
  sol:["assert"], pista:"«Afirmar», en inglés.",
  why:"Un check puede tener varios assert y como mucho un data source con ámbito propio."}
]},

/* =============== U6 L3 =============== */
{
id:"tf6n2",
titulo:"Secretos y datos sensibles",
claves:["sensitive oculta en pantalla, pero el valor llega al estado y a los planes guardados","ephemeral (1.10) y argumentos write-only (1.11) evitan que un secreto se guarde en el estado","Lo mejor: que el servicio gestione su secreto (manage_master_user_password) y nadie lo vea"],
pasos:[
 {t:"info", eti:"Dónde se filtra", h:"Los caminos de un secreto",
  c:`<div class="dg"><div class="dg-tit">por dónde puede escaparse una contraseña</div><div class="dg-pila">
       <div class="dg-fila"><div class="dg-caja aviso">código o tfvars en Git</div><div class="dg-caja aviso">logs del CI (plan, output)</div></div>
       <div class="dg-fila"><div class="dg-caja aviso">fichero de estado</div><div class="dg-caja aviso">plan guardado (.tfplan)</div></div>
     </div></div>
     <ul><li><b>sensitive</b> protege los logs, pero no el estado ni el plan guardado.</li>
     <li>El <b>estado</b> se protege siempre: cifrado, bucket privado, permisos mínimos y registro de accesos.</li>
     <li>El <b>plan guardado</b> también contiene valores: trátalo como un secreto en los artefactos del CI.</li></ul>
     <div class="termbox"># lo mejor: que nadie conozca la contraseña
resource "aws_db_instance" "principal" {
  engine                      = "postgres"
  manage_master_user_password = true    # RDS la genera, la guarda y la rota en Secrets Manager
}</div>`},
 {t:"info", eti:"Sin rastro", h:"Valores ephemeral y argumentos write-only",
  c:`<div class="termbox">variable "token_bd" {
  type      = string
  ephemeral = true            # nunca se guarda en el estado ni en el plan
}

ephemeral "random_password" "bd" {
  length = 24
}

resource "aws_db_instance" "informes" {
  engine              = "postgres"
  password_wo         = ephemeral.random_password.bd.result   # write-only
  password_wo_version = 1       # súbelo para forzar un cambio de contraseña
}</div>
     <ul><li><b>ephemeral</b> (Terraform 1.10+): variables, outputs de módulos y recursos que existen solo durante la ejecución.</li>
     <li><b>Argumentos write-only</b> (1.11+, terminan en <code>_wo</code>): el provider los recibe, pero no se guardan. Como Terraform no puede comparar, se cambia el valor subiendo su <code>_wo_version</code>.</li>
     <li>Un valor ephemeral solo puede usarse en sitios que no persisten (configuración de providers, argumentos write-only, otros ephemeral).</li></ul>`},
 {t:"opcion", p:"¿Cuál es la forma más segura de gestionar la contraseña maestra de una base de datos RDS nueva?",
  ops:["Escribirla en main.tf","En un tfvars subido a Git","manage_master_user_password = true: RDS la genera y la guarda en Secrets Manager, y la aplicación la lee de ahí","En una variable sensitive con default"],
  ok:2, why:"La contraseña nunca pasa por tus manos, por el código ni por el estado, y se puede rotar."},
 {t:"par", p:"Empareja cada mecanismo con lo que protege",
  pares:[["sensitive = true","Que el valor salga impreso en plan y logs"],["ephemeral = true","Que el valor se guarde en el estado o en el plan"],["password_wo","Que un argumento concreto del recurso quede en el estado"],["Estado cifrado con acceso restringido","Que alguien lea los secretos que sí se guardan"],["manage_master_user_password","Que una persona llegue a conocer la contraseña"]],
  why:"Son capas distintas: sensitive es cosmético; ephemeral y write-only cambian lo que se persiste."},
 {t:"vf", p:"Un plan guardado con <code>-out=plan.tfplan</code> puede contener secretos en claro.",
  ok:true, why:"Incluye los valores necesarios para aplicar. En el CI, trátalo como un artefacto sensible, con caducidad corta."},
 {t:"hueco", p:"Completa para que la contraseña no se guarde en el estado y para poder rotarla",
  tpl:"resource \"aws_db_instance\" \"bd\" {\n  ___         = ephemeral.random_password.bd.result\n  ___ = 2\n}", banco:["password_wo","password_wo_version","password","sensitive","ephemeral"], sol:["password_wo","password_wo_version"],
  why:"Subir password_wo_version de 1 a 2 es lo que le dice a Terraform que envíe la nueva contraseña."},
 {t:"opcion", p:"Tu módulo lee un secreto con <code>data \"aws_secretsmanager_secret_version\"</code> para configurar un provider de PostgreSQL. ¿Qué mejora ofrece la versión <code>ephemeral</code> de ese mismo recurso?",
  ops:["Ninguna","El secreto se lee en cada ejecución y no queda guardado en el estado, cosa que sí pasa con el data source","Es más rápida","Cifra el secreto en el estado"],
  ok:1, why:"Los data sources persisten sus atributos en el estado; los ephemeral no."},
 {t:"vf", p:"Marcar una variable como <code>sensitive</code> impide que su valor llegue al fichero de estado.",
  ok:false, why:"Solo lo oculta en pantalla. Para no persistirlo hay que usar ephemeral o argumentos write-only."}
]},

/* =============== U6 L4 =============== */
{
id:"tf4l4",
titulo:"Provisioners y configuración de servidores",
claves:["Los provisioners (remote-exec, local-exec, file) son el último recurso","Mejor: imágenes preparadas (Packer), contenedores, user_data/cloud-init o Ansible","terraform_data sustituye a null_resource para acciones ligadas a cambios"],
pasos:[
 {t:"info", eti:"El último recurso", h:"Por qué evitar provisioners",
  c:`<div class="termbox">resource "aws_instance" "web" {
  # ...
  provisioner "remote-exec" {             # se ejecuta por SSH al crear
    inline = ["sudo apt-get install -y nginx"]
  }
}</div>
     <p>Problemas: necesitan acceso de red y credenciales SSH, no se reejecutan si cambias el script, su fallo marca el recurso como «tainted» (se recreará) y Terraform no puede planificar su efecto.</p>
     <p>Alternativas, de más a menos recomendada:</p>
     <ul><li><b>Contenedores</b>: la configuración va dentro de la imagen.</li>
     <li><b>Imágenes preparadas</b> con Packer (AMI con todo instalado).</li>
     <li><b>user_data / cloud-init</b> al arrancar.</li>
     <li><b>Ansible</b> después, para configurar flotas de servidores.</li></ul>`},
 {t:"info", eti:"Si no hay más remedio", h:"terraform_data y local-exec",
  c:`<div class="termbox">resource "terraform_data" "migraciones" {
  triggers_replace = [var.version_app]      # se recrea cuando cambia la versión

  provisioner "local-exec" {
    command     = "./scripts/migrar.sh"
    environment = { VERSION = var.version_app }
  }
}

resource "aws_instance" "web" {
  user_data = templatefile("\${path.module}/cloud-init.yaml.tftpl", { entorno = var.entorno })
  user_data_replace_on_change = true
}</div>
     <p><code>terraform_data</code> viene integrado (no necesita provider) y sustituye al antiguo <code>null_resource</code>. Opciones útiles: <code>when = destroy</code> (ejecutar al destruir) y <code>on_failure = continue</code> (no fallar el apply).</p>`},
 {t:"par", p:"Empareja cada herramienta con su papel",
  pares:[["Terraform","Crear la infraestructura"],["Packer","Construir imágenes de máquina preconfiguradas"],["cloud-init / user_data","Configurar la instancia en su primer arranque"],["Ansible","Configurar y mantener sistemas ya existentes"],["Dockerfile","Empaquetar la aplicación con todo lo que necesita"]],
  why:"Cada herramienta en su sitio evita mezclar creación y configuración."},
 {t:"opcion", p:"Necesitas ejecutar un script local cada vez que cambia la versión de una aplicación. ¿Qué usas?",
  ops:["Un remote-exec","Un recurso terraform_data con triggers_replace = var.version y un provisioner local-exec (o mejor, el propio pipeline)","Un data source","Nada, no se puede"],
  ok:1, why:"terraform_data se recrea cuando cambian sus triggers, y con él se ejecuta el provisioner."},
 {t:"vf", p:"Si modificas el script de un provisioner remote-exec, Terraform lo vuelve a ejecutar en las instancias existentes.",
  ok:false, why:"Los provisioners solo corren al crear (o al destruir con when = destroy). Por eso son frágiles para configurar."},
 {t:"hueco", p:"Completa para que el recurso se recree (y su provisioner se ejecute) cuando cambie la versión",
  tpl:"resource \"___\" \"migraciones\" {\n  ___ = [var.version_app]\n  provisioner \"local-exec\" { command = \"./migrar.sh\" }\n}", banco:["terraform_data","null_data","triggers_replace","depends_on","replace_triggered_by"], sol:["terraform_data","triggers_replace"],
  why:"triggers_replace es un argumento de terraform_data; replace_triggered_by es de lifecycle y apunta a otros recursos."},
 {t:"opcion", p:"Un provisioner remote-exec falla a mitad al crear una instancia. ¿En qué estado queda?",
  ops:["Se borra sola","La instancia existe pero queda marcada como tainted: el siguiente apply la reemplazará","Queda perfecta","Terraform reintenta el script indefinidamente"],
  ok:1, why:"Es uno de los motivos por los que se prefieren imágenes preparadas: o la imagen arranca bien, o no."},
 {t:"escribe", p:"¿Qué recurso integrado, sin provider, sustituye al antiguo <code>null_resource</code>?",
  sol:["terraform_data"], pista:"terraform_ y «datos» en inglés.",
  why:"Un bloque moved puede migrar de null_resource a terraform_data sin recrear nada (Terraform 1.8+)."}
]}

]});
