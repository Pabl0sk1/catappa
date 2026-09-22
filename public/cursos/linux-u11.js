window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Seguridad y endurecimiento",
resumen: "Superficie de ataque, SSH seguro, fail2ban, SELinux y AppArmor, auditoría y aislamiento con namespaces y cgroups",
nivel: "Experto",
color: "#b47414",
lecciones: [

{
id:"lx11l1",
titulo:"Reducir la superficie de ataque",
claves:["Todo lo que escucha, está instalado o tiene permisos es superficie de ataque","Actualizaciones de seguridad automáticas","Mínimo privilegio en usuarios, servicios y red"],
pasos:[
 {t:"info", eti:"Mentalidad", h:"Cada puerta abierta es una puerta más",
  c:`<p>La <b>superficie de ataque</b> es todo lo que un atacante podría intentar usar: servicios escuchando en la red, programas instalados, usuarios con contraseña, permisos amplios. Endurecer (<i>hardening</i>) es reducirla:</p>
     <ul><li><b>Desinstalar</b> lo que no se usa. Un servidor web no necesita compiladores ni herramientas de desarrollo.</li>
     <li><b>Cerrar</b> los puertos que no hacen falta (<code>ss -tulpn</code> para ver qué escucha).</li>
     <li><b>Actualizar</b>: la mayoría de intrusiones explotan fallos ya corregidos.</li>
     <li><b>Mínimo privilegio</b>: cada servicio con su usuario y solo los permisos que necesita.</li></ul>`},
 {t:"orden", p:"Ordena una revisión básica de un servidor recién recibido",
  items:["sudo apt update && sudo apt upgrade  (parchear)","ss -tulpn  (qué está escuchando)","Desactivar y desinstalar servicios innecesarios","Configurar el cortafuegos: denegar todo y abrir lo necesario","Endurecer SSH: solo claves y sin root","Activar actualizaciones de seguridad automáticas"],
  why:"Esta lista, dicha en orden, es una respuesta excelente a «¿qué haces con un servidor nuevo?»."},
 {t:"opcion", p:"¿Por qué desinstalar herramientas como compiladores de un servidor de producción?",
  ops:["Para ahorrar disco","Porque si alguien entra, le facilitan compilar y ejecutar herramientas de ataque; lo que no está no se puede usar","Porque ralentizan el arranque","Porque lo exige la licencia"],
  ok:1, why:"Menos herramientas, menos opciones para quien consiga entrar. Es la misma idea que las imágenes distroless."},
 {t:"vf", p:"Un servicio que escucha solo en 127.0.0.1 no forma parte de la superficie de ataque externa.",
  ok:true, why:"No es accesible desde la red. Aun así, un atacante que ya esté dentro podría usarlo: la seguridad va en capas."},
 {t:"info", eti:"Parches", h:"Actualizaciones automáticas de seguridad",
  c:`<div class="termbox">sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
<span class="cm"># en Red Hat: dnf install dnf-automatic && systemctl enable --now dnf-automatic.timer</span>
needrestart          <span class="cm"># que servicios hay que reiniciar tras actualizar librerias</span></div>
     <p>Los parches del kernel requieren reiniciar (o live patching). Tener servidores que se pueden reiniciar sin miedo, porque hay redundancia, es parte de la seguridad.</p>`}
]},

{
id:"lx11l2",
titulo:"SSH seguro y fail2ban",
claves:["Solo claves, sin root, usuarios permitidos explícitos","fail2ban bloquea IPs tras varios intentos fallidos","Bastión y acceso por VPN en lugar de SSH abierto a internet"],
pasos:[
 {t:"info", eti:"sshd_config", h:"La configuración que se espera ver",
  c:`<div class="termbox"><span class="cm"># /etc/ssh/sshd_config.d/10-endurecido.conf</span>
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
AllowGroups ssh-users            <span class="cm"># solo estos pueden entrar</span>
MaxAuthTries 3
LoginGraceTime 20
X11Forwarding no</div>
     <div class="termbox">sudo sshd -t && sudo systemctl reload ssh    <span class="cm"># validar ANTES de recargar</span></div>
     <p>Y la regla de siempre: prueba en una segunda sesión antes de cerrar la actual.</p>`},
 {t:"par", p:"Empareja cada directiva con su efecto",
  pares:[["PasswordAuthentication no","Solo se entra con clave"],["PermitRootLogin no","root no puede entrar directamente"],["AllowGroups","Solo los miembros de esos grupos pueden entrar"],["MaxAuthTries 3","Pocos intentos por conexión"]],
  why:"sshd -t valida la sintaxis: un error aquí y te quedas fuera del servidor."},
 {t:"info", eti:"Defensa activa", h:"fail2ban",
  c:`<p><b>fail2ban</b> lee los logs, detecta patrones de ataque (muchos logins fallidos desde una IP) y añade una regla de cortafuegos que bloquea esa IP durante un tiempo.</p>
     <div class="termbox"><span class="cm"># /etc/fail2ban/jail.local</span>
[sshd]
enabled  = true
maxretry = 5
findtime = 10m
bantime  = 1h

sudo fail2ban-client status sshd      <span class="cm"># IPs bloqueadas</span></div>`},
 {t:"opcion", p:"¿Qué es mejor que tener SSH abierto a todo internet, aunque sea con claves?",
  ops:["Cambiar el puerto al 2222 y ya","Que SSH solo sea accesible desde una VPN o a través de un bastión, o usar acceso sin puertos abiertos (SSM, Tailscale...)","Usar contraseñas largas","Desactivar el cortafuegos"],
  ok:1, why:"Cambiar el puerto reduce ruido en los logs, pero no es seguridad. Lo robusto es que el puerto no sea alcanzable desde internet."},
 {t:"vf", p:"Cambiar SSH del puerto 22 al 2222 es una medida de seguridad suficiente.",
  ok:false, why:"Es «seguridad por oscuridad»: reduce bots automáticos, pero un escaneo de puertos lo encuentra en segundos."},
 {t:"escribe", p:"Escribe el comando que valida la configuración de sshd sin aplicarla",
  sol:["sudo sshd -t","sshd -t"], ph:"sudo sshd ...", pista:"sshd con la opción de test.",
  why:"sudo sshd -t. Silencio significa que la sintaxis es correcta."}
]},

{
id:"lx11l3",
titulo:"Control de acceso obligatorio: SELinux y AppArmor",
claves:["Los permisos normales son discrecionales (DAC); SELinux y AppArmor añaden control obligatorio (MAC)","Limitan qué puede hacer un proceso aunque sea root","Ante un bloqueo, se ajusta la política; no se desactiva"],
pasos:[
 {t:"info", eti:"Otra capa", h:"Más allá de rwx",
  c:`<p>Los permisos rwx son <b>discrecionales</b> (DAC): el dueño decide. Si un atacante toma el control de nginx, puede hacer todo lo que puede hacer el usuario de nginx.</p>
     <p><b>SELinux</b> (Red Hat) y <b>AppArmor</b> (Ubuntu) añaden control <b>obligatorio</b> (MAC): una política del sistema dice qué puede tocar cada programa, <b>incluso si es root</b>. Nginx comprometido no podrá leer <code>/etc/shadow</code> ni conectarse a donde su política no permita.</p>`},
 {t:"par", p:"Empareja cada término con su descripción",
  pares:[["DAC","El dueño del fichero decide los permisos (rwx)"],["MAC","Una política del sistema limita a cada proceso"],["SELinux","Sistema MAC por etiquetas, típico de Red Hat"],["AppArmor","Sistema MAC por perfiles de rutas, típico de Ubuntu"]],
  why:"Docker y Kubernetes usan AppArmor/SELinux para aislar contenedores."},
 {t:"info", eti:"SELinux en la práctica", h:"Modos y diagnóstico",
  c:`<div class="termbox">getenforce                    <span class="cm"># Enforcing | Permissive | Disabled</span>
sudo ausearch -m AVC -ts recent   <span class="cm"># que ha bloqueado SELinux</span>
ls -Z /var/www/html           <span class="cm"># ver etiquetas</span>
sudo restorecon -Rv /var/www  <span class="cm"># restaurar etiquetas correctas</span>
sudo setsebool -P httpd_can_network_connect on   <span class="cm"># permitir que nginx conecte a la red</span></div>
     <p>Error típico: mueves ficheros web con <code>mv</code> (conservan la etiqueta vieja) y nginx da «403 Forbidden». <code>restorecon</code> lo arregla.</p>`},
 {t:"opcion", p:"Nginx devuelve 403 en un RHEL tras mover la web a una carpeta nueva; los permisos rwx son correctos. ¿Qué compruebas?",
  ops:["Nada, es un bug de nginx","Las etiquetas de SELinux con ls -Z y los bloqueos con ausearch; restorecon o semanage para corregirlo","El DNS","La memoria"],
  ok:1, why:"Los ficheros tienen una etiqueta SELinux que nginx no puede leer. Es el caso más típico."},
 {t:"vf", p:"Ante un problema con SELinux, lo correcto en producción es desactivarlo con setenforce 0.",
  ok:false, why:"Eso elimina una capa de seguridad entera. Lo correcto es entender el bloqueo y ajustar etiquetas o booleanos. Permissive solo para diagnosticar, temporalmente."}
]},

{
id:"lx11l4",
titulo:"Auditoría, namespaces y cgroups",
claves:["auditd registra quién accede a qué; los logs se centralizan fuera de la máquina","namespaces aíslan lo que ve un proceso; cgroups limitan lo que consume","Los contenedores son esto: procesos con namespaces, cgroups y capacidades recortadas"],
pasos:[
 {t:"info", eti:"Saber qué pasó", h:"auditd y logs centralizados",
  c:`<div class="termbox">sudo auditctl -w /etc/shadow -p wa -k cambios-shadow   <span class="cm"># vigilar escrituras</span>
sudo ausearch -k cambios-shadow                        <span class="cm"># consultar</span>
last                     <span class="cm"># ultimos inicios de sesion</span>
sudo lastb               <span class="cm"># intentos fallidos</span>
journalctl _COMM=sudo    <span class="cm"># usos de sudo</span></div>
     <p>Un atacante con root puede borrar los logs locales. Por eso los logs se envían en tiempo real a otro sistema (un SIEM, Loki, ELK): lo que ya salió de la máquina no se puede borrar desde ella.</p>`},
 {t:"opcion", p:"¿Por qué se envían los logs de seguridad a un sistema externo?",
  ops:["Para ahorrar disco","Porque un atacante con root podría borrar los logs locales para ocultar su rastro","Porque es más rápido","Porque journalctl no guarda nada"],
  ok:1, why:"La evidencia tiene que estar fuera del alcance de quien ha comprometido la máquina."},
 {t:"info", eti:"Por dentro de los contenedores", h:"namespaces, cgroups y capacidades",
  c:`<ul><li><b>namespaces</b>: pid, net, mnt, uts, ipc, user, cgroup. Cada uno aísla una vista del sistema.</li>
     <li><b>cgroups</b> (v2): límites de CPU, memoria, I/O y número de procesos. <code>/sys/fs/cgroup</code>.</li>
     <li><b>capabilities</b>: root se trocea en permisos concretos (<code>CAP_NET_BIND_SERVICE</code> para puertos bajos, <code>CAP_SYS_ADMIN</code>...). Un contenedor arranca con un subconjunto reducido.</li>
     <li><b>seccomp</b>: filtra qué llamadas al sistema puede hacer el proceso.</li></ul>
     <div class="termbox">sudo unshare --pid --fork --mount-proc bash   <span class="cm"># un "contenedor" casero: ps solo te ve a ti</span>
lsns                                          <span class="cm"># namespaces del sistema</span>
getpcaps $$                                   <span class="cm"># capacidades de tu shell</span></div>`},
 {t:"par", p:"Empareja cada mecanismo del kernel con lo que aporta a un contenedor",
  pares:[["namespaces","Aislar lo que el proceso ve"],["cgroups","Limitar lo que el proceso consume"],["capabilities","Dar solo trozos concretos de los poderes de root"],["seccomp","Bloquear llamadas al sistema peligrosas"]],
  why:"Explicar un contenedor con estas cuatro piezas es una respuesta de nivel experto."},
 {t:"opcion", p:"Tu aplicación necesita escuchar en el puerto 80 sin correr como root. ¿Qué es lo correcto?",
  ops:["Ejecutarla como root","Darle solo la capacidad CAP_NET_BIND_SERVICE (o poner un proxy delante en el 80)","chmod 777 al binario","Desactivar el cortafuegos"],
  ok:1, why:"Mínimo privilegio: solo el trozo de root que hace falta. setcap o AmbientCapabilities en systemd."},
 {t:"vf", p:"Un contenedor es, en esencia, un proceso normal de Linux con namespaces, cgroups y privilegios recortados.",
  ok:true, why:"Por eso ps en el anfitrión muestra los procesos de los contenedores. No hay magia: es el kernel."}
]}

]});
