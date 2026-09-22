window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Java moderno",
resumen: "Records, clases selladas, pattern matching en switch, text blocks, fechas con java.time y BigDecimal",
nivel: "Avanzado",
color: "#c74b31",
lecciones: [

{
id:"jv10l1",
titulo:"Records",
claves:["record crea una clase de datos inmutable en una línea","Genera constructor, accesores, equals, hashCode y toString","Ideales para DTOs, respuestas de API y valores del dominio"],
pasos:[
 {t:"info", eti:"Menos código", h:"De 40 líneas a 1",
  c:`<div class="termbox">public record ProductoDto(Long id, String nombre, BigDecimal precio) { }

var p = new ProductoDto(1L, "Teclado", new BigDecimal("89.90"));
p.nombre();          <span class="cm">// "Teclado"  (accesor sin "get")</span>
p.equals(otro);      <span class="cm">// compara por contenido</span>
System.out.println(p);  <span class="cm">// ProductoDto[id=1, nombre=Teclado, precio=89.90]</span></div>
     <p>Los campos son <code>private final</code>: un record es <b>inmutable</b>. Se puede validar en un <b>constructor compacto</b>:</p>
     <div class="termbox">public record Email(String valor) {
    public Email {
        if (valor == null || !valor.contains("@")) throw new IllegalArgumentException("email no válido");
        valor = valor.toLowerCase();
    }
}</div>`},
 {t:"par", p:"Empareja lo que genera un record con su resultado",
  pares:[["Constructor canónico","Recibe todos los componentes en orden"],["Accesores","nombre(), precio()... sin prefijo get"],["equals y hashCode","Comparan por el valor de los componentes"],["toString","Nombre[campo=valor, ...]"]],
  why:"Jackson (el JSON de Spring) serializa records sin configuración extra."},
 {t:"opcion", p:"¿Para qué NO es buena idea un record?",
  ops:["Un DTO de respuesta de una API","Una entidad JPA con estado que cambia y relaciones perezosas","Un valor del dominio como Dinero o Email","Una clave compuesta de un mapa"],
  ok:1, why:"JPA necesita entidades mutables con constructor vacío. Para DTOs y valores, records."},
 {t:"vf", p:"Se pueden añadir métodos propios a un record.",
  ok:true, why:"Métodos de instancia y estáticos, sí. Lo que no admite son atributos de instancia adicionales ni herencia de otra clase."}
]},

{
id:"jv10l2",
titulo:"Clases selladas y pattern matching",
claves:["sealed limita qué clases pueden heredar","switch con patrones de tipo y de record, y el compilador comprueba la exhaustividad","Modela estados y resultados de forma segura"],
pasos:[
 {t:"info", eti:"Jerarquías cerradas", h:"sealed",
  c:`<div class="termbox">public sealed interface ResultadoPago permits Aprobado, Rechazado, Pendiente { }
public record Aprobado(String idTransaccion) implements ResultadoPago { }
public record Rechazado(String motivo) implements ResultadoPago { }
public record Pendiente(Duration reintentarEn) implements ResultadoPago { }</div>
     <p>Solo esas tres clases pueden implementar <code>ResultadoPago</code>. El compilador conoce todas las posibilidades.</p>`},
 {t:"info", eti:"Switch con tipos", h:"Pattern matching",
  c:`<div class="termbox">String mensaje = switch (resultado) {
    case Aprobado a            -&gt; "Pago correcto: " + a.idTransaccion();
    case Rechazado(String m)   -&gt; "Rechazado: " + m;           <span class="cm">// patron de record</span>
    case Pendiente p when p.reintentarEn().toMinutes() &gt; 10 -&gt; "Revisa más tarde";
    case Pendiente p           -&gt; "Procesando...";
};   <span class="cm">// sin default: el compilador sabe que estan todos los casos</span></div>
     <p>Si mañana añades <code>Reembolsado</code> a la jerarquía, este switch <b>deja de compilar</b> hasta que lo trates. Cero casos olvidados.</p>`},
 {t:"par", p:"Empareja cada característica con su utilidad",
  pares:[["sealed ... permits","Fijar qué subtipos existen"],["case Tipo t ->","Comprobar el tipo y convertir a la vez"],["case Rechazado(String m)","Extraer los componentes de un record"],["when","Añadir una condición a un caso"],["Exhaustividad","El compilador avisa si falta un caso"]],
  why:"Esta combinación trae a Java la potencia de los tipos algebraicos de lenguajes funcionales."},
 {t:"opcion", p:"¿Qué ventaja tiene un switch sobre una jerarquía sellada frente a una cadena de <code>if (x instanceof ...)</code>?",
  ops:["Ninguna","El compilador verifica que se tratan todos los subtipos y avisa al añadir uno nuevo","Es más rápido siempre","Permite herencia múltiple"],
  ok:1, why:"Los if encadenados olvidan casos en silencio."},
 {t:"vf", p:"Una clase que no aparece en <code>permits</code> puede implementar igualmente una interfaz sealed.",
  ok:false, why:"El compilador lo impide: solo las permitidas."}
]},

{
id:"jv10l3",
titulo:"Text blocks, fechas y BigDecimal",
claves:["Text blocks con triple comilla para textos multilínea (JSON, SQL)","java.time: LocalDate, LocalDateTime, Instant, ZonedDateTime, Duration","BigDecimal para dinero: crear desde String y redondear con RoundingMode"],
pasos:[
 {t:"info", eti:"Texto multilínea", h:"Text blocks",
  c:`<div class="termbox">String sql = """
    SELECT id, nombre
    FROM clientes
    WHERE ciudad = ?
    ORDER BY nombre
    """;</div>`},
 {t:"info", eti:"Tiempo bien hecho", h:"java.time",
  c:`<div class="termbox">LocalDate hoy = LocalDate.now();                          <span class="cm">// 2026-09-22 (sin hora ni zona)</span>
LocalDate entrega = hoy.plusDays(3);
LocalDateTime cita = LocalDateTime.of(2026, 9, 22, 10, 30);
Instant ahora = Instant.now();                            <span class="cm">// instante UTC: para guardar</span>
ZonedDateTime madrid = ahora.atZone(ZoneId.of("Europe/Madrid"));
Duration d = Duration.between(inicio, fin);               <span class="cm">// horas, minutos...</span>
Period edad = Period.between(nacimiento, hoy);            <span class="cm">// anos, meses, dias</span>
hoy.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));</div>
     <p>Olvida <code>java.util.Date</code> y <code>Calendar</code>: son mutables y confusos. Todo en java.time es inmutable.</p>`},
 {t:"par", p:"Empareja cada tipo de java.time con su uso",
  pares:[["LocalDate","Una fecha sin hora: cumpleaños"],["LocalDateTime","Fecha y hora sin zona"],["Instant","Un instante exacto en UTC: marcas de tiempo"],["ZonedDateTime","Fecha y hora en una zona horaria concreta"],["Duration","Cantidad de tiempo en horas, minutos y segundos"]],
  why:"Guarda instantes (Instant o timestamptz en PostgreSQL) y convierte a zona solo para mostrar."},
 {t:"info", eti:"Dinero", h:"BigDecimal",
  c:`<div class="termbox">new BigDecimal(0.1)        <span class="cm">// 0.1000000000000000055511151231257827... MAL</span>
new BigDecimal("0.1")      <span class="cm">// 0.1 exacto. BIEN</span>

BigDecimal total = precio.multiply(BigDecimal.valueOf(cantidad))
                         .add(envio)
                         .setScale(2, RoundingMode.HALF_UP);
total.compareTo(BigDecimal.ZERO) &gt; 0     <span class="cm">// comparar: compareTo, no equals</span></div>
     <p><code>new BigDecimal("2.0").equals(new BigDecimal("2.00"))</code> es <b>false</b> (distinta escala). Para comparar valores usa <code>compareTo</code>.</p>`},
 {t:"opcion", p:"¿Cuál es la forma correcta de crear un BigDecimal de 19,99?",
  ops:["new BigDecimal(19.99)","new BigDecimal(\"19.99\")","(BigDecimal) 19.99","BigDecimal.of(19.99f)"],
  ok:1, why:"Desde double arrastra el error binario. Desde String (o BigDecimal.valueOf(double)) es exacto."}
]}

]});
