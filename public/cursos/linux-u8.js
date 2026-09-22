window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Paquetes, arranque y almacenamiento",
resumen: "apt y dnf, repositorios, discos y particiones, sistemas de ficheros, montaje, LVM y el proceso de arranque",
nivel: "Avanzado",
color: "#c98a1c",
lecciones: [

{
id:"lx8l1",
titulo:"Gestores de paquetes",
claves:["apt (Debian/Ubuntu) y dnf (Red Hat) instalan, actualizan y resuelven dependencias","update refresca la lista; upgrade instala las nuevas versiones","Los repositorios son las fuentes firmadas de donde salen los paquetes"],
pasos:[
 {t:"info", eti:"Instalar software", h:"Un paquete y sus dependencias",
  c:`<p>Un <b>paquete</b> es un programa listo para instalar, con información sobre qué otros paquetes necesita (sus <b>dependencias</b>). El gestor de paquetes los descarga de <b>repositorios</b> firmados, resuelve las dependencias y lleva la cuenta de qué está instalado.</p>
     <div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:14px">
     <tr><th style="text-align:left;padding:5px 8px">Acción</th><th style="text-align:left;padding:5px 8px">Debian / Ubuntu</th><th style="text-align:left;padding:5px 8px">RHEL / Fedora</th></tr>
     <tr><td style="padding:5px 8px">Refrescar la lista</td><td style="padding:5px 8px"><code>apt update</code></td><td style="padding:5px 8px"><code>dnf check-update</code></td></tr>
     <tr><td style="padding:5px 8px">Instalar</td><td style="padding:5px 8px"><code>apt install nginx</code></td><td style="padding:5px 8px"><code>dnf install nginx</code></td></tr>
     <tr><td style="padding:5px 8px">Actualizar todo</td><td style="padding:5px 8px"><code>apt upgrade</code></td><td style="padding:5px 8px"><code>dnf upgrade</code></td></tr>
     <tr><td style="padding:5px 8px">Desinstalar</td><td style="padding:5px 8px"><code>apt remove</code> / <code>purge</code></td><td style="padding:5px 8px"><code>dnf remove</code></td></tr>
     <tr><td style="padding:5px 8px">Buscar</td><td style="padding:5px 8px"><code>apt search</code></td><td style="padding:5px 8px"><code>dnf search</code></td></tr>
     <tr><td style="padding:5px 8px">¿De qué paquete es este fichero?</td><td style="padding:5px 8px"><code>dpkg -S /usr/bin/curl</code></td><td style="padding:5px 8px"><code>rpm -qf /usr/bin/curl</code></td></tr></table></div>`},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>apt update</code> y <code>apt upgrade</code>?",
  ops:["Son lo mismo","update descarga la lista actualizada de paquetes disponibles; upgrade instala las nuevas versiones","update instala todo; upgrade solo el kernel","upgrade borra los paquetes antiguos"],
  ok:1, why:"Por eso siempre van juntos: sudo apt update && sudo apt upgrade."},
 {t:"term", p:"Actualiza la lista de paquetes e instala <code>htop</code> sin preguntar, en un solo comando", prompt:"pablo@servidor:~$",
  sol:["sudo apt update && sudo apt install -y htop","sudo apt-get update && sudo apt-get install -y htop","sudo apt update && sudo apt install htop -y"],
  pista:"update, &&, e install con -y.",
  salida:`Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Reading package lists... Done
Setting up htop (3.0.5-7build2) ...`,
  why:"-y responde sí automáticamente: imprescindible en scripts y Dockerfiles."},
 {t:"par", p:"Empareja cada comando con su familia de distribuciones",
  pares:[["apt / dpkg","Debian y Ubuntu"],["dnf / rpm","Red Hat, Fedora, Rocky, Amazon Linux"],["apk","Alpine"],["pacman","Arch"]],
  why:"El concepto es el mismo en todas; cambian el nombre y los detalles."},
 {t:"info", eti:"Seguridad", h:"Repositorios firmados y actualizaciones automáticas",
  c:`<p>Los repositorios firman sus paquetes con claves GPG: el gestor rechaza un paquete manipulado. Añadir un repositorio de terceros (el de Docker, el de PostgreSQL) implica confiar en su clave.</p>
     <p>En servidores, las actualizaciones de seguridad deberían aplicarse solas: <code>unattended-upgrades</code> en Debian/Ubuntu, <code>dnf-automatic</code> en Red Hat.</p>`},
 {t:"vf", p:"En un Dockerfile basado en Ubuntu, conviene hacer <code>apt-get update</code> y <code>apt-get install</code> en la misma instrucción RUN.",
  ok:true, why:"Si van separados, la capa de update queda cacheada y un install posterior puede usar una lista antigua. Juntos, y limpiando /var/lib/apt/lists en la misma línea."}
]},

{
id:"lx8l2",
titulo:"Discos, particiones y sistemas de ficheros",
claves:["Los discos son /dev/sda, /dev/nvme0n1...; las particiones /dev/sda1","lsblk y blkid muestran discos, particiones y sus UUID","ext4 y xfs son los sistemas de ficheros más usados en servidores"],
pasos:[
 {t:"info", eti:"El hardware como ficheros", h:"Cómo ve Linux los discos",
  c:`<div class="termbox">lsblk
<span class="cm">NAME        SIZE TYPE MOUNTPOINT
nvme0n1      50G disk
├─nvme0n1p1   1G part /boot/efi
└─nvme0n1p2  49G part /
nvme1n1     200G disk              &lt;- disco nuevo, sin usar</span></div>
     <ul><li><b>Disco</b>: el dispositivo entero (<code>/dev/sda</code>, <code>/dev/nvme0n1</code>).</li>
     <li><b>Partición</b>: un trozo del disco (<code>/dev/sda1</code>, <code>/dev/nvme0n1p2</code>).</li>
     <li><b>Sistema de ficheros</b>: la organización que se «formatea» en la partición para guardar ficheros.</li></ul>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Disco","El dispositivo de almacenamiento completo"],["Partición","Una división del disco"],["Sistema de ficheros","Cómo se organizan los datos dentro de una partición"],["Punto de montaje","El directorio donde se engancha al árbol"]],
  why:"Estos cuatro conceptos son la base de cualquier tarea con almacenamiento."},
 {t:"info", eti:"Formatos", h:"ext4, xfs y compañía",
  c:`<ul><li><b>ext4</b>: el estándar de Debian/Ubuntu. Robusto y versátil.</li>
     <li><b>xfs</b>: el de Red Hat. Muy bueno con ficheros grandes y mucho paralelismo. No se puede encoger.</li>
     <li><b>btrfs</b> y <b>zfs</b>: con instantáneas (snapshots), compresión y sumas de verificación.</li>
     <li><b>tmpfs</b>: en memoria RAM (<code>/tmp</code> en algunas distros, <code>/run</code>).</li></ul>`},
 {t:"orden", p:"Ordena cómo preparar un disco nuevo para usarlo",
  items:["lsblk  (identificar el disco nuevo)","Crear una partición (fdisk, parted)","mkfs.ext4 /dev/nvme1n1p1  (crear el sistema de ficheros)","mkdir /datos  (crear el punto de montaje)","mount /dev/nvme1n1p1 /datos  (montarlo)","Añadirlo a /etc/fstab para que se monte al arrancar"],
  why:"Ojo con el primer paso: formatear el disco equivocado destruye datos. Comprueba dos veces con lsblk."},
 {t:"opcion", p:"¿Por qué en <code>/etc/fstab</code> se recomienda identificar los discos por UUID y no por <code>/dev/sdb1</code>?",
  ops:["Porque es más corto","Porque los nombres como /dev/sdb pueden cambiar entre arranques si cambian los discos; el UUID es fijo","Porque es obligatorio","Porque es más rápido"],
  ok:1, why:"Añadir un disco puede convertir el antiguo sdb en sdc. El UUID (blkid lo muestra) identifica siempre el mismo sistema de ficheros."},
 {t:"vf", p:"Ejecutar <code>mkfs.ext4</code> sobre una partición con datos los conserva.",
  ok:false, why:"Crea un sistema de ficheros nuevo y vacío: lo anterior se pierde. Es una operación destructiva."}
]},

{
id:"lx8l3",
titulo:"Montar, espacio y fstab",
claves:["mount y umount enganchan y desenganchan sistemas de ficheros","df -h espacio por sistema de ficheros; du -sh lo que ocupa una carpeta","Si se acaban los inodos, el disco está «lleno» aunque df diga que hay espacio"],
pasos:[
 {t:"info", eti:"Montar", h:"mount y /etc/fstab",
  c:`<div class="termbox">sudo mount /dev/nvme1n1p1 /datos
mount | grep datos           <span class="cm"># ver que esta montado</span>
sudo umount /datos           <span class="cm"># desmontar (nadie debe estar usandolo)</span>

<span class="cm"># /etc/fstab: montaje automatico al arrancar</span>
UUID=3f1a...  /datos  ext4  defaults,noatime  0  2</div>
     <p>Tras editar fstab, prueba con <code>sudo mount -a</code>: si hay un error, mejor verlo ahora que en el siguiente arranque (un fstab roto puede impedir que la máquina arranque).</p>`},
 {t:"info", eti:"El espacio", h:"df y du",
  c:`<div class="termbox">df -h                         <span class="cm"># espacio libre por sistema de ficheros</span>
du -sh /var/*  | sort -h      <span class="cm"># cuanto ocupa cada carpeta de /var</span>
du -sh --max-depth=1 /        <span class="cm"># primer nivel de la raiz</span>
df -i                         <span class="cm"># INODOS libres</span></div>
     <p>Estrategia ante un disco lleno: <code>df -h</code> para saber cuál, y luego <code>du</code> bajando carpeta a carpeta hasta encontrar al culpable.</p>`},
 {t:"term", p:"Muestra lo que ocupa cada carpeta dentro de <code>/var</code>, ordenado de menor a mayor", prompt:"pablo@servidor:~$",
  sol:["sudo du -sh /var/* | sort -h","du -sh /var/* | sort -h","sudo du -h --max-depth=1 /var | sort -h","du -h --max-depth=1 /var | sort -h"],
  pista:"du -sh sobre /var/* y una tubería a sort -h.",
  salida:`4.0K    /var/mail
52M     /var/cache
310M    /var/log
18G     /var/lib`,
  why:"El culpable está en /var/lib: ahí suelen estar Docker (/var/lib/docker) y las bases de datos."},
 {t:"info", eti:"El caso raro", h:"Disco lleno con espacio libre: los inodos",
  c:`<p>Cada fichero consume un <b>inodo</b> (la ficha con sus metadatos), y el número de inodos es fijo al formatear. Millones de ficheros diminutos (sesiones, caché) pueden agotarlos:</p>
     <div class="termbox">df -h /     <span class="cm"># 40% usado</span>
df -i /     <span class="cm"># 100% de inodos usados -> "No space left on device"</span></div>
     <p>Otro clásico: un fichero borrado que un proceso sigue teniendo abierto no libera espacio hasta que el proceso lo cierra. <code>lsof +L1</code> los encuentra.</p>`},
 {t:"opcion", p:"«No space left on device», pero <code>df -h</code> muestra un 40% usado. ¿Qué compruebas?",
  ops:["La memoria RAM","Los inodos con df -i","La CPU","Los permisos"],
  ok:1, why:"Inodos agotados por millones de ficheros pequeños. Pregunta de entrevista de sistemas muy frecuente."},
 {t:"vf", p:"Si borras un log enorme que un servicio sigue escribiendo, el espacio se libera al instante.",
  ok:false, why:"Mientras el proceso mantenga el fichero abierto, el espacio sigue ocupado. Se vacía con truncate -s 0, o se reinicia el servicio."}
]},

{
id:"lx8l4",
titulo:"LVM: discos flexibles",
claves:["LVM agrupa discos físicos (PV) en grupos (VG) y reparte volúmenes lógicos (LV)","Permite ampliar un volumen en caliente añadiendo discos","Instantáneas para copias consistentes"],
pasos:[
 {t:"info", eti:"El problema", h:"Las particiones son rígidas",
  c:`<p>Si <code>/var</code> es una partición de 50 GB y se llena, ampliarla es complicado: el espacio de al lado puede estar ocupado. <b>LVM</b> (Logical Volume Manager) añade una capa que hace el almacenamiento flexible:</p>
     <div class="diag">discos fisicos:   /dev/sdb  /dev/sdc          (PV: physical volumes)
                        \\      /
grupo:               vg_datos  (300 GB)        (VG: volume group)
                    /         \\
volumenes:      lv_bd (200G)  lv_logs (50G)    (LV: logical volumes)
                   |             |
montados en:  /var/lib/postgresql  /var/log</div>`},
 {t:"par", p:"Empareja cada nivel de LVM con su papel",
  pares:[["PV (physical volume)","Un disco o partición entregado a LVM"],["VG (volume group)","La bolsa común de espacio de varios PV"],["LV (logical volume)","El «disco virtual» que se formatea y monta"]],
  why:"PV, VG, LV: de abajo arriba. Así se piensa el almacenamiento en casi todos los servidores empresariales."},
 {t:"info", eti:"Ampliar en caliente", h:"Añadir espacio sin parar el servicio",
  c:`<div class="termbox">sudo pvcreate /dev/sdd                      <span class="cm"># disco nuevo para LVM</span>
sudo vgextend vg_datos /dev/sdd             <span class="cm"># al grupo</span>
sudo lvextend -r -L +100G /dev/vg_datos/lv_bd   <span class="cm"># ampliar el volumen Y su sistema de ficheros</span>
sudo pvs; sudo vgs; sudo lvs                <span class="cm"># ver el estado</span></div>
     <p>La <code>-r</code> redimensiona también el sistema de ficheros (ext4 o xfs) en el mismo paso, sin desmontar.</p>`},
 {t:"orden", p:"Ordena cómo ampliar un volumen lógico con un disco nuevo",
  items:["pvcreate /dev/sdd","vgextend vg_datos /dev/sdd","lvextend -r -L +100G /dev/vg_datos/lv_bd","df -h para comprobar el nuevo tamaño"],
  why:"En la nube el equivalente es ampliar el volumen (EBS) y luego growpart + resize2fs, o lvextend si usas LVM."},
 {t:"vf", p:"Con LVM, un volumen lógico puede ocupar espacio de varios discos físicos a la vez.",
  ok:true, why:"Esa es su gracia: el VG junta el espacio y el LV lo usa sin importar de qué disco viene."},
 {t:"opcion", p:"¿Para qué sirve una instantánea (snapshot) de LVM al hacer un backup de una base de datos?",
  ops:["Para comprimir los datos","Para congelar una imagen consistente del volumen en un instante y copiarla con calma mientras el servicio sigue","Para borrar datos antiguos","Para acelerar las consultas"],
  ok:1, why:"La instantánea es una foto en el tiempo; el servicio sigue escribiendo en el volumen original."}
]},

{
id:"lx8l5",
titulo:"Cómo arranca Linux",
claves:["Firmware (BIOS/UEFI) → cargador (GRUB) → kernel e initramfs → PID 1 (systemd) → targets y servicios","dmesg y journalctl -b muestran lo ocurrido en el arranque","systemd-analyze blame dice qué servicio retrasa el arranque"],
pasos:[
 {t:"info", eti:"De botón a prompt", h:"Las fases del arranque",
  c:`<div class="diag">1. Firmware (BIOS o UEFI)   comprueba el hardware y busca un disco arrancable
2. Cargador (GRUB)           elige y carga el kernel
3. Kernel + initramfs        detecta hardware, monta el disco raiz
4. PID 1: systemd            primer proceso de usuario
5. Targets                   arranca servicios en orden (red, ssh, nginx...)
6. Login                     consola o SSH listos</div>
     <p>El <b>initramfs</b> es un mini sistema de ficheros temporal que trae los controladores necesarios para poder montar el disco real (por ejemplo, si está cifrado o en LVM).</p>`},
 {t:"orden", p:"Ordena las fases del arranque",
  items:["Firmware BIOS/UEFI","Cargador de arranque GRUB","Kernel e initramfs","systemd (PID 1)","Servicios y targets","Pantalla de login o SSH disponible"],
  why:"Saber la secuencia ayuda a diagnosticar: si no ves GRUB, el problema es de firmware o disco; si el kernel entra en pánico, de initramfs o del disco raíz."},
 {t:"info", eti:"Targets", h:"Los «niveles» de systemd",
  c:`<ul><li><b>multi-user.target</b>: sistema completo sin escritorio. El de los servidores.</li>
     <li><b>graphical.target</b>: con escritorio.</li>
     <li><b>rescue.target</b>: modo mínimo de rescate, para arreglar cosas.</li></ul>
     <div class="termbox">systemctl get-default
sudo systemctl set-default multi-user.target</div>`},
 {t:"info", eti:"Diagnóstico", h:"Qué pasó durante el arranque",
  c:`<div class="termbox">dmesg -T | tail -50          <span class="cm"># mensajes del kernel (hardware, discos, OOM)</span>
journalctl -b                <span class="cm"># todo el log del arranque actual</span>
journalctl -b -1 -p err      <span class="cm"># errores del arranque ANTERIOR (tras un reinicio inesperado)</span>
systemd-analyze              <span class="cm"># cuanto tardo el arranque</span>
systemd-analyze blame        <span class="cm"># que servicio tardo mas</span></div>`},
 {t:"opcion", p:"Un servidor se reinició solo esta noche. ¿Dónde miras qué pasó antes del reinicio?",
  ops:["journalctl -b (arranque actual)","journalctl -b -1 (arranque anterior) y dmesg","ls /boot","df -h"],
  ok:1, why:"-b -1 muestra el arranque previo: ahí están los últimos mensajes antes de caer (un kernel panic, el OOM killer...)."},
 {t:"vf", p:"El PID 1 de un servidor Linux moderno suele ser systemd.",
  ok:true, why:"En casi todas las distribuciones actuales. En un contenedor, en cambio, el PID 1 es tu propia aplicación."}
]}

]});
