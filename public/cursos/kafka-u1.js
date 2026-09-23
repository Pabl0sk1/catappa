window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Qué es Kafka",
resumen: "Eventos y streaming, el registro distribuido, topics, particiones, offsets, brokers y réplicas",
nivel: "Fundamentos",
color: "#9aa5b8",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"kf1l1",
titulo:"Eventos y streaming",
claves:["Kafka es una plataforma de streaming: un registro distribuido y duradero de eventos","Los productores escriben eventos y los consumidores los leen a su ritmo","A diferencia de una cola clásica, los eventos se conservan y varios consumidores pueden releerlos"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Pensar en eventos",
  c:`<p>Un <b>evento</b> es algo que ocurrió: «pedido 1042 pagado a las 10:02», «usuario 7 cambió su email». <b>Apache Kafka</b> guarda esos eventos en orden, de forma duradera y replicada, y permite que muchos sistemas los lean a su ritmo.</p>
     <div class="dg">
       <div class="dg-cols">
         <div class="dg-col">
           <div class="dg-col-tit">escribe</div>
           <div class="dg-caja acento doble">servicio de pedidos<small>productor</small></div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">guarda</div>
           <div class="dg-caja doble">topic «pedidos»<small>registro ordenado y duradero</small></div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">leen, cada uno a su ritmo</div>
           <div class="dg-pila">
             <div class="dg-caja ok">facturación</div>
             <div class="dg-caja ok">logística</div>
             <div class="dg-caja ok">analítica</div>
             <div class="dg-caja ok">buscador</div>
           </div>
         </div>
       </div>
       <div class="dg-nota">el productor no sabe quién lee, ni cuántos: por eso desacopla</div>
     </div>
     <p>Lo usan para desacoplar microservicios, alimentar analítica en tiempo real, replicar datos entre sistemas (CDC) o procesar flujos continuos (fraude, recomendaciones).</p>`},
 {t:"par", p:"Empareja cada característica con Kafka o con una cola clásica (RabbitMQ, SQS)",
  pares:[["Los mensajes se borran al consumirse","Cola clásica: una bandeja de tareas"],["Los eventos se conservan según la retención","Kafka: se pueden releer"],["Varios grupos leen el mismo evento","Kafka: cada grupo con su offset"],["Enrutado complejo por reglas y prioridades","RabbitMQ: exchanges y colas"]],
  why:"Kafka es un registro (log); una cola es una bandeja de tareas."},
 {t:"opcion", p:"Un servicio nuevo de analítica necesita procesar todos los pedidos de los últimos 7 días. ¿Qué lo permite en Kafka?",
  ops:["Nada, ya se consumieron","La retención: los eventos siguen en el topic y el nuevo consumidor puede leer desde el principio","Pedirlos a la base de datos siempre","Reenviar los eventos a mano"],
  ok:1, why:"Es una de las grandes ventajas de un registro de eventos."},
 {t:"vf", p:"En Kafka, cuando un consumidor lee un mensaje, este desaparece para los demás.",
  ok:false, why:"Cada grupo de consumidores lleva su propia posición (offset); el mensaje permanece según la retención."},
 {t:"info", eti:"El cambio de mentalidad", h:"Órdenes contra hechos",
  c:`<p>Hay una diferencia que lo cambia todo:</p>
     <ul><li>Una <b>orden</b> («envía este correo») va dirigida a alguien concreto y espera que lo haga.</li>
     <li>Un <b>hecho</b> («el pedido 1042 se pagó») no va dirigido a nadie: simplemente ocurrió. Quien quiera, que reaccione.</li></ul>
     <p>Kafka empuja hacia los hechos. El servicio de pedidos publica que algo pasó y se olvida; mañana entra un servicio de recomendaciones y se suscribe sin que nadie toque el servicio de pedidos.</p>
     <p>Esa es la razón de fondo por la que se elige Kafka, y no que sea «rápido».</p>`},
 {t:"opcion", p:"¿Cuál de estos nombres de evento está mejor elegido?",
  ops:["EnviarCorreoDeConfirmacion","PedidoPagado","ProcesarPedido","ActualizarStock"],
  ok:1, why:"Los otros tres son órdenes disfrazadas: atan al productor con lo que hace el consumidor. Un evento se nombra en pasado, como un hecho."},
 {t:"vf", p:"Kafka sirve también como base de datos principal de una aplicación.",
  ok:false, why:"Es un registro de eventos excelente, pero no está pensado para consultar «dame el pedido 1042». Alimenta bases de datos y sistemas que sí lo hacen."}
]},

/* =============== U1 L2 =============== */
{
id:"kf1l2",
titulo:"Topics, particiones y offsets",
claves:["Un topic es una categoría de eventos dividida en particiones","Cada partición es un registro ordenado; cada evento tiene un offset","El orden solo se garantiza dentro de una partición"],
pasos:[
 {t:"info", eti:"La estructura", h:"Particiones",
  c:`<div class="dg">
       <div class="dg-tit">topic «pedidos» con 3 particiones</div>
       <div class="dg-pila">
         <div class="dg-caja acento">partición 0 → [0][1][2][3][4][5] …</div>
         <div class="dg-caja acento">partición 1 → [0][1][2][3] …</div>
         <div class="dg-caja acento">partición 2 → [0][1][2][3][4] …</div>
       </div>
       <div class="dg-nota">el offset es la posición dentro de SU partición, no del topic</div>
       <div class="dg-nota arriba">hash(clave) decide la partición: el pedido 1042 siempre cae en la misma</div>
     </div>
     <p>Las particiones reparten los datos y permiten que varios consumidores lean en paralelo. El <b>orden</b> solo existe dentro de cada partición: por eso se elige una <b>clave</b> que agrupe lo que debe ir ordenado.</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Topic","Categoría o flujo de eventos"],["Partición","Trozo ordenado de un topic"],["Offset","Posición de un evento dentro de su partición"],["Clave del evento","Decide la partición y agrupa eventos relacionados"],["Retención","Cuánto tiempo (o espacio) se conservan los eventos"]],
  why:"Más particiones = más paralelismo, pero también más coste de gestión."},
 {t:"opcion", p:"Los eventos «creado», «pagado» y «enviado» de un mismo pedido deben procesarse en orden. ¿Qué haces?",
  ops:["Usar un topic por evento","Usar el id del pedido como clave: irán a la misma partición y en orden","Una sola partición para todo el sistema","No se puede garantizar"],
  ok:1, why:"Una sola partición daría orden total, pero sin paralelismo."},
 {t:"vf", p:"Kafka garantiza el orden de todos los eventos de un topic con varias particiones.",
  ok:false, why:"Solo dentro de cada partición."},
 {t:"info", eti:"La decisión que no se puede deshacer", h:"Cuántas particiones",
  c:`<p>El número de particiones se puede <b>aumentar</b>, pero nunca reducir. Y al aumentarlo, el reparto de claves cambia: los eventos nuevos de un pedido pueden ir a otra partición que los viejos, y ahí se rompe el orden que tanto cuidaste.</p>
     <p>Reglas prácticas:</p>
     <ul><li>El paralelismo máximo de un grupo de consumidores es el número de particiones.</li>
     <li>Estima el caudal por partición (unos pocos MB/s es lo normal) y deja margen.</li>
     <li>Miles de particiones por clúster también cuestan: más metadatos, rebalanceos más lentos.</li></ul>
     <p>Empezar con 6 o 12 en un topic importante es una elección razonable; empezar con 1 «ya lo cambiaré» es el error clásico.</p>`},
 {t:"opcion", p:"Tienes un topic con 3 particiones y lo subes a 6. ¿Qué pasa con el orden por clave?",
  ops:["Nada, se mantiene","Los eventos nuevos de una clave pueden ir a otra partición: el orden con los antiguos ya no está garantizado","Kafka reordena todo","Se pierden datos"],
  ok:1, why:"Por eso cambiar particiones en un topic con claves es una operación delicada, que a veces se hace creando un topic nuevo."},
 {t:"escribe", p:"Si el topic tiene 6 particiones y la función hash de la clave da 17, ¿en qué partición cae el evento? (escribe solo el número)",
  sol:["5"],
  pista:"El resto de dividir entre el número de particiones.",
  why:"17 % 6 = 5. Es literalmente así de simple: por eso la misma clave cae siempre en el mismo sitio mientras no cambie el número de particiones."}
]},

/* =============== U1 L3 =============== */
{
id:"kf1l3",
titulo:"Brokers, réplicas y KRaft",
claves:["Un clúster tiene varios brokers; cada partición tiene un líder y réplicas en otros brokers","Factor de replicación 3 y min.insync.replicas 2 son valores habituales en producción","KRaft sustituye a ZooKeeper para los metadatos del clúster"],
pasos:[
 {t:"info", eti:"Duradero", h:"Replicación",
  c:`<div class="dg">
       <div class="dg-tit">tres brokers, tres particiones replicadas</div>
       <div class="dg-pila">
         <div class="dg-caja acento doble">partición 0<small>líder en broker 1 · réplicas en 2 y 3</small></div>
         <div class="dg-caja acento doble">partición 1<small>líder en broker 2 · réplicas en 3 y 1</small></div>
         <div class="dg-caja acento doble">partición 2<small>líder en broker 3 · réplicas en 1 y 2</small></div>
       </div>
       <div class="dg-nota">se escribe siempre en el líder; si su broker cae, una réplica sincronizada toma el relevo</div>
     </div>
     <div class="termbox">kafka-topics.sh --bootstrap-server kafka:9092 --create --topic pedidos \\
  --partitions 6 --replication-factor 3 --config min.insync.replicas=2</div>`},
 {t:"par", p:"Empareja cada término con su significado",
  pares:[["Broker","Servidor de Kafka que guarda particiones"],["Líder","Réplica que atiende lecturas y escrituras de una partición"],["ISR","Réplicas sincronizadas con el líder"],["Factor de replicación","Cuántas copias tiene cada partición"],["KRaft","Protocolo interno de Kafka para los metadatos, sin ZooKeeper"]],
  why:"Con réplicas 3 y min.insync 2, se tolera la caída de un broker sin perder escrituras confirmadas."},
 {t:"term", p:"Crea el topic <code>pedidos</code> con 6 particiones y factor de replicación 3 en <code>kafka:9092</code>",
  prompt:"pablo@kafka:~$", sol:["kafka-topics.sh --bootstrap-server kafka:9092 --create --topic pedidos --partitions 6 --replication-factor 3","kafka-topics.sh --create --topic pedidos --partitions 6 --replication-factor 3 --bootstrap-server kafka:9092","kafka-topics --bootstrap-server kafka:9092 --create --topic pedidos --partitions 6 --replication-factor 3"],
  pista:"kafka-topics.sh con --bootstrap-server, --create, --topic, --partitions y --replication-factor.",
  salida:`Created topic pedidos.`, why:"El número de particiones se puede aumentar después, pero no reducir, y cambia el reparto de claves."},
 {t:"info", eti:"El número que decide si pierdes datos", h:"min.insync.replicas",
  c:`<p>Con <code>acks=all</code>, el productor espera a que la escritura esté en todas las réplicas <b>sincronizadas</b>. Pero si solo queda una sincronizada, «todas» es una: y esa escritura se pierde si ese broker cae.</p>
     <div class="termbox">replication.factor = 3
min.insync.replicas = 2     # con menos de 2 sincronizadas, Kafka RECHAZA la escritura</div>
     <p>Esa combinación es la habitual: tolera perder un broker y sigue aceptando escrituras; si pierde dos, prefiere rechazar antes que aceptar algo que puede perderse.</p>`},
 {t:"opcion", p:"Tienes <code>replication.factor=3</code>, <code>min.insync.replicas=3</code> y <code>acks=all</code>. Cae un broker. ¿Qué pasa?",
  ops:["Nada","Las escrituras empiezan a fallar: no quedan 3 réplicas sincronizadas","Se pierden datos","Se crea otra réplica al instante"],
  ok:1, why:"Es el error de configuración clásico: pedir min.insync igual al factor de replicación deja el sistema sin tolerancia a fallos."},
 {t:"vf", p:"KRaft elimina la necesidad de ZooKeeper.",
  ok:true, why:"Desde Kafka 3.3 es apto para producción y en Kafka 4 ZooKeeper ya no está. Menos piezas que operar."},
 {t:"opcion", p:"¿Por qué conviene que las réplicas de una partición estén en zonas o racks distintos?",
  ops:["Por rendimiento","Porque si se cae una zona entera, aún queda al menos una copia en otra","Por la licencia","No importa"],
  ok:1, why:"Kafka lo sabe hacer solo con <code>broker.rack</code>: reparte las réplicas entre racks o zonas."}
]},

/* =============== U1 L4 =============== */
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
  why:"Probar con la consola antes de escribir código ahorra mucho tiempo."},
 {t:"term", p:"Lista los topics del clúster en <code>localhost:9092</code>",
  prompt:"pablo@portatil:~$",
  sol:["kafka-topics.sh --bootstrap-server localhost:9092 --list","kafka-topics --bootstrap-server localhost:9092 --list","kafka-topics.sh --list --bootstrap-server localhost:9092"],
  pista:"kafka-topics.sh con --list.",
  salida:`__consumer_offsets
pedidos
pedidos.DLT`,
  why:"<code>__consumer_offsets</code> es interno: ahí guarda Kafka por dónde va cada grupo."},
 {t:"term", p:"Muestra el detalle del grupo <code>facturacion</code> (offsets y retraso)",
  prompt:"pablo@portatil:~$",
  sol:["kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group facturacion","kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group facturacion","kafka-consumer-groups.sh --describe --group facturacion --bootstrap-server localhost:9092"],
  pista:"kafka-consumer-groups.sh con --describe y --group.",
  salida:`GROUP        TOPIC    PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
facturacion  pedidos  0          18230           18232           2
facturacion  pedidos  1          9011            9011            0`,
  why:"Esa columna LAG es la métrica que hay que vigilar en producción: si crece sin parar, los consumidores no dan abasto."},
 {t:"opcion", p:"Consumes con <code>--from-beginning</code> y no sale nada, pero sabes que hay mensajes. ¿Qué es lo más probable?",
  ops:["Kafka está roto","Ese grupo ya tiene offsets guardados: --from-beginning solo aplica cuando el grupo no tiene posición previa","El topic no existe","Falta TLS"],
  ok:1, why:"Se resuelve usando un grupo nuevo o reiniciando los offsets con <code>--reset-offsets</code>."},
 {t:"vf", p:"Un topic se crea solo al publicar en él, si el clúster lo permite.",
  ok:true, why:"Con <code>auto.create.topics.enable</code>, sí. En producción se desactiva: así una errata en el nombre no crea un topic fantasma con configuración por defecto."}
]}

]});
