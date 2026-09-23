window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Concurrencia: goroutines y canales",
resumen: "Goroutines, canales con y sin búfer, cerrar y recorrer canales, select, temporizadores, el planificador de Go y el modelo de memoria",
nivel: "Avanzado",
color: "#3fadc6",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"go4l1",
titulo:"Goroutines y canales",
claves:["go f() lanza una goroutine: miles cuestan muy poco","Los canales comunican goroutines de forma segura: «no compartas memoria, comunica»","main no espera a nadie: al terminar main termina el programa, con goroutines o sin ellas"],
pasos:[
 {t:"info", eti:"Concurrencia ligera", h:"Goroutines y canales",
  c:`<div class="termbox">func estado(url string, res chan&lt;- string) {
    r, err := http.Get(url)
    if err != nil { res &lt;- url + " ERROR"; return }
    defer r.Body.Close()
    res &lt;- fmt.Sprintf("%s %d", url, r.StatusCode)
}

res := make(chan string)
for _, u := range urls {
    go estado(u, res)                     // todas a la vez
}
for range urls {
    fmt.Println(&lt;-res)                    // recoger los resultados (en orden de llegada)
}</div>
     <p>Una <b>goroutine</b> es una función que se ejecuta de forma concurrente, gestionada por el runtime de Go y no por el sistema operativo. Empieza con una pila de unos pocos KB que crece según haga falta: un servidor con 100.000 goroutines es normal.</p>
     <div class="nota ojo"><b class="tit">main no espera</b>Si <code>main</code> retorna, el programa acaba aunque haya goroutines trabajando. Hay que esperarlas explícitamente: recibiendo de un canal, con <code>sync.WaitGroup</code> o con <code>errgroup</code>.</div>`},
 {t:"par", p:"Empareja cada construcción con su efecto",
  pares:[["go f()","Ejecutar f en una goroutine nueva"],["ch <- v","Enviar v por el canal"],["v := <-ch","Recibir del canal (espera si no hay nada)"],["make(chan T, 10)","Canal con búfer de 10 elementos"],["close(ch)","Indicar que no se enviará nada más"]],
  why:"Un canal sin búfer sincroniza: el envío espera a que alguien reciba."},
 {t:"vf", p:"Crear 10.000 goroutines es tan caro como crear 10.000 hilos del sistema operativo.",
  ok:false, why:"Empiezan con pilas de unos pocos KB y el runtime de Go las reparte entre pocos hilos."},
 {t:"opcion", p:"¿Qué imprime lo más probable este programa?",
  c:`<div class="termbox">func main() {
    go fmt.Println("hola desde la goroutine")
    fmt.Println("adiós")
}</div>`,
  ops:["hola desde la goroutine y adiós","Solo «adiós»: main termina antes de que la goroutine llegue a ejecutarse","Error de compilación","Se queda bloqueado"],
  ok:1, why:"Nada garantiza que la goroutine llegue a ejecutarse antes de que main acabe. Nunca uses time.Sleep para «esperar»: sincroniza de verdad."},
 {t:"hueco", p:"Lanza el cálculo en segundo plano y recoge el resultado",
  tpl:"res := ___(chan int)\n___ func() {\n    res <- calcular()\n}()\nfmt.Println(___res)",
  banco:["make","go","<-","new","defer","->"], sol:["make","go","<-"],
  why:"El canal sin búfer hace de punto de encuentro: main espera en &lt;-res hasta que la goroutine envía."},
 {t:"opcion", p:"¿Qué significa <code>func productor(out chan&lt;- int)</code>?",
  ops:["Que out solo se puede leer","Que out es un canal solo de envío dentro de la función: el compilador impide leer de él","Que el canal tiene búfer","Que out es un puntero"],
  ok:1, why:"chan&lt;- T es solo envío; &lt;-chan T solo recepción. Documentan quién hace qué y el compilador lo garantiza."},
 {t:"escribe", p:"Completa el lema de Go: «No comuniques compartiendo memoria; comparte memoria …»",
  sol:["comunicando","comunicándote"],
  pista:"Lo contrario de la primera parte.",
  why:"Pasar la propiedad de un dato por un canal evita que dos goroutines lo toquen a la vez."}
]},

/* =============== U7 L2 =============== */
{
id:"go7n1",
titulo:"Canales a fondo",
claves:["Sin búfer: envío y recepción se encuentran; con búfer: el envío solo espera si está lleno","Cierra el canal quien envía; recibir de uno cerrado devuelve el valor cero y ok = false; range termina al cerrarse","Enviar a un canal cerrado o cerrarlo dos veces provoca panic; un canal nil bloquea para siempre"],
pasos:[
 {t:"info", eti:"Comportamiento", h:"Qué hace cada operación",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">operaciones según el estado del canal</div><table class="dg-tabla"><thead><tr><th>operación</th><th>nil</th><th>abierto</th><th>cerrado</th></tr></thead><tbody>
<tr><td>enviar <code>ch &lt;- v</code></td><td>bloquea siempre</td><td>espera receptor o hueco en el búfer</td><td><b>panic</b></td></tr>
<tr><td>recibir <code>&lt;-ch</code></td><td>bloquea siempre</td><td>espera un valor</td><td>lo que quede en el búfer; después valor cero y ok = false</td></tr>
<tr><td>cerrar <code>close(ch)</code></td><td><b>panic</b></td><td>cierra</td><td><b>panic</b></td></tr>
</tbody></table></div>
     <p>Esta tabla resuelve la mayoría de los bloqueos y pánicos que verás. La regla de oro: <b>cierra quien envía</b>, y solo cuando nadie más va a enviar. Cerrar no es obligatorio: sirve para avisar a los receptores de que no llegarán más datos.</p>`},
 {t:"info", eti:"Patrones", h:"range, señales y semáforos",
  c:`<div class="termbox">func generar(n int) &lt;-chan int {
    out := make(chan int)
    go func() {
        defer close(out)           // el productor cierra al terminar
        for i := range n { out &lt;- i }
    }()
    return out
}

for v := range generar(5) {        // termina cuando out se cierra
    fmt.Println(v)
}

hecho := make(chan struct{})       // canal de señal: no lleva datos
go func() { trabajo(); close(hecho) }()
&lt;-hecho                            // close «difunde» a todos los que esperan

sem := make(chan struct{}, 3)      // búfer como semáforo: como mucho 3 a la vez
for _, t := range tareas {
    sem &lt;- struct{}{}
    go func() { defer func() { &lt;-sem }(); procesar(t) }()
}</div>
     <p>Un búfer <b>no arregla</b> un diseño que se bloquea: solo aplaza el problema. Úsalo cuando sepas por qué ese tamaño (absorber picos, un semáforo, un resultado que nadie más recogerá).</p>`},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">ch := make(chan int, 3)
ch &lt;- 1
ch &lt;- 2
close(ch)
for v := range ch { fmt.Print(v, " ") }
v, ok := &lt;-ch
fmt.Println(v, ok)</div>`,
  ops:["1 2 0 false","1 2 2 true","1 2 y panic","1 2 0 true"],
  ok:0, why:"Cerrar no borra lo que hay en el búfer: range lo consume y termina. Después, recibir da el valor cero y ok = false."},
 {t:"opcion", p:"Tu programa termina con <code>fatal error: all goroutines are asleep - deadlock!</code>. ¿Qué significa?",
  ops:["Falta memoria","Todas las goroutines están bloqueadas (por ejemplo, main envía a un canal sin búfer y nadie recibe)","Hay una carrera de datos","El sistema operativo mató el proceso"],
  ok:1, why:"El runtime lo detecta cuando no queda ninguna goroutine que pueda avanzar. Si hay otras goroutines vivas (un servidor HTTP), el bloqueo no se detecta y simplemente se queda colgado."},
 {t:"par", p:"Empareja cada acción con su resultado",
  pares:[["Enviar a un canal cerrado","panic: send on closed channel"],["Cerrar un canal ya cerrado","panic: close of closed channel"],["Recibir de un canal cerrado y vacío","Valor cero inmediatamente, ok = false"],["Recibir de un canal nil","Bloqueo para siempre"],["range sobre un canal que nadie cierra","El bucle nunca termina"]],
  why:"Por eso cierra solo el emisor: el receptor no sabe si alguien más va a enviar."},
 {t:"vf", p:"Es obligatorio cerrar todos los canales para que el recolector de basura los libere.",
  ok:false, why:"Un canal sin referencias se libera aunque esté abierto. Se cierra para avisar a los receptores, por ejemplo para que termine un range."},
 {t:"hueco", p:"El productor devuelve un canal de solo lectura y lo cierra al terminar",
  tpl:"func lineas(r io.Reader) ___chan string {\n    out := make(chan string)\n    go func() {\n        defer ___(out)\n        sc := bufio.NewScanner(r)\n        for sc.Scan() {\n            out <- sc.Text()\n        }\n    }()\n    return out\n}",
  banco:["<-","close","chan<-","delete","->"], sol:["<-","close"],
  why:"Devolver &lt;-chan string impide que quien consume envíe o cierre por error."},
 {t:"escribe", p:"¿Qué tipo de elemento se usa para un canal que solo sirve de señal, sin datos, porque no ocupa memoria?",
  sol:["struct{}","chan struct{}","struct {}"],
  pista:"Un struct sin campos.",
  why:"Es la convención: ctx.Done() es un &lt;-chan struct{}."}
]},

/* =============== U7 L3 =============== */
{
id:"go7n2",
titulo:"select y temporizadores",
claves:["select espera en varios canales y ejecuta el primero que esté listo (al azar si hay varios)","default hace la operación no bloqueante; un case con canal nil queda desactivado","time.After para un plazo puntual, time.NewTicker para repetir; mejor aún, context con plazo"],
pasos:[
 {t:"info", eti:"Esperar a varios", h:"select",
  c:`<div class="termbox">select {
case r := &lt;-resultados:
    fmt.Println(r)
case err := &lt;-errores:
    return err
case &lt;-time.After(2 * time.Second):
    return errors.New("timeout")
case &lt;-ctx.Done():
    return ctx.Err()              // cancelado desde fuera
}

select {                          // envío no bloqueante
case eventos &lt;- e:
default:
    descartados++                 // el búfer está lleno: se descarta
}

for {                             // bucle típico de un worker
    select {
    case t := &lt;-trabajos:
        procesar(t)
    case &lt;-ctx.Done():
        return
    }
}</div>
     <p>Si varios casos están listos a la vez, select elige <b>al azar</b>: no hay prioridad por orden de escritura. Un <code>select {}</code> vacío bloquea para siempre.</p>`},
 {t:"info", eti:"Tiempo", h:"Temporizadores y tickers",
  c:`<div class="termbox">t := time.NewTicker(30 * time.Second)
defer t.Stop()
for {
    select {
    case &lt;-t.C:
        comprobarSalud()
    case &lt;-ctx.Done():
        return
    }
}

timer := time.NewTimer(5 * time.Second)   // un solo disparo, reiniciable
timer.Reset(10 * time.Second)

time.AfterFunc(time.Minute, limpiarCache) // ejecuta en su propia goroutine</div>
     <p>Desde <b>Go 1.23</b> los temporizadores y tickers que ya no se referencian se liberan aunque no se llame a Stop, y sus canales no tienen búfer: el antiguo problema de <code>time.After</code> dentro de un bucle muy rápido acumulando memoria ya no existe. Aun así, <code>defer t.Stop()</code> sigue siendo buena costumbre.</p>`},
 {t:"opcion", p:"Dos casos de un select están listos a la vez. ¿Cuál se ejecuta?",
  ops:["El primero escrito","Uno al azar","Los dos","Ninguno: da error"],
  ok:1, why:"La elección aleatoria evita la inanición. Si necesitas prioridad, hace falta un select anidado o comprobar primero el canal prioritario."},
 {t:"opcion", p:"¿Qué imprime si nadie ha enviado nada por <code>ch</code>?",
  c:`<div class="termbox">select {
case x := &lt;-ch:
    fmt.Println("recibido", x)
default:
    fmt.Println("nada listo")
}</div>`,
  ops:["recibido 0","nada listo","Se bloquea hasta que llegue algo","panic"],
  ok:1, why:"Con default, select no espera: si ningún caso está listo, ejecuta default de inmediato."},
 {t:"hueco", p:"Espera el resultado como mucho 3 segundos",
  tpl:"___ {\ncase r := <-res:\n    return r, nil\ncase <-time.___(3 * time.Second):\n    return \"\", errors.New(\"tiempo agotado\")\n}",
  banco:["select","After","switch","Sleep","Tick"], sol:["select","After"],
  why:"time.After devuelve un canal que recibe un valor pasado el plazo. time.Sleep bloquearía sin poder atender res."},
 {t:"opcion", p:"Quieres que un worker deje de leer de <code>entradaA</code> cuando se cierre, pero siga leyendo de <code>entradaB</code>. ¿Truco idiomático?",
  ops:["Cerrar entradaB","Poner entradaA = nil al detectar el cierre: un case con canal nil nunca se elige","Usar default","Un segundo select con break"],
  ok:1, why:"Un canal nil bloquea para siempre, así que ese case queda desactivado. Es la forma clásica de hacer un fan-in que termina cuando se cierran todas las entradas."},
 {t:"vf", p:"<code>time.Sleep</code> dentro de un worker es una buena forma de esperar a que otra goroutine termine.",
  ok:false, why:"Es una apuesta, no una sincronización: a veces esperará de más y a veces de menos. Usa canales, WaitGroup o context."},
 {t:"escribe", p:"¿Qué método hay que llamar en un <code>time.Ticker</code> cuando ya no lo necesitas?",
  sol:["Stop","Stop()","t.Stop()","ticker.Stop()"],
  pista:"Parar, en inglés.",
  why:"Stop deja de enviar ticks. Suele ir en un defer justo después de crearlo."}
]},

/* =============== U7 L4 =============== */
{
id:"go7n3",
titulo:"El planificador y el modelo de memoria",
claves:["El runtime reparte G (goroutines) entre M (hilos del SO) usando P (procesadores lógicos), tantos como GOMAXPROCS","Desde Go 1.25, GOMAXPROCS respeta el límite de CPU del contenedor en Linux","Sin sincronización no hay garantía de que otra goroutine vea tus escrituras: una carrera de datos es un bug, no una curiosidad"],
pasos:[
 {t:"info", eti:"Por dentro", h:"El modelo G-M-P",
  c:`<div class="dg"><div class="dg-tit">cómo se ejecutan las goroutines</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">P0</div><div class="dg-vert"><div class="dg-caja acento">cola local<small>G G G</small></div><div class="dg-caja">M hilo del SO</div><div class="dg-caja base">núcleo de CPU</div></div></div>
<div class="dg-col"><div class="dg-col-tit">P1</div><div class="dg-vert"><div class="dg-caja acento">cola local<small>G G</small></div><div class="dg-caja">M hilo del SO</div><div class="dg-caja base">núcleo de CPU</div></div></div>
</div>
<div class="dg-nota arriba">un P sin trabajo «roba» goroutines de la cola de otro</div></div>
     <ul><li><b>G</b>: goroutine. <b>M</b>: hilo del sistema operativo. <b>P</b>: permiso para ejecutar código Go; hay <code>GOMAXPROCS</code> (por defecto, las CPU disponibles).</li>
     <li>Si una goroutine se bloquea en E/S de red, el runtime la aparca (usa epoll/kqueue) y el P sigue con otra: por eso miles de conexiones no necesitan miles de hilos.</li>
     <li>Si se bloquea en una llamada al sistema, el runtime suelta el P para que otro M lo use.</li>
     <li>El planificador puede <b>interrumpir</b> una goroutine que lleva mucho tiempo en un bucle (desde Go 1.14): un bucle infinito no congela a las demás.</li>
     <li><b>Go 1.25</b>: en Linux, GOMAXPROCS se ajusta al límite de CPU del cgroup (el <code>limits.cpu</code> de Kubernetes) y se actualiza si cambia. Antes había que usar la librería automaxprocs.</li></ul>`},
 {t:"info", eti:"Visibilidad", h:"El modelo de memoria",
  c:`<div class="termbox">var listo bool
var dato string

go func() {
    dato = "hola"
    listo = true
}()
for !listo { }            // MAL: puede no terminar nunca o ver dato vacío
fmt.Println(dato)</div>
     <p>El compilador y la CPU reordenan instrucciones. Go solo garantiza que una goroutine ve lo que escribió otra si hay una relación <b>«sucede antes»</b> (happens-before) entre ellas, y esa relación solo la crean las primitivas de sincronización:</p>
     <ul><li>Un envío por un canal sucede antes de que termine la recepción correspondiente.</li>
     <li>Cerrar un canal sucede antes de que una recepción vea el cierre.</li>
     <li><code>Unlock</code> de un mutex sucede antes del siguiente <code>Lock</code>.</li>
     <li>Las operaciones de <code>sync/atomic</code> y <code>sync.Once</code> también sincronizan.</li></ul>
     <p>Dos goroutines que acceden a la misma variable, al menos una escribe y no hay sincronización: eso es una <b>carrera de datos</b>. El resultado es impredecible; <code>go test -race</code> las detecta.</p>`},
 {t:"par", p:"Empareja cada letra del planificador con lo que representa",
  pares:[["G","Una goroutine"],["M","Un hilo del sistema operativo"],["P","Un procesador lógico con su cola de goroutines"],["GOMAXPROCS","Cuántos P hay: goroutines ejecutando código Go a la vez"]],
  why:"Puede haber muchos más M que P (hilos bloqueados en syscalls), pero solo GOMAXPROCS ejecutan Go en paralelo."},
 {t:"opcion", p:"Un servicio Go en Kubernetes con <code>limits.cpu: 2</code> en un nodo de 64 núcleos iba lento con Go 1.22 por exceso de hilos y throttling. ¿Qué cambia en Go 1.25+?",
  ops:["Nada","GOMAXPROCS pasa a ser 2 automáticamente al respetar el límite de CPU del cgroup","Go ignora los límites","Hay que compilar con -race"],
  ok:1, why:"Antes GOMAXPROCS era 64 y el cgroup frenaba el proceso a cada rato. Con versiones anteriores se usaba go.uber.org/automaxprocs."},
 {t:"vf", p:"Si una goroutine escribe una variable y otra la lee «un rato después», sin canales ni mutex, la lectura verá seguro el valor nuevo.",
  ok:false, why:"Sin una relación happens-before no hay ninguna garantía. Por eso hacen falta canales, mutex o atomic."},
 {t:"opcion", p:"¿Por qué un servidor Go atiende 50.000 conexiones abiertas sin 50.000 hilos?",
  ops:["Porque usa un hilo por conexión muy ligero","Porque las goroutines bloqueadas en red se aparcan en el poller del runtime y los pocos hilos atienden a las que están listas","Porque limita las conexiones","Porque usa procesos"],
  ok:1, why:"El código se escribe de forma bloqueante y sencilla, y el runtime lo convierte en E/S asíncrona por debajo."},
 {t:"term", p:"Ejecuta el programa limitándolo a una sola goroutine ejecutando código Go a la vez",
  prompt:"pablo@portatil:~/api$", sol:["GOMAXPROCS=1 go run .","GOMAXPROCS=1 go run main.go"],
  salida:"",
  pista:"Variable de entorno delante del comando.",
  why:"Útil para reproducir problemas de planificación o medir. En código: runtime.GOMAXPROCS(n)."},
 {t:"escribe", p:"¿Cómo se llama la relación de orden que garantiza que una goroutine ve las escrituras de otra? (en inglés o español)",
  sol:["happens-before","happens before","sucede antes","sucede-antes"],
  pista:"Algo «sucede antes» que otra cosa.",
  why:"Es el concepto central del modelo de memoria de Go (go.dev/ref/mem)."}
]}

]});
