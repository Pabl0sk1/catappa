window.CURSOS = window.CURSOS || {};
(CURSOS.git = CURSOS.git || []).push({
titulo: "Tu primer repositorio",
resumen: "init, status, add, commit, log, diff y .gitignore, paso a paso",
nivel: "Fundamentos",
color: "#f29e6d",
lecciones: [

/* =============== G2 L1 =============== */
{
id:"g2l1",
titulo:"git init: crear un repositorio",
claves:["git init convierte una carpeta en repositorio","Crea la carpeta oculta .git con todo el historial","Nunca borres ni edites .git a mano"],
pasos:[
 {t:"info", eti:"Punto de partida", h:"Una carpeta normal se convierte en repositorio",
  c:`<p>Tienes una carpeta con tu proyecto. Para que Git empiece a vigilarla, entras en ella y ejecutas:</p>
     <div class="termbox">cd C:\\proyectos\\mi-api
git init
<span class="cm">Initialized empty Git repository in C:/proyectos/mi-api/.git/</span></div>
     <p>Eso es todo. A partir de ahora esa carpeta es un <b>repositorio</b>. Tus ficheros no cambian: Git solo ha creado una carpeta nueva y oculta llamada <code>.git</code>.</p>`},

 {t:"term", p:"Estás en la carpeta de tu proyecto. Conviértela en un repositorio de Git",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git init"],
  pista:"El verbo es la abreviatura de «inicializar».",
  salida:`Initialized empty Git repository in C:/proyectos/mi-api/.git/`,
  why:"«empty» significa que aún no hay ningún commit. El repositorio existe, pero el historial está vacío."},

 {t:"info", eti:"La carpeta .git", h:"Ahí vive todo el historial",
  c:`<p>Dentro de <code>.git</code> está todo: los commits, las ramas, la configuración del repositorio, los remotos...</p>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">mi-api/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">.git/</span><span class="coment">&lt;- EL REPOSITORIO (historial, ramas, config)</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/</span><span class="coment">&lt;- tu codigo (directorio de trabajo)</span></div><div class="rama" style="--n:1"><span class="nom">pom.xml</span></div></div>
     <div class="nota ojo"><b class="tit">Cuidado</b>Si borras la carpeta <code>.git</code>, <b>pierdes todo el historial</b> y la carpeta vuelve a ser una carpeta normal. No la toques a mano.</div>
     <p>Es oculta, así que para verla en Windows necesitas mostrar los elementos ocultos, o en la terminal: <code>ls -Force</code> (PowerShell) o <code>ls -la</code> (Git Bash).</p>`},

 {t:"opcion", p:"Borras la carpeta <code>.git</code> de un proyecto. ¿Qué pasa?",
  ops:["Nada, Git la vuelve a crear",
       "Se pierde todo el historial: la carpeta deja de ser un repositorio, aunque tus ficheros actuales siguen ahí",
       "Se borran tus ficheros de código",
       "Se borra el repositorio de GitHub"],
  ok:1,
  why:"Tus ficheros siguen, pero sin historial. Por eso nunca se toca .git a mano."},

 {t:"vf", p:"<code>git init</code> modifica o mueve tus ficheros de código.",
  ok:false,
  why:"No toca nada tuyo. Solo crea la carpeta .git al lado."},

 {t:"info", eti:"Error típico", h:"Repositorios dentro de repositorios",
  c:`<p>Un fallo habitual al empezar: hacer <code>git init</code> en la carpeta equivocada, por ejemplo en <code>C:\\Users\\pablo</code> (tu carpeta personal entera). Entonces Git empieza a vigilar <b>todo tu usuario</b>.</p>
     <p>Regla: <code>git init</code> siempre <b>dentro de la carpeta del proyecto</b>, y comprueba antes con <code>pwd</code> dónde estás.</p>
     <p>Si te equivocas, la solución es borrar solo esa carpeta <code>.git</code> recién creada (ahí sí: estaba vacía).</p>`},

 {t:"opcion", p:"¿En qué carpeta ejecutas <code>git init</code>?",
  ops:["En C:\\ para tener todo controlado",
       "En la carpeta raíz del proyecto que quieres versionar",
       "En la carpeta .git",
       "En cualquier subcarpeta de src"],
  ok:1,
  why:"En la raíz del proyecto, donde está el pom.xml o el package.json. Un repositorio por proyecto."}
]},

/* =============== G2 L2 =============== */
{
id:"g2l2",
titulo:"git status: saber qué está pasando",
claves:["git status es el comando que más usarás","Untracked: fichero nuevo que Git aún no vigila","Modified: cambiado pero no preparado; staged: preparado para el commit"],
pasos:[
 {t:"info", eti:"Tu brújula", h:"git status te dice en qué zona está cada cosa",
  c:`<p>Si solo pudieras recordar un comando, que sea este. <code>git status</code> te dice, en cada momento:</p>
     <ul><li>en qué <b>rama</b> estás,</li>
     <li>qué ficheros son <b>nuevos</b> y Git aún no vigila,</li>
     <li>qué ficheros has <b>modificado</b>,</li>
     <li>qué está <b>preparado</b> (staged) para el próximo commit.</li></ul>
     <p>Úsalo antes y después de cada comando mientras aprendes. No cuesta nada y evita sustos.</p>`},

 {t:"term", p:"Acabas de crear el fichero <code>README.md</code>. Mira el estado del repositorio",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git status"],
  pista:"El comando más usado de Git: estado en inglés.",
  salida:`On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present (use "git add" to track)`,
  why:"«Untracked» = Git ve el fichero pero no lo está vigilando todavía. Y fíjate: Git te dice literalmente qué hacer a continuación."},

 {t:"info", eti:"Los estados", h:"Los tres estados que verás",
  c:`<ul><li><b>Untracked</b> (sin seguimiento): fichero nuevo que Git nunca ha guardado. No forma parte del repositorio todavía.</li>
     <li><b>Modified</b> (modificado): un fichero que Git ya conocía y que has cambiado, pero que aún no has preparado.</li>
     <li><b>Staged</b> (preparado): el cambio está en el staging area y entrará en el próximo commit. Git lo lista bajo <i>«Changes to be committed»</i>.</li></ul>
     <div class="nota dato"><b class="tit">Colores</b>En la terminal, lo preparado sale en <b>verde</b> y lo que no, en <b>rojo</b>. Verde = entra en el commit.</div>`},

 {t:"par", p:"Empareja lo que ves en git status con lo que significa",
  pares:[["Untracked files","Ficheros nuevos que Git aún no vigila"],
         ["Changes not staged for commit","Modificados pero no preparados"],
         ["Changes to be committed","Preparados: entrarán en el próximo commit"],
         ["nothing to commit, working tree clean","No hay nada pendiente"]],
  why:"Leer bien git status es la mitad de saber usar Git."},

 {t:"opcion", p:"<code>git status</code> muestra <code>App.java</code> bajo «Changes not staged for commit». ¿Qué significa?",
  ops:["Que ya está guardado",
       "Que lo has modificado pero todavía no lo has añadido con git add",
       "Que es un fichero nuevo",
       "Que tiene un error de compilación"],
  ok:1,
  why:"Modificado pero no preparado. Si haces commit ahora, ese cambio no entra."},

 {t:"info", eti:"Versión corta", h:"git status -s",
  c:`<p>Cuando tengas soltura, hay una versión compacta:</p>
     <div class="termbox">git status -s
<span class="cm">?? README.md        <- untracked
 M src/App.java     <- modificado, no preparado
M  pom.xml          <- modificado y preparado</span></div>
     <p>La primera columna es el staging y la segunda el directorio de trabajo. Al principio, usa la versión larga: explica más.</p>`},

 {t:"vf", p:"«working tree clean» significa que no tienes cambios pendientes respecto al último commit.",
  ok:true,
  why:"Exacto: todo lo que hay en tu carpeta coincide con lo guardado. Es el estado ideal antes de cambiar de rama."}
]},

/* =============== G2 L3 =============== */
{
id:"g2l3",
titulo:"git add: preparar los cambios",
claves:["git add fichero pasa un fichero al staging","git add . prepara todo lo de la carpeta actual","git add -p permite elegir trozos concretos"],
pasos:[
 {t:"info", eti:"El verbo", h:"git add mueve cambios al staging",
  c:`<p><code>git add</code> copia el estado actual de un fichero a la zona de preparación:</p>
     <div class="termbox">git add README.md           <span class="cm"># un fichero concreto</span>
git add src/App.java pom.xml <span class="cm"># varios</span>
git add src/                 <span class="cm"># una carpeta entera</span>
git add .                    <span class="cm"># TODO lo de la carpeta actual</span></div>
     <p>El punto significa "aquí y todo lo que cuelga de aquí". Es cómodo, pero úsalo sabiendo lo que añades: mira antes <code>git status</code>.</p>`},

 {t:"term", p:"Prepara el fichero <code>README.md</code> para el próximo commit",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git add readme.md"],
  pista:"git add + el nombre del fichero.",
  salida:``,
  why:"No sale nada: en Git, el silencio significa que ha ido bien. Compruébalo con git status."},

 {t:"term", p:"Comprueba el estado ahora",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git status"],
  pista:"El comando de siempre.",
  salida:`On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md`,
  why:"Ahora aparece bajo «Changes to be committed»: está en el staging, listo para guardarse."},

 {t:"info", eti:"Detalle importante", h:"git add hace una foto del fichero en ese momento",
  c:`<p>Esto sorprende a mucha gente: <code>git add</code> guarda en el staging <b>el fichero tal como estaba en ese instante</b>.</p>
     <p>Si después de hacer <code>git add</code> vuelves a modificar el fichero, esos nuevos cambios <b>no</b> están preparados. <code>git status</code> te mostrará el fichero <b>dos veces</b>: en verde (lo añadido) y en rojo (lo cambiado después).</p>
     <p>Solución: vuelve a hacer <code>git add</code> del fichero.</p>`},

 {t:"opcion", p:"Haces <code>git add App.java</code>, luego editas otra línea de <code>App.java</code> y haces commit. ¿Qué entra?",
  ops:["Todo, incluida la última edición",
       "Solo la versión que había cuando hiciste git add; la edición posterior queda fuera",
       "Nada",
       "Git da error"],
  ok:1,
  why:"El staging guarda una foto del momento del add. Si cambias después, hay que volver a hacer add."},

 {t:"info", eti:"Nivel pro", h:"git add -p: añadir trozos",
  c:`<p>A veces en un mismo fichero hay dos cambios sin relación: un arreglo y un cambio a medias. Con <code>-p</code> (<i>patch</i>) Git te enseña cada trozo y te pregunta uno por uno:</p>
     <div class="termbox">git add -p App.java
<span class="cm">Stage this hunk [y,n,q,a,d,s,?]?</span></div>
     <p><code>y</code> lo añade, <code>n</code> lo deja fuera. Así haces commits que contienen exactamente un cambio lógico. Muy valorado en equipos que revisan código.</p>`},

 {t:"hueco", p:"Completa para preparar todos los cambios de la carpeta actual",
  tpl:"git ___ ___",
  banco:["add",".","commit","-a","push"],
  sol:["add","."],
  why:"git add . — el punto es la carpeta actual y todo lo que contiene."},

 {t:"info", eti:"Sacar del staging", h:"¿Y si añadí algo que no quería?",
  c:`<p>Se deshace con:</p>
     <div class="termbox">git restore --staged pom.xml</div>
     <p>Eso lo saca del staging, pero <b>conserva tus cambios</b> en el fichero. Lo veremos a fondo en la unidad de deshacer.</p>`},

 {t:"vf", p:"<code>git restore --staged fichero</code> borra los cambios que hiciste en el fichero.",
  ok:false,
  why:"No: solo lo saca del staging. Los cambios siguen en tu directorio de trabajo."}
]},

/* =============== G2 L4 =============== */
{
id:"g2l4",
titulo:"git commit: guardar en el historial",
claves:["git commit -m \"mensaje\" guarda lo que hay en el staging","Un commit = un cambio lógico","Mensajes en imperativo y que expliquen el porqué"],
pasos:[
 {t:"info", eti:"El momento", h:"Guardar la foto",
  c:`<p>Con los cambios preparados, los guardas en el historial:</p>
     <div class="termbox">git commit -m "Añade README con instrucciones de arranque"</div>
     <p><code>-m</code> (<i>message</i>) te deja escribir el mensaje directamente. Sin <code>-m</code>, Git abre tu editor para que escribas un mensaje más largo.</p>`},

 {t:"term", p:"Guarda los cambios preparados con el mensaje <code>Añade README</code>",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git commit -m añade readme","git commit -m \"añade readme\""],
  pista:"git commit, el flag del mensaje, y el mensaje entre comillas.",
  salida:`[main (root-commit) a1b2c3d] Añade README
 1 file changed, 12 insertions(+)
 create mode 100644 README.md`,
  why:"«root-commit» porque es el primero del repositorio. a1b2c3d es su hash abreviado. Ya está en el historial."},

 {t:"info", eti:"Leer la salida", h:"Qué te dice Git al hacer commit",
  c:`<div class="termbox">[main (root-commit) a1b2c3d] Añade README
<span class="cm"> ^        ^           ^        ^
 rama     primer      hash     tu mensaje
          commit</span>
 1 file changed, 12 insertions(+)</div>
     <p>Y ahora <code>git status</code> diría <i>«nothing to commit, working tree clean»</i>: todo está guardado.</p>`},

 {t:"info", eti:"Buenas prácticas", h:"Cómo se escribe un buen mensaje",
  c:`<p>El mensaje es para tu yo del futuro y para tu equipo. Reglas que se usan en todas partes:</p>
     <ul><li><b>Imperativo</b>: «Añade validación», no «Añadida validación» ni «Añadiendo».</li>
     <li><b>Corto</b> en la primera línea: menos de 72 caracteres.</li>
     <li>Explica el <b>qué</b> y, si no es obvio, el <b>porqué</b>. El «cómo» ya está en el código.</li>
     <li><b>Un commit = un cambio lógico</b>. No mezcles un arreglo con una refactorización.</li></ul>
     <div class="termbox"><span class="cm"># MAL</span>
git commit -m "cambios"
git commit -m "arreglos varios y lo del login"

<span class="cm"># BIEN</span>
git commit -m "Corrige NullPointer al crear tarea sin título"
git commit -m "Añade paginación al listado de tareas"</div>`},

 {t:"opcion", p:"¿Cuál de estos mensajes de commit es mejor?",
  ops:["cambios","wip","Corrige el cálculo del total cuando el carrito está vacío","He estado arreglando cosas del carrito y otras"],
  ok:2,
  why:"Imperativo, concreto, dice qué arregla. Dentro de seis meses entenderás qué hizo ese commit sin abrir el código."},

 {t:"info", eti:"Convención", h:"Conventional Commits",
  c:`<p>Muchos equipos usan un prefijo que indica el tipo de cambio. Se llama <b>Conventional Commits</b>:</p>
     <div class="termbox">feat: añade endpoint de búsqueda de tareas
fix: corrige zona horaria en la fecha de creación
docs: explica cómo levantar el entorno con docker compose
refactor: extrae la validación a un servicio
test: añade tests del repositorio de tareas
chore: actualiza Spring Boot a 3.3.4</div>
     <p>Ventaja: se pueden generar automáticamente las notas de versión y decidir si una release es mayor, menor o parche.</p>`},

 {t:"par", p:"Empareja cada prefijo de Conventional Commits con su uso",
  pares:[["feat:","Una funcionalidad nueva"],
         ["fix:","La corrección de un error"],
         ["docs:","Cambios solo en documentación"],
         ["refactor:","Reorganizar código sin cambiar su comportamiento"]],
  why:"Mencionar que usas Conventional Commits en una entrevista da muy buena impresión."},

 {t:"info", eti:"Atajo con cuidado", h:"git commit -am",
  c:`<div class="termbox">git commit -am "Corrige validación"</div>
     <p>La <code>-a</code> añade automáticamente al commit <b>todos los ficheros modificados que Git ya conocía</b>, saltándose el <code>git add</code>.</p>
     <p>Ojo: <b>no incluye ficheros nuevos</b> (untracked). Esos necesitan siempre un <code>git add</code> explícito.</p>`},

 {t:"vf", p:"<code>git commit -am</code> incluye también los ficheros nuevos que nunca has añadido.",
  ok:false,
  why:"No. -a solo recoge ficheros ya rastreados que estén modificados. Los nuevos se quedan fuera."}
]},

/* =============== G2 L5 =============== */
{
id:"g2l5",
titulo:"git log: leer el historial",
claves:["git log muestra el historial de commits","--oneline lo compacta a una línea por commit","--graph dibuja las ramas"],
pasos:[
 {t:"info", eti:"El historial", h:"Ver qué ha pasado en el proyecto",
  c:`<p><code>git log</code> muestra los commits, del más reciente al más antiguo:</p>
     <div class="termbox">commit 9f3c1a2b7e4d8f6a0c5b3e1d9a7f2c4e6b8d0a1f (HEAD -> main)
Author: Pablo &lt;pablo@ejemplo.com&gt;
Date:   Mon Sep 21 10:14:02 2026 +0200

    Añade endpoint de tareas

commit e4f5a6b...
Author: Pablo &lt;pablo@ejemplo.com&gt;
Date:   Mon Sep 21 09:40:11 2026 +0200

    Añade la entidad Tarea</div>
     <p>Fíjate en <code>(HEAD -> main)</code>: te dice que estás en la rama main y en ese commit.</p>
     <p>Si la lista es larga, se abre un paginador: muévete con las flechas y sal con la tecla <b>q</b>.</p>`},

 {t:"opcion", p:"Ejecutas <code>git log</code> y la terminal se queda en una pantalla con dos puntos abajo. ¿Cómo sales?",
  ops:["Ctrl+Z","Pulsando q","Cerrando la terminal","Escribiendo exit"],
  ok:1,
  why:"Es un paginador (como less en Linux). La tecla q (quit) sale. Muy típico quedarse atascado ahí la primera vez."},

 {t:"info", eti:"Versión compacta", h:"--oneline y --graph",
  c:`<div class="termbox">git log --oneline
<span class="cm">9f3c1a2 (HEAD -> main) Añade endpoint de tareas
e4f5a6b Añade la entidad Tarea
a1b2c3d Añade README</span>

git log --oneline --graph --all
<span class="cm">* 7d2e9b1 (feature/busqueda) Añade filtro por texto
| * 9f3c1a2 (HEAD -> main) Añade endpoint de tareas
|/
* e4f5a6b Añade la entidad Tarea
* a1b2c3d Añade README</span></div>
     <ul><li><code>--oneline</code>: un commit por línea, hash corto y mensaje.</li>
     <li><code>--graph</code>: dibuja las ramas con líneas.</li>
     <li><code>--all</code>: muestra todas las ramas, no solo la actual.</li></ul>`},

 {t:"term", p:"Muestra el historial en formato compacto, una línea por commit",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git log --oneline"],
  pista:"git log con el flag de «una línea».",
  salida:`9f3c1a2 (HEAD -> main) Añade endpoint de tareas
e4f5a6b Añade la entidad Tarea
a1b2c3d Añade README`,
  why:"El formato que más usarás para orientarte rápidamente."},

 {t:"info", eti:"Filtrar", h:"Buscar en el historial",
  c:`<div class="termbox">git log -5                        <span class="cm"># solo los 5 ultimos</span>
git log --author="Pablo"          <span class="cm"># de un autor</span>
git log --since="2 weeks ago"     <span class="cm"># de las ultimas dos semanas</span>
git log -- src/TareaService.java  <span class="cm"># solo los que tocaron ese fichero</span>
git log --grep="login"            <span class="cm"># con esa palabra en el mensaje</span></div>
     <p>Y para ver el detalle completo de un commit concreto (qué líneas cambió):</p>
     <div class="termbox">git show 9f3c1a2</div>`},

 {t:"escribe", p:"Escribe el comando que muestra el contenido completo (cambios incluidos) del commit <code>e4f5a6b</code>",
  sol:["git show e4f5a6b"],
  ph:"git ...",
  pista:"El verbo es «mostrar».",
  why:"git show te enseña el mensaje y el diff de ese commit: qué líneas se añadieron y cuáles se quitaron."},

 {t:"info", eti:"¿Quién escribió esto?", h:"git blame",
  c:`<p>Para saber qué commit (y quién) modificó por última vez cada línea de un fichero:</p>
     <div class="termbox">git blame src/TareaService.java
<span class="cm">9f3c1a2 (Pablo 2026-09-21 10:14) public List&lt;Tarea&gt; listar() {</span></div>
     <p>Pese al nombre (<i>blame</i> = culpar), se usa para entender <b>por qué</b> existe una línea: vas al commit y lees su mensaje.</p>`},

 {t:"opcion", p:"Quieres ver solo los commits que modificaron <code>pom.xml</code>. ¿Qué usas?",
  ops:["git log pom","git log -- pom.xml","git show pom.xml","git status pom.xml"],
  ok:1,
  why:"El doble guion separa las opciones de las rutas de fichero. Muy útil para investigar cuándo cambió una dependencia."}
]},

/* =============== G2 L6 =============== */
{
id:"g2l6",
titulo:"git diff y .gitignore",
claves:["git diff: cambios no preparados; git diff --staged: lo que entrará en el commit","+ línea añadida, - línea quitada",".gitignore excluye ficheros que nunca deben versionarse"],
pasos:[
 {t:"info", eti:"Ver los cambios", h:"git diff: qué has cambiado exactamente",
  c:`<p><code>git status</code> te dice <b>qué ficheros</b> cambiaron. <code>git diff</code> te dice <b>qué líneas</b>:</p>
     <div class="termbox">git diff
<span class="cm">diff --git a/src/Tarea.java b/src/Tarea.java
@@ -12,7 +12,8 @@ public class Tarea {</span>
     private String titulo;
<span style="color:#f26d6d">-    private boolean hecha;</span>
<span style="color:#8fd16a">+    private boolean completada;</span>
<span style="color:#8fd16a">+    private LocalDate fecha;</span></div>
     <p>Las líneas con <b>-</b> (rojo) se quitaron; las líneas con <b>+</b> (verde) se añadieron. Una línea modificada aparece como una que se quita y otra que se añade.</p>`},

 {t:"info", eti:"Matiz importante", h:"diff y diff --staged no muestran lo mismo",
  c:`<ul><li><code>git diff</code> → cambios en tu directorio de trabajo que <b>aún no has preparado</b>.</li>
     <li><code>git diff --staged</code> → lo que <b>ya está en el staging</b>, es decir, exactamente lo que entrará en el próximo commit.</li></ul>
     <p>Por eso, si haces <code>git add .</code> y luego <code>git diff</code>, no sale nada: ya está todo preparado. Usa <code>git diff --staged</code> para revisar antes de hacer commit.</p>
     <div class="nota dato"><b class="tit">Hábito profesional</b>Antes de cada commit: <code>git diff --staged</code>. Evita subir un <code>System.out.println</code> de depuración o una contraseña por descuido.</div>`},

 {t:"opcion", p:"Has hecho <code>git add .</code> y <code>git diff</code> no muestra nada. ¿Por qué?",
  ops:["Porque no hay cambios",
       "Porque git diff solo muestra lo no preparado; para ver lo preparado es git diff --staged",
       "Porque git add borró los cambios",
       "Porque hace falta internet"],
  ok:1,
  why:"Los cambios están en el staging. git diff --staged los muestra."},

 {t:"escribe", p:"Escribe el comando para revisar exactamente lo que va a entrar en el próximo commit",
  sol:["git diff --staged","git diff --cached"],
  ph:"git diff ...",
  pista:"Añade el flag que se refiere a la zona de preparación.",
  why:"--staged (o su sinónimo antiguo --cached). El último vistazo antes de guardar."},

 {t:"info", eti:".gitignore", h:"Ficheros que nunca deben entrar en el repositorio",
  c:`<p>En todo proyecto hay ficheros que <b>no</b> se versionan:</p>
     <ul><li>lo que se <b>genera</b> al compilar: <code>target/</code>, <code>build/</code>, <code>*.class</code>, <code>node_modules/</code>;</li>
     <li>configuración <b>personal</b> del editor: <code>.idea/</code>, <code>.vscode/</code>;</li>
     <li>y sobre todo <b>secretos</b>: <code>.env</code>, claves, certificados.</li></ul>
     <p>Se listan en un fichero llamado <code>.gitignore</code>, en la raíz del proyecto:</p>
     <div class="termbox"><span class="cm"># .gitignore</span>
target/
*.log
.idea/
.env
*.pem</div>
     <p>Git dejará de mostrar esos ficheros en <code>git status</code> y <code>git add .</code> no los incluirá.</p>`},

 {t:"par", p:"Empareja cada patrón de .gitignore con lo que ignora",
  pares:[["target/","La carpeta de compilación de Maven"],
         ["*.log","Todos los ficheros que terminen en .log"],
         [".env","El fichero de variables con secretos"],
         ["node_modules/","Las dependencias descargadas de Node"]],
  why:"Regla: lo que se puede regenerar o es personal o secreto, fuera del repositorio."},

 {t:"info", eti:"Trampa clásica", h:".gitignore no afecta a lo que ya está versionado",
  c:`<p>Si ya hiciste commit de <code>.env</code> y <b>después</b> lo añades al <code>.gitignore</code>, Git lo sigue vigilando: <code>.gitignore</code> solo afecta a ficheros <b>no rastreados</b>.</p>
     <p>Para dejar de versionarlo (sin borrarlo de tu disco):</p>
     <div class="termbox">git rm --cached .env
git commit -m "Deja de versionar .env"</div>
     <div class="nota ojo"><b class="tit">Y si tenía secretos</b>Sigue estando en el historial. Hay que considerar esa contraseña <b>comprometida</b> y cambiarla. Lo vemos en la última unidad.</div>`},

 {t:"vf", p:"Si añades un fichero al .gitignore, Git deja de vigilarlo aunque ya lo hubieras commiteado antes.",
  ok:false,
  why:"No. .gitignore solo aplica a ficheros sin rastrear. Para uno ya versionado hace falta git rm --cached."},

 {t:"orden", p:"Ordena el flujo completo de guardar un cambio con cuidado",
  items:["git status  (ver qué ha cambiado)","git add fichero  (preparar)","git diff --staged  (revisar lo que va a entrar)","git commit -m \"mensaje claro\"  (guardar)","git log --oneline  (comprobar que está en el historial)"],
  why:"Este es el ciclo completo. Con él ya trabajas con Git de forma profesional en local."}
]}

]});
