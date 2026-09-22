window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Salud y colocación de pods",
resumen: "Probes, apagado elegante, afinidad, taints y tolerations, topología y disponibilidad durante mantenimientos",
nivel: "Avanzado",
color: "#4f7fd8",
lecciones: [

{
id:"k7l1",
titulo:"Probes: liveness, readiness y startup",
claves:["readiness decide si recibe tráfico; liveness si hay que reiniciarlo; startup protege arranques lentos","Una liveness agresiva provoca reinicios en cascada","La liveness no debe depender de servicios externos"],
pasos:[
 {t:"info", eti:"Tres preguntas", h:"Las tres probes",
  c:`<div class="termbox">startupProbe:                       <span class="cm"># ¿ha terminado de arrancar?</span>
  httpGet: { path: /actuator/health/liveness, port: 8080 }
  failureThreshold: 30
  periodSeconds: 5                  <span class="cm"># hasta 150 s para arrancar</span>
readinessProbe:                     <span class="cm"># ¿puede atender trafico AHORA?</span>
  httpGet: { path: /actuator/health/readiness, port: 8080 }
  periodSeconds: 5
livenessProbe:                      <span class="cm"># ¿esta colgado y hay que reiniciarlo?</span>
  httpGet: { path: /actuator/health/liveness, port: 8080 }
  periodSeconds: 10
  failureThreshold: 3</div>
     <ul><li><b>startup</b>: mientras no pasa, las otras dos no se evalúan. Ideal para Java, que tarda en arrancar.</li>
     <li><b>readiness</b>: si falla, el pod <b>sale del Service</b> (no recibe tráfico) pero no se reinicia.</li>
     <li><b>liveness</b>: si falla varias veces, el kubelet <b>reinicia</b> el contenedor.</li></ul>`},
 {t:"par", p:"Empareja cada probe con su efecto al fallar",
  pares:[["startupProbe","Aún no ha arrancado: se esperan las demás, y si se agota, reinicio"],["readinessProbe","Se retira del balanceo, sin reiniciar"],["livenessProbe","Se reinicia el contenedor"]],
  why:"Confundir readiness con liveness es el error de configuración más común."},
 {t:"info", eti:"El error que tumba producción", h:"Liveness que depende de la base de datos",
  c:`<p>Si la liveness comprueba la base de datos y la base de datos tiene un bache de 30 segundos, <b>todas</b> las réplicas fallan la liveness a la vez, Kubernetes las reinicia todas... y durante el arranque nadie atiende. Un bache se convierte en una caída total.</p>
     <p>Regla: la <b>liveness</b> solo comprueba que el propio proceso no está colgado. La <b>readiness</b> puede incluir dependencias (y así el pod deja de recibir tráfico sin reiniciarse).</p>`},
 {t:"opcion", p:"¿Qué debería comprobar la livenessProbe de una API?",
  ops:["Que la base de datos responde","Que el propio proceso está vivo y no bloqueado, sin depender de servicios externos","Que hay espacio en disco en otros nodos","Que el Ingress funciona"],
  ok:1, why:"Spring Boot separa /actuator/health/liveness (solo la app) de /readiness (puede incluir la BD)."},
 {t:"vf", p:"Sin startupProbe, una aplicación que tarda 90 s en arrancar puede entrar en un bucle de reinicios por culpa de la liveness.",
  ok:true, why:"La liveness empieza a fallar antes de que termine de arrancar y el kubelet la reinicia una y otra vez."}
]},

{
id:"k7l2",
titulo:"Apagado elegante",
claves:["Al borrar un pod: sale de los endpoints y recibe SIGTERM a la vez","preStop con una pequeña espera evita errores durante los despliegues","terminationGracePeriodSeconds: 30 por defecto antes del SIGKILL"],
pasos:[
 {t:"info", eti:"La carrera", h:"Qué pasa al eliminar un pod",
  c:`<p>Cuando Kubernetes elimina un pod (en un rolling update, al escalar, al drenar un nodo), <b>a la vez</b>:</p>
     <ul><li>lo quita de los endpoints de los Services (y eso tarda en propagarse a todos los nodos y balanceadores),</li>
     <li>ejecuta el hook <b>preStop</b> si existe, y luego envía <b>SIGTERM</b> al contenedor.</li></ul>
     <p>Si la aplicación se cierra al instante con el SIGTERM, durante unos segundos todavía le llega tráfico que ya no puede atender: errores 502 en cada despliegue.</p>`},
 {t:"info", eti:"La solución", h:"preStop y graceful shutdown",
  c:`<div class="termbox">spec:
  terminationGracePeriodSeconds: 45
  containers:
    - name: api
      lifecycle:
        preStop:
          exec: { command: ["sh", "-c", "sleep 10"] }   <span class="cm"># dar tiempo a que salga de los balanceadores</span></div>
     <p>Y en la aplicación, apagado elegante (<code>server.shutdown=graceful</code> en Spring Boot) para terminar las peticiones en curso. Si todo supera los 45 segundos, llega el SIGKILL.</p>`},
 {t:"orden", p:"Ordena la secuencia de terminación de un pod bien configurado",
  items:["El pod se marca para eliminarse y sale de los endpoints","Se ejecuta el preStop (sleep de unos segundos)","El contenedor recibe SIGTERM","La aplicación termina las peticiones en curso y cierra","Si se supera terminationGracePeriodSeconds, SIGKILL"],
  why:"Esta secuencia, bien configurada, da despliegues sin un solo error."},
 {t:"opcion", p:"¿Por qué un <code>sleep</code> en preStop reduce los errores durante un despliegue?",
  ops:["Porque acelera el arranque","Porque deja tiempo a que los balanceadores y kube-proxy dejen de enviar tráfico al pod antes de que empiece a cerrarse","Porque reinicia el nodo","Porque evita el SIGTERM"],
  ok:1, why:"La retirada de los endpoints es asíncrona; el sleep cubre ese hueco."},
 {t:"vf", p:"<code>terminationGracePeriodSeconds</code> incluye el tiempo del preStop.",
  ok:true, why:"El plazo empieza al marcar el pod para borrarlo. Si preStop tarda 10 s, a la app le quedan 35 de los 45."}
]},

{
id:"k7l3",
titulo:"Dónde se colocan los pods",
claves:["nodeSelector y nodeAffinity atraen pods a ciertos nodos","podAntiAffinity y topologySpreadConstraints los reparten","taints repelen pods; solo entran los que tienen la toleration"],
pasos:[
 {t:"info", eti:"Atraer", h:"nodeSelector y nodeAffinity",
  c:`<div class="termbox">spec:
  nodeSelector: { disco: ssd }            <span class="cm"># solo nodos con esa label</span>
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:    <span class="cm"># obligatorio</span>
        nodeSelectorTerms:
          - matchExpressions:
              - { key: kubernetes.io/arch, operator: In, values: [arm64] }
      preferredDuringSchedulingIgnoredDuringExecution:   <span class="cm"># preferencia</span>
        - weight: 50
          preference:
            matchExpressions:
              - { key: tipo, operator: In, values: [spot] }</div>`},
 {t:"info", eti:"Repartir", h:"Que no caigan todas las réplicas juntas",
  c:`<p>Si las 3 réplicas acaban en el mismo nodo o la misma zona, la caída de ese nodo tumba el servicio entero. Para repartirlas:</p>
     <div class="termbox">topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone     <span class="cm"># repartir entre zonas</span>
    whenUnsatisfiable: DoNotSchedule
    labelSelector: { matchLabels: { app: api } }</div>
     <p>También existe <b>podAntiAffinity</b> («no me pongas junto a otro pod igual»).</p>`},
 {t:"info", eti:"Repeler", h:"Taints y tolerations",
  c:`<p>Un <b>taint</b> en un nodo repele a los pods; solo entran los que declaran una <b>toleration</b> que coincida:</p>
     <div class="termbox">kubectl taint nodes gpu-1 dedicado=gpu:NoSchedule

<span class="cm"># en el pod que SI puede ir alli:</span>
tolerations:
  - { key: dedicado, operator: Equal, value: gpu, effect: NoSchedule }</div>
     <p>Así se reservan nodos caros (GPU) o especiales. El plano de control tiene un taint para que no se ejecuten aplicaciones en él.</p>`},
 {t:"par", p:"Empareja cada mecanismo con su efecto",
  pares:[["nodeSelector / nodeAffinity","Atraer pods a nodos con ciertas labels"],["taint","Repeler pods de un nodo"],["toleration","Permitir que un pod entre en un nodo con taint"],["topologySpreadConstraints","Repartir réplicas entre nodos o zonas"],["podAntiAffinity","Evitar que pods iguales compartan nodo"]],
  why:"Afinidad atrae; taint repele; toleration exime; spread reparte."},
 {t:"opcion", p:"Una toleration, ¿obliga al pod a ir al nodo con ese taint?",
  ops:["Sí","No: solo le permite ir; para forzarlo hace falta además afinidad o nodeSelector","Solo en GPU","Solo si hay espacio"],
  ok:1, why:"Toleration = permiso. Afinidad = preferencia u obligación. Para nodos dedicados se usan juntas."},
 {t:"vf", p:"Repartir las réplicas entre zonas de disponibilidad protege el servicio ante la caída de una zona entera.",
  ok:true, why:"Es la base de la alta disponibilidad en la nube, igual que multi-AZ en el curso de DevOps."}
]},

{
id:"k7l4",
titulo:"Mantenimiento sin caídas: drain y PodDisruptionBudget",
claves:["cordon marca el nodo como no programable; drain lo vacía respetando PDBs","Un PodDisruptionBudget garantiza réplicas mínimas durante interrupciones voluntarias","PriorityClass decide quién se desaloja primero si falta sitio"],
pasos:[
 {t:"info", eti:"Mantenimiento", h:"Vaciar un nodo",
  c:`<div class="termbox">kubectl cordon nodo-3                  <span class="cm"># no programar mas pods aqui</span>
kubectl drain nodo-3 --ignore-daemonsets --delete-emptydir-data   <span class="cm"># desalojar los pods</span>
<span class="cm"># ... parchear, reiniciar ...</span>
kubectl uncordon nodo-3                <span class="cm"># vuelve a aceptar pods</span></div>
     <p>Así se actualizan nodos uno a uno. Los proveedores cloud hacen exactamente esto al actualizar un grupo de nodos.</p>`},
 {t:"info", eti:"La garantía", h:"PodDisruptionBudget",
  c:`<div class="termbox">apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: api }
spec:
  minAvailable: 2                    <span class="cm"># o maxUnavailable: 1</span>
  selector: { matchLabels: { app: api } }</div>
     <p>Con esto, <code>drain</code> no desalojará un pod de la API si eso deja menos de 2 disponibles: esperará. Protege frente a interrupciones <b>voluntarias</b> (drains, actualizaciones), no frente a que un nodo muera de golpe.</p>`},
 {t:"opcion", p:"Tienes 3 réplicas y un PDB con <code>minAvailable: 3</code>. ¿Qué pasa al hacer drain de un nodo con una réplica?",
  ops:["Se desaloja igual","El drain se queda bloqueado: nunca se puede desalojar sin bajar de 3","Se crean 6 réplicas","Se borra el PDB"],
  ok:1, why:"Un PDB demasiado estricto bloquea los mantenimientos. minAvailable debe dejar margen (por ejemplo 2 de 3)."},
 {t:"par", p:"Empareja cada comando o recurso con su función",
  pares:[["cordon","Impedir que se programen pods nuevos en el nodo"],["drain","Desalojar los pods del nodo"],["uncordon","Volver a aceptar pods"],["PodDisruptionBudget","Réplicas mínimas durante interrupciones voluntarias"],["PriorityClass","Qué pods se desalojan antes si falta sitio"]],
  why:"Operar un clúster sin caídas es, en gran parte, combinar bien estos cinco elementos."},
 {t:"vf", p:"Un PodDisruptionBudget evita que se pierdan réplicas si un nodo se apaga de forma inesperada.",
  ok:false, why:"Solo protege frente a interrupciones voluntarias. Frente a fallos, la protección es tener réplicas repartidas en varios nodos y zonas."}
]}

]});
