window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Validación y gestión de errores",
resumen: "Bean Validation con @Valid, validación de métodos y parámetros, validaciones propias, @RestControllerAdvice, ProblemDetail y respuestas de error coherentes",
nivel: "Intermedio",
color: "#5ea136",
lecciones: [

{
id:"sp5l1",
titulo:"Validar la entrada",
claves:["Anota los DTOs: @NotBlank, @Size, @Email, @Positive, @NotNull, @Future...","@Valid en el parámetro activa la validación; si falla, 400 automático","Valida en el borde (DTOs) y protege las reglas de negocio en el dominio"],
pasos:[
 {t:"info", eti:"Nunca confíes en la entrada", h:"Bean Validation",
  c:`<div class="termbox">public record NuevoCliente(
    @NotBlank @Size(max = 100)       String nombre,
    @NotBlank @Email                 String email,
    @NotNull @Past                   LocalDate nacimiento,
    @Pattern(regexp = "\\\\+?[0-9 ]{9,15}") String telefono
) { }

@PostMapping
ResponseEntity&lt;ClienteDto&gt; crear(@Valid @RequestBody NuevoCliente peticion) { ... }</div>
     <p>Si algo no cumple, Spring lanza <code>MethodArgumentNotValidException</code> y responde <b>400</b> antes de entrar en tu método. Necesita el starter <code>spring-boot-starter-validation</code> (Hibernate Validator, la implementación de Jakarta Validation).</p>`},
 {t:"par", p:"Empareja cada anotación con lo que exige",
  pares:[["@NotNull","Que no sea null"],["@NotBlank","Texto no nulo y con algún carácter que no sea espacio"],["@Size(min, max)","Longitud dentro del rango"],["@Email","Formato de email"],["@Positive","Número mayor que cero"]],
  why:"@NotEmpty acepta \"   \"; @NotBlank no. Para textos, casi siempre @NotBlank."},
 {t:"hueco", p:"Completa para que Spring valide el cuerpo recibido",
  tpl:"TareaDto crear(@___ @RequestBody NuevaTarea peticion)", banco:["Valid","NotNull","Validated","Check"], sol:["Valid"],
  why:"Sin @Valid, las anotaciones del DTO se ignoran."},
 {t:"opcion", p:"Anotaste el DTO con @NotBlank pero las peticiones vacías llegan igualmente a tu servicio. ¿Qué falta?",
  ops:["Nada","@Valid en el parámetro del controlador (y el starter de validación)","Un try/catch","@Service"],
  ok:1, why:"Olvidar @Valid es el error más común con Bean Validation."},
 {t:"vf", p:"Validar en el frontend hace innecesaria la validación en el backend.",
  ok:false, why:"Cualquiera puede llamar a tu API con curl. La validación del frontend es solo para la comodidad del usuario."},
 {t:"info", eti:"Objetos anidados", h:"Validación en cascada",
  c:`<div class="termbox">public record NuevoPedido(
    @NotNull Long clienteId,
    @NotEmpty @Size(max = 50) List&lt;@Valid LineaPedidoDto&gt; lineas,   <span class="cm">// valida cada línea</span>
    @Valid DireccionDto direccion                                  <span class="cm">// y la dirección</span>
) { }

public record LineaPedidoDto(@NotNull Long productoId, @Positive @Max(99) int cantidad) { }</div>
     <p>Sin el <code>@Valid</code> interior, las anotaciones de <code>LineaPedidoDto</code> no se comprueban: la validación no baja sola a los objetos anidados. El error indica la ruta exacta: <code>lineas[2].cantidad</code>.</p>`},
 {t:"opcion", p:"¿Qué valida <code>@Size(max = 50)</code> sobre una <code>List</code>?",
  ops:["Que cada texto tenga como mucho 50 caracteres","Que la lista tenga como mucho 50 elementos: evita pedidos con miles de líneas que tumben el servidor","Nada, solo vale para textos","El tamaño en bytes"],
  ok:1, why:"Poner límites a colecciones y textos es también una medida de seguridad contra peticiones abusivas."}
]},

{
id:"sp5l2",
titulo:"Gestión centralizada de errores",
claves:["@RestControllerAdvice con @ExceptionHandler traduce excepciones a respuestas HTTP","ProblemDetail (RFC 9457) da un formato de error estándar","Nunca devuelvas trazas de pila ni mensajes internos al cliente"],
pasos:[
 {t:"info", eti:"Un solo sitio", h:"@RestControllerAdvice",
  c:`<div class="termbox">@RestControllerAdvice
public class ManejadorErrores {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    ProblemDetail noEncontrado(RecursoNoEncontradoException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalido(MethodArgumentNotValidException e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Datos no válidos");
        pd.setProperty("errores", e.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (a, b) -&gt; a)));
        return pd;
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail inesperado(Exception e) {
        log.error("Error no controlado", e);                 <span class="cm">// el detalle, al log</span>
        return ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);   <span class="cm">// al cliente, nada interno</span>
    }
}</div>`},
 {t:"info", eti:"Formato estándar", h:"ProblemDetail",
  c:`<div class="termbox">HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Datos no válidos",
  "instance": "/api/clientes",
  "errores": { "email": "debe ser una dirección de correo bien formada" }
}</div>
     <p>Con <code>spring.mvc.problemdetails.enabled=true</code>, Spring usa este formato también para sus propios errores (415, 405, 400 de conversión...). Si prefieres controlarlo tú, extiende <code>ResponseEntityExceptionHandler</code> y sobrescribe solo lo que quieras cambiar.</p>`},
 {t:"par", p:"Empareja cada excepción con la respuesta que debería producir",
  pares:[["RecursoNoEncontradoException","404 Not Found"],["MethodArgumentNotValidException","400 con los campos que fallan"],["EmailYaRegistradoException","409 Conflict"],["AccessDeniedException","403 Forbidden"],["Exception inesperada","500 sin detalles internos, registrada en el log"]],
  why:"Las excepciones de negocio se lanzan desde el servicio; el advice las traduce a HTTP."},
 {t:"opcion", p:"¿Por qué no devolver <code>e.getMessage()</code> ni la traza en los errores 500?",
  ops:["Porque ocupa mucho","Puede revelar detalles internos (SQL, rutas, versiones) útiles para un atacante; el detalle va al log con un id de correlación","Porque Jackson falla","No hay problema"],
  ok:1, why:"Devuelve un identificador de traza para que soporte pueda buscarlo en los logs."},
 {t:"vf", p:"Con @RestControllerAdvice, los controladores quedan libres de bloques try/catch para errores habituales.",
  ok:true, why:"El servicio lanza, el advice traduce: controladores finos y respuestas coherentes."},
 {t:"info", eti:"Errores con tipo", h:"Excepciones de negocio que ya saben su respuesta",
  c:`<div class="termbox">public class SaldoInsuficienteException extends ErrorResponseException {
    public SaldoInsuficienteException(BigDecimal falta) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, asProblem(falta), null);
    }
    private static ProblemDetail asProblem(BigDecimal falta) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, "Saldo insuficiente");
        pd.setType(URI.create("https://api.catappa.dev/errores/saldo-insuficiente"));
        pd.setTitle("Saldo insuficiente");
        pd.setProperty("falta", falta);
        return pd;
    }
}</div>
     <p>El campo <code>type</code> es una URI estable que identifica el tipo de error: los clientes deciden por él, no por el texto de <code>detail</code>, que puede cambiar o traducirse.</p>`},
 {t:"hueco", p:"Completa el manejador que traduce la excepción de negocio a 409",
  tpl:"@___(EmailYaRegistradoException.class)\nProblemDetail duplicado(EmailYaRegistradoException e) {\n    return ProblemDetail.___(HttpStatus.CONFLICT, \"El email ya está registrado\");\n}", banco:["ExceptionHandler","forStatusAndDetail","ControllerAdvice","forStatus","ResponseStatus"], sol:["ExceptionHandler","forStatusAndDetail"],
  why:"forStatusAndDetail rellena status, title (a partir del código) y detail de una vez."}
]},

{
id:"sp5l3",
titulo:"Validaciones propias y validación de métodos",
claves:["Anotaciones propias con ConstraintValidator para reglas reutilizables","Validaciones entre campos a nivel de clase (fecha fin posterior a la de inicio)","Parámetros de ruta y consulta y métodos de servicio también se validan; reglas que dependen de la base de datos, en el servicio"],
pasos:[
 {t:"info", eti:"A medida", h:"Crear una restricción",
  c:`<div class="termbox">@Target(FIELD) @Retention(RUNTIME)
@Constraint(validatedBy = IbanValidator.class)
public @interface IbanValido {
    String message() default "IBAN no válido";
    Class&lt;?&gt;[] groups() default {};
    Class&lt;? extends Payload&gt;[] payload() default {};
}

public class IbanValidator implements ConstraintValidator&lt;IbanValido, String&gt; {
    public boolean isValid(String v, ConstraintValidatorContext ctx) {
        return v == null || Iban.esValido(v);     <span class="cm">// null lo controla @NotNull</span>
    }
}

public record NuevaReserva(@NotNull LocalDate inicio, @NotNull LocalDate fin) {
    @AssertTrue(message = "La fecha de fin debe ser posterior a la de inicio")
    boolean isRangoValido() { return inicio == null || fin == null || fin.isAfter(inicio); }
}</div>`},
 {t:"par", p:"Empareja cada regla con dónde implementarla",
  pares:[["Formato de un IBAN","Anotación propia con ConstraintValidator"],["Fecha de fin posterior a la de inicio","@AssertTrue a nivel de clase o validador de clase"],["El email no está ya registrado","Servicio (consulta la base de datos) + restricción UNIQUE"],["El pedido no se puede cancelar tras enviarse","Método del dominio (pedido.cancelar())"]],
  why:"Formato en el DTO; reglas de negocio en el dominio o el servicio."},
 {t:"vf", p:"Es buena idea que un ConstraintValidator consulte la base de datos para comprobar si el email ya existe.",
  ok:false, why:"Mezcla capas y sigue sin evitar la carrera: la restricción UNIQUE es la garantía real."},
 {t:"codigo", p:"Implementa la lógica de <code>Iban.esValido</code> (módulo 97)",
  lenguaje:"java",
  c:`<p>Algoritmo del IBAN: quita los espacios y pasa a mayúsculas; mueve los 4 primeros caracteres al final; sustituye cada letra por un número (A=10, B=11... Z=35); el número resultante módulo 97 debe ser <b>1</b>. Además, la longitud debe estar entre 15 y 34 caracteres.</p>
     <p>Lee un IBAN por línea e imprime <code>valido</code> o <code>invalido</code>.</p>`,
  plantilla:"import java.math.BigInteger;\nimport java.util.*;\n\npublic class Main {\n    static boolean esValido(String iban) {\n        // implementa el algoritmo\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String l = sc.nextLine();\n            if (!l.isBlank()) System.out.println(esValido(l) ? \"valido\" : \"invalido\");\n        }\n    }\n}\n",
  pruebas:[{entrada:"ES9121000418450200051332", salida:"valido"},{entrada:"ES9121000418450200051331", salida:"invalido"},{entrada:"gb82 west 1234 5698 7654 32\nES91", salida:"valido\ninvalido"},{entrada:"DE89370400440532013000\nDE89370400440532013001", salida:"valido\ninvalido", oculta:true}],
  pista:"String s = iban.replace(\" \", \"\").toUpperCase(); String r = s.substring(4) + s.substring(0, 4); por cada carácter añade Character.getNumericValue(c) a un StringBuilder; new BigInteger(sb.toString()).mod(BigInteger.valueOf(97)).intValue() == 1.",
  solucion:"import java.math.BigInteger;\nimport java.util.*;\n\npublic class Main {\n    static boolean esValido(String iban) {\n        String s = iban.replace(\" \", \"\").toUpperCase();\n        if (s.length() < 15 || s.length() > 34 || !s.matches(\"[A-Z0-9]+\")) return false;\n        String r = s.substring(4) + s.substring(0, 4);\n        StringBuilder sb = new StringBuilder();\n        for (char c : r.toCharArray()) sb.append(Character.getNumericValue(c));\n        return new BigInteger(sb.toString()).mod(BigInteger.valueOf(97)).intValue() == 1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String l = sc.nextLine();\n            if (!l.isBlank()) System.out.println(esValido(l) ? \"valido\" : \"invalido\");\n        }\n    }\n}",
  why:"Character.getNumericValue('A') devuelve 10 y 'Z' 35: justo la tabla del estándar. Esta lógica pura es lo que va dentro del ConstraintValidator, y se prueba sin Spring."},
 {t:"info", eti:"Más allá del cuerpo", h:"Validar parámetros y métodos",
  c:`<div class="termbox"><span class="cm">// Spring Framework 6.1+: las restricciones en parámetros se validan solas</span>
@GetMapping("/api/tareas")
List&lt;TareaDto&gt; listar(@RequestParam @Min(0) int pagina,
                     @RequestParam @Max(100) int tamano) { ... }   <span class="cm">// 400 si no cumple</span>

<span class="cm">// en servicios: @Validated en la clase activa la validación de métodos (por proxy)</span>
@Service
@Validated
class TransferenciaService {
    void transferir(@NotNull @IbanValido String destino, @Positive BigDecimal importe) { ... }
}</div>
     <p>En los controladores, un fallo produce <code>HandlerMethodValidationException</code> (400). En los servicios, <code>ConstraintViolationException</code>, que conviene traducir tú en el advice: si no, acabaría en un 500.</p>`},
 {t:"opcion", p:"Quieres que <code>id</code> sea obligatorio al actualizar pero no al crear, con el mismo DTO. ¿Qué herramienta usa Bean Validation para eso?",
  ops:["Dos anotaciones @NotNull","Grupos de validación: @NotNull(groups = Actualizar.class) y @Validated(Actualizar.class) en el controlador","Un if en el controlador","No se puede"],
  ok:1, why:"Funciona, pero muchos equipos prefieren dos DTOs distintos (NuevaTarea y CambioTarea): más explícito y sin sorpresas."},
 {t:"opcion", p:"Un método de servicio con <code>@Validated</code> y <code>@Positive BigDecimal importe</code> recibe -5 desde un proceso por lotes y el cliente ve un 500. ¿Qué te falta?",
  ops:["Nada, 500 es correcto","Un @ExceptionHandler(ConstraintViolationException.class) que la traduzca a 400 con los campos que fallan","Quitar @Validated","Poner @Valid en el importe"],
  ok:1, why:"La validación funcionó; lo que falta es traducir su excepción a la respuesta adecuada."}
]}

]});
