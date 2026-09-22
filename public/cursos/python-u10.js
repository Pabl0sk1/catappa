window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Pruebas, calidad y ecosistema",
resumen: "pytest y fixtures, ruff y formateo, estructura de proyecto, FastAPI para APIs, pandas para datos y empaquetar en Docker",
nivel: "Experto",
color: "#d2ab22",
lecciones: [

{
id:"py10l1",
titulo:"pytest y calidad",
claves:["pytest: funciones test_ con assert simple","Fixtures para preparar datos; parametrize para muchos casos","ruff para lint y formato; mypy para tipos; todo en el CI"],
pasos:[
 {t:"info", eti:"Probar", h:"pytest",
  c:`<div class="termbox"># test_precios.py
import pytest
from tienda.precios import precio_final

def test_aplica_iva():
    assert precio_final(100) == 121.0

@pytest.mark.parametrize("base,descuento,esperado", [
    (100, 0, 121.0),
    (100, 0.1, 108.9),
    (0, 0, 0),
])
def test_descuentos(base, descuento, esperado):
    assert precio_final(base, descuento=descuento) == pytest.approx(esperado)

def test_rechaza_negativos():
    with pytest.raises(ValueError):
        precio_final(-5)

@pytest.fixture
def carrito():
    return Carrito(items=[Item("teclado", 90)])

def test_total(carrito):
    assert carrito.total() == 90</div>`},
 {t:"term", p:"Ejecuta las pruebas del proyecto en modo silencioso",
  prompt:"pablo@portatil:~/tienda$", sol:["pytest -q","python -m pytest -q","uv run pytest -q"],
  pista:"pytest con -q.",
  salida:`.......                                                        [100%]
7 passed in 0.12s`, why:"pytest descubre solo los ficheros test_*.py y las funciones test_*."},
 {t:"par", p:"Empareja cada herramienta con su función",
  pares:[["pytest","Ejecutar pruebas"],["ruff check","Detectar errores y malas prácticas (lint)"],["ruff format","Formatear el código"],["mypy","Comprobar los tipos"],["coverage","Medir qué código cubren las pruebas"]],
  why:"ruff sustituye a flake8, isort y black con una sola herramienta muy rápida."}
]},

{
id:"py10l2",
titulo:"APIs con FastAPI y datos con pandas",
claves:["FastAPI: endpoints con type hints, validación con pydantic y OpenAPI automático","pandas: tablas en memoria para analizar CSV, Excel o SQL","Empaqueta en Docker igual que cualquier servicio"],
pasos:[
 {t:"info", eti:"Backend", h:"FastAPI",
  c:`<div class="termbox">from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

class NuevaTarea(BaseModel):
    titulo: str = Field(min_length=1, max_length=200)

@app.get("/api/tareas/{id}")
async def obtener(id: int):
    tarea = await repo.buscar(id)
    if not tarea:
        raise HTTPException(status_code=404, detail="No existe")
    return tarea

@app.post("/api/tareas", status_code=201)
async def crear(t: NuevaTarea):
    return await repo.crear(t)

# uvicorn app:app --reload   -&gt;   /docs muestra Swagger automaticamente</div>`},
 {t:"info", eti:"Datos", h:"pandas",
  c:`<div class="termbox">import pandas as pd

df = pd.read_csv("pedidos.csv", parse_dates=["fecha"])
por_mes = (df[df["estado"] == "pagado"]
           .groupby(df["fecha"].dt.to_period("M"))["total"]
           .agg(["count", "sum", "mean"]))
por_mes.to_excel("informe.xlsx")</div>
     <p>pandas es el «SQL en memoria» de Python: filtrar, agrupar, unir y exportar.</p>`},
 {t:"par", p:"Empareja cada librería con su ámbito",
  pares:[["FastAPI","APIs web asíncronas con validación automática"],["Django","Framework web completo con ORM y panel de administración"],["pandas","Análisis de datos tabulares"],["SQLAlchemy","ORM y acceso a bases de datos"],["Celery","Tareas en segundo plano con colas"]],
  why:"Con este abanico, Python cubre desde scripts hasta servicios completos."},
 {t:"opcion", p:"¿Qué ofrece FastAPI al declarar un parámetro <code>t: NuevaTarea</code>?",
  ops:["Nada especial","Lee el cuerpo JSON, lo valida con pydantic, responde 422 con los errores si no cumple y lo documenta en OpenAPI","Lo guarda en la base de datos","Lo cifra"],
  ok:1, why:"Es lo más parecido en Python a @Valid @RequestBody de Spring."}
]},

{
id:"py10l3",
titulo:"Empaquetar y desplegar Python",
claves:["pyproject.toml describe el proyecto, sus dependencias y sus comandos","Imagen Docker: base slim, dependencias antes que el código, usuario sin root","uv acelera la instalación y fija versiones en uv.lock"],
pasos:[
 {t:"info", eti:"A producción", h:"pyproject y Docker",
  c:`<div class="termbox">[project]
name = "tareas-api"
version = "1.2.0"
requires-python = "&gt;=3.12"
dependencies = ["fastapi&gt;=0.115", "uvicorn[standard]&gt;=0.32", "psycopg[binary]&gt;=3.2"]

[project.scripts]
limpiar = "tareas.cli:main"          # comando instalable</div>
     <div class="termbox">FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY src/ ./src/
RUN uv sync --frozen --no-dev
RUN useradd -r -u 10001 app
USER app
CMD ["/app/.venv/bin/uvicorn", "tareas.app:app", "--host", "0.0.0.0", "--port", "8000"]</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["pyproject.toml","Metadatos y dependencias del proyecto"],["uv.lock","Versiones exactas instaladas"],["PYTHONUNBUFFERED=1","Que los logs salgan al momento por stdout"],["Copiar dependencias antes que el código","Aprovechar la caché de capas de Docker"],["--host 0.0.0.0","Escuchar fuera del contenedor, no solo en localhost"]],
  why:"Las mismas reglas de Docker que ya dominas, aplicadas a Python."},
 {t:"opcion", p:"Tu API FastAPI funciona en el contenedor pero no responde desde fuera aunque publicaste el puerto. ¿Causa típica?",
  ops:["Falta memoria","uvicorn escucha en 127.0.0.1 (por defecto): hay que indicar --host 0.0.0.0","Python no funciona en Docker","El puerto 8000 está prohibido"],
  ok:1, why:"El mismo error que viste en el curso de Redes con 127.0.0.1 dentro de un contenedor."}
]}

]});
