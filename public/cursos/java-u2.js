window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Variables, tipos y operadores",
resumen: "Tipos primitivos, variables y var, String, operadores, conversiones y la clase Math",
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
     <p>Forma: <b>tipo nombre = valor;</b>. El tipo no se puede cambiar después: una variable <code>int</code> siempre guardará enteros.</p>`},
 {t:"info", eti:"Los ocho", h:"Tipos primitivos",
  c:`<div class="diag">byte     8 bits    -128 a 127
short   16 bits    -32.768 a 32.767
int     32 bits    unos +-2.100 millones        (el entero por defecto)
long    64 bits    enorme                       (ids, marcas de tiempo)
float   32 bits    decimal aproximado
double  64 bits    decimal aproximado           (el decimal por defecto)
char    16 bits    un caracter Unicode: 'a'
boolean            true o false</div>
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
  ok:false, why:"Da 0.30000000000000004. Los double son aproximados; para dinero, BigDecimal."}
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
     <p>Desde Java 10, <code>var</code> deduce el tipo a partir del valor. <b>Sigue siendo tipado estático</b>: <code>nombre</code> es String para siempre. Solo sirve para variables locales y con valor inicial.</p>`},
 {t:"info", eti:"Inmutable", h:"final y constantes",
  c:`<div class="termbox">final int intentos = 3;
intentos = 4;                        <span class="cm">// ERROR: no se puede reasignar</span>

public static final double IVA = 0.21;   <span class="cm">// constante de clase</span></div>`},
 {t:"info", eti:"Dónde existe", h:"Ámbito",
  c:`<div class="termbox">if (activo) {
    int descuento = 10;
    System.out.println(descuento);   <span class="cm">// bien</span>
}
System.out.println(descuento);       <span class="cm">// ERROR: descuento no existe aqui</span></div>
     <p>Una variable vive desde su declaración hasta el final del bloque <code>{ }</code> que la contiene.</p>`},
 {t:"opcion", p:"¿Cuál de estas líneas NO compila?",
  ops:["var x = 10;","var lista = new ArrayList&lt;String&gt;();","var y;","var texto = \"hola\";"],
  ok:2, why:"Sin valor inicial el compilador no puede deducir el tipo."},
 {t:"vf", p:"Con <code>var edad = 30;</code> puedes asignar después <code>edad = \"treinta\";</code>.",
  ok:false, why:"edad es int. var no hace a Java dinámico: solo evita escribir el tipo."}
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
a / b    <span class="cm">// 3   (division ENTERA: se descartan los decimales)</span>
a % b    <span class="cm">// 2   (resto)</span>
17.0 / 5 <span class="cm">// 3.4 (si uno es double, la division es decimal)</span></div>`},
 {t:"info", eti:"Comparar y combinar", h:"Comparación y lógicos",
  c:`<div class="termbox">edad &gt;= 18 &amp;&amp; tieneDni      <span class="cm">// Y: ambas ciertas</span>
esAdmin || esPropietario      <span class="cm">// O: al menos una</span>
!activo                       <span class="cm">// NO</span>

contador++;                   <span class="cm">// contador = contador + 1</span>
total += precio;              <span class="cm">// total = total + precio</span></div>
     <p><code>&amp;&amp;</code> y <code>||</code> son de <b>cortocircuito</b>: si la primera parte ya decide el resultado, la segunda no se evalúa. Por eso <code>obj != null &amp;&amp; obj.activo()</code> no falla con null.</p>`},
 {t:"opcion", p:"¿Cuánto vale <code>7 / 2</code> en Java?",
  ops:["3.5","3","4","Error"],
  ok:1, why:"Ambos son int: división entera. Para 3.5, 7 / 2.0 o (double) 7 / 2."},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["10 % 3","1"],["10 / 4","2"],["10 / 4.0","2.5"],["!(5 > 3)","false"],["true || false","true"]],
  why:"% (módulo) se usa mucho: par o impar (n % 2), repartir en grupos, ciclos."},
 {t:"opcion", p:"¿Por qué no falla <code>if (cliente != null &amp;&amp; cliente.esVip())</code> cuando cliente es null?",
  ops:["Porque Java ignora los null","Por el cortocircuito: si la primera condición es falsa, la segunda no se evalúa","Porque esVip devuelve false","Sí falla"],
  ok:1, why:"Con & (sin cortocircuito) se evaluarían ambas y saltaría NullPointerException."}
]},

{
id:"jv2l4",
titulo:"Textos: la clase String",
claves:["String es inmutable: cada modificación crea otro String","Compara textos con equals, nunca con ==","StringBuilder para construir textos en bucles"],
pasos:[
 {t:"info", eti:"Texto", h:"String y sus métodos",
  c:`<div class="termbox">String nombre = "Ana Ruiz";
nombre.length()             <span class="cm">// 8</span>
nombre.toUpperCase()        <span class="cm">// "ANA RUIZ"</span>
nombre.contains("Ruiz")     <span class="cm">// true</span>
nombre.startsWith("An")     <span class="cm">// true</span>
nombre.substring(0, 3)      <span class="cm">// "Ana"</span>
nombre.replace("Ana", "Eva")  <span class="cm">// "Eva Ruiz"</span>
"  hola ".strip()           <span class="cm">// "hola"</span>
"a,b,c".split(",")          <span class="cm">// ["a", "b", "c"]</span>
"hola".isBlank()            <span class="cm">// false</span>
String.format("Total: %.2f €", 12.5)  <span class="cm">// "Total: 12,50 €"</span></div>`},
 {t:"info", eti:"La trampa", h:"equals frente a ==",
  c:`<p><code>==</code> compara si dos variables apuntan al <b>mismo objeto</b>, no si tienen el mismo contenido. Para textos (y objetos en general) se usa <code>equals</code>:</p>
     <div class="termbox">String a = "hola";
String b = new String("hola");
a == b           <span class="cm">// false: son objetos distintos</span>
a.equals(b)      <span class="cm">// true: mismo contenido</span>
"hola".equalsIgnoreCase("HOLA")   <span class="cm">// true</span></div>`},
 {t:"opcion", p:"¿Cómo compruebas si el texto que escribió el usuario es igual a <code>\"admin\"</code> sin riesgo de NullPointerException?",
  ops:["entrada == \"admin\"","\"admin\".equals(entrada)","entrada.equals(\"admin\")","entrada = \"admin\""],
  ok:1, why:"Si entrada es null, \"admin\".equals(null) devuelve false; entrada.equals(...) lanzaría NullPointerException. También vale Objects.equals(a, b)."},
 {t:"info", eti:"Construir textos", h:"Inmutabilidad y StringBuilder",
  c:`<p>Un String nunca cambia: <code>nombre.toUpperCase()</code> devuelve <b>otro</b> String. Concatenar en un bucle crea miles de objetos intermedios:</p>
     <div class="termbox">StringBuilder sb = new StringBuilder();
for (Pedido p : pedidos) {
    sb.append(p.id()).append(";").append(p.total()).append("\\n");
}
String csv = sb.toString();</div>`},
 {t:"par", p:"Empareja cada método con su resultado sobre <code>\"Catappa\"</code>",
  pares:[["length()","5"],["toLowerCase()","catappa"],["charAt(0)","F"],["indexOf(\"r\")","2"],["substring(1, 3)","or"]],
  why:"Los índices empiezan en 0 y substring excluye el índice final."},
 {t:"vf", p:"<code>nombre.toUpperCase();</code> (sin asignar el resultado) cambia el contenido de <code>nombre</code>.",
  ok:false, why:"String es inmutable: el resultado se pierde si no lo guardas (nombre = nombre.toUpperCase())."}
]},

{
id:"jv2l5",
titulo:"Conversiones y Math",
claves:["Conversión automática a tipos más grandes; casting explícito a más pequeños","Integer.parseInt y String.valueOf para pasar entre texto y números","Clases envoltorio: Integer, Double... y autoboxing"],
pasos:[
 {t:"info", eti:"Entre números", h:"Ampliar y reducir",
  c:`<div class="termbox">int i = 100;
long l = i;              <span class="cm">// automatico: cabe siempre</span>
double d = i;            <span class="cm">// automatico</span>

double precio = 19.99;
int entero = (int) precio;   <span class="cm">// casting explicito: 19 (trunca)</span>
long grande = 3_000_000_000L;
int roto = (int) grande;     <span class="cm">// compila, pero el valor se corrompe</span></div>`},
 {t:"info", eti:"Entre texto y números", h:"parse y valueOf",
  c:`<div class="termbox">int edad = Integer.parseInt("42");
double p = Double.parseDouble("19.99");
String s = String.valueOf(42);          <span class="cm">// o "" + 42</span>
Integer.parseInt("hola");               <span class="cm">// NumberFormatException</span></div>
     <p>Cada primitivo tiene su <b>clase envoltorio</b> (Integer, Long, Double, Boolean...). Las colecciones solo guardan objetos, así que Java convierte automáticamente (<b>autoboxing</b>): <code>List&lt;Integer&gt;</code>. Ojo: un <code>Integer</code> puede ser <code>null</code>; un <code>int</code>, no.</p>`},
 {t:"escribe", p:"Convierte el texto de la variable <code>entrada</code> en un int guardado en <code>cantidad</code>",
  sol:["int cantidad = Integer.parseInt(entrada);","var cantidad = Integer.parseInt(entrada);"], ph:"int cantidad = ...", pista:"Integer.parseInt(...)", why:"Si el texto no es un número, lanza NumberFormatException: hay que validarlo o capturarla."},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["(int) 9.99","9"],["Math.round(9.5)","10"],["Math.max(3, 8)","8"],["Math.abs(-4)","4"],["Math.pow(2, 10)","1024.0"]],
  why:"Math.round redondea al más cercano; el casting a int simplemente corta los decimales."},
 {t:"opcion", p:"¿Qué pasa con <code>Integer total = null; int t = total;</code>?",
  ops:["t vale 0","NullPointerException al desenvolver (unboxing) el null","Error de compilación","t vale null"],
  ok:1, why:"Un fallo habitual con valores que vienen de base de datos o de mapas: comprueba el null o usa tipos primitivos donde el valor sea obligatorio."}
]}

]});
