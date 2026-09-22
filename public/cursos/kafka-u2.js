window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Productores y consumidores",
resumen: "Enviar eventos con claves y acks, idempotencia del productor, grupos de consumidores, rebalanceos y commits de offsets",
nivel: "Intermedio",
color: "#8e99ad",
lecciones: [

{
id:"kf2l1",
titulo:"Productores",
claves:["acks=all espera a las réplicas sincronizadas: máxima durabilidad","enable.idempotence evita duplicados por reintentos del productor","Batching y compresión (linger.ms, batch.size, lz4 o zstd) mejoran el rendimiento"],
pasos:[
 {t:"info", eti:"Escribir", h:"Configurar un productor",
  c:`<div class="termbox">// Spring Kafka
spring:
  kafka:
    bootstrap-servers: kafka:9092
    producer:
      acks: all
      properties:
        enable.idempotence: true
        linger.ms: 10
        compression.type: zstd

kafkaTemplate.send("pedidos", pedido.id().toString(), new PedidoPagado(pedido.id(), pedido.total()))
    .whenComplete((r, e) -&gt; { if (e != null) log.error("No se pudo publicar", e); });</div>`},
 {t:"par", p:"Empareja cada valor de acks con su garantía",
  pares:[["acks=0","No espera confirmación: puede perder mensajes"],["acks=1","Confirma cuando lo escribe el líder"],["acks=all","Confirma cuando lo tienen las réplicas sincronizadas"],["enable.idempotence=true","Los reintentos no crean duplicados en la partición"]],
  why:"Desde Kafka 3, acks=all e idempotencia están activados por defecto."},
 {t:"opcion", p:"¿Qué ventaja tiene <code>linger.ms: 10</code>?",
  ops:["Ninguna","El productor espera hasta 10 ms para agrupar mensajes en lotes: más rendimiento con una latencia mínima","Borra los mensajes a los 10 ms","Reintenta cada 10 ms"],
  ok:1, why:"Los lotes comprimidos reducen mucho el tráfico y la carga de los brokers."}
]},

{
id:"kf2l2",
titulo:"Consumidores y grupos",
claves:["Los consumidores de un grupo se reparten las particiones: cada partición, un consumidor","Más consumidores que particiones = consumidores ociosos","Rebalanceo al entrar o salir consumidores; el lag mide cuánto van por detrás"],
pasos:[
 {t:"info", eti:"Leer en paralelo", h:"Grupos de consumidores",
  c:`<div class="diag">topic pedidos: 6 particiones

grupo "facturacion" (3 instancias)   grupo "logistica" (2 instancias)
 instancia A: p0, p1                  instancia X: p0, p1, p2
 instancia B: p2, p3                  instancia Y: p3, p4, p5
 instancia C: p4, p5
(cada grupo lee TODOS los eventos, repartidos entre sus instancias)</div>
     <div class="termbox">@KafkaListener(topics = "pedidos", groupId = "facturacion", concurrency = "3")
void alPagar(PedidoPagado e) { facturas.emitir(e.pedidoId()); }

kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group facturacion
# PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
#     0          18230           18232          2</div>`},
 {t:"par", p:"Empareja cada situación con lo que ocurre",
  pares:[["6 particiones y 3 consumidores en un grupo","Cada consumidor lee 2 particiones"],["6 particiones y 8 consumidores en un grupo","2 consumidores quedan sin trabajo"],["Dos grupos distintos en el mismo topic","Cada grupo recibe todos los eventos"],["Un consumidor se cae","Rebalanceo: sus particiones pasan a otros"],["Lag que crece sin parar","Los consumidores no dan abasto"]],
  why:"El número de particiones marca el paralelismo máximo de un grupo."},
 {t:"opcion", p:"El lag del grupo «facturación» no para de crecer. ¿Qué harías?",
  ops:["Borrar el topic","Escalar consumidores (hasta el número de particiones), optimizar el procesado o aumentar particiones si ya están todas ocupadas","Reducir la retención","Cambiar acks"],
  ok:1, why:"El lag es la métrica más importante de un consumidor: alerta sobre ella."}
]},

{
id:"kf2l3",
titulo:"Offsets y commits",
claves:["El consumidor guarda (commit) hasta dónde ha procesado en cada partición","Commit después de procesar: al menos una vez (posibles duplicados)","Commit antes de procesar: como mucho una vez (posibles pérdidas)"],
pasos:[
 {t:"info", eti:"Dónde me quedé", h:"Commits",
  c:`<div class="diag">procesar y DESPUES hacer commit     -&gt; si cae entre medias, reprocesa: al menos una vez
hacer commit y DESPUES procesar     -&gt; si cae entre medias, se pierde: como mucho una vez
transacciones de Kafka + consumidor idempotente -&gt; efectivamente una vez</div>
     <p>Spring Kafka hace commit tras procesar correctamente cada lote (o registro) por defecto. Por eso los consumidores deben ser <b>idempotentes</b>: recibir dos veces el mismo evento no debe duplicar efectos.</p>`},
 {t:"orden", p:"Ordena el procesamiento «al menos una vez» de un evento",
  items:["El consumidor recibe un lote de eventos","Procesa cada evento (con lógica idempotente)","Hace commit de los offsets procesados","Pide el siguiente lote"],
  why:"Si cae antes del commit, al volver reprocesa: por eso la idempotencia."},
 {t:"opcion", p:"¿Cómo harías idempotente un consumidor que crea facturas?",
  ops:["No se puede","Guardar el id del evento (o del pedido) con una restricción única y saltar los ya procesados","Procesar más rápido","Usar acks=0"],
  ok:1, why:"La base de datos garantiza que el segundo intento no crea una factura duplicada."},
 {t:"vf", p:"Con commit tras procesar, un evento nunca se procesa dos veces.",
  ok:false, why:"Si el consumidor cae tras procesar y antes del commit, lo recibirá otra vez."}
]}

]});
