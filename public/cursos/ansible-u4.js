window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Variables y facts",
resumen: "Dónde se definen las variables, la precedencia que de verdad importa, los facts del sistema, register, set_fact y las variables mágicas",
nivel: "Intermedio",
color: "#e45f5f",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"an3l1",
titulo:"Variables: dónde se definen y cómo se usan",
claves:["Variables en group_vars, host_vars, vars y vars_files del play, y -e en la línea de comandos","Se usan con {{ variable }}; en diccionarios, app.puerto o app['puerto']","Nombres con letras, números y guion bajo: nunca guiones ni palabras reservadas"],
pasos:[
 {t:"info", eti:"Parametrizar", h:"Dónde viven las variables",
  c:`<div class="dg dg-arbol"><div class="dg-tit">variables en un proyecto</div><div class="rama" style="--n:0"><span class="nom carpeta">infra/</span></div><div class="rama" style="--n:1"><span class="nom">inventario.ini</span></div><div class="rama" style="--n:1"><span class="nom carpeta">group_vars/</span></div><div class="rama" style="--n:2"><span class="nom">all.yml</span><span class="coment">zona_horaria: Europe/Madrid</span></div><div class="rama" style="--n:2"><span class="nom carpeta">web/</span><span class="coment">también vale un directorio con varios ficheros</span></div><div class="rama" style="--n:3"><span class="nom">vars.yml</span><span class="coment">puerto_api: 8080</span></div><div class="rama" style="--n:3"><span class="nom">vault.yml</span><span class="coment">secretos cifrados</span></div><div class="rama" style="--n:1"><span class="nom carpeta">host_vars/</span></div><div class="rama" style="--n:2"><span class="nom">web1.catappa.dev.yml</span></div><div class="rama" style="--n:1"><span class="nom">sitio.yml</span></div></div>
     <div class="termbox">- name: Desplegar la API
  hosts: web
  vars:
    app:
      nombre: tareas
      puerto: 8080
  vars_files:
    - vars/comun.yml
  tasks:
    - ansible.builtin.debug:
        msg: "{{ app.nombre }} escucha en {{ app['puerto'] }}"

ansible-playbook sitio.yml -e "version=1.4.0"        # extra vars
ansible-playbook sitio.yml -e @despliegue.yml        # extra vars desde un fichero</div>`},
 {t:"par", p:"Empareja cada ubicación de variables con su ámbito",
  pares:[["group_vars/web.yml","Todos los servidores del grupo web"],["host_vars/web1.yml","Solo ese servidor"],["vars: en el play","Solo ese play"],["-e \"version=1.4.0\"","Línea de comandos: máxima prioridad"],["ansible_facts","Datos recogidos automáticamente del servidor"]],
  why:"Las variables extra (-e) ganan a todo: útiles en pipelines."},
 {t:"hueco", p:"Carga las variables del fichero <code>vars/web.yml</code> en el play y úsalas en un mensaje",
  tpl:`- hosts: web
  ___:
    - vars/web.yml
  tasks:
    - ansible.builtin.debug:
        msg: "Dominio: ___ dominio }}"`,
  banco:["vars_files","{{","include_vars","{%","vars","$("],
  sol:["vars_files","{{"],
  why:"<code>vars_files</code> carga ficheros al empezar el play; <code>include_vars</code> es una tarea que los carga en mitad de la ejecución (por ejemplo, según la distribución)."},
 {t:"term", p:"Lanza <code>despliegue.yml</code> pasando la variable <code>version</code> con valor <code>2.1.0</code> desde la línea de comandos",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook despliegue.yml -e version=2.1.0","ansible-playbook despliegue.yml -e \"version=2.1.0\"","ansible-playbook despliegue.yml --extra-vars version=2.1.0","ansible-playbook despliegue.yml --extra-vars \"version=2.1.0\"","ansible-playbook -e version=2.1.0 despliegue.yml"],
  pista:"-e o --extra-vars.",
  salida:`TASK [Descargar la versión 2.1.0] *****
changed: [web1.catappa.dev]`,
  why:"Con <code>clave=valor</code> todo llega como texto; para pasar números, listas o booleanos de verdad usa JSON (<code>-e '{\"replicas\": 3}'</code>) o un fichero con <code>-e @fichero.yml</code>."},
 {t:"escribe", p:"¿Cuál de estos nombres de variable NO es válido en Ansible: <code>puerto_api</code>, <code>puerto-api</code>, <code>puerto2</code>?",
  sol:["puerto-api"],
  pista:"Piensa en qué significa el guion en una expresión.",
  why:"En Jinja2, <code>puerto-api</code> se leería como «puerto menos api». Usa siempre guion bajo."},
 {t:"opcion", p:"Tienes <code>app: { puerto: 8080 }</code>. ¿Cuál de estas expresiones NO devuelve 8080?",
  ops:["{{ app.puerto }}","{{ app['puerto'] }}","{{ app[puerto] }}","{{ app.get('puerto') }}"],
  ok:2, why:"Sin comillas, <code>app[puerto]</code> busca una variable llamada <code>puerto</code> y usa su valor como clave. Los corchetes son obligatorios si la clave tiene caracteres raros o coincide con un método (<code>app['items']</code>)."},
 {t:"vf", p:"Un fichero de <code>group_vars/</code> debe llamarse exactamente como el grupo (o ser un directorio con ese nombre) para que se cargue.",
  ok:true, why:"<code>group_vars/web.yml</code> o <code>group_vars/web/*.yml</code> para el grupo web; <code>all</code> para todos. Un error tipográfico en el nombre hace que se ignore en silencio."}
]},

/* =============== U4 L2 =============== */
{
id:"an3l3",
titulo:"Precedencia de variables",
claves:["Hay 22 niveles de precedencia; -e (extra vars) siempre gana y los defaults del rol siempre pierden","host_vars gana a group_vars; un grupo hijo gana a su padre; all es el más débil","vars/ de un rol gana al inventario: pon ahí solo lo que no se debe sobrescribir"],
pasos:[
 {t:"info", eti:"¿Qué valor gana?", h:"La escala que importa",
  c:`<div class="dg"><div class="dg-tit">de menos a más prioridad (simplificado)</div>
       <div class="dg-vert">
         <div class="dg-caja base">defaults/ del rol<small>pensado para ser sobrescrito</small></div>
         <div class="dg-caja">group_vars/all</div>
         <div class="dg-caja">group_vars/&lt;grupo&gt;<small>el grupo hijo gana al padre</small></div>
         <div class="dg-caja">host_vars/&lt;host&gt;</div>
         <div class="dg-caja">facts del host</div>
         <div class="dg-caja">vars y vars_files del play</div>
         <div class="dg-caja aviso">vars/ del rol<small>gana al inventario: la trampa habitual</small></div>
         <div class="dg-caja">vars de bloque y de tarea, include_vars</div>
         <div class="dg-caja">set_fact y register</div>
         <div class="dg-caja acento">-e en la línea de comandos<small>siempre gana</small></div>
       </div></div>
     <p>Regla práctica: <b>valores por defecto en <code>defaults/</code> del rol, valores de cada entorno en <code>group_vars</code> del inventario</b>, y <code>-e</code> solo para lo que decide quien lanza (la versión a desplegar).</p>`},
 {t:"orden", p:"Ordena de MENOR a MAYOR prioridad",
  items:["defaults/ del rol","group_vars/all","group_vars del grupo concreto","host_vars del host","Variables extra con -e"],
  why:"Regla práctica: pon los valores por defecto en defaults del rol y sobrescribe en group_vars."},
 {t:"opcion", p:"<code>puerto_app</code> vale 8080 en group_vars/web.yml y 9090 en host_vars/web1.yml. ¿Qué valor tiene en web1?",
  ops:["8080","9090","Da error por conflicto","El primero que se lea"],
  ok:1, why:"host_vars es más específico que group_vars."},
 {t:"opcion", p:"Un rol define <code>nginx_workers: 4</code> en <code>roles/nginx/vars/main.yml</code>. Pones <code>nginx_workers: 16</code> en group_vars/web.yml y sigue saliendo 4. ¿Por qué?",
  ops:["group_vars no se cargó","vars/ del rol tiene más prioridad que el inventario; ese valor debería estar en defaults/","Hay que reiniciar Ansible","Los números no se sobrescriben"],
  ok:1, why:"Es el error más común con roles de terceros. Mueve el valor a <code>defaults/main.yml</code> si quieres que sea configurable."},
 {t:"term", p:"Muestra todas las variables de inventario que recibe el host <code>web1.catappa.dev</code> ya resueltas",
  prompt:"pablo@control:~/infra$", sol:["ansible-inventory --host web1.catappa.dev","ansible-inventory -i inventario.ini --host web1.catappa.dev"],
  pista:"ansible-inventory con --host.",
  salida:`{
    "ansible_user": "despliegue",
    "dominio": "catappa.dev",
    "puerto_app": 9090,
    "zona_horaria": "Europe/Madrid"
}`,
  why:"Enseña el resultado de mezclar inventario, group_vars y host_vars. No incluye vars de roles ni del play: para esas, una tarea <code>debug</code>."},
 {t:"codigo", p:"Resuelve la precedencia: lee definiciones <code>nivel nombre=valor</code> e imprime el valor final de cada variable, ordenadas por nombre",
  lenguaje:"py",
  c:`<p>Niveles de menor a mayor prioridad: <code>role_defaults</code>, <code>group_all</code>, <code>group</code>, <code>host</code>, <code>play</code>, <code>role_vars</code>, <code>set_fact</code>, <code>extra</code>. Cada línea de la entrada es una definición; gana la del nivel más alto. Si el mismo nivel define dos veces la variable, gana la última. Imprime <code>nombre=valor</code> por orden alfabético del nombre.</p>`,
  plantilla:"import sys\nNIVELES = [\"role_defaults\", \"group_all\", \"group\", \"host\", \"play\", \"role_vars\", \"set_fact\", \"extra\"]\nfor linea in sys.stdin.read().splitlines():\n    nivel, asignacion = linea.split(\" \", 1)\n    nombre, valor = asignacion.split(\"=\", 1)\n    # tu código\n",
  pruebas:[
   {entrada:"role_defaults puerto=80\ngroup puerto=8080\nhost puerto=9090", salida:"puerto=9090"},
   {entrada:"extra version=2.0\nplay version=1.0\ngroup_all zona=UTC\nhost zona=Europe/Madrid", salida:"version=2.0\nzona=Europe/Madrid"},
   {entrada:"role_vars workers=4\ngroup workers=16\nrole_defaults usuario=www\nset_fact usuario=app\nextra usuario=root", salida:"usuario=root\nworkers=4", oculta:true},
   {entrada:"group a=1\ngroup a=2\nrole_defaults b=x", salida:"a=2\nb=x", oculta:true}
  ],
  pista:"Guarda para cada nombre (nivel, valor) y sustituye si el nivel nuevo es mayor o igual: NIVELES.index(nivel).",
  solucion:"import sys\nNIVELES = [\"role_defaults\", \"group_all\", \"group\", \"host\", \"play\", \"role_vars\", \"set_fact\", \"extra\"]\nfinal = {}\nfor linea in sys.stdin.read().splitlines():\n    nivel, asignacion = linea.split(\" \", 1)\n    nombre, valor = asignacion.split(\"=\", 1)\n    p = NIVELES.index(nivel)\n    if nombre not in final or p >= final[nombre][0]:\n        final[nombre] = (p, valor)\nfor nombre in sorted(final):\n    print(nombre + \"=\" + final[nombre][1])",
  why:"Ansible hace esto mismo al preparar cada tarea: junta todas las fuentes y se queda con la de mayor prioridad. Fíjate en el tercer caso: role_vars gana a group."},
 {t:"vf", p:"Un <code>set_fact</code> puede sobrescribir un valor pasado con <code>-e</code>.",
  ok:false, why:"Las extra vars ganan siempre, incluso a set_fact. Por eso no conviene usar -e para valores que el playbook necesita recalcular."}
]},

/* =============== U4 L3 =============== */
{
id:"an4n1",
titulo:"Facts: lo que Ansible sabe de cada host",
claves:["gather_facts ejecuta setup al empezar el play: sistema, red, discos, memoria","Se leen en ansible_facts['distribution']; gather_subset o gather_facts: false para ir más rápido","Facts propios en /etc/ansible/facts.d y caché de facts entre ejecuciones"],
pasos:[
 {t:"info", eti:"Descubrir", h:"Facts",
  c:`<p>Al empezar cada play, Ansible ejecuta el módulo <code>setup</code> en cada host (la tarea «Gathering Facts») y guarda cientos de datos: distribución, versión, IPs, interfaces, discos, memoria, CPU…</p>
     <div class="termbox">- name: Mostrar datos del host
  ansible.builtin.debug:
    msg: &gt;-
      {{ ansible_facts['hostname'] }} es {{ ansible_facts['distribution'] }}
      {{ ansible_facts['distribution_major_version'] }} con
      {{ ansible_facts['memtotal_mb'] }} MB y la IP {{ ansible_facts['default_ipv4']['address'] }}</div>
     <p>La forma recomendada es <code>ansible_facts['distribution']</code>. Los mismos datos existen también como variables sueltas (<code>ansible_distribution</code>), pero eso depende de la opción <code>inject_facts_as_vars</code> y las versiones recientes de ansible-core avisan de que dejarán de ser el comportamiento por defecto.</p>`},
 {t:"par", p:"Empareja cada fact con lo que contiene",
  pares:[["ansible_facts['os_family']","Familia: Debian, RedHat, Suse…"],["ansible_facts['distribution_major_version']","Versión principal: 9, 24…"],["ansible_facts['default_ipv4']['address']","IP de la interfaz con la ruta por defecto"],["ansible_facts['processor_vcpus']","Número de CPU virtuales"],["ansible_facts['mounts']","Sistemas de ficheros montados"]],
  why:"Explóralos con <code>ansible host -m setup</code> y filtra con <code>-a \"filter=...\"</code>."},
 {t:"term", p:"Consulta en todos los hosts los facts cuyo nombre empieza por <code>ansible_distribution</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible all -m setup -a \"filter=ansible_distribution*\"","ansible all -m ansible.builtin.setup -a \"filter=ansible_distribution*\"","ansible all -m setup -a filter=ansible_distribution*"],
  pista:"-m setup con filter y un comodín.",
  salida:`web1.catappa.dev | SUCCESS => {
    "ansible_facts": {
        "ansible_distribution": "Ubuntu",
        "ansible_distribution_file_variety": "Debian",
        "ansible_distribution_major_version": "24",
        "ansible_distribution_release": "noble",
        "ansible_distribution_version": "24.04"
    },
    "changed": false
}`,
  why:"En la salida de setup los nombres llevan el prefijo <code>ansible_</code>; dentro de <code>ansible_facts</code> en un playbook, sin él."},
 {t:"info", eti:"Rendimiento y extras", h:"Controlar la recogida de facts",
  c:`<div class="termbox">- hosts: web
  gather_facts: false            # no recoger: más rápido si no los usas
- hosts: bd
  gather_subset: [network, hardware]   # solo una parte

# ansible.cfg: guardar facts entre ejecuciones
[defaults]
fact_caching = jsonfile
fact_caching_connection = /tmp/facts_cache
fact_caching_timeout = 7200</div>
     <p><b>Facts locales</b>: cualquier fichero <code>/etc/ansible/facts.d/*.fact</code> del nodo (INI o JSON, o un ejecutable que imprima JSON) aparece en <code>ansible_facts['ansible_local']</code>. Útil para que el servidor «recuerde» cosas: qué versión de la app tiene, a qué equipo pertenece.</p>`},
 {t:"hueco", p:"Instala el paquete solo en la familia RedHat, leyendo el fact correcto",
  tpl:`- name: Instalar chrony en RHEL y derivados
  ansible.builtin.dnf:
    name: chrony
  when: ___['os_family'] == "___"`,
  banco:["ansible_facts","RedHat","hostvars","Rhel","facts","Debian"],
  sol:["ansible_facts","RedHat"],
  why:"os_family agrupa RHEL, Rocky, AlmaLinux, CentOS Stream y Fedora bajo <code>RedHat</code>."},
 {t:"opcion", p:"Pones <code>gather_facts: false</code> para acelerar y una plantilla falla con «'dict object' has no attribute 'default_ipv4'». ¿Qué pasa?",
  ops:["La plantilla está mal escrita","La plantilla usa facts que ya no se recogen; o los vuelves a recoger o ejecutas setup con el subset necesario","Falta become","Hay que reiniciar el nodo"],
  ok:1, why:"Sin facts, <code>ansible_facts</code> está casi vacío. Puedes recogerlos más tarde con una tarea <code>ansible.builtin.setup</code> filtrada."},
 {t:"escribe", p:"Un fichero <code>/etc/ansible/facts.d/app.fact</code> en el nodo, ¿bajo qué clave de <code>ansible_facts</code> aparece?",
  sol:["ansible_local","ansible_facts['ansible_local']","ansible_local.app"],
  pista:"Son facts «locales».",
  why:"Por ejemplo <code>ansible_facts['ansible_local']['app']['general']['version']</code> para un .fact en formato INI."}
]},

/* =============== U4 L4 =============== */
{
id:"an4n2",
titulo:"register, set_fact y variables mágicas",
claves:["register guarda el resultado de una tarea: rc, stdout, stdout_lines, changed, failed","set_fact crea variables por host durante la ejecución","Variables mágicas: inventory_hostname, groups, group_names, hostvars, ansible_play_hosts"],
pasos:[
 {t:"info", eti:"Resultados", h:"register y set_fact",
  c:`<div class="termbox">- name: Rama desplegada
  ansible.builtin.command: git -C /opt/app rev-parse --abbrev-ref HEAD
  register: rama
  changed_when: false

- name: Calcular la URL de salud
  ansible.builtin.set_fact:
    url_salud: "http://{{ ansible_facts['default_ipv4']['address'] }}:{{ puerto_app }}/salud"
    es_main: "{{ rama.stdout == 'main' }}"</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué hay dentro de un register</div><table class="dg-tabla"><thead><tr><th>Campo</th><th>Contiene</th></tr></thead><tbody>
       <tr><td>rc</td><td>código de salida (command, shell)</td></tr>
       <tr><td>stdout / stdout_lines</td><td>salida como texto / como lista de líneas</td></tr>
       <tr><td>stderr</td><td>salida de error</td></tr>
       <tr><td>changed / failed</td><td>booleanos del resultado</td></tr>
       <tr><td>results</td><td>lista con un resultado por elemento si la tarea tenía <code>loop</code></td></tr>
     </tbody></table></div>`},
 {t:"info", eti:"Mirar a otros hosts", h:"Variables mágicas",
  c:`<div class="termbox">inventory_hostname          # nombre del host actual en el inventario
group_names                 # grupos del host actual
groups['bd']                # lista de hosts del grupo bd
hostvars['bd1.catappa.dev']['ansible_facts']['default_ipv4']['address']   # dato de OTRO host
ansible_play_hosts          # hosts del play que siguen vivos
ansible_check_mode          # true si se ejecuta con --check</div>
     <div class="termbox"># plantilla de la app: apuntar a la base de datos
DB_HOST={{ hostvars[groups['bd'][0]]['ansible_facts']['default_ipv4']['address'] }}</div>
     <div class="nota ojo"><b class="tit">Los facts de otro host deben existir</b>Si el play solo apunta a <code>web</code>, nadie ha recogido los facts de <code>bd1</code> y ese <code>hostvars</code> falla. Solución: un play previo sobre <code>bd</code> (aunque sea solo para recoger facts), <code>delegate_facts</code> o la caché de facts.</div>`},
 {t:"par", p:"Empareja cada variable mágica con su contenido",
  pares:[["inventory_hostname","El nombre del host actual en el inventario"],["group_names","Los grupos a los que pertenece el host actual"],["groups['web']","Todos los hosts del grupo web"],["hostvars","Las variables de cualquier host, por nombre"],["ansible_check_mode","Si la ejecución es un ensayo con --check"]],
  why:"Con ellas una plantilla de balanceador puede listar todos los backends: <code>{% for h in groups['web'] %}</code>."},
 {t:"hueco", p:"Guarda la salida del comando y crea una variable con su primera línea",
  tpl:`- ansible.builtin.command: cat /etc/app/VERSION
  ___: fichero_version
  changed_when: false

- ansible.builtin.___:
    version_actual: "{{ fichero_version.___[0] }}"`,
  banco:["register","set_fact","stdout_lines","stdout","debug","vars"],
  sol:["register","set_fact","stdout_lines"],
  why:"<code>stdout_lines</code> es una lista; <code>stdout</code> es un único texto. <code>fichero_version.stdout[0]</code> daría solo el primer carácter."},
 {t:"opcion", p:"Un play sobre <code>web</code> usa <code>hostvars['bd1']['ansible_facts']['default_ipv4']</code> y falla con «undefined». ¿Solución más limpia?",
  ops:["Escribir la IP a mano en la plantilla","Añadir antes un play sobre bd que recoja sus facts, o usar caché de facts","Poner ignore_errors","Usar gather_facts: false"],
  ok:1, why:"Un play con <code>hosts: bd</code> y <code>gather_facts: true</code> (aunque no tenga tareas) basta para que los facts de bd1 estén disponibles en los plays siguientes."},
 {t:"term", p:"Muestra con un comando ad hoc la variable <code>group_names</code> del host <code>web1.catappa.dev</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible web1.catappa.dev -m debug -a \"var=group_names\"","ansible web1.catappa.dev -m ansible.builtin.debug -a \"var=group_names\"","ansible web1.catappa.dev -m debug -a var=group_names"],
  pista:"El módulo debug también funciona en ad hoc, con var=.",
  salida:`web1.catappa.dev | SUCCESS => {
    "group_names": [
        "produccion",
        "web"
    ]
}`,
  why:"debug se ejecuta en la máquina de control: no toca el nodo, solo evalúa la variable para ese host."},
 {t:"vf", p:"Una variable creada con <code>set_fact</code> en web1 está disponible directamente en web2.",
  ok:false, why:"set_fact es por host. Desde web2 tendrías que leerla con <code>hostvars['web1']['mi_variable']</code>."}
]}

]});
