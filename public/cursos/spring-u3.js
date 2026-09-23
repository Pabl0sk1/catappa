window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Configuración y perfiles",
resumen: "application.yml, propiedades tipadas con @ConfigurationProperties, perfiles por entorno, orden de prioridad, secretos y logs",
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
  ok:false, why:"YAML solo admite espacios para la sangría."},
 {t:"hueco", p:"Traduce a formato properties la configuración YAML del puerto y del nombre",
  tpl:"___=8080\n___=tareas-api", banco:["server.port","spring.application.name","server:port","application.name","spring.name"], sol:["server.port","spring.application.name"],
  why:"Cada nivel de sangría del YAML se convierte en un punto en properties."},
 {t:"opcion", p:"Arrancas y la aplicación falla con «Could not resolve placeholder 'DB_PASSWORD'». ¿Qué pasa?",
  ops:["El YAML está mal sangrado","No existe ninguna variable de entorno ni propiedad DB_PASSWORD y el marcador no tiene valor por defecto","PostgreSQL está caído","Falta el starter web"],
  ok:1, why:"Es bueno que falle al arrancar: mejor que funcionar con una contraseña vacía. En local, define la variable o usa un perfil dev."},
 {t:"vf", p:"<code>spring.jpa.open-in-view</code> está activado por defecto y Spring Boot avisa de ello en el log al arrancar.",
  ok:true, why:"Mantiene la conexión a la base de datos durante toda la petición y esconde consultas perezosas en el controlador. En APIs, desactívalo."}
]},

{
id:"sp3l2",
titulo:"Propiedades en tu código",
claves:["@Value inyecta una propiedad suelta","@ConfigurationProperties agrupa propiedades en un objeto tipado y validable","Relaxed binding: la misma propiedad se escribe en kebab-case, camelCase o como variable de entorno"],
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
     <p>Spring convierte tipos (<code>3s</code> a Duration, <code>10MB</code> a DataSize) y acepta nombres en kebab-case, camelCase o variables de entorno (<code>TIENDA_PASARELA_URL</code>).</p>`},
 {t:"opcion", p:"¿Qué ventaja tiene @ConfigurationProperties sobre muchos @Value?",
  ops:["Ninguna","Agrupa, tipa y valida la configuración en un solo objeto; si falta algo obligatorio, la aplicación no arranca","Es más rápido en ejecución","Permite escribir en el fichero"],
  ok:1, why:"Fallar al arrancar por configuración incorrecta es mucho mejor que fallar en la primera petición."},
 {t:"hueco", p:"Completa para inyectar el valor de <code>app.nombre</code>",
  tpl:"@Value(\"___\") String nombre;", banco:["${app.nombre}","#{app.nombre}","app.nombre","$app.nombre"], sol:["${app.nombre}"],
  why:"${...} lee propiedades. #{...} es el lenguaje de expresiones SpEL."},
 {t:"vf", p:"La propiedad <code>tienda.pasarela.url</code> se puede sobrescribir con la variable de entorno <code>TIENDA_PASARELA_URL</code>.",
  ok:true, why:"Relaxed binding: mayúsculas y guiones bajos en lugar de puntos, y sin guiones."},
 {t:"codigo", p:"Convierte nombres de propiedades a su variable de entorno",
  lenguaje:"java",
  c:`<p>En Kubernetes la configuración suele llegar como variables de entorno. La regla de Spring Boot para pasar una propiedad a variable de entorno es: <b>los puntos pasan a guion bajo, los guiones se eliminan y todo va en mayúsculas</b>.</p>
     <p>Lee nombres de propiedades, uno por línea, e imprime la variable equivalente. Ejemplo: <code>tienda.envio-gratis-desde</code> → <code>TIENDA_ENVIOGRATISDESDE</code>.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    static String aVariable(String propiedad) {\n        // aplica la regla de Spring Boot\n        return propiedad;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String p = sc.nextLine().trim();\n            if (!p.isEmpty()) System.out.println(aVariable(p));\n        }\n    }\n}\n",
  pruebas:[{entrada:"server.port\nspring.datasource.url", salida:"SERVER_PORT\nSPRING_DATASOURCE_URL"},{entrada:"tienda.envio-gratis-desde", salida:"TIENDA_ENVIOGRATISDESDE"},{entrada:"spring.profiles.active\nmanagement.endpoint.health.show-details", salida:"SPRING_PROFILES_ACTIVE\nMANAGEMENT_ENDPOINT_HEALTH_SHOWDETAILS", oculta:true}],
  pista:"propiedad.replace(\".\", \"_\").replace(\"-\", \"\").toUpperCase()",
  solucion:"import java.util.*;\n\npublic class Main {\n    static String aVariable(String propiedad) {\n        return propiedad.replace(\".\", \"_\").replace(\"-\", \"\").toUpperCase();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String p = sc.nextLine().trim();\n            if (!p.isEmpty()) System.out.println(aVariable(p));\n        }\n    }\n}",
  why:"Por eso SPRING_DATASOURCE_URL o SPRING_PROFILES_ACTIVE funcionan sin que escribas nada en tu código."},
 {t:"opcion", p:"Tu record <code>TiendaProps</code> tiene <code>@NotBlank String url</code> y <code>@Validated</code>, y en producción olvidaste definir la URL. ¿Qué pasa?",
  ops:["Arranca y falla la primera llamada a la pasarela","No arranca: el binding falla con un mensaje que dice qué propiedad no cumple la validación","La URL queda vacía sin avisar","Usa localhost"],
  ok:1, why:"Fallar pronto (fail fast) es justo lo que quieres ante una configuración incompleta."},
 {t:"par", p:"Empareja cada valor de configuración con el tipo Java al que Spring lo convierte",
  pares:[["3s","Duration"],["10MB","DataSize"],["https://api.pagos.com","URI o String"],["true","boolean"],["es-ES","Locale"]],
  why:"La conversión es automática: nada de parsear textos a mano en tu código."}
]},

{
id:"sp3l3",
titulo:"Perfiles y orden de prioridad",
claves:["Perfiles: application-dev.yml, application-prod.yml, activados con spring.profiles.active","Prioridad: argumentos &gt; variables de entorno &gt; ficheros de perfil &gt; application.yml","Doce factores: la configuración viene del entorno; la misma imagen en todos los entornos"],
pasos:[
 {t:"info", eti:"Por entorno", h:"Perfiles",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">src/main/resources/</div><table class="dg-tabla"><thead><tr><th>Fichero</th><th>Contenido</th></tr></thead><tbody><tr><td>application.yml</td><td>común a todos los entornos</td></tr><tr><td>application-dev.yml</td><td>base de datos local, logs en debug</td></tr><tr><td>application-prod.yml</td><td>pool más grande, logs en JSON</td></tr></tbody></table></div>
     <div class="termbox">SPRING_PROFILES_ACTIVE=prod java -jar app.jar
java -jar app.jar --spring.profiles.active=dev

@Profile("dev")
@Bean CommandLineRunner datosDePrueba() { ... }    <span class="cm">// solo en dev</span></div>`},
 {t:"info", eti:"Quién gana", h:"Orden de prioridad",
  c:`<div class="dg"><div class="dg-tit">qué fuente de configuración gana</div>
       <div class="dg-lado">
         <div class="dg-pila">
           <div class="dg-caja acento">argumentos de línea de comandos<small><code>--server.port=9090</code></small></div>
           <div class="dg-caja">variables de entorno<small><code>SERVER_PORT=9090</code></small></div>
           <div class="dg-caja"><code>application-{perfil}.yml</code></div>
           <div class="dg-caja base"><code>application.yml</code></div>
         </div>
         <div class="dg-nota">arriba, más prioridad; abajo, menos</div>
       </div>
     </div>
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
  ok:false, why:"Una imagen para todos; la configuración llega del entorno. Así lo que pruebas en staging es exactamente lo que va a producción."},
 {t:"info", eti:"Más herramientas", h:"Grupos, importaciones y secretos montados",
  c:`<div class="termbox">spring:
  profiles:
    group:
      prod: "prod-db, json-logs"          <span class="cm"># activar prod activa también estos</span>
  config:
    import:
      - "optional:file:.env[.properties]"  <span class="cm"># variables locales, fuera de git</span>
      - "optional:configtree:/run/secrets/" <span class="cm"># un fichero por secreto (Kubernetes, Docker)</span>
---
spring:
  config:
    activate:
      on-profile: dev                     <span class="cm"># este bloque solo se aplica en dev</span>
logging.level.com.catappa: debug</div>
     <p>Con <code>configtree</code>, el fichero <code>/run/secrets/spring.datasource.password</code> se convierte en la propiedad del mismo nombre: los secretos no aparecen en variables de entorno ni en <code>/actuator/env</code> en claro.</p>`},
 {t:"opcion", p:"En producción las pruebas de un compañero cargaron por error datos falsos porque el bean <code>datosDePrueba</code> se creó. ¿Qué lo evita?",
  ops:["Borrarlo antes de desplegar","Marcarlo con @Profile(\"dev\") y no activar dev en producción (y comprobar en el log qué perfiles están activos)","Ponerle @Lazy","Un comentario de aviso"],
  ok:1, why:"Todo lo que solo tiene sentido en un entorno se ata a su perfil. Ojo también con @Profile(\"!prod\"): cualquier entorno nuevo lo activaría."}
]},

{
id:"sp3l4",
titulo:"Logs en Spring Boot",
claves:["SLF4J como fachada y Logback como implementación por defecto","Niveles por paquete en la configuración y parámetros {} en vez de concatenar","Logs estructurados en JSON y MDC para añadir el id de traza o de usuario a cada línea"],
pasos:[
 {t:"info", eti:"Registrar bien", h:"Logging",
  c:`<div class="termbox">@Service
public class PedidoService {
    private static final Logger log = LoggerFactory.getLogger(PedidoService.class);

    public void pagar(long id) {
        log.info("Pagando pedido {}", id);                 <span class="cm">// parámetros, no concatenación</span>
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
    org.hibernate.SQL: debug          <span class="cm"># ver el SQL en desarrollo</span>
  structured:
    format:
      console: ecs                    <span class="cm"># JSON en producción (Spring Boot 3.4+)</span></div>`},
 {t:"par", p:"Empareja cada nivel con su uso",
  pares:[["ERROR","Algo falló y requiere atención"],["WARN","Situación anómala que no detiene el proceso"],["INFO","Eventos normales relevantes (arranque, pedido creado)"],["DEBUG","Detalles para depurar en desarrollo"],["TRACE","Máximo detalle, casi nunca en producción"]],
  why:"Con Lombok, @Slf4j crea el logger por ti."},
 {t:"opcion", p:"¿Por qué <code>log.debug(\"Pedido {}\", pedido)</code> y no <code>log.debug(\"Pedido \" + pedido)</code>?",
  ops:["Es igual","Con parámetros, si DEBUG está desactivado no se construye la cadena (ni se llama a toString): más eficiente","Por estilo","Porque + no funciona"],
  ok:1, why:"En código que se ejecuta millones de veces, la diferencia se nota."},
 {t:"vf", p:"MDC permite añadir automáticamente un identificador (de petición o de usuario) a todas las líneas de log de esa petición.",
  ok:true, why:"Micrometer Tracing ya coloca traceId y spanId en el MDC."},
 {t:"info", eti:"Una línea, un JSON", h:"Logs estructurados y MDC",
  c:`<div class="termbox">MDC.put("pedidoId", String.valueOf(id));      <span class="cm">// se añade a cada línea hasta que lo quites</span>
try {
    log.info("Pago aceptado");
} finally {
    MDC.remove("pedidoId");                      <span class="cm">// imprescindible: los hilos se reutilizan</span>
}</div>
     <div class="termbox">{"@timestamp":"2026-09-23T10:15:02.118Z","log.level":"INFO","message":"Pago aceptado",
 "service.name":"tareas-api","traceId":"4bf92f3577b34da6","pedidoId":"42"}</div>
     <p>Un sistema como Loki, Elasticsearch o CloudWatch indexa cada campo: buscas <code>pedidoId=42</code> y aparecen todas las líneas de ese pedido, de todas las réplicas.</p>`},
 {t:"term", p:"Sube a DEBUG el log del paquete <code>com.catappa</code> en caliente con el endpoint <code>loggers</code> de Actuator (POST con JSON)",
  prompt:"pablo@portatil:~$", sol:["curl -X POST localhost:8080/actuator/loggers/com.catappa -H 'Content-Type: application/json' -d '{\"configuredLevel\":\"DEBUG\"}'","curl -X POST http://localhost:8080/actuator/loggers/com.catappa -H 'Content-Type: application/json' -d '{\"configuredLevel\":\"DEBUG\"}'","curl -X POST localhost:8080/actuator/loggers/com.catappa -H \"Content-Type: application/json\" -d '{\"configuredLevel\":\"DEBUG\"}'","curl -X POST http://localhost:8080/actuator/loggers/com.catappa -H \"Content-Type: application/json\" -d '{\"configuredLevel\":\"DEBUG\"}'"],
  pista:"curl -X POST a /actuator/loggers/com.catappa con Content-Type JSON y el cuerpo {\"configuredLevel\":\"DEBUG\"}.",
  salida:`HTTP/1.1 204 No Content`, why:"Sin reiniciar: ideal para investigar un problema y volver a INFO después. El endpoint loggers debe estar expuesto y protegido."},
 {t:"opcion", p:"Un log de producción contiene <code>Login de ana@correo.com con clave Verano2026!</code>. ¿Qué harías?",
  ops:["Nada, los logs son internos","Quitar la clave del log ya mismo, tratar la filtración (cambiar la contraseña y purgar los logs) y revisar que no se registran cuerpos de petición con datos sensibles","Subir el nivel a ERROR","Cifrar el fichero de log"],
  ok:1, why:"Los logs los leen muchas personas y sistemas: nunca contraseñas, tokens ni datos de tarjeta."}
]}

]});
