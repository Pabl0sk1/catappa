window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Backtracking",
resumen: "Explorar todas las opciones eligiendo, explorando y deshaciendo: subconjuntos, permutaciones, combinaciones, restricciones y poda",
nivel: "Avanzado",
color: "#80bb4d",
lecciones: [

{
id:"al5l3",
titulo:"Backtracking: subconjuntos",
claves:["Construir una solución paso a paso y deshacer (volver atrás) al explorar otra opción","El árbol de decisiones: en cada nivel, qué opciones quedan","El coste suele ser exponencial: 2ⁿ subconjuntos, n! permutaciones"],
pasos:[
 {t:"info", eti:"Explorar todo", h:"La plantilla",
  c:`<div class="termbox">def subconjuntos(nums):
    res, actual = [], []
    def explorar(inicio):
        res.append(actual[:])               # guardar una COPIA de la solución actual
        for i in range(inicio, len(nums)):
            actual.append(nums[i])          # elegir
            explorar(i + 1)                 # explorar
            actual.pop()                    # deshacer
    explorar(0)
    return res</div>
     <div class="dg"><div class="dg-tit">árbol de decisiones para [1, 2, 3]</div><div class="dg dg-arbol">
<div class="rama" style="--n:0"><span class="nom carpeta">[]</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">[1]</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">[1, 2]</span></div>
<div class="rama" style="--n:3"><span class="nom">[1, 2, 3]</span></div>
<div class="rama" style="--n:2"><span class="nom">[1, 3]</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">[2]</span></div>
<div class="rama" style="--n:2"><span class="nom">[2, 3]</span></div>
<div class="rama" style="--n:1"><span class="nom">[3]</span></div>
</div></div>
     <p>Elegir, explorar, deshacer. Cada nodo del árbol es un subconjunto: 2ⁿ en total.</p>`},
 {t:"info", eti:"El bug más común", h:"Guardar copias, no referencias",
  c:`<div class="nota ojo"><b class="tit">res.append(actual) no funciona</b>Guarda la <b>misma</b> lista una y otra vez; como al final queda vacía tras los pop, obtendrías 2ⁿ listas vacías. Usa <code>actual[:]</code> o <code>list(actual)</code>.</div>
     <p>La alternativa sin deshacer es pasar una lista nueva en cada llamada (<code>explorar(i + 1, actual + [nums[i]])</code>): más simple pero copia en cada paso.</p>`},
 {t:"orden", p:"Ordena el ciclo básico del backtracking",
  items:["Elegir una opción y añadirla a la solución parcial","Explorar recursivamente a partir de ahí","Deshacer la elección","Probar la siguiente opción"],
  why:"El paso de deshacer es lo que permite reutilizar la misma estructura."},
 {t:"codigo", p:"Imprime todos los subconjuntos de los números, uno por línea, en el orden del árbol de decisiones (el vacío como línea con un guion <code>-</code>)",
  lenguaje:"py",
  plantilla:"nums = input().split()\n",
  pruebas:[{entrada:"1 2 3", salida:"-\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3"},{entrada:"a", salida:"-\na"},{entrada:"x y", salida:"-\nx\nx y\ny", oculta:true}],
  pista:"Sigue la plantilla: guarda (imprime) al entrar en cada llamada y recorre desde inicio.",
  solucion:`nums = input().split()
actual = []

def explorar(inicio):
    print(" ".join(actual) if actual else "-")
    for i in range(inicio, len(nums)):
        actual.append(nums[i])
        explorar(i + 1)
        actual.pop()

explorar(0)`,
  why:"Imprimir al entrar en cada nodo recorre el árbol en preorden, que es justo el orden pedido."},
 {t:"par", p:"Empareja cada problema con su número de soluciones",
  pares:[["Subconjuntos de n elementos","2ⁿ"],["Permutaciones de n elementos","n!"],["Combinaciones de n elementos tomados de k en k","n! / (k! (n-k)!)"],["N reinas","Se exploran con mucha poda"]],
  why:"Saber el tamaño del espacio de búsqueda ayuda a explicar la complejidad: subconjuntos es O(n · 2ⁿ) contando las copias."},
 {t:"codigo", p:"Imprime cuántos subconjuntos de los números suman exactamente el objetivo",
  lenguaje:"py",
  c:`<p>Primera línea: los números (positivos). Segunda: el objetivo. Poda: si la suma parcial ya supera el objetivo, no sigas por esa rama.</p>`,
  plantilla:"nums = [int(x) for x in input().split()]\nobjetivo = int(input())\n",
  pruebas:[{entrada:"1 2 3 4 5\n5", salida:"3"},{entrada:"2 4 6\n5", salida:"0"},{entrada:"1 1 1\n2", salida:"3", oculta:true},{entrada:"3 34 4 12 5 2\n9", salida:"2", oculta:true}],
  pista:"explorar(i, suma): para cada j desde i, si suma + nums[j] == objetivo cuenta 1; si es menor, explora desde j + 1.",
  solucion:`nums = [int(x) for x in input().split()]
objetivo = int(input())
total = 0

def explorar(inicio, suma):
    global total
    for j in range(inicio, len(nums)):
        s = suma + nums[j]
        if s == objetivo:
            total += 1
        if s < objetivo:
            explorar(j + 1, s)

explorar(0, 0)
print(total)`,
  why:"Los subconjuntos {5}, {1, 4} y {2, 3} suman 5. Con positivos, la poda s &lt; objetivo es segura porque añadir más nunca baja la suma."},
 {t:"vf", p:"En el backtracking de subconjuntos, <code>res.append(actual)</code> guarda correctamente cada subconjunto.",
  ok:false, why:"Guarda referencias a la misma lista mutable. Hay que guardar una copia."}
]},

{
id:"al8n1",
titulo:"Permutaciones y combinaciones",
claves:["Permutaciones: en cada nivel, cualquier elemento no usado (marca usados)","Combinaciones: empezar desde el índice siguiente para no repetir órdenes","Con duplicados: ordenar y saltar el repetido en el mismo nivel"],
pasos:[
 {t:"info", eti:"El orden importa", h:"Permutaciones",
  c:`<div class="termbox">def permutaciones(nums):
    res, actual, usado = [], [], [False] * len(nums)
    def explorar():
        if len(actual) == len(nums):
            res.append(actual[:]); return
        for i in range(len(nums)):
            if usado[i]:
                continue
            usado[i] = True; actual.append(nums[i])
            explorar()
            usado[i] = False; actual.pop()
    explorar()
    return res</div>
     <p>A diferencia de los subconjuntos, cada nivel recorre <b>todos</b> los índices (no desde <code>inicio</code>): [1, 2] y [2, 1] son distintas. En Python existe <code>itertools.permutations</code>, pero en entrevista te pedirán escribirlo.</p>`},
 {t:"info", eti:"Repetidos", h:"Evitar soluciones duplicadas",
  c:`<p>Con <code>[1, 1, 2]</code>, tratar los dos 1 como distintos genera cada permutación dos veces. La regla: <b>ordena</b>, y en un mismo nivel no uses un valor igual al anterior si el anterior no está en uso:</p>
<div class="termbox">nums.sort()
...
    if usado[i] or (i &gt; 0 and nums[i] == nums[i - 1] and not usado[i - 1]):
        continue</div>
     <p>En combinaciones y subconjuntos con repetidos, el equivalente es <code>if i &gt; inicio and nums[i] == nums[i - 1]: continue</code>.</p>`},
 {t:"codigo", p:"Imprime todas las permutaciones distintas de los números, una por línea, en orden lexicográfico",
  lenguaje:"py",
  c:`<p>Puede haber repetidos. No uses itertools.</p>`,
  plantilla:"nums = sorted(int(x) for x in input().split())\n",
  pruebas:[{entrada:"1 2 3", salida:"1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1"},{entrada:"1 1 2", salida:"1 1 2\n1 2 1\n2 1 1"},{entrada:"5", salida:"5", oculta:true},{entrada:"2 2", salida:"2 2", oculta:true}],
  pista:"Marca usados; salta nums[i] si es igual a nums[i - 1] y el anterior no está usado.",
  solucion:`nums = sorted(int(x) for x in input().split())
usado = [False] * len(nums)
actual = []

def explorar():
    if len(actual) == len(nums):
        print(*actual)
        return
    for i in range(len(nums)):
        if usado[i] or (i > 0 and nums[i] == nums[i - 1] and not usado[i - 1]):
            continue
        usado[i] = True
        actual.append(nums[i])
        explorar()
        usado[i] = False
        actual.pop()

explorar()`,
  why:"Al partir de la lista ordenada y recorrer los índices en orden, las permutaciones salen en orden lexicográfico sin ordenar el resultado."},
 {t:"codigo", p:"Suma de combinaciones: imprime todas las combinaciones de candidatos (cada uno se puede usar varias veces) que suman el objetivo, una por línea, con los números en orden no decreciente",
  lenguaje:"py",
  c:`<p>Primera línea: candidatos distintos y positivos. Segunda: objetivo. Imprime las combinaciones en orden lexicográfico, o <code>ninguna</code>.</p>`,
  plantilla:"cand = sorted(int(x) for x in input().split())\nobjetivo = int(input())\n",
  pruebas:[{entrada:"2 3 6 7\n7", salida:"2 2 3\n7"},{entrada:"2 3 5\n8", salida:"2 2 2 2\n2 3 3\n3 5"},{entrada:"2\n1", salida:"ninguna", oculta:true},{entrada:"1 2\n3", salida:"1 1 1\n1 2", oculta:true}],
  pista:"explorar(inicio, resto): para i desde inicio, si cand[i] &gt; resto rompe el bucle (están ordenados); si no, añade y explora desde i (no i + 1: se puede repetir).",
  solucion:`cand = sorted(int(x) for x in input().split())
objetivo = int(input())
actual = []
hay = False

def explorar(inicio, resto):
    global hay
    if resto == 0:
        print(*actual)
        hay = True
        return
    for i in range(inicio, len(cand)):
        if cand[i] > resto:
            break
        actual.append(cand[i])
        explorar(i, resto - cand[i])
        actual.pop()

explorar(0, objetivo)
if not hay:
    print("ninguna")`,
  why:"Explorar desde i (y no desde 0) evita generar 2 3 2 y 3 2 2 como combinaciones distintas. El break es poda gracias a la ordenación."},
 {t:"opcion", p:"¿Qué diferencia hay entre el bucle de permutaciones y el de combinaciones?",
  ops:["Ninguna","Permutaciones recorre todos los índices no usados en cada nivel; combinaciones empieza en el índice siguiente al último elegido","Combinaciones usa una cola","Permutaciones no necesita deshacer"],
  ok:1, why:"En combinaciones el orden no importa: fijar un orden creciente de índices evita contar la misma combinación varias veces."},
 {t:"par", p:"Empareja cada variante con su detalle clave",
  pares:[["Permutaciones","Array de usados"],["Combinaciones de k","Empezar en i + 1 y parar al tener k"],["Suma de combinaciones con repetición","Recursión desde i, no i + 1"],["Subconjuntos con repetidos","Ordenar y saltar nums[i] == nums[i - 1] si i &gt; inicio"]],
  why:"Todas son la misma plantilla con un detalle distinto. Memoriza la plantilla, no cada problema."},
 {t:"escribe", p:"¿Cuántas permutaciones tiene una lista de 5 elementos distintos?",
  sol:["120","5!"], pista:"5 × 4 × 3 × 2 × 1.",
  why:"n! crece rapidísimo: con 12 elementos ya son 479 millones. Por eso el backtracking de permutaciones solo es viable con n pequeño."}
]},

{
id:"al8n2",
titulo:"Restricciones y poda",
claves:["Comprobar la validez antes de seguir (poda) recorta ramas enteras del árbol","N reinas: columnas y diagonales ocupadas en conjuntos","Búsqueda en cuadrícula: marcar la celda al entrar y desmarcar al salir"],
pasos:[
 {t:"info", eti:"Podar", h:"N reinas",
  c:`<p>Colocar n reinas en un tablero n × n sin que se ataquen. Una reina por fila; para cada fila, prueba cada columna libre. Dos reinas comparten diagonal si <code>f - c</code> es igual, y antidiagonal si <code>f + c</code> es igual:</p>
<div class="termbox">def n_reinas(n):
    cols, diag, anti = set(), set(), set()
    total = 0
    def colocar(f):
        nonlocal total
        if f == n:
            total += 1; return
        for c in range(n):
            if c in cols or f - c in diag or f + c in anti:
                continue                    # poda: esta casilla está atacada
            cols.add(c); diag.add(f - c); anti.add(f + c)
            colocar(f + 1)
            cols.remove(c); diag.remove(f - c); anti.remove(f + c)
    colocar(0)
    return total</div>`},
 {t:"codigo", p:"Imprime de cuántas formas se pueden colocar n reinas en un tablero n × n sin que se ataquen",
  lenguaje:"py",
  plantilla:"n = int(input())\n",
  pruebas:[{entrada:"4", salida:"2"},{entrada:"1", salida:"1"},{entrada:"8", salida:"92", oculta:true},{entrada:"3", salida:"0", oculta:true}],
  pista:"Una reina por fila; conjuntos para columnas, f - c y f + c ocupados.",
  solucion:`n = int(input())
cols, diag, anti = set(), set(), set()
total = 0

def colocar(f):
    global total
    if f == n:
        total += 1
        return
    for c in range(n):
        if c in cols or f - c in diag or f + c in anti:
            continue
        cols.add(c)
        diag.add(f - c)
        anti.add(f + c)
        colocar(f + 1)
        cols.remove(c)
        diag.remove(f - c)
        anti.remove(f + c)

colocar(0)
print(total)`,
  why:"Sin poda habría 8⁸ = 16 millones de tableros; con ella se exploran unos pocos miles de nodos."},
 {t:"info", eti:"Generar con reglas", h:"Paréntesis bien formados",
  c:`<p>Para generar todas las cadenas de n pares de paréntesis válidas no generes las 2²ⁿ y filtres: añade <code>(</code> si quedan aperturas y <code>)</code> solo si hay más aperturas que cierres. La regla garantiza que toda rama es válida.</p>
<div class="termbox">def generar(abiertos, cerrados, actual):
    if len(actual) == 2 * n:
        res.append(actual); return
    if abiertos &lt; n:
        generar(abiertos + 1, cerrados, actual + "(")
    if cerrados &lt; abiertos:
        generar(abiertos, cerrados + 1, actual + ")")</div>`},
 {t:"codigo", p:"Imprime todas las combinaciones válidas de n pares de paréntesis, una por línea, en orden lexicográfico (<code>(</code> va antes que <code>)</code>)",
  lenguaje:"py",
  plantilla:"n = int(input())\n",
  pruebas:[{entrada:"1", salida:"()"},{entrada:"3", salida:"((()))\n(()())\n(())()\n()(())\n()()()"},{entrada:"2", salida:"(())\n()()", oculta:true}],
  pista:"Prueba primero a añadir «(» y después «)»: así salen en orden.",
  solucion:`n = int(input())

def generar(abiertos, cerrados, actual):
    if len(actual) == 2 * n:
        print(actual)
        return
    if abiertos < n:
        generar(abiertos + 1, cerrados, actual + "(")
    if cerrados < abiertos:
        generar(abiertos, cerrados + 1, actual + ")")

generar(0, 0, "")`,
  why:"El número de soluciones es el n-ésimo número de Catalan (1, 2, 5, 14, 42…)."},
 {t:"info", eti:"En cuadrícula", h:"Buscar una palabra en una sopa de letras",
  c:`<div class="termbox">def existe(tablero, palabra):
    F, C = len(tablero), len(tablero[0])
    def dfs(f, c, k):
        if k == len(palabra):
            return True
        if not (0 &lt;= f &lt; F and 0 &lt;= c &lt; C) or tablero[f][c] != palabra[k]:
            return False
        tablero[f][c] = "#"                 # marcar: no reutilizar la celda
        ok = any(dfs(f + df, c + dc, k + 1) for df, dc in ((1,0),(-1,0),(0,1),(0,-1)))
        tablero[f][c] = palabra[k]          # desmarcar al volver
        return ok
    return any(dfs(f, c, 0) for f in range(F) for c in range(C))</div>`},
 {t:"codigo", p:"Sopa de letras: imprime <code>si</code> si la palabra se puede formar con letras adyacentes (horizontal o vertical) sin reutilizar celdas, o <code>no</code>",
  lenguaje:"py",
  c:`<p>Primera línea: número de filas. Después, las filas como cadenas. Última línea: la palabra.</p>`,
  plantilla:"F = int(input())\nt = [list(input()) for _ in range(F)]\npalabra = input()\n",
  pruebas:[{entrada:"3\nABCE\nSFCS\nADEE\nABCCED", salida:"si"},{entrada:"3\nABCE\nSFCS\nADEE\nABCB", salida:"no"},{entrada:"3\nABCE\nSFCS\nADEE\nSEE", salida:"si", oculta:true},{entrada:"1\nA\nAA", salida:"no", oculta:true}],
  pista:"DFS desde cada celda; marca la celda con «#» antes de explorar vecinas y restáurala al volver.",
  solucion:`F = int(input())
t = [list(input()) for _ in range(F)]
palabra = input()
C = len(t[0])

def dfs(f, c, k):
    if k == len(palabra):
        return True
    if not (0 <= f < F and 0 <= c < C) or t[f][c] != palabra[k]:
        return False
    t[f][c] = "#"
    ok = any(dfs(f + df, c + dc, k + 1) for df, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
    t[f][c] = palabra[k]
    return ok

print("si" if any(dfs(f, c, 0) for f in range(F) for c in range(C)) else "no")`,
  why:"ABCB falla porque exigiría volver a usar la B. Marcar y desmarcar es el «elegir y deshacer» del backtracking en una cuadrícula."},
 {t:"opcion", p:"¿Qué es la poda en backtracking?",
  ops:["Borrar soluciones repetidas al final","Abandonar una rama en cuanto se sabe que no puede llevar a una solución válida","Ordenar las soluciones","Usar memoización"],
  ok:1, why:"Cuanto antes se detecta la invalidez, más grande es el trozo de árbol que te ahorras."},
 {t:"vf", p:"En la sopa de letras, si no desmarcas la celda al volver de la recursión, otras rutas que deberían poder usarla fallarán.",
  ok:true, why:"La marca solo debe durar mientras esa celda forma parte del camino actual."}
]}

]});
