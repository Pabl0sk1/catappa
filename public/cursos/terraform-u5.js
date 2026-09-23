window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "El estado a fondo",
resumen: "Qué guarda el estado, backends remotos con bloqueo (S3 nativo, HCP Terraform), deriva, importar recursos, refactorizar con moved y removed, y compartir datos entre estados",
nivel: "Intermedio",
color: "#a77ee8",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"tf3l1",
titulo:"Qué es el estado",
claves:["El estado relaciona cada dirección del código con un objeto real (id y atributos)","Sirve para calcular diferencias, recordar dependencias y no consultar todo cada vez","Contiene secretos en claro: nunca en Git, siempre cifrado y con acceso restringido"],
pasos:[
 {t:"info", eti:"La memoria de Terraform", h:"terraform.tfstate",
  c:`<p>Terraform necesita recordar que <code>aws_s3_bucket.backups</code> es el bucket real <code>backups-catappa-prod</code>. Esa correspondencia, con todos los atributos, vive en el <b>estado</b>: un JSON.</p>
     <div class="termbox">{
  "version": 4,
  "terraform_version": "1.13.3",
  "serial": 42,                       # sube con cada escritura
  "lineage": "3f1c9a52-...",          # identidad del estado: evita mezclar dos distintos
  "outputs": { ... },
  "resources": [
    {
      "mode": "managed",
      "type": "aws_s3_bucket",
      "name": "backups",
      "provider": "provider[\\"registry.terraform.io/hashicorp/aws\\"]",
      "instances": [ { "attributes": { "id": "backups-catappa-prod", "arn": "...", ... } } ]
    }
  ]
}</div>`},
 {t:"info", eti:"Para qué", h:"Tres trabajos del estado",
  c:`<div class="dg"><div class="dg-tit">código, estado y mundo real</div><div class="dg-flujo">
       <div class="dg-caja acento">código .tf<small>lo que quieres</small></div>
       <div class="dg-caja">estado<small>lo que Terraform cree que hay</small></div>
       <div class="dg-caja base">API real<small>lo que hay de verdad</small></div>
     </div><div class="dg-nota arriba">el plan refresca el estado con la API y lo compara con el código</div></div>
     <ul><li><b>Correspondencia</b>: qué objeto real es cada recurso. Si lo pierdes, Terraform cree que no existe nada e intentará crearlo todo de nuevo.</li>
     <li><b>Dependencias</b>: si borras un recurso del código, el estado recuerda de qué dependía para destruirlo en orden.</li>
     <li><b>Rendimiento</b>: con miles de recursos, no tener que buscarlos todos.</li></ul>
     <div class="nota ojo"><b class="tit">Nunca a mano</b>No edites el JSON. Para cambiar el estado existen <code>terraform state</code>, <code>moved</code>, <code>import</code> y <code>removed</code>.</div>`},
 {t:"term", p:"Lista todos los recursos que hay en el estado",
  prompt:"pablo@portatil:~/infra$", sol:["terraform state list","tofu state list"],
  salida:`data.aws_caller_identity.actual
aws_s3_bucket.backups
aws_s3_bucket_versioning.backups
module.red.aws_subnet.privada["a"]
module.red.aws_subnet.privada["b"]
module.red.aws_vpc.principal`,
  pista:"El subcomando state y la acción de listar.",
  why:"Es lo primero que se mira para saber qué gestiona una configuración."},
 {t:"term", p:"Muestra los atributos guardados del recurso <code>aws_s3_bucket.backups</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform state show aws_s3_bucket.backups","tofu state show aws_s3_bucket.backups","terraform state show 'aws_s3_bucket.backups'"],
  salida:`# aws_s3_bucket.backups:
resource "aws_s3_bucket" "backups" {
    arn           = "arn:aws:s3:::backups-catappa-prod"
    bucket        = "backups-catappa-prod"
    force_destroy = false
    id            = "backups-catappa-prod"
    region        = "eu-west-1"
    tags_all      = {
        "gestionado" = "terraform"
        "proyecto"   = "catappa"
    }
}`,
  pista:"terraform state show y la dirección.",
  why:"Con for_each, pon la dirección entre comillas simples en la terminal: 'aws_subnet.privada[\"a\"]'."},
 {t:"term", p:"Descarga una copia del estado actual (esté donde esté) al fichero <code>copia.tfstate</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform state pull > copia.tfstate","terraform state pull >copia.tfstate","tofu state pull > copia.tfstate"],
  salida:``,
  pista:"state pull escribe el JSON por la salida estándar.",
  why:"Antes de cualquier operación delicada sobre el estado, haz una copia. El versionado del bucket es tu segunda red."},
 {t:"par", p:"Empareja cada campo del estado con su función",
  pares:[["serial","Número que sube con cada escritura"],["lineage","Identifica un estado concreto para no confundirlo con otro"],["resources","Los objetos gestionados y sus atributos"],["outputs","Los valores de salida"],["terraform_version","Qué versión lo escribió por última vez"]],
  why:"serial y lineage impiden que un state push sobrescriba un estado más nuevo o uno que no es el suyo."},
 {t:"opcion", p:"¿Qué pasa si subes <code>terraform.tfstate</code> a un repositorio?",
  ops:["Nada","Expones posibles secretos (contraseñas, claves) y los estados de varias personas acabarán en conflicto","Terraform deja de funcionar","Se cifra solo"],
  ok:1, why:"*.tfstate va en .gitignore; el estado vive en un backend remoto."},
 {t:"vf", p:"Si pierdes el fichero de estado, Terraform detecta solo los recursos existentes en el siguiente plan.",
  ok:false, why:"Sin estado, propone crearlo todo de nuevo (y chocaría con nombres ya usados). Habría que importar recurso a recurso."}
]},

/* =============== U5 L2 =============== */
{
id:"tf5n1",
titulo:"Backends remotos y bloqueo",
claves:["Backend S3 con use_lockfile = true: bloqueo nativo sin DynamoDB (el bloqueo con DynamoDB está deprecado)","Configuración parcial con -backend-config para reutilizar el código en cada entorno","HCP Terraform con el bloque cloud: estado, bloqueo, ejecuciones remotas y políticas"],
pasos:[
 {t:"info", eti:"Compartir", h:"Backend S3 con bloqueo nativo",
  c:`<div class="termbox">terraform {
  backend "s3" {
    bucket       = "catappa-terraform-estado"
    key          = "prod/red/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true        # bloqueo con un objeto .tflock en el propio bucket
  }
}</div>
     <ul><li>El bucket de estado: <b>versionado</b> activado, <b>cifrado</b>, acceso público bloqueado y permisos solo para quien aplica.</li>
     <li><code>use_lockfile</code> (Terraform 1.10+) crea <code>prod/red/terraform.tfstate.tflock</code> con escrituras condicionales de S3. El antiguo <code>dynamodb_table</code> está deprecado.</li>
     <li>El bloque backend <b>no admite variables</b>: se evalúa antes que todo lo demás.</li></ul>
     <div class="termbox"># configuración parcial: el código deja fuera lo que cambia por entorno
terraform init -backend-config=backend/prod.s3.tfbackend

# backend/prod.s3.tfbackend
bucket = "catappa-terraform-estado"
key    = "prod/red/terraform.tfstate"</div>`},
 {t:"info", eti:"Alternativas", h:"Otros backends y HCP Terraform",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">backends habituales</div><table class="dg-tabla"><thead><tr><th>backend</th><th>bloqueo</th></tr></thead><tbody>
<tr><td>s3</td><td>use_lockfile (nativo)</td></tr>
<tr><td>gcs (Google Cloud)</td><td>nativo</td></tr>
<tr><td>azurerm (Blob Storage)</td><td>nativo, con leases</td></tr>
<tr><td>pg (PostgreSQL)</td><td>nativo, con advisory locks</td></tr>
<tr><td>cloud (HCP Terraform)</td><td>nativo, más ejecuciones remotas</td></tr>
<tr><td>local</td><td>solo en tu máquina</td></tr>
</tbody></table></div>
     <div class="termbox">terraform {
  cloud {
    organization = "catappa"
    workspaces { name = "red-prod" }
  }
}
# terraform login  (una vez, guarda un token)</div>
     <p>En <b>HCP Terraform</b> (antes Terraform Cloud) cada «workspace» guarda un estado, sus variables y el historial de ejecuciones. OpenTofu, por su parte, puede <b>cifrar el estado</b> en el cliente antes de enviarlo al backend.</p>`},
 {t:"opcion", p:"Dos personas ejecutan <code>terraform apply</code> a la vez sobre el mismo estado con bloqueo. ¿Qué pasa?",
  ops:["Se mezclan los cambios","La segunda falla con «Error acquiring the state lock» (o espera si usa -lock-timeout)","Gana el último","Se corrompe el estado"],
  ok:1, why:"El bloqueo es justo para esto. -lock-timeout=5m hace que espere en vez de fallar al instante."},
 {t:"term", p:"Un pipeline se canceló y dejó el bloqueo <code>9db590f1-b6fe-c5f2-2678-8804f089deba</code>. Tras comprobar que nadie está aplicando, libéralo",
  prompt:"pablo@portatil:~/infra$", sol:["terraform force-unlock 9db590f1-b6fe-c5f2-2678-8804f089deba","terraform force-unlock -force 9db590f1-b6fe-c5f2-2678-8804f089deba","tofu force-unlock 9db590f1-b6fe-c5f2-2678-8804f089deba"],
  salida:`Do you really want to force-unlock?
  Terraform will remove the lock on the remote state.
  This will allow local Terraform commands to modify this state, even though it
  may still be in use. Only 'yes' will be accepted to confirm.

  Enter a value: yes

Terraform state has been successfully unlocked!`,
  pista:"terraform force-unlock y el ID del bloqueo.",
  why:"Si de verdad había otro apply en marcha, forzar el desbloqueo puede corromper el estado: compruébalo antes."},
 {t:"term", p:"Inicializa usando el fichero de configuración parcial <code>backend/prod.s3.tfbackend</code>",
  prompt:"pablo@portatil:~/infra$", sol:["terraform init -backend-config=backend/prod.s3.tfbackend","terraform init -backend-config backend/prod.s3.tfbackend","terraform init -backend-config=./backend/prod.s3.tfbackend"],
  salida:`Initializing the backend...

Successfully configured the backend "s3"! Terraform will automatically
use this backend unless the backend configuration changes.`,
  pista:"init con la opción -backend-config=.",
  why:"Así un mismo código se usa en dev y prod cambiando solo el fichero de backend."},
 {t:"par", p:"Empareja cada práctica con su motivo",
  pares:[["Backend remoto","Que todo el equipo y el CI usen el mismo estado"],["Bloqueo","Evitar dos apply simultáneos"],["Cifrado y acceso restringido","El estado contiene secretos"],["Versionado del bucket de estado","Recuperar un estado anterior si se corrompe"],["Un estado por componente y entorno","Limitar el alcance de cada cambio"]],
  why:"Un único estado gigante hace cada plan lento y cada error peligroso."},
 {t:"opcion", p:"Cambias el bucket del backend y quieres empezar de cero con la nueva configuración SIN copiar el estado antiguo. ¿Qué opción de init usas?",
  ops:["-migrate-state","-reconfigure","-upgrade","-refresh=false"],
  ok:1, why:"-migrate-state copia el estado al nuevo backend; -reconfigure ignora la configuración anterior y no migra nada."},
 {t:"vf", p:"En el bloque <code>backend \"s3\"</code> puedes escribir <code>key = \"\${var.entorno}/terraform.tfstate\"</code>.",
  ok:false, why:"El backend no admite variables ni expresiones. Para eso está la configuración parcial con -backend-config."}
]},

/* =============== U5 L3 =============== */
{
id:"tf3l2",
titulo:"Deriva: detectar y decidir",
claves:["Deriva (drift): cambios hechos fuera de Terraform; el plan los detecta al refrescar","plan -refresh-only muestra la deriva y apply -refresh-only la acepta en el estado","-detailed-exitcode devuelve 2 si hay cambios: base de la detección automática"],
pasos:[
 {t:"info", eti:"El mundo real", h:"Qué es la deriva",
  c:`<p>Alguien abre el puerto 22 a mano en un grupo de seguridad durante un incidente. El siguiente <code>plan</code> refresca, ve la diferencia y propone <b>devolverlo a lo que dice el código</b>.</p>
     <div class="termbox">Note: Objects have changed outside of Terraform

Terraform detected the following changes made outside of Terraform since the
last "terraform apply":

  # aws_security_group.web has changed
  ~ resource "aws_security_group" "web" {
      ~ ingress = [
          + { from_port = 22, to_port = 22, cidr_blocks = ["0.0.0.0/0"] ... },
        ]
    }</div>
     <p>Ante una deriva hay dos decisiones posibles:</p>
     <ul><li><b>El código manda</b>: aplicar y revertir el cambio manual.</li>
     <li><b>El cambio era bueno</b>: llevarlo al código (y entonces el plan queda sin cambios).</li></ul>`},
 {t:"info", eti:"Herramientas", h:"refresh-only y códigos de salida",
  c:`<div class="termbox">terraform plan -refresh-only       # solo muestra qué cambió fuera
terraform apply -refresh-only      # acepta esos cambios en el estado (sin tocar la nube)
terraform plan -refresh=false      # no consulta la API: más rápido, pero ciego a la deriva
terraform plan -detailed-exitcode  # 0 sin cambios, 1 error, 2 hay cambios</div>
     <p><code>terraform refresh</code> está deprecado: equivale a <code>apply -refresh-only</code> sin pedir confirmación.</p>
     <div class="nota"><b class="tit">Prevenir</b>La mejor defensa contra la deriva es que nadie tenga permisos de escritura manual en producción, salvo un acceso de emergencia auditado.</div>`},
 {t:"term", p:"Muestra solo los cambios hechos fuera de Terraform, sin proponer cambios en la infraestructura",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan -refresh-only","tofu plan -refresh-only"],
  salida:`Terraform detected the following changes made outside of Terraform since the
last "terraform apply":

  # aws_security_group.web has changed
...
This is a refresh-only plan, so Terraform will not take any actions to undo
these. If you were expecting these changes then you can apply this plan to
record the updated values in the Terraform state without changing any remote
objects.`,
  pista:"plan con la opción de «solo refrescar».",
  why:"Útil para investigar sin mezclar la deriva con tus propios cambios pendientes."},
 {t:"term", p:"Ejecuta un plan que termine con código 2 si hay cambios (para un detector nocturno de deriva)",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan -detailed-exitcode","terraform plan -detailed-exitcode -input=false","terraform plan -input=false -detailed-exitcode"],
  salida:`Plan: 0 to add, 1 to change, 0 to destroy.
$ echo $?
2`,
  pista:"La opción -detailed-exitcode.",
  why:"Un job programado que alerta cuando el código de salida es 2 es la forma más simple de vigilar la deriva."},
 {t:"opcion", p:"El plan quiere cerrar un puerto que se abrió a mano en un incidente y que resultó necesario. ¿Qué haces?",
  ops:["Aplicar y que se cierre","Añadir esa regla al código, revisarla en un PR y comprobar que el plan queda sin cambios","Borrar el estado","Ignorar el plan para siempre"],
  ok:1, why:"El código debe reflejar la realidad deseada; si el cambio manual era correcto, el código se actualiza."},
 {t:"par", p:"Empareja cada comando con su efecto",
  pares:[["plan -refresh-only","Ver la deriva sin proponer cambios"],["apply -refresh-only","Aceptar la deriva en el estado"],["plan -refresh=false","Planificar sin consultar la API"],["plan -detailed-exitcode","Código de salida 2 si hay cambios"],["terraform refresh","Forma antigua y deprecada de refrescar"]],
  why:"apply -refresh-only no cambia nada en la nube: solo actualiza lo que Terraform recuerda."},
 {t:"vf", p:"<code>terraform apply -refresh-only</code> revierte en la nube los cambios hechos a mano.",
  ok:false, why:"Hace lo contrario: los acepta en el estado. Revertirlos es un apply normal."}
]},

/* =============== U5 L4 =============== */
{
id:"tf5n2",
titulo:"Importar recursos existentes",
claves:["El bloque import trae a Terraform un recurso que ya existe, planificado y revisable","plan -generate-config-out escribe un primer borrador del código","El objetivo tras importar: un plan sin cambios"],
pasos:[
 {t:"info", eti:"Adoptar", h:"El bloque import",
  c:`<div class="termbox"># traer a Terraform un bucket creado a mano
import {
  to = aws_s3_bucket.logs
  id = "logs-catappa-antiguo"        # el id que espera ese tipo de recurso
}

resource "aws_s3_bucket" "logs" {
  bucket = "logs-catappa-antiguo"
}</div>
     <div class="termbox">$ terraform plan
  # aws_s3_bucket.logs will be imported
    resource "aws_s3_bucket" "logs" { ... }

Plan: 1 to import, 0 to add, 0 to change, 0 to destroy.</div>
     <p>Qué va en <code>id</code> depende del tipo: el nombre en un bucket, <code>vpc-0abc...</code> en una VPC, el ARN en otros. Lo dice la sección «Import» de la documentación de cada recurso.</p>`},
 {t:"info", eti:"Sin escribir a mano", h:"Generar el código y el método antiguo",
  c:`<div class="termbox"># con el bloque import escrito pero SIN el resource:
terraform plan -generate-config-out=generado.tf
# revisa generado.tf, límpialo (quita valores por defecto) y muévelo a su sitio

# varios a la vez (Terraform 1.7+)
import {
  for_each = var.buckets_heredados       # { logs = "logs-antiguo", cdn = "cdn-antiguo" }
  to       = aws_s3_bucket.heredado[each.key]
  id       = each.value
}</div>
     <p>El comando antiguo <code>terraform import dirección id</code> sigue existiendo, pero escribe en el estado al instante, sin plan ni revisión. El bloque <code>import</code> se revisa en un PR como cualquier cambio.</p>`},
 {t:"orden", p:"Ordena la adopción de una base de datos creada a mano",
  items:["Escribir el bloque import con el identificador de la base de datos","terraform plan -generate-config-out=generado.tf","Revisar y limpiar el código generado","Ajustar hasta que el plan diga «1 to import, 0 to add, 0 to change, 0 to destroy»","Aplicar en un PR revisado","Añadir prevent_destroy y protección de borrado"],
  why:"Importar no cambia el recurso real; el objetivo es que el código lo describa tal como está."},
 {t:"term", p:"Genera en <code>generado.tf</code> el código de los recursos que tienen bloque import pero aún no tienen resource",
  prompt:"pablo@portatil:~/infra$", sol:["terraform plan -generate-config-out=generado.tf","terraform plan -generate-config-out generado.tf","tofu plan -generate-config-out=generado.tf"],
  salida:`aws_s3_bucket.logs: Preparing import... [id=logs-catappa-antiguo]
aws_s3_bucket.logs: Refreshing state... [id=logs-catappa-antiguo]

Plan: 1 to import, 0 to add, 0 to change, 0 to destroy.`,
  pista:"plan con la opción -generate-config-out=.",
  why:"El código generado es un punto de partida: suele traer argumentos redundantes que conviene quitar."},
 {t:"hueco", p:"Completa el bloque que adopta la VPC <code>vpc-0a1b2c3d</code>",
  tpl:"___ {\n  ___ = aws_vpc.principal\n  id = \"vpc-0a1b2c3d\"\n}", banco:["import","to","from","moved","resource"], sol:["import","to"],
  why:"to es la dirección en tu código; id, el identificador del objeto real."},
 {t:"opcion", p:"Tras importar, el plan muestra <code>~ tags</code> y <code>~ versioning</code> en el recurso importado. ¿Qué significa?",
  ops:["Que el import falló","Que tu código no coincide del todo con la realidad: si aplicas, Terraform cambiará el recurso","Que hay que volver a importarlo","Nada importante"],
  ok:1, why:"Ajusta el código hasta que el plan no tenga cambios, salvo los que quieras hacer a propósito."},
 {t:"vf", p:"<code>terraform import</code> por línea de comandos permite revisar un plan antes de escribir en el estado.",
  ok:false, why:"Escribe directamente en el estado. El bloque import sí pasa por plan y revisión."},
 {t:"opcion", p:"¿Dónde averiguas qué valor poner en <code>id</code> para importar un tipo de recurso concreto?",
  ops:["En el estado","En la sección «Import» de la documentación de ese recurso en el registro del provider","Es siempre el ARN","Es siempre el nombre"],
  ok:1, why:"Cada recurso define su formato: nombre, id, ARN o combinaciones como «rol/politica»."}
]},

/* =============== U5 L5 =============== */
{
id:"tf5n3",
titulo:"Refactorizar sin destruir: moved, removed y state",
claves:["moved renombra o mueve un recurso en el código sin destruir el real","removed deja de gestionar un recurso (con destroy = false) sin borrarlo","-replace fuerza recrear un recurso concreto; taint está deprecado"],
pasos:[
 {t:"info", eti:"Renombrar", h:"moved",
  c:`<div class="termbox"># renombrar
moved {
  from = aws_s3_bucket.backups
  to   = aws_s3_bucket.copias
}

# de count a for_each
moved {
  from = aws_subnet.privada[0]
  to   = aws_subnet.privada["a"]
}

# meter un recurso en un módulo
moved {
  from = aws_s3_bucket.logs
  to   = module.logs.aws_s3_bucket.this
}</div>
     <div class="termbox">  # aws_s3_bucket.backups has moved to aws_s3_bucket.copias
    resource "aws_s3_bucket" "copias" { ... }

Plan: 0 to add, 0 to change, 0 to destroy.</div>
     <p>Sin <code>moved</code>, renombrar significa para Terraform «destruir el viejo y crear uno nuevo». Deja los bloques moved un tiempo (en módulos compartidos, para siempre): otros estados que usen ese código también tienen que pasar por ellos.</p>`},
 {t:"info", eti:"Soltar y recrear", h:"removed, state y -replace",
  c:`<div class="termbox"># dejar de gestionar sin borrar (Terraform 1.7+)
removed {
  from = aws_instance.temporal
  lifecycle {
    destroy = false
  }
}</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">operaciones de refactorización</div><table class="dg-tabla"><thead><tr><th>necesidad</th><th>declarativo (revisable)</th><th>imperativo (al momento)</th></tr></thead><tbody>
<tr><td>renombrar o mover</td><td>moved</td><td>terraform state mv</td></tr>
<tr><td>dejar de gestionar</td><td>removed { destroy = false }</td><td>terraform state rm</td></tr>
<tr><td>adoptar</td><td>import</td><td>terraform import</td></tr>
<tr><td>recrear uno</td><td>replace_triggered_by</td><td>apply -replace=dirección</td></tr>
</tbody></table></div>
     <p>Prefiere los bloques: pasan por plan y por PR. <code>terraform taint</code> está deprecado; usa <code>-replace</code>.</p>`},
 {t:"par", p:"Empareja cada situación con la herramienta",
  pares:[["Un recurso existe pero no está en Terraform","Bloque import"],["Renombrar un recurso en el código","Bloque moved"],["Dejar de gestionar un recurso sin borrarlo","Bloque removed con destroy = false"],["Una instancia está corrupta y quieres recrearla","terraform apply -replace"],["Ver los atributos guardados","terraform state show"]],
  why:"Sin moved, renombrar un recurso haría que Terraform lo destruyera y lo creara de nuevo."},
 {t:"opcion", p:"Renombras <code>aws_db_instance.bd</code> a <code>aws_db_instance.principal</code> en el código y el plan propone destruir y crear la base de datos. ¿Qué haces?",
  ops:["Aplicar","Añadir un bloque moved de bd a principal para que Terraform entienda que es el mismo recurso","Borrar el estado","Cambiar de región"],
  ok:1, why:"Nunca apliques un plan que destruye una base de datos sin entender por qué."},
 {t:"term", p:"Fuerza que se recree solo la instancia <code>aws_instance.web</code> en el próximo apply",
  prompt:"pablo@portatil:~/infra$", sol:["terraform apply -replace=aws_instance.web","terraform apply -replace aws_instance.web","terraform apply -replace='aws_instance.web'","terraform plan -replace=aws_instance.web"],
  salida:`  # aws_instance.web will be replaced, as requested
-/+ resource "aws_instance" "web" { ... }

Plan: 1 to add, 0 to change, 1 to destroy.`,
  pista:"apply con la opción -replace=.",
  why:"Sustituye a terraform taint: el reemplazo aparece en el plan y lo confirmas como cualquier otro cambio."},
 {t:"term", p:"Renombra en el estado <code>aws_s3_bucket.backups</code> a <code>aws_s3_bucket.copias</code> de forma imperativa",
  prompt:"pablo@portatil:~/infra$", sol:["terraform state mv aws_s3_bucket.backups aws_s3_bucket.copias","tofu state mv aws_s3_bucket.backups aws_s3_bucket.copias"],
  salida:`Move "aws_s3_bucket.backups" to "aws_s3_bucket.copias"
Successfully moved 1 object(s).`,
  pista:"terraform state mv origen destino.",
  why:"Funciona, pero no queda en el código ni pasa por revisión: en equipo, mejor un bloque moved."},
 {t:"hueco", p:"Completa para dejar de gestionar la instancia sin destruirla",
  tpl:"___ {\n  from = aws_instance.temporal\n  lifecycle {\n    ___ = false\n  }\n}", banco:["removed","moved","destroy","prevent_destroy","delete"], sol:["removed","destroy"],
  why:"Con destroy = true (o sin lifecycle), removed destruiría el recurso."},
 {t:"vf", p:"<code>terraform state rm</code> borra el recurso real en AWS.",
  ok:false, why:"Solo lo quita del estado: el recurso sigue existiendo, pero Terraform deja de gestionarlo."}
]},

/* =============== U5 L6 =============== */
{
id:"tf3l3",
titulo:"Compartir datos entre estados",
claves:["Con estados separados, una capa necesita datos de otra (ids de subredes)","Opciones: outputs + terraform_remote_state, parámetros en SSM, o data sources por etiquetas","Migrar un estado de backend con terraform init -migrate-state"],
pasos:[
 {t:"info", eti:"Capas conectadas", h:"Leer lo que creó otra capa",
  c:`<div class="termbox"># capa "servicios" leyendo la capa "red"
data "terraform_remote_state" "red" {
  backend = "s3"
  config = {
    bucket = "catappa-terraform-estado"
    key    = "prod/red/terraform.tfstate"
    region = "eu-west-1"
  }
}
# data.terraform_remote_state.red.outputs.subredes_privadas

# alternativa con menos acoplamiento: la capa red publica en SSM
resource "aws_ssm_parameter" "subredes" {
  name  = "/catappa/prod/red/subredes-privadas"
  type  = "StringList"
  value = join(",", module.vpc.private_subnets)
}
# y la capa servicios lo lee
data "aws_ssm_parameter" "subredes" { name = "/catappa/prod/red/subredes-privadas" }
# split(",", data.aws_ssm_parameter.subredes.value)</div>`},
 {t:"info", eti:"Mudanza", h:"Cambiar de backend",
  c:`<div class="dg"><div class="dg-tit">migrar de estado local a S3</div><div class="dg-flujo">
       <div class="dg-caja base">terraform.tfstate local</div>
       <div class="dg-caja">añadir backend "s3"</div>
       <div class="dg-caja acento">init -migrate-state</div>
       <div class="dg-caja ok">plan sin cambios</div>
     </div></div>
     <p>Terraform pregunta si quieres copiar el estado existente al nuevo backend. En HCP Terraform, la lectura entre workspaces se hace con el data source <code>tfe_outputs</code>.</p>`},
 {t:"par", p:"Empareja cada técnica con su característica",
  pares:[["terraform_remote_state","Lee los outputs de otro estado (necesita acceso a ese estado)"],["Parámetros de SSM","Contrato explícito y sin acceso al estado ajeno"],["Data source por etiquetas","Busca recursos existentes por nombre o tags"],["init -migrate-state","Mover el estado a otro backend"]],
  why:"Leer el estado de otra capa da acceso a todo su contenido, incluidos secretos: SSM limita lo que se comparte."},
 {t:"orden", p:"Ordena la migración de un estado local a un backend S3",
  items:["Crear el bucket (con versionado y cifrado) para el estado","Añadir el bloque backend \"s3\" al código","Ejecutar terraform init -migrate-state","Confirmar que el plan no muestra cambios","Borrar el terraform.tfstate local"],
  why:"Un plan sin cambios tras migrar confirma que el estado llegó entero."},
 {t:"term", p:"Ya añadiste el bloque backend \"s3\". Copia el estado local al nuevo backend",
  prompt:"pablo@portatil:~/infra$", sol:["terraform init -migrate-state","tofu init -migrate-state"],
  salida:`Initializing the backend...
Do you want to copy existing state to the new backend?
  Enter a value: yes

Successfully configured the backend "s3"! Terraform will automatically
use this backend unless the backend configuration changes.`,
  pista:"init con la opción de migrar el estado.",
  why:"Tras migrar, un plan sin cambios confirma que no se perdió nada."},
 {t:"hueco", p:"Completa para leer la salida <code>vpc_id</code> de la capa red",
  tpl:"vpc_id = data.terraform_remote_state.red.___.___", banco:["outputs","vpc_id","output","state","values"], sol:["outputs","vpc_id"],
  why:"Solo se pueden leer los outputs de la capa raíz del otro estado, no sus recursos."},
 {t:"vf", p:"Para leer outputs de otra capa con terraform_remote_state basta con conocer su nombre.",
  ok:false, why:"Hace falta permiso de lectura sobre ese estado en el backend (y con él, se puede leer todo el estado)."},
 {t:"opcion", p:"El equipo de plataforma no quiere dar acceso a su estado a los equipos de producto, pero estos necesitan los ids de subred. ¿Qué propones?",
  ops:["Darles acceso de administrador al bucket","Que la capa de red publique los ids en parámetros de SSM (o use etiquetas) y los equipos de producto los lean con data sources","Copiar los ids a mano en cada repositorio","Unir todo en un único estado"],
  ok:1, why:"Un contrato explícito y mínimo: cada equipo lee solo lo que necesita."}
]}

]});
