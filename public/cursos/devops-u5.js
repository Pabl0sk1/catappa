window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "Kubernetes",
resumen: "Por qué un orquestador, Pods, Deployments, Services, configuración y kubectl",
nivel: "Avanzado",
color: "#7aa2f7",
lecciones: [

/* =============== O5 L1 =============== */
{
id:"o5l1",
titulo:"Por qué hace falta un orquestador",
claves:["Compose gestiona una máquina; Kubernetes, un clúster","Autocuración, escalado, rolling updates y descubrimiento de servicios","Kubernetes es declarativo: describes el estado deseado y él lo mantiene"],
pasos:[
 {t:"info", eti:"El límite de Compose", h:"Lo que Compose no puede hacer",
  c:`<p>Compose es perfecto en <b>una máquina</b>. Pero en producción seria aparecen preguntas que no resuelve:</p>
     <ul><li>¿Y si la máquina se cae? Todo tu servicio cae con ella.</li>
     <li>¿Y si necesitas 30 instancias repartidas en 10 máquinas?</li>
     <li>¿Quién vuelve a arrancar un contenedor en otra máquina si la suya muere?</li>
     <li>¿Cómo actualizas sin cortar el servicio en todas a la vez?</li></ul>
     <p>Un <b>orquestador</b> gestiona contenedores en un <b>clúster</b> de muchas máquinas. El estándar de facto es <b>Kubernetes</b> (abreviado <b>K8s</b>), creado por Google y hoy mantenido por la CNCF.</p>`},

 {t:"info", eti:"Lo que aporta", h:"Las cinco capacidades clave",
  c:`<ul><li><b>Autocuración</b>: si un contenedor muere, lo reinicia; si una máquina cae, recoloca sus contenedores en otras.</li>
     <li><b>Escalado</b>: de 3 a 30 réplicas con un comando, o automáticamente según la CPU.</li>
     <li><b>Actualizaciones sin corte</b> (rolling updates) y <b>rollback</b>.</li>
     <li><b>Descubrimiento de servicios y balanceo</b>: nombres DNS estables y reparto de tráfico entre réplicas.</li>
     <li><b>Configuración y secretos</b> separados de la imagen.</li></ul>`},

 {t:"opcion", p:"Tu API corre en Compose en un único servidor y el servidor se apaga. ¿Qué pasa?",
  ops:["Compose la mueve a otro servidor",
       "Se cae todo: Compose no gestiona varias máquinas ni recoloca contenedores",
       "Kubernetes la levanta sola",
       "No pasa nada"],
  ok:1,
  why:"Esa es la diferencia fundamental. Kubernetes reprogramaría los contenedores en las máquinas que quedan."},

 {t:"info", eti:"El modelo mental", h:"Estado deseado y bucle de control",
  c:`<p>Kubernetes es <b>declarativo</b>: tú le dices «quiero 3 réplicas de mi API con esta imagen», y él trabaja constantemente para que la realidad coincida.</p>
     <div class="diag">   estado DESEADO (tu YAML)       3 replicas
            |
      [ bucle de control ]  <- compara continuamente
            |
   estado REAL del cluster        2 replicas (una murio)
            |
      accion: crear 1 replica mas</div>
     <p>No le dices «arranca un contenedor»; le dices cómo quieres que esté el sistema, y él se encarga.</p>`},

 {t:"vf", p:"En Kubernetes indicas los pasos exactos que hay que ejecutar para arrancar tu aplicación.",
  ok:false,
  why:"Declaras el estado deseado y los controladores de Kubernetes se encargan de alcanzarlo y mantenerlo."},

 {t:"opcion", p:"«¿Por qué usarías Kubernetes en lugar de Compose?»",
  ops:["Porque es más moderno",
       "Cuando necesito alta disponibilidad en varias máquinas, autocuración, escalado y despliegues sin corte; para un solo servidor pequeño, Compose basta",
       "Siempre, Compose está obsoleto",
       "Porque es más fácil"],
  ok:1,
  why:"Respuesta matizada: Kubernetes añade mucha complejidad, y hay que justificarla."}
]},

/* =============== O5 L2 =============== */
{
id:"o5l2",
titulo:"La arquitectura de un clúster",
claves:["Plano de control: API server, scheduler, controladores y etcd","Nodos de trabajo: kubelet, runtime de contenedores y kube-proxy","Todo pasa por el API server; kubectl es solo un cliente"],
pasos:[
 {t:"info", eti:"Las dos partes", h:"El cerebro y los músculos",
  c:`<div class="diag">+----------- PLANO DE CONTROL (control plane) -----------+
|  API server  |  scheduler  |  controladores  |  etcd   |
+-------------------------+------------------------------+
                          |
     +--------------------+--------------------+
     v                    v                    v
 [ nodo 1 ]           [ nodo 2 ]           [ nodo 3 ]
 kubelet              kubelet              kubelet
 containerd           containerd           containerd
 pods...              pods...              pods...</div>
     <p>El <b>plano de control</b> decide. Los <b>nodos</b> (máquinas de trabajo) ejecutan los contenedores.</p>`},

 {t:"info", eti:"Plano de control", h:"Las piezas del cerebro",
  c:`<ul><li><b>API server</b>: la puerta de entrada. Todo (tú con kubectl, los nodos, los controladores) habla con él.</li>
     <li><b>etcd</b>: la base de datos donde se guarda el estado del clúster. Si se pierde etcd, se pierde el clúster.</li>
     <li><b>scheduler</b>: decide en qué nodo se coloca cada pod nuevo, según recursos disponibles.</li>
     <li><b>controladores</b>: los bucles que comparan lo deseado con lo real y corrigen.</li></ul>`},

 {t:"info", eti:"Nodos", h:"Las piezas de cada máquina",
  c:`<ul><li><b>kubelet</b>: el agente de cada nodo. Recibe órdenes («ejecuta este pod») y vigila que sus contenedores estén sanos.</li>
     <li><b>runtime de contenedores</b>: normalmente <b>containerd</b>, el mismo componente que usa Docker por debajo. Las imágenes que construyes con Docker funcionan sin cambios.</li>
     <li><b>kube-proxy</b>: gestiona las reglas de red para que los Services funcionen.</li></ul>`},

 {t:"par", p:"Empareja cada componente con su función",
  pares:[["API server","Punto de entrada de todas las órdenes"],
         ["etcd","Base de datos con el estado del clúster"],
         ["scheduler","Decide en qué nodo va cada pod"],
         ["kubelet","Agente que ejecuta y vigila los pods en cada nodo"]],
  why:"En entrevistas de DevOps es habitual que pidan dibujar esto."},

 {t:"opcion", p:"¿En qué nodo se ejecuta un pod nuevo? ¿Quién lo decide?",
  ops:["El kubelet del nodo más rápido","El scheduler, según los recursos disponibles y las restricciones","etcd","El usuario siempre a mano"],
  ok:1,
  why:"El scheduler. Tú puedes influir con requests, afinidades o taints, pero decide él."},

 {t:"info", eti:"En la práctica", h:"Casi nadie monta el plano de control",
  c:`<p>En la nube, el plano de control lo gestiona el proveedor: <b>EKS</b> (AWS), <b>AKS</b> (Azure), <b>GKE</b> (Google). Tú solo te ocupas de tus aplicaciones y, a veces, de los nodos.</p>
     <p>Para practicar en local: <b>kind</b> (Kubernetes dentro de contenedores Docker), <b>minikube</b> o el Kubernetes que trae <b>Docker Desktop</b> (se activa en sus ajustes).</p>`},

 {t:"vf", p:"Una imagen construida con <code>docker build</code> se puede ejecutar en Kubernetes sin modificarla.",
  ok:true,
  why:"Sí: son imágenes OCI estándar. Solo hace falta publicarla en un registry al que el clúster tenga acceso."}
]},

/* =============== O5 L3 =============== */
{
id:"o5l3",
titulo:"Pods y Deployments",
claves:["Pod: la unidad mínima; uno o varios contenedores que comparten red","No se crean pods sueltos: se crea un Deployment","Deployment: réplicas, autocuración y rolling updates"],
pasos:[
 {t:"info", eti:"La unidad mínima", h:"El Pod",
  c:`<p>Kubernetes no ejecuta contenedores sueltos: ejecuta <b>Pods</b>. Un pod es un envoltorio para <b>uno o varios contenedores</b> que:</p>
     <ul><li>comparten la <b>misma IP</b> y pueden hablarse por <code>localhost</code>,</li>
     <li>pueden compartir volúmenes,</li>
     <li>se programan juntos en el mismo nodo.</li></ul>
     <p>Lo normal es <b>un contenedor por pod</b>. Varios solo cuando están íntimamente ligados (por ejemplo, un contenedor auxiliar que recoge logs: el patrón <i>sidecar</i>).</p>
     <p>Los pods son <b>efímeros</b>: mueren y se crean otros con otra IP. Nunca dependas de la IP de un pod.</p>`},

 {t:"opcion", p:"¿Qué es un Pod?",
  ops:["Una máquina virtual",
       "La unidad mínima de Kubernetes: uno o varios contenedores que comparten red y almacenamiento",
       "Un tipo de imagen",
       "Un nodo del clúster"],
  ok:1,
  why:"Definición de entrevista, casi palabra por palabra."},

 {t:"info", eti:"Lo que de verdad se crea", h:"El Deployment",
  c:`<p>Si creas un pod suelto y muere, nadie lo resucita. Por eso se crea un <b>Deployment</b>, que declara cuántas réplicas quieres y de qué:</p>
     <div class="termbox">apiVersion: apps/v1
kind: <b>Deployment</b>
metadata:
  name: api-tareas
spec:
  <b>replicas: 3</b>
  selector:
    matchLabels: { app: api-tareas }
  template:                       <span class="cm"># la plantilla de cada pod</span>
    metadata:
      labels: { app: api-tareas }
    spec:
      containers:
        - name: api
          image: ghcr.io/pablo/api-tareas:1.2.0
          ports:
            - containerPort: 8080</div>
     <p>Kubernetes mantendrá siempre 3 pods con esa imagen. Si uno muere, crea otro. Si cambias la imagen a <code>1.3.0</code>, hace un rolling update.</p>`},

 {t:"info", eti:"Las etiquetas", h:"labels y selector",
  c:`<p>Las <b>labels</b> (etiquetas clave-valor) son el pegamento de Kubernetes. El Deployment encuentra «sus» pods porque llevan la etiqueta <code>app: api-tareas</code> que indica su <code>selector</code>.</p>
     <p>Y lo mismo hará el Service de la siguiente lección: enviará tráfico a todos los pods con esa etiqueta, sin saber sus IPs.</p>`},

 {t:"par", p:"Empareja cada campo del Deployment con su significado",
  pares:[["replicas","Cuántos pods iguales mantener"],
         ["template","La plantilla con la que se crea cada pod"],
         ["selector","Qué pods pertenecen a este Deployment, por etiquetas"],
         ["image","La imagen de contenedor que ejecutan los pods"]],
  why:"Con este YAML ya puedes desplegar cualquier imagen que hayas construido."},

 {t:"opcion", p:"Borras a mano uno de los 3 pods de un Deployment. ¿Qué pasa?",
  ops:["Quedan 2 para siempre","El Deployment detecta que faltan réplicas y crea otro pod en segundos","Se borra el Deployment","Se reinicia el clúster"],
  ok:1,
  why:"Autocuración: el estado deseado son 3, el real 2, y el controlador lo corrige."},

 {t:"vf", p:"La IP de un pod es estable y se puede usar en la configuración de otros servicios.",
  ok:false,
  why:"Los pods son efímeros y cambian de IP al recrearse. Para una dirección estable existe el Service."}
]},

/* =============== O5 L4 =============== */
{
id:"o5l4",
titulo:"Services e Ingress",
claves:["Service: IP y nombre DNS estables delante de un grupo de pods","ClusterIP (interno), NodePort y LoadBalancer (externo)","Ingress: enrutado HTTP por dominio y ruta, con TLS"],
pasos:[
 {t:"info", eti:"El problema", h:"¿Cómo encuentras pods que cambian de IP?",
  c:`<p>Tus pods mueren, se crean y cambian de IP continuamente. ¿Cómo se conecta el frontend a la API?</p>
     <p>Con un <b>Service</b>: un objeto con una <b>IP estable</b> y un <b>nombre DNS</b> que reparte el tráfico entre todos los pods con cierta etiqueta.</p>
     <div class="termbox">apiVersion: v1
kind: <b>Service</b>
metadata:
  name: api-tareas
spec:
  selector: { app: api-tareas }    <span class="cm"># envia a los pods con esta etiqueta</span>
  ports:
    - port: 80                     <span class="cm"># puerto del Service</span>
      targetPort: 8080             <span class="cm"># puerto del contenedor</span></div>
     <p>Ahora cualquier pod del clúster puede llamar a <code>http://api-tareas</code>. ¿Te suena? Es el mismo DNS por nombre de servicio que en Compose.</p>`},

 {t:"opcion", p:"¿Qué equivale en Kubernetes al nombre de servicio de Compose (<code>db:5432</code>)?",
  ops:["El nombre del pod","El nombre de un Service, resuelto por el DNS interno del clúster","La IP del nodo","El nombre de la imagen"],
  ok:1,
  why:"La idea es idéntica. Por eso lo aprendido con Compose se traslada directamente."},

 {t:"info", eti:"Tipos", h:"ClusterIP, NodePort y LoadBalancer",
  c:`<ul><li><b>ClusterIP</b> (por defecto): solo accesible <b>dentro</b> del clúster. Para bases de datos y servicios internos.</li>
     <li><b>NodePort</b>: abre un puerto alto (30000-32767) en todos los nodos. Útil para pruebas.</li>
     <li><b>LoadBalancer</b>: en la nube, crea un <b>balanceador</b> real del proveedor con una IP pública.</li></ul>`},

 {t:"par", p:"Empareja cada tipo de Service con su uso",
  pares:[["ClusterIP","Acceso solo interno, dentro del clúster"],
         ["NodePort","Un puerto abierto en cada nodo, para pruebas"],
         ["LoadBalancer","Un balanceador del proveedor cloud con IP pública"]],
  why:"La base de datos: ClusterIP. Lo mismo que no publicar puertos en Compose."},

 {t:"info", eti:"Entrada HTTP", h:"Ingress",
  c:`<p>Crear un LoadBalancer por cada servicio es caro. Para tráfico web se usa un <b>Ingress</b>: un único punto de entrada que enruta por <b>dominio y ruta</b>, y gestiona el certificado TLS.</p>
     <div class="termbox">apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
spec:
  tls:
    - hosts: [tareas.miempresa.com]
      secretName: tareas-tls
  rules:
    - host: tareas.miempresa.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service: { name: api-tareas, port: { number: 80 } }</div>
     <p>Funciona gracias a un <b>Ingress Controller</b> (normalmente nginx o Traefik) instalado en el clúster. Exactamente el papel que tenía nginx delante de tu API en Compose.</p>`},

 {t:"opcion", p:"Quieres exponer <code>tareas.com/api</code> y <code>tareas.com/web</code> con un solo punto de entrada y HTTPS. ¿Qué usas?",
  ops:["Dos Services NodePort","Un Ingress con dos rutas hacia dos Services","Un pod con dos contenedores","etcd"],
  ok:1,
  why:"Ingress: enrutado por dominio y ruta, y terminación TLS en un solo sitio."},

 {t:"vf", p:"Un Service de tipo ClusterIP es accesible desde internet.",
  ok:false,
  why:"Solo dentro del clúster. Es lo que quieres para bases de datos y servicios internos."}
]},

/* =============== O5 L5 =============== */
{
id:"o5l5",
titulo:"Configuración, datos y salud",
claves:["ConfigMap para configuración; Secret para datos sensibles","PersistentVolumeClaim para datos que deben sobrevivir","Probes: liveness reinicia, readiness saca del balanceo"],
pasos:[
 {t:"info", eti:"Configuración", h:"ConfigMap y Secret",
  c:`<p>Igual que en Docker, la imagen es la misma en todos los entornos y la configuración se inyecta:</p>
     <div class="termbox">apiVersion: v1
kind: ConfigMap
metadata: { name: api-config }
data:
  SPRING_PROFILES_ACTIVE: prod
---
apiVersion: v1
kind: Secret
metadata: { name: api-secretos }
type: Opaque
stringData:
  SPRING_DATASOURCE_PASSWORD: cambia-esto</div>
     <div class="termbox"><span class="cm"># en el contenedor del Deployment:</span>
envFrom:
  - configMapRef: { name: api-config }
  - secretRef:    { name: api-secretos }</div>`},

 {t:"info", eti:"Ojo con los Secret", h:"Un Secret no está cifrado por defecto",
  c:`<p>Los Secret de Kubernetes se guardan en <b>base64</b>, que es una codificación, <b>no un cifrado</b>: cualquiera con acceso puede leerlos. Para protegerlos de verdad:</p>
     <ul><li>cifrado en reposo de etcd,</li>
     <li>permisos (RBAC) para que pocos puedan leerlos,</li>
     <li>y en serio: <b>External Secrets</b> con Vault o el gestor de secretos del proveedor, o <b>Sealed Secrets</b> para poder guardarlos cifrados en Git.</li></ul>`},

 {t:"vf", p:"Los Secret de Kubernetes están cifrados de forma segura por defecto porque usan base64.",
  ok:false,
  why:"base64 es solo una codificación reversible. Es una trampa clásica en las entrevistas."},

 {t:"info", eti:"Datos", h:"PersistentVolumeClaim",
  c:`<p>Los pods son efímeros, así que los datos no pueden vivir en ellos. Un <b>PersistentVolumeClaim</b> (PVC) pide almacenamiento persistente al clúster («necesito 20 GB»), y se monta en el pod:</p>
     <div class="termbox">volumeMounts:
  - name: datos
    mountPath: /var/lib/postgresql/data
volumes:
  - name: datos
    persistentVolumeClaim: { claimName: pg-datos }</div>
     <p>Es el equivalente al named volume de Compose. En la práctica, muchas empresas no ponen la base de datos en Kubernetes y usan una gestionada del proveedor (RDS, Cloud SQL).</p>`},

 {t:"info", eti:"Salud", h:"Liveness y readiness probes",
  c:`<div class="termbox">livenessProbe:
  httpGet: { path: /actuator/health/liveness, port: 8080 }
  initialDelaySeconds: 30
readinessProbe:
  httpGet: { path: /actuator/health/readiness, port: 8080 }</div>
     <ul><li><b>Liveness</b> («¿estás vivo?»): si falla, Kubernetes <b>reinicia</b> el contenedor. Para apps colgadas.</li>
     <li><b>Readiness</b> («¿puedes atender?»): si falla, el pod se <b>saca del balanceo</b> del Service, pero no se reinicia. Para apps que arrancan o están saturadas.</li></ul>
     <p>Spring Boot Actuator expone exactamente esos dos endpoints.</p>`},

 {t:"par", p:"Empareja cada objeto o probe con su función",
  pares:[["ConfigMap","Configuración no sensible"],
         ["Secret","Datos sensibles (a proteger aparte)"],
         ["PersistentVolumeClaim","Almacenamiento que sobrevive a los pods"],
         ["livenessProbe","Reiniciar el contenedor si deja de responder"],
         ["readinessProbe","Sacar el pod del balanceo mientras no está listo"]],
  why:"Liveness contra readiness es una pregunta de entrevista muy frecuente."},

 {t:"opcion", p:"Tu API tarda 40 segundos en arrancar y recibe tráfico antes de estar lista, dando errores. ¿Qué configuras?",
  ops:["Una livenessProbe agresiva","Una readinessProbe: no recibe tráfico hasta que responde","Más réplicas","Un ConfigMap"],
  ok:1,
  why:"Readiness controla cuándo entra en el balanceo. Una liveness agresiva la reiniciaría en bucle."}
]},

/* =============== O5 L6 =============== */
{
id:"o5l6",
titulo:"kubectl: el día a día",
claves:["kubectl apply -f aplica ficheros YAML","get, describe y logs para investigar","rollout status, history y undo para los despliegues"],
pasos:[
 {t:"info", eti:"Aplicar", h:"kubectl apply",
  c:`<p><b>kubectl</b> es el cliente de línea de comandos de Kubernetes. Como es declarativo, el comando principal es:</p>
     <div class="termbox">kubectl apply -f deployment.yml
kubectl apply -f k8s/            <span class="cm"># toda una carpeta de manifiestos</span></div>
     <p>Si el recurso no existe, lo crea; si existe, lo actualiza para que coincida con el fichero. Idempotente, como Ansible o compose up.</p>`},

 {t:"info", eti:"Investigar", h:"get, describe y logs",
  c:`<div class="termbox">kubectl get pods                    <span class="cm"># lista (como docker ps)</span>
kubectl get pods -o wide            <span class="cm"># con IP y nodo</span>
kubectl get deploy,svc,ingress      <span class="cm"># varios tipos a la vez</span>
kubectl describe pod api-7d9f-x2k   <span class="cm"># detalle + EVENTOS (lo mas util)</span>
kubectl logs api-7d9f-x2k           <span class="cm"># logs (como docker logs)</span>
kubectl logs -f deploy/api-tareas   <span class="cm"># en vivo, de un pod del deployment</span>
kubectl exec -it api-7d9f-x2k -- sh <span class="cm"># entrar (como docker exec)</span></div>
     <p>¿Ves el paralelismo con Docker? El método de depuración es el mismo.</p>`},

 {t:"term", p:"Lista los pods del namespace actual",
  prompt:"pablo@portatil:~$",
  sol:["kubectl get pods","kubectl get pod","kubectl get po"],
  pista:"kubectl get + el tipo de recurso en plural.",
  salida:`NAME                          READY   STATUS             RESTARTS      AGE
api-tareas-7d9f8c6b5d-2xk9p   1/1     Running            0             3h
api-tareas-7d9f8c6b5d-8hq4m   1/1     Running            0             3h
api-tareas-7d9f8c6b5d-t7w2c   0/1     CrashLoopBackOff   6 (40s ago)   12m`,
  why:"Dos pods bien y uno en CrashLoopBackOff: arranca, muere, Kubernetes espera cada vez más y lo vuelve a intentar."},

 {t:"info", eti:"Estados que verás", h:"Los errores típicos de los pods",
  c:`<ul><li><b>CrashLoopBackOff</b>: el contenedor arranca y muere una y otra vez. → <code>kubectl logs</code> (y <code>--previous</code> para el intento anterior).</li>
     <li><b>ImagePullBackOff</b>: no puede descargar la imagen: nombre o tag mal escritos, o falta de credenciales del registry.</li>
     <li><b>Pending</b>: el scheduler no encuentra un nodo con recursos suficientes. → <code>kubectl describe</code>, mira los eventos.</li>
     <li><b>OOMKilled</b>: se quedó sin memoria (el famoso 137 de Docker).</li></ul>`},

 {t:"par", p:"Empareja cada estado con su causa más probable",
  pares:[["CrashLoopBackOff","La aplicación arranca y se cae en bucle"],
         ["ImagePullBackOff","No puede descargar la imagen del registry"],
         ["Pending","No hay nodo con recursos suficientes"],
         ["OOMKilled","Superó su límite de memoria"]],
  why:"Diagnosticar estos cuatro estados es de lo primero que se pregunta en una entrevista de Kubernetes."},

 {t:"escribe", p:"Un pod está en CrashLoopBackOff. Escribe el comando para ver los logs del pod <code>api-7d9f-t7w2c</code>",
  sol:["kubectl logs api-7d9f-t7w2c","kubectl logs api-7d9f-t7w2c --previous","kubectl logs --previous api-7d9f-t7w2c","kubectl logs -p api-7d9f-t7w2c"],
  ph:"kubectl ...",
  pista:"El mismo verbo que en Docker.",
  why:"kubectl logs. Con --previous ves los logs del intento anterior, justo antes de morir."},

 {t:"info", eti:"Despliegues", h:"rollout",
  c:`<div class="termbox">kubectl set image deploy/api-tareas api=ghcr.io/pablo/api-tareas:1.3.0
kubectl rollout status deploy/api-tareas    <span class="cm"># ver el rolling update en curso</span>
kubectl rollout history deploy/api-tareas   <span class="cm"># versiones anteriores</span>
kubectl rollout undo deploy/api-tareas      <span class="cm"># ROLLBACK a la anterior</span>
kubectl scale deploy/api-tareas --replicas=5</div>
     <p>En la práctica, en lugar de <code>set image</code> se cambia el YAML en Git y un pipeline (o una herramienta <b>GitOps</b> como Argo CD) aplica el cambio: el estado del clúster siempre es el que dice el repositorio.</p>`},

 {t:"escribe", p:"La versión nueva de <code>api-tareas</code> da errores. Escribe el comando que vuelve a la versión anterior",
  sol:["kubectl rollout undo deploy/api-tareas","kubectl rollout undo deployment/api-tareas","kubectl rollout undo deployment api-tareas","kubectl rollout undo deploy api-tareas"],
  ph:"kubectl rollout ...",
  pista:"rollout y el verbo de deshacer.",
  why:"kubectl rollout undo. Un rollback en segundos."},

 {t:"vf", p:"<code>kubectl describe</code> muestra los eventos del recurso, muy útiles para saber por qué un pod no arranca.",
  ok:true,
  why:"Los eventos del final de describe suelen decirte la causa exacta: imagen no encontrada, falta de memoria, fallo de la probe..."}
]}

]});
