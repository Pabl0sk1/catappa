window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Datos distribuidos",
resumen: "Replicación líder-seguidor, multilíder y sin líder, retraso de réplicas, particionado por rango y por hash, claves calientes y hashing consistente",
nivel: "Intermedio",
color: "#d99c5d",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"ds4l2",
titulo:"Replicación",
claves:["Réplicas: copias para leer más y sobrevivir a fallos; el retraso de replicación es inevitable si es asíncrona","Síncrona: no pierde datos pero añade latencia; asíncrona: rápida pero un failover puede perder lo último","Leer tus propias escrituras y lecturas monótonas se garantizan enrutando bien las lecturas"],
pasos:[
 {t:"info", eti:"Copias", h:"Líder y seguidores",
  c:`<div class="dg"><div class="dg-tit">replicación líder-seguidor</div>
<div class="dg-vert">
<div class="dg-caja base">aplicación</div>
<div class="dg-caja acento doble">primaria (líder)<small>todas las escrituras · envía su WAL a las réplicas</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja ok doble">réplica 1<small>síncrona: confirma antes del commit</small></div><div class="dg-caja doble">réplica 2<small>asíncrona: va unos ms o s por detrás</small></div><div class="dg-caja doble">réplica 3<small>asíncrona, en otra región</small></div></div></div>
</div></div>
     <ul><li><b>Síncrona</b>: el commit espera a la réplica. Cero pérdida si cae el líder, pero cada escritura paga la ida y vuelta y, si la réplica cae, las escrituras se bloquean.</li>
     <li><b>Asíncrona</b>: el commit no espera. Rápida, pero si el líder muere, lo que no llegó a replicarse se pierde.</li>
     <li><b>Semisíncrona</b> (lo habitual): una réplica síncrona y el resto asíncronas.</li></ul>`},
 {t:"info", eti:"El retraso", h:"Leer de réplicas sin sorpresas",
  c:`<div class="dg"><div class="dg-tit">el usuario no ve su propio cambio</div>
<div class="dg-flujo"><div class="dg-caja">cambia su nombre<small>escribe en la primaria</small></div><div class="dg-caja">recarga la página<small>lee de una réplica con 2 s de retraso</small></div><div class="dg-caja aviso">ve el nombre viejo</div></div></div>
     <ul><li><b>Leer tus propias escrituras</b>: durante unos segundos tras escribir, ese usuario lee de la primaria; o se guarda la posición del WAL de su última escritura y solo se lee de réplicas que ya la alcanzaron.</li>
     <li><b>Lecturas monótonas</b>: que el usuario no «viaje atrás en el tiempo» al saltar entre réplicas con distinto retraso: fijar cada usuario a una réplica.</li>
     <li><b>Failover</b>: promover una réplica cuando cae el líder. Riesgos: perder escrituras asíncronas y el <b>cerebro dividido</b> (dos líderes a la vez). Se evita con consenso y vallado (fencing), que verás más adelante.</li></ul>
     <p>Más allá del líder único: <b>multilíder</b> (un líder por región, con conflictos que resolver: último que escribe gana, CRDTs) y <b>sin líder</b> (estilo Dynamo/Cassandra: se escribe en varias réplicas y se usan quórums).</p>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Réplica de lectura","Repartir lecturas y tener una copia lista"],["Réplica síncrona","No perder escrituras confirmadas si cae el líder"],["Réplica en otra región","Sobrevivir a la pérdida de una región entera"],["Leer de la primaria tras escribir","Que el usuario vea sus propios cambios"],["Fijar el usuario a una réplica","Lecturas monótonas: no ver datos más viejos que antes"]],
  why:"Las réplicas escalan lecturas, no escrituras: todas las escrituras siguen pasando por el líder."},
 {t:"opcion", p:"La primaria cae y se promueve una réplica asíncrona que iba 3 segundos por detrás. ¿Qué pasa con esos 3 segundos de escrituras?",
  ops:["Se recuperan solas","Se pierden (o quedan en conflicto si la vieja primaria vuelve): es el precio de la replicación asíncrona","Se duplican","La réplica las inventa"],
  ok:1, why:"Ese hueco es el RPO real de la replicación asíncrona. Si no es aceptable (pagos), una réplica síncrona o un sistema con consenso."},
 {t:"vf", p:"Añadir réplicas de lectura aumenta la capacidad de escritura de la base de datos.",
  ok:false, why:"Al contrario: cada escritura hay que aplicarla también en cada réplica. Para escribir más hay que particionar."},
 {t:"opcion", p:"Un sistema multilíder con un líder en Europa y otro en EE. UU. recibe dos cambios del mismo perfil a la vez. ¿Qué hay que decidir?",
  ops:["Nada, no puede pasar","Cómo resolver el conflicto: último que escribe gana (perdiendo uno), fusionar campos, o estructuras que fusionan solas (CRDT)","Apagar un líder","Duplicar el perfil"],
  ok:1, why:"Multilíder da escrituras locales rápidas en cada región a cambio de conflictos. Por eso se reserva para casos que lo necesitan de verdad (edición colaborativa, apps sin conexión)."},
 {t:"codigo", p:"Enruta las lecturas para leer tus propias escrituras",
  lenguaje:"py",
  c:`<p>Primera línea: segundos durante los que, tras escribir, un usuario debe leer de la primaria. Después, eventos <code>w usuario t</code> (escritura en el segundo t) y <code>r usuario t</code> (lectura). Para cada lectura imprime <code>primaria</code> si el usuario escribió hace menos de esos segundos (t − última &lt; ventana) y <code>replica</code> si no.</p>`,
  plantilla:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
ventana = int(lineas[0][0])
ultima = {}
for tipo, usuario, t in lineas[1:]:
    t = int(t)
    # registra escrituras y decide cada lectura
`,
  pruebas:[{entrada:"5\nw ana 10\nr ana 12\nr ana 15\nr luis 12\n", salida:"primaria\nreplica\nreplica"},{entrada:"3\nr eva 1\nw eva 2\nr eva 4\nw eva 9\nr eva 10\n", salida:"replica\nprimaria\nprimaria"},{entrada:"10\nw a 0\nw b 5\nr a 9\nr b 14\nr a 10\nr b 16\n", salida:"primaria\nprimaria\nreplica\nreplica", oculta:true}],
  pista:"Guarda en ultima[usuario] el t de su última escritura. En cada lectura, compara t - ultima[usuario] con la ventana (si el usuario no ha escrito nunca, réplica).",
  solucion:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
ventana = int(lineas[0][0])
ultima = {}
for tipo, usuario, t in lineas[1:]:
    t = int(t)
    if tipo == "w":
        ultima[usuario] = t
    elif usuario in ultima and t - ultima[usuario] < ventana:
        print("primaria")
    else:
        print("replica")
`,
  why:"La ventana debe ser mayor que el retraso típico de las réplicas. Es simple y efectivo; la versión precisa compara posiciones del WAL."}
]},

/* =============== U5 L2 =============== */
{
id:"ds5n1",
titulo:"Particionado y sharding",
claves:["Particionado (sharding): repartir los datos y las escrituras entre varios nodos por una clave","Por rango (consultas por intervalos, riesgo de puntos calientes) o por hash (reparto uniforme, sin rangos)","Índices secundarios locales (consulta a todos) o globales (escritura más cara)"],
pasos:[
 {t:"info", eti:"Repartir", h:"Sharding",
  c:`<div class="dg"><div class="dg-tit">repartir por hash entre shards</div>
<div class="dg-vert">
<div class="dg-caja acento doble">clave de partición: usuario_id<small><code>shard = hash(usuario_id) mod 4</code></small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-pila"><div class="dg-fila"><div class="dg-caja doble">shard 0<small>usuarios…</small></div><div class="dg-caja doble">shard 1<small>…</small></div></div><div class="dg-fila"><div class="dg-caja doble">shard 2<small>…</small></div><div class="dg-caja doble">shard 3<small>…</small></div></div></div></div>
</div>
<div class="dg-cols" style="margin-top:12px">
<div class="dg-col"><div class="dg-caja aviso doble">problema<small>pasar de 4 a 5 shards cambia casi todos los «mod» → mover casi todo</small></div></div>
<div class="dg-col"><div class="dg-caja ok doble">soluciones<small>hashing consistente, o muchas particiones fijas (p. ej. 1.024) que se reparten entre los nodos y se mueven enteras</small></div></div>
</div></div>
     <p>Elegir la <b>clave de partición</b> es crucial: debe repartir bien la carga y hacer que las consultas habituales toquen un solo shard. Particionar por país con la mitad de usuarios en uno crea un shard caliente.</p>`},
 {t:"info", eti:"Decisiones", h:"Rango, hash, claves calientes e índices",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">por rango o por hash</div>
<table class="dg-tabla"><thead><tr><th></th><th>por rango</th><th>por hash</th></tr></thead><tbody>
<tr><td>reparto</td><td>depende de los datos</td><td>uniforme</td></tr>
<tr><td>consultas por intervalo</td><td>baratas (un shard o pocos)</td><td>van a todos los shards</td></tr>
<tr><td>riesgo</td><td>claves con fecha: todo lo nuevo va al último shard</td><td>perder el orden</td></tr>
<tr><td>ejemplos</td><td>HBase, Bigtable, MongoDB por rango</td><td>Cassandra, DynamoDB</td></tr>
</tbody></table></div>
     <ul><li><b>Clave caliente</b>: un famoso con millones de interacciones en una sola partición. Se «sala» la clave: <code>post:99#0</code> … <code>post:99#9</code> reparte las escrituras en diez particiones y la lectura las junta.</li>
     <li><b>Índice secundario local</b>: cada shard indexa sus datos; buscar por otro campo pregunta a todos (<i>scatter-gather</i>).</li>
     <li><b>Índice secundario global</b>: particionado por el campo indexado; la lectura va a un sitio, pero cada escritura toca otro shard (y suele actualizarse de forma asíncrona).</li>
     <li>Lo que se complica: uniones y transacciones entre shards, unicidad global, rebalancear.</li></ul>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Sharding","Repartir datos y escrituras entre varias bases"],["Clave de partición","Decide en qué shard vive cada dato"],["Shard caliente","Un shard que recibe mucha más carga que el resto"],["Salar la clave","Repartir una clave muy activa entre varias particiones"],["Scatter-gather","Preguntar a todos los shards y juntar las respuestas"]],
  why:"Particionar añade complejidad (consultas entre shards, transacciones): se hace cuando hace falta."},
 {t:"opcion", p:"Particionas pedidos por <code>cliente_id</code>. ¿Qué consulta se vuelve cara?",
  ops:["Los pedidos de un cliente","Los pedidos de todos los clientes de un día concreto (hay que preguntar a todos los shards)","Crear un pedido","Borrar un pedido de un cliente"],
  ok:1, why:"Por eso los informes globales suelen ir a un almacén analítico aparte."},
 {t:"opcion", p:"Una tabla de eventos se particiona por rango de <code>fecha_creacion</code>. ¿Qué problema aparece?",
  ops:["Ninguno","Todas las escrituras nuevas van al shard de «hoy»: un punto caliente mientras los demás están ociosos","Las consultas por fecha van a todos los shards","No se puede borrar lo viejo"],
  ok:1, why:"Solución habitual: clave compuesta (hash de algo + fecha), de modo que las escrituras se reparten y dentro de cada partición se conserva el orden temporal."},
 {t:"vf", p:"Con muchas particiones fijas (por ejemplo 1.024 para 8 nodos), añadir un nodo consiste en moverle algunas particiones enteras sin recalcular dónde va cada clave.",
  ok:true, why:"Es lo que hacen Elasticsearch, Kafka o Redis Cluster (16.384 slots). El número de particiones se elige alto desde el principio, porque cambiarlo después es caro."},
 {t:"codigo", p:"Cuenta cuántas claves cambian de shard al pasar de N a M con hash módulo",
  lenguaje:"py",
  c:`<p>Lee tres enteros en una línea: <code>total N M</code>. Las claves son los enteros de 0 a total−1 y su hash es la propia clave. Imprime cuántas cambian de shard (<code>k % N != k % M</code>) y el porcentaje con un decimal: <code>movidas: 80 (80.0%)</code>.</p>`,
  plantilla:`total, n, m = map(int, input().split())
# cuenta las claves que cambian de shard
`,
  pruebas:[{entrada:"100 4 5\n", salida:"movidas: 80 (80.0%)"},{entrada:"1000 10 11\n", salida:"movidas: 900 (90.0%)"},{entrada:"1000 4 8\n", salida:"movidas: 500 (50.0%)", oculta:true}],
  pista:"sum(1 for k in range(total) if k % n != k % m)",
  solucion:`total, n, m = map(int, input().split())
movidas = sum(1 for k in range(total) if k % n != k % m)
print(f"movidas: {movidas} ({movidas * 100 / total:.1f}%)")
`,
  why:"Con hash módulo, añadir un nodo mueve casi todo. Con hashing consistente se movería solo ~1/M (un 20% al pasar a 5 nodos, un 9% al pasar a 11). Duplicar (4 → 8) mueve la mitad: por eso algunos sistemas solo crecen duplicando."}
]},

/* =============== U5 L3 =============== */
{
id:"ds5n2",
titulo:"Hashing consistente",
claves:["Nodos y claves en un anillo: cada clave va al primer nodo en el sentido de las agujas del reloj","Al añadir o quitar un nodo solo se mueven las claves de su tramo (~1/N)","Nodos virtuales para repartir mejor y réplicas en los siguientes nodos del anillo"],
pasos:[
 {t:"info", eti:"El anillo", h:"Cómo funciona",
  c:`<div class="dg"><div class="dg-tit">anillo de hashing consistente</div>
<svg viewBox="0 0 320 250" width="100%" style="max-width:420px;display:block;margin:auto" role="img" aria-label="Anillo con tres nodos A, B y C y dos claves que van al siguiente nodo en sentido horario">
<defs><marker id="fl-diseno5-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
<circle cx="160" cy="125" r="90" fill="none" stroke="var(--line-2)" stroke-width="3"/>
<circle cx="160" cy="35" r="16" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="160" y="40" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">A</text>
<circle cx="238" cy="170" r="16" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="238" y="175" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">B</text>
<circle cx="82" cy="170" r="16" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="82" y="175" text-anchor="middle" font-size="14" font-family="var(--mono)" fill="var(--ink)">C</text>
<circle cx="238" cy="80" r="7" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="2"/><text x="258" y="72" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">k1</text>
<path d="M246,92 Q262,128 250,154" fill="none" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-diseno5-1)"/>
<circle cx="160" cy="215" r="7" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="2"/><text x="160" y="240" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-2)">k2</text>
<path d="M148,213 Q112,205 96,184" fill="none" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-diseno5-1)"/>
<text x="160" y="130" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-3)">sentido horario</text>
</svg></div>
     <p>Se aplica un hash a cada nodo y a cada clave para situarlos en un anillo (por ejemplo, de 0 a 2^32). Cada clave pertenece al <b>primer nodo que encuentra avanzando</b> en el sentido de las agujas del reloj: k1 va a B y k2 va a C.</p>
     <p>Si se añade un nodo D entre A y B, solo las claves de ese tramo pasan de B a D. El resto no se mueve. Con N nodos, añadir uno mueve ~1/N de las claves en vez de casi todas.</p>`},
 {t:"info", eti:"Mejoras", h:"Nodos virtuales y réplicas",
  c:`<ul><li>Con pocos nodos, los tramos salen muy desiguales. Con <b>nodos virtuales</b>, cada nodo físico aparece en el anillo 100–256 veces: los tramos se igualan y, cuando un nodo cae, su carga se reparte entre <i>todos</i> los demás, no solo en su vecino.</li>
     <li>Los nodos virtuales también permiten dar más peso a las máquinas grandes (más posiciones).</li>
     <li><b>Réplicas</b>: la clave se guarda en el primer nodo y en los N−1 siguientes nodos físicos distintos del anillo (así lo hacen Dynamo y Cassandra).</li>
     <li>Alternativas: <b>rendezvous hashing</b> (cada clave elige el nodo con mayor hash(clave, nodo)) y <b>jump consistent hash</b> (sin memoria, para nodos numerados).</li></ul>`},
 {t:"par", p:"Empareja cada idea con lo que resuelve",
  pares:[["Anillo de hash","Mover pocas claves al cambiar el número de nodos"],["Nodos virtuales","Tramos iguales y carga repartida cuando cae un nodo"],["Réplicas en los siguientes nodos","Que cada clave viva en varios nodos distintos"],["Más posiciones para un nodo","Dar más carga a una máquina más grande"]],
  why:"Se usa en cachés distribuidas (Memcached en el cliente), bases como Cassandra y DynamoDB, y balanceadores con afinidad."},
 {t:"opcion", p:"Un anillo tiene 10 nodos con nodos virtuales y añades uno más. ¿Qué fracción de claves se mueve, aproximadamente?",
  ops:["Todas","~1/11 (unas 9 de cada 100)","La mitad","Ninguna"],
  ok:1, why:"El nodo nuevo se queda con su parte justa, 1/11, y la roba un poco de cada uno de los demás."},
 {t:"vf", p:"Sin nodos virtuales, cuando cae un nodo toda su carga pasa al siguiente nodo del anillo.",
  ok:true, why:"Ese vecino puede saturarse y caer también: fallo en cascada. Con nodos virtuales, la carga se reparte entre muchos."},
 {t:"opcion", p:"¿Por qué Redis Cluster usa 16.384 slots fijos en vez de un anillo?",
  ops:["Porque es más antiguo","Es otra forma de lograr lo mismo: la clave va a un slot fijo (CRC16 mod 16384) y lo que se mueve entre nodos son slots enteros","Porque no escala","Porque no replica"],
  ok:1, why:"Particiones fijas y hashing consistente resuelven el mismo problema: no recolocar todas las claves al cambiar el número de nodos."},
 {t:"codigo", p:"Asigna claves a nodos en un anillo de hashing consistente",
  lenguaje:"js",
  c:`<p>Primera línea: nodos con su posición en el anillo (<code>A:100 B:400 C:700</code>). Segunda línea: claves con su posición (<code>k1:250 k2:800</code>). El anillo va de 0 a 999. Cada clave va al primer nodo con posición <b>mayor o igual</b> que la suya; si no hay ninguno, da la vuelta al nodo de menor posición. Imprime <code>clave nodo</code> en el orden de entrada.</p>`,
  plantilla:`const [l1, l2] = require("fs").readFileSync(0, "utf8").trim().split("\\n");
const nodos = l1.trim().split(/\\s+/).map(x => { const [n, p] = x.split(":"); return { n, p: Number(p) }; });
const claves = l2.trim().split(/\\s+/).map(x => { const [k, p] = x.split(":"); return { k, p: Number(p) }; });
// asigna cada clave
`,
  pruebas:[{entrada:"A:100 B:400 C:700\nk1:250 k2:800 k3:400\n", salida:"k1 B\nk2 A\nk3 B"},{entrada:"X:500 Y:10\na:0 b:11 c:501\n", salida:"a Y\nb X\nc Y"},{entrada:"N1:900 N2:300 N3:600 N4:50\nq:40 r:299 s:601 t:950 u:900\n", salida:"q N4\nr N2\ns N1\nt N4\nu N1", oculta:true}],
  pista:"Ordena los nodos por posición. Para cada clave, busca el primero con p >= clave.p; si no existe, usa nodos[0].",
  solucion:`const [l1, l2] = require("fs").readFileSync(0, "utf8").trim().split("\\n");
const nodos = l1.trim().split(/\\s+/).map(x => { const [n, p] = x.split(":"); return { n, p: Number(p) }; });
const claves = l2.trim().split(/\\s+/).map(x => { const [k, p] = x.split(":"); return { k, p: Number(p) }; });
nodos.sort((a, b) => a.p - b.p);
const salida = [];
for (const c of claves) {
  const nodo = nodos.find(x => x.p >= c.p) || nodos[0];
  salida.push(c.k + " " + nodo.n);
}
console.log(salida.join("\\n"));
`,
  why:"En producción, la búsqueda del siguiente nodo es una búsqueda binaria sobre las posiciones ordenadas: O(log n) por clave."}
]}

]});
