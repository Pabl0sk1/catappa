window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Pilas, colas y listas enlazadas",
resumen: "LIFO y FIFO, ArrayDeque, paréntesis equilibrados, pila monótona y manipulación de listas enlazadas",
nivel: "Intermedio",
color: "#8fc75b",
lecciones: [

{
id:"al4l1",
titulo:"Pilas y colas",
claves:["Pila (LIFO): push y pop por el mismo extremo","Cola (FIFO): se añade por un extremo y se saca por el otro","En Java, ArrayDeque sirve para ambas (evita Stack y LinkedList)"],
pasos:[
 {t:"info", eti:"Orden de salida", h:"LIFO y FIFO",
  c:`<div class="termbox">Deque&lt;Integer&gt; pila = new ArrayDeque&lt;&gt;();
pila.push(1); pila.push(2);
pila.pop();         // 2  (el ultimo que entro)
pila.peek();        // 1

Deque&lt;Integer&gt; cola = new ArrayDeque&lt;&gt;();
cola.offer(1); cola.offer(2);
cola.poll();        // 1  (el primero que entro)

// parentesis equilibrados
boolean equilibrado(String s) {
    Deque&lt;Character&gt; p = new ArrayDeque&lt;&gt;();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') p.push(c);
        else {
            if (p.isEmpty()) return false;
            char a = p.pop();
            if ((c == ')' &amp;&amp; a != '(') || (c == ']' &amp;&amp; a != '[') || (c == '}' &amp;&amp; a != '{')) return false;
        }
    }
    return p.isEmpty();
}</div>`},
 {t:"par", p:"Empareja cada situación con la estructura",
  pares:[["Deshacer (Ctrl+Z)","Pila: se deshace lo último que se hizo"],["Paréntesis equilibrados","Pila de aperturas pendientes"],["Procesar tareas por orden de llegada","Cola: el primero que llega, el primero que sale"],["Recorrido en anchura (BFS)","Cola de nodos por visitar"],["Recorrido en profundidad iterativo (DFS)","Pila en lugar de recursión"]],
  why:"La pila de llamadas de un programa es literalmente una pila."},
 {t:"opcion", p:"¿Qué devuelve el último <code>pop()</code>?", c:`<div class="termbox">pila.push(5); pila.push(8); pila.pop(); pila.push(3);
pila.pop();</div>`,
  ops:["5","8","3","null"],
  ok:2, why:"Tras sacar el 8, entra el 3, que es el último en entrar."},
 {t:"vf", p:"En Java moderno se recomienda ArrayDeque en lugar de la clase Stack.",
  ok:true, why:"Stack es antigua y sincronizada; ArrayDeque es más rápida."}
]},

{
id:"al4l2",
titulo:"Pila monótona",
claves:["Una pila que se mantiene ordenada (creciente o decreciente)","Resuelve «el siguiente mayor» o «días hasta una temperatura más alta» en O(n)","Cada elemento entra y sale una vez"],
pasos:[
 {t:"info", eti:"Patrón avanzado", h:"Siguiente elemento mayor",
  c:`<div class="termbox">// para cada dia, cuantos dias faltan para una temperatura mayor
int[] resultado = new int[t.length];
Deque&lt;Integer&gt; pila = new ArrayDeque&lt;&gt;();          // indices con temperaturas decrecientes
for (int i = 0; i &lt; t.length; i++) {
    while (!pila.isEmpty() &amp;&amp; t[i] &gt; t[pila.peek()]) {
        int j = pila.pop();
        resultado[j] = i - j;                        // i es el siguiente dia mas calido de j
    }
    pila.push(i);
}</div>
     <p>La solución directa (para cada día, buscar hacia delante) es O(n²). La pila guarda los días que aún esperan un día más cálido.</p>`},
 {t:"opcion", p:"¿Qué complejidad tiene la solución con pila monótona?",
  ops:["O(n²)","O(n): cada índice se apila y desapila como mucho una vez","O(n log n)","O(1)"],
  ok:1, why:"Otra vez análisis amortizado."},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["Siguiente elemento mayor","Pila monótona decreciente"],["Rectángulo más grande en un histograma","Pila monótona creciente"],["Máximo de cada ventana de tamaño k","Deque monótona"],["Validar paréntesis","Pila simple"]],
  why:"Son problemas de nivel medio y difícil habituales en entrevistas."}
]},

{
id:"al4l3",
titulo:"Listas enlazadas",
claves:["Nodos con un valor y una referencia al siguiente","Insertar o borrar conociendo el nodo es O(1); acceder por posición es O(n)","Técnicas: nodo ficticio, invertir, lento y rápido"],
pasos:[
 {t:"info", eti:"Nodos encadenados", h:"Operaciones clásicas",
  c:`<div class="termbox">class Nodo { int val; Nodo sig; Nodo(int v) { val = v; } }

// invertir una lista: O(n) tiempo, O(1) espacio
Nodo invertir(Nodo cabeza) {
    Nodo anterior = null, actual = cabeza;
    while (actual != null) {
        Nodo siguiente = actual.sig;
        actual.sig = anterior;
        anterior = actual;
        actual = siguiente;
    }
    return anterior;
}

// nodo del medio con lento y rapido
Nodo medio(Nodo c) {
    Nodo lento = c, rapido = c;
    while (rapido != null &amp;&amp; rapido.sig != null) { lento = lento.sig; rapido = rapido.sig.sig; }
    return lento;
}</div>`},
 {t:"orden", p:"Ordena las operaciones dentro del bucle al invertir una lista",
  items:["Guardar la referencia al siguiente nodo","Hacer que el nodo actual apunte al anterior","Mover anterior al nodo actual","Mover actual al siguiente guardado"],
  why:"Si no guardas el siguiente primero, pierdes el resto de la lista."},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["Detectar un ciclo","Lento y rápido: si se encuentran, hay ciclo"],["Encontrar el nodo del medio","Lento avanza 1 y rápido 2"],["Fusionar dos listas ordenadas","Nodo ficticio y comparar cabezas"],["Borrar el n-ésimo desde el final","Adelantar un puntero n posiciones"]],
  why:"El nodo ficticio (dummy) evita casos especiales al modificar la cabeza."},
 {t:"vf", p:"Acceder al elemento en la posición k de una lista enlazada es O(1).",
  ok:false, why:"Hay que recorrer desde la cabeza: O(k)."}
]}

]});
