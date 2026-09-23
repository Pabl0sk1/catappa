window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Maestría: la entrevista de código",
resumen: "Un método para afrontar cualquier ejercicio, reconocer patrones, depurar y probar, diseñar estructuras a medida, la complejidad en producción y dos simulacros finales",
nivel: "Maestro",
color: "#4a8a20",
lecciones: [

{
id:"al10l1",
titulo:"Método y reconocimiento de patrones",
claves:["Entender, ejemplos, fuerza bruta, optimizar, codificar, probar","Las señales del enunciado sugieren el patrón","Comunicar el razonamiento en voz alta durante todo el proceso"],
pasos:[
 {t:"info", eti:"El método", h:"45 minutos bien repartidos",
  c:`<div class="dg"><div class="dg-tit">una entrevista de código típica</div><div class="dg-vert">
<div class="dg-caja">1. Entender (3-5 min)<small>repetir el problema, preguntar límites, tipos, duplicados, vacío</small></div>
<div class="dg-caja">2. Ejemplos (2-3 min)<small>uno normal y uno límite, resueltos a mano</small></div>
<div class="dg-caja">3. Fuerza bruta (2 min)<small>decirla con su complejidad, aunque no la escribas</small></div>
<div class="dg-caja acento">4. Optimizar (5-10 min)<small>¿qué trabajo se repite? ¿qué estructura lo evita?</small></div>
<div class="dg-caja">5. Codificar (15 min)<small>limpio, nombres claros, explicando</small></div>
<div class="dg-caja ok">6. Probar (5 min)<small>recorrer el código con un ejemplo y los casos límite</small></div>
</div></div>`},
 {t:"orden", p:"Ordena el método para resolver un ejercicio en una entrevista",
  items:["Repetir el problema y preguntar por entradas, límites y casos especiales","Probar con un par de ejemplos a mano","Proponer una solución directa y decir su complejidad","Buscar un patrón que la mejore (hash, dos punteros, montículo...)","Escribir el código limpio explicando lo que haces","Probarlo con los ejemplos y los casos límite"],
  why:"Saltar directamente al código es el error más común."},
 {t:"info", eti:"Chuleta", h:"Preguntas que desbloquean",
  c:`<ul><li>¿Qué trabajo repito? → guárdalo (hash, prefijos, memoización).</li>
     <li>¿Está ordenado, o puedo ordenarlo? → búsqueda binaria, dos punteros.</li>
     <li>¿Es contiguo? → ventana deslizante o prefijos.</li>
     <li>¿Necesito el mínimo o máximo una y otra vez? → montículo o estructura monótona.</li>
     <li>¿Hay relaciones entre elementos? → grafo.</li>
     <li>¿Hay decisiones con subproblemas que se repiten? → programación dinámica.</li>
     <li>¿Qué complejidad permiten los límites? → descarta ideas antes de escribirlas.</li></ul>`},
 {t:"par", p:"Empareja cada señal del enunciado con el patrón que sugiere",
  pares:[["Array ordenado, buscar un valor o una pareja","Búsqueda binaria o dos punteros"],["Subarray o subcadena contigua","Ventana deslizante"],["«Los K mayores / más frecuentes»","Montículo"],["Dependencias entre tareas","Grafo y orden topológico"],["«Número de formas» o «mínimo coste» con decisiones","Programación dinámica"],["Todas las combinaciones o permutaciones","Backtracking"]],
  why:"Con práctica, estas señales se reconocen en segundos."},
 {t:"opcion", p:"Te bloqueas y no ves la solución óptima. ¿Qué haces?",
  ops:["Quedarte en silencio","Implementar la solución directa correcta, explicar su complejidad y cómo intentarías mejorarla","Decir que no sabes y rendirte","Inventar una complejidad"],
  ok:1, why:"Una solución correcta y bien explicada vale mucho más que nada. A menudo, escribirla revela dónde está el trabajo repetido."},
 {t:"codigo", p:"De la fuerza bruta a lo óptimo: imprime <code>si</code> si hay dos posiciones distintas i, j con <code>a[i] == a[j]</code> y <code>|i - j| ≤ k</code>, o <code>no</code>. Hazlo en O(n)",
  lenguaje:"py",
  c:`<p>Primera línea: k. Segunda: los números. La fuerza bruta (comparar cada par) es O(n·k); piensa qué necesitas recordar de cada valor.</p>`,
  plantilla:"k = int(input())\na = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"3\n1 2 3 1", salida:"si"},{entrada:"2\n1 2 3 1 2 3", salida:"no"},{entrada:"1\n1 0 1 1", salida:"si", oculta:true},{entrada:"0\n5 5", salida:"no", oculta:true}],
  pista:"Guarda la última posición en que viste cada valor; al volver a verlo, compara la distancia con k.",
  solucion:`k = int(input())
a = [int(x) for x in input().split()]
ultima = {}
res = "no"
for i, x in enumerate(a):
    if x in ultima and i - ultima[x] <= k:
        res = "si"
        break
    ultima[x] = i
print(res)`,
  why:"Basta la ÚLTIMA aparición: si la última está demasiado lejos, las anteriores más aún. Esa observación es exactamente el «qué necesito recordar» del método."},
 {t:"vf", p:"En una entrevista, es mejor no mencionar la solución de fuerza bruta para no dar mala impresión.",
  ok:false, why:"Mencionarla con su complejidad demuestra que entiendes el problema y te da un punto de partida para optimizar. Lo que da mala impresión es quedarse en ella sin intentar mejorarla."}
]},

{
id:"al15n1",
titulo:"Depurar, probar y la complejidad en producción",
claves:["Los fallos típicos: límites (off-by-one), vacío, un elemento, repetidos, negativos y desbordamientos","Probar contra una fuerza bruta con entradas aleatorias (stress testing)","En producción, lo cuadrático escondido y la recursión profunda tumban servicios"],
pasos:[
 {t:"info", eti:"Casos límite", h:"La lista que repasar antes de decir «terminado»",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">casos límite por tipo de entrada</div><table class="dg-tabla"><thead><tr><th>entrada</th><th>prueba con</th></tr></thead><tbody>
<tr><td>array</td><td>vacío, un elemento, todo igual, ya ordenado, al revés</td></tr>
<tr><td>números</td><td>0, negativos, máximo del tipo, repetidos</td></tr>
<tr><td>cadenas</td><td>vacía, un carácter, espacios, mayúsculas, no ASCII</td></tr>
<tr><td>árboles</td><td>vacío, un nodo, degenerado (una lista)</td></tr>
<tr><td>grafos</td><td>desconectado, con ciclo, autolazo, aristas repetidas</td></tr>
<tr><td>índices</td><td>primer y último elemento, rangos de longitud 1</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Técnica profesional", h:"Probar contra la fuerza bruta",
  c:`<div class="termbox">import random
for _ in range(1000):
    a = [random.randint(-5, 5) for _ in range(random.randint(0, 8))]
    if rapida(a) != fuerza_bruta(a):
        print("fallo con", a)          # el caso más pequeño que falla: depúralo a mano
        break</div>
     <p>La fuerza bruta es fácil de escribir bien; la versión rápida no. Compararlas con miles de entradas pequeñas encuentra el caso que se te escapaba. Los valores pequeños (-5 a 5) provocan repetidos y colisiones a propósito.</p>`},
 {t:"codigo", p:"Esta búsqueda de la primera aparición tiene errores. Corrígela para que imprima la primera posición del objetivo en la lista ordenada, o -1",
  lenguaje:"py",
  c:`<p>Prueba mentalmente con un elemento, con el objetivo al final y con repetidos.</p>`,
  plantilla:`a = [int(x) for x in input().split()]
objetivo = int(input())
izq, der = 0, len(a) - 1
while izq < der:
    m = (izq + der) // 2
    if a[m] < objetivo:
        izq = m
    else:
        der = m - 1
print(izq if a[izq] == objetivo else -1)
`,
  pruebas:[{entrada:"1 2 2 2 3\n2", salida:"1"},{entrada:"1 3 5\n5", salida:"2"},{entrada:"4\n4", salida:"0", oculta:true},{entrada:"1 3 5\n4", salida:"-1", oculta:true},{entrada:"1 3 5\n9", salida:"-1", oculta:true}],
  pista:"Con la plantilla de fronteras (while izq &lt; der), el lado que puede ser respuesta se conserva (der = m) y el otro avanza (izq = m + 1). Y cuidado con leer a[izq] fuera de rango si der empieza en len(a).",
  solucion:`a = [int(x) for x in input().split()]
objetivo = int(input())
izq, der = 0, len(a)
while izq < der:
    m = (izq + der) // 2
    if a[m] < objetivo:
        izq = m + 1
    else:
        der = m
print(izq if izq < len(a) and a[izq] == objetivo else -1)`,
  why:"Dos errores clásicos: izq = m no reduce el intervalo (bucle infinito) y der = m - 1 descarta una posible respuesta. Usar [0, len(a)) exige comprobar izq &lt; len(a) antes de leer."},
 {t:"info", eti:"Producción", h:"Cuando la complejidad tumba un servicio",
  c:`<ul><li><b>Cuadrático escondido</b>: <code>if x in lista</code> dentro de un bucle funciona con 100 elementos en pruebas y tarda horas con 10⁶ en producción.</li>
     <li><b>Recursión profunda</b>: un JSON o un árbol de categorías muy anidado provoca RecursionError o StackOverflowError.</li>
     <li><b>Colisiones provocadas</b>: un atacante puede enviar claves que colisionan en la tabla hash (hash flooding); por eso Python aleatoriza el hash de las cadenas en cada proceso y Java convierte cubetas grandes en árboles.</li>
     <li><b>ReDoS</b>: expresiones regulares con retroceso catastrófico (<code>(a+)+$</code>) son exponenciales con ciertas entradas.</li>
     <li><b>N + 1 consultas</b>: una consulta a la base de datos dentro de un bucle es O(n) viajes de red.</li></ul>`},
 {t:"opcion", p:"Un endpoint que filtra pedidos va bien en pruebas pero tarda 40 segundos con el catálogo real. En el código hay <code>if p.id in ids_bloqueados</code> dentro del bucle, con <code>ids_bloqueados</code> como lista. ¿Qué cambias primero?",
  ops:["Más servidores","Convertir ids_bloqueados en un set una vez, antes del bucle: de O(n·m) a O(n + m)","Una caché HTTP","Reescribirlo en otro lenguaje"],
  ok:1, why:"El cuello de botella es algorítmico: ninguna máquina más rápida compensa un factor m."},
 {t:"par", p:"Empareja cada síntoma en producción con su causa probable",
  pares:[["Tarda muchísimo más al crecer los datos, sin errores","Complejidad cuadrática escondida"],["RecursionError con ciertos documentos","Recursión demasiado profunda"],["CPU al 100 % con una petición concreta y una regex","Retroceso catastrófico (ReDoS)"],["Cientos de consultas SQL por petición","Consultas dentro de un bucle (N + 1)"]],
  why:"Reconocer el patrón algorítmico detrás de un incidente es una habilidad de ingeniería sénior."},
 {t:"vf", p:"Si una solución pasa los ejemplos del enunciado, está bien.",
  ok:false, why:"Los ejemplos rara vez cubren vacío, un elemento, repetidos o valores extremos. Repasa la lista de casos límite antes de darla por buena."}
]},

{
id:"al15n2",
titulo:"Diseñar estructuras a medida",
claves:["Empieza por las operaciones y su coste pedido; elige la combinación de estructuras que lo cumple","Combinar dos estructuras es lo habitual: diccionario + lista, diccionario + montículo, deque + contador","Borrar de un array en O(1): intercambiar con el último y hacer pop"],
pasos:[
 {t:"info", eti:"Diseño", h:"De las operaciones a la estructura",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">operaciones pedidas → combinación de estructuras</div><table class="dg-tabla"><thead><tr><th>operaciones</th><th>estructura</th></tr></thead><tbody>
<tr><td>get/put con expulsión del menos usado, O(1)</td><td>diccionario + lista doblemente enlazada (LRU)</td></tr>
<tr><td>insertar, borrar y elemento aleatorio en O(1)</td><td>diccionario valor → índice + lista</td></tr>
<tr><td>valor de una clave en un instante t</td><td>diccionario clave → lista de (t, valor) ordenada + bisect</td></tr>
<tr><td>visitas de los últimos 5 minutos</td><td>deque de marcas de tiempo</td></tr>
<tr><td>mediana en vivo</td><td>dos montículos</td></tr>
</tbody></table></div>
<div class="termbox"># borrar de una lista en O(1) si el orden no importa
i = pos[x]
ultimo = lista[-1]
lista[i] = ultimo; pos[ultimo] = i      # el último ocupa el hueco
lista.pop(); del pos[x]</div>`},
 {t:"codigo", p:"Almacén clave-valor con tiempo: procesa <code>set clave valor t</code> y <code>get clave t</code>; el get devuelve el valor de la clave con el mayor instante ≤ t, o <code>-</code>",
  lenguaje:"py",
  c:`<p>Primera línea: número de órdenes. Los <code>set</code> de una misma clave llegan con instantes crecientes.</p>`,
  plantilla:"from bisect import bisect_right\nfrom collections import defaultdict\nn = int(input())\n",
  pruebas:[{entrada:"5\nset foo bar 1\nget foo 1\nget foo 3\nset foo bar2 4\nget foo 4", salida:"bar\nbar\nbar2"},{entrada:"3\nset a x 5\nget a 4\nget b 9", salida:"-\n-"},{entrada:"4\nset k v1 10\nset k v2 20\nget k 15\nget k 25", salida:"v1\nv2", oculta:true}],
  pista:"Por clave, dos listas paralelas: instantes y valores. En el get, i = bisect_right(instantes, t) - 1.",
  solucion:`from bisect import bisect_right
from collections import defaultdict
n = int(input())
tiempos = defaultdict(list)
valores = defaultdict(list)
for _ in range(n):
    p = input().split()
    if p[0] == "set":
        tiempos[p[1]].append(int(p[3]))
        valores[p[1]].append(p[2])
    else:
        i = bisect_right(tiempos[p[1]], int(p[2])) - 1
        print(valores[p[1]][i] if i >= 0 else "-")`,
  why:"Como los instantes llegan crecientes, las listas ya están ordenadas: set O(1) y get O(log n). Es la idea de los almacenes con versiones (MVCC)."},
 {t:"codigo", p:"Contador de visitas: procesa <code>hit t</code> y <code>count t</code>; count imprime cuántas visitas hubo en los últimos 300 segundos, es decir, con instante en (t - 300, t]",
  lenguaje:"py",
  c:`<p>Primera línea: número de órdenes. Los instantes llegan en orden no decreciente.</p>`,
  plantilla:"from collections import deque\nn = int(input())\n",
  pruebas:[{entrada:"6\nhit 1\nhit 2\nhit 3\ncount 4\nhit 300\ncount 300", salida:"3\n4"},{entrada:"4\nhit 1\ncount 301\nhit 301\ncount 301", salida:"0\n1"},{entrada:"5\nhit 10\nhit 10\ncount 309\ncount 310\ncount 5", salida:"2\n0\n0", oculta:true}],
  pista:"Guarda los instantes en una deque; en cada count, saca por la izquierda los que sean ≤ t - 300.",
  solucion:`from collections import deque
n = int(input())
q = deque()
for _ in range(n):
    orden, t = input().split()
    t = int(t)
    if orden == "hit":
        q.append(t)
    else:
        while q and q[0] <= t - 300:
            q.popleft()
        print(len(q))`,
  why:"Cada visita entra y sale una vez: O(1) amortizado. Con millones de visitas por segundo, se guardaría un contador por segundo en un array circular de 300 posiciones."},
 {t:"opcion", p:"Te piden <code>insertar</code>, <code>borrar</code> y <code>aleatorio</code> en O(1). ¿Por qué no basta con un set de Python?",
  ops:["Sí basta","Un set no permite elegir un elemento al azar en O(1): random.choice necesita indexar, y convertirlo a lista es O(n)","Porque el set no admite borrar","Porque el set está ordenado"],
  ok:1, why:"La lista da el acceso por índice; el diccionario valor → índice permite borrar en O(1) intercambiando con el último."},
 {t:"par", p:"Empareja cada requisito con la pieza que lo resuelve",
  pares:[["Encontrar un elemento por clave en O(1)","Diccionario"],["Mantener el orden de uso y mover al final en O(1)","Lista doblemente enlazada"],["Elemento aleatorio en O(1)","Lista indexable"],["Descartar lo que caduca por antigüedad","Deque"],["El mínimo actual en O(1) con inserciones","Montículo"]],
  why:"Las preguntas de diseño de estructuras se resuelven combinando piezas conocidas, no inventando nada."},
 {t:"vf", p:"En el truco de borrar intercambiando con el último, el orden de los elementos se conserva.",
  ok:false, why:"Se pierde: el último pasa a ocupar el hueco. Por eso solo vale cuando el orden no importa."}
]},

{
id:"al15n3",
titulo:"Simulacro con código",
claves:["Problemas completos de nivel medio y difícil, sin decir qué técnica usar","Identifica el patrón antes de escribir","Revisa casos límite antes de comprobar"],
pasos:[
 {t:"info", eti:"Reglas", h:"Como en la entrevista",
  c:`<p>Cuatro problemas clásicos. Para cada uno: lee los límites, piensa la fuerza bruta y su coste, identifica el patrón y solo entonces escribe. Intenta resolverlos sin mirar la pista.</p>
     <div class="nota"><b class="tit">Cronómetro</b>Unos 20 minutos por problema es el ritmo de una entrevista real.</div>`},
 {t:"codigo", p:"Agua atrapada: las alturas forman un perfil de barras de ancho 1. Imprime cuántas unidades de agua quedan atrapadas tras llover",
  lenguaje:"py",
  plantilla:"h = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"0 1 0 2 1 0 1 3 2 1 2 1", salida:"6"},{entrada:"4 2 0 3 2 5", salida:"9"},{entrada:"3", salida:"0", oculta:true},{entrada:"5 4 3 2 1", salida:"0", oculta:true},{entrada:"2 0 2", salida:"2", oculta:true}],
  pista:"El agua sobre i es min(máximo a la izquierda, máximo a la derecha) - h[i]. Con dos punteros: avanza el lado con el máximo más bajo, que es el que limita.",
  solucion:`h = [int(x) for x in input().split()]
i, j = 0, len(h) - 1
max_i = max_j = agua = 0
while i < j:
    if h[i] < h[j]:
        max_i = max(max_i, h[i])
        agua += max_i - h[i]
        i += 1
    else:
        max_j = max(max_j, h[j])
        agua += max_j - h[j]
        j -= 1
print(agua)`,
  why:"Tres soluciones posibles: prefijos de máximos (O(n) y O(n) de memoria), pila monótona, o dos punteros (O(n) y O(1)). Saber explicar las tres impresiona."},
 {t:"codigo", p:"Imprime la subcadena palíndroma más larga (si hay empate, la que empieza antes)",
  lenguaje:"py",
  plantilla:"s = input()\n",
  pruebas:[{entrada:"babad", salida:"bab"},{entrada:"cbbd", salida:"bb"},{entrada:"a", salida:"a", oculta:true},{entrada:"forgeeksskeegfor", salida:"geeksskeeg", oculta:true}],
  pista:"Expande desde cada centro: hay 2n - 1 centros (cada carácter y cada hueco entre dos). O(n²) y O(1) de memoria.",
  solucion:`s = input()
mejor_i, mejor_len = 0, 1
for centro in range(2 * len(s) - 1):
    i = centro // 2
    j = i + centro % 2
    while i >= 0 and j < len(s) and s[i] == s[j]:
        i -= 1
        j += 1
    largo = j - i - 1
    if largo > mejor_len:
        mejor_i, mejor_len = i + 1, largo
print(s[mejor_i:mejor_i + mejor_len])`,
  why:"Los centros en los huecos cubren los palíndromos de longitud par (bb). Existe un algoritmo O(n) (Manacher), pero en entrevista basta con explicar el O(n²)."},
 {t:"codigo", p:"Partir en palabras: imprime <code>si</code> si la cadena se puede dividir en palabras del diccionario (reutilizables), o <code>no</code>",
  lenguaje:"py",
  c:`<p>Primera línea: la cadena. Segunda: las palabras del diccionario.</p>`,
  plantilla:"s = input()\ndic = set(input().split())\n",
  pruebas:[{entrada:"leetcode\nleet code", salida:"si"},{entrada:"catsandog\ncats dog sand and cat", salida:"no"},{entrada:"applepenapple\napple pen", salida:"si", oculta:true},{entrada:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaab\na aa aaa aaaa", salida:"no", oculta:true}],
  pista:"dp[i] = si s[:i] se puede partir. dp[0] = True; dp[i] es cierto si existe j &lt; i con dp[j] y s[j:i] en el diccionario.",
  solucion:`s = input()
dic = set(input().split())
largo_max = max(map(len, dic))
dp = [True] + [False] * len(s)
for i in range(1, len(s) + 1):
    for j in range(max(0, i - largo_max), i):
        if dp[j] and s[j:i] in dic:
            dp[i] = True
            break
print("si" if dp[len(s)] else "no")`,
  why:"El último caso oculto destroza el backtracking sin memoria (exponencial). Limitar j a la longitud máxima de palabra es una optimización fácil de explicar."},
 {t:"codigo", p:"Formas de decodificar: con A=1, B=2 … Z=26, imprime de cuántas formas se puede decodificar la cadena de dígitos",
  lenguaje:"py",
  plantilla:"s = input()\n",
  pruebas:[{entrada:"12", salida:"2"},{entrada:"226", salida:"3"},{entrada:"06", salida:"0", oculta:true},{entrada:"11106", salida:"2", oculta:true},{entrada:"10", salida:"1", oculta:true}],
  pista:"Como las escaleras: dp[i] = dp[i-1] si s[i-1] no es 0, más dp[i-2] si s[i-2:i] está entre 10 y 26.",
  solucion:`s = input()
a, b = 1, 1 if s[0] != "0" else 0
for i in range(2, len(s) + 1):
    c = 0
    if s[i - 1] != "0":
        c += b
    if 10 <= int(s[i - 2:i]) <= 26:
        c += a
    a, b = b, c
print(b)`,
  why:"Es la escalera de la lección de DP con reglas de validez. Los ceros son la trampa: «06» no es válido y «10» solo se lee de una forma."},
 {t:"vf", p:"En «agua atrapada», el agua sobre cada barra depende solo de sus dos vecinas inmediatas.",
  ok:false, why:"Depende del máximo a toda su izquierda y a toda su derecha. Ese es el insight que abre las tres soluciones."}
]},

{
id:"al10l2",
titulo:"Simulacro final de entrevista",
claves:["Has practicado los patrones más frecuentes","Sabes analizar y justificar la complejidad","Estás preparado para la parte de código de una entrevista técnica"],
pasos:[
 {t:"info", eti:"Último paso", h:"Problemas mezclados",
  c:`<p>Antes de elegir, piensa qué patrón aplicarías y qué complejidad tendría. En la entrevista real, esto es lo que dirías en los primeros cinco minutos.</p>`},
 {t:"opcion", p:"«Dado un array, devuelve true si algún valor aparece al menos dos veces.» ¿Mejor solución?",
  ops:["Dos bucles anidados, O(n²)","Un conjunto recorriendo una vez: O(n) tiempo, O(n) espacio (u ordenar y comparar vecinos, O(n log n) y O(1))","Búsqueda binaria","Programación dinámica"],
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
  ops:["Ordenar el array","Contar con un diccionario y mantener un montículo mínimo de tamaño k: O(n log k)","Dos punteros","Backtracking"],
  ok:1, why:"También vale bucket sort por frecuencia en O(n)."},
 {t:"opcion", p:"«¿Cuántos subarrays suman exactamente k? Puede haber negativos.»",
  ops:["Ventana deslizante","Prefijos con un diccionario de frecuencias: O(n)","Ordenar y dos punteros","Montículo"],
  ok:1, why:"Los negativos descartan la ventana; ordenar destruye la contigüidad. Prefijo actual menos k: ¿cuántas veces lo he visto?"},
 {t:"opcion", p:"«Ruta más barata entre dos ciudades con precios por tramo, todos positivos.»",
  ops:["BFS","Dijkstra con montículo: O((V + E) log V)","Orden topológico","Backtracking de todas las rutas"],
  ok:1, why:"Pesos distintos descartan BFS; si hubiera un límite de escalas, pasarías a Bellman-Ford con k + 1 rondas."},
 {t:"opcion", p:"«Velocidad mínima para terminar el trabajo en h horas.»",
  ops:["Programación dinámica","Búsqueda binaria sobre la respuesta con una comprobación O(n)","Voraz ordenando","Montículo"],
  ok:1, why:"«Mínimo valor que permite…» con una comprobación monótona es la firma de la búsqueda binaria sobre la respuesta."},
 {t:"info", eti:"Terminado", h:"Has completado Algoritmos y estructuras de datos",
  c:`<p>Dominas la notación O, arrays y hashing, dos punteros y ventanas, prefijos, pilas, colas y listas, búsqueda binaria, recursión y backtracking, ordenación, árboles, montículos y tries, grafos con y sin pesos, programación dinámica, voraces, intervalos, bits y la aritmética de las entrevistas.</p>
     <p>Para consolidarlo: resuelve una lista de problemas agrupados por patrón (como «NeetCode 150» o «Blind 75»), empezando por los fáciles y explicando en voz alta cada solución como si estuvieras en la entrevista. Repite a los pocos días los que te costaron: la memoria de patrones se entrena como cualquier otra.</p>`}
]}

]});
