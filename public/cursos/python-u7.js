window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Python avanzado",
resumen: "Iteradores y generadores, decoradores, gestores de contexto y la librería estándar funcional",
nivel: "Avanzado",
color: "#dcb534",
lecciones: [

{
id:"py7l1",
titulo:"Iteradores y generadores",
claves:["Un generador (función con yield) produce valores bajo demanda","Memoria constante aunque la secuencia sea enorme o infinita","itertools ofrece bloques para combinar iteradores"],
pasos:[
 {t:"info", eti:"Perezoso", h:"yield",
  c:`<div class="termbox">def lineas_con_error(ruta):
    with open(ruta, encoding="utf-8") as f:
        for linea in f:
            if "ERROR" in linea:
                yield linea.rstrip()

for l in lineas_con_error("app.log"):       # procesa un log de 20 GB sin cargarlo
    alertar(l)

def ids():
    n = 1
    while True:
        yield n
        n += 1

import itertools
primeros = list(itertools.islice(ids(), 5))          # [1, 2, 3, 4, 5]
for lote in itertools.batched(registros, 500):       # de 500 en 500 (3.12+)
    insertar(lote)</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Iterable","Algo que se puede recorrer con for"],["Generador","Función con yield que produce valores de uno en uno"],["next(gen)","Pide el siguiente valor"],["StopIteration","Señal de que no hay más valores"],["(x for x in datos)","Expresión generadora"]],
  why:"Leer ficheros línea a línea y paginar APIs son los usos más prácticos."},
 {t:"opcion", p:"¿Qué ventaja tiene un generador frente a devolver una lista con todos los resultados?",
  ops:["Ninguna","Produce cada valor cuando se pide: memoria constante y puede empezar a procesar antes de tener todo","Es más fácil de indexar","Permite len()"],
  ok:1, why:"A cambio, solo se recorre una vez y no admite len ni índices."}
]},

{
id:"py7l2",
titulo:"Decoradores",
claves:["Un decorador es una función que recibe una función y devuelve otra que la envuelve","@decorador encima de def equivale a f = decorador(f)","functools.wraps conserva el nombre y la documentación"],
pasos:[
 {t:"info", eti:"Envolver funciones", h:"Crear un decorador",
  c:`<div class="termbox">import functools, time

def cronometrar(func):
    @functools.wraps(func)
    def envoltura(*args, **kwargs):
        inicio = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__} tardó {time.perf_counter() - inicio:.3f} s")
    return envoltura

def reintentar(veces=3):                      # decorador con parametros
    def decorador(func):
        @functools.wraps(func)
        def envoltura(*args, **kwargs):
            for intento in range(1, veces + 1):
                try:
                    return func(*args, **kwargs)
                except ConnectionError:
                    if intento == veces: raise
                    time.sleep(2 ** intento)
        return envoltura
    return decorador

@cronometrar
@reintentar(veces=5)
def descargar(url): ...</div>`},
 {t:"par", p:"Empareja cada decorador con su uso",
  pares:[["@functools.cache","Memorizar resultados de una función pura"],["@property","Exponer un método como atributo"],["@app.get(\"/ruta\") (FastAPI)","Registrar una función como endpoint"],["@pytest.fixture","Preparar datos o recursos para las pruebas"],["@dataclass","Generar métodos de una clase de datos"]],
  why:"Los decoradores son a Python lo que las anotaciones con proxies a Spring."},
 {t:"opcion", p:"¿Qué es exactamente <code>@cronometrar</code> encima de <code>def f()</code>?",
  ops:["Un comentario","Azúcar sintáctico para f = cronometrar(f)","Una clase","Una importación"],
  ok:1, why:"Entender esto quita toda la magia a los decoradores."}
]},

{
id:"py7l3",
titulo:"Gestores de contexto",
claves:["with garantiza la limpieza aunque haya excepciones","Se crean con __enter__/__exit__ o con @contextmanager","Uso típico: ficheros, conexiones, bloqueos, transacciones, directorios temporales"],
pasos:[
 {t:"info", eti:"Limpieza segura", h:"with a medida",
  c:`<div class="termbox">from contextlib import contextmanager
import os, tempfile

@contextmanager
def en_directorio(ruta):
    anterior = os.getcwd()
    os.chdir(ruta)
    try:
        yield
    finally:
        os.chdir(anterior)             # se restaura siempre

with en_directorio("/tmp"):
    ...

with tempfile.TemporaryDirectory() as tmp:     # se borra al salir
    trabajar_en(tmp)

with conexion.transaction():                   # commit o rollback automatico
    ...</div>`},
 {t:"orden", p:"Ordena lo que ocurre en un bloque <code>with</code>",
  items:["Se llama a __enter__ (o se ejecuta hasta el yield)","Se ejecuta el cuerpo del with","Si hay excepción, se pasa a __exit__","__exit__ limpia (o el código tras el yield en finally)","La excepción se propaga salvo que __exit__ la suprima"],
  why:"Es el try/finally empaquetado de forma reutilizable."},
 {t:"vf", p:"Si ocurre una excepción dentro de un with, el recurso queda sin cerrar.",
  ok:false, why:"Precisamente para eso existe with: la limpieza se ejecuta siempre."}
]}

]});
