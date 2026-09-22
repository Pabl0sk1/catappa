window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Datos: slices, maps, structs y punteros",
resumen: "Control de flujo, slices y maps, structs y métodos, y cuándo usar punteros",
nivel: "Fundamentos",
color: "#4fc3dc",
lecciones: [

{
id:"go2l1",
titulo:"Control de flujo, slices y maps",
claves:["Un único bucle: for (clásico, tipo while o con range)","Slices: vistas dinámicas sobre arrays; append puede crear un array nuevo","Maps: clave-valor; la segunda variable indica si la clave existe"],
pasos:[
 {t:"info", eti:"Colecciones", h:"for, slices y maps",
  c:`<div class="termbox">nums := []int{3, 1, 4}
nums = append(nums, 1, 5)
for i, n := range nums {
    fmt.Println(i, n)
}
primeros := nums[:2]                 // [3 1] (comparte memoria con nums)

stock := map[string]int{"teclado": 25}
stock["raton"] = 60
if n, ok := stock["monitor"]; !ok {
    fmt.Println("no hay monitores", n)
}
delete(stock, "raton")

for intentos &lt; 3 { ... }              // como un while
switch estado {
case "pagado", "enviado":
    ...
default:
    ...
}</div>`},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["len(s)","Número de elementos del slice"],["append(s, x)","Slice con x añadido (quizá en un array nuevo)"],["v, ok := m[k]","ok es false si la clave no existe"],["for i, v := range s","Índice y valor de cada elemento"],["s[1:3]","Sub-slice de los elementos 1 y 2"]],
  why:"Leer una clave inexistente de un map devuelve el valor cero: usa ok para distinguirlo."},
 {t:"opcion", p:"¿Por qué siempre se escribe <code>s = append(s, x)</code> y no solo <code>append(s, x)</code>?",
  ops:["Por estilo","append puede reservar un array nuevo y devuelve el slice actualizado; si no lo asignas, pierdes el resultado","Porque append no funciona","Por concurrencia"],
  ok:1, why:"El compilador incluso avisa si ignoras el resultado."}
]},

{
id:"go2l2",
titulo:"Structs, métodos y punteros",
claves:["struct agrupa campos; se añaden métodos con un receptor","Receptor por puntero (*T) para modificar el valor o evitar copias","Composición con campos embebidos en lugar de herencia"],
pasos:[
 {t:"info", eti:"Modelar", h:"Structs y métodos",
  c:`<div class="termbox">type Cuenta struct {
    Titular string
    saldo   int64            // en centimos; minuscula: privado
}

func (c *Cuenta) Ingresar(importe int64) error {     // receptor puntero: modifica
    if importe &lt;= 0 {
        return fmt.Errorf("importe no válido: %d", importe)
    }
    c.saldo += importe
    return nil
}

func (c Cuenta) Saldo() int64 { return c.saldo }     // receptor valor: solo lee

c := &amp;Cuenta{Titular: "Ana"}
_ = c.Ingresar(1000)

type Auditado struct{ CreadoEn time.Time }
type Pedido struct {
    Auditado                  // embebido: Pedido tiene CreadoEn directamente
    ID    int
    Total int64
}</div>`},
 {t:"par", p:"Empareja cada elemento con su significado",
  pares:[["&x","Dirección de x (puntero)"],["*p","Valor al que apunta p"],["func (c *Cuenta) M()","Método que puede modificar la cuenta"],["func (c Cuenta) M()","Método que recibe una copia"],["Campo embebido","Composición: los campos y métodos del tipo embebido se promueven"]],
  why:"Go no tiene clases ni herencia: structs, métodos, interfaces y composición."},
 {t:"opcion", p:"Un método con receptor por valor modifica un campo y el cambio no se ve fuera. ¿Por qué?",
  ops:["Un bug de Go","El receptor por valor es una copia: para modificar el original hace falta un receptor puntero","Faltan mayúsculas","Por el recolector de basura"],
  ok:1, why:"Regla habitual: si algún método necesita puntero, usa puntero en todos los del tipo."}
]},

{
id:"go2l3",
titulo:"Slices por dentro",
claves:["Un slice es una vista: puntero al array, longitud y capacidad","append puede reutilizar el array o crear uno nuevo si falta capacidad","Dos slices pueden compartir memoria: cuidado al modificar"],
pasos:[
 {t:"info", eti:"La trampa clásica", h:"Longitud, capacidad y memoria compartida",
  c:`<div class="termbox">a := []int{1, 2, 3, 4}
b := a[:2]            // len 2, cap 4: comparte el array con a
b[0] = 99
fmt.Println(a)        // [99 2 3 4]
b = append(b, 7)      // hay capacidad: escribe en a[2]
fmt.Println(a)        // [99 2 7 4]

c := make([]int, 0, 100)   // reservar capacidad si sabes el tamano
d := slices.Clone(a)       // copia independiente</div>`},
 {t:"opcion", p:"<code>s := make([]int, 3)</code> y luego <code>s = append(s, 5)</code>. ¿Qué contiene <code>s</code>?",
  ops:["[5]","[0 0 0 5]","[5 0 0]","Error"],
  ok:1, why:"make([]int, 3) ya tiene 3 ceros; append añade detrás. Para empezar vacío: make([]int, 0, 3)."},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["len(make([]int, 0, 10))","0"],["cap(make([]int, 0, 10))","10"],["len([]int{1,2,3}[1:])","2"],["var s []int; s == nil","true"]],
  why:"Un slice nil funciona con len, range y append sin problemas."}
]}

]});
