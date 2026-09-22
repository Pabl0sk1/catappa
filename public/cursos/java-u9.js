window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Lambdas, streams y Optional",
resumen: "Programación funcional en Java: lambdas, interfaces funcionales, referencias a métodos, la API Stream, collectors y Optional",
nivel: "Avanzado",
color: "#c74b31",
lecciones: [

{
id:"jv9l1",
titulo:"Lambdas e interfaces funcionales",
claves:["Una lambda es una función anónima: (parámetros) -> expresión","Una interfaz funcional tiene un único método abstracto","Function, Predicate, Consumer, Supplier y referencias a métodos (Clase::metodo)"],
pasos:[
 {t:"info", eti:"Funciones como valores", h:"Lambdas",
  c:`<div class="termbox"><span class="cm">// antes: clase anonima</span>
productos.sort(new Comparator&lt;Producto&gt;() {
    public int compare(Producto a, Producto b) { return Double.compare(a.precio(), b.precio()); }
});

<span class="cm">// con lambda</span>
productos.sort((a, b) -&gt; Double.compare(a.precio(), b.precio()));

<span class="cm">// con referencia a metodo</span>
productos.sort(Comparator.comparing(Producto::precio));</div>
     <p>Una lambda puede usarse donde se espera una <b>interfaz funcional</b>: una interfaz con un solo método abstracto (Comparator, Runnable...).</p>`},
 {t:"par", p:"Empareja cada interfaz funcional con su forma",
  pares:[["Function<T, R>","Recibe T y devuelve R"],["Predicate<T>","Recibe T y devuelve boolean"],["Consumer<T>","Recibe T y no devuelve nada"],["Supplier<T>","No recibe nada y devuelve T"],["Runnable","Ni recibe ni devuelve"]],
  why:"Están en java.util.function y las usan los streams, Optional y Spring."},
 {t:"par", p:"Empareja cada lambda con su referencia a método equivalente",
  pares:[["s -> s.toUpperCase()","String::toUpperCase"],["x -> System.out.println(x)","System.out::println"],["() -> new ArrayList<>()","ArrayList::new"],["s -> Integer.parseInt(s)","Integer::parseInt"]],
  why:"Las referencias a métodos son más cortas cuando la lambda solo llama a un método."},
 {t:"opcion", p:"¿Por qué no compila esta lambda?", c:`<div class="termbox">int total = 0;
pedidos.forEach(p -&gt; total += p.importe());</div>`,
  ops:["forEach no admite lambdas","Las variables locales usadas en una lambda deben ser efectivamente finales; no se pueden modificar","Falta return","importe no existe"],
  ok:1, why:"Para sumar se usa un stream: pedidos.stream().mapToDouble(Pedido::importe).sum()."},
 {t:"vf", p:"Cualquier interfaz con varios métodos abstractos puede implementarse con una lambda.",
  ok:false, why:"Solo las interfaces con un único método abstracto (funcionales). @FunctionalInterface lo comprueba."}
]},

{
id:"jv9l2",
titulo:"La API Stream",
claves:["Un stream procesa una secuencia en una cadena: origen, operaciones intermedias y una terminal","filter, map, sorted, distinct, limit son intermedias y perezosas","collect, toList, count, sum, anyMatch, findFirst son terminales"],
pasos:[
 {t:"info", eti:"Tuberías de datos", h:"Cómo se lee un stream",
  c:`<div class="termbox">List&lt;String&gt; emailsVip = clientes.stream()        <span class="cm">// origen</span>
    .filter(c -&gt; c.gastado() &gt; 1000)                  <span class="cm">// quedarse con algunos</span>
    .sorted(Comparator.comparing(Cliente::gastado).reversed())
    .map(Cliente::email)                             <span class="cm">// transformar</span>
    .limit(10)
    .toList();                                       <span class="cm">// terminal: produce el resultado</span></div>
     <p>Las operaciones intermedias son <b>perezosas</b>: no se ejecuta nada hasta la operación terminal. Un stream <b>no modifica</b> la colección original y solo se puede recorrer <b>una vez</b>.</p>`},
 {t:"orden", p:"Ordena este stream para obtener los nombres, en mayúsculas y ordenados, de los productos con stock",
  items:["productos.stream()",".filter(p -> p.stock() > 0)",".map(Producto::nombre)",".map(String::toUpperCase)",".sorted()",".toList()"],
  why:"Filtrar pronto reduce el trabajo del resto de la cadena."},
 {t:"par", p:"Empareja cada operación con lo que hace",
  pares:[["filter","Quedarse con los elementos que cumplen una condición"],["map","Transformar cada elemento en otro"],["flatMap","Aplanar: cada elemento produce varios"],["reduce","Combinar todos en un único valor"],["anyMatch","¿Alguno cumple la condición?"]],
  why:"Con estas cinco y collect se resuelve casi todo."},
 {t:"opcion", p:"¿Qué devuelve?", c:`<div class="termbox">List.of(1, 2, 3, 4, 5, 6).stream()
    .filter(n -&gt; n % 2 == 0)
    .map(n -&gt; n * n)
    .reduce(0, Integer::sum);</div>`,
  ops:["21","56","91","12"],
  ok:1, why:"Pares: 2, 4, 6. Cuadrados: 4, 16, 36. Suma: 56."},
 {t:"vf", p:"<code>lista.stream().map(...)</code> sin operación terminal no ejecuta el map.",
  ok:true, why:"Sin terminal no se procesa nada: las intermedias son perezosas."}
]},

{
id:"jv9l3",
titulo:"Collectors",
claves:["collect(Collectors.X) convierte el stream en colecciones o resúmenes","groupingBy agrupa; counting, summingDouble, averagingDouble agregan","toMap, joining y partitioningBy completan lo habitual"],
pasos:[
 {t:"info", eti:"Recoger", h:"Collectors más usados",
  c:`<div class="termbox"><span class="cm">// agrupar pedidos por estado</span>
Map&lt;Estado, List&lt;Pedido&gt;&gt; porEstado = pedidos.stream()
    .collect(Collectors.groupingBy(Pedido::estado));

<span class="cm">// facturacion por cliente</span>
Map&lt;Long, Double&gt; porCliente = pedidos.stream()
    .collect(Collectors.groupingBy(Pedido::clienteId, Collectors.summingDouble(Pedido::total)));

<span class="cm">// contar por categoria</span>
Map&lt;String, Long&gt; cuenta = productos.stream()
    .collect(Collectors.groupingBy(Producto::categoria, Collectors.counting()));

<span class="cm">// id -&gt; producto</span>
Map&lt;Long, Producto&gt; porId = productos.stream()
    .collect(Collectors.toMap(Producto::id, p -&gt; p));

<span class="cm">// texto</span>
String csv = nombres.stream().collect(Collectors.joining(", ", "[", "]"));

<span class="cm">// dos grupos: true / false</span>
Map&lt;Boolean, List&lt;Producto&gt;&gt; conStock = productos.stream()
    .collect(Collectors.partitioningBy(p -&gt; p.stock() &gt; 0));</div>`},
 {t:"par", p:"Empareja cada collector con su resultado",
  pares:[["groupingBy(f)","Map de clave a lista de elementos"],["groupingBy(f, counting())","Map de clave a número de elementos"],["toMap(k, v)","Map con la clave y el valor indicados"],["joining(\", \")","Un único String con separador"],["partitioningBy(p)","Map con dos grupos: true y false"]],
  why:"groupingBy es el GROUP BY de SQL dentro de Java."},
 {t:"opcion", p:"<code>Collectors.toMap(Producto::categoria, p -&gt; p)</code> falla con «Duplicate key». ¿Por qué?",
  ops:["Un bug de Java","Hay varios productos con la misma categoría y toMap no sabe cuál quedarse. Usa groupingBy o pasa una función de fusión","La categoría es null","Falta un sorted"],
  ok:1, why:"toMap(k, v, (a, b) -> a) indica qué hacer ante claves repetidas."},
 {t:"vf", p:"<code>stream.toList()</code> (Java 16+) devuelve una lista inmutable.",
  ok:true, why:"Collectors.toList() no garantiza mutabilidad ni inmutabilidad; toList() es claramente inmutable."}
]},

{
id:"jv9l4",
titulo:"Optional",
claves:["Optional&lt;T&gt; representa un valor que puede no estar","orElse, orElseGet, orElseThrow, map, ifPresent: sin null checks","Úsalo como tipo de retorno; no en atributos ni parámetros"],
pasos:[
 {t:"info", eti:"Adiós null", h:"Qué es Optional",
  c:`<div class="termbox">Optional&lt;Cliente&gt; c = repo.findByEmail(email);

String nombre = c.map(Cliente::nombre).orElse("Invitado");
Cliente cli = c.orElseThrow(() -&gt; new ClienteNoEncontradoException(email));
c.ifPresent(x -&gt; enviarBienvenida(x));
boolean existe = c.isPresent();</div>
     <p>Un método que devuelve <code>Optional</code> te obliga a pensar en el caso «no está», en vez de devolver <code>null</code> y esperar que quien llama se acuerde de comprobarlo.</p>`},
 {t:"par", p:"Empareja cada método de Optional con su comportamiento",
  pares:[["orElse(x)","Devuelve x si está vacío (x se evalúa siempre)"],["orElseGet(() -> x)","Calcula x solo si está vacío"],["orElseThrow(...)","Lanza la excepción indicada si está vacío"],["map(f)","Transforma el valor si existe"],["ifPresent(c)","Ejecuta una acción solo si hay valor"]],
  why:"orElse(crearCaro()) ejecuta crearCaro() siempre; orElseGet solo cuando hace falta."},
 {t:"opcion", p:"¿Cuál es el peor uso de Optional?",
  ops:["Como retorno de findById","optional.get() sin comprobar si hay valor","optional.orElseThrow()","optional.map(...).orElse(...)"],
  ok:1, why:"get() sobre un Optional vacío lanza NoSuchElementException: es el mismo problema que el null, con más ceremonia."},
 {t:"vf", p:"Es buena práctica declarar los atributos de una entidad JPA como <code>Optional</code>.",
  ok:false, why:"Optional está pensado como tipo de retorno. En atributos y parámetros añade complejidad y no es serializable."}
]}

]});
