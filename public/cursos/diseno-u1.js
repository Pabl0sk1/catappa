window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Qué es el diseño de sistemas",
resumen: "Requisitos funcionales y no funcionales, estimaciones rápidas de capacidad y los números de latencia que todo ingeniero debería conocer",
nivel: "Fundamentos",
color: "#e3a86b",
lecciones: [

{
id:"ds1l1",
titulo:"Diseñar antes de construir",
claves:["Diseñar un sistema es decidir sus piezas y cómo se comunican para cumplir unos requisitos","Requisitos funcionales (qué hace) y no funcionales (cómo de bien: latencia, disponibilidad, escala)","Todo diseño es un conjunto de compromisos"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es el diseño de sistemas?",
  c:`<p>Una API que funciona en tu portátil para 10 usuarios no es la misma que atiende a 10 millones. El <b>diseño de sistemas</b> consiste en decidir qué componentes necesitas (servidores, bases de datos, cachés, colas, CDN...), cómo se comunican y cómo se comportan cuando algo falla o la carga crece.</p>
     <p>En las entrevistas de nivel medio y senior hay una ronda dedicada: «diseña un acortador de URLs», «diseña el feed de una red social». No hay una respuesta única: se evalúa tu razonamiento.</p>`},
 {t:"info", eti:"Qué y cómo", h:"Requisitos",
  c:`<ul><li><b>Funcionales</b>: lo que el sistema hace. «Un usuario acorta una URL y obtiene un enlace corto»; «al visitar el enlace, redirige».</li>
     <li><b>No funcionales</b>: cómo de bien lo hace.
       <ul><li>Escala: 100 millones de enlaces nuevos al mes, 10.000 redirecciones por segundo.</li>
       <li>Latencia: redirección en menos de 50 ms.</li>
       <li>Disponibilidad: 99,99%.</li>
       <li>Consistencia, durabilidad, seguridad, coste.</li></ul></li></ul>`},
 {t:"par", p:"Empareja cada requisito con su tipo",
  pares:[["Los usuarios pueden subir fotos","Funcional"],["El feed carga en menos de 200 ms","No funcional: latencia"],["Soportar 50.000 peticiones por segundo","No funcional: escala"],["Funcionar aunque caiga un centro de datos","No funcional: disponibilidad"],["No perder ninguna foto subida","No funcional: durabilidad"]],
  why:"Los no funcionales son los que determinan la arquitectura."},
 {t:"opcion", p:"En una entrevista te dicen «diseña Instagram». ¿Qué haces primero?",
  ops:["Dibujar microservicios","Preguntar y acotar: qué funciones incluir, cuántos usuarios, qué latencia y disponibilidad se esperan","Elegir la base de datos","Escribir código"],
  ok:1, why:"Acotar el alcance evita diseñar algo que nadie pidió."},
 {t:"vf", p:"En diseño de sistemas existe una arquitectura correcta para cada problema.",
  ok:false, why:"Hay compromisos (coste, complejidad, consistencia, latencia). Se valora justificar las decisiones."}
]},

{
id:"ds1l2",
titulo:"Estimaciones rápidas",
claves:["Estimar peticiones por segundo, almacenamiento y ancho de banda con cuentas redondas","Un día tiene unos 100.000 segundos (86.400)","Las estimaciones deciden si basta un servidor o hacen falta cientos"],
pasos:[
 {t:"info", eti:"Cuentas de servilleta", h:"Estimar capacidad",
  c:`<div class="diag">Acortador de URLs
  nuevos enlaces: 100 millones / mes  ~ 100M / (30 x 100.000 s) ~ 40 escrituras/s
  lecturas: 100 veces mas que escrituras            ~ 4.000 lecturas/s (picos x3: 12.000)
  almacenamiento por enlace: ~500 bytes
  en 5 anos: 100M x 12 x 5 = 6.000M enlaces x 500 B ~ 3 TB</div>
     <p>Conclusiones: las escrituras son pocas; las lecturas dominan → caché. 3 TB caben en una base de datos bien dimensionada o repartida en unas pocas.</p>`},
 {t:"par", p:"Empareja cada magnitud con su valor aproximado",
  pares:[["Segundos en un día","~100.000 (86.400)"],["1 millón de peticiones al día","~12 por segundo de media"],["1.000 millones de peticiones al día","~12.000 por segundo de media"],["1 KB × 1.000 millones","~1 TB"]],
  why:"Redondear sin miedo: se buscan órdenes de magnitud, no decimales."},
 {t:"opcion", p:"Un servicio recibe 86 millones de peticiones al día. ¿Cuántas por segundo de media, aproximadamente?",
  ops:["~10","~1.000","~100.000","~1 millón"],
  ok:1, why:"86.000.000 / 86.400 ≈ 1.000. Con picos, quizá 3.000."},
 {t:"vf", p:"En las estimaciones conviene considerar los picos, no solo la media.",
  ok:true, why:"El sistema debe aguantar la hora punta, que puede ser varias veces la media."}
]},

{
id:"ds1l3",
titulo:"Números de latencia",
claves:["Memoria: nanosegundos; disco SSD: decenas de microsegundos; red en el mismo centro: ~0,5 ms","Entre continentes: ~100-150 ms de ida y vuelta","Cada salto de red y cada acceso a disco cuentan"],
pasos:[
 {t:"info", eti:"Órdenes de magnitud", h:"Lo que cuesta cada cosa",
  c:`<div class="diag">leer de cache L1 del procesador      ~1 ns
leer de memoria RAM                  ~100 ns
leer 1 MB secuencial de memoria      ~10 us
lectura aleatoria en SSD             ~100 us
ida y vuelta en el mismo centro      ~500 us
leer 1 MB secuencial de SSD          ~1 ms
ida y vuelta Madrid - Frankfurt      ~30 ms
ida y vuelta Europa - EEUU           ~100 ms</div>
     <p>Una caché en memoria responde en microsegundos; una consulta a una base de datos en otro continente, en cientos de milisegundos. Por eso se cachea y se acerca el contenido al usuario.</p>`},
 {t:"orden", p:"Ordena de más rápido a más lento",
  items:["Leer de la memoria RAM","Leer de un SSD","Ida y vuelta por red en el mismo centro de datos","Ida y vuelta entre Europa y Estados Unidos"],
  why:"Cada salto es aproximadamente uno o dos órdenes de magnitud."},
 {t:"opcion", p:"Tu API en Europa hace 10 consultas secuenciales a una base de datos en EE. UU. por cada petición. ¿Latencia mínima aproximada?",
  ops:["~10 ms","~1 segundo (10 × ~100 ms)","~100 µs","~10 segundos"],
  ok:1, why:"Solución: la base de datos cerca de la aplicación, menos viajes o caché."}
]}

]});
