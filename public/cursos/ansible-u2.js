window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Inventarios y comandos ad hoc",
resumen: "Inventarios estáticos en INI y YAML, grupos y patrones, inventarios por entorno, inventarios dinámicos en la nube, comandos ad hoc y ansible-doc",
nivel: "Fundamentos",
color: "#ee6b6b",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"an1l2",
titulo:"Inventario: hosts, grupos y patrones",
claves:["El inventario lista los servidores y los agrupa; all y ungrouped existen siempre","Grupos de grupos con children, rangos como web[01:10] y un inventario por entorno","Patrones para elegir hosts: web:&amp;produccion, web:!web3, --limit; ansible-inventory --graph para verlo"],
pasos:[
 {t:"info", eti:"Qué servidores", h:"El inventario",
  c:`<div class="termbox"># inventario.ini
[web]
web[1:3].catappa.dev          # rango: web1, web2 y web3

[bd]
bd1.catappa.dev ansible_user=admin

[produccion:children]         # grupo de grupos
web
bd</div>
     <div class="termbox"># inventario.yml equivalente
all:
  children:
    produccion:
      children:
        web:
          hosts:
            web[1:3].catappa.dev:
        bd:
          hosts:
            bd1.catappa.dev:
              ansible_user: admin</div>
     <p>Dos grupos existen siempre: <b>all</b> (todos los hosts) y <b>ungrouped</b> (los que no están en ningún grupo salvo all). Un host puede estar en varios grupos a la vez: por función (<code>web</code>), por entorno (<code>produccion</code>) y por ubicación (<code>madrid</code>).</p>`},
 {t:"term", p:"Comprueba la conexión con todos los servidores del inventario <code>inventario.ini</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible all -i inventario.ini -m ping","ansible -i inventario.ini all -m ping","ansible all -m ping -i inventario.ini"],
  pista:"ansible, el patrón all, -i con el inventario y -m ping.",
  salida:`web1.catappa.dev | SUCCESS => { "changed": false, "ping": "pong" }
web2.catappa.dev | SUCCESS => { "changed": false, "ping": "pong" }
web3.catappa.dev | SUCCESS => { "changed": false, "ping": "pong" }
bd1.catappa.dev | SUCCESS => { "changed": false, "ping": "pong" }`, why:"El módulo ping no es ICMP: comprueba SSH y Python."},
 {t:"term", p:"Dibuja el árbol de grupos y hosts del inventario <code>inventario.ini</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-inventory -i inventario.ini --graph","ansible-inventory --graph -i inventario.ini"],
  pista:"ansible-inventory con la opción que dibuja un grafo.",
  salida:`@all:
  |--@ungrouped:
  |--@produccion:
  |  |--@web:
  |  |  |--web1.catappa.dev
  |  |  |--web2.catappa.dev
  |  |  |--web3.catappa.dev
  |  |--@bd:
  |  |  |--bd1.catappa.dev`,
  why:"Con <code>--list</code> sale el JSON completo con todas las variables de cada host: ideal para ver qué valor le llega realmente a uno."},
 {t:"hueco", p:"Completa el inventario YAML: el grupo <code>web</code> tiene dos hosts y forma parte de <code>staging</code>",
  tpl:`all:
  ___:
    staging:
      ___:
        web:
          ___:
            web1.stg.catappa.dev:
            web2.stg.catappa.dev:`,
  banco:["children","children","hosts","vars","groups","members"],
  sol:["children","children","hosts"],
  why:"En YAML, <code>children</code> anida grupos y <code>hosts</code> lista servidores; <code>vars</code> iría al mismo nivel para variables del grupo."},
 {t:"info", eti:"Elegir hosts", h:"Patrones y --limit",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">patrones de hosts</div><table class="dg-tabla"><thead><tr><th>Patrón</th><th>Significa</th></tr></thead><tbody>
       <tr><td>all</td><td>todos</td></tr>
       <tr><td>web:bd</td><td>unión: los de web y los de bd (también <code>web,bd</code>)</td></tr>
       <tr><td>web:&amp;produccion</td><td>intersección: web que además están en producción</td></tr>
       <tr><td>web:!web3.catappa.dev</td><td>exclusión: todo web menos web3</td></tr>
       <tr><td>~web[0-9]+</td><td>expresión regular (empieza por <code>~</code>)</td></tr>
     </tbody></table></div>
     <div class="termbox">ansible-playbook sitio.yml --limit web1.catappa.dev      # solo ese host
ansible-playbook sitio.yml --limit 'web:!web3.catappa.dev'
ansible web --list-hosts                                   # ver a quién afectaría</div>
     <div class="nota ojo"><b class="tit">Entrecomilla los patrones</b>El <code>!</code> y el <code>&amp;</code> los interpreta bash: pon el patrón entre comillas simples.</div>`},
 {t:"par", p:"Empareja cada patrón con los hosts que selecciona",
  pares:[["web:bd","Los de web más los de bd"],["web:&produccion","Los de web que también están en produccion"],["web:!web3","Los de web salvo web3"],["all","Todos los hosts del inventario"],["ungrouped","Hosts sin ningún grupo propio"]],
  why:"Antes de lanzar algo delicado, comprueba el patrón con <code>--list-hosts</code>."},
 {t:"info", eti:"Entornos", h:"Un inventario por entorno",
  c:`<div class="dg dg-arbol"><div class="dg-tit">proyecto con dos entornos</div><div class="rama" style="--n:0"><span class="nom carpeta">inventarios/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">produccion/</span></div><div class="rama" style="--n:2"><span class="nom">hosts.yml</span></div><div class="rama" style="--n:2"><span class="nom carpeta">group_vars/</span></div><div class="rama" style="--n:3"><span class="nom">all.yml</span><span class="coment">dominio: catappa.dev</span></div><div class="rama" style="--n:3"><span class="nom">web.yml</span><span class="coment">replicas_php: 16</span></div><div class="rama" style="--n:2"><span class="nom carpeta">host_vars/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">staging/</span></div><div class="rama" style="--n:2"><span class="nom">hosts.yml</span></div><div class="rama" style="--n:2"><span class="nom carpeta">group_vars/</span></div></div>
     <div class="termbox">ansible-playbook -i inventarios/staging sitio.yml
ansible-playbook -i inventarios/produccion sitio.yml</div>
     <p>El mismo playbook, dos inventarios separados: es imposible tocar producción por un <code>--limit</code> mal escrito. Las carpetas <code>group_vars/</code> y <code>host_vars/</code> junto al inventario se cargan solas.</p>`},
 {t:"opcion", p:"Quieres que sea imposible aplicar a producción un cambio pensado para staging. ¿Qué organización eliges?",
  ops:["Un solo inventario con grupos staging y produccion y confiar en --limit","Un directorio de inventario por entorno, cada uno con sus group_vars, y elegir con -i","Poner when: entorno == 'staging' en cada tarea","Dos copias del playbook"],
  ok:1, why:"Con inventarios separados, el entorno lo decide un argumento explícito y cada uno tiene sus propias variables y secretos."},
 {t:"term", p:"Lista los hosts del grupo <code>web</code> sin ejecutar nada en ellos",
  prompt:"pablo@control:~/infra$", sol:["ansible web --list-hosts","ansible web -i inventario.ini --list-hosts","ansible -i inventario.ini web --list-hosts"],
  pista:"ansible, el patrón y --list-hosts.",
  salida:`  hosts (3):
    web1.catappa.dev
    web2.catappa.dev
    web3.catappa.dev`,
  why:"También existe en ansible-playbook: <code>ansible-playbook sitio.yml --list-hosts</code> muestra los hosts de cada play."}
]},

/* =============== U2 L2 =============== */
{
id:"an2n1",
titulo:"Inventarios dinámicos",
claves:["En la nube los servidores cambian: un plugin de inventario pregunta a la API y construye los grupos","amazon.aws.aws_ec2 agrupa por etiquetas con keyed_groups y fija ansible_host con compose","El fichero debe llamarse *.aws_ec2.yml; se combina con estáticos pasando un directorio a -i"],
pasos:[
 {t:"info", eti:"La flota cambia", h:"Por qué un inventario dinámico",
  c:`<p>Con autoescalado, las instancias nacen y mueren cada hora. Mantener un <code>inventario.ini</code> a mano es imposible. Un <b>plugin de inventario</b> consulta la API del proveedor en cada ejecución y devuelve hosts, grupos y variables.</p>
     <div class="dg"><div class="dg-tit">de la API a los grupos</div>
       <div class="dg-flujo">
         <div class="dg-caja base">API de AWS<small>DescribeInstances</small></div>
         <div class="dg-caja acento">plugin aws_ec2<small>filtra y agrupa</small></div>
         <div class="dg-caja ok">grupos<small>rol_web, rol_bd, az_eu_west_1a</small></div>
       </div></div>
     <p>Hay plugins para AWS (<code>amazon.aws.aws_ec2</code>), Azure (<code>azure.azcollection.azure_rm</code>), Google Cloud (<code>google.cloud.gcp_compute</code>), VMware, Proxmox, NetBox… Los antiguos <i>scripts</i> de inventario siguen funcionando, pero los plugins son lo actual.</p>`},
 {t:"info", eti:"Ejemplo", h:"El plugin de AWS",
  c:`<div class="termbox"># inventarios/produccion/catappa.aws_ec2.yml
plugin: amazon.aws.aws_ec2
regions:
  - eu-west-1
filters:
  instance-state-name: running
  tag:Proyecto: catappa
keyed_groups:
  - key: tags.Rol            # etiqueta Rol=web  -&gt; grupo rol_web
    prefix: rol
  - key: placement.availability_zone
    prefix: az
hostnames:
  - tag:Name
compose:
  ansible_host: private_ip_address   # conectar por la IP privada</div>
     <p>Necesita la colección <code>amazon.aws</code> y las bibliotecas <code>boto3</code> y <code>botocore</code> en la máquina de control; las credenciales salen de lo habitual (variables de entorno, perfil, rol IAM). El nombre del fichero <b>debe terminar</b> en <code>aws_ec2.yml</code> o <code>aws_ec2.yaml</code>: así sabe Ansible qué plugin lo lee.</p>`},
 {t:"term", p:"Muestra el árbol de grupos que genera el inventario dinámico <code>catappa.aws_ec2.yml</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-inventory -i catappa.aws_ec2.yml --graph","ansible-inventory --graph -i catappa.aws_ec2.yml"],
  pista:"El mismo comando que con un inventario estático.",
  salida:`@all:
  |--@ungrouped:
  |--@aws_ec2:
  |  |--api-1
  |  |--api-2
  |  |--bd-1
  |--@rol_api:
  |  |--api-1
  |  |--api-2
  |--@rol_bd:
  |  |--bd-1
  |--@az_eu_west_1a:
  |  |--api-1
  |  |--bd-1`,
  why:"El plugin crea además el grupo <code>aws_ec2</code> con todas las instancias. Los guiones de la zona se convierten en guiones bajos porque los nombres de grupo no admiten guiones."},
 {t:"hueco", p:"Completa el inventario dinámico para agrupar por la etiqueta <code>Entorno</code> y conectar por IP privada",
  tpl:`plugin: amazon.aws.aws_ec2
regions: [eu-west-1]
___:
  - key: tags.Entorno
    prefix: entorno
___:
  ansible_host: ___`,
  banco:["keyed_groups","compose","private_ip_address","public_ip_address","groups","hostvars"],
  sol:["keyed_groups","compose","private_ip_address"],
  why:"<code>keyed_groups</code> crea grupos a partir de un valor; <code>compose</code> calcula variables de host con expresiones Jinja2."},
 {t:"vf", p:"Un fichero llamado <code>produccion.yml</code> con <code>plugin: amazon.aws.aws_ec2</code> dentro funciona igual que <code>produccion.aws_ec2.yml</code>.",
  ok:false, why:"El plugin aws_ec2 solo acepta ficheros cuyo nombre termina en aws_ec2.yml o aws_ec2.yaml. Con otro nombre verás «not a valid YAML inventory plugin config file»."},
 {t:"info", eti:"Mezclar", h:"Estático y dinámico juntos",
  c:`<div class="termbox">inventarios/produccion/
  catappa.aws_ec2.yml      # instancias de la nube
  00-fijos.ini             # el bastión y los equipos de red, a mano
  group_vars/rol_api.yml   # variables para un grupo que crea el plugin</div>
     <p>Si pasas un <b>directorio</b> a <code>-i</code>, Ansible lee todas las fuentes y las une. Los <code>group_vars</code> pueden usar los nombres de grupo generados (<code>rol_api</code>). El plugin <code>constructed</code> permite además crear grupos a partir de variables ya cargadas (por ejemplo, agrupar por <code>ansible_distribution</code>).</p>`},
 {t:"opcion", p:"El inventario dinámico tarda 20 segundos en cada ejecución porque consulta muchas regiones. ¿Qué haces primero?",
  ops:["Volver a un inventario estático","Limitar regions y filters a lo que usas y activar la caché del plugin (cache: true con un tiempo de vida)","Subir forks","Desactivar gather_facts"],
  ok:1, why:"Los plugins de inventario admiten caché; y filtrar en la API evita traer miles de instancias que luego no usas."},
 {t:"escribe", p:"¿Qué dos bibliotecas de Python necesita la máquina de control para usar el plugin <code>amazon.aws.aws_ec2</code>? (separadas por «y»)",
  sol:["boto3 y botocore","botocore y boto3","boto3, botocore","boto3 botocore"],
  pista:"El SDK de AWS para Python y su núcleo.",
  why:"Instálalas en el mismo entorno de Python que ansible-core (por ejemplo, con <code>pipx inject ansible-core boto3 botocore</code>)."}
]},

/* =============== U2 L3 =============== */
{
id:"an2n2",
titulo:"Comandos ad hoc y ansible-doc",
claves:["ansible patrón -m módulo -a argumentos: una tarea suelta sin playbook","command no usa shell; shell sí (tuberías, redirecciones); raw ni siquiera necesita Python","ansible-doc es la documentación de cada módulo, sin salir del terminal"],
pasos:[
 {t:"info", eti:"Acciones rápidas", h:"Comandos ad hoc",
  c:`<div class="termbox">ansible web -m ansible.builtin.command -a "uptime"
ansible web -m shell -a "df -h / | tail -1"
ansible web -b -m apt -a "name=htop state=present"
ansible web -b -m service -a "name=nginx state=restarted"
ansible bd -m setup -a "filter=ansible_memtotal_mb"
ansible all -m copy -a "src=motd dest=/etc/motd" -b --check --diff
ansible all -o -m command -a "cat /etc/os-release"   # -o: una línea por host
ansible all -f 50 -m ping                            # 50 hosts en paralelo</div>
     <p>Úsalos para consultas y acciones puntuales («¿qué versión de OpenSSL hay en toda la flota?», «reinicia ese servicio»). Todo lo que se repite va a un playbook, que queda en Git.</p>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["-i inventario.ini","Qué inventario usar"],["-m apt","Qué módulo ejecutar"],["-a \"name=htop\"","Argumentos del módulo"],["-b","Ejecutar con privilegios (become, sudo)"],["-f 50","Cuántos hosts a la vez (forks)"],["-o","Resultado de cada host en una sola línea"]],
  why:"Si no pones <code>-m</code>, el módulo por defecto es <code>command</code>."},
 {t:"info", eti:"Diferencias", h:"command, shell y raw",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tres formas de ejecutar un comando</div><table class="dg-tabla"><thead><tr><th>Módulo</th><th>Cómo ejecuta</th><th>Cuándo</th></tr></thead><tbody>
       <tr><td>command</td><td>directamente, sin shell: no entiende <code>|</code>, <code>&gt;</code>, <code>&amp;&amp;</code> ni <code>$HOME</code></td><td>por defecto: más seguro y predecible</td></tr>
       <tr><td>shell</td><td>a través de <code>/bin/sh</code></td><td>cuando necesitas tuberías o redirecciones</td></tr>
       <tr><td>raw</td><td>SSH pelado, sin módulo ni Python</td><td>instalar Python en un nodo mínimo, equipos de red antiguos</td></tr>
     </tbody></table></div>
     <p>Ninguno de los tres sabe si «ha cambiado algo»: siempre dicen <b>changed</b>. En playbooks se corrigen con <code>changed_when</code>, <code>creates</code> o <code>removes</code>.</p>`},
 {t:"term", p:"Muestra en el grupo <code>web</code> el uso del disco raíz filtrando con una tubería: <code>df -h / | tail -1</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible web -m shell -a \"df -h / | tail -1\"","ansible web -m ansible.builtin.shell -a \"df -h / | tail -1\"","ansible web -a \"df -h / | tail -1\" -m shell"],
  pista:"Con una tubería no vale command: necesitas shell.",
  salida:`web1.catappa.dev | CHANGED | rc=0 >>
/dev/nvme0n1p1   30G   12G   18G  40% /
web2.catappa.dev | CHANGED | rc=0 >>
/dev/nvme0n1p1   30G   27G  3.1G  90% /`,
  why:"Con <code>command</code>, la tubería llegaría a <code>df</code> como un argumento más y fallaría."},
 {t:"opcion", p:"Ejecutas <code>ansible web -a \"echo $HOME &gt; /tmp/x\"</code> y el fichero no aparece. ¿Por qué?",
  ops:["Falta -b","Sin -m, se usa command, que no pasa por un shell: la redirección y $HOME no se interpretan","El módulo echo no existe","Porque /tmp no admite escritura"],
  ok:1, why:"Usa <code>-m shell</code> cuando necesites características del shell. Ojo además: <code>$HOME</code> entre comillas dobles lo expandiría tu propio bash local."},
 {t:"info", eti:"Documentación", h:"ansible-doc",
  c:`<div class="termbox">ansible-doc ansible.builtin.lineinfile     # documentación completa con ejemplos
ansible-doc -s ansible.builtin.user        # resumen de parámetros listo para pegar
ansible-doc -l community.general           # módulos de una colección
ansible-doc -t lookup -l                   # otros tipos de plugin: lookup, filter, inventory...</div>
     <p>En el examen RHCE no hay Internet: <code>ansible-doc</code> y su sección <b>EXAMPLES</b> son tu chuleta oficial. En el trabajo, igual de útil: la documentación siempre corresponde a la versión instalada.</p>`},
 {t:"term", p:"Muestra la documentación del módulo <code>ansible.builtin.lineinfile</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-doc ansible.builtin.lineinfile","ansible-doc lineinfile"],
  pista:"ansible-doc seguido del nombre del módulo.",
  salida:`> ANSIBLE.BUILTIN.LINEINFILE    (.../ansible/modules/lineinfile.py)

  This module ensures a particular line is in a file, or replace an
  existing line using a back-referenced regular expression.

OPTIONS (= indicates it is required):

= path    The file to modify.
- regexp  The regular expression to look for in every line of the file.
- line    The line to insert/replace into the file.
- state   Whether the line should be there or not.
          choices: [absent, present]
          default: present
...
EXAMPLES:`,
  why:"Los parámetros con <code>=</code> son obligatorios. Baja hasta EXAMPLES: casi siempre hay uno que es justo lo que buscas."},
 {t:"term", p:"Consulta la memoria total (<code>ansible_memtotal_mb</code>) de los hosts del grupo <code>bd</code> con el módulo setup",
  prompt:"pablo@control:~/infra$", sol:["ansible bd -m setup -a \"filter=ansible_memtotal_mb\"","ansible bd -m ansible.builtin.setup -a \"filter=ansible_memtotal_mb\"","ansible bd -m setup -a filter=ansible_memtotal_mb"],
  pista:"-m setup con el argumento filter.",
  salida:`bd1.catappa.dev | SUCCESS => {
    "ansible_facts": {
        "ansible_memtotal_mb": 15731
    },
    "changed": false
}`,
  why:"setup es el módulo que recoge los <i>facts</i>. Con filter admite comodines: <code>filter=ansible_*_mb</code>."}
]}

]});
