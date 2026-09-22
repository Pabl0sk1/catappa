window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Árboles y montículos",
resumen: "Árboles binarios y sus recorridos, árboles de búsqueda, recorrido por niveles, montículos y el problema top K",
nivel: "Avanzado",
color: "#80bb4d",
lecciones: [

{
id:"al6l1",
titulo:"Árboles binarios y recorridos",
claves:["Cada nodo tiene como mucho dos hijos: izquierdo y derecho","Recorridos en profundidad: preorden, inorden, postorden","Recorrido por niveles (BFS) con una cola"],
pasos:[
 {t:"info", eti:"Jerarquías", h:"Recorrer un árbol",
  c:`<div class="diag">        8
      /   \\
     3     10
    / \\      \\
   1   6      14

preorden  (raiz, izq, der):  8 3 1 6 10 14
inorden   (izq, raiz, der):  1 3 6 8 10 14   (ordenado si es un arbol de busqueda)
postorden (izq, der, raiz):  1 6 3 14 10 8
por niveles:                 8 | 3 10 | 1 6 14</div>
     <div class="termbox">void inorden(Nodo n, List&lt;Integer&gt; r) {
    if (n == null) return;
    inorden(n.izq, r); r.add(n.val); inorden(n.der, r);
}

List&lt;List&lt;Integer&gt;&gt; porNiveles(Nodo raiz) {
    List&lt;List&lt;Integer&gt;&gt; res = new ArrayList&lt;&gt;();
    Deque&lt;Nodo&gt; cola = new ArrayDeque&lt;&gt;();
    if (raiz != null) cola.offer(raiz);
    while (!cola.isEmpty()) {
        List&lt;Integer&gt; nivel = new ArrayList&lt;&gt;();
        for (int k = cola.size(); k &gt; 0; k--) {
            Nodo n = cola.poll(); nivel.add(n.val);
            if (n.izq != null) cola.offer(n.izq);
            if (n.der != null) cola.offer(n.der);
        }
        res.add(nivel);
    }
    return res;
}</div>`},
 {t:"par", p:"Empareja cada recorrido con su orden",
  pares:[["Preorden","Raíz, izquierdo, derecho"],["Inorden","Izquierdo, raíz, derecho"],["Postorden","Izquierdo, derecho, raíz"],["Por niveles","Nivel a nivel con una cola"]],
  why:"El inorden de un árbol de búsqueda devuelve los valores ordenados."},
 {t:"opcion", p:"¿Qué estructura necesitas para recorrer un árbol por niveles?",
  ops:["Una pila","Una cola","Un HashMap","Nada"],
  ok:1, why:"FIFO: primero los nodos del nivel actual, luego sus hijos."}
]},

{
id:"al6l2",
titulo:"Árboles binarios de búsqueda",
claves:["En un BST, todo lo de la izquierda es menor y todo lo de la derecha es mayor","Buscar, insertar y borrar en O(altura): O(log n) si está equilibrado","TreeMap y TreeSet de Java son árboles equilibrados (rojo-negro)"],
pasos:[
 {t:"info", eti:"Orden en forma de árbol", h:"BST",
  c:`<div class="termbox">boolean contiene(Nodo n, int x) {
    while (n != null) {
        if (x == n.val) return true;
        n = x &lt; n.val ? n.izq : n.der;       // descartar un subarbol entero
    }
    return false;
}

// validar un BST: cada nodo dentro de un rango (min, max)
boolean valido(Nodo n, long min, long max) {
    if (n == null) return true;
    if (n.val &lt;= min || n.val &gt;= max) return false;
    return valido(n.izq, min, n.val) &amp;&amp; valido(n.der, n.val, max);
}</div>
     <p>Si insertas valores ya ordenados en un BST sin equilibrar, degenera en una lista: O(n). Por eso existen los árboles <b>equilibrados</b> (AVL, rojo-negro).</p>`},
 {t:"opcion", p:"¿Por qué para validar un BST no basta con comprobar que cada hijo izquierdo es menor que su padre?",
  ops:["Sí basta","Todo el subárbol izquierdo debe ser menor que el nodo, no solo el hijo directo: hay que propagar rangos","Porque los árboles no tienen orden","Porque hay que usar BFS"],
  ok:1, why:"Error clásico en entrevistas."},
 {t:"par", p:"Empareja cada estructura de Java con lo que ofrece",
  pares:[["TreeMap","Mapa ordenado por clave con operaciones O(log n)"],["TreeSet","Conjunto ordenado"],["floorKey / ceilingKey","Buscar la clave inmediatamente menor o mayor"],["HashMap","Sin orden, pero O(1) de media"]],
  why:"TreeMap resuelve problemas de «el siguiente mayor» o rangos de tiempo."}
]},

{
id:"al6l3",
titulo:"Montículos y top K",
claves:["Un montículo (heap) da el mínimo (o máximo) en O(1) e inserta o extrae en O(log n)","PriorityQueue de Java es un montículo mínimo","Top K: un montículo de tamaño K recorriendo los datos una vez"],
pasos:[
 {t:"info", eti:"Siempre el más urgente", h:"PriorityQueue",
  c:`<div class="termbox">PriorityQueue&lt;Integer&gt; min = new PriorityQueue&lt;&gt;();
PriorityQueue&lt;Integer&gt; max = new PriorityQueue&lt;&gt;(Comparator.reverseOrder());

// los k numeros mas grandes: monticulo MINIMO de tamano k, O(n log k)
PriorityQueue&lt;Integer&gt; top = new PriorityQueue&lt;&gt;();
for (int x : nums) {
    top.offer(x);
    if (top.size() &gt; k) top.poll();          // saca el menor: quedan los k mayores
}

// las k palabras mas frecuentes
Map&lt;String, Integer&gt; f = contar(palabras);
PriorityQueue&lt;String&gt; h = new PriorityQueue&lt;&gt;(Comparator.comparingInt(f::get));</div>`},
 {t:"par", p:"Empareja cada problema con el uso del montículo",
  pares:[["Los K mayores elementos","Montículo mínimo de tamaño K"],["Fusionar K listas ordenadas","Montículo con la cabeza de cada lista"],["Mediana de un flujo de números","Dos montículos: uno máximo y uno mínimo"],["Planificar tareas por prioridad","Cola de prioridad"],["Camino más corto con pesos (Dijkstra)","Montículo por distancia"]],
  why:"Top K con montículo es O(n log k), mejor que ordenar todo (O(n log n)) cuando k es pequeño."},
 {t:"opcion", p:"Para obtener los 10 números más grandes de mil millones, ¿qué es más eficiente?",
  ops:["Ordenar todo y coger los 10 últimos","Un montículo mínimo de tamaño 10 recorriendo los datos una vez","Un HashSet","Dos bucles anidados"],
  ok:1, why:"Memoria O(10) y tiempo O(n log 10): se puede hacer incluso en streaming."}
]}

]});
