window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Mensajería y asincronía",
resumen: "Comunicación síncrona y asíncrona, colas frente a registros de eventos, garantías de entrega, idempotencia, sagas y el patrón outbox",
nivel: "Avanzado",
color: "#cf9150",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"ds5l2",
titulo:"Comunicación entre servicios",
claves:["Síncrona (REST, gRPC) cuando se necesita la respuesta ya; asíncrona (colas, eventos) para desacoplar","Las cadenas síncronas multiplican los fallos: la disponibilidad total es el producto","Pub/sub para que muchos consumidores reaccionen a un evento"],
pasos:[
 {t:"info", eti:"Hablar", h:"Opciones",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">formas de comunicar servicios</div>
<table class="dg-tabla"><thead><tr><th>estilo</th><th>para qué</th></tr></thead><tbody>
<tr><td>REST/JSON</td><td>sencillo, universal, ideal para APIs públicas</td></tr>
<tr><td>gRPC</td><td>binario sobre HTTP/2, contratos tipados, rápido entre servicios</td></tr>
<tr><td>GraphQL</td><td>el cliente pide exactamente los campos que necesita</td></tr>
<tr><td>Cola (SQS, RabbitMQ)</td><td>trabajo a procesar por un consumidor</td></tr>
<tr><td>Pub/sub y registro de eventos (Kafka)</td><td>eventos que consumen muchos servicios, con historial</td></tr>
<tr><td>WebSocket, SSE</td><td>empujar datos en tiempo real al cliente</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Acoplamiento", h:"El precio de encadenar llamadas",
  c:`<div class="dg"><div class="dg-tit">cadena síncrona</div>
<div class="dg-flujo"><div class="dg-caja acento">pedidos<small>99,9%</small></div><div class="dg-caja">stock<small>99,9%</small></div><div class="dg-caja">pagos<small>99,9%</small></div><div class="dg-caja">envíos<small>99,9%</small></div><div class="dg-caja">correo<small>99,9%</small></div></div>
<div class="dg-nota arriba">0,999^5 ≈ 99,5%: unas 3,6 horas de caída al mes en vez de 43 minutos</div></div>
     <p>En una cadena síncrona, si cualquiera cae, cae la petición, y la latencia es la suma. Además hay <b>acoplamiento temporal</b>: todos deben estar vivos a la vez.</p>
     <p>Con mensajería, pedidos confirma en cuanto guarda el pedido y publica <code>PedidoCreado</code>; envíos y correo lo procesan cuando pueden. Se gana resiliencia y absorción de picos a cambio de <b>consistencia eventual</b> y de un sistema más difícil de depurar (trazas distribuidas, colas que crecen en silencio).</p>`},
 {t:"par", p:"Empareja cada necesidad con el tipo de comunicación",
  pares:[["El frontend pide los datos del perfil","REST o GraphQL síncrono"],["Enviar un correo tras registrarse","Cola asíncrona"],["Varios servicios reaccionan a «pedido pagado»","Pub/sub de eventos"],["Llamadas internas de baja latencia con contrato estricto","gRPC"],["Notificaciones en vivo al navegador","WebSocket o SSE"]],
  why:"Lo asíncrono desacopla y absorbe picos; lo síncrono es más simple de razonar."},
 {t:"opcion", p:"Al confirmar un pedido, el servicio llama por REST a facturación, correo, puntos de fidelidad y analítica. Si correo cae, no se pueden hacer pedidos. ¿Qué cambiarías?",
  ops:["Subir los timeouts","Guardar el pedido y publicar un evento; cada servicio secundario lo consume por su cuenta","Quitar el correo","Más réplicas de pedidos"],
  ok:1, why:"Lo que no hace falta para responder al usuario sale del camino síncrono. Solo el cobro, si debe ser inmediato, se queda en la llamada."},
 {t:"vf", p:"Pasar de llamadas síncronas a eventos elimina la necesidad de pensar en la consistencia.",
  ok:false, why:"La traslada: ahora hay ventanas en las que un servicio sabe algo que otro aún no, y hay que diseñar la interfaz y los procesos para ese retraso."},
 {t:"opcion", p:"¿Qué distingue un evento (<code>PedidoPagado</code>) de un comando (<code>EnviarCorreo</code>)?",
  ops:["Nada, son sinónimos","El evento cuenta algo que ya pasó y puede tener muchos consumidores; el comando pide a un destinatario concreto que haga algo","El comando es siempre síncrono","El evento no se puede persistir"],
  ok:1, why:"Los eventos se nombran en pasado y quien los emite no sabe (ni debe saber) quién los consume."},
 {t:"codigo", p:"Calcula la disponibilidad de una cadena de llamadas síncronas",
  lenguaje:"py",
  c:`<p>Lee en una línea las disponibilidades de cada servicio en porcentaje. La de la cadena es el producto. Imprime la disponibilidad con 3 decimales y los minutos de caída en un mes de 30 días (43.200 minutos), redondeados:</p>
<div class="termbox">disponibilidad: 99.501%
caida: 216 min/mes</div>`,
  plantilla:`disp = list(map(float, input().split()))
# calcula
`,
  pruebas:[{entrada:"99.9 99.9 99.9 99.9 99.9\n", salida:"disponibilidad: 99.501%\ncaida: 216 min/mes"},{entrada:"99.99 99.9 99.95\n", salida:"disponibilidad: 99.840%\ncaida: 69 min/mes"},{entrada:"99.5 99.5\n", salida:"disponibilidad: 99.002%\ncaida: 431 min/mes", oculta:true}],
  pista:"Multiplica x / 100 de cada una; la caída es (1 - producto) * 43200.",
  solucion:`disp = list(map(float, input().split()))
p = 1.0
for d in disp:
    p *= d / 100
print(f"disponibilidad: {p * 100:.3f}%")
print(f"caida: {round((1 - p) * 43200)} min/mes")
`,
  why:"Justifica con números por qué se reduce la profundidad de las cadenas síncronas: cada dependencia más resta disponibilidad."}
]},

/* =============== U7 L2 =============== */
{
id:"ds7n1",
titulo:"Colas y streaming",
claves:["Cola de trabajo: cada mensaje lo procesa un consumidor y desaparece; registro (Kafka): se conserva y cada grupo lo lee a su ritmo","El orden solo se garantiza dentro de una partición: la clave decide la partición","Reintentos, colas de mensajes muertos (DLQ) y contrapresión"],
pasos:[
 {t:"info", eti:"Dos modelos", h:"Cola frente a registro",
  c:`<div class="dg"><div class="dg-tit">cola de trabajo y registro de eventos</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Cola (SQS, RabbitMQ)</div>
<div class="dg-vert"><div class="dg-caja">productor</div><div class="dg-caja acento">cola</div><div class="dg-caja">un worker coge el mensaje, lo procesa y lo borra</div></div>
<div class="dg-caja ok">repartir trabajo entre workers</div>
<div class="dg-caja aviso">una vez consumido, desaparece</div></div>
<div class="dg-col"><div class="dg-col-tit">Registro (Kafka, Kinesis)</div>
<div class="dg-vert"><div class="dg-caja">productor</div><div class="dg-caja acento">topic particionado<small>se conserva días o para siempre</small></div><div class="dg-caja">cada grupo de consumidores lleva su posición (offset)</div></div>
<div class="dg-caja ok">muchos lectores, releer, orden por partición</div>
<div class="dg-caja aviso">paralelismo limitado al nº de particiones</div></div>
</div></div>
     <ul><li><b>Orden</b>: Kafka ordena dentro de cada partición. Si todos los eventos de un pedido llevan la clave <code>pedido_id</code>, llegan en orden; entre pedidos distintos no hay orden global.</li>
     <li><b>Tiempo de visibilidad</b> (SQS): el mensaje se oculta mientras un worker lo procesa; si no lo borra a tiempo, reaparece. Por eso el trabajo debe ser idempotente.</li></ul>`},
 {t:"info", eti:"Cuando algo falla", h:"Reintentos, DLQ y contrapresión",
  c:`<div class="dg"><div class="dg-tit">un mensaje que no se puede procesar</div>
<div class="dg-flujo"><div class="dg-caja">intento 1 falla</div><div class="dg-caja">reintento con espera</div><div class="dg-caja">intento N falla</div><div class="dg-caja aviso">cola de mensajes muertos (DLQ)</div><div class="dg-caja base">alerta y revisión</div></div></div>
     <ul><li>Un <b>mensaje envenenado</b> (mal formado, un bug) no debe bloquear la cola para siempre: tras N intentos va a la DLQ.</li>
     <li>La DLQ necesita alarma y un proceso para reinyectar los mensajes cuando se arregla el fallo.</li>
     <li><b>Contrapresión</b>: si los consumidores no dan abasto, la cola crece. La cola protege la base de datos (absorbe el pico), pero hay que vigilar el retraso (<i>lag</i>) y escalar consumidores o frenar a los productores.</li></ul>`},
 {t:"par", p:"Empareja cada situación con la pieza adecuada",
  pares:[["Redimensionar imágenes subidas por los usuarios","Cola de trabajo con varios workers"],["Pedidos que leen facturación, analítica y búsqueda","Topic de eventos con un grupo de consumidores por servicio"],["Reconstruir un índice leyendo el último mes de eventos","Registro con retención (releer desde un offset)"],["Mensaje que falla siempre por un bug","Cola de mensajes muertos (DLQ)"]],
  why:"Kafka no es «una cola mejor»: es un registro. Para repartir tareas sueltas, una cola sencilla suele bastar."},
 {t:"opcion", p:"Los eventos de un mismo pedido (creado, pagado, enviado) llegan desordenados a un consumidor de Kafka. ¿Causa más probable?",
  ops:["Kafka no garantiza nada","Se publican sin clave (o con clave distinta) y acaban en particiones diferentes","Hay pocos brokers","La retención es corta"],
  ok:1, why:"Usa pedido_id como clave: la misma clave va siempre a la misma partición y se conserva el orden."},
 {t:"opcion", p:"Un topic tiene 6 particiones y el grupo de consumidores tiene 10 instancias. ¿Qué pasa?",
  ops:["Las 10 consumen en paralelo","Solo 6 reciben particiones; las otras 4 quedan ociosas","Kafka crea 4 particiones más","Se duplican los mensajes"],
  ok:1, why:"Dentro de un grupo, cada partición la lee un solo consumidor. El nº de particiones fija el paralelismo máximo: se elige con margen."},
 {t:"vf", p:"Una cola que crece sin parar es siempre inofensiva, porque los mensajes no se pierden.",
  ok:false, why:"Cada mensaje llega más tarde (el usuario espera su correo horas) y, si la retención o el espacio se acaban, sí se pierden. El retraso de consumo es una métrica con alerta."},
 {t:"codigo", p:"Simula reintentos y cola de mensajes muertos",
  lenguaje:"py",
  c:`<p>Primera línea: número máximo de intentos. Después, una línea por mensaje: <code>id fallos</code>, donde <code>fallos</code> es cuántas veces falla antes de salir bien. Si sale bien dentro del máximo, imprime <code>id ok (intentos: k)</code>; si no, <code>id dlq</code>. Al final, <code>total intentos: T</code>.</p>`,
  plantilla:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
maximo = int(lineas[0][0])
total = 0
for mid, fallos in lineas[1:]:
    fallos = int(fallos)
    # decide si sale bien o va a la DLQ
print(f"total intentos: {total}")
`,
  pruebas:[{entrada:"3\nm1 0\nm2 2\nm3 5\n", salida:"m1 ok (intentos: 1)\nm2 ok (intentos: 3)\nm3 dlq\ntotal intentos: 7"},{entrada:"1\na 0\nb 1\n", salida:"a ok (intentos: 1)\nb dlq\ntotal intentos: 2"},{entrada:"5\nx 4\ny 5\nz 1\n", salida:"x ok (intentos: 5)\ny dlq\nz ok (intentos: 2)\ntotal intentos: 12", oculta:true}],
  pista:"Si fallos &lt; maximo, sale bien en el intento fallos + 1; si no, gasta los máximo intentos y va a la DLQ.",
  solucion:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
maximo = int(lineas[0][0])
total = 0
for mid, fallos in lineas[1:]:
    fallos = int(fallos)
    if fallos < maximo:
        total += fallos + 1
        print(f"{mid} ok (intentos: {fallos + 1})")
    else:
        total += maximo
        print(f"{mid} dlq")
print(f"total intentos: {total}")
`,
  why:"Cada intento fallido cuesta trabajo: con muchos mensajes envenenados y reintentos altos, los workers pasan el tiempo repitiendo lo imposible."}
]},

/* =============== U7 L3 =============== */
{
id:"ds7n2",
titulo:"Idempotencia y garantías de entrega",
claves:["Como mucho una vez, al menos una vez y «exactamente una vez» (en la práctica: al menos una vez + idempotencia)","Clave de idempotencia: el servidor recuerda las operaciones procesadas y devuelve el resultado original","Consumidor idempotente: registrar el id del mensaje en la misma transacción que su efecto"],
pasos:[
 {t:"info", eti:"Garantías", h:"Tres semánticas de entrega",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué puede pasar con un mensaje</div>
<table class="dg-tabla"><thead><tr><th>semántica</th><th>cómo</th><th>riesgo</th></tr></thead><tbody>
<tr><td>como mucho una vez</td><td>confirmar antes de procesar</td><td>perder mensajes</td></tr>
<tr><td>al menos una vez</td><td>confirmar después de procesar</td><td>duplicados si se cae entre procesar y confirmar</td></tr>
<tr><td>exactamente una vez</td><td>al menos una vez + deduplicar</td><td>la complejidad de deduplicar bien</td></tr>
</tbody></table></div>
     <p>En una red real no se puede distinguir «el otro no recibió mi mensaje» de «lo recibió y se perdió la respuesta». Por eso los reintentos son inevitables y los duplicados también: la solución es que repetir no haga daño.</p>`},
 {t:"info", eti:"Repetir sin miedo", h:"Claves de idempotencia",
  c:`<div class="termbox">POST /api/pagos
Idempotency-Key: 7f3c2a9e-4b1d-4e0a-9c55-0d2f7a1e6b10   # la genera el cliente por operación

servidor:
  1. INSERT INTO claves_idem(clave, estado) VALUES (?, 'en_curso')   -- UNIQUE
     si ya existe: devolver la respuesta guardada (o 409 si aún está en curso)
  2. cobrar
  3. UPDATE claves_idem SET estado='hecho', respuesta=? WHERE clave=?</div>
     <ul><li>Operaciones <b>naturalmente idempotentes</b>: <code>PUT</code> que fija un valor, <code>DELETE</code>, «marcar como leído». No lo son <code>INCR</code>, «añadir 10 €» o <code>POST</code> que crea.</li>
     <li><b>Consumidor idempotente</b>: tabla <code>mensajes_procesados(id)</code> con clave única, insertada <b>en la misma transacción</b> que el efecto. Si el mensaje se repite, el INSERT falla y se descarta.</li>
     <li>Las claves se guardan un tiempo acotado (Stripe, 24 horas).</li>
     <li>Kafka ofrece productor idempotente y transacciones para «exactamente una vez» <i>dentro de Kafka</i>; en cuanto el efecto sale fuera (una base de datos, un correo), vuelves a necesitar deduplicar.</li></ul>`},
 {t:"opcion", p:"El cliente envía un pago, hay un timeout y lo reintenta. ¿Cómo evitas cobrar dos veces?",
  ops:["No reintentar nunca","Clave de idempotencia: el servidor recuerda las claves procesadas y devuelve el resultado original","Pedir al usuario que no pulse dos veces","Sumar los cobros y devolver la diferencia"],
  ok:1, why:"Stripe y la mayoría de pasarelas funcionan así."},
 {t:"par", p:"Empareja cada operación con si es idempotente",
  pares:[["PUT /usuarios/7 con el perfil completo","Idempotente: repetirla deja el mismo estado"],["INCR visitas","No idempotente: cada repetición suma"],["DELETE /pedidos/9","Idempotente en el estado: la segunda vez ya no existe"],["POST /pedidos sin clave","No idempotente: crea otro pedido"],["UPDATE saldo = 100 WHERE id = 1","Idempotente: fija un valor"]],
  why:"Convertir operaciones relativas («suma 10») en absolutas con versión («fija 110 si la versión es 7») es otra forma de hacerlas repetibles."},
 {t:"opcion", p:"Tu consumidor procesa el mensaje, actualiza la base de datos y, antes de confirmar el offset, el proceso muere. ¿Qué pasa al arrancar?",
  ops:["El mensaje se pierde","El mensaje se vuelve a entregar: si el consumidor no es idempotente, el efecto se aplica dos veces","Kafka lo detecta y lo salta","La base de datos deshace el cambio"],
  ok:1, why:"Es la semántica «al menos una vez». Guardar el id del mensaje (o el offset) en la misma transacción que el efecto lo resuelve."},
 {t:"vf", p:"Guardar la clave de idempotencia en Redis y hacer el cobro en PostgreSQL, en dos pasos separados, es tan seguro como guardarla en la misma transacción que el cobro.",
  ok:false, why:"Si el proceso muere entre los dos pasos, queda una clave sin cobro o un cobro sin clave. La clave y el efecto deben confirmarse juntos (o la clave marcarse «en curso» y reconciliarse)."},
 {t:"codigo", p:"Escribe un consumidor idempotente",
  lenguaje:"py",
  c:`<p>Cada línea es un mensaje <code>id importe</code>; puede haber duplicados (mismo id). Aplica cada id una sola vez sumando su importe al saldo (empieza en 0). Imprime <code>aplicados: A</code>, <code>duplicados: D</code> y <code>saldo: S</code>.</p>`,
  plantilla:`import sys
mensajes = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
saldo = 0
# aplica cada mensaje una sola vez
`,
  pruebas:[{entrada:"m1 10\nm2 5\nm1 10\nm3 -3\n", salida:"aplicados: 3\nduplicados: 1\nsaldo: 12"},{entrada:"a 100\na 100\na 100\n", salida:"aplicados: 1\nduplicados: 2\nsaldo: 100"},{entrada:"x 1\ny 2\nz 3\ny 2\nx 1\nw 4\n", salida:"aplicados: 4\nduplicados: 2\nsaldo: 10", oculta:true}],
  pista:"Un set con los ids procesados: si el id está, cuenta un duplicado; si no, añádelo y suma.",
  solucion:`import sys
mensajes = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
saldo = 0
vistos = set()
duplicados = 0
for mid, importe in mensajes:
    if mid in vistos:
        duplicados += 1
        continue
    vistos.add(mid)
    saldo += int(importe)
print(f"aplicados: {len(vistos)}")
print(f"duplicados: {duplicados}")
print(f"saldo: {saldo}")
`,
  why:"En producción, el set es una tabla con clave única dentro de la misma transacción que el UPDATE del saldo, y se purga pasado un tiempo."}
]},

/* =============== U7 L4 =============== */
{
id:"ds7n3",
titulo:"Transacciones distribuidas: sagas y outbox",
claves:["Doble escritura (base de datos + broker) sin coordinación pierde o inventa eventos: se resuelve con el patrón outbox","Saga: una cadena de transacciones locales con compensaciones si algo falla","Coreografía (cada servicio reacciona a eventos) u orquestación (un coordinador dirige)"],
pasos:[
 {t:"info", eti:"El problema", h:"Doble escritura y outbox",
  c:`<div class="dg"><div class="dg-tit">guardar y publicar: dos sistemas, ninguna transacción común</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Sin outbox</div>
<div class="dg-vert"><div class="dg-caja">INSERT pedido (commit)</div><div class="dg-caja aviso">el proceso muere</div><div class="dg-caja aviso">el evento nunca se publica</div></div></div>
<div class="dg-col"><div class="dg-col-tit">Con outbox</div>
<div class="dg-vert"><div class="dg-caja acento doble">una transacción<small>INSERT pedido + INSERT outbox(evento)</small></div><div class="dg-caja doble">un relé lee la tabla outbox<small>o Debezium lee el WAL (CDC)</small></div><div class="dg-caja ok">publica en Kafka y marca como enviado</div></div></div>
</div></div>
     <p>El relé puede publicar dos veces (muere tras publicar y antes de marcar): outbox da «al menos una vez», así que los consumidores deben ser idempotentes. En el lado del consumidor, el espejo es el <b>inbox</b>: registrar el id del evento recibido junto con su efecto.</p>`},
 {t:"info", eti:"Sin transacción global", h:"Sagas",
  c:`<p>El <b>commit en dos fases (2PC)</b> coordina varias bases de datos, pero bloquea recursos mientras espera y, si el coordinador cae en mal momento, deja a todos esperando. Entre microservicios casi no se usa. La alternativa es la <b>saga</b>:</p>
     <div class="dg"><div class="dg-tit">saga de un pedido (orquestada)</div>
<div class="dg-flujo"><div class="dg-caja ok">crear pedido (pendiente)</div><div class="dg-caja ok">reservar stock</div><div class="dg-caja aviso">cobrar: falla</div></div>
<div class="dg-flujo" style="margin-top:10px"><div class="dg-caja">liberar stock</div><div class="dg-caja">cancelar pedido</div><div class="dg-caja base">avisar al cliente</div></div>
<div class="dg-nota arriba">las compensaciones se ejecutan en orden inverso</div></div>
     <ul><li><b>Coreografía</b>: cada servicio escucha eventos y emite otros. Poco acoplamiento, pero el flujo no está escrito en ningún sitio.</li>
     <li><b>Orquestación</b>: un orquestador (Temporal, AWS Step Functions, o tu propio servicio con una máquina de estados) dice quién hace qué. Más visible y fácil de cambiar.</li>
     <li>Las sagas no tienen aislamiento: otros ven estados intermedios. Se usan estados explícitos («pendiente») y compensaciones <b>semánticas</b> (un reembolso, no un «deshacer» mágico).</li></ul>`},
 {t:"par", p:"Empareja cada concepto con su descripción",
  pares:[["Outbox","Guardar el evento en la misma transacción que el cambio y publicarlo después"],["Compensación","Acción que deshace el efecto de negocio de un paso anterior"],["Coreografía","Los servicios reaccionan a los eventos de los demás sin coordinador"],["Orquestación","Un coordinador invoca cada paso y decide qué compensar"],["2PC","Coordinador que pide votar y confirmar a todos los participantes"]],
  why:"Outbox + consumidores idempotentes + sagas es el trío que sostiene la mayoría de sistemas de microservicios serios."},
 {t:"opcion", p:"Tu servicio hace <code>repo.save(pedido)</code> y luego <code>kafka.send(evento)</code>. A veces faltan eventos. ¿Solución robusta?",
  ops:["Enviar primero a Kafka y luego guardar","Patrón outbox: el evento se inserta en una tabla en la misma transacción y un relé o CDC lo publica","Reintentar el send tres veces","Usar una transacción de Spring alrededor de las dos llamadas"],
  ok:1, why:"Cambiar el orden solo cambia el fallo (eventos de pedidos que no existen). @Transactional no abarca Kafka y la base de datos a la vez de forma atómica."},
 {t:"orden", p:"Ordena lo que hace una saga orquestada de reserva de viaje cuando falla el hotel",
  items:["Reservar el vuelo (bien)","Reservar el hotel (falla)","Cancelar el vuelo (compensación)","Marcar el viaje como fallido y avisar al cliente"],
  why:"Solo se compensan los pasos que se completaron, y en orden inverso."},
 {t:"vf", p:"Una compensación siempre puede devolver el sistema exactamente al estado anterior.",
  ok:false, why:"Un correo enviado no se «desenvía»; un cargo se reembolsa, pero el cliente lo ve. Por eso los pasos irreversibles se colocan al final de la saga."},
 {t:"codigo", p:"Ejecuta una saga con compensaciones",
  lenguaje:"py",
  c:`<p>Cada línea es un paso: <code>nombre compensacion resultado</code> (resultado <code>ok</code> o <code>fallo</code>). Ejecuta los pasos en orden imprimiendo <code>hecho: nombre</code>. Si uno falla, imprime <code>fallo: nombre</code>, ejecuta las compensaciones de los pasos ya hechos en orden inverso (<code>compensa: compensacion</code>) y termina con <code>saga abortada</code>. Si todos van bien, <code>saga completada</code>.</p>`,
  plantilla:`import sys
pasos = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
hechos = []
# ejecuta la saga
`,
  pruebas:[{entrada:"crear_pedido cancelar_pedido ok\nreservar_stock liberar_stock ok\ncobrar reembolsar fallo\nenviar anular_envio ok\n", salida:"hecho: crear_pedido\nhecho: reservar_stock\nfallo: cobrar\ncompensa: liberar_stock\ncompensa: cancelar_pedido\nsaga abortada"},{entrada:"a deshacer_a ok\nb deshacer_b ok\n", salida:"hecho: a\nhecho: b\nsaga completada"},{entrada:"vuelo cancelar_vuelo fallo\nhotel cancelar_hotel ok\n", salida:"fallo: vuelo\nsaga abortada", oculta:true}],
  pista:"Guarda en una lista la compensación de cada paso hecho; al fallar, recórrela con reversed().",
  solucion:`import sys
pasos = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
hechos = []
for nombre, comp, res in pasos:
    if res == "ok":
        print(f"hecho: {nombre}")
        hechos.append(comp)
    else:
        print(f"fallo: {nombre}")
        for c in reversed(hechos):
            print(f"compensa: {c}")
        print("saga abortada")
        break
else:
    print("saga completada")
`,
  why:"Un orquestador real además persiste el estado de la saga en cada paso, para poder continuar o compensar si él mismo se reinicia a mitad."}
]}

]});
