window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "APIs REST con Spring MVC",
resumen: "Controladores, rutas y verbos HTTP, parámetros y cuerpos JSON, ResponseEntity, DTOs, paginación, versionado y cómo funciona Spring MVC por dentro",
nivel: "Intermedio",
color: "#5ea136",
lecciones: [

{
id:"sp4l1",
titulo:"Tu primer controlador",
claves:["@RestController: los métodos devuelven datos que se convierten a JSON","@GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping","@RequestMapping en la clase fija el prefijo común"],
pasos:[
 {t:"info", eti:"Recibir peticiones", h:"Un controlador REST",
  c:`<div class="termbox">@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService servicio;
    public TareaController(TareaService servicio) { this.servicio = servicio; }

    @GetMapping
    public List&lt;TareaDto&gt; listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    public TareaDto obtener(@PathVariable long id) {
        return servicio.obtener(id);
    }
}</div>
     <p>Spring convierte el valor devuelto a JSON con <b>Jackson</b>. <code>GET /api/tareas/7</code> llama a <code>obtener(7)</code>.</p>`},
 {t:"term", p:"Prueba el endpoint que lista las tareas de tu API local en el puerto 8080",
  prompt:"pablo@portatil:~$", sol:["curl http://localhost:8080/api/tareas","curl localhost:8080/api/tareas","curl -s http://localhost:8080/api/tareas","curl -s localhost:8080/api/tareas"],
  pista:"curl y la URL completa con /api/tareas.",
  salida:`[{"id":1,"titulo":"Preparar entrevista","hecha":false},{"id":2,"titulo":"Repasar Docker","hecha":true}]`, why:"Una lista de records se convierte en un array JSON automáticamente."},
 {t:"par", p:"Empareja cada anotación con el verbo HTTP y su uso",
  pares:[["@GetMapping","GET: leer"],["@PostMapping","POST: crear"],["@PutMapping","PUT: reemplazar"],["@PatchMapping","PATCH: modificar una parte"],["@DeleteMapping","DELETE: borrar"]],
  why:"Son atajos de @RequestMapping(method = ...)."},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>@Controller</code> y <code>@RestController</code>?",
  ops:["Ninguna","@RestController = @Controller + @ResponseBody: lo devuelto se escribe como cuerpo (JSON), no como nombre de una vista HTML","@Controller es más moderno","@RestController solo acepta GET"],
  ok:1, why:"@Controller se usa con plantillas (Thymeleaf); para APIs, @RestController."},
 {t:"vf", p:"Si un método de un @RestController devuelve un objeto Java, Spring lo convierte a JSON automáticamente.",
  ok:true, why:"Mediante los HttpMessageConverter y Jackson, según la cabecera Accept."},
 {t:"hueco", p:"Completa el controlador para que responda a <code>GET /api/clientes/{id}</code>",
  tpl:"@RestController\n@RequestMapping(\"/api/clientes\")\nclass ClienteController {\n    @___(\"/{id}\")\n    ClienteDto ver(@___ long id) { return servicio.ver(id); }\n}", banco:["GetMapping","PathVariable","RequestParam","PostMapping","RequestBody"], sol:["GetMapping","PathVariable"],
  why:"El {id} de la ruta se enlaza con el parámetro del mismo nombre gracias a @PathVariable."},
 {t:"opcion", p:"Dos métodos del mismo controlador tienen <code>@GetMapping(\"/{id}\")</code>. ¿Qué ocurre?",
  ops:["Se llama al primero","La aplicación falla al arrancar con «Ambiguous mapping»","Se llama a los dos","Se elige al azar en cada petición"],
  ok:1, why:"Spring registra todas las rutas al arrancar y detecta los choques antes de recibir tráfico."}
]},

{
id:"sp4l2",
titulo:"Parámetros y cuerpo de la petición",
claves:["@PathVariable para partes de la ruta: /tareas/{id}","@RequestParam para la consulta: ?estado=pendiente&amp;pagina=0","@RequestBody convierte el JSON del cuerpo en un objeto"],
pasos:[
 {t:"info", eti:"Datos de entrada", h:"De dónde vienen los datos",
  c:`<div class="termbox">@GetMapping("/{id}")
TareaDto obtener(@PathVariable long id) { ... }                     <span class="cm">// /api/tareas/7</span>

@GetMapping
List&lt;TareaDto&gt; buscar(@RequestParam(required = false) String texto,
                      @RequestParam(defaultValue = "false") boolean hechas) { ... }
                                                                    <span class="cm">// /api/tareas?texto=docker&amp;hechas=true</span>

@PostMapping
TareaDto crear(@RequestBody NuevaTarea peticion) { ... }             <span class="cm">// JSON en el cuerpo</span>

@GetMapping("/perfil")
PerfilDto perfil(@RequestHeader("X-Idioma") String idioma) { ... }  <span class="cm">// cabecera</span></div>`},
 {t:"par", p:"Empareja cada anotación con de dónde lee el dato",
  pares:[["@PathVariable","Un segmento de la ruta: /tareas/{id}"],["@RequestParam","La cadena de consulta: ?pagina=2"],["@RequestBody","El cuerpo JSON de la petición"],["@RequestHeader","Una cabecera HTTP"]],
  why:"Regla REST: la ruta identifica el recurso; la consulta filtra, ordena o pagina."},
 {t:"term", p:"Crea una tarea con título «Repasar Spring» enviando JSON con curl",
  prompt:"pablo@portatil:~$", sol:["curl -X POST localhost:8080/api/tareas -H 'Content-Type: application/json' -d '{\"titulo\":\"Repasar Spring\"}'","curl -X POST http://localhost:8080/api/tareas -H 'Content-Type: application/json' -d '{\"titulo\":\"Repasar Spring\"}'","curl -X POST http://localhost:8080/api/tareas -H \"Content-Type: application/json\" -d '{\"titulo\":\"Repasar Spring\"}'","curl -X POST localhost:8080/api/tareas -H \"Content-Type: application/json\" -d '{\"titulo\":\"Repasar Spring\"}'"],
  pista:"curl -X POST, la URL, -H con Content-Type: application/json y -d con el JSON.",
  salida:`{"id":3,"titulo":"Repasar Spring","hecha":false}`, why:"Sin la cabecera Content-Type, Spring respondería 415 Unsupported Media Type."},
 {t:"opcion", p:"Un cliente envía <code>{\"titulo\": \"x\"}</code> sin la cabecera <code>Content-Type: application/json</code>. ¿Qué responde Spring?",
  ops:["201","415 Unsupported Media Type","404","500"],
  ok:1, why:"Spring no sabe cómo interpretar el cuerpo sin el tipo de contenido."},
 {t:"vf", p:"<code>@RequestParam</code> por defecto es obligatorio: si falta, Spring responde 400.",
  ok:true, why:"Usa required = false, un defaultValue o Optional para hacerlo opcional."},
 {t:"opcion", p:"La ruta es <code>/api/tareas/{id}</code> con <code>@PathVariable long id</code> y alguien llama a <code>/api/tareas/abc</code>. ¿Qué responde Spring?",
  ops:["404","400 Bad Request: no puede convertir «abc» a long","500 con la traza","200 con id 0"],
  ok:1, why:"Es un MethodArgumentTypeMismatchException, que Spring traduce a 400. Nunca debería llegar a tu código."},
 {t:"hueco", p:"Completa para leer <code>?pagina=</code> con valor 0 si no viene",
  tpl:"List<TareaDto> listar(@RequestParam(___ = \"0\") int pagina)", banco:["defaultValue","value","required","name"], sol:["defaultValue"],
  why:"defaultValue hace además que el parámetro deje de ser obligatorio."}
]},

{
id:"sp4l3",
titulo:"Respuestas y códigos de estado",
claves:["ResponseEntity controla estado, cabeceras y cuerpo","201 Created con Location al crear; 204 No Content al borrar","@ResponseStatus para fijar el código de un método o excepción"],
pasos:[
 {t:"info", eti:"Controlar la respuesta", h:"ResponseEntity",
  c:`<div class="termbox">@PostMapping
ResponseEntity&lt;TareaDto&gt; crear(@RequestBody NuevaTarea peticion, UriComponentsBuilder uri) {
    TareaDto creada = servicio.crear(peticion);
    URI ubicacion = uri.path("/api/tareas/{id}").buildAndExpand(creada.id()).toUri();
    return ResponseEntity.created(ubicacion).body(creada);           <span class="cm">// 201 + Location</span>
}

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)                               <span class="cm">// 204</span>
void borrar(@PathVariable long id) { servicio.borrar(id); }

@GetMapping("/{id}")
ResponseEntity&lt;TareaDto&gt; obtener(@PathVariable long id) {
    return servicio.buscar(id).map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());       <span class="cm">// 200 o 404</span>
}</div>`},
 {t:"par", p:"Empareja cada operación con el código de respuesta adecuado",
  pares:[["Crear un recurso","201 Created"],["Borrar sin devolver cuerpo","204 No Content"],["Recurso inexistente","404 Not Found"],["Datos de entrada no válidos","400 Bad Request"],["Conflicto (email ya registrado)","409 Conflict"]],
  why:"Códigos correctos permiten a los clientes reaccionar sin leer el texto del error."},
 {t:"opcion", p:"¿Qué cabecera debería acompañar a un 201 Created?",
  ops:["Content-Length solamente","Location, con la URL del recurso creado","Authorization","Cache-Control"],
  ok:1, why:"Así el cliente sabe dónde está el nuevo recurso."},
 {t:"vf", p:"Devolver siempre 200 con un campo <code>\"error\": true</code> en el cuerpo es una buena práctica REST.",
  ok:false, why:"Los códigos de estado existen para eso; monitorización, proxies y clientes dependen de ellos."},
 {t:"hueco", p:"Completa para devolver 201 con la cabecera Location",
  tpl:"return ResponseEntity.___(ubicacion).___(creada);", banco:["created","body","ok","header","status"], sol:["created","body"],
  why:"ResponseEntity.created(uri) fija el 201 y la cabecera Location; body() pone el JSON."},
 {t:"par", p:"Empareja cada código con su significado",
  pares:[["202 Accepted","Recibido; se procesará más tarde (asíncrono)"],["304 Not Modified","El cliente ya tiene la versión actual (ETag)"],["401 Unauthorized","No autenticado"],["422 Unprocessable Content","Formato correcto pero la regla de negocio no se cumple"],["429 Too Many Requests","El cliente supera el límite de peticiones"]],
  why:"422 frente a 400 es cuestión de convención del equipo: lo importante es ser coherente en toda la API."},
 {t:"opcion", p:"<code>DELETE /api/tareas/7</code> se llama dos veces seguidas. La primera devuelve 204. ¿Qué es razonable la segunda?",
  ops:["500","404 (ya no existe) o 204 (el estado final es el mismo): DELETE es idempotente, el efecto en el servidor no cambia","201","Borrar otra tarea"],
  ok:1, why:"Idempotente significa que repetir la petición no cambia el resultado final, aunque el código de respuesta pueda variar."}
]},

{
id:"sp4l4",
titulo:"DTOs y diseño de la API",
claves:["No expongas entidades JPA: usa DTOs (records) de entrada y salida","Recursos en plural, verbos HTTP para las acciones, versionado y paginación","Documenta con OpenAPI (springdoc) y Swagger UI"],
pasos:[
 {t:"info", eti:"Separar capas", h:"¿Por qué DTOs?",
  c:`<div class="termbox">public record NuevaTarea(String titulo, LocalDate fechaLimite) { }         <span class="cm">// entrada</span>
public record TareaDto(long id, String titulo, boolean hecha, LocalDate fechaLimite) {  <span class="cm">// salida</span>
    static TareaDto de(Tarea t) { return new TareaDto(t.getId(), t.getTitulo(), t.isHecha(), t.getFechaLimite()); }
}</div>
     <p>Devolver la entidad JPA directamente:</p>
     <ul><li>expone campos internos (contraseñas, ids de auditoría),</li>
     <li>provoca errores de carga perezosa o ciclos infinitos al serializar relaciones,</li>
     <li>ata tu contrato público a tu modelo de base de datos: renombrar una columna rompe a los clientes.</li></ul>
     <p>Con DTOs de entrada, además, evitas que un cliente asigne campos que no debería (por ejemplo <code>rol: "ADMIN"</code>): <b>mass assignment</b>.</p>`},
 {t:"par", p:"Empareja cada práctica REST con su ejemplo",
  pares:[["Recursos en plural","/api/pedidos"],["Subrecursos","/api/pedidos/42/lineas"],["Filtrar y paginar con la consulta","/api/pedidos?estado=pagado&page=0&size=20"],["Versionado","/api/v2/pedidos"],["Acciones que no son CRUD","POST /api/pedidos/42/cancelacion"]],
  why:"Evita verbos en la ruta como /api/crearPedido: el verbo es el método HTTP."},
 {t:"info", eti:"Documentar", h:"OpenAPI y Swagger UI",
  c:`<div class="termbox">&lt;dependency&gt;
  &lt;groupId&gt;org.springdoc&lt;/groupId&gt;
  &lt;artifactId&gt;springdoc-openapi-starter-webmvc-ui&lt;/artifactId&gt;
&lt;/dependency&gt;</div>
     <p>Con esa dependencia, <code>/v3/api-docs</code> ofrece la especificación OpenAPI generada de tus controladores y <code>/swagger-ui.html</code> una página para probarlos. Los equipos de frontend y otros servicios generan clientes a partir de ella. En producción, protégela o desactívala si la API no es pública.</p>`},
 {t:"opcion", p:"¿Cuál es el riesgo de aceptar la entidad <code>Usuario</code> directamente como <code>@RequestBody</code> en el registro?",
  ops:["Ninguno","Un atacante podría enviar campos como rol o verificado y asignárselos (mass assignment)","Es más lento","No compila"],
  ok:1, why:"Un DTO de entrada con solo los campos permitidos lo evita."},
 {t:"vf", p:"La ruta <code>POST /api/obtenerTareas</code> sigue las convenciones REST.",
  ok:false, why:"Debería ser GET /api/tareas: el recurso en la ruta y la acción en el verbo."},
 {t:"opcion", p:"Una entidad <code>Pedido</code> tiene <code>List&lt;LineaPedido&gt;</code> y cada línea apunta a su pedido. Al devolver el pedido como JSON, la respuesta falla con StackOverflowError. ¿Por qué?",
  ops:["Por un bug de Jackson","Jackson recorre pedido → líneas → pedido → líneas... sin fin: la relación bidireccional crea un ciclo. Devuelve un DTO sin la referencia de vuelta","Porque la lista es muy larga","Por falta de memoria"],
  ok:1, why:"Otra razón para no serializar entidades: los DTOs cortan el grafo donde tú decides."},
 {t:"orden", p:"Ordena el recorrido de una petición POST bien diseñada, de la red a la base de datos",
  items:["El controlador recibe un DTO de entrada (NuevaTarea)","Se valida el DTO","El servicio crea la entidad y aplica las reglas de negocio","El repositorio guarda la entidad","El servicio o el controlador convierte la entidad en un DTO de salida (TareaDto)"],
  why:"La entidad nunca cruza la frontera HTTP: entra un DTO, sale otro."}
]},

{
id:"sp4l5",
titulo:"Filtros, ordenación y versionado de la API",
claves:["Filtros opcionales con @RequestParam y consultas dinámicas (Specifications)","Paginación y ordenación con Pageable; limitar el tamaño máximo","Versionar sin romper a los clientes: por ruta o, desde Spring Framework 7, con versionado integrado"],
pasos:[
 {t:"info", eti:"Listados reales", h:"Buscar con filtros",
  c:`<div class="termbox">@GetMapping("/api/v1/pedidos")
Page&lt;PedidoDto&gt; buscar(@RequestParam(required = false) EstadoPedido estado,
                       @RequestParam(required = false) LocalDate desde,
                       @PageableDefault(size = 20, sort = "fecha", direction = DESC) Pageable pageable) {
    Specification&lt;Pedido&gt; spec = Specification.allOf(
        estado == null ? null : (r, q, cb) -&gt; cb.equal(r.get("estado"), estado),
        desde == null ? null : (r, q, cb) -&gt; cb.greaterThanOrEqualTo(r.get("fecha"), desde));
    return repo.findAll(spec, pageable).map(PedidoDto::de);
}

spring.data.web.pageable.max-page-size: 100      <span class="cm"># nadie pide 1.000.000 de filas</span></div>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Specification","Combinar filtros opcionales en una consulta"],["@PageableDefault","Tamaño y orden por defecto"],["max-page-size","Evitar peticiones que cargan millones de filas"],["/api/v1","Poder introducir cambios incompatibles en /api/v2"],["Añadir campos nuevos opcionales","Evolucionar sin romper a los clientes"]],
  why:"Añadir es compatible; quitar o renombrar campos rompe a los clientes."},
 {t:"opcion", p:"¿Qué cambio en una respuesta JSON rompe a los clientes existentes?",
  ops:["Añadir un campo nuevo","Renombrar o eliminar un campo que ya usan","Añadir un endpoint","Mejorar el rendimiento"],
  ok:1, why:"Para eso, versión nueva o un periodo de convivencia con ambos campos."},
 {t:"info", eti:"Spring Framework 7", h:"Versionado integrado",
  c:`<div class="termbox">@Configuration
class WebConfig implements WebMvcConfigurer {
    @Override
    public void configureApiVersioning(ApiVersionConfigurer c) {
        c.useRequestHeader("API-Version");          <span class="cm">// o por ruta, parámetro o tipo de medio</span>
    }
}

@GetMapping(path = "/api/pedidos/{id}", version = "1.0")
PedidoV1 verV1(@PathVariable long id) { ... }

@GetMapping(path = "/api/pedidos/{id}", version = "2.0")
PedidoV2 verV2(@PathVariable long id) { ... }</div>
     <p>Hasta Spring Framework 6 el versionado se hacía a mano (rutas <code>/v1</code>, <code>/v2</code> o comprobando cabeceras). Desde la versión 7 (Spring Boot 4), el atributo <code>version</code> de los mappings elige el método según la versión pedida, y se puede marcar una versión como obsoleta para avisar a los clientes.</p>`},
 {t:"codigo", p:"Calcula los metadatos de una página como hace Spring Data",
  lenguaje:"java",
  c:`<p>Cada línea trae tres enteros: <code>total</code> (elementos en la tabla), <code>page</code> (empieza en 0) y <code>size</code>. Imprime <code>totalPages=X first=true|false last=true|false hasNext=true|false</code>.</p>
     <p>Con <code>total</code> 0 hay 0 páginas; la página 0 es la primera y también la última.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLong()) {\n            long total = sc.nextLong();\n            int page = sc.nextInt();\n            int size = sc.nextInt();\n            // calcula y muestra los metadatos\n        }\n    }\n}\n",
  pruebas:[{entrada:"45 0 20", salida:"totalPages=3 first=true last=false hasNext=true"},{entrada:"45 2 20", salida:"totalPages=3 first=false last=true hasNext=false"},{entrada:"0 0 20", salida:"totalPages=0 first=true last=true hasNext=false"},{entrada:"40 1 20\n41 1 20", salida:"totalPages=2 first=false last=true hasNext=false\ntotalPages=3 first=false last=false hasNext=true", oculta:true}],
  pista:"totalPages = (total + size - 1) / size. hasNext = page + 1 &lt; totalPages. last = !hasNext.",
  solucion:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLong()) {\n            long total = sc.nextLong();\n            int page = sc.nextInt();\n            int size = sc.nextInt();\n            long totalPages = (total + size - 1) / size;\n            boolean hasNext = page + 1 < totalPages;\n            System.out.println(\"totalPages=\" + totalPages + \" first=\" + (page == 0) + \" last=\" + !hasNext + \" hasNext=\" + hasNext);\n        }\n    }\n}",
  why:"Es exactamente lo que PageImpl calcula a partir del COUNT; por eso Page necesita esa segunda consulta y Slice no."},
 {t:"vf", p:"Serializar directamente un <code>Page</code> de Spring Data como respuesta JSON es un contrato estable y recomendado.",
  ok:false, why:"Su estructura interna puede cambiar entre versiones (Spring Data avisa de ello). Usa PagedModel con @EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO) o tu propio DTO de página."},
 {t:"opcion", p:"Un listado se pagina con <code>?page=5000&amp;size=20</code> y cada vez va más lento. ¿Qué alternativa hay?",
  ops:["Subir el tamaño de página","Paginación por clave (keyset): «dame 20 después del id 98231», que usa el índice en vez de saltar 100.000 filas con OFFSET","Quitar el ORDER BY","Cachear todas las páginas"],
  ok:1, why:"OFFSET obliga a leer y descartar todas las filas anteriores. Spring Data lo soporta con ScrollPosition y Window."}
]},

{
id:"sp4n1",
titulo:"Por dentro de Spring MVC",
claves:["DispatcherServlet recibe todas las peticiones y las reparte a los controladores","HttpMessageConverter (Jackson) convierte cuerpos según Content-Type y Accept","Filtros del servlet frente a interceptores de Spring: dónde poner lo transversal"],
pasos:[
 {t:"info", eti:"El recorrido", h:"De la petición a tu método",
  c:`<div class="dg"><div class="dg-tit">una petición en spring mvc</div>
       <div class="dg-vert">
         <div class="dg-caja base">Tomcat recibe <code>POST /api/tareas</code></div>
         <div class="dg-caja">filtros del servlet<small>seguridad, CORS, trazas</small></div>
         <div class="dg-caja acento"><code>DispatcherServlet</code></div>
         <div class="dg-caja"><code>HandlerMapping</code><small>¿qué método atiende esta ruta y verbo?</small></div>
         <div class="dg-caja">interceptores<small>preHandle</small></div>
         <div class="dg-caja"><code>HandlerAdapter</code><small>resuelve argumentos: @PathVariable, @RequestBody (Jackson), @Valid</small></div>
         <div class="dg-caja ok">tu método del controlador</div>
         <div class="dg-caja"><code>HttpMessageConverter</code><small>el valor devuelto se escribe como JSON</small></div>
       </div>
     </div>
     <p>Si algo lanza una excepción por el camino, la resuelven los <code>HandlerExceptionResolver</code>, entre ellos tu <code>@RestControllerAdvice</code>.</p>`},
 {t:"par", p:"Empareja cada pieza con su responsabilidad",
  pares:[["DispatcherServlet","Punto de entrada único que coordina toda la petición"],["HandlerMapping","Encontrar el método según ruta, verbo y cabeceras"],["HttpMessageConverter","Convertir el cuerpo entre JSON y objetos Java"],["HandlerInterceptor","Código antes y después del controlador, con acceso al método elegido"],["HandlerExceptionResolver","Convertir excepciones en respuestas HTTP"]],
  why:"Conocer el recorrido te dice dónde mirar cuando algo no llega al controlador."},
 {t:"info", eti:"Lo transversal", h:"Filtro o interceptor",
  c:`<div class="termbox"><span class="cm">// filtro: antes de Spring MVC, ve todas las peticiones (incluidas las de recursos estáticos)</span>
@Component
class IdPeticionFiltro extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        res.setHeader("X-Request-Id", UUID.randomUUID().toString());
        chain.doFilter(req, res);
    }
}

<span class="cm">// interceptor: dentro de Spring MVC, sabe qué método del controlador se va a ejecutar</span>
class AuditoriaInterceptor implements HandlerInterceptor {
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        if (handler instanceof HandlerMethod m) log.debug("-&gt; {}", m.getMethod().getName());
        return true;                                  <span class="cm">// false corta la petición</span>
    }
}</div>`},
 {t:"opcion", p:"Un cliente pide <code>Accept: application/xml</code> y tu API solo produce JSON. ¿Qué responde Spring?",
  ops:["200 con JSON igualmente","406 Not Acceptable: ningún conversor puede producir el tipo pedido","415","500"],
  ok:1, why:"406 es sobre lo que el cliente acepta recibir (Accept); 415 es sobre lo que envía (Content-Type)."},
 {t:"info", eti:"JSON a tu gusto", h:"Configurar Jackson",
  c:`<div class="termbox">spring:
  jackson:
    default-property-inclusion: non_null     <span class="cm"># no escribir campos null</span>
    deserialization:
      fail-on-unknown-properties: true       <span class="cm"># rechazar campos desconocidos en la entrada</span></div>
     <p>Las fechas <code>LocalDate</code> e <code>Instant</code> salen en ISO-8601 (<code>"2026-09-23"</code>) sin configurar nada. En Spring Boot 4 el conversor por defecto es <b>Jackson 3</b>, con paquetes <code>tools.jackson</code> y la clase <code>JsonMapper</code>; Jackson 2 sigue disponible de forma temporal para migrar poco a poco.</p>`},
 {t:"vf", p:"Un filtro de servlet se ejecuta antes que Spring Security, y un interceptor de Spring MVC después.",
  ok:false, why:"Spring Security es a su vez un filtro (FilterChainProxy) y su posición depende del orden de filtros. Lo seguro: los interceptores van siempre después de todos los filtros, incluida la seguridad."},
 {t:"opcion", p:"Quieres añadir la cabecera <code>X-Request-Id</code> a todas las respuestas, incluidas las de error 401 que genera Spring Security. ¿Dónde lo pones?",
  ops:["En cada controlador","En un filtro de servlet con prioridad alta, porque las peticiones rechazadas por seguridad nunca llegan a los interceptores","En un @RestControllerAdvice","En application.yml"],
  ok:1, why:"Lo que debe ver todas las peticiones va en un filtro; lo que depende del método del controlador, en un interceptor."}
]}

]});
