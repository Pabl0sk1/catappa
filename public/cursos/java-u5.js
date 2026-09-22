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

    boolean disponible() {  <span class="cm">// metodo (comportamiento)</span>
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
  ok:true, why:"Cada objeto tiene sus propios valores de atributos."}
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
        this.nombre = nombre;       <span class="cm">// this.nombre = atributo; nombre = parametro</span>
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
  ok:false, why:"Los constructores no tienen tipo de retorno. Si pones void, se convierte en un método normal con el nombre de la clase."}
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
  ok:false, why:"Solo expón lo necesario. Muchos atributos no necesitan setter (mejor inmutables) y otros se modifican con operaciones de negocio."}
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
  ok:false, why:"Un método static no está asociado a ningún objeto, así que no existe this."}
]}

]});
