window.CURSOS = window.CURSOS || {};
(CURSOS.git = CURSOS.git || []).push({
titulo: "Qué es Git y por qué lo usa todo el mundo",
resumen: "Control de versiones, Git contra GitHub, las tres zonas y qué es un commit",
nivel: "Fundamentos",
color: "#f26d6d",
lecciones: [

/* =============== G1 L1 =============== */
{
id:"g1l1",
titulo:"El problema del «final_v2_DEFINITIVO»",
claves:["Un sistema de control de versiones guarda el historial completo de un proyecto","Permite volver atrás, ver quién cambió qué y trabajar varias personas a la vez","Git es el sistema de control de versiones que usa prácticamente toda la industria"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Seguro que has hecho esto alguna vez",
  c:`<p>Tienes un trabajo importante y, para no perder nada, vas guardando copias:</p>
     <div class="termbox">informe.docx
informe_v2.docx
informe_v2_revisado.docx
informe_final.docx
informe_final_DEFINITIVO.docx
informe_final_DEFINITIVO_ahora_si.docx</div>
     <p>Funciona... hasta que no. No sabes qué cambió entre una copia y otra, ni por qué, ni cuál es la buena. Y si trabajáis dos personas, cada una con sus copias, fusionar el resultado es una pesadilla.</p>
     <p>Con código pasa exactamente lo mismo, pero multiplicado: cientos de ficheros, varias personas tocándolos a la vez y cambios cada hora.</p>`},

 {t:"info", eti:"La solución", h:"Un sistema de control de versiones",
  c:`<p>Un <b>sistema de control de versiones</b> es un programa que guarda el <b>historial completo</b> de un proyecto. Cada vez que decides que algo está listo, haces una "foto" del estado de todos los ficheros y el sistema la guarda con:</p>
     <ul><li><b>qué</b> cambió (línea a línea),</li>
     <li><b>quién</b> lo cambió,</li>
     <li><b>cuándo</b>,</li>
     <li>y <b>por qué</b> (un mensaje que escribes tú).</li></ul>
     <p>Con eso puedes volver a cualquier momento del pasado, comparar versiones, y que varias personas trabajen a la vez sin pisarse.</p>`},

 {t:"opcion", p:"¿Qué guarda un sistema de control de versiones?",
  ops:["Solo la última versión de cada fichero",
       "El historial completo de cambios: qué cambió, quién, cuándo y por qué",
       "Una copia de seguridad del disco duro",
       "Solo los ficheros que han dado error"],
  ok:1,
  why:"El historial completo. Eso es lo que te permite volver atrás o investigar cuándo apareció un fallo."},

 {t:"info", eti:"Git", h:"El estándar de la industria",
  c:`<p><b>Git</b> es el sistema de control de versiones más usado del mundo. Lo creó Linus Torvalds en 2005 (el mismo que creó Linux) para gestionar el código del kernel de Linux, que tiene miles de colaboradores.</p>
     <p>Hoy lo usa prácticamente toda empresa de software. En una entrevista se da por hecho que lo sabes usar, así que no saberlo es un descarte directo.</p>`},

 {t:"par", p:"Empareja cada problema con lo que hace Git para resolverlo",
  pares:[["No sé qué cambió entre dos versiones","Guarda las diferencias línea a línea"],
         ["Rompí algo y quiero volver atrás","Permite recuperar cualquier versión anterior"],
         ["No sé quién hizo este cambio ni por qué","Registra autor, fecha y mensaje de cada cambio"],
         ["Somos varios tocando el mismo proyecto","Permite trabajar en paralelo y fusionar"]],
  why:"Esas cuatro cosas son exactamente por las que existe Git."},

 {t:"vf", p:"Git solo sirve para proyectos grandes con muchos programadores.",
  ok:false,
  why:"También es útil trabajando solo: te da historial, poder volver atrás y experimentar sin miedo. Por eso se usa hasta en proyectos personales."},

 {t:"opcion", p:"Te preguntan en una entrevista: «¿para qué sirve Git?». ¿Qué respondes?",
  ops:["Para subir código a internet",
       "Es un sistema de control de versiones: guarda el historial de cambios del proyecto, permite volver atrás y que varias personas trabajen en paralelo",
       "Para compilar el código",
       "Para hacer copias de seguridad automáticas"],
  ok:1,
  why:"Ojo con la primera opción: subir código a internet es lo que hace GitHub, no Git. Lo vemos en la lección siguiente."}
]},

/* =============== G1 L2 =============== */
{
id:"g1l2",
titulo:"Git contra GitHub",
claves:["Git es la herramienta; GitHub es una plataforma que aloja repositorios Git","Git funciona sin internet y sin GitHub","Git es distribuido: cada copia tiene el historial completo"],
pasos:[
 {t:"info", eti:"La confusión más común", h:"No son lo mismo",
  c:`<p>Mucha gente los usa como sinónimos. No lo son, y confundirlos en una entrevista queda mal.</p>
     <ul><li><b>Git</b> es un <b>programa</b> que instalas en tu ordenador. Funciona en local, sin internet y sin ninguna cuenta.</li>
     <li><b>GitHub</b> es una <b>plataforma web</b> (de Microsoft) que <b>aloja</b> repositorios de Git en internet y añade herramientas para colaborar: Pull Requests, revisión de código, issues, automatización con Actions...</li></ul>
     <div class="nota"><b class="tit">Analogía</b>Git es como el formato de un documento. GitHub es como Google Drive: un sitio donde guardar y compartir esos documentos, con extras para trabajar en equipo.</div>`},

 {t:"opcion", p:"¿Puedes usar Git sin tener cuenta en GitHub?",
  ops:["No, Git necesita GitHub para funcionar",
       "Sí: Git funciona completamente en local; GitHub solo es un sitio donde alojar el repositorio",
       "Solo con internet",
       "Solo en Linux"],
  ok:1,
  why:"Sí. Git no sabe nada de GitHub. Puedes versionar un proyecto entero en tu portátil sin conexión."},

 {t:"info", eti:"Alternativas", h:"GitHub no es el único",
  c:`<p>Hay otras plataformas que hacen lo mismo que GitHub, todas usando Git por debajo:</p>
     <ul><li><b>GitLab</b> — muy usada en empresas, con CI/CD muy potente integrado.</li>
     <li><b>Bitbucket</b> — de Atlassian, habitual donde se usa Jira.</li>
     <li><b>Azure DevOps</b>, <b>Gitea</b>...</li></ul>
     <p>Lo que aprendas de Git sirve en todas. Lo específico de GitHub (Actions, la interfaz de PRs) cambia un poco de nombre en cada una, pero los conceptos son los mismos.</p>`},

 {t:"par", p:"Empareja cada cosa con lo que es",
  pares:[["Git","Programa de control de versiones que corre en tu máquina"],
         ["GitHub","Plataforma web que aloja repositorios y facilita colaborar"],
         ["GitLab","Alternativa a GitHub, muy usada en empresas"],
         ["Repositorio","Un proyecto con todo su historial de versiones"]],
  why:"Y ya ha salido la palabra clave: repositorio (o «repo»). Es un proyecto versionado con Git."},

 {t:"info", eti:"Concepto clave", h:"Git es distribuido",
  c:`<p>Antes de Git se usaban sistemas <b>centralizados</b> (como SVN): había un único servidor con el historial, y cada programador solo tenía la última versión. Si el servidor caía, nadie podía trabajar ni ver el historial.</p>
     <p>Git es <b>distribuido</b>: cuando descargas un repositorio, te bajas <b>el historial completo</b>. Cada copia es un repositorio entero y autónomo.</p>
     <div class="dg"><div class="dg-tit">centralizado frente a distribuido</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Centralizado (SVN)</div>
<div class="dg-caja acento">servidor</div>
<div class="dg-fila"><div class="dg-caja">tú</div><div class="dg-caja">Ana</div><div class="dg-caja">Leo</div></div>
<div class="dg-nota arriba">solo la última versión</div></div>
<div class="dg-col"><div class="dg-col-tit">Distribuido (Git)</div>
<div class="dg-caja base">GitHub<small>una copia más</small></div>
<div class="dg-fila"><div class="dg-caja ok">tú</div><div class="dg-caja ok">Ana</div><div class="dg-caja ok">Leo</div></div>
<div class="dg-nota arriba">cada uno tiene el historial COMPLETO</div></div>
</div></div>
     <p>Consecuencias: puedes hacer commits, ver el historial y crear ramas <b>sin conexión</b>, todo es muy rápido porque es local, y si GitHub desapareciera mañana, cada copia tiene todo.</p>`},

 {t:"opcion", p:"¿Qué significa que Git sea «distribuido»?",
  ops:["Que se instala en varios servidores",
       "Que cada copia del repositorio contiene el historial completo, no solo la última versión",
       "Que el código se reparte entre varias personas",
       "Que necesita internet siempre"],
  ok:1,
  why:"Por eso puedes trabajar offline: tienes todo el historial en tu disco."},

 {t:"vf", p:"Si GitHub sufre una caída, puedes seguir haciendo commits en tu repositorio local.",
  ok:true,
  why:"Sí. Solo necesitas GitHub para compartir (push/pull). Commits, ramas e historial son locales."}
]},

/* =============== G1 L3 =============== */
{
id:"g1l3",
titulo:"Las tres zonas de Git",
claves:["Directorio de trabajo: tus ficheros tal cual","Staging area: lo que has preparado para el próximo commit","Repositorio: el historial de commits guardado"],
pasos:[
 {t:"info", eti:"Lo más importante del curso", h:"Si entiendes esto, entiendes Git",
  c:`<p>Casi toda la confusión con Git viene de no entender que tus cambios pasan por <b>tres zonas</b> antes de quedar guardados. Vamos despacio.</p>
     <div class="dg"><div class="dg-tit">las tres zonas de git</div>
<svg viewBox="50 0 240 282" width="100%" style="max-width:320px;display:block;margin:auto" role="img" aria-label="Directorio de trabajo, con git add pasa al staging area, con git commit pasa al repositorio"><defs><marker id="fl-git1-0" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs><rect x="60" y="5" width="220" height="64" rx="8" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="170" y="24" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">Directorio de trabajo</text><text x="170" y="41" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">tus ficheros tal cual</text><text x="170" y="58" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">los editas</text><line x1="170" y1="73" x2="170" y2="105" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-git1-0)"/><text x="182" y="94" text-anchor="start" font-size="12" font-family="var(--mono)" fill="var(--accent)" font-weight="700">git add</text><rect x="60" y="109" width="220" height="64" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="170" y="128" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)" font-weight="700">Staging area</text><text x="170" y="145" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">(zona de preparación)</text><text x="170" y="162" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">lo que vas a guardar en el commit</text><line x1="170" y1="177" x2="170" y2="209" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-git1-0)"/><text x="182" y="198" text-anchor="start" font-size="12" font-family="var(--mono)" fill="var(--accent)" font-weight="700">git commit</text><rect x="60" y="213" width="220" height="64" rx="8" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="1.5"/><text x="170" y="232" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ok)" font-weight="700">Repositorio</text><text x="170" y="249" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">(.git / historial)</text><text x="170" y="266" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">commits guardados para siempre</text></svg></div>`},

 {t:"info", eti:"Zona 1", h:"El directorio de trabajo (working directory)",
  c:`<p>Son <b>tus ficheros</b>, los de la carpeta del proyecto, tal como los ves en tu editor. Aquí es donde programas.</p>
     <p>Cuando modificas un fichero, el cambio está <b>solo aquí</b>. Git sabe que ha cambiado, pero todavía no lo ha guardado en ningún sitio.</p>`},

 {t:"info", eti:"Zona 2", h:"El staging area (o «índice»)",
  c:`<p>Es una <b>zona de preparación</b>. Antes de guardar, eliges <b>qué cambios</b> van a entrar en el próximo commit, con el comando <code>git add</code>.</p>
     <p>¿Por qué existe? Porque a veces has tocado cinco ficheros pero solo tres tienen que ver con el arreglo que quieres guardar. El staging te permite hacer un commit <b>limpio y con sentido</b>, y dejar el resto para otro.</p>
     <div class="nota"><b class="tit">Analogía</b>Es como la zona de embalaje antes de enviar un paquete: metes en la caja solo lo que va en ese envío. El resto se queda en la mesa.</div>`},

 {t:"info", eti:"Zona 3", h:"El repositorio (el historial)",
  c:`<p>Cuando haces <code>git commit</code>, todo lo que había en el staging se guarda como una <b>foto permanente</b> en el historial. Eso vive en una carpeta oculta llamada <code>.git</code>, dentro de tu proyecto.</p>
     <p>A partir de ahí, ese estado queda guardado y puedes volver a él cuando quieras.</p>`},

 {t:"orden", p:"Ordena el recorrido de un cambio en Git",
  items:["Editas un fichero en tu directorio de trabajo","Lo pasas al staging con git add","Lo guardas en el historial con git commit"],
  why:"Editar → add → commit. Este ciclo lo vas a repetir cientos de veces al día."},

 {t:"par", p:"Empareja cada zona con su descripción",
  pares:[["Directorio de trabajo","Tus ficheros tal como los editas"],
         ["Staging area","Los cambios preparados para el próximo commit"],
         ["Repositorio","El historial de commits guardados"]],
  why:"Estas tres zonas explican casi todos los comandos de Git que vienen a continuación."},

 {t:"opcion", p:"Has modificado <code>App.java</code> pero todavía no has hecho nada más. ¿En qué zona está el cambio?",
  ops:["En el repositorio","En el staging area","Solo en el directorio de trabajo","En GitHub"],
  ok:2,
  why:"Solo en tu directorio de trabajo. Hasta que no hagas git add, no está preparado; hasta que no hagas commit, no está guardado."},

 {t:"opcion", p:"¿Para qué sirve el staging area?",
  ops:["Para subir el código a GitHub",
       "Para elegir exactamente qué cambios entran en el próximo commit, y así hacer commits limpios",
       "Para probar el código",
       "Para borrar ficheros"],
  ok:1,
  why:"Te permite agrupar cambios con sentido. Un commit = un cambio lógico."},

 {t:"vf", p:"<code>git commit</code> guarda todos los ficheros que has modificado, estén o no en el staging.",
  ok:false,
  why:"No. Solo guarda lo que está en el staging. Lo que no hayas añadido con git add se queda fuera del commit."}
]},

/* =============== G1 L4 =============== */
{
id:"g1l4",
titulo:"Qué es un commit por dentro",
claves:["Un commit es una foto completa del proyecto en un momento","Se identifica por un hash SHA único","Apunta a su commit padre: así se forma el historial"],
pasos:[
 {t:"info", eti:"El concepto", h:"Un commit es una foto, no una lista de cambios",
  c:`<p>Un <b>commit</b> es una <b>instantánea</b> (snapshot) del estado de todos los ficheros del proyecto en un momento dado.</p>
     <p>Cada commit guarda:</p>
     <ul><li>el <b>contenido</b> de los ficheros en ese momento,</li>
     <li>el <b>autor</b> (nombre y email) y la <b>fecha</b>,</li>
     <li>un <b>mensaje</b> que explica el cambio,</li>
     <li>una referencia a su <b>commit padre</b> (el anterior).</li></ul>
     <p>Git es muy eficiente: si un fichero no ha cambiado, no lo duplica, solo apunta a la versión que ya tenía.</p>`},

 {t:"info", eti:"El identificador", h:"El hash: la huella de cada commit",
  c:`<p>Cada commit tiene un identificador único: un <b>hash SHA</b> de 40 caracteres, calculado a partir de su contenido.</p>
     <div class="termbox">commit <b>9f3c1a2b7e4d8f6a0c5b3e1d9a7f2c4e6b8d0a1f</b>
Author: Pablo &lt;pablo@ejemplo.com&gt;
Date:   Mon Sep 21 10:14:02 2026

    Añade endpoint de tareas</div>
     <p>Normalmente basta con los <b>7 primeros caracteres</b> para referirse a él: <code>9f3c1a2</code>.</p>
     <p>Como el hash se calcula a partir del contenido (incluido el padre), <b>si alguien modifica un commit antiguo, cambia su hash y el de todos los que vienen después</b>. Por eso el historial de Git es tan fiable.</p>`},

 {t:"opcion", p:"¿Qué es el hash de un commit?",
  ops:["Una contraseña",
       "Un identificador único calculado a partir del contenido del commit",
       "El número de línea que cambió",
       "El nombre de la rama"],
  ok:1,
  why:"Es su huella digital. Dos commits distintos nunca tienen el mismo hash."},

 {t:"info", eti:"El historial", h:"Una cadena de commits",
  c:`<p>Como cada commit apunta a su padre, el historial es una <b>cadena</b>:</p>
     <div class="dg"><div class="dg-tit">una cadena de commits</div>
<svg viewBox="0 0 330 124" width="100%" style="max-width:460px;display:block;margin:auto" role="img" aria-label="Tres commits encadenados: 9f3c1a2 apunta a e4f5a6b y este a a1b2c3d"><defs><marker id="fl-git1-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs><line x1="146.0" y1="40.0" x2="76.0" y2="40.0" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-git1-1)"/><line x1="256.0" y1="40.0" x2="186.0" y2="40.0" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-git1-1)"/><circle cx="55" cy="40" r="19" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/><text x="55" y="78" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">a1b2c3d</text><text x="55" y="98" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">«Proyecto</text><text x="55" y="114" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">inicial»</text><circle cx="165" cy="40" r="19" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/><text x="165" y="78" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">e4f5a6b</text><text x="165" y="98" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">«Añade la</text><text x="165" y="114" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">entidad»</text><circle cx="275" cy="40" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="275" y="78" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">9f3c1a2</text><text x="275" y="98" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">«Añade endpoint</text><text x="275" y="114" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">de tareas»</text><text x="275" y="12" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)">el más reciente</text></svg></div>
     <p>Las flechas van hacia atrás: cada commit sabe quién es su padre, pero no quién vendrá después. Recorriendo esa cadena, Git reconstruye toda la historia.</p>`},

 {t:"vf", p:"Si modificas un commit antiguo, su hash se mantiene igual.",
  ok:false,
  why:"Cambia, y también cambian los de todos los commits posteriores. Por eso reescribir historia que otros ya tienen causa problemas: sus hashes dejan de coincidir con los tuyos."},

 {t:"info", eti:"HEAD", h:"¿Dónde estás ahora mismo?",
  c:`<p>Git tiene un puntero especial llamado <b>HEAD</b> que indica <b>en qué commit estás</b> en este momento. Normalmente apunta al último commit de la rama en la que trabajas.</p>
     <div class="dg"><div class="dg-tit">head: el commit en el que estás</div>
<svg viewBox="0 0 330 160" width="100%" style="max-width:460px;display:block;margin:auto" role="img" aria-label="HEAD apunta al último commit, 9f3c1a2"><defs><marker id="fl-git1-2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs><line x1="146.0" y1="30.0" x2="76.0" y2="30.0" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-git1-2)"/><line x1="256.0" y1="30.0" x2="186.0" y2="30.0" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-git1-2)"/><circle cx="55" cy="30" r="19" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/><text x="55" y="68" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">a1b2c3d</text><circle cx="165" cy="30" r="19" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/><text x="165" y="68" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">e4f5a6b</text><circle cx="275" cy="30" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="275" y="68" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink)" font-weight="700">9f3c1a2</text><rect x="252.5" y="107" width="45" height="22" rx="11" fill="var(--bg-3)" stroke="var(--ink-2)" stroke-width="1.5"/><text x="275" y="122" text-anchor="middle" font-size="12" font-family="var(--mono)" font-weight="700" fill="var(--ink)">HEAD</text><line x1="275" y1="105" x2="275" y2="76" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-git1-2)"/><text x="275" y="150" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)">(estás aquí)</text></svg></div>
     <p>Verás expresiones como <code>HEAD~1</code>, que significa "el commit anterior a HEAD", o <code>HEAD~3</code>, "tres commits atrás". Las usarás para deshacer cosas.</p>`},

 {t:"opcion", p:"¿Qué significa <code>HEAD~2</code>?",
  ops:["La rama número 2",
       "Dos commits antes del commit en el que estás",
       "El segundo fichero",
       "Dos ramas atrás"],
  ok:1,
  why:"HEAD es donde estás; ~2 retrocede dos commits por la cadena de padres."},

 {t:"par", p:"Empareja cada concepto con su significado",
  pares:[["Commit","Foto del proyecto en un momento dado"],
         ["Hash","Identificador único de un commit"],
         ["Padre","El commit inmediatamente anterior"],
         ["HEAD","Puntero al commit en el que estás ahora"]],
  why:"Con estos cuatro conceptos ya puedes leer cualquier historial de Git."}
]},

/* =============== G1 L5 =============== */
{
id:"g1l5",
titulo:"Instalar y configurar Git",
claves:["git --version comprueba la instalación","git config --global user.name y user.email son obligatorios","La rama por defecto se llama main"],
pasos:[
 {t:"info", eti:"Instalación", h:"Comprobar que lo tienes",
  c:`<p>En Windows, Git se instala desde <b>git-scm.com</b> (incluye «Git Bash», una terminal tipo Linux). En Mac viene con las herramientas de desarrollador, y en Linux con <code>sudo apt install git</code>.</p>
     <p>Para comprobar que está instalado:</p>
     <div class="termbox">git --version
<span class="cm">git version 2.46.0.windows.1</span></div>`},

 {t:"term", p:"Comprueba qué versión de Git tienes",
  prompt:"PS C:\\proyectos>",
  sol:["git --version","git version"],
  pista:"Como en Docker: el programa y dos guiones con la palabra version.",
  salida:`git version 2.46.0.windows.1`,
  why:"Si ves un número de versión, Git está instalado y listo."},

 {t:"info", eti:"Tu identidad", h:"Decirle a Git quién eres",
  c:`<p>Cada commit lleva tu nombre y tu email. Hay que configurarlos <b>una vez</b> en cada ordenador:</p>
     <div class="termbox">git config --global user.name "Pablo Ocampos"
git config --global user.email "pablo@ejemplo.com"</div>
     <ul><li><code>--global</code> significa "para todos los repositorios de este usuario". Sin él, solo se aplica al repositorio actual.</li>
     <li>Usa el <b>mismo email</b> que tu cuenta de GitHub: así GitHub asocia tus commits a tu perfil.</li></ul>`},

 {t:"escribe", p:"Escribe el comando que configura tu email como <code>pablo@ejemplo.com</code> para todos tus repositorios",
  sol:["git config --global user.email pablo@ejemplo.com","git config --global user.email \"pablo@ejemplo.com\""],
  ph:"git config ...",
  pista:"git config, el flag de ámbito global, la clave user.email y el valor.",
  why:"Si no configuras nombre y email, Git no te deja hacer commits (o te pone datos raros de tu máquina)."},

 {t:"info", eti:"La rama principal", h:"main, no master",
  c:`<p>Todo repositorio empieza con una rama principal. Históricamente se llamaba <code>master</code>; hoy el estándar (y lo que usa GitHub) es <code>main</code>.</p>
     <div class="termbox">git config --global init.defaultBranch main</div>
     <p>Así, cada repositorio nuevo que crees empezará con <code>main</code>. Si trabajas en un proyecto antiguo, puede que veas <code>master</code>: es lo mismo con otro nombre.</p>`},

 {t:"opcion", p:"¿Qué hace el flag <code>--global</code> en <code>git config</code>?",
  ops:["Sube la configuración a GitHub",
       "Aplica la configuración a todos los repositorios de tu usuario en ese ordenador",
       "La aplica a todos los usuarios del mundo",
       "La borra"],
  ok:1,
  why:"Sin --global, la configuración solo afecta al repositorio en el que estás. Útil si usas un email distinto para el trabajo."},

 {t:"info", eti:"Revisar", h:"Ver tu configuración",
  c:`<div class="termbox">git config --list           <span class="cm"># toda la configuracion</span>
git config user.name        <span class="cm"># un valor concreto</span></div>
     <p>Otra opción útil: el editor que abre Git cuando necesita que escribas algo largo (por ejemplo, un mensaje de commit sin <code>-m</code>):</p>
     <div class="termbox">git config --global core.editor "code --wait"   <span class="cm"># VS Code</span></div>`},

 {t:"vf", p:"El email que configuras en Git debería coincidir con el de tu cuenta de GitHub.",
  ok:true,
  why:"Así GitHub enlaza tus commits a tu perfil y cuentan en tu gráfico de contribuciones."},

 {t:"escribe", p:"Escribe el comando que hace que los repositorios nuevos empiecen con la rama <code>main</code>",
  sol:["git config --global init.defaultbranch main"],
  ph:"git config ...",
  pista:"La clave es init.defaultBranch.",
  why:"<code>git config --global init.defaultBranch main</code>. Una vez y te olvidas."}
]}

]});
