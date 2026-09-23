window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Arrays, cadenas y hashing",
resumen: "Recorridos de una pasada, tablas hash para contar, buscar y agrupar, técnicas con cadenas y matrices",
nivel: "Fundamentos",
color: "#9fd36a",
lecciones: [

{
id:"al2l1",
titulo:"Arrays: recorrer una vez",
claves:["Array: acceso O(1) por índice; insertar o borrar en medio es O(n)","Una pasada guardando «lo mejor hasta ahora» resuelve muchos problemas en O(n)","Modificar en el sitio ahorra memoria: O(1) de espacio extra"],
pasos:[
 {t:"info", eti:"La estructura base", h:"Cómo es un array por dentro",
  c:`<p>Un array guarda los elementos <b>contiguos en memoria</b>. La dirección de <code>a[i]</code> se calcula con una suma (inicio + i × tamaño), por eso el acceso es O(1). Insertar en medio obliga a desplazar todo lo que va detrás: O(n).</p>
     <div class="dg"><div class="dg-tit">insertar 7 en la posición 1</div><div class="dg-pila"><div class="dg-fila"><div class="dg-caja">3</div><div class="dg-caja">1</div><div class="dg-caja">4</div><div class="dg-caja">1</div><div class="dg-caja base">·</div></div><div class="dg-fila"><div class="dg-caja">3</div><div class="dg-caja acento">7</div><div class="dg-caja aviso">1 ▸</div><div class="dg-caja aviso">4 ▸</div><div class="dg-caja aviso">1 ▸</div></div></div><div class="dg-nota arriba">tres elementos desplazados: O(n)</div></div>
     <p>La <code>list</code> de Python es un array dinámico de referencias: mismos costes.</p>`},
 {t:"info", eti:"Patrón", h:"Una pasada con el mejor hasta ahora",
  c:`<div class="termbox"># máximo beneficio comprando un día y vendiendo otro posterior
minimo = float("inf")
mejor = 0
for precio in precios:
    minimo = min(minimo, precio)            # el día más barato visto hasta ahora
    mejor = max(mejor, precio - minimo)     # vender hoy
</div>
     <p>La solución directa prueba todas las parejas (O(n²)). Guardando el mínimo visto basta una pasada: <b>O(n) de tiempo y O(1) de espacio</b>. Este «qué necesito recordar del pasado» es la idea más útil del curso.</p>`},
 {t:"par", p:"Empareja cada operación sobre un array con su coste",
  pares:[["Leer a[i]","O(1): acceso directo por posición"],["Insertar al principio","O(n): hay que desplazar todo"],["Buscar un valor sin ordenar","O(n): recorrer hasta encontrarlo"],["Añadir al final (append)","O(1) amortizado"],["Copiar un trozo con a[i:j]","O(j - i): crea una lista nueva"]],
  why:"En Java, ArrayList tiene exactamente los mismos costes."},
 {t:"codigo", p:"Máximo beneficio: con los precios de cada día, imprime el mayor beneficio de comprar un día y vender otro posterior (0 si no se puede ganar)",
  lenguaje:"py",
  plantilla:"precios = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"7 1 5 3 6 4", salida:"5"},{entrada:"7 6 4 3 1", salida:"0"},{entrada:"2 4 1 7", salida:"6", oculta:true},{entrada:"5", salida:"0", oculta:true}],
  pista:"Recorre una vez guardando el precio mínimo visto y el mejor beneficio (precio actual menos ese mínimo).",
  solucion:`precios = [int(x) for x in input().split()]
minimo = float("inf")
mejor = 0
for p in precios:
    minimo = min(minimo, p)
    mejor = max(mejor, p - minimo)
print(mejor)`,
  why:"O(n) de tiempo y O(1) de espacio. Fíjate en el caso 2 4 1 7: el mínimo cambia a 1 después del máximo parcial, y aun así la respuesta es 7 - 1 = 6."},
 {t:"codigo", p:"Imprime el segundo valor distinto más grande de la lista, o <code>ninguno</code> si no existe, recorriéndola una sola vez",
  lenguaje:"py",
  plantilla:"nums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"4 9 2 9 7", salida:"7"},{entrada:"5 5 5", salida:"ninguno"},{entrada:"-1 -3", salida:"-3", oculta:true},{entrada:"1 2 3 4 5", salida:"4", oculta:true}],
  pista:"Guarda primero y segundo (empezando en None). Si x &gt; primero, el antiguo primero pasa a ser segundo; si está entre ambos y es distinto de primero, actualiza segundo.",
  solucion:`nums = [int(x) for x in input().split()]
primero = segundo = None
for x in nums:
    if primero is None or x > primero:
        segundo = primero
        primero = x
    elif x != primero and (segundo is None or x > segundo):
        segundo = x
print("ninguno" if segundo is None else segundo)`,
  why:"Ordenar y coger el penúltimo sería O(n log n) y fallaría con repetidos. Dos variables bastan: O(n) y O(1)."},
 {t:"vf", p:"El problema de «máximo beneficio comprando y vendiendo una vez» necesita dos bucles anidados.",
  ok:false, why:"Basta una pasada guardando el mínimo visto hasta ahora."},
 {t:"opcion", p:"Tienes que borrar muchos elementos de una lista grande según una condición. ¿Qué es más eficiente en Python?",
  ops:["Llamar a lista.remove(x) por cada uno","Construir una lista nueva con los que se quedan: [x for x in lista if cond(x)]","Usar del lista[0] en un bucle","Ordenarla primero"],
  ok:1, why:"Cada remove es O(n), así que borrar k elementos cuesta O(n·k). Filtrar en una pasada es O(n)."}
]},

{
id:"al2l2",
titulo:"Diccionarios y conjuntos (tablas hash)",
claves:["Búsqueda, inserción y borrado en O(1) de media","Contar frecuencias, detectar duplicados y recordar lo visto","El clásico two sum: guardar lo visto y buscar el complemento"],
pasos:[
 {t:"info", eti:"Buscar al instante", h:"Cómo funciona una tabla hash",
  c:`<p>Una función hash convierte la clave en un número que indica una <b>cubeta</b> de un array. Buscar es calcular el hash e ir directamente a esa cubeta: O(1) de media. Si dos claves caen en la misma cubeta hay una <b>colisión</b>, y el coste de esa cubeta crece.</p>
     <div class="dg"><div class="dg-tit">de la clave a la cubeta</div><div class="dg-flujo"><div class="dg-caja">"ana"</div><div class="dg-caja acento">hash("ana") % 8</div><div class="dg-caja ok">cubeta 5<small>("ana", 31)</small></div></div></div>
     <p>Por eso las claves deben ser <b>inmutables</b>: en Python puedes usar <code>str</code>, <code>int</code> o <code>tuple</code> como clave, pero no una <code>list</code>.</p>`},
 {t:"info", eti:"El clásico", h:"Two sum en una pasada",
  c:`<div class="termbox">def two_sum(nums, objetivo):
    posicion = {}                       # valor -&gt; índice donde lo vi
    for i, x in enumerate(nums):
        falta = objetivo - x
        if falta in posicion:           # ¿he visto su complemento?
            return posicion[falta], i
        posicion[x] = i
    return None</div>
     <p>Se busca el complemento <b>antes</b> de guardar el actual, para no emparejar un número consigo mismo.</p>`},
 {t:"par", p:"Empareja cada problema con la idea con hashing",
  pares:[["¿Hay duplicados?","set: si ya estaba, hay duplicado"],["Two sum","Diccionario de valor a índice y buscar el complemento"],["¿Son anagramas?","Contar letras de ambas palabras y comparar"],["Agrupar anagramas","Diccionario de palabra ordenada a lista de palabras"],["Primer carácter que no se repite","Contar frecuencias y recorrer de nuevo"]],
  why:"Una parte enorme de los ejercicios de entrevista se resuelven con un diccionario."},
 {t:"codigo", p:"Two sum: imprime los índices <code>i j</code> (i &lt; j) de los dos números que suman el objetivo",
  lenguaje:"py",
  c:`<p>Primera línea: los números. Segunda línea: el objetivo. Siempre hay exactamente una solución.</p>`,
  plantilla:"nums = [int(x) for x in input().split()]\nobjetivo = int(input())\n",
  pruebas:[{entrada:"2 7 11 15\n9", salida:"0 1"},{entrada:"3 2 4\n6", salida:"1 2"},{entrada:"3 3\n6", salida:"0 1", oculta:true},{entrada:"-4 10 5 -1 8\n4", salida:"2 3", oculta:true}],
  pista:"Guarda en un diccionario cada valor con su índice. Para cada x, mira si objetivo - x ya está.",
  solucion:`nums = [int(x) for x in input().split()]
objetivo = int(input())
posicion = {}
for i, x in enumerate(nums):
    falta = objetivo - x
    if falta in posicion:
        print(posicion[falta], i)
        break
    posicion[x] = i`,
  why:"O(n) de tiempo y O(n) de espacio, frente a O(n²) con dos bucles. El índice guardado siempre es anterior al actual, así que sale i &lt; j sin ordenar nada."},
 {t:"opcion", p:"¿Qué complejidad tiene two sum con el diccionario?",
  ops:["O(n²)","O(n log n)","O(n) en tiempo y O(n) en espacio","O(1)"],
  ok:2, why:"Una pasada con búsquedas O(1): se cambia memoria por tiempo."},
 {t:"vf", p:"Las operaciones de una tabla hash son O(1) en el peor caso siempre.",
  ok:false, why:"Son O(1) de media; con muchas colisiones empeoran hasta O(n). Java mitiga el peor caso convirtiendo las cubetas grandes en árboles."},
 {t:"opcion", p:"Intentas usar <code>d[[1, 2]] = 'x'</code> en Python y falla. ¿Por qué?",
  ops:["Los diccionarios no admiten listas de valores","Una list es mutable y no es hashable; usa una tupla (1, 2) como clave","Hay que usar corchetes dobles","Falta importar dict"],
  ok:1, why:"Si la clave cambiase después de guardarla, su hash cambiaría y no se volvería a encontrar."}
]},

{
id:"al2n1",
titulo:"Contar, agrupar y recordar",
claves:["Counter cuenta; defaultdict(list) agrupa; set recuerda","La clave de agrupación es la «forma canónica» del elemento (palabra ordenada, tupla de conteos…)","Secuencia consecutiva más larga en O(n) empezando solo por los inicios de racha"],
pasos:[
 {t:"info", eti:"Agrupar", h:"La forma canónica como clave",
  c:`<div class="termbox">from collections import defaultdict

grupos = defaultdict(list)
for p in ["eva", "tea", "ave", "té", "eat"]:
    grupos["".join(sorted(p))].append(p)    # "aev" agrupa eva y ave
# {"aev": ["eva", "ave"], "aet": ["tea", "eat"], "té": ["té"]}</div>
     <p>Dos palabras son anagramas si al ordenar sus letras dan lo mismo. Esa versión ordenada es la <b>clave</b>. Ordenar cada palabra cuesta O(k log k); con solo minúsculas, una tupla de 26 contadores lo deja en O(k).</p>`},
 {t:"info", eti:"Truco de entrevista", h:"Secuencia consecutiva más larga en O(n)",
  c:`<div class="termbox">def mas_larga(nums):
    s = set(nums)
    mejor = 0
    for x in s:
        if x - 1 not in s:          # x empieza una racha
            y = x
            while y + 1 in s:
                y += 1
            mejor = max(mejor, y - x + 1)
    return mejor</div>
     <p>Parece O(n²) por el while, pero solo se entra desde el <b>inicio</b> de cada racha: cada número se visita como mucho dos veces. Ordenar daría O(n log n).</p>`},
 {t:"codigo", p:"Agrupa anagramas: imprime cada grupo en una línea, con las palabras en el orden de entrada y los grupos en el orden en que aparece su primera palabra",
  lenguaje:"py",
  plantilla:"from collections import defaultdict\npalabras = input().split()\n",
  pruebas:[{entrada:"eat tea tan ate nat bat", salida:"eat tea ate\ntan nat\nbat"},{entrada:"roma amor mora ramo", salida:"roma amor mora ramo"},{entrada:"a b a", salida:"a a\nb", oculta:true}],
  pista:"grupos = defaultdict(list); la clave es \"\".join(sorted(p)). Los diccionarios de Python conservan el orden de inserción.",
  solucion:`from collections import defaultdict
palabras = input().split()
grupos = defaultdict(list)
for p in palabras:
    grupos["".join(sorted(p))].append(p)
for g in grupos.values():
    print(*g)`,
  why:"Desde Python 3.7 los diccionarios mantienen el orden de inserción, así que los grupos salen en orden de primera aparición sin hacer nada."},
 {t:"codigo", p:"Imprime la longitud de la secuencia de enteros consecutivos más larga (los números están desordenados y puede haber repetidos)",
  lenguaje:"py",
  plantilla:"nums = [int(x) for x in input().split()]\n",
  pruebas:[{entrada:"100 4 200 1 3 2", salida:"4"},{entrada:"0 3 7 2 5 8 4 6 0 1", salida:"9"},{entrada:"5 5 5", salida:"1", oculta:true},{entrada:"-1 -2 10 11 12 13", salida:"4", oculta:true}],
  pista:"Mete todo en un set. Solo cuenta hacia arriba desde los x que no tienen x - 1 en el set.",
  solucion:`nums = [int(x) for x in input().split()]
s = set(nums)
mejor = 0
for x in s:
    if x - 1 not in s:
        y = x
        while y + 1 in s:
            y += 1
        mejor = max(mejor, y - x + 1)
print(mejor)`,
  why:"Arrancar solo desde los inicios de racha es lo que convierte un aparente O(n²) en O(n)."},
 {t:"codigo", p:"Imprime el primer carácter que no se repite en la cadena, o <code>-</code> si todos se repiten",
  lenguaje:"py",
  plantilla:"s = input()\n",
  pruebas:[{entrada:"catappa", salida:"c"},{entrada:"aabb", salida:"-"},{entrada:"swiss", salida:"w", oculta:true}],
  pista:"Dos pasadas: una con Counter para contar y otra para encontrar el primero con cuenta 1.",
  solucion:`from collections import Counter
s = input()
c = Counter(s)
print(next((ch for ch in s if c[ch] == 1), "-"))`,
  why:"Dos pasadas O(n). La segunda recorre la cadena original, no el contador, para respetar el orden."},
 {t:"opcion", p:"Quieres agrupar palabras que son anagramas y solo tienen letras minúsculas. ¿Qué clave evita ordenar cada palabra?",
  ops:["La primera letra","La longitud","Una tupla con los 26 contadores de letras","El hash de la palabra"],
  ok:2, why:"Contar es O(k) frente a O(k log k) de ordenar, y la tupla es inmutable, así que sirve como clave."},
 {t:"vf", p:"<code>defaultdict(list)</code> crea automáticamente una lista vacía la primera vez que accedes a una clave que no existe.",
  ok:true, why:"Así te ahorras el <code>if clave not in d: d[clave] = []</code>."}
]},

{
id:"al2l3",
titulo:"Cadenas",
claves:["Las cadenas son inmutables: concatenar en bucles puede ser O(n²); acumula en una lista y usa join","Contar letras con un array de 26 o un Counter","Palíndromos, anagramas e invertir palabras son clásicos"],
pasos:[
 {t:"info", eti:"Texto", h:"Técnicas con cadenas",
  c:`<div class="termbox">def son_anagramas(a, b):          # O(n) tiempo, O(1) espacio (26 contadores)
    if len(a) != len(b):
        return False
    c = [0] * 26
    for x, y in zip(a, b):
        c[ord(x) - ord("a")] += 1
        c[ord(y) - ord("a")] -= 1
    return all(v == 0 for v in c)

def es_palindromo(s):
    i, j = 0, len(s) - 1
    while i &lt; j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True</div>
     <p><code>ord(x) - ord("a")</code> convierte una letra minúscula en un índice de 0 a 25 (en Java, <code>c - 'a'</code>).</p>`},
 {t:"info", eti:"Rendimiento", h:"Construir cadenas largas",
  c:`<div class="dg"><div class="dg-tit">dos formas de construir una cadena de n trozos</div><div class="dg-cols"><div class="dg-col"><div class="dg-col-tit">s = s + trozo en un bucle</div><div class="dg-caja aviso doble">puede ser O(n²)<small>cada suma copia la cadena entera</small></div></div><div class="dg-col"><div class="dg-col-tit">partes.append(trozo) y "".join(partes)</div><div class="dg-caja ok doble">O(n)<small>una sola copia al final</small></div></div></div></div>
     <p>En Java el equivalente es <code>StringBuilder</code>. CPython a veces optimiza <code>+=</code>, pero no se garantiza: en una entrevista, usa <code>join</code>.</p>`},
 {t:"opcion", p:"¿Qué complejidad tiene, en general, construir una cadena de n caracteres con <code>s = s + c</code> en un bucle?",
  ops:["O(n)","O(n²): cada concatenación puede copiar toda la cadena","O(log n)","O(1)"],
  ok:1, why:"Con una lista y join, total O(n)."},
 {t:"codigo", p:"Palíndromo válido: ignorando mayúsculas y todo lo que no sea letra o número, imprime <code>true</code> o <code>false</code>",
  lenguaje:"py",
  plantilla:"s = input()\n",
  pruebas:[{entrada:"A man, a plan, a canal: Panama", salida:"true"},{entrada:"race a car", salida:"false"},{entrada:"Anita lava la tina", salida:"true", oculta:true},{entrada:" ", salida:"true", oculta:true}],
  pista:"Dos punteros desde los extremos; salta los caracteres que no cumplan isalnum() y compara en minúsculas.",
  solucion:`s = input()
i, j = 0, len(s) - 1
ok = True
while i < j:
    if not s[i].isalnum():
        i += 1
    elif not s[j].isalnum():
        j -= 1
    elif s[i].lower() != s[j].lower():
        ok = False
        break
    else:
        i += 1
        j -= 1
print("true" if ok else "false")`,
  why:"Con dos punteros no creas una cadena limpia intermedia: O(n) de tiempo y O(1) de espacio."},
 {t:"codigo", p:"Invierte el orden de las palabras (quitando espacios sobrantes)",
  lenguaje:"py",
  plantilla:"s = input()\n",
  pruebas:[{entrada:"el cielo es azul", salida:"azul es cielo el"},{entrada:"  hola   mundo  ", salida:"mundo hola"},{entrada:"uno", salida:"uno", oculta:true}],
  pista:"split() sin argumentos ya descarta los espacios repetidos. Luego invierte y une con \" \".join.",
  solucion:`s = input()
print(" ".join(reversed(s.split())))`,
  why:"split() sin argumentos separa por cualquier secuencia de espacios y descarta los extremos. En entrevista, a veces piden hacerlo en el sitio sobre un array de caracteres: invertir todo y luego cada palabra."},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["¿Es palíndromo?","Dos punteros desde los extremos"],["¿Son anagramas?","Contar letras con 26 contadores o un Counter"],["Invertir el orden de las palabras","split, invertir y unir"],["Construir una cadena larga","Acumular en una lista y join"]],
  why:"Casi todos los ejercicios de cadenas se reducen a contar, dos punteros o ventana deslizante."},
 {t:"vf", p:"<code>ord(\"c\") - ord(\"a\")</code> vale 2.",
  ok:true, why:"Restar códigos da la distancia entre letras: a=0, b=1, c=2."}
]},

{
id:"al2n2",
titulo:"Matrices y cuadrículas",
claves:["m[f][c]: fila primero, columna después; filas = len(m), columnas = len(m[0])","Vecinos con una lista de direcciones y comprobando límites","Rotar 90° = trasponer + invertir cada fila"],
pasos:[
 {t:"info", eti:"Dos dimensiones", h:"Recorrer una cuadrícula",
  c:`<div class="termbox">m = [[1, 2, 3],
     [4, 5, 6]]
filas, cols = len(m), len(m[0])          # 2 filas, 3 columnas

DIRS = [(1, 0), (-1, 0), (0, 1), (0, -1)]  # abajo, arriba, derecha, izquierda
def vecinos(f, c):
    for df, dc in DIRS:
        nf, nc = f + df, c + dc
        if 0 &lt;= nf &lt; filas and 0 &lt;= nc &lt; cols:
            yield nf, nc

traspuesta = [list(fila) for fila in zip(*m)]   # [[1, 4], [2, 5], [3, 6]]</div>
     <div class="nota ojo"><b class="tit">Trampa de Python</b><code>[[0] * 3] * 2</code> crea dos referencias a la <b>misma</b> fila: cambiar una cambia la otra. Usa <code>[[0] * 3 for _ in range(2)]</code>.</div>`},
 {t:"info", eti:"Clásico", h:"Rotar una matriz 90°",
  c:`<div class="dg"><div class="dg-tit">rotar en el sentido de las agujas del reloj</div><div class="dg-flujo">
<div class="dg-caja"><div class="dg-pila"><div class="dg-fila"><div class="dg-caja">1</div><div class="dg-caja">2</div></div><div class="dg-fila"><div class="dg-caja">3</div><div class="dg-caja">4</div></div></div><small>original</small></div>
<div class="dg-caja"><div class="dg-pila"><div class="dg-fila"><div class="dg-caja">1</div><div class="dg-caja">3</div></div><div class="dg-fila"><div class="dg-caja">2</div><div class="dg-caja">4</div></div></div><small>traspuesta</small></div>
<div class="dg-caja ok"><div class="dg-pila"><div class="dg-fila"><div class="dg-caja">3</div><div class="dg-caja">1</div></div><div class="dg-fila"><div class="dg-caja">4</div><div class="dg-caja">2</div></div></div><small>cada fila invertida</small></div>
</div></div>
     <p>Para rotar en sentido contrario: invertir cada fila y después trasponer (o trasponer e invertir el orden de las filas).</p>`},
 {t:"codigo", p:"Rota 90° en el sentido de las agujas del reloj una matriz cuadrada",
  lenguaje:"py",
  c:`<p>Primera línea: n. Después, n líneas con n números. Imprime la matriz rotada, una fila por línea.</p>`,
  plantilla:"n = int(input())\nm = [[int(x) for x in input().split()] for _ in range(n)]\n",
  pruebas:[{entrada:"2\n1 2\n3 4", salida:"3 1\n4 2"},{entrada:"3\n1 2 3\n4 5 6\n7 8 9", salida:"7 4 1\n8 5 2\n9 6 3"},{entrada:"1\n5", salida:"5", oculta:true}],
  pista:"Traspón con zip(*m) y luego invierte cada fila: [list(reversed(f)) for f in zip(*m)].",
  solucion:`n = int(input())
m = [[int(x) for x in input().split()] for _ in range(n)]
rotada = [list(reversed(f)) for f in zip(*m)]
for fila in rotada:
    print(*fila)`,
  why:"En entrevista a veces piden hacerlo en el sitio (O(1) de espacio): intercambiar m[i][j] con m[j][i] para j &gt; i y después invertir cada fila."},
 {t:"codigo", p:"Recorrido en espiral: imprime los elementos de la matriz en espiral, empezando arriba a la izquierda y en el sentido de las agujas del reloj",
  lenguaje:"py",
  c:`<p>Primera línea: filas y columnas. Después, la matriz. Imprime los valores separados por espacios.</p>`,
  plantilla:"f, c = map(int, input().split())\nm = [[int(x) for x in input().split()] for _ in range(f)]\n",
  pruebas:[{entrada:"3 3\n1 2 3\n4 5 6\n7 8 9", salida:"1 2 3 6 9 8 7 4 5"},{entrada:"3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", salida:"1 2 3 4 8 12 11 10 9 5 6 7"},{entrada:"1 3\n1 2 3", salida:"1 2 3", oculta:true},{entrada:"3 1\n1\n2\n3", salida:"1 2 3", oculta:true}],
  pista:"Cuatro límites: arriba, abajo, izq, der. Recorre la fila de arriba, la columna derecha, la fila de abajo (si queda) y la columna izquierda (si queda), y estrecha los límites.",
  solucion:`f, c = map(int, input().split())
m = [[int(x) for x in input().split()] for _ in range(f)]
arriba, abajo, izq, der = 0, f - 1, 0, c - 1
res = []
while arriba <= abajo and izq <= der:
    for j in range(izq, der + 1):
        res.append(m[arriba][j])
    arriba += 1
    for i in range(arriba, abajo + 1):
        res.append(m[i][der])
    der -= 1
    if arriba <= abajo:
        for j in range(der, izq - 1, -1):
            res.append(m[abajo][j])
        abajo -= 1
    if izq <= der:
        for i in range(abajo, arriba - 1, -1):
            res.append(m[i][izq])
        izq += 1
print(*res)`,
  why:"Las comprobaciones antes de la fila de abajo y la columna izquierda evitan repetir elementos en matrices de una sola fila o columna: justo los casos ocultos."},
 {t:"opcion", p:"¿Qué problema tiene <code>tablero = [[0] * 3] * 3</code> seguido de <code>tablero[0][0] = 1</code>?",
  ops:["Ninguno","Las tres filas son la misma lista: la primera columna de todas pasa a valer 1","Da error de índice","Crea una matriz de 9 filas"],
  ok:1, why:"Multiplicar una lista de listas copia referencias, no filas. Es un bug clásico en ejercicios de matrices y DP."},
 {t:"escribe", p:"En una matriz <code>m</code> de Python, ¿qué expresión da el número de columnas?",
  sol:["len(m[0])"], pista:"Longitud de una fila.",
  why:"len(m) son las filas; len(m[0]) las columnas (si la matriz no está vacía)."}
]}

]});
