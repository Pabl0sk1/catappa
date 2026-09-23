window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Salud, apagado y disrupciones",
resumen: "Probes bien calibradas, apagado elegante sin errores y mantenimientos de nodos sin caídas con drain y PodDisruptionBudget",
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
     <ul><li><b>startup</b>: mientras no pasa, las otras dos no se evalúan. Ideal para aplicaciones que tardan en arrancar (Java, modelos grandes).</li>
     <li><b>readiness</b>: si falla, el pod <b>sale del Service</b> (no recibe tráfico) pero no se reinicia.</li>
     <li><b>liveness</b>: si falla varias veces, el kubelet <b>reinicia</b> el contenedor.</li></ul>`},
 {t:"par", p:"Empareja cada probe con su efecto al fallar",
  pares:[["startupProbe","Aún no ha arrancado: se esperan las demás, y si se agota, reinicio"],["readinessProbe","Se retira del balanceo, sin reiniciar"],["livenessProbe","Se reinicia el contenedor"]],
  why:"Confundir readiness con liveness es el error de configuración más común."},
 {t:"info", eti:"Mecanismos y tiempos", h:"Cómo se comprueba y cada cuánto",
  c:`<p>En tu stack (<b>{{stack:nombre}}</b>), la ruta de salud habitual es <code>{{stack:salud}}</code> en el puerto <code>{{stack:puerto}}</code>. Cuatro formas de comprobar:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">tipos de probe</div><table class="dg-tabla"><tbody>
       <tr><td>httpGet</td><td>sano si responde 200–399</td></tr>
       <tr><td>tcpSocket</td><td>sano si acepta la conexión (bases de datos, colas)</td></tr>
       <tr><td>grpc</td><td>usa el protocolo estándar de salud de gRPC</td></tr>
       <tr><td>exec</td><td>ejecuta un comando dentro; sano si sale con 0 (cuidado: cuesta CPU)</td></tr>
     </tbody></table></div>
     <div class="dg dg-tabla-caja" style="margin-top:12px"><div class="dg-tit">parámetros y valores por defecto</div><table class="dg-tabla"><tbody>
       <tr><td>initialDelaySeconds</td><td>0 · espera antes de la primera (mejor usar startupProbe)</td></tr>
       <tr><td>periodSeconds</td><td>10 · cada cuánto</td></tr>
       <tr><td>timeoutSeconds</td><td>1 · cuánto esperar la respuesta</td></tr>
       <tr><td>failureThreshold</td><td>3 · fallos seguidos para darla por fallida</td></tr>
       <tr><td>successThreshold</td><td>1 · aciertos para volver a sano (en liveness, siempre 1)</td></tr>
     </tbody></table></div>`},
 {t:"opcion", p:"Una startupProbe tiene <code>periodSeconds: 5</code> y <code>failureThreshold: 30</code>. ¿Cuánto tiempo tiene la aplicación para arrancar antes de que la reinicien?",
  ops:["30 segundos","Unos 150 segundos (30 × 5)","5 segundos","Ilimitado"],
  ok:1, why:"failureThreshold × periodSeconds. Mide el arranque real en el peor caso (nodo cargado, caché fría) y deja margen."},
 {t:"info", eti:"El error que tumba producción", h:"Liveness que depende de la base de datos",
  c:`<p>Si la liveness comprueba la base de datos y la base de datos tiene un bache de 30 segundos, <b>todas</b> las réplicas fallan la liveness a la vez, Kubernetes las reinicia todas... y durante el arranque nadie atiende. Un bache se convierte en una caída total.</p>
     <p>Regla: la <b>liveness</b> solo comprueba que el propio proceso no está colgado. La <b>readiness</b> puede incluir dependencias (y así el pod deja de recibir tráfico sin reiniciarse).</p>
     <div class="nota ojo"><b class="tit">timeoutSeconds: 1</b>El valor por defecto es un segundo. Una pausa larga del recolector de basura o un nodo saturado bastan para fallar la probe. Súbelo a 2–5 s en aplicaciones con pausas conocidas.</div>`},
 {t:"opcion", p:"¿Qué debería comprobar la livenessProbe de una API?",
  ops:["Que la base de datos responde","Que el propio proceso está vivo y no bloqueado, sin depender de servicios externos","Que hay espacio en disco en otros nodos","Que el Ingress funciona"],
  ok:1, why:"Spring Boot, por ejemplo, separa /actuator/health/liveness (solo la app) de /readiness (puede incluir la BD)."},
 {t:"term", p:"Un pod se reinicia cada pocos minutos. Mira sus eventos para confirmar si es la liveness", prompt:"pablo@portatil:~$",
  sol:["kubectl describe pod api-7d9f-t7w2c","kubectl describe po api-7d9f-t7w2c","kubectl describe pods api-7d9f-t7w2c","kubectl events --for pod/api-7d9f-t7w2c"],
  pista:"kubectl describe pod y el nombre.",
  salida:`...
Events:
  Warning  Unhealthy  4m (x9 over 22m)  kubelet  Liveness probe failed: Get "http://10.244.1.5:8080/actuator/health/liveness": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
  Normal   Killing    4m (x3 over 22m)  kubelet  Container api failed liveness probe, will be restarted`,
  why:"«context deadline exceeded» es un timeout: la app tardó más de timeoutSeconds en contestar. Antes de subir umbrales, mira por qué va lenta (CPU con throttling, GC, bloqueos)."},
 {t:"hueco", p:"Completa una readiness para una base de datos que solo necesita aceptar conexiones en el 5432",
  tpl:"readinessProbe:\n  ___: { port: ___ }\n  periodSeconds: 5",
  banco:["tcpSocket","5432","httpGet","exec","8080","grpc"], sol:["tcpSocket","5432"],
  why:"tcpSocket solo comprueba que el puerto acepta conexiones. Es barato, aunque no garantiza que la base de datos responda consultas."},
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
          sleep: { seconds: 10 }   <span class="cm"># dar tiempo a que salga de los balanceadores</span></div>
     <p>La acción <code>sleep</code> nativa del preStop (activada por defecto desde 1.30) no necesita que la imagen tenga shell; antes se escribía <code>exec: { command: ["sh", "-c", "sleep 10"] }</code>, que falla en imágenes distroless.</p>
     <p>Y en la aplicación, apagado elegante (<code>server.shutdown=graceful</code> en Spring Boot, cerrar el servidor en el manejador de SIGTERM en Node o Go) para terminar las peticiones en curso. Si todo supera los 45 segundos, llega el SIGKILL.</p>`},
 {t:"orden", p:"Ordena la secuencia de terminación de un pod bien configurado",
  items:["El pod se marca para eliminarse y sale de los endpoints","Se ejecuta el preStop (sleep de unos segundos)","El contenedor recibe SIGTERM","La aplicación termina las peticiones en curso y cierra","Si se supera terminationGracePeriodSeconds, SIGKILL"],
  why:"Esta secuencia, bien configurada, da despliegues sin un solo error."},
 {t:"opcion", p:"¿Por qué un <code>sleep</code> en preStop reduce los errores durante un despliegue?",
  ops:["Porque acelera el arranque","Porque deja tiempo a que los balanceadores y kube-proxy dejen de enviar tráfico al pod antes de que empiece a cerrarse","Porque reinicia el nodo","Porque evita el SIGTERM"],
  ok:1, why:"La retirada de los endpoints es asíncrona; el sleep cubre ese hueco."},
 {t:"opcion", p:"Tu contenedor arranca con <code>CMD sh -c \"node server.js\"</code> y siempre tarda los 30 s completos en pararse, acabando con SIGKILL. ¿Qué pasa?",
  ops:["Node es lento apagándose","El PID 1 es la shell, que no reenvía SIGTERM a node: la app nunca se entera y muere a los 30 s. Usa la forma exec (CMD [\"node\", \"server.js\"]) o un init como tini","Falta un preStop","Falta memoria"],
  ok:1, why:"Es uno de los fallos más comunes. Se nota porque cada despliegue tarda exactamente terminationGracePeriodSeconds por pod y las conexiones se cortan de golpe."},
 {t:"vf", p:"<code>terminationGracePeriodSeconds</code> incluye el tiempo del preStop.",
  ok:true, why:"El plazo empieza al marcar el pod para borrarlo. Si preStop tarda 10 s, a la app le quedan 35 de los 45."},
 {t:"term", p:"Un pod se ha quedado en Terminating en un nodo que ya no existe. Bórralo a la fuerza, sin esperar", prompt:"pablo@portatil:~$",
  sol:["kubectl delete pod api-7d9f-t7w2c --grace-period=0 --force","kubectl delete pod api-7d9f-t7w2c --force --grace-period=0","kubectl delete po api-7d9f-t7w2c --grace-period=0 --force"],
  pista:"kubectl delete pod con --grace-period=0 y --force.",
  salida:`Warning: Immediate deletion does not wait for confirmation that the running resource has been terminated. The resource may continue to run on the cluster indefinitely.
pod "api-7d9f-t7w2c" force deleted`,
  why:"Solo borra el objeto de la API; si el nodo seguía vivo, el contenedor podría seguir corriendo. En un StatefulSet es peligroso: podrías tener dos db-0 escribiendo en el mismo disco."},
 {t:"hueco", p:"Da 60 segundos de margen a un worker que termina trabajos largos antes de apagarse",
  tpl:"spec:\n  ___: 60\n  containers:\n    - name: worker\n      lifecycle:\n        ___:\n          sleep: { seconds: 5 }",
  banco:["terminationGracePeriodSeconds","preStop","postStart","activeDeadlineSeconds","livenessProbe","timeoutSeconds"], sol:["terminationGracePeriodSeconds","preStop"],
  why:"postStart es lo contrario (tras arrancar). activeDeadlineSeconds limita la vida total del pod, no el apagado."}
]},

{
id:"k7l4",
titulo:"Mantenimiento sin caídas: drain y PodDisruptionBudget",
claves:["cordon marca el nodo como no programable; drain lo vacía respetando PDBs","Un PodDisruptionBudget garantiza réplicas mínimas durante interrupciones voluntarias","Un PDB demasiado estricto bloquea los mantenimientos"],
pasos:[
 {t:"info", eti:"Mantenimiento", h:"Vaciar un nodo",
  c:`<div class="termbox">kubectl cordon nodo-3                  <span class="cm"># no programar mas pods aqui</span>
kubectl drain nodo-3 --ignore-daemonsets --delete-emptydir-data   <span class="cm"># desalojar los pods</span>
<span class="cm"># ... parchear, reiniciar ...</span>
kubectl uncordon nodo-3                <span class="cm"># vuelve a aceptar pods</span></div>
     <p>Así se actualizan nodos uno a uno. Los proveedores cloud hacen exactamente esto al actualizar un grupo de nodos. <code>drain</code> usa la API de <b>Eviction</b>, que es la que respeta los PodDisruptionBudgets.</p>`},
 {t:"info", eti:"La garantía", h:"PodDisruptionBudget",
  c:`<div class="termbox">apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: api }
spec:
  minAvailable: 2                    <span class="cm"># o maxUnavailable: 1</span>
  selector: { matchLabels: { app: api } }
  unhealthyPodEvictionPolicy: AlwaysAllow   <span class="cm"># los pods que ya no estan sanos no bloquean</span></div>
     <p>Con esto, <code>drain</code> no desalojará un pod de la API si eso deja menos de 2 disponibles: esperará. Protege frente a interrupciones <b>voluntarias</b> (drains, actualizaciones), no frente a que un nodo muera de golpe.</p>`},
 {t:"opcion", p:"Tienes 3 réplicas y un PDB con <code>minAvailable: 3</code>. ¿Qué pasa al hacer drain de un nodo con una réplica?",
  ops:["Se desaloja igual","El drain se queda bloqueado: nunca se puede desalojar sin bajar de 3","Se crean 6 réplicas","Se borra el PDB"],
  ok:1, why:"Un PDB demasiado estricto bloquea los mantenimientos. minAvailable debe dejar margen (por ejemplo 2 de 3), o usa maxUnavailable: 1, que escala mejor al cambiar las réplicas."},
 {t:"term", p:"Vacía el nodo <code>nodo-3</code> ignorando los DaemonSets y borrando los datos de emptyDir", prompt:"pablo@portatil:~$",
  sol:["kubectl drain nodo-3 --ignore-daemonsets --delete-emptydir-data","kubectl drain nodo-3 --delete-emptydir-data --ignore-daemonsets","kubectl drain node/nodo-3 --ignore-daemonsets --delete-emptydir-data"],
  pista:"kubectl drain, el nodo, --ignore-daemonsets y --delete-emptydir-data.",
  salida:`node/nodo-3 cordoned
Warning: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-8zmxl, monitoring/node-exporter-2kd8f
evicting pod pagos/api-7d9f-t7w2c
evicting pod pagos/worker-5c8d9-qz4lp
error when evicting pods/"api-7d9f-t7w2c" -n "pagos" (will retry after 5s): Cannot evict pod as it would violate the pod's disruption budget.
pod/worker-5c8d9-qz4lp evicted
evicting pod pagos/api-7d9f-t7w2c
pod/api-7d9f-t7w2c evicted
node/nodo-3 drained`,
  why:"El PDB frenó el desalojo hasta que la réplica nueva de la API estuvo lista en otro nodo; después, siguió. Eso es un mantenimiento sin caída."},
 {t:"par", p:"Empareja cada comando o recurso con su función",
  pares:[["cordon","Impedir que se programen pods nuevos en el nodo"],["drain","Desalojar los pods del nodo"],["uncordon","Volver a aceptar pods"],["PodDisruptionBudget","Réplicas mínimas durante interrupciones voluntarias"],["--ignore-daemonsets","Seguir aunque haya pods de DaemonSets, que no se pueden mover"]],
  why:"Operar un clúster sin caídas es, en gran parte, combinar bien estos elementos."},
 {t:"vf", p:"Un PodDisruptionBudget evita que se pierdan réplicas si un nodo se apaga de forma inesperada.",
  ok:false, why:"Solo protege frente a interrupciones voluntarias. Frente a fallos, la protección es tener réplicas repartidas en varios nodos y zonas."},
 {t:"opcion", p:"El drain de un nodo lleva 20 minutos bloqueado por el PDB de una aplicación con 1 sola réplica y <code>minAvailable: 1</code>. ¿Qué es lo correcto?",
  ops:["Borrar el PDB para siempre","Subir la aplicación a 2 réplicas (repartidas) para que el PDB pueda cumplirse; un PDB sobre una sola réplica bloquea cualquier mantenimiento","Forzar con --disable-eviction siempre","Apagar el nodo sin drain"],
  ok:1, why:"Un PDB solo tiene sentido con redundancia. Los proveedores gestionados acaban forzando el desalojo tras un tiempo, y entonces la caída llega igual."},
 {t:"vf", p:"<code>kubectl delete pod</code> respeta los PodDisruptionBudgets igual que <code>kubectl drain</code>.",
  ok:false, why:"Solo la API de Eviction (la que usa drain) consulta los PDB. Un delete directo, un fallo de nodo o una actualización de un Deployment no pasan por ahí."}
]}

]});
