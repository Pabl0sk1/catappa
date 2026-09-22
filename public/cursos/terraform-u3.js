window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "El estado",
resumen: "Qué es el estado, backends remotos con bloqueo, comandos de estado, deriva, importar recursos existentes y refactorizar con moved",
nivel: "Intermedio",
color: "#a77ee8",
lecciones: [

{
id:"tf3l1",
titulo:"Qué es el estado y dónde guardarlo",
claves:["El estado relaciona tu código con los recursos reales (ids, atributos)","En equipo: backend remoto (S3) con bloqueo y cifrado","Contiene secretos: acceso restringido y nunca en Git"],
pasos:[
 {t:"info", eti:"La memoria de Terraform", h:"terraform.tfstate",
  c:`<p>Terraform necesita recordar que <code>aws_s3_bucket.backups</code> es el bucket real <code>backups-catappa-prod</code>. Esa correspondencia, con todos los atributos, vive en el <b>estado</b>.</p>
     <ul><li>En local (<code>terraform.tfstate</code>) solo sirve para pruebas personales.</li>
     <li>En equipo, un <b>backend remoto</b>: todos comparten el mismo estado.</li>
     <li><b>Bloqueo</b>: impide que dos personas apliquen a la vez y corrompan el estado.</li></ul>
     <div class="termbox">terraform {
  backend "s3" {
    bucket       = "catappa-terraform-estado"
    key          = "prod/red/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true        # bloqueo nativo en S3
  }
}</div>`},
 {t:"par", p:"Empareja cada práctica con su motivo",
  pares:[["Backend remoto","Que todo el equipo y el CI usen el mismo estado"],["Bloqueo","Evitar dos apply simultáneos"],["Cifrado y acceso restringido","El estado contiene secretos"],["Versionado del bucket de estado","Recuperar un estado anterior si se corrompe"],["Un estado por componente y entorno","Limitar el alcance de cada cambio"]],
  why:"Un único estado gigante hace cada plan lento y cada error peligroso."},
 {t:"opcion", p:"¿Qué pasa si subes <code>terraform.tfstate</code> a un repositorio?",
  ops:["Nada","Expones posibles secretos (contraseñas, claves) y, además, los estados de varias personas acabarán en conflicto","Terraform deja de funcionar","Se cifra solo"],
  ok:1, why:"*.tfstate va en .gitignore; el estado vive en el backend remoto."},
 {t:"vf", p:"Dos personas pueden ejecutar <code>terraform apply</code> a la vez sobre el mismo estado sin riesgo si hay bloqueo.",
  ok:true, why:"La segunda espera o falla con «Error acquiring the state lock»: justo lo que se quiere."}
]},

{
id:"tf3l2",
titulo:"Deriva, importar y refactorizar",
claves:["Deriva (drift): cambios hechos fuera de Terraform; plan los detecta","import trae recursos existentes a la gestión de Terraform","moved renombra o mueve recursos en el código sin destruirlos"],
pasos:[
 {t:"info", eti:"El mundo real", h:"Deriva e importación",
  c:`<p>Alguien cambia a mano un grupo de seguridad en la consola: el siguiente <code>plan</code> muestra la diferencia y propone devolverlo a lo que dice el código.</p>
     <div class="termbox"># traer a Terraform un bucket creado a mano
import {
  to = aws_s3_bucket.logs
  id = "logs-catappa-antiguo"
}
# terraform plan -generate-config-out=generado.tf   (genera el codigo)

# renombrar en el codigo sin destruir el recurso real
moved {
  from = aws_s3_bucket.backups
  to   = aws_s3_bucket.copias
}</div>
     <div class="termbox">terraform state list                         # recursos en el estado
terraform state show aws_s3_bucket.copias    # atributos de uno
terraform state rm aws_instance.temporal     # dejar de gestionarlo (sin borrarlo)</div>`},
 {t:"par", p:"Empareja cada situación con la herramienta",
  pares:[["Un recurso existe pero no está en Terraform","Bloque import"],["Renombrar un recurso en el código","Bloque moved"],["Dejar de gestionar un recurso sin borrarlo","Bloque removed o terraform state rm"],["Alguien cambió algo a mano","terraform plan detecta la deriva"],["Ver los atributos guardados","terraform state show"]],
  why:"Sin moved, renombrar un recurso haría que Terraform lo destruyera y lo creara de nuevo."},
 {t:"opcion", p:"Renombras <code>aws_db_instance.bd</code> a <code>aws_db_instance.principal</code> en el código y el plan propone destruir y crear la base de datos. ¿Qué haces?",
  ops:["Aplicar","Añadir un bloque moved de bd a principal para que Terraform entienda que es el mismo recurso","Borrar el estado","Cambiar de región"],
  ok:1, why:"Nunca apliques un plan que destruye una base de datos sin entender por qué."},
 {t:"vf", p:"<code>terraform state rm</code> borra el recurso real en AWS.",
  ok:false, why:"Solo lo quita del estado: el recurso sigue existiendo, pero Terraform deja de gestionarlo."}
]},

{
id:"tf3l3",
titulo:"Compartir datos entre estados",
claves:["Con estados separados, una capa necesita datos de otra (ids de subredes)","Opciones: outputs + terraform_remote_state, parámetros en SSM, o data sources por etiquetas","Migrar un estado de backend con terraform init -migrate-state"],
pasos:[
 {t:"info", eti:"Capas conectadas", h:"Leer lo que creó otra capa",
  c:`<div class="termbox"># capa "servicios" leyendo la capa "red"
data "terraform_remote_state" "red" {
  backend = "s3"
  config = { bucket = "catappa-terraform-estado", key = "prod/red/terraform.tfstate", region = "eu-west-1" }
}
subnet_ids = data.terraform_remote_state.red.outputs.subredes_privadas

# alternativa con menos acoplamiento: la capa red publica en SSM
resource "aws_ssm_parameter" "subredes" {
  name  = "/catappa/prod/red/subredes-privadas"
  type  = "StringList"
  value = join(",", module.vpc.private_subnets)
}
# y la capa servicios lo lee
data "aws_ssm_parameter" "subredes" { name = "/catappa/prod/red/subredes-privadas" }</div>`},
 {t:"par", p:"Empareja cada técnica con su característica",
  pares:[["terraform_remote_state","Lee los outputs de otro estado (necesita acceso a ese estado)"],["Parámetros de SSM","Contrato explícito y sin acceso al estado ajeno"],["Data source por etiquetas","Busca recursos existentes por nombre o tags"],["init -migrate-state","Mover el estado a otro backend"]],
  why:"Leer el estado de otra capa da acceso a todo su contenido, incluidos secretos: SSM limita lo que se comparte."},
 {t:"orden", p:"Ordena la migración de un estado local a un backend S3",
  items:["Crear el bucket (con versionado y cifrado) para el estado","Añadir el bloque backend \"s3\" al código","Ejecutar terraform init -migrate-state","Confirmar que el plan no muestra cambios","Borrar el terraform.tfstate local"],
  why:"Un plan sin cambios tras migrar confirma que el estado llegó entero."},
 {t:"vf", p:"Para leer outputs de otra capa con terraform_remote_state basta con conocer su nombre.",
  ok:false, why:"Hace falta permiso de lectura sobre ese estado en el backend."}
]}

]});
