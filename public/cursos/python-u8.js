window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Tipado y concurrencia",
resumen: "Type hints y mypy, Protocol y TypedDict, pydantic, el GIL, hilos, procesos y asyncio",
nivel: "Avanzado",
color: "#dcb534",
lecciones: [

{
id:"py8l1",
titulo:"Tipado estático y pydantic",
claves:["Type hints + mypy (o pyright) detectan errores sin ejecutar","Protocol para tipado estructural; TypedDict para diccionarios con forma","pydantic valida datos en tiempo de ejecución a partir de los tipos"],
pasos:[
 {t:"info", eti:"Tipos que ayudan", h:"Type hints",
  c:`<div class="termbox">from typing import Protocol, TypedDict

def media(valores: list[float]) -&gt; float | None:
    return sum(valores) / len(valores) if valores else None

class Notificador(Protocol):              # cualquier clase con este metodo encaja
    def enviar(self, destino: str, texto: str) -&gt; None: ...

class UsuarioDict(TypedDict):
    id: int
    email: str</div>
     <div class="termbox">pablo@portatil:~/app$ mypy src/
src/pedidos.py:14: error: Argument 1 to "media" has incompatible type "list[str]"; expected "list[float]"</div>`},
 {t:"info", eti:"Validar", h:"pydantic",
  c:`<div class="termbox">from pydantic import BaseModel, EmailStr, Field

class NuevoUsuario(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    email: EmailStr
    edad: int = Field(ge=0)

u = NuevoUsuario.model_validate({"nombre": "Ana", "email": "ana@x.com", "edad": "31"})
u.edad          # 31 (convertido a int)
NuevoUsuario.model_validate({"nombre": "", "email": "mal"})   # ValidationError con los detalles</div>
     <p>FastAPI usa pydantic para validar peticiones y generar la documentación OpenAPI automáticamente.</p>`},
 {t:"par", p:"Empareja cada herramienta con su papel",
  pares:[["Type hints","Anotar los tipos esperados"],["mypy o pyright","Comprobar los tipos sin ejecutar"],["pydantic","Validar y convertir datos en tiempo de ejecución"],["Protocol","Definir una interfaz por forma (duck typing tipado)"]],
  why:"Es la misma división que TypeScript + zod en el mundo JavaScript."},
 {t:"vf", p:"Con type hints, Python rechaza al ejecutar una llamada con tipos incorrectos.",
  ok:false, why:"Los hints no se aplican en ejecución; para eso existe pydantic o comprobaciones propias."}
]},

{
id:"py8l2",
titulo:"El GIL, hilos y procesos",
claves:["El GIL permite que solo un hilo ejecute bytecode de Python a la vez (en CPython clásico)","Hilos: útiles para E/S (red, disco); procesos: para CPU","concurrent.futures ofrece ThreadPoolExecutor y ProcessPoolExecutor"],
pasos:[
 {t:"info", eti:"Hacer varias cosas", h:"Concurrencia en Python",
  c:`<div class="termbox">from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import requests

urls = [...]
with ThreadPoolExecutor(max_workers=20) as ex:          # E/S: hilos
    respuestas = list(ex.map(requests.get, urls))

with ProcessPoolExecutor() as ex:                       # CPU: procesos
    miniaturas = list(ex.map(redimensionar, imagenes))</div>
     <p>El <b>GIL</b> (Global Interpreter Lock) hace que los hilos no aceleren el cálculo puro en CPython, pero sí la E/S, porque el GIL se libera mientras se espera. Python 3.13 introdujo una versión experimental sin GIL (free-threaded).</p>`},
 {t:"par", p:"Empareja cada tarea con la herramienta adecuada",
  pares:[["Descargar 500 URLs","Hilos o asyncio"],["Redimensionar 10.000 imágenes","Procesos (ProcessPoolExecutor)"],["Miles de conexiones de red simultáneas","asyncio"],["Cálculo numérico sobre arrays","NumPy (código en C que libera el GIL)"]],
  why:"Mucha librería científica corre en C y no sufre el GIL."},
 {t:"opcion", p:"Paralelizas con 8 hilos un cálculo puramente matemático en Python y no va más rápido. ¿Por qué?",
  ops:["Pocos hilos","El GIL: solo un hilo ejecuta código Python a la vez; para CPU usa procesos","Un bug de Python","Falta memoria"],
  ok:1, why:"Pregunta clásica de entrevista sobre Python."}
]},

{
id:"py8l3",
titulo:"asyncio",
claves:["async def define corrutinas; await espera sin bloquear el bucle de eventos","asyncio.gather y TaskGroup ejecutan muchas a la vez","Nunca llames a funciones bloqueantes dentro de código async"],
pasos:[
 {t:"info", eti:"Un hilo, muchas esperas", h:"async y await",
  c:`<div class="termbox">import asyncio, httpx

async def estado(cliente, url):
    r = await cliente.get(url, timeout=5)
    return url, r.status_code

async def main():
    async with httpx.AsyncClient() as cliente:
        async with asyncio.TaskGroup() as tg:
            tareas = [tg.create_task(estado(cliente, u)) for u in urls]
    for t in tareas:
        print(*t.result())

asyncio.run(main())</div>
     <p>Es el mismo modelo que el event loop de JavaScript: mientras una corrutina espera la red, el bucle ejecuta otras.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["async def","Define una corrutina"],["await","Espera un resultado sin bloquear el bucle"],["asyncio.run(main())","Arranca el bucle de eventos"],["asyncio.gather / TaskGroup","Ejecutar varias corrutinas a la vez"],["time.sleep dentro de async","Error: bloquea todo el bucle (usa asyncio.sleep)"]],
  why:"requests es bloqueante: en código async se usa httpx o aiohttp."},
 {t:"opcion", p:"Dentro de una corrutina llamas a <code>requests.get(url)</code>. ¿Qué pasa?",
  ops:["Funciona en paralelo","Bloquea el bucle de eventos: todas las demás corrutinas se detienen mientras espera","Error de sintaxis","Se convierte en async"],
  ok:1, why:"Usa un cliente async (httpx.AsyncClient) o asyncio.to_thread para código bloqueante."}
]},

{
id:"py8l4",
titulo:"Rendimiento en Python",
claves:["Mide primero: cProfile, timeit y py-spy","Estructuras adecuadas (set, dict, deque) y evitar trabajo repetido","Llevar el cálculo pesado a librerías en C (NumPy, pandas) o a procesos"],
pasos:[
 {t:"info", eti:"Medir", h:"Encontrar lo lento",
  c:`<div class="termbox">python -m cProfile -s cumtime script.py | head -20     # donde se va el tiempo
python -m timeit "sum(range(1_000_000))"             # micro-mediciones
py-spy top --pid 4211                                # perfil de un proceso en marcha

from functools import cache
@cache
def tarifa(pais: str) -&gt; float: ...                  # no repetir calculos puros

from collections import deque
cola = deque(maxlen=1000)                             # anadir y quitar por ambos extremos en O(1)</div>`},
 {t:"par", p:"Empareja cada operación lenta con su alternativa rápida",
  pares:[["x in lista (grande)","x in un set"],["lista.pop(0) repetido","collections.deque.popleft()"],["Concatenar cadenas en un bucle","\"\".join(partes)"],["Bucle Python sobre millones de números","Operaciones vectorizadas de NumPy"],["Recalcular una función pura con los mismos datos","functools.cache"]],
  why:"La mayoría de mejoras vienen de elegir bien la estructura de datos."},
 {t:"opcion", p:"Un script tarda 20 minutos. ¿Qué haces primero?",
  ops:["Reescribirlo en otro lenguaje","Perfilarlo con cProfile o py-spy para ver dónde se va el tiempo","Añadir hilos","Comprar un servidor mayor"],
  ok:1, why:"A menudo el 90% del tiempo está en una línea (una consulta en un bucle, una búsqueda en lista)."}
]}

]});
