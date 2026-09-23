window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Configuración de red, IPv6 e ICMP",
resumen: "Puerta de enlace y DHCP, IPv6 a fondo (tipos de dirección, SLAAC, NDP y doble pila), ICMP, TTL, MTU y Path MTU Discovery",
nivel: "Intermedio",
color: "#5ac4e6",
lecciones: [

{
id:"rd3l5",
titulo:"Puerta de enlace y DHCP",
claves:["La puerta de enlace es el router al que se envía todo lo que no es de tu subred","DHCP entrega IP, máscara, gateway y DNS automáticamente","Sin DHCP, el equipo se queda con una 169.254.x.x y no sale de su red"],
pasos:[
 {t:"info", eti:"La salida", h:"Puerta de enlace (gateway)",
  c:`<p>Tu equipo decide así dónde enviar cada paquete:</p>
     <ul><li>¿El destino está en mi subred? → se lo envío directamente (con ARP).</li>
     <li>¿No? → se lo envío a la <b>puerta de enlace predeterminada</b>, normalmente la .1 de la subred.</li></ul>
     <div class="termbox">pablo@portatil:~$ ip route
default via 192.168.1.1 dev wlan0
192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.10</div>`},
 {t:"info", eti:"Configuración automática", h:"DHCP",
  c:`<p>Al conectarte a una red no escribes tu IP a mano: un servidor <b>DHCP</b> (en casa, el router) te la presta durante un tiempo, junto con la máscara, la puerta de enlace y los servidores DNS.</p>
     <div class="dg"><div class="dg-tit">DHCP: los cuatro mensajes</div><svg viewBox="0 0 320 302" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Secuencia DHCP entre el equipo y el servidor: DISCOVER, OFFER, REQUEST y ACK"><defs><marker id="fl-redes3-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker><marker id="fl-redes3-1-ok" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ok)"/></marker></defs><line x1="60" y1="46" x2="60" y2="298" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="29.32" y="8" width="61.36" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="60" y="31.666666666666668" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--sans)" fill="var(--ink)">equipo</text><line x1="260" y1="46" x2="260" y2="298" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="202.86" y="8" width="114.28" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="260" y="31.666666666666668" text-anchor="middle" font-size="14" font-weight="700" font-family="var(--sans)" fill="var(--ink)">servidor DHCP</text><text x="160" y="76" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">DISCOVER</tspan> · a todos</text><text x="160" y="93" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">«Necesito configuración»</text><line x1="60" y1="105" x2="257" y2="105" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#fl-redes3-1)"/><text x="160" y="135" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">OFFER</tspan></text><text x="160" y="152" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">«Te ofrezco <tspan font-family="var(--mono)">192.168.1.10</tspan>»</text><line x1="260" y1="164" x2="63" y2="164" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes3-1)"/><text x="160" y="194" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">REQUEST</tspan></text><text x="160" y="211" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">«La acepto»</text><line x1="60" y1="223" x2="257" y2="223" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes3-1)"/><text x="160" y="253" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">ACK</tspan></text><text x="160" y="270" text-anchor="middle" font-size="14" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">«Confirmado, 24 horas»</text><line x1="260" y1="282" x2="63" y2="282" stroke="var(--ok)" stroke-width="2" marker-end="url(#fl-redes3-1-ok)"/></svg></div>
     <p>Los servidores suelen tener IP fija o una reserva de DHCP para que no cambie.</p>`},
 {t:"orden", p:"Ordena los mensajes de DHCP",
  items:["DISCOVER","OFFER","REQUEST","ACK"],
  why:"Se recuerda como DORA."},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["Puerta de enlace","Router para salir de tu subred"],["DHCP","Asigna la configuración de red automáticamente"],["Concesión (lease)","Tiempo durante el que la IP prestada es tuya"],["Reserva DHCP","La misma IP siempre para la misma MAC"]],
  why:"Si un equipo tiene IP pero no sale a internet, lo primero es comprobar la puerta de enlace."},
 {t:"term", p:"Muestra la tabla de rutas de tu máquina Linux para ver la puerta de enlace",
  prompt:"pablo@portatil:~$", sol:["ip route","ip r","ip route show","route -n","ip route list"],
  pista:"El comando ip con el objeto route.",
  salida:`default via 192.168.1.1 dev wlan0
192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.10`, why:"La línea default es la puerta de enlace: por ahí sale todo lo que no conoce."},
 {t:"opcion", p:"Un portátil recién conectado tiene la IP <code>169.254.23.7</code> y no llega a nada. ¿Qué ha pasado?",
  ops:["Tiene una IP pública","Ningún servidor DHCP le ha contestado y se ha autoasignado una de enlace local","Está usando IPv6","El DNS está caído"],
  ok:1, why:"169.254.0.0/16 es la señal de «DHCP no respondió». Revisa el cable o el Wi-Fi, la VLAN del puerto y si el servidor DHCP está vivo o ha agotado su rango."},
 {t:"opcion", p:"El servidor DHCP de la empresa está en <code>10.0.50.10</code> y los portátiles de la planta 3 están en <code>10.0.3.0/24</code>. Los routers no reenvían broadcasts. ¿Cómo reciben IP?",
  ops:["No pueden: hace falta un servidor DHCP por subred","Con un agente de retransmisión DHCP (relay, «ip helper») en el router de su subred","Con ARP","Poniendo la IP del servidor en cada portátil"],
  ok:1, why:"El DISCOVER es broadcast y muere en el router. El <i>relay</i> lo recoge y se lo reenvía por unicast al servidor, indicando de qué subred viene para que elija el rango correcto."},
 {t:"term", p:"Muestra solo las direcciones IPv4 de la interfaz <code>eth0</code>",
  prompt:"pablo@portatil:~$", sol:["ip -4 addr show eth0","ip -4 addr show dev eth0","ip -4 a show eth0","ip -4 a s eth0","ip -4 addr show dev eth0","ip -4 a show dev eth0","ip -4 addr list eth0"],
  salida:`2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic noprefixroute eth0
       valid_lft 86091sec preferred_lft 86091sec`,
  pista:"ip con -4 para filtrar la familia, luego addr show y la interfaz.",
  why:"<code>dynamic</code> indica que la IP viene de DHCP y <code>valid_lft</code> es lo que le queda a la concesión. A mitad de ese tiempo el cliente intenta renovarla."}
]},

{
id:"rd4n1",
titulo:"IPv6 a fondo",
claves:["128 bits en hexadecimal; los ceros iniciales se omiten y :: resume una sola racha de grupos a cero","Toda interfaz tiene una fe80:: de enlace local; las globales salen de 2000::/3 y las subredes son /64","SLAAC y los Router Advertisements dan la dirección; NDP sustituye a ARP y el ICMPv6 no se puede bloquear"],
pasos:[
 {t:"info", eti:"Direcciones", h:"Cómo se escribe y qué tipos hay",
  c:`<p>Una IPv6 son <b>128 bits</b> en 8 grupos de 4 cifras hexadecimales. Dos reglas para abreviar:</p>
     <ol><li>Los ceros a la izquierda de cada grupo se quitan: <code>0db8</code> → <code>db8</code>.</li>
     <li>Una sola racha de grupos a cero se sustituye por <code>::</code>. Solo una vez: si hubiera dos, no se sabría cuántos ceros hay en cada una.</li></ol>
     <p><code>2001:0db8:0000:0000:0000:0000:0000:0001</code> → <code>2001:db8::1</code></p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">tipos de dirección IPv6</div><table class="dg-tabla"><thead><tr><th>prefijo</th><th>tipo</th><th>equivale en IPv4 a…</th></tr></thead><tbody><tr><td><code>2000::/3</code></td><td>unicast global (pública)</td><td>una IP pública</td></tr><tr><td><code>fe80::/10</code></td><td>enlace local: la tiene toda interfaz, no sale del segmento</td><td>169.254.x.x, pero siempre presente</td></tr><tr><td><code>fc00::/7</code> (en la práctica <code>fd00::/8</code>)</td><td>ULA: uso privado</td><td>10.0.0.0/8</td></tr><tr><td><code>ff00::/8</code></td><td>multicast (IPv6 no tiene broadcast)</td><td>224.0.0.0/4</td></tr><tr><td><code>::1/128</code></td><td>loopback</td><td>127.0.0.1</td></tr><tr><td><code>::/0</code></td><td>ruta por defecto</td><td>0.0.0.0/0</td></tr></tbody></table></div>
     <p>Tamaños habituales: un operador da a cada sitio un <code>/48</code> o un <code>/56</code>, cada subred es un <b>/64</b> (siempre, lo exige SLAAC) y un equipo concreto es un <code>/128</code>.</p>`},
 {t:"info", eti:"Por dentro", h:"SLAAC, NDP y doble pila",
  c:`<ul><li><b>SLAAC</b>: el router envía periódicamente <b>Router Advertisements</b> (RA) con el prefijo de la subred. Cada equipo se construye solo los 64 bits de interfaz (hoy, aleatorios por privacidad) y ya tiene IP global, sin servidor. La puerta de enlace es la <code>fe80::</code> del router que anuncia. <b>DHCPv6</b> existe, pero es opcional (Android, por ejemplo, no lo implementa).</li>
     <li><b>NDP</b> (Neighbor Discovery, sobre ICMPv6) sustituye a ARP: <i>Neighbor Solicitation</i> y <i>Advertisement</i>, enviados a una dirección multicast, no a broadcast.</li>
     <li><b>Sin NAT</b>: cada equipo tiene dirección pública. Eso no significa estar expuesto: el cortafuegos con estado sigue bloqueando lo que entra sin haberlo pedido.</li>
     <li><b>Doble pila</b>: casi todo funciona con IPv4 e IPv6 a la vez. Los clientes usan <b>Happy Eyeballs</b>: prueban IPv6 y, si no conecta en unos 250 ms, IPv4.</li></ul>
     <div class="nota ojo"><b class="tit">Error típico</b>Bloquear todo el ICMPv6 «por seguridad». Sin él no hay NDP (no se resuelven vecinos) ni aviso de <i>Packet Too Big</i>: IPv6 deja de funcionar a medias.</div>`},
 {t:"escribe", p:"Abrevia al máximo la dirección <code>2001:0db8:0000:0000:0000:0000:0000:0001</code>",
  sol:["2001:db8::1"], pista:"Quita los ceros a la izquierda y cambia la racha de ceros por ::.",
  why:"Es la forma canónica (RFC 5952): minúsculas, sin ceros iniciales y :: en la racha más larga."},
 {t:"vf", p:"<code>2001:db8::5::1</code> es una dirección IPv6 válida.",
  ok:false, why:":: solo puede aparecer una vez. Con dos no se sabría cuántos grupos a cero representa cada una."},
 {t:"opcion", p:"En <code>ip -6 addr</code> ves una dirección <code>fe80::a8c1:abff:fe12:3456/64</code>. ¿Qué es?",
  ops:["Una IP pública asignada por el operador","Una dirección de enlace local, que solo sirve dentro de ese segmento","Una dirección multicast","El localhost de IPv6"],
  ok:1, why:"Toda interfaz con IPv6 tiene una fe80::. Se usa para NDP y para hablar con el router; no se enruta. Para usarla hay que indicar la interfaz: <code>ping fe80::1%eth0</code>."},
 {t:"par", p:"Empareja cada prefijo o mecanismo con lo que es",
  pares:[["::1","Loopback"],["fd00::/8","Direcciones privadas (ULA)"],["ff02::1","Multicast a todos los nodos del enlace"],["Router Advertisement","Anuncia el prefijo y la puerta de enlace para SLAAC"],["Neighbor Solicitation","Pregunta la MAC de una IPv6, como ARP"]],
  why:"Con estos cinco se entiende el 90 % de lo que aparece en una captura de IPv6."},
 {t:"term", p:"Muestra las direcciones IPv6 de tu máquina",
  prompt:"pablo@portatil:~$", sol:["ip -6 addr","ip -6 addr show","ip -6 a","ip -6 address","ip -6 address show","ip -6 a s"],
  salida:`1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN qlen 1000
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
    inet6 2a01:4f8:c17:3e2a:9d1c:62b0:4a7e:11f3/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 86389sec preferred_lft 14389sec
    inet6 fe80::a8c1:abff:fe12:3456/64 scope link
       valid_lft forever preferred_lft forever`,
  pista:"Como ip addr, pero con la opción de familia -6.",
  why:"Una global (<code>scope global</code>, obtenida por SLAAC: <code>dynamic mngtmpaddr</code>) y una de enlace local (<code>scope link</code>). Si solo tienes la fe80::, no te llegan RA del router."},
 {t:"opcion", p:"Un servicio responde por IPv4 pero los clientes tardan unos segundos en conectar solo desde algunas redes. El DNS publica un registro AAAA que apunta a una IPv6 donde el servicio no escucha. ¿Qué pasa?",
  ops:["Nada que ver con IPv6","Los clientes prueban primero la IPv6 anunciada, falla, y caen a IPv4 tras esperar","El AAAA hace que falle IPv4","Es un problema de MTU de IPv4"],
  ok:1, why:"Anunciar un AAAA que no funciona es peor que no anunciarlo. Happy Eyeballs atenúa la espera, pero clientes antiguos o librerías sin él se quedan esperando el timeout."},
 {t:"codigo", p:"Lee una IPv6 y escribe dos líneas: la forma abreviada y la forma completa (8 grupos de 4 cifras)",
  lenguaje:"py",
  c:`<p>El módulo <code>ipaddress</code> tiene los atributos <code>.compressed</code> y <code>.exploded</code>.</p>`,
  plantilla:"import ipaddress\ndir6 = ipaddress.IPv6Address(input().strip())\n# escribe la forma abreviada y la completa\n",
  pruebas:[{entrada:"2001:0db8:0000:0000:0000:0000:0000:0001\n", salida:"2001:db8::1\n2001:0db8:0000:0000:0000:0000:0000:0001"},{entrada:"fe80::1\n", salida:"fe80::1\nfe80:0000:0000:0000:0000:0000:0000:0001"},{entrada:"2001:db8:0:0:1:0:0:1\n", salida:"2001:db8::1:0:0:1\n2001:0db8:0000:0000:0001:0000:0000:0001", oculta:true}],
  pista:"print(dir6.compressed) y print(dir6.exploded).",
  solucion:"import ipaddress\ndir6 = ipaddress.IPv6Address(input().strip())\nprint(dir6.compressed)\nprint(dir6.exploded)",
  why:"El caso oculto es la trampa: hay dos rachas de ceros de igual longitud y la norma manda abreviar la primera (la de más a la izquierda)."}
]},

{
id:"rd4n2",
titulo:"ICMP, TTL y MTU",
claves:["ICMP lleva los mensajes de control: eco (ping), destino inalcanzable y tiempo excedido","Cada router resta 1 al TTL; al llegar a 0 descarta el paquete y avisa con ICMP","Path MTU Discovery depende de ICMP: si se bloquea, las conexiones se cuelgan con paquetes grandes"],
pasos:[
 {t:"info", eti:"Mensajes de control", h:"ICMP y el TTL",
  c:`<p><b>ICMP</b> viaja dentro de IP (no usa puertos) y sirve para que la red informe de problemas. Los mensajes que tienes que conocer:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">mensajes ICMPv4 más habituales</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>nombre</th><th>cuándo aparece</th></tr></thead><tbody><tr><td>8 / 0</td><td>echo request / echo reply</td><td><code>ping</code></td></tr><tr><td>3</td><td>destination unreachable</td><td>código 1: host inalcanzable; 3: puerto inalcanzable (UDP cerrado); 4: hace falta fragmentar y está DF; 13: prohibido por un filtro</td></tr><tr><td>11</td><td>time exceeded</td><td>el TTL llegó a 0: es lo que usa <code>traceroute</code></td></tr><tr><td>5</td><td>redirect</td><td>«usa otro router para ese destino»</td></tr></tbody></table></div>
     <p>El <b>TTL</b> (en IPv6, <i>Hop Limit</i>) lo pone el emisor (64 en Linux y macOS, 128 en Windows) y cada router lo resta en 1. Si llega a 0, el router descarta el paquete y devuelve un <i>time exceeded</i>. Así se evita que un bucle de rutas mantenga paquetes vivos para siempre. De paso, el TTL recibido delata el sistema del otro lado: 57 suele ser un Linux a 7 saltos.</p>`},
 {t:"info", eti:"El problema clásico", h:"MTU, fragmentación y agujeros negros",
  c:`<p>Si un paquete no cabe en la MTU del siguiente enlace (por ejemplo, un túnel VPN con MTU 1420), hay dos opciones: <b>fragmentarlo</b> o avisar. TCP hoy marca sus paquetes con el bit <b>DF</b> (<i>Don't Fragment</i>) y usa <b>Path MTU Discovery</b>: el router que no puede pasarlo lo descarta y devuelve un ICMP <i>fragmentation needed</i> con la MTU buena; el emisor reduce el tamaño. En IPv6 los routers <b>nunca</b> fragmentan: envían <i>Packet Too Big</i>.</p>
     <div class="nota ojo"><b class="tit">Agujero negro de PMTUD</b>Si un cortafuegos por el camino bloquea «todo el ICMP», el aviso no llega. El saludo TCP y las peticiones pequeñas funcionan; las respuestas grandes se quedan colgadas para siempre. Síntoma típico: por VPN, <code>curl</code> a una API pequeña va y la descarga de un fichero se congela.</div>
     <p>Soluciones: dejar pasar ICMP tipo 3 (y todo ICMPv6 necesario), bajar la MTU de la interfaz del túnel o recortar el MSS de TCP en el router (<i>MSS clamping</i>).</p>
     <div class="termbox">root@gw:~# iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu</div>`},
 {t:"par", p:"Empareja cada mensaje ICMP con la situación que lo provoca",
  pares:[["Echo reply","Respuesta a un ping"],["Time exceeded","Un router recibe un paquete con TTL 1"],["Port unreachable","Llega UDP a un puerto donde nadie escucha"],["Fragmentation needed","Paquete con DF mayor que la MTU del siguiente enlace"],["Packet Too Big","Lo mismo en IPv6"]],
  why:"Leer bien el ICMP que vuelve te dice qué equipo del camino tiene el problema y por qué."},
 {t:"escribe", p:"Con <code>ping -s N</code> indicas los bytes de datos del ICMP. ¿Qué N llena exactamente un paquete de 1500 bytes? (cabecera IP 20 bytes, cabecera ICMP 8)",
  sol:["1472"], pista:"1500 − 20 − 8.",
  why:"Por eso 1472 es el número mágico para probar MTU. Si 1472 falla y 1392 pasa, en el camino hay un enlace con MTU 1420, típica de WireGuard."},
 {t:"term", p:"Comprueba si cabe un paquete de 1500 bytes sin fragmentar hasta <code>10.8.0.5</code>: un solo ping, con el bit DF activado y 1472 bytes de datos",
  prompt:"pablo@portatil:~$", sol:["ping -M do -s 1472 -c 1 10.8.0.5","ping -c 1 -M do -s 1472 10.8.0.5","ping -c 1 -s 1472 -M do 10.8.0.5","ping -M do -c 1 -s 1472 10.8.0.5","ping -s 1472 -M do -c 1 10.8.0.5","ping -s 1472 -c 1 -M do 10.8.0.5","ping -c1 -M do -s 1472 10.8.0.5","ping -M do -s 1472 -c1 10.8.0.5"],
  salida:`PING 10.8.0.5 (10.8.0.5) 1472(1500) bytes of data.
From 10.0.0.1 icmp_seq=1 Frag needed and DF set (mtu = 1420)

--- 10.8.0.5 ping statistics ---
1 packets transmitted, 0 received, +1 errors, 100% packet loss, time 0ms`,
  pista:"En el ping de Linux: -M do prohíbe fragmentar, -s fija el tamaño y -c el número de envíos.",
  why:"El router 10.0.0.1 avisa de que su siguiente enlace tiene MTU 1420. En Windows el equivalente es <code>ping -f -l 1472</code>."},
 {t:"opcion", p:"Tras montar una VPN, el SSH al servidor remoto entra, pero al hacer <code>cat</code> de un fichero grande la sesión se congela. ¿Qué sospechas primero?",
  ops:["La clave SSH es incorrecta","Un problema de MTU: los paquetes grandes se pierden y el ICMP que avisaría está bloqueado","El DNS","El servidor se ha quedado sin CPU"],
  ok:1, why:"Todo lo pequeño funciona y lo grande se cuelga: es la firma del agujero negro de PMTUD. Prueba con <code>ping -M do -s</code> y baja la MTU o activa MSS clamping."},
 {t:"hueco", p:"Completa la regla que recorta el MSS de las conexiones TCP que atraviesan el router según la MTU de la ruta",
  tpl:"iptables -t ___ -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j ___ ___",
  banco:["mangle","TCPMSS","--clamp-mss-to-pmtu","filter","DROP","--set-mss"], sol:["mangle","TCPMSS","--clamp-mss-to-pmtu"],
  why:"Se aplica a los SYN porque el MSS se negocia en el saludo. Con nftables sería <code>tcp flags syn tcp option maxseg size set rt mtu</code>."},
 {t:"vf", p:"En IPv6, un router que recibe un paquete más grande que la MTU del siguiente enlace lo fragmenta y lo reenvía.",
  ok:false, why:"En IPv6 solo el origen puede fragmentar. El router descarta y envía ICMPv6 <i>Packet Too Big</i>; por eso bloquear ICMPv6 rompe IPv6."}
]}

]});
