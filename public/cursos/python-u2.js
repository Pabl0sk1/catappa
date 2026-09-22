window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Textos, números y decisiones",
resumen: "Operadores, cadenas y f-strings, métodos de texto, if/elif/else, match, bucles while y for, y range",
nivel: "Fundamentos",
color: "#f2d16d",
lecciones: [

{
id:"py2l1",
titulo:"Operadores",
claves:["// división entera, % resto, ** potencia","and, or, not; comparaciones encadenadas: 0 < x < 10","== compara valor; is compara identidad (úsalo con None)"],
pasos:[
 {t:"info", eti:"Calcular y comparar", h:"Operadores",
  c:`<div class="termbox">17 // 5      # 3   division entera
17 % 5       # 2   resto
2 ** 10      # 1024
round(3.14159, 2)   # 3.14

0 &lt; edad &lt; 120              # comparaciones encadenadas
activo and not bloqueado
nombre or "Invitado"        # devuelve el primero "verdadero"

x is None                   # comprobar None: con is
lista_a == lista_b          # mismo contenido
lista_a is lista_b          # mismo objeto</div>`},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["7 // 2","3"],["7 % 2","1"],["2 ** 3","8"],["7 / 2","3.5"],["not True","False"]],
  why:"// y % se usan juntos a menudo: divmod(7, 2) devuelve (3, 1)."},
 {t:"opcion", p:"¿Cuál es la forma correcta de comprobar si una variable es None?",
  ops:["x == None","x is None","x === None","isNone(x)"],
  ok:1, why:"None es único; se compara por identidad con is (PEP 8)."},
 {t:"vf", p:"En Python se puede escribir <code>if 0 &lt; x &lt; 10:</code>.",
  ok:true, why:"Las comparaciones encadenadas equivalen a 0 < x and x < 10."}
]},

{
id:"py2l2",
titulo:"Cadenas y f-strings",
claves:["Las cadenas son inmutables; comillas simples o dobles, triples para varias líneas","f-strings: f\"{variable:formato}\"","Métodos: upper, strip, split, join, replace, startswith; slicing con [inicio:fin]"],
pasos:[
 {t:"info", eti:"Texto", h:"Trabajar con cadenas",
  c:`<div class="termbox">nombre = "Ana Ruiz"
nombre.upper()                 # 'ANA RUIZ'
nombre.lower()
"  hola  ".strip()             # 'hola'
"a,b,c".split(",")             # ['a', 'b', 'c']
"-".join(["2026", "09", "22"]) # '2026-09-22'
nombre.replace("Ana", "Eva")
nombre.startswith("An")        # True
"ruiz" in nombre.lower()       # True
len(nombre)                    # 8

nombre[0]      # 'A'
nombre[-1]     # 'z'
nombre[0:3]    # 'Ana'  (el fin no se incluye)
nombre[::-1]   # 'ziuR anA' (invertida)

total = 1234.5
f"Total: {total:,.2f} €"       # 'Total: 1,234.50 €'
f"{nombre!r:&gt;15}"              # alineado a la derecha con comillas</div>`},
 {t:"par", p:"Empareja cada expresión con su resultado sobre <code>s = \"python\"</code>",
  pares:[["s[0]","\"p\""],["s[-2:]","\"on\""],["s[1:4]","\"yth\""],["s.upper()","\"PYTHON\""],["len(s)","6"]],
  why:"El slicing funciona igual en listas y tuplas."},
 {t:"escribe", p:"Escribe una f-string que produzca <code>Hola, Ana</code> usando la variable <code>nombre</code>",
  sol:["f\"Hola, {nombre}\"","f'Hola, {nombre}'"], ph:"f\"...\"", pista:"f delante de las comillas y la variable entre llaves.", why:"f\"Hola, {nombre}\""},
 {t:"opcion", p:"¿Cuál es la forma eficiente de unir 10.000 palabras con espacios?",
  ops:["Un bucle con +=","\" \".join(palabras)","str(palabras)","palabras.concat()"],
  ok:1, why:"join construye la cadena de una vez; += crea miles de cadenas intermedias."}
]},

{
id:"py2l3",
titulo:"if, elif, else y match",
claves:["if / elif / else con dos puntos y sangría","Valores falsy: False, None, 0, \"\", [], {}, set()","match (Python 3.10+) compara con patrones"],
pasos:[
 {t:"info", eti:"Decidir", h:"Condiciones",
  c:`<div class="termbox">if total &gt;= 100:
    envio = 0
elif total &gt;= 50:
    envio = 2.99
else:
    envio = 4.99

if not lista:                       # lista vacia
    print("Nada que procesar")

estado = "activo" if pagado else "pendiente"     # expresion condicional

match comando.split():
    case ["salir"]:
        terminar()
    case ["abrir", fichero]:
        abrir(fichero)
    case ["copiar", origen, destino]:
        copiar(origen, destino)
    case _:
        print("Comando desconocido")</div>`},
 {t:"par", p:"Empareja cada valor con cómo se evalúa en un if",
  pares:[["[]","Falso: lista vacía"],["[0]","Verdadero: la lista tiene un elemento"],["\"\"","Falso: cadena vacía"],["None","Falso"],["\"False\"","Verdadero: es un texto no vacío"]],
  why:"if not lista: es la forma idiomática de comprobar si está vacía."},
 {t:"opcion", p:"¿Qué hace <code>case [\"abrir\", fichero]:</code> dentro de un match?",
  ops:["Compara con el texto literal fichero","Coincide con una lista de dos elementos cuyo primero es abrir y asigna el segundo a la variable fichero","Abre un fichero","Error de sintaxis"],
  ok:1, why:"match no es un simple switch: desestructura y captura."},
 {t:"vf", p:"En Python se escribe <code>else if</code> para encadenar condiciones.",
  ok:false, why:"Se escribe elif."}
]},

{
id:"py2l4",
titulo:"Bucles",
claves:["for recorre cualquier iterable: listas, cadenas, diccionarios, ficheros","range(inicio, fin, paso) genera secuencias de números","enumerate da índice y valor; zip recorre varias secuencias a la vez"],
pasos:[
 {t:"info", eti:"Repetir", h:"for y while",
  c:`<div class="termbox">for nombre in ["Ana", "Luis", "Marta"]:
    print(nombre)

for i in range(5):            # 0, 1, 2, 3, 4
    ...
for i in range(10, 0, -2):    # 10, 8, 6, 4, 2
    ...

for i, tarea in enumerate(tareas, start=1):
    print(f"{i}. {tarea}")

for nombre, nota in zip(nombres, notas):
    print(nombre, nota)

intentos = 0
while intentos &lt; 3 and not conectado:
    conectado = conectar()
    intentos += 1              # no existe ++ en Python</div>`},
 {t:"par", p:"Empareja cada expresión con lo que genera",
  pares:[["range(3)","0, 1, 2"],["range(1, 4)","1, 2, 3"],["range(0, 10, 3)","0, 3, 6, 9"],["enumerate([\"a\", \"b\"])","(0, \"a\"), (1, \"b\")"],["zip([1, 2], [\"x\", \"y\"])","(1, \"x\"), (2, \"y\")"]],
  why:"Evita for i in range(len(lista)): usa enumerate."},
 {t:"opcion", p:"¿Cómo incrementas un contador en Python?",
  ops:["contador++","contador += 1","++contador","inc(contador)"],
  ok:1, why:"Python no tiene operadores ++ ni --."},
 {t:"vf", p:"Un bucle <code>for</code> puede tener un bloque <code>else</code> que se ejecuta si el bucle termina sin break.",
  ok:true, why:"Poco conocido y útil para búsquedas: si no se encontró nada (no hubo break), se ejecuta el else."}
]}

]});
