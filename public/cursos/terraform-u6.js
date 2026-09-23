window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Terraform en equipo",
resumen: "Entornos con directorios o workspaces, CI/CD con plan en el Pull Request, OIDC, calidad con fmt, tflint y escáneres, pruebas y políticas",
nivel: "Experto",
color: "#9a70dc",
lecciones: [

{
id:"tf6l1",
titulo:"Entornos y CI/CD",
claves:["Un directorio (y estado) por entorno, reutilizando módulos","Plan automático en cada Pull Request y apply tras aprobar y fusionar","El pipeline asume un rol por OIDC; nadie aplica desde su portátil"],
pasos:[
 {t:"info", eti:"Varios entornos", h:"Directorios o workspaces",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">infra/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">modulos/</span><span class="coment">red, servicio-ecs, base-datos</span></div><div class="rama" style="--n:1"><span class="nom carpeta">entornos/</span></div><div class="rama" style="--n:2"><span class="nom carpeta">dev/</span><span class="coment">main.tf + backend (estado dev)</span></div><div class="rama" style="--n:2"><span class="nom carpeta">staging/</span></div><div class="rama" style="--n:2"><span class="nom carpeta">prod/</span></div></div>
     <p>Los <b>workspaces</b> de Terraform permiten varios estados con el mismo código, pero ocultan en qué entorno estás y fuerzan a que todos sean iguales. En equipos, suele preferirse un <b>directorio por entorno</b> (o herramientas como Terragrunt).</p>`},
 {t:"info", eti:"Automatizar", h:"Flujo con Pull Requests",
  c:`<div class="termbox"># .github/workflows/terraform.yml (resumen)
on:
  pull_request: { paths: ["infra/**"] }
  push: { branches: [main], paths: ["infra/**"] }
permissions: { id-token: write, contents: read, pull-requests: write }
jobs:
  terraform:
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with: { role-to-assume: arn:aws:iam::123456789012:role/terraform-ci, aws-region: eu-west-1 }
      - run: terraform fmt -check &amp;&amp; terraform init &amp;&amp; terraform validate
      - run: terraform plan -out=plan.tfplan        # y se comenta en el PR
      - if: github.ref == 'refs/heads/main'
        run: terraform apply plan.tfplan</div>`},
 {t:"orden", p:"Ordena un cambio de infraestructura en un equipo maduro",
  items:["Rama y cambio en los ficheros .tf","El CI ejecuta fmt, validate, escáneres y plan","El plan se publica como comentario en el Pull Request","Revisión y aprobación del plan","Al fusionar, el CI aplica exactamente ese plan"],
  why:"Nadie aplica desde su portátil: todo cambio queda revisado y registrado."},
 {t:"vf", p:"Aplicar desde el portátil de cada ingeniero con sus credenciales de administrador es una práctica recomendada.",
  ok:false, why:"Sin revisión, sin registro y con credenciales amplias repartidas. Se aplica desde el CI."}
]},

{
id:"tf6l2",
titulo:"Calidad, pruebas y políticas",
claves:["fmt y validate siempre; tflint para errores específicos del proveedor","Checkov o Trivy detectan configuraciones inseguras antes de aplicar","terraform test para probar módulos; OPA o Sentinel para políticas obligatorias"],
pasos:[
 {t:"info", eti:"Detectar antes", h:"Herramientas de calidad",
  c:`<div class="termbox">terraform fmt -check -recursive
terraform validate
tflint --recursive
checkov -d infra/          # o: trivy config infra/
terraform test             # pruebas de modulos (*.tftest.hcl)</div>
     <div class="termbox"># tests/red.tftest.hcl
run "crea_tres_subredes_privadas" {
  command = plan
  assert {
    condition     = length(module.red.subredes_privadas) == 3
    error_message = "Deben existir tres subredes privadas"
  }
}</div>`},
 {t:"par", p:"Empareja cada herramienta con lo que detecta",
  pares:[["terraform fmt","Formato inconsistente"],["terraform validate","Errores de sintaxis y referencias"],["tflint","Tipos de instancia inexistentes y malas prácticas del proveedor"],["Checkov / Trivy","Buckets públicos, cifrado desactivado, puertos abiertos"],["OPA / Sentinel","Incumplimiento de políticas de la empresa (regiones, etiquetas, tamaños)"]],
  why:"Encontrar un bucket público en el PR es infinitamente mejor que en una auditoría."},
 {t:"opcion", p:"Quieres impedir que nadie cree instancias fuera de las regiones de la UE, aunque el código lo pida. ¿Qué capas usarías?",
  ops:["Solo documentación","Política en el pipeline (OPA/Sentinel/Checkov) y, como red de seguridad, una SCP en AWS Organizations","Un comentario en el código","Nada: confiar en el equipo"],
  ok:1, why:"Defensa en profundidad: la política avisa pronto y la SCP lo impide siempre."}
]},

{
id:"tf6l3",
titulo:"Plataformas y operación continua",
claves:["Atlantis, HCP Terraform, Spacelift o env0 ejecutan plan y apply desde los Pull Requests","Terragrunt reduce repetición entre entornos y gestiona dependencias entre estados","Detección periódica de deriva y actualización controlada de providers"],
pasos:[
 {t:"info", eti:"A escala", h:"Herramientas del ecosistema",
  c:`<ul><li><b>Atlantis</b> (libre): comenta el plan en el PR y aplica con un comentario <code>atlantis apply</code>.</li>
     <li><b>HCP Terraform</b> / Terraform Enterprise, <b>Spacelift</b>, <b>env0</b>: estado gestionado, políticas, aprobaciones, costes estimados y detección de deriva.</li>
     <li><b>Terragrunt</b>: define una vez el backend y los providers, y reutiliza módulos por entorno con muy poco código; ordena dependencias entre estados.</li></ul>
     <div class="dg dg-tabla-caja"><div class="dg-tit">entornos/</div><table class="dg-tabla"><tbody><tr><td>terragrunt.hcl</td><td>backend y provider comunes</td></tr><tr><td>prod/red/terragrunt.hcl</td><td>source = modulo red,  inputs = {...}</td></tr><tr><td>prod/api/terragrunt.hcl</td><td>dependency "red" { config_path = "../red" }</td></tr></tbody></table></div>`},
 {t:"par", p:"Empareja cada herramienta con su aportación",
  pares:[["Atlantis","Plan y apply comentando en el Pull Request"],["Terragrunt","Menos repetición entre entornos y dependencias entre estados"],["HCP Terraform","Estado gestionado, políticas y ejecuciones remotas"],["Renovate o Dependabot","PRs para actualizar providers y módulos"],["Plan programado cada noche","Detectar deriva"]],
  why:"La deriva detectada pronto es un cambio pequeño; detectada meses después, un incidente."},
 {t:"opcion", p:"¿Cómo detectarías que alguien cambia recursos a mano fuera de Terraform?",
  ops:["No se puede","Ejecutando un plan programado (por ejemplo cada noche) que alerta si hay diferencias, y restringiendo permisos de escritura manual en producción","Mirando la factura","Borrando el estado"],
  ok:1, why:"La mejor prevención: que nadie tenga permisos de escritura manual en producción."}
]}

]});
