window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Dos punteros y ventana deslizante",
resumen: "Dos técnicas que convierten muchos problemas O(n²) en O(n)",
nivel: "Intermedio",
color: "#8fc75b",
lecciones: [

{
id:"al3l1",
titulo:"Dos punteros",
claves:["Dos índices que avanzan según una condición en lugar de dos bucles anidados","En arrays ordenados: uno al principio y otro al final","Lento y rápido: uno lee y otro escribe (eliminar duplicados en el sitio)"],
pasos:[
 {t:"info", eti:"De O(n²) a O(n)", h:"Punteros desde los extremos",
  c:`<div class="termbox">// two sum en un array ORDENADO, O(1) de espacio
int i = 0, j = a.length - 1;
while (i &lt; j) {
    int suma = a[i] + a[j];
    if (suma == objetivo) return new int[]{i, j};
    if (suma &lt; objetivo) i++;      // necesito mas: avanzo el izquierdo
    else j--;                      // necesito menos: retrocedo el derecho
}</div>
     <p>Cada paso descarta un elemento que nunca puede formar parte de la solución, así que se hacen como mucho n pasos.</p>`},
 {t:"info", eti:"Leer y escribir", h:"Puntero lento y rápido",
  c:`<div class="termbox">// quitar duplicados de un array ordenado en el sitio; devuelve la nueva longitud
int escribir = 1;
for (int leer = 1; leer &lt; a.length; leer++) {
    if (a[leer] != a[escribir - 1]) a[escribir++] = a[leer];
}
return escribir;</div>`},
 {t:"opcion", p:"En two sum ordenado, si la suma actual es menor que el objetivo, ¿qué puntero mueves?",
  ops:["El derecho hacia la izquierda","El izquierdo hacia la derecha, para aumentar la suma","Ambos","Ninguno"],
  ok:1, why:"El array está ordenado: avanzar el izquierdo da un número mayor."},
 {t:"par", p:"Empareja cada problema con la variante de dos punteros",
  pares:[["Pareja que suma X en array ordenado","Extremos que se acercan"],["¿Es palíndromo?","Extremos que se acercan comparando"],["Quitar duplicados en el sitio","Lento que escribe, rápido que lee"],["Detectar un ciclo en una lista enlazada","Tortuga y liebre (lento y rápido)"],["Contenedor con más agua","Extremos: mover el lado más bajo"]],
  why:"Reconocer el patrón es lo difícil; el código es corto."}
]},

{
id:"al3l2",
titulo:"Ventana deslizante",
claves:["Una ventana [izq, der] que se amplía por la derecha y se encoge por la izquierda","Para subarrays o subcadenas contiguas con alguna condición","Mantén el estado de la ventana (suma, conteos) actualizándolo al moverla"],
pasos:[
 {t:"info", eti:"Rangos contiguos", h:"La técnica",
  c:`<div class="termbox">// subcadena mas larga sin caracteres repetidos: O(n)
int mejor = 0, izq = 0;
Map&lt;Character, Integer&gt; ultima = new HashMap&lt;&gt;();
for (int der = 0; der &lt; s.length(); der++) {
    char c = s.charAt(der);
    if (ultima.containsKey(c) &amp;&amp; ultima.get(c) &gt;= izq) {
        izq = ultima.get(c) + 1;          // encoger: saltar tras la repeticion
    }
    ultima.put(c, der);
    mejor = Math.max(mejor, der - izq + 1);
}

// ventana de tamano fijo k: suma maxima
int suma = 0, max = Integer.MIN_VALUE;
for (int i = 0; i &lt; a.length; i++) {
    suma += a[i];
    if (i &gt;= k) suma -= a[i - k];         // sale el que queda fuera
    if (i &gt;= k - 1) max = Math.max(max, suma);
}</div>`},
 {t:"orden", p:"Ordena los pasos de una ventana deslizante variable",
  items:["Ampliar la ventana moviendo der y añadir el nuevo elemento al estado","Mientras la ventana no cumpla la condición, quitar a[izq] del estado y mover izq","Actualizar la mejor respuesta con la ventana actual","Repetir hasta que der llegue al final"],
  why:"Cada índice entra y sale una vez: O(n) total."},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["Subcadena más larga sin repetidos","Ventana variable con un mapa de últimas posiciones"],["Suma máxima de k elementos consecutivos","Ventana de tamaño fijo"],["Subarray más corto con suma ≥ X (positivos)","Ventana variable que se encoge mientras cumple"],["Todos los anagramas de p dentro de s","Ventana fija con conteo de letras"]],
  why:"«Subarray o subcadena contigua» es la señal para pensar en ventana deslizante."},
 {t:"opcion", p:"¿Por qué la ventana deslizante es O(n) aunque tenga un while dentro del for?",
  ops:["No lo es","Porque izq y der solo avanzan: cada elemento entra y sale de la ventana como mucho una vez","Porque el while nunca se ejecuta","Por el HashMap"],
  ok:1, why:"Análisis amortizado: el total de movimientos de izq está acotado por n."}
]}

]});
