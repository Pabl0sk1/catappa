window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Genéricos, paquetes y módulos",
resumen: "Funciones y tipos genéricos con restricciones, iteradores con range sobre funciones, paquetes, visibilidad e internal, y módulos con go.mod, versiones y seguridad de dependencias",
nivel: "Intermedio",
color: "#42b1ca",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"go6n1",
titulo:"Genéricos: funciones y restricciones",
claves:["Los parámetros de tipo van entre corchetes: func Max[T cmp.Ordered](a, b T) T","Una restricción es una interfaz que limita los tipos: any, comparable, cmp.Ordered o una unión propia","~int incluye también los tipos definidos sobre int; el compilador suele inferir T"],
pasos:[
 {t:"info", eti:"Desde Go 1.18", h:"Funciones genéricas",
  c:`<div class="termbox">func Map[T, U any](xs []T, f func(T) U) []U {
    r := make([]U, 0, len(xs))
    for _, x := range xs {
        r = append(r, f(x))
    }
    return r
}

func Max[T cmp.Ordered](a, b T) T {
    if a &gt; b { return a }
    return b
}

Map([]int{1, 2, 3}, func(i int) string { return fmt.Sprint(i * 10) })  // [10 20 30]
Max("pera", "kiwi")          // "pera": T se infiere como string
Max[float64](2, 3.5)         // 3.5: T explícito cuando no se puede inferir</div>
     <p>Antes de los genéricos había que elegir entre duplicar código por tipo o usar <code>interface{}</code> y perder la comprobación de tipos. Ahora el compilador comprueba y genera código eficiente.</p>`},
 {t:"info", eti:"Restricciones", h:"Qué tipos se admiten",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">restricciones habituales</div><table class="dg-tabla"><thead><tr><th>restricción</th><th>permite</th></tr></thead><tbody>
<tr><td><code>any</code></td><td>cualquier tipo; solo operaciones válidas para todos (asignar, pasar)</td></tr>
<tr><td><code>comparable</code></td><td><code>==</code> y <code>!=</code>; necesaria para claves de map</td></tr>
<tr><td><code>cmp.Ordered</code></td><td><code>&lt; &gt; &lt;= &gt;=</code>: enteros, flotantes y strings</td></tr>
<tr><td>unión propia</td><td>las operaciones comunes a todos los tipos listados</td></tr>
</tbody></table></div>
<div class="termbox">type Numero interface {
    ~int | ~int64 | ~float64      // ~: también tipos definidos sobre ellos
}

func Suma[T Numero](xs []T) T {
    var total T                   // valor cero de T
    for _, x := range xs { total += x }
    return total
}

type Centimos int64
Suma([]Centimos{100, 250})        // 350: vale gracias a ~int64</div>
     <p>Sin la tilde, <code>Centimos</code> no cumpliría <code>int64</code>, porque es un tipo distinto. Una interfaz con uniones solo puede usarse como restricción, no como tipo de variable.</p>`},
 {t:"opcion", p:"¿Qué restricción necesitas para una función genérica que use <code>T</code> como clave de un map?",
  ops:["any","comparable","cmp.Ordered","~string"],
  ok:1, why:"Las claves de un map deben poder compararse con ==. cmp.Ordered también lo permitiría, pero excluye structs y punteros sin necesidad."},
 {t:"hueco", p:"Completa una función genérica que filtre un slice",
  tpl:"func Filtrar___T any___(xs []T, ok func(T) bool) []T {\n    var r []___\n    for _, x := range xs {\n        if ok(x) {\n            r = append(r, x)\n        }\n    }\n    return r\n}",
  banco:["[","]","T","(",")","any"], sol:["[","]","T"],
  why:"Los parámetros de tipo van entre corchetes tras el nombre. En Go 1.21+ ya tienes slices.DeleteFunc y compañía."},
 {t:"opcion", p:"<code>type ID string</code>. ¿Compila <code>Buscar[ID](ids, \"x\")</code> con <code>func Buscar[T string](…)</code>?",
  ops:["Sí, ID es un string","No: la restricción string solo admite string exactamente; hace falta ~string","Sí, pero con aviso","Solo con any"],
  ok:1, why:"La tilde significa «cualquier tipo cuyo tipo subyacente sea…». Es lo que permite usar tus tipos de dominio."},
 {t:"vf", p:"Los métodos de un tipo pueden declarar sus propios parámetros de tipo, como <code>func (p *Pila[T]) Map[U any]() …</code>.",
  ok:false, why:"Los métodos solo usan los parámetros de su tipo. Si necesitas otro, escribe una función: <code>func MapPila[T, U any](p *Pila[T], …)</code>."},
 {t:"opcion", p:"¿Cuándo NO conviene usar genéricos?",
  ops:["Para contenedores de datos","Cuando una interfaz con métodos ya expresa lo que necesitas (por ejemplo, io.Reader), o cuando solo hay un tipo","Para funciones sobre slices","Para algoritmos de ordenación"],
  ok:1, why:"Regla de la comunidad: si escribes el mismo código tres veces cambiando solo el tipo, genéricos; si lo que varía es el comportamiento, interfaces."},
 {t:"escribe", p:"¿Qué restricción del paquete <code>cmp</code> admite todos los tipos que se pueden comparar con <code>&lt;</code>?",
  sol:["cmp.Ordered","Ordered"],
  pista:"Ordenado, en inglés.",
  why:"También está cmp.Compare(a, b), que devuelve -1, 0 o 1 y es lo que espera slices.SortFunc."}
]},

/* =============== U6 L2 =============== */
{
id:"go6n2",
titulo:"Tipos genéricos e iteradores",
claves:["Un tipo genérico se declara type Pila[T any] struct{…} y se instancia como Pila[string]","Desde Go 1.23, range recorre funciones iteradoras: iter.Seq[V] e iter.Seq2[K, V]","slices y maps devuelven y consumen iteradores: slices.Collect, slices.Sorted(maps.Keys(m))"],
pasos:[
 {t:"info", eti:"Contenedores", h:"Tipos con parámetros",
  c:`<div class="termbox">type Pila[T any] struct {
    items []T
}

func (p *Pila[T]) Push(v T) { p.items = append(p.items, v) }

func (p *Pila[T]) Pop() (T, bool) {
    var cero T
    if len(p.items) == 0 {
        return cero, false
    }
    v := p.items[len(p.items)-1]
    p.items = p.items[:len(p.items)-1]
    return v, true
}

var tareas Pila[string]
tareas.Push("compilar")

type Par[K comparable, V any] struct { Clave K; Valor V }</div>
     <p>Usos típicos: pilas, colas, cachés LRU, conjuntos, resultados paginados <code>Pagina[T]</code>, clientes de API que devuelven <code>Respuesta[T]</code>.</p>`},
 {t:"info", eti:"Go 1.23", h:"Iteradores: range sobre funciones",
  c:`<div class="termbox">// iter.Seq[V] es func(yield func(V) bool)
func (p *Pila[T]) Todos() iter.Seq[T] {
    return func(yield func(T) bool) {
        for i := len(p.items) - 1; i &gt;= 0; i-- {
            if !yield(p.items[i]) {   // false = quien recorre hizo break
                return
            }
        }
    }
}

for v := range tareas.Todos() { … }

claves := slices.Sorted(maps.Keys(m))       // maps.Keys devuelve un iter.Seq
pares := slices.Collect(Pares(7))           // [0 2 4 6]
for i, v := range slices.All(xs) { … }       // iter.Seq2[int, T]
for linea := range strings.Lines(texto) { … }   // Go 1.24</div>
     <p>El iterador «empuja» cada valor llamando a <code>yield</code>. Si el bucle hace <code>break</code>, <code>yield</code> devuelve false y el iterador <b>debe parar</b>: si sigue llamando a yield, el programa entra en pánico.</p>`},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">func Pares(n int) iter.Seq[int] {
    return func(yield func(int) bool) {
        for i := 0; i &lt; n; i += 2 {
            if !yield(i) { return }
        }
    }
}

for v := range Pares(10) {
    if v &gt; 5 { break }
    fmt.Print(v, " ")
}</div>`,
  ops:["0 2 4 6 8","0 2 4","0 2 4 6","2 4"],
  ok:1, why:"Imprime 0, 2 y 4; con 6 el cuerpo hace break, yield devuelve false y el iterador retorna."},
 {t:"hueco", p:"Obtén las claves de un map en orden alfabético",
  tpl:"nombres := slices.___(maps.___(edades))",
  banco:["Sorted","Keys","Sort","Values","Collect"], sol:["Sorted","Keys"],
  why:"maps.Keys devuelve un iterador; slices.Sorted lo recoge en un slice y lo ordena."},
 {t:"par", p:"Empareja cada función con lo que devuelve o hace",
  pares:[["maps.Keys(m)","Un iter.Seq con las claves"],["slices.Collect(seq)","Un slice con todos los valores del iterador"],["slices.All(xs)","Un iter.Seq2 con índice y valor"],["iter.Seq[V]","El tipo func(yield func(V) bool)"],["slices.Values(xs)","Un iter.Seq solo con los valores"]],
  why:"Con iteradores se encadenan transformaciones sin crear slices intermedios."},
 {t:"vf", p:"Un iterador puede seguir llamando a <code>yield</code> después de que este haya devuelto false.",
  ok:false, why:"Provoca un pánico en tiempo de ejecución. Comprueba siempre el resultado de yield y retorna."},
 {t:"escribe", p:"Escribe el tipo de una variable <code>p</code> que es una Pila de enteros",
  sol:["Pila[int]","var p Pila[int]","*Pila[int]"],
  pista:"El tipo con su argumento entre corchetes.",
  why:"Un tipo genérico siempre se usa instanciado: Pila a secas no es un tipo."}
]},

/* =============== U6 L3 =============== */
{
id:"go6n3",
titulo:"Paquetes y visibilidad",
claves:["Un paquete es una carpeta: todos sus ficheros comparten el mismo package","Mayúscula = exportado; la carpeta internal/ solo la pueden importar paquetes de su mismo árbol","No se permiten ciclos de importación; init() corre antes que main y conviene evitarlo"],
pasos:[
 {t:"info", eti:"Organización", h:"Carpetas, paquetes e imports",
  c:`<div class="dg dg-arbol"><div class="dg-tit">un módulo con varios paquetes</div>
<div class="rama" style="--n:0"><span class="nom carpeta">tareas/</span><span class="coment">módulo github.com/pablo/tareas</span></div>
<div class="rama" style="--n:1"><span class="nom">go.mod</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">cmd/tareas/</span><span class="coment">package main</span></div>
<div class="rama" style="--n:2"><span class="nom">main.go</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">internal/</span><span class="coment">solo para este módulo</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">almacen/</span><span class="coment">package almacen</span></div>
<div class="rama" style="--n:3"><span class="nom">almacen.go</span></div>
<div class="rama" style="--n:3"><span class="nom">almacen_test.go</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">tarea/</span><span class="coment">package tarea: importable desde fuera</span></div>
</div>
<div class="termbox">import (
    "fmt"                                        // estándar primero
    "github.com/google/uuid"                     // externos
    "github.com/pablo/tareas/internal/almacen"   // propios
    pg "github.com/jackc/pgx/v5"                 // alias
    _ "github.com/lib/pq"                        // solo por sus efectos (init)
)</div>
     <p>El nombre del paquete es la última parte de la ruta y se usa al llamar: <code>almacen.Nuevo()</code>. Por eso los nombres son <b>cortos, en minúscula, sin guiones bajos</b> y sin repetir: <code>almacen.Nuevo</code>, no <code>almacen.NuevoAlmacen</code>. Evita cajones como <code>util</code>, <code>common</code> o <code>helpers</code>.</p>`},
 {t:"info", eti:"Reglas", h:"internal, ciclos e init",
  c:`<ul><li><b>internal/</b>: un paquete bajo <code>a/b/internal/x</code> solo lo pueden importar paquetes bajo <code>a/b/</code>. Es la forma de tener código compartido entre tus paquetes sin comprometerte a mantenerlo como API pública.</li>
     <li><b>Sin ciclos</b>: si <code>pedidos</code> importa <code>clientes</code>, <code>clientes</code> no puede importar <code>pedidos</code>. Se resuelve moviendo lo común a un tercer paquete o con una interfaz en el consumidor.</li>
     <li><b>init()</b>: cada fichero puede tener funciones <code>init</code> que se ejecutan al cargar el paquete, tras inicializar sus variables. Son implícitas y difíciles de probar: úsalas lo menos posible.</li>
     <li><b>Documentación</b>: un comentario justo encima de cada identificador exportado, empezando por su nombre: <code>// Nuevo crea un almacén vacío.</code> Es lo que muestran go doc y pkg.go.dev.</li></ul>`},
 {t:"opcion", p:"Tienes <code>github.com/pablo/tareas/internal/almacen</code>. ¿Quién puede importarlo?",
  ops:["Cualquier módulo","Solo paquetes dentro de github.com/pablo/tareas/","Solo main","Nadie"],
  ok:1, why:"El compilador lo impide fuera del árbol del padre de internal. Es un límite real, no una convención."},
 {t:"opcion", p:"El compilador dice <code>import cycle not allowed</code> entre <code>pedidos</code> y <code>clientes</code>. ¿Qué haces?",
  ops:["Juntar todo en un solo fichero","Sacar lo que ambos necesitan a un paquete común, o hacer que uno declare una interfaz con lo que usa del otro","Usar un import con _","Renombrar los paquetes"],
  ok:1, why:"Los ciclos suelen señalar un diseño enredado. Una interfaz en el consumidor invierte la dependencia."},
 {t:"par", p:"Empareja cada forma de import con su efecto",
  pares:[["import \"strings\"","Usar como strings.Contains"],["import pg \"github.com/jackc/pgx/v5\"","Usar el paquete con el nombre pg"],["import _ \"github.com/lib/pq\"","Solo ejecutar su init (registrar un driver)"],["import . \"fmt\"","Usar Println sin prefijo (desaconsejado)"]],
  why:"El import con _ registra drivers de database/sql o formatos de image sin usar nada del paquete directamente."},
 {t:"vf", p:"Dentro de un mismo paquete, un fichero puede usar las funciones en minúscula de otro fichero.",
  ok:true, why:"La visibilidad es por paquete, no por fichero. Todos los ficheros de la carpeta comparten el mismo espacio de nombres."},
 {t:"opcion", p:"¿Qué nombre de función exportada es más idiomático en el paquete <code>almacen</code>?",
  ops:["almacen.NuevoAlmacen()","almacen.Nuevo()","almacen.CrearNuevoAlmacenDeTareas()","almacen.new_almacen()"],
  ok:1, why:"El nombre del paquete ya da contexto al llamar. Ejemplos de la estándar: bytes.Buffer, http.Client, list.New."},
 {t:"escribe", p:"¿Cómo debe llamarse la carpeta para que un paquete solo se pueda importar desde tu propio módulo?",
  sol:["internal","internal/"],
  pista:"Interno, en inglés.",
  why:"Es la única carpeta con significado especial para el compilador (además de vendor y testdata para las herramientas)."}
]},

/* =============== U6 L4 =============== */
{
id:"go6n4",
titulo:"Módulos y dependencias",
claves:["go.mod declara la ruta del módulo, la versión de Go y las dependencias; go.sum fija sus hashes","go get añade o actualiza, go mod tidy limpia; versiones semánticas y /v2 en la ruta para cambios incompatibles","GOPROXY y la base de sumas protegen la cadena de suministro; govulncheck busca vulnerabilidades que te afectan"],
pasos:[
 {t:"info", eti:"go.mod", h:"El fichero del módulo",
  c:`<div class="termbox">module github.com/pablo/tareas

go 1.26.0

require (
    github.com/google/uuid v1.6.0
    github.com/jackc/pgx/v5 v5.7.2
    golang.org/x/sync v0.10.0 // indirect
)

tool golang.org/x/tools/cmd/stringer      // Go 1.24+: herramientas del proyecto

replace github.com/pablo/utilidades =&gt; ../utilidades   // desarrollo local</div>
     <ul><li><b>go.sum</b> guarda el hash criptográfico de cada versión: si alguien cambia el código de una versión publicada, la descarga falla. Se sube al repositorio.</li>
     <li>Go usa <b>selección de versión mínima</b> (MVS): elige la versión más baja que satisface a todos. Las compilaciones son reproducibles sin fichero de bloqueo aparte.</li>
     <li>Una versión mayor nueva cambia la ruta: <code>github.com/jackc/pgx/v5</code>. v4 y v5 pueden convivir en el mismo binario.</li>
     <li>La línea <code>go</code> es la versión mínima del lenguaje; <code>toolchain</code> puede pedir un compilador concreto.</li></ul>`},
 {t:"info", eti:"Día a día", h:"Comandos de dependencias",
  c:`<div class="termbox">go get github.com/google/uuid@v1.6.0     # añadir una versión concreta
go get github.com/google/uuid@latest      # actualizar a la última
go get -u ./...                           # actualizar todas (menores y parches)
go mod tidy                               # quitar lo que no se usa, añadir lo que falta
go list -m all                            # todas las dependencias y versiones
go mod why github.com/google/uuid         # quién la necesita
go get -tool golang.org/x/tools/cmd/stringer@latest   # Go 1.24+
go tool stringer -type=Estado             # ejecutar esa herramienta

go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...                         # solo avisa si TU código llama a la función vulnerable</div>
     <p>Los módulos se descargan de <code>proxy.golang.org</code> (variable <code>GOPROXY</code>) y se verifican contra <code>sum.golang.org</code>. Para repositorios privados: <code>GOPRIVATE=github.com/miempresa/*</code>. Para trabajar con varios módulos a la vez en local existe <code>go work</code> (fichero go.work, que normalmente no se sube).</p>`},
 {t:"term", p:"Añade al módulo la versión v1.6.0 de <code>github.com/google/uuid</code>",
  prompt:"pablo@portatil:~/tareas$", sol:["go get github.com/google/uuid@v1.6.0"],
  salida:"go: downloading github.com/google/uuid v1.6.0\ngo: added github.com/google/uuid v1.6.0",
  pista:"go get ruta@versión.",
  why:"go get actualiza go.mod y go.sum. Sin @versión coge la última publicada."},
 {t:"term", p:"Deja go.mod y go.sum exactamente con lo que importa el código",
  prompt:"pablo@portatil:~/tareas$", sol:["go mod tidy"],
  salida:"",
  pista:"Ordenado, en inglés.",
  why:"Conviene ejecutarlo antes de cada commit; muchos CI fallan si tidy produce cambios."},
 {t:"term", p:"Comprueba si alguna vulnerabilidad conocida afecta al código del módulo",
  prompt:"pablo@portatil:~/tareas$", sol:["govulncheck ./..."],
  salida:"No vulnerabilities found.",
  pista:"La herramienta oficial de vulnerabilidades, sobre todos los paquetes.",
  why:"A diferencia de otros escáneres, govulncheck analiza las llamadas: solo avisa si realmente usas el código vulnerable."},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["go.sum","Hashes para verificar que las dependencias no han cambiado"],["replace","Usar una copia local o un fork de una dependencia"],["/v2 en la ruta","Versión mayor con cambios incompatibles"],["GOPRIVATE","Módulos que no pasan por el proxy ni la base de sumas públicos"],["go.work","Trabajar con varios módulos locales a la vez"]],
  why:"Todo esto viene de serie: no hay npm, Maven ni pip que elegir."},
 {t:"opcion", p:"Una librería publica su v2 con cambios incompatibles. ¿Cómo la importas?",
  ops:["Cambiando la versión en go.mod y listo","Con la ruta terminada en /v2 (por ejemplo, github.com/x/lib/v2), que es un módulo distinto","No se puede usar v2","Con go get -u"],
  ok:1, why:"Es la regla de importación semántica: si cambia el contrato, cambia la ruta, y el código viejo no se rompe."},
 {t:"vf", p:"go.sum es un fichero temporal y se debe añadir a .gitignore.",
  ok:false, why:"Se sube siempre: garantiza que todos compilan exactamente el mismo código de cada dependencia."}
]}

]});
