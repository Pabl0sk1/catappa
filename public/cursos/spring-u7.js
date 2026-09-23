window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Relaciones, transacciones y rendimiento",
resumen: "@ManyToOne y @OneToMany, carga perezosa, el problema N+1, fetch join y EntityGraph, @Transactional, propagación y aislamiento, y SQL directo con JdbcClient",
nivel: "Intermedio",
color: "#549a31",
lecciones: [

{
id:"sp7l1",
titulo:"Relaciones entre entidades",
claves:["@ManyToOne en el lado «muchos» (tiene la clave foránea)","@OneToMany(mappedBy) en el lado «uno»; bidireccional solo si hace falta","Usa LAZY por defecto; @ManyToOne es EAGER de serie y conviene cambiarlo"],
pasos:[
 {t:"info", eti:"Relacionar", h:"Pedido y sus líneas",
  c:`<div class="termbox">@Entity
public class Pedido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List&lt;LineaPedido&gt; lineas = new ArrayList&lt;&gt;();

    public void anadirLinea(LineaPedido l) { lineas.add(l); l.setPedido(this); }  <span class="cm">// mantener ambos lados</span>
}

@Entity
public class LineaPedido {
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    ...
}</div>`},
 {t:"par", p:"Empareja cada elemento con su significado",
  pares:[["@ManyToOne","Muchas líneas pertenecen a un pedido (lleva la clave foránea)"],["@OneToMany(mappedBy = ...)","El otro lado de la relación, sin columna propia"],["cascade = ALL","Guardar o borrar el pedido propaga a sus líneas"],["orphanRemoval = true","Quitar una línea de la lista la borra de la base de datos"],["FetchType.LAZY","Cargar la relación solo cuando se accede a ella"]],
  why:"El lado con @JoinColumn es el «propietario»: es el que decide lo que se escribe en la base de datos."},
 {t:"opcion", p:"¿Por qué conviene poner <code>fetch = FetchType.LAZY</code> en @ManyToOne?",
  ops:["Porque es obligatorio","Porque por defecto es EAGER y cargaría el cliente en cada consulta de pedidos aunque no lo uses","Porque LAZY es más seguro frente a inyección SQL","No conviene"],
  ok:1, why:"Carga lo que necesitas cuando lo necesitas, y pide explícitamente lo demás con fetch join."},
 {t:"vf", p:"En una relación bidireccional, basta con añadir la línea a <code>pedido.getLineas()</code> para que se guarde bien la clave foránea.",
  ok:false, why:"Quien escribe la clave foránea es el lado propietario (linea.pedido). Por eso se usan métodos que actualizan ambos lados."},
 {t:"info", eti:"Muchos a muchos", h:"@ManyToMany y cuándo evitarlo",
  c:`<div class="termbox"><span class="cm">// sencillo, pero sin sitio para datos de la relación</span>
@ManyToMany
@JoinTable(name = "alumno_curso", joinColumns = @JoinColumn(name = "alumno_id"),
           inverseJoinColumns = @JoinColumn(name = "curso_id"))
private Set&lt;Curso&gt; cursos = new HashSet&lt;&gt;();

<span class="cm">// en cuanto la relación necesita «fecha de matrícula» o «nota», se vuelve entidad</span>
@Entity
class Matricula {
    @ManyToOne(fetch = LAZY) Alumno alumno;
    @ManyToOne(fetch = LAZY) Curso curso;
    LocalDate fecha;
    BigDecimal nota;
}</div>
     <p>Casi toda relación muchos a muchos acaba necesitando datos propios. Modelarla desde el principio como entidad intermedia ahorra una migración dolorosa. Si usas <code>@ManyToMany</code>, que sea con <code>Set</code>, no con <code>List</code>.</p>`},
 {t:"opcion", p:"Pones <code>cascade = CascadeType.ALL</code> en el <code>@ManyToOne</code> de <code>Pedido</code> hacia <code>Cliente</code> y borras un pedido. ¿Qué ocurre?",
  ops:["Solo se borra el pedido","Se intenta borrar también el cliente, que tiene otros pedidos: error de clave foránea o, peor, datos perdidos","Nada","Se borran las líneas"],
  ok:1, why:"La cascada va del padre a sus partes (pedido → líneas), nunca de la parte hacia algo compartido como el cliente."},
 {t:"hueco", p:"Completa el lado «uno» de la relación, que no tiene columna propia",
  tpl:"@OneToMany(___ = \"pedido\", cascade = CascadeType.ALL, ___ = true)\nprivate List<LineaPedido> lineas = new ArrayList<>();", banco:["mappedBy","orphanRemoval","joinColumn","fetch","optional"], sol:["mappedBy","orphanRemoval"],
  why:"mappedBy apunta al atributo del lado propietario; orphanRemoval borra las líneas que quitas de la lista."}
]},

{
id:"sp7l2",
titulo:"El problema N+1",
claves:["Cargar N entidades y acceder a una relación perezosa en cada una lanza N consultas extra","Se detecta mirando el SQL generado (show-sql, logs, contadores)","Se resuelve con JOIN FETCH, @EntityGraph, proyecciones o @BatchSize"],
pasos:[
 {t:"info", eti:"El clásico", h:"Cómo aparece",
  c:`<div class="termbox">List&lt;Pedido&gt; pedidos = pedidoRepo.findByEstado(PAGADO);     <span class="cm">// 1 consulta</span>
return pedidos.stream()
    .map(p -&gt; new PedidoDto(p.getId(), p.getCliente().getNombre()))  <span class="cm">// +1 consulta POR pedido</span>
    .toList();
<span class="cm">// 200 pedidos = 201 consultas</span></div>
     <div class="termbox">spring:
  jpa:
    show-sql: true                      <span class="cm"># en desarrollo, para verlo</span>
logging.level.org.hibernate.SQL: debug</div>`},
 {t:"info", eti:"Soluciones", h:"Traerlo todo en una consulta",
  c:`<div class="termbox"><span class="cm">// 1. JOIN FETCH</span>
@Query("select p from Pedido p join fetch p.cliente where p.estado = :estado")
List&lt;Pedido&gt; conCliente(@Param("estado") Estado estado);

<span class="cm">// 2. EntityGraph</span>
@EntityGraph(attributePaths = {"cliente"})
List&lt;Pedido&gt; findByEstado(Estado estado);

<span class="cm">// 3. Proyección directa a DTO: una consulta y solo las columnas necesarias</span>
@Query("select new com.catappa.PedidoDto(p.id, c.nombre) from Pedido p join p.cliente c where p.estado = :estado")
List&lt;PedidoDto&gt; resumen(@Param("estado") Estado estado);</div>
     <p>Ojo: hacer <code>join fetch</code> de una colección (<code>@OneToMany</code>) junto con paginación hace que Hibernate pagine en memoria. Para colecciones, <code>@BatchSize</code> (o <code>hibernate.default_batch_fetch_size</code>) o dos consultas.</p>`},
 {t:"par", p:"Empareja cada técnica con su efecto",
  pares:[["join fetch","Carga la relación en la misma consulta"],["@EntityGraph","Indica qué relaciones cargar sin escribir JPQL"],["Proyección a DTO","Una consulta con solo las columnas necesarias"],["@BatchSize","Carga las relaciones perezosas en lotes (IN (...))"]],
  why:"Explicar el N+1 y dos soluciones es una pregunta casi segura en entrevistas de Spring."},
 {t:"opcion", p:"Un listado de 50 pedidos genera 51 consultas SQL. ¿Qué es lo primero que harías?",
  ops:["Subir el pool de conexiones","Cargar la relación con join fetch o @EntityGraph (o proyectar a DTO)","Cachear todo","Cambiar a MongoDB"],
  ok:1, why:"Es exactamente el síntoma del N+1."},
 {t:"codigo", p:"Cuenta las consultas que lanza cada estrategia de carga",
  lenguaje:"java",
  c:`<p>Cada línea es una de estas: <code>lazy N</code> (carga perezosa sin más), <code>batch N B</code> (con <code>@BatchSize(size = B)</code>) o <code>fetch N</code> (join fetch). <code>N</code> es el número de pedidos, cada uno con un cliente distinto. Imprime cuántas consultas SQL se ejecutan en total al recorrer todos los clientes.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNext()) {\n            String modo = sc.next();\n            int n = sc.nextInt();\n            int b = modo.equals(\"batch\") ? sc.nextInt() : 0;\n            // calcula el número de consultas\n        }\n    }\n}\n",
  pruebas:[{entrada:"lazy 50", salida:"51"},{entrada:"fetch 50", salida:"1"},{entrada:"batch 50 16", salida:"5"},{entrada:"batch 0 10\nlazy 0\nbatch 32 16\nbatch 33 16", salida:"1\n1\n3\n4", oculta:true}],
  pista:"lazy: 1 + n. fetch: 1. batch: 1 + ceil(n / b), que en enteros es (n + b - 1) / b.",
  solucion:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNext()) {\n            String modo = sc.next();\n            int n = sc.nextInt();\n            int b = modo.equals(\"batch\") ? sc.nextInt() : 0;\n            int consultas;\n            if (modo.equals(\"fetch\")) consultas = 1;\n            else if (modo.equals(\"batch\")) consultas = 1 + (n + b - 1) / b;\n            else consultas = 1 + n;\n            System.out.println(consultas);\n        }\n    }\n}",
  why:"Con 1.000 pedidos: 1.001 consultas en lazy, 64 con lotes de 16 y 1 con join fetch. La latencia de red por consulta es lo que hace daño."},
 {t:"vf", p:"Poner todas las relaciones en <code>FetchType.EAGER</code> resuelve el problema N+1.",
  ok:false, why:"Con consultas JPQL, EAGER suele provocar igualmente consultas extra por fila, y además carga siempre datos que no necesitas. La carga se decide por caso de uso, no en la entidad."},
 {t:"opcion", p:"¿Cómo evitas que un N+1 vuelva a colarse sin que nadie se dé cuenta?",
  ops:["Revisando el código a ojo","Una prueba que cuente las consultas de los endpoints críticos (con las estadísticas de Hibernate o datasource-proxy) y falle si superan un límite","Subiendo el pool","Desactivando los logs"],
  ok:1, why:"Un cambio inocente en un DTO (acceder a una relación más) puede reintroducirlo: solo una prueba automática lo detecta a tiempo."}
]},

{
id:"sp7l3",
titulo:"@Transactional y el contexto de persistencia",
claves:["@Transactional abre una transacción al entrar al método y hace commit o rollback al salir","Dentro de la transacción, las entidades están gestionadas: los cambios se guardan solos (dirty checking)","Rollback por defecto solo con excepciones no comprobadas; funciona mediante proxy"],
pasos:[
 {t:"info", eti:"Todo o nada", h:"@Transactional en el servicio",
  c:`<div class="termbox">@Service
public class PedidoService {

    @Transactional
    public void pagar(long pedidoId, String referencia) {
        Pedido p = repo.findById(pedidoId).orElseThrow(() -&gt; new PedidoNoEncontrado(pedidoId));
        p.marcarPagado(referencia);          <span class="cm">// sin save(): se guarda al hacer commit</span>
        stockService.descontar(p.lineas());  <span class="cm">// si esto lanza, se deshace también el pago</span>
    }

    @Transactional(readOnly = true)
    public List&lt;PedidoDto&gt; listar() { ... }
}</div>
     <p>Dentro de la transacción, Hibernate vigila las entidades cargadas (<b>contexto de persistencia</b>). Al hacer commit compara y genera los UPDATE necesarios: <b>dirty checking</b>.</p>`},
 {t:"par", p:"Empareja cada atributo o concepto con su efecto",
  pares:[["readOnly = true","Optimiza lecturas y evita escrituras accidentales"],["rollbackFor = Exception.class","Deshacer también ante excepciones comprobadas"],["propagation = REQUIRES_NEW","Abrir una transacción independiente"],["Dirty checking","Guardar los cambios de entidades gestionadas al hacer commit"],["Contexto de persistencia","Caché de entidades de la transacción actual"]],
  why:"Por defecto, una excepción comprobada NO provoca rollback: sorpresa habitual."},
 {t:"info", eti:"Trampas", h:"Por qué a veces no funciona",
  c:`<ul><li><b>Autollamada</b>: <code>this.pagar()</code> desde otro método de la misma clase no pasa por el proxy → no hay transacción.</li>
     <li>Métodos <b>private</b>: el proxy no puede interceptarlos.</li>
     <li>Capturar la excepción dentro del método: si no sale, no hay rollback.</li>
     <li><b>LazyInitializationException</b>: acceder a una relación perezosa después de cerrarse la transacción (por ejemplo, al serializar en el controlador con <code>open-in-view: false</code>). Solución: cargar lo necesario dentro del servicio y devolver DTOs.</li></ul>`},
 {t:"opcion", p:"Aparece <code>LazyInitializationException: could not initialize proxy - no Session</code> al devolver una entidad desde el controlador. ¿Mejor solución?",
  ops:["Poner todo en EAGER","Activar open-in-view","Cargar lo necesario en el servicio transaccional (fetch join) y devolver un DTO","Capturar la excepción"],
  ok:2, why:"EAGER global y open-in-view esconden el problema y generan consultas ocultas."},
 {t:"vf", p:"Un método <code>@Transactional</code> hace rollback por defecto cuando lanza una <code>IOException</code>.",
  ok:false, why:"Solo con RuntimeException y Error. Para comprobadas: rollbackFor."},
 {t:"opcion", p:"¿Qué hace este código si el correo falla?", c:`<div class="termbox">@Transactional
public void registrar(NuevoUsuario u) {
    repo.save(Usuario.de(u));
    try {
        correo.enviarBienvenida(u.email());
    } catch (CorreoException e) {
        log.warn("No se pudo enviar", e);
    }
}</div>`,
  ops:["Deshace el alta del usuario","El usuario se guarda: la excepción se captura dentro y el proxy nunca la ve, así que hace commit","Lanza un 500","Reintenta el correo"],
  ok:1, why:"Aquí es lo deseado. Pero si capturas una excepción que sí debía deshacer la transacción, el error queda enterrado y los datos a medias."},
 {t:"hueco", p:"Completa para que una excepción comprobada también deshaga la transacción",
  tpl:"@Transactional(___ = Exception.class)\npublic void importar(Path fichero) throws IOException { ... }", banco:["rollbackFor","noRollbackFor","readOnly","propagation"], sol:["rollbackFor"],
  why:"noRollbackFor hace lo contrario: confirmar aunque salga una excepción concreta."}
]},

{
id:"sp7l4",
titulo:"Propagación y aislamiento en @Transactional",
claves:["REQUIRED (por defecto) se une a la transacción existente; REQUIRES_NEW abre otra independiente","isolation fija el nivel de aislamiento; timeout y readOnly afinan","Las transacciones deben ser cortas: nada de llamadas HTTP lentas dentro"],
pasos:[
 {t:"info", eti:"Transacciones anidadas", h:"Propagación",
  c:`<div class="termbox">@Service
class PedidoService {
    @Transactional
    public void confirmar(long id) {
        pedidos.confirmar(id);
        auditoria.registrar("confirmado", id);      <span class="cm">// en otro bean</span>
        if (algoFalla) throw new IllegalStateException();   <span class="cm">// rollback de confirmar...</span>
    }
}

@Service
class AuditoriaService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrar(String evento, long id) { ... }   <span class="cm">// ...pero la auditoría se conserva</span>
}</div>`},
 {t:"par", p:"Empareja cada propagación con su comportamiento",
  pares:[["REQUIRED","Usa la transacción actual o crea una si no hay"],["REQUIRES_NEW","Suspende la actual y abre una nueva independiente"],["MANDATORY","Exige que ya exista una transacción"],["NOT_SUPPORTED","Se ejecuta sin transacción"],["NESTED","Punto de guardado dentro de la actual"]],
  why:"REQUIRES_NEW solo funciona si la llamada pasa por el proxy (otro bean)."},
 {t:"opcion", p:"Un método @Transactional llama a una pasarela de pago externa que tarda 20 segundos. ¿Qué problema causa?",
  ops:["Ninguno","Mantiene la conexión de la base de datos y los bloqueos durante 20 s: se agota el pool con poca carga","Se acelera el pago","Hibernate lo cancela"],
  ok:1, why:"Llama a servicios externos fuera de la transacción y guarda el resultado después."},
 {t:"info", eti:"Aislamiento", h:"Qué ve cada transacción",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">niveles de aislamiento en postgresql</div><table class="dg-tabla"><thead><tr><th>Nivel</th><th>Qué evita</th><th>Uso</th></tr></thead><tbody>
       <tr><td>READ COMMITTED</td><td>leer datos sin confirmar</td><td>por defecto en PostgreSQL; casi todo</td></tr>
       <tr><td>REPEATABLE READ</td><td>que una fila leída cambie dentro de tu transacción</td><td>informes coherentes</td></tr>
       <tr><td>SERIALIZABLE</td><td>cualquier anomalía entre transacciones concurrentes</td><td>reglas delicadas; hay que reintentar los fallos de serialización</td></tr>
     </tbody></table></div>
     <div class="termbox">@Transactional(isolation = Isolation.REPEATABLE_READ, timeout = 5)
public Informe cierreMensual() { ... }</div>`},
 {t:"opcion", p:"Con REQUIRED (por defecto), un método interno de otro bean lanza una RuntimeException y el externo la captura y sigue. Al hacer commit salta <code>UnexpectedRollbackException</code>. ¿Por qué?",
  ops:["Un bug de Spring","Ambos comparten la misma transacción: el interno la marcó como «solo rollback» al lanzar, y el externo ya no puede confirmarla","Falta readOnly","El pool está agotado"],
  ok:1, why:"Si quieres que el fallo interno no afecte al externo, el interno necesita su propia transacción (REQUIRES_NEW) o no lanzar."},
 {t:"orden", p:"Ordena lo que ocurre con REQUIRES_NEW cuando <code>confirmar</code> llama a <code>auditoria.registrar</code> y después falla",
  items:["Se abre la transacción de confirmar","Al llamar a registrar, se suspende la transacción de confirmar","registrar abre su propia transacción y hace commit","Se reanuda la transacción de confirmar","confirmar lanza la excepción y solo su transacción hace rollback"],
  why:"Ojo: REQUIRES_NEW usa una segunda conexión del pool mientras la primera sigue abierta. Con mucha carga puede agotar el pool."},
 {t:"vf", p:"<code>@Transactional(readOnly = true)</code> impide a nivel de base de datos cualquier escritura en todos los casos.",
  ok:false, why:"Es una pista de optimización: Hibernate desactiva el dirty checking y el driver puede marcar la conexión como de solo lectura, pero una consulta nativa de escritura podría pasar según la base de datos."}
]},

{
id:"sp7n1",
titulo:"JdbcClient, SQL directo y escrituras masivas",
claves:["JdbcClient (Spring Framework 6.1+) da una API fluida sobre JDBC para SQL a mano","Úsalo en informes, consultas complejas y cargas masivas donde JPA estorba","Para insertar miles de filas: lotes JDBC, no save() en un bucle"],
pasos:[
 {t:"info", eti:"Sin ORM", h:"JdbcClient",
  c:`<div class="termbox">@Repository
class InformeRepository {
    private final JdbcClient jdbc;
    InformeRepository(JdbcClient jdbc) { this.jdbc = jdbc; }       <span class="cm">// lo autoconfigura Boot</span>

    List&lt;VentasMes&gt; ventasPorMes(int anio) {
        return jdbc.sql("""
                select date_trunc('month', creado_en) as mes, sum(total) as total
                from pedidos
                where extract(year from creado_en) = :anio and estado = 'PAGADO'
                group by 1 order by 1
                """)
            .param("anio", anio)
            .query(VentasMes.class)       <span class="cm">// mapea columnas a un record por nombre</span>
            .list();
    }
}</div>
     <p>No hay entidades, contexto de persistencia ni sorpresas: el SQL que escribes es el que se ejecuta. Convive sin problemas con JPA en la misma aplicación y la misma transacción.</p>`},
 {t:"par", p:"Empareja cada caso con la herramienta más adecuada",
  pares:[["CRUD de un agregado con reglas de negocio","Spring Data JPA"],["Informe con agregaciones y funciones de ventana","JdbcClient con SQL nativo"],["Cargar 500.000 filas de un CSV","Inserciones JDBC por lotes (o COPY de PostgreSQL)"],["Leer una lista para un listado","Proyección a DTO"]],
  why:"JPA brilla modificando agregados; para leer en masa o escribir en masa, SQL directo."},
 {t:"hueco", p:"Completa la consulta con JdbcClient",
  tpl:"Optional<String> email = jdbc.___(\"select email from clientes where id = :id\")\n    .___(\"id\", 42)\n    .query(String.class)\n    .optional();", banco:["sql","param","query","where","bind"], sol:["sql","param"],
  why:"Parámetros con nombre: nunca concatenes valores en el SQL (inyección SQL)."},
 {t:"opcion", p:"Un proceso importa 200.000 productos con <code>repo.save(p)</code> dentro de un bucle y tarda 40 minutos. ¿Qué harías?",
  ops:["Más memoria","Insertar por lotes: saveAll con hibernate.jdbc.batch_size y ids de secuencia (IDENTITY impide los lotes), o JDBC batchUpdate, confirmando cada pocos miles de filas","Un hilo por producto","Desactivar los índices para siempre"],
  ok:1, why:"Cada save es un viaje a la base de datos; con lotes, cientos de filas viajan juntas. Y con IDENTITY Hibernate necesita el id de cada INSERT, así que no puede agruparlos."},
 {t:"info", eti:"Lotes", h:"Escribir en masa",
  c:`<div class="termbox">spring:
  jpa:
    properties:
      hibernate:
        jdbc.batch_size: 50
        order_inserts: true</div>
     <div class="termbox"><span class="cm">// o directamente con JDBC</span>
jdbcTemplate.batchUpdate(
    "insert into productos (sku, nombre, precio) values (?, ?, ?)",
    lote, 1000,
    (ps, p) -&gt; { ps.setString(1, p.sku()); ps.setString(2, p.nombre()); ps.setBigDecimal(3, p.precio()); });</div>
     <p>Para los lotes de Hibernate, la entidad debe usar <code>GenerationType.SEQUENCE</code> (con <code>allocationSize</code>) en lugar de <code>IDENTITY</code>. Y en procesos largos, confirma y limpia el contexto de persistencia cada cierto número de filas para no acumular miles de entidades en memoria.</p>`},
 {t:"vf", p:"Un repositorio con JdbcClient y otro con JPA pueden participar en la misma transacción de <code>@Transactional</code>.",
  ok:true, why:"Ambos usan el mismo DataSource y el mismo gestor de transacciones (JpaTransactionManager expone la conexión a JDBC)."},
 {t:"opcion", p:"El pool de HikariCP tiene 10 conexiones y 200 hilos virtuales atienden peticiones. ¿Qué limita realmente cuántas consultas simultáneas hace tu aplicación?",
  ops:["El número de hilos virtuales","El tamaño del pool: el resto de peticiones espera una conexión libre (hasta connection-timeout, 30 s por defecto)","La CPU","El número de réplicas de la base de datos"],
  ok:1, why:"Un pool más grande no siempre ayuda: la base de datos rinde mejor con pocas conexiones activas. Mide hikaricp_connections_pending antes de tocarlo."}
]}

]});
