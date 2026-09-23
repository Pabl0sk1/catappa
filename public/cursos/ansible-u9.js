window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Errores, delegación, rendimiento y despliegues",
resumen: "block, rescue y always para recuperarse de fallos, delegar tareas en otros hosts, acelerar Ansible con forks, pipelining y estrategias, y desplegar por tandas sin cortes",
nivel: "Experto",
color: "#d65454",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"an9n1",
titulo:"Manejo de errores: block, rescue y always",
claves:["block agrupa tareas; rescue se ejecuta si alguna falla; always se ejecuta siempre","ignore_errors, ignore_unreachable y failed_when ajustan qué es un fallo","any_errors_fatal detiene el play en todos los hosts al primer error"],
pasos:[
 {t:"info", eti:"Recuperarse", h:"block, rescue y always",
  c:`<div class="termbox">- name: Desplegar con marcha atrás automática
  block:
    - name: Enlazar la nueva versión
      ansible.builtin.file: { src: "/opt/app/{{ version }}", dest: /opt/app/actual, state: link }
    - name: Reiniciar
      ansible.builtin.systemd_service: { name: app, state: restarted }
    - name: Comprobar salud
      ansible.builtin.uri: { url: "http://localhost:8080/salud" }
      register: salud
      until: salud.status == 200
      retries: 10
      delay: 3
  rescue:
    - name: Volver a la versión anterior
      ansible.builtin.file: { src: "/opt/app/{{ version_anterior }}", dest: /opt/app/actual, state: link }
    - ansible.builtin.systemd_service: { name: app, state: restarted }
    - ansible.builtin.fail:
        msg: "Falló {{ ansible_failed_task.name }}: se restauró {{ version_anterior }}"
  always:
    - name: Avisar al canal del equipo
      community.general.slack: { token: "{{ slack_token }}", msg: "Despliegue de {{ version }} en {{ inventory_hostname }} terminado" }
      delegate_to: localhost</div>
     <p>Si una tarea del <code>block</code> falla, el host no se da por perdido: pasa a <code>rescue</code>. Si el rescue termina bien, el host cuenta como <b>rescued</b> y el play sigue. Por eso el ejemplo acaba el rescue con <code>fail</code>: queremos que quede registrado como fallo aunque se haya restaurado.</p>`},
 {t:"orden", p:"En el ejemplo, la comprobación de salud falla. Ordena lo que ocurre",
  items:["Se enlaza la versión nueva y se reinicia","La comprobación de salud agota los reintentos y falla","Se ejecuta rescue: vuelve la versión anterior y se reinicia","fail marca el host como fallido con un mensaje claro","Se ejecuta always: se avisa al canal"],
  why:"<code>always</code> corre tanto si todo fue bien como si falló, igual que un <code>finally</code>."},
 {t:"hueco", p:"Completa la estructura para que la limpieza se haga pase lo que pase",
  tpl:`- ___:
    - name: Parar la replicación
      ansible.builtin.command: /opt/bd/parar-replica
  ___:
    - name: Registrar el error
      ansible.builtin.debug: { msg: "Falló {{ ansible_failed_task.name }}" }
  ___:
    - name: Borrar el bloqueo
      ansible.builtin.file: { path: /tmp/mantenimiento.lock, state: absent }`,
  banco:["block","rescue","always","try","catch","finally"],
  sol:["block","rescue","always"],
  why:"Es el try/catch/finally de Ansible. Un <code>block</code> también sirve sin rescue: para aplicar un mismo <code>when</code>, <code>become</code> o <code>tags</code> a varias tareas."},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["ignore_errors: true","Seguir aunque la tarea falle"],["ignore_unreachable: true","Seguir aunque el host no responda"],["failed_when","Definir tú qué resultado es un fallo"],["any_errors_fatal: true","Si falla un host, parar el play en todos"],["ansible.builtin.fail","Fallar a propósito con un mensaje"]],
  why:"<code>ignore_errors</code> no cubre hosts inalcanzables: para eso existe <code>ignore_unreachable</code>."},
 {t:"opcion", p:"Configuras un clúster de base de datos de 3 nodos: si falla la configuración en uno, no quieres que los otros dos sigan y queden a medias. ¿Qué usas?",
  ops:["ignore_errors: true","any_errors_fatal: true en el play","serial: 1","rescue vacío"],
  ok:1, why:"Por defecto, un host que falla se retira y los demás continúan. En sistemas donde todos deben quedar igual (clústeres, quórum), <code>any_errors_fatal</code> para todo."},
 {t:"escribe", p:"Dentro de <code>rescue</code>, ¿qué variable contiene la tarea que falló (por ejemplo, para mostrar su nombre)?",
  sol:["ansible_failed_task","ansible_failed_task.name"],
  pista:"ansible_failed_…",
  why:"También existe <code>ansible_failed_result</code>, con el resultado completo de esa tarea (mensaje de error, rc, stderr…)."},
 {t:"vf", p:"<code>ignore_errors: true</code> es buena práctica en tareas que a veces fallan, para que el playbook no se pare.",
  ok:false, why:"Esconde problemas y ansible-lint lo señala (<code>ignore-errors</code>). Mejor definir el fallo con <code>failed_when</code>, reintentar con <code>until</code> o recuperarse con <code>rescue</code>."}
]},

/* =============== U9 L2 =============== */
{
id:"an9n2",
titulo:"Delegación: delegate_to y run_once",
claves:["delegate_to ejecuta la tarea en otro host (o en localhost) pero con las variables del host actual","run_once ejecuta la tarea en un solo host del lote: migraciones, avisos, llamadas a una API","Plays contra APIs: hosts: localhost con connection: local"],
pasos:[
 {t:"info", eti:"Hacerlo en otro sitio", h:"delegate_to y run_once",
  c:`<div class="termbox">- hosts: web
  serial: 1
  tasks:
    - name: Sacar este servidor del balanceador
      community.general.haproxy:
        state: disabled
        host: "{{ inventory_hostname }}"
        backend: web
      delegate_to: "{{ item }}"
      loop: "{{ groups['balanceadores'] }}"

    - name: Migrar la base de datos (una vez, no una por servidor)
      ansible.builtin.command: /opt/app/bin/migrar
      run_once: true

    - name: Esperar a que el puerto 22 vuelva tras reiniciar
      ansible.builtin.wait_for: { host: "{{ ansible_host }}", port: 22, delay: 10 }
      delegate_to: localhost
      become: false</div>
     <p>Con <code>delegate_to</code>, la tarea <b>se ejecuta</b> en otro host pero <b>habla del</b> host actual: <code>inventory_hostname</code> sigue siendo web1. La salida lo indica así: <code>changed: [web1 -&gt; lb1]</code>.</p>`},
 {t:"par", p:"Empareja cada construcción con su uso",
  pares:[["delegate_to: localhost","Ejecutar en la máquina de control (llamar a una API, esperar un puerto)"],["delegate_to: lb1","Actuar sobre el balanceador en nombre de cada servidor"],["run_once: true","Una sola vez para todo el lote"],["delegate_facts: true","Guardar los facts recogidos en el host delegado, no en el actual"],["hosts: localhost + connection: local","Play entero contra APIs, sin SSH"]],
  why:"<code>local_action</code> es la forma antigua de <code>delegate_to: localhost</code>."},
 {t:"hueco", p:"Ejecuta la creación del esquema solo una vez, en el primer servidor de base de datos",
  tpl:`- name: Crear el esquema
  community.postgresql.postgresql_db:
    name: tareas
  ___: true
  ___: "{{ groups['bd'][0] }}"`,
  banco:["run_once","delegate_to","become","local_action","once","run_on"],
  sol:["run_once","delegate_to"],
  why:"<code>run_once</code> elige el primer host del lote; combinado con <code>delegate_to</code> decides exactamente dónde."},
 {t:"opcion", p:"Un play con <code>serial: 2</code> sobre 6 hosts tiene una tarea <code>run_once: true</code> de migración. ¿Cuántas veces se ejecuta?",
  ops:["Una vez","Tres veces: una por cada tanda","Seis veces","Ninguna"],
  ok:1, why:"run_once significa «una vez por lote». Con serial, cada tanda es un lote. Si solo debe ocurrir una vez, sácala a un play anterior sin serial o añade una condición."},
 {t:"term", p:"Lanza <code>despliegue.yml</code> y observa la delegación. Hazlo con el inventario <code>produccion</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook -i produccion despliegue.yml","ansible-playbook despliegue.yml -i produccion"],
  pista:"ansible-playbook -i inventario playbook",
  salida:`TASK [Sacar este servidor del balanceador] ****
changed: [web1.catappa.dev -> lb1.catappa.dev] => (item=lb1.catappa.dev)
TASK [Migrar la base de datos (una vez, no una por servidor)] ****
changed: [web1.catappa.dev]
TASK [Esperar a que el puerto 22 vuelva tras reiniciar] ****
ok: [web1.catappa.dev -> localhost]`,
  why:"La flecha <code>-&gt;</code> indica dónde se ejecutó realmente. Si ves <code>-&gt; localhost</code> en una tarea que debía tocar el nodo, sobra un delegate_to."},
 {t:"vf", p:"En una tarea con <code>delegate_to: lb1</code>, la variable <code>inventory_hostname</code> vale <code>lb1</code>.",
  ok:false, why:"Sigue valiendo el host del play (web1). Por eso puedes escribir <code>host: \"{{ inventory_hostname }}\"</code> para decirle al balanceador a quién sacar."},
 {t:"opcion", p:"Una tarea delegada en <code>localhost</code> falla con «sudo: a password is required». ¿Por qué?",
  ops:["El nodo no tiene sudo","El play tiene become: true y se hereda: intenta hacer sudo en tu máquina de control","localhost no existe","Falta run_once"],
  ok:1, why:"Pon <code>become: false</code> en las tareas delegadas a localhost que no necesitan privilegios."}
]},

/* =============== U9 L3 =============== */
{
id:"an9n3",
titulo:"Rendimiento: forks, pipelining y estrategias",
claves:["forks (5 por defecto) marca cuántos hosts se atienden a la vez","pipelining y ControlPersist reducen las conexiones SSH por tarea","Estrategias linear, free y host_pinned; async y poll para tareas largas; profile_tasks para medir"],
pasos:[
 {t:"info", eti:"Más rápido", h:"Dónde se va el tiempo",
  c:`<div class="termbox"># ansible.cfg
[defaults]
forks = 50                         # por defecto solo 5
gathering = smart                  # no volver a recoger facts si ya están en caché
fact_caching = jsonfile
fact_caching_connection = .facts_cache
callbacks_enabled = ansible.posix.profile_tasks, ansible.posix.timer

[ssh_connection]
pipelining = True                  # el módulo va por la conexión abierta, sin copiar ficheros
ssh_args = -o ControlMaster=auto -o ControlPersist=60s   # reutilizar la conexión SSH</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">palancas de rendimiento</div><table class="dg-tabla"><thead><tr><th>Palanca</th><th>Efecto</th><th>Cuidado</th></tr></thead><tbody>
       <tr><td>forks</td><td>más hosts en paralelo</td><td>CPU y memoria de la máquina de control</td></tr>
       <tr><td>pipelining</td><td>menos operaciones SSH por tarea</td><td>requiere que sudoers no tenga <code>requiretty</code></td></tr>
       <tr><td>facts</td><td>gather_facts: false, subset o caché</td><td>las plantillas que usen facts</td></tr>
       <tr><td>listas en módulos</td><td>un apt con 20 paquetes en vez de 20 vueltas</td><td>ninguno</td></tr>
     </tbody></table></div>`},
 {t:"term", p:"Lanza <code>sitio.yml</code> atendiendo a 50 hosts a la vez, sin tocar el ansible.cfg",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml -f 50","ansible-playbook sitio.yml --forks 50","ansible-playbook -f 50 sitio.yml","ansible-playbook --forks=50 sitio.yml","ansible-playbook sitio.yml --forks=50"],
  pista:"-f o --forks.",
  salida:`PLAY RECAP ************************************
...
Playbook run took 0 days, 0 hours, 3 minutes, 12 seconds`,
  why:"Con 200 hosts y forks=5, cada tarea se hace en 40 rondas; con 50, en 4. La línea final la añade el callback <code>timer</code>."},
 {t:"info", eti:"Estrategias y tareas largas", h:"strategy, async y throttle",
  c:`<div class="termbox">- hosts: web
  strategy: free            # cada host avanza a su ritmo, sin esperar a los demás
  tasks:
    - name: Actualizar todo (puede tardar 20 minutos)
      ansible.builtin.dnf: { name: "*", state: latest }
      async: 1800           # tiempo máximo en segundos
      poll: 15              # comprobar cada 15 s sin mantener SSH abierto

    - name: Llamar a la API de un proveedor con límite de peticiones
      ansible.builtin.uri: { url: "https://api.proveedor.dev/registrar/{{ inventory_hostname }}" }
      throttle: 2           # como mucho 2 hosts a la vez en ESTA tarea</div>
     <p><code>linear</code> (por defecto): todos los hosts terminan una tarea antes de pasar a la siguiente. <code>free</code>: los rápidos no esperan a los lentos. <code>host_pinned</code>: como free, pero cada fork se queda con su host hasta terminarlo. Con <code>poll: 0</code> la tarea se lanza y se olvida; su estado se consulta después con <code>async_status</code>.</p>`},
 {t:"par", p:"Empareja cada ajuste con su efecto",
  pares:[["forks = 50","Hasta 50 hosts atendidos en paralelo"],["pipelining = True","Menos conexiones SSH por tarea: más rápido"],["strategy: free","Los hosts no se esperan entre sí"],["async + poll","Tareas largas sin conexión SSH abierta todo el rato"],["throttle: 2","Limitar el paralelismo de una tarea concreta"],["profile_tasks","Ver cuánto tarda cada tarea"]],
  why:"Antes de optimizar, mide: <code>profile_tasks</code> ordena las tareas por duración y suele revelar una sola tarea culpable."},
 {t:"hueco", p:"Lanza la copia de seguridad larga en segundo plano (máximo una hora) y comprueba su estado cada 30 segundos",
  tpl:`- name: Copia completa
  ansible.builtin.command: /usr/local/bin/backup-completo
  ___: 3600
  ___: 30`,
  banco:["async","poll","timeout","retries","delay","wait"],
  sol:["async","poll"],
  why:"Sin async, una tarea que tarda más que el timeout de SSH puede cortarse; con async, el nodo la ejecuta de forma independiente."},
 {t:"opcion", p:"Activas <code>pipelining = True</code> y las tareas con become fallan con «sudo: sorry, you must have a tty to run sudo». ¿Qué pasa?",
  ops:["pipelining no es compatible con sudo","El sudoers de esos nodos tiene Defaults requiretty; hay que quitarlo (o desactivar pipelining)","Falta forks","Hay que usar su"],
  ok:1, why:"Con pipelining no hay terminal. Las distribuciones actuales ya no activan requiretty, pero imágenes antiguas sí."},
 {t:"vf", p:"Subir forks a 500 en un portátil siempre acelera un playbook sobre 500 hosts.",
  ok:false, why:"Cada fork es un proceso de Python con su memoria: la máquina de control puede quedarse sin RAM o CPU. Se sube poco a poco midiendo."}
]},

/* =============== U9 L4 =============== */
{
id:"an5l1",
titulo:"Despliegues rodantes con serial",
claves:["serial despliega por tandas (rolling): un número, un porcentaje o una lista creciente","max_fail_percentage detiene el despliegue si fallan demasiados","pre_tasks y post_tasks sacan y devuelven cada servidor del balanceador"],
pasos:[
 {t:"info", eti:"Muchos servidores", h:"Despliegue por tandas",
  c:`<div class="termbox">- hosts: web
  serial:                       # canario, luego tandas mayores
    - 1
    - 5
    - "25%"
  max_fail_percentage: 10       # parar si falla más del 10% de una tanda
  pre_tasks:
    - name: Sacar del balanceador
      community.aws.elb_target: { target_group_arn: "{{ tg }}", target_id: "{{ ec2_id }}", state: absent }
      delegate_to: localhost
  roles: [app_java]
  post_tasks:
    - name: Esperar a que la app responda
      ansible.builtin.uri: { url: "http://localhost:8080/actuator/health", status_code: 200 }
      register: salud
      until: salud.status == 200
      retries: 20
      delay: 3
    - name: Volver al balanceador
      community.aws.elb_target: { target_group_arn: "{{ tg }}", target_id: "{{ ec2_id }}", state: present }
      delegate_to: localhost</div>
     <p>Con <code>serial</code>, el play entero (pre_tasks, roles, tasks, post_tasks y handlers) se ejecuta tanda a tanda. Si una tanda supera <code>max_fail_percentage</code>, las siguientes no empiezan: el daño se queda en unos pocos servidores.</p>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["serial","Aplicar a los servidores por tandas"],["max_fail_percentage","Abortar si fallan demasiados"],["delegate_to: localhost","Ejecutar esa tarea en la máquina de control"],["forks","Servidores en paralelo"],["pipelining","Menos conexiones SSH por tarea: más rápido"]],
  why:"Así se hace un rolling update sin caída con máquinas tradicionales."},
 {t:"codigo", p:"Calcula las tandas de <code>serial</code>: lee el número de hosts y los valores de serial, e imprime el tamaño de cada tanda separados por espacios",
  lenguaje:"py",
  c:`<p>Primera línea: número total de hosts. Segunda línea: valores de <code>serial</code> separados por espacios (números o porcentajes como <code>25%</code>). Reglas de Ansible: cada tanda usa el siguiente valor de la lista y, cuando se acaba, se repite el último. Un porcentaje se calcula sobre el <b>total</b> de hosts, se trunca a entero y, si da 0, vale 1. La última tanda puede ser más pequeña. Un serial de 0 significa «todos a la vez».</p>`,
  plantilla:"total = int(input())\nvalores = input().split()\n# imprime el tamaño de cada tanda separados por espacios\n",
  pruebas:[
   {entrada:"10\n1 5 25%", salida:"1 5 2 2"},
   {entrada:"7\n3", salida:"3 3 1"},
   {entrada:"3\n10%", salida:"1 1 1", oculta:true},
   {entrada:"20\n2 50%", salida:"2 10 8", oculta:true},
   {entrada:"5\n0", salida:"5", oculta:true}
  ],
  pista:"Convierte cada valor con una función: si acaba en %, int(total * pct / 100) o 1 si da 0. Recorre mientras queden hosts, avanzando en la lista sin pasar del último.",
  solucion:"total = int(input())\nvalores = input().split()\n\ndef tam(v):\n    if v.endswith('%'):\n        return int(total * int(v[:-1]) / 100) or 1\n    return int(v)\n\nquedan = total\ni = 0\ntandas = []\nwhile quedan > 0:\n    n = tam(valores[min(i, len(valores) - 1)])\n    if n <= 0:\n        n = quedan\n    n = min(n, quedan)\n    tandas.append(n)\n    quedan -= n\n    i += 1\nprint(' '.join(str(t) for t in tandas))",
  why:"La lista creciente (1, 5, 25%) es un despliegue canario: si el primer servidor falla, solo uno se ha visto afectado."},
 {t:"hueco", p:"Despliega primero en un solo servidor, luego en tandas del 30%, y detente ante cualquier fallo",
  tpl:`- hosts: api
  ___:
    - 1
    - "30%"
  ___: 0
  roles: [api]`,
  banco:["serial","max_fail_percentage","forks","throttle","any_errors","batch"],
  sol:["serial","max_fail_percentage"],
  why:"El umbral se compara con «más de»: con 0, basta un host fallido en la tanda para abortar."},
 {t:"orden", p:"Ordena lo que le ocurre a cada servidor en un despliegue rodante bien hecho",
  items:["Sacarlo del balanceador y esperar a que se vacíen las conexiones","Desplegar la versión nueva y reiniciar","Comprobar la salud con reintentos","Devolverlo al balanceador","Pasar al siguiente servidor o tanda"],
  why:"Si la comprobación de salud falla, el servidor queda fuera del balanceador: los usuarios no lo notan y tú investigas."},
 {t:"opcion", p:"En una arquitectura con contenedores y Kubernetes, ¿dónde sigue siendo útil Ansible?",
  ops:["En ningún sitio","Preparar máquinas base o nodos, equipos de red, servidores que no son contenedores, y tareas de operación puntuales","Para sustituir a Kubernetes","Para compilar Java"],
  ok:1, why:"Con infraestructura inmutable, gran parte de la configuración se hace al construir la imagen."},
 {t:"vf", p:"Con <code>serial</code>, los handlers se ejecutan al final de cada tanda, no al final de todo el despliegue.",
  ok:true, why:"Cada tanda es un play completo en miniatura: sus servidores se reinician y se comprueban antes de pasar a la siguiente."}
]}

]});
