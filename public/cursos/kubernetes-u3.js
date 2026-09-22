window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Deployments",
resumen: "Réplicas, ReplicaSets, actualizaciones sin corte, rollback y escalado",
nivel: "Intermedio",
color: "#5b8ce6",
lecciones: [

{
id:"k3l1",
titulo:"Deployment y ReplicaSet",
claves:["El Deployment gestiona ReplicaSets; el ReplicaSet mantiene N pods","El selector debe coincidir con las labels de la plantilla","Nunca gestiones los ReplicaSets a mano"],
pasos:[
 {t:"info", eti:"La jerarquía", h:"Deployment → ReplicaSet → Pods",
  c:`<div class="diag">Deployment "api"        (estrategia de actualizacion, historial)
     |
     +-- ReplicaSet api-7d9f   (plantilla v1.2.0, replicas: 3)
     |       +-- pod api-7d9f-2xk9p
     |       +-- pod api-7d9f-8hq4m
     |       +-- pod api-7d9f-t7w2c
     +-- ReplicaSet api-5c1a   (plantilla v1.1.0, replicas: 0)  <- version anterior, para rollback</div>
     <p>El <b>ReplicaSet</b> hace una sola cosa: mantener N pods iguales. El <b>Deployment</b> gestiona ReplicaSets para hacer actualizaciones y guardar historial. Tú trabajas siempre con el Deployment.</p>`},
 {t:"info", eti:"El manifiesto", h:"Un Deployment completo",
  c:`<div class="termbox">apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }        <span class="cm"># que pods son mios...</span>
  template:
    metadata:
      labels: { app: api }           <span class="cm"># ...estos (tienen que coincidir)</span>
    spec:
      containers:
        - name: api
          image: ghcr.io/pablo/api-tareas:1.2.0
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: 250m, memory: 512Mi }
            limits: { memory: 768Mi }</div>`},
 {t:"par", p:"Empareja cada parte del Deployment con su función",
  pares:[["replicas","Cuántos pods iguales mantener"],["selector.matchLabels","Qué pods pertenecen al Deployment"],["template","La plantilla con la que se crean los pods"],["ReplicaSet","El objeto intermedio que mantiene el número de pods de una versión"]],
  why:"Si el selector no coincide con las labels de la plantilla, la API rechaza el Deployment."},
 {t:"opcion", p:"¿Por qué un Deployment conserva ReplicaSets antiguos con 0 réplicas?",
  ops:["Por un fallo","Para poder hacer rollback rápido a una versión anterior","Para tener más réplicas","Para ahorrar memoria"],
  ok:1, why:"revisionHistoryLimit (10 por defecto) controla cuántos se guardan."},
 {t:"vf", p:"El selector de un Deployment se puede cambiar libremente después de crearlo.",
  ok:false, why:"En apps/v1 el selector es inmutable: para cambiarlo hay que recrear el Deployment. Por eso conviene elegir bien las labels desde el principio."}
]},

{
id:"k3l2",
titulo:"Actualizaciones sin corte",
claves:["RollingUpdate con maxSurge y maxUnavailable controla el ritmo","Recreate para todo y arranca lo nuevo (con corte)","Sin readinessProbe, un rolling update puede enviar tráfico a pods que aún no están listos"],
pasos:[
 {t:"info", eti:"Estrategias", h:"RollingUpdate y Recreate",
  c:`<div class="termbox">spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          <span class="cm"># cuantos pods DE MAS puede haber durante la actualizacion</span>
      maxUnavailable: 0    <span class="cm"># cuantos pueden faltar: 0 = nunca bajar de 3</span></div>
     <p>Con 3 réplicas, <code>maxSurge: 1</code> y <code>maxUnavailable: 0</code>: se crea un pod nuevo, cuando está listo se retira uno viejo, y así hasta completar. Nunca hay menos de 3 atendiendo.</p>
     <p><b>Recreate</b> para todos los viejos y luego arranca los nuevos: hay corte, pero nunca conviven dos versiones (útil si no son compatibles entre sí).</p>`},
 {t:"par", p:"Empareja cada parámetro con su efecto",
  pares:[["maxSurge","Pods adicionales permitidos durante la actualización"],["maxUnavailable","Pods que pueden faltar respecto a las réplicas deseadas"],["Recreate","Parar todo y luego arrancar lo nuevo"],["RollingUpdate","Sustituir poco a poco"]],
  why:"maxUnavailable: 0 es la opción más segura; maxSurge alto acelera la actualización a cambio de recursos."},
 {t:"term", p:"Actualiza la imagen del contenedor <code>api</code> del Deployment <code>api</code> a la versión 1.3.0",
  prompt:"pablo@portatil:~$", sol:["kubectl set image deployment/api api=ghcr.io/pablo/api-tareas:1.3.0","kubectl set image deploy/api api=ghcr.io/pablo/api-tareas:1.3.0"],
  pista:"kubectl set image, el deployment y contenedor=imagen.",
  salida:`deployment.apps/api image updated`,
  why:"En la práctica se cambia el YAML en Git y se aplica (o lo aplica GitOps); set image es útil para pruebas."},
 {t:"info", eti:"El detalle crítico", h:"Sin readiness, el rolling update miente",
  c:`<p>Kubernetes considera «listo» un pod nuevo en cuanto su contenedor arranca... salvo que tenga una <b>readinessProbe</b>. Una API Spring Boot tarda 20 segundos en poder atender: sin readiness, Kubernetes retira pods viejos y manda tráfico a pods que aún están arrancando. Resultado: errores durante cada despliegue.</p>
     <div class="termbox">readinessProbe:
  httpGet: { path: /actuator/health/readiness, port: 8080 }
  periodSeconds: 5
minReadySeconds: 10     <span class="cm"># y que aguante 10 s listo antes de contar como disponible</span></div>`},
 {t:"opcion", p:"Cada despliegue provoca unos segundos de errores 502, aunque usas RollingUpdate. ¿Qué falta casi seguro?",
  ops:["Más réplicas","Una readinessProbe que refleje cuándo la app puede atender de verdad","Un PersistentVolume","Cambiar a Recreate"],
  ok:1, why:"Y en el apagado, un pequeño preStop sleep para que el balanceador deje de enviar tráfico antes de que el pod muera."},
 {t:"vf", p:"Durante un RollingUpdate pueden convivir pods de la versión antigua y de la nueva.",
  ok:true, why:"Por eso las dos versiones deben ser compatibles, sobre todo con el esquema de la base de datos."}
]},

{
id:"k3l3",
titulo:"Seguir, pausar y deshacer despliegues",
claves:["kubectl rollout status, history, undo, pause y resume","progressDeadlineSeconds marca un despliegue atascado como fallido","El rollback vuelve a la plantilla anterior; no deshace migraciones de base de datos"],
pasos:[
 {t:"info", eti:"rollout", h:"Controlar un despliegue",
  c:`<div class="termbox">kubectl rollout status deploy/api          <span class="cm"># esperar y ver el progreso (ideal en el CI)</span>
kubectl rollout history deploy/api         <span class="cm"># revisiones</span>
kubectl rollout undo deploy/api            <span class="cm"># volver a la anterior</span>
kubectl rollout undo deploy/api --to-revision=3
kubectl rollout pause deploy/api           <span class="cm"># pausar (para acumular cambios)</span>
kubectl rollout resume deploy/api
kubectl rollout restart deploy/api         <span class="cm"># recrear todos los pods (misma version)</span></div>`},
 {t:"term", p:"La versión nueva de <code>api</code> da errores. Vuelve a la anterior", prompt:"pablo@portatil:~$",
  sol:["kubectl rollout undo deployment/api","kubectl rollout undo deploy/api","kubectl rollout undo deployment api"],
  pista:"rollout undo y el deployment.", salida:`deployment.apps/api rolled back`,
  why:"Un rollback en segundos: el ReplicaSet anterior vuelve a escalar mientras el nuevo baja."},
 {t:"opcion", p:"En un pipeline, ¿para qué sirve <code>kubectl rollout status deploy/api --timeout=5m</code> tras aplicar?",
  ops:["Para acelerar el despliegue","Para que el pipeline espere a que el despliegue termine bien y falle si no lo consigue en 5 minutos","Para borrar pods viejos","Para ver los logs"],
  ok:1, why:"Sin esto, el pipeline dice «desplegado» aunque los pods nuevos estén en CrashLoopBackOff."},
 {t:"info", eti:"Atascos", h:"progressDeadlineSeconds",
  c:`<p>Si un despliegue no progresa en <code>progressDeadlineSeconds</code> (600 por defecto), el Deployment marca la condición <code>Progressing=False</code> con motivo <code>ProgressDeadlineExceeded</code>. Kubernetes <b>no hace rollback automático</b>: eso lo deciden tu pipeline o herramientas como Argo Rollouts.</p>`},
 {t:"vf", p:"<code>kubectl rollout undo</code> también deshace los cambios que la versión nueva hizo en la base de datos.",
  ok:false, why:"Solo cambia la plantilla de los pods. Por eso las migraciones deben ser compatibles hacia atrás (añadir antes de quitar)."},
 {t:"par", p:"Empareja cada subcomando de rollout con su efecto",
  pares:[["status","Esperar y mostrar el progreso"],["history","Listar las revisiones"],["undo","Volver a una revisión anterior"],["restart","Recrear los pods con la misma versión"]],
  why:"rollout restart es el «reinicio» correcto en Kubernetes: respeta la estrategia de actualización, sin corte."}
]},

{
id:"k3l4",
titulo:"Escalar",
claves:["kubectl scale para cambiar réplicas a mano","El escalado automático lo hace el HorizontalPodAutoscaler","Las aplicaciones deben ser sin estado para escalar horizontalmente"],
pasos:[
 {t:"info", eti:"Horizontal", h:"Más réplicas",
  c:`<div class="termbox">kubectl scale deploy/api --replicas=6</div>
     <p>Escalar <b>horizontalmente</b> (más copias) solo funciona bien si la aplicación es <b>sin estado</b>: nada importante guardado en memoria o en el disco del pod, sesiones en Redis o en tokens, ficheros en almacenamiento externo.</p>
     <p>Escalar <b>verticalmente</b> es dar más CPU y memoria a cada pod. Tiene techo (el tamaño del nodo) y suele requerir reiniciar.</p>`},
 {t:"opcion", p:"Tu API guarda la sesión de usuario en memoria. Escalas a 3 réplicas y los usuarios pierden la sesión al azar. ¿Por qué?",
  ops:["Por un fallo de Kubernetes","Cada petición puede ir a una réplica distinta, que no tiene esa sesión en memoria","Porque faltan recursos","Por el DNS"],
  ok:1, why:"La solución es sacar el estado: sesiones en Redis o tokens firmados (JWT). Afinidad de sesión es un parche."},
 {t:"par", p:"Empareja cada tipo de escalado con su descripción",
  pares:[["Horizontal","Más réplicas del pod"],["Vertical","Más CPU y memoria por pod"],["Automático (HPA)","Réplicas ajustadas según métricas"],["De nodos (Cluster Autoscaler, Karpenter)","Más máquinas cuando los pods no caben"]],
  why:"Lo verás a fondo en la unidad de escalado."},
 {t:"vf", p:"Si un Deployment está gestionado por un HPA, cambiar las réplicas con kubectl scale es la forma correcta de ajustarlo.",
  ok:false, why:"El HPA lo sobrescribirá enseguida. Se ajustan minReplicas y maxReplicas del HPA."},
 {t:"escribe", p:"Escribe el comando que escala el Deployment <code>api</code> a 5 réplicas",
  sol:["kubectl scale deploy/api --replicas=5","kubectl scale deployment/api --replicas=5","kubectl scale deployment api --replicas=5","kubectl scale --replicas=5 deployment/api"], ph:"kubectl scale ...",
  pista:"kubectl scale, el deployment y --replicas.", why:"kubectl scale deploy/api --replicas=5."}
]}

]});
