window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Concurrencia en Go",
resumen: "Goroutines, canales, select, WaitGroup y Mutex, y context para cancelar y poner plazos",
nivel: "Avanzado",
color: "#45b5ce",
lecciones: [

{
id:"go4l1",
titulo:"Goroutines y canales",
claves:["go f() lanza una goroutine: miles cuestan muy poco","Los canales comunican goroutines de forma segura: «no compartas memoria, comunica»","select espera en varios canales a la vez"],
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
    fmt.Println(&lt;-res)                    // recoger los resultados
}

select {
case r := &lt;-res:
    fmt.Println(r)
case &lt;-time.After(2 * time.Second):
    fmt.Println("timeout")
}</div>`},
 {t:"par", p:"Empareja cada construcción con su efecto",
  pares:[["go f()","Ejecutar f en una goroutine nueva"],["ch <- v","Enviar v por el canal"],["v := <-ch","Recibir del canal (espera si no hay nada)"],["make(chan T, 10)","Canal con búfer de 10 elementos"],["close(ch)","Indicar que no se enviará nada más"]],
  why:"Un canal sin búfer sincroniza: el envío espera a que alguien reciba."},
 {t:"vf", p:"Crear 10.000 goroutines es tan caro como crear 10.000 hilos del sistema operativo.",
  ok:false, why:"Empiezan con pilas de unos pocos KB y el runtime de Go las reparte entre pocos hilos."}
]},

{
id:"go4l2",
titulo:"sync y context",
claves:["WaitGroup espera a un grupo de goroutines; Mutex protege datos compartidos","context propaga cancelación y plazos por las llamadas","El detector de carreras (go test -race) encuentra accesos concurrentes peligrosos"],
pasos:[
 {t:"info", eti:"Coordinar", h:"WaitGroup, Mutex y context",
  c:`<div class="termbox">var wg sync.WaitGroup
var mu sync.Mutex
total := 0
for _, p := range pedidos {
    wg.Add(1)
    go func() {
        defer wg.Done()
        importe := calcular(p)
        mu.Lock()
        total += importe             // seccion critica
        mu.Unlock()
    }()
}
wg.Wait()

func (h *Handler) Obtener(w http.ResponseWriter, r *http.Request) {
    ctx, cancelar := context.WithTimeout(r.Context(), 2*time.Second)
    defer cancelar()
    p, err := h.repo.Pedido(ctx, id)          // si el cliente se va o pasan 2 s, se cancela
    ...
}</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["sync.WaitGroup","Esperar a que terminen varias goroutines"],["sync.Mutex","Acceso exclusivo a datos compartidos"],["context.WithTimeout","Cancelar el trabajo si tarda demasiado"],["r.Context()","Contexto que se cancela si el cliente cierra la conexión"],["go test -race","Detectar condiciones de carrera"]],
  why:"context se pasa como primer parámetro de las funciones que hacen E/S: es la convención."},
 {t:"opcion", p:"¿Qué es una fuga de goroutines?",
  ops:["Un error de compilación","Goroutines bloqueadas para siempre (por ejemplo, esperando en un canal que nadie cierra) que se acumulan y consumen memoria","Un tipo de canal","Una goroutine muy rápida"],
  ok:1, why:"context y canales cerrados correctamente las evitan."}
]},

{
id:"go4l3",
titulo:"Patrones de concurrencia",
claves:["Worker pool: N goroutines leen trabajos de un canal","errgroup lanza tareas y devuelve el primer error cancelando el resto","El detector de carreras (-race) encuentra accesos concurrentes sin sincronizar"],
pasos:[
 {t:"info", eti:"Patrones", h:"Worker pool y errgroup",
  c:`<div class="termbox">g, ctx := errgroup.WithContext(ctx)
g.SetLimit(8)                          // como mucho 8 a la vez
for _, url := range urls {
    g.Go(func() error {
        return descargar(ctx, url)     // si una falla, ctx se cancela
    })
}
if err := g.Wait(); err != nil { return err }

go test -race ./...                    // detectar carreras de datos</div>`},
 {t:"par", p:"Empareja cada patrón con su uso",
  pares:[["Worker pool","Procesar muchos trabajos con concurrencia limitada"],["errgroup","Varias tareas en paralelo con cancelación al primer error"],["Fan-in","Unir resultados de varios canales en uno"],["select con time.After","Poner un tiempo máximo a una espera"],["-race","Encontrar carreras de datos en las pruebas"]],
  why:"Siempre limita la concurrencia: miles de goroutines contra una API externa la saturan."},
 {t:"opcion", p:"Una goroutine espera en un canal que nadie cerrará ni escribirá. ¿Qué ocurre?",
  ops:["Termina sola a los 30 s","Se queda bloqueada para siempre: una fuga de goroutine que consume memoria","El programa la reinicia","Lanza panic"],
  ok:1, why:"Usa context o cierra los canales para que todas las goroutines puedan terminar."}
]}

]});
