window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Condicionales, bucles y handlers",
resumen: "Tareas que deciden con when y tests de Jinja2, bucles con loop y until, y handlers para reiniciar solo cuando algo cambió",
nivel: "Intermedio",
color: "#e45f5f",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"an5n1",
titulo:"Condicionales con when",
claves:["when recibe una expresión de Jinja2 sin llaves; una lista de condiciones equivale a and","Tests: is defined, is changed, is failed, is version; filtro bool para textos","Desde ansible-core 2.19 la condición debe dar un booleano de verdad"],
pasos:[
 {t:"info", eti:"Decidir", h:"when",
  c:`<div class="termbox">- name: Instalar en Debian y Ubuntu
  ansible.builtin.apt: { name: nginx }
  when: ansible_facts['os_family'] == "Debian"

- name: Solo en Ubuntu 22.04 o superior y con más de 2 GB
  ansible.builtin.debug: { msg: "apto" }
  when:                                  # una lista = todas deben cumplirse
    - ansible_facts['distribution'] == "Ubuntu"
    - ansible_facts['distribution_version'] is version('22.04', '&gt;=')
    - ansible_facts['memtotal_mb'] &gt; 2048

- name: Recargar si la configuración cambió
  ansible.builtin.command: /opt/app/bin/recargar
  when: config is changed               # test sobre un resultado registrado

- name: Migrar solo si se pidió
  ansible.builtin.command: /opt/app/bin/migrar
  when: migrar | default(false) | bool   # -e migrar=true llega como texto</div>
     <p><code>when</code> ya es una expresión: <b>no lleva <code>{{ }}</code></b>. Si las pones, Ansible avisa y el resultado puede no ser el que esperas.</p>`},
 {t:"par", p:"Empareja cada test con cuándo se cumple",
  pares:[["x is defined","La variable x existe"],["r is changed","La tarea registrada en r cambió algo"],["r is failed","La tarea registrada en r falló (con ignore_errors)"],["v is version('2.0', '>=')","v es una versión igual o posterior a 2.0"],["'web' in group_names","El host pertenece al grupo web"]],
  why:"<code>is version</code> compara versiones de verdad: como texto, «10.0» sería menor que «9.0»."},
 {t:"hueco", p:"Ejecuta la tarea solo si el host está en el grupo <code>bd</code> <b>y</b> la variable <code>backup_activo</code> es verdadera",
  tpl:`- name: Programar la copia de seguridad
  ansible.builtin.cron:
    name: backup
    hour: "3"
    job: /usr/local/bin/backup.sh
  ___:
    - "'bd' ___ group_names"
    - backup_activo | ___`,
  banco:["when","in","bool","if","==","int"],
  sol:["when","in","bool"],
  why:"Cada elemento de la lista es una condición y deben cumplirse todas. Para «o», escribe una sola expresión con <code>or</code>."},
 {t:"opcion", p:"Lanzas con <code>-e reiniciar=false</code> y la tarea con <code>when: reiniciar</code> se ejecuta igualmente (o, en versiones recientes, falla). ¿Por qué?",
  ops:["-e no funciona con booleanos","Con clave=valor, -e pasa el texto «false», que no es un booleano; hay que usar reiniciar | bool","when no admite variables","Hay que reiniciar Ansible"],
  ok:1, why:"En versiones antiguas un texto no vacío era verdadero; desde ansible-core 2.19 una condición que no da booleano es un error. <code>| bool</code> convierte «false», «no», «0» en False."},
 {t:"info", eti:"Cambio reciente", h:"Condiciones estrictas desde 2.19",
  c:`<p>ansible-core 2.19 reescribió el motor de plantillas y ahora exige que <code>when</code>, <code>changed_when</code>, <code>failed_when</code> y <code>until</code> devuelvan un booleano. Patrones antiguos que ya no valen:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">antes y ahora</div><table class="dg-tabla"><thead><tr><th>Antes</th><th>Ahora</th></tr></thead><tbody>
       <tr><td><code>when: mi_lista</code></td><td><code>when: mi_lista | length &gt; 0</code></td></tr>
       <tr><td><code>when: resultado.stdout</code></td><td><code>when: resultado.stdout | length &gt; 0</code></td></tr>
       <tr><td><code>when: activar</code> (texto de -e)</td><td><code>when: activar | bool</code></td></tr>
     </tbody></table></div>
     <p>Al migrar un proyecto antiguo, pásale ansible-lint y ejecuta en staging antes que nada: estos fallos salen en tiempo de ejecución.</p>`},
 {t:"escribe", p:"Escribe la condición para que una tarea se ejecute solo si la variable <code>dominio</code> existe",
  sol:["dominio is defined","when: dominio is defined"],
  pista:"Un test de Jinja2 con «is».",
  why:"Lo contrario es <code>is undefined</code>. Para dar un valor por defecto en vez de saltar la tarea: <code>{{ dominio | default('localhost') }}</code>."},
 {t:"vf", p:"<code>when: \"{{ entorno == 'produccion' }}\"</code> es la forma recomendada de escribir una condición.",
  ok:false, why:"when ya se evalúa como Jinja2. Escribe <code>when: entorno == 'produccion'</code>; las llaves provocan un aviso y pueden cambiar el resultado."},
 {t:"opcion", p:"Quieres detener el playbook con un mensaje claro si el servidor tiene menos de 4 GB de RAM. ¿Qué módulo usas?",
  ops:["debug","ansible.builtin.assert con that y fail_msg","command: exit 1","pause"],
  ok:1, why:"<code>assert</code> comprueba una o varias condiciones y falla con tu mensaje: ideal al principio de un rol para validar requisitos."}
]},

/* =============== U5 L2 =============== */
{
id:"an5n2",
titulo:"Bucles: loop, until y compañía",
claves:["loop repite una tarea por cada elemento; item es el elemento actual","dict2items para recorrer diccionarios; loop_control para label, index_var y loop_var","until con retries y delay reintenta hasta que se cumpla una condición"],
pasos:[
 {t:"info", eti:"Repetir", h:"loop",
  c:`<div class="termbox">- name: Crear usuarios del equipo
  ansible.builtin.user:
    name: "{{ item.nombre }}"
    groups: "{{ item.grupos }}"
    append: true
  loop:
    - { nombre: ana, grupos: sudo }
    - { nombre: luis, grupos: developers }
  loop_control:
    label: "{{ item.nombre }}"          # en la salida, solo el nombre

- name: Parámetros del kernel
  ansible.posix.sysctl:
    name: "{{ item.key }}"
    value: "{{ item.value }}"
  loop: "{{ sysctl_params | dict2items }}"   # {vm.swappiness: 10, ...} -&gt; lista de key/value

- name: Esperar a que la API responda
  ansible.builtin.uri: { url: "http://localhost:8080/salud" }
  register: salud
  until: salud.status == 200
  retries: 30
  delay: 5</div>
     <p>Los antiguos <code>with_items</code>, <code>with_dict</code>… siguen funcionando, pero <code>loop</code> con filtros es la forma actual.</p>`},
 {t:"par", p:"Empareja cada construcción con su efecto",
  pares:[["loop","Repetir la tarea para cada elemento de una lista"],["dict2items","Convertir un diccionario en lista de key/value"],["loop_control.label","Qué se muestra de cada elemento en la salida"],["loop_control.index_var","Variable con el número de vuelta"],["until + retries + delay","Reintentar hasta que se cumpla una condición"]],
  why:"<code>label</code> es importante si los elementos llevan secretos o son enormes: evita volcarlos en la salida."},
 {t:"hueco", p:"Recorre el diccionario <code>puertos</code> y abre cada puerto en el cortafuegos",
  tpl:`- name: Abrir puertos
  community.general.ufw:
    rule: allow
    port: "{{ item.___ }}"
    comment: "{{ item.key }}"
  loop: "{{ puertos | ___ }}"`,
  banco:["value","dict2items","key","items","list","keys"],
  sol:["value","dict2items"],
  why:"Con <code>puertos: {http: 80, https: 443}</code>, cada item es <code>{key: http, value: 80}</code>."},
 {t:"opcion", p:"Tienes que instalar 25 paquetes con apt. ¿Qué es mejor?",
  ops:["Un loop con 25 vueltas del módulo apt","Pasar la lista entera en name: apt la instala en una sola transacción","25 tareas separadas","shell con apt-get install"],
  ok:1, why:"Muchos módulos de paquetes aceptan una lista: una llamada en vez de 25 es mucho más rápida. ansible-lint lo recomienda."},
 {t:"opcion", p:"Una tarea con <code>loop</code> tiene <code>register: r</code>. ¿Dónde está el resultado de cada vuelta?",
  ops:["En r.stdout","En r.results, una lista con un resultado por elemento","Solo se guarda la última vuelta","En item.result"],
  ok:1, why:"Cada elemento de <code>r.results</code> incluye además <code>item</code>, para saber a qué vuelta corresponde."},
 {t:"escribe", p:"Dentro de un bucle quieres que la variable del elemento se llame <code>usuario</code> en lugar de <code>item</code> (por ejemplo, porque incluyes otro fichero que también usa loop). ¿Qué opción de loop_control usas?",
  sol:["loop_var","loop_var: usuario"],
  pista:"loop_control.___",
  why:"Imprescindible con bucles anidados mediante <code>include_tasks</code>: si no, el <code>item</code> de dentro pisa al de fuera."},
 {t:"vf", p:"<code>until</code> vuelve a ejecutar la tarea completa en cada reintento, hasta <code>retries</code> veces con <code>delay</code> segundos entre intentos.",
  ok:true, why:"Si al agotar los reintentos la condición sigue sin cumplirse, la tarea falla. Es el patrón para esperar a que un servicio arranque."}
]},

/* =============== U5 L3 =============== */
{
id:"an3l2",
titulo:"Handlers: reaccionar solo a los cambios",
claves:["Un handler se ejecuta al final del play solo si alguna tarea lo notificó y cambió","Se ejecuta una vez aunque lo notifiquen cinco tareas, en el orden en que están definidos","meta: flush_handlers los ejecuta en ese momento; si el play falla, no corren salvo con --force-handlers"],
pasos:[
 {t:"info", eti:"Reaccionar a cambios", h:"notify y handlers",
  c:`<div class="termbox">  tasks:
    - name: Configurar el sitio
      ansible.builtin.template: { src: tareas.conf.j2, dest: /etc/nginx/sites-available/tareas.conf }
      notify: Recargar nginx

    - name: Certificado TLS
      ansible.builtin.copy: { src: tareas.pem, dest: /etc/ssl/tareas.pem, mode: "0600" }
      notify: Recargar nginx            # si cambian ambos, se recarga UNA vez

  handlers:
    - name: Validar configuración
      ansible.builtin.command: nginx -t
      listen: cambios en nginx
      changed_when: false
    - name: Recargar nginx
      ansible.builtin.service: { name: nginx, state: reloaded }
      listen: cambios en nginx</div>
     <p>Con <code>listen</code>, varias tareas notifican un «tema» (<code>notify: cambios en nginx</code>) y se ejecutan todos los handlers que lo escuchan, en el orden en que están <b>definidos</b> (no en el orden de notificación).</p>`},
 {t:"par", p:"Empareja cada construcción con su efecto",
  pares:[["notify","Avisar a un handler si la tarea cambió algo"],["handlers","Tareas que se ejecutan al final solo si se notificaron"],["listen","Nombre de tema al que responden varios handlers"],["meta: flush_handlers","Ejecutar ya los handlers pendientes"],["--force-handlers","Ejecutar los handlers notificados aunque el play falle"]],
  why:"Si cinco tareas notifican el mismo handler, se ejecuta una sola vez."},
 {t:"opcion", p:"Cambias la configuración de Nginx pero no quieres reiniciarlo en cada ejecución, solo cuando la configuración cambie. ¿Qué usas?",
  ops:["Una tarea service al final siempre","notify en la tarea de la plantilla y un handler que recarga nginx","Un cron","when: true"],
  ok:1, why:"Así el reinicio es idempotente también."},
 {t:"orden", p:"Una tarea cambia el fichero de unidad de systemd y notifica un handler. Ordena lo que ocurre en el play",
  items:["La tarea copia el .service y queda como changed","El resto de tareas del play se ejecutan","Al terminar las tareas, se ejecutan los handlers notificados","El handler hace daemon_reload y reinicia el servicio"],
  why:"Los handlers esperan al final de cada sección (pre_tasks, roles y tasks, post_tasks). Si necesitas el reinicio antes, usa <code>meta: flush_handlers</code>."},
 {t:"hueco", p:"Haz que el servicio se reinicie justo después de la configuración, antes de la comprobación de salud",
  tpl:`- name: Configuración de la API
  ansible.builtin.template: { src: api.env.j2, dest: /etc/api.env }
  ___: Reiniciar api

- name: Ejecutar ahora los handlers pendientes
  ansible.builtin.meta: ___

- name: Comprobar salud
  ansible.builtin.uri: { url: "http://localhost:8080/salud" }`,
  banco:["notify","flush_handlers","listen","run_handlers","handlers","trigger"],
  sol:["notify","flush_handlers"],
  why:"Sin el flush, la comprobación de salud se haría contra la configuración vieja, porque el reinicio llegaría al final del play."},
 {t:"opcion", p:"Una tarea cambió la configuración y notificó el reinicio, pero una tarea posterior falló. ¿Qué pasa con el handler?",
  ops:["Se ejecuta igualmente","No se ejecuta: el servidor queda con la configuración nueva y el servicio sin reiniciar, salvo que uses force_handlers","Se ejecuta en la siguiente ejecución automáticamente","Ansible deshace el cambio"],
  ok:1, why:"Peor aún: en la siguiente ejecución la plantilla ya no cambia y el handler no se notifica. Por eso existen <code>--force-handlers</code> y <code>force_handlers: true</code>."},
 {t:"term", p:"Ejecuta <code>sitio.yml</code> de forma que los handlers notificados se ejecuten aunque falle alguna tarea",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml --force-handlers","ansible-playbook --force-handlers sitio.yml","ansible-playbook -i inventario.ini sitio.yml --force-handlers"],
  pista:"Una opción de ansible-playbook con «force».",
  salida:`TASK [Comprobar disco] ****************
fatal: [web1.catappa.dev]: FAILED! => {"msg": "disco al 97%"}
RUNNING HANDLER [Recargar nginx] ******
changed: [web1.catappa.dev]`,
  why:"La tarea falló, pero la recarga pendiente se hizo: el servicio no queda desfasado respecto a su configuración."},
 {t:"vf", p:"Los handlers se ejecutan en el orden en que fueron notificados.",
  ok:false, why:"Se ejecutan en el orden en que están escritos en la sección handlers. Si el orden importa (validar antes de recargar), escríbelos en ese orden."}
]}

]});
