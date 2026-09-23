window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Servicios HTTP y datos",
resumen: "Servidor con net/http y ServeMux con patrones, timeouts y apagado elegante, middlewares, JSON, cliente HTTP bien configurado y database/sql",
nivel: "Experto",
color: "#36a1ba",
lecciones: [

/* =============== U10 L1 =============== */
{
id:"go5l1",
titulo:"Un servicio HTTP con net/http",
claves:["ServeMux entiende método, comodines {id}, {ruta...} y {$} desde Go 1.22; r.PathValue lee los parámetros","Un http.Server con ReadHeaderTimeout, ReadTimeout, WriteTimeout e IdleTimeout, nunca ListenAndServe a pelo","Apagado elegante: signal.NotifyContext + srv.Shutdown(ctx)"],
pasos:[
 {t:"info", eti:"Sin frameworks", h:"Rutas con la librería estándar",
  c:`<div class="termbox">mux := http.NewServeMux()
mux.HandleFunc("GET /api/tareas/{id}", obtenerTarea)
mux.HandleFunc("POST /api/tareas", crearTarea)
mux.HandleFunc("GET /api/tareas/nuevas", nuevas)      // gana al {id}: es más específica
mux.HandleFunc("GET /estaticos/{ruta...}", estaticos) // {ruta...} = el resto de la ruta
mux.HandleFunc("GET /{$}", inicio)                    // solo "/" exacto, no todo

func obtenerTarea(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(r.PathValue("id"))
    if err != nil {
        http.Error(w, "id no válido", http.StatusBadRequest)
        return
    }
    …
}</div>
<div class="dg dg-tabla-caja"><div class="dg-tit">qué responde el mux</div><table class="dg-tabla"><thead><tr><th>petición</th><th>resultado</th></tr></thead><tbody>
<tr><td><code>GET /api/tareas/7</code></td><td>200, id = "7"</td></tr>
<tr><td><code>DELETE /api/tareas/7</code></td><td>405 con cabecera <code>Allow: GET, HEAD</code></td></tr>
<tr><td><code>HEAD /api/tareas/7</code></td><td>200: GET también atiende HEAD</td></tr>
<tr><td><code>GET /estaticos/css/app.css</code></td><td>ruta = "css/app.css"</td></tr>
<tr><td><code>GET /otra</code></td><td>404</td></tr>
</tbody></table></div>
     <p>Dos patrones que se solapan sin que uno sea más específico hacen que el registro entre en pánico al arrancar: los conflictos se ven enseguida, no en producción.</p>`},
 {t:"info", eti:"Producción", h:"Timeouts y apagado elegante",
  c:`<div class="termbox">func main() {
    ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
    defer stop()

    srv := &amp;http.Server{
        Addr:              ":8080",
        Handler:           mux,
        ReadHeaderTimeout: 5 * time.Second,     // contra Slowloris
        ReadTimeout:       10 * time.Second,
        WriteTimeout:      15 * time.Second,
        IdleTimeout:       60 * time.Second,
    }
    go func() {
        if err := srv.ListenAndServe(); err != nil &amp;&amp; !errors.Is(err, http.ErrServerClosed) {
            log.Fatal(err)
        }
    }()

    &lt;-ctx.Done()                                   // llega SIGTERM (Kubernetes, docker stop)
    apagar, cancel := context.WithTimeout(context.Background(), 20*time.Second)
    defer cancel()
    srv.Shutdown(apagar)          // deja de aceptar y espera a las peticiones en curso
}</div>
     <p><code>http.ListenAndServe(":8080", mux)</code> no tiene <b>ningún</b> timeout: un cliente lento puede mantener conexiones abiertas indefinidamente. Tras <code>Shutdown</code>, ListenAndServe devuelve <code>http.ErrServerClosed</code>, que no es un fallo.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["\"GET /api/tareas/{id}\"","Patrón con método y parámetro de ruta (Go 1.22+)"],["r.PathValue(\"id\")","Leer el parámetro de la ruta"],["\"GET /{$}\"","Solo la raíz exacta"],["srv.Shutdown(ctx)","Terminar las peticiones en curso antes de salir"],["ReadHeaderTimeout","Protegerse de clientes que envían cabeceras muy despacio"]],
  why:"Lo mismo que en Spring y Node: timeouts y apagado elegante son obligatorios en producción."},
 {t:"opcion", p:"Registras solo <code>\"GET /api/tareas/{id}\"</code>. ¿Qué responde el mux a <code>DELETE /api/tareas/7</code>?",
  ops:["404 Not Found","405 Method Not Allowed con la cabecera Allow: GET, HEAD","200 con el handler de GET","500"],
  ok:1, why:"Desde Go 1.22 el ServeMux sabe que la ruta existe con otro método y responde 405 correctamente."},
 {t:"hueco", p:"Registra la ruta y lee el parámetro",
  tpl:"mux.HandleFunc(\"___ /api/usuarios/{nombre}\", func(w http.ResponseWriter, r *http.Request) {\n    nombre := r.___(\"nombre\")\n    fmt.Fprintf(w, \"Hola, %s\", nombre)\n})",
  banco:["GET","PathValue","FormValue","Param","URL","POST"], sol:["GET","PathValue"],
  why:"FormValue lee la query o el formulario; PathValue, los comodines del patrón."},
 {t:"opcion", p:"¿Por qué el ejemplo comprueba <code>!errors.Is(err, http.ErrServerClosed)</code> tras ListenAndServe?",
  ops:["Por estilo","Porque después de Shutdown, ListenAndServe siempre devuelve ErrServerClosed y no queremos tratar un apagado normal como un fallo","Porque ListenAndServe nunca devuelve error","Para reintentar"],
  ok:1, why:"Cualquier otro error (puerto ocupado, permisos) sí es fatal."},
 {t:"vf", p:"Para una API REST en Go siempre hace falta un framework externo.",
  ok:false, why:"Desde Go 1.22 net/http cubre métodos y parámetros de ruta; chi, Gin o Echo añaden comodidades, pero ya no son imprescindibles."},
 {t:"escribe", p:"¿Qué función de <code>os/signal</code> devuelve un contexto que se cancela al recibir SIGTERM?",
  sol:["signal.NotifyContext","NotifyContext"],
  pista:"Notify + Context.",
  why:"Más cómoda que signal.Notify con un canal: encaja directamente con context y Shutdown."}
]},

/* =============== U10 L2 =============== */
{
id:"go10n1",
titulo:"Handlers y middlewares",
claves:["http.Handler es una interfaz con ServeHTTP; http.HandlerFunc convierte una función en Handler","Un middleware es func(http.Handler) http.Handler: envuelve al siguiente y hace algo antes y después","Para saber el código de respuesta hay que envolver el ResponseWriter; los datos de la petición viajan en r.Context()"],
pasos:[
 {t:"info", eti:"La interfaz", h:"Handler y HandlerFunc",
  c:`<div class="termbox">type Handler interface {
    ServeHTTP(http.ResponseWriter, *http.Request)
}

type HandlerFunc func(http.ResponseWriter, *http.Request)   // un tipo función…
func (f HandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) { f(w, r) }  // …con método

type API struct {                     // handlers como métodos: dependencias en el struct
    repo   *Repo
    logger *slog.Logger
}
func (a *API) Rutas() http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /api/tareas/{id}", a.obtener)
    return mux
}</div>
     <p><code>HandlerFunc</code> es el truco que hace que cualquier función con la firma correcta sea un Handler: un tipo función con un método. Lo verás en muchas librerías.</p>`},
 {t:"info", eti:"Capas", h:"Middlewares",
  c:`<div class="dg"><div class="dg-tit">una petición atraviesa las capas y vuelve</div><div class="dg-flujo"><div class="dg-caja base">petición</div><div class="dg-caja">Recuperar</div><div class="dg-caja">Registrar</div><div class="dg-caja">Autenticar</div><div class="dg-caja acento">mux → handler</div></div></div>
<div class="termbox">type estadoWriter struct {
    http.ResponseWriter
    codigo int
}
func (e *estadoWriter) WriteHeader(c int) { e.codigo = c; e.ResponseWriter.WriteHeader(c) }

func Registrar(l *slog.Logger) func(http.Handler) http.Handler {
    return func(sig http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            inicio := time.Now()
            ew := &amp;estadoWriter{ResponseWriter: w, codigo: http.StatusOK}
            sig.ServeHTTP(ew, r)                              // la petición sigue
            l.Info("petición", "metodo", r.Method, "ruta", r.URL.Path,
                "codigo", ew.codigo, "duracion", time.Since(inicio))
        })
    }
}

handler := Recuperar(Registrar(logger)(Autenticar(mux)))   // la primera en la lista, la más externa

// datos de la petición en el contexto
ctx := context.WithValue(r.Context(), claveUsuario{}, usuario)
sig.ServeHTTP(w, r.WithContext(ctx))</div>
     <p>Otros de la librería estándar: <code>http.TimeoutHandler</code>, <code>http.StripPrefix</code>, <code>http.MaxBytesHandler</code> y, desde Go 1.25, <code>http.CrossOriginProtection</code> contra CSRF.</p>`},
 {t:"opcion", p:"¿Por qué el middleware de registro envuelve el ResponseWriter?",
  ops:["Para comprimir la respuesta","Porque ResponseWriter no permite leer qué código se envió: el envoltorio intercepta WriteHeader y lo guarda","Para cambiar el cuerpo","Porque es obligatorio"],
  ok:1, why:"Si el handler no llama a WriteHeader, el código es 200: por eso el envoltorio empieza con 200."},
 {t:"orden", p:"Con <code>Recuperar(Registrar(Autenticar(mux)))</code>, ordena qué se ejecuta primero al llegar una petición",
  items:["Recuperar","Registrar","Autenticar","mux y el handler"],
  why:"El más externo recibe primero la petición y termina el último: así Recuperar captura los pánicos de todo lo de dentro."},
 {t:"hueco", p:"Completa un middleware que exige una cabecera de API",
  tpl:"func ExigirClave(sig http.Handler) http.___ {\n    return http.___(func(w http.ResponseWriter, r *http.Request) {\n        if r.Header.Get(\"X-API-Key\") == \"\" {\n            http.Error(w, \"falta la clave\", http.StatusUnauthorized)\n            ___\n        }\n        sig.ServeHTTP(w, r)\n    })\n}",
  banco:["Handler","HandlerFunc","return","break","Func","ServeMux"], sol:["Handler","HandlerFunc","return"],
  why:"Sin return, el handler seguiría y escribiría una segunda respuesta (y Go avisaría de «superfluous WriteHeader call»)."},
 {t:"vf", p:"Un middleware puede pasar datos al handler (el usuario autenticado) mediante el contexto de la petición.",
  ok:true, why:"r.WithContext(ctx) crea una copia de la petición con el contexto nuevo. Usa una clave de tipo propio y una función para leerla con tipo."},
 {t:"par", p:"Empareja cada elemento con su papel",
  pares:[["http.Handler","Interfaz con el método ServeHTTP"],["http.HandlerFunc","Adaptador de función a Handler"],["func(http.Handler) http.Handler","Firma de un middleware"],["r.WithContext(ctx)","Petición con un contexto nuevo"],["http.TimeoutHandler","Cortar handlers que tardan demasiado con un 503"]],
  why:"chi, alice y compañía solo ayudan a encadenar esta misma firma estándar."},
 {t:"escribe", p:"¿Qué método tiene la interfaz <code>http.Handler</code>?",
  sol:["ServeHTTP","ServeHTTP()","ServeHTTP(w, r)"],
  pista:"Servir HTTP.",
  why:"Todo en net/http gira alrededor de esa única interfaz de un método."}
]},

/* =============== U10 L3 =============== */
{
id:"go10n2",
titulo:"JSON con encoding/json",
claves:["Solo se serializan los campos exportados; las etiquetas json controlan nombre, omitempty, omitzero y -","Al leer peticiones: json.NewDecoder, límite de tamaño con http.MaxBytesReader y DisallowUnknownFields si quieres ser estricto","Trampas: slice nil sale como null, los números en any son float64, y las claves se emparejan sin distinguir mayúsculas"],
pasos:[
 {t:"info", eti:"Serializar", h:"Etiquetas y sus efectos",
  c:`<div class="termbox">type Tarea struct {
    ID        int       \`json:"id"\`
    Titulo    string    \`json:"titulo"\`
    Etiquetas []string  \`json:"etiquetas"\`
    Nota      string    \`json:"nota,omitempty"\`   // se omite si ""
    Vence     time.Time \`json:"vence,omitzero"\`   // Go 1.24+: se omite si es el valor cero
    Clave     string    \`json:"-"\`                // nunca se serializa
    secreto   string                              // minúscula: invisible para json
}

b, _ := json.Marshal(Tarea{ID: 1, Titulo: "a"})
// {"id":1,"titulo":"a","etiquetas":null}</div>
     <ul><li><code>Etiquetas</code> nil sale como <code>null</code>; para <code>[]</code> inicialízala a <code>[]string{}</code>.</li>
     <li><code>omitempty</code> no omite un <code>time.Time</code> vacío (es un struct): por eso llegó <code>omitzero</code>.</li>
     <li><code>time.Time</code> se escribe en RFC 3339; <code>[]byte</code>, en base64.</li>
     <li>Tipos propios pueden implementar <code>MarshalJSON</code>/<code>UnmarshalJSON</code>; <code>json.RawMessage</code> retrasa el parseo de un trozo.</li>
     <li>Go 1.25 incluye <code>encoding/json/v2</code> como experimento (<code>GOEXPERIMENT=jsonv2</code>), más rápido y estricto.</li></ul>`},
 {t:"info", eti:"Leer peticiones", h:"Decodificar sin sustos",
  c:`<div class="termbox">func (a *API) crear(w http.ResponseWriter, r *http.Request) {
    r.Body = http.MaxBytesReader(w, r.Body, 1&lt;&lt;20)     // como mucho 1 MB
    dec := json.NewDecoder(r.Body)
    dec.DisallowUnknownFields()                        // "otro" → error
    var in CrearTarea
    if err := dec.Decode(&amp;in); err != nil {
        http.Error(w, "JSON no válido: "+err.Error(), http.StatusBadRequest)
        return
    }
    t, err := a.servicio.Crear(r.Context(), in)
    …
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(t)
}</div>
     <p>Usa structs separados para la <b>entrada</b> (<code>CrearTarea</code>) y la <b>salida</b>: así un cliente no puede fijar el <code>ID</code> ni campos internos enviándolos en el JSON (asignación masiva).</p>`},
 {t:"opcion", p:"¿Qué produce <code>json.Marshal(Tarea{ID: 1, Titulo: \"a\"})</code> con el struct del ejemplo?",
  ops:["{\"id\":1,\"titulo\":\"a\"}","{\"id\":1,\"titulo\":\"a\",\"etiquetas\":null}","{\"id\":1,\"titulo\":\"a\",\"etiquetas\":[],\"nota\":\"\"}","{\"ID\":1,\"Titulo\":\"a\"}"],
  ok:1, why:"Etiquetas no tiene omitempty y es nil: sale null. Nota y Vence se omiten; Clave y secreto no aparecen nunca."},
 {t:"opcion", p:"Deserializas <code>{\"n\": 42}</code> en un <code>map[string]any</code>. ¿De qué tipo es <code>m[\"n\"]</code>?",
  ops:["int","float64","json.Number","string"],
  ok:1, why:"Sin un tipo destino, todos los números JSON pasan a float64. Con dec.UseNumber() serían json.Number. Mejor aún: usa structs."},
 {t:"hueco", p:"Etiqueta el struct para que el campo se llame «email» y se omita si está vacío",
  tpl:"type Contacto struct {\n    Email string `json:\"email,___\"`\n    Hash  string `json:\"___\"`\n}",
  banco:["omitempty","-","omitnull","hidden","ignore"], sol:["omitempty","-"],
  why:"El guion excluye el campo por completo: útil para hashes de contraseñas que nunca deben salir en una respuesta."},
 {t:"vf", p:"Por defecto, <code>json.Unmarshal</code> devuelve error si el JSON trae campos que el struct no tiene.",
  ok:false, why:"Los ignora sin decir nada. Para rechazarlos: json.NewDecoder + DisallowUnknownFields. Además empareja claves sin distinguir mayúsculas (\"TITULO\" rellena Titulo)."},
 {t:"opcion", p:"Un atacante envía un cuerpo JSON de 2 GB a tu endpoint. ¿Qué lo evita?",
  ops:["Nada, Go lo gestiona","http.MaxBytesReader (o http.MaxBytesHandler): corta la lectura al superar el límite","DisallowUnknownFields","El ReadHeaderTimeout"],
  ok:1, why:"Sin límite, Decode intentaría leerlo entero en memoria."},
 {t:"escribe", p:"¿Qué opción de etiqueta, añadida en Go 1.24, omite un campo cuando tiene su valor cero (incluidos structs como time.Time)?",
  sol:["omitzero"],
  pista:"omit + zero.",
  why:"También respeta un método IsZero() bool si el tipo lo tiene."}
]},

/* =============== U10 L4 =============== */
{
id:"go10n3",
titulo:"El cliente HTTP",
claves:["http.DefaultClient no tiene timeout: crea un http.Client con Timeout y reutilízalo","Cierra siempre resp.Body (y léelo hasta el final) para liberar y reutilizar la conexión","Un 404 o un 500 no es un error de Go: comprueba resp.StatusCode; pasa el contexto con NewRequestWithContext"],
pasos:[
 {t:"info", eti:"Llamar a otros", h:"Un cliente bien hecho",
  c:`<div class="termbox">var cliente = &amp;http.Client{Timeout: 10 * time.Second}   // uno, compartido

func (c *ClienteTiempo) Actual(ctx context.Context, ciudad string) (*Tiempo, error) {
    u := c.base + "/v1/tiempo?ciudad=" + url.QueryEscape(ciudad)
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
    if err != nil {
        return nil, err
    }
    req.Header.Set("Accept", "application/json")

    resp, err := cliente.Do(req)
    if err != nil {
        return nil, fmt.Errorf("llamar al servicio del tiempo: %w", err)   // red, timeout, DNS
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        io.Copy(io.Discard, io.LimitReader(resp.Body, 1&lt;&lt;16))     // vaciar para reutilizar
        return nil, fmt.Errorf("servicio del tiempo: estado %d", resp.StatusCode)
    }
    var t Tiempo
    if err := json.NewDecoder(resp.Body).Decode(&amp;t); err != nil {
        return nil, fmt.Errorf("decodificar tiempo: %w", err)
    }
    return &amp;t, nil
}</div>
     <p>El <code>http.Client</code> mantiene un <b>pool de conexiones</b> (su Transport). Crear uno por petición tira ese pool y abre una conexión TCP y TLS cada vez. Es seguro para usarlo desde muchas goroutines.</p>`},
 {t:"par", p:"Empareja cada error de novato con su consecuencia",
  pares:[["Usar http.Get sin timeout","Goroutines colgadas para siempre si el otro servicio no responde"],["No cerrar resp.Body","Fugas de conexiones y descriptores de fichero"],["Crear un http.Client por petición","Sin reutilizar conexiones: más latencia y puertos agotados"],["No mirar StatusCode","Tratar un 500 con HTML como si fuera el JSON esperado"],["No pasar el contexto","La llamada sigue aunque el cliente original ya se haya ido"]],
  why:"Estos cinco explican una gran parte de los incidentes de servicios Go que llaman a otros."},
 {t:"opcion", p:"<code>resp, err := cliente.Do(req)</code> devuelve <code>err == nil</code> y <code>resp.StatusCode == 503</code>. ¿Qué significa?",
  ops:["Que Go tiene un bug","Que la petición HTTP se completó: err solo indica fallos de transporte (red, DNS, timeout); el 503 lo tienes que tratar tú","Que hay que reintentar siempre","Que el cuerpo está vacío"],
  ok:1, why:"Para Go, recibir una respuesta, sea cual sea el código, es un éxito del transporte."},
 {t:"hueco", p:"Haz la petición con el contexto de la petición entrante y cierra el cuerpo",
  tpl:"req, err := http.NewRequest___(ctx, http.MethodGet, u, nil)\nif err != nil {\n    return err\n}\nresp, err := cliente.___(req)\nif err != nil {\n    return err\n}\n___ resp.Body.Close()",
  banco:["WithContext","Do","defer","Get","go","Context"], sol:["WithContext","Do","defer"],
  why:"Si el cliente original cancela, la llamada saliente también se cancela: no se gasta trabajo en vano."},
 {t:"vf", p:"<code>http.DefaultClient</code> tiene un timeout razonable por defecto.",
  ok:false, why:"Su Timeout es 0: sin límite. Por eso nunca se usa http.Get en código de producción."},
 {t:"opcion", p:"Tu servicio llama 500 veces por segundo al mismo host y ves muchas conexiones en TIME_WAIT. ¿Qué ajustas primero?",
  ops:["Subir el Timeout","Asegurar que cierras y vacías resp.Body, y subir Transport.MaxIdleConnsPerHost (por defecto 2)","Crear más clientes","Usar HTTP/1.0"],
  ok:1, why:"Con solo 2 conexiones ociosas por host, el resto se cierra tras cada uso y se abren otras nuevas."},
 {t:"escribe", p:"¿Qué función del paquete <code>url</code> escapa un valor para ponerlo en la query string?",
  sol:["url.QueryEscape","QueryEscape"],
  pista:"Query + Escape.",
  why:"Para varias claves, url.Values{...}.Encode() construye la query completa."}
]},

/* =============== U10 L5 =============== */
{
id:"go10n4",
titulo:"database/sql",
claves:["sql.DB es un pool de conexiones seguro para goroutines, no una conexión: se crea una vez","QueryContext + defer rows.Close() + rows.Err(); QueryRowContext + Scan; ExecContext para escribir","Parámetros con marcadores ($1 o ?), nunca concatenando; transacciones con BeginTx y defer tx.Rollback()"],
pasos:[
 {t:"info", eti:"Conectar", h:"El pool y las consultas",
  c:`<div class="termbox">import (
    "database/sql"
    _ "github.com/jackc/pgx/v5/stdlib"      // registra el driver "pgx"
)

db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))   // no conecta todavía
if err != nil { return err }
if err := db.PingContext(ctx); err != nil { return err }  // ahora sí
db.SetMaxOpenConns(20)
db.SetMaxIdleConns(10)
db.SetConnMaxLifetime(30 * time.Minute)

rows, err := db.QueryContext(ctx,
    "SELECT id, titulo, hecha FROM tareas WHERE usuario_id = $1 ORDER BY id", uid)
if err != nil { return nil, err }
defer rows.Close()                          // devuelve la conexión al pool
var tareas []Tarea
for rows.Next() {
    var t Tarea
    if err := rows.Scan(&amp;t.ID, &amp;t.Titulo, &amp;t.Hecha); err != nil { return nil, err }
    tareas = append(tareas, t)
}
return tareas, rows.Err()                   // errores ocurridos durante la iteración</div>
     <p>Las columnas que admiten NULL se leen en <code>sql.NullString</code>, <code>sql.Null[T]</code> (Go 1.22+) o en un puntero <code>*string</code>. Si no, Scan falla al encontrar un NULL.</p>`},
 {t:"info", eti:"Escribir", h:"Exec y transacciones",
  c:`<div class="termbox">func (r *Repo) Transferir(ctx context.Context, de, a int64, importe int64) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil { return err }
    defer tx.Rollback()      // no hace nada si ya se hizo Commit

    res, err := tx.ExecContext(ctx,
        "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 AND saldo &gt;= $1", importe, de)
    if err != nil { return err }
    if n, _ := res.RowsAffected(); n == 0 {
        return ErrSinSaldo
    }
    if _, err := tx.ExecContext(ctx,
        "UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2", importe, a); err != nil {
        return err
    }
    return tx.Commit()
}</div>
     <p>En el ecosistema Go se prefiere SQL explícito a los ORM: <b>sqlc</b> genera código Go con tipos a partir de tus consultas .sql; <b>pgx</b> en modo nativo da más rendimiento con PostgreSQL. Las migraciones, con herramientas como goose, golang-migrate o atlas.</p>`},
 {t:"opcion", p:"¿Qué hace exactamente <code>sql.Open(\"pgx\", dsn)</code>?",
  ops:["Abre una conexión y la devuelve","Prepara el pool y valida los argumentos, pero no conecta: los errores de red aparecen en el primer uso o con PingContext","Crea la base de datos","Ejecuta las migraciones"],
  ok:1, why:"Por eso se llama a PingContext al arrancar: para fallar pronto si la base de datos no está."},
 {t:"opcion", p:"El servicio se queda sin conexiones del pool tras unas horas y todas las peticiones esperan. ¿Causa más probable?",
  ops:["Pocas conexiones configuradas","Algún camino de código hace QueryContext sin rows.Close(), así que esas conexiones nunca vuelven al pool","PostgreSQL está caído","Falta SetConnMaxLifetime"],
  ok:1, why:"defer rows.Close() justo después de comprobar el error de QueryContext. db.Stats() muestra InUse y WaitCount para diagnosticarlo."},
 {t:"hueco", p:"Lee un solo usuario y distingue «no existe»",
  tpl:"err := db.QueryRowContext(ctx, \"SELECT nombre FROM usuarios WHERE id = $1\", id).___(&nombre)\nif errors.Is(err, sql.___) {\n    return \"\", ErrNoEncontrado\n}",
  banco:["Scan","ErrNoRows","Next","ErrNotFound","Exec","Get"], sol:["Scan","ErrNoRows"],
  why:"QueryRow retrasa el error hasta Scan. sql.ErrNoRows se traduce a un centinela propio para no filtrar database/sql a otras capas."},
 {t:"vf", p:"<code>db.QueryContext(ctx, \"SELECT * FROM t WHERE nombre = '\" + nombre + \"'\")</code> es seguro si validas que nombre no tiene comillas.",
  ok:false, why:"Es inyección SQL esperando a pasar. Usa siempre marcadores ($1 en PostgreSQL, ? en MySQL y SQLite) y pasa los valores aparte."},
 {t:"orden", p:"Ordena los pasos de una transacción correcta",
  items:["tx, err := db.BeginTx(ctx, nil)","defer tx.Rollback()","tx.ExecContext(...) para cada cambio","return tx.Commit()"],
  why:"El Rollback diferido protege todos los return de error intermedios; tras un Commit correcto no hace nada."},
 {t:"par", p:"Empareja cada método con su uso",
  pares:[["QueryContext","Varias filas: se recorre con rows.Next()"],["QueryRowContext","Una sola fila: se lee con Scan"],["ExecContext","INSERT, UPDATE o DELETE sin leer filas"],["BeginTx","Empezar una transacción"],["PingContext","Comprobar que la base de datos responde"]],
  why:"Todas llevan Context: si la petición HTTP se cancela, la consulta también."}
]}

]});
