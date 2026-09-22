window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Playbooks",
resumen: "Estructura de un playbook, módulos esenciales, ejecutar en modo de prueba y leer los resultados",
nivel: "Fundamentos",
color: "#ee6b6b",
lecciones: [

{
id:"an2l1",
titulo:"Tu primer playbook",
claves:["Un playbook es una lista de plays; cada play aplica tareas a un grupo de servidores","Cada tarea usa un módulo con sus parámetros y tiene un nombre descriptivo","ansible-playbook -i inventario playbook.yml; --check y --diff para ver sin aplicar"],
pasos:[
 {t:"info", eti:"Receta", h:"Anatomía",
  c:`<div class="termbox"># web.yml
- name: Configurar servidores web
  hosts: web
  become: true
  tasks:
    - name: Instalar nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Copiar la configuracion del sitio
      ansible.builtin.copy:
        src: files/tareas.conf
        dest: /etc/nginx/sites-available/tareas.conf
        mode: "0644"

    - name: Asegurar que nginx arranca con el sistema
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true</div>
     <div class="termbox">ansible-playbook -i inventario.ini web.yml --check --diff   # que cambiaria, sin aplicar
ansible-playbook -i inventario.ini web.yml                   # aplicar
ansible-playbook -i inventario.ini web.yml --limit web1.catappa.dev</div>`},
 {t:"par", p:"Empareja cada módulo con su uso",
  pares:[["apt / dnf","Instalar o quitar paquetes"],["copy","Copiar un fichero tal cual"],["template","Generar un fichero a partir de una plantilla"],["service / systemd","Arrancar, parar y habilitar servicios"],["user","Crear o modificar usuarios"],["file","Crear directorios, enlaces y permisos"]],
  why:"Prefiere siempre un módulo específico a shell o command: son idempotentes."},
 {t:"term", p:"Ejecuta el playbook <code>web.yml</code> con el inventario <code>inventario.ini</code> en modo de prueba mostrando las diferencias",
  prompt:"pablo@portatil:~/infra$", sol:["ansible-playbook -i inventario.ini web.yml --check --diff","ansible-playbook -i inventario.ini web.yml --diff --check","ansible-playbook web.yml -i inventario.ini --check --diff"],
  pista:"ansible-playbook, -i, el playbook, --check y --diff.",
  salida:`TASK [Copiar la configuracion del sitio] ****
--- before: /etc/nginx/sites-available/tareas.conf
+++ after: files/tareas.conf
@@ -3 +3 @@
-    proxy_pass http://127.0.0.1:8080;
+    proxy_pass http://127.0.0.1:8081;
changed: [web1.catappa.dev]
PLAY RECAP ****
web1.catappa.dev : ok=3 changed=1 unreachable=0 failed=0`, why:"Como terraform plan: ves el cambio antes de aplicarlo."},
 {t:"opcion", p:"¿Por qué evitar <code>shell: apt-get install -y nginx</code> en vez del módulo apt?",
  ops:["Por velocidad","shell siempre se ejecuta y se marca como changed: no es idempotente ni informa bien del estado","Porque shell no existe","Da igual"],
  ok:1, why:"Si no hay módulo, usa creates/removes o changed_when para hacerlo idempotente."}
]},

{
id:"an2l2",
titulo:"Leer la salida y depurar",
claves:["PLAY RECAP resume ok, changed, failed y unreachable por servidor","-v, -vv, -vvv para más detalle; --start-at-task y --step para depurar","register y debug para ver valores durante la ejecución"],
pasos:[
 {t:"info", eti:"Resultados", h:"El resumen",
  c:`<div class="termbox">PLAY RECAP *****************************************************
web1.catappa.dev : ok=5  changed=2  unreachable=0  failed=0  skipped=1
web2.catappa.dev : ok=2  changed=0  unreachable=1  failed=0  skipped=0

- name: Ver la version de nginx
  ansible.builtin.command: nginx -v
  register: version
  changed_when: false             # solo consulta: nunca es un cambio

- ansible.builtin.debug:
    var: version.stderr</div>`},
 {t:"par", p:"Empareja cada estado con su significado",
  pares:[["ok","La tarea no necesitaba cambios"],["changed","La tarea modificó algo"],["failed","La tarea falló"],["unreachable","No se pudo conectar al servidor"],["skipped","La tarea no se ejecutó por una condición"]],
  why:"unreachable suele ser SSH: claves, usuario, red o cortafuegos."},
 {t:"opcion", p:"Un servidor aparece como <code>unreachable</code>. ¿Qué revisas primero?",
  ops:["El playbook","La conexión SSH: host, usuario, clave, puerto 22 y grupos de seguridad","El módulo apt","La versión de Ansible"],
  ok:1, why:"Prueba con ssh usuario@host o ansible host -m ping -vvv."}
]},

{
id:"an2l3",
titulo:"Módulos esenciales",
claves:["package/apt/dnf, service/systemd, copy, template, file, user, lineinfile","command y shell solo cuando no hay módulo; no son idempotentes por sí solos","Los módulos de colecciones cubren Docker, Kubernetes, AWS y más"],
pasos:[
 {t:"info", eti:"La caja de herramientas", h:"Módulos que usarás siempre",
  c:`<div class="termbox">- ansible.builtin.apt:     { name: [nginx, git], state: present, update_cache: true }
- ansible.builtin.user:    { name: despliegue, groups: docker, append: true }
- ansible.builtin.file:    { path: /opt/app, state: directory, owner: despliegue, mode: "0755" }
- ansible.builtin.copy:    { src: files/app.env, dest: /opt/app/.env, mode: "0600" }
- ansible.builtin.lineinfile: { path: /etc/ssh/sshd_config, regexp: "^PasswordAuthentication", line: "PasswordAuthentication no" }
- ansible.builtin.systemd: { name: nginx, state: started, enabled: true }
- ansible.builtin.command: { cmd: /opt/app/migrar.sh, creates: /opt/app/.migrado }</div>
     <p>Con <code>creates</code> (o <code>changed_when</code>), incluso un <code>command</code> puede ser idempotente.</p>`},
 {t:"par", p:"Empareja cada necesidad con el módulo",
  pares:[["Instalar paquetes en Debian/Ubuntu","apt"],["Arrancar y habilitar un servicio","systemd"],["Crear un directorio con permisos","file"],["Cambiar una línea de un fichero de configuración","lineinfile"],["Generar un fichero con variables","template"],["Crear un usuario del sistema","user"]],
  why:"Un módulo describe el estado deseado; command describe una acción."},
 {t:"opcion", p:"¿Por qué evitar <code>shell: apt-get install -y nginx</code>?",
  ops:["Porque no funciona","Siempre marca «changed», no es idempotente ni portable y no informa bien de errores; el módulo apt sí","Porque es más rápido","Porque Ansible lo prohíbe"],
  ok:1, why:"ansible-lint avisa de este patrón (command-instead-of-module)."}
]}

]});
