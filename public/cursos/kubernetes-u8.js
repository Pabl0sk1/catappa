window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Escalado y cargas especiales",
resumen: "HPA, VPA, escalado de nodos, KEDA, DaemonSets, Jobs y CronJobs",
nivel: "Avanzado",
color: "#4f7fd8",
lecciones: [

{
id:"k8l1",
titulo:"HorizontalPodAutoscaler",
claves:["El HPA ajusta réplicas según métricas (CPU, memoria o personalizadas)","Necesita metrics-server y requests definidos","Se calcula sobre el porcentaje de los requests, no de los limits"],
pasos:[
 {t:"info", eti:"Escalado automático", h:"HPA",
  c:`<div class="termbox">apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: api }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }
  behavior:
    scaleDown: { stabilizationWindowSeconds: 300 }   <span class="cm"># no bajar a la primera</span></div>
     <p>El HPA mira la CPU media de los pods <b>respecto a sus requests</b>. Si piden 250m y usan 200m, están al 80%: por encima de 70, añade réplicas.</p>`},
 {t:"opcion", p:"Creas un HPA y en <code>kubectl get hpa</code> los objetivos salen como <code>&lt;unknown&gt;/70%</code>. ¿Causas típicas?",
  ops:["El HPA está roto","Falta metrics-server en el clúster, o los contenedores no tienen requests de CPU definidos","Hay demasiadas réplicas","El Service no existe"],
  ok:1, why:"Sin requests no hay base para calcular el porcentaje; sin metrics-server no hay datos."},
 {t:"par", p:"Empareja cada campo del HPA con su efecto",
  pares:[["minReplicas","Réplicas mínimas aunque no haya carga"],["maxReplicas","Techo de réplicas"],["averageUtilization: 70","Objetivo de uso medio respecto a los requests"],["stabilizationWindowSeconds","Esperar antes de reducir para evitar oscilaciones"]],
  why:"Sin ventana de estabilización, el HPA puede subir y bajar réplicas continuamente (flapping)."},
 {t:"info", eti:"Más allá de la CPU", h:"Métricas personalizadas y KEDA",
  c:`<p>La CPU no siempre refleja la carga. Un consumidor de una cola debería escalar según <b>los mensajes pendientes</b>. Opciones:</p>
     <ul><li>métricas personalizadas vía Prometheus Adapter (peticiones por segundo, latencia),</li>
     <li><b>KEDA</b>: escala según eventos de decenas de fuentes (Kafka, SQS, RabbitMQ, cron...), incluso a <b>cero réplicas</b> cuando no hay trabajo.</li></ul>`},
 {t:"vf", p:"El HPA puede escalar un Deployment a cero réplicas por sí solo.",
  ok:false, why:"minReplicas mínimo es 1 en el HPA estándar. Escalar a cero es una de las ventajas de KEDA."}
]},

{
id:"k8l2",
titulo:"VPA y escalado de nodos",
claves:["VPA recomienda o ajusta requests y limits de cada pod","Cluster Autoscaler y Karpenter añaden nodos cuando hay pods Pending por falta de sitio","HPA escala pods; el autoscaler de nodos escala máquinas"],
pasos:[
 {t:"info", eti:"Vertical", h:"VerticalPodAutoscaler",
  c:`<p>¿Cuántos requests poner? El <b>VPA</b> observa el consumo real y <b>recomienda</b> (o aplica) requests adecuados. Muy útil en modo <code>Off</code> o <code>Initial</code> solo para obtener recomendaciones. No se combina con un HPA por CPU sobre el mismo recurso (se pelearían).</p>`},
 {t:"info", eti:"Máquinas", h:"Cluster Autoscaler y Karpenter",
  c:`<p>Si el HPA crea réplicas y no caben en los nodos, se quedan en <b>Pending</b>. Entonces actúa el escalador de nodos:</p>
     <ul><li><b>Cluster Autoscaler</b>: ajusta el tamaño de grupos de nodos predefinidos.</li>
     <li><b>Karpenter</b> (nacido en AWS): crea directamente la instancia más adecuada para los pods pendientes (tamaño, arquitectura, spot) y consolida nodos infrautilizados.</li></ul>
     <div class="diag">trafico sube -> HPA crea pods -> no caben (Pending) -> Karpenter crea un nodo -> pods Running
trafico baja -> HPA reduce pods -> nodo casi vacio -> Karpenter lo consolida y lo elimina</div>`},
 {t:"orden", p:"Ordena lo que ocurre en un pico de tráfico con HPA y Karpenter",
  items:["Sube el uso de CPU de los pods","El HPA aumenta las réplicas","Los pods nuevos quedan en Pending por falta de sitio","Karpenter crea un nodo adecuado","Los pods se programan en el nodo nuevo y atienden tráfico"],
  why:"Por eso los requests importan tanto: son la moneda con la que se decide todo."},
 {t:"par", p:"Empareja cada escalador con lo que ajusta",
  pares:[["HPA","El número de réplicas de un Deployment"],["VPA","Los requests y limits de los pods"],["Cluster Autoscaler","El tamaño de los grupos de nodos"],["Karpenter","Crea y consolida nodos a medida de los pods"],["KEDA","Réplicas según eventos externos, hasta cero"]],
  why:"Cinco escaladores, cinco niveles distintos."},
 {t:"vf", p:"Usar instancias spot (baratas pero interrumpibles) es razonable para cargas sin estado con varias réplicas.",
  ok:true, why:"Si una se interrumpe, las demás atienden y se reprograma. Para bases de datos, no."}
]},

{
id:"k8l3",
titulo:"DaemonSets, Jobs y CronJobs",
claves:["DaemonSet: un pod en cada nodo (agentes de logs, monitorización, red)","Job: ejecutar hasta completar; CronJob: Jobs periódicos","backoffLimit, activeDeadlineSeconds y concurrencyPolicy controlan su comportamiento"],
pasos:[
 {t:"info", eti:"Uno por nodo", h:"DaemonSet",
  c:`<p>Un <b>DaemonSet</b> asegura que <b>cada nodo</b> (o cada nodo que cumpla un selector) ejecuta una copia de un pod. Cuando se añade un nodo, se crea el pod automáticamente.</p>
     <p>Usos típicos: agentes de recogida de logs (Fluent Bit), exportadores de métricas del nodo (node-exporter), el propio plugin de red (Cilium, Calico) y kube-proxy.</p>`},
 {t:"info", eti:"Hasta terminar", h:"Job y CronJob",
  c:`<div class="termbox">apiVersion: batch/v1
kind: CronJob
metadata: { name: backup-bd }
spec:
  schedule: "30 3 * * *"                <span class="cm"># como cron: cada dia a las 3:30</span>
  concurrencyPolicy: Forbid             <span class="cm"># no solapar ejecuciones</span>
  successfulJobsHistoryLimit: 3
  jobTemplate:
    spec:
      backoffLimit: 2                   <span class="cm"># reintentos</span>
      activeDeadlineSeconds: 3600       <span class="cm"># maximo una hora</span>
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: backup
              image: ghcr.io/pablo/backup:1.0
              args: ["--destino", "s3://backups/bd"]</div>`},
 {t:"par", p:"Empareja cada tipo de carga con su caso de uso",
  pares:[["Deployment","Servicio sin estado que debe estar siempre en marcha"],["StatefulSet","Aplicación con identidad y datos propios por réplica"],["DaemonSet","Un agente en cada nodo"],["Job","Tarea que se ejecuta hasta completarse"],["CronJob","Tarea periódica"]],
  why:"Elegir el tipo de carga correcto es una pregunta básica en cualquier entrevista de Kubernetes."},
 {t:"opcion", p:"Tu CronJob de backup tarda a veces más que su intervalo y se solapan dos ejecuciones. ¿Qué ajustas?",
  ops:["schedule más frecuente","concurrencyPolicy: Forbid (y activeDeadlineSeconds para cortar ejecuciones colgadas)","Más réplicas","Un Service"],
  ok:1, why:"Forbid salta la nueva ejecución si la anterior sigue; Replace la sustituye."},
 {t:"vf", p:"Los Jobs usan restartPolicy Always, igual que los Deployments.",
  ok:false, why:"Un Job debe terminar: usa OnFailure o Never. Always no está permitido en Jobs."}
]}

]});
