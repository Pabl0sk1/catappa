window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Qué es Ansible",
resumen: "Gestión de configuración sin agentes, cómo ejecuta un módulo por dentro, instalación de ansible-core, ansible.cfg, SSH y privilegios con become",
nivel: "Fundamentos",
color: "#ee6b6b",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"an1l1",
titulo:"Configurar servidores con código",
claves:["Ansible automatiza la configuración de servidores: paquetes, ficheros, servicios, usuarios","Sin agentes: se conecta por SSH (o WinRM) y ejecuta módulos de Python que se borran al terminar","Declarativo e idempotente: describes el estado deseado y solo cambia lo necesario"],
pasos:[
 {t:"info", eti:"Empezamos", h:"El problema",
  c:`<p>Tienes 30 servidores y en todos hay que instalar Nginx, copiar su configuración, crear un usuario y abrir el cortafuegos. A mano: una tarde, con errores y sin garantía de que todos queden iguales. Con un script de bash: funciona la primera vez, pero la segunda duplica líneas, reinicia servicios sin motivo y falla si algo ya existía.</p>
     <p><b>Ansible</b> describe ese estado en ficheros YAML y lo aplica a todos los servidores a la vez, por SSH, sin instalar nada en ellos (solo Python, que ya suelen tener). Es un proyecto de código abierto patrocinado por Red Hat y la base de la certificación RHCE.</p>`},
 {t:"par", p:"Empareja cada herramienta con su especialidad",
  pares:[["Terraform","Crear infraestructura: redes, máquinas, bases de datos"],["Ansible","Configurar lo que hay dentro de los servidores"],["Docker","Empaquetar la aplicación con sus dependencias"],["Kubernetes","Ejecutar y orquestar contenedores"]],
  why:"Terraform crea la máquina; Ansible la configura. Con contenedores, parte de ese trabajo lo hace la imagen."},
 {t:"info", eti:"Por dentro", h:"Qué pasa cuando ejecutas una tarea",
  c:`<div class="dg"><div class="dg-tit">una tarea, paso a paso</div>
       <div class="dg-vert">
         <div class="dg-caja acento">Máquina de control<small>lee el playbook y el inventario</small></div>
         <div class="dg-caja">Conexión SSH al nodo<small>con tu clave y tu usuario</small></div>
         <div class="dg-caja">Copia el módulo empaquetado<small>un .py autocontenido (AnsiballZ) en ~/.ansible/tmp</small></div>
         <div class="dg-caja">Lo ejecuta con el Python del nodo<small>el módulo compara estado actual y deseado</small></div>
         <div class="dg-caja ok">Devuelve JSON y se borra<small>changed, ok, failed, más los datos del módulo</small></div>
       </div></div>
     <p>Es un modelo <b>push</b>: la máquina de control empuja los cambios cuando tú lo decides. Puppet y Chef usan agentes que tiran (<b>pull</b>) de un servidor central cada cierto tiempo.</p>`},
 {t:"orden", p:"Ordena lo que hace Ansible para ejecutar una tarea en un nodo",
  items:["Leer el inventario y el playbook","Abrir la conexión SSH con el nodo","Copiar el módulo al directorio temporal remoto","Ejecutarlo con el Python del nodo","Recoger el JSON de resultado y borrar el temporal"],
  why:"Por eso no hay agente que mantener: todo lo que se ejecuta en el nodo es temporal."},
 {t:"info", eti:"La idea clave", h:"Idempotencia",
  c:`<p>Un módulo de Ansible comprueba el estado actual antes de actuar. «El paquete nginx debe estar instalado»: si ya lo está, no hace nada y lo marca <b>ok</b>; si no, lo instala y lo marca <b>changed</b>. Puedes ejecutar el mismo playbook cien veces y el resultado es el mismo.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">script frente a módulo</div><table class="dg-tabla"><thead><tr><th>Acción</th><th>Script de bash</th><th>Módulo de Ansible</th></tr></thead><tbody>
       <tr><td>Añadir línea a un fichero</td><td><code>echo … &gt;&gt; f</code> la duplica cada vez</td><td><code>lineinfile</code> la añade solo si falta</td></tr>
       <tr><td>Crear usuario</td><td><code>useradd</code> falla si ya existe</td><td><code>user</code> no hace nada si ya existe</td></tr>
       <tr><td>Reiniciar servicio</td><td>siempre</td><td>handler: solo si cambió la configuración</td></tr>
     </tbody></table></div>`},
 {t:"opcion", p:"Ejecutas dos veces seguidas el mismo playbook sin cambiar nada. ¿Qué debería mostrar la segunda ejecución?",
  ops:["Todo como changed","Todo ok y changed=0","Errores","Nada, no se puede repetir"],
  ok:1, why:"Si aparece changed en la segunda ejecución, alguna tarea no es idempotente."},
 {t:"vf", p:"Ansible necesita instalar un agente en cada servidor gestionado.",
  ok:false, why:"Es agentless: usa SSH y Python en el destino. En Windows usa WinRM o SSH con módulos de PowerShell."},
 {t:"escribe", p:"Además de acceso SSH, ¿qué necesita tener instalado un nodo Linux para que Ansible ejecute módulos normales en él?",
  sol:["python","python3","Python 3","un interprete de python"],
  pista:"Los módulos están escritos en ese lenguaje.",
  why:"Solo el módulo <code>raw</code> funciona sin Python: se usa, por ejemplo, para instalar Python en un nodo mínimo."}
]},

/* =============== U1 L2 =============== */
{
id:"an1l3",
titulo:"Instalar Ansible y ansible.cfg",
claves:["Ansible solo se instala en la máquina de control; ansible-core es el motor y el paquete ansible añade cientos de colecciones","ansible.cfg fija inventario, usuario remoto y opciones por proyecto; el primero que se encuentra gana","ansible-config dump --only-changed enseña qué opciones estás cambiando"],
pasos:[
 {t:"info", eti:"Preparar", h:"Máquina de control y nodos",
  c:`<div class="termbox">pipx install ansible-core            # solo el motor y ansible.builtin
pipx install --include-deps ansible  # el paquete comunitario: motor + muchas colecciones
sudo dnf install ansible-core        # en RHEL y derivados, desde sus repositorios
ansible --version</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué se instala con cada paquete</div><table class="dg-tabla"><thead><tr><th>Paquete</th><th>Incluye</th><th>Cuándo</th></tr></thead><tbody>
       <tr><td>ansible-core</td><td>los comandos, el motor y <code>ansible.builtin</code></td><td>proyectos serios: añades solo las colecciones que usas con <code>requirements.yml</code></td></tr>
       <tr><td>ansible</td><td>ansible-core + una selección grande de colecciones</td><td>aprender, probar, portátiles personales</td></tr>
     </tbody></table></div>
     <div class="nota ojo"><b class="tit">Windows como máquina de control</b>Ansible no se ejecuta de forma nativa en Windows como controlador: usa WSL, una máquina Linux o un contenedor. Windows sí puede ser nodo gestionado.</div>`},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["Máquina de control","Donde se instala Ansible y se lanzan los playbooks"],["Nodo gestionado","Servidor configurado por SSH, sin agente"],["ansible.cfg","Opciones del proyecto: inventario, usuario, become"],["become","Ejecutar tareas con sudo"],["Clave SSH","Autenticarse sin contraseña en los nodos"]],
  why:"Sin agentes, empezar es muy sencillo: basta con acceso SSH."},
 {t:"term", p:"Comprueba qué versión de Ansible tienes instalada",
  prompt:"pablo@control:~/infra$", sol:["ansible --version"],
  pista:"El comando ansible con la opción de versión.",
  salida:`ansible [core 2.20.1]
  config file = /home/pablo/infra/ansible.cfg
  configured module search path = ['/home/pablo/.ansible/plugins/modules']
  ansible python module location = /home/pablo/.local/pipx/venvs/ansible-core/lib/python3.12/site-packages/ansible
  ansible collection location = /home/pablo/.ansible/collections:/usr/share/ansible/collections
  executable location = /home/pablo/.local/bin/ansible
  python version = 3.12.3
  jinja version = 3.1.6`,
  why:"Fíjate en <code>config file</code>: te dice qué ansible.cfg se está usando. Es lo primero que se mira cuando «Ansible no hace caso» a una opción."},
 {t:"info", eti:"Configuración", h:"ansible.cfg y dónde se busca",
  c:`<div class="termbox"># ansible.cfg en la raíz del proyecto
[defaults]
inventory = inventario.ini
remote_user = despliegue
host_key_checking = True
forks = 20

[privilege_escalation]
become = True
become_method = sudo</div>
     <p>Ansible usa <b>el primer fichero que encuentra</b>, sin mezclarlos: la variable <code>ANSIBLE_CONFIG</code>, luego <code>./ansible.cfg</code> en el directorio actual, luego <code>~/.ansible.cfg</code> y por último <code>/etc/ansible/ansible.cfg</code>. Cada opción también se puede fijar con una variable de entorno (<code>ANSIBLE_FORKS=50</code>).</p>
     <div class="nota ojo"><b class="tit">El ansible.cfg ignorado</b>Si el directorio del proyecto tiene permisos de escritura para todos (típico en carpetas compartidas de Vagrant o WSL sobre /mnt/c), Ansible ignora el <code>./ansible.cfg</code> por seguridad y avisa con un <i>warning</i>.</div>`},
 {t:"orden", p:"Ordena dónde busca Ansible su configuración, del primero al último",
  items:["La variable de entorno ANSIBLE_CONFIG","ansible.cfg en el directorio actual","~/.ansible.cfg en tu carpeta personal","/etc/ansible/ansible.cfg"],
  why:"El primero que existe gana y los demás se ignoran por completo: no se combinan."},
 {t:"term", p:"Muestra solo las opciones de configuración que difieren de los valores por defecto",
  prompt:"pablo@control:~/infra$", sol:["ansible-config dump --only-changed","ansible-config dump --only-changed -t all"],
  pista:"ansible-config dump con la opción de «solo cambiadas».",
  salida:`CONFIG_FILE() = /home/pablo/infra/ansible.cfg
DEFAULT_BECOME(/home/pablo/infra/ansible.cfg) = True
DEFAULT_FORKS(/home/pablo/infra/ansible.cfg) = 20
DEFAULT_HOST_LIST(/home/pablo/infra/ansible.cfg) = ['/home/pablo/infra/inventario.ini']
DEFAULT_REMOTE_USER(/home/pablo/infra/ansible.cfg) = despliegue`,
  why:"Entre paréntesis sale de dónde viene cada valor: fichero o variable de entorno. Para generar un ansible.cfg comentado con todas las opciones: <code>ansible-config init --disabled &gt; ansible.cfg</code>."},
 {t:"opcion", p:"Tu equipo instala el paquete <code>ansible</code> completo en el servidor de CI. ¿Qué problema puede traer frente a <code>ansible-core</code> + <code>requirements.yml</code>?",
  ops:["Ninguno, es lo recomendado en producción","Las versiones de las colecciones dependen de la versión del paquete: una actualización cambia decenas de colecciones a la vez sin que nadie lo decida","ansible-core no puede usar colecciones","El paquete ansible no incluye ansible-playbook"],
  ok:1, why:"Con ansible-core y un requirements.yml con versiones fijadas, cada colección se actualiza cuando tú lo decides y queda registrado en Git."},
 {t:"term", p:"Comprueba que Ansible llega a todos los hosts del inventario con el módulo ping",
  prompt:"pablo@control:~/infra$", sol:["ansible all -m ping","ansible all -m ansible.builtin.ping"],
  pista:"ansible all -m ...",
  salida:`web1 | SUCCESS => {"changed": false, "ping": "pong"}
web2 | SUCCESS => {"changed": false, "ping": "pong"}`, why:"No es un ping ICMP: comprueba SSH y Python en el nodo. No hace falta <code>-i</code> porque el inventario viene del ansible.cfg."}
]},

/* =============== U1 L3 =============== */
{
id:"an1n1",
titulo:"Conexión, claves y become",
claves:["Claves SSH (ed25519) y ssh-copy-id: Ansible no pregunta contraseñas si no se lo pides","Variables de conexión: ansible_host, ansible_user, ansible_port, ansible_connection","become eleva privilegios con sudo; -K pide la contraseña; become_user cambia a otro usuario"],
pasos:[
 {t:"info", eti:"Llegar al nodo", h:"SSH sin contraseñas",
  c:`<div class="termbox">ssh-keygen -t ed25519 -C "ansible@control"      # una vez, en la máquina de control
ssh-copy-id despliegue@web1.catappa.dev           # copia la clave pública al nodo
ssh despliegue@web1.catappa.dev hostname          # comprueba a mano antes de culpar a Ansible</div>
     <p>Ansible usa el cliente OpenSSH del sistema: respeta tu <code>~/.ssh/config</code>, tus claves y el agente SSH. Si <code>ssh</code> a mano no funciona, Ansible tampoco.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">variables de conexión más usadas</div><table class="dg-tabla"><thead><tr><th>Variable</th><th>Para qué</th></tr></thead><tbody>
       <tr><td>ansible_host</td><td>IP o nombre real si el alias del inventario es otro</td></tr>
       <tr><td>ansible_port</td><td>puerto SSH si no es el 22</td></tr>
       <tr><td>ansible_user</td><td>usuario remoto</td></tr>
       <tr><td>ansible_ssh_private_key_file</td><td>clave concreta para ese host o grupo</td></tr>
       <tr><td>ansible_connection</td><td><code>ssh</code> (por defecto), <code>local</code>, <code>winrm</code>, <code>psrp</code>, <code>community.docker.docker</code></td></tr>
       <tr><td>ansible_python_interpreter</td><td>fijar el Python del nodo si el descubrimiento automático no acierta</td></tr>
     </tbody></table></div>`},
 {t:"term", p:"Copia tu clave pública al usuario <code>despliegue</code> de <code>web1.catappa.dev</code>",
  prompt:"pablo@control:~/infra$", sol:["ssh-copy-id despliegue@web1.catappa.dev","ssh-copy-id -i ~/.ssh/id_ed25519.pub despliegue@web1.catappa.dev"],
  pista:"ssh-copy-id usuario@host",
  salida:`/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed
despliegue@web1.catappa.dev's password:
Number of key(s) added: 1`,
  why:"A partir de aquí la conexión usa la clave. En la nube, la clave suele inyectarse al crear la máquina (cloud-init)."},
 {t:"hueco", p:"El host <code>bastion</code> escucha SSH en el puerto 2222 en la IP 10.0.0.5. Completa su línea de inventario",
  tpl:"bastion ___=10.0.0.5 ___=2222 ansible_user=admin",
  banco:["ansible_host","ansible_port","ansible_ip","ansible_ssh","ansible_connection"],
  sol:["ansible_host","ansible_port"],
  why:"El nombre de la izquierda es un alias: lo que usa Ansible para conectar es <code>ansible_host</code>."},
 {t:"info", eti:"Privilegios", h:"become: actuar como root u otro usuario",
  c:`<div class="termbox">- name: Configurar PostgreSQL
  hosts: bd
  become: true                  # sudo a root para todo el play
  tasks:
    - name: Crear la base de datos como el usuario postgres
      community.postgresql.postgresql_db:
        name: tareas
      become_user: postgres     # sudo -u postgres solo en esta tarea

# en la línea de comandos
ansible-playbook bd.yml -K        # --ask-become-pass: pide la contraseña de sudo
ansible-playbook bd.yml -k        # --ask-pass: contraseña SSH (necesita sshpass)</div>
     <p>En automatización lo habitual es un usuario dedicado (<code>despliegue</code>) con clave SSH y sudo sin contraseña limitado por <code>/etc/sudoers.d/</code>. En equipos, la contraseña de become se guarda cifrada con Vault en <code>ansible_become_password</code>.</p>
     <div class="nota ojo"><b class="tit">become a un usuario sin privilegios</b>Si ves «Failed to set permissions on the temporary files Ansible needs to create when becoming an unprivileged user», falta <code>setfacl</code> (paquete <code>acl</code>) en el nodo: Ansible lo usa para que el otro usuario pueda leer el módulo temporal.</div>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["become: true","Ejecutar con sudo (root por defecto)"],["become_user: postgres","Cambiar a ese usuario en lugar de root"],["-K","Pedir la contraseña de sudo al lanzar"],["-k","Pedir la contraseña de SSH"],["become_method: su","Usar su en lugar de sudo"]],
  why:"<code>-K</code> (mayúscula) es become; <code>-k</code> (minúscula) es la conexión."},
 {t:"term", p:"Instala <code>htop</code> con apt en el grupo <code>web</code> usando privilegios y pidiendo la contraseña de sudo",
  prompt:"pablo@control:~/infra$", sol:["ansible web -b -K -m apt -a \"name=htop state=present\"","ansible web -m apt -a \"name=htop state=present\" -b -K","ansible web -b -K -m ansible.builtin.apt -a \"name=htop state=present\"","ansible web --become --ask-become-pass -m apt -a \"name=htop state=present\""],
  pista:"ansible web, -b y -K, -m apt, -a con name y state.",
  salida:`BECOME password:
web1 | CHANGED => {"changed": true, "cache_updated": false, ...}
web2 | CHANGED => {"changed": true, "cache_updated": false, ...}`,
  why:"Sin <code>-b</code>, apt fallaría por permisos: instalar paquetes requiere root."},
 {t:"opcion", p:"Una tarea con <code>become_user: app</code> falla con «Failed to set permissions on the temporary files…». ¿Qué haces?",
  ops:["Quitar become","Instalar el paquete acl en el nodo para que exista setfacl","Cambiar de usuario SSH a root","Subir forks"],
  ok:1, why:"Ansible necesita dar permiso al usuario destino sobre el módulo temporal; con acl lo hace sin abrirlo a todo el mundo."},
 {t:"vf", p:"Si <code>ssh despliegue@web1</code> no funciona desde la máquina de control, <code>ansible web1 -m ping</code> tampoco funcionará.",
  ok:true, why:"Ansible usa el mismo cliente SSH. Depura primero con <code>ssh -v</code> o con <code>ansible web1 -m ping -vvvv</code>, que enseña el comando SSH exacto."}
]}

]});
