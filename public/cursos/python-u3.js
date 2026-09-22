window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Estructuras de datos",
resumen: "Listas, tuplas, diccionarios y conjuntos, slicing, desempaquetado y comprensiones",
nivel: "Fundamentos",
color: "#ecc85a",
lecciones: [

{
id:"py3l1",
titulo:"Listas y tuplas",
claves:["Lista: ordenada y modificable [1, 2, 3]","Tupla: ordenada e inmutable (1, 2, 3); se usa para registros fijos","Desempaquetado: a, b = b, a; primero, *resto = lista"],
pasos:[
 {t:"info", eti:"Secuencias", h:"Listas",
  c:`<div class="termbox">tareas = ["docker", "git"]
tareas.append("sql")            # al final
tareas.insert(0, "linux")       # en una posicion
tareas.remove("git")            # por valor
ultima = tareas.pop()           # quita y devuelve la ultima
tareas.sort()                   # ordena en su sitio
ordenadas = sorted(tareas, key=len, reverse=True)   # copia ordenada
len(tareas); "docker" in tareas; tareas.index("docker")
tareas[1:]                      # slicing
copia = tareas.copy()           # o tareas[:]</div>`},
 {t:"info", eti:"Inmutables", h:"Tuplas y desempaquetado",
  c:`<div class="termbox">punto = (40.4, -3.7)
lat, lon = punto                  # desempaquetar
a, b = b, a                       # intercambiar
primero, *resto = [1, 2, 3, 4]    # primero=1, resto=[2, 3, 4]

def minmax(nums):
    return min(nums), max(nums)   # devuelve una tupla
menor, mayor = minmax([4, 9, 1])</div>`},
 {t:"par", p:"Empareja cada método de lista con su efecto",
  pares:[["append(x)","Añade x al final"],["insert(i, x)","Inserta x en la posición i"],["pop()","Quita y devuelve el último"],["sort()","Ordena la propia lista"],["sorted(lista)","Devuelve una copia ordenada"]],
  why:"sort() devuelve None: lista = lista.sort() es un error clásico."},
 {t:"opcion", p:"¿Qué valor tiene <code>x</code> tras <code>x = [3, 1, 2].sort()</code>?",
  ops:["[1, 2, 3]","None","[3, 1, 2]","Error"],
  ok:1, why:"sort ordena en su sitio y devuelve None. Para obtener una lista ordenada: sorted(...)."},
 {t:"vf", p:"Se puede cambiar un elemento de una tupla con <code>t[0] = 5</code>.",
  ok:false, why:"Las tuplas son inmutables: TypeError."}
]},

{
id:"py3l2",
titulo:"Diccionarios y conjuntos",
claves:["dict: pares clave-valor con acceso rápido por clave","get con valor por defecto; items() para recorrer","set: elementos únicos y operaciones de conjuntos"],
pasos:[
 {t:"info", eti:"Clave y valor", h:"Diccionarios",
  c:`<div class="termbox">usuario = {"nombre": "Ana", "edad": 31}
usuario["email"] = "ana@x.com"          # anadir o cambiar
usuario["telefono"]                     # KeyError si no existe
usuario.get("telefono", "sin teléfono") # valor por defecto
"email" in usuario                      # True
del usuario["edad"]

for clave, valor in usuario.items():
    print(clave, valor)

from collections import Counter, defaultdict
Counter("mississippi").most_common(2)   # [('i', 4), ('s', 4)]
por_ciudad = defaultdict(list)
for c in clientes:
    por_ciudad[c["ciudad"]].append(c)</div>`},
 {t:"info", eti:"Sin repetidos", h:"Conjuntos",
  c:`<div class="termbox">etiquetas = {"python", "docker", "python"}   # {'python', 'docker'}
etiquetas.add("sql")
a = {1, 2, 3}; b = {2, 3, 4}
a | b     # union        {1, 2, 3, 4}
a &amp; b     # interseccion {2, 3}
a - b     # diferencia   {1}
unicos = list(set(emails))                  # quitar duplicados (pierde el orden)
unicos_ordenados = list(dict.fromkeys(emails))   # quitar duplicados manteniendo el orden</div>`},
 {t:"par", p:"Empareja cada estructura con su mejor uso",
  pares:[["list","Colección ordenada que cambia"],["tuple","Registro fijo o clave compuesta de un diccionario"],["dict","Buscar valores por una clave"],["set","Comprobar pertenencia y eliminar duplicados"],["Counter","Contar apariciones"]],
  why:"x in un_set es mucho más rápido que x in una_lista en colecciones grandes."},
 {t:"opcion", p:"¿Qué devuelve <code>config.get(\"puerto\", 8080)</code> si la clave no existe?",
  ops:["None","8080","KeyError","\"puerto\""],
  ok:1, why:"get devuelve el valor por defecto; config[\"puerto\"] lanzaría KeyError."}
]},

{
id:"py3l3",
titulo:"Comprensiones",
claves:["[expresión for x in iterable if condición] crea listas de forma concisa","También para diccionarios {k: v for ...} y conjuntos {x for ...}","Si no cabe en una línea legible, usa un bucle normal"],
pasos:[
 {t:"info", eti:"Transformar y filtrar", h:"List comprehensions",
  c:`<div class="termbox">precios = [10, 25, 40]
con_iva = [p * 1.21 for p in precios]                    # transformar
caros = [p for p in precios if p &gt; 20]                   # filtrar
nombres = [c["nombre"].title() for c in clientes if c["activo"]]

por_id = {p["id"]: p for p in productos}                 # diccionario
dominios = {email.split("@")[1] for email in emails}     # conjunto
total = sum(l["precio"] * l["cantidad"] for l in lineas) # generador (sin crear lista)</div>`},
 {t:"escribe", p:"Crea la lista <code>cuadrados</code> con el cuadrado de cada número de <code>nums</code> usando una comprensión",
  sol:["cuadrados = [n ** 2 for n in nums]","cuadrados = [n * n for n in nums]","cuadrados = [x ** 2 for x in nums]","cuadrados = [x * x for x in nums]"], ph:"cuadrados = [...]", pista:"[n ** 2 for n in nums]", why:"La comprensión recorre nums y aplica la expresión a cada elemento."},
 {t:"opcion", p:"¿Qué devuelve <code>[x for x in range(10) if x % 3 == 0]</code>?",
  ops:["[3, 6, 9]","[0, 3, 6, 9]","[1, 4, 7]","[0, 1, 2]"],
  ok:1, why:"El 0 también es múltiplo de 3."},
 {t:"vf", p:"<code>sum(x for x in datos)</code> crea primero una lista completa en memoria.",
  ok:false, why:"Sin corchetes es una expresión generadora: produce los valores de uno en uno."}
]},

{
id:"py3l4",
titulo:"Mutabilidad, copias e identidad",
claves:["Las variables son nombres que apuntan a objetos; asignar no copia","copy() hace una copia superficial; copy.deepcopy(), una profunda","Solo los objetos inmutables (hashables) pueden ser claves de diccionario"],
pasos:[
 {t:"info", eti:"Nombres y objetos", h:"Asignar no es copiar",
  c:`<div class="termbox">import copy

original = {"nombre": "Ana", "etiquetas": ["python"]}
alias = original                       # mismo objeto
superficial = original.copy()          # dict nuevo, pero la lista de dentro es la misma
profunda = copy.deepcopy(original)     # todo nuevo

superficial["etiquetas"].append("docker")
print(original["etiquetas"])           # ['python', 'docker']  (compartida)
print(profunda["etiquetas"])           # ['python']

id(alias) == id(original)              # True
{(40.4, -3.7): "Madrid"}               # tupla como clave: valido
{[40.4, -3.7]: "Madrid"}               # TypeError: unhashable type: 'list'</div>`},
 {t:"par", p:"Empareja cada tipo con si es mutable",
  pares:[["list","Mutable: se le pueden añadir elementos"],["tuple","Inmutable: sirve como clave compuesta"],["dict","Mutable: no puede ser clave de otro dict"],["str","Inmutable: cada cambio crea otra cadena"],["frozenset","Conjunto inmutable: puede ser clave"]],
  why:"Inmutable y hashable: requisito para ser clave de un dict o elemento de un set."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">def anadir(lista):
    lista.append(4)

numeros = [1, 2, 3]
anadir(numeros)
print(numeros)</div>`,
  ops:["[1, 2, 3]","[1, 2, 3, 4]","None","Error"],
  ok:1, why:"La función recibe el mismo objeto y lo modifica. Igual que con objetos en Java."}
]}

]});
