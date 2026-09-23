window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Persistencia con Spring Data JPA",
resumen: "JPA e Hibernate, entidades, repositorios, consultas derivadas, @Query, proyecciones, paginación y migraciones con Flyway",
nivel: "Intermedio",
color: "#549a31",
lecciones: [

{
id:"sp6l1",
titulo:"JPA, Hibernate y entidades",
claves:["JPA es la especificación; Hibernate, la implementación","Una @Entity es una clase mapeada a una tabla","@Id y @GeneratedValue para la clave primaria; @Column para ajustar columnas"],
pasos:[
 {t:"info", eti:"Objetos y tablas", h:"ORM",
  c:`<p>Un <b>ORM</b> (mapeo objeto-relacional) traduce entre objetos Java y filas de tablas. <b>JPA</b> (Jakarta Persistence) define las anotaciones y la API; <b>Hibernate</b> es la implementación que usa Spring Boot por defecto.</p>
     <div class="termbox">@Entity
@Table(name = "tareas")
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    private boolean hecha;

    private LocalDate fechaLimite;          <span class="cm">// columna fecha_limite</span>

    protected Tarea() { }                   <span class="cm">// JPA necesita un constructor sin argumentos</span>

    public Tarea(String titulo) { this.titulo = titulo; }

    public void completar() { this.hecha = true; }
    <span class="cm">// getters...</span>
}</div>`},
 {t:"par", p:"Empareja cada anotación con su función",
  pares:[["@Entity","La clase se guarda en una tabla"],["@Table(name = ...)","Nombre de la tabla"],["@Id","Clave primaria"],["@GeneratedValue","El id lo genera la base de datos"],["@Column(nullable = false)","Detalles de la columna"],["@Enumerated(EnumType.STRING)","Guardar un enum por su nombre"]],
  why:"Spring Boot convierte camelCase a snake_case: fechaLimite → fecha_limite."},
 {t:"info", eti:"Configurar", h:"Conexión y ddl-auto",
  c:`<div class="termbox">spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tareas
    username: tareas_user
    password: secreto
  jpa:
    hibernate:
      ddl-auto: validate      <span class="cm"># en produccion: validate o none</span>
    open-in-view: false</div>
     <p><code>ddl-auto: update</code> o <code>create</code> hacen que Hibernate cree o altere tablas solo. Útil para prototipos, peligroso en producción: la estructura debe gestionarse con <b>migraciones</b> (Flyway).</p>`},
 {t:"opcion", p:"¿Qué valor de <code>spring.jpa.hibernate.ddl-auto</code> usarías en producción?",
  ops:["create-drop","update","validate (o none) con Flyway gestionando el esquema","create"],
  ok:2, why:"validate comprueba que las entidades encajan con las tablas sin tocarlas."},
 {t:"vf", p:"Una entidad JPA necesita un constructor sin argumentos (puede ser protected).",
  ok:true, why:"Hibernate lo usa para crear las instancias al leer de la base de datos."}
]},

{
id:"sp6l2",
titulo:"Repositorios",
claves:["Una interfaz que extiende JpaRepository obtiene CRUD sin implementar nada","Consultas derivadas del nombre: findByEmail, findByEstadoAndTotalGreaterThan","@Query para JPQL o SQL nativo cuando el nombre no basta"],
pasos:[
 {t:"info", eti:"Sin escribir SQL", h:"JpaRepository",
  c:`<div class="termbox">public interface TareaRepository extends JpaRepository&lt;Tarea, Long&gt; {

    List&lt;Tarea&gt; findByHechaFalseOrderByFechaLimiteAsc();

    Optional&lt;Tarea&gt; findByTituloIgnoreCase(String titulo);

    long countByHechaTrue();

    boolean existsByTitulo(String titulo);

    @Query("select t from Tarea t where t.fechaLimite &lt; :fecha and t.hecha = false")
    List&lt;Tarea&gt; vencidas(@Param("fecha") LocalDate fecha);
}</div>
     <p>Spring genera la implementación al arrancar. De serie tienes <code>save</code>, <code>findById</code>, <code>findAll</code>, <code>deleteById</code>, <code>count</code>...</p>`},
 {t:"par", p:"Empareja cada método derivado con el SQL que genera aproximadamente",
  pares:[["findByEmail(e)","WHERE email = ?"],["findByTotalGreaterThan(x)","WHERE total > ?"],["findByNombreContainingIgnoreCase(t)","WHERE lower(nombre) LIKE %t%"],["findTop5ByOrderByCreadoEnDesc()","ORDER BY creado_en DESC LIMIT 5"],["existsByEmail(e)","SELECT 1 ... LIMIT 1"]],
  why:"Si el nombre del método se hace kilométrico, pasa a @Query."},
 {t:"escribe", p:"Escribe la firma del método de repositorio que busca un <code>Cliente</code> opcional por su <code>email</code>",
  sol:["Optional<Cliente> findByEmail(String email);","Optional<Cliente> findByEmail(String email)"], ph:"Optional<Cliente> ...", pista:"Optional de Cliente, findBy y la propiedad.", why:"Optional&lt;Cliente&gt; findByEmail(String email);"},
 {t:"opcion", p:"¿Qué diferencia hay entre JPQL y SQL nativo en @Query?",
  ops:["Ninguna","JPQL usa nombres de entidades y atributos Java y es portable; nativeQuery = true usa SQL real de la base de datos (útil para funciones propias de PostgreSQL)","JPQL es más lento","SQL nativo no admite parámetros"],
  ok:1, why:"select t from Tarea t (entidad) frente a select * from tareas (tabla)."},
 {t:"vf", p:"Para usar un JpaRepository hay que escribir una clase que lo implemente.",
  ok:false, why:"Spring genera la implementación en tiempo de ejecución a partir de la interfaz."}
]},

{
id:"sp6l3",
titulo:"Paginación y proyecciones",
claves:["Pageable y Page para paginar y ordenar desde la petición","Nunca devuelvas findAll() de una tabla que crece sin límite","Proyecciones (records o interfaces) para leer solo las columnas necesarias"],
pasos:[
 {t:"info", eti:"De poco en poco", h:"Paginación",
  c:`<div class="termbox">Page&lt;Tarea&gt; findByHecha(boolean hecha, Pageable pageable);

@GetMapping
Page&lt;TareaDto&gt; listar(@RequestParam(defaultValue = "false") boolean hechas,
                     @PageableDefault(size = 20, sort = "fechaLimite") Pageable pageable) {
    return repo.findByHecha(hechas, pageable).map(TareaDto::de);
}
<span class="cm">// GET /api/tareas?page=2&amp;size=20&amp;sort=titulo,asc</span></div>
     <p><code>Page</code> ejecuta además un <code>COUNT</code> para saber el total. Si no lo necesitas, <code>Slice</code> es más barato.</p>`},
 {t:"info", eti:"Leer menos", h:"Proyecciones",
  c:`<div class="termbox">public record ResumenTarea(Long id, String titulo) { }

@Query("select new com.catappa.tareas.ResumenTarea(t.id, t.titulo) from Tarea t where t.hecha = false")
List&lt;ResumenTarea&gt; pendientesResumen();</div>
     <p>Leer solo lo necesario es más rápido y evita cargar relaciones que no vas a usar.</p>`},
 {t:"opcion", p:"Un endpoint hace <code>repo.findAll()</code> sobre una tabla de 3 millones de filas. ¿Qué pasa?",
  ops:["Nada","Carga los 3 millones de objetos en memoria: lentitud extrema o OutOfMemoryError. Hay que paginar","Spring pagina automáticamente","Devuelve las 20 primeras"],
  ok:1, why:"Los endpoints de listado siempre paginados."},
 {t:"par", p:"Empareja cada tipo con su uso",
  pares:[["Pageable","Página, tamaño y orden solicitados"],["Page","Resultados más el total de elementos y páginas"],["Slice","Resultados y si hay más, sin contar el total"],["Proyección (record)","Leer solo algunas columnas"]],
  why:"Para scroll infinito, Slice o paginación por clave."},
 {t:"vf", p:"<code>Page</code> ejecuta una consulta adicional COUNT para calcular el total.",
  ok:true, why:"En tablas enormes ese COUNT puede costar; valora Slice."}
]},

{
id:"sp6l4",
titulo:"Migraciones con Flyway",
claves:["Flyway aplica scripts SQL versionados al arrancar: V1__, V2__...","Tabla flyway_schema_history registra lo aplicado","Nunca edites una migración aplicada; crea una nueva"],
pasos:[
 {t:"info", eti:"Esquema versionado", h:"Flyway",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">src/main/resources/db/migration/</span></div><div class="rama" style="--n:1"><span class="nom">V1__crear_tareas.sql</span></div><div class="rama" style="--n:1"><span class="nom">V2__anadir_fecha_limite.sql</span></div><div class="rama" style="--n:1"><span class="nom">V3__indice_tareas_hecha.sql</span></div></div>
     <div class="termbox">-- V1__crear_tareas.sql
CREATE TABLE tareas (
    id     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo varchar(200) NOT NULL,
    hecha  boolean NOT NULL DEFAULT false
);</div>
     <p>Con la dependencia <code>flyway-core</code> (y <code>flyway-database-postgresql</code>), Spring Boot ejecuta las migraciones pendientes al arrancar. Todos los entornos, incluidos los de tus compañeros y el CI, acaban con el mismo esquema.</p>`},
 {t:"orden", p:"Ordena lo que hace Flyway al arrancar la aplicación",
  items:["Se conecta a la base de datos","Lee la tabla flyway_schema_history","Compara con los scripts de db/migration","Aplica en orden las migraciones pendientes","Registra cada una en el historial y la aplicación continúa arrancando"],
  why:"Si una migración falla, la aplicación no arranca: mejor que funcionar con un esquema a medias."},
 {t:"opcion", p:"Te das cuenta de un error en <code>V2__anadir_fecha_limite.sql</code>, que ya está aplicada en producción. ¿Qué haces?",
  ops:["Editar V2","Crear V4__corregir_fecha_limite.sql con la corrección","Borrar la tabla de historial","Desactivar Flyway"],
  ok:1, why:"Flyway valida checksums: si editas una migración aplicada, se niega a arrancar."},
 {t:"vf", p:"Con Flyway, <code>spring.jpa.hibernate.ddl-auto</code> debería ser <code>validate</code> o <code>none</code>.",
  ok:true, why:"Un solo responsable del esquema: las migraciones."}
]},

{
id:"sp6l5",
titulo:"Auditoría y bloqueo optimista con JPA",
claves:["@CreatedDate, @LastModifiedDate y @CreatedBy rellenan campos de auditoría","@Version implementa bloqueo optimista: detecta modificaciones concurrentes","OptimisticLockingFailureException se traduce a un 409 Conflict"],
pasos:[
 {t:"info", eti:"Quién y cuándo", h:"Auditoría automática",
  c:`<div class="termbox">@EnableJpaAuditing
@Configuration class JpaConfig {
    @Bean AuditorAware&lt;String&gt; auditor() {
        return () -&gt; Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                             .map(Authentication::getName);
    }
}

@Entity @EntityListeners(AuditingEntityListener.class)
public class Pedido {
    @CreatedDate      private Instant creadoEn;
    @LastModifiedDate private Instant modificadoEn;
    @CreatedBy        private String creadoPor;
    @Version          private long version;       // bloqueo optimista
}</div>`},
 {t:"info", eti:"Dos a la vez", h:"Bloqueo optimista",
  c:`<p>Dos administradores abren el mismo pedido (versión 7). El primero guarda: <code>UPDATE ... SET version = 8 WHERE id = ? AND version = 7</code>. El segundo intenta guardar con versión 7: la actualización afecta a 0 filas y Hibernate lanza <code>OptimisticLockingFailureException</code>. En vez de pisar el cambio del primero, se informa con un <b>409</b> y se pide recargar.</p>`},
 {t:"par", p:"Empareja cada anotación con su efecto",
  pares:[["@CreatedDate","Fecha de creación rellenada automáticamente"],["@LastModifiedDate","Fecha de la última modificación"],["@CreatedBy","Usuario que creó el registro"],["@Version","Número de versión para el bloqueo optimista"],["@EntityListeners(AuditingEntityListener.class)","Activa la auditoría en la entidad"]],
  why:"Es el mismo mecanismo de bloqueo optimista que viste en el curso de SQL."},
 {t:"opcion", p:"¿Qué código HTTP es adecuado cuando falla el bloqueo optimista?",
  ops:["500","409 Conflict","404","200"],
  ok:1, why:"El cliente debe recargar la versión actual y volver a aplicar su cambio."}
]}

]});
