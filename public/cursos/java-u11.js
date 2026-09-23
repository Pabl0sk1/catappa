window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Proyectos y pruebas",
resumen: "Paquetes e imports, Maven y Gradle, dependencias, JUnit 5, AssertJ, Mockito y buenas prácticas de testing",
nivel: "Avanzado",
color: "#be4329",
lecciones: [

{
id:"jv11l1",
titulo:"Paquetes y estructura de un proyecto",
claves:["Los paquetes organizan clases y evitan choques de nombres","La estructura de carpetas sigue al paquete: src/main/java/com/catappa/...","Organiza por funcionalidad (pedidos, clientes) mejor que por capa técnica"],
pasos:[
 {t:"info", eti:"Organizar", h:"package e import",
  c:`<div class="termbox">package com.catappa.pedidos;          <span class="cm">// primera linea del fichero</span>

import java.util.List;
import com.catappa.clientes.Cliente;

public class PedidoService { ... }</div>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">mi-api/</span></div><div class="rama" style="--n:1"><span class="nom">pom.xml</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/main/java/com/catappa/</span></div><div class="rama" style="--n:3"><span class="nom">Aplicacion.java</span></div><div class="rama" style="--n:3"><span class="nom carpeta">pedidos/</span><span class="coment">Pedido.java  PedidoService.java  PedidoController.java</span></div><div class="rama" style="--n:3"><span class="nom carpeta">clientes/</span><span class="coment">Cliente.java ClienteService.java ...</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/main/resources/</span><span class="coment">application.yml</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/test/java/com/catappa/pedidos/</span><span class="coment">PedidoServiceTest.java</span></div></div>
     <p>Agrupar por <b>funcionalidad</b> (pedidos, clientes) mantiene juntas las piezas que cambian a la vez. La alternativa por capa (controllers, services, repositories) dispersa cada cambio por todo el proyecto.</p>`},
 {t:"par", p:"Empareja cada carpeta con su contenido",
  pares:[["src/main/java","Código de la aplicación"],["src/main/resources","Configuración y ficheros estáticos"],["src/test/java","Pruebas"],["target/ (o build/)","Resultado de compilar: .class y el .jar"]],
  why:"Es la convención de Maven y Gradle: cualquier desarrollador Java se orienta al instante."},
 {t:"vf", p:"El paquete <code>com.catappa.pedidos</code> debe estar en la carpeta <code>com/catappa/pedidos</code>.",
  ok:true, why:"La estructura de directorios refleja el paquete."}
]},

{
id:"jv11l2",
titulo:"Maven y Gradle",
claves:["Gestionan dependencias, compilación, pruebas y empaquetado","Maven: pom.xml y fases (compile, test, package, verify, install)","Gradle: build.gradle(.kts), más flexible y rápido; usa el wrapper (mvnw, gradlew)"],
pasos:[
 {t:"info", eti:"Construir", h:"Maven y el pom.xml",
  c:`<div class="termbox">&lt;project&gt;
  &lt;groupId&gt;com.catappa&lt;/groupId&gt;
  &lt;artifactId&gt;mi-api&lt;/artifactId&gt;
  &lt;version&gt;1.0.0&lt;/version&gt;
  &lt;properties&gt;&lt;java.version&gt;21&lt;/java.version&gt;&lt;/properties&gt;
  &lt;dependencies&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;org.postgresql&lt;/groupId&gt;
      &lt;artifactId&gt;postgresql&lt;/artifactId&gt;
      &lt;scope&gt;runtime&lt;/scope&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;
&lt;/project&gt;</div>
     <div class="termbox">./mvnw clean package        <span class="cm"># compila, prueba y genera target/mi-api-1.0.0.jar</span>
./mvnw test                 <span class="cm"># solo pruebas</span>
./mvnw dependency:tree      <span class="cm"># arbol de dependencias (y transitivas)</span>
./gradlew build             <span class="cm"># equivalente en Gradle</span></div>
     <p>El <b>wrapper</b> (<code>mvnw</code>, <code>gradlew</code>) descarga la versión exacta de la herramienta: todos (y el CI) construyen igual.</p>`},
 {t:"orden", p:"Ordena las fases principales del ciclo de vida de Maven",
  items:["validate","compile","test","package","verify","install","deploy"],
  why:"Ejecutar una fase ejecuta todas las anteriores: mvn package también compila y prueba."},
 {t:"term", p:"Construye el jar del proyecto con el wrapper de Maven, limpiando antes",
  prompt:"pablo@portatil:~/mi-api$", sol:["./mvnw clean package","mvnw clean package","./mvnw clean install","mvn clean package"],
  pista:"./mvnw, la fase clean y la fase package.",
  salida:`[INFO] Tests run: 42, Failures: 0, Errors: 0, Skipped: 0
[INFO] Building jar: /home/pablo/mi-api/target/mi-api-1.0.0.jar
[INFO] BUILD SUCCESS`, why:"Ese jar es el que copiarás en tu imagen de Docker."},
 {t:"par", p:"Empareja cada scope de Maven con su significado",
  pares:[["compile (por defecto)","Necesaria para compilar y ejecutar"],["runtime","Solo al ejecutar (driver JDBC)"],["test","Solo para las pruebas (JUnit)"],["provided","La aporta el entorno (servidor de aplicaciones)"]],
  why:"Scopes correctos = jar más pequeño y menos conflictos."}
]},

{
id:"jv11l3",
titulo:"Pruebas con JUnit 5 y AssertJ",
claves:["@Test marca un método de prueba; patrón Given-When-Then (Arrange-Act-Assert)","assertThat (AssertJ) da aserciones legibles; assertThrows para excepciones","@ParameterizedTest prueba varios casos con el mismo código"],
pasos:[
 {t:"info", eti:"Probar", h:"Una prueba unitaria",
  c:`<div class="termbox">class CarritoTest {

    @Test
    void aplica_envio_gratis_a_partir_de_100_euros() {
        <span class="cm">// given</span>
        var carrito = new Carrito();
        carrito.anadir(new Linea("Monitor", new BigDecimal("120.00"), 1));

        <span class="cm">// when</span>
        BigDecimal envio = carrito.envio();

        <span class="cm">// then</span>
        assertThat(envio).isEqualByComparingTo("0");
    }

    @Test
    void no_permite_cantidades_negativas() {
        var carrito = new Carrito();
        assertThatThrownBy(() -&gt; carrito.anadir(new Linea("Ratón", BigDecimal.TEN, -1)))
            .isInstanceOf(IllegalArgumentException.class);
    }
}</div>`},
 {t:"info", eti:"Muchos casos", h:"Pruebas parametrizadas",
  c:`<div class="termbox">@ParameterizedTest
@CsvSource({ "49.99, 4.99", "50.00, 2.99", "99.99, 2.99", "100.00, 0" })
void calcula_envio(BigDecimal total, BigDecimal esperado) {
    assertThat(Envio.para(total)).isEqualByComparingTo(esperado);
}</div>
     <p>Probar los <b>límites</b> (49,99 / 50 / 100) es donde aparecen los errores.</p>`},
 {t:"par", p:"Empareja cada anotación de JUnit 5 con su uso",
  pares:[["@Test","Marca un método como prueba"],["@BeforeEach","Se ejecuta antes de cada prueba"],["@ParameterizedTest","Misma prueba con varios datos"],["@Disabled","Desactiva temporalmente una prueba"],["@DisplayName","Nombre legible en los informes"]],
  why:"Un nombre descriptivo convierte las pruebas en documentación viva."},
 {t:"orden", p:"Ordena las partes de una prueba bien estructurada",
  items:["Given: preparar los datos y el objeto a probar","When: ejecutar la acción que se prueba","Then: comprobar el resultado"],
  why:"También se llama Arrange-Act-Assert. Una prueba = un comportamiento."},
 {t:"vf", p:"Las pruebas unitarias deberían depender del orden en que se ejecutan.",
  ok:false, why:"Cada prueba debe ser independiente: JUnit no garantiza el orden y las dependencias entre pruebas las hacen frágiles."}
]},

{
id:"jv11l4",
titulo:"Mockito y tipos de pruebas",
claves:["Un mock sustituye a una dependencia para aislar la clase probada","when(...).thenReturn(...) define comportamiento; verify(...) comprueba llamadas","Pirámide: muchas unitarias, algunas de integración, pocas de extremo a extremo"],
pasos:[
 {t:"info", eti:"Aislar", h:"Mocks con Mockito",
  c:`<div class="termbox">@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {
    @Mock PedidoRepository repo;
    @Mock Notificador notificador;
    @InjectMocks PedidoService servicio;

    @Test
    void confirmar_pedido_notifica_al_cliente() {
        var pedido = new Pedido(7L, "ana@correo.com");
        when(repo.findById(7L)).thenReturn(Optional.of(pedido));

        servicio.confirmar(7L);

        verify(notificador).enviar(eq("ana@correo.com"), contains("confirmado"));
        verify(repo).save(pedido);
    }
}</div>
     <p>La prueba no toca la base de datos ni envía correos reales: es rápida y solo falla si falla la lógica de <code>PedidoService</code>.</p>`},
 {t:"par", p:"Empareja cada elemento de Mockito con su función",
  pares:[["@Mock","Crear un objeto falso de una dependencia"],["@InjectMocks","Crear la clase probada inyectándole los mocks"],["when(...).thenReturn(...)","Definir qué devuelve el mock"],["verify(...)","Comprobar que se llamó a un método"],["ArgumentCaptor","Capturar el argumento con el que se llamó"]],
  why:"La inyección por constructor hace las clases fáciles de probar con mocks."},
 {t:"info", eti:"Estrategia", h:"La pirámide de pruebas",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:1"><span class="nom carpeta">/</span><span class="coment">E2E  \\          pocas: lentas y fragiles (navegador, sistema completo)</span></div><div class="rama" style="--n:1"><span class="nom">/ integracion \\</span><span class="coment">algunas: con base de datos real (Testcontainers), @SpringBootTest</span></div><div class="rama" style="--n:0"><span class="nom carpeta">/</span><span class="coment">unitarias   \\    muchas: rapidas, aisladas, con mocks</span></div></div>
     <p><b>Testcontainers</b> arranca un PostgreSQL real en Docker durante las pruebas: pruebas de integración fiables sin bases de datos compartidas.</p>`},
 {t:"opcion", p:"Quieres comprobar que tu consulta JPA personalizada funciona con PostgreSQL de verdad. ¿Qué prueba escribes?",
  ops:["Unitaria con un mock del repositorio","De integración con Testcontainers levantando PostgreSQL","Ninguna, la consulta se ve bien","Manual en producción"],
  ok:1, why:"Un mock del repositorio no prueba la consulta; una base de datos en memoria distinta (H2) puede comportarse diferente."},
 {t:"vf", p:"Mockear todo, incluidas las clases de valor como records simples, es una buena práctica.",
  ok:false, why:"Se mockean dependencias externas o lentas; los objetos de valor se usan de verdad. Demasiados mocks hacen pruebas frágiles."}
]}

]});
