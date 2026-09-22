window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Relaciones, transacciones y rendimiento",
resumen: "@ManyToOne y @OneToMany, carga perezosa, el problema N+1, fetch join y EntityGraph, @Transactional y el contexto de persistencia",
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
  ok:false, why:"Quien escribe la clave foránea es el lado propietario (linea.pedido). Por eso se usan métodos que actualizan ambos lados."}
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

<span class="cm">// 3. Proyeccion directa a DTO: una consulta y solo las columnas necesarias</span>
@Query("select new com.catappa.PedidoDto(p.id, c.nombre) from Pedido p join p.cliente c where p.estado = :estado")
List&lt;PedidoDto&gt; resumen(@Param("estado") Estado estado);</div>
     <p>Ojo: hacer <code>join fetch</code> de una colección (<code>@OneToMany</code>) junto con paginación hace que Hibernate pagine en memoria. Para colecciones, <code>@BatchSize</code> o dos consultas.</p>`},
 {t:"par", p:"Empareja cada técnica con su efecto",
  pares:[["join fetch","Carga la relación en la misma consulta"],["@EntityGraph","Indica qué relaciones cargar sin escribir JPQL"],["Proyección a DTO","Una consulta con solo las columnas necesarias"],["@BatchSize","Carga las relaciones perezosas en lotes (IN (...))"]],
  why:"Explicar el N+1 y dos soluciones es una pregunta casi segura en entrevistas de Spring."},
 {t:"opcion", p:"Un listado de 50 pedidos genera 51 consultas SQL. ¿Qué es lo primero que harías?",
  ops:["Subir el pool de conexiones","Cargar la relación con join fetch o @EntityGraph (o proyectar a DTO)","Cachear todo","Cambiar a MongoDB"],
  ok:1, why:"Es exactamente el síntoma del N+1."}
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
        stockService.descontar(p.lineas());  <span class="cm">// si esto lanza, se deshace tambien el pago</span>
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
  ok:false, why:"Solo con RuntimeException y Error. Para comprobadas: rollbackFor."}
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
        auditoria.registrar("confirmado", id);      // en otro bean
        if (algoFalla) throw new IllegalStateException();   // rollback de confirmar...
    }
}

@Service
class AuditoriaService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrar(String evento, long id) { ... }   // ...pero la auditoria se conserva
}</div>`},
 {t:"par", p:"Empareja cada propagación con su comportamiento",
  pares:[["REQUIRED","Usa la transacción actual o crea una si no hay"],["REQUIRES_NEW","Suspende la actual y abre una nueva independiente"],["MANDATORY","Exige que ya exista una transacción"],["NOT_SUPPORTED","Se ejecuta sin transacción"],["NESTED","Punto de guardado dentro de la actual"]],
  why:"REQUIRES_NEW solo funciona si la llamada pasa por el proxy (otro bean)."},
 {t:"opcion", p:"Un método @Transactional llama a una pasarela de pago externa que tarda 20 segundos. ¿Qué problema causa?",
  ops:["Ninguno","Mantiene la conexión de la base de datos y los bloqueos durante 20 s: se agota el pool con poca carga","Se acelera el pago","Hibernate lo cancela"],
  ok:1, why:"Llama a servicios externos fuera de la transacción y guarda el resultado después."}
]}

]});
