window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Funciones",
resumen: "def, parámetros por defecto y con nombre, *args y **kwargs, la trampa de los valores mutables, ámbito, lambda y type hints",
nivel: "Intermedio",
color: "#ecc85a",
lecciones: [

{
id:"py4l1",
titulo:"Definir funciones",
claves:["def nombre(parámetros): con return; sin return devuelve None","Argumentos por posición o por nombre; parámetros con valor por defecto","Docstrings para documentar y type hints para indicar tipos"],
pasos:[
 {t:"info", eti:"Reutilizar", h:"def",
  c:`<div class="termbox">def precio_final(base: float, iva: float = 0.21, descuento: float = 0) -&gt; float:
    """Devuelve el precio con IVA aplicando un descuento opcional."""
    return round(base * (1 - descuento) * (1 + iva), 2)

precio_final(100)                        # 121.0
precio_final(100, descuento=0.1)         # por nombre: 108.9
precio_final(base=100, iva=0.10)</div>
     <p>Los <b>type hints</b> (<code>base: float</code>, <code>-&gt; float</code>) no se comprueban al ejecutar, pero el editor y herramientas como mypy los usan para detectar errores.</p>`},
 {t:"escribe", p:"Escribe la primera línea de una función <code>es_par</code> que recibe <code>n</code>",
  sol:["def es_par(n):","def es_par(n: int) -> bool:","def es_par(n: int):"], ph:"def ...", pista:"def, el nombre, los parámetros entre paréntesis y dos puntos.", why:"def es_par(n): return n % 2 == 0"},
 {t:"opcion", p:"¿Qué devuelve una función sin <code>return</code>?",
  ops:["0","None","Una cadena vacía","Error"],
  ok:1, why:"Implícitamente devuelve None."},
 {t:"vf", p:"Los type hints de Python hacen que el intérprete rechace un argumento del tipo incorrecto al ejecutar.",
  ok:false, why:"Son anotaciones: los comprueba mypy o el editor, no el intérprete (salvo librerías como pydantic)."}
]},

{
id:"py4l2",
titulo:"*args, **kwargs y la trampa mutable",
claves:["*args recoge argumentos posicionales en una tupla; **kwargs, los con nombre en un dict","Nunca uses un valor mutable ([], {}) como valor por defecto","Usa None como valor por defecto y crea el objeto dentro"],
pasos:[
 {t:"info", eti:"Argumentos variables", h:"*args y **kwargs",
  c:`<div class="termbox">def registrar(mensaje, *valores, **contexto):
    print(mensaje, valores, contexto)

registrar("pedido", 1, 2, usuario="ana", ip="10.0.0.1")
# pedido (1, 2) {'usuario': 'ana', 'ip': '10.0.0.1'}

numeros = [4, 9, 2]
max(*numeros)                  # desempaquetar al llamar
opciones = {"sep": "-", "end": "\\n"}
print("a", "b", **opciones)</div>`},
 {t:"info", eti:"Error clásico", h:"Valores por defecto mutables",
  c:`<div class="termbox">def anadir(tarea, lista=[]):          # MAL
    lista.append(tarea)
    return lista

anadir("a")    # ['a']
anadir("b")    # ['a', 'b']  !!! la misma lista se reutiliza entre llamadas

def anadir(tarea, lista=None):         # BIEN
    if lista is None:
        lista = []
    lista.append(tarea)
    return lista</div>
     <p>El valor por defecto se crea <b>una sola vez</b>, al definir la función, no en cada llamada.</p>`},
 {t:"opcion", p:"¿Qué imprime la segunda llamada a <code>anadir(\"b\")</code> con la versión incorrecta?",
  ops:["['b']","['a', 'b']","[]","Error"],
  ok:1, why:"Pregunta de entrevista muy repetida en Python."},
 {t:"par", p:"Empareja cada sintaxis con su significado",
  pares:[["def f(*args)","Recoge posicionales en una tupla"],["def f(**kwargs)","Recoge argumentos con nombre en un diccionario"],["f(*lista)","Pasa los elementos como argumentos posicionales"],["f(**dic)","Pasa las claves como argumentos con nombre"]],
  why:"Los decoradores usan *args y **kwargs para envolver cualquier función."}
]},

{
id:"py4l3",
titulo:"Ámbito, lambda y funciones como valores",
claves:["Regla LEGB: local, envolvente, global, integrado","global y nonlocal para reasignar variables de fuera (con moderación)","lambda crea funciones pequeñas; las funciones son objetos que se pasan como argumentos"],
pasos:[
 {t:"info", eti:"Funciones como datos", h:"Orden superior y lambda",
  c:`<div class="termbox">productos.sort(key=lambda p: p["precio"])
mas_caro = max(productos, key=lambda p: p["precio"])
nombres = list(map(str.upper, ["ana", "luis"]))
activos = list(filter(lambda u: u["activo"], usuarios))

def multiplicador(factor):              # closure
    def aplicar(x):
        return x * factor
    return aplicar
triple = multiplicador(3)
triple(5)    # 15</div>
     <p>Las comprensiones suelen ser más legibles que <code>map</code> y <code>filter</code> con lambdas.</p>`},
 {t:"par", p:"Empareja cada ámbito de la regla LEGB con su descripción",
  pares:[["Local","Variables de la función actual"],["Envolvente","Variables de la función que la contiene (closures)"],["Global","Variables del módulo"],["Integrado (built-in)","Nombres de Python como len o print"]],
  why:"Python busca los nombres en ese orden."},
 {t:"opcion", p:"¿Cómo ordenas una lista de diccionarios de usuarios por su edad?",
  ops:["usuarios.sort(\"edad\")","usuarios.sort(key=lambda u: u[\"edad\"])","sorted(usuarios.edad)","usuarios.order_by(\"edad\")"],
  ok:1, why:"key recibe una función que devuelve el valor por el que ordenar. También operator.itemgetter(\"edad\")."},
 {t:"vf", p:"Llamar a una variable igual que una función integrada, como <code>list = [1, 2]</code>, no tiene consecuencias.",
  ok:false, why:"Tapa la función integrada list en ese ámbito: list(...) dejará de funcionar."}
]}

]});
