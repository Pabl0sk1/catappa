window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Herencia, interfaces y polimorfismo",
resumen: "extends y super, sobrescritura, clases abstractas, interfaces, polimorfismo, Object con equals y hashCode, y composición",
nivel: "Intermedio",
color: "#d95d42",
lecciones: [

{
id:"jv6l1",
titulo:"Herencia",
claves:["class B extends A: B hereda atributos y métodos de A","super llama al constructor o a métodos del padre","@Override sobrescribe un método heredado"],
pasos:[
 {t:"info", eti:"Especializar", h:"extends",
  c:`<div class="termbox">public class Empleado {
    protected String nombre;
    protected double salarioBase;

    public Empleado(String nombre, double salarioBase) {
        this.nombre = nombre; this.salarioBase = salarioBase;
    }
    public double salario() { return salarioBase; }
}

public class Gerente extends Empleado {
    private double bonus;

    public Gerente(String nombre, double base, double bonus) {
        super(nombre, base);           <span class="cm">// constructor del padre, primera línea</span>
        this.bonus = bonus;
    }

    @Override
    public double salario() {
        return super.salario() + bonus;   <span class="cm">// reutiliza la lógica del padre</span>
    }
}</div>
     <p>Un Gerente <b>es un</b> Empleado. Java solo permite heredar de <b>una</b> clase.</p>`},
 {t:"par", p:"Empareja cada palabra clave con su uso",
  pares:[["extends","Heredar de una clase"],["super(...)","Llamar al constructor del padre"],["super.metodo()","Usar la versión del padre de un método"],["@Override","Indicar que se sobrescribe un método heredado"],["final class","Impedir que se herede de esta clase"]],
  why:"@Override hace que el compilador avise si en realidad no estás sobrescribiendo nada (por una errata en el nombre)."},
 {t:"opcion", p:"¿Cuál es el propósito principal de la anotación <code>@Override</code>?",
  ops:["Es obligatoria para sobrescribir","Que el compilador compruebe que de verdad sobrescribes un método del padre","Hace el método más rápido","Lo hace público"],
  ok:1, why:"Si escribes salarioo() por error, sin @Override creas un método nuevo y nadie se entera."},
 {t:"vf", p:"En Java una clase puede heredar de dos clases a la vez.",
  ok:false, why:"Herencia simple de clases. Sí puede implementar varias interfaces."},
 {t:"info", eti:"Por dentro", h:"Qué se hereda y en qué orden se construye",
  c:`<ul><li>Se heredan los miembros <code>public</code> y <code>protected</code> (y los de paquete si estás en el mismo). Los <code>private</code> existen en el objeto, pero la hija no puede tocarlos.</li>
     <li>Los <b>constructores no se heredan</b>. Si no llamas a <code>super(...)</code>, Java inserta <code>super()</code> sin argumentos; si el padre no tiene ese constructor, no compila.</li>
     <li>Al crear un objeto se construye <b>primero el padre</b> y después la hija.</li>
     <li>Los métodos <code>static</code> no se sobrescriben: se <b>ocultan</b>. Qué versión se ejecuta depende del tipo declarado, no del objeto.</li></ul>
     <div class="nota ojo"><b class="tit">No llames a métodos sobrescribibles desde el constructor</b>Si el constructor del padre llama a un método que la hija sobrescribe, se ejecuta la versión de la hija antes de que sus atributos estén inicializados. Resultado típico: un null inesperado.</div>`},
 {t:"orden", p:"Con <code>new Gerente(...)</code>, ¿en qué orden se ejecuta todo?",
  items:["Se reserva memoria con los atributos a sus valores por defecto","Constructor de Object","Inicializadores y constructor de Empleado","Inicializadores y resto del constructor de Gerente"],
  why:"La cadena de constructores sube hasta Object y se ejecuta de arriba abajo."},
 {t:"codigo", p:"Sobrescribe <code>salario()</code> en <code>Gerente</code> reutilizando la del padre",
  lenguaje:"java",
  c:`<p>Un <code>Gerente</code> cobra el salario de un <code>Empleado</code> más su bonus. Completa el constructor (con <code>super</code>) y el método <code>salario()</code> (con <code>super.salario()</code>). El <code>main</code> ya imprime el salario de cada empleado de la entrada.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Empleado> plantilla = new ArrayList<>();\n        while (sc.hasNext()) {\n            String tipo = sc.next();\n            String nombre = sc.next();\n            double base = sc.nextDouble();\n            if (tipo.equals(\"G\")) plantilla.add(new Gerente(nombre, base, sc.nextDouble()));\n            else plantilla.add(new Empleado(nombre, base));\n        }\n        for (Empleado e : plantilla) System.out.println(e.nombre + \" \" + e.salario());\n    }\n}\n\nclass Empleado {\n    protected String nombre;\n    protected double salarioBase;\n\n    Empleado(String nombre, double salarioBase) {\n        this.nombre = nombre;\n        this.salarioBase = salarioBase;\n    }\n\n    double salario() { return salarioBase; }\n}\n\nclass Gerente extends Empleado {\n    private final double bonus;\n\n    Gerente(String nombre, double base, double bonus) {\n        super(nombre, base);\n        this.bonus = 0; // corrige\n    }\n\n    // sobrescribe salario()\n}\n",
  pruebas:[{entrada:"E ana 2000\nG luis 3000 500", salida:"ana 2000.0\nluis 3500.0"}, {entrada:"G marta 4000 1250.5", salida:"marta 5250.5", oculta:true}],
  pista:"this.bonus = bonus; y @Override double salario() { return super.salario() + bonus; }",
  solucion:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Empleado> plantilla = new ArrayList<>();\n        while (sc.hasNext()) {\n            String tipo = sc.next();\n            String nombre = sc.next();\n            double base = sc.nextDouble();\n            if (tipo.equals(\"G\")) plantilla.add(new Gerente(nombre, base, sc.nextDouble()));\n            else plantilla.add(new Empleado(nombre, base));\n        }\n        for (Empleado e : plantilla) System.out.println(e.nombre + \" \" + e.salario());\n    }\n}\n\nclass Empleado {\n    protected String nombre;\n    protected double salarioBase;\n\n    Empleado(String nombre, double salarioBase) {\n        this.nombre = nombre;\n        this.salarioBase = salarioBase;\n    }\n\n    double salario() { return salarioBase; }\n}\n\nclass Gerente extends Empleado {\n    private final double bonus;\n\n    Gerente(String nombre, double base, double bonus) {\n        super(nombre, base);\n        this.bonus = bonus;\n    }\n\n    @Override\n    double salario() { return super.salario() + bonus; }\n}",
  why:"El bucle del main trata a todos como Empleado y cada objeto responde con su propia versión: polimorfismo en acción."}
]},

{
id:"jv6l2",
titulo:"Clases abstractas e interfaces",
claves:["Una clase abstracta no se instancia y puede tener métodos sin cuerpo","Una interfaz define un contrato; una clase puede implementar varias","Las interfaces pueden tener métodos default y static"],
pasos:[
 {t:"info", eti:"Contratos", h:"Interfaces",
  c:`<div class="termbox">public interface Notificador {
    void enviar(String destino, String mensaje);

    default void enviarATodos(List&lt;String&gt; destinos, String mensaje) {
        destinos.forEach(d -&gt; enviar(d, mensaje));
    }
}

public class NotificadorEmail implements Notificador {
    @Override
    public void enviar(String destino, String mensaje) { ... }
}
public class NotificadorSms implements Notificador { ... }</div>
     <p>Una interfaz dice <b>qué</b> se puede hacer, no <b>cómo</b>. Spring se apoya en esto constantemente: inyectas un <code>Notificador</code> y en producción o en tests se usa una implementación distinta.</p>`},
 {t:"info", eti:"A medio hacer", h:"Clases abstractas",
  c:`<div class="termbox">public abstract class Figura {
    public abstract double area();          <span class="cm">// sin cuerpo: cada hija la implementa</span>
    public String describir() {             <span class="cm">// común a todas</span>
        return getClass().getSimpleName() + " de área " + area();
    }
}
public class Circulo extends Figura {
    private final double r;
    public Circulo(double r) { this.r = r; }
    public double area() { return Math.PI * r * r; }
}
new Figura();   <span class="cm">// ERROR: no se puede instanciar una clase abstracta</span></div>`},
 {t:"par", p:"Empareja cada característica con interfaz o clase abstracta",
  pares:[["implements","Una clase puede usar varias interfaces a la vez"],["extends (con clase abstracta)","Solo se puede heredar de una"],["Atributos de instancia y constructor","Los tiene la clase abstracta, no la interfaz"],["Método default","Implementación por defecto dentro de una interfaz"]],
  why:"Regla práctica: interfaz para definir capacidades o contratos; clase abstracta para compartir estado y código entre hijas muy relacionadas."},
 {t:"opcion", p:"Tu servicio de pagos debe poder usar Stripe o PayPal, y en los tests un simulador. ¿Qué diseño usas?",
  ops:["Un if con el nombre del proveedor en cada método","Una interfaz PasarelaPago con una implementación por proveedor","Una clase con todos los métodos de ambos","Métodos static"],
  ok:1, why:"El resto del código depende solo de la interfaz: cambiar de proveedor no toca la lógica de negocio."},
 {t:"vf", p:"Una clase que implementa una interfaz debe implementar todos sus métodos abstractos (o ser abstracta ella misma).",
  ok:true, why:"Los métodos default ya tienen implementación y no es obligatorio sobrescribirlos."},
 {t:"opcion", p:"Una clase implementa dos interfaces que tienen un método <code>default</code> con la misma firma. ¿Qué pasa?",
  ops:["Gana la primera interfaz de la lista","No compila hasta que la clase sobrescribe el método (y puede llamar a <code>A.super.metodo()</code>)","Se ejecutan los dos","Gana la interfaz más reciente"],
  ok:1, why:"Es el «problema del diamante» en interfaces: Java obliga a resolver el conflicto de forma explícita."},
 {t:"codigo", p:"Descuentos con una interfaz y dos implementaciones",
  lenguaje:"java",
  c:`<p>La interfaz <code>Descuento</code> tiene <code>double aplicar(double precio)</code> y un método <code>default</code> que describe el resultado. Implementa <code>Porcentaje</code> (resta un % del precio) y <code>Fijo</code> (resta una cantidad, pero el precio nunca baja de 0). El <code>main</code> ya lee líneas como <code>100 P 15</code> o <code>30 F 50</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNext()) {\n            double precio = sc.nextDouble();\n            String tipo = sc.next();\n            double valor = sc.nextDouble();\n            Descuento d = tipo.equals(\"P\") ? new Porcentaje(valor) : new Fijo(valor);\n            System.out.println(d.describir(precio));\n        }\n    }\n}\n\ninterface Descuento {\n    double aplicar(double precio);\n\n    default String describir(double precio) {\n        return String.format(\"%.2f -> %.2f\", precio, aplicar(precio));\n    }\n}\n\nclass Porcentaje implements Descuento {\n    private final double pct;\n    Porcentaje(double pct) { this.pct = pct; }\n    public double aplicar(double precio) { return precio; }\n}\n\nclass Fijo implements Descuento {\n    private final double cantidad;\n    Fijo(double cantidad) { this.cantidad = cantidad; }\n    public double aplicar(double precio) { return precio; }\n}\n",
  pruebas:[{entrada:"100 P 15\n30 F 5", salida:"100.00 -> 85.00\n30.00 -> 25.00"}, {entrada:"30 F 50", salida:"30.00 -> 0.00"}, {entrada:"19.99 P 50", salida:"19.99 -> 10.00", oculta:true}],
  pista:"Porcentaje: precio * (1 - pct / 100). Fijo: Math.max(0, precio - cantidad).",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNext()) {\n            double precio = sc.nextDouble();\n            String tipo = sc.next();\n            double valor = sc.nextDouble();\n            Descuento d = tipo.equals(\"P\") ? new Porcentaje(valor) : new Fijo(valor);\n            System.out.println(d.describir(precio));\n        }\n    }\n}\n\ninterface Descuento {\n    double aplicar(double precio);\n\n    default String describir(double precio) {\n        return String.format(\"%.2f -> %.2f\", precio, aplicar(precio));\n    }\n}\n\nclass Porcentaje implements Descuento {\n    private final double pct;\n    Porcentaje(double pct) { this.pct = pct; }\n    public double aplicar(double precio) { return precio * (1 - pct / 100); }\n}\n\nclass Fijo implements Descuento {\n    private final double cantidad;\n    Fijo(double cantidad) { this.cantidad = cantidad; }\n    public double aplicar(double precio) { return Math.max(0, precio - cantidad); }\n}",
  why:"Los métodos de una interfaz son públicos: al implementarlos hay que declararlos public, o no compila (no puedes reducir la visibilidad)."}
]},

{
id:"jv6l3",
titulo:"Polimorfismo",
claves:["Una referencia del tipo padre o interfaz puede apuntar a cualquier subtipo","Se ejecuta el método del objeto real (enlace dinámico)","instanceof con pattern matching para comprobar y convertir a la vez"],
pasos:[
 {t:"info", eti:"Muchas formas", h:"Un tipo, varios comportamientos",
  c:`<div class="termbox">List&lt;Figura&gt; figuras = List.of(new Circulo(1), new Cuadrado(2), new Triangulo(3, 4));
double total = 0;
for (Figura f : figuras) {
    total += f.area();      <span class="cm">// cada una usa SU versión de area()</span>
}</div>
     <p>El bucle no sabe ni le importa qué figura concreta es cada una. Añadir un <code>Hexagono</code> no obliga a cambiar este código. Esto es el <b>polimorfismo</b>.</p>`},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">Empleado e = new Gerente("Ana", 3000, 500);
System.out.println(e.salario());</div>`,
  ops:["3000.0","3500.0","Error de compilación","500.0"],
  ok:1, why:"Aunque la variable sea de tipo Empleado, el objeto es un Gerente y se ejecuta su salario()."},
 {t:"info", eti:"Comprobar el tipo", h:"instanceof con pattern matching",
  c:`<div class="termbox">if (figura instanceof Circulo c) {        <span class="cm">// comprueba y convierte en un paso</span>
    System.out.println("Radio: " + c.radio());
}</div>
     <p>Si te encuentras con muchos <code>instanceof</code> encadenados, suele ser señal de que ese comportamiento debería ser un método polimórfico (o un switch sobre una jerarquía sellada, que verás más adelante).</p>`},
 {t:"par", p:"Empareja cada principio de la POO con su descripción",
  pares:[["Encapsulación","Ocultar el estado y exponer operaciones"],["Herencia","Reutilizar y especializar una clase"],["Polimorfismo","Tratar distintos tipos a través de una interfaz común"],["Abstracción","Modelar solo lo relevante, ocultando detalles"]],
  why:"Los cuatro pilares de la POO: pregunta clásica de entrevista."},
 {t:"vf", p:"Con <code>Figura f = new Circulo(2);</code> puedes llamar a <code>f.radio()</code> directamente si radio() solo existe en Circulo.",
  ok:false, why:"El compilador solo conoce los métodos del tipo declarado (Figura). Hace falta comprobar y convertir: if (f instanceof Circulo c) c.radio()."},
 {t:"opcion", p:"Pregunta trampa: ¿qué imprime?", c:`<div class="termbox">static void ver(Object o) { System.out.println("object"); }
static void ver(String s) { System.out.println("string"); }

Object x = "hola";
ver(x);</div>`,
  ops:["string","object","No compila","Depende del objeto en tiempo de ejecución"],
  ok:1, why:"La <b>sobrecarga</b> se resuelve al compilar, con el tipo declarado (Object). Solo la <b>sobrescritura</b> (@Override) se decide en ejecución según el objeto real."},
 {t:"codigo", p:"Figuras polimórficas: área total y la mayor",
  lenguaje:"java",
  c:`<p>Crea <code>Circulo</code> (radio) y <code>Rect</code> (ancho, alto) que hereden de la clase abstracta <code>Figura</code> e implementen <code>area()</code> y <code>nombre()</code>. Cada línea de la entrada es <code>C r</code> o <code>R ancho alto</code>. El <code>main</code> imprime el área total y el nombre de la figura mayor.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Figura> figuras = new ArrayList<>();\n        while (sc.hasNext()) {\n            String t = sc.next();\n            if (t.equals(\"C\")) figuras.add(new Circulo(sc.nextDouble()));\n            else figuras.add(new Rect(sc.nextDouble(), sc.nextDouble()));\n        }\n        double total = 0;\n        Figura mayor = figuras.get(0);\n        for (Figura f : figuras) {\n            total += f.area();\n            if (f.area() > mayor.area()) mayor = f;\n        }\n        System.out.printf(\"total=%.2f mayor=%s%n\", total, mayor.nombre());\n    }\n}\n\nabstract class Figura {\n    abstract double area();\n    abstract String nombre();\n}\n\n// escribe Circulo y Rect\n",
  pruebas:[{entrada:"C 1\nR 2 3", salida:"total=9.14 mayor=rectangulo"}, {entrada:"R 1 1\nC 2", salida:"total=13.57 mayor=circulo"}, {entrada:"R 10 10", salida:"total=100.00 mayor=rectangulo", oculta:true}],
  pista:"class Circulo extends Figura { private final double r; Circulo(double r) { this.r = r; } double area() { return Math.PI * r * r; } String nombre() { return \"circulo\"; } }",
  solucion:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Figura> figuras = new ArrayList<>();\n        while (sc.hasNext()) {\n            String t = sc.next();\n            if (t.equals(\"C\")) figuras.add(new Circulo(sc.nextDouble()));\n            else figuras.add(new Rect(sc.nextDouble(), sc.nextDouble()));\n        }\n        double total = 0;\n        Figura mayor = figuras.get(0);\n        for (Figura f : figuras) {\n            total += f.area();\n            if (f.area() > mayor.area()) mayor = f;\n        }\n        System.out.printf(\"total=%.2f mayor=%s%n\", total, mayor.nombre());\n    }\n}\n\nabstract class Figura {\n    abstract double area();\n    abstract String nombre();\n}\n\nclass Circulo extends Figura {\n    private final double r;\n    Circulo(double r) { this.r = r; }\n    double area() { return Math.PI * r * r; }\n    String nombre() { return \"circulo\"; }\n}\n\nclass Rect extends Figura {\n    private final double ancho, alto;\n    Rect(double ancho, double alto) { this.ancho = ancho; this.alto = alto; }\n    double area() { return ancho * alto; }\n    String nombre() { return \"rectangulo\"; }\n}",
  why:"El main no tiene ni un if sobre el tipo de figura al calcular: añadir un Triangulo solo exige una clase nueva. Eso es el principio abierto/cerrado."}
]},

{
id:"jv6l4",
titulo:"Object: equals, hashCode y toString",
claves:["Todas las clases heredan de Object","Si sobrescribes equals, sobrescribe hashCode: objetos iguales, mismo hash","Composición antes que herencia"],
pasos:[
 {t:"info", eti:"La raíz", h:"Los métodos de Object",
  c:`<p>Toda clase hereda de <code>Object</code> sus métodos <code>equals</code>, <code>hashCode</code> y <code>toString</code>. Por defecto, <code>equals</code> compara identidad (como <code>==</code>).</p>
     <div class="termbox">public class Email {
    private final String valor;
    public Email(String valor) { this.valor = valor.toLowerCase(); }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email otro)) return false;
        return valor.equals(otro.valor);
    }
    @Override public int hashCode() { return valor.hashCode(); }
    @Override public String toString() { return valor; }
}</div>`},
 {t:"info", eti:"El contrato", h:"Por qué van juntos",
  c:`<p><code>HashMap</code> y <code>HashSet</code> usan primero <code>hashCode</code> para encontrar el «cajón» y luego <code>equals</code> dentro de él. Si dos objetos son <code>equals</code> pero tienen distinto hashCode, el conjunto no los reconocerá como iguales:</p>
     <div class="termbox">Set&lt;Email&gt; emails = new HashSet&lt;&gt;();
emails.add(new Email("ana@x.com"));
emails.contains(new Email("ANA@x.com"));   <span class="cm">// true solo si hashCode es coherente con equals</span></div>
     <p>Los <b>records</b> (que verás más adelante) generan equals, hashCode y toString automáticamente.</p>`},
 {t:"opcion", p:"Sobrescribes <code>equals</code> en tu clase pero no <code>hashCode</code>. ¿Qué puede fallar?",
  ops:["Nada","HashSet y HashMap pueden tratar como distintos objetos que son iguales (duplicados, búsquedas que no encuentran)","No compila","toString deja de funcionar"],
  ok:1, why:"Regla: a.equals(b) implica a.hashCode() == b.hashCode()."},
 {t:"info", eti:"Diseño", h:"Composición antes que herencia",
  c:`<p>La herencia acopla mucho: cualquier cambio en el padre afecta a todas las hijas. A menudo es mejor que una clase <b>tenga</b> otra (composición) en vez de <b>ser</b> otra:</p>
     <div class="termbox">public class PedidoService {
    private final PedidoRepository repo;      <span class="cm">// tiene un repositorio</span>
    private final Notificador notificador;    <span class="cm">// tiene un notificador</span>
    ...
}</div>
     <p>Así funciona casi todo el código de Spring: objetos que colaboran, inyectados por constructor.</p>`},
 {t:"vf", p:"Dos objetos que son <code>equals</code> deben devolver el mismo <code>hashCode</code>.",
  ok:true, why:"Es el contrato de Object. Lo contrario no es obligatorio: dos objetos distintos pueden coincidir en hash."},
 {t:"opcion", p:"Un objeto está dentro de un <code>HashSet</code> y cambias el atributo que usa su <code>hashCode</code>. ¿Qué pasa después con <code>set.contains(obj)</code>?",
  ops:["Sigue devolviendo true","Probablemente devuelva false: el objeto está guardado en el cajón de su hash antiguo","Lanza ConcurrentModificationException","El set se reordena solo"],
  ok:1, why:"Por eso las claves de mapas y los elementos de conjuntos deberían ser inmutables (Strings, records, enums)."},
 {t:"codigo", p:"Implementa <code>equals</code> y <code>hashCode</code> en <code>Punto</code>",
  lenguaje:"java",
  c:`<p>El <code>main</code> mete en un <code>HashSet</code> un <code>Punto</code> por cada par de coordenadas de la entrada e imprime cuántos puntos <b>distintos</b> hay. Sin equals y hashCode, cada <code>new Punto</code> cuenta como distinto. Usa <code>Objects.hash(x, y)</code> para el hash.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Set<Punto> puntos = new HashSet<>();\n        while (sc.hasNextInt()) puntos.add(new Punto(sc.nextInt(), sc.nextInt()));\n        System.out.println(puntos.size());\n    }\n}\n\nclass Punto {\n    private final int x, y;\n    Punto(int x, int y) { this.x = x; this.y = y; }\n\n    // sobrescribe equals y hashCode\n}\n",
  pruebas:[{entrada:"1 2\n3 4\n1 2", salida:"2"}, {entrada:"0 0\n0 0\n0 0\n5 -5", salida:"2"}, {entrada:"1 2\n2 1", salida:"2", oculta:true}],
  pista:"@Override public boolean equals(Object o) { return o instanceof Punto p && p.x == x && p.y == y; } @Override public int hashCode() { return Objects.hash(x, y); }",
  solucion:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Set<Punto> puntos = new HashSet<>();\n        while (sc.hasNextInt()) puntos.add(new Punto(sc.nextInt(), sc.nextInt()));\n        System.out.println(puntos.size());\n    }\n}\n\nclass Punto {\n    private final int x, y;\n    Punto(int x, int y) { this.x = x; this.y = y; }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        return o instanceof Punto p && p.x == x && p.y == y;\n    }\n\n    @Override\n    public int hashCode() { return Objects.hash(x, y); }\n}",
  why:"La prueba (1,2) y (2,1) comprueba que el hash tiene en cuenta el orden. Un hash como x + y funcionaría, pero con muchas colisiones: todos los puntos de la misma diagonal irían al mismo cajón."}
]},

{
id:"jv6n5",
titulo:"Clases anidadas, locales y anónimas",
claves:["static nested: una clase auxiliar dentro de otra, sin acceso a la instancia exterior","Clase interna (inner): cada instancia guarda una referencia oculta al objeto exterior","Clases anónimas: implementación de un solo uso; hoy casi siempre se sustituyen por lambdas"],
pasos:[
 {t:"info", eti:"Clases dentro de clases", h:"Los cuatro tipos",
  c:`<div class="termbox">public class Pedido {
    private final List&lt;Linea&gt; lineas = new ArrayList&lt;&gt;();

    <span class="cm">// 1. static nested: no necesita un Pedido para existir</span>
    public static class Builder { ... }

    <span class="cm">// 2. inner: cada Linea «pertenece» a un Pedido concreto</span>
    public class Linea {
        double total() { return ... * Pedido.this.descuento(); }  <span class="cm">// accede al exterior</span>
    }

    void validar() {
        <span class="cm">// 3. local: declarada dentro de un método</span>
        record Error(String campo, String motivo) { }
        ...
    }

    Comparator&lt;Linea&gt; porTotal() {
        <span class="cm">// 4. anónima: se declara y se instancia a la vez</span>
        return new Comparator&lt;Linea&gt;() {
            public int compare(Linea a, Linea b) { return Double.compare(a.total(), b.total()); }
        };
    }
}</div>`},
 {t:"info", eti:"Cuál elegir", h:"Prefiere static nested",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tipos de clase anidada</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>¿accede al objeto exterior?</th><th>uso típico</th></tr></thead><tbody>
<tr><td>static nested</td><td>no</td><td>builders, nodos de una lista, DTO auxiliares</td></tr>
<tr><td>inner</td><td>sí (referencia oculta)</td><td>iteradores de una colección propia</td></tr>
<tr><td>local</td><td>sí, y a variables efectivamente finales</td><td>records auxiliares dentro de un método</td></tr>
<tr><td>anónima</td><td>sí, igual que la local</td><td>código antiguo; hoy, lambdas</td></tr>
</tbody></table></div>
     <div class="nota ojo"><b class="tit">La fuga de memoria escondida</b>Una clase interna (no static) guarda una referencia al objeto exterior. Si la instancia interna vive mucho (en una caché, un listener registrado, una tarea programada), mantiene vivo al exterior y todo lo que este referencia. Regla de Effective Java: si no necesitas acceso al exterior, hazla <code>static</code>.</div>`},
 {t:"par", p:"Empareja cada tipo de clase con su característica",
  pares:[["static nested","Se instancia sin un objeto exterior: new Pedido.Builder()"],["inner","Se instancia a partir de un objeto: pedido.new Linea()"],["local","Solo existe dentro del método que la declara"],["anónima","No tiene nombre y se crea en la misma expresión"]],
  why:"Map.Entry es una interfaz anidada en Map; HashMap.Node es una static nested class."},
 {t:"opcion", p:"Tienes una clase anónima de una interfaz con un único método abstracto. ¿Qué la sustituye hoy?",
  ops:["Una clase abstracta","Una lambda: <code>(a, b) -&gt; Double.compare(a.total(), b.total())</code>","Un enum","Un método static"],
  ok:1, why:"Una interfaz con un solo método abstracto es una interfaz funcional. Las lambdas llegaron en Java 8 justo para eso."},
 {t:"vf", p:"Una clase anónima o una lambda puede modificar una variable local del método que la contiene.",
  ok:false, why:"Solo puede leer variables locales finales o «efectivamente finales» (que nunca se reasignan). Se captura su valor, no la variable."},
 {t:"codigo", p:"Un builder como clase static anidada",
  lenguaje:"java",
  c:`<p>Completa <code>Pizza.Builder</code>: guarda el tamaño (por defecto <code>mediana</code>) y una lista de ingredientes; <code>tamano(String)</code> y <code>con(String)</code> devuelven <code>this</code> para encadenar llamadas, y <code>build()</code> crea la <code>Pizza</code>. El <code>main</code> ya construye dos pizzas.</p>`,
  plantilla:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Pizza a = new Pizza.Builder().tamano(\"grande\").con(\"queso\").con(\"setas\").build();\n        Pizza b = new Pizza.Builder().con(\"tomate\").build();\n        System.out.println(a);\n        System.out.println(b);\n    }\n}\n\nclass Pizza {\n    private final String tamano;\n    private final List<String> ingredientes;\n\n    private Pizza(Builder b) {\n        this.tamano = b.tamano;\n        this.ingredientes = List.copyOf(b.ingredientes);\n    }\n\n    @Override\n    public String toString() { return tamano + \" \" + ingredientes; }\n\n    static class Builder {\n        private String tamano;\n        private final List<String> ingredientes = new ArrayList<>();\n\n        Builder tamano(String t) { return this; }\n        Builder con(String ingrediente) { return this; }\n        Pizza build() { return new Pizza(this); }\n    }\n}\n",
  pruebas:[{salida:"grande [queso, setas]\nmediana [tomate]"}],
  pista:"private String tamano = \"mediana\"; en tamano(): this.tamano = t; return this;. En con(): ingredientes.add(ingrediente); return this;",
  solucion:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Pizza a = new Pizza.Builder().tamano(\"grande\").con(\"queso\").con(\"setas\").build();\n        Pizza b = new Pizza.Builder().con(\"tomate\").build();\n        System.out.println(a);\n        System.out.println(b);\n    }\n}\n\nclass Pizza {\n    private final String tamano;\n    private final List<String> ingredientes;\n\n    private Pizza(Builder b) {\n        this.tamano = b.tamano;\n        this.ingredientes = List.copyOf(b.ingredientes);\n    }\n\n    @Override\n    public String toString() { return tamano + \" \" + ingredientes; }\n\n    static class Builder {\n        private String tamano = \"mediana\";\n        private final List<String> ingredientes = new ArrayList<>();\n\n        Builder tamano(String t) { this.tamano = t; return this; }\n        Builder con(String ingrediente) { ingredientes.add(ingrediente); return this; }\n        Pizza build() { return new Pizza(this); }\n    }\n}",
  why:"Como Builder está anidada, puede usar el constructor privado de Pizza y leer sus campos privados; y al ser static, no necesita una Pizza para existir."}
]}

]});
