window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Proyectos reales en Go",
resumen: "Servicios HTTP con net/http, JSON, pruebas por tablas, benchmarks, perfiles con pprof e imágenes Docker mínimas",
nivel: "Experto",
color: "#3ba7c0",
lecciones: [

{
id:"go5l1",
titulo:"Un servicio HTTP",
claves:["net/http de la librería estándar basta para muchas APIs (con rutas por método desde Go 1.22)","encoding/json con etiquetas de struct","Servidor con timeouts y apagado elegante"],
pasos:[
 {t:"info", eti:"Sin frameworks", h:"API con la librería estándar",
  c:`<div class="termbox">type Tarea struct {
    ID     int    \`json:"id"\`
    Titulo string \`json:"titulo"\`
    Hecha  bool   \`json:"hecha"\`
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /api/tareas/{id}", func(w http.ResponseWriter, r *http.Request) {
        id, err := strconv.Atoi(r.PathValue("id"))
        if err != nil { http.Error(w, "id no válido", http.StatusBadRequest); return }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(Tarea{ID: id, Titulo: "Repasar Go"})
    })

    srv := &amp;http.Server{Addr: ":8080", Handler: mux, ReadTimeout: 5 * time.Second, WriteTimeout: 10 * time.Second}
    go srv.ListenAndServe()

    stop := make(chan os.Signal, 1)
    signal.Notify(stop, syscall.SIGTERM, os.Interrupt)
    &lt;-stop
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    srv.Shutdown(ctx)                      // apagado elegante
}</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["\"GET /api/tareas/{id}\"","Patrón con método y parámetro de ruta (Go 1.22+)"],["r.PathValue(\"id\")","Leer el parámetro de la ruta"],["`json:\"titulo\"`","Nombre del campo en el JSON"],["srv.Shutdown(ctx)","Terminar las peticiones en curso antes de salir"],["ReadTimeout","Protegerse de clientes lentos"]],
  why:"Lo mismo que en Spring y Node: timeouts y apagado elegante son obligatorios en producción."},
 {t:"vf", p:"Para una API REST en Go siempre hace falta un framework externo.",
  ok:false, why:"net/http cubre mucho; frameworks como chi, Gin o Echo añaden comodidades."}
]},

{
id:"go5l2",
titulo:"Pruebas, perfiles y Docker",
claves:["Pruebas por tablas con go test; benchmarks con testing.B","pprof para perfilar CPU y memoria","Imagen multi-stage con CGO_ENABLED=0 y base distroless o scratch"],
pasos:[
 {t:"info", eti:"Calidad", h:"Pruebas por tablas",
  c:`<div class="termbox">func TestPrecioConIva(t *testing.T) {
    casos := []struct {
        nombre   string
        base     int64
        esperado int64
    }{
        {"cero", 0, 0},
        {"cien euros", 10000, 12100},
    }
    for _, c := range casos {
        t.Run(c.nombre, func(t *testing.T) {
            if got := PrecioConIva(c.base); got != c.esperado {
                t.Errorf("PrecioConIva(%d) = %d; esperado %d", c.base, got, c.esperado)
            }
        })
    }
}

go test ./... -race -cover
go test -bench=. -benchmem
go tool pprof http://localhost:6060/debug/pprof/profile</div>`},
 {t:"info", eti:"Empaquetar", h:"Imagen mínima",
  c:`<div class="termbox">FROM golang:1.23 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /api ./cmd/api

FROM gcr.io/distroless/static:nonroot
COPY --from=build /api /api
USER nonroot
ENTRYPOINT ["/api"]</div>
     <p>La imagen final pesa unos 10-20 MB y no tiene shell ni paquetes: casi nada que atacar.</p>`},
 {t:"par", p:"Empareja cada comando con su propósito",
  pares:[["go test ./...","Ejecutar todas las pruebas del módulo"],["go test -race","Detectar condiciones de carrera"],["go test -bench=.","Ejecutar benchmarks"],["go vet","Detectar código sospechoso"],["CGO_ENABLED=0","Binario totalmente estático para scratch o distroless"]],
  why:"Las pruebas por tablas son el estilo idiomático de Go."}
]},

{
id:"go5l3",
titulo:"Herramientas de línea de comandos y operadores",
claves:["Go es el lenguaje de Docker, Kubernetes, Terraform y Prometheus","cobra para CLI; client-go y controller-runtime para operadores de Kubernetes","Un único binario estático, fácil de distribuir"],
pasos:[
 {t:"info", eti:"Donde brilla Go", h:"CLIs y operadores",
  c:`<div class="termbox">// una CLI con cobra
var raiz = &amp;cobra.Command{Use: "catappa", Short: "Herramientas de la plataforma"}
var desplegar = &amp;cobra.Command{
    Use: "desplegar [entorno]", Args: cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error { return desplegarEn(args[0]) },
}

// compilar para otras plataformas
GOOS=linux GOARCH=arm64 go build -o catappa-linux-arm64 .</div>
     <p>Un <b>operador</b> de Kubernetes es un controlador en Go que vigila un recurso propio (por ejemplo <code>BaseDeDatos</code>) y ajusta el clúster hasta que coincide con lo declarado: el mismo bucle de reconciliación que usa Kubernetes.</p>`},
 {t:"par", p:"Empareja cada librería o herramienta con su propósito",
  pares:[["cobra","Comandos y opciones de una CLI"],["client-go","Hablar con la API de Kubernetes"],["controller-runtime / kubebuilder","Construir operadores"],["GOOS y GOARCH","Compilar para otro sistema y arquitectura"],["goreleaser","Publicar binarios para muchas plataformas"]],
  why:"Por eso Go es tan habitual en equipos de plataforma y DevOps."},
 {t:"vf", p:"Para ejecutar un binario de Go compilado sin cgo, el servidor necesita tener Go instalado.",
  ok:false, why:"Es un binario estático autocontenido: cabe en una imagen scratch o distroless."}
]}

]});
