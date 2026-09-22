window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Roles, secretos y calidad",
resumen: "Roles y colecciones, Ansible Vault para secretos, estructura de proyecto, ansible-lint, Molecule y CI",
nivel: "Avanzado",
color: "#e45f5f",
lecciones: [

{
id:"an4l1",
titulo:"Roles y colecciones",
claves:["Un rol empaqueta tareas, handlers, plantillas, ficheros y variables por defecto","Los playbooks se vuelven cortos: qué roles aplicar a qué grupos","Colecciones y Ansible Galaxy para reutilizar roles y módulos de la comunidad"],
pasos:[
 {t:"info", eti:"Reutilizar", h:"Estructura de un rol",
  c:`<div class="diag">roles/nginx/
  tasks/main.yml         tareas
  handlers/main.yml      handlers
  templates/sitio.conf.j2
  files/
  defaults/main.yml      variables por defecto (baja prioridad)
  vars/main.yml          variables internas
  meta/main.yml          dependencias y metadatos</div>
     <div class="termbox"># sitio.yml
- hosts: web
  become: true
  roles:
    - comun
    - nginx
    - { role: app_java, version_app: "1.4.0" }

ansible-galaxy collection install community.postgresql
ansible-galaxy role init roles/nginx</div>`},
 {t:"par", p:"Empareja cada carpeta del rol con su contenido",
  pares:[["tasks/","Las tareas del rol"],["handlers/","Acciones como reiniciar servicios"],["templates/","Plantillas Jinja2"],["defaults/","Valores por defecto que el usuario puede sobrescribir"],["meta/","Dependencias de otros roles"]],
  why:"defaults tiene la prioridad más baja: pensados para ser sobrescritos."},
 {t:"vf", p:"Las colecciones de Ansible pueden incluir módulos, roles y plugins.",
  ok:true, why:"Por ejemplo amazon.aws o community.docker."}
]},

{
id:"an4l2",
titulo:"Secretos con Vault y calidad",
claves:["ansible-vault cifra ficheros o valores con secretos para guardarlos en Git","ansible-lint detecta malas prácticas; Molecule prueba roles en contenedores","Pipeline: lint, prueba con Molecule y ejecución con --check antes de aplicar"],
pasos:[
 {t:"info", eti:"Secretos", h:"Ansible Vault",
  c:`<div class="termbox">ansible-vault create group_vars/produccion/secretos.yml   # crea un fichero cifrado
ansible-vault edit group_vars/produccion/secretos.yml
ansible-vault encrypt_string "s3cr3t0" --name clave_bd     # cifrar un valor suelto
ansible-playbook sitio.yml --ask-vault-pass                 # o --vault-password-file</div>
     <p>Con Vault los secretos pueden vivir en el repositorio cifrados con AES-256. Alternativa: leerlos en tiempo de ejecución de un gestor externo (HashiCorp Vault, AWS Secrets Manager) con sus lookups.</p>`},
 {t:"info", eti:"Calidad", h:"Probar la automatización",
  c:`<div class="termbox">ansible-lint                      # malas practicas: shell innecesario, falta de nombres...
molecule test                     # crea un contenedor, aplica el rol, comprueba idempotencia y lo destruye</div>
     <p><b>Molecule</b> ejecuta el rol dos veces y falla si la segunda produce cambios: detecta tareas que no son idempotentes.</p>`},
 {t:"par", p:"Empareja cada herramienta con su propósito",
  pares:[["ansible-vault","Cifrar secretos para guardarlos en Git"],["ansible-lint","Detectar malas prácticas en playbooks y roles"],["Molecule","Probar roles en entornos desechables"],["--check --diff","Ver qué cambiaría sin aplicar"],["AWX / Ansible Automation Platform","Ejecutar playbooks con interfaz, permisos y registro"]],
  why:"La automatización también es código: se revisa y se prueba."},
 {t:"opcion", p:"¿Qué detecta Molecule al aplicar un rol dos veces?",
  ops:["Nada","Tareas no idempotentes: si la segunda ejecución produce cambios, falla","La velocidad de la red","Secretos sin cifrar"],
  ok:1, why:"La idempotencia es la propiedad más importante de un buen rol."}
]},

{
id:"an4l3",
titulo:"Probar roles con Molecule",
claves:["Molecule crea instancias (contenedores), aplica el rol y verifica","Prueba de idempotencia: la segunda ejecución debe dar changed=0","Integrado en CI junto a ansible-lint"],
pasos:[
 {t:"info", eti:"Roles con pruebas", h:"Molecule",
  c:`<div class="termbox">molecule init scenario --driver-name docker
molecule test
#  create      -> contenedor limpio
#  converge    -> aplicar el rol
#  idempotence -> aplicarlo otra vez: debe dar changed=0
#  verify      -> comprobaciones (nginx responde, fichero existe...)
#  destroy</div>`},
 {t:"par", p:"Empareja cada fase de Molecule con lo que comprueba",
  pares:[["converge","El rol se aplica sin errores"],["idempotence","Repetirlo no cambia nada"],["verify","El sistema queda como se esperaba"],["lint","Estilo y malas prácticas"],["destroy","Limpiar las instancias de prueba"]],
  why:"Es el equivalente a los tests de integración para la infraestructura."},
 {t:"vf", p:"Si la segunda ejecución de un rol muestra tareas con «changed», el rol no es idempotente.",
  ok:true, why:"Suele deberse a command/shell sin creates ni changed_when."}
]}

]});
