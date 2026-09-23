window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Services, DNS y red del clúster",
resumen: "Tipos de Service, EndpointSlices, DNS interno, el modelo de red de Kubernetes, CNI y kube-proxy",
nivel: "Intermedio",
color: "#5b8ce6",
lecciones: [

{
id:"k4l1",
titulo:"Services",
claves:["Un Service da una IP y un nombre DNS estables a un grupo de pods","ClusterIP interno; NodePort; LoadBalancer externo; headless sin IP","port es el del Service; targetPort el del contenedor"],
pasos:[
 {t:"info", eti:"El problema", h:"Pods que cambian de IP",
  c:`<p>Los pods mueren y se recrean con IPs nuevas. Un <b>Service</b> pone delante una <b>IP virtual estable</b> y un <b>nombre DNS</b>, y reparte el tráfico entre los pods que coinciden con su selector.</p>
     <div class="termbox">apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector: { app: api }
  ports:
    - port: 80            <span class="cm"># el puerto del Service</span>
      targetPort: 8080    <span class="cm"># el puerto del contenedor</span></div>
     <p>Cualquier pod del clúster puede llamar a <code>http://api</code>. Kubernetes mantiene la lista de pods destino actualizada (los <b>EndpointSlices</b>).</p>`},
 {t:"par", p:"Empareja cada tipo de Service con su uso",
  pares:[["ClusterIP","Solo accesible dentro del clúster (por defecto)"],["NodePort","Un puerto alto abierto en todos los nodos"],["LoadBalancer","Crea un balanceador del proveedor cloud con IP externa"],["Headless (clusterIP: None)","Sin IP virtual: el DNS devuelve las IPs de los pods"],["ExternalName","Un alias DNS hacia un nombre externo"]],
  why:"Headless es la base de los StatefulSets: cada pod tiene su propio nombre DNS."},
 {t:"opcion", p:"En el Service anterior, ¿a qué puerto llama otro pod: <code>api:80</code> o <code>api:8080</code>?",
  ops:["api:8080","api:80: el Service escucha en port y reenvía al targetPort de los pods","Cualquiera de los dos","Ninguno"],
  ok:1, why:"port es lo que expone el Service; targetPort, dónde escucha el contenedor."},
 {t:"info", eti:"Endpoints", h:"Solo los pods listos reciben tráfico",
  c:`<p>Un pod entra en la lista de destinos del Service <b>solo cuando su readinessProbe pasa</b>. Si ningún pod está listo, el Service no tiene destinos y las peticiones fallan.</p>
     <div class="termbox">kubectl get endpointslices -l kubernetes.io/service-name=api
kubectl describe svc api        <span class="cm"># Endpoints: 10.244.1.5:8080, 10.244.2.7:8080</span></div>
     <p>El objeto antiguo <code>Endpoints</code> está <b>obsoleto desde 1.33</b>: todo lo nuevo (kube-proxy, Ingress, mallas) usa <b>EndpointSlices</b>, que trocean la lista para Services con miles de pods.</p>`},
 {t:"term", p:"Mira los EndpointSlices del Service <code>api</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl get endpointslices -l kubernetes.io/service-name=api","kubectl get endpointslice -l kubernetes.io/service-name=api","kubectl get endpointslices --selector=kubernetes.io/service-name=api","kubectl get endpointslices --selector kubernetes.io/service-name=api"],
  pista:"kubectl get endpointslices con -l kubernetes.io/service-name=api.",
  salida:`NAME        ADDRESSTYPE   PORTS   ENDPOINTS                          AGE
api-x7k2p   IPv4          8080    10.244.1.5,10.244.2.7,10.244.3.4   3d`,
  why:"Tres IPs de pods listos en el puerto 8080 (el targetPort). Si sale &lt;unset&gt; o vacío, el Service no tiene a quién mandar tráfico."},
 {t:"opcion", p:"El Service <code>api</code> existe pero todas las peticiones fallan y <code>describe svc</code> muestra «Endpoints: &lt;none&gt;». ¿Causas probables?",
  ops:["El DNS","El selector no coincide con las labels de los pods, o ningún pod pasa la readinessProbe","Falta un Ingress","El nodo no tiene disco"],
  ok:1, why:"Son las dos causas de un Service sin destinos. Compara el selector con kubectl get pods --show-labels."},
 {t:"codigo", p:"Calcula los endpoints de un Service: las IPs de los pods que cumplen su selector y están listos",
  lenguaje:"js",
  c:`<p>Por stdin llega, en la primera línea, el selector del Service como pares <code>clave=valor</code> separados por comas. Después, una línea por pod: <code>ip listo labels</code>, donde <code>listo</code> es <code>true</code> o <code>false</code> y <code>labels</code> son pares <code>clave=valor</code> separados por comas.</p>
     <p>Un pod es destino si tiene <b>todas</b> las labels del selector con el mismo valor (puede tener más) y está listo. Imprime sus IPs en orden de entrada, una por línea, o <code>&lt;none&gt;</code> si no hay ninguna.</p>`,
  plantilla:"const lineas = require('fs').readFileSync(0, 'utf8').trim().split('\\n');\n// primera línea: selector; resto: ip listo labels\n",
  pruebas:[
   {entrada:"app=api\n10.244.1.5 true app=api,version=1.3\n10.244.2.7 false app=api,version=1.3\n10.244.3.4 true app=web", salida:"10.244.1.5"},
   {entrada:"app=api,tier=back\n10.0.0.1 true app=api\n10.0.0.2 true app=api,tier=back", salida:"10.0.0.2"},
   {entrada:"app=api\n10.0.0.1 true app=Api", salida:"<none>", oculta:true},
   {entrada:"app=api\n10.0.0.1 true tier=back,app=api\n10.0.0.2 true app=api", salida:"10.0.0.1\n10.0.0.2", oculta:true}
  ],
  pista:"Convierte cada lista de pares en un objeto y comprueba que cada clave del selector existe en el pod con el mismo valor.",
  solucion:"const lineas = require('fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst aObj = s => Object.fromEntries(s.split(',').map(p => p.split('=')));\nconst sel = aObj(lineas[0]);\nconst ips = [];\nfor (const l of lineas.slice(1)) {\n  const [ip, listo, labels] = l.trim().split(/\\s+/);\n  const lab = aObj(labels);\n  if (listo === 'true' && Object.keys(sel).every(k => lab[k] === sel[k])) ips.push(ip);\n}\nconsole.log(ips.length ? ips.join('\\n') : '<none>');",
  why:"Es lo que hace el controlador de EndpointSlices en cada cambio. Las labels distinguen mayúsculas: <code>app=Api</code> no es <code>app=api</code>, y ese error es más frecuente de lo que parece."},
 {t:"vf", p:"Un Service de tipo LoadBalancer en un clúster local sin proveedor cloud obtiene IP externa automáticamente.",
  ok:false, why:"Se queda en &lt;pending&gt;. En local hace falta algo como MetalLB, o usar port-forward, NodePort o el LoadBalancer de minikube tunnel."}
]},

{
id:"k4l2",
titulo:"DNS y cómo viaja el tráfico",
claves:["Nombre completo: servicio.namespace.svc.cluster.local","CoreDNS resuelve los nombres dentro del clúster","kube-proxy (iptables, IPVS o nftables) o eBPF convierten la IP del Service en la de un pod"],
pasos:[
 {t:"info", eti:"DNS interno", h:"CoreDNS y los nombres de servicio",
  c:`<p><b>CoreDNS</b> corre dentro del clúster y resuelve los Services:</p>
     <div class="termbox">api                                  <span class="cm"># desde el mismo namespace</span>
api.pagos                            <span class="cm"># desde otro namespace</span>
api.pagos.svc.cluster.local          <span class="cm"># nombre completo</span>
postgres-0.postgres.datos.svc.cluster.local   <span class="cm"># un pod concreto de un StatefulSet</span></div>
     <p>Es exactamente la idea de Compose (<code>db:5432</code>), pero a escala de clúster y con namespaces.</p>`},
 {t:"opcion", p:"Un pod del namespace <code>web</code> quiere llamar al Service <code>api</code> del namespace <code>pagos</code>. ¿Qué nombre usa?",
  ops:["api","api.pagos (o el completo api.pagos.svc.cluster.local)","pagos.api","localhost:api"],
  ok:1, why:"El nombre corto solo funciona dentro del mismo namespace."},
 {t:"info", eti:"Cómo funcionan los nombres cortos", h:"resolv.conf y ndots",
  c:`<p>El kubelet escribe en cada pod un <code>/etc/resolv.conf</code> así:</p>
     <div class="termbox">nameserver 10.96.0.10                <span class="cm"># la ClusterIP del Service kube-dns (CoreDNS)</span>
search pagos.svc.cluster.local svc.cluster.local cluster.local
options ndots:5</div>
     <p>Con <code>ndots:5</code>, cualquier nombre con <b>menos de 5 puntos</b> se prueba primero con cada dominio de <code>search</code>. Por eso <code>api</code> funciona. Pero también significa que <code>api.stripe.com</code> (2 puntos) genera antes consultas inútiles a <code>api.stripe.com.pagos.svc.cluster.local</code>, etc.: más latencia y más carga para CoreDNS.</p>
     <p>Remedios: terminar los nombres externos con punto (<code>api.stripe.com.</code>), bajar <code>ndots</code> con <code>dnsConfig</code> en el pod, o una caché DNS en cada nodo (NodeLocal DNSCache).</p>`},
 {t:"term", p:"Mira la configuración DNS que tiene dentro el pod <code>api-7d9f-t7w2c</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl exec api-7d9f-t7w2c -- cat /etc/resolv.conf","kubectl exec -it api-7d9f-t7w2c -- cat /etc/resolv.conf","kubectl exec api-7d9f-t7w2c -c api -- cat /etc/resolv.conf"],
  pista:"kubectl exec, el pod, -- y cat del fichero de DNS.",
  salida:`search pagos.svc.cluster.local svc.cluster.local cluster.local
nameserver 10.96.0.10
options ndots:5`,
  why:"El primer dominio de search es el namespace del propio pod: por eso los nombres cortos resuelven Services de tu namespace, y no de otros."},
 {t:"info", eti:"Por debajo", h:"Del Service al pod",
  c:`<ol><li>El pod resuelve <code>api</code> con CoreDNS y obtiene la <b>ClusterIP</b> (virtual: no pertenece a ninguna máquina).</li>
     <li>En el nodo, reglas programadas por <b>kube-proxy</b> (iptables, IPVS o nftables) interceptan el tráfico a esa IP y lo reenvían (DNAT) a la IP de uno de los pods destino.</li>
     <li>El plugin de red (<b>CNI</b>: Calico, Cilium, Flannel...) lleva el paquete hasta ese pod, aunque esté en otro nodo.</li></ol>
     <p>Cilium usa eBPF y puede sustituir a kube-proxy por completo, con mejor rendimiento y observabilidad.</p>`},
 {t:"orden", p:"Ordena el recorrido de una petición de un pod a <code>http://api</code>",
  items:["El pod consulta a CoreDNS por «api»","CoreDNS devuelve la ClusterIP del Service","Las reglas de kube-proxy en el nodo reenvían a la IP de un pod destino","El CNI entrega el paquete al pod, aunque esté en otro nodo"],
  why:"Entender este flujo es lo que permite depurar problemas de red en Kubernetes."},
 {t:"par", p:"Empareja cada pieza de red con su función",
  pares:[["CoreDNS","Resolver nombres de Services y pods"],["kube-proxy","Traducir IPs de Service a IPs de pods"],["CNI","Dar IP a los pods y conectarlos entre nodos"],["ClusterIP","IP virtual estable del Service"]],
  why:"CNI significa Container Network Interface: el estándar por el que Kubernetes delega la red."},
 {t:"opcion", p:"Un Service headless <code>db</code> (clusterIP: None) tiene 3 pods listos. ¿Qué devuelve una consulta DNS a <code>db</code>?",
  ops:["Una ClusterIP","Las IPs de los 3 pods (varios registros A), y el cliente elige","Un error, no tiene IP","Solo la IP del primer pod"],
  ok:1, why:"Sin IP virtual no hay kube-proxy de por medio: el cliente recibe todas las IPs. Útil para bases de datos y clientes que hacen su propio reparto (gRPC, Kafka)."},
 {t:"vf", p:"Hacer ping a la ClusterIP de un Service siempre funciona si el Service está bien.",
  ok:false, why:"Con kube-proxy en modo iptables, la ClusterIP no responde a ping (solo se reenvían los puertos definidos). Se prueba con curl o nc al puerto."}
]},

{
id:"k4n1",
titulo:"El modelo de red: CNI, kube-proxy y políticas de tráfico",
claves:["Cada pod tiene IP propia y se comunica con cualquier otro sin NAT","El CNI implementa la red de pods; kube-proxy (o eBPF) implementa los Services","externalTrafficPolicy, internalTrafficPolicy y trafficDistribution deciden a qué pods va el tráfico"],
pasos:[
 {t:"info", eti:"Las reglas del juego", h:"El modelo de red de Kubernetes",
  c:`<p>Kubernetes no trae red propia: define unas reglas y deja que un plugin <b>CNI</b> las cumpla:</p>
     <ul><li>Cada pod tiene <b>su propia IP</b>, única en el clúster.</li>
     <li>Cualquier pod puede hablar con cualquier otro pod, en cualquier nodo, <b>sin NAT</b>.</li>
     <li>Los agentes del nodo (kubelet) pueden hablar con los pods de su nodo.</li></ul>
     <div class="dg"><div class="dg-tit">tres rangos de direcciones distintos</div>
       <div class="dg-fila"><div class="dg-caja base">red de nodos<small>192.168.10.0/24 · la de tus máquinas</small></div><div class="dg-caja acento">red de pods<small>10.244.0.0/16 · la reparte el CNI, un trozo por nodo</small></div><div class="dg-caja ok">red de Services<small>10.96.0.0/12 · IPs virtuales, no existen en ninguna interfaz</small></div></div>
     </div>`},
 {t:"par", p:"Empareja cada plugin de red con su rasgo principal",
  pares:[["Flannel","Red sencilla por superposición, sin NetworkPolicies propias"],["Calico","Enrutado con BGP o superposición y NetworkPolicies completas"],["Cilium","eBPF: sustituye a kube-proxy, políticas de nivel 7 y observabilidad con Hubble"],["AWS VPC CNI","Los pods reciben IPs reales de la VPC"]],
  why:"En la nube, el CNI del proveedor da IPs de la VPC a los pods: se integran con todo, pero consumen direcciones de tus subredes."},
 {t:"opcion", p:"En EKS con el CNI de la VPC, los pods nuevos se quedan en ContainerCreating con «failed to assign an IP address». ¿Qué pasa?",
  ops:["El DNS no funciona","Las subredes se han quedado sin IPs libres: cada pod consume una dirección real de la VPC","Falta memoria","La imagen es muy grande"],
  ok:1, why:"Soluciones típicas: subredes más grandes o secundarias para pods, prefix delegation, o un CNI con red superpuesta. Es un límite de capacidad que hay que planificar."},
 {t:"info", eti:"Implementar los Services", h:"Modos de kube-proxy",
  c:`<ul><li><b>iptables</b>: el modo por defecto histórico. Una regla por endpoint; con decenas de miles de Services, actualizar las reglas se vuelve lento.</li>
     <li><b>IPVS</b>: balanceador del kernel con tablas hash; mejor a gran escala y con más algoritmos de reparto.</li>
     <li><b>nftables</b>: el sucesor de iptables, <b>estable desde 1.33</b>; más eficiente al actualizar reglas.</li>
     <li><b>Sin kube-proxy</b>: CNIs con eBPF (Cilium, Calico eBPF) hacen el balanceo directamente en el kernel.</li></ul>`},
 {t:"info", eti:"¿A qué pod va cada petición?", h:"Políticas de tráfico",
  c:`<div class="termbox">spec:
  type: LoadBalancer
  externalTrafficPolicy: Local     <span class="cm"># solo pods del nodo que recibe: conserva la IP del cliente</span>
  internalTrafficPolicy: Cluster   <span class="cm"># Local = solo pods del mismo nodo (tipico en agentes)</span>
  trafficDistribution: PreferClose <span class="cm"># preferir pods de la misma zona: menos latencia y coste</span>
  sessionAffinity: ClientIP        <span class="cm"># el mismo cliente, al mismo pod (un parche, no una solucion)</span></div>
     <p>Con <code>externalTrafficPolicy: Cluster</code> (por defecto), un nodo puede reenviar a un pod de otro nodo haciendo SNAT, y la aplicación ve la IP del nodo, no la del cliente. Con <code>Local</code> se conserva la IP de origen, a cambio de que los nodos sin pods no reciban tráfico y el reparto sea menos uniforme.</p>`},
 {t:"hueco", p:"Tu API detrás de un LoadBalancer necesita ver la IP real de los clientes. Completa",
  tpl:"spec:\n  type: ___\n  externalTrafficPolicy: ___",
  banco:["LoadBalancer","Local","Cluster","ClusterIP","PreferClose","NodePort"], sol:["LoadBalancer","Local"],
  why:"Con Local no hay salto extra ni SNAT. Si la entrada es HTTP a través de un proxy o Ingress, la IP suele llegar en la cabecera X-Forwarded-For."},
 {t:"term", p:"Mira qué rango de IPs de pods le ha tocado a cada nodo", prompt:"pablo@portatil:~$",
  sol:["kubectl get nodes -o custom-columns=NODO:.metadata.name,PODCIDR:.spec.podCIDR","kubectl get nodes -o custom-columns=NOMBRE:.metadata.name,PODCIDR:.spec.podCIDR","kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name} {.spec.podCIDR}{\"\\n\"}{end}'"],
  pista:"custom-columns con .metadata.name y .spec.podCIDR.",
  salida:`NODO                 PODCIDR
kind-control-plane   10.244.0.0/24
kind-worker          10.244.1.0/24
kind-worker2         10.244.2.0/24`,
  why:"Cada nodo reparte IPs de su trozo. Viendo la IP de un pod sabes en qué nodo está (algunos CNIs, como Cilium o Calico, gestionan sus propios rangos y este campo puede no usarse)."},
 {t:"vf", p:"Dos pods en nodos distintos se comunican a través de NAT, porque cada nodo tiene su propia red.",
  ok:false, why:"El modelo de Kubernetes exige comunicación pod a pod sin NAT: el pod de destino ve la IP real del pod de origen. Eso es lo que hace posible NetworkPolicies basadas en pods."},
 {t:"opcion", p:"Un clúster repartido en tres zonas paga mucho por tráfico entre zonas, casi todo de llamadas entre servicios. ¿Qué ajuste de Service ayuda?",
  ops:["sessionAffinity: ClientIP","trafficDistribution: PreferClose, para que el tráfico vaya preferentemente a pods de la misma zona","type: NodePort","Quitar las readinessProbes"],
  ok:1, why:"Mantiene el tráfico en la zona cuando hay pods sanos allí y cae a otras zonas si no. Requiere réplicas repartidas en todas las zonas."}
]}

]});
