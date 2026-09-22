window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Services, Ingress y red",
resumen: "Tipos de Service, DNS interno, kube-proxy, Ingress y Gateway API, y NetworkPolicies",
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
kubectl describe svc api        <span class="cm"># Endpoints: 10.244.1.5:8080, 10.244.2.7:8080</span></div>`},
 {t:"opcion", p:"El Service <code>api</code> existe pero todas las peticiones fallan y <code>describe svc</code> muestra «Endpoints: &lt;none&gt;». ¿Causas probables?",
  ops:["El DNS","El selector no coincide con las labels de los pods, o ningún pod pasa la readinessProbe","Falta un Ingress","El nodo no tiene disco"],
  ok:1, why:"Son las dos causas de un Service sin destinos. Compara el selector con kubectl get pods --show-labels."},
 {t:"vf", p:"Un Service de tipo LoadBalancer en un clúster local sin proveedor cloud obtiene IP externa automáticamente.",
  ok:false, why:"Se queda en &lt;pending&gt;. En local hace falta algo como MetalLB, o usar port-forward, NodePort o el LoadBalancer de minikube tunnel."}
]},

{
id:"k4l2",
titulo:"DNS y cómo viaja el tráfico",
claves:["Nombre completo: servicio.namespace.svc.cluster.local","CoreDNS resuelve los nombres dentro del clúster","kube-proxy (iptables/IPVS) o eBPF convierten la IP del Service en la de un pod"],
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
 {t:"info", eti:"Por debajo", h:"Del Service al pod",
  c:`<ol><li>El pod resuelve <code>api</code> con CoreDNS y obtiene la <b>ClusterIP</b> (virtual: no pertenece a ninguna máquina).</li>
     <li>En el nodo, reglas programadas por <b>kube-proxy</b> (iptables o IPVS) interceptan el tráfico a esa IP y lo reenvían (DNAT) a la IP de uno de los pods destino.</li>
     <li>El plugin de red (<b>CNI</b>: Calico, Cilium, Flannel...) lleva el paquete hasta ese pod, aunque esté en otro nodo.</li></ol>
     <p>Cilium usa eBPF y puede sustituir a kube-proxy por completo, con mejor rendimiento y observabilidad.</p>`},
 {t:"orden", p:"Ordena el recorrido de una petición de un pod a <code>http://api</code>",
  items:["El pod consulta a CoreDNS por «api»","CoreDNS devuelve la ClusterIP del Service","Las reglas de kube-proxy en el nodo reenvían a la IP de un pod destino","El CNI entrega el paquete al pod, aunque esté en otro nodo"],
  why:"Entender este flujo es lo que permite depurar problemas de red en Kubernetes."},
 {t:"par", p:"Empareja cada pieza de red con su función",
  pares:[["CoreDNS","Resolver nombres de Services y pods"],["kube-proxy","Traducir IPs de Service a IPs de pods"],["CNI","Dar IP a los pods y conectarlos entre nodos"],["ClusterIP","IP virtual estable del Service"]],
  why:"CNI significa Container Network Interface: el estándar por el que Kubernetes delega la red."},
 {t:"vf", p:"Hacer ping a la ClusterIP de un Service siempre funciona si el Service está bien.",
  ok:false, why:"Con kube-proxy en modo iptables, la ClusterIP no responde a ping (solo se reenvían los puertos definidos). Se prueba con curl o nc al puerto."}
]},

{
id:"k4l3",
titulo:"Ingress y Gateway API",
claves:["Ingress enruta HTTP por dominio y ruta hacia Services, con TLS","Necesita un Ingress Controller (ingress-nginx, Traefik...)","Gateway API es la evolución más expresiva y con roles separados"],
pasos:[
 {t:"info", eti:"Entrada HTTP", h:"Un solo punto de entrada",
  c:`<p>Un LoadBalancer por servicio es caro. Un <b>Ingress</b> define reglas de enrutado HTTP, y un único <b>Ingress Controller</b> (un proxy dentro del clúster) las aplica:</p>
     <div class="termbox">apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt   <span class="cm"># certificado automatico</span>
spec:
  ingressClassName: nginx
  tls:
    - hosts: [tareas.miempresa.com]
      secretName: tareas-tls
  rules:
    - host: tareas.miempresa.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend: { service: { name: api, port: { number: 80 } } }
          - path: /
            pathType: Prefix
            backend: { service: { name: web, port: { number: 80 } } }</div>`},
 {t:"opcion", p:"Creas un Ingress y no hace nada: ninguna petición llega. ¿Qué falta probablemente?",
  ops:["Un PersistentVolume","Un Ingress Controller instalado en el clúster (el objeto Ingress solo son reglas)","Más réplicas","Un ConfigMap"],
  ok:1, why:"El Ingress es configuración; quien la ejecuta es el controlador (ingress-nginx, Traefik, el del proveedor cloud)."},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["Ingress","Reglas de enrutado por dominio y ruta"],["Ingress Controller","El proxy que aplica esas reglas"],["cert-manager","Emite y renueva certificados TLS automáticamente"],["pathType: Prefix","La ruta coincide con todo lo que empiece por ese prefijo"]],
  why:"Ingress + cert-manager + Let's Encrypt es la combinación estándar para HTTPS en Kubernetes."},
 {t:"info", eti:"La evolución", h:"Gateway API",
  c:`<p><b>Gateway API</b> es el sucesor de Ingress: más expresiva (reparto de tráfico por pesos, cabeceras, TCP/UDP, gRPC) y con roles separados:</p>
     <ul><li><b>GatewayClass</b> y <b>Gateway</b>: los define el equipo de plataforma (el punto de entrada, los certificados).</li>
     <li><b>HTTPRoute</b>: lo define cada equipo de aplicación para sus rutas.</li></ul>
     <p>Permite hacer despliegues canary («10% del tráfico a v2») sin anotaciones específicas de cada controlador.</p>`},
 {t:"vf", p:"Con Gateway API se puede enviar un porcentaje del tráfico a una versión nueva mediante pesos en la HTTPRoute.",
  ok:true, why:"backendRefs con weight. Es una de sus ventajas principales sobre Ingress."}
]},

{
id:"k4l4",
titulo:"NetworkPolicies: el cortafuegos del clúster",
claves:["Por defecto todos los pods se ven entre sí","Una NetworkPolicy que selecciona un pod lo aísla: solo pasa lo permitido explícitamente","Necesitan un CNI que las aplique (Calico, Cilium...)"],
pasos:[
 {t:"info", eti:"Red plana", h:"El punto de partida es inseguro",
  c:`<p>Por defecto, en Kubernetes <b>cualquier pod puede hablar con cualquier otro</b>, de cualquier namespace. Si un atacante compromete un pod del frontend, puede conectarse directamente a la base de datos.</p>
     <p>Las <b>NetworkPolicies</b> lo corrigen: reglas de qué tráfico entra (ingress) y sale (egress) de cada pod.</p>`},
 {t:"info", eti:"El patrón", h:"Denegar todo y abrir lo necesario",
  c:`<div class="termbox"><span class="cm"># 1. denegar todo el trafico entrante en el namespace</span>
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: denegar-todo, namespace: datos }
spec:
  podSelector: {}               <span class="cm"># todos los pods</span>
  policyTypes: [Ingress]
---
<span class="cm"># 2. permitir solo a la API hablar con Postgres</span>
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: api-a-postgres, namespace: datos }
spec:
  podSelector: { matchLabels: { app: postgres } }
  ingress:
    - from:
        - namespaceSelector: { matchLabels: { kubernetes.io/metadata.name: pagos } }
          podSelector: { matchLabels: { app: api } }
      ports: [{ port: 5432 }]</div>`},
 {t:"opcion", p:"Aplicas una política de «denegar todo» en un namespace. ¿Qué dejará de funcionar a menudo sin que te des cuenta?",
  ops:["Nada","La resolución DNS si también bloqueas el egress (hay que permitir la salida a CoreDNS en el puerto 53)","El kubelet","Los logs"],
  ok:1, why:"Con políticas de egress, olvidar permitir DNS es el error más clásico: todo falla por «unknown host»."},
 {t:"par", p:"Empareja cada elemento de una NetworkPolicy con su significado",
  pares:[["podSelector: {}","Aplica a todos los pods del namespace"],["policyTypes: [Ingress]","Controla el tráfico entrante"],["namespaceSelector","Permite tráfico desde ciertos namespaces"],["ports","Limita a puertos concretos"]],
  why:"Las reglas son aditivas: se permite lo que permita cualquiera de las políticas que aplican al pod."},
 {t:"vf", p:"Las NetworkPolicies funcionan en cualquier clúster, sea cual sea su plugin de red.",
  ok:false, why:"Las aplica el CNI. Con uno que no las soporte (Flannel básico), se crean pero no tienen ningún efecto. Error silencioso peligroso."}
]}

]});
