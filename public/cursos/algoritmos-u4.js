window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Sumas de prefijos",
resumen: "Precalcular acumulados para responder rangos en O(1), contar subarrays con un diccionario de prefijos, prefijos 2D y arrays de diferencias",
nivel: "Intermedio",
color: "#8fc75b",
lecciones: [

{
id:"al4n1",
titulo:"Prefijos: sumas de rangos en O(1)",
claves:["pref[i] = suma de a[0..i-1], con pref[0] = 0","suma(l..r) = pref[r + 1] - pref[l]","La idea se generaliza: productos, conteos, XOR…"],
pasos:[
 {t:"info", eti:"Precalcular", h:"El array de prefijos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">a = [3, 1, 4, 1, 5] y sus prefijos</div><table class="dg-tabla"><thead><tr><th>i</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>
<tr><td>a[i]</td><td>3</td><td>1</td><td>4</td><td>1</td><td>5</td><td>—</td></tr>
<tr><td>pref[i]</td><td>0</td><td>3</td><td>4</td><td>8</td><td>9</td><td>14</td></tr>
</tbody></table></div>
<div class="termbox">pref = [0]
for x in a:
    pref.append(pref[-1] + x)
# o: from itertools import accumulate; pref = [0, *accumulate(a)]

suma_l_r = pref[r + 1] - pref[l]        # suma de a[l..r], ambos incluidos
# a[1..3] = 1 + 4 + 1 = pref[4] - pref[1] = 9 - 3 = 6</div>
     <p>Con q consultas sobre un array de n, sumar cada rango cuesta O(n·q). Con prefijos: O(n) una vez y O(1) por consulta.</p>`},
 {t:"opcion", p:"Con <code>a = [2, 4, 6, 8]</code>, ¿cuánto vale <code>pref</code>?",
  ops:["[2, 6, 12, 20]","[0, 2, 6, 12, 20]","[0, 2, 4, 6, 8]","[20, 18, 14, 8]"],
  ok:1, why:"pref[0] = 0 y cada posición suma el siguiente elemento. El 0 inicial evita casos especiales cuando el rango empieza en 0."},
 {t:"hueco", p:"Completa la suma del rango a[l..r] (ambos incluidos)",
  tpl:"suma = pref[___] - pref[___]",
  banco:["r + 1","l","r","l - 1","l + 1"], sol:["r + 1","l"],
  why:"pref[r + 1] incluye hasta a[r]; restando pref[l] quitas todo lo anterior a a[l]."},
 {t:"codigo", p:"Responde consultas de suma de rangos",
  lenguaje:"py",
  c:`<p>Primera línea: los números. Segunda línea: q. Después, q líneas con <code>l r</code> (índices desde 0, ambos incluidos). Imprime la suma de cada rango en una línea.</p>`,
  plantilla:"a = [int(x) for x in input().split()]\nq = int(input())\n",
  pruebas:[{entrada:"3 1 4 1 5\n3\n0 4\n1 3\n2 2", salida:"14\n6\n4"},{entrada:"-2 0 3 -5 2 -1\n2\n0 2\n2 5", salida:"1\n-1"},{entrada:"7\n1\n0 0", salida:"7", oculta:true}],
  pista:"Construye pref con un 0 delante; cada consulta es pref[r + 1] - pref[l].",
  solucion:`a = [int(x) for x in input().split()]
q = int(input())
pref = [0]
for x in a:
    pref.append(pref[-1] + x)
for _ in range(q):
    l, r = map(int, input().split())
    print(pref[r + 1] - pref[l])`,
  why:"Esta es la forma de pensar de muchos problemas de rendimiento reales: si una consulta se repite mucho, precalcula."},
 {t:"codigo", p:"Índice pivote: imprime el primer índice donde la suma de lo que hay a su izquierda es igual a la de su derecha, o <code>-1</code>",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"1 7 3 6 5 6", salida:"3"},{entrada:"1 2 3", salida:"-1"},{entrada:"2 1 -1", salida:"0", oculta:true},{entrada:"0", salida:"0", oculta:true}],
  pista:"Con el total calculado, recorre llevando la suma izquierda: la derecha es total - izquierda - a[i].",
  solucion:`a = [int(x) for x in input().split()]
total = sum(a)
izq = 0
res = -1
for i, x in enumerate(a):
    if izq == total - izq - x:
        res = i
        break
    izq += x
print(res)`,
  why:"No hace falta guardar el array de prefijos entero: con el total y un acumulado basta, O(1) de espacio."},
 {t:"info", eti:"Generalizar", h:"Prefijos de productos",
  c:`<p>«Producto de todos menos uno, sin división» es otro clásico: el resultado en <code>i</code> es (producto a la izquierda) × (producto a la derecha).</p>
<div class="termbox">res = [1] * n
izq = 1
for i in range(n):              # prefijos de izquierda a derecha
    res[i] = izq
    izq *= a[i]
der = 1
for i in range(n - 1, -1, -1):  # sufijos de derecha a izquierda
    res[i] *= der
    der *= a[i]</div>`},
 {t:"codigo", p:"Producto de todos los demás: imprime, para cada posición, el producto de todos los elementos excepto el suyo, sin usar división",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"1 2 3 4", salida:"24 12 8 6"},{entrada:"-1 1 0 -3 3", salida:"0 0 9 0 0"},{entrada:"5 2", salida:"2 5", oculta:true}],
  pista:"Primera pasada: res[i] = producto de a[0..i-1]. Segunda, de derecha a izquierda, multiplica por el producto de a[i+1..].",
  solucion:`a = [int(x) for x in input().split()]
n = len(a)
res = [1] * n
izq = 1
for i in range(n):
    res[i] = izq
    izq *= a[i]
der = 1
for i in range(n - 1, -1, -1):
    res[i] *= der
    der *= a[i]
print(*res)`,
  why:"Con división fallaría si hay un 0. Prefijos y sufijos: O(n) y O(1) extra aparte del resultado."},
 {t:"vf", p:"Si el array cambia a menudo (actualizaciones entre consultas), el array de prefijos sigue siendo la mejor opción.",
  ok:false, why:"Cada actualización obligaría a recalcular O(n) prefijos. Para eso existen el árbol de Fenwick (BIT) y el árbol de segmentos: actualización y consulta en O(log n)."}
]},

{
id:"al4n2",
titulo:"Prefijos con diccionario",
claves:["Un subarray a[i..j] suma k si pref[j + 1] - pref[i] = k","Contar cuántas veces has visto cada prefijo: subarrays con suma k en O(n)","Funciona con negativos, a diferencia de la ventana deslizante"],
pasos:[
 {t:"info", eti:"La idea clave", h:"Subarrays que suman k",
  c:`<p>Si el prefijo actual es <code>p</code> y en algún punto anterior el prefijo fue <code>p - k</code>, el trozo entre ambos suma exactamente <code>k</code>. Así que basta con contar cuántas veces ha salido cada prefijo:</p>
<div class="termbox">from collections import defaultdict

def subarrays_con_suma(a, k):
    vistos = defaultdict(int)
    vistos[0] = 1                 # el prefijo vacío: subarrays que empiezan en 0
    p = total = 0
    for x in a:
        p += x
        total += vistos[p - k]    # cuántos inicios dan un trozo que suma k
        vistos[p] += 1
    return total</div>
     <div class="nota ojo"><b class="tit">El error típico</b>Olvidar <code>vistos[0] = 1</code>. Sin él, no se cuentan los subarrays que empiezan en la posición 0.</div>`},
 {t:"opcion", p:"¿Por qué aquí no sirve la ventana deslizante?",
  ops:["Sí sirve siempre","Con números negativos, ampliar la ventana puede bajar la suma: no hay monotonía para decidir cuándo encoger","Porque es O(n²)","Porque necesita ordenar"],
  ok:1, why:"La ventana necesita que ampliar y encoger muevan la condición en un sentido fijo."},
 {t:"codigo", p:"Imprime cuántos subarrays contiguos suman exactamente <code>k</code>",
  lenguaje:"py",
  c:`<p>Primera línea: k. Segunda línea: los números (puede haber negativos).</p>`,
  plantilla:"k = int(input())\na = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"2\n1 1 1", salida:"2"},{entrada:"3\n1 2 3", salida:"2"},{entrada:"0\n1 -1 0", salida:"3", oculta:true},{entrada:"7\n3 4 7 2 -3 1 4 2", salida:"4", oculta:true}],
  pista:"Diccionario de prefijos con vistos[0] = 1; suma vistos[p - k] antes de registrar p.",
  solucion:`from collections import defaultdict
k = int(input())
a = [int(x) for x in input().split()]
vistos = defaultdict(int)
vistos[0] = 1
p = total = 0
for x in a:
    p += x
    total += vistos[p - k]
    vistos[p] += 1
print(total)`,
  why:"O(n) de tiempo y O(n) de espacio, frente a O(n²) probando todos los pares de extremos."},
 {t:"info", eti:"Variantes", h:"Guardar la primera posición",
  c:`<p>Si piden la <b>longitud máxima</b> en vez de contar, guarda la <b>primera</b> posición en que aparece cada prefijo:</p>
<div class="termbox"># subarray más largo con igual número de 0 y 1: cambia 0 por -1 y busca suma 0
primera = {0: -1}
p = mejor = 0
for i, x in enumerate(a):
    p += 1 if x == 1 else -1
    if p in primera:
        mejor = max(mejor, i - primera[p])
    else:
        primera[p] = i            # solo la primera vez: maximiza la longitud</div>
     <p>Otra variante: «¿hay un subarray cuya suma sea múltiplo de k?» usa el prefijo <b>módulo k</b> como clave.</p>`},
 {t:"codigo", p:"Imprime la longitud del subarray contiguo más largo con el mismo número de 0 que de 1",
  lenguaje:"py",
  plantilla:"a = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"0 1", salida:"2"},{entrada:"0 1 0", salida:"2"},{entrada:"0 0 1 0 0 0 1 1", salida:"6", oculta:true},{entrada:"1 1 1", salida:"0", oculta:true}],
  pista:"Trata el 0 como -1 y busca el subarray más largo con suma 0: guarda la primera posición de cada prefijo, con {0: -1} de partida.",
  solucion:`a = [int(x) for x in input().split()]
primera = {0: -1}
p = mejor = 0
for i, x in enumerate(a):
    p += 1 if x == 1 else -1
    if p in primera:
        mejor = max(mejor, i - primera[p])
    else:
        primera[p] = i
print(mejor)`,
  why:"Transformar el problema (0 → -1) para reducirlo a uno conocido (suma 0) es un truco que se repite mucho."},
 {t:"par", p:"Empareja cada pregunta con lo que guardas en el diccionario",
  pares:[["¿Cuántos subarrays suman k?","Cuántas veces ha salido cada prefijo"],["Subarray más largo que suma k","La primera posición de cada prefijo"],["¿Algún subarray con suma múltiplo de k?","La primera posición de cada prefijo módulo k"],["Suma de un rango fijo, muchas veces","Nada: basta el array de prefijos"]],
  why:"Contar pide frecuencias; «más largo» pide primeras apariciones."},
 {t:"vf", p:"Para contar subarrays con suma k hay que inicializar el diccionario con el prefijo 0 visto una vez.",
  ok:true, why:"Representa el prefijo vacío, antes del primer elemento."}
]},

{
id:"al4n3",
titulo:"Prefijos 2D y arrays de diferencias",
claves:["Prefijos 2D: suma de cualquier rectángulo en O(1) por inclusión-exclusión","Array de diferencias: sumar v a un rango en O(1) y reconstruir al final con prefijos","Diferencias + prefijos son operaciones inversas"],
pasos:[
 {t:"info", eti:"Dos dimensiones", h:"Suma de un rectángulo",
  c:`<p><code>P[i][j]</code> = suma del rectángulo desde (0, 0) hasta (i - 1, j - 1). Con una fila y una columna de ceros delante, no hay casos especiales:</p>
<div class="termbox">P = [[0] * (C + 1) for _ in range(F + 1)]
for i in range(F):
    for j in range(C):
        P[i+1][j+1] = m[i][j] + P[i][j+1] + P[i+1][j] - P[i][j]

# suma del rectángulo (f1, c1) .. (f2, c2), ambos incluidos
s = P[f2+1][c2+1] - P[f1][c2+1] - P[f2+1][c1] + P[f1][c1]</div>
     <div class="dg"><div class="dg-tit">inclusión-exclusión</div><div class="dg-flujo"><div class="dg-caja">todo hasta la esquina</div><div class="dg-caja aviso">− franja de arriba</div><div class="dg-caja aviso">− franja de la izquierda</div><div class="dg-caja ok">+ esquina restada dos veces</div></div></div>`},
 {t:"info", eti:"Actualizar rangos", h:"Array de diferencias",
  c:`<p>Si hay muchas operaciones «suma v a todos los elementos de l a r» y solo al final se lee el array, no actualices elemento a elemento (O(n) cada una):</p>
<div class="termbox">d = [0] * (n + 1)
for l, r, v in operaciones:
    d[l] += v           # a partir de l, todo sube v
    d[r + 1] -= v       # a partir de r + 1, se deshace
# reconstruir: prefijos de d
res, acum = [], 0
for i in range(n):
    acum += d[i]
    res.append(acum)</div>
     <p>Es lo que hay detrás de «reservas de vuelos por rango», «cuántas personas hay en el tren en cada parada» o el máximo de intervalos solapados.</p>`},
 {t:"codigo", p:"Array de diferencias: aplica las operaciones «suma v de l a r» sobre un array de n ceros e imprime el resultado",
  lenguaje:"py",
  c:`<p>Primera línea: <code>n q</code>. Después q líneas con <code>l r v</code> (índices desde 0, ambos incluidos).</p>`,
  plantilla:"n, q = map(int, input().split())\n",
  pruebas:[{entrada:"5 3\n0 2 1\n1 4 2\n3 3 5", salida:"1 3 3 7 2"},{entrada:"3 1\n0 2 -4", salida:"-4 -4 -4"},{entrada:"4 2\n1 1 10\n1 2 1", salida:"0 11 1 0", oculta:true}],
  pista:"d = [0] * (n + 1); d[l] += v; d[r + 1] -= v. Después acumula.",
  solucion:`n, q = map(int, input().split())
d = [0] * (n + 1)
for _ in range(q):
    l, r, v = map(int, input().split())
    d[l] += v
    d[r + 1] -= v
res = []
acum = 0
for i in range(n):
    acum += d[i]
    res.append(acum)
print(*res)`,
  why:"O(n + q) en vez de O(n·q). La posición extra d[n] evita comprobar si r + 1 se sale."},
 {t:"codigo", p:"Suma de rectángulos en una matriz",
  lenguaje:"py",
  c:`<p>Primera línea: <code>F C</code>. Después F filas. Luego q y q líneas <code>f1 c1 f2 c2</code>. Imprime la suma de cada rectángulo.</p>`,
  plantilla:"F, C = map(int, input().split())\nm = [[int(x) for x in input().split()] for _ in range(F)]\nq = int(input())\n",
  pruebas:[{entrada:"3 3\n1 2 3\n4 5 6\n7 8 9\n3\n0 0 2 2\n1 1 2 2\n0 1 1 2", salida:"45\n28\n16"},{entrada:"1 4\n1 -1 2 5\n1\n0 1 0 3", salida:"6"},{entrada:"2 2\n5 0\n0 5\n1\n1 0 1 0", salida:"0", oculta:true}],
  pista:"Construye P de (F+1) × (C+1) y aplica la fórmula de inclusión-exclusión.",
  solucion:`F, C = map(int, input().split())
m = [[int(x) for x in input().split()] for _ in range(F)]
q = int(input())
P = [[0] * (C + 1) for _ in range(F + 1)]
for i in range(F):
    for j in range(C):
        P[i + 1][j + 1] = m[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j]
for _ in range(q):
    f1, c1, f2, c2 = map(int, input().split())
    print(P[f2 + 1][c2 + 1] - P[f1][c2 + 1] - P[f2 + 1][c1] + P[f1][c1])`,
  why:"O(F·C) para precalcular y O(1) por consulta. La misma idea se usa en visión por computador (imagen integral)."},
 {t:"opcion", p:"Un sistema recibe un millón de reservas «asientos del tramo l al r» y al final quiere la ocupación de cada tramo. ¿Qué usas?",
  ops:["Sumar 1 a cada tramo de cada reserva","Array de diferencias y una pasada de prefijos al final","Ordenar las reservas","Un diccionario de reservas"],
  ok:1, why:"Cada reserva pasa a costar O(1), y la reconstrucción O(n): el total es lineal."},
 {t:"par", p:"Empareja cada necesidad con la técnica",
  pares:[["Muchas consultas de suma sobre un array fijo","Prefijos 1D"],["Muchas consultas de suma de rectángulos","Prefijos 2D"],["Muchas actualizaciones de rango, lectura al final","Array de diferencias"],["Actualizaciones y consultas mezcladas","Árbol de Fenwick o de segmentos"]],
  why:"Saber cuándo los prefijos dejan de servir también es parte de dominarlos."},
 {t:"vf", p:"Aplicar prefijos al array de diferencias reconstruye el array con todas las operaciones aplicadas.",
  ok:true, why:"Diferencias y prefijos son operaciones inversas, como derivar e integrar."}
]}

]});
