window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "IPv4 y subnetting",
resumen: "IPv4 en binario, redes privadas y reservadas, máscaras y CIDR, cálculo de subredes a mano, VLSM y resumen de rutas",
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
     <div class="dg"><div class="dg-tit">una IPv4 en decimal y en binario</div><div class="dg-fila"><div class="dg-caja" style="padding:8px 2px">192<small style="font-family:var(--mono)">11000000</small></div><div class="dg-caja" style="padding:8px 2px">168<small style="font-family:var(--mono)">10101000</small></div><div class="dg-caja" style="padding:8px 2px">1<small style="font-family:var(--mono)">00000001</small></div><div class="dg-caja" style="padding:8px 2px">10<small style="font-family:var(--mono)">00001010</small></div></div>
     <div class="dg-nota arriba" style="margin-top:8px">cada número = 8 bits = 1 octeto</div></div>
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
  ok:false, why:"Cada octeto son 8 bits: de 0 a 255."},
 {t:"escribe", p:"¿Qué número decimal es el octeto <code>11000000</code>?",
  sol:["192"], pista:"128 + 64.",
  why:"Los pesos de un octeto son 128, 64, 32, 16, 8, 4, 2, 1. Saberlos de memoria es lo que permite calcular subredes sin calculadora."},
 {t:"codigo", p:"Lee una IPv4 y escribe sus 32 bits en binario: cada octeto con 8 cifras, separados por puntos.",
  lenguaje:"py",
  c:`<p>Ejemplo: <code>192.168.1.10</code> → <code>11000000.10101000.00000001.00001010</code>. En Python, <code>f"{n:08b}"</code> da el número en binario con 8 cifras.</p>`,
  plantilla:"ip = input().strip()\n# convierte cada octeto a binario de 8 cifras y únelos con puntos\n",
  pruebas:[{entrada:"192.168.1.10\n", salida:"11000000.10101000.00000001.00001010"},{entrada:"10.0.0.255\n", salida:"00001010.00000000.00000000.11111111"},{entrada:"172.16.254.1\n", salida:"10101100.00010000.11111110.00000001", oculta:true}],
  pista:"Separa con split('.'), convierte cada trozo con int() y formatea con :08b.",
  solucion:"ip = input().strip()\nprint('.'.join(f'{int(o):08b}' for o in ip.split('.')))",
  why:"Ver la IP en binario es la clave de todo el subnetting: la máscara no es más que una fila de unos seguida de ceros sobre estos 32 bits."}
]},

{
id:"rd3l2",
titulo:"Redes privadas y públicas",
claves:["10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16 son rangos privados","Las IP privadas no se enrutan por internet; se repiten en cada red","Para salir a internet se traduce a una IP pública con NAT"],
pasos:[
 {t:"info", eti:"RFC 1918", h:"Rangos privados",
  c:`<p>Se reservaron tres rangos para uso <b>privado</b>. Cualquiera puede usarlos dentro de su red, y por eso <b>no son únicos</b> ni se pueden usar directamente en internet:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">rangos de IP privadas</div><table class="dg-tabla"><thead><tr><th>rango</th><th>CIDR</th><th>uso típico</th></tr></thead><tbody><tr><td>10.0.0.0 - 10.255.255.255</td><td><code>10.0.0.0/8</code></td><td>redes grandes, VPCs, Kubernetes</td></tr><tr><td>172.16.0.0 - 172.31.255.255</td><td><code>172.16.0.0/12</code></td><td>Docker usa 172.17.x.x por defecto</td></tr><tr><td>192.168.0.0 - 192.168.255.255</td><td><code>192.168.0.0/16</code></td><td>casas y oficinas</td></tr></tbody></table></div>
     <p>Una <b>IP pública</b> es única en todo internet y la asigna tu proveedor o tu nube. Tu router de casa tiene una pública hacia fuera y usa privadas dentro.</p>`},
 {t:"opcion", p:"¿Cuál de estas direcciones es privada?",
  ops:["8.8.8.8","172.20.5.4","142.250.184.14","172.32.0.1"],
  ok:1, why:"172.16 a 172.31 es privado. 172.32.0.1 ya queda fuera del rango."},
 {t:"par", p:"Empareja cada dirección con su tipo",
  pares:[["10.0.3.25","Privada (10/8)"],["192.168.1.1","Privada (192.168/16)"],["172.17.0.2","Privada: red por defecto de Docker"],["8.8.8.8","Pública: DNS de Google"]],
  why:"Si ves 172.17.x.x en un log, casi seguro es un contenedor Docker."},
 {t:"vf", p:"Dos casas distintas pueden usar la misma dirección 192.168.1.10 a la vez sin conflicto.",
  ok:true, why:"Son redes privadas independientes. Al salir a internet, el NAT de cada router usa su IP pública."},
 {t:"info", eti:"Más rangos reservados", h:"CGNAT, documentación y otros que verás",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">otros rangos reservados</div><table class="dg-tabla"><thead><tr><th>rango</th><th>para qué</th></tr></thead><tbody><tr><td><code>100.64.0.0/10</code></td><td>CGNAT: el NAT del propio operador. Si tu router «público» tiene una 100.x, estás detrás de otro NAT y no podrás abrir puertos</td></tr><tr><td><code>169.254.0.0/16</code></td><td>enlace local (sin DHCP) y metadatos en la nube</td></tr><tr><td><code>127.0.0.0/8</code></td><td>loopback: toda la /8 es la propia máquina</td></tr><tr><td><code>192.0.2.0/24</code>, <code>198.51.100.0/24</code>, <code>203.0.113.0/24</code></td><td>documentación y ejemplos: nunca se enrutan</td></tr><tr><td><code>224.0.0.0/4</code></td><td>multicast</td></tr></tbody></table></div>
     <p>Para saber tu IP pública, pregunta a un servicio externo: tu equipo solo conoce su IP privada.</p>`},
 {t:"term", p:"Averigua desde la terminal la IP pública con la que sales a internet (usa el servicio <code>ifconfig.me</code>)",
  prompt:"pablo@portatil:~$", sol:["curl ifconfig.me","curl -s ifconfig.me","curl https://ifconfig.me","curl -s https://ifconfig.me","curl http://ifconfig.me"],
  salida:`203.0.113.47`,
  pista:"Haz una petición HTTP con curl a ese dominio.",
  why:"<code>ip addr</code> te enseña 192.168.1.10; el servidor remoto ve 203.0.113.47, la IP pública del NAT. Es la que tienes que dar para abrir un cortafuegos a tu oficina."},
 {t:"opcion", p:"El router de tu oficina dice que su IP «de internet» es <code>100.72.14.3</code> y no consigues publicar un servicio abriendo un puerto. ¿Por qué?",
  ops:["El puerto está mal escrito","Es una IP de CGNAT: hay otro NAT del operador delante y no controlas sus puertos","100.x es una IP de IPv6","El DNS no ha propagado"],
  ok:1, why:"100.64.0.0/10 lo usan los operadores para compartir IPs públicas. Soluciones: pedir IP pública fija, usar IPv6 o un túnel saliente."}
]},

{
id:"rd3l3",
titulo:"Máscara y notación CIDR",
claves:["La máscara separa la parte de red y la parte de equipo","/24 = 255.255.255.0: 256 direcciones, 254 usables","Direcciones en un /n: 2 elevado a (32 − n)"],
pasos:[
 {t:"info", eti:"Red y equipo", h:"Qué es la máscara",
  c:`<p>Una IP tiene dos partes: la de <b>red</b> (qué red es) y la de <b>equipo</b> (qué máquina dentro de esa red). La <b>máscara</b> dice dónde está el corte.</p>
     <div class="dg"><div class="dg-tit">IP, máscara y red</div><div class="dg-fila" style="grid-template-columns:3fr 1fr"><div class="dg-caja acento" style="padding:8px 4px">192.168.1<small>red · 24 bits</small></div><div class="dg-caja ok" style="padding:8px 4px">.10<small>equipo · 8</small></div></div>
     <table class="dg-tabla" style="margin-top:10px"><tbody><tr><td>IP</td><td>192.168.1.10</td></tr><tr><td>máscara</td><td>255.255.255.0 = 24 bits a 1 → <b>/24</b></td></tr><tr><td>red</td><td>192.168.1.0 (los 24 primeros bits)</td></tr><tr><td>equipos</td><td>192.168.1.1 a 192.168.1.254</td></tr><tr><td>broadcast</td><td>192.168.1.255</td></tr></tbody></table></div>
     <p>La <b>notación CIDR</b> escribe la máscara como el número de bits de red: <code>192.168.1.0/24</code>.</p>`},
 {t:"info", eti:"Contar", h:"¿Cuántas direcciones tiene un bloque?",
  c:`<p>Direcciones = 2<sup>(32 − prefijo)</sup>. En una red clásica se restan 2 (la dirección de red y la de broadcast).</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">tamaño de cada prefijo</div><table class="dg-tabla"><thead><tr><th>prefijo</th><th>direcciones</th><th>nota</th></tr></thead><tbody><tr><td>/32</td><td>1</td><td>un solo equipo</td></tr><tr><td>/30</td><td>4</td><td>2 usables</td></tr><tr><td>/28</td><td>16</td><td></td></tr><tr><td>/24</td><td>256</td><td>254 usables</td></tr><tr><td>/20</td><td>4.096</td><td></td></tr><tr><td>/16</td><td>65.536</td><td></td></tr><tr><td>/8</td><td>16.777.216</td><td></td></tr><tr><td>/0</td><td>todas</td><td><code>0.0.0.0/0</code> = «cualquier IP»</td></tr></tbody></table></div>
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
  ok:true, why:"Un bit menos de prefijo deja un bit más para equipos: el doble."},
 {t:"escribe", p:"Escribe la máscara de un <code>/26</code> en formato decimal con puntos",
  sol:["255.255.255.192"], pista:"26 bits a 1: tres octetos completos y 2 bits más (128 + 64).",
  why:"Los valores posibles de un octeto de máscara son 128, 192, 224, 240, 248, 252, 254 y 255. Apréndelos: salen en todos los cálculos."},
 {t:"opcion", p:"¿Cuántos equipos puedes direccionar en una subred <code>/27</code> clásica?",
  ops:["32","30","27","62"],
  ok:1, why:"2⁵ = 32 direcciones, menos la de red y la de broadcast: 30 usables."}
]},

{
id:"rd3l4",
titulo:"Dividir en subredes",
claves:["Subnetting: partir un bloque grande en bloques más pequeños","Un /16 se puede partir en 256 subredes /24","Mismo prefijo de red = misma subred = se hablan sin router"],
pasos:[
 {t:"info", eti:"Repartir el espacio", h:"¿Por qué subredes?",
  c:`<p>Al diseñar una red (o una VPC en la nube), partes un bloque grande en <b>subredes</b> para separar funciones:</p>
     <div class="dg dg-arbol"><div class="dg-tit">una VPC repartida en subredes</div><div class="rama" style="--n:0"><span class="nom carpeta">VPC 10.0.0.0/16</span><span class="coment">65.536 direcciones</span></div><div class="rama" style="--n:1"><span class="nom">10.0.1.0/24</span><span class="coment">pública · zona A (balanceadores)</span></div><div class="rama" style="--n:1"><span class="nom">10.0.2.0/24</span><span class="coment">pública · zona B</span></div><div class="rama" style="--n:1"><span class="nom">10.0.11.0/24</span><span class="coment">privada · zona A (aplicaciones)</span></div><div class="rama" style="--n:1"><span class="nom">10.0.12.0/24</span><span class="coment">privada · zona B</span></div><div class="rama" style="--n:1"><span class="nom">10.0.21.0/24</span><span class="coment">datos · zona A (bases de datos)</span></div><div class="rama" style="--n:1"><span class="nom">10.0.22.0/24</span><span class="coment">datos · zona B</span></div></div>
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
  ok:true, why:"Si ambas usan 10.0.0.0/16, el enrutador no sabría a cuál enviar. Planificar el direccionamiento desde el principio evita migraciones dolorosas."},
 {t:"opcion", p:"Un portátil tiene <code>10.0.1.15/24</code> y su puerta de enlace configurada es <code>10.0.2.1</code>. ¿Qué pasa?",
  ops:["Todo funciona","Habla con su subred, pero no puede salir: la puerta de enlace no está en su subred y no la alcanza","Solo falla el DNS","Se asigna otra IP solo"],
  ok:1, why:"La puerta de enlace tiene que estar en la misma subred que el equipo: se le habla por ARP. Un error de una cifra deja al equipo aislado."},
 {t:"escribe", p:"Con máscara <code>/26</code>, ¿en qué red está <code>192.168.1.200</code>? (escribe la dirección de red)",
  sol:["192.168.1.192","192.168.1.192/26"], pista:"Bloques de 64: .0, .64, .128, .192.",
  why:"200 cae entre 192 y 255, así que la red es la .192 y el broadcast la .255."}
]},

{
id:"rd3n1",
titulo:"Subnetting a mano: red, broadcast y rango",
claves:["Tamaño del bloque = 256 − valor de la máscara en el octeto donde cae el corte","La red es el múltiplo del bloque justo por debajo; el broadcast, el siguiente múltiplo menos uno","Direcciones usables = 2^(bits de equipo) − 2"],
pasos:[
 {t:"info", eti:"El método", h:"Calcular cualquier subred en cuatro pasos",
  c:`<p>En una entrevista o en una ventana de cambios no siempre tienes calculadora. Con este método sale cualquier red de cabeza:</p>
     <ol><li><b>Octeto interesante</b>: el octeto donde cae el corte del prefijo (/17–/24 → tercero, /25–/32 → cuarto, /9–/16 → segundo).</li>
     <li><b>Tamaño del bloque</b>: 256 − valor de la máscara en ese octeto.</li>
     <li><b>Red</b>: el múltiplo del bloque que queda justo por debajo (o igual) del valor de la IP en ese octeto. Los octetos de la derecha, a 0.</li>
     <li><b>Broadcast</b>: el siguiente múltiplo menos 1, y los octetos de la derecha a 255.</li></ol>
     <div class="dg dg-tabla-caja"><div class="dg-tit">valor de la máscara y tamaño de bloque en el octeto del corte</div><table class="dg-tabla"><thead><tr><th>bits en el octeto</th><th>valor</th><th>bloque</th><th>prefijos</th></tr></thead><tbody><tr><td>1</td><td>128</td><td>128</td><td>/9, /17, /25</td></tr><tr><td>2</td><td>192</td><td>64</td><td>/10, /18, /26</td></tr><tr><td>3</td><td>224</td><td>32</td><td>/11, /19, /27</td></tr><tr><td>4</td><td>240</td><td>16</td><td>/12, /20, /28</td></tr><tr><td>5</td><td>248</td><td>8</td><td>/13, /21, /29</td></tr><tr><td>6</td><td>252</td><td>4</td><td>/14, /22, /30</td></tr><tr><td>7</td><td>254</td><td>2</td><td>/15, /23, /31</td></tr></tbody></table></div>`},
 {t:"info", eti:"Ejemplo resuelto", h:"172.16.45.200/20",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">172.16.45.200/20 paso a paso</div><table class="dg-tabla"><tbody><tr><td>octeto interesante</td><td>/20 → el tercero (lleva 4 bits de red)</td></tr><tr><td>máscara</td><td>255.255.<b>240</b>.0</td></tr><tr><td>bloque</td><td>256 − 240 = <b>16</b>: 0, 16, 32, 48…</td></tr><tr><td>red</td><td>45 está entre 32 y 47 → <b>172.16.32.0</b></td></tr><tr><td>broadcast</td><td>48 − 1 = 47 → <b>172.16.47.255</b></td></tr><tr><td>rango usable</td><td>172.16.32.1 – 172.16.47.254</td></tr><tr><td>usables</td><td>2<sup>12</sup> − 2 = <b>4.094</b></td></tr></tbody></table></div>
     <div class="nota ojo"><b class="tit">Error típico</b>Olvidar que los octetos a la derecha del interesante también cuentan: el broadcast de un /20 no acaba en .47.0, sino en <b>.47.255</b>.</div>
     <p>Para comprobarlo en la terminal: <code>ipcalc 172.16.45.200/20</code> o, en Python, <code>ipaddress.ip_interface("172.16.45.200/20").network</code>.</p>`},
 {t:"escribe", p:"¿Cuál es la dirección de red de <code>10.20.37.99/27</code>?",
  sol:["10.20.37.96","10.20.37.96/27"], pista:"/27 → bloques de 32 en el cuarto octeto: 0, 32, 64, 96, 128…",
  why:"99 cae en el bloque 96–127. Red 10.20.37.96, broadcast 10.20.37.127."},
 {t:"escribe", p:"¿Cuál es la dirección de broadcast de <code>192.168.50.77/28</code>?",
  sol:["192.168.50.79"], pista:"/28 → bloques de 16: …, 64, 80…",
  why:"77 está en el bloque 64–79: el broadcast es el siguiente múltiplo (80) menos 1."},
 {t:"escribe", p:"¿Cuál es la dirección de broadcast de <code>10.1.130.5/18</code>?",
  sol:["10.1.191.255"], pista:"/18 corta en el tercer octeto con bloques de 64: 0, 64, 128, 192.",
  why:"130 está en el bloque 128–191; el cuarto octeto, a 255. Red 10.1.128.0, broadcast 10.1.191.255."},
 {t:"opcion", p:"¿Cuántas direcciones usables tiene un <code>/22</code>?",
  ops:["1.024","1.022","512","4.094"],
  ok:1, why:"10 bits de equipo: 2¹⁰ = 1.024, menos red y broadcast = 1.022."},
 {t:"codigo", p:"Escribe una calculadora: lee <code>IP/prefijo</code> y muestra la red, el broadcast y el número de direcciones usables",
  lenguaje:"py",
  c:`<p>Formato de salida exacto (tres líneas):</p><div class="termbox">red=172.16.32.0
broadcast=172.16.47.255
usables=4094</div><p>Hazlo con operaciones de bits para entenderlo: convierte la IP a un entero de 32 bits, construye la máscara con <code>(0xFFFFFFFF &lt;&lt; (32 - prefijo)) &amp; 0xFFFFFFFF</code>, y aplica <code>&amp;</code> y <code>|</code>. Para /31 y /32 considera usables 2 y 1 (enlaces punto a punto y hosts sueltos).</p>`,
  plantilla:"ip, prefijo = input().strip().split('/')\nprefijo = int(prefijo)\n# 1) pasa la IP a entero de 32 bits\n# 2) construye la máscara\n# 3) red = ip & mascara ; broadcast = red | (~mascara & 0xFFFFFFFF)\n",
  pruebas:[{entrada:"172.16.45.200/20\n", salida:"red=172.16.32.0\nbroadcast=172.16.47.255\nusables=4094"},{entrada:"192.168.1.10/24\n", salida:"red=192.168.1.0\nbroadcast=192.168.1.255\nusables=254"},{entrada:"10.20.37.99/27\n", salida:"red=10.20.37.96\nbroadcast=10.20.37.127\nusables=30", oculta:true},{entrada:"10.0.0.7/31\n", salida:"red=10.0.0.6\nbroadcast=10.0.0.7\nusables=2", oculta:true},{entrada:"8.8.8.8/32\n", salida:"red=8.8.8.8\nbroadcast=8.8.8.8\nusables=1", oculta:true}],
  pista:"a,b,c,d = map(int, ip.split('.')); n = a&lt;&lt;24 | b&lt;&lt;16 | c&lt;&lt;8 | d. Para volver a texto: '.'.join(str(x &gt;&gt; s &amp; 255) for s in (24,16,8,0)).",
  solucion:"ip, prefijo = input().strip().split('/')\nprefijo = int(prefijo)\na, b, c, d = map(int, ip.split('.'))\nn = a << 24 | b << 16 | c << 8 | d\nmascara = (0xFFFFFFFF << (32 - prefijo)) & 0xFFFFFFFF\nred = n & mascara\nbroad = red | (~mascara & 0xFFFFFFFF)\ntexto = lambda x: '.'.join(str(x >> s & 255) for s in (24, 16, 8, 0))\nif prefijo >= 31:\n    usables = 2 ** (32 - prefijo)\nelse:\n    usables = 2 ** (32 - prefijo) - 2\nprint(f'red={texto(red)}')\nprint(f'broadcast={texto(broad)}')\nprint(f'usables={usables}')",
  why:"Esto es exactamente lo que hace el kernel al decidir si un destino es «de mi subred»: un AND entre la IP y la máscara. El /31 (RFC 3021) se usa en enlaces entre routers para no gastar 4 direcciones."}
]},

{
id:"rd3n2",
titulo:"VLSM y resumen de rutas",
claves:["VLSM: cada subred con el prefijo justo para sus equipos, repartiendo de mayor a menor","El prefijo mínimo para N equipos es el menor bloque con N + 2 ≤ 2^bits","Resumir: varias redes contiguas y alineadas se anuncian como un solo prefijo más corto"],
pasos:[
 {t:"info", eti:"Máscaras de tamaño variable", h:"VLSM: no desperdiciar direcciones",
  c:`<p>Tienes <code>192.168.10.0/24</code> y cuatro necesidades: ventas (100 equipos), desarrollo (50), gestión (20) y un enlace entre dos routers (2). Partir en cuatro /26 no vale: ventas no cabe en 62. Con <b>VLSM</b> cada subred lleva su propio prefijo:</p>
     <ol><li>Ordena de mayor a menor.</li><li>A cada una, el bloque más pequeño en que quepan sus equipos + 2.</li><li>Asigna seguido, empezando por el principio del espacio libre (así los bloques quedan alineados).</li></ol>
     <div class="dg dg-tabla-caja"><div class="dg-tit">reparto VLSM de 192.168.10.0/24</div><table class="dg-tabla"><thead><tr><th>subred</th><th>equipos</th><th>prefijo</th><th>red</th><th>rango usable</th></tr></thead><tbody><tr><td>ventas</td><td>100</td><td>/25 (126)</td><td>192.168.10.0</td><td>.1 – .126</td></tr><tr><td>desarrollo</td><td>50</td><td>/26 (62)</td><td>192.168.10.128</td><td>.129 – .190</td></tr><tr><td>gestión</td><td>20</td><td>/27 (30)</td><td>192.168.10.192</td><td>.193 – .222</td></tr><tr><td>enlace</td><td>2</td><td>/30 (2)</td><td>192.168.10.224</td><td>.225 – .226</td></tr><tr><td>libre</td><td></td><td></td><td>192.168.10.228</td><td>hasta .255</td></tr></tbody></table></div>
     <p>En la nube es igual: deja siempre hueco libre para crecer. Ampliar una subred después suele significar recrearla.</p>`},
 {t:"info", eti:"Menos rutas", h:"Resumen (agregación) de rutas",
  c:`<p>Si una sede tiene <code>10.1.0.0/24</code>, <code>10.1.1.0/24</code>, <code>10.1.2.0/24</code> y <code>10.1.3.0/24</code>, el resto de la red no necesita cuatro rutas: basta con <b>una</b>, <code>10.1.0.0/22</code>, que las cubre exactamente.</p>
     <p>Se puede resumir cuando las redes son <b>contiguas</b>, su número es potencia de 2 y la primera está <b>alineada</b> con el bloque grande (su dirección es múltiplo del tamaño del bloque resumen).</p>
     <p>Ventajas: tablas de rutas más pequeñas y estables (si cae una /24 interna, el resumen no cambia). Y como los routers eligen siempre la ruta <b>más específica</b>, puedes tener un resumen y a la vez una excepción más concreta.</p>
     <div class="nota"><b class="tit">En la práctica</b>Por eso se reserva un bloque grande por región o sede (un /16 por VPC, un /20 por oficina): luego todo se anuncia con una sola ruta.</div>`},
 {t:"escribe", p:"¿Cuál es el prefijo más pequeño (el bloque justo) en el que caben 60 equipos? (escribe, por ejemplo, /24)",
  sol:["/26","26"], pista:"60 + 2 = 62. ¿Qué potencia de 2 es la primera que llega?",
  why:"2⁶ = 64 ≥ 62, así que hacen falta 6 bits de equipo: 32 − 6 = /26."},
 {t:"opcion", p:"¿Qué prefijo resume exactamente de <code>172.16.8.0/24</code> a <code>172.16.15.0/24</code> (ocho redes)?",
  ops:["172.16.8.0/22","172.16.8.0/21","172.16.0.0/20","172.16.8.0/24"],
  ok:1, why:"Ocho /24 = 2³: se quitan 3 bits → /21. Y 8 es múltiplo de 8, así que está alineado: 172.16.8.0/21 cubre de .8 a .15."},
 {t:"vf", p:"<code>10.1.1.0/24</code> y <code>10.1.2.0/24</code> se pueden resumir exactamente como <code>10.1.1.0/23</code>.",
  ok:false, why:"Un /23 empieza en un tercer octeto par: 10.1.0.0/23 cubre .0 y .1, y 10.1.2.0/23 cubre .2 y .3. Estas dos redes no están alineadas; el resumen mínimo sería 10.1.0.0/22, que incluye dos redes de más."},
 {t:"orden", p:"Ordena los pasos para repartir un bloque con VLSM",
  items:["Ordenar las subredes de mayor a menor número de equipos","Calcular el prefijo justo de cada una (equipos + 2)","Asignar la primera al principio del bloque","Asignar la siguiente en la primera dirección libre","Dejar documentado el espacio que queda libre"],
  why:"Empezar por las grandes garantiza que todos los bloques queden alineados sin huecos inútiles."},
 {t:"codigo", p:"Lee un número de equipos y escribe el prefijo mínimo de la subred que los aloja (formato <code>/n</code>)",
  lenguaje:"py",
  c:`<p>Hacen falta N + 2 direcciones (red y broadcast). Busca el menor número de bits de equipo <i>b</i> con N + 2 ≤ 2<sup>b</sup> y escribe <code>/</code> seguido de 32 − b. Ejemplos: 100 → <code>/25</code>, 2 → <code>/30</code>.</p>`,
  plantilla:"n = int(input())\n# busca los bits de equipo necesarios\n",
  pruebas:[{entrada:"100\n", salida:"/25"},{entrada:"2\n", salida:"/30"},{entrada:"60\n", salida:"/26", oculta:true},{entrada:"500\n", salida:"/23", oculta:true},{entrada:"254\n", salida:"/24", oculta:true}],
  pista:"Empieza con b = 2 y súbelo mientras 2**b &lt; n + 2.",
  solucion:"n = int(input())\nb = 2\nwhile 2 ** b < n + 2:\n    b += 1\nprint(f'/{32 - b}')",
  why:"Es el primer paso de todo diseño VLSM. Fíjate en 254: cabe justo en un /24; con 255 ya necesitarías un /23."},
 {t:"codigo", p:"Lee redes en CIDR (una por línea, hasta el final de la entrada) y escribe el resumen mínimo, una red por línea, en orden",
  lenguaje:"py",
  c:`<p>Usa <code>ipaddress.collapse_addresses()</code>, que junta las redes contiguas y alineadas. Si no se pueden juntar, salen tal cual.</p>`,
  plantilla:"import sys, ipaddress\nredes = [ipaddress.ip_network(l.strip()) for l in sys.stdin if l.strip()]\n# resume y escribe una red por línea\n",
  pruebas:[{entrada:"10.1.0.0/24\n10.1.1.0/24\n10.1.2.0/24\n10.1.3.0/24\n", salida:"10.1.0.0/22"},{entrada:"10.1.1.0/24\n10.1.2.0/24\n", salida:"10.1.1.0/24\n10.1.2.0/24"},{entrada:"172.16.12.0/23\n172.16.8.0/22\n172.16.14.0/23\n", salida:"172.16.8.0/21", oculta:true}],
  pista:"for r in ipaddress.collapse_addresses(redes): print(r)",
  solucion:"import sys, ipaddress\nredes = [ipaddress.ip_network(l.strip()) for l in sys.stdin if l.strip()]\nfor r in ipaddress.collapse_addresses(redes):\n    print(r)",
  why:"El segundo caso es la trampa de la alineación: dos /24 contiguas que no forman un /23. Los routers y las herramientas de IPAM hacen este cálculo continuamente."}
]}

]});
