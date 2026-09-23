window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Qué es Spring Boot",
resumen: "Spring y Spring Boot, crear un proyecto con Initializr, estructura, starters, versiones y BOM, autoconfiguración y el arranque",
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
     <li><b>Listo para producción</b>: métricas, salud y configuración externa de serie.</li></ul>
     <div class="dg"><div class="dg-tit">qué pone cada capa</div>
       <div class="dg-pila">
         <div class="dg-caja acento">tu código<small>controladores, servicios, entidades</small></div>
         <div class="dg-caja">Spring Boot<small>autoconfiguración, starters, servidor embebido, Actuator</small></div>
         <div class="dg-caja">Spring Framework<small>contenedor IoC, MVC, transacciones, AOP</small></div>
         <div class="dg-caja base">JVM (Java 17 como mínimo; 21 o 25 recomendado)</div>
       </div>
     </div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Spring Framework","Contenedor de objetos e integraciones para aplicaciones Java"],["Spring Boot","Configuración automática y convenciones sobre Spring"],["Starter","Dependencia que agrupa todo lo necesario para una función"],["Servidor embebido","Tomcat incluido dentro del propio jar"]],
  why:"En las ofertas de empleo «Spring» casi siempre significa Spring Boot."},
 {t:"opcion", p:"¿Cómo se ejecuta normalmente una aplicación Spring Boot en producción?",
  ops:["Copiando un .war en un Tomcat instalado aparte","java -jar app.jar (normalmente dentro de un contenedor)","Con un script de PHP","Compilando en el servidor cada vez"],
  ok:1, why:"El jar ejecutable con servidor embebido es lo que se mete en la imagen Docker."},
 {t:"vf", p:"Spring Boot sustituye a Spring: son frameworks distintos.",
  ok:false, why:"Spring Boot está construido sobre Spring. Usa los mismos módulos, solo que preconfigurados."},
 {t:"opcion", p:"Tu empresa te pide una API REST con PostgreSQL, seguridad por token y métricas para Prometheus. ¿Qué te ahorra Spring Boot frente a Spring «a secas»?",
  ops:["Escribir la lógica de negocio","Configurar a mano el servidor, el pool de conexiones, Jackson, la cadena de seguridad y el registro de métricas: lo deduce de las dependencias y de unas pocas propiedades","Tener que saber SQL","Escribir pruebas"],
  ok:1, why:"La lógica de negocio sigue siendo tuya; lo que desaparece es la configuración repetitiva."},
 {t:"vf", p:"Una aplicación Spring Boot puede no ser web: por ejemplo, un proceso que consume de Kafka o una tarea por lotes.",
  ok:true, why:"Sin starter web no hay servidor HTTP; el contenedor, la configuración y la inyección funcionan igual."}
]},

{
id:"sp1l2",
titulo:"Crear un proyecto",
claves:["start.spring.io (Spring Initializr) genera el esqueleto","Elige Java 21 o 25, Maven o Gradle y las dependencias (starters)","La clase con @SpringBootApplication y main arranca todo"],
pasos:[
 {t:"info", eti:"Initializr", h:"Generar el proyecto",
  c:`<p>En <b>start.spring.io</b> (o desde IntelliJ) eliges:</p>
     <ul><li>Proyecto: Maven o Gradle. Lenguaje: Java. Versión de Spring Boot: la estable más reciente.</li>
     <li>Grupo y artefacto: <code>com.catappa</code> y <code>tareas-api</code>.</li>
     <li>Java: 21 (o 25, la LTS más reciente).</li>
     <li>Dependencias: Spring Web, Spring Data JPA, PostgreSQL Driver, Validation, Actuator...</li></ul>
     <div class="termbox"><span class="cm"># también desde la terminal</span>
curl https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,validation,actuator \\
     -d javaVersion=21 -d groupId=com.catappa -d artifactId=tareas-api -o tareas-api.zip</div>`},
 {t:"info", eti:"Lo que obtienes", h:"Estructura del proyecto",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">tareas-api/</span></div><div class="rama" style="--n:1"><span class="nom">mvnw, mvnw.cmd, pom.xml</span><span class="coment">wrapper y dependencias</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/main/java/com/catappa/tareasapi/</span></div><div class="rama" style="--n:2"><span class="nom">TareasApiApplication.java</span><span class="coment">punto de entrada</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/main/resources/</span></div><div class="rama" style="--n:2"><span class="nom">application.properties</span><span class="coment">configuración</span></div><div class="rama" style="--n:2"><span class="nom carpeta">static/</span><span class="coment">y templates/</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/test/java/com/catappa/tareasapi/</span></div><div class="rama" style="--n:2"><span class="nom">TareasApiApplicationTests.java</span></div></div>
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
 :: Spring Boot ::                (v3.5.6)
Tomcat started on port 8080 (http) with context path '/'
Started TareasApiApplication in 1.9 seconds`, why:"Por defecto escucha en el puerto 8080."},
 {t:"par", p:"Empareja cada starter con lo que aporta",
  pares:[["spring-boot-starter-web","API REST con Spring MVC, Tomcat y JSON"],["spring-boot-starter-data-jpa","Acceso a base de datos con JPA e Hibernate"],["spring-boot-starter-validation","Validación con anotaciones (@NotBlank...)"],["spring-boot-starter-security","Autenticación y autorización"],["spring-boot-starter-actuator","Salud, métricas e información de la aplicación"]],
  why:"Los starters traen versiones compatibles entre sí: se acabaron los conflictos de dependencias."},
 {t:"vf", p:"Sin la dependencia <code>spring-boot-starter-web</code>, la aplicación no arranca un servidor HTTP.",
  ok:true, why:"La autoconfiguración solo arranca Tomcat si ve las clases de Spring MVC en el classpath."},
 {t:"term", p:"Empaqueta la aplicación en un jar ejecutable con el wrapper de Maven, saltándote las pruebas",
  prompt:"pablo@portatil:~/tareas-api$", sol:["./mvnw package -DskipTests","./mvnw -DskipTests package","mvnw package -DskipTests","./mvnw clean package -DskipTests","./mvnw -q package -DskipTests","mvn package -DskipTests"],
  pista:"El objetivo package y la propiedad -DskipTests.",
  salida:`[INFO] Building jar: /home/pablo/tareas-api/target/tareas-api-0.0.1-SNAPSHOT.jar
[INFO] BUILD SUCCESS`, why:"El jar queda en target/ y se ejecuta con java -jar target/tareas-api-0.0.1-SNAPSHOT.jar. Con Gradle sería ./gradlew bootJar."},
 {t:"opcion", p:"Un compañero no tiene Maven instalado. ¿Cómo compila el proyecto?",
  ops:["Tiene que instalar Maven a mano en la versión exacta","Con el wrapper ./mvnw, que descarga la versión de Maven fijada en el proyecto","No puede","Copiando tu carpeta target"],
  ok:1, why:"El wrapper (mvnw o gradlew) garantiza que todo el equipo y el CI usan la misma versión de la herramienta de construcción."}
]},

{
id:"sp1l3",
titulo:"Autoconfiguración y arranque",
claves:["@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan","La autoconfiguración actúa según lo que hay en el classpath, en la configuración y en tus propios beans","El escaneo de componentes empieza en el paquete de la clase principal"],
pasos:[
 {t:"info", eti:"La anotación mágica", h:"@SpringBootApplication",
  c:`<ul><li><b>@Configuration</b> (en realidad <code>@SpringBootConfiguration</code>): esta clase puede definir beans.</li>
     <li><b>@EnableAutoConfiguration</b>: activa la configuración automática.</li>
     <li><b>@ComponentScan</b>: busca clases anotadas (@Service, @RestController...) en este paquete y sus subpaquetes.</li></ul>
     <p>Por eso la clase principal va en el paquete raíz (<code>com.catappa.tareasapi</code>) y el resto en subpaquetes. Una clase en <code>com.catappa.otra</code> no se encontraría.</p>`},
 {t:"info", eti:"Condiciones", h:"Cómo decide la autoconfiguración",
  c:`<p>Cada autoconfiguración es una clase <code>@AutoConfiguration</code> con condiciones. Spring Boot las encuentra en el fichero <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> de cada jar:</p>
     <div class="termbox">@AutoConfiguration
@ConditionalOnClass(DataSource.class)                 <span class="cm">// ¿hay driver JDBC en el classpath?</span>
public class DataSourceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean                         <span class="cm">// ¿has definido tú uno?</span>
    DataSource dataSource(DataSourceProperties props) { ... }   <span class="cm">// HikariCP</span>
}</div>
     <ul><li>¿Está la clase en el classpath? ¿Hay <code>spring.datasource.url</code>? → crea un pool de conexiones HikariCP.</li>
     <li>¿Has definido tú ya un bean de ese tipo? → entonces no crea el suyo: <b>tu configuración siempre gana</b>.</li></ul>
     <div class="termbox"><span class="cm"># ver qué se ha autoconfigurado y por qué (informe de condiciones)</span>
java -jar app.jar --debug</div>`},
 {t:"orden", p:"Ordena lo que ocurre al arrancar una aplicación Spring Boot",
  items:["main llama a SpringApplication.run","Se carga la configuración (properties, YAML, variables de entorno)","Se escanean los componentes y se aplican las autoconfiguraciones","Se crean los beans e inyectan sus dependencias","Arranca el servidor web embebido y la aplicación queda lista"],
  why:"Si algo falla al arrancar, el log indica en qué paso (por ejemplo, un bean que no se puede crear)."},
 {t:"opcion", p:"Tu <code>PedidoController</code> está en <code>com.catappa.web</code> y la clase principal en <code>com.catappa.tareasapi</code>. Las rutas devuelven 404. ¿Por qué?",
  ops:["Falta un Service","El controlador está fuera del paquete escaneado (com.catappa.tareasapi y subpaquetes)","Tomcat no arrancó","Falta @Bean"],
  ok:1, why:"Mueve el paquete bajo el raíz o amplía @SpringBootApplication(scanBasePackages = ...)."},
 {t:"vf", p:"Si defines tu propio bean <code>DataSource</code>, Spring Boot deja de crear el suyo automáticamente.",
  ok:true, why:"La autoconfiguración retrocede ante los beans que defines tú (@ConditionalOnMissingBean)."},
 {t:"par", p:"Empareja cada condición con cuándo se cumple",
  pares:[["@ConditionalOnClass","Una clase está en el classpath"],["@ConditionalOnMissingBean","No existe ya un bean de ese tipo"],["@ConditionalOnProperty","Una propiedad tiene cierto valor"],["@ConditionalOnWebApplication","La aplicación es web"],["@ConditionalOnBean","Ya existe un bean concreto"]],
  why:"Son las mismas condiciones que puedes usar en tus propias configuraciones y starters internos."},
 {t:"hueco", p:"Completa para desactivar una autoconfiguración concreta",
  tpl:"@SpringBootApplication(___ = DataSourceAutoConfiguration.class)", banco:["exclude","scanBasePackages","ignore","disable"], sol:["exclude"],
  why:"También con la propiedad spring.autoconfigure.exclude. Úsalo poco: normalmente basta con definir tu propio bean."},
 {t:"opcion", p:"Tu empresa quiere que todos sus microservicios tengan el mismo cliente de auditoría configurado sin copiar código. ¿Qué construirías?",
  ops:["Copiar la clase en cada proyecto","Un starter interno: un módulo con una clase @AutoConfiguration con condiciones, registrada en AutoConfiguration.imports, que cada servicio añade como dependencia","Un script que edite los pom.xml","Una variable de entorno"],
  ok:1, why:"Es exactamente como funcionan los starters oficiales, y cada servicio puede sobrescribir el bean si lo necesita."}
]},

{
id:"sp1n1",
titulo:"Versiones, dependencias y el BOM",
claves:["El parent o el BOM de Spring Boot fija versiones compatibles de cientos de librerías","Spring Boot 3.x usa Spring Framework 6 y Jakarta EE; Spring Boot 4 usa Spring Framework 7","No pongas versiones a mano a las dependencias que ya gestiona Boot"],
pasos:[
 {t:"info", eti:"Versiones sin dolor", h:"El parent y el BOM",
  c:`<div class="termbox">&lt;parent&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
  &lt;version&gt;3.5.6&lt;/version&gt;
&lt;/parent&gt;

&lt;dependencies&gt;
  &lt;dependency&gt;
    &lt;groupId&gt;org.postgresql&lt;/groupId&gt;
    &lt;artifactId&gt;postgresql&lt;/artifactId&gt;          <span class="cm">&lt;!-- sin version: la pone Boot --&gt;</span>
    &lt;scope&gt;runtime&lt;/scope&gt;
  &lt;/dependency&gt;
&lt;/dependencies&gt;</div>
     <p>El parent importa un <b>BOM</b> (<i>bill of materials</i>): una lista de versiones probadas juntas de Jackson, Hibernate, el driver de PostgreSQL, Micrometer, Testcontainers... Si tu proyecto ya tiene su propio parent, importas el BOM <code>spring-boot-dependencies</code> en <code>dependencyManagement</code>. En Gradle, el plugin <code>org.springframework.boot</code> hace lo mismo.</p>`},
 {t:"info", eti:"Generaciones", h:"Qué versión es qué",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">generaciones de spring boot</div><table class="dg-tabla"><thead><tr><th>Spring Boot</th><th>Spring Framework</th><th>Lo que cambia</th></tr></thead><tbody>
       <tr><td>2.7</td><td>5.3</td><td>Java 8, paquetes <code>javax.*</code>; sin soporte gratuito</td></tr>
       <tr><td>3.x (3.5 la última)</td><td>6.x</td><td>Java 17 mínimo, <code>jakarta.*</code>, observabilidad con Micrometer, ProblemDetail, RestClient, hilos virtuales, imágenes nativas</td></tr>
       <tr><td>4.x</td><td>7.x</td><td>Jakarta EE 11, Jackson 3, versionado de APIs y reintentos en el propio framework, clientes HTTP declarativos más sencillos, módulos más pequeños</td></tr>
     </tbody></table></div>
     <p>Java 17 sigue siendo el mínimo en Boot 4, pero lo normal en proyectos nuevos es Java 21 o 25 (LTS). Migrar de 2.7 a 3 exige cambiar <code>javax.persistence</code> por <code>jakarta.persistence</code>: el cambio que más proyectos ha retrasado.</p>`},
 {t:"opcion", p:"Añades <code>jackson-databind</code> con una versión escrita a mano distinta de la del BOM y empiezan errores raros de <code>NoSuchMethodError</code>. ¿Qué ha pasado?",
  ops:["Jackson tiene un bug","Has roto la alineación de versiones: otras librerías del BOM esperan otra versión de Jackson. Quita la versión y deja que la gestione Boot","Falta memoria","Hay que reiniciar el IDE"],
  ok:1, why:"Si de verdad necesitas otra versión, se cambia con la propiedad que usa el BOM (por ejemplo &lt;jackson-bom.version&gt;), no dependencia a dependencia."},
 {t:"term", p:"Muestra el árbol de dependencias del proyecto con el wrapper de Maven para ver de dónde sale cada librería",
  prompt:"pablo@portatil:~/tareas-api$", sol:["./mvnw dependency:tree","mvnw dependency:tree","mvn dependency:tree","./mvnw -q dependency:tree"],
  pista:"El plugin dependency y su objetivo tree.",
  salida:`[INFO] com.catappa:tareas-api:jar:0.0.1-SNAPSHOT
[INFO] +- org.springframework.boot:spring-boot-starter-web:jar:3.5.6:compile
[INFO] |  +- org.springframework.boot:spring-boot-starter-json:jar:3.5.6:compile
[INFO] |  |  \\- com.fasterxml.jackson.core:jackson-databind:jar:2.19.2:compile
[INFO] |  +- org.springframework.boot:spring-boot-starter-tomcat:jar:3.5.6:compile
[INFO] |  \\- org.springframework:spring-webmvc:jar:6.2.11:compile
[INFO] \\- org.postgresql:postgresql:jar:42.7.7:runtime`, why:"Es la herramienta para investigar conflictos: qué versión llega y a través de qué dependencia. En Gradle: ./gradlew dependencies."},
 {t:"par", p:"Empareja cada ámbito (scope) de Maven con su uso",
  pares:[["compile","Necesaria para compilar y ejecutar (por defecto)"],["runtime","Solo al ejecutar, como el driver JDBC"],["test","Solo en las pruebas (JUnit, Testcontainers)"],["provided","La aporta el entorno de ejecución"]],
  why:"El driver de PostgreSQL va en runtime: tu código habla con JDBC, no con clases del driver."},
 {t:"vf", p:"Al pasar de Spring Boot 2.7 a 3.x hay que cambiar los imports <code>javax.persistence</code> y <code>javax.validation</code> por <code>jakarta.persistence</code> y <code>jakarta.validation</code>.",
  ok:true, why:"Jakarta EE cambió el espacio de nombres. Herramientas como OpenRewrite automatizan buena parte de la migración."},
 {t:"opcion", p:"Vas a empezar un proyecto nuevo en septiembre de 2026. ¿Qué versión eliges?",
  ops:["Spring Boot 2.7, que es la que conoce todo el mundo","La versión estable más reciente de Spring Boot 4 con Java 21 o 25, salvo que una librería crítica aún no la soporte","Cualquiera, da igual","La versión snapshot"],
  ok:1, why:"2.7 ya no recibe parches gratuitos. Empezar en la última generación evita una migración a los pocos meses."}
]}

]});
