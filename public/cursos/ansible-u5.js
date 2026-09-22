window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Maestría: Ansible a escala y entrevista",
resumen: "Rendimiento y estrategias de despliegue, casos reales y simulacro de entrevista",
nivel: "Maestro",
color: "#d65454",
lecciones: [

{
id:"an5l1",
titulo:"A escala y despliegues",
claves:["forks controla cuántos servidores se configuran en paralelo; pipelining acelera SSH","serial despliega por tandas (rolling) y max_fail_percentage detiene si fallan demasiados","Ansible frente a imágenes inmutables: cuándo configurar y cuándo reconstruir"],
pasos:[
 {t:"info", eti:"Muchos servidores", h:"Despliegue por tandas",
  c:`<div class="termbox">- hosts: web
  serial: "25%"                 # de cuarto en cuarto
  max_fail_percentage: 10       # parar si falla mas del 10%
  pre_tasks:
    - name: Sacar del balanceador
      community.aws.elb_target: { target_group_arn: "{{ tg }}", target_id: "{{ ansible_ec2_instance_id }}", state: absent }
      delegate_to: localhost
  roles: [app_java]
  post_tasks:
    - name: Esperar a que la app responda
      ansible.builtin.uri: { url: "http://localhost:8080/actuator/health", status_code: 200 }
      retries: 20
      delay: 3
    - name: Volver al balanceador
      community.aws.elb_target: { target_group_arn: "{{ tg }}", target_id: "{{ ansible_ec2_instance_id }}", state: present }
      delegate_to: localhost

# ansible.cfg
[defaults]
forks = 50
[ssh_connection]
pipelining = True</div>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["serial","Aplicar a los servidores por tandas"],["max_fail_percentage","Abortar si fallan demasiados"],["delegate_to: localhost","Ejecutar esa tarea en la máquina de control"],["forks","Servidores en paralelo"],["pipelining","Menos conexiones SSH por tarea: más rápido"]],
  why:"Así se hace un rolling update sin caída con máquinas tradicionales."},
 {t:"opcion", p:"En una arquitectura con contenedores y Kubernetes, ¿dónde sigue siendo útil Ansible?",
  ops:["En ningún sitio","Preparar máquinas base o nodos, equipos de red, servidores que no son contenedores, y tareas de operación puntuales","Para sustituir a Kubernetes","Para compilar Java"],
  ok:1, why:"Con infraestructura inmutable, gran parte de la configuración se hace al construir la imagen."}
]},

{
id:"an5l2",
titulo:"Simulacro de entrevista de Ansible",
claves:["Sabes explicar idempotencia, inventarios, playbooks y roles","Gestionas secretos y pruebas","Sabes cuándo usar Ansible y cuándo otra herramienta"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Qué significa que Ansible es agentless?»",
  ops:["Que no tiene interfaz","Que no requiere instalar software propio en los servidores gestionados: se conecta por SSH y ejecuta módulos con el Python del destino","Que no usa red","Que no necesita inventario"],
  ok:1, why:"Menos que mantener en cada servidor frente a Puppet o Chef."},
 {t:"opcion", p:"«¿Cómo garantizas que un playbook es idempotente?»",
  ops:["No se puede","Usando módulos declarativos en vez de shell, changed_when y creates cuando no hay módulo, y comprobándolo con una segunda ejecución (Molecule)","Ejecutándolo una vez","Con más handlers"],
  ok:1, why:"La segunda ejecución debe dar changed=0."},
 {t:"opcion", p:"«¿Terraform o Ansible para crear instancias EC2?»",
  ops:["Ansible siempre","Terraform, que gestiona el ciclo de vida con estado y planes; Ansible después para configurarlas si hace falta","Ninguno","Ambos a la vez para lo mismo"],
  ok:1, why:"Ansible puede crear recursos en la nube, pero sin estado ni plan como Terraform."},
 {t:"opcion", p:"«¿Cómo manejas contraseñas en Ansible?»",
  ops:["En texto plano en group_vars","Cifradas con ansible-vault o leídas de un gestor de secretos en ejecución, con no_log: true en las tareas que las usan","En comentarios","En el inventario"],
  ok:1, why:"no_log evita que aparezcan en la salida."},
 {t:"info", eti:"Terminado", h:"Has completado Ansible",
  c:`<p>Dominas inventarios, comandos ad-hoc, playbooks, módulos, variables y plantillas, handlers, roles y colecciones, Vault, pruebas y despliegues por tandas.</p>
     <p>Para consolidarlo: crea con Terraform dos máquinas y configúralas con un rol de Ansible que instale Docker, despliegue tu API y Nginx delante; pruébalo con Molecule y ejecútalo desde GitHub Actions.</p>`}
]}

]});
