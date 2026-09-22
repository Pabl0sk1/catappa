window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Spring Boot en producción",
resumen: "Actuator y health checks, métricas con Micrometer y Prometheus, logs estructurados, trazas, imágenes Docker y despliegue en Kubernetes",
nivel: "Experto",
color: "#3a7e22",
lecciones: [

{
id:"sp11l1",
titulo:"Actuator y salud",
claves:["Actuator expone /actuator/health, /info, /metrics, /prometheus...","Grupos de salud liveness y readiness para Kubernetes","Expón solo lo necesario y protege el resto"],
pasos:[
 {t:"info", eti:"Ver por dentro", h:"Spring Boot Actuator",
  c:`<div class="termbox">management:
  endpoints:
    web:
      exposure:
        include: health, info, prometheus
  endpoint:
    health:
      probes:
        enabled: true          <span class="cm"># /actuator/health/liveness y /readiness</span>
      show-details: never</div>
     <div class="termbox">pablo@portatil:~$ curl localhost:8080/actuator/health
{"status":"UP","groups":["liveness","readiness"]}</div>
     <p>El health comprueba automáticamente la base de datos, el disco, Redis... según lo que uses.</p>`},
 {t:"par", p:"Empareja cada endpoint de Actuator con su uso",
  pares:[["/actuator/health/liveness","¿Está vivo el proceso? Si no, Kubernetes lo reinicia"],["/actuator/health/readiness","¿Puede recibir tráfico ahora?"],["/actuator/prometheus","Métricas en formato Prometheus"],["/actuator/info","Versión, commit y datos de la build"],["/actuator/env","Configuración (sensible: no exponer en público)"]],
  why:"Nunca expongas /env, /heapdump o /configprops sin protección: filtran secretos."},
 {t:"opcion", p:"¿Debería el grupo de liveness incluir la comprobación de la base de datos?",
  ops:["Sí, siempre","No: si la base de datos cae, Kubernetes reiniciaría todos los pods sin arreglar nada. La base de datos va en readiness","Da igual","Solo en desarrollo"],
  ok:1, why:"Liveness solo debe fallar si el proceso está realmente roto."},
 {t:"vf", p:"<code>management.endpoints.web.exposure.include: \"*\"</code> es seguro en producción.",
  ok:false, why:"Expondría endpoints sensibles como env o heapdump."}
]},

{
id:"sp11l2",
titulo:"Métricas, logs y trazas",
claves:["Micrometer publica métricas (http.server.requests, JVM, Hikari) hacia Prometheus","Logs estructurados en JSON con identificadores de traza","Micrometer Tracing + OpenTelemetry para seguir una petición entre servicios"],
pasos:[
 {t:"info", eti:"Medir", h:"Micrometer",
  c:`<p>Con <code>micrometer-registry-prometheus</code>, tienes gratis métricas de peticiones HTTP (por ruta, método y código), JVM (heap, GC, hilos), pool de conexiones y más. Y puedes añadir las tuyas:</p>
     <div class="termbox">@Service
class PedidoService {
    private final Counter pagados;
    PedidoService(MeterRegistry registry) {
        this.pagados = Counter.builder("pedidos.pagados").description("Pedidos pagados").register(registry);
    }
    void pagar(...) { ...; pagados.increment(); }
}

@Timed("pagos.pasarela")
ResultadoPago cobrar(...) { ... }</div>`},
 {t:"info", eti:"Contar lo que pasa", h:"Logs y trazas",
  c:`<div class="termbox">logging:
  structured:
    format:
      console: ecs            <span class="cm"># logs JSON (Spring Boot 3.4+)</span>
management:
  tracing:
    sampling:
      probability: 0.1        <span class="cm"># trazar el 10% de las peticiones</span></div>
     <p>Con <b>Micrometer Tracing</b> y OpenTelemetry, cada petición lleva un <code>traceId</code> que se propaga a los servicios que llama y aparece en todos los logs: buscas ese id y ves el recorrido completo.</p>`},
 {t:"par", p:"Empareja cada métrica con lo que indica",
  pares:[["http_server_requests_seconds","Latencia y número de peticiones por ruta y código"],["jvm_memory_used_bytes","Memoria de la JVM"],["hikaricp_connections_pending","Hilos esperando una conexión a la base de datos"],["jvm_gc_pause_seconds","Pausas del recolector de basura"]],
  why:"hikaricp_connections_pending > 0 de forma sostenida: pool pequeño o consultas lentas."},
 {t:"opcion", p:"Un usuario reporta un error; tienes 6 microservicios. ¿Qué te permite encontrar rápido todos sus logs relacionados?",
  ops:["Buscar por la hora aproximada","El traceId propagado entre servicios y presente en cada línea de log","Reiniciar los servicios","Leer todos los logs"],
  ok:1, why:"Devuelve el traceId en las respuestas de error para que soporte lo pueda buscar."},
 {t:"vf", p:"Micrometer es a las métricas lo que SLF4J a los logs: una fachada para varios sistemas de monitorización.",
  ok:true, why:"Cambias de Prometheus a Datadog cambiando una dependencia."}
]},

{
id:"sp11l3",
titulo:"Imágenes y despliegue",
claves:["Multi-stage Dockerfile o Buildpacks (spring-boot:build-image)","Capas del jar para que los cambios de código no reconstruyan dependencias","Apagado elegante, probes y configuración por variables en Kubernetes"],
pasos:[
 {t:"info", eti:"Empaquetar", h:"Dockerfile por capas",
  c:`<div class="termbox">FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY . .
RUN ./mvnw -q package -DskipTests \\
 &amp;&amp; java -Djarmode=tools -jar target/*.jar extract --layers --launcher --destination extraido

FROM eclipse-temurin:21-jre
RUN useradd -r -u 10001 app
WORKDIR /app
COPY --from=build /src/extraido/dependencies/ ./
COPY --from=build /src/extraido/spring-boot-loader/ ./
COPY --from=build /src/extraido/snapshot-dependencies/ ./
COPY --from=build /src/extraido/application/ ./
USER app
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]</div>
     <p>Las dependencias cambian poco y quedan en una capa cacheada; tu código cambia en cada commit y va en la última. O sin Dockerfile: <code>./mvnw spring-boot:build-image</code> (Buildpacks).</p>`},
 {t:"info", eti:"Kubernetes", h:"Lo que tu aplicación necesita",
  c:`<div class="termbox">server:
  shutdown: graceful                 <span class="cm"># terminar peticiones en curso al recibir SIGTERM</span>
spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s</div>
     <ul><li><b>readinessProbe</b> en <code>/actuator/health/readiness</code> y <b>livenessProbe</b> en <code>/actuator/health/liveness</code>.</li>
     <li>Configuración con variables de entorno desde ConfigMaps y Secrets (<code>SPRING_DATASOURCE_URL</code>...).</li>
     <li>requests y limits de memoria coherentes con <code>MaxRAMPercentage</code>.</li></ul>`},
 {t:"par", p:"Empareja cada ajuste con el problema que evita",
  pares:[["server.shutdown=graceful","Cortar peticiones en curso durante un despliegue"],["Capas del jar","Reconstruir y subir las dependencias en cada cambio de código"],["USER no root","Que un fallo en la app dé control de root en el contenedor"],["MaxRAMPercentage","Que el heap no respete el límite del contenedor (OOMKilled)"],["Readiness probe","Recibir tráfico antes de estar lista"]],
  why:"Esto es exactamente lo que une este curso con los de Docker y Kubernetes."},
 {t:"term", p:"Genera una imagen OCI de la aplicación con Buildpacks usando el wrapper de Maven",
  prompt:"pablo@portatil:~/tareas-api$", sol:["./mvnw spring-boot:build-image","mvnw spring-boot:build-image","mvn spring-boot:build-image"],
  pista:"./mvnw y el objetivo spring-boot:build-image.",
  salida:`[INFO] Successfully built image 'docker.io/library/tareas-api:0.0.1-SNAPSHOT'
[INFO] BUILD SUCCESS`, why:"Buildpacks crea una imagen optimizada, por capas y sin root, sin escribir Dockerfile."}
]},

{
id:"sp11l4",
titulo:"Entorno local con Docker Compose",
claves:["spring-boot-docker-compose arranca los servicios de compose.yaml al iniciar la app","Testcontainers también en desarrollo (TestcontainersConfiguration)","@ServiceConnection configura la conexión sin propiedades"],
pasos:[
 {t:"info", eti:"Desarrollo sin fricción", h:"Compose integrado",
  c:`<div class="termbox"># compose.yaml en la raiz del proyecto
services:
  postgres:
    image: postgres:17-alpine
    environment: { POSTGRES_DB: tareas, POSTGRES_USER: app, POSTGRES_PASSWORD: secreto }
    ports: ["5432"]
  redis:
    image: redis:7-alpine
    ports: ["6379"]</div>
     <p>Con la dependencia <code>spring-boot-docker-compose</code>, al ejecutar la aplicación Spring Boot lanza <code>docker compose up</code>, espera a que los servicios estén listos y <b>configura solo</b> la URL, usuario y contraseña de la base de datos y de Redis. Sin tocar application.yml.</p>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["spring-boot-docker-compose","Arrancar las dependencias de compose.yaml al iniciar la app en local"],["Testcontainers en pruebas","Base de datos real y desechable en cada ejecución de tests"],["@ServiceConnection","Conectar Spring con un contenedor sin propiedades manuales"],["./mvnw spring-boot:test-run","Arrancar la app en local usando la configuración de Testcontainers"]],
  why:"Un compañero nuevo clona el repositorio, ejecuta la app y todo funciona: esa es la meta."},
 {t:"vf", p:"Con spring-boot-docker-compose no hace falta escribir la URL de la base de datos en application.yml para desarrollo local.",
  ok:true, why:"Spring la deduce del servicio de compose.yaml."}
]}

]});
