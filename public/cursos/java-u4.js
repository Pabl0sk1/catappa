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
  ok:true, why:"return sin valor sale del método. Útil para cláusulas de guarda: if (lista.isEmpty()) return;"}
]},

{
id:"jv4l2",
titulo:"Sobrecarga, paso por valor y varargs",
claves:["Sobrecarga: mismo nombre, distintos parámetros","Java pasa todo por valor; con objetos se copia la referencia","varargs (Tipo... args) acepta un número variable de argumentos"],
pasos:[
 {t:"info", eti:"Mismo nombre", h:"Sobrecarga",
  c:`<div class="termbox">static double area(double lado) { return lado * lado; }
static double area(double ancho, double alto) { return ancho * alto; }

area(3);        <span class="cm">// 9.0  -&gt; primer metodo</span>
area(3, 4);     <span class="cm">// 12.0 -&gt; segundo metodo</span></div>
     <p>El compilador elige cuál llamar según el número y tipo de argumentos. Cambiar solo el tipo de retorno no basta para sobrecargar.</p>`},
 {t:"info", eti:"Una pregunta clásica", h:"¿Por valor o por referencia?",
  c:`<p>Java pasa <b>siempre por valor</b>: el método recibe una <b>copia</b>.</p>
     <div class="termbox">static void duplicar(int x) { x = x * 2; }
int n = 5; duplicar(n);           <span class="cm">// n sigue valiendo 5</span>

static void renombrar(Cliente c) { c.setNombre("Eva"); }
renombrar(cliente);               <span class="cm">// cliente SI cambia de nombre</span>

static void reemplazar(Cliente c) { c = new Cliente("Otro"); }
reemplazar(cliente);              <span class="cm">// cliente NO cambia: solo se reasigno la copia</span></div>
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
  ok:false, why:"No compila: en la llamada no se podría saber cuál usar. Deben diferir los parámetros."}
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
  ok:true, why:"La recursión es elegante para árboles y estructuras anidadas; en otros casos, un bucle es más eficiente y seguro."}
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
dias.length                          <span class="cm">// 3 (sin parentesis: es un atributo)</span>
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
  ok:false, why:"Su tamaño es fijo. Para crecer se usa ArrayList (que por dentro crea arrays nuevos más grandes)."}
]}

]});
