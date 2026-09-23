window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Arquitectura de aplicaciones",
resumen: "Capas y arquitectura hexagonal, monolito modular frente a microservicios, comunicación entre servicios, sagas, y reactivo frente a hilos virtuales",
nivel: "Experto",
color: "#3a7e22",
lecciones: [

{
id:"sp12l1",
titulo:"Capas y arquitectura hexagonal",
claves:["Capas clásicas: controlador, servicio, repositorio","Hexagonal: el dominio en el centro, sin depender de frameworks; puertos y adaptadores","Las dependencias apuntan hacia el dominio"],
pasos:[
 {t:"info", eti:"Organizar el código", h:"De capas a hexagonal",
  c:`<div class="dg dg-tabla-caja"><table class="dg-tabla"><tbody><tr><td>CAPAS</td><td>HEXAGONAL (puertos y adaptadores)</td></tr><tr><td>controller</td><td>adaptadores de entrada: REST, Kafka, CLI</td></tr><tr><td>|</td><td>|</td></tr><tr><td>service</td><td>[ DOMINIO + casos de uso ]  &amp;lt;- sin Spring, sin JPA</td></tr><tr><td>|</td><td>|  puertos (interfaces)</td></tr><tr><td>repository</td><td>adaptadores de salida: JPA, cliente HTTP, correo</td></tr></tbody></table></div>
     <p>En hexagonal, el dominio define <b>puertos</b> (interfaces como <code>PedidoRepositorio</code> o <code>PasarelaPago</code>) y la infraestructura los implementa con <b>adaptadores</b>. Cambiar PostgreSQL por otro almacén o Stripe por otra pasarela no toca la lógica de negocio, y el dominio se prueba sin nada externo.</p>`},
 {t:"par", p:"Empareja cada pieza de la arquitectura hexagonal con su ejemplo",
  pares:[["Dominio","Pedido, con la regla «no se puede pagar dos veces»"],["Caso de uso","PagarPedido: orquesta el dominio y los puertos"],["Puerto de salida","Interfaz PasarelaPago"],["Adaptador de salida","StripePasarelaPago que llama a la API de Stripe"],["Adaptador de entrada","PedidoController REST"]],
  why:"No hace falta aplicarlo siempre: para CRUD sencillo, las capas clásicas bastan."},
 {t:"opcion", p:"¿Cuál es la regla principal de dependencias en arquitectura hexagonal (o limpia)?",
  ops:["El dominio depende de JPA","La infraestructura depende del dominio, nunca al revés","Todo depende de los controladores","No hay reglas"],
  ok:1, why:"Así el núcleo de negocio no se contamina con detalles técnicos."},
 {t:"vf", p:"En una arquitectura hexagonal estricta, las entidades de dominio llevan anotaciones de JPA.",
  ok:false, why:"En la versión estricta, el modelo de persistencia está en el adaptador y se mapea. Muchos equipos lo relajan por pragmatismo."}
]},

{
id:"sp12l2",
titulo:"Monolito modular y microservicios",
claves:["Empieza por un monolito bien modularizado; separa cuando haya motivos reales","Microservicios: despliegue y escalado independientes a cambio de complejidad distribuida","Cada microservicio con su propia base de datos"],
pasos:[
 {t:"info", eti:"El gran debate", h:"Ventajas y costes",
  c:`<p><b>Microservicios</b>: cada servicio se despliega, escala y evoluciona por separado, y cada equipo es dueño del suyo. El precio: red entre servicios (latencia, fallos parciales), consistencia eventual, trazas distribuidas, más infraestructura, pruebas de integración complejas.</p>
     <p><b>Monolito modular</b>: una sola aplicación desplegable, pero dividida en módulos con límites claros (por ejemplo con <b>Spring Modulith</b>, que verifica que los módulos no se saltan sus fronteras). Si un módulo necesita separarse, ya tiene los límites trazados.</p>`},
 {t:"par", p:"Empareja cada motivo con si favorece separar en microservicios",
  pares:[["Equipos grandes que se pisan al desplegar","Favorece microservicios"],["Una parte necesita escalar 50 veces más que el resto","Favorece separar esa parte"],["Equipo de 4 personas empezando un producto","Mejor monolito modular"],["Dominios aún poco claros que cambian mucho","Mejor monolito modular hasta estabilizar"]],
  why:"Los microservicios resuelven problemas de organización y escala; si no los tienes, solo añaden coste."},
 {t:"opcion", p:"Dos microservicios comparten la misma base de datos y tablas. ¿Qué problema tiene?",
  ops:["Ninguno","Acoplamiento: un cambio de esquema rompe al otro y no se pueden desplegar de forma independiente (monolito distribuido)","Es más rápido","Mejora la consistencia sin inconvenientes"],
  ok:1, why:"Cada servicio es dueño de sus datos; los demás acceden por su API o sus eventos."},
 {t:"vf", p:"Una llamada entre microservicios puede fallar de formas que una llamada entre clases del mismo proceso no puede.",
  ok:true, why:"Timeouts, red caída, respuestas parciales, versiones incompatibles... Por eso existen los patrones de resiliencia."}
]},

{
id:"sp12l3",
titulo:"Consistencia entre servicios y modelo de concurrencia",
claves:["Sin transacciones distribuidas: sagas con pasos y compensaciones","Consistencia eventual mediante eventos","Reactivo (WebFlux) o hilos virtuales: con Java 21, lo síncrono escala para E/S"],
pasos:[
 {t:"info", eti:"Transacciones largas", h:"Sagas",
  c:`<div class="diag">1. Pedidos: crear pedido (PENDIENTE)       compensacion: cancelar pedido
2. Pagos: cobrar                           compensacion: reembolsar
3. Stock: reservar                         compensacion: liberar
4. Pedidos: confirmar

Si falla el paso 3 -&gt; reembolsar (2) y cancelar (1)</div>
     <ul><li><b>Coreografía</b>: cada servicio reacciona a eventos de los demás.</li>
     <li><b>Orquestación</b>: un orquestador (código propio, Temporal, Camunda) dirige los pasos.</li></ul>`},
 {t:"par", p:"Empareja cada concepto con su descripción",
  pares:[["Saga","Secuencia de transacciones locales con compensaciones"],["Compensación","Acción que deshace el efecto de un paso anterior"],["Consistencia eventual","Los datos quedan coherentes pasado un tiempo, no al instante"],["Outbox","Guardar el evento en la misma transacción que los datos para no perderlo"]],
  why:"Two-phase commit (XA) entre servicios casi no se usa: bloquea y acopla."},
 {t:"info", eti:"Escalar la espera", h:"WebFlux o hilos virtuales",
  c:`<p><b>Spring WebFlux</b> (reactivo, Reactor con <code>Mono</code> y <code>Flux</code>) atiende muchas conexiones con pocos hilos sin bloquear, a cambio de un modelo de programación más difícil de leer y depurar.</p>
     <p>Con <b>Java 21</b> y <code>spring.threads.virtual.enabled=true</code>, el código síncrono tradicional (Spring MVC, JDBC, RestClient) escala de forma parecida para cargas de E/S. Para la mayoría de APIs nuevas, MVC + hilos virtuales es la opción más sencilla; WebFlux sigue teniendo sentido en streaming y gateways.</p>`},
 {t:"opcion", p:"Una API típica con PostgreSQL y llamadas a otros servicios necesita atender muchas más peticiones concurrentes. En Java 21, ¿qué probarías primero?",
  ops:["Reescribir todo en WebFlux","Activar hilos virtuales en Spring Boot y revisar el pool de conexiones y los timeouts","Más memoria sin más","Quitar las transacciones"],
  ok:1, why:"Cambio de una línea frente a una reescritura. Ojo: el límite pasa a ser la base de datos (pool)."}
]}

]});
