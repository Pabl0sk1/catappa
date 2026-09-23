window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Beans e inyección de dependencias",
resumen: "Inversión de control, el contenedor de Spring, estereotipos, inyección por constructor, @Configuration y @Bean, ámbitos, ciclo de vida, proxies y AOP",
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
     <p>La clase declara <b>qué necesita</b> y el <b>contenedor de Spring</b> (<code>ApplicationContext</code>) crea los objetos y se los pasa. Al control de «quién crea qué» se le llama <b>inversión de control</b>: ya no lo decide tu clase, lo decide el contenedor.</p>
     <div class="dg"><div class="dg-tit">el contenedor arma el grafo de objetos</div>
       <div class="dg-flujo">
         <div class="dg-caja base">ApplicationContext</div>
         <div class="dg-caja">crea <code>PostgresPedidoRepository</code> y <code>EmailNotificador</code></div>
         <div class="dg-caja acento">los pasa al constructor de <code>PedidoService</code></div>
       </div>
     </div>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Bean","Objeto creado y gestionado por el contenedor de Spring"],["ApplicationContext","El contenedor que crea y conecta los beans"],["Inyección de dependencias","Recibir los colaboradores desde fuera en vez de crearlos"],["Inversión de control","El framework controla la creación y el ciclo de vida de los objetos"]],
  why:"«¿Qué es la inyección de dependencias?» es probablemente la pregunta de Spring más repetida."},
 {t:"opcion", p:"¿Cuál es la ventaja más importante de la inyección de dependencias para las pruebas?",
  ops:["Ninguna","Puedes pasar mocks o implementaciones falsas en el constructor y probar la clase aislada","Las pruebas son más lentas","No hace falta escribir pruebas"],
  ok:1, why:"new PedidoService(repoFalso, notificadorFalso): sin Spring, sin base de datos."},
 {t:"vf", p:"Todos los objetos de una aplicación Spring deben ser beans.",
  ok:false, why:"Los servicios, repositorios y controladores sí. Entidades, DTOs y valores se crean con new normalmente."},
 {t:"opcion", p:"<code>PedidoService</code> depende de la interfaz <code>Notificador</code>, no de <code>EmailNotificador</code>. ¿Qué ganas?",
  ops:["Nada, es más código","Puedes cambiar a SMS o a un falso en pruebas registrando otro bean, sin tocar PedidoService","Es más rápido en ejecución","Spring lo exige siempre"],
  ok:1, why:"Depender de abstracciones (la D de SOLID) es lo que hace que la DI sirva de algo."},
 {t:"vf", p:"Spring detecta al arrancar un ciclo de dependencias por constructor (A necesita B y B necesita A) y falla con un error claro.",
  ok:true, why:"«The dependencies of some of the beans form a cycle». Es una señal de diseño: extrae la parte común a un tercer bean o usa eventos."}
]},

{
id:"sp2l2",
titulo:"Estereotipos e inyección por constructor",
claves:["@Component, @Service, @Repository y @RestController marcan clases como beans","Con un solo constructor, Spring lo usa para inyectar sin @Autowired","Inyección por constructor: dependencias obligatorias, final y fáciles de probar"],
pasos:[
 {t:"info", eti:"Marcar beans", h:"Estereotipos",
  c:`<div class="termbox">@RestController  class PedidoController { ... }    <span class="cm">// capa web</span>
@Service         class PedidoService { ... }       <span class="cm">// lógica de negocio</span>
@Repository      class PedidoJdbcRepository { ... } <span class="cm">// acceso a datos (traduce excepciones)</span>
@Component       class CalculadoraEnvio { ... }    <span class="cm">// componente genérico</span></div>
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
  ok:true, why:"Desde Spring 4.3. Por eso el código moderno casi no ve @Autowired."},
 {t:"hueco", p:"Completa el servicio con inyección por constructor",
  tpl:"@___\npublic class FacturaService {\n    private ___ FacturaRepository repo;\n    public FacturaService(FacturaRepository repo) { this.repo = repo; }\n}", banco:["Service","final","static","Bean","Autowired","volatile"], sol:["Service","final"],
  why:"@Service lo registra como bean y final garantiza que la dependencia se asigna una vez y nunca queda a null."},
 {t:"opcion", p:"Una dependencia es opcional: si existe un bean <code>MetricasExtra</code> lo usas, y si no, no. ¿Cómo la pides?",
  ops:["Con @Autowired en el campo y rezar","Con ObjectProvider&lt;MetricasExtra&gt; (o Optional&lt;MetricasExtra&gt;) en el constructor","Con new MetricasExtra()","No se puede"],
  ok:1, why:"ObjectProvider permite getIfAvailable() y además retrasa la obtención del bean hasta que la necesitas."}
]},

{
id:"sp2l3",
titulo:"@Configuration, @Bean y ambigüedades",
claves:["@Bean en una clase @Configuration registra objetos que no son tuyos (clientes HTTP, Clock)","Si hay varios beans del mismo tipo: @Primary o @Qualifier","Se pueden inyectar todos los beans de un tipo como List o Map"],
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
     <p>No puedes poner <code>@Service</code> en una clase de una librería. Con <code>@Bean</code>, el método crea el objeto y Spring lo registra como bean. El nombre del bean es el del método (<code>pagosClient</code>).</p>`},
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
  ok:true, why:"Spring los inyecta automáticamente, igual que en un constructor."},
 {t:"codigo", p:"Patrón Strategy con un Map de beans: elige el notificador por nombre",
  lenguaje:"java",
  c:`<p>Spring te inyectaría un <code>Map&lt;String, Notificador&gt;</code> con clave el nombre del bean. Aquí el mapa ya está construido. Lee líneas con el formato <code>canal;mensaje</code> y, para cada una, usa el notificador de ese canal. Si el canal no existe, imprime <code>canal desconocido: X</code>.</p>`,
  plantilla:"import java.util.*;\n\ninterface Notificador { String enviar(String msg); }\nclass Email implements Notificador { public String enviar(String m) { return \"[EMAIL] \" + m; } }\nclass Sms implements Notificador { public String enviar(String m) { return \"[SMS] \" + m; } }\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Notificador> porNombre = Map.of(\"email\", new Email(), \"sms\", new Sms());\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String linea = sc.nextLine();\n            // separa canal y mensaje y usa el notificador del mapa\n        }\n    }\n}\n",
  pruebas:[{entrada:"email;Pedido 7 pagado\nsms;Tu clave es 1234", salida:"[EMAIL] Pedido 7 pagado\n[SMS] Tu clave es 1234"},{entrada:"push;Hola", salida:"canal desconocido: push"},{entrada:"sms;a\nfax;b\nemail;c", salida:"[SMS] a\ncanal desconocido: fax\n[EMAIL] c", oculta:true}],
  pista:"String[] p = linea.split(\";\", 2); Notificador n = porNombre.get(p[0]);",
  solucion:"import java.util.*;\n\ninterface Notificador { String enviar(String msg); }\nclass Email implements Notificador { public String enviar(String m) { return \"[EMAIL] \" + m; } }\nclass Sms implements Notificador { public String enviar(String m) { return \"[SMS] \" + m; } }\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Notificador> porNombre = Map.of(\"email\", new Email(), \"sms\", new Sms());\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String linea = sc.nextLine();\n            if (linea.isBlank()) continue;\n            String[] p = linea.split(\";\", 2);\n            Notificador n = porNombre.get(p[0]);\n            if (n == null) System.out.println(\"canal desconocido: \" + p[0]);\n            else System.out.println(n.enviar(p.length > 1 ? p[1] : \"\"));\n        }\n    }\n}",
  why:"Añadir un canal nuevo es crear un bean más: el servicio que elige no cambia (principio abierto/cerrado)."},
 {t:"hueco", p:"Completa para elegir el bean <code>sms</code> entre varios <code>Notificador</code>",
  tpl:"public AvisoService(@___(\"sms\") Notificador notificador) { ... }", banco:["Qualifier","Primary","Named","Bean"], sol:["Qualifier"],
  why:"@Primary se pone en la implementación preferida; @Qualifier se pone en el punto de inyección."}
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
    @PreDestroy void guardar() { ... }       <span class="cm">// al cerrar la aplicación</span>
}

@EventListener(ApplicationReadyEvent.class)
void alArrancar() { log.info("Lista para recibir tráfico"); }</div>
     <div class="nota ojo"><b class="tit">Prototype dentro de singleton</b>Si un singleton recibe un bean prototype por constructor, recibe <b>una</b> instancia y la conserva para siempre. Para obtener una nueva cada vez, inyecta <code>ObjectProvider&lt;T&gt;</code> y llama a <code>getObject()</code>.</div>`},
 {t:"orden", p:"Ordena el ciclo de vida de un bean singleton",
  items:["Spring crea la instancia llamando al constructor","Inyecta las dependencias","Ejecuta @PostConstruct","El bean atiende peticiones durante toda la vida de la aplicación","Al cerrar, ejecuta @PreDestroy"],
  why:"Entre la inyección y @PostConstruct también actúan los BeanPostProcessor, que es donde se crean los proxies de @Transactional."},
 {t:"vf", p:"Un bean singleton de Spring es compartido por todos los hilos que atienden peticiones.",
  ok:true, why:"Por eso los servicios deben ser sin estado o thread-safe."},
 {t:"par", p:"Empareja cada ámbito con un uso razonable",
  pares:[["singleton","Servicios y repositorios sin estado"],["prototype","Un objeto con estado que se usa una vez, como un constructor de informes"],["request","Datos de la petición actual, como el idioma del usuario"],["session","Preferencias de una sesión web con cookies"]],
  why:"En una API REST sin estado casi todo es singleton; request y session son raros."},
 {t:"opcion", p:"Tu servicio singleton guarda un contador de peticiones en un <code>int</code> y bajo carga el número sale menor de lo real. ¿Qué haces?",
  ops:["Hacer el bean prototype","Usar AtomicLong (o, mejor, una métrica de Micrometer, que ya es segura entre hilos)","Poner synchronized en toda la clase","Nada, es normal"],
  ok:1, why:"contador++ no es atómico: dos hilos leen el mismo valor y se pierde un incremento."}
]},

{
id:"sp2n1",
titulo:"Proxies y AOP: lo que hay detrás de las anotaciones",
claves:["@Transactional, @Cacheable, @Async y @PreAuthorize funcionan envolviendo tu bean en un proxy","La autollamada (this.metodo()) no pasa por el proxy y la anotación se ignora","@Aspect permite añadir comportamiento transversal propio (tiempos, auditoría)"],
pasos:[
 {t:"info", eti:"La pieza clave", h:"Qué es un proxy",
  c:`<p>Cuando un bean tiene anotaciones como <code>@Transactional</code>, Spring no te inyecta el objeto real: inyecta un <b>proxy</b>, un objeto intermedio con la misma interfaz que hace algo antes y después de llamar al real.</p>
     <div class="dg"><div class="dg-tit">una llamada a un método @Transactional</div>
       <div class="dg-flujo">
         <div class="dg-caja base">PedidoController</div>
         <div class="dg-caja acento">proxy<small>abre transacción</small></div>
         <div class="dg-caja">PedidoService real<small>tu código</small></div>
         <div class="dg-caja acento">proxy<small>commit o rollback</small></div>
       </div>
     </div>
     <p>Spring crea el proxy con <b>CGLIB</b> (una subclase generada en tiempo de ejecución) o con proxies dinámicos de JDK (si el bean se usa por su interfaz). Por eso las clases y métodos anotados no pueden ser <code>final</code> ni <code>private</code>.</p>`},
 {t:"info", eti:"La trampa", h:"La autollamada",
  c:`<div class="termbox">@Service
public class InformeService {

    public void generarTodos() {
        for (var c : clientes) {
            this.generar(c);          <span class="cm">// llamada directa: NO pasa por el proxy</span>
        }
    }

    @Transactional(propagation = REQUIRES_NEW)
    public void generar(Cliente c) { ... }   <span class="cm">// la anotación se ignora aquí</span>
}</div>
     <p>Soluciones: mover <code>generar</code> a otro bean (lo más limpio), o inyectarse a sí mismo de forma perezosa. Lo mismo pasa con <code>@Cacheable</code>, <code>@Async</code>, <code>@Retryable</code> y <code>@PreAuthorize</code>.</p>`},
 {t:"par", p:"Empareja cada anotación con lo que hace su proxy",
  pares:[["@Transactional","Abrir la transacción y hacer commit o rollback"],["@Cacheable","Devolver el valor cacheado sin ejecutar el método"],["@Async","Ejecutar el método en otro hilo"],["@PreAuthorize","Comprobar permisos antes de entrar"],["@Retryable","Volver a intentar si el método lanza una excepción"]],
  why:"Entender el proxy explica de golpe por qué fallan todas estas anotaciones en los mismos casos."},
 {t:"codigo", p:"Escribe un proxy transaccional con java.lang.reflect.Proxy",
  lenguaje:"java",
  c:`<p>Así funciona Spring por dentro, en pequeño. Completa <code>transaccional</code> para que devuelva un proxy que imprima <code>BEGIN</code> antes de llamar al método real, <code>COMMIT</code> si termina bien y <code>ROLLBACK</code> si lanza, volviendo a lanzar la excepción original.</p>
     <p>El programa lee ids de pedido, uno por línea. Los que empiezan por <code>X</code> fallan.</p>`,
  plantilla:"import java.lang.reflect.*;\nimport java.util.*;\n\ninterface PedidoService { void pagar(String id); }\n\nclass PedidoServiceImpl implements PedidoService {\n    public void pagar(String id) {\n        if (id.startsWith(\"X\")) throw new IllegalStateException(\"pedido bloqueado\");\n        System.out.println(\"pagando \" + id);\n    }\n}\n\npublic class Main {\n    static PedidoService transaccional(PedidoService real) {\n        // devuelve un proxy con Proxy.newProxyInstance\n        return real;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        PedidoService s = transaccional(new PedidoServiceImpl());\n        while (sc.hasNextLine()) {\n            String id = sc.nextLine().trim();\n            if (id.isEmpty()) continue;\n            try { s.pagar(id); } catch (IllegalStateException e) { System.out.println(\"error: \" + e.getMessage()); }\n        }\n    }\n}\n",
  pruebas:[{entrada:"P1", salida:"BEGIN\npagando P1\nCOMMIT"},{entrada:"X9", salida:"BEGIN\nROLLBACK\nerror: pedido bloqueado"},{entrada:"P2\nX3\nP4", salida:"BEGIN\npagando P2\nCOMMIT\nBEGIN\nROLLBACK\nerror: pedido bloqueado\nBEGIN\npagando P4\nCOMMIT", oculta:true}],
  pista:"Proxy.newProxyInstance(loader, new Class<?>[]{PedidoService.class}, (proxy, metodo, a) -> { ... metodo.invoke(real, a) ... }). Si invoke lanza InvocationTargetException, la excepción real está en getCause().",
  solucion:"import java.lang.reflect.*;\nimport java.util.*;\n\ninterface PedidoService { void pagar(String id); }\n\nclass PedidoServiceImpl implements PedidoService {\n    public void pagar(String id) {\n        if (id.startsWith(\"X\")) throw new IllegalStateException(\"pedido bloqueado\");\n        System.out.println(\"pagando \" + id);\n    }\n}\n\npublic class Main {\n    static PedidoService transaccional(PedidoService real) {\n        return (PedidoService) Proxy.newProxyInstance(\n            PedidoService.class.getClassLoader(),\n            new Class<?>[]{PedidoService.class},\n            (proxy, metodo, a) -> {\n                System.out.println(\"BEGIN\");\n                try {\n                    Object r = metodo.invoke(real, a);\n                    System.out.println(\"COMMIT\");\n                    return r;\n                } catch (InvocationTargetException e) {\n                    System.out.println(\"ROLLBACK\");\n                    throw e.getCause();\n                }\n            });\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        PedidoService s = transaccional(new PedidoServiceImpl());\n        while (sc.hasNextLine()) {\n            String id = sc.nextLine().trim();\n            if (id.isEmpty()) continue;\n            try { s.pagar(id); } catch (IllegalStateException e) { System.out.println(\"error: \" + e.getMessage()); }\n        }\n    }\n}",
  why:"Eso es TransactionInterceptor en esencia: un envoltorio que decide commit o rollback según cómo termina tu método."},
 {t:"info", eti:"Tu propio aspecto", h:"@Aspect para lo transversal",
  c:`<div class="termbox">@Aspect
@Component
public class TiempoAspecto {

    @Around("@annotation(com.catappa.Medido)")        <span class="cm">// dónde: métodos con @Medido</span>
    public Object medir(ProceedingJoinPoint pjp) throws Throwable {
        long t0 = System.nanoTime();
        try {
            return pjp.proceed();                       <span class="cm">// llama al método real</span>
        } finally {
            log.info("{} tardó {} ms", pjp.getSignature().getName(), (System.nanoTime() - t0) / 1_000_000);
        }
    }
}</div>
     <p>Necesita <code>spring-boot-starter-aop</code> (en Boot 4, <code>spring-boot-starter-aspectj</code>). Úsalo con moderación: el comportamiento «invisible» cuesta de depurar. Para medir tiempos, Micrometer ya ofrece <code>@Timed</code> y <code>@Observed</code>.</p>`},
 {t:"opcion", p:"Anotas con <code>@Transactional</code> un método <code>private</code> y no se abre ninguna transacción. ¿Por qué?",
  ops:["Es un bug de Spring","El proxy solo puede interceptar métodos que se llaman desde fuera del bean y que puede sobrescribir: un método private nunca pasa por él","Falta @EnableTransactionManagement siempre","Los métodos private no pueden acceder a la base de datos"],
  ok:1, why:"Spring no da error: simplemente ignora la anotación. Revisa siempre la visibilidad y quién llama al método."},
 {t:"vf", p:"Si inyectas un bean con <code>@Transactional</code> y llamas a <code>getClass()</code>, verás algo como <code>PedidoService$$SpringCGLIB$$0</code>.",
  ok:true, why:"Es la subclase generada por CGLIB: la prueba de que tienes el proxy y no el objeto original."}
]}

]});
