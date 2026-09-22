window.CURSOS = window.CURSOS || {};
(CURSOS.git = CURSOS.git || []).push({
titulo: "Nivel pro y entrevista",
resumen: "cherry-pick, bisect, historial limpio, secretos filtrados y simulacro",
color: "#f5b642",
lecciones: [

/* =============== G7 L1 =============== */
{
id:"g7l1",
titulo:"cherry-pick: traer un commit concreto",
claves:["cherry-pick copia un commit concreto a tu rama actual","Crea un commit nuevo con otro hash","Útil para llevar un arreglo a otra rama sin fusionar todo"],
pasos:[
 {t:"info", eti:"El caso", h:"Necesitas un commit, no una rama entera",
  c:`<p>En <code>develop</code> alguien arregló un fallo grave en el commit <code>b81e0d4</code>. Necesitas ese arreglo <b>ya</b> en la rama de la versión que está en producción, pero no quieres traerte todo lo demás que hay en develop.</p>
     <div class="termbox">git switch release/1.4
git cherry-pick b81e0d4</div>
     <p><code>cherry-pick</code> («coger la cereza») aplica los cambios de ese único commit en tu rama actual, creando un <b>commit nuevo</b> con el mismo contenido y mensaje, pero otro hash.</p>`},

 {t:"opcion", p:"¿Qué hace <code>git cherry-pick b81e0d4</code>?",
  ops:["Fusiona la rama entera donde está ese commit",
       "Aplica los cambios de ese único commit en tu rama actual como un commit nuevo",
       "Borra ese commit",
       "Mueve tu rama a ese commit"],
  ok:1,
  why:"Solo ese commit. Si da conflictos, se resuelven como siempre y se continúa con git cherry-pick --continue."},

 {t:"term", p:"Estás en <code>release/1.4</code>. Trae solo el commit <code>b81e0d4</code>",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git cherry-pick b81e0d4"],
  pista:"El verbo es literalmente coger la cereza, con guion.",
  salida:`[release/1.4 4c2a9e7] Corrige cálculo de IVA en facturas rectificativas
 Date: Mon Sep 21 09:12:44 2026 +0200
 1 file changed, 2 insertions(+), 1 deletion(-)`,
  why:"Nuevo hash (4c2a9e7) y mismo mensaje. El arreglo ya está en la rama de la versión."},

 {t:"vf", p:"Abusar de cherry-pick entre ramas de larga duración es una buena práctica.",
  ok:false,
  why:"Duplica commits (mismo cambio con hashes distintos) y complica las fusiones posteriores. Es una herramienta puntual, no un flujo de trabajo."}
]},

/* =============== G7 L2 =============== */
{
id:"g7l2",
titulo:"git bisect: encontrar qué commit rompió algo",
claves:["bisect hace una búsqueda binaria en el historial","Marcas good y bad y Git va partiendo por la mitad","Con 1000 commits, lo encuentras en unos 10 pasos"],
pasos:[
 {t:"info", eti:"El caso", h:"Algo funcionaba hace dos semanas y ahora no",
  c:`<p>El export a CSV funcionaba en la versión <code>v1.3.0</code>. Hoy no funciona. Entre medias hay 200 commits. ¿Cuál lo rompió?</p>
     <p><code>git bisect</code> hace una <b>búsqueda binaria</b>: te lleva al commit de la mitad, tú dices si funciona o no, y descarta la mitad del historial cada vez.</p>
     <div class="termbox">git bisect start
git bisect bad                <span class="cm"># el commit actual esta roto</span>
git bisect good v1.3.0        <span class="cm"># esta version funcionaba</span>
<span class="cm">Bisecting: 100 revisions left to test after this (roughly 7 steps)</span>
<span class="cm"># pruebas... ¿funciona?</span>
git bisect good               <span class="cm"># o git bisect bad</span>
<span class="cm"># ...unos pocos pasos despues:</span>
<span class="cm">7c9e2a1 is the first bad commit</span>
git bisect reset              <span class="cm"># volver a donde estabas</span></div>`},

 {t:"opcion", p:"Hay 1000 commits entre la versión buena y la mala. ¿Cuántos pasos necesita bisect aproximadamente?",
  ops:["1000","500","Unos 10","2"],
  ok:2,
  why:"Búsqueda binaria: 2^10 = 1024. Cada respuesta descarta la mitad."},

 {t:"orden", p:"Ordena una sesión de bisect",
  items:["git bisect start","git bisect bad  (el actual está roto)","git bisect good v1.3.0  (esta funcionaba)","Probar cada commit que propone Git y marcar good o bad","Git indica el primer commit malo","git bisect reset"],
  why:"Y si tienes un test que detecta el fallo, git bisect run ./test.sh lo hace todo solo."},

 {t:"info", eti:"Por qué importa", h:"Otra razón para commits pequeños",
  c:`<p>Bisect te da un commit. Si ese commit tiene 3 líneas, encuentras el fallo al instante. Si tiene 2000 líneas mezclando cinco cosas, no te ayuda casi nada.</p>
     <p>Por eso los commits pequeños y con un solo propósito no son una manía: hacen que las herramientas de investigación funcionen.</p>`},

 {t:"vf", p:"<code>git bisect</code> necesita que le digas en qué commit empezó el problema.",
  ok:false,
  why:"Justo al revés: tú le das un punto bueno y uno malo, y bisect encuentra el commit culpable."}
]},

/* =============== G7 L3 =============== */
{
id:"g7l3",
titulo:"Historial limpio antes del PR",
claves:["Rebase interactivo: juntar, reordenar y renombrar commits locales","squash/fixup juntan commits; reword cambia mensajes","Solo sobre commits que aún no compartiste"],
pasos:[
 {t:"info", eti:"El caso", h:"Tu rama tiene commits que dan vergüenza",
  c:`<div class="termbox">git log --oneline
<span class="cm">e1 wip
e2 arreglo
e3 ahora si
e4 quito println
e5 Añade búsqueda por texto</span></div>
     <p>Antes de abrir el PR, puedes reorganizar esos commits <b>locales</b> en uno o dos que cuenten bien la historia. Se hace con el <b>rebase interactivo</b>:</p>
     <div class="termbox">git rebase -i HEAD~5</div>
     <p>Git abre el editor con la lista de commits y una palabra delante de cada uno que tú cambias.</p>`},

 {t:"info", eti:"Las órdenes", h:"pick, squash, fixup, reword, drop",
  c:`<div class="termbox">pick   e5 Añade búsqueda por texto
fixup  e1 wip
fixup  e2 arreglo
fixup  e3 ahora si
fixup  e4 quito println</div>
     <ul><li><b>pick</b>: deja el commit tal cual.</li>
     <li><b>squash</b>: lo junta con el anterior y te deja combinar los mensajes.</li>
     <li><b>fixup</b>: lo junta con el anterior y <b>descarta</b> su mensaje.</li>
     <li><b>reword</b>: mantiene el cambio, pero te deja reescribir el mensaje.</li>
     <li><b>drop</b>: elimina el commit.</li></ul>
     <p>Resultado: un único commit limpio, «Añade búsqueda por texto».</p>`},

 {t:"par", p:"Empareja cada orden del rebase interactivo con su efecto",
  pares:[["pick","Conservar el commit tal cual"],
         ["squash","Juntarlo con el anterior combinando mensajes"],
         ["fixup","Juntarlo con el anterior descartando su mensaje"],
         ["reword","Cambiar solo el mensaje"],
         ["drop","Eliminar el commit"]],
  why:"Con esto conviertes una rama desordenada en una historia que se lee bien."},

 {t:"opcion", p:"¿Cuándo es seguro usar <code>git rebase -i</code>?",
  ops:["Siempre",
       "Sobre commits que todavía no has compartido con nadie (o tu rama de PR que solo usas tú)",
       "Solo en main",
       "Solo después de hacer push"],
  ok:1,
  why:"Reescribe historia. Si la rama ya estaba subida y solo la usas tú, luego harás push --force-with-lease."},

 {t:"info", eti:"Alternativa sin editor", h:"Squash al fusionar",
  c:`<p>Si no quieres tocar tu historial, GitHub ofrece <b>«Squash and merge»</b> al aceptar el PR: todos los commits de la rama entran en <code>main</code> como uno solo, con el título del PR como mensaje. Mucha gente prefiere esto porque no requiere reescribir nada a mano.</p>`},

 {t:"vf", p:"«Squash and merge» en GitHub convierte todos los commits de un PR en un único commit en main.",
  ok:true,
  why:"Sí. main queda con un commit por funcionalidad, fácil de leer y de revertir si hace falta."}
]},

/* =============== G7 L4 =============== */
{
id:"g7l4",
titulo:"He subido una contraseña: ¿y ahora qué?",
claves:["Primero ROTA el secreto: considéralo comprometido","Borrarlo en un commit nuevo no basta: sigue en el historial","Para limpiarlo: git filter-repo o BFG, y prevenir con .gitignore y escaneo"],
pasos:[
 {t:"info", eti:"El incidente", h:"Le pasa a todo el mundo alguna vez",
  c:`<p>Hiciste commit y push de un <code>.env</code> con la contraseña de la base de datos de producción. ¿Qué haces?</p>
     <div class="nota ojo"><b class="tit">Paso 1, siempre</b><b>Rota el secreto inmediatamente</b>: cambia esa contraseña o revoca ese token. Da igual lo rápido que limpies el repositorio: si estuvo en GitHub, aunque sea un minuto, hay bots que escanean repositorios públicos en segundos. Considéralo comprometido.</div>`},

 {t:"opcion", p:"Has subido por error un token de AWS a un repositorio público. ¿Qué es lo PRIMERO que haces?",
  ops:["Borrar el fichero con un commit nuevo",
       "Revocar o rotar el token inmediatamente",
       "Hacer el repositorio privado",
       "Esperar a ver si alguien lo usa"],
  ok:1,
  why:"Lo primero es invalidar el secreto. Todo lo demás (limpiar el historial) viene después."},

 {t:"info", eti:"El error común", h:"Borrarlo con otro commit no lo elimina",
  c:`<div class="termbox">git rm .env
git commit -m "Quita .env"</div>
     <p>El fichero desaparece de la versión actual, pero <b>sigue en el historial</b>: cualquiera puede ir al commit anterior y verlo. Recuerda que Git está diseñado precisamente para no olvidar nada.</p>`},

 {t:"vf", p:"Si borras un fichero con secretos en un commit nuevo, el secreto deja de ser accesible en el repositorio.",
  ok:false,
  why:"Sigue en el historial. Hay que rotar el secreto y, si hace falta, reescribir el historial."},

 {t:"info", eti:"Limpiar el historial", h:"git filter-repo",
  c:`<p>Para eliminar el fichero de <b>todos</b> los commits se reescribe el historial entero con una herramienta como <b>git filter-repo</b> (o BFG Repo-Cleaner):</p>
     <div class="termbox">git filter-repo --path .env --invert-paths
git push --force --all</div>
     <p>Es una operación delicada: cambia los hashes de todo el historial y cada persona del equipo tendrá que volver a clonar. Por eso lo primero siempre es rotar el secreto.</p>`},

 {t:"orden", p:"Ordena la respuesta correcta a un secreto filtrado",
  items:["Rotar o revocar el secreto inmediatamente","Avisar al equipo o al responsable de seguridad","Limpiar el historial si hace falta (git filter-repo)","Añadir el fichero al .gitignore","Activar el escaneo de secretos para que no vuelva a pasar"],
  why:"Contención, comunicación, limpieza y prevención. Contar esto en una entrevista demuestra madurez."},

 {t:"info", eti:"Prevención", h:"Que no vuelva a pasar",
  c:`<ul><li><code>.env</code>, <code>*.pem</code> y similares en el <code>.gitignore</code> desde el primer commit.</li>
     <li>Subir un <code>.env.example</code> sin valores reales.</li>
     <li><b>GitHub secret scanning</b> y <b>push protection</b>: bloquean el push si detectan un token conocido.</li>
     <li>Hooks locales (pre-commit con <i>gitleaks</i>) que revisan antes de cada commit.</li>
     <li>Los secretos de verdad, en un gestor: variables del CI, Vault, AWS Secrets Manager.</li></ul>`}
]},

/* =============== G7 L5 =============== */
{
id:"g7l5",
titulo:"Simulacro de entrevista: Git y GitHub",
claves:["Has repasado las preguntas más frecuentes de Git","Sabes elegir entre reset, revert, merge y rebase","Puedes explicar un flujo de trabajo en equipo completo"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas, como en la entrevista real",
  c:`<p>Contesta en voz alta antes de elegir. Si fallas alguna, vuelve a la lección correspondiente.</p>`},

 {t:"opcion", p:"«¿Qué diferencia hay entre Git y GitHub?»",
  ops:["Ninguna",
       "Git es el sistema de control de versiones que corre en local; GitHub es una plataforma que aloja repositorios Git y añade colaboración: PRs, revisión, issues y Actions",
       "GitHub es la versión de pago de Git",
       "Git es para Linux y GitHub para Windows"],
  ok:1,
  why:"Herramienta frente a plataforma."},

 {t:"opcion", p:"«¿Qué es el staging area?»",
  ops:["El servidor de pruebas",
       "La zona intermedia donde preparas qué cambios entran en el próximo commit",
       "Una rama especial",
       "La papelera de Git"],
  ok:1,
  why:"Te permite hacer commits limpios con un solo propósito."},

 {t:"opcion", p:"«¿git fetch o git pull?»",
  ops:["Son iguales",
       "fetch descarga y actualiza las ramas remotas sin tocar la tuya; pull hace fetch y además fusiona en tu rama",
       "fetch sube y pull baja",
       "pull es obsoleto"],
  ok:1,
  why:"pull = fetch + merge (o + rebase con --rebase)."},

 {t:"opcion", p:"«Un commit roto ya está en main y desplegado. ¿Cómo lo deshaces?»",
  ops:["git reset --hard y push --force",
       "git revert del commit: crea uno nuevo que lo invierte sin reescribir la historia compartida",
       "Borrando el repositorio",
       "git restore"],
  ok:1,
  why:"reset para lo local; revert para lo publicado."},

 {t:"opcion", p:"«¿Merge o rebase?»",
  ops:["Siempre rebase",
       "Rebase para ordenar mi rama local antes de compartirla; merge para integrar ramas compartidas. Y nunca rebase de lo que otros ya tienen",
       "Siempre merge",
       "Da igual"],
  ok:1,
  why:"Mencionar la regla de oro es lo que marca la diferencia."},

 {t:"opcion", p:"«Tienes un conflicto al fusionar. ¿Qué haces?»",
  ops:["git merge --force",
       "Abro los ficheros, elijo o combino el código entre los marcadores, los borro, compruebo que compila y pasan los tests, git add y git commit",
       "Borro mi rama",
       "Acepto siempre mi versión"],
  ok:1,
  why:"Y si se complica: git merge --abort y volver a intentarlo con calma."},

 {t:"opcion", p:"«¿Cómo trabajáis en equipo con Git?»",
  ops:["Todos hacemos push a main",
       "Ramas cortas por tarea, Pull Request con revisión y CI obligatorio, main protegida y siempre desplegable, y squash o merge al integrar",
       "Cada uno en su rama para siempre",
       "Nos pasamos los ficheros por correo"],
  ok:1,
  why:"Eso es GitHub Flow con protección de ramas. Una respuesta completa y profesional."},

 {t:"opcion", p:"«Has subido una contraseña a GitHub. ¿Qué haces?»",
  ops:["Borro el fichero en otro commit y listo",
       "La roto inmediatamente, aviso, limpio el historial si hace falta con filter-repo y añado prevención: .gitignore y escaneo de secretos",
       "Hago el repositorio privado",
       "Nada, nadie lo verá"],
  ok:1,
  why:"Primero contener (rotar). El historial nunca olvida."},

 {t:"info", eti:"Terminado", h:"Ya sabes Git como se usa en un equipo real",
  c:`<p>Recapitulando: sabes guardar cambios con commits limpios, deshacer cualquier cosa con la herramienta adecuada, trabajar con ramas, resolver conflictos, colaborar en GitHub con Pull Requests y revisión, y responder a un incidente con secretos.</p>
     <p>El siguiente paso natural es el <b>curso de DevOps</b>: ahí verás cómo cada push dispara un pipeline que prueba, construye y despliega tu aplicación.</p>`}
]}

]});
