window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Consistencia y consenso",
resumen: "Teorema CAP y PACELC, modelos de consistencia, quórums, relojes, consenso con Raft, elección de líder y cerrojos distribuidos",
nivel: "Avanzado",
color: "#cf9150",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"ds5l1",
titulo:"CAP y PACELC",
claves:["CAP: ante una partición de red, elegir entre consistencia (lineal) y disponibilidad","PACELC: incluso sin particiones, se elige entre latencia y consistencia","Se decide dato a dato: el saldo no es el contador de «me gusta»"],
pasos:[
 {t:"info", eti:"Compromisos", h:"CAP en la práctica",
  c:`<p>En un sistema distribuido, la red puede partirse (P): dos grupos de nodos dejan de verse. No es opcional: pasa. Cuando ocurre, hay que elegir:</p>
     <div class="dg"><div class="dg-tit">durante una partición</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">CP: consistencia</div>
<div class="dg-caja acento doble">el lado sin mayoría rechaza operaciones<small>antes que devolver un dato viejo</small></div>
<div class="dg-caja ok">saldo, stock de la última unidad, cerrojos</div>
<div class="dg-caja base">etcd, ZooKeeper, Spanner</div></div>
<div class="dg-col"><div class="dg-col-tit">AP: disponibilidad</div>
<div class="dg-caja acento doble">todos los nodos siguen respondiendo<small>aunque el dato pueda estar desfasado</small></div>
<div class="dg-caja ok">«me gusta», feed, carrito</div>
<div class="dg-caja base">Cassandra, DynamoDB (lecturas eventuales)</div></div>
</div></div>
     <p>La <b>C</b> de CAP es consistencia <b>lineal</b> (cada lectura ve la última escritura confirmada, como si hubiera una sola copia), no la C de ACID. Y la <b>A</b> significa que todo nodo que no ha caído responde.</p>`},
 {t:"info", eti:"El otro 99%", h:"PACELC",
  c:`<p>Las particiones son raras; el resto del tiempo también hay un compromiso. <b>PACELC</b>: si hay <b>P</b>artición, elige <b>A</b> o <b>C</b>; si no (<b>E</b>lse), elige <b>L</b>atencia o <b>C</b>onsistencia.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">PACELC en sistemas conocidos</div>
<table class="dg-tabla"><thead><tr><th>sistema</th><th>con partición</th><th>sin partición</th></tr></thead><tbody>
<tr><td>Cassandra, DynamoDB (por defecto)</td><td>A</td><td>L: responden sin esperar a todas las réplicas</td></tr>
<tr><td>etcd, ZooKeeper, Spanner</td><td>C</td><td>C: esperan a la mayoría aunque cueste latencia</td></tr>
</tbody></table></div>
     <p>Muchos sistemas son <b>ajustables</b>: en Cassandra eliges por consulta <code>ONE</code> (rápido) o <code>QUORUM</code> (consistente); en DynamoDB, lectura eventual o fuertemente consistente (que cuesta el doble).</p>`},
 {t:"par", p:"Empareja cada dato con el tipo de consistencia razonable",
  pares:[["Saldo de una cuenta","Fuerte: nunca mostrar dinero que no existe"],["Contador de visualizaciones","Eventual: unos segundos de retraso no importan"],["Stock en el momento de pagar","Fuerte: no vender la misma unidad dos veces"],["Feed de publicaciones de amigos","Eventual: un post puede tardar en aparecer"],["Perfil del usuario tras editarlo (él mismo)","Leer tus propias escrituras"]],
  why:"No todo el sistema necesita el mismo nivel: se decide dato a dato."},
 {t:"vf", p:"Un sistema distribuido puede elegir ser «CA» y así evitar las particiones de red.",
  ok:false, why:"Las particiones no se eligen: ocurren. Un sistema en un solo nodo es «CA» porque no está distribuido. En cuanto hay red de por medio, solo queda decidir qué hacer cuando se parte."},
 {t:"opcion", p:"Durante una partición, un nodo de un sistema CP que ha quedado en minoría recibe una escritura. ¿Qué hace?",
  ops:["La acepta y la sincroniza después","La rechaza (o espera) porque no puede garantizar que la mayoría la verá","La guarda solo en caché","La duplica"],
  ok:1, why:"Rechazar es el precio de la consistencia. Un sistema AP la aceptaría y resolvería conflictos más tarde."},
 {t:"opcion", p:"Según PACELC, ¿qué pagas por lecturas fuertemente consistentes cuando la red va bien?",
  ops:["Nada","Más latencia: hay que consultar al líder o a una mayoría de réplicas","Menos durabilidad","Más espacio en disco"],
  ok:1, why:"Por eso DynamoDB cobra el doble por una lectura fuerte y Cassandra con QUORUM es más lenta que con ONE."},
 {t:"escribe", p:"¿Qué nombre recibe el modelo en el que, si no hay escrituras nuevas, todas las réplicas acaban convergiendo al mismo valor?",
  sol:["consistencia eventual","eventual","eventual consistency"],
  pista:"Tarde o temprano…",
  why:"No dice cuándo convergen ni qué ves mientras tanto; por eso a menudo se combina con garantías de sesión como leer tus propias escrituras."}
]},

/* =============== U6 L2 =============== */
{
id:"ds6n1",
titulo:"Modelos de consistencia y quórums",
claves:["De más fuerte a más débil: lineal, causal, garantías de sesión, eventual","Quórum: con N réplicas, si R + W &gt; N las lecturas y escrituras se solapan","Relojes: no ordenes eventos de máquinas distintas por su hora; usa relojes lógicos o versiones"],
pasos:[
 {t:"info", eti:"Grados", h:"Modelos de consistencia",
  c:`<div class="dg"><div class="dg-tit">de más fuerte (y caro) a más débil (y barato)</div>
<div class="dg-vert">
<div class="dg-caja acento doble">lineal<small>como si hubiera una sola copia y cada operación ocurriera en un instante</small></div>
<div class="dg-caja doble">causal<small>si B depende de A, todos ven A antes que B (la respuesta nunca antes que la pregunta)</small></div>
<div class="dg-caja doble">garantías de sesión<small>leer tus escrituras, lecturas monótonas, escrituras en orden</small></div>
<div class="dg-caja ok doble">eventual<small>las réplicas convergen si dejan de llegar escrituras</small></div>
</div></div>
     <p>Un ejemplo de por qué importa la causal: Ana publica «¿alguien viene al cine?» y Luis responde «yo». Si un tercero ve la respuesta antes que la pregunta, la conversación no tiene sentido.</p>`},
 {t:"info", eti:"Contar votos", h:"Quórums",
  c:`<div class="dg"><div class="dg-tit">N = 3, W = 2, R = 2</div>
<div class="dg-pila">
<div class="dg-fila"><div class="dg-caja ok doble">réplica A<small>escrita v2 · leída</small></div><div class="dg-caja ok doble">réplica B<small>escrita v2</small></div><div class="dg-caja doble">réplica C<small>aún v1 · leída</small></div></div>
</div>
<div class="dg-nota arriba">la lectura consulta A y C: al menos una (A) tiene v2, porque R + W = 4 &gt; 3</div></div>
     <ul><li><b>N</b>: réplicas de cada dato. <b>W</b>: cuántas deben confirmar una escritura. <b>R</b>: a cuántas se pregunta al leer.</li>
     <li>Si <b>R + W &gt; N</b>, todo conjunto de lectura se cruza con todo conjunto de escritura: la lectura encuentra el valor más reciente (se elige por versión).</li>
     <li>Toleras N − W réplicas caídas al escribir y N − R al leer.</li>
     <li>Las réplicas que se quedaron atrás se arreglan con <b>reparación en lectura</b> y con procesos de antientropía (árboles de Merkle).</li></ul>
     <div class="nota ojo"><b class="tit">Relojes</b>Los relojes de dos máquinas nunca coinciden exactamente (NTP deja errores de milisegundos). «Último que escribe gana» por hora del reloj puede tirar una escritura que en realidad fue posterior. Se usan números de versión, relojes lógicos (Lamport, vectoriales) o relojes híbridos.</div>`},
 {t:"par", p:"Empareja cada configuración (N = 3) con su efecto",
  pares:[["W = 3, R = 1","Lecturas rapidísimas; una réplica caída bloquea escrituras"],["W = 1, R = 3","Escrituras rápidas; lecturas que esperan a todas"],["W = 2, R = 2","Equilibrio: tolera una caída al leer y al escribir"],["W = 1, R = 1","Lo más rápido, sin garantía de leer lo último"]],
  why:"En Cassandra, QUORUM para lecturas y escrituras con factor de replicación 3 es la combinación clásica."},
 {t:"opcion", p:"Con N = 5, ¿qué combinación garantiza que una lectura solapa con la última escritura tolerando dos réplicas caídas en ambas operaciones?",
  ops:["W = 2, R = 2","W = 3, R = 3","W = 5, R = 1","W = 1, R = 1"],
  ok:1, why:"3 + 3 = 6 &gt; 5 y N − 3 = 2 caídas toleradas. W = 5 no tolera ninguna caída al escribir."},
 {t:"vf", p:"Para decidir qué escritura es la última entre dos servidores, basta con comparar la hora de sus relojes.",
  ok:false, why:"Los relojes derivan y NTP puede incluso hacerlos retroceder. Spanner lo resuelve con TrueTime (relojes atómicos y GPS con un intervalo de incertidumbre); el resto usa versiones o relojes lógicos."},
 {t:"opcion", p:"Un usuario publica un comentario y responde a otro. ¿Qué modelo mínimo garantiza que nadie ve la respuesta sin el comentario original?",
  ops:["Eventual","Causal","Ninguno","Lineal es el único posible"],
  ok:1, why:"La causal es más barata que la lineal y basta para conversaciones, comentarios o historiales."},
 {t:"codigo", p:"Analiza una configuración de quórum",
  lenguaje:"py",
  c:`<p>Lee <code>N W R</code> en una línea. Imprime tres líneas: <code>solapan: si</code> o <code>solapan: no</code> (R + W &gt; N), <code>caidas al escribir: X</code> (N − W) y <code>caidas al leer: Y</code> (N − R).</p>`,
  plantilla:`n, w, r = map(int, input().split())
# analiza el quórum
`,
  pruebas:[{entrada:"3 2 2\n", salida:"solapan: si\ncaidas al escribir: 1\ncaidas al leer: 1"},{entrada:"3 1 1\n", salida:"solapan: no\ncaidas al escribir: 2\ncaidas al leer: 2"},{entrada:"5 4 2\n", salida:"solapan: si\ncaidas al escribir: 1\ncaidas al leer: 3", oculta:true}],
  pista:"Tres print: una condición y dos restas.",
  solucion:`n, w, r = map(int, input().split())
print("solapan: " + ("si" if r + w > n else "no"))
print(f"caidas al escribir: {n - w}")
print(f"caidas al leer: {n - r}")
`,
  why:"Con esta cuenta justificas en una entrevista por qué eliges QUORUM/QUORUM o ONE/ALL según si el sistema lee o escribe más."}
]},

/* =============== U6 L3 =============== */
{
id:"ds6n2",
titulo:"Consenso, líderes y cerrojos",
claves:["Consenso: que varios nodos acuerden un valor o un orden aunque alguno falle; Raft y Paxos","Con 2f + 1 nodos se toleran f caídas; una mayoría decide","Cerrojos distribuidos con concesiones (lease) y tokens de vallado"],
pasos:[
 {t:"info", eti:"Ponerse de acuerdo", h:"Raft a alto nivel",
  c:`<div class="dg"><div class="dg-tit">Raft: elección y replicación del registro</div>
<div class="dg-vert">
<div class="dg-caja doble">los seguidores no oyen al líder<small>su temporizador (aleatorio, 150–300 ms) vence</small></div>
<div class="dg-caja acento doble">uno se hace candidato<small>sube el mandato (term) y pide votos</small></div>
<div class="dg-caja ok doble">gana con mayoría de votos<small>cada nodo vota una vez por mandato</small></div>
<div class="dg-caja doble">el líder recibe las escrituras<small>las añade a su registro y las envía a los seguidores</small></div>
<div class="dg-caja ok doble">confirmada cuando la tiene una mayoría<small>se aplica a la máquina de estados</small></div>
</div></div>
     <ul><li>Con <b>3 nodos</b> se tolera 1 caída; con <b>5</b>, 2. Un número par no ayuda: 4 nodos también toleran solo 1.</li>
     <li>El líder de un mandato viejo que se quedó aislado no puede confirmar nada: le falta la mayoría.</li>
     <li>Lo implementan <b>etcd</b> (el cerebro de Kubernetes), <b>Consul</b>, <b>Kafka con KRaft</b> y bases como CockroachDB. ZooKeeper usa ZAB, muy parecido.</li></ul>
     <p>No guardes tus datos de negocio en etcd: el consenso es para <b>metadatos</b> (quién es el líder, qué configuración rige, qué partición tiene cada nodo), no para miles de escrituras por segundo.</p>`},
 {t:"info", eti:"Cerrojos", h:"Concesiones y tokens de vallado",
  c:`<div class="dg"><div class="dg-tit">por qué un cerrojo con TTL no basta</div>
<div class="dg-vert">
<div class="dg-caja">el proceso 1 obtiene el cerrojo (TTL 10 s) · token 33</div>
<div class="dg-caja aviso">pausa del recolector de basura de 15 s: el cerrojo caduca</div>
<div class="dg-caja">el proceso 2 obtiene el cerrojo · token 34 · escribe</div>
<div class="dg-caja aviso">el proceso 1 despierta, cree que aún tiene el cerrojo y escribe</div>
<div class="dg-caja ok doble">el almacenamiento rechaza el token 33<small>porque ya vio el 34: eso es el vallado (fencing)</small></div>
</div></div>
     <p>Un cerrojo distribuido es una <b>concesión</b> con caducidad. Para eficiencia (evitar trabajo duplicado) basta un <code>SET NX EX</code> en Redis. Para <b>corrección</b> (que nunca escriban dos), hace falta un sistema con consenso (etcd, ZooKeeper) y que el recurso compruebe un token creciente.</p>`},
 {t:"par", p:"Empareja cada concepto con su significado",
  pares:[["Mandato (term)","Número de época que crece en cada elección"],["Mayoría (quórum)","Más de la mitad de los nodos del grupo"],["Token de vallado","Número creciente que el recurso comprueba para rechazar a un poseedor antiguo"],["Cerebro dividido","Dos nodos creen ser líderes a la vez"],["Concesión (lease)","Permiso con caducidad que hay que renovar"]],
  why:"Estos términos aparecen en cualquier conversación seria sobre failover y coordinación."},
 {t:"opcion", p:"¿Cuántos nodos necesita un clúster de etcd para seguir funcionando con dos nodos caídos?",
  ops:["3","4","5","2"],
  ok:2, why:"2f + 1 = 5. Con 5 nodos, 3 siguen siendo mayoría. Más nodos también hacen cada escritura algo más lenta."},
 {t:"vf", p:"Un clúster de 4 nodos Raft tolera más caídas que uno de 3.",
  ok:false, why:"Ambos toleran una: con 4 nodos la mayoría es 3. Por eso se usan números impares."},
 {t:"opcion", p:"Una tarea programada no debe ejecutarse dos veces a la vez en tus 10 réplicas, pero si ocurre alguna vez solo se duplica un correo de resumen. ¿Qué usas?",
  ops:["Un clúster de consenso con tokens de vallado","Un cerrojo sencillo en Redis (SET NX EX) o la elección de líder del orquestador","Nada","Un bloqueo en memoria de cada réplica"],
  ok:1, why:"Ajusta la herramienta al coste del fallo: para evitar trabajo duplicado basta lo sencillo. Para dinero o datos, consenso y vallado."},
 {t:"codigo", p:"Calcula hasta dónde puede confirmar el líder de Raft",
  lenguaje:"py",
  c:`<p>Primera línea: el último índice del registro del líder. Segunda línea: hasta qué índice tiene cada seguidor (separados por espacios). Una entrada está confirmada cuando la tiene una <b>mayoría</b> del clúster (líder incluido). Imprime <code>mayoria: M</code> y <code>confirmado: I</code>, el mayor índice que está en una mayoría.</p>`,
  plantilla:`lider = int(input())
seguidores = list(map(int, input().split()))
# calcula la mayoría y el índice confirmado
`,
  pruebas:[{entrada:"7\n5 7 3 4\n", salida:"mayoria: 3\nconfirmado: 5"},{entrada:"10\n10 2\n", salida:"mayoria: 2\nconfirmado: 10"},{entrada:"9\n1 2 8 3 9 9\n", salida:"mayoria: 4\nconfirmado: 8", oculta:true}],
  pista:"Junta el índice del líder con los de los seguidores, ordénalos de mayor a menor y coge el de la posición mayoria - 1.",
  solucion:`lider = int(input())
seguidores = list(map(int, input().split()))
todos = sorted([lider] + seguidores, reverse=True)
mayoria = len(todos) // 2 + 1
print(f"mayoria: {mayoria}")
print(f"confirmado: {todos[mayoria - 1]}")
`,
  why:"Es la regla de Raft (el líder además solo confirma así entradas de su propio mandato). Fíjate en que un seguidor lento no frena la confirmación mientras haya mayoría."}
]}

]});
