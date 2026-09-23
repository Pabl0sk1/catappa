window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Búsqueda binaria",
resumen: "La plantilla sin errores de límites, buscar fronteras con bisect, arrays rotados y búsqueda binaria sobre la respuesta",
nivel: "Intermedio",
color: "#80bb4d",
lecciones: [

{
id:"al5l1",
titulo:"Búsqueda binaria: la plantilla",
claves:["En datos ordenados, descartar la mitad en cada paso: O(log n)","Cuidado con los límites: while izq &lt;= der y medio = izq + (der - izq) // 2","Cada iteración debe reducir el intervalo, o el bucle no termina"],
pasos:[
 {t:"info", eti:"Dividir por dos", h:"La plantilla",
  c:`<div class="dg"><div class="dg-tit">buscar 23 en [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]</div><div class="dg-vert">
<div class="dg-caja">izq=0, der=9, medio=4 → 16 &lt; 23<small>descarta la mitad izquierda</small></div>
<div class="dg-caja">izq=5, der=9, medio=7 → 56 &gt; 23<small>descarta la mitad derecha</small></div>
<div class="dg-caja">izq=5, der=6, medio=5 → 23</div>
<div class="dg-caja ok">encontrado en la posición 5<small>3 comparaciones de 10 elementos</small></div></div></div>
<div class="termbox">def buscar(a, objetivo):
    izq, der = 0, len(a) - 1
    while izq &lt;= der:                    # intervalo cerrado [izq, der]
        medio = (izq + der) // 2
        if a[medio] == objetivo:
            return medio
        if a[medio] &lt; objetivo:
            izq = medio + 1
        else:
            der = medio - 1
    return -1</div>
     <div class="nota"><b class="tit">Desbordamiento</b>En Java o C++ se escribe <code>izq + (der - izq) / 2</code>: <code>izq + der</code> puede superar 2.147.483.647. Fue un bug real de la librería de Java durante años. En Python los enteros no desbordan.</div>`},
 {t:"opcion", p:"¿Por qué en Java se usa <code>izq + (der - izq) / 2</code> en vez de <code>(izq + der) / 2</code>?",
  ops:["Es más rápido","Evita el desbordamiento de int cuando izq + der supera 2.147.483.647","Da otro resultado","Por estilo"],
  ok:1, why:"Un bug famoso que estuvo años en Arrays.binarySearch."},
 {t:"codigo", p:"Busca el objetivo en la lista ordenada con búsqueda binaria: imprime su posición o <code>-1</code>",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\nobjetivo = int(input())\n",
  pruebas:[{entrada:"2 5 8 12 16 23 38 56 72 91\n23", salida:"5"},{entrada:"-1 0 3 5 9 12\n2", salida:"-1"},{entrada:"4\n4", salida:"0", oculta:true},{entrada:"1 3\n3", salida:"1", oculta:true}],
  pista:"izq = 0, der = len(a) - 1; while izq &lt;= der; ajusta izq = medio + 1 o der = medio - 1.",
  solucion:`a = [int(x) for x in input().split()]
objetivo = int(input())
izq, der = 0, len(a) - 1
res = -1
while izq <= der:
    medio = (izq + der) // 2
    if a[medio] == objetivo:
        res = medio
        break
    if a[medio] < objetivo:
        izq = medio + 1
    else:
        der = medio - 1
print(res)`,
  why:"Los casos de uno y dos elementos son los que destapan los errores de límites (bucles infinitos o saltarse el último)."},
 {t:"opcion", p:"Con <code>while izq &lt;= der</code>, escribes <code>izq = medio</code> en vez de <code>izq = medio + 1</code>. ¿Qué puede pasar?",
  ops:["Nada, es equivalente","Un bucle infinito: con izq == medio el intervalo deja de reducirse","Que encuentre el elemento antes","Un error de índice"],
  ok:1, why:"Regla de oro: cada iteración debe quitar al menos un elemento del intervalo."},
 {t:"vf", p:"La búsqueda binaria funciona en cualquier array, esté ordenado o no.",
  ok:false, why:"Requiere orden (o una condición monótona) para poder descartar mitades."},
 {t:"escribe", p:"¿Cuántas comparaciones hace como mucho una búsqueda binaria en un array de 1.000.000 de elementos?",
  sol:["20","unas 20","~20"], pista:"2²⁰ ≈ 1.048.576.",
  why:"log₂(10⁶) ≈ 19,9: con 20 pasos se reduce el intervalo a un solo elemento."}
]},

{
id:"al6n1",
titulo:"Fronteras: primera posición que cumple",
claves:["Pensar la búsqueda como «primera posición donde la condición pasa a ser cierta»","bisect_left y bisect_right dan la primera y la siguiente a la última aparición","Array ordenado y rotado: una de las dos mitades siempre está ordenada"],
pasos:[
 {t:"info", eti:"La versión más útil", h:"Buscar la frontera",
  c:`<p>Casi todas las variantes se reducen a esto: hay un predicado que es <b>falso, falso, …, cierto, cierto</b> a lo largo del array, y quieres el primer cierto.</p>
<div class="dg"><div class="dg-tit">predicado a[i] ≥ 5 en [1, 3, 5, 5, 5, 8]</div><div class="dg-fila"><div class="dg-caja aviso">F</div><div class="dg-caja aviso">F</div><div class="dg-caja ok">C ◄ primera</div><div class="dg-caja ok">C</div><div class="dg-caja ok">C</div><div class="dg-caja ok">C</div></div></div>
<div class="termbox">def primera_cierta(lo, hi, pred):      # busca en [lo, hi); devuelve hi si ninguna
    while lo &lt; hi:                        # intervalo semiabierto
        m = (lo + hi) // 2
        if pred(m):
            hi = m                        # m podría ser la respuesta: no la descartes
        else:
            lo = m + 1
    return lo</div>`},
 {t:"info", eti:"La librería", h:"bisect",
  c:`<div class="termbox">from bisect import bisect_left, bisect_right
a = [1, 3, 5, 5, 5, 8]
bisect_left(a, 5)     # 2: primera posición con a[i] &gt;= 5
bisect_right(a, 5)    # 5: primera posición con a[i] &gt; 5
bisect_right(a, 5) - bisect_left(a, 5)   # 3 apariciones de 5
bisect_left(a, 4)     # 2: dónde insertar 4 manteniendo el orden</div>
     <p>En Java, <code>Collections.binarySearch</code> no garantiza cuál de los repetidos devuelve; <code>TreeMap.ceilingKey</code> y <code>floorKey</code> dan fronteras.</p>`},
 {t:"codigo", p:"Imprime la primera y la última posición del objetivo en la lista ordenada, separadas por un espacio (<code>-1 -1</code> si no está), en O(log n)",
  lenguaje:"py",
  plantilla:"from bisect import bisect_left, bisect_right\na = [int(x) for x in input().split()]\nobjetivo = int(input())\n",
  pruebas:[{entrada:"5 7 7 8 8 10\n8", salida:"3 4"},{entrada:"5 7 7 8 8 10\n6", salida:"-1 -1"},{entrada:"2 2 2\n2", salida:"0 2", oculta:true},{entrada:"1\n0", salida:"-1 -1", oculta:true}],
  pista:"i = bisect_left(a, objetivo); si i está fuera o a[i] != objetivo, no está. La última es bisect_right(a, objetivo) - 1.",
  solucion:`from bisect import bisect_left, bisect_right
a = [int(x) for x in input().split()]
objetivo = int(input())
i = bisect_left(a, objetivo)
if i == len(a) or a[i] != objetivo:
    print(-1, -1)
else:
    print(i, bisect_right(a, objetivo) - 1)`,
  why:"Buscar el elemento y luego expandirse a los lados sería O(n) en el peor caso (todo repetido). Dos búsquedas binarias lo dejan en O(log n)."},
 {t:"info", eti:"Clásico", h:"Array ordenado y rotado",
  c:`<p><code>[4, 5, 6, 7, 0, 1, 2]</code> es un array ordenado que se ha rotado. Al partir por la mitad, <b>una de las dos mitades siempre está ordenada</b>, y con sus extremos sabes si el objetivo cae dentro:</p>
<div class="termbox">while izq &lt;= der:
    m = (izq + der) // 2
    if a[m] == objetivo: return m
    if a[izq] &lt;= a[m]:                         # la mitad izquierda está ordenada
        if a[izq] &lt;= objetivo &lt; a[m]: der = m - 1
        else: izq = m + 1
    else:                                      # la derecha está ordenada
        if a[m] &lt; objetivo &lt;= a[der]: izq = m + 1
        else: der = m - 1</div>
     <p>Para el <b>mínimo</b> de un array rotado basta comparar <code>a[m]</code> con <code>a[der]</code>: si es mayor, el mínimo está a la derecha.</p>`},
 {t:"codigo", p:"Imprime la posición del objetivo en un array ordenado y rotado sin repetidos, o <code>-1</code>, en O(log n)",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\nobjetivo = int(input())\n",
  pruebas:[{entrada:"4 5 6 7 0 1 2\n0", salida:"4"},{entrada:"4 5 6 7 0 1 2\n3", salida:"-1"},{entrada:"1\n1", salida:"0", oculta:true},{entrada:"5 1 3\n5", salida:"0", oculta:true},{entrada:"3 1\n1", salida:"1", oculta:true}],
  pista:"Decide qué mitad está ordenada comparando a[izq] con a[m], y si el objetivo cae dentro de sus extremos.",
  solucion:`a = [int(x) for x in input().split()]
objetivo = int(input())
izq, der = 0, len(a) - 1
res = -1
while izq <= der:
    m = (izq + der) // 2
    if a[m] == objetivo:
        res = m
        break
    if a[izq] <= a[m]:
        if a[izq] <= objetivo < a[m]:
            der = m - 1
        else:
            izq = m + 1
    else:
        if a[m] < objetivo <= a[der]:
            izq = m + 1
        else:
            der = m - 1
print(res)`,
  why:"El &lt;= en a[izq] &lt;= a[m] cubre el caso izq == m (intervalos de dos elementos), que es donde fallan casi todas las versiones."},
 {t:"par", p:"Empareja cada llamada con su resultado para <code>a = [1, 3, 5, 5, 5, 8]</code>",
  pares:[["bisect_left(a, 5)","2"],["bisect_right(a, 5)","5"],["bisect_left(a, 9)","6"],["bisect_left(a, 0)","0"]],
  why:"bisect devuelve siempre un punto de inserción válido, entre 0 y len(a)."},
 {t:"vf", p:"<code>bisect_left(a, x)</code> devuelve -1 si x no está en la lista.",
  ok:false, why:"Devuelve la posición donde se insertaría. Tienes que comprobar tú si a[i] == x."}
]},

{
id:"al6n2",
titulo:"Búsqueda binaria sobre la respuesta",
claves:["Si «¿se puede con X?» es monótono, busca el X mínimo con búsqueda binaria","El espacio de búsqueda son los valores posibles de la respuesta, no posiciones","Coste: O(log(rango) × coste de comprobar)"],
pasos:[
 {t:"info", eti:"El salto conceptual", h:"Buscar en las respuestas",
  c:`<p>«Koko se come plátanos a velocidad k por hora; ¿cuál es la k <b>mínima</b> para acabar en h horas?» No hay array ordenado… pero la pregunta «¿termina con velocidad k?» es <b>monótona</b>: si termina con k, termina con cualquier k mayor.</p>
<div class="dg"><div class="dg-tit">¿acaba a tiempo con velocidad k?</div><div class="dg-fila"><div class="dg-caja aviso">k=1 no</div><div class="dg-caja aviso">2 no</div><div class="dg-caja aviso">3 no</div><div class="dg-caja ok">4 sí ◄</div><div class="dg-caja ok">5 sí</div><div class="dg-caja ok">… sí</div></div></div>
<div class="termbox">def puede(k):
    return sum((p + k - 1) // k for p in pilas) &lt;= h    # horas con velocidad k

lo, hi = 1, max(pilas)           # la respuesta está en este rango
while lo &lt; hi:
    m = (lo + hi) // 2
    if puede(m): hi = m
    else: lo = m + 1
# lo es la velocidad mínima</div>
     <p><code>(p + k - 1) // k</code> es la división redondeando hacia arriba sin usar decimales.</p>`},
 {t:"codigo", p:"Koko y los plátanos: imprime la velocidad mínima k (entera) para comerse todas las pilas en h horas, si en cada hora solo come de una pila",
  lenguaje:"py",
  c:`<p>Primera línea: las pilas. Segunda línea: h (siempre h ≥ número de pilas).</p>`,
  plantilla:"pilas = [int(x) for x in input().split()]\nh = int(input())\n",
  pruebas:[{entrada:"3 6 7 11\n8", salida:"4"},{entrada:"30 11 23 4 20\n5", salida:"30"},{entrada:"30 11 23 4 20\n6", salida:"23", oculta:true},{entrada:"1000000000\n2", salida:"500000000", oculta:true}],
  pista:"lo = 1, hi = max(pilas); puede(k) suma las horas con división hacia arriba y compara con h.",
  solucion:`pilas = [int(x) for x in input().split()]
h = int(input())

def puede(k):
    return sum((p + k - 1) // k for p in pilas) <= h

lo, hi = 1, max(pilas)
while lo < hi:
    m = (lo + hi) // 2
    if puede(m):
        hi = m
    else:
        lo = m + 1
print(lo)`,
  why:"Probar todas las velocidades sería O(max × n); con la búsqueda binaria es O(n log max). Con mil millones son 30 comprobaciones."},
 {t:"codigo", p:"Capacidad mínima de un barco para enviar todos los paquetes, en orden, en <code>d</code> días",
  lenguaje:"py",
  c:`<p>Primera línea: los pesos, en orden. Segunda línea: d. Cada día se cargan paquetes consecutivos sin superar la capacidad.</p>`,
  plantilla:"pesos = [int(x) for x in input().split()]\nd = int(input())\n",
  pruebas:[{entrada:"1 2 3 4 5 6 7 8 9 10\n5", salida:"15"},{entrada:"3 2 2 4 1 4\n3", salida:"6"},{entrada:"1 2 3 1 1\n4", salida:"3", oculta:true},{entrada:"10 50\n1", salida:"60", oculta:true}],
  pista:"El rango es [max(pesos), sum(pesos)]. puede(c) simula: acumula y empieza un día nuevo cuando no cabe el siguiente.",
  solucion:`pesos = [int(x) for x in input().split()]
d = int(input())

def puede(c):
    dias, carga = 1, 0
    for p in pesos:
        if carga + p > c:
            dias += 1
            carga = 0
        carga += p
    return dias <= d

lo, hi = max(pesos), sum(pesos)
while lo < hi:
    m = (lo + hi) // 2
    if puede(m):
        hi = m
    else:
        lo = m + 1
print(lo)`,
  why:"El límite inferior es el paquete más pesado (tiene que caber) y el superior, todo en un día. La misma idea resuelve «repartir un array en k trozos minimizando la suma máxima»."},
 {t:"codigo", p:"Raíz cuadrada entera: imprime el mayor entero r tal que r × r ≤ n, sin usar math.sqrt ni ** 0.5",
  lenguaje:"py",
  plantilla:"n = int(input())\n",
  pruebas:[{entrada:"8", salida:"2"},{entrada:"16", salida:"4"},{entrada:"0", salida:"0", oculta:true},{entrada:"1000000000000000000", salida:"1000000000", oculta:true},{entrada:"999999999999999999", salida:"999999999", oculta:true}],
  pista:"Busca el primer r con r × r &gt; n y resta 1; o busca el último que cumple con m = (lo + hi + 1) // 2.",
  solucion:`n = int(input())
lo, hi = 0, n + 1
while lo < hi:
    m = (lo + hi) // 2
    if m * m > n:
        hi = m
    else:
        lo = m + 1
print(lo - 1)`,
  why:"Con números de 18 cifras, los decimales de ** 0.5 ya no son exactos y dan respuestas erróneas. La búsqueda binaria con enteros es exacta (o usa math.isqrt)."},
 {t:"orden", p:"Ordena los pasos para aplicar búsqueda binaria sobre la respuesta",
  items:["Comprobar que «¿se puede con X?» es monótono","Fijar el rango [lo, hi] donde está seguro la respuesta","Escribir la función que comprueba un X concreto","Buscar el primer X que cumple con la plantilla de fronteras"],
  why:"Si no es monótono, la búsqueda binaria no aplica: es lo primero que hay que justificar."},
 {t:"opcion", p:"¿Qué señal del enunciado sugiere búsqueda binaria sobre la respuesta?",
  ops:["«Devuelve todas las combinaciones»","«El mínimo valor que permite…» o «el máximo valor tal que…», con una comprobación sencilla para un valor dado","«Cuenta los subarrays»","«Ordena la lista»"],
  ok:1, why:"Minimizar un máximo o maximizar un mínimo son los enunciados típicos."}
]}

]});
