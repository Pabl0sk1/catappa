window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Direcciones IP y subredes",
resumen: "IPv4, redes privadas, máscaras, CIDR, cálculo de subredes, puerta de enlace, DHCP e IPv6",
nivel: "Fundamentos",
color: "#5ac4e6",
lecciones: [

{
id:"rd3l1",
titulo:"La dirección IPv4",
claves:["Una IPv4 son 32 bits escritos como 4 números de 0 a 255","Identifica un equipo en una red y permite llegar a él desde otras","127.0.0.1 es la propia máquina (localhost)"],
pasos:[
 {t:"info", eti:"La dirección postal", h:"¿Qué es una dirección IP?",
  c:`<p>Una <b>dirección IP</b> identifica un equipo (en realidad, una interfaz de red) para que los paquetes puedan llegar a él desde cualquier red. En IPv4 son <b>32 bits</b>, escritos como 4 números de 0 a 255 separados por puntos:</p>
     <div class="diag">192     .168     .1       .10
11000000.10101000.00000001.00001010      (cada numero = 8 bits = 1 octeto)</div>
     <p>32 bits dan unos 4.300 millones de direcciones. Parece mucho, pero se agotaron hace años: por eso existen las redes privadas, el NAT y el IPv6.</p>`},
 {t:"info", eti:"Direcciones especiales", h:"Las que tienes que reconocer",
  c:`<ul><li><code>127.0.0.1</code> (<b>localhost</b>): la propia máquina. Todo lo que envíes ahí no sale a la red.</li>
     <li><code>0.0.0.0</code>: en un servidor que escucha, significa «en todas las interfaces». Si tu API escucha en 127.0.0.1, solo es accesible desde la misma máquina; en 0.0.0.0, desde fuera.</li>
     <li><code>255.255.255.255</code>: broadcast a la red local.</li>
     <li><code>169.254.x.x</code>: dirección que se asigna el equipo solo cuando no ha conseguido una por DHCP (mala señal). En la nube, <code>169.254.169.254</code> es el servicio de metadatos.</li></ul>`},
 {t:"opcion", p:"Tu API dentro de un contenedor escucha en <code>127.0.0.1:8080</code> y no responde desde fuera aunque publicaste el puerto. ¿Por qué?",
  ops:["Docker no permite el puerto 8080","127.0.0.1 dentro del contenedor es el propio contenedor: debe escuchar en 0.0.0.0","Falta un Service","El firewall de Windows"],
  ok:1, why:"Error clásico. Spring Boot escucha en todas las interfaces por defecto, pero muchos servidores de desarrollo no."},
 {t:"par", p:"Empareja cada dirección con su significado",
  pares:[["127.0.0.1","La propia máquina"],["0.0.0.0 (al escuchar)","Todas las interfaces"],["255.255.255.255","Broadcast local"],["169.254.169.254","Metadatos de la instancia en la nube"]],
  why:"Reconocerlas de un vistazo ahorra mucho tiempo depurando."},
 {t:"vf", p:"El número 256 puede aparecer en una dirección IPv4 válida.",
  ok:false, why:"Cada octeto son 8 bits: de 0 a 255."}
]},

{
id:"rd3l2",
titulo:"Redes privadas y públicas",
claves:["10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16 son rangos privados","Las IP privadas no se enrutan por internet; se repiten en cada red","Para salir a internet se traduce a una IP pública con NAT"],
pasos:[
 {t:"info", eti:"RFC 1918", h:"Rangos privados",
  c:`<p>Se reservaron tres rangos para uso <b>privado</b>. Cualquiera puede usarlos dentro de su red, y por eso <b>no son únicos</b> ni se pueden usar directamente en internet:</p>
     <div class="diag">10.0.0.0    - 10.255.255.255     (10.0.0.0/8)       redes grandes, VPCs, Kubernetes
172.16.0.0  - 172.31.255.255     (172.16.0.0/12)    Docker usa 172.17.x.x por defecto
192.168.0.0 - 192.168.255.255    (192.168.0.0/16)   casas y oficinas</div>
     <p>Una <b>IP pública</b> es única en todo internet y la asigna tu proveedor o tu nube. Tu router de casa tiene una pública hacia fuera y usa privadas dentro.</p>`},
 {t:"opcion", p:"¿Cuál de estas direcciones es privada?",
  ops:["8.8.8.8","172.20.5.4","142.250.184.14","172.32.0.1"],
  ok:1, why:"172.16 a 172.31 es privado. 172.32.0.1 ya queda fuera del rango."},
 {t:"par", p:"Empareja cada dirección con su tipo",
  pares:[["10.0.3.25","Privada (10/8)"],["192.168.1.1","Privada (192.168/16)"],["172.17.0.2","Privada: red por defecto de Docker"],["8.8.8.8","Pública: DNS de Google"]],
  why:"Si ves 172.17.x.x en un log, casi seguro es un contenedor Docker."},
 {t:"vf", p:"Dos casas distintas pueden usar la misma dirección 192.168.1.10 a la vez sin conflicto.",
  ok:true, why:"Son redes privadas independientes. Al salir a internet, el NAT de cada router usa su IP pública."}
]},

{
id:"rd3l3",
titulo:"Máscara y notación CIDR",
claves:["La máscara separa la parte de red y la parte de equipo","/24 = 255.255.255.0: 256 direcciones, 254 usables","Direcciones en un /n: 2 elevado a (32 − n)"],
pasos:[
 {t:"info", eti:"Red y equipo", h:"Qué es la máscara",
  c:`<p>Una IP tiene dos partes: la de <b>red</b> (qué red es) y la de <b>equipo</b> (qué máquina dentro de esa red). La <b>máscara</b> dice dónde está el corte.</p>
     <div class="diag">IP:       192.168.1.10
mascara:  255.255.255.0     = 24 bits a 1  ->  /24
red:      192.168.1.0       (los 24 primeros bits)
equipos:  192.168.1.1 a 192.168.1.254
broadcast 192.168.1.255</div>
     <p>La <b>notación CIDR</b> escribe la máscara como el número de bits de red: <code>192.168.1.0/24</code>.</p>`},
 {t:"info", eti:"Contar", h:"¿Cuántas direcciones tiene un bloque?",
  c:`<p>Direcciones = 2<sup>(32 − prefijo)</sup>. En una red clásica se restan 2 (la dirección de red y la de broadcast).</p>
     <div class="diag">/32 -> 1 direccion       (un solo equipo)
/30 -> 4                 (2 usables)
/28 -> 16
/24 -> 256               (254 usables)
/20 -> 4.096
/16 -> 65.536
/8  -> 16.777.216
/0  -> todas             (0.0.0.0/0 = "cualquier IP")</div>
     <p>En AWS, cada subred reserva 5 direcciones, no 2: un /24 deja 251 usables.</p>`},
 {t:"par", p:"Empareja cada prefijo con su número de direcciones",
  pares:[["/32","1"],["/28","16"],["/24","256"],["/16","65.536"],["/0","Todas las direcciones"]],
  why:"Cada bit menos de prefijo duplica el tamaño."},
 {t:"opcion", p:"En una regla de cortafuegos ves <code>0.0.0.0/0</code> en el origen. ¿Qué significa?",
  ops:["Ninguna IP","Cualquier IP de internet","Solo localhost","La red local"],
  ok:1, why:"Prefijo 0: no se fija ningún bit, así que coincide con todo. Abrir SSH a 0.0.0.0/0 es un fallo típico de seguridad."},
 {t:"hueco", p:"Completa: la máscara de un <code>/24</code> en formato decimal es",
  tpl:"255.255.___.0", banco:["255","0","128","240"], sol:["255"],
  why:"/24 son tres octetos completos a 1: 255.255.255.0."},
 {t:"vf", p:"Un bloque /16 contiene exactamente el doble de direcciones que un /17.",
  ok:true, why:"Un bit menos de prefijo deja un bit más para equipos: el doble."}
]},

{
id:"rd3l4",
titulo:"Dividir en subredes",
claves:["Subnetting: partir un bloque grande en bloques más pequeños","Un /16 se puede partir en 256 subredes /24","Mismo prefijo de red = misma subred = se hablan sin router"],
pasos:[
 {t:"info", eti:"Repartir el espacio", h:"¿Por qué subredes?",
  c:`<p>Al diseñar una red (o una VPC en la nube), partes un bloque grande en <b>subredes</b> para separar funciones:</p>
     <div class="diag">VPC 10.0.0.0/16  (65.536 direcciones)
 |- 10.0.1.0/24   publica  zona A   (balanceadores)
 |- 10.0.2.0/24   publica  zona B
 |- 10.0.11.0/24  privada  zona A   (aplicaciones)
 |- 10.0.12.0/24  privada  zona B
 |- 10.0.21.0/24  datos    zona A   (bases de datos)
 '- 10.0.22.0/24  datos    zona B</div>
     <p>Cada subred puede tener reglas de acceso y rutas distintas.</p>`},
 {t:"info", eti:"El truco", h:"¿Están en la misma subred?",
  c:`<p>Dos IPs están en la misma subred si coinciden en los bits del prefijo. Con prefijos múltiplos de 8 es inmediato:</p>
     <ul><li><code>10.0.1.15/24</code> y <code>10.0.1.200/24</code>: los tres primeros octetos iguales → <b>misma subred</b>.</li>
     <li><code>10.0.1.15/24</code> y <code>10.0.2.15/24</code>: el tercero difiere → <b>distintas</b>, necesitan router.</li></ul>
     <p>Con prefijos no múltiplos de 8 se calcula el tamaño del bloque. En un <code>/26</code> los bloques son de 64: .0–.63, .64–.127, .128–.191, .192–.255. Así, <code>192.168.1.70/26</code> pertenece a la red <code>192.168.1.64/26</code>.</p>`},
 {t:"opcion", p:"¿A qué red pertenece <code>192.168.5.130/25</code>?",
  ops:["192.168.5.0/25","192.168.5.128/25","192.168.0.0/25","192.168.5.130/25"],
  ok:1, why:"Un /25 son bloques de 128: .0–.127 y .128–.255. La .130 cae en el segundo."},
 {t:"opcion", p:"Divides <code>10.0.0.0/16</code> en subredes <code>/24</code>. ¿Cuántas salen?",
  ops:["16","24","256","65.536"],
  ok:2, why:"Pasas de 16 a 24 bits de red: 8 bits más = 2⁸ = 256 subredes."},
 {t:"vf", p:"Las VPCs de dos entornos que quieras conectar entre sí deben usar rangos que no se solapen.",
  ok:true, why:"Si ambas usan 10.0.0.0/16, el enrutador no sabría a cuál enviar. Planificar el direccionamiento desde el principio evita migraciones dolorosas."}
]},

{
id:"rd3l5",
titulo:"Puerta de enlace, DHCP e IPv6",
claves:["La puerta de enlace es el router al que se envía todo lo que no es de tu subred","DHCP entrega IP, máscara, gateway y DNS automáticamente","IPv6: 128 bits, direcciones de sobra, sin necesidad de NAT"],
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
     <div class="diag">DISCOVER  equipo -> todos:   "Necesito configuracion"
OFFER     servidor -> equipo: "Te ofrezco 192.168.1.10"
REQUEST   equipo -> servidor: "La acepto"
ACK       servidor -> equipo: "Confirmado, 24 horas"</div>
     <p>Los servidores suelen tener IP fija o una reserva de DHCP para que no cambie.</p>`},
 {t:"orden", p:"Ordena los mensajes de DHCP",
  items:["DISCOVER","OFFER","REQUEST","ACK"],
  why:"Se recuerda como DORA."},
 {t:"info", eti:"El futuro presente", h:"IPv6",
  c:`<p><b>IPv6</b> usa <b>128 bits</b>, escritos en hexadecimal: <code>2001:db8:85a3::8a2e:370:7334</code> (los <code>::</code> resumen ceros seguidos). Hay tantas direcciones que cada dispositivo puede tener una pública y el NAT deja de ser necesario.</p>
     <ul><li><code>::1</code> es el localhost de IPv6.</li>
     <li>Las subredes típicas son <code>/64</code>.</li>
     <li>ARP se sustituye por <b>NDP</b> (Neighbor Discovery).</li></ul>
     <p>Muchos sistemas funcionan en <b>doble pila</b> (IPv4 e IPv6 a la vez). Si algo «a veces conecta y a veces no», revisa si está intentando IPv6.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["Puerta de enlace","Router para salir de tu subred"],["DHCP","Asigna la configuración de red automáticamente"],["::1","Localhost en IPv6"],["IPv6","Direcciones de 128 bits"]],
  why:"Si un equipo tiene IP pero no sale a internet, lo primero es comprobar la puerta de enlace."},
 {t:"term", p:"Muestra la tabla de rutas de tu máquina Linux para ver la puerta de enlace",
  prompt:"pablo@portatil:~$", sol:["ip route","ip r","ip route show","route -n","ip route list"],
  pista:"El comando ip con el objeto route.",
  salida:`default via 192.168.1.1 dev wlan0
192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.10`, why:"La línea default es la puerta de enlace: por ahí sale todo lo que no conoce."}
]}

]});
