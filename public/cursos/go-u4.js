window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Structs, métodos e interfaces",
resumen: "Modelar datos con structs, métodos con receptor valor o puntero, composición por embebido, interfaces implícitas, any, aserciones y type switch",
nivel: "Intermedio",
color: "#48b9d3",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"go4n1",
titulo:"Structs",
claves:["Un struct agrupa campos con nombre; se crea con literales, con new o con una función constructora NewX","Los structs se copian al asignarse y se comparan con == si todos sus campos son comparables","Las etiquetas (tags) añaden metadatos a los campos: json, db, validate…"],
pasos:[
 {t:"info", eti:"Modelar", h:"Definir y crear structs",
  c:`<div class="termbox">type Usuario struct {
    ID        int64
    Nombre    string
    Email     string    \`json:"email"\`
    CreadoEn  time.Time
    activo    bool      // minúscula: no se ve fuera del paquete (ni en JSON)
}

u1 := Usuario{ID: 1, Nombre: "Ana"}     // con nombres: los demás a valor cero
u2 := Usuario{}                         // todo a cero
p := &amp;Usuario{Nombre: "Luis"}           // puntero a un struct nuevo
p.Nombre = "Luis M."                    // Go desreferencia solo: no hace falta (*p).Nombre

func NuevoUsuario(nombre, email string) (*Usuario, error) {
    if !strings.Contains(email, "@") {
        return nil, fmt.Errorf("email no válido: %q", email)
    }
    return &amp;Usuario{Nombre: nombre, Email: email, CreadoEn: time.Now(), activo: true}, nil
}</div>
     <p>No hay constructores: por convención, una función <code>NewX</code> (o <code>NuevoX</code>) valida y devuelve el valor listo. Siempre usa literales <b>con nombres de campo</b>: si alguien añade un campo, el código sigue compilando y leyéndose bien.</p>`},
 {t:"info", eti:"Más usos", h:"Comparar, anónimos y etiquetas",
  c:`<div class="termbox">type Punto struct{ X, Y int }
Punto{1, 2} == Punto{1, 2}        // true: se comparan campo a campo
visitados := map[Punto]bool{}     // por eso sirve de clave de map

cfg := struct {                   // struct anónimo, para algo puntual
    Host string
    Port int
}{"localhost", 8080}

casos := []struct {               // el uso estrella: tablas de pruebas
    entrada string
    quiere  int
}{
    {"1", 1},
    {"42", 42},
}

var vacio struct{}                // ocupa 0 bytes
conjunto := map[string]struct{}{"a": {}}</div>
     <p>Las <b>etiquetas</b> (<code>\`json:"email,omitempty" db:"email"\`</code>) no cambian el comportamiento del struct: las leen librerías como encoding/json mediante reflexión.</p>`},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">type Punto struct{ X, Y int }
a := Punto{1, 2}
b := a
b.X = 9
fmt.Println(a.X, a == Punto{1, 2})</div>`,
  ops:["9 false","1 true","9 true","No compila"],
  ok:1, why:"Asignar un struct copia todos sus campos. a no cambia y sigue siendo igual a Punto{1, 2}."},
 {t:"vf", p:"Un struct con un campo de tipo <code>[]string</code> se puede comparar con <code>==</code>.",
  ok:false, why:"Si algún campo no es comparable (slice, map, función), el struct tampoco: no compila. Tampoco podría ser clave de un map."},
 {t:"hueco", p:"Completa el constructor idiomático",
  tpl:"func ___(nombre string) (*Tienda, error) {\n    if nombre == \"\" {\n        return ___, errors.New(\"nombre vacío\")\n    }\n    return ___Tienda{Nombre: nombre}, nil\n}",
  banco:["NuevaTienda","nil","&","*","Tienda{}","new"], sol:["NuevaTienda","nil","&"],
  why:"Si hay error, el resto de resultados son valores cero (nil para punteros)."},
 {t:"opcion", p:"¿Para qué sirve <code>map[string]struct{}</code>?",
  ops:["Para guardar structs vacíos por error","Como conjunto: solo importan las claves y el valor struct{} no ocupa memoria","No compila","Para JSON"],
  ok:1, why:"Muchos prefieren map[string]bool por legibilidad; struct{} ahorra un byte por entrada y deja claro que el valor no importa."},
 {t:"par", p:"Empareja cada forma de crear el struct con su resultado",
  pares:[["Usuario{}","Un Usuario con todos los campos a cero"],["&Usuario{Nombre: \"Ana\"}","Un *Usuario con Nombre relleno"],["new(Usuario)","Un *Usuario con todo a cero"],["var u Usuario","Una variable Usuario con valor cero"]],
  why:"&amp;T{} es la forma más habitual de obtener un puntero a un struct nuevo."},
 {t:"escribe", p:"¿Cómo se llaman los metadatos entre acentos graves que acompañan a un campo, como <code>json:\"email\"</code>? (en inglés o español)",
  sol:["tags","tag","etiquetas","etiqueta","struct tags"],
  pista:"Etiquetas de struct.",
  why:"Se leen con reflect.StructTag. encoding/json, database/sql con sqlx, validadores y ORMs las usan."}
]},

/* =============== U4 L2 =============== */
{
id:"go2l2",
titulo:"Métodos, receptores y composición",
claves:["Un método es una función con receptor; receptor puntero (*T) para modificar o evitar copias","El conjunto de métodos de T no incluye los de *T: afecta a qué interfaces cumple","Composición con campos embebidos en lugar de herencia: los campos y métodos se promueven"],
pasos:[
 {t:"info", eti:"Receptores", h:"Métodos en structs",
  c:`<div class="termbox">type Cuenta struct {
    Titular string
    saldo   int64            // en céntimos; minúscula: privado
}

func (c *Cuenta) Ingresar(importe int64) error {     // receptor puntero: modifica
    if importe &lt;= 0 {
        return fmt.Errorf("importe no válido: %d", importe)
    }
    c.saldo += importe
    return nil
}

func (c Cuenta) Saldo() int64 { return c.saldo }     // receptor valor: solo lee

c := Cuenta{Titular: "Ana"}
c.Ingresar(1000)           // Go toma &amp;c automáticamente porque c es direccionable

type Celsius float64       // también se añaden métodos a tipos no struct
func (t Celsius) Fahrenheit() float64 { return float64(t)*9/5 + 32 }</div>
     <p>Regla práctica: si <b>algún</b> método necesita puntero, usa puntero en <b>todos</b> los del tipo. Mezclar confunde y rompe el cumplimiento de interfaces.</p>`},
 {t:"info", eti:"Composición", h:"Embeber en vez de heredar",
  c:`<div class="termbox">type Animal struct{ Nombre string }
func (a Animal) Hablar() string { return a.Nombre + " hace ruido" }

type Perro struct {
    Animal                 // embebido: sin nombre de campo
    Raza string
}
func (p Perro) Hablar() string { return p.Nombre + " ladra" }   // tapa al de Animal

p := Perro{Animal: Animal{"Rex"}, Raza: "galgo"}
p.Nombre            // "Rex": campo promovido
p.Hablar()          // "Rex ladra"
p.Animal.Hablar()   // "Rex hace ruido": el de dentro sigue accesible</div>
     <div class="dg"><div class="dg-tit">qué ve Perro</div><div class="dg-lado"><div class="dg-pila"><div class="dg-caja acento">Perro<small>Raza, Hablar()</small></div><div class="dg-caja">Animal embebido<small>Nombre, Hablar() tapado</small></div></div><div class="dg-nota">no es herencia: un Perro no es un Animal, contiene uno</div></div></div>
     <p>Un <code>Perro</code> no se puede pasar donde se espera un <code>Animal</code>. El polimorfismo en Go lo dan las <b>interfaces</b>, no el embebido.</p>`},
 {t:"par", p:"Empareja cada elemento con su significado",
  pares:[["&x","Dirección de x (puntero)"],["func (c *Cuenta) M()","Método que puede modificar la cuenta"],["func (c Cuenta) M()","Método que recibe una copia"],["Campo embebido","Composición: los campos y métodos del tipo embebido se promueven"],["p.Animal.Hablar()","Llamar al método del tipo embebido aunque esté tapado"]],
  why:"Go no tiene clases ni herencia: structs, métodos, interfaces y composición."},
 {t:"opcion", p:"Un método con receptor por valor modifica un campo y el cambio no se ve fuera. ¿Por qué?",
  ops:["Un bug de Go","El receptor por valor es una copia: para modificar el original hace falta un receptor puntero","Faltan mayúsculas","Por el recolector de basura"],
  ok:1, why:"Regla habitual: si algún método necesita puntero, usa puntero en todos los del tipo."},
 {t:"opcion", p:"¿Por qué no compila esto?",
  c:`<div class="termbox">type Ingresador interface{ Ingresar(int) }
type Cuenta struct{ s int }
func (c *Cuenta) Ingresar(n int) { c.s += n }

var i Ingresador = Cuenta{}</div>`,
  ops:["Porque Cuenta no tiene campos exportados","Porque Ingresar tiene receptor puntero: solo *Cuenta cumple la interfaz; hace falta &amp;Cuenta{}","Porque falta implements","Porque int no es int64"],
  ok:1, why:"El mensaje es «Cuenta does not implement Ingresador (method Ingresar has pointer receiver)». El conjunto de métodos de T no incluye los de *T."},
 {t:"opcion", p:"¿Qué imprime <code>fmt.Println(p.Hablar(), p.Animal.Hablar())</code> con el Perro del ejemplo?",
  ops:["Rex hace ruido Rex hace ruido","Rex ladra Rex hace ruido","Rex ladra Rex ladra","No compila: Hablar está duplicado"],
  ok:1, why:"El método del tipo exterior tapa al embebido, pero este sigue disponible con la ruta completa."},
 {t:"hueco", p:"Añade a Temperatura un método que la modifique",
  tpl:"type Temperatura struct{ grados float64 }\n\nfunc (t ___Temperatura) Subir(d float64) {\n    ___.grados += d\n}",
  banco:["*","t","&","this","self"], sol:["*","t"],
  why:"En Go el receptor tiene un nombre corto elegido por ti (t, c, s…), nunca this ni self."},
 {t:"vf", p:"Se pueden definir métodos sobre tipos que no son structs, como <code>type Celsius float64</code>.",
  ok:true, why:"Cualquier tipo con nombre definido en tu paquete. Lo que no se puede es añadir métodos a tipos de otro paquete (ni a int directamente)."}
]},

/* =============== U4 L3 =============== */
{
id:"go3l1",
titulo:"Interfaces",
claves:["Un tipo implementa una interfaz de forma implícita: basta con tener sus métodos","Interfaces pequeñas: io.Reader, io.Writer, error, fmt.Stringer; se componen embebiendo","Acepta interfaces, devuelve structs; la interfaz la define quien la consume"],
pasos:[
 {t:"info", eti:"Contratos implícitos", h:"Interfaces en Go",
  c:`<div class="termbox">type Notificador interface {
    Enviar(destino, mensaje string) error
}

type Email struct{ servidor string }
func (e Email) Enviar(d, m string) error { … }     // Email ya es un Notificador

type Slack struct{ webhook string }
func (s Slack) Enviar(d, m string) error { … }

func Avisar(n Notificador, usuario string) error {   // acepta cualquier implementación
    return n.Enviar(usuario, "Tu pedido ha salido")
}

var _ Notificador = (*Slack)(nil)   // comprobación al compilar de que Slack cumple</div>
     <p>No existe <code>implements</code>: si el tipo tiene los métodos, cumple la interfaz. Esto facilita mucho las pruebas (un falso que implementa la interfaz) y permite que un tipo de una librería cumpla una interfaz que tú defines después.</p>`},
 {t:"info", eti:"Diseño", h:"Pequeñas y donde se usan",
  c:`<div class="termbox">type Reader interface { Read(p []byte) (n int, err error) }
type Writer interface { Write(p []byte) (n int, err error) }
type ReadWriter interface {       // composición de interfaces
    Reader
    Writer
}

// io.Copy funciona con ficheros, conexiones, buffers, gzip, hashes…
io.Copy(os.Stdout, resp.Body)
io.Copy(gzip.NewWriter(f), os.Stdin)</div>
     <ul><li><b>Cuanto más pequeña, más útil</b>: una interfaz de un método la cumplen muchísimos tipos.</li>
     <li><b>La define el consumidor</b>: el paquete que necesita «algo que guarde pedidos» declara <code>type AlmacenPedidos interface{ Guardar(…) error }</code> con solo lo que usa.</li>
     <li><b>Acepta interfaces, devuelve structs</b>: el constructor devuelve <code>*PostgresRepo</code>, no una interfaz; quien lo use decide qué interfaz necesita.</li>
     <li>No crees una interfaz «por si acaso» con una sola implementación.</li></ul>`},
 {t:"par", p:"Empareja cada interfaz estándar con su método",
  pares:[["error","Error() string"],["fmt.Stringer","String() string"],["io.Reader","Read(p []byte) (n int, err error)"],["io.Writer","Write(p []byte) (n int, err error)"],["io.Closer","Close() error"]],
  why:"io.Reader y io.Writer permiten encadenar ficheros, red, compresión y cifrado."},
 {t:"vf", p:"En Go hay que declarar explícitamente que un tipo implementa una interfaz.",
  ok:false, why:"Es implícito (tipado estructural). Si quieres asegurarlo al compilar: <code>var _ Interfaz = (*Tipo)(nil)</code>."},
 {t:"opcion", p:"Tu servicio de pedidos usa un repositorio Postgres. ¿Dónde declararías la interfaz <code>RepoPedidos</code>?",
  ops:["En el paquete postgres, junto a la implementación","En el paquete que la usa (el servicio de pedidos), con solo los métodos que necesita","En un paquete interfaces común","No hace falta interfaz nunca"],
  ok:1, why:"En Go la interfaz pertenece al consumidor. Así el servicio no depende de postgres y en las pruebas se pasa un falso."},
 {t:"hueco", p:"Declara una interfaz que combine lectura y cierre",
  tpl:"type LectorCerrable ___ {\n    io.___\n    io.Closer\n}",
  banco:["interface","Reader","struct","Writer","type"], sol:["interface","Reader"],
  why:"Existe ya como io.ReadCloser: es lo que devuelve resp.Body."},
 {t:"escribe", p:"Completa el refrán de Go: «Acepta interfaces, devuelve …»",
  sol:["structs","struct","tipos concretos","tipos concretos (structs)"],
  pista:"Lo contrario de una interfaz.",
  why:"Devolver el tipo concreto no limita a quien llama; aceptar interfaces hace tu función más reutilizable."},
 {t:"opcion", p:"¿Qué ventaja concreta da en las pruebas que <code>Avisar</code> reciba un <code>Notificador</code>?",
  ops:["Ninguna","Se le puede pasar un falso que guarde los mensajes en un slice, sin enviar emails reales","Que las pruebas van más rápido por el compilador","Que no hace falta go test"],
  ok:1, why:"Un struct con un método Enviar que hace append en un slice basta; no se necesitan librerías de mocks."}
]},

/* =============== U4 L4 =============== */
{
id:"go4n2",
titulo:"any, aserciones y type switch",
claves:["any (interface{}) admite cualquier valor; para usarlo hay que recuperar el tipo concreto","v, ok := x.(T) comprueba sin pánico; un type switch decide según el tipo","Una interfaz guarda tipo y valor: con un puntero nil dentro, la interfaz NO es nil"],
pasos:[
 {t:"info", eti:"Por dentro", h:"Una interfaz es (tipo, valor)",
  c:`<div class="dg"><div class="dg-tit">qué guarda una variable de interfaz</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">var err error</div><div class="dg-fila"><div class="dg-caja base">tipo: nil</div><div class="dg-caja base">valor: nil</div></div><div class="dg-caja ok" style="margin-top:8px">err == nil → true</div></div>
<div class="dg-col"><div class="dg-col-tit">err = (*MiErr)(nil)</div><div class="dg-fila"><div class="dg-caja acento">tipo: *MiErr</div><div class="dg-caja base">valor: nil</div></div><div class="dg-caja aviso" style="margin-top:8px">err == nil → false</div></div>
</div></div>
<div class="termbox">func validar() error {
    var e *ErrValidacion          // nil
    if algoFalla { e = &amp;ErrValidacion{…} }
    return e                      // ¡MAL! devuelve una interfaz no nil
}
if err := validar(); err != nil { … }   // siempre entra

// bien: devuelve nil explícitamente
if !algoFalla { return nil }</div>
     <p>Es la trampa más famosa de Go. Una interfaz solo es <code>nil</code> si <b>tipo y valor</b> son nil.</p>`},
 {t:"info", eti:"Recuperar el tipo", h:"Aserciones y type switch",
  c:`<div class="termbox">var x any = "hola"            // any es un alias de interface{}

s := x.(string)                // "hola"
n := x.(int)                   // panic: interface conversion: interface {} is string, not int
n, ok := x.(int)               // 0 false: sin pánico

switch v := x.(type) {
case int:
    fmt.Println("entero", v*2)         // v es int aquí
case string:
    fmt.Println("texto", strings.ToUpper(v))
case fmt.Stringer:
    fmt.Println("tiene String()", v.String())
case nil:
    fmt.Println("nada")
default:
    fmt.Printf("otro: %T\\n", v)
}

if s, ok := w.(io.StringWriter); ok {   // ¿implementa además otra interfaz?
    s.WriteString("rápido")
}</div>
     <p>Usa <code>any</code> lo mínimo: pierdes la comprobación de tipos del compilador. Hoy, con genéricos, casi siempre hay una alternativa mejor.</p>`},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">type MiErr struct{}
func (*MiErr) Error() string { return "mi error" }

func f() error {
    var p *MiErr
    return p
}

func main() {
    fmt.Println(f() == nil)
}</div>`,
  ops:["true","false","panic","No compila"],
  ok:1, why:"f devuelve una interfaz error con tipo *MiErr y valor nil: no es igual a nil. Devuelve literalmente nil cuando no hay error."},
 {t:"opcion", p:"<code>var x any = \"hola\"</code>. ¿Qué pasa con <code>n := x.(int)</code>?",
  ops:["n vale 0","panic: interface conversion: interface {} is string, not int","Error de compilación","n vale 4"],
  ok:1, why:"La aserción de un solo resultado entra en pánico si el tipo no coincide. Con dos resultados (n, ok) no."},
 {t:"hueco", p:"Completa el type switch",
  tpl:"switch v := valor.___ {\ncase int:\n    total += v\ncase ___:\n    total += len(v)\n}",
  banco:["(type)","string","(any)","type","int64"], sol:["(type)","string"],
  why:"<code>.(type)</code> solo es válido dentro de un switch. En cada case, v ya tiene el tipo de ese case."},
 {t:"vf", p:"<code>any</code> y <code>interface{}</code> son exactamente el mismo tipo.",
  ok:true, why:"any es un alias introducido en Go 1.18. Se prefiere any por legibilidad."},
 {t:"escribe", p:"Escribe la aserción que comprueba, sin pánico, si <code>x</code> contiene un <code>string</code> (dos variables: s y ok)",
  sol:["s, ok := x.(string)","s,ok:=x.(string)","s, ok = x.(string)"],
  pista:"La forma «coma ok».",
  why:"Es la forma segura. La de un solo resultado solo cuando es imposible que falle."},
 {t:"opcion", p:"Un handler recibe un <code>error</code> y quiere saber si es un <code>*ErrValidacion</code> que puede venir envuelto. ¿Qué usa?",
  ops:["err.(*ErrValidacion)","errors.As(err, &amp;ve)","err == ErrValidacion","reflect.TypeOf"],
  ok:1, why:"La aserción solo mira el error de fuera; errors.As recorre la cadena de errores envueltos. Lo verás en la unidad de errores."}
]}

]});
