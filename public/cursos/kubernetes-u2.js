window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Pods",
resumen: "La unidad mínima: manifiesto, comando y variables, ciclo de vida, varios contenedores, recursos y calidad de servicio",
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
 {t:"term", p:"Arranca rápidamente un pod suelto llamado <code>web</code> con la imagen <code>nginx:1.27</code> para hacer una prueba", prompt:"pablo@portatil:~$",
  sol:["kubectl run web --image=nginx:1.27","kubectl run web --image nginx:1.27","kubectl run --image=nginx:1.27 web"],
  pista:"kubectl run, el nombre y --image.",
  salida:`pod/web created`,
  why:"<code>kubectl run</code> crea un pod suelto: perfecto para pruebas, nunca para servir una aplicación. Si su nodo cae, nadie lo recrea."},
 {t:"vf", p:"Si el nodo donde corre un pod creado a mano (sin Deployment) se cae, Kubernetes lo recrea en otro nodo.",
  ok:false, why:"Un pod suelto no tiene controlador que lo vigile: desaparece con su nodo. Por eso se usan Deployments."},
 {t:"opcion", p:"Tu API y su base de datos, ¿van en el mismo pod o en pods distintos?",
  ops:["En el mismo pod, así se hablan por localhost","En pods distintos: escalan, se actualizan y fallan por separado; el mismo pod solo para contenedores que nacen y mueren juntos","Da igual","En el mismo contenedor"],
  ok:1, why:"Si estuvieran juntos, escalar la API a 5 réplicas crearía 5 bases de datos. La pregunta útil es: «¿tienen que vivir y morir juntos en la misma máquina?»."},
 {t:"escribe", p:"Escribe el comando que redirige tu puerto local 8080 al puerto 8080 del pod <code>api</code>",
  sol:["kubectl port-forward pod/api 8080:8080","kubectl port-forward api 8080:8080","kubectl port-forward pods/api 8080:8080"], ph:"kubectl port-forward ...",
  pista:"kubectl port-forward, el pod y local:remoto.", why:"Ideal para probar sin exponer nada: el túnel pasa por el API server."}
]},

{
id:"k2n1",
titulo:"Comando, argumentos, variables y Downward API",
claves:["command sustituye al ENTRYPOINT de la imagen; args sustituye al CMD","Variables con value, desde ConfigMaps y Secrets, o desde el propio pod con fieldRef","La Downward API expone al contenedor su nombre, namespace, IP, nodo y límites"],
pasos:[
 {t:"info", eti:"Qué se ejecuta", h:"command y args frente a ENTRYPOINT y CMD",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">quién gana en cada caso</div><table class="dg-tabla"><thead><tr><th>En el pod pones</th><th>Se ejecuta</th></tr></thead><tbody>
       <tr><td>nada</td><td>ENTRYPOINT + CMD de la imagen</td></tr>
       <tr><td>solo <code>args</code></td><td>ENTRYPOINT de la imagen + tus args</td></tr>
       <tr><td>solo <code>command</code></td><td>tu command (se ignoran ENTRYPOINT y CMD)</td></tr>
       <tr><td><code>command</code> y <code>args</code></td><td>tu command + tus args</td></tr>
     </tbody></table></div>
     <div class="termbox">containers:
  - name: worker
    image: ghcr.io/pablo/api-tareas:1.2.0
    command: ["java", "-jar", "app.jar"]
    args: ["--modo=worker", "--cola=$(COLA)"]    <span class="cm"># $(VAR) se sustituye con las env del contenedor</span>
    env:
      - { name: COLA, value: pedidos }</div>
     <p>El nombre engaña: <code>command</code> de Kubernetes equivale al <b>ENTRYPOINT</b> de Docker, y <code>args</code> al <b>CMD</b>.</p>`},
 {t:"par", p:"Empareja cada campo del pod con su equivalente en Docker",
  pares:[["command","ENTRYPOINT"],["args","CMD"],["env","ENV o docker run -e"],["workingDir","WORKDIR"]],
  why:"Con la misma imagen puedes arrancar la API, un worker o una migración solo cambiando args."},
 {t:"opcion", p:"La imagen tiene <code>ENTRYPOINT [\"python\", \"app.py\"]</code> y <code>CMD [\"--puerto\", \"8000\"]</code>. En el pod pones <code>args: [\"--puerto\", \"9000\"]</code>. ¿Qué se ejecuta?",
  ops:["--puerto 9000","python app.py --puerto 9000","python app.py --puerto 8000 --puerto 9000","python app.py"],
  ok:1, why:"args sustituye solo al CMD; el ENTRYPOINT de la imagen se conserva."},
 {t:"info", eti:"El pod se conoce a sí mismo", h:"Downward API",
  c:`<p>A veces la aplicación necesita saber <b>quién es</b>: su nombre para los logs, su IP para anunciarse en un clúster, su límite de memoria para dimensionar cachés. La <b>Downward API</b> se lo da sin llamar a la API:</p>
     <div class="termbox">env:
  - name: POD_NAME
    valueFrom: { fieldRef: { fieldPath: metadata.name } }
  - name: POD_NAMESPACE
    valueFrom: { fieldRef: { fieldPath: metadata.namespace } }
  - name: POD_IP
    valueFrom: { fieldRef: { fieldPath: status.podIP } }
  - name: NODO
    valueFrom: { fieldRef: { fieldPath: spec.nodeName } }
  - name: LIMITE_MEMORIA
    valueFrom:
      resourceFieldRef: { containerName: api, resource: limits.memory }</div>
     <p>Las <b>labels</b> y <b>annotations</b> se pueden montar además como ficheros con un volumen <code>downwardAPI</code>, que se actualizan si cambian.</p>`},
 {t:"hueco", p:"Completa la variable que recibe la IP del propio pod",
  tpl:"- name: POD_IP\n  valueFrom:\n    ___: { fieldPath: ___ }",
  banco:["fieldRef","status.podIP","resourceFieldRef","spec.podIP","secretKeyRef","metadata.ip"], sol:["fieldRef","status.podIP"],
  why:"La IP la asigna el plugin de red al arrancar, por eso vive en <code>status</code>, no en <code>spec</code>."},
 {t:"term", p:"Comprueba qué valor tiene la variable <code>POD_NAME</code> dentro del pod <code>api-7d9f-t7w2c</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl exec api-7d9f-t7w2c -- printenv POD_NAME","kubectl exec api-7d9f-t7w2c -- env | grep POD_NAME","kubectl exec -it api-7d9f-t7w2c -- printenv POD_NAME","kubectl exec api-7d9f-t7w2c -- sh -c 'echo $POD_NAME'","kubectl exec api-7d9f-t7w2c -- sh -c \"echo $POD_NAME\""],
  pista:"kubectl exec, el pod, -- y printenv con el nombre de la variable.",
  salida:`api-7d9f-t7w2c`,
  why:"Todo lo que va tras <code>--</code> se ejecuta dentro del contenedor. Es la forma rápida de comprobar qué configuración ha recibido de verdad."},
 {t:"vf", p:"Si en el pod solo defines <code>command</code>, el CMD de la imagen se sigue pasando como argumentos.",
  ok:false, why:"Al definir command se ignoran tanto el ENTRYPOINT como el CMD de la imagen. Si quieres argumentos, ponlos en args."},
 {t:"escribe", p:"¿Qué campo del contenedor usarías para cambiar solo los argumentos, conservando el ENTRYPOINT de la imagen?",
  sol:["args","spec.containers.args","containers.args"], ph:"campo",
  pista:"El equivalente a CMD.", why:"args. Así la imagen decide el ejecutable y el pod solo ajusta cómo se llama."}
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
     <li><b>Unknown</b>: no se sabe nada del nodo (normalmente un nodo sin comunicación).</li></ul>
     <p>Además de la fase del pod, cada <b>contenedor</b> tiene su estado (<code>Waiting</code>, <code>Running</code>, <code>Terminated</code>) con un <i>reason</i>, y el pod tiene <b>condiciones</b>: <code>PodScheduled</code>, <code>Initialized</code>, <code>ContainersReady</code> y <code>Ready</code>. La columna STATUS de <code>kubectl get pods</code> mezcla todo eso: «CrashLoopBackOff» no es una fase, es el <i>reason</i> de un contenedor en Waiting.</p>`},
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
 {t:"info", eti:"Leer la muerte de un contenedor", h:"Códigos de salida",
  c:`<div class="termbox">kubectl describe pod api-7d9f-t7w2c
...
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    137
    Restart Count:  6
...
Events:
  Warning  BackOff  2m (x25 over 8m)  kubelet  Back-off restarting failed container api</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">códigos de salida frecuentes</div><table class="dg-tabla"><tbody>
       <tr><td>0</td><td>terminó bien (en un Deployment, reiniciará igual: se espera que no termine)</td></tr>
       <tr><td>1</td><td>error de la aplicación: mira los logs</td></tr>
       <tr><td>126 / 127</td><td>el comando no es ejecutable / no existe (command mal escrito)</td></tr>
       <tr><td>137</td><td>128 + 9: SIGKILL; con reason OOMKilled, por memoria</td></tr>
       <tr><td>143</td><td>128 + 15: SIGTERM, un apagado pedido</td></tr>
     </tbody></table></div>`},
 {t:"opcion", p:"Un pod lleva 10 minutos en Pending. ¿Qué comando te dirá por qué?",
  ops:["kubectl logs","kubectl describe pod: la sección Events muestra, por ejemplo, «0/3 nodes are available: insufficient memory»","kubectl delete pod","kubectl exec"],
  ok:1, why:"Un pod Pending no tiene logs porque no ha arrancado. Los eventos del scheduler explican el motivo."},
 {t:"term", p:"Extrae solo el motivo por el que terminó la última vez el primer contenedor del pod <code>api-7d9f-t7w2c</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl get pod api-7d9f-t7w2c -o jsonpath='{.status.containerStatuses[0].lastState.terminated.reason}'","kubectl get pod api-7d9f-t7w2c -o jsonpath={.status.containerStatuses[0].lastState.terminated.reason}","kubectl get po api-7d9f-t7w2c -o jsonpath='{.status.containerStatuses[0].lastState.terminated.reason}'"],
  pista:"-o jsonpath sobre .status.containerStatuses[0].lastState.terminated.reason",
  salida:`OOMKilled`,
  why:"Útil en scripts y alertas. lastState guarda cómo murió el intento anterior; state, cómo está ahora."},
 {t:"vf", p:"<code>OOMKilled</code> significa que el contenedor superó el límite de memoria definido en su spec.",
  ok:true, why:"El kernel lo mata (el Exited 137 de Docker). Se sube el límite o se corrige el consumo."},
 {t:"opcion", p:"Un contenedor de un Deployment termina con código 0 cada pocos segundos y el pod acaba en CrashLoopBackOff. ¿Qué pasa?",
  ops:["Es un error de memoria","El proceso principal termina (por ejemplo, arranca en segundo plano y el script sale); con restartPolicy Always, cada salida es un reinicio","El nodo no tiene red","La imagen no existe"],
  ok:1, why:"En un Deployment el proceso debe quedarse en primer plano. Un código 0 no es «bien» si se esperaba que el proceso siguiera vivo."}
]},

{
id:"k2l3",
titulo:"Varios contenedores: sidecars e init containers",
claves:["initContainers se ejecutan antes, en orden, y deben terminar con éxito","Un sidecar acompaña al principal todo el tiempo (logs, proxy, sincronización)","Sidecars nativos: initContainers con restartPolicy: Always (estables desde Kubernetes 1.33)"],
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
 {t:"info", eti:"Sidecars de verdad", h:"Sidecars nativos",
  c:`<p>Durante años, un sidecar era solo «otro contenedor más» y daba problemas: en un Job, el pod no terminaba nunca porque el sidecar seguía vivo; al arrancar, la app podía empezar antes que su proxy. La solución, estable desde <b>Kubernetes 1.33</b>, es declararlo como init container con <code>restartPolicy: Always</code>:</p>
     <div class="termbox">spec:
  initContainers:
    - name: logs
      image: fluent/fluent-bit:4.0
      restartPolicy: Always          <span class="cm"># esto lo convierte en sidecar</span>
      volumeMounts: [{ name: logs, mountPath: /var/log/app }]
  containers:
    - name: api
      image: ghcr.io/pablo/api-tareas:1.2.0
      volumeMounts: [{ name: logs, mountPath: /var/log/app }]
  volumes:
    - { name: logs, emptyDir: {} }</div>
     <ul><li>Arranca <b>antes</b> que los contenedores principales y no bloquea a los siguientes init (no tiene que terminar).</li>
     <li>Se para <b>después</b> que los principales.</li>
     <li>En un Job, no impide que el pod se complete.</li></ul>`},
 {t:"par", p:"Empareja cada patrón con su propósito",
  pares:[["Init container","Preparar algo antes de que arranque la aplicación"],["Sidecar","Añadir una capacidad junto a la aplicación mientras corre"],["Ambassador","Hacer de proxy entre la aplicación y el exterior"],["Adapter","Adaptar la salida de la aplicación a un formato estándar"]],
  why:"Son patrones de diseño de sistemas distribuidos, y se preguntan en entrevistas de arquitectura."},
 {t:"orden", p:"Un pod tiene un init <code>migraciones</code>, un sidecar nativo <code>proxy</code> (declarado después) y el contenedor <code>api</code>. Ordena el arranque",
  items:["Se ejecuta el init «migraciones» hasta terminar con éxito","Arranca el sidecar «proxy» (se queda en marcha)","Arranca el contenedor principal «api»"],
  why:"Los init se procesan en el orden declarado; el sidecar, al ser un init con restartPolicy Always, arranca en su turno y ya no se detiene."},
 {t:"term", p:"Mira los logs del contenedor <code>logs</code> dentro del pod <code>api-7d9f-t7w2c</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl logs api-7d9f-t7w2c -c logs","kubectl logs api-7d9f-t7w2c --container logs","kubectl logs api-7d9f-t7w2c --container=logs","kubectl logs -c logs api-7d9f-t7w2c"],
  pista:"kubectl logs con -c para elegir el contenedor.",
  salida:`[2026/09/23 10:14:02] [ info] [fluent bit] version=4.0.3
[2026/09/23 10:14:02] [ info] [input:tail:tail.0] initializing
[2026/09/23 10:14:03] [ info] [output:forward:forward.0] worker #0 started`,
  why:"Con varios contenedores, kubectl logs sin -c te pide que elijas (o usa el marcado por defecto). <code>--all-containers</code> los muestra todos."},
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
     <p>Cuando un nodo se queda sin memoria, el kubelet <b>desaloja</b> (evict) pods empezando por BestEffort.</p>
     <p>Detalle: si pones solo <code>limits</code>, Kubernetes copia esos valores como requests. Y desde 1.33 (beta, activo por defecto) se pueden cambiar los recursos de un pod <b>en caliente</b>, sin recrearlo, con el subrecurso <code>resize</code>.</p>`},
 {t:"par", p:"Empareja cada clase QoS con su definición",
  pares:[["Guaranteed","requests igual a limits en todo"],["Burstable","Tiene requests, pero puede usar más hasta su limit"],["BestEffort","Sin requests ni limits: primero en ser desalojado"]],
  why:"Las bases de datos y servicios críticos suelen configurarse como Guaranteed."},
 {t:"codigo", p:"Calcula la clase QoS de un pod a partir de los recursos de sus contenedores",
  lenguaje:"py",
  c:`<p>Por stdin llega una línea por contenedor con cuatro campos separados por espacios: <code>cpu_request cpu_limit mem_request mem_limit</code>. Un guion <code>-</code> significa «sin definir». Aplica las reglas de Kubernetes:</p>
     <ul><li>Si ningún contenedor tiene ningún valor definido: <code>BestEffort</code>.</li>
     <li>Si <b>todos</b> los contenedores tienen los cuatro valores definidos y en cada uno request = limit (de CPU y de memoria): <code>Guaranteed</code>. Recuerda: si falta un request pero hay limit, el request vale lo mismo que el limit.</li>
     <li>En cualquier otro caso: <code>Burstable</code>.</li></ul>
     <p>Los valores se comparan como texto (vienen normalizados).</p>`,
  plantilla:"import sys\nfilas = [l.split() for l in sys.stdin.read().splitlines() if l.strip()]\n# imprime BestEffort, Burstable o Guaranteed\n",
  pruebas:[
   {entrada:"500m 500m 1Gi 1Gi\n100m 100m 128Mi 128Mi", salida:"Guaranteed"},
   {entrada:"250m - 512Mi 768Mi", salida:"Burstable"},
   {entrada:"- - - -\n- - - -", salida:"BestEffort"},
   {entrada:"- 1 - 2Gi", salida:"Guaranteed", oculta:true},
   {entrada:"500m 500m 1Gi 1Gi\n- - - -", salida:"Burstable", oculta:true}
  ],
  pista:"Primero rellena el request vacío con el limit si hay limit. Después: ¿todo vacío? ¿todo definido e igual?",
  solucion:"import sys\nfilas = [l.split() for l in sys.stdin.read().splitlines() if l.strip()]\nvacio = all(v == '-' for f in filas for v in f)\nif vacio:\n    print('BestEffort')\nelse:\n    garantizado = True\n    for cr, cl, mr, ml in filas:\n        if cr == '-' and cl != '-': cr = cl\n        if mr == '-' and ml != '-': mr = ml\n        if '-' in (cr, cl, mr, ml) or cr != cl or mr != ml:\n            garantizado = False\n    print('Guaranteed' if garantizado else 'Burstable')",
  why:"Es exactamente la lógica del kubelet, que puedes comprobar en <code>status.qosClass</code> del pod. Un solo contenedor sin recursos (un sidecar olvidado) basta para bajar todo el pod a Burstable."},
 {t:"opcion", p:"Un pod pide <code>requests.memory: 4Gi</code> y ningún nodo tiene 4 GiB libres reservables. ¿Qué pasa?",
  ops:["Arranca con menos memoria","Se queda en Pending hasta que haya un nodo con espacio (o el autoscaler añada uno)","Se mata con OOMKilled","Se ejecuta en el plano de control"],
  ok:1, why:"El scheduler solo coloca pods donde caben sus requests. Pedir de más desperdicia el clúster; pedir de menos provoca nodos sobrecargados."},
 {t:"term", p:"Muestra los pods del namespace actual ordenados por consumo de memoria", prompt:"pablo@portatil:~$",
  sol:["kubectl top pods --sort-by=memory","kubectl top pod --sort-by=memory","kubectl top po --sort-by=memory","kubectl top pods --sort-by memory"],
  pista:"kubectl top pods con --sort-by.",
  salida:`NAME                   CPU(cores)   MEMORY(bytes)
api-7d9f-t7w2c         212m         698Mi
api-7d9f-2xk9p         187m         655Mi
worker-5c8d9-qz4lp     41m          210Mi
web-6b7f5-8hq4m        3m           18Mi`,
  why:"Compara con los requests y limits: la API usa 698Mi con un límite de 768Mi, poco margen antes de un OOMKilled. kubectl top necesita metrics-server."},
 {t:"vf", p:"Una aplicación Java en Kubernetes debe configurar la memoria de la JVM en relación con el límite del contenedor.",
  ok:true, why:"Con -XX:MaxRAMPercentage (por ejemplo, 75) la JVM se adapta al límite y deja margen para memoria fuera del heap. Sin eso, OOMKilled asegurado."}
]}

]});
