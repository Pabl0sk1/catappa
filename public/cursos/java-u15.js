window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Maestría: retos y entrevista",
resumen: "Ejercicios de código típicos, preguntas trampa sobre el lenguaje y simulacro de entrevista de Java",
nivel: "Maestro",
color: "#8f2a15",
lecciones: [

{
id:"jv15l1",
titulo:"Retos de código",
claves:["Piensa en voz alta: entrada, salida, casos límite y complejidad","Usa las colecciones adecuadas: HashMap para contar, HashSet para buscar","Escribe primero la solución clara y luego optimiza"],
pasos:[
 {t:"info", eti:"Método", h:"Cómo afrontar un ejercicio en directo",
  c:`<ol><li>Repite el problema con tus palabras y pregunta por los límites: ¿vacío?, ¿null?, ¿duplicados?, ¿tamaño?</li>
     <li>Propón una solución simple y di su complejidad (O(n), O(n²)...).</li>
     <li>Escríbela limpia, con nombres claros.</li>
     <li>Pruébala mentalmente con un ejemplo y un caso límite.</li>
     <li>Mejórala si hace falta (una pasada con un HashMap en vez de dos bucles anidados).</li></ol>`},
 {t:"opcion", p:"«Encuentra si en una lista hay dos números que suman un objetivo». ¿Qué enfoque es O(n)?",
  ops:["Dos bucles anidados probando todas las parejas","Recorrer una vez guardando en un HashSet los vistos y comprobando si objetivo − n ya está","Ordenar con burbuja","Recursión con todas las combinaciones"],
  ok:1, why:"El HashSet da búsquedas en tiempo constante. Es el clásico «two sum»."},
 {t:"opcion", p:"¿Qué hace este código?", c:`<div class="termbox">Map&lt;Character, Long&gt; r = texto.chars()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.groupingBy(c -&gt; c, Collectors.counting()));</div>`,
  ops:["Ordena el texto","Cuenta cuántas veces aparece cada carácter","Elimina duplicados","Invierte el texto"],
  ok:1, why:"groupingBy + counting: frecuencias. Base de ejercicios como «primer carácter no repetido» o «son anagramas»."},
 {t:"opcion", p:"«Invierte un String». ¿Cuál es la forma idiomática?",
  ops:["Un bucle concatenando con +","new StringBuilder(texto).reverse().toString()","texto.reverse()","Arrays.sort"],
  ok:1, why:"String no tiene reverse(); StringBuilder sí."},
 {t:"par", p:"Empareja cada problema con la estructura clave",
  pares:[["Contar frecuencias","HashMap y merge"],["Detectar duplicados","HashSet"],["Paréntesis equilibrados","Una pila (ArrayDeque)"],["Los K elementos mayores","PriorityQueue"],["Mantener orden de llegada y sacar por delante","Cola (ArrayDeque)"]],
  why:"Elegir la estructura correcta es la mitad de la solución."}
]},

{
id:"jv15l2",
titulo:"Preguntas trampa",
claves:["== frente a equals, String inmutable, Integer cache","final, finally y finalize","checked frente a unchecked, sobrecarga frente a sobrescritura"],
pasos:[
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);
System.out.println(c == d);</div>`,
  ops:["true y true","true y false","false y false","Error"],
  ok:1, why:"Java cachea los Integer de −128 a 127, así que a y b son el mismo objeto. 128 crea objetos distintos. Moraleja: compara objetos con equals."},
 {t:"par", p:"Empareja cada término con su significado",
  pares:[["final","Variable no reasignable, método no sobrescribible o clase no heredable"],["finally","Bloque que se ejecuta siempre tras try/catch"],["finalize","Método obsoleto que llamaba el GC; no se usa"],["static","Pertenece a la clase y no a cada objeto"]],
  why:"Tres palabras parecidas, tres conceptos sin relación: pregunta clásica."},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Sobrecarga (overloading)","Mismo nombre, distintos parámetros, en la misma clase"],["Sobrescritura (overriding)","La subclase redefine un método heredado"],["Interfaz","Contrato sin estado; se pueden implementar varias"],["Clase abstracta","Base parcial con estado; solo se hereda de una"]],
  why:"Sobrecarga se resuelve al compilar; sobrescritura, al ejecutar (polimorfismo)."},
 {t:"opcion", p:"¿Por qué String es inmutable en Java?",
  ops:["Por casualidad","Seguridad (rutas, URLs, claves), se puede compartir entre hilos, permite el pool de cadenas y cachear su hashCode para usarlo como clave de HashMap","Para ahorrar memoria solamente","Porque es un primitivo"],
  ok:1, why:"Una respuesta completa menciona varias razones."},
 {t:"opcion", p:"¿Diferencia entre <code>ArrayList</code> y <code>LinkedList</code>?",
  ops:["Ninguna","ArrayList usa un array: acceso por índice O(1) y muy eficiente en memoria; LinkedList usa nodos enlazados: inserciones en extremos baratas pero acceso O(n). En la práctica, ArrayList casi siempre","LinkedList es siempre más rápida","ArrayList no admite duplicados"],
  ok:1, why:"Para colas, ArrayDeque suele ser mejor que LinkedList."}
]},

{
id:"jv15l3",
titulo:"Simulacro de entrevista de Java",
claves:["Has repasado el lenguaje, colecciones, concurrencia y la JVM","Sabes explicar con ejemplos de tu propio código","Estás preparado para una entrevista de backend Java"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta primero. Si puedes, añade un ejemplo de algo que hayas programado.</p>`},
 {t:"opcion", p:"«¿Cómo funciona un HashMap por dentro?»",
  ops:["Es una lista ordenada","Un array de cubetas: el hashCode de la clave elige la cubeta y equals distingue dentro de ella; si una cubeta crece mucho se convierte en árbol; al superar el factor de carga se redimensiona","Una base de datos en memoria","Guarda solo las claves"],
  ok:1, why:"Menciona el contrato equals/hashCode y que las claves deberían ser inmutables."},
 {t:"opcion", p:"«¿Qué son los streams y cuándo no los usarías?»",
  ops:["Ficheros","Una API declarativa para procesar colecciones con operaciones encadenadas y perezosas; evitarlos cuando un bucle sencillo es más claro, hay estado mutable o excepciones comprobadas complicadas","Hilos","Siempre hay que usarlos"],
  ok:1, why:"Saber cuándo no usar algo demuestra criterio."},
 {t:"opcion", p:"«¿Qué novedades de Java 17 a 21 usas?»",
  ops:["Ninguna","Records para DTOs, switch con pattern matching y clases selladas, text blocks, toList() en streams, y en Java 21 hilos virtuales y colecciones secuenciadas","Solo lambdas","Applets"],
  ok:1, why:"Demuestra que tu Java está al día."},
 {t:"opcion", p:"«¿Cómo evitas problemas de concurrencia en un servicio?»",
  ops:["Con synchronized en todo","Servicios sin estado mutable, objetos inmutables, colecciones concurrentes y atomics donde haga falta, y dejar la consistencia a la base de datos con transacciones y bloqueo optimista","Usando un solo hilo","No se puede"],
  ok:1, why:"La mejor sincronización es no necesitarla."},
 {t:"opcion", p:"«Tu aplicación en producción lanza OutOfMemoryError. ¿Qué haces?»",
  ops:["Subir -Xmx y olvidarlo","Recoger un volcado de heap (HeapDumpOnOutOfMemoryError), analizarlo con MAT para ver qué objetos retienen memoria, revisar métricas de heap tras GC, y corregir la fuga o dimensionar según el uso real","Reiniciar cada hora","Desactivar el GC"],
  ok:1, why:"Diagnosticar antes de dimensionar."},
 {t:"opcion", p:"«¿Qué es la inyección de dependencias y por qué por constructor?»",
  ops:["Un tipo de ataque","Que una clase reciba sus colaboradores en lugar de crearlos; por constructor, las dependencias son obligatorias, pueden ser final y la clase se prueba fácilmente con mocks","Un patrón de base de datos","Solo existe en Spring"],
  ok:1, why:"Es el puente perfecto hacia las preguntas de Spring."},
 {t:"info", eti:"Terminado", h:"Has completado Java de cero a experto",
  c:`<p>Dominas la sintaxis, la programación orientada a objetos, excepciones, colecciones y genéricos, programación funcional con streams, el Java moderno, las herramientas de construcción y pruebas, la concurrencia, la JVM por dentro y el diseño de código mantenible.</p>
     <p>Siguiente paso natural: el curso de <b>Spring Boot</b>, donde todo esto se convierte en APIs reales. Y para consolidar: resuelve ejercicios en Exercism o LeetCode (nivel fácil y medio) explicando en voz alta, como en una entrevista.</p>`}
]}

]});
