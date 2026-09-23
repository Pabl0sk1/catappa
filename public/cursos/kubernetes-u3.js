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
  c:`<div class="dg dg-arbol"><div class="dg-tit">deployment, replicasets y pods</div><div class="rama" style="--n:0"><span class="nom carpeta">Deployment "api"</span><span class="coment">estrategia de actualización, historial</span></div><div class="rama" style="--n:1"><span class="nom carpeta">ReplicaSet api-7d9f</span><span class="coment">plantilla v1.2.0, replicas: 3</span></div><div class="rama" style="--n:2"><span class="nom">pod api-7d9f-2xk9p</span></div><div class="rama" style="--n:2"><span class="nom">pod api-7d9f-8hq4m</span></div><div class="rama" style="--n:2"><span class="nom">pod api-7d9f-t7w2c</span></div><div class="rama" style="--n:1"><span class="nom">ReplicaSet api-5c1a</span><span class="coment">plantilla v1.1.0, replicas: 0 · versión anterior, para rollback</span></div></div>
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
            limits: { memory: 768Mi }</div>
     <p>El sufijo del ReplicaSet (<code>api-7d9f…</code>) es un hash de la plantilla, guardado en la label <code>pod-template-hash</code>: si cambias cualquier cosa de <code>template</code>, cambia el hash y nace un ReplicaSet nuevo. Cambiar <code>replicas</code> no toca la plantilla, así que no crea ninguno.</p>`},
 {t:"par", p:"Empareja cada parte del Deployment con su función",
  pares:[["replicas","Cuántos pods iguales mantener"],["selector.matchLabels","Qué pods pertenecen al Deployment"],["template","La plantilla con la que se crean los pods"],["ReplicaSet","El objeto intermedio que mantiene el número de pods de una versión"]],
  why:"Si el selector no coincide con las labels de la plantilla, la API rechaza el Deployment."},
 {t:"term", p:"Lista los ReplicaSets que pertenecen a la aplicación <code>api</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl get rs -l app=api","kubectl get replicasets -l app=api","kubectl get replicaset -l app=api","kubectl get rs --selector app=api","kubectl get rs --selector=app=api"],
  pista:"kubectl get rs con el selector de labels.",
  salida:`NAME             DESIRED   CURRENT   READY   AGE
api-5c1a8b6f4d   0         0         0       2d
api-7d9f6c5b8b   3         3         3       3h`,
  why:"El ReplicaSet con 0 réplicas es la versión anterior, guardada para un rollback. Cuántos se conservan lo decide revisionHistoryLimit."},
 {t:"opcion", p:"¿Por qué un Deployment conserva ReplicaSets antiguos con 0 réplicas?",
  ops:["Por un fallo","Para poder hacer rollback rápido a una versión anterior","Para tener más réplicas","Para ahorrar memoria"],
  ok:1, why:"revisionHistoryLimit (10 por defecto) controla cuántos se guardan."},
 {t:"opcion", p:"Aplicas un Deployment con <code>selector.matchLabels: {app: api}</code> y la plantilla con <code>labels: {app: api-v2}</code>. ¿Qué pasa?",
  ops:["Se crean los pods pero el Deployment no los ve","La API lo rechaza: «selector does not match template labels»","Kubernetes corrige las labels solo","Se crea sin réplicas"],
  ok:1, why:"La validación impide un Deployment que no reconocería a sus propios pods (crearía pods sin parar)."},
 {t:"vf", p:"El selector de un Deployment se puede cambiar libremente después de crearlo.",
  ok:false, why:"En apps/v1 el selector es inmutable: para cambiarlo hay que recrear el Deployment. Por eso conviene elegir bien las labels desde el principio."},
 {t:"vf", p:"Si borras a mano un ReplicaSet gestionado por un Deployment, el Deployment lo vuelve a crear.",
  ok:true, why:"El controlador de Deployments ve que falta el ReplicaSet de la plantilla actual y lo recrea (con pods nuevos). Por eso no se gestionan a mano."}
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
     <p><b>Recreate</b> para todos los viejos y luego arranca los nuevos: hay corte, pero nunca conviven dos versiones (útil si no son compatibles entre sí).</p>
     <p>Por defecto, ambos valen <b>25 %</b>. Con porcentajes, <code>maxSurge</code> se redondea <b>hacia arriba</b> y <code>maxUnavailable</code> <b>hacia abajo</b>: así nunca se quedan los dos en 0.</p>`},
 {t:"par", p:"Empareja cada parámetro con su efecto",
  pares:[["maxSurge","Pods adicionales permitidos durante la actualización"],["maxUnavailable","Pods que pueden faltar respecto a las réplicas deseadas"],["Recreate","Parar todo y luego arrancar lo nuevo"],["RollingUpdate","Sustituir poco a poco"]],
  why:"maxUnavailable: 0 es la opción más segura; maxSurge alto acelera la actualización a cambio de recursos."},
 {t:"codigo", p:"Calcula cuántos pods puede haber como máximo y cuántos disponibles como mínimo durante un rolling update",
  lenguaje:"js",
  c:`<p>Por stdin llegan tres valores separados por espacios: <code>replicas maxSurge maxUnavailable</code>. maxSurge y maxUnavailable pueden ser un número (<code>1</code>) o un porcentaje (<code>25%</code>).</p>
     <p>Reglas de Kubernetes: el porcentaje de <b>maxSurge</b> se redondea hacia arriba y el de <b>maxUnavailable</b> hacia abajo. Imprime dos líneas: <code>max: N</code> (réplicas + surge) y <code>min: N</code> (réplicas − unavailable).</p>`,
  plantilla:"const [replicas, surge, unav] = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);\n// imprime max: N y min: N\n",
  pruebas:[
   {entrada:"4 25% 25%", salida:"max: 5\nmin: 3"},
   {entrada:"3 1 0", salida:"max: 4\nmin: 3"},
   {entrada:"10 25% 25%", salida:"max: 13\nmin: 8"},
   {entrada:"3 25% 25%", salida:"max: 4\nmin: 3", oculta:true},
   {entrada:"7 50% 1", salida:"max: 11\nmin: 6", oculta:true}
  ],
  pista:"Convierte cada valor: si acaba en %, calcula replicas * p / 100 y usa Math.ceil (surge) o Math.floor (unavailable).",
  solucion:"const [r, surge, unav] = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);\nconst replicas = Number(r);\nfunction valor(v, redondeo) {\n  if (v.endsWith('%')) return redondeo(replicas * Number(v.slice(0, -1)) / 100);\n  return Number(v);\n}\nconsole.log('max: ' + (replicas + valor(surge, Math.ceil)));\nconsole.log('min: ' + (replicas - valor(unav, Math.floor)));",
  why:"Con 3 réplicas y los valores por defecto, 25 % de 3 = 0,75: surge sube a 1 y unavailable baja a 0. Por eso un Deployment pequeño con los valores por defecto ya nunca baja de su capacidad."},
 {t:"term", p:"Actualiza la imagen del contenedor <code>api</code> del Deployment <code>api</code> a la versión 1.3.0",
  prompt:"pablo@portatil:~$", sol:["kubectl set image deployment/api api=ghcr.io/pablo/api-tareas:1.3.0","kubectl set image deploy/api api=ghcr.io/pablo/api-tareas:1.3.0"],
  pista:"kubectl set image, el deployment y contenedor=imagen.",
  salida:`deployment.apps/api image updated`,
  why:"En la práctica se cambia el YAML en Git y se aplica (o lo aplica GitOps); set image es útil para pruebas."},
 {t:"info", eti:"El detalle crítico", h:"Sin readiness, el rolling update miente",
  c:`<p>Kubernetes considera «listo» un pod nuevo en cuanto su contenedor arranca... salvo que tenga una <b>readinessProbe</b>. Una API que tarda 20 segundos en poder atender: sin readiness, Kubernetes retira pods viejos y manda tráfico a pods que aún están arrancando. Resultado: errores durante cada despliegue.</p>
     <div class="termbox">readinessProbe:
  httpGet: { path: {{stack:salud}}, port: {{stack:puerto}} }
  periodSeconds: 5
minReadySeconds: 10     <span class="cm"># y que aguante 10 s listo antes de contar como disponible</span></div>`},
 {t:"opcion", p:"Cada despliegue provoca unos segundos de errores 502, aunque usas RollingUpdate. ¿Qué falta casi seguro?",
  ops:["Más réplicas","Una readinessProbe que refleje cuándo la app puede atender de verdad","Un PersistentVolume","Cambiar a Recreate"],
  ok:1, why:"Y en el apagado, un pequeño preStop sleep para que el balanceador deje de enviar tráfico antes de que el pod muera."},
 {t:"opcion", p:"Tu versión nueva cambia el formato de los mensajes que se intercambian dos réplicas y no es compatible con la anterior. ¿Qué estrategia usas?",
  ops:["RollingUpdate con maxSurge 100%","Recreate, aceptando el corte, o mejor: una versión intermedia compatible con ambos formatos y después la nueva","RollingUpdate por defecto","Ninguna, no se puede desplegar"],
  ok:1, why:"En un rolling update conviven dos versiones. Si no pueden convivir, o se acepta el corte (Recreate) o se diseña el cambio en dos pasos compatibles."},
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
kubectl rollout history deploy/api --revision=3   <span class="cm"># la plantilla de esa revision</span>
kubectl rollout undo deploy/api            <span class="cm"># volver a la anterior</span>
kubectl rollout undo deploy/api --to-revision=3
kubectl rollout pause deploy/api           <span class="cm"># pausar (para acumular cambios)</span>
kubectl rollout resume deploy/api
kubectl rollout restart deploy/api         <span class="cm"># recrear todos los pods (misma version)</span></div>
     <p>La columna CHANGE-CAUSE del historial sale de la anotación <code>kubernetes.io/change-cause</code>. La antigua opción <code>--record</code> está obsoleta: pon tú la anotación (o deja que la ponga tu pipeline con el commit).</p>`},
 {t:"term", p:"Mira el historial de revisiones del Deployment <code>api</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl rollout history deployment/api","kubectl rollout history deploy/api","kubectl rollout history deployment api","kubectl rollout history deploy api"],
  pista:"kubectl rollout history y el deployment.",
  salida:`deployment.apps/api
REVISION  CHANGE-CAUSE
3         1.2.0: corrige paginación
4         1.3.0: nuevo endpoint de informes`,
  why:"Cada revisión es un ReplicaSet. Tras un undo, la revisión recuperada pasa a ser la más alta: el historial nunca «retrocede»."},
 {t:"term", p:"La versión nueva de <code>api</code> da errores. Vuelve a la anterior", prompt:"pablo@portatil:~$",
  sol:["kubectl rollout undo deployment/api","kubectl rollout undo deploy/api","kubectl rollout undo deployment api"],
  pista:"rollout undo y el deployment.", salida:`deployment.apps/api rolled back`,
  why:"Un rollback en segundos: el ReplicaSet anterior vuelve a escalar mientras el nuevo baja."},
 {t:"opcion", p:"En un pipeline, ¿para qué sirve <code>kubectl rollout status deploy/api --timeout=5m</code> tras aplicar?",
  ops:["Para acelerar el despliegue","Para que el pipeline espere a que el despliegue termine bien y falle si no lo consigue en 5 minutos","Para borrar pods viejos","Para ver los logs"],
  ok:1, why:"Sin esto, el pipeline dice «desplegado» aunque los pods nuevos estén en CrashLoopBackOff."},
 {t:"info", eti:"Atascos", h:"progressDeadlineSeconds",
  c:`<p>Si un despliegue no progresa en <code>progressDeadlineSeconds</code> (600 por defecto), el Deployment marca la condición <code>Progressing=False</code> con motivo <code>ProgressDeadlineExceeded</code>. Kubernetes <b>no hace rollback automático</b>: eso lo deciden tu pipeline o herramientas como Argo Rollouts.</p>
     <div class="termbox">$ kubectl rollout status deploy/api
Waiting for deployment "api" rollout to finish: 1 out of 3 new replicas have been updated...
error: deployment "api" exceeded its progress deadline</div>
     <p>Mientras tanto, gracias al rolling update, los pods viejos <b>siguen sirviendo</b>: un despliegue atascado no es una caída.</p>`},
 {t:"vf", p:"<code>kubectl rollout undo</code> también deshace los cambios que la versión nueva hizo en la base de datos.",
  ok:false, why:"Solo cambia la plantilla de los pods. Por eso las migraciones deben ser compatibles hacia atrás (añadir antes de quitar)."},
 {t:"par", p:"Empareja cada subcomando de rollout con su efecto",
  pares:[["status","Esperar y mostrar el progreso"],["history","Listar las revisiones"],["undo","Volver a una revisión anterior"],["restart","Recrear los pods con la misma versión"],["pause","Acumular cambios en la plantilla sin desplegarlos todavía"]],
  why:"rollout restart es el «reinicio» correcto en Kubernetes: respeta la estrategia de actualización, sin corte."},
 {t:"opcion", p:"Quieres cambiar la imagen, los recursos y una variable en tres comandos, pero que se desplieguen de una sola vez. ¿Qué haces?",
  ops:["Tres despliegues seguidos","kubectl rollout pause, los tres cambios y kubectl rollout resume","Recreate","Borrar el Deployment"],
  ok:1, why:"En pausa, los cambios de la plantilla se acumulan y el resume los despliega como una sola revisión. (Con un único apply de un YAML en Git pasa lo mismo.)"}
]},

{
id:"k3l4",
titulo:"Escalar",
claves:["kubectl scale para cambiar réplicas a mano","El escalado automático lo hace el HorizontalPodAutoscaler","Las aplicaciones deben ser sin estado para escalar horizontalmente"],
pasos:[
 {t:"info", eti:"Horizontal", h:"Más réplicas",
  c:`<div class="termbox">kubectl scale deploy/api --replicas=6</div>
     <p>Escalar <b>horizontalmente</b> (más copias) solo funciona bien si la aplicación es <b>sin estado</b>: nada importante guardado en memoria o en el disco del pod, sesiones en Redis o en tokens, ficheros en almacenamiento externo.</p>
     <p>Escalar <b>verticalmente</b> es dar más CPU y memoria a cada pod. Tiene techo (el tamaño del nodo) y, salvo con el redimensionado en caliente, requiere recrear los pods.</p>`},
 {t:"opcion", p:"Tu API guarda la sesión de usuario en memoria. Escalas a 3 réplicas y los usuarios pierden la sesión al azar. ¿Por qué?",
  ops:["Por un fallo de Kubernetes","Cada petición puede ir a una réplica distinta, que no tiene esa sesión en memoria","Porque faltan recursos","Por el DNS"],
  ok:1, why:"La solución es sacar el estado: sesiones en Redis o tokens firmados (JWT). Afinidad de sesión es un parche."},
 {t:"term", p:"Mira el estado del Deployment <code>api</code> justo después de escalarlo", prompt:"pablo@portatil:~$",
  sol:["kubectl get deploy api","kubectl get deployment api","kubectl get deployments api","kubectl get deploy/api","kubectl get deployment/api"],
  pista:"kubectl get deploy y el nombre.",
  salida:`NAME   READY   UP-TO-DATE   AVAILABLE   AGE
api    4/6     6            4           3d`,
  why:"READY 4/6: se han creado 6, 4 pasan ya la readiness. UP-TO-DATE cuenta los que tienen la plantilla actual; AVAILABLE, los listos durante al menos minReadySeconds."},
 {t:"par", p:"Empareja cada columna de <code>kubectl get deploy</code> con su significado",
  pares:[["READY","Pods listos frente a deseados"],["UP-TO-DATE","Pods con la plantilla de la revisión actual"],["AVAILABLE","Pods listos durante al menos minReadySeconds"],["AGE","Tiempo desde que se creó el Deployment"]],
  why:"Durante un despliegue, UP-TO-DATE sube mientras AVAILABLE no debe bajar del mínimo que marca maxUnavailable."},
 {t:"par", p:"Empareja cada tipo de escalado con su descripción",
  pares:[["Horizontal","Más réplicas del pod"],["Vertical","Más CPU y memoria por pod"],["Automático (HPA)","Réplicas ajustadas según métricas"],["De nodos (Cluster Autoscaler, Karpenter)","Más máquinas cuando los pods no caben"]],
  why:"Lo verás a fondo en la unidad de escalado."},
 {t:"vf", p:"Si un Deployment está gestionado por un HPA, cambiar las réplicas con kubectl scale es la forma correcta de ajustarlo.",
  ok:false, why:"El HPA lo sobrescribirá enseguida. Se ajustan minReplicas y maxReplicas del HPA."},
 {t:"escribe", p:"Escribe el comando que escala el Deployment <code>api</code> a 5 réplicas",
  sol:["kubectl scale deploy/api --replicas=5","kubectl scale deployment/api --replicas=5","kubectl scale deployment api --replicas=5","kubectl scale --replicas=5 deployment/api","kubectl scale deploy api --replicas=5","kubectl scale --replicas=5 deploy/api"], ph:"kubectl scale ...",
  pista:"kubectl scale, el deployment y --replicas.", why:"kubectl scale deploy/api --replicas=5."},
 {t:"opcion", p:"Escalas a 0 réplicas un Deployment de staging por la noche. ¿Qué se conserva?",
  ops:["Nada, se borra todo","El Deployment, su historial de ReplicaSets, Services y configuración: solo desaparecen los pods","Solo los pods","Los pods, pero parados"],
  ok:1, why:"Escalar a 0 es una forma barata de «apagar» un entorno. Volver a subir recrea los pods con la misma plantilla."}
]}

]});
