window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Enrutamiento, NAT y cortafuegos",
resumen: "Cómo deciden los routers, BGP, NAT y reenvío de puertos, cortafuegos con estado, iptables y VPNs",
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
     <div class="diag">destino          siguiente salto
10.0.0.0/16      local (VPC)
10.1.0.0/16      conexion con la otra VPC
192.168.0.0/16   tunel VPN a la oficina
0.0.0.0/0        puerta de salida a internet</div>
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
  ok:false, why:"Solo decide el siguiente salto; el camino completo es la suma de decisiones locales."}
]},

{
id:"rd7l2",
titulo:"NAT",
claves:["NAT traduce direcciones al cruzar un router","SNAT/masquerade: muchas privadas salen con una pública","DNAT/reenvío de puertos: tráfico entrante a una IP privada concreta"],
pasos:[
 {t:"info", eti:"Traducir", h:"NAT de salida",
  c:`<p>Tus dispositivos tienen IP privadas, que no se enrutan en internet. Al salir, el router <b>cambia la IP de origen</b> por su IP pública y apunta la traducción para devolver la respuesta a quien corresponde:</p>
     <div class="diag">portatil 192.168.1.10:51234  --> router --> 85.60.1.2:40001 --> servidor
movil    192.168.1.11:51234  --> router --> 85.60.1.2:40002 --> servidor
tabla del router: 40001 = portatil, 40002 = movil</div>
     <p>Esto se llama <b>SNAT</b> o <b>masquerade</b>. En AWS, el <b>NAT Gateway</b> permite que los servidores de subredes privadas salgan a internet sin ser accesibles desde fuera.</p>`},
 {t:"info", eti:"Entrar", h:"DNAT y reenvío de puertos",
  c:`<p>Al revés: el tráfico que llega a la IP pública en un puerto se <b>redirige</b> a una IP privada. Es el «abrir puertos» del router de casa, y lo que hace Docker con <code>-p 8080:80</code>:</p>
     <div class="diag">host:8080  --DNAT-->  172.17.0.2:80 (contenedor)</div>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["SNAT / masquerade","Muchas IP privadas salen con una pública"],["DNAT","Redirigir tráfico entrante a una IP privada"],["docker run -p 8080:80","DNAT del host al contenedor"],["NAT Gateway (AWS)","Salida a internet para subredes privadas"]],
  why:"Docker implementa la publicación de puertos con reglas NAT de iptables (o nftables)."},
 {t:"opcion", p:"Los servidores de una subred privada en AWS no pueden descargar paquetes de internet. ¿Qué falta probablemente?",
  ops:["Un certificado","Un NAT Gateway y la ruta 0.0.0.0/0 hacia él en la tabla de rutas de esa subred","Un registro DNS","HTTP/2"],
  ok:1, why:"Sin IP pública ni NAT, no hay forma de salir."},
 {t:"vf", p:"El NAT, por sí mismo, permite que cualquiera en internet inicie conexiones hacia los equipos privados.",
  ok:false, why:"Justo al contrario: sin reenvío de puertos explícito, las conexiones entrantes no tienen a quién traducirse. Por eso NAT da cierta protección, aunque no es un cortafuegos."}
]},

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
  ok:true, why:"Docker inserta sus reglas antes que las de ufw. Publica en 127.0.0.1 (-p 127.0.0.1:5432:5432) o usa la cadena DOCKER-USER."}
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
  c:`<div class="termbox"><span class="cm"># acceder a una base de datos privada a traves de un bastion</span>
ssh -L 5433:bd-privada.interna:5432 pablo@bastion.miempresa.com
<span class="cm"># ahora, en tu portatil: localhost:5433 llega a la base de datos</span>
psql -h localhost -p 5433 -U app</div>
     <p><code>-L puerto_local:destino:puerto_destino</code>. Es muy útil para depurar sin abrir la base de datos al mundo.</p>`},
 {t:"par", p:"Empareja cada solución con su uso",
  pares:[["IPsec sitio a sitio","Conectar la oficina con la VPC"],["WireGuard","VPN moderna, sencilla y rápida"],["ssh -L","Túnel puntual hacia un servicio privado"],["Bastion","Máquina de salto para entrar a redes privadas"]],
  why:"En la nube moderna el bastión se sustituye a menudo por accesos gestionados (AWS SSM Session Manager)."},
 {t:"hueco", p:"Completa el túnel para que <code>localhost:6380</code> llegue a <code>redis.interno:6379</code> a través del bastión",
  tpl:"ssh ___ 6380:redis.interno:6379 pablo@bastion", banco:["-L","-R","-D","-p"], sol:["-L"],
  why:"-L reenvía un puerto local hacia un destino remoto. -R hace lo contrario y -D crea un proxy SOCKS."},
 {t:"vf", p:"Una VPN añade cabeceras extra a los paquetes, por lo que la MTU efectiva dentro del túnel es menor.",
  ok:true, why:"Si las conexiones grandes se cuelgan pero las pequeñas funcionan dentro de una VPN, sospecha de la MTU."}
]}

]});
