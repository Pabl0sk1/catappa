window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Arrays, cadenas y hashing",
resumen: "Recorridos, sumas de prefijos, HashMap y HashSet para contar y buscar, y los problemas clásicos que resuelven",
nivel: "Fundamentos",
color: "#9fd36a",
lecciones: [

{
id:"al2l1",
titulo:"Arrays y sumas de prefijos",
claves:["Array: acceso O(1) por índice; insertar o borrar en medio es O(n)","Suma de prefijos: precalcular para responder sumas de rangos en O(1)","Recorrer una vez guardando el mejor valor hasta ahora"],
pasos:[
 {t:"info", eti:"La estructura base", h:"Arrays",
  c:`<div class="termbox">int[] a = {3, 1, 4, 1, 5, 9, 2, 6};
a[4];                      // O(1)
// insertar en la posicion 2 obliga a desplazar el resto: O(n)

// maximo beneficio comprando y vendiendo una vez (una pasada)
int minimo = Integer.MAX_VALUE, mejor = 0;
for (int precio : precios) {
    minimo = Math.min(minimo, precio);
    mejor = Math.max(mejor, precio - minimo);
}</div>`},
 {t:"info", eti:"Precalcular", h:"Sumas de prefijos",
  c:`<div class="termbox">// pref[i] = suma de a[0..i-1]
int[] pref = new int[a.length + 1];
for (int i = 0; i &lt; a.length; i++) pref[i + 1] = pref[i] + a[i];

// suma de a[l..r] en O(1)
int suma = pref[r + 1] - pref[l];</div>
     <p>Si te piden muchas sumas de rangos, precalcular en O(n) hace que cada consulta sea O(1) en vez de O(n).</p>`},
 {t:"opcion", p:"Con <code>a = {2, 4, 6, 8}</code>, ¿cuánto vale <code>pref</code>?",
  ops:["{2, 6, 12, 20}","{0, 2, 6, 12, 20}","{0, 2, 4, 6, 8}","{20, 18, 14, 8}"],
  ok:1, why:"pref[0] = 0 y cada posición suma el siguiente elemento."},
 {t:"par", p:"Empareja cada operación sobre un array con su coste",
  pares:[["Leer a[i]","O(1): acceso directo por posición"],["Insertar al principio","O(n): hay que desplazar todo"],["Buscar un valor sin ordenar","O(n): recorrer hasta encontrarlo"],["Suma de un rango con prefijos precalculados","O(1) tras precalcular en O(n)"]],
  why:"ArrayList en Java tiene los mismos costes por dentro."},
 {t:"vf", p:"El problema de «máximo beneficio comprando y vendiendo una vez» se puede resolver en una sola pasada O(n).",
  ok:true, why:"Guardando el precio mínimo visto hasta ahora."}
]},

{
id:"al2l2",
titulo:"HashMap y HashSet",
claves:["Búsqueda, inserción y borrado en O(1) de media","Contar frecuencias, detectar duplicados y recordar lo visto","El clásico two sum: complemento en un mapa"],
pasos:[
 {t:"info", eti:"Buscar al instante", h:"Tablas hash",
  c:`<div class="termbox">// duplicados: O(n)
Set&lt;Integer&gt; vistos = new HashSet&lt;&gt;();
for (int x : a) if (!vistos.add(x)) return true;

// frecuencias
Map&lt;Character, Integer&gt; cuenta = new HashMap&lt;&gt;();
for (char c : texto.toCharArray()) cuenta.merge(c, 1, Integer::sum);

// two sum: indices de dos numeros que suman objetivo
Map&lt;Integer, Integer&gt; posicion = new HashMap&lt;&gt;();
for (int i = 0; i &lt; a.length; i++) {
    Integer j = posicion.get(objetivo - a[i]);     // ¿he visto su complemento?
    if (j != null) return new int[]{j, i};
    posicion.put(a[i], i);
}</div>`},
 {t:"par", p:"Empareja cada problema con la idea con hashing",
  pares:[["¿Hay duplicados?","HashSet: si add devuelve false, ya estaba"],["Two sum","Mapa de valor a índice y buscar el complemento"],["¿Son anagramas?","Contar letras de ambas palabras y comparar"],["Agrupar anagramas","Mapa de palabra ordenada a lista de palabras"],["Primer carácter que no se repite","Contar frecuencias y recorrer de nuevo"]],
  why:"Casi un tercio de los ejercicios de entrevista se resuelven con un HashMap."},
 {t:"opcion", p:"¿Qué complejidad tiene two sum con el mapa?",
  ops:["O(n²)","O(n log n)","O(n) en tiempo y O(n) en espacio","O(1)"],
  ok:2, why:"Una pasada con búsquedas O(1): se cambia memoria por tiempo."},
 {t:"vf", p:"Las operaciones de un HashMap son O(1) en el peor caso siempre.",
  ok:false, why:"Son O(1) de media; con muchas colisiones empeoran (Java las mitiga convirtiendo cubetas grandes en árboles)."}
]},

{
id:"al2l3",
titulo:"Cadenas",
claves:["String es inmutable: concatenar en bucles es O(n²); usa StringBuilder","Arrays de conteo int[26] para letras minúsculas","Palíndromos, anagramas e invertir palabras son clásicos"],
pasos:[
 {t:"info", eti:"Texto", h:"Técnicas con cadenas",
  c:`<div class="termbox">// anagramas con un array de 26 contadores: O(n) y O(1) de espacio
boolean sonAnagramas(String a, String b) {
    if (a.length() != b.length()) return false;
    int[] c = new int[26];
    for (int i = 0; i &lt; a.length(); i++) {
        c[a.charAt(i) - 'a']++;
        c[b.charAt(i) - 'a']--;
    }
    for (int x : c) if (x != 0) return false;
    return true;
}

// palindromo con dos punteros
boolean esPalindromo(String s) {
    int i = 0, j = s.length() - 1;
    while (i &lt; j) if (s.charAt(i++) != s.charAt(j--)) return false;
    return true;
}</div>`},
 {t:"opcion", p:"¿Qué complejidad tiene construir una cadena de n caracteres con <code>s = s + c</code> en un bucle?",
  ops:["O(n)","O(n²): cada concatenación copia toda la cadena","O(log n)","O(1)"],
  ok:1, why:"Con StringBuilder, cada append es O(1) amortizado: total O(n)."},
 {t:"par", p:"Empareja cada problema con su técnica",
  pares:[["¿Es palíndromo?","Dos punteros desde los extremos"],["¿Son anagramas?","Contar letras con int[26] o un mapa"],["Invertir el orden de las palabras","split, invertir y unir"],["Construir una cadena larga","StringBuilder"]],
  why:"c - 'a' convierte una letra minúscula en un índice de 0 a 25."},
 {t:"vf", p:"<code>\"ana\".charAt(0) - 'a'</code> vale 0.",
  ok:true, why:"Restar caracteres da la diferencia de sus códigos."}
]}

]});
