window.CURSOS = window.CURSOS || {};
(CURSOS.terraform = CURSOS.terraform || []).push({
titulo: "Maestría: casos reales y entrevista",
resumen: "Problemas típicos con Terraform, cómo resolverlos y simulacro de entrevista",
nivel: "Maestro",
color: "#8a60cc",
lecciones: [

{
id:"tf7l1",
titulo:"Problemas reales",
claves:["Leer el plan con lupa: los reemplazos (-/+) son los peligrosos","Estado bloqueado, deriva y recursos creados a mano tienen solución sin romper nada","Nunca editar el estado a mano salvo con los comandos de state"],
pasos:[
 {t:"opcion", p:"Caso 1: el plan muestra <code>-/+ aws_db_instance.principal (forces replacement)</code> porque cambiaste el nombre de la subnet group. ¿Qué haces?",
  ops:["Aplicar","Detenerte: reemplazar la base de datos implica perder datos. Buscar un cambio que no fuerce reemplazo, planificar una migración o usar moved si es solo un renombrado en el código","Borrar el estado","Aplicar con -auto-approve"],
  ok:1, why:"prevent_destroy habría bloqueado el apply: por eso se pone en recursos con datos."},
 {t:"opcion", p:"Caso 2: «Error acquiring the state lock». Nadie está aplicando: un pipeline se canceló a mitad. ¿Qué haces?",
  ops:["Borrar el bucket de estado","Confirmar que ningún proceso sigue en marcha y liberar el bloqueo con terraform force-unlock ID","Copiar el estado a local","Esperar una semana"],
  ok:1, why:"force-unlock solo tras asegurarte de que nadie está aplicando."},
 {t:"opcion", p:"Caso 3: alguien creó a mano un registro DNS que ahora quieres gestionar con Terraform. ¿Cómo?",
  ops:["Borrarlo y crearlo con Terraform","Escribir el recurso y un bloque import con su id; el plan debe mostrar «0 to add» si el código coincide","Ignorarlo","Editar el estado a mano"],
  ok:1, why:"Sin cortes: pasa a estar gestionado tal como está."},
 {t:"par", p:"Empareja cada síntoma con la acción adecuada",
  pares:[["El plan quiere revertir un cambio manual urgente","Llevar ese cambio al código o aceptar la reversión conscientemente"],["Estado bloqueado por un pipeline cancelado","terraform force-unlock tras comprobar"],["Renombrar sin destruir","Bloque moved"],["Recurso existente fuera de Terraform","Bloque import"],["Plan lentísimo con miles de recursos","Dividir el estado por capas o componentes"]],
  why:"Estas situaciones aparecen en cualquier equipo que usa Terraform en serio."}
]},

{
id:"tf7l2",
titulo:"Simulacro de entrevista de Terraform",
claves:["Sabes explicar el estado, el plan, los módulos y los backends","Diseñas repositorios y flujos de trabajo para equipos","Conoces los riesgos y cómo mitigarlos"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Qué es el estado de Terraform y cómo lo gestionas en equipo?»",
  ops:["Un log","El registro que relaciona el código con los recursos reales; en equipo, en un backend remoto cifrado con bloqueo, acceso restringido y un estado por componente y entorno","Un fichero de variables","No es necesario"],
  ok:1, why:"Mencionar que contiene secretos suma puntos."},
 {t:"opcion", p:"«¿count o for_each?»",
  ops:["Siempre count","for_each por defecto, porque identifica cada elemento por su clave y añadir o quitar uno no desplaza a los demás; count para 0/1 condicional o copias idénticas","Son iguales","for_each no existe"],
  ok:1, why:"El ejemplo de quitar un elemento del medio lo deja claro."},
 {t:"opcion", p:"«¿Cómo manejas los secretos en Terraform?»",
  ops:["En el código","No escribirlos en el código ni en tfvars versionados; leerlos o generarlos en Secrets Manager o Vault, marcar variables como sensitive y proteger el estado, que los guarda","En un comentario cifrado","En variables de GitHub sin más"],
  ok:1, why:"Mejor aún si el servicio gestiona su propio secreto (RDS con Secrets Manager)."},
 {t:"opcion", p:"«¿Terraform o Ansible?»",
  ops:["Son lo mismo","Terraform crea y gestiona la infraestructura de forma declarativa con estado; Ansible configura sistemas y despliega software dentro de ellos. Se complementan","Ansible sustituye a Terraform","Terraform solo sirve para AWS"],
  ok:1, why:"En entornos con contenedores, la parte de Ansible a menudo la cubre la imagen Docker."},
 {t:"opcion", p:"«¿Cómo evitarías un desastre en producción con Terraform?»",
  ops:["Tener cuidado","Plan revisado en cada PR, apply solo desde el CI con OIDC, estados separados por capa, prevent_destroy y protección de borrado en recursos con datos, escáneres de seguridad y copias del estado versionadas","No usar Terraform en producción","Aplicar de noche"],
  ok:1, why:"Varias capas de protección, igual que en todo lo demás."},
 {t:"info", eti:"Terminado", h:"Has completado Terraform",
  c:`<p>Dominas la infraestructura como código, HCL, variables y salidas, el estado y sus operaciones, expresiones y repetición, módulos, flujos de equipo con CI/CD, calidad, pruebas y políticas.</p>
     <p>Para consolidarlo: define en Terraform la infraestructura de tu API de tareas en AWS (red con el módulo oficial de VPC, ECS Fargate, ALB, RDS) con un módulo propio para el servicio, estado en S3 y un pipeline de GitHub Actions con plan en el PR. Y destruye todo al terminar.</p>`}
]},

{
id:"tf7l3",
titulo:"Laboratorio: tu API en AWS con Terraform",
claves:["Capas: red, datos y servicio, cada una con su estado","Módulo oficial de VPC, ECS Fargate con ALB y RDS con secretos gestionados","Pipeline con plan en el PR, OIDC y destrucción al terminar para no pagar"],
pasos:[
 {t:"info", eti:"Proyecto final", h:"Lo que vas a construir",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">infra/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">modulos/servicio-ecs/</span><span class="coment">task definition, service, target group, logs, alarmas</span></div><div class="rama" style="--n:1"><span class="nom carpeta">entornos/prod/</span></div><div class="rama" style="--n:2"><span class="nom carpeta">red/</span><span class="coment">module "vpc" (terraform-aws-modules), 2 AZ, NAT, endpoints S3 y ECR</span></div><div class="rama" style="--n:2"><span class="nom carpeta">datos/</span><span class="coment">aws_db_instance postgres, Multi-AZ, manage_master_user_password = true</span></div><div class="rama" style="--n:2"><span class="nom carpeta">servicio/</span><span class="coment">aws_lb + module "api" (servicio-ecs) + aws_ecr_repository</span></div><div class="rama" style="--n:1"><span class="nom">.github/workflows/terraform.yml</span><span class="coment">plan en PR, apply al fusionar, OIDC</span></div></div>`},
 {t:"orden", p:"Ordena la construcción del laboratorio",
  items:["Crear el bucket de estado y el rol de OIDC para GitHub","Capa red con el módulo de VPC","Capa datos con RDS y su secreto en Secrets Manager","Capa servicio: ECR, ALB y el módulo servicio-ecs","Pipeline con plan en el PR y apply al fusionar","Probar la API, revisar costes y destruir en orden inverso"],
  why:"Se destruye al revés: servicio, datos y por último red."},
 {t:"hueco", p:"Completa para que RDS genere y guarde su contraseña en Secrets Manager",
  tpl:"resource \"aws_db_instance\" \"principal\" {\n  engine = \"postgres\"\n  ___ = true\n}", banco:["manage_master_user_password","password","secret_arn","publicly_accessible"], sol:["manage_master_user_password"],
  why:"La contraseña nunca pasa por tus manos ni por el código; la aplicación la lee de Secrets Manager."},
 {t:"par", p:"Empareja cada recurso con su capa",
  pares:[["module \"vpc\"","Red"],["aws_db_instance","Datos"],["aws_lb","Servicio"],["aws_ecr_repository","Servicio (o una capa compartida)"],["aws_iam_openid_connect_provider","Base de la cuenta (CI)"]],
  why:"Separar capas limita el alcance de cada cambio."},
 {t:"vf", p:"Al terminar el laboratorio conviene ejecutar terraform destroy para no seguir pagando NAT, RDS y el balanceador.",
  ok:true, why:"El NAT Gateway y el ALB cobran por hora aunque no haya tráfico."}
]}

]});
