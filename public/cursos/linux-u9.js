window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Redes en Linux",
resumen: "Interfaces e IPs, puertos y sockets, DNS, curl a fondo, SSH avanzado, cortafuegos y captura de tráfico",
nivel: "Avanzado",
color: "#c98a1c",
lecciones: [

{
id:"lx9l1",
titulo:"Interfaces, IPs y rutas",
claves:["ip a muestra interfaces e IPs; ip r la tabla de rutas","lo es la interfaz local 127.0.0.1","La ruta por defecto (default via) es la puerta de salida a internet"],
pasos:[
 {t:"info", eti:"El comando ip", h:"Ver la red de la máquina",
  c:`<div class="termbox">ip a                <span class="cm"># interfaces y direcciones (antes: ifconfig)</span>
<span class="cm">1: lo: inet 127.0.0.1/8
2: eth0: inet 10.0.1.25/24
3: docker0: inet 172.17.0.1/16</span>

ip r                <span class="cm"># tabla de rutas</span>
<span class="cm">default via 10.0.1.1 dev eth0
10.0.1.0/24 dev eth0 proto kernel
172.17.0.0/16 dev docker0</span></div>
     <ul><li><b>lo</b>: loopback, la propia máquina (127.0.0.1).</li>
     <li><b>eth0</b> (o <code>ens5</code>, <code>enp0s3</code>): la tarjeta de red real.</li>
     <li><b>docker0</b>: el puente que crea Docker para sus contenedores.</li></ul>`},
 {t:"par", p:"Empareja cada elemento con su significado",
  pares:[["lo","La interfaz local, 127.0.0.1"],["eth0 / ens5","La tarjeta de red real"],["docker0","El puente de red de Docker"],["default via 10.0.1.1","La puerta de enlace para salir a otras redes"]],
  why:"Sin ruta por defecto, la máquina solo alcanza su propia red local."},
 {t:"opcion", p:"<code>ip r</code> no muestra ninguna línea <code>default via</code>. ¿Qué pasará?",
  ops:["Nada, es normal","La máquina no podrá salir a internet ni a otras redes, solo a la suya","Se desactiva el DNS","Se cae SSH en local"],
  ok:1, why:"Sin puerta de enlace por defecto, no sabe a dónde enviar el tráfico hacia fuera."},
 {t:"term", p:"Muestra las direcciones IP de todas las interfaces", prompt:"pablo@servidor:~$",
  sol:["ip a","ip addr","ip address","ip addr show","ip -br a"], pista:"ip con la palabra address abreviada.",
  salida:`1: lo: <LOOPBACK,UP> inet 127.0.0.1/8 scope host lo
2: ens5: <BROADCAST,MULTICAST,UP> inet 10.0.1.25/24 brd 10.0.1.255 scope global ens5`,
  why:"ip -br a (brief) da un resumen de una línea por interfaz: muy cómodo."},
 {t:"vf", p:"<code>ifconfig</code> y <code>netstat</code> son las herramientas modernas recomendadas.",
  ok:false, why:"Están obsoletas (paquete net-tools). Las modernas son ip y ss. Aún se ven mucho, así que conviene reconocerlas."}
]},

{
id:"lx9l2",
titulo:"Puertos y sockets: ss y nc",
claves:["ss -tulpn: qué escucha, en qué puerto y qué proceso","0.0.0.0 acepta desde fuera; 127.0.0.1 solo local","nc -zv comprueba si un puerto remoto está abierto"],
pasos:[
 {t:"info", eti:"Quién escucha", h:"ss -tulpn",
  c:`<div class="termbox">sudo ss -tulpn
<span class="cm">Netid State  Local Address:Port   Process
tcp   LISTEN 0.0.0.0:22            sshd
tcp   LISTEN 127.0.0.1:5432        postgres
tcp   LISTEN 0.0.0.0:443           nginx
tcp   LISTEN [::]:8080             java</span></div>
     <p>t TCP, u UDP, l escuchando, p proceso, n números (no nombres). Y fíjate en la dirección:</p>
     <ul><li><b>0.0.0.0</b> o <b>[::]</b>: escucha en todas las interfaces, accesible desde fuera.</li>
     <li><b>127.0.0.1</b>: solo desde la propia máquina.</li></ul>`},
 {t:"opcion", p:"Tu API escucha en <code>127.0.0.1:8080</code> y desde otra máquina no puedes conectarte. ¿Por qué?",
  ops:["El cortafuegos","Porque solo acepta conexiones locales: tendría que escuchar en 0.0.0.0 (o estar detrás de un proxy local)","Porque el puerto 8080 está prohibido","Porque falta DNS"],
  ok:1, why:"Es el mismo error que en Docker cuando una app escucha en localhost dentro del contenedor."},
 {t:"info", eti:"Probar conexiones", h:"nc, curl y telnet",
  c:`<div class="termbox">nc -zv db.interna 5432         <span class="cm"># ¿esta abierto el puerto? (sin enviar datos)</span>
nc -l 9000                     <span class="cm"># escuchar en un puerto (para pruebas)</span>
curl -v telnet://db:5432       <span class="cm"># truco cuando no hay nc</span>
timeout 3 bash -c '&lt;/dev/tcp/db/5432' && echo abierto   <span class="cm"># solo con bash</span></div>`},
 {t:"term", p:"Comprueba si el puerto 5432 del host <code>db</code> acepta conexiones, sin enviar datos", prompt:"pablo@servidor:~$",
  sol:["nc -zv db 5432","nc -vz db 5432","nc -z -v db 5432"], pista:"nc con -z (sin datos) y -v (detallado).",
  salida:`Connection to db (10.0.2.14) 5432 port [tcp/postgresql] succeeded!`,
  why:"Si dijera «Connection refused», el puerto está cerrado en ese host; si se queda colgado, probablemente un cortafuegos descarta el tráfico."},
 {t:"par", p:"Empareja cada resultado de una conexión con su causa probable",
  pares:[["Connection refused","El host responde pero nada escucha en ese puerto"],["Se queda colgado (timeout)","Un cortafuegos descarta los paquetes"],["Name or service not known","Fallo de DNS: no se resuelve el nombre"],["No route to host","Problema de enrutamiento o host apagado"]],
  why:"Distinguir estos cuatro errores es la mitad del diagnóstico de red."},
 {t:"vf", p:"«Connection refused» y «timeout» significan lo mismo.",
  ok:false, why:"Refused es una respuesta rápida: el host existe pero el puerto está cerrado. Timeout es silencio: algo (casi siempre un cortafuegos) se come los paquetes."}
]},

{
id:"lx9l3",
titulo:"DNS y curl a fondo",
claves:["/etc/hosts se consulta antes que el DNS; /etc/resolv.conf dice qué servidor DNS usar","dig y nslookup consultan el DNS","curl -v, -I, -X, -H, -d, -o y -w para probar APIs"],
pasos:[
 {t:"info", eti:"Resolución de nombres", h:"Cómo encuentra Linux la IP de un nombre",
  c:`<ol><li>Mira <code>/etc/hosts</code> (entradas fijas escritas a mano).</li>
     <li>Si no está, pregunta al servidor DNS indicado en <code>/etc/resolv.conf</code>.</li></ol>
     <div class="termbox">cat /etc/hosts
<span class="cm">127.0.0.1   localhost
10.0.2.14   db.interna</span>

dig api.miempresa.com +short        <span class="cm"># la IP</span>
dig api.miempresa.com MX            <span class="cm"># otro tipo de registro</span>
dig @8.8.8.8 api.miempresa.com      <span class="cm"># preguntar a un DNS concreto</span>
getent hosts db.interna             <span class="cm"># como lo resuelve el sistema (incluye /etc/hosts)</span></div>`},
 {t:"opcion", p:"<code>dig api.local</code> no devuelve nada, pero <code>ping api.local</code> funciona. ¿Por qué?",
  ops:["dig está roto","api.local está en /etc/hosts: ping usa la resolución del sistema, dig pregunta solo al servidor DNS","ping usa otro puerto","El DNS está caído"],
  ok:1, why:"dig habla directamente con el DNS. getent hosts muestra lo que ven realmente las aplicaciones."},
 {t:"info", eti:"curl", h:"La navaja suiza de HTTP",
  c:`<div class="termbox">curl -I https://api.com                      <span class="cm"># solo cabeceras</span>
curl -v https://api.com                      <span class="cm"># todo el detalle: DNS, TLS, cabeceras</span>
curl -X POST -H "Content-Type: application/json" \\
     -d '{"titulo":"x"}' https://api.com/tareas <span class="cm"># POST con JSON</span>
curl -H "Authorization: Bearer $TOKEN" https://api.com/yo
curl -sf https://api.com/health || echo caida   <span class="cm"># -f: falla si HTTP >= 400</span>
curl -o fichero.zip -L https://url            <span class="cm"># guardar, siguiendo redirecciones</span>
curl -w "%{http_code} %{time_total}s\\n" -o /dev/null -s https://api.com   <span class="cm"># codigo y tiempo</span></div>`},
 {t:"par", p:"Empareja cada opción de curl con su efecto",
  pares:[["-I","Pedir solo las cabeceras"],["-v","Mostrar todo el detalle de la conexión"],["-X POST","Cambiar el método HTTP"],["-H","Añadir una cabecera"],["-f","Devolver error si el código HTTP es 400 o más"],["-L","Seguir redirecciones"]],
  why:"curl -sf es la base de los healthchecks en scripts y Dockerfiles."},
 {t:"term", p:"Pide solo las cabeceras de <code>https://example.com</code>", prompt:"pablo@servidor:~$",
  sol:["curl -I https://example.com","curl --head https://example.com","curl -si https://example.com"], pista:"curl con la i mayúscula.",
  salida:`HTTP/2 200
content-type: text/html; charset=UTF-8
cache-control: max-age=604800`, why:"Útil para comprobar redirecciones, caché o si el servidor responde sin descargar el cuerpo."},
 {t:"vf", p:"Un cambio en <code>/etc/hosts</code> tiene prioridad sobre el DNS en la mayoría de configuraciones.",
  ok:true, why:"El orden lo marca /etc/nsswitch.conf, normalmente «files dns»: primero el fichero, luego el DNS. Muy útil para pruebas."}
]},

{
id:"lx9l4",
titulo:"SSH avanzado",
claves:["~/.ssh/config con alias, ProxyJump y claves por host","Túneles: -L local, -R remoto, -D proxy SOCKS","scp y rsync para copiar; rsync solo envía lo que cambia"],
pasos:[
 {t:"info", eti:"Configuración", h:"~/.ssh/config",
  c:`<div class="termbox">Host bastion
    HostName 203.0.113.10
    User pablo
    IdentityFile ~/.ssh/id_ed25519

Host db-prod
    HostName 10.0.2.14
    User admin
    ProxyJump bastion          <span class="cm"># saltar a traves del bastion</span>

Host *
    ServerAliveInterval 30     <span class="cm"># evitar que se corte por inactividad</span></div>
     <p>Con esto, <code>ssh db-prod</code> entra a una máquina interna pasando por el bastión, sin comandos largos.</p>`},
 {t:"opcion", p:"¿Para qué sirve <code>ProxyJump</code>?",
  ops:["Para acelerar SSH","Para llegar a una máquina interna pasando por un servidor intermedio (bastión)","Para cifrar la clave","Para usar un proxy web"],
  ok:1, why:"Es el patrón estándar: solo el bastión es accesible desde internet; el resto se alcanza a través de él."},
 {t:"info", eti:"Túneles", h:"Llevar puertos de un lado a otro",
  c:`<div class="termbox"><span class="cm"># -L: traer un puerto remoto a tu maquina</span>
ssh -L 5433:localhost:5432 db-prod      <span class="cm"># tu localhost:5433 -> Postgres del servidor</span>

<span class="cm"># -R: exponer un puerto tuyo en el servidor</span>
ssh -R 9000:localhost:3000 servidor     <span class="cm"># el servidor:9000 -> tu app local</span>

<span class="cm"># -D: proxy SOCKS para navegar a traves del servidor</span>
ssh -D 1080 bastion

ssh -N -f -L ...      <span class="cm"># sin shell (-N) y en segundo plano (-f)</span></div>`},
 {t:"par", p:"Empareja cada túnel con su uso",
  pares:[["-L","Acceder desde tu máquina a un servicio remoto no expuesto"],["-R","Hacer accesible en el servidor un servicio de tu máquina"],["-D","Crear un proxy SOCKS a través del servidor"]],
  why:"-L es el que más usarás: para consultar bases de datos privadas de forma segura."},
 {t:"info", eti:"Copiar", h:"scp y rsync",
  c:`<div class="termbox">scp app.jar servidor:/opt/api/                 <span class="cm"># copia simple</span>
rsync -avz --progress ./dist/ servidor:/var/www/   <span class="cm"># sincroniza: solo envia lo que cambio</span>
rsync -avz --delete ./dist/ servidor:/var/www/     <span class="cm"># y borra alli lo que ya no existe aqui</span></div>
     <p>La barra final en el origen importa en rsync: <code>dist/</code> copia el <b>contenido</b>; <code>dist</code> copia la carpeta en sí.</p>`},
 {t:"vf", p:"<code>rsync</code> vuelve a enviar todos los ficheros cada vez, igual que scp.",
  ok:false, why:"Compara y envía solo las diferencias. En despliegues y backups repetidos ahorra muchísimo tiempo."},
 {t:"escribe", p:"Escribe el comando que abre un túnel para acceder a tu puerto local 5433 al Postgres (5432) del host <code>db-prod</code>",
  sol:["ssh -L 5433:localhost:5432 db-prod","ssh -l 5433:localhost:5432 db-prod","ssh -N -L 5433:localhost:5432 db-prod","ssh -L 5433:127.0.0.1:5432 db-prod"], ph:"ssh -L ...",
  pista:"ssh -L puerto_local:destino:puerto_remoto host.", why:"ssh -L 5433:localhost:5432 db-prod. Luego te conectas a localhost:5433."}
]},

{
id:"lx9l5",
titulo:"Cortafuegos y captura de tráfico",
claves:["nftables es el cortafuegos moderno del kernel; ufw y firewalld lo simplifican","Política por defecto: denegar entrante, permitir saliente","tcpdump captura paquetes para ver qué pasa de verdad en la red"],
pasos:[
 {t:"info", eti:"El cortafuegos", h:"netfilter, iptables, nftables, ufw y firewalld",
  c:`<p>El filtrado de paquetes lo hace el kernel (<b>netfilter</b>). Se configura con:</p>
     <ul><li><b>iptables</b>: la herramienta clásica (la que usa Docker).</li>
     <li><b>nftables</b> (<code>nft</code>): su sucesora moderna.</li>
     <li><b>ufw</b> (Ubuntu) y <b>firewalld</b> (Red Hat): capas sencillas por encima.</li></ul>
     <div class="termbox">sudo ufw default deny incoming
sudo ufw allow OpenSSH
sudo ufw allow from 10.0.0.0/16 to any port 5432   <span class="cm"># Postgres solo desde la red interna</span>
sudo ufw enable
sudo firewall-cmd --add-service=https --permanent && sudo firewall-cmd --reload   <span class="cm"># en Red Hat</span></div>`},
 {t:"opcion", p:"Quieres que PostgreSQL solo acepte conexiones desde la red interna 10.0.0.0/16. ¿Qué regla de ufw usas?",
  ops:["ufw allow 5432","ufw allow from 10.0.0.0/16 to any port 5432","ufw deny 5432","ufw allow from any to 10.0.0.0/16"],
  ok:1, why:"Origen restringido y puerto concreto. Mínimo privilegio aplicado a la red."},
 {t:"info", eti:"Ver los paquetes", h:"tcpdump",
  c:`<div class="termbox">sudo tcpdump -i eth0 port 5432           <span class="cm"># trafico con Postgres</span>
sudo tcpdump -i any host 10.0.2.14         <span class="cm"># todo lo de un host</span>
sudo tcpdump -i eth0 -n 'tcp[tcpflags] &amp; tcp-syn != 0'   <span class="cm"># solo intentos de conexion</span>
sudo tcpdump -i eth0 -w captura.pcap       <span class="cm"># guardar para abrir en Wireshark</span></div>
     <p>Cuando nadie se pone de acuerdo sobre si «la petición llega», tcpdump en el servidor zanja la discusión: o los paquetes llegan, o no.</p>`},
 {t:"par", p:"Empareja cada herramienta con su papel",
  pares:[["netfilter","El filtrado de paquetes dentro del kernel"],["nftables","La interfaz moderna para configurarlo"],["ufw","Capa sencilla en Ubuntu"],["tcpdump","Captura y muestra el tráfico real"]],
  why:"Docker manipula iptables directamente, y por eso puede saltarse reglas de ufw: recuérdalo al publicar puertos."},
 {t:"vf", p:"Con ufw configurado para denegar el 8080, un contenedor Docker publicado con <code>-p 8080:8080</code> nunca será accesible desde fuera.",
  ok:false, why:"Docker inserta sus propias reglas de iptables antes que las de ufw, y el puerto queda abierto. Hay que publicar en 127.0.0.1 o usar la cadena DOCKER-USER."},
 {t:"escribe", p:"Escribe el comando que captura el tráfico del puerto 443 en la interfaz eth0",
  sol:["sudo tcpdump -i eth0 port 443","tcpdump -i eth0 port 443","sudo tcpdump -i eth0 tcp port 443","sudo tcpdump port 443 -i eth0"], ph:"sudo tcpdump ...",
  pista:"tcpdump, -i con la interfaz y el filtro port.", why:"sudo tcpdump -i eth0 port 443."}
]}

]});
