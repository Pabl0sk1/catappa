window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Almacenamiento y aplicaciones con estado",
resumen: "Volúmenes, PV y PVC, StorageClass y provisión dinámica, StatefulSets y bases de datos en Kubernetes",
nivel: "Avanzado",
color: "#4f7fd8",
lecciones: [

{
id:"k6l1",
titulo:"Volúmenes, PV y PVC",
claves:["emptyDir vive lo que vive el pod; persistentVolumeClaim sobrevive","PersistentVolume es el disco; PersistentVolumeClaim es la petición de un pod","Modos de acceso: ReadWriteOnce, ReadOnlyMany, ReadWriteMany, ReadWriteOncePod"],
pasos:[
 {t:"info", eti:"Tipos de volumen", h:"De efímero a persistente",
  c:`<ul><li><b>emptyDir</b>: carpeta temporal que comparten los contenedores del pod. Muere con el pod.</li>
     <li><b>configMap / secret</b>: configuración montada como ficheros.</li>
     <li><b>hostPath</b>: una carpeta del nodo. Peligroso y atado a una máquina: casi nunca en aplicaciones.</li>
     <li><b>persistentVolumeClaim</b>: almacenamiento persistente que sobrevive al pod.</li></ul>`},
 {t:"info", eti:"Dos objetos", h:"PersistentVolume y PersistentVolumeClaim",
  c:`<ul><li><b>PersistentVolume (PV)</b>: un trozo de almacenamiento real (un disco EBS, un volumen de NFS). Es del clúster.</li>
     <li><b>PersistentVolumeClaim (PVC)</b>: la <b>petición</b> de un pod: «necesito 20 GiB, lectura/escritura desde un nodo».</li></ul>
     <div class="termbox">apiVersion: v1
kind: PersistentVolumeClaim
metadata: { name: datos-pg }
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: gp3
  resources:
    requests: { storage: 20Gi }</div>
     <p>Kubernetes <b>une</b> (bind) cada PVC con un PV que cumpla. El pod solo conoce el PVC: no sabe si detrás hay AWS, Azure o un NFS.</p>`},
 {t:"par", p:"Empareja cada modo de acceso con su significado",
  pares:[["ReadWriteOnce (RWO)","Lectura y escritura desde un solo nodo"],["ReadOnlyMany (ROX)","Solo lectura desde muchos nodos"],["ReadWriteMany (RWX)","Lectura y escritura desde muchos nodos (NFS, EFS...)"],["ReadWriteOncePod","Lectura y escritura desde un único pod"]],
  why:"Los discos de bloque de la nube (EBS, Persistent Disk) son RWO. Si necesitas RWX, hace falta un sistema de ficheros de red."},
 {t:"opcion", p:"Tu Deployment de 3 réplicas monta un PVC de tipo EBS (RWO) y dos pods se quedan en ContainerCreating. ¿Por qué?",
  ops:["Falta memoria","Un volumen RWO solo puede montarse en un nodo; los pods programados en otros nodos no pueden engancharlo","El PVC es demasiado grande","Falta un Service"],
  ok:1, why:"Para compartir datos entre réplicas en varios nodos hace falta RWX (EFS, Filestore, NFS)... o replantear el diseño."},
 {t:"vf", p:"Los datos de un emptyDir sobreviven si el pod se recrea en otro nodo.",
  ok:false, why:"emptyDir nace y muere con el pod. Sirve para cachés y ficheros temporales compartidos entre contenedores."}
]},

{
id:"k6l2",
titulo:"StorageClass y provisión dinámica",
claves:["La StorageClass describe un tipo de almacenamiento y quién lo crea (provisioner/CSI)","Con provisión dinámica, crear un PVC crea el disco automáticamente","reclaimPolicy Delete borra el disco al borrar el PVC; Retain lo conserva"],
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
 {t:"opcion", p:"Borras por error el PVC de la base de datos y su StorageClass tiene <code>reclaimPolicy: Delete</code>. ¿Qué pasa con los datos?",
  ops:["Se conservan en el PV","El disco se borra también: los datos se pierden salvo que haya backups o snapshots","Se mueven a otro PVC","Nada, los PVC no se pueden borrar"],
  ok:1, why:"Para datos críticos: Retain, snapshots de volumen (VolumeSnapshot) y backups con Velero."},
 {t:"info", eti:"Copias", h:"VolumeSnapshots y Velero",
  c:`<p><b>VolumeSnapshot</b> pide al driver CSI una instantánea del disco. <b>Velero</b> hace copias de seguridad de objetos del clúster y de sus volúmenes, y permite restaurar en otro clúster: la herramienta estándar para recuperación ante desastres.</p>`},
 {t:"vf", p:"Con provisión dinámica, un administrador debe crear el PersistentVolume antes de que el pod pida su PVC.",
  ok:false, why:"Es justo lo que evita la provisión dinámica: el PV se crea automáticamente a partir de la StorageClass."}
]},

{
id:"k6l3",
titulo:"StatefulSets",
claves:["Identidad estable: nombres ordenados (db-0, db-1) y DNS propio vía Service headless","Un PVC propio por réplica con volumeClaimTemplates","Arranque y parada ordenados"],
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
          image: postgres:16
          volumeMounts: [{ name: datos, mountPath: /var/lib/postgresql/data }]
  volumeClaimTemplates:          <span class="cm"># un PVC por replica: datos-db-0, datos-db-1...</span>
    - metadata: { name: datos }
      spec:
        accessModes: [ReadWriteOnce]
        resources: { requests: { storage: 50Gi } }</div>`},
 {t:"par", p:"Empareja cada característica con el objeto que la ofrece",
  pares:[["Réplicas intercambiables con nombres aleatorios","Deployment"],["Nombres estables db-0, db-1","StatefulSet"],["Un volumen propio por réplica","StatefulSet (volumeClaimTemplates)"],["DNS por pod individual","Service headless"]],
  why:"Deployment para aplicaciones sin estado; StatefulSet para bases de datos, colas y sistemas distribuidos con identidad."},
 {t:"opcion", p:"Escalas un StatefulSet de 3 a 1 réplica. ¿Qué pasa con los PVCs de db-1 y db-2?",
  ops:["Se borran","Se conservan por defecto, para que al volver a escalar esas réplicas recuperen sus datos","Se fusionan","Se mueven a db-0"],
  ok:1, why:"Kubernetes es prudente con los datos. (persistentVolumeClaimRetentionPolicy permite cambiarlo.)"},
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
  backup:
    barmanObjectStore:
      destinationPath: s3://backups/pg-tareas</div>
     <p>El operador traduce ese deseo en StatefulSets, Services, replicación, backups a S3 y failover. Es el patrón <b>operador</b>, que verás en la unidad de extensibilidad.</p>`},
 {t:"vf", p:"Un operador de bases de datos incorpora conocimiento operativo (failover, backups, actualizaciones) en forma de software.",
  ok:true, why:"Es la definición de operador: automatizar lo que haría un administrador experto."},
 {t:"par", p:"Empareja cada opción con su ventaja principal",
  pares:[["Servicio gestionado","El proveedor opera backups, parches y alta disponibilidad"],["Operador en el clúster","Control total y portabilidad entre proveedores"],["Deployment con PVC","Solo aceptable para pruebas y desarrollo"]],
  why:"Esta respuesta matizada es la que se espera en una entrevista de arquitectura."}
]}

]});
