window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Variables, tipos y operadores",
resumen: "Tipos primitivos, variables y var, String, operadores, conversiones, formato de salida y la clase Math",
nivel: "Fundamentos",
color: "#e76f51",
lecciones: [

{
id:"jv2l1",
titulo:"Variables y tipos primitivos",
claves:["Una variable es un nombre con un tipo que guarda un valor","8 primitivos: byte, short, int, long, float, double, char, boolean","int para enteros normales, long para grandes, double para decimales, boolean para sí/no"],
pasos:[
 {t:"info", eti:"Guardar datos", h:"Declarar variables",
  c:`<div class="termbox">int edad = 30;
double precio = 19.99;
boolean activo = true;
char inicial = 'P';
long visitas = 8_000_000_000L;     <span class="cm">// guiones bajos para leer mejor; L para long</span></div>
     <p>Forma: <b>tipo nombre = valor;</b>. El tipo no se puede cambiar después: una variable <code>int</code> siempre guardará enteros.</p>
     <p>Los números enteros escritos en el código (<b>literales</b>) son <code>int</code> por defecto; los decimales, <code>double</code>. Por eso un número que no cabe en un int necesita la <code>L</code> final, y un float necesita la <code>f</code>: <code>float f = 1.5f;</code>.</p>`},
 {t:"info", eti:"Los ocho", h:"Tipos primitivos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">los tipos primitivos</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>tamaño</th><th>valores</th><th>uso</th></tr></thead><tbody>
<tr><td><code>byte</code></td><td>8 bits</td><td>-128 a 127</td><td>datos binarios</td></tr>
<tr><td><code>short</code></td><td>16 bits</td><td>-32.768 a 32.767</td><td>casi nunca</td></tr>
<tr><td><code>int</code></td><td>32 bits</td><td>unos ±2.100 millones</td><td>el entero por defecto</td></tr>
<tr><td><code>long</code></td><td>64 bits</td><td>unos ±9,2 trillones</td><td>ids, marcas de tiempo</td></tr>
<tr><td><code>float</code></td><td>32 bits</td><td>decimal aproximado</td><td>gráficos, poca memoria</td></tr>
<tr><td><code>double</code></td><td>64 bits</td><td>decimal aproximado</td><td>el decimal por defecto</td></tr>
<tr><td><code>char</code></td><td>16 bits</td><td>un carácter Unicode: <code>'a'</code></td><td>letras sueltas</td></tr>
<tr><td><code>boolean</code></td><td>—</td><td><code>true</code> o <code>false</code></td><td>condiciones</td></tr>
</tbody></table></div>
     <p>Para dinero, ni float ni double: se usa la clase <code>BigDecimal</code>, porque los decimales binarios no representan exactamente 0,1.</p>`},
 {t:"par", p:"Empareja cada dato con el tipo más adecuado",
  pares:[["Número de unidades en stock","int"],["Milisegundos desde 1970","long"],["Temperatura con decimales","double"],["Si el usuario ha verificado su email","boolean"],["Importe de una factura","BigDecimal"]],
  why:"Elegir bien el tipo evita desbordamientos y errores de redondeo."},
 {t:"escribe", p:"Declara una variable entera llamada <code>stock</code> con valor 25",
  sol:["int stock = 25;","int stock=25;"], ph:"int ...", pista:"tipo, nombre, = valor y punto y coma.", why:"int stock = 25;"},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">int max = Integer.MAX_VALUE;   // 2147483647
System.out.println(max + 1);</div>`,
  ops:["2147483648","-2147483648","Error de compilación","Lanza una excepción"],
  ok:1, why:"Desbordamiento: el int da la vuelta al valor mínimo sin avisar. Por eso los contadores grandes usan long (o Math.addExact, que sí lanza excepción)."},
 {t:"vf", p:"<code>0.1 + 0.2 == 0.3</code> es <code>true</code> en Java.",
  ok:false, why:"Da 0.30000000000000004. Los double son aproximados; para dinero, BigDecimal."},
 {t:"codigo", p:"Lee un número de días y muestra cuántos segundos son",
  lenguaje:"java",
  c:`<p>Un día tiene 86 400 segundos. Cuidado: con 30 000 días el resultado (2 592 000 000) ya no cabe en un <code>int</code>. Haz el cálculo en <code>long</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int dias = sc.nextInt();\n        int segundos = dias * 86400;\n        System.out.println(segundos);\n    }\n}\n",
  pruebas:[{entrada:"1", salida:"86400"}, {entrada:"30000", salida:"2592000000"}, {entrada:"100000", salida:"8640000000", oculta:true}],
  pista:"long segundos = dias * 86400L; (con la L, la multiplicación se hace en long).",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int dias = sc.nextInt();\n        long segundos = dias * 86400L;\n        System.out.println(segundos);\n    }\n}",
  why:"Ojo: <code>long s = dias * 86400;</code> sigue fallando, porque la multiplicación se hace en int y el desbordamiento ocurre antes de guardar en long. Hace falta que uno de los operandos sea long."}
]},

{
id:"jv2l2",
titulo:"var, constantes y ámbito",
claves:["var deja que el compilador deduzca el tipo de una variable local","final impide reasignar una variable","Una variable solo existe dentro del bloque donde se declara"],
pasos:[
 {t:"info", eti:"Inferencia", h:"var",
  c:`<div class="termbox">var nombre = "Ana";                 <span class="cm">// String</span>
var total = 0;                      <span class="cm">// int</span>
var pedidos = new ArrayList&lt;Pedido&gt;();   <span class="cm">// ArrayList&lt;Pedido&gt;</span></div>
     <p>Desde Java 10, <code>var</code> deduce el tipo a partir del valor. <b>Sigue siendo tipado estático</b>: <code>nombre</code> es String para siempre. Solo sirve para variables locales y con valor inicial; no para atributos ni parámetros.</p>
     <p>Úsalo cuando el tipo se ve claro en la misma línea (<code>new ArrayList&lt;Pedido&gt;()</code>). Si oculta información (<code>var r = servicio.procesar();</code>), mejor escribe el tipo.</p>`},
 {t:"info", eti:"Inmutable", h:"final y constantes",
  c:`<div class="termbox">final int intentos = 3;
intentos = 4;                        <span class="cm">// ERROR: no se puede reasignar</span>

public static final double IVA = 0.21;   <span class="cm">// constante de clase</span>

final List&lt;String&gt; nombres = new ArrayList&lt;&gt;();
nombres.add("Ana");                  <span class="cm">// BIEN: final no congela el objeto</span>
nombres = new ArrayList&lt;&gt;();         <span class="cm">// ERROR: lo que no puedes es reasignar</span></div>
     <p><code>final</code> protege la <b>variable</b>, no el <b>objeto</b> al que apunta. Si quieres una lista que no cambie, usa <code>List.of(...)</code>.</p>`},
 {t:"info", eti:"Dónde existe", h:"Ámbito",
  c:`<div class="termbox">if (activo) {
    int descuento = 10;
    System.out.println(descuento);   <span class="cm">// bien</span>
}
System.out.println(descuento);       <span class="cm">// ERROR: descuento no existe aquí</span></div>
     <p>Una variable vive desde su declaración hasta el final del bloque <code>{ }</code> que la contiene. Declara cada variable en el ámbito más pequeño posible: se lee mejor y evita reutilizarla por error. Además, las variables locales <b>no tienen valor por defecto</b>: usar una sin asignarla es un error de compilación.</p>`},
 {t:"opcion", p:"¿Cuál de estas líneas NO compila?",
  ops:["var x = 10;","var lista = new ArrayList&lt;String&gt;();","var y;","var texto = \"hola\";"],
  ok:2, why:"Sin valor inicial el compilador no puede deducir el tipo."},
 {t:"vf", p:"Con <code>var edad = 30;</code> puedes asignar después <code>edad = \"treinta\";</code>.",
  ok:false, why:"edad es int. var no hace a Java dinámico: solo evita escribir el tipo."},
 {t:"opcion", p:"Tienes <code>final List&lt;String&gt; l = new ArrayList&lt;&gt;();</code>. ¿Qué compila?",
  ops:["l = new ArrayList&lt;&gt;();","l.add(\"x\");","Ninguna de las dos","Las dos"],
  ok:1, why:"final impide reasignar la variable, pero la lista sigue siendo mutable."},
 {t:"codigo", p:"Intercambia los valores de <code>a</code> y <code>b</code> e imprímelos",
  lenguaje:"java",
  c:`<p>Lee dos enteros en <code>a</code> y <code>b</code>. Intercambia sus valores usando una variable auxiliar y después imprime <code>a=… b=…</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // intercambia a y b\n        System.out.println(\"a=\" + a + \" b=\" + b);\n    }\n}\n",
  pruebas:[{entrada:"3 8", salida:"a=8 b=3"}, {entrada:"-1 1", salida:"a=1 b=-1"}, {entrada:"5 5", salida:"a=5 b=5", oculta:true}],
  pista:"int tmp = a; a = b; b = tmp;",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int tmp = a;\n        a = b;\n        b = tmp;\n        System.out.println(\"a=\" + a + \" b=\" + b);\n    }\n}",
  why:"Si haces a = b directamente pierdes el valor de a. La variable auxiliar solo existe para eso: dale el ámbito más pequeño."}
]},

{
id:"jv2l3",
titulo:"Operadores",
claves:["Aritméticos: + - * / %; la división entre int descarta decimales","Comparación: == != &lt; &gt; &lt;= &gt;=; lógicos: && || !","Incremento ++ y asignación compuesta +="],
pasos:[
 {t:"info", eti:"Calcular", h:"Aritméticos",
  c:`<div class="termbox">int a = 17, b = 5;
a + b    <span class="cm">// 22</span>
a - b    <span class="cm">// 12</span>
a * b    <span class="cm">// 85</span>
a / b    <span class="cm">// 3   (división ENTERA: se descartan los decimales)</span>
a % b    <span class="cm">// 2   (resto)</span>
17.0 / 5 <span class="cm">// 3.4 (si uno es double, la división es decimal)</span>
-7 / 2   <span class="cm">// -3  (trunca hacia cero)</span>
-7 % 2   <span class="cm">// -1  (el resto lleva el signo del dividendo)</span>
5 / 0    <span class="cm">// ArithmeticException; en cambio 5.0 / 0 da Infinity</span></div>`},
 {t:"info", eti:"Comparar y combinar", h:"Comparación y lógicos",
  c:`<div class="termbox">edad &gt;= 18 &amp;&amp; tieneDni      <span class="cm">// Y: ambas ciertas</span>
esAdmin || esPropietario      <span class="cm">// O: al menos una</span>
!activo                       <span class="cm">// NO</span>

contador++;                   <span class="cm">// contador = contador + 1</span>
total += precio;              <span class="cm">// total = total + precio</span>

int i = 5;
int x = i++;                  <span class="cm">// x = 5, i = 6 (usa y luego suma)</span>
int y = ++i;                  <span class="cm">// i = 7, y = 7 (suma y luego usa)</span></div>
     <p><code>&amp;&amp;</code> y <code>||</code> son de <b>cortocircuito</b>: si la primera parte ya decide el resultado, la segunda no se evalúa. Por eso <code>obj != null &amp;&amp; obj.activo()</code> no falla con null.</p>`},
 {t:"opcion", p:"¿Cuánto vale <code>7 / 2</code> en Java?",
  ops:["3.5","3","4","Error"],
  ok:1, why:"Ambos son int: división entera. Para 3.5, 7 / 2.0 o (double) 7 / 2."},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["10 % 3","1"],["10 / 4","2"],["10 / 4.0","2.5"],["!(5 > 3)","false"],["-7 / 2","-3"]],
  why:"% (módulo) se usa mucho: par o impar (n % 2), repartir en grupos, ciclos."},
 {t:"opcion", p:"¿Por qué no falla <code>if (cliente != null &amp;&amp; cliente.esVip())</code> cuando cliente es null?",
  ops:["Porque Java ignora los null","Por el cortocircuito: si la primera condición es falsa, la segunda no se evalúa","Porque esVip devuelve false","Sí falla"],
  ok:1, why:"Con & (sin cortocircuito) se evaluarían ambas y saltaría NullPointerException."},
 {t:"vf", p:"Para saber si un número es impar vale <code>n % 2 == 1</code> con cualquier entero.",
  ok:false, why:"Con negativos falla: -3 % 2 vale -1. Lo seguro es <code>n % 2 != 0</code>."},
 {t:"codigo", p:"Convierte segundos a horas, minutos y segundos",
  lenguaje:"java",
  c:`<p>Lee un número de segundos e imprime <code>Hh Mm Ss</code>. Por ejemplo, 3725 son <code>1h 2m 5s</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int total = sc.nextInt();\n        // calcula horas, minutos y segundos con / y %\n    }\n}\n",
  pruebas:[{entrada:"3725", salida:"1h 2m 5s"}, {entrada:"59", salida:"0h 0m 59s"}, {entrada:"86399", salida:"23h 59m 59s", oculta:true}],
  pista:"horas = total / 3600; minutos = (total % 3600) / 60; segundos = total % 60.",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int total = sc.nextInt();\n        int h = total / 3600;\n        int m = (total % 3600) / 60;\n        int s = total % 60;\n        System.out.println(h + \"h \" + m + \"m \" + s + \"s\");\n    }\n}",
  why:"La división entera y el resto son la pareja perfecta para descomponer unidades: horas, páginas, filas de una tabla..."}
]},

{
id:"jv2l4",
titulo:"Textos: la clase String",
claves:["String es inmutable: cada modificación crea otro String","Compara textos con equals, nunca con ==","printf y String.format dan formato; StringBuilder construye textos en bucles"],
pasos:[
 {t:"info", eti:"Texto", h:"String y sus métodos",
  c:`<div class="termbox">String nombre = "Ana Ruiz";
nombre.length()             <span class="cm">// 8</span>
nombre.toUpperCase()        <span class="cm">// "ANA RUIZ"</span>
nombre.contains("Ruiz")     <span class="cm">// true</span>
nombre.startsWith("An")     <span class="cm">// true</span>
nombre.substring(0, 3)      <span class="cm">// "Ana"</span>
nombre.charAt(4)            <span class="cm">// 'R'</span>
nombre.indexOf("Ruiz")      <span class="cm">// 4 (-1 si no está)</span>
nombre.replace("Ana", "Eva")  <span class="cm">// "Eva Ruiz"</span>
"  hola ".strip()           <span class="cm">// "hola"</span>
"a,b,c".split(",")          <span class="cm">// ["a", "b", "c"]</span>
"hola".isBlank()            <span class="cm">// false</span>
"ja".repeat(3)              <span class="cm">// "jajaja"</span>
String.join("-", "a", "b")  <span class="cm">// "a-b"</span></div>`},
 {t:"info", eti:"La trampa", h:"equals frente a ==",
  c:`<p><code>==</code> compara si dos variables apuntan al <b>mismo objeto</b>, no si tienen el mismo contenido. Para textos (y objetos en general) se usa <code>equals</code>:</p>
     <div class="termbox">String a = "hola";
String b = new String("hola");
a == b           <span class="cm">// false: son objetos distintos</span>
a.equals(b)      <span class="cm">// true: mismo contenido</span>
"hola".equalsIgnoreCase("HOLA")   <span class="cm">// true</span></div>
     <p>A veces <code>==</code> «funciona» por casualidad: los literales iguales se guardan una sola vez en el <b>pool de Strings</b>, así que <code>"hola" == "hola"</code> da true. Un texto leído de la entrada o de una base de datos es otro objeto, y ahí falla.</p>`},
 {t:"opcion", p:"¿Cómo compruebas si el texto que escribió el usuario es igual a <code>\"admin\"</code> sin riesgo de NullPointerException?",
  ops:["entrada == \"admin\"","\"admin\".equals(entrada)","entrada.equals(\"admin\")","entrada = \"admin\""],
  ok:1, why:"Si entrada es null, \"admin\".equals(null) devuelve false; entrada.equals(...) lanzaría NullPointerException. También vale Objects.equals(a, b)."},
 {t:"info", eti:"Formatear y construir", h:"printf, String.format y StringBuilder",
  c:`<div class="termbox">System.out.printf("%s tiene %d años%n", "Ana", 30);   <span class="cm">// Ana tiene 30 años</span>
String.format("%.2f", 3.14159)       <span class="cm">// "3.14" (redondea)</span>
String.format("%5d|", 42)            <span class="cm">// "   42|" (ancho 5, a la derecha)</span>
String.format("%-5s|", "ab")         <span class="cm">// "ab   |" (a la izquierda)</span>
String.format("%05d", 42)            <span class="cm">// "00042"</span>
"Total: %.2f".formatted(12.5)        <span class="cm">// "Total: 12.50" (Java 15+)</span></div>
     <p><code>%s</code> texto, <code>%d</code> entero, <code>%f</code> decimal, <code>%n</code> salto de línea. El separador decimal depende del idioma del sistema: en español saldría <code>12,50</code>; Catappa ejecuta en inglés, con punto.</p>
     <p>Un String nunca cambia: concatenar en un bucle crea miles de objetos intermedios. Para eso está <code>StringBuilder</code>:</p>
     <div class="termbox">StringBuilder sb = new StringBuilder();
for (Pedido p : pedidos) {
    sb.append(p.id()).append(";").append(p.total()).append("\\n");
}
String csv = sb.toString();</div>`},
 {t:"par", p:"Empareja cada método con su resultado sobre <code>\"Catappa\"</code>",
  pares:[["length()","7"],["toLowerCase()","catappa"],["charAt(0)","C"],["indexOf(\"p\")","3"],["substring(1, 3)","at"]],
  why:"Los índices empiezan en 0 y substring excluye el índice final."},
 {t:"vf", p:"<code>nombre.toUpperCase();</code> (sin asignar el resultado) cambia el contenido de <code>nombre</code>.",
  ok:false, why:"String es inmutable: el resultado se pierde si no lo guardas (nombre = nombre.toUpperCase())."},
 {t:"codigo", p:"Lee un nombre completo y muestra sus iniciales en mayúsculas y cuántas letras tiene sin contar espacios",
  lenguaje:"java",
  c:`<p>Entrada: una línea con varias palabras separadas por un espacio. Salida: <code>INICIALES LETRAS</code>. Para <code>ana ruiz perez</code>: <code>ARP 12</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String linea = sc.nextLine().strip();\n        // split, charAt, toUpperCase, replace...\n    }\n}\n",
  pruebas:[{entrada:"ana ruiz perez", salida:"ARP 12"}, {entrada:"Luis Gomez", salida:"LG 9"}, {entrada:"pablo", salida:"P 5", oculta:true}],
  pista:"String[] partes = linea.split(\" \"); recorre partes y añade partes[i].charAt(0) a un StringBuilder. Las letras: linea.replace(\" \", \"\").length().",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String linea = sc.nextLine().strip();\n        StringBuilder ini = new StringBuilder();\n        for (String p : linea.split(\" \")) {\n            ini.append(p.charAt(0));\n        }\n        int letras = linea.replace(\" \", \"\").length();\n        System.out.println(ini.toString().toUpperCase() + \" \" + letras);\n    }\n}",
  why:"Si las palabras pudieran ir separadas por varios espacios, usarías <code>split(\"\\\\s+\")</code>: una expresión regular que admite uno o más espacios."}
]},

{
id:"jv2l5",
titulo:"Conversiones y Math",
claves:["Conversión automática a tipos más grandes; casting explícito a más pequeños","Integer.parseInt y String.valueOf para pasar entre texto y números","Clases envoltorio: Integer, Double... y autoboxing; comparar Integer con == es un error"],
pasos:[
 {t:"info", eti:"Entre números", h:"Ampliar y reducir",
  c:`<div class="termbox">int i = 100;
long l = i;              <span class="cm">// automático: cabe siempre</span>
double d = i;            <span class="cm">// automático</span>

double precio = 19.99;
int entero = (int) precio;   <span class="cm">// casting explícito: 19 (trunca)</span>
long grande = 3_000_000_000L;
int roto = (int) grande;     <span class="cm">// compila, pero el valor se corrompe</span>
int seguro = Math.toIntExact(grande);   <span class="cm">// ArithmeticException: mejor fallar que corromper</span></div>`},
 {t:"info", eti:"Entre texto y números", h:"parse, valueOf y envoltorios",
  c:`<div class="termbox">int edad = Integer.parseInt("42");
double p = Double.parseDouble("19.99");
String s = String.valueOf(42);          <span class="cm">// o "" + 42</span>
Integer.parseInt("hola");               <span class="cm">// NumberFormatException</span></div>
     <p>Cada primitivo tiene su <b>clase envoltorio</b> (Integer, Long, Double, Boolean...). Las colecciones solo guardan objetos, así que Java convierte automáticamente (<b>autoboxing</b>): <code>List&lt;Integer&gt;</code>. Ojo: un <code>Integer</code> puede ser <code>null</code>; un <code>int</code>, no.</p>
     <div class="nota ojo"><b class="tit">Integer y ==</b>Java guarda en caché los Integer de -128 a 127. Por eso <code>Integer a = 127, b = 127; a == b</code> da true, pero con 128 da <b>false</b>: son dos objetos distintos. Compara envoltorios con <code>equals</code>, o desenvuélvelos a int.</div>`},
 {t:"escribe", p:"Convierte el texto de la variable <code>entrada</code> en un int guardado en <code>cantidad</code>",
  sol:["int cantidad = Integer.parseInt(entrada);","var cantidad = Integer.parseInt(entrada);","int cantidad=Integer.parseInt(entrada);"], ph:"int cantidad = ...", pista:"Integer.parseInt(...)", why:"Si el texto no es un número, lanza NumberFormatException: hay que validarlo o capturarla."},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["(int) 9.99","9"],["Math.round(9.5)","10"],["Math.max(3, 8)","8"],["Math.abs(-4)","4"],["Math.pow(2, 10)","1024.0"]],
  why:"Math.round redondea al más cercano; el casting a int simplemente corta los decimales. Math.pow siempre devuelve double."},
 {t:"opcion", p:"¿Qué pasa con <code>Integer total = null; int t = total;</code>?",
  ops:["t vale 0","NullPointerException al desenvolver (unboxing) el null","Error de compilación","t vale null"],
  ok:1, why:"Un fallo habitual con valores que vienen de base de datos o de mapas: comprueba el null o usa tipos primitivos donde el valor sea obligatorio."},
 {t:"opcion", p:"<code>Integer a = 1000; Integer b = 1000;</code> ¿Qué imprime <code>System.out.println(a == b);</code>?",
  ops:["true","false","Error de compilación","Depende del recolector de basura"],
  ok:1, why:"== compara referencias y 1000 está fuera de la caché de Integer (-128 a 127): son dos objetos. <code>a.equals(b)</code> daría true."},
 {t:"codigo", p:"Calcula el total de una línea de pedido",
  lenguaje:"java",
  c:`<p>Recibes una línea de texto con el formato <code>producto;precio;unidades</code>, por ejemplo <code>cafe;2.35;4</code>. Imprime el total con dos decimales: <code>cafe: 9.40</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] campos = sc.nextLine().split(\";\");\n        // convierte los campos y calcula\n    }\n}\n",
  pruebas:[{entrada:"cafe;2.35;4", salida:"cafe: 9.40"}, {entrada:"libro;19.99;1", salida:"libro: 19.99"}, {entrada:"lapiz;0.5;12", salida:"lapiz: 6.00", oculta:true}],
  pista:"double precio = Double.parseDouble(campos[1]); int uds = Integer.parseInt(campos[2]); System.out.printf(\"%s: %.2f%n\", ...).",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] campos = sc.nextLine().split(\";\");\n        double precio = Double.parseDouble(campos[1]);\n        int uds = Integer.parseInt(campos[2]);\n        System.out.printf(\"%s: %.2f%n\", campos[0], precio * uds);\n    }\n}",
  why:"Leer texto y convertirlo es el pan de cada día: ficheros CSV, parámetros de una URL, variables de entorno. En una aplicación real, el importe iría en BigDecimal."}
]}

]});
