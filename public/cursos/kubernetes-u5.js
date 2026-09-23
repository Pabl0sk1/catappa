window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Entrada al clúster y aislamiento de red",
resumen: "Ingress y su controlador, Gateway API con TLS de cert-manager, y NetworkPolicies para cerrar la red",
nivel: "Intermedio",
color: "#5b8ce6",
lecciones: [

{
id:"k4l3",
titulo:"Ingress",
claves:["Ingress enruta HTTP por dominio y ruta hacia Services, con TLS","Necesita un Ingress Controller y un ingressClassName que lo señale","La API Ingress es estable pero está congelada: lo nuevo se hace con Gateway API"],
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
  ok:1, why:"El Ingress es configuración; quien la ejecuta es el controlador (Traefik, HAProxy, el del proveedor cloud...)."},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["Ingress","Reglas de enrutado por dominio y ruta"],["Ingress Controller","El proxy que aplica esas reglas"],["cert-manager","Emite y renueva certificados TLS automáticamente"],["pathType: Prefix","La ruta coincide con todo lo que empiece por ese prefijo"],["ingressClassName","Qué controlador debe atender este Ingress"]],
  why:"Ingress + cert-manager + Let's Encrypt es la combinación clásica para HTTPS en Kubernetes."},
 {t:"term", p:"Lista los Ingress del namespace <code>pagos</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl get ingress -n pagos","kubectl get ing -n pagos","kubectl get ingresses -n pagos","kubectl get ingress --namespace pagos","kubectl get ingress --namespace=pagos","kubectl -n pagos get ingress"],
  pista:"kubectl get ingress (o ing) con -n.",
  salida:`NAME   CLASS   HOSTS                  ADDRESS         PORTS     AGE
web    nginx   tareas.miempresa.com   203.0.113.25    80, 443   12d`,
  why:"ADDRESS vacío significa que ningún controlador ha «adoptado» el Ingress: revisa el ingressClassName y que el controlador esté corriendo."},
 {t:"hueco", p:"Haz que <code>/api</code> vaya al Service <code>api</code>, incluidas todas sus subrutas",
  tpl:"- path: /api\n  pathType: ___\n  backend: { service: { name: ___, port: { number: 80 } } }",
  banco:["Prefix","api","Exact","web","ImplementationSpecific","ingress"], sol:["Prefix","api"],
  why:"Exact solo coincide con /api tal cual. Prefix trabaja por segmentos: /api/tareas sí, /apitareas no. ImplementationSpecific depende del controlador: evítalo."},
 {t:"info", eti:"Estado del ecosistema", h:"Ingress hoy",
  c:`<p>La API <b>Ingress</b> es estable y no va a desaparecer, pero está <b>congelada</b>: no recibirá funciones nuevas. Todo lo que no cabe en ella (reescrituras, cabeceras, límites) se hacía con <b>anotaciones</b> propias de cada controlador, que no son portables.</p>
     <div class="nota ojo"><b class="tit">ingress-nginx se retiró</b>El proyecto comunitario ingress-nginx, el controlador más usado durante años, anunció su retirada en noviembre de 2025 y dejó de recibir parches en marzo de 2026. Si tu clúster lo usa, toca migrar: a otro controlador de Ingress o, mejor, a Gateway API (siguiente lección). No lo confundas con el controlador NGINX de F5, que es otro proyecto.</div>`},
 {t:"opcion", p:"Vas a montar la entrada HTTP de un clúster nuevo en 2026. ¿Qué eliges?",
  ops:["Ingress con muchas anotaciones de ingress-nginx","Gateway API con una implementación mantenida (Envoy Gateway, Cilium, Istio, Traefik, NGINX Gateway Fabric...)","Un LoadBalancer por cada Service","NodePort en todos los nodos"],
  ok:1, why:"Gateway API es el estándar hacia el que va el ecosistema: portable, con roles y sin depender de anotaciones."},
 {t:"vf", p:"Con Gateway API se puede enviar un porcentaje del tráfico a una versión nueva mediante pesos en la HTTPRoute.",
  ok:true, why:"backendRefs con weight. Es una de sus ventajas principales sobre Ingress."}
]},

{
id:"k5n1",
titulo:"Gateway API y TLS con cert-manager",
claves:["GatewayClass (proveedor), Gateway (plataforma) y HTTPRoute (equipos): roles separados","Reparto por pesos, cabeceras y métodos, y rutas gRPC, TCP o TLS, sin anotaciones","cert-manager emite certificados con ACME: HTTP-01, o DNS-01 para comodines"],
pasos:[
 {t:"info", eti:"Roles separados", h:"Tres objetos, tres dueños",
  c:`<div class="dg"><div class="dg-tit">quién gestiona cada pieza de gateway api</div>
       <div class="dg-vert">
         <div class="dg-caja base">GatewayClass<small>el proveedor de la implementación: «esto lo sirve Envoy Gateway»</small></div>
         <div class="dg-caja acento">Gateway<small>el equipo de plataforma: puertos, dominios, certificados, qué namespaces pueden colgar rutas</small></div>
         <div class="dg-fila"><div class="dg-caja ok">HTTPRoute del equipo de pagos</div><div class="dg-caja ok">HTTPRoute del equipo de web</div><div class="dg-caja ok">GRPCRoute del equipo de búsqueda</div></div>
         <div class="dg-caja">Services y pods</div>
       </div>
     </div>
     <p>Con Ingress, todo estaba en un objeto que tocaban todos. Aquí cada equipo gestiona sus rutas en su namespace, y el Gateway decide quién puede engancharse.</p>`},
 {t:"info", eti:"En YAML", h:"Un Gateway y una ruta con canary",
  c:`<div class="termbox">apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: publico
  namespace: infra
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  gatewayClassName: envoy
  listeners:
    - name: http                       <span class="cm"># para el reto HTTP-01 y redirigir a https</span>
      protocol: HTTP
      port: 80
    - name: https
      protocol: HTTPS
      port: 443
      hostname: tareas.miempresa.com
      tls:
        mode: Terminate
        certificateRefs: [{ name: tareas-tls }]
      allowedRoutes:
        namespaces: { from: All }
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata: { name: tareas, namespace: pagos }
spec:
  parentRefs: [{ name: publico, namespace: infra }]
  hostnames: [tareas.miempresa.com]
  rules:
    - matches: [{ headers: [{ name: x-beta, value: "si" }] }]
      backendRefs: [{ name: api-v2, port: 80 }]
    - matches: [{ path: { type: PathPrefix, value: /api } }]
      backendRefs:
        - { name: api-v1, port: 80, weight: 90 }
        - { name: api-v2, port: 80, weight: 10 }</div>`},
 {t:"par", p:"Empareja cada recurso de Gateway API con quién lo gestiona normalmente",
  pares:[["GatewayClass","El proveedor de la implementación"],["Gateway","El equipo de plataforma"],["HTTPRoute","Cada equipo de aplicación"],["ReferenceGrant","El dueño del namespace al que se hace referencia"]],
  why:"Esa separación es la razón de ser de Gateway API: menos pisotones y permisos más finos con RBAC."},
 {t:"term", p:"Comprueba si el Gateway <code>publico</code> del namespace <code>infra</code> está programado y tiene dirección", prompt:"pablo@portatil:~$",
  sol:["kubectl get gateway publico -n infra","kubectl get gateway -n infra","kubectl get gateways -n infra","kubectl get gtw -n infra","kubectl get gateway publico --namespace infra","kubectl -n infra get gateway publico"],
  pista:"kubectl get gateway con -n infra.",
  salida:`NAME      CLASS   ADDRESS         PROGRAMMED   AGE
publico   envoy   203.0.113.40    True         6d`,
  why:"PROGRAMMED=True significa que la implementación ha configurado el proxy. Si una ruta no funciona, mira su estado: kubectl describe httproute muestra si fue aceptada por el Gateway (condición Accepted)."},
 {t:"hueco", p:"Envía el 20 % del tráfico a la versión nueva",
  tpl:"backendRefs:\n  - { name: api-v1, port: 80, ___: 80 }\n  - { name: ___, port: 80, weight: 20 }",
  banco:["weight","api-v2","percent","api-v1","ratio","canary"], sol:["weight","api-v2"],
  why:"Los pesos son relativos: 80 y 20 reparten 80/20, igual que 4 y 1. Argo Rollouts y Flagger pueden ir cambiándolos automáticamente."},
 {t:"opcion", p:"Una HTTPRoute del namespace <code>pagos</code> quiere enviar tráfico a un Service del namespace <code>compartido</code> y el Gateway la rechaza con «RefNotPermitted». ¿Qué falta?",
  ops:["Un Ingress","Un ReferenceGrant en el namespace compartido que permita a las HTTPRoute de pagos referenciar sus Services","Una NetworkPolicy","Cambiar el Service a NodePort"],
  ok:1, why:"Las referencias entre namespaces necesitan permiso explícito del namespace de destino. Evita que cualquiera enrute tráfico hacia tus Services o use tus certificados."},
 {t:"info", eti:"Certificados automáticos", h:"cert-manager y ACME",
  c:`<div class="termbox">apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata: { name: letsencrypt }
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: plataforma@miempresa.com
    privateKeySecretRef: { name: letsencrypt-cuenta }
    solvers:
      - http01:
          gatewayHTTPRoute:
            parentRefs: [{ name: publico, namespace: infra }]</div>
     <p>cert-manager ve la anotación del Gateway (o del Ingress), crea un <code>Certificate</code>, resuelve el reto ACME, guarda el certificado en el Secret indicado y lo <b>renueva</b> antes de que caduque.</p>
     <ul><li><b>HTTP-01</b>: Let's Encrypt pide un fichero por HTTP en el dominio. Sencillo, pero no sirve para comodines.</li>
     <li><b>DNS-01</b>: demuestras el control creando un registro TXT (cert-manager usa la API de tu DNS). Necesario para <code>*.miempresa.com</code> y para dominios no expuestos a Internet.</li></ul>`},
 {t:"opcion", p:"Necesitas un certificado comodín <code>*.miempresa.com</code> para todos los servicios. ¿Qué reto ACME usas?",
  ops:["HTTP-01","DNS-01, con cert-manager usando la API de tu proveedor DNS","Ninguno, se crea a mano","TLS-ALPN siempre"],
  ok:1, why:"Let's Encrypt solo emite comodines con DNS-01. Diagnóstico útil: kubectl describe certificate y kubectl get challenges muestran en qué punto está la emisión."},
 {t:"vf", p:"Gateway API solo sirve para HTTP.",
  ok:false, why:"Tiene HTTPRoute y GRPCRoute estables, y TLSRoute, TCPRoute y UDPRoute en el canal experimental. Por eso también sirve de base a las mallas de servicio (GAMMA)."}
]},

{
id:"k4l4",
titulo:"NetworkPolicies: el cortafuegos del clúster",
claves:["Por defecto todos los pods se ven entre sí","Una NetworkPolicy que selecciona un pod lo aísla: solo pasa lo permitido explícitamente","Necesitan un CNI que las aplique (Calico, Cilium...)"],
pasos:[
 {t:"info", eti:"Red plana", h:"El punto de partida es inseguro",
  c:`<p>Por defecto, en Kubernetes <b>cualquier pod puede hablar con cualquier otro</b>, de cualquier namespace. Si un atacante compromete un pod del frontend, puede conectarse directamente a la base de datos.</p>
     <p>Las <b>NetworkPolicies</b> lo corrigen: reglas de qué tráfico entra (ingress) y sale (egress) de cada pod. En cuanto una política selecciona un pod para una dirección, ese pod pasa a <b>denegar por defecto</b> en esa dirección, salvo lo que permita alguna política.</p>`},
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
 {t:"info", eti:"La trampa del guion", h:"Y contra O en el from",
  c:`<div class="dg"><div class="dg-tit">el mismo from con uno o dos guiones</div><div class="dg-cols"><div class="dg-col"><div class="dg-col-tit">Un elemento: Y</div><div class="termbox">from:
  - namespaceSelector: {...pagos}
    podSelector: {...api}</div><div class="dg-caja ok">pods «api» del namespace pagos</div></div>
     <div class="dg-col"><div class="dg-col-tit">Dos elementos: O</div><div class="termbox">from:
  - namespaceSelector: {...pagos}
  - podSelector: {...api}</div><div class="dg-caja aviso">cualquier pod de pagos, o pods «api» del propio namespace</div></div></div></div>
     <p>Un solo guion de diferencia abre mucho más de lo que querías. Revisa siempre la sangría.</p>`},
 {t:"opcion", p:"Aplicas una política de «denegar todo» en un namespace. ¿Qué dejará de funcionar a menudo sin que te des cuenta?",
  ops:["Nada","La resolución DNS si también bloqueas el egress (hay que permitir la salida a CoreDNS en el puerto 53)","El kubelet","Los logs"],
  ok:1, why:"Con políticas de egress, olvidar permitir DNS es el error más clásico: todo falla por «unknown host»."},
 {t:"hueco", p:"Completa la regla de salida que permite resolver nombres con CoreDNS",
  tpl:"egress:\n  - to:\n      - namespaceSelector: { matchLabels: { kubernetes.io/metadata.name: ___ } }\n        podSelector: { matchLabels: { k8s-app: kube-dns } }\n    ports: [{ protocol: UDP, port: ___ }, { protocol: TCP, port: 53 }]",
  banco:["kube-system","53","default","5353","coredns","443"], sol:["kube-system","53"],
  why:"DNS usa UDP y, para respuestas grandes, TCP: permite ambos. CoreDNS conserva la label k8s-app: kube-dns por compatibilidad."},
 {t:"par", p:"Empareja cada elemento de una NetworkPolicy con su significado",
  pares:[["podSelector: {}","Aplica a todos los pods del namespace"],["policyTypes: [Ingress]","Controla el tráfico entrante"],["namespaceSelector","Permite tráfico desde ciertos namespaces"],["ports","Limita a puertos concretos"],["ipBlock","Permite rangos de IPs, por ejemplo fuera del clúster"]],
  why:"Las reglas son aditivas: se permite lo que permita cualquiera de las políticas que aplican al pod."},
 {t:"term", p:"Desde el pod <code>web-6b7f5-8hq4m</code>, comprueba si llega al puerto 5432 de <code>postgres.datos</code> (con 3 segundos de espera)", prompt:"pablo@portatil:~$",
  sol:["kubectl exec web-6b7f5-8hq4m -- nc -zv -w 3 postgres.datos 5432","kubectl exec web-6b7f5-8hq4m -- nc -zv -w3 postgres.datos 5432","kubectl exec -it web-6b7f5-8hq4m -- nc -zv -w 3 postgres.datos 5432","kubectl exec web-6b7f5-8hq4m -- nc -z -v -w 3 postgres.datos 5432"],
  pista:"kubectl exec, el pod, -- y nc -zv -w 3 con host y puerto.",
  salida:`nc: postgres.datos (10.96.201.14:5432): Connection timed out
command terminated with exit code 1`,
  why:"Un «timed out» (no un «refused») es la huella típica de una NetworkPolicy: los paquetes se descartan en silencio. Justo lo que queríamos: el frontend no llega a la base de datos."},
 {t:"vf", p:"Las NetworkPolicies funcionan en cualquier clúster, sea cual sea su plugin de red.",
  ok:false, why:"Las aplica el CNI. Con uno que no las soporte (Flannel básico), se crean pero no tienen ningún efecto. Error silencioso peligroso."},
 {t:"opcion", p:"Necesitas permitir la salida solo hacia <code>api.stripe.com</code>, cuyas IPs cambian. ¿Qué te ofrece la NetworkPolicy estándar?",
  ops:["Una regla por nombre de dominio","Nada por nombre: solo ipBlock con rangos. Para reglas por FQDN hacen falta políticas del CNI (CiliumNetworkPolicy, Calico) o un proxy de salida","Un Service ExternalName","Un Ingress"],
  ok:1, why:"La NetworkPolicy estándar trabaja en capa 3/4 (IPs y puertos). Las extensiones de los CNIs añaden dominios y reglas de capa 7."}
]}

]});
