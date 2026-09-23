window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "La red local: Ethernet, MAC y switches",
resumen: "Capas 1 y 2: cables y Wi-Fi, direcciones MAC, switches, ARP, VLANs y troncales, STP y agregación de enlaces",
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
     <div class="dg"><div class="dg-tit">trama Ethernet</div><div class="dg-fila" style="display:flex;flex-wrap:wrap"><div class="dg-caja acento" style="flex:1 1 70px;padding:8px 6px;font-size:12.5px">MAC destino</div><div class="dg-caja acento" style="flex:1 1 70px;padding:8px 6px;font-size:12.5px">MAC origen</div><div class="dg-caja" style="flex:1.1 1 80px;padding:8px 6px;font-size:12.5px">tipo<small>IPv4, IPv6, ARP</small></div><div class="dg-caja ok" style="flex:3 1 130px;padding:8px 6px;font-size:12.5px">datos<small>hasta 1500 bytes</small></div><div class="dg-caja base" style="flex:1.1 1 90px;padding:8px 6px;font-size:12.5px">comprobación</div></div></div>
     <p>Ese límite de 1500 bytes de datos se llama <b>MTU</b> (Maximum Transmission Unit). Si un paquete es más grande, hay que trocearlo. Verás la MTU cuando depures VPNs o redes de contenedores que añaden cabeceras extra.</p>`},
 {t:"opcion", p:"Una aplicación hace 50 consultas pequeñas seguidas a una base de datos en otro continente y va lenta. ¿Qué es lo más probable?",
  ops:["Falta ancho de banda","La latencia: 50 idas y vueltas acumulan mucho tiempo","El cable es de cobre","La MTU es muy grande"],
  ok:1, why:"50 × 100 ms = 5 segundos, aunque cada consulta mueva pocos bytes. Solución: menos viajes o acercar los servicios."},
 {t:"vf", p:"La MTU típica de Ethernet es de 1500 bytes.",
  ok:true, why:"Por eso las redes que añaden cabeceras (VPN, túneles de Kubernetes como VXLAN) suelen usar una MTU algo menor."},
 {t:"term", p:"Comprueba a qué velocidad y en qué modo dúplex ha negociado el enlace la interfaz <code>eth0</code>",
  prompt:"root@srv:~#", sol:["ethtool eth0","sudo ethtool eth0"],
  salida:`Settings for eth0:
	Supported link modes:   1000baseT/Full
	Speed: 1000Mb/s
	Duplex: Full
	Auto-negotiation: on
	Link detected: yes`,
  pista:"La herramienta de Linux para ver y cambiar parámetros de la tarjeta: eth…",
  why:"Un servidor que negocia a 100Mb/s o en Half dúplex por un cable dañado va lento «sin motivo». <code>ethtool -S eth0</code> muestra además contadores de errores y descartes."},
 {t:"opcion", p:"En un centro de datos se configura MTU 9000 (jumbo frames) en los servidores, pero no en uno de los switches del camino. ¿Qué ocurre?",
  ops:["Nada, el switch se adapta solo","Las tramas grandes se descartan en ese switch y las conexiones con mucho tráfico fallan","La red va más rápida","Solo afecta al Wi-Fi"],
  ok:1, why:"La MTU tiene que coincidir en todo el segmento de capa 2. Los paquetes pequeños (ping, saludo TCP) pasan y los grandes no: el síntoma clásico de un problema de MTU."}
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
  ok:true, why:"Conecta las interfaces virtuales de los contenedores igual que un switch conecta equipos físicos."},
 {t:"par", p:"Empareja cada equipo con cómo reenvía el tráfico",
  pares:[["Hub (concentrador, obsoleto)","Repite cada trama por todos los puertos"],["Switch","Aprende MACs y reenvía solo por el puerto del destino"],["Router","Decide por la IP de destino y conecta redes distintas"]],
  why:"Los hubs desaparecieron porque todos compartían el medio y había colisiones. Con switches, cada puerto es su propio dominio de colisión."},
 {t:"term", p:"Muestra un resumen breve (una línea por interfaz) con el estado y la MAC de cada interfaz",
  prompt:"pablo@portatil:~$", sol:["ip -br link","ip -br link show","ip -brief link","ip -brief link show","ip -br l"],
  salida:`lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
eth0             UP             3c:22:fb:9a:10:4e <BROADCAST,MULTICAST,UP,LOWER_UP>
docker0          DOWN           02:42:8f:1a:22:07 <NO-CARRIER,BROADCAST,MULTICAST,UP>`,
  pista:"ip link con la opción -br (brief).",
  why:"<code>-br</code> funciona también con <code>ip -br addr</code>. <code>LOWER_UP</code> indica que hay enlace físico; <code>NO-CARRIER</code>, que no hay nada conectado."}
]},

{
id:"rd2l3",
titulo:"ARP: de IP a MAC",
claves:["ARP pregunta por broadcast «¿quién tiene la IP X?»","La respuesta se guarda en la caché ARP","Para salir de la red se busca la MAC del router (gateway), no la del destino final"],
pasos:[
 {t:"info", eti:"El eslabón perdido", h:"¿Cómo se sabe la MAC de una IP?",
  c:`<p>Tu portátil quiere enviar un paquete a <code>192.168.1.20</code>, en su misma red. Para meterlo en una trama Ethernet necesita la <b>MAC</b> de ese equipo. La averigua con <b>ARP</b> (Address Resolution Protocol):</p>
     <div class="dg"><div class="dg-tit">ARP: ¿quién tiene esta IP?</div><svg viewBox="0 0 356 196" width="100%" style="max-width:470px;display:block;margin:auto" role="img" aria-label="El portátil pregunta a todos quién tiene 192.168.1.20 y la impresora responde con su MAC"><defs><marker id="fl-redes2-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker><marker id="fl-redes2-1-ok" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ok)"/></marker></defs><line x1="58" y1="46" x2="58" y2="192" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="5.540000000000006" y="8" width="104.91999999999999" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="58" y="24" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">portátil</text><text x="58" y="39" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-3)">192.168.1.10</text><line x1="182" y1="46" x2="182" y2="192" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="129.54000000000002" y="8" width="104.91999999999999" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="182" y="24" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">impresora</text><text x="182" y="39" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-3)">192.168.1.20</text><line x1="296" y1="46" x2="296" y2="192" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="242.37" y="8" width="107.26" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="296" y="31.333333333333332" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">otros equipos</text><text x="175" y="75" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">a TODOS</tspan> <tspan font-family="var(--mono)">ff:ff:ff:ff:ff:ff</tspan></text><text x="175" y="91" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">«¿Quién tiene <tspan font-family="var(--mono)">192.168.1.20</tspan>?</text><text x="175" y="107" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">Decídselo a <tspan font-family="var(--mono)">192.168.1.10</tspan>»</text><line x1="58" y1="119" x2="293" y2="119" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes2-1)"/><circle cx="182" cy="119" r="3.5" fill="var(--accent)"/><text x="120" y="148" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">«<tspan font-family="var(--mono)">192.168.1.20</tspan> está en</text><text x="120" y="164" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-family="var(--mono)">9c:b6:d0:11:22:33</tspan>»</text><line x1="182" y1="176" x2="61" y2="176" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes2-1)"/></svg></div>
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
  ok:true, why:"Porque todavía no se sabe la MAC del destino. La respuesta, en cambio, es directa."},
 {t:"opcion", p:"Dos servidores comparten una IP virtual con keepalived. Cae el principal y el secundario asume la IP. ¿Cómo se enteran rápido los demás equipos de la LAN de que esa IP ahora está en otra MAC?",
  ops:["Esperan a que caduque su caché ARP, varios minutos","El secundario envía un ARP gratuito anunciando la IP con su propia MAC","El router reinicia la red","Cambia la IP virtual"],
  ok:1, why:"Un <b>ARP gratuito</b> es una respuesta ARP que nadie ha pedido: actualiza las cachés de toda la LAN al instante. Es la base de las IP flotantes en alta disponibilidad."},
 {t:"vf", p:"ARP no tiene autenticación: un equipo malicioso de la LAN puede responder «esa IP soy yo» y colocarse en medio del tráfico (ARP spoofing).",
  ok:true, why:"Por eso los switches gestionados ofrecen <i>Dynamic ARP Inspection</i>, y por eso el cifrado extremo a extremo (TLS) importa incluso dentro de la red «de confianza»."}
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
  ok:false, why:"Las VLANs aíslan la capa 2; para cruzar hace falta enrutar en capa 3."},
 {t:"info", eti:"Puertos", h:"Puertos de acceso y troncales",
  c:`<p>En un switch con VLANs cada puerto se configura de una de dos formas:</p>
     <ul><li><b>Acceso</b> (<i>access</i>): pertenece a <b>una</b> VLAN. El equipo conectado (un PC, una impresora) envía tramas normales, sin etiqueta; el switch sabe a qué VLAN van por el puerto.</li>
     <li><b>Troncal</b> (<i>trunk</i>): transporta <b>varias</b> VLANs a la vez, cada trama con su etiqueta 802.1Q de 4 bytes (ID de 12 bits: de 1 a 4094). Se usa entre switches, hacia routers y hacia hipervisores.</li></ul>
     <p>Un servidor Linux también puede recibir un troncal y crear una subinterfaz por VLAN:</p>
     <div class="termbox">root@srv:~# ip link add link eth0 name eth0.10 type vlan id 10
root@srv:~# ip addr add 10.10.0.5/24 dev eth0.10
root@srv:~# ip link set eth0.10 up</div>
     <div class="nota ojo"><b class="tit">Error típico</b>La VLAN nativa de un troncal viaja sin etiqueta. Si no coincide en los dos extremos, el tráfico de una VLAN aparece en otra: fallos raros y un agujero de seguridad.</div>`},
 {t:"hueco", p:"Completa el comando que crea la subinterfaz de la VLAN 20 sobre <code>eth0</code>",
  tpl:"ip link add link ___ name eth0.20 type ___ id ___",
  banco:["eth0","vlan","20","bridge","eth0.20","10"], sol:["eth0","vlan","20"],
  why:"La interfaz padre recibe el troncal; el kernel quita la etiqueta 20 y entrega las tramas por <code>eth0.20</code>."},
 {t:"opcion", p:"Un hipervisor aloja máquinas virtuales de tres VLANs distintas y tiene un solo cable al switch. ¿Cómo se configura ese puerto del switch?",
  ops:["Como puerto de acceso de la VLAN 1","Como troncal que lleva las tres VLANs etiquetadas","Con tres direcciones MAC fijas","Desactivando las VLANs"],
  ok:1, why:"Un troncal transporta varias VLANs por un solo enlace; el bridge del hipervisor separa las tramas según su etiqueta."}
]},

{
id:"rd2n1",
titulo:"Bucles, STP y agregación de enlaces",
claves:["Un bucle de capa 2 provoca una tormenta de broadcast que tumba la red","STP (y RSTP) bloquea enlaces redundantes para dejar un árbol sin bucles","LACP junta varios enlaces físicos en uno lógico: más capacidad y tolerancia a fallos"],
pasos:[
 {t:"info", eti:"El peligro", h:"Por qué un bucle tumba una LAN",
  c:`<p>Para tener redundancia se conectan los switches por más de un camino. Pero una trama Ethernet <b>no tiene TTL</b>: no caduca. Si hay un bucle, un broadcast (un ARP, por ejemplo) da vueltas para siempre y se multiplica en cada switch. En segundos los enlaces se saturan y la CPU de los switches se dispara: es una <b>tormenta de broadcast</b>.</p>
     <div class="dg"><div class="dg-tit">tres switches en triángulo: STP bloquea un enlace</div><svg viewBox="0 0 320 190" width="100%" style="max-width:400px;display:block;margin:auto" role="img" aria-label="SW1 es el puente raíz, conectado a SW2 y SW3; el enlace entre SW2 y SW3 está bloqueado">
<line x1="160" y1="40" x2="60" y2="145" stroke="var(--ok)" stroke-width="3"/>
<line x1="160" y1="40" x2="260" y2="145" stroke="var(--ok)" stroke-width="3"/>
<line x1="60" y1="145" x2="260" y2="145" stroke="var(--bad)" stroke-width="3" stroke-dasharray="7 6"/>
<rect x="115" y="18" width="90" height="44" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
<text x="160" y="37" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--mono)" fill="var(--ink)">SW1</text>
<text x="160" y="53" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">puente raíz</text>
<rect x="20" y="126" width="80" height="38" rx="8" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/>
<text x="60" y="150" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--mono)" fill="var(--ink)">SW2</text>
<rect x="220" y="126" width="80" height="38" rx="8" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/>
<text x="260" y="150" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--mono)" fill="var(--ink)">SW3</text>
<text x="160" y="182" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--bad)">bloqueado (reserva)</text>
<text x="88" y="88" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ok)">reenvía</text>
<text x="232" y="88" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ok)">reenvía</text>
</svg><div class="dg-nota arriba" style="margin-top:8px">el enlace SW2–SW3 solo se activa si cae uno de los otros dos</div></div>
     <p>El síntoma típico: alguien conecta un cable «de sobra» entre dos tomas de la pared y toda la planta se queda sin red.</p>`},
 {t:"info", eti:"La solución", h:"STP, RSTP y la agregación con LACP",
  c:`<ul><li><b>STP</b> (Spanning Tree Protocol, 802.1D): los switches eligen un <b>puente raíz</b> (el de menor prioridad y MAC) y calculan el camino más corto hasta él. Los puertos que cerrarían un bucle quedan en estado <b>bloqueado</b>. Si un enlace cae, recalculan y activan el de reserva. El STP clásico tarda 30–50 s en converger.</li>
     <li><b>RSTP</b> (802.1w) converge en pocos segundos; es lo que se usa hoy. Buenas prácticas: fijar a mano qué switch es raíz y activar <i>BPDU Guard</i> en los puertos de usuario, para que un switch doméstico enchufado por error no reordene la red.</li>
     <li><b>LACP</b> (802.3ad / 802.1AX): agrupa varios enlaces físicos entre dos equipos en uno lógico (<i>port-channel</i>, <i>bond</i>). STP lo ve como un solo enlace, así que no bloquea nada. Da más capacidad total y sigue funcionando si cae un cable.</li></ul>
     <div class="nota"><b class="tit">Ojo con la capacidad</b>La agregación reparte <b>flujos</b> por hash (IPs y puertos), no paquetes: una sola conexión TCP no va más rápida que un enlace individual.</div>`},
 {t:"opcion", p:"Alguien conecta los dos extremos de un cable a dos tomas de la misma oficina y los switches no tienen STP. ¿Qué pasa?",
  ops:["Nada, sobra un cable","Se forma un bucle, los broadcasts se multiplican sin fin y la red se cae","La red va el doble de rápido","Solo falla el equipo de ese puesto"],
  ok:1, why:"Sin TTL en capa 2, las tramas giran indefinidamente. STP existe precisamente para evitarlo."},
 {t:"par", p:"Empareja cada término con su función",
  pares:[["Puente raíz","Switch de referencia a partir del cual STP calcula el árbol"],["Puerto bloqueado","Enlace redundante que STP no usa para evitar el bucle"],["BPDU Guard","Apaga un puerto de usuario si aparece un switch detrás"],["LACP","Negocia la unión de varios enlaces en uno lógico"],["RSTP","Versión rápida de STP, converge en segundos"]],
  why:"Estos nombres salen en cualquier entrevista de infraestructura de red de campus o de centro de datos."},
 {t:"vf", p:"Con un bond LACP de dos enlaces de 10 Gbit/s, una única descarga TCP puede ir a 20 Gbit/s.",
  ok:false, why:"El reparto es por flujo: los paquetes de una conexión van siempre por el mismo enlace para no desordenarse. Con muchos flujos sí se aprovechan los 20 Gbit/s."},
 {t:"term", p:"En un servidor Linux con un bond llamado <code>bond0</code>, consulta el estado del bond y de sus enlaces miembros",
  prompt:"root@srv:~#", sol:["cat /proc/net/bonding/bond0"],
  salida:`Bonding Mode: IEEE 802.3ad Dynamic link aggregation
Transmit Hash Policy: layer3+4 (1)
MII Status: up

Slave Interface: eno1
MII Status: up
Speed: 10000 Mbps

Slave Interface: eno2
MII Status: down
Speed: Unknown`,
  pista:"El kernel lo expone como fichero en /proc/net/bonding/.",
  why:"Aquí se ve que <code>eno2</code> está caído: el bond sigue funcionando con un solo enlace, pero has perdido la redundancia. Conviene alertar de ello."},
 {t:"escribe", p:"Las tramas Ethernet no caducan como los paquetes IP. ¿Qué campo de la cabecera IP evita que un paquete dé vueltas para siempre? (siglas)",
  sol:["TTL","time to live","hop limit"], pista:"Cada router lo resta en uno.",
  why:"En IPv4 se llama TTL y en IPv6 <i>Hop Limit</i>. En capa 2 no existe, por eso los bucles son tan destructivos."}
]}

]});
