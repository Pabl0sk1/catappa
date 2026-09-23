window.CURSOS = window.CURSOS || {};
(CURSOS.ansible = CURSOS.ansible || []).push({
titulo: "Ecosistema: execution environments, AWX y Terraform",
resumen: "Entornos de ejecución en contenedor con ansible-builder y ansible-navigator, AWX y Ansible Automation Platform, y cuándo usar Ansible, Terraform u otra herramienta",
nivel: "Experto",
color: "#d65454",
lecciones: [

/* =============== U11 L1 =============== */
{
id:"an11n1",
titulo:"Execution environments y ansible-navigator",
claves:["Un execution environment (EE) es una imagen de contenedor con ansible-core, colecciones y dependencias","ansible-builder la construye a partir de execution-environment.yml","ansible-navigator ejecuta playbooks dentro del EE: el mismo entorno en tu portátil, en CI y en AWX"],
pasos:[
 {t:"info", eti:"Reproducible", h:"Ansible dentro de un contenedor",
  c:`<p>Un proyecto real necesita una versión concreta de ansible-core, diez colecciones, <code>boto3</code>, <code>psycopg2</code> y algún paquete del sistema. Instalar todo eso igual en cada portátil y en cada runner es frágil. Un <b>execution environment</b> lo empaqueta en una imagen.</p>
     <div class="termbox"># execution-environment.yml
version: 3
images:
  base_image:
    name: quay.io/fedora/fedora:latest
dependencies:
  ansible_core:
    package_pip: ansible-core==2.20.1
  ansible_runner:
    package_pip: ansible-runner
  galaxy: requirements.yml        # colecciones
  python: requirements.txt        # boto3, psycopg2-binary...
  system: bindep.txt              # paquetes del sistema: git, openssh-clients...</div>
     <div class="termbox">ansible-builder build -t registry.catappa.dev/infra-ee:1.4 -f execution-environment.yml
ansible-navigator run sitio.yml -i inventarios/staging --eei registry.catappa.dev/infra-ee:1.4 -m stdout</div>`},
 {t:"hueco", p:"Completa el execution-environment.yml para que incluya las colecciones de <code>requirements.yml</code> y las bibliotecas de <code>requirements.txt</code>",
  tpl:`version: 3
dependencies:
  ___: requirements.yml
  ___: requirements.txt
  system: bindep.txt`,
  banco:["galaxy","python","collections","pip","roles","system"],
  sol:["galaxy","python"],
  why:"<code>galaxy</code> recibe el requirements.yml de colecciones; <code>python</code>, el de pip; <code>system</code>, el bindep.txt con paquetes del sistema."},
 {t:"term", p:"Construye la imagen del EE con la etiqueta <code>infra-ee:1.4</code> a partir de <code>execution-environment.yml</code>",
  prompt:"pablo@control:~/infra$", sol:["ansible-builder build -t infra-ee:1.4 -f execution-environment.yml","ansible-builder build -f execution-environment.yml -t infra-ee:1.4","ansible-builder build --tag infra-ee:1.4 --file execution-environment.yml","ansible-builder build -t infra-ee:1.4"],
  pista:"ansible-builder build con -t y -f.",
  salida:`Running command:
  podman build -f context/Containerfile -t infra-ee:1.4 context
Complete! The build context can be found at: /home/pablo/infra/context`,
  why:"ansible-builder genera un Containerfile en <code>context/</code> y llama a podman (o docker con <code>--container-runtime docker</code>)."},
 {t:"term", p:"Ejecuta <code>sitio.yml</code> dentro del EE <code>infra-ee:1.4</code> con la salida clásica por pantalla",
  prompt:"pablo@control:~/infra$", sol:["ansible-navigator run sitio.yml --eei infra-ee:1.4 -m stdout","ansible-navigator run sitio.yml -m stdout --eei infra-ee:1.4","ansible-navigator run sitio.yml --execution-environment-image infra-ee:1.4 --mode stdout","ansible-navigator run sitio.yml --eei infra-ee:1.4 --mode stdout"],
  pista:"ansible-navigator run, --eei con la imagen y -m stdout.",
  salida:`PLAY [Configurar servidores web] ***
TASK [Gathering Facts] ***
ok: [web1.catappa.dev]
...
PLAY RECAP ***
web1.catappa.dev : ok=12 changed=0 unreachable=0 failed=0`,
  why:"Sin <code>-m stdout</code>, navigator abre una interfaz de texto interactiva para explorar plays, tareas y resultados. Además guarda un artefacto JSON de cada ejecución para revisarla después con <code>ansible-navigator replay</code>."},
 {t:"par", p:"Empareja cada herramienta con su papel",
  pares:[["ansible-builder","Construir la imagen del execution environment"],["ansible-navigator","Ejecutar y explorar playbooks dentro del EE"],["ansible-runner","Interfaz programática que usan AWX y navigator para lanzar Ansible"],["bindep.txt","Paquetes del sistema que necesita el EE"]],
  why:"El mismo EE que usas en local es el que ejecutará AWX: se acaba el «en mi máquina funciona»."},
 {t:"opcion", p:"Tu equipo tiene tres personas con versiones distintas de colecciones y los resultados cambian según quién ejecute. ¿Qué solución es más sólida?",
  ops:["Un documento con las versiones","Un execution environment versionado en un registro, usado por todos con ansible-navigator y por CI","Que ejecute siempre la misma persona","Actualizar todo a la última cada lunes"],
  ok:1, why:"Una imagen con etiqueta fija es un entorno idéntico y auditable. Cambiar de versión es cambiar la etiqueta, en un PR."},
 {t:"vf", p:"Un execution environment se ejecuta en los nodos gestionados.",
  ok:false, why:"El EE sustituye a la máquina de control: es donde corre ansible-core. Los nodos siguen recibiendo los módulos por SSH como siempre."}
]},

/* =============== U11 L2 =============== */
{
id:"an11n2",
titulo:"AWX y Ansible Automation Platform",
claves:["AWX (código abierto) y Automation Controller (Red Hat) ejecutan playbooks con interfaz web, API, permisos y registro","Proyectos desde Git, inventarios, credenciales cifradas, plantillas de trabajo, encuestas y flujos con aprobación","Se configura como código con la colección awx.awx (o ansible.controller)"],
pasos:[
 {t:"info", eti:"A escala de empresa", h:"Qué aporta un controlador",
  c:`<p>Cuando Ansible lo usan muchos equipos, surgen preguntas: ¿quién ejecutó qué en producción?, ¿cómo dejo que soporte reinicie un servicio sin darle la clave SSH?, ¿cómo lo programo cada noche? <b>AWX</b> (proyecto abierto) y <b>Ansible Automation Platform</b> (producto de Red Hat, cuyo núcleo es Automation Controller, derivado de AWX) responden a eso.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">piezas de AWX / Automation Controller</div><table class="dg-tabla"><thead><tr><th>Pieza</th><th>Qué es</th></tr></thead><tbody>
       <tr><td>Proyecto</td><td>un repositorio Git con playbooks, sincronizado</td></tr>
       <tr><td>Inventario</td><td>hosts y grupos; con fuentes dinámicas (AWS, VMware…) que se refrescan</td></tr>
       <tr><td>Credencial</td><td>clave SSH, contraseña del vault, credenciales de nube: cifradas y nunca visibles para quien las usa</td></tr>
       <tr><td>Plantilla de trabajo</td><td>proyecto + playbook + inventario + credenciales + EE, lista para lanzar</td></tr>
       <tr><td>Encuesta</td><td>formulario que pide variables al lanzar (versión, entorno)</td></tr>
       <tr><td>Flujo de trabajo</td><td>encadena plantillas con ramas de éxito o fallo y nodos de aprobación</td></tr>
     </tbody></table></div>
     <p>Todo tiene permisos por organización, equipo y rol, programación, notificaciones, una API REST completa y registro de cada ejecución. AAP añade Event-Driven Ansible (reglas que lanzan automatizaciones ante eventos) y el hub privado de contenido.</p>`},
 {t:"par", p:"Empareja cada concepto con su función",
  pares:[["Proyecto","Sincronizar playbooks desde Git"],["Credencial","Guardar secretos que el usuario usa sin poder verlos"],["Plantilla de trabajo","Definición lista para lanzar un playbook"],["Encuesta","Pedir variables a quien lanza"],["Nodo de aprobación","Pausar un flujo hasta que alguien lo autorice"]],
  why:"La credencial es la clave: el equipo de soporte puede reiniciar un servicio en producción sin tener nunca la clave SSH."},
 {t:"orden", p:"Ordena un flujo de trabajo de despliegue en AWX",
  items:["Sincronizar el proyecto desde Git","Actualizar el inventario dinámico","Desplegar en staging","Pruebas de humo en staging","Aprobación manual","Desplegar en producción"],
  why:"Si una etapa falla, el flujo puede tomar una rama de fallo (por ejemplo, avisar y hacer marcha atrás) en vez de seguir."},
 {t:"hueco", p:"Define una plantilla de trabajo como código con la colección <code>awx.awx</code>",
  tpl:`- name: Plantilla de despliegue de la API
  awx.awx.___:
    name: Desplegar API
    project: infra
    ___: despliegue.yml
    inventory: produccion
    credentials: [ssh-despliegue, vault-produccion]
    survey_enabled: true`,
  banco:["job_template","playbook","workflow","tasks","template","file"],
  sol:["job_template","playbook"],
  why:"Configurar AWX con Ansible («configuración como código») permite revisar en PR y reconstruir el controlador si se pierde."},
 {t:"term", p:"Lanza desde la terminal la plantilla <code>Desplegar API</code> con la CLI de AWX y sigue su salida",
  prompt:"pablo@control:~$", sol:["awx job_templates launch \"Desplegar API\" --monitor","awx job_templates launch 'Desplegar API' --monitor","awx job_templates launch --monitor \"Desplegar API\""],
  pista:"awx job_templates launch con el nombre y --monitor.",
  salida:`------Starting Standard Out Stream------
PLAY [Desplegar la API] ********
TASK [Gathering Facts] *********
ok: [web1.catappa.dev]
...
PLAY RECAP *********************
web1.catappa.dev : ok=18 changed=3 unreachable=0 failed=0
------End of Standard Out Stream--------`,
  why:"La ejecución queda registrada en AWX con su usuario, su commit y su salida. También se puede lanzar por API o por un webhook de Git."},
 {t:"opcion", p:"Soporte debe poder reiniciar la aplicación en producción, pero sin acceso SSH ni poder cambiar el playbook. ¿Cómo lo resuelves en AWX?",
  ops:["Darles la clave SSH","Una plantilla de trabajo que ejecuta el playbook de reinicio, con permiso de ejecución (no de edición) para el equipo de soporte","Un usuario administrador compartido","Enviarles el playbook por correo"],
  ok:1, why:"El permiso «execute» sobre una plantilla concreta es el principio de mínimo privilegio aplicado a la automatización."},
 {t:"vf", p:"AWX y Automation Controller ejecutan los playbooks dentro de execution environments.",
  ok:true, why:"Por eso conviene construir tu propio EE con tus colecciones: el que uses en local será el mismo que use el controlador."}
]},

/* =============== U11 L3 =============== */
{
id:"an11n3",
titulo:"Ansible frente a Terraform y compañía",
claves:["Terraform: infraestructura declarativa con estado y plan; Ansible: configuración y operación, sin estado","Juntos: Terraform crea, Ansible configura (o Packer + Ansible hornean imágenes)","Puppet, Chef y Salt usan agentes y modelo pull; ansible-pull ofrece pull sin agente"],
pasos:[
 {t:"info", eti:"Cada una a lo suyo", h:"Comparativa honesta",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">Ansible y Terraform</div><table class="dg-tabla"><thead><tr><th></th><th>Terraform / OpenTofu</th><th>Ansible</th></tr></thead><tbody>
       <tr><td>Fuerte en</td><td>crear recursos: redes, máquinas, bases de datos gestionadas, DNS</td><td>configurar dentro de las máquinas y operar: paquetes, ficheros, despliegues, parches</td></tr>
       <tr><td>Estado</td><td>fichero de estado: sabe qué creó</td><td>sin estado: mira el sistema en cada ejecución</td></tr>
       <tr><td>Plan</td><td><code>terraform plan</code> exacto</td><td><code>--check --diff</code> aproximado</td></tr>
       <tr><td>Borrar</td><td>quitar el recurso del código lo destruye</td><td>quitar la tarea no deshace nada: hay que escribir <code>state: absent</code></td></tr>
       <tr><td>Orden</td><td>grafo de dependencias</td><td>tareas en secuencia</td></tr>
     </tbody></table></div>
     <div class="dg"><div class="dg-tit">combinación habitual</div>
       <div class="dg-flujo">
         <div class="dg-caja">Packer + Ansible<small>imagen base horneada</small></div>
         <div class="dg-caja acento">Terraform<small>crea las máquinas con etiquetas</small></div>
         <div class="dg-caja">inventario dinámico<small>por etiquetas</small></div>
         <div class="dg-caja ok">Ansible<small>configura y despliega</small></div>
       </div></div>`},
 {t:"par", p:"Empareja cada tarea con la herramienta más adecuada",
  pares:[["Crear una VPC con subredes y una base de datos RDS","Terraform"],["Aplicar un parche de seguridad a 300 servidores por tandas","Ansible"],["Construir una imagen de máquina con todo preinstalado","Packer (con Ansible como aprovisionador)"],["Primer arranque de una instancia: usuario y clave","cloud-init"],["Desplegar pods y servicios en un clúster","Kubernetes (manifiestos, Helm)"]],
  why:"Ninguna herramienta es la mejor en todo. Lo profesional es saber dónde termina cada una."},
 {t:"opcion", p:"¿Terraform o Ansible para crear instancias EC2?",
  ops:["Ansible siempre","Terraform, que gestiona el ciclo de vida con estado y planes; Ansible después para configurarlas si hace falta","Ninguno","Ambos a la vez para lo mismo"],
  ok:1, why:"Ansible puede crear recursos en la nube (<code>amazon.aws.ec2_instance</code>), pero sin estado ni plan: no sabrá borrar lo que quites del código."},
 {t:"vf", p:"Si quitas del playbook la tarea que instalaba un paquete, la siguiente ejecución de Ansible lo desinstala.",
  ok:false, why:"Ansible solo hace lo que dicen las tareas presentes. Para desinstalar hay que escribir <code>state: absent</code> (y mantenerlo un tiempo). Terraform, en cambio, sí destruye lo que desaparece del código."},
 {t:"info", eti:"Otras herramientas", h:"Push, pull y agentes",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">herramientas de gestión de configuración</div><table class="dg-tabla"><thead><tr><th>Herramienta</th><th>Modelo</th><th>Lenguaje</th></tr></thead><tbody>
       <tr><td>Ansible</td><td>push por SSH, sin agente</td><td>YAML + Jinja2</td></tr>
       <tr><td>Puppet</td><td>pull con agente cada 30 min</td><td>DSL propio, declarativo</td></tr>
       <tr><td>Chef</td><td>pull con agente</td><td>Ruby</td></tr>
       <tr><td>Salt</td><td>agente (minion) con bus de eventos, o SSH</td><td>YAML + Jinja2</td></tr>
     </tbody></table></div>
     <div class="termbox"># ansible-pull: cada nodo se configura a sí mismo desde Git (por ejemplo, con cron)
ansible-pull -U https://github.com/catappa/infra.git -C main local.yml</div>
     <p>El modelo pull con agente corrige la deriva sola cada pocos minutos; el push de Ansible la corrige cuando lo ejecutas. Si necesitas convergencia continua, programa la ejecución (AWX, cron o <code>ansible-pull</code>).</p>`},
 {t:"escribe", p:"¿Qué comando de Ansible hace que un nodo descargue el repositorio y se aplique un playbook a sí mismo?",
  sol:["ansible-pull"],
  pista:"Lo contrario de push.",
  why:"Útil para flotas enormes o máquinas que no son alcanzables desde fuera (detrás de NAT, portátiles): cada una tira de Git."},
 {t:"opcion", p:"Tu equipo usa servidores inmutables: cada cambio es una imagen nueva y se reemplazan las instancias. ¿Qué papel tiene Ansible?",
  ops:["Ninguno","Aprovisionar la imagen durante su construcción con Packer; y tareas de operación puntuales, no configurar servidores en marcha","Modificar las instancias en marcha cada hora","Sustituir a Terraform"],
  ok:1, why:"Con infraestructura inmutable, Ansible se mueve al momento de construir la imagen. Sus roles siguen siendo útiles tal cual."},
 {t:"orden", p:"Ordena una cadena típica para levantar un entorno nuevo desde cero",
  items:["Packer construye la imagen base con un rol de Ansible","Terraform crea la red y las instancias a partir de esa imagen, con etiquetas","El inventario dinámico agrupa las instancias por etiqueta","Ansible despliega la aplicación y la configuración de cada entorno"],
  why:"Cada herramienta en su fase: horneado, infraestructura, configuración final."}
]}

]});
