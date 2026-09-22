window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "APIs REST con Spring MVC",
resumen: "Controladores, rutas y verbos HTTP, parámetros de ruta y consulta, cuerpos JSON, ResponseEntity, DTOs y diseño REST",
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
  ok:true, why:"Mediante los HttpMessageConverter y Jackson, según la cabecera Accept."}
]},

{
id:"sp4l2",
titulo:"Parámetros y cuerpo de la petición",
claves:["@PathVariable para partes de la ruta: /tareas/{id}","@RequestParam para la consulta: ?estado=pendiente&pagina=0","@RequestBody convierte el JSON del cuerpo en un objeto"],
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
  ok:true, why:"Usa required = false, un defaultValue o Optional para hacerlo opcional."}
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
  ok:false, why:"Los códigos de estado existen para eso; monitorización, proxies y clientes dependen de ellos."}
]},

{
id:"sp4l4",
titulo:"DTOs y diseño de la API",
claves:["No expongas entidades JPA: usa DTOs (records) de entrada y salida","Recursos en plural, verbos HTTP para las acciones, versionado y paginación","Documenta con OpenAPI (springdoc) y Swagger UI"],
pasos:[
 {t:"info", eti:"Separar capas", h:"¿Por qué DTOs?",
  c:`<div class="termbox">public record NuevaTarea(String titulo, LocalDate fechaLimite) { }         <span class="cm">// entrada</span>
public record TareaDto(long id, String titulo, boolean hecha, LocalDate fechaLimite) { }  <span class="cm">// salida</span></div>
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
     <p>Con esa dependencia, <code>/v3/api-docs</code> ofrece la especificación OpenAPI generada de tus controladores y <code>/swagger-ui.html</code> una página para probarlos. Los equipos de frontend y otros servicios generan clientes a partir de ella.</p>`},
 {t:"opcion", p:"¿Cuál es el riesgo de aceptar la entidad <code>Usuario</code> directamente como <code>@RequestBody</code> en el registro?",
  ops:["Ninguno","Un atacante podría enviar campos como rol o verificado y asignárselos (mass assignment)","Es más lento","No compila"],
  ok:1, why:"Un DTO de entrada con solo los campos permitidos lo evita."},
 {t:"vf", p:"La ruta <code>POST /api/obtenerTareas</code> sigue las convenciones REST.",
  ok:false, why:"Debería ser GET /api/tareas: el recurso en la ruta y la acción en el verbo."}
]},

{
id:"sp4l5",
titulo:"Filtros, ordenación y versionado de la API",
claves:["Filtros opcionales con @RequestParam y consultas dinámicas (Specifications o Querydsl)","Paginación y ordenación con Pageable; limitar el tamaño máximo","Versionar con /api/v1 y evolucionar sin romper a los clientes"],
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

spring.data.web.pageable.max-page-size: 100      # nadie pide 1.000.000 de filas</div>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Specification","Combinar filtros opcionales en una consulta"],["@PageableDefault","Tamaño y orden por defecto"],["max-page-size","Evitar peticiones que cargan millones de filas"],["/api/v1","Poder introducir cambios incompatibles en /api/v2"],["Añadir campos nuevos opcionales","Evolucionar sin romper a los clientes"]],
  why:"Añadir es compatible; quitar o renombrar campos rompe a los clientes."},
 {t:"opcion", p:"¿Qué cambio en una respuesta JSON rompe a los clientes existentes?",
  ops:["Añadir un campo nuevo","Renombrar o eliminar un campo que ya usan","Añadir un endpoint","Mejorar el rendimiento"],
  ok:1, why:"Para eso, versión nueva o un periodo de convivencia con ambos campos."}
]}

]});
