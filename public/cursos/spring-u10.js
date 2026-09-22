window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Integración con otros sistemas",
resumen: "Llamar a otras APIs con RestClient, resiliencia (timeouts, reintentos, circuit breaker), caché, tareas programadas y asíncronas, y mensajería",
nivel: "Avanzado",
color: "#418726",
lecciones: [

{
id:"sp10l1",
titulo:"Llamar a otras APIs",
claves:["RestClient (síncrono) y WebClient (reactivo) sustituyen a RestTemplate","Interfaces HTTP declarativas con @HttpExchange","Siempre con timeouts de conexión y de lectura"],
pasos:[
 {t:"info", eti:"Cliente HTTP", h:"RestClient",
  c:`<div class="termbox">@Bean
RestClient pagosClient(RestClient.Builder builder, TiendaProps props) {
    var fabrica = new SimpleClientHttpRequestFactory();
    fabrica.setConnectTimeout(Duration.ofSeconds(2));
    fabrica.setReadTimeout(Duration.ofSeconds(5));
    return builder.baseUrl(props.pasarela().url()).requestFactory(fabrica).build();
}

ResultadoPago r = pagosClient.post()
    .uri("/v1/cobros")
    .body(new CobroRequest(pedido.total(), pedido.moneda()))
    .retrieve()
    .onStatus(HttpStatusCode::is4xxClientError, (req, res) -&gt; { throw new PagoRechazado(); })
    .body(ResultadoPago.class);</div>`},
 {t:"info", eti:"Declarativo", h:"Interfaces HTTP",
  c:`<div class="termbox">public interface CatalogoCliente {
    @GetExchange("/productos/{id}")
    ProductoExterno producto(@PathVariable String id);
}

@Bean
CatalogoCliente catalogo(RestClient.Builder b) {
    RestClient rc = b.baseUrl("https://catalogo.interno").build();
    return HttpServiceProxyFactory.builderFor(RestClientAdapter.create(rc)).build()
                                  .createClient(CatalogoCliente.class);
}</div>`},
 {t:"opcion", p:"¿Qué pasa si llamas a un servicio externo sin timeout y ese servicio deja de responder?",
  ops:["Nada","Los hilos se quedan esperando indefinidamente, se agotan y tu API deja de responder también (fallo en cascada)","Spring corta a los 5 segundos siempre","Devuelve null"],
  ok:1, why:"Timeouts siempre: el fallo de una dependencia no debe tumbar tu servicio."},
 {t:"vf", p:"RestTemplate es la opción recomendada para código nuevo.",
  ok:false, why:"Está en mantenimiento. Para código nuevo: RestClient (o WebClient si la aplicación es reactiva)."}
]},

{
id:"sp10l2",
titulo:"Resiliencia",
claves:["Reintentos solo en operaciones idempotentes y con espera creciente","Circuit breaker: deja de llamar a un servicio que falla y responde con una alternativa","Resilience4j se integra con Spring Boot mediante anotaciones"],
pasos:[
 {t:"info", eti:"Tolerar fallos", h:"Patrones de resiliencia",
  c:`<div class="termbox">@CircuitBreaker(name = "catalogo", fallbackMethod = "productoEnCache")
@Retry(name = "catalogo")
public ProductoExterno producto(String id) {
    return catalogo.producto(id);
}

ProductoExterno productoEnCache(String id, Throwable t) {
    return cacheLocal.get(id);            <span class="cm">// respuesta degradada</span>
}</div>
     <div class="termbox">resilience4j:
  retry.instances.catalogo:
    max-attempts: 3
    wait-duration: 200ms
    enable-exponential-backoff: true
  circuitbreaker.instances.catalogo:
    failure-rate-threshold: 50
    wait-duration-in-open-state: 30s</div>`},
 {t:"par", p:"Empareja cada patrón con lo que hace",
  pares:[["Timeout","No esperar indefinidamente"],["Retry con backoff","Reintentar fallos transitorios esperando cada vez más"],["Circuit breaker","Cortar las llamadas a un servicio que está fallando y probar más tarde"],["Fallback","Respuesta alternativa cuando la llamada falla"],["Bulkhead","Limitar las llamadas concurrentes para aislar recursos"]],
  why:"Juntos evitan que el fallo de una dependencia se propague por todo el sistema."},
 {t:"opcion", p:"¿Por qué es peligroso reintentar automáticamente un <code>POST /cobros</code>?",
  ops:["No lo es","Si la primera petición sí llegó y solo se perdió la respuesta, cobrarías dos veces. Necesita una clave de idempotencia","Porque POST no admite reintentos técnicamente","Porque es lento"],
  ok:1, why:"Las pasarelas de pago aceptan una cabecera Idempotency-Key para esto."},
 {t:"orden", p:"Ordena los estados de un circuit breaker cuando un servicio empieza a fallar y luego se recupera",
  items:["Cerrado: las llamadas pasan normalmente","Abierto: tras muchos fallos, se rechazan las llamadas sin intentarlo","Semiabierto: pasado un tiempo, deja pasar unas pocas de prueba","Cerrado de nuevo si las de prueba funcionan"],
  why:"Dar tiempo a un servicio caído para recuperarse en vez de rematarlo con peticiones."}
]},

{
id:"sp10l3",
titulo:"Caché, tareas programadas y asíncronas",
claves:["@Cacheable guarda resultados; @CacheEvict los invalida; Redis para caché compartida","@Scheduled ejecuta tareas periódicas; cuidado con varias réplicas","@Async ejecuta en otro hilo; eventos de aplicación desacoplan acciones secundarias"],
pasos:[
 {t:"info", eti:"No repetir trabajo", h:"Caché",
  c:`<div class="termbox">@EnableCaching
...
@Cacheable(cacheNames = "productos", key = "#id")
public ProductoDto producto(long id) { ... }          <span class="cm">// la segunda vez no ejecuta el metodo</span>

@CacheEvict(cacheNames = "productos", key = "#id")
public void actualizar(long id, CambioProducto c) { ... }</div>
     <p>Con <code>spring-boot-starter-data-redis</code>, la caché se guarda en Redis y la comparten todas las réplicas. Define siempre un <b>TTL</b>: los datos cacheados envejecen.</p>`},
 {t:"info", eti:"Cada cierto tiempo", h:"@Scheduled y @Async",
  c:`<div class="termbox">@EnableScheduling
...
@Scheduled(cron = "0 0 3 * * *")                <span class="cm">// cada dia a las 3:00</span>
void limpiarCarritosAbandonados() { ... }

@Async
public CompletableFuture&lt;Void&gt; enviarFactura(Pedido p) { ... }

<span class="cm">// eventos: el servicio de pedidos no conoce a quien le interesa</span>
publisher.publishEvent(new PedidoPagado(p.getId()));

@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
void alPagar(PedidoPagado e) { correo.enviarConfirmacion(e.pedidoId()); }</div>`},
 {t:"par", p:"Empareja cada anotación con su uso",
  pares:[["@Cacheable","Guardar el resultado de un método"],["@CacheEvict","Invalidar entradas de la caché"],["@Scheduled","Ejecutar un método periódicamente"],["@Async","Ejecutar un método en otro hilo"],["@TransactionalEventListener","Reaccionar a un evento solo si la transacción se confirmó"]],
  why:"AFTER_COMMIT evita enviar el correo de confirmación de un pago que luego se deshizo."},
 {t:"opcion", p:"Tu tarea <code>@Scheduled</code> de facturación se ejecuta tres veces cada noche desde que tienes 3 réplicas. ¿Solución?",
  ops:["Bajar a una réplica","Un bloqueo distribuido (ShedLock con la base de datos) o sacar la tarea a un Job/CronJob de Kubernetes","Poner @Async","Cambiar el cron"],
  ok:1, why:"Cada réplica tiene su propio planificador: hay que coordinarlas."},
 {t:"vf", p:"Llamar a un método @Cacheable desde otro método de la misma clase usa la caché.",
  ok:false, why:"Igual que @Transactional: la caché funciona mediante proxy y la autollamada no pasa por él."}
]},

{
id:"sp10l4",
titulo:"Mensajería con Kafka y RabbitMQ",
claves:["La mensajería desacopla servicios: el productor no espera al consumidor","RabbitMQ: colas y enrutamiento; Kafka: registro de eventos persistente y particionado","Entrega al menos una vez: los consumidores deben ser idempotentes"],
pasos:[
 {t:"info", eti:"Asíncrono entre servicios", h:"Por qué mensajería",
  c:`<p>Cuando se paga un pedido, hay que enviar el correo, avisar a logística y actualizar analítica. Si el servicio de pedidos llama a los tres por HTTP, cualquier caída bloquea el pago. Con mensajería, publica un evento <code>PedidoPagado</code> y cada interesado lo consume a su ritmo.</p>
     <div class="termbox"><span class="cm">// productor (spring-kafka)</span>
kafka.send("pedidos.pagados", pedido.id().toString(), new PedidoPagado(pedido.id(), pedido.total()));

<span class="cm">// consumidor</span>
@KafkaListener(topics = "pedidos.pagados", groupId = "logistica")
void preparar(PedidoPagado e) { envios.preparar(e.pedidoId()); }</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Topic (Kafka)","Registro de eventos de un tipo"],["Partición","Trozo de un topic que permite paralelizar y mantiene el orden por clave"],["Consumer group","Consumidores que se reparten el trabajo de un topic"],["Cola (RabbitMQ)","Mensajes pendientes que un consumidor retira"],["Dead letter queue","Destino de los mensajes que fallan repetidamente"]],
  why:"Kafka conserva los eventos: un servicio nuevo puede releer el historial."},
 {t:"info", eti:"La trampa", h:"Guardar y publicar a la vez: outbox",
  c:`<p>Si guardas el pedido y luego publicas en Kafka, puede fallar la publicación después del commit (evento perdido) o publicarse y fallar el commit (evento falso). El patrón <b>transactional outbox</b>: guarda el evento en una tabla <code>outbox</code> en la <b>misma transacción</b>, y un proceso aparte (o Debezium) lo publica.</p>`},
 {t:"opcion", p:"Kafka garantiza normalmente entrega «al menos una vez». ¿Qué implica para tus consumidores?",
  ops:["Nada","Pueden recibir el mismo mensaje dos veces: deben ser idempotentes (por ejemplo, registrando los ids de eventos procesados)","Los mensajes nunca se repiten","Deben ser síncronos"],
  ok:1, why:"Procesar dos veces «enviar paquete» sin idempotencia enviaría dos paquetes."},
 {t:"vf", p:"Con mensajería, si el servicio de correo está caído, el pago puede completarse igualmente y el correo se envía cuando vuelva.",
  ok:true, why:"Es la principal ventaja: desacoplamiento temporal."}
]}

]});
