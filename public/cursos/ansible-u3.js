window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Playbooks y módulos",
resumen: "YAML sin sustos, estructura de un playbook, módulos de paquetes, servicios, usuarios y ficheros, command y shell idempotentes, leer la salida y depurar",
nivel: "Fundamentos",
color: "#ee6b6b",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"an2l1",
titulo:"Tu primer playbook",
claves:["Un playbook es una lista de plays; cada play aplica tareas a un grupo de servidores","YAML: sangría con espacios, listas con guion y comillas cuando el valor empieza por {{","ansible-playbook -i inventario playbook.yml; --syntax-check antes, --check --diff para ver sin aplicar"],
pasos:[
 {t:"info", eti:"Receta", h:"Anatomía",
  c:`<div class="termbox"># web.yml
- name: Configurar servidores web      # un play
  hosts: web
  become: true
  tasks:
    - name: Instalar nginx               # una tarea
      ansible.builtin.apt:               # módulo, con su nombre completo (FQCN)
        name: nginx
        state: present
        update_cache: true

    - name: Copiar la configuración del sitio
      ansible.builtin.copy:
        src: files/tareas.conf
        dest: /etc/nginx/sites-available/tareas.conf
        mode: "0644"

    - name: Asegurar que nginx arranca con el sistema
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true</div>
     <div class="termbox">ansible-playbook -i inventario.ini web.yml --syntax-check   # solo comprueba la sintaxis
ansible-playbook -i inventario.ini web.yml --check --diff   # qué cambiaría, sin aplicar
ansible-playbook -i inventario.ini web.yml                   # aplicar
ansible-playbook -i inventario.ini web.yml --limit web1.catappa.dev</div>
     <p>Las tareas se ejecutan <b>en orden</b>, y cada tarea en todos los hosts del play antes de pasar a la siguiente. Usa el nombre completo del módulo (<code>ansible.builtin.apt</code>, no <code>apt</code>): evita ambigüedades si una colección tiene un módulo con el mismo nombre corto.</p>`},
 {t:"info", eti:"YAML", h:"Los cuatro tropiezos de YAML",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">errores típicos</div><table class="dg-tabla"><thead><tr><th>Mal</th><th>Bien</th><th>Por qué</th></tr></thead><tbody>
       <tr><td>sangría con tabuladores</td><td>2 espacios por nivel</td><td>YAML prohíbe tabuladores en la sangría</td></tr>
       <tr><td><code>msg: {{ saludo }}</code></td><td><code>msg: "{{ saludo }}"</code></td><td>un valor que empieza por <code>{</code> se lee como diccionario</td></tr>
       <tr><td><code>mode: 0644</code></td><td><code>mode: "0644"</code></td><td>sin comillas es un número octal que YAML puede interpretar distinto</td></tr>
       <tr><td><code>enabled: yes</code></td><td><code>enabled: true</code></td><td>funciona, pero ansible-lint pide <code>true</code>/<code>false</code></td></tr>
     </tbody></table></div>
     <div class="termbox">contenido: |          # bloque literal: conserva los saltos de línea
  línea 1
  línea 2
descripcion: &gt;       # bloque plegado: une las líneas en una
  texto largo
  en varias líneas</div>`},
 {t:"hueco", p:"Completa el playbook: aplica al grupo <code>web</code>, con sudo, y define la lista de tareas",
  tpl:`- name: Preparar web
  ___: web
  ___: true
  ___:
    - name: Instalar git
      ansible.builtin.apt:
        name: git
        state: present`,
  banco:["hosts","become","tasks","sudo","servers","steps"],
  sol:["hosts","become","tasks"],
  why:"<code>hosts</code>, <code>become</code> y <code>tasks</code> son claves del play. Otras habituales: <code>vars</code>, <code>handlers</code>, <code>roles</code>, <code>gather_facts</code>."},
 {t:"par", p:"Empareja cada módulo con su uso",
  pares:[["apt / dnf","Instalar o quitar paquetes"],["copy","Copiar un fichero tal cual"],["template","Generar un fichero a partir de una plantilla"],["service / systemd_service","Arrancar, parar y habilitar servicios"],["user","Crear o modificar usuarios"],["file","Crear directorios, enlaces y permisos"]],
  why:"Prefiere siempre un módulo específico a shell o command: son idempotentes."},
 {t:"term", p:"Comprueba solo la sintaxis del playbook <code>web.yml</code>, sin conectar a ningún servidor",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook web.yml --syntax-check","ansible-playbook --syntax-check web.yml","ansible-playbook -i inventario.ini web.yml --syntax-check"],
  pista:"ansible-playbook con la opción de comprobación de sintaxis.",
  salida:`ERROR! We were unable to read either as JSON nor YAML, these are the errors we got from each:
...
The error appears to be in '/home/pablo/infra/web.yml': line 12, column 14
        msg: {{ saludo }}
             ^ here
We could be wrong, but this one looks like it might be an issue with
missing quotes. Always quote template expression brackets when they
start a value.`,
  why:"Ansible señala la línea y hasta sugiere la causa. Aquí: faltan las comillas alrededor de <code>{{ saludo }}</code>."},
 {t:"term", p:"Ejecuta el playbook <code>web.yml</code> con el inventario <code>inventario.ini</code> en modo de prueba mostrando las diferencias",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook -i inventario.ini web.yml --check --diff","ansible-playbook -i inventario.ini web.yml --diff --check","ansible-playbook web.yml -i inventario.ini --check --diff"],
  pista:"ansible-playbook, -i, el playbook, --check y --diff.",
  salida:`TASK [Copiar la configuración del sitio] ****
--- before: /etc/nginx/sites-available/tareas.conf
+++ after: files/tareas.conf
@@ -3 +3 @@
-    proxy_pass http://127.0.0.1:8080;
+    proxy_pass http://127.0.0.1:8081;
changed: [web1.catappa.dev]
PLAY RECAP ****
web1.catappa.dev : ok=3 changed=1 unreachable=0 failed=0`, why:"Como terraform plan: ves el cambio antes de aplicarlo."},
 {t:"vf", p:"Un playbook puede contener varios plays, cada uno dirigido a un grupo distinto de hosts.",
  ok:true, why:"Por ejemplo: un play para <code>bd</code> y después otro para <code>web</code>. Se ejecutan en el orden en que están escritos."},
 {t:"opcion", p:"Tienes 10 hosts y 3 tareas. ¿En qué orden las ejecuta Ansible por defecto?",
  ops:["Las 3 tareas en el host 1, luego las 3 en el host 2…","La tarea 1 en los 10 hosts (en paralelo según forks), luego la tarea 2 en los 10, y así","Todas a la vez en un orden aleatorio","Depende del nombre de las tareas"],
  ok:1, why:"Es la estrategia <code>linear</code>, la predeterminada. Existe la estrategia <code>free</code> para que cada host avance a su ritmo."}
]},

/* =============== U3 L2 =============== */
{
id:"an2l3",
titulo:"Módulos esenciales: paquetes, servicios y usuarios",
claves:["package, apt y dnf: state present, latest o absent; update_cache y cache_valid_time","service y systemd_service: state started, stopped, restarted o reloaded, enabled y daemon_reload","user, group y authorized_key para cuentas; firewalld y reboot completan el día a día"],
pasos:[
 {t:"info", eti:"La caja de herramientas", h:"Módulos que usarás siempre",
  c:`<div class="termbox">- ansible.builtin.apt:     { name: [nginx, git], state: present, update_cache: true, cache_valid_time: 3600 }
- ansible.builtin.dnf:     { name: httpd, state: latest }
- ansible.builtin.package: { name: chrony, state: present }       # usa el gestor que tenga el nodo
- ansible.builtin.group:   { name: docker, state: present }
- ansible.builtin.user:    { name: despliegue, groups: docker, append: true, shell: /bin/bash }
- ansible.posix.authorized_key: { user: despliegue, key: "{{ lookup('file', 'claves/ana.pub') }}" }
- ansible.builtin.systemd_service: { name: nginx, state: started, enabled: true, daemon_reload: true }
- ansible.posix.firewalld: { service: https, permanent: true, immediate: true, state: enabled }
- ansible.builtin.reboot:  { reboot_timeout: 600 }                # reinicia y espera a que vuelva</div>
     <p><code>systemd</code> es el nombre antiguo de <code>systemd_service</code> y sigue funcionando como alias. <code>cache_valid_time</code> evita hacer <code>apt update</code> en cada ejecución si la caché es reciente.</p>`},
 {t:"par", p:"Empareja cada necesidad con el módulo",
  pares:[["Instalar paquetes en Debian/Ubuntu","apt"],["Arrancar y habilitar un servicio","systemd_service"],["Añadir una clave pública SSH a un usuario","authorized_key"],["Abrir un servicio en el cortafuegos de RHEL","firewalld"],["Reiniciar el servidor y esperar a que vuelva","reboot"],["Crear un usuario del sistema","user"]],
  why:"Un módulo describe el estado deseado; command describe una acción."},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>state: present</code> y <code>state: latest</code> en apt?",
  ops:["Ninguna","present instala si falta y no toca una versión ya instalada; latest además actualiza a la última disponible en cada ejecución","latest desinstala las versiones viejas del disco","present solo funciona en RHEL"],
  ok:1, why:"latest hace que el resultado dependa del día en que ejecutas: en producción suele preferirse present (o fijar la versión: <code>name: nginx=1.24*</code>)."},
 {t:"hueco", p:"Añade al usuario <code>ana</code> al grupo <code>docker</code> <b>sin quitarle</b> los grupos que ya tiene",
  tpl:`- name: Ana en el grupo docker
  ansible.builtin.user:
    name: ana
    ___: docker
    ___: true`,
  banco:["groups","append","group","merge","keep"],
  sol:["groups","append"],
  why:"Sin <code>append: true</code>, <code>groups</code> sustituye la lista entera: Ana perdería, por ejemplo, el grupo sudo."},
 {t:"opcion", p:"¿Por qué evitar <code>shell: apt-get install -y nginx</code>?",
  ops:["Porque no funciona","Siempre marca «changed», no es idempotente ni portable y no informa bien de errores; el módulo apt sí","Porque es más rápido","Porque Ansible lo prohíbe"],
  ok:1, why:"ansible-lint avisa de este patrón (<code>command-instead-of-module</code>)."},
 {t:"term", p:"Reinicia el servicio <code>nginx</code> en el grupo <code>web</code> con un comando ad hoc y privilegios",
  prompt:"pablo@control:~/infra$", sol:["ansible web -b -m service -a \"name=nginx state=restarted\"","ansible web -b -m ansible.builtin.service -a \"name=nginx state=restarted\"","ansible web -m service -a \"name=nginx state=restarted\" -b","ansible web -b -m systemd_service -a \"name=nginx state=restarted\"","ansible web -b -m ansible.builtin.systemd_service -a \"name=nginx state=restarted\""],
  pista:"-m service con name y state=restarted.",
  salida:`web1.catappa.dev | CHANGED => {"changed": true, "name": "nginx", "state": "started", ...}
web2.catappa.dev | CHANGED => {"changed": true, "name": "nginx", "state": "started", ...}`,
  why:"<code>restarted</code> siempre cambia algo; <code>reloaded</code> recarga la configuración sin cortar conexiones si el servicio lo admite."},
 {t:"escribe", p:"¿Qué parámetro del módulo <code>systemd_service</code> equivale a ejecutar <code>systemctl daemon-reload</code> antes de actuar?",
  sol:["daemon_reload","daemon_reload: true"],
  pista:"Se escribe con guion bajo.",
  why:"Imprescindible después de copiar o modificar un fichero de unidad .service."},
 {t:"vf", p:"El módulo <code>ansible.builtin.package</code> sirve para instalar un paquete sin saber si el nodo usa apt o dnf.",
  ok:true, why:"Delega en el gestor del sistema. Pero ojo: el nombre del paquete puede cambiar entre distribuciones (apache2 frente a httpd)."}
]},

/* =============== U3 L3 =============== */
{
id:"an3n1",
titulo:"Ficheros: copy, file, lineinfile y compañía",
claves:["file crea directorios, enlaces y permisos; copy copia o escribe contenido; fetch trae ficheros del nodo","lineinfile para una línea, blockinfile para un bloque, template para el fichero entero","validate comprueba el fichero antes de ponerlo en su sitio; backup guarda el anterior"],
pasos:[
 {t:"info", eti:"Ficheros", h:"Un módulo para cada caso",
  c:`<div class="termbox">- ansible.builtin.file:   { path: /opt/app, state: directory, owner: app, group: app, mode: "0755" }
- ansible.builtin.file:   { src: /opt/app/v1.4, dest: /opt/app/actual, state: link }
- ansible.builtin.copy:   { src: files/app.env, dest: /opt/app/.env, mode: "0600", backup: true }
- ansible.builtin.copy:   { content: "Servidor gestionado por Ansible\n", dest: /etc/motd }
- ansible.builtin.get_url: { url: https://ejemplo.dev/app.tar.gz, dest: /tmp/app.tar.gz, checksum: "sha256:9f86d0…" }
- ansible.builtin.unarchive: { src: /tmp/app.tar.gz, dest: /opt/app, remote_src: true }
- ansible.builtin.stat:   { path: /etc/app.conf }       # consultar: existe, tamaño, permisos
- ansible.builtin.fetch:  { src: /var/log/app.log, dest: logs/ }   # del nodo a la máquina de control</div>
     <p><code>file</code> con <code>state: absent</code> borra; con <code>touch</code> crea vacío. <code>remote_src: true</code> significa «el origen ya está en el nodo»; sin él, <code>src</code> se busca en la máquina de control.</p>`},
 {t:"info", eti:"Editar sin romper", h:"lineinfile, blockinfile, replace y template",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué módulo según cuánto controlas</div><table class="dg-tabla"><thead><tr><th>Módulo</th><th>Gestiona</th><th>Úsalo cuando</th></tr></thead><tbody>
       <tr><td>lineinfile</td><td>una línea (busca con <code>regexp</code>)</td><td>cambias un ajuste de un fichero que no es tuyo</td></tr>
       <tr><td>blockinfile</td><td>un bloque entre marcas <code># BEGIN/END ANSIBLE MANAGED BLOCK</code></td><td>añades varias líneas juntas</td></tr>
       <tr><td>replace</td><td>todas las coincidencias de una expresión</td><td>sustituyes un patrón repetido</td></tr>
       <tr><td>template</td><td>el fichero completo</td><td>el fichero es tuyo: la opción más predecible</td></tr>
     </tbody></table></div>
     <div class="termbox">- name: Sudo sin contraseña para despliegue
  ansible.builtin.lineinfile:
    path: /etc/sudoers.d/despliegue
    line: "despliegue ALL=(ALL) NOPASSWD: ALL"
    create: true
    mode: "0440"
    validate: /usr/sbin/visudo -cf %s    # si visudo falla, no se toca el fichero</div>
     <div class="nota ojo"><b class="tit">validate salva servidores</b>Un sudoers o un sshd_config roto te deja fuera de la máquina. Con <code>validate</code>, Ansible escribe primero en un temporal (<code>%s</code>), lo comprueba y solo entonces lo mueve a su sitio.</div>`},
 {t:"hueco", p:"Desactiva el acceso por contraseña en SSH comprobando la configuración antes de guardarla",
  tpl:`- name: Sin contraseñas en SSH
  ansible.builtin.lineinfile:
    path: /etc/ssh/sshd_config
    ___: "^#?PasswordAuthentication"
    ___: "PasswordAuthentication no"
    ___: /usr/sbin/sshd -t -f %s`,
  banco:["regexp","line","validate","search","content","check"],
  sol:["regexp","line","validate"],
  why:"La <code>regexp</code> encuentra la línea (comentada o no) y la sustituye por <code>line</code>. Si no hay coincidencia, añade la línea al final."},
 {t:"par", p:"Empareja cada tarea con el módulo más adecuado",
  pares:[["Cambiar un ajuste en /etc/sysctl.conf","lineinfile"],["Generar el nginx.conf entero con variables","template"],["Descargar un binario comprobando su SHA-256","get_url"],["Traer un log del nodo a tu máquina","fetch"],["Crear un enlace simbólico","file"],["Saber si existe un fichero antes de actuar","stat"]],
  why:"Regla práctica: si el fichero es entero tuyo, <code>template</code>; si compartes el fichero con el sistema o con otro equipo, <code>lineinfile</code> o <code>blockinfile</code>."},
 {t:"codigo", p:"Simula <code>lineinfile</code>: lee una expresión regular, la línea deseada y el fichero; imprime el fichero resultante y después <code>changed</code> u <code>ok</code>",
  lenguaje:"py",
  c:`<p>La entrada llega por stdin: la 1.ª línea es la <code>regexp</code>, la 2.ª la <code>line</code> deseada y el resto, el fichero. Reglas (como el módulo real): si alguna línea cumple la regexp (<code>re.search</code>), se sustituye la <b>última</b> que la cumple; si ninguna la cumple, la línea se añade al final. Imprime cada línea del resultado y, al final, <code>changed</code> si el fichero cambió u <code>ok</code> si quedó igual.</p>`,
  plantilla:"import sys, re\nlineas = sys.stdin.read().splitlines()\nregexp, linea, fichero = lineas[0], lineas[1], lineas[2:]\n# imprime el fichero resultante y después changed u ok\n",
  pruebas:[
   {entrada:"^PasswordAuthentication\nPasswordAuthentication no\nPort 22\nPasswordAuthentication yes\nUsePAM yes", salida:"Port 22\nPasswordAuthentication no\nUsePAM yes\nchanged"},
   {entrada:"^PasswordAuthentication\nPasswordAuthentication no\nPort 22\nPasswordAuthentication no", salida:"Port 22\nPasswordAuthentication no\nok"},
   {entrada:"^MaxAuthTries\nMaxAuthTries 3\nPort 22\nUsePAM yes", salida:"Port 22\nUsePAM yes\nMaxAuthTries 3\nchanged", oculta:true},
   {entrada:"^#?PermitRootLogin\nPermitRootLogin no\n#PermitRootLogin yes\nPort 22\nPermitRootLogin yes", salida:"#PermitRootLogin yes\nPort 22\nPermitRootLogin no\nchanged", oculta:true}
  ],
  pista:"Busca los índices de las líneas que cumplen la regexp; si hay alguno, sustituye el último; si no, añade. Compara la lista nueva con la original.",
  solucion:"import sys, re\nlineas = sys.stdin.read().splitlines()\nregexp, linea, fichero = lineas[0], lineas[1], lineas[2:]\nnuevo = list(fichero)\nindices = [i for i, l in enumerate(fichero) if re.search(regexp, l)]\nif indices:\n    nuevo[indices[-1]] = linea\nelse:\n    nuevo.append(linea)\nfor l in nuevo:\n    print(l)\nprint(\"changed\" if nuevo != fichero else \"ok\")",
  why:"Esa comparación final es la idempotencia: el módulo solo escribe (y solo informa de cambio) si el resultado difiere de lo que ya había."},
 {t:"opcion", p:"Usas <code>copy</code> con <code>src: files/app.conf</code> y Ansible dice «Could not find or access 'files/app.conf'», aunque el fichero existe en el nodo. ¿Qué pasa?",
  ops:["El nodo no tiene Python","src se busca en la máquina de control; si el fichero ya está en el nodo, hace falta remote_src: true","Falta become","copy no admite rutas relativas"],
  ok:1, why:"Por defecto, <code>copy</code>, <code>template</code> y <code>unarchive</code> llevan el fichero desde la máquina de control al nodo."},
 {t:"vf", p:"Si dos tareas usan <code>lineinfile</code> sobre el mismo fichero con la misma <code>regexp</code> pero distinta <code>line</code>, cada ejecución las verá como cambio.",
  ok:true, why:"Una deja el valor A y la otra lo pisa con B: nunca converge. Es un fallo de idempotencia típico cuando dos roles gestionan el mismo fichero."}
]},

/* =============== U3 L4 =============== */
{
id:"an3n2",
titulo:"command, shell e idempotencia de verdad",
claves:["command y shell siempre dicen changed: se corrigen con creates, removes o changed_when","changed_when: false para consultas; changed_when con una condición sobre la salida para acciones","failed_when define qué es un fallo cuando el código de salida no basta"],
pasos:[
 {t:"info", eti:"Cuando no hay módulo", h:"Domar command y shell",
  c:`<div class="termbox">- name: Inicializar la base de datos una sola vez
  ansible.builtin.command:
    cmd: /opt/app/bin/init-db
    creates: /var/lib/app/.inicializada    # si existe, no se ejecuta

- name: Consultar la versión de Java
  ansible.builtin.command: java -version
  register: java
  changed_when: false                     # una consulta nunca cambia nada

- name: Crear el usuario de la aplicación en la BD
  ansible.builtin.command: /opt/app/bin/crear-usuario app
  register: r
  changed_when: "'creado' in r.stdout"      # cambió solo si lo dice la salida
  failed_when: r.rc not in [0, 3]           # 3 = «ya existía», no es error

- name: Compilar en su directorio
  ansible.builtin.command:
    cmd: make install
    chdir: /opt/src/herramienta</div>
     <p>Una tarea que siempre dice <b>changed</b> tiene dos costes: mientes en el informe (nadie sabe qué cambió de verdad) y disparas handlers sin motivo (reinicios innecesarios).</p>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["creates: /ruta","No ejecutar si esa ruta ya existe"],["removes: /ruta","Ejecutar solo si esa ruta existe"],["changed_when: false","La tarea nunca se marca como cambio"],["failed_when: r.rc not in [0, 3]","Solo es fallo con códigos distintos de 0 y 3"],["chdir: /opt/src","Ejecutar el comando dentro de ese directorio"]],
  why:"Con estas cinco opciones casi cualquier comando se vuelve idempotente y honesto."},
 {t:"hueco", p:"La tarea solo consulta el estado de un clúster: haz que nunca cuente como cambio y guarda su salida",
  tpl:`- name: Estado del clúster
  ansible.builtin.command: pg_lsclusters
  ___: estado
  ___: false`,
  banco:["register","changed_when","failed_when","creates","save","ignore"],
  sol:["register","changed_when"],
  why:"<code>register</code> guarda el resultado (stdout, stderr, rc…) para usarlo después; <code>changed_when: false</code> lo hace honesto."},
 {t:"term", p:"Ejecutas <code>sitio.yml</code> por segunda vez sin cambiar nada. Hazlo para ver si es idempotente",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml","ansible-playbook -i inventario.ini sitio.yml"],
  pista:"Lánzalo igual que la primera vez.",
  salida:`TASK [Instalar paquetes] *****************************
ok: [web1.catappa.dev]
TASK [Descargar dependencias] ************************
changed: [web1.catappa.dev]
RUNNING HANDLER [Reiniciar app] **********************
changed: [web1.catappa.dev]
PLAY RECAP *******************************************
web1.catappa.dev : ok=6 changed=2 unreachable=0 failed=0`,
  why:"Suspenso: «Descargar dependencias» (seguramente un shell) cambia en cada ejecución y, de rebote, reinicia la app. Arréglalo con <code>creates</code> o <code>changed_when</code> y el handler dejará de dispararse."},
 {t:"opcion", p:"Un script devuelve código 0 siempre, pero escribe «ERROR» en la salida cuando algo va mal. ¿Cómo haces que Ansible lo detecte?",
  ops:["ignore_errors: true","register y failed_when: \"'ERROR' in r.stdout\"","changed_when: true","No se puede"],
  ok:1, why:"<code>failed_when</code> sustituye la regla por defecto (rc distinto de 0) por la que tú definas."},
 {t:"escribe", p:"¿Qué opción de <code>command</code> hace que el comando no se ejecute si un fichero ya existe?",
  sol:["creates","creates:"],
  pista:"Lo contrario sería removes.",
  why:"Es la forma más simple de idempotencia para instaladores y scripts de «una sola vez»: el script crea un fichero marcador al terminar."},
 {t:"vf", p:"<code>changed_when: false</code> es buena idea en cualquier tarea que dé problemas de idempotencia, también en las que modifican el sistema.",
  ok:false, why:"Eso esconde cambios reales y rompe los handlers. En tareas que modifican algo, define la condición de verdad (<code>creates</code>, una comprobación previa o la salida del comando)."},
 {t:"orden", p:"Ordena de más preferible a menos preferible para hacer algo con Ansible",
  items:["Un módulo específico (apt, user, lineinfile…)","Un módulo de una colección certificada o de la comunidad","command con creates, removes o changed_when","shell con changed_when, solo si necesitas tuberías o redirecciones"],
  why:"Cuanto más arriba, más idempotencia, mejor soporte de <code>--check</code> y mejor informe de errores."}
]},

/* =============== U3 L5 =============== */
{
id:"an2l2",
titulo:"Leer la salida y depurar",
claves:["PLAY RECAP resume ok, changed, failed, unreachable, skipped y rescued por servidor","-v a -vvvv para más detalle; --list-tasks, --start-at-task y --step para depurar","register y debug para ver valores durante la ejecución"],
pasos:[
 {t:"info", eti:"Resultados", h:"El resumen",
  c:`<div class="termbox">PLAY RECAP *****************************************************
web1.catappa.dev : ok=5  changed=2  unreachable=0  failed=0  skipped=1  rescued=0  ignored=0
web2.catappa.dev : ok=2  changed=0  unreachable=1  failed=0  skipped=0  rescued=0  ignored=0</div>
     <div class="termbox">- name: Ver la versión de nginx
  ansible.builtin.command: nginx -v
  register: version
  changed_when: false             # solo consulta: nunca es un cambio

- ansible.builtin.debug:
    var: version.stderr           # nginx -v escribe en stderr

- ansible.builtin.debug:
    msg: "web1 tiene {{ ansible_facts['memtotal_mb'] }} MB"</div>
     <p>Para ver los resultados en YAML legible en vez de JSON, pon <code>callback_result_format = yaml</code> en la sección <code>[defaults]</code> del ansible.cfg.</p>`},
 {t:"par", p:"Empareja cada estado con su significado",
  pares:[["ok","La tarea no necesitaba cambios"],["changed","La tarea modificó algo"],["failed","La tarea falló"],["unreachable","No se pudo conectar al servidor"],["skipped","La tarea no se ejecutó por una condición"],["rescued","Falló, pero un bloque rescue lo recogió"]],
  why:"unreachable suele ser SSH: claves, usuario, red o cortafuegos."},
 {t:"info", eti:"Herramientas", h:"Depurar un playbook",
  c:`<div class="termbox">ansible-playbook sitio.yml --list-tasks                 # qué tareas hay, sin ejecutar
ansible-playbook sitio.yml --list-hosts                 # a qué hosts afecta
ansible-playbook sitio.yml --start-at-task "Configurar el sitio"   # empezar por ahí
ansible-playbook sitio.yml --step                       # preguntar antes de cada tarea
ansible-playbook sitio.yml -vvv                         # detalle de cada módulo
ansible-playbook sitio.yml -vvvv                        # además, la conexión SSH</div>
     <p>Con <code>-v</code> ves el resultado completo de cada tarea; con <code>-vvv</code> también qué fichero de configuración y qué rutas usa; con <code>-vvvv</code>, el comando SSH exacto (útil para los <i>unreachable</i>).</p>`},
 {t:"term", p:"Muestra la lista de tareas del playbook <code>sitio.yml</code> sin ejecutarlas",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml --list-tasks","ansible-playbook --list-tasks sitio.yml","ansible-playbook -i inventario.ini sitio.yml --list-tasks"],
  pista:"ansible-playbook con la opción que lista tareas.",
  salida:`playbook: sitio.yml

  play #1 (web): Configurar servidores web	TAGS: []
    tasks:
      Instalar nginx	TAGS: []
      Copiar la configuración del sitio	TAGS: []
      Asegurar que nginx arranca con el sistema	TAGS: []`,
  why:"Muy útil con roles: ves en qué orden se ejecutará todo antes de lanzarlo."},
 {t:"hueco", p:"Guarda el resultado de la consulta y muéstralo por pantalla",
  tpl:`- name: Espacio libre
  ansible.builtin.command: df -h /
  ___: disco
  changed_when: false

- name: Enseñarlo
  ansible.builtin.debug:
    ___: disco.stdout_lines`,
  banco:["register","var","msg","save","output","print"],
  sol:["register","var"],
  why:"<code>var</code> recibe el nombre de una variable (sin llaves); <code>msg</code> recibe un texto donde sí usas <code>{{ }}</code>."},
 {t:"opcion", p:"Un servidor aparece como <code>unreachable</code>. ¿Qué revisas primero?",
  ops:["El playbook","La conexión SSH: host, usuario, clave, puerto 22 y grupos de seguridad","El módulo apt","La versión de Ansible"],
  ok:1, why:"Prueba con ssh usuario@host o ansible host -m ping -vvvv."},
 {t:"escribe", p:"El playbook falló en la tarea 14 de 20. ¿Qué opción de ansible-playbook usas para empezar directamente en ella? (solo el nombre de la opción)",
  sol:["--start-at-task","start-at-task"],
  pista:"Empieza en una tarea concreta, por su nombre.",
  why:"Por eso cada tarea debe tener un <code>name</code> único y claro: se usa para depurar, en los informes y en <code>--start-at-task</code>."},
 {t:"vf", p:"<code>debug</code> con <code>var: version.stderr</code> y <code>msg: \"{{ version.stderr }}\"</code> muestran lo mismo, aunque con distinto formato.",
  ok:true, why:"<code>var</code> recibe directamente el nombre de la variable, sin llaves; <code>msg</code> es un texto con plantilla, donde las llaves sí hacen falta."}
]}

]});
