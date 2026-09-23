window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Excepciones",
resumen: "try, catch y finally, excepciones comprobadas y no comprobadas, try-with-resources, excepciones propias y buenas prácticas",
nivel: "Intermedio",
color: "#d05439",
lecciones: [

{
id:"jv7l1",
titulo:"try, catch y finally",
claves:["Una excepción interrumpe el flujo normal cuando algo va mal","try intenta; catch gestiona; finally se ejecuta siempre","Lee la traza de pila: tipo, mensaje y la línea donde ocurrió"],
pasos:[
 {t:"info", eti:"Cuando algo falla", h:"Capturar excepciones",
  c:`<div class="termbox">try {
    int cantidad = Integer.parseInt(entrada);
    procesar(cantidad);
} catch (NumberFormatException e) {
    System.out.println("No es un número: " + entrada);
} finally {
    System.out.println("Esto se ejecuta siempre");
}</div>
     <p>Si algo dentro del <code>try</code> lanza una excepción, el resto del try se salta y se busca un <code>catch</code> compatible. Si nadie la captura, sube por la pila de llamadas hasta terminar el hilo (o hasta que Spring la convierta en un error 500).</p>`},
 {t:"info", eti:"Leer el error", h:"La traza de pila",
  c:`<div class="termbox">Exception in thread "main" java.lang.NullPointerException:
    Cannot invoke "Cliente.getEmail()" because "cliente" is null
	at com.catappa.PedidoService.confirmar(PedidoService.java:42)
	at com.catappa.PedidoController.crear(PedidoController.java:27)
	at com.catappa.App.main(App.java:10)</div>
     <p>Primera línea: <b>tipo</b> y <b>mensaje</b>. Debajo, la pila de llamadas: la primera línea con <b>tu</b> código (PedidoService.java:42) es donde mirar primero.</p>`},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">try {
    System.out.print("A ");
    int x = 10 / 0;
    System.out.print("B ");
} catch (ArithmeticException e) {
    System.out.print("C ");
} finally {
    System.out.print("D");
}</div>`,
  ops:["A B C D","A C D","A D","C D"],
  ok:1, why:"La división entre cero lanza ArithmeticException: B se salta, se ejecuta el catch y finally siempre."},
 {t:"par", p:"Empareja cada excepción con su causa típica",
  pares:[["NullPointerException","Usar una referencia que es null"],["ArrayIndexOutOfBoundsException","Índice fuera del array"],["NumberFormatException","Convertir a número un texto que no lo es"],["IllegalArgumentException","Un argumento con un valor no válido"],["ClassCastException","Convertir un objeto a un tipo que no es"]],
  why:"Reconocerlas por el nombre acelera mucho la depuración."},
 {t:"vf", p:"El bloque <code>finally</code> se ejecuta aunque dentro del <code>try</code> haya un <code>return</code>.",
  ok:true, why:"Se ejecuta antes de salir del método. Por eso se usaba para liberar recursos."}
]},

{
id:"jv7l2",
titulo:"Comprobadas y no comprobadas",
claves:["Checked (Exception): el compilador obliga a capturarlas o declararlas con throws","Unchecked (RuntimeException): errores de programación o de negocio, no obligan","Error: problemas graves de la JVM (OutOfMemoryError) que no se capturan"],
pasos:[
 {t:"info", eti:"La jerarquía", h:"Tipos de excepciones",
  c:`<div class="dg dg-arbol"><div class="dg-tit">jerarquía de excepciones</div>
<div class="rama" style="--n:0"><span class="nom carpeta">Throwable</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">Error</span><span class="coment">problemas graves de la JVM (no capturar)</span></div>
<div class="rama" style="--n:2"><span class="nom">OutOfMemoryError</span></div>
<div class="rama" style="--n:2"><span class="nom">StackOverflowError</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">Exception</span><span class="coment">COMPROBADAS: obligan a try/catch o throws</span></div>
<div class="rama" style="--n:2"><span class="nom">IOException</span></div>
<div class="rama" style="--n:2"><span class="nom">SQLException...</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">RuntimeException</span><span class="coment">NO COMPROBADAS</span></div>
<div class="rama" style="--n:3"><span class="nom">NullPointerException</span></div>
<div class="rama" style="--n:3"><span class="nom">IllegalArgumentException</span></div>
<div class="rama" style="--n:3"><span class="nom">IllegalStateException...</span></div>
</div>`},
 {t:"info", eti:"throws", h:"Declarar o capturar",
  c:`<div class="termbox">public String leerConfig(Path ruta) throws IOException {   <span class="cm">// la declara: que la gestione quien llame</span>
    return Files.readString(ruta);
}</div>
     <p>Con una excepción comprobada, el compilador te obliga a elegir: <b>capturarla</b> o <b>declararla</b> con <code>throws</code>. Con una no comprobada, no.</p>
     <p>En aplicaciones Spring modernas se tiende a usar excepciones <b>no comprobadas</b> y gestionarlas en un solo punto (<code>@RestControllerAdvice</code>).</p>`},
 {t:"par", p:"Empareja cada excepción con su categoría",
  pares:[["IOException","Comprobada"],["IllegalStateException","No comprobada"],["OutOfMemoryError","Error de la JVM"],["SQLException","Comprobada (en JDBC)"]],
  why:"Spring traduce las SQLException comprobadas a DataAccessException no comprobadas."},
 {t:"opcion", p:"Tu método llama a <code>Files.readString(ruta)</code>, que declara <code>throws IOException</code>, y no haces nada más. ¿Qué pasa?",
  ops:["Compila y funciona","Error de compilación: «unreported exception IOException; must be caught or declared to be thrown»","Error en ejecución","Se ignora la excepción"],
  ok:1, why:"Es una excepción comprobada: el compilador exige tratarla."},
 {t:"vf", p:"Es buena práctica capturar <code>OutOfMemoryError</code> y seguir como si nada.",
  ok:false, why:"Los Error indican que la JVM está en un estado del que no se puede recuperar de forma fiable."}
]},

{
id:"jv7l3",
titulo:"try-with-resources y excepciones propias",
claves:["try-with-resources cierra automáticamente lo que implementa AutoCloseable","Crea excepciones propias para errores de negocio con significado","throw lanza una excepción; encadénala con la causa original"],
pasos:[
 {t:"info", eti:"Cerrar siempre", h:"try-with-resources",
  c:`<div class="termbox">try (BufferedReader lector = Files.newBufferedReader(ruta);
     Connection con = dataSource.getConnection()) {
    ...
}   <span class="cm">// lector y con se cierran solos, incluso si hay excepcion</span></div>
     <p>Antes había que cerrar en <code>finally</code> con código farragoso y fácil de olvidar. Olvidar cerrar conexiones o ficheros provoca <b>fugas de recursos</b>.</p>`},
 {t:"info", eti:"Errores con significado", h:"Excepciones propias",
  c:`<div class="termbox">public class PedidoNoEncontradoException extends RuntimeException {
    public PedidoNoEncontradoException(long id) {
        super("No existe el pedido " + id);
    }
}

Pedido p = repo.findById(id).orElseThrow(() -&gt; new PedidoNoEncontradoException(id));

<span class="cm">// encadenar la causa: no pierdas el error original</span>
try { ... } catch (IOException e) {
    throw new ImportacionException("Fallo al leer " + fichero, e);
}</div>`},
 {t:"hueco", p:"Completa para que el lector se cierre solo",
  tpl:"___ (var lector = Files.newBufferedReader(ruta)) {\n    return lector.readLine();\n}", banco:["try","catch","finally","with"], sol:["try"],
  why:"Los recursos se declaran entre paréntesis después de try."},
 {t:"opcion", p:"¿Qué tiene de malo esto?", c:`<div class="termbox">try {
    guardar(pedido);
} catch (Exception e) {
}</div>`,
  ops:["Nada, así no falla","Se traga el error en silencio: el pedido no se guarda y nadie se entera. Como mínimo, registrar y relanzar o gestionar","Debería ser catch (Throwable e)","Falta finally"],
  ok:1, why:"Un catch vacío es uno de los peores antipatrones: esconde fallos reales."},
 {t:"par", p:"Empareja cada práctica con su motivo",
  pares:[["Excepción propia de negocio","El error tiene un significado claro (pedido no encontrado)"],["Pasar la causa al relanzar","No perder la traza original"],["try-with-resources","Cerrar recursos aunque haya errores"],["Capturar lo más específico posible","No tratar igual errores distintos"]],
  why:"En Spring, un @RestControllerAdvice convierte PedidoNoEncontradoException en un 404 limpio."}
]}

]});
