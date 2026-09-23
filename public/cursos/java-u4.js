window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Métodos y arrays",
resumen: "Definir y llamar métodos, parámetros y retorno, sobrecarga, paso por valor, recursión y arrays",
nivel: "Fundamentos",
color: "#e0664a",
lecciones: [

{
id:"jv4l1",
titulo:"Definir y llamar métodos",
claves:["Un método agrupa código reutilizable con un nombre","Firma: modificadores, tipo de retorno, nombre y parámetros","void significa que no devuelve nada; return devuelve un valor y sale"],
pasos:[
 {t:"info", eti:"Reutilizar", h:"Anatomía de un método",
  c:`<div class="termbox">public static double precioConIva(double base, double tipo) {
    double total = base * (1 + tipo);
    return total;
}

<span class="cm">// llamada</span>
double p = precioConIva(100, 0.21);   <span class="cm">// 121.0</span></div>
     <ul><li><code>public static</code>: modificadores (visibilidad y si pertenece a la clase).</li>
     <li><code>double</code>: el <b>tipo de retorno</b>. Si no devuelve nada, <code>void</code>.</li>
     <li><code>precioConIva</code>: el nombre, un verbo en camelCase.</li>
     <li><code>(double base, double tipo)</code>: los <b>parámetros</b>, cada uno con su tipo.</li>
     <li><code>return</code>: devuelve el valor y termina el método.</li></ul>`},
 {t:"par", p:"Empareja cada parte con su significado en <code>public static int sumar(int a, int b)</code>",
  pares:[["public","Visible desde cualquier clase"],["static","Pertenece a la clase, no a un objeto"],["int (antes del nombre)","Tipo de lo que devuelve"],["sumar","Nombre del método"],["(int a, int b)","Parámetros de entrada"]],
  why:"Leer firmas de un vistazo es imprescindible para navegar código ajeno."},
 {t:"escribe", p:"Escribe la primera línea (firma) de un método público y estático llamado <code>esPar</code> que recibe un <code>int n</code> y devuelve un <code>boolean</code>",
  sol:["public static boolean esPar(int n)","public static boolean esPar(int n) {"], ph:"public static ...", pista:"public static, tipo de retorno, nombre y (tipo parámetro).", why:"public static boolean esPar(int n) { return n % 2 == 0; }"},
 {t:"opcion", p:"¿Qué falla en este método?", c:`<div class="termbox">public static int maximo(int a, int b) {
    if (a &gt; b) {
        return a;
    }
}</div>`,
  ops:["Nada","No compila: si a no es mayor que b, no devuelve nada («missing return statement»)","Debería ser void","Falta static"],
  ok:1, why:"Todo camino de un método no void debe terminar en return (o lanzar una excepción)."},
 {t:"vf", p:"Un método <code>void</code> puede usar <code>return;</code> para terminar antes.",
  ok:true, why:"return sin valor sale del método. Útil para cláusulas de guarda: if (lista.isEmpty()) return;"},
 {t:"info", eti:"Buen diseño", h:"Métodos pequeños y con nombre claro",
  c:`<p>Un método debería hacer <b>una cosa</b> y su nombre debería decir cuál. Si para explicarlo necesitas «y» (<i>valida y guarda y envía el correo</i>), probablemente son tres métodos.</p>
     <div class="termbox"><span class="cm">// difícil de probar y de reutilizar</span>
static void procesar(String linea) { ... 60 líneas ... }

<span class="cm">// cada parte se prueba por separado</span>
static Pedido parsear(String linea) { ... }
static boolean esValido(Pedido p) { ... }
static void guardar(Pedido p) { ... }</div>
     <p>Por ahora usamos <code>static</code> porque llamamos a los métodos desde <code>main</code> sin crear objetos. Cuando lleguemos a clases verás métodos de instancia, que trabajan con los datos de un objeto.</p>`},
 {t:"codigo", p:"Escribe <code>esPrimo</code> y úsalo para listar los primos hasta n",
  lenguaje:"java",
  c:`<p>Completa <code>static boolean esPrimo(int n)</code>: un número es primo si es mayor que 1 y solo es divisible entre 1 y él mismo. Basta probar divisores hasta la raíz cuadrada (<code>d * d &lt;= n</code>). El <code>main</code> ya imprime los primos hasta n separados por espacios.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    static boolean esPrimo(int n) {\n        return false; // complétalo\n    }\n\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 2; i <= n; i++) {\n            if (esPrimo(i)) sb.append(i).append(' ');\n        }\n        System.out.println(sb.toString().strip());\n    }\n}\n",
  pruebas:[{entrada:"10", salida:"2 3 5 7"}, {entrada:"30", salida:"2 3 5 7 11 13 17 19 23 29"}, {entrada:"2", salida:"2", oculta:true}],
  pista:"if (n < 2) return false; for (int d = 2; d * d <= n; d++) if (n % d == 0) return false; return true;",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    static boolean esPrimo(int n) {\n        if (n < 2) return false;\n        for (int d = 2; d * d <= n; d++) {\n            if (n % d == 0) return false;\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 2; i <= n; i++) {\n            if (esPrimo(i)) sb.append(i).append(' ');\n        }\n        System.out.println(sb.toString().strip());\n    }\n}",
  why:"El return dentro del bucle sale en cuanto se sabe la respuesta. Probar hasta la raíz basta: si n = a·b, uno de los dos es ≤ √n."}
]},

{
id:"jv4l2",
titulo:"Sobrecarga, paso por valor y varargs",
claves:["Sobrecarga: mismo nombre, distintos parámetros","Java pasa todo por valor; con objetos se copia la referencia","varargs (Tipo... args) acepta un número variable de argumentos"],
pasos:[
 {t:"info", eti:"Mismo nombre", h:"Sobrecarga",
  c:`<div class="termbox">static double area(double lado) { return lado * lado; }
static double area(double ancho, double alto) { return ancho * alto; }

area(3);        <span class="cm">// 9.0  -&gt; primer método</span>
area(3, 4);     <span class="cm">// 12.0 -&gt; segundo método</span></div>
     <p>El compilador elige cuál llamar según el número y tipo de argumentos. Cambiar solo el tipo de retorno no basta para sobrecargar.</p>`},
 {t:"info", eti:"Una pregunta clásica", h:"¿Por valor o por referencia?",
  c:`<p>Java pasa <b>siempre por valor</b>: el método recibe una <b>copia</b>.</p>
     <div class="termbox">static void duplicar(int x) { x = x * 2; }
int n = 5; duplicar(n);           <span class="cm">// n sigue valiendo 5</span>

static void renombrar(Cliente c) { c.setNombre("Eva"); }
renombrar(cliente);               <span class="cm">// cliente SÍ cambia de nombre</span>

static void reemplazar(Cliente c) { c = new Cliente("Otro"); }
reemplazar(cliente);              <span class="cm">// cliente NO cambia: solo se reasignó la copia</span></div>
     <p>Con objetos, lo que se copia es la <b>referencia</b> (la «dirección»): puedes modificar el objeto al que apunta, pero no hacer que la variable original apunte a otro.</p>`},
 {t:"opcion", p:"«¿Java pasa los objetos por referencia?» ¿Cuál es la respuesta precisa?",
  ops:["Sí, siempre","No: todo se pasa por valor; en el caso de objetos, el valor copiado es la referencia","Solo los String","Depende del compilador"],
  ok:1, why:"Por eso modificar el objeto se ve fuera, pero reasignar el parámetro no."},
 {t:"info", eti:"Número variable", h:"varargs",
  c:`<div class="termbox">static int sumar(int... numeros) {
    int total = 0;
    for (int n : numeros) total += n;
    return total;
}
sumar();            <span class="cm">// 0</span>
sumar(1, 2, 3);     <span class="cm">// 6</span></div>
     <p>Dentro del método, <code>numeros</code> es un array. <code>String.format</code> y <code>List.of</code> usan varargs.</p>`},
 {t:"vf", p:"Dos métodos con el mismo nombre y los mismos parámetros, pero distinto tipo de retorno, son una sobrecarga válida.",
  ok:false, why:"No compila: en la llamada no se podría saber cuál usar. Deben diferir los parámetros."},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">static void cambiar(int[] a) { a[0] = 99; a = new int[]{1, 2}; }

int[] datos = {5, 6};
cambiar(datos);
System.out.println(datos[0]);</div>`,
  ops:["5","99","1","No compila"],
  ok:1, why:"Se copia la referencia: a[0] = 99 modifica el mismo array. Después, reasignar a solo afecta a la copia local."},
 {t:"codigo", p:"Escribe un método con varargs que calcule la media",
  lenguaje:"java",
  c:`<p>Completa <code>static double media(int... nums)</code>. Si no recibe ningún número, debe devolver 0. El <code>main</code> ya hace las llamadas.</p>`,
  plantilla:"public class Main {\n    static double media(int... nums) {\n        return -1; // complétalo\n    }\n\n    public static void main(String[] args) {\n        System.out.println(media(4, 6));\n        System.out.println(media(1, 2, 3, 4));\n        System.out.println(media());\n        System.out.println(media(7));\n    }\n}\n",
  pruebas:[{salida:"5.0\n2.5\n0.0\n7.0"}],
  pista:"if (nums.length == 0) return 0; suma con for-each y divide entre (double) nums.length.",
  solucion:"public class Main {\n    static double media(int... nums) {\n        if (nums.length == 0) return 0;\n        int suma = 0;\n        for (int n : nums) suma += n;\n        return (double) suma / nums.length;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(media(4, 6));\n        System.out.println(media(1, 2, 3, 4));\n        System.out.println(media());\n        System.out.println(media(7));\n    }\n}",
  why:"Sin el (double), 10 / 4 sería una división entera y daría 2.0 en vez de 2.5. Y sin el caso vacío, 0 / 0.0 daría NaN."}
]},

{
id:"jv4l3",
titulo:"Recursión",
claves:["Un método recursivo se llama a sí mismo","Necesita un caso base que termine","Demasiada profundidad provoca StackOverflowError"],
pasos:[
 {t:"info", eti:"Llamarse a sí mismo", h:"Factorial",
  c:`<div class="termbox">static long factorial(int n) {
    if (n &lt;= 1) return 1;            <span class="cm">// caso base</span>
    return n * factorial(n - 1);     <span class="cm">// caso recursivo</span>
}
<span class="cm">// factorial(4) = 4 * factorial(3) = 4 * 3 * factorial(2) = 4 * 3 * 2 * 1 = 24</span></div>
     <p>Cada llamada ocupa un hueco en la <b>pila</b> (stack). Sin caso base, las llamadas no terminan y la pila se desborda: <code>StackOverflowError</code>.</p>`},
 {t:"orden", p:"Ordena las llamadas que ocurren al calcular <code>factorial(3)</code>",
  items:["factorial(3) llama a factorial(2)","factorial(2) llama a factorial(1)","factorial(1) devuelve 1 (caso base)","factorial(2) devuelve 2 * 1 = 2","factorial(3) devuelve 3 * 2 = 6"],
  why:"La recursión «baja» hasta el caso base y luego «sube» combinando resultados."},
 {t:"opcion", p:"¿Qué ocurre si un método recursivo no tiene caso base?",
  ops:["Devuelve 0","Se llama infinitamente hasta desbordar la pila: StackOverflowError","El compilador lo impide","Se convierte en un bucle"],
  ok:1, why:"Cada llamada consume memoria de la pila del hilo."},
 {t:"vf", p:"Todo problema recursivo se puede resolver también con un bucle.",
  ok:true, why:"La recursión es elegante para árboles y estructuras anidadas; en otros casos, un bucle es más eficiente y seguro."},
 {t:"info", eti:"Cuidado con repetir trabajo", h:"Fibonacci ingenuo y memoización",
  c:`<div class="termbox">static long fib(int n) {
    if (n &lt; 2) return n;
    return fib(n - 1) + fib(n - 2);   <span class="cm">// fib(40): unos 330 millones de llamadas</span>
}</div>
     <p>Cada llamada abre dos más y se recalculan los mismos valores una y otra vez: coste <b>exponencial</b>. Soluciones: guardar resultados ya calculados (<b>memoización</b>, con un array o un <code>HashMap</code>) o hacerlo con un bucle de abajo arriba, que es lineal.</p>
     <p>Java no optimiza la recursión de cola: una recursión de 100 000 niveles desborda la pila por defecto (unos cientos de KB a 1 MB por hilo). Para profundidades grandes, bucle.</p>`},
 {t:"codigo", p:"Suma de dígitos, de forma recursiva",
  lenguaje:"java",
  c:`<p>Completa <code>static int sumaDigitos(long n)</code> sin bucles: la suma de dígitos de n es su último dígito (<code>n % 10</code>) más la suma de dígitos del resto (<code>n / 10</code>). El caso base: n vale 0.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    static int sumaDigitos(long n) {\n        return 0; // caso base y caso recursivo\n    }\n\n    public static void main(String[] args) {\n        long n = new Scanner(System.in).nextLong();\n        System.out.println(sumaDigitos(n));\n    }\n}\n",
  pruebas:[{entrada:"1234", salida:"10"}, {entrada:"9", salida:"9"}, {entrada:"9876543210", salida:"45", oculta:true}],
  pista:"if (n == 0) return 0; return (int) (n % 10) + sumaDigitos(n / 10);",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    static int sumaDigitos(long n) {\n        if (n == 0) return 0;\n        return (int) (n % 10) + sumaDigitos(n / 10);\n    }\n\n    public static void main(String[] args) {\n        long n = new Scanner(System.in).nextLong();\n        System.out.println(sumaDigitos(n));\n    }\n}",
  why:"Caso base + un paso que acerca al caso base: esa es toda la receta de la recursión."},
 {t:"codigo", p:"Potencia rápida recursiva",
  lenguaje:"java",
  c:`<p>Calcula <code>base<sup>exp</sup></code> con <code>static long potencia(long base, int exp)</code> usando que <code>b<sup>2k</sup> = (b<sup>k</sup>)²</code>: si exp es par, calcula la mitad una sola vez y elévala al cuadrado; si es impar, <code>base · potencia(base, exp − 1)</code>. Así se hacen unas log₂(exp) llamadas en lugar de exp.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    static long potencia(long base, int exp) {\n        return 1; // complétalo\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long b = sc.nextLong();\n        int e = sc.nextInt();\n        System.out.println(potencia(b, e));\n    }\n}\n",
  pruebas:[{entrada:"2 10", salida:"1024"}, {entrada:"3 5", salida:"243"}, {entrada:"7 0", salida:"1", oculta:true}, {entrada:"2 62", salida:"4611686018427387904", oculta:true}],
  pista:"if (exp == 0) return 1; if (exp % 2 == 0) { long m = potencia(base, exp / 2); return m * m; } return base * potencia(base, exp - 1);",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    static long potencia(long base, int exp) {\n        if (exp == 0) return 1;\n        if (exp % 2 == 0) {\n            long m = potencia(base, exp / 2);\n            return m * m;\n        }\n        return base * potencia(base, exp - 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long b = sc.nextLong();\n        int e = sc.nextInt();\n        System.out.println(potencia(b, e));\n    }\n}",
  why:"Guardar la mitad en una variable es la clave: <code>potencia(b, e/2) * potencia(b, e/2)</code> repetiría el trabajo y volvería a ser lineal."}
]},

{
id:"jv4l4",
titulo:"Arrays",
claves:["Un array guarda un número fijo de elementos del mismo tipo","Índices desde 0 hasta length − 1","Arrays.toString, Arrays.sort y Arrays.asList ayudan a trabajar con ellos"],
pasos:[
 {t:"info", eti:"Tamaño fijo", h:"Crear y usar arrays",
  c:`<div class="termbox">int[] notas = new int[5];            <span class="cm">// 5 posiciones, todas a 0</span>
notas[0] = 8;
notas[4] = 6;
String[] dias = {"lun", "mar", "mie"};
dias.length                          <span class="cm">// 3 (sin paréntesis: es un atributo)</span>
dias[3]                              <span class="cm">// ArrayIndexOutOfBoundsException</span>

int[][] tablero = new int[3][3];     <span class="cm">// matriz</span>
tablero[1][2] = 5;</div>`},
 {t:"info", eti:"Utilidades", h:"La clase Arrays",
  c:`<div class="termbox">int[] numeros = {5, 2, 9, 1};
Arrays.sort(numeros);                    <span class="cm">// [1, 2, 5, 9]</span>
System.out.println(numeros);             <span class="cm">// [I@1b6d3586  (no muestra el contenido)</span>
System.out.println(Arrays.toString(numeros));  <span class="cm">// [1, 2, 5, 9]</span>
int[] copia = Arrays.copyOf(numeros, 6);  <span class="cm">// [1, 2, 5, 9, 0, 0]</span></div>
     <p>En el día a día se usan más las <b>colecciones</b> (List, Set, Map), que crecen solas. Los arrays aparecen en rendimiento, en <code>main(String[] args)</code> y en APIs de bajo nivel.</p>`},
 {t:"opcion", p:"Un array tiene <code>length</code> 10. ¿Cuál es el índice del último elemento?",
  ops:["10","9","11","0"],
  ok:1, why:"Los índices van de 0 a length − 1."},
 {t:"escribe", p:"Declara un array de String llamado <code>colores</code> con los valores rojo, verde y azul",
  sol:["String[] colores = {\"rojo\", \"verde\", \"azul\"};","String[] colores = new String[]{\"rojo\", \"verde\", \"azul\"};","String[] colores = new String[] {\"rojo\", \"verde\", \"azul\"};"], ph:"String[] colores = ...", pista:"String[] colores = { ... };", why:"Las comillas dobles delimitan cada texto."},
 {t:"par", p:"Empareja cada expresión con su resultado sobre <code>int[] a = {4, 7, 1};</code>",
  pares:[["a.length","3"],["a[0]","4"],["a[a.length - 1]","1"],["a[3]","ArrayIndexOutOfBoundsException"]],
  why:"Salirse del array es uno de los errores más comunes de principiante."},
 {t:"vf", p:"Un array de Java puede cambiar de tamaño después de crearlo.",
  ok:false, why:"Su tamaño es fijo. Para crecer se usa ArrayList (que por dentro crea arrays nuevos más grandes)."},
 {t:"info", eti:"Recorridos", h:"Patrones con arrays",
  c:`<div class="termbox">int[] a = {3, 9, 2, 7};

int max = a[0];                        <span class="cm">// máximo: empieza por el primero, no por 0</span>
for (int x : a) if (x &gt; max) max = x;

for (int i = a.length - 1; i &gt;= 0; i--)  <span class="cm">// recorrer al revés</span>
    System.out.print(a[i] + " ");

Arrays.equals(a, b)                    <span class="cm">// compara contenido (a == b compara referencias)</span>
Arrays.fill(a, -1)                     <span class="cm">// rellena</span>
Arrays.stream(a).sum()                 <span class="cm">// suma con streams</span></div>
     <p>Empezar el máximo en 0 es un error clásico: si todos los números son negativos, devolvería 0, que ni siquiera está en el array.</p>`},
 {t:"codigo", p:"Máximo, mínimo e inverso de un array",
  lenguaje:"java",
  c:`<p>La entrada empieza con <code>n</code> y siguen n enteros. Guárdalos en un <code>int[]</code>. Imprime tres líneas: <code>max=…</code>, <code>min=…</code> y los números en orden inverso separados por espacios.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        // rellena, calcula e imprime\n    }\n}\n",
  pruebas:[{entrada:"4\n3 9 2 7", salida:"max=9\nmin=2\n7 2 9 3"}, {entrada:"3\n-5 -1 -8", salida:"max=-1\nmin=-8\n-8 -1 -5"}, {entrada:"1\n42", salida:"max=42\nmin=42\n42", oculta:true}],
  pista:"Rellena con for (int i = 0; i < n; i++) a[i] = sc.nextInt(); inicia max y min con a[0].",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int max = a[0], min = a[0];\n        for (int x : a) {\n            if (x > max) max = x;\n            if (x < min) min = x;\n        }\n        System.out.println(\"max=\" + max);\n        System.out.println(\"min=\" + min);\n        StringBuilder sb = new StringBuilder();\n        for (int i = n - 1; i >= 0; i--) {\n            sb.append(a[i]);\n            if (i > 0) sb.append(' ');\n        }\n        System.out.println(sb);\n    }\n}",
  why:"La prueba con todos negativos es la que caza a quien inicializa max en 0."},
 {t:"codigo", p:"Suma de las diagonales de una matriz cuadrada",
  lenguaje:"java",
  c:`<p>Lee <code>n</code> y después una matriz n×n de enteros. Imprime la suma de la diagonal principal (de arriba a la izquierda a abajo a la derecha) y la de la secundaria, separadas por un espacio.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] m = new int[n][n];\n        // rellena la matriz y suma las diagonales\n    }\n}\n",
  pruebas:[{entrada:"3\n1 2 3\n4 5 6\n7 8 9", salida:"15 15"}, {entrada:"2\n1 0\n0 2", salida:"3 0"}, {entrada:"1\n5", salida:"5 5", oculta:true}],
  pista:"Principal: m[i][i]. Secundaria: m[i][n - 1 - i].",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] m = new int[n][n];\n        for (int f = 0; f < n; f++)\n            for (int c = 0; c < n; c++)\n                m[f][c] = sc.nextInt();\n        int p = 0, s = 0;\n        for (int i = 0; i < n; i++) {\n            p += m[i][i];\n            s += m[i][n - 1 - i];\n        }\n        System.out.println(p + \" \" + s);\n    }\n}",
  why:"Un int[][] es un array de arrays: m[f] es la fila f. Por eso puede haber matrices «dentadas» con filas de distinta longitud."}
]}

]});
