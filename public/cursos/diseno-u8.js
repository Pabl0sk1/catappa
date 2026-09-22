window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Maestría: la entrevista de diseño",
resumen: "Un guion para los 45 minutos de una entrevista de diseño de sistemas y un simulacro final",
nivel: "Maestro",
color: "#b87b36",
lecciones: [

{
id:"ds8l1",
titulo:"El guion de la entrevista",
claves:["Requisitos y estimaciones, API y datos, diseño de alto nivel, profundizar, y cuellos de botella","Hablar de compromisos en cada decisión","Gestionar el tiempo: no perderse en detalles al principio"],
pasos:[
 {t:"orden", p:"Ordena las fases de una entrevista de diseño de sistemas",
  items:["Aclarar requisitos funcionales y no funcionales","Estimar la escala (peticiones por segundo, datos)","Definir la API y el modelo de datos","Dibujar el diseño de alto nivel","Profundizar en uno o dos componentes críticos","Identificar cuellos de botella, fallos y mejoras"],
  why:"Unos 5, 5, 5, 10, 15 y 5 minutos de una entrevista de 45."},
 {t:"par", p:"Empareja cada frase con la fase en la que la dirías",
  pares:[["«¿Cuántos usuarios activos diarios esperamos?»","Requisitos y estimación"],["«POST /enlaces devuelve el código creado»","API"],["«El balanceador reparte entre réplicas sin estado»","Alto nivel"],["«Veamos cómo generar identificadores únicos sin coordinación»","Profundizar"],["«Si Redis cae, las redirecciones irían todas a la base de datos...»","Cuellos de botella y fallos"]],
  why:"Guiar la conversación con estructura transmite seniority."},
 {t:"opcion", p:"El entrevistador pregunta «¿por qué Cassandra y no PostgreSQL?». ¿Qué tipo de respuesta buscan?",
  ops:["«Porque es más moderna»","El compromiso: escrituras masivas particionadas por conversación y escala horizontal, a cambio de consultas menos flexibles y consistencia ajustable","«Porque lo usa Facebook»","«No lo sé, cualquiera vale»"],
  ok:1, why:"Cada elección con su ventaja y su precio."}
]},

{
id:"ds8l2",
titulo:"Simulacro de diseño de sistemas",
claves:["Sabes aplicar caché, réplicas, particionado, colas y CDN según el problema","Razonas sobre consistencia, disponibilidad y coste","Estás preparado para la ronda de diseño de una entrevista"],
pasos:[
 {t:"info", eti:"Último paso", h:"Decisiones mezcladas",
  c:`<p>Para cada situación, piensa en el cuello de botella antes de elegir.</p>`},
 {t:"opcion", p:"«La base de datos está saturada de lecturas repetidas de los mismos productos.»",
  ops:["Particionar escrituras","Caché cache-aside en Redis con TTL e invalidación al actualizar, y réplicas de lectura","Más CPU en el servidor web","Quitar índices"],
  ok:1, why:"Lecturas repetidas = caché primero."},
 {t:"opcion", p:"«Generar miniaturas de fotos hace que la subida tarde 8 segundos.»",
  ops:["Servidor más grande","Guardar el original en S3, responder enseguida y generar las miniaturas de forma asíncrona con una cola y workers","Comprimir en el navegador y ya","Quitar las miniaturas"],
  ok:1, why:"Sacar el trabajo lento del camino de la petición."},
 {t:"opcion", p:"«Una sola base de datos ya no admite el volumen de escrituras de eventos.»",
  ops:["Réplicas de lectura","Particionar por una clave que reparta bien (o un almacén diseñado para escrituras masivas) y agrupar escrituras","Más caché","Un índice más"],
  ok:1, why:"Las réplicas no ayudan a escribir: todas las escrituras van al primario."},
 {t:"opcion", p:"«Los usuarios de Asia tienen 300 ms más de latencia que los de Europa.»",
  ops:["Más réplicas en Europa","CDN para el contenido estático y cacheable y, si hace falta, despliegue en una región de Asia con datos replicados","Comprimir el JSON","Nada que hacer"],
  ok:1, why:"La distancia física solo se vence acercando los datos."},
 {t:"opcion", p:"«Si cae la región principal, el servicio debe volver en 15 minutos perdiendo como mucho 1 minuto de datos.»",
  ops:["Backups diarios","Réplica asíncrona continua en otra región (RPO ~1 min), infraestructura como código y failover de DNS con health checks, probado periódicamente (RTO 15 min)","Un servidor más grande","Multi-AZ en la misma región"],
  ok:1, why:"Traducir RPO y RTO a una estrategia concreta es lo que se evalúa."},
 {t:"info", eti:"Terminado", h:"Has completado Diseño de sistemas",
  c:`<p>Dominas requisitos y estimaciones, escalado horizontal, cachés, datos a escala, consistencia, comunicación entre servicios, fiabilidad, observabilidad y los casos clásicos de entrevista.</p>
     <p>Para consolidarlo: practica en voz alta con los casos de «System Design Primer» (GitHub) o del libro de Alex Xu, dibujando en una pizarra o en excalidraw, con un temporizador de 45 minutos.</p>`}
]}

]});
