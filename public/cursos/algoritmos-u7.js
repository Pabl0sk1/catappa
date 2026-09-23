window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Recursión, divide y vencerás y ordenación",
resumen: "Pensar de forma recursiva, memoizar, dividir el problema en mitades, cómo funcionan los algoritmos de ordenación y cuándo no hace falta ordenar del todo",
nivel: "Avanzado",
color: "#80bb4d",
lecciones: [

{
id:"al5l2",
titulo:"Recursión",
claves:["Una función recursiva resuelve el problema usando versiones más pequeñas de sí mismo","Siempre: caso base y avance hacia él","Cuidado con los cálculos repetidos (memoiza) y la profundidad de la pila"],
pasos:[
 {t:"info", eti:"Confiar en la recursión", h:"Cómo pensar",
  c:`<ol><li>Define qué devuelve la función para una entrada.</li>
     <li>Resuelve el <b>caso base</b> (el más pequeño).</li>
     <li>Supón que la función ya funciona para entradas más pequeñas y combina su resultado.</li></ol>
     <div class="termbox">def profundidad(nodo):                 # altura de un árbol
    if nodo is None:
        return 0                            # caso base
    return 1 + max(profundidad(nodo.izq), profundidad(nodo.der))

def fib(n):                               # ingenuo: O(2^n) por cálculos repetidos
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)</div>`},
 {t:"info", eti:"Recordar", h:"Memoización y límite de pila",
  c:`<div class="dg"><div class="dg-tit">llamadas de fib(5) sin memoria: fib(3) se calcula 2 veces, fib(2) 3 veces</div><div class="dg dg-arbol">
<div class="rama" style="--n:0"><span class="nom carpeta">fib(5)</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">fib(4)</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">fib(3)</span><span class="coment">repetido</span></div>
<div class="rama" style="--n:3"><span class="nom">fib(2) …</span></div>
<div class="rama" style="--n:2"><span class="nom">fib(2) …</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">fib(3)</span><span class="coment">repetido</span></div>
<div class="rama" style="--n:2"><span class="nom">fib(2) …</span></div>
</div></div>
<div class="termbox">from functools import lru_cache      # o functools.cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)   # ahora O(n)

import sys
sys.setrecursionlimit(10000)   # por defecto ~1000 llamadas anidadas</div>
     <div class="nota ojo"><b class="tit">RecursionError</b>Python no optimiza la recursión de cola y corta a unas 1000 llamadas de profundidad. Para recorrer una lista de 10⁵ nodos o un árbol degenerado, usa un bucle o una pila explícita.</div>`},
 {t:"opcion", p:"¿Por qué el Fibonacci recursivo ingenuo es tan lento?",
  ops:["Por la recursión en sí","Recalcula los mismos valores muchísimas veces: el árbol de llamadas crece como 2ⁿ","Por usar enteros grandes","No es lento"],
  ok:1, why:"Con memoización (guardar resultados) pasa a O(n): es programación dinámica de arriba abajo."},
 {t:"codigo", p:"Torres de Hanói: imprime los movimientos para pasar <code>n</code> discos de la torre A a la C usando B, uno por línea con el formato <code>A C</code>, y al final el total",
  lenguaje:"py",
  plantilla:"n = int(input())\n",
  pruebas:[{entrada:"1", salida:"A C\n1"},{entrada:"2", salida:"A B\nA C\nB C\n3"},{entrada:"3", salida:"A C\nA B\nC B\nA C\nB A\nB C\nA C\n7", oculta:true}],
  pista:"Para mover n de origen a destino: mueve n-1 de origen a auxiliar, mueve el grande de origen a destino y mueve n-1 de auxiliar a destino.",
  solucion:`n = int(input())
movs = []

def hanoi(k, origen, destino, aux):
    if k == 0:
        return
    hanoi(k - 1, origen, aux, destino)
    movs.append(f"{origen} {destino}")
    hanoi(k - 1, aux, destino, origen)

hanoi(n, "A", "C", "B")
print("\\n".join(movs))
print(len(movs))`,
  why:"Se necesitan 2ⁿ - 1 movimientos: la recurrencia T(n) = 2T(n-1) + 1. Es el ejemplo perfecto de «confía en que la llamada pequeña funciona»."},
 {t:"codigo", p:"Tribonacci: t(0)=0, t(1)=1, t(2)=1 y t(n)=t(n-1)+t(n-2)+t(n-3). Imprime t(n) con recursión memoizada (n hasta 500)",
  lenguaje:"py",
  plantilla:"import sys\nsys.setrecursionlimit(5000)\nn = int(input())\n",
  pruebas:[{entrada:"4", salida:"4"},{entrada:"25", salida:"1389537"},{entrada:"0", salida:"0", oculta:true},{entrada:"100", salida:"98079530178586034536500564", oculta:true}],
  pista:"Decora la función con @lru_cache(maxsize=None) de functools.",
  solucion:`import sys
from functools import lru_cache
sys.setrecursionlimit(5000)
n = int(input())

@lru_cache(maxsize=None)
def t(k):
    if k == 0:
        return 0
    if k <= 2:
        return 1
    return t(k - 1) + t(k - 2) + t(k - 3)

print(t(n))`,
  why:"Sin memoria, t(100) haría del orden de 3¹⁰⁰ llamadas. Con ella, 100."},
 {t:"vf", p:"Toda función recursiva necesita al menos un caso base que no se llame a sí mismo.",
  ok:true, why:"Sin él, la recursión no termina y acaba en RecursionError (StackOverflowError en Java)."},
 {t:"escribe", p:"¿Cuántos movimientos necesitan las torres de Hanói con 10 discos?",
  sol:["1023"], pista:"2ⁿ - 1.",
  why:"2¹⁰ - 1 = 1023. Con 64 discos, a un movimiento por segundo, tardarías más que la edad del universo."}
]},

{
id:"al7n1",
titulo:"Divide y vencerás",
claves:["Dividir en subproblemas independientes, resolverlos y combinar","Merge sort: T(n) = 2T(n/2) + O(n) = O(n log n)","Exponenciación rápida: O(log n) multiplicaciones"],
pasos:[
 {t:"info", eti:"La estrategia", h:"Dividir, resolver, combinar",
  c:`<div class="dg"><div class="dg-tit">merge sort sobre [5, 2, 4, 1]</div><div class="dg-vert"><div class="dg-caja">[5, 2, 4, 1]</div><div class="dg-fila"><div class="dg-caja">[5, 2]</div><div class="dg-caja">[4, 1]</div></div><div class="dg-fila"><div class="dg-caja">[5]</div><div class="dg-caja">[2]</div><div class="dg-caja">[4]</div><div class="dg-caja">[1]</div></div><div class="dg-fila"><div class="dg-caja acento">[2, 5]</div><div class="dg-caja acento">[1, 4]</div></div><div class="dg-caja ok">[1, 2, 4, 5]</div></div></div>
<div class="termbox">def merge_sort(a):
    if len(a) &lt;= 1:
        return a
    m = len(a) // 2
    izq, der = merge_sort(a[:m]), merge_sort(a[m:])
    res, i, j = [], 0, 0
    while i &lt; len(izq) and j &lt; len(der):      # fusionar: dos punteros
        if izq[i] &lt;= der[j]:                   # &lt;= lo hace estable
            res.append(izq[i]); i += 1
        else:
            res.append(der[j]); j += 1
    return res + izq[i:] + der[j:]</div>
     <p>Hay log n niveles y en cada uno se fusionan n elementos: <b>O(n log n)</b> siempre, con O(n) de memoria extra.</p>`},
 {t:"codigo", p:"Implementa merge sort (sin usar sort ni sorted) e imprime la lista ordenada",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n\ndef merge_sort(a):\n    # tu código\n    return a\n\nprint(*merge_sort(a))\n",
  pruebas:[{entrada:"5 2 4 1", salida:"1 2 4 5"},{entrada:"3 -1 3 0 -1", salida:"-1 -1 0 3 3"},{entrada:"9", salida:"9", oculta:true},{entrada:"10 9 8 7 6 5 4 3 2 1", salida:"1 2 3 4 5 6 7 8 9 10", oculta:true}],
  pista:"Caso base len(a) &lt;= 1; ordena cada mitad recursivamente y fusiónalas con dos punteros.",
  solucion:`a = [int(x) for x in input().split()]

def merge_sort(a):
    if len(a) <= 1:
        return a
    m = len(a) // 2
    izq, der = merge_sort(a[:m]), merge_sort(a[m:])
    res, i, j = [], 0, 0
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:
            res.append(izq[i])
            i += 1
        else:
            res.append(der[j])
            j += 1
    return res + izq[i:] + der[j:]

print(*merge_sort(a))`,
  why:"La fusión es la misma técnica de dos punteros que usarás para fusionar listas enlazadas o intervalos."},
 {t:"info", eti:"Aprovechar la fusión", h:"Contar inversiones",
  c:`<p>Una <b>inversión</b> es un par i &lt; j con a[i] &gt; a[j]. Mide lo «desordenada» que está una lista (por ejemplo, para comparar dos rankings). Contarlas con dos bucles es O(n²); durante la fusión de merge sort se cuentan gratis:</p>
     <p>Cuando se coge <code>der[j]</code> antes que <code>izq[i]</code>, <code>der[j]</code> es menor que <b>todos</b> los que quedan en la izquierda: suma <code>len(izq) - i</code> inversiones de golpe.</p>`},
 {t:"codigo", p:"Cuenta las inversiones de la lista en O(n log n)",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"2 4 1 3 5", salida:"3"},{entrada:"1 2 3", salida:"0"},{entrada:"5 4 3 2 1", salida:"10", oculta:true},{entrada:"3 3 1", salida:"2", oculta:true}],
  pista:"Haz que merge_sort devuelva (lista, inversiones). Al coger de la derecha, suma len(izq) - i.",
  solucion:`a = [int(x) for x in input().split()]

def ordena(a):
    if len(a) <= 1:
        return a, 0
    m = len(a) // 2
    izq, x = ordena(a[:m])
    der, y = ordena(a[m:])
    res, i, j, inv = [], 0, 0, x + y
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:
            res.append(izq[i])
            i += 1
        else:
            res.append(der[j])
            inv += len(izq) - i
            j += 1
    return res + izq[i:] + der[j:], inv

print(ordena(a)[1])`,
  why:"El &lt;= es importante: los iguales no son inversión (caso 3 3 1 → 2)."},
 {t:"info", eti:"Otro clásico", h:"Exponenciación rápida",
  c:`<div class="termbox">def potencia(b, e, mod):
    if e == 0:
        return 1
    mitad = potencia(b, e // 2, mod)
    r = mitad * mitad % mod
    return r * b % mod if e % 2 else r</div>
     <p>b¹⁰⁰ = (b⁵⁰)²: cada paso divide el exponente entre 2, así que son O(log e) multiplicaciones en vez de e. En Python ya existe: <code>pow(b, e, mod)</code>.</p>`},
 {t:"codigo", p:"Calcula b<sup>e</sup> mod m con exponenciación rápida escrita por ti (sin pow ni **)",
  lenguaje:"py",
  c:`<p>Una línea con <code>b e m</code>. e puede ser enorme (hasta 10<sup>18</sup>).</p>`,
  plantilla:"b, e, m = map(int, input().split())\n",
  pruebas:[{entrada:"2 10 1000", salida:"24"},{entrada:"3 0 7", salida:"1"},{entrada:"7 1000000000000000000 1000000007", salida:"259616729", oculta:true},{entrada:"10 5 7", salida:"5", oculta:true}],
  pista:"Versión iterativa: mientras e &gt; 0, si e es impar multiplica el resultado por b; eleva b al cuadrado y divide e entre 2.",
  solucion:`b, e, m = map(int, input().split())
res = 1 % m
b %= m
while e > 0:
    if e & 1:
        res = res * b % m
    b = b * b % m
    e >>= 1
print(res)`,
  why:"10¹⁸ multiplicaciones no acabarían nunca; con exponenciación rápida son unas 60."},
 {t:"opcion", p:"¿Qué complejidad da la recurrencia T(n) = 2T(n/2) + O(n)?",
  ops:["O(n)","O(n log n)","O(n²)","O(log n)"],
  ok:1, why:"log n niveles con O(n) de trabajo cada uno. Es la de merge sort (teorema maestro, caso 2)."}
]},

{
id:"al9l1",
titulo:"Algoritmos de ordenación",
claves:["Merge sort: O(n log n) siempre y estable; quicksort: O(n log n) de media, en el sitio","sorted() de Python y Arrays.sort para objetos usan TimSort (estable); Java usa quicksort de doble pivote para primitivos","Ordenar por una clave (key) o por varias con tuplas"],
pasos:[
 {t:"info", eti:"Ordenar", h:"Los que hay que conocer",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">algoritmos de ordenación comparados</div>
<table class="dg-tabla"><thead><tr><th>algoritmo</th><th>tiempo medio</th><th>peor caso</th><th>espacio</th><th>estable</th></tr></thead><tbody>
<tr><td>burbuja</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>sí<br><small>solo didáctico</small></td></tr>
<tr><td>inserción</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>sí<br><small>rápido en casi ordenados</small></td></tr>
<tr><td>merge sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>sí</td></tr>
<tr><td>quicksort</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td>no</td></tr>
<tr><td>heapsort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>no</td></tr>
<tr><td>counting sort</td><td>O(n + k)</td><td>O(n + k)</td><td>O(k)</td><td>sí<br><small>enteros en rango pequeño</small></td></tr>
</tbody></table></div>
     <p><b>Estable</b>: si dos elementos son iguales según el criterio, mantienen su orden original. Importa al ordenar por varios criterios sucesivos.</p>
     <p>Ningún algoritmo basado en <b>comparaciones</b> puede bajar de O(n log n) en el peor caso. Counting y radix sort lo consiguen porque no comparan: aprovechan que las claves son enteros acotados.</p>`},
 {t:"info", eti:"En la práctica", h:"Ordenar por clave",
  c:`<div class="termbox">personas = [("ana", 31), ("luis", 25), ("eva", 31)]
sorted(personas, key=lambda p: p[1])            # por edad (estable: ana antes que eva)
sorted(personas, key=lambda p: (-p[1], p[0]))   # edad descendente y, a igual edad, nombre
palabras.sort(key=len)                          # en el sitio, por longitud

from functools import cmp_to_key                # cuando el orden no es una clave simple
sorted(nums, key=cmp_to_key(lambda a, b: -1 if a + b &gt; b + a else 1))</div>
     <p>La tupla como clave ordena por el primer campo y desempata con el siguiente. Negar un número invierte su orden (con cadenas no se puede: ahí se aprovecha la estabilidad ordenando dos veces).</p>`},
 {t:"par", p:"Empareja cada algoritmo con su característica",
  pares:[["Merge sort","Divide en mitades, ordena y fusiona; estable"],["Quicksort","Elige un pivote y particiona; muy rápido en la práctica"],["Heapsort","Usa un montículo; O(1) de memoria extra"],["Counting sort","Cuenta apariciones de enteros en un rango pequeño"],["TimSort","Híbrido estable que usan Python y Java (para objetos)"]],
  why:"En una entrevista basta con explicar merge sort y quicksort y sus compromisos."},
 {t:"opcion", p:"¿Cuándo tiene quicksort su peor caso O(n²)?",
  ops:["Nunca","Cuando el pivote elegido deja particiones muy desequilibradas (por ejemplo, siempre el menor)","Con arrays pequeños","Con números negativos"],
  ok:1, why:"Con el primer elemento como pivote, un array ya ordenado es el peor caso. Se mitiga eligiendo pivotes aleatorios o la mediana de tres."},
 {t:"codigo", p:"Ordena los alumnos por nota de mayor a menor y, a igual nota, por nombre alfabético",
  lenguaje:"py",
  c:`<p>Primera línea: n. Después n líneas <code>nombre nota</code>. Imprime los nombres en el orden resultante, uno por línea.</p>`,
  plantilla:"n = int(input())\nalumnos = []\nfor _ in range(n):\n    nombre, nota = input().split()\n    alumnos.append((nombre, int(nota)))\n",
  pruebas:[{entrada:"4\nluis 7\nana 9\nzoe 7\nbea 9", salida:"ana\nbea\nluis\nzoe"},{entrada:"2\nb 5\na 6", salida:"a\nb"},{entrada:"3\nc 10\nb 10\na 10", salida:"a\nb\nc", oculta:true}],
  pista:"key=lambda x: (-x[1], x[0]).",
  solucion:`n = int(input())
alumnos = []
for _ in range(n):
    nombre, nota = input().split()
    alumnos.append((nombre, int(nota)))
for nombre, nota in sorted(alumnos, key=lambda x: (-x[1], x[0])):
    print(nombre)`,
  why:"Una sola ordenación con una tupla como clave resuelve varios criterios. Es lo que harás a diario al preparar datos."},
 {t:"codigo", p:"El número más grande: concatena los números en el orden que forme el mayor número posible e imprímelo",
  lenguaje:"py",
  plantilla:"from functools import cmp_to_key\nnums = input().split()\n",
  pruebas:[{entrada:"10 2", salida:"210"},{entrada:"3 30 34 5 9", salida:"9534330"},{entrada:"0 0", salida:"0", oculta:true},{entrada:"121 12", salida:"12121", oculta:true}],
  pista:"a va antes que b si a + b &gt; b + a como cadenas. Cuidado con el resultado «00».",
  solucion:`from functools import cmp_to_key
nums = input().split()

def cmp(a, b):
    if a + b > b + a:
        return -1
    if a + b < b + a:
        return 1
    return 0

res = "".join(sorted(nums, key=cmp_to_key(cmp)))
print("0" if res[0] == "0" else res)`,
  why:"Ordenar como cadenas no basta (3 frente a 30). El comparador «a + b frente a b + a» es transitivo, y por eso sirve para ordenar."},
 {t:"vf", p:"sorted() en Python es estable.",
  ok:true, why:"TimSort es estable: a igualdad de clave se conserva el orden original."}
]},

{
id:"al7n2",
titulo:"Sin ordenar del todo: quickselect y conteo",
claves:["Quickselect encuentra el k-ésimo en O(n) de media particionando como quicksort pero bajando por un solo lado","Counting sort y bucket sort: O(n + k) cuando los valores están acotados","Si solo necesitas los k primeros, no ordenes todo"],
pasos:[
 {t:"info", eti:"Particionar", h:"Quickselect",
  c:`<p>Para el k-ésimo menor no hace falta ordenar: particiona alrededor de un pivote como en quicksort y <b>solo sigues por el lado donde cae k</b>. De media: n + n/2 + n/4 + … = O(n). En el peor caso, O(n²) (se evita con pivote aleatorio).</p>
<div class="termbox">import random

def k_esimo_menor(a, k):              # k empieza en 0
    pivote = random.choice(a)
    menores = [x for x in a if x &lt; pivote]
    iguales = [x for x in a if x == pivote]
    mayores = [x for x in a if x &gt; pivote]
    if k &lt; len(menores):
        return k_esimo_menor(menores, k)
    if k &lt; len(menores) + len(iguales):
        return pivote
    return k_esimo_menor(mayores, k - len(menores) - len(iguales))</div>
     <p>Esta versión usa memoria extra por claridad; la de entrevista particiona en el sitio (Lomuto o Hoare).</p>`},
 {t:"codigo", p:"Imprime el k-ésimo mayor elemento (k = 1 es el máximo) usando quickselect",
  lenguaje:"py",
  c:`<p>Primera línea: k. Segunda: los números.</p>`,
  plantilla:"import random\nk = int(input())\na = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"2\n3 2 1 5 6 4", salida:"5"},{entrada:"4\n3 2 3 1 2 4 5 5 6", salida:"4"},{entrada:"1\n-7", salida:"-7", oculta:true},{entrada:"3\n1 1 1 1", salida:"1", oculta:true}],
  pista:"El k-ésimo mayor es el (n - k)-ésimo menor contando desde 0.",
  solucion:`import random
k = int(input())
a = [int(x) for x in input().split()]

def k_esimo_menor(a, k):
    pivote = random.choice(a)
    menores = [x for x in a if x < pivote]
    iguales = [x for x in a if x == pivote]
    mayores = [x for x in a if x > pivote]
    if k < len(menores):
        return k_esimo_menor(menores, k)
    if k < len(menores) + len(iguales):
        return pivote
    return k_esimo_menor(mayores, k - len(menores) - len(iguales))

print(k_esimo_menor(a, len(a) - k))`,
  why:"Separar los iguales evita el peor caso con muchos repetidos (1 1 1 1). Alternativa en entrevista: montículo de tamaño k, O(n log k)."},
 {t:"info", eti:"Sin comparar", h:"Counting sort y bucket sort",
  c:`<div class="termbox"># edades entre 0 y 120: counting sort O(n + 121)
cuenta = [0] * 121
for e in edades:
    cuenta[e] += 1
ordenadas = [e for e in range(121) for _ in range(cuenta[e])]

# bucket sort por frecuencia: los k más frecuentes en O(n)
from collections import Counter
f = Counter(nums)
cubos = [[] for _ in range(len(nums) + 1)]    # cubos[c] = valores que salen c veces
for x, c in f.items():
    cubos[c].append(x)</div>
     <p>La frecuencia de un elemento no puede superar n, así que hay n + 1 cubos: recorrerlos de mayor a menor da los más frecuentes sin ordenar.</p>`},
 {t:"codigo", p:"Ordena las notas (enteros de 0 a 10) con counting sort, sin sort ni sorted, e imprime cuántas hay de cada nota que aparezca, con el formato <code>nota:veces</code> separado por espacios",
  lenguaje:"py",
  plantilla:"notas = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"7 5 7 10 0 5 7", salida:"0:1 5:2 7:3 10:1"},{entrada:"3", salida:"3:1"},{entrada:"10 10 9 9", salida:"9:2 10:2", oculta:true}],
  pista:"cuenta = [0] * 11; incrementa cuenta[nota] y recorre de 0 a 10 imprimiendo las que sean mayores que 0.",
  solucion:`notas = [int(x) for x in input().split()]
cuenta = [0] * 11
for x in notas:
    cuenta[x] += 1
print(" ".join(f"{v}:{c}" for v, c in enumerate(cuenta) if c > 0))`,
  why:"O(n + 11): lineal. Cuando el rango de valores es pequeño y conocido, no hay nada más rápido."},
 {t:"par", p:"Empareja cada necesidad con la herramienta",
  pares:[["El k-ésimo mayor, una vez","Quickselect: O(n) de media"],["Los k mayores de un flujo enorme","Montículo mínimo de tamaño k"],["Ordenar un millón de edades","Counting sort"],["Los k elementos más frecuentes en O(n)","Bucket sort por frecuencia"],["Ordenar objetos por varios campos","sorted con una tupla como clave"]],
  why:"Ordenar todo (O(n log n)) suele ser aceptable, pero saber cuándo no hace falta distingue una respuesta buena de una excelente."},
 {t:"vf", p:"Quickselect es O(n) en el peor caso.",
  ok:false, why:"Es O(n) de media y O(n²) en el peor caso. Existe una variante O(n) garantizada (mediana de medianas), pero casi nunca se usa en la práctica."},
 {t:"opcion", p:"¿Por qué counting sort no contradice el límite de O(n log n) para ordenar?",
  ops:["Sí lo contradice","Ese límite solo aplica a algoritmos que ordenan comparando; counting sort usa los valores como índices","Porque es O(n log n) también","Porque solo ordena números pares"],
  ok:1, why:"El precio es memoria O(k) y que solo sirve con claves enteras en un rango pequeño."}
]}

]});
