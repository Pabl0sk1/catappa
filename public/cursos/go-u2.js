window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Control de flujo y funciones",
resumen: "if con inicialización, el único bucle for, switch, funciones con varios resultados, variádicas, closures, defer y punteros",
nivel: "Fundamentos",
color: "#4fc3dc",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"go2n1",
titulo:"if, for y switch",
claves:["if y switch admiten una sentencia de inicialización antes de la condición","for es el único bucle: clásico, tipo while, infinito o con range (también sobre un entero desde Go 1.22)","switch no cae al siguiente caso salvo con fallthrough; break y continue aceptan etiquetas"],
pasos:[
 {t:"info", eti:"Condiciones", h:"if con inicialización",
  c:`<div class="termbox">if n, err := strconv.Atoi(s); err != nil {
    return fmt.Errorf("número no válido %q: %w", s, err)
} else if n &lt; 0 {
    return errors.New("negativo")
}
// n y err ya no existen aquí: su ámbito es el if</div>
     <p>Sin paréntesis alrededor de la condición y con llaves obligatorias. La condición debe ser un <code>bool</code>: <code>if n {}</code> con un entero no compila.</p>
     <p>Estilo Go: <b>sal pronto</b>. Trata el error y haz <code>return</code>; el camino feliz queda a la izquierda, sin <code>else</code> anidados.</p>`},
 {t:"info", eti:"Un solo bucle", h:"Las formas de for",
  c:`<div class="termbox">for i := 0; i &lt; 10; i++ { … }      // clásico
for intentos &lt; 3 { … }             // como un while
for { … }                          // infinito (sal con break o return)
for i, v := range lista { … }      // índice y valor
for clave, valor := range mapa { … }
for i := range 3 { … }             // 0, 1, 2 (Go 1.22+)

switch {                           // switch sin expresión = cadena de if
case temp &lt; 0:
    fmt.Println("hiela")
case temp &lt; 25:
    fmt.Println("bien")
default:
    fmt.Println("calor")
}

switch dia {
case "sábado", "domingo":          // varios valores en un caso
    finde = true
}

fuera:
for _, fila := range matriz {
    for _, v := range fila {
        if v == objetivo { break fuera }   // sale de los dos bucles
    }
}</div>
     <p>Desde Go 1.22 cada iteración de <code>for</code> tiene su <b>propia copia</b> de la variable del bucle: se acabó el clásico error de las closures que capturaban todas el último valor.</p>`},
 {t:"opcion", p:"¿Qué imprime este switch?",
  c:`<div class="termbox">x := 5
switch {
case x &gt; 3:
    fmt.Println("mayor")
    fallthrough
case x &gt; 10:
    fmt.Println("cae")
default:
    fmt.Println("otro")
}</div>`,
  ops:["mayor","mayor y cae","mayor, cae y otro","cae"],
  ok:1, why:"fallthrough salta al cuerpo del caso siguiente <b>sin evaluar su condición</b>, y ahí se para. Sin fallthrough solo imprimiría «mayor»."},
 {t:"vf", p:"En Go, cada <code>case</code> de un switch necesita un <code>break</code> para no ejecutar el siguiente.",
  ok:false, why:"Al revés que en C o Java: el break es implícito. Para caer al siguiente se escribe fallthrough, y se usa muy poco."},
 {t:"hueco", p:"Recorre el slice mostrando posición y valor, y salta los vacíos",
  tpl:"for ___, nombre := ___ nombres {\n    if nombre == \"\" {\n        ___\n    }\n    fmt.Println(i, nombre)\n}",
  banco:["i","range","continue","break","in","of"], sol:["i","range","continue"],
  why:"range devuelve índice y valor. continue pasa a la siguiente iteración; break saldría del bucle."},
 {t:"orden", p:"Ordena este bucle que lee líneas hasta el final (estilo «sal pronto»)",
  items:["for {","    linea, err := r.ReadString('\\n')","    if err == io.EOF {","        break","    }","    procesar(linea)","}"],
  why:"El bucle infinito con salida explícita es idiomático cuando la condición se conoce dentro."},
 {t:"opcion", p:"¿Qué imprime <code>for i := range 3 { fmt.Print(i) }</code>?",
  ops:["123","012","0123","No compila"],
  ok:1, why:"Desde Go 1.22 range acepta un entero n y recorre de 0 a n-1."},
 {t:"escribe", p:"¿Qué palabra se pone delante de un bucle para poder hacer <code>break</code> desde uno interior hacia él? (el concepto)",
  sol:["etiqueta","una etiqueta","label"],
  pista:"Un nombre seguido de dos puntos.",
  why:"<code>fuera:</code> antes del for, y <code>break fuera</code> o <code>continue fuera</code> dentro."}
]},

/* =============== U2 L2 =============== */
{
id:"go1l3",
titulo:"Funciones",
claves:["Las funciones pueden devolver varios valores, típicamente (resultado, error)","Los nombres en mayúscula se exportan del paquete; en minúscula son privados","Parámetros variádicos con ...T; las funciones son valores que se pasan y se devuelven"],
pasos:[
 {t:"info", eti:"Varios resultados", h:"(valor, error)",
  c:`<div class="termbox">func dividir(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("división entre cero")
    }
    return a / b, nil
}

r, err := dividir(10, 2)
if err != nil {
    log.Fatal(err)
}
_, err = dividir(1, 0)       // _ descarta un resultado

func Publica() {}            // exportada: se usa desde otros paquetes (mayúscula)
func privada() {}            // solo dentro de su paquete</div>
     <p>El error va <b>siempre el último</b>. Si hay error, el resto de resultados no debe usarse (suelen ser valores cero).</p>`},
 {t:"info", eti:"Más formas", h:"Variádicas, resultados con nombre y funciones como valor",
  c:`<div class="termbox">func suma(nums ...int) int {         // nums es un []int
    t := 0
    for _, n := range nums { t += n }
    return t
}
suma()                  // 0
suma(1, 2, 3)           // 6
s := []int{4, 5}
suma(s...)              // 9: expandir un slice

func minmax(xs []int) (min, max int) {   // resultados con nombre
    min, max = xs[0], xs[0]
    for _, x := range xs { … }
    return                               // «return desnudo»: devuelve min y max
}

type Operacion func(a, b int) int        // un tipo función
func aplicar(op Operacion, a, b int) int { return op(a, b) }
aplicar(func(a, b int) int { return a * b }, 3, 4)   // 12</div>
     <p>Los resultados con nombre documentan qué devuelve la función, pero el <code>return</code> desnudo en funciones largas se lee mal: úsalo solo en funciones cortas. Go <b>no tiene</b> sobrecarga de funciones ni parámetros por defecto: se usan nombres distintos, un struct de opciones o «opciones funcionales».</p>`},
 {t:"par", p:"Empareja cada elemento con su significado en Go",
  pares:[["func f() (int, error)","Devuelve un valor y un posible error"],["nil","Ausencia de valor (sin error, puntero vacío)"],["Nombre en mayúscula","Exportado fuera del paquete"],["_","Ignorar un valor devuelto"],["nums ...int","Parámetro variádico: llega como []int"]],
  why:"Go no tiene excepciones para errores normales: se devuelven y se comprueban."},
 {t:"vf", p:"En Go, una función con nombre en minúscula puede usarse desde otro paquete.",
  ok:false, why:"La visibilidad la da la mayúscula inicial, y vale igual para funciones, tipos, campos, métodos, variables y constantes."},
 {t:"hueco", p:"Completa la firma y la llamada con un slice",
  tpl:"func Media(valores ___float64) float64 { … }\n\nnotas := []float64{7, 8.5, 9}\nm := Media(notas___)",
  banco:["...","...","[]","*","&"], sol:["...","..."],
  why:"En la firma, <code>...float64</code> declara el variádico; en la llamada, <code>notas...</code> expande el slice."},
 {t:"opcion", p:"Necesitas una función que devuelva el usuario y si existía. ¿Qué firma es idiomática?",
  ops:["func Buscar(id int) Usuario  // devuelve Usuario{} si no existe","func Buscar(id int) (Usuario, bool)","func Buscar(id int) (bool, Usuario)","func Buscar(id int, u *Usuario)"],
  ok:1, why:"El patrón «coma ok»: el valor primero y el booleano (o el error) al final, igual que <code>v, ok := m[k]</code>."},
 {t:"escribe", p:"¿Cómo se llama en Go la forma de decir que una función se usa desde otros paquetes? Una palabra (participio).",
  sol:["exportada","exportado","exported"],
  pista:"Se consigue con la mayúscula inicial.",
  why:"Identificador exportado = empieza por mayúscula. No hay public ni private."},
 {t:"opcion", p:"¿Cómo se consiguen «parámetros opcionales» en Go?",
  ops:["Con valores por defecto en la firma","Con sobrecarga de funciones","Con un struct de opciones o con opciones funcionales (func(*Config))","No hay manera"],
  ok:2, why:"<code>NewServidor(addr, WithTimeout(5*time.Second), WithLogger(l))</code> es el patrón de opciones funcionales, muy usado en librerías."}
]},

/* =============== U2 L3 =============== */
{
id:"go2n2",
titulo:"Closures y defer",
claves:["Una closure captura variables de su entorno por referencia y las mantiene vivas","defer aplaza una llamada hasta que la función retorna; varias se ejecutan en orden inverso","Los argumentos de defer se evalúan al escribir el defer, no al ejecutarlo"],
pasos:[
 {t:"info", eti:"Closures", h:"Funciones que recuerdan",
  c:`<div class="termbox">func contador() func() int {
    n := 0
    return func() int {
        n++                 // n sigue viva aunque contador() ya terminó
        return n
    }
}

c := contador()
c(); c()
fmt.Println(c())            // 3
otro := contador()
fmt.Println(otro())         // 1: cada closure tiene su propia n</div>
     <p>La closure captura la <b>variable</b>, no una copia de su valor: si la variable cambia después, la closure ve el cambio. Se usa en middlewares HTTP, en <code>sort.Slice</code>, en goroutines y para encapsular estado sin structs.</p>`},
 {t:"info", eti:"defer", h:"Limpieza garantizada",
  c:`<div class="termbox">func copiar(origen, destino string) error {
    in, err := os.Open(origen)
    if err != nil { return err }
    defer in.Close()                 // se ejecuta al salir, pase lo que pase

    out, err := os.Create(destino)
    if err != nil { return err }     // in se cierra igualmente
    defer out.Close()

    _, err = io.Copy(out, in)
    return err
}

mu.Lock()
defer mu.Unlock()</div>
     <ul><li>Varios defer se ejecutan en orden <b>LIFO</b> (el último primero).</li>
     <li>Los argumentos se evalúan <b>en el momento del defer</b>.</li>
     <li>Se ejecutan también si hay un panic: por eso <code>recover</code> vive dentro de un defer.</li>
     <li>Un defer puede modificar los <b>resultados con nombre</b> de la función.</li></ul>
     <div class="nota ojo"><b class="tit">defer en un bucle</b>Un <code>defer f.Close()</code> dentro de un bucle que abre mil ficheros no cierra ninguno hasta que acaba la función. Saca el cuerpo a una función aparte.</div>`},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">func main() {
    for i := range 3 {
        defer fmt.Print(i, " ")
    }
    fmt.Print("fin ")
}</div>`,
  ops:["0 1 2 fin","fin 0 1 2","fin 2 1 0","2 1 0 fin"],
  ok:2, why:"Los defer se apilan y se ejecutan al salir de main, del último al primero."},
 {t:"opcion", p:"¿Qué imprime esta función?",
  c:`<div class="termbox">func g() {
    x := 1
    defer fmt.Println("defer:", x)
    x = 2
    fmt.Println("x:", x)
}</div>`,
  ops:["x: 2 y luego defer: 2","x: 2 y luego defer: 1","defer: 1 y luego x: 2","defer: 2 y luego x: 2"],
  ok:1, why:"Los argumentos de un defer se evalúan cuando se escribe el defer. Para ver el valor final, difiere una closure: <code>defer func() { fmt.Println(x) }()</code>."},
 {t:"opcion", p:"¿Qué devuelve <code>f()</code>?",
  c:`<div class="termbox">func f() (r int) {
    defer func() { r *= 2 }()
    return 5
}</div>`,
  ops:["5","10","0","No compila"],
  ok:1, why:"return 5 asigna r = 5, luego corren los defer (r = 10) y después la función sale. Es la técnica para añadir contexto a un error devuelto en un único sitio."},
 {t:"hueco", p:"Garantiza que el mutex se libera aunque haya un return temprano",
  tpl:"func (c *Cache) Get(k string) (string, bool) {\n    c.mu.___()\n    ___ c.mu.Unlock()\n    v, ok := c.datos[k]\n    return v, ok\n}",
  banco:["Lock","defer","go","Unlock","return"], sol:["Lock","defer"],
  why:"Lock + defer Unlock en líneas seguidas: imposible olvidarse de liberar el candado."},
 {t:"vf", p:"Desde Go 1.22, si lanzas closures dentro de un <code>for i := 0; i &lt; 3; i++</code>, cada una ve su propio valor de i.",
  ok:true, why:"Cada iteración declara una variable nueva. Antes todas compartían la misma i y veían el último valor (el truco <code>i := i</code> ya no hace falta)."},
 {t:"escribe", p:"¿En qué orden se ejecutan varios defer de la misma función? (siglas)",
  sol:["LIFO","lifo","inverso","orden inverso","último primero"],
  pista:"Como una pila.",
  why:"Last In, First Out: lo último que abriste es lo primero que se cierra, que es justo lo que necesitas."}
]},

/* =============== U2 L4 =============== */
{
id:"go2n3",
titulo:"Punteros",
claves:["&x da la dirección de x y *p el valor apuntado; no hay aritmética de punteros","Go pasa todo por valor: un puntero permite modificar el original o evitar copiar algo grande","Devolver un puntero a una variable local es seguro: el análisis de escape la lleva al heap"],
pasos:[
 {t:"info", eti:"Direcciones", h:"& y *",
  c:`<div class="termbox">x := 10
p := &amp;x           // p es *int: apunta a x
*p = 20           // modifica x a través del puntero
fmt.Println(x)    // 20

func duplicar(n *int) { *n *= 2 }
duplicar(&amp;x)      // x = 40

var q *int        // nil
fmt.Println(*q)   // panic: runtime error: invalid memory address or nil pointer dereference

a := new(int)     // puntero a un int con valor 0
b := new(42)      // Go 1.26+: puntero a un int con valor 42</div>
     <p>En Go <b>todo se pasa por valor</b>: la función recibe una copia. Con un puntero, la copia es de la dirección, así que la función puede cambiar el original. Slices, maps y canales ya contienen punteros internos, por eso rara vez se pasan con <code>*</code>.</p>`},
 {t:"info", eti:"Por dentro", h:"Pila, heap y análisis de escape",
  c:`<div class="termbox">func NuevoUsuario(nombre string) *Usuario {
    u := Usuario{Nombre: nombre}
    return &amp;u          // seguro: el compilador mueve u al heap
}

go build -gcflags=-m ./...
# ./usuario.go:5:2: moved to heap: u</div>
     <p>El compilador decide si una variable vive en la pila (barata, se libera sola) o en el heap (la gestiona el recolector de basura). A eso se le llama <b>análisis de escape</b>. No hay que liberar memoria a mano y no existen punteros colgantes.</p>
     <p><b>¿Puntero o valor?</b> Puntero si hay que modificar, si el struct es grande o si contiene un <code>sync.Mutex</code>. Valor para tipos pequeños e inmutables (un <code>time.Time</code>, un punto 2D): menos presión sobre el recolector.</p>`},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">func cambiar(n int) { n = 99 }
func cambiarP(n *int) { *n = 99 }

a, b := 1, 1
cambiar(a)
cambiarP(&amp;b)
fmt.Println(a, b)</div>`,
  ops:["99 99","1 99","1 1","99 1"],
  ok:1, why:"cambiar recibe una copia de a; cambiarP recibe la dirección de b y escribe en ella."},
 {t:"par", p:"Empareja cada expresión con su significado",
  pares:[["&x","Dirección de x"],["*p (en una expresión)","Valor al que apunta p"],["*int (en un tipo)","Tipo «puntero a int»"],["new(T)","Reserva un T con valor cero y devuelve su puntero"],["p == nil","El puntero no apunta a nada"]],
  why:"El asterisco significa cosas distintas en un tipo (<code>*int</code>) y en una expresión (<code>*p</code>)."},
 {t:"vf", p:"Devolver <code>&amp;u</code> de una variable local <code>u</code> es un error, porque la variable desaparece al salir de la función.",
  ok:false, why:"En C sería un puntero colgante; en Go el análisis de escape detecta que u sobrevive y la coloca en el heap."},
 {t:"vf", p:"En Go se puede hacer <code>p++</code> sobre un puntero para avanzar al siguiente elemento, como en C.",
  ok:false, why:"No hay aritmética de punteros (salvo con el paquete unsafe, que casi nunca se usa). Por eso Go es seguro en memoria."},
 {t:"term", p:"Compila mostrando qué variables escapan al heap",
  prompt:"pablo@portatil:~/api$", sol:["go build -gcflags=-m ./...","go build -gcflags=-m .","go build -gcflags='-m' ./...","go build -gcflags=\"-m\" ./..."],
  salida:"./usuario.go:5:2: moved to heap: u\n./usuario.go:9:13: inlining call to fmt.Println",
  pista:"El flag -m del compilador se pasa con -gcflags.",
  why:"Útil al optimizar: cada «moved to heap» es una asignación que el recolector tendrá que limpiar."},
 {t:"opcion", p:"Un programa cae con <code>invalid memory address or nil pointer dereference</code>. ¿Qué ha pasado?",
  ops:["Falta memoria","Se ha usado *p (o p.Campo) con p == nil","Se ha desbordado un entero","Un map no inicializado"],
  ok:1, why:"La traza del panic señala la línea exacta. Suele ser un puntero que una función devolvió como nil junto a un error que no se comprobó."}
]}

]});
