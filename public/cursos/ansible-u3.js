window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Variables, plantillas y handlers",
resumen: "Variables y su precedencia, facts, plantillas Jinja2, handlers, condicionales y bucles",
nivel: "Intermedio",
color: "#e45f5f",
lecciones: [

{
id:"an3l1",
titulo:"Variables, facts y plantillas",
claves:["Variables en group_vars, host_vars, vars del play y la línea de comandos","Facts: datos recogidos del servidor (sistema, memoria, IPs)","Plantillas Jinja2 con {{ variable }}, condicionales y bucles"],
pasos:[
 {t:"info", eti:"Parametrizar", h:"Variables y plantillas",
  c:`<div class="diag">infra/
  inventario.ini
  group_vars/
    web.yml          puerto_api: 8080, dominio: tareas.catappa.dev
    all.yml          zona_horaria: Europe/Madrid
  host_vars/
    web1.catappa.dev.yml
  templates/
    tareas.conf.j2</div>
     <div class="termbox"># templates/tareas.conf.j2
server {
    listen 443 ssl;
    server_name {{ dominio }};
    location / {
        proxy_pass http://127.0.0.1:{{ puerto_api }};
    }
    # generado por Ansible en {{ ansible_hostname }} ({{ ansible_distribution }})
}

# tarea
- name: Configurar el sitio
  ansible.builtin.template:
    src: tareas.conf.j2
    dest: /etc/nginx/sites-available/tareas.conf
  notify: Recargar nginx</div>`},
 {t:"par", p:"Empareja cada ubicación de variables con su ámbito",
  pares:[["group_vars/web.yml","Todos los servidores del grupo web"],["host_vars/web1.yml","Solo ese servidor"],["vars: en el play","Solo ese play"],["-e \"version=1.4.0\"","Línea de comandos: máxima prioridad"],["ansible_facts","Datos recogidos automáticamente del servidor"]],
  why:"Las variables extra (-e) ganan a todo: útiles en pipelines."},
 {t:"opcion", p:"¿Qué ventaja tiene template frente a copy para la configuración de Nginx?",
  ops:["Ninguna","Permite un único fichero con variables que se adapta a cada entorno o servidor","Es más rápido","copy no admite ficheros de texto"],
  ok:1, why:"Un fichero .j2 en vez de una copia por entorno."}
]},

{
id:"an3l2",
titulo:"Handlers, condiciones y bucles",
claves:["Un handler se ejecuta al final solo si alguna tarea lo notificó (reiniciar tras cambiar configuración)","when para ejecutar tareas según una condición","loop para repetir una tarea sobre una lista"],
pasos:[
 {t:"info", eti:"Reaccionar a cambios", h:"Handlers, when y loop",
  c:`<div class="termbox">  tasks:
    - name: Crear usuarios del equipo
      ansible.builtin.user:
        name: "{{ item.nombre }}"
        groups: "{{ item.grupos }}"
      loop:
        - { nombre: ana, grupos: sudo }
        - { nombre: luis, grupos: developers }

    - name: Instalar paquetes en Debian o Ubuntu
      ansible.builtin.apt: { name: [curl, git, htop], state: present }
      when: ansible_os_family == "Debian"

    - name: Configurar el sitio
      ansible.builtin.template: { src: tareas.conf.j2, dest: /etc/nginx/sites-available/tareas.conf }
      notify: Recargar nginx

  handlers:
    - name: Recargar nginx
      ansible.builtin.service: { name: nginx, state: reloaded }</div>`},
 {t:"par", p:"Empareja cada construcción con su efecto",
  pares:[["notify","Avisar a un handler si la tarea cambió algo"],["handlers","Tareas que se ejecutan al final solo si se notificaron"],["when","Ejecutar la tarea solo si se cumple la condición"],["loop","Repetir la tarea para cada elemento"],["register","Guardar el resultado de una tarea en una variable"]],
  why:"Si cinco tareas notifican el mismo handler, se ejecuta una sola vez."},
 {t:"opcion", p:"Cambias la configuración de Nginx pero no quieres reiniciarlo en cada ejecución, solo cuando la configuración cambie. ¿Qué usas?",
  ops:["Una tarea service al final siempre","notify en la tarea de la plantilla y un handler que recarga nginx","Un cron","when: true"],
  ok:1, why:"Así el reinicio es idempotente también."}
]},

{
id:"an3l3",
titulo:"Precedencia de variables y group_vars",
claves:["group_vars/ y host_vars/ junto al inventario organizan las variables","Hay más de 20 niveles de precedencia; -e (extra vars) siempre gana","Defaults del rol: el valor más fácil de sobrescribir"],
pasos:[
 {t:"info", eti:"¿Qué valor gana?", h:"Organizar variables",
  c:`<div class="diag">inventario/
  produccion.ini
  group_vars/
    all.yml          # comun a todo
    web.yml          # solo grupo web
  host_vars/
    web1.yml         # solo web1

de menos a mas prioridad (simplificado):
  defaults del rol  &lt;  group_vars/all  &lt;  group_vars/web  &lt;  host_vars/web1
  &lt;  vars del play  &lt;  set_fact  &lt;  -e en la linea de comandos</div>`},
 {t:"orden", p:"Ordena de MENOR a MAYOR prioridad",
  items:["defaults/ del rol","group_vars/all","group_vars del grupo concreto","host_vars del host","Variables extra con -e"],
  why:"Regla práctica: pon los valores por defecto en defaults del rol y sobrescribe en group_vars."},
 {t:"opcion", p:"<code>puerto_app</code> vale 8080 en group_vars/web.yml y 9090 en host_vars/web1.yml. ¿Qué valor tiene en web1?",
  ops:["8080","9090","Da error por conflicto","El primero que se lea"],
  ok:1, why:"host_vars es más específico que group_vars."}
]}

]});
