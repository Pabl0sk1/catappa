window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Clases y objetos",
resumen: "Programación orientada a objetos: clases, objetos, atributos, constructores, this, encapsulación, static y enums",
nivel: "Intermedio",
color: "#d95d42",
lecciones: [

{
id:"jv5l1",
titulo:"Clases y objetos",
claves:["Una clase es un molde; un objeto es una instancia concreta creada con new","Los atributos guardan el estado; los métodos, el comportamiento","Las variables de objeto guardan referencias; null significa «ningún objeto»"],
pasos:[
 {t:"info", eti:"El molde", h:"¿Qué es una clase?",
  c:`<p>Una <b>clase</b> describe un tipo de cosa: qué datos tiene (<b>atributos</b>) y qué sabe hacer (<b>métodos</b>). Un <b>objeto</b> es una cosa concreta creada a partir de ese molde.</p>
     <div class="termbox">public class Producto {
    String nombre;          <span class="cm">// atributos (estado)</span>
    double precio;
    int stock;

    boolean disponible() {  <span class="cm">// método (comportamiento)</span>
        return stock &gt; 0;
    }
}

Producto teclado = new Producto();   <span class="cm">// un objeto</span>
teclado.nombre = "Teclado";
teclado.stock = 3;
teclado.disponible();                <span class="cm">// true</span></div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Clase","Molde que define atributos y métodos"],["Objeto","Instancia concreta creada con new"],["Atributo","Dato que guarda cada objeto"],["Método","Comportamiento que ofrece la clase"],["Referencia","Variable que apunta a un objeto en memoria"]],
  why:"Toda la programación en Java (y en Spring) gira en torno a estos cinco conceptos."},
 {t:"info", eti:"Referencias", h:"Variables que apuntan",
  c:`<div class="termbox">Producto a = new Producto();
Producto b = a;           <span class="cm">// b apunta al MISMO objeto</span>
b.stock = 10;
System.out.println(a.stock);   <span class="cm">// 10</span>

Producto c = null;        <span class="cm">// no apunta a nada</span>
c.disponible();           <span class="cm">// NullPointerException</span></div>`},
 {t:"opcion", p:"Tras <code>Producto x = new Producto(); Producto y = x; y.precio = 5;</code>, ¿cuánto vale <code>x.precio</code>?",
  ops:["0","5","null","Error"],
  ok:1, why:"x e y son dos referencias al mismo objeto."},
 {t:"vf", p:"Cada llamada a <code>new Producto()</code> crea un objeto nuevo e independiente.",
  ok:true, why:"Cada objeto tiene sus propios valores de atributos."},
 {t:"opcion", p:"Una clase tiene los atributos <code>int stock; String nombre; boolean activo;</code> y no los inicializa. ¿Qué valen en un objeto recién creado?",
  ops:["Error de compilación: no están inicializados","0, null y false","Valores aleatorios de la memoria","0, \"\" y false"],
  ok:1, why:"Los atributos reciben valor por defecto (0, null, false). Las variables locales no: usarlas sin asignar no compila."},
 {t:"codigo", p:"Crea la clase <code>Rectangulo</code>",
  lenguaje:"java",
  c:`<p>Completa los métodos <code>area()</code> y <code>perimetro()</code> y el método <code>esCuadrado()</code>. El <code>main</code> crea un rectángulo con los dos números de la entrada e imprime los tres resultados.</p><p>En Catappa todo va en un fichero: puedes declarar otras clases (sin <code>public</code>) debajo de <code>Main</code>.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Rectangulo r = new Rectangulo();\n        r.ancho = sc.nextDouble();\n        r.alto = sc.nextDouble();\n        System.out.println(r.area());\n        System.out.println(r.perimetro());\n        System.out.println(r.esCuadrado());\n    }\n}\n\nclass Rectangulo {\n    double ancho;\n    double alto;\n\n    double area() { return 0; }\n    double perimetro() { return 0; }\n    boolean esCuadrado() { return false; }\n}\n",
  pruebas:[{entrada:"3 4", salida:"12.0\n14.0\nfalse"}, {entrada:"2.5 2.5", salida:"6.25\n10.0\ntrue"}, {entrada:"1 10", salida:"10.0\n22.0\nfalse", oculta:true}],
  pista:"area: ancho * alto; perimetro: 2 * (ancho + alto); esCuadrado: ancho == alto.",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Rectangulo r = new Rectangulo();\n        r.ancho = sc.nextDouble();\n        r.alto = sc.nextDouble();\n        System.out.println(r.area());\n        System.out.println(r.perimetro());\n        System.out.println(r.esCuadrado());\n    }\n}\n\nclass Rectangulo {\n    double ancho;\n    double alto;\n\n    double area() { return ancho * alto; }\n    double perimetro() { return 2 * (ancho + alto); }\n    boolean esCuadrado() { return ancho == alto; }\n}",
  why:"Los métodos usan los atributos del propio objeto sin recibirlos como parámetros: eso es lo que diferencia un método de instancia de uno static."}
]},

{
id:"jv5l2",
titulo:"Constructores y this",
claves:["El constructor inicializa el objeto al crearlo; se llama como la clase y no tiene tipo de retorno","this se refiere al objeto actual","Se pueden encadenar constructores con this(...)"],
pasos:[
 {t:"info", eti:"Nacer bien", h:"Constructores",
  c:`<div class="termbox">public class Producto {
    private final String nombre;
    private double precio;

    public Producto(String nombre, double precio) {
        if (precio &lt; 0) throw new IllegalArgumentException("precio negativo");
        this.nombre = nombre;       <span class="cm">// this.nombre = atributo; nombre = parámetro</span>
        this.precio = precio;
    }

    public Producto(String nombre) {
        this(nombre, 0);            <span class="cm">// llama al otro constructor</span>
    }
}

Producto p = new Producto("Ratón", 24.5);</div>
     <p>Si no escribes ningún constructor, Java añade uno vacío por defecto. En cuanto escribes uno, ese desaparece.</p>`},
 {t:"hueco", p:"Completa el constructor para asignar el parámetro al atributo",
  tpl:"public Cliente(String email) {\n    ___.email = email;\n}", banco:["this","super","self","Cliente"], sol:["this"],
  why:"this.email es el atributo del objeto; email a secas es el parámetro."},
 {t:"opcion", p:"¿Por qué validar en el constructor (por ejemplo, precio negativo)?",
  ops:["Por estilo","Para que nunca pueda existir un objeto en estado inválido","Porque es obligatorio","Por rendimiento"],
  ok:1, why:"Un objeto que se crea siempre válido elimina comprobaciones repetidas por todo el código."},
 {t:"vf", p:"Un constructor declara un tipo de retorno <code>void</code>.",
  ok:false, why:"Los constructores no tienen tipo de retorno. Si pones void, se convierte en un método normal con el nombre de la clase."},
 {t:"info", eti:"Muchos parámetros", h:"Cuando el constructor crece",
  c:`<p>Un constructor con siete parámetros del mismo tipo es una trampa: <code>new Usuario("Ana", "Ruiz", "ana@x.es", "Madrid", ...)</code> invita a cambiar el orden sin que el compilador lo note. Alternativas habituales:</p>
     <ul><li><b>Métodos de fábrica</b> con nombre: <code>Usuario.invitado()</code>, <code>Precio.enEuros(10)</code>.</li>
     <li><b>Patrón builder</b>: <code>Usuario.builder().nombre("Ana").email("ana@x.es").build()</code> (lo verás en la unidad de diseño; Lombok lo genera con <code>@Builder</code>).</li>
     <li><b>Tipos pequeños</b> en vez de Strings sueltos: <code>new Usuario(nombre, new Email("ana@x.es"))</code>.</li></ul>`},
 {t:"vf", p:"Si escribes un constructor con parámetros, <code>new Producto()</code> sin argumentos sigue compilando.",
  ok:false, why:"El constructor por defecto solo se añade si no escribes ninguno. Si lo necesitas (por ejemplo, para JPA), declara uno vacío."},
 {t:"codigo", p:"Un producto que nunca nace inválido",
  lenguaje:"java",
  c:`<p>Completa el constructor de <code>Producto</code>: si el nombre es null o está en blanco, lanza <code>IllegalArgumentException("nombre vacio")</code>; si el precio es negativo, <code>IllegalArgumentException("precio negativo")</code>. Si todo está bien, guarda los valores. El <code>main</code> prueba cada línea de la entrada (<code>nombre;precio</code>) e imprime el producto o el mensaje del error.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String[] c = sc.nextLine().split(\";\", -1);\n            try {\n                Producto p = new Producto(c[0], Double.parseDouble(c[1]));\n                System.out.println(p.descripcion());\n            } catch (IllegalArgumentException e) {\n                System.out.println(\"ERROR: \" + e.getMessage());\n            }\n        }\n    }\n}\n\nclass Producto {\n    private final String nombre;\n    private final double precio;\n\n    Producto(String nombre, double precio) {\n        // valida y asigna\n        this.nombre = nombre;\n        this.precio = precio;\n    }\n\n    String descripcion() { return nombre + \" (\" + precio + \")\"; }\n}\n",
  pruebas:[{entrada:"raton;24.5\n;10\nteclado;-3", salida:"raton (24.5)\nERROR: nombre vacio\nERROR: precio negativo"}, {entrada:"   ;1", salida:"ERROR: nombre vacio"}, {entrada:"cable;0", salida:"cable (0.0)", oculta:true}],
  pista:"if (nombre == null || nombre.isBlank()) throw new IllegalArgumentException(\"nombre vacio\");",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            String[] c = sc.nextLine().split(\";\", -1);\n            try {\n                Producto p = new Producto(c[0], Double.parseDouble(c[1]));\n                System.out.println(p.descripcion());\n            } catch (IllegalArgumentException e) {\n                System.out.println(\"ERROR: \" + e.getMessage());\n            }\n        }\n    }\n}\n\nclass Producto {\n    private final String nombre;\n    private final double precio;\n\n    Producto(String nombre, double precio) {\n        if (nombre == null || nombre.isBlank()) throw new IllegalArgumentException(\"nombre vacio\");\n        if (precio < 0) throw new IllegalArgumentException(\"precio negativo\");\n        this.nombre = nombre;\n        this.precio = precio;\n    }\n\n    String descripcion() { return nombre + \" (\" + precio + \")\"; }\n}",
  why:"Con los atributos final y la validación en el constructor, cualquier Producto que exista en tu programa es válido. Nadie tiene que volver a comprobarlo."}
]},

{
id:"jv5l3",
titulo:"Encapsulación y modificadores de acceso",
claves:["Atributos private y acceso controlado mediante métodos","private, (paquete), protected y public","Exponer comportamiento, no datos: métodos con significado mejor que setters para todo"],
pasos:[
 {t:"info", eti:"Proteger el estado", h:"¿Por qué private?",
  c:`<p>Si el saldo de una cuenta es público, cualquier parte del código puede poner <code>cuenta.saldo = -1000</code>. <b>Encapsular</b> es esconder el estado y ofrecer operaciones que mantienen las reglas:</p>
     <div class="termbox">public class Cuenta {
    private BigDecimal saldo = BigDecimal.ZERO;

    public BigDecimal getSaldo() { return saldo; }

    public void retirar(BigDecimal importe) {
        if (importe.compareTo(saldo) &gt; 0) throw new IllegalStateException("Saldo insuficiente");
        saldo = saldo.subtract(importe);
    }
}</div>`},
 {t:"par", p:"Empareja cada modificador con desde dónde es accesible",
  pares:[["private","Solo desde la propia clase"],["(sin modificador)","Desde el mismo paquete"],["protected","Mismo paquete y subclases"],["public","Desde cualquier sitio"]],
  why:"Regla práctica: todo private salvo lo que necesite ser visible."},
 {t:"opcion", p:"¿Qué diseño encapsula mejor una cuenta bancaria?",
  ops:["saldo público","getSaldo() y setSaldo(valor) sin validar","getSaldo(), ingresar(importe) y retirar(importe) con sus reglas","Un atributo estático"],
  ok:2, why:"Un setter sin reglas es casi lo mismo que un atributo público. Los métodos con significado protegen las invariantes."},
 {t:"vf", p:"En la encapsulación, los getters y setters para todos los atributos son siempre la mejor opción.",
  ok:false, why:"Solo expón lo necesario. Muchos atributos no necesitan setter (mejor inmutables) y otros se modifican con operaciones de negocio."},
 {t:"info", eti:"Fugas de estado", h:"Copias defensivas",
  c:`<div class="termbox">class Equipo {
    private final List&lt;String&gt; miembros;
    Equipo(List&lt;String&gt; m) { this.miembros = m; }       <span class="cm">// MAL: guarda la lista de fuera</span>
    List&lt;String&gt; getMiembros() { return miembros; }     <span class="cm">// MAL: entrega la suya</span>
}

<span class="cm">// BIEN: copia al entrar y devuelve algo que no se puede modificar</span>
Equipo(List&lt;String&gt; m) { this.miembros = List.copyOf(m); }
List&lt;String&gt; getMiembros() { return miembros; }   <span class="cm">// ya es inmutable</span></div>
     <p>Aunque el atributo sea <code>private final</code>, si entregas la lista mutable, quien la reciba puede cambiar tu estado por detrás. Es un fallo de encapsulación muy habitual.</p>`},
 {t:"escribe", p:"¿Qué modificador de acceso usas por defecto para los atributos de una clase?",
  sol:["private"], pista:"El más restrictivo.",
  why:"Empieza por private y abre solo lo que haga falta. Cerrar algo que ya era público rompe a quien lo usaba."},
 {t:"codigo", p:"Cuenta bancaria con reglas",
  lenguaje:"java",
  c:`<p>Completa <code>ingresar</code> y <code>retirar</code> de la clase <code>Cuenta</code> (importes en céntimos, como <code>long</code>). Ingresar una cantidad ≤ 0 o retirar más del saldo son operaciones rechazadas: devuelven <code>false</code> y no tocan el saldo. El <code>main</code> procesa órdenes como <code>ingresar 1000</code> e imprime el saldo final y cuántas se rechazaron.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Cuenta c = new Cuenta();\n        int rechazadas = 0;\n        while (sc.hasNext()) {\n            String op = sc.next();\n            long importe = sc.nextLong();\n            boolean ok = op.equals(\"ingresar\") ? c.ingresar(importe) : c.retirar(importe);\n            if (!ok) rechazadas++;\n        }\n        System.out.println(\"saldo=\" + c.getSaldo() + \" rechazadas=\" + rechazadas);\n    }\n}\n\nclass Cuenta {\n    private long saldo;\n\n    long getSaldo() { return saldo; }\n\n    boolean ingresar(long importe) {\n        saldo += importe;\n        return true;\n    }\n\n    boolean retirar(long importe) {\n        saldo -= importe;\n        return true;\n    }\n}\n",
  pruebas:[{entrada:"ingresar 1000\nretirar 300\nretirar 5000", salida:"saldo=700 rechazadas=1"}, {entrada:"ingresar -50\nretirar 0\ningresar 20", salida:"saldo=20 rechazadas=2"}, {entrada:"ingresar 100\nretirar 100", salida:"saldo=0 rechazadas=0", oculta:true}],
  pista:"En ingresar: if (importe <= 0) return false;. En retirar: if (importe <= 0 || importe > saldo) return false;.",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Cuenta c = new Cuenta();\n        int rechazadas = 0;\n        while (sc.hasNext()) {\n            String op = sc.next();\n            long importe = sc.nextLong();\n            boolean ok = op.equals(\"ingresar\") ? c.ingresar(importe) : c.retirar(importe);\n            if (!ok) rechazadas++;\n        }\n        System.out.println(\"saldo=\" + c.getSaldo() + \" rechazadas=\" + rechazadas);\n    }\n}\n\nclass Cuenta {\n    private long saldo;\n\n    long getSaldo() { return saldo; }\n\n    boolean ingresar(long importe) {\n        if (importe <= 0) return false;\n        saldo += importe;\n        return true;\n    }\n\n    boolean retirar(long importe) {\n        if (importe <= 0 || importe > saldo) return false;\n        saldo -= importe;\n        return true;\n    }\n}",
  why:"Guardar dinero en céntimos (long) evita los errores de redondeo de double. La otra opción seria es BigDecimal."}
]},

{
id:"jv5l4",
titulo:"static, toString y enums",
claves:["static pertenece a la clase, compartido por todos los objetos","Sobrescribe toString para imprimir objetos de forma legible","enum define un conjunto fijo de constantes con sus propios atributos y métodos"],
pasos:[
 {t:"info", eti:"De la clase", h:"static",
  c:`<div class="termbox">public class Pedido {
    private static int creados = 0;       <span class="cm">// uno para toda la clase</span>
    private final int numero;

    public Pedido() { creados++; numero = creados; }
    public static int totalCreados() { return creados; }
}
Pedido.totalCreados();     <span class="cm">// se llama con la clase, sin objeto</span></div>
     <p>Los métodos <code>static</code> no pueden usar atributos de instancia (no hay <code>this</code>). Son típicos en utilidades: <code>Math.max</code>, <code>List.of</code>, <code>Integer.parseInt</code>.</p>`},
 {t:"info", eti:"Constantes con tipo", h:"enum",
  c:`<div class="termbox">public enum EstadoPedido {
    PENDIENTE("Pendiente de pago"),
    PAGADO("Pagado"),
    ENVIADO("En camino"),
    ENTREGADO("Entregado");

    private final String etiqueta;
    EstadoPedido(String etiqueta) { this.etiqueta = etiqueta; }
    public String etiqueta() { return etiqueta; }
}

EstadoPedido e = EstadoPedido.PAGADO;
e.name();          <span class="cm">// "PAGADO"</span>
e.ordinal();       <span class="cm">// 1</span>
EstadoPedido.valueOf("ENVIADO");</div>
     <p>Mucho mejor que usar Strings sueltos como <code>"pagado"</code>: el compilador detecta erratas y valores imposibles.</p>`},
 {t:"par", p:"Empareja cada elemento con su uso",
  pares:[["static","Algo compartido por la clase, no por cada objeto"],["enum","Conjunto cerrado de valores posibles"],["toString()","Representación en texto del objeto"],["final (en un atributo)","Se asigna una vez y no cambia"]],
  why:"En JPA, un enum se guarda con @Enumerated(EnumType.STRING) para que reordenar valores no corrompa los datos."},
 {t:"opcion", p:"Imprimes un objeto <code>Producto</code> y sale <code>Producto@6d06d69c</code>. ¿Qué falta?",
  ops:["Un constructor","Sobrescribir toString() en la clase","Hacerlo static","Un getter"],
  ok:1, why:"El toString heredado de Object muestra el nombre de la clase y un hash."},
 {t:"vf", p:"Desde un método static se puede acceder directamente a un atributo de instancia con <code>this</code>.",
  ok:false, why:"Un método static no está asociado a ningún objeto, así que no existe this."},
 {t:"info", eti:"Enums con comportamiento", h:"Métodos, switch y EnumMap",
  c:`<div class="termbox">enum Operacion {
    SUMA { int aplicar(int a, int b) { return a + b; } },
    RESTA { int aplicar(int a, int b) { return a - b; } };
    abstract int aplicar(int a, int b);     <span class="cm">// cada constante lo implementa</span>
}

for (EstadoPedido e : EstadoPedido.values()) { ... }   <span class="cm">// recorrer todos</span>
Map&lt;EstadoPedido, Integer&gt; cuenta = new EnumMap&lt;&gt;(EstadoPedido.class);  <span class="cm">// mapa muy eficiente</span></div>
     <p>Un enum es una clase de verdad: puede tener atributos, constructores (privados), métodos e incluso implementar interfaces. Además, cada constante existe una sola vez, así que se comparan con <code>==</code> sin problema.</p>`},
 {t:"codigo", p:"Máquina de estados de un pedido con un enum",
  lenguaje:"java",
  c:`<p>Completa <code>puedePasarA</code> en el enum <code>Estado</code>: un pedido va de <code>PENDIENTE</code> a <code>PAGADO</code> o <code>CANCELADO</code>; de <code>PAGADO</code> a <code>ENVIADO</code> o <code>CANCELADO</code>; de <code>ENVIADO</code> a <code>ENTREGADO</code>. Desde <code>ENTREGADO</code> y <code>CANCELADO</code> no se sale. El <code>main</code> aplica los cambios de la entrada y avisa de los imposibles.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Estado actual = Estado.PENDIENTE;\n        while (sc.hasNext()) {\n            Estado nuevo = Estado.valueOf(sc.next());\n            if (actual.puedePasarA(nuevo)) {\n                actual = nuevo;\n                System.out.println(\"ok \" + actual);\n            } else {\n                System.out.println(\"no \" + actual + \"->\" + nuevo);\n            }\n        }\n    }\n}\n\nenum Estado {\n    PENDIENTE, PAGADO, ENVIADO, ENTREGADO, CANCELADO;\n\n    boolean puedePasarA(Estado otro) {\n        return true; // usa un switch sobre this\n    }\n}\n",
  pruebas:[{entrada:"PAGADO ENVIADO ENTREGADO", salida:"ok PAGADO\nok ENVIADO\nok ENTREGADO"}, {entrada:"ENVIADO CANCELADO PAGADO", salida:"no PENDIENTE->ENVIADO\nok CANCELADO\nno CANCELADO->PAGADO"}, {entrada:"PAGADO ENVIADO CANCELADO ENTREGADO", salida:"ok PAGADO\nok ENVIADO\nno ENVIADO->CANCELADO\nok ENTREGADO", oculta:true}],
  pista:"return switch (this) { case PENDIENTE -> otro == PAGADO || otro == CANCELADO; case PAGADO -> ...; case ENVIADO -> otro == ENTREGADO; case ENTREGADO, CANCELADO -> false; };",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Estado actual = Estado.PENDIENTE;\n        while (sc.hasNext()) {\n            Estado nuevo = Estado.valueOf(sc.next());\n            if (actual.puedePasarA(nuevo)) {\n                actual = nuevo;\n                System.out.println(\"ok \" + actual);\n            } else {\n                System.out.println(\"no \" + actual + \"->\" + nuevo);\n            }\n        }\n    }\n}\n\nenum Estado {\n    PENDIENTE, PAGADO, ENVIADO, ENTREGADO, CANCELADO;\n\n    boolean puedePasarA(Estado otro) {\n        return switch (this) {\n            case PENDIENTE -> otro == PAGADO || otro == CANCELADO;\n            case PAGADO -> otro == ENVIADO || otro == CANCELADO;\n            case ENVIADO -> otro == ENTREGADO;\n            case ENTREGADO, CANCELADO -> false;\n        };\n    }\n}",
  why:"El switch sobre el enum es exhaustivo: si mañana añades DEVUELTO, el compilador te obliga a decidir sus transiciones. Las reglas viven junto al tipo, no repartidas por los servicios."},
 {t:"codigo", p:"Contador de instancias con static y un toString legible",
  lenguaje:"java",
  c:`<p>Cada <code>Ticket</code> nuevo debe recibir un número correlativo (1, 2, 3...) usando un contador <code>static</code>. Sobrescribe <code>toString()</code> para que devuelva <code>Ticket#N[asunto]</code>. El <code>main</code> crea un ticket por línea y al final imprime cuántos hay.</p>`,
  plantilla:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            System.out.println(new Ticket(sc.nextLine()));\n        }\n        System.out.println(\"total=\" + Ticket.creados());\n    }\n}\n\nclass Ticket {\n    private final int numero;\n    private final String asunto;\n\n    Ticket(String asunto) {\n        this.numero = 0; // usa un contador static\n        this.asunto = asunto;\n    }\n\n    static int creados() { return 0; }\n}\n",
  pruebas:[{entrada:"no arranca\nfactura duplicada", salida:"Ticket#1[no arranca]\nTicket#2[factura duplicada]\ntotal=2"}, {entrada:"uno", salida:"Ticket#1[uno]\ntotal=1", oculta:true}],
  pista:"private static int contador = 0; en el constructor: this.numero = ++contador;. @Override public String toString() { return \"Ticket#\" + numero + \"[\" + asunto + \"]\"; }",
  solucion:"import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextLine()) {\n            System.out.println(new Ticket(sc.nextLine()));\n        }\n        System.out.println(\"total=\" + Ticket.creados());\n    }\n}\n\nclass Ticket {\n    private static int contador = 0;\n    private final int numero;\n    private final String asunto;\n\n    Ticket(String asunto) {\n        this.numero = ++contador;\n        this.asunto = asunto;\n    }\n\n    static int creados() { return contador; }\n\n    @Override\n    public String toString() { return \"Ticket#\" + numero + \"[\" + asunto + \"]\"; }\n}",
  why:"println llama a toString() por ti. Ojo: un contador static con ++ no es seguro con varios hilos; ahí se usa AtomicInteger (lo verás en concurrencia)."}
]}

]});
