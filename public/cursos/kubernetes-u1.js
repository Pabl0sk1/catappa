window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Por qué Kubernetes y cómo funciona",
resumen: "El problema de orquestar, la arquitectura del clúster, el modelo declarativo y tu clúster local",
nivel: "Fundamentos",
color: "#6d9cf2",
lecciones: [

{
id:"k1l1",
titulo:"El problema que resuelve",
claves:["Kubernetes orquesta contenedores en un clúster de muchas máquinas","Autocuración, escalado, despliegues sin corte y descubrimiento de servicios","Es declarativo: describes el estado deseado y él lo mantiene"],
pasos:[
 {t:"info", eti:"Empezamos", h:"De un servidor a cien",
  c:`<p>Con Docker y Compose sabes ejecutar contenedores en <b>una máquina</b>. Ahora imagina tu empresa: 40 servicios, 300 contenedores, 20 servidores. Surgen preguntas que Compose no responde:</p>
     <ul><li>¿En qué servidor pongo cada contenedor para aprovechar bien la memoria?</li>
     <li>Si un servidor muere a las 3 de la mañana, ¿quién vuelve a arrancar sus contenedores en otro?</li>
     <li>¿Cómo actualizo un servicio con 10 réplicas sin cortar el tráfico?</li>
     <li>¿Cómo encuentra un servicio a otro si sus contenedores cambian de máquina e IP constantemente?</li></ul>
     <p>Resolver eso es <b>orquestar</b>. <b>Kubernetes</b> (K8s) es el orquestador estándar: lo creó Google a partir de su experiencia con Borg y hoy lo mantiene la CNCF.</p>`},
 {t:"par", p:"Empareja cada problema con cómo lo resuelve Kubernetes",
  pares:[["Un servidor se cae","Recoloca sus contenedores en otros nodos (autocuración)"],["Hay más tráfico","Escala el número de réplicas"],["Hay que actualizar sin cortar","Rolling update: sustituye réplicas poco a poco"],["Los contenedores cambian de IP","Services con nombre DNS e IP estables"],["Dónde poner cada contenedor","El scheduler elige nodo según recursos"]],
  why:"Estas cinco capacidades son la respuesta a «¿para qué sirve Kubernetes?»."},
 {t:"info", eti:"La idea central", h:"Declarativo: el estado deseado",
  c:`<p>En Kubernetes no das órdenes («arranca un contenedor aquí»). <b>Declaras cómo quieres que esté el sistema</b>:</p>
     <div class="termbox">apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3            <span class="cm"># QUIERO 3 copias</span>
  ...</div>
     <p>Y unos componentes llamados <b>controladores</b> comparan continuamente lo que quieres con lo que hay, y actúan para que coincidan. Si muere una réplica, hay 2 en lugar de 3: el controlador crea otra. Esto se llama <b>bucle de reconciliación</b>.</p>`},
 {t:"opcion", p:"Borras a mano un contenedor de un Deployment de 3 réplicas. ¿Qué hace Kubernetes?",
  ops:["Nada, quedan 2","Detecta que el estado real (2) no coincide con el deseado (3) y crea otra réplica","Borra el Deployment","Reinicia el clúster"],
  ok:1, why:"Es el bucle de reconciliación en acción. Para reducir réplicas hay que cambiar el estado deseado, no borrar a mano."},
 {t:"vf", p:"Kubernetes sustituye a Docker: con Kubernetes ya no se construyen imágenes de contenedor.",
  ok:false, why:"Kubernetes ejecuta y orquesta contenedores, pero las imágenes se siguen construyendo con Docker (o herramientas equivalentes) y publicando en un registry."},
 {t:"info", eti:"Con honestidad", h:"Cuándo NO usar Kubernetes",
  c:`<p>Kubernetes añade mucha complejidad: redes, almacenamiento, seguridad, actualizaciones del propio clúster. Para una aplicación pequeña en uno o dos servidores, Compose o un servicio gestionado (Cloud Run, ECS, App Service) suelen ser mejor opción.</p>
     <p>Kubernetes compensa cuando tienes muchos servicios, necesitas alta disponibilidad real, escalado automático o un equipo de plataforma que lo opere. Saber decirlo en una entrevista demuestra criterio.</p>`},
 {t:"opcion", p:"Una startup con una sola API y una base de datos pregunta si debería montar Kubernetes. ¿Qué recomiendas?",
  ops:["Sí, siempre es lo mejor","Probablemente no todavía: Compose en un servidor o un servicio de contenedores gestionado le da lo que necesita con mucha menos complejidad","Sí, y con varios clústeres","No, que no use contenedores"],
  ok:1, why:"La herramienta debe ser proporcional al problema."}
]},

{
id:"k1l2",
titulo:"La arquitectura del clúster",
claves:["Plano de control: kube-apiserver, etcd, kube-scheduler, kube-controller-manager","Nodos: kubelet, runtime (containerd) y kube-proxy","Todo, incluido kubectl, habla con el API server"],
pasos:[
 {t:"info", eti:"El mapa", h:"Plano de control y nodos",
  c:`<div class="dg"><div class="dg-tit">plano de control y nodos de un clúster</div>
       <div class="dg-vert">
         <div class="dg-caja base">kubectl<small>tu herramienta: le habla al API server</small></div>
         <div class="dg-caja acento">Plano de control
           <div class="dg-pila" style="margin-top:8px"><div class="dg-caja">kube-apiserver ⇄ etcd</div><div class="dg-caja">kube-scheduler</div><div class="dg-caja">kube-controller-manager</div><div class="dg-caja">cloud-controller-manager<small>en la nube</small></div></div>
         </div>
         <div class="dg-caja base">Nodos<small>todo pasa por el API server</small>
           <div class="dg-fila" style="margin-top:8px"><div class="dg-caja ok">nodo 1</div><div class="dg-caja ok">nodo 2</div><div class="dg-caja ok">nodo 3</div></div>
           <div class="dg-caja" style="margin-top:6px">en cada nodo<small>kubelet · containerd · kube-proxy · pods...</small></div>
         </div>
       </div>
     </div>`},
 {t:"info", eti:"El cerebro", h:"Los componentes del plano de control",
  c:`<ul><li><b>kube-apiserver</b>: la puerta de entrada. Recibe todas las peticiones (de kubectl, de los nodos, de los controladores), las valida y las guarda. Es el <b>único</b> que habla con etcd.</li>
     <li><b>etcd</b>: base de datos clave-valor distribuida con todo el estado del clúster. Si se pierde etcd sin backup, se pierde el clúster.</li>
     <li><b>kube-scheduler</b>: decide en qué nodo va cada pod nuevo.</li>
     <li><b>kube-controller-manager</b>: ejecuta los controladores (de Deployments, de ReplicaSets, de nodos...), los bucles que reconcilian.</li>
     <li><b>cloud-controller-manager</b>: en la nube, crea balanceadores, discos y rutas del proveedor.</li></ul>`},
 {t:"par", p:"Empareja cada componente con su función",
  pares:[["kube-apiserver","Punto de entrada de todas las peticiones"],["etcd","Almacén del estado del clúster"],["kube-scheduler","Elige el nodo de cada pod"],["kube-controller-manager","Ejecuta los bucles de reconciliación"],["kubelet","Arranca y vigila los pods de su nodo"],["kube-proxy","Programa las reglas de red de los Services en el nodo"]],
  why:"Es una de las preguntas más frecuentes en entrevistas de Kubernetes."},
 {t:"info", eti:"En cada nodo", h:"kubelet, runtime y kube-proxy",
  c:`<ul><li><b>kubelet</b>: el agente del nodo. Pregunta al API server qué pods le tocan, pide al runtime que los arranque y comprueba que estén sanos.</li>
     <li><b>runtime de contenedores</b>: normalmente <b>containerd</b> (o CRI-O). Kubernetes habla con él a través de una interfaz estándar, la CRI.</li>
     <li><b>kube-proxy</b>: traduce los Services a reglas de red (iptables, IPVS o nftables) para repartir el tráfico entre pods. Algunos plugins de red modernos, como Cilium, lo sustituyen.</li></ul>
     <p>En los clústeres montados con <b>kubeadm</b>, los componentes del plano de control son <b>pods estáticos</b>: el kubelet del nodo maestro los arranca directamente a partir de los ficheros de <code>/etc/kubernetes/manifests/</code>, sin pasar por el scheduler.</p>`},
 {t:"term", p:"Mira los pods de sistema que forman el plano de control de tu clúster local", prompt:"pablo@portatil:~$",
  sol:["kubectl get pods -n kube-system","kubectl get pods --namespace kube-system","kubectl get pods --namespace=kube-system","kubectl get po -n kube-system","kubectl -n kube-system get pods"],
  pista:"kubectl get pods en el namespace kube-system.",
  salida:`NAME                                         READY   STATUS    RESTARTS   AGE
coredns-66bc5c9577-8xk2m                     1/1     Running   0          12m
coredns-66bc5c9577-tq9fd                     1/1     Running   0          12m
etcd-kind-control-plane                      1/1     Running   0          12m
kindnet-4hv7c                                1/1     Running   0          12m
kube-apiserver-kind-control-plane            1/1     Running   0          12m
kube-controller-manager-kind-control-plane   1/1     Running   0          12m
kube-proxy-8zmxl                             1/1     Running   0          12m
kube-scheduler-kind-control-plane            1/1     Running   0          12m`,
  why:"Los que acaban en el nombre del nodo (etcd-kind-control-plane…) son pods estáticos. coredns es el DNS interno, kindnet el plugin de red de kind y kube-proxy corre en cada nodo (es un DaemonSet)."},
 {t:"orden", p:"Ordena qué ocurre al crear un Deployment con <code>kubectl apply</code>",
  items:["kubectl envía el manifiesto al kube-apiserver","El API server lo valida y lo guarda en etcd","El controlador de Deployments crea un ReplicaSet y este, los pods","El scheduler asigna cada pod a un nodo","El kubelet de ese nodo pide a containerd que arranque los contenedores"],
  why:"Contar este flujo en una entrevista demuestra que entiendes cómo encajan las piezas."},
 {t:"vf", p:"El kubelet se conecta directamente a etcd para saber qué pods debe ejecutar.",
  ok:false, why:"Solo el API server habla con etcd. El kubelet, como todos, pasa por el API server."},
 {t:"opcion", p:"¿Qué componente es más crítico hacer backup en un clúster autogestionado?",
  ops:["kube-proxy","etcd, porque contiene todo el estado del clúster","El kubelet","containerd"],
  ok:1, why:"Los demás son procesos que se pueden reinstalar. etcd es el estado. En servicios gestionados (EKS, GKE, AKS) se encarga el proveedor."}
]},

{
id:"k1l3",
titulo:"Objetos, YAML y la API",
claves:["Todo en Kubernetes es un objeto de la API: apiVersion, kind, metadata y spec","spec es lo deseado; status lo reporta el clúster","Las labels organizan y conectan objetos"],
pasos:[
 {t:"info", eti:"La forma de todo", h:"Los cuatro campos de cualquier objeto",
  c:`<div class="termbox">apiVersion: v1          <span class="cm"># grupo y version de la API</span>
kind: Pod               <span class="cm"># tipo de objeto</span>
metadata:               <span class="cm"># identidad</span>
  name: api
  namespace: produccion
  labels:
    app: api
    equipo: pagos
spec:                   <span class="cm"># lo que QUIERES</span>
  containers:
    - name: api
      image: ghcr.io/pablo/api:1.2.0
<span class="cm"># status:  -> lo escribe el cluster: lo que HAY</span></div>
     <p>Da igual el tipo de objeto: siempre verás esta estructura. <b>spec</b> lo escribes tú; <b>status</b> lo rellena Kubernetes.</p>`},
 {t:"par", p:"Empareja cada campo con su propósito",
  pares:[["apiVersion","Qué versión de la API define el objeto"],["kind","Qué tipo de objeto es"],["metadata","Nombre, namespace, etiquetas y anotaciones"],["spec","El estado deseado"],["status","El estado real, informado por el clúster"]],
  why:"Leer cualquier manifiesto empieza por estos cinco campos."},
 {t:"info", eti:"Etiquetas", h:"labels y selectores: el pegamento",
  c:`<p>Las <b>labels</b> son pares clave-valor libres. No hacen nada por sí solas, pero otros objetos las usan para <b>seleccionar</b>:</p>
     <ul><li>Un Deployment gestiona los pods con la etiqueta <code>app: api</code>.</li>
     <li>Un Service envía tráfico a los pods con <code>app: api</code>.</li>
     <li><code>kubectl get pods -l equipo=pagos</code> filtra por etiqueta.</li></ul>
     <p>Las <b>annotations</b> también son clave-valor, pero para información que no se usa para seleccionar (la versión del commit, configuración de herramientas).</p>`},
 {t:"opcion", p:"¿Cómo sabe un Service a qué pods enviar el tráfico?",
  ops:["Por el nombre de los pods","Por un selector de labels que coincide con las etiquetas de los pods","Por su IP","Por el nodo en que están"],
  ok:1, why:"Los pods aparecen y desaparecen con nombres e IPs nuevas; las etiquetas son lo estable."},
 {t:"info", eti:"Organizar", h:"Namespaces",
  c:`<p>Un <b>namespace</b> es una partición lógica del clúster: <code>produccion</code>, <code>staging</code>, <code>equipo-pagos</code>. Sirve para:</p>
     <ul><li>evitar choques de nombres,</li>
     <li>aplicar permisos (RBAC) y cuotas de recursos por namespace,</li>
     <li>organizar.</li></ul>
     <p>Hay namespaces del sistema: <code>kube-system</code> (componentes internos), <code>default</code> (donde cae todo si no dices nada).</p>`},
 {t:"vf", p:"Los namespaces aíslan la red: por defecto un pod de un namespace no puede hablar con otro namespace.",
  ok:false, why:"Por defecto la red es plana: todos los pods se ven. El aislamiento de red se consigue con NetworkPolicies."},
 {t:"escribe", p:"Escribe el comando que lista los pods con la etiqueta <code>app=api</code>",
  sol:["kubectl get pods -l app=api","kubectl get pod -l app=api","kubectl get po -l app=api","kubectl get pods --selector app=api","kubectl get pods --selector=app=api"], ph:"kubectl ...",
  pista:"kubectl get pods con -l.", why:"kubectl get pods -l app=api."}
]},

{
id:"k1l4",
titulo:"Tu clúster local y kubectl",
claves:["kind, minikube o Docker Desktop para practicar en local","kubectl apply -f aplica manifiestos; get, describe, logs y delete","El contexto de kubeconfig decide a qué clúster hablas"],
pasos:[
 {t:"info", eti:"Laboratorio", h:"Un clúster en tu portátil",
  c:`<ul><li><b>Docker Desktop</b>: Ajustes → Kubernetes → Enable. Un clúster de un nodo, lo más rápido para empezar.</li>
     <li><b>kind</b> (Kubernetes in Docker): cada nodo es un contenedor. Permite clústeres de varios nodos: <code>kind create cluster</code>.</li>
     <li><b>minikube</b>: el clásico, con muchos complementos (<code>minikube addons enable ingress</code>).</li>
     <li><b>k3d / k3s</b>: una distribución ligera, ideal para máquinas modestas.</li></ul>`},
 {t:"term", p:"Crea un clúster local con kind", prompt:"PS C:\\>", sol:["kind create cluster","kind create cluster --name catappa"],
  pista:"kind, create, cluster.", salida:`Creating cluster "kind" ...
 ✓ Ensuring node image (kindest/node:v1.34.0)
 ✓ Preparing nodes
 ✓ Starting control-plane
 ✓ Installing CNI
Set kubectl context to "kind-kind"`,
  why:"Ha creado un nodo (un contenedor Docker) con todo el plano de control dentro, y ha configurado kubectl para usarlo."},
 {t:"info", eti:"kubectl", h:"Los verbos esenciales",
  c:`<div class="termbox">kubectl apply -f deployment.yml     <span class="cm"># crear o actualizar desde un fichero</span>
kubectl get pods                    <span class="cm"># listar (pods, deploy, svc, ing, cm, secret, nodes...)</span>
kubectl get pods -o wide            <span class="cm"># con IP y nodo</span>
kubectl get deploy api -o yaml      <span class="cm"># el objeto completo, con status</span>
kubectl describe pod api-7d9f       <span class="cm"># detalle y EVENTOS</span>
kubectl logs api-7d9f -f            <span class="cm"># logs</span>
kubectl exec -it api-7d9f -- sh     <span class="cm"># entrar</span>
kubectl delete -f deployment.yml    <span class="cm"># borrar lo definido en el fichero</span>
kubectl explain deployment.spec.strategy   <span class="cm"># documentacion de cualquier campo</span></div>`},
 {t:"par", p:"Empareja cada comando con su uso",
  pares:[["kubectl apply -f","Crear o actualizar desde un manifiesto"],["kubectl get","Listar objetos"],["kubectl describe","Ver el detalle y los eventos"],["kubectl explain","Consultar la documentación de un campo"],["kubectl exec -it","Abrir una shell en un contenedor"]],
  why:"kubectl explain es un salvavidas: la documentación de la API sin salir de la terminal."},
 {t:"info", eti:"¿A qué clúster hablo?", h:"Contextos y kubeconfig",
  c:`<p>kubectl lee <code>~/.kube/config</code>, que puede tener varios clústeres. El <b>contexto</b> activo decide a cuál van tus comandos:</p>
     <div class="termbox">kubectl config get-contexts
kubectl config use-context produccion
kubectl config set-context --current --namespace=pagos   <span class="cm"># namespace por defecto</span></div>
     <div class="nota ojo"><b class="tit">El error más caro</b>Borrar algo en producción creyendo que estabas en local. Mira siempre el contexto (herramientas como kubectx y un prompt que lo muestre ayudan muchísimo).</div>`},
 {t:"vf", p:"<code>kubectl apply</code> es idempotente: aplicar el mismo fichero dos veces no crea duplicados.",
  ok:true, why:"Es declarativo: si el objeto ya existe y coincide, no hace nada; si difiere, lo actualiza."},
 {t:"escribe", p:"Escribe el comando que muestra la documentación del campo <code>spec.replicas</code> de un Deployment",
  sol:["kubectl explain deployment.spec.replicas","kubectl explain deploy.spec.replicas","kubectl explain deployments.spec.replicas"], ph:"kubectl explain ...",
  pista:"kubectl explain con la ruta del campo.", why:"kubectl explain deployment.spec.replicas."}
]},

{
id:"k1n1",
titulo:"kubectl a velocidad de examen",
claves:["Generar YAML con comandos imperativos y --dry-run=client -o yaml","Formatos de salida: wide, yaml, jsonpath, custom-columns y --sort-by","Filtrar con -l, --field-selector y -A; comprobar antes con kubectl diff"],
pasos:[
 {t:"info", eti:"El truco de los profesionales", h:"Imperativo para generar, declarativo para aplicar",
  c:`<p>Nadie escribe un Deployment desde cero de memoria. Se <b>genera</b> un esqueleto correcto con un comando imperativo y se retoca:</p>
     <div class="termbox">kubectl create deployment web --image=nginx:1.27 --replicas=3 \\
  --dry-run=client -o yaml &gt; web.yaml       <span class="cm"># no crea nada: solo imprime el YAML</span>
kubectl run prueba --image=busybox:1.36 --dry-run=client -o yaml -- sleep 3600
kubectl expose deployment web --port=80 --target-port=8080 --dry-run=client -o yaml
kubectl create configmap app --from-literal=MODO=prod --dry-run=client -o yaml
kubectl create job migrar --image=ghcr.io/pablo/api:1.3.0 --dry-run=client -o yaml
kubectl create cronjob limpiar --image=busybox:1.36 --schedule="0 3 * * *" -- sh -c "echo hola"</div>
     <p>En los exámenes CKA y CKAD (prácticos, con tiempo muy justo) esto marca la diferencia; en el trabajo diario, evita errores de sangría. Después, el fichero va a Git y se aplica con <code>kubectl apply -f</code>.</p>`},
 {t:"term", p:"Genera, sin crear nada en el clúster, el YAML de un Deployment <code>web</code> con la imagen <code>nginx:1.27</code> y 3 réplicas", prompt:"pablo@portatil:~$",
  sol:["kubectl create deployment web --image=nginx:1.27 --replicas=3 --dry-run=client -o yaml","kubectl create deploy web --image=nginx:1.27 --replicas=3 --dry-run=client -o yaml","kubectl create deployment web --image=nginx:1.27 --replicas=3 -o yaml --dry-run=client","kubectl create deployment web --replicas=3 --image=nginx:1.27 --dry-run=client -o yaml"],
  pista:"kubectl create deployment, --image, --replicas, y termina con --dry-run=client -o yaml.",
  salida:`apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: web
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  strategy: {}
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - image: nginx:1.27
        name: nginx
        resources: {}
status: {}`,
  why:"Fíjate en que ya trae selector y labels coherentes. Redirígelo a un fichero (&gt; web.yaml), añade requests, probes y lo que falte, y aplícalo."},
 {t:"info", eti:"Ver lo que importa", h:"Formatos de salida y filtros",
  c:`<div class="termbox">kubectl get pods -o wide                              <span class="cm"># IP y nodo</span>
kubectl get pods -A                                   <span class="cm"># todos los namespaces</span>
kubectl get pods --show-labels
kubectl get pods -l app=api,entorno!=pruebas          <span class="cm"># selector de labels</span>
kubectl get pods --field-selector status.phase=Pending   <span class="cm"># por campos</span>
kubectl get pods --sort-by=.metadata.creationTimestamp
kubectl get pods -w                                   <span class="cm"># seguir los cambios en vivo</span>
kubectl get nodes -o jsonpath='{.items[*].metadata.name}'
kubectl get pods -o custom-columns=POD:.metadata.name,NODO:.spec.nodeName
kubectl diff -f web.yaml                              <span class="cm"># que cambiaria antes de aplicar</span>
kubectl api-resources                                 <span class="cm"># tipos, nombres cortos y si llevan namespace</span></div>
     <p><b>jsonpath</b> y <b>custom-columns</b> recorren el mismo JSON que ves con <code>-o json</code>: si no sabes la ruta, mira primero el objeto completo.</p>`},
 {t:"term", p:"Imprime solo los nombres de todos los nodos usando jsonpath", prompt:"pablo@portatil:~$",
  sol:["kubectl get nodes -o jsonpath='{.items[*].metadata.name}'","kubectl get nodes -o jsonpath={.items[*].metadata.name}","kubectl get nodes -o=jsonpath='{.items[*].metadata.name}'","kubectl get no -o jsonpath='{.items[*].metadata.name}'"],
  pista:"-o jsonpath='{.items[*].metadata.name}'",
  salida:`kind-control-plane kind-worker kind-worker2`,
  why:"<code>.items[*]</code> recorre la lista que devuelve un get de varios objetos. Para una línea por nodo: <code>{range .items[*]}{.metadata.name}{\"\\n\"}{end}</code>."},
 {t:"hueco", p:"Completa el comando que lista cada pod con el nodo donde corre, en dos columnas con nombre propio",
  tpl:"kubectl get pods -o ___=POD:.metadata.name,NODO:.spec.___",
  banco:["custom-columns","nodeName","jsonpath","node","hostIP","columns"], sol:["custom-columns","nodeName"],
  why:"El nodo asignado está en <code>spec.nodeName</code> (lo escribe el scheduler). <code>status.hostIP</code> es la IP de ese nodo."},
 {t:"par", p:"Empareja cada opción de kubectl con para qué sirve",
  pares:[["--dry-run=client -o yaml","Generar un manifiesto sin crear nada"],["--field-selector status.phase=Pending","Filtrar por el valor de un campo"],["--sort-by=.metadata.creationTimestamp","Ordenar por fecha de creación"],["-w","Seguir los cambios en directo"],["kubectl diff -f","Ver qué cambiaría antes de aplicar"]],
  why:"<code>kubectl diff</code> antes de <code>apply</code> en producción es el equivalente a <code>terraform plan</code>."},
 {t:"opcion", p:"En mitad de un examen no recuerdas dónde van exactamente las <code>tolerations</code> de un pod. ¿Qué es lo más rápido?",
  ops:["Buscarlo en un blog","kubectl explain pod.spec.tolerations (o kubectl explain pod.spec --recursive para ver todo el árbol)","Probar hasta que funcione","kubectl get tolerations"],
  ok:1, why:"kubectl explain lee el esquema de la API del propio clúster: siempre coincide con su versión. En el examen también se puede consultar kubernetes.io/docs."},
 {t:"vf", p:"<code>--dry-run=server</code> envía el objeto al API server, que lo valida y pasa por la admisión, pero no lo guarda.",
  ok:true, why:"Detecta errores que el cliente no ve (una política de admisión que lo rechazaría, un campo inmutable). <code>--dry-run=client</code> ni siquiera contacta con el clúster."},
 {t:"term", p:"Publica el Deployment <code>web</code> con un Service en el puerto 80 que reenvíe al 8080 de los contenedores", prompt:"pablo@portatil:~$",
  sol:["kubectl expose deployment web --port=80 --target-port=8080","kubectl expose deploy web --port=80 --target-port=8080","kubectl expose deployment/web --port=80 --target-port=8080","kubectl expose deploy/web --port=80 --target-port=8080","kubectl expose deployment web --target-port=8080 --port=80"],
  pista:"kubectl expose, el deployment, --port y --target-port.",
  salida:`service/web exposed`,
  why:"expose copia el selector del Deployment al Service, así que no puede equivocarse con las labels. Por defecto crea un ClusterIP."}
]}

]});
