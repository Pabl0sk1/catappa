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
        super(nombre, base);           <span class="cm">// constructor del padre, primera linea</span>
        this.bonus = bonus;
    }

    @Override
    public double salario() {
        return super.salario() + bonus;   <span class="cm">// reutiliza la logica del padre</span>
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
  ok:false, why:"Herencia simple de clases. Sí puede implementar varias interfaces."}
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
    public String describir() {             <span class="cm">// comun a todas</span>
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
  ok:true, why:"Los métodos default ya tienen implementación y no es obligatorio sobrescribirlos."}
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
    total += f.area();      <span class="cm">// cada una usa SU version de area()</span>
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
  ok:false, why:"El compilador solo conoce los métodos del tipo declarado (Figura). Hace falta comprobar y convertir: if (f instanceof Circulo c) c.radio()."}
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
  ok:true, why:"Es el contrato de Object. Lo contrario no es obligatorio: dos objetos distintos pueden coincidir en hash."}
]}

]});
