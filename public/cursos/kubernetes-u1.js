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
  c:`<div class="diag">            +---------------- PLANO DE CONTROL ----------------+
kubectl --> | kube-apiserver  <-> etcd                          |
            | kube-scheduler     kube-controller-manager        |
            | (cloud-controller-manager, en la nube)            |
            +------------------------+--------------------------+
                                     | (todo pasa por el API server)
            +------------------------+--------------------------+
            v                        v                          v
        [ nodo 1 ]               [ nodo 2 ]                 [ nodo 3 ]
        kubelet                  kubelet                    kubelet
        containerd               containerd                 containerd
        kube-proxy               kube-proxy                 kube-proxy
        pods...                  pods...                    pods...</div>`},
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
     <li><b>kube-proxy</b>: traduce los Services a reglas de red (iptables o IPVS) para repartir el tráfico entre pods. Algunos plugins de red modernos, como Cilium, lo sustituyen.</li></ul>`},
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
 ✓ Ensuring node image (kindest/node:v1.31.0)
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
]}

]});
