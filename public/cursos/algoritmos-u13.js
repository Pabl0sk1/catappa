window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Programación dinámica",
resumen: "Subproblemas que se repiten, memoización y tabulación, y los patrones clásicos: DP lineal, mochila, cadenas, subsecuencias y cuadrículas",
nivel: "Experto",
color: "#58962a",
lecciones: [

{
id:"al8l1",
titulo:"Memoización y tabulación",
claves:["Programación dinámica: problemas con subproblemas repetidos y solución óptima a partir de subsoluciones","Memoización: recursión + caché (de arriba abajo)","Tabulación: rellenar una tabla desde los casos base (de abajo arriba)"],
pasos:[
 {t:"info", eti:"No repetir trabajo", h:"Dos formas de hacer DP",
  c:`<div class="termbox"># maneras de subir n escalones de 1 en 1 o de 2 en 2
# recurrencia: formas(n) = formas(n-1) + formas(n-2)

# 1. memoización (de arriba abajo)
from functools import cache
@cache
def formas(n):
    if n &lt;= 1:
        return 1
    return formas(n - 1) + formas(n - 2)

# 2. tabulación (de abajo arriba)
def formas_tab(n):
    dp = [1] * (n + 1)
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# 3. tabulación con O(1) de espacio: solo hacen falta los dos últimos
def formas_o1(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b</div>`},
 {t:"info", eti:"Elegir", h:"Memoización frente a tabulación",
  c:`<div class="dg dg-cols"><div class="dg-col"><div class="dg-col-tit">memoización</div><div class="dg-pila"><div class="dg-caja ok">se escribe igual que la recursión</div><div class="dg-caja ok">solo calcula los estados que hacen falta</div><div class="dg-caja aviso">límite de recursión y coste de las llamadas</div></div></div>
<div class="dg-col"><div class="dg-col-tit">tabulación</div><div class="dg-pila"><div class="dg-caja ok">sin recursión: más rápida en Python</div><div class="dg-caja ok">permite reducir memoria a una o dos filas</div><div class="dg-caja aviso">hay que pensar el orden de cálculo</div></div></div></div>
     <p>En una entrevista, empezar por la memoización (a partir de la fuerza bruta recursiva) y convertirla después en tabla es un camino excelente para explicar.</p>`},
 {t:"orden", p:"Ordena los pasos para resolver un problema con programación dinámica",
  items:["Definir el estado: qué significa dp[i]","Escribir la recurrencia a partir de estados más pequeños","Fijar los casos base","Decidir el orden de cálculo (o usar memoización)","Optimizar la memoria si solo se usan los últimos estados"],
  why:"Definir bien el estado es el 80% del trabajo."},
 {t:"par", p:"Empareja cada técnica con su descripción",
  pares:[["Memoización","Recursión que guarda resultados ya calculados"],["Tabulación","Bucle que rellena una tabla desde los casos base"],["Subestructura óptima","La mejor solución se construye con mejores subsoluciones"],["Subproblemas solapados","Los mismos subproblemas aparecen muchas veces"]],
  why:"Si no hay subproblemas repetidos, basta con divide y vencerás."},
 {t:"codigo", p:"Escalera con coste: pisar el escalón i cuesta c[i]; puedes empezar en el 0 o en el 1 y subir de 1 o de 2. Imprime el coste mínimo para pasar del último escalón",
  lenguaje:"py",
  plantilla:"c = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"10 15 20", salida:"15"},{entrada:"1 100 1 1 1 100 1 1 100 1", salida:"6"},{entrada:"5 5", salida:"5", oculta:true},{entrada:"0 0 0 1", salida:"0", oculta:true}],
  pista:"dp[i] = coste mínimo para estar en i = c[i] + min(dp[i-1], dp[i-2]). La respuesta es min(dp[n-1], dp[n-2]).",
  solucion:`c = [int(x) for x in input().split()]
a, b = c[0], c[1]
for i in range(2, len(c)):
    a, b = b, c[i] + min(a, b)
print(min(a, b))`,
  why:"Solo se necesitan los dos últimos estados, así que la tabla se reduce a dos variables: O(n) y O(1)."},
 {t:"vf", p:"Todo problema recursivo se beneficia de la memoización.",
  ok:false, why:"Solo si hay subproblemas repetidos. Merge sort, por ejemplo, nunca repite un subproblema: memoizar no aporta nada."},
 {t:"opcion", p:"Tu solución memoizada da RecursionError con n = 100.000 en Python. ¿Qué haces?",
  ops:["Subir el límite a un millón y cruzar los dedos","Pasar a tabulación con un bucle, que no usa la pila de llamadas","Quitar la caché","Usar otro lenguaje"],
  ok:1, why:"Subir sys.setrecursionlimit ayuda un poco, pero la pila real del proceso también tiene límite. La tabulación lo evita del todo."}
]},

{
id:"al8l2",
titulo:"DP lineal: decidir en cada posición",
claves:["dp[i] = mejor resultado usando los primeros i elementos","Robar casas: coger la actual (y saltar la anterior) o no cogerla","Monedas: dp[x] = mínimo de dp[x - moneda] + 1"],
pasos:[
 {t:"info", eti:"Los que siempre salen", h:"Robar casas y monedas",
  c:`<div class="termbox"># robar casas no contiguas: máximo botín
coger, saltar = 0, 0                   # mejor terminando cogiendo / sin coger la casa actual
for x in casas:
    coger, saltar = saltar + x, max(coger, saltar)
mejor = max(coger, saltar)

# mínimo de monedas para un importe (-1 si no se puede)
def monedas(m, importe):
    INF = float("inf")
    dp = [0] + [INF] * importe         # dp[x] = monedas mínimas para x
    for x in range(1, importe + 1):
        for c in m:
            if c &lt;= x and dp[x - c] + 1 &lt; dp[x]:
                dp[x] = dp[x - c] + 1
    return dp[importe] if dp[importe] &lt; INF else -1</div>`},
 {t:"opcion", p:"Con monedas {1, 3, 4} e importe 6, ¿cuántas monedas como mínimo?",
  ops:["3 (4 + 1 + 1)","2 (3 + 3)","6","1"],
  ok:1, why:"El algoritmo voraz (coger siempre la mayor) daría 3: por eso aquí hace falta programación dinámica."},
 {t:"codigo", p:"Robar casas: no puedes robar dos casas contiguas. Imprime el botín máximo",
  lenguaje:"py",
  plantilla:"casas = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"1 2 3 1", salida:"4"},{entrada:"2 7 9 3 1", salida:"12"},{entrada:"5", salida:"5", oculta:true},{entrada:"2 1 1 2", salida:"4", oculta:true}],
  pista:"Para cada casa: coger = saltar_anterior + x; saltar = max(coger_anterior, saltar_anterior).",
  solucion:`casas = [int(x) for x in input().split()]
coger = saltar = 0
for x in casas:
    coger, saltar = saltar + x, max(coger, saltar)
print(max(coger, saltar))`,
  why:"El caso 2 1 1 2 muestra que coger «una sí, una no» no basta: la mejor es la primera y la última."},
 {t:"codigo", p:"Imprime el número mínimo de monedas para formar el importe, o -1 si no se puede",
  lenguaje:"py",
  c:`<p>Primera línea: las monedas disponibles (ilimitadas). Segunda: el importe.</p>`,
  plantilla:"m = [int(x) for x in input().split()]\nimporte = int(input())\n",
  pruebas:[{entrada:"1 2 5\n11", salida:"3"},{entrada:"2\n3", salida:"-1"},{entrada:"1 3 4\n6", salida:"2", oculta:true},{entrada:"7\n0", salida:"0", oculta:true}],
  pista:"dp = [0] + [inf] * importe; para cada x y cada moneda c ≤ x, dp[x] = min(dp[x], dp[x - c] + 1).",
  solucion:`m = [int(x) for x in input().split()]
importe = int(input())
INF = float("inf")
dp = [0] + [INF] * importe
for x in range(1, importe + 1):
    for c in m:
        if c <= x and dp[x - c] + 1 < dp[x]:
            dp[x] = dp[x - c] + 1
print(dp[importe] if dp[importe] < INF else -1)`,
  why:"O(importe × monedas). El importe 0 necesita 0 monedas: es el caso base que hace funcionar todo lo demás."},
 {t:"info", eti:"Otro clásico", h:"Subarray de suma máxima (Kadane)",
  c:`<div class="termbox">mejor = actual = a[0]
for x in a[1:]:
    actual = max(x, actual + x)     # seguir el subarray o empezar de nuevo en x
    mejor = max(mejor, actual)</div>
     <p>El estado es «mejor suma de un subarray que <b>termina</b> en i». Si lo que llevas acumulado es negativo, te estorba: empieza de nuevo.</p>`},
 {t:"codigo", p:"Kadane: imprime la suma máxima de un subarray contiguo no vacío",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"-2 1 -3 4 -1 2 1 -5 4", salida:"6"},{entrada:"-3 -1 -2", salida:"-1"},{entrada:"5 4 -1 7 8", salida:"23", oculta:true}],
  pista:"actual = max(x, actual + x); mejor = max(mejor, actual). Empieza ambos con a[0].",
  solucion:`a = [int(x) for x in input().split()]
mejor = actual = a[0]
for x in a[1:]:
    actual = max(x, actual + x)
    mejor = max(mejor, actual)
print(mejor)`,
  why:"Inicializar con 0 en vez de a[0] rompe el caso de todos negativos: devolvería 0, un subarray vacío."},
 {t:"par", p:"Empareja cada problema con la definición de su estado",
  pares:[["Mínimo de monedas","dp[x] = monedas mínimas para el importe x"],["Robar casas","dp[i] = máximo obtenido con las primeras i casas"],["Kadane","dp[i] = mejor suma de un subarray que termina en i"],["Formas de subir la escalera","dp[i] = maneras de llegar al escalón i"]],
  why:"«Termina en i» frente a «usando los primeros i» es la decisión de diseño más frecuente."}
]},

{
id:"al13n1",
titulo:"Mochila",
claves:["Mochila 0/1: cada objeto se coge una vez; dp[c] = mejor valor con capacidad c","Recorrer la capacidad hacia abajo en 0/1 y hacia arriba en la ilimitada","Muchos problemas son mochilas disfrazadas: partición en dos mitades iguales, suma objetivo"],
pasos:[
 {t:"info", eti:"El patrón madre", h:"Mochila 0/1",
  c:`<p>Objetos con peso y valor, y una capacidad. Para cada objeto decides: <b>no cogerlo</b> (el valor sigue igual) o <b>cogerlo</b> (valor + el mejor con la capacidad que queda).</p>
<div class="termbox"># dp[i][c] = mejor valor con los i primeros objetos y capacidad c
# dp[i][c] = max(dp[i-1][c], dp[i-1][c - peso] + valor)

dp = [0] * (C + 1)                     # versión con una sola fila
for peso, valor in objetos:
    for c in range(C, peso - 1, -1):   # HACIA ABAJO: cada objeto se usa una vez
        dp[c] = max(dp[c], dp[c - peso] + valor)</div>
     <div class="nota ojo"><b class="tit">El sentido del bucle</b>Si recorres la capacidad hacia arriba, <code>dp[c - peso]</code> ya incluiría el objeto actual y lo usarías varias veces: eso es la mochila <b>ilimitada</b>, otro problema.</div>`},
 {t:"codigo", p:"Mochila 0/1: imprime el valor máximo que cabe en la capacidad",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n C</code>. Después n líneas <code>peso valor</code>.</p>`,
  plantilla:"n, C = map(int, input().split())\nobjetos = [tuple(map(int, input().split())) for _ in range(n)]\n",
  pruebas:[{entrada:"3 50\n10 60\n20 100\n30 120", salida:"220"},{entrada:"2 3\n4 10\n5 20", salida:"0"},{entrada:"4 7\n1 1\n3 4\n4 5\n5 7", salida:"9", oculta:true}],
  pista:"Una fila dp de tamaño C + 1; para cada objeto, recorre c desde C hasta peso hacia abajo.",
  solucion:`n, C = map(int, input().split())
objetos = [tuple(map(int, input().split())) for _ in range(n)]
dp = [0] * (C + 1)
for peso, valor in objetos:
    for c in range(C, peso - 1, -1):
        dp[c] = max(dp[c], dp[c - peso] + valor)
print(dp[C])`,
  why:"El voraz por valor/peso fallaría en el primer caso (cogería el de 10 y el de 20: 160). O(n·C) en tiempo y O(C) en memoria."},
 {t:"info", eti:"Disfraces", h:"Partición en dos mitades iguales",
  c:`<p>«¿Se puede dividir el array en dos grupos con la misma suma?» Si la suma total es S, basta con saber si algún subconjunto suma S/2: mochila 0/1 de booleanos.</p>
<div class="termbox">puede = [True] + [False] * objetivo
for x in nums:
    for s in range(objetivo, x - 1, -1):
        puede[s] = puede[s] or puede[s - x]</div>
     <p>Truco en Python: un entero como conjunto de bits, <code>bits |= bits &lt;&lt; x</code>, hace lo mismo muchísimo más rápido.</p>`},
 {t:"codigo", p:"¿Se puede dividir la lista en dos grupos con la misma suma? Imprime <code>si</code> o <code>no</code>",
  lenguaje:"py",
  plantilla:"nums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"1 5 11 5", salida:"si"},{entrada:"1 2 3 5", salida:"no"},{entrada:"2 2", salida:"si", oculta:true},{entrada:"3 3 3 4 5", salida:"si", oculta:true},{entrada:"1", salida:"no", oculta:true}],
  pista:"Si la suma es impar, no. Si no, mochila de booleanos hasta suma / 2, recorriendo hacia abajo.",
  solucion:`nums = [int(x) for x in input().split()]
s = sum(nums)
if s % 2:
    print("no")
else:
    objetivo = s // 2
    puede = [True] + [False] * objetivo
    for x in nums:
        for t in range(objetivo, x - 1, -1):
            puede[t] = puede[t] or puede[t - x]
    print("si" if puede[objetivo] else "no")`,
  why:"3 3 3 4 5 suma 18: {4, 5} y {3, 3, 3}. Reconocer una mochila escondida es la habilidad clave de esta lección."},
 {t:"codigo", p:"Formas de dar el cambio: imprime de cuántas formas distintas (sin importar el orden) se puede formar el importe con monedas ilimitadas",
  lenguaje:"py",
  c:`<p>Primera línea: monedas. Segunda: importe.</p>`,
  plantilla:"m = [int(x) for x in input().split()]\nimporte = int(input())\n",
  pruebas:[{entrada:"1 2 5\n5", salida:"4"},{entrada:"2\n3", salida:"0"},{entrada:"10\n10", salida:"1", oculta:true},{entrada:"1 2 5\n100", salida:"541", oculta:true}],
  pista:"formas = [1] + [0] * importe; bucle EXTERIOR por moneda e interior por importe hacia arriba: formas[x] += formas[x - c].",
  solucion:`m = [int(x) for x in input().split()]
importe = int(input())
formas = [1] + [0] * importe
for c in m:
    for x in range(c, importe + 1):
        formas[x] += formas[x - c]
print(formas[importe])`,
  why:"Con las monedas en el bucle exterior cuentas combinaciones (1+2 y 2+1 una vez). Si inviertes los bucles, cuentas permutaciones: otro problema."},
 {t:"opcion", p:"En la mochila con una sola fila, ¿por qué el bucle de capacidad va hacia abajo en la versión 0/1?",
  ops:["Por eficiencia","Para que dp[c - peso] siga siendo el valor de la fila anterior (sin el objeto actual) y cada objeto se use una sola vez","Porque los pesos son negativos","Da igual el sentido"],
  ok:1, why:"Hacia arriba, el mismo objeto podría sumarse varias veces: es la mochila ilimitada."},
 {t:"vf", p:"La mochila 0/1 con capacidad C y n objetos se resuelve en O(n · C), que es polinómico en el tamaño de la entrada.",
  ok:false, why:"Es pseudopolinómico: C es un número, no el tamaño de la entrada; con C de 10¹⁸ la tabla es imposible. La mochila es NP-difícil en general."}
]},

{
id:"al13n2",
titulo:"DP sobre dos cadenas",
claves:["dp[i][j] = respuesta para los prefijos a[:i] y b[:j]","LCS: si coinciden, diagonal + 1; si no, máximo de arriba e izquierda","Distancia de edición: insertar, borrar o sustituir, lo más barato"],
pasos:[
 {t:"info", eti:"Tablas 2D", h:"Subsecuencia común más larga",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">LCS de «ABCB» y «BDCB» (resultado 3: BCB)</div><table class="dg-tabla"><thead><tr><th></th><th>""</th><th>B</th><th>D</th><th>C</th><th>B</th></tr></thead><tbody>
<tr><td>""</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>A</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>B</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>C</td><td>0</td><td>1</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>B</td><td>0</td><td>1</td><td>1</td><td>2</td><td>3</td></tr>
</tbody></table></div>
<div class="termbox">dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
for i in range(1, len(a) + 1):
    for j in range(1, len(b) + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])</div>
     <p>Es la base de <code>diff</code> y de <code>git diff</code>: las líneas que no cambian son una subsecuencia común más larga.</p>`},
 {t:"codigo", p:"Imprime la longitud de la subsecuencia común más larga de las dos cadenas",
  lenguaje:"py",
  plantilla:"a = input()\nb = input()\n",
  pruebas:[{entrada:"abcde\nace", salida:"3"},{entrada:"abc\ndef", salida:"0"},{entrada:"ABCB\nBDCB", salida:"3", oculta:true},{entrada:"AGGTAB\nGXTXAYB", salida:"4", oculta:true}],
  pista:"Tabla (len(a)+1) × (len(b)+1) con ceros; si a[i-1] == b[j-1], diagonal + 1; si no, máximo de arriba y de la izquierda.",
  solucion:`a = input()
b = input()
dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
for i in range(1, len(a) + 1):
    for j in range(1, len(b) + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
print(dp[len(a)][len(b)])`,
  why:"O(n·m) en tiempo. Como cada fila solo usa la anterior, la memoria se puede bajar a O(m)."},
 {t:"info", eti:"Correctores", h:"Distancia de edición (Levenshtein)",
  c:`<div class="termbox"># dp[i][j] = operaciones para convertir a[:i] en b[:j]
dp[i][0] = i                      # borrar i caracteres
dp[0][j] = j                      # insertar j caracteres
si a[i-1] == b[j-1]:  dp[i][j] = dp[i-1][j-1]
si no:                dp[i][j] = 1 + min(dp[i-1][j],     # borrar
                                         dp[i][j-1],     # insertar
                                         dp[i-1][j-1])   # sustituir</div>
     <p>Es lo que usan los correctores ortográficos para sugerir palabras cercanas y las herramientas de comparación de ADN.</p>`},
 {t:"codigo", p:"Imprime la distancia de edición entre las dos palabras (insertar, borrar o sustituir un carácter cuesta 1)",
  lenguaje:"py",
  plantilla:"a = input()\nb = input()\n",
  pruebas:[{entrada:"horse\nros", salida:"3"},{entrada:"intention\nexecution", salida:"5"},{entrada:"gato\ngato", salida:"0", oculta:true},{entrada:"abc\nyabd", salida:"2", oculta:true}],
  pista:"Primera fila y columna con 0..n; después, si coinciden copia la diagonal, y si no 1 + mínimo de las tres vecinas.",
  solucion:`a = input()
b = input()
n, m = len(a), len(b)
dp = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(n + 1):
    dp[i][0] = i
for j in range(m + 1):
    dp[0][j] = j
for i in range(1, n + 1):
    for j in range(1, m + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1]
        else:
            dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
print(dp[n][m])`,
  why:"abc → yabd: insertar «y» al principio y sustituir «c» por «d»: 2 operaciones."},
 {t:"par", p:"Empareja cada problema con la definición de su estado",
  pares:[["Subsecuencia común más larga","dp[i][j] = LCS de los prefijos a[0..i) y b[0..j)"],["Distancia de edición","dp[i][j] = operaciones para convertir un prefijo en otro"],["Subcadena palindrómica más larga","dp[i][j] = si s[i..j] es palíndromo"],["¿Se puede partir la cadena en palabras del diccionario?","dp[i] = si s[:i] se puede partir"]],
  why:"Con dos cadenas, el estado casi siempre es un par de prefijos."},
 {t:"vf", p:"La subsecuencia común más larga exige que los caracteres sean contiguos.",
  ok:false, why:"Eso sería la subcadena común más larga, otro problema (con otra recurrencia: si no coinciden, dp = 0). La subsecuencia conserva el orden, no la contigüidad."}
]},

{
id:"al13n3",
titulo:"Subsecuencias crecientes y cuadrículas",
claves:["LIS en O(n²) con DP o en O(n log n) con colas mínimas y bisect","Caminos en cuadrícula: dp[f][c] depende de la celda de arriba y de la izquierda","Reducir la tabla 2D a una fila cuando solo se usa la anterior"],
pasos:[
 {t:"info", eti:"Crecientes", h:"Subsecuencia creciente más larga (LIS)",
  c:`<div class="termbox"># O(n²): dp[i] = LIS que termina en i
dp = [1] * n
for i in range(n):
    for j in range(i):
        if a[j] &lt; a[i]:
            dp[i] = max(dp[i], dp[j] + 1)

# O(n log n): colas[k] = menor final posible de una subsecuencia de longitud k + 1
from bisect import bisect_left
colas = []
for x in a:
    i = bisect_left(colas, x)
    if i == len(colas):
        colas.append(x)        # alarga la mejor
    else:
        colas[i] = x           # mismo largo, pero con un final más pequeño
# len(colas) es la respuesta</div>
     <p><code>colas</code> no es una subsecuencia real, pero su longitud sí es la de la LIS. Mantener finales pequeños deja más sitio para crecer.</p>`},
 {t:"codigo", p:"Imprime la longitud de la subsecuencia estrictamente creciente más larga en O(n log n)",
  lenguaje:"py",
  plantilla:"from bisect import bisect_left\na = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"10 9 2 5 3 7 101 18", salida:"4"},{entrada:"0 1 0 3 2 3", salida:"4"},{entrada:"7 7 7 7", salida:"1", oculta:true},{entrada:"3 10 2 1 20", salida:"3", oculta:true}],
  pista:"Para cada x, i = bisect_left(colas, x): si i es el final, añade; si no, sustituye colas[i] por x.",
  solucion:`from bisect import bisect_left
a = [int(x) for x in input().split()]
colas = []
for x in a:
    i = bisect_left(colas, x)
    if i == len(colas):
        colas.append(x)
    else:
        colas[i] = x
print(len(colas))`,
  why:"bisect_left hace que un valor igual sustituya en vez de alargar: por eso 7 7 7 7 da 1 (estrictamente creciente). Con bisect_right contarías no decreciente."},
 {t:"info", eti:"Cuadrículas", h:"Caminos en una cuadrícula",
  c:`<div class="termbox"># caminos de arriba-izquierda a abajo-derecha moviéndose solo a la derecha o abajo
dp = [[0] * C for _ in range(F)]
for f in range(F):
    for c in range(C):
        if m[f][c] == "#":
            dp[f][c] = 0                 # obstáculo: no se puede pasar
        elif f == 0 and c == 0:
            dp[f][c] = 1
        else:
            dp[f][c] = (dp[f-1][c] if f else 0) + (dp[f][c-1] if c else 0)</div>
     <p>Para el camino de <b>suma mínima</b> es la misma tabla con <code>min</code> en vez de suma. Solo se usa la fila anterior: una fila basta.</p>`},
 {t:"codigo", p:"Caminos con obstáculos: imprime de cuántas formas se llega de la esquina superior izquierda a la inferior derecha moviéndose a la derecha o hacia abajo, sin pisar <code>#</code>",
  lenguaje:"py",
  c:`<p>Primera línea: número de filas. Después, las filas con <code>.</code> y <code>#</code>.</p>`,
  plantilla:"F = int(input())\nm = [input() for _ in range(F)]\n",
  pruebas:[{entrada:"3\n...\n.#.\n...", salida:"2"},{entrada:"2\n.#\n..", salida:"1"},{entrada:"1\n#", salida:"0", oculta:true},{entrada:"3\n....\n....\n....", salida:"10", oculta:true}],
  pista:"dp de una fila: para cada celda, dp[c] = 0 si es «#»; si no, dp[c] (lo de arriba) + dp[c - 1] (lo de la izquierda).",
  solucion:`F = int(input())
m = [input() for _ in range(F)]
C = len(m[0])
dp = [0] * C
dp[0] = 1
for f in range(F):
    for c in range(C):
        if m[f][c] == "#":
            dp[c] = 0
        elif c > 0:
            dp[c] += dp[c - 1]
print(dp[C - 1])`,
  why:"Al recorrer la fila de izquierda a derecha, dp[c] todavía guarda el valor de la fila de arriba justo cuando lo necesitas. Sin obstáculos, la respuesta es un número combinatorio: C(F + C - 2, F - 1)."},
 {t:"codigo", p:"Camino de suma mínima: imprime la menor suma de un camino de la esquina superior izquierda a la inferior derecha moviéndose a la derecha o hacia abajo",
  lenguaje:"py",
  c:`<p>Primera línea: número de filas. Después, las filas con números.</p>`,
  plantilla:"F = int(input())\nm = [[int(x) for x in input().split()] for _ in range(F)]\n",
  pruebas:[{entrada:"3\n1 3 1\n1 5 1\n4 2 1", salida:"7"},{entrada:"2\n1 2 3\n4 5 6", salida:"12"},{entrada:"1\n5", salida:"5", oculta:true}],
  pista:"dp[f][c] = m[f][c] + min(arriba, izquierda), con cuidado en la primera fila y la primera columna.",
  solucion:`F = int(input())
m = [[int(x) for x in input().split()] for _ in range(F)]
C = len(m[0])
INF = float("inf")
dp = [INF] * C
dp[0] = 0
for f in range(F):
    for c in range(C):
        izq = dp[c - 1] if c > 0 else INF
        dp[c] = m[f][c] + min(dp[c], izq)
print(dp[C - 1])`,
  why:"Inicializar la fila con infinito (salvo dp[0] = 0) evita tratar aparte la primera fila y la primera columna."},
 {t:"opcion", p:"¿Qué complejidad tiene la LIS con la técnica de colas y bisect?",
  ops:["O(n²)","O(n log n)","O(n)","O(2ⁿ)"],
  ok:1, why:"Una búsqueda binaria por elemento sobre una lista de como mucho n."}
]}

]});
