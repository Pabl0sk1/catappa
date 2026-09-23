window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Sincronización, context y patrones",
resumen: "WaitGroup, Mutex y RWMutex, Once y sync/atomic, context para cancelar y poner plazos, y los patrones de concurrencia: worker pool, pipelines, fan-in, fan-out y errgroup",
nivel: "Avanzado",
color: "#3ca9c2",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"go4l2",
titulo:"sync: WaitGroup, Mutex y RWMutex",
claves:["WaitGroup espera a un grupo de goroutines; desde Go 1.25, wg.Go lanza y cuenta a la vez","Mutex protege datos compartidos; RWMutex permite muchos lectores o un escritor","Un tipo con mutex no se copia: se usa por puntero (go vet lo avisa)"],
pasos:[
 {t:"info", eti:"Coordinar", h:"WaitGroup y Mutex",
  c:`<div class="termbox">var wg sync.WaitGroup
var mu sync.Mutex
total := 0
for _, p := range pedidos {
    wg.Add(1)                    // SIEMPRE antes de lanzar la goroutine
    go func() {
        defer wg.Done()
        importe := calcular(p)
        mu.Lock()
        total += importe         // sección crítica: lo mínimo posible
        mu.Unlock()
    }()
}
wg.Wait()

// Go 1.25+: lo mismo, sin Add ni Done
for _, p := range pedidos {
    wg.Go(func() { … })
}
wg.Wait()</div>
     <p>Mantén la sección crítica <b>corta</b>: nada de E/S (llamadas HTTP, consultas) con el mutex cogido. Y protege los datos, no el código: el mutex vive junto a lo que protege.</p>`},
 {t:"info", eti:"Buenas prácticas", h:"El mutex dentro del tipo",
  c:`<div class="termbox">type Cache struct {
    mu    sync.RWMutex          // protege datos
    datos map[string]string
}

func (c *Cache) Get(k string) (string, bool) {
    c.mu.RLock()                // muchos lectores a la vez
    defer c.mu.RUnlock()
    v, ok := c.datos[k]
    return v, ok
}

func (c *Cache) Set(k, v string) {
    c.mu.Lock()                 // un solo escritor, sin lectores
    defer c.mu.Unlock()
    c.datos[k] = v
}</div>
     <ul><li>Receptor <b>puntero</b>: si copias el struct, copias el mutex y cada copia se bloquea por su lado. <code>go vet</code> avisa: «passes lock by value».</li>
     <li><b>RWMutex</b> compensa solo si hay muchas más lecturas que escrituras y las lecturas no son triviales; si no, Mutex es igual o más rápido.</li>
     <li>Los mutex de Go <b>no son reentrantes</b>: hacer Lock dos veces en la misma goroutine la bloquea para siempre.</li></ul>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["sync.WaitGroup","Esperar a que terminen varias goroutines"],["sync.Mutex","Acceso exclusivo a datos compartidos"],["sync.RWMutex","Muchos lectores simultáneos o un solo escritor"],["wg.Go(f)","Lanzar f en una goroutine y contarla en el grupo (Go 1.25+)"],["go test -race","Detectar condiciones de carrera"]],
  why:"Canales para pasar datos y coordinar trabajo; mutex para proteger un estado compartido sencillo."},
 {t:"opcion", p:"¿Qué falla en este código?",
  c:`<div class="termbox">for _, u := range urls {
    go func() {
        wg.Add(1)
        defer wg.Done()
        descargar(u)
    }()
}
wg.Wait()</div>`,
  ops:["Nada","wg.Add está dentro de la goroutine: Wait puede ejecutarse antes de que ninguna haya sumado y devolver enseguida","Falta close","u es la misma en todas las iteraciones"],
  ok:1, why:"Add debe llamarse antes del go. Con Go 1.25 wg.Go(func(){…}) evita el problema de raíz. Lo de u ya no ocurre desde Go 1.22."},
 {t:"opcion", p:"<code>go vet</code> avisa: <code>copia passes lock by value: Contador contains sync.Mutex</code>. ¿Qué ocurre?",
  ops:["Es un aviso de estilo","Se está pasando por valor un struct con un mutex: la copia tiene su propio candado y ya no protege nada; hay que usar *Contador","Falta un defer","El mutex no está inicializado"],
  ok:1, why:"El valor cero de sync.Mutex ya está listo para usarse, pero nunca debe copiarse tras su primer uso."},
 {t:"hueco", p:"Completa el contador seguro para goroutines",
  tpl:"type Visitas struct {\n    mu sync.___\n    n  map[string]int\n}\n\nfunc (v ___Visitas) Sumar(ruta string) {\n    v.mu.Lock()\n    ___ v.mu.Unlock()\n    v.n[ruta]++\n}",
  banco:["Mutex","*","defer","WaitGroup","&","go"], sol:["Mutex","*","defer"],
  why:"Receptor puntero para no copiar el mutex, y defer Unlock justo después del Lock."},
 {t:"vf", p:"Un <code>sync.Mutex</code> se puede bloquear dos veces seguidas desde la misma goroutine sin problema.",
  ok:false, why:"No es reentrante: el segundo Lock espera al Unlock, que nunca llegará. Si lo necesitas, reestructura en funciones que asumen el candado ya cogido."}
]},

/* =============== U8 L2 =============== */
{
id:"go8n1",
titulo:"Once, atomic y sync.Map",
claves:["sync.Once y sync.OnceValue ejecutan una inicialización una sola vez, aunque la pidan mil goroutines","sync/atomic ofrece tipos como atomic.Int64 y atomic.Pointer[T] para contadores y banderas sin mutex","sync.Map solo compensa en casos concretos: claves que se escriben una vez y se leen mucho, o goroutines con claves disjuntas"],
pasos:[
 {t:"info", eti:"Una sola vez", h:"sync.Once y OnceValue",
  c:`<div class="termbox">var cargarConfig = sync.OnceValue(func() *Config {   // Go 1.21+
    fmt.Println("cargando")
    return leerConfig()
})

cfg := cargarConfig()     // imprime "cargando" y lee
cfg = cargarConfig()      // devuelve el mismo valor, sin volver a leer

var (
    once sync.Once
    db   *sql.DB
)
func DB() *sql.DB {
    once.Do(func() { db = conectar() })
    return db
}

conexion := sync.OnceValues(func() (*sql.DB, error) { return sql.Open("pgx", dsn) })</div>
     <p>Es la forma segura de inicialización perezosa. Si dos goroutines llaman a la vez, una ejecuta la función y la otra <b>espera</b> a que termine.</p>`},
 {t:"info", eti:"Sin candados", h:"sync/atomic",
  c:`<div class="termbox">type Metricas struct {
    peticiones atomic.Int64
    activo     atomic.Bool
    config     atomic.Pointer[Config]    // cambiar la configuración en caliente
}

m.peticiones.Add(1)
n := m.peticiones.Load()
m.activo.Store(true)
m.config.Store(nuevaCfg)                  // los lectores ven la vieja o la nueva, nunca a medias

var x atomic.Int32
x.CompareAndSwap(0, 5)                    // true: si vale 0, pon 5 (de forma indivisible)</div>
     <p>Los tipos atómicos (Go 1.19+) son más rápidos que un mutex para <b>un único valor</b>. En cuanto hay que mantener coherentes dos valores a la vez (saldo y movimientos), vuelve al mutex: dos operaciones atómicas seguidas no forman una operación atómica.</p>
     <p><b>sync.Map</b>: un map concurrente optimizado para cachés que casi solo crecen o para goroutines que trabajan con claves distintas. Para el resto, un <code>map</code> con <code>sync.RWMutex</code> suele ser más claro e igual de rápido.</p>`},
 {t:"opcion", p:"¿Qué imprime este código con 100 goroutines?",
  c:`<div class="termbox">var wg sync.WaitGroup
var total atomic.Int64
for i := range 100 {
    wg.Go(func() { total.Add(int64(i)) })
}
wg.Wait()
fmt.Println(total.Load())</div>`,
  ops:["Un número distinto cada vez","4950","100","0"],
  ok:1, why:"0 + 1 + … + 99 = 4950. Add es atómica, así que no se pierde ninguna suma. Con un int normal y total += i habría carrera."},
 {t:"opcion", p:"Tienes <code>saldo</code> y <code>movimientos</code> que deben cambiar juntos. ¿Qué usas?",
  ops:["Dos atomic.Int64","Un sync.Mutex que proteja los dos","sync.Map","Un canal con búfer"],
  ok:1, why:"Con dos atómicos, otra goroutine podría ver el saldo nuevo con los movimientos viejos. Una invariante entre varios campos pide un mutex."},
 {t:"par", p:"Empareja cada primitiva con su caso de uso",
  pares:[["sync.OnceValue","Cargar la configuración una sola vez, de forma perezosa"],["atomic.Int64","Un contador de peticiones compartido"],["atomic.Pointer[T]","Cambiar en caliente la configuración que leen muchas goroutines"],["sync.Map","Caché que casi solo crece, leída por muchas goroutines"],["sync.Mutex","Proteger varios campos que cambian juntos"]],
  why:"Elige la primitiva más sencilla que resuelva el problema."},
 {t:"vf", p:"<code>once.Do(f)</code> ejecutará f otra vez si la primera ejecución entró en pánico.",
  ok:false, why:"Para Once, la función ya «se ejecutó» aunque fallara. OnceValue y OnceFunc vuelven a lanzar el mismo pánico en cada llamada."},
 {t:"hueco", p:"Contador de peticiones seguro sin mutex",
  tpl:"var peticiones atomic.___\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    peticiones.___(1)\n}\n\nfunc total() int64 { return peticiones.___() }",
  banco:["Int64","Add","Load","Mutex","Get","Inc"], sol:["Int64","Add","Load"],
  why:"Leer con Load también es necesario: una lectura normal de un valor escrito atómicamente sigue siendo una carrera."},
 {t:"escribe", p:"¿Qué método de los tipos atómicos cambia el valor solo si todavía vale lo esperado? (en inglés)",
  sol:["CompareAndSwap","CompareAndSwap()","CAS"],
  pista:"Comparar e intercambiar.",
  why:"CAS es la base de las estructuras sin bloqueos y de los reintentos optimistas."}
]},

/* =============== U8 L3 =============== */
{
id:"go8n2",
titulo:"context a fondo",
claves:["context propaga cancelación, plazos y valores de petición; se pasa como primer parámetro ctx","WithCancel, WithTimeout y WithDeadline crean contextos hijos; siempre defer cancel()","ctx.Err() dice por qué acabó (Canceled o DeadlineExceeded); WithValue solo para datos de la petición, con claves de tipo propio"],
pasos:[
 {t:"info", eti:"El árbol", h:"Contextos padre e hijos",
  c:`<div class="dg"><div class="dg-tit">cancelar un padre cancela a todos sus hijos</div><div class="dg-vert"><div class="dg-caja acento">r.Context()<small>se cancela si el cliente cierra la conexión</small></div><div class="dg-caja">WithTimeout 2 s<small>para la consulta a la base de datos</small></div><div class="dg-caja">WithTimeout 500 ms<small>para la llamada a otro servicio</small></div></div><div class="dg-nota">gana el plazo más corto de la cadena</div></div>
<div class="termbox">func (h *Handler) Obtener(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
    defer cancel()                               // libera recursos aunque termine antes
    p, err := h.repo.Pedido(ctx, id)             // si el cliente se va o pasan 2 s, se cancela
    if errors.Is(err, context.DeadlineExceeded) {
        http.Error(w, "tardó demasiado", http.StatusGatewayTimeout)
        return
    }
    …
}</div>`},
 {t:"info", eti:"Reglas", h:"Cómo usar context bien",
  c:`<div class="termbox">func Descargar(ctx context.Context, url string) error {   // ctx, el primero
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    …
}

func worker(ctx context.Context, trabajos &lt;-chan Trabajo) {
    for {
        select {
        case &lt;-ctx.Done():                  // canal que se cierra al cancelar
            return
        case t := &lt;-trabajos:
            procesar(ctx, t)
        }
    }
}

type claveID struct{}                        // tipo propio: no choca con otros paquetes
ctx = context.WithValue(ctx, claveID{}, "req-42")
id, _ := ctx.Value(claveID{}).(string)

ctx, cancel := context.WithCancelCause(ctx)  // Go 1.20+: cancelar con motivo
cancel(errors.New("cliente se fue"))
context.Cause(ctx)                           // "cliente se fue"
context.WithoutCancel(ctx)                   // Go 1.21+: hereda valores, no la cancelación</div>
     <ul><li>No guardes el contexto en un struct: pásalo en cada llamada.</li>
     <li>No pases <code>nil</code>: usa <code>context.Background()</code> en main o <code>context.TODO()</code> mientras decides.</li>
     <li><code>WithValue</code> es para datos <b>de la petición</b> (id de traza, usuario autenticado), no para pasar dependencias ni parámetros opcionales.</li>
     <li>Cancelar es cooperativo: el contexto no mata nada; tu código debe mirar <code>ctx.Done()</code> o usar funciones que lo respeten.</li></ul>`},
 {t:"par", p:"Empareja cada función con su uso",
  pares:[["context.WithTimeout","Cancelar el trabajo si tarda más de una duración"],["context.WithDeadline","Cancelar a una hora concreta"],["context.WithCancel","Cancelar a mano llamando a cancel()"],["r.Context()","Contexto que se cancela si el cliente cierra la conexión"],["context.WithoutCancel","Seguir un trabajo aunque la petición original termine"]],
  why:"context se pasa como primer parámetro de las funciones que hacen E/S: es la convención."},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
defer cancel()
&lt;-ctx.Done()
fmt.Println(ctx.Err())</div>`,
  ops:["context canceled","context deadline exceeded","nil","timeout"],
  ok:1, why:"Si vence el plazo, Err() es context.DeadlineExceeded; si alguien llama a cancel() antes, context.Canceled."},
 {t:"opcion", p:"¿Por qué hay que llamar a <code>cancel()</code> aunque la operación termine bien?",
  ops:["No hace falta","Para liberar el temporizador y la referencia del padre al hijo; si no, se acumulan hasta que venza el plazo (go vet avisa de «lost cancel»)","Para que el resultado se guarde","Para cerrar la conexión HTTP"],
  ok:1, why:"defer cancel() justo después de crear el contexto es la costumbre universal."},
 {t:"hueco", p:"Haz que el worker termine cuando se cancele el contexto",
  tpl:"for {\n    select {\n    case <-ctx.___():\n        return ctx.___()\n    case t := <-trabajos:\n        procesar(t)\n    }\n}",
  banco:["Done","Err","Cancel","Close","Value"], sol:["Done","Err"],
  why:"Done() devuelve un canal que se cierra al cancelar; Err() explica el motivo."},
 {t:"vf", p:"Es buena práctica pasar la conexión a la base de datos dentro del contexto con WithValue.",
  ok:false, why:"Las dependencias van en los campos de tu struct o como parámetros explícitos. WithValue oculta el contrato y pierde la comprobación de tipos."},
 {t:"escribe", p:"¿Qué contexto raíz se usa en main o en las pruebas cuando no hay otro?",
  sol:["context.Background()","context.Background","Background()","Background"],
  pista:"El «fondo».",
  why:"En pruebas, desde Go 1.24, t.Context() da uno que se cancela al terminar el test."}
]},

/* =============== U8 L4 =============== */
{
id:"go4l3",
titulo:"Patrones de concurrencia",
claves:["Worker pool: N goroutines leen trabajos de un canal y limitan la concurrencia","Pipeline: etapas unidas por canales; fan-out reparte una etapa entre varias goroutines y fan-in junta sus salidas","errgroup lanza tareas, limita cuántas van a la vez y devuelve el primer error cancelando el resto"],
pasos:[
 {t:"info", eti:"Pool de workers", h:"Concurrencia limitada",
  c:`<div class="dg"><div class="dg-tit">worker pool con fan-out y fan-in</div><div class="dg-flujo"><div class="dg-caja acento">productor<small>trabajos</small></div><div class="dg-caja"><div class="dg-pila"><div class="dg-caja">worker 1</div><div class="dg-caja">worker 2</div><div class="dg-caja">worker 3</div></div></div><div class="dg-caja ok">resultados<small>un solo canal</small></div></div></div>
<div class="termbox">func pool(ctx context.Context, urls []string, n int) []Resultado {
    trabajos := make(chan string)
    resultados := make(chan Resultado)

    var wg sync.WaitGroup
    for range n {                              // fan-out: n workers
        wg.Go(func() {
            for u := range trabajos {
                resultados &lt;- comprobar(ctx, u)
            }
        })
    }
    go func() {                                // cerrar resultados cuando acaben todos
        wg.Wait()
        close(resultados)
    }()
    go func() {                                // productor
        defer close(trabajos)
        for _, u := range urls {
            select {
            case trabajos &lt;- u:
            case &lt;-ctx.Done():
                return
            }
        }
    }()

    var out []Resultado
    for r := range resultados {                // fan-in
        out = append(out, r)
    }
    return out
}</div>`},
 {t:"info", eti:"errgroup", h:"Varias tareas y el primer error",
  c:`<div class="termbox">import "golang.org/x/sync/errgroup"

g, ctx := errgroup.WithContext(ctx)
g.SetLimit(8)                          // como mucho 8 a la vez
for _, url := range urls {
    g.Go(func() error {
        return descargar(ctx, url)     // si una falla, ctx se cancela
    })
}
if err := g.Wait(); err != nil {       // espera a todas; devuelve el primer error
    return err
}

// en otra función: pedir en paralelo datos independientes
var usuario Usuario
var pedidos []Pedido
g, ctx := errgroup.WithContext(ctx)
g.Go(func() (err error) { usuario, err = api.Usuario(ctx, id); return })
g.Go(func() (err error) { pedidos, err = api.Pedidos(ctx, id); return })
err := g.Wait()</div>
     <p>errgroup es el patrón más usado en código de producción: sustituye a WaitGroup + canal de errores + cancelación a mano. Cada goroutine escribe en su propia variable, así que no hace falta mutex.</p>`},
 {t:"par", p:"Empareja cada patrón con su uso",
  pares:[["Worker pool","Procesar muchos trabajos con concurrencia limitada"],["errgroup","Varias tareas en paralelo con cancelación al primer error"],["Fan-in","Unir resultados de varios canales en uno"],["Pipeline","Etapas encadenadas: leer, transformar, guardar"],["Semáforo (canal con búfer)","Limitar cuántas operaciones hay en curso"]],
  why:"Siempre limita la concurrencia: miles de goroutines contra una API externa la saturan."},
 {t:"opcion", p:"Una goroutine espera en un canal que nadie cerrará ni escribirá. ¿Qué ocurre?",
  ops:["Termina sola a los 30 s","Se queda bloqueada para siempre: una fuga de goroutine que consume memoria","El programa la reinicia","Lanza panic"],
  ok:1, why:"Usa context o cierra los canales para que todas las goroutines puedan terminar."},
 {t:"opcion", p:"En el pool de ejemplo, ¿por qué <code>close(resultados)</code> va en una goroutine aparte tras <code>wg.Wait()</code>?",
  ops:["Por estilo","Porque si main esperara con wg.Wait() antes de leer, los workers se bloquearían enviando a resultados y nadie avanzaría (bloqueo mutuo)","Porque close es lento","Porque así se cierra dos veces"],
  ok:1, why:"Alguien tiene que leer mientras se espera. La goroutine «cerradora» espera y cierra; main recorre resultados hasta ese cierre."},
 {t:"orden", p:"Ordena los pasos para usar errgroup con límite",
  items:["g, ctx := errgroup.WithContext(ctx)","g.SetLimit(8)","g.Go(func() error { … }) por cada tarea","err := g.Wait()","si err != nil, devolverlo"],
  why:"SetLimit antes de lanzar tareas; Go bloquea si ya hay 8 en marcha."},
 {t:"hueco", p:"Descarga todas las páginas en paralelo, como mucho 4 a la vez",
  tpl:"g, ctx := errgroup.___(ctx)\ng.SetLimit(4)\nfor _, p := range paginas {\n    g.___(func() error {\n        return bajar(ctx, p)\n    })\n}\nreturn g.___()",
  banco:["WithContext","Go","Wait","Run","Done","New"], sol:["WithContext","Go","Wait"],
  why:"errgroup vive en golang.org/x/sync, mantenido por el equipo de Go."},
 {t:"opcion", p:"¿Qué es una fuga de goroutines y cómo se detecta en producción?",
  ops:["Un error de compilación","Goroutines bloqueadas para siempre que se acumulan; se ve en la métrica go_goroutines creciendo sin parar y en el perfil de goroutines de pprof","Un tipo de canal","Una goroutine muy rápida"],
  ok:1, why:"Si el número de goroutines solo sube con el tráfico y nunca baja, hay una fuga. pprof dice exactamente en qué línea están bloqueadas."}
]}

]});
