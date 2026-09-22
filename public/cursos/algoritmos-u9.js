window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Ordenación, voraces e intervalos",
resumen: "Cómo funcionan los algoritmos de ordenación, cuándo funciona una estrategia voraz, problemas de intervalos y trucos con bits",
nivel: "Experto",
color: "#65a334",
lecciones: [

{
id:"al9l1",
titulo:"Algoritmos de ordenación",
claves:["Merge sort: O(n log n) siempre y estable; quicksort: O(n log n) de media, en el sitio","Arrays.sort usa quicksort de doble pivote para primitivos y TimSort (estable) para objetos","Ordenar primero simplifica muchos problemas"],
pasos:[
 {t:"info", eti:"Ordenar", h:"Los que hay que conocer",
  c:`<div class="diag">algoritmo      tiempo medio   peor caso     espacio   estable
burbuja        O(n^2)         O(n^2)        O(1)      si     (solo didactico)
insercion      O(n^2)         O(n^2)        O(1)      si     (rapido en casi ordenados)
merge sort     O(n log n)     O(n log n)    O(n)      si
quicksort      O(n log n)     O(n^2)        O(log n)  no
heapsort       O(n log n)     O(n log n)    O(1)      no
counting sort  O(n + k)       O(n + k)      O(k)      si     (enteros en rango pequeno)</div>
     <p><b>Estable</b>: si dos elementos son iguales según el criterio, mantienen su orden original. Importa al ordenar por varios criterios sucesivos.</p>`},
 {t:"par", p:"Empareja cada algoritmo con su característica",
  pares:[["Merge sort","Divide en mitades, ordena y fusiona; estable"],["Quicksort","Elige un pivote y particiona; muy rápido en la práctica"],["Heapsort","Usa un montículo; O(1) de memoria extra"],["Counting sort","Cuenta apariciones de enteros en un rango pequeño"],["TimSort","Híbrido estable que usa Java para objetos y Python para todo"]],
  why:"En una entrevista basta con explicar merge sort y quicksort y sus compromisos."},
 {t:"opcion", p:"¿Cuándo tiene quicksort su peor caso O(n²)?",
  ops:["Nunca","Cuando el pivote elegido deja particiones muy desequilibradas (por ejemplo, siempre el menor)","Con arrays pequeños","Con números negativos"],
  ok:1, why:"Se mitiga eligiendo pivotes aleatorios o la mediana de tres."}
]},

{
id:"al9l2",
titulo:"Voraces e intervalos",
claves:["Un algoritmo voraz toma la mejor decisión local en cada paso","Funciona solo si esa decisión nunca impide la solución óptima (hay que justificarlo)","Intervalos: ordenar por inicio o por fin y recorrer una vez"],
pasos:[
 {t:"info", eti:"Decisiones locales", h:"Intervalos",
  c:`<div class="termbox">// fusionar intervalos solapados: ordenar por inicio, O(n log n)
int[][] fusionar(int[][] iv) {
    Arrays.sort(iv, Comparator.comparingInt(x -&gt; x[0]));
    List&lt;int[]&gt; res = new ArrayList&lt;&gt;();
    for (int[] x : iv) {
        if (res.isEmpty() || res.get(res.size() - 1)[1] &lt; x[0]) res.add(x);
        else res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], x[1]);
    }
    return res.toArray(new int[0][]);
}

// maximo de reuniones sin solaparse: voraz, ordenar por FIN y coger la que acaba antes</div>`},
 {t:"par", p:"Empareja cada problema con su estrategia",
  pares:[["Fusionar intervalos","Ordenar por inicio y fusionar con el último"],["Máximo de actividades sin solaparse","Voraz: ordenar por fin"],["Mínimo de salas de reuniones","Ordenar inicios y fines, o un montículo con los fines"],["Monedas del sistema euro","Voraz funciona (coger la mayor posible)"],["Monedas arbitrarias {1, 3, 4}","Voraz falla: programación dinámica"]],
  why:"Demostrar (o al menos razonar) por qué el voraz funciona es parte de la respuesta."},
 {t:"opcion", p:"¿Cuántas salas necesitas para las reuniones [9-10], [9:30-11], [10-12]?",
  ops:["1","2","3","4"],
  ok:1, why:"A las 9:30 coinciden dos; a las 10 termina la primera y empieza la tercera: nunca hay más de dos a la vez."}
]},

{
id:"al9l3",
titulo:"Manipulación de bits",
claves:["AND, OR, XOR, NOT y desplazamientos operan bit a bit","x ^ x = 0 y x ^ 0 = x: el XOR encuentra el elemento único","Máscaras de bits para representar conjuntos pequeños y permisos"],
pasos:[
 {t:"info", eti:"Bits", h:"Trucos habituales",
  c:`<div class="termbox">int unico(int[] a) {                 // todos aparecen dos veces salvo uno
    int r = 0;
    for (int x : a) r ^= x;            // los pares se anulan
    return r;
}

(n &amp; 1) == 1                          // ¿es impar?
n &amp; (n - 1)                           // quita el bit 1 mas bajo
(n &amp; (n - 1)) == 0                    // ¿es potencia de 2? (n &gt; 0)
Integer.bitCount(n)                   // numero de bits a 1

// permisos como mascara
final int LEER = 1, ESCRIBIR = 2, BORRAR = 4;
int permisos = LEER | ESCRIBIR;
boolean puedeBorrar = (permisos &amp; BORRAR) != 0;</div>`},
 {t:"par", p:"Empareja cada expresión con su significado",
  pares:[["x ^ x","0"],["x & 1","El bit más bajo: 1 si es impar"],["1 << k","Una máscara con solo el bit k"],["n & (n - 1) == 0","n es potencia de 2 (si n > 0)"],["a | b","Unión de dos máscaras de permisos"]],
  why:"Los permisos de Linux (rwx = 4, 2, 1) son exactamente una máscara de bits."},
 {t:"vf", p:"El XOR de todos los elementos de un array donde cada número aparece dos veces menos uno devuelve ese número.",
  ok:true, why:"Los pares se anulan (x ^ x = 0) y queda el único."}
]}

]});
