window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Cortafuegos y VPN",
resumen: "Cortafuegos con y sin estado, netfilter con iptables y nftables, túneles SSH, WireGuard e IPsec",
nivel: "Avanzado",
color: "#3a9fc6",
lecciones: [

{
id:"rd7l3",
titulo:"Cortafuegos",
claves:["Un cortafuegos filtra tráfico por IP, puerto y protocolo","Con estado: permite automáticamente las respuestas de conexiones iniciadas","Política por defecto: denegar todo y abrir solo lo necesario"],
pasos:[
 {t:"info", eti:"El portero", h:"Qué hace un cortafuegos",
  c:`<p>Un <b>cortafuegos</b> decide qué tráfico pasa, según reglas: origen, destino, puerto, protocolo.</p>
     <ul><li><b>Con estado</b> (stateful): recuerda las conexiones. Si permites la salida hacia un servidor, la respuesta entra automáticamente. Así funcionan los <b>grupos de seguridad</b> de AWS, ufw o firewalld.</li>
     <li><b>Sin estado</b> (stateless): evalúa cada paquete aislado; hay que permitir también el tráfico de vuelta (puertos efímeros). Así funcionan las <b>Network ACL</b> de AWS.</li></ul>
     <p>Principio básico: <b>denegar por defecto</b> y permitir solo lo imprescindible.</p>`},
 {t:"info", eti:"En Linux", h:"ufw, iptables y nftables",
  c:`<div class="termbox">sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose</div>
     <p>Por debajo, ufw genera reglas de <b>iptables</b>/<b>nftables</b>, el filtro de paquetes del kernel (netfilter). Docker y kube-proxy también escriben ahí sus reglas; por eso Docker puede publicar puertos «saltándose» ufw si no se configura con cuidado.</p>`},
 {t:"par", p:"Empareja cada tipo con su ejemplo",
  pares:[["Cortafuegos con estado","Grupos de seguridad de AWS"],["Cortafuegos sin estado","Network ACL de AWS"],["Filtro del kernel Linux","netfilter: iptables y nftables"],["Interfaz sencilla en Ubuntu","ufw"]],
  why:"En AWS, la mayoría de configuraciones solo necesitan grupos de seguridad; las NACL son una capa extra."},
 {t:"opcion", p:"¿Qué reglas de entrada pondrías en el grupo de seguridad de una base de datos PostgreSQL?",
  ops:["5432 desde 0.0.0.0/0","5432 solo desde el grupo de seguridad de la aplicación","Todos los puertos desde la VPC","Ninguna regla y IP pública"],
  ok:1, why:"Referenciar el grupo de la app en lugar de rangos de IP sigue funcionando aunque las instancias cambien."},
 {t:"vf", p:"Publicar un puerto con Docker puede dejarlo accesible desde fuera aunque ufw lo tenga bloqueado.",
  ok:true, why:"Docker inserta sus reglas antes que las de ufw. Publica en 127.0.0.1 (-p 127.0.0.1:5432:5432) o usa la cadena DOCKER-USER."},
 {t:"opcion", p:"Una regla bloquea el puerto 8080. Desde fuera, con DROP el cliente ve un timeout; con REJECT, ¿qué ve?",
  ops:["También un timeout","Un error inmediato: «connection refused» (RST) o un ICMP de puerto inalcanzable","Una página 403","Nada, la conexión funciona"],
  ok:1, why:"DROP descarta en silencio (el cliente reintenta hasta agotar el timeout); REJECT responde. Dentro de tu red, REJECT ahorra esperas al depurar; hacia internet se suele usar DROP para no dar pistas."},
 {t:"opcion", p:"Añades una Network ACL (sin estado) a una subred que permite la entrada por 443 y la salida por 443. Los clientes no reciben respuestas. ¿Qué falta?",
  ops:["Abrir el 80","Permitir la salida hacia los puertos efímeros de los clientes (1024–65535), por donde vuelven las respuestas","Un certificado","Nada, las NACL no afectan a HTTPS"],
  ok:1, why:"Sin estado, cada sentido se evalúa por separado: la respuesta sale desde el 443 del servidor hacia el puerto efímero del cliente, y esa salida hay que permitirla explícitamente."}
]},

{
id:"rd9n1",
titulo:"iptables y nftables en la práctica",
claves:["netfilter procesa cada paquete por tablas (filter, nat, mangle, raw) y cadenas (PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING)","Las reglas se evalúan en orden y gana la primera que coincide; si ninguna, se aplica la política de la cadena","nftables es el sucesor de iptables; hoy el comando iptables suele ser una capa sobre nftables"],
pasos:[
 {t:"info", eti:"netfilter", h:"Tablas, cadenas y el camino de un paquete",
  c:`<p>El filtro del kernel, <b>netfilter</b>, engancha reglas en cinco puntos del camino de un paquete (las <b>cadenas</b>):</p>
     <div class="dg"><div class="dg-tit">por qué cadenas pasa un paquete</div><div class="dg-cols">
     <div class="dg-col"><div class="dg-col-tit">para esta máquina</div><div class="dg-vert"><div class="dg-caja base">entra por la interfaz</div><div class="dg-caja">PREROUTING</div><div class="dg-caja acento">INPUT</div><div class="dg-caja ok">proceso local</div></div></div>
     <div class="dg-col"><div class="dg-col-tit">de paso (router)</div><div class="dg-vert"><div class="dg-caja base">entra por la interfaz</div><div class="dg-caja">PREROUTING</div><div class="dg-caja acento">FORWARD</div><div class="dg-caja">POSTROUTING</div></div></div>
     <div class="dg-col"><div class="dg-col-tit">generado aquí</div><div class="dg-vert"><div class="dg-caja ok">proceso local</div><div class="dg-caja acento">OUTPUT</div><div class="dg-caja">POSTROUTING</div><div class="dg-caja base">sale</div></div></div>
     </div></div>
     <ul><li><b>Tablas</b>: <code>filter</code> (aceptar o bloquear, la de por defecto), <code>nat</code> (traducir direcciones), <code>mangle</code> (modificar cabeceras) y <code>raw</code> (excepciones al seguimiento de conexiones).</li>
     <li>Las reglas de una cadena se evalúan <b>en orden</b>; la primera que coincide con un destino final (<code>ACCEPT</code>, <code>DROP</code>, <code>REJECT</code>) decide. Si ninguna coincide, se aplica la <b>política</b> de la cadena.</li>
     <li>El módulo <b>conntrack</b> da el estado: <code>NEW</code>, <code>ESTABLISHED</code>, <code>RELATED</code>, <code>INVALID</code>. Una regla de «dejar pasar lo establecido» al principio es lo que hace al cortafuegos «con estado».</li></ul>`},
 {t:"info", eti:"Un cortafuegos mínimo", h:"El mismo servidor con iptables y con nftables",
  c:`<div class="termbox"><span class="cm"># iptables: primero lo que no debe cortarse nunca, luego la política</span>
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -s 203.0.113.0/24 -j ACCEPT
iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT
iptables -A INPUT -p icmp -j ACCEPT
iptables -P INPUT DROP</div>
     <div class="termbox"><span class="cm"># /etc/nftables.conf: lo mismo en nftables</span>
table inet filtro {
  chain entrada {
    type filter hook input priority 0; policy drop;
    iif lo accept
    ct state established,related accept
    tcp dport 22 ip saddr 203.0.113.0/24 accept
    tcp dport { 80, 443 } accept
    meta l4proto { icmp, ipv6-icmp } accept
  }
}</div>
     <p><b>nftables</b> sustituye a iptables: una sola herramienta (<code>nft</code>) para IPv4 e IPv6 (familia <code>inet</code>), conjuntos y mapas nativos, y cambios atómicos. En Debian, Ubuntu y RHEL actuales, el comando <code>iptables</code> es <code>iptables-nft</code>: escribe reglas nftables por debajo.</p>
     <div class="nota ojo"><b class="tit">Cómo no quedarte fuera</b>Nunca pongas la política DROP antes de permitir tu SSH, y al tocar un servidor remoto programa una marcha atrás (<code>iptables-apply</code>, o un <code>at now + 5 minutes</code> que restaure las reglas).</div>`},
 {t:"orden", p:"Ordena las cadenas que atraviesa un paquete que llega de internet con destino a un proceso de esta máquina y cuya respuesta vuelve a salir",
  items:["PREROUTING","INPUT","Proceso local","OUTPUT","POSTROUTING"],
  why:"El tráfico hacia la propia máquina pasa por INPUT; el que solo la atraviesa, por FORWARD. Confundirlas es el error típico al montar un router o un nodo de Kubernetes."},
 {t:"par", p:"Empareja cada tabla de netfilter con su uso",
  pares:[["filter","Aceptar o bloquear paquetes"],["nat","Cambiar direcciones y puertos (SNAT, DNAT)"],["mangle","Modificar campos como el MSS o las marcas"],["raw","Excluir tráfico del seguimiento de conexiones"]],
  why:"Si no indicas <code>-t</code>, iptables trabaja sobre <code>filter</code>."},
 {t:"opcion", p:"La cadena INPUT tiene, en este orden: <code>1) DROP todo desde 198.51.100.0/24</code> y <code>2) ACCEPT tcp 443</code>. ¿Qué pasa con una conexión al 443 desde 198.51.100.7?",
  ops:["Se acepta, porque la regla 2 es más concreta","Se descarta: la primera regla que coincide decide","Depende de la política","Se acepta y se registra"],
  ok:1, why:"netfilter no busca la regla más específica (eso es cosa de las rutas): evalúa en orden. Por eso <code>-I</code> inserta al principio y <code>-A</code> añade al final."},
 {t:"hueco", p:"Completa la regla que deja pasar las respuestas de conexiones ya establecidas",
  tpl:"iptables -A ___ -m conntrack --ctstate ___ -j ___",
  banco:["INPUT","ESTABLISHED,RELATED","ACCEPT","OUTPUT","NEW","DROP"], sol:["INPUT","ESTABLISHED,RELATED","ACCEPT"],
  why:"Va al principio de la cadena: la mayoría de los paquetes pertenecen a conexiones existentes y así se resuelven con una sola comparación."},
 {t:"term", p:"Lista las reglas de la cadena INPUT con contadores de paquetes, números de línea y sin resolver nombres",
  prompt:"root@srv:~#", sol:["iptables -L INPUT -n -v --line-numbers","iptables -nvL INPUT --line-numbers","iptables -L INPUT -nv --line-numbers","iptables -vnL INPUT --line-numbers","iptables -L INPUT -v -n --line-numbers","iptables -nL INPUT -v --line-numbers","iptables --line-numbers -nvL INPUT"],
  salida:`Chain INPUT (policy DROP 1832 packets, 97120 bytes)
num   pkts bytes target  prot opt in  out  source           destination
1     120K   18M ACCEPT  all  --  lo  *    0.0.0.0/0        0.0.0.0/0
2    4210K  3.1G ACCEPT  all  --  *   *    0.0.0.0/0        0.0.0.0/0     ctstate RELATED,ESTABLISHED
3      310 18600 ACCEPT  tcp  --  *   *    203.0.113.0/24   0.0.0.0/0     tcp dpt:22
4    51022 3061K ACCEPT  tcp  --  *   *    0.0.0.0/0        0.0.0.0/0     multiport dports 80,443`,
  pista:"-L lista, -n evita DNS, -v añade contadores y --line-numbers numera.",
  why:"Los contadores dicen qué regla está atrapando el tráfico. Si una regla que esperas nunca sube de 0, hay otra antes que lo decide. Con el número de línea puedes borrar: <code>iptables -D INPUT 3</code>."},
 {t:"term", p:"Muestra todas las reglas cargadas en nftables",
  prompt:"root@srv:~#", sol:["nft list ruleset","sudo nft list ruleset"],
  salida:`table inet filtro {
	chain entrada {
		type filter hook input priority filter; policy drop;
		iif "lo" accept
		ct state established,related accept
		ip saddr 203.0.113.0/24 tcp dport 22 accept
		tcp dport { 80, 443 } accept
		meta l4proto { icmp, ipv6-icmp } accept
	}
}`,
  pista:"nft, verbo list, objeto ruleset.",
  why:"Con iptables-nft, las reglas que crean Docker o kube-proxy con «iptables» también aparecen aquí, en tablas <code>ip filter</code> o <code>ip nat</code>. Es la vista completa del filtro del kernel."}
]},

{
id:"rd7l4",
titulo:"VPNs y túneles",
claves:["Una VPN crea un túnel cifrado entre redes o entre un equipo y una red","WireGuard e IPsec son los estándares actuales","Los túneles SSH sirven para acceder puntualmente a servicios privados"],
pasos:[
 {t:"info", eti:"Red privada por internet", h:"VPN",
  c:`<p>Una <b>VPN</b> encapsula tus paquetes dentro de otros paquetes cifrados, de forma que dos redes (o un portátil y una red) se comunican <b>como si estuvieran conectadas directamente</b>, aunque viajen por internet.</p>
     <ul><li><b>Sitio a sitio</b>: la oficina con la VPC de la nube (IPsec es lo habitual con los proveedores).</li>
     <li><b>Acceso remoto</b>: tu portátil con la red de la empresa (WireGuard, OpenVPN, o soluciones «zero trust» como Tailscale).</li></ul>
     <p>El encapsulado añade cabeceras: por eso a veces hay que reducir la <b>MTU</b> dentro de la VPN.</p>`},
 {t:"info", eti:"El túnel rápido", h:"Reenvío de puertos por SSH",
  c:`<div class="termbox"><span class="cm"># acceder a una base de datos privada a través de un bastión</span>
ssh -L 5433:bd-privada.interna:5432 pablo@bastion.miempresa.com
<span class="cm"># ahora, en tu portátil: localhost:5433 llega a la base de datos</span>
psql -h localhost -p 5433 -U app</div>
     <p><code>-L puerto_local:destino:puerto_destino</code>. Es muy útil para depurar sin abrir la base de datos al mundo.</p>`},
 {t:"par", p:"Empareja cada solución con su uso",
  pares:[["IPsec sitio a sitio","Conectar la oficina con la VPC"],["WireGuard","VPN moderna, sencilla y rápida"],["ssh -L","Túnel puntual hacia un servicio privado"],["Bastion","Máquina de salto para entrar a redes privadas"]],
  why:"En la nube moderna el bastión se sustituye a menudo por accesos gestionados (AWS SSM Session Manager)."},
 {t:"hueco", p:"Completa el túnel para que <code>localhost:6380</code> llegue a <code>redis.interno:6379</code> a través del bastión",
  tpl:"ssh ___ 6380:redis.interno:6379 pablo@bastion", banco:["-L","-R","-D","-p"], sol:["-L"],
  why:"-L reenvía un puerto local hacia un destino remoto. -R hace lo contrario y -D crea un proxy SOCKS."},
 {t:"vf", p:"Una VPN añade cabeceras extra a los paquetes, por lo que la MTU efectiva dentro del túnel es menor.",
  ok:true, why:"Si las conexiones grandes se cuelgan pero las pequeñas funcionan dentro de una VPN, sospecha de la MTU."},
 {t:"term", p:"Conéctate por SSH a <code>pablo@10.0.11.8</code> (red privada) saltando a través de <code>pablo@bastion.miempresa.com</code> en un solo comando",
  prompt:"pablo@portatil:~$", sol:["ssh -J pablo@bastion.miempresa.com pablo@10.0.11.8","ssh -J bastion.miempresa.com pablo@10.0.11.8","ssh pablo@10.0.11.8 -J pablo@bastion.miempresa.com","ssh -o ProxyJump=pablo@bastion.miempresa.com pablo@10.0.11.8"],
  salida:`Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-79-generic x86_64)
pablo@app-privada:~$`,
  pista:"La opción -J (ProxyJump).",
  why:"Con -J la clave privada no sale de tu portátil: el bastión solo reenvía la conexión cifrada. En <code>~/.ssh/config</code> se fija con <code>ProxyJump bastion</code>."},
 {t:"opcion", p:"Necesitas navegar desde tu portátil por varias webs internas a través del bastión, sin montar una VPN. ¿Qué opción de ssh usas?",
  ops:["-L con cada puerto","-D 1080, que crea un proxy SOCKS local, y configurar el navegador para usarlo","-R 1080","-X"],
  ok:1, why:"-D convierte SSH en un proxy SOCKS dinámico: cualquier destino, sin reenviar puerto a puerto. Útil para emergencias; para uso diario, una VPN o un acceso zero trust."}
]},

{
id:"rd9n2",
titulo:"WireGuard e IPsec",
claves:["WireGuard: VPN en el kernel sobre UDP, con pares identificados por clave pública y AllowedIPs que hacen de tabla de rutas","IPsec: IKEv2 negocia (UDP 500 y 4500) y ESP cifra; es el estándar de las VPN sitio a sitio con la nube","Rangos que se solapan entre redes a unir son el problema de diseño más común"],
pasos:[
 {t:"info", eti:"La VPN moderna", h:"WireGuard",
  c:`<p><b>WireGuard</b> está en el kernel de Linux desde la versión 5.6. Es pequeño (unas 4.000 líneas), rápido y sin negociación de algoritmos: usa siempre Curve25519, ChaCha20-Poly1305 y BLAKE2s. Funciona sobre <b>UDP</b> (por convención, el <b>51820</b>).</p>
     <div class="termbox"><span class="cm"># /etc/wireguard/wg0.conf en el portátil</span>
[Interface]
PrivateKey = cK4f…=
Address = 10.8.0.2/32
DNS = 10.0.0.2

[Peer]
PublicKey = 9vPq…=                    <span class="cm"># clave pública del servidor</span>
Endpoint = vpn.miempresa.com:51820
AllowedIPs = 10.0.0.0/16, 10.8.0.0/24  <span class="cm"># qué redes van por el túnel</span>
PersistentKeepalive = 25              <span class="cm"># mantiene abierto el NAT</span></div>
     <ul><li>Cada par se identifica por su <b>clave pública</b>. <code>AllowedIPs</code> hace doble papel: al enviar, es la tabla de rutas del túnel; al recibir, la lista de IPs de origen que se aceptan de ese par (<i>cryptokey routing</i>).</li>
     <li><code>AllowedIPs = 0.0.0.0/0, ::/0</code> manda <b>todo</b> el tráfico por la VPN (<i>full tunnel</i>); con rangos concretos, solo el de la empresa (<i>split tunnel</i>).</li>
     <li>La MTU por defecto de la interfaz es <b>1420</b> (1500 menos las cabeceras de IPv6, UDP y WireGuard).</li>
     <li>Tailscale y otras VPN «en malla» son WireGuard con un servidor de coordinación que reparte claves y atraviesa NATs.</li></ul>`},
 {t:"info", eti:"El estándar veterano", h:"IPsec",
  c:`<ul><li><b>IKEv2</b> (UDP <b>500</b>) autentica a los dos extremos (clave precompartida o certificados) y negocia las claves.</li>
     <li><b>ESP</b> (protocolo IP número <b>50</b>, no es TCP ni UDP) cifra los paquetes. Si hay NAT por medio, ESP se encapsula en UDP <b>4500</b> (NAT-T).</li>
     <li>Modo <b>túnel</b> (se cifra el paquete entero y se pone una cabecera nueva: el de las VPN entre redes) y modo <b>transporte</b> (solo la carga útil).</li></ul>
     <p>Es lo que ofrecen las nubes para unir la oficina: AWS Site-to-Site VPN crea <b>dos túneles</b> hacia dos extremos distintos y puede intercambiar rutas por BGP; si solo configuras uno, perderás la conexión en cada mantenimiento de AWS.</p>
     <div class="nota ojo"><b class="tit">El problema de diseño más común</b>La oficina usa 10.0.0.0/16 y la VPC también. Con rangos solapados no hay VPN que los una sin NAT de por medio. Planifica el direccionamiento de toda la organización antes de crear la primera VPC.</div>`},
 {t:"term", p:"Muestra el estado de la interfaz WireGuard y de sus pares",
  prompt:"root@vpn:~#", sol:["wg show","wg","sudo wg show","wg show wg0","sudo wg show wg0"],
  salida:`interface: wg0
  public key: 9vPqXk1eQ2mZ7uR8tY3wS5nB6cD4fG0hJ1kL2aZ3xY8=
  listening port: 51820

peer: Hj5tR2wQ9eN4bV7cX1zL8kM3pA6sD0fG2hJ5kL7qW3E=
  endpoint: 81.44.12.9:53422
  allowed ips: 10.8.0.2/32
  latest handshake: 42 seconds ago
  transfer: 18.34 MiB received, 212.07 MiB sent`,
  pista:"La herramienta de WireGuard se llama wg; el verbo es show.",
  why:"<code>latest handshake</code> es lo primero que se mira: si no aparece o tiene más de dos o tres minutos, el par no está conectado (UDP bloqueado, clave o endpoint erróneos)."},
 {t:"hueco", p:"Completa la configuración del par para que solo el tráfico hacia la VPC <code>10.0.0.0/16</code> vaya por el túnel",
  tpl:"[Peer]\nPublicKey = 9vPq…=\nEndpoint = vpn.miempresa.com:___\n___ = 10.0.0.0/16",
  banco:["51820","AllowedIPs","443","Address","ListenPort","22"], sol:["51820","AllowedIPs"],
  why:"<code>Address</code> es la IP propia dentro del túnel y va en [Interface]; <code>AllowedIPs</code>, en cada [Peer], decide qué destinos se envían a ese par."},
 {t:"opcion", p:"Con WireGuard configurado con <code>AllowedIPs = 0.0.0.0/0</code> en el portátil, ¿qué ocurre?",
  ops:["Solo el tráfico de la empresa va por la VPN","Todo el tráfico IPv4 del portátil, también el de internet, sale por la VPN","La VPN no arranca","Se bloquea internet"],
  ok:1, why:"Es un <i>full tunnel</i>. Da control y filtrado centralizado, pero todo el tráfico carga la salida de la empresa. <code>wg-quick</code> añade las reglas para que el propio tráfico del túnel no se meta en el túnel."},
 {t:"par", p:"Empareja cada elemento de IPsec o WireGuard con su puerto o protocolo",
  pares:[["IKE (IPsec)","UDP 500"],["IPsec con NAT por medio (NAT-T)","UDP 4500"],["ESP","Protocolo IP 50"],["WireGuard (por convención)","UDP 51820"],["BGP sobre el túnel","TCP 179"]],
  why:"Al abrir un cortafuegos para una VPN, olvidar ESP o el 4500 es el fallo más habitual: la negociación sube pero no pasa tráfico."},
 {t:"opcion", p:"El túnel IPsec con AWS aparece «UP», pero desde la oficina no se llega a nada de la VPC. ¿Qué revisas primero?",
  ops:["El certificado del balanceador","Las rutas: la tabla de la VPC hacia la oficina (o la propagación de rutas) y la ruta en el router de la oficina hacia la VPC","El TTL del DNS","El puerto 443"],
  ok:1, why:"Un túnel levantado solo significa que los extremos se entienden. El tráfico necesita rutas en los dos lados y grupos de seguridad que lo permitan."},
 {t:"vf", p:"WireGuard funciona sobre TCP para atravesar mejor los cortafuegos.",
  ok:false, why:"Solo usa UDP. Si una red bloquea todo el UDP saliente, hace falta otra solución (algunos productos encapsulan en TCP o HTTPS a costa de rendimiento)."}
]}

]});
