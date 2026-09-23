window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Qué es Java",
resumen: "El lenguaje, la JVM, el JDK, compilar y ejecutar tu primer programa y la estructura de un fichero Java",
nivel: "Fundamentos",
color: "#e76f51",
lecciones: [

{
id:"jv1l1",
titulo:"Java y la máquina virtual",
claves:["Java se compila a bytecode, que ejecuta la JVM","«Escribe una vez, ejecuta en cualquier parte»: la misma app corre en Windows, Linux o macOS","Es el lenguaje dominante en backend empresarial, banca y Android"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es Java?",
  c:`<p><b>Java</b> es un lenguaje de programación creado en 1995. Hoy mueve una parte enorme del software empresarial: bancos, aseguradoras, comercio electrónico, sistemas de reservas, y buena parte de los backends que usan Spring Boot.</p>
     <p>Sus señas de identidad:</p>
     <ul><li><b>Tipado estático</b>: cada variable tiene un tipo que se comprueba antes de ejecutar. Muchos errores se detectan al compilar.</li>
     <li><b>Orientado a objetos</b>: el código se organiza en clases y objetos.</li>
     <li><b>Portable</b>: el mismo programa se ejecuta en cualquier sistema gracias a la <b>JVM</b>.</li>
     <li><b>Gestión automática de memoria</b>: no tienes que liberar memoria a mano; lo hace el recolector de basura.</li>
     <li><b>Compatibilidad hacia atrás</b>: código escrito hace veinte años sigue compilando hoy. Es una de las razones por las que las empresas confían en él.</li></ul>`},
 {t:"info", eti:"El truco de la portabilidad", h:"Código fuente, bytecode y JVM",
  c:`<div class="dg"><div class="dg-tit">de código fuente a programa</div>
<div class="dg-flujo" style="row-gap:8px">
<div class="dg-caja doble"><code>Hola.java</code><small>código fuente</small></div>
<div class="dg-caja acento">javac compila</div>
<div class="dg-caja doble"><code>Hola.class</code><small>bytecode</small></div>
<div class="dg-caja acento">la JVM ejecuta</div>
<div class="dg-caja doble ok">programa en marcha<small>en Windows, Linux, macOS...</small></div>
</div></div>
     <p>El compilador <code>javac</code> no genera código para un procesador concreto, sino <b>bytecode</b>: instrucciones para una máquina imaginaria. La <b>JVM</b> (Java Virtual Machine) es el programa que ejecuta ese bytecode en cada sistema real. Mientras se ejecuta, la JVM detecta el código que más se usa y lo compila a código nativo (<b>JIT</b>) para que vaya rápido.</p>
     <p>Por eso Java arranca algo más lento que un programa en C, pero una vez «caliente» rinde muy bien: el JIT optimiza con datos reales de cómo se usa tu código.</p>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["Código fuente (.java)","Lo que escribes tú"],["javac","Compila el código a bytecode"],["Bytecode (.class)","Instrucciones portables para la JVM"],["JVM","Ejecuta el bytecode en cada sistema"],["JIT","Convierte el código más usado en código nativo mientras se ejecuta"]],
  why:"Otros lenguajes también corren en la JVM: Kotlin, Scala o Groovy."},
 {t:"orden", p:"Ordena lo que pasa desde que escribes el código hasta que se ejecuta rápido",
  items:["Escribes Pedido.java","javac lo compila a Pedido.class (bytecode)","La JVM carga la clase y empieza a interpretar el bytecode","El JIT detecta los métodos más usados y los compila a código nativo"],
  why:"El JIT trabaja mientras el programa corre: por eso se habla del «calentamiento» de una aplicación Java."},
 {t:"opcion", p:"¿Por qué el mismo <code>.jar</code> funciona en Windows y en Linux?",
  ops:["Porque se compila dos veces","Porque contiene bytecode que ejecuta la JVM de cada sistema","Porque Java es interpretado línea a línea","Porque Linux y Windows son iguales"],
  ok:1, why:"Lo que cambia entre sistemas es la JVM, no tu programa."},
 {t:"vf", p:"En Java tienes que liberar manualmente la memoria de los objetos que ya no usas.",
  ok:false, why:"El recolector de basura (garbage collector) libera la memoria de los objetos a los que ya nada apunta."},
 {t:"escribe", p:"¿Cómo se llama el componente de la JVM que compila a código nativo los métodos más usados mientras el programa se ejecuta? (tres letras)",
  sol:["JIT","jit","Just In Time","just-in-time"], pista:"«Justo a tiempo», en inglés.",
  why:"JIT = Just In Time. En HotSpot hay dos: C1 (rápido de compilar) y C2 (optimiza a fondo)."}
]},

{
id:"jv1l2",
titulo:"JDK, JRE y versiones",
claves:["JDK = herramientas para desarrollar (javac, java, jar...) + JVM","Versiones LTS: 17, 21 y 25; usa una LTS en producción","Distribuciones: Eclipse Temurin, Amazon Corretto, Oracle..."],
pasos:[
 {t:"info", eti:"Qué instalar", h:"JDK, JRE y JVM",
  c:`<div class="dg"><div class="dg-tit">qué contiene cada cosa</div>
<div class="dg-pila">
<div class="dg-caja acento doble">JDK<small>javac, jar, jshell, jlink, jcmd, jfr... + JRE</small></div>
<div class="dg-caja doble">JRE<small>librerías estándar (java.lang, java.util...) + JVM</small></div>
<div class="dg-caja base doble">JVM<small>ejecuta el bytecode, gestiona memoria, JIT</small></div>
</div></div>
     <ul><li><b>JVM</b>: la máquina virtual que ejecuta bytecode.</li>
     <li><b>JRE</b> (Java Runtime Environment): JVM + librerías estándar. Lo mínimo para <b>ejecutar</b>.</li>
     <li><b>JDK</b> (Java Development Kit): JRE + herramientas para <b>desarrollar</b>: <code>javac</code>, <code>jar</code>, <code>jshell</code>, <code>jdb</code>...</li></ul>
     <p>Como desarrollador instalas el <b>JDK</b>. En una imagen Docker de producción basta con un JRE (por ejemplo <code>eclipse-temurin:21-jre</code>) o un runtime a medida creado con <code>jlink</code>.</p>`},
 {t:"info", eti:"Versiones", h:"LTS y ciclo de publicación",
  c:`<p>Sale una versión nueva de Java cada <b>6 meses</b> (marzo y septiembre). Cada dos años, una es <b>LTS</b> (soporte a largo plazo): <b>17</b> (2021), <b>21</b> (2023) y <b>25</b> (2025). Las empresas usan LTS; Spring Boot 3 y 4 exigen al menos Java 17.</p>
     <div class="termbox">pablo@portatil:~$ java -version
openjdk version "21.0.4" 2024-07-16 LTS
OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)</div>
     <p>El JDK es software libre (OpenJDK) y lo distribuyen varias empresas: <b>Eclipse Temurin</b>, <b>Amazon Corretto</b>, Microsoft, Azul, Oracle... Para gestionar varias versiones en tu máquina, <b>SDKMAN!</b> es muy cómodo.</p>
     <div class="nota ojo"><b class="tit">Java 8 sigue ahí fuera</b>Te encontrarás proyectos antiguos en Java 8 u 11. Funcionan, pero se pierden años de mejoras (records, hilos virtuales, mejores recolectores). Migrar a una LTS reciente suele ser una de las primeras tareas en esos equipos.</div>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["JDK","Todo lo necesario para desarrollar"],["JRE","Lo necesario para ejecutar"],["LTS","Versión con soporte de larga duración"],["Eclipse Temurin","Distribución libre y gratuita del JDK"],["jlink","Crea un runtime a medida solo con los módulos que usa tu app"]],
  why:"En una entrevista es fácil que pregunten la diferencia entre JDK, JRE y JVM."},
 {t:"term", p:"Comprueba qué versión de Java tienes instalada",
  prompt:"pablo@portatil:~$", sol:["java -version","java --version"],
  pista:"El comando java con la opción -version.",
  salida:`openjdk version "21.0.4" 2024-07-16 LTS
OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.4+7 (build 21.0.4+7-LTS, mixed mode)`, why:"«mixed mode» significa que la JVM interpreta y además compila con el JIT."},
 {t:"opcion", p:"Vas a crear un proyecto nuevo con Spring Boot. ¿Qué versión de Java eliges?",
  ops:["Java 8","Una LTS reciente: 21 o 25","Java 22, que ya no tiene soporte","La que venga con el sistema"],
  ok:1, why:"Spring Boot 3 y 4 requieren Java 17 o superior; una LTS reciente da soporte y rendimiento."},
 {t:"vf", p:"Las versiones que no son LTS (como la 22 o la 24) dejan de recibir parches de seguridad cuando sale la siguiente versión, seis meses después.",
  ok:true, why:"Por eso en producción se usan LTS: los distribuidores las parchean durante años."},
 {t:"term", p:"Muestra la versión del compilador de Java",
  prompt:"pablo@portatil:~$", sol:["javac -version","javac --version"],
  pista:"Como antes, pero con el compilador.",
  salida:`javac 21.0.4`, why:"Si java funciona pero javac no existe, tienes instalado un JRE, no un JDK."}
]},

{
id:"jv1l3",
titulo:"Tu primer programa",
claves:["Todo código vive dentro de una clase","El programa empieza en public static void main(String[] args)","javac compila y java ejecuta; desde Java 11 puedes ejecutar un .java directamente"],
pasos:[
 {t:"info", eti:"Hola mundo", h:"Anatomía de un programa",
  c:`<div class="termbox"><span class="cm">// Hola.java</span>
public class Hola {
    public static void main(String[] args) {
        System.out.println("Hola, Catappa");
    }
}</div>
     <ul><li><code>public class Hola</code>: una <b>clase</b> llamada Hola. El fichero debe llamarse <b>Hola.java</b>, igual que la clase pública.</li>
     <li><code>public static void main(String[] args)</code>: el <b>punto de entrada</b>. La JVM busca este método para arrancar.</li>
     <li><code>System.out.println(...)</code>: imprime una línea en la consola. <code>System.out.print(...)</code> imprime sin salto de línea.</li>
     <li>Las llaves <code>{ }</code> delimitan bloques; cada instrucción termina en <code>;</code>.</li></ul>`},
 {t:"info", eti:"Compilar y ejecutar", h:"javac y java",
  c:`<div class="termbox">pablo@portatil:~/java$ javac Hola.java       <span class="cm"># genera Hola.class</span>
pablo@portatil:~/java$ java Hola             <span class="cm"># ejecuta la clase (sin .class)</span>
Hola, Catappa

pablo@portatil:~/java$ java Hola.java        <span class="cm"># Java 11+: compila en memoria y ejecuta</span>
Hola, Catappa</div>
     <p>Para probar trozos de código sin crear ficheros existe <b>jshell</b>, una consola interactiva de Java.</p>
     <div class="nota"><b class="tit">Java 25: main más corto</b>Desde Java 25 un fichero puede contener solo <code>void main() { IO.println("Hola"); }</code>, sin clase ni <code>static</code>: la clase se declara implícitamente. Es ideal para aprender y para scripts, pero en proyectos verás casi siempre la forma clásica, que es la que usamos en este curso.</div>`},
 {t:"term", p:"Compila el fichero <code>Hola.java</code>",
  prompt:"pablo@portatil:~/java$", sol:["javac Hola.java"],
  pista:"El compilador de Java seguido del nombre del fichero.",
  salida:``, why:"Si no hay errores, javac no dice nada y aparece Hola.class."},
 {t:"term", p:"Ahora ejecuta la clase <code>Hola</code> ya compilada",
  prompt:"pablo@portatil:~/java$", sol:["java Hola"],
  pista:"java seguido del nombre de la clase, sin extensión.",
  salida:`Hola, Catappa`, why:"Se indica la clase, no el fichero .class. Con <code>java Hola.class</code> fallaría."},
 {t:"hueco", p:"Completa la firma del método de entrada",
  tpl:"public ___ void main(String[] args)", banco:["static","final","class","private"], sol:["static"],
  why:"static: la JVM lo llama sin crear antes un objeto de la clase."},
 {t:"vf", p:"Una clase pública llamada <code>Pedido</code> puede guardarse en un fichero llamado <code>Pedidos.java</code>.",
  ok:false, why:"El nombre del fichero debe coincidir exactamente con el de la clase pública: Pedido.java."},
 {t:"codigo", p:"Imprime estas tres líneas, exactamente así",
  lenguaje:"java",
  c:`<div class="termbox">Catappa
Curso de Java
Primer programa</div><p>Usa un <code>println</code> por línea. Recuerda que en Catappa la clase se llama <code>Main</code>.</p>`,
  plantilla:`public class Main {
    public static void main(String[] args) {
        System.out.println("Catappa");
    }
}
`,
  pruebas:[{salida:"Catappa\nCurso de Java\nPrimer programa"}],
  pista:"Añade dos System.out.println más debajo del primero.",
  solucion:`public class Main {
    public static void main(String[] args) {
        System.out.println("Catappa");
        System.out.println("Curso de Java");
        System.out.println("Primer programa");
    }
}`,
  why:"Cada println termina con un salto de línea; con print tendrías que añadir \\n tú."}
]},

{
id:"jv1l4",
titulo:"Sintaxis básica y comentarios",
claves:["Java distingue mayúsculas y minúsculas","Convenciones: clases en PascalCase, métodos y variables en camelCase, constantes en MAYÚSCULAS","Comentarios: //, /* */ y /** */ (Javadoc)"],
pasos:[
 {t:"info", eti:"Reglas del idioma", h:"Lo básico de la sintaxis",
  c:`<ul><li><b>Sensible a mayúsculas</b>: <code>total</code> y <code>Total</code> son cosas distintas, y <code>system.out</code> no existe (es <code>System.out</code>).</li>
     <li>Cada instrucción termina en <b>punto y coma</b>.</li>
     <li>Los bloques van entre <b>llaves</b>; la sangría es por legibilidad, no obligatoria (a diferencia de Python).</li>
     <li>Los textos van entre <b>comillas dobles</b> <code>"hola"</code>; un solo carácter, entre simples <code>'a'</code>.</li></ul>`},
 {t:"info", eti:"Estilo", h:"Convenciones de nombres",
  c:`<div class="termbox">class PedidoService { }              <span class="cm">// clases: PascalCase</span>
int totalPedidos = 0;                <span class="cm">// variables: camelCase</span>
void calcularTotal() { }             <span class="cm">// métodos: camelCase, suelen ser verbos</span>
static final int MAX_REINTENTOS = 3; <span class="cm">// constantes: MAYÚSCULAS_CON_GUIONES</span>
package com.catappa.pedidos;           <span class="cm">// paquetes: minúsculas, dominio al revés</span></div>`},
 {t:"par", p:"Empareja cada nombre con lo que probablemente es",
  pares:[["ClienteRepository","Una clase o interfaz"],["precioFinal","Una variable"],["enviarCorreo()","Un método"],["IVA_GENERAL","Una constante"],["com.catappa.api","Un paquete"]],
  why:"Respetar las convenciones hace que cualquier programador Java entienda tu código de un vistazo."},
 {t:"info", eti:"Documentar", h:"Comentarios",
  c:`<div class="termbox">// comentario de una línea

/* comentario
   de varias líneas */

/**
 * Calcula el total del pedido con IVA.
 * @param base importe sin impuestos
 * @return importe con IVA
 */
double conIva(double base) { return base * 1.21; }</div>
     <p>Los comentarios <code>/** */</code> son <b>Javadoc</b>: se convierten en documentación HTML y los IDE los muestran al pasar el ratón. Un buen comentario explica el <b>porqué</b>; el <b>qué</b> ya lo dice el código.</p>`},
 {t:"opcion", p:"¿Qué ocurre al compilar <code>System.out.println(\"Hola\")</code> sin el punto y coma final?",
  ops:["Funciona igual","Error de compilación: se esperaba ';'","Imprime sin salto de línea","Aviso, pero compila"],
  ok:1, why:"El compilador detecta el error antes de ejecutar nada: una de las ventajas del tipado y la compilación."},
 {t:"vf", p:"En Java, la sangría del código es obligatoria para delimitar los bloques, como en Python.",
  ok:false, why:"Las llaves delimitan los bloques; la sangría es una convención de legibilidad (muy recomendable)."},
 {t:"codigo", p:"Este programa no compila. Arregla los tres errores para que imprima <code>Hola</code> y después <code>Hasta luego</code>",
  lenguaje:"java",
  c:`<p>Hay un problema de mayúsculas, un punto y coma que falta y unas comillas mal puestas. Lee el mensaje del compilador: te dice la línea.</p>`,
  plantilla:`public class Main {
    public static void main(String[] args) {
        system.out.println("Hola")
        System.out.println('Hasta luego');
    }
}
`,
  pruebas:[{salida:"Hola\nHasta luego"}],
  pista:"System con S mayúscula, ; al final de la primera línea y comillas dobles para textos.",
  solucion:`public class Main {
    public static void main(String[] args) {
        System.out.println("Hola");
        System.out.println("Hasta luego");
    }
}`,
  why:"Las comillas simples son para un único carácter (char). \"Hasta luego\" es un String y va entre dobles."}
]},

{
id:"jv1l6",
titulo:"Practica: compila y ejecuta Java",
claves:["El código va dentro de la clase Main, en el método main","System.out.println() imprime una línea","Scanner lee datos de la entrada estándar: nextInt, nextDouble, next y nextLine"],
pasos:[
 {t:"info", eti:"Novedad", h:"Java de verdad, compilado",
  c:`<p>En los pasos de <b>código</b> de este curso, Catappa guarda tu programa como <code>Main.java</code>, lo <b>compila con javac</b> y lo ejecuta con <code>java</code>. Si hay un error de compilación, verás el mismo mensaje que verías en tu máquina.</p>
     <p>La clase debe llamarse <b>Main</b>, porque así se llama el fichero. Algunos ejercicios te dan datos por la <b>entrada estándar</b> (lo que escribirías por teclado).</p>`},
 {t:"codigo", p:"Imprime exactamente <code>Hola, Catappa</code>",
  lenguaje:"java",
  plantilla:"public class Main {\n    public static void main(String[] args) {\n        // escribe aquí\n    }\n}\n",
  pruebas:[{salida:"Hola, Catappa"}],
  pista:"System.out.println(\"Hola, Catappa\");",
  solucion:"public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hola, Catappa\");\n    }\n}",
  why:"println imprime y añade el salto de línea; print no lo añade."},
 {t:"info", eti:"Leer datos", h:"Scanner",
  c:`<div class="termbox">import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int edad = sc.nextInt();          <span class="cm">// siguiente número entero</span>
double precio = sc.nextDouble();  <span class="cm">// siguiente decimal</span>
String palabra = sc.next();       <span class="cm">// siguiente palabra (hasta un espacio)</span>
String linea = sc.nextLine();     <span class="cm">// el resto de la línea actual</span>
while (sc.hasNextInt()) { ... }   <span class="cm">// ¿queda otro entero?</span></div>
     <div class="nota ojo"><b class="tit">La trampa de nextLine</b>Tras <code>nextInt()</code> el salto de línea sigue en la entrada. Un <code>nextLine()</code> justo después devuelve una cadena vacía. Solución: llama a <code>sc.nextLine()</code> una vez para consumirlo, o lee siempre líneas y conviértelas con <code>Integer.parseInt</code>.</div>`},
 {t:"codigo", p:"Lee dos enteros con Scanner (uno por línea) y muestra su suma",
  lenguaje:"java",
  c:`<p>Para leer por teclado se usa <code>Scanner</code>: <code>Scanner sc = new Scanner(System.in);</code> y después <code>sc.nextInt()</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // lee dos enteros e imprime la suma\n    }\n}\n",
  pruebas:[{entrada:"3\n4", salida:"7"}, {entrada:"100\n-40", salida:"60"}, {entrada:"0\n5", salida:"5", oculta:true}],
  pista:"int a = sc.nextInt(); int b = sc.nextInt(); System.out.println(a + b);",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}",
  why:"nextInt() lee el siguiente número saltándose los espacios y saltos de línea."},
 {t:"codigo", p:"Lee un nombre (una línea completa, puede tener espacios) y saluda: <code>Hola, NOMBRE!</code>",
  lenguaje:"java",
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // lee la línea y saluda\n    }\n}\n",
  pruebas:[{entrada:"Ana", salida:"Hola, Ana!"}, {entrada:"Juan Carlos Ruiz", salida:"Hola, Juan Carlos Ruiz!"}, {entrada:"Luis", salida:"Hola, Luis!", oculta:true}],
  pista:"String nombre = sc.nextLine(); y concatena con +.",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String nombre = sc.nextLine();\n        System.out.println(\"Hola, \" + nombre + \"!\");\n    }\n}",
  why:"next() solo habría leído «Ana»: se para en el primer espacio. Para frases, nextLine()."},
 {t:"opcion", p:"La entrada es <code>30</code> y en la línea siguiente <code>Ana López</code>. Haces <code>int e = sc.nextInt(); String n = sc.nextLine();</code>. ¿Qué vale <code>n</code>?",
  ops:["\"Ana López\"","\"\" (cadena vacía)","\"Ana\"","Lanza una excepción"],
  ok:1, why:"nextLine devuelve lo que queda de la línea del 30, que está vacío. Hay que consumir ese salto con otro nextLine() antes."},
 {t:"vf", p:"<code>sc.next()</code> lee una línea completa, espacios incluidos.",
  ok:false, why:"next() lee una palabra (hasta el siguiente espacio o salto). La línea completa es nextLine()."}
]}

]});
