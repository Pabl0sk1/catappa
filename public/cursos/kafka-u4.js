window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Garantías y errores",
resumen: "Mensajes veneno, reintentos y dead letter topics, transacciones y cómo conseguir «exactamente una vez» de verdad",
nivel: "Avanzado",
color: "#7b889e",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"kf3l1",
titulo:"Errores, reintentos y dead letter topics",
claves:["Un evento que falla siempre (veneno) no debe bloquear la partición","Reintentos con espera y, si se agotan, enviar a un dead letter topic","Un DLT sin alertas es un cementerio de eventos que nadie mira"],
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
  ok:1, why:"De ahí el nombre de «mensaje veneno»."},
 {t:"info", eti:"Qué se reintenta y qué no", h:"Dos familias de error",
  c:`<ul><li><b>Pasajeros</b>: la base de datos no responde, un servicio devuelve 503, se acabó el tiempo de espera. Reintentar tiene todo el sentido, con espera creciente.</li>
     <li><b>Permanentes</b>: el JSON no se puede leer, falta un campo obligatorio, el id no existe. Reintentar mil veces dará mil veces el mismo error.</li></ul>
     <p>Distinguirlos es lo que separa un consumidor robusto de uno que se atasca. En Spring Kafka se declara con <code>addNotRetryableExceptions</code>.</p>`},
 {t:"opcion", p:"¿Qué haces con los eventos que acaban en el dead letter topic?",
  ops:["Borrarlos","Alertar, mirarlos, arreglar la causa y reprocesarlos (a menudo con una herramienta que los reenvía al topic original)","Dejarlos ahí","Reintentarlos automáticamente para siempre"],
  ok:1, why:"El DLT es una bandeja de entrada para humanos, no un cubo de basura."},
 {t:"vf", p:"Reintentar dentro del consumidor bloquea esa partición mientras dura la espera.",
  ok:true, why:"Por eso los reintentos largos se hacen con topics de reintento aparte (pedidos.retry.5m) y no parando la partición principal."},
 {t:"escribe", p:"¿Cómo se suele llamar al topic donde se apartan los eventos que fallan siempre? (tres letras)",
  sol:["DLT","dlt"],
  pista:"Dead Letter Topic.",
  why:"En otros sistemas se llama DLQ (dead letter queue): misma idea."}
]},

/* =============== U4 L2 =============== */
{
id:"kf6l1",
titulo:"Exactamente una vez: qué es y qué no",
claves:["Kafka ofrece exactly once dentro de Kafka: leer, procesar y escribir en una transacción","Con sistemas externos no hay magia: hace falta idempotencia","La mayoría de sistemas viven bien con «al menos una vez» + consumidor idempotente"],
pasos:[
 {t:"info", eti:"El tema estrella", h:"Transacciones de Kafka",
  c:`<div class="termbox">// leer de un topic, procesar y escribir en otro: todo o nada
producer.initTransactions();
producer.beginTransaction();
  producer.send(new ProducerRecord&lt;&gt;("facturas", clave, factura));
  producer.sendOffsetsToTransaction(offsets, "grupo-facturacion");
producer.commitTransaction();

// el consumidor de "facturas" debe leer solo lo confirmado:
isolation.level=read_committed</div>
     <p>Fíjate en <code>sendOffsetsToTransaction</code>: el avance del consumidor forma parte de la misma transacción que la escritura. O se confirman las dos cosas, o ninguna.</p>`},
 {t:"opcion", p:"Tu consumidor lee de Kafka y escribe en PostgreSQL. ¿Te sirven las transacciones de Kafka?",
  ops:["Sí, es lo mismo","No: la transacción de Kafka no abarca PostgreSQL. Ahí la solución es que la escritura sea idempotente (clave única del evento)","Sí, con acks=all","Solo con Debezium"],
  ok:1, why:"Es la pregunta trampa de las entrevistas: exactly once es <b>dentro</b> de Kafka."},
 {t:"par", p:"Empareja cada garantía con cómo se consigue",
  pares:[["Como mucho una vez","Confirmar el offset antes de procesar"],["Al menos una vez","Confirmar después de procesar"],["Exactamente una vez (dentro de Kafka)","Transacciones con sendOffsetsToTransaction"],["Efecto único con sistemas externos","Consumidor idempotente con clave única"]],
  why:"Las tres primeras son configuración; la cuarta es diseño."},
 {t:"vf", p:"Las transacciones de Kafka no tienen coste.",
  ok:false, why:"Añaden latencia y marcadores en los topics, y obligan a los consumidores a leer en <code>read_committed</code>. Se usan cuando hacen falta, no por defecto."},
 {t:"info", eti:"La respuesta práctica", h:"Al menos una vez, y que dé igual",
  c:`<p>En la mayoría de sistemas reales, la combinación ganadora es:</p>
     <ul><li><b>Productor idempotente</b> (por defecto en Kafka 3+): los reintentos no duplican.</li>
     <li><b>Consumidor que confirma después de procesar</b>: al menos una vez.</li>
     <li><b>Efecto idempotente</b>: guardar el <code>eventId</code> con restricción única, o usar <code>upsert</code> por clave de negocio.</li></ul>
     <p>Con eso, un evento repetido no hace daño, y no pagas el coste de las transacciones.</p>`},
 {t:"opcion", p:"El evento «PedidoPagado» llega dos veces. ¿Qué diseño hace que no pase nada?",
  ops:["Ignorar el segundo con un if en memoria","Que la operación sea idempotente: INSERT con clave única del evento, o UPDATE que fija el estado a «pagado» en vez de sumar","Reintentar","Pedir a Kafka que no duplique"],
  ok:1, why:"Fija un estado, no sumes. «Sumar 10 €» dos veces duele; «poner el estado en pagado» dos veces, no."},
 {t:"escribe", p:"¿Qué nivel de aislamiento debe usar un consumidor para no leer mensajes de transacciones sin confirmar?",
  sol:["read_committed","read committed"],
  pista:"Suena igual que en las bases de datos.",
  why:"Con <code>read_uncommitted</code> (el valor por defecto) verías mensajes que después pueden quedar abortados."}
]},

/* =============== U4 L3 =============== */
{
id:"kf6l2",
titulo:"El patrón outbox: publicar sin perder nada",
claves:["Guardar en la base y publicar en Kafka no es atómico: uno de los dos puede fallar","El outbox guarda el evento en la misma transacción que el dato","Un proceso aparte (o Debezium) lee la tabla y publica"],
pasos:[
 {t:"info", eti:"El problema", h:"Dos sistemas, una operación",
  c:`<div class="termbox">// MAL: dos operaciones que pueden fallar por separado
tx { pedidos.guardar(pedido); }
kafka.send("pedidos", evento);     // si falla aqui, el pedido existe y nadie se entera

// tambien MAL al reves:
kafka.send("pedidos", evento);
tx { pedidos.guardar(pedido); }    // si falla aqui, hay un evento de algo que no existe</div>
     <p>No hay orden bueno: el problema es que son dos sistemas distintos y no hay transacción común.</p>`},
 {t:"info", eti:"La solución", h:"Outbox",
  c:`<div class="termbox">-- una sola transaccion en la base de datos
BEGIN;
  INSERT INTO pedidos (...) VALUES (...);
  INSERT INTO outbox (id, tipo, carga, creado_en)
       VALUES (gen_random_uuid(), 'PedidoPagado', '{"pedidoId":1042}', now());
COMMIT;</div>
     <div class="dg">
       <div class="dg-flujo">
         <div class="dg-caja acento">transacción en la BD</div>
         <div class="dg-caja">tabla outbox</div>
         <div class="dg-caja">Debezium lee el WAL</div>
         <div class="dg-caja ok">topic de Kafka</div>
       </div>
       <div class="dg-nota">el evento se publica si y solo si la transacción se confirmó</div>
     </div>`},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["Tabla outbox","Guardar el evento en la misma transacción que el dato"],["Debezium","Leer los cambios del WAL y publicarlos en Kafka"],["Clave del evento","Mantener el orden por entidad al publicar"],["Borrado o marcado del outbox","Que la tabla no crezca sin fin"]],
  why:"También se puede publicar con un proceso propio que lea la tabla cada pocos segundos: más simple, algo más de latencia."},
 {t:"opcion", p:"¿Qué garantiza el outbox que no garantiza publicar directamente?",
  ops:["Que el evento llegue antes","Que no existan eventos de operaciones que no se confirmaron, ni operaciones confirmadas sin su evento","Que no haya duplicados","Menos latencia"],
  ok:1, why:"Duplicados sí puede haber (el publicador puede reintentar): por eso el consumidor sigue siendo idempotente."},
 {t:"vf", p:"Con outbox, el consumidor ya no necesita ser idempotente.",
  ok:false, why:"Sigue siendo «al menos una vez»: si el publicador cae tras enviar y antes de marcar la fila, reenviará."},
 {t:"opcion", p:"¿Qué es CDC (captura de cambios)?",
  ops:["Un formato de datos","Leer el registro de transacciones de la base de datos y convertir cada cambio en un evento, sin tocar la aplicación","Un tipo de topic","Una copia de seguridad"],
  ok:1, why:"Es lo que hace Debezium, y sirve tanto para el outbox como para replicar datos a otros sistemas."},
 {t:"escribe", p:"¿Cómo se llama la tabla donde se guardan los eventos pendientes de publicar?",
  sol:["outbox","tabla outbox"],
  pista:"«Bandeja de salida», en inglés.",
  why:"Y su pareja, para eventos entrantes ya procesados, se llama inbox: sirve justo para la idempotencia del consumidor."}
]}

]});
