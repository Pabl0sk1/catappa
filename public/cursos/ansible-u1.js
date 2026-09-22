window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Qué es Ansible",
resumen: "Gestión de configuración sin agentes, el inventario, comandos ad-hoc y la idea de idempotencia",
nivel: "Fundamentos",
color: "#ee6b6b",
lecciones: [

{
id:"an1l1",
titulo:"Configurar servidores con código",
claves:["Ansible automatiza la configuración de servidores: paquetes, ficheros, servicios, usuarios","Sin agentes: se conecta por SSH (o WinRM) y ejecuta módulos de Python","Declarativo e idempotente: describes el estado deseado y solo cambia lo necesario"],
pasos:[
 {t:"info", eti:"Empezamos", h:"El problema",
  c:`<p>Tienes 30 servidores y en todos hay que instalar Nginx, copiar su configuración, crear un usuario y abrir el cortafuegos. A mano: una tarde, con errores y sin garantía de que todos queden iguales.</p>
     <p><b>Ansible</b> describe ese estado en ficheros YAML y lo aplica a todos los servidores a la vez, por SSH, sin instalar nada en ellos (solo Python, que ya suelen tener).</p>`},
 {t:"par", p:"Empareja cada herramienta con su especialidad",
  pares:[["Terraform","Crear infraestructura: redes, máquinas, bases de datos"],["Ansible","Configurar lo que hay dentro de los servidores"],["Docker","Empaquetar la aplicación con sus dependencias"],["Kubernetes","Ejecutar y orquestar contenedores"]],
  why:"Terraform crea la máquina; Ansible la configura. Con contenedores, parte de ese trabajo lo hace la imagen."},
 {t:"info", eti:"La idea clave", h:"Idempotencia",
  c:`<p>Un módulo de Ansible comprueba el estado actual antes de actuar. «El paquete nginx debe estar instalado»: si ya lo está, no hace nada y lo marca <b>ok</b>; si no, lo instala y lo marca <b>changed</b>. Puedes ejecutar el mismo playbook cien veces y el resultado es el mismo.</p>`},
 {t:"opcion", p:"Ejecutas dos veces seguidas el mismo playbook sin cambiar nada. ¿Qué debería mostrar la segunda ejecución?",
  ops:["Todo como changed","Todo ok y changed=0","Errores","Nada, no se puede repetir"],
  ok:1, why:"Si aparece changed en la segunda ejecución, alguna tarea no es idempotente."},
 {t:"vf", p:"Ansible necesita instalar un agente en cada servidor gestionado.",
  ok:false, why:"Es agentless: usa SSH y Python en el destino."}
]},

{
id:"an1l2",
titulo:"Inventario y comandos ad-hoc",
claves:["El inventario lista los servidores y los agrupa","Comandos ad-hoc: ansible grupo -m módulo -a argumentos","ping comprueba la conexión; -b (become) ejecuta como root"],
pasos:[
 {t:"info", eti:"Qué servidores", h:"El inventario",
  c:`<div class="termbox"># inventario.ini
[web]
web1.catappa.dev
web2.catappa.dev

[bd]
bd1.catappa.dev ansible_user=admin

[produccion:children]
web
bd</div>
     <div class="termbox"># inventario.yml equivalente
all:
  children:
    web:
      hosts:
        web1.catappa.dev:
        web2.catappa.dev:
    bd:
      hosts:
        bd1.catappa.dev: { ansible_user: admin }</div>
     <p>En la nube se usan <b>inventarios dinámicos</b>: un plugin consulta AWS y agrupa las instancias por etiquetas.</p>`},
 {t:"info", eti:"Acciones rápidas", h:"Comandos ad-hoc",
  c:`<div class="termbox">ansible all -i inventario.ini -m ping
ansible web -i inventario.ini -m shell -a "uptime"
ansible web -i inventario.ini -b -m apt -a "name=htop state=present"
ansible bd -i inventario.ini -m setup -a "filter=ansible_memtotal_mb"</div>`},
 {t:"term", p:"Comprueba la conexión con todos los servidores del inventario <code>inventario.ini</code>",
  prompt:"pablo@portatil:~/infra$", sol:["ansible all -i inventario.ini -m ping","ansible -i inventario.ini all -m ping","ansible all -m ping -i inventario.ini"],
  pista:"ansible, el patrón all, -i con el inventario y -m ping.",
  salida:`web1.catappa.dev | SUCCESS => { "changed": false, "ping": "pong" }
web2.catappa.dev | SUCCESS => { "changed": false, "ping": "pong" }
bd1.catappa.dev | SUCCESS => { "changed": false, "ping": "pong" }`, why:"El módulo ping no es ICMP: comprueba SSH y Python."},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["-i inventario.ini","Qué inventario usar"],["-m apt","Qué módulo ejecutar"],["-a \"name=htop\"","Argumentos del módulo"],["-b","Ejecutar con privilegios (become, sudo)"],["web","Patrón: a qué grupo o servidores aplicar"]],
  why:"Los comandos ad-hoc sirven para consultas puntuales; lo repetible va en playbooks."}
]},

{
id:"an1l3",
titulo:"Instalar Ansible y conectar",
claves:["Ansible solo se instala en la máquina de control; los nodos necesitan SSH y Python","ansible.cfg fija inventario, usuario remoto y opciones por proyecto","Claves SSH y become (sudo) para tareas con privilegios"],
pasos:[
 {t:"info", eti:"Preparar", h:"Máquina de control y nodos",
  c:`<div class="termbox">pipx install ansible-core       # o: pip install ansible
ansible --version

# ansible.cfg en la raiz del proyecto
[defaults]
inventory = inventario.ini
remote_user = despliegue
host_key_checking = True

[privilege_escalation]
become = True
become_method = sudo</div>
     <p>No hay agentes: Ansible se conecta por <b>SSH</b>, copia pequeños módulos de Python y los ejecuta. Por eso los nodos solo necesitan SSH y Python.</p>`},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["Máquina de control","Donde se instala Ansible y se lanzan los playbooks"],["Nodo gestionado","Servidor configurado por SSH, sin agente"],["ansible.cfg","Opciones del proyecto: inventario, usuario, become"],["become","Ejecutar tareas con sudo"],["Clave SSH","Autenticarse sin contraseña en los nodos"]],
  why:"Sin agentes, empezar es muy sencillo: basta con acceso SSH."},
 {t:"term", p:"Comprueba que Ansible llega a todos los hosts del inventario con el módulo ping",
  prompt:"pablo@portatil:~/infra$", sol:["ansible all -m ping","ansible all -m ansible.builtin.ping"],
  pista:"ansible all -m ...",
  salida:`web1 | SUCCESS => {"changed": false, "ping": "pong"}
web2 | SUCCESS => {"changed": false, "ping": "pong"}`, why:"No es un ping ICMP: comprueba SSH y Python en el nodo."}
]}

]});
