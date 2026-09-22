window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "La red local: Ethernet, MAC y switches",
resumen: "Capas 1 y 2: cables y Wi-Fi, direcciones MAC, switches, ARP y VLANs",
nivel: "Fundamentos",
color: "#6dd3f2",
lecciones: [

{
id:"rd2l1",
titulo:"Medios físicos y Ethernet",
claves:["Capa 1: cobre, fibra y radio transportan bits","Ethernet es el estándar de las redes locales cableadas","Wi-Fi es el equivalente inalámbrico; comparte el medio"],
pasos:[
 {t:"info", eti:"Capa 1", h:"Por dónde viajan los bits",
  c:`<ul><li><b>Cobre</b> (cable de red RJ45, «cable Ethernet»): barato, hasta 100 m, 1 a 10 Gbit/s.</li>
     <li><b>Fibra óptica</b>: luz por un hilo de vidrio. Kilómetros de distancia y enormes velocidades. Une centros de datos y países (cables submarinos).</li>
     <li><b>Radio</b>: Wi-Fi, 4G/5G. Cómodo, pero compartido y con interferencias.</li></ul>
     <p>Dos medidas que conviene distinguir: <b>ancho de banda</b> (cuántos datos por segundo caben) y <b>latencia</b> (cuánto tarda un dato en llegar). Una fibra transatlántica tiene mucho ancho de banda, pero la latencia Madrid–Nueva York no baja de unos 70 ms: la luz tiene un límite.</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Ancho de banda","Cantidad de datos por segundo"],["Latencia","Tiempo que tarda un dato en llegar"],["Fibra óptica","Transmite luz a grandes distancias"],["Wi-Fi","Red local inalámbrica por radio"]],
  why:"Una API lenta por «la red» casi siempre es un problema de latencia (muchas idas y vueltas), no de ancho de banda."},
 {t:"info", eti:"Capa 2", h:"Ethernet",
  c:`<p><b>Ethernet</b> es el conjunto de reglas para enviar datos dentro de una red local cableada. Define el formato de la <b>trama</b>:</p>
     <div class="diag">| MAC destino | MAC origen | tipo (IPv4, IPv6, ARP) | datos (hasta 1500 bytes) | comprobacion |</div>
     <p>Ese límite de 1500 bytes de datos se llama <b>MTU</b> (Maximum Transmission Unit). Si un paquete es más grande, hay que trocearlo. Verás la MTU cuando depures VPNs o redes de contenedores que añaden cabeceras extra.</p>`},
 {t:"opcion", p:"Una aplicación hace 50 consultas pequeñas seguidas a una base de datos en otro continente y va lenta. ¿Qué es lo más probable?",
  ops:["Falta ancho de banda","La latencia: 50 idas y vueltas acumulan mucho tiempo","El cable es de cobre","La MTU es muy grande"],
  ok:1, why:"50 × 100 ms = 5 segundos, aunque cada consulta mueva pocos bytes. Solución: menos viajes o acercar los servicios."},
 {t:"vf", p:"La MTU típica de Ethernet es de 1500 bytes.",
  ok:true, why:"Por eso las redes que añaden cabeceras (VPN, túneles de Kubernetes como VXLAN) suelen usar una MTU algo menor."}
]},

{
id:"rd2l2",
titulo:"Direcciones MAC y switches",
claves:["Una MAC identifica una tarjeta de red: 48 bits en hexadecimal","El switch aprende qué MAC hay en cada puerto y reenvía solo por ese","ff:ff:ff:ff:ff:ff es la dirección de difusión (broadcast)"],
pasos:[
 {t:"info", eti:"Identidad física", h:"La dirección MAC",
  c:`<p>Cada tarjeta de red tiene una <b>dirección MAC</b>: 48 bits escritos en hexadecimal, por ejemplo <code>3c:22:fb:9a:10:4e</code>. Los primeros 3 bytes identifican al fabricante.</p>
     <p>La MAC solo tiene sentido <b>dentro de la red local</b>: sirve para entregar tramas entre equipos conectados al mismo switch o Wi-Fi. Para llegar a otras redes se usa la IP.</p>
     <div class="termbox">pablo@portatil:~$ ip link show
2: eth0: &lt;BROADCAST,MULTICAST,UP&gt; mtu 1500
    link/ether 3c:22:fb:9a:10:4e brd ff:ff:ff:ff:ff:ff</div>`},
 {t:"info", eti:"El switch", h:"Cómo aprende un switch",
  c:`<p>Un <b>switch</b> conecta varios equipos de una LAN. Mantiene una <b>tabla MAC</b>: qué dirección hay en cada puerto.</p>
     <ol><li>Llega una trama por el puerto 3 con MAC de origen A: apunta «A está en el puerto 3».</li>
     <li>Mira la MAC de destino. Si sabe en qué puerto está, envía la trama <b>solo por ese puerto</b>.</li>
     <li>Si no lo sabe, la envía por todos los puertos menos el de entrada (<b>inundación</b>). Cuando el destino responda, aprenderá dónde está.</li></ol>
     <p>La dirección <code>ff:ff:ff:ff:ff:ff</code> es <b>broadcast</b>: la trama va a todos los equipos de la LAN.</p>`},
 {t:"orden", p:"Ordena lo que hace un switch al recibir una trama",
  items:["Recibe la trama por un puerto","Apunta la MAC de origen asociada a ese puerto","Busca la MAC de destino en su tabla","La envía por el puerto correspondiente o, si no la conoce, por todos"],
  why:"Aprender, buscar, reenviar. Así funciona también el bridge virtual que Docker crea en tu máquina."},
 {t:"opcion", p:"¿Qué dirección MAC usa una trama que debe llegar a todos los equipos de la red local?",
  ops:["00:00:00:00:00:00","ff:ff:ff:ff:ff:ff","127.0.0.1","La del router"],
  ok:1, why:"Todos los bits a 1: broadcast de capa 2."},
 {t:"vf", p:"El bridge <code>docker0</code> que crea Docker funciona como un switch virtual.",
  ok:true, why:"Conecta las interfaces virtuales de los contenedores igual que un switch conecta equipos físicos."}
]},

{
id:"rd2l3",
titulo:"ARP: de IP a MAC",
claves:["ARP pregunta por broadcast «¿quién tiene la IP X?»","La respuesta se guarda en la caché ARP","Para salir de la red se busca la MAC del router (gateway), no la del destino final"],
pasos:[
 {t:"info", eti:"El eslabón perdido", h:"¿Cómo se sabe la MAC de una IP?",
  c:`<p>Tu portátil quiere enviar un paquete a <code>192.168.1.20</code>, en su misma red. Para meterlo en una trama Ethernet necesita la <b>MAC</b> de ese equipo. La averigua con <b>ARP</b> (Address Resolution Protocol):</p>
     <div class="diag">portatil -> TODOS (ff:ff:ff:ff:ff:ff): "Quien tiene 192.168.1.20? Decidselo a 192.168.1.10"
impresora (192.168.1.20) -> portatil:  "192.168.1.20 esta en 9c:b6:d0:11:22:33"</div>
     <p>La respuesta se guarda un rato en la <b>caché ARP</b> para no preguntar cada vez.</p>
     <div class="termbox">pablo@portatil:~$ ip neigh
192.168.1.1  dev wlan0 lladdr 58:ef:68:aa:bb:cc REACHABLE
192.168.1.20 dev wlan0 lladdr 9c:b6:d0:11:22:33 STALE</div>`},
 {t:"info", eti:"Fuera de tu red", h:"¿Y si el destino está en otra red?",
  c:`<p>Si el destino es <code>142.250.184.14</code> (Google), no está en tu LAN. Tu equipo no pregunta su MAC: envía la trama a la MAC de tu <b>puerta de enlace</b> (el router, por ejemplo <code>192.168.1.1</code>), con la IP de destino de Google dentro. El router se encarga del resto.</p>`},
 {t:"opcion", p:"Tu portátil (192.168.1.10) envía un paquete a un servidor en internet. ¿A qué MAC va dirigida la trama?",
  ops:["A la MAC del servidor de internet","A la MAC del router de tu red (la puerta de enlace)","A ff:ff:ff:ff:ff:ff","No lleva MAC"],
  ok:1, why:"Fuera de la LAN solo se llega a través del router: la trama va a él, y la IP de destino sigue siendo la del servidor."},
 {t:"term", p:"Muestra la tabla de vecinos (caché ARP) de tu máquina Linux",
  prompt:"pablo@portatil:~$", sol:["ip neigh","ip neighbor","ip neigh show","ip neighbour","arp -a","arp -n"],
  pista:"El comando ip, con el objeto neigh.",
  salida:`192.168.1.1  dev wlan0 lladdr 58:ef:68:aa:bb:cc REACHABLE`, why:"Si un equipo de tu red aparece como FAILED, no responde a ARP: está apagado o en otra red."},
 {t:"vf", p:"Las peticiones ARP se envían por broadcast a toda la red local.",
  ok:true, why:"Porque todavía no se sabe la MAC del destino. La respuesta, en cambio, es directa."}
]},

{
id:"rd2l4",
titulo:"VLANs y Wi-Fi",
claves:["Una VLAN divide un switch físico en varias redes lógicas aisladas","Se usan para separar tráfico: oficinas, invitados, servidores","El Wi-Fi comparte el medio; un punto de acceso lo conecta a la red cableada"],
pasos:[
 {t:"info", eti:"Separar sin cables nuevos", h:"VLANs",
  c:`<p>Una <b>VLAN</b> (red local virtual) permite que un mismo switch se comporte como varios switches separados. Los equipos de la VLAN 10 (empleados) no ven a los de la VLAN 20 (invitados) aunque estén conectados al mismo aparato.</p>
     <ul><li>Cada trama se marca con un <b>número de VLAN</b> (estándar 802.1Q).</li>
     <li>Para pasar de una VLAN a otra hace falta un <b>router</b> (o un switch de capa 3) y ahí se pueden aplicar reglas.</li></ul>
     <p>En la nube, este papel de aislamiento lo cumplen las <b>VPC</b> y sus subredes.</p>`},
 {t:"par", p:"Empareja cada concepto con su función",
  pares:[["VLAN","Red lógica aislada dentro de un switch"],["802.1Q","Estándar para etiquetar tramas con su VLAN"],["Punto de acceso Wi-Fi","Conecta dispositivos inalámbricos a la red cableada"],["Router entre VLANs","Permite y controla el tráfico entre redes aisladas"]],
  why:"Segmentar la red limita el alcance de un equipo comprometido."},
 {t:"opcion", p:"Una empresa quiere que los invitados tengan Wi-Fi pero no puedan ver los servidores internos. ¿Qué usa?",
  ops:["Una contraseña más larga","Una VLAN (o red) separada para invitados, sin acceso a la de servidores","Otro switch en la misma red","Cambiar las MAC"],
  ok:1, why:"Separación de red: es la versión física de lo que harás con subredes y grupos de seguridad en la nube."},
 {t:"vf", p:"Dos equipos en VLANs distintas pueden comunicarse directamente por capa 2 sin pasar por un router.",
  ok:false, why:"Las VLANs aíslan la capa 2; para cruzar hace falta enrutar en capa 3."}
]}

]});
