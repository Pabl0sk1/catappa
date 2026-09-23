window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Calidad: ansible-lint, Molecule y CI/CD",
resumen: "Detectar malas prácticas con ansible-lint y sus perfiles, probar roles con Molecule y llevar Ansible a un pipeline con revisión, ensayo y aprobación",
nivel: "Experto",
color: "#d65454",
lecciones: [

/* =============== U10 L1 =============== */
{
id:"an10n1",
titulo:"ansible-lint",
claves:["ansible-lint revisa playbooks, roles y colecciones con reglas de buenas prácticas","Perfiles de exigencia creciente: min, basic, moderate, safety, shared y production","Configuración en .ansible-lint; excepciones puntuales con # noqa: regla, justificadas"],
pasos:[
 {t:"info", eti:"Revisión automática", h:"Qué detecta",
  c:`<div class="termbox">pipx install ansible-lint
ansible-lint                    # revisa el proyecto entero desde la raíz
ansible-lint --fix              # corrige lo que se puede corregir solo (FQCN, formato YAML...)
ansible-lint --profile production</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">reglas que saltan a menudo</div><table class="dg-tabla"><thead><tr><th>Regla</th><th>Qué señala</th></tr></thead><tbody>
       <tr><td>fqcn</td><td><code>apt:</code> en vez de <code>ansible.builtin.apt:</code></td></tr>
       <tr><td>name[missing]</td><td>tareas sin nombre</td></tr>
       <tr><td>no-changed-when</td><td>command o shell sin changed_when, creates o removes</td></tr>
       <tr><td>command-instead-of-module</td><td><code>shell: systemctl restart</code> teniendo el módulo</td></tr>
       <tr><td>risky-file-permissions</td><td>copy, template o file creando ficheros sin <code>mode</code></td></tr>
       <tr><td>package-latest</td><td><code>state: latest</code>, que hace el resultado impredecible</td></tr>
       <tr><td>yaml[truthy]</td><td><code>yes</code>/<code>no</code> en lugar de <code>true</code>/<code>false</code></td></tr>
       <tr><td>var-naming</td><td>variables de un rol sin el prefijo del rol, o con mayúsculas</td></tr>
     </tbody></table></div>`},
 {t:"term", p:"Pasa ansible-lint por todo el proyecto",
  prompt:"pablo@control:~/infra$", sol:["ansible-lint"],
  pista:"El nombre de la herramienta, sin argumentos.",
  salida:`fqcn[action-core]: Use FQCN for builtin module actions (apt).
sitio.yml:8 Use 'ansible.builtin.apt' or 'ansible.legacy.apt' instead.

no-changed-when: Commands should not change things if nothing needs doing.
sitio.yml:14 Task/Handler: Descargar dependencias

name[missing]: All tasks should be named.
sitio.yml:20

Failed: 3 failure(s), 0 warning(s) on 6 files. Last profile that met the validation criteria was 'min'.`,
  why:"La última línea dice qué perfil cumples ahora. Sube de perfil poco a poco hasta <code>production</code>."},
 {t:"par", p:"Empareja cada regla con el problema que detecta",
  pares:[["no-changed-when","Un command que siempre informará de cambio"],["fqcn","Módulo sin su nombre completo"],["risky-file-permissions","Fichero creado sin permisos explícitos"],["package-latest","Paquetes que se actualizan solos en cada ejecución"],["name[missing]","Tarea sin nombre"]],
  why:"Cada regla tiene su página de documentación con el porqué y un ejemplo correcto."},
 {t:"hueco", p:"Completa el <code>.ansible-lint</code> para exigir el perfil de producción e ignorar la carpeta de colecciones instaladas",
  tpl:`___: production
___:
  - collections/
  - .cache/
warn_list:
  - experimental`,
  banco:["profile","exclude_paths","skip_list","level","ignore","rules"],
  sol:["profile","exclude_paths"],
  why:"<code>skip_list</code> desactiva reglas en todo el proyecto: úsalo con mucha moderación; mejor excepciones puntuales con <code>noqa</code>."},
 {t:"opcion", p:"Un <code>shell</code> con tubería es necesario y ansible-lint marca <code>no-changed-when</code>, pero sí cambia algo cada vez (rota un log). ¿Qué haces?",
  ops:["Añadir la regla a skip_list para todo el proyecto","Poner changed_when con la condición real o, si de verdad cambia siempre, changed_when: true y un comentario","Pasar a command","Borrar la tarea"],
  ok:1, why:"La regla pide que decidas explícitamente cuándo hay cambio. Si la excepción es legítima, un <code># noqa: no-changed-when</code> en esa línea con su explicación también vale."},
 {t:"escribe", p:"¿Qué perfil de ansible-lint es el más exigente, pensado para contenido que se publica o certifica?",
  sol:["production"],
  pista:"Está por encima de shared.",
  why:"Orden: min, basic, moderate, safety, shared, production. Cada perfil incluye las reglas de los anteriores."},
 {t:"vf", p:"ansible-lint también comprueba el formato YAML (sangrías, booleanos, longitud de línea) porque incluye reglas de yamllint.",
  ok:true, why:"Las reglas <code>yaml[...]</code> vienen de yamllint. Puedes afinarlas con un fichero <code>.yamllint</code>."}
]},

/* =============== U10 L2 =============== */
{
id:"an4l3",
titulo:"Probar roles con Molecule",
claves:["Molecule crea instancias desechables (contenedores o máquinas), aplica el rol y verifica","Prueba de idempotencia: la segunda ejecución debe dar changed=0","Ciclo de desarrollo: converge, login, verify; molecule test para todo el ciclo en CI"],
pasos:[
 {t:"info", eti:"Roles con pruebas", h:"Molecule",
  c:`<div class="termbox">pipx install molecule
pipx inject molecule "molecule-plugins[docker]"
cd roles/nginx
molecule init scenario           # crea molecule/default/

molecule create      # levantar las instancias
molecule converge    # aplicar el rol (repítelo mientras desarrollas)
molecule login       # entrar en la instancia a mirar
molecule verify      # ejecutar las comprobaciones
molecule destroy
molecule test        # el ciclo completo, de cero, como en CI</div>
     <div class="dg"><div class="dg-tit">qué hace molecule test</div>
       <div class="dg-flujo">
         <div class="dg-caja base">create</div>
         <div class="dg-caja">converge</div>
         <div class="dg-caja acento">idempotence<small>changed=0 o falla</small></div>
         <div class="dg-caja">verify</div>
         <div class="dg-caja base">destroy</div>
       </div></div>
     <p>La secuencia real incluye además <code>dependency</code> (instalar requirements), <code>syntax</code>, <code>prepare</code> y <code>side_effect</code>. El linting ya no forma parte de Molecule: se ejecuta aparte con ansible-lint.</p>`},
 {t:"par", p:"Empareja cada fase de Molecule con lo que comprueba",
  pares:[["converge","El rol se aplica sin errores"],["idempotence","Repetirlo no cambia nada"],["verify","El sistema queda como se esperaba"],["prepare","Dejar la instancia lista antes del rol (por ejemplo, instalar Python)"],["destroy","Limpiar las instancias de prueba"]],
  why:"Es el equivalente a los tests de integración para la infraestructura."},
 {t:"info", eti:"Configuración", h:"molecule.yml y verify.yml",
  c:`<div class="termbox"># molecule/default/molecule.yml
driver:
  name: docker
platforms:
  - name: ubuntu2404
    image: geerlingguy/docker-ubuntu2404-ansible
    pre_build_image: true
  - name: rocky9
    image: geerlingguy/docker-rockylinux9-ansible
    pre_build_image: true
provisioner:
  name: ansible
verifier:
  name: ansible

# molecule/default/verify.yml
- hosts: all
  tasks:
    - name: Nginx responde
      ansible.builtin.uri: { url: http://localhost, status_code: 200 }
    - name: El fichero de configuración existe
      ansible.builtin.stat: { path: /etc/nginx/conf.d/api.conf }
      register: f
      failed_when: not f.stat.exists</div>
     <p>Dos plataformas: el rol se prueba a la vez en Ubuntu y en Rocky Linux. Para roles que gestionan servicios con systemd, las imágenes deben arrancar systemd (las de ejemplo están preparadas para ello) o se usa un driver de máquinas virtuales.</p>`},
 {t:"term", p:"Ejecuta el ciclo completo de pruebas de Molecule del rol",
  prompt:"pablo@control:~/infra/roles/nginx$", sol:["molecule test","molecule test -s default","molecule test --scenario-name default"],
  pista:"molecule y el subcomando del ciclo completo.",
  salida:`INFO     default ➜ converge: Executing
PLAY RECAP *********
ubuntu2404 : ok=7 changed=5 unreachable=0 failed=0
INFO     default ➜ idempotence: Executing
PLAY RECAP *********
ubuntu2404 : ok=7 changed=1 unreachable=0 failed=0
CRITICAL Idempotence test failed because of the following tasks:
*  [ubuntu2404] => nginx : Generar certificado de prueba`,
  why:"Molecule te dice exactamente qué tarea no es idempotente. Aquí, un command que genera el certificado en cada ejecución: le falta <code>creates</code>."},
 {t:"orden", p:"Ordena un ciclo de desarrollo cómodo con Molecule",
  items:["molecule create para levantar la instancia una vez","Editar el rol","molecule converge para aplicarlo","molecule login o verify para comprobar","molecule test antes de subir el cambio"],
  why:"converge repetido es rápido porque reutiliza la instancia; <code>test</code> parte de cero y es lo que hará CI."},
 {t:"vf", p:"Si la segunda ejecución de un rol muestra tareas con «changed», el rol no es idempotente.",
  ok:true, why:"Suele deberse a command/shell sin creates ni changed_when."},
 {t:"opcion", p:"Tu rol pasa Molecule en Ubuntu pero en producción los servidores son RHEL 9. ¿Qué haces?",
  ops:["Nada, Linux es Linux","Añadir una plataforma basada en RHEL 9 (Rocky, Alma o UBI) a molecule.yml para probar ambas","Probar a mano en producción","Quitar las tareas específicas de RHEL"],
  ok:1, why:"Nombres de paquetes, rutas, SELinux y firewalld cambian entre familias: solo probando en ambas lo sabrás antes que producción."}
]},

/* =============== U10 L3 =============== */
{
id:"an10n2",
titulo:"Ansible en CI/CD",
claves:["En cada pull request: lint, Molecule y --check --diff contra staging","Al fusionar: aplicar en staging y, con aprobación, en producción","Contraseña del vault y clave SSH como secretos del pipeline; versiones fijadas de todo"],
pasos:[
 {t:"info", eti:"Pipeline", h:"La automatización también se revisa",
  c:`<div class="dg"><div class="dg-tit">pipeline de infraestructura con Ansible</div>
       <div class="dg-flujo">
         <div class="dg-caja">ansible-lint</div>
         <div class="dg-caja">molecule test<small>por cada rol cambiado</small></div>
         <div class="dg-caja acento">--check --diff<small>staging, en el PR</small></div>
         <div class="dg-caja">aplicar en staging<small>al fusionar</small></div>
         <div class="dg-caja ok">producción<small>con aprobación</small></div>
       </div></div>
     <div class="termbox"># .github/workflows/ansible.yml (fragmento)
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt          # ansible-core y ansible-lint con versión fijada
      - run: ansible-galaxy install -r requirements.yml
      - run: ansible-lint
  staging:
    needs: lint
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt &amp;&amp; ansible-galaxy install -r requirements.yml
      - run: echo "&#36;{{ secrets.VAULT_PASS }}" &gt; .vault_pass &amp;&amp; chmod 600 .vault_pass
      - uses: webfactory/ssh-agent@v0.9.0
        with: { ssh-private-key: "&#36;{{ secrets.SSH_KEY }}" }
      - run: ansible-playbook -i inventarios/staging sitio.yml --vault-password-file .vault_pass --diff</div>`},
 {t:"orden", p:"Ordena las etapas de un pipeline de Ansible para producción",
  items:["ansible-lint y comprobación de sintaxis","molecule test de los roles modificados","--check --diff contra staging y revisión del resultado en el PR","Aplicar en staging al fusionar","Aprobación manual y aplicar en producción"],
  why:"Lo barato y rápido primero; lo que toca servidores reales, al final y con una persona que apruebe."},
 {t:"hueco", p:"Completa el paso del pipeline que aplica en producción usando el fichero de contraseña del vault",
  tpl:"- run: ansible-playbook -i inventarios/___ sitio.yml ___ .vault_pass --diff",
  banco:["produccion","--vault-password-file","staging","--ask-vault-pass","--vault","-K"],
  sol:["produccion","--vault-password-file"],
  why:"<code>--ask-vault-pass</code> pide la contraseña por teclado: en un pipeline no hay nadie para escribirla."},
 {t:"opcion", p:"¿Dónde guardas la contraseña del vault para el pipeline?",
  ops:["En el repositorio, en un fichero .vault_pass","Como secreto del sistema de CI (o en un gestor de secretos), escrita a un fichero temporal solo durante el trabajo","En una variable del playbook","En el README, para que el equipo la encuentre"],
  ok:1, why:"El CI enmascara los secretos en los logs y controla quién puede usarlos (por ejemplo, solo desde la rama main y el entorno production)."},
 {t:"par", p:"Empareja cada práctica con el problema que evita",
  pares:[["requirements.txt con ansible-core fijado","Que una versión nueva cambie el comportamiento sin avisar"],["requirements.yml con versiones","Colecciones distintas en cada ejecución"],["--check --diff en el PR","Aprobar cambios sin ver qué harán"],["Entorno con aprobación manual","Que un merge despliegue en producción sin nadie mirando"],["Execution environment (imagen)","«En mi máquina funciona»"]],
  why:"La reproducibilidad es tan importante en la automatización como en la aplicación."},
 {t:"term", p:"En el PR, ensaya <code>sitio.yml</code> contra el inventario <code>inventarios/staging</code> mostrando las diferencias",
  prompt:"runner@ci:~/infra$", sol:["ansible-playbook -i inventarios/staging sitio.yml --check --diff","ansible-playbook -i inventarios/staging sitio.yml --diff --check","ansible-playbook sitio.yml -i inventarios/staging --check --diff"],
  pista:"-i con el inventario de staging, --check y --diff.",
  salida:`TASK [nginx : Configurar el sitio] ****
--- before: /etc/nginx/conf.d/api.conf
+++ after: /home/runner/.ansible/tmp/.../api.conf.j2
@@ -8 +8 @@
-    client_max_body_size 10m;
+    client_max_body_size 50m;
changed: [web1.stg.catappa.dev]
PLAY RECAP ****
web1.stg.catappa.dev : ok=24 changed=1 unreachable=0 failed=0`,
  why:"Muchos equipos publican esta salida como comentario del PR: quien revisa ve el efecto real, no solo el código."},
 {t:"vf", p:"Aplicar Ansible desde el portátil de cada persona es igual de seguro que desde un pipeline, si todos usan la misma versión.",
  ok:false, why:"El pipeline además deja registro de quién aplicó qué y cuándo, aplica solo código revisado y centraliza los secretos. Por eso existen también AWX y Automation Platform."}
]}

]});
