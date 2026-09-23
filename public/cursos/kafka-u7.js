window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Maestría: diseño con eventos y entrevista",
resumen: "Decisiones de diseño, un caso completo y el simulacro final",
nivel: "Maestro",
color: "#5b6880",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"kf4l1",
titulo:"Decisiones de diseño",
claves:["Elegir la clave para el orden y el reparto; el número de particiones para el paralelismo","Eventos con significado de negocio y esquema versionado","Outbox o CDC para publicar de forma fiable desde la base de datos"],
pasos:[
 {t:"par", p:"Empareja cada decisión con su criterio",
  pares:[["Clave del evento","Lo que debe ir en orden (id del pedido, de la cuenta)"],["Número de particiones","Paralelismo máximo de consumo y reparto de carga"],["Retención","Cuánto tiempo pueden necesitar releer los consumidores"],["Factor de replicación","Cuántos fallos de broker se toleran"],["Formato con esquema","Evolucionar sin romper a los consumidores"]],
  why:"Una clave con pocos valores (por ejemplo, el país) crea particiones calientes."},
 {t:"opcion", p:"El servicio guarda el pedido en PostgreSQL y después publica en Kafka. A veces se pierde el evento. ¿Solución robusta?",
  ops:["Publicar antes de guardar","Transactional outbox: guardar el evento en una tabla en la misma transacción y publicarlo con Debezium o un proceso aparte","Reintentar en un bucle infinito","Guardar en Kafka y no en la base de datos"],
  ok:1, why:"Evita tanto eventos perdidos como eventos de operaciones que no se confirmaron."},
 {t:"opcion", p:"¿Cuándo NO usarías Kafka?",
  ops:["Para desacoplar muchos servicios con alto volumen","Para una aplicación pequeña con unas pocas tareas en segundo plano, donde una cola sencilla (o la base de datos) basta","Para CDC","Para analítica en tiempo real"],
  ok:1, why:"Kafka añade operación y complejidad: se justifica con volumen, varios consumidores o necesidad de releer."},
 {t:"info", eti:"Un topic o varios", h:"La pregunta que siempre sale",
  c:`<p>¿Un topic <code>pedidos</code> con todos los tipos de evento dentro, o un topic por tipo (<code>pedidos.creado</code>, <code>pedidos.pagado</code>)?</p>
     <ul><li><b>Un topic por entidad</b> conserva el orden entre los eventos de un mismo pedido. Es lo que quieres casi siempre.</li>
     <li><b>Un topic por tipo</b> rompe ese orden: «pagado» y «enviado» van por caminos distintos y pueden llegar al revés.</li></ul>
     <p>Los tipos se distinguen con una cabecera o un campo <code>tipo</code>, y cada consumidor ignora lo que no le interesa.</p>`},
 {t:"opcion", p:"¿Qué evento está mejor diseñado?",
  ops:["{ \"pedidoId\": 1042 }","{ \"tipo\": \"PedidoPagado\", \"pedidoId\": 1042, \"total\": 45.9, \"ocurridoEn\": \"2026-09-22T10:02:11Z\", \"version\": 1 }","{ \"accion\": \"facturar\" }","{ \"datos\": \"...\" }"],
  ok:1, why:"Lleva tipo, datos suficientes para actuar sin volver a preguntar, cuándo ocurrió y versión del esquema."},
 {t:"vf", p:"Un evento debería llevar todos los datos que el consumidor necesita, aunque se repitan.",
  ok:true, why:"Si el consumidor tiene que llamar al productor para completar la información, vuelves a acoplarlos y pierdes media ventaja de los eventos."},
 {t:"escribe", p:"¿Cómo se llama el patrón de guardar el evento en la misma transacción que el dato?",
  sol:["outbox","transactional outbox","patron outbox"],
  pista:"La bandeja de salida.",
  why:"Es la respuesta que espera cualquier entrevistador cuando pregunta «¿cómo publicas sin perder eventos?»."}
]},

/* =============== U7 L2 =============== */
{
id:"kf7l2",
titulo:"Caso real: eventos de una tienda",
claves:["Se empieza por qué tiene que ir en orden y quién consume qué","Cada consumidor con su grupo, su idempotencia y su DLT","La retención se decide por el peor reproceso que quieras poder hacer"],
pasos:[
 {t:"info", eti:"El encargo", h:"Lo que hay que montar",
  c:`<p>Una tienda quiere pasar a eventos. Hay tres consumidores del ciclo de un pedido:</p>
     <ul><li><b>Facturación</b>: emite la factura cuando se paga.</li>
     <li><b>Logística</b>: prepara el envío.</li>
     <li><b>Analítica</b>: cuenta ventas por minuto y necesita poder recalcular el último mes.</li></ul>
     <p>Piensa antes de seguir: ¿cuántos topics? ¿qué clave? ¿cuánta retención?</p>`},
 {t:"par", p:"Empareja cada decisión con su motivo",
  pares:[["Un topic «pedidos» con todos los eventos del pedido","Conservar el orden entre creado, pagado y enviado"],["Clave = id del pedido","Que ese orden se mantenga en la misma partición"],["Un grupo por consumidor","Que cada uno lleve su propia posición"],["Retención de 30 días","Que analítica pueda recalcular el último mes"],["12 particiones","Poder llegar a 12 instancias por grupo"]],
  why:"Cinco decisiones y cada una responde a una necesidad concreta del enunciado."},
 {t:"opcion", p:"Facturación falla y queda parada 6 horas. ¿Qué pasa con logística y analítica?",
  ops:["También se paran","Siguen perfectamente: cada grupo lleva su propio offset y no dependen entre sí","Se pierden eventos","Kafka para el topic"],
  ok:1, why:"Ese aislamiento entre consumidores es la razón principal para elegir Kafka frente a llamadas directas."},
 {t:"opcion", p:"Analítica necesita recalcular el mes tras corregir una fórmula. ¿Cómo lo haces?",
  ops:["Pedir los datos a la base","Reiniciar los offsets de su grupo a hace 30 días y dejar que reprocese, sin tocar a los otros consumidores","Republicar los eventos","No se puede"],
  ok:1, why:"Y aquí es donde la retención de 30 días deja de ser un número arbitrario."},
 {t:"vf", p:"Cada consumidor necesita su propio dead letter topic.",
  ok:true, why:"Lo que envenena a facturación no tiene por qué afectar a logística: el veneno es de quien procesa, no del evento."},
 {t:"opcion", p:"Facturación recibe dos veces «PedidoPagado» del pedido 1042. ¿Qué debe ocurrir?",
  ops:["Dos facturas","Una sola: la creación de la factura lleva el id del pedido con restricción única","Un error visible al cliente","Que Kafka lo evite"],
  ok:1, why:"«Al menos una vez» más idempotencia. Es la combinación que sostiene la mayoría de los sistemas de eventos del mundo."},
 {t:"info", eti:"Y el remate", h:"Cómo publica la tienda sus eventos",
  c:`<p>El servicio de pedidos guarda en PostgreSQL y escribe el evento en su tabla <code>outbox</code> <b>en la misma transacción</b>. Debezium lee el registro de transacciones y publica en el topic.</p>
     <p>Resultado: no existe ningún pedido confirmado sin su evento, ni ningún evento de un pedido que no se llegó a guardar. Y el servicio de pedidos no depende de que Kafka esté vivo para poder vender.</p>`}
]},

/* =============== U7 L3 =============== */
{
id:"kf4l2",
titulo:"Simulacro de entrevista de Kafka",
claves:["Sabes explicar topics, particiones, offsets y grupos","Conoces las garantías de entrega y cómo lograr idempotencia","Sabes operar y diagnosticar un clúster"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Cómo garantiza Kafka el orden?»",
  ops:["En todo el topic","Solo dentro de cada partición; se usa una clave para que los eventos relacionados vayan a la misma partición","No garantiza nada","Por la hora del evento"],
  ok:1, why:"Menciona que aumentar particiones cambia el reparto de claves."},
 {t:"opcion", p:"«¿Qué garantías de entrega existen y cuál usarías?»",
  ops:["Solo exactly once","At most once, at least once y exactly once; normalmente at least once con consumidores idempotentes, y transacciones de Kafka cuando todo el flujo está dentro de Kafka","Ninguna","Solo at most once"],
  ok:1, why:"Exactly once de extremo a extremo con sistemas externos requiere idempotencia."},
 {t:"opcion", p:"«Tienes 12 particiones y 20 instancias del consumidor en el mismo grupo. ¿Qué pasa?»",
  ops:["Todas trabajan","12 reciben particiones y 8 quedan ociosas (útiles solo como reserva)","Kafka crea más particiones","Error"],
  ok:1, why:"El paralelismo máximo de un grupo es el número de particiones."},
 {t:"opcion", p:"«¿Qué es el consumer lag y qué harías si crece?»",
  ops:["La latencia de red","La diferencia entre el último offset del topic y el procesado por el grupo; revisar errores y lentitud, escalar consumidores hasta el número de particiones u optimizar el procesado","El tamaño del mensaje","Un error de configuración"],
  ok:1, why:"Es la métrica número uno para alertar."},
 {t:"opcion", p:"«¿Kafka o RabbitMQ?»",
  ops:["Kafka siempre","Kafka si necesitas releer, varios consumidores independientes y mucho volumen; RabbitMQ si necesitas enrutado complejo, prioridades y una bandeja de tareas clásica","RabbitMQ siempre","Son lo mismo"],
  ok:1, why:"Responder «depende» y explicar de qué depende es exactamente lo que buscan."},
 {t:"opcion", p:"«Un consumidor se queda atascado en un mensaje que siempre falla. ¿Qué haces?»",
  ops:["Borrar el topic","Distinguir si el error es pasajero o permanente, reintentar con espera los pasajeros y mandar los permanentes a un dead letter topic con alerta","Saltarlo a mano cada vez","Reiniciar Kafka"],
  ok:1, why:"Y explicar por qué sin DLT se bloquea toda la partición suma muchos puntos."},
 {t:"info", eti:"Terminado", h:"Has completado Apache Kafka",
  c:`<p>Dominas eventos y streaming, topics, particiones y offsets, réplicas y durabilidad, productores con sus garantías y ajustes, consumidores, grupos y rebalanceos, gestión de errores, transacciones e idempotencia, el patrón outbox, el ecosistema (esquemas, Connect, Debezium, Streams), retención y compactación, seguridad y los incidentes típicos.</p>
     <p>Para consolidarlo: con Docker Compose levanta Kafka en modo KRaft, haz que tu API de Spring publique «TareaCreada» con outbox y Debezium, y crea un consumidor idempotente con reintentos y dead letter topic.</p>`}
]}

]});
