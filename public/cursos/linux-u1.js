window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Qué es Linux",
resumen: "Kernel, distribuciones, la terminal y cómo practicar sin miedo",
nivel: "Fundamentos",
color: "#f5b642",
lecciones: [

{
id:"lx1l1",
titulo:"Linux, el sistema de los servidores",
claves:["Linux es un sistema operativo libre basado en el kernel Linux","Mueve la inmensa mayoría de servidores, la nube, los contenedores y Android","Saber Linux es requisito en backend, DevOps y cloud"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Por qué aprender Linux?",
  c:`<p>Un <b>sistema operativo</b> es el programa que gestiona el ordenador: reparte la memoria y el procesador entre los programas, habla con el disco y la red, y te deja usar todo eso. Windows y macOS son sistemas operativos. <b>Linux</b> también.</p>
     <p>La diferencia es <b>dónde</b> se usa:</p>
     <ul><li>Más del <b>90% de los servidores</b> de internet funcionan con Linux.</li>
     <li>Toda la <b>nube</b> (AWS, Google Cloud, Azure) funciona mayoritariamente sobre Linux.</li>
     <li>Los <b>contenedores Docker</b> son procesos de Linux.</li>
     <li><b>Android</b> lleva el kernel de Linux por dentro.</li></ul>
     <p>Si vas a trabajar en backend, DevOps o cloud, vas a pasar horas conectado a máquinas Linux. No es opcional.</p>`},
 {t:"opcion", p:"¿Por qué Linux es imprescindible para un perfil backend o DevOps?",
  ops:["Porque es más bonito que Windows","Porque la mayoría de servidores, la nube y los contenedores funcionan sobre Linux","Porque es el único sistema gratuito","Porque es obligatorio para programar en Java"],
  ok:1, why:"Es el entorno donde se ejecuta casi todo el software de servidor. Da igual el lenguaje que uses: acabará corriendo en Linux."},
 {t:"info", eti:"Un poco de historia", h:"De dónde sale",
  c:`<p>En 1991, un estudiante finlandés llamado <b>Linus Torvalds</b> publicó un núcleo de sistema operativo como proyecto personal. Lo compartió con licencia libre y miles de personas empezaron a mejorarlo.</p>
     <p>Linux se inspira en <b>UNIX</b>, un sistema de los años 70 cuya filosofía sigue vigente:</p>
     <ul><li>Programas pequeños que hacen <b>una sola cosa y la hacen bien</b>.</li>
     <li>Programas que se pueden <b>combinar</b> entre sí, pasando la salida de uno a otro.</li>
     <li><b>Todo es un fichero</b>: hasta los discos y los dispositivos se manejan como ficheros.</li></ul>
     <p>Verás esta filosofía en cada lección de este curso.</p>`},
 {t:"par", p:"Empareja cada idea de la filosofía UNIX con su significado",
  pares:[["Hacer una cosa bien","Cada programa tiene un propósito concreto"],
         ["Combinar programas","La salida de uno se usa como entrada de otro"],
         ["Todo es un fichero","Discos, dispositivos y configuración se tratan como ficheros"]],
  why:"Estas tres ideas explican por qué en Linux encadenas comandos pequeños en lugar de usar un programa gigante."},
 {t:"vf", p:"Linux es software libre: su código se puede ver, modificar y redistribuir.",
  ok:true, why:"Sí, bajo la licencia GPL. Por eso lo mejoran empresas y personas de todo el mundo, y por eso hay tantas versiones distintas."},
 {t:"opcion", p:"¿Quién creó el núcleo de Linux?",
  ops:["Bill Gates","Linus Torvalds","Steve Jobs","Richard Stallman"],
  ok:1, why:"Linus Torvalds, en 1991. También creó Git, en 2005, para gestionar el propio código de Linux."}
]},

{
id:"lx1l2",
titulo:"Kernel y distribución",
claves:["El kernel gestiona hardware, memoria y procesos","Una distribución = kernel + herramientas + gestor de paquetes","Familias principales: Debian/Ubuntu y Red Hat/Fedora; Alpine en contenedores"],
pasos:[
 {t:"info", eti:"Dos piezas", h:"Linux, en sentido estricto, es solo el kernel",
  c:`<p>El <b>kernel</b> (núcleo) es la parte central del sistema. Es el único programa que habla directamente con el hardware y decide:</p>
     <ul><li>qué proceso usa el procesador en cada momento,</li>
     <li>cuánta memoria recibe cada programa,</li>
     <li>cómo se lee y escribe en el disco,</li>
     <li>cómo entran y salen los datos por la red.</li></ul>
     <p>Pero un kernel solo no sirve para trabajar: no tiene terminal, ni comandos, ni instalador de programas. Para eso existen las distribuciones.</p>`},
 {t:"info", eti:"Distribución", h:"El kernel más todo lo demás",
  c:`<p>Una <b>distribución</b> (o «distro») empaqueta el kernel con todo lo necesario para usarlo:</p>
     <ul><li>las herramientas básicas (<code>ls</code>, <code>cp</code>, la shell...),</li>
     <li>un <b>gestor de paquetes</b> para instalar programas,</li>
     <li>un sistema de arranque y servicios,</li>
     <li>y a veces un escritorio gráfico.</li></ul>
     <div class="diag">+------------------------------------+
|  tus programas (nginx, java, ...)  |
+------------------------------------+
|  herramientas y gestor de paquetes |  <- lo que aporta la distribucion
+------------------------------------+
|             KERNEL LINUX           |  <- el nucleo
+------------------------------------+
|              HARDWARE              |
+------------------------------------+</div>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["Kernel","Gestiona procesos, memoria, disco y red"],
         ["Distribución","Kernel más herramientas, paquetes y configuración"],
         ["Gestor de paquetes","Instala y actualiza programas"]],
  why:"Cuando alguien dice «uso Linux», casi siempre se refiere a una distribución concreta, como Ubuntu."},
 {t:"info", eti:"Las familias", h:"Las distribuciones que te vas a encontrar",
  c:`<div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:14px">
     <tr><th style="text-align:left;padding:6px">Familia</th><th style="text-align:left;padding:6px">Ejemplos</th><th style="text-align:left;padding:6px">Paquetes</th><th style="text-align:left;padding:6px">Dónde la verás</th></tr>
     <tr><td style="padding:6px"><b>Debian</b></td><td style="padding:6px">Debian, Ubuntu</td><td style="padding:6px"><code>apt</code> (.deb)</td><td style="padding:6px">Servidores, nube, escritorio</td></tr>
     <tr><td style="padding:6px"><b>Red Hat</b></td><td style="padding:6px">RHEL, Fedora, Rocky, AlmaLinux, Amazon Linux</td><td style="padding:6px"><code>dnf</code> (.rpm)</td><td style="padding:6px">Empresas grandes, banca</td></tr>
     <tr><td style="padding:6px"><b>Alpine</b></td><td style="padding:6px">Alpine Linux</td><td style="padding:6px"><code>apk</code></td><td style="padding:6px">Imágenes Docker (5 MB)</td></tr>
     <tr><td style="padding:6px"><b>Arch</b></td><td style="padding:6px">Arch, Manjaro</td><td style="padding:6px"><code>pacman</code></td><td style="padding:6px">Usuarios avanzados</td></tr></table></div>
     <p>Lo que aprendas en una se aplica en las demás: cambian sobre todo el gestor de paquetes y algunas rutas de configuración.</p>`},
 {t:"opcion", p:"Entras en un servidor y el comando para instalar programas es <code>dnf</code>. ¿De qué familia es?",
  ops:["Debian","Red Hat","Alpine","Arch"],
  ok:1, why:"dnf (antes yum) es el gestor de la familia Red Hat: RHEL, Fedora, Rocky, Amazon Linux."},
 {t:"opcion", p:"¿Qué distribución suele usarse como base de imágenes Docker muy pequeñas?",
  ops:["Ubuntu Desktop","Alpine","Fedora Workstation","Windows Server"],
  ok:1, why:"Alpine ocupa unos 5 MB. Por eso ves tantas imágenes con la etiqueta -alpine."},
 {t:"vf", p:"Un programa compilado para Linux funciona igual en Ubuntu y en Fedora porque comparten el mismo tipo de kernel.",
  ok:true, why:"Mayoritariamente sí: el kernel y la interfaz de llamadas al sistema son los mismos. Lo que cambia es cómo se instala (apt contra dnf) y las versiones de las librerías."},
 {t:"escribe", p:"¿Qué fichero contiene el nombre y la versión de la distribución? Escribe su ruta completa",
  sol:["/etc/os-release"], ph:"/etc/...",
  pista:"Está en la carpeta de configuración y se llama «os-release».",
  why:"/etc/os-release. Lo verás en la terminal con cat /etc/os-release."}
]},

{
id:"lx1l3",
titulo:"La terminal y la shell",
claves:["La terminal es la ventana; la shell es el programa que interpreta los comandos","bash es la shell más común; zsh y sh también existen","En servidores no hay escritorio: todo se hace por terminal"],
pasos:[
 {t:"info", eti:"Sin ratón", h:"Por qué en servidores todo es texto",
  c:`<p>Un servidor no tiene pantalla ni ratón: está en un centro de datos y te conectas a él por red. Además, un escritorio gráfico gasta memoria y procesador que el servidor necesita para su trabajo.</p>
     <p>Por eso, en servidores, <b>todo se hace escribiendo comandos</b>. Y tiene ventajas enormes: los comandos se pueden guardar, repetir, automatizar en scripts y ejecutar en cien máquinas a la vez.</p>`},
 {t:"info", eti:"Dos palabras distintas", h:"Terminal y shell",
  c:`<ul><li>La <b>terminal</b> (o emulador de terminal) es la <b>ventana</b> donde escribes y ves texto: Windows Terminal, GNOME Terminal, iTerm2...</li>
     <li>La <b>shell</b> es el <b>programa</b> que corre dentro de esa ventana, lee lo que escribes, lo interpreta y ejecuta los comandos.</li></ul>
     <p>Las shells más habituales:</p>
     <ul><li><b>bash</b>: la estándar en casi todos los servidores. Es la que aprenderás.</li>
     <li><b>sh</b>: la más básica y compatible (en Alpine es la única que hay).</li>
     <li><b>zsh</b>: popular en macOS, con muchas comodidades.</li></ul>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Terminal","La ventana donde escribes y lees"],
         ["Shell","El programa que interpreta los comandos"],
         ["bash","La shell más usada en servidores Linux"],
         ["sh","La shell mínima y más compatible"]],
  why:"Se usan como sinónimos en la conversación, pero en una entrevista conviene distinguirlas."},
 {t:"info", eti:"El prompt", h:"Lo que ves antes del cursor",
  c:`<div class="termbox">pablo@servidor:~$
<span class="cm">^     ^        ^^</span>
<span class="cm">|     |        |+- $ usuario normal (# si eres root)</span>
<span class="cm">|     |        +-- carpeta actual (~ es tu carpeta personal)</span>
<span class="cm">|     +----------- nombre de la maquina</span>
<span class="cm">+----------------- tu usuario</span></div>
     <p>El <b>prompt</b> te dice quién eres, en qué máquina estás y en qué carpeta. Mirarlo antes de ejecutar algo peligroso te salvará más de una vez: no es lo mismo borrar algo en tu portátil que en el servidor de producción.</p>`},
 {t:"opcion", p:"El prompt termina en <code>#</code> en lugar de <code>$</code>. ¿Qué significa?",
  ops:["Que hay un error","Que eres el usuario root, el administrador","Que estás en un contenedor","Que la terminal está en modo comentario"],
  ok:1, why:"# indica root. Cuidado: cualquier comando se ejecuta con permisos totales."},
 {t:"info", eti:"Anatomía de un comando", h:"comando, opciones y argumentos",
  c:`<div class="termbox">ls <span class="hi">-l -a</span> <b>/etc</b>
<span class="cm">^   ^       ^</span>
<span class="cm">|   |       +-- argumento: sobre QUE actua</span>
<span class="cm">|   +---------- opciones (flags): COMO actua</span>
<span class="cm">+-------------- comando: QUE hace</span></div>
     <ul><li>Las opciones cortas llevan un guion y se pueden juntar: <code>-l -a</code> = <code>-la</code>.</li>
     <li>Las opciones largas llevan dos guiones: <code>--all</code>.</li>
     <li>Linux <b>distingue mayúsculas y minúsculas</b>: <code>-a</code> y <code>-A</code> son opciones distintas, y <code>Fichero.txt</code> y <code>fichero.txt</code> son dos ficheros diferentes.</li></ul>`},
 {t:"vf", p:"En Linux, <code>Informe.txt</code> e <code>informe.txt</code> son el mismo fichero.",
  ok:false, why:"Linux distingue mayúsculas y minúsculas en todo: nombres de fichero, comandos y opciones. Error típico al venir de Windows."},
 {t:"hueco", p:"Completa: listar en formato largo e incluyendo ocultos la carpeta /etc",
  tpl:"ls ___ /etc", banco:["-la","--la","la","/la"], sol:["-la"],
  why:"-la junta las opciones -l (formato largo) y -a (todos, incluidos los ocultos)."}
]},

{
id:"lx1l4",
titulo:"Dónde practicar sin romper nada",
claves:["WSL en Windows, un contenedor Docker o una máquina virtual","Un contenedor con --rm es desechable: si rompes algo, lo borras","Nunca practiques comandos destructivos en una máquina que importa"],
pasos:[
 {t:"info", eti:"Laboratorio", h:"Tres formas de tener Linux a mano",
  c:`<ul><li><b>WSL 2</b> (Windows Subsystem for Linux): un Linux real dentro de Windows. En tu máquina ya tienes Ubuntu 22.04 instalado. Se abre escribiendo <code>wsl</code> en PowerShell.</li>
     <li><b>Un contenedor Docker</b>: <code>docker run -it --rm ubuntu:22.04 bash</code>. Arranca en un segundo, y al salir desaparece sin dejar rastro.</li>
     <li><b>Una máquina virtual</b> (VirtualBox, Hyper-V) o un servidor barato en la nube.</li></ul>
     <p>Para este curso, lo más cómodo es el contenedor: puedes romper lo que quieras y empezar de cero al instante.</p>`},
 {t:"term", p:"Abre un Ubuntu desechable dentro de un contenedor",
  prompt:"PS C:\\>", sol:["docker run -it --rm ubuntu:22.04 bash","docker run --rm -it ubuntu:22.04 bash","docker run -it --rm ubuntu bash"],
  pista:"docker run, interactivo, que se borre al salir, la imagen ubuntu:22.04 y la shell bash.",
  salida:`root@4f2a9c1b7e45:/#`,
  why:"Ya estás dentro de un Linux. Todo lo que hagas aquí desaparece al escribir exit."},
 {t:"opcion", p:"¿Por qué un contenedor con <code>--rm</code> es ideal para practicar?",
  ops:["Porque es más rápido que Linux real","Porque es desechable: al salir se borra y puedes empezar de cero","Porque no tiene permisos de root","Porque no necesita internet"],
  ok:1, why:"Si ejecutas algo destructivo por error, no pasa nada: sales y creas otro limpio."},
 {t:"info", eti:"Regla de oro", h:"Dónde NO practicar",
  c:`<p>Nunca pruebes comandos que no entiendes en:</p>
     <ul><li>un servidor de producción,</li>
     <li>tu propio usuario de Windows montado dentro de WSL (<code>/mnt/c/...</code>),</li>
     <li>cualquier máquina con datos que te importen.</li></ul>
     <div class="nota ojo"><b class="tit">El comando más famoso</b><code>rm -rf /</code> borra el sistema entero. Las distribuciones modernas lo bloquean por defecto, pero variantes como <code>rm -rf /*</code> no. Nunca copies comandos de internet sin entender qué hacen.</div>`},
 {t:"vf", p:"Desde WSL, la carpeta <code>/mnt/c</code> es tu disco C: de Windows, y borrar ahí borra tus ficheros de verdad.",
  ok:true, why:"WSL monta tus discos de Windows en /mnt. Es cómodo, pero un rm ahí es real."},
 {t:"info", eti:"Ayuda integrada", h:"man y --help",
  c:`<p>No hace falta memorizar todas las opciones. Linux trae su propio manual:</p>
     <div class="termbox">man ls          <span class="cm"># manual completo (q para salir, / para buscar)</span>
ls --help       <span class="cm"># resumen rapido de opciones</span>
man -k copiar   <span class="cm"># buscar comandos por palabra clave (en ingles: man -k copy)</span></div>
     <p>En contenedores mínimos a veces no está instalado <code>man</code>; <code>--help</code> casi siempre funciona.</p>`},
 {t:"escribe", p:"Escribe el comando que abre el manual del comando <code>cp</code>",
  sol:["man cp"], ph:"man ...",
  pista:"man seguido del comando.", why:"man cp. Se sale pulsando q."}
]},

{
id:"lx1l5",
titulo:"Trucos que te ahorran horas",
claves:["Tab autocompleta comandos y rutas","Flecha arriba y Ctrl+R recuperan comandos anteriores","Ctrl+C cancela, Ctrl+D cierra, Ctrl+L limpia"],
pasos:[
 {t:"info", eti:"Productividad", h:"Tabulador: autocompletar",
  c:`<p>La tecla <b>Tab</b> es tu mejor amiga en la terminal:</p>
     <ul><li>Escribe <code>cd /et</code> y pulsa Tab: se completa a <code>cd /etc/</code>.</li>
     <li>Si hay varias opciones, pulsa Tab <b>dos veces</b> y verás la lista.</li>
     <li>Funciona con comandos, rutas y, a menudo, con opciones.</li></ul>
     <p>Además de ir más rápido, evita errores de escritura: si Tab no completa, es que eso no existe.</p>`},
 {t:"info", eti:"El historial", h:"Recuperar lo que ya escribiste",
  c:`<div class="termbox">Flecha arriba     <span class="cm"># comando anterior (y el anterior, y el anterior...)</span>
Ctrl + R          <span class="cm"># buscar hacia atras en el historial: escribe un trozo</span>
history           <span class="cm"># lista numerada de comandos</span>
!42               <span class="cm"># repetir el comando numero 42</span>
!!                <span class="cm"># repetir el ultimo comando</span>
sudo !!           <span class="cm"># repetir el ultimo comando con sudo (clasico)</span></div>`},
 {t:"par", p:"Empareja cada atajo con lo que hace",
  pares:[["Tab","Autocompletar"],["Ctrl + R","Buscar en el historial"],["Ctrl + C","Cancelar el comando en curso"],["Ctrl + L","Limpiar la pantalla"],["Ctrl + D","Cerrar la sesión (fin de entrada)"]],
  why:"Con estos cinco ya te mueves como alguien con experiencia."},
 {t:"opcion", p:"Has lanzado un comando que no termina nunca. ¿Cómo lo paras?",
  ops:["Ctrl + Z","Ctrl + C","Cerrar la ventana","Escribir exit"],
  ok:1, why:"Ctrl+C manda la señal de interrupción (SIGINT) al programa. Ctrl+Z lo pausa, que no es lo mismo: lo veremos en la unidad de procesos."},
 {t:"info", eti:"Editar la línea", h:"Moverse rápido por lo que escribes",
  c:`<div class="termbox">Ctrl + A   <span class="cm"># ir al principio de la linea</span>
Ctrl + E   <span class="cm"># ir al final</span>
Ctrl + U   <span class="cm"># borrar desde el cursor hasta el principio</span>
Ctrl + W   <span class="cm"># borrar la palabra anterior</span>
Alt + .    <span class="cm"># pegar el ultimo argumento del comando anterior</span></div>
     <p><code>Alt + .</code> es oro: después de <code>mkdir /opt/mi-app</code>, escribes <code>cd </code> y pulsas Alt + . para pegar la ruta.</p>`},
 {t:"escribe", p:"Escribe el atajo del historial para repetir el último comando anteponiéndole <code>sudo</code>",
  sol:["sudo !!"], ph:"sudo ...",
  pista:"Dos signos de exclamación significan «el último comando».",
  why:"sudo !!. Para ese momento en que te das cuenta de que necesitabas permisos."},
 {t:"vf", p:"Si Tab no autocompleta una ruta, lo más probable es que esa ruta no exista o esté mal escrita.",
  ok:true, why:"Por eso Tab también sirve para comprobar rutas mientras escribes."}
]}

]});
