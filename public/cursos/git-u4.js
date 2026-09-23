window.CURSOS = window.CURSOS || {};
(CURSOS.git = CURSOS.git || []).push({
titulo: "Ramas",
resumen: "Crear, cambiar, fusionar, resolver conflictos y rebase",
nivel: "Intermedio",
color: "#8fd16a",
lecciones: [

/* =============== G4 L1 =============== */
{
id:"g4l1",
titulo:"Qué es una rama de verdad",
claves:["Una rama es solo un puntero móvil a un commit","Crear una rama es instantáneo y no copia ficheros","HEAD indica en qué rama estás"],
pasos:[
 {t:"info", eti:"Para qué", h:"Trabajar en paralelo sin romper nada",
  c:`<p>Una <b>rama</b> te permite trabajar en algo (una funcionalidad, un arreglo, un experimento) <b>aislado</b> de la línea principal. Si sale bien, lo integras. Si sale mal, borras la rama y aquí no ha pasado nada.</p>
     <p>Por eso en un equipo nadie trabaja directamente en <code>main</code>: cada tarea va en su rama, y se integra cuando está revisada.</p>`},

 {t:"info", eti:"Por dentro", h:"Una rama no es una copia: es una etiqueta",
  c:`<p>Mucha gente imagina que crear una rama copia todos los ficheros. <b>No.</b> Una rama es simplemente un <b>puntero</b> (una etiqueta con nombre) que apunta a un commit.</p>
     <div class="diag">                         main
                          v
  a1b2 <-- e4f5 <-- 9f3c
                          ^
                    feature/login     <- recien creada: apunta al MISMO commit</div>
     <p>Crear una rama es instantáneo: Git solo escribe un fichero de 41 bytes con un hash dentro. Cuando haces commit en una rama, <b>ese puntero avanza</b> al nuevo commit.</p>`},

 {t:"opcion", p:"¿Qué hace Git exactamente cuando creas una rama?",
  ops:["Copia todos los ficheros del proyecto a otra carpeta",
       "Crea un puntero con nombre que apunta al commit actual",
       "Crea un repositorio nuevo",
       "Sube una copia a GitHub"],
  ok:1,
  why:"Solo un puntero. Por eso puedes tener cientos de ramas sin que el repositorio pese más."},

 {t:"info", eti:"Divergir", h:"Cuando cada rama avanza por su lado",
  c:`<p>Si haces commits en <code>feature/login</code> y alguien hace otros en <code>main</code>, las ramas <b>divergen</b>: comparten un pasado, pero tienen commits distintos.</p>
     <div class="diag">                   c7d8 <-- 1a2b        feature/login
                  /
  a1b2 <-- e4f5 <-- 9f3c
                  \\
                   5e6f                 main</div>
     <p>El commit donde se separaron (<code>9f3c</code>) se llama <b>ancestro común</b>. Será importante al fusionar.</p>`},

 {t:"info", eti:"HEAD otra vez", h:"HEAD apunta a la rama en la que estás",
  c:`<p>¿Cómo sabe Git en qué rama estás? Por <b>HEAD</b>: normalmente HEAD no apunta a un commit directamente, sino a una rama, y la rama apunta al commit.</p>
     <div class="dg"><div class="dg-flujo"><div class="dg-caja acento">HEAD</div><div class="dg-caja">main</div><div class="dg-caja ok">9f3c</div></div></div>
     <p>Cuando haces commit, avanza la rama a la que apunta HEAD. Por eso es tan importante saber en qué rama estás antes de hacer commit: <code>git status</code> te lo dice en la primera línea.</p>`},

 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Rama","Puntero con nombre a un commit"],
         ["HEAD","Indica la rama (o commit) en la que estás"],
         ["Divergir","Dos ramas con commits distintos desde un pasado común"],
         ["Ancestro común","El commit donde dos ramas se separaron"]],
  why:"Con esto, fusionar y hacer rebase dejan de ser magia."},

 {t:"vf", p:"Tener muchas ramas hace que el repositorio ocupe mucho más espacio.",
  ok:false,
  why:"Las ramas son punteros minúsculos. Lo que ocupa son los commits, y esos se comparten."}
]},

/* =============== G4 L2 =============== */
{
id:"g4l2",
titulo:"Crear ramas y moverte entre ellas",
claves:["git branch lista las ramas","git switch -c nombre crea y cambia a la vez","Antes de cambiar de rama, deja la carpeta limpia"],
pasos:[
 {t:"info", eti:"Los comandos", h:"Listar, crear y cambiar",
  c:`<div class="termbox">git branch                     <span class="cm"># lista las ramas (* = la actual)</span>
git branch feature/login       <span class="cm"># crea la rama (pero NO te cambia a ella)</span>
git switch feature/login       <span class="cm"># te cambia a esa rama</span>
git switch -c feature/login    <span class="cm"># CREA y cambia en un solo paso</span></div>
     <p>La última es la que usarás casi siempre: <code>-c</code> significa <i>create</i>.</p>`},

 {t:"term", p:"Crea una rama llamada <code>feature/login</code> y cámbiate a ella en un solo comando",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git switch -c feature/login","git checkout -b feature/login","git switch --create feature/login"],
  pista:"switch con el flag de crear.",
  salida:`Switched to a new branch 'feature/login'`,
  why:"Ya estás en la rama nueva. Todo commit que hagas ahora avanzará feature/login, no main."},

 {t:"term", p:"Comprueba en qué rama estás listando todas",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git branch"],
  pista:"El sustantivo solo, sin argumentos.",
  salida:`* feature/login
  main`,
  why:"El asterisco marca la rama actual."},

 {t:"info", eti:"Equivalencia antigua", h:"git checkout -b",
  c:`<p>En casi todos los tutoriales y en muchos equipos verás la forma antigua:</p>
     <div class="termbox">git checkout -b feature/login   <span class="cm"># = git switch -c feature/login</span>
git checkout main               <span class="cm"># = git switch main</span></div>
     <p>Funcionan igual. <code>switch</code> es más claro porque <code>checkout</code> hacía demasiadas cosas distintas.</p>`},

 {t:"opcion", p:"¿Qué hace <code>git branch feature/pagos</code>?",
  ops:["Crea la rama y te cambia a ella",
       "Crea la rama pero te deja en la actual",
       "Borra la rama",
       "Sube la rama a GitHub"],
  ok:1,
  why:"Solo la crea. Para crear y cambiar a la vez: git switch -c."},

 {t:"info", eti:"Cuidado al cambiar", h:"¿Qué pasa con tus cambios sin guardar?",
  c:`<p>Si tienes cambios sin commit y cambias de rama:</p>
     <ul><li>Si no chocan con la otra rama, Git <b>se los lleva contigo</b> a la nueva rama (lo que a veces confunde mucho).</li>
     <li>Si chocan, Git <b>se niega</b>: «Your local changes would be overwritten by checkout».</li></ul>
     <p>Buena práctica: antes de cambiar de rama, que <code>git status</code> diga <i>working tree clean</i>. O haz commit, o guárdalo con <code>git stash</code>.</p>`},

 {t:"opcion", p:"Intentas cambiar de rama y Git dice «Your local changes would be overwritten». ¿Qué haces?",
  ops:["Borro la carpeta .git",
       "Hago commit de los cambios o los guardo con git stash, y luego cambio de rama",
       "Reinstalo Git",
       "Uso git push"],
  ok:1,
  why:"Git te está protegiendo de perder trabajo. Guarda (commit o stash) y cambia."},

 {t:"info", eti:"Nombres", h:"Cómo se llaman las ramas",
  c:`<p>Convención muy extendida: <b>tipo/descripcion-corta</b>, en minúsculas y con guiones:</p>
     <div class="termbox">feature/busqueda-tareas
fix/fecha-zona-horaria
hotfix/login-caido
chore/actualizar-spring
docs/guia-despliegue</div>
     <p>Muchos equipos añaden el número de la tarea: <code>feature/PROJ-142-busqueda</code>. Así se enlaza la rama con el ticket automáticamente.</p>`},

 {t:"escribe", p:"Escribe el comando para volver a la rama <code>main</code>",
  sol:["git switch main","git checkout main"],
  ph:"git ...",
  pista:"El verbo moderno para cambiar de rama.",
  why:"git switch main. (git checkout main también vale.)"}
]},

/* =============== G4 L3 =============== */
{
id:"g4l3",
titulo:"Fusionar ramas: merge",
claves:["Te colocas en la rama que RECIBE y haces git merge otra","Fast-forward: si no hay divergencia, solo avanza el puntero","Si divergen, Git crea un commit de fusión"],
pasos:[
 {t:"info", eti:"El concepto", h:"Traer los cambios de una rama a otra",
  c:`<p>Terminaste la funcionalidad en <code>feature/login</code> y quieres integrarla en <code>main</code>. Se hace así:</p>
     <div class="termbox">git switch main              <span class="cm"># 1. te pones en la rama que RECIBE</span>
git merge feature/login      <span class="cm"># 2. traes la otra</span></div>
     <div class="nota ojo"><b class="tit">El orden importa</b>Te colocas en la rama <b>destino</b> y nombras la rama <b>origen</b>. Si lo haces al revés, traes main a tu feature (que también es útil, pero es otra cosa).</div>`},

 {t:"opcion", p:"Quieres llevar los cambios de <code>feature/login</code> a <code>main</code>. ¿Dónde tienes que estar?",
  ops:["En feature/login","En main","Da igual","En una rama nueva"],
  ok:1,
  why:"En la rama que recibe los cambios: main. Luego git merge feature/login."},

 {t:"info", eti:"Caso 1", h:"Fast-forward: el caso fácil",
  c:`<p>Si <code>main</code> no ha avanzado desde que creaste tu rama, no hay nada que "fusionar" de verdad: Git simplemente <b>adelanta el puntero</b> de main hasta tu último commit.</p>
     <div class="diag">antes:   a1b2 <-- e4f5              main
                    \\
                     c7d8 <-- 1a2b    feature/login

despues: a1b2 <-- e4f5 <-- c7d8 <-- 1a2b    main y feature/login</div>
     <p>Se llama <b>fast-forward</b> (avance rápido). No se crea ningún commit nuevo.</p>`},

 {t:"info", eti:"Caso 2", h:"Merge de tres vías: cuando las ramas han divergido",
  c:`<p>Si mientras tanto alguien hizo commits en <code>main</code>, las ramas han divergido. Git compara tres puntos (el ancestro común y las dos puntas) y crea un <b>commit de fusión</b> (merge commit) con dos padres:</p>
     <div class="diag">          c7d8 <-- 1a2b             feature/login
         /              \\
  e4f5 <                  M   <- commit de fusion (dos padres)   main
         \\              /
          5e6f --------</div>
     <p>Git abre el editor con un mensaje por defecto («Merge branch 'feature/login'») que normalmente aceptas tal cual.</p>`},

 {t:"par", p:"Empareja cada situación con el tipo de fusión",
  pares:[["main no avanzó desde que creaste la rama","Fast-forward: solo se mueve el puntero"],
         ["main y tu rama tienen commits distintos","Merge de tres vías con commit de fusión"],
         ["Las dos ramas cambiaron la misma línea","Conflicto que hay que resolver a mano"]],
  why:"El tercer caso es el que da miedo, y lo trabajamos en la siguiente lección."},

 {t:"term", p:"Estás en <code>main</code>. Fusiona la rama <code>feature/login</code>",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git merge feature/login"],
  pista:"git merge + la rama que quieres traer.",
  salida:`Updating e4f5a6b..1a2b3c4
Fast-forward
 src/main/java/com/practica/AuthController.java | 42 ++++++++++
 src/main/java/com/practica/JwtService.java     | 67 ++++++++++++++++
 2 files changed, 109 insertions(+)`,
  why:"«Fast-forward»: main no había avanzado, así que Git solo movió el puntero. Los cambios del login ya están en main."},

 {t:"vf", p:"Un merge fast-forward crea un commit de fusión nuevo.",
  ok:false,
  why:"No crea ninguno: solo adelanta el puntero. Si quieres forzar el commit de fusión igualmente (para dejar constancia), existe git merge --no-ff."}
]},

/* =============== G4 L4 =============== */
{
id:"g4l4",
titulo:"Conflictos: no son un error",
claves:["Un conflicto ocurre cuando dos ramas cambian las mismas líneas","Los marcadores &lt;&lt;&lt;&lt;&lt;&lt;&lt; ======= &gt;&gt;&gt;&gt;&gt;&gt;&gt; delimitan cada versión","Resolver = editar, git add y git commit"],
pasos:[
 {t:"info", eti:"Tranquilidad", h:"Un conflicto no es que algo haya ido mal",
  c:`<p>Un <b>conflicto</b> aparece cuando dos ramas han modificado <b>las mismas líneas</b> del mismo fichero, de forma distinta. Git no puede adivinar cuál es la buena, así que <b>te pregunta a ti</b>.</p>
     <p>Es lo normal en un equipo. Saber resolverlos con calma es una habilidad que se nota.</p>
     <div class="termbox">git merge feature/descuentos
<span class="cm">Auto-merging src/PrecioService.java
CONFLICT (content): Merge conflict in src/PrecioService.java
Automatic merge failed; fix conflicts and then commit the result.</span></div>`},

 {t:"info", eti:"Leer el conflicto", h:"Los marcadores",
  c:`<p>Git escribe <b>las dos versiones</b> dentro del fichero, separadas por marcadores:</p>
     <div class="termbox">public double calcular(double base) {
<b>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</b>
    return base * 1.21;              <span class="cm">&lt;- lo que hay en TU rama (main)</span>
<b>=======</b>
    return base * 1.21 - descuento;  <span class="cm">&lt;- lo que viene de la otra rama</span>
<b>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/descuentos</b>
}</div>
     <ul><li>Entre <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> y <code>=======</code>: tu versión (la rama en la que estás).</li>
     <li>Entre <code>=======</code> y <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>: la versión que llega.</li></ul>`},

 {t:"opcion", p:"En un conflicto, ¿qué hay entre <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> y <code>=======</code>?",
  ops:["La versión de la rama que estás fusionando","La versión de tu rama actual","El código borrado","Un comentario de Git"],
  ok:1,
  why:"HEAD es donde estás: tu versión. La de abajo, la que llega."},

 {t:"info", eti:"Resolver", h:"Tres pasos",
  c:`<p><b>1.</b> Editas el fichero y dejas el código como debe quedar. Puede ser una versión, la otra, o una mezcla. Y <b>borras los marcadores</b>:</p>
     <div class="termbox">public double calcular(double base) {
    return base * 1.21 - descuento;
}</div>
     <p><b>2.</b> Marcas el conflicto como resuelto preparándolo: <code>git add src/PrecioService.java</code></p>
     <p><b>3.</b> Terminas la fusión: <code>git commit</code> (Git ya trae el mensaje preparado).</p>
     <p>Los editores como VS Code o IntelliJ muestran botones «Accept current / Accept incoming / Accept both» que hacen el paso 1 por ti.</p>`},

 {t:"orden", p:"Ordena cómo se resuelve un conflicto",
  items:["git merge produce el conflicto","Abres el fichero y eliges o combinas el código correcto","Borras los marcadores <<<<<<< ======= >>>>>>>","git add fichero  (marcar como resuelto)","git commit  (terminar la fusión)"],
  why:"Y antes del commit, compila y pasa los tests: un conflicto mal resuelto compila a veces pero rompe la lógica."},

 {t:"info", eti:"Vía de escape", h:"Abortar si te lías",
  c:`<p>Si el conflicto es enorme y prefieres volver a como estabas antes de empezar la fusión:</p>
     <div class="termbox">git merge --abort</div>
     <p>Todo vuelve al estado previo al merge. Nada se pierde.</p>
     <div class="nota dato"><b class="tit">Cómo evitar conflictos gordos</b>Ramas cortas que se integran pronto, y traer <code>main</code> a tu rama a menudo. Un conflicto de 3 líneas se resuelve en un minuto; uno de 3 semanas de trabajo, en una tarde.</div>`},

 {t:"escribe", p:"Estás en mitad de un merge con conflictos y quieres cancelarlo por completo. Escribe el comando",
  sol:["git merge --abort"],
  ph:"git merge ...",
  pista:"merge con el flag de abortar.",
  why:"git merge --abort. Vuelves al punto de partida sin daños."},

 {t:"vf", p:"Si dejas algún marcador <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> en el fichero y haces commit, Git te lo impide.",
  ok:false,
  why:"Git no lo impide si has hecho git add. Por eso hay que revisar bien (y los tests o el compilador suelen cazarlo)."}
]},

/* =============== G4 L5 =============== */
{
id:"g4l5",
titulo:"Rebase: otra forma de integrar",
claves:["rebase reaplica tus commits encima de otra rama","Da un historial lineal, sin commits de fusión","Regla de oro: nunca hagas rebase de commits que ya compartiste"],
pasos:[
 {t:"info", eti:"El concepto", h:"Mover tu rama para que empiece más adelante",
  c:`<p>Tu rama salió de <code>main</code> hace días y <code>main</code> ha avanzado. En vez de fusionar, puedes <b>rebasar</b>: coger tus commits y <b>volver a aplicarlos encima</b> del último commit de main, como si hubieras empezado a trabajar hoy.</p>
     <div class="diag">antes:          c7 <-- c8           tu rama
                /
   a <-- b <-- m1 <-- m2              main

git switch tu-rama
git rebase main

despues:                  c7' <-- c8'   tu rama
                         /
   a <-- b <-- m1 <-- m2              main</div>
     <p>Tus commits reaparecen como <b>c7'</b> y <b>c8'</b>: mismo contenido, pero <b>hashes nuevos</b> (tienen otro padre).</p>`},

 {t:"opcion", p:"¿Qué hace <code>git rebase main</code> estando en tu rama?",
  ops:["Borra main",
       "Reaplica los commits de tu rama encima del último commit de main",
       "Fusiona tu rama en main",
       "Sube tu rama a GitHub"],
  ok:1,
  why:"Mueve la base de tu rama. Después, fusionar en main será un fast-forward limpio."},

 {t:"info", eti:"¿Para qué?", h:"Un historial lineal",
  c:`<p>Con merge, el historial queda lleno de bifurcaciones y commits «Merge branch...». Con rebase queda una <b>línea recta</b>, fácil de leer y de investigar con herramientas como <code>git bisect</code>.</p>
     <p>Ninguno es "el correcto": son estilos de equipo. Lo importante es saber qué hace cada uno y sus riesgos.</p>`},

 {t:"info", eti:"LA REGLA", h:"Nunca hagas rebase de lo que ya compartiste",
  c:`<p>Como rebase <b>crea commits nuevos con hashes nuevos</b>, reescribe la historia de tu rama.</p>
     <p>Si esa rama ya estaba en GitHub y otra persona trabajaba sobre ella, ahora vuestras historias no coinciden: su copia tiene c7 y c8, la tuya c7' y c8'. El siguiente pull le generará duplicados y conflictos absurdos.</p>
     <div class="nota ojo"><b class="tit">Regla de oro del rebase</b>Rebase solo sobre commits <b>que solo tú tienes</b>: tu rama local antes de compartirla, o tu rama de PR que nadie más toca.</div>`},

 {t:"vf", p:"Hacer rebase de una rama que usan otras personas es una buena forma de mantenerla actualizada.",
  ok:false,
  why:"Es justo lo que no se debe hacer: reescribe historia compartida. Para ramas compartidas, merge."},

 {t:"par", p:"Empareja cada estrategia con su característica",
  pares:[["merge","Conserva la historia tal cual, con commits de fusión"],
         ["rebase","Historial lineal, pero reescribe los commits"],
         ["fast-forward","Solo mueve el puntero, sin commit nuevo"],
         ["squash merge","Junta todos los commits de la rama en uno solo"]],
  why:"Squash merge es lo que ofrece GitHub al aceptar un Pull Request: la funcionalidad entra como un único commit."},

 {t:"info", eti:"Conflictos en rebase", h:"Se resuelven commit a commit",
  c:`<p>Si hay conflictos durante un rebase, Git se para en el commit problemático. Lo resuelves igual que en un merge y continúas:</p>
     <div class="termbox"><span class="cm"># resolver el fichero...</span>
git add fichero
git rebase --continue     <span class="cm"># sigue con el siguiente commit</span>

git rebase --abort        <span class="cm"># o cancelarlo todo</span></div>
     <p>Y un atajo muy usado para actualizar tu rama con lo último de remoto rebasando en vez de fusionando: <code>git pull --rebase</code> (lo ves en la unidad de GitHub).</p>`},

 {t:"opcion", p:"En la entrevista: «¿merge o rebase?». ¿Mejor respuesta?",
  ops:["Siempre rebase",
       "Siempre merge",
       "Depende: rebase para limpiar mi rama local antes de compartirla y tener historial lineal; merge para integrar ramas compartidas, porque no reescribe historia",
       "Son lo mismo"],
  ok:2,
  why:"Demuestra que conoces el riesgo de reescribir historia. Y menciona la regla de oro."}
]},

/* =============== G4 L6 =============== */
{
id:"g4l6",
titulo:"Borrar ramas y mantener el orden",
claves:["git branch -d borra una rama ya fusionada","-D fuerza el borrado (se pierden commits no fusionados)","Ramas cortas y que se integren pronto"],
pasos:[
 {t:"info", eti:"Limpieza", h:"Borrar ramas terminadas",
  c:`<p>Cuando una rama ya está integrada en main, se borra. No pierdes nada: sus commits ya están en main.</p>
     <div class="termbox">git branch -d feature/login     <span class="cm"># borra si ya esta fusionada</span>
git branch -D experimento       <span class="cm"># FUERZA el borrado aunque no este fusionada</span></div>
     <p>Con <code>-d</code> (minúscula), Git te protege: si la rama tiene commits que no están en ningún otro sitio, se niega. Con <code>-D</code> (mayúscula) le dices «ya lo sé, bórrala igual».</p>`},

 {t:"opcion", p:"Ejecutas <code>git branch -d experimento</code> y Git responde «not fully merged». ¿Qué significa?",
  ops:["Que la rama no existe",
       "Que tiene commits que no están en ninguna otra rama: si la borras, se perderían",
       "Que hay un conflicto",
       "Que no tienes permisos"],
  ok:1,
  why:"Te está avisando. Si de verdad quieres tirarlos, -D. Si no, fusiona primero."},

 {t:"escribe", p:"Escribe el comando que borra la rama ya fusionada <code>fix/fecha</code>",
  sol:["git branch -d fix/fecha","git branch --delete fix/fecha"],
  ph:"git branch ...",
  pista:"branch con el flag de borrar en minúscula.",
  why:"git branch -d fix/fecha. La forma segura."},

 {t:"info", eti:"Ramas remotas", h:"Borrar la rama también en GitHub",
  c:`<p>Borrar una rama en local no la borra en GitHub. Para eso:</p>
     <div class="termbox">git push origin --delete feature/login</div>
     <p>En la práctica, GitHub ofrece un botón «Delete branch» justo después de aceptar un Pull Request, y se puede configurar para que lo haga solo.</p>`},

 {t:"info", eti:"Buenas prácticas", h:"Cómo se trabaja con ramas en un equipo sano",
  c:`<ul><li><b>Ramas cortas</b>: días, no semanas. Cuanto más vive una rama, más conflictos acumula.</li>
     <li><b>Una rama = una tarea</b>. No mezcles el login con el rediseño del menú.</li>
     <li><b>Trae main a menudo</b> (merge o rebase) para no alejarte.</li>
     <li><b>Nunca commits directos a main</b>: todo entra por Pull Request (unidad 6).</li>
     <li><b>Borra lo que ya está integrado</b>.</li></ul>`},

 {t:"vf", p:"Borrar una rama que ya está fusionada en main hace que se pierdan sus commits.",
  ok:false,
  why:"No: sus commits ya forman parte de main. Solo desaparece la etiqueta."},

 {t:"orden", p:"Ordena el ciclo de vida completo de una rama de funcionalidad",
  items:["git switch -c feature/busqueda","Commits con el trabajo","git switch main","git merge feature/busqueda","git branch -d feature/busqueda"],
  why:"Crear → trabajar → integrar → limpiar. En equipos reales, el paso de integrar se hace con un Pull Request en GitHub."}
]}

]});
