window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Qué es el diseño de sistemas",
resumen: "Requisitos funcionales y no funcionales, estimaciones rápidas de capacidad, números de latencia, percentiles y la ley de Little",
nivel: "Fundamentos",
color: "#e3a86b",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"ds1l1",
titulo:"Diseñar antes de construir",
claves:["Diseñar un sistema es decidir sus piezas y cómo se comunican para cumplir unos requisitos","Requisitos funcionales (qué hace) y no funcionales (cómo de bien: latencia, disponibilidad, escala)","Todo diseño es un conjunto de compromisos que hay que justificar"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es el diseño de sistemas?",
  c:`<p>Una API que funciona en tu portátil para 10 usuarios no es la misma que atiende a 10 millones. El <b>diseño de sistemas</b> consiste en decidir qué componentes necesitas (servidores, bases de datos, cachés, colas, CDN…), cómo se comunican y cómo se comportan cuando algo falla o la carga crece.</p>
     <p>En las entrevistas de nivel medio, sénior y staff hay una ronda dedicada: «diseña un acortador de URLs», «diseña el feed de una red social». No hay una respuesta única: se evalúa cómo razonas, qué preguntas haces y si sabes justificar cada decisión con su precio.</p>
     <div class="dg"><div class="dg-tit">de qué está hecho casi cualquier sistema</div>
<div class="dg-pila">
<div class="dg-fila"><div class="dg-caja base">clientes</div><div class="dg-caja base">DNS y CDN</div><div class="dg-caja">balanceador</div></div>
<div class="dg-fila"><div class="dg-caja acento">servicios sin estado</div><div class="dg-caja">caché</div><div class="dg-caja">colas y eventos</div></div>
<div class="dg-fila"><div class="dg-caja ok">bases de datos</div><div class="dg-caja ok">almacenamiento de objetos</div><div class="dg-caja ok">búsqueda y analítica</div></div>
</div></div>`},
 {t:"info", eti:"Qué y cómo", h:"Requisitos",
  c:`<ul><li><b>Funcionales</b>: lo que el sistema hace. «Un usuario acorta una URL y obtiene un enlace corto»; «al visitar el enlace, redirige».</li>
     <li><b>No funcionales</b>: cómo de bien lo hace.
       <ul><li>Escala: 100 millones de enlaces nuevos al mes, 10.000 redirecciones por segundo.</li>
       <li>Latencia: redirección en menos de 50 ms en el percentil 99.</li>
       <li>Disponibilidad: 99,99%.</li>
       <li>Consistencia, durabilidad, seguridad, coste, cumplimiento legal (RGPD).</li></ul></li></ul>
     <p>Los funcionales dicen <i>qué</i> construir; los no funcionales deciden <i>la arquitectura</i>. Un acortador para 100 usuarios es una tabla y un servidor; para 10.000 redirecciones por segundo con 99,99% necesitas caché, réplicas y varias zonas.</p>
     <div class="nota ojo"><b class="tit">Error típico</b>Lanzarse a dibujar sin preguntar. Si no sabes si el sistema tiene 1.000 o 100 millones de usuarios, cualquier diagrama es una suposición.</div>`},
 {t:"par", p:"Empareja cada requisito con su tipo",
  pares:[["Los usuarios pueden subir fotos","Funcional"],["El feed carga en menos de 200 ms","No funcional: latencia"],["Soportar 50.000 peticiones por segundo","No funcional: escala"],["Funcionar aunque caiga un centro de datos","No funcional: disponibilidad"],["No perder ninguna foto subida","No funcional: durabilidad"]],
  why:"Los no funcionales son los que determinan la arquitectura: el mismo requisito funcional se resuelve de formas muy distintas según la escala."},
 {t:"opcion", p:"En una entrevista te dicen «diseña Instagram». ¿Qué haces primero?",
  ops:["Dibujar microservicios","Preguntar y acotar: qué funciones incluir, cuántos usuarios, qué latencia y disponibilidad se esperan","Elegir la base de datos","Escribir código"],
  ok:1, why:"Acotar el alcance evita diseñar algo que nadie pidió. «Instagram» completo no cabe en 45 minutos: se elige subir fotos, seguir y el feed, por ejemplo."},
 {t:"vf", p:"En diseño de sistemas existe una arquitectura correcta para cada problema.",
  ok:false, why:"Hay compromisos (coste, complejidad, consistencia, latencia). Se valora elegir con criterio y decir qué se sacrifica."},
 {t:"opcion", p:"¿Qué pregunta te da más información para diseñar un servicio nuevo?",
  ops:["¿Qué lenguaje usa el equipo?","¿Cuál es la proporción entre lecturas y escrituras y qué volumen se espera?","¿De qué color es el logotipo?","¿Qué IDE usan?"],
  ok:1, why:"Un sistema con 100 lecturas por escritura pide caché y réplicas; uno dominado por escrituras pide particionado y almacenes pensados para escribir."},
 {t:"escribe", p:"¿Cómo se llaman los requisitos que describen <i>cómo de bien</i> funciona un sistema (latencia, disponibilidad, escala)?",
  sol:["no funcionales","requisitos no funcionales","no-funcionales"],
  pista:"Lo contrario de «funcionales».",
  why:"En inglés, «non-functional requirements» o «atributos de calidad»."},
 {t:"par", p:"Empareja cada pregunta con lo que decide en el diseño",
  pares:[["¿Cuántos usuarios activos al día?","El volumen de peticiones y de datos"],["¿Qué pasa si se ve un dato con segundos de retraso?","El nivel de consistencia necesario"],["¿Desde qué países se usa?","Regiones, CDN y latencia"],["¿Se puede perder algún dato?","Replicación y durabilidad"]],
  why:"Cada respuesta descarta o impone piezas concretas. Por eso se pregunta antes de dibujar."}
]},

/* =============== U1 L2 =============== */
{
id:"ds1l2",
titulo:"Estimaciones rápidas",
claves:["Estimar peticiones por segundo, almacenamiento y ancho de banda con cuentas redondas","Un día tiene unos 100.000 segundos (86.400) y un mes unos 2,5 millones","Las estimaciones deciden si basta un servidor o hacen falta cientos"],
pasos:[
 {t:"info", eti:"Cuentas de servilleta", h:"Estimar capacidad",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">acortador de URLs: estimación</div>
<table class="dg-tabla"><thead><tr><th>qué</th><th>cálculo</th><th>resultado</th></tr></thead><tbody>
<tr><td>nuevos enlaces</td><td>100 millones / mes ≈ 100M / (30 × 100.000 s)</td><td>≈ 40 escrituras/s</td></tr>
<tr><td>lecturas</td><td>100 veces más que escrituras</td><td>≈ 4.000 lecturas/s<br><small>picos ×3: 12.000</small></td></tr>
<tr><td>por enlace</td><td>almacenamiento</td><td>≈ 500 bytes</td></tr>
<tr><td>en 5 años</td><td>100M × 12 × 5 = 6.000M enlaces × 500 B</td><td>≈ 3 TB</td></tr>
</tbody></table></div>
     <p>Conclusiones: las escrituras son pocas; las lecturas dominan → caché. 3 TB caben en una base de datos bien dimensionada o repartida en unas pocas.</p>`},
 {t:"info", eti:"Chuleta", h:"Unidades y trucos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">potencias que conviene tener a mano</div>
<table class="dg-tabla"><thead><tr><th>potencia</th><th>aprox.</th><th>nombre</th></tr></thead><tbody>
<tr><td>2^10</td><td>mil</td><td>1 KB</td></tr>
<tr><td>2^20</td><td>un millón</td><td>1 MB</td></tr>
<tr><td>2^30</td><td>mil millones</td><td>1 GB</td></tr>
<tr><td>2^40</td><td>un billón</td><td>1 TB</td></tr>
<tr><td>2^50</td><td>mil billones</td><td>1 PB</td></tr>
</tbody></table></div>
     <ul><li><b>Peticiones/s</b> = usuarios activos diarios × peticiones por usuario / 86.400. Multiplica por 2–5 para el pico.</li>
     <li><b>Almacenamiento</b> = elementos nuevos al día × tamaño × días de retención × réplicas.</li>
     <li><b>Ancho de banda</b> = peticiones/s × tamaño de la respuesta.</li>
     <li><b>Servidores</b> = pico de peticiones/s ÷ lo que aguanta uno (un servicio web típico: cientos a pocos miles por núcleo, según lo que haga).</li></ul>
     <div class="nota"><b class="tit">Consejo</b>Di las cuentas en voz alta y redondea sin miedo. Lo que importa es el orden de magnitud y la conclusión que sacas: «4.000 lecturas/s, cabe en una caché; 3 TB, no cabe en memoria».</div>`},
 {t:"par", p:"Empareja cada magnitud con su valor aproximado",
  pares:[["Segundos en un día","~100.000 (86.400)"],["1 millón de peticiones al día","~12 por segundo de media"],["1.000 millones de peticiones al día","~12.000 por segundo de media"],["1 KB × 1.000 millones","~1 TB"]],
  why:"Redondear sin miedo: se buscan órdenes de magnitud, no decimales."},
 {t:"opcion", p:"Un servicio recibe 86 millones de peticiones al día. ¿Cuántas por segundo de media, aproximadamente?",
  ops:["~10","~1.000","~100.000","~1 millón"],
  ok:1, why:"86.000.000 / 86.400 ≈ 1.000. Con picos, quizá 3.000."},
 {t:"vf", p:"En las estimaciones conviene considerar los picos, no solo la media.",
  ok:true, why:"El sistema debe aguantar la hora punta, que puede ser varias veces la media (y un evento puntual, como un partido o el Black Friday, mucho más)."},
 {t:"opcion", p:"Una app de fotos recibe 10 millones de fotos al día de 2 MB de media. ¿Cuánto almacenamiento nuevo al año, sin contar réplicas?",
  ops:["~7 GB","~7 TB","~7 PB","~70 PB"],
  ok:2, why:"10M × 2 MB = 20 TB al día; × 365 ≈ 7.300 TB ≈ 7 PB. Esto ya no es una base de datos: es almacenamiento de objetos."},
 {t:"opcion", p:"Una API sirve 5.000 peticiones/s con respuestas de 20 KB. ¿Qué ancho de banda de salida necesita?",
  ops:["~100 KB/s","~100 MB/s (unos 800 Mbit/s)","~100 GB/s","~1 KB/s"],
  ok:1, why:"5.000 × 20 KB = 100.000 KB/s ≈ 100 MB/s. Una sola tarjeta de 1 Gbit/s iría al límite: hace falta repartir o una CDN."},
 {t:"codigo", p:"Calcula las peticiones por segundo de media y en pico",
  lenguaje:"py",
  c:`<p>Lee tres líneas: usuarios activos diarios, peticiones por usuario al día y factor de pico. Imprime la media y el pico redondeados al entero más cercano, usando 86.400 segundos por día:</p>
<div class="termbox">media: 2315/s
pico: 6944/s</div>
<p>(Ese es el resultado para 10.000.000 usuarios, 20 peticiones y factor 3.)</p>`,
  plantilla:`usuarios = int(input())
por_usuario = int(input())
factor = float(input())
# calcula y escribe media y pico
`,
  pruebas:[{entrada:"10000000\n20\n3\n", salida:"media: 2315/s\npico: 6944/s"},{entrada:"1000000\n10\n2\n", salida:"media: 116/s\npico: 231/s"},{entrada:"500000000\n4\n2\n", salida:"media: 23148/s\npico: 46296/s", oculta:true}],
  pista:"media = usuarios * por_usuario / 86400; el pico es media * factor. Redondea al final con round().",
  solucion:`usuarios = int(input())
por_usuario = int(input())
factor = float(input())
media = usuarios * por_usuario / 86400
print(f"media: {round(media)}/s")
print(f"pico: {round(media * factor)}/s")
`,
  why:"Redondea solo al final: si redondeas la media antes de multiplicar, el error se multiplica también."}
]},

/* =============== U1 L3 =============== */
{
id:"ds1l3",
titulo:"Latencia, percentiles y ley de Little",
claves:["Memoria: nanosegundos; SSD: decenas o cientos de microsegundos; red en el mismo centro: ~0,5 ms; entre continentes: ~100 ms","La latencia se mide en percentiles (p50, p95, p99), no en medias","Ley de Little: peticiones en curso = rendimiento × latencia"],
pasos:[
 {t:"info", eti:"Órdenes de magnitud", h:"Lo que cuesta cada cosa",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">latencias aproximadas</div><table class="dg-tabla"><tbody><tr><td>leer de la caché L1 del procesador</td><td>~1 ns</td></tr><tr><td>leer de memoria RAM</td><td>~100 ns</td></tr><tr><td>leer 1 MB secuencial de memoria</td><td>~10 µs</td></tr><tr><td>lectura aleatoria en SSD</td><td>~100 µs</td></tr><tr><td>ida y vuelta en el mismo centro de datos</td><td>~500 µs</td></tr><tr><td>leer 1 MB secuencial de SSD</td><td>~1 ms</td></tr><tr><td>ida y vuelta Madrid - Frankfurt</td><td>~30 ms</td></tr><tr><td>ida y vuelta Europa - EE. UU.</td><td>~100 ms</td></tr></tbody></table></div>
     <p>Una caché en memoria responde en microsegundos; una consulta a una base de datos en otro continente, en cientos de milisegundos. Por eso se cachea y se acerca el contenido al usuario. La velocidad de la luz en fibra (unos 200.000 km/s) pone un suelo que ningún hardware mejora.</p>`},
 {t:"orden", p:"Ordena de más rápido a más lento",
  items:["Leer de la memoria RAM","Leer de un SSD","Ida y vuelta por red en el mismo centro de datos","Ida y vuelta entre Europa y Estados Unidos"],
  why:"Cada salto es aproximadamente uno o dos órdenes de magnitud."},
 {t:"opcion", p:"Tu API en Europa hace 10 consultas secuenciales a una base de datos en EE. UU. por cada petición. ¿Latencia mínima aproximada?",
  ops:["~10 ms","~1 segundo (10 × ~100 ms)","~100 µs","~10 segundos"],
  ok:1, why:"Solución: la base de datos cerca de la aplicación, menos viajes (una consulta que traiga todo) o caché."},
 {t:"info", eti:"Medir bien", h:"Percentiles y la cola larga",
  c:`<p>La media esconde lo importante. Si 99 peticiones tardan 10 ms y una tarda 5 s, la media es ~60 ms, pero uno de cada cien usuarios espera cinco segundos. Por eso se habla de <b>percentiles</b>:</p>
     <ul><li><b>p50</b> (mediana): la mitad de las peticiones tardan menos.</li>
     <li><b>p99</b>: el 99% tarda menos; el 1% restante es la <b>cola larga</b>.</li></ul>
     <p>La cola importa más de lo que parece: si una página llama a 100 servicios en paralelo y cada uno es lento el 1% de las veces, la probabilidad de que <i>alguno</i> sea lento es 1 − 0,99^100 ≈ <b>63%</b>. Con abanicos grandes, el p99 de las piezas se convierte en el p50 del conjunto.</p>
     <div class="dg"><div class="dg-tit">ley de Little</div>
<div class="dg-flujo"><div class="dg-caja">rendimiento<small>2.000 peticiones/s</small></div><div class="dg-caja">× latencia<small>0,05 s</small></div><div class="dg-caja acento">= en curso<small>100 peticiones a la vez</small></div></div>
<div class="dg-nota arriba">si la latencia sube a 0,5 s con el mismo tráfico, necesitas 1.000 hilos o conexiones: así se agotan los pools</div></div>`},
 {t:"opcion", p:"Un servicio atiende 2.000 peticiones/s con una latencia media de 50 ms. ¿Cuántas peticiones hay en curso a la vez, de media?",
  ops:["40","100","2.000","100.000"],
  ok:1, why:"Ley de Little: L = λ × W = 2.000 × 0,05 = 100. Sirve para dimensionar pools de conexiones e hilos."},
 {t:"vf", p:"Para fijar un objetivo de latencia es mejor usar la media que el percentil 99.",
  ok:false, why:"La media la dominan los casos rápidos y oculta a los usuarios que esperan mucho. Los objetivos se ponen en p95 o p99."},
 {t:"opcion", p:"Una página hace 50 llamadas en paralelo y cada una tiene un 2% de probabilidad de ser lenta. ¿Qué pasa con la página?",
  ops:["Será lenta el 2% de las veces","Será lenta en torno al 64% de las veces (1 − 0,98^50)","Nunca será lenta","Será lenta el 50% exacto"],
  ok:1, why:"La latencia de la página es la de la llamada más lenta. Técnicas contra esto: peticiones de respaldo (hedged requests), timeouts y reducir el abanico."},
 {t:"codigo", p:"Calcula un percentil por el método del rango más cercano",
  lenguaje:"py",
  c:`<p>Primera línea: latencias en ms separadas por espacios. Segunda línea: el percentil <code>p</code>. Ordena y toma el elemento en la posición <code>ceil(p/100 × n)</code> (contando desde 1). Imprime <code>p50: 11</code>, por ejemplo.</p>`,
  plantilla:`import math
lat = list(map(int, input().split()))
p = int(input())
# calcula el percentil
`,
  pruebas:[{entrada:"12 7 30 9 15 8 11 250 10 13\n50\n", salida:"p50: 11"},{entrada:"12 7 30 9 15 8 11 250 10 13\n90\n", salida:"p90: 30"},{entrada:"12 7 30 9 15 8 11 250 10 13\n99\n", salida:"p99: 250", oculta:true},{entrada:"5 1 3\n1\n", salida:"p1: 1", oculta:true}],
  pista:"Ordena con sorted(), calcula k = math.ceil(p / 100 * len(lat)) y usa el índice k - 1.",
  solucion:`import math
lat = list(map(int, input().split()))
p = int(input())
v = sorted(lat)
k = math.ceil(p / 100 * len(v))
print(f"p{p}: {v[max(k, 1) - 1]}")
`,
  why:"Fíjate en que la media de esas latencias es 36,5 ms, más del triple de la mediana: un solo valor de 250 ms la arrastra."}
]}

]});
