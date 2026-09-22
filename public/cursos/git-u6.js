window.CURSOS = window.CURSOS || {};
(CURSOS.git = CURSOS.git || []).push({
titulo: "Trabajar en equipo en GitHub",
resumen: "Pull Requests, code review, flujos de trabajo, issues, forks y releases",
color: "#6dd3f2",
lecciones: [

/* =============== G6 L1 =============== */
{
id:"g6l1",
titulo:"Pull Requests",
claves:["Un PR propone fusionar una rama en otra y abre una conversación","Permite revisar el código y que el CI lo valide antes de entrar","Todo entra en main a través de un PR"],
pasos:[
 {t:"info", eti:"El concepto", h:"Pedir permiso para fusionar",
  c:`<p>En un equipo nadie hace <code>git merge</code> a <code>main</code> desde su portátil. En su lugar se abre un <b>Pull Request</b> (PR; en GitLab se llama <i>Merge Request</i>).</p>
     <p>Un PR es una <b>propuesta</b>: «quiero fusionar mi rama <code>feature/login</code> en <code>main</code>». Y alrededor de esa propuesta, GitHub monta:</p>
     <ul><li>una vista con <b>todos los cambios</b> (el diff),</li>
     <li>una <b>conversación</b> con comentarios línea a línea,</li>
     <li>la ejecución automática de los <b>tests</b> (CI),</li>
     <li>y un botón para fusionar cuando todo esté aprobado.</li></ul>`},

 {t:"orden", p:"Ordena el flujo completo de un Pull Request",
  items:["Creas una rama y haces commits","git push -u origin tu-rama","Abres el Pull Request en GitHub","Compañeros revisan y el CI pasa los tests","Aplicas los cambios pedidos con nuevos commits","Se aprueba y se fusiona en main","Se borra la rama"],
  why:"Así entra el código en prácticamente cualquier empresa. Si lo cuentas así en una entrevista, entienden que has trabajado en equipo."},

 {t:"opcion", p:"¿Por qué no se hace merge directo a main desde el portátil en un equipo?",
  ops:["Porque Git no lo permite",
       "Porque el PR permite revisar el código y validarlo con los tests antes de que entre en la rama principal",
       "Porque es más lento",
       "Porque main es de solo lectura siempre"],
  ok:1,
  why:"Revisión + validación automática. main debe estar siempre en un estado desplegable."},

 {t:"info", eti:"Un buen PR", h:"Qué hace que un PR se revise rápido",
  c:`<ul><li><b>Pequeño</b>: 200 líneas se revisan en 15 minutos; 2000 líneas no se revisan, se aprueban a ciegas.</li>
     <li><b>Título claro</b> y una <b>descripción</b> que diga qué cambia, por qué y cómo probarlo.</li>
     <li>Enlazado a su tarea: <code>Closes #42</code>.</li>
     <li>Capturas si toca interfaz.</li>
     <li>Tests incluidos.</li></ul>
     <div class="termbox"><span class="cm">## Qué cambia</span>
Añade el endpoint GET /api/tareas?texto= para buscar tareas.

<span class="cm">## Por qué</span>
Los usuarios con más de 100 tareas no encuentran nada.

<span class="cm">## Cómo probarlo</span>
docker compose up -d y curl "localhost:8080/api/tareas?texto=docker"

Closes #42</div>`},

 {t:"vf", p:"Un PR grande con muchos cambios distintos es más eficiente que varios PR pequeños.",
  ok:false,
  why:"Al revés: los PR grandes se revisan peor, tardan más y esconden errores. Mejor pequeños y frecuentes."},

 {t:"info", eti:"Actualizar un PR", h:"Los cambios pedidos van en la misma rama",
  c:`<p>Si en la revisión te piden cambios, <b>no abres otro PR</b>: haces commits nuevos en la misma rama y haces push. El PR se actualiza solo.</p>
     <div class="termbox"><span class="cm"># en tu rama feature/busqueda</span>
git commit -am "Aplica sugerencias de la revisión"
git push     <span class="cm"># el PR muestra el nuevo commit automaticamente</span></div>`},

 {t:"opcion", p:"Te piden cambios en tu PR. ¿Qué haces?",
  ops:["Cierro el PR y abro otro",
       "Hago los cambios en la misma rama, commit y push: el PR se actualiza solo",
       "Hago merge sin los cambios",
       "Borro la rama"],
  ok:1,
  why:"El PR sigue a la rama. Todo commit que subas aparece en él."}
]},

/* =============== G6 L2 =============== */
{
id:"g6l2",
titulo:"Code review",
claves:["Revisar = buscar errores, riesgos y claridad, no imponer gustos","Approve, Comment o Request changes","Comentarios concretos, amables y con el porqué"],
pasos:[
 {t:"info", eti:"Para qué", h:"Cuatro ojos ven más que dos",
  c:`<p>La <b>revisión de código</b> busca:</p>
     <ul><li><b>Errores</b>: casos que no se contemplan, nulls, condiciones de carrera.</li>
     <li><b>Riesgos</b>: seguridad, rendimiento, un secreto que se cuela.</li>
     <li><b>Claridad</b>: que otra persona entienda el código dentro de seis meses.</li>
     <li><b>Compartir conocimiento</b>: el revisor aprende cómo funciona esa parte, y quien escribe aprende del revisor.</li></ul>
     <p>No es para imponer gustos personales. El estilo lo decide un formateador automático, no las discusiones.</p>`},

 {t:"info", eti:"Las tres opciones", h:"Cómo cierra una revisión en GitHub",
  c:`<ul><li><b>Approve</b>: está bien, se puede fusionar.</li>
     <li><b>Comment</b>: comentarios sin bloquear (preguntas, sugerencias menores).</li>
     <li><b>Request changes</b>: hay algo que se debe arreglar antes de fusionar.</li></ul>
     <p>GitHub también permite <b>sugerir un cambio concreto</b> en una línea, que el autor acepta con un clic.</p>`},

 {t:"opcion", p:"¿Cuál de estos comentarios de revisión es mejor?",
  ops:["Esto está mal.",
       "Yo lo habría hecho de otra forma.",
       "Si la lista viene vacía, get(0) lanza IndexOutOfBounds. ¿Podemos comprobar isEmpty() antes o devolver Optional?",
       "¿En serio?"],
  ok:2,
  why:"Concreto (qué falla), con el porqué y con una propuesta. Y en forma de pregunta: invita a hablar."},

 {t:"par", p:"Empareja cada acción de revisión con cuándo usarla",
  pares:[["Approve","El cambio está listo para fusionarse"],
         ["Request changes","Hay un problema que debe arreglarse antes"],
         ["Comment","Dudas o sugerencias que no bloquean"]],
  why:"Usar Request changes para una opinión de estilo bloquea al equipo sin motivo."},

 {t:"info", eti:"Recibir revisiones", h:"El otro lado",
  c:`<p>Recibir comentarios también es una habilidad:</p>
     <ul><li>Critican el <b>código</b>, no a ti.</li>
     <li>Responde a cada comentario: arreglado, o explica por qué no.</li>
     <li>Si no estás de acuerdo, argumenta con datos, y si se alarga, habladlo en persona.</li></ul>
     <div class="nota dato"><b class="tit">Para la entrevista</b>Si te preguntan cómo trabajas en equipo, mencionar que pides revisión de todo, que haces PRs pequeños y que revisas el código de los demás es una respuesta excelente.</div>`},

 {t:"vf", p:"El objetivo principal del code review es que el código siga el estilo personal del revisor.",
  ok:false,
  why:"El estilo lo resuelve un formateador. La revisión es para errores, riesgos, claridad y compartir conocimiento."}
]},

/* =============== G6 L3 =============== */
{
id:"g6l3",
titulo:"Flujos de trabajo: GitHub Flow, Git Flow y trunk-based",
claves:["GitHub Flow: main siempre desplegable + ramas cortas + PR","Git Flow: develop, release y hotfix; más ceremonia","Trunk-based: integrar a main varias veces al día con feature flags"],
pasos:[
 {t:"info", eti:"Por qué importa", h:"Todo equipo sigue alguna estrategia de ramas",
  c:`<p>Un <b>flujo de trabajo</b> (branching strategy) define qué ramas existen, de dónde salen, a dónde se fusionan y cuándo se despliega. Te preguntarán cuál conoces y cuál usarías.</p>`},

 {t:"info", eti:"Flujo 1", h:"GitHub Flow: el más simple y el más usado",
  c:`<div class="diag">main   ●──────●──────────●──────●──>   (siempre desplegable)
        \\      /\\        /
         ●──●─┘  ●──●──●┘        ramas de feature cortas + PR</div>
     <ul><li><b>main</b> está siempre en estado desplegable.</li>
     <li>Cada cambio: rama desde main → commits → PR → revisión + CI → merge → <b>despliegue</b>.</li></ul>
     <p>Simple y perfecto para aplicaciones web con despliegue continuo. Es el que usan la mayoría de equipos modernos.</p>`},

 {t:"info", eti:"Flujo 2", h:"Git Flow: para versiones planificadas",
  c:`<div class="diag">main      ●───────────────●──────────●   (solo versiones publicadas)
           \\             /          /
develop     ●──●──●──●──●──●──●──●─●     (integracion)
               \\  /       \\    /
feature/x       ●●         release/1.2   hotfix/...</div>
     <ul><li><b>main</b>: solo versiones publicadas.</li>
     <li><b>develop</b>: donde se integra el trabajo.</li>
     <li><b>feature/*</b>, <b>release/*</b> y <b>hotfix/*</b> con reglas de dónde nacen y a dónde vuelven.</li></ul>
     <p>Tiene sentido con <b>versiones planificadas</b> (apps móviles, software instalable, librerías). Para una web que se despliega a diario es excesivo.</p>`},

 {t:"info", eti:"Flujo 3", h:"Trunk-based development",
  c:`<p>Todos integran en <code>main</code> (el «tronco») <b>varias veces al día</b>, con ramas de horas, no días. Lo que no está terminado se esconde detrás de <b>feature flags</b> (interruptores en configuración).</p>
     <p>Es lo que hacen Google o Meta, y lo que recomiendan las métricas DORA para equipos de alto rendimiento. Requiere buenos tests automáticos.</p>`},

 {t:"par", p:"Empareja cada flujo con su característica",
  pares:[["GitHub Flow","main desplegable, ramas cortas y PR"],
         ["Git Flow","Ramas develop, release y hotfix; versiones planificadas"],
         ["Trunk-based","Integrar a main varias veces al día con feature flags"]],
  why:"Saber nombrar los tres y cuándo encaja cada uno es una respuesta de nivel."},

 {t:"opcion", p:"Una startup con una API web que despliega varias veces al día. ¿Qué flujo recomiendas?",
  ops:["Git Flow completo con develop y release","GitHub Flow (o trunk-based)","Sin ramas, todos en main sin revisión","Una rama por desarrollador para siempre"],
  ok:1,
  why:"Simple, rápido y con revisión. Git Flow añadiría ceremonia sin aportar nada con despliegue continuo."},

 {t:"info", eti:"Urgencias", h:"Qué es un hotfix",
  c:`<p>Un <b>hotfix</b> es un arreglo urgente de algo roto en producción. En GitHub Flow es simplemente una rama <code>hotfix/...</code> desde main, con un PR rápido y prioritario. En Git Flow tiene su rama propia que se fusiona tanto en main como en develop.</p>`},

 {t:"vf", p:"En GitHub Flow, la rama main debe estar siempre en un estado que se pueda desplegar.",
  ok:true,
  why:"Es su regla central. Por eso todo entra por PR con tests en verde."}
]},

/* =============== G6 L4 =============== */
{
id:"g6l4",
titulo:"Issues y la organización del trabajo",
claves:["Un issue es una tarea, un error o una propuesta","«Closes #42» en un PR cierra el issue al fusionar","Labels, assignees, milestones y Projects para organizarse"],
pasos:[
 {t:"info", eti:"Issues", h:"Dónde vive el trabajo pendiente",
  c:`<p>Un <b>issue</b> es una ficha en GitHub para registrar algo que hay que hacer: un error, una funcionalidad, una mejora o una pregunta. Cada uno tiene un número (<code>#42</code>).</p>
     <p>Un buen issue de error incluye:</p>
     <ul><li>qué pasa y qué debería pasar,</li>
     <li>pasos para reproducirlo,</li>
     <li>versión, entorno y logs.</li></ul>`},

 {t:"info", eti:"Enlazar", h:"Palabras mágicas en los PR",
  c:`<p>Si en la descripción de un PR (o en un commit que llega a main) escribes:</p>
     <div class="termbox">Closes #42
Fixes #42
Resolves #42</div>
     <p>GitHub <b>cierra automáticamente el issue #42</b> cuando el PR se fusiona, y los deja enlazados: desde el issue ves qué código lo resolvió.</p>`},

 {t:"hueco", p:"Completa la descripción del PR para que cierre el issue 42 al fusionarse",
  tpl:"Añade búsqueda por texto.\n\n___ #42",
  banco:["Closes","Opens","Links","Merges"],
  sol:["Closes"],
  why:"Closes, Fixes o Resolves. Trazabilidad entre la tarea y el código, gratis."},

 {t:"info", eti:"Organizar", h:"Labels, assignees, milestones y Projects",
  c:`<ul><li><b>Labels</b>: etiquetas como <code>bug</code>, <code>enhancement</code>, <code>good first issue</code>.</li>
     <li><b>Assignees</b>: quién se encarga.</li>
     <li><b>Milestones</b>: agrupan issues en un objetivo con fecha («v1.2», «Sprint 14»).</li>
     <li><b>Projects</b>: tableros tipo kanban (Por hacer / En curso / Hecho) con los issues.</li></ul>
     <p>En muchas empresas esto se hace en <b>Jira</b>, y la rama se nombra con la clave del ticket (<code>feature/PROJ-142-...</code>) para enlazarlos.</p>`},

 {t:"par", p:"Empareja cada elemento con su uso",
  pares:[["Label","Clasificar: bug, mejora, documentación"],
         ["Milestone","Agrupar issues con un objetivo y fecha"],
         ["Assignee","La persona responsable"],
         ["Project","Tablero kanban del trabajo"]],
  why:"No hace falta dominarlos, pero sí saber que existen y para qué."},

 {t:"vf", p:"Escribir «Closes #42» en el PR cierra el issue en cuanto abres el PR.",
  ok:false,
  why:"Lo cierra cuando el PR se fusiona en la rama por defecto, no al abrirlo."}
]},

/* =============== G6 L5 =============== */
{
id:"g6l5",
titulo:"Forks y contribuir a proyectos ajenos",
claves:["Un fork es tu copia de un repositorio ajeno en GitHub","Trabajas en tu fork y abres un PR hacia el original","upstream es el remoto del repositorio original"],
pasos:[
 {t:"info", eti:"El caso", h:"Quieres mejorar un proyecto que no es tuyo",
  c:`<p>No tienes permisos para hacer push al repositorio de otra persona u organización. La solución es un <b>fork</b>: una copia del repositorio <b>en tu cuenta de GitHub</b>, donde sí puedes hacer lo que quieras.</p>
     <div class="diag">   empresa/libreria  (original, "upstream")
          |  Fork (boton en GitHub)
          v
   pablo/libreria    (tu fork, "origin")
          |  git clone
          v
   tu portatil</div>`},

 {t:"orden", p:"Ordena cómo se contribuye a un proyecto open source",
  items:["Haces fork del repositorio en GitHub","Clonas tu fork a tu ordenador","Creas una rama y haces tus cambios","Haces push a tu fork","Abres un PR desde tu fork hacia el repositorio original"],
  why:"El PR cruza de repositorio: de tu fork al original. Los mantenedores revisan y deciden."},

 {t:"info", eti:"Mantenerlo al día", h:"El remoto upstream",
  c:`<p>El proyecto original sigue avanzando. Para traer sus cambios a tu fork, se añade un segundo remoto, por convención llamado <b>upstream</b>:</p>
     <div class="termbox">git remote add upstream https://github.com/empresa/libreria.git
git fetch upstream
git switch main
git merge upstream/main      <span class="cm"># o git rebase upstream/main</span>
git push origin main         <span class="cm"># tu fork, actualizado</span></div>
     <p>GitHub también tiene un botón «Sync fork» que hace lo mismo.</p>`},

 {t:"par", p:"Empareja cada remoto con lo que representa en un fork",
  pares:[["origin","Tu fork, donde puedes hacer push"],
         ["upstream","El repositorio original del que hiciste fork"]],
  why:"Dos remotos: uno para leer lo nuevo (upstream) y otro para escribir (origin)."},

 {t:"opcion", p:"¿Diferencia entre fork y clone?",
  ops:["Son lo mismo",
       "Fork crea una copia del repositorio en tu cuenta de GitHub; clone descarga un repositorio a tu ordenador",
       "Clone es solo para repositorios privados",
       "Fork borra el original"],
  ok:1,
  why:"Fork es en GitHub (servidor a servidor). Clone es de GitHub a tu disco. Normalmente haces los dos."},

 {t:"info", eti:"Por qué te interesa", h:"Contribuir suma mucho en un currículum",
  c:`<p>Una contribución aceptada a un proyecto conocido (aunque sea corregir documentación) demuestra que sabes seguir el flujo completo: fork, rama, PR, revisión y cambios. Busca issues con la etiqueta <code>good first issue</code>.</p>`}
]},

/* =============== G6 L6 =============== */
{
id:"g6l6",
titulo:"Proteger main, tags y releases",
claves:["Branch protection: PR obligatorio, revisiones y checks en verde","Un tag marca un commit concreto, normalmente una versión","Versionado semántico: MAYOR.MENOR.PARCHE"],
pasos:[
 {t:"info", eti:"Proteger main", h:"Reglas que impiden romper la rama principal",
  c:`<p>En GitHub › Settings › Branches (o <i>Rulesets</i>) se configuran reglas para <code>main</code>:</p>
     <ul><li><b>Require a pull request</b>: nadie hace push directo.</li>
     <li><b>Require approvals</b>: al menos una revisión aprobada.</li>
     <li><b>Require status checks</b>: los tests del CI tienen que pasar.</li>
     <li><b>Block force pushes</b>: nadie puede reescribir main.</li></ul>
     <p>Con esto, <code>main</code> queda protegida incluso de errores con buena intención.</p>`},

 {t:"opcion", p:"¿Qué consigue «Require status checks to pass» en la protección de main?",
  ops:["Que los PR se fusionen solos",
       "Que no se pueda fusionar un PR si los tests automáticos (CI) fallan",
       "Que se borren las ramas",
       "Que main sea privada"],
  ok:1,
  why:"Une Git con el CI: el código roto no puede entrar. Es la base de un despliegue continuo fiable."},

 {t:"info", eti:"Tags", h:"Marcar versiones",
  c:`<p>Un <b>tag</b> es una etiqueta fija sobre un commit concreto. A diferencia de una rama, <b>no se mueve</b>. Se usa para marcar versiones:</p>
     <div class="termbox">git tag -a v1.2.0 -m "Versión 1.2.0: búsqueda de tareas"
git push origin v1.2.0        <span class="cm"># los tags no se suben con un push normal</span>
git tag                       <span class="cm"># listar</span></div>
     <p>En GitHub, a partir de un tag se crea una <b>Release</b> con notas de versión y ficheros descargables. Y un pipeline puede reaccionar a un tag para construir y publicar esa versión.</p>`},

 {t:"vf", p:"Un <code>git push</code> normal también sube los tags que has creado.",
  ok:false,
  why:"No. Hay que subirlos explícitamente: git push origin v1.2.0 (o git push --tags)."},

 {t:"info", eti:"Versionado semántico", h:"MAYOR.MENOR.PARCHE",
  c:`<div class="termbox">v <b>2</b> . <b>4</b> . <b>1</b>
  ^   ^   ^
  |   |   +-- PARCHE: correcciones de errores compatibles
  |   +------ MENOR: funcionalidades nuevas compatibles
  +---------- MAYOR: cambios que ROMPEN la compatibilidad</div>
     <p>Si pasas de <code>1.4.2</code> a <code>2.0.0</code>, avisas a todo el mundo de que algo ya no funcionará igual. Aquí conectan los Conventional Commits: un <code>fix:</code> sube el parche, un <code>feat:</code> la menor y un cambio incompatible la mayor.</p>`},

 {t:"opcion", p:"Arreglas un error sin cambiar nada más. La versión actual es 3.2.5. ¿Cuál es la siguiente?",
  ops:["4.0.0","3.3.0","3.2.6","3.2.5.1"],
  ok:2,
  why:"Solo un arreglo compatible: sube el PARCHE."},

 {t:"opcion", p:"Eliminas un endpoint que usaban los clientes de tu API. Versión actual 3.2.5. ¿Siguiente?",
  ops:["3.2.6","3.3.0","4.0.0","3.2.5"],
  ok:2,
  why:"Rompe la compatibilidad: sube la MAYOR y reinicia las demás."},

 {t:"escribe", p:"Escribe el comando que sube al remoto origin el tag <code>v1.2.0</code>",
  sol:["git push origin v1.2.0"],
  ph:"git push ...",
  pista:"push, el remoto y el nombre del tag.",
  why:"git push origin v1.2.0. Si tu pipeline escucha tags, aquí empieza el despliegue de la versión."}
]}

]});
