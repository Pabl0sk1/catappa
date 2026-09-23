window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Roles, colecciones y Galaxy",
resumen: "Empaquetar la automatización en roles reutilizables, import frente a include, colecciones con FQCN y dependencias fijadas en requirements.yml",
nivel: "Avanzado",
color: "#dd5a5a",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"an4l1",
titulo:"Roles: estructura y uso",
claves:["Un rol empaqueta tareas, handlers, plantillas, ficheros y variables por defecto","Los playbooks se vuelven cortos: qué roles aplicar a qué grupos","Orden de un play: pre_tasks, roles, tasks, post_tasks, con handlers al final de cada sección"],
pasos:[
 {t:"info", eti:"Reutilizar", h:"Estructura de un rol",
  c:`<div class="dg dg-arbol"><div class="dg-tit">anatomía de un rol</div><div class="rama" style="--n:0"><span class="nom carpeta">roles/nginx/</span></div><div class="rama" style="--n:1"><span class="nom">tasks/main.yml</span><span class="coment">tareas</span></div><div class="rama" style="--n:1"><span class="nom">handlers/main.yml</span><span class="coment">handlers</span></div><div class="rama" style="--n:1"><span class="nom">templates/sitio.conf.j2</span></div><div class="rama" style="--n:1"><span class="nom carpeta">files/</span></div><div class="rama" style="--n:1"><span class="nom">defaults/main.yml</span><span class="coment">variables por defecto (baja prioridad)</span></div><div class="rama" style="--n:1"><span class="nom">vars/main.yml</span><span class="coment">variables internas (alta prioridad)</span></div><div class="rama" style="--n:1"><span class="nom">meta/main.yml</span><span class="coment">dependencias y metadatos</span></div><div class="rama" style="--n:1"><span class="nom">meta/argument_specs.yml</span><span class="coment">qué variables acepta y de qué tipo</span></div></div>
     <div class="termbox"># sitio.yml
- hosts: web
  become: true
  roles:
    - comun
    - nginx
    - role: app_java
      vars:
        app_java_version: "1.4.0"</div>
     <p>Dentro de un rol no hace falta poner rutas: <code>template: src=sitio.conf.j2</code> busca en <code>templates/</code> del propio rol, y <code>copy: src=x</code> en <code>files/</code>. Ansible busca los roles en <code>roles/</code> junto al playbook y en <code>roles_path</code>.</p>`},
 {t:"par", p:"Empareja cada carpeta del rol con su contenido",
  pares:[["tasks/","Las tareas del rol"],["handlers/","Acciones como reiniciar servicios"],["templates/","Plantillas Jinja2"],["defaults/","Valores por defecto que el usuario puede sobrescribir"],["meta/","Dependencias de otros roles"]],
  why:"defaults tiene la prioridad más baja: pensados para ser sobrescritos."},
 {t:"term", p:"Crea el esqueleto de un rol llamado <code>nginx</code> dentro de <code>roles/</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-galaxy role init roles/nginx","ansible-galaxy init roles/nginx","ansible-galaxy role init --init-path roles nginx"],
  pista:"ansible-galaxy role init con la ruta.",
  salida:`- Role roles/nginx was created successfully`,
  why:"Crea todas las carpetas con su <code>main.yml</code>, un README y hasta un directorio <code>tests/</code>. Borra lo que no uses."},
 {t:"orden", p:"Ordena cómo ejecuta Ansible las secciones de un play",
  items:["pre_tasks (y sus handlers notificados)","roles","tasks","handlers notificados por roles y tasks","post_tasks (y sus handlers notificados)"],
  why:"Los roles van antes que <code>tasks</code> aunque en el fichero los escribas después. <code>pre_tasks</code> es el sitio para sacar un servidor del balanceador antes de tocarlo."},
 {t:"opcion", p:"Publicas un rol para otros equipos. ¿Dónde pones el puerto por defecto, que cada equipo debe poder cambiar?",
  ops:["vars/main.yml","defaults/main.yml","tasks/main.yml, con set_fact","En el README"],
  ok:1, why:"En <code>vars/</code> ganaría incluso a group_vars y nadie podría cambiarlo sin <code>-e</code>. <code>vars/</code> es para constantes internas, como nombres de paquete por distribución."},
 {t:"hueco", p:"Aplica los roles <code>comun</code> y <code>postgresql</code> al grupo <code>bd</code>, pasando una variable al segundo",
  tpl:`- hosts: bd
  become: true
  ___:
    - comun
    - ___: postgresql
      vars:
        postgresql_version: 16`,
  banco:["roles","role","tasks","include","name","import"],
  sol:["roles","role"],
  why:"La forma larga (<code>role:</code> + <code>vars:</code>) permite además <code>when</code> y <code>tags</code> para todo el rol."},
 {t:"vf", p:"Las colecciones de Ansible pueden incluir módulos, roles y plugins.",
  ok:true, why:"Por ejemplo amazon.aws o community.docker. Los roles sueltos de Galaxy siguen existiendo, pero lo actual es distribuir en colecciones."}
]},

/* =============== U7 L2 =============== */
{
id:"an7n1",
titulo:"Roles bien hechos: import, include y argumentos",
claves:["import_* es estático (se resuelve al cargar); include_* es dinámico (se decide al ejecutar)","Solo include admite loop y nombres calculados; import propaga when y tags a cada tarea","Prefijo del rol en sus variables y meta/argument_specs.yml para validarlas"],
pasos:[
 {t:"info", eti:"Estático o dinámico", h:"import frente a include",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">import_* frente a include_*</div><table class="dg-tabla"><thead><tr><th></th><th>import_tasks / import_role</th><th>include_tasks / include_role</th></tr></thead><tbody>
       <tr><td>Cuándo se procesa</td><td>al cargar el playbook</td><td>al llegar a esa tarea</td></tr>
       <tr><td>loop</td><td>no</td><td>sí</td></tr>
       <tr><td>Nombre con variables de host</td><td>no (solo variables ya conocidas)</td><td>sí: <code>"{{ ansible_facts['os_family'] }}.yml"</code></td></tr>
       <tr><td>when y tags</td><td>se copian a cada tarea de dentro</td><td>se aplican a la inclusión, no a las tareas de dentro</td></tr>
       <tr><td>--list-tasks, --start-at-task</td><td>ven las tareas</td><td>no las ven</td></tr>
     </tbody></table></div>
     <div class="termbox"># roles/nginx/tasks/main.yml
- name: Tareas específicas de la distribución
  ansible.builtin.include_tasks: "{{ ansible_facts['os_family'] | lower }}.yml"

- name: Configuración común
  ansible.builtin.import_tasks: configurar.yml

# en un playbook
- ansible.builtin.import_playbook: bd.yml     # los playbooks solo se importan</div>`},
 {t:"par", p:"Empareja cada necesidad con la instrucción",
  pares:[["Repetir un fichero de tareas por cada sitio web","include_tasks con loop"],["Cargar debian.yml o redhat.yml según el host","include_tasks con el fact en el nombre"],["Que --list-tasks muestre todas las tareas","import_tasks"],["Encadenar playbooks completos","import_playbook"],["Aplicar un rol solo en algunas condiciones, en mitad de las tareas","include_role con when"]],
  why:"Regla práctica: <code>import</code> por defecto; <code>include</code> cuando necesitas bucles o decidir en tiempo de ejecución."},
 {t:"hueco", p:"Configura cada sitio de la lista <code>sitios</code> con el mismo fichero de tareas",
  tpl:`- name: Configurar cada sitio
  ansible.builtin.___: sitio.yml
  ___: "{{ sitios }}"
  loop_control:
    loop_var: sitio`,
  banco:["include_tasks","loop","import_tasks","with","tasks","items"],
  sol:["include_tasks","loop"],
  why:"Con <code>import_tasks</code> daría error: los imports no admiten bucles. <code>loop_var</code> evita que el <code>item</code> de dentro de sitio.yml choque."},
 {t:"opcion", p:"Pones <code>when: instalar_extras</code> en un <code>import_tasks</code> cuyo fichero tiene 10 tareas, y la primera cambia esa variable a false. ¿Qué pasa?",
  ops:["Se ejecutan las 10","La condición se copia a cada tarea y se evalúa en cada una: las 9 restantes se saltan","Da error","Solo se ejecuta la primera y se detiene el play"],
  ok:1, why:"Con import, el when viaja a cada tarea. Con include_tasks, la condición se evaluaría una sola vez, al incluir."},
 {t:"info", eti:"Contrato del rol", h:"Variables con prefijo y argument_specs",
  c:`<div class="termbox"># roles/nginx/defaults/main.yml
nginx_puerto: 80
nginx_workers: auto
nginx_sitios: []

# roles/nginx/meta/argument_specs.yml
argument_specs:
  main:
    short_description: Instala y configura Nginx
    options:
      nginx_puerto:
        type: int
        default: 80
      nginx_sitios:
        type: list
        elements: dict
        required: false

# roles/nginx/meta/main.yml
dependencies:
  - role: comun</div>
     <p>Con <code>argument_specs</code>, Ansible valida los argumentos al entrar en el rol y falla con un mensaje claro si alguien pasa <code>nginx_puerto: "ochenta"</code>. El prefijo (<code>nginx_</code>) evita choques: todas las variables de todos los roles viven en el mismo espacio de nombres.</p>`},
 {t:"escribe", p:"¿Qué fichero del rol declara los argumentos que acepta, con su tipo, para que Ansible los valide? (ruta dentro del rol)",
  sol:["meta/argument_specs.yml","meta/argument_specs.yaml","argument_specs.yml"],
  pista:"Está en meta/.",
  why:"También lo usa <code>ansible-doc -t role</code> para documentar el rol."},
 {t:"vf", p:"Un rol que aparece como dependencia de otros dos roles en el mismo play se ejecuta dos veces por defecto.",
  ok:false, why:"Ansible ejecuta cada rol una sola vez por play si se llama con los mismos parámetros, salvo que declare <code>allow_duplicates: true</code> en meta/main.yml."}
]},

/* =============== U7 L3 =============== */
{
id:"an7n2",
titulo:"Colecciones, Galaxy y requirements.yml",
claves:["Una colección agrupa módulos, plugins y roles: namespace.coleccion.modulo (FQCN)","requirements.yml fija las colecciones y roles del proyecto con sus versiones","ansible-galaxy install -r requirements.yml; Galaxy público, Automation Hub y hubs privados"],
pasos:[
 {t:"info", eti:"Contenido reutilizable", h:"Colecciones",
  c:`<p>Desde Ansible 2.10, casi todos los módulos viven en <b>colecciones</b> separadas del motor. Se nombran con el FQCN: <code>community.docker.docker_container</code> es el módulo <code>docker_container</code> de la colección <code>docker</code> del espacio de nombres <code>community</code>.</p>
     <div class="termbox"># requirements.yml
collections:
  - name: community.general
    version: "&gt;=11.0.0,&lt;12.0.0"
  - name: ansible.posix
    version: "2.0.0"
  - name: amazon.aws
  - name: https://github.com/catappa/infra-coleccion.git
    type: git
    version: v1.3.0
roles:
  - name: geerlingguy.docker
    version: "7.4.1"
  - name: interno.bastion
    src: git+https://github.com/catappa/rol-bastion.git
    version: v2.0.1</div>
     <div class="termbox">ansible-galaxy install -r requirements.yml           # roles y colecciones
ansible-galaxy collection install -r requirements.yml -p ./collections
ansible-galaxy collection list                       # qué hay instalado y dónde</div>`},
 {t:"term", p:"Instala todas las colecciones y roles declarados en <code>requirements.yml</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-galaxy install -r requirements.yml","ansible-galaxy install --role-file requirements.yml"],
  pista:"ansible-galaxy install con -r.",
  salida:`Starting galaxy collection install process
Process install dependency map
Starting collection install process
Installing 'community.general:11.4.0' to '/home/pablo/.ansible/collections/ansible_collections/community/general'
Installing 'ansible.posix:2.0.0' to '/home/pablo/.ansible/collections/ansible_collections/ansible/posix'
Starting galaxy role install process
- geerlingguy.docker (7.4.1) was installed successfully`,
  why:"En CI se ejecuta siempre antes de lanzar playbooks: el entorno se reconstruye desde el repositorio."},
 {t:"hueco", p:"Completa el requirements.yml para fijar la colección <code>community.docker</code> a una versión concreta",
  tpl:`___:
  - ___: community.docker
    ___: "4.6.1"`,
  banco:["collections","name","version","roles","src","tag"],
  sol:["collections","name","version"],
  why:"Sin versión, cada instalación trae la última: tu pipeline puede romperse un lunes sin que nadie haya tocado el repositorio."},
 {t:"par", p:"Empareja cada fuente de contenido con su descripción",
  pares:[["Ansible Galaxy","Repositorio público y gratuito de la comunidad"],["Automation Hub","Colecciones certificadas y con soporte de Red Hat"],["Private Automation Hub","Repositorio interno de la empresa"],["Repositorio Git","Colección o rol instalado directamente desde una URL"]],
  why:"Los servidores se configuran en ansible.cfg (<code>[galaxy] server_list</code>) y se consultan en orden."},
 {t:"opcion", p:"En tu portátil el playbook funciona y en CI falla con «couldn't resolve module/action 'community.postgresql.postgresql_db'». ¿Qué falta?",
  ops:["Instalar PostgreSQL en el runner","Instalar la colección en CI con ansible-galaxy install -r requirements.yml (y tenerla declarada allí)","Usar el nombre corto postgresql_db","Añadir become"],
  ok:1, why:"En tu máquina la instalaste a mano en algún momento. requirements.yml hace que el proyecto declare todas sus dependencias."},
 {t:"term", p:"Lista las colecciones instaladas y en qué ruta está cada una",
  prompt:"pablo@control:~/infra$", sol:["ansible-galaxy collection list"],
  pista:"ansible-galaxy collection …",
  salida:`# /home/pablo/.ansible/collections/ansible_collections
Collection        Version
----------------- -------
amazon.aws        10.1.0
ansible.posix     2.0.0
community.general 11.4.0`,
  why:"Si hay dos copias de la misma colección en rutas distintas, gana la primera de <code>collections_path</code>: una fuente clásica de «pero si la tengo actualizada»."},
 {t:"escribe", p:"Escribe el FQCN del módulo <code>copy</code> que viene con ansible-core",
  sol:["ansible.builtin.copy"],
  pista:"namespace.coleccion.modulo; el de ansible-core es ansible.builtin.",
  why:"ansible-lint exige FQCN (regla <code>fqcn</code>) para que nunca haya dudas de qué módulo se ejecuta."},
 {t:"vf", p:"Para crear tu propia colección basta con <code>ansible-galaxy collection init catappa.infra</code>, y se empaqueta con <code>ansible-galaxy collection build</code>.",
  ok:true, why:"El resultado es un .tar.gz que se publica en Galaxy o en un hub privado con <code>ansible-galaxy collection publish</code>."}
]}

]});
