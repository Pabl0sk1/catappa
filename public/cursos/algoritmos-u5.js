window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Pilas, colas y listas enlazadas",
resumen: "LIFO y FIFO, pilas para expresiones, pilas y colas monótonas, listas enlazadas y el diseño de una caché LRU",
nivel: "Intermedio",
color: "#8fc75b",
lecciones: [

{
id:"al4l1",
titulo:"Pilas y colas",
claves:["Pila (LIFO): push y pop por el mismo extremo","Cola (FIFO): se añade por un extremo y se saca por el otro","En Python, list sirve de pila y collections.deque de cola; en Java, ArrayDeque para ambas"],
pasos:[
 {t:"info", eti:"Orden de salida", h:"LIFO y FIFO",
  c:`<div class="dg dg-cols"><div class="dg-col"><div class="dg-col-tit">pila (LIFO)</div><div class="dg-pila"><div class="dg-caja acento">3 ← entra y sale por aquí</div><div class="dg-caja">2</div><div class="dg-caja">1</div></div></div>
<div class="dg-col"><div class="dg-col-tit">cola (FIFO)</div><div class="dg-flujo"><div class="dg-caja ok">sale 1</div><div class="dg-caja">2</div><div class="dg-caja acento">entra 3</div></div></div></div>
<div class="termbox">pila = []
pila.append(1); pila.append(2)
pila.pop()          # 2 (el último que entró)
pila[-1]            # 1 (mirar la cima sin sacar)

from collections import deque
cola = deque()
cola.append(1); cola.append(2)
cola.popleft()      # 1 (el primero que entró)</div>
     <p>En Java: <code>Deque&lt;Integer&gt; p = new ArrayDeque&lt;&gt;()</code> con <code>push/pop/peek</code> para pila y <code>offer/poll</code> para cola.</p>`},
 {t:"info", eti:"El clásico", h:"Paréntesis equilibrados",
  c:`<div class="termbox">def equilibrado(s):
    pareja = {")": "(", "]": "[", "}": "{"}
    pila = []
    for c in s:
        if c in "([{":
            pila.append(c)
        elif c in pareja:
            if not pila or pila.pop() != pareja[c]:
                return False
    return not pila            # si sobran aperturas, no está equilibrado</div>
     <p>Los dos errores típicos: no comprobar la pila vacía al cerrar (<code>")("</code>) y no comprobar que queda vacía al final (<code>"(("</code>).</p>`},
 {t:"par", p:"Empareja cada situación con la estructura",
  pares:[["Deshacer (Ctrl+Z)","Pila: se deshace lo último que se hizo"],["Paréntesis equilibrados","Pila de aperturas pendientes"],["Procesar tareas por orden de llegada","Cola: el primero que llega, el primero que sale"],["Recorrido en anchura (BFS)","Cola de nodos por visitar"],["Recorrido en profundidad iterativo (DFS)","Pila en lugar de recursión"]],
  why:"La pila de llamadas de un programa es literalmente una pila."},
 {t:"opcion", p:"¿Qué devuelve el último <code>pop()</code>?", c:`<div class="termbox">p = []
p.append(5); p.append(8); p.pop(); p.append(3)
p.pop()</div>`,
  ops:["5","8","3","None"],
  ok:2, why:"Tras sacar el 8, entra el 3, que es el último en entrar."},
 {t:"codigo", p:"Imprime <code>true</code> si los paréntesis, corchetes y llaves de la línea están equilibrados, o <code>false</code>",
  lenguaje:"py",
  c:`<p>La línea puede contener otros caracteres, que se ignoran.</p>`,
  plantilla:"s = input()\n",
  pruebas:[{entrada:"{[()()]}", salida:"true"},{entrada:"([)]", salida:"false"},{entrada:"(()", salida:"false", oculta:true},{entrada:")(", salida:"false", oculta:true},{entrada:"f(a[1]) + {x}", salida:"true", oculta:true}],
  pista:"Apila las aperturas; al ver un cierre, la pila no puede estar vacía y su cima debe ser la apertura correspondiente. Al final, la pila debe quedar vacía.",
  solucion:`s = input()
pareja = {")": "(", "]": "[", "}": "{"}
pila = []
ok = True
for c in s:
    if c in "([{":
        pila.append(c)
    elif c in pareja:
        if not pila or pila.pop() != pareja[c]:
            ok = False
            break
print("true" if ok and not pila else "false")`,
  why:"O(n) y O(n) de espacio. Los casos ocultos son justo los dos errores típicos y un texto con otros caracteres."},
 {t:"vf", p:"En Java moderno se recomienda ArrayDeque en lugar de la clase Stack.",
  ok:true, why:"Stack hereda de Vector, que está sincronizado y es más lento; ArrayDeque es la opción recomendada por la propia documentación."},
 {t:"opcion", p:"¿Qué complejidad tiene <code>deque.popleft()</code> frente a <code>list.pop(0)</code>?",
  ops:["Ambas O(1)","popleft es O(1); pop(0) es O(n) porque desplaza todos los elementos","Ambas O(n)","popleft es O(log n)"],
  ok:1, why:"deque es una lista doblemente enlazada de bloques: los dos extremos son baratos."}
]},

{
id:"al4n4",
titulo:"Pilas para expresiones y diseño",
claves:["Evaluar notación polaca inversa con una pila de operandos","Pila con mínimo en O(1): guardar el mínimo junto a cada elemento","Cola con dos pilas: O(1) amortizado por operación"],
pasos:[
 {t:"info", eti:"Expresiones", h:"Notación polaca inversa (RPN)",
  c:`<p>En RPN el operador va detrás: <code>3 4 + 2 *</code> es (3 + 4) × 2. No necesita paréntesis y se evalúa con una pila:</p>
<div class="dg"><div class="dg-tit">evaluar 3 4 + 2 *</div><div class="dg-flujo"><div class="dg-caja">[3]</div><div class="dg-caja">[3, 4]</div><div class="dg-caja acento">+ → [7]</div><div class="dg-caja">[7, 2]</div><div class="dg-caja ok">* → [14]</div></div></div>
     <p>Al ver un operador se sacan <b>dos</b> operandos: el primero que sale es el <b>derecho</b>. Importa en la resta y la división.</p>`},
 {t:"codigo", p:"Evalúa una expresión en notación polaca inversa con enteros y los operadores <code>+ - * /</code> (la división trunca hacia cero)",
  lenguaje:"py",
  plantilla:"tokens = input().split()\n",
  pruebas:[{entrada:"3 4 + 2 *", salida:"14"},{entrada:"4 13 5 / +", salida:"6"},{entrada:"10 6 9 3 + -11 * / * 17 + 5 +", salida:"22", oculta:true},{entrada:"7 -2 /", salida:"-3", oculta:true}],
  pista:"Si el token es un operador, b = pila.pop(), a = pila.pop() y apila a op b. Para dividir truncando hacia cero: int(a / b).",
  solucion:`tokens = input().split()
pila = []
for t in tokens:
    if t in "+-*/" and len(t) == 1:
        b = pila.pop()
        a = pila.pop()
        if t == "+":
            pila.append(a + b)
        elif t == "-":
            pila.append(a - b)
        elif t == "*":
            pila.append(a * b)
        else:
            pila.append(int(a / b))
    else:
        pila.append(int(t))
print(pila[-1])`,
  why:"Ojo: en Python <code>//</code> redondea hacia abajo (-7 // 2 = -4), mientras que Java y C truncan hacia cero (-3). Y <code>len(t) == 1</code> distingue el operador «-» del número «-11»."},
 {t:"info", eti:"Diseño", h:"Pila con mínimo en O(1)",
  c:`<div class="termbox">class PilaMin:
    def __init__(self):
        self.p = []                       # pares (valor, mínimo hasta aquí)
    def push(self, x):
        m = min(x, self.p[-1][1]) if self.p else x
        self.p.append((x, m))
    def pop(self):
        return self.p.pop()[0]
    def minimo(self):
        return self.p[-1][1]</div>
     <p>Guardar un único «mínimo global» falla al hacer pop del mínimo: no sabrías cuál era el anterior. Guardarlo por nivel lo resuelve.</p>`},
 {t:"codigo", p:"Implementa una pila con mínimo: procesa las órdenes <code>push x</code>, <code>pop</code> y <code>min</code>, e imprime el resultado de cada <code>min</code>",
  lenguaje:"py",
  c:`<p>Primera línea: número de órdenes. Nunca se hace pop ni min con la pila vacía.</p>`,
  plantilla:"n = int(input())\nfor _ in range(n):\n    orden = input().split()\n",
  pruebas:[{entrada:"6\npush 5\npush 3\nmin\npop\nmin\npush 7", salida:"3\n5"},{entrada:"5\npush 2\npush 2\npop\nmin\npush -1", salida:"2"},{entrada:"7\npush 4\npush 1\npush 3\nmin\npop\npop\nmin", salida:"1\n4", oculta:true}],
  pista:"Guarda tuplas (valor, mínimo hasta aquí) en una lista.",
  solucion:`n = int(input())
p = []
for _ in range(n):
    orden = input().split()
    if orden[0] == "push":
        x = int(orden[1])
        p.append((x, min(x, p[-1][1]) if p else x))
    elif orden[0] == "pop":
        p.pop()
    else:
        print(p[-1][1])`,
  why:"Todas las operaciones son O(1). Es una pregunta de diseño muy frecuente porque mide si piensas en el estado que necesitas."},
 {t:"info", eti:"Diseño", h:"Cola con dos pilas",
  c:`<p>Una pila de <b>entrada</b> recibe los <code>push</code>. Para sacar, si la pila de <b>salida</b> está vacía se vuelca en ella toda la de entrada (invirtiendo el orden) y se saca de ahí.</p>
     <p>Cada elemento se mueve de una pila a otra <b>una sola vez</b>: O(1) amortizado por operación, aunque un volcado concreto sea O(n).</p>`},
 {t:"opcion", p:"En la cola con dos pilas, ¿cuándo se vuelca la pila de entrada en la de salida?",
  ops:["En cada push","Solo cuando hay que sacar y la pila de salida está vacía","En cada pop, siempre","Nunca"],
  ok:1, why:"Si volcases con la salida no vacía, romperías el orden FIFO."},
 {t:"vf", p:"En la pila con mínimo, basta con guardar una variable con el mínimo global.",
  ok:false, why:"Al sacar el mínimo no sabrías cuál era el anterior sin recorrer toda la pila."}
]},

{
id:"al4l2",
titulo:"Pilas y colas monótonas",
claves:["Una pila que se mantiene ordenada (creciente o decreciente)","Resuelve «el siguiente mayor» o «días hasta una temperatura más alta» en O(n)","Una deque monótona da el máximo de cada ventana deslizante en O(n)"],
pasos:[
 {t:"info", eti:"Patrón avanzado", h:"Siguiente elemento mayor",
  c:`<div class="termbox"># para cada día, cuántos días faltan para una temperatura mayor (0 si ninguno)
def dias_hasta_mas_calor(t):
    res = [0] * len(t)
    pila = []                        # índices con temperaturas decrecientes
    for i, x in enumerate(t):
        while pila and x &gt; t[pila[-1]]:
            j = pila.pop()
            res[j] = i - j           # i es el siguiente día más cálido de j
        pila.append(i)
    return res</div>
     <p>La solución directa (para cada día, buscar hacia delante) es O(n²). La pila guarda los días que aún <b>esperan</b> uno más cálido; cuando llega, se resuelven todos los que supera de golpe.</p>`},
 {t:"codigo", p:"Temperaturas diarias: para cada día, imprime cuántos días hay que esperar a una temperatura estrictamente mayor (0 si no llega)",
  lenguaje:"py",
  plantilla:"t = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"73 74 75 71 69 72 76 73", salida:"1 1 4 2 1 1 0 0"},{entrada:"30 40 50 60", salida:"1 1 1 0"},{entrada:"30 60 90", salida:"1 1 0", oculta:true},{entrada:"50 50 50", salida:"0 0 0", oculta:true}],
  pista:"Pila de índices; mientras la temperatura actual supere la de la cima, desapila y calcula la distancia.",
  solucion:`t = [int(x) for x in input().split()]
res = [0] * len(t)
pila = []
for i, x in enumerate(t):
    while pila and x > t[pila[-1]]:
        j = pila.pop()
        res[j] = i - j
    pila.append(i)
print(*res)`,
  why:"Con temperaturas iguales no se desapila (&gt; estricto): por eso 50 50 50 da todo ceros."},
 {t:"opcion", p:"¿Qué complejidad tiene la solución con pila monótona?",
  ops:["O(n²)","O(n): cada índice se apila y desapila como mucho una vez","O(n log n)","O(1)"],
  ok:1, why:"Otra vez análisis amortizado: el while interior suma como mucho n vueltas en total."},
 {t:"info", eti:"Deque monótona", h:"Máximo de cada ventana",
  c:`<div class="termbox">from collections import deque

def maximos_ventana(a, k):
    dq = deque()                 # índices con valores decrecientes
    res = []
    for i, x in enumerate(a):
        while dq and a[dq[-1]] &lt;= x:
            dq.pop()             # ya nunca serán el máximo: x es mayor y dura más
        dq.append(i)
        if dq[0] &lt;= i - k:
            dq.popleft()         # el máximo se salió de la ventana
        if i &gt;= k - 1:
            res.append(a[dq[0]])
    return res</div>
     <p>El frente de la deque siempre es el máximo de la ventana. Con un montículo sería O(n log n); con la deque, O(n).</p>`},
 {t:"codigo", p:"Imprime el máximo de cada ventana de tamaño <code>k</code>",
  lenguaje:"py",
  c:`<p>Primera línea: k. Segunda: los números.</p>`,
  plantilla:"from collections import deque\nk = int(input())\na = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"3\n1 3 -1 -3 5 3 6 7", salida:"3 3 5 5 6 7"},{entrada:"1\n4 2", salida:"4 2"},{entrada:"2\n9 8 7 6", salida:"9 8 7", oculta:true},{entrada:"3\n1 1 1 1", salida:"1 1", oculta:true}],
  pista:"Deque de índices con valores decrecientes: quita por detrás los menores o iguales al nuevo, y por delante el que se sale de la ventana.",
  solucion:`from collections import deque
k = int(input())
a = [int(x) for x in input().split()]
dq = deque()
res = []
for i, x in enumerate(a):
    while dq and a[dq[-1]] <= x:
        dq.pop()
    dq.append(i)
    if dq[0] <= i - k:
        dq.popleft()
    if i >= k - 1:
        res.append(a[dq[0]])
print(*res)`,
  why:"Un «difícil» clásico. Cada índice entra y sale de la deque una vez: O(n)."},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["Siguiente elemento mayor","Pila monótona decreciente"],["Rectángulo más grande en un histograma","Pila monótona creciente"],["Máximo de cada ventana de tamaño k","Deque monótona"],["Validar paréntesis","Pila simple"]],
  why:"Son problemas de nivel medio y difícil habituales en entrevistas."},
 {t:"vf", p:"En la deque monótona para máximos, un elemento menor que otro que llegó después puede descartarse para siempre.",
  ok:true, why:"El que llegó después es mayor y además saldrá de la ventana más tarde: el menor ya nunca será el máximo."}
]},

{
id:"al4l3",
titulo:"Listas enlazadas",
claves:["Nodos con un valor y una referencia al siguiente","Insertar o borrar conociendo el nodo es O(1); acceder por posición es O(n)","Técnicas: nodo ficticio, invertir, lento y rápido"],
pasos:[
 {t:"info", eti:"Nodos encadenados", h:"Cómo es una lista enlazada",
  c:`<div class="dg"><div class="dg-tit">lista 1 → 2 → 3</div>
<svg viewBox="0 0 330 70" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Tres nodos con valores 1, 2 y 3; cada uno apunta al siguiente y el último a None">
<defs><marker id="fl-al5-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>
<rect x="10" y="18" width="60" height="34" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="30" y="40" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">1</text><line x1="50" y1="18" x2="50" y2="52" stroke="var(--line-2)" stroke-width="1.5"/>
<line x1="60" y1="35" x2="98" y2="35" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-al5-1)"/>
<rect x="100" y="18" width="60" height="34" rx="6" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/><text x="120" y="40" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">2</text><line x1="140" y1="18" x2="140" y2="52" stroke="var(--line-2)" stroke-width="1.5"/>
<line x1="150" y1="35" x2="188" y2="35" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-al5-1)"/>
<rect x="190" y="18" width="60" height="34" rx="6" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/><text x="210" y="40" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">3</text><line x1="230" y1="18" x2="230" y2="52" stroke="var(--line-2)" stroke-width="1.5"/>
<line x1="240" y1="35" x2="268" y2="35" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-al5-1)"/>
<text x="298" y="40" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink-2)">None</text>
</svg></div>
<div class="termbox">class Nodo:
    def __init__(self, val, sig=None):
        self.val = val
        self.sig = sig

def invertir(cabeza):             # O(n) tiempo, O(1) espacio
    anterior, actual = None, cabeza
    while actual:
        siguiente = actual.sig    # 1. guardar el resto
        actual.sig = anterior     # 2. girar el enlace
        anterior = actual         # 3. avanzar anterior
        actual = siguiente        # 4. avanzar actual
    return anterior</div>`},
 {t:"orden", p:"Ordena las operaciones dentro del bucle al invertir una lista",
  items:["Guardar la referencia al siguiente nodo","Hacer que el nodo actual apunte al anterior","Mover anterior al nodo actual","Mover actual al siguiente guardado"],
  why:"Si no guardas el siguiente primero, pierdes el resto de la lista."},
 {t:"codigo", p:"Invierte la lista enlazada construida con los números de la entrada e imprime sus valores recorriéndola desde la nueva cabeza",
  lenguaje:"py",
  c:`<p>La plantilla construye la lista por ti. Invierte los enlaces (no vale imprimir la entrada al revés).</p>`,
  plantilla:`class Nodo:
    def __init__(self, val, sig=None):
        self.val = val
        self.sig = sig

cabeza = None
for x in reversed(input().split()):
    cabeza = Nodo(int(x), cabeza)

def invertir(cabeza):
    # tu código
    return cabeza

cabeza = invertir(cabeza)
res = []
while cabeza:
    res.append(cabeza.val)
    cabeza = cabeza.sig
print(*res)
`,
  pruebas:[{entrada:"1 2 3 4 5", salida:"5 4 3 2 1"},{entrada:"1 2", salida:"2 1"},{entrada:"7", salida:"7", oculta:true}],
  pista:"anterior = None, actual = cabeza; en el bucle: guarda actual.sig, apunta actual.sig a anterior y avanza los dos.",
  solucion:`class Nodo:
    def __init__(self, val, sig=None):
        self.val = val
        self.sig = sig

cabeza = None
for x in reversed(input().split()):
    cabeza = Nodo(int(x), cabeza)

def invertir(cabeza):
    anterior, actual = None, cabeza
    while actual:
        siguiente = actual.sig
        actual.sig = anterior
        anterior = actual
        actual = siguiente
    return anterior

cabeza = invertir(cabeza)
res = []
while cabeza:
    res.append(cabeza.val)
    cabeza = cabeza.sig
print(*res)`,
  why:"Es probablemente el ejercicio de listas más preguntado. Debes poder escribirlo sin pensar, y también en versión recursiva."},
 {t:"info", eti:"Truco", h:"El nodo ficticio",
  c:`<div class="termbox">def fusionar(a, b):                # dos listas ordenadas → una ordenada
    ficticio = cola = Nodo(0)
    while a and b:
        if a.val &lt;= b.val:
            cola.sig, a = a, a.sig
        else:
            cola.sig, b = b, b.sig
        cola = cola.sig
    cola.sig = a or b               # enganchar lo que sobre
    return ficticio.sig</div>
     <p>Sin el nodo ficticio tendrías que tratar aparte «la lista resultado aún está vacía». Úsalo siempre que la cabeza pueda cambiar.</p>`},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["Detectar un ciclo","Lento y rápido: si se encuentran, hay ciclo"],["Encontrar el nodo del medio","Lento avanza 1 y rápido 2"],["Fusionar dos listas ordenadas","Nodo ficticio y comparar cabezas"],["Borrar el n-ésimo desde el final","Adelantar un puntero n posiciones"]],
  why:"El nodo ficticio evita casos especiales al modificar la cabeza."},
 {t:"vf", p:"Acceder al elemento en la posición k de una lista enlazada es O(1).",
  ok:false, why:"Hay que recorrer desde la cabeza: O(k). A cambio, insertar tras un nodo conocido es O(1)."},
 {t:"opcion", p:"¿Cuándo es preferible una lista enlazada a un array dinámico?",
  ops:["Siempre, es más moderna","Cuando hay muchas inserciones y borrados en posiciones ya localizadas (por ejemplo, en una caché LRU)","Cuando necesitas acceso aleatorio rápido","Cuando quieres ahorrar memoria"],
  ok:1, why:"En la práctica los arrays ganan casi siempre por localidad de caché; las listas brillan cuando ya tienes el nodo y hay que moverlo o quitarlo en O(1)."}
]},

{
id:"al4n5",
titulo:"Listas enlazadas II y caché LRU",
claves:["Floyd: tortuga y liebre detectan un ciclo con O(1) de memoria","Dos punteros separados n posiciones para borrar el n-ésimo desde el final","LRU = diccionario + lista doblemente enlazada (OrderedDict en Python)"],
pasos:[
 {t:"info", eti:"Tortuga y liebre", h:"Detectar ciclos",
  c:`<div class="termbox">def tiene_ciclo(cabeza):
    lento = rapido = cabeza
    while rapido and rapido.sig:
        lento = lento.sig
        rapido = rapido.sig.sig
        if lento is rapido:
            return True
    return False</div>
     <p>Si hay ciclo, dentro de él la liebre se acerca a la tortuga un nodo por paso: tarde o temprano la alcanza. Con un <code>set</code> de nodos visitados también funciona, pero usa O(n) de memoria.</p>
     <p>Extra: tras encontrarse, si pones un puntero en la cabeza y avanzas los dos de uno en uno, se cruzan en el <b>inicio</b> del ciclo.</p>`},
 {t:"codigo", p:"Detecta si hay ciclo: la entrada da los valores y, en la segunda línea, la posición a la que apunta el último nodo (-1 si a ninguna). Imprime <code>ciclo</code> o <code>sin ciclo</code>",
  lenguaje:"py",
  c:`<p>Resuélvelo con dos punteros, sin guardar nodos visitados.</p>`,
  plantilla:`class Nodo:
    def __init__(self, val):
        self.val = val
        self.sig = None

vals = input().split()
pos = int(input())
nodos = [Nodo(int(v)) for v in vals]
for a, b in zip(nodos, nodos[1:]):
    a.sig = b
if pos >= 0:
    nodos[-1].sig = nodos[pos]
cabeza = nodos[0]
# detecta el ciclo
`,
  pruebas:[{entrada:"3 2 0 -4\n1", salida:"ciclo"},{entrada:"1 2\n-1", salida:"sin ciclo"},{entrada:"1\n0", salida:"ciclo", oculta:true},{entrada:"1 2 3 4 5\n-1", salida:"sin ciclo", oculta:true}],
  pista:"lento avanza uno y rapido dos mientras rapido y rapido.sig existan; si se encuentran (is), hay ciclo.",
  solucion:`class Nodo:
    def __init__(self, val):
        self.val = val
        self.sig = None

vals = input().split()
pos = int(input())
nodos = [Nodo(int(v)) for v in vals]
for a, b in zip(nodos, nodos[1:]):
    a.sig = b
if pos >= 0:
    nodos[-1].sig = nodos[pos]
cabeza = nodos[0]
lento = rapido = cabeza
hay = False
while rapido and rapido.sig:
    lento = lento.sig
    rapido = rapido.sig.sig
    if lento is rapido:
        hay = True
        break
print("ciclo" if hay else "sin ciclo")`,
  why:"O(n) de tiempo y O(1) de memoria. El caso de un solo nodo que se apunta a sí mismo es el borde más fácil de olvidar."},
 {t:"info", eti:"Diseño clásico", h:"Caché LRU",
  c:`<p>Una caché LRU de capacidad k expulsa el elemento <b>usado hace más tiempo</b>. <code>get</code> y <code>put</code> deben ser O(1):</p>
<div class="dg"><div class="dg-tit">las dos piezas de una LRU</div><div class="dg-cols"><div class="dg-col"><div class="dg-col-tit">diccionario</div><div class="dg-caja acento doble">clave → nodo<small>encontrar en O(1)</small></div></div><div class="dg-col"><div class="dg-col-tit">lista doblemente enlazada</div><div class="dg-flujo"><div class="dg-caja aviso">menos reciente</div><div class="dg-caja">…</div><div class="dg-caja ok">más reciente</div></div></div></div></div>
<div class="termbox">from collections import OrderedDict

class LRU:
    def __init__(self, cap):
        self.cap, self.d = cap, OrderedDict()
    def get(self, k):
        if k not in self.d:
            return -1
        self.d.move_to_end(k)            # ahora es el más reciente
        return self.d[k]
    def put(self, k, v):
        self.d[k] = v
        self.d.move_to_end(k)
        if len(self.d) &gt; self.cap:
            self.d.popitem(last=False)   # expulsa el menos reciente</div>
     <p>En una entrevista pueden pedirte que no uses OrderedDict y montes tú la lista doble con nodos ficticios en la cabeza y la cola.</p>`},
 {t:"codigo", p:"Simula una caché LRU: procesa <code>put k v</code> y <code>get k</code>, e imprime el resultado de cada <code>get</code> (-1 si no está)",
  lenguaje:"py",
  c:`<p>Primera línea: capacidad y número de órdenes.</p>`,
  plantilla:"from collections import OrderedDict\ncap, n = map(int, input().split())\n",
  pruebas:[{entrada:"2 9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4", salida:"1\n-1\n-1\n3\n4"},{entrada:"1 4\nput 5 50\nput 5 55\nget 5\nget 6", salida:"55\n-1"},{entrada:"2 5\nput 1 1\nput 2 2\nput 1 10\nput 3 3\nget 2", salida:"-1", oculta:true}],
  pista:"OrderedDict: move_to_end(k) al usar una clave y popitem(last=False) cuando se pasa de capacidad.",
  solucion:`from collections import OrderedDict
cap, n = map(int, input().split())
d = OrderedDict()
for _ in range(n):
    orden = input().split()
    k = int(orden[1])
    if orden[0] == "get":
        if k in d:
            d.move_to_end(k)
            print(d[k])
        else:
            print(-1)
    else:
        d[k] = int(orden[2])
        d.move_to_end(k)
        if len(d) > cap:
            d.popitem(last=False)`,
  why:"El caso oculto comprueba que un put sobre una clave existente también la convierte en la más reciente: por eso se expulsa la 2 y no la 1."},
 {t:"opcion", p:"¿Por qué una LRU usa lista <b>doblemente</b> enlazada y no simple?",
  ops:["Por costumbre","Para quitar un nodo de en medio en O(1) necesitas acceder a su anterior","Porque ocupa menos memoria","Para poder ordenarla"],
  ok:1, why:"Con el nodo en la mano (gracias al diccionario), la lista doble permite desengancharlo en O(1)."},
 {t:"par", p:"Empareja cada problema de listas con su truco",
  pares:[["Inicio del ciclo","Tras el encuentro, un puntero desde la cabeza y ambos de uno en uno"],["Borrar el n-ésimo desde el final","Adelantar el rápido n nodos y avanzar ambos"],["¿Es la lista un palíndromo?","Medio con lento y rápido, invertir la segunda mitad y comparar"],["Caché LRU en O(1)","Diccionario más lista doblemente enlazada"]],
  why:"Todos combinan técnicas ya vistas: punteros a distinta velocidad, invertir y hashing."}
]}

]});
