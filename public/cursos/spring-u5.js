window.CURSOS = window.CURSOS || {};
(CURSOS.spring = CURSOS.spring || []).push({
titulo: "Validación y gestión de errores",
resumen: "Bean Validation con @Valid, validaciones propias, @RestControllerAdvice, ProblemDetail y respuestas de error coherentes",
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
     <p>Si algo no cumple, Spring lanza <code>MethodArgumentNotValidException</code> y responde <b>400</b> antes de entrar en tu método. Necesita el starter <code>spring-boot-starter-validation</code>.</p>`},
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
  ok:false, why:"Cualquiera puede llamar a tu API con curl. La validación del frontend es solo para la comodidad del usuario."}
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
     <p>Con <code>spring.mvc.problemdetails.enabled=true</code>, Spring usa este formato también para sus propios errores.</p>`},
 {t:"par", p:"Empareja cada excepción con la respuesta que debería producir",
  pares:[["RecursoNoEncontradoException","404 Not Found"],["MethodArgumentNotValidException","400 con los campos que fallan"],["EmailYaRegistradoException","409 Conflict"],["AccessDeniedException","403 Forbidden"],["Exception inesperada","500 sin detalles internos, registrada en el log"]],
  why:"Las excepciones de negocio se lanzan desde el servicio; el advice las traduce a HTTP."},
 {t:"opcion", p:"¿Por qué no devolver <code>e.getMessage()</code> ni la traza en los errores 500?",
  ops:["Porque ocupa mucho","Puede revelar detalles internos (SQL, rutas, versiones) útiles para un atacante; el detalle va al log con un id de correlación","Porque Jackson falla","No hay problema"],
  ok:1, why:"Devuelve un identificador de traza para que soporte pueda buscarlo en los logs."},
 {t:"vf", p:"Con @RestControllerAdvice, los controladores quedan libres de bloques try/catch para errores habituales.",
  ok:true, why:"El servicio lanza, el advice traduce: controladores finos y respuestas coherentes."}
]},

{
id:"sp5l3",
titulo:"Validaciones propias",
claves:["Anotaciones propias con ConstraintValidator para reglas reutilizables","Validaciones entre campos a nivel de clase (fecha fin posterior a la de inicio)","Reglas de negocio que dependen de la base de datos, en el servicio"],
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
        return v == null || Iban.esValido(v);     // null lo controla @NotNull
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
  ok:false, why:"Mezcla capas y sigue sin evitar la carrera: la restricción UNIQUE es la garantía real."}
]}

]});
