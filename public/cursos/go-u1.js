window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Qué es Go",
resumen: "El lenguaje de la nube, compilar y ejecutar, paquetes, variables, tipos y funciones con varios resultados",
nivel: "Fundamentos",
color: "#4fc3dc",
lecciones: [

{
id:"go1l1",
titulo:"El lenguaje de la infraestructura",
claves:["Go es compilado, tipado estáticamente y con recolector de basura","Genera un único binario estático: ideal para contenedores y herramientas","Docker, Kubernetes, Terraform, Prometheus y muchas herramientas cloud están escritas en Go"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Por qué Go?",
  c:`<p><b>Go</b> (o Golang) nació en Google en 2009 buscando simplicidad: pocas palabras clave, compilación rapidísima y concurrencia fácil. Hoy es el lenguaje de la infraestructura cloud: <b>Docker</b>, <b>Kubernetes</b>, <b>Terraform</b>, <b>Prometheus</b>, <b>Grafana</b> o <b>etcd</b> están escritos en Go.</p>
     <ul><li>Compila a un <b>binario único</b> sin dependencias: se copia a una imagen <code>scratch</code> o distroless de pocos MB.</li>
     <li><b>Goroutines</b>: concurrencia ligera integrada en el lenguaje.</li>
     <li>Una sola forma de formatear el código (<code>gofmt</code>) y herramientas incluidas (tests, perfiles, documentación).</li></ul>`},
 {t:"par", p:"Empareja cada característica de Go con su ventaja",
  pares:[["Binario estático","Imágenes de contenedor mínimas y despliegue trivial"],["Goroutines y canales","Concurrencia sencilla y barata"],["Compilación muy rápida","Ciclos de desarrollo ágiles"],["gofmt","Todo el código Go tiene el mismo estilo"],["Recolector de basura","Sin gestionar memoria a mano"]],
  why:"Si quieres contribuir a herramientas de Kubernetes o escribir operadores, Go es el lenguaje."},
 {t:"vf", p:"Go necesita una máquina virtual instalada en el servidor, como Java.",
  ok:false, why:"Compila a código nativo: basta el binario."}
]},

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
    nombre := "Catappa"                 // declaracion corta con inferencia
    var intentos int                  // valor cero: 0
    const maximo = 3
    fmt.Printf("Hola, %s (%d/%d)\\n", nombre, intentos, maximo)
    if len(os.Args) &gt; 1 {
        fmt.Println("Argumento:", os.Args[1])
    }
}</div>
     <div class="termbox">go mod init github.com/pablo/saludo
go run .
go build -o saludo . &amp;&amp; ./saludo</div>`},
 {t:"par", p:"Empareja cada tipo con su valor cero",
  pares:[["int","0"],["string","\"\" (cadena vacía)"],["bool","false"],["puntero, slice, map","nil"],["struct","Todos sus campos a su valor cero"]],
  why:"En Go no hay variables sin inicializar: siempre tienen su valor cero."},
 {t:"term", p:"Compila el paquete actual en un binario llamado <code>api</code>",
  prompt:"pablo@portatil:~/api$", sol:["go build -o api .","go build -o api"],
  pista:"go build con -o y el nombre del binario.",
  salida:``, why:"GOOS=linux GOARCH=arm64 go build compila para otra plataforma sin más."},
 {t:"opcion", p:"¿Qué pasa si declaras una variable o importas un paquete y no lo usas?",
  ops:["Nada","Error de compilación: Go no permite variables ni imports sin usar","Un aviso","Se borra solo"],
  ok:1, why:"Parece estricto, pero mantiene el código limpio."}
]},

{
id:"go1l3",
titulo:"Funciones",
claves:["Las funciones pueden devolver varios valores, típicamente (resultado, error)","Los nombres en mayúscula se exportan del paquete; en minúscula son privados","Las funciones son valores: se pasan como argumentos y forman closures"],
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

func Publica() {}     // exportada: se usa desde otros paquetes (mayuscula)
func privada() {}     // solo dentro de su paquete</div>`},
 {t:"par", p:"Empareja cada elemento con su significado en Go",
  pares:[["func f() (int, error)","Devuelve un valor y un posible error"],["nil","Ausencia de valor (sin error, puntero vacío)"],["Nombre en mayúscula","Exportado fuera del paquete"],["_","Ignorar un valor devuelto"],["if err != nil","La forma idiomática de comprobar errores"]],
  why:"Go no tiene excepciones para errores normales: se devuelven y se comprueban."},
 {t:"vf", p:"En Go, una función con nombre en minúscula puede usarse desde otro paquete.",
  ok:false, why:"La visibilidad la da la mayúscula inicial."}
]}

]});
