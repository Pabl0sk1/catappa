window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Colecciones y genéricos",
resumen: "List, Set, Map y Queue, sus implementaciones, recorrer y ordenar con Comparator, colecciones inmutables y genéricos",
nivel: "Intermedio",
color: "#d05439",
lecciones: [

{
id:"jv8l1",
titulo:"List",
claves:["List: colección ordenada que admite duplicados y acceso por índice","ArrayList es la implementación por defecto","List.of crea listas inmutables"],
pasos:[
 {t:"info", eti:"Listas", h:"ArrayList",
  c:`<div class="termbox">List&lt;String&gt; tareas = new ArrayList&lt;&gt;();
tareas.add("Comprar dominio");
tareas.add("Configurar DNS");
tareas.add(0, "Elegir nombre");     <span class="cm">// insertar en una posicion</span>
tareas.get(1);                      <span class="cm">// "Comprar dominio"</span>
tareas.size();                      <span class="cm">// 3</span>
tareas.contains("Configurar DNS");  <span class="cm">// true</span>
tareas.remove("Elegir nombre");
tareas.set(0, "Registrar dominio");
tareas.isEmpty();                   <span class="cm">// false</span></div>
     <p>Declara la variable con la <b>interfaz</b> (<code>List</code>) y crea con la implementación (<code>ArrayList</code>). Así puedes cambiar la implementación sin tocar el resto del código.</p>`},
 {t:"info", eti:"Inmutables", h:"List.of y copias",
  c:`<div class="termbox">List&lt;String&gt; dias = List.of("lun", "mar", "mie");
dias.add("jue");                     <span class="cm">// UnsupportedOperationException</span>
List&lt;String&gt; copia = new ArrayList&lt;&gt;(dias);   <span class="cm">// copia modificable</span>
List&lt;String&gt; soloLectura = List.copyOf(lista);</div>
     <p>Devolver colecciones inmutables evita que otras partes del código modifiquen tus datos por sorpresa.</p>`},
 {t:"escribe", p:"Crea una lista modificable de String llamada <code>nombres</code>",
  sol:["List<String> nombres = new ArrayList<>();","var nombres = new ArrayList<String>();","List<String> nombres = new ArrayList<String>();","ArrayList<String> nombres = new ArrayList<>();"], ph:"List<String> nombres = ...", pista:"List&lt;String&gt; nombres = new ArrayList&lt;&gt;();", why:"El &lt;&gt; vacío (diamante) deja que el compilador deduzca el tipo."},
 {t:"opcion", p:"¿Qué ocurre con <code>List.of(\"a\", \"b\").add(\"c\")</code>?",
  ops:["La lista pasa a tener 3 elementos","UnsupportedOperationException: List.of es inmutable","Error de compilación","Devuelve false"],
  ok:1, why:"Compila (el tipo es List), pero falla al ejecutar."},
 {t:"vf", p:"ArrayList permite guardar elementos repetidos.",
  ok:true, why:"Las List admiten duplicados y mantienen el orden de inserción."}
]},

{
id:"jv8l2",
titulo:"Set y Map",
claves:["Set: sin duplicados; HashSet (rápido, sin orden), LinkedHashSet (orden de inserción), TreeSet (ordenado)","Map: pares clave-valor; HashMap, LinkedHashMap, TreeMap","getOrDefault, putIfAbsent, computeIfAbsent y merge simplifican mucho"],
pasos:[
 {t:"info", eti:"Sin repetidos", h:"Set",
  c:`<div class="termbox">Set&lt;String&gt; etiquetas = new HashSet&lt;&gt;();
etiquetas.add("java");
etiquetas.add("docker");
etiquetas.add("java");        <span class="cm">// ignorado: ya esta</span>
etiquetas.size();             <span class="cm">// 2</span>
etiquetas.contains("docker"); <span class="cm">// true, y muy rapido</span></div>`},
 {t:"info", eti:"Clave y valor", h:"Map",
  c:`<div class="termbox">Map&lt;String, Integer&gt; stock = new HashMap&lt;&gt;();
stock.put("teclado", 25);
stock.put("raton", 60);
stock.get("teclado");                 <span class="cm">// 25</span>
stock.get("monitor");                 <span class="cm">// null</span>
stock.getOrDefault("monitor", 0);     <span class="cm">// 0</span>
stock.merge("raton", 5, Integer::sum);   <span class="cm">// 65</span>

<span class="cm">// contar palabras</span>
Map&lt;String, Integer&gt; cuenta = new HashMap&lt;&gt;();
for (String p : palabras) cuenta.merge(p, 1, Integer::sum);

<span class="cm">// agrupar</span>
Map&lt;String, List&lt;Pedido&gt;&gt; porCliente = new HashMap&lt;&gt;();
porCliente.computeIfAbsent(p.cliente(), k -&gt; new ArrayList&lt;&gt;()).add(p);

for (var entrada : stock.entrySet()) {
    System.out.println(entrada.getKey() + " = " + entrada.getValue());
}</div>`},
 {t:"par", p:"Empareja cada implementación con su característica",
  pares:[["HashMap","Acceso muy rápido, sin orden garantizado"],["LinkedHashMap","Mantiene el orden de inserción"],["TreeMap","Claves ordenadas"],["HashSet","Elementos únicos sin orden"],["TreeSet","Elementos únicos ordenados"]],
  why:"Por defecto, HashMap y HashSet. Si necesitas orden, las variantes Linked o Tree."},
 {t:"opcion", p:"Necesitas comprobar muchas veces si un email ya está registrado en una colección de 100.000. ¿Qué usas?",
  ops:["ArrayList y contains","HashSet y contains","Un array ordenado a mano","LinkedList"],
  ok:1, why:"contains en HashSet es de tiempo constante (O(1)); en ArrayList recorre la lista (O(n))."},
 {t:"vf", p:"En un HashMap no puede haber dos entradas con la misma clave.",
  ok:true, why:"put con una clave existente sustituye el valor anterior (y lo devuelve)."}
]},

{
id:"jv8l3",
titulo:"Ordenar: Comparable y Comparator",
claves:["Comparable define el orden natural de una clase (compareTo)","Comparator define órdenes externos y se combinan: comparing, thenComparing, reversed","list.sort(comparador) ordena en su sitio"],
pasos:[
 {t:"info", eti:"Orden natural", h:"Comparable",
  c:`<div class="termbox">public record Version(int mayor, int menor) implements Comparable&lt;Version&gt; {
    public int compareTo(Version o) {
        int c = Integer.compare(mayor, o.mayor);
        return c != 0 ? c : Integer.compare(menor, o.menor);
    }
}
Collections.sort(versiones);   <span class="cm">// usa compareTo</span></div>
     <p><code>compareTo</code> devuelve negativo si este va antes, 0 si son iguales y positivo si va después.</p>`},
 {t:"info", eti:"Órdenes a medida", h:"Comparator",
  c:`<div class="termbox">productos.sort(Comparator.comparing(Producto::precio));
productos.sort(Comparator.comparing(Producto::precio).reversed());
productos.sort(Comparator.comparing(Producto::categoria)
                         .thenComparing(Producto::precio, Comparator.reverseOrder()));
clientes.sort(Comparator.comparing(Cliente::telefono, Comparator.nullsLast(Comparator.naturalOrder())));</div>`},
 {t:"hueco", p:"Completa para ordenar los empleados por salario de mayor a menor",
  tpl:"empleados.sort(Comparator.___(Empleado::salario).___());", banco:["comparing","reversed","sorted","max"], sol:["comparing","reversed"],
  why:"comparing crea el comparador por una propiedad y reversed invierte el orden."},
 {t:"par", p:"Empareja cada elemento con su papel",
  pares:[["Comparable","Orden natural implementado por la propia clase"],["Comparator","Orden externo, se pueden tener muchos"],["thenComparing","Criterio de desempate"],["nullsLast","Colocar los null al final"]],
  why:"Comparator.comparing con referencias a métodos es la forma moderna y legible."},
 {t:"vf", p:"<code>compareTo</code> debe devolver exactamente -1, 0 o 1.",
  ok:false, why:"Cualquier negativo, cero o positivo. Por eso se usa Integer.compare y no restas (que pueden desbordar)."}
]},

{
id:"jv8l4",
titulo:"Genéricos",
claves:["Los genéricos parametrizan tipos: List&lt;Pedido&gt;, Map&lt;K, V&gt;, Optional&lt;T&gt;","Seguridad de tipos en compilación sin casting","Comodines: ? extends T para leer, ? super T para escribir"],
pasos:[
 {t:"info", eti:"Tipos como parámetro", h:"¿Para qué sirven?",
  c:`<p>Antes de los genéricos, una lista guardaba <code>Object</code> y había que convertir al sacar, con riesgo de <code>ClassCastException</code>. Con genéricos, el compilador sabe qué hay dentro:</p>
     <div class="termbox">List&lt;Pedido&gt; pedidos = new ArrayList&lt;&gt;();
pedidos.add("hola");            <span class="cm">// ERROR de compilacion</span>
Pedido p = pedidos.get(0);      <span class="cm">// sin casting</span>

<span class="cm">// una clase generica propia</span>
public class Respuesta&lt;T&gt; {
    private final T datos;
    private final String mensaje;
    public Respuesta(T datos, String mensaje) { this.datos = datos; this.mensaje = mensaje; }
    public T datos() { return datos; }
}

<span class="cm">// un metodo generico</span>
public static &lt;T&gt; T primero(List&lt;T&gt; lista) { return lista.get(0); }</div>`},
 {t:"info", eti:"Comodines", h:"extends y super",
  c:`<div class="termbox">double sumar(List&lt;? extends Number&gt; numeros)   <span class="cm">// acepta List&lt;Integer&gt;, List&lt;Double&gt;... (leer)</span>
void rellenar(List&lt;? super Integer&gt; destino)     <span class="cm">// acepta List&lt;Integer&gt;, List&lt;Number&gt;, List&lt;Object&gt; (escribir)</span></div>
     <p>Regla <b>PECS</b>: <i>Producer Extends, Consumer Super</i>. Si la colección te <b>da</b> elementos, extends; si los <b>recibe</b>, super.</p>`},
 {t:"par", p:"Empareja cada declaración con su significado",
  pares:[["List<T>","Lista de un tipo concreto que se elige al usarla"],["Map<K, V>","Mapa con tipo de clave y tipo de valor"],["List<? extends Number>","Lista de Number o de cualquier subtipo, para leer"],["List<? super Integer>","Lista donde se pueden añadir Integer"]],
  why:"Los genéricos se borran al compilar (type erasure): en ejecución una List&lt;String&gt; es solo una List."},
 {t:"opcion", p:"¿Por qué no se puede pasar un <code>List&lt;Integer&gt;</code> a un método que recibe <code>List&lt;Number&gt;</code>?",
  ops:["Es un error del compilador","Porque el método podría añadir un Double a esa lista, rompiendo la lista de Integer. Se usa List&lt;? extends Number&gt;","Porque Integer no es Number","Sí se puede"],
  ok:1, why:"Los genéricos son invariantes: List&lt;Integer&gt; no es subtipo de List&lt;Number&gt;."},
 {t:"vf", p:"Se pueden usar tipos primitivos como parámetro genérico: <code>List&lt;int&gt;</code>.",
  ok:false, why:"Solo objetos: List&lt;Integer&gt;. El autoboxing convierte int a Integer automáticamente."}
]}

]});
