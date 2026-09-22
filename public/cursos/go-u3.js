window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Interfaces, errores y genéricos",
resumen: "Interfaces implícitas, gestión de errores con wrapping, defer, panic y recover, y genéricos",
nivel: "Intermedio",
color: "#45b5ce",
lecciones: [

{
id:"go3l1",
titulo:"Interfaces",
claves:["Un tipo implementa una interfaz de forma implícita: basta con tener sus métodos","Interfaces pequeñas: io.Reader, io.Writer, error, fmt.Stringer","Acepta interfaces, devuelve structs"],
pasos:[
 {t:"info", eti:"Contratos implícitos", h:"Interfaces en Go",
  c:`<div class="termbox">type Notificador interface {
    Enviar(destino, mensaje string) error
}

type Email struct{ servidor string }
func (e Email) Enviar(d, m string) error { ... }     // Email ya es un Notificador

type Slack struct{ webhook string }
func (s Slack) Enviar(d, m string) error { ... }

func Avisar(n Notificador, usuario string) error {   // acepta cualquier implementacion
    return n.Enviar(usuario, "Tu pedido ha salido")
}</div>
     <p>No existe <code>implements</code>: si el tipo tiene los métodos, cumple la interfaz. Esto facilita mucho las pruebas (un falso que implementa la interfaz).</p>`},
 {t:"par", p:"Empareja cada interfaz estándar con su método",
  pares:[["error","Error() string"],["fmt.Stringer","String() string"],["io.Reader","Read(p []byte) (n int, err error)"],["io.Writer","Write(p []byte) (n int, err error)"],["sort.Interface","Len, Less y Swap"]],
  why:"io.Reader y io.Writer permiten encadenar ficheros, red, compresión y cifrado."},
 {t:"vf", p:"En Go hay que declarar explícitamente que un tipo implementa una interfaz.",
  ok:false, why:"Es implícito (tipado estructural)."}
]},

{
id:"go3l2",
titulo:"Errores, defer y genéricos",
claves:["Envuelve errores con %w y compruébalos con errors.Is y errors.As","defer ejecuta al salir de la función: cerrar ficheros, liberar bloqueos","panic solo para errores irrecuperables; genéricos con [T any] y restricciones"],
pasos:[
 {t:"info", eti:"Errores con contexto", h:"Wrapping y defer",
  c:`<div class="termbox">var ErrNoEncontrado = errors.New("no encontrado")

func (r *Repo) Pedido(id int) (*Pedido, error) {
    fila := r.db.QueryRow("SELECT ... WHERE id = $1", id)
    var p Pedido
    if err := fila.Scan(&amp;p.ID, &amp;p.Total); err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("pedido %d: %w", id, ErrNoEncontrado)
        }
        return nil, fmt.Errorf("leyendo pedido %d: %w", id, err)
    }
    return &amp;p, nil
}

f, err := os.Open("datos.csv")
if err != nil { return err }
defer f.Close()                 // se cierra al salir, pase lo que pase

func Max[T cmp.Ordered](a, b T) T { if a &gt; b { return a }; return b }</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["fmt.Errorf(\"...: %w\", err)","Añadir contexto conservando el error original"],["errors.Is(err, ErrNoEncontrado)","Comprobar si en la cadena está ese error"],["errors.As(err, &destino)","Extraer un tipo de error concreto"],["defer","Ejecutar limpieza al salir de la función"],["[T cmp.Ordered]","Parámetro de tipo genérico con restricción"]],
  why:"Un error como «leyendo pedido 42: sql: no rows» cuenta toda la historia."},
 {t:"opcion", p:"¿Cuándo es apropiado <code>panic</code>?",
  ops:["Para cualquier error","Para situaciones imposibles o de programación (invariantes rotas) al arrancar; los errores esperados se devuelven como error","Nunca se puede usar","Para salir de un bucle"],
  ok:1, why:"Un servidor HTTP recupera panics por petición para no caerse entero."}
]},

{
id:"go3l3",
titulo:"Errores idiomáticos",
claves:["Envolver con fmt.Errorf y %w para añadir contexto","errors.Is compara con errores centinela; errors.As extrae un tipo","panic solo para errores de programación irrecuperables"],
pasos:[
 {t:"info", eti:"if err != nil", h:"Contexto sin perder la causa",
  c:`<div class="termbox">var ErrNoEncontrado = errors.New("no encontrado")

func (r *Repo) Buscar(id int) (Tarea, error) {
    t, err := r.db.Get(id)
    if err != nil {
        return Tarea{}, fmt.Errorf("buscar tarea %d: %w", id, err)
    }
    return t, nil
}

if errors.Is(err, ErrNoEncontrado) { /* 404 */ }
var ve *ErrValidacion
if errors.As(err, &amp;ve) { /* 400 con ve.Campo */ }</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["fmt.Errorf con %w","Añadir contexto conservando el error original"],["errors.Is","Comprobar si en la cadena hay un error concreto"],["errors.As","Obtener un error de un tipo concreto de la cadena"],["panic","Estado imposible: fallo de programación"],["recover","Capturar un panic dentro de un defer"]],
  why:"Los mensajes encadenados quedan como «buscar tarea 7: no encontrado»."},
 {t:"vf", p:"Comparar con <code>err == ErrNoEncontrado</code> funciona aunque el error se haya envuelto con %w.",
  ok:false, why:"Tras envolverlo ya es otro valor; errors.Is recorre la cadena."}
]}

]});
