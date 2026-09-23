window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Secretos y ejecución controlada",
resumen: "Ansible Vault, vault IDs por entorno, gestores de secretos externos y no_log; ensayos con check y diff, y ejecución parcial con tags",
nivel: "Avanzado",
color: "#dd5a5a",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"an4l2",
titulo:"Secretos con Ansible Vault",
claves:["ansible-vault cifra ficheros o valores sueltos con AES-256 para guardarlos en Git","create, edit, view, encrypt, decrypt, rekey y encrypt_string","Patrón vars.yml + vault.yml: los nombres visibles, los valores cifrados con prefijo vault_"],
pasos:[
 {t:"info", eti:"Secretos", h:"Ansible Vault",
  c:`<div class="termbox">ansible-vault create group_vars/produccion/vault.yml    # crea un fichero cifrado y abre el editor
ansible-vault edit group_vars/produccion/vault.yml
ansible-vault view group_vars/produccion/vault.yml
ansible-vault encrypt secretos.yml                      # cifrar uno que ya existe
ansible-vault rekey group_vars/produccion/vault.yml     # cambiar la contraseña
ansible-vault encrypt_string 's3cr3t0' --name clave_bd  # cifrar un valor suelto
ansible-playbook sitio.yml --ask-vault-pass             # o --vault-password-file ~/.vault_pass</div>
     <p>Con Vault los secretos pueden vivir en el repositorio cifrados con AES-256. Ansible los descifra en memoria al ejecutar. La contraseña del vault nunca va al repositorio.</p>`},
 {t:"info", eti:"Patrón", h:"vars.yml a la vista, vault.yml cifrado",
  c:`<div class="dg dg-arbol"><div class="dg-tit">variables de un grupo con secretos</div><div class="rama" style="--n:0"><span class="nom carpeta">group_vars/produccion/</span></div><div class="rama" style="--n:1"><span class="nom">vars.yml</span><span class="coment">bd_password: "{{ vault_bd_password }}"</span></div><div class="rama" style="--n:1"><span class="nom">vault.yml</span><span class="coment">cifrado: vault_bd_password: …</span></div></div>
     <p>Así un <code>grep bd_password</code> encuentra dónde se define la variable sin descifrar nada, y en las revisiones de código se ve qué secretos existen aunque no su valor. Es la práctica recomendada en la documentación oficial.</p>`},
 {t:"term", p:"Cifra el valor <code>s3cr3t0</code> como variable <code>clave_bd</code> para pegarlo en un YAML",
  prompt:"pablo@control:~/infra$", sol:["ansible-vault encrypt_string 's3cr3t0' --name clave_bd","ansible-vault encrypt_string s3cr3t0 --name clave_bd","ansible-vault encrypt_string --name clave_bd 's3cr3t0'","ansible-vault encrypt_string --name clave_bd s3cr3t0"],
  pista:"ansible-vault encrypt_string, el valor y --name.",
  salida:`New Vault password:
Confirm New Vault password:
Encryption successful
clave_bd: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          62313365396662343061393464336163383764373764613633653634306231386433626436623361
          6134333665353966363534333632666535333761666131620a663537646436643839616531643561
          ...`,
  why:"Ojo: el valor queda en el historial de tu shell. Sin argumento, <code>encrypt_string</code> lo pide por la entrada estándar."},
 {t:"par", p:"Empareja cada subcomando de ansible-vault con su efecto",
  pares:[["create","Crear un fichero nuevo ya cifrado"],["edit","Abrir, editar y volver a cifrar"],["view","Ver el contenido sin modificarlo"],["rekey","Cambiar la contraseña de cifrado"],["decrypt","Dejar el fichero en claro (casi nunca es buena idea)"]],
  why:"<code>edit</code> descifra a un temporal, abre <code>$EDITOR</code> y vuelve a cifrar al guardar."},
 {t:"hueco", p:"En <code>vars.yml</code>, expón la contraseña cifrada que está en <code>vault.yml</code> como <code>vault_smtp_password</code>",
  tpl:`smtp_password: "___ ___ }}"`,
  banco:["{{","vault_smtp_password","smtp_password","{%","lookup"],
  sol:["{{","vault_smtp_password"],
  why:"El código usa siempre <code>smtp_password</code>; solo vault.yml conoce el valor real."},
 {t:"escribe", p:"¿Con qué texto empieza la primera línea de un fichero cifrado con Ansible Vault?",
  sol:["$ANSIBLE_VAULT","$ANSIBLE_VAULT;1.1;AES256","$ANSIBLE_VAULT;1.2;AES256"],
  pista:"Empieza por el símbolo del dólar.",
  why:"La cabecera indica la versión del formato y el cifrado; con vault IDs aparece la 1.2 y la etiqueta del ID."},
 {t:"opcion", p:"Alguien sube por error un <code>secretos.yml</code> sin cifrar a Git y lo borra en el commit siguiente. ¿Qué haces?",
  ops:["Nada, ya está borrado","Rotar todos esos secretos (cambiarlos en origen), y después limpiar el historial si hace falta","Cifrarlo ahora con ansible-vault encrypt","Hacer el repositorio privado"],
  ok:1, why:"Un secreto que ha estado en Git hay que darlo por filtrado: el historial, los clones y las cachés lo conservan. Un <i>hook</i> de pre-commit que detecte ficheros vault sin cifrar evita el susto."}
]},

/* =============== U8 L2 =============== */
{
id:"an8n1",
titulo:"Vault en equipo y gestores de secretos",
claves:["Vault IDs: una contraseña por entorno (dev, prod) con --vault-id etiqueta@origen","En CI la contraseña llega por un fichero o un script, nunca escrita en el pipeline","no_log: true para que los secretos no salgan en la salida; lookups a HashiCorp Vault o AWS Secrets Manager"],
pasos:[
 {t:"info", eti:"Varios entornos", h:"Vault IDs",
  c:`<div class="termbox">ansible-vault encrypt_string --vault-id prod@prompt 'clave' --name bd_password
ansible-vault create --vault-id dev@~/.vault/dev group_vars/dev/vault.yml

ansible-playbook sitio.yml --vault-id dev@~/.vault/dev --vault-id prod@prompt
ansible-playbook sitio.yml --vault-id prod@scripts/vault-pass.sh    # un ejecutable que imprime la clave</div>
     <p>Con vault IDs, el equipo de desarrollo puede tener la contraseña de <code>dev</code> y no la de <code>prod</code>. La etiqueta queda escrita en la cabecera (<code>$ANSIBLE_VAULT;1.2;AES256;prod</code>). Si el origen es un <b>script</b> ejecutable, Ansible lo ejecuta y usa lo que imprime: así se lee la contraseña de un gestor de secretos o del llavero del sistema.</p>`},
 {t:"par", p:"Empareja cada forma de pasar la contraseña del vault con su uso",
  pares:[["--ask-vault-pass","Escribirla a mano al lanzar"],["--vault-password-file ~/.vault_pass","Leerla de un fichero con permisos 600"],["--vault-id prod@prompt","Pedir la contraseña de la etiqueta prod"],["--vault-id prod@script.sh","Obtenerla de un script (gestor de secretos)"],["ANSIBLE_VAULT_PASSWORD_FILE","Variable de entorno con la ruta del fichero, típica en CI"]],
  why:"En CI: el secreto del pipeline se escribe en un fichero temporal o lo sirve un script, y se borra al terminar."},
 {t:"term", p:"Ejecuta <code>sitio.yml</code> leyendo la contraseña del vault de desarrollo del fichero <code>~/.vault/dev</code> con su vault ID <code>dev</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml --vault-id dev@~/.vault/dev","ansible-playbook --vault-id dev@~/.vault/dev sitio.yml"],
  pista:"--vault-id etiqueta@ruta",
  salida:`PLAY [Configurar servidores web] ******
TASK [Gathering Facts] ****************
ok: [web1.dev.catappa.dev]`,
  why:"Si falta la contraseña de algún dato cifrado, verás «Attempting to decrypt but no vault secrets found»."},
 {t:"info", eti:"Que no se vea", h:"no_log y secretos fuera de Git",
  c:`<div class="termbox">- name: Crear el usuario de la base de datos
  community.postgresql.postgresql_user:
    name: app
    password: "{{ bd_password }}"
  no_log: true                  # ni en la salida, ni en -vvv, ni en AWX

- name: Leer el secreto de HashiCorp Vault en tiempo de ejecución
  ansible.builtin.set_fact:
    api_token: "{{ lookup('community.hashi_vault.vault_kv2_get', 'tareas/api', engine_mount_point='secret').secret.token }}"
  no_log: true</div>
     <p>Con un gestor externo (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) el secreto no está ni cifrado en Git: se lee al ejecutar, con permisos y auditoría, y rotarlo no exige un commit. Vault de Ansible sigue siendo perfecto para proyectos pequeños o secretos que no cambian.</p>
     <div class="nota ojo"><b class="tit">--diff también enseña secretos</b>Una plantilla con contraseñas mostrará su contenido en <code>--diff</code>. Pon <code>diff: false</code> en esa tarea.</div>`},
 {t:"hueco", p:"Evita que el valor de la contraseña aparezca en la salida y en el diff de esta tarea",
  tpl:`- name: Fichero de credenciales
  ansible.builtin.template:
    src: credenciales.j2
    dest: /etc/app/credenciales
    mode: "0600"
  ___: true
  ___: false`,
  banco:["no_log","diff","check_mode","hidden","secret","verbose"],
  sol:["no_log","diff"],
  why:"<code>no_log</code> oculta el resultado; <code>diff: false</code> evita que <code>--diff</code> imprima el contenido del fichero."},
 {t:"opcion", p:"Una tarea con <code>no_log: true</code> falla y el mensaje de error no dice nada útil. ¿Cómo depuras sin exponer secretos en producción?",
  ops:["Quitar no_log para siempre","Hacer no_log condicional, por ejemplo no_log: \"{{ not depurar | default(false) | bool }}\", y depurar en un entorno sin secretos reales","Usar -vvvv, que ignora no_log","Leer el log del nodo"],
  ok:1, why:"<code>-vvvv</code> respeta no_log. Hacerlo condicional permite activar la salida solo cuando tú decidas, en un entorno controlado."},
 {t:"vf", p:"Con vault IDs puedes descifrar en la misma ejecución datos cifrados con contraseñas distintas.",
  ok:true, why:"Pasas varios <code>--vault-id</code> y Ansible prueba el que corresponde a cada etiqueta (y si no casa, los demás)."}
]},

/* =============== U8 L3 =============== */
{
id:"an8n2",
titulo:"Check, diff y tags",
claves:["--check simula sin cambiar; check_mode: false fuerza una tarea a ejecutarse de verdad incluso en ensayo","diff muestra qué cambia; diff: false lo oculta en tareas sensibles","tags para ejecutar partes: --tags, --skip-tags, --list-tags; always y never son especiales"],
pasos:[
 {t:"info", eti:"Ensayar", h:"Modo check a fondo",
  c:`<div class="termbox">- name: Consultar la versión instalada (necesaria para decidir)
  ansible.builtin.command: /opt/app/bin/version
  register: version_actual
  changed_when: false
  check_mode: false          # se ejecuta de verdad también con --check

- name: Esta tarea siempre se simula
  ansible.builtin.command: /opt/app/bin/migrar
  check_mode: true

- name: Aviso solo en ensayo
  ansible.builtin.debug: { msg: "Ensayo: no se ha migrado nada" }
  when: ansible_check_mode</div>
     <p>En <code>--check</code>, los módulos que lo soportan calculan qué harían. <code>command</code> y <code>shell</code> no pueden saberlo y se <b>saltan</b>; si una tarea posterior usa su <code>register</code>, fallará. Por eso las consultas llevan <code>check_mode: false</code>.</p>
     <div class="nota ojo"><b class="tit">El check no es una garantía</b>Si una tarea instala un paquete y la siguiente configura ese servicio, en ensayo la segunda puede fallar porque el paquete «no está». El check es una estimación muy útil, no una prueba.</div>`},
 {t:"opcion", p:"En <code>--check</code>, una tarea falla con «'dict object' has no attribute 'stdout'» porque usa el register de un <code>command</code> anterior. ¿Qué haces?",
  ops:["No usar nunca --check","Poner check_mode: false (y changed_when: false) en el command de consulta, que no modifica nada","Poner ignore_errors en la segunda","Quitar el register"],
  ok:1, why:"Las consultas de solo lectura pueden y deben ejecutarse también en ensayo: así el resto del check trabaja con datos reales."},
 {t:"info", eti:"Ejecutar por partes", h:"Tags",
  c:`<div class="termbox">- name: Instalar paquetes
  ansible.builtin.apt: { name: nginx }
  tags: [paquetes]

- name: Configurar nginx
  ansible.builtin.template: { src: nginx.conf.j2, dest: /etc/nginx/nginx.conf }
  tags: [config, nginx]

- name: Borrar la caché (solo si se pide)
  ansible.builtin.file: { path: /var/cache/app, state: absent }
  tags: [never, limpiar]

- ansible.builtin.import_role: { name: comun }
  tags: [comun]              # con import, el tag se hereda en todas sus tareas</div>
     <div class="termbox">ansible-playbook sitio.yml --tags config
ansible-playbook sitio.yml --skip-tags paquetes
ansible-playbook sitio.yml --tags limpiar          # única forma de ejecutar la tarea never
ansible-playbook sitio.yml --list-tags</div>
     <p><code>always</code> se ejecuta aunque filtres por otros tags (salvo que lo saltes explícitamente); <code>never</code> no se ejecuta salvo que pidas uno de sus otros tags. Con <code>include_*</code>, el tag solo se aplica a la inclusión: para heredarlo dentro, usa <code>apply: { tags: [...] }</code>.</p>`},
 {t:"term", p:"Ejecuta de <code>sitio.yml</code> solo las tareas con el tag <code>config</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml --tags config","ansible-playbook sitio.yml -t config","ansible-playbook --tags config sitio.yml","ansible-playbook sitio.yml --tags=config"],
  pista:"--tags (o -t).",
  salida:`TASK [Configurar nginx] ***************
changed: [web1.catappa.dev]
RUNNING HANDLER [Recargar nginx] ******
changed: [web1.catappa.dev]
PLAY RECAP ****************************
web1.catappa.dev : ok=3 changed=2 unreachable=0 failed=0`,
  why:"Un cambio de configuración en toda la flota en segundos, sin pasar por la instalación de paquetes. Gathering Facts se ejecuta igualmente porque lleva el tag <code>always</code>."},
 {t:"hueco", p:"Haz que la comprobación de requisitos corra siempre y que el borrado de datos solo corra si se pide su tag",
  tpl:`- name: Comprobar requisitos
  ansible.builtin.assert: { that: ansible_facts['memtotal_mb'] > 2000 }
  tags: [___]

- name: Borrar los datos de prueba
  ansible.builtin.file: { path: /srv/datos_prueba, state: absent }
  tags: [___, borrar_pruebas]`,
  banco:["always","never","siempre","nunca","skip","run"],
  sol:["always","never"],
  why:"El patrón <code>never</code> + otro tag es la forma segura de tener tareas peligrosas en el playbook sin que se ejecuten por accidente."},
 {t:"term", p:"Lista todos los tags disponibles en <code>sitio.yml</code> sin ejecutar nada",
  prompt:"pablo@control:~/infra$", sol:["ansible-playbook sitio.yml --list-tags","ansible-playbook --list-tags sitio.yml"],
  pista:"--list-…",
  salida:`playbook: sitio.yml

  play #1 (web): Configurar servidores web	TAGS: []
      TASK TAGS: [comun, config, limpiar, never, nginx, paquetes]`,
  why:"Úsalo antes de lanzar un <code>--tags</code> para no escribir mal un nombre: un tag inexistente simplemente no ejecuta nada."},
 {t:"vf", p:"Un tag puesto en un <code>include_tasks</code> se aplica automáticamente a todas las tareas del fichero incluido.",
  ok:false, why:"Con include, el tag solo afecta a la propia inclusión. Para que llegue dentro, usa <code>apply: {tags: [...]}</code> o cambia a <code>import_tasks</code>."}
]}

]});
