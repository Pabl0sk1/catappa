window.CURSOS = window.CURSOS || {};
(CURSOS.java = CURSOS.java || []).push({
titulo: "Control de flujo",
resumen: "if y else, switch moderno, bucles while, do-while, for y for-each, break y continue",
nivel: "Fundamentos",
color: "#e0664a",
lecciones: [

{
id:"jv3l1",
titulo:"if, else y el operador ternario",
claves:["if ejecuta un bloque solo si la condición es verdadera","else if encadena alternativas; else es el caso por defecto","condicion ? a : b elige un valor en una expresión"],
pasos:[
 {t:"info", eti:"Decidir", h:"if y else",
  c:`<div class="termbox">double total = 120.0;
double envio;
if (total &gt;= 100) {
    envio = 0;
} else if (total &gt;= 50) {
    envio = 2.99;
} else {
    envio = 4.99;
}</div>
     <p>Las condiciones se evalúan en orden y solo se ejecuta el <b>primer</b> bloque cuya condición sea verdadera. Pon siempre las llaves, aunque el bloque tenga una sola línea.</p>`},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">int nota = 7;
if (nota &gt;= 5) System.out.println("Aprobado");
else if (nota &gt;= 7) System.out.println("Notable");
else System.out.println("Suspenso");</div>`,
  ops:["Aprobado","Notable","Aprobado y Notable","Suspenso"],
  ok:0, why:"La primera condición ya es cierta y el resto no se evalúa. Las condiciones más específicas deben ir primero."},
 {t:"info", eti:"En una línea", h:"El operador ternario",
  c:`<div class="termbox">String estado = stock &gt; 0 ? "disponible" : "agotado";</div>
     <p>Útil para elegir entre dos valores. Si la lógica crece, vuelve a un if normal por legibilidad.</p>`},
 {t:"hueco", p:"Completa el ternario para que <code>tipo</code> valga «adulto» si la edad es 18 o más, y «menor» si no",
  tpl:"String tipo = edad >= 18 ___ \"adulto\" ___ \"menor\";", banco:["?",":","&&","||"], sol:["?",":"],
  why:"condición ? valorSiCierto : valorSiFalso."},
 {t:"vf", p:"En Java se puede escribir <code>if (cantidad)</code> con un int, como en C, y se considera cierto si no es 0.",
  ok:false, why:"La condición debe ser boolean: if (cantidad > 0). Esto evita muchos errores."}
]},

{
id:"jv3l2",
titulo:"switch moderno",
claves:["switch con flechas (->) no necesita break y no «cae» al siguiente caso","switch como expresión devuelve un valor; yield en bloques","Funciona con int, String, enum y, con pattern matching, con tipos"],
pasos:[
 {t:"info", eti:"Muchas alternativas", h:"switch con flechas",
  c:`<div class="termbox">String dia = "sabado";
switch (dia) {
    case "sabado", "domingo" -&gt; System.out.println("Fin de semana");
    case "viernes"           -&gt; System.out.println("Casi");
    default                  -&gt; System.out.println("Laborable");
}

<span class="cm">// como expresion: devuelve un valor</span>
double iva = switch (categoria) {
    case ALIMENTACION -&gt; 0.04;
    case LIBROS       -&gt; 0.04;
    case HOSTELERIA   -&gt; 0.10;
    default           -&gt; 0.21;
};</div>`},
 {t:"info", eti:"Lo antiguo", h:"El switch clásico y su trampa",
  c:`<div class="termbox">switch (nivel) {
    case 1:
        System.out.println("Uno");
        <span class="cm">// falta break: sigue ejecutando el caso 2 ("fall-through")</span>
    case 2:
        System.out.println("Dos");
        break;
}</div>
     <p>Con <code>nivel = 1</code> imprime «Uno» y «Dos». Lo verás en código antiguo; en código nuevo, usa flechas.</p>`},
 {t:"opcion", p:"¿Qué ventaja tiene <code>switch</code> con <code>-&gt;</code> sobre el clásico con <code>case X:</code>?",
  ops:["Es más lento pero más seguro","No hay caída accidental entre casos, puede devolver un valor y, con enums, el compilador avisa si faltan casos","Solo acepta números","Ninguna"],
  ok:1, why:"Menos errores y código más corto. Disponible desde Java 14."},
 {t:"par", p:"Empareja cada elemento del switch con su función",
  pares:[["case A, B ->","Varios valores con la misma acción"],["default ->","Cualquier otro valor"],["yield","Devolver un valor desde un bloque dentro de un switch expresión"],["break","Salir de un switch clásico para no caer al siguiente caso"]],
  why:"yield se usa cuando un caso necesita varias líneas: case X -> { ...; yield valor; }."},
 {t:"vf", p:"Un switch expresión sobre un enum que cubre todos sus valores no necesita default.",
  ok:true, why:"El compilador comprueba que es exhaustivo; si añades un valor al enum, te avisará."}
]},

{
id:"jv3l3",
titulo:"Bucles while y do-while",
claves:["while repite mientras la condición sea cierta; puede no ejecutarse nunca","do-while ejecuta al menos una vez","Cuidado con los bucles infinitos: algo debe cambiar la condición"],
pasos:[
 {t:"info", eti:"Repetir", h:"while",
  c:`<div class="termbox">int intentos = 0;
boolean conectado = false;
while (!conectado &amp;&amp; intentos &lt; 3) {
    conectado = intentarConectar();
    intentos++;
}</div>
     <p>Se comprueba la condición <b>antes</b> de cada vuelta. Si al principio es falsa, el cuerpo no se ejecuta nunca.</p>`},
 {t:"info", eti:"Al menos una vez", h:"do-while",
  c:`<div class="termbox">String opcion;
do {
    opcion = leerOpcionDelMenu();
    procesar(opcion);
} while (!opcion.equals("salir"));</div>`},
 {t:"opcion", p:"¿Cuántas veces se imprime «hola»?", c:`<div class="termbox">int i = 10;
while (i &lt; 5) {
    System.out.println("hola");
    i++;
}</div>`,
  ops:["0","1","5","Infinitas"],
  ok:0, why:"La condición es falsa desde el principio. Con do-while se imprimiría una vez."},
 {t:"opcion", p:"¿Qué le pasa a este bucle?", c:`<div class="termbox">int i = 0;
while (i &lt; 10) {
    System.out.println(i);
}</div>`,
  ops:["Imprime del 0 al 9","Nunca termina: i no cambia nunca","No compila","Imprime 10"],
  ok:1, why:"Falta i++. Bucle infinito: la aplicación se queda colgada consumiendo CPU."},
 {t:"vf", p:"Un <code>do-while</code> se ejecuta siempre al menos una vez.",
  ok:true, why:"La condición se comprueba al final de cada vuelta."}
]},

{
id:"jv3l4",
titulo:"Bucles for, for-each, break y continue",
claves:["for (inicio; condición; paso) cuando conoces el número de vueltas","for-each (for (T x : coleccion)) para recorrer colecciones y arrays","break sale del bucle; continue salta a la siguiente vuelta"],
pasos:[
 {t:"info", eti:"Contar", h:"for clásico",
  c:`<div class="termbox">for (int i = 0; i &lt; 5; i++) {
    System.out.println("Vuelta " + i);     <span class="cm">// 0, 1, 2, 3, 4</span>
}
for (int i = 10; i &gt; 0; i -= 2) { ... }     <span class="cm">// 10, 8, 6, 4, 2</span></div>
     <p>Tres partes: <b>inicio</b> (se ejecuta una vez), <b>condición</b> (antes de cada vuelta) y <b>paso</b> (al final de cada vuelta).</p>`},
 {t:"info", eti:"Recorrer", h:"for-each",
  c:`<div class="termbox">List&lt;String&gt; nombres = List.of("Ana", "Luis", "Marta");
for (String nombre : nombres) {
    System.out.println(nombre);
}</div>
     <p>Se lee «para cada nombre en nombres». Es la forma preferida cuando no necesitas el índice.</p>`},
 {t:"orden", p:"Ordena en qué momento se ejecuta cada parte de <code>for (int i = 0; i &lt; 3; i++)</code> en la primera vuelta",
  items:["int i = 0 (inicio, una sola vez)","i < 3 (se comprueba la condición)","Se ejecuta el cuerpo del bucle","i++ (el paso)","Se vuelve a comprobar i < 3"],
  why:"Entender este orden evita errores de «uno de más o de menos» (off-by-one)."},
 {t:"info", eti:"Controlar", h:"break y continue",
  c:`<div class="termbox">for (Pedido p : pedidos) {
    if (p.cancelado()) continue;      <span class="cm">// salta este y sigue con el siguiente</span>
    if (p.total() &gt; 10_000) {
        alertar(p);
        break;                        <span class="cm">// sale del bucle por completo</span>
    }
    procesar(p);
}</div>`},
 {t:"opcion", p:"¿Qué imprime este código?", c:`<div class="termbox">for (int i = 1; i &lt;= 5; i++) {
    if (i == 3) continue;
    if (i == 5) break;
    System.out.print(i + " ");
}</div>`,
  ops:["1 2 3 4 5","1 2 4","1 2","1 2 4 5"],
  ok:1, why:"El 3 se salta con continue y al llegar al 5 el break termina antes de imprimirlo."},
 {t:"vf", p:"Dentro de un for-each sobre una <code>ArrayList</code> se pueden eliminar elementos de esa misma lista sin problema.",
  ok:false, why:"Lanza ConcurrentModificationException. Se usa un Iterator con remove(), o lista.removeIf(...)."}
]}

]});
