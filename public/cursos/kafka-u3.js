window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Garantías, errores y ecosistema",
resumen: "Exactly once y transacciones, reintentos y dead letter topics, esquemas, Kafka Connect, Debezium, Kafka Streams y operación",
nivel: "Avanzado",
color: "#838ea2",
lecciones: [

{
id:"kf3l1",
titulo:"Errores, reintentos y dead letter topics",
claves:["Un evento que falla siempre (veneno) no debe bloquear la partición","Reintentos con espera y, si se agotan, enviar a un dead letter topic","Transacciones de Kafka para leer, procesar y escribir de forma atómica"],
pasos:[
 {t:"info", eti:"Cuando falla", h:"Gestionar errores",
  c:`<div class="termbox">@Bean
DefaultErrorHandler manejador(KafkaTemplate&lt;Object, Object&gt; t) {
    var recuperador = new DeadLetterPublishingRecoverer(t);      // envia a "pedidos.DLT"
    var espera = new ExponentialBackOffWithMaxRetries(4);
    espera.setInitialInterval(1_000);
    var h = new DefaultErrorHandler(recuperador, espera);
    h.addNotRetryableExceptions(ValidationException.class);       // sin sentido reintentar
    return h;
}</div>
     <p>Sin esto, un evento mal formado se reintentaría indefinidamente y el consumidor no avanzaría en esa partición: todo lo que viene detrás se queda bloqueado.</p>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Reintentos con espera","Superar fallos pasajeros (servicio caído un momento)"],["Dead letter topic","Apartar eventos que fallan siempre para revisarlos"],["Excepciones no reintentables","No reintentar errores que nunca se arreglarán solos"],["Transacciones de Kafka","Consumir y producir de forma atómica (exactly once dentro de Kafka)"],["Alerta sobre el DLT","Enterarse de que hay eventos apartados"]],
  why:"Un DLT sin alertas es un cementerio de eventos que nadie mira."},
 {t:"opcion", p:"Un evento con un JSON corrupto hace fallar al consumidor una y otra vez. ¿Qué pasa sin dead letter topic?",
  ops:["Nada grave","El consumidor se queda atascado en ese offset y los eventos siguientes de esa partición no se procesan","Kafka lo borra","Se salta solo"],
  ok:1, why:"De ahí el nombre de «mensaje veneno»."}
]},

{
id:"kf3l2",
titulo:"Esquemas, Connect, Debezium y Streams",
claves:["Schema Registry con Avro o Protobuf garantiza contratos compatibles entre productores y consumidores","Kafka Connect mueve datos entre Kafka y otros sistemas sin escribir código","Debezium convierte los cambios de una base de datos en eventos (CDC); Kafka Streams procesa flujos"],
pasos:[
 {t:"info", eti:"El ecosistema", h:"Piezas habituales",
  c:`<div class="diag">PostgreSQL --(Debezium, via Kafka Connect)--&gt; topic "bd.public.pedidos"
                                                   |
                   Kafka Streams: filtrar, enriquecer, agregar por ventana
                                                   |
                         topic "ventas_por_minuto" --(Connect sink)--&gt; OpenSearch / S3</div>
     <ul><li><b>Schema Registry</b>: guarda la versión de cada esquema y rechaza cambios incompatibles (quitar un campo obligatorio rompería a los consumidores).</li>
     <li><b>Debezium</b>: lee el WAL de PostgreSQL y publica cada INSERT, UPDATE y DELETE. Base del patrón outbox sin código extra.</li>
     <li><b>Kafka Streams</b> (o Flink): procesamiento continuo con estado, ventanas y uniones.</li></ul>`},
 {t:"par", p:"Empareja cada herramienta con su función",
  pares:[["Schema Registry","Versionar esquemas y comprobar compatibilidad"],["Kafka Connect","Conectores listos para mover datos de y hacia Kafka"],["Debezium","Capturar cambios de una base de datos como eventos"],["Kafka Streams","Procesar flujos con estado dentro de tu aplicación"],["Compactación de logs","Conservar solo el último valor de cada clave"]],
  why:"Un topic compactado funciona como una tabla: el último estado de cada clave."},
 {t:"opcion", p:"¿Qué aporta el Schema Registry?",
  ops:["Más velocidad","Que un productor no pueda publicar un cambio de formato que rompa a los consumidores existentes","Cifrado","Menos particiones"],
  ok:1, why:"Contratos de datos, como OpenAPI para las APIs."}
]},

{
id:"kf3l3",
titulo:"Operar Kafka",
claves:["Vigilar lag de consumidores, particiones sin réplicas sincronizadas y espacio en disco","Retención por tiempo o tamaño; compactación para topics de estado","Servicios gestionados (MSK, Confluent Cloud) o Strimzi en Kubernetes"],
pasos:[
 {t:"par", p:"Empareja cada métrica con lo que indica",
  pares:[["Consumer lag","Cuánto van por detrás los consumidores"],["Under-replicated partitions","Particiones con réplicas que no están al día"],["Offline partitions","Particiones sin líder: no se puede leer ni escribir"],["Uso de disco de los brokers","Si la retención cabe en el almacenamiento"],["Tasa de peticiones y latencia del productor","Salud de la escritura"]],
  why:"Under-replicated distinto de cero de forma sostenida es una alerta seria."},
 {t:"opcion", p:"¿Cómo desplegarías Kafka en Kubernetes?",
  ops:["Con un Deployment sencillo","Con el operador Strimzi, que gestiona brokers como recursos, almacenamiento persistente, actualizaciones ordenadas y usuarios","Con un DaemonSet","No se puede"],
  ok:1, why:"Kafka es un sistema con estado: un operador encapsula su conocimiento operativo."},
 {t:"vf", p:"Un topic con cleanup.policy=compact conserva para siempre todos los valores de cada clave.",
  ok:false, why:"Conserva al menos el último valor de cada clave; los anteriores se eliminan con el tiempo."}
]},

{
id:"kf3l4",
titulo:"Seguridad en Kafka",
claves:["TLS para cifrar el tráfico entre clientes y brokers","Autenticación con SASL (SCRAM, OAUTHBEARER) o mTLS","Autorización con ACL: quién puede leer o escribir en qué topic"],
pasos:[
 {t:"info", eti:"Proteger los eventos", h:"Capas de seguridad",
  c:`<div class="termbox"># cliente
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="facturacion" password="...";

# ACL: el servicio de facturacion solo puede leer "pedidos" con su grupo
kafka-acls.sh --bootstrap-server kafka:9093 --command-config admin.properties \\
  --add --allow-principal User:facturacion --operation Read --topic pedidos --group facturacion</div>`},
 {t:"par", p:"Empareja cada mecanismo con lo que protege",
  pares:[["TLS","Que nadie lea o altere los mensajes en la red"],["SASL SCRAM","Autenticar a cada cliente con usuario y contraseña"],["mTLS","Autenticar con certificados de cliente"],["ACL","Qué puede hacer cada cliente en cada topic"],["Cifrado en reposo","Proteger los datos en los discos de los brokers"]],
  why:"Los eventos suelen llevar datos personales: trátalos como la base de datos."},
 {t:"vf", p:"Por defecto, cualquier cliente que llegue al puerto de Kafka puede leer y escribir en cualquier topic.",
  ok:true, why:"Sin autenticación ni ACL configuradas, sí. Por eso se configuran siempre en producción."}
]}

]});
