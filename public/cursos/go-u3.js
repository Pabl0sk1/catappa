window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Colecciones y texto",
resumen: "Arrays y slices, cómo son los slices por dentro, mapas y el paquete maps, strings, bytes y runes con UTF-8",
nivel: "Fundamentos",
color: "#4bbdd7",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"go2l1",
titulo:"Arrays y slices",
claves:["Un array tiene tamaño fijo, que forma parte de su tipo, y se copia entero al asignarlo","Un slice es una vista dinámica sobre un array: se crea con literal, make o recortando","append añade y puede crear un array nuevo; el paquete slices trae ordenar, buscar y comparar"],
pasos:[
 {t:"info", eti:"Colecciones", h:"Arrays frente a slices",
  c:`<div class="termbox">var arr [3]int                 // array: [0 0 0], el 3 es parte del tipo
arr2 := arr                     // COPIA los 3 elementos
fmt.Println(arr == arr2)        // los arrays se pueden comparar con ==

nums := []int{3, 1, 4}          // slice: sin tamaño en el tipo
nums = append(nums, 1, 5)       // [3 1 4 1 5]
primeros := nums[:2]            // [3 1] (comparte memoria con nums)
vacio := make([]string, 0, 10)  // len 0, capacidad reservada 10

for i, n := range nums {
    fmt.Println(i, n)
}</div>
     <p>En el día a día casi todo son <b>slices</b>. Los arrays aparecen cuando el tamaño es parte del dato: un hash <code>[32]byte</code>, una IP <code>[4]byte</code>, una clave de un map que debe ser comparable.</p>`},
 {t:"info", eti:"El paquete slices", h:"Lo que antes se escribía a mano",
  c:`<div class="termbox">import "slices"

frutas := []string{"pera", "kiwi", "uva"}
slices.Sort(frutas)                     // [kiwi pera uva]
slices.Contains(frutas, "uva")          // true
slices.Index(frutas, "pera")            // 1
i, ok := slices.BinarySearch(frutas, "uva")
slices.Max([]int{3, 9, 2})              // 9
slices.Equal(a, b)                      // los slices NO se comparan con ==
slices.SortFunc(pedidos, func(a, b Pedido) int {
    return cmp.Compare(a.Total, b.Total)
})
copia := slices.Clone(frutas)
frutas = slices.DeleteFunc(frutas, func(f string) bool { return f == "kiwi" })</div>
     <p>Desde Go 1.21 <code>slices</code> y <code>maps</code> son parte de la librería estándar y son genéricos: funcionan con cualquier tipo de elemento.</p>`},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["len(s)","Número de elementos del slice"],["append(s, x)","Slice con x añadido (quizá en un array nuevo)"],["for i, v := range s","Índice y valor de cada elemento"],["s[1:3]","Sub-slice de los elementos 1 y 2"],["slices.Contains(s, x)","true si x está en el slice"]],
  why:"Los índices de un sub-slice son medio abiertos: s[1:3] incluye el 1 y excluye el 3."},
 {t:"opcion", p:"¿Por qué siempre se escribe <code>s = append(s, x)</code> y no solo <code>append(s, x)</code>?",
  ops:["Por estilo","append puede reservar un array nuevo y devuelve el slice actualizado; si no lo asignas, pierdes el resultado","Porque append no funciona","Por concurrencia"],
  ok:1, why:"El compilador da error si ignoras el resultado de append: «append(s, x) (value of type []int) is not used»."},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">a := [3]int{1, 2, 3}
b := a
b[0] = 9
fmt.Println(a, b)</div>`,
  ops:["[9 2 3] [9 2 3]","[1 2 3] [9 2 3]","[1 2 3] [1 2 3]","No compila"],
  ok:1, why:"Asignar un array copia todos sus elementos. Con un slice (<code>a := []int{1,2,3}</code>) los dos verían el 9."},
 {t:"vf", p:"Dos slices se pueden comparar con <code>==</code>.",
  ok:false, why:"Un slice solo se puede comparar con nil. Para comparar contenidos: <code>slices.Equal(a, b)</code>."},
 {t:"hueco", p:"Crea un slice vacío con capacidad para todos los usuarios y rellénalo con sus emails",
  tpl:"emails := ___([]string, 0, len(usuarios))\nfor _, u := range usuarios {\n    emails = ___(emails, u.Email)\n}\nslices.___(emails)",
  banco:["make","append","Sort","new","copy","Order"], sol:["make","append","Sort"],
  why:"Reservar la capacidad de antemano evita que append tenga que copiar el array varias veces al crecer."},
 {t:"escribe", p:"¿Qué función del paquete <code>slices</code> dice si dos slices tienen los mismos elementos en el mismo orden?",
  sol:["slices.Equal","Equal","slices.Equal(a, b)"],
  pista:"Igual, en inglés.",
  why:"Para tipos sin == (structs con slices dentro, por ejemplo) está <code>slices.EqualFunc</code>."}
]},

/* =============== U3 L2 =============== */
{
id:"go2l3",
titulo:"Slices por dentro",
claves:["Un slice es una cabecera de tres campos: puntero al array, longitud y capacidad","append reutiliza el array si hay capacidad, o reserva uno más grande y copia","Dos slices pueden compartir memoria: s[a:b:c] limita la capacidad y slices.Clone copia"],
pasos:[
 {t:"info", eti:"La cabecera", h:"Puntero, longitud y capacidad",
  c:`<div class="dg"><div class="dg-tit">dos slices sobre el mismo array</div>
<svg viewBox="0 0 340 170" width="100%" style="max-width:440px;display:block;margin:auto" role="img" aria-label="Los slices a y b apuntan al mismo array de cuatro elementos; a tiene longitud 4 y b longitud 2, ambos capacidad 4">
<defs><marker id="fl-go3-1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--accent)"/></marker></defs>
<rect x="10" y="10" width="130" height="50" rx="6" fill="var(--bg-2)" stroke="var(--line-2)"/>
<text x="20" y="30" font-size="12" font-family="var(--mono)" fill="var(--ink)">a  ptr ●</text>
<text x="20" y="48" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">len 4 · cap 4</text>
<rect x="200" y="10" width="130" height="50" rx="6" fill="var(--accent-soft)" stroke="var(--accent)"/>
<text x="210" y="30" font-size="12" font-family="var(--mono)" fill="var(--ink)">b := a[:2]</text>
<text x="210" y="48" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">len 2 · cap 4</text>
<line x1="75" y1="60" x2="75" y2="108" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-go3-1)"/>
<line x1="265" y1="60" x2="85" y2="108" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-go3-1)"/>
<rect x="60" y="112" width="55" height="36" fill="var(--ok-soft)" stroke="var(--ok)"/>
<rect x="115" y="112" width="55" height="36" fill="var(--ok-soft)" stroke="var(--ok)"/>
<rect x="170" y="112" width="55" height="36" fill="var(--bg-3)" stroke="var(--line-2)"/>
<rect x="225" y="112" width="55" height="36" fill="var(--bg-3)" stroke="var(--line-2)"/>
<text x="87" y="135" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">1</text>
<text x="142" y="135" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">2</text>
<text x="197" y="135" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">3</text>
<text x="252" y="135" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">4</text>
<text x="170" y="166" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">array compartido (verde: lo que ve b)</text>
</svg></div>
<div class="termbox">a := []int{1, 2, 3, 4}
b := a[:2]            // len 2, cap 4: comparte el array con a
b[0] = 99
fmt.Println(a)        // [99 2 3 4]
b = append(b, 7)      // hay capacidad: escribe en a[2]
fmt.Println(a)        // [99 2 7 4]

c := make([]int, 0, 100)   // reservar capacidad si sabes el tamaño
d := slices.Clone(a)       // copia independiente</div>`},
 {t:"info", eti:"Crecer", h:"Cuando append se queda sin sitio",
  c:`<div class="dg"><div class="dg-tit">qué hace append(s, x)</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">len &lt; cap</div><div class="dg-vert"><div class="dg-caja">escribe x en s[len]</div><div class="dg-caja ok">mismo array<small>otros slices lo ven</small></div></div></div>
<div class="dg-col"><div class="dg-col-tit">len == cap</div><div class="dg-vert"><div class="dg-caja">reserva un array mayor</div><div class="dg-caja">copia los elementos</div><div class="dg-caja aviso">array nuevo<small>ya no comparte con nadie</small></div></div></div>
</div></div>
     <p>La capacidad crece más o menos al doble mientras el slice es pequeño y, a partir de unos 256 elementos, en torno a 1,25 veces. Por eso append es rápido <i>de media</i>, pero cada crecimiento copia todo.</p>
     <p>La <b>expresión de tres índices</b> <code>a[bajo:alto:max]</code> limita la capacidad del sub-slice: <code>c := a[:2:2]</code> tiene cap 2, así que su primer append ya reserva un array nuevo y no pisa <code>a</code>.</p>
     <div class="nota ojo"><b class="tit">Memoria retenida</b>Si guardas <code>cabecera := datos[:16]</code> de un fichero de 1 GB, el GB entero sigue vivo mientras exista <code>cabecera</code>. Copia lo que necesites con <code>slices.Clone</code>.</div>`},
 {t:"opcion", p:"<code>s := make([]int, 3)</code> y luego <code>s = append(s, 5)</code>. ¿Qué contiene <code>s</code>?",
  ops:["[5]","[0 0 0 5]","[5 0 0]","Error"],
  ok:1, why:"make([]int, 3) ya tiene 3 ceros; append añade detrás. Para empezar vacío: make([]int, 0, 3)."},
 {t:"par", p:"Empareja cada expresión con su resultado",
  pares:[["len(make([]int, 0, 10))","0"],["cap(make([]int, 0, 10))","10"],["len([]int{1,2,3}[1:])","2"],["var s []int; s == nil","true"],["cap([]int{1,2,3,4}[:2:2])","2 (limitada)"]],
  why:"Un slice nil funciona con len, range y append sin problemas."},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">a := []int{1, 2, 3, 4}
c := a[:2:2]
c = append(c, 8)
fmt.Println(a, c)</div>`,
  ops:["[1 2 8 4] [1 2 8]","[1 2 3 4] [1 2 8]","[1 2 3 4 8] [1 2 8]","[1 2 3 4] [8]"],
  ok:1, why:"c tiene capacidad 2: append reserva un array nuevo y a queda intacto. Con <code>a[:2]</code> (cap 4) se habría pisado a[2]."},
 {t:"escribe", p:"¿Qué función integrada copia elementos de un slice a otro y devuelve cuántos copió?",
  sol:["copy","copy(dst, src)"],
  pista:"Se llama exactamente como lo que hace.",
  why:"<code>n := copy(dst, src)</code> copia min(len(dst), len(src)) elementos. dst debe tener longitud, no solo capacidad."},
 {t:"vf", p:"Una función que recibe un slice y hace <code>s[0] = 1</code> modifica el slice de quien la llamó.",
  ok:true, why:"La cabecera se copia, pero apunta al mismo array. En cambio, un append dentro de la función no cambia la longitud del slice de fuera: por eso se devuelve el slice."},
 {t:"opcion", p:"Una función hace <code>func añadir(s []int) { s = append(s, 1) }</code>. Tras <code>añadir(xs)</code>, ¿cambia <code>len(xs)</code>?",
  ops:["Sí, siempre","No: la función modificó su copia de la cabecera; hay que devolver el slice (return append(s, 1))","Solo si hay capacidad","Solo si xs es nil"],
  ok:1, why:"Aunque el valor se escriba en el array compartido (si había capacidad), la longitud del xs de fuera sigue igual."}
]},

/* =============== U3 L3 =============== */
{
id:"go3n1",
titulo:"Mapas",
claves:["map[K]V es una tabla hash: la clave debe ser comparable","Leer una clave inexistente da el valor cero; v, ok := m[k] distingue si existe","Un map nil se lee pero no se escribe; el orden de iteración es aleatorio y no es seguro para goroutines"],
pasos:[
 {t:"info", eti:"Clave-valor", h:"Crear, leer, borrar",
  c:`<div class="termbox">stock := map[string]int{"teclado": 25}
stock["raton"] = 60
n := stock["monitor"]            // 0: no existe, valor cero
if n, ok := stock["monitor"]; !ok {
    fmt.Println("no hay monitores", n)
}
delete(stock, "raton")           // borrar (no falla si no existe)
len(stock)                       // 1
clear(stock)                     // vaciar (Go 1.21+)

visto := map[string]bool{}       // un «conjunto»
visto["ana"] = true
if visto["pepe"] { … }           // false si no está

porCiudad := make(map[string][]Usuario, 100)   // capacidad inicial orientativa
porCiudad[u.Ciudad] = append(porCiudad[u.Ciudad], u)   // funciona aunque no exista</div>
     <p>La clave debe ser un tipo <b>comparable</b>: números, strings, booleanos, punteros, arrays y structs de campos comparables. Un slice no puede ser clave.</p>`},
 {t:"info", eti:"Las trampas", h:"nil, orden y concurrencia",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">comportamientos que hay que conocer</div><table class="dg-tabla"><thead><tr><th>situación</th><th>resultado</th></tr></thead><tbody>
<tr><td>leer de un map nil</td><td>valor cero, sin error</td></tr>
<tr><td>escribir en un map nil</td><td><code>panic: assignment to entry in nil map</code></td></tr>
<tr><td>recorrer con range</td><td>orden aleatorio a propósito, cada vez distinto</td></tr>
<tr><td>escribir desde dos goroutines</td><td><code>fatal error: concurrent map writes</code> (no se recupera)</td></tr>
<tr><td><code>m[k].Campo = 1</code> con valores struct</td><td>no compila: saca el valor, modifícalo y vuelve a guardarlo</td></tr>
</tbody></table></div>
<div class="termbox">claves := slices.Sorted(maps.Keys(m))   // orden estable (Go 1.23+)
for _, k := range claves {
    fmt.Println(k, m[k])
}</div>
     <p><code>fmt.Println(m)</code> sí imprime las claves ordenadas, pero <code>range</code> nunca: no escribas pruebas que dependan del orden de un map.</p>`},
 {t:"opcion", p:"¿Qué imprime?",
  c:`<div class="termbox">edades := map[string]int{"ana": 30}
e, ok := edades["luis"]
fmt.Println(e, ok)</div>`,
  ops:["nil false","0 false","0 true","panic"],
  ok:1, why:"Una clave que no existe devuelve el valor cero del tipo (0) y ok = false. Sin ok no sabrías si Luis tiene 0 años o no está."},
 {t:"opcion", p:"<code>var m map[string]int</code> y después <code>m[\"a\"] = 1</code>. ¿Qué ocurre?",
  ops:["Se crea el map automáticamente","panic: assignment to entry in nil map","Error de compilación","No hace nada"],
  ok:1, why:"var sin inicializar deja el map a nil. Hay que crearlo con make o con un literal: <code>m := map[string]int{}</code>."},
 {t:"hueco", p:"Cuenta cuántas veces aparece cada palabra",
  tpl:"cuenta := ___(map[string]int)\nfor _, p := range strings.Fields(texto) {\n    cuenta[p]___\n}",
  banco:["make","++","new","+= p","append"], sol:["make","++"],
  why:"cuenta[p]++ funciona aunque la clave no exista: parte del valor cero 0."},
 {t:"vf", p:"Recorrer dos veces el mismo map con range da siempre el mismo orden.",
  ok:false, why:"El runtime aleatoriza el orden a propósito para que nadie dependa de él. Si necesitas orden, ordena las claves."},
 {t:"codigo", p:"Contar palabras con salida estable",
  lenguaje:"js",
  c:`<p>Practica en JavaScript el patrón de Go <code>cuenta[p]++</code> + <code>slices.Sorted(maps.Keys(cuenta))</code>. Lee un texto de la entrada, separa por espacios (como <code>strings.Fields</code>) y, para cada palabra distinta <b>en orden alfabético</b>, imprime <code>palabra n</code> en una línea.</p><p>Con <code>go es go y es rapido</code> debe imprimir <code>es 2</code>, <code>go 2</code>, <code>rapido 1</code>, <code>y 1</code>.</p>`,
  plantilla:`const texto = require("fs").readFileSync(0, "utf8");
// cuenta con un Map y recorre las claves ordenadas
`,
  pruebas:[{entrada:"go es go y es rapido\n", salida:"es 2\ngo 2\nrapido 1\ny 1"},{entrada:"  uno   dos\nuno \n", salida:"dos 1\nuno 2"},{entrada:"b a c a b a\n", salida:"a 3\nb 2\nc 1", oculta:true}],
  pista:"texto.split(/\\s+/).filter(Boolean) equivale a strings.Fields; ordena las claves con sort().",
  solucion:`const texto = require("fs").readFileSync(0, "utf8");
const cuenta = new Map();
for (const p of texto.split(/\\s+/).filter(Boolean)) cuenta.set(p, (cuenta.get(p) || 0) + 1);
for (const k of [...cuenta.keys()].sort()) console.log(k + " " + cuenta.get(k));
`,
  why:"En Go, recorrer el map directamente daría un orden distinto en cada ejecución: para una salida estable (y pruebas que no fallen al azar) se ordenan las claves."},
 {t:"escribe", p:"¿Qué función integrada elimina una clave de un map?",
  sol:["delete","delete(m, k)","delete(m, clave)"],
  pista:"Borrar, en inglés.",
  why:"delete no falla si la clave no está, ni si el map es nil."},
 {t:"opcion", p:"Dos goroutines de tu servidor HTTP escriben en el mismo map de caché. ¿Qué pasa y cómo se arregla?",
  ops:["Nada, los maps son seguros","El programa puede morir con «concurrent map writes»; protégelo con un sync.Mutex (o usa sync.Map en casos concretos)","Se pierde algún dato sin más","Go lo serializa solo"],
  ok:1, why:"Los maps no están sincronizados por rendimiento. El runtime detecta muchos accesos concurrentes y aborta el proceso entero, sin posibilidad de recover."}
]},

/* =============== U3 L4 =============== */
{
id:"go3n2",
titulo:"Strings, bytes y runes",
claves:["Un string es una secuencia inmutable de bytes; len devuelve bytes, no caracteres","range sobre un string recorre runes (puntos de código UTF-8) con su posición en bytes","strings.Builder para construir texto en bucles; el paquete strings para buscar, cortar y transformar"],
pasos:[
 {t:"info", eti:"UTF-8", h:"Bytes y runes",
  c:`<div class="termbox">s := "año"
len(s)                        // 4: la ñ ocupa 2 bytes en UTF-8
utf8.RuneCountInString(s)     // 3 caracteres
s[1]                          // 195: un byte, no la ñ
[]rune(s)[1]                  // 'ñ'

for i, r := range "añb" {
    fmt.Print(i, ":", string(r), " ")   // 0:a 1:ñ 3:b  (el índice salta)
}

// s[0] = 'A'                 // no compila: los strings son inmutables
b := []byte(s)                // copia modificable
b[0] = 'A'
s2 := string(b)               // "Año"</div>
     <p>Un <code>byte</code> es un <code>uint8</code>; un <code>rune</code> es un <code>int32</code> con un punto de código Unicode. Los literales entre comillas simples (<code>'ñ'</code>) son runes. Las cadenas con acentos, emojis o chino rompen cualquier código que trate bytes como caracteres.</p>`},
 {t:"info", eti:"Herramientas", h:"strings y strings.Builder",
  c:`<div class="termbox">strings.Contains(s, "go")        strings.HasPrefix(s, "http")
strings.Split("a,b,,c", ",")     // [a b  c]: 4 elementos
strings.Fields("  a  b c ")      // [a b c]: separa por espacios
strings.TrimSpace(s)             strings.ToLower(s)
strings.EqualFold("Go", "GO")    // true: compara sin mayúsculas
strings.Join(partes, ", ")
antes, despues, ok := strings.Cut("clave=valor", "=")   // clave valor true

var sb strings.Builder
for i := range 3 {
    fmt.Fprintf(&amp;sb, "%d-", i)
}
sb.String()                       // "0-1-2-"

raw := \`C:\\ruta\\sin\\escapes
y en varias líneas\`              // literal crudo entre acentos graves</div>
     <p>Concatenar con <code>+=</code> en un bucle crea un string nuevo en cada vuelta: con miles de piezas, usa <code>strings.Builder</code> (o <code>strings.Join</code>). El paquete <code>bytes</code> tiene las mismas funciones para <code>[]byte</code>.</p>`},
 {t:"opcion", p:"¿Qué imprime <code>fmt.Println(len(\"café\"))</code>?",
  ops:["4","5","3","6"],
  ok:1, why:"La é ocupa 2 bytes en UTF-8: c, a, f (1 cada uno) + é (2) = 5 bytes. Para contar caracteres: utf8.RuneCountInString."},
 {t:"opcion", p:"¿Qué imprime este bucle?",
  c:`<div class="termbox">for i, r := range "añb" {
    fmt.Print(i, string(r), " ")
}</div>`,
  ops:["0a 1ñ 2b","0a 1ñ 3b","0a 1Ã 2± 3b","0a 2ñ 3b"],
  ok:1, why:"range decodifica UTF-8: i es la posición en bytes donde empieza cada rune. La ñ ocupa las posiciones 1 y 2."},
 {t:"par", p:"Empareja cada función con lo que hace",
  pares:[["strings.Fields","Separar por uno o más espacios"],["strings.Cut","Partir en dos por la primera aparición de un separador"],["strings.EqualFold","Comparar ignorando mayúsculas y minúsculas"],["strings.Builder","Construir un texto largo sin copias repetidas"],["utf8.RuneCountInString","Contar caracteres, no bytes"]],
  why:"strings.Cut (Go 1.18) sustituye a muchos Index + recortes manuales."},
 {t:"vf", p:"<code>s[0] = 'H'</code> cambia la primera letra de un string.",
  ok:false, why:"No compila: los strings son inmutables. Conviértelo a []byte o []rune, modifícalo y vuelve a string (eso hace una copia)."},
 {t:"hueco", p:"Construye una lista separada por comas de forma eficiente",
  tpl:"var sb strings.___\nfor i, n := range nombres {\n    if i > 0 {\n        sb.WriteString(\", \")\n    }\n    sb.WriteString(n)\n}\nreturn sb.___()",
  banco:["Builder","String","Buffer","Join","Text"], sol:["Builder","String"],
  why:"Para este caso concreto, <code>strings.Join(nombres, \", \")</code> lo hace en una línea; el Builder es para cuando la lógica es más compleja."},
 {t:"codigo", p:"Bytes frente a runes, en JavaScript",
  lenguaje:"js",
  c:`<p>La plataforma no ejecuta Go, así que practica la idea en JavaScript. Lee una línea de la entrada e imprime dos números separados por un espacio: lo que devolvería <code>len(s)</code> en Go (bytes en UTF-8) y lo que devolvería <code>utf8.RuneCountInString(s)</code> (puntos de código).</p><p>Con <code>año</code> debe imprimir <code>4 3</code>.</p>`,
  plantilla:`const s = require("fs").readFileSync(0, "utf8").replace(/\\r?\\n$/, "");
// imprime bytes y runes separados por un espacio
`,
  pruebas:[{entrada:"año\n", salida:"4 3"},{entrada:"hola\n", salida:"4 4"},{entrada:"café 🚀\n", salida:"10 6", oculta:true}],
  pista:"Buffer.byteLength(s, \"utf8\") cuenta bytes; [...s].length cuenta puntos de código.",
  solucion:`const s = require("fs").readFileSync(0, "utf8").replace(/\\r?\\n$/, "");
console.log(Buffer.byteLength(s, "utf8") + " " + [...s].length);
`,
  why:"En JavaScript, s.length cuenta unidades UTF-16 (el cohete valdría 2): ni bytes ni runes. En Go, len siempre son bytes y range recorre runes."},
 {t:"escribe", p:"¿Qué tipo usa Go para representar un carácter Unicode (punto de código)?",
  sol:["rune","int32"],
  pista:"Es un alias de int32.",
  why:"<code>'ñ'</code> es un rune; <code>\"ñ\"</code> es un string de 2 bytes."}
]}

]});
