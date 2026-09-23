window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Productores",
resumen: "Enviar eventos con garantías, elegir la clave, agrupar en lotes y no perder mensajes",
nivel: "Intermedio",
color: "#8f9bb0",
lecciones: [

/* =============== U2 L1 =============== */
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
  ok:1, why:"Los lotes comprimidos reducen mucho el tráfico y la carga de los brokers."},
 {t:"info", eti:"El error que cuesta caro", h:"send() no es síncrono",
  c:`<div class="termbox">// MAL: no se entera de nada si falla
kafkaTemplate.send("pedidos", evento);

// BIEN: tratar el resultado
kafkaTemplate.send("pedidos", clave, evento)
    .whenComplete((r, e) -&gt; { if (e != null) alertar(e); });

// o esperar, si el flujo lo permite (mas lento, mas simple)
kafkaTemplate.send("pedidos", clave, evento).get(5, SECONDS);</div>
     <p><code>send()</code> pone el mensaje en un buffer y vuelve enseguida. Si el envío falla después, sin manejar el resultado <b>nadie se entera</b>: el evento se perdió y tu código creyó que todo iba bien.</p>`},
 {t:"opcion", p:"El buffer del productor se llena porque el clúster va lento. ¿Qué hace <code>send()</code> por defecto?",
  ops:["Descarta mensajes","Se bloquea hasta max.block.ms y después lanza una excepción","Los guarda en disco","Los manda a otro topic"],
  ok:1, why:"Esa contrapresión es deseable: es preferible que tu servicio note el problema a que descarte eventos en silencio."},
 {t:"vf", p:"Con <code>acks=0</code> el productor va más rápido y no hay contrapartida.",
  ok:false, why:"La contrapartida es que puedes perder mensajes sin enterarte. Solo vale para datos que se pueden tirar (métricas, trazas de depuración)."},
 {t:"escribe", p:"¿Qué valor de <code>acks</code> usarías para eventos de pago?",
  sol:["all","acks=all","-1"],
  pista:"El que espera a las réplicas sincronizadas.",
  why:"Con pagos, la duda no existe: durabilidad por encima de latencia."}
]},

/* =============== U2 L2 =============== */
{
id:"kf5l1",
titulo:"La clave: orden, reparto y puntos calientes",
claves:["La clave decide la partición: misma clave, misma partición, orden garantizado","Sin clave, el reparto es round-robin y no hay orden por entidad","Una clave con muy pocos valores distintos crea particiones calientes"],
pasos:[
 {t:"info", eti:"Elegir bien", h:"Qué pones como clave",
  c:`<div class="termbox">// clave = id del pedido  -&gt; todos los eventos de ese pedido, en orden
producer.send(new ProducerRecord&lt;&gt;("pedidos", pedido.id(), evento));

// sin clave -&gt; reparto equilibrado, sin orden por entidad
producer.send(new ProducerRecord&lt;&gt;("metricas", null, medida));</div>
     <p>La clave es la decisión de diseño más importante de un topic. Determina tres cosas a la vez: <b>qué se ordena</b>, <b>cómo se reparte la carga</b> y <b>qué puede procesarse en paralelo</b>.</p>`},
 {t:"par", p:"Empareja cada topic con la clave adecuada",
  pares:[["Eventos de un pedido","Id del pedido: sus eventos en orden"],["Cambios de perfil de usuario","Id del usuario"],["Métricas de servidores","Sin clave o id del servidor, según si importa el orden"],["Movimientos de una cuenta bancaria","Número de cuenta: el orden es obligatorio"]],
  why:"La pregunta a hacerse: ¿qué cosas tienen que llegar en orden entre sí?"},
 {t:"opcion", p:"Eliges como clave el país del cliente y el 80% son de España. ¿Qué pasa?",
  ops:["Nada","Una partición recibe el 80% del tráfico: se convierte en un punto caliente y limita el rendimiento de todo el topic","Kafka lo reparte igual","Se duplican eventos"],
  ok:1, why:"La clave debe tener muchos valores distintos y bien repartidos. El id de la entidad casi siempre cumple."},
 {t:"vf", p:"Si no pones clave, Kafka reparte los eventos entre todas las particiones.",
  ok:true, why:"Con el particionador por defecto va llenando lotes por partición (sticky), lo que reparte bien y además mejora el agrupamiento."},
 {t:"info", eti:"Cuando el orden no cabe", h:"Orden por entidad, no global",
  c:`<p>Mucha gente pide «orden total» y en realidad necesita «orden por cliente» o «orden por pedido». Eso es una suerte: el orden total obliga a una sola partición, y una sola partición es un solo consumidor.</p>
     <div class="dg">
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">orden total</div>
           <div class="dg-caja aviso doble">1 partición<small>1 consumidor como mucho</small></div></div>
         <div class="dg-col"><div class="dg-col-tit">orden por entidad</div>
           <div class="dg-caja ok doble">N particiones<small>N consumidores en paralelo</small></div></div>
       </div>
       <div class="dg-nota">casi siempre basta con lo segundo, y escala</div>
     </div>`},
 {t:"opcion", p:"Necesitas que los movimientos de cada cuenta se procesen en orden, pero quieres paralelismo. ¿Qué haces?",
  ops:["Una partición","Clave = número de cuenta, y tantas particiones como quieras: cada cuenta va ordenada y distintas cuentas van en paralelo","Ordenar en el consumidor","No se puede"],
  ok:1, why:"Es justo el problema que resuelven las claves, y es la respuesta que buscan en una entrevista."},
 {t:"escribe", p:"Para un topic de eventos de carritos de compra, ¿qué campo usarías como clave? (una palabra)",
  sol:["usuario","usuarioId","cliente","clienteId","carrito","carritoId"],
  pista:"Lo que agrupa los eventos que deben ir en orden entre sí.",
  why:"Todos los eventos del carrito de una persona en orden, y los de distintas personas en paralelo."}
]},

/* =============== U2 L3 =============== */
{
id:"kf5l2",
titulo:"Rendimiento y el coste de cada ajuste",
claves:["Lotes y compresión son lo que más rinde, a cambio de unos milisegundos","Cada ajuste es un intercambio entre latencia, rendimiento y durabilidad","El productor es asíncrono: hay que vigilar su buffer y sus métricas"],
pasos:[
 {t:"info", eti:"Los cuatro mandos", h:"Lo que puedes tocar",
  c:`<div class="termbox">linger.ms=10            # esperar un poco para juntar mas mensajes por lote
batch.size=65536        # tamaño maximo de lote por particion
compression.type=zstd   # comprimir el lote entero (lz4 si la CPU aprieta)
max.in.flight.requests.per.connection=5   # peticiones sin confirmar a la vez
buffer.memory=64MB      # cuanto puede acumular antes de bloquear send()</div>
     <p>Comprimir <b>el lote</b> y no cada mensaje es lo que hace que la compresión rinda tanto: eventos JSON parecidos comprimen muchísimo.</p>`},
 {t:"par", p:"Empareja cada ajuste con lo que consigue",
  pares:[["linger.ms alto","Lotes más grandes: más rendimiento, algo más de latencia"],["compression.type=zstd","Menos red y menos disco, algo más de CPU"],["batch.size grande","Menos peticiones al broker"],["buffer.memory grande","Aguantar picos sin bloquear la aplicación"],["acks=all","Durabilidad a costa de latencia"]],
  why:"No hay ajustes «buenos»: hay intercambios, y cada sistema elige el suyo."},
 {t:"opcion", p:"Tu productor manda 50.000 eventos por segundo y satura la red. ¿Primera medida?",
  ops:["Más brokers","Activar compresión y subir linger.ms: lotes grandes comprimidos reducen el tráfico varias veces","acks=0","Menos particiones"],
  ok:1, why:"Es un cambio de dos líneas que suele dividir el tráfico entre tres o cuatro."},
 {t:"vf", p:"Con idempotencia activada, subir <code>max.in.flight.requests</code> a 5 puede desordenar los mensajes.",
  ok:false, why:"Con idempotencia, Kafka mantiene el orden hasta 5 peticiones en vuelo. Sin ella, sí que puede desordenarlos al reintentar."},
 {t:"info", eti:"Medir", h:"Las métricas del productor",
  c:`<ul><li><b>record-send-rate</b>: eventos por segundo que sales.</li>
     <li><b>request-latency-avg</b>: cuánto tarda el broker en confirmar.</li>
     <li><b>buffer-available-bytes</b>: si baja a cero, tu aplicación se va a bloquear.</li>
     <li><b>record-error-rate</b>: envíos fallidos. Debería ser cero.</li></ul>
     <p>Si el buffer se vacía y <code>send()</code> empieza a bloquear, el problema casi nunca es el productor: es el clúster, la red o unas particiones mal repartidas.</p>`},
 {t:"opcion", p:"¿Por qué es peligroso que el productor viva en el mismo hilo que atiende peticiones HTTP sin control?",
  ops:["Por la memoria","Porque si el clúster va lento, send() se bloquea y arrastra a tus peticiones HTTP: el problema de Kafka se convierte en caída de tu API","Por la compresión","No lo es"],
  ok:1, why:"De ahí que se use el patrón outbox o colas internas con límite, para que un Kafka lento no tumbe el servicio."},
 {t:"escribe", p:"¿Qué ajuste subirías para formar lotes mayores a costa de unos milisegundos de latencia?",
  sol:["linger.ms","linger"],
  pista:"El tiempo que el productor espera antes de enviar.",
  why:"De 0 a 5-20 ms suele bastar para notar una mejora grande en rendimiento."}
]}

]});
