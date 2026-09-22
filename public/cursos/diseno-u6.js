window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Fiabilidad y operación",
resumen: "Eliminar puntos únicos de fallo, tiempos de espera y reintentos, degradación controlada, SLOs y observabilidad",
nivel: "Experto",
color: "#cf9150",
lecciones: [

{
id:"ds6l1",
titulo:"Diseñar para fallar",
claves:["Todo falla: redundancia en cada capa y sin puntos únicos de fallo","Timeouts, reintentos con espera y circuit breakers entre servicios","Degradación controlada: funcionar peor antes que no funcionar"],
pasos:[
 {t:"info", eti:"Resiliencia", h:"Principios",
  c:`<ul><li><b>Redundancia</b>: varias réplicas, varias zonas, base de datos con réplica y failover.</li>
     <li><b>Timeouts</b> en toda llamada remota; <b>reintentos</b> con espera exponencial y jitter solo en operaciones idempotentes.</li>
     <li><b>Circuit breaker</b>: dejar de llamar a una dependencia caída.</li>
     <li><b>Bulkheads</b>: aislar recursos para que un fallo no los agote todos.</li>
     <li><b>Degradación</b>: si el servicio de recomendaciones cae, mostrar los productos más vendidos en vez de un error.</li></ul>`},
 {t:"par", p:"Empareja cada técnica con el fallo que contiene",
  pares:[["Varias réplicas en varias zonas","Caída de una máquina o de una zona"],["Timeout","Una dependencia que no responde"],["Circuit breaker","Seguir castigando a un servicio caído"],["Degradación controlada","Perder toda la página por una función secundaria"],["Jitter en reintentos","Oleadas de reintentos sincronizados"]],
  why:"Los fallos en cascada son la causa de muchas caídas grandes."},
 {t:"opcion", p:"El servicio de recomendaciones tarda 30 segundos en responder y la página de producto se cuelga. ¿Qué diseño lo evita?",
  ops:["Esperar más","Timeout corto, circuit breaker y un fallback (productos populares) para que la página cargue sin recomendaciones personalizadas","Quitar las recomendaciones","Más réplicas de la página"],
  ok:1, why:"Una función secundaria no debe tumbar la principal."}
]},

{
id:"ds6l2",
titulo:"SLOs y observabilidad",
claves:["SLI mide (latencia, errores); SLO es el objetivo; el presupuesto de errores guía el ritmo de cambios","Métricas, logs y trazas para entender el sistema","Alertar por síntomas que notan los usuarios"],
pasos:[
 {t:"info", eti:"Medir la fiabilidad", h:"Del objetivo a la alerta",
  c:`<div class="diag">SLI: porcentaje de peticiones con exito y en menos de 300 ms
SLO: 99,9% en 30 dias
presupuesto de errores: 0,1% = ~43 minutos al mes
alerta: consumo rapido del presupuesto (burn rate) -&gt; avisar a guardia</div>
     <p>En el diseño también se explica cómo sabrás si funciona: métricas de latencia y errores por endpoint, trazas distribuidas entre servicios y logs estructurados con identificador de traza.</p>`},
 {t:"par", p:"Empareja cada disponibilidad con su tiempo de caída anual aproximado",
  pares:[["99%","~3,65 días"],["99,9%","~8,8 horas"],["99,99%","~53 minutos"],["99,999%","~5 minutos"]],
  why:"Cada nueve extra cuesta mucho más: se elige según el negocio."},
 {t:"opcion", p:"En un diseño, ¿qué deberías alertar para despertar a alguien por la noche?",
  ops:["CPU al 80%","Síntomas para el usuario: tasa de errores o latencia que consumen rápido el presupuesto del SLO","Cada error en los logs","Uso de disco al 50%"],
  ok:1, why:"Las causas (CPU, disco) van a paneles o avisos no urgentes."}
]}

]});
