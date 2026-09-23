window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Control de flujo",
resumen: "if y else, switch moderno, bucles while, do-while, for y for-each, break y continue",
nivel: "Fundamentos",
color: "#e0664a",
lecciones: [

{
id:"jv3l1",
titulo:"if, else y el operador ternario",
claves:["if ejecuta un bloque solo si la condición es verdadera","else if encadena alternativas; else es el caso por defecto","condicion ? a : b elige un valor en una expresión"],
pasos:[
 {t:"info", eti:"Decidir", h:"if y else",
  c:`<div class="termbox">double total = 120.0;
double envio;
if (total &gt;= 100) {
    envio = 0;
} else if (total &gt;= 50) {
    envio = 2.99;
} else {
    envio = 4.99;
}</div>
     <p>Las condiciones se evalúan en orden y solo se ejecuta el <b>primer</b> bloque cuya condición sea verdadera. Pon siempre las llaves, aunque el bloque tenga una sola línea.</p>`},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">int nota = 7;
if (nota &gt;= 5) System.out.println("Aprobado");
else if (nota &gt;= 7) System.out.println("Notable");
else System.out.println("Suspenso");</div>`,
  ops:["Aprobado","Notable","Aprobado y Notable","Suspenso"],
  ok:0, why:"La primera condición ya es cierta y el resto no se evalúa. Las condiciones más específicas deben ir primero."},
 {t:"info", eti:"En una línea", h:"El operador ternario",
  c:`<div class="termbox">String estado = stock &gt; 0 ? "disponible" : "agotado";</div>
     <p>Útil para elegir entre dos valores. Si la lógica crece, vuelve a un if normal por legibilidad.</p>`},
 {t:"hueco", p:"Completa el ternario para que <code>tipo</code> valga «adulto» si la edad es 18 o más, y «menor» si no",
  tpl:"String tipo = edad >= 18 ___ \"adulto\" ___ \"menor\";", banco:["?",":","&&","||"], sol:["?",":"],
  why:"condición ? valorSiCierto : valorSiFalso."},
 {t:"vf", p:"En Java se puede escribir <code>if (cantidad)</code> con un int, como en C, y se considera cierto si no es 0.",
  ok:false, why:"La condición debe ser boolean: if (cantidad > 0). Esto evita muchos errores."},
 {t:"info", eti:"Legibilidad", h:"Salir pronto en vez de anidar",
  c:`<div class="termbox"><span class="cm">// anidado: cuesta seguirlo</span>
if (usuario != null) {
    if (usuario.activo()) {
        if (saldo &gt;= importe) {
            cobrar();
        }
    }
}

<span class="cm">// cláusulas de guarda: cada caso raro sale enseguida</span>
if (usuario == null || !usuario.activo()) return;
if (saldo &lt; importe) return;
cobrar();</div>
     <p>Las <b>cláusulas de guarda</b> tratan primero los casos que no siguen y dejan el camino principal sin sangrar. Es una de las técnicas de legibilidad más usadas en revisiones de código.</p>`},
 {t:"codigo", p:"Calcula el gasto de envío de un pedido",
  lenguaje:"java",
  c:`<p>Lee el total del pedido (decimal). Reglas: desde 100 el envío es gratis (0.00); desde 50, 2.99; por debajo, 4.99. Si el total es negativo imprime <code>error</code>. Si no, imprime <code>envio=X.XX</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double total = sc.nextDouble();\n        // decide el envío\n    }\n}\n",
  pruebas:[{entrada:"120", salida:"envio=0.00"}, {entrada:"50", salida:"envio=2.99"}, {entrada:"49.99", salida:"envio=4.99"}, {entrada:"-3", salida:"error", oculta:true}, {entrada:"100", salida:"envio=0.00", oculta:true}],
  pista:"Primero el caso de error (guarda), después if (total >= 100) ... else if (total >= 50) ... else ...",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double total = sc.nextDouble();\n        if (total < 0) {\n            System.out.println(\"error\");\n            return;\n        }\n        double envio;\n        if (total >= 100) envio = 0;\n        else if (total >= 50) envio = 2.99;\n        else envio = 4.99;\n        System.out.printf(\"envio=%.2f%n\", envio);\n    }\n}",
  why:"Las pruebas en los bordes (50 y 100 exactos) son las que cazan el error de poner &gt; en vez de &gt;=."}
]},

{
id:"jv3l2",
titulo:"switch moderno",
claves:["switch con flechas (->) no necesita break y no «cae» al siguiente caso","switch como expresión devuelve un valor; yield en bloques","Funciona con int, String, enum y, con pattern matching, con tipos"],
pasos:[
 {t:"info", eti:"Muchas alternativas", h:"switch con flechas",
  c:`<div class="termbox">String dia = "sabado";
switch (dia) {
    case "sabado", "domingo" -&gt; System.out.println("Fin de semana");
    case "viernes"           -&gt; System.out.println("Casi");
    default                  -&gt; System.out.println("Laborable");
}

<span class="cm">// como expresion: devuelve un valor</span>
double iva = switch (categoria) {
    case ALIMENTACION -&gt; 0.04;
    case LIBROS       -&gt; 0.04;
    case HOSTELERIA   -&gt; 0.10;
    default           -&gt; 0.21;
};</div>`},
 {t:"info", eti:"Lo antiguo", h:"El switch clásico y su trampa",
  c:`<div class="termbox">switch (nivel) {
    case 1:
        System.out.println("Uno");
        <span class="cm">// falta break: sigue ejecutando el caso 2 ("fall-through")</span>
    case 2:
        System.out.println("Dos");
        break;
}</div>
     <p>Con <code>nivel = 1</code> imprime «Uno» y «Dos». Lo verás en código antiguo; en código nuevo, usa flechas.</p>`},
 {t:"opcion", p:"¿Qué ventaja tiene <code>switch</code> con <code>-&gt;</code> sobre el clásico con <code>case X:</code>?",
  ops:["Es más lento pero más seguro","No hay caída accidental entre casos, puede devolver un valor y, con enums, el compilador avisa si faltan casos","Solo acepta números","Ninguna"],
  ok:1, why:"Menos errores y código más corto. Disponible desde Java 14."},
 {t:"par", p:"Empareja cada elemento del switch con su función",
  pares:[["case A, B ->","Varios valores con la misma acción"],["default ->","Cualquier otro valor"],["yield","Devolver un valor desde un bloque dentro de un switch expresión"],["break","Salir de un switch clásico para no caer al siguiente caso"]],
  why:"yield se usa cuando un caso necesita varias líneas: case X -> { ...; yield valor; }."},
 {t:"vf", p:"Un switch expresión sobre un enum que cubre todos sus valores no necesita default.",
  ok:true, why:"El compilador comprueba que es exhaustivo; si añades un valor al enum, te avisará."},
 {t:"opcion", p:"¿Qué valor tiene <code>r</code>?", c:`<div class="termbox">int n = 3;
String r = switch (n) {
    case 1, 2 -&gt; "poco";
    case 3 -&gt; {
        String base = "justo";
        yield base.toUpperCase();
    }
    default -&gt; "mucho";
};</div>`,
  ops:["\"justo\"","\"JUSTO\"","\"mucho\"","No compila: falta break"],
  ok:1, why:"En un bloque se usa yield para devolver el valor del caso. Con flechas no hay break ni caída."},
 {t:"codigo", p:"Días de un mes con un switch expresión",
  lenguaje:"java",
  c:`<p>Lee el número de mes (1-12) y el año. Imprime cuántos días tiene ese mes. Febrero tiene 29 días en año bisiesto: divisible entre 4 y no entre 100, o divisible entre 400. Si el mes no existe, imprime <code>-1</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int mes = sc.nextInt();\n        int anio = sc.nextInt();\n        int dias = 0; // usa un switch expresión\n        System.out.println(dias);\n    }\n}\n",
  pruebas:[{entrada:"1 2025", salida:"31"}, {entrada:"4 2025", salida:"30"}, {entrada:"2 2024", salida:"29"}, {entrada:"2 1900", salida:"28", oculta:true}, {entrada:"2 2000", salida:"29", oculta:true}, {entrada:"13 2025", salida:"-1", oculta:true}],
  pista:"case 4, 6, 9, 11 -> 30; case 2 -> bisiesto ? 29 : 28; case 1, 3, 5, 7, 8, 10, 12 -> 31; default -> -1;",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int mes = sc.nextInt();\n        int anio = sc.nextInt();\n        boolean bisiesto = (anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0;\n        int dias = switch (mes) {\n            case 4, 6, 9, 11 -> 30;\n            case 2 -> bisiesto ? 29 : 28;\n            case 1, 3, 5, 7, 8, 10, 12 -> 31;\n            default -> -1;\n        };\n        System.out.println(dias);\n    }\n}",
  why:"En código real usarías <code>YearMonth.of(anio, mes).lengthOfMonth()</code> de java.time, que ya conoce las reglas del calendario."}
]},

{
id:"jv3l3",
titulo:"Bucles while y do-while",
claves:["while repite mientras la condición sea cierta; puede no ejecutarse nunca","do-while ejecuta al menos una vez","Cuidado con los bucles infinitos: algo debe cambiar la condición"],
pasos:[
 {t:"info", eti:"Repetir", h:"while",
  c:`<div class="termbox">int intentos = 0;
boolean conectado = false;
while (!conectado &amp;&amp; intentos &lt; 3) {
    conectado = intentarConectar();
    intentos++;
}</div>
     <p>Se comprueba la condición <b>antes</b> de cada vuelta. Si al principio es falsa, el cuerpo no se ejecuta nunca.</p>`},
 {t:"info", eti:"Al menos una vez", h:"do-while",
  c:`<div class="termbox">String opcion;
do {
    opcion = leerOpcionDelMenu();
    procesar(opcion);
} while (!opcion.equals("salir"));</div>`},
 {t:"opcion", p:"¿Cuántas veces se imprime «hola»?", c:`<div class="termbox">int i = 10;
while (i &lt; 5) {
    System.out.println("hola");
    i++;
}</div>`,
  ops:["0","1","5","Infinitas"],
  ok:0, why:"La condición es falsa desde el principio. Con do-while se imprimiría una vez."},
 {t:"opcion", p:"¿Qué le pasa a este bucle?", c:`<div class="termbox">int i = 0;
while (i &lt; 10) {
    System.out.println(i);
}</div>`,
  ops:["Imprime del 0 al 9","Nunca termina: i no cambia nunca","No compila","Imprime 10"],
  ok:1, why:"Falta i++. Bucle infinito: la aplicación se queda colgada consumiendo CPU."},
 {t:"vf", p:"Un <code>do-while</code> se ejecuta siempre al menos una vez.",
  ok:true, why:"La condición se comprueba al final de cada vuelta."},
 {t:"info", eti:"Leer hasta el final", h:"Bucles con centinela",
  c:`<div class="termbox"><span class="cm">// hasta un valor especial (centinela)</span>
int n = sc.nextInt();
while (n != 0) {
    suma += n;
    n = sc.nextInt();
}

<span class="cm">// hasta que se acabe la entrada</span>
while (sc.hasNextInt()) {
    suma += sc.nextInt();
}</div>
     <p>Cuando no sabes cuántas vueltas habrá (datos de un fichero, reintentos, un menú), <code>while</code> es el bucle natural.</p>`},
 {t:"codigo", p:"Pasos de la conjetura de Collatz",
  lenguaje:"java",
  c:`<p>Lee un entero positivo <code>n</code>. Mientras no valga 1: si es par, divídelo entre 2; si es impar, conviértelo en <code>3n + 1</code>. Imprime cuántos pasos hacen falta para llegar a 1.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        int pasos = 0;\n        // bucle while\n        System.out.println(pasos);\n    }\n}\n",
  pruebas:[{entrada:"6", salida:"8"}, {entrada:"7", salida:"16"}, {entrada:"27", salida:"111", oculta:true}, {entrada:"1", salida:"0", oculta:true}],
  pista:"while (n != 1) { n = (n % 2 == 0) ? n / 2 : 3 * n + 1; pasos++; }",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        int pasos = 0;\n        while (n != 1) {\n            n = (n % 2 == 0) ? n / 2 : 3 * n + 1;\n            pasos++;\n        }\n        System.out.println(pasos);\n    }\n}",
  why:"Con n = 1 el bucle no se ejecuta ni una vez: justo lo que distingue a while de do-while. Se usa long porque los valores intermedios crecen mucho."},
 {t:"codigo", p:"Suma y cuenta números hasta el centinela 0",
  lenguaje:"java",
  c:`<p>Lee enteros hasta encontrar un <code>0</code> (que no cuenta). Imprime <code>n=CANTIDAD suma=SUMA</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // lee hasta el 0\n    }\n}\n",
  pruebas:[{entrada:"4 6 10 0", salida:"n=3 suma=20"}, {entrada:"0", salida:"n=0 suma=0"}, {entrada:"-5\n5\n7\n0\n99", salida:"n=3 suma=7", oculta:true}],
  pista:"int x = sc.nextInt(); while (x != 0) { n++; suma += x; x = sc.nextInt(); }",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = 0, suma = 0;\n        int x = sc.nextInt();\n        while (x != 0) {\n            n++;\n            suma += x;\n            x = sc.nextInt();\n        }\n        System.out.println(\"n=\" + n + \" suma=\" + suma);\n    }\n}",
  why:"Lo que va después del centinela (el 99 de la prueba oculta) no se lee: el bucle ya terminó."}
]},

{
id:"jv3l4",
titulo:"Bucles for, for-each, break y continue",
claves:["for (inicio; condición; paso) cuando conoces el número de vueltas","for-each (for (T x : coleccion)) para recorrer colecciones y arrays","break sale del bucle; continue salta a la siguiente vuelta"],
pasos:[
 {t:"info", eti:"Contar", h:"for clásico",
  c:`<div class="termbox">for (int i = 0; i &lt; 5; i++) {
    System.out.println("Vuelta " + i);     <span class="cm">// 0, 1, 2, 3, 4</span>
}
for (int i = 10; i &gt; 0; i -= 2) { ... }     <span class="cm">// 10, 8, 6, 4, 2</span></div>
     <p>Tres partes: <b>inicio</b> (se ejecuta una vez), <b>condición</b> (antes de cada vuelta) y <b>paso</b> (al final de cada vuelta).</p>`},
 {t:"info", eti:"Recorrer", h:"for-each",
  c:`<div class="termbox">List&lt;String&gt; nombres = List.of("Ana", "Luis", "Marta");
for (String nombre : nombres) {
    System.out.println(nombre);
}</div>
     <p>Se lee «para cada nombre en nombres». Es la forma preferida cuando no necesitas el índice.</p>`},
 {t:"orden", p:"Ordena en qué momento se ejecuta cada parte de <code>for (int i = 0; i &lt; 3; i++)</code> en la primera vuelta",
  items:["int i = 0 (inicio, una sola vez)","i < 3 (se comprueba la condición)","Se ejecuta el cuerpo del bucle","i++ (el paso)","Se vuelve a comprobar i < 3"],
  why:"Entender este orden evita errores de «uno de más o de menos» (off-by-one)."},
 {t:"info", eti:"Controlar", h:"break y continue",
  c:`<div class="termbox">for (Pedido p : pedidos) {
    if (p.cancelado()) continue;      <span class="cm">// salta este y sigue con el siguiente</span>
    if (p.total() &gt; 10_000) {
        alertar(p);
        break;                        <span class="cm">// sale del bucle por completo</span>
    }
    procesar(p);
}</div>`},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">for (int i = 1; i &lt;= 5; i++) {
    if (i == 3) continue;
    if (i == 5) break;
    System.out.print(i + " ");
}</div>`,
  ops:["1 2 3 4 5","1 2 4","1 2","1 2 4 5"],
  ok:1, why:"El 3 se salta con continue y al llegar al 5 el break termina antes de imprimirlo."},
 {t:"vf", p:"Dentro de un for-each sobre una <code>ArrayList</code> se pueden eliminar elementos de esa misma lista sin problema.",
  ok:false, why:"Lanza ConcurrentModificationException. Se usa un Iterator con remove(), o lista.removeIf(...)."},
 {t:"info", eti:"Bucles anidados", h:"break con etiqueta",
  c:`<div class="termbox">buscar:
for (int f = 0; f &lt; filas; f++) {
    for (int c = 0; c &lt; cols; c++) {
        if (tabla[f][c] == objetivo) {
            System.out.println(f + "," + c);
            break buscar;          <span class="cm">// sale de LOS DOS bucles</span>
        }
    }
}</div>
     <p>Un <code>break</code> normal solo sale del bucle más interno. Con una etiqueta sales del exterior. Se usa poco: a menudo queda más claro extraer el bucle a un método y hacer <code>return</code>.</p>`},
 {t:"codigo", p:"FizzBuzz, la prueba clásica de las entrevistas",
  lenguaje:"java",
  c:`<p>Lee <code>n</code> e imprime los números del 1 al n, uno por línea, pero: si es múltiplo de 3 imprime <code>Fizz</code>; si es de 5, <code>Buzz</code>; si es de ambos, <code>FizzBuzz</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // bucle for\n    }\n}\n",
  pruebas:[{entrada:"5", salida:"1\n2\nFizz\n4\nBuzz"}, {entrada:"15", salida:"1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz"}, {entrada:"1", salida:"1", oculta:true}],
  pista:"Comprueba primero i % 15 == 0 (o i % 3 == 0 && i % 5 == 0); si lo dejas para el final, nunca llegará.",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) System.out.println(\"FizzBuzz\");\n            else if (i % 3 == 0) System.out.println(\"Fizz\");\n            else if (i % 5 == 0) System.out.println(\"Buzz\");\n            else System.out.println(i);\n        }\n    }\n}",
  why:"El error típico es comprobar el 3 antes que el 15: el 15 imprimiría Fizz. El caso más específico, primero."},
 {t:"codigo", p:"Mínimo común múltiplo con un bucle y break",
  lenguaje:"java",
  c:`<p>Lee dos enteros positivos <code>a</code> y <code>b</code>. Con un bucle, busca el menor número mayor que 0 que sea múltiplo de ambos y usa <code>break</code> en cuanto lo encuentres.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        // busca con un bucle y break\n    }\n}\n",
  pruebas:[{entrada:"4 6", salida:"12"}, {entrada:"5 7", salida:"35"}, {entrada:"8 8", salida:"8", oculta:true}],
  pista:"Prueba m = mayor, 2·mayor, 3·mayor... y para en el primero que sea divisible entre a y entre b.",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        int mayor = Math.max(a, b);\n        for (int m = mayor; ; m += mayor) {\n            if (m % a == 0 && m % b == 0) {\n                System.out.println(m);\n                break;\n            }\n        }\n    }\n}",
  why:"Un for sin condición (;;) es un bucle infinito controlado por break. Avanzar de mayor en mayor ahorra vueltas; con el máximo común divisor sería mcm = a / mcd(a, b) * b."}
]}

]});
