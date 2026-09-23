window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Errores",
resumen: "Errores como valores, centinelas y tipos propios, wrapping con %w, errors.Is, errors.As y errors.Join, panic y recover",
nivel: "Intermedio",
color: "#45b5ce",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"go3l3",
titulo:"Errores idiomáticos",
claves:["error es una interfaz con un método: Error() string; los errores son valores que se devuelven","Errores centinela (var ErrX = errors.New) para casos que quien llama debe distinguir","Tipos de error propios cuando hay que llevar datos (campo, código, reintento…)"],
pasos:[
 {t:"info", eti:"if err != nil", h:"Los errores son valores",
  c:`<div class="termbox">type error interface {
    Error() string
}

f, err := os.Open("config.yaml")
if err != nil {
    return fmt.Errorf("cargar configuración: %w", err)
}
defer f.Close()</div>
     <p>Go no tiene excepciones para los errores esperados (fichero que no existe, red caída, dato no válido). Una función que puede fallar devuelve un <code>error</code> como último resultado y quien llama <b>decide qué hacer en ese mismo punto</b>: reintentar, añadir contexto y devolverlo, usar un valor por defecto o registrarlo.</p>
     <ul><li>Mensajes en <b>minúscula</b> y <b>sin punto final</b>: se encadenan («cargar configuración: open config.yaml: no such file or directory»).</li>
     <li>Trata cada error <b>una sola vez</b>: o lo registras, o lo devuelves; hacer las dos cosas llena el log de duplicados.</li>
     <li>Nunca ignores un error sin dejarlo claro: <code>_ = f.Close()</code> es una decisión; olvidarlo es un fallo.</li></ul>`},
 {t:"info", eti:"Tipos de errores", h:"Centinelas y tipos propios",
  c:`<div class="termbox">// 1) Centinela: un valor concreto que se compara
var ErrNoEncontrado = errors.New("no encontrado")
var ErrSinSaldo     = errors.New("saldo insuficiente")

// 2) Tipo propio: cuando el error lleva datos
type ErrValidacion struct {
    Campo  string
    Motivo string
}
func (e *ErrValidacion) Error() string {
    return fmt.Sprintf("campo %s no válido: %s", e.Campo, e.Motivo)
}

// 3) Opaco: fmt.Errorf / errors.New sin exportar; quien llama solo sabe que falló
return fmt.Errorf("conectar con %s: %w", host, err)</div>
     <p>En la librería estándar verás los tres: <code>io.EOF</code> y <code>sql.ErrNoRows</code> son centinelas; <code>*fs.PathError</code> y <code>*net.OpError</code> son tipos. Exporta un centinela o un tipo <b>solo si quien llama necesita distinguirlo</b>: pasa a formar parte de tu API.</p>`},
 {t:"par", p:"Empareja cada error de la librería estándar con su clase",
  pares:[["io.EOF","Centinela: se acabó la entrada (no es un fallo)"],["sql.ErrNoRows","Centinela: la consulta no devolvió filas"],["*fs.PathError","Tipo con datos: operación, ruta y causa"],["context.DeadlineExceeded","Centinela: venció el plazo del contexto"],["errors.New(\"...\") sin exportar","Error opaco: solo informa"]],
  why:"io.EOF muestra que un «error» también puede ser una señal normal de fin."},
 {t:"opcion", p:"¿Qué mensaje de error sigue las convenciones de Go?",
  ops:["\"Error: No se pudo abrir el fichero.\"","\"abrir config.yaml: permission denied\"","\"ERROR!!! fichero\"","\"No se pudo abrir el fichero config.yaml.\""],
  ok:1, why:"Minúscula, sin punto, con el contexto delante y la causa detrás: así encadena bien con otros."},
 {t:"hueco", p:"Declara un error centinela y úsalo",
  tpl:"var ErrSinStock = errors.___(\"sin stock\")\n\nfunc (a *Almacen) Reservar(sku string, n int) ___ {\n    if a.stock[sku] < n {\n        return ErrSinStock\n    }\n    a.stock[sku] -= n\n    return ___\n}",
  banco:["New","error","nil","Errorf","bool","err"], sol:["New","error","nil"],
  why:"Por convención los centinelas se llaman ErrAlgo y se crean con errors.New a nivel de paquete."},
 {t:"vf", p:"Es buena práctica registrar el error en el log y además devolverlo en cada capa.",
  ok:false, why:"El mismo fallo aparecería cinco veces en el log. Se añade contexto al devolverlo y se registra una vez, arriba (en el handler, en main)."},
 {t:"opcion", p:"Estás leyendo un fichero línea a línea y <code>Read</code> devuelve <code>io.EOF</code>. ¿Qué haces?",
  ops:["Devolver el error hacia arriba","Terminar el bucle con normalidad: EOF indica fin de datos, no un fallo","Hacer panic","Reintentar la lectura"],
  ok:1, why:"Por eso se compara: <code>if err == io.EOF { break }</code> (o errors.Is). bufio.Scanner ya lo oculta por ti."},
 {t:"escribe", p:"¿Qué único método tiene la interfaz <code>error</code>? (con paréntesis)",
  sol:["Error()","Error() string","Error"],
  pista:"Se llama igual que la interfaz, en mayúscula.",
  why:"Cualquier tipo con <code>Error() string</code> es un error. Normalmente con receptor puntero."}
]},

/* =============== U5 L2 =============== */
{
id:"go3l2",
titulo:"Wrapping: %w, errors.Is y errors.As",
claves:["fmt.Errorf con %w envuelve el error original añadiendo contexto","errors.Is busca un valor (centinela) en toda la cadena; errors.As busca un tipo","errors.Join combina varios errores; un tipo propio puede exponer su causa con Unwrap()"],
pasos:[
 {t:"info", eti:"La cadena", h:"Contexto sin perder la causa",
  c:`<div class="termbox">var ErrNoEncontrado = errors.New("no encontrado")

func (r *Repo) Pedido(ctx context.Context, id int) (*Pedido, error) {
    var p Pedido
    err := r.db.QueryRowContext(ctx, "SELECT id, total FROM pedidos WHERE id = $1", id).
        Scan(&amp;p.ID, &amp;p.Total)
    if errors.Is(err, sql.ErrNoRows) {
        return nil, fmt.Errorf("pedido %d: %w", id, ErrNoEncontrado)
    }
    if err != nil {
        return nil, fmt.Errorf("leer pedido %d: %w", id, err)
    }
    return &amp;p, nil
}

// en el handler:
switch {
case errors.Is(err, ErrNoEncontrado):
    http.Error(w, "no existe", http.StatusNotFound)
case err != nil:
    http.Error(w, "error interno", http.StatusInternalServerError)
}</div>
     <div class="dg"><div class="dg-tit">cadena de errores envueltos</div><div class="dg-flujo"><div class="dg-caja">servicio: …</div><div class="dg-caja">pedido 7: …</div><div class="dg-caja acento">ErrNoEncontrado</div></div><div class="dg-nota arriba">errors.Is recorre la cadena hasta encontrarlo</div></div>`},
 {t:"info", eti:"Por tipo y combinados", h:"errors.As, errors.Join y Unwrap",
  c:`<div class="termbox">var ve *ErrValidacion
if errors.As(err, &amp;ve) {                 // ¿hay un *ErrValidacion en la cadena?
    http.Error(w, "revisa el campo "+ve.Campo, http.StatusBadRequest)
}
if ve, ok := errors.AsType[*ErrValidacion](err); ok { … }   // Go 1.26+, genérica

err := errors.Join(errNombre, errEmail)  // varios errores en uno (Go 1.20+)
errors.Is(err, errEmail)                 // true

fmt.Errorf("x: %v", err)                 // %v: solo copia el TEXTO, rompe la cadena
fmt.Errorf("x: %w", err)                 // %w: envuelve

type ErrConsulta struct{ SQL string; Err error }
func (e *ErrConsulta) Error() string { return e.SQL + ": " + e.Err.Error() }
func (e *ErrConsulta) Unwrap() error { return e.Err }   // deja ver la causa</div>
     <div class="nota ojo"><b class="tit">¿%w siempre?</b>Envolver convierte el error interno en parte de tu API: quien llama puede depender de él. Si no quieres exponer que usas PostgreSQL, traduce a tu propio centinela o usa %v.</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["fmt.Errorf(\"...: %w\", err)","Añadir contexto conservando el error original"],["errors.Is(err, ErrNoEncontrado)","Comprobar si en la cadena está ese valor"],["errors.As(err, &destino)","Extraer un tipo de error concreto"],["errors.Join(e1, e2)","Juntar varios errores en uno"],["Unwrap() error","Método para que un tipo propio deje ver su causa"]],
  why:"Un error como «leer pedido 42: sql: no rows in result set» cuenta toda la historia."},
 {t:"vf", p:"Comparar con <code>err == ErrNoEncontrado</code> funciona aunque el error se haya envuelto con %w.",
  ok:false, why:"Tras envolverlo ya es otro valor; errors.Is recorre la cadena."},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">base := errors.New("no encontrado")
a := fmt.Errorf("buscar: %w", base)
b := fmt.Errorf("buscar: %v", base)
fmt.Println(errors.Is(a, base), errors.Is(b, base))</div>`,
  ops:["true true","true false","false false","false true"],
  ok:1, why:"Con %v solo se copia el texto: b ya no contiene a base. El mensaje es idéntico, pero la cadena se ha roto."},
 {t:"hueco", p:"Traduce el error del repositorio a un código HTTP",
  tpl:"var ve *ErrValidacion\nswitch {\ncase errors.___(err, ErrNoEncontrado):\n    w.WriteHeader(http.StatusNotFound)\ncase errors.___(err, ___ve):\n    w.WriteHeader(http.StatusBadRequest)\n}",
  banco:["Is","As","&","*","Unwrap","Join"], sol:["Is","As","&"],
  why:"errors.As necesita un puntero al destino para poder rellenarlo con el error encontrado."},
 {t:"orden", p:"Ordena el mensaje de error completo, de fuera hacia dentro, tal y como lo imprime Go",
  items:["crear pedido","reservar stock","sku A-17","sin stock"],
  why:"Cada capa antepone su contexto con fmt.Errorf(\"…: %w\", err): «crear pedido: reservar stock: sku A-17: sin stock»."},
 {t:"escribe", p:"¿Qué verbo de <code>fmt.Errorf</code> envuelve el error en vez de copiar solo su texto?",
  sol:["%w","w"],
  pista:"De wrap.",
  why:"Desde Go 1.20 se pueden usar varios %w en la misma llamada."}
]},

/* =============== U5 L3 =============== */
{
id:"go5n1",
titulo:"panic y recover",
claves:["panic detiene la función, ejecuta los defer y sube por la pila; si nadie lo recupera, el programa muere","recover solo funciona dentro de una función diferida y en la misma goroutine","panic es para errores de programación e invariantes rotas; los errores esperados se devuelven"],
pasos:[
 {t:"info", eti:"Cuando todo falla", h:"Cómo funciona un panic",
  c:`<div class="dg"><div class="dg-tit">recorrido de un panic</div><div class="dg-vert"><div class="dg-caja aviso">panic en c()</div><div class="dg-caja">se ejecutan los defer de c()</div><div class="dg-caja">sube a b(): sus defer</div><div class="dg-caja">sube a a(): un defer llama a recover()</div><div class="dg-caja ok">a() termina con normalidad</div></div><div class="dg-nota">sin recover: el programa imprime la traza y sale con código 2</div></div>
     <p>El runtime también provoca panics: índice fuera de rango, puntero nil, map nil, división entera entre cero, aserción de tipo fallida, cerrar un canal dos veces.</p>`},
 {t:"info", eti:"Recuperar", h:"recover en la frontera",
  c:`<div class="termbox">func Recuperar(sig http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if v := recover(); v != nil {
                slog.Error("pánico en handler", "valor", v, "pila", string(debug.Stack()))
                http.Error(w, "error interno", http.StatusInternalServerError)
            }
        }()
        sig.ServeHTTP(w, r)
    })
}

func MustCompile(expr string) *regexp.Regexp   // convención Must: pánico si falla
var reEmail = regexp.MustCompile(\`^[^@]+@[^@]+$\`)   // al arrancar: fallo = bug</div>
     <ul><li><b>Cuándo panic</b>: estados imposibles, bugs, configuración inválida al arrancar (funciones <code>MustX</code>).</li>
     <li><b>Dónde recover</b>: en las fronteras (un middleware HTTP, un worker) para que un fallo en una petición no tumbe el proceso. net/http ya recupera los panics de cada petición, pero sin controlar la respuesta.</li>
     <li>Un panic en <b>otra goroutine</b> no lo recupera nadie de fuera: tumba el programa entero. Cada goroutine necesita su propio recover si lo quieres.</li></ul>`},
 {t:"opcion", p:"¿Cuándo es apropiado <code>panic</code>?",
  ops:["Para cualquier error","Para situaciones imposibles o de programación (invariantes rotas) y configuración inválida al arrancar; los errores esperados se devuelven como error","Nunca se puede usar","Para salir de un bucle"],
  ok:1, why:"Un servidor HTTP recupera panics por petición para no caerse entero."},
 {t:"opcion", p:"¿Qué devuelve <code>seguro(func() { var m map[string]int; m[\"a\"] = 1 })</code>?",
  c:`<div class="termbox">func seguro(f func()) (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("pánico recuperado: %v", r)
        }
    }()
    f()
    return nil
}</div>`,
  ops:["nil","Un error «pánico recuperado: assignment to entry in nil map»","El programa se cae","Un error vacío"],
  ok:1, why:"El defer recupera el panic y, como err es un resultado con nombre, puede asignarlo antes de que la función salga."},
 {t:"vf", p:"Un <code>recover()</code> en <code>main</code> captura el panic de una goroutine lanzada desde main.",
  ok:false, why:"recover solo ve los panics de su propia goroutine. Un panic sin recuperar en cualquier goroutine termina todo el proceso."},
 {t:"par", p:"Empareja cada situación con el mensaje del runtime",
  pares:[["s := []int{}; s[3]","index out of range [3] with length 0"],["var p *T; p.Campo","invalid memory address or nil pointer dereference"],["var m map[string]int; m[\"a\"] = 1","assignment to entry in nil map"],["x.(int) con x = \"hola\"","interface conversion: interface {} is string, not int"],["close(ch) dos veces","close of closed channel"]],
  why:"Reconocer estos mensajes en una traza ahorra mucho tiempo en un incidente."},
 {t:"hueco", p:"Recupera cualquier panic de un worker para que no tumbe el proceso",
  tpl:"go func() {\n    ___ func() {\n        if r := ___(); r != nil {\n            log.Printf(\"worker: %v\", r)\n        }\n    }()\n    procesar(trabajo)\n}()",
  banco:["defer","recover","go","panic","catch"], sol:["defer","recover"],
  why:"El defer con recover va dentro de la propia goroutine, al principio."},
 {t:"escribe", p:"Por convención, ¿con qué prefijo se nombran las funciones que hacen panic en vez de devolver error (como regexp.___Compile)?",
  sol:["Must","must"],
  pista:"«Debe», en inglés.",
  why:"regexp.MustCompile, template.Must: pensadas para variables de paquete que se inicializan al arrancar."}
]}

]});
