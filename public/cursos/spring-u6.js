window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Persistencia con Spring Data JPA",
resumen: "JPA e Hibernate, entidades y su ciclo de vida, repositorios, consultas derivadas, @Query, proyecciones, paginación, migraciones con Flyway, auditoría y bloqueo",
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
    password: \${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10     <span class="cm"># conexiones simultáneas a la base de datos</span>
  jpa:
    hibernate:
      ddl-auto: validate      <span class="cm"># en producción: validate o none</span>
    open-in-view: false</div>
     <p><code>ddl-auto: update</code> o <code>create</code> hacen que Hibernate cree o altere tablas solo. Útil para prototipos, peligroso en producción: la estructura debe gestionarse con <b>migraciones</b> (Flyway).</p>`},
 {t:"opcion", p:"¿Qué valor de <code>spring.jpa.hibernate.ddl-auto</code> usarías en producción?",
  ops:["create-drop","update","validate (o none) con Flyway gestionando el esquema","create"],
  ok:2, why:"validate comprueba que las entidades encajan con las tablas sin tocarlas."},
 {t:"vf", p:"Una entidad JPA necesita un constructor sin argumentos (puede ser protected).",
  ok:true, why:"Hibernate lo usa para crear las instancias al leer de la base de datos."},
 {t:"opcion", p:"Guardas un enum <code>Estado</code> sin <code>@Enumerated</code> y meses después alguien añade un valor en medio de la lista. ¿Qué pasa con los datos antiguos?",
  ops:["Nada","Por defecto se guardaba el ordinal (0, 1, 2...): al insertar un valor en medio, los números antiguos pasan a significar otro estado. Usa EnumType.STRING","Hibernate los migra solo","Se borran"],
  ok:1, why:"Un error silencioso y grave: los pedidos «PAGADO» pasan a leerse como «ENVIADO». Siempre EnumType.STRING."},
 {t:"hueco", p:"Completa la entidad para que el id lo genere una columna identity de PostgreSQL",
  tpl:"@___\npublic class Cliente {\n    @Id\n    @GeneratedValue(strategy = GenerationType.___)\n    private Long id;\n}", banco:["Entity","IDENTITY","Table","AUTO","Component","UUID"], sol:["Entity","IDENTITY"],
  why:"IDENTITY usa la columna autoincremental. SEQUENCE permite a Hibernate agrupar inserciones en lotes; UUID genera el id en la aplicación."}
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

    @Modifying
    @Query("update Tarea t set t.hecha = true where t.fechaLimite &lt; :fecha")
    int cerrarVencidas(@Param("fecha") LocalDate fecha);   <span class="cm">// devuelve filas afectadas</span>
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
  ok:false, why:"Spring genera la implementación en tiempo de ejecución a partir de la interfaz."},
 {t:"codigo", p:"Traduce el nombre de un método derivado a su cláusula WHERE",
  lenguaje:"java",
  c:`<p>Así interpreta Spring Data los nombres. Lee nombres de método (uno por línea) que empiezan por <code>findBy</code> e imprime el WHERE:</p>
     <ul><li>Las condiciones se unen con <code>And</code> u <code>Or</code> (seguidos de mayúscula) → <code>AND</code> / <code>OR</code>.</li>
     <li>Sufijos: <code>GreaterThan</code> → <code>&gt; ?</code>, <code>LessThan</code> → <code>&lt; ?</code>, <code>Containing</code> → <code>LIKE ?</code>, <code>IsNull</code> → <code>IS NULL</code>, <code>True</code> → <code>= true</code>; sin sufijo, <code>= ?</code>.</li>
     <li>La propiedad pasa a snake_case: <code>FechaLimite</code> → <code>fecha_limite</code>.</li></ul>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    static String where(String metodo) {\n        String cuerpo = metodo.substring(\"findBy\".length());\n        // divide en condiciones y traduce cada una\n        return \"WHERE \";\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String m = sc.nextLine().trim();\n            if (!m.isEmpty()) System.out.println(where(m));\n        }\n    }\n}\n",
  pruebas:[{entrada:"findByEmail", salida:"WHERE email = ?"},{entrada:"findByEstadoAndTotalGreaterThan", salida:"WHERE estado = ? AND total > ?"},{entrada:"findByFechaLimiteLessThanOrHechaTrue", salida:"WHERE fecha_limite < ? OR hecha = true"},{entrada:"findByNombreContainingAndBorradoEnIsNull\nfindByOrigenAndOrden", salida:"WHERE nombre LIKE ? AND borrado_en IS NULL\nWHERE origen = ? AND orden = ?", oculta:true}],
  pista:"cuerpo.split(\"(?=And[A-Z])|(?=Or[A-Z])\") separa las condiciones. Para snake_case: minúscula la primera letra y replaceAll(\"([A-Z])\", \"_$1\").toLowerCase().",
  solucion:"import java.util.*;\n\npublic class Main {\n    static final String[][] OPS = {{\"GreaterThan\", \"> ?\"}, {\"LessThan\", \"< ?\"}, {\"Containing\", \"LIKE ?\"}, {\"IsNull\", \"IS NULL\"}, {\"True\", \"= true\"}};\n\n    static String snake(String p) {\n        String s = Character.toLowerCase(p.charAt(0)) + p.substring(1);\n        return s.replaceAll(\"([A-Z])\", \"_$1\").toLowerCase();\n    }\n\n    static String condicion(String p) {\n        for (String[] op : OPS)\n            if (p.endsWith(op[0])) return snake(p.substring(0, p.length() - op[0].length())) + \" \" + op[1];\n        return snake(p) + \" = ?\";\n    }\n\n    static String where(String metodo) {\n        String cuerpo = metodo.substring(\"findBy\".length());\n        String[] partes = cuerpo.split(\"(?=And[A-Z])|(?=Or[A-Z])\");\n        StringBuilder sb = new StringBuilder(\"WHERE \");\n        for (int i = 0; i < partes.length; i++) {\n            String p = partes[i];\n            if (i > 0 && p.startsWith(\"And\")) { sb.append(\" AND \"); p = p.substring(3); }\n            else if (i > 0 && p.startsWith(\"Or\")) { sb.append(\" OR \"); p = p.substring(2); }\n            sb.append(condicion(p));\n        }\n        return sb.toString();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String m = sc.nextLine().trim();\n            if (!m.isEmpty()) System.out.println(where(m));\n        }\n    }\n}",
  why:"Spring Data hace este análisis al arrancar (PartTree): por eso un nombre con una propiedad que no existe hace fallar el arranque, no la primera consulta."},
 {t:"opcion", p:"Un método <code>@Modifying @Query(\"update ...\")</code> actualiza filas, pero después <code>findById</code> en la misma transacción devuelve los valores antiguos. ¿Por qué?",
  ops:["Un bug de PostgreSQL","La actualización masiva va directa a la base de datos y no toca las entidades ya cargadas en el contexto de persistencia; usa clearAutomatically = true o recarga","Falta @Transactional(readOnly = true)","El índice está desactualizado"],
  ok:1, why:"Las consultas de actualización masiva se saltan la caché de primer nivel: conviene saberlo antes de mezclarlas con entidades cargadas."}
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

<span class="cm">// 1. derivada: Spring Data selecciona solo las columnas del record</span>
List&lt;ResumenTarea&gt; findByHechaFalse();

<span class="cm">// 2. explícita con JPQL</span>
@Query("select new com.catappa.tareas.ResumenTarea(t.id, t.titulo) from Tarea t where t.hecha = false")
List&lt;ResumenTarea&gt; pendientesResumen();

<span class="cm">// 3. dinámica: el llamante elige la forma</span>
&lt;T&gt; List&lt;T&gt; findByHecha(boolean hecha, Class&lt;T&gt; tipo);</div>
     <p>Leer solo lo necesario es más rápido, evita cargar relaciones que no vas a usar y las proyecciones no quedan gestionadas por Hibernate (menos memoria).</p>`},
 {t:"opcion", p:"Un endpoint hace <code>repo.findAll()</code> sobre una tabla de 3 millones de filas. ¿Qué pasa?",
  ops:["Nada","Carga los 3 millones de objetos en memoria: lentitud extrema o OutOfMemoryError. Hay que paginar","Spring pagina automáticamente","Devuelve las 20 primeras"],
  ok:1, why:"Los endpoints de listado siempre paginados."},
 {t:"par", p:"Empareja cada tipo con su uso",
  pares:[["Pageable","Página, tamaño y orden solicitados"],["Page","Resultados más el total de elementos y páginas"],["Slice","Resultados y si hay más, sin contar el total"],["Proyección (record)","Leer solo algunas columnas"]],
  why:"Para scroll infinito, Slice o paginación por clave."},
 {t:"vf", p:"<code>Page</code> ejecuta una consulta adicional COUNT para calcular el total.",
  ok:true, why:"En tablas enormes ese COUNT puede costar; valora Slice."},
 {t:"hueco", p:"Completa el repositorio para devolver una página de pedidos de un cliente",
  tpl:"___<Pedido> findByClienteId(Long clienteId, ___ pageable);", banco:["Page","Pageable","List","Sort","Slice"], sol:["Page","Pageable"],
  why:"El Pageable siempre va como último parámetro; Spring Data añade LIMIT, OFFSET y ORDER BY."},
 {t:"opcion", p:"Alguien llama a <code>/api/tareas?sort=clave</code> y <code>Tarea</code> no tiene esa propiedad. ¿Qué conviene?",
  ops:["Dejar que salga un 500","Validar los campos de ordenación permitidos (lista blanca) y devolver 400 si no está; ordenar por columnas sin índice también puede tumbar la base de datos","Ignorar el orden siempre","Ordenar por id en memoria"],
  ok:1, why:"Permitir ordenar por cualquier campo es exponer tu modelo y abrir la puerta a consultas carísimas."}
]},

{
id:"sp6l4",
titulo:"Migraciones con Flyway",
claves:["Flyway aplica scripts SQL versionados al arrancar: V1__, V2__...","La tabla flyway_schema_history registra lo aplicado; nunca edites una migración aplicada","Cambios sin parada: expandir, migrar datos y contraer en varios despliegues"],
pasos:[
 {t:"info", eti:"Esquema versionado", h:"Flyway",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">src/main/resources/db/migration/</span></div><div class="rama" style="--n:1"><span class="nom">V1__crear_tareas.sql</span></div><div class="rama" style="--n:1"><span class="nom">V2__anadir_fecha_limite.sql</span></div><div class="rama" style="--n:1"><span class="nom">V3__indice_tareas_hecha.sql</span></div></div>
     <div class="termbox">-- V1__crear_tareas.sql
CREATE TABLE tareas (
    id     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo varchar(200) NOT NULL,
    hecha  boolean NOT NULL DEFAULT false
);</div>
     <p>Con Flyway en el classpath, Spring Boot ejecuta las migraciones pendientes al arrancar. En Spring Boot 3.x basta <code>flyway-core</code> (más <code>flyway-database-postgresql</code>); en Spring Boot 4 se añade el starter <code>spring-boot-starter-flyway</code>. Todos los entornos, incluidos los de tus compañeros y el CI, acaban con el mismo esquema.</p>`},
 {t:"orden", p:"Ordena lo que hace Flyway al arrancar la aplicación",
  items:["Se conecta a la base de datos","Lee la tabla flyway_schema_history","Compara con los scripts de db/migration","Aplica en orden las migraciones pendientes","Registra cada una en el historial y la aplicación continúa arrancando"],
  why:"Si una migración falla, la aplicación no arranca: mejor que funcionar con un esquema a medias."},
 {t:"opcion", p:"Te das cuenta de un error en <code>V2__anadir_fecha_limite.sql</code>, que ya está aplicada en producción. ¿Qué haces?",
  ops:["Editar V2","Crear V4__corregir_fecha_limite.sql con la corrección","Borrar la tabla de historial","Desactivar Flyway"],
  ok:1, why:"Flyway valida checksums: si editas una migración aplicada, se niega a arrancar."},
 {t:"vf", p:"Con Flyway, <code>spring.jpa.hibernate.ddl-auto</code> debería ser <code>validate</code> o <code>none</code>.",
  ok:true, why:"Un solo responsable del esquema: las migraciones."},
 {t:"info", eti:"Sin parar el servicio", h:"Expandir y contraer",
  c:`<p>Durante un despliegue conviven la versión vieja y la nueva de la aplicación contra <b>la misma base de datos</b>. Renombrar <code>nombre</code> a <code>nombre_completo</code> de golpe rompe a la versión vieja. Se hace en pasos:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">renombrar una columna sin parada</div><table class="dg-tabla"><thead><tr><th>Despliegue</th><th>Migración</th><th>Aplicación</th></tr></thead><tbody>
       <tr><td>1 · expandir</td><td>añadir <code>nombre_completo</code> (nullable)</td><td>escribe en las dos columnas, lee de la vieja</td></tr>
       <tr><td>2 · migrar</td><td>copiar datos antiguos por lotes</td><td>lee de la nueva</td></tr>
       <tr><td>3 · contraer</td><td>borrar <code>nombre</code></td><td>solo usa la nueva</td></tr>
     </tbody></table></div>
     <div class="nota ojo"><b class="tit">Cuidado con los bloqueos</b>En tablas grandes, algunas operaciones bloquean la tabla mientras se ejecutan. En PostgreSQL, crea índices con <code>CREATE INDEX CONCURRENTLY</code> (en una migración sin transacción) y añade columnas <code>NOT NULL</code> en dos pasos.</div>`},
 {t:"orden", p:"Ordena los pasos para renombrar una columna sin parar el servicio",
  items:["Añadir la columna nueva sin quitar la vieja","Desplegar la aplicación que escribe en ambas columnas","Copiar los datos antiguos a la columna nueva","Desplegar la aplicación que solo usa la columna nueva","Borrar la columna vieja en una migración posterior"],
  why:"Cada paso es compatible con la versión anterior de la aplicación: si hay que volver atrás, nada se rompe."},
 {t:"escribe", p:"¿Cómo se llama la tabla donde Flyway registra las migraciones aplicadas?",
  sol:["flyway_schema_history"], pista:"flyway_ + schema + ...",
  why:"Guarda versión, descripción, checksum, fecha y si tuvo éxito. Consultarla es lo primero cuando dos entornos no cuadran."}
]},

{
id:"sp6l5",
titulo:"Auditoría y bloqueo optimista y pesimista",
claves:["@CreatedDate, @LastModifiedDate y @CreatedBy rellenan campos de auditoría","@Version implementa bloqueo optimista: detecta modificaciones concurrentes","@Lock(PESSIMISTIC_WRITE) bloquea la fila (SELECT ... FOR UPDATE) cuando el conflicto es frecuente"],
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
    @Version          private long version;       <span class="cm">// bloqueo optimista</span>
}</div>`},
 {t:"info", eti:"Dos a la vez", h:"Bloqueo optimista",
  c:`<p>Dos administradores abren el mismo pedido (versión 7). El primero guarda: <code>UPDATE ... SET version = 8 WHERE id = ? AND version = 7</code>. El segundo intenta guardar con versión 7: la actualización afecta a 0 filas y Hibernate lanza <code>OptimisticLockingFailureException</code>. En vez de pisar el cambio del primero, se informa con un <b>409</b> y se pide recargar.</p>`},
 {t:"par", p:"Empareja cada anotación con su efecto",
  pares:[["@CreatedDate","Fecha de creación rellenada automáticamente"],["@LastModifiedDate","Fecha de la última modificación"],["@CreatedBy","Usuario que creó el registro"],["@Version","Número de versión para el bloqueo optimista"],["@EntityListeners(AuditingEntityListener.class)","Activa la auditoría en la entidad"]],
  why:"Es el mismo mecanismo de bloqueo optimista que viste en el curso de SQL."},
 {t:"opcion", p:"¿Qué código HTTP es adecuado cuando falla el bloqueo optimista?",
  ops:["500","409 Conflict","404","200"],
  ok:1, why:"El cliente debe recargar la versión actual y volver a aplicar su cambio."},
 {t:"codigo", p:"Simula el bloqueo optimista de @Version",
  lenguaje:"java",
  c:`<p>Un pedido empieza en versión 0. Cada línea es <code>lee X</code> (el usuario X lee el pedido y recuerda su versión) o <code>guarda X</code> (intenta guardar con la versión que leyó).</p>
     <p>Al guardar: si la versión leída coincide con la actual, la versión sube en 1 e imprime <code>X: OK v&lt;nueva&gt;</code>; si no, imprime <code>X: 409</code>.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long version = 0;\n        Map<String, Long> leida = new HashMap<>();\n        while (sc.hasNext()) {\n            String op = sc.next();\n            String quien = sc.next();\n            // aplica la operación\n        }\n    }\n}\n",
  pruebas:[{entrada:"lee A\nguarda A", salida:"A: OK v1"},{entrada:"lee A\nlee B\nguarda A\nguarda B", salida:"A: OK v1\nB: 409"},{entrada:"lee A\nguarda A\nlee B\nguarda B\nguarda A", salida:"A: OK v1\nB: OK v2\nA: 409", oculta:true}],
  pista:"En «lee», leida.put(quien, version). En «guarda», compara leida.get(quien) con version.",
  solucion:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long version = 0;\n        Map<String, Long> leida = new HashMap<>();\n        while (sc.hasNext()) {\n            String op = sc.next();\n            String quien = sc.next();\n            if (op.equals(\"lee\")) {\n                leida.put(quien, version);\n            } else if (leida.containsKey(quien) && leida.get(quien) == version) {\n                version++;\n                leida.put(quien, version);\n                System.out.println(quien + \": OK v\" + version);\n            } else {\n                System.out.println(quien + \": 409\");\n            }\n        }\n    }\n}",
  why:"Es el WHERE version = ? del UPDATE: si otro guardó antes, tu versión ya no coincide y no pisas su cambio."},
 {t:"info", eti:"Cuando el conflicto es lo normal", h:"Bloqueo pesimista",
  c:`<div class="termbox">public interface ProductoRepository extends JpaRepository&lt;Producto, Long&gt; {
    @Lock(LockModeType.PESSIMISTIC_WRITE)                   <span class="cm">// SELECT ... FOR UPDATE</span>
    @Query("select p from Producto p where p.id = :id")
    Optional&lt;Producto&gt; bloquear(@Param("id") long id);
}

@Transactional
public void reservar(long productoId, int unidades) {
    Producto p = repo.bloquear(productoId).orElseThrow();   <span class="cm">// los demás esperan aquí</span>
    p.descontar(unidades);
}                                                           <span class="cm">// commit: se libera el bloqueo</span></div>
     <p>Optimista: no bloquea y detecta el choque al final (bien si los choques son raros). Pesimista: bloquea la fila desde la lectura (bien si muchos compiten por lo mismo, como el stock de una oferta), a cambio de esperas y posibles interbloqueos.</p>`},
 {t:"opcion", p:"En el Black Friday, 500 personas compran el mismo producto a la vez y casi todas reciben 409 por el bloqueo optimista. ¿Qué cambiarías?",
  ops:["Quitar @Version","Para ese caso, bloqueo pesimista corto o una actualización atómica (UPDATE stock SET cantidad = cantidad - 1 WHERE id = ? AND cantidad &gt; 0) y comprobar filas afectadas","Subir el pool","Reintentar infinitamente"],
  ok:1, why:"La actualización atómica condicional es la más rápida: la base de datos resuelve la concurrencia en una sola sentencia."}
]},

{
id:"sp6n1",
titulo:"El ciclo de vida de una entidad",
claves:["Estados: nueva, gestionada, separada y eliminada","Dentro de una transacción el contexto de persistencia es una caché: mismo id, mismo objeto","save() hace persist si la entidad es nueva y merge si no; equals y hashCode con cuidado"],
pasos:[
 {t:"info", eti:"Cuatro estados", h:"Del new al commit",
  c:`<div class="dg"><div class="dg-tit">estados de una entidad jpa</div>
       <div class="dg-flujo">
         <div class="dg-caja base">nueva (transient)<small><code>new Tarea("x")</code></small></div>
         <div class="dg-caja acento">gestionada (managed)<small>tras persist o al leerla</small></div>
         <div class="dg-caja">separada (detached)<small>al cerrarse el contexto</small></div>
       </div>
       <div class="dg-caja aviso" style="margin-top:12px">eliminada (removed): marcada con remove, se borra en el flush</div>
     </div>
     <p>Solo las entidades <b>gestionadas</b> tienen dirty checking: Hibernate compara su estado al hacer <b>flush</b> (antes del commit o de una consulta) y genera los INSERT, UPDATE y DELETE necesarios.</p>`},
 {t:"par", p:"Empareja cada operación con su efecto",
  pares:[["persist","Una entidad nueva pasa a gestionada; el INSERT se hace en el flush"],["merge","Copia el estado de una entidad separada sobre una gestionada y devuelve esta última"],["remove","Marca la entidad para borrarla en el flush"],["flush","Envía a la base de datos los cambios pendientes, sin hacer commit"],["detach / clear","Deja de vigilar una entidad o todas"]],
  why:"Spring Data envuelve todo esto en save() y delete(), pero los problemas raros se entienden con estos cinco verbos."},
 {t:"info", eti:"save() por dentro", h:"persist o merge",
  c:`<div class="termbox"><span class="cm">// SimpleJpaRepository.save, simplificado</span>
public &lt;S extends T&gt; S save(S entidad) {
    if (entityInformation.isNew(entidad)) {     <span class="cm">// ¿id null? (o @Version null)</span>
        em.persist(entidad);
        return entidad;
    }
    return em.merge(entidad);                   <span class="cm">// devuelve OTRA instancia: úsala a ella</span>
}</div>
     <p>Si asignas tú el id (por ejemplo un UUID) la entidad nunca parece nueva: <code>save</code> hace <code>merge</code>, que primero lanza un SELECT para buscarla. Soluciones: un campo <code>@Version</code> (null = nueva) o implementar <code>Persistable</code>.</p>`},
 {t:"opcion", p:"Dentro de un método <code>@Transactional</code> llamas dos veces a <code>repo.findById(7)</code>. ¿Cuántas consultas SQL se ejecutan?",
  ops:["Dos","Una: la segunda vez Hibernate devuelve el mismo objeto desde el contexto de persistencia (caché de primer nivel)","Ninguna","Depende del pool"],
  ok:1, why:"Mismo id en la misma transacción = mismo objeto Java. Fuera de una transacción, cada llamada abre su propio contexto y sí consulta dos veces."},
 {t:"vf", p:"Si modificas una entidad gestionada dentro de una transacción y no llamas a <code>save()</code>, el cambio se pierde.",
  ok:false, why:"El dirty checking la guarda al hacer flush. Llamar a save() sobre una entidad gestionada no hace daño, pero no hace falta."},
 {t:"opcion", p:"Tu entidad implementa <code>equals</code> y <code>hashCode</code> con todos sus campos, incluido el <code>id</code> generado. La añades a un <code>HashSet</code>, la guardas y ya no la encuentras en el set. ¿Por qué?",
  ops:["Un bug de HashSet","Al guardarla, el id pasó de null a un valor: cambió el hashCode y quedó en el cubo equivocado. Usa una clave de negocio inmutable, o id con hashCode constante (getClass().hashCode())","Porque Hibernate clona los objetos","Porque falta @Version"],
  ok:1, why:"Con Lombok, @Data en entidades provoca justo esto (y ciclos en toString). En entidades, escribe equals y hashCode a mano."},
 {t:"hueco", p:"Completa para forzar que los cambios pendientes lleguen a la base de datos dentro de una prueba, sin hacer commit",
  tpl:"repo.save(tarea);\nrepo.___();          // envía el INSERT ya\nentityManager.___();  // vacía la caché para leer de verdad de la base de datos", banco:["flush","clear","commit","refresh","close"], sol:["flush","clear"],
  why:"En pruebas con @DataJpaTest es la forma de comprobar lo que realmente se guarda, y no el objeto que sigue en memoria."}
]}

]});
