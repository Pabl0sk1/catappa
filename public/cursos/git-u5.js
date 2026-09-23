window.CURSOS = window.CURSOS || {};
(CURSOS.git = CURSOS.git || []).push({
titulo: "GitHub y los remotos",
resumen: "clone, push, pull, fetch, autenticación y el push rechazado",
nivel: "Avanzado",
color: "#7aa2f7",
lecciones: [

/* =============== G5 L1 =============== */
{
id:"g5l1",
titulo:"Qué es un remoto y cómo clonar",
claves:["Un remoto es otra copia del repositorio, normalmente en GitHub","origin es el nombre por defecto del remoto principal","git clone descarga el repositorio completo con su historial"],
pasos:[
 {t:"info", eti:"El concepto", h:"Otra copia del mismo repositorio",
  c:`<p>Recuerda que Git es distribuido: cada copia es un repositorio completo. Un <b>remoto</b> es simplemente <b>otra copia</b> del repositorio a la que tu copia sabe llegar, normalmente alojada en GitHub.</p>
     <div class="dg"><div class="dg-tit">repositorio local y remoto</div>
<svg viewBox="0 0 340 104" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="push lleva los commits del repo local a origin en GitHub; pull los trae de vuelta"><defs><marker id="fl-git5-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs><text x="65" y="16" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">tu portátil</text><text x="275" y="16" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">GitHub</text><rect x="10" y="28" width="110" height="64" rx="8" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="65" y="55.5" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">repo local</text><text x="65" y="72.5" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">(.git)</text><rect x="220" y="28" width="110" height="64" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="275" y="55.5" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--accent)" font-weight="700">origin</text><text x="275" y="72.5" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">(repo remoto)</text><line x1="126" y1="46" x2="212" y2="46" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-git5-1)"/><text x="170" y="40" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--accent)" font-weight="700">push</text><line x1="214" y1="76" x2="128" y2="76" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-git5-1)"/><text x="170" y="94" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--accent)" font-weight="700">pull</text></svg></div>
     <p>Por convención, el remoto principal se llama <b>origin</b>. No es una palabra mágica: es solo el nombre que Git le pone por defecto al clonar.</p>`},

 {t:"info", eti:"Clonar", h:"git clone: traerte un repositorio que ya existe",
  c:`<p>Para trabajar en un proyecto que ya está en GitHub:</p>
     <div class="termbox">git clone https://github.com/empresa/api-tareas.git</div>
     <p>Esto:</p>
     <ul><li>crea una carpeta <code>api-tareas</code>,</li>
     <li>descarga <b>todo el historial</b> (todos los commits de todas las ramas),</li>
     <li>configura automáticamente el remoto <code>origin</code> apuntando a esa URL,</li>
     <li>y te deja en la rama principal, lista para trabajar.</li></ul>`},

 {t:"term", p:"Clona el repositorio <code>https://github.com/empresa/api-tareas.git</code>",
  prompt:"PS C:\\proyectos>",
  sol:["git clone https://github.com/empresa/api-tareas.git","git clone https://github.com/empresa/api-tareas"],
  pista:"git clone + la URL.",
  salida:`Cloning into 'api-tareas'...
remote: Enumerating objects: 1284, done.
remote: Counting objects: 100% (1284/1284), done.
remote: Compressing objects: 100% (612/612), done.
Receiving objects: 100% (1284/1284), 2.31 MiB | 8.40 MiB/s, done.
Resolving deltas: 100% (598/598), done.`,
  why:"1284 objetos: todos los commits de la historia del proyecto. Ya tienes una copia completa en local."},

 {t:"opcion", p:"¿Qué descarga <code>git clone</code>?",
  ops:["Solo la última versión de los ficheros",
       "El repositorio completo: todos los ficheros y todo el historial",
       "Solo la rama main",
       "Solo los ficheros que has modificado"],
  ok:1,
  why:"Todo el historial. Por eso, tras clonar, puedes ver git log completo y trabajar sin conexión."},

 {t:"info", eti:"Ver los remotos", h:"git remote -v",
  c:`<div class="termbox">git remote -v
<span class="cm">origin  https://github.com/empresa/api-tareas.git (fetch)
origin  https://github.com/empresa/api-tareas.git (push)</span></div>
     <p>Si empezaste con <code>git init</code> en local y luego creaste el repositorio vacío en GitHub, lo conectas así:</p>
     <div class="termbox">git remote add origin https://github.com/pablo/mi-api.git</div>`},

 {t:"escribe", p:"Conecta tu repositorio local al remoto <code>https://github.com/pablo/mi-api.git</code> con el nombre <code>origin</code>",
  sol:["git remote add origin https://github.com/pablo/mi-api.git"],
  ph:"git remote ...",
  pista:"git remote add + nombre + URL.",
  why:"git remote add origin URL. A partir de ahí puedes hacer push."},

 {t:"vf", p:"«origin» es un nombre obligatorio que Git exige para el remoto.",
  ok:false,
  why:"Es solo la convención. Podría llamarse github o empresa. Pero todo el mundo usa origin, así que úsalo."}
]},

/* =============== G5 L2 =============== */
{
id:"g5l2",
titulo:"git push: subir tus commits",
claves:["git push envía tus commits al remoto","-u (upstream) enlaza tu rama local con la remota la primera vez","Después basta con git push"],
pasos:[
 {t:"info", eti:"Subir", h:"Compartir tus commits",
  c:`<p>Tus commits viven en tu ordenador hasta que los <b>subes</b>:</p>
     <div class="termbox">git push origin main</div>
     <p>Se lee: «envía la rama <code>main</code> al remoto <code>origin</code>». Git manda solo los commits que el remoto no tiene todavía.</p>`},

 {t:"info", eti:"La primera vez", h:"-u: enlazar la rama local con la remota",
  c:`<p>La primera vez que subes una rama nueva, se añade <code>-u</code> (<i>--set-upstream</i>):</p>
     <div class="termbox">git push -u origin feature/login</div>
     <p>Eso crea la rama en GitHub y <b>enlaza</b> tu rama local con ella (se llama <i>tracking</i> o <i>upstream</i>). A partir de ahí, basta con:</p>
     <div class="termbox">git push
git pull</div>
     <p>Git ya sabe a qué remoto y a qué rama ir.</p>`},

 {t:"term", p:"Sube por primera vez tu rama <code>feature/login</code> a origin, dejándola enlazada",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git push -u origin feature/login","git push --set-upstream origin feature/login"],
  pista:"push, el flag de upstream, el remoto y la rama.",
  salida:`Enumerating objects: 14, done.
Writing objects: 100% (9/9), 2.10 KiB | 2.10 MiB/s, done.
remote:
remote: Create a pull request for 'feature/login' on GitHub by visiting:
remote:      https://github.com/pablo/mi-api/pull/new/feature/login
remote:
To https://github.com/pablo/mi-api.git
 * [new branch]      feature/login -> feature/login
branch 'feature/login' set up to track 'origin/feature/login'.`,
  why:"GitHub incluso te da el enlace para abrir un Pull Request. Y la última línea confirma el enlace: la próxima vez basta con git push."},

 {t:"opcion", p:"¿Para qué sirve el <code>-u</code> en <code>git push -u origin feature/login</code>?",
  ops:["Para subir más rápido",
       "Para enlazar la rama local con la remota y que después baste con git push y git pull",
       "Para borrar la rama remota",
       "Para subir sin commits"],
  ok:1,
  why:"Solo hace falta la primera vez por cada rama."},

 {t:"info", eti:"Ramas remotas", h:"origin/main no es lo mismo que main",
  c:`<p>Cuando trabajas con remotos aparecen unas ramas especiales, <b>ramas de seguimiento remoto</b>:</p>
     <div class="termbox">git branch -a
<span class="cm">* main
  feature/login
  remotes/origin/main
  remotes/origin/feature/login</span></div>
     <p><code>origin/main</code> es la <b>foto que tienes tú</b> de cómo estaba <code>main</code> en GitHub la última vez que hablaste con él. No se actualiza sola: se actualiza al hacer <code>fetch</code> o <code>pull</code>.</p>`},

 {t:"vf", p:"<code>origin/main</code> se actualiza automáticamente cada vez que alguien sube algo a GitHub.",
  ok:false,
  why:"No. Es tu copia local del estado remoto y solo se refresca con git fetch o git pull."},

 {t:"hueco", p:"Completa para subir la rama main al remoto origin",
  tpl:"git ___ ___ main",
  banco:["push","origin","pull","remote"],
  sol:["push","origin"],
  why:"git push origin main: verbo, remoto, rama."}
]},

/* =============== G5 L3 =============== */
{
id:"g5l3",
titulo:"fetch y pull: traer cambios",
claves:["git fetch descarga lo nuevo sin tocar tu rama","git pull = fetch + merge","git pull --rebase = fetch + rebase (historial más limpio)"],
pasos:[
 {t:"info", eti:"Dos formas de bajar cambios", h:"fetch y pull no son lo mismo",
  c:`<ul><li><b>git fetch</b>: descarga los commits nuevos del remoto y actualiza <code>origin/main</code>, pero <b>no toca tu rama ni tus ficheros</b>. Es mirar sin tocar.</li>
     <li><b>git pull</b>: hace un <code>fetch</code> y a continuación <b>fusiona</b> lo descargado en tu rama actual.</li></ul>
     <div class="termbox">git pull  ==  git fetch  +  git merge origin/main</div>`},

 {t:"opcion", p:"¿Qué diferencia hay entre <code>git fetch</code> y <code>git pull</code>?",
  ops:["Ninguna",
       "fetch solo descarga y actualiza las ramas remotas; pull además fusiona los cambios en tu rama",
       "fetch sube cambios y pull los baja",
       "pull es solo para GitHub"],
  ok:1,
  why:"Pregunta de entrevista clásica. pull = fetch + merge."},

 {t:"info", eti:"¿Por qué usar fetch?", h:"Mirar antes de mezclar",
  c:`<p><code>fetch</code> es la opción prudente: bajas lo nuevo y lo inspeccionas antes de integrarlo.</p>
     <div class="termbox">git fetch
git log main..origin/main --oneline   <span class="cm"># commits que hay en remoto y tu no tienes</span>
git diff main origin/main             <span class="cm"># que cambia exactamente</span>
git merge origin/main                 <span class="cm"># y si te convence, lo integras</span></div>`},

 {t:"term", p:"Trae los cambios de GitHub y fusiónalos en tu rama actual, en un solo comando",
  prompt:"PS C:\\proyectos\\mi-api>",
  sol:["git pull","git pull origin main"],
  pista:"El comando que hace fetch + merge.",
  salida:`remote: Enumerating objects: 7, done.
Unpacking objects: 100% (4/4), 812 bytes | 90.00 KiB/s, done.
From https://github.com/pablo/mi-api
   9f3c1a2..b81e0d4  main       -> origin/main
Updating 9f3c1a2..b81e0d4
Fast-forward
 src/TareaController.java | 12 ++++++++++--
 1 file changed, 10 insertions(+), 2 deletions(-)`,
  why:"Primero actualizó origin/main (el fetch) y luego avanzó tu main (el merge, aquí un fast-forward)."},

 {t:"info", eti:"Variante recomendada", h:"git pull --rebase",
  c:`<p>Si tú tienes commits locales y el remoto también avanzó, un <code>git pull</code> normal crea un commit de fusión del tipo «Merge branch 'main' of github.com...». Repetido a diario, ensucia mucho el historial.</p>
     <p>Con <code>--rebase</code>, tus commits locales se reaplican <b>encima</b> de lo que bajas, y el historial queda lineal:</p>
     <div class="termbox">git pull --rebase</div>
     <p>Es seguro porque solo reescribe <b>tus commits locales</b> (que nadie más tiene). Muchos equipos lo configuran por defecto:</p>
     <div class="termbox">git config --global pull.rebase true</div>`},

 {t:"vf", p:"<code>git pull --rebase</code> reescribe commits que ya están en GitHub.",
  ok:false,
  why:"Solo reaplica tus commits locales que aún no has subido. Lo del remoto queda intacto."},

 {t:"orden", p:"Ordena la rutina diaria al empezar a trabajar",
  items:["git switch main","git pull  (traer lo último del equipo)","git switch -c feature/nueva-tarea","Trabajar y hacer commits","git push -u origin feature/nueva-tarea"],
  why:"Empezar siempre desde un main actualizado evita muchos conflictos."}
]},

/* =============== G5 L4 =============== */
{
id:"g5l4",
titulo:"Autenticarte en GitHub: HTTPS y SSH",
claves:["GitHub ya no acepta tu contraseña para Git","HTTPS: usas un token personal (PAT) o el gestor de credenciales","SSH: generas un par de claves y subes la pública a GitHub"],
pasos:[
 {t:"info", eti:"El problema", h:"Tu contraseña de GitHub no sirve para git push",
  c:`<p>Desde 2021, GitHub <b>no acepta la contraseña de tu cuenta</b> para operaciones de Git. Si la usas al hacer push, te rechaza. Hay dos alternativas:</p>
     <ul><li><b>HTTPS con token</b>: URLs del tipo <code>https://github.com/...</code>. En lugar de contraseña usas un <b>Personal Access Token</b> (PAT). En Windows, el <i>Git Credential Manager</i> que viene con Git lo gestiona solo: te abre el navegador, inicias sesión y ya.</li>
     <li><b>SSH</b>: URLs del tipo <code>git@github.com:pablo/mi-api.git</code>. Usas un par de claves criptográficas.</li></ul>`},

 {t:"opcion", p:"Haces push por HTTPS, metes tu contraseña de GitHub y te rechaza. ¿Por qué?",
  ops:["Porque la contraseña está mal",
       "Porque GitHub ya no acepta la contraseña de la cuenta para Git: hace falta un token o SSH",
       "Porque el repositorio es privado",
       "Porque falta hacer commit"],
  ok:1,
  why:"Hace falta un Personal Access Token (o dejar que Git Credential Manager lo gestione) o configurar SSH."},

 {t:"info", eti:"SSH paso a paso", h:"Crear y registrar tu clave",
  c:`<p><b>1.</b> Generas un par de claves (una privada que se queda en tu ordenador y una pública que puedes compartir):</p>
     <div class="termbox">ssh-keygen -t ed25519 -C "pablo@ejemplo.com"
<span class="cm"># crea ~/.ssh/id_ed25519      (PRIVADA: nunca la compartas)
#   y  ~/.ssh/id_ed25519.pub  (PUBLICA: esta se sube a GitHub)</span></div>
     <p><b>2.</b> Copias el contenido de <code>id_ed25519.pub</code> y lo pegas en GitHub › Settings › SSH and GPG keys.</p>
     <p><b>3.</b> Compruebas:</p>
     <div class="termbox">ssh -T git@github.com
<span class="cm">Hi pablo! You've successfully authenticated...</span></div>`},

 {t:"par", p:"Empareja cada elemento con lo que es",
  pares:[["id_ed25519","La clave privada: nunca sale de tu ordenador"],
         ["id_ed25519.pub","La clave pública: la subes a GitHub"],
         ["Personal Access Token","Sustituto de la contraseña para Git por HTTPS"],
         ["ssh -T git@github.com","Comprueba que tu clave SSH funciona"]],
  why:"La privada es como la llave de tu casa; la pública, como la cerradura que instalas en GitHub."},

 {t:"escribe", p:"Escribe el comando que genera un par de claves SSH de tipo ed25519",
  sol:["ssh-keygen -t ed25519","ssh-keygen -t ed25519 -c pablo@ejemplo.com"],
  ph:"ssh-keygen ...",
  pista:"ssh-keygen con el flag de tipo (-t).",
  why:"ssh-keygen -t ed25519. Es el tipo recomendado hoy: más seguro y corto que RSA."},

 {t:"vf", p:"Es seguro compartir tu clave <code>id_ed25519</code> (sin .pub) con un compañero para que pueda hacer push.",
  ok:false,
  why:"Nunca. La privada es tu identidad. Cada persona genera las suyas y sube su propia clave pública."},

 {t:"info", eti:"En DevOps", h:"Las mismas claves sirven para los servidores",
  c:`<p>Esto no es solo de GitHub: <b>así es como te conectarás a los servidores</b>. Subes tu clave pública al fichero <code>~/.ssh/authorized_keys</code> del servidor y entras sin contraseña con <code>ssh usuario@servidor</code>.</p>
     <p>Y en un pipeline de CI/CD, el despliegue por SSH usa exactamente este mecanismo, con la clave privada guardada como <b>secreto</b> del pipeline. Lo verás en el curso de DevOps.</p>`}
]},

/* =============== G5 L5 =============== */
{
id:"g5l5",
titulo:"Push rechazado y el force push",
claves:["«rejected, non-fast-forward»: el remoto tiene commits que tú no tienes","La solución es git pull (o pull --rebase) y luego push","--force-with-lease en vez de --force, y nunca sobre main"],
pasos:[
 {t:"info", eti:"El error", h:"Te rechazan el push",
  c:`<p>Haces push y recibes esto:</p>
     <div class="termbox"> ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/pablo/mi-api.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. Integrate the remote changes (e.g. 'git pull ...')
hint: before pushing again.</div>
     <p>Significa: <b>alguien subió commits a esa rama después de tu último pull</b>. Si Git aceptara tu push, borraría el trabajo de esa persona. Por eso lo rechaza.</p>`},

 {t:"opcion", p:"¿Qué significa que te rechacen el push con «remote contains work that you do not have locally»?",
  ops:["Que no tienes permisos",
       "Que el remoto tiene commits nuevos que tú no tienes, y aceptar tu push los borraría",
       "Que tu código tiene errores",
       "Que la rama no existe"],
  ok:1,
  why:"Git te protege a ti y a tus compañeros."},

 {t:"info", eti:"La solución", h:"Integra primero, sube después",
  c:`<div class="termbox">git pull --rebase     <span class="cm"># traes lo nuevo y pones tus commits encima</span>
<span class="cm"># (resuelves conflictos si los hay)</span>
git push              <span class="cm"># ahora si</span></div>
     <p>Es el día a día en cualquier equipo. No es un error grave: es Git haciendo su trabajo.</p>`},

 {t:"orden", p:"Ordena cómo resolver un push rechazado",
  items:["git push  (rechazado)","git pull --rebase  (integrar lo del remoto)","Resolver conflictos si aparecen","git push  (aceptado)"],
  why:"Nunca respondas a un push rechazado con --force sin pensarlo."},

 {t:"info", eti:"El botón nuclear", h:"git push --force",
  c:`<p><code>git push --force</code> obliga al remoto a quedarse con tu versión <b>aunque se pierdan commits</b>. Solo tiene sentido en <b>tu propia rama</b>, después de haber reescrito su historia a propósito (por ejemplo, tras un rebase de tu rama de PR).</p>
     <p>Y aun así, se usa la versión segura:</p>
     <div class="termbox">git push --force-with-lease</div>
     <p><code>--force-with-lease</code> solo fuerza si el remoto está <b>como tú crees</b>. Si alguien subió algo mientras tanto, se niega. Es el force «con cinturón de seguridad».</p>
     <div class="nota ojo"><b class="tit">Regla absoluta</b>Nunca <code>--force</code> sobre <code>main</code> ni sobre ramas compartidas. En la mayoría de empresas está directamente bloqueado con protección de ramas.</div>`},

 {t:"opcion", p:"Hiciste rebase de tu rama de PR (solo la usas tú) y el push es rechazado. ¿Qué usas?",
  ops:["git push --force sobre main","git push --force-with-lease","Borro el repositorio y lo vuelvo a clonar","git pull y ya"],
  ok:1,
  why:"Es tu rama y has reescrito su historia a propósito. --force-with-lease protege por si alguien subió algo a esa rama sin que lo sepas."},

 {t:"vf", p:"<code>--force-with-lease</code> se niega a sobrescribir si el remoto tiene commits que tú no has visto.",
  ok:true,
  why:"Exacto. Por eso es la forma correcta de forzar cuando realmente hace falta."}
]}

]});
