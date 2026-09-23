window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Primeros pasos con Go",
resumen: "Qué es Go y por qué domina la nube, la herramienta go, el primer programa, variables, tipos básicos, conversiones, constantes e iota",
nivel: "Fundamentos",
color: "#4fc3dc",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"go1l1",
titulo:"El lenguaje de la infraestructura",
claves:["Go es compilado, tipado estáticamente y con recolector de basura","Genera un único binario estático: ideal para contenedores y herramientas","Una sola herramienta, go, compila, prueba, formatea, gestiona dependencias y descarga versiones del compilador"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Por qué Go?",
  c:`<p><b>Go</b> (o Golang) nació en Google en 2009 buscando simplicidad: pocas palabras clave (25), compilación rapidísima y concurrencia fácil. Hoy es el lenguaje de la infraestructura cloud: <b>Docker</b>, <b>Kubernetes</b>, <b>Terraform</b>, <b>Prometheus</b>, <b>Grafana</b> o <b>etcd</b> están escritos en Go.</p>
     <ul><li>Compila a un <b>binario único</b> sin dependencias: se copia a una imagen <code>scratch</code> o distroless de pocos MB.</li>
     <li><b>Goroutines</b>: concurrencia ligera integrada en el lenguaje.</li>
     <li>Una sola forma de formatear el código (<code>gofmt</code>) y herramientas incluidas (tests, perfiles, documentación).</li>
     <li><b>Compatibilidad</b>: la promesa Go 1 garantiza que el código que compila hoy seguirá compilando con versiones futuras.</li></ul>
     <p>Sale una versión nueva cada seis meses (febrero y agosto). Solo las <b>dos últimas</b> reciben parches de seguridad: en este curso usamos Go 1.26 o posterior.</p>`},
 {t:"par", p:"Empareja cada característica de Go con su ventaja",
  pares:[["Binario estático","Imágenes de contenedor mínimas y despliegue trivial"],["Goroutines y canales","Concurrencia sencilla y barata"],["Compilación muy rápida","Ciclos de desarrollo ágiles"],["gofmt","Todo el código Go tiene el mismo estilo"],["Recolector de basura","Sin gestionar memoria a mano"]],
  why:"Si quieres contribuir a herramientas de Kubernetes o escribir operadores, Go es el lenguaje."},
 {t:"vf", p:"Go necesita una máquina virtual instalada en el servidor, como Java.",
  ok:false, why:"Compila a código nativo: basta el binario. El runtime de Go (planificador de goroutines, recolector de basura) va dentro del propio binario."},
 {t:"info", eti:"La herramienta go", h:"Un solo comando para todo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">subcomandos que usarás a diario</div><table class="dg-tabla"><thead><tr><th>comando</th><th>qué hace</th></tr></thead><tbody>
<tr><td><code>go run .</code></td><td>compila en un temporal y ejecuta</td></tr>
<tr><td><code>go build -o app .</code></td><td>genera el binario</td></tr>
<tr><td><code>go test ./...</code></td><td>ejecuta las pruebas de todos los paquetes</td></tr>
<tr><td><code>go fmt ./...</code></td><td>formatea el código (llama a gofmt)</td></tr>
<tr><td><code>go vet ./...</code></td><td>busca errores que compilan pero son sospechosos</td></tr>
<tr><td><code>go mod tidy</code></td><td>ajusta go.mod y go.sum a los imports reales</td></tr>
<tr><td><code>go install pkg@version</code></td><td>compila e instala una herramienta en <code>$GOPATH/bin</code></td></tr>
<tr><td><code>go doc strings.Cut</code></td><td>documentación en la terminal</td></tr>
<tr><td><code>go env</code></td><td>variables de configuración (GOPATH, GOOS, GOPROXY…)</td></tr>
</tbody></table></div>
     <p><code>./...</code> significa «este paquete y todos los que cuelgan de él». Desde Go 1.21 el comando <code>go</code> puede <b>descargar solo el compilador</b> que pide un proyecto (directiva <code>toolchain</code> en go.mod, variable <code>GOTOOLCHAIN</code>): no hace falta instalar varias versiones a mano.</p>`},
 {t:"term", p:"Comprueba qué versión de Go tienes instalada",
  prompt:"pablo@portatil:~$", sol:["go version"],
  salida:"go version go1.26.1 linux/amd64",
  pista:"El subcomando se llama igual que lo que quieres saber.",
  why:"La salida incluye sistema operativo y arquitectura: son los valores por defecto de GOOS y GOARCH al compilar."},
 {t:"term", p:"Ejecuta las pruebas de todos los paquetes del módulo",
  prompt:"pablo@portatil:~/api$", sol:["go test ./...","go test ./... -v"],
  salida:"ok  \tgithub.com/pablo/api/internal/pedidos\t0.012s\n?   \tgithub.com/pablo/api/cmd/api\t[no test files]",
  pista:"go test con el patrón que significa «todos los paquetes».",
  why:"<code>./...</code> recorre todas las subcarpetas del módulo. Es lo que se pone en el CI."},
 {t:"par", p:"Empareja cada comando con su propósito",
  pares:[["go vet ./...","Detectar código sospechoso que compila"],["go mod tidy","Limpiar y completar las dependencias"],["go doc fmt.Printf","Leer la documentación de una función"],["go env GOPATH","Ver dónde se guardan módulos y herramientas"],["go install ...@latest","Instalar una herramienta escrita en Go"]],
  why:"Todo viene con la instalación de Go: no hay que elegir gestor de paquetes, formateador ni framework de pruebas."}
]},

/* =============== U1 L2 =============== */
{
id:"go1l2",
titulo:"Primer programa, paquetes y variables",
claves:["package main y func main() son el punto de entrada","go run ejecuta; go build genera el binario; go mod init crea el módulo","Declaración con var o con := (inferencia); valores cero por defecto"],
pasos:[
 {t:"info", eti:"Hola", h:"Estructura mínima",
  c:`<div class="termbox">// main.go
package main

import (
    "fmt"
    "os"
)

func main() {
    nombre := "Catappa"               // declaración corta con inferencia
    var intentos int                  // valor cero: 0
    const maximo = 3
    fmt.Printf("Hola, %s (%d/%d)\\n", nombre, intentos, maximo)
    if len(os.Args) &gt; 1 {
        fmt.Println("Argumento:", os.Args[1])
    }
}</div>
     <div class="termbox">go mod init github.com/pablo/saludo      # crea go.mod
go run .
go build -o saludo . &amp;&amp; ./saludo</div>
     <p>Todo fichero empieza por <code>package</code>. El paquete <code>main</code> con una función <code>main()</code> es lo que genera un ejecutable; cualquier otro nombre de paquete es una biblioteca.</p>`},
 {t:"info", eti:"Declarar", h:"var, := y el valor cero",
  c:`<div class="termbox">var edad int              // 0
var nombre = "Ana"        // tipo inferido: string
x, y := 1, 2              // solo dentro de funciones
x, z := 3, 4              // válido: z es nueva, x se reasigna
var (
    host = "localhost"
    port = 8080
)</div>
     <ul><li><code>:=</code> declara <b>y</b> asigna; solo vale dentro de funciones y exige que al menos una variable de la izquierda sea nueva.</li>
     <li>En Go no hay variables sin inicializar: toda variable tiene su <b>valor cero</b>.</li>
     <li>Una variable o import que no se usa es <b>error de compilación</b>, no un aviso.</li></ul>
     <div class="nota ojo"><b class="tit">La sombra</b><code>err := …</code> dentro de un <code>if</code> o un bloque crea una variable nueva que <i>tapa</i> a la de fuera. Es un error clásico: la de fuera se queda sin asignar.</div>`},
 {t:"par", p:"Empareja cada tipo con su valor cero",
  pares:[["int","0"],["string","\"\" (cadena vacía)"],["bool","false"],["puntero, slice, map","nil"],["struct","Todos sus campos a su valor cero"]],
  why:"En Go no hay variables sin inicializar: siempre tienen su valor cero."},
 {t:"term", p:"Compila el paquete actual en un binario llamado <code>api</code>",
  prompt:"pablo@portatil:~/api$", sol:["go build -o api .","go build -o api"],
  pista:"go build con -o y el nombre del binario.",
  salida:``, why:"Sin salida significa éxito. <code>GOOS=linux GOARCH=arm64 go build</code> compila para otra plataforma sin más."},
 {t:"term", p:"Crea un módulo nuevo llamado <code>github.com/pablo/tareas</code>",
  prompt:"pablo@portatil:~/tareas$", sol:["go mod init github.com/pablo/tareas"],
  salida:"go: creating new go.mod: module github.com/pablo/tareas",
  pista:"go mod, el verbo que inicializa y la ruta del módulo.",
  why:"La ruta del módulo es el prefijo con el que se importan sus paquetes. Suele coincidir con la URL del repositorio."},
 {t:"opcion", p:"¿Qué pasa si declaras una variable o importas un paquete y no lo usas?",
  ops:["Nada","Error de compilación: Go no permite variables ni imports sin usar","Un aviso","Se borra solo"],
  ok:1, why:"Parece estricto, pero mantiene el código limpio. Para descartar un valor a propósito se usa <code>_</code>."},
 {t:"opcion", p:"Este fragmento, ¿compila?",
  c:`<div class="termbox">package main

var total := 0

func main() {}</div>`,
  ops:["Sí","No: := solo se permite dentro de funciones; fuera hay que usar var total = 0","No: falta el tipo","Sí, pero con un aviso"],
  ok:1, why:"A nivel de paquete todo empieza por una palabra clave (var, const, func, type, import)."},
 {t:"hueco", p:"Completa el programa mínimo",
  tpl:"package ___\n\nimport \"fmt\"\n\nfunc ___() {\n    msg ___ \"hola\"\n    fmt.Println(msg)\n}",
  banco:["main","main",":=","=","init","fmt"], sol:["main","main",":="],
  why:"Paquete main + función main = ejecutable. := declara msg con tipo string inferido."}
]},

/* =============== U1 L3 =============== */
{
id:"go1n1",
titulo:"Tipos básicos y conversiones",
claves:["int, float64, string, bool, byte (uint8) y rune (int32) son los tipos del día a día","Go nunca convierte tipos numéricos solo: la conversión es explícita, T(v)","strconv convierte entre texto y números; fmt formatea con verbos como %v, %d, %q y %T"],
pasos:[
 {t:"info", eti:"Los tipos", h:"Números, texto y booleanos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tipos básicos</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>notas</th></tr></thead><tbody>
<tr><td><code>int</code>, <code>uint</code></td><td>64 bits en plataformas de 64 bits; el entero por defecto</td></tr>
<tr><td><code>int8</code> … <code>int64</code>, <code>uint8</code> … <code>uint64</code></td><td>tamaño fijo, para formatos binarios o ahorrar memoria</td></tr>
<tr><td><code>float64</code>, <code>float32</code></td><td>coma flotante IEEE 754; float64 por defecto</td></tr>
<tr><td><code>string</code></td><td>secuencia inmutable de bytes, normalmente UTF-8</td></tr>
<tr><td><code>byte</code></td><td>alias de <code>uint8</code></td></tr>
<tr><td><code>rune</code></td><td>alias de <code>int32</code>: un punto de código Unicode</td></tr>
<tr><td><code>bool</code></td><td><code>true</code> o <code>false</code>; no se convierte desde números</td></tr>
</tbody></table></div>
     <div class="termbox">i := 10
f := 2.5
// r := i * f            // error: mismatched types int and float64
r := float64(i) * f      // 25
n := int(9.99)           // 9: trunca, no redondea
var b uint8 = 255
b++                      // 0: los enteros desbordan en silencio</div>
     <p>Para dinero no uses <code>float64</code>: guarda <b>céntimos en int64</b> (o usa una librería decimal). 0.1 + 0.2 no da exactamente 0.3 en ningún lenguaje con IEEE 754.</p>`},
 {t:"opcion", p:"¿Qué imprime <code>fmt.Println(7/2, -7/2, -7%3, 7.0/2)</code>?",
  ops:["3.5 -3.5 -1 3.5","3 -3 -1 3.5","3 -4 2 3.5","4 -3 1 3"],
  ok:1, why:"La división entera trunca hacia cero (-7/2 = -3) y el resto lleva el signo del dividendo (-7%3 = -1). Con un operando de coma flotante la división es real."},
 {t:"opcion", p:"¿Qué ocurre al compilar <code>var a int = 5; var b int64 = a</code>?",
  ops:["Compila: son el mismo tipo en 64 bits","Error de compilación: int e int64 son tipos distintos; hace falta int64(a)","Pánico en ejecución","Aviso de go vet"],
  ok:1, why:"Aunque ocupen lo mismo, para Go son tipos distintos. Ninguna conversión numérica es implícita."},
 {t:"info", eti:"Texto y números", h:"strconv y fmt",
  c:`<div class="termbox">n, err := strconv.Atoi("42")          // 42, nil
_, err = strconv.Atoi("42a")          // strconv.Atoi: parsing "42a": invalid syntax
s := strconv.Itoa(42)                 // "42"
f, _ := strconv.ParseFloat("3.14", 64)
ok, _ := strconv.ParseBool("true")

string(65)                // "A" (¡un rune!, no "65"); go vet lo avisa
fmt.Sprint(65)            // "65"

fmt.Printf("%v %+v %T %q %x %05.1f\\n", p, p, p, "hola", 255, 3.14159)
// {Ana 3} {N:Ana E:3} main.P "hola" ff 003.1</div>
     <p>Verbos que usarás siempre: <code>%v</code> (valor por defecto), <code>%+v</code> (con nombres de campo), <code>%#v</code> (sintaxis Go), <code>%T</code> (tipo), <code>%q</code> (entre comillas), <code>%d</code>, <code>%s</code>, <code>%x</code>, <code>%w</code> (solo en <code>fmt.Errorf</code>).</p>`},
 {t:"par", p:"Empareja cada verbo de fmt con lo que muestra",
  pares:[["%v","El valor con el formato por defecto"],["%+v","Un struct con los nombres de sus campos"],["%T","El tipo del valor"],["%q","Una cadena entre comillas, con escapes"],["%x","Hexadecimal"]],
  why:"<code>%+v</code> es el favorito para depurar structs; <code>%T</code> para saber qué hay dentro de una interfaz."},
 {t:"escribe", p:"¿Qué función de <code>strconv</code> convierte <code>\"42\"</code> en el entero 42 devolviendo también un error?",
  sol:["strconv.Atoi","Atoi","strconv.Atoi(\"42\")"],
  pista:"ASCII to integer.",
  why:"Atoi = «ASCII to integer». Para otros tamaños y bases: <code>strconv.ParseInt(s, 10, 64)</code>."},
 {t:"vf", p:"<code>int(3.99)</code> vale 4.",
  ok:false, why:"La conversión de coma flotante a entero trunca hacia cero: vale 3. Para redondear, <code>int(math.Round(3.99))</code>."},
 {t:"hueco", p:"Convierte la edad leída como texto y súmale uno",
  tpl:"edad, err := strconv.___(texto)\nif err != nil {\n    return err\n}\nfmt.Println(strconv.___(edad + 1))",
  banco:["Atoi","Itoa","ParseInt","Sprint","string"], sol:["Atoi","Itoa"],
  why:"Atoi de texto a int; Itoa de int a texto. string(edad) daría un carácter Unicode, no los dígitos."}
]},

/* =============== U1 L4 =============== */
{
id:"go1n2",
titulo:"Constantes e iota",
claves:["Las constantes se evalúan al compilar; las que no tienen tipo usan precisión arbitraria","iota numera constantes dentro de un bloque const: la forma de hacer enumeraciones","Un tipo propio con método String() convierte una enumeración en algo legible"],
pasos:[
 {t:"info", eti:"Constantes", h:"Sin tipo hasta que hace falta",
  c:`<div class="termbox">const Pi = 3.14159             // constante sin tipo
const Limite int = 100         // constante con tipo

var f32 float32 = Pi          // vale: Pi se adapta al tipo que se necesite
var f64 float64 = Pi          // también

const grande = 1 &lt;&lt; 100        // no cabe en ningún entero... y compila
fmt.Println(grande &gt;&gt; 98)      // 4: el cálculo se hace al compilar</div>
     <p>Una constante <b>sin tipo</b> es un valor ideal de precisión arbitraria: solo toma tipo cuando se asigna o se usa. Por eso <code>time.Sleep(2 * time.Second)</code> compila sin conversiones: el 2 se adapta a <code>time.Duration</code>.</p>
     <p>Solo pueden ser constantes los números, cadenas, runes y booleanos. <b>No hay slices ni maps constantes</b>.</p>`},
 {t:"info", eti:"Enumeraciones", h:"iota",
  c:`<div class="termbox">type Estado int

const (
    Pendiente Estado = iota   // 0
    Pagado                    // 1 (repite la expresión anterior)
    _                         // 2: se salta
    Enviado                   // 3
)

func (e Estado) String() string {
    switch e {
    case Pendiente: return "pendiente"
    case Pagado:    return "pagado"
    case Enviado:   return "enviado"
    }
    return fmt.Sprintf("Estado(%d)", int(e))
}

const (
    _  = iota                  // ignorar el 0
    KB = 1 &lt;&lt; (10 * iota)       // 1024
    MB                         // 1048576
    GB
)</div>
     <p><code>iota</code> vale 0 en la primera línea de cada bloque <code>const</code> y aumenta en 1 por línea. Si una línea no tiene expresión, repite la anterior con el nuevo iota. Con <code>String()</code>, <code>fmt.Println(Pagado)</code> imprime <code>pagado</code>. La herramienta <code>stringer</code> genera ese método con <code>go generate</code>.</p>`},
 {t:"opcion", p:"¿Qué imprime <code>fmt.Println(Pendiente, Enviado)</code> sin método String()?",
  c:`<div class="termbox">type Estado int
const (
    Pendiente Estado = iota
    Pagado
    _
    Enviado
)</div>`,
  ops:["0 2","0 3","1 3","Pendiente Enviado"],
  ok:1, why:"El <code>_</code> consume el valor 2, así que Enviado es 3. Sin String() se imprime el número."},
 {t:"opcion", p:"¿Por qué conviene que el valor 0 de una enumeración sea «desconocido» o un estado inicial válido?",
  ops:["Por rendimiento","Porque el valor cero de un campo sin asignar es 0: si 0 fuera, por ejemplo, «Pagado», un pedido recién creado parecería pagado","Porque iota no puede empezar en 1","Por estilo de gofmt"],
  ok:1, why:"Diseñar para que el valor cero sea útil (o claramente inválido) es un principio de Go."},
 {t:"vf", p:"Se puede declarar <code>const dias = []string{\"lun\", \"mar\"}</code>.",
  ok:false, why:"Los slices no pueden ser constantes. Se usa una variable de paquete (<code>var dias = …</code>) o un array dentro de una función."},
 {t:"hueco", p:"Completa la enumeración de niveles de log",
  tpl:"type Nivel int\n\n___ (\n    Debug Nivel = ___\n    Info\n    Aviso\n    Error\n)",
  banco:["const","var","iota","0","type","enum"], sol:["const","iota"],
  why:"Debug=0, Info=1, Aviso=2, Error=3. Go no tiene palabra clave enum: esta es la forma idiomática."},
 {t:"escribe", p:"¿Qué método debe tener un tipo para que <code>fmt.Println</code> lo muestre con un texto propio?",
  sol:["String","String()","String() string","func String() string"],
  pista:"Es la interfaz fmt.Stringer.",
  why:"Cualquier tipo con <code>String() string</code> cumple <code>fmt.Stringer</code> y fmt lo usa al imprimir."},
 {t:"opcion", p:"¿Cuánto vale <code>MB</code>?",
  c:`<div class="termbox">const (
    _  = iota
    KB = 1 &lt;&lt; (10 * iota)
    MB
)</div>`,
  ops:["2048","1048576","1024","20"],
  ok:1, why:"En la línea de MB, iota vale 2: 1 &lt;&lt; 20 = 1.048.576. MB repite la expresión de KB con el nuevo iota."}
]}

]});
