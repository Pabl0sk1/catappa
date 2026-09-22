window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Módulos, entornos y ficheros",
resumen: "import y paquetes, pip y entornos virtuales, uv y pyproject.toml, errores con try/except, with, pathlib, JSON y CSV",
nivel: "Intermedio",
color: "#e5bf47",
lecciones: [

{
id:"py5l1",
titulo:"Módulos, paquetes y entornos virtuales",
claves:["Cada .py es un módulo; una carpeta con módulos es un paquete","Un entorno virtual aísla las dependencias de cada proyecto","pip install dentro del venv; uv es la alternativa moderna y muy rápida"],
pasos:[
 {t:"info", eti:"Organizar", h:"import",
  c:`<div class="termbox">import json
import os.path
from pathlib import Path
from datetime import datetime, timedelta
from collections import Counter as Contador

from miapp.servicios.pedidos import crear_pedido      # paquete propio</div>`},
 {t:"info", eti:"Aislar dependencias", h:"venv y pip",
  c:`<div class="termbox">python3 -m venv .venv                 # crear el entorno
source .venv/bin/activate             # activarlo (Windows: .venv\\Scripts\\activate)
pip install requests                  # se instala solo en este proyecto
pip freeze &gt; requirements.txt         # fijar versiones
pip install -r requirements.txt       # reproducir en otra maquina
deactivate

# alternativa moderna
uv init mi-script &amp;&amp; uv add requests &amp;&amp; uv run main.py</div>
     <p>Sin entorno virtual, todos los proyectos comparten las mismas versiones instaladas en el sistema y acaban chocando. En distribuciones modernas, <code>pip install</code> global incluso está bloqueado.</p>`},
 {t:"term", p:"Crea un entorno virtual llamado <code>.venv</code> en el proyecto",
  prompt:"pablo@portatil:~/scripts$", sol:["python3 -m venv .venv","python -m venv .venv","py -m venv .venv"],
  pista:"python3 -m venv y el nombre de la carpeta.",
  salida:``, why:"Añade .venv a .gitignore: se recrea con requirements.txt o pyproject.toml."},
 {t:"par", p:"Empareja cada fichero o herramienta con su función",
  pares:[["requirements.txt","Lista de dependencias con versiones fijadas"],["pyproject.toml","Configuración moderna del proyecto y sus dependencias"],["venv","Entorno aislado de paquetes por proyecto"],["uv","Gestor rápido de entornos, dependencias y versiones de Python"],["pipx","Instalar herramientas de línea de comandos aisladas"]],
  why:"En Docker, normalmente no hace falta venv: la imagen ya es un entorno aislado."},
 {t:"vf", p:"Instalar paquetes con pip de forma global en el sistema es la práctica recomendada.",
  ok:false, why:"Usa un entorno virtual por proyecto (o pipx para herramientas)."}
]},

{
id:"py5l2",
titulo:"Errores y excepciones",
claves:["try / except / else / finally","Captura excepciones concretas, nunca un except vacío","raise para lanzar; excepciones propias heredando de Exception"],
pasos:[
 {t:"info", eti:"Cuando algo falla", h:"Gestionar excepciones",
  c:`<div class="termbox">try:
    cantidad = int(entrada)
except ValueError:
    print("No es un número")
else:
    print("Convertido:", cantidad)     # si no hubo excepcion
finally:
    print("Siempre se ejecuta")

class SaldoInsuficiente(Exception):
    pass

def retirar(cuenta, importe):
    if importe &gt; cuenta.saldo:
        raise SaldoInsuficiente(f"Faltan {importe - cuenta.saldo} €")

try:
    guardar(datos)
except (ConnectionError, TimeoutError) as e:
    log.warning("Reintentando: %s", e)
    raise                              # relanzar la misma excepcion</div>`},
 {t:"par", p:"Empareja cada excepción con su causa típica",
  pares:[["KeyError","Clave que no existe en un diccionario"],["IndexError","Índice fuera de la lista"],["ValueError","Valor con el tipo correcto pero inválido: int(\"abc\")"],["TypeError","Operación con tipos incompatibles: \"a\" + 1"],["FileNotFoundError","El fichero no existe"]],
  why:"Leer la última línea del traceback suele bastar para entender el error."},
 {t:"opcion", p:"¿Qué tiene de malo <code>except: pass</code>?",
  ops:["Nada","Oculta cualquier error, incluso Ctrl+C y fallos de programación: el programa sigue en un estado incorrecto sin avisar","Es más lento","No es sintaxis válida"],
  ok:1, why:"Captura lo concreto que sabes gestionar y deja propagar el resto."}
]},

{
id:"py5l3",
titulo:"Ficheros, pathlib, JSON y CSV",
claves:["with open(...) cierra el fichero automáticamente","pathlib.Path para rutas: /, exists, glob, read_text","json.load/dump y csv.DictReader/DictWriter para formatos habituales"],
pasos:[
 {t:"info", eti:"Disco", h:"Leer y escribir",
  c:`<div class="termbox">from pathlib import Path
import json, csv

logs = Path("/var/log/app")
for fichero in logs.glob("*.log"):
    if fichero.stat().st_size &gt; 100_000_000:
        print("Grande:", fichero.name)

with open("config.json", encoding="utf-8") as f:     # se cierra solo
    config = json.load(f)

with open("salida.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

with open("clientes.csv", newline="", encoding="utf-8") as f:
    for fila in csv.DictReader(f):
        print(fila["email"])

with open("grande.log", encoding="utf-8") as f:
    for linea in f:                                   # linea a linea, sin cargar todo
        if "ERROR" in linea:
            print(linea.rstrip())</div>`},
 {t:"par", p:"Empareja cada operación con su código",
  pares:[["Unir rutas","Path(\"datos\") / \"config.json\""],["Comprobar si existe","ruta.exists()"],["Leer todo el texto","ruta.read_text(encoding=\"utf-8\")"],["JSON de texto a objeto","json.loads(texto)"],["Recorrer un fichero enorme","for linea in f:"]],
  why:"with garantiza el cierre aunque haya una excepción, igual que try-with-resources en Java."},
 {t:"opcion", p:"¿Por qué conviene indicar <code>encoding=\"utf-8\"</code> al abrir ficheros de texto?",
  ops:["Por velocidad","Porque la codificación por defecto depende del sistema (en Windows puede no ser UTF-8) y las tildes se estropearían","Porque es obligatorio","Para comprimir"],
  ok:1, why:"Ser explícito evita errores que solo aparecen en otra máquina."},
 {t:"vf", p:"<code>for linea in fichero:</code> carga el fichero entero en memoria antes de empezar.",
  ok:false, why:"Lee línea a línea: sirve para ficheros de gigabytes."}
]},

{
id:"py5l4",
titulo:"Fechas y expresiones regulares",
claves:["datetime con zona horaria (zoneinfo); guarda en UTC y muestra en local","timedelta para sumar y restar tiempo; isoformat para intercambiar","re para buscar y extraer patrones en texto"],
pasos:[
 {t:"info", eti:"Tiempo", h:"datetime y zoneinfo",
  c:`<div class="termbox">from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

ahora = datetime.now(timezone.utc)                  # siempre con zona
madrid = ahora.astimezone(ZoneInfo("Europe/Madrid"))
limite = ahora + timedelta(days=7)
ahora.isoformat()                                   # '2026-09-22T08:15:00+00:00'
datetime.fromisoformat("2026-09-22T10:00:00+02:00")
madrid.strftime("%d/%m/%Y %H:%M")</div>`},
 {t:"info", eti:"Patrones", h:"Expresiones regulares",
  c:`<div class="termbox">import re

linea = '203.0.113.9 - - [22/Sep/2026:10:02:11] "GET /api/tareas HTTP/1.1" 500 123'
patron = re.compile(r'^(\\S+) .* "(\\w+) (\\S+) [^"]*" (\\d{3})')
m = patron.match(linea)
if m:
    ip, metodo, ruta, estado = m.groups()

re.findall(r"\\b[\\w.+-]+@[\\w-]+\\.[\\w.]+\\b", texto)     # todos los emails
re.sub(r"\\d{4}-\\d{4}-\\d{4}-(\\d{4})", r"****-****-****-\\1", texto)   # enmascarar</div>
     <p>El prefijo <code>r"..."</code> (cadena cruda) evita tener que duplicar las barras invertidas.</p>`},
 {t:"par", p:"Empareja cada elemento de una regex con su significado",
  pares:[["\\d","Un dígito"],["\\w","Letra, dígito o guion bajo"],["\\S+","Uno o más caracteres que no son espacio"],["(...)","Grupo que se captura"],["{3}","Exactamente tres repeticiones"]],
  why:"Para parsear logs, las regex son la herramienta estándar."},
 {t:"vf", p:"Conviene guardar las fechas en la base de datos con la zona horaria local del servidor y sin indicar la zona.",
  ok:false, why:"Guarda en UTC (o con zona explícita) y convierte a la zona del usuario al mostrar."}
]}

]});
