window.CURSOS = window.CURSOS || {};
(CURSOS.git = CURSOS.git || []).push({
titulo: "Deshacer cosas sin miedo",
resumen: "restore, amend, reset, revert, stash y reflog: saber volver atrás",
nivel: "Intermedio",
color: "#c49bf2",
lecciones: [

/* =============== G3 L1 =============== */
{
id:"g3l1",
titulo:"Descartar cambios con restore",
claves:["git restore fichero descarta cambios no preparados (¡se pierden!)","git restore --staged fichero lo saca del staging sin perder nada","Antes de descartar, mira con git diff"],
pasos:[
 {t:"info", eti:"Situación", h:"Has roto algo y quieres volver a como estaba",
  c:`<p>Llevas media hora cambiando <code>TareaService.java</code>, nada funciona y quieres volver a la última versión guardada (la del último commit).</p>
     <div class="termbox">git restore src/TareaService.java</div>
     <p>El fichero vuelve a estar <b>exactamente</b> como en el último commit.</p>
     <div class="nota ojo"><b class="tit">Es irreversible</b>Los cambios que no habías guardado <b>desaparecen</b>. Git nunca los tuvo, así que no puede recuperarlos. Antes de descartar, mira con <code>git diff</code> qué vas a perder.</div>`},

 {t:"opcion", p:"Ejecutas <code>git restore App.java</code> sobre cambios que no habías preparado ni guardado. ¿Puedes recuperarlos después?",
  ops:["Sí, con git log","Sí, con git reflog","No: Git nunca los guardó, se han perdido","Sí, están en el staging"],
  ok:2,
  why:"Es de los pocos comandos de Git que destruyen trabajo de verdad. Lo que nunca entró en un commit ni en el staging, Git no lo conoce."},

 {t:"info", eti:"Dos usos distintos", h:"restore y restore --staged",
  c:`<div class="termbox">git restore App.java            <span class="cm"># DESCARTA los cambios del fichero (peligroso)</span>
git restore --staged App.java   <span class="cm"># lo SACA del staging, conserva los cambios (seguro)</span></div>
     <p>El segundo es el que usarás cuando hiciste <code>git add</code> de algo que no querías en este commit: vuelve a estar como "modificado" en tu carpeta, sin perder nada.</p>`},

 {t:"par", p:"Empareja cada comando con su efecto",
  pares:[["git restore App.java","Descarta los cambios no preparados del fichero"],
         ["git restore --staged App.java","Lo quita del staging y conserva los cambios"],
         ["git restore .","Descarta TODOS los cambios no preparados de la carpeta"]],
  why:"Uno es seguro y los otros destruyen trabajo. Lee siempre dos veces antes de lanzarlos."},

 {t:"term", p:"Añadiste <code>pom.xml</code> al staging por error. Sácalo sin perder los cambios",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git restore --staged pom.xml"],
  pista:"restore con el flag que se refiere al staging.",
  salida:``,
  why:"pom.xml vuelve a aparecer en rojo (modificado, no preparado) en git status. Tus cambios siguen ahí."},

 {t:"info", eti:"Nota histórica", h:"Verás git checkout -- fichero",
  c:`<p>En tutoriales antiguos verás esto:</p>
     <div class="termbox">git checkout -- App.java      <span class="cm"># antiguo = git restore App.java</span>
git reset HEAD App.java      <span class="cm"># antiguo = git restore --staged App.java</span></div>
     <p>Funcionan igual. <code>git restore</code> y <code>git switch</code> se crearon en 2019 para separar tareas que antes hacía <code>checkout</code>, que servía para demasiadas cosas a la vez.</p>`},

 {t:"vf", p:"<code>git restore --staged</code> es seguro: no hace perder ningún cambio.",
  ok:true,
  why:"Correcto. Solo mueve el cambio del staging al directorio de trabajo."}
]},

/* =============== G3 L2 =============== */
{
id:"g3l2",
titulo:"Arreglar el último commit: --amend",
claves:["git commit --amend rehace el último commit","Sirve para corregir el mensaje o añadir algo olvidado","Cambia el hash: no lo uses si ya hiciste push"],
pasos:[
 {t:"info", eti:"Situación", h:"Acabas de hacer commit y te has equivocado",
  c:`<p>Dos casos típicos, justo después de hacer commit:</p>
     <ul><li>El mensaje tiene una errata.</li>
     <li>Se te olvidó añadir un fichero.</li></ul>
     <p>En vez de crear un segundo commit «perdón, se me olvidó esto», puedes <b>rehacer el último</b>:</p>
     <div class="termbox"><span class="cm"># corregir solo el mensaje</span>
git commit --amend -m "Añade validación del título de la tarea"

<span class="cm"># añadir un fichero olvidado al mismo commit</span>
git add src/TareaValidator.java
git commit --amend --no-edit</div>
     <p><code>--no-edit</code> mantiene el mensaje que ya tenía.</p>`},

 {t:"hueco", p:"Completa para añadir un fichero olvidado al último commit sin cambiar su mensaje",
  tpl:"git add Olvidado.java\ngit commit ___ ___",
  banco:["--amend","--no-edit","-m","--all"],
  sol:["--amend","--no-edit"],
  why:"--amend rehace el último commit; --no-edit conserva el mensaje."},

 {t:"info", eti:"La trampa", h:"--amend crea un commit NUEVO",
  c:`<p>Aunque parezca que "modificas" el commit, en realidad Git crea <b>uno nuevo</b> con otro hash y descarta el anterior. Recuerda: el hash depende del contenido.</p>
     <div class="dg"><div class="dg-tit">git commit --amend</div>
<svg viewBox="0 0 320 176" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Antes HEAD está en 9f3c1a2; después del amend está en 7b1d4e0, un commit nuevo con el mismo padre, e4f5a6b"><defs><marker id="fl-git3-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs><text x="8" y="34" text-anchor="start" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">antes</text><line x1="166.0" y1="30.0" x2="116.0" y2="30.0" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-git3-1)"/><circle cx="95" cy="30" r="19" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/><text x="95" y="66" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">e4f5a6b</text><circle cx="185" cy="30" r="19" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/><text x="185" y="66" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">9f3c1a2</text><rect x="252.5" y="19" width="45" height="22" rx="11" fill="var(--bg-3)" stroke="var(--ink-2)" stroke-width="1.5"/><text x="275" y="34" text-anchor="middle" font-size="12" font-family="var(--mono)" font-weight="700" fill="var(--ink)">HEAD</text><line x1="251" y1="30" x2="207" y2="30" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-git3-1)"/><text x="8" y="114" text-anchor="start" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">después</text><line x1="166.0" y1="110.0" x2="116.0" y2="110.0" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-git3-1)"/><circle cx="95" cy="110" r="19" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/><text x="95" y="146" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)">e4f5a6b</text><circle cx="185" cy="110" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="185" y="146" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">7b1d4e0</text><rect x="252.5" y="99" width="45" height="22" rx="11" fill="var(--bg-3)" stroke="var(--ink-2)" stroke-width="1.5"/><text x="275" y="114" text-anchor="middle" font-size="12" font-family="var(--mono)" font-weight="700" fill="var(--ink)">HEAD</text><line x1="251" y1="110" x2="207" y2="110" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-git3-1)"/><text x="185" y="166" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)" font-weight="700">hash distinto</text></svg></div>
     <p>Si ya habías hecho <b>push</b> de <code>9f3c1a2</code> y alguien lo descargó, ahora tu historial y el suyo <b>no coinciden</b>. Eso se llama <b>reescribir historia publicada</b>, y causa problemas.</p>
     <div class="nota ojo"><b class="tit">Regla de oro</b>Usa <code>--amend</code> solo con commits que <b>todavía no has subido</b>.</div>`},

 {t:"opcion", p:"Hiciste push de un commit hace una hora y tu equipo ya lo tiene. Ves una errata en el mensaje. ¿Usas --amend?",
  ops:["Sí, siempre",
       "No: cambiaría el hash de un commit que otros ya tienen; mejor dejarlo o, si es grave, añadir un commit nuevo",
       "Sí, y luego borro la rama",
       "Solo si es viernes"],
  ok:1,
  why:"Reescribir historia compartida obliga a los demás a arreglar sus copias. Una errata en un mensaje no lo justifica."},

 {t:"vf", p:"Después de <code>git commit --amend</code>, el commit conserva su mismo hash.",
  ok:false,
  why:"Se genera un commit nuevo con un hash distinto. Por eso no se debe usar sobre commits ya publicados."},

 {t:"escribe", p:"Escribe el comando que cambia el mensaje del último commit a <code>Corrige el cálculo del total</code>",
  sol:["git commit --amend -m corrige el cálculo del total","git commit --amend -m \"corrige el cálculo del total\"","git commit --amend -m corrige el calculo del total"],
  ph:"git commit ...",
  pista:"commit, el flag de rehacer, y el mensaje con -m.",
  why:"git commit --amend -m \"...\". Perfecto para esas erratas que ves justo al pulsar Enter."}
]},

/* =============== G3 L3 =============== */
{
id:"g3l3",
titulo:"git reset: mover la rama hacia atrás",
claves:["--soft: deshace el commit y deja los cambios preparados","--mixed (por defecto): deshace el commit y deja los cambios sin preparar","--hard: deshace el commit Y borra los cambios (peligroso)"],
pasos:[
 {t:"info", eti:"El concepto", h:"reset mueve la rama a otro commit",
  c:`<p><code>git reset</code> hace que tu rama (y HEAD) apunte a un commit anterior. Es como decir: «el último commit de esta rama ahora es este otro».</p>
     <div class="termbox">git reset HEAD~1     <span class="cm"># vuelve un commit atras</span></div>
     <p>La pregunta es: ¿qué pasa con los cambios de los commits que "deshaces"? Depende del modo. Hay tres, y conviene saberlos de memoria.</p>`},

 {t:"info", eti:"Los tres modos", h:"--soft, --mixed y --hard",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">los tres modos de reset</div><table class="dg-tabla"><thead><tr><th>comando</th><th>el commit desaparece</th><th>staging</th><th>tu carpeta</th></tr></thead><tbody>
<tr><td><code>git reset --soft HEAD~1</code></td><td>sí</td><td>cambios aquí</td><td>intacta</td></tr>
<tr><td><code>git reset --mixed HEAD~1</code><br><small>(por defecto)</small></td><td>sí</td><td>vacío</td><td>cambios aquí</td></tr>
<tr><td><code>git reset --hard HEAD~1</code></td><td>sí</td><td>vacío</td><td><b style="color:var(--bad)">¡CAMBIOS BORRADOS!</b></td></tr>
</tbody></table></div>
     <ul><li><b>--soft</b>: «deshaz el commit pero déjame todo preparado para volver a hacerlo». Útil para juntar varios commits en uno.</li>
     <li><b>--mixed</b> (el que se usa si no pones nada): «deshaz el commit y deja los cambios en mi carpeta, sin preparar». El más común.</li>
     <li><b>--hard</b>: «deshaz el commit y tira los cambios a la basura». Tu carpeta queda idéntica al commit al que vuelves.</li></ul>`},

 {t:"par", p:"Empareja cada modo de reset con lo que pasa con tus cambios",
  pares:[["--soft","Siguen preparados en el staging"],
         ["--mixed","Siguen en tu carpeta, sin preparar"],
         ["--hard","Se borran de la carpeta"]],
  why:"Truco para recordarlo: soft es suave (no toca nada), hard es duro (lo arrasa todo), mixed está en medio."},

 {t:"opcion", p:"Hiciste un commit con un mensaje horrible y quieres rehacerlo con los mismos cambios. ¿Qué usas?",
  ops:["git reset --hard HEAD~1","git reset --soft HEAD~1 y luego git commit con un mensaje bueno","git restore .","git revert HEAD"],
  ok:1,
  why:"--soft deshace el commit pero deja todo preparado: solo tienes que volver a hacer commit. (Para el último commit, --amend también valdría.)"},

 {t:"opcion", p:"Tus dos últimos commits son un experimento fallido y quieres que desaparezcan con todos sus cambios. No has hecho push. ¿Qué usas?",
  ops:["git reset --soft HEAD~2","git reset --hard HEAD~2","git restore HEAD~2","git log -2"],
  ok:1,
  why:"--hard y dos commits atrás. Como no están publicados, reescribir la historia local no molesta a nadie."},

 {t:"info", eti:"Peligro", h:"reset tampoco se usa en historia publicada",
  c:`<p>Igual que <code>--amend</code>, <code>reset</code> reescribe el historial: los commits que "quitas" dejan de estar en la rama.</p>
     <p>Si esos commits ya estaban en GitHub, tu rama local y la remota divergen y el siguiente push será rechazado. Forzarlo borraría el trabajo de la rama remota para los demás.</p>
     <div class="nota ojo"><b class="tit">Regla</b>¿No has hecho push? <code>reset</code> sin problema. ¿Ya está publicado? Usa <code>revert</code> (siguiente lección).</div>`},

 {t:"escribe", p:"Escribe el comando que deshace el último commit dejando sus cambios en tu carpeta (sin preparar)",
  sol:["git reset head~1","git reset --mixed head~1","git reset head^","git reset --mixed head^"],
  ph:"git reset ...",
  pista:"El modo por defecto no necesita flag. Y un commit atrás desde HEAD.",
  why:"git reset HEAD~1 (el --mixed es implícito). El más usado para «me he precipitado haciendo commit»."},

 {t:"vf", p:"<code>git reset --hard</code> es seguro de usar en cualquier situación porque Git siempre guarda una copia.",
  ok:false,
  why:"Los cambios que no estaban en ningún commit se pierden. Los commits «quitados» se pueden rescatar un tiempo con reflog, pero lo no guardado, no."}
]},

/* =============== G3 L4 =============== */
{
id:"g3l4",
titulo:"git revert: deshacer de forma segura",
claves:["revert crea un commit NUEVO que invierte a otro","No reescribe historia: es seguro en ramas compartidas","reset para lo local, revert para lo publicado"],
pasos:[
 {t:"info", eti:"El problema", h:"Un commit publicado ha roto producción",
  c:`<p>Hace dos días alguien subió a <code>main</code> el commit <code>7c9e2a1</code> y ha roto el cálculo de precios. Ya lo tiene todo el equipo y está desplegado.</p>
     <p>No puedes usar <code>reset</code> (reescribiría historia compartida). Lo correcto es:</p>
     <div class="termbox">git revert 7c9e2a1</div>
     <p><code>revert</code> crea un <b>commit nuevo</b> que hace exactamente lo contrario del commit indicado: lo que se añadió se quita y lo que se quitó se vuelve a poner.</p>`},

 {t:"info", eti:"Visualizarlo", h:"La historia no se borra: se añade",
  c:`<div class="dg dg-tabla-caja"><table class="dg-tabla"><tbody><tr><td>antes:</td><td>a1b2 &lt;-- 7c9e (rompe precios) &lt;-- d4f1</td></tr><tr><td>despues:</td><td>a1b2 &lt;-- 7c9e &lt;-- d4f1 &lt;-- 8e3b "Revert: rompe precios"</td></tr><tr><td></td><td>^ commit NUEVO que deshace 7c9e</td></tr></tbody></table></div>
     <p>El commit malo sigue en el historial (queda registrado que existió y que se deshizo), pero su efecto desaparece. Nadie tiene que arreglar su copia: es un commit más, se descarga con un pull normal.</p>`},

 {t:"opcion", p:"¿Por qué revert es seguro en una rama que comparte todo el equipo?",
  ops:["Porque borra el commit malo",
       "Porque no reescribe la historia: añade un commit nuevo que invierte al malo",
       "Porque pide permiso a los demás",
       "Porque solo funciona en local"],
  ok:1,
  why:"Añadir commits nunca rompe las copias de los demás. Reescribir, sí."},

 {t:"par", p:"Empareja cada situación con el comando adecuado",
  pares:[["Commit local, no subido, quiero que desaparezca","git reset"],
         ["Commit ya en main y desplegado, quiero deshacer su efecto","git revert"],
         ["Errata en el mensaje del último commit, no subido","git commit --amend"],
         ["Cambios sin guardar que quiero tirar","git restore"]],
  why:"Esta tabla es una pregunta de entrevista de Git en sí misma."},

 {t:"term", p:"Deshaz de forma segura el efecto del commit <code>7c9e2a1</code>",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git revert 7c9e2a1"],
  pista:"El verbo es «revertir» y luego el hash.",
  salida:`[main 8e3b0f4] Revert "Cambia el cálculo de precios con descuento"
 1 file changed, 3 insertions(+), 5 deletions(-)`,
  why:"Git ha creado el commit 8e3b0f4 que deshace al 7c9e2a1. Ahora haces push y el arreglo llega a todos."},

 {t:"vf", p:"Después de un <code>git revert</code>, el commit revertido desaparece del historial.",
  ok:false,
  why:"Sigue ahí. Lo que se añade es otro commit que anula su efecto. El historial cuenta la verdad completa."},

 {t:"opcion", p:"En la entrevista: «¿diferencia entre reset y revert?»",
  ops:["Son sinónimos",
       "reset mueve la rama hacia atrás reescribiendo el historial (para lo local); revert crea un commit que invierte otro sin reescribir (para lo publicado)",
       "revert es más rápido",
       "reset solo funciona en GitHub"],
  ok:1,
  why:"Esa frase exacta es una respuesta de nivel alto."}
]},

/* =============== G3 L5 =============== */
{
id:"g3l5",
titulo:"stash y reflog: tus redes de seguridad",
claves:["git stash guarda cambios a medias temporalmente","git stash pop los recupera","git reflog registra por dónde ha pasado HEAD: rescata commits «perdidos»"],
pasos:[
 {t:"info", eti:"Situación", h:"Te interrumpen a mitad de algo",
  c:`<p>Estás a mitad de una funcionalidad, con cambios sin terminar. Te piden arreglar urgente un fallo en otra rama. No quieres hacer commit de algo a medias, pero Git no te deja cambiar de rama si hay conflictos con tus cambios.</p>
     <p>Solución: <b>guardarlos en un cajón</b> temporal.</p>
     <div class="termbox">git stash                 <span class="cm"># guarda los cambios y deja la carpeta limpia</span>
git switch main
<span class="cm">... arreglas el fallo, commit, push ...</span>
git switch feature/busqueda
git stash pop             <span class="cm"># recupera los cambios y los quita del cajon</span></div>`},

 {t:"orden", p:"Ordena el flujo de atender una urgencia con stash",
  items:["git stash  (guardar el trabajo a medias)","git switch main  (ir a la rama del fallo)","Arreglar, commit y push","git switch feature/busqueda  (volver)","git stash pop  (recuperar lo que tenías)"],
  why:"Tu trabajo a medias queda a salvo sin ensuciar el historial con un commit «WIP»."},

 {t:"info", eti:"Más opciones", h:"Gestionar el cajón",
  c:`<div class="termbox">git stash -m "busqueda a medias"   <span class="cm"># con descripcion</span>
git stash list                    <span class="cm"># ver lo guardado</span>
<span class="cm">stash@{0}: On feature/busqueda: busqueda a medias</span>
git stash pop                     <span class="cm"># recupera el ultimo y lo borra del cajon</span>
git stash apply                   <span class="cm"># recupera pero lo DEJA en el cajon</span>
git stash drop                    <span class="cm"># tira el ultimo sin aplicarlo</span>
git stash -u                      <span class="cm"># incluye tambien los ficheros nuevos</span></div>
     <p>Detalle: por defecto <code>stash</code> <b>no guarda los ficheros nuevos</b> (untracked). Para incluirlos, <code>-u</code>.</p>`},

 {t:"opcion", p:"¿Diferencia entre <code>git stash pop</code> y <code>git stash apply</code>?",
  ops:["Ninguna",
       "pop recupera los cambios y los borra del cajón; apply los recupera y los deja guardados",
       "apply borra los cambios",
       "pop solo funciona en main"],
  ok:1,
  why:"apply es útil si quieres aplicar los mismos cambios en varias ramas."},

 {t:"info", eti:"La red de seguridad definitiva", h:"git reflog",
  c:`<p>Hiciste <code>git reset --hard HEAD~3</code> y te has dado cuenta de que uno de esos commits lo necesitabas. ¿Perdido? <b>No.</b></p>
     <p>Git guarda un registro de <b>todos los sitios por los que ha pasado HEAD</b> en tu repositorio local, durante unos 90 días:</p>
     <div class="termbox">git reflog
<span class="cm">e4f5a6b HEAD@{0}: reset: moving to HEAD~3
9f3c1a2 HEAD@{1}: commit: Añade endpoint de tareas     &lt;- ¡aqui esta!
3b7a0c9 HEAD@{2}: commit: Añade validacion</span>

git reset --hard 9f3c1a2     <span class="cm"># y vuelves a tenerlo todo</span></div>
     <div class="nota dato"><b class="tit">La frase que tranquiliza</b>«En Git es muy difícil perder algo que llegó a estar en un commit: casi siempre se puede rescatar con el reflog.»</div>`},

 {t:"vf", p:"Un commit que «borraste» con <code>git reset --hard</code> se puede recuperar con <code>git reflog</code> durante un tiempo.",
  ok:true,
  why:"Sí. Los commits quedan en el repositorio aunque ninguna rama apunte a ellos, y el reflog te dice su hash."},

 {t:"escribe", p:"Escribe el comando que muestra el registro de todos los movimientos de HEAD",
  sol:["git reflog"],
  ph:"git ...",
  pista:"«reference log», todo junto.",
  why:"git reflog. Si alguna vez crees que has perdido trabajo, es el primer sitio donde mirar."},

 {t:"vf", p:"<code>git stash</code> guarda por defecto también los ficheros nuevos que nunca has añadido.",
  ok:false,
  why:"No; los untracked se quedan en la carpeta. Para incluirlos: git stash -u."}
]}

]});
