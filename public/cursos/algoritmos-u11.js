window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Grafos: recorridos y conectividad",
resumen: "Representar grafos, BFS para caminos sin pesos, DFS para componentes y ciclos, cuadrículas como grafos, orden topológico y union-find",
nivel: "Experto",
color: "#65a334",
lecciones: [

{
id:"al7l1",
titulo:"Representar y recorrer grafos",
claves:["Un grafo son nodos unidos por aristas; dirigido o no, con pesos o sin ellos","Lista de adyacencia: diccionario (o lista) de nodo a vecinos","BFS (cola) da caminos más cortos sin pesos; DFS (recursión o pila) explora en profundidad"],
pasos:[
 {t:"info", eti:"Relaciones", h:"Grafos por todas partes",
  c:`<p>Redes sociales, rutas, dependencias entre paquetes, enlaces entre páginas, microservicios que se llaman: todo son grafos.</p>
<div class="dg"><div class="dg-tit">grafo no dirigido de ejemplo</div>
<svg viewBox="0 0 320 130" width="100%" style="max-width:420px;display:block;margin:auto" role="img" aria-label="Nodos 0 a 4: 0-1, 0-2, 1-3, 2-3 y 3-4">
<line x1="40" y1="65" x2="120" y2="25" stroke="var(--line-2)" stroke-width="2"/><line x1="40" y1="65" x2="120" y2="105" stroke="var(--line-2)" stroke-width="2"/>
<line x1="120" y1="25" x2="200" y2="65" stroke="var(--line-2)" stroke-width="2"/><line x1="120" y1="105" x2="200" y2="65" stroke="var(--line-2)" stroke-width="2"/><line x1="200" y1="65" x2="280" y2="65" stroke="var(--line-2)" stroke-width="2"/>
<circle cx="40" cy="65" r="17" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="40" y="70" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">0</text>
<circle cx="120" cy="25" r="17" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="120" y="30" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">1</text>
<circle cx="120" cy="105" r="17" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="120" y="110" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">2</text>
<circle cx="200" cy="65" r="17" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="200" y="70" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">3</text>
<circle cx="280" cy="65" r="17" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="280" y="70" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">4</text>
</svg></div>
<div class="termbox">n, aristas = 5, [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4)]
ady = [[] for _ in range(n)]
for u, v in aristas:
    ady[u].append(v)
    ady[v].append(u)          # no dirigido: en los dos sentidos

from collections import deque
def bfs(origen):              # distancia mínima en número de aristas
    dist = [-1] * n
    dist[origen] = 0
    cola = deque([origen])
    while cola:
        u = cola.popleft()
        for v in ady[u]:
            if dist[v] == -1:           # no visitado
                dist[v] = dist[u] + 1
                cola.append(v)
    return dist                          # [0, 1, 1, 2, 3]</div>`},
 {t:"info", eti:"Elegir", h:"Lista o matriz de adyacencia",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">dos representaciones (V nodos, E aristas)</div><table class="dg-tabla"><thead><tr><th></th><th>lista de adyacencia</th><th>matriz de adyacencia</th></tr></thead><tbody>
<tr><td>memoria</td><td>O(V + E)</td><td>O(V²)</td></tr>
<tr><td>¿hay arista u–v?</td><td>O(grado de u)</td><td>O(1)</td></tr>
<tr><td>recorrer vecinos</td><td>O(grado)</td><td>O(V)</td></tr>
<tr><td>cuándo</td><td>grafos dispersos (casi siempre)</td><td>grafos densos y pequeños</td></tr>
</tbody></table></div>
     <p>BFS y DFS con lista de adyacencia cuestan <b>O(V + E)</b>: cada nodo se visita una vez y cada arista se mira una (dirigido) o dos (no dirigido) veces.</p>`},
 {t:"par", p:"Empareja cada algoritmo con su uso",
  pares:[["BFS","Camino más corto sin pesos, recorrido por niveles"],["DFS","Explorar componentes, detectar ciclos, backtracking"],["Conjunto de visitados","No procesar un nodo dos veces (evitar bucles infinitos)"],["Lista de adyacencia","Representación compacta para grafos dispersos"]],
  why:"Olvidar el conjunto de visitados es el bug más habitual con grafos."},
 {t:"codigo", p:"Distancias BFS: imprime la distancia (en aristas) desde el nodo 0 a cada nodo, o -1 si no es alcanzable",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m líneas <code>u v</code> con aristas no dirigidas (nodos de 0 a n-1).</p>`,
  plantilla:"from collections import deque\nn, m = map(int, input().split())\nady = [[] for _ in range(n)]\nfor _ in range(m):\n    u, v = map(int, input().split())\n    ady[u].append(v)\n    ady[v].append(u)\n",
  pruebas:[{entrada:"5 5\n0 1\n0 2\n1 3\n2 3\n3 4", salida:"0 1 1 2 3"},{entrada:"4 1\n0 1", salida:"0 1 -1 -1"},{entrada:"1 0", salida:"0", oculta:true},{entrada:"6 5\n0 5\n5 4\n4 3\n3 2\n2 1", salida:"0 5 4 3 2 1", oculta:true}],
  pista:"dist = [-1] * n, dist[0] = 0, cola con el 0; al descubrir un vecino con dist -1, fija su distancia y encólalo.",
  solucion:`from collections import deque
n, m = map(int, input().split())
ady = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    ady[u].append(v)
    ady[v].append(u)
dist = [-1] * n
dist[0] = 0
cola = deque([0])
while cola:
    u = cola.popleft()
    for v in ady[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            cola.append(v)
print(*dist)`,
  why:"Marcar como visitado al encolar (no al sacar) evita meter el mismo nodo varias veces en la cola."},
 {t:"opcion", p:"¿Por qué BFS encuentra el camino más corto en un grafo sin pesos y DFS no?",
  ops:["DFS también lo encuentra siempre","BFS visita los nodos por orden de distancia (primero todos los de distancia 1, luego 2…); DFS puede llegar antes por un camino largo","BFS usa menos memoria","Porque DFS es recursivo"],
  ok:1, why:"La cola FIFO garantiza el orden por niveles. Con pesos distintos, ni BFS basta: hace falta Dijkstra."},
 {t:"vf", p:"BFS sobre un grafo con lista de adyacencia cuesta O(V + E).",
  ok:true, why:"Cada nodo entra una vez en la cola y cada arista se examina un número constante de veces."}
]},

{
id:"al11n1",
titulo:"Cuadrículas como grafos y BFS multiorigen",
claves:["Cada celda es un nodo con hasta 4 vecinos: no hace falta construir el grafo","BFS multiorigen: meter todos los orígenes en la cola a la vez","Marcar la celda como visitada al encolarla"],
pasos:[
 {t:"info", eti:"Grafos implícitos", h:"Laberintos",
  c:`<div class="termbox">from collections import deque

def pasos_minimos(m, inicio, fin):        # '#' es muro
    F, C = len(m), len(m[0])
    dist = {inicio: 0}
    cola = deque([inicio])
    while cola:
        f, c = cola.popleft()
        if (f, c) == fin:
            return dist[(f, c)]
        for df, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nf, nc = f + df, c + dc
            if 0 &lt;= nf &lt; F and 0 &lt;= nc &lt; C and m[nf][nc] != "#" and (nf, nc) not in dist:
                dist[(nf, nc)] = dist[(f, c)] + 1
                cola.append((nf, nc))
    return -1</div>`},
 {t:"codigo", p:"Laberinto: imprime el número mínimo de pasos de <code>S</code> a <code>E</code> moviéndose en horizontal o vertical sin atravesar <code>#</code>, o -1",
  lenguaje:"py",
  c:`<p>Primera línea: número de filas. Después, las filas.</p>`,
  plantilla:"from collections import deque\nF = int(input())\nm = [input() for _ in range(F)]\n",
  pruebas:[{entrada:"3\nS.#\n..#\n#.E", salida:"4"},{entrada:"2\nS#\n#E", salida:"-1"},{entrada:"1\nSE", salida:"1", oculta:true},{entrada:"4\nS...\n###.\n....\nE###", salida:"9", oculta:true}],
  pista:"Busca S y E recorriendo la cuadrícula; después BFS desde S con un diccionario (o matriz) de distancias.",
  solucion:`from collections import deque
F = int(input())
m = [input() for _ in range(F)]
C = len(m[0])
for f in range(F):
    for c in range(C):
        if m[f][c] == "S":
            ini = (f, c)
        elif m[f][c] == "E":
            fin = (f, c)
dist = {ini: 0}
cola = deque([ini])
res = -1
while cola:
    f, c = cola.popleft()
    if (f, c) == fin:
        res = dist[(f, c)]
        break
    for df, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nf, nc = f + df, c + dc
        if 0 <= nf < F and 0 <= nc < C and m[nf][nc] != "#" and (nf, nc) not in dist:
            dist[(nf, nc)] = dist[(f, c)] + 1
            cola.append((nf, nc))
print(res)`,
  why:"O(F × C): cada celda se encola una vez. El último caso obliga a rodear el muro, un camino largo que DFS no encontraría como mínimo."},
 {t:"info", eti:"Varios orígenes", h:"BFS multiorigen",
  c:`<p>«Naranjas podridas»: cada minuto, las naranjas podridas pudren a sus vecinas frescas. ¿Cuántos minutos hasta que no queden frescas? No hagas un BFS por cada podrida: mételas <b>todas</b> en la cola al principio con distancia 0. El BFS avanza como una onda desde todos los orígenes a la vez.</p>
     <p>Lo mismo sirve para «distancia de cada celda a la salida más cercana» o «distancia al 0 más cercano».</p>`},
 {t:"codigo", p:"Naranjas podridas: 0 vacío, 1 fresca, 2 podrida. Imprime los minutos hasta que no quede ninguna fresca, o -1 si es imposible",
  lenguaje:"py",
  c:`<p>Primera línea: número de filas. Después, las filas con números separados por espacios.</p>`,
  plantilla:"from collections import deque\nF = int(input())\nm = [[int(x) for x in input().split()] for _ in range(F)]\n",
  pruebas:[{entrada:"3\n2 1 1\n1 1 0\n0 1 1", salida:"4"},{entrada:"3\n2 1 1\n0 1 1\n1 0 1", salida:"-1"},{entrada:"1\n0 2", salida:"0", oculta:true},{entrada:"2\n2 1\n1 2", salida:"1", oculta:true}],
  pista:"Encola todas las podridas con minuto 0 y cuenta las frescas. En el BFS, cada fresca alcanzada se pudre y resta 1. Al final, si quedan frescas, -1.",
  solucion:`from collections import deque
F = int(input())
m = [[int(x) for x in input().split()] for _ in range(F)]
C = len(m[0])
cola = deque()
frescas = 0
for f in range(F):
    for c in range(C):
        if m[f][c] == 2:
            cola.append((f, c, 0))
        elif m[f][c] == 1:
            frescas += 1
minutos = 0
while cola:
    f, c, t = cola.popleft()
    minutos = max(minutos, t)
    for df, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nf, nc = f + df, c + dc
        if 0 <= nf < F and 0 <= nc < C and m[nf][nc] == 1:
            m[nf][nc] = 2
            frescas -= 1
            cola.append((nf, nc, t + 1))
print(minutos if frescas == 0 else -1)`,
  why:"Un BFS por naranja podrida sería O((F·C)²). Multiorigen es O(F·C)."},
 {t:"opcion", p:"¿Qué complejidad tiene un BFS sobre una cuadrícula de F × C?",
  ops:["O(F × C): cada celda se visita una vez y tiene como mucho 4 vecinas","O((F × C)²)","O(log(F × C))","O(F + C)"],
  ok:0, why:"V = F·C y E ≤ 4·V, así que O(V + E) = O(F·C)."},
 {t:"vf", p:"En BFS conviene marcar una celda como visitada al sacarla de la cola, no al meterla.",
  ok:false, why:"Si esperas a sacarla, la misma celda puede entrar varias veces en la cola desde vecinas distintas: más trabajo y, en cuadrículas grandes, mucha más memoria."}
]},

{
id:"al11n2",
titulo:"DFS: componentes, ciclos y grafos bipartitos",
claves:["Contar componentes: lanzar un DFS desde cada nodo no visitado","Ciclo en grafo dirigido: DFS con tres colores (blanco, gris, negro)","Bipartito: colorear con dos colores y buscar un conflicto"],
pasos:[
 {t:"info", eti:"Componentes", h:"Islas en una matriz",
  c:`<div class="termbox">def contar_islas(m):
    F, C = len(m), len(m[0])
    def hundir(f, c):
        if not (0 &lt;= f &lt; F and 0 &lt;= c &lt; C) or m[f][c] != "1":
            return
        m[f][c] = "0"                                  # marcar como visitada
        hundir(f + 1, c); hundir(f - 1, c); hundir(f, c + 1); hundir(f, c - 1)
    islas = 0
    for f in range(F):
        for c in range(C):
            if m[f][c] == "1":
                islas += 1
                hundir(f, c)
    return islas</div>
     <div class="nota ojo"><b class="tit">Profundidad</b>En Python, una isla de 10⁵ celdas desborda la recursión. En producción (o si el enunciado es grande) usa una pila explícita o BFS.</div>`},
 {t:"codigo", p:"Cuenta las islas de <code>1</code> conectadas en horizontal o vertical",
  lenguaje:"py",
  c:`<p>Primera línea: número de filas. Después, las filas como cadenas de 0 y 1. Usa una pila explícita en vez de recursión.</p>`,
  plantilla:"F = int(input())\nm = [list(input()) for _ in range(F)]\n",
  pruebas:[{entrada:"4\n11000\n11000\n00100\n00011", salida:"3"},{entrada:"3\n111\n010\n111", salida:"1"},{entrada:"1\n0", salida:"0", oculta:true},{entrada:"3\n101\n010\n101", salida:"5", oculta:true}],
  pista:"Por cada «1», suma una isla, ponlo a «0» y mete sus vecinas en una pila; al sacar cada una, si es «1», márcala y mete sus vecinas.",
  solucion:`F = int(input())
m = [list(input()) for _ in range(F)]
C = len(m[0])
islas = 0
for f in range(F):
    for c in range(C):
        if m[f][c] != "1":
            continue
        islas += 1
        m[f][c] = "0"
        pila = [(f, c)]
        while pila:
            a, b = pila.pop()
            for na, nb in ((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)):
                if 0 <= na < F and 0 <= nb < C and m[na][nb] == "1":
                    m[na][nb] = "0"
                    pila.append((na, nb))
print(islas)`,
  why:"Las diagonales no conectan: por eso el tablero de ajedrez 101/010/101 tiene 5 islas."},
 {t:"info", eti:"Ciclos", h:"Tres colores en grafos dirigidos",
  c:`<div class="dg"><div class="dg-tit">estados de un nodo durante el DFS</div><div class="dg-flujo"><div class="dg-caja">blanco<small>sin visitar</small></div><div class="dg-caja acento">gris<small>en la pila de llamadas</small></div><div class="dg-caja ok">negro<small>terminado</small></div></div></div>
<div class="termbox">def hay_ciclo(n, ady):
    color = [0] * n                  # 0 blanco, 1 gris, 2 negro
    def dfs(u):
        color[u] = 1
        for v in ady[u]:
            if color[v] == 1:        # arista hacia un antepasado: ciclo
                return True
            if color[v] == 0 and dfs(v):
                return True
        color[u] = 2
        return False
    return any(color[u] == 0 and dfs(u) for u in range(n))</div>
     <p>Llegar a un nodo <b>negro</b> no es un ciclo (es otra rama que ya terminó). Con solo «visitado sí/no» confundirías ambos casos.</p>`},
 {t:"codigo", p:"¿Tiene ciclo el grafo dirigido? Imprime <code>ciclo</code> o <code>sin ciclo</code>",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m aristas dirigidas <code>u v</code> (de u a v).</p>`,
  plantilla:"import sys\nsys.setrecursionlimit(10000)\nn, m = map(int, input().split())\nady = [[] for _ in range(n)]\nfor _ in range(m):\n    u, v = map(int, input().split())\n    ady[u].append(v)\n",
  pruebas:[{entrada:"3 3\n0 1\n1 2\n2 0", salida:"ciclo"},{entrada:"4 4\n0 1\n0 2\n1 3\n2 3", salida:"sin ciclo"},{entrada:"2 1\n1 1", salida:"ciclo", oculta:true},{entrada:"5 4\n3 4\n4 2\n0 1\n1 2", salida:"sin ciclo", oculta:true}],
  pista:"DFS con tres colores desde cada nodo blanco; una arista hacia un nodo gris es un ciclo.",
  solucion:`import sys
sys.setrecursionlimit(10000)
n, m = map(int, input().split())
ady = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    ady[u].append(v)
color = [0] * n

def dfs(u):
    color[u] = 1
    for v in ady[u]:
        if color[v] == 1:
            return True
        if color[v] == 0 and dfs(v):
            return True
    color[u] = 2
    return False

print("ciclo" if any(color[u] == 0 and dfs(u) for u in range(n)) else "sin ciclo")`,
  why:"El segundo caso (un rombo 0→1→3 y 0→2→3) no tiene ciclo aunque el 3 se alcance dos veces: con «visitado sí/no» darías un falso positivo."},
 {t:"opcion", p:"¿Cómo compruebas si un grafo es bipartito (sus nodos se pueden dividir en dos grupos sin aristas dentro de un grupo)?",
  ops:["Contando aristas","Coloreando con BFS o DFS en dos colores alternos: si una arista une dos nodos del mismo color, no lo es","Buscando el camino más corto","Con orden topológico"],
  ok:1, why:"Equivale a que no haya ciclos de longitud impar. Aparece como «repartir personas en dos equipos sin enemigos juntos»."},
 {t:"par", p:"Empareja cada pregunta con la técnica",
  pares:[["¿Cuántas componentes conexas hay?","Un DFS o BFS desde cada nodo no visitado"],["¿Hay ciclo en un grafo dirigido?","DFS con tres colores"],["¿Hay ciclo en un grafo no dirigido?","DFS ignorando la arista al padre, o union-find"],["¿Es bipartito?","Colorear con dos colores"]],
  why:"En no dirigidos, volver al padre por la misma arista no es un ciclo: hay que ignorarla."}
]},

{
id:"al7l2",
titulo:"Orden topológico",
claves:["Ordenar tareas con dependencias: cada tarea después de las que necesita","Solo existe si el grafo dirigido no tiene ciclos (DAG)","Kahn: empezar por los nodos con grado de entrada 0 y quitar sus aristas"],
pasos:[
 {t:"info", eti:"Dependencias", h:"El algoritmo de Kahn",
  c:`<div class="dg"><div class="dg-tit">asignaturas con requisitos</div><div class="dg-flujo"><div class="dg-caja acento">Programación</div><div class="dg-caja">Estructuras de datos</div><div class="dg-caja">Algoritmos</div><div class="dg-caja ok">Compiladores</div></div></div>
<div class="termbox">from collections import deque

def orden_topologico(n, aristas):          # arista (u, v): u antes que v
    ady = [[] for _ in range(n)]
    grado = [0] * n
    for u, v in aristas:
        ady[u].append(v)
        grado[v] += 1
    cola = deque(u for u in range(n) if grado[u] == 0)
    orden = []
    while cola:
        u = cola.popleft()
        orden.append(u)
        for v in ady[u]:
            grado[v] -= 1
            if grado[v] == 0:              # ya no depende de nadie pendiente
                cola.append(v)
    return orden if len(orden) == n else None   # None: hay un ciclo</div>
     <p>Es lo que hacen Maven al compilar módulos, Terraform con su grafo de recursos, make o un planificador de tareas.</p>`},
 {t:"codigo", p:"Orden de estudio: imprime un orden topológico de las n asignaturas (entre las disponibles, siempre la de menor número primero), o <code>imposible</code> si hay un ciclo",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m líneas <code>u v</code>: u debe ir antes que v. Usa un montículo en lugar de una cola para elegir siempre el menor disponible.</p>`,
  plantilla:"import heapq\nn, m = map(int, input().split())\n",
  pruebas:[{entrada:"4 3\n0 1\n1 2\n0 3", salida:"0 1 2 3"},{entrada:"4 4\n3 1\n3 2\n1 0\n2 0", salida:"3 1 2 0"},{entrada:"2 2\n0 1\n1 0", salida:"imposible", oculta:true},{entrada:"3 0", salida:"0 1 2", oculta:true},{entrada:"5 3\n4 0\n3 0\n2 1", salida:"2 1 3 4 0", oculta:true}],
  pista:"Kahn con heapq: mete los de grado 0 en el montículo; al sacar u, baja el grado de sus vecinos y mete los que lleguen a 0.",
  solucion:`import heapq
n, m = map(int, input().split())
ady = [[] for _ in range(n)]
grado = [0] * n
for _ in range(m):
    u, v = map(int, input().split())
    ady[u].append(v)
    grado[v] += 1
h = [u for u in range(n) if grado[u] == 0]
heapq.heapify(h)
orden = []
while h:
    u = heapq.heappop(h)
    orden.append(u)
    for v in ady[u]:
        grado[v] -= 1
        if grado[v] == 0:
            heapq.heappush(h, v)
print(*orden if len(orden) == n else ["imposible"])`,
  why:"Un grafo puede tener muchos órdenes topológicos válidos; pedir «el menor disponible» hace la respuesta única y se consigue cambiando la cola por un montículo: O((V + E) log V)."},
 {t:"par", p:"Empareja cada problema con el algoritmo",
  pares:[["Orden de compilación de módulos con dependencias","Orden topológico"],["Ruta más rápida con tiempos distintos por tramo","Dijkstra"],["¿Están dos usuarios en la misma red de amigos?","Union-find o BFS"],["Detectar dependencias circulares","Orden topológico incompleto o DFS con colores"],["Laberinto: menos pasos hasta la salida","BFS"]],
  why:"Terraform detecta ciclos en su grafo de recursos igual que Kahn."},
 {t:"opcion", p:"Kahn termina y el orden tiene menos nodos que el grafo. ¿Qué significa?",
  ops:["Hay nodos aislados","Hay al menos un ciclo: esos nodos nunca llegan a grado de entrada 0","El grafo no es dirigido","Error en la cola"],
  ok:1, why:"Los nodos aislados tienen grado 0 y sí entran en el orden. Los de un ciclo se esperan mutuamente para siempre."},
 {t:"vf", p:"El orden inverso de finalización de un DFS (postorden invertido) también da un orden topológico en un DAG.",
  ok:true, why:"Un nodo termina después que todos sus descendientes, así que invertir el orden de finalización lo coloca antes que ellos."},
 {t:"escribe", p:"¿Cómo se llama un grafo dirigido sin ciclos (sus siglas en inglés)?",
  sol:["DAG","dag","grafo dirigido acíclico"], pista:"Directed Acyclic Graph.",
  why:"Los DAG aparecen en planificadores (Airflow), sistemas de construcción y control de versiones (el historial de Git es un DAG)."}
]},

{
id:"al11n3",
titulo:"Union-find (conjuntos disjuntos)",
claves:["find(x) devuelve el representante del grupo de x; union(a, b) une dos grupos","Compresión de caminos y unión por tamaño: prácticamente O(1) por operación","Ideal para conectividad dinámica: aristas que llegan una a una"],
pasos:[
 {t:"info", eti:"Agrupar", h:"La estructura",
  c:`<div class="termbox">padre = list(range(n))      # al principio, cada uno es su propio grupo
tam = [1] * n

def find(x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]      # compresión de caminos (a medias, iterativa)
        x = padre[x]
    return x

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return False                    # ya estaban juntos: ¡esta arista cierra un ciclo!
    if tam[ra] &lt; tam[rb]:
        ra, rb = rb, ra
    padre[rb] = ra                      # el pequeño cuelga del grande
    tam[ra] += tam[rb]
    return True</div>
     <p>Con las dos optimizaciones, el coste es O(α(n)) amortizado, donde α es la inversa de Ackermann: menos de 5 para cualquier n que puedas imaginar.</p>`},
 {t:"codigo", p:"Procesa las aristas no dirigidas una a una e imprime, tras cada una, el número de componentes conexas",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m aristas <code>u v</code>.</p>`,
  plantilla:"n, m = map(int, input().split())\npadre = list(range(n))\n",
  pruebas:[{entrada:"5 4\n0 1\n1 2\n0 2\n3 4", salida:"4\n3\n3\n2"},{entrada:"3 1\n2 2", salida:"3"},{entrada:"4 3\n0 1\n2 3\n1 3", salida:"3\n2\n1", oculta:true}],
  pista:"Empieza con n componentes; cada union que devuelva True (dos grupos distintos) resta 1.",
  solucion:`n, m = map(int, input().split())
padre = list(range(n))
tam = [1] * n

def find(x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]
        x = padre[x]
    return x

comp = n
for _ in range(m):
    u, v = map(int, input().split())
    ru, rv = find(u), find(v)
    if ru != rv:
        if tam[ru] < tam[rv]:
            ru, rv = rv, ru
        padre[rv] = ru
        tam[ru] += tam[rv]
        comp -= 1
    print(comp)`,
  why:"Con BFS tendrías que recorrer todo el grafo tras cada arista: O(m · (V + E)). Union-find responde tras cada arista casi en O(1)."},
 {t:"codigo", p:"Arista redundante: las aristas forman un árbol más una arista extra. Imprime la primera arista (en orden de entrada) que cierra un ciclo",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m aristas <code>u v</code>.</p>`,
  plantilla:"n, m = map(int, input().split())\n",
  pruebas:[{entrada:"3 3\n0 1\n0 2\n1 2", salida:"1 2"},{entrada:"5 5\n0 1\n1 2\n2 3\n0 3\n0 4", salida:"0 3"},{entrada:"2 2\n0 1\n1 0", salida:"1 0", oculta:true}],
  pista:"Recorre las aristas haciendo union; la primera cuyos extremos ya tengan el mismo representante es la respuesta.",
  solucion:`n, m = map(int, input().split())
padre = list(range(n))

def find(x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]
        x = padre[x]
    return x

for _ in range(m):
    u, v = map(int, input().split())
    ru, rv = find(u), find(v)
    if ru == rv:
        print(u, v)
        break
    padre[ru] = rv`,
  why:"«Ya estaban en el mismo grupo» es exactamente «esta arista cierra un ciclo». Es la base del algoritmo de Kruskal que verás en la unidad siguiente."},
 {t:"opcion", p:"¿Qué aportan la compresión de caminos y la unión por tamaño?",
  ops:["Nada, son estéticas","Mantienen los árboles muy planos, así que find pasa de O(n) en el peor caso a casi O(1) amortizado","Permiten separar grupos","Ordenan los elementos"],
  ok:1, why:"Sin ellas, uniones en mal orden forman una cadena y find recorre n nodos."},
 {t:"par", p:"Empareja cada situación con la herramienta de conectividad",
  pares:[["Aristas que llegan una a una y preguntas «¿conectados?» entre medias","Union-find"],["Distancia mínima entre dos nodos","BFS"],["Grafo fijo, contar componentes una vez","DFS o BFS desde cada nodo no visitado"],["Agrupar cuentas de usuario que comparten un correo","Union-find sobre los correos"]],
  why:"Union-find no da caminos ni distancias: solo responde «¿mismo grupo?», pero lo hace casi en O(1) mientras el grafo crece."},
 {t:"escribe", p:"¿Cómo se llama la optimización de find que hace que cada nodo recorrido apunte más cerca de la raíz?",
  sol:["compresión de caminos","compresion de caminos","path compression","compresión de camino"], pista:"Aplana el camino hacia el representante.",
  why:"Junto con la unión por tamaño (o por rango), deja los árboles casi planos."},
 {t:"vf", p:"Union-find permite deshacer una unión (separar dos grupos) de forma eficiente.",
  ok:false, why:"Solo une. Si necesitas borrar aristas, es otro problema (conectividad dinámica) mucho más difícil; a veces se resuelve procesando las operaciones al revés."}
]}

]});
