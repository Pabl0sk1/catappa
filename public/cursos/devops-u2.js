window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "Linux de servidor",
resumen: "systemd, redes, SSH, scripts bash, logs, disco y cortafuegos",
color: "#8fd16a",
lecciones: [

/* =============== O2 L1 =============== */
{
id:"o2l1",
titulo:"Servicios con systemd",
claves:["systemd arranca y vigila los servicios del sistema","systemctl status/start/stop/restart/enable","journalctl -u servicio muestra sus logs"],
pasos:[
 {t:"info", eti:"El contexto", h:"Casi todo servidor Linux usa systemd",
  c:`<p>En un servidor, los programas que deben estar siempre funcionando (nginx, PostgreSQL, Docker, tu aplicación) se ejecutan como <b>servicios</b>. En casi todas las distribuciones modernas (Ubuntu, Debian, RHEL) quien los gestiona es <b>systemd</b>.</p>
     <p>systemd los arranca al encender la máquina, los reinicia si se caen y guarda sus logs.</p>`},

 {t:"info", eti:"El comando", h:"systemctl",
  c:`<div class="termbox">sudo systemctl status nginx     <span class="cm"># ¿esta funcionando?</span>
sudo systemctl start nginx      <span class="cm"># arrancar</span>
sudo systemctl stop nginx       <span class="cm"># parar</span>
sudo systemctl restart nginx    <span class="cm"># reiniciar</span>
sudo systemctl reload nginx     <span class="cm"># recargar la configuracion sin cortar conexiones</span>
sudo systemctl enable nginx     <span class="cm"># que arranque al encender la maquina</span>
sudo systemctl disable nginx    <span class="cm"># que NO arranque al encender</span></div>
     <div class="nota ojo"><b class="tit">start ≠ enable</b><code>start</code> lo arranca <b>ahora</b>. <code>enable</code> hace que arranque <b>en cada reinicio</b>. Son independientes: lo habitual es <code>systemctl enable --now</code>, que hace las dos cosas.</div>`},

 {t:"opcion", p:"Instalas nginx, haces <code>systemctl start nginx</code> y funciona. Reinicias el servidor y nginx no arranca. ¿Qué faltó?",
  ops:["systemctl restart","systemctl enable nginx","Reinstalar nginx","systemctl reload"],
  ok:1,
  why:"start es para ahora; enable es para cada arranque. Error muy típico."},

 {t:"term", p:"Comprueba el estado del servicio <code>docker</code>",
  prompt:"pablo@servidor:~$",
  sol:["systemctl status docker","sudo systemctl status docker"],
  pista:"systemctl + el verbo de estado + el nombre del servicio.",
  salida:`● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-09-21 08:02:11 UTC; 3h 12min ago
   Main PID: 812 (dockerd)
     Memory: 142.3M
        CPU: 1min 21.004s`,
  why:"«enabled» (arrancará al reiniciar) y «active (running)» (está funcionando ahora). Las dos cosas que miras siempre."},

 {t:"info", eti:"Logs", h:"journalctl",
  c:`<p>systemd guarda los logs de todos los servicios en el <b>journal</b>:</p>
     <div class="termbox">journalctl -u nginx              <span class="cm"># logs de nginx</span>
journalctl -u nginx -f           <span class="cm"># en vivo (como tail -f)</span>
journalctl -u nginx --since "1 hour ago"
journalctl -u nginx -n 100       <span class="cm"># las ultimas 100 lineas</span></div>
     <p>Cuando un servicio no arranca, <code>systemctl status</code> te enseña las últimas líneas y <code>journalctl -u</code> el resto.</p>`},

 {t:"escribe", p:"Escribe el comando que muestra en vivo los logs del servicio <code>mi-api</code>",
  sol:["journalctl -u mi-api -f","journalctl -fu mi-api","journalctl -f -u mi-api","sudo journalctl -u mi-api -f"],
  ph:"journalctl ...",
  pista:"El flag de unidad y el de seguir.",
  why:"journalctl -u mi-api -f. Es el equivalente de docker logs -f para servicios del sistema."},

 {t:"info", eti:"Tu propio servicio", h:"Una unidad de systemd",
  c:`<p>Para que tu aplicación sea un servicio más, se escribe un fichero en <code>/etc/systemd/system/mi-api.service</code>:</p>
     <div class="termbox">[Unit]
Description=API de tareas
After=network.target

[Service]
User=mi-api
WorkingDirectory=/opt/mi-api
ExecStart=/usr/bin/java -jar /opt/mi-api/app.jar
Restart=on-failure
Environment=SPRING_PROFILES_ACTIVE=prod

[Install]
WantedBy=multi-user.target</div>
     <div class="termbox">sudo systemctl daemon-reload        <span class="cm"># que systemd lea el fichero nuevo</span>
sudo systemctl enable --now mi-api</div>
     <p><code>Restart=on-failure</code> hace que systemd lo reinicie si se cae. Y fíjate: corre con un usuario propio, no como root.</p>`},

 {t:"vf", p:"Después de crear o modificar un fichero .service hay que ejecutar <code>systemctl daemon-reload</code>.",
  ok:true,
  why:"Sí, para que systemd vuelva a leer las unidades. Olvidarlo es la causa de muchos «he cambiado la configuración y no hace caso»."}
]},

/* =============== O2 L2 =============== */
{
id:"o2l2",
titulo:"Redes: IPs, puertos y DNS",
claves:["Una IP identifica una máquina; un puerto, un servicio dentro de ella","DNS traduce nombres a IPs","ss -tulpn muestra qué escucha en cada puerto"],
pasos:[
 {t:"info", eti:"Lo básico", h:"IP y puerto",
  c:`<p>Para hablar con un servicio necesitas dos cosas:</p>
     <ul><li>La <b>IP</b> de la máquina: su dirección en la red (<code>192.168.1.20</code>, <code>10.0.3.15</code>).</li>
     <li>El <b>puerto</b>: qué programa de esa máquina (<code>:80</code> nginx, <code>:5432</code> PostgreSQL, <code>:22</code> SSH).</li></ul>
     <p>Una IP es la dirección del edificio; el puerto, el número de la puerta.</p>
     <div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:14px">
     <tr><td style="padding:4px 8px"><b>22</b></td><td style="padding:4px 8px">SSH</td><td style="padding:4px 8px"><b>80 / 443</b></td><td style="padding:4px 8px">HTTP / HTTPS</td></tr>
     <tr><td style="padding:4px 8px"><b>5432</b></td><td style="padding:4px 8px">PostgreSQL</td><td style="padding:4px 8px"><b>3306</b></td><td style="padding:4px 8px">MySQL</td></tr>
     <tr><td style="padding:4px 8px"><b>6379</b></td><td style="padding:4px 8px">Redis</td><td style="padding:4px 8px"><b>53</b></td><td style="padding:4px 8px">DNS</td></tr></table></div>`},

 {t:"par", p:"Empareja cada puerto con su servicio habitual",
  pares:[["22","SSH"],["443","HTTPS"],["5432","PostgreSQL"],["6379","Redis"]],
  why:"Te los preguntarán, y sobre todo los necesitarás para leer reglas de cortafuegos."},

 {t:"info", eti:"Privadas y públicas", h:"No todas las IPs son de internet",
  c:`<p>Hay rangos reservados para redes <b>privadas</b>, que no son accesibles desde internet:</p>
     <div class="termbox">10.0.0.0/8
172.16.0.0/12     <span class="cm">&lt;- las redes de Docker suelen estar aqui</span>
192.168.0.0/16    <span class="cm">&lt;- la red de tu casa</span></div>
     <p>El <code>/16</code> es la notación <b>CIDR</b>: cuántos bits fijan la red. <code>/24</code> son 256 direcciones; <code>/16</code>, 65.536. La verás en todas las redes cloud (VPC, subredes).</p>`},

 {t:"info", eti:"DNS", h:"De nombres a IPs",
  c:`<p>Nadie recuerda IPs. El <b>DNS</b> traduce <code>api.miempresa.com</code> a <code>203.0.113.42</code>. Tipos de registro que debes conocer:</p>
     <ul><li><b>A</b>: nombre → IPv4.</li>
     <li><b>AAAA</b>: nombre → IPv6.</li>
     <li><b>CNAME</b>: nombre → otro nombre (un alias).</li>
     <li><b>MX</b>: servidores de correo.</li>
     <li><b>TXT</b>: texto libre (verificaciones de dominio, SPF).</li></ul>
     <div class="termbox">dig api.miempresa.com        <span class="cm"># o nslookup en Windows</span></div>`},

 {t:"opcion", p:"Quieres que <code>www.miweb.com</code> apunte a lo mismo que <code>miweb.com</code>. ¿Qué registro DNS usas?",
  ops:["MX","CNAME","TXT","AAAA"],
  ok:1,
  why:"CNAME: un alias de otro nombre."},

 {t:"info", eti:"Diagnóstico", h:"Las herramientas de red del día a día",
  c:`<div class="termbox">ping 8.8.8.8                  <span class="cm"># ¿hay conectividad?</span>
curl -I https://miweb.com     <span class="cm"># ¿responde el servicio HTTP? (solo cabeceras)</span>
ss -tulpn                     <span class="cm"># que puertos estan escuchando y que proceso</span>
nc -zv servidor 5432          <span class="cm"># ¿ese puerto esta abierto?</span>
ip a                          <span class="cm"># mis IPs</span></div>
     <p><code>ss -tulpn</code> es el que más vas a usar: <b>t</b>cp, <b>u</b>dp, <b>l</b>istening, <b>p</b>roceso y <b>n</b>umérico.</p>`},

 {t:"term", p:"Averigua qué procesos están escuchando en qué puertos del servidor",
  prompt:"pablo@servidor:~$",
  sol:["ss -tulpn","sudo ss -tulpn","ss -tlnp","sudo ss -tlnp","netstat -tulpn","sudo netstat -tulpn"],
  pista:"ss con las letras tcp, udp, listening, process y numérico.",
  salida:`Netid State  Local Address:Port  Process
tcp   LISTEN 0.0.0.0:22           users:(("sshd",pid=701))
tcp   LISTEN 0.0.0.0:80           users:(("nginx",pid=1204))
tcp   LISTEN 127.0.0.1:5432       users:(("postgres",pid=988))
tcp   LISTEN 0.0.0.0:8080         users:(("java",pid=2310))`,
  why:"Fíjate: PostgreSQL escucha solo en 127.0.0.1 (seguro, solo local). Tu API en 0.0.0.0:8080 está abierta a cualquiera: debería ir detrás de nginx."},

 {t:"vf", p:"Un servicio que escucha en <code>127.0.0.1</code> es accesible desde otras máquinas de la red.",
  ok:false,
  why:"127.0.0.1 es la propia máquina. Solo 0.0.0.0 (o una IP concreta de la red) acepta conexiones de fuera."}
]},

/* =============== O2 L3 =============== */
{
id:"o2l3",
titulo:"SSH a fondo",
claves:["ssh usuario@servidor para conectarte","Claves en ~/.ssh/authorized_keys; desactivar contraseñas","~/.ssh/config para alias; scp para copiar; túneles con -L"],
pasos:[
 {t:"info", eti:"Conectarte", h:"Tu puerta de entrada a los servidores",
  c:`<div class="termbox">ssh pablo@203.0.113.42
ssh -i ~/.ssh/clave_prod pablo@203.0.113.42   <span class="cm"># con una clave concreta</span>
ssh -p 2222 pablo@servidor                    <span class="cm"># puerto distinto del 22</span></div>
     <p>Para entrar con clave en vez de contraseña, tu clave <b>pública</b> tiene que estar en el fichero <code>~/.ssh/authorized_keys</code> del usuario en el servidor. El atajo:</p>
     <div class="termbox">ssh-copy-id pablo@203.0.113.42</div>`},

 {t:"info", eti:"Endurecer", h:"Lo primero en un servidor nuevo",
  c:`<p>En <code>/etc/ssh/sshd_config</code>:</p>
     <div class="termbox">PasswordAuthentication no    <span class="cm"># solo claves: adios a los ataques de fuerza bruta</span>
PermitRootLogin no           <span class="cm"># nadie entra directamente como root</span></div>
     <div class="termbox">sudo systemctl reload ssh</div>
     <div class="nota ojo"><b class="tit">Antes de aplicarlo</b>Comprueba en <b>otra terminal</b> que puedes entrar con tu clave. Si desactivas las contraseñas sin tener la clave funcionando, te quedas fuera de tu propio servidor.</div>`},

 {t:"opcion", p:"Tu servidor recibe miles de intentos de login por SSH al día. ¿Qué es lo más efectivo?",
  ops:["Cambiar la contraseña cada día",
       "Desactivar la autenticación por contraseña y permitir solo claves (y no dejar entrar a root)",
       "Apagar el servidor por la noche",
       "Usar una contraseña más larga"],
  ok:1,
  why:"Sin contraseñas, la fuerza bruta no tiene nada que adivinar. Se complementa con fail2ban."},

 {t:"info", eti:"Comodidad", h:"El fichero ~/.ssh/config",
  c:`<div class="termbox"><span class="cm"># ~/.ssh/config (en TU ordenador)</span>
Host prod
    HostName 203.0.113.42
    User pablo
    IdentityFile ~/.ssh/clave_prod
    Port 22</div>
     <p>Ahora basta con <code>ssh prod</code>. Y lo mismo funciona con <code>scp</code>, <code>git</code> y <code>docker context</code>.</p>`},

 {t:"info", eti:"Copiar y túneles", h:"scp y ssh -L",
  c:`<div class="termbox"><span class="cm"># copiar un fichero a/desde el servidor</span>
scp backup.sql prod:/tmp/
scp prod:/var/log/nginx/error.log .

<span class="cm"># TUNEL: traer el Postgres del servidor (solo local alli) a tu puerto 5433</span>
ssh -L 5433:localhost:5432 prod</div>
     <p>El túnel es la forma correcta de acceder a una base de datos que <b>no está expuesta</b> a internet: te conectas con tu cliente a <code>localhost:5433</code> y el tráfico viaja cifrado por SSH.</p>`},

 {t:"opcion", p:"Necesitas consultar la base de datos de producción, que escucha solo en 127.0.0.1 del servidor. ¿Qué haces?",
  ops:["Abro el 5432 al mundo un momento",
       "Un túnel SSH: ssh -L 5433:localhost:5432 servidor, y me conecto a localhost:5433",
       "Copio la base de datos entera a mi portátil",
       "Cambio Postgres para que escuche en 0.0.0.0"],
  ok:1,
  why:"Nunca abras la base de datos. El túnel SSH te da acceso cifrado y temporal."},

 {t:"escribe", p:"Escribe el comando que copia tu clave pública al servidor <code>pablo@203.0.113.42</code>",
  sol:["ssh-copy-id pablo@203.0.113.42"],
  ph:"ssh-copy-id ...",
  pista:"El comando es literalmente «ssh, copiar, id».",
  why:"ssh-copy-id añade tu clave pública a authorized_keys con los permisos correctos."}
]},

/* =============== O2 L4 =============== */
{
id:"o2l4",
titulo:"Scripts de bash para automatizar",
claves:["#!/bin/bash y chmod +x para que sea ejecutable","set -euo pipefail: que falle en cuanto algo falle","$? es el código de salida: 0 bien, otro número error"],
pasos:[
 {t:"info", eti:"Por qué", h:"Lo que haces dos veces, se automatiza",
  c:`<p>Un <b>script de bash</b> es un fichero con comandos que se ejecutan en orden. Es la automatización más básica de DevOps: backups, despliegues sencillos, comprobaciones...</p>
     <div class="termbox"><span class="cm">#!/bin/bash</span>
set -euo pipefail

FECHA=$(date +%F)
DESTINO="/backups/tareas-$FECHA.sql"

echo "Haciendo backup en $DESTINO"
docker compose exec -T db pg_dump -U tareas_user tareas > "$DESTINO"
echo "Backup terminado: $(du -h "$DESTINO" | cut -f1)"</div>`},

 {t:"info", eti:"Línea a línea", h:"Las piezas del script",
  c:`<ul><li><code>#!/bin/bash</code> — el <b>shebang</b>: indica qué intérprete ejecuta el fichero. Siempre la primera línea.</li>
     <li><code>set -euo pipefail</code> — el modo estricto (lo vemos ahora).</li>
     <li><code>FECHA=$(date +%F)</code> — una <b>variable</b> con el resultado de un comando. Sin espacios alrededor del <code>=</code>.</li>
     <li><code>"$DESTINO"</code> — usar una variable, <b>siempre entre comillas</b> (por si tiene espacios).</li></ul>
     <p>Para ejecutarlo: <code>chmod +x backup.sh</code> y luego <code>./backup.sh</code>.</p>`},

 {t:"opcion", p:"¿Qué hay mal en <code>FECHA = $(date +%F)</code>?",
  ops:["Nada",
       "Los espacios alrededor del =: en bash, la asignación va pegada, FECHA=$(date +%F)",
       "Falta un punto y coma",
       "date no existe"],
  ok:1,
  why:"Con espacios, bash intenta ejecutar un programa llamado FECHA. Error clásico de quien viene de otros lenguajes."},

 {t:"info", eti:"El modo estricto", h:"set -euo pipefail",
  c:`<p>Por defecto, si un comando de un script falla, bash <b>sigue como si nada</b>. En un script de despliegue eso es un peligro: falla la descarga, pero el script sigue y reinicia el servicio con un fichero vacío.</p>
     <ul><li><code>-e</code>: si un comando falla, el script <b>se para</b>.</li>
     <li><code>-u</code>: usar una variable no definida es un error (evita un <code>rm -rf $DIR/</code> con DIR vacía...).</li>
     <li><code>-o pipefail</code>: en una tubería <code>a | b</code>, si falla <code>a</code>, la tubería entera cuenta como fallida.</li></ul>`},

 {t:"opcion", p:"¿Por qué es peligroso un script con <code>rm -rf \"$DIR\"/*</code> sin <code>set -u</code>?",
  ops:["No es peligroso",
       "Si DIR no está definida, queda rm -rf /* y borra el sistema entero",
       "Porque es lento",
       "Porque necesita sudo"],
  ok:1,
  why:"Este fallo ha borrado servidores reales. set -u hace que el script se pare antes."},

 {t:"info", eti:"Códigos de salida", h:"$? y los condicionales",
  c:`<p>Todo comando termina con un <b>código de salida</b>: <b>0 = bien</b>, cualquier otro número = error (igual que los contenedores con <code>Exited (1)</code>).</p>
     <div class="termbox">curl -sf http://localhost:8080/actuator/health
echo $?                   <span class="cm"># 0 si respondio bien</span>

if curl -sf http://localhost:8080/actuator/health > /dev/null; then
  echo "API sana"
else
  echo "API caida" >&2
  exit 1
fi

for svc in nginx docker ssh; do
  systemctl is-active --quiet "$svc" || echo "$svc no esta activo"
done</div>`},

 {t:"par", p:"Empareja cada elemento de bash con su significado",
  pares:[["#!/bin/bash","Indica el intérprete del script"],
         ["$?","Código de salida del último comando"],
         ["set -e","Parar el script si un comando falla"],
         ["$(comando)","Sustituir por la salida del comando"],
         ["exit 1","Terminar el script indicando error"]],
  why:"Con esto puedes leer y escribir la mayoría de scripts de operaciones."},

 {t:"vf", p:"En bash, un código de salida 0 significa que el comando ha fallado.",
  ok:false,
  why:"Al revés: 0 es éxito. Cualquier otro valor es error. Los pipelines de CI usan exactamente esto para decidir si un paso pasa o falla."}
]},

/* =============== O2 L5 =============== */
{
id:"o2l5",
titulo:"Logs y disco lleno",
claves:["tail -f para seguir un log; grep para filtrar","df -h para el espacio por disco; du -sh para carpetas","logrotate evita que los logs llenen el disco"],
pasos:[
 {t:"info", eti:"Leer logs", h:"tail, grep y less",
  c:`<div class="termbox">tail -f /var/log/nginx/access.log          <span class="cm"># en vivo</span>
tail -n 200 /var/log/nginx/error.log       <span class="cm"># ultimas 200 lineas</span>
grep " 500 " /var/log/nginx/access.log     <span class="cm"># solo errores 500</span>
grep -c " 500 " access.log                 <span class="cm"># cuantos hay</span>
grep -i "timeout" error.log | tail -20     <span class="cm"># sin distinguir mayusculas</span>
less error.log                             <span class="cm"># navegar (q para salir, / para buscar)</span></div>`},

 {t:"escribe", p:"Escribe el comando que muestra en vivo las nuevas líneas de <code>/var/log/nginx/error.log</code>",
  sol:["tail -f /var/log/nginx/error.log","sudo tail -f /var/log/nginx/error.log"],
  ph:"tail ...",
  pista:"tail con el flag de «follow».",
  why:"tail -f. Lo tendrás abierto en una ventana mientras reproduces un fallo."},

 {t:"info", eti:"El incidente clásico", h:"«No space left on device»",
  c:`<p>Uno de los incidentes más habituales: el disco se llena y todo empieza a fallar de formas raras (la base de datos no escribe, la aplicación no arranca).</p>
     <div class="termbox">df -h                          <span class="cm"># espacio de cada disco</span>
<span class="cm">Filesystem  Size  Used Avail Use% Mounted on
/dev/sda1    40G   39G  1.0G  98% /</span>

sudo du -sh /var/* | sort -h    <span class="cm"># que carpeta ocupa mas</span>
sudo du -sh /var/lib/docker     <span class="cm"># sospechoso habitual</span></div>
     <p>Los culpables de siempre: <b>logs sin rotar</b>, <b>imágenes y caché de Docker</b> viejas, y backups que nadie borra.</p>`},

 {t:"opcion", p:"¿Qué comando te dice cuánto espacio libre queda en cada disco?",
  ops:["du -sh","df -h","ls -la","free -h"],
  ok:1,
  why:"df = disk free (por sistema de ficheros). du = disk usage (de carpetas concretas). free = memoria RAM."},

 {t:"par", p:"Empareja cada comando con lo que mide",
  pares:[["df -h","Espacio libre por disco"],
         ["du -sh carpeta","Cuánto ocupa una carpeta"],
         ["free -h","Memoria RAM usada y libre"],
         ["docker system df","Cuánto ocupa Docker"]],
  why:"Los cuatro primeros comandos cuando salta una alerta de disco o memoria."},

 {t:"info", eti:"Prevención", h:"logrotate",
  c:`<p><b>logrotate</b> rota los ficheros de log automáticamente: cada día o cada cierto tamaño, renombra el actual, lo comprime y borra los muy antiguos.</p>
     <div class="termbox"><span class="cm"># /etc/logrotate.d/mi-api</span>
/var/log/mi-api/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
}</div>
     <p>Y para los contenedores, ya lo viste: <code>max-size</code> y <code>max-file</code> en el driver de logs.</p>`},

 {t:"vf", p:"Borrar un fichero de log que un proceso está escribiendo libera siempre el espacio al instante.",
  ok:false,
  why:"Si el proceso lo mantiene abierto, el espacio no se libera hasta que lo reinicias. Por eso se vacía con truncate -s 0 fichero, o se usa logrotate con copytruncate."}
]},

/* =============== O2 L6 =============== */
{
id:"o2l6",
titulo:"Usuarios, sudo y cortafuegos",
claves:["Trabaja con tu usuario y usa sudo solo cuando haga falta","Cada servicio con su propio usuario sin privilegios","ufw: denegar todo lo entrante y abrir solo lo necesario"],
pasos:[
 {t:"info", eti:"Principio", h:"Mínimo privilegio también en el servidor",
  c:`<ul><li>No trabajes como <b>root</b>. Tu usuario normal, y <code>sudo</code> para lo que lo necesite: queda registrado quién hizo qué.</li>
     <li>Cada servicio con <b>su propio usuario</b> sin privilegios (<code>mi-api</code>, <code>postgres</code>, <code>www-data</code>). Si comprometen tu API, el atacante no es root.</li></ul>
     <div class="termbox">sudo adduser pablo
sudo usermod -aG sudo pablo            <span class="cm"># darle sudo</span>
sudo useradd --system --no-create-home mi-api   <span class="cm"># usuario de servicio</span></div>`},

 {t:"opcion", p:"¿Con qué usuario debería ejecutarse tu aplicación Java en el servidor?",
  ops:["root, para que no tenga problemas de permisos",
       "Un usuario de sistema propio y sin privilegios, dueño solo de lo que necesita",
       "El tuyo personal",
       "Da igual"],
  ok:1,
  why:"El mismo principio que USER en el Dockerfile: si algo sale mal, el daño queda acotado."},

 {t:"info", eti:"Cortafuegos", h:"ufw: el cortafuegos sencillo de Ubuntu",
  c:`<div class="termbox">sudo ufw default deny incoming     <span class="cm"># por defecto, nada entra</span>
sudo ufw default allow outgoing    <span class="cm"># todo puede salir</span>
sudo ufw allow OpenSSH             <span class="cm"># ANTES de activarlo: no te quedes fuera</span>
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose</div>
     <p>Resultado: solo SSH, HTTP y HTTPS son accesibles. La base de datos, Redis o tu API interna quedan cerradas al exterior.</p>
     <div class="nota ojo"><b class="tit">Recuerda lo de Docker</b>Docker escribe sus propias reglas y puede saltarse ufw para los puertos que publiques con <code>-p</code>. Publica solo lo imprescindible, o en <code>127.0.0.1</code>.</div>`},

 {t:"orden", p:"Ordena la configuración segura de ufw en un servidor nuevo",
  items:["sudo ufw default deny incoming","sudo ufw default allow outgoing","sudo ufw allow OpenSSH","sudo ufw allow 443/tcp","sudo ufw enable"],
  why:"Permitir SSH antes de activar el cortafuegos. Si lo haces al revés, te quedas fuera de tu servidor."},

 {t:"vf", p:"Es seguro ejecutar <code>sudo ufw enable</code> antes de permitir SSH si estás conectado por SSH.",
  ok:false,
  why:"Te cortaría la conexión y no podrías volver a entrar. Primero allow OpenSSH, luego enable."},

 {t:"info", eti:"Checklist", h:"Endurecer un servidor nuevo en diez minutos",
  c:`<ul><li>Actualizar: <code>sudo apt update && sudo apt upgrade</code>, y activar actualizaciones de seguridad automáticas (<i>unattended-upgrades</i>).</li>
     <li>Usuario propio con sudo; entrar con clave SSH.</li>
     <li>SSH: sin contraseñas y sin root.</li>
     <li>Cortafuegos: denegar todo y abrir solo lo necesario.</li>
     <li><b>fail2ban</b>: bloquea IPs que fallan el login repetidamente.</li>
     <li>Servicios con usuarios propios y sin privilegios.</li></ul>
     <p>Si te preguntan «¿qué harías al recibir un servidor nuevo?», esta lista es la respuesta.</p>`}
]}

]});
