window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Maestría: casos reales y entrevista",
resumen: "Diagnóstico de problemas típicos de aplicaciones Spring en producción y simulacro de entrevista de Spring Boot",
nivel: "Maestro",
color: "#2c6a17",
lecciones: [

{
id:"sp13l1",
titulo:"Incidentes en aplicaciones Spring",
claves:["Lentitud: métricas por endpoint, pool de conexiones, SQL generado","Errores al arrancar: lee el primer «Caused by» del log","Memoria: heap, hilos y tamaños de pool frente al límite del contenedor"],
pasos:[
 {t:"info", eti:"Caso 1", h:"«La API tarda 8 segundos en el listado de pedidos»",
  c:`<ol><li>Métricas: <code>http_server_requests</code> confirma que solo ese endpoint es lento.</li>
     <li>Log de SQL en un entorno de pruebas: 1 consulta de pedidos + 400 consultas de clientes → <b>N+1</b>.</li>
     <li>Solución: <code>@EntityGraph(attributePaths = "cliente")</code> o proyección a DTO. Además, paginar.</li>
     <li>Prevención: una prueba que cuente las consultas (por ejemplo con datasource-proxy) y alertas de latencia por endpoint.</li></ol>`},
 {t:"opcion", p:"Caso 2: con carga, las peticiones fallan con «Connection is not available, request timed out after 30000ms». ¿Qué es?",
  ops:["La red","El pool de HikariCP está agotado: consultas lentas, transacciones que retienen conexiones (llamadas HTTP dentro de @Transactional) o un pool demasiado pequeño","Falta memoria","Un bug de Tomcat"],
  ok:1, why:"Mira hikaricp_connections_pending y busca transacciones largas. Subir el pool a ciegas suele empeorarlo."},
 {t:"opcion", p:"Caso 3: la aplicación no arranca: «Parameter 0 of constructor in PedidoService required a bean of type 'PasarelaPago' that could not be found». ¿Qué pasa?",
  ops:["Falta memoria","No hay ningún bean que implemente PasarelaPago: falta la anotación en la implementación, está fuera del paquete escaneado o depende de un perfil no activo","Hay dos beans","Error de base de datos"],
  ok:1, why:"El mensaje de Spring suele decir exactamente qué falta; lee el primer «Caused by»."},
 {t:"opcion", p:"Caso 4: tras añadir <code>@Transactional</code> al método que llama internamente a <code>this.guardarAuditoria()</code> (con REQUIRES_NEW), la auditoría se deshace junto al error. ¿Por qué?",
  ops:["Un bug","La autollamada no pasa por el proxy: REQUIRES_NEW se ignora y todo va en la misma transacción. Mueve el método a otro bean","REQUIRES_NEW no existe","Falta readOnly"],
  ok:1, why:"El proxy es la clave para entender @Transactional, @Async y @Cacheable."},
 {t:"par", p:"Empareja cada síntoma con su primera sospecha",
  pares:[["Muchas consultas SQL por petición","N+1 en relaciones perezosas"],["Timeout esperando conexión","Pool agotado o transacciones largas"],["LazyInitializationException","Acceso a relación fuera de la transacción"],["OOMKilled en Kubernetes","Heap demasiado grande para el límite del contenedor"],["El endpoint devuelve 403 a todos","Reglas de seguridad o CSRF activo en una API con tokens"]],
  why:"Estos cinco cubren una gran parte de los incidentes reales de aplicaciones Spring."}
]},

{
id:"sp13l2",
titulo:"Simulacro de entrevista de Spring Boot",
claves:["Has repasado las preguntas más frecuentes de Spring Boot","Sabes explicar DI, JPA, transacciones, seguridad y producción","Estás preparado para una entrevista de backend Java con Spring"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Contesta en voz alta y, si puedes, con un ejemplo de tu proyecto (la API de tareas con Docker que has practicado).</p>`},
 {t:"opcion", p:"«¿Qué hace @SpringBootApplication?»",
  ops:["Arranca Tomcat","Combina @Configuration, @EnableAutoConfiguration y @ComponentScan: define configuración, activa la autoconfiguración según el classpath y escanea componentes desde su paquete","Crea la base de datos","Nada, es decorativa"],
  ok:1, why:"Añade que la clase principal debe estar en el paquete raíz."},
 {t:"opcion", p:"«¿Diferencia entre @Component, @Service, @Repository y @Controller?»",
  ops:["Ninguna en absoluto","Todas registran beans; indican el papel en la arquitectura y algunas añaden comportamiento: @Repository traduce excepciones de persistencia y @Controller gestiona peticiones web","@Service es más rápido","@Repository crea tablas"],
  ok:1, why:"La respuesta «son iguales» se queda corta."},
 {t:"opcion", p:"«¿Cómo funciona @Transactional y cuándo no funciona?»",
  ops:["Siempre funciona","Un proxy abre la transacción al entrar y hace commit o rollback al salir; no funciona en autollamadas, métodos private, ni hace rollback por defecto con excepciones comprobadas","Solo funciona en controladores","Es una anotación de JPA"],
  ok:1, why:"Mencionar el proxy demuestra que entiendes cómo funciona Spring por dentro."},
 {t:"opcion", p:"«¿Qué es el problema N+1 y cómo lo resuelves en Spring Data JPA?»",
  ops:["Un error de compilación","Una consulta para la lista y otra por cada elemento al acceder a una relación perezosa; se resuelve con join fetch, @EntityGraph, proyecciones a DTO o @BatchSize","Un problema de Tomcat","Un fallo de seguridad"],
  ok:1, why:"Añade cómo lo detectas: log de SQL o contando consultas en pruebas."},
 {t:"opcion", p:"«¿Cómo asegurarías una API REST con Spring Security?»",
  ops:["Con una contraseña en la URL","API sin estado con JWT validados como Resource Server, reglas por ruta y @PreAuthorize, autorización por objeto, contraseñas con BCrypt si gestionas usuarios, CORS restringido y HTTPS","Desactivando la seguridad y usando un WAF","Con sesiones en memoria"],
  ok:1, why:"Menciona también las pruebas de 401/403."},
 {t:"opcion", p:"«¿Cómo llevarías tu aplicación Spring Boot a producción?»",
  ops:["Subiendo el jar por FTP","Imagen Docker por capas y sin root, configuración por variables de entorno y perfiles, Flyway, Actuator con probes de liveness y readiness, métricas en Prometheus, logs JSON con traceId, apagado elegante y un pipeline de CI/CD","Ejecutando desde el IDE","Con ddl-auto=update"],
  ok:1, why:"Aquí conectas Spring con todo lo que sabes de Docker, Kubernetes y DevOps: es tu punto fuerte."},
 {t:"opcion", p:"«¿Qué novedades de Spring Boot 3 conoces?»",
  ops:["Ninguna","Java 17 como mínimo, paso de javax a jakarta, observabilidad con Micrometer Tracing, ProblemDetail, RestClient e interfaces HTTP, soporte de hilos virtuales, imágenes nativas con GraalVM y @ServiceConnection con Testcontainers","Solo cambió el logo","Eliminó JPA"],
  ok:1, why:"Demuestra que tu conocimiento está actualizado."},
 {t:"info", eti:"Terminado", h:"Has completado Spring Boot de cero a experto",
  c:`<p>Dominas el contenedor y la inyección de dependencias, la configuración, las APIs REST, la validación y los errores, JPA con sus relaciones y transacciones, la seguridad, las pruebas, la integración con otros sistemas, la producción y la arquitectura.</p>
     <p>Para consolidarlo: construye la API de tareas completa (JPA + Flyway + validación + errores con ProblemDetail + seguridad JWT + pruebas con Testcontainers), empaquétala con Docker, despliégala con Compose y súbela a GitHub con un pipeline de Actions. Es exactamente el proyecto que puedes enseñar en una entrevista.</p>`}
]},

{
id:"sp13l3",
titulo:"Ronda rápida de preguntas de Spring",
claves:["Respuestas cortas y precisas a las preguntas más repetidas","Diferencias clave: @Component frente a @Bean, @Controller frente a @RestController, PUT frente a PATCH","Relaciona cada respuesta con tu experiencia"],
pasos:[
 {t:"par", p:"Empareja cada pregunta con su respuesta corta",
  pares:[["¿@Component o @Bean?","@Component en tus clases; @Bean para registrar objetos de librerías o con lógica de creación"],["¿@Controller o @RestController?","@RestController añade @ResponseBody: devuelve datos, no vistas"],["¿Qué es un starter?","Dependencia que agrupa todo lo necesario para una función con versiones compatibles"],["¿Qué hace @Transactional(readOnly = true)?","Optimiza lecturas y evita escrituras accidentales"],["¿Qué es un profile?","Configuración y beans activados según el entorno"]],
  why:"En la ronda rápida se valora la precisión, no la longitud."},
 {t:"par", p:"Empareja cada error con su causa más probable",
  pares:[["NoSuchBeanDefinitionException","Falta un bean: anotación, paquete escaneado o perfil"],["LazyInitializationException","Relación perezosa accedida fuera de la transacción"],["HttpMessageNotReadableException","El JSON del cuerpo está mal formado o no encaja con el DTO"],["MethodArgumentNotValidException","Falló la validación de @Valid"],["DataIntegrityViolationException","Se violó una restricción de la base de datos (UNIQUE, NOT NULL)"]],
  why:"Reconocer estas excepciones de un vistazo te hace parecer (y ser) alguien con experiencia."},
 {t:"opcion", p:"«¿Qué harías si un endpoint de tu API va lento en producción?»",
  ops:["Subir la memoria","Mirar métricas por endpoint y trazas para ver dónde se va el tiempo, revisar el SQL generado (N+1, índices), el pool de conexiones y las llamadas externas; corregir, y medir de nuevo","Reiniciar","Añadir caché a todo"],
  ok:1, why:"Medir, localizar, corregir y verificar: el método por encima de la receta."}
]}

]});
