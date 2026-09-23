window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Algoritmos y complejidad",
resumen: "Qué es un algoritmo, cómo medir su coste con la notación O y cómo comparar soluciones en tiempo y espacio",
nivel: "Fundamentos",
color: "#9fd36a",
lecciones: [

{
id:"al1l1",
titulo:"Qué es un algoritmo",
claves:["Un algoritmo es una secuencia finita de pasos que resuelve un problema","Varias soluciones correctas pueden tener costes muy distintos","En entrevistas se valora la corrección, la eficiencia y la explicación"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Recetas para resolver problemas",
  c:`<p>Un <b>algoritmo</b> es una receta precisa: dada una entrada, una serie de pasos produce una salida correcta en un tiempo finito. Buscar un contacto en el móvil, ordenar pedidos por fecha o encontrar la ruta más corta en un mapa son algoritmos.</p>
     <p>Dos algoritmos pueden dar el mismo resultado con costes muy distintos. Buscar un nombre en una guía de 1.000.000 de entradas:</p>
     <ul><li>Mirando una a una: hasta <b>1.000.000</b> comparaciones.</li>
     <li>Abriendo por la mitad y descartando la mitad cada vez (está ordenada): unas <b>20</b> comparaciones.</li></ul>`},
 {t:"info", eti:"Las piezas", h:"Estructuras de datos",
  c:`<p>Una <b>estructura de datos</b> es una forma de organizar la información para que ciertas operaciones sean rápidas: un array permite acceder por posición al instante; un HashMap, buscar por clave al instante; un árbol ordenado, recorrer en orden.</p>
     <p>Elegir bien la estructura suele ser la mitad de la solución de cualquier problema de entrevista.</p>`},
 {t:"par", p:"Empareja cada problema cotidiano con la idea algorítmica",
  pares:[["Buscar en una guía ordenada abriendo por la mitad","Búsqueda binaria"],["Pila de platos: el último que pones es el primero que coges","Pila (LIFO)"],["Cola del supermercado","Cola (FIFO)"],["Encontrar el camino más corto en un mapa","Algoritmos de grafos"],["Buscar un contacto por nombre al instante","Tabla hash"]],
  why:"Todas estas ideas aparecen en el curso, una por una."},
 {t:"opcion", p:"En una entrevista te piden resolver un problema. ¿Qué valoran principalmente?",
  ops:["Que escribas rápido","Que la solución sea correcta, que razones sobre su eficiencia y que expliques tu forma de pensar","Que uses muchas librerías","Que memorices la respuesta"],
  ok:1, why:"Pensar en voz alta es tan importante como el código."},
 {t:"vf", p:"Si dos algoritmos dan el mismo resultado, son igual de buenos.",
  ok:false, why:"Pueden diferir enormemente en tiempo y memoria cuando la entrada crece."}
]},

{
id:"al1l2",
titulo:"La notación O grande",
claves:["O grande describe cómo crece el coste cuando crece la entrada (n)","Se ignoran constantes y términos menores: O(2n + 5) es O(n)","Orden típico: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)"],
pasos:[
 {t:"info", eti:"Medir el crecimiento", h:"Big O",
  c:`<p>No medimos segundos (dependen del ordenador), sino <b>cómo crece</b> el número de operaciones cuando la entrada <code>n</code> crece.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">n = 1.000.000</div><table class="dg-tabla"><tbody><tr><td>O(1)</td><td>1</td><td>acceder a array[i], buscar en HashMap</td></tr><tr><td>O(log n)</td><td>~20</td><td>busqueda binaria</td></tr><tr><td>O(n)</td><td>1.000.000</td><td>recorrer una lista</td></tr><tr><td>O(n log n)</td><td>~20.000.000</td><td>buena ordenacion (merge sort, Arrays.sort)</td></tr><tr><td>O(n²)</td><td>10^12</td><td>dos bucles anidados: ¡horas!</td></tr><tr><td>O(2^n)</td><td>imposible</td><td>probar todos los subconjuntos</td></tr></tbody></table></div>`},
 {t:"par", p:"Empareja cada operación con su complejidad",
  pares:[["Acceder a array[5]","O(1)"],["Búsqueda binaria en un array ordenado","O(log n)"],["Recorrer una lista una vez","O(n)"],["Ordenar con Arrays.sort","O(n log n)"],["Comparar cada elemento con todos los demás","O(n²)"]],
  why:"Memoriza este orden: es la base de cualquier discusión de eficiencia."},
 {t:"opcion", p:"¿Qué complejidad tiene este código?", c:`<div class="termbox">for (int i = 0; i &lt; n; i++) {
    for (int j = 0; j &lt; n; j++) {
        if (a[i] + a[j] == objetivo) return true;
    }
}</div>`,
  ops:["O(n)","O(n log n)","O(n²)","O(1)"],
  ok:2, why:"Dos bucles anidados sobre n: n × n operaciones."},
 {t:"opcion", p:"¿Cómo se simplifica O(3n² + 10n + 100)?",
  ops:["O(3n²)","O(n²)","O(n)","O(100)"],
  ok:1, why:"Se quedan el término dominante y se eliminan las constantes."},
 {t:"vf", p:"Un algoritmo O(n) siempre es más rápido que uno O(n²) para cualquier n.",
  ok:false, why:"Para n pequeños, las constantes pueden hacer que el O(n²) gane. O describe el crecimiento con n grande."}
]},

{
id:"al1l3",
titulo:"Analizar código paso a paso",
claves:["Bucles secuenciales se suman; bucles anidados se multiplican","Dividir la entrada a la mitad en cada paso da log n","La complejidad espacial mide la memoria extra"],
pasos:[
 {t:"info", eti:"Reglas prácticas", h:"Cómo calcular la complejidad",
  c:`<div class="termbox">// secuencial: O(n) + O(n) = O(n)
for (int x : a) suma += x;
for (int x : a) max = Math.max(max, x);

// anidado: O(n) * O(m) = O(n * m)
for (int x : a) for (int y : b) ...

// se divide a la mitad: O(log n)
while (n &gt; 1) { n = n / 2; }

// llamadas a metodos: cuenta su coste
for (String s : lista) {
    if (otraLista.contains(s)) ...   // contains en ArrayList es O(m): total O(n * m)
}</div>`},
 {t:"par", p:"Empareja cada fragmento con su complejidad",
  pares:[["Un bucle de 0 a n","O(n)"],["Un bucle de 0 a n y otro después de 0 a n","O(n) + O(n), que sigue siendo O(n)"],["Un bucle de 0 a n dentro de otro de 0 a n","O(n²)"],["i se multiplica por 2 hasta llegar a n","O(log n)"],["Un bucle de 0 a 10 siempre","O(1)"]],
  why:"Un número fijo de repeticiones (10) no depende de n: es constante."},
 {t:"info", eti:"Memoria", h:"Complejidad espacial",
  c:`<p>También importa la <b>memoria extra</b>:</p>
     <ul><li>Sumar un array: O(1) de espacio (una variable).</li>
     <li>Copiar el array o guardar todo en un HashSet: O(n).</li>
     <li>Recursión con profundidad n: O(n) en la pila de llamadas.</li></ul>
     <p>Es habitual <b>intercambiar espacio por tiempo</b>: un HashSet usa O(n) de memoria para que las búsquedas pasen de O(n) a O(1).</p>`},
 {t:"opcion", p:"¿Qué complejidad tiene recorrer una lista de n palabras y para cada una comprobar <code>otraLista.contains(p)</code> si otraLista es un ArrayList de m elementos?",
  ops:["O(n)","O(n + m)","O(n × m)","O(1)"],
  ok:2, why:"contains recorre la lista. Convertir otraLista en un HashSet lo baja a O(n + m)."}
]}

]});
