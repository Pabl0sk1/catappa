window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Redes de contenedores y de la nube",
resumen: "Namespaces de red, bridges y veth, redes de Docker, el modelo de Kubernetes, VPC y seguridad de red moderna",
nivel: "Experto",
color: "#2887b0",
lecciones: [

{
id:"rd10l1",
titulo:"Cómo funciona la red de un contenedor",
claves:["Cada contenedor tiene su propio namespace de red: interfaces, rutas y puertos propios","Un par veth une el contenedor con un bridge del host","La publicación de puertos y la salida a internet se hacen con NAT de iptables/nftables"],
pasos:[
 {t:"info", eti:"Por dentro", h:"Namespaces de red",
  c:`<p>Un contenedor no es una máquina virtual: es un proceso con su propio <b>namespace de red</b>. Tiene sus interfaces, su tabla de rutas y sus puertos, separados de los del host.</p>
     <div class="dg dg-arbol"><div class="dg-tit">la red de Docker en el host</div><div class="rama" style="--n:0"><span class="nom carpeta">host</span></div><div class="rama" style="--n:1"><span class="nom">eth0 (192.168.1.50)</span><span class="coment">interfaz real</span></div><div class="rama" style="--n:1"><span class="nom carpeta">docker0 (172.17.0.1)</span><span class="coment">bridge = switch virtual</span></div><div class="rama" style="--n:2"><span class="nom">vethA</span><span class="coment">↔ eth0 del contenedor 1 (172.17.0.2)</span></div><div class="rama" style="--n:2"><span class="nom">vethB</span><span class="coment">↔ eth0 del contenedor 2 (172.17.0.3)</span></div><div class="rama" style="--n:1"><span class="nom">iptables</span><span class="coment">NAT de salida (masquerade) y DNAT de los puertos publicados</span></div></div>
     <p>Un <b>par veth</b> es como un cable virtual con dos extremos: uno dentro del contenedor y otro enchufado al bridge.</p>`},
 {t:"par", p:"Empareja cada pieza con su equivalente físico",
  pares:[["Namespace de red","Una máquina con su propia configuración de red"],["Par veth","Un cable con dos extremos"],["Bridge docker0","Un switch"],["Masquerade de iptables","El NAT del router de casa"]],
  why:"Con estas cuatro piezas se construyen las redes de Docker y de muchos plugins de Kubernetes."},
 {t:"info", eti:"Modos de Docker", h:"Tipos de red en Docker",
  c:`<ul><li><b>bridge</b> (por defecto y definidas por el usuario): red privada en el host con NAT. Las definidas por el usuario tienen DNS entre contenedores.</li>
     <li><b>host</b>: el contenedor usa la red del host directamente, sin aislamiento ni NAT.</li>
     <li><b>none</b>: sin red.</li>
     <li><b>overlay</b>: une contenedores de varios hosts (Swarm) con túneles VXLAN.</li>
     <li><b>macvlan</b>: el contenedor aparece en la red física con su propia MAC.</li></ul>`},
 {t:"opcion", p:"¿Qué modo de red elimina el NAT y el aislamiento de red de un contenedor?",
  ops:["bridge","host","none","overlay"],
  ok:1, why:"Con --network host el proceso ve las interfaces del host. Útil para rendimiento, peor para aislamiento."},
 {t:"vf", p:"Dos contenedores en redes bridge distintas definidas por el usuario pueden comunicarse directamente por defecto.",
  ok:false, why:"Cada red es un bridge aislado. Para que se vean, conecta un contenedor a ambas redes."}
]},

{
id:"rd10l2",
titulo:"El modelo de red de Kubernetes",
claves:["Cada pod tiene su IP y todos los pods se ven entre sí sin NAT","El plugin CNI (Calico, Cilium, Flannel) implementa esa red","Los Services dan una IP virtual estable; kube-proxy o eBPF la traducen a pods"],
pasos:[
 {t:"info", eti:"Las reglas", h:"Lo que exige Kubernetes",
  c:`<ul><li>Cada <b>pod tiene su propia IP</b>.</li>
     <li>Todos los pods pueden comunicarse con todos los pods <b>sin NAT</b>, estén en el nodo que estén.</li>
     <li>Los nodos pueden comunicarse con todos los pods.</li></ul>
     <p>Kubernetes no implementa esto por sí mismo: lo hace el <b>plugin CNI</b>. Unos usan <b>overlay</b> (encapsulan con VXLAN o Geneve), otros <b>enrutan</b> directamente (BGP en Calico), y en la nube suelen dar a los pods IPs reales de la VPC (AWS VPC CNI).</p>`},
 {t:"info", eti:"IPs estables", h:"Services por dentro",
  c:`<p>Un Service recibe una <b>ClusterIP</b> virtual que no pertenece a ninguna interfaz. Cuando un pod envía a esa IP, reglas en cada nodo la traducen (DNAT) a la IP de uno de los pods listos:</p>
     <ul><li><b>kube-proxy</b> en modo iptables o IPVS escribe esas reglas.</li>
     <li><b>Cilium</b> con <b>eBPF</b> lo hace en el kernel sin iptables, más rápido a gran escala y con visibilidad de flujos (Hubble).</li></ul>`},
 {t:"par", p:"Empareja cada componente con su función",
  pares:[["CNI","Dar IP y conectividad a los pods"],["ClusterIP","IP virtual estable de un Service"],["kube-proxy","Traducir IPs de Service a IPs de pods"],["eBPF (Cilium)","Red y políticas programables en el kernel"],["CoreDNS","Nombres DNS de Services"]],
  why:"Saber que la ClusterIP es virtual explica por qué no responde a ping."},
 {t:"opcion", p:"Haces <code>ping</code> a la ClusterIP de un Service y no responde, pero <code>curl</code> a su puerto funciona. ¿Es un problema?",
  ops:["Sí, el Service está roto","No: la ClusterIP es virtual y solo se traducen los puertos definidos; ICMP no se reenvía","Hay que reiniciar CoreDNS","Falta un Ingress"],
  ok:1, why:"Con kube-proxy en modo iptables el ping a una ClusterIP normalmente no responde. Se prueba siempre con el puerto."},
 {t:"vf", p:"En Kubernetes, un pod de un nodo puede llegar a la IP de un pod de otro nodo sin NAT.",
  ok:true, why:"Es uno de los requisitos básicos del modelo de red de Kubernetes."}
]},

{
id:"rd10l3",
titulo:"Redes en la nube: VPC",
claves:["Una VPC es tu red privada en la nube, dividida en subredes por zona","Subred pública = ruta a un Internet Gateway; privada = sale por NAT o no sale","Peering, Transit Gateway y endpoints privados conectan VPCs y servicios"],
pasos:[
 {t:"info", eti:"Tu centro de datos virtual", h:"Anatomía de una VPC",
  c:`<div class="dg"><div class="dg-tit">una VPC por dentro (zona A)</div><div class="dg-caja base" style="padding:10px"><div style="font-weight:700;color:var(--ink);margin-bottom:8px">VPC <code>10.0.0.0/16</code></div><div class="dg-pila">
     <div class="dg-caja  doble" style="text-align:left">subred pública A <code>10.0.1.0/24</code><small>ruta 0.0.0.0/0 → Internet Gateway</small><small>balanceador, NAT Gateway</small></div>
     <div class="dg-caja acento doble" style="text-align:left">subred privada A <code>10.0.11.0/24</code><small>ruta 0.0.0.0/0 → NAT Gateway</small><small>aplicaciones, nodos de Kubernetes</small></div>
     <div class="dg-caja ok doble" style="text-align:left">subred de datos A <code>10.0.21.0/24</code><small>sin salida a internet</small><small>RDS, caché</small></div>
     </div></div>
     <div class="dg-nota arriba" style="margin-top:8px">y lo mismo repetido en la zona B y C para alta disponibilidad</div></div>
     <p>Lo que hace «pública» una subred es su <b>tabla de rutas</b>: tener una ruta al <b>Internet Gateway</b>.</p>`},
 {t:"par", p:"Empareja cada componente de VPC con su función",
  pares:[["Internet Gateway","Conecta la VPC con internet en ambos sentidos"],["NAT Gateway","Salida a internet para subredes privadas"],["Grupo de seguridad","Cortafuegos con estado por recurso"],["VPC Peering","Conectar dos VPCs directamente"],["VPC Endpoint","Acceder a servicios de AWS (S3, ECR) sin salir a internet"]],
  why:"Los endpoints ahorran costes de NAT y mantienen el tráfico dentro de la red del proveedor."},
 {t:"opcion", p:"Tus nodos privados descargan terabytes de imágenes de ECR y S3 y la factura del NAT Gateway se dispara. ¿Qué haces?",
  ops:["Pasar los nodos a subredes públicas","Crear VPC Endpoints para S3 y ECR para que ese tráfico no pase por el NAT","Quitar el NAT","Cambiar de región"],
  ok:1, why:"Los NAT Gateway cobran por GB procesado; los endpoints de tipo gateway para S3 son gratuitos."},
 {t:"opcion", p:"Tienes 15 VPCs que deben comunicarse entre sí y con la oficina. ¿Qué escala mejor que decenas de peerings?",
  ops:["Más peerings","Un Transit Gateway como centro de conexiones","Poner todo en una VPC","IPs públicas en todo"],
  ok:1, why:"El peering no es transitivo y crece de forma cuadrática; el Transit Gateway es un modelo de estrella."},
 {t:"vf", p:"Una instancia en una subred privada sin NAT ni endpoints no puede descargar actualizaciones de internet.",
  ok:true, why:"No tiene ruta de salida. Es intencionado para bases de datos y cargas sensibles."}
]},

{
id:"rd10l4",
titulo:"Seguridad de red moderna",
claves:["Defensa en profundidad: varias capas de filtrado","Zero trust: no confiar en la red, autenticar cada petición","Microsegmentación con NetworkPolicies y mTLS entre servicios"],
pasos:[
 {t:"info", eti:"Más allá del perímetro", h:"De castillo y foso a zero trust",
  c:`<p>El modelo clásico: un cortafuegos fuerte en el borde y confianza total dentro. Problema: si un atacante entra, se mueve libremente (<b>movimiento lateral</b>).</p>
     <p><b>Zero trust</b>: la red no da confianza por sí misma. Cada petición se <b>autentica y autoriza</b>, venga de donde venga:</p>
     <ul><li>mTLS entre servicios con identidades (SPIFFE).</li>
     <li><b>Microsegmentación</b>: NetworkPolicies que solo permiten los flujos necesarios.</li>
     <li>Acceso de personas por proxy con identidad (SSO, dispositivos gestionados) en lugar de VPN plana.</li></ul>`},
 {t:"par", p:"Empareja cada capa de defensa con su ejemplo",
  pares:[["Borde","WAF y protección DDoS delante del balanceador"],["Red","Subredes privadas y grupos de seguridad"],["Clúster","NetworkPolicies por namespace y aplicación"],["Servicio","mTLS y autorización entre servicios"],["Aplicación","Validación de entrada y autenticación de usuarios"]],
  why:"Si una capa falla, las demás siguen conteniendo el daño."},
 {t:"info", eti:"Ataques de red", h:"Lo que tienes que saber nombrar",
  c:`<ul><li><b>DDoS</b>: saturar un servicio con tráfico masivo. Defensa: CDN, servicios anti-DDoS, límites de peticiones, autoescalado.</li>
     <li><b>Man in the middle</b>: interceptar la comunicación. Defensa: TLS con verificación de certificados, HSTS.</li>
     <li><b>DNS spoofing</b>: respuestas DNS falsas. Defensa: DNSSEC, resolvedores de confianza, TLS.</li>
     <li><b>SSRF</b>: engañar a tu servidor para que haga peticiones internas (por ejemplo al servicio de metadatos 169.254.169.254). Defensa: validar URLs, IMDSv2, filtrar salidas.</li></ul>`},
 {t:"opcion", p:"Una función de «importar imagen desde URL» permite que un atacante obtenga credenciales llamando a <code>http://169.254.169.254/...</code>. ¿Qué ataque es?",
  ops:["DDoS","SSRF (Server-Side Request Forgery)","XSS","Fuerza bruta"],
  ok:1, why:"Defensas: lista de destinos permitidos, bloquear IPs internas y de metadatos, e IMDSv2 en AWS."},
 {t:"vf", p:"En un modelo zero trust, estar dentro de la red corporativa basta para acceder a los servicios internos.",
  ok:false, why:"Justo lo contrario: la ubicación en la red no otorga confianza; cada acceso se verifica."}
]}

]});
