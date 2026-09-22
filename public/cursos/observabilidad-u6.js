window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Maestría: investigar incidentes con datos",
resumen: "Del síntoma a la causa usando métricas, trazas y logs, y simulacro de entrevista de observabilidad",
nivel: "Maestro",
color: "#c24a4a",
lecciones: [

{
id:"ob6l1",
titulo:"Del síntoma a la causa",
claves:["Empieza por los síntomas (RED) y acota: qué endpoint, desde cuándo, qué cambió","Salta de la métrica a una traza de ejemplo y de la traza a sus logs","Correlación con despliegues, cambios de configuración y dependencias"],
pasos:[
 {t:"orden", p:"Ordena la investigación de «la API va lenta desde las 10:05»",
  items:["Confirmar el síntoma en el panel: p99 de latencia y errores","Acotar: qué endpoints, qué réplicas, qué clientes","Buscar qué cambió a las 10:05 (despliegue, configuración, tráfico)","Abrir trazas lentas de ejemplo y ver qué span consume el tiempo","Leer los logs de ese servicio en esa traza","Mitigar (rollback) y después corregir la causa"],
  why:"Los exemplars de Prometheus enlazan un punto de la gráfica con una traza concreta."},
 {t:"opcion", p:"La latencia subió justo tras un despliegue y las trazas muestran un span de base de datos de 2 s que antes tardaba 5 ms. ¿Qué haces primero?",
  ops:["Reiniciar la base de datos","Hacer rollback para mitigar y después revisar la consulta nueva (plan de ejecución, índice que falta o N+1)","Subir el tamaño de las máquinas","Esperar"],
  ok:1, why:"Mitigar primero, causa raíz después."},
 {t:"par", p:"Empareja cada pregunta con la señal que mejor la responde",
  pares:[["¿Cuántos usuarios están afectados?","Métricas de errores y latencia"],["¿En qué servicio se va el tiempo?","Trazas"],["¿Qué error exacto dio este pedido?","Logs con el traceId"],["¿Qué función consume la CPU?","Perfiles (profiling continuo)"],["¿Coincide con un cambio?","Anotaciones de despliegue"]],
  why:"Las tres señales conectadas por el traceId son la clave."}
]},

{
id:"ob6l2",
titulo:"Simulacro de entrevista de observabilidad",
claves:["Sabes qué medir y cómo (RED, USE, percentiles)","Dominas Prometheus, PromQL, Grafana, Loki y OpenTelemetry","Diseñas alertas por SLO y sabes investigar incidentes"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Qué diferencia hay entre monitorización y observabilidad?»",
  ops:["Ninguna","Monitorizar es vigilar lo conocido con paneles y alertas; observabilidad es poder investigar preguntas nuevas combinando métricas, logs y trazas","Observabilidad es solo logs","Monitorizar es más moderno"],
  ok:1, why:"Añade un ejemplo de pregunta imprevista."},
 {t:"opcion", p:"«¿Qué métricas pondrías a una API nueva?»",
  ops:["Solo CPU","RED por endpoint (tasa, errores, latencia en percentiles con histogramas), saturación del pool de conexiones e hilos, y métricas de negocio como pedidos creados","Número de líneas de código","Ninguna"],
  ok:1, why:"Con Spring Boot, Actuator y Micrometer dan casi todas gratis."},
 {t:"opcion", p:"«¿Qué es la cardinalidad y por qué importa?»",
  ops:["El número de servidores","El número de combinaciones distintas de etiquetas (series); si crece sin límite, dispara la memoria y el coste del sistema de métricas","El tamaño de los logs","La latencia"],
  ok:1, why:"El ejemplo clásico: poner el id de usuario como etiqueta."},
 {t:"opcion", p:"«¿Cómo diseñarías las alertas de un servicio?»",
  ops:["Una alerta por cada métrica","Definir SLOs, alertar por burn rate en varias ventanas, que cada alerta sea accionable y tenga runbook, y dejar las causas en paneles o avisos no urgentes","Alertar por CPU","Sin alertas"],
  ok:1, why:"Es la respuesta de alguien que ha hecho guardias."},
 {t:"info", eti:"Terminado", h:"Has completado Observabilidad",
  c:`<p>Dominas qué medir, Prometheus y PromQL, Grafana, logs estructurados con Loki, trazas con OpenTelemetry, alertas por SLO y la investigación de incidentes con datos.</p>
     <p>Para consolidarlo: levanta con Docker Compose tu API de tareas, Prometheus, Grafana, Loki y Tempo con el Collector de OpenTelemetry; crea un panel RED, una alerta por burn rate y provoca un fallo para investigarlo de la métrica a la traza y al log.</p>`}
]}

]});
