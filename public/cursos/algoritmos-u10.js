window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Montículos y tries",
resumen: "Colas de prioridad con heapq, el patrón top K, dos montículos para la mediana, fusionar K listas y árboles de prefijos para autocompletar",
nivel: "Avanzado",
color: "#72af40",
lecciones: [

{
id:"al6l3",
titulo:"Montículos y top K",
claves:["Un montículo (heap) da el mínimo en O(1) e inserta o extrae en O(log n)","heapq de Python es un montículo mínimo sobre una lista; PriorityQueue en Java","Top K: un montículo de tamaño K recorriendo los datos una vez: O(n log k)"],
pasos:[
 {t:"info", eti:"Siempre el más urgente", h:"Cómo es un montículo",
  c:`<p>Un montículo mínimo es un árbol binario <b>completo</b> donde cada padre es ≤ que sus hijos. Se guarda en un array: los hijos de <code>i</code> están en <code>2i + 1</code> y <code>2i + 2</code>.</p>
<div class="dg"><div class="dg-tit">montículo mínimo [1, 3, 2, 7, 4, 5]</div>
<svg viewBox="0 0 320 160" width="100%" style="max-width:400px;display:block;margin:auto" role="img" aria-label="Raíz 1 con hijos 3 y 2; 3 tiene hijos 7 y 4; 2 tiene hijo 5">
<line x1="160" y1="28" x2="90" y2="80" stroke="var(--line-2)" stroke-width="2"/><line x1="160" y1="28" x2="230" y2="80" stroke="var(--line-2)" stroke-width="2"/>
<line x1="90" y1="80" x2="50" y2="132" stroke="var(--line-2)" stroke-width="2"/><line x1="90" y1="80" x2="130" y2="132" stroke="var(--line-2)" stroke-width="2"/><line x1="230" y1="80" x2="190" y2="132" stroke="var(--line-2)" stroke-width="2"/>
<circle cx="160" cy="28" r="18" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="160" y="33" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">1</text>
<circle cx="90" cy="80" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="90" y="85" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">3</text>
<circle cx="230" cy="80" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="230" y="85" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">2</text>
<circle cx="50" cy="132" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="50" y="137" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">7</text>
<circle cx="130" cy="132" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="130" y="137" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">4</text>
<circle cx="190" cy="132" r="18" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="190" y="137" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">5</text>
</svg></div>
     <p>Insertar: se pone al final y <b>sube</b> intercambiándose con su padre mientras sea menor. Extraer el mínimo: el último pasa a la raíz y <b>baja</b>. Ambas O(log n). Construirlo a partir de una lista (<code>heapify</code>) es O(n).</p>`},
 {t:"info", eti:"heapq", h:"Montículos en Python",
  c:`<div class="termbox">import heapq
h = []
heapq.heappush(h, 5); heapq.heappush(h, 1); heapq.heappush(h, 3)
heapq.heappop(h)            # 1
h[0]                        # 3: consultar el mínimo sin sacarlo

heapq.heapify(lista)        # O(n), en el sitio
heapq.heappush(h, -x)       # montículo MÁXIMO: guarda los valores negados
heapq.heappush(h, (prioridad, orden, tarea))   # tuplas: ordena por el primer campo

heapq.nlargest(3, nums)     # los 3 mayores (usa un montículo de tamaño 3)</div>
     <p>En Java: <code>new PriorityQueue&lt;&gt;()</code> (mínimo) y <code>new PriorityQueue&lt;&gt;(Comparator.reverseOrder())</code> (máximo).</p>`},
 {t:"codigo", p:"Imprime los k números más grandes en orden descendente usando un montículo mínimo de tamaño k",
  lenguaje:"py",
  c:`<p>Primera línea: k. Segunda: los números. No ordenes la lista completa.</p>`,
  plantilla:"import heapq\nk = int(input())\nnums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"3\n5 1 9 3 7 2", salida:"9 7 5"},{entrada:"1\n-3 -1 -2", salida:"-1"},{entrada:"2\n4 4 4", salida:"4 4", oculta:true}],
  pista:"heappush cada número y, si el montículo pasa de k, heappop (saca el menor). Al final, ordena esos k de mayor a menor.",
  solucion:`import heapq
k = int(input())
nums = [int(x) for x in input().split()]
h = []
for x in nums:
    heapq.heappush(h, x)
    if len(h) > k:
        heapq.heappop(h)
print(*sorted(h, reverse=True))`,
  why:"O(n log k) y O(k) de memoria: funciona aunque los datos lleguen en streaming y no quepan en memoria. Ordenar k elementos al final es despreciable."},
 {t:"codigo", p:"Los k elementos más frecuentes: imprímelos de más a menos frecuente (a igual frecuencia, el menor primero)",
  lenguaje:"py",
  c:`<p>Primera línea: k. Segunda: los números.</p>`,
  plantilla:"import heapq\nfrom collections import Counter\nk = int(input())\nnums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"2\n1 1 1 2 2 3", salida:"1 2"},{entrada:"1\n1", salida:"1"},{entrada:"2\n4 4 5 5 6 6 6", salida:"6 4", oculta:true}],
  pista:"Cuenta con Counter y usa heapq.nsmallest(k, f, key=lambda x: (-f[x], x)).",
  solucion:`import heapq
from collections import Counter
k = int(input())
nums = [int(x) for x in input().split()]
f = Counter(nums)
print(*heapq.nsmallest(k, f, key=lambda x: (-f[x], x)))`,
  why:"O(n log k). También se puede en O(n) con bucket sort por frecuencia, como viste en la unidad de ordenación."},
 {t:"par", p:"Empareja cada problema con el uso del montículo",
  pares:[["Los K mayores elementos","Montículo mínimo de tamaño K"],["Fusionar K listas ordenadas","Montículo con la cabeza de cada lista"],["Mediana de un flujo de números","Dos montículos: uno máximo y uno mínimo"],["Planificar tareas por prioridad","Cola de prioridad"],["Camino más corto con pesos (Dijkstra)","Montículo por distancia"]],
  why:"Top K con montículo es O(n log k), mejor que ordenar todo (O(n log n)) cuando k es pequeño."},
 {t:"opcion", p:"Para obtener los 10 números más grandes de mil millones, ¿qué es más eficiente?",
  ops:["Ordenar todo y coger los 10 últimos","Un montículo mínimo de tamaño 10 recorriendo los datos una vez","Un conjunto","Dos bucles anidados"],
  ok:1, why:"Memoria O(10) y tiempo O(n log 10): se puede hacer incluso en streaming."},
 {t:"vf", p:"<code>heapq</code> ofrece directamente un montículo máximo con un parámetro.",
  ok:false, why:"Solo hay montículo mínimo en la API pública. El truco es guardar valores negados (o tuplas con la prioridad negada)."}
]},

{
id:"al10n1",
titulo:"Dos montículos y fusionar K listas",
claves:["Mediana en streaming: un máximo con la mitad baja y un mínimo con la alta, equilibrados","Fusionar K listas ordenadas: montículo con la cabeza de cada una, O(N log K)","Guarda tuplas (valor, índice) para desempatar y saber de dónde viene cada elemento"],
pasos:[
 {t:"info", eti:"Mediana en vivo", h:"Dos montículos",
  c:`<div class="dg"><div class="dg-tit">tras recibir 5, 15, 1, 3, 8</div><div class="dg-cols"><div class="dg-col"><div class="dg-col-tit">bajos (máximo)</div><div class="dg-caja acento doble">1, 3, 5<small>cima: 5</small></div></div><div class="dg-col"><div class="dg-col-tit">altos (mínimo)</div><div class="dg-caja ok doble">8, 15<small>cima: 8</small></div></div></div><div class="dg-nota arriba">impares: la mediana es la cima de bajos (5); pares: la media de las dos cimas</div></div>
<div class="termbox">bajos, altos = [], []          # bajos guarda negados (montículo máximo)
def añadir(x):
    heapq.heappush(bajos, -x)
    heapq.heappush(altos, -heapq.heappop(bajos))  # el mayor de bajos pasa a altos
    if len(altos) &gt; len(bajos):                    # bajos tiene igual o uno más
        heapq.heappush(bajos, -heapq.heappop(altos))
def mediana():
    if len(bajos) &gt; len(altos): return -bajos[0]
    return (-bajos[0] + altos[0]) / 2</div>`},
 {t:"codigo", p:"Mediana de un flujo: tras leer cada número, imprime la mediana de los leídos hasta ese momento (con un decimal si es media de dos: usa el formato <code>.1f</code> siempre)",
  lenguaje:"py",
  plantilla:"import heapq\nnums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"5 15 1 3", salida:"5.0\n10.0\n5.0\n4.0"},{entrada:"2 2", salida:"2.0\n2.0"},{entrada:"1 2 3 4 5", salida:"1.0\n1.5\n2.0\n2.5\n3.0", oculta:true}],
  pista:"Sigue la plantilla de los dos montículos; imprime con print(f\"{m:.1f}\").",
  solucion:`import heapq
nums = [int(x) for x in input().split()]
bajos, altos = [], []
for x in nums:
    heapq.heappush(bajos, -x)
    heapq.heappush(altos, -heapq.heappop(bajos))
    if len(altos) > len(bajos):
        heapq.heappush(bajos, -heapq.heappop(altos))
    if len(bajos) > len(altos):
        m = -bajos[0]
    else:
        m = (-bajos[0] + altos[0]) / 2
    print(f"{m:.1f}")`,
  why:"Cada número cuesta O(log n) y la mediana O(1). Reordenar la lista tras cada número sería O(n log n) por número."},
 {t:"info", eti:"K fuentes", h:"Fusionar K listas ordenadas",
  c:`<div class="termbox">def fusionar(listas):
    h = [(l[0], i, 0) for i, l in enumerate(listas) if l]   # (valor, lista, posición)
    heapq.heapify(h)
    res = []
    while h:
        v, i, j = heapq.heappop(h)
        res.append(v)
        if j + 1 &lt; len(listas[i]):
            heapq.heappush(h, (listas[i][j + 1], i, j + 1))
    return res</div>
     <p>El montículo nunca tiene más de K elementos: O(N log K) para N elementos en total. Es cómo las bases de datos fusionan ficheros ordenados (merge de LSM trees) o cómo se hace una ordenación externa. En Python: <code>heapq.merge(*listas)</code>.</p>`},
 {t:"codigo", p:"Fusiona K listas ordenadas en una sola lista ordenada usando un montículo",
  lenguaje:"py",
  c:`<p>Primera línea: K. Después, K líneas con una lista ordenada cada una (puede haber listas vacías, como líneas en blanco).</p>`,
  plantilla:"import heapq\nk = int(input())\nlistas = [[int(x) for x in input().split()] for _ in range(k)]\n",
  pruebas:[{entrada:"3\n1 4 5\n1 3 4\n2 6", salida:"1 1 2 3 4 4 5 6"},{entrada:"2\n\n0", salida:"0"},{entrada:"1\n-3 -1 7", salida:"-3 -1 7", oculta:true}],
  pista:"Mete (primer valor, índice de lista, 0) de cada lista no vacía; al sacar, mete el siguiente de esa lista.",
  solucion:`import heapq
k = int(input())
listas = [[int(x) for x in input().split()] for _ in range(k)]
h = [(l[0], i, 0) for i, l in enumerate(listas) if l]
heapq.heapify(h)
res = []
while h:
    v, i, j = heapq.heappop(h)
    res.append(v)
    if j + 1 < len(listas[i]):
        heapq.heappush(h, (listas[i][j + 1], i, j + 1))
print(*res)`,
  why:"El índice de lista en la tupla desempata valores iguales, así que Python nunca tiene que comparar otra cosa que números."},
 {t:"opcion", p:"¿Qué complejidad tiene fusionar K listas con N elementos en total usando un montículo?",
  ops:["O(N · K)","O(N log K)","O(N log N)","O(K log N)"],
  ok:1, why:"Cada elemento entra y sale del montículo una vez, y el montículo tiene como mucho K elementos."},
 {t:"vf", p:"En la mediana con dos montículos, todos los elementos del montículo de bajos son ≤ que todos los de altos.",
  ok:true, why:"Esa invariante (más el equilibrio de tamaños) es la que hace que las cimas sean los elementos centrales."},
 {t:"opcion", p:"Metes tuplas <code>(prioridad, tarea)</code> en heapq y, con dos prioridades iguales, salta un error. ¿Por qué?",
  ops:["heapq no admite tuplas","Al empatar la prioridad, Python compara las tareas, y si son objetos no comparables falla; añade un contador intermedio (prioridad, n, tarea)","Por usar prioridades negativas","Porque hay que usar listas"],
  ok:1, why:"Un contador creciente como segundo campo desempata y además da orden FIFO entre iguales."}
]},

{
id:"al10n2",
titulo:"Tries: árboles de prefijos",
claves:["Cada nodo es un carácter; el camino desde la raíz forma un prefijo","Insertar y buscar cuestan O(longitud de la palabra), sin importar cuántas haya","Autocompletar, correctores y búsqueda de muchas palabras a la vez"],
pasos:[
 {t:"info", eti:"Prefijos compartidos", h:"Cómo es un trie",
  c:`<div class="dg"><div class="dg-tit">trie con «casa», «caso», «cama» y «sol»</div><div class="dg dg-arbol">
<div class="rama" style="--n:0"><span class="nom carpeta">(raíz)</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">c</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">a</span><span class="coment">prefijo «ca»: 3 palabras</span></div>
<div class="rama" style="--n:3"><span class="nom carpeta">s</span></div>
<div class="rama" style="--n:4"><span class="nom">a ●</span><span class="coment">fin de «casa»</span></div>
<div class="rama" style="--n:4"><span class="nom">o ●</span><span class="coment">fin de «caso»</span></div>
<div class="rama" style="--n:3"><span class="nom carpeta">m</span></div>
<div class="rama" style="--n:4"><span class="nom">a ●</span><span class="coment">fin de «cama»</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">s</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">o</span></div>
<div class="rama" style="--n:3"><span class="nom">l ●</span><span class="coment">fin de «sol»</span></div>
</div></div>
<div class="termbox">class Trie:
    def __init__(self):
        self.hijos = {}
        self.fin = False

    def insertar(self, palabra):
        n = self
        for c in palabra:
            n = n.hijos.setdefault(c, Trie())
        n.fin = True

    def buscar(self, palabra, prefijo=False):
        n = self
        for c in palabra:
            if c not in n.hijos:
                return False
            n = n.hijos[c]
        return prefijo or n.fin</div>`},
 {t:"codigo", p:"Implementa un trie y procesa órdenes <code>add palabra</code>, <code>find palabra</code> (¿está la palabra completa?) y <code>prefix p</code> (¿alguna palabra empieza por p?), imprimiendo <code>si</code> o <code>no</code> para cada consulta",
  lenguaje:"py",
  plantilla:"n = int(input())\nfor _ in range(n):\n    orden, x = input().split()\n",
  pruebas:[{entrada:"6\nadd casa\nfind casa\nfind cas\nprefix cas\nadd cas\nfind cas", salida:"si\nno\nsi\nsi"},{entrada:"2\nfind a\nprefix a", salida:"no\nno"},{entrada:"4\nadd sol\nprefix sol\nprefix sola\nfind so", salida:"si\nno\nno", oculta:true}],
  pista:"Nodos con un diccionario de hijos y una marca fin. find exige fin; prefix no.",
  solucion:`class Trie:
    def __init__(self):
        self.hijos = {}
        self.fin = False

raiz = Trie()
n = int(input())
for _ in range(n):
    orden, x = input().split()
    if orden == "add":
        nodo = raiz
        for c in x:
            nodo = nodo.hijos.setdefault(c, Trie())
        nodo.fin = True
    else:
        nodo = raiz
        ok = True
        for c in x:
            if c not in nodo.hijos:
                ok = False
                break
            nodo = nodo.hijos[c]
        if orden == "find":
            ok = ok and nodo.fin
        print("si" if ok else "no")`,
  why:"«cas» no es una palabra hasta que se añade, aunque sea prefijo de «casa»: esa es la función de la marca fin."},
 {t:"info", eti:"Uso real", h:"Autocompletar",
  c:`<p>Para sugerir palabras que empiezan por un prefijo: baja por el trie hasta el nodo del prefijo y recorre en profundidad desde ahí recogiendo las palabras (en orden alfabético si visitas los hijos ordenados). Muchos sistemas guardan en cada nodo las k sugerencias más populares para responder en O(longitud del prefijo).</p>
     <p>Frente a un conjunto de cadenas: el set responde «¿está esta palabra?» igual de rápido, pero no «¿qué palabras empiezan por…?» sin recorrerlo todo.</p>`},
 {t:"codigo", p:"Autocompletar: imprime en orden alfabético las palabras del diccionario que empiezan por el prefijo (hasta 3), o <code>ninguna</code>",
  lenguaje:"py",
  c:`<p>Primera línea: las palabras del diccionario. Segunda: el prefijo. Usa un trie y recórrelo visitando los hijos en orden alfabético.</p>`,
  plantilla:"palabras = input().split()\nprefijo = input()\n",
  pruebas:[{entrada:"casa caso cama sol cabra\nca", salida:"cabra cama casa"},{entrada:"casa caso cama sol\ncas", salida:"casa caso"},{entrada:"hola\nx", salida:"ninguna", oculta:true},{entrada:"a ab abc abd\na", salida:"a ab abc", oculta:true}],
  pista:"Baja hasta el nodo del prefijo; después DFS con los hijos en sorted(), añadiendo palabras cuando el nodo tenga fin y parando al llegar a 3.",
  solucion:`class Trie:
    def __init__(self):
        self.hijos = {}
        self.fin = False

raiz = Trie()
palabras = input().split()
prefijo = input()
for p in palabras:
    n = raiz
    for c in p:
        n = n.hijos.setdefault(c, Trie())
    n.fin = True
n = raiz
for c in prefijo:
    n = n.hijos.get(c)
    if n is None:
        break
res = []

def dfs(nodo, actual):
    if len(res) == 3:
        return
    if nodo.fin:
        res.append(actual)
    for c in sorted(nodo.hijos):
        dfs(nodo.hijos[c], actual + c)

if n:
    dfs(n, prefijo)
print(*res if res else ["ninguna"])`,
  why:"Visitar primero el propio nodo y luego los hijos en orden alfabético da orden lexicográfico: «a» antes que «ab»."},
 {t:"opcion", p:"¿Qué complejidad tiene buscar una palabra de longitud L en un trie con un millón de palabras?",
  ops:["O(log n)","O(L): solo depende de la longitud de la palabra","O(n)","O(n · L)"],
  ok:1, why:"Se baja un nivel por carácter. El número de palabras no influye."},
 {t:"par", p:"Empareja cada problema con la estructura",
  pares:[["¿Está esta palabra exacta?","set de cadenas"],["Palabras que empiezan por un prefijo","Trie"],["Buscar muchas palabras en una sopa de letras","Trie + backtracking en la cuadrícula"],["Contar cuántas palabras comparten un prefijo","Trie con un contador en cada nodo"]],
  why:"El trie brilla cuando la pregunta es sobre prefijos o sobre muchas palabras a la vez."},
 {t:"vf", p:"Un trie siempre usa menos memoria que un conjunto con las mismas palabras.",
  ok:false, why:"Ahorra cuando hay muchos prefijos compartidos, pero cada nodo tiene su propio diccionario: con palabras poco parecidas puede usar bastante más."}
]}

]});
