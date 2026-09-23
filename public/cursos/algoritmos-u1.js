window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Algoritmos y complejidad",
resumen: "Qué es un algoritmo, cómo medir su coste con la notación O, las herramientas de Python para practicar y cómo leer los límites de un enunciado",
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
     <div class="dg"><div class="dg-tit">el mismo problema, dos algoritmos</div>
     <div class="dg-cols"><div class="dg-col"><div class="dg-col-tit">mirar una a una</div><div class="dg-caja aviso doble">hasta 1.000.000<small>comparaciones</small></div></div>
     <div class="dg-col"><div class="dg-col-tit">partir por la mitad (está ordenada)</div><div class="dg-caja ok doble">unas 20<small>comparaciones</small></div></div></div></div>`},
 {t:"info", eti:"Las piezas", h:"Estructuras de datos",
  c:`<p>Una <b>estructura de datos</b> es una forma de organizar la información para que ciertas operaciones sean rápidas: un array permite acceder por posición al instante; una tabla hash, buscar por clave al instante; un árbol ordenado, recorrer en orden.</p>
     <p>Elegir bien la estructura suele ser la mitad de la solución de cualquier problema de entrevista.</p>
     <div class="nota"><b class="tit">Cómo practicarás</b>Los ejercicios de código de este curso son en <b>Python</b>: la entrada llega por teclado (<code>input()</code>) y comparas lo que imprimes con la salida esperada. Algunos casos de prueba están ocultos, como en las plataformas de entrevistas.</div>`},
 {t:"par", p:"Empareja cada problema cotidiano con la idea algorítmica",
  pares:[["Buscar en una guía ordenada abriendo por la mitad","Búsqueda binaria"],["Pila de platos: el último que pones es el primero que coges","Pila (LIFO)"],["Cola del supermercado","Cola (FIFO)"],["Encontrar el camino más corto en un mapa","Algoritmos de grafos"],["Buscar un contacto por nombre al instante","Tabla hash"]],
  why:"Todas estas ideas aparecen en el curso, una por una."},
 {t:"opcion", p:"En una entrevista te piden resolver un problema. ¿Qué valoran principalmente?",
  ops:["Que escribas rápido","Que la solución sea correcta, que razones sobre su eficiencia y que expliques tu forma de pensar","Que uses muchas librerías","Que memorices la respuesta"],
  ok:1, why:"Pensar en voz alta es tan importante como el código: el entrevistador evalúa cómo razonas, no solo el resultado."},
 {t:"vf", p:"Si dos algoritmos dan el mismo resultado, son igual de buenos.",
  ok:false, why:"Pueden diferir enormemente en tiempo y memoria cuando la entrada crece."},
 {t:"codigo", p:"Búsqueda lineal: imprime la posición de la primera aparición del objetivo, o <code>-1</code> si no está",
  lenguaje:"py",
  c:`<p>Primera línea: los números separados por espacios. Segunda línea: el objetivo. Las posiciones empiezan en 0.</p>`,
  plantilla:"nums = [int(x) for x in input().split()]\nobjetivo = int(input())\n# recorre nums y imprime la posición\n",
  pruebas:[{entrada:"4 8 15 16 23 42\n15", salida:"2"},{entrada:"4 8 15 16 23 42\n7", salida:"-1"},{entrada:"5 5 5\n5", salida:"0", oculta:true},{entrada:"9\n9", salida:"0", oculta:true}],
  pista:"Usa enumerate(nums) para tener a la vez la posición y el valor; imprime y sal con break en cuanto lo encuentres.",
  solucion:`nums = [int(x) for x in input().split()]
objetivo = int(input())
pos = -1
for i, x in enumerate(nums):
    if x == objetivo:
        pos = i
        break
print(pos)`,
  why:"En el peor caso (el objetivo no está o está al final) recorres los n elementos: O(n). Es la referencia contra la que compararás todo lo demás."},
 {t:"escribe", p:"¿Cuántas comparaciones hace, en el peor caso, una búsqueda lineal en una lista de 500 elementos?",
  sol:["500"], pista:"El peor caso es que no esté.",
  why:"Si el elemento no está, hay que mirar los 500 para poder afirmarlo."}
]},

{
id:"al1l2",
titulo:"La notación O grande",
claves:["O grande describe cómo crece el coste cuando crece la entrada (n)","Se ignoran constantes y términos menores: O(2n + 5) es O(n)","Orden típico: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)"],
pasos:[
 {t:"info", eti:"Medir el crecimiento", h:"Big O",
  c:`<p>No medimos segundos (dependen del ordenador), sino <b>cómo crece</b> el número de operaciones cuando la entrada <code>n</code> crece.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">operaciones con n = 1.000.000</div><table class="dg-tabla"><thead><tr><th>clase</th><th>operaciones</th><th>ejemplo</th></tr></thead><tbody><tr><td>O(1)</td><td>1</td><td>acceder a a[i], buscar en un diccionario</td></tr><tr><td>O(log n)</td><td>~20</td><td>búsqueda binaria</td></tr><tr><td>O(n)</td><td>1.000.000</td><td>recorrer una lista</td></tr><tr><td>O(n log n)</td><td>~20.000.000</td><td>buena ordenación (merge sort, sorted)</td></tr><tr><td>O(n²)</td><td>10<sup>12</sup></td><td>dos bucles anidados: ¡horas!</td></tr><tr><td>O(2ⁿ)</td><td>imposible</td><td>probar todos los subconjuntos</td></tr></tbody></table></div>`},
 {t:"info", eti:"Precisión", h:"O, Ω y Θ",
  c:`<p>Formalmente, <b>O</b> es una cota superior: «crece como mucho así». <b>Ω</b> es una cota inferior y <b>Θ</b> una cota ajustada (por arriba y por abajo). En entrevistas, cuando alguien dice «es O(n)» suele querer decir Θ(n): el crecimiento exacto.</p>
     <p>Si hay varias entradas, cada una lleva su letra: recorrer una lista de <code>n</code> y otra de <code>m</code> es O(n + m), no O(n).</p>`},
 {t:"par", p:"Empareja cada operación con su complejidad",
  pares:[["Acceder a a[5]","O(1)"],["Búsqueda binaria en un array ordenado","O(log n)"],["Recorrer una lista una vez","O(n)"],["Ordenar con sorted()","O(n log n)"],["Comparar cada elemento con todos los demás","O(n²)"]],
  why:"Memoriza este orden: es la base de cualquier discusión de eficiencia."},
 {t:"opcion", p:"¿Qué complejidad tiene este código?", c:`<div class="termbox">for i in range(n):
    for j in range(n):
        if a[i] + a[j] == objetivo:
            return True</div>`,
  ops:["O(n)","O(n log n)","O(n²)","O(1)"],
  ok:2, why:"Dos bucles anidados sobre n: n × n operaciones en el peor caso."},
 {t:"opcion", p:"¿Cómo se simplifica O(3n² + 10n + 100)?",
  ops:["O(3n²)","O(n²)","O(n)","O(100)"],
  ok:1, why:"Se quedan el término dominante y se eliminan las constantes."},
 {t:"vf", p:"Un algoritmo O(n) siempre es más rápido que uno O(n²) para cualquier n.",
  ok:false, why:"Para n pequeños, las constantes pueden hacer que el O(n²) gane. O describe el crecimiento con n grande: por eso sorted() de Python usa inserción en tramos pequeños."},
 {t:"codigo", p:"Cuenta cuántas veces se puede dividir <code>n</code> entre 2 (división entera) hasta llegar a 1",
  lenguaje:"py",
  c:`<p>Lee <code>n</code> e imprime el número de divisiones. Es exactamente lo que hace una búsqueda binaria con cada mitad: verás cómo crece log n.</p>`,
  plantilla:"n = int(input())\npasos = 0\n# divide mientras n > 1\n",
  pruebas:[{entrada:"8", salida:"3"},{entrada:"1", salida:"0"},{entrada:"1000000", salida:"19", oculta:true},{entrada:"1000000000", salida:"29", oculta:true}],
  pista:"while n > 1: n //= 2 y suma 1 a pasos. Después, print(pasos).",
  solucion:`n = int(input())
pasos = 0
while n > 1:
    n //= 2
    pasos += 1
print(pasos)`,
  why:"Mil millones solo necesitan 29 divisiones: eso es O(log n). Multiplicar la entrada por 1000 añade unas 10 operaciones."},
 {t:"escribe", p:"¿Qué complejidad tiene recorrer una lista de <code>n</code> elementos y después otra de <code>m</code>?",
  sol:["O(n + m)","O(n+m)","O(m + n)","O(m+n)","n + m","n+m"], pista:"Dos entradas distintas, bucles uno tras otro.",
  why:"Los bucles secuenciales se suman, y al ser entradas distintas no se puede simplificar a O(n)."}
]},

{
id:"al1l3",
titulo:"Analizar código paso a paso",
claves:["Bucles secuenciales se suman; bucles anidados se multiplican","Dividir la entrada a la mitad en cada paso da log n","La complejidad espacial mide la memoria extra"],
pasos:[
 {t:"info", eti:"Reglas prácticas", h:"Cómo calcular la complejidad",
  c:`<div class="termbox"># secuencial: O(n) + O(n) = O(n)
for x in a: suma += x
for x in a: mayor = max(mayor, x)

# anidado: O(n) * O(m) = O(n * m)
for x in a:
    for y in b: ...

# se divide a la mitad: O(log n)
while n &gt; 1:
    n //= 2

# las llamadas cuentan: "in" sobre una lista es O(m)
for s in palabras:          # n veces
    if s in otra_lista:     # O(m) cada vez: total O(n * m)
        ...</div>
     <div class="nota ojo"><b class="tit">El coste escondido</b><code>x in lista</code>, <code>lista.index(x)</code>, <code>lista.pop(0)</code>, <code>lista.insert(0, x)</code> y copiar con <code>lista[a:b]</code> parecen una línea, pero son O(n).</div>`},
 {t:"par", p:"Empareja cada fragmento con su complejidad",
  pares:[["Un bucle de 0 a n","O(n)"],["Un bucle de 0 a n y otro después de 0 a n","O(n) + O(n), que sigue siendo O(n)"],["Un bucle de 0 a n dentro de otro de 0 a n","O(n²)"],["i se multiplica por 2 hasta llegar a n","O(log n)"],["Un bucle de 0 a 10 siempre","O(1)"]],
  why:"Un número fijo de repeticiones (10) no depende de n: es constante."},
 {t:"info", eti:"Memoria", h:"Complejidad espacial",
  c:`<p>También importa la <b>memoria extra</b>:</p>
     <ul><li>Sumar un array: O(1) de espacio (una variable).</li>
     <li>Copiar el array o guardar todo en un conjunto: O(n).</li>
     <li>Recursión con profundidad n: O(n) en la pila de llamadas.</li></ul>
     <p>Es habitual <b>intercambiar espacio por tiempo</b>: un conjunto usa O(n) de memoria para que las búsquedas pasen de O(n) a O(1).</p>`},
 {t:"opcion", p:"¿Qué complejidad tiene recorrer una lista de n palabras y para cada una comprobar <code>p in otra_lista</code> si otra_lista es una lista de m elementos?",
  ops:["O(n)","O(n + m)","O(n × m)","O(1)"],
  ok:2, why:"<code>in</code> sobre una lista la recorre. Convertir otra_lista en un conjunto (O(m) una vez) lo baja a O(n + m)."},
 {t:"opcion", p:"¿Qué complejidad tiene este bucle?", c:`<div class="termbox">for i in range(n):
    for j in range(i + 1, n):
        comparar(a[i], a[j])</div>`,
  ops:["O(n log n)","O(n²): hace n(n-1)/2 comparaciones","O(n)","O(n³)"],
  ok:1, why:"La mitad de n² sigue siendo cuadrática: las constantes (1/2) se ignoran."},
 {t:"codigo", p:"Cuenta cuántas palabras de la primera línea aparecen en la segunda, en O(n + m)",
  lenguaje:"py",
  c:`<p>Primera línea: n palabras. Segunda línea: m palabras. Imprime cuántas palabras de la primera línea (contando repeticiones) están en la segunda. Con listas de 100.000 palabras, la versión con <code>in</code> sobre una lista no termina a tiempo.</p>`,
  plantilla:"primera = input().split()\nsegunda = input().split()\n# convierte la segunda en un conjunto\n",
  pruebas:[{entrada:"sol mar luna sol\nmar sol cielo", salida:"3"},{entrada:"a b c\nd e", salida:"0"},{entrada:"x x x\nx", salida:"3", oculta:true}],
  pista:"vistas = set(segunda) y luego sum(1 for p in primera if p in vistas).",
  solucion:`primera = input().split()
segunda = input().split()
vistas = set(segunda)
print(sum(1 for p in primera if p in vistas))`,
  why:"Construir el conjunto cuesta O(m) y cada consulta O(1) de media: O(n + m) en total, a cambio de O(m) de memoria."},
 {t:"vf", p:"Una función recursiva que se llama a sí misma n veces seguidas (sin bucles) usa O(1) de memoria.",
  ok:false, why:"Cada llamada pendiente ocupa un marco en la pila: O(n) de espacio. En Python, además, la profundidad por defecto está limitada a unas 1000 llamadas."},
 {t:"hueco", p:"Completa para que la búsqueda de cada elemento sea O(1) de media",
  tpl:"vistos = ___(lista)\nif x ___ vistos: ...",
  banco:["set","list","in","==","sorted"], sol:["set","in"],
  why:"Un set es una tabla hash: pertenencia en O(1) de media frente a O(n) en una lista."}
]},

{
id:"al1n1",
titulo:"Python para entrevistas",
claves:["list, dict y set cubren la mayoría de problemas; deque, heapq y Counter el resto","Cada operación tiene un coste que debes conocer (pop(0) es O(n), deque.popleft() es O(1))","Leer la entrada con input().split() y convertir con int"],
pasos:[
 {t:"info", eti:"Tu caja de herramientas", h:"Estructuras de Python y su coste",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">lo que usarás en casi todos los ejercicios</div><table class="dg-tabla"><thead><tr><th>estructura</th><th>para qué</th><th>coste clave</th><th>en Java</th></tr></thead><tbody>
<tr><td><code>list</code></td><td>array dinámico</td><td>a[i] y append O(1); insert(0) y pop(0) O(n)</td><td>ArrayList</td></tr>
<tr><td><code>dict</code></td><td>clave → valor</td><td>get, set, in: O(1) de media</td><td>HashMap</td></tr>
<tr><td><code>set</code></td><td>pertenencia</td><td>add, in: O(1) de media</td><td>HashSet</td></tr>
<tr><td><code>collections.deque</code></td><td>pila y cola</td><td>append y popleft O(1)</td><td>ArrayDeque</td></tr>
<tr><td><code>heapq</code></td><td>montículo mínimo</td><td>heappush y heappop O(log n)</td><td>PriorityQueue</td></tr>
<tr><td><code>collections.Counter</code></td><td>contar</td><td>O(n) para construirlo</td><td>Map con merge</td></tr>
<tr><td><code>collections.defaultdict</code></td><td>agrupar</td><td>como dict, sin comprobar si existe</td><td>computeIfAbsent</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Entrada y salida", h:"Leer datos como en los ejercicios",
  c:`<div class="termbox">n = int(input())                          # un número en una línea
nums = [int(x) for x in input().split()]  # varios números en una línea
a, b = map(int, input().split())          # dos números en la misma línea
filas = [input() for _ in range(n)]       # n líneas

import sys
datos = sys.stdin.read().split()          # todo de golpe (rápido con entradas enormes)

print(*nums)                              # 1 2 3  (separados por espacios)
print(" ".join(map(str, nums)))           # lo mismo
print(f"total={sum(nums)}")</div>
     <div class="nota ojo"><b class="tit">Formato exacto</b>La salida se compara tal cual: un espacio de más, una coma o un «Total» con mayúscula hacen fallar la prueba.</div>`},
 {t:"par", p:"Empareja cada necesidad con la herramienta de Python",
  pares:[["Cola FIFO eficiente","collections.deque"],["Sacar siempre el mínimo","heapq"],["Frecuencia de cada elemento","collections.Counter"],["Agrupar valores en listas por clave","collections.defaultdict(list)"],["¿Ya he visto este valor?","set"]],
  why:"Saber qué importar te ahorra minutos preciosos en una entrevista."},
 {t:"opcion", p:"Usas una lista como cola con <code>cola.pop(0)</code> en un BFS de un millón de nodos y va lentísimo. ¿Por qué?",
  ops:["Python es lento siempre","pop(0) desplaza todos los elementos: O(n) por operación, O(n²) en total; deque.popleft() es O(1)","Por el recolector de basura","Porque las listas no admiten pop"],
  ok:1, why:"Es uno de los errores de rendimiento más comunes al escribir BFS en Python."},
 {t:"hueco", p:"Completa las importaciones para una cola y un montículo",
  tpl:"from collections import ___\nimport ___",
  banco:["deque","heapq","queue","Counter","stack"], sol:["deque","heapq"],
  why:"deque para colas y pilas; heapq trabaja directamente sobre una lista normal."},
 {t:"codigo", p:"Lee una línea de números e imprime, en líneas separadas, la suma, el máximo y los números ordenados de mayor a menor separados por espacios",
  lenguaje:"py",
  plantilla:"nums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"3 1 4 1 5", salida:"14\n5\n5 4 3 1 1"},{entrada:"-2 -7", salida:"-9\n-2\n-2 -7"},{entrada:"10", salida:"10\n10\n10", oculta:true}],
  pista:"sum(nums), max(nums) y sorted(nums, reverse=True); para imprimir la lista usa print(*lista).",
  solucion:`nums = [int(x) for x in input().split()]
print(sum(nums))
print(max(nums))
print(*sorted(nums, reverse=True))`,
  why:"sorted devuelve una lista nueva en O(n log n); print(*lista) la imprime separada por espacios sin corchetes."},
 {t:"codigo", p:"Imprime la palabra más frecuente de la línea y cuántas veces aparece, con el formato <code>palabra veces</code>",
  lenguaje:"py",
  c:`<p>Si hay empate, gana la que aparece antes en el texto (es lo que hace <code>Counter.most_common</code>).</p>`,
  plantilla:"from collections import Counter\npalabras = input().split()\n",
  pruebas:[{entrada:"el gato y el perro y el pez", salida:"el 3"},{entrada:"b a b a", salida:"b 2"},{entrada:"hola", salida:"hola 1", oculta:true}],
  pista:"Counter(palabras).most_common(1) devuelve [(palabra, veces)].",
  solucion:`from collections import Counter
palabras = input().split()
palabra, veces = Counter(palabras).most_common(1)[0]
print(palabra, veces)`,
  why:"Counter cuenta en O(n). En caso de empate, most_common respeta el orden de primera aparición."},
 {t:"vf", p:"<code>x in d</code> sobre un diccionario comprueba las claves en O(1) de media.",
  ok:true, why:"Para comprobar valores tendrías que usar <code>x in d.values()</code>, que es O(n)."}
]},

{
id:"al1n2",
titulo:"Peor caso, amortizado y límites del enunciado",
claves:["Se analiza el peor caso salvo que se diga otra cosa","Amortizado: el coste medio por operación en una secuencia larga (append es O(1) amortizado)","Los límites del enunciado (n ≤ 10⁵…) dicen qué complejidad necesitas"],
pasos:[
 {t:"info", eti:"Casos", h:"Mejor, peor, medio y amortizado",
  c:`<ul><li><b>Peor caso</b>: la entrada más desfavorable. Es lo que se da por defecto.</li>
     <li><b>Caso medio</b>: sobre entradas aleatorias. Quicksort es O(n log n) de media y O(n²) en el peor caso; una tabla hash es O(1) de media.</li>
     <li><b>Amortizado</b>: el coste total de una secuencia de operaciones repartido entre ellas. <code>list.append</code> a veces copia todo el array para crecer (O(n)), pero duplica la capacidad, así que esas copias son raras: <b>O(1) amortizado</b>.</li></ul>
     <div class="dg"><div class="dg-tit">append en un array que duplica su capacidad</div><div class="dg-flujo"><div class="dg-caja">cap 1</div><div class="dg-caja">cap 2<small>copia 1</small></div><div class="dg-caja">cap 4<small>copia 2</small></div><div class="dg-caja">cap 8<small>copia 4</small></div><div class="dg-caja acento">n inserciones<small>menos de 2n copias</small></div></div></div>`},
 {t:"info", eti:"Leer el enunciado", h:"Los límites te dicen la solución",
  c:`<p>Un ordenador ejecuta del orden de 10<sup>8</sup> operaciones simples por segundo (Python, unas 10<sup>7</sup>). Con el límite de n puedes deducir qué complejidad buscan:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">límite de n → complejidad que cabe en ~1 segundo</div><table class="dg-tabla"><thead><tr><th>n hasta</th><th>complejidad</th><th>técnica típica</th></tr></thead><tbody>
<tr><td>10</td><td>O(n!)</td><td>permutaciones, backtracking</td></tr>
<tr><td>20</td><td>O(2ⁿ)</td><td>subconjuntos, máscaras de bits</td></tr>
<tr><td>500</td><td>O(n³)</td><td>DP sobre intervalos, Floyd-Warshall</td></tr>
<tr><td>5.000</td><td>O(n²)</td><td>DP 2D, dos bucles</td></tr>
<tr><td>10<sup>5</sup> – 10<sup>6</sup></td><td>O(n log n) u O(n)</td><td>ordenar, montículo, hash, dos punteros</td></tr>
<tr><td>10<sup>9</sup> o más</td><td>O(log n) u O(1)</td><td>búsqueda binaria, matemáticas</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja el límite del enunciado con la complejidad que sugiere",
  pares:[["n ≤ 12","O(n!)"],["n ≤ 20","O(2ⁿ · n)"],["n ≤ 3.000","O(n²)"],["n ≤ 200.000","O(n log n)"],["n ≤ 10¹⁸","O(log n)"]],
  why:"Leer los límites antes de pensar te evita perder tiempo en ideas que no pueden funcionar."},
 {t:"opcion", p:"¿Qué significa que <code>append</code> sea O(1) amortizado?",
  ops:["Que siempre tarda lo mismo","Que alguna llamada puede costar O(n) al redimensionar, pero el coste total de n appends es O(n)","Que es O(1) solo de media con datos aleatorios","Que nunca redimensiona"],
  ok:1, why:"Amortizado no es probabilístico: es una garantía sobre la secuencia completa de operaciones."},
 {t:"vf", p:"El caso medio y el amortizado son lo mismo.",
  ok:false, why:"El caso medio promedia sobre entradas posibles (probabilidad). El amortizado promedia sobre una secuencia de operaciones y es una garantía, sin azar."},
 {t:"codigo", p:"Simula un array dinámico que empieza con capacidad 1 y la duplica cuando está lleno: imprime <code>copias=N</code> con el total de elementos copiados tras <code>n</code> inserciones",
  lenguaje:"py",
  c:`<p>Al insertar con el array lleno se copian todos sus elementos a uno del doble de capacidad. Comprueba que el total nunca llega a 2n.</p>`,
  plantilla:"n = int(input())\ncapacidad, tam, copias = 1, 0, 0\n# simula n inserciones\n",
  pruebas:[{entrada:"1", salida:"copias=0"},{entrada:"3", salida:"copias=3"},{entrada:"9", salida:"copias=15", oculta:true},{entrada:"1000000", salida:"copias=1048575", oculta:true}],
  pista:"Para cada inserción: si tam == capacidad, copias += tam y capacidad *= 2. Después tam += 1.",
  solucion:`n = int(input())
capacidad, tam, copias = 1, 0, 0
for _ in range(n):
    if tam == capacidad:
        copias += tam
        capacidad *= 2
    tam += 1
print(f"copias={copias}")`,
  why:"1 + 2 + 4 + … + 2ᵏ &lt; 2n: por eso n appends cuestan O(n) en total y cada uno O(1) amortizado."},
 {t:"opcion", p:"El enunciado dice n ≤ 10⁵ y tu idea es O(n²). ¿Qué haces?",
  ops:["La implementas, seguro que pasa","Buscas una idea O(n log n) u O(n): 10¹⁰ operaciones no caben en el tiempo","Pides más tiempo de ejecución","Cambias de lenguaje"],
  ok:1, why:"10⁵ al cuadrado son 10¹⁰ operaciones: minutos u horas. Comenta la solución cuadrática como punto de partida, pero busca otra."}
]}

]});
