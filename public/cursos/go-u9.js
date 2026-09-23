window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Pruebas y calidad",
resumen: "Pruebas por tablas y subtests, dobles de prueba y httptest, synctest para código con tiempo, benchmarks con b.Loop, fuzzing, cobertura, detector de carreras y linters",
nivel: "Experto",
color: "#39a5be",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"go5l2",
titulo:"Pruebas por tablas y subtests",
claves:["Las pruebas viven en ficheros _test.go junto al código: func TestX(t *testing.T)","Pruebas por tablas con t.Run: un subtest por caso, que se puede ejecutar por separado","t.Errorf sigue, t.Fatalf para; t.Helper, t.Cleanup, t.TempDir, t.Parallel y t.Context hacen el resto"],
pasos:[
 {t:"info", eti:"Calidad", h:"Pruebas por tablas",
  c:`<div class="termbox">// precio_test.go
func TestPrecioConIva(t *testing.T) {
    casos := []struct {
        nombre   string
        base     int64
        esperado int64
    }{
        {"cero", 0, 0},
        {"cien euros", 10000, 12100},
        {"céntimo suelto", 1, 1},
    }
    for _, c := range casos {
        t.Run(c.nombre, func(t *testing.T) {
            if got := PrecioConIva(c.base); got != c.esperado {
                t.Errorf("PrecioConIva(%d) = %d; esperado %d", c.base, got, c.esperado)
            }
        })
    }
}</div>
<div class="termbox">$ go test ./...
--- FAIL: TestPrecioConIva (0.00s)
    --- FAIL: TestPrecioConIva/cien_euros (0.00s)
        precio_test.go:20: PrecioConIva(10000) = 12000; esperado 12100
FAIL
FAIL    github.com/pablo/precio    0.003s</div>
     <p>Añadir un caso es añadir una línea. El mensaje sigue el formato <b>«Función(entrada) = obtenido; esperado X»</b>: se entiende sin abrir el código. Sin librerías de aserciones: el estilo de Go es un <code>if</code> y un <code>t.Errorf</code>.</p>`},
 {t:"info", eti:"El kit", h:"Ayudantes de testing.T",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">métodos de testing.T que usarás</div><table class="dg-tabla"><thead><tr><th>método</th><th>para qué</th></tr></thead><tbody>
<tr><td><code>t.Errorf</code></td><td>marca fallo y <b>sigue</b> (ver todos los fallos)</td></tr>
<tr><td><code>t.Fatalf</code></td><td>marca fallo y <b>para</b> ese test (cuando seguir no tiene sentido)</td></tr>
<tr><td><code>t.Helper()</code></td><td>en una función auxiliar: el fallo apunta a la línea de quien la llama</td></tr>
<tr><td><code>t.Cleanup(f)</code></td><td>limpieza al terminar el test y sus subtests</td></tr>
<tr><td><code>t.TempDir()</code></td><td>carpeta temporal que se borra sola</td></tr>
<tr><td><code>t.Setenv("K", "v")</code></td><td>variable de entorno restaurada al final</td></tr>
<tr><td><code>t.Parallel()</code></td><td>ejecutar en paralelo con otros tests paralelos</td></tr>
<tr><td><code>t.Context()</code></td><td>contexto que se cancela al acabar el test (Go 1.24+)</td></tr>
<tr><td><code>t.Skip("…")</code></td><td>saltar (por ejemplo con <code>testing.Short()</code>)</td></tr>
</tbody></table></div>
     <p>Los datos de prueba van en una carpeta <code>testdata/</code>, que el compilador ignora. Los <b>ficheros golden</b> guardan la salida esperada y se regeneran con un flag propio (<code>go test -update</code>) cuando el cambio es intencionado.</p>`},
 {t:"term", p:"Ejecuta solo el subtest «cero» de <code>TestPrecioConIva</code>, mostrando el detalle",
  prompt:"pablo@portatil:~/precio$", sol:["go test -run TestPrecioConIva/cero -v ./...","go test -v -run TestPrecioConIva/cero ./...","go test -run TestPrecioConIva/cero -v","go test -v -run TestPrecioConIva/cero","go test -run 'TestPrecioConIva/cero' -v ./...","go test -v -run 'TestPrecioConIva/cero' ./..."],
  salida:"=== RUN   TestPrecioConIva\n=== RUN   TestPrecioConIva/cero\n--- PASS: TestPrecioConIva (0.00s)\n    --- PASS: TestPrecioConIva/cero (0.00s)\nPASS\nok  \tgithub.com/pablo/precio\t0.003s",
  pista:"-run acepta Test/subtest; -v muestra cada uno.",
  why:"-run es una expresión regular por niveles separados por /. Los espacios del nombre del subtest se convierten en _."},
 {t:"opcion", p:"En un subtest compruebas que <code>err == nil</code> antes de leer <code>resultado.Total</code>. Si hay error, ¿Errorf o Fatalf?",
  ops:["Errorf, siempre","Fatalf: si hay error, resultado probablemente es nil y seguir provocaría un panic que tapa el fallo real","Ninguno: panic","Da igual"],
  ok:1, why:"Fatalf detiene solo ese subtest; los demás casos de la tabla siguen ejecutándose."},
 {t:"hueco", p:"Completa un ayudante de pruebas que falle en la línea de quien lo llama",
  tpl:"func comprobarJSON(t *testing.T, obtenido, esperado string) {\n    t.___()\n    if obtenido != esperado {\n        t.___(\"JSON = %s; esperado %s\", obtenido, esperado)\n    }\n}",
  banco:["Helper","Errorf","Parallel","Log","Fail"], sol:["Helper","Errorf"],
  why:"Sin t.Helper() el fallo señalaría siempre la línea dentro de comprobarJSON, que no dice qué caso falló."},
 {t:"vf", p:"Los ficheros <code>_test.go</code> se incluyen en el binario que genera <code>go build</code>.",
  ok:false, why:"Solo los compila go test. Tampoco se incluye nada de la carpeta testdata/."},
 {t:"par", p:"Empareja cada opción de go test con su efecto",
  pares:[["-run Patron","Ejecutar solo los tests cuyo nombre coincide"],["-v","Mostrar cada test y sus logs"],["-count=1","Ignorar la caché de resultados"],["-short","Saltar los tests marcados como lentos"],["-shuffle=on","Ejecutar en orden aleatorio para detectar dependencias entre tests"]],
  why:"go test cachea los resultados de paquetes sin cambios; -count=1 fuerza a repetir (útil con tests que tocan red o disco)."},
 {t:"escribe", p:"¿Con qué sufijo debe terminar el nombre de un fichero para que go test lo trate como pruebas?",
  sol:["_test.go","_test"],
  pista:"Guion bajo y la palabra test.",
  why:"Pueden estar en el mismo paquete (acceso a lo privado) o en paquete_test (solo la API pública, como un usuario real)."}
]},

/* =============== U9 L2 =============== */
{
id:"go9n1",
titulo:"Dobles de prueba, httptest y synctest",
claves:["Los falsos se escriben a mano implementando una interfaz pequeña: sin frameworks de mocks","httptest.NewRecorder prueba handlers sin red; httptest.NewServer levanta un servidor real para probar clientes","testing/synctest (Go 1.25+) prueba código con tiempo y goroutines con un reloj falso"],
pasos:[
 {t:"info", eti:"Falsos", h:"Una interfaz y un struct",
  c:`<div class="termbox">type Notificador interface {
    Enviar(ctx context.Context, a, msg string) error
}

type notificadorFalso struct {
    enviados []string
    err      error               // para simular fallos
}
func (n *notificadorFalso) Enviar(_ context.Context, a, msg string) error {
    n.enviados = append(n.enviados, a+": "+msg)
    return n.err
}

func TestConfirmarPedido(t *testing.T) {
    nf := &amp;notificadorFalso{}
    s := NuevoServicio(nf)
    if err := s.Confirmar(t.Context(), 42); err != nil {
        t.Fatal(err)
    }
    if len(nf.enviados) != 1 {
        t.Errorf("enviados = %d; esperado 1", len(nf.enviados))
    }
}</div>
     <p>Para bases de datos, la opción más fiable suele ser una <b>de verdad</b> en un contenedor (testcontainers-go o un servicio del CI) en vez de simular SQL.</p>`},
 {t:"info", eti:"HTTP", h:"httptest",
  c:`<div class="termbox">func TestObtenerTarea(t *testing.T) {
    h := NuevoHandler(repoFalso{})
    req := httptest.NewRequest(http.MethodGet, "/api/tareas/7", nil)
    rec := httptest.NewRecorder()

    h.ServeHTTP(rec, req)                       // sin red, sin puertos

    if rec.Code != http.StatusOK {
        t.Fatalf("código = %d; esperado 200", rec.Code)
    }
}

func TestCliente(t *testing.T) {               // probar un cliente HTTP
    srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte(\`{"estado":"ok"}\`))
    }))
    defer srv.Close()
    c := NuevoCliente(srv.URL)
    …
}

func TestReintento(t *testing.T) {             // Go 1.25+: tiempo virtual
    synctest.Test(t, func(t *testing.T) {
        inicio := time.Now()
        time.Sleep(time.Hour)                   // no espera de verdad
        synctest.Wait()                         // hasta que las goroutines de la burbuja se bloqueen
        if time.Since(inicio) != time.Hour { t.Fatal("reloj") }
    })
}</div>`},
 {t:"par", p:"Empareja cada herramienta con lo que prueba",
  pares:[["httptest.NewRecorder","Un handler, capturando código, cabeceras y cuerpo"],["httptest.NewServer","Un cliente HTTP contra un servidor local real"],["synctest.Test","Código con temporizadores y goroutines, con reloj falso"],["Struct falso con la interfaz","Una dependencia externa (email, pagos) sin llamarla"],["Contenedor con PostgreSQL","El repositorio contra una base de datos real"]],
  why:"Cuanto más se parezca la prueba a producción, más confianza da; cuanto más rápida, más se ejecuta."},
 {t:"hueco", p:"Prueba un handler sin abrir puertos",
  tpl:"req := httptest.___(http.MethodGet, \"/salud\", nil)\nrec := httptest.___()\nhandler.ServeHTTP(rec, req)\nif rec.___ != http.StatusOK {\n    t.Errorf(\"código %d\", rec.Code)\n}",
  banco:["NewRequest","NewRecorder","Code","NewServer","Status","Body"], sol:["NewRequest","NewRecorder","Code"],
  why:"rec.Body.String() da el cuerpo y rec.Header() las cabeceras."},
 {t:"opcion", p:"Tu función reintenta con esperas de 1, 2 y 4 segundos. El test tarda 7 s. ¿Qué haces con Go 1.25+?",
  ops:["Aceptarlo","Envolver el test en synctest.Test: el tiempo avanza de forma virtual cuando todas las goroutines están bloqueadas y el test tarda milisegundos","Poner t.Parallel()","Quitar las esperas del código"],
  ok:1, why:"Antes había que inyectar un reloj falso en el código. synctest lo hace sin tocar el código de producción."},
 {t:"vf", p:"Para probar código Go con dependencias hace falta un framework de mocks como gomock.",
  ok:false, why:"Se puede usar, pero lo idiomático es una interfaz pequeña en el consumidor y un struct falso escrito a mano en pocas líneas."},
 {t:"opcion", p:"¿Por qué conviene que <code>NuevoServicio</code> reciba el notificador como parámetro en lugar de crearlo dentro?",
  ops:["Por rendimiento","Para poder pasar un falso en las pruebas y otra implementación en producción (inyección de dependencias por constructor)","Porque Go lo obliga","Para que compile más rápido"],
  ok:1, why:"En Go la inyección de dependencias es simplemente pasar cosas a los constructores; main es quien lo cablea todo."},
 {t:"escribe", p:"¿Qué paquete de la librería estándar trae NewRecorder y NewServer para probar código HTTP?",
  sol:["net/http/httptest","httptest"],
  pista:"http + test.",
  why:"Está en net/http/httptest y no necesita dependencias."}
]},

/* =============== U9 L3 =============== */
{
id:"go9n2",
titulo:"Benchmarks y fuzzing",
claves:["func BenchmarkX(b *testing.B) con for b.Loop() (Go 1.24+); go test -bench=. -benchmem","Compara versiones con benchstat y varias repeticiones, no con una ejecución","func FuzzX(f *testing.F) genera entradas al azar; los fallos se guardan en testdata/fuzz y pasan a ser tests"],
pasos:[
 {t:"info", eti:"Medir", h:"Benchmarks",
  c:`<div class="termbox">func BenchmarkInvertir(b *testing.B) {
    for b.Loop() {                       // Go 1.24+: sustituye a for i := 0; i &lt; b.N; i++
        Invertir("hola mundo")
    }
}

$ go test -run=^$ -bench=. -benchmem
BenchmarkInvertir-8   100000000    11.79 ns/op    0 B/op    0 allocs/op

$ go test -bench=. -count=10 &gt; viejo.txt
# … cambias el código …
$ go test -bench=. -count=10 &gt; nuevo.txt
$ benchstat viejo.txt nuevo.txt</div>
     <p><code>-8</code> es GOMAXPROCS; luego iteraciones, tiempo por operación, bytes y asignaciones por operación. <code>b.Loop</code> evita que el compilador elimine el código medido y excluye la preparación previa del tiempo. <code>-run=^$</code> no ejecuta ningún test normal, solo benchmarks.</p>
     <p>Una sola ejecución no demuestra nada: el ruido del portátil puede ser del 10%. <b>benchstat</b> (golang.org/x/perf) compara series y dice si la diferencia es estadísticamente significativa.</p>`},
 {t:"info", eti:"Entradas raras", h:"Fuzzing",
  c:`<div class="termbox">func FuzzInvertir(f *testing.F) {
    f.Add("hola")                                   // semillas
    f.Fuzz(func(t *testing.T, s string) {
        r := Invertir(s)
        if utf8.ValidString(s) &amp;&amp; !utf8.ValidString(r) {
            t.Errorf("Invertir(%q) = %q no es UTF-8 válido", s, r)
        }
    })
}

$ go test -fuzz=FuzzInvertir -fuzztime=30s
fuzz: elapsed: 0s, gathering baseline coverage: 1/1 completed, now fuzzing with 8 workers
--- FAIL: FuzzInvertir (0.11s)
        precio_test.go:37: Invertir("ᣯ0") = "0\\xaf\\xa3\\xe1" no es UTF-8 válido
    Failing input written to testdata/fuzz/FuzzInvertir/a6582e80388c5f5a</div>
     <p>El fuzzer muta las entradas guiándose por la cobertura. Sin <code>-fuzz</code>, <code>go test</code> ejecuta la función solo con las semillas y los casos guardados en <code>testdata/fuzz</code>: el fallo encontrado se convierte en <b>prueba de regresión</b> permanente. Ideal para parsers, decodificadores y cualquier cosa que reciba datos de fuera.</p>`},
 {t:"term", p:"Ejecuta todos los benchmarks del paquete mostrando las asignaciones de memoria",
  prompt:"pablo@portatil:~/precio$", sol:["go test -bench=. -benchmem","go test -bench . -benchmem","go test -run=^$ -bench=. -benchmem","go test -benchmem -bench=.","go test -bench=. -benchmem ./..."],
  salida:"goos: linux\ngoarch: amd64\npkg: github.com/pablo/precio\nBenchmarkInvertir-8   \t100000000\t        11.79 ns/op\t       0 B/op\t       0 allocs/op\nPASS\nok  \tgithub.com/pablo/precio\t1.183s",
  pista:"-bench con el patrón «todos» y el flag de memoria.",
  why:"allocs/op suele importar más que ns/op en un servidor: cada asignación es trabajo para el recolector."},
 {t:"term", p:"Lanza el fuzzer sobre <code>FuzzInvertir</code> durante 30 segundos",
  prompt:"pablo@portatil:~/precio$", sol:["go test -fuzz=FuzzInvertir -fuzztime=30s","go test -fuzz FuzzInvertir -fuzztime 30s","go test -fuzztime=30s -fuzz=FuzzInvertir","go test -fuzz=FuzzInvertir -fuzztime 30s"],
  salida:"fuzz: elapsed: 0s, gathering baseline coverage: 1/1 completed, now fuzzing with 8 workers\nfuzz: elapsed: 3s, execs: 412345 (137402/sec), new interesting: 12 (total: 13)\n...\nPASS",
  pista:"-fuzz con el nombre y -fuzztime con la duración.",
  why:"Sin -fuzztime seguiría hasta encontrar un fallo o que lo pares. En el CI se suele lanzar un rato cada noche."},
 {t:"opcion", p:"El fuzzer encontró un fallo y lo guardó en <code>testdata/fuzz/FuzzInvertir/…</code>. ¿Qué haces con ese fichero?",
  ops:["Borrarlo","Subirlo al repositorio: go test lo ejecutará siempre como caso de regresión","Ignorarlo en .gitignore","Moverlo a /tmp"],
  ok:1, why:"Así el bug no puede volver sin que un test falle, aunque nadie vuelva a lanzar el fuzzer."},
 {t:"par", p:"Empareja cada columna de la salida de un benchmark con su significado",
  pares:[["BenchmarkInvertir-8","Nombre y GOMAXPROCS"],["100000000","Iteraciones ejecutadas"],["11.79 ns/op","Tiempo por operación"],["0 B/op","Bytes reservados por operación"],["0 allocs/op","Asignaciones al heap por operación"]],
  why:"Cuando optimices, mira primero allocs/op: reducirlas suele mejorar también el tiempo."},
 {t:"hueco", p:"Completa el benchmark moderno",
  tpl:"func BenchmarkParsear(b *testing.___) {\n    datos := cargarEjemplo()   // no cuenta en el tiempo\n    for b.___() {\n        Parsear(datos)\n    }\n}",
  banco:["B","Loop","T","N","F","Run"], sol:["B","Loop"],
  why:"Con b.Loop el tiempo empieza a contar en la primera llamada a Loop, así que la preparación queda fuera."},
 {t:"vf", p:"Si un benchmark da 110 ns/op antes y 100 ns/op después en una sola ejecución, has demostrado una mejora del 10%.",
  ok:false, why:"Puede ser ruido. Repite con -count=10 y compara con benchstat, que da el intervalo y el p-valor."}
]},

/* =============== U9 L4 =============== */
{
id:"go9n3",
titulo:"Cobertura, carreras y linters",
claves:["go test -race instrumenta el binario y detecta carreras de datos que realmente ocurren","-cover y -coverprofile miden la cobertura; go tool cover -html la enseña línea a línea","go vet viene de serie; staticcheck y golangci-lint añaden cientos de comprobaciones en el CI"],
pasos:[
 {t:"info", eti:"Carreras", h:"El detector de carreras",
  c:`<div class="termbox">$ go test -race ./...
==================
WARNING: DATA RACE
Write at 0x00c0000b4010 by goroutine 8:
  github.com/pablo/api.(*Contador).Sumar()
      /src/contador.go:12 +0x44
Previous read at 0x00c0000b4010 by goroutine 7:
  github.com/pablo/api.(*Contador).Valor()
      /src/contador.go:16 +0x3a
==================
--- FAIL: TestContadorConcurrente (0.00s)
    testing.go:1490: race detected during execution of test</div>
     <p>Señala las dos pilas que chocan: quién escribe y quién leía. Solo detecta las carreras que <b>ocurren durante la ejecución</b>, así que las pruebas deben ejercitar la concurrencia de verdad. Hace el programa unas 2-20 veces más lento y usa más memoria: se activa en el CI y en pruebas, no en producción.</p>`},
 {t:"info", eti:"Calidad", h:"Cobertura y linters",
  c:`<div class="termbox">go test -cover ./...
ok   github.com/pablo/precio   0.010s   coverage: 87.5% of statements

go test -coverprofile=cover.out ./...
go tool cover -html=cover.out           # abre el navegador: verde probado, rojo no
go tool cover -func=cover.out           # porcentaje por función

go vet ./...                            # comprobaciones oficiales (printf, copylocks, lostcancel…)
staticcheck ./...                       # honnef.co/go/tools: código muerto, errores sutiles
golangci-lint run                       # agrega decenas de linters con una configuración</div>
     <div class="dg"><div class="dg-tit">etapas de calidad típicas en el CI</div><div class="dg-flujo"><div class="dg-caja">gofmt -l</div><div class="dg-caja">go vet</div><div class="dg-caja">golangci-lint</div><div class="dg-caja">go test -race -cover</div><div class="dg-caja ok">govulncheck</div></div></div>
     <p>La cobertura dice qué líneas <b>no</b> se prueban; un 90% no garantiza que las pruebas comprueben algo útil. Céntrate en la lógica de negocio y los caminos de error.</p>`},
 {t:"term", p:"Ejecuta todas las pruebas del módulo con el detector de carreras",
  prompt:"pablo@portatil:~/api$", sol:["go test -race ./...","go test ./... -race"],
  salida:"ok  \tgithub.com/pablo/api/internal/cache\t1.024s\nok  \tgithub.com/pablo/api/internal/pedidos\t0.311s",
  pista:"El flag se llama como lo que busca: carreras.",
  why:"Debería ser obligatorio en el CI de cualquier proyecto Go con concurrencia."},
 {t:"term", p:"Genera un perfil de cobertura en <code>cover.out</code> para todos los paquetes",
  prompt:"pablo@portatil:~/api$", sol:["go test -coverprofile=cover.out ./...","go test ./... -coverprofile=cover.out","go test -coverprofile cover.out ./..."],
  salida:"ok  \tgithub.com/pablo/api/internal/pedidos\t0.311s\tcoverage: 82.4% of statements",
  pista:"-coverprofile con el nombre del fichero.",
  why:"Después, go tool cover -html=cover.out lo muestra coloreado."},
 {t:"opcion", p:"El CI con <code>-race</code> pasa, pero en producción aparece un valor corrupto de vez en cuando. ¿Cómo es posible?",
  ops:["-race no funciona","El detector solo ve carreras que ocurren durante la ejecución: las pruebas no ejercitaban ese acceso concurrente","Producción no usa goroutines","Es un bug del compilador"],
  ok:1, why:"Escribe una prueba que lance las goroutines en paralelo sobre ese código y ejecútala con -race (y -count=100 si es esquiva)."},
 {t:"par", p:"Empareja cada herramienta con su función",
  pares:[["go vet","Análisis oficial incluido en Go"],["staticcheck","Linter avanzado: errores sutiles y código muerto"],["golangci-lint","Ejecutor de muchos linters con una sola configuración"],["gofmt -l","Listar ficheros sin formatear"],["go tool cover -html","Ver qué líneas cubren las pruebas"]],
  why:"go test ejecuta automáticamente un subconjunto de go vet antes de las pruebas."},
 {t:"vf", p:"Conviene compilar el binario de producción con <code>-race</code> para detectar carreras en tiempo real.",
  ok:false, why:"Multiplica el uso de CPU y memoria. Se usa en pruebas, CI y, como mucho, en un canario controlado."},
 {t:"escribe", p:"¿Qué subcomando abre en el navegador el informe de cobertura de <code>cover.out</code>? (el comando completo)",
  sol:["go tool cover -html=cover.out","go tool cover -html cover.out"],
  pista:"go tool cover con la opción html.",
  why:"Verde: ejecutado por alguna prueba. Rojo: nunca ejecutado."}
]}

]});
