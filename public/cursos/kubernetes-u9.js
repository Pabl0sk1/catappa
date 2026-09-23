window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Scheduling: dónde va cada pod",
resumen: "Afinidad de nodos, taints y tolerations, reparto por topología, prioridades, expropiación y desalojo por presión del nodo",
nivel: "Avanzado",
color: "#4f7fd8",
lecciones: [

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
              - { key: tipo, operator: In, values: [spot] }</div>
     <p>Operadores: <code>In</code>, <code>NotIn</code>, <code>Exists</code>, <code>DoesNotExist</code>, <code>Gt</code>, <code>Lt</code>. El «IgnoredDuringExecution» del nombre significa que si la label del nodo cambia después, el pod <b>no</b> se mueve.</p>`},
 {t:"info", eti:"Las etiquetas de los nodos", h:"Labels que ya traen los nodos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">labels estándar de un nodo</div><table class="dg-tabla"><tbody>
       <tr><td>kubernetes.io/hostname</td><td>el nombre del nodo</td></tr>
       <tr><td>kubernetes.io/arch</td><td>amd64, arm64</td></tr>
       <tr><td>kubernetes.io/os</td><td>linux, windows</td></tr>
       <tr><td>topology.kubernetes.io/zone</td><td>la zona de disponibilidad (eu-west-1a)</td></tr>
       <tr><td>topology.kubernetes.io/region</td><td>la región</td></tr>
       <tr><td>node.kubernetes.io/instance-type</td><td>el tipo de máquina (m7g.large)</td></tr>
     </tbody></table></div>
     <p>Y las tuyas: <code>kubectl label nodes nodo-4 disco=ssd</code>.</p>`},
 {t:"term", p:"Pon la label <code>disco=ssd</code> al nodo <code>nodo-4</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl label nodes nodo-4 disco=ssd","kubectl label node nodo-4 disco=ssd","kubectl label no nodo-4 disco=ssd","kubectl label node/nodo-4 disco=ssd"],
  pista:"kubectl label nodes, el nodo y clave=valor.",
  salida:`node/nodo-4 labeled`,
  why:"Para quitarla: kubectl label nodes nodo-4 disco- (con un guion al final). Para cambiarla, añade --overwrite."},
 {t:"par", p:"Empareja cada mecanismo con su efecto",
  pares:[["nodeSelector / nodeAffinity","Atraer pods a nodos con ciertas labels"],["taint","Repeler pods de un nodo"],["toleration","Permitir que un pod entre en un nodo con taint"],["topologySpreadConstraints","Repartir réplicas entre nodos o zonas"],["podAntiAffinity","Evitar que pods iguales compartan nodo"]],
  why:"Afinidad atrae; taint repele; toleration exime; spread reparte. Lo verás a fondo en las lecciones siguientes."},
 {t:"opcion", p:"Un pod con una nodeAffinity obligatoria a <code>kubernetes.io/arch In [arm64]</code> se queda en Pending en un clúster solo con nodos amd64. ¿Qué dice el evento?",
  ops:["ImagePullBackOff","0/3 nodes are available: 3 node(s) didn't match Pod's node affinity/selector","OOMKilled","CrashLoopBackOff"],
  ok:1, why:"Las reglas obligatorias nunca se relajan. Si solo es una preferencia, usa preferredDuringScheduling."},
 {t:"hueco", p:"Haz que el pod vaya solo a nodos con la label <code>disco=ssd</code>, de la forma más sencilla",
  tpl:"spec:\n  ___:\n    ___: ssd",
  banco:["nodeSelector","disco","nodeName","affinity","ssd","tolerations"], sol:["nodeSelector","disco"],
  why:"nodeSelector es la versión simple de nodeAffinity obligatoria (solo igualdades). nodeName se salta el scheduler por completo: evítalo salvo para depurar."},
 {t:"opcion", p:"Una toleration, ¿obliga al pod a ir al nodo con ese taint?",
  ops:["Sí","No: solo le permite ir; para forzarlo hace falta además afinidad o nodeSelector","Solo en GPU","Solo si hay espacio"],
  ok:1, why:"Toleration = permiso. Afinidad = preferencia u obligación. Para nodos dedicados se usan juntas."},
 {t:"vf", p:"Repartir las réplicas entre zonas de disponibilidad protege el servicio ante la caída de una zona entera.",
  ok:true, why:"Es la base de la alta disponibilidad en la nube, igual que multi-AZ en el curso de DevOps."}
]},

{
id:"k9n1",
titulo:"Taints y tolerations",
claves:["Efectos: NoSchedule, PreferNoSchedule y NoExecute (desaloja lo que ya corre)","Nodos dedicados = taint + toleration + afinidad","Kubernetes pone taints solo cuando un nodo falla o tiene presión"],
pasos:[
 {t:"info", eti:"Repeler", h:"Taints y sus tres efectos",
  c:`<p>Un <b>taint</b> en un nodo repele a los pods; solo entran los que declaran una <b>toleration</b> que coincida:</p>
     <div class="termbox">kubectl taint nodes gpu-1 dedicado=gpu:NoSchedule

<span class="cm"># en el pod que SI puede ir alli:</span>
tolerations:
  - { key: dedicado, operator: Equal, value: gpu, effect: NoSchedule }</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">efectos de un taint</div><table class="dg-tabla"><tbody>
       <tr><td>NoSchedule</td><td>no se programan pods nuevos sin toleration; los que ya corren se quedan</td></tr>
       <tr><td>PreferNoSchedule</td><td>el scheduler lo evita si puede</td></tr>
       <tr><td>NoExecute</td><td>además <b>desaloja</b> los pods que ya corren sin toleration (o tras <code>tolerationSeconds</code>)</td></tr>
     </tbody></table></div>`},
 {t:"term", p:"Reserva el nodo <code>gpu-1</code> para cargas de GPU con el taint <code>dedicado=gpu</code> y efecto NoSchedule", prompt:"pablo@portatil:~$",
  sol:["kubectl taint nodes gpu-1 dedicado=gpu:NoSchedule","kubectl taint node gpu-1 dedicado=gpu:NoSchedule","kubectl taint no gpu-1 dedicado=gpu:NoSchedule"],
  pista:"kubectl taint nodes, el nodo y clave=valor:efecto.",
  salida:`node/gpu-1 tainted`,
  why:"Los pods que ya estaban en gpu-1 siguen allí (NoSchedule no desaloja). Si quieres vaciarlo, NoExecute o un drain."},
 {t:"term", p:"Quita ese taint del nodo <code>gpu-1</code>", prompt:"pablo@portatil:~$",
  sol:["kubectl taint nodes gpu-1 dedicado=gpu:NoSchedule-","kubectl taint node gpu-1 dedicado=gpu:NoSchedule-","kubectl taint nodes gpu-1 dedicado:NoSchedule-","kubectl taint nodes gpu-1 dedicado-"],
  pista:"El mismo comando con un guion al final.",
  salida:`node/gpu-1 untainted`,
  why:"El guion final quita. Con solo la clave (dedicado-) se quitan todos los taints con esa clave."},
 {t:"info", eti:"Taints automáticos", h:"Cuando es Kubernetes quien los pone",
  c:`<ul><li><code>node-role.kubernetes.io/control-plane:NoSchedule</code>: en los nodos del plano de control, para que no corran aplicaciones.</li>
     <li><code>node.kubernetes.io/not-ready</code> y <code>node.kubernetes.io/unreachable</code> con <b>NoExecute</b>: cuando un nodo deja de responder. Todos los pods reciben por defecto una toleration de <b>300 segundos</b>: si el nodo no vuelve en 5 minutos, se desalojan y se recrean en otro sitio.</li>
     <li><code>node.kubernetes.io/memory-pressure</code>, <code>disk-pressure</code>, <code>pid-pressure</code>: el nodo está justo de recursos.</li>
     <li><code>node.kubernetes.io/unschedulable</code>: lo pone <code>kubectl cordon</code>.</li></ul>`},
 {t:"hueco", p:"Haz que un agente de monitorización tolere <b>cualquier</b> taint, para correr en todos los nodos",
  tpl:"tolerations:\n  - operator: ___",
  banco:["Exists","Equal","All","Any"], sol:["Exists"],
  why:"Exists sin clave ni efecto tolera todo. Es lo que usan agentes como node-exporter o el CNI; en una aplicación normal sería un agujero."},
 {t:"opcion", p:"Un nodo se cae y tus pods tardan unos 5 minutos en reaparecer en otros nodos. ¿Por qué tanto?",
  ops:["El scheduler es lento","Por la toleration por defecto de 300 s al taint unreachable: Kubernetes espera por si el nodo vuelve antes de desalojar","Por el DNS","Por falta de imágenes"],
  ok:1, why:"Para servicios críticos se puede bajar tolerationSeconds en el pod (por ejemplo a 30). Más réplicas repartidas hacen que esos minutos no se noten."},
 {t:"par", p:"Empareja cada efecto con lo que hace",
  pares:[["NoSchedule","Impide programar pods nuevos sin toleration"],["PreferNoSchedule","Evitar el nodo si hay alternativa"],["NoExecute","Desalojar también los pods que ya corren"],["tolerationSeconds","Cuánto aguanta un pod tolerado antes de ser desalojado"]],
  why:"NoExecute + tolerationSeconds es el mecanismo con el que Kubernetes reacciona a nodos caídos."},
 {t:"opcion", p:"Quieres nodos con GPU <b>solo</b> para el equipo de ML, y que sus pods vayan <b>siempre</b> allí. ¿Qué combinas?",
  ops:["Solo un taint","Taint en los nodos de GPU (repele al resto) + toleration y nodeAffinity en los pods de ML (entran y además van allí)","Solo nodeSelector","Un namespace"],
  ok:1, why:"El taint sin afinidad deja que los pods de ML acaben en nodos normales; la afinidad sin taint deja que cualquiera ocupe las GPUs."},
 {t:"vf", p:"Los pods de un DaemonSet reciben automáticamente tolerations para taints como not-ready, unreachable o disk-pressure.",
  ok:true, why:"Así los agentes de nodo siguen corriendo cuando el nodo tiene problemas, justo cuando más falta hacen. Para taints propios (dedicado=gpu) hay que añadirlas a mano."}
]},

{
id:"k9n2",
titulo:"Repartir réplicas: antiafinidad y topología",
claves:["podAntiAffinity: no juntar pods iguales en el mismo dominio (nodo, zona)","topologySpreadConstraints: diferencia máxima de réplicas entre dominios (maxSkew)","Reglas obligatorias pueden dejar pods en Pending; las preferentes nunca"],
pasos:[
 {t:"info", eti:"Juntar y separar pods", h:"podAffinity y podAntiAffinity",
  c:`<div class="termbox">affinity:
  podAntiAffinity:                            <span class="cm"># no dos replicas de la API en el mismo nodo</span>
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector: { matchLabels: { app: api } }
        topologyKey: kubernetes.io/hostname
  podAffinity:                                <span class="cm"># preferir estar junto a la cache</span>
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80
        podAffinityTerm:
          labelSelector: { matchLabels: { app: redis } }
          topologyKey: topology.kubernetes.io/zone</div>
     <p>El <code>topologyKey</code> define el «dominio»: el nodo (<code>hostname</code>), la zona o cualquier label de nodo.</p>`},
 {t:"info", eti:"Repartir con precisión", h:"topologySpreadConstraints",
  c:`<div class="termbox">topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone     <span class="cm"># repartir entre zonas</span>
    whenUnsatisfiable: DoNotSchedule             <span class="cm"># o ScheduleAnyway</span>
    labelSelector: { matchLabels: { app: api } }
    matchLabelKeys: [pod-template-hash]          <span class="cm"># contar solo la revision actual</span>
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname          <span class="cm"># y dentro, entre nodos</span>
    whenUnsatisfiable: ScheduleAnyway
    labelSelector: { matchLabels: { app: api } }</div>
     <p><b>maxSkew</b> es la diferencia máxima permitida entre el dominio con más réplicas y el que tiene menos. Con 6 réplicas en 3 zonas y maxSkew 1, el reparto válido es 2-2-2 (o 3-2-2 con 7).</p>`},
 {t:"codigo", p:"Decide en qué zona puede ir la siguiente réplica con maxSkew",
  lenguaje:"py",
  c:`<p>Por stdin llega en la primera línea el <code>maxSkew</code>; después, una línea por zona: <code>nombre réplicas</code>. Con la regla <code>DoNotSchedule</code>, una zona es válida para la réplica nueva si, tras añadirla allí, la diferencia entre la zona con más réplicas y la que tiene menos no supera maxSkew.</p>
     <p>Imprime las zonas válidas en el orden de entrada, separadas por espacios, o <code>Pending</code> si ninguna lo es.</p>`,
  plantilla:"import sys\nlineas = sys.stdin.read().split('\\n')\nmax_skew = int(lineas[0])\nzonas = [l.split() for l in lineas[1:] if l.strip()]\n# imprime las zonas válidas o Pending\n",
  pruebas:[
   {entrada:"1\na 2\nb 2\nc 1", salida:"c"},
   {entrada:"1\na 1\nb 1\nc 1", salida:"a b c"},
   {entrada:"2\na 3\nb 1\nc 2", salida:"b c"},
   {entrada:"1\na 0\nb 0", salida:"a b", oculta:true},
   {entrada:"1\na 5\nb 4\nc 4", salida:"b c", oculta:true}
  ],
  pista:"Para cada zona, copia los contadores, súmale 1 a esa zona y compara max - min con maxSkew.",
  solucion:"import sys\nlineas = sys.stdin.read().split('\\n')\nmax_skew = int(lineas[0])\nzonas = [l.split() for l in lineas[1:] if l.strip()]\nvalidas = []\nfor i, (nombre, n) in enumerate(zonas):\n    cuentas = [int(x[1]) for x in zonas]\n    cuentas[i] += 1\n    if max(cuentas) - min(cuentas) <= max_skew:\n        validas.append(nombre)\nprint(' '.join(validas) if validas else 'Pending')",
  why:"Es el filtro del plugin PodTopologySpread del scheduler. Entre las zonas válidas, la puntuación decide después (otros criterios como recursos libres)."},
 {t:"opcion", p:"Una API tiene 5 réplicas con antiafinidad <b>obligatoria</b> por <code>kubernetes.io/hostname</code> y el clúster tiene 3 nodos. ¿Qué pasa?",
  ops:["Se reparten 2-2-1","3 pods en marcha (uno por nodo) y 2 en Pending para siempre, hasta que haya más nodos","Se ignoran las reglas","Fallan los 5"],
  ok:1, why:"Las reglas obligatorias nunca se relajan. Para réplicas por encima del número de nodos, usa la versión preferred o topologySpreadConstraints con maxSkew."},
 {t:"term", p:"Lista los nodos con una columna que muestre su zona", prompt:"pablo@portatil:~$",
  sol:["kubectl get nodes -L topology.kubernetes.io/zone","kubectl get nodes --label-columns=topology.kubernetes.io/zone","kubectl get nodes --label-columns topology.kubernetes.io/zone","kubectl get no -L topology.kubernetes.io/zone"],
  pista:"kubectl get nodes con -L y la label de zona.",
  salida:`NAME          STATUS   ROLES    AGE   VERSION   ZONE
ip-10-0-1-5   Ready    <none>   9d    v1.34.1   eu-west-1a
ip-10-0-2-8   Ready    <none>   9d    v1.34.1   eu-west-1b
ip-10-0-3-4   Ready    <none>   9d    v1.34.1   eu-west-1c`,
  why:"-L añade una columna por label. Antes de repartir por zona, comprueba que de verdad tienes nodos en varias."},
 {t:"hueco", p:"Reparte la API entre zonas permitiendo como mucho una réplica de diferencia, sin llegar a dejar pods en Pending",
  tpl:"topologySpreadConstraints:\n  - maxSkew: ___\n    topologyKey: topology.kubernetes.io/zone\n    whenUnsatisfiable: ___\n    labelSelector: { matchLabels: { app: api } }",
  banco:["1","ScheduleAnyway","DoNotSchedule","0","Ignore","3"], sol:["1","ScheduleAnyway"],
  why:"ScheduleAnyway convierte la regla en una preferencia: si no se puede cumplir, el pod se programa igualmente en el mejor sitio posible."},
 {t:"opcion", p:"Durante un rolling update, las réplicas nuevas se amontonan en una zona porque el reparto cuenta también los pods viejos. ¿Qué lo corrige?",
  ops:["Borrar los pods viejos a mano","matchLabelKeys: [pod-template-hash], para que la restricción solo cuente pods de la misma revisión","maxSkew: 10","Quitar la restricción"],
  ok:1, why:"Cada revisión tiene su pod-template-hash; así la versión nueva se reparte bien por sí misma."},
 {t:"vf", p:"La programación respeta las reglas de reparto, pero Kubernetes no mueve pods ya en marcha si el reparto se desequilibra después.",
  ok:true, why:"El scheduler solo decide al crear el pod. Para rebalancear existe el proyecto Descheduler, que desaloja pods para que se vuelvan a programar mejor."}
]},

{
id:"k9n3",
titulo:"Prioridades, expropiación y presión del nodo",
claves:["El scheduler filtra nodos, puntúa los que quedan y asigna el mejor","PriorityClass: los pods importantes pueden expropiar sitio a los menos importantes","Con poca memoria o disco, el kubelet desaloja pods según QoS y consumo sobre sus requests"],
pasos:[
 {t:"info", eti:"Por dentro", h:"Cómo decide el scheduler",
  c:`<div class="dg"><div class="dg-tit">el ciclo de programación de un pod</div>
       <div class="dg-flujo"><div class="dg-caja">cola<small>ordenada por prioridad</small></div><div class="dg-caja acento">filtrar<small>qué nodos pueden: recursos, afinidad, taints, volúmenes</small></div><div class="dg-caja acento">puntuar<small>cuál es mejor: reparto, recursos libres, preferencias</small></div><div class="dg-caja ok">asignar<small>escribe spec.nodeName</small></div></div>
       <div class="dg-caja aviso" style="margin-top:12px">ningún nodo pasa el filtro<small>se intenta expropiar; si no se puede, el pod queda Pending y se reintenta</small></div>
     </div>
     <p>Cada paso son <b>plugins</b> configurables (NodeResourcesFit, TaintToleration, PodTopologySpread...). Puedes tener varios schedulers y elegir uno por pod con <code>schedulerName</code>.</p>`},
 {t:"orden", p:"Ordena lo que hace el scheduler con un pod nuevo",
  items:["Lo saca de la cola de pods pendientes","Filtra los nodos que no pueden alojarlo","Puntúa los nodos que quedan","Asigna el pod al nodo con mejor puntuación","El kubelet de ese nodo lo arranca"],
  why:"Si el evento dice «0/5 nodes are available», el pod no ha pasado el filtro; el mensaje detalla qué plugin descartó cada nodo."},
 {t:"info", eti:"Quién va primero", h:"PriorityClass y expropiación",
  c:`<div class="termbox">apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata: { name: critico }
value: 100000
description: "Servicios de cara al cliente"
preemptionPolicy: PreemptLowerPriority     <span class="cm"># o Never: pasa delante en la cola pero no expulsa</span>
---
spec:
  priorityClassName: critico               <span class="cm"># en el pod</span></div>
     <p>Si un pod de prioridad alta no cabe, el scheduler puede <b>expropiar</b> (preemption): desalojar pods de menor prioridad para hacerle sitio, respetando los PDB en lo posible. Existen dos clases del sistema, <code>system-cluster-critical</code> y <code>system-node-critical</code>, para los componentes del clúster.</p>`},
 {t:"term", p:"Crea la PriorityClass <code>lotes</code> con valor 1000 para trabajos por lotes", prompt:"pablo@portatil:~$",
  sol:["kubectl create priorityclass lotes --value=1000","kubectl create pc lotes --value=1000","kubectl create priorityclass lotes --value 1000","kubectl create priorityclass lotes --value=1000 --description=\"trabajos por lotes\""],
  pista:"kubectl create priorityclass, el nombre y --value.",
  salida:`priorityclass.scheduling.k8s.io/lotes created`,
  why:"Con prioridades bajas para lotes y altas para servicios, un pico de tráfico puede expulsar trabajos que se pueden reintentar más tarde."},
 {t:"opcion", p:"Llega un pico, el HPA crea réplicas de la API (prioridad alta) y no caben. Hay Jobs de informes (prioridad baja) ocupando nodos. ¿Qué pasa?",
  ops:["Las réplicas esperan a que terminen los Jobs","El scheduler expropia pods de los Jobs para hacer sitio a la API; los Jobs se reintentarán según su backoffLimit","Se borran los Jobs para siempre","Se reinicia el clúster"],
  ok:1, why:"Así se aprovecha la capacidad sobrante con cargas prescindibles sin poner en riesgo lo importante."},
 {t:"info", eti:"Cuando el nodo se ahoga", h:"Desalojo por presión del nodo",
  c:`<p>El kubelet vigila la memoria y el disco del nodo. Si bajan de un umbral (por defecto, <code>memory.available&lt;100Mi</code>, <code>nodefs.available&lt;10%</code>, <code>imagefs.available&lt;15%</code>), marca el nodo con presión y <b>desaloja</b> pods:</p>
     <ol><li>primero los que usan más de lo que pidieron (requests), empezando por los de menor prioridad,</li>
     <li>los BestEffort son los primeros candidatos y los Guaranteed dentro de sus requests, los últimos.</li></ol>
     <p>Es distinto del <b>OOM killer</b> del kernel, que mata un contenedor concreto al superar su <i>limit</i> (OOMKilled), sin desalojar el pod. Los pods desalojados aparecen con <code>STATUS Evicted</code> o <code>Error</code> y el motivo en <code>kubectl describe</code>.</p>`},
 {t:"par", p:"Empareja cada situación con el mecanismo que actúa",
  pares:[["Un contenedor supera su limit de memoria","OOM killer del kernel: OOMKilled"],["Al nodo le quedan menos de 100Mi libres","Desalojo por presión del kubelet"],["Un pod importante no cabe","Expropiación del scheduler"],["Un drain de mantenimiento","API de Eviction, respetando PDB"]],
  why:"Cuatro formas distintas de que un pod muera o se mueva. Saber cuál fue es el primer paso para arreglarlo."},
 {t:"vf", p:"Un pod Guaranteed que usa exactamente lo que pidió es de los últimos candidatos a ser desalojado por presión de memoria.",
  ok:true, why:"Por eso las cargas críticas se configuran con requests = limits. Y para dispositivos como GPUs, la asignación dinámica de recursos (DRA), estable desde 1.34, añade reglas de reparto más ricas que los simples contadores."}
]}

]});
