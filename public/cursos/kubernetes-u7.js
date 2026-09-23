window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Almacenamiento y aplicaciones con estado",
resumen: "Volúmenes, PV y PVC, StorageClass, CSI, instantáneas y ampliación, StatefulSets y bases de datos en Kubernetes",
nivel: "Avanzado",
color: "#4f7fd8",
lecciones: [

{
id:"k6l1",
titulo:"Volúmenes, PV y PVC",
claves:["emptyDir vive lo que vive el pod; persistentVolumeClaim sobrevive","PersistentVolume es el disco; PersistentVolumeClaim es la petición de un pod","Modos de acceso: ReadWriteOnce, ReadOnlyMany, ReadWriteMany, ReadWriteOncePod"],
pasos:[
 {t:"info", eti:"Tipos de volumen", h:"De efímero a persistente",
  c:`<ul><li><b>emptyDir</b>: carpeta temporal que comparten los contenedores del pod. Muere con el pod. Con <code>medium: Memory</code> vive en RAM (y cuenta en su límite de memoria).</li>
     <li><b>configMap / secret / projected</b>: configuración montada como ficheros.</li>
     <li><b>hostPath</b>: una carpeta del nodo. Peligroso y atado a una máquina: casi nunca en aplicaciones.</li>
     <li><b>persistentVolumeClaim</b>: almacenamiento persistente que sobrevive al pod.</li></ul>`},
 {t:"info", eti:"Dos objetos", h:"PersistentVolume y PersistentVolumeClaim",
  c:`<ul><li><b>PersistentVolume (PV)</b>: un trozo de almacenamiento real (un disco EBS, un volumen de NFS). Es del clúster, sin namespace.</li>
     <li><b>PersistentVolumeClaim (PVC)</b>: la <b>petición</b> de un pod: «necesito 20 GiB, lectura/escritura desde un nodo». Vive en un namespace.</li></ul>
     <div class="termbox">apiVersion: v1
kind: PersistentVolumeClaim
metadata: { name: datos-pg }
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: gp3
  resources:
    requests: { storage: 20Gi }
---
<span class="cm"># y en el pod:</span>
volumes:
  - name: datos
    persistentVolumeClaim: { claimName: datos-pg }</div>
     <p>Kubernetes <b>une</b> (bind) cada PVC con un PV que cumpla. El pod solo conoce el PVC: no sabe si detrás hay AWS, Azure o un NFS.</p>`},
 {t:"par", p:"Empareja cada modo de acceso con su significado",
  pares:[["ReadWriteOnce (RWO)","Lectura y escritura desde un solo nodo"],["ReadOnlyMany (ROX)","Solo lectura desde muchos nodos"],["ReadWriteMany (RWX)","Lectura y escritura desde muchos nodos (NFS, EFS...)"],["ReadWriteOncePod","Lectura y escritura desde un único pod"]],
  why:"Los discos de bloque de la nube (EBS, Persistent Disk) son RWO. Si necesitas RWX, hace falta un sistema de ficheros de red."},
 {t:"term", p:"Mira el estado de los PVC del namespace actual", prompt:"pablo@portatil:~$",
  sol:["kubectl get pvc","kubectl get persistentvolumeclaims","kubectl get persistentvolumeclaim"],
  pista:"kubectl get y el nombre corto de PersistentVolumeClaim.",
  salida:`NAME       STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
datos-pg   Bound     pvc-3f1c9a2e-5b7d-4e8a-9c1f-2d6b8e4a7c01   20Gi       RWO            gp3            4d
subidas    Pending                                                                        efs            3m`,
  why:"Bound: ya tiene PV. Pending: todavía no. Con volumeBindingMode WaitForFirstConsumer es normal hasta que un pod lo use; si no, kubectl describe pvc explica qué falla (StorageClass inexistente, cuota, driver caído)."},
 {t:"opcion", p:"Tu Deployment de 3 réplicas monta un PVC de tipo EBS (RWO) y dos pods se quedan en ContainerCreating. ¿Por qué?",
  ops:["Falta memoria","Un volumen RWO solo puede montarse en un nodo; los pods programados en otros nodos no pueden engancharlo","El PVC es demasiado grande","Falta un Service"],
  ok:1, why:"Para compartir datos entre réplicas en varios nodos hace falta RWX (EFS, Filestore, NFS)... o replantear el diseño."},
 {t:"vf", p:"Los datos de un emptyDir sobreviven si el pod se recrea en otro nodo.",
  ok:false, why:"emptyDir nace y muere con el pod. Sirve para cachés y ficheros temporales compartidos entre contenedores."},
 {t:"hueco", p:"Monta el PVC <code>datos-pg</code> en el pod",
  tpl:"volumes:\n  - name: datos\n    ___: { claimName: ___ }",
  banco:["persistentVolumeClaim","datos-pg","persistentVolume","emptyDir","gp3","pvc"], sol:["persistentVolumeClaim","datos-pg"],
  why:"El pod referencia siempre el PVC, nunca el PV. Así el mismo manifiesto sirve en cualquier nube."},
 {t:"opcion", p:"Borras un PVC que todavía usa un pod en marcha. ¿Qué pasa?",
  ops:["Se borra al instante y el pod pierde el disco","Queda en Terminating: la protección de uso (un finalizer) espera a que ningún pod lo use antes de borrarlo","Kubernetes lo impide con un error","Se copia a otro PVC"],
  ok:1, why:"El finalizer kubernetes.io/pvc-protection evita perder un disco en uso. Un PVC atascado en Terminating suele significar que algún pod lo sigue montando."}
]},

{
id:"k6l2",
titulo:"StorageClass, CSI y ciclo de vida de los volúmenes",
claves:["La StorageClass describe un tipo de almacenamiento y el driver CSI que lo crea","Con provisión dinámica, crear un PVC crea el disco; reclaimPolicy decide qué pasa al borrarlo","CSI permite ampliar volúmenes, hacer instantáneas y clonarlos"],
pasos:[
 {t:"info", eti:"Automatizar", h:"StorageClass",
  c:`<div class="termbox">apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp3
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: ebs.csi.aws.com         <span class="cm"># el driver CSI que crea los discos</span>
parameters: { type: gp3, encrypted: "true" }
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true</div>
     <p>Con esto, cuando alguien crea un PVC con <code>storageClassName: gp3</code>, el driver <b>CSI</b> crea un disco EBS cifrado del tamaño pedido y lo une al PVC. Nadie crea PVs a mano.</p>`},
 {t:"par", p:"Empareja cada campo de la StorageClass con su efecto",
  pares:[["provisioner","El driver CSI que crea los volúmenes"],["reclaimPolicy: Retain","Conservar el disco aunque se borre el PVC"],["WaitForFirstConsumer","Crear el disco cuando se sepa en qué zona irá el pod"],["allowVolumeExpansion","Permitir ampliar el PVC después"]],
  why:"WaitForFirstConsumer evita el clásico error de disco creado en una zona y pod programado en otra."},
 {t:"info", eti:"Por dentro", h:"Qué es CSI",
  c:`<p><b>CSI</b> (Container Storage Interface) es el estándar por el que cualquier proveedor de almacenamiento se conecta a Kubernetes sin tocar su código. Un driver CSI tiene dos partes:</p>
     <ul><li>un <b>controlador</b> (Deployment) que habla con la API del proveedor: crear, borrar, ampliar, hacer instantáneas;</li>
     <li>un <b>plugin de nodo</b> (DaemonSet) que monta el disco en el nodo donde corre el pod.</li></ul>
     <p>Los antiguos plugins «in-tree» (<code>kubernetes.io/aws-ebs</code>...) ya se migraron a CSI. Si ves uno en un manifiesto viejo, cámbialo.</p>`},
 {t:"opcion", p:"Borras por error el PVC de la base de datos y su StorageClass tiene <code>reclaimPolicy: Delete</code>. ¿Qué pasa con los datos?",
  ops:["Se conservan en el PV","El disco se borra también: los datos se pierden salvo que haya backups o snapshots","Se mueven a otro PVC","Nada, los PVC no se pueden borrar"],
  ok:1, why:"Para datos críticos: Retain, snapshots de volumen (VolumeSnapshot) y backups con Velero."},
 {t:"info", eti:"Crecer y copiar", h:"Ampliar, instantáneas y clones",
  c:`<div class="termbox"><span class="cm"># ampliar: editar el PVC (solo se puede crecer, nunca encoger)</span>
kubectl patch pvc datos-pg -p '{"spec":{"resources":{"requests":{"storage":"50Gi"}}}}'

<span class="cm"># instantanea del disco</span>
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata: { name: pg-antes-de-migrar }
spec:
  volumeSnapshotClassName: ebs-snapshots
  source: { persistentVolumeClaimName: datos-pg }

<span class="cm"># y un PVC nuevo a partir de ella</span>
spec:
  dataSource:
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
    name: pg-antes-de-migrar</div>
     <p><b>VolumeSnapshot</b> pide al driver CSI una instantánea. <b>Velero</b> hace copias de seguridad de objetos del clúster y de sus volúmenes, y permite restaurar en otro clúster: la herramienta estándar para recuperación ante desastres. Y con <b>VolumeAttributesClass</b> (estable en 1.34) puedes cambiar el rendimiento de un disco ya creado, por ejemplo sus IOPS, sin recrearlo.</p>`},
 {t:"term", p:"Amplía el PVC <code>datos-pg</code> a 50Gi con un parche", prompt:"pablo@portatil:~$",
  sol:["kubectl patch pvc datos-pg -p '{\"spec\":{\"resources\":{\"requests\":{\"storage\":\"50Gi\"}}}}'","kubectl patch pvc datos-pg --patch '{\"spec\":{\"resources\":{\"requests\":{\"storage\":\"50Gi\"}}}}'","kubectl patch pvc datos-pg -p {\"spec\":{\"resources\":{\"requests\":{\"storage\":\"50Gi\"}}}}"],
  re:"^kubectl patch (pvc|persistentvolumeclaims?) datos-pg (-p|--patch)[ =].*storage.*50gi",
  pista:"kubectl patch pvc datos-pg -p con el JSON spec.resources.requests.storage.",
  salida:`persistentvolumeclaim/datos-pg patched`,
  why:"Solo funciona si la StorageClass tiene allowVolumeExpansion: true. El disco crece en la nube y después el sistema de ficheros, normalmente en caliente; kubectl describe pvc muestra el progreso."},
 {t:"vf", p:"Con provisión dinámica, un administrador debe crear el PersistentVolume antes de que el pod pida su PVC.",
  ok:false, why:"Es justo lo que evita la provisión dinámica: el PV se crea automáticamente a partir de la StorageClass."},
 {t:"vf", p:"Se puede reducir el tamaño de un PVC editando su petición de almacenamiento.",
  ok:false, why:"Kubernetes solo permite ampliar. Para reducir hay que crear un volumen nuevo más pequeño y copiar los datos."},
 {t:"opcion", p:"Un pod con un PVC en la zona <code>eu-west-1a</code> se queda en Pending con «volume node affinity conflict». ¿Qué pasa?",
  ops:["El disco está lleno","El disco existe en una zona y el pod solo cabe en nodos de otras zonas: un disco de bloque no cruza zonas","Falta un Service","El PVC es RWX"],
  ok:1, why:"Hace falta capacidad en la zona del disco. Con WaitForFirstConsumer se evita al crearlo, pero un volumen ya existente ata sus pods a su zona para siempre."}
]},

{
id:"k6l3",
titulo:"StatefulSets",
claves:["Identidad estable: nombres ordenados (db-0, db-1) y DNS propio vía Service headless","Un PVC propio por réplica con volumeClaimTemplates","Arranque y parada ordenados, y actualizaciones por partición"],
pasos:[
 {t:"info", eti:"Aplicaciones con estado", h:"Cuando las réplicas no son intercambiables",
  c:`<p>En un Deployment todas las réplicas son iguales e intercambiables. Una base de datos replicada no: <code>postgres-0</code> es el primario, <code>postgres-1</code> una réplica, y cada uno tiene <b>sus propios datos</b>. Para eso existe el <b>StatefulSet</b>:</p>
     <ul><li>Nombres <b>estables y ordenados</b>: <code>db-0</code>, <code>db-1</code>, <code>db-2</code>. Si <code>db-1</code> muere, vuelve como <code>db-1</code>.</li>
     <li>Un <b>PVC por réplica</b> que la sigue siempre.</li>
     <li><b>DNS propio</b> por pod gracias a un Service headless: <code>db-0.db.datos.svc.cluster.local</code>.</li>
     <li>Arranque en orden (0, 1, 2) y parada en orden inverso.</li></ul>`},
 {t:"info", eti:"El manifiesto", h:"volumeClaimTemplates",
  c:`<div class="termbox">apiVersion: apps/v1
kind: StatefulSet
metadata: { name: db }
spec:
  serviceName: db               <span class="cm"># Service headless (clusterIP: None)</span>
  replicas: 3
  selector: { matchLabels: { app: db } }
  template:
    metadata: { labels: { app: db } }
    spec:
      containers:
        - name: postgres
          image: postgres:17
          volumeMounts: [{ name: datos, mountPath: /var/lib/postgresql/data }]
  volumeClaimTemplates:          <span class="cm"># un PVC por replica: datos-db-0, datos-db-1...</span>
    - metadata: { name: datos }
      spec:
        accessModes: [ReadWriteOnce]
        resources: { requests: { storage: 50Gi } }</div>`},
 {t:"par", p:"Empareja cada característica con el objeto que la ofrece",
  pares:[["Réplicas intercambiables con nombres aleatorios","Deployment"],["Nombres estables db-0, db-1","StatefulSet"],["Un volumen propio por réplica","StatefulSet (volumeClaimTemplates)"],["DNS por pod individual","Service headless"]],
  why:"Deployment para aplicaciones sin estado; StatefulSet para bases de datos, colas y sistemas distribuidos con identidad."},
 {t:"term", p:"Lista los pods del StatefulSet <code>db</code> (tienen la label <code>app=db</code>) con su IP y su nodo", prompt:"pablo@portatil:~$",
  sol:["kubectl get pods -l app=db -o wide","kubectl get pod -l app=db -o wide","kubectl get po -l app=db -o wide","kubectl get pods -o wide -l app=db"],
  pista:"kubectl get pods con -l y -o wide.",
  salida:`NAME   READY   STATUS    RESTARTS   AGE   IP            NODE
db-0   1/1     Running   0          6d    10.244.1.12   kind-worker
db-1   1/1     Running   0          6d    10.244.2.9    kind-worker2
db-2   1/1     Running   0          6d    10.244.3.7    kind-worker3`,
  why:"Nombres ordenados, uno por nodo. Si db-1 muere, volverá a llamarse db-1 y a montar datos-db-1, aunque su IP cambie: por eso los clientes usan db-1.db, no la IP."},
 {t:"opcion", p:"Escalas un StatefulSet de 3 a 1 réplica. ¿Qué pasa con los PVCs de db-1 y db-2?",
  ops:["Se borran","Se conservan por defecto, para que al volver a escalar esas réplicas recuperen sus datos","Se fusionan","Se mueven a db-0"],
  ok:1, why:"Kubernetes es prudente con los datos. (persistentVolumeClaimRetentionPolicy permite cambiarlo.)"},
 {t:"info", eti:"Actualizar con cuidado", h:"podManagementPolicy y partition",
  c:`<div class="termbox">spec:
  podManagementPolicy: Parallel      <span class="cm"># arrancar todos a la vez (por defecto OrderedReady)</span>
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 2                   <span class="cm"># solo se actualizan los pods con ordinal &gt;= 2</span></div>
     <p>Las actualizaciones van de mayor a menor ordinal, de una en una, esperando a que cada pod esté listo. Con <code>partition</code> haces un canary: actualizas solo <code>db-2</code>, compruebas, bajas la partición a 0 y sigue el resto.</p>`},
 {t:"opcion", p:"Un StatefulSet tiene <code>partition: 2</code> y 3 réplicas. Cambias la imagen. ¿Qué pods se actualizan?",
  ops:["Todos","Solo db-2 (ordinal mayor o igual que 2)","db-0 y db-1","Ninguno"],
  ok:1, why:"Los pods por debajo de la partición conservan la versión anterior aunque se recreen. Bajar la partición es lo que «promociona» la versión nueva."},
 {t:"vf", p:"Un StatefulSet convierte automáticamente PostgreSQL en un clúster replicado con failover.",
  ok:false, why:"Solo da identidad y almacenamiento estables. La replicación y el failover los gestiona la aplicación o un operador (CloudNativePG, Zalando, Patroni)."}
]},

{
id:"k6l4",
titulo:"¿Bases de datos dentro de Kubernetes?",
claves:["Opción 1: base de datos gestionada del proveedor (RDS, Cloud SQL)","Opción 2: un operador especializado (CloudNativePG, Strimzi...)","Nunca un Deployment con un solo PVC para datos críticos"],
pasos:[
 {t:"info", eti:"El debate", h:"Dónde vive la base de datos",
  c:`<p>Es posible ejecutar bases de datos en Kubernetes, pero operar datos es difícil: backups, replicación, failover, actualizaciones de versión, rendimiento de disco. Las dos opciones sensatas:</p>
     <ul><li><b>Servicio gestionado</b> (RDS, Cloud SQL, Azure Database): el proveedor se encarga de backups, parches y alta disponibilidad. La opción por defecto en la mayoría de empresas.</li>
     <li><b>Operador</b> dentro del clúster: software que sabe operar esa base de datos (CloudNativePG para PostgreSQL, Strimzi para Kafka). Tiene sentido con equipos de plataforma maduros o para evitar dependencia de un proveedor.</li></ul>`},
 {t:"opcion", p:"Un equipo pequeño sin experiencia en operar PostgreSQL necesita una base de datos fiable para su API en EKS. ¿Qué recomiendas?",
  ops:["Un Deployment con un PVC","RDS (servicio gestionado) y la API en EKS conectándose a él","Una base de datos en un emptyDir","Un pod suelto"],
  ok:1, why:"Delegar la operación de datos en el proveedor es lo prudente cuando no hay un equipo para hacerlo."},
 {t:"info", eti:"Operadores", h:"Kubernetes que sabe de bases de datos",
  c:`<div class="termbox">apiVersion: postgresql.cnpg.io/v1
kind: Cluster                     <span class="cm"># un recurso NUEVO que define el operador</span>
metadata: { name: pg-tareas }
spec:
  instances: 3                    <span class="cm"># 1 primario + 2 replicas, con failover automatico</span>
  storage: { size: 50Gi }
  plugins:                        <span class="cm"># backups y WAL a S3 con el plugin Barman Cloud</span>
    - name: barman-cloud.cloudnative-pg.io
      isWALArchiver: true
      parameters: { barmanObjectName: backups-s3 }</div>
     <p>El operador traduce ese deseo en pods, PVCs, Services (<code>pg-tareas-rw</code> apunta siempre al primario, <code>pg-tareas-ro</code> a las réplicas), replicación, backups y failover. Es el patrón <b>operador</b>, que verás en la unidad de extensibilidad.</p>`},
 {t:"opcion", p:"Con CloudNativePG, el primario cae y el operador promociona una réplica. ¿Qué tiene que cambiar tu aplicación?",
  ops:["La IP de la base de datos en su configuración","Nada: se conecta al Service pg-tareas-rw, que el operador apunta al nuevo primario","Reiniciarse a mano","Cambiar de usuario"],
  ok:1, why:"Los Services estables son la pieza que hace transparente el failover. Tu aplicación sí debe reintentar las conexiones que se cortan durante el cambio."},
 {t:"vf", p:"Un operador de bases de datos incorpora conocimiento operativo (failover, backups, actualizaciones) en forma de software.",
  ok:true, why:"Es la definición de operador: automatizar lo que haría un administrador experto."},
 {t:"par", p:"Empareja cada opción con su ventaja principal",
  pares:[["Servicio gestionado","El proveedor opera backups, parches y alta disponibilidad"],["Operador en el clúster","Control total y portabilidad entre proveedores"],["Deployment con PVC","Solo aceptable para pruebas y desarrollo"]],
  why:"Esta respuesta matizada es la que se espera en una entrevista de arquitectura."},
 {t:"orden", p:"Ordena las comprobaciones antes de meter una base de datos de producción en tu clúster",
  items:["¿Hay un equipo capaz de operarla y de estar de guardia?","¿Existe un operador maduro para ese motor?","¿El almacenamiento da el rendimiento y la durabilidad necesarios?","¿Están probados los backups y la restauración en otro clúster?","¿Están repartidas las instancias entre zonas con PDB y antiafinidad?"],
  why:"Primero las personas, después el software y el hardware, y al final la prueba de fuego: una restauración ensayada."}
]}

]});
