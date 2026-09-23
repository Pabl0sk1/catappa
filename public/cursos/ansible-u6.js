window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Plantillas Jinja2, filtros y lookups",
resumen: "Generar ficheros de configuración con Jinja2, transformar datos con filtros y traer información de fuera con lookups",
nivel: "Intermedio",
color: "#e45f5f",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"an6n1",
titulo:"Plantillas con Jinja2",
claves:["template genera un fichero en el nodo a partir de un .j2 que se procesa en la máquina de control","{{ }} para valores, {% %} para lógica (for, if) y {# #} para comentarios","ansible_managed avisa de que el fichero lo gestiona Ansible; validate y backup dan red de seguridad"],
pasos:[
 {t:"info", eti:"Un fichero, muchos servidores", h:"El módulo template",
  c:`<div class="termbox"># templates/upstream.conf.j2
# {{ ansible_managed }}
upstream api {
{% for h in groups['api'] %}
    server {{ hostvars[h]['ansible_facts']['default_ipv4']['address'] }}:{{ puerto_api }};
{% endfor %}
}

server {
    listen 443 ssl;
    server_name {{ dominio }};
{% if habilitar_gzip | default(true) %}
    gzip on;
{% endif %}
    location / { proxy_pass http://api; }
}</div>
     <div class="termbox">- name: Configurar el balanceador
  ansible.builtin.template:
    src: upstream.conf.j2           # se busca en templates/
    dest: /etc/nginx/conf.d/api.conf
    mode: "0644"
    backup: true                    # guarda la versión anterior con fecha
  notify: Recargar nginx</div>
     <p>La plantilla se renderiza en la <b>máquina de control</b> con las variables de ese host, y el resultado se copia al nodo. Si el contenido no cambia, la tarea sale <b>ok</b>: no hay recarga.</p>`},
 {t:"par", p:"Empareja cada sintaxis de Jinja2 con su función",
  pares:[["{{ dominio }}","Insertar el valor de una variable"],["{% for h in groups['web'] %}","Repetir un bloque"],["{% if tls %}","Incluir un bloque solo si se cumple la condición"],["{# nota #}","Comentario que no aparece en el resultado"],["{%- ... -%}","Quitar los espacios y saltos de línea de alrededor"]],
  why:"El módulo template activa <code>trim_blocks</code> por defecto: el salto de línea tras una etiqueta <code>{% %}</code> desaparece solo."},
 {t:"opcion", p:"¿Qué ventaja tiene template frente a copy para la configuración de Nginx?",
  ops:["Ninguna","Permite un único fichero con variables que se adapta a cada entorno o servidor","Es más rápido","copy no admite ficheros de texto"],
  ok:1, why:"Un fichero .j2 en vez de una copia por entorno."},
 {t:"hueco", p:"Completa la plantilla para listar un <code>server</code> por cada host del grupo <code>web</code>",
  tpl:`upstream web {
___ for h in groups['web'] %}
    server ___ h }}:8080;
{% ___ %}
}`,
  banco:["{%","{{","endfor","end","{#","done"],
  sol:["{%","{{","endfor"],
  why:"Cada <code>{% for %}</code> se cierra con <code>{% endfor %}</code>, y cada <code>{% if %}</code> con <code>{% endif %}</code>."},
 {t:"escribe", p:"¿Qué variable pones al principio de una plantilla para que el fichero generado avise de que lo gestiona Ansible?",
  sol:["ansible_managed","{{ ansible_managed }}"],
  pista:"ansible_…",
  why:"Por defecto se convierte en «Ansible managed». Quien abra el fichero sabrá que editarlo a mano es inútil: la próxima ejecución lo sobrescribirá."},
 {t:"term", p:"Aplica <code>balanceador.yml</code> en modo de prueba mostrando cómo cambiaría la plantilla",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook balanceador.yml --check --diff","ansible-playbook balanceador.yml --diff --check","ansible-playbook -i inventario.ini balanceador.yml --check --diff"],
  pista:"--check y --diff.",
  salida:`TASK [Configurar el balanceador] ******
--- before: /etc/nginx/conf.d/api.conf
+++ after: /home/pablo/.ansible/tmp/.../upstream.conf.j2
@@ -3,2 +3,3 @@
     server 10.0.1.11:8080;
     server 10.0.1.12:8080;
+    server 10.0.1.13:8080;
changed: [lb1.catappa.dev]`,
  why:"Has añadido api3 al inventario y el balanceador lo incorpora solo: esa es la gracia de generar la configuración desde el inventario."},
 {t:"vf", p:"Las plantillas se procesan en el nodo gestionado, por eso el nodo necesita Jinja2 instalado.",
  ok:false, why:"Jinja2 solo hace falta en la máquina de control: allí se genera el fichero y al nodo llega el resultado."},
 {t:"opcion", p:"Tu plantilla genera líneas en blanco de más entre los <code>server</code>. ¿Qué pruebas primero?",
  ops:["Cambiar a copy","Usar el control de espacios de Jinja2: {%- ... %} o {% ... -%}","Borrar las líneas con lineinfile después","Poner todo en una línea"],
  ok:1, why:"El guion al lado del <code>%</code> se come los espacios y saltos de línea de ese lado de la etiqueta."}
]},

/* =============== U6 L2 =============== */
{
id:"an6n2",
titulo:"Filtros para transformar datos",
claves:["default y mandatory para valores ausentes; default(omit) para no pasar un parámetro","map, selectattr, join, unique y sort para listas; combine y dict2items para diccionarios","to_nice_yaml, to_json, from_json, regex_replace, b64encode y password_hash para formatos"],
pasos:[
 {t:"info", eti:"Transformar", h:"Los filtros que más se usan",
  c:`<div class="termbox">{{ puerto | default(8080) }}                         # valor si no está definida
{{ version | mandatory }}                            # falla con claridad si falta
mode: "{{ modo | default(omit) }}"                   # si no hay valor, el parámetro no se envía
{{ usuarios | selectattr('activo') | map(attribute='nombre') | join(', ') }}
{{ groups['web'] | map('extract', hostvars, ['ansible_facts', 'default_ipv4', 'address']) | list }}
{{ config_base | combine(config_entorno, recursive=true) }}
{{ datos | to_nice_yaml }}      {{ respuesta.content | from_json }}
{{ 'v1.4.0' | regex_replace('^v', '') }}            # 1.4.0
{{ clave_plana | password_hash('sha512') }}          # para el módulo user</div>
     <p>Los filtros se encadenan con <code>|</code> y se leen de izquierda a derecha, como una tubería de shell. Vienen de Jinja2, de ansible-core y de colecciones (<code>ansible.utils.ipaddr</code>, <code>community.general.json_query</code>).</p>`},
 {t:"par", p:"Empareja cada filtro con lo que hace",
  pares:[["default(80)","Dar un valor si la variable no existe"],["mandatory","Fallar si la variable no existe"],["selectattr('activo')","Quedarse con los elementos cuyo atributo es verdadero"],["map(attribute='nombre')","Sacar un atributo de cada elemento"],["combine","Fusionar diccionarios"],["to_nice_yaml","Convertir datos a YAML legible"]],
  why:"<code>selectattr</code> filtra y <code>map</code> transforma: juntos equivalen a un filter+map de cualquier lenguaje."},
 {t:"hueco", p:"Obtén la lista de nombres de los usuarios cuyo atributo <code>admin</code> es verdadero",
  tpl:`admins: "{{ usuarios | ___('admin') | ___(attribute='nombre') | list }}"`,
  banco:["selectattr","map","rejectattr","select","attr","filter"],
  sol:["selectattr","map"],
  why:"<code>rejectattr</code> haría lo contrario: quedarse con los que NO son admin."},
 {t:"opcion", p:"Quieres pasar <code>owner: \"{{ propietario }}\"</code> solo si la variable está definida; si no, que el módulo use su comportamiento normal. ¿Qué escribes?",
  ops:["owner: \"{{ propietario | default('') }}\"","owner: \"{{ propietario | default(omit) }}\"","owner: \"{{ propietario | mandatory }}\"","owner: \"{{ propietario or none }}\""],
  ok:1, why:"<code>omit</code> es un valor especial: el parámetro desaparece de la llamada al módulo. Con cadena vacía, el módulo intentaría usar un propietario vacío y fallaría."},
 {t:"term", p:"Prueba un filtro sin playbook: muestra en <code>localhost</code> el resultado de <code>{{ [3, 1, 3, 2] | unique | sort }}</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible localhost -m debug -a \"msg={{ [3, 1, 3, 2] | unique | sort }}\"","ansible localhost -m ansible.builtin.debug -a \"msg={{ [3, 1, 3, 2] | unique | sort }}\"","ansible localhost -m debug -a \"msg={{ [3,1,3,2] | unique | sort }}\""],
  pista:"ansible localhost -m debug -a \"msg=...\"",
  salida:`localhost | SUCCESS => {
    "msg": [
        1,
        2,
        3
    ]
}`,
  why:"<code>localhost</code> existe siempre de forma implícita: es el banco de pruebas perfecto para expresiones Jinja2."},
 {t:"codigo", p:"Implementa el filtro <code>combine(recursive=true)</code>: lee dos diccionarios JSON (uno por línea) e imprime la fusión con <code>json.dumps(..., sort_keys=True)</code>",
  lenguaje:"py",
  c:`<p>Reglas de <code>combine</code> recursivo: las claves del segundo diccionario pisan a las del primero; si en ambos el valor es un diccionario, se fusionan a su vez de forma recursiva. Las listas no se mezclan: la del segundo sustituye a la del primero (es el comportamiento por defecto, <code>list_merge='replace'</code>).</p>`,
  plantilla:"import sys, json\nlineas = sys.stdin.read().splitlines()\nbase, encima = json.loads(lineas[0]), json.loads(lineas[1])\n# imprime la fusión\n",
  pruebas:[
   {entrada:"{\"a\": 1, \"b\": {\"x\": 1, \"y\": 2}}\n{\"b\": {\"y\": 3, \"z\": 4}, \"c\": 5}", salida:"{\"a\": 1, \"b\": {\"x\": 1, \"y\": 3, \"z\": 4}, \"c\": 5}"},
   {entrada:"{\"nginx\": {\"workers\": 4, \"gzip\": true}}\n{\"nginx\": {\"workers\": 16}}", salida:"{\"nginx\": {\"gzip\": true, \"workers\": 16}}"},
   {entrada:"{\"l\": [1, 2], \"d\": {\"e\": {\"f\": 1}}}\n{\"l\": [3], \"d\": {\"e\": {\"g\": 2}}}", salida:"{\"d\": {\"e\": {\"f\": 1, \"g\": 2}}, \"l\": [3]}", oculta:true},
   {entrada:"{\"a\": {\"b\": 1}}\n{\"a\": 7}", salida:"{\"a\": 7}", oculta:true}
  ],
  pista:"Una función recursiva: copia el primero y, por cada clave del segundo, fusiona si ambos valores son dict o sustituye si no.",
  solucion:"import sys, json\nlineas = sys.stdin.read().splitlines()\nbase, encima = json.loads(lineas[0]), json.loads(lineas[1])\n\ndef combinar(a, b):\n    r = dict(a)\n    for k, v in b.items():\n        if isinstance(r.get(k), dict) and isinstance(v, dict):\n            r[k] = combinar(r[k], v)\n        else:\n            r[k] = v\n    return r\n\nprint(json.dumps(combinar(base, encima), sort_keys=True))",
  why:"Es el patrón para configuraciones por capas: valores base en defaults del rol y solo las diferencias en cada entorno. Sin <code>recursive=true</code>, el diccionario <code>nginx</code> entero se sustituiría y perderías <code>gzip</code>."},
 {t:"escribe", p:"¿Qué filtro usas para que el playbook falle con un mensaje claro si <code>version</code> no está definida?",
  sol:["mandatory","version | mandatory","{{ version | mandatory }}"],
  pista:"Lo contrario de opcional.",
  why:"Mejor fallar al principio que desplegar «la versión vacía». Para validar varias cosas a la vez, <code>assert</code>."},
 {t:"vf", p:"<code>{{ 'Hola' | upper | length }}</code> devuelve 4.",
  ok:true, why:"Primero upper convierte a «HOLA» y después length cuenta los caracteres: los filtros se aplican de izquierda a derecha."}
]},

/* =============== U6 L3 =============== */
{
id:"an6n3",
titulo:"Lookups: datos de fuera del inventario",
claves:["lookup lee datos en la máquina de control: ficheros, variables de entorno, comandos, gestores de secretos","query devuelve siempre una lista; lookup, un texto separado por comas","password genera y guarda contraseñas aleatorias; pipe ejecuta un comando local"],
pasos:[
 {t:"info", eti:"Traer datos", h:"lookup y query",
  c:`<div class="termbox">clave_publica: "{{ lookup('ansible.builtin.file', 'claves/ana.pub') }}"
token_ci:      "{{ lookup('ansible.builtin.env', 'CI_TOKEN') }}"
commit:        "{{ lookup('ansible.builtin.pipe', 'git rev-parse --short HEAD') }}"
contenido:     "{{ lookup('ansible.builtin.template', 'motd.j2') }}"
clave_bd:      "{{ lookup('ansible.builtin.password', 'credenciales/bd_' ~ inventory_hostname ~ ' length=24 chars=ascii_letters,digits') }}"
secreto:       "{{ lookup('amazon.aws.secretsmanager_secret', 'prod/tareas/bd') }}"
ficheros:      "{{ query('ansible.builtin.fileglob', 'files/certs/*.pem') }}"</div>
     <div class="nota ojo"><b class="tit">Se ejecutan en la máquina de control</b>Un lookup <code>file</code> lee un fichero de TU máquina, no del nodo; <code>env</code> lee TUS variables de entorno. Para leer algo del nodo usa un módulo (<code>slurp</code>, <code>command</code> con register).</div>`},
 {t:"par", p:"Empareja cada lookup con lo que devuelve",
  pares:[["file","El contenido de un fichero de la máquina de control"],["env","Una variable de entorno de la máquina de control"],["pipe","La salida de un comando ejecutado en local"],["password","Una contraseña aleatoria que se guarda en un fichero y se reutiliza"],["fileglob","Los ficheros locales que cumplen un patrón"]],
  why:"<code>password</code> es idempotente: la primera vez genera la contraseña y la guarda; las siguientes, la lee."},
 {t:"opcion", p:"Usas <code>lookup('file', '/etc/hostname')</code> en una tarea que corre en 20 servidores. ¿Qué obtienes?",
  ops:["El hostname de cada servidor","El contenido de /etc/hostname de la máquina de control, el mismo para los 20","Un error","Una lista con los 20 nombres"],
  ok:1, why:"Los lookups siempre se evalúan en local. Para el nombre de cada nodo, usa <code>ansible_facts['hostname']</code>."},
 {t:"hueco", p:"Autoriza la clave pública de Ana leyendo el fichero local <code>claves/ana.pub</code>",
  tpl:`- ansible.posix.authorized_key:
    user: ana
    key: "{{ ___('ansible.builtin.___', 'claves/ana.pub') }}"`,
  banco:["lookup","file","query","slurp","fetch","env"],
  sol:["lookup","file"],
  why:"Las claves públicas viven en el repositorio (no son secretas) y se reparten con un lookup: añadir a alguien es añadir un fichero."},
 {t:"term", p:"Muestra en <code>localhost</code> el valor de la variable de entorno <code>HOME</code> usando un lookup",
  prompt:"pablo@control:~/infra$", sol:["ansible localhost -m debug -a \"msg={{ lookup('env', 'HOME') }}\"","ansible localhost -m debug -a \"msg={{ lookup('ansible.builtin.env', 'HOME') }}\"","ansible localhost -m debug -a \"msg={{ lookup('env','HOME') }}\""],
  pista:"debug con msg y lookup('env', ...).",
  salida:`localhost | SUCCESS => {
    "msg": "/home/pablo"
}`,
  why:"Patrón habitual en CI: el pipeline expone un secreto como variable de entorno y el playbook lo lee con <code>lookup('env', ...)</code>, sin escribirlo nunca en disco."},
 {t:"vf", p:"<code>query('fileglob', '*.pem')</code> devuelve siempre una lista, aunque solo haya un fichero o ninguno.",
  ok:true, why:"Por eso <code>query</code> (o <code>lookup(..., wantlist=true)</code>) es lo correcto para alimentar un <code>loop</code>."},
 {t:"escribe", p:"¿Qué lookup ejecuta un comando en la máquina de control y devuelve su salida?",
  sol:["pipe","ansible.builtin.pipe"],
  pista:"Como una tubería.",
  why:"Útil para meter el commit de Git o la fecha en un fichero desplegado. Ojo: se ejecuta en cada host, así que si es costoso, guárdalo antes con <code>set_fact</code> y <code>run_once</code>."}
]}

]});
