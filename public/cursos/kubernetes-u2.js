window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Pods",
resumen: "La unidad mínima: manifiesto, ciclo de vida, varios contenedores, recursos y calidad de servicio",
nivel: "Fundamentos",
color: "#6d9cf2",
lecciones: [

{
id:"k2l1",
titulo:"Qué es un pod",
claves:["Un pod agrupa uno o varios contenedores que comparten red y volúmenes","Cada pod tiene su IP; sus contenedores se hablan por localhost","Los pods son efímeros: no se reparan, se sustituyen"],
pasos:[
 {t:"info", eti:"La unidad mínima", h:"Kubernetes no ejecuta contenedores sueltos",
  c:`<p>La unidad que Kubernetes programa es el <b>pod</b>: un envoltorio de uno o varios contenedores que:</p>
     <ul><li>comparten <b>la misma IP</b> y se hablan por <code>localhost</code>,</li>
     <li>pueden compartir <b>volúmenes</b>,</li>
     <li>se ejecutan siempre juntos en el <b>mismo nodo</b>.</li></ul>
     <p>Lo normal es <b>un contenedor por pod</b>. Varios solo cuando están íntimamente ligados.</p>`},
 {t:"info", eti:"Efímeros", h:"Ganado, no mascotas",
  c:`<p>Un pod <b>no se repara</b>: si muere o su nodo cae, se crea <b>otro pod nuevo</b>, con otro nombre y otra IP. Por eso:</p>
     <ul><li>nunca guardes datos importantes dentro de un pod (usa volúmenes persistentes),</li>
     <li>nunca dependas de la IP de un pod (usa Services),</li>
     <li>casi nunca crees pods sueltos: se crean a través de Deployments, StatefulSets o Jobs, que los recrean.</li></ul>`},
 {t:"opcion", p:"¿Qué comparten dos contenedores del mismo pod?",
  ops:["Nada","La red (misma IP, se hablan por localhost), los volúmenes que declaren y el nodo donde corren","Solo la imagen","Solo el nombre"],
  ok:1, why:"Comparten el namespace de red. Por eso no pueden usar el mismo puerto a la vez."},
 {t:"info", eti:"El manifiesto", h:"Un pod en YAML",
  c:`<div class="termbox">apiVersion: v1
kind: Pod
metadata:
  name: api
  labels: { app: api }
spec:
  containers:
    - name: api
      image: ghcr.io/pablo/api-tareas:1.2.0
      ports:
        - containerPort: 8080       <span class="cm"># informativo, como EXPOSE</span>
      env:
        - name: SPRING_PROFILES_ACTIVE
          value: prod</div>
     <div class="termbox">kubectl apply -f pod.yml
kubectl get pod api -o wide
kubectl port-forward pod/api 8080:8080   <span class="cm"># probarlo desde tu maquina</span></div>`},
 {t:"vf", p:"Si el nodo donde corre un pod creado a mano (sin Deployment) se cae, Kubernetes lo recrea en otro nodo.",
  ok:false, why:"Un pod suelto no tiene controlador que lo vigile: desaparece con su nodo. Por eso se usan Deployments."},
 {t:"escribe", p:"Escribe el comando que redirige tu puerto local 8080 al puerto 8080 del pod <code>api</code>",
  sol:["kubectl port-forward pod/api 8080:8080","kubectl port-forward api 8080:8080","kubectl port-forward pods/api 8080:8080"], ph:"kubectl port-forward ...",
  pista:"kubectl port-forward, el pod y local:remoto.", why:"Ideal para probar sin exponer nada: el túnel pasa por el API server."}
]},

{
id:"k2l2",
titulo:"Ciclo de vida y estados",
claves:["Fases: Pending, Running, Succeeded, Failed, Unknown","restartPolicy: Always, OnFailure, Never","CrashLoopBackOff, ImagePullBackOff y OOMKilled son los errores clásicos"],
pasos:[
 {t:"info", eti:"Fases", h:"De Pending a Running",
  c:`<ul><li><b>Pending</b>: aceptado, pero aún sin arrancar: esperando nodo o descargando la imagen.</li>
     <li><b>Running</b>: asignado a un nodo y con al menos un contenedor en marcha.</li>
     <li><b>Succeeded</b>: todos los contenedores terminaron con éxito (típico de Jobs).</li>
     <li><b>Failed</b>: algún contenedor terminó con error y no se reiniciará.</li>
     <li><b>Unknown</b>: no se sabe nada del nodo (normalmente un nodo sin comunicación).</li></ul>`},
 {t:"info", eti:"Reinicios", h:"restartPolicy",
  c:`<p>Cuando un contenedor termina, el kubelet lo reinicia según la <b>restartPolicy</b> del pod:</p>
     <ul><li><b>Always</b> (por defecto, Deployments): siempre.</li>
     <li><b>OnFailure</b> (Jobs): solo si terminó con error.</li>
     <li><b>Never</b>: nunca.</li></ul>
     <p>Los reinicios repetidos esperan cada vez más (10 s, 20 s, 40 s... hasta 5 minutos): eso es el <b>BackOff</b>.</p>`},
 {t:"par", p:"Empareja cada estado con su causa más probable",
  pares:[["CrashLoopBackOff","El contenedor arranca y se cae una y otra vez"],["ImagePullBackOff","No se puede descargar la imagen"],["Pending prolongado","Ningún nodo tiene recursos suficientes o no cumple las restricciones"],["OOMKilled","Superó su límite de memoria"],["CreateContainerConfigError","Falta un ConfigMap o Secret referenciado"]],
  why:"Diagnosticar estos cinco estados es lo primero que se pregunta en entrevistas de Kubernetes."},
 {t:"term", p:"Un pod está en CrashLoopBackOff. Mira los logs del intento anterior, antes de que muriera",
  prompt:"pablo@portatil:~$", sol:["kubectl logs api-7d9f-t7w2c --previous","kubectl logs api-7d9f-t7w2c -p","kubectl logs --previous api-7d9f-t7w2c","kubectl logs -p api-7d9f-t7w2c"],
  pista:"kubectl logs con la opción del intento anterior.",
  salida:`Caused by: org.postgresql.util.PSQLException: Connection to postgres:5432 refused.
APPLICATION FAILED TO START`,
  why:"Sin --previous verías los logs del intento actual, que quizá aún no ha llegado a fallar."},
 {t:"opcion", p:"Un pod lleva 10 minutos en Pending. ¿Qué comando te dirá por qué?",
  ops:["kubectl logs","kubectl describe pod: la sección Events muestra, por ejemplo, «0/3 nodes are available: insufficient memory»","kubectl delete pod","kubectl exec"],
  ok:1, why:"Un pod Pending no tiene logs porque no ha arrancado. Los eventos del scheduler explican el motivo."},
 {t:"vf", p:"<code>OOMKilled</code> significa que el contenedor superó el límite de memoria definido en su spec.",
  ok:true, why:"El kernel lo mata (el Exited 137 de Docker). Se sube el límite o se corrige el consumo."}
]},

{
id:"k2l3",
titulo:"Varios contenedores: sidecars e init containers",
claves:["initContainers se ejecutan antes, en orden, y deben terminar con éxito","Un sidecar acompaña al principal todo el tiempo (logs, proxy, sincronización)","Desde Kubernetes 1.29 hay sidecars nativos con restartPolicy: Always en initContainers"],
pasos:[
 {t:"info", eti:"Antes de arrancar", h:"Init containers",
  c:`<p>Los <b>init containers</b> se ejecutan <b>antes</b> que los contenedores principales, uno detrás de otro, y cada uno debe terminar bien para que empiece el siguiente:</p>
     <div class="termbox">spec:
  initContainers:
    - name: esperar-bd
      image: busybox:1.36
      command: ["sh", "-c", "until nc -z postgres 5432; do sleep 2; done"]
    - name: migraciones
      image: ghcr.io/pablo/api-tareas:1.2.0
      command: ["java", "-jar", "app.jar", "--migrar"]
  containers:
    - name: api
      image: ghcr.io/pablo/api-tareas:1.2.0</div>
     <p>Usos: esperar a una dependencia, ejecutar migraciones, preparar ficheros de configuración o permisos.</p>`},
 {t:"opcion", p:"¿Qué ocurre si un init container falla?",
  ops:["Se ignora y arranca el principal","El pod no arranca sus contenedores principales y el init se reintenta según la política de reinicio","Se borra el Deployment","Se ejecuta en otro nodo"],
  ok:1, why:"Los init containers son una puerta: hasta que no terminan bien, la aplicación no arranca."},
 {t:"info", eti:"Acompañantes", h:"El patrón sidecar",
  c:`<p>Un <b>sidecar</b> es un contenedor secundario que vive junto al principal todo el tiempo y le añade una capacidad sin tocar su código:</p>
     <ul><li>un proxy de malla de servicios (Envoy en Istio) que cifra el tráfico,</li>
     <li>un recolector que envía logs a un sistema central,</li>
     <li>un agente que sincroniza configuración o certificados.</li></ul>
     <p>Otros patrones: <b>ambassador</b> (proxy hacia fuera) y <b>adapter</b> (traduce el formato de salida, por ejemplo métricas).</p>`},
 {t:"par", p:"Empareja cada patrón con su propósito",
  pares:[["Init container","Preparar algo antes de que arranque la aplicación"],["Sidecar","Añadir una capacidad junto a la aplicación mientras corre"],["Ambassador","Hacer de proxy entre la aplicación y el exterior"],["Adapter","Adaptar la salida de la aplicación a un formato estándar"]],
  why:"Son patrones de diseño de sistemas distribuidos, y se preguntan en entrevistas de arquitectura."},
 {t:"vf", p:"Dos contenedores del mismo pod pueden escuchar a la vez en el puerto 8080.",
  ok:false, why:"Comparten la red del pod: el puerto solo puede usarlo uno."}
]},

{
id:"k2l4",
titulo:"Recursos: requests, limits y QoS",
claves:["requests: lo reservado, lo usa el scheduler para decidir el nodo","limits: el techo; superar memoria = OOMKilled, superar CPU = throttling","Clases QoS: Guaranteed, Burstable y BestEffort"],
pasos:[
 {t:"info", eti:"Reservar y limitar", h:"requests y limits",
  c:`<div class="termbox">resources:
  requests:
    cpu: "250m"          <span class="cm"># un cuarto de nucleo reservado</span>
    memory: "512Mi"
  limits:
    memory: "768Mi"      <span class="cm"># techo de memoria</span>
    cpu: "1"             <span class="cm"># techo de CPU (opcional, ver abajo)</span></div>
     <ul><li><b>requests</b>: lo que el pod tiene <b>garantizado</b>. El scheduler solo lo coloca en un nodo con ese espacio libre.</li>
     <li><b>limits</b>: lo máximo que puede usar.</li></ul>
     <p>Unidades: CPU en núcleos o milicores (<code>500m</code> = medio núcleo); memoria en <code>Mi</code>/<code>Gi</code>.</p>`},
 {t:"info", eti:"La diferencia clave", h:"Pasarse de memoria contra pasarse de CPU",
  c:`<ul><li><b>Memoria</b> no se puede «compartir un poco menos»: si el contenedor supera su límite, el kernel lo <b>mata</b> (OOMKilled).</li>
     <li><b>CPU</b> sí se puede racionar: si supera su límite, se le <b>frena</b> (throttling). Sigue vivo, pero más lento.</li></ul>
     <p>Por eso muchos equipos ponen límite de memoria siempre y son prudentes con el límite de CPU: un límite de CPU bajo puede frenar la aplicación justo en los picos (y en Java, durante el arranque).</p>`},
 {t:"opcion", p:"¿Qué le pasa a un contenedor que intenta usar más CPU de su límite?",
  ops:["Lo matan con OOMKilled","Lo frenan (throttling): sigue funcionando más despacio","Se reinicia el nodo","Nada"],
  ok:1, why:"La CPU es un recurso comprimible; la memoria no."},
 {t:"info", eti:"Calidad de servicio", h:"Las tres clases QoS",
  c:`<ul><li><b>Guaranteed</b>: requests = limits en CPU y memoria para todos los contenedores. Los últimos en ser desalojados.</li>
     <li><b>Burstable</b>: tiene requests pero limits mayores (o no en todos). Término medio.</li>
     <li><b>BestEffort</b>: sin requests ni limits. Los primeros en morir si el nodo se queda sin memoria.</li></ul>
     <p>Cuando un nodo se queda sin memoria, el kubelet <b>desaloja</b> (evict) pods empezando por BestEffort.</p>`},
 {t:"par", p:"Empareja cada clase QoS con su definición",
  pares:[["Guaranteed","requests igual a limits en todo"],["Burstable","Tiene requests, pero puede usar más hasta su limit"],["BestEffort","Sin requests ni limits: primero en ser desalojado"]],
  why:"Las bases de datos y servicios críticos suelen configurarse como Guaranteed."},
 {t:"opcion", p:"Un pod pide <code>requests.memory: 4Gi</code> y ningún nodo tiene 4 GiB libres reservables. ¿Qué pasa?",
  ops:["Arranca con menos memoria","Se queda en Pending hasta que haya un nodo con espacio (o el autoscaler añada uno)","Se mata con OOMKilled","Se ejecuta en el plano de control"],
  ok:1, why:"El scheduler solo coloca pods donde caben sus requests. Pedir de más desperdicia el clúster; pedir de menos provoca nodos sobrecargados."},
 {t:"vf", p:"Una aplicación Java en Kubernetes debe configurar la memoria de la JVM en relación con el límite del contenedor.",
  ok:true, why:"Con -XX:MaxRAMPercentage (por ejemplo, 75) la JVM se adapta al límite y deja margen para memoria fuera del heap. Sin eso, OOMKilled asegurado."}
]}

]});
