window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Grafos con pesos",
resumen: "Caminos mínimos con Dijkstra, pesos negativos con Bellman-Ford, todos los pares con Floyd-Warshall y árboles de expansión mínima con Kruskal y Prim",
nivel: "Experto",
color: "#65a334",
lecciones: [

{
id:"al12n1",
titulo:"Dijkstra: caminos mínimos",
claves:["Caminos mínimos desde un origen con pesos no negativos","Montículo por distancia: siempre se expande el nodo pendiente más cercano","O((V + E) log V); ignora entradas obsoletas del montículo"],
pasos:[
 {t:"info", eti:"Con pesos", h:"El algoritmo",
  c:`<div class="dg"><div class="dg-tit">el camino directo no siempre es el más corto</div>
<svg viewBox="0 0 320 130" width="100%" style="max-width:420px;display:block;margin:auto" role="img" aria-label="A a C directo cuesta 10; A a B cuesta 2 y B a C cuesta 3, en total 5">
<line x1="40" y1="95" x2="280" y2="95" stroke="var(--bad)" stroke-width="2"/><text x="160" y="118" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink-2)">10</text>
<line x1="40" y1="95" x2="160" y2="28" stroke="var(--ok)" stroke-width="2"/><text x="88" y="52" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink-2)">2</text>
<line x1="160" y1="28" x2="280" y2="95" stroke="var(--ok)" stroke-width="2"/><text x="232" y="52" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink-2)">3</text>
<circle cx="40" cy="95" r="17" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="40" y="100" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">A</text>
<circle cx="160" cy="28" r="17" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="160" y="33" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">B</text>
<circle cx="280" cy="95" r="17" fill="var(--bg)" stroke="var(--line-2)" stroke-width="2"/><text x="280" y="100" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">C</text>
</svg></div>
<div class="termbox">import heapq

def dijkstra(n, ady, origen):              # ady[u] = [(v, peso), ...]
    dist = [float("inf")] * n
    dist[origen] = 0
    h = [(0, origen)]
    while h:
        d, u = heapq.heappop(h)
        if d &gt; dist[u]:
            continue                       # entrada obsoleta: ya se encontró algo mejor
        for v, w in ady[u]:
            if d + w &lt; dist[v]:            # relajar la arista
                dist[v] = d + w
                heapq.heappush(h, (dist[v], v))
    return dist</div>`},
 {t:"info", eti:"Por qué funciona", h:"La idea voraz",
  c:`<p>Cuando un nodo sale del montículo con la distancia más pequeña de todas las pendientes, <b>ninguna ruta futura puede mejorarla</b>: cualquier otro camino pasaría por un nodo pendiente, que ya está más lejos, y los pesos no negativos solo pueden sumar.</p>
     <p>Por eso con un peso negativo el argumento se rompe. heapq no tiene «disminuir clave», así que se mete una entrada nueva y se descartan las viejas con <code>if d &gt; dist[u]</code>.</p>`},
 {t:"codigo", p:"Imprime la distancia mínima desde el nodo 0 a cada nodo (-1 si es inalcanzable)",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m aristas dirigidas <code>u v peso</code> (pesos ≥ 0).</p>`,
  plantilla:"import heapq\nn, m = map(int, input().split())\nady = [[] for _ in range(n)]\nfor _ in range(m):\n    u, v, w = map(int, input().split())\n    ady[u].append((v, w))\n",
  pruebas:[{entrada:"3 3\n0 2 10\n0 1 2\n1 2 3", salida:"0 2 5"},{entrada:"4 4\n0 1 1\n1 2 1\n0 2 5\n2 1 0", salida:"0 1 2 -1"},{entrada:"5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3", salida:"0 3 1 4 7", oculta:true},{entrada:"2 1\n1 0 3", salida:"0 -1", oculta:true}],
  pista:"Sigue la plantilla: montículo de (distancia, nodo), descarta entradas obsoletas y relaja las aristas.",
  solucion:`import heapq
n, m = map(int, input().split())
ady = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    ady[u].append((v, w))
INF = float("inf")
dist = [INF] * n
dist[0] = 0
h = [(0, 0)]
while h:
    d, u = heapq.heappop(h)
    if d > dist[u]:
        continue
    for v, w in ady[u]:
        if d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(h, (dist[v], v))
print(*[x if x < INF else -1 for x in dist])`,
  why:"En el caso oculto, al nodo 1 se llega antes directamente (4) pero es mejor pasar por el 2 (1 + 2 = 3): el montículo lo resuelve solo."},
 {t:"opcion", p:"¿Por qué Dijkstra no funciona con pesos negativos?",
  ops:["Por un límite de Python","Da por definitiva la distancia de un nodo al sacarlo del montículo; un peso negativo posterior podría mejorarla","Porque es BFS","Sí funciona"],
  ok:1, why:"Con pesos negativos se usa Bellman-Ford."},
 {t:"par", p:"Empareja cada situación con el algoritmo de caminos mínimos",
  pares:[["Sin pesos (o todos iguales)","BFS"],["Pesos 0 o 1","BFS 0-1 con una deque"],["Pesos no negativos","Dijkstra"],["Pesos negativos, sin ciclos negativos","Bellman-Ford"],["Distancias entre todos los pares, V pequeño","Floyd-Warshall"]],
  why:"Elegir el algoritmo más sencillo que sirve es parte de la respuesta."},
 {t:"vf", p:"Dijkstra con montículo binario cuesta O((V + E) log V).",
  ok:true, why:"Cada relajación puede meter una entrada en el montículo (O(log V)), y hay como mucho E relajaciones."},
 {t:"opcion", p:"Quieres reconstruir el camino, no solo la distancia. ¿Qué añades?",
  ops:["Nada, no se puede","Un array previo[v] = u cada vez que relajas la arista u → v; al final, sigue previo desde el destino","Otro Dijkstra desde el destino","Guardar todas las rutas en listas"],
  ok:1, why:"Guardar solo el predecesor cuesta O(V) de memoria y reconstruir la ruta es O(longitud)."}
]},

{
id:"al12n2",
titulo:"Pesos negativos y todos los pares",
claves:["Bellman-Ford: relajar todas las aristas V - 1 veces; O(V · E)","Una relajación más que mejore algo delata un ciclo negativo","Floyd-Warshall: distancias entre todos los pares en O(V³)"],
pasos:[
 {t:"info", eti:"Negativos", h:"Bellman-Ford",
  c:`<div class="termbox">def bellman_ford(n, aristas, origen):
    dist = [float("inf")] * n
    dist[origen] = 0
    for _ in range(n - 1):                 # un camino simple tiene como mucho n-1 aristas
        for u, v, w in aristas:
            if dist[u] + w &lt; dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in aristas:                # si aún mejora, hay ciclo negativo
        if dist[u] + w &lt; dist[v]:
            return None
    return dist</div>
     <p>Tras la iteración i, las distancias de todos los caminos de hasta i aristas son correctas. Útil también cuando limitan el <b>número de escalas</b>: haz solo k + 1 rondas, copiando <code>dist</code> al principio de cada ronda para no encadenar varias aristas en la misma.</p>`},
 {t:"codigo", p:"Vuelo más barato con como mucho <code>k</code> escalas: imprime el precio mínimo del origen al destino, o -1",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m vuelos <code>u v precio</code>. Última línea: <code>origen destino k</code>.</p>`,
  plantilla:"n, m = map(int, input().split())\nvuelos = [tuple(map(int, input().split())) for _ in range(m)]\norigen, destino, k = map(int, input().split())\n",
  pruebas:[{entrada:"4 5\n0 1 100\n1 2 100\n2 0 100\n1 3 600\n2 3 200\n0 3 1", salida:"700"},{entrada:"3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 1", salida:"200"},{entrada:"3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 0", salida:"500", oculta:true},{entrada:"2 0\n0 1 3", salida:"-1", oculta:true}],
  pista:"k escalas son k + 1 vuelos: haz k + 1 rondas de Bellman-Ford, relajando sobre una copia de dist hecha al inicio de cada ronda.",
  solucion:`n, m = map(int, input().split())
vuelos = [tuple(map(int, input().split())) for _ in range(m)]
origen, destino, k = map(int, input().split())
INF = float("inf")
dist = [INF] * n
dist[origen] = 0
for _ in range(k + 1):
    nueva = dist[:]
    for u, v, w in vuelos:
        if dist[u] + w < nueva[v]:
            nueva[v] = dist[u] + w
    dist = nueva
print(dist[destino] if dist[destino] < INF else -1)`,
  why:"Sin la copia, en una misma ronda podrías encadenar dos vuelos y saltarte el límite de escalas. Dijkstra tal cual no sirve: el camino más barato podría usar demasiadas escalas."},
 {t:"info", eti:"Todos contra todos", h:"Floyd-Warshall",
  c:`<div class="termbox">d = [[0 if i == j else INF for j in range(n)] for i in range(n)]
for u, v, w in aristas:
    d[u][v] = min(d[u][v], w)
for k in range(n):                   # ¿mejora pasar por k?
    for i in range(n):
        for j in range(n):
            if d[i][k] + d[k][j] &lt; d[i][j]:
                d[i][j] = d[i][k] + d[k][j]</div>
     <p>Tres bucles, O(V³): viable hasta unos 400-500 nodos. El bucle de <code>k</code> tiene que ser el <b>exterior</b>: es la programación dinámica «caminos que solo usan los nodos 0..k como intermedios».</p>`},
 {t:"codigo", p:"Floyd-Warshall: imprime la matriz de distancias mínimas entre todos los pares (usa <code>x</code> para inalcanzable)",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m aristas dirigidas <code>u v peso</code>.</p>`,
  plantilla:"n, m = map(int, input().split())\n",
  pruebas:[{entrada:"3 3\n0 1 4\n1 2 1\n0 2 7", salida:"0 4 5\nx 0 1\nx x 0"},{entrada:"2 2\n0 1 3\n1 0 -1", salida:"0 3\n-1 0"},{entrada:"3 2\n2 0 2\n0 1 2", salida:"0 2 x\nx 0 x\n2 4 0", oculta:true}],
  pista:"Matriz con 0 en la diagonal e infinito en el resto; mínimo con cada arista; triple bucle con k fuera.",
  solucion:`n, m = map(int, input().split())
INF = float("inf")
d = [[0 if i == j else INF for j in range(n)] for i in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    d[u][v] = min(d[u][v], w)
for k in range(n):
    for i in range(n):
        for j in range(n):
            if d[i][k] + d[k][j] < d[i][j]:
                d[i][j] = d[i][k] + d[k][j]
for fila in d:
    print(*["x" if x == INF else x for x in fila])`,
  why:"Admite pesos negativos (sin ciclos negativos). Un d[i][i] &lt; 0 al final delataría un ciclo negativo."},
 {t:"opcion", p:"En Floyd-Warshall pones el bucle de <code>k</code> dentro de los de <code>i</code> y <code>j</code>. ¿Qué pasa?",
  ops:["Nada, el orden da igual","El resultado puede ser incorrecto: usarías d[i][k] y d[k][j] antes de que estén calculados con todos los intermedios necesarios","Es más rápido","Da error"],
  ok:1, why:"La recurrencia de la programación dinámica exige que la capa k - 1 esté completa antes de calcular la k."},
 {t:"vf", p:"Bellman-Ford puede detectar ciclos de peso negativo alcanzables desde el origen.",
  ok:true, why:"Si tras V - 1 rondas todavía se puede relajar alguna arista, existe un ciclo negativo: la distancia no está acotada."}
]},

{
id:"al12n3",
titulo:"Árbol de expansión mínima",
claves:["Conectar todos los nodos con la mínima suma de pesos, sin ciclos: V - 1 aristas","Kruskal: aristas de menor a mayor peso, añadiéndolas si unen componentes distintas (union-find)","Prim: crecer desde un nodo con un montículo de aristas salientes"],
pasos:[
 {t:"info", eti:"Conectar barato", h:"Qué es un MST",
  c:`<p>Tienes ciudades y el coste de tender cable entre pares. ¿Cómo conectarlas todas gastando lo mínimo? La solución es un <b>árbol</b> (sin ciclos: un ciclo tendría una arista sobrante) que toca todos los nodos: el árbol de expansión mínima (MST).</p>
<div class="termbox">def kruskal(n, aristas):                  # aristas: (peso, u, v)
    padre = list(range(n))
    def find(x):
        while padre[x] != x:
            padre[x] = padre[padre[x]]
            x = padre[x]
        return x
    total, usadas = 0, 0
    for w, u, v in sorted(aristas):
        ru, rv = find(u), find(v)
        if ru != rv:                        # une dos componentes: no crea ciclo
            padre[ru] = rv
            total += w
            usadas += 1
    return total if usadas == n - 1 else None   # None: el grafo no es conexo</div>
     <p>O(E log E) por la ordenación. Es voraz y es correcto por la «propiedad del corte»: la arista más barata que cruza cualquier división de los nodos en dos grupos pertenece a algún MST.</p>`},
 {t:"codigo", p:"Kruskal: imprime el coste del árbol de expansión mínima, o <code>imposible</code> si el grafo no es conexo",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n m</code>. Después m aristas no dirigidas <code>u v peso</code>.</p>`,
  plantilla:"n, m = map(int, input().split())\naristas = []\nfor _ in range(m):\n    u, v, w = map(int, input().split())\n    aristas.append((w, u, v))\n",
  pruebas:[{entrada:"4 5\n0 1 1\n1 2 2\n2 3 1\n0 3 4\n0 2 3", salida:"4"},{entrada:"3 1\n0 1 5", salida:"imposible"},{entrada:"1 0", salida:"0", oculta:true},{entrada:"4 6\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4\n1 2 7", salida:"16", oculta:true}],
  pista:"Ordena por peso, union-find, suma los pesos de las aristas que unen componentes distintas y cuenta cuántas usas.",
  solucion:`n, m = map(int, input().split())
aristas = []
for _ in range(m):
    u, v, w = map(int, input().split())
    aristas.append((w, u, v))
padre = list(range(n))

def find(x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]
        x = padre[x]
    return x

total = usadas = 0
for w, u, v in sorted(aristas):
    ru, rv = find(u), find(v)
    if ru != rv:
        padre[ru] = rv
        total += w
        usadas += 1
print(total if usadas == n - 1 else "imposible")`,
  why:"Contar las aristas usadas (n - 1) es la forma barata de saber si el grafo era conexo."},
 {t:"info", eti:"La alternativa", h:"Prim",
  c:`<div class="termbox">def prim(n, ady):                       # ady[u] = [(peso, v), ...]
    visto = [False] * n
    h = [(0, 0)]                         # (peso de la arista, nodo)
    total = 0
    while h:
        w, u = heapq.heappop(h)
        if visto[u]:
            continue
        visto[u] = True
        total += w
        for arista in ady[u]:
            if not visto[arista[1]]:
                heapq.heappush(h, arista)
    return total</div>
     <p>Se parece mucho a Dijkstra, pero el montículo se ordena por el peso de <b>la arista</b>, no por la distancia acumulada. Prim suele ir mejor en grafos densos; Kruskal, en dispersos o cuando las aristas ya vienen ordenadas.</p>`},
 {t:"codigo", p:"Prim: imprime el coste del árbol de expansión mínima de un grafo conexo",
  lenguaje:"py",
  c:`<p>Mismo formato: <code>n m</code> y m aristas <code>u v peso</code>. Resuélvelo con un montículo, sin ordenar todas las aristas.</p>`,
  plantilla:"import heapq\nn, m = map(int, input().split())\nady = [[] for _ in range(n)]\nfor _ in range(m):\n    u, v, w = map(int, input().split())\n    ady[u].append((w, v))\n    ady[v].append((w, u))\n",
  pruebas:[{entrada:"4 5\n0 1 1\n1 2 2\n2 3 1\n0 3 4\n0 2 3", salida:"4"},{entrada:"2 2\n0 1 9\n0 1 3", salida:"3"},{entrada:"4 6\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4\n1 2 7", salida:"16", oculta:true}],
  pista:"Montículo de (peso, nodo) empezando con (0, 0); al sacar un nodo no visitado, súmalo y mete sus aristas hacia no visitados.",
  solucion:`import heapq
n, m = map(int, input().split())
ady = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    ady[u].append((w, v))
    ady[v].append((w, u))
visto = [False] * n
h = [(0, 0)]
total = 0
while h:
    w, u = heapq.heappop(h)
    if visto[u]:
        continue
    visto[u] = True
    total += w
    for arista in ady[u]:
        if not visto[arista[1]]:
            heapq.heappush(h, arista)
print(total)`,
  why:"Las aristas paralelas (dos entre 0 y 1) no son un problema: el montículo saca primero la más barata y la otra se descarta por visto."},
 {t:"opcion", p:"¿Qué diferencia hay entre un MST y los caminos mínimos de Dijkstra?",
  ops:["Son lo mismo","El MST minimiza la suma total de aristas para conectarlo todo; Dijkstra minimiza la distancia desde un origen a cada nodo, y sus árboles pueden ser distintos","Dijkstra no usa montículo","El MST solo sirve con grafos dirigidos"],
  ok:1, why:"Ejemplo: en un triángulo A-B 2, B-C 2, A-C 3, el MST usa A-B y B-C (4), pero el camino mínimo de A a C es la arista directa (3)."},
 {t:"par", p:"Empareja cada algoritmo con su estructura clave",
  pares:[["Kruskal","Ordenar aristas + union-find"],["Prim","Montículo de aristas salientes"],["Dijkstra","Montículo por distancia acumulada"],["Bellman-Ford","Relajar todas las aristas V - 1 veces"]],
  why:"Kruskal, Prim y Dijkstra son voraces; Bellman-Ford y Floyd-Warshall, programación dinámica."},
 {t:"vf", p:"Un árbol de expansión mínima de un grafo conexo con V nodos tiene exactamente V - 1 aristas.",
  ok:true, why:"Es un árbol: conectar V nodos sin ciclos requiere exactamente V - 1 aristas."}
]}

]});
