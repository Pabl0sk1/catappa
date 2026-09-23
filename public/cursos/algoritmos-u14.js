window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Voraces, intervalos, bits y matemáticas",
resumen: "Cuándo funciona una estrategia voraz y cómo justificarla, problemas de intervalos, trucos con bits y la aritmética que sale en entrevistas",
nivel: "Experto",
color: "#58962a",
lecciones: [

{
id:"al9l2",
titulo:"Algoritmos voraces",
claves:["Un algoritmo voraz toma la mejor decisión local en cada paso y no vuelve atrás","Funciona solo si esa decisión nunca impide la solución óptima (hay que justificarlo)","Si no puedes justificarlo, busca un contraejemplo pequeño: suele delatar que hace falta DP"],
pasos:[
 {t:"info", eti:"Decisiones locales", h:"Cuándo funciona lo voraz",
  c:`<p>Un voraz es correcto cuando se puede demostrar que <b>siempre existe una solución óptima que empieza con la elección voraz</b> (argumento de intercambio: si una óptima eligió otra cosa, cámbiala por la voraz y no empeora).</p>
     <div class="dg dg-cols"><div class="dg-col"><div class="dg-col-tit">funciona</div><div class="dg-pila"><div class="dg-caja ok">monedas de euro: coger la mayor</div><div class="dg-caja ok">máximo de actividades: la que acaba antes</div><div class="dg-caja ok">salto: llegar lo más lejos posible</div></div></div>
     <div class="dg-col"><div class="dg-col-tit">falla</div><div class="dg-pila"><div class="dg-caja aviso">monedas {1, 3, 4} para 6</div><div class="dg-caja aviso">mochila 0/1 por valor/peso</div><div class="dg-caja aviso">camino más largo en un grafo</div></div></div></div>`},
 {t:"info", eti:"Ejemplo", h:"Juego de saltos",
  c:`<div class="termbox"># a[i] = salto máximo desde i. ¿Se llega al final?
alcance = 0
for i, x in enumerate(a):
    if i &gt; alcance:
        return False               # hay un hueco que no se puede cruzar
    alcance = max(alcance, i + x)
return True</div>
     <p>No hace falta explorar cada salto (eso sería backtracking o DP): basta con recordar lo más lejos que se puede llegar.</p>`},
 {t:"codigo", p:"Juego de saltos: <code>a[i]</code> es el salto máximo desde la posición i. Imprime <code>si</code> si se puede llegar a la última posición desde la primera, o <code>no</code>",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"2 3 1 1 4", salida:"si"},{entrada:"3 2 1 0 4", salida:"no"},{entrada:"0", salida:"si", oculta:true},{entrada:"1 0 1", salida:"no", oculta:true}],
  pista:"Recorre llevando el alcance máximo; si alguna posición queda más allá del alcance, no se puede.",
  solucion:`a = [int(x) for x in input().split()]
alcance = 0
ok = True
for i, x in enumerate(a):
    if i > alcance:
        ok = False
        break
    alcance = max(alcance, i + x)
print("si" if ok else "no")`,
  why:"O(n) y O(1). Con una lista de un solo elemento ya estás en el final."},
 {t:"codigo", p:"Galletas: cada niño se conforma con una galleta de tamaño ≥ su apetito, y cada galleta es para un niño. Imprime el máximo de niños contentos",
  lenguaje:"py",
  c:`<p>Primera línea: apetitos. Segunda: tamaños de las galletas.</p>`,
  plantilla:"ninos = sorted(int(x) for x in input().split())\ngalletas = sorted(int(x) for x in input().split())\n",
  pruebas:[{entrada:"1 2 3\n1 1", salida:"1"},{entrada:"1 2\n1 2 3", salida:"2"},{entrada:"5 5\n4 4 4", salida:"0", oculta:true},{entrada:"2 7 3\n6 2 3 8", salida:"3", oculta:true}],
  pista:"Con ambas listas ordenadas, dos punteros: si la galleta actual satisface al niño actual, avanzan los dos; si no, prueba una galleta mayor.",
  solucion:`ninos = sorted(int(x) for x in input().split())
galletas = sorted(int(x) for x in input().split())
i = j = 0
while i < len(ninos) and j < len(galletas):
    if galletas[j] >= ninos[i]:
        i += 1
    j += 1
print(i)`,
  why:"Voraz justificable: dar al niño menos exigente la galleta más pequeña que le sirve nunca impide una solución mejor."},
 {t:"codigo", p:"Gasolineras en círculo: <code>g[i]</code> es la gasolina que cargas en i y <code>c[i]</code> lo que gastas para ir a i + 1. Imprime la gasolinera desde la que puedes dar la vuelta completa, o -1",
  lenguaje:"py",
  c:`<p>Primera línea: g. Segunda: c. La solución, si existe, es única.</p>`,
  plantilla:"g = [int(x) for x in input().split()]\nc = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"1 2 3 4 5\n3 4 5 1 2", salida:"3"},{entrada:"2 3 4\n3 4 3", salida:"-1"},{entrada:"5\n4", salida:"0", oculta:true},{entrada:"3 1 1\n1 2 2", salida:"0", oculta:true}],
  pista:"Si la suma total de g es menor que la de c, -1. Si no, recorre acumulando g[i] - c[i]; cuando el depósito sea negativo, el inicio pasa a i + 1 y el depósito vuelve a 0.",
  solucion:`g = [int(x) for x in input().split()]
c = [int(x) for x in input().split()]
if sum(g) < sum(c):
    print(-1)
else:
    inicio = deposito = 0
    for i in range(len(g)):
        deposito += g[i] - c[i]
        if deposito < 0:
            inicio = i + 1
            deposito = 0
    print(inicio)`,
  why:"Si no llegas de A a B, ninguna gasolinera entre A y B sirve como inicio: por eso se salta directamente a i + 1. O(n) frente a O(n²) probando cada inicio."},
 {t:"vf", p:"Si un algoritmo voraz funciona con los ejemplos del enunciado, está demostrado que es correcto.",
  ok:false, why:"Los ejemplos no demuestran nada. Busca un contraejemplo pequeño o un argumento de intercambio; en la entrevista, explícalo en voz alta."},
 {t:"opcion", p:"Te piden el mínimo de monedas con el sistema {1, 5, 10, 25}. ¿Voraz o DP?",
  ops:["Siempre DP","Voraz: en los sistemas monetarios reales (canónicos) coger la mayor posible es óptimo; con sistemas arbitrarios, DP","Backtracking","Ninguno sirve"],
  ok:1, why:"Menciona las dos cosas: por qué funciona aquí y que con {1, 3, 4} fallaría."}
]},

{
id:"al14n1",
titulo:"Intervalos",
claves:["Ordenar por inicio para fusionar; por fin para elegir el máximo de intervalos compatibles","Mínimo de salas: montículo con los finales, o barrer eventos de entrada y salida","Dos intervalos [a, b] y [c, d] se solapan si a ≤ d y c ≤ b"],
pasos:[
 {t:"info", eti:"Ordenar primero", h:"Fusionar intervalos",
  c:`<div class="dg"><div class="dg-tit">[1,3] [2,6] [8,10] [9,12] → [1,6] [8,12]</div>
<svg viewBox="0 0 320 120" width="100%" style="max-width:420px;display:block;margin:auto" role="img" aria-label="Los intervalos 1-3 y 2-6 se solapan y forman 1-6; 8-10 y 9-12 forman 8-12">
<line x1="30" y1="20" x2="75" y2="20" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
<line x1="52" y1="38" x2="142" y2="38" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
<line x1="186" y1="20" x2="230" y2="20" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
<line x1="208" y1="38" x2="274" y2="38" stroke="var(--accent)" stroke-width="6" stroke-linecap="round"/>
<line x1="30" y1="75" x2="142" y2="75" stroke="var(--ok)" stroke-width="6" stroke-linecap="round"/>
<line x1="186" y1="75" x2="274" y2="75" stroke="var(--ok)" stroke-width="6" stroke-linecap="round"/>
<line x1="20" y1="100" x2="300" y2="100" stroke="var(--line-2)" stroke-width="1.5"/>
<text x="30" y="116" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">1</text>
<text x="142" y="116" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">6</text>
<text x="186" y="116" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">8</text>
<text x="274" y="116" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">12</text>
</svg></div>
<div class="termbox">def fusionar(iv):
    res = []
    for ini, fin in sorted(iv):                 # ordenar por inicio
        if res and ini &lt;= res[-1][1]:           # se solapa con el último
            res[-1][1] = max(res[-1][1], fin)
        else:
            res.append([ini, fin])
    return res</div>`},
 {t:"codigo", p:"Fusiona los intervalos solapados e imprime el resultado ordenado, un intervalo <code>ini fin</code> por línea",
  lenguaje:"py",
  c:`<p>Primera línea: n. Después n líneas <code>ini fin</code>. Intervalos que se tocan ([1,4] y [4,5]) también se fusionan.</p>`,
  plantilla:"n = int(input())\niv = [list(map(int, input().split())) for _ in range(n)]\n",
  pruebas:[{entrada:"4\n1 3\n2 6\n8 10\n9 12", salida:"1 6\n8 12"},{entrada:"2\n1 4\n4 5", salida:"1 5"},{entrada:"3\n5 7\n1 10\n2 3", salida:"1 10", oculta:true},{entrada:"2\n6 8\n1 2", salida:"1 2\n6 8", oculta:true}],
  pista:"Ordena por inicio; si el inicio actual es ≤ que el fin del último fusionado, amplía ese fin con max.",
  solucion:`n = int(input())
iv = [list(map(int, input().split())) for _ in range(n)]
res = []
for ini, fin in sorted(iv):
    if res and ini <= res[-1][1]:
        res[-1][1] = max(res[-1][1], fin)
    else:
        res.append([ini, fin])
for ini, fin in res:
    print(ini, fin)`,
  why:"El max es imprescindible: [1,10] contiene a [2,3], y sin él el fin bajaría a 3."},
 {t:"info", eti:"Reuniones", h:"Mínimo de salas",
  c:`<div class="termbox">import heapq
def salas(reuniones):
    fines = []                                  # montículo con el fin de cada sala ocupada
    for ini, fin in sorted(reuniones):
        if fines and fines[0] &lt;= ini:
            heapq.heappop(fines)                # la sala que antes queda libre se reutiliza
        heapq.heappush(fines, fin)
    return len(fines)</div>
     <p>Alternativa de «barrido»: convierte cada reunión en dos eventos (+1 al empezar, -1 al acabar), ordénalos y lleva la cuenta; el máximo es la respuesta. Es la misma idea que el array de diferencias.</p>`},
 {t:"codigo", p:"Imprime el mínimo de salas necesarias para celebrar todas las reuniones (una que acaba a las 10 deja la sala libre para otra que empieza a las 10)",
  lenguaje:"py",
  c:`<p>Primera línea: n. Después n líneas <code>inicio fin</code>.</p>`,
  plantilla:"import heapq\nn = int(input())\nreuniones = [tuple(map(int, input().split())) for _ in range(n)]\n",
  pruebas:[{entrada:"3\n0 30\n5 10\n15 20", salida:"2"},{entrada:"2\n7 10\n2 4", salida:"1"},{entrada:"3\n1 5\n2 6\n3 7", salida:"3", oculta:true},{entrada:"2\n9 10\n10 11", salida:"1", oculta:true}],
  pista:"Ordena por inicio; montículo con los fines; si el menor fin ≤ inicio actual, sácalo; mete el fin actual. La respuesta es el tamaño final del montículo.",
  solucion:`import heapq
n = int(input())
reuniones = [tuple(map(int, input().split())) for _ in range(n)]
fines = []
for ini, fin in sorted(reuniones):
    if fines and fines[0] <= ini:
        heapq.heappop(fines)
    heapq.heappush(fines, fin)
print(len(fines))`,
  why:"O(n log n). El &lt;= es el que decide si una reunión que acaba a las 10 libera la sala para otra de las 10."},
 {t:"codigo", p:"Imprime el máximo de actividades que puede hacer una persona sin solapes (una puede empezar justo cuando acaba otra)",
  lenguaje:"py",
  c:`<p>Primera línea: n. Después n líneas <code>inicio fin</code>.</p>`,
  plantilla:"n = int(input())\nact = [tuple(map(int, input().split())) for _ in range(n)]\n",
  pruebas:[{entrada:"4\n1 2\n2 3\n3 4\n1 3", salida:"3"},{entrada:"3\n1 10\n2 3\n4 5", salida:"2"},{entrada:"3\n1 2\n1 2\n1 2", salida:"1", oculta:true}],
  pista:"Ordena por FIN y coge cada actividad cuyo inicio sea ≥ que el fin de la última elegida.",
  solucion:`n = int(input())
act = [tuple(map(int, input().split())) for _ in range(n)]
ultimo = float("-inf")
total = 0
for ini, fin in sorted(act, key=lambda x: x[1]):
    if ini >= ultimo:
        total += 1
        ultimo = fin
print(total)`,
  why:"La que acaba antes deja el máximo de tiempo libre: el argumento de intercambio demuestra que nunca empeora. Ordenar por inicio fallaría con [1,10] frente a [2,3] y [4,5]."},
 {t:"par", p:"Empareja cada problema con su estrategia",
  pares:[["Fusionar intervalos","Ordenar por inicio y fusionar con el último"],["Máximo de actividades sin solaparse","Voraz: ordenar por fin"],["Mínimo de salas de reuniones","Montículo con los fines, o barrido de eventos"],["Mínimo de intervalos a borrar para que no se solapen","Total menos el máximo de actividades compatibles"]],
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
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">con a = 1100 (12) y b = 1010 (10)</div><table class="dg-tabla"><thead><tr><th>operación</th><th>resultado</th><th>para qué</th></tr></thead><tbody>
<tr><td><code>a &amp; b</code></td><td>1000 (8)</td><td>intersección, comprobar un bit</td></tr>
<tr><td><code>a | b</code></td><td>1110 (14)</td><td>unión, activar un bit</td></tr>
<tr><td><code>a ^ b</code></td><td>0110 (6)</td><td>diferencia simétrica, conmutar</td></tr>
<tr><td><code>a &lt;&lt; 1</code></td><td>11000 (24)</td><td>multiplicar por 2</td></tr>
<tr><td><code>a &gt;&gt; 2</code></td><td>11 (3)</td><td>dividir entre 4</td></tr>
</tbody></table></div>
<div class="termbox">n &amp; 1                  # 1 si es impar
n &amp; (n - 1)            # quita el bit 1 más bajo
n &gt; 0 and n &amp; (n - 1) == 0   # ¿es potencia de 2?
bin(n).count("1")      # bits a 1 (n.bit_count() desde Python 3.10)
mask |= 1 &lt;&lt; k         # activar el bit k
mask &amp; (1 &lt;&lt; k)        # ¿está el bit k?</div>`},
 {t:"codigo", p:"Todos los números aparecen dos veces salvo uno. Imprímelo con O(1) de memoria extra",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"4 1 2 1 2", salida:"4"},{entrada:"7", salida:"7"},{entrada:"-3 5 5", salida:"-3", oculta:true},{entrada:"0 9 9 0 11", salida:"11", oculta:true}],
  pista:"XOR de todos: los pares se anulan.",
  solucion:`a = [int(x) for x in input().split()]
r = 0
for x in a:
    r ^= x
print(r)`,
  why:"Un conjunto también funcionaría, pero con O(n) de memoria. El XOR es conmutativo y asociativo, así que el orden da igual."},
 {t:"info", eti:"Conjuntos", h:"Recorrer subconjuntos con máscaras",
  c:`<p>Con n pequeño (≤ 20), un entero de n bits representa un subconjunto: el bit i indica si el elemento i está. Recorrer de 0 a 2ⁿ - 1 recorre todos los subconjuntos sin recursión:</p>
<div class="termbox">for mask in range(1 &lt;&lt; n):
    sub = [a[i] for i in range(n) if mask &amp; (1 &lt;&lt; i)]</div>
     <p>Es la base de la «DP con máscaras» (viajante de comercio en O(2ⁿ · n²)).</p>`},
 {t:"codigo", p:"Para cada número de 0 a n, imprime cuántos bits a 1 tiene, calculándolo con DP a partir de <code>i &gt;&gt; 1</code>",
  lenguaje:"py",
  plantilla:"n = int(input())\n",
  pruebas:[{entrada:"2", salida:"0 1 1"},{entrada:"5", salida:"0 1 1 2 1 2"},{entrada:"0", salida:"0", oculta:true},{entrada:"8", salida:"0 1 1 2 1 2 2 3 1", oculta:true}],
  pista:"bits[i] = bits[i &gt;&gt; 1] + (i &amp; 1): quitar el último bit da un número ya calculado.",
  solucion:`n = int(input())
bits = [0] * (n + 1)
for i in range(1, n + 1):
    bits[i] = bits[i >> 1] + (i & 1)
print(*bits)`,
  why:"O(n) en total, sin contar bit a bit cada número. Otra recurrencia válida: bits[i] = bits[i &amp; (i - 1)] + 1."},
 {t:"par", p:"Empareja cada expresión con su significado",
  pares:[["x ^ x","0"],["x & 1","El bit más bajo: 1 si es impar"],["1 << k","Una máscara con solo el bit k"],["n & (n - 1) == 0","n es potencia de 2 (si n > 0)"],["a | b","Unión de dos máscaras de permisos"]],
  why:"Los permisos de Linux (rwx = 4, 2, 1) son exactamente una máscara de bits."},
 {t:"vf", p:"El XOR de todos los elementos de un array donde cada número aparece dos veces menos uno devuelve ese número.",
  ok:true, why:"Los pares se anulan (x ^ x = 0) y queda el único."},
 {t:"opcion", p:"¿Cuántos subconjuntos recorre <code>for mask in range(1 &lt;&lt; n)</code> con n = 20?",
  ops:["20","400","1.048.576","2.000.000.000"],
  ok:2, why:"2²⁰ ≈ un millón: viable. Con n = 40 serían un billón, y habría que partir en dos mitades (meet in the middle)."}
]},

{
id:"al14n2",
titulo:"Matemáticas para entrevistas",
claves:["Máximo común divisor con Euclides: O(log min(a, b))","Criba de Eratóstenes: todos los primos hasta n en O(n log log n)","Aritmética modular (10⁹ + 7) y cuidado con el desbordamiento y la división de negativos"],
pasos:[
 {t:"info", eti:"Clásicos", h:"Euclides y la criba",
  c:`<div class="termbox">def mcd(a, b):                 # Euclides: mcd(a, b) = mcd(b, a % b)
    while b:
        a, b = b, a % b
    return a
mcm = a // mcd(a, b) * b      # mínimo común múltiplo (dividir antes evita números enormes)
# en Python: math.gcd, math.lcm

def criba(n):                 # primos hasta n
    es = [True] * (n + 1)
    es[0] = es[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if es[i]:
            for j in range(i * i, n + 1, i):   # desde i*i: los menores ya se tacharon
                es[j] = False
    return [i for i in range(n + 1) if es[i]]</div>
     <p>Para comprobar si <b>un</b> número es primo basta con probar divisores hasta √n: O(√n).</p>`},
 {t:"codigo", p:"Imprime cuántos números primos hay menores o iguales que n",
  lenguaje:"py",
  plantilla:"n = int(input())\n",
  pruebas:[{entrada:"10", salida:"4"},{entrada:"1", salida:"0"},{entrada:"100", salida:"25", oculta:true},{entrada:"1000000", salida:"78498", oculta:true}],
  pista:"Criba de Eratóstenes: tacha los múltiplos de cada primo empezando en i * i.",
  solucion:`n = int(input())
if n < 2:
    print(0)
else:
    es = bytearray([1]) * (n + 1)
    es[0] = es[1] = 0
    for i in range(2, int(n ** 0.5) + 1):
        if es[i]:
            es[i * i::i] = bytearray(len(range(i * i, n + 1, i)))
    print(sum(es))`,
  why:"Con n = 10⁶, probar cada número por separado sería lento en Python; la criba lo hace en milisegundos. La asignación por tramos (es[i*i::i]) evita el bucle interior en Python."},
 {t:"codigo", p:"Imprime el máximo común divisor y el mínimo común múltiplo de los números de la línea, separados por un espacio, implementando Euclides",
  lenguaje:"py",
  plantilla:"nums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"12 18", salida:"6 36"},{entrada:"4 6 10", salida:"2 60"},{entrada:"7", salida:"7 7", oculta:true},{entrada:"1000000007 998244353", salida:"1 998244359987710471", oculta:true}],
  pista:"mcd de una lista: acumula mcd(acum, x). mcm(a, b) = a // mcd(a, b) * b, también acumulado.",
  solucion:`nums = [int(x) for x in input().split()]

def mcd(a, b):
    while b:
        a, b = b, a % b
    return a

g = l = nums[0]
for x in nums[1:]:
    g = mcd(g, x)
    l = l // mcd(l, x) * x
print(g, l)`,
  why:"Euclides hace O(log) iteraciones. En Java, el último caso desbordaría un long si multiplicases antes de dividir; en Python los enteros no desbordan."},
 {t:"info", eti:"Cuidado", h:"Módulo, desbordamiento y negativos",
  c:`<ul><li>«Devuelve el resultado módulo 10⁹ + 7»: aplica <code>% MOD</code> tras cada suma y multiplicación, no solo al final (en Java o C++, el intermedio desbordaría).</li>
     <li>En Java, <code>int</code> llega a 2.147.483.647: la suma de dos valores grandes desborda en silencio. Usa <code>long</code> o <code>Math.addExact</code>.</li>
     <li>División y módulo con negativos: en Python, <code>-7 // 2 == -4</code> y <code>-7 % 2 == 1</code>; en Java, <code>-7 / 2 == -3</code> y <code>-7 % 2 == -1</code>.</li>
     <li>Comparar decimales con <code>==</code> falla (<code>0.1 + 0.2 != 0.3</code>): usa enteros o una tolerancia.</li></ul>`},
 {t:"opcion", p:"¿Cuánto vale <code>-7 % 3</code> en Python?",
  ops:["-1","2","1","0"],
  ok:1, why:"En Python el resto tiene el signo del divisor: -7 = 3 × (-3) + 2. En Java daría -1."},
 {t:"vf", p:"Para saber si n es primo basta con probar divisores hasta √n.",
  ok:true, why:"Si n = a × b con a ≤ b, entonces a ≤ √n: cualquier divisor tiene una pareja menor o igual que √n."},
 {t:"escribe", p:"¿Qué número primo se usa habitualmente como módulo en los enunciados («devuelve el resultado módulo …»)?",
  sol:["1000000007","10^9 + 7","10^9+7","1e9+7","1e9 + 7","10**9 + 7","10**9+7"], pista:"Mil millones y siete.",
  why:"Es primo (permite inversos modulares) y cabe en un int de 32 bits, y el producto de dos restos cabe en 64 bits."}
]}

]});
