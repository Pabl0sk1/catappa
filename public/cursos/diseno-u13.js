window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Casos clásicos II",
resumen: "Feed de una red social, chat, pagos, sistema de reservas y autocompletado de búsqueda, diseñados paso a paso",
nivel: "Experto",
color: "#bd8040",
lecciones: [

/* =============== U13 L1 =============== */
{
id:"ds7l3",
titulo:"Feed de una red social",
claves:["Fan-out al escribir (precalcular) o al leer (componer), y un híbrido para cuentas famosas","El feed precalculado es una lista corta de ids en caché; los posts se hidratan aparte","Paginación por cursor, contadores aproximados y medios servidos por CDN"],
pasos:[
 {t:"info", eti:"Caso 5", h:"Tres formas de montar el feed",
  c:`<div class="dg"><div class="dg-tit">tres formas de montar el feed</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Fan-out al escribir</div>
<div class="dg-caja">al publicar, insertar el post en el feed precalculado de cada seguidor</div>
<div class="dg-caja ok">+ leer el feed es rapidísimo</div>
<div class="dg-caja aviso">− un famoso con 50M seguidores = 50M escrituras</div></div>
<div class="dg-col"><div class="dg-col-tit">Fan-out al leer</div>
<div class="dg-caja">al abrir el feed, juntar los últimos posts de a quien sigues</div>
<div class="dg-caja ok">+ escribir es barato</div>
<div class="dg-caja aviso">− leer es caro</div></div>
<div class="dg-col"><div class="dg-col-tit">Híbrido</div>
<div class="dg-caja acento">fan-out al escribir para cuentas normales; los posts de famosos se mezclan al leer</div></div>
</div></div>
     <p>Cuentas: 300M de usuarios activos al día que abren el feed 10 veces = 3.000M lecturas/día ≈ 35.000/s de media. Publican 100M posts al día ≈ 1.200/s, con 200 seguidores de media ≈ 240.000 inserciones de fan-out por segundo. Lectura muy dominante: se optimiza la lectura.</p>`},
 {t:"info", eti:"En detalle", h:"Almacenamiento, hidratación y ranking",
  c:`<div class="dg"><div class="dg-tit">servir el feed</div>
<div class="dg-vert">
<div class="dg-caja acento doble">caché del feed por usuario<small>lista de los últimos ~800 ids de posts (Redis)</small></div>
<div class="dg-caja doble">+ posts recientes de los famosos que sigue<small>fan-out al leer</small></div>
<div class="dg-caja doble">ranking<small>por relevancia (modelo) o cronológico</small></div>
<div class="dg-caja doble">hidratar<small>obtener texto, autor y contadores de cada id (cachés de posts y usuarios)</small></div>
<div class="dg-caja ok">página de 20 con cursor; imágenes y vídeos por CDN</div>
</div></div>
     <ul><li>El fan-out es asíncrono: publicar escribe el post y encola «repartir a seguidores»; workers lo hacen por lotes.</li>
     <li>No se precalcula el feed de usuarios inactivos: se construye al volver.</li>
     <li>Contadores de «me gusta» agregados por lotes (o aproximados): no hace falta la cifra exacta al instante.</li></ul>`},
 {t:"par", p:"Empareja cada decisión con su motivo",
  pares:[["Fan-out al escribir","Leer el feed debe ser muy rápido"],["Híbrido para cuentas famosas","Evitar millones de escrituras por publicación"],["Guardar solo ids en la caché del feed","Ocupa poco y los posts se actualizan en un único sitio"],["No precalcular para inactivos","No gastar escrituras en feeds que nadie leerá"],["Cursor en vez de número de página","Estable aunque entren posts nuevos arriba"]],
  why:"Los mismos componentes (cola, caché, pub/sub, base de datos particionada) aparecen en todos los diseños."},
 {t:"opcion", p:"Un usuario con 80M de seguidores publica. Con fan-out al escribir puro, ¿qué pasa?",
  ops:["Nada especial","80M de inserciones en cachés: minutos de retraso y una carga enorme en los workers","El post no se publica","Se duplica"],
  ok:1, why:"Por eso esas cuentas se marcan y sus posts se mezclan al leer: solo quien abre el feed paga el coste, y solo por los famosos que sigue."},
 {t:"vf", p:"En el feed, el número de «me gusta» debe ser exacto y consistente en todo momento.",
  ok:false, why:"Un retraso de segundos o una cifra redondeada («12 mil») es aceptable: permite contadores agregados y cacheados en lugar de un UPDATE por cada toque."},
 {t:"opcion", p:"¿Cómo se borra un post del feed de todos sus seguidores si se guardaron sus ids en millones de cachés?",
  ops:["Recorriendo todas las cachés al momento","Marcar el post como borrado: al hidratar se descarta; las cachés se limpian solas con el tiempo","No se puede","Borrando la caché entera de todos"],
  ok:1, why:"Filtrar al leer es barato; recorrer 50M de listas no. Es la misma idea que las lápidas en las bases de datos."},
 {t:"codigo", p:"Compón el feed mezclando los posts de quienes sigues",
  lenguaje:"py",
  c:`<p>Primera línea: N (posts a mostrar). Siguientes líneas: <code>autor t1 t2 t3…</code> con las marcas de tiempo de sus posts de más reciente a más antigua. Imprime los N posts más recientes como <code>autor@t</code>, de más nuevo a más viejo; en empate de tiempo, primero el autor alfabéticamente menor.</p>`,
  plantilla:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
n = int(lineas[0][0])
posts = []
# junta y ordena
`,
  pruebas:[{entrada:"4\nana 50 30 10\nluis 40 35\neva 20\n", salida:"ana@50\nluis@40\nluis@35\nana@30"},{entrada:"3\nb 9 5\na 9 1\n", salida:"a@9\nb@9\nb@5"},{entrada:"10\nx 3\ny 2\n", salida:"x@3\ny@2", oculta:true}],
  pista:"Crea tuplas (-t, autor) para ordenar por tiempo descendente y autor ascendente. O usa heapq.merge para aprovechar que cada lista ya está ordenada.",
  solucion:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
n = int(lineas[0][0])
posts = []
for autor, *ts in lineas[1:]:
    for t in ts:
        posts.append((-int(t), autor))
posts.sort()
for t, autor in posts[:n]:
    print(f"{autor}@{-t}")
`,
  why:"Con K autores y listas ya ordenadas, una mezcla con montículo (heap) saca los N primeros en O(N log K) sin ordenarlo todo: así se compone el fan-out al leer."}
]},

/* =============== U13 L2 =============== */
{
id:"ds13n1",
titulo:"Chat",
claves:["WebSockets hacia gateways de conexiones; un servicio de chat que guarda y enruta","Mensajes particionados por conversación y ordenados por un número de secuencia de la conversación","Entrega al menos una vez con acuses, deduplicación en el cliente, estados enviado/entregado/leído y sincronización al reconectar"],
pasos:[
 {t:"info", eti:"Caso 6", h:"Arquitectura del chat",
  c:`<div class="dg"><div class="dg-tit">el viaje de un mensaje de chat</div>
<div class="dg-vert">
<div class="dg-caja base doble">cliente<small>por WebSocket</small></div>
<div class="dg-caja doble">gateway de conexiones<small>miles de conexiones por nodo</small></div>
<div class="dg-caja acento doble">servicio de chat<small>asigna número de secuencia en la conversación y guarda</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja ok doble">Cassandra<small>guarda (<code>conversacion_id</code>, <code>seq</code>, <code>mensaje</code>)</small></div><div class="dg-caja doble">pub/sub<small>→ gateway donde está conectado el destinatario</small></div></div></div>
</div>
<div class="dg-pila" style="margin-top:12px">
<div class="dg-caja aviso">destinatario desconectado → notificación push</div>
<div class="dg-caja base">presencia: "en línea" con latidos y TTL en Redis</div>
</div></div>
     <p>Cuentas de un WhatsApp: 2.000M de usuarios, ~100.000M de mensajes al día ≈ 1,2M/s de media. Cada mensaje es pequeño (~100 B), pero guardarlos es ~10 TB al día antes de replicar.</p>`},
 {t:"info", eti:"Entrega", h:"Orden, acuses y sincronización",
  c:`<ul><li><b>Orden</b>: cada mensaje recibe un número de secuencia <b>por conversación</b> (no un reloj global). El cliente ordena por él.</li>
     <li><b>Id del cliente</b>: el emisor genera un id único por mensaje; si reintenta, el servidor lo reconoce y no lo duplica.</li>
     <li><b>Acuses</b>: enviado (el servidor lo guardó), entregado (el dispositivo lo recibió), leído. Un mensaje sin acuse se reenvía: al menos una vez + deduplicación.</li>
     <li><b>Sincronización</b>: al reconectar, el cliente dice «tengo hasta la secuencia 1.041 de esta conversación» y recibe el resto.</li>
     <li><b>Grupos</b>: pequeños → fan-out a cada miembro; enormes (canales) → se parecen más a un feed.</li>
     <li><b>Cifrado de extremo a extremo</b> (protocolo Signal): el servidor solo transporta blobs cifrados; la búsqueda y las copias pasan al cliente.</li></ul>`},
 {t:"par", p:"Empareja cada decisión con su motivo",
  pares:[["WebSockets","Entregar mensajes al instante en ambos sentidos"],["Partición por conversación","Mensajes de una conversación juntos y ordenados"],["Presencia con TTL","Saber quién está en línea sin estado permanente"],["Id generado por el cliente","Que un reintento no duplique el mensaje"],["Secuencia por conversación","Orden correcto sin depender de relojes"]],
  why:"Los relojes de los móviles mienten: el orden lo da el servidor."},
 {t:"opcion", p:"Un usuario abre la app tras 3 días sin conexión. ¿Cómo recibe lo que se perdió?",
  ops:["El servidor le reenvía todo lo del mundo","El cliente envía su última secuencia vista por conversación y el servidor devuelve lo posterior, por páginas","No lo recibe","Solo recibe notificaciones push"],
  ok:1, why:"La sincronización por secuencia es idempotente y reanudable: si se corta a la mitad, se vuelve a pedir desde lo último recibido."},
 {t:"vf", p:"Para ordenar los mensajes de una conversación basta con usar la hora del móvil de quien envía.",
  ok:false, why:"Los relojes de los dispositivos pueden estar adelantados o atrasados minutos u horas. El servidor asigna la secuencia al recibir."},
 {t:"opcion", p:"Un grupo tiene 200.000 miembros. ¿Qué cambia respecto a un chat de 5 personas?",
  ops:["Nada","El fan-out por mensaje es enorme: se trata como un canal, con lectura bajo demanda (fan-out al leer) y sin acuses de lectura individuales","Se prohíbe","Se envía por correo"],
  ok:1, why:"Es el mismo compromiso que el feed de un famoso: pasar de empujar a tirar."},
 {t:"codigo", p:"Entrega mensajes en orden y detecta huecos",
  lenguaje:"py",
  c:`<p>Primera línea: la última secuencia que el cliente ya mostró. Segunda: las secuencias recibidas ahora (desordenadas y quizá repetidas). Imprime <code>mostrar: …</code> con las que se pueden mostrar ya, consecutivas a partir de la siguiente a la última, y <code>pedir: …</code> con las que faltan entre medias hasta la mayor recibida (vacío si no falta ninguna).</p>`,
  plantilla:`ultima = int(input())
recibidas = set(map(int, input().split()))
# decide qué mostrar y qué pedir
`,
  pruebas:[{entrada:"10\n13 11 12 16 11\n", salida:"mostrar: 11 12 13\npedir: 14 15"},{entrada:"5\n6 7\n", salida:"mostrar: 6 7\npedir:"},{entrada:"3\n6 5\n", salida:"mostrar:\npedir: 4", oculta:true},{entrada:"1\n1 2\n", salida:"mostrar: 2\npedir:", oculta:true}],
  pista:"Avanza s = ultima + 1 mientras s esté en recibidas. Después, las que faltan son las de s a max(recibidas) que no están.",
  solucion:`ultima = int(input())
recibidas = set(map(int, input().split()))
mostrar = []
s = ultima + 1
while s in recibidas:
    mostrar.append(s)
    s += 1
maximo = max(recibidas) if recibidas else ultima
pedir = [x for x in range(s, maximo + 1) if x not in recibidas]
print(("mostrar: " + " ".join(map(str, mostrar))).strip())
print(("pedir: " + " ".join(map(str, pedir))).strip())
`,
  why:"Es lo que hace TCP con los segmentos, llevado a la aplicación: los mensajes posteriores al hueco (16) se guardan hasta que llegue lo que falta."}
]},

/* =============== U13 L3 =============== */
{
id:"ds13n2",
titulo:"Pagos",
claves:["Idempotencia de punta a punta: del cliente a tu servicio y de tu servicio a la pasarela","Máquina de estados del pago y un libro mayor de doble entrada inmutable","Estados desconocidos tras un timeout, webhooks y conciliación diaria con la pasarela"],
pasos:[
 {t:"info", eti:"Caso 7", h:"Arquitectura de pagos",
  c:`<div class="dg"><div class="dg-tit">cobrar un pedido</div>
<div class="dg-vert">
<div class="dg-caja base">cliente: «pagar pedido 81» + Idempotency-Key</div>
<div class="dg-caja acento doble">servicio de pagos<small>crea el pago (estado: creado) con la clave; si existe, devuelve el resultado guardado</small></div>
<div class="dg-caja doble">pasarela (Stripe, Adyen…) con su propia clave de idempotencia<small>los datos de tarjeta van del navegador a la pasarela: tú solo ves un token</small></div>
<div class="dg-caja ok doble">respuesta o webhook → estado autorizado / capturado / fallido<small>y asientos en el libro mayor</small></div>
<div class="dg-caja base">evento PagoCapturado (outbox) → pedidos, facturación</div>
</div></div>
     <ul><li><b>Timeout con la pasarela</b>: el pago queda «desconocido», no «fallido». Se consulta a la pasarela o se espera su webhook; reintentar sin la misma clave podría cobrar dos veces.</li>
     <li><b>Conciliación</b>: cada día se cruza tu registro con el informe de la pasarela y del banco. Las diferencias se investigan.</li>
     <li>Importes en <b>enteros</b> (céntimos) o decimales exactos, nunca en coma flotante; siempre con la moneda.</li></ul>`},
 {t:"info", eti:"Contabilidad", h:"Libro mayor de doble entrada",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">un cobro de 50 € con 1,50 € de comisión</div>
<table class="dg-tabla"><thead><tr><th>cuenta</th><th>importe</th></tr></thead><tbody>
<tr><td>cliente (tarjeta)</td><td>−5.000</td></tr>
<tr><td>comercio</td><td>+4.850</td></tr>
<tr><td>comisiones de la plataforma</td><td>+150</td></tr>
<tr><td><b>suma</b></td><td><b>0</b></td></tr>
</tbody></table></div>
     <ul><li>Cada transacción son varios <b>asientos</b> que suman cero: el dinero no se crea ni se destruye.</li>
     <li>Los asientos son <b>inmutables</b> (solo se añaden). Un error se corrige con otra transacción que lo compensa, nunca con UPDATE.</li>
     <li>El saldo de una cuenta es la suma de sus asientos (con saldos materializados para leer rápido).</li>
     <li>Base de datos relacional con transacciones serializables o bloqueos por cuenta: aquí la consistencia fuerte no se negocia.</li></ul>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["El cliente pulsa dos veces «pagar»","Clave de idempotencia por intento de pago"],["Timeout al llamar a la pasarela","Estado desconocido y consultar antes de reintentar"],["Un asiento con el importe mal","Transacción compensatoria, nunca UPDATE"],["Diferencias entre tu registro y el banco","Conciliación diaria automatizada"],["No querer datos de tarjeta en tus servidores","Tokenización con la pasarela"]],
  why:"En pagos, el diseño se juzga por cómo maneja los casos raros, no el camino feliz."},
 {t:"opcion", p:"Tu llamada de captura a la pasarela da timeout. ¿Qué haces?",
  ops:["Marcar el pago como fallido y avisar al cliente","Marcarlo como pendiente de confirmar, consultar su estado a la pasarela (o esperar el webhook) y reintentar solo con la misma clave de idempotencia","Reintentar sin clave","Cobrar otra vez por si acaso"],
  ok:1, why:"Un timeout no dice si el cobro se hizo. Tratarlo como fallo lleva a cobros duplicados o a pedidos no servidos pero cobrados."},
 {t:"vf", p:"Usar <code>double</code> para guardar importes es aceptable si se redondea al mostrar.",
  ok:false, why:"0,1 + 0,2 no es 0,3 en coma flotante; los errores se acumulan en sumas y conciliaciones. Céntimos en enteros o un tipo decimal exacto (BigDecimal, NUMERIC)."},
 {t:"orden", p:"Ordena los estados de un pago con tarjeta que se autoriza, se cobra y luego se devuelve",
  items:["Creado","Autorizado (fondos retenidos)","Capturado (cobrado)","Reembolsado"],
  why:"Autorizar y capturar por separado permite, por ejemplo, retener al reservar un hotel y cobrar al salir. Las transiciones inválidas (reembolsar algo no capturado) se rechazan."},
 {t:"codigo", p:"Aplica un libro mayor de doble entrada",
  lenguaje:"py",
  c:`<p>Cada línea es una transacción: <code>id cuenta:importe cuenta:importe…</code> (importes en céntimos, con signo). Si los importes no suman 0, imprime <code>id rechazada</code> y no la apliques; si suman 0, <code>id aplicada</code>. Al final, imprime los saldos de todas las cuentas con movimientos aplicados, en orden alfabético: <code>cuenta: saldo</code>.</p>`,
  plantilla:`import sys
saldos = {}
for l in sys.stdin.read().split("\\n"):
    p = l.split()
    if not p:
        continue
    tx, asientos = p[0], [a.split(":") for a in p[1:]]
    # valida y aplica
`,
  pruebas:[{entrada:"t1 cliente:-5000 comercio:4850 comisiones:150\nt2 comercio:-1000 banco:900\nt3 comercio:-1000 banco:1000\n", salida:"t1 aplicada\nt2 rechazada\nt3 aplicada\nbanco: 1000\ncliente: -5000\ncomercio: 3850\ncomisiones: 150"},{entrada:"x a:1 b:1\n", salida:"x rechazada"},{entrada:"r1 a:-300 b:300\nr2 b:-300 a:300\n", salida:"r1 aplicada\nr2 aplicada\na: 0\nb: 0", oculta:true}],
  pista:"Suma int(importe) de cada asiento; si es 0, suma cada importe a saldos[cuenta] con saldos.get(cuenta, 0).",
  solucion:`import sys
saldos = {}
for l in sys.stdin.read().split("\\n"):
    p = l.split()
    if not p:
        continue
    tx, asientos = p[0], [a.split(":") for a in p[1:]]
    if sum(int(i) for _, i in asientos) != 0:
        print(f"{tx} rechazada")
        continue
    for cuenta, importe in asientos:
        saldos[cuenta] = saldos.get(cuenta, 0) + int(importe)
    print(f"{tx} aplicada")
for cuenta in sorted(saldos):
    print(f"{cuenta}: {saldos[cuenta]}")
`,
  why:"La invariante «todo suma cero» detecta al instante errores de código. En producción, además, la suma de todos los saldos del sistema es siempre cero."}
]},

/* =============== U13 L4 =============== */
{
id:"ds13n3",
titulo:"Sistema de reservas",
claves:["Retención temporal (hold) con caducidad mientras el usuario paga","Evitar la doble venta con una restricción única o una actualización condicional sobre cada plaza","Ventas masivas: sala de espera virtual, inventario precargado y búsqueda separada de la reserva"],
pasos:[
 {t:"info", eti:"Caso 8", h:"Entradas, hoteles y vuelos",
  c:`<div class="dg"><div class="dg-tit">flujo de reserva de un asiento</div>
<div class="dg-vert">
<div class="dg-caja doble">buscar y ver el plano<small>lectura cacheada; puede ir segundos por detrás</small></div>
<div class="dg-caja acento doble">retener el asiento 10 minutos<small><code>UPDATE asientos SET estado='retenido', usuario=?, caduca=now()+10min WHERE id=? AND (estado='libre' OR caduca &lt; now())</code></small></div>
<div class="dg-caja doble">pagar (con clave de idempotencia)</div>
<div class="dg-caja ok doble">confirmar: retenido → vendido<small>solo si la retención sigue siendo de este usuario</small></div>
<div class="dg-caja base">si caduca sin pagar, el asiento vuelve a estar libre</div>
</div></div>
     <ul><li>La parte de <b>lectura</b> (disponibilidad aproximada) escala con cachés; la de <b>escritura</b> (retener) es fuertemente consistente, fila a fila.</li>
     <li>Alternativa: tabla <code>reservas</code> con <b>restricción única</b> (evento, asiento): la base de datos rechaza la segunda inserción.</li>
     <li>Para plazas sin asignar (100 entradas de pista), un contador con <code>UPDATE … SET libres = libres - 1 WHERE libres &gt; 0</code>, o repartir el inventario en varias filas para evitar una fila caliente.</li></ul>`},
 {t:"info", eti:"Picos", h:"Ventas masivas",
  c:`<div class="dg"><div class="dg-tit">sala de espera virtual</div>
<div class="dg-flujo"><div class="dg-caja base">2M de personas a las 10:00</div><div class="dg-caja acento">cola en la CDN/borde<small>turno aleatorio o por llegada</small></div><div class="dg-caja">se deja pasar a N por minuto<small>token firmado</small></div><div class="dg-caja ok">el sistema de reservas ve una carga que aguanta</div></div></div>
     <ul><li>Admitir a un ritmo que el sistema aguanta es mejor que dejar entrar a todos y que nadie consiga comprar.</li>
     <li>Límites por usuario (como mucho 4 entradas) y detección de bots.</li>
     <li>Hoteles y aerolíneas practican <b>sobreventa</b> deliberada (vender algo más que la capacidad, por las cancelaciones): es una regla de negocio, no un fallo de concurrencia.</li></ul>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Dos personas compran el mismo asiento","Actualización condicional o restricción única por asiento"],["El usuario tarda en pagar y bloquea el asiento","Retención con caducidad"],["Dos millones de personas a la vez a las 10:00","Sala de espera virtual"],["La página de disponibilidad satura la base de datos","Caché de lectura con segundos de retraso"],["Pulsa «pagar» dos veces","Clave de idempotencia en el pago"]],
  why:"La clave es separar lo que puede ser aproximado (ver) de lo que debe ser exacto (reservar)."},
 {t:"opcion", p:"¿Por qué no basta con comprobar «si el asiento está libre, lo reservo» en dos consultas separadas?",
  ops:["Sí basta","Entre la comprobación y la escritura otra petición puede reservarlo: la comprobación y la escritura deben ser una sola operación atómica (UPDATE condicional, restricción única o bloqueo)","Porque es lento","Porque SQL no lo permite"],
  ok:1, why:"Es el clásico «comprobar y luego actuar»: bajo concurrencia, la comprobación ya no es cierta cuando actúas."},
 {t:"vf", p:"El plano de asientos que ve el usuario al buscar debe leerse siempre de la base de datos principal con consistencia fuerte.",
  ok:false, why:"Puede ir segundos por detrás: si el asiento resulta ocupado al retenerlo, se avisa y se elige otro. La consistencia fuerte se aplica en la retención."},
 {t:"opcion", p:"Un concierto vende 50.000 entradas generales (sin asiento) y el contador <code>libres</code> es una única fila que recibe miles de actualizaciones por segundo. ¿Qué haces?",
  ops:["Nada","Repartir el inventario en, por ejemplo, 50 filas de 1.000 y que cada petición intente una al azar (y otra si está vacía)","Quitar la transacción","Leerlo de caché y restar allí"],
  ok:1, why:"Es una clave caliente en escritura; repartirla multiplica el paralelismo sin perder exactitud."},
 {t:"codigo", p:"Gestiona retenciones con caducidad",
  lenguaje:"py",
  c:`<p>Primera línea: duración de la retención en minutos. Después, órdenes <code>hold usuario asiento t</code> y <code>pay usuario asiento t</code> (t en minutos, creciente).</p>
<ul><li><code>hold</code>: si el asiento está libre, o retenido con la retención caducada (t ≥ caducidad), queda retenido por ese usuario hasta t + duración: <code>ok</code>. Si no (retenido vigente o vendido): <code>ocupado</code>.</li>
<li><code>pay</code>: si ese usuario tiene la retención vigente (t &lt; caducidad), pasa a vendido: <code>vendido</code>. Si no: <code>rechazado</code>.</li></ul>
<p>Imprime el resultado de cada orden.</p>`,
  plantilla:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
duracion = int(lineas[0][0])
asientos = {}  # asiento -> (estado, usuario, caduca)
for orden, usuario, asiento, t in lineas[1:]:
    t = int(t)
    # procesa hold y pay
`,
  pruebas:[{entrada:"10\nhold ana A1 0\nhold luis A1 5\npay ana A1 8\nhold luis A1 9\n", salida:"ok\nocupado\nvendido\nocupado"},{entrada:"10\nhold ana A1 0\nhold luis A1 10\npay ana A1 11\npay luis A1 12\n", salida:"ok\nok\nrechazado\nvendido"},{entrada:"5\npay eva B2 0\nhold eva B2 1\npay eva B2 6\nhold max B2 6\n", salida:"rechazado\nok\nrechazado\nok", oculta:true}],
  pista:"Guarda (estado, usuario, caduca). En hold, un retenido con t &gt;= caduca cuenta como libre. En pay, exige estado retenido, mismo usuario y t &lt; caduca.",
  solucion:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
duracion = int(lineas[0][0])
asientos = {}  # asiento -> (estado, usuario, caduca)
for orden, usuario, asiento, t in lineas[1:]:
    t = int(t)
    estado, dueno, caduca = asientos.get(asiento, ("libre", None, 0))
    if orden == "hold":
        if estado == "libre" or (estado == "retenido" and t >= caduca):
            asientos[asiento] = ("retenido", usuario, t + duracion)
            print("ok")
        else:
            print("ocupado")
    else:
        if estado == "retenido" and dueno == usuario and t < caduca:
            asientos[asiento] = ("vendido", usuario, 0)
            print("vendido")
        else:
            print("rechazado")
`,
  why:"Fíjate en que la caducidad se evalúa al consultar: no hace falta un proceso que «libere» asientos a la hora exacta (aunque suele haber uno que limpia en segundo plano)."}
]},

/* =============== U13 L5 =============== */
{
id:"ds13n4",
titulo:"Autocompletado y buscador",
claves:["Autocompletado: un trie (o índice por prefijos) con los mejores resultados precalculados en cada prefijo","Una tubería agrega las búsquedas reales y reconstruye el índice cada cierto tiempo","Servir desde memoria, repartir por prefijos, cachear en el navegador y la CDN, y esperar a que el usuario pare de teclear"],
pasos:[
 {t:"info", eti:"Caso 9", h:"Autocompletado de búsquedas",
  c:`<ul><li><b>Requisitos</b>: sugerir las 5 búsquedas más populares que empiezan por lo tecleado, en menos de 100 ms, para cientos de millones de usuarios. Cada pulsación es una petición: decenas o cientos de miles por segundo.</li></ul>
     <div class="dg"><div class="dg-tit">dos caminos</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Recoger (lento, por lotes)</div><div class="dg-vert"><div class="dg-caja">registros de búsquedas → Kafka</div><div class="dg-caja">agregación por consulta y semana</div><div class="dg-caja">construir el trie con top-k por prefijo</div><div class="dg-caja ok">publicar una versión nueva</div></div></div>
<div class="dg-col"><div class="dg-col-tit">Servir (rápido)</div><div class="dg-vert"><div class="dg-caja base">«zapa» (tras 150 ms sin teclear)</div><div class="dg-caja">caché del navegador y CDN</div><div class="dg-caja acento">servidores con el trie en memoria, repartidos por prefijo</div><div class="dg-caja ok">top 5 precalculado: O(longitud del prefijo)</div></div></div>
</div></div>`},
 {t:"info", eti:"Más allá", h:"Del autocompletado al buscador",
  c:`<ul><li>Guardar el <b>top-k en cada nodo</b> del trie ocupa más memoria, pero evita recorrer el subárbol en cada pulsación.</li>
     <li>Tendencias en tiempo real: una capa de streaming que suma búsquedas recientes y se mezcla con el índice semanal.</li>
     <li>Filtrar sugerencias ofensivas o peligrosas antes de publicar el índice.</li>
     <li><b>Buscador de productos completo</b>: índice invertido (OpenSearch) alimentado por CDC, consulta de texto + filtros facetados (marca, precio, talla), ranking en dos fases (recuperar ~1.000 candidatos baratos y reordenarlos con un modelo), y registrar clics para mejorar la relevancia.</li>
     <li>Corrección ortográfica y sinónimos en el analizador («zapatilla» ≈ «deportiva»).</li></ul>`},
 {t:"par", p:"Empareja cada técnica con su propósito",
  pares:[["Top-k en cada nodo del trie","Responder sin recorrer todo el subárbol"],["Esperar 150 ms sin teclear (debounce)","No enviar una petición por cada letra"],["Cachear respuestas por prefijo en la CDN","Los prefijos cortos se repiten muchísimo entre usuarios"],["Reconstruir el índice por lotes","Separar la escritura pesada del servicio de lectura"],["Ranking en dos fases","Recuperar muchos candidatos barato y ordenar pocos con un modelo caro"]],
  why:"El truco del caso es separar el camino de recogida (lento, por lotes) del de servicio (en memoria, microsegundos)."},
 {t:"opcion", p:"¿Por qué no se actualiza el trie en vivo con cada búsqueda que llega?",
  ops:["Porque no se puede","Sería muchísima escritura concurrente sobre una estructura que se lee cientos de miles de veces por segundo; se reconstruye por lotes y se sustituye entera","Porque los tries no admiten cambios","Por seguridad"],
  ok:1, why:"Para las tendencias recientes se añade una capa aparte y pequeña, en lugar de tocar el índice principal."},
 {t:"vf", p:"Los prefijos de una o dos letras son los que más se benefician de la caché.",
  ok:true, why:"Hay muy pocos posibles y los piden todos los usuarios: su respuesta cambia poco y se puede cachear en la CDN con un TTL de minutos."},
 {t:"opcion", p:"El trie completo ya no cabe en la memoria de un servidor. ¿Cómo lo repartes?",
  ops:["Por usuario","Por prefijo (a–f, g–m…), ajustando los rangos a la carga real porque no todas las letras son igual de frecuentes","Al azar","No se puede repartir"],
  ok:1, why:"Un reparto ingenuo por primera letra dejaría la «s» o la «c» sobrecargadas. Se calculan los rangos a partir de la distribución de consultas."},
 {t:"codigo", p:"Sugiere las búsquedas más populares para un prefijo",
  lenguaje:"py",
  c:`<p>Primera línea: número de búsquedas N. Siguientes N líneas: <code>consulta frecuencia</code>. Después, prefijos (uno por línea). Para cada prefijo imprime <code>prefijo: s1, s2, s3</code> con como mucho 3 sugerencias que empiecen por él, ordenadas por frecuencia descendente y, en empate, alfabéticamente; o <code>prefijo: -</code> si no hay ninguna.</p>`,
  plantilla:`import sys
lineas = sys.stdin.read().split("\\n")
n = int(lineas[0])
busquedas = [l.split() for l in lineas[1:n + 1]]
prefijos = [l.strip() for l in lineas[n + 1:] if l.strip()]
# sugiere
`,
  pruebas:[{entrada:"5\nzapatillas 90\nzapatos 70\nzara 120\nzanahoria 10\nzapatillas-running 70\nzap\nza\nzu\n", salida:"zap: zapatillas, zapatillas-running, zapatos\nza: zara, zapatillas, zapatillas-running\nzu: -"},{entrada:"2\nhola 1\nhoy 1\nho\n", salida:"ho: hola, hoy"},{entrada:"3\nred 5\nredes 9\nredis 9\nred\nredi\n", salida:"red: redes, redis, red\nredi: redis", oculta:true}],
  pista:"Filtra con startswith(prefijo) y ordena con key=lambda b: (-frecuencia, consulta). Coge los 3 primeros.",
  solucion:`import sys
lineas = sys.stdin.read().split("\\n")
n = int(lineas[0])
busquedas = [l.split() for l in lineas[1:n + 1]]
prefijos = [l.strip() for l in lineas[n + 1:] if l.strip()]
for p in prefijos:
    cand = sorted((b for b in busquedas if b[0].startswith(p)), key=lambda b: (-int(b[1]), b[0]))[:3]
    print(f"{p}: " + (", ".join(b[0] for b in cand) if cand else "-"))
`,
  why:"Esta versión recorre todas las búsquedas en cada prefijo; el trie con el top-k guardado en cada nodo convierte esa consulta en un simple recorrido de tantos pasos como letras tenga el prefijo."}
]}

]});
