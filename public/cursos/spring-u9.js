window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Pruebas en Spring Boot",
resumen: "Pruebas unitarias de servicios, @WebMvcTest con MockMvc, @DataJpaTest, @SpringBootTest y Testcontainers",
nivel: "Avanzado",
color: "#4a902c",
lecciones: [

{
id:"sp9l1",
titulo:"Qué probar y con qué",
claves:["Servicios: pruebas unitarias con Mockito, sin Spring","Controladores: @WebMvcTest; repositorios: @DataJpaTest","Integración completa: @SpringBootTest con Testcontainers"],
pasos:[
 {t:"info", eti:"Estrategia", h:"Pruebas por capa",
  c:`<div class="diag">Capa             Tipo de prueba          Que arranca                 Velocidad
servicio         unitaria + Mockito      nada de Spring              milisegundos
controlador      @WebMvcTest             solo la capa web            rapida
repositorio      @DataJpaTest            JPA + base de datos         media
todo junto       @SpringBootTest         la aplicacion completa      lenta</div>
     <p>Las <b>slices</b> (<code>@WebMvcTest</code>, <code>@DataJpaTest</code>) cargan solo una parte del contexto: mucho más rápidas que <code>@SpringBootTest</code>.</p>`},
 {t:"par", p:"Empareja cada anotación con lo que carga",
  pares:[["@WebMvcTest","Controladores, filtros y conversores JSON"],["@DataJpaTest","Entidades, repositorios y la base de datos"],["@SpringBootTest","El contexto completo de la aplicación"],["@MockitoBean","Sustituye un bean del contexto por un mock"]],
  why:"@MockitoBean (antes @MockBean) reemplaza un bean real dentro del contexto de Spring de la prueba."},
 {t:"opcion", p:"Quieres comprobar que <code>POST /api/tareas</code> con un título vacío devuelve 400. ¿Qué prueba es la adecuada?",
  ops:["@SpringBootTest con base de datos","@WebMvcTest con MockMvc y el servicio mockeado","Una prueba manual con Postman","@DataJpaTest"],
  ok:1, why:"Es comportamiento de la capa web (validación y código de respuesta): no hace falta nada más."},
 {t:"vf", p:"Para probar la lógica de un @Service no hace falta arrancar Spring.",
  ok:true, why:"Con inyección por constructor, basta con new PedidoService(mockRepo, mockNotificador)."}
]},

{
id:"sp9l2",
titulo:"Controladores con MockMvc",
claves:["MockMvc simula peticiones HTTP sin servidor real","perform(...) y andExpect(status(), jsonPath(...))","Probar validación, códigos, JSON de respuesta y seguridad"],
pasos:[
 {t:"info", eti:"Web sin servidor", h:"@WebMvcTest",
  c:`<div class="termbox">@WebMvcTest(TareaController.class)
class TareaControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean TareaService servicio;

    @Test
    void crear_devuelve_201_y_la_tarea() throws Exception {
        when(servicio.crear(any())).thenReturn(new TareaDto(3, "Repasar Spring", false, null));

        mvc.perform(post("/api/tareas")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"titulo": "Repasar Spring"}
                    """))
           .andExpect(status().isCreated())
           .andExpect(header().string("Location", endsWith("/api/tareas/3")))
           .andExpect(jsonPath("$.titulo").value("Repasar Spring"));
    }

    @Test
    void titulo_vacio_devuelve_400() throws Exception {
        mvc.perform(post("/api/tareas").contentType(MediaType.APPLICATION_JSON).content("{\\"titulo\\": \\"\\"}"))
           .andExpect(status().isBadRequest());
    }
}</div>`},
 {t:"par", p:"Empareja cada elemento de MockMvc con su función",
  pares:[["perform(get(\"/api/x\"))","Ejecutar una petición simulada"],["andExpect(status().isOk())","Comprobar el código de estado"],["jsonPath(\"$.id\")","Leer un campo del JSON de respuesta"],["with(jwt())","Simular un usuario autenticado con JWT"],["@WithMockUser(roles = \"ADMIN\")","Simular un usuario con un rol"]],
  why:"Probar también las reglas de seguridad evita que un cambio abra un endpoint sin querer."},
 {t:"opcion", p:"¿Qué valida mejor que un endpoint protegido lo está de verdad?",
  ops:["Nada, confiar en la configuración","Una prueba que llame sin credenciales y espere 401, y otra con un rol insuficiente que espere 403","Revisar el código","Una prueba de rendimiento"],
  ok:1, why:"Las pruebas negativas de seguridad son las que evitan incidentes."}
]},

{
id:"sp9l3",
titulo:"Persistencia e integración con Testcontainers",
claves:["@DataJpaTest prueba repositorios y consultas contra una base de datos","Testcontainers arranca un PostgreSQL real en Docker durante la prueba","@ServiceConnection conecta Spring con el contenedor sin configuración"],
pasos:[
 {t:"info", eti:"Base de datos de verdad", h:"Testcontainers",
  c:`<div class="termbox">@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class TareaRepositoryTest {

    @Container @ServiceConnection
    static PostgreSQLContainer&lt;?&gt; pg = new PostgreSQLContainer&lt;&gt;("postgres:17-alpine");

    @Autowired TareaRepository repo;

    @Test
    void encuentra_las_vencidas() {
        repo.save(new Tarea("Antigua", LocalDate.now().minusDays(2)));
        repo.save(new Tarea("Futura", LocalDate.now().plusDays(2)));
        assertThat(repo.vencidas(LocalDate.now())).extracting(Tarea::getTitulo).containsExactly("Antigua");
    }
}</div>
     <p>Flyway aplica tus migraciones al contenedor, así que también pruebas que el esquema es correcto.</p>`},
 {t:"opcion", p:"¿Por qué usar PostgreSQL con Testcontainers en lugar de H2 en memoria?",
  ops:["H2 no existe","H2 no se comporta igual que PostgreSQL (tipos, funciones, SQL nativo); con Testcontainers pruebas contra la misma base de datos que producción","Es más rápido siempre","Por el tamaño del jar"],
  ok:1, why:"Pruebas que pasan en H2 y fallan en producción son un clásico."},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["@Testcontainers","Gestiona el ciclo de vida de los contenedores de la prueba"],["@Container","El contenedor que se arranca"],["@ServiceConnection","Configura automáticamente la conexión de Spring al contenedor"],["Replace.NONE","No sustituir la base de datos por una embebida"]],
  why:"En el CI (GitHub Actions) Docker está disponible, así que estas pruebas funcionan igual."},
 {t:"vf", p:"Testcontainers necesita Docker disponible en la máquina donde se ejecutan las pruebas.",
  ok:true, why:"Arranca contenedores reales. En el CI, los runners de GitHub Actions ya traen Docker."}
]}

]});
