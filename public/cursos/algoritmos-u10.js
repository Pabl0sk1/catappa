window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Maestría: la entrevista de código",
resumen: "Un método para afrontar cualquier ejercicio, reconocer patrones por sus señales y un simulacro final",
nivel: "Maestro",
color: "#58962a",
lecciones: [

{
id:"al10l1",
titulo:"Método y reconocimiento de patrones",
claves:["Entender, ejemplos, fuerza bruta, optimizar, codificar, probar","Las señales del enunciado sugieren el patrón","Comunicar el razonamiento en voz alta durante todo el proceso"],
pasos:[
 {t:"orden", p:"Ordena el método para resolver un ejercicio en una entrevista",
  items:["Repetir el problema y preguntar por entradas, límites y casos especiales","Probar con un par de ejemplos a mano","Proponer una solución directa y decir su complejidad","Buscar un patrón que la mejore (hash, dos punteros, montículo...)","Escribir el código limpio explicando lo que haces","Probarlo con los ejemplos y los casos límite"],
  why:"Saltar directamente al código es el error más común."},
 {t:"par", p:"Empareja cada señal del enunciado con el patrón que sugiere",
  pares:[["Array ordenado, buscar un valor o una pareja","Búsqueda binaria o dos punteros"],["Subarray o subcadena contigua","Ventana deslizante"],["«Los K mayores / más frecuentes»","Montículo"],["Dependencias entre tareas","Grafo y orden topológico"],["«Número de formas» o «mínimo coste» con decisiones","Programación dinámica"],["Todas las combinaciones o permutaciones","Backtracking"]],
  why:"Con práctica, estas señales se reconocen en segundos."},
 {t:"opcion", p:"Te bloqueas y no ves la solución óptima. ¿Qué haces?",
  ops:["Quedarte en silencio","Implementar la solución directa correcta, explicar su complejidad y cómo intentarías mejorarla","Decir que no sabes y rendirte","Inventar una complejidad"],
  ok:1, why:"Una solución correcta y bien explicada vale mucho más que nada."}
]},

{
id:"al10l2",
titulo:"Simulacro de entrevista de algoritmos",
claves:["Has practicado los patrones más frecuentes","Sabes analizar y justificar la complejidad","Estás preparado para la parte de código de una entrevista técnica"],
pasos:[
 {t:"info", eti:"Último paso", h:"Problemas mezclados",
  c:`<p>Antes de elegir, piensa qué patrón aplicarías y qué complejidad tendría.</p>`},
 {t:"opcion", p:"«Dado un array, devuelve true si algún valor aparece al menos dos veces.» ¿Mejor solución?",
  ops:["Dos bucles anidados, O(n²)","HashSet recorriendo una vez: O(n) tiempo, O(n) espacio (u ordenar y comparar vecinos, O(n log n) y O(1))","Búsqueda binaria","Programación dinámica"],
  ok:1, why:"Menciona las dos opciones y el compromiso entre tiempo y memoria."},
 {t:"opcion", p:"«Longitud de la subcadena más larga sin caracteres repetidos.»",
  ops:["Probar todas las subcadenas, O(n³)","Ventana deslizante con un mapa de últimas posiciones, O(n)","Ordenar la cadena","Un montículo"],
  ok:1, why:"Contigua + condición = ventana deslizante."},
 {t:"opcion", p:"«Invierte una lista enlazada.»",
  ops:["Copiarla a un array y reconstruirla","Tres punteros (anterior, actual, siguiente) en una pasada: O(n) y O(1) de espacio","Recursión con memoización","Ordenarla"],
  ok:1, why:"Un clásico que conviene poder escribir sin pensar."},
 {t:"opcion", p:"«Número de islas en una matriz de 0 y 1.»",
  ops:["Contar los 1","Recorrer la matriz y, por cada 1 no visitado, sumar una isla y hundirla con DFS o BFS: O(F × C)","Programación dinámica","Ordenar las filas"],
  ok:1, why:"Grafo implícito: cada celda es un nodo con 4 vecinos."},
 {t:"opcion", p:"«Los k elementos más frecuentes de un array.»",
  ops:["Ordenar el array","Contar con un HashMap y mantener un montículo mínimo de tamaño k: O(n log k)","Dos punteros","Backtracking"],
  ok:1, why:"También vale bucket sort por frecuencia en O(n)."},
 {t:"info", eti:"Terminado", h:"Has completado Algoritmos y estructuras de datos",
  c:`<p>Dominas la notación O, arrays y hashing, dos punteros y ventanas, pilas, colas y listas, recursión, búsqueda binaria y backtracking, árboles y montículos, grafos, programación dinámica, ordenación, voraces e intervalos.</p>
     <p>Para consolidarlo: resuelve la lista «NeetCode 150» o «Blind 75» en Java, empezando por los fáciles y explicando en voz alta cada solución como si estuvieras en la entrevista.</p>`}
]}

]});
