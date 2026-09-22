window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Consistencia y comunicación",
resumen: "El teorema CAP, consistencia eventual e idempotencia, REST, gRPC y mensajería, y limitación de peticiones",
nivel: "Avanzado",
color: "#cf9150",
lecciones: [

{
id:"ds5l1",
titulo:"CAP, consistencia e idempotencia",
claves:["CAP: ante una partición de red, elegir entre consistencia y disponibilidad","Consistencia fuerte frente a eventual; se elige por cada tipo de dato","Idempotencia: repetir una operación no cambia el resultado (claves de idempotencia)"],
pasos:[
 {t:"info", eti:"Compromisos", h:"CAP en la práctica",
  c:`<p>En un sistema distribuido, la red puede partirse (P). Cuando ocurre, hay que elegir:</p>
     <ul><li><b>Consistencia (C)</b>: rechazar operaciones antes que dar datos incorrectos. Saldo bancario, stock de la última unidad.</li>
     <li><b>Disponibilidad (A)</b>: responder siempre, aunque el dato pueda estar algo desfasado. Número de «me gusta», feed.</li></ul>
     <p><b>PACELC</b> lo amplía: incluso sin particiones, hay un compromiso entre <b>latencia</b> y consistencia.</p>`},
 {t:"par", p:"Empareja cada dato con el tipo de consistencia razonable",
  pares:[["Saldo de una cuenta","Fuerte: nunca mostrar dinero que no existe"],["Contador de visualizaciones","Eventual: unos segundos de retraso no importan"],["Stock en el momento de pagar","Fuerte: no vender la misma unidad dos veces"],["Feed de publicaciones de amigos","Eventual: un post puede tardar en aparecer"],["Perfil del usuario tras editarlo (él mismo)","Leer tus propias escrituras"]],
  why:"No todo el sistema necesita el mismo nivel: se decide dato a dato."},
 {t:"info", eti:"Repetir sin miedo", h:"Idempotencia",
  c:`<div class="termbox">POST /api/pagos
Idempotency-Key: 7f3c2a9e-...        # generada por el cliente para esta operacion

servidor: si ya proceso esa clave, devuelve el mismo resultado sin cobrar otra vez</div>
     <p>En sistemas distribuidos los reintentos son inevitables (timeouts, entregas «al menos una vez»). Las operaciones deben poder repetirse sin efectos duplicados.</p>`},
 {t:"opcion", p:"El cliente envía un pago, hay un timeout y lo reintenta. ¿Cómo evitas cobrar dos veces?",
  ops:["No reintentar nunca","Clave de idempotencia: el servidor recuerda las claves procesadas y devuelve el resultado original","Pedir al usuario que no pulse dos veces","Sumar los cobros y devolver la diferencia"],
  ok:1, why:"Stripe y la mayoría de pasarelas funcionan así."}
]},

{
id:"ds5l2",
titulo:"Comunicación entre servicios",
claves:["Síncrona (REST, gRPC) cuando se necesita la respuesta ya; asíncrona (colas, eventos) para desacoplar","Pub/sub para que muchos consumidores reaccionen a un evento","Limitar peticiones (rate limiting) protege el sistema: token bucket"],
pasos:[
 {t:"info", eti:"Hablar", h:"Opciones",
  c:`<div class="diag">REST/JSON       sencillo, universal, ideal para APIs publicas
gRPC            binario sobre HTTP/2, contratos tipados, rapido entre servicios
GraphQL         el cliente pide exactamente los campos que necesita
Cola (SQS)      trabajo a procesar por un consumidor
Pub/sub (Kafka) eventos que consumen muchos servicios, con historial
WebSocket       canal bidireccional en tiempo real con el cliente</div>`},
 {t:"par", p:"Empareja cada necesidad con el tipo de comunicación",
  pares:[["El frontend pide los datos del perfil","REST o GraphQL síncrono"],["Enviar un correo tras registrarse","Cola asíncrona"],["Varios servicios reaccionan a «pedido pagado»","Pub/sub de eventos"],["Llamadas internas de baja latencia con contrato estricto","gRPC"],["Notificaciones en vivo al navegador","WebSocket o SSE"]],
  why:"Lo asíncrono desacopla y absorbe picos; lo síncrono es más simple de razonar."},
 {t:"info", eti:"Protegerse", h:"Rate limiting",
  c:`<p><b>Token bucket</b>: cada usuario tiene un cubo con N fichas que se rellena a un ritmo fijo; cada petición gasta una; sin fichas, <b>429 Too Many Requests</b>. Permite ráfagas cortas y limita la media. Se implementa en el API Gateway o con contadores en Redis.</p>`},
 {t:"opcion", p:"¿Por qué implementar el límite de peticiones con Redis y no en la memoria de cada réplica?",
  ops:["Por velocidad","Con varias réplicas, cada una vería solo una parte de las peticiones de un usuario; Redis da un contador compartido","Porque Redis es obligatorio","No hay diferencia"],
  ok:1, why:"Estado compartido para una decisión global."}
]}

]});
