window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Configuración y perfiles",
resumen: "application.yml, propiedades tipadas con @ConfigurationProperties, perfiles por entorno, variables de entorno y secretos",
nivel: "Fundamentos",
color: "#63a93a",
lecciones: [

{
id:"sp3l1",
titulo:"application.properties y YAML",
claves:["La configuración vive en application.properties o application.yml","Las propiedades de Spring Boot cambian el comportamiento sin tocar código","YAML: jerárquico, sensible a la sangría"],
pasos:[
 {t:"info", eti:"Configurar sin recompilar", h:"El fichero de configuración",
  c:`<div class="termbox"># application.yml
server:
  port: 8080
spring:
  application:
    name: tareas-api
  datasource:
    url: jdbc:postgresql://localhost:5432/tareas
    username: tareas_user
    password: \${DB_PASSWORD}
  jpa:
    open-in-view: false
logging:
  level:
    com.catappa: debug</div>
     <p>Equivale a <code>server.port=8080</code>, <code>spring.datasource.url=...</code> en formato properties. Elige uno y sé coherente.</p>`},
 {t:"par", p:"Empareja cada propiedad con su efecto",
  pares:[["server.port","Puerto HTTP de la aplicación"],["spring.datasource.url","Dirección JDBC de la base de datos"],["logging.level.com.catappa","Nivel de log de tus paquetes"],["spring.jpa.open-in-view","Mantener la sesión JPA abierta durante la vista (mejor false)"],["management.endpoints.web.exposure.include","Qué endpoints de Actuator exponer"]],
  why:"La documentación de Spring Boot lista cientos de propiedades; el IDE las autocompleta."},
 {t:"opcion", p:"¿Qué significa <code>${DB_PASSWORD}</code> en el YAML?",
  ops:["Una contraseña literal","Un marcador que Spring sustituye por el valor de la variable de entorno o propiedad DB_PASSWORD","Un comentario","Un error de sintaxis"],
  ok:1, why:"Así los secretos no se escriben en el repositorio. Con ${DB_PASSWORD:local} se da un valor por defecto."},
 {t:"vf", p:"En YAML, la sangría con tabuladores es válida.",
  ok:false, why:"YAML solo admite espacios para la sangría."}
]},

{
id:"sp3l2",
titulo:"Propiedades en tu código",
claves:["@Value inyecta una propiedad suelta","@ConfigurationProperties agrupa propiedades en un objeto tipado y validable","Prefiere @ConfigurationProperties para grupos de ajustes propios"],
pasos:[
 {t:"info", eti:"Leer configuración", h:"@Value y @ConfigurationProperties",
  c:`<div class="termbox"># application.yml
tienda:
  envio-gratis-desde: 50
  pasarela:
    url: https://api.pagos.com
    timeout: 3s</div>
     <div class="termbox"><span class="cm">// suelta</span>
@Value("\${tienda.envio-gratis-desde}") BigDecimal envioGratis;

<span class="cm">// agrupada y tipada (recomendada)</span>
@ConfigurationProperties(prefix = "tienda")
@Validated
public record TiendaProps(@NotNull BigDecimal envioGratisDesde, Pasarela pasarela) {
    public record Pasarela(@NotBlank String url, Duration timeout) { }
}

@SpringBootApplication
@ConfigurationPropertiesScan
public class TareasApiApplication { ... }</div>
     <p>Spring convierte tipos (<code>3s</code> a Duration) y acepta nombres en kebab-case, camelCase o variables de entorno (<code>TIENDA_PASARELA_URL</code>).</p>`},
 {t:"opcion", p:"¿Qué ventaja tiene @ConfigurationProperties sobre muchos @Value?",
  ops:["Ninguna","Agrupa, tipa y valida la configuración en un solo objeto; si falta algo obligatorio, la aplicación no arranca","Es más rápido en ejecución","Permite escribir en el fichero"],
  ok:1, why:"Fallar al arrancar por configuración incorrecta es mucho mejor que fallar en la primera petición."},
 {t:"hueco", p:"Completa para inyectar el valor de <code>app.nombre</code>",
  tpl:"@Value(\"___\") String nombre;", banco:["${app.nombre}","#{app.nombre}","app.nombre","$app.nombre"], sol:["${app.nombre}"],
  why:"${...} lee propiedades. #{...} es el lenguaje de expresiones SpEL."},
 {t:"vf", p:"La propiedad <code>tienda.pasarela.url</code> se puede sobrescribir con la variable de entorno <code>TIENDA_PASARELA_URL</code>.",
  ok:true, why:"Relaxed binding: mayúsculas y guiones bajos en lugar de puntos y guiones."}
]},

{
id:"sp3l3",
titulo:"Perfiles y orden de prioridad",
claves:["Perfiles: application-dev.yml, application-prod.yml, activados con spring.profiles.active","Prioridad: argumentos > variables de entorno > ficheros de perfil > application.yml","Doce factores: la configuración viene del entorno; la misma imagen en todos los entornos"],
pasos:[
 {t:"info", eti:"Por entorno", h:"Perfiles",
  c:`<div class="diag">src/main/resources/
  application.yml          comun a todos
  application-dev.yml      base de datos local, logs en debug
  application-prod.yml     pool mas grande, logs en JSON</div>
     <div class="termbox">SPRING_PROFILES_ACTIVE=prod java -jar app.jar
java -jar app.jar --spring.profiles.active=dev

@Profile("dev")
@Bean CommandLineRunner datosDePrueba() { ... }    <span class="cm">// solo en dev</span></div>`},
 {t:"info", eti:"Quién gana", h:"Orden de prioridad",
  c:`<div class="diag">(mas prioridad)
 argumentos de linea de comandos   --server.port=9090
 variables de entorno              SERVER_PORT=9090
 application-{perfil}.yml
 application.yml
(menos prioridad)</div>
     <p>Esto permite construir <b>una sola imagen Docker</b> y configurarla en cada entorno con variables de entorno (o ConfigMaps y Secrets en Kubernetes). Es uno de los principios de la <b>aplicación de doce factores</b>.</p>`},
 {t:"term", p:"Ejecuta el jar <code>app.jar</code> con el perfil <code>prod</code> usando un argumento",
  prompt:"pablo@servidor:~$", sol:["java -jar app.jar --spring.profiles.active=prod","java -Dspring.profiles.active=prod -jar app.jar","spring_profiles_active=prod java -jar app.jar"],
  pista:"java -jar app.jar y el argumento --spring.profiles.active=...",
  salida:`The following 1 profile is active: "prod"
Started TareasApiApplication in 2.3 seconds`, why:"El log de arranque siempre dice qué perfiles están activos: compruébalo si algo no cuadra."},
 {t:"opcion", p:"El YAML dice <code>server.port: 8080</code> y arrancas con <code>SERVER_PORT=9000</code>. ¿En qué puerto escucha?",
  ops:["8080","9000","En ambos","Error"],
  ok:1, why:"Las variables de entorno tienen más prioridad que los ficheros."},
 {t:"vf", p:"Es buena práctica construir una imagen Docker distinta para cada entorno con la configuración dentro.",
  ok:false, why:"Una imagen para todos; la configuración llega del entorno. Así lo que pruebas en staging es exactamente lo que va a producción."}
]},

{
id:"sp3l4",
titulo:"Logs en Spring Boot",
claves:["SLF4J como fachada y Logback como implementación por defecto","Niveles por paquete en la configuración y parámetros {} en vez de concatenar","MDC para añadir el id de traza o de usuario a cada línea"],
pasos:[
 {t:"info", eti:"Registrar bien", h:"Logging",
  c:`<div class="termbox">@Service
public class PedidoService {
    private static final Logger log = LoggerFactory.getLogger(PedidoService.class);

    public void pagar(long id) {
        log.info("Pagando pedido {}", id);                 // parametros, no concatenacion
        try { ... }
        catch (PagoRechazado e) {
            log.warn("Pago rechazado pedido={} motivo={}", id, e.getMotivo());
        }
    }
}</div>
     <div class="termbox">logging:
  level:
    root: info
    com.catappa: debug
    org.hibernate.SQL: debug          # ver el SQL en desarrollo
  structured:
    format:
      console: ecs                    # JSON en produccion (Spring Boot 3.4+)</div>`},
 {t:"par", p:"Empareja cada nivel con su uso",
  pares:[["ERROR","Algo falló y requiere atención"],["WARN","Situación anómala que no detiene el proceso"],["INFO","Eventos normales relevantes (arranque, pedido creado)"],["DEBUG","Detalles para depurar en desarrollo"],["TRACE","Máximo detalle, casi nunca en producción"]],
  why:"Con Lombok, @Slf4j crea el logger por ti."},
 {t:"opcion", p:"¿Por qué <code>log.debug(\"Pedido {}\", pedido)</code> y no <code>log.debug(\"Pedido \" + pedido)</code>?",
  ops:["Es igual","Con parámetros, si DEBUG está desactivado no se construye la cadena (ni se llama a toString): más eficiente","Por estilo","Porque + no funciona"],
  ok:1, why:"En código que se ejecuta millones de veces, la diferencia se nota."},
 {t:"vf", p:"MDC permite añadir automáticamente un identificador (de petición o de usuario) a todas las líneas de log de esa petición.",
  ok:true, why:"Micrometer Tracing ya coloca traceId y spanId en el MDC."}
]}

]});
