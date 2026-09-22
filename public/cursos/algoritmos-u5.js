window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Recursión, búsqueda binaria y backtracking",
resumen: "Pensar de forma recursiva, búsqueda binaria y sus variantes, y explorar todas las opciones con backtracking",
nivel: "Intermedio",
color: "#80bb4d",
lecciones: [

{
id:"al5l1",
titulo:"Búsqueda binaria",
claves:["En datos ordenados, descartar la mitad en cada paso: O(log n)","Cuidado con los límites: while (izq <= der) y medio = izq + (der - izq) / 2","Variante: buscar la primera posición que cumple una condición"],
pasos:[
 {t:"info", eti:"Dividir por dos", h:"La plantilla",
  c:`<div class="termbox">int buscar(int[] a, int objetivo) {
    int izq = 0, der = a.length - 1;
    while (izq &lt;= der) {
        int medio = izq + (der - izq) / 2;        // evita desbordar con (izq + der) / 2
        if (a[medio] == objetivo) return medio;
        if (a[medio] &lt; objetivo) izq = medio + 1;
        else der = medio - 1;
    }
    return -1;
}

// primera version con fallos: busqueda sobre la respuesta
int primeraMala(int n) {
    int izq = 1, der = n;
    while (izq &lt; der) {
        int m = izq + (der - izq) / 2;
        if (esMala(m)) der = m; else izq = m + 1;
    }
    return izq;
}</div>`},
 {t:"opcion", p:"¿Por qué <code>izq + (der - izq) / 2</code> en vez de <code>(izq + der) / 2</code>?",
  ops:["Es más rápido","Evita el desbordamiento de int cuando izq + der supera 2.147.483.647","Da otro resultado","Por estilo"],
  ok:1, why:"Un bug famoso que estuvo años en la búsqueda binaria de la librería de Java."},
 {t:"par", p:"Empareja cada problema con la idea de búsqueda binaria",
  pares:[["Buscar un valor en un array ordenado","Búsqueda binaria clásica"],["Primera versión defectuosa","Buscar el primer valor que cumple una condición"],["Mínimo en un array ordenado y rotado","Comparar el medio con el extremo derecho"],["Raíz cuadrada entera de n","Buscar sobre el rango de respuestas posibles"]],
  why:"«Ordenado» o «monótono» es la señal para pensar en búsqueda binaria."},
 {t:"vf", p:"La búsqueda binaria funciona en cualquier array, esté ordenado o no.",
  ok:false, why:"Requiere orden (o una condición monótona) para poder descartar mitades."}
]},

{
id:"al5l2",
titulo:"Recursión",
claves:["Una función recursiva resuelve el problema usando versiones más pequeñas de sí mismo","Siempre: caso base y avance hacia él","Cuidado con los cálculos repetidos y la profundidad de la pila"],
pasos:[
 {t:"info", eti:"Confiar en la recursión", h:"Cómo pensar",
  c:`<ol><li>Define qué devuelve la función para una entrada.</li>
     <li>Resuelve el <b>caso base</b> (el más pequeño).</li>
     <li>Supón que la función ya funciona para entradas más pequeñas y combina su resultado.</li></ol>
     <div class="termbox">// profundidad de un arbol
int profundidad(Arbol n) {
    if (n == null) return 0;                           // caso base
    return 1 + Math.max(profundidad(n.izq), profundidad(n.der));
}

// fibonacci ingenuo: O(2^n) por calculos repetidos
int fib(int n) { return n &lt; 2 ? n : fib(n - 1) + fib(n - 2); }</div>`},
 {t:"opcion", p:"¿Por qué el Fibonacci recursivo ingenuo es tan lento?",
  ops:["Por la recursión en sí","Recalcula los mismos valores muchísimas veces: el árbol de llamadas crece como 2ⁿ","Por usar int","No es lento"],
  ok:1, why:"Con memoización (guardar resultados) pasa a O(n): es programación dinámica."},
 {t:"vf", p:"Toda función recursiva necesita al menos un caso base que no se llame a sí mismo.",
  ok:true, why:"Sin él, la recursión no termina y acaba en StackOverflowError."}
]},

{
id:"al5l3",
titulo:"Backtracking",
claves:["Construir una solución paso a paso y deshacer (volver atrás) al explorar otra opción","Genera subconjuntos, permutaciones y combinaciones","Podar ramas que no pueden llevar a una solución"],
pasos:[
 {t:"info", eti:"Explorar todo", h:"La plantilla",
  c:`<div class="termbox">// todos los subconjuntos de nums
List&lt;List&lt;Integer&gt;&gt; resultado = new ArrayList&lt;&gt;();

void explorar(int[] nums, int inicio, Deque&lt;Integer&gt; actual) {
    resultado.add(new ArrayList&lt;&gt;(actual));           // guardar la solucion actual
    for (int i = inicio; i &lt; nums.length; i++) {
        actual.addLast(nums[i]);                       // elegir
        explorar(nums, i + 1, actual);                 // explorar
        actual.removeLast();                           // deshacer
    }
}</div>
     <p>Elegir, explorar, deshacer. El coste suele ser exponencial (2ⁿ subconjuntos, n! permutaciones), así que la <b>poda</b> es clave.</p>`},
 {t:"orden", p:"Ordena el ciclo básico del backtracking",
  items:["Elegir una opción y añadirla a la solución parcial","Explorar recursivamente a partir de ahí","Deshacer la elección","Probar la siguiente opción"],
  why:"El paso de deshacer es lo que permite reutilizar la misma estructura."},
 {t:"par", p:"Empareja cada problema con su número de soluciones",
  pares:[["Subconjuntos de n elementos","2ⁿ"],["Permutaciones de n elementos","n!"],["Combinaciones de n elementos tomados de k en k","n! / (k! (n-k)!)"],["N reinas","Se exploran con mucha poda"]],
  why:"Saber el tamaño del espacio de búsqueda ayuda a explicar la complejidad."}
]}

]});
