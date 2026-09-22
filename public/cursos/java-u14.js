window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Diseño y código limpio",
resumen: "Principios SOLID, patrones de diseño más usados, código limpio, inmutabilidad y cómo se aplican en Spring",
nivel: "Experto",
color: "#a8341c",
lecciones: [

{
id:"jv14l1",
titulo:"Principios SOLID",
claves:["S: una razón para cambiar; O: abierto a extensión, cerrado a modificación","L: los subtipos sustituyen al tipo base; I: interfaces pequeñas","D: depender de abstracciones, no de implementaciones"],
pasos:[
 {t:"info", eti:"Cinco principios", h:"SOLID",
  c:`<ul><li><b>S</b>ingle responsibility: una clase, una responsabilidad (un motivo para cambiar). <code>PedidoService</code> no debería también generar PDFs y enviar correos.</li>
     <li><b>O</b>pen/closed: añadir comportamiento sin tocar código existente. Un nuevo método de pago = una nueva implementación de <code>PasarelaPago</code>, no otro <code>if</code>.</li>
     <li><b>L</b>iskov substitution: una subclase debe poder usarse donde se espera el padre sin sorpresas.</li>
     <li><b>I</b>nterface segregation: mejor varias interfaces pequeñas que una enorme.</li>
     <li><b>D</b>ependency inversion: depende de interfaces; las implementaciones se inyectan. Es exactamente lo que hace Spring.</li></ul>`},
 {t:"par", p:"Empareja cada problema con el principio que viola",
  pares:[["Una clase que valida, guarda, envía correos y genera informes","Responsabilidad única"],["Cada nuevo tipo de envío obliga a modificar un switch enorme","Abierto/cerrado"],["Un Cuadrado que hereda de Rectangulo y rompe setAncho","Sustitución de Liskov"],["Una interfaz con 30 métodos que nadie implementa entera","Segregación de interfaces"],["El servicio hace new PostgresRepositorio() dentro","Inversión de dependencias"]],
  why:"En entrevistas piden a menudo un ejemplo concreto de cada letra."},
 {t:"opcion", p:"¿Cómo aplica Spring el principio de inversión de dependencias?",
  ops:["No lo aplica","Las clases declaran dependencias (idealmente interfaces) en el constructor y el contenedor inyecta las implementaciones","Con métodos static","Con herencia"],
  ok:1, why:"Inyección de dependencias: la clase no crea sus colaboradores, los recibe."},
 {t:"vf", p:"Aplicar SOLID significa crear una interfaz para cada clase, aunque solo haya una implementación.",
  ok:false, why:"Abstracciones donde aportan (varias implementaciones, límites con el exterior, pruebas). Añadirlas por sistema es sobreingeniería."}
]},

{
id:"jv14l2",
titulo:"Patrones de diseño",
claves:["Creacionales: Builder, Factory, Singleton","Estructurales: Adapter, Decorator, Proxy, Facade","De comportamiento: Strategy, Observer, Template Method, Chain of Responsibility"],
pasos:[
 {t:"info", eti:"Soluciones con nombre", h:"Los que más verás",
  c:`<div class="termbox"><span class="cm">// Builder: construir objetos con muchos parametros opcionales</span>
var peticion = HttpRequest.newBuilder().uri(uri).header("Accept", "application/json").GET().build();

<span class="cm">// Strategy: elegir un algoritmo en tiempo de ejecucion</span>
interface CalculoEnvio { BigDecimal calcular(Pedido p); }
Map&lt;String, CalculoEnvio&gt; estrategias = Map.of("normal", new EnvioNormal(), "urgente", new EnvioUrgente());

<span class="cm">// Adapter: adaptar una API externa a tu interfaz</span>
class StripeAdapter implements PasarelaPago { private final StripeClient stripe; ... }</div>`},
 {t:"par", p:"Empareja cada patrón con su propósito",
  pares:[["Builder","Construir objetos complejos paso a paso"],["Factory","Decidir qué implementación crear"],["Strategy","Intercambiar algoritmos con una interfaz común"],["Adapter","Hacer compatible una interfaz ajena con la tuya"],["Decorator","Añadir comportamiento envolviendo un objeto"],["Observer","Notificar a interesados cuando algo ocurre"]],
  why:"No hace falta memorizar los 23 del libro clásico: estos cubren la mayoría de casos."},
 {t:"info", eti:"Dentro de Spring", h:"Patrones que ya usas sin saberlo",
  c:`<ul><li><b>Singleton</b>: los beans por defecto (una instancia por contexto).</li>
     <li><b>Proxy</b>: <code>@Transactional</code>, <code>@Cacheable</code> y <code>@Async</code> funcionan envolviendo tu bean en un proxy que añade comportamiento antes y después.</li>
     <li><b>Template Method</b>: <code>JdbcTemplate</code>, <code>RestTemplate</code>.</li>
     <li><b>Observer</b>: <code>ApplicationEventPublisher</code> y <code>@EventListener</code>.</li>
     <li><b>Chain of Responsibility</b>: la cadena de filtros de Spring Security.</li></ul>`},
 {t:"opcion", p:"¿Por qué <code>@Transactional</code> no funciona si un método llama a otro método <code>@Transactional</code> de la misma clase?",
  ops:["Es un bug de Spring","Porque la transacción se aplica mediante un proxy, y una llamada interna (this.metodo()) no pasa por el proxy","Porque solo funciona en métodos static","Porque falta @Service"],
  ok:1, why:"Entender el patrón Proxy explica este clásico de las entrevistas de Spring."},
 {t:"vf", p:"El patrón Strategy permite añadir un nuevo algoritmo sin modificar el código que lo usa.",
  ok:true, why:"Es una aplicación directa del principio abierto/cerrado."}
]},

{
id:"jv14l3",
titulo:"Código limpio",
claves:["Nombres que revelan intención; funciones pequeñas que hacen una cosa","Evita null, parámetros booleanos y efectos secundarios ocultos","Inmutabilidad por defecto y cláusulas de guarda"],
pasos:[
 {t:"info", eti:"Leer más que escribir", h:"Antes y después",
  c:`<div class="termbox"><span class="cm">// antes</span>
public double calc(List&lt;Object[]&gt; l, boolean f) {
    double t = 0;
    for (Object[] o : l) { if (f) { t += (double) o[1] * 0.9; } else { t += (double) o[1]; } }
    return t;
}

<span class="cm">// despues</span>
public BigDecimal total(List&lt;LineaPedido&gt; lineas, Descuento descuento) {
    BigDecimal bruto = lineas.stream().map(LineaPedido::importe).reduce(BigDecimal.ZERO, BigDecimal::add);
    return descuento.aplicarA(bruto);
}</div>`},
 {t:"par", p:"Empareja cada mala práctica con su mejora",
  pares:[["Variable llamada d o tmp","Nombre que explica qué contiene"],["Método de 200 líneas","Varios métodos pequeños con nombre"],["Parámetro boolean que cambia el comportamiento","Dos métodos o un tipo con significado"],["Devolver null","Optional o colección vacía"],["Ifs anidados en cinco niveles","Cláusulas de guarda con retorno temprano"]],
  why:"El código se lee muchas más veces de las que se escribe."},
 {t:"info", eti:"Menos sorpresas", h:"Inmutabilidad y guardas",
  c:`<div class="termbox">public Factura emitir(Pedido pedido) {
    if (pedido == null) throw new IllegalArgumentException("pedido obligatorio");
    if (!pedido.estaPagado()) throw new IllegalStateException("pedido sin pagar");
    if (pedido.lineas().isEmpty()) return Factura.vacia();

    <span class="cm">// camino principal, sin anidar</span>
    return new Factura(pedido.id(), pedido.total(), Instant.now());
}</div>
     <p>Objetos inmutables (records, <code>final</code>, <code>List.copyOf</code>) no cambian a tus espaldas y son seguros entre hilos.</p>`},
 {t:"opcion", p:"¿Qué nombre de método es mejor para algo que calcula el precio con descuento de un cliente?",
  ops:["calc()","procesar(c)","precioConDescuentoPara(cliente)","doIt()"],
  ok:2, why:"Un buen nombre hace innecesario un comentario."},
 {t:"vf", p:"Muchos comentarios explicando qué hace cada línea son señal de buen código.",
  ok:false, why:"El buen código se explica solo con nombres y estructura. Los comentarios deben explicar el porqué, no el qué."}
]}

]});
