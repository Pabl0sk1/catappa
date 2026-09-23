window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Árboles",
resumen: "Árboles binarios y sus recorridos, recursión que devuelve información de los subárboles, árboles binarios de búsqueda y cómo construir y serializar un árbol",
nivel: "Avanzado",
color: "#72af40",
lecciones: [

{
id:"al6l1",
titulo:"Árboles binarios y recorridos",
claves:["Cada nodo tiene como mucho dos hijos: izquierdo y derecho","Recorridos en profundidad: preorden, inorden, postorden","Recorrido por niveles (BFS) con una cola"],
pasos:[
 {t:"info", eti:"Jerarquías", h:"Recorrer un árbol",
  c:`<div class="dg"><div class="dg-tit">árbol de búsqueda de ejemplo</div>
<svg viewBox="0 0 320 170" width="100%" style="max-width:420px;display:block;margin:auto" role="img" aria-label="Raíz 8; hijos 3 y 10; 3 tiene hijos 1 y 6; 10 tiene un hijo derecho, 14">
<line x1="160" y1="28" x2="90" y2="85" stroke="var(--line-2)" stroke-width="2"/>
<line x1="160" y1="28" x2="230" y2="85" stroke="var(--line-2)" stroke-width="2"/>
<line x1="90" y1="85" x2="50" y2="142" stroke="var(--line-2)" stroke-width="2"/>
<line x1="90" y1="85" x2="130" y2="142" stroke="var(--line-2)" stroke-width="2"/>
<line x1="230" y1="85" x2="270" y2="142" stroke="var(--line-2)" stroke-width="2"/>
<circle cx="50" cy="142" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="50" y="147" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">1</text>
<circle cx="90" cy="85" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="90" y="90" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">3</text>
<circle cx="130" cy="142" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="130" y="147" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">6</text>
<circle cx="160" cy="28" r="18" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="160" y="33" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">8</text>
<circle cx="230" cy="85" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="230" y="90" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">10</text>
<circle cx="270" cy="142" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="270" y="147" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">14</text>
</svg></div>
<div class="dg dg-tabla-caja"><div class="dg-tit">los cuatro recorridos de ese árbol</div>
<table class="dg-tabla"><thead><tr><th>recorrido</th><th>orden</th><th>resultado</th></tr></thead><tbody>
<tr><td>preorden</td><td>raíz, izq, der</td><td><code>8 3 1 6 10 14</code></td></tr>
<tr><td>inorden</td><td>izq, raíz, der</td><td><code>1 3 6 8 10 14</code><br>ordenado si es un árbol de búsqueda</td></tr>
<tr><td>postorden</td><td>izq, der, raíz</td><td><code>1 6 3 14 10 8</code></td></tr>
<tr><td>por niveles</td><td>nivel a nivel</td><td><code>8 | 3 10 | 1 6 14</code></td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Código", h:"Recursivo y por niveles",
  c:`<div class="termbox">class Nodo:
    def __init__(self, val, izq=None, der=None):
        self.val, self.izq, self.der = val, izq, der

def inorden(n, res):
    if n is None:
        return
    inorden(n.izq, res); res.append(n.val); inorden(n.der, res)

from collections import deque
def por_niveles(raiz):
    res, cola = [], deque([raiz] if raiz else [])
    while cola:
        nivel = []
        for _ in range(len(cola)):          # exactamente los nodos de este nivel
            n = cola.popleft()
            nivel.append(n.val)
            if n.izq: cola.append(n.izq)
            if n.der: cola.append(n.der)
        res.append(nivel)
    return res</div>
     <p>En los ejercicios, el árbol llega «por niveles» con <code>null</code> para los huecos, como en LeetCode: <code>8 3 10 1 6 null 14</code>.</p>`},
 {t:"par", p:"Empareja cada recorrido con su orden",
  pares:[["Preorden","Raíz, izquierdo, derecho"],["Inorden","Izquierdo, raíz, derecho"],["Postorden","Izquierdo, derecho, raíz"],["Por niveles","Nivel a nivel con una cola"]],
  why:"El inorden de un árbol de búsqueda devuelve los valores ordenados."},
 {t:"opcion", p:"¿Qué estructura necesitas para recorrer un árbol por niveles?",
  ops:["Una pila","Una cola","Un diccionario","Nada"],
  ok:1, why:"FIFO: primero los nodos del nivel actual, luego sus hijos."},
 {t:"codigo", p:"Imprime los recorridos preorden, inorden y postorden del árbol, cada uno en una línea",
  lenguaje:"py",
  c:`<p>La plantilla construye el árbol a partir de la lista por niveles.</p>`,
  plantilla:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
# imprime preorden, inorden y postorden
`,
  pruebas:[{entrada:"8 3 10 1 6 null 14", salida:"8 3 1 6 10 14\n1 3 6 8 10 14\n1 6 3 14 10 8"},{entrada:"1 null 2 3", salida:"1 2 3\n1 3 2\n3 2 1"},{entrada:"5", salida:"5\n5\n5", oculta:true}],
  pista:"Tres funciones recursivas que añaden n.val a una lista antes, entre o después de las llamadas a los hijos.",
  solucion:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())

def pre(n, r):
    if n:
        r.append(n.val); pre(n.izq, r); pre(n.der, r)
    return r

def ino(n, r):
    if n:
        ino(n.izq, r); r.append(n.val); ino(n.der, r)
    return r

def post(n, r):
    if n:
        post(n.izq, r); post(n.der, r); r.append(n.val)
    return r

print(*pre(raiz, []))
print(*ino(raiz, []))
print(*post(raiz, []))`,
  why:"Los tres recorridos son el mismo código con la línea que visita el nodo en otro sitio. Cada uno es O(n)."},
 {t:"codigo", p:"Vista derecha: imprime el último nodo de cada nivel (lo que verías mirando el árbol desde la derecha)",
  lenguaje:"py",
  plantilla:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
`,
  pruebas:[{entrada:"1 2 3 null 5 null 4", salida:"1 3 4"},{entrada:"1 2 3 4", salida:"1 3 4"},{entrada:"1 null 3", salida:"1 3", oculta:true}],
  pista:"Recorrido por niveles; de cada nivel guarda el último que sacas de la cola.",
  solucion:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
res = []
cola = deque([raiz] if raiz else [])
while cola:
    for _ in range(len(cola)):
        n = cola.popleft()
        ultimo = n.val
        if n.izq:
            cola.append(n.izq)
        if n.der:
            cola.append(n.der)
    res.append(ultimo)
print(*res)`,
  why:"El caso 1 2 3 4 es la trampa: el 4 cuelga a la izquierda, pero es lo único de su nivel, así que se ve desde la derecha."},
 {t:"vf", p:"Un recorrido en profundidad de un árbol de n nodos cuesta O(n) de tiempo y O(h) de pila, siendo h la altura.",
  ok:true, why:"En un árbol equilibrado h = log n; en uno degenerado (una lista), h = n."}
]},

{
id:"al9n1",
titulo:"Recursión en árboles: qué devuelve cada subárbol",
claves:["Define qué devuelve la función para un subárbol y combínalo en el padre (postorden)","Diámetro: la mejor ruta que pasa por un nodo es altura(izq) + altura(der)","Ancestro común más bajo: el primer nodo donde p y q quedan en lados distintos"],
pasos:[
 {t:"info", eti:"El patrón", h:"Preguntar a los hijos",
  c:`<p>Casi todos los problemas de árboles se resuelven igual: una función que para cada nodo <b>pide información a sus dos subárboles</b> y la combina.</p>
<div class="termbox">def altura(n):
    if n is None: return 0
    return 1 + max(altura(n.izq), altura(n.der))

def equilibrado(n):                  # devuelve la altura, o -1 si no está equilibrado
    if n is None: return 0
    a, b = equilibrado(n.izq), equilibrado(n.der)
    if a == -1 or b == -1 or abs(a - b) &gt; 1: return -1
    return 1 + max(a, b)</div>
     <p>Fíjate en <code>equilibrado</code>: comprobar la altura de cada subárbol por separado sería O(n²); devolviendo ambas cosas a la vez es O(n).</p>`},
 {t:"info", eti:"Dos respuestas", h:"Diámetro: devolver una cosa y anotar otra",
  c:`<div class="termbox">def diametro(raiz):
    mejor = 0
    def alt(n):
        nonlocal mejor
        if n is None: return 0
        a, b = alt(n.izq), alt(n.der)
        mejor = max(mejor, a + b)       # ruta más larga que pasa por n (en aristas)
        return 1 + max(a, b)            # lo que el padre necesita: la altura
    alt(raiz)
    return mejor</div>
     <p>Lo que <b>devuelves</b> al padre (altura) no es lo que <b>preguntan</b> (diámetro). Separarlo con una variable externa es el truco de «máxima suma de un camino», «camino más largo con el mismo valor», etc.</p>`},
 {t:"codigo", p:"Imprime la altura del árbol (número de nodos del camino más largo de la raíz a una hoja) y, en otra línea, su diámetro (aristas del camino más largo entre dos nodos)",
  lenguaje:"py",
  plantilla:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
`,
  pruebas:[{entrada:"1 2 3 4 5", salida:"3\n3"},{entrada:"1 2", salida:"2\n1"},{entrada:"1 2 null 3 4 5 null null 6 7 null null 8", salida:"5\n6", oculta:true}],
  pista:"Una función que devuelve la altura y actualiza una variable externa con altura(izq) + altura(der).",
  solucion:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
mejor = 0

def alt(n):
    global mejor
    if n is None:
        return 0
    a, b = alt(n.izq), alt(n.der)
    mejor = max(mejor, a + b)
    return 1 + max(a, b)

print(alt(raiz))
print(mejor)`,
  why:"El caso oculto tiene el diámetro lejos de la raíz: por eso hay que anotar en cada nodo y no solo en la raíz."},
 {t:"codigo", p:"¿Existe un camino de la raíz a una hoja cuyos valores sumen el objetivo? Imprime <code>si</code> o <code>no</code>",
  lenguaje:"py",
  c:`<p>Primera línea: el árbol por niveles. Segunda: el objetivo.</p>`,
  plantilla:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
objetivo = int(input())
`,
  pruebas:[{entrada:"5 4 8 11 null 13 4 7 2 null null null 1\n22", salida:"si"},{entrada:"1 2 3\n5", salida:"no"},{entrada:"1 2\n1", salida:"no", oculta:true},{entrada:"-2 null -3\n-5", salida:"si", oculta:true}],
  pista:"Resta el valor del nodo al objetivo al bajar; en una hoja (sin hijos), comprueba si lo que queda es 0.",
  solucion:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
objetivo = int(input())

def camino(n, resto):
    if n is None:
        return False
    resto -= n.val
    if n.izq is None and n.der is None:
        return resto == 0
    return camino(n.izq, resto) or camino(n.der, resto)

print("si" if camino(raiz, objetivo) else "no")`,
  why:"El caso «1 2» con objetivo 1 es la trampa: la raíz sola suma 1, pero no es hoja (tiene un hijo), así que no cuenta."},
 {t:"info", eti:"Clásico", h:"Ancestro común más bajo (LCA)",
  c:`<div class="termbox">def lca(n, p, q):
    if n is None or n.val == p or n.val == q:
        return n
    a, b = lca(n.izq, p, q), lca(n.der, p, q)
    if a and b:
        return n            # p y q están en lados distintos: n es el LCA
    return a or b           # ambos en el mismo lado (o ninguno)</div>
     <p>En un árbol binario de búsqueda es aún más fácil: baja a la izquierda si ambos son menores que el nodo, a la derecha si ambos son mayores; si no, has llegado.</p>`},
 {t:"opcion", p:"Para saber si un árbol está equilibrado, llamas a <code>altura()</code> para los dos hijos de cada nodo. ¿Qué complejidad tiene?",
  ops:["O(n)","O(n²) en el peor caso: se recalculan las alturas una y otra vez","O(log n)","O(1)"],
  ok:1, why:"Devolver la altura y el «está equilibrado» en la misma pasada (por ejemplo, -1 como señal) lo deja en O(n)."},
 {t:"par", p:"Empareja cada problema con lo que devuelve la función recursiva",
  pares:[["Altura","1 + máximo de las alturas de los hijos"],["¿Es equilibrado?","La altura, o -1 si algún subárbol no lo está"],["Diámetro","La altura, anotando izq + der en una variable externa"],["Ancestro común más bajo","El nodo encontrado en ese subárbol, o None"]],
  why:"Decidir qué devuelve la función es el 90% del problema."}
]},

{
id:"al6l2",
titulo:"Árboles binarios de búsqueda",
claves:["En un BST, todo lo de la izquierda es menor y todo lo de la derecha es mayor","Buscar, insertar y borrar en O(altura): O(log n) si está equilibrado","El inorden de un BST sale ordenado; TreeMap de Java es un BST equilibrado"],
pasos:[
 {t:"info", eti:"Orden en forma de árbol", h:"BST",
  c:`<div class="termbox">def contiene(n, x):
    while n:
        if x == n.val:
            return True
        n = n.izq if x &lt; n.val else n.der     # descartar un subárbol entero
    return False

def insertar(n, x):
    if n is None:
        return Nodo(x)
    if x &lt; n.val: n.izq = insertar(n.izq, x)
    else:         n.der = insertar(n.der, x)
    return n

def valido(n, lo=float("-inf"), hi=float("inf")):   # cada nodo dentro de un rango
    if n is None: return True
    if not (lo &lt; n.val &lt; hi): return False
    return valido(n.izq, lo, n.val) and valido(n.der, n.val, hi)</div>
     <p>Si insertas valores ya ordenados en un BST sin equilibrar, degenera en una lista: O(n). Por eso existen los árboles <b>equilibrados</b> (AVL, rojo-negro), que rotan nodos para mantener la altura en O(log n).</p>`},
 {t:"opcion", p:"¿Por qué para validar un BST no basta con comprobar que cada hijo izquierdo es menor que su padre?",
  ops:["Sí basta","Todo el subárbol izquierdo debe ser menor que el nodo, no solo el hijo directo: hay que propagar rangos","Porque los árboles no tienen orden","Porque hay que usar BFS"],
  ok:1, why:"Error clásico en entrevistas: en 5 → izq 3 → der 7, cada padre e hijo cumple, pero 7 está a la izquierda de 5."},
 {t:"codigo", p:"¿Es un árbol binario de búsqueda válido (estrictamente, sin repetidos)? Imprime <code>true</code> o <code>false</code>",
  lenguaje:"py",
  plantilla:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())
`,
  pruebas:[{entrada:"2 1 3", salida:"true"},{entrada:"5 1 4 null null 3 6", salida:"false"},{entrada:"5 3 8 1 7", salida:"false", oculta:true},{entrada:"2 2 2", salida:"false", oculta:true},{entrada:"8 3 10 1 6 null 14", salida:"true", oculta:true}],
  pista:"Pasa un rango (lo, hi) a cada llamada: la izquierda hereda hi = n.val y la derecha lo = n.val.",
  solucion:`from collections import deque

class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

def construir(t):
    if not t or t[0] == "null":
        return None
    raiz = Nodo(int(t[0]))
    cola, i = deque([raiz]), 1
    while cola and i < len(t):
        n = cola.popleft()
        if i < len(t) and t[i] != "null":
            n.izq = Nodo(int(t[i])); cola.append(n.izq)
        i += 1
        if i < len(t) and t[i] != "null":
            n.der = Nodo(int(t[i])); cola.append(n.der)
        i += 1
    return raiz

raiz = construir(input().split())

def valido(n, lo, hi):
    if n is None:
        return True
    if not (lo < n.val < hi):
        return False
    return valido(n.izq, lo, n.val) and valido(n.der, n.val, hi)

print("true" if valido(raiz, float("-inf"), float("inf")) else "false")`,
  why:"El caso «5 3 8 1 7» es la trampa: 7 es hijo derecho de 3 (correcto localmente) pero está en el subárbol izquierdo de 5."},
 {t:"codigo", p:"Inserta los números en un BST en el orden dado e imprime el k-ésimo menor (k empieza en 1) con un recorrido inorden que se detiene al llegar",
  lenguaje:"py",
  c:`<p>Primera línea: los números a insertar (distintos). Segunda: k.</p>`,
  plantilla:"class Nodo:\n    def __init__(self, val):\n        self.val = val\n        self.izq = self.der = None\n\nnums = [int(x) for x in input().split()]\nk = int(input())\n",
  pruebas:[{entrada:"5 3 6 2 4 1\n3", salida:"3"},{entrada:"3 1 4 2\n1", salida:"1"},{entrada:"10 20 30 40\n4", salida:"40", oculta:true}],
  pista:"Inserta de forma iterativa. Para el inorden iterativo usa una pila: baja a la izquierda apilando, saca, cuenta y ve a la derecha.",
  solucion:`class Nodo:
    def __init__(self, val):
        self.val = val
        self.izq = self.der = None

nums = [int(x) for x in input().split()]
k = int(input())
raiz = None
for x in nums:
    if raiz is None:
        raiz = Nodo(x)
        continue
    n = raiz
    while True:
        if x < n.val:
            if n.izq is None:
                n.izq = Nodo(x)
                break
            n = n.izq
        else:
            if n.der is None:
                n.der = Nodo(x)
                break
            n = n.der
pila, n = [], raiz
while pila or n:
    while n:
        pila.append(n)
        n = n.izq
    n = pila.pop()
    k -= 1
    if k == 0:
        print(n.val)
        break
    n = n.der`,
  why:"El inorden iterativo se detiene en cuanto encuentra el k-ésimo: O(h + k) en vez de recorrer todo. El caso 10 20 30 40 muestra un BST degenerado (una lista)."},
 {t:"par", p:"Empareja cada estructura con lo que ofrece",
  pares:[["TreeMap de Java","Mapa ordenado por clave con operaciones O(log n)"],["floorKey / ceilingKey","Buscar la clave inmediatamente menor o mayor"],["dict de Python","Sin orden por clave, pero O(1) de media"],["SortedList (sortedcontainers)","Lista ordenada con inserción y búsqueda rápidas en Python"]],
  why:"Python no trae un árbol ordenado en la librería estándar; en entrevistas suele bastar con bisect sobre una lista o con un montículo."},
 {t:"vf", p:"Insertar 1, 2, 3, 4, 5 en ese orden en un BST sin equilibrar produce un árbol de altura 5.",
  ok:true, why:"Cada valor va a la derecha del anterior: el árbol es una lista y las operaciones pasan a ser O(n)."}
]},

{
id:"al9n2",
titulo:"Construir y serializar árboles",
claves:["Con preorden (o postorden) más inorden se reconstruye un árbol sin repetidos","Serializar: convertir el árbol en texto con marcas para los huecos, y volver","Un diccionario valor → posición en el inorden evita búsquedas O(n)"],
pasos:[
 {t:"info", eti:"Reconstruir", h:"Desde preorden e inorden",
  c:`<p>El primer elemento del preorden es la <b>raíz</b>. Buscándola en el inorden sabes cuántos nodos hay a su izquierda y cuántos a su derecha, y repites con cada lado:</p>
<div class="dg"><div class="dg-tit">preorden 3 9 20 15 7 · inorden 9 3 15 20 7</div><div class="dg-flujo"><div class="dg-caja acento">raíz 3</div><div class="dg-caja">izq: inorden [9]</div><div class="dg-caja">der: inorden [15 20 7], preorden [20 15 7]</div><div class="dg-caja ok">repetir</div></div></div>
<div class="termbox">pos = {v: i for i, v in enumerate(inorden)}   # O(1) para encontrar la raíz
it = iter(preorden)
def construir(lo, hi):                        # nodos del inorden [lo, hi]
    if lo &gt; hi: return None
    v = next(it)
    n = Nodo(v)
    n.izq = construir(lo, pos[v] - 1)
    n.der = construir(pos[v] + 1, hi)
    return n</div>`},
 {t:"codigo", p:"Reconstruye el árbol a partir de su preorden (primera línea) y su inorden (segunda línea), e imprime su postorden",
  lenguaje:"py",
  plantilla:"import sys\nsys.setrecursionlimit(10000)\npre = [int(x) for x in input().split()]\nino = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"3 9 20 15 7\n9 3 15 20 7", salida:"9 15 7 20 3"},{entrada:"1 2\n2 1", salida:"2 1"},{entrada:"1 2 3\n1 2 3", salida:"3 2 1", oculta:true},{entrada:"8 3 1 6 10 14\n1 3 6 8 10 14", salida:"1 6 3 14 10 8", oculta:true}],
  pista:"No hace falta construir nodos: al volver de las dos llamadas recursivas, añade el valor a la lista del postorden.",
  solucion:`import sys
sys.setrecursionlimit(10000)
pre = [int(x) for x in input().split()]
ino = [int(x) for x in input().split()]
pos = {v: i for i, v in enumerate(ino)}
it = iter(pre)
post = []

def construir(lo, hi):
    if lo > hi:
        return
    v = next(it)
    construir(lo, pos[v] - 1)
    construir(pos[v] + 1, hi)
    post.append(v)

construir(0, len(ino) - 1)
print(*post)`,
  why:"Buscar la raíz en el inorden con index() haría el total O(n²); con el diccionario es O(n)."},
 {t:"info", eti:"Guardar y recuperar", h:"Serializar un árbol",
  c:`<div class="termbox">def serializar(n):                        # preorden con "#" para los huecos
    if n is None: return ["#"]
    return [str(n.val)] + serializar(n.izq) + serializar(n.der)

def deserializar(tokens):
    it = iter(tokens)
    def leer():
        v = next(it)
        if v == "#": return None
        n = Nodo(int(v))
        n.izq, n.der = leer(), leer()
        return n
    return leer()</div>
     <p>Con las marcas de hueco, <b>un solo recorrido</b> basta para reconstruir el árbol (sin ellas hacen falta dos, y sin repetidos).</p>`},
 {t:"codigo", p:"Lee un árbol serializado en preorden con <code>#</code> para los huecos e imprime la suma de sus hojas",
  lenguaje:"py",
  plantilla:"tokens = input().split()\n",
  pruebas:[{entrada:"1 2 # # 3 4 # # 5 # #", salida:"11"},{entrada:"7 # #", salida:"7"},{entrada:"1 2 3 # # # #", salida:"3", oculta:true},{entrada:"#", salida:"0", oculta:true}],
  pista:"Una función recursiva que lee el siguiente token: si es «#» devuelve 0; si no, lee los dos hijos y, si ambos son huecos, es una hoja.",
  solucion:`tokens = input().split()
it = iter(tokens)

def leer():
    v = next(it)
    if v == "#":
        return None
    return (int(v), leer(), leer())

def hojas(n):
    if n is None:
        return 0
    v, a, b = n
    if a is None and b is None:
        return v
    return hojas(a) + hojas(b)

print(hojas(leer()))`,
  why:"Representar el nodo como una tupla (valor, izq, der) es suficiente para muchos ejercicios y evita definir una clase."},
 {t:"opcion", p:"¿Por qué solo con el preorden (sin marcas de hueco) no puedes reconstruir un árbol binario?",
  ops:["Sí se puede siempre","Distintos árboles comparten preorden: no sabes dónde termina el subárbol izquierdo","Porque el preorden no incluye la raíz","Porque hay que ordenarlo"],
  ok:1, why:"1 → 2 como hijo izquierdo y 1 → 2 como hijo derecho tienen el mismo preorden: 1 2."},
 {t:"vf", p:"Si el árbol es un BST, basta con el preorden para reconstruirlo.",
  ok:true, why:"El inorden de un BST es el preorden ordenado, así que lo puedes deducir (o usar rangos al leer el preorden)."}
]}

]});
