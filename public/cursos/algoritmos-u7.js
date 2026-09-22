window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Grafos",
resumen: "Representar grafos, BFS y DFS, islas en una matriz, orden topológico, caminos mínimos y union-find",
nivel: "Avanzado",
color: "#72af40",
lecciones: [

{
id:"al7l1",
titulo:"Representar y recorrer grafos",
claves:["Un grafo son nodos unidos por aristas; dirigido o no, con pesos o sin ellos","Lista de adyacencia: Map&lt;nodo, List&lt;vecinos&gt;&gt;","BFS (cola) da caminos más cortos sin pesos; DFS (recursión o pila) explora en profundidad"],
pasos:[
 {t:"info", eti:"Relaciones", h:"Grafos por todas partes",
  c:`<p>Redes sociales, rutas, dependencias entre paquetes, enlaces entre páginas, microservicios que se llaman: todo son grafos.</p>
     <div class="termbox">Map&lt;Integer, List&lt;Integer&gt;&gt; ady = new HashMap&lt;&gt;();
for (int[] e : aristas) {
    ady.computeIfAbsent(e[0], k -&gt; new ArrayList&lt;&gt;()).add(e[1]);
    ady.computeIfAbsent(e[1], k -&gt; new ArrayList&lt;&gt;()).add(e[0]);   // no dirigido
}

// BFS: distancia minima (en numero de aristas) desde origen
Map&lt;Integer, Integer&gt; dist = new HashMap&lt;&gt;(Map.of(origen, 0));
Deque&lt;Integer&gt; cola = new ArrayDeque&lt;&gt;(List.of(origen));
while (!cola.isEmpty()) {
    int n = cola.poll();
    for (int v : ady.getOrDefault(n, List.of())) {
        if (!dist.containsKey(v)) { dist.put(v, dist.get(n) + 1); cola.offer(v); }
    }
}</div>`},
 {t:"par", p:"Empareja cada algoritmo con su uso",
  pares:[["BFS","Camino más corto sin pesos, recorrido por niveles"],["DFS","Explorar componentes, detectar ciclos, backtracking"],["Conjunto de visitados","No procesar un nodo dos veces (evitar bucles infinitos)"],["Lista de adyacencia","Representación compacta para grafos dispersos"]],
  why:"Olvidar el conjunto de visitados es el bug más habitual con grafos."},
 {t:"info", eti:"Grafos implícitos", h:"Islas en una matriz",
  c:`<div class="termbox">// contar islas de '1' conectadas en horizontal o vertical
int islas = 0;
for (int f = 0; f &lt; filas; f++)
    for (int c = 0; c &lt; cols; c++)
        if (m[f][c] == '1') { islas++; hundir(m, f, c); }

void hundir(char[][] m, int f, int c) {
    if (f &lt; 0 || c &lt; 0 || f &gt;= m.length || c &gt;= m[0].length || m[f][c] != '1') return;
    m[f][c] = '0';                                   // marcar como visitada
    hundir(m, f + 1, c); hundir(m, f - 1, c); hundir(m, f, c + 1); hundir(m, f, c - 1);
}</div>`},
 {t:"opcion", p:"¿Qué complejidad tiene contar islas en una matriz de F × C?",
  ops:["O(F × C): cada celda se visita un número constante de veces","O((F × C)²)","O(log(F × C))","O(1)"],
  ok:0, why:"Cada celda se hunde una vez y se consulta desde sus 4 vecinas como mucho."}
]},

{
id:"al7l2",
titulo:"Orden topológico, caminos mínimos y union-find",
claves:["Orden topológico: ordenar tareas con dependencias (grafo dirigido sin ciclos)","Dijkstra: caminos mínimos con pesos no negativos usando un montículo","Union-find agrupa elementos en conjuntos y detecta si dos están conectados"],
pasos:[
 {t:"info", eti:"Dependencias", h:"Orden topológico (Kahn)",
  c:`<div class="termbox">// grados de entrada; empezar por quien no depende de nadie
Deque&lt;Integer&gt; cola = new ArrayDeque&lt;&gt;();
for (int n = 0; n &lt; total; n++) if (grado[n] == 0) cola.offer(n);
List&lt;Integer&gt; orden = new ArrayList&lt;&gt;();
while (!cola.isEmpty()) {
    int n = cola.poll(); orden.add(n);
    for (int v : ady.get(n)) if (--grado[v] == 0) cola.offer(v);
}
boolean hayCiclo = orden.size() &lt; total;</div>
     <p>Es lo que hacen Maven al compilar módulos, Terraform con su grafo de recursos o un planificador de tareas.</p>`},
 {t:"par", p:"Empareja cada problema con el algoritmo",
  pares:[["Orden de compilación de módulos con dependencias","Orden topológico"],["Ruta más rápida con tiempos distintos por tramo","Dijkstra"],["¿Están dos usuarios en la misma red de amigos?","Union-find o BFS"],["Detectar dependencias circulares","Orden topológico incompleto o DFS con colores"],["Laberinto: menos pasos hasta la salida","BFS"]],
  why:"Terraform detecta ciclos en su grafo de recursos igual que Kahn."},
 {t:"opcion", p:"¿Por qué Dijkstra no funciona con pesos negativos?",
  ops:["Por un límite de Java","Da por definitiva la distancia de un nodo al sacarlo del montículo; un peso negativo posterior podría mejorarla","Porque es BFS","Sí funciona"],
  ok:1, why:"Con pesos negativos se usa Bellman-Ford."}
]}

]});
