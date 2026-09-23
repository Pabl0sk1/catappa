window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Concurrencia",
resumen: "Hilos, condiciones de carrera, synchronized y atomics, ExecutorService, CompletableFuture, colecciones concurrentes e hilos virtuales",
nivel: "Experto",
color: "#b53b22",
lecciones: [

{
id:"jv12l1",
titulo:"Hilos y condiciones de carrera",
claves:["Un hilo es una línea de ejecución; varios hilos comparten la memoria del proceso","Condición de carrera: el resultado depende del orden en que se intercalan los hilos","count++ no es atómico: leer, sumar y escribir"],
pasos:[
 {t:"info", eti:"Hacer varias cosas", h:"Hilos",
  c:`<div class="termbox">Thread t = new Thread(() -&gt; System.out.println("Hola desde " + Thread.currentThread().getName()));
t.start();     <span class="cm">// start, no run: run() lo ejecutaria en el hilo actual</span>
t.join();      <span class="cm">// esperar a que termine</span></div>
     <p>Un servidor web atiende cada petición en un hilo (o en hilos virtuales). Por eso tu código de Spring se ejecuta en paralelo, y los objetos compartidos (los beans singleton) deben ser seguros entre hilos.</p>`},
 {t:"info", eti:"El peligro", h:"Condiciones de carrera",
  c:`<div class="termbox">class Contador {
    private int valor = 0;
    void incrementar() { valor++; }     <span class="cm">// leer, sumar 1, escribir: 3 pasos</span>
}
<span class="cm">// 2 hilos x 1000 incrementos = casi nunca 2000</span></div>
     <div class="dg"><div class="dg-tit">dos hilos incrementan el mismo contador</div>
<div class="dg-pila">
<div class="dg-fila"><div class="dg-caja acento">hilo A</div><div class="dg-caja acento">hilo B</div></div>
<div class="dg-fila"><div class="dg-caja">lee 5</div><div class="dg-caja">lee 5</div></div>
<div class="dg-fila"><div class="dg-caja">escribe 6</div><div class="dg-caja">escribe 6</div></div>
<div class="dg-caja aviso">se ha perdido un incremento</div>
</div></div>`},
 {t:"opcion", p:"¿Por qué un bean <code>@Service</code> de Spring con un atributo <code>private int contador</code> que se incrementa en cada petición es un problema?",
  ops:["No lo es","Los beans son singleton: todas las peticiones (hilos) comparten ese atributo y se producen condiciones de carrera","Porque int es pequeño","Porque Spring no admite atributos"],
  ok:1, why:"Regla: los servicios no deben tener estado mutable compartido. Si hace falta, AtomicInteger o mejor guardarlo fuera (base de datos, Redis)."},
 {t:"vf", p:"Llamar a <code>thread.run()</code> arranca un hilo nuevo.",
  ok:false, why:"run() ejecuta el código en el hilo actual. start() es el que crea el hilo nuevo."}
]},

{
id:"jv12l2",
titulo:"Sincronización y atomics",
claves:["synchronized: solo un hilo a la vez en el bloque (exclusión mutua)","AtomicInteger, AtomicLong, LongAdder para contadores sin bloqueos","volatile garantiza visibilidad, no atomicidad; prefiere objetos inmutables"],
pasos:[
 {t:"info", eti:"Uno cada vez", h:"synchronized y locks",
  c:`<div class="termbox">class Contador {
    private int valor;
    synchronized void incrementar() { valor++; }
    synchronized int valor() { return valor; }
}

<span class="cm">// mejor para contadores</span>
private final AtomicInteger valor = new AtomicInteger();
valor.incrementAndGet();

<span class="cm">// lock explicito, con timeout</span>
private final ReentrantLock lock = new ReentrantLock();
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try { ... } finally { lock.unlock(); }
}</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["synchronized","Exclusión mutua sencilla en un método o bloque"],["AtomicInteger","Contador atómico sin bloqueos"],["volatile","Que todos los hilos vean el último valor escrito"],["ReentrantLock","Bloqueo con tryLock, timeout o varias condiciones"],["Objeto inmutable","Se comparte sin sincronizar"]],
  why:"La forma más segura de concurrencia es no compartir estado mutable."},
 {t:"info", eti:"Abrazo mortal", h:"Deadlock",
  c:`<p>Hilo 1 tiene el candado A y espera el B; hilo 2 tiene el B y espera el A: se bloquean para siempre. Se evita adquiriendo los candados <b>siempre en el mismo orden</b>, usando <code>tryLock</code> con timeout, o evitando candados anidados.</p>`},
 {t:"opcion", p:"¿Qué garantiza <code>volatile</code>?",
  ops:["Que count++ sea atómico","Que las escrituras de un hilo sean visibles para los demás, sin atomicidad de operaciones compuestas","Que solo un hilo acceda","Que el valor no cambie"],
  ok:1, why:"volatile sirve para banderas (boolean parar). Para incrementos, atomics o synchronized."},
 {t:"vf", p:"Un objeto inmutable (como un record con campos inmutables) se puede compartir entre hilos sin sincronización.",
  ok:true, why:"Si nada puede cambiar, no hay carreras. Por eso se favorece la inmutabilidad."}
]},

{
id:"jv12l3",
titulo:"Executors y CompletableFuture",
claves:["ExecutorService gestiona un grupo de hilos reutilizables","Future y CompletableFuture representan resultados que llegarán","CompletableFuture encadena y combina tareas asíncronas"],
pasos:[
 {t:"info", eti:"Grupos de hilos", h:"ExecutorService",
  c:`<div class="termbox">try (ExecutorService pool = Executors.newFixedThreadPool(8)) {
    Future&lt;Informe&gt; f = pool.submit(() -&gt; generarInforme(mes));
    Informe informe = f.get(30, TimeUnit.SECONDS);
}   <span class="cm">// Java 19+: close() espera a que terminen las tareas</span></div>
     <p>Crear hilos es caro. Un <b>pool</b> reutiliza un número fijo de hilos y encola las tareas.</p>`},
 {t:"info", eti:"Componer", h:"CompletableFuture",
  c:`<div class="termbox">CompletableFuture&lt;Cliente&gt; cli = CompletableFuture.supplyAsync(() -&gt; clientes.buscar(id), pool);
CompletableFuture&lt;List&lt;Pedido&gt;&gt; peds = CompletableFuture.supplyAsync(() -&gt; pedidos.deCliente(id), pool);

Perfil perfil = cli.thenCombine(peds, Perfil::new)     <span class="cm">// las dos llamadas en paralelo</span>
    .orTimeout(2, TimeUnit.SECONDS)
    .exceptionally(e -&gt; Perfil.vacio())
    .join();</div>
     <p>Si cada llamada tarda 300 ms, en paralelo el total ronda los 300 ms en vez de 600.</p>`},
 {t:"par", p:"Empareja cada método de CompletableFuture con su función",
  pares:[["supplyAsync","Ejecutar una tarea que devuelve un valor en otro hilo"],["thenApply","Transformar el resultado cuando llegue"],["thenCompose","Encadenar otra operación asíncrona"],["thenCombine","Combinar dos resultados independientes"],["exceptionally","Valor alternativo si hay error"]],
  why:"thenApply es como map y thenCompose como flatMap."},
 {t:"opcion", p:"¿Por qué conviene pasar tu propio executor a <code>supplyAsync</code> en un servidor?",
  ops:["No conviene","Sin él se usa el ForkJoinPool común, compartido por toda la JVM; tareas bloqueantes (red, base de datos) pueden agotarlo","Porque es obligatorio","Para que sea síncrono"],
  ok:1, why:"Separar pools evita que una parte lenta del sistema bloquee a las demás."}
]},

{
id:"jv12l4",
titulo:"Colecciones concurrentes e hilos virtuales",
claves:["ConcurrentHashMap, CopyOnWriteArrayList y BlockingQueue para compartir datos entre hilos","Hilos virtuales (Java 21): millones de hilos baratos para trabajo bloqueante","Con hilos virtuales, código síncrono sencillo escala como el asíncrono"],
pasos:[
 {t:"info", eti:"Compartir datos", h:"Colecciones concurrentes",
  c:`<div class="termbox">Map&lt;String, Integer&gt; visitas = new ConcurrentHashMap&lt;&gt;();
visitas.merge(pagina, 1, Integer::sum);          <span class="cm">// atomico</span>

BlockingQueue&lt;Trabajo&gt; cola = new LinkedBlockingQueue&lt;&gt;(1000);
cola.put(trabajo);          <span class="cm">// productor: espera si esta llena</span>
Trabajo t = cola.take();    <span class="cm">// consumidor: espera si esta vacia</span></div>
     <p>Un <code>HashMap</code> normal modificado desde varios hilos puede corromperse. <code>Collections.synchronizedMap</code> funciona, pero bloquea todo el mapa; <code>ConcurrentHashMap</code> escala mucho mejor.</p>`},
 {t:"info", eti:"Java 21", h:"Hilos virtuales",
  c:`<p>Un hilo clásico es un hilo del sistema operativo: pesado (≈1 MB de pila) y limitado a unos miles. Un servidor con 200 hilos que esperan a la base de datos no puede atender la petición 201.</p>
     <p>Los <b>hilos virtuales</b> los gestiona la JVM: son baratísimos y, cuando uno espera E/S, libera su hilo real para otro. Puedes tener <b>millones</b>.</p>
     <div class="termbox">try (var ex = Executors.newVirtualThreadPerTaskExecutor()) {
    for (var url : urls) ex.submit(() -&gt; descargar(url));
}

<span class="cm"># Spring Boot 3.2+</span>
spring.threads.virtual.enabled=true</div>`},
 {t:"par", p:"Empareja cada estructura con su caso de uso",
  pares:[["ConcurrentHashMap","Mapa compartido con muchas lecturas y escrituras concurrentes"],["CopyOnWriteArrayList","Lista que casi nunca cambia y se lee mucho (listeners)"],["BlockingQueue","Productores y consumidores"],["Hilos virtuales","Muchas tareas que pasan el tiempo esperando E/S"]],
  why:"Los hilos virtuales no aceleran el cálculo intensivo de CPU: ayudan cuando se espera."},
 {t:"opcion", p:"¿En qué tipo de aplicación brillan los hilos virtuales?",
  ops:["Cálculo científico que usa el 100% de la CPU","Una API que por cada petición espera a la base de datos y a otros servicios","Una aplicación de un solo hilo","Ninguna"],
  ok:1, why:"Mientras un hilo virtual espera, el hilo real atiende a otros. Escalas sin programar de forma reactiva."},
 {t:"vf", p:"Un <code>HashMap</code> normal es seguro para modificarlo desde varios hilos a la vez.",
  ok:false, why:"Puede perder datos o corromperse. Usa ConcurrentHashMap."}
]}

]});
