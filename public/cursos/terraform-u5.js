window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Módulos",
resumen: "Crear módulos reutilizables, entradas y salidas, el registro público, versionado y composición de infraestructura",
nivel: "Avanzado",
color: "#9a70dc",
lecciones: [

{
id:"tf5l1",
titulo:"Crear y usar módulos",
claves:["Un módulo es una carpeta de ficheros .tf reutilizable con variables y outputs","Se llama con module \"nombre\" { source = ... }","Encapsula buenas prácticas: una vez bien hecho, se reutiliza en todos los entornos"],
pasos:[
 {t:"info", eti:"Reutilizar", h:"Estructura de un módulo",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">modulos/servicio-ecs/</span></div><div class="rama" style="--n:1"><span class="nom">variables.tf</span><span class="coment">nombre, imagen, cpu, memoria, subredes, puerto...</span></div><div class="rama" style="--n:1"><span class="nom">main.tf</span><span class="coment">task definition, service, target group, logs, alarmas</span></div><div class="rama" style="--n:1"><span class="nom">outputs.tf</span><span class="coment">url, nombre del servicio, rol</span></div><div class="rama" style="--n:1"><span class="nom">README.md</span></div><div class="rama" style="--n:0"><span class="nom">entornos/prod/main.tf</span></div><div class="rama" style="--n:1"><span class="nom">module "api" {</span></div><div class="rama" style="--n:2"><span class="nom">source</span><span class="coment">= "../../modulos/servicio-ecs"</span></div><div class="rama" style="--n:2"><span class="nom">nombre</span><span class="coment">= "tareas-api"</span></div><div class="rama" style="--n:2"><span class="nom">imagen</span><span class="coment">= "123456789012.dkr.ecr.eu-west-1.amazonaws.com/tareas-api:1.4.0"</span></div><div class="rama" style="--n:2"><span class="nom">cpu</span><span class="coment">= 512</span></div><div class="rama" style="--n:2"><span class="nom">memoria</span><span class="coment">= 1024</span></div><div class="rama" style="--n:2"><span class="nom">subredes = module.red.subredes_privadas</span></div><div class="rama" style="--n:1"><span class="nom">}</span></div></div>`},
 {t:"par", p:"Empareja cada elemento con su papel en un módulo",
  pares:[["variables.tf","Las entradas que acepta el módulo"],["outputs.tf","Lo que el módulo expone a quien lo usa"],["source","Dónde está el módulo (carpeta, Git o registro)"],["module.red.subredes_privadas","Usar la salida de otro módulo"]],
  why:"Un buen módulo tiene pocas entradas obligatorias y valores por defecto seguros."},
 {t:"opcion", p:"¿Qué ventaja tiene un módulo «servicio-ecs» usado por 15 servicios?",
  ops:["Ninguna","Las buenas prácticas (logs, alarmas, permisos mínimos) se definen una vez y se aplican a todos; mejorar el módulo mejora todos los servicios","Es más rápido de ejecutar","Evita el estado"],
  ok:1, why:"Es la base de una plataforma interna."},
 {t:"vf", p:"Tras añadir o cambiar un módulo hay que ejecutar <code>terraform init</code>.",
  ok:true, why:"init descarga o enlaza los módulos."}
]},

{
id:"tf5l2",
titulo:"Registro, versiones y composición",
claves:["El registro público ofrece módulos mantenidos (terraform-aws-modules)","Fija versiones de módulos como de cualquier dependencia","Componer: red, datos y servicios en capas con estados separados"],
pasos:[
 {t:"info", eti:"No reinventar", h:"Módulos del registro",
  c:`<div class="termbox">module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~&gt; 6.0"

  name            = "catappa-prod"
  cidr            = "10.0.0.0/16"
  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  enable_nat_gateway = true
  one_nat_gateway_per_az = true
}

# modulo propio desde Git con una version fija
module "api" {
  source = "git::https://github.com/catappa/infra-modulos.git//servicio-ecs?ref=v2.3.0"
}</div>`},
 {t:"par", p:"Empareja cada capa con lo que contiene y con qué frecuencia cambia",
  pares:[["Cuenta y red","VPC, subredes, DNS: cambia muy poco"],["Datos","RDS, S3, caché: cambia poco y es crítica"],["Plataforma","Clúster EKS o ECS, balanceadores"],["Servicios","Cada aplicación: cambia a menudo"]],
  why:"Estados separados por capa: un error al desplegar una aplicación nunca puede tocar la red o la base de datos."},
 {t:"opcion", p:"¿Por qué fijar <code>ref=v2.3.0</code> al usar un módulo desde Git?",
  ops:["Por estética","Para que un cambio en la rama principal del módulo no altere sin querer tu infraestructura en el siguiente plan","Porque Git lo exige","Para ir más rápido"],
  ok:1, why:"Actualizar la versión del módulo es un cambio explícito y revisado."}
]},

{
id:"tf5l3",
titulo:"Diseñar buenos módulos",
claves:["Interfaz pequeña: pocas variables obligatorias y valores por defecto seguros","Los módulos no configuran providers; los recibe quien los usa","Versionado semántico, ejemplos, README generado y pruebas"],
pasos:[
 {t:"info", eti:"Buenas prácticas", h:"Un módulo que otros quieran usar",
  c:`<ul><li><b>Una responsabilidad</b>: «servicio ECS», «bucket seguro», no «toda la infraestructura».</li>
     <li><b>Seguro por defecto</b>: cifrado activo, sin acceso público, logs activados; que haya que pedir explícitamente lo inseguro.</li>
     <li><b>Sin bloques provider</b> dentro: el llamador decide región y cuenta.</li>
     <li><b>Salidas útiles</b>: ids, ARNs, nombres, URLs.</li>
     <li><b>Versionado semántico</b>: 2.3.0 → 2.4.0 añade, 3.0.0 rompe compatibilidad.</li>
     <li>Carpeta <code>examples/</code>, pruebas con <code>terraform test</code> y README generado con <b>terraform-docs</b>.</li></ul>`},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["Valores por defecto seguros","Nadie crea un bucket público por olvido"],["Sin provider dentro del módulo","El módulo sirve para cualquier región o cuenta"],["Versionado semántico","Saber si una actualización rompe algo"],["Carpeta examples/","Documentación ejecutable de cómo usarlo"],["terraform-docs","README siempre al día con entradas y salidas"]],
  why:"Un catálogo de módulos bien hechos es la base de una plataforma interna."},
 {t:"opcion", p:"Tu módulo de bucket tiene 40 variables y todas obligatorias. ¿Qué mejorarías?",
  ops:["Nada","Reducir las obligatorias al mínimo (nombre) y dar valores por defecto seguros al resto, agrupando opciones en objetos","Añadir más variables","Quitar las salidas"],
  ok:1, why:"Un módulo difícil de usar acaba copiado y modificado, que es justo lo que se quería evitar."},
 {t:"vf", p:"Cambiar el nombre de una variable obligatoria de un módulo es un cambio compatible (versión menor).",
  ok:false, why:"Rompe a todos los que lo usan: es un cambio mayor, o se añade la nueva manteniendo la antigua un tiempo."}
]}

]});
