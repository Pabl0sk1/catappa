window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Rendimiento y diagnóstico",
resumen: "Método USE, CPU, memoria y OOM killer, disco, strace, lsof, límites y ajustes del kernel",
nivel: "Experto",
color: "#b47414",
lecciones: [

{
id:"lx10l1",
titulo:"Un método para diagnosticar",
claves:["Método USE: utilización, saturación y errores de cada recurso","Los 60 segundos de Brendan Gregg: uptime, dmesg, vmstat, mpstat, pidstat, iostat, free, sar, top","Medir antes de tocar nada"],
pasos:[
 {t:"info", eti:"Sin método, adivinas", h:"El método USE",
  c:`<p>Ante «el servidor va lento», los expertos no prueban cosas al azar. Recorren cada recurso (CPU, memoria, disco, red) y preguntan tres cosas:</p>
     <ul><li><b>U</b>tilización: ¿qué porcentaje del tiempo está ocupado?</li>
     <li><b>S</b>aturación: ¿hay trabajo esperando en cola?</li>
     <li><b>E</b>rrores: ¿hay errores registrados?</li></ul>
     <p>Es el método de Brendan Gregg (ingeniero de rendimiento de Netflix), y funciona porque es exhaustivo: no se te escapa ningún recurso.</p>`},
 {t:"par", p:"Empareja cada letra del método USE con su pregunta",
  pares:[["Utilización","¿Cuánto tiempo está ocupado el recurso?"],["Saturación","¿Hay trabajo esperando porque no da abasto?"],["Errores","¿El recurso está registrando fallos?"]],
  why:"Un disco al 100% de utilización con una cola enorme (saturación) explica una aplicación lenta aunque la CPU esté tranquila."},
 {t:"info", eti:"Los primeros 60 segundos", h:"La secuencia de comandos",
  c:`<div class="termbox">uptime                 <span class="cm"># carga: ¿cuanto trabajo hay?</span>
dmesg -T | tail        <span class="cm"># errores del kernel, OOM killer</span>
vmstat 1               <span class="cm"># CPU, memoria, swap, cola de ejecucion, cada segundo</span>
mpstat -P ALL 1        <span class="cm"># CPU por nucleo (¿un solo nucleo saturado?)</span>
pidstat 1              <span class="cm"># CPU por proceso</span>
iostat -xz 1           <span class="cm"># disco: utilizacion, latencias, cola</span>
free -m                <span class="cm"># memoria</span>
sar -n DEV 1           <span class="cm"># red por interfaz</span>
top                    <span class="cm"># vista general</span></div>
     <p>Con esto, en un minuto sabes qué recurso está sufriendo. (Varias vienen en el paquete <code>sysstat</code>.)</p>`},
 {t:"opcion", p:"La CPU media está al 25% en un servidor de 4 núcleos, pero la app va lenta y es de un solo hilo. ¿Qué compruebas?",
  ops:["Nada, la CPU va sobrada","mpstat -P ALL: probablemente un núcleo está al 100% y los otros tres ociosos","El DNS","Los permisos"],
  ok:1, why:"25% de media con 4 núcleos puede ser un núcleo saturado. La media engaña."},
 {t:"vf", p:"Reiniciar el servicio es un buen primer paso de diagnóstico.",
  ok:false, why:"Reiniciar puede mitigar, pero destruye la evidencia. Primero captura datos (qué consume, logs, estado); después mitiga."}
]},

{
id:"lx10l2",
titulo:"CPU y memoria en detalle",
claves:["vmstat: r (cola de CPU), si/so (swap), wa (espera de disco)","El OOM killer mata procesos cuando se agota la memoria: aparece en dmesg","La swap evita muertes pero degrada mucho el rendimiento"],
pasos:[
 {t:"info", eti:"vmstat", h:"Leer vmstat 1",
  c:`<div class="termbox">procs -----memory------ ---swap-- -----io---- ---system-- ------cpu-----
 r  b   free  buff cache   si   so    bi    bo   in   cs us sy id wa st
 9  0  81232 20312 1.2G     0    0     5    40 2210 4100 92  6  2  0  0
<span class="cm">^                           ^    ^                        ^  ^     ^</span>
<span class="cm">r: procesos esperando CPU   si/so: swap entrando/saliendo  us sy  wa</span></div>
     <ul><li><b>r</b> mayor que el número de núcleos de forma sostenida: CPU saturada.</li>
     <li><b>si/so</b> distintos de 0 continuamente: la máquina está usando swap, se queda sin RAM.</li>
     <li><b>wa</b> alto: la CPU espera al disco.</li>
     <li><b>st</b> (steal): en la nube, tiempo que el hipervisor te «roba» para otras máquinas virtuales.</li></ul>`},
 {t:"par", p:"Empareja cada columna de vmstat con lo que indica cuando es alta",
  pares:[["r","Cola de procesos esperando CPU"],["si / so","Uso activo de swap por falta de RAM"],["wa","CPU esperando entrada/salida de disco"],["st","CPU robada por el hipervisor (vecinos ruidosos en la nube)"]],
  why:"st alto en una instancia pequeña de la nube explica lentitudes que no se ven en ningún proceso."},
 {t:"info", eti:"Sin memoria", h:"El OOM killer",
  c:`<p>Cuando la memoria se agota del todo, el kernel elige un proceso y lo mata para salvar el sistema: es el <b>OOM killer</b> (Out Of Memory). Suele elegir el que más memoria usa... a menudo, tu aplicación Java o tu base de datos.</p>
     <div class="termbox">dmesg -T | grep -i -E "killed process|out of memory"
<span class="cm">[sep 21 03:12] Out of memory: Killed process 2310 (java) total-vm:6.1G, anon-rss:3.8G</span></div>
     <p>En un contenedor, esto es el famoso <b>Exited (137)</b>: SIGKILL por superar su límite de memoria (un cgroup).</p>`},
 {t:"opcion", p:"Tu servicio Java desaparece cada noche sin dejar nada en su propio log. ¿Dónde miras?",
  ops:["En el log de la aplicación","En dmesg / journalctl -k buscando el OOM killer","En /etc/hosts","En el historial de bash"],
  ok:1, why:"SIGKILL no deja a la app escribir nada. La prueba queda en los mensajes del kernel."},
 {t:"info", eti:"Swap", h:"Salvavidas lento",
  c:`<p>La <b>swap</b> es espacio en disco que se usa como memoria de reserva. Evita que el OOM killer actúe tan pronto, pero el disco es miles de veces más lento que la RAM: un servidor haciendo swap continuamente va a paso de tortuga.</p>
     <p><code>vm.swappiness</code> (0-100) controla cuánto tiende el kernel a usarla. En servidores de bases de datos se suele bajar (10 o menos). En Kubernetes, por defecto se desactiva.</p>`},
 {t:"vf", p:"Un contenedor que supera su límite de memoria recibe SIGKILL y termina con código 137.",
  ok:true, why:"137 = 128 + 9 (SIGKILL). Es el OOM killer actuando sobre el cgroup del contenedor."}
]},

{
id:"lx10l3",
titulo:"Disco y entrada/salida",
claves:["iostat -xz: %util, await (latencia) y aqu-sz (cola)","iotop muestra qué proceso hace más I/O","Latencia alta en disco = aplicación lenta aunque la CPU esté ociosa"],
pasos:[
 {t:"info", eti:"iostat", h:"Las columnas que importan",
  c:`<div class="termbox">iostat -xz 1
<span class="cm">Device   r/s   w/s  rkB/s  wkB/s  r_await w_await aqu-sz  %util
nvme0n1  12  840    96  48210     0.4    38.2    31.7   99.8</span></div>
     <ul><li><b>%util</b>: tiempo que el disco está ocupado. Cerca de 100% = saturado (en discos SSD/NVMe con mucho paralelismo, este dato engaña; mira la latencia).</li>
     <li><b>r_await / w_await</b>: latencia media en ms. Un NVMe sano: menos de 1 ms. 38 ms es muchísimo.</li>
     <li><b>aqu-sz</b>: longitud media de la cola: peticiones esperando.</li></ul>`},
 {t:"opcion", p:"iostat muestra w_await de 40 ms y una cola de 30 en el disco de la base de datos. ¿Qué pasa?",
  ops:["Nada, es normal","El disco está saturado de escrituras: cada escritura espera mucho y la base de datos va lenta","La red va lenta","Falta CPU"],
  ok:1, why:"Latencia y cola altas = saturación del disco. Soluciones: menos escrituras, disco más rápido (más IOPS), o repartir la carga."},
 {t:"info", eti:"¿Quién escribe tanto?", h:"iotop y pidstat -d",
  c:`<div class="termbox">sudo iotop -o          <span class="cm"># solo procesos haciendo I/O ahora mismo</span>
pidstat -d 1           <span class="cm"># I/O por proceso cada segundo</span></div>
     <p>Culpables habituales: un log en modo DEBUG escribiendo sin parar, un backup a mitad del día, o una consulta que hace un escaneo completo de una tabla enorme.</p>`},
 {t:"par", p:"Empareja cada síntoma con la herramienta que lo confirma",
  pares:[["Disco saturado","iostat -xz 1"],["Qué proceso escribe","iotop / pidstat -d"],["Qué fichero crece","du -sh y ls -lt"],["Quién tiene abierto un fichero","lsof"]],
  why:"Cada pregunta, su herramienta."},
 {t:"vf", p:"En la nube, un volumen de disco puede tener un límite de IOPS que se agota aunque el disco no esté lleno.",
  ok:true, why:"Los volúmenes como EBS gp3 tienen IOPS y ancho de banda máximos. Superarlos dispara la latencia."}
]},

{
id:"lx10l4",
titulo:"Rayos X de un proceso: strace, lsof y /proc",
claves:["strace muestra las llamadas al sistema de un proceso","lsof lista ficheros y conexiones abiertas","/proc/PID expone todo el estado de un proceso"],
pasos:[
 {t:"info", eti:"Llamadas al sistema", h:"strace: ver qué pide un programa al kernel",
  c:`<p>Todo lo que hace un programa con el mundo exterior (abrir ficheros, conectarse, leer, escribir) pasa por <b>llamadas al sistema</b>. <code>strace</code> las muestra:</p>
     <div class="termbox">strace -f -e trace=openat,connect java -jar app.jar
<span class="cm">openat(AT_FDCWD, "/etc/mi-api/config.yml", O_RDONLY) = -1 ENOENT (No such file or directory)
connect(12, {sin_port=htons(5432), sin_addr=inet_addr("10.0.2.14")}, 16) = -1 ECONNREFUSED</span>

sudo strace -p 2310 -f -tt      <span class="cm"># engancharse a un proceso en marcha</span>
strace -c ./programa            <span class="cm"># resumen: que llamadas y cuanto tiempo</span></div>
     <p>Cuando un programa falla con un mensaje inútil, strace te dice exactamente qué fichero no encontró o a qué no pudo conectarse.</p>`},
 {t:"opcion", p:"Un programa dice «error de configuración» sin más detalles. ¿Cómo averiguas qué fichero intenta leer?",
  ops:["Leyendo su código fuente","strace -e trace=openat ./programa y buscando los ENOENT","Reinstalándolo","Con top"],
  ok:1, why:"ENOENT en openat revela la ruta exacta que busca y no encuentra."},
 {t:"info", eti:"Ficheros abiertos", h:"lsof",
  c:`<div class="termbox">sudo lsof -p 2310            <span class="cm"># todo lo que tiene abierto el proceso</span>
sudo lsof -i :8080           <span class="cm"># quien usa el puerto 8080</span>
sudo lsof /var/log/app.log   <span class="cm"># quien tiene abierto este fichero</span>
sudo lsof +L1                <span class="cm"># ficheros BORRADOS que siguen abiertos (espacio "fantasma")</span>
ls /proc/2310/fd | wc -l     <span class="cm"># cuantos descriptores abiertos tiene</span></div>`},
 {t:"par", p:"Empareja cada comando con lo que descubre",
  pares:[["strace -p PID","Qué llamadas al sistema hace un proceso en marcha"],["lsof -i :8080","Qué proceso usa el puerto 8080"],["lsof +L1","Ficheros borrados que aún ocupan espacio"],["cat /proc/PID/limits","Los límites de recursos del proceso"]],
  why:"Estas herramientas convierten problemas «misteriosos» en respuestas concretas."},
 {t:"info", eti:"Límites", h:"«Too many open files»",
  c:`<p>Cada proceso tiene un máximo de ficheros abiertos (y cada conexión de red cuenta como uno). Una API con mucho tráfico puede superarlo:</p>
     <div class="termbox">ulimit -n                       <span class="cm"># limite de esta shell (a menudo 1024)</span>
cat /proc/2310/limits | grep "open files"
<span class="cm"># en la unidad de systemd del servicio:</span>
LimitNOFILE=65536</div>`},
 {t:"vf", p:"El error «Too many open files» siempre significa que el disco está lleno.",
  ok:false, why:"Significa que el proceso ha llegado a su límite de descriptores (ficheros y sockets). Se sube con LimitNOFILE o ulimit, o se busca la fuga de conexiones."}
]},

{
id:"lx10l5",
titulo:"Afinar el kernel con sysctl",
claves:["sysctl lee y ajusta parámetros del kernel en caliente","Persistencia en /etc/sysctl.d/*.conf","Cambia solo lo que hayas medido que lo necesita"],
pasos:[
 {t:"info", eti:"Parámetros del kernel", h:"sysctl",
  c:`<div class="termbox">sysctl net.core.somaxconn                   <span class="cm"># leer</span>
sudo sysctl -w vm.swappiness=10             <span class="cm"># cambiar en caliente (se pierde al reiniciar)</span>
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/90-bd.conf   <span class="cm"># persistente</span>
sudo sysctl --system                        <span class="cm"># recargar todos los ficheros</span></div>
     <p>Cada parámetro corresponde a un fichero en <code>/proc/sys</code>: <code>vm.swappiness</code> es <code>/proc/sys/vm/swappiness</code>.</p>`},
 {t:"par", p:"Empareja cada parámetro con lo que controla",
  pares:[["vm.swappiness","Cuánto tiende el kernel a usar swap"],["net.core.somaxconn","Tamaño máximo de la cola de conexiones pendientes"],["fs.file-max","Máximo de ficheros abiertos en todo el sistema"],["net.ipv4.ip_forward","Si la máquina reenvía paquetes (hace de router)"],["vm.max_map_count","Mapas de memoria por proceso (Elasticsearch lo exige alto)"]],
  why:"ip_forward=1 es obligatorio en nodos de Kubernetes y en cualquier máquina que haga NAT para contenedores."},
 {t:"opcion", p:"Elasticsearch no arranca y pide <code>vm.max_map_count</code> de al menos 262144. ¿Cómo lo aplicas de forma permanente?",
  ops:["sysctl -w vm.max_map_count=262144 y ya","Un fichero en /etc/sysctl.d/ con vm.max_map_count=262144 y sysctl --system","Editar el código de Elasticsearch","Reinstalar el kernel"],
  ok:1, why:"sysctl -w solo dura hasta el reinicio. El fichero en sysctl.d lo hace permanente."},
 {t:"info", eti:"Filosofía", h:"No copies ajustes de internet",
  c:`<p>Hay listas de «los 50 sysctl para un servidor rápido». La mayoría de valores por defecto del kernel son buenos. Cambia un parámetro solo si:</p>
     <ol><li>has <b>medido</b> un problema concreto,</li>
     <li>entiendes <b>qué hace</b> el parámetro,</li>
     <li>y <b>vuelves a medir</b> después para confirmar la mejora.</li></ol>
     <p>Y déjalo documentado en el fichero de <code>/etc/sysctl.d/</code> con un comentario del porqué.</p>`},
 {t:"vf", p:"Los cambios hechos con <code>sysctl -w</code> sobreviven a un reinicio.",
  ok:false, why:"Son en caliente y temporales. Para que persistan, van en /etc/sysctl.d/."}
]}

]});
