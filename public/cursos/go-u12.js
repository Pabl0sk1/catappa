window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Maestría en Go",
resumen: "Estructura de proyectos y diseño idiomático, un servicio completo decisión a decisión, incidentes reales de producción y simulacro de entrevista",
nivel: "Maestro",
color: "#3199b2",
lecciones: [

/* =============== U12 L1 =============== */
{
id:"go12n1",
titulo:"Estructura de proyectos y diseño idiomático",
claves:["cmd/ para los ejecutables, internal/ para el resto; paquetes por dominio, no por capa técnica","main es fino: lee la configuración, crea las dependencias y las inyecta por constructor","Valor cero útil, interfaces pequeñas en el consumidor, sin estado global y «un poco de copia es mejor que una dependencia»"],
pasos:[
 {t:"info", eti:"Organizar", h:"Un servicio de tamaño medio",
  c:`<div class="dg dg-arbol"><div class="dg-tit">estructura habitual</div>
<div class="rama" style="--n:0"><span class="nom carpeta">pedidos/</span><span class="coment">github.com/tienda/pedidos</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">cmd/</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">api/</span><span class="coment">main.go: cablea todo y arranca el servidor</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">migrar/</span><span class="coment">otro ejecutable del mismo módulo</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">internal/</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">pedido/</span><span class="coment">dominio: tipos, reglas, servicio</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">pago/</span><span class="coment">cliente del proveedor de pagos</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">postgres/</span><span class="coment">implementación de los repositorios</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">httpapi/</span><span class="coment">handlers, middlewares, rutas</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">migrations/</span></div>
<div class="rama" style="--n:1"><span class="nom">go.mod</span></div>
<div class="rama" style="--n:1"><span class="nom">Dockerfile</span></div>
</div>
     <p>No existe un layout oficial: el repositorio «golang-standards/project-layout» <b>no</b> es un estándar del equipo de Go. Empieza con un solo paquete y divide cuando duela. <code>pkg/</code> no es obligatorio; <code>internal/</code> sí aporta algo real. Evita paquetes <code>models</code>, <code>utils</code> o <code>controllers</code> que agrupan por tipo técnico y acaban importándose entre todos.</p>`},
 {t:"info", eti:"main", h:"Cablear dependencias a mano",
  c:`<div class="termbox">func main() {
    if err := run(context.Background(), os.Getenv, os.Stdout); err != nil {
        fmt.Fprintln(os.Stderr, err)
        os.Exit(1)
    }
}

func run(ctx context.Context, getenv func(string) string, out io.Writer) error {
    ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
    defer stop()
    cfg, err := config.Cargar(getenv)
    if err != nil { return err }
    logger := slog.New(slog.NewJSONHandler(out, nil))
    db, err := postgres.Abrir(ctx, cfg.DatabaseURL)
    if err != nil { return err }
    defer db.Close()

    repo := postgres.NuevoRepoPedidos(db)
    pagos := pago.NuevoCliente(cfg.PagosURL, &amp;http.Client{Timeout: 5 * time.Second})
    svc := pedido.NuevoServicio(repo, pagos, logger)
    api := httpapi.Nueva(svc, logger)
    return servir(ctx, cfg.Puerto, api)
}</div>
     <p>Sin frameworks de inyección: <b>constructores</b> que reciben lo que necesitan. Una función <code>run</code> que devuelve error (en vez de <code>log.Fatal</code> por todas partes) se puede probar y ejecuta los defer.</p>`},
 {t:"opcion", p:"Un compañero propone crear <code>internal/models</code>, <code>internal/services</code> e <code>internal/repositories</code>. ¿Qué le comentas?",
  ops:["Perfecto, es lo estándar","En Go suele funcionar mejor agrupar por dominio (pedido, pago, cliente): los paquetes por capa técnica tienden a depender todos de todos y a crear ciclos","Mejor meterlo todo en main","Mejor usar pkg/"],
  ok:1, why:"El nombre del paquete forma parte de cada llamada: pedido.Servicio se lee mejor que services.PedidoService."},
 {t:"par", p:"Empareja cada proverbio o principio de Go con su significado práctico",
  pares:[["Haz que el valor cero sea útil","sync.Mutex{} o bytes.Buffer{} funcionan sin inicializar"],["Un poco de copia es mejor que una dependencia","No importes una librería por una función de diez líneas"],["Cuanto más grande la interfaz, más débil la abstracción","Interfaces de uno o dos métodos"],["Claro es mejor que ingenioso","Código aburrido y fácil de revisar"],["No compartas memoria para comunicar","Pasar datos por canales en vez de compartir variables"]],
  why:"Son los «Go Proverbs» de Rob Pike: salen en revisiones de código y en entrevistas."},
 {t:"opcion", p:"¿Por qué el ejemplo recibe <code>getenv</code> como parámetro en lugar de llamar a <code>os.Getenv</code> dentro de <code>run</code>?",
  ops:["Por rendimiento","Para poder probar run con una configuración controlada, sin tocar las variables de entorno reales del proceso","Porque os.Getenv está obsoleto","Por estilo de gofmt"],
  ok:1, why:"Todo lo que viene de fuera (entorno, reloj, salida, argumentos) se inyecta: así la prueba de extremo a extremo llama a run directamente."},
 {t:"vf", p:"Es idiomático guardar la conexión a la base de datos en una variable global del paquete para no pasarla por todas partes.",
  ok:false, why:"El estado global complica las pruebas y oculta dependencias. Se guarda en el struct que la usa (el repositorio) y se inyecta desde main."},
 {t:"hueco", p:"Completa el constructor con dependencias explícitas",
  tpl:"type Servicio struct {\n    repo  RepoPedidos\n    pagos Cobrador\n    log   *slog.Logger\n}\n\nfunc ___(repo RepoPedidos, pagos Cobrador, log *slog.Logger) ___Servicio {\n    return &Servicio{repo: repo, pagos: pagos, log: log}\n}",
  banco:["NuevoServicio","*","&","init","Servicio"], sol:["NuevoServicio","*"],
  why:"RepoPedidos y Cobrador son interfaces pequeñas definidas en este paquete; el constructor devuelve el tipo concreto."},
 {t:"escribe", p:"¿En qué carpeta se colocan por convención los paquetes main de cada ejecutable de un módulo?",
  sol:["cmd","cmd/","cmd/<nombre>"],
  pista:"De command.",
  why:"cmd/api/main.go, cmd/worker/main.go… Se instalan con go install ./cmd/..."}
]},

/* =============== U12 L2 =============== */
{
id:"go12n2",
titulo:"Caso completo: un servicio de notificaciones",
claves:["Recibir por HTTP, persistir primero y enviar en segundo plano con un pool de workers limitado","Timeouts en cada llamada saliente, reintentos con espera exponencial e idempotencia","Apagado ordenado: dejar de aceptar, vaciar los workers con plazo y cerrar recursos en orden inverso"],
pasos:[
 {t:"info", eti:"El encargo", h:"Requisitos",
  c:`<p>Construye un servicio que reciba peticiones <code>POST /v1/notificaciones</code> (email o push), responda enseguida y las envíe a proveedores externos. Picos de 2.000 peticiones por segundo, los proveedores a veces tardan 10 s o fallan, y no se puede perder ni duplicar ninguna notificación.</p>
<div class="dg"><div class="dg-tit">diseño propuesto</div><div class="dg-flujo"><div class="dg-caja base">cliente</div><div class="dg-caja">handler<small>valida y guarda</small></div><div class="dg-caja acento">PostgreSQL<small>estado: pendiente</small></div><div class="dg-caja">despachador<small>reclama lotes</small></div><div class="dg-caja">pool de N workers<small>timeout y reintento</small></div><div class="dg-caja ok">proveedor</div></div></div>
     <ul><li>El handler guarda la notificación como <b>pendiente</b> y responde <b>202 Accepted</b>: la petición no espera al proveedor.</li>
     <li>Un despachador reclama lotes con <code>SELECT … FOR UPDATE SKIP LOCKED</code> (varias réplicas sin pisarse) y los pasa a un canal.</li>
     <li>N workers envían con <code>context.WithTimeout</code>; si falla, reintento con espera exponencial y jitter; tras X intentos, estado <b>fallida</b>.</li>
     <li>Una <b>clave de idempotencia</b> enviada por el cliente evita duplicados si reintenta la petición.</li></ul>`},
 {t:"opcion", p:"¿Por qué no enviar la notificación directamente dentro del handler HTTP?",
  ops:["Porque Go no lo permite","Porque la latencia y los fallos del proveedor pasarían al cliente, y un pico de 2.000/s abriría miles de llamadas lentas simultáneas; guardando primero se desacopla y se limita la concurrencia","Porque es más lento compilar","Porque los handlers no pueden hacer E/S"],
  ok:1, why:"Persistir antes de responder garantiza que nada se pierde aunque el proceso se caiga justo después."},
 {t:"opcion", p:"¿Cómo limitas cuántas llamadas simultáneas se hacen al proveedor?",
  ops:["Una goroutine por notificación","Un número fijo de workers leyendo de un canal (o errgroup con SetLimit), ajustado a lo que el proveedor admite","time.Sleep entre envíos","Con GOMAXPROCS"],
  ok:1, why:"La concurrencia es un recurso: se dimensiona según el límite del proveedor, no según el tráfico de entrada."},
 {t:"hueco", p:"Reintento con espera exponencial que respeta la cancelación",
  tpl:"espera := 200 * time.Millisecond\nfor range 5 {\n    err := enviar(ctx, n)\n    if err == nil {\n        return nil\n    }\n    ___ {\n    case <-time.After(espera):\n        espera *= 2\n    case <-ctx.___():\n        return ctx.Err()\n    }\n}",
  banco:["select","Done","switch","Err","sleep"], sol:["select","Done"],
  why:"En producción se añade jitter (un poco de azar) para que miles de reintentos no lleguen sincronizados, y solo se reintentan errores transitorios (timeouts, 5xx, 429)."},
 {t:"codigo", p:"Calendario de reintentos con espera exponencial",
  lenguaje:"js",
  c:`<p>Antes de escribir el bucle de reintentos en Go, calcula su calendario. La entrada trae tres números: espera inicial en ms, espera máxima en ms y número de intentos. Imprime, separadas por espacios, las esperas entre intentos (una menos que los intentos): cada una el doble de la anterior, sin pasar del máximo.</p><p>Con <code>200 1500 6</code> debe imprimir <code>200 400 800 1500 1500</code>.</p>`,
  plantilla:`const [inicial, maximo, intentos] = require("fs").readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
// imprime las esperas separadas por espacios
`,
  pruebas:[{entrada:"200 1500 6\n", salida:"200 400 800 1500 1500"},{entrada:"100 10000 4\n", salida:"100 200 400"},{entrada:"50 60 3\n", salida:"50 60", oculta:true}],
  pista:"Guarda la espera actual, añádela a la lista con Math.min(actual, maximo) y duplícala.",
  solucion:`const [inicial, maximo, intentos] = require("fs").readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
const esperas = [];
let actual = inicial;
for (let i = 1; i < intentos; i++) {
  esperas.push(Math.min(actual, maximo));
  actual *= 2;
}
console.log(esperas.join(" "));
`,
  why:"Sin tope, al intento 20 esperarías días. En producción se suma además un jitter aleatorio para que los clientes no reintenten todos a la vez."},
 {t:"orden", p:"Ordena el apagado del servicio al recibir SIGTERM",
  items:["Marcar /listo como no disponible para que el balanceador deje de enviar tráfico","srv.Shutdown(ctx): dejar de aceptar y terminar las peticiones HTTP en curso","Parar el despachador para que no reclame más lotes","Esperar a que los workers terminen lo que tienen, con un plazo","Cerrar la conexión a la base de datos y vaciar los logs"],
  why:"Se cierra en orden inverso a las dependencias: lo último que se usa es lo último que se cierra."},
 {t:"opcion", p:"El worker envía el email y el proceso muere antes de marcarlo como enviado. Al volver, se reenvía. ¿Cómo se evita el duplicado?",
  ops:["Es imposible del todo","Enviando al proveedor una clave de idempotencia (el id de la notificación) para que él descarte duplicados; entrega «al menos una vez» + idempotencia = efecto «exactamente una vez»","Marcando como enviado antes de enviar","Con un mutex"],
  ok:1, why:"Marcar antes de enviar cambia duplicados por pérdidas. Lo robusto es aceptar reintentos y hacerlos inofensivos."},
 {t:"par", p:"Empareja cada decisión con el problema que resuelve",
  pares:[["202 Accepted tras guardar","El cliente no espera al proveedor lento"],["FOR UPDATE SKIP LOCKED","Varias réplicas reclaman lotes sin pisarse"],["Pool de N workers","No saturar al proveedor"],["context.WithTimeout por envío","Un proveedor colgado no bloquea un worker para siempre"],["Clave de idempotencia","Reintentos sin duplicados"]],
  why:"Es un diseño de sistema pequeño, pero sale casi entero en entrevistas de backend con Go."},
 {t:"opcion", p:"¿Qué métricas expondrías para operar este servicio?",
  ops:["Solo el uso de CPU","Notificaciones pendientes (cola), envíos por resultado y proveedor, latencia de envío, reintentos, y el número de goroutines","El número de líneas de log","Solo las peticiones HTTP"],
  ok:1, why:"La cola de pendientes creciendo es la señal temprana de que los workers no dan abasto o el proveedor está caído."}
]},

/* =============== U12 L3 =============== */
{
id:"go12n3",
titulo:"Incidentes reales de producción",
claves:["La mayoría de los incidentes de Go son de concurrencia y recursos: fugas de goroutines, conexiones sin cerrar, llamadas sin timeout","Los síntomas se leen en métricas del runtime (goroutines, heap, GC) y se confirman con pprof","Hay trampas del lenguaje que conviene reconocer al instante: interfaz nil con tipo, subslices que retienen memoria, maps concurrentes"],
pasos:[
 {t:"info", eti:"Guía de campo", h:"Síntoma, causa y arreglo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">incidentes típicos</div><table class="dg-tabla"><thead><tr><th>síntoma</th><th>causa habitual</th><th>arreglo</th></tr></thead><tbody>
<tr><td>goroutines y memoria suben sin parar</td><td>llamadas HTTP sin timeout o canales sin receptor</td><td>http.Client con Timeout, context en todo, pprof goroutine</td></tr>
<tr><td><code>too many open files</code></td><td>resp.Body o ficheros sin cerrar; defer en un bucle</td><td>defer Close justo tras abrir; función aparte por iteración</td></tr>
<tr><td>proceso muere: <code>concurrent map writes</code></td><td>map compartido sin protección</td><td>sync.Mutex o sync.Map; -race en el CI</td></tr>
<tr><td>todas las peticiones esperan a la BD</td><td>rows sin Close: el pool se agota</td><td>defer rows.Close(); vigilar db.Stats()</td></tr>
<tr><td>OOMKilled en picos</td><td>heap al doble de lo vivo con GOGC=100</td><td>GOMEMLIMIT; reducir asignaciones</td></tr>
<tr><td>memoria alta con pocos datos</td><td>un subslice pequeño retiene un array enorme</td><td>slices.Clone de lo que se guarda</td></tr>
<tr><td><code>if err != nil</code> entra sin error</td><td>se devolvió un puntero nil como error</td><td>devolver nil literal</td></tr>
</tbody></table></div>
     <p>Exporta las métricas del runtime (con el cliente de Prometheus: <code>go_goroutines</code>, <code>go_memstats_heap_inuse_bytes</code>, pausas de GC) desde el primer día: la mitad de estos incidentes se ven venir en una gráfica.</p>`},
 {t:"opcion", p:"Tras un despliegue, <code>go_goroutines</code> pasa de 200 a 40.000 en dos horas y la latencia sube. El perfil de goroutines muestra miles paradas en <code>net/http.(*persistConn).readLoop</code> y en <code>select</code> de tu función <code>consultarPrecio</code>. ¿Causa más probable?",
  ops:["Un bug del runtime","Las llamadas al servicio de precios no tienen timeout ni contexto y ese servicio ha empezado a colgarse","Falta GOMEMLIMIT","Demasiados logs"],
  ok:1, why:"Cada petición entrante deja una goroutine esperando para siempre. Timeout en el cliente y contexto de la petición lo cortan."},
 {t:"opcion", p:"Un servicio guarda en caché los primeros 64 bytes de cada fichero de 50 MB que procesa (<code>cache[k] = datos[:64]</code>). La memoria no para de crecer. ¿Por qué?",
  ops:["La caché es demasiado grande","Cada subslice mantiene vivo el array de 50 MB entero; hay que copiar: slices.Clone(datos[:64])","El GC está desactivado","Los maps no liberan memoria nunca"],
  ok:1, why:"Para el GC el array sigue referenciado. Es de los casos que solo se ven en el perfil de heap (inuse_space)."},
 {t:"opcion", p:"El proceso termina con <code>fatal error: concurrent map writes</code> una vez a la semana. ¿Qué haces?",
  ops:["Añadir recover en el handler","Proteger el map con un mutex (o rediseñar para que tenga un único dueño) y añadir una prueba concurrente con -race","Subir GOMAXPROCS","Reiniciar el pod automáticamente"],
  ok:1, why:"Es un fatal error, no un panic: recover no lo captura. Hay que eliminar la carrera."},
 {t:"par", p:"Empareja cada mensaje o síntoma con su primera comprobación",
  pares:[["too many open files","Cuerpos de respuesta y ficheros sin cerrar"],["context deadline exceeded en cascada","Plazos encadenados demasiado cortos o una dependencia lenta"],["all goroutines are asleep - deadlock!","Un envío o recepción sin contraparte"],["OOMKilled","GOMEMLIMIT y perfil de heap"],["x509: certificate signed by unknown authority","Certificados CA en la imagen"]],
  why:"Reconocer el patrón ahorra la mitad del tiempo de un incidente."},
 {t:"vf", p:"Un <code>recover()</code> en un middleware HTTP evita que <code>concurrent map writes</code> tumbe el proceso.",
  ok:false, why:"El runtime lo trata como error fatal irrecuperable, igual que quedarse sin memoria. Solo lo evita no tener la carrera."},
 {t:"opcion", p:"Un JSON con <code>{\"id\": 9007199254740993}</code> se decodifica en <code>map[string]any</code> y al reenviarlo el id ha cambiado. ¿Por qué?",
  ops:["Un bug de encoding/json","Los números en any se convierten a float64, que no representa exactamente enteros por encima de 2^53","El id es demasiado largo para JSON","Por la codificación UTF-8"],
  ok:1, why:"Decodifica en un struct con int64 o usa Decoder.UseNumber(). Por eso muchas APIs envían ids grandes como string."},
 {t:"orden", p:"Ordena la investigación de un servicio Go que se ha vuelto lento",
  items:["Mirar las gráficas: latencia, goroutines, heap, CPU y pausas de GC","Comparar con el despliegue o el cambio de tráfico que coincide en el tiempo","Capturar perfiles con pprof (CPU, goroutine, heap) en el pod afectado","Localizar la función o la espera responsable con top y list","Arreglar, añadir una prueba o una métrica que lo detecte y documentarlo"],
  why:"Primero datos, luego hipótesis. pprof responde en minutos lo que leer código a ciegas no responde en horas."}
]},

/* =============== U12 L4 =============== */
{
id:"go6l1",
titulo:"Simulacro de entrevista de Go",
claves:["Sabes explicar slices, interfaces implícitas, errores y genéricos con sus trampas","Dominas goroutines, canales, sync, context y el modelo de memoria","Conoces las herramientas y la operación: pruebas, race detector, pprof, GC y despliegue"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir: en una entrevista real no hay opciones, y lo que cuenta es el razonamiento. Para cada pregunta, intenta dar la respuesta corta, un ejemplo y la trampa típica.</p>`},
 {t:"opcion", p:"«¿Diferencia entre un array y un slice en Go?»",
  ops:["Ninguna","El array tiene tamaño fijo que forma parte de su tipo y se copia entero; el slice es una vista (puntero, longitud y capacidad) sobre un array que puede crecer con append","El slice es más lento","El array es dinámico"],
  ok:1, why:"Menciona que dos slices pueden compartir el mismo array por debajo y que append puede reservar uno nuevo."},
 {t:"opcion", p:"«¿Cómo gestiona Go los errores?»",
  ops:["Con excepciones","Como valores devueltos (resultado, error) que se comprueban explícitamente, con wrapping mediante %w y errors.Is/As; panic solo para lo irrecuperable","Ignorándolos","Con códigos de salida"],
  ok:1, why:"Explícito y algo verboso, pero muy claro."},
 {t:"opcion", p:"«¿Canales o Mutex?»",
  ops:["Siempre canales","Canales para comunicar y coordinar trabajo entre goroutines; Mutex para proteger un estado compartido sencillo. Se usa lo que deje el código más claro","Siempre Mutex","Ninguno"],
  ok:1, why:"«No comuniques compartiendo memoria; comparte memoria comunicando», con pragmatismo."},
 {t:"opcion", p:"«¿Para qué sirve context?»",
  ops:["Para guardar variables globales","Para propagar cancelación, plazos y valores de petición a través de las llamadas, de modo que el trabajo se detenga si ya no hace falta","Para los logs","Para los tests"],
  ok:1, why:"Cada función que hace E/S recibe ctx como primer parámetro."},
 {t:"opcion", p:"«¿Por qué esta función devuelve un error no nil aunque no haya fallado nada?»",
  c:`<div class="termbox">func validar(u Usuario) error {
    var err *ErrValidacion
    if u.Email == "" {
        err = &amp;ErrValidacion{Campo: "email"}
    }
    return err
}</div>`,
  ops:["Porque Email está vacío","Porque devuelve una interfaz error con tipo *ErrValidacion y valor nil, que no es igual a nil; hay que devolver nil explícitamente","Porque falta un panic","Porque ErrValidacion no implementa error"],
  ok:1, why:"Una interfaz es nil solo si tipo y valor lo son. Es la pregunta trampa favorita."},
 {t:"opcion", p:"«¿Qué es una goroutine y en qué se diferencia de un hilo?»",
  ops:["Es lo mismo que un hilo","Es una función concurrente gestionada por el runtime de Go, con pila pequeña que crece; el planificador reparte muchas goroutines (G) entre pocos hilos (M) usando GOMAXPROCS procesadores lógicos (P)","Es un proceso","Es una corrutina sin concurrencia real"],
  ok:1, why:"Añade: la E/S de red bloqueante se aparca en el poller, así que el código es sencillo y escala."},
 {t:"opcion", p:"«¿Qué ocurre si envías a un canal cerrado? ¿Y si recibes de uno?»",
  ops:["Nada en ambos casos","Enviar provoca panic; recibir devuelve lo que quede en el búfer y después el valor cero con ok = false","Los dos bloquean","Los dos provocan panic"],
  ok:1, why:"De ahí la regla: cierra el emisor, nunca el receptor."},
 {t:"opcion", p:"«¿Receptor por valor o por puntero?»",
  ops:["Siempre por valor","Puntero si el método modifica, si el struct es grande o contiene un mutex; valor para tipos pequeños e inmutables. Y coherencia: si uno es puntero, todos","Siempre puntero","Da igual"],
  ok:1, why:"Menciona el efecto en los conjuntos de métodos: solo *T cumple una interfaz cuyos métodos tienen receptor puntero."},
 {t:"opcion", p:"«¿Cuándo usarías genéricos y cuándo interfaces?»",
  ops:["Genéricos siempre, son más modernos","Genéricos cuando el mismo algoritmo o contenedor se repite cambiando solo el tipo (slices, cachés, Map/Filter); interfaces cuando lo que varía es el comportamiento","Interfaces nunca","Genéricos solo para números"],
  ok:1, why:"Ejemplos: slices.Sort es genérico; io.Reader es una interfaz."},
 {t:"opcion", p:"«Tu servicio consume cada vez más memoria. ¿Cómo lo investigas?»",
  ops:["Reinicio programado","Métricas del runtime (heap, goroutines), perfil de heap y de goroutines con pprof, y comparar perfiles en el tiempo; luego revisar fugas de goroutines, subslices que retienen memoria y cachés sin límite; GOMEMLIMIT como red de seguridad","Subir el límite de memoria","Poner GOGC=off"],
  ok:1, why:"Datos primero: el perfil de heap con inuse_space dice qué línea retiene la memoria."},
 {t:"par", p:"Pregunta rápida: empareja cada herramienta con su propósito",
  pares:[["go test -race","Detectar carreras de datos"],["go tool pprof","Analizar perfiles de CPU y memoria"],["govulncheck","Vulnerabilidades que afectan a tu código"],["go vet","Errores sospechosos que compilan"],["benchstat","Comparar benchmarks con rigor estadístico"]],
  why:"Todas vienen con Go o son oficiales del equipo de Go."},
 {t:"escribe", p:"«¿Qué comando usarías en el CI para ejecutar todas las pruebas con el detector de carreras?»",
  sol:["go test -race ./...","go test ./... -race"],
  pista:"go test, el flag de carreras y todos los paquetes.",
  why:"Junto a go vet, golangci-lint y govulncheck, es el mínimo de un pipeline de Go serio."},
 {t:"info", eti:"Terminado", h:"Has completado Go",
  c:`<p>Dominas el lenguaje de punta a punta: tipos, slices y mapas por dentro, structs e interfaces, errores, genéricos e iteradores, paquetes y módulos, concurrencia con goroutines, canales, sync, atomic y context, pruebas con fuzzing y benchmarks, servicios HTTP, JSON y bases de datos, y la operación en producción con slog, pprof, el GC e imágenes mínimas.</p>
     <p>Para consolidarlo: construye el servicio de notificaciones de esta unidad con pruebas por tablas, synctest para los reintentos, un endpoint /metrics para Prometheus, perfiles pprof en un puerto interno y una imagen distroless. Después, lee código de verdad: la librería estándar (net/http, context, sync) es el mejor Go que existe.</p>`}
]}

]});
