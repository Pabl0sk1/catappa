window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Beans e inyección de dependencias",
resumen: "Inversión de control, el contenedor de Spring, estereotipos, inyección por constructor, @Configuration y @Bean, ámbitos y ciclo de vida",
nivel: "Fundamentos",
color: "#6db33f",
lecciones: [

{
id:"sp2l1",
titulo:"Inversión de control",
claves:["Sin DI, cada clase crea sus dependencias con new: acoplamiento fuerte","Con DI, las dependencias llegan desde fuera; el contenedor las crea y conecta","Un bean es un objeto gestionado por el contenedor de Spring"],
pasos:[
 {t:"info", eti:"El problema", h:"Clases que se crean sus dependencias",
  c:`<div class="termbox">public class PedidoService {
    private final PedidoRepository repo = new PostgresPedidoRepository("jdbc:postgresql://...");
    private final Notificador notificador = new EmailNotificador("smtp.gmail.com", 587);
}</div>
     <ul><li>No puedes probar <code>PedidoService</code> sin una base de datos y un servidor de correo reales.</li>
     <li>Cambiar de correo a SMS obliga a tocar esta clase.</li>
     <li>La configuración (URLs, puertos) está esparcida por el código.</li></ul>`},
 {t:"info", eti:"La solución", h:"Inyección de dependencias",
  c:`<div class="termbox">@Service
public class PedidoService {
    private final PedidoRepository repo;
    private final Notificador notificador;

    public PedidoService(PedidoRepository repo, Notificador notificador) {   <span class="cm">// las recibe</span>
        this.repo = repo;
        this.notificador = notificador;
    }
}</div>
     <p>La clase declara <b>qué necesita</b> y el <b>contenedor de Spring</b> (ApplicationContext) crea los objetos y se los pasa. Al control de «quién crea qué» se le llama <b>inversión de control</b>: ya no lo decide tu clase, lo decide el contenedor.</p>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Bean","Objeto creado y gestionado por el contenedor de Spring"],["ApplicationContext","El contenedor que crea y conecta los beans"],["Inyección de dependencias","Recibir los colaboradores desde fuera en vez de crearlos"],["Inversión de control","El framework controla la creación y el ciclo de vida de los objetos"]],
  why:"«¿Qué es la inyección de dependencias?» es probablemente la pregunta de Spring más repetida."},
 {t:"opcion", p:"¿Cuál es la ventaja más importante de la inyección de dependencias para las pruebas?",
  ops:["Ninguna","Puedes pasar mocks o implementaciones falsas en el constructor y probar la clase aislada","Las pruebas son más lentas","No hace falta escribir pruebas"],
  ok:1, why:"new PedidoService(repoFalso, notificadorFalso): sin Spring, sin base de datos."},
 {t:"vf", p:"Todos los objetos de una aplicación Spring deben ser beans.",
  ok:false, why:"Los servicios, repositorios y controladores sí. Entidades, DTOs y valores se crean con new normalmente."}
]},

{
id:"sp2l2",
titulo:"Estereotipos e inyección por constructor",
claves:["@Component, @Service, @Repository y @RestController marcan clases como beans","Con un solo constructor, Spring lo usa para inyectar sin @Autowired","Inyección por constructor: dependencias obligatorias, final y fáciles de probar"],
pasos:[
 {t:"info", eti:"Marcar beans", h:"Estereotipos",
  c:`<div class="termbox">@RestController  class PedidoController { ... }    <span class="cm">// capa web</span>
@Service         class PedidoService { ... }       <span class="cm">// logica de negocio</span>
@Repository      class PedidoJdbcRepository { ... } <span class="cm">// acceso a datos (traduce excepciones)</span>
@Component       class CalculadoraEnvio { ... }    <span class="cm">// componente generico</span></div>
     <p>Todas son variantes de <code>@Component</code>: el escaneo las encuentra y crea un bean de cada una. El nombre indica el <b>papel</b> y algunas añaden comportamiento (@Repository traduce excepciones de persistencia).</p>`},
 {t:"par", p:"Empareja cada anotación con su capa",
  pares:[["@RestController","Recibe peticiones HTTP y devuelve JSON"],["@Service","Lógica de negocio"],["@Repository","Acceso a datos"],["@Component","Cualquier otro componente"],["@Configuration","Clase que define beans con métodos @Bean"]],
  why:"Controlador fino, servicio con la lógica, repositorio con los datos."},
 {t:"info", eti:"Tres formas de inyectar", h:"Constructor, setter y campo",
  c:`<div class="termbox"><span class="cm">// 1. constructor (RECOMENDADA)</span>
@Service
public class PedidoService {
    private final PedidoRepository repo;
    public PedidoService(PedidoRepository repo) { this.repo = repo; }
}

<span class="cm">// 2. campo (desaconsejada)</span>
@Autowired private PedidoRepository repo;

<span class="cm">// 3. setter (para dependencias opcionales)</span>
@Autowired void setRepo(PedidoRepository repo) { ... }</div>
     <p>Con Lombok, <code>@RequiredArgsConstructor</code> genera el constructor para todos los campos <code>final</code>.</p>`},
 {t:"opcion", p:"¿Por qué se recomienda la inyección por constructor frente a @Autowired en el campo?",
  ops:["Por costumbre","Las dependencias son obligatorias y final, el objeto nunca queda a medias, se ve claramente cuántas tiene y se puede crear en pruebas sin Spring","Es más rápida","@Autowired está prohibido"],
  ok:1, why:"Y si un constructor tiene diez parámetros, es una señal de que la clase hace demasiado."},
 {t:"vf", p:"Si una clase tiene un único constructor, Spring lo usa para inyectar aunque no lleve @Autowired.",
  ok:true, why:"Desde Spring 4.3. Por eso el código moderno casi no ve @Autowired."}
]},

{
id:"sp2l3",
titulo:"@Configuration, @Bean y ambigüedades",
claves:["@Bean en una clase @Configuration registra objetos que no son tuyos (clientes HTTP, ObjectMapper)","Si hay varios beans del mismo tipo: @Primary o @Qualifier","Se pueden inyectar todos los beans de un tipo como List o Map"],
pasos:[
 {t:"info", eti:"Beans de terceros", h:"@Configuration y @Bean",
  c:`<div class="termbox">@Configuration
public class ClientesConfig {

    @Bean
    RestClient pagosClient(TiendaProps props) {
        return RestClient.builder()
            .baseUrl(props.pasarela().url())
            .build();
    }

    @Bean
    Clock reloj() { return Clock.systemUTC(); }   <span class="cm">// inyectar el reloj facilita probar fechas</span>
}</div>
     <p>No puedes poner <code>@Service</code> en una clase de una librería. Con <code>@Bean</code>, el método crea el objeto y Spring lo registra como bean.</p>`},
 {t:"info", eti:"Varios candidatos", h:"@Primary, @Qualifier y colecciones",
  c:`<div class="termbox">@Component("email") class NotificadorEmail implements Notificador { }
@Component("sms")   class NotificadorSms implements Notificador { }

public AvisoService(Notificador n) { }       <span class="cm">// ERROR: dos candidatos</span>

public AvisoService(@Qualifier("sms") Notificador n) { }   <span class="cm">// elige uno</span>
public AvisoService(List&lt;Notificador&gt; todos) { }             <span class="cm">// todos</span>
public AvisoService(Map&lt;String, Notificador&gt; porNombre) { }  <span class="cm">// por nombre de bean</span></div>`},
 {t:"opcion", p:"Arrancas y falla con «required a single bean, but 2 were found». ¿Qué haces?",
  ops:["Borrar una implementación","Marcar una como @Primary o indicar cuál quieres con @Qualifier (o inyectar una List si quieres todas)","Añadir @Autowired","Cambiar a inyección por campo"],
  ok:1, why:"Inyectar un Map&lt;String, Notificador&gt; es una forma elegante del patrón Strategy."},
 {t:"par", p:"Empareja cada anotación con su uso",
  pares:[["@Bean","Registrar como bean el objeto que devuelve un método"],["@Primary","Candidato preferido si hay varios"],["@Qualifier(\"sms\")","Elegir un bean concreto por nombre"],["@Profile(\"dev\")","Crear el bean solo con ese perfil"],["@ConditionalOnProperty","Crear el bean solo si una propiedad tiene cierto valor"]],
  why:"Con @ConditionalOnProperty puedes activar o desactivar funcionalidades por configuración."},
 {t:"vf", p:"Un método <code>@Bean</code> puede recibir otros beans como parámetros.",
  ok:true, why:"Spring los inyecta automáticamente, igual que en un constructor."}
]},

{
id:"sp2l4",
titulo:"Ámbitos y ciclo de vida",
claves:["Por defecto los beans son singleton: una instancia compartida","Por eso deben ser sin estado mutable (thread-safe)","prototype, request y session existen para casos concretos; @PostConstruct y @PreDestroy para inicializar y cerrar"],
pasos:[
 {t:"info", eti:"Cuántas instancias", h:"Ámbitos (scopes)",
  c:`<ul><li><b>singleton</b> (por defecto): una sola instancia para toda la aplicación, compartida por todas las peticiones (hilos).</li>
     <li><b>prototype</b>: una instancia nueva cada vez que se pide.</li>
     <li><b>request</b> / <b>session</b>: una por petición HTTP o por sesión web.</li></ul>
     <p>Como el singleton se comparte entre hilos, un servicio <b>no debe guardar estado de una petición en sus atributos</b>.</p>`},
 {t:"opcion", p:"¿Qué problema tiene este servicio?", c:`<div class="termbox">@Service
public class CarritoService {
    private List&lt;Linea&gt; lineas = new ArrayList&lt;&gt;();
    public void anadir(Linea l) { lineas.add(l); }
}</div>`,
  ops:["Ninguno","Es singleton: todos los usuarios comparten el mismo carrito y además hay condiciones de carrera","Falta @Autowired","Debería ser @Repository"],
  ok:1, why:"El carrito debe guardarse por usuario: en base de datos, Redis o la sesión."},
 {t:"info", eti:"Nacer y morir", h:"Ciclo de vida",
  c:`<div class="termbox">@Component
public class CacheLocal {
    @PostConstruct void cargar() { ... }     <span class="cm">// tras inyectar dependencias</span>
    @PreDestroy void guardar() { ... }       <span class="cm">// al cerrar la aplicacion</span>
}

@EventListener(ApplicationReadyEvent.class)
void alArrancar() { log.info("Lista para recibir tráfico"); }</div>`},
 {t:"orden", p:"Ordena el ciclo de vida de un bean singleton",
  items:["Spring crea la instancia llamando al constructor","Inyecta las dependencias","Ejecuta @PostConstruct","El bean atiende peticiones durante toda la vida de la aplicación","Al cerrar, ejecuta @PreDestroy"],
  why:"Entre la inyección y @PostConstruct también actúan los BeanPostProcessor, que es donde se crean los proxies de @Transactional."},
 {t:"vf", p:"Un bean singleton de Spring es compartido por todos los hilos que atienden peticiones.",
  ok:true, why:"Por eso los servicios deben ser sin estado o thread-safe."}
]}

]});
