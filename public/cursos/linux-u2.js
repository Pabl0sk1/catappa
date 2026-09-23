window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Moverse por el sistema",
resumen: "El árbol de directorios, rutas absolutas y relativas, pwd, ls y cd",
nivel: "Fundamentos",
color: "#f5b642",
lecciones: [

{
id:"lx2l1",
titulo:"El árbol de directorios",
claves:["Todo cuelga de la raíz /","Cada directorio del estándar FHS tiene un propósito","/etc configuración, /var datos variables, /home usuarios, /tmp temporales"],
pasos:[
 {t:"info", eti:"Un solo árbol", h:"No hay C: ni D:",
  c:`<p>En Linux hay <b>un único árbol</b> de directorios que empieza en la <b>raíz</b>, escrita como una barra: <code>/</code>. Todos los discos, memorias USB y carpetas de red se «enganchan» en algún punto de ese árbol (se dice que se <b>montan</b>).</p>
     <p>La organización sigue un estándar, el <b>FHS</b> (Filesystem Hierarchy Standard), así que un Ubuntu y un Red Hat se parecen mucho por dentro.</p>`},
 {t:"info", eti:"El mapa", h:"Los directorios que importan",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">/</span></div><div class="rama" style="--n:1"><span class="nom">bin, usr/bin</span><span class="coment">programas (ls, cp, bash...)</span></div><div class="rama" style="--n:1"><span class="nom">sbin</span><span class="coment">programas de administracion</span></div><div class="rama" style="--n:1"><span class="nom">etc</span><span class="coment">CONFIGURACION del sistema y los servicios</span></div><div class="rama" style="--n:1"><span class="nom">home</span><span class="coment">carpetas personales: /home/pablo</span></div><div class="rama" style="--n:1"><span class="nom">root</span><span class="coment">carpeta personal del usuario root</span></div><div class="rama" style="--n:1"><span class="nom">var</span><span class="coment">datos que cambian: logs (/var/log), bases de datos (/var/lib)</span></div><div class="rama" style="--n:1"><span class="nom">tmp</span><span class="coment">temporales (se borran al reiniciar)</span></div><div class="rama" style="--n:1"><span class="nom">opt</span><span class="coment">software instalado a mano</span></div><div class="rama" style="--n:1"><span class="nom">srv</span><span class="coment">datos que sirve el servidor (webs, ficheros)</span></div><div class="rama" style="--n:1"><span class="nom">dev</span><span class="coment">dispositivos (discos: /dev/sda)</span></div><div class="rama" style="--n:1"><span class="nom">proc, sys</span><span class="coment">ventanas al kernel (no son ficheros reales)</span></div><div class="rama" style="--n:1"><span class="nom">mnt, media</span><span class="coment">puntos de montaje de discos</span></div><div class="rama" style="--n:1"><span class="nom">boot</span><span class="coment">el kernel y el arranque</span></div></div>`},
 {t:"par", p:"Empareja cada directorio con lo que contiene",
  pares:[["/etc","Configuración del sistema y de los servicios"],["/var/log","Los ficheros de log"],["/home","Las carpetas personales de los usuarios"],["/tmp","Ficheros temporales"],["/dev","Los dispositivos, como los discos"]],
  why:"Estos cinco los usarás a diario. Saber dónde buscar es media solución de cualquier problema."},
 {t:"opcion", p:"Nginx no arranca y quieres revisar su configuración. ¿Dónde miras primero?",
  ops:["/home/nginx","/etc/nginx","/tmp/nginx","/dev/nginx"],
  ok:1, why:"La configuración de casi todos los servicios vive en /etc/nombre-del-servicio."},
 {t:"opcion", p:"¿Dónde buscarías los logs del sistema y de los servicios?",
  ops:["/etc/log","/var/log","/log","/usr/log"],
  ok:1, why:"/var/log. Var de «variable»: cosas que crecen y cambian mientras el sistema funciona."},
 {t:"info", eti:"Curiosidad útil", h:"/proc: el kernel hecho ficheros",
  c:`<p><code>/proc</code> no existe en el disco: es una ventana que el kernel te abre con información en vivo, presentada como ficheros (la filosofía «todo es un fichero»).</p>
     <div class="termbox">cat /proc/cpuinfo      <span class="cm"># tu procesador</span>
cat /proc/meminfo      <span class="cm"># tu memoria</span>
cat /proc/1/cmdline    <span class="cm"># con que comando se arranco el proceso 1</span>
cat /proc/uptime       <span class="cm"># segundos desde el arranque</span></div>`},
 {t:"vf", p:"Los ficheros de <code>/proc</code> ocupan espacio en el disco duro.",
  ok:false, why:"Son virtuales: el kernel los genera al leerlos. Por eso ls -l muestra tamaño 0 en muchos de ellos."}
]},

{
id:"lx2l2",
titulo:"Dónde estás: pwd y ls",
claves:["pwd muestra el directorio actual","ls lista; -l detalle, -a ocultos, -h tamaños legibles, -t por fecha","Los ficheros que empiezan por punto están ocultos"],
pasos:[
 {t:"info", eti:"Orientarse", h:"pwd: ¿dónde estoy?",
  c:`<p>La shell siempre está «situada» en un directorio, el <b>directorio de trabajo</b>. Para saber cuál es:</p>
     <div class="termbox">pwd
<span class="cm">/home/pablo</span></div>
     <p><code>pwd</code> significa <i>print working directory</i>. Úsalo siempre que dudes, y siempre antes de un comando que borre cosas.</p>`},
 {t:"term", p:"Muestra en qué directorio estás", prompt:"pablo@servidor:~$",
  sol:["pwd"], pista:"Tres letras: print working directory.",
  salida:`/home/pablo`, why:"Tu carpeta personal. En el prompt se abrevia como ~."},
 {t:"info", eti:"Listar", h:"ls y sus opciones clave",
  c:`<div class="termbox">ls              <span class="cm"># nombres</span>
ls -l           <span class="cm"># formato largo: permisos, dueno, tamano, fecha</span>
ls -a           <span class="cm"># incluye ocultos (los que empiezan por punto)</span>
ls -h           <span class="cm"># tamanos legibles (4.0K, 12M) — junto a -l</span>
ls -t           <span class="cm"># ordenado por fecha, lo mas reciente primero</span>
ls -r           <span class="cm"># orden inverso</span>
ls -R           <span class="cm"># recursivo: tambien el contenido de subcarpetas</span>
ls -lah /var/log   <span class="cm"># la combinacion mas usada</span></div>`},
 {t:"info", eti:"Leer ls -l", h:"Cada columna tiene un significado",
  c:`<div class="termbox">-rw-r--r-- 1 pablo devs 4.2K sep 21 10:14 informe.txt
<span class="cm">^          ^ ^     ^    ^    ^            ^</span>
<span class="cm">|          | |     |    |    |            nombre</span>
<span class="cm">|          | |     |    |    fecha de ultima modificacion</span>
<span class="cm">|          | |     |    tamano</span>
<span class="cm">|          | |     grupo</span>
<span class="cm">|          | dueno</span>
<span class="cm">|          numero de enlaces</span>
<span class="cm">tipo y permisos: - fichero, d directorio, l enlace simbolico</span></div>`},
 {t:"term", p:"Lista el contenido de <code>/var/log</code> en formato largo, con ocultos y tamaños legibles",
  prompt:"pablo@servidor:~$", sol:["ls -lah /var/log","ls -alh /var/log","ls -la -h /var/log","ls -l -a -h /var/log","ls -hal /var/log"],
  pista:"ls con las tres letras l, a y h juntas, y la ruta.",
  salida:`total 1.2M
drwxr-xr-x  8 root   syslog 4.0K sep 21 00:00 .
drwxr-xr-x 13 root   root   4.0K ago  2 09:12 ..
-rw-r-----  1 syslog adm     88K sep 21 10:14 auth.log
drwxr-x---  2 root   adm    4.0K sep 21 00:00 nginx
-rw-r-----  1 syslog adm    512K sep 21 10:15 syslog`,
  why:"Fíjate en . (el propio directorio) y .. (el de arriba): son entradas especiales que existen en cada directorio."},
 {t:"par", p:"Empareja cada opción de ls con su efecto",
  pares:[["-l","Formato largo con detalles"],["-a","Mostrar también los ocultos"],["-h","Tamaños legibles (K, M, G)"],["-t","Ordenar por fecha"],["-R","Recorrer subcarpetas"]],
  why:"-lah y -lt son las combinaciones que más vas a teclear."},
 {t:"vf", p:"En Linux, un fichero oculto es aquel cuyo nombre empieza por un punto, como <code>.bashrc</code> o <code>.env</code>.",
  ok:true, why:"No hay un atributo «oculto» como en Windows: es solo una convención del nombre. ls -a los muestra."}
]},

{
id:"lx2l3",
titulo:"Rutas absolutas y relativas",
claves:["Absoluta: empieza en / y funciona desde cualquier sitio","Relativa: parte del directorio actual","~ es tu carpeta personal, . el actual y .. el padre"],
pasos:[
 {t:"info", eti:"Dos formas de señalar", h:"Absoluta contra relativa",
  c:`<ul><li>Una ruta <b>absoluta</b> empieza por <code>/</code> y describe el camino completo desde la raíz: <code>/home/pablo/proyectos/api</code>. Funciona <b>desde cualquier sitio</b>.</li>
     <li>Una ruta <b>relativa</b> no empieza por <code>/</code> y se interpreta <b>desde donde estás</b>: si estás en <code>/home/pablo</code>, <code>proyectos/api</code> es lo mismo que la absoluta anterior.</li></ul>
     <p>En scripts y en configuración se prefieren las absolutas: no dependen de desde dónde se ejecute algo.</p>`},
 {t:"info", eti:"Atajos", h:"Los símbolos especiales",
  c:`<div class="termbox">~        <span class="cm"># tu carpeta personal (/home/pablo)</span>
~maria   <span class="cm"># la carpeta personal de maria</span>
.        <span class="cm"># el directorio actual</span>
..       <span class="cm"># el directorio padre (uno arriba)</span>
../..    <span class="cm"># dos niveles arriba</span>
-        <span class="cm"># (en cd) el directorio donde estabas antes</span></div>`},
 {t:"par", p:"Empareja cada símbolo con lo que representa",
  pares:[["~","Tu carpeta personal"],[".","El directorio actual"],["..","El directorio padre"],["/","La raíz del sistema"]],
  why:"Estos cuatro símbolos aparecen en casi todos los comandos que escribas."},
 {t:"opcion", p:"Estás en <code>/var/log/nginx</code>. ¿A qué ruta absoluta equivale <code>../../lib</code>?",
  ops:["/var/log/lib","/var/lib","/lib","/var/log/nginx/lib"],
  ok:1, why:"Primer .. sube a /var/log, el segundo a /var, y luego entras en lib: /var/lib."},
 {t:"opcion", p:"¿Por qué en un script se prefieren las rutas absolutas?",
  ops:["Porque son más cortas","Porque funcionan igual sin importar desde qué directorio se ejecute el script","Porque las relativas no existen en bash","Porque son más rápidas"],
  ok:1, why:"Un script con rutas relativas se rompe si alguien lo lanza desde otra carpeta, por ejemplo desde cron."},
 {t:"vf", p:"<code>~/proyectos</code> es una ruta absoluta disfrazada: la shell la convierte en <code>/home/tuusuario/proyectos</code>.",
  ok:true, why:"La shell expande ~ antes de ejecutar el comando. Por eso funciona desde cualquier sitio."},
 {t:"escribe", p:"Estás en <code>/home/pablo/proyectos/api</code>. Escribe la ruta relativa para llegar a <code>/home/pablo</code>",
  sol:["../..","../../"], ph:"...",
  pista:"Tienes que subir dos niveles.", why:"../.. sube dos niveles: de api a proyectos, y de proyectos a pablo."}
]},

{
id:"lx2l4",
titulo:"Cambiar de directorio con cd",
claves:["cd ruta te mueve","cd sin nada te lleva a casa; cd - vuelve al anterior","pushd y popd guardan una pila de directorios"],
pasos:[
 {t:"info", eti:"Moverse", h:"cd: change directory",
  c:`<div class="termbox">cd /etc/nginx     <span class="cm"># ruta absoluta</span>
cd sites-enabled  <span class="cm"># relativa, desde donde estas</span>
cd ..             <span class="cm"># subir un nivel</span>
cd                <span class="cm"># sin argumentos: a tu carpeta personal</span>
cd ~              <span class="cm"># lo mismo</span>
cd -              <span class="cm"># volver al directorio anterior (como el boton atras)</span></div>`},
 {t:"term", p:"Muévete a <code>/etc/nginx</code>", prompt:"pablo@servidor:~$",
  sol:["cd /etc/nginx","cd /etc/nginx/"], pista:"cd y la ruta absoluta.",
  salida:``, why:"No imprime nada si ha ido bien: fíjate en que el prompt cambiaría a pablo@servidor:/etc/nginx$."},
 {t:"term", p:"Vuelve al directorio donde estabas antes, sin escribir su ruta", prompt:"pablo@servidor:/etc/nginx$",
  sol:["cd -"], pista:"cd seguido de un guion.",
  salida:`/home/pablo`, why:"cd - imprime a dónde te lleva. Alternar entre dos carpetas con cd - es comodísimo."},
 {t:"opcion", p:"Escribes <code>cd</code> sin nada más. ¿Dónde acabas?",
  ops:["En la raíz /","En tu carpeta personal","En el directorio anterior","Da error"],
  ok:1, why:"cd a secas es un atajo a ~."},
 {t:"info", eti:"Nivel pro", h:"pushd y popd",
  c:`<p>Cuando saltas entre varios sitios, <code>pushd</code> guarda el directorio actual en una pila y te lleva a otro; <code>popd</code> te devuelve:</p>
     <div class="termbox">pushd /var/log/nginx   <span class="cm"># guarda donde estabas y va a /var/log/nginx</span>
pushd /etc/nginx       <span class="cm"># guarda /var/log/nginx y va a /etc/nginx</span>
popd                   <span class="cm"># vuelve a /var/log/nginx</span>
popd                   <span class="cm"># vuelve al principio</span>
dirs -v                <span class="cm"># ver la pila</span></div>
     <p>Muy útil en scripts que necesitan entrar en una carpeta y volver después.</p>`},
 {t:"vf", p:"<code>cd</code> es un programa externo como <code>ls</code>.",
  ok:false, why:"cd es un comando interno de la shell (builtin): tiene que cambiar el directorio de la propia shell, algo que un programa externo no podría hacer. Puedes comprobarlo con type cd."},
 {t:"escribe", p:"Escribe el comando para ir a tu carpeta personal usando el símbolo que la representa",
  sol:["cd ~","cd ~/","cd"], ph:"cd ...", pista:"La virgulilla.",
  why:"cd ~ (o simplemente cd)."}
]},

{
id:"lx2l5",
titulo:"Encontrar ficheros y comandos",
claves:["find busca por nombre, tipo, tamaño o fecha","which y type dicen de dónde sale un comando","locate es rápido pero usa una base de datos que hay que actualizar"],
pasos:[
 {t:"info", eti:"Buscar", h:"find: el buscador de verdad",
  c:`<div class="termbox">find /etc -name "*.conf"              <span class="cm"># por nombre (con comodines, entre comillas)</span>
find /var/log -iname "*error*"        <span class="cm"># sin distinguir mayusculas</span>
find . -type d -name node_modules     <span class="cm"># solo directorios</span>
find /var/log -type f -size +100M     <span class="cm"># ficheros de mas de 100 MB</span>
find /tmp -type f -mtime +7           <span class="cm"># modificados hace mas de 7 dias</span>
find . -name "*.log" -delete          <span class="cm"># buscar y BORRAR (cuidado)</span></div>
     <p>La forma es siempre: <code>find DONDE CONDICIONES [ACCION]</code>.</p>`},
 {t:"term", p:"Busca en <code>/etc</code> todos los ficheros cuyo nombre termine en <code>.conf</code>",
  prompt:"pablo@servidor:~$", sol:["find /etc -name \"*.conf\"","find /etc -name '*.conf'","find /etc -name *.conf","find /etc -type f -name \"*.conf\"","find /etc -type f -name '*.conf'"],
  pista:"find, dónde, -name y el patrón entre comillas.",
  salida:`/etc/nginx/nginx.conf
/etc/resolv.conf
/etc/sysctl.conf
/etc/ssh/sshd_config.d/50-cloud-init.conf`,
  why:"Las comillas importan: sin ellas, la shell podría expandir *.conf antes de que find lo reciba."},
 {t:"par", p:"Empareja cada condición de find con su significado",
  pares:[["-type f","Solo ficheros normales"],["-type d","Solo directorios"],["-size +100M","Más grandes de 100 MB"],["-mtime +7","Modificados hace más de 7 días"],["-iname","Por nombre, sin distinguir mayúsculas"]],
  why:"find -size y -mtime son los que usarás cuando un disco se llene."},
 {t:"opcion", p:"El disco está lleno. ¿Qué comando te ayuda a encontrar los ficheros grandes en <code>/var</code>?",
  ops:["ls /var","find /var -type f -size +500M","cd /var","pwd /var"],
  ok:1, why:"find con -size filtra por tamaño. Combinado con du, que veremos más adelante, encuentras el culpable en segundos."},
 {t:"info", eti:"¿De dónde sale este comando?", h:"which, type y whereis",
  c:`<div class="termbox">which java         <span class="cm"># /usr/bin/java  (que fichero se ejecuta)</span>
type ls            <span class="cm"># ls is aliased to 'ls --color=auto'</span>
type cd            <span class="cm"># cd is a shell builtin</span>
whereis nginx      <span class="cm"># binario, configuracion y manual</span></div>
     <p>Cuando tienes dos versiones de Java instaladas y no sabes cuál se usa, <code>which java</code> te lo dice.</p>`},
 {t:"escribe", p:"Escribe el comando que te dice qué fichero se ejecuta al escribir <code>python3</code>",
  sol:["which python3","type python3","command -v python3"], ph:"...",
  pista:"La palabra inglesa para «cuál».", why:"which python3. También type python3 o command -v python3."},
 {t:"vf", p:"<code>locate</code> busca más rápido que <code>find</code> porque consulta una base de datos que se actualiza periódicamente.",
  ok:true, why:"Por eso a veces no encuentra ficheros recién creados hasta ejecutar updatedb. find, en cambio, recorre el disco en vivo."}
]}

]});
