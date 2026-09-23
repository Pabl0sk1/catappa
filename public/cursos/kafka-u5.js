window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Ecosistema y datos",
resumen: "Esquemas y compatibilidad, Connect y Debezium, Kafka Streams, retención y compactación",
nivel: "Avanzado",
color: "#717e94",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"kf3l2",
titulo:"Esquemas, Connect, Debezium y Streams",
claves:["Schema Registry con Avro o Protobuf garantiza contratos compatibles entre productores y consumidores","Kafka Connect mueve datos entre Kafka y otros sistemas sin escribir código","Debezium convierte los cambios de una base de datos en eventos (CDC); Kafka Streams procesa flujos"],
pasos:[
 {t:"info", eti:"El ecosistema", h:"Piezas habituales",
  c:`<div class="dg">
       <div class="dg-flujo">
         <div class="dg-caja acento">PostgreSQL</div>
         <div class="dg-caja">Debezium (Connect)</div>
         <div class="dg-caja">topic bd.public.pedidos</div>
         <div class="dg-caja">Kafka Streams</div>
         <div class="dg-caja ok">OpenSearch / S3</div>
       </div>
       <div class="dg-nota">cada pieza hace una cosa; todas hablan por topics</div>
     </div>
     <ul><li><b>Schema Registry</b>: guarda la versión de cada esquema y rechaza cambios incompatibles (quitar un campo obligatorio rompería a los consumidores).</li>
     <li><b>Debezium</b>: lee el WAL de PostgreSQL y publica cada INSERT, UPDATE y DELETE. Base del patrón outbox sin código extra.</li>
     <li><b>Kafka Streams</b> (o Flink): procesamiento continuo con estado, ventanas y uniones.</li></ul>`},
 {t:"par", p:"Empareja cada herramienta con su función",
  pares:[["Schema Registry","Versionar esquemas y comprobar compatibilidad"],["Kafka Connect","Conectores listos para mover datos de y hacia Kafka"],["Debezium","Capturar cambios de una base de datos como eventos"],["Kafka Streams","Procesar flujos con estado dentro de tu aplicación"],["Compactación de logs","Conservar solo el último valor de cada clave"]],
  why:"Un topic compactado funciona como una tabla: el último estado de cada clave."},
 {t:"opcion", p:"¿Qué aporta el Schema Registry?",
  ops:["Más velocidad","Que un productor no pueda publicar un cambio de formato que rompa a los consumidores existentes","Cifrado","Menos particiones"],
  ok:1, why:"Contratos de datos, como OpenAPI para las APIs."},
 {t:"info", eti:"Compatibilidad", h:"Qué cambios se pueden hacer",
  c:`<div class="termbox">BACKWARD   los consumidores NUEVOS pueden leer datos VIEJOS
           -&gt; puedes añadir campos con valor por defecto, o quitar opcionales
FORWARD    los consumidores VIEJOS pueden leer datos NUEVOS
           -&gt; puedes añadir campos opcionales
FULL       las dos cosas a la vez (lo mas restrictivo y lo mas seguro)</div>
     <p>Regla práctica que evita el 90% de los problemas: <b>añade campos con valor por defecto y no quites ni renombres nunca</b>. Si un campo sobra, se deja de usar y se retira mucho después.</p>`},
 {t:"opcion", p:"Quieres renombrar el campo <code>total</code> a <code>importeTotal</code> en un evento que ya usan cuatro servicios. ¿Qué haces?",
  ops:["Renombrarlo y avisar","Añadir el campo nuevo, publicar los dos un tiempo, migrar los consumidores y solo entonces retirar el viejo","Crear otro topic","Nada, es compatible"],
  ok:1, why:"Renombrar es quitar y añadir a la vez: rompe a todo el que lea el viejo."},
 {t:"vf", p:"JSON sin esquema es la opción más práctica para eventos entre equipos distintos.",
  ok:false, why:"Es la más cómoda al principio y la que más incidentes causa después. Con esquema, el que rompe el contrato se entera al publicar, no el consumidor a las tres de la mañana."},
 {t:"escribe", p:"¿Qué proyecto se usa para capturar cambios de PostgreSQL y publicarlos como eventos?",
  sol:["Debezium","debezium"],
  pista:"Es un conector de Kafka Connect.",
  why:"Lee el registro de transacciones, así que no hace falta tocar la aplicación ni añadir disparadores."}
]},

/* =============== U5 L2 =============== */
{
id:"kf6l3",
titulo:"Retención, compactación y espacio",
claves:["La retención por tiempo o tamaño decide cuánto se puede releer","La compactación conserva el último valor de cada clave: un topic como tabla","El espacio en disco de los brokers se calcula, no se improvisa"],
pasos:[
 {t:"info", eti:"Cuánto se guarda", h:"Retención",
  c:`<div class="termbox">retention.ms=604800000        # 7 dias
retention.bytes=-1            # sin limite por tamaño (o pon uno por particion)
cleanup.policy=delete         # por defecto: borrar lo viejo
cleanup.policy=compact        # conservar el ultimo valor de cada clave
segment.ms=604800000          # cada cuanto cierra un segmento (la unidad de borrado)</div>
     <p>Kafka no borra evento a evento: borra <b>segmentos</b> enteros cuando ya están cerrados y vencidos. Por eso el espacio baja a saltos y no de forma continua.</p>`},
 {t:"par", p:"Empareja cada política con su caso",
  pares:[["delete con 7 días","Eventos de negocio que se reprocesan como mucho una semana atrás"],["compact","Estado actual por clave: perfiles, configuración, precios"],["compact + delete","Estado con caducidad: se compacta y además se limpia lo muy viejo"],["Retención larga (meses)","Auditoría o reprocesos históricos, con su coste en disco"]],
  why:"El topic compactado es lo que permite reconstruir un caché o una base desde cero leyéndolo entero."},
 {t:"vf", p:"Un topic con <code>cleanup.policy=compact</code> conserva para siempre todos los valores de cada clave.",
  ok:false, why:"Conserva al menos el último valor de cada clave; los anteriores se eliminan con el tiempo."},
 {t:"opcion", p:"¿Cómo se borra una clave de un topic compactado?",
  ops:["No se puede","Publicando un evento con esa clave y valor null (una «lápida»)","Con DELETE","Bajando la retención"],
  ok:1, why:"La lápida se conserva un tiempo para que todos los consumidores la vean, y después desaparece."},
 {t:"info", eti:"Echar la cuenta", h:"Cuánto disco necesitas",
  c:`<div class="termbox">eventos/s x tamaño medio x retencion(s) x factor de replicacion

ejemplo: 2.000 ev/s x 1 KB x 7 dias x 3 replicas
       = 2.000 x 1.024 x 604.800 x 3 ≈ 3,7 TB   (antes de comprimir)</div>
     <p>Con compresión zstd en el productor, eso suele quedarse en una fracción. Pero la cuenta hay que hacerla: quedarse sin disco en un broker es de los incidentes más feos de Kafka.</p>`},
 {t:"opcion", p:"Un broker se queda sin disco. ¿Qué ocurre?",
  ops:["Borra lo viejo solo","Deja de aceptar escrituras para sus particiones y puede caerse: las particiones cuyo líder era él quedan sin servicio hasta el failover","No pasa nada","Comprime automáticamente"],
  ok:1, why:"Por eso el disco se vigila con alerta temprana, y la retención se ajusta con margen."},
 {t:"escribe", p:"¿Qué valor debe llevar un evento para borrar una clave en un topic compactado?",
  sol:["null","nulo","vacio"],
  pista:"Es el valor que actúa como lápida.",
  why:"Clave con valor <code>null</code>: es la única forma de decir «esta clave ya no existe»."}
]},

/* =============== U5 L3 =============== */
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
 {t:"info", eti:"Las alertas que de verdad sirven", h:"Cuatro y no veinte",
  c:`<ul><li><b>Lag por grupo</b> creciendo durante X minutos: el consumidor no da abasto o está caído.</li>
     <li><b>Under-replicated partitions &gt; 0</b> sostenido: un broker va mal o está caído.</li>
     <li><b>Offline partitions &gt; 0</b>: hay datos sin servicio. Página a alguien, ya.</li>
     <li><b>Disco por encima del 75%</b>: queda tiempo para actuar, no para descubrirlo.</li></ul>
     <p>El resto son gráficas para investigar, no alarmas que despierten a nadie.</p>`},
 {t:"opcion", p:"El lag de un grupo sube en escalones cada mañana a las 9:00 y se recupera en media hora. ¿Es un problema?",
  ops:["Sí, siempre","Probablemente no: es un pico de tráfico que el grupo absorbe. La alerta debe mirar lag sostenido o creciente, no un pico","Hay que escalar ya","Falta retención"],
  ok:1, why:"Alertar sobre picos normales es la forma más rápida de que el equipo deje de mirar las alertas."},
 {t:"vf", p:"Reasignar particiones entre brokers (rebalanceo de datos) es una operación transparente y sin coste.",
  ok:false, why:"Mueve datos por la red y carga a los brokers. Se hace con límite de ancho de banda y en horas tranquilas."},
 {t:"par", p:"Empareja cada tarea de operación con su herramienta",
  pares:[["Mover particiones entre brokers","kafka-reassign-partitions.sh"],["Ver y cambiar configuración de un topic","kafka-configs.sh"],["Reiniciar los offsets de un grupo","kafka-consumer-groups.sh --reset-offsets"],["Comprobar el estado de un topic","kafka-topics.sh --describe"]],
  why:"Todas vienen con Kafka: no hace falta nada extra para operarlo."},
 {t:"escribe", p:"¿Cuál es la métrica principal que hay que vigilar en un consumidor?",
  sol:["lag","consumer lag","el lag"],
  pista:"La diferencia entre lo último escrito y lo último procesado.",
  why:"Si el lag crece sin parar, el sistema está perdiendo la carrera contra el tráfico."}
]}

]});
