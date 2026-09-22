window.CURSOS = window.CURSOS || {};
(CURSOS.algoritmos = CURSOS.algoritmos || []).push({
titulo: "Programación dinámica",
resumen: "Subproblemas que se repiten, memoización y tabulación, y los problemas clásicos: escaleras, mochila, subsecuencias y caminos",
nivel: "Experto",
color: "#72af40",
lecciones: [

{
id:"al8l1",
titulo:"Memoización y tabulación",
claves:["Programación dinámica: problemas con subproblemas repetidos y solución óptima a partir de subsoluciones","Memoización: recursión + caché (de arriba abajo)","Tabulación: rellenar una tabla desde los casos base (de abajo arriba)"],
pasos:[
 {t:"info", eti:"No repetir trabajo", h:"Dos formas de hacer DP",
  c:`<div class="termbox">// maneras de subir n escalones de 1 en 1 o de 2 en 2
// recurrencia: formas(n) = formas(n-1) + formas(n-2)

// 1. memoizacion
Map&lt;Integer, Long&gt; memo = new HashMap&lt;&gt;();
long formas(int n) {
    if (n &lt;= 1) return 1;
    if (memo.containsKey(n)) return memo.get(n);
    long r = formas(n - 1) + formas(n - 2);
    memo.put(n, r);
    return r;
}

// 2. tabulacion con O(1) de espacio
long formasTab(int n) {
    long a = 1, b = 1;                 // formas(0), formas(1)
    for (int i = 2; i &lt;= n; i++) { long c = a + b; a = b; b = c; }
    return b;
}</div>`},
 {t:"orden", p:"Ordena los pasos para resolver un problema con programación dinámica",
  items:["Definir el estado: qué significa dp[i]","Escribir la recurrencia a partir de estados más pequeños","Fijar los casos base","Decidir el orden de cálculo (o usar memoización)","Optimizar la memoria si solo se usan los últimos estados"],
  why:"Definir bien el estado es el 80% del trabajo."},
 {t:"par", p:"Empareja cada técnica con su descripción",
  pares:[["Memoización","Recursión que guarda resultados ya calculados"],["Tabulación","Bucle que rellena una tabla desde los casos base"],["Subestructura óptima","La mejor solución se construye con mejores subsoluciones"],["Subproblemas solapados","Los mismos subproblemas aparecen muchas veces"]],
  why:"Si no hay subproblemas repetidos, basta con divide y vencerás."}
]},

{
id:"al8l2",
titulo:"Problemas clásicos",
claves:["Mochila 0/1: elegir objetos con peso y valor bajo una capacidad","Subsecuencia común más larga y distancia de edición: tablas 2D","Monedas: número mínimo o formas de dar un importe"],
pasos:[
 {t:"info", eti:"Los que siempre salen", h:"Tres clásicos",
  c:`<div class="termbox">// minimo de monedas para un importe (-1 si no se puede)
int monedas(int[] m, int importe) {
    int[] dp = new int[importe + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int x = 1; x &lt;= importe; x++)
        for (int c : m)
            if (c &lt;= x &amp;&amp; dp[x - c] != Integer.MAX_VALUE)
                dp[x] = Math.min(dp[x], dp[x - c] + 1);
    return dp[importe] == Integer.MAX_VALUE ? -1 : dp[importe];
}

// subsecuencia comun mas larga de a y b
int[][] dp = new int[a.length() + 1][b.length() + 1];
for (int i = 1; i &lt;= a.length(); i++)
    for (int j = 1; j &lt;= b.length(); j++)
        dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
            ? dp[i - 1][j - 1] + 1
            : Math.max(dp[i - 1][j], dp[i][j - 1]);</div>`},
 {t:"par", p:"Empareja cada problema con la definición de su estado",
  pares:[["Mínimo de monedas","dp[x] = monedas mínimas para el importe x"],["Subsecuencia común más larga","dp[i][j] = LCS de los prefijos a[0..i) y b[0..j)"],["Robar casas no contiguas","dp[i] = máximo obtenido con las primeras i casas"],["Caminos en una cuadrícula","dp[f][c] = caminos para llegar a la celda (f, c)"],["Distancia de edición","dp[i][j] = operaciones para convertir un prefijo en otro"]],
  why:"La distancia de edición (Levenshtein) es la base de los correctores ortográficos y de diff."},
 {t:"opcion", p:"Con monedas {1, 3, 4} e importe 6, ¿cuántas monedas como mínimo?",
  ops:["3 (4 + 1 + 1)","2 (3 + 3)","6","1"],
  ok:1, why:"El algoritmo voraz (coger siempre la mayor) daría 3: por eso aquí hace falta programación dinámica."}
]}

]});
