window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Go en producción",
resumen: "Logs estructurados con slog, perfiles con pprof, memoria y recolector de basura, compilación cruzada, CLIs y binarios con versión, e imágenes de contenedor mínimas",
nivel: "Experto",
color: "#349db6",
lecciones: [

/* =============== U11 L1 =============== */
{
id:"go11n1",
titulo:"Logs estructurados con slog",
claves:["log/slog (Go 1.21+) escribe logs con nivel y pares clave-valor; en producción, JSONHandler","logger.With añade campos fijos (servicio, id de petición); slog.Group agrupa","LogValuer oculta datos sensibles; LevelVar cambia el nivel en caliente"],
pasos:[
 {t:"info", eti:"Logs que se consultan", h:"slog",
  c:`<div class="termbox">logger := slog.New(slog.NewJSONHandler(os.Stdout, &amp;slog.HandlerOptions{
    Level: slog.LevelInfo,
}))
slog.SetDefault(logger)                        // también redirige el paquete log

l := logger.With("servicio", "api", "version", version)
l.Info("petición", "metodo", "GET", "codigo", 200,
    slog.Group("usuario", "id", 7))
l.Debug("detalle")                             // no sale: el nivel es Info
l.ErrorContext(ctx, "fallo al cobrar", "err", err, "pedido", id)</div>
<div class="termbox">{"time":"2026-09-23T15:01:03.87Z","level":"INFO","msg":"petición","servicio":"api","version":"1.4.2","metodo":"GET","codigo":200,"usuario":{"id":7}}</div>
     <p>Cada línea es un JSON que Loki, Elasticsearch o CloudWatch indexan por campo: puedes filtrar <code>codigo &gt;= 500</code> sin expresiones regulares. En desarrollo, <code>slog.NewTextHandler</code> da <code>clave=valor</code> más legible.</p>`},
 {t:"info", eti:"Bien hecho", h:"Contexto, secretos y niveles",
  c:`<div class="termbox">type Email string
func (e Email) LogValue() slog.Value { return slog.StringValue("***") }   // nunca sale en claro

var nivel = new(slog.LevelVar)                  // Info por defecto
h := slog.NewJSONHandler(os.Stdout, &amp;slog.HandlerOptions{Level: nivel})
nivel.Set(slog.LevelDebug)                      // p. ej. desde un endpoint de administración

// middleware: un logger por petición con su id
l := logger.With("peticion_id", r.Header.Get("X-Request-ID"))
ctx := conLogger(r.Context(), l)

multi := slog.NewMultiHandler(hJSON, hOtro)      // Go 1.26+: varios destinos a la vez</div>
     <ul><li>Mensaje <b>constante</b> y datos en los atributos: <code>"pedido creado", "id", id</code>, no <code>fmt.Sprintf("pedido %d creado", id)</code>.</li>
     <li>Logs a <b>stdout</b>: en contenedores, el recolector de la plataforma se encarga del resto.</li>
     <li>Nada de contraseñas, tokens ni datos personales en claro.</li></ul>`},
 {t:"opcion", p:"¿Qué línea sigue mejor el estilo de logs estructurados?",
  ops:["slog.Info(fmt.Sprintf(\"usuario %d pagó %d\", id, total))","slog.Info(\"pago realizado\", \"usuario\", id, \"total\", total)","log.Println(\"pago\", id, total)","fmt.Println(\"pago realizado\")"],
  ok:1, why:"Un mensaje fijo agrupa todos los pagos; los atributos se filtran y agregan en el sistema de logs."},
 {t:"opcion", p:"Con el nivel en Info, ¿qué pasa con <code>l.Debug(\"detalle\")</code>?",
  ops:["Sale con nivel DEBUG","Se descarta sin escribir nada","Sale como INFO","Error"],
  ok:1, why:"Solo se escriben mensajes de nivel igual o superior al configurado (Debug &lt; Info &lt; Warn &lt; Error)."},
 {t:"hueco", p:"Crea un logger JSON y añade el nombre del servicio a todas las líneas",
  tpl:"base := slog.New(slog.___(os.Stdout, nil))\nlogger := base.___(\"servicio\", \"pagos\")\nlogger.Info(\"arrancado\", \"puerto\", 8080)",
  banco:["NewJSONHandler","With","NewTextHandler","Group","Add"], sol:["NewJSONHandler","With"],
  why:"With devuelve un logger nuevo con esos atributos; el original no cambia."},
 {t:"par", p:"Empareja cada pieza de slog con su uso",
  pares:[["slog.NewJSONHandler","Formato JSON para producción"],["logger.With","Atributos fijos en todas las líneas"],["slog.Group","Anidar atributos bajo una clave"],["LogValuer","Controlar cómo se registra un tipo (ocultar secretos)"],["slog.LevelVar","Cambiar el nivel sin reiniciar"]],
  why:"slog es estándar: las librerías pueden aceptar un *slog.Logger sin atarte a zap o zerolog."},
 {t:"vf", p:"En un contenedor, lo recomendable es que el servicio escriba los logs en un fichero dentro de /var/log.",
  ok:false, why:"A stdout/stderr: la plataforma (Docker, Kubernetes) los recoge y los envía. Un fichero dentro del contenedor se pierde y llena el disco."},
 {t:"escribe", p:"¿Qué método debe implementar un tipo para decidir cómo aparece en los logs de slog? (con paréntesis)",
  sol:["LogValue()","LogValue","LogValue() slog.Value"],
  pista:"Log + Value.",
  why:"Es la interfaz slog.LogValuer: ideal para ocultar emails, tokens o para registrar solo el id de una entidad grande."}
]},

/* =============== U11 L2 =============== */
{
id:"go11n2",
titulo:"Perfiles con pprof, memoria y GC",
claves:["net/http/pprof expone perfiles de CPU, heap, goroutines y bloqueos; go tool pprof los analiza (top, list, gráfico de llamas)","GOGC regula cada cuánto recoge el GC; GOMEMLIMIT fija un límite blando de memoria, clave en contenedores","Menos asignaciones = menos GC: reservar capacidad, reutilizar buffers (sync.Pool) y PGO con default.pgo"],
pasos:[
 {t:"info", eti:"Medir, no adivinar", h:"pprof",
  c:`<div class="termbox">import _ "net/http/pprof"                  // registra /debug/pprof/ en DefaultServeMux

go func() {                                 // en un puerto interno, nunca público
    log.Println(http.ListenAndServe("localhost:6060", nil))
}()

$ go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30   # CPU
(pprof) top
      flat  flat%   sum%        cum   cum%
     2.10s 35.00% 35.00%      2.40s 40.00%  encoding/json.(*decodeState).object
     0.90s 15.00% 50.00%      0.90s 15.00%  runtime.mallocgc
(pprof) list ParsearPedido                  # tiempo línea a línea

$ go tool pprof -http=:8081 http://localhost:6060/debug/pprof/heap     # web con gráfico de llamas
$ curl localhost:6060/debug/pprof/goroutine?debug=2                   # pila de TODAS las goroutines</div>
     <p><b>flat</b>: tiempo en la propia función; <b>cum</b>: incluyendo lo que llama. Perfiles disponibles: <code>profile</code> (CPU), <code>heap</code> (memoria viva), <code>allocs</code>, <code>goroutine</code>, <code>block</code> y <code>mutex</code> (esperas). También desde tests: <code>go test -cpuprofile cpu.out -memprofile mem.out</code>. Para latencias y planificación: <code>runtime/trace</code> y <code>go tool trace</code>.</p>`},
 {t:"info", eti:"Memoria", h:"El recolector de basura",
  c:`<ul><li>El GC de Go es <b>concurrente</b>: trabaja a la vez que tu programa, con pausas de microsegundos.</li>
     <li><b>GOGC=100</b> (por defecto): recoge cuando el heap ha crecido un 100% desde la última vez. Más alto = menos CPU de GC y más memoria.</li>
     <li><b>GOMEMLIMIT</b> (Go 1.19+): límite blando. Al acercarse, el GC trabaja más para no pasarse. En un contenedor con 512 MiB, algo como <code>GOMEMLIMIT=450MiB</code> evita muertes por OOM ante picos.</li>
     <li><b>Go 1.26</b> activa por defecto el recolector «Green Tea», que reduce bastante el coste del GC en programas con muchos objetos pequeños.</li>
     <li><b>PGO</b>: guarda un perfil de CPU de producción como <code>default.pgo</code> en el paquete main y <code>go build</code> lo usa para optimizar (suele dar un 2-7% gratis).</li></ul>
<div class="termbox">var buffers = sync.Pool{New: func() any { return new(bytes.Buffer) }}
b := buffers.Get().(*bytes.Buffer)
b.Reset()
defer buffers.Put(b)                        // reutilizar en vez de reservar cada vez</div>`},
 {t:"term", p:"Captura y analiza 30 segundos de perfil de CPU del servicio que expone pprof en el puerto 6060",
  prompt:"pablo@portatil:~$", sol:["go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30","go tool pprof 'http://localhost:6060/debug/pprof/profile?seconds=30'","go tool pprof \"http://localhost:6060/debug/pprof/profile?seconds=30\""],
  salida:"Fetching profile over HTTP from http://localhost:6060/debug/pprof/profile?seconds=30\nSaved profile in /home/pablo/pprof/pprof.api.samples.cpu.001.pb.gz\nType: cpu\n(pprof)",
  pista:"go tool pprof con la URL del perfil «profile» y seconds=30.",
  why:"Dentro, top, list y web. Con -http=:8081 se abre la interfaz web con el gráfico de llamas."},
 {t:"opcion", p:"Un pod con límite de 512 MiB muere por OOMKilled en los picos, aunque la memoria viva normal es 200 MiB. ¿Qué ajuste de Go ayuda?",
  ops:["GOGC=off","GOMEMLIMIT un poco por debajo del límite (por ejemplo 450MiB) para que el GC se esfuerce más al acercarse","GOMAXPROCS=1","Compilar con -race"],
  ok:1, why:"Con GOGC=100 el heap puede llegar al doble de lo vivo antes de recoger. El límite blando hace que el GC reaccione antes de que el kernel mate el proceso."},
 {t:"opcion", p:"El número de goroutines de tu servicio sube sin parar. ¿Qué perfil miras?",
  ops:["heap","goroutine (con debug=2 para ver todas las pilas)","profile (CPU)","mutex"],
  ok:1, why:"Verás miles de goroutines paradas en la misma línea: ahí está la fuga (un canal sin receptor, una petición sin timeout…)."},
 {t:"par", p:"Empareja cada columna o comando de pprof con su significado",
  pares:[["flat","Tiempo en la función, sin contar lo que llama"],["cum","Tiempo acumulado incluyendo las llamadas"],["top","Funciones más costosas"],["list Funcion","Coste línea a línea del código fuente"],["-http=:8081","Interfaz web con gráfico de llamas"]],
  why:"Busca primero cum alto en tu código y después flat alto en lo que llama."},
 {t:"vf", p:"Es buena idea exponer <code>/debug/pprof</code> en el mismo puerto público que la API.",
  ok:false, why:"Revela información interna y un perfil de CPU consume recursos: puerto interno (localhost o red de administración) y nunca abierto a Internet."},
 {t:"escribe", p:"¿Cómo debe llamarse el fichero de perfil que go build usa automáticamente para PGO si está en el paquete main?",
  sol:["default.pgo"],
  pista:"default + la extensión de profile-guided optimization.",
  why:"Se captura en producción con pprof y se sube al repositorio; go build lo usa sin flags."}
]},

/* =============== U11 L3 =============== */
{
id:"go5l3",
titulo:"Compilación cruzada, CLIs y binarios",
claves:["GOOS y GOARCH compilan para otra plataforma; CGO_ENABLED=0 da un binario totalmente estático","-ldflags \"-X main.version=…\" inyecta la versión; -trimpath y -s -w reducen y limpian el binario; embed mete ficheros dentro","flag de la estándar para CLIs sencillas; cobra para CLIs con subcomandos, como kubectl o docker"],
pasos:[
 {t:"info", eti:"Donde brilla Go", h:"Un binario para cada plataforma",
  c:`<div class="termbox">GOOS=linux   GOARCH=arm64 go build -o dist/app-linux-arm64 .
GOOS=darwin  GOARCH=arm64 go build -o dist/app-macos .
GOOS=windows GOARCH=amd64 go build -o dist/app.exe .
go tool dist list                  # todas las combinaciones (unas 47)

CGO_ENABLED=0 go build -trimpath \\
  -ldflags="-s -w -X main.version=1.4.2" -o api ./cmd/api

go version -m api                  # qué versión de Go, módulo, flags y commit de git</div>
     <ul><li><code>-X main.version=1.4.2</code> rellena una <code>var version = "dev"</code> del paquete main al enlazar.</li>
     <li><code>-s -w</code> quita tablas de símbolos y depuración (binario más pequeño); <code>-trimpath</code> quita las rutas de tu máquina.</li>
     <li>Go incrusta la información de compilación y del commit de git: <code>go version -m</code> o <code>debug.ReadBuildInfo()</code> la leen.</li>
     <li>Código por plataforma: ficheros <code>_linux.go</code> / <code>_windows.go</code> o la línea <code>//go:build linux</code>.</li></ul>`},
 {t:"info", eti:"Herramientas", h:"CLIs y ficheros incrustados",
  c:`<div class="termbox">//go:embed plantillas/*.html static
var contenido embed.FS             // los ficheros van DENTRO del binario

//go:embed version.txt
var textoVersion string

// CLI sencilla con la estándar
puerto := flag.Int("puerto", 8080, "puerto de escucha")
verbose := flag.Bool("v", false, "más detalle")
flag.Parse()

// CLI con subcomandos: cobra
var raiz = &amp;cobra.Command{Use: "catappa", Short: "Herramientas de la plataforma"}
var desplegar = &amp;cobra.Command{
    Use: "desplegar [entorno]", Args: cobra.ExactArgs(1),
    RunE: func(cmd *cobra.Command, args []string) error { return desplegarEn(args[0]) },
}</div>
     <p>Un <b>operador</b> de Kubernetes es un controlador en Go (client-go, controller-runtime, kubebuilder) que vigila un recurso propio y ajusta el clúster hasta que coincide con lo declarado: el mismo bucle de reconciliación que usa Kubernetes. <b>goreleaser</b> compila, empaqueta y publica binarios para todas las plataformas desde una etiqueta de git.</p>`},
 {t:"par", p:"Empareja cada librería o herramienta con su propósito",
  pares:[["cobra","Comandos y opciones de una CLI"],["client-go","Hablar con la API de Kubernetes"],["controller-runtime / kubebuilder","Construir operadores"],["GOOS y GOARCH","Compilar para otro sistema y arquitectura"],["goreleaser","Publicar binarios para muchas plataformas"]],
  why:"Por eso Go es tan habitual en equipos de plataforma y DevOps."},
 {t:"term", p:"Compila el paquete actual para Linux en ARM64 con el nombre <code>app</code>",
  prompt:"pablo@portatil:~/app$", sol:["GOOS=linux GOARCH=arm64 go build -o app .","GOARCH=arm64 GOOS=linux go build -o app .","GOOS=linux GOARCH=arm64 go build -o app","GOARCH=arm64 GOOS=linux go build -o app"],
  salida:"",
  pista:"Dos variables de entorno delante de go build -o.",
  why:"Sin toolchains extra ni máquinas virtuales: el compilador de Go genera código para cualquier plataforma soportada (sin cgo)."},
 {t:"hueco", p:"Inyecta la versión al compilar",
  tpl:"// main.go\nvar version = \"dev\"\n\n// al compilar\ngo build -___=\"-X main.___=2.0.1\" -o api .",
  banco:["ldflags","version","gcflags","tags","Version"], sol:["ldflags","version"],
  why:"-X solo funciona con variables string de paquete (no constantes). El nombre va con la ruta completa del paquete: main.version."},
 {t:"vf", p:"Para ejecutar un binario de Go compilado sin cgo, el servidor necesita tener Go instalado.",
  ok:false, why:"Es un binario estático autocontenido: cabe en una imagen scratch o distroless."},
 {t:"opcion", p:"Quieres servir el frontend (HTML, CSS, JS) desde el mismo binario del API, sin copiar carpetas al desplegar. ¿Qué usas?",
  ops:["Un volumen","//go:embed con un embed.FS y http.FileServerFS","Descargarlo al arrancar","Base64 a mano"],
  ok:1, why:"http.FileServerFS(sub) (Go 1.22+) sirve un fs.FS directamente. Un solo fichero que desplegar."},
 {t:"escribe", p:"¿Qué comando muestra la versión de Go y la información de compilación incrustada en el binario <code>api</code>?",
  sol:["go version -m api","go version -m ./api"],
  pista:"go version con la opción de módulos.",
  why:"Muy útil en un incidente: dice exactamente con qué versión de Go y de cada dependencia se compiló."}
]},

/* =============== U11 L4 =============== */
{
id:"go11n3",
titulo:"Imágenes mínimas y despliegue",
claves:["Dockerfile multi-stage: compilar en golang:1.26 y copiar solo el binario a distroless o scratch","Con scratch hay que traer certificados CA y zona horaria (o time/tzdata); distroless static ya los trae y usuario nonroot","En Kubernetes: sondas de salud, apagado con SIGTERM, límites de CPU y GOMEMLIMIT acorde"],
pasos:[
 {t:"info", eti:"Empaquetar", h:"Imagen mínima",
  c:`<div class="termbox">FROM golang:1.26 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \\
    --mount=type=cache,target=/root/.cache/go-build \\
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /api /api
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/api"]</div>
     <p>La imagen final pesa unos 10-20 MB y no tiene shell ni gestor de paquetes: casi nada que atacar. Copiar primero go.mod y go.sum aprovecha la caché de capas: las dependencias solo se descargan si cambian. Los <code>--mount=type=cache</code> de BuildKit conservan también la caché de compilación.</p>`},
 {t:"info", eti:"Detalles", h:"scratch, sondas y recursos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">bases para un binario estático</div><table class="dg-tabla"><thead><tr><th>base</th><th>trae</th><th>cuándo</th></tr></thead><tbody>
<tr><td><code>scratch</code></td><td>nada</td><td>máximo mínimo; copia tú <code>/etc/ssl/certs</code> y usa <code>import _ "time/tzdata"</code></td></tr>
<tr><td><code>distroless/static</code></td><td>certificados CA, tzdata, usuario nonroot</td><td>la opción por defecto razonable</td></tr>
<tr><td><code>alpine</code></td><td>shell y apk</td><td>si necesitas depurar dentro o cgo con musl</td></tr>
</tbody></table></div>
<div class="termbox">env:
  - name: GOMEMLIMIT
    valueFrom:
      resourceFieldRef:
        resource: limits.memory      # el GC sabe cuánto tiene
readinessProbe:
  httpGet: { path: /listo, port: 8080 }
livenessProbe:
  httpGet: { path: /salud, port: 8080 }</div>
     <p>Sin certificados CA, cualquier llamada HTTPS desde scratch falla con <code>x509: certificate signed by unknown authority</code>. Con Go 1.25+, GOMAXPROCS ya sigue el límite de CPU del contenedor. Al recibir SIGTERM, marca <code>/listo</code> como no disponible y llama a <code>Shutdown</code>.</p>`},
 {t:"orden", p:"Ordena las instrucciones de la etapa de compilación para aprovechar la caché de capas",
  items:["FROM golang:1.26 AS build","WORKDIR /src","COPY go.mod go.sum ./","RUN go mod download","COPY . .","RUN CGO_ENABLED=0 go build -o /api ./cmd/api"],
  why:"Si solo cambias código, Docker reutiliza la capa de go mod download."},
 {t:"opcion", p:"Tu binario en <code>FROM scratch</code> falla al llamar a una API externa: <code>x509: certificate signed by unknown authority</code>. ¿Qué pasa?",
  ops:["La API tiene un certificado caducado","La imagen scratch no tiene certificados raíz: cópialos desde la etapa de build o usa distroless/static","Falta CGO","Hay que compilar con -race"],
  ok:1, why:"COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ lo arregla, o cambia a distroless, que ya los incluye."},
 {t:"term", p:"Construye la imagen con la etiqueta <code>api:1.4.2</code> desde el Dockerfile de la carpeta actual",
  prompt:"pablo@portatil:~/api$", sol:["docker build -t api:1.4.2 .","docker build . -t api:1.4.2","docker buildx build -t api:1.4.2 ."],
  salida:"[+] Building 21.4s (14/14) FINISHED\n => exporting to image\n => => naming to docker.io/library/api:1.4.2",
  pista:"docker build con -t y el contexto.",
  why:"Después, docker images api mostrará unos pocos MB frente a los cientos de otras plataformas."},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Imagen de 900 MB","Multi-stage: solo el binario en la imagen final"],["El contenedor corre como root","USER nonroot (o la variante :nonroot de distroless)"],["Horas mal calculadas en scratch","import _ \"time/tzdata\" o una base con tzdata"],["OOMKilled en picos","GOMEMLIMIT según el límite del contenedor"],["Peticiones cortadas en cada despliegue","Gestionar SIGTERM con Shutdown y una sonda de preparación"]],
  why:"Son las cinco cosas que se revisan en cualquier servicio Go antes de ir a producción."},
 {t:"vf", p:"Con <code>CGO_ENABLED=0</code> el binario no depende de la libc del sistema y funciona en una imagen vacía.",
  ok:true, why:"Go implementa por sí mismo la red, el DNS y el resto. Con cgo activado dependería de glibc o musl."},
 {t:"escribe", p:"¿Qué variable de entorno hay que poner a 0 para obtener un binario totalmente estático sin dependencias de C?",
  sol:["CGO_ENABLED","CGO_ENABLED=0"],
  pista:"CGO + habilitado.",
  why:"Casi todo el ecosistema Go es Go puro; las excepciones típicas son SQLite con mattn/go-sqlite3 (existe modernc.org/sqlite sin cgo)."}
]}

]});
