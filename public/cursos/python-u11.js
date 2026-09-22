window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Maestría: retos y entrevista",
resumen: "Preguntas trampa, ejercicios típicos y simulacro de entrevista de Python",
nivel: "Maestro",
color: "#c49f16",
lecciones: [

{
id:"py11l1",
titulo:"Retos y preguntas trampa",
claves:["Mutabilidad, valores por defecto, is frente a ==","Comprensiones, generadores y decoradores","Explicar la solución y su complejidad"],
pasos:[
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">a = [1, 2, 3]
b = a
b.append(4)
print(a)</div>`,
  ops:["[1, 2, 3]","[1, 2, 3, 4]","Error","None"],
  ok:1, why:"a y b son el mismo objeto. Para copiar: b = a.copy() o list(a)."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">matriz = [[0] * 3] * 3
matriz[0][0] = 1
print(matriz)</div>`,
  ops:["[[1, 0, 0], [0, 0, 0], [0, 0, 0]]","[[1, 0, 0], [1, 0, 0], [1, 0, 0]]","Error","[[1, 1, 1], [0, 0, 0], [0, 0, 0]]"],
  ok:1, why:"* 3 repite la misma lista interna tres veces. Correcto: [[0] * 3 for _ in range(3)]."},
 {t:"opcion", p:"«Cuenta las palabras más frecuentes de un texto». ¿Solución idiomática?",
  ops:["Un bucle con muchos if","Counter(texto.lower().split()).most_common(10)","Ordenar alfabéticamente","Un diccionario con try/except en cada palabra"],
  ok:1, why:"Conocer la librería estándar (collections, itertools, functools) es parte de ser «pythónico»."},
 {t:"par", p:"Empareja cada problema con la herramienta idiomática",
  pares:[["Contar apariciones","collections.Counter"],["Agrupar en listas por clave","collections.defaultdict(list)"],["Cachear una función pura","functools.cache"],["Recorrer por lotes","itertools.batched"],["Quitar duplicados manteniendo el orden","list(dict.fromkeys(xs))"]],
  why:"Evita reinventar lo que ya trae Python."}
]},

{
id:"py11l2",
titulo:"Simulacro de entrevista de Python",
claves:["Sabes explicar tipos mutables e inmutables, el GIL y la concurrencia","Dominas funciones, POO, generadores, decoradores y gestores de contexto","Sabes automatizar y probar con el ecosistema moderno"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Diferencia entre lista y tupla?»",
  ops:["Ninguna","La lista es mutable; la tupla es inmutable, más ligera, puede ser clave de diccionario y se usa para registros fijos","La tupla es más lenta","La lista no admite tipos mezclados"],
  ok:1, why:"Menciona que una tupla con una lista dentro no es «totalmente» inmutable."},
 {t:"opcion", p:"«¿Qué es el GIL y cómo afecta al rendimiento?»",
  ops:["Un gestor de paquetes","Un bloqueo de CPython que permite ejecutar bytecode de Python en un solo hilo a la vez: los hilos sirven para E/S, y para CPU se usan procesos o librerías en C","Un tipo de lista","El recolector de basura"],
  ok:1, why:"Añade la versión experimental sin GIL de Python 3.13 para nota."},
 {t:"opcion", p:"«¿Qué es un decorador?»",
  ops:["Un comentario especial","Una función que recibe otra función y devuelve una versión envuelta; @d encima de def f equivale a f = d(f)","Una clase abstracta","Un tipo de bucle"],
  ok:1, why:"Un ejemplo (cronometrar o reintentar) cierra la respuesta."},
 {t:"opcion", p:"«¿Generador o lista?»",
  ops:["Siempre lista","Generador cuando la secuencia es grande o infinita y se recorre una vez: memoria constante; lista cuando necesitas índices, len o recorrerla varias veces","Siempre generador","Son iguales"],
  ok:1, why:"Ejemplo: leer un log enorme línea a línea."},
 {t:"opcion", p:"«¿Cómo gestionas las dependencias de un proyecto?»",
  ops:["pip install global","Un entorno virtual por proyecto (venv o uv), dependencias declaradas en pyproject.toml con versiones fijadas en un lock, y la misma instalación en el CI y en Docker","Copiando carpetas","Con conda siempre"],
  ok:1, why:"Reproducibilidad: lo que funciona en tu máquina funciona en el CI y en producción."},
 {t:"info", eti:"Terminado", h:"Has completado Python",
  c:`<p>Dominas la sintaxis, las estructuras de datos, funciones y módulos, ficheros y errores, la POO y las dataclasses, generadores, decoradores y gestores de contexto, el tipado, la concurrencia, la automatización y el ecosistema de pruebas y servicios.</p>
     <p>Para consolidarlo: escribe un script de mantenimiento real (limpiar imágenes Docker antiguas por nombre, comprobar la salud de tus servicios y avisar por Slack) con argparse, logging, subprocess y pruebas con pytest, y ejecútalo desde un CronJob de Kubernetes.</p>`}
]}

]});
