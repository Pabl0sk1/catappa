window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Consumidores y grupos",
resumen: "Repartir el trabajo, guardar la posición, rebalanceos y cómo consumir en paralelo de verdad",
nivel: "Intermedio",
color: "#8592a8",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"kf2l2",
titulo:"Consumidores y grupos",
claves:["Los consumidores de un grupo se reparten las particiones: cada partición, un consumidor","Más consumidores que particiones = consumidores ociosos","Rebalanceo al entrar o salir consumidores; el lag mide cuánto van por detrás"],
pasos:[
 {t:"info", eti:"Leer en paralelo", h:"Grupos de consumidores",
  c:`<div class="dg">
       <div class="dg-tit">topic pedidos: 6 particiones, dos grupos distintos</div>
       <div class="dg-cols">
         <div class="dg-col">
           <div class="dg-col-tit">grupo «facturación» (3 instancias)</div>
           <div class="dg-pila">
             <div class="dg-caja acento">instancia A → p0, p1</div>
             <div class="dg-caja acento">instancia B → p2, p3</div>
             <div class="dg-caja acento">instancia C → p4, p5</div>
           </div>
         </div>
         <div class="dg-col">
           <div class="dg-col-tit">grupo «logística» (2 instancias)</div>
           <div class="dg-pila">
             <div class="dg-caja ok">instancia X → p0, p1, p2</div>
             <div class="dg-caja ok">instancia Y → p3, p4, p5</div>
           </div>
         </div>
       </div>
       <div class="dg-nota">cada grupo recibe TODOS los eventos; dentro del grupo se reparten</div>
     </div>
     <div class="termbox">@KafkaListener(topics = "pedidos", groupId = "facturacion", concurrency = "3")
void alPagar(PedidoPagado e) { facturas.emitir(e.pedidoId()); }

kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group facturacion
# PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
#     0          18230           18232          2</div>`},
 {t:"par", p:"Empareja cada situación con lo que ocurre",
  pares:[["6 particiones y 3 consumidores en un grupo","Cada consumidor lee 2 particiones"],["6 particiones y 8 consumidores en un grupo","2 consumidores quedan sin trabajo"],["Dos grupos distintos en el mismo topic","Cada grupo recibe todos los eventos"],["Un consumidor se cae","Rebalanceo: sus particiones pasan a otros"],["Lag que crece sin parar","Los consumidores no dan abasto"]],
  why:"El número de particiones marca el paralelismo máximo de un grupo."},
 {t:"opcion", p:"El lag del grupo «facturación» no para de crecer. ¿Qué harías?",
  ops:["Borrar el topic","Escalar consumidores (hasta el número de particiones), optimizar el procesado o aumentar particiones si ya están todas ocupadas","Reducir la retención","Cambiar acks"],
  ok:1, why:"El lag es la métrica más importante de un consumidor: alerta sobre ella."},
 {t:"vf", p:"Añadir un consumidor más siempre aumenta el rendimiento del grupo.",
  ok:false, why:"Solo hasta el número de particiones. A partir de ahí, los consumidores de más se quedan sentados sin nada asignado."},
 {t:"opcion", p:"Quieres que dos equipos procesen los mismos eventos de forma independiente. ¿Qué haces?",
  ops:["Duplicar el topic","Dos grupos distintos sobre el mismo topic: cada uno con su propia posición","Dos particiones","Copiar los mensajes"],
  ok:1, why:"Y si mañana entra un tercer equipo, se suscribe sin tocar nada de lo existente."},
 {t:"escribe", p:"Si un topic tiene 4 particiones y el grupo tiene 6 consumidores, ¿cuántos se quedan sin trabajo? (escribe el número)",
  sol:["2"],
  pista:"Cada partición se asigna como mucho a un consumidor del grupo.",
  why:"Por eso el número de particiones se elige pensando en cuánto paralelismo vas a necesitar."}
]},

/* =============== U3 L2 =============== */
{
id:"kf2l3",
titulo:"Offsets y commits",
claves:["El consumidor guarda (commit) hasta dónde ha procesado en cada partición","Commit después de procesar: al menos una vez (posibles duplicados)","Commit antes de procesar: como mucho una vez (posibles pérdidas)"],
pasos:[
 {t:"info", eti:"Dónde me quedé", h:"Commits",
  c:`<div class="dg">
       <div class="dg-pila">
         <div class="dg-caja ok doble">procesar y DESPUÉS confirmar<small>si se cae en medio, reprocesa: al menos una vez</small></div>
         <div class="dg-caja aviso doble">confirmar y DESPUÉS procesar<small>si se cae en medio, se pierde: como mucho una vez</small></div>
         <div class="dg-caja acento doble">transacciones + consumidor idempotente<small>efectivamente una vez</small></div>
       </div>
     </div>
     <p>Spring Kafka hace commit tras procesar correctamente cada lote (o registro) por defecto. Por eso los consumidores deben ser <b>idempotentes</b>: recibir dos veces el mismo evento no debe duplicar efectos.</p>`},
 {t:"orden", p:"Ordena el procesamiento «al menos una vez» de un evento",
  items:["El consumidor recibe un lote de eventos","Procesa cada evento (con lógica idempotente)","Hace commit de los offsets procesados","Pide el siguiente lote"],
  why:"Si cae antes del commit, al volver reprocesa: por eso la idempotencia."},
 {t:"opcion", p:"¿Cómo harías idempotente un consumidor que crea facturas?",
  ops:["No se puede","Guardar el id del evento (o del pedido) con una restricción única y saltar los ya procesados","Procesar más rápido","Usar acks=0"],
  ok:1, why:"La base de datos garantiza que el segundo intento no crea una factura duplicada."},
 {t:"vf", p:"Con commit tras procesar, un evento nunca se procesa dos veces.",
  ok:false, why:"Si el consumidor cae tras procesar y antes del commit, lo recibirá otra vez."},
 {t:"info", eti:"Automático o a mano", h:"enable.auto.commit",
  c:`<div class="termbox">enable.auto.commit=true      # confirma cada auto.commit.interval.ms (5 s por defecto)
enable.auto.commit=false     # lo confirmas tu, cuando sabes que esta procesado</div>
     <p>El commit automático es cómodo y traicionero: confirma <b>por tiempo</b>, no por trabajo hecho. Puede confirmar eventos que todavía estás procesando, y si el proceso muere, se pierden.</p>
     <p>En cualquier consumidor que haga algo importante: commit manual, después de procesar.</p>`},
 {t:"opcion", p:"Quieres volver a procesar todos los eventos de un topic con un grupo que ya existe. ¿Qué haces?",
  ops:["Borrar el topic","Reiniciar los offsets del grupo con kafka-consumer-groups --reset-offsets --to-earliest (con el grupo parado)","Crear otro topic","Cambiar la retención"],
  ok:1, why:"Es una de las cosas que hacen especial a Kafka: reprocesar el histórico es cambiar un número."},
 {t:"escribe", p:"¿Qué garantía tienes si confirmas los offsets ANTES de procesar? (dos palabras: «como mucho…» )",
  sol:["como mucho una vez","como mucho una","at most once"],
  pista:"Si se cae en medio, ese evento no se vuelve a entregar.",
  why:"Se usa muy poco: casi siempre es peor perder un evento que procesarlo dos veces."}
]},

/* =============== U3 L3 =============== */
{
id:"kf5l3",
titulo:"Rebalanceos y paralelismo real",
claves:["Un rebalanceo para el consumo del grupo entero mientras se reparten las particiones","max.poll.interval.ms: si tardas más en procesar, te expulsan del grupo","Procesar en hilos aparte rompe el orden y complica los commits"],
pasos:[
 {t:"info", eti:"Cuando el grupo cambia", h:"El rebalanceo",
  c:`<p>Cada vez que un consumidor entra, sale o deja de responder, el grupo <b>se detiene</b>, se reparten las particiones otra vez y se reanuda. Con rebalanceos frecuentes, el grupo pasa más tiempo repartiéndose el trabajo que trabajando.</p>
     <div class="termbox">session.timeout.ms=45000         # sin latido en este tiempo, fuera del grupo
heartbeat.interval.ms=3000       # cada cuanto manda latido
max.poll.interval.ms=300000      # tiempo maximo entre dos poll(): si te pasas, fuera
max.poll.records=500             # cuantos registros te trae cada poll</div>
     <p>Kafka moderno tiene rebalanceo <b>cooperativo</b>: en vez de soltarlo todo y repartir de cero, solo se mueven las particiones necesarias.</p>`},
 {t:"opcion", p:"Tu consumidor tarda 10 minutos en procesar un lote y lo echan del grupo una y otra vez. ¿Qué pasa?",
  ops:["Un fallo de Kafka","Supera max.poll.interval.ms: Kafka cree que está colgado. Hay que bajar max.poll.records, procesar más rápido o subir ese límite","Falta memoria","El topic está mal"],
  ok:1, why:"Y el bucle es cruel: al reincorporarse vuelve a empezar el lote, vuelve a tardar y lo vuelven a echar."},
 {t:"par", p:"Empareja cada ajuste con lo que controla",
  pares:[["session.timeout.ms","Cuánto se tolera sin latidos antes de expulsar"],["heartbeat.interval.ms","Cada cuánto se manda señal de vida"],["max.poll.interval.ms","Tiempo máximo procesando un lote"],["max.poll.records","Cuántos registros trae cada vuelta"],["Rebalanceo cooperativo","Mover solo las particiones necesarias"]],
  why:"Los latidos van en un hilo aparte: por eso se distingue «estar vivo» de «estar procesando»."},
 {t:"info", eti:"Querer ir más rápido", h:"Hilos dentro del consumidor",
  c:`<p>Tentación habitual: repartir los registros del lote entre un pool de hilos para ir más rápido. Funciona… y rompe dos cosas:</p>
     <ul><li><b>El orden</b> dentro de la partición: dos eventos del mismo pedido pueden procesarse a la vez.</li>
     <li><b>El commit</b>: ya no sabes hasta dónde está todo procesado, solo hasta dónde lo has repartido.</li></ul>
     <p>Si hace falta, se hace con cuidado: repartir <b>por clave</b> (cada clave siempre al mismo hilo) y confirmar solo hasta el offset contiguo completado. O más simple: <b>más particiones y más instancias</b>.</p>`},
 {t:"vf", p:"La forma natural de escalar un consumidor en Kafka es añadir instancias, no hilos.",
  ok:true, why:"Porque el modelo ya está pensado así: particiones repartidas entre instancias, cada una ordenada."},
 {t:"opcion", p:"Un despliegue rodante de 6 instancias provoca 6 rebalanceos seguidos. ¿Cómo se suaviza?",
  ops:["No se puede","Con rebalanceo cooperativo y group.instance.id (miembros estáticos), que evita repartir de nuevo si la instancia vuelve enseguida","Parando el grupo","Bajando particiones"],
  ok:1, why:"Los miembros estáticos son justo para esto: reinicios previstos sin mover particiones."},
 {t:"escribe", p:"¿Qué ajuste bajarías primero si cada lote tarda demasiado en procesarse?",
  sol:["max.poll.records","max poll records"],
  pista:"El que controla cuántos registros te trae cada vuelta.",
  why:"Lotes más pequeños, vueltas más frecuentes, y dejas de superar el tiempo máximo entre llamadas."}
]}

]});
