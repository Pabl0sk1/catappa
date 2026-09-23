window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Diagnóstico de red",
resumen: "Método por capas y las herramientas: ping, traceroute, mtr, ss, nc, curl, dig y tcpdump",
nivel: "Avanzado",
color: "#3094bb",
lecciones: [

{
id:"rd9l1",
titulo:"Método por capas",
claves:["Subir de capa en capa: interfaz, IP y ruta, DNS, puerto, aplicación","Cada comprobación descarta una causa","Probar desde el mismo sitio que falla (el pod, el contenedor, el servidor)"],
pasos:[
 {t:"info", eti:"No adivinar", h:"El método",
  c:`<p>«La API no conecta con la base de datos». En lugar de cambiar cosas al azar, recorre las capas desde el origen:</p>
     <div class="dg"><div class="dg-tit">diagnóstico de abajo arriba</div><div class="dg-vert">
     <div class="dg-caja">1. ¿Tengo red?<small><code>ip addr</code>, <code>ip route</code></small></div>
     <div class="dg-caja">2. ¿Llego a la máquina?<small><code>ping</code> (si ICMP está permitido), <code>traceroute</code></small></div>
     <div class="dg-caja">3. ¿Resuelve el nombre?<small><code>dig</code> / <code>nslookup</code> / <code>getent hosts</code></small></div>
     <div class="dg-caja">4. ¿El puerto está abierto?<small><code>nc -vz host puerto</code>, o <code>curl</code></small></div>
     <div class="dg-caja">5. ¿Responde la aplicación?<small><code>curl -v</code>, logs del servicio</small></div>
     <div class="dg-caja">6. ¿Y en el destino?<small><code>ss -tlnp</code> (¿escucha? ¿en qué IP?), cortafuegos</small></div>
     </div></div>
     <p>Y hazlo <b>desde el mismo lugar</b> que falla: si falla un pod, prueba desde ese pod (o uno igual en el mismo namespace y nodo).</p>`},
 {t:"orden", p:"Ordena las comprobaciones de abajo arriba",
  items:["¿La máquina tiene IP y ruta por defecto?","¿Resuelve el nombre del destino?","¿Se alcanza el puerto (nc -vz)?","¿La aplicación responde correctamente (curl -v)?"],
  why:"Si el nombre no resuelve, no tiene sentido mirar el puerto ni la aplicación."},
 {t:"opcion", p:"<code>dig db.interna</code> funciona, <code>nc -vz db.interna 5432</code> da timeout. ¿Dónde está el problema?",
  ops:["En el DNS","En la red o el filtrado: cortafuegos, grupos de seguridad, NetworkPolicy o rutas","En la aplicación","En el certificado"],
  ok:1, why:"DNS está descartado; el timeout apunta a paquetes descartados por el camino."},
 {t:"vf", p:"Si <code>ping</code> a un servidor no responde, seguro que el servidor está caído.",
  ok:false, why:"Muchas redes bloquean ICMP (ping). Comprueba el puerto real con nc o curl antes de concluir nada."}
]},

{
id:"rd9l2",
titulo:"ping, traceroute y mtr",
claves:["ping mide si hay respuesta y la latencia (ICMP)","traceroute muestra los saltos hasta el destino","mtr combina ambos y muestra pérdidas por salto"],
pasos:[
 {t:"info", eti:"ICMP", h:"ping",
  c:`<div class="termbox">pablo@servidor:~$ ping -c 4 10.0.21.5
64 bytes from 10.0.21.5: icmp_seq=1 ttl=63 time=0.82 ms
64 bytes from 10.0.21.5: icmp_seq=2 ttl=63 time=0.79 ms
--- 10.0.21.5 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
rtt min/avg/max = 0.77/0.80/0.82 ms</div>
     <p>Da <b>latencia</b> (rtt, ida y vuelta) y <b>pérdida</b> de paquetes. <code>-c 4</code> envía solo 4 (en Linux, sin -c no para).</p>`},
 {t:"info", eti:"El camino", h:"traceroute y mtr",
  c:`<div class="termbox">pablo@servidor:~$ traceroute api.externa.com
 1  10.0.0.1       0.4 ms
 2  100.64.3.1     1.2 ms
 3  * * *
 4  72.14.215.85   9.8 ms
 5  api.externa.com  10.3 ms</div>
     <p>Cada línea es un router del camino. <code>* * *</code> significa que ese salto no responde a las sondas (habitual, no siempre es un problema). <b>mtr</b> repite la prueba continuamente y muestra la pérdida en cada salto: si la pérdida empieza en un salto y <b>continúa hasta el final</b>, el problema está ahí.</p>`},
 {t:"term", p:"Envía exactamente 3 pings a <code>8.8.8.8</code>",
  prompt:"pablo@servidor:~$", sol:["ping -c 3 8.8.8.8","ping -c3 8.8.8.8","ping 8.8.8.8 -c 3"],
  pista:"ping con -c y el número de paquetes.",
  salida:`64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.1 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=11.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=12.0 ms
3 packets transmitted, 3 received, 0% packet loss`, why:"Si pings a una IP funcionan pero a un nombre no, el problema es DNS."},
 {t:"par", p:"Empareja cada herramienta con lo que responde",
  pares:[["ping","¿Responde y con qué latencia?"],["traceroute","¿Por qué routers pasa?"],["mtr","¿En qué salto se pierden paquetes?"],["dig","¿A qué IP resuelve el nombre?"]],
  why:"En Windows los equivalentes son ping, tracert y pathping."},
 {t:"vf", p:"Un salto intermedio con <code>* * *</code> en traceroute indica siempre que el tráfico se pierde ahí.",
  ok:false, why:"Muchos routers no responden a las sondas pero reenvían el tráfico sin problemas. Lo que importa es si el destino final responde."}
]},

{
id:"rd9l3",
titulo:"Puertos y conexiones: nc, ss y curl",
claves:["nc -vz host puerto comprueba si un puerto TCP acepta conexiones","ss muestra sockets en escucha y conexiones activas","curl -v y -w para medir cada fase de una petición HTTP"],
pasos:[
 {t:"info", eti:"¿Está abierto?", h:"nc (netcat)",
  c:`<div class="termbox">pablo@servidor:~$ nc -vz db.interna 5432
Connection to db.interna 5432 port [tcp/postgresql] succeeded!

pablo@servidor:~$ nc -vz db.interna 5433
nc: connect to db.interna port 5433 (tcp) failed: Connection refused</div>
     <p>Sin nc, bash también sirve: <code>timeout 3 bash -c '&lt;/dev/tcp/db.interna/5432' &amp;&amp; echo abierto</code>.</p>`},
 {t:"term", p:"Comprueba si el puerto 6379 de <code>redis.interno</code> acepta conexiones TCP",
  prompt:"pablo@servidor:~$", sol:["nc -vz redis.interno 6379","nc -zv redis.interno 6379","nc -z -v redis.interno 6379","nc -v -z redis.interno 6379"],
  pista:"nc con -v (verboso) y -z (solo comprobar), el host y el puerto.",
  salida:`Connection to redis.interno 6379 port [tcp/redis] succeeded!`, why:"Conectividad confirmada. Si ahora la app falla, mira credenciales, TLS o la propia aplicación."},
 {t:"info", eti:"Tiempos de HTTP", h:"¿Dónde se va el tiempo?",
  c:`<div class="termbox">curl -s -o /dev/null https://api.miempresa.com/salud -w \\
 "dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} primer_byte:%{time_starttransfer} total:%{time_total}\\n"

dns:0.004 tcp:0.021 tls:0.058 primer_byte:1.912 total:1.915</div>
     <p>Aquí la red es rápida (TLS listo a los 58 ms) y el servidor tarda casi 2 segundos en empezar a responder: el problema está en la aplicación o en lo que consulta.</p>`},
 {t:"opcion", p:"Con la medición anterior, ¿dónde buscarías la lentitud?",
  ops:["En el DNS","En la conexión TCP","En la aplicación: tarda casi 2 s en generar la respuesta","En el certificado"],
  ok:2, why:"time_starttransfer menos time_appconnect es el tiempo de «pensar» del servidor."},
 {t:"par", p:"Empareja cada comando con su uso",
  pares:[["ss -tlnp","Qué escucha en esta máquina y en qué IP"],["ss -tnp state established","Conexiones activas y sus procesos"],["nc -vz host puerto","Si un puerto remoto acepta conexiones"],["curl -w","Tiempos de cada fase de una petición"]],
  why:"ss sustituye a netstat en los Linux modernos."},
 {t:"vf", p:"Si <code>ss -tlnp</code> muestra <code>127.0.0.1:8080</code>, el servicio es accesible desde otras máquinas.",
  ok:false, why:"Solo escucha en la interfaz local. Para aceptar conexiones externas debe escuchar en 0.0.0.0 o en la IP de la interfaz."}
]},

{
id:"rd9l4",
titulo:"Capturar tráfico con tcpdump",
claves:["tcpdump captura los paquetes que pasan por una interfaz","Filtros: host, port, net y combinaciones con and/or","-w guarda en .pcap para analizarlo en Wireshark"],
pasos:[
 {t:"info", eti:"Ver la verdad", h:"tcpdump",
  c:`<p>Cuando todo lo demás falla, mira los paquetes reales:</p>
     <div class="termbox">sudo tcpdump -i eth0 -n port 5432
sudo tcpdump -i any -n host 10.0.21.5 and port 443
sudo tcpdump -i eth0 -n 'tcp[tcpflags] &amp; tcp-syn != 0'   <span class="cm"># solo SYN</span>
sudo tcpdump -i eth0 -n port 8080 -w captura.pcap        <span class="cm"># guardar para Wireshark</span></div>
     <div class="termbox">10:04:01.112 IP 10.0.11.21.51234 &gt; 10.0.21.5.5432: Flags [S], seq 3021...
10:04:02.114 IP 10.0.11.21.51234 &gt; 10.0.21.5.5432: Flags [S], seq 3021...
10:04:04.118 IP 10.0.11.21.51234 &gt; 10.0.21.5.5432: Flags [S], seq 3021...</div>
     <p>Tres SYN reenviados sin respuesta: los paquetes salen, pero nada vuelve. Casi seguro un filtrado en el camino o en el destino.</p>`},
 {t:"par", p:"Empareja cada flag de tcpdump con su significado",
  pares:[["[S]","SYN: inicio de conexión"],["[S.]","SYN-ACK: el servidor acepta"],["[R]","RST: conexión rechazada o cortada"],["[F.]","FIN: cierre ordenado"],["[P.]","PUSH: datos"]],
  why:"Leer los flags permite distinguir un rechazo (R) de un descarte (SYN sin respuesta)."},
 {t:"term", p:"Captura sin resolver nombres el tráfico del puerto 443 en cualquier interfaz",
  prompt:"pablo@servidor:~$", sol:["sudo tcpdump -i any -n port 443","sudo tcpdump -n -i any port 443","sudo tcpdump -ni any port 443","sudo tcpdump -i any port 443 -n","tcpdump -i any -n port 443"],
  pista:"sudo tcpdump, -i any, -n y el filtro port 443.",
  salida:`listening on any, link-type LINUX_SLL2
10:12:45.201 IP 203.0.113.9.60312 > 10.0.1.10.443: Flags [S], seq 1180...
10:12:45.201 IP 10.0.1.10.443 > 203.0.113.9.60312: Flags [S.], seq 7731...`, why:"El contenido de HTTPS va cifrado, pero el saludo TCP y los tiempos siguen siendo visibles."},
 {t:"opcion", p:"En la captura ves que al SYN del cliente el servidor responde con <code>[R.]</code>. ¿Qué significa?",
  ops:["La conexión se estableció","Nada escucha en ese puerto (connection refused) o un cortafuegos rechaza activamente","Hay pérdida de paquetes","El DNS falla"],
  ok:1, why:"RST es una respuesta activa: la máquina está ahí y dice que no."},
 {t:"vf", p:"tcpdump permite leer el contenido de peticiones HTTPS sin más.",
  ok:false, why:"El contenido va cifrado con TLS. Verás IPs, puertos, flags, tamaños y tiempos."}
]}

]});
