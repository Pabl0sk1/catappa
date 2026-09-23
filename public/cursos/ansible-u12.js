window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Maestría: casos reales y entrevista",
resumen: "Un parcheo de flota completo, diagnóstico de errores de producción, decisiones de diseño de un proyecto grande y simulacro de entrevista",
nivel: "Maestro",
color: "#c94a4a",
lecciones: [

/* =============== U12 L1 =============== */
{
id:"an12n1",
titulo:"Caso real: parchear una flota sin cortes",
claves:["Canario y tandas con serial, freno con max_fail_percentage","Comprobaciones previas con assert; reiniciar solo si hace falta, con el módulo reboot","Sacar del balanceador, parchear, comprobar salud y devolver; informe al final"],
pasos:[
 {t:"info", eti:"El encargo", h:"Parche de seguridad urgente en 120 servidores",
  c:`<p>Ha salido una vulnerabilidad crítica de OpenSSL. Tienes 120 servidores Ubuntu detrás de un balanceador, tráfico real y ninguna ventana de mantenimiento. El playbook:</p>
     <div class="termbox">- name: Parche de seguridad
  hosts: web
  become: true
  serial: [1, "10%", "25%"]
  max_fail_percentage: 0
  pre_tasks:
    - name: Hay espacio en disco
      ansible.builtin.assert:
        that: (ansible_facts['mounts'] | selectattr('mount', 'equalto', '/') | first).size_available &gt; 1073741824
        fail_msg: "Menos de 1 GB libre en /"
    - name: Sacar del balanceador
      community.general.haproxy: { state: disabled, host: "{{ inventory_hostname }}", backend: web, wait: true }
      delegate_to: "{{ groups['balanceadores'][0] }}"
  tasks:
    - name: Actualizar paquetes
      ansible.builtin.apt: { upgrade: dist, update_cache: true }
    - name: ¿Hace falta reiniciar?
      ansible.builtin.stat: { path: /var/run/reboot-required }
      register: reinicio
    - name: Reiniciar si hace falta
      ansible.builtin.reboot: { reboot_timeout: 600 }
      when: reinicio.stat.exists
  post_tasks:
    - name: La aplicación responde
      ansible.builtin.uri: { url: "http://localhost/salud" }
      register: salud
      until: salud.status == 200
      retries: 20
      delay: 5
    - name: Volver al balanceador
      community.general.haproxy: { state: enabled, host: "{{ inventory_hostname }}", backend: web }
      delegate_to: "{{ groups['balanceadores'][0] }}"</div>`},
 {t:"orden", p:"Ordena lo que le ocurre al primer servidor (el canario)",
  items:["Se comprueba que hay espacio en disco","Se saca del balanceador esperando a que se vacíe","Se actualizan los paquetes","Se reinicia solo si existe /var/run/reboot-required","Se espera a que la aplicación responda","Vuelve al balanceador y empieza la tanda del 10%"],
  why:"Si cualquier paso falla en el canario, <code>max_fail_percentage: 0</code> detiene todo: un servidor fuera del balanceador y 119 intactos."},
 {t:"hueco", p:"Reinicia solo cuando el sistema lo pida, y espera como mucho 10 minutos a que vuelva",
  tpl:`- ansible.builtin.stat: { path: /var/run/reboot-required }
  register: reinicio

- ansible.builtin.___:
    reboot_timeout: ___
  when: reinicio.stat.___`,
  banco:["reboot","600","exists","command","60","present"],
  sol:["reboot","600","exists"],
  why:"El módulo <code>reboot</code> reinicia, espera a que vuelva SSH y comprueba que el sistema responde: nada de <code>shell: reboot</code> y esperas a ojo. En RHEL, el equivalente es <code>needs-restarting -r</code>."},
 {t:"term", p:"Antes de nada, lanza el parche <code>parche.yml</code> solo sobre <code>web1.catappa.dev</code> para probarlo",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook parche.yml --limit web1.catappa.dev","ansible-playbook parche.yml -l web1.catappa.dev","ansible-playbook -i inventario.ini parche.yml --limit web1.catappa.dev","ansible-playbook --limit web1.catappa.dev parche.yml"],
  pista:"--limit (o -l) con el host.",
  salida:`TASK [Reiniciar si hace falta] *******
changed: [web1.catappa.dev]
TASK [La aplicación responde] ********
FAILED - RETRYING: [web1.catappa.dev]: La aplicación responde (20 retries left).
ok: [web1.catappa.dev]
PLAY RECAP ***************************
web1.catappa.dev : ok=9 changed=3 unreachable=0 failed=0`,
  why:"El primer reintento es normal: la app tarda unos segundos en arrancar tras el reinicio. Para eso están <code>until</code> y <code>retries</code>."},
 {t:"opcion", p:"El canario falla en «La aplicación responde» tras el reinicio. ¿Qué haces?",
  ops:["Relanzar con ignore_errors","Nada se ha propagado: investigar en ese servidor (logs de la app, versión de la biblioteca actualizada), arreglar el rol o fijar la versión y volver a lanzar","Lanzar sin serial para acabar antes","Devolverlo al balanceador a mano y seguir"],
  ok:1, why:"El canario ha hecho su trabajo: detectar el problema con un solo servidor afectado y fuera de tráfico."},
 {t:"opcion", p:"El parche debe aplicarse en 20 minutos en toda la flota y cada servidor tarda 4. ¿Cómo ajustas?",
  ops:["serial: 1 para ir seguro","Mantener el canario y subir las tandas (por ejemplo [1, \"20%\", \"40%\"]) comprobando que el balanceador aguanta sin ese porcentaje de servidores","Quitar las comprobaciones de salud","forks: 1"],
  ok:1, why:"Con serial: 1 tardarías 8 horas. El límite real del tamaño de tanda es la capacidad que te queda con esos servidores fuera."},
 {t:"vf", p:"En un playbook de parcheo, que sacar y devolver al balanceador salgan como <i>changed</i> en cada ejecución es un fallo de idempotencia que hay que corregir.",
  ok:false, why:"Son acciones operativas: cambian el estado a propósito cada vez. La idempotencia se exige al estado final (paquetes, configuración); en una operación como un parcheo, ciertos cambios son esperados y deben ser los únicos."},
 {t:"escribe", p:"¿Qué fichero crea Ubuntu cuando una actualización necesita reiniciar el sistema? (ruta completa)",
  sol:["/var/run/reboot-required","/run/reboot-required"],
  pista:"Está en /var/run/.",
  why:"Junto a él, <code>/var/run/reboot-required.pkgs</code> dice qué paquetes lo piden: útil para el informe."}
]},

/* =============== U12 L2 =============== */
{
id:"an12n2",
titulo:"Errores de producción y cómo diagnosticarlos",
claves:["Síntoma, causa probable y primera comprobación: SSH, sudo, bloqueos, precedencia, idempotencia","-vvvv, ansible-inventory --host, debug y profile_tasks son las herramientas de diagnóstico","Una plantilla que cambia en cada ejecución o un handler que no llega son fallos de diseño, no de suerte"],
pasos:[
 {t:"info", eti:"Guardia", h:"Síntomas clásicos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">del síntoma a la causa</div><table class="dg-tabla"><thead><tr><th>Síntoma</th><th>Causa probable</th><th>Primera comprobación</th></tr></thead><tbody>
       <tr><td>UNREACHABLE en todos</td><td>clave SSH, usuario, bastión, red</td><td><code>ssh</code> a mano; <code>-vvvv</code> para ver el comando SSH</td></tr>
       <tr><td>Host key verification failed</td><td>instancias nuevas o reconstruidas</td><td><code>ssh-keyscan</code> al crearlas; no desactivar la verificación en producción</td></tr>
       <tr><td>Se queda colgado en una tarea</td><td>sudo pidiendo contraseña, bloqueo de apt, comando interactivo</td><td><code>-vvvv</code>; <code>ps</code> en el nodo; <code>async</code> o <code>timeout</code></td></tr>
       <tr><td>Una variable tiene un valor inesperado</td><td>precedencia (vars/ de un rol, host_vars olvidado)</td><td><code>ansible-inventory --host</code> y <code>debug</code></td></tr>
       <tr><td>changed en cada ejecución</td><td>command sin changed_when, fecha en una plantilla, dos tareas pisándose</td><td>ejecutar dos veces con <code>--diff</code></td></tr>
       <tr><td>El servicio no recogió la configuración</td><td>el play falló antes de los handlers</td><td><code>--force-handlers</code> o <code>flush_handlers</code></td></tr>
       <tr><td>Lento</td><td>forks bajos, facts, bucles de paquetes</td><td><code>profile_tasks</code></td></tr>
     </tbody></table></div>`},
 {t:"opcion", p:"Un playbook se queda colgado indefinidamente en «Instalar paquetes» solo en algunos servidores Ubuntu. ¿Qué es lo más probable?",
  ops:["Un error de sintaxis","unattended-upgrades tiene el bloqueo de apt; la tarea espera a que se libere","Falta Python","El inventario está mal"],
  ok:1, why:"Confírmalo con <code>ps aux | grep apt</code> en el nodo. El módulo apt tiene <code>lock_timeout</code> para no esperar para siempre."},
 {t:"opcion", p:"Tras cada ejecución, la tarea del <code>motd</code> sale como changed y dispara un handler. La plantilla contiene <code>Actualizado: {{ ansible_facts['date_time']['iso8601'] }}</code>. ¿Qué pasa?",
  ops:["Un fallo de Ansible","La fecha cambia cada vez, así que el fichero generado siempre es distinto: la plantilla no es idempotente","Falta become","El handler está mal escrito"],
  ok:1, why:"Nada que cambie en cada ejecución debe ir en una plantilla: fechas, números aleatorios, orden de diccionarios no fijado. Pon datos estables (versión, commit)."},
 {t:"opcion", p:"Instancias nuevas del autoescalado fallan con «Host key verification failed». ¿Qué solución es correcta en producción?",
  ops:["host_key_checking = False para siempre","Registrar las claves de host al crear las instancias (ssh-keyscan desde el pipeline, o certificados de host SSH firmados por una CA)","Borrar known_hosts cada vez","Usar contraseñas"],
  ok:1, why:"Desactivar la verificación abre la puerta a ataques de intermediario. Los certificados de host SSH resuelven el problema a escala."},
 {t:"term", p:"Ejecuta <code>sitio.yml</code> solo en <code>web7.catappa.dev</code> con el máximo detalle de conexión para ver por qué es inalcanzable",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml --limit web7.catappa.dev -vvvv","ansible-playbook sitio.yml -l web7.catappa.dev -vvvv","ansible-playbook -vvvv sitio.yml --limit web7.catappa.dev","ansible-playbook sitio.yml -vvvv --limit web7.catappa.dev","ansible-playbook -vvvv sitio.yml -l web7.catappa.dev"],
  pista:"--limit con el host y cuatro uves.",
  salida:`<web7.catappa.dev> SSH: EXEC ssh -vvv -C -o ControlMaster=auto -o ControlPersist=60s -o 'User="despliegue"' -o ConnectTimeout=10 10.0.3.27 '/bin/sh -c '"'"'echo ~despliegue && sleep 0'"'"''
<web7.catappa.dev> (255, b'', b'...debug1: connect to address 10.0.3.27 port 22: Connection timed out\\r\\n')
fatal: [web7.catappa.dev]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh: ssh: connect to host 10.0.3.27 port 22: Connection timed out", "unreachable": true}`,
  why:"«Connection timed out» es red o cortafuegos (grupo de seguridad, ACL); «Permission denied (publickey)» sería la clave; «Connection refused», sshd parado."},
 {t:"par", p:"Empareja cada mensaje de SSH con su causa más probable",
  pares:[["Connection timed out","Red o cortafuegos bloquean el puerto"],["Connection refused","El servidor responde pero sshd no escucha"],["Permission denied (publickey)","La clave o el usuario no son los correctos"],["Host key verification failed","La clave del servidor no coincide con known_hosts"],["sudo: a password is required","become sin contraseña configurada ni -K"]],
  why:"Leer bien el mensaje ahorra la mitad del diagnóstico."},
 {t:"vf", p:"Si un valor de variable no es el esperado, lo primero es mirar la precedencia con <code>ansible-inventory --host</code> y una tarea <code>debug</code> en el host afectado.",
  ok:true, why:"<code>ansible-inventory</code> enseña lo que viene del inventario; <code>debug</code>, el valor final dentro del play, que incluye roles, vars del play y -e."}
]},

/* =============== U12 L3 =============== */
{
id:"an12n3",
titulo:"Diseño: un proyecto de Ansible a escala",
claves:["Estructura clara: inventarios por entorno, playbooks finos, roles con una sola responsabilidad","Roles compartidos entre equipos en colecciones versionadas; el proyecto las fija en requirements.yml","Decisiones explícitas: qué va en defaults, qué en group_vars, qué en -e; y quién es dueño de cada rol"],
pasos:[
 {t:"info", eti:"Arquitectura", h:"Estructura recomendada",
  c:`<div class="dg dg-arbol"><div class="dg-tit">repositorio de infraestructura</div><div class="rama" style="--n:0"><span class="nom carpeta">infra/</span></div><div class="rama" style="--n:1"><span class="nom">ansible.cfg</span></div><div class="rama" style="--n:1"><span class="nom">requirements.yml</span><span class="coment">colecciones y roles con versión</span></div><div class="rama" style="--n:1"><span class="nom">execution-environment.yml</span></div><div class="rama" style="--n:1"><span class="nom">.ansible-lint</span></div><div class="rama" style="--n:1"><span class="nom carpeta">inventarios/</span></div><div class="rama" style="--n:2"><span class="nom carpeta">staging/</span><span class="coment">hosts, group_vars, host_vars</span></div><div class="rama" style="--n:2"><span class="nom carpeta">produccion/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">playbooks/</span></div><div class="rama" style="--n:2"><span class="nom">sitio.yml</span><span class="coment">import_playbook de los demás</span></div><div class="rama" style="--n:2"><span class="nom">web.yml</span><span class="coment">hosts: web, roles: [comun, nginx, app]</span></div><div class="rama" style="--n:2"><span class="nom">parche.yml</span></div><div class="rama" style="--n:1"><span class="nom carpeta">roles/</span><span class="coment">roles propios de este proyecto</span></div><div class="rama" style="--n:2"><span class="nom carpeta">app/</span><span class="coment">con molecule/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">.github/workflows/</span></div></div>
     <p>Los playbooks solo dicen <b>qué roles van a qué grupos</b>; la lógica vive en roles; los datos de cada entorno, en el inventario. Si un rol lo usan varios proyectos, se saca a una colección con su propio repositorio, sus pruebas y sus versiones.</p>`},
 {t:"par", p:"Empareja cada dato con dónde debe vivir",
  pares:[["Puerto por defecto de un rol","defaults/main.yml del rol"],["Número de réplicas en producción","group_vars del inventario de producción"],["Versión que se despliega hoy","-e en el lanzamiento (o variable del pipeline)"],["Nombre del paquete según la distribución","vars/ del rol"],["Contraseña de la base de datos","vault.yml cifrado o gestor de secretos"]],
  why:"Cuando cada tipo de dato tiene su sitio, nadie pierde una tarde buscando «de dónde sale este valor»."},
 {t:"opcion", p:"Tres equipos copian y pegan el mismo rol de Nginx en sus repositorios y ya han divergido. ¿Qué propones?",
  ops:["Seguir así, cada uno lo adapta","Una colección interna con el rol, pruebas con Molecule y versiones semánticas; cada equipo la fija en su requirements.yml y la parametriza con defaults","Un único repositorio gigante para toda la empresa sin versiones","Prohibir Nginx"],
  ok:1, why:"Versionar permite que cada equipo actualice cuando pueda y que los cambios incompatibles se anuncien con una versión mayor."},
 {t:"opcion", p:"Un rol «servidor_web» instala Nginx, la app, PostgreSQL y configura copias de seguridad. ¿Qué problema de diseño tiene?",
  ops:["Ninguno, así es más cómodo","Demasiadas responsabilidades: no se puede reutilizar ni probar por partes; mejor roles pequeños (nginx, app, postgresql, backup) combinados en el playbook","Le falta un handler","Debería ser un solo playbook sin roles"],
  ok:1, why:"Igual que en el código: una responsabilidad por rol. El playbook es donde se componen."},
 {t:"orden", p:"Ordena cómo introducirías Ansible en una empresa que configura todo a mano",
  items:["Inventario y comandos ad hoc de solo lectura para conocer la flota","Un rol «comun» (usuarios, SSH, NTP) probado en staging","Lint y Molecule en CI desde el primer rol","Ir cubriendo servicios uno a uno, empezando por los más repetidos","Controlador (AWX o AAP) cuando haya varios equipos lanzando"],
  why:"Empezar por leer (sin cambiar nada) genera confianza; la calidad desde el principio evita deuda."},
 {t:"vf", p:"Es buena idea que un playbook de despliegue contenga directamente 200 tareas sin roles, porque así se lee de arriba abajo.",
  ok:false, why:"Se vuelve imposible de reutilizar, probar y revisar. Con roles, cada pieza se prueba aislada y el playbook queda en veinte líneas."},
 {t:"escribe", p:"¿Cómo se llama la instrucción que usa un <code>sitio.yml</code> para encadenar <code>web.yml</code>, <code>bd.yml</code> y <code>monitorizacion.yml</code>?",
  sol:["import_playbook","ansible.builtin.import_playbook"],
  pista:"import_…",
  why:"Así puedes lanzar todo con sitio.yml o una sola parte con su playbook, sin duplicar nada."}
]},

/* =============== U12 L4 =============== */
{
id:"an5l2",
titulo:"Simulacro de entrevista de Ansible",
claves:["Sabes explicar idempotencia, inventarios, playbooks, roles y precedencia","Gestionas secretos, errores, pruebas y despliegues rodantes","Sabes cuándo usar Ansible y cuándo otra herramienta"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Preguntas reales de entrevistas para puestos de DevOps, SRE y administración de sistemas (y del tipo de razonamiento que pide el RHCE). Responde en voz alta antes de elegir: en la entrevista no hay opciones.</p>`},
 {t:"opcion", p:"«¿Qué significa que Ansible es agentless?»",
  ops:["Que no tiene interfaz","Que no requiere instalar software propio en los servidores gestionados: se conecta por SSH y ejecuta módulos con el Python del destino","Que no usa red","Que no necesita inventario"],
  ok:1, why:"Menos que mantener en cada servidor frente a Puppet o Chef."},
 {t:"opcion", p:"«¿Cómo garantizas que un playbook es idempotente?»",
  ops:["No se puede","Usando módulos declarativos en vez de shell, changed_when y creates cuando no hay módulo, y comprobándolo con una segunda ejecución (Molecule)","Ejecutándolo una vez","Con más handlers"],
  ok:1, why:"La segunda ejecución debe dar changed=0."},
 {t:"opcion", p:"«¿Terraform o Ansible para crear instancias EC2?»",
  ops:["Ansible siempre","Terraform, que gestiona el ciclo de vida con estado y planes; Ansible después para configurarlas si hace falta","Ninguno","Ambos a la vez para lo mismo"],
  ok:1, why:"Ansible puede crear recursos en la nube, pero sin estado ni plan como Terraform."},
 {t:"opcion", p:"«¿Cómo manejas contraseñas en Ansible?»",
  ops:["En texto plano en group_vars","Cifradas con ansible-vault o leídas de un gestor de secretos en ejecución, con no_log: true en las tareas que las usan","En comentarios","En el inventario"],
  ok:1, why:"no_log evita que aparezcan en la salida."},
 {t:"opcion", p:"«¿Diferencia entre import_tasks e include_tasks?»",
  ops:["Ninguna, son sinónimos","import es estático y se resuelve al cargar (propaga when y tags, no admite loop); include es dinámico, se resuelve al ejecutar y admite loop y nombres calculados","include es más antiguo y está obsoleto","import solo funciona en roles"],
  ok:1, why:"Buena respuesta de entrevista: añade un ejemplo de cuándo usarías cada uno."},
 {t:"opcion", p:"«Un handler no se ejecutó aunque la configuración cambió. ¿Por qué puede ser?»",
  ops:["Los handlers son aleatorios","El play falló después de la notificación (y no había force_handlers), el nombre de notify no coincide, o la tarea no dio changed","Porque había más de un handler","Por el número de forks"],
  ok:1, why:"Y la consecuencia peligrosa: en la siguiente ejecución la tarea ya no cambia, así que el handler nunca llega sin intervención."},
 {t:"opcion", p:"«Tienes 500 servidores y el playbook tarda una hora. ¿Qué miras?»",
  ops:["Comprar una máquina más grande sin medir","Medir con profile_tasks; luego forks, pipelining y ControlPersist, facts (desactivar o cachear), listas en vez de bucles de paquetes y estrategia free si los hosts son independientes","Quitar las comprobaciones","Ejecutar de noche"],
  ok:1, why:"Medir primero: a menudo una sola tarea (un bucle o un apt update sin caché) se lleva la mitad del tiempo."},
 {t:"opcion", p:"«¿Cómo harías un despliegue sin cortes en 20 servidores detrás de un balanceador?»",
  ops:["Todos a la vez, de noche","serial con canario, max_fail_percentage, pre_tasks para sacar del balanceador, comprobación de salud con until y post_tasks para devolverlo","Reiniciar el balanceador","Con strategy: free"],
  ok:1, why:"Menciona también la marcha atrás (block/rescue o volver a la versión anterior) y run_once para migraciones."},
 {t:"opcion", p:"«Un valor en group_vars no se aplica. ¿Qué compruebas?»",
  ops:["Reinstalar Ansible","El nombre del fichero y del grupo, que no haya host_vars, vars/ de rol, vars del play, set_fact o -e con más precedencia, usando ansible-inventory --host y debug","Borrar la caché de Python","Cambiar a INI"],
  ok:1, why:"La trampa más citada: <code>vars/main.yml</code> de un rol gana al inventario."},
 {t:"vf", p:"«--check garantiza que la ejecución real hará exactamente lo mismo que muestra el ensayo.»",
  ok:false, why:"Es una estimación: command y shell se saltan y las tareas que dependen de cambios anteriores pueden comportarse distinto. Muy útil, no infalible."},
 {t:"escribe", p:"«¿Qué módulo usarías para validar requisitos al inicio de un rol y fallar con un mensaje claro?»",
  sol:["assert","ansible.builtin.assert"],
  pista:"Comprueba condiciones con that.",
  why:"Fallar pronto y con un mensaje claro ahorra depurar errores extraños veinte tareas después."},
 {t:"info", eti:"Terminado", h:"Has completado Ansible",
  c:`<p>Dominas la arquitectura sin agentes, inventarios estáticos y dinámicos, comandos ad hoc, playbooks y módulos, variables y su precedencia, facts, condicionales, bucles, handlers, plantillas Jinja2, filtros y lookups, roles y colecciones, Vault, check, diff y tags, manejo de errores, delegación, rendimiento, despliegues rodantes, ansible-lint, Molecule, CI/CD, execution environments, AWX y el encaje con Terraform.</p>
     <p>Para consolidarlo: crea con Terraform tres máquinas y configúralas con roles propios (común, Nginx, tu API) probados con Molecule en Ubuntu y Rocky; cifra los secretos con Vault; despliega por tandas con canario desde GitHub Actions dentro de tu propio execution environment. Si vas a por el RHCE, practica con el reloj en marcha y solo con <code>ansible-doc</code>.</p>`}
]}

]});
