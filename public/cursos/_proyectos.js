/* =====================================================================
   CATAPPA — proyectos por curso
   Cada proyecto se desbloquea cuando llevas terminadas las unidades que
   necesita (desdeUnidad), así que van de fácil a difícil según lo que ya
   sabes. Dos formas de entregarlo:
     · codigo    → se corrige de verdad, con casos de prueba
     · checklist → lo haces en tu máquina y marcas los criterios
   ===================================================================== */
window.PROYECTOS = {

/* ---------------- Docker ---------------- */
docker: [
  {
    id: "dk-p1", titulo: "Tu primer contenedor servido", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "20 min",
    resumen: "Levanta una web estática dentro de un contenedor de nginx, publícala en un puerto de tu máquina y compruébala desde el navegador.",
    objetivos: ["Usar docker run con puerto publicado", "Montar tu carpeta dentro del contenedor", "Leer logs y parar el contenedor"],
    pasos: [
      "Crea una carpeta <code>web/</code> con un <code>index.html</code> que ponga tu nombre.",
      "Levanta nginx montando esa carpeta: <code>docker run -d --name mi-web -p 8080:80 -v \"$PWD/web:/usr/share/nginx/html:ro\" nginx:1.27-alpine</code>",
      "Abre <code>http://localhost:8080</code> y comprueba que se ve tu página.",
      "Mira los registros con <code>docker logs mi-web</code> y localiza tu petición.",
      "Párala y bórrala con <code>docker rm -f mi-web</code>."
    ],
    criterios: ["La página se ve en el navegador en el puerto 8080", "El contenido viene de tu carpeta, no de la imagen", "Sabes ver los logs del contenedor", "Has borrado el contenedor al terminar"],
    entrega: { tipo: "checklist" }
  },
  {
    id: "dk-p2", titulo: "Empaqueta una API en una imagen pequeña", nivel: "Intermedio", desdeUnidad: 4, tiempo: "45 min",
    resumen: "Escribe un Dockerfile multi-stage para una aplicación tuya (o el ejemplo del curso) y consigue que la imagen final pese lo menos posible.",
    objetivos: ["Separar compilación y ejecución con multi-stage", "Aprovechar la caché de capas", "Ejecutar como usuario sin privilegios"],
    pasos: [
      "Parte de un Dockerfile de una sola etapa que compile y ejecute.",
      "Divídelo en dos etapas: una con las herramientas de compilación y otra solo con lo necesario para ejecutar.",
      "Copia primero el fichero de dependencias (pom.xml, package.json, requirements.txt) y después el código.",
      "Añade <code>USER</code>, <code>EXPOSE</code> y un <code>HEALTHCHECK</code>.",
      "Compara tamaños con <code>docker images</code> y apunta la diferencia."
    ],
    criterios: ["El Dockerfile usa multi-stage", "La imagen final no incluye compilador ni dependencias de construcción", "El contenedor no se ejecuta como root", "Has medido el antes y el después con docker images"],
    entrega: { tipo: "checklist" }
  },
  {
    id: "dk-p3", titulo: "Un stack completo con Compose", nivel: "Avanzado", desdeUnidad: 6, tiempo: "1 h",
    resumen: "Levanta con un solo comando una API, una base de datos y un panel de administración, con datos que sobreviven a los reinicios.",
    objetivos: ["Escribir un compose.yml con tres servicios", "Usar volúmenes con nombre y healthchecks", "Configurar por variables de entorno"],
    pasos: [
      "Define los servicios <code>api</code>, <code>db</code> (PostgreSQL) y <code>adminer</code>.",
      "Conecta la API a la base de datos por el nombre del servicio, no por localhost.",
      "Añade un volumen con nombre para los datos de PostgreSQL.",
      "Añade un healthcheck a la base de datos y <code>depends_on</code> con <code>condition: service_healthy</code>.",
      "Comprueba que al hacer <code>docker compose down</code> y <code>up</code> los datos siguen ahí."
    ],
    criterios: ["Todo se levanta con docker compose up -d", "La API encuentra la base de datos por su nombre de servicio", "Los datos sobreviven a down y up", "Las contraseñas vienen de variables, no están escritas en el compose"],
    entrega: { tipo: "checklist" }
  },
  {
    id: "dk-p4", titulo: "Arregla un stack roto", nivel: "Experto", desdeUnidad: 9, tiempo: "40 min",
    resumen: "Te dan un compose y un Dockerfile con fallos típicos. Encuéntralos y arréglalos usando el método de diagnóstico.",
    objetivos: ["Leer errores y localizar la causa", "Reconocer los fallos habituales de YAML y de Dockerfile", "Validar antes de levantar"],
    pasos: [
      "Escribe un compose con estos fallos a propósito: un tabulador en la indentación, <code>depends_on: db</code> como texto y puertos sin comillas.",
      "Ejecuta <code>docker compose config</code> y arregla lo que te diga, uno a uno.",
      "Haz lo mismo con un Dockerfile que use <code>FROM openjdk:latest</code>, copie todo antes de las dependencias y arranque con Maven.",
      "Deja los dos ficheros corregidos y anota qué cambiaste y por qué."
    ],
    criterios: ["docker compose config no da errores", "El Dockerfile usa una imagen fijada y multi-stage", "Sabes explicar cada arreglo", "El stack arranca y responde"],
    entrega: { tipo: "checklist" }
  }
],

/* ---------------- Python ---------------- */
python: [
  {
    id: "py-p1", titulo: "Calculadora de propinas", nivel: "Fundamentos", desdeUnidad: 1, tiempo: "15 min",
    resumen: "Lee el importe de una cuenta y un porcentaje de propina, y muestra la propina y el total redondeados a dos decimales.",
    objetivos: ["Leer entradas y convertirlas a número", "Operar y redondear", "Dar formato a la salida"],
    pasos: ["Lee dos líneas: el importe y el porcentaje.", "Calcula la propina y el total.", "Imprime dos líneas con dos decimales: primero la propina, después el total."],
    criterios: ["Funciona con decimales", "Redondea a dos decimales", "Imprime exactamente dos líneas"],
    entrega: {
      tipo: "codigo", lenguaje: "py",
      plantilla: "importe = float(input())\nporcentaje = float(input())\n# calcula e imprime la propina y el total\n",
      pruebas: [
        { entrada: "50\n10", salida: "5.00\n55.00" },
        { entrada: "23.45\n15", salida: "3.52\n26.97" },
        { entrada: "100\n0", salida: "0.00\n100.00", oculta: true }
      ],
      solucion: "importe = float(input())\nporcentaje = float(input())\npropina = importe * porcentaje / 100\nprint(f\"{propina:.2f}\")\nprint(f\"{importe + propina:.2f}\")"
    }
  },
  {
    id: "py-p2", titulo: "Analizador de texto", nivel: "Intermedio", desdeUnidad: 3, tiempo: "30 min",
    resumen: "Lee un texto de varias líneas y devuelve un pequeño informe: número de líneas, de palabras y la palabra más repetida.",
    objetivos: ["Leer toda la entrada", "Usar listas y diccionarios", "Ordenar por frecuencia"],
    pasos: ["Lee todas las líneas hasta el final de la entrada.", "Cuenta líneas y palabras.", "Cuenta cuántas veces aparece cada palabra en minúsculas.", "Imprime tres líneas: lineas=N, palabras=N y top=palabra."],
    criterios: ["Cuenta bien líneas y palabras", "No distingue mayúsculas de minúsculas para el recuento", "En caso de empate vale cualquiera de las más repetidas"],
    entrega: {
      tipo: "codigo", lenguaje: "py",
      plantilla: "import sys\ntexto = sys.stdin.read()\n# imprime lineas=, palabras= y top=\n",
      pruebas: [
        { entrada: "hola mundo\nhola catappa", salida: "lineas=2\npalabras=4\ntop=hola" },
        { entrada: "uno dos dos tres tres tres", salida: "lineas=1\npalabras=6\ntop=tres" }
      ],
      solucion: "import sys\nfrom collections import Counter\ntexto = sys.stdin.read()\nlineas = [l for l in texto.split(\"\\n\") if l.strip()]\npalabras = texto.split()\nc = Counter(p.lower() for p in palabras)\nprint(f\"lineas={len(lineas)}\")\nprint(f\"palabras={len(palabras)}\")\nprint(f\"top={c.most_common(1)[0][0]}\")"
    }
  },
  {
    id: "py-p3", titulo: "Agenda de tareas por consola", nivel: "Avanzado", desdeUnidad: 6, tiempo: "45 min",
    resumen: "Procesa una lista de órdenes (añadir, completar, listar) y muestra el estado final de la agenda.",
    objetivos: ["Estructurar datos con listas y diccionarios", "Recorrer órdenes y aplicar cambios", "Dar formato a un informe"],
    pasos: ["Lee órdenes línea a línea: <code>add titulo</code>, <code>done numero</code> o <code>list</code>.", "Guarda las tareas en orden de llegada.", "Cuando llegue <code>list</code>, imprime cada tarea como <code>[x] titulo</code> o <code>[ ] titulo</code>."],
    criterios: ["Las tareas se numeran desde 1", "done marca la tarea indicada", "list imprime todas en orden"],
    entrega: {
      tipo: "codigo", lenguaje: "py",
      plantilla: "import sys\nfor linea in sys.stdin:\n    linea = linea.strip()\n    # procesa add / done / list\n",
      pruebas: [
        { entrada: "add comprar pan\nadd estudiar docker\ndone 1\nlist", salida: "[x] comprar pan\n[ ] estudiar docker" },
        { entrada: "add uno\nlist", salida: "[ ] uno" }
      ],
      solucion: "import sys\ntareas = []\nfor linea in sys.stdin:\n    linea = linea.strip()\n    if linea.startswith(\"add \"):\n        tareas.append([linea[4:], False])\n    elif linea.startswith(\"done \"):\n        i = int(linea.split()[1]) - 1\n        if 0 <= i < len(tareas):\n            tareas[i][1] = True\n    elif linea == \"list\":\n        for titulo, hecha in tareas:\n            print(f\"[{'x' if hecha else ' '}] {titulo}\")"
    }
  }
],

/* ---------------- JavaScript ---------------- */
javascript: [
  {
    id: "js-p1", titulo: "Formateador de precios", nivel: "Fundamentos", desdeUnidad: 1, tiempo: "15 min",
    resumen: "Convierte una lista de números en precios con dos decimales y el símbolo del euro.",
    objetivos: ["Recorrer un array", "Dar formato a números", "Imprimir por consola"],
    pasos: ["Parte del array que ya está en la plantilla.", "Imprime una línea por precio, con dos decimales y el símbolo € al final."],
    criterios: ["Dos decimales siempre", "Una línea por precio", "El símbolo va detrás del número"],
    entrega: {
      tipo: "codigo", lenguaje: "js",
      plantilla: "const precios = [3, 12.5, 0.99];\n// imprime cada uno como 3.00 €\n",
      pruebas: [{ salida: "3.00 €\n12.50 €\n0.99 €" }],
      solucion: "const precios = [3, 12.5, 0.99];\nfor (const p of precios) console.log(p.toFixed(2) + \" €\");"
    }
  },
  {
    id: "js-p2", titulo: "Resumen de un carrito", nivel: "Intermedio", desdeUnidad: 4, tiempo: "30 min",
    resumen: "A partir de una lista de productos, calcula el total, el producto más caro y cuántas unidades hay.",
    objetivos: ["Usar map, filter y reduce", "Trabajar con objetos", "Componer un informe"],
    pasos: ["Recorre el array de productos de la plantilla.", "Calcula unidades totales, importe total y el nombre del más caro.", "Imprime tres líneas: unidades=, total= (dos decimales) y caro=."],
    criterios: ["El total multiplica precio por cantidad", "El más caro se decide por precio unitario", "La salida son exactamente tres líneas"],
    entrega: {
      tipo: "codigo", lenguaje: "js",
      plantilla: "const carrito = [\n  { nombre: \"teclado\", precio: 45.5, cantidad: 1 },\n  { nombre: \"raton\", precio: 19.9, cantidad: 2 },\n  { nombre: \"monitor\", precio: 199, cantidad: 1 }\n];\n// imprime unidades=, total= y caro=\n",
      pruebas: [{ salida: "unidades=4\ntotal=284.30\ncaro=monitor" }],
      solucion: "const carrito = [\n  { nombre: \"teclado\", precio: 45.5, cantidad: 1 },\n  { nombre: \"raton\", precio: 19.9, cantidad: 2 },\n  { nombre: \"monitor\", precio: 199, cantidad: 1 }\n];\nconst unidades = carrito.reduce((a, p) => a + p.cantidad, 0);\nconst total = carrito.reduce((a, p) => a + p.precio * p.cantidad, 0);\nconst caro = carrito.reduce((a, p) => p.precio > a.precio ? p : a).nombre;\nconsole.log(`unidades=${unidades}`);\nconsole.log(`total=${total.toFixed(2)}`);\nconsole.log(`caro=${caro}`);"
    }
  }
],

/* ---------------- Java ---------------- */
java: [
  {
    id: "jv-p1", titulo: "Conversor de temperaturas", nivel: "Fundamentos", desdeUnidad: 1, tiempo: "20 min",
    resumen: "Lee una temperatura en grados Celsius y muéstrala en Fahrenheit y en Kelvin.",
    objetivos: ["Leer con Scanner", "Operar con decimales", "Dar formato a la salida"],
    pasos: ["Lee un número decimal por teclado.", "Calcula F = C * 9/5 + 32 y K = C + 273.15.", "Imprime dos líneas con un decimal: primero Fahrenheit y después Kelvin."],
    criterios: ["Acepta decimales", "Un decimal en la salida", "Dos líneas exactas"],
    entrega: {
      tipo: "codigo", lenguaje: "java",
      plantilla: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        // imprime Fahrenheit y Kelvin\n    }\n}\n",
      pruebas: [
        { entrada: "100", salida: "212.0\n373.2" },
        { entrada: "0", salida: "32.0\n273.2" }
      ],
      solucion: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        System.out.printf(\"%.1f%n\", c * 9 / 5 + 32);\n        System.out.printf(\"%.1f%n\", c + 273.15);\n    }\n}"
    }
  },
  {
    id: "jv-p2", titulo: "Notas de una clase", nivel: "Intermedio", desdeUnidad: 5, tiempo: "35 min",
    resumen: "Lee nombres y notas, y muestra la media de la clase y quién ha sacado la nota más alta.",
    objetivos: ["Leer varias líneas", "Usar colecciones", "Calcular media y máximo"],
    pasos: ["Lee líneas con el formato <code>nombre nota</code> hasta que se acabe la entrada.", "Calcula la media con dos decimales.", "Imprime <code>media=</code> y <code>mejor=</code> con el nombre de la nota más alta."],
    criterios: ["La media tiene dos decimales", "El mejor es quien tiene la nota más alta", "Funciona con una sola línea"],
    entrega: {
      tipo: "codigo", lenguaje: "java",
      plantilla: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // lee nombre y nota mientras haya líneas\n    }\n}\n",
      pruebas: [
        { entrada: "ana 8\nluis 6.5\nmarta 9.25", salida: "media=7.92\nmejor=marta" },
        { entrada: "pablo 10", salida: "media=10.00\nmejor=pablo" }
      ],
      solucion: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double suma = 0, mejorNota = -1;\n        int n = 0;\n        String mejor = \"\";\n        while (sc.hasNext()) {\n            String nombre = sc.next();\n            double nota = sc.nextDouble();\n            suma += nota; n++;\n            if (nota > mejorNota) { mejorNota = nota; mejor = nombre; }\n        }\n        System.out.printf(\"media=%.2f%n\", suma / n);\n        System.out.println(\"mejor=\" + mejor);\n    }\n}"
    }
  }
],

/* ---------------- SQL ---------------- */
sql: [
  {
    id: "sq-p1", titulo: "Consulta una tabla de pedidos", nivel: "Intermedio", desdeUnidad: 3, tiempo: "25 min",
    resumen: "Con una tabla de pedidos ya creada, escribe la consulta que saca el total gastado por cliente, de mayor a menor.",
    objetivos: ["Agrupar con GROUP BY", "Ordenar los resultados", "Dar formato a la salida"],
    pasos: ["La plantilla ya crea la tabla y mete filas: no la borres.", "Añade al final la consulta que agrupa por cliente y suma el importe.", "Ordena de mayor a menor gasto."],
    criterios: ["Un resultado por cliente", "Ordenado de mayor a menor", "La suma es correcta"],
    entrega: {
      tipo: "codigo", lenguaje: "sql",
      plantilla: "CREATE TABLE pedidos (cliente TEXT, importe REAL);\nINSERT INTO pedidos VALUES ('ana', 30), ('luis', 12.5), ('ana', 20), ('marta', 99);\n\n-- escribe aquí tu consulta\n",
      pruebas: [{ salida: "marta|99.0\nana|50.0\nluis|12.5" }],
      solucion: "CREATE TABLE pedidos (cliente TEXT, importe REAL);\nINSERT INTO pedidos VALUES ('ana', 30), ('luis', 12.5), ('ana', 20), ('marta', 99);\n\nSELECT cliente, SUM(importe) FROM pedidos GROUP BY cliente ORDER BY SUM(importe) DESC;"
    }
  }
],

/* ---------------- Linux ---------------- */
linux: [
  {
    id: "lx-p1", titulo: "Informe de una carpeta", nivel: "Intermedio", desdeUnidad: 4, tiempo: "25 min",
    resumen: "Escribe un script de terminal que reciba líneas con nombres de ficheros y cuente cuántos hay de cada extensión.",
    objetivos: ["Leer la entrada estándar", "Usar tuberías y comandos de texto", "Ordenar y contar"],
    pasos: ["Lee los nombres de la entrada estándar.", "Quédate con la extensión de cada uno.", "Imprime <code>extension numero</code> ordenado alfabéticamente por extensión."],
    criterios: ["Una línea por extensión", "Orden alfabético", "Funciona con cualquier número de ficheros"],
    entrega: {
      tipo: "codigo", lenguaje: "sh",
      plantilla: "# los nombres llegan por la entrada estándar\n",
      pruebas: [
        { entrada: "a.txt\nb.txt\nc.md", salida: "md 1\ntxt 2" },
        { entrada: "solo.sh", salida: "sh 1" }
      ],
      solucion: "sed 's/.*\\.//' | sort | uniq -c | awk '{print $2, $1}'"
    }
  }
]

};
