window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Procesos, señales y servicios",
resumen: "ps y top, señales y kill, trabajos en segundo plano, systemd, journalctl y tareas programadas",
nivel: "Intermedio",
color: "#e0a030",
lecciones: [

{
id:"lx6l1",
titulo:"Qué es un proceso",
claves:["Un proceso es un programa en ejecución con su PID","Cada proceso tiene un padre (PPID); el PID 1 es el primero","ps aux y pstree para verlos"],
pasos:[
 {t:"info", eti:"Programa contra proceso", h:"El mismo programa, varios procesos",
  c:`<p>Un <b>programa</b> es un fichero en disco (<code>/usr/bin/nginx</code>). Un <b>proceso</b> es ese programa <b>en ejecución</b>, con su memoria, sus ficheros abiertos y su número identificador, el <b>PID</b>.</p>
     <p>Del mismo programa puede haber muchos procesos a la vez: nginx arranca un proceso maestro y varios «workers».</p>
     <p>Todo proceso lo crea otro proceso, su <b>padre</b> (<b>PPID</b>). En el origen de todo está el <b>PID 1</b>, que arranca el kernel: normalmente <code>systemd</code>. En un contenedor, el PID 1 es tu aplicación.</p>`},
 {t:"term", p:"Lista todos los procesos del sistema con su usuario y consumo", prompt:"pablo@servidor:~$",
  sol:["ps aux","ps -aux","ps -ef"], pista:"ps con las letras a, u y x.",
  salida:`USER   PID %CPU %MEM    VSZ   RSS TTY  STAT START  TIME COMMAND
root     1  0.0  0.3 167744 12288 ?    Ss   08:02  0:03 /sbin/init
root   701  0.0  0.1  15432  7100 ?    Ss   08:02  0:00 sshd: /usr/sbin/sshd -D
www-data 1204 0.0 0.1 55184 5316 ?   S    08:02  0:00 nginx: worker process
mi-api 2310 2.1 18.4 4.1g  742M ?    Ssl  08:03  4:12 java -jar /opt/mi-api/app.jar`,
  why:"RSS es la memoria real que usa cada proceso. Aquí la API Java ocupa 742 MB."},
 {t:"par", p:"Empareja cada columna de ps aux con su significado",
  pares:[["PID","Identificador del proceso"],["%CPU","Porcentaje de procesador que usa"],["RSS","Memoria física real que ocupa"],["STAT","Estado (S dormido, R ejecutando, Z zombi...)"],["COMMAND","El comando que lo lanzó"]],
  why:"RSS contra VSZ: VSZ es la memoria virtual reservada, casi siempre mucho mayor y engañosa."},
 {t:"info", eti:"Buscar procesos", h:"pgrep, pstree y /proc",
  c:`<div class="termbox">pgrep -a java          <span class="cm"># PIDs y comando de los procesos "java"</span>
pstree -p              <span class="cm"># arbol padre-hijo con PIDs</span>
ps -o pid,ppid,cmd -p 2310   <span class="cm"># columnas concretas de un proceso</span>
ls /proc/2310/         <span class="cm"># todo sobre el proceso 2310</span>
cat /proc/2310/status  <span class="cm"># memoria, hilos, usuario...</span></div>`},
 {t:"info", eti:"Estados", h:"Los estados de un proceso",
  c:`<ul><li><b>R</b> (running): ejecutándose o listo para ejecutarse.</li>
     <li><b>S</b> (sleeping): esperando algo (una petición, un temporizador). La mayoría están así.</li>
     <li><b>D</b> (uninterruptible): esperando al disco o a la red; no se puede matar. Muchos procesos en D indican problemas de I/O.</li>
     <li><b>T</b> (stopped): pausado (por ejemplo con Ctrl+Z).</li>
     <li><b>Z</b> (zombie): terminó, pero su padre aún no ha recogido su estado de salida.</li></ul>`},
 {t:"opcion", p:"Ves muchos procesos en estado <code>D</code> y el servidor va lentísimo. ¿Qué sospechas?",
  ops:["Falta memoria RAM","Un problema de entrada/salida: el disco o un almacenamiento de red no responde","Demasiados usuarios conectados","Un error de sintaxis"],
  ok:1, why:"D es espera no interrumpible de I/O. Un NFS colgado o un disco saturado dejan procesos así."},
 {t:"vf", p:"Un proceso zombi consume mucha memoria y hay que matarlo con kill -9.",
  ok:false, why:"Un zombi ya ha terminado: solo ocupa una entrada en la tabla de procesos. No se puede matar; desaparece cuando su padre recoge su estado (o cuando muere el padre)."}
]},

{
id:"lx6l2",
titulo:"Monitorizar en vivo: top y htop",
claves:["top muestra carga, CPU, memoria y los procesos más activos","load average: procesos esperando CPU o I/O en 1, 5 y 15 minutos","En top: P ordena por CPU, M por memoria, k mata, q sale"],
pasos:[
 {t:"info", eti:"El panel", h:"La cabecera de top",
  c:`<div class="termbox">top - 10:14:02 up 12 days,  2:11,  1 user,  load average: 0.52, 0.61, 0.70
Tasks: 142 total,   1 running, 141 sleeping,   0 stopped,   0 zombie
%Cpu(s):  6.2 us,  1.3 sy,  0.0 ni, 91.8 id,  0.5 wa,  0.0 hi,  0.1 si
MiB Mem :   7842.1 total,    412.3 free,   3120.8 used,   4309.0 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   4410.6 avail Mem</div>
     <ul><li><b>load average</b>: media de procesos ejecutándose o esperando, en los últimos 1, 5 y 15 minutos.</li>
     <li><b>us</b> CPU de programas, <b>sy</b> del kernel, <b>id</b> ociosa, <b>wa</b> esperando disco.</li>
     <li><b>avail Mem</b>: la memoria de verdad disponible (la caché se libera cuando hace falta).</li></ul>`},
 {t:"info", eti:"Interpretar la carga", h:"¿Es mucho un load de 4?",
  c:`<p>Depende de los núcleos. Con <b>4 CPUs</b>, un load de 4 significa que están todas ocupadas justo al límite; 8 significa que hay el doble de trabajo del que se puede atender y los procesos esperan.</p>
     <div class="termbox">nproc       <span class="cm"># cuantos nucleos tienes</span>
uptime      <span class="cm"># la carga, sin abrir top</span></div>
     <p>Regla práctica: load sostenido por encima del número de núcleos = saturación.</p>`},
 {t:"opcion", p:"Un servidor de 2 núcleos tiene un load average de 7.8, 7.5, 6.9. ¿Qué indica?",
  ops:["Que va sobrado","Que está saturado de forma sostenida: hay mucho más trabajo del que puede atender","Que tiene 7 usuarios","Que la memoria está al 78%"],
  ok:1, why:"Casi 4 veces su capacidad y además creciendo (la cifra de 1 minuto es la mayor)."},
 {t:"info", eti:"Dentro de top", h:"Las teclas útiles",
  c:`<div class="termbox">P    <span class="cm"># ordenar por CPU</span>
M    <span class="cm"># ordenar por memoria</span>
1    <span class="cm"># ver cada nucleo por separado</span>
k    <span class="cm"># matar un proceso (pide el PID)</span>
c    <span class="cm"># ver el comando completo</span>
q    <span class="cm"># salir</span></div>
     <p><b>htop</b> es la versión moderna: colores, ratón, árbol de procesos. Instálalo en cualquier servidor que administres.</p>`},
 {t:"par", p:"Empareja cada dato de top con lo que indica",
  pares:[["load average","Procesos esperando CPU o I/O"],["wa","CPU esperando al disco"],["id","CPU ociosa"],["avail Mem","Memoria realmente disponible"],["buff/cache","Memoria usada como caché, recuperable"]],
  why:"Mucha buff/cache no es un problema: Linux usa la RAM libre como caché de disco y la cede cuando alguien la necesita."},
 {t:"vf", p:"Si <code>free</code> muestra muy poca memoria «free», el servidor está a punto de quedarse sin RAM.",
  ok:false, why:"Hay que mirar «available». Linux llena la RAM libre con caché a propósito: memoria sin usar es memoria desperdiciada."},
 {t:"escribe", p:"Escribe el comando que muestra cuántos núcleos de CPU tiene la máquina",
  sol:["nproc","lscpu","grep -c processor /proc/cpuinfo"], ph:"...", pista:"number of processors, abreviado.",
  why:"nproc. lscpu da el detalle completo."}
]},

{
id:"lx6l3",
titulo:"Señales y kill",
claves:["kill envía señales: SIGTERM (15) pide terminar, SIGKILL (9) mata sin remedio","Primero SIGTERM, solo si no responde SIGKILL","pkill y killall trabajan por nombre"],
pasos:[
 {t:"info", eti:"Comunicarse con procesos", h:"Las señales",
  c:`<p>Una <b>señal</b> es un aviso que el kernel entrega a un proceso. Las importantes:</p>
     <div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:14px">
     <tr><td style="padding:5px 8px"><b>SIGTERM</b> (15)</td><td style="padding:5px 8px">«Termina, por favor». El programa puede cerrar ordenadamente. Es la de por defecto.</td></tr>
     <tr><td style="padding:5px 8px"><b>SIGKILL</b> (9)</td><td style="padding:5px 8px">Muerte inmediata. No se puede capturar ni ignorar. Sin limpieza.</td></tr>
     <tr><td style="padding:5px 8px"><b>SIGINT</b> (2)</td><td style="padding:5px 8px">Lo que manda Ctrl+C.</td></tr>
     <tr><td style="padding:5px 8px"><b>SIGHUP</b> (1)</td><td style="padding:5px 8px">Muchos servicios la usan para recargar la configuración.</td></tr>
     <tr><td style="padding:5px 8px"><b>SIGSTOP / SIGCONT</b></td><td style="padding:5px 8px">Pausar y reanudar.</td></tr></table></div>`},
 {t:"info", eti:"Enviar señales", h:"kill, pkill y killall",
  c:`<div class="termbox">kill 2310             <span class="cm"># SIGTERM al PID 2310</span>
kill -9 2310          <span class="cm"># SIGKILL: ultimo recurso</span>
kill -HUP 1204        <span class="cm"># pedir que recargue configuracion</span>
pkill -f "mi-api"     <span class="cm"># por patron del comando</span>
killall nginx         <span class="cm"># por nombre exacto</span>
kill -l               <span class="cm"># lista de senales</span></div>`},
 {t:"orden", p:"Ordena la forma correcta de parar un proceso que no responde",
  items:["kill PID  (SIGTERM: pedir que termine)","Esperar unos segundos a que cierre ordenadamente","Comprobar si sigue vivo con ps o pgrep","Solo si sigue vivo: kill -9 PID"],
  why:"SIGKILL no deja cerrar ficheros ni conexiones: puede dejar datos a medias. Es el último recurso."},
 {t:"opcion", p:"¿Por qué no se debe usar <code>kill -9</code> como primera opción con una base de datos?",
  ops:["Porque es más lento","Porque no le deja terminar las escrituras ni cerrar ficheros, y puede dejar datos inconsistentes","Porque no funciona con root","Porque reinicia el servidor"],
  ok:1, why:"Con SIGTERM la base de datos vacía buffers y cierra bien. SIGKILL la corta en seco."},
 {t:"par", p:"Empareja cada señal con su número o uso",
  pares:[["SIGTERM","15: petición de terminar ordenadamente"],["SIGKILL","9: muerte inmediata, no se puede ignorar"],["SIGINT","2: lo que envía Ctrl+C"],["SIGHUP","1: a menudo, recargar configuración"]],
  why:"Lo mismo que hace docker stop: SIGTERM, espera, y SIGKILL. Ahora ves de dónde viene."},
 {t:"vf", p:"Un programa puede capturar SIGKILL y decidir ignorarla.",
  ok:false, why:"SIGKILL y SIGSTOP son las dos señales que ningún proceso puede capturar ni ignorar."},
 {t:"escribe", p:"Escribe el comando que envía SIGTERM a todos los procesos cuyo comando contiene <code>mi-api</code>",
  sol:["pkill -f mi-api","pkill -f \"mi-api\"","pkill -15 -f mi-api","pkill -term -f mi-api"], ph:"pkill ...",
  pista:"pkill con -f para buscar en el comando completo.", why:"pkill -f mi-api."}
]},

{
id:"lx6l4",
titulo:"Primer y segundo plano",
claves:["& lanza en segundo plano; jobs, fg y bg los gestionan","Ctrl+Z pausa; bg lo reanuda en segundo plano","nohup, tmux o screen para que sobreviva al cerrar la sesión SSH"],
pasos:[
 {t:"info", eti:"Trabajos", h:"Lanzar sin bloquear la terminal",
  c:`<div class="termbox">./backup.sh &          <span class="cm"># en segundo plano: recuperas el prompt</span>
jobs                   <span class="cm"># trabajos de esta shell</span>
fg %1                  <span class="cm"># traer el trabajo 1 al primer plano</span>
Ctrl+Z                 <span class="cm"># pausar el que esta en primer plano</span>
bg                     <span class="cm"># reanudarlo en segundo plano</span></div>`},
 {t:"orden", p:"Lanzaste un comando largo sin <code>&</code>. Ordena cómo pasarlo a segundo plano sin cortarlo",
  items:["Pulsar Ctrl+Z (se pausa)","Escribir bg (sigue corriendo en segundo plano)","Escribir jobs para comprobarlo"],
  why:"Ctrl+Z pausa, no cancela. bg lo reanuda sin ocupar la terminal."},
 {t:"info", eti:"El problema de SSH", h:"Al cerrar la sesión, se mueren tus procesos",
  c:`<p>Cuando cierras SSH, la shell envía <b>SIGHUP</b> a sus trabajos y mueren, aunque estén en segundo plano. Soluciones:</p>
     <div class="termbox">nohup ./migracion.sh > migracion.log 2>&1 &   <span class="cm"># ignora SIGHUP</span>
disown %1                                      <span class="cm"># desvincular un trabajo ya lanzado</span></div>
     <p>La solución profesional: <b>tmux</b> (o screen). Abres una sesión que vive en el servidor; te desconectas, y al volver te reengancharías a ella con todo como lo dejaste.</p>
     <div class="termbox">tmux new -s migracion      <span class="cm"># sesion nueva</span>
Ctrl+B y luego D           <span class="cm"># desconectarte (sigue corriendo)</span>
tmux attach -t migracion   <span class="cm"># volver</span></div>`},
 {t:"opcion", p:"Vas a lanzar una migración de 3 horas en un servidor por SSH y tu wifi es inestable. ¿Qué haces?",
  ops:["Lanzarla normal y no tocar el portátil","Lanzarla dentro de tmux (o con nohup), para que sobreviva si se corta la conexión","Lanzarla con kill -9","Lanzarla con sudo"],
  ok:1, why:"Si se corta SSH, la migración sigue en el servidor. Con tmux, además, puedes volver a ver su salida."},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["&","Lanzar en segundo plano"],["Ctrl+Z","Pausar el proceso en primer plano"],["fg","Traer un trabajo al primer plano"],["nohup","Ignorar SIGHUP al cerrar la sesión"],["tmux","Sesiones persistentes en el servidor"]],
  why:"En servidores reales, tmux es la opción más cómoda y robusta."},
 {t:"vf", p:"Un comando lanzado con <code>&</code> sigue vivo siempre, aunque cierres la sesión SSH.",
  ok:false, why:"Sigue siendo hijo de tu shell y recibe SIGHUP al salir. Hace falta nohup, disown o tmux."}
]},

{
id:"lx6l5",
titulo:"systemd, journalctl y tareas programadas",
claves:["systemctl gestiona servicios: start, stop, restart, enable, status","journalctl -u servicio muestra sus logs; -f en vivo","cron y los timers de systemd ejecutan tareas periódicas"],
pasos:[
 {t:"info", eti:"El gestor de servicios", h:"systemd y systemctl",
  c:`<div class="termbox">systemctl status nginx          <span class="cm"># estado, PID y ultimas lineas de log</span>
sudo systemctl start nginx      <span class="cm"># arrancar ahora</span>
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx     <span class="cm"># recargar configuracion sin cortar</span>
sudo systemctl enable nginx     <span class="cm"># arrancar al encender la maquina</span>
sudo systemctl enable --now nginx   <span class="cm"># enable + start</span>
systemctl list-units --type=service --state=failed   <span class="cm"># que servicios han fallado</span></div>`},
 {t:"info", eti:"Tu propio servicio", h:"Una unidad .service",
  c:`<div class="termbox"><span class="cm"># /etc/systemd/system/mi-api.service</span>
[Unit]
Description=API de tareas
After=network-online.target
Wants=network-online.target

[Service]
User=mi-api
WorkingDirectory=/opt/mi-api
EnvironmentFile=/etc/mi-api/entorno
ExecStart=/usr/bin/java -jar /opt/mi-api/app.jar
Restart=on-failure
RestartSec=5
<span class="cm"># endurecimiento</span>
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/var/lib/mi-api

[Install]
WantedBy=multi-user.target</div>
     <div class="termbox">sudo systemctl daemon-reload && sudo systemctl enable --now mi-api</div>`},
 {t:"par", p:"Empareja cada directiva de la unidad con su efecto",
  pares:[["User=","Con qué usuario se ejecuta el servicio"],["Restart=on-failure","Reiniciarlo si termina con error"],["EnvironmentFile=","Cargar variables de entorno desde un fichero"],["WantedBy=multi-user.target","Arrancar en el arranque normal del sistema"],["ProtectSystem=strict","Montar el sistema en solo lectura para el servicio"]],
  why:"Con unas pocas directivas de endurecimiento, un servicio comprometido puede hacer muchísimo menos daño."},
 {t:"term", p:"Muestra en vivo los logs del servicio <code>mi-api</code>", prompt:"pablo@servidor:~$",
  sol:["journalctl -u mi-api -f","journalctl -fu mi-api","journalctl -f -u mi-api","sudo journalctl -u mi-api -f"],
  pista:"journalctl, -u con la unidad y -f.",
  salida:`sep 21 10:14:02 servidor java[2310]: Started TareasApplication in 3.412 seconds
sep 21 10:14:05 servidor java[2310]: GET /api/tareas 200 12ms`,
  why:"Otros filtros útiles: --since \"1 hour ago\", -p err (solo errores) y -b (desde el último arranque)."},
 {t:"info", eti:"Tareas periódicas", h:"cron y los timers de systemd",
  c:`<p><b>cron</b> ejecuta comandos según un calendario. Se edita con <code>crontab -e</code>:</p>
     <div class="termbox"><span class="cm"># min hora dia-mes mes dia-semana  comando</span>
30  3  *  *  *   /opt/scripts/backup.sh >> /var/log/backup.log 2>&1   <span class="cm"># cada dia a las 3:30</span>
*/5 *  *  *  *   /opt/scripts/check.sh      <span class="cm"># cada 5 minutos</span>
0   9  *  *  1   /opt/scripts/informe.sh    <span class="cm"># los lunes a las 9:00</span></div>
     <p>La alternativa moderna son los <b>timers de systemd</b>: tienen logs en journalctl, dependencias y no se pierden ejecuciones si la máquina estaba apagada (<code>Persistent=true</code>).</p>`},
 {t:"opcion", p:"¿Qué significa la línea de cron <code>0 */6 * * *</code>?",
  ops:["Cada 6 minutos","A las 0:06","Cada 6 horas, en el minuto 0","Los días 6 de cada mes"],
  ok:2, why:"Minuto 0 de cada hora divisible por 6: a las 0:00, 6:00, 12:00 y 18:00."},
 {t:"vf", p:"Un script en cron tiene el mismo PATH y las mismas variables que tu sesión interactiva.",
  ok:false, why:"cron usa un entorno mínimo. Por eso los scripts de cron deben usar rutas absolutas y definir las variables que necesiten. Es la causa número uno de «en la terminal funciona y en cron no»."}
]}

]});
