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
     <li><b>Gestión automática de memoria</b>: no tienes que liberar memoria a mano; lo hace el recolector de basura.</li></ul>`},
 {t:"info", eti:"El truco de la portabilidad", h:"Código fuente, bytecode y JVM",
  c:`<div class="diag">Hola.java  --(javac compila)-->  Hola.class  --(la JVM ejecuta)-->  programa en marcha
codigo fuente                     bytecode                   en Windows, Linux, macOS...</div>
     <p>El compilador <code>javac</code> no genera código para un procesador concreto, sino <b>bytecode</b>: instrucciones para una máquina imaginaria. La <b>JVM</b> (Java Virtual Machine) es el programa que ejecuta ese bytecode en cada sistema real. Mientras se ejecuta, la JVM detecta el código que más se usa y lo compila a código nativo (<b>JIT</b>) para que vaya rápido.</p>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["Código fuente (.java)","Lo que escribes tú"],["javac","Compila el código a bytecode"],["Bytecode (.class)","Instrucciones portables para la JVM"],["JVM","Ejecuta el bytecode en cada sistema"],["JIT","Convierte el código más usado en código nativo mientras se ejecuta"]],
  why:"Otros lenguajes también corren en la JVM: Kotlin, Scala o Groovy."},
 {t:"opcion", p:"¿Por qué el mismo <code>.jar</code> funciona en Windows y en Linux?",
  ops:["Porque se compila dos veces","Porque contiene bytecode que ejecuta la JVM de cada sistema","Porque Java es interpretado línea a línea","Porque Linux y Windows son iguales"],
  ok:1, why:"Lo que cambia entre sistemas es la JVM, no tu programa."},
 {t:"vf", p:"En Java tienes que liberar manualmente la memoria de los objetos que ya no usas.",
  ok:false, why:"El recolector de basura (garbage collector) libera la memoria de los objetos a los que ya nada apunta."}
]},

{
id:"jv1l2",
titulo:"JDK, JRE y versiones",
claves:["JDK = herramientas para desarrollar (javac, java, jar...) + JVM","Versiones LTS: 17, 21 y 25; usa una LTS en producción","Distribuciones: Eclipse Temurin, Amazon Corretto, Oracle..."],
pasos:[
 {t:"info", eti:"Qué instalar", h:"JDK, JRE y JVM",
  c:`<ul><li><b>JVM</b>: la máquina virtual que ejecuta bytecode.</li>
     <li><b>JRE</b> (Java Runtime Environment): JVM + librerías estándar. Lo mínimo para <b>ejecutar</b>.</li>
     <li><b>JDK</b> (Java Development Kit): JRE + herramientas para <b>desarrollar</b>: <code>javac</code>, <code>jar</code>, <code>jshell</code>, <code>jdb</code>...</li></ul>
     <p>Como desarrollador instalas el <b>JDK</b>. En una imagen Docker de producción basta con un JRE (por ejemplo <code>eclipse-temurin:21-jre</code>).</p>`},
 {t:"info", eti:"Versiones", h:"LTS y ciclo de publicación",
  c:`<p>Sale una versión nueva de Java cada <b>6 meses</b>. Cada dos años, una es <b>LTS</b> (soporte a largo plazo): <b>17</b> (2021), <b>21</b> (2023) y <b>25</b> (2025). Las empresas usan LTS; Spring Boot 3 exige al menos Java 17.</p>
     <div class="termbox">pablo@portatil:~$ java -version
openjdk version "21.0.4" 2024-07-16 LTS
OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)</div>
     <p>El JDK es software libre (OpenJDK) y lo distribuyen varias empresas: <b>Eclipse Temurin</b>, <b>Amazon Corretto</b>, Microsoft, Azul, Oracle... Para gestionar varias versiones en tu máquina, <b>SDKMAN!</b> es muy cómodo.</p>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["JDK","Todo lo necesario para desarrollar"],["JRE","Lo necesario para ejecutar"],["LTS","Versión con soporte de larga duración"],["Eclipse Temurin","Distribución libre y gratuita del JDK"]],
  why:"En una entrevista es fácil que pregunten la diferencia entre JDK, JRE y JVM."},
 {t:"term", p:"Comprueba qué versión de Java tienes instalada",
  prompt:"pablo@portatil:~$", sol:["java -version","java --version"],
  pista:"El comando java con la opción -version.",
  salida:`openjdk version "21.0.4" 2024-07-16 LTS
OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.4+7 (build 21.0.4+7-LTS, mixed mode)`, why:"Java 21 LTS: la versión recomendada para proyectos nuevos con Spring Boot 3."},
 {t:"opcion", p:"Vas a crear un proyecto nuevo con Spring Boot 3. ¿Qué versión de Java eliges?",
  ops:["Java 8","Una LTS reciente: 21 (o 25)","Java 22, que ya no tiene soporte","La que venga con el sistema"],
  ok:1, why:"Spring Boot 3 requiere Java 17 o superior; una LTS reciente da soporte y rendimiento."}
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
     <li><code>public static void main(String[] args)</code>: el <b>punto de entrada</b>. La JVM busca exactamente este método para arrancar.</li>
     <li><code>System.out.println(...)</code>: imprime una línea en la consola.</li>
     <li>Las llaves <code>{ }</code> delimitan bloques; cada instrucción termina en <code>;</code>.</li></ul>`},
 {t:"info", eti:"Compilar y ejecutar", h:"javac y java",
  c:`<div class="termbox">pablo@portatil:~/java$ javac Hola.java       <span class="cm"># genera Hola.class</span>
pablo@portatil:~/java$ java Hola             <span class="cm"># ejecuta la clase (sin .class)</span>
Hola, Catappa

pablo@portatil:~/java$ java Hola.java        <span class="cm"># Java 11+: compila en memoria y ejecuta</span>
Hola, Catappa</div>
     <p>Para probar trozos de código sin crear ficheros existe <b>jshell</b>, una consola interactiva de Java.</p>`},
 {t:"term", p:"Compila el fichero <code>Hola.java</code>",
  prompt:"pablo@portatil:~/java$", sol:["javac Hola.java"],
  pista:"El compilador de Java seguido del nombre del fichero.",
  salida:``, why:"Si no hay errores, javac no dice nada y aparece Hola.class."},
 {t:"term", p:"Ahora ejecuta la clase <code>Hola</code> ya compilada",
  prompt:"pablo@portatil:~/java$", sol:["java Hola"],
  pista:"java seguido del nombre de la clase, sin extensión.",
  salida:`Hola, Catappa`, why:"Se indica la clase, no el fichero .class."},
 {t:"hueco", p:"Completa la firma del método de entrada",
  tpl:"public ___ void main(String[] args)", banco:["static","final","class","private"], sol:["static"],
  why:"static: la JVM lo llama sin crear antes un objeto de la clase."},
 {t:"vf", p:"Una clase pública llamada <code>Pedido</code> puede guardarse en un fichero llamado <code>Pedidos.java</code>.",
  ok:false, why:"El nombre del fichero debe coincidir exactamente con el de la clase pública: Pedido.java."}
]},

{
id:"jv1l4",
titulo:"Sintaxis básica y comentarios",
claves:["Java distingue mayúsculas y minúsculas","Convenciones: clases en PascalCase, métodos y variables en camelCase, constantes en MAYÚSCULAS","Comentarios: //, /* */ y /** */ (Javadoc)"],
pasos:[
 {t:"info", eti:"Reglas del idioma", h:"Lo básico de la sintaxis",
  c:`<ul><li><b>Sensible a mayúsculas</b>: <code>total</code> y <code>Total</code> son cosas distintas.</li>
     <li>Cada instrucción termina en <b>punto y coma</b>.</li>
     <li>Los bloques van entre <b>llaves</b>; la sangría es por legibilidad, no obligatoria (a diferencia de Python).</li>
     <li>Los textos van entre <b>comillas dobles</b> <code>"hola"</code>; un solo carácter, entre simples <code>'a'</code>.</li></ul>`},
 {t:"info", eti:"Estilo", h:"Convenciones de nombres",
  c:`<div class="termbox">class PedidoService { }              <span class="cm">// clases: PascalCase</span>
int totalPedidos = 0;                <span class="cm">// variables: camelCase</span>
void calcularTotal() { }             <span class="cm">// metodos: camelCase, suelen ser verbos</span>
static final int MAX_REINTENTOS = 3; <span class="cm">// constantes: MAYUSCULAS_CON_GUIONES</span>
package com.catappa.pedidos;           <span class="cm">// paquetes: minusculas, dominio al reves</span></div>`},
 {t:"par", p:"Empareja cada nombre con lo que probablemente es",
  pares:[["ClienteRepository","Una clase o interfaz"],["precioFinal","Una variable"],["enviarCorreo()","Un método"],["IVA_GENERAL","Una constante"],["com.catappa.api","Un paquete"]],
  why:"Respetar las convenciones hace que cualquier programador Java entienda tu código de un vistazo."},
 {t:"info", eti:"Documentar", h:"Comentarios",
  c:`<div class="termbox">// comentario de una linea

/* comentario
   de varias lineas */

/**
 * Calcula el total del pedido con IVA.
 * @param base importe sin impuestos
 * @return importe con IVA
 */
double conIva(double base) { return base * 1.21; }</div>
     <p>Los comentarios <code>/** */</code> son <b>Javadoc</b>: se convierten en documentación HTML y los IDE los muestran al pasar el ratón.</p>`},
 {t:"opcion", p:"¿Qué ocurre al compilar <code>System.out.println(\"Hola\")</code> sin el punto y coma final?",
  ops:["Funciona igual","Error de compilación: se esperaba ';'","Imprime sin salto de línea","Aviso, pero compila"],
  ok:1, why:"El compilador detecta el error antes de ejecutar nada: una de las ventajas del tipado y la compilación."},
 {t:"vf", p:"En Java, la sangría del código es obligatoria para delimitar los bloques, como en Python.",
  ok:false, why:"Las llaves delimitan los bloques; la sangría es una convención de legibilidad (muy recomendable)."}
]}

]});
