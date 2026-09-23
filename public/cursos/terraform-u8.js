window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Terraform en equipo",
resumen: "Entornos con directorios o workspaces, CI/CD con plan en el Pull Request y OIDC, calidad con fmt, tflint y escáneres, políticas, terraform test, plataformas y Terragrunt",
nivel: "Experto",
color: "#9066d4",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"tf6l1",
titulo:"Entornos: workspaces frente a directorios",
claves:["Workspaces de la CLI: varios estados con el mismo código y el mismo backend","Directorio por entorno: cada uno con su backend, sus valores y sus diferencias visibles","En equipos, directorios (o Terragrunt) para entornos; workspaces para copias efímeras idénticas"],
pasos:[
 {t:"info", eti:"Dos enfoques", h:"Workspaces de la CLI",
  c:`<div class="termbox">terraform workspace new staging      # crea y selecciona
terraform workspace select prod
terraform workspace list
  default
* prod
  staging
terraform workspace show             # prod

# en el código
locals {
  tamano = terraform.workspace == "prod" ? "m7g.large" : "t4g.small"
}</div>
     <p>Cada workspace tiene su propio estado en el mismo backend (en S3, bajo <code>env:/staging/...</code>). El código es el mismo para todos.</p>
     <div class="nota ojo"><b class="tit">Los inconvenientes</b>No se ve en el código en qué entorno estás (un <code>apply</code> en el workspace equivocado es un clásico), todos comparten backend y credenciales, y las diferencias entre entornos acaban en condicionales por todo el código.</div>`},
 {t:"info", eti:"Lo habitual", h:"Un directorio por entorno",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">infra/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">modulos/</span><span class="coment">red, servicio-ecs, base-datos</span></div><div class="rama" style="--n:1"><span class="nom carpeta">entornos/</span></div><div class="rama" style="--n:2"><span class="nom carpeta">dev/</span><span class="coment">main.tf + backend propio + dev.tfvars</span></div><div class="rama" style="--n:2"><span class="nom carpeta">staging/</span></div><div class="rama" style="--n:2"><span class="nom carpeta">prod/</span><span class="coment">otra cuenta de AWS, otro rol</span></div></div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">comparación</div><table class="dg-tabla"><thead><tr><th></th><th>workspaces</th><th>directorios</th></tr></thead><tbody>
<tr><td>código</td><td>idéntico</td><td>mismos módulos, raíz propia</td></tr>
<tr><td>backend y credenciales</td><td>compartidos</td><td>separados (cuentas distintas)</td></tr>
<tr><td>diferencias</td><td>condicionales en el código</td><td>visibles en cada carpeta</td></tr>
<tr><td>ideal para</td><td>entornos efímeros por rama</td><td>dev, staging y prod</td></tr>
</tbody></table></div>
     <p>No confundir: en <b>HCP Terraform</b> un «workspace» es otra cosa: una unidad con su estado, variables, permisos e historial, normalmente una por componente y entorno.</p>`},
 {t:"term", p:"Crea el workspace <code>pr-142</code> para probar una rama en un entorno efímero",
  prompt:"pablo@portatil:~/infra$", sol:["terraform workspace new pr-142","tofu workspace new pr-142"],
  salida:`Created and switched to workspace "pr-142"!

You're now on a new, empty workspace. Workspaces isolate their state,
so if you run "terraform plan" Terraform will not see any existing state
for this configuration.`,
  pista:"terraform workspace y la acción de crear.",
  why:"Entornos efímeros por Pull Request son el caso de uso ideal de los workspaces: idénticos y de usar y tirar."},
 {t:"term", p:"Comprueba en qué workspace estás antes de aplicar",
  prompt:"pablo@portatil:~/infra$", sol:["terraform workspace show","tofu workspace show"],
  salida:`pr-142`,
  pista:"workspace y la acción de mostrar.",
  why:"Muchos equipos lo añaden al prompt de la terminal para no aplicar nunca en el workspace equivocado."},
 {t:"opcion", p:"Tu empresa tiene dev, staging y prod en cuentas de AWS distintas y prod tiene recursos que dev no tiene. ¿Qué organización eliges?",
  ops:["Workspaces con condicionales para todo","Un directorio por entorno que reutiliza los mismos módulos, cada uno con su backend y su rol","Un único estado para los tres","Ramas de Git por entorno"],
  ok:1, why:"Las diferencias quedan explícitas y un error en dev no puede tocar el estado de prod."},
 {t:"par", p:"Empareja cada elemento con su significado",
  pares:[["terraform.workspace","Nombre del workspace actual dentro del código"],["workspace default","El que existe siempre y no se puede borrar"],["env:/staging/","Prefijo donde el backend S3 guarda otros workspaces"],["Workspace de HCP Terraform","Estado, variables, permisos e historial de un componente"]],
  why:"El mismo nombre para dos conceptos distintos: aclara cuál usas cuando hables de «workspaces»."},
 {t:"vf", p:"Las ramas de Git por entorno (rama dev, rama prod) son el patrón recomendado para gestionar entornos con Terraform.",
  ok:false, why:"Las ramas divergen y promover cambios se vuelve una pesadilla de fusiones. Una rama principal y una carpeta por entorno es lo habitual."}
]},

/* =============== U8 L2 =============== */
{
id:"tf8n1",
titulo:"CI/CD: plan en el Pull Request y apply desde el pipeline",
claves:["Plan automático en cada Pull Request, publicado para revisarlo","Apply solo desde el pipeline, tras aprobar; nadie aplica desde su portátil","OIDC con roles distintos para plan (lectura) y apply (escritura), limitados por repositorio y rama"],
pasos:[
 {t:"info", eti:"Automatizar", h:"Un flujo con GitHub Actions",
  c:`<div class="termbox"># .github/workflows/terraform.yml (resumen)
on:
  pull_request: { paths: ["infra/**"] }
  push: { branches: [main], paths: ["infra/**"] }
permissions: { id-token: write, contents: read, pull-requests: write }
env: { TF_IN_AUTOMATION: "true" }
jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: aws-actions/configure-aws-credentials@v4
        with: { role-to-assume: arn:aws:iam::123456789012:role/terraform-plan, aws-region: eu-west-1 }
      - run: terraform fmt -check -recursive
      - run: terraform init -input=false
      - run: terraform validate
      - run: terraform plan -input=false -lock-timeout=5m -out=plan.tfplan
      # publicar el plan como comentario del PR
  apply:
    if: github.ref == 'refs/heads/main'
    environment: prod                 # aprobación manual en GitHub
    # asume el rol terraform-apply, vuelve a planificar y aplica ese plan</div>`},
 {t:"info", eti:"Decisiones", h:"Lo que hay que resolver en un pipeline",
  c:`<ul><li><b>Roles separados</b>: el de plan solo lee; el de apply escribe y solo lo puede asumir la rama principal (condición <code>sub</code> del token OIDC: <code>repo:catappa/infra:ref:refs/heads/main</code> o <code>environment:prod</code>).</li>
     <li><b>¿Qué plan se aplica?</b> El del PR puede quedar obsoleto si otro PR se fusiona antes. Opciones: volver a planificar en main y aplicar ese plan, o aplicar antes de fusionar con bloqueo por proyecto (lo que hace Atlantis).</li>
     <li><b>Concurrencia</b>: un solo apply a la vez por estado (<code>concurrency</code> en Actions, además del bloqueo).</li>
     <li><b>Artefactos</b>: el plan guardado contiene secretos; caducidad corta y acceso restringido.</li></ul>
     <div class="dg"><div class="dg-tit">flujo en un equipo maduro</div><div class="dg-flujo">
       <div class="dg-caja">PR</div><div class="dg-caja">CI: fmt, validate, lint, escáner</div><div class="dg-caja acento">plan en el PR</div><div class="dg-caja">revisión</div><div class="dg-caja ok">apply desde el CI</div>
     </div></div>`},
 {t:"orden", p:"Ordena un cambio de infraestructura en un equipo maduro",
  items:["Rama y cambio en los ficheros .tf","El CI ejecuta fmt, validate, escáneres y plan","El plan se publica como comentario en el Pull Request","Revisión y aprobación del plan","Al fusionar, el CI aplica con el rol de escritura"],
  why:"Nadie aplica desde su portátil: todo cambio queda revisado y registrado."},
 {t:"term", p:"En el CI, planifica sin pedir datos por teclado, esperando hasta 5 minutos si el estado está bloqueado y guardando el plan en <code>plan.tfplan</code>",
  prompt:"runner@ci:~/infra$", sol:["terraform plan -input=false -lock-timeout=5m -out=plan.tfplan","terraform plan -input=false -out=plan.tfplan -lock-timeout=5m","terraform plan -lock-timeout=5m -input=false -out=plan.tfplan","terraform plan -out=plan.tfplan -input=false -lock-timeout=5m"],
  salida:`Acquiring state lock. This may take a few moments...
Plan: 2 to add, 1 to change, 0 to destroy.

Saved the plan to: plan.tfplan`,
  pista:"Tres opciones: -input=false, -lock-timeout=5m y -out=.",
  why:"Sin -input=false, una variable sin valor dejaría el pipeline colgado esperando al teclado."},
 {t:"term", p:"Convierte el plan guardado a JSON (para políticas o para resumirlo en el PR)",
  prompt:"runner@ci:~/infra$", sol:["terraform show -json plan.tfplan > plan.json","terraform show -json plan.tfplan >plan.json","tofu show -json plan.tfplan > plan.json"],
  salida:``,
  pista:"terraform show con la opción -json y el fichero del plan.",
  why:"El JSON del plan es lo que leen conftest (OPA), Infracost o tus propios scripts de revisión."},
 {t:"opcion", p:"¿Cómo limitas que solo la rama principal pueda asumir el rol de apply en AWS?",
  ops:["Confiando en el equipo","Con una condición en la política de confianza del rol sobre el claim sub del token OIDC (repo y rama, o environment)","Con una variable de entorno","Con un comentario en el workflow"],
  ok:1, why:"Una rama cualquiera, o un fork, no podrá obtener credenciales de escritura."},
 {t:"vf", p:"Aplicar desde el portátil de cada ingeniero con sus credenciales de administrador es una práctica recomendada.",
  ok:false, why:"Sin revisión, sin registro y con credenciales amplias repartidas. Se aplica desde el CI."},
 {t:"opcion", p:"El PR A y el PR B tocan el mismo estado. A se fusiona y se aplica. ¿Qué problema tiene aplicar ahora el plan guardado en el PR B?",
  ops:["Ninguno","Está obsoleto: se calculó sobre un estado que ya cambió. Terraform lo rechaza y hay que volver a planificar","Se aplica dos veces","Borra lo que hizo A"],
  ok:1, why:"«Saved plan is stale». Por eso muchos pipelines vuelven a planificar en main justo antes de aplicar."}
]},

/* =============== U8 L3 =============== */
{
id:"tf6l2",
titulo:"Calidad, seguridad y políticas",
claves:["fmt y validate siempre; tflint para errores específicos del proveedor","Checkov o Trivy detectan configuraciones inseguras antes de aplicar","Políticas como código: OPA/conftest sobre el plan JSON, o Sentinel/OPA en HCP Terraform"],
pasos:[
 {t:"info", eti:"Detectar antes", h:"La cadena de calidad",
  c:`<div class="termbox">terraform fmt -check -recursive
terraform validate
tflint --init &amp;&amp; tflint --recursive
checkov -d infra/              # o: trivy config infra/
terraform show -json plan.tfplan &gt; plan.json &amp;&amp; conftest test plan.json</div>
     <div class="termbox"># .tflint.hcl
plugin "aws" {
  enabled = true
  version = "0.38.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}</div>
     <div class="termbox">$ checkov -d infra/
Passed checks: 41, Failed checks: 2, Skipped checks: 0

Check: CKV_AWS_18: "Ensure the S3 bucket has access logging enabled"
	FAILED for resource: aws_s3_bucket.media
	File: /modulos/media/main.tf:1-4</div>
     <p>Todo esto también se ejecuta en local con <b>pre-commit</b> (los hooks de <code>pre-commit-terraform</code>), para que los fallos aparezcan antes del PR.</p>`},
 {t:"info", eti:"Reglas de la casa", h:"Políticas como código",
  c:`<div class="termbox"># policy/etiquetas.rego (OPA, evaluado con conftest sobre plan.json)
package main

deny contains msg if {
  r := input.resource_changes[_]
  r.change.actions[_] == "create"
  not r.change.after.tags.propietario
  msg := sprintf("%s no tiene la etiqueta propietario", [r.address])
}</div>
     <ul><li><b>Escáneres</b> (Checkov, Trivy): reglas genéricas de seguridad ya escritas.</li>
     <li><b>Políticas propias</b>: regiones permitidas, etiquetas obligatorias, tamaños máximos. Con OPA/conftest en tu CI, o con Sentinel u OPA en HCP Terraform.</li>
     <li><b>Excepciones</b> explícitas y justificadas en el código (por ejemplo <code>#checkov:skip=CKV_AWS_18:bucket de logs</code>), nunca desactivar la regla entera.</li></ul>`},
 {t:"par", p:"Empareja cada herramienta con lo que detecta",
  pares:[["terraform fmt","Formato inconsistente"],["terraform validate","Errores de sintaxis y referencias"],["tflint","Tipos de instancia inexistentes y malas prácticas del proveedor"],["Checkov / Trivy","Buckets públicos, cifrado desactivado, puertos abiertos"],["OPA / Sentinel","Incumplimiento de políticas de la empresa (regiones, etiquetas, tamaños)"]],
  why:"Encontrar un bucket público en el PR es infinitamente mejor que en una auditoría."},
 {t:"term", p:"Escanea con Checkov todo el directorio <code>infra/</code>",
  prompt:"pablo@portatil:~$", sol:["checkov -d infra/","checkov -d infra","checkov --directory infra/","checkov --directory infra"],
  salida:`Passed checks: 41, Failed checks: 2, Skipped checks: 0`,
  pista:"checkov y la opción -d con el directorio.",
  why:"Checkov también puede analizar el plan JSON (-f plan.json), que ve los valores ya resueltos."},
 {t:"opcion", p:"Quieres impedir que nadie cree instancias fuera de las regiones de la UE, aunque el código lo pida. ¿Qué capas usarías?",
  ops:["Solo documentación","Política en el pipeline (OPA/Sentinel/Checkov) y, como red de seguridad, una SCP en AWS Organizations","Un comentario en el código","Nada: confiar en el equipo"],
  ok:1, why:"Defensa en profundidad: la política avisa pronto y la SCP lo impide siempre."},
 {t:"opcion", p:"tflint avisa de <code>\"t2.mircro\" is an invalid value as instance_type</code>, pero <code>terraform validate</code> no dijo nada. ¿Por qué?",
  ops:["validate está roto","validate comprueba sintaxis y tipos, no si un valor existe en AWS; el plugin de AWS de tflint conoce los valores válidos","tflint se equivoca","Porque falta init"],
  ok:1, why:"Sin tflint, ese error aparecería en el apply, a mitad de crear recursos."},
 {t:"vf", p:"Las políticas evaluadas sobre el JSON del plan ven los valores finales, incluidos los calculados a partir de variables y módulos.",
  ok:true, why:"Por eso son más fiables que analizar solo el código: ven lo que de verdad se va a crear (salvo lo known after apply)."},
 {t:"escribe", p:"¿Qué herramienta ejecuta políticas OPA (Rego) sobre ficheros como el plan en JSON?",
  sol:["conftest"], pista:"Viene de «configuration test».",
  why:"conftest test plan.json devuelve error si alguna regla deny se cumple."}
]},

/* =============== U8 L4 =============== */
{
id:"tf8n2",
titulo:"Pruebas con terraform test",
claves:["Ficheros *.tftest.hcl con bloques run: cada uno hace plan o apply y comprueba assert","command = plan para pruebas rápidas; apply crea recursos reales y los destruye al acabar","mock_provider y override_* permiten probar sin nube; expect_failures prueba las validaciones"],
pasos:[
 {t:"info", eti:"Probar módulos", h:"Un fichero de pruebas",
  c:`<div class="termbox"># modulos/bucket-seguro/tests/bucket.tftest.hcl
variables {
  nombre = "prueba"
}

run "nombre_con_prefijo" {
  command = plan
  assert {
    condition     = aws_s3_bucket.this.bucket == "catappa-prueba"
    error_message = "El bucket debe llevar el prefijo catappa-"
  }
}

run "versionado_activo" {
  command = plan
  assert {
    condition     = aws_s3_bucket_versioning.this.versioning_configuration[0].status == "Enabled"
    error_message = "El versionado debe estar activado por defecto"
  }
}

run "rechaza_mayusculas" {
  command   = plan
  variables { nombre = "Prueba" }
  expect_failures = [var.nombre]      # la validación DEBE fallar
}</div>
     <div class="termbox">$ terraform test
tests/bucket.tftest.hcl... in progress
  run "nombre_con_prefijo"... pass
  run "versionado_activo"... pass
  run "rechaza_mayusculas"... pass
tests/bucket.tftest.hcl... tearing down
tests/bucket.tftest.hcl... pass

Success! 3 passed, 0 failed.</div>`},
 {t:"info", eti:"Sin nube", h:"plan, apply y mocks",
  c:`<ul><li><b>command = plan</b>: rápido y sin crear nada, pero los valores «known after apply» no se pueden comprobar.</li>
     <li><b>command = apply</b> (el valor por defecto): crea recursos reales en una cuenta de pruebas y los destruye al terminar. Es una prueba de integración.</li>
     <li><b>mock_provider</b> (Terraform 1.7+): sustituye al provider por uno falso que devuelve valores inventados; puedes hacer apply sin credenciales.</li></ul>
     <div class="termbox">mock_provider "aws" {}

run "con_mock" {
  # apply «de mentira»: el ARN será un valor generado
  assert {
    condition     = output.arn != ""
    error_message = "Debe exponer el ARN"
  }
}</div>`},
 {t:"hueco", p:"Completa la prueba que comprueba el plan sin crear nada",
  tpl:"___ \"nombre_correcto\" {\n  command = ___\n  ___ {\n    condition     = aws_s3_bucket.this.bucket == \"catappa-prueba\"\n    error_message = \"Nombre incorrecto\"\n  }\n}", banco:["run","plan","assert","test","apply","check"], sol:["run","plan","assert"],
  why:"run, command y assert son el esqueleto de toda prueba de Terraform."},
 {t:"term", p:"Ejecuta todas las pruebas del módulo",
  prompt:"pablo@portatil:~/modulos/bucket-seguro$", sol:["terraform test","tofu test"],
  salida:`tests/bucket.tftest.hcl... in progress
  run "nombre_con_prefijo"... pass
  run "versionado_activo"... pass
  run "rechaza_mayusculas"... pass
tests/bucket.tftest.hcl... tearing down
tests/bucket.tftest.hcl... pass

Success! 3 passed, 0 failed.`,
  pista:"El subcomando se llama como lo que haces.",
  why:"Busca los .tftest.hcl en la carpeta actual y en tests/."},
 {t:"opcion", p:"¿Cómo compruebas que una validación de variable rechaza de verdad un valor inválido?",
  ops:["Con un assert que compare con false","Con un run que pase ese valor y expect_failures = [var.nombre]","No se puede probar","Con un check"],
  ok:1, why:"Sin expect_failures, el run fallaría; con él, lo que falla la prueba es que la validación NO salte."},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["run","Un paso de prueba: un plan o un apply"],["command = plan","Probar sin crear recursos"],["assert","Condición que debe cumplirse"],["expect_failures","Declarar qué debe fallar"],["mock_provider","Provider falso con valores inventados"]],
  why:"Con estas cinco piezas se cubre casi todo lo que se prueba en un módulo."},
 {t:"vf", p:"Un run sin <code>command</code> hace un plan por defecto.",
  ok:false, why:"El valor por defecto es apply: crea recursos reales (que se destruyen al acabar). Pon command = plan si solo quieres planificar."},
 {t:"opcion", p:"Tu prueba con <code>command = plan</code> falla al comprobar <code>aws_s3_bucket.this.arn</code>. ¿Por qué?",
  ops:["Por un error de sintaxis","Porque el ARN es known after apply: en un plan aún no existe. Usa apply (real o con mock_provider)","Porque falta el provider","Porque los ARN no se pueden probar"],
  ok:1, why:"Los atributos calculados solo se pueden comprobar tras un apply."}
]},

/* =============== U8 L5 =============== */
{
id:"tf6l3",
titulo:"Plataformas, Terragrunt y operación continua",
claves:["HCP Terraform, Atlantis, Spacelift o env0 ejecutan plan y apply desde los Pull Requests","Terragrunt reduce repetición entre entornos y ordena dependencias entre estados","Operar: detección periódica de deriva, actualizaciones con Renovate y coste estimado en el PR"],
pasos:[
 {t:"info", eti:"A escala", h:"Herramientas del ecosistema",
  c:`<ul><li><b>Atlantis</b> (libre, autoalojado): comenta el plan en el PR y aplica con un comentario <code>atlantis apply</code>, bloqueando el proyecto hasta fusionar.</li>
     <li><b>HCP Terraform</b> / Terraform Enterprise, <b>Spacelift</b>, <b>env0</b>, <b>Scalr</b>: estado gestionado, ejecuciones remotas, políticas, aprobaciones, registro privado de módulos y detección de deriva.</li>
     <li><b>Infracost</b>: comenta en el PR cuánto subirá o bajará la factura.</li>
     <li><b>Renovate</b> o <b>Dependabot</b>: abren PRs para actualizar providers y módulos.</li></ul>
     <div class="dg"><div class="dg-tit">atlantis en un pull request</div><div class="dg-vert">
       <div class="dg-caja">abres el PR</div>
       <div class="dg-caja acento">Atlantis comenta el plan<small>y bloquea ese proyecto</small></div>
       <div class="dg-caja">aprobación del revisor</div>
       <div class="dg-caja ok">comentario «atlantis apply»<small>aplica y después se fusiona</small></div>
     </div></div>`},
 {t:"info", eti:"Terragrunt", h:"Menos repetición entre entornos",
  c:`<div class="termbox"># root.hcl (común a todo)
remote_state {
  backend  = "s3"
  generate = { path = "backend.tf", if_exists = "overwrite_terragrunt" }
  config = {
    bucket       = "catappa-terraform-estado"
    key          = "\${path_relative_to_include()}/terraform.tfstate"
    region       = "eu-west-1"
    use_lockfile = true
  }
}

# prod/api/terragrunt.hcl
include "root" { path = find_in_parent_folders("root.hcl") }
terraform { source = "git::https://github.com/catappa/modulos.git//servicio-ecs?ref=v2.3.0" }
dependency "red" { config_path = "../red" }
inputs = {
  subredes = dependency.red.outputs.subredes_privadas
}</div>
     <p>Terragrunt es un envoltorio sobre Terraform/OpenTofu: genera backend y providers, pasa salidas entre estados y ejecuta muchos a la vez en orden (<code>terragrunt run --all plan</code>). Añade una herramienta y una capa de abstracción: compensa con muchos entornos y componentes.</p>`},
 {t:"par", p:"Empareja cada herramienta con su aportación",
  pares:[["Atlantis","Plan y apply comentando en el Pull Request"],["Terragrunt","Menos repetición entre entornos y dependencias entre estados"],["HCP Terraform","Estado gestionado, políticas y ejecuciones remotas"],["Renovate o Dependabot","PRs para actualizar providers y módulos"],["Infracost","Coste estimado del cambio en el PR"]],
  why:"Ninguna es obligatoria: se añaden cuando el número de estados y personas lo pide."},
 {t:"opcion", p:"¿Cómo detectarías que alguien cambia recursos a mano fuera de Terraform?",
  ops:["No se puede","Con un plan programado (por ejemplo cada noche, con -detailed-exitcode) que alerta si hay diferencias, y restringiendo los permisos de escritura manual en producción","Mirando la factura","Borrando el estado"],
  ok:1, why:"La deriva detectada pronto es un cambio pequeño; detectada meses después, un incidente."},
 {t:"hueco", p:"Completa la dependencia de Terragrunt para leer las subredes de la capa red",
  tpl:"___ \"red\" {\n  config_path = \"../red\"\n}\n\ninputs = {\n  subredes = dependency.red.___.subredes_privadas\n}", banco:["dependency","outputs","module","output","include"], sol:["dependency","outputs"],
  why:"Terragrunt aplica la red antes y le pasa sus outputs a esta capa, sin terraform_remote_state."},
 {t:"vf", p:"Terragrunt sustituye a Terraform: con él ya no se usan módulos ni ficheros .tf.",
  ok:false, why:"Es un envoltorio: sigue ejecutando terraform o tofu sobre tus módulos, y aporta la configuración repetida y el orden entre estados."},
 {t:"opcion", p:"Tienes 3 entornos × 12 componentes = 36 estados con bloques backend casi idénticos. ¿Qué te aporta Terragrunt?",
  ops:["Nada","Definir backend y providers una vez, generar el resto y ejecutar los 36 en orden de dependencias con un comando","Un único estado para todo","Evitar el bloqueo"],
  ok:1, why:"Es exactamente el problema para el que nació: DRY entre muchos estados."},
 {t:"escribe", p:"¿Qué comentario escribes en un PR para que Atlantis aplique el plan?",
  sol:["atlantis apply"], pista:"El nombre de la herramienta y la acción.",
  why:"atlantis plan vuelve a planificar; atlantis apply aplica lo planificado y registra quién lo pidió."}
]}

]});
