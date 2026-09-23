window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Qué es Spring Boot",
resumen: "Spring y Spring Boot, crear un proyecto con Initializr, estructura, starters, autoconfiguración y el arranque",
nivel: "Fundamentos",
color: "#6db33f",
lecciones: [

{
id:"sp1l1",
titulo:"Spring y Spring Boot",
claves:["Spring es un framework que gestiona los objetos de tu aplicación y sus dependencias","Spring Boot configura Spring automáticamente con valores sensatos","Incluye servidor web embebido: la aplicación es un jar ejecutable"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué problema resuelve Spring?",
  c:`<p>Una aplicación backend real necesita muchas piezas: recibir peticiones HTTP, convertir JSON, validar datos, hablar con la base de datos, gestionar transacciones, seguridad, configuración por entorno, métricas...</p>
     <p><b>Spring</b> es un framework de Java que aporta todas esas piezas y, sobre todo, un <b>contenedor</b> que crea tus objetos y los conecta entre sí (inyección de dependencias). Tú escribes la lógica de negocio; Spring se encarga de la «fontanería».</p>`},
 {t:"info", eti:"El acelerador", h:"¿Y Spring Boot?",
  c:`<p>Configurar Spring «a mano» era largo. <b>Spring Boot</b> lo resuelve:</p>
     <ul><li><b>Autoconfiguración</b>: si ve el driver de PostgreSQL y una URL, configura la conexión sola.</li>
     <li><b>Starters</b>: una dependencia trae todo lo necesario para una función (web, datos, seguridad...).</li>
     <li><b>Servidor embebido</b>: Tomcat va dentro del jar. Se ejecuta con <code>java -jar app.jar</code>, perfecto para Docker.</li>
     <li><b>Listo para producción</b>: métricas, salud y configuración externa de serie.</li></ul>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Spring Framework","Contenedor de objetos e integraciones para aplicaciones Java"],["Spring Boot","Configuración automática y convenciones sobre Spring"],["Starter","Dependencia que agrupa todo lo necesario para una función"],["Servidor embebido","Tomcat incluido dentro del propio jar"]],
  why:"En las ofertas de empleo «Spring» casi siempre significa Spring Boot."},
 {t:"opcion", p:"¿Cómo se ejecuta normalmente una aplicación Spring Boot en producción?",
  ops:["Copiando un .war en un Tomcat instalado aparte","java -jar app.jar (normalmente dentro de un contenedor)","Con un script de PHP","Compilando en el servidor cada vez"],
  ok:1, why:"El jar ejecutable con servidor embebido es lo que se mete en la imagen Docker."},
 {t:"vf", p:"Spring Boot sustituye a Spring: son frameworks distintos.",
  ok:false, why:"Spring Boot está construido sobre Spring. Usa los mismos módulos, solo que preconfigurados."}
]},

{
id:"sp1l2",
titulo:"Crear un proyecto",
claves:["start.spring.io (Spring Initializr) genera el esqueleto","Elige Java 21, Maven o Gradle y las dependencias (starters)","La clase con @SpringBootApplication y main arranca todo"],
pasos:[
 {t:"info", eti:"Initializr", h:"Generar el proyecto",
  c:`<p>En <b>start.spring.io</b> (o desde IntelliJ) eliges:</p>
     <ul><li>Proyecto: Maven o Gradle. Lenguaje: Java. Versión de Spring Boot: la estable más reciente.</li>
     <li>Grupo y artefacto: <code>com.catappa</code> y <code>tareas-api</code>.</li>
     <li>Java: 21.</li>
     <li>Dependencias: Spring Web, Spring Data JPA, PostgreSQL Driver, Validation, Actuator...</li></ul>
     <div class="termbox"><span class="cm"># tambien desde la terminal</span>
curl https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,validation,actuator \\
     -d javaVersion=21 -d groupId=com.catappa -d artifactId=tareas-api -o tareas-api.zip</div>`},
 {t:"info", eti:"Lo que obtienes", h:"Estructura del proyecto",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">tareas-api/</span></div><div class="rama" style="--n:1"><span class="nom">mvnw, mvnw.cmd, pom.xml</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/main/java/com/catappa/tareasapi/</span></div><div class="rama" style="--n:3"><span class="nom">TareasApiApplication.java</span><span class="coment">&amp;lt;- punto de entrada</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/main/resources/</span></div><div class="rama" style="--n:3"><span class="nom">application.properties</span><span class="coment">&amp;lt;- configuracion</span></div><div class="rama" style="--n:3"><span class="nom carpeta">static/</span><span class="coment">templates/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/test/java/com/catappa/tareasapi/</span></div><div class="rama" style="--n:3"><span class="nom">TareasApiApplicationTests.java</span></div></div>
     <div class="termbox">@SpringBootApplication
public class TareasApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(TareasApiApplication.class, args);
    }
}</div>`},
 {t:"term", p:"Arranca la aplicación en modo desarrollo con el wrapper de Maven",
  prompt:"pablo@portatil:~/tareas-api$", sol:["./mvnw spring-boot:run","mvnw spring-boot:run","mvn spring-boot:run"],
  pista:"./mvnw y el objetivo spring-boot:run.",
  salida:`  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\
 :: Spring Boot ::                (v3.5.0)
Tomcat started on port 8080 (http) with context path '/'
Started TareasApiApplication in 1.9 seconds`, why:"Por defecto escucha en el puerto 8080."},
 {t:"par", p:"Empareja cada starter con lo que aporta",
  pares:[["spring-boot-starter-web","API REST con Spring MVC, Tomcat y JSON"],["spring-boot-starter-data-jpa","Acceso a base de datos con JPA e Hibernate"],["spring-boot-starter-validation","Validación con anotaciones (@NotBlank...)"],["spring-boot-starter-security","Autenticación y autorización"],["spring-boot-starter-actuator","Salud, métricas e información de la aplicación"]],
  why:"Los starters traen versiones compatibles entre sí: se acabaron los conflictos de dependencias."},
 {t:"vf", p:"Sin la dependencia <code>spring-boot-starter-web</code>, la aplicación no arranca un servidor HTTP.",
  ok:true, why:"La autoconfiguración solo arranca Tomcat si ve las clases de Spring MVC en el classpath."}
]},

{
id:"sp1l3",
titulo:"Autoconfiguración y arranque",
claves:["@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan","La autoconfiguración actúa según lo que hay en el classpath y en la configuración","El escaneo de componentes empieza en el paquete de la clase principal"],
pasos:[
 {t:"info", eti:"La anotación mágica", h:"@SpringBootApplication",
  c:`<ul><li><b>@Configuration</b>: esta clase puede definir beans.</li>
     <li><b>@EnableAutoConfiguration</b>: activa la configuración automática.</li>
     <li><b>@ComponentScan</b>: busca clases anotadas (@Service, @RestController...) en este paquete y sus subpaquetes.</li></ul>
     <p>Por eso la clase principal va en el paquete raíz (<code>com.catappa.tareasapi</code>) y el resto en subpaquetes. Una clase en <code>com.catappa.otra</code> no se encontraría.</p>`},
 {t:"info", eti:"Condiciones", h:"Cómo decide la autoconfiguración",
  c:`<p>Cada autoconfiguración tiene condiciones:</p>
     <ul><li>¿Está la clase <code>DataSource</code> en el classpath? ¿Hay <code>spring.datasource.url</code>? → crea un pool de conexiones HikariCP.</li>
     <li>¿Has definido tú ya un bean de ese tipo? → entonces no crea el suyo (<code>@ConditionalOnMissingBean</code>): <b>tu configuración siempre gana</b>.</li></ul>
     <div class="termbox"><span class="cm"># ver que se ha autoconfigurado y por que</span>
./mvnw spring-boot:run -Dspring-boot.run.arguments=--debug</div>`},
 {t:"orden", p:"Ordena lo que ocurre al arrancar una aplicación Spring Boot",
  items:["main llama a SpringApplication.run","Se carga la configuración (properties, YAML, variables de entorno)","Se escanean los componentes y se aplican las autoconfiguraciones","Se crean los beans e inyectan sus dependencias","Arranca el servidor web embebido y la aplicación queda lista"],
  why:"Si algo falla al arrancar, el log indica en qué paso (por ejemplo, un bean que no se puede crear)."},
 {t:"opcion", p:"Tu <code>PedidoController</code> está en <code>com.catappa.web</code> y la clase principal en <code>com.catappa.tareasapi</code>. Las rutas devuelven 404. ¿Por qué?",
  ops:["Falta un Service","El controlador está fuera del paquete escaneado (com.catappa.tareasapi y subpaquetes)","Tomcat no arrancó","Falta @Bean"],
  ok:1, why:"Mueve el paquete bajo el raíz o amplía @SpringBootApplication(scanBasePackages = ...)."},
 {t:"vf", p:"Si defines tu propio bean <code>DataSource</code>, Spring Boot deja de crear el suyo automáticamente.",
  ok:true, why:"La autoconfiguración retrocede ante los beans que defines tú."}
]}

]});
