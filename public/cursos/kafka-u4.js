window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Maestría: diseño con eventos y entrevista",
resumen: "Decisiones de diseño con Kafka, errores típicos y simulacro de entrevista",
nivel: "Maestro",
color: "#737e92",
lecciones: [

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
  ok:1, why:"Kafka añade operación y complejidad: se justifica con volumen, varios consumidores o necesidad de releer."}
]},

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
 {t:"info", eti:"Terminado", h:"Has completado Apache Kafka",
  c:`<p>Dominas eventos y streaming, topics, particiones y offsets, réplicas, productores y consumidores, garantías de entrega, gestión de errores, el ecosistema (esquemas, Connect, Debezium, Streams) y la operación.</p>
     <p>Para consolidarlo: con Docker Compose levanta Kafka en modo KRaft, haz que tu API de Spring publique «TareaCreada» con outbox y Debezium, y crea un consumidor idempotente con reintentos y dead letter topic.</p>`}
]}

]});
