window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Dos punteros y ventana deslizante",
resumen: "Dos técnicas que convierten muchos problemas O(n²) en O(n): punteros que se acercan o se persiguen, y ventanas que crecen y encogen",
nivel: "Intermedio",
color: "#8fc75b",
lecciones: [

{
id:"al3l1",
titulo:"Dos punteros",
claves:["Dos índices que avanzan según una condición en lugar de dos bucles anidados","En arrays ordenados: uno al principio y otro al final","Lento y rápido: uno lee y otro escribe (eliminar duplicados en el sitio)"],
pasos:[
 {t:"info", eti:"De O(n²) a O(n)", h:"Punteros desde los extremos",
  c:`<div class="dg"><div class="dg-tit">two sum en un array ordenado, objetivo 14</div>
<svg viewBox="0 0 330 110" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Array 1 3 4 6 8 11 con el puntero i en el 1 y j en el 11; la suma 12 es menor que 14, así que i avanza">
<defs><marker id="fl-al3-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>
<rect x="15" y="35" width="50" height="36" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="40" y="58" text-anchor="middle" font-size="15" font-family="var(--mono)" fill="var(--ink)">1</text>
<rect x="65" y="35" width="50" height="36" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/><text x="90" y="58" text-anchor="middle" font-size="15" font-family="var(--mono)" fill="var(--ink)">3</text>
<rect x="115" y="35" width="50" height="36" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/><text x="140" y="58" text-anchor="middle" font-size="15" font-family="var(--mono)" fill="var(--ink)">4</text>
<rect x="165" y="35" width="50" height="36" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/><text x="190" y="58" text-anchor="middle" font-size="15" font-family="var(--mono)" fill="var(--ink)">6</text>
<rect x="215" y="35" width="50" height="36" fill="var(--bg-2)" stroke="var(--line-2)" stroke-width="2"/><text x="240" y="58" text-anchor="middle" font-size="15" font-family="var(--mono)" fill="var(--ink)">8</text>
<rect x="265" y="35" width="50" height="36" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="290" y="58" text-anchor="middle" font-size="15" font-family="var(--mono)" fill="var(--ink)">11</text>
<text x="40" y="22" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--accent)">i</text>
<text x="290" y="22" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--accent)">j</text>
<line x1="45" y1="90" x2="85" y2="90" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-al3-1)"/>
<text x="100" y="95" font-size="13" font-family="var(--sans)" fill="var(--ink-2)">1 + 11 = 12 &lt; 14: avanza i</text>
</svg></div>
<div class="termbox">def two_sum_ordenado(a, objetivo):
    i, j = 0, len(a) - 1
    while i &lt; j:
        s = a[i] + a[j]
        if s == objetivo:
            return i, j
        if s &lt; objetivo:
            i += 1          # necesito más: el izquierdo crece
        else:
            j -= 1          # necesito menos: el derecho baja
    return None</div>
     <p>Cada paso descarta un elemento que nunca puede formar parte de la solución: si <code>a[i] + a[j]</code> es pequeña, <code>a[i]</code> con cualquier otro elemento también lo sería. Como mucho n pasos y O(1) de memoria.</p>`},
 {t:"info", eti:"Leer y escribir", h:"Puntero lento y rápido",
  c:`<div class="termbox"># quitar duplicados de una lista ordenada en el sitio; devuelve la nueva longitud
def quitar_duplicados(a):
    escribir = 1
    for leer in range(1, len(a)):
        if a[leer] != a[escribir - 1]:
            a[escribir] = a[leer]
            escribir += 1
    return escribir</div>
     <p><code>leer</code> recorre todo; <code>escribir</code> marca dónde va el siguiente elemento que se queda. Lo que hay más allá de <code>escribir</code> se ignora.</p>`},
 {t:"opcion", p:"En two sum ordenado, si la suma actual es menor que el objetivo, ¿qué puntero mueves?",
  ops:["El derecho hacia la izquierda","El izquierdo hacia la derecha, para aumentar la suma","Ambos","Ninguno"],
  ok:1, why:"El array está ordenado: avanzar el izquierdo da un número mayor."},
 {t:"codigo", p:"Two sum en una lista ordenada con O(1) de memoria: imprime los índices <code>i j</code>, o <code>-1</code> si no hay pareja",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\nobjetivo = int(input())\n",
  pruebas:[{entrada:"1 3 4 6 8 11\n14", salida:"1 5"},{entrada:"2 7 11 15\n9", salida:"0 1"},{entrada:"1 2 3\n7", salida:"-1", oculta:true},{entrada:"-5 -1 0 4\n-1", salida:"0 3", oculta:true}],
  pista:"i al principio y j al final; mientras i &lt; j, compara la suma con el objetivo.",
  solucion:`a = [int(x) for x in input().split()]
objetivo = int(input())
i, j = 0, len(a) - 1
res = "-1"
while i < j:
    s = a[i] + a[j]
    if s == objetivo:
        res = f"{i} {j}"
        break
    if s < objetivo:
        i += 1
    else:
        j -= 1
print(res)`,
  why:"Con el array ordenado no hace falta diccionario: O(n) de tiempo y O(1) de espacio."},
 {t:"codigo", p:"Quita los duplicados de la lista ordenada en el sitio: imprime la nueva longitud y, en otra línea, los elementos que quedan",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"1 1 2", salida:"2\n1 2"},{entrada:"0 0 1 1 1 2 2 3 3 4", salida:"5\n0 1 2 3 4"},{entrada:"7", salida:"1\n7", oculta:true}],
  pista:"escribir = 1; recorre con leer desde 1 y copia a[leer] a a[escribir] cuando sea distinto de a[escribir - 1]. Imprime a[:escribir].",
  solucion:`a = [int(x) for x in input().split()]
escribir = 1
for leer in range(1, len(a)):
    if a[leer] != a[escribir - 1]:
        a[escribir] = a[leer]
        escribir += 1
print(escribir)
print(*a[:escribir])`,
  why:"Usar set() no respetaría la restricción «en el sitio» y además perdería el orden garantizado. El patrón leer/escribir sirve también para mover ceros al final o filtrar valores."},
 {t:"par", p:"Empareja cada problema con la variante de dos punteros",
  pares:[["Pareja que suma X en array ordenado","Extremos que se acercan"],["¿Es palíndromo?","Extremos que se acercan comparando"],["Quitar duplicados en el sitio","Lento que escribe, rápido que lee"],["Detectar un ciclo en una lista enlazada","Tortuga y liebre (lento y rápido)"],["Fusionar dos listas ordenadas","Un puntero en cada lista"]],
  why:"Reconocer el patrón es lo difícil; el código es corto."},
 {t:"vf", p:"La técnica de extremos que se acercan para two sum funciona igual en un array sin ordenar.",
  ok:false, why:"Depende del orden para saber qué puntero mover. Sin orden, usa un diccionario (O(n)) u ordena antes (O(n log n))."}
]},

{
id:"al3n1",
titulo:"Dos punteros: 3sum, contenedores y particiones",
claves:["3sum: ordenar, fijar uno y hacer two sum con dos punteros en el resto: O(n²)","Contenedor con más agua: mover siempre el lado más bajo","Bandera holandesa: tres punteros para particionar en una pasada"],
pasos:[
 {t:"info", eti:"Reducir a lo conocido", h:"3sum",
  c:`<div class="termbox">def three_sum(nums):
    nums.sort()
    res = []
    for k in range(len(nums) - 2):
        if k &gt; 0 and nums[k] == nums[k - 1]:
            continue                        # no repetir el primer elemento
        i, j = k + 1, len(nums) - 1
        while i &lt; j:
            s = nums[k] + nums[i] + nums[j]
            if s &lt; 0:
                i += 1
            elif s &gt; 0:
                j -= 1
            else:
                res.append((nums[k], nums[i], nums[j]))
                i += 1
                while i &lt; j and nums[i] == nums[i - 1]:
                    i += 1                  # saltar repetidos
    return res</div>
     <p>Fijar un elemento convierte el problema en two sum ordenado. O(n²) en total, frente a O(n³) probando todas las ternas. Los saltos de repetidos evitan ternas duplicadas sin usar un set.</p>`},
 {t:"info", eti:"Argumento voraz", h:"Contenedor con más agua",
  c:`<p>Dadas alturas de líneas verticales, elige dos que, con el eje, contengan más agua: área = <code>min(h[i], h[j]) × (j - i)</code>.</p>
     <p>Empieza con los extremos (máxima anchura). Mover el lado <b>más alto</b> nunca puede mejorar: la altura seguiría limitada por el bajo y la anchura baja. Así que mueves el <b>más bajo</b>. Cada paso descarta una línea: O(n).</p>
     <div class="nota"><b class="tit">Explícalo en voz alta</b>En entrevista, el código de este problema es trivial. Lo que se evalúa es que justifiques por qué mover el lado bajo no pierde la solución óptima.</div>`},
 {t:"codigo", p:"Contenedor con más agua: imprime el área máxima",
  lenguaje:"py",
  plantilla:"h = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"1 8 6 2 5 4 8 3 7", salida:"49"},{entrada:"1 1", salida:"1"},{entrada:"4 3 2 1 4", salida:"16", oculta:true},{entrada:"1 2 1", salida:"2", oculta:true}],
  pista:"i = 0, j = len(h) - 1; calcula el área, guarda el máximo y mueve el puntero de la línea más baja.",
  solucion:`h = [int(x) for x in input().split()]
i, j = 0, len(h) - 1
mejor = 0
while i < j:
    mejor = max(mejor, min(h[i], h[j]) * (j - i))
    if h[i] < h[j]:
        i += 1
    else:
        j -= 1
print(mejor)`,
  why:"O(n) con un argumento de exclusión: nunca se descarta una pareja que pudiera superar el mejor valor ya visto."},
 {t:"codigo", p:"3sum: imprime cada terna distinta que suma 0, una por línea con sus números en orden creciente y las ternas en orden; si no hay ninguna, imprime <code>ninguna</code>",
  lenguaje:"py",
  plantilla:"nums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"-1 0 1 2 -1 -4", salida:"-1 -1 2\n-1 0 1"},{entrada:"0 0 0 0", salida:"0 0 0"},{entrada:"1 2 3", salida:"ninguna", oculta:true},{entrada:"-2 0 1 1 2", salida:"-2 0 2\n-2 1 1", oculta:true}],
  pista:"Ordena; para cada k (saltando repetidos), two sum con dos punteros sobre el resto buscando -nums[k].",
  solucion:`nums = sorted(int(x) for x in input().split())
res = []
for k in range(len(nums) - 2):
    if k > 0 and nums[k] == nums[k - 1]:
        continue
    i, j = k + 1, len(nums) - 1
    while i < j:
        s = nums[k] + nums[i] + nums[j]
        if s < 0:
            i += 1
        elif s > 0:
            j -= 1
        else:
            res.append((nums[k], nums[i], nums[j]))
            i += 1
            while i < j and nums[i] == nums[i - 1]:
                i += 1
if res:
    for t in res:
        print(*t)
else:
    print("ninguna")`,
  why:"Al ir en orden, las ternas salen ya ordenadas. El salto de repetidos en k y en i garantiza que no se repite ninguna."},
 {t:"info", eti:"Tres zonas", h:"Bandera holandesa (ordenar 0, 1 y 2)",
  c:`<div class="dg"><div class="dg-tit">invariante durante el recorrido</div><div class="dg-fila"><div class="dg-caja ok">0 … 0<small>[0, bajo)</small></div><div class="dg-caja">1 … 1<small>[bajo, medio)</small></div><div class="dg-caja base">? ? ?<small>[medio, alto]</small></div><div class="dg-caja acento">2 … 2<small>(alto, n)</small></div></div></div>
<div class="termbox">bajo, medio, alto = 0, 0, len(a) - 1
while medio &lt;= alto:
    if a[medio] == 0:
        a[bajo], a[medio] = a[medio], a[bajo]; bajo += 1; medio += 1
    elif a[medio] == 1:
        medio += 1
    else:
        a[medio], a[alto] = a[alto], a[medio]; alto -= 1   # no avanzar medio: lo que llega está sin mirar</div>`},
 {t:"opcion", p:"En la bandera holandesa, al intercambiar <code>a[medio]</code> con <code>a[alto]</code>, ¿por qué no se avanza <code>medio</code>?",
  ops:["Por error","Porque el elemento que llega desde alto aún no se ha examinado","Para que el bucle termine antes","Porque a[alto] siempre es 1"],
  ok:1, why:"Con el intercambio con bajo sí se avanza: lo que llega de [bajo, medio) ya se sabe que es 1."},
 {t:"opcion", p:"¿Qué complejidad tiene 3sum con ordenación y dos punteros?",
  ops:["O(n log n)","O(n²)","O(n³)","O(n)"],
  ok:1, why:"Ordenar es O(n log n), pero el bucle externo por el interno de dos punteros domina: O(n²)."}
]},

{
id:"al3l2",
titulo:"Ventana deslizante variable",
claves:["Una ventana [izq, der] que se amplía por la derecha y se encoge por la izquierda","Para subarrays o subcadenas contiguas con alguna condición","Mantén el estado de la ventana (suma, conteos) actualizándolo al moverla"],
pasos:[
 {t:"info", eti:"Rangos contiguos", h:"La técnica",
  c:`<div class="dg"><div class="dg-tit">subcadena más larga sin repetidos en «abcab»</div><div class="dg-pila">
<div class="dg-fila"><div class="dg-caja acento">a</div><div class="dg-caja acento">b</div><div class="dg-caja acento">c</div><div class="dg-caja">a</div><div class="dg-caja">b</div></div>
<div class="dg-fila"><div class="dg-caja">a</div><div class="dg-caja acento">b</div><div class="dg-caja acento">c</div><div class="dg-caja acento">a</div><div class="dg-caja">b</div></div>
<div class="dg-fila"><div class="dg-caja">a</div><div class="dg-caja">b</div><div class="dg-caja acento">c</div><div class="dg-caja acento">a</div><div class="dg-caja acento">b</div></div></div>
<div class="dg-nota arriba">al entrar una letra repetida, izq salta justo detrás de su aparición anterior</div></div>
<div class="termbox">def mas_larga_sin_repetir(s):
    ultima = {}                  # letra -&gt; última posición vista
    izq = mejor = 0
    for der, c in enumerate(s):
        if c in ultima and ultima[c] &gt;= izq:
            izq = ultima[c] + 1  # encoger: saltar tras la repetición
        ultima[c] = der
        mejor = max(mejor, der - izq + 1)
    return mejor</div>`},
 {t:"info", eti:"La plantilla general", h:"Ampliar, encoger, anotar",
  c:`<div class="termbox">izq = 0
for der in range(len(a)):
    añadir a[der] al estado
    while la ventana no es válida:
        quitar a[izq] del estado
        izq += 1
    anotar la respuesta con la ventana [izq, der]</div>
     <p>Para «la más <b>corta</b> que cumple» se invierte: el while encoge <b>mientras sí</b> cumple, anotando dentro.</p>
     <div class="nota ojo"><b class="tit">Cuándo NO funciona</b>Con números negativos, «subarray con suma ≥ X» ya no es monótono (añadir puede restar), y la ventana falla. Ahí se usan sumas de prefijos (unidad siguiente).</div>`},
 {t:"orden", p:"Ordena los pasos de una ventana deslizante variable",
  items:["Ampliar la ventana moviendo der y añadir el nuevo elemento al estado","Mientras la ventana no cumpla la condición, quitar a[izq] del estado y mover izq","Actualizar la mejor respuesta con la ventana actual","Repetir hasta que der llegue al final"],
  why:"Cada índice entra y sale una vez: O(n) total."},
 {t:"codigo", p:"Imprime la longitud de la subcadena más larga sin caracteres repetidos",
  lenguaje:"py",
  plantilla:"s = input()\n",
  pruebas:[{entrada:"abcabcbb", salida:"3"},{entrada:"bbbbb", salida:"1"},{entrada:"pwwkew", salida:"3", oculta:true},{entrada:"abba", salida:"2", oculta:true}],
  pista:"Guarda la última posición de cada letra; si la letra ya está dentro de la ventana (posición ≥ izq), mueve izq detrás.",
  solucion:`s = input()
ultima = {}
izq = mejor = 0
for der, c in enumerate(s):
    if c in ultima and ultima[c] >= izq:
        izq = ultima[c] + 1
    ultima[c] = der
    mejor = max(mejor, der - izq + 1)
print(mejor)`,
  why:"El caso «abba» es la trampa: sin la condición ultima[c] &gt;= izq, izq retrocedería al ver la segunda «a»."},
 {t:"codigo", p:"Subarray más corto con suma ≥ X (todos los números son positivos): imprime su longitud, o 0 si no existe",
  lenguaje:"py",
  c:`<p>Primera línea: X. Segunda línea: los números.</p>`,
  plantilla:"x = int(input())\na = [int(v) for v in input().split()]\n",
  pruebas:[{entrada:"7\n2 3 1 2 4 3", salida:"2"},{entrada:"4\n1 4 4", salida:"1"},{entrada:"11\n1 1 1 1 1 1 1 1", salida:"0", oculta:true},{entrada:"15\n1 2 3 4 5", salida:"5", oculta:true}],
  pista:"Amplía sumando a[der]; mientras suma ≥ x, anota der - izq + 1 y encoge restando a[izq].",
  solucion:`x = int(input())
a = [int(v) for v in input().split()]
izq = suma = 0
mejor = float("inf")
for der, v in enumerate(a):
    suma += v
    while suma >= x:
        mejor = min(mejor, der - izq + 1)
        suma -= a[izq]
        izq += 1
print(0 if mejor == float("inf") else mejor)`,
  why:"Funciona porque con positivos la suma crece al ampliar y decrece al encoger. Con negativos, necesitarías prefijos y una deque monótona."},
 {t:"opcion", p:"¿Por qué la ventana deslizante es O(n) aunque tenga un while dentro del for?",
  ops:["No lo es","Porque izq y der solo avanzan: cada elemento entra y sale de la ventana como mucho una vez","Porque el while nunca se ejecuta","Por el diccionario"],
  ok:1, why:"Análisis amortizado: el total de movimientos de izq está acotado por n."},
 {t:"vf", p:"La ventana deslizante sirve para encontrar el subarray más corto con suma ≥ X aunque haya números negativos.",
  ok:false, why:"Con negativos la condición deja de ser monótona. Se resuelve con sumas de prefijos y una deque monótona."}
]},

{
id:"al3n2",
titulo:"Ventanas de tamaño fijo y con conteos",
claves:["Ventana fija: entra a[i], sale a[i - k]","Comparar conteos de letras para anagramas dentro de un texto","Ventana mínima que contiene: contar lo que falta y encoger mientras se cumple"],
pasos:[
 {t:"info", eti:"Tamaño fijo", h:"Entra uno, sale otro",
  c:`<div class="termbox"># suma máxima de k elementos consecutivos
suma = sum(a[:k])
mejor = suma
for i in range(k, len(a)):
    suma += a[i] - a[i - k]      # entra a[i], sale a[i - k]
    mejor = max(mejor, suma)</div>
     <p>Recalcular la suma de cada ventana sería O(n·k). Actualizarla con lo que entra y sale es O(n).</p>`},
 {t:"info", eti:"Con conteos", h:"Anagramas dentro de un texto",
  c:`<div class="termbox">from collections import Counter

def posiciones_anagramas(s, p):
    k, objetivo = len(p), Counter(p)
    ventana = Counter(s[:k])
    res = [0] if ventana == objetivo else []
    for i in range(k, len(s)):
        ventana[s[i]] += 1
        ventana[s[i - k]] -= 1
        if ventana[s[i - k]] == 0:
            del ventana[s[i - k]]      # para que la comparación funcione
        if ventana == objetivo:
            res.append(i - k + 1)
    return res</div>
     <p>Comparar dos Counter cuesta O(tamaño del alfabeto), que es constante para letras.</p>`},
 {t:"codigo", p:"Imprime la suma máxima de <code>k</code> elementos consecutivos",
  lenguaje:"py",
  c:`<p>Primera línea: k. Segunda línea: los números (al menos k).</p>`,
  plantilla:"k = int(input())\na = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"3\n2 1 5 1 3 2", salida:"9"},{entrada:"2\n-1 -2 -3", salida:"-3"},{entrada:"1\n4 -9 7", salida:"7", oculta:true},{entrada:"4\n1 2 3 4", salida:"10", oculta:true}],
  pista:"Suma los k primeros; después suma a[i] y resta a[i - k] en cada paso.",
  solucion:`k = int(input())
a = [int(x) for x in input().split()]
suma = sum(a[:k])
mejor = suma
for i in range(k, len(a)):
    suma += a[i] - a[i - k]
    mejor = max(mejor, suma)
print(mejor)`,
  why:"Ojo con inicializar mejor a 0: con todos negativos daría una respuesta falsa. Por eso se inicializa con la primera ventana."},
 {t:"codigo", p:"Imprime las posiciones de inicio de todos los anagramas de <code>p</code> dentro de <code>s</code>, separadas por espacios (o <code>ninguna</code>)",
  lenguaje:"py",
  c:`<p>Primera línea: s. Segunda línea: p.</p>`,
  plantilla:"s = input()\np = input()\n",
  pruebas:[{entrada:"cbaebabacd\nabc", salida:"0 6"},{entrada:"abab\nab", salida:"0 1 2"},{entrada:"hola\nxyz", salida:"ninguna", oculta:true},{entrada:"ab\nabc", salida:"ninguna", oculta:true}],
  pista:"Ventana de tamaño len(p) con un Counter; al deslizar suma la letra que entra, resta la que sale y borra la clave si llega a 0.",
  solucion:`from collections import Counter
s = input()
p = input()
k = len(p)
res = []
if k <= len(s):
    objetivo = Counter(p)
    ventana = Counter(s[:k])
    if ventana == objetivo:
        res.append(0)
    for i in range(k, len(s)):
        ventana[s[i]] += 1
        ventana[s[i - k]] -= 1
        if ventana[s[i - k]] == 0:
            del ventana[s[i - k]]
        if ventana == objetivo:
            res.append(i - k + 1)
print(*res if res else ["ninguna"])`,
  why:"O(n) con alfabeto fijo. El caso con p más largo que s es el que suele romper las soluciones apresuradas."},
 {t:"info", eti:"El difícil", h:"Ventana mínima que contiene todas las letras",
  c:`<p>Dado <code>s</code> y <code>t</code>, la subcadena más corta de <code>s</code> que contiene todas las letras de <code>t</code> (con repeticiones). Es la plantilla variable con un contador de <b>lo que falta</b>:</p>
<div class="termbox">falta = Counter(t); pendientes = len(t); izq = 0; mejor = (inf, 0, 0)
for der, c in enumerate(s):
    if falta[c] &gt; 0: pendientes -= 1
    falta[c] -= 1                       # puede quedar negativo: sobra
    while pendientes == 0:              # la ventana es válida: encoger
        if der - izq + 1 &lt; mejor[0]: mejor = (der - izq + 1, izq, der)
        falta[s[izq]] += 1
        if falta[s[izq]] &gt; 0: pendientes += 1
        izq += 1</div>`},
 {t:"codigo", p:"Ventana mínima: imprime la subcadena más corta de <code>s</code> que contiene todas las letras de <code>t</code> (con repeticiones), o <code>-</code> si no existe",
  lenguaje:"py",
  c:`<p>Primera línea: s. Segunda línea: t. Si hay varias del mismo tamaño, la que empieza antes.</p>`,
  plantilla:"s = input()\nt = input()\n",
  pruebas:[{entrada:"ADOBECODEBANC\nABC", salida:"BANC"},{entrada:"a\naa", salida:"-"},{entrada:"aa\naa", salida:"aa", oculta:true},{entrada:"xyzabcx\nxa", salida:"xyza", oculta:true}],
  pista:"Sigue la plantilla del paso anterior: cuando pendientes llega a 0, encoge desde la izquierda anotando la mejor ventana.",
  solucion:`from collections import Counter
s = input()
t = input()
falta = Counter(t)
pendientes = len(t)
izq = 0
mejor = (float("inf"), 0, 0)
for der, c in enumerate(s):
    if falta[c] > 0:
        pendientes -= 1
    falta[c] -= 1
    while pendientes == 0:
        if der - izq + 1 < mejor[0]:
            mejor = (der - izq + 1, izq, der)
        falta[s[izq]] += 1
        if falta[s[izq]] > 0:
            pendientes += 1
        izq += 1
print("-" if mejor[0] == float("inf") else s[mejor[1]:mejor[2] + 1])`,
  why:"Es un «difícil» clásico. O(|s| + |t|): cada índice entra y sale una vez de la ventana."},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["Subcadena más larga sin repetidos","Ventana variable con un mapa de últimas posiciones"],["Suma máxima de k elementos consecutivos","Ventana de tamaño fijo"],["Subarray más corto con suma ≥ X (positivos)","Ventana variable que se encoge mientras cumple"],["Todos los anagramas de p dentro de s","Ventana fija con conteo de letras"],["Ventana mínima que contiene t","Ventana variable con contador de lo que falta"]],
  why:"«Subarray o subcadena contigua» es la señal para pensar en ventana deslizante."}
]}

]});
