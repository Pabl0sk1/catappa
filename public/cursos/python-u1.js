window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Qué es Python",
resumen: "El lenguaje, instalarlo, la consola interactiva, tu primer script, print e input, variables y tipos",
nivel: "Fundamentos",
color: "#f2d16d",
lecciones: [

{
id:"py1l1",
titulo:"Un lenguaje para casi todo",
claves:["Python es un lenguaje interpretado, de tipado dinámico y muy legible","Se usa en automatización, datos, IA, backend y scripting de sistemas","La sangría (indentación) define los bloques"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es Python?",
  c:`<p><b>Python</b> es un lenguaje creado para ser fácil de leer. Su filosofía: «debería haber una forma obvia de hacerlo». Hoy es de los más usados del mundo:</p>
     <ul><li><b>Automatización</b> y scripts de sistemas (lo que en DevOps haces con bash, pero más potente).</li>
     <li><b>Datos e inteligencia artificial</b>: pandas, NumPy, scikit-learn, PyTorch.</li>
     <li><b>Backend</b>: Django, FastAPI, Flask.</li>
     <li>Herramientas de infraestructura: Ansible está escrito en Python, y las SDK de AWS (boto3) son de Python.</li></ul>`},
 {t:"info", eti:"Cómo se ve", h:"Sangría en vez de llaves",
  c:`<div class="termbox">def saludar(nombre):
    if nombre:
        print(f"Hola, {nombre}")
    else:
        print("Hola, desconocido")

saludar("Ana")</div>
     <p>No hay llaves ni punto y coma: los bloques se marcan con <b>sangría</b> (4 espacios por convención) y la línea anterior termina en <code>:</code>. Una sangría incorrecta es un error de sintaxis.</p>`},
 {t:"par", p:"Empareja cada característica con su significado",
  pares:[["Interpretado","Se ejecuta sin compilar antes a un binario"],["Tipado dinámico","Las variables no declaran tipo; los valores sí lo tienen"],["Tipado fuerte","No mezcla tipos sin conversión explícita (\"1\" + 1 da error)"],["Sangría significativa","Los espacios al inicio definen los bloques"]],
  why:"Dinámico pero fuerte: a diferencia de JavaScript, \"1\" + 1 lanza TypeError."},
 {t:"opcion", p:"¿Qué ocurre si dentro de un <code>if</code> una línea tiene 4 espacios y la siguiente 3?",
  ops:["Nada","IndentationError: la sangría define los bloques y debe ser coherente","Se ignora la línea","Se ejecuta fuera del if"],
  ok:1, why:"Configura el editor para insertar 4 espacios al pulsar tabulador."},
 {t:"vf", p:"En Python, <code>\"5\" + 5</code> devuelve \"55\" como en JavaScript.",
  ok:false, why:"Lanza TypeError: Python no convierte tipos implícitamente en esa operación."}
]},

{
id:"py1l2",
titulo:"Instalar y ejecutar",
claves:["python3 --version; en Windows, el lanzador py","La consola interactiva (REPL) prueba código al momento","python3 script.py ejecuta un fichero"],
pasos:[
 {t:"info", eti:"Puesta en marcha", h:"Ejecutar Python",
  c:`<div class="termbox">pablo@portatil:~$ python3 --version
Python 3.13.1
pablo@portatil:~$ python3                 # consola interactiva
&gt;&gt;&gt; 2 + 3
5
&gt;&gt;&gt; "catappa".upper()
'CATAPPA'
&gt;&gt;&gt; exit()
pablo@portatil:~$ python3 hola.py         # ejecutar un script</div>
     <p>Usa siempre <b>Python 3</b> (Python 2 murió en 2020). En muchos Linux, <code>python</code> no existe o apunta a otra cosa: usa <code>python3</code>. En Windows, <code>py</code>. Herramientas como <b>uv</b> o <b>pyenv</b> gestionan varias versiones.</p>`},
 {t:"term", p:"Ejecuta el script <code>backup.py</code> con Python 3",
  prompt:"pablo@servidor:~$", sol:["python3 backup.py","python backup.py","py backup.py"],
  pista:"python3 y el nombre del fichero.",
  salida:`Copiando 128 ficheros...
Backup terminado en /backups/2026-09-22`, why:"Un script de Python es solo un fichero de texto con extensión .py."},
 {t:"info", eti:"Script ejecutable", h:"El shebang",
  c:`<div class="termbox">#!/usr/bin/env python3
"""Limpia ficheros temporales antiguos."""

def main():
    print("Limpiando...")

if __name__ == "__main__":
    main()</div>
     <p><code>if __name__ == "__main__":</code> ejecuta <code>main()</code> solo cuando el fichero se lanza directamente, no cuando otro módulo lo importa.</p>`},
 {t:"opcion", p:"¿Para qué sirve <code>if __name__ == \"__main__\":</code>?",
  ops:["Es obligatorio en todo fichero","Para que ese código se ejecute solo al lanzar el fichero directamente y no al importarlo desde otro","Para declarar la clase principal","Para acelerar el script"],
  ok:1, why:"Permite que un fichero sea a la vez script ejecutable y módulo reutilizable."}
]},

{
id:"py1l3",
titulo:"print, input y variables",
claves:["print muestra valores; input lee texto del usuario","Una variable es un nombre que apunta a un valor; no se declara el tipo","Nombres en snake_case; constantes en MAYÚSCULAS por convención"],
pasos:[
 {t:"info", eti:"Entrada y salida", h:"Primeras líneas",
  c:`<div class="termbox">nombre = input("¿Cómo te llamas? ")      # siempre devuelve texto (str)
edad = int(input("¿Edad? "))              # convertir a numero
print("Hola", nombre)                     # separa con espacio
print(f"{nombre} tiene {edad} años")      # f-string
print("a", "b", sep="-", end="!\\n")       # a-b!

MAX_REINTENTOS = 3                        # constante por convencion
precio_final = 19.99                      # snake_case</div>`},
 {t:"escribe", p:"Crea una variable <code>ciudad</code> con el texto Madrid",
  sol:["ciudad = \"Madrid\"","ciudad = 'Madrid'"], ph:"ciudad = ...", pista:"nombre = \"texto\"", why:"En Python no hace falta let ni el tipo: ciudad = \"Madrid\"."},
 {t:"par", p:"Empareja cada línea con lo que hace",
  pares:[["print(\"Hola\")","Muestra Hola en la consola"],["x = input()","Lee una línea escrita por el usuario (como texto)"],["int(\"42\")","Convierte el texto 42 en el número 42"],["print(f\"{x}!\")","Muestra el valor de x seguido de !"]],
  why:"input siempre devuelve str: conviértelo si necesitas un número."},
 {t:"vf", p:"En Python hay que declarar el tipo de una variable antes de usarla.",
  ok:false, why:"Basta con asignarla. El tipo lo tiene el valor, no la variable."}
]},

{
id:"py1l4",
titulo:"Tipos básicos",
claves:["int, float, str, bool y None","type() muestra el tipo; isinstance() lo comprueba","Todo en Python es un objeto"],
pasos:[
 {t:"info", eti:"Los tipos", h:"Tipos fundamentales",
  c:`<div class="termbox">edad = 31                 # int (enteros de tamano ilimitado)
precio = 19.99            # float
nombre = "Ana"            # str
activo = True             # bool (con mayuscula)
telefono = None           # ausencia de valor (como null)

type(edad)                # &lt;class 'int'&gt;
isinstance(precio, float) # True
2 ** 100                  # 1267650600228229401496703205376 (sin desbordar)</div>`},
 {t:"par", p:"Empareja cada valor con su tipo",
  pares:[["42","int"],["3.14","float"],["\"hola\"","str"],["False","bool"],["None","NoneType"]],
  why:"True, False y None se escriben con mayúscula inicial."},
 {t:"opcion", p:"¿Qué devuelve <code>10 / 4</code> en Python 3?",
  ops:["2","2.5","3","Error"],
  ok:1, why:"/ siempre da float. La división entera es //: 10 // 4 = 2."},
 {t:"vf", p:"Los enteros de Python pueden desbordarse como el int de Java.",
  ok:false, why:"Tienen precisión arbitraria: crecen lo que haga falta."}
]}

]});
