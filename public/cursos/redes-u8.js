window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Enrutamiento y NAT",
resumen: "Tablas de rutas y rutas estáticas, enrutamiento dinámico con OSPF y BGP, SNAT, DNAT y conntrack",
nivel: "Avanzado",
color: "#3a9fc6",
lecciones: [

{
id:"rd7l1",
titulo:"Enrutamiento",
claves:["Cada router decide el siguiente salto con su tabla de rutas","Gana la ruta más específica (prefijo más largo)","Internet se interconecta con BGP entre sistemas autónomos"],
pasos:[
 {t:"info", eti:"Decidir el camino", h:"La tabla de rutas",
  c:`<p>Un router no conoce el camino completo: solo sabe a quién pasarle el paquete a continuación (el <b>siguiente salto</b>). Lo decide con su <b>tabla de rutas</b>:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">tabla de rutas de una subred en la nube</div><table class="dg-tabla"><thead><tr><th>destino</th><th>siguiente salto</th></tr></thead><tbody><tr><td>10.0.0.0/16</td><td>local (VPC)</td></tr><tr><td>10.1.0.0/16</td><td>conexión con la otra VPC</td></tr><tr><td>192.168.0.0/16</td><td>túnel VPN a la oficina</td></tr><tr><td>0.0.0.0/0</td><td>puerta de salida a internet</td></tr></tbody></table></div>
     <p>Si varias rutas coinciden, gana la <b>más específica</b> (prefijo más largo). Un paquete a 10.0.5.3 coincide con 10.0.0.0/16 y con 0.0.0.0/0: gana /16.</p>`},
 {t:"opcion", p:"Una tabla tiene <code>10.0.0.0/8 → A</code>, <code>10.20.0.0/16 → B</code> y <code>0.0.0.0/0 → C</code>. ¿Por dónde va un paquete a 10.20.4.9?",
  ops:["A","B","C","Se descarta"],
  ok:1, why:"Las tres coinciden, pero /16 es la más específica."},
 {t:"info", eti:"La escala de internet", h:"BGP y sistemas autónomos",
  c:`<p>Internet está formado por unos 75.000 <b>sistemas autónomos</b> (AS): redes de proveedores, nubes y grandes empresas, cada una con un número. Se anuncian entre sí qué bloques de IP pueden alcanzar usando el protocolo <b>BGP</b>.</p>
     <p>Un error en un anuncio BGP puede dejar sin servicio a una empresa entera (ha pasado a grandes redes sociales y proveedores). Dentro de una organización se usan protocolos internos como OSPF, y en Kubernetes, algunos plugins de red (Calico) también usan BGP.</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Siguiente salto","El router al que se pasa el paquete"],["Prefijo más largo","Criterio para elegir entre rutas que coinciden"],["Ruta por defecto","0.0.0.0/0: lo que no coincide con nada más"],["BGP","Protocolo con el que se interconectan las redes de internet"],["Sistema autónomo","Red independiente con su propia política de rutas"]],
  why:"En la nube configurarás tablas de rutas de subred exactamente con estos conceptos."},
 {t:"vf", p:"Cada router de internet conoce el camino completo hasta cada destino.",
  ok:false, why:"Solo decide el siguiente salto; el camino completo es la suma de decisiones locales."},
 {t:"info", eti:"En Linux", h:"Rutas estáticas y reenvío",
  c:`<p>Una <b>ruta estática</b> es una ruta escrita a mano. En Linux:</p>
     <div class="termbox">root@srv:~# ip route add 10.1.0.0/16 via 10.0.0.254 dev eth0      <span class="cm"># hacia la otra red, por ese router</span>
root@srv:~# ip route get 10.1.4.7                                <span class="cm"># ¿qué ruta usaría para este destino?</span>
10.1.4.7 via 10.0.0.254 dev eth0 src 10.0.0.12 uid 0
root@srv:~# sysctl net.ipv4.ip_forward                           <span class="cm"># ¿esta máquina reenvía paquetes ajenos?</span>
net.ipv4.ip_forward = 0</div>
     <ul><li>Un Linux normal <b>no</b> reenvía paquetes de otros: para que haga de router (o de pasarela VPN, o de nodo de Kubernetes) hay que activar <code>ip_forward=1</code>.</li>
     <li>Las rutas creadas con <code>ip route add</code> se pierden al reiniciar: se hacen persistentes en netplan, NetworkManager o systemd-networkd.</li>
     <li>Si dos rutas tienen el mismo prefijo, decide la <b>métrica</b> (menor gana). Entre protocolos distintos, los routers usan la <b>distancia administrativa</b>: una ruta estática suele preferirse a una aprendida por OSPF.</li></ul>`},
 {t:"term", p:"Pregunta al kernel qué ruta, interfaz e IP de origen usaría para llegar a <code>10.1.4.7</code>",
  prompt:"root@srv:~#", sol:["ip route get 10.1.4.7","ip r get 10.1.4.7","ip ro get 10.1.4.7"],
  salida:`10.1.4.7 via 10.0.0.254 dev eth0 src 10.0.0.12 uid 0
    cache`,
  pista:"El objeto route del comando ip tiene una acción get.",
  why:"Mejor que leer la tabla a ojo: aplica el prefijo más largo, las métricas y las reglas de política, y te dice también la IP de origen que se usará."},
 {t:"hueco", p:"Completa la ruta estática para llegar a <code>192.168.50.0/24</code> a través del router <code>10.0.0.1</code>",
  tpl:"ip route ___ 192.168.50.0/24 ___ 10.0.0.1",
  banco:["add","via","get","dev","del","gw"], sol:["add","via"],
  why:"<code>via</code> indica el siguiente salto, que debe estar en una subred directamente conectada; <code>dev</code> fija la interfaz de salida."}
]},

{
id:"rd8n1",
titulo:"Enrutamiento dinámico: OSPF y BGP",
claves:["Los protocolos de enrutamiento reparten rutas solos y reaccionan a caídas de enlaces","OSPF (dentro de una organización) calcula el camino de menor coste con el estado de todos los enlaces","BGP (entre organizaciones) elige por políticas y AS_PATH; un anuncio erróneo puede desviar tráfico de medio internet"],
pasos:[
 {t:"info", eti:"Dentro de casa", h:"IGP y OSPF",
  c:`<p>Con diez routers, escribir rutas a mano no escala y no reacciona si cae un enlace. Los <b>protocolos de enrutamiento</b> intercambian rutas automáticamente. Se dividen en dos familias:</p>
     <ul><li><b>IGP</b> (dentro de una organización): <b>OSPF</b>, IS-IS. Buscan el camino más rápido.</li>
     <li><b>EGP</b> (entre organizaciones): <b>BGP</b>. Busca el camino que permiten las políticas y los contratos.</li></ul>
     <p><b>OSPF</b> es de <b>estado de enlace</b>: cada router anuncia sus enlaces y su <b>coste</b> (por defecto, inverso a la velocidad) a todos los demás. Así todos tienen el mismo mapa completo, y cada uno calcula con el algoritmo de <b>Dijkstra</b> el árbol de caminos más cortos. Si un enlace cae, el aviso se propaga y todos recalculan en segundos (menos de uno con BFD). Las redes grandes se dividen en <b>áreas</b> alrededor del área 0, la troncal, para limitar el tamaño del mapa.</p>`},
 {t:"info", eti:"Entre redes", h:"BGP: el protocolo que sostiene internet",
  c:`<p><b>BGP</b> es de <b>vector de caminos</b>: cada router anuncia a sus vecinos los prefijos que alcanza junto con el <b>AS_PATH</b>, la lista de sistemas autónomos que hay que atravesar. No mira velocidades: elige según políticas.</p>
     <ul><li><b>eBGP</b> entre AS distintos; <b>iBGP</b> para repartir esas rutas dentro del mismo AS.</li>
     <li>Criterios típicos, en orden: mayor <i>local preference</i> (política interna, por ejemplo preferir el tránsito barato), AS_PATH más corto, y desempates. Para que te entre menos tráfico por un enlace, se «alarga» el camino repitiendo tu AS (<i>AS path prepending</i>).</li>
     <li>BGP confía en lo que le anuncian. Un <b>route leak</b> o un secuestro de prefijo desvía tráfico ajeno; <b>RPKI</b> firma qué AS puede originar cada prefijo y los grandes operadores ya descartan anuncios inválidos.</li></ul>
     <p>BGP también vive dentro de los centros de datos: <b>Calico</b> anuncia las redes de los pods, <b>MetalLB</b> anuncia IPs de Services <code>LoadBalancer</code> y las VPN de la nube (AWS Site-to-Site, Direct Connect) intercambian rutas con tu oficina por BGP.</p>`},
 {t:"par", p:"Empareja cada concepto con su descripción",
  pares:[["OSPF","Estado de enlace: todos conocen el mapa y calculan el camino de menor coste"],["BGP","Vector de caminos entre sistemas autónomos, guiado por políticas"],["Área 0","Troncal a la que se conectan las demás áreas de OSPF"],["AS_PATH","Lista de sistemas autónomos que atraviesa una ruta"],["RPKI","Firma qué AS puede anunciar cada prefijo"]],
  why:"Las entrevistas de infraestructura no piden configurar BGP de memoria, pero sí saber explicar estas diferencias."},
 {t:"opcion", p:"Entre dos oficinas hay un enlace de fibra de 10 Gbit/s y otro de respaldo de 100 Mbit/s, ambos con OSPF y costes por defecto. ¿Por dónde va el tráfico?",
  ops:["Se reparte a partes iguales","Por la fibra: tiene menor coste; el respaldo solo se usa si cae","Por el de 100 Mbit/s, que se configuró antes","Por el que tenga menos saltos BGP"],
  ok:1, why:"OSPF elige el menor coste total, y el coste por defecto depende del ancho de banda. Ojo: con el ancho de banda de referencia antiguo (100 Mbit/s), todo lo que va a 100 Mbit/s o más cuesta 1, así que en redes modernas se sube ese valor de referencia."},
 {t:"opcion", p:"Tu empresa tiene dos proveedores de tránsito y quieres que el tráfico <b>entrante</b> prefiera el proveedor A. ¿Qué técnica de BGP usas?",
  ops:["Subir la local preference en tus routers","Alargar el AS_PATH (prepending) en los anuncios que envías al proveedor B","Bajar el TTL","Poner una ruta estática"],
  ok:1, why:"La local preference controla por dónde <b>sale</b> tu tráfico. Para influir en cómo te <b>llega</b>, tienes que hacer que el camino por B parezca más largo al resto de internet."},
 {t:"vf", p:"BGP elige siempre el camino con más ancho de banda disponible.",
  ok:false, why:"BGP no conoce anchos de banda ni latencias: elige según políticas (local preference) y longitud del AS_PATH. Por eso el camino de internet no es necesariamente el más rápido."},
 {t:"term", p:"En un router Linux con FRRouting, muestra el resumen de las sesiones BGP con sus vecinos",
  prompt:"root@router:~#", sol:["vtysh -c \"show bgp summary\"","vtysh -c 'show bgp summary'","vtysh -c \"show ip bgp summary\"","vtysh -c 'show ip bgp summary'","vtysh -c show bgp summary","vtysh -c show ip bgp summary"],
  salida:`IPv4 Unicast Summary (VRF default):
BGP router identifier 10.0.0.1, local AS number 65001 vrf-id 0

Neighbor        V         AS   MsgRcvd   MsgSent   TblVer  InQ OutQ  Up/Down State/PfxRcd   PfxSnt
10.0.0.2        4      65002      1520      1518        0    0    0 1d01h12m            5        3
10.0.0.3        4      65003         0         0        0    0    0    never       Active        0

Total number of neighbors 2`,
  pista:"vtysh ejecuta un comando de FRR con -c; el comando es show bgp summary.",
  why:"El vecino 10.0.0.2 está establecido y nos manda 5 prefijos. El 10.0.0.3 nunca ha subido: <code>Active</code> significa que se intenta conectar sin éxito (TCP 179 bloqueado, IP o AS mal configurados)."},
 {t:"orden", p:"Ordena lo que ocurre en OSPF cuando cae un enlace",
  items:["El router detecta la caída del enlace (o BFD la avisa)","Anuncia el cambio de estado de sus enlaces","El anuncio se propaga a todos los routers del área","Cada router recalcula los caminos más cortos con Dijkstra","Las tablas de rutas se actualizan con el nuevo camino"],
  why:"El tiempo total es la «convergencia». Detectar rápido (BFD) suele ser lo que más la reduce."}
]},

{
id:"rd7l2",
titulo:"NAT",
claves:["NAT traduce direcciones al cruzar un router","SNAT/masquerade: muchas privadas salen con una pública","DNAT/reenvío de puertos: tráfico entrante a una IP privada concreta"],
pasos:[
 {t:"info", eti:"Traducir", h:"NAT de salida",
  c:`<p>Tus dispositivos tienen IP privadas, que no se enrutan en internet. Al salir, el router <b>cambia la IP de origen</b> por su IP pública y apunta la traducción para devolver la respuesta a quien corresponde:</p>
     <div class="dg"><div class="dg-tit">NAT: dos equipos detrás de una IP pública</div><div class="dg-pila" style="gap:12px"><div class="dg-flujo"><div class="dg-caja">portátil<small>192.168.1.10:51234</small></div><div class="dg-caja acento">router</div><div class="dg-caja">85.60.1.2:40001<small>IP pública</small></div><div class="dg-caja base">servidor</div></div><div class="dg-flujo"><div class="dg-caja">móvil<small>192.168.1.11:51234</small></div><div class="dg-caja acento">router</div><div class="dg-caja">85.60.1.2:40002<small>IP pública</small></div><div class="dg-caja base">servidor</div></div></div>
     <table class="dg-tabla" style="margin-top:12px"><thead><tr><th>tabla del router: puerto</th><th>equipo</th></tr></thead><tbody><tr><td>40001</td><td>portátil</td></tr><tr><td>40002</td><td>móvil</td></tr></tbody></table></div>
     <p>Esto se llama <b>SNAT</b> o <b>masquerade</b>. En AWS, el <b>NAT Gateway</b> permite que los servidores de subredes privadas salgan a internet sin ser accesibles desde fuera.</p>`},
 {t:"info", eti:"Entrar", h:"DNAT y reenvío de puertos",
  c:`<p>Al revés: el tráfico que llega a la IP pública en un puerto se <b>redirige</b> a una IP privada. Es el «abrir puertos» del router de casa, y lo que hace Docker con <code>-p 8080:80</code>:</p>
     <div class="dg"><div class="dg-tit">DNAT de un puerto publicado</div><div class="dg-flujo"><div class="dg-caja">host:8080</div><div class="dg-caja acento">DNAT</div><div class="dg-caja ok">172.17.0.2:80<small>contenedor</small></div></div></div>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["SNAT / masquerade","Muchas IP privadas salen con una pública"],["DNAT","Redirigir tráfico entrante a una IP privada"],["docker run -p 8080:80","DNAT del host al contenedor"],["NAT Gateway (AWS)","Salida a internet para subredes privadas"]],
  why:"Docker implementa la publicación de puertos con reglas NAT de iptables (o nftables)."},
 {t:"opcion", p:"Los servidores de una subred privada en AWS no pueden descargar paquetes de internet. ¿Qué falta probablemente?",
  ops:["Un certificado","Un NAT Gateway y la ruta 0.0.0.0/0 hacia él en la tabla de rutas de esa subred","Un registro DNS","HTTP/2"],
  ok:1, why:"Sin IP pública ni NAT, no hay forma de salir."},
 {t:"vf", p:"El NAT, por sí mismo, permite que cualquiera en internet inicie conexiones hacia los equipos privados.",
  ok:false, why:"Justo al contrario: sin reenvío de puertos explícito, las conexiones entrantes no tienen a quién traducirse. Por eso NAT da cierta protección, aunque no es un cortafuegos."},
 {t:"term", p:"Lista en formato de reglas (como se escribirían) todo lo que hay en la tabla <code>nat</code> de iptables de un host con Docker",
  prompt:"root@srv:~#", sol:["iptables -t nat -S","iptables -S -t nat","sudo iptables -t nat -S","iptables-save -t nat"],
  salida:`-P PREROUTING ACCEPT
-P INPUT ACCEPT
-P OUTPUT ACCEPT
-P POSTROUTING ACCEPT
-N DOCKER
-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER
-A POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE
-A DOCKER -i docker0 -j RETURN
-A DOCKER ! -i docker0 -p tcp -m tcp --dport 8080 -j DNAT --to-destination 172.17.0.2:80`,
  pista:"iptables con -t para elegir la tabla y -S para listar como reglas.",
  why:"Ahí están las dos caras del NAT: MASQUERADE (SNAT) para que los contenedores salgan, y DNAT para el <code>-p 8080:80</code>. El kernel recuerda cada traducción en la tabla <b>conntrack</b> (<code>conntrack -L</code>)."},
 {t:"hueco", p:"Completa la regla que hace salir a internet por <code>eth0</code> a los clientes VPN de <code>10.8.0.0/24</code> con la IP del servidor",
  tpl:"iptables -t ___ -A ___ -s 10.8.0.0/24 -o eth0 -j ___",
  banco:["nat","POSTROUTING","MASQUERADE","filter","PREROUTING","DNAT"], sol:["nat","POSTROUTING","MASQUERADE"],
  why:"El SNAT se hace al final (POSTROUTING), cuando ya se sabe por qué interfaz sale. MASQUERADE usa la IP que tenga eth0 en ese momento; con IP fija se puede usar <code>-j SNAT --to-source</code>."},
 {t:"opcion", p:"Un NAT Gateway de la nube empieza a dar errores de conexión cuando cientos de instancias llaman a la misma API externa (misma IP y puerto). ¿Qué se está agotando?",
  ops:["El ancho de banda de la API","Los puertos de origen que el NAT puede asignar hacia ese destino concreto","Las IPs privadas de la VPC","Los registros DNS"],
  ok:1, why:"Cada conexión traducida necesita un puerto de origen único por destino: con una IP pública hay unos 55.000 hacia un mismo destino. Se soluciona con más IPs públicas en el NAT y reutilizando conexiones."}
]}

]});
