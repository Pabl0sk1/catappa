window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "La JVM por dentro",
resumen: "Memoria heap y stack, recolección de basura, JIT, carga de clases, diagnóstico con JFR y volcados, y Java en contenedores",
nivel: "Experto",
color: "#b53b22",
lecciones: [

{
id:"jv13l1",
titulo:"Memoria: heap, stack y metaspace",
claves:["Stack: una por hilo, guarda llamadas y variables locales","Heap: compartido, guarda todos los objetos; lo limpia el GC","Metaspace: metadatos de las clases, fuera del heap"],
pasos:[
 {t:"info", eti:"Dónde vive cada cosa", h:"Las zonas de memoria",
  c:`<div class="dg"><div class="dg-tit">las zonas de memoria</div>
<svg viewBox="0 0 341 256" width="100%" style="max-width:460px;display:block;margin:auto" role="img" aria-label="La variable pedido del stack guarda una referencia al objeto Pedido del heap, que a su vez referencia un objeto Cliente; total es un primitivo guardado en el propio stack; las clases viven en el metaspace"><defs><marker id="fl-java13-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs><text x="82" y="16" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">STACK</text><text x="82" y="32" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">(una por hilo)</text><text x="257" y="16" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">HEAP</text><text x="257" y="32" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">(compartido)</text><rect x="5" y="44" width="155" height="96" rx="8" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="15" y="62" text-anchor="start" font-size="12" font-family="var(--mono)" fill="var(--accent)" font-weight="700">main()</text><text x="22" y="88" text-anchor="start" font-size="12" font-family="var(--mono)" fill="var(--ink)">pedido</text><text x="22" y="112" text-anchor="start" font-size="12" font-family="var(--mono)" fill="var(--ink)">total = 45.9</text><text x="22" y="129" text-anchor="start" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">(primitivo)</text><rect x="5" y="148" width="155" height="40" rx="8" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="15" y="172" text-anchor="start" font-size="12" font-family="var(--mono)" fill="var(--accent)" font-weight="700">confirmar()</text><text x="120" y="172" text-anchor="start" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">...</text><rect x="176" y="44" width="160" height="144" rx="8" fill="var(--bg-3)" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="5 4"/><rect x="188" y="54" width="136" height="60" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="256" y="74" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">objeto Pedido</text><text x="200" y="100" text-anchor="start" font-size="12" font-family="var(--mono)" fill="var(--ink)">cliente</text><rect x="188" y="140" width="136" height="38" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="256" y="163" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">objeto Cliente</text><circle cx="74" cy="84" r="3" fill="var(--accent)"/><line x1="74" y1="84" x2="186" y2="84" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-java13-1)"/><text x="118" y="78" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--accent)">referencia</text><circle cx="262" cy="96" r="3" fill="var(--accent)"/><path d="M262 96 H300 V137" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl-java13-1)"/><rect x="5" y="200" width="331" height="50" rx="8" fill="var(--bg-3)" stroke="var(--line-2)" stroke-width="1.5"/><text x="170" y="220" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink)" font-weight="700">METASPACE: definición de las clases</text><text x="170" y="240" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">(Pedido.class, Cliente.class...)</text></svg></div>
     <ul><li>Las <b>variables locales</b> y los parámetros viven en la pila del hilo; los primitivos directamente, los objetos como referencias.</li>
     <li>Los <b>objetos</b> siempre están en el heap.</li>
     <li>Demasiada recursión: <code>StackOverflowError</code>. Heap lleno: <code>OutOfMemoryError: Java heap space</code>.</li></ul>`},
 {t:"par", p:"Empareja cada error con la zona que se ha agotado",
  pares:[["StackOverflowError","La pila de un hilo (recursión infinita)"],["OutOfMemoryError: Java heap space","El heap: demasiados objetos vivos"],["OutOfMemoryError: Metaspace","Espacio de metadatos de clases"],["OOMKilled en Kubernetes","El contenedor superó su límite de memoria total"]],
  why:"La memoria del proceso es más que el heap: metaspace, pilas de hilos, buffers nativos..."},
 {t:"opcion", p:"¿Qué es una fuga de memoria en Java si hay recolector de basura?",
  ops:["No existen","Objetos que ya no se necesitan pero siguen referenciados (por ejemplo, en un Map estático que crece sin límite), así que el GC no puede liberarlos","Olvidar llamar a free()","Usar demasiados primitivos"],
  ok:1, why:"Cachés sin límite, listeners no eliminados y ThreadLocals no limpiados son los culpables típicos."},
 {t:"vf", p:"Cada hilo tiene su propia pila (stack), pero todos comparten el mismo heap.",
  ok:true, why:"Por eso los objetos pueden compartirse entre hilos, y por eso hay que sincronizarlos."}
]},

{
id:"jv13l2",
titulo:"Recolección de basura",
claves:["El GC libera objetos inalcanzables desde las raíces","Hipótesis generacional: la mayoría de objetos mueren jóvenes","G1 por defecto; ZGC para pausas mínimas en heaps grandes"],
pasos:[
 {t:"info", eti:"Limpieza automática", h:"Cómo decide el GC",
  c:`<p>El GC parte de las <b>raíces</b> (variables de las pilas, atributos estáticos...) y marca todo lo alcanzable. Lo que no se alcanza es basura.</p>
     <p>La mayoría de objetos viven muy poco (los de una petición HTTP). Por eso el heap se divide en <b>generación joven</b> (se limpia a menudo y rápido) y <b>generación vieja</b> (objetos longevos, se limpia menos).</p>`},
 {t:"par", p:"Empareja cada recolector con su característica",
  pares:[["G1","Por defecto: equilibrio entre rendimiento y pausas"],["ZGC","Pausas de milisegundos incluso con heaps enormes"],["Parallel GC","Máximo rendimiento para procesos por lotes, pausas más largas"],["Serial GC","Un solo hilo: contenedores muy pequeños"]],
  why:"Para la mayoría de APIs, G1 va bien; si las pausas importan mucho, ZGC generacional (Java 21+)."},
 {t:"info", eti:"Síntomas", h:"Cuando el GC es un problema",
  c:`<ul><li>Pausas largas que coinciden con picos de latencia.</li>
     <li>El GC ocupa gran parte de la CPU y apenas libera memoria: el heap está casi lleno de objetos vivos (antesala del OutOfMemoryError).</li></ul>
     <div class="termbox">java -Xlog:gc*:file=gc.log -jar app.jar       <span class="cm"># registrar la actividad del GC</span></div>`},
 {t:"opcion", p:"Tras horas funcionando, la API va cada vez más lenta y el uso de heap tras cada GC no baja. ¿Qué sospechas?",
  ops:["Falta CPU","Una fuga de memoria: objetos que se acumulan y no se liberan","El disco","DNS"],
  ok:1, why:"Un volcado de heap (heap dump) analizado con Eclipse MAT muestra qué objetos acumulan memoria."},
 {t:"vf", p:"Llamar a <code>System.gc()</code> garantiza que la memoria se libera en ese momento.",
  ok:false, why:"Es solo una sugerencia que la JVM puede ignorar. No se usa en código normal."}
]},

{
id:"jv13l3",
titulo:"JIT, arranque y diagnóstico",
claves:["El JIT compila a código nativo lo más usado: la JVM «calienta»","JFR y JDK Mission Control para perfilar en producción","jcmd, volcados de hilos y de heap para diagnosticar"],
pasos:[
 {t:"info", eti:"Calentar", h:"Compilación JIT",
  c:`<p>Al arrancar, la JVM interpreta el bytecode. Detecta los métodos más usados (<b>hot spots</b>) y los compila a código nativo optimizado. Por eso una aplicación Java va más rápida tras unos minutos que en las primeras peticiones.</p>
     <p>Para arranques muy rápidos existen <b>GraalVM Native Image</b> (compilación anticipada a un ejecutable nativo) y <b>CRaC</b> o <b>AppCDS</b>, útiles en serverless o escalado rápido.</p>`},
 {t:"info", eti:"Herramientas", h:"Diagnosticar una JVM viva",
  c:`<div class="termbox">jcmd                                  <span class="cm"># listar JVMs</span>
jcmd 4211 Thread.print                <span class="cm"># volcado de hilos: que hace cada hilo</span>
jcmd 4211 GC.heap_dump /tmp/heap.hprof   <span class="cm"># volcado de heap para Eclipse MAT</span>
jcmd 4211 JFR.start duration=60s filename=rec.jfr   <span class="cm"># grabacion de Java Flight Recorder</span>
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps -jar app.jar</div>`},
 {t:"par", p:"Empareja cada síntoma con la herramienta adecuada",
  pares:[["La aplicación está colgada","Volcado de hilos (jcmd Thread.print)"],["OutOfMemoryError","Volcado de heap y Eclipse MAT"],["CPU alta, no sé en qué","Java Flight Recorder y un perfilador"],["Pausas largas","Registro del GC (-Xlog:gc)"]],
  why:"Un volcado de hilos con muchos hilos esperando el mismo candado revela contención o deadlocks."},
 {t:"opcion", p:"¿Por qué las primeras peticiones tras desplegar son más lentas?",
  ops:["Por el DNS","La JVM aún no ha compilado con JIT el código caliente, y se inicializan cachés y pools","Por el disco","Porque Java es interpretado siempre"],
  ok:1, why:"Se mitiga con peticiones de calentamiento antes de recibir tráfico (readiness) o con AppCDS/CRaC."}
]},

{
id:"jv13l4",
titulo:"Java en contenedores",
claves:["La JVM moderna respeta los límites del contenedor (cgroups)","-XX:MaxRAMPercentage en vez de -Xmx fijo","Deja margen: memoria total = heap + metaspace + hilos + nativa"],
pasos:[
 {t:"info", eti:"Docker y Kubernetes", h:"Dimensionar la memoria",
  c:`<p>Desde Java 10, la JVM detecta los límites del contenedor. Por defecto usa solo un 25% de la memoria para el heap, lo que suele ser poco. Mejor:</p>
     <div class="termbox">ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"</div>
     <ul><li>No uses un <code>-Xmx</code> igual al límite del contenedor: el proceso usa más memoria que el heap y Kubernetes lo matará (<b>OOMKilled</b>).</li>
     <li><code>ExitOnOutOfMemoryError</code>: si hay OOM, que el proceso muera y el orquestador lo reinicie limpio.</li>
     <li>En Kubernetes, request = limit de memoria para aplicaciones Java suele evitar sorpresas.</li></ul>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["-XX:MaxRAMPercentage=75","Heap máximo como porcentaje de la memoria del contenedor"],["-Xmx512m","Heap máximo fijo"],["-XX:+ExitOnOutOfMemoryError","Terminar el proceso ante un OOM"],["JAVA_TOOL_OPTIONS","Variable que la JVM lee al arrancar"]],
  why:"Porcentajes en vez de valores fijos: la misma imagen funciona con distintos límites."},
 {t:"opcion", p:"Tu pod Java con límite de 1 GiB y <code>-Xmx1g</code> reinicia con OOMKilled sin ningún OutOfMemoryError en los logs. ¿Por qué?",
  ops:["Un bug de Kubernetes","El proceso usa heap + metaspace + pilas + memoria nativa; con heap de 1 GiB supera el límite y el kernel lo mata","Falta CPU","El GC está desactivado"],
  ok:1, why:"Deja un 20-30% de margen fuera del heap."},
 {t:"vf", p:"Las JVM modernas detectan automáticamente la memoria y CPU asignadas al contenedor.",
  ok:true, why:"Soportan cgroups v1 y v2. Versiones muy antiguas de Java 8 no lo hacían."}
]}

]});
