window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Qué es Kafka",
resumen: "Eventos y streaming, el registro distribuido, topics, particiones, offsets, brokers y réplicas",
nivel: "Fundamentos",
color: "#9aa5b8",
lecciones: [

{
id:"kf1l1",
titulo:"Eventos y streaming",
claves:["Kafka es una plataforma de streaming: un registro distribuido y duradero de eventos","Los productores escriben eventos y los consumidores los leen a su ritmo","A diferencia de una cola clásica, los eventos se conservan y varios consumidores pueden releerlos"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Pensar en eventos",
  c:`<p>Un <b>evento</b> es algo que ocurrió: «pedido 1042 pagado a las 10:02», «usuario 7 cambió su email». <b>Apache Kafka</b> guarda esos eventos en orden, de forma duradera y replicada, y permite que muchos sistemas los lean a su ritmo.</p>
     <div class="diag">servicio de pedidos --&gt; topic "pedidos" --&gt; facturacion (lee a su ritmo)
                                          --&gt; logistica
                                          --&gt; analitica (puede releer todo el historial)
                                          --&gt; buscador</div>
     <p>Lo usan para desacoplar microservicios, alimentar analítica en tiempo real, replicar datos entre sistemas (CDC) o procesar flujos continuos (fraude, recomendaciones).</p>`},
 {t:"par", p:"Empareja cada característica con Kafka o con una cola clásica (RabbitMQ, SQS)",
  pares:[["Los mensajes se borran al consumirse","Cola clásica: una bandeja de tareas"],["Los eventos se conservan según la retención","Kafka: se pueden releer"],["Varios grupos leen el mismo evento","Kafka: cada grupo con su offset"],["Enrutado complejo por reglas y prioridades","RabbitMQ: exchanges y colas"]],
  why:"Kafka es un registro (log); una cola es una bandeja de tareas."},
 {t:"opcion", p:"Un servicio nuevo de analítica necesita procesar todos los pedidos de los últimos 7 días. ¿Qué lo permite en Kafka?",
  ops:["Nada, ya se consumieron","La retención: los eventos siguen en el topic y el nuevo consumidor puede leer desde el principio","Pedirlos a la base de datos siempre","Reenviar los eventos a mano"],
  ok:1, why:"Es una de las grandes ventajas de un registro de eventos."},
 {t:"vf", p:"En Kafka, cuando un consumidor lee un mensaje, este desaparece para los demás.",
  ok:false, why:"Cada grupo de consumidores lleva su propia posición (offset); el mensaje permanece según la retención."}
]},

{
id:"kf1l2",
titulo:"Topics, particiones y offsets",
claves:["Un topic es una categoría de eventos dividida en particiones","Cada partición es un registro ordenado; cada evento tiene un offset","El orden solo se garantiza dentro de una partición"],
pasos:[
 {t:"info", eti:"La estructura", h:"Particiones",
  c:`<div class="diag">topic "pedidos" (3 particiones)
particion 0: [0][1][2][3][4][5] ...      offset = posicion dentro de la particion
particion 1: [0][1][2][3] ...
particion 2: [0][1][2][3][4] ...

clave del evento = pedido_id -&gt; hash(clave) % 3 -&gt; siempre la misma particion
=&gt; todos los eventos del pedido 1042 van en orden a la misma particion</div>
     <p>Las particiones reparten los datos y permiten que varios consumidores lean en paralelo. El <b>orden</b> solo existe dentro de cada partición: por eso se elige una <b>clave</b> que agrupe lo que debe ir ordenado.</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Topic","Categoría o flujo de eventos"],["Partición","Trozo ordenado de un topic"],["Offset","Posición de un evento dentro de su partición"],["Clave del evento","Decide la partición y agrupa eventos relacionados"],["Retención","Cuánto tiempo (o espacio) se conservan los eventos"]],
  why:"Más particiones = más paralelismo, pero también más coste de gestión."},
 {t:"opcion", p:"Los eventos «creado», «pagado» y «enviado» de un mismo pedido deben procesarse en orden. ¿Qué haces?",
  ops:["Usar un topic por evento","Usar el id del pedido como clave: irán a la misma partición y en orden","Una sola partición para todo el sistema","No se puede garantizar"],
  ok:1, why:"Una sola partición daría orden total, pero sin paralelismo."},
 {t:"vf", p:"Kafka garantiza el orden de todos los eventos de un topic con varias particiones.",
  ok:false, why:"Solo dentro de cada partición."}
]},

{
id:"kf1l3",
titulo:"Brokers, réplicas y KRaft",
claves:["Un clúster tiene varios brokers; cada partición tiene un líder y réplicas en otros brokers","Factor de replicación 3 y min.insync.replicas 2 son valores habituales en producción","KRaft sustituye a ZooKeeper para los metadatos del clúster"],
pasos:[
 {t:"info", eti:"Duradero", h:"Replicación",
  c:`<div class="diag">particion 0:  lider en broker 1, replicas en broker 2 y 3
particion 1:  lider en broker 2, replicas en broker 3 y 1
particion 2:  lider en broker 3, replicas en broker 1 y 2

los productores escriben en el lider; las replicas copian
si cae el broker 1, una replica sincronizada (ISR) pasa a ser lider</div>
     <div class="termbox">kafka-topics.sh --bootstrap-server kafka:9092 --create --topic pedidos \\
  --partitions 6 --replication-factor 3 --config min.insync.replicas=2</div>`},
 {t:"par", p:"Empareja cada término con su significado",
  pares:[["Broker","Servidor de Kafka que guarda particiones"],["Líder","Réplica que atiende lecturas y escrituras de una partición"],["ISR","Réplicas sincronizadas con el líder"],["Factor de replicación","Cuántas copias tiene cada partición"],["KRaft","Protocolo interno de Kafka para los metadatos, sin ZooKeeper"]],
  why:"Con réplicas 3 y min.insync 2, se tolera la caída de un broker sin perder escrituras confirmadas."},
 {t:"term", p:"Crea el topic <code>pedidos</code> con 6 particiones y factor de replicación 3 en <code>kafka:9092</code>",
  prompt:"pablo@kafka:~$", sol:["kafka-topics.sh --bootstrap-server kafka:9092 --create --topic pedidos --partitions 6 --replication-factor 3","kafka-topics.sh --create --topic pedidos --partitions 6 --replication-factor 3 --bootstrap-server kafka:9092","kafka-topics --bootstrap-server kafka:9092 --create --topic pedidos --partitions 6 --replication-factor 3"],
  pista:"kafka-topics.sh con --bootstrap-server, --create, --topic, --partitions y --replication-factor.",
  salida:`Created topic pedidos.`, why:"El número de particiones se puede aumentar después, pero no reducir, y cambia el reparto de claves."}
]},

{
id:"kf1l4",
titulo:"Kafka en local y la línea de comandos",
claves:["Un Kafka en modo KRaft se levanta con un solo contenedor","kafka-console-producer y kafka-console-consumer para probar","kcat e interfaces como Kafka UI o Redpanda Console para explorar"],
pasos:[
 {t:"info", eti:"Practicar", h:"Kafka con Docker Compose",
  c:`<div class="termbox">services:
  kafka:
    image: apache/kafka:3.8.0          # modo KRaft, sin ZooKeeper
    ports: ["9092:9092"]
  kafka-ui:
    image: provectuslabs/kafka-ui
    ports: ["8081:8080"]
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092</div>
     <div class="termbox">kafka-console-producer.sh --bootstrap-server localhost:9092 --topic pedidos --property parse.key=true --property key.separator=:
1042:{"estado":"pagado"}

kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic pedidos --from-beginning --group pruebas</div>`},
 {t:"term", p:"Lee desde el principio los mensajes del topic <code>pedidos</code> en <code>localhost:9092</code>",
  prompt:"pablo@portatil:~$", sol:["kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic pedidos --from-beginning","kafka-console-consumer.sh --topic pedidos --from-beginning --bootstrap-server localhost:9092","kafka-console-consumer --bootstrap-server localhost:9092 --topic pedidos --from-beginning"],
  pista:"kafka-console-consumer.sh con --bootstrap-server, --topic y --from-beginning.",
  salida:`{"estado":"creado"}
{"estado":"pagado"}
{"estado":"enviado"}`, why:"Sin --from-beginning, un grupo nuevo empieza por los mensajes que lleguen a partir de ahora."},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["kafka-console-producer","Enviar mensajes a mano"],["kafka-console-consumer","Leer mensajes de un topic"],["kafka-consumer-groups","Ver offsets y lag de los grupos"],["Kafka UI","Explorar topics, mensajes y grupos desde el navegador"],["kcat","Navaja suiza de línea de comandos para Kafka"]],
  why:"Probar con la consola antes de escribir código ahorra mucho tiempo."}
]}

]});
