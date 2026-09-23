window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Fiabilidad",
resumen: "Timeouts, reintentos y circuit breakers, sobrecarga y degradación elegante, alta disponibilidad y recuperación ante desastres, SLOs y observabilidad",
nivel: "Experto",
color: "#c48642",
lecciones: [

/* =============== U10 L1 =============== */
{
id:"ds6l1",
titulo:"Diseñar para fallar",
claves:["Todo falla: redundancia en cada capa y sin puntos únicos de fallo","Timeouts en toda llamada remota; reintentos con espera exponencial, jitter y presupuesto, solo si la operación es idempotente","Circuit breaker: dejar de llamar a una dependencia caída y probar de vez en cuando"],
pasos:[
 {t:"info", eti:"Resiliencia", h:"Principios",
  c:`<ul><li><b>Redundancia</b>: varias réplicas, varias zonas, base de datos con réplica y failover. Busca los <b>puntos únicos de fallo</b>: ese balanceador, ese NAT, esa clave de Redis, esa persona que sabe desplegar.</li>
     <li><b>Timeouts</b> en toda llamada remota. Sin timeout, un servicio lento retiene hilos y conexiones hasta agotarlos (recuerda la ley de Little).</li>
     <li><b>Reintentos</b> con espera exponencial y <b>jitter</b>, solo en operaciones idempotentes y con límite: un <b>presupuesto de reintentos</b> (por ejemplo, como mucho un 10% de peticiones extra) evita multiplicar la carga de un servicio que ya sufre.</li>
     <li><b>Circuit breaker</b>: dejar de llamar a una dependencia caída.</li>
     <li><b>Degradación</b>: si el servicio de recomendaciones cae, mostrar los productos más vendidos en vez de un error.</li></ul>
     <div class="nota ojo"><b class="tit">Reintentos en cada capa</b>Si la web reintenta 3 veces, la API 3 y el servicio interno 3, un fallo abajo genera 27 peticiones. Se reintenta en una sola capa, normalmente la más cercana al fallo.</div>`},
 {t:"info", eti:"El disyuntor", h:"Circuit breaker",
  c:`<div class="dg"><div class="dg-tit">estados de un circuit breaker</div>
<svg viewBox="0 0 340 200" width="100%" style="max-width:460px;display:block;margin:auto" role="img" aria-label="Cerrado pasa a abierto tras N fallos; abierto pasa a semiabierto tras el enfriamiento; semiabierto vuelve a cerrado si la prueba sale bien o a abierto si falla">
<defs><marker id="fl-diseno10-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
<rect x="10" y="30" width="96" height="40" rx="8" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="2"/><text x="58" y="55" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)">cerrado</text>
<rect x="234" y="30" width="96" height="40" rx="8" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/><text x="282" y="55" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)">abierto</text>
<rect x="112" y="140" width="116" height="40" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="170" y="165" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)">semiabierto</text>
<line x1="108" y1="44" x2="230" y2="44" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-diseno10-1)"/><text x="170" y="36" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">N fallos seguidos</text>
<line x1="270" y1="72" x2="210" y2="138" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-diseno10-1)"/><text x="292" y="112" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">enfriamiento</text>
<line x1="130" y1="138" x2="70" y2="72" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-diseno10-1)"/><text x="50" y="112" text-anchor="middle" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">prueba bien</text>
<line x1="196" y1="140" x2="252" y2="74" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#fl-diseno10-1)"/><text x="232" y="132" font-size="12" font-family="var(--sans)" fill="var(--ink-2)">falla</text>
</svg></div>
     <p>Abierto, las llamadas fallan al instante (o van al plan B) sin esperar al timeout: se protege tanto al que llama (no acumula hilos) como a la dependencia (la deja recuperarse). Librerías: Resilience4j en Java, Polly en .NET; o el propio service mesh.</p>`},
 {t:"par", p:"Empareja cada técnica con el fallo que contiene",
  pares:[["Varias réplicas en varias zonas","Caída de una máquina o de una zona"],["Timeout","Una dependencia que no responde"],["Circuit breaker","Seguir castigando a un servicio caído"],["Degradación controlada","Perder toda la página por una función secundaria"],["Jitter en reintentos","Oleadas de reintentos sincronizados"]],
  why:"Los fallos en cascada son la causa de muchas caídas grandes."},
 {t:"opcion", p:"El servicio de recomendaciones tarda 30 segundos en responder y la página de producto se cuelga. ¿Qué diseño lo evita?",
  ops:["Esperar más","Timeout corto, circuit breaker y un fallback (productos populares) para que la página cargue sin recomendaciones personalizadas","Quitar las recomendaciones","Más réplicas de la página"],
  ok:1, why:"Una función secundaria no debe tumbar la principal."},
 {t:"opcion", p:"¿Por qué se añade jitter (aleatoriedad) a la espera exponencial entre reintentos?",
  ops:["Para que tarde más","Para que miles de clientes que fallaron a la vez no reintenten todos en el mismo instante","Porque lo exige HTTP","Para cifrar"],
  ok:1, why:"Sin jitter, 1 s, 2 s, 4 s… llegan en oleadas sincronizadas que vuelven a tumbar el servicio. Con «jitter completo», la espera es aleatoria entre 0 y el tope."},
 {t:"vf", p:"Reintentar un POST que crea un pedido es siempre seguro si el primer intento dio timeout.",
  ok:false, why:"El timeout no dice si se creó o no. Solo es seguro con una clave de idempotencia."},
 {t:"codigo", p:"Implementa un circuit breaker",
  lenguaje:"py",
  c:`<p>Primera línea: <code>umbral enfriamiento</code>. Después, una línea por llamada: <code>t resultado</code> (el segundo y lo que devolvería la dependencia si se la llamara: <code>ok</code> o <code>fallo</code>).</p>
<ul><li><b>Cerrado</b>: se llama. Cada fallo suma uno a los fallos seguidos (un ok los pone a 0); al llegar al umbral, se <b>abre</b> en ese segundo.</li>
<li><b>Abierto</b>: si han pasado menos de <code>enfriamiento</code> segundos desde que se abrió, imprime <code>t rechazada</code> sin llamar. Si ya han pasado, se hace una llamada de prueba: ok → cerrado (fallos a 0); fallo → abierto de nuevo desde ese segundo.</li></ul>
<p>Para las llamadas que se hacen, imprime <code>t ok</code> o <code>t fallo</code>.</p>`,
  plantilla:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
umbral, enfriamiento = int(lineas[0][0]), int(lineas[0][1])
abierto = False
abierto_en = 0
fallos = 0
for t, res in lineas[1:]:
    t = int(t)
    # aplica la máquina de estados
`,
  pruebas:[{entrada:"2 10\n1 fallo\n2 fallo\n3 ok\n11 ok\n12 ok\n", salida:"1 fallo\n2 fallo\n3 rechazada\n11 rechazada\n12 ok"},{entrada:"1 5\n0 fallo\n5 fallo\n6 ok\n10 ok\n", salida:"0 fallo\n5 fallo\n6 rechazada\n10 ok"},{entrada:"3 4\n1 fallo\n2 ok\n3 fallo\n4 fallo\n5 fallo\n6 ok\n9 ok\n10 fallo\n", salida:"1 fallo\n2 ok\n3 fallo\n4 fallo\n5 fallo\n6 rechazada\n9 ok\n10 fallo", oculta:true}],
  pista:"En abierto, compara t - abierto_en con el enfriamiento. En la prueba, si falla, abierto_en = t.",
  solucion:`import sys
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
umbral, enfriamiento = int(lineas[0][0]), int(lineas[0][1])
abierto = False
abierto_en = 0
fallos = 0
for t, res in lineas[1:]:
    t = int(t)
    if abierto:
        if t - abierto_en < enfriamiento:
            print(f"{t} rechazada")
            continue
        print(f"{t} {res}")
        if res == "ok":
            abierto = False
            fallos = 0
        else:
            abierto_en = t
        continue
    print(f"{t} {res}")
    if res == "ok":
        fallos = 0
    else:
        fallos += 1
        if fallos >= umbral:
            abierto = True
            abierto_en = t
`,
  why:"Las librerías reales usan una tasa de fallos sobre una ventana (por ejemplo, 50% de las últimas 100 llamadas) y dejan pasar varias llamadas de prueba en semiabierto."}
]},

/* =============== U10 L2 =============== */
{
id:"ds10n1",
titulo:"Sobrecarga y degradación elegante",
claves:["Un sistema sobrecargado debe rechazar pronto y barato (load shedding) antes que ir lento para todos","Bulkheads: aislar recursos (pools, hilos, colas) para que un fallo no los agote todos","Priorizar lo crítico, colas acotadas, contrapresión e interruptores para apagar funciones"],
pasos:[
 {t:"info", eti:"Demasiado tráfico", h:"Rechazar a tiempo",
  c:`<div class="dg"><div class="dg-tit">qué pasa al superar la capacidad</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Sin protección</div><div class="dg-vert"><div class="dg-caja">las colas internas crecen</div><div class="dg-caja">todas las peticiones tardan más que el timeout del cliente</div><div class="dg-caja aviso">el servidor trabaja en respuestas que nadie espera: 0% de éxito</div></div></div>
<div class="dg-col"><div class="dg-col-tit">Con load shedding</div><div class="dg-vert"><div class="dg-caja">límite de peticiones en curso o cola acotada</div><div class="dg-caja">lo que sobra recibe 503 al instante (con Retry-After)</div><div class="dg-caja ok">el resto se atiende a tiempo: 80% de éxito</div></div></div>
</div></div>
     <ul><li><b>Priorizar</b>: ante sobrecarga, se descarta primero lo menos importante (analítica, precargas, tráfico de bots) y se protege el pago.</li>
     <li><b>Colas acotadas</b>: una cola sin límite solo convierte la sobrecarga en latencia infinita.</li>
     <li><b>Contrapresión</b>: que el consumidor lento haga frenar al productor en vez de acumular.</li>
     <li>Descartar peticiones que ya han superado su <b>plazo</b> (deadline propagado desde el cliente): nadie las espera.</li></ul>`},
 {t:"info", eti:"Compartimentos", h:"Bulkheads y degradación",
  c:`<div class="dg"><div class="dg-tit">bulkheads: pools separados por dependencia</div>
<div class="dg-fila"><div class="dg-caja ok doble">pool pagos<small>20 conexiones</small></div><div class="dg-caja aviso doble">pool recomendaciones<small>10 conexiones, todas atascadas</small></div><div class="dg-caja ok doble">pool catálogo<small>30 conexiones</small></div></div>
<div class="dg-nota arriba">como los compartimentos estancos de un barco: si uno se inunda, los demás flotan</div></div>
     <p><b>Degradación elegante</b> es decidir de antemano qué se sacrifica: feed sin recomendaciones personalizadas, búsqueda sin corrector ortográfico, página de producto con el stock «disponible» en vez del número exacto, contenido servido de caché aunque esté algo viejo.</p>
     <p>Los <b>interruptores</b> (kill switches, feature flags) permiten apagar una función cara en segundos durante un incidente sin desplegar.</p>`},
 {t:"par", p:"Empareja cada técnica con su efecto",
  pares:[["Load shedding","Rechazar rápido lo que no se puede atender a tiempo"],["Bulkhead","Aislar recursos para que una dependencia lenta no agote todos"],["Cola acotada","Evitar que la sobrecarga se convierta en latencia infinita"],["Kill switch","Apagar una función cara durante un incidente sin desplegar"],["Propagar el deadline","No trabajar en peticiones que el cliente ya abandonó"]],
  why:"Son las técnicas que distinguen un sistema que se dobla de uno que se rompe."},
 {t:"opcion", p:"En el Black Friday la API de la tienda está al 200% de capacidad. ¿Qué tráfico descartarías primero?",
  ops:["Los pagos","Analítica, recomendaciones y precargas; se protege el carrito y el pago","Todo por igual, al azar","El inicio de sesión"],
  ok:1, why:"La priorización se diseña antes del día D: marcar cada ruta con su criticidad y que el limitador la tenga en cuenta."},
 {t:"vf", p:"Una cola sin límite delante de un servicio es la mejor protección contra picos.",
  ok:false, why:"Absorbe picos cortos, pero ante una sobrecarga sostenida crece sin fin: todo llega tarde y la memoria se agota. Hay que acotarla y rechazar al llenarse."},
 {t:"opcion", p:"Todas las peticiones de tu API comparten un pool de 50 hilos. Un proveedor externo de direcciones se vuelve lento y la API entera deja de responder. ¿Qué patrón faltaba?",
  ops:["Caché","Bulkhead: un pool o semáforo propio y pequeño para ese proveedor, con timeout","Más hilos en el pool compartido","Sharding"],
  ok:1, why:"Con un compartimento propio, solo las funciones que dependen de ese proveedor se degradan."},
 {t:"codigo", p:"Descarta carga según la prioridad",
  lenguaje:"py",
  c:`<p>Primera línea: capacidad (peticiones que se pueden atender). Segunda: las peticiones como <code>id:prioridad</code> (<code>alta</code> o <code>baja</code>). Se aceptan primero las de prioridad alta en orden de llegada y, si queda hueco, las bajas. Imprime <code>atendidas:</code> y <code>rechazadas:</code> con los ids en orden de llegada (vacío si no hay ninguna).</p>`,
  plantilla:`capacidad = int(input())
peticiones = [p.split(":") for p in input().split()]
# elige cuáles atender
`,
  pruebas:[{entrada:"3\na:baja b:alta c:baja d:alta e:alta\n", salida:"atendidas: b d e\nrechazadas: a c"},{entrada:"4\na:baja b:alta c:baja\n", salida:"atendidas: a b c\nrechazadas:"},{entrada:"2\na:baja b:alta c:baja d:baja\n", salida:"atendidas: a b\nrechazadas: c d", oculta:true}],
  pista:"Cuenta cuántas altas caben (min(capacidad, nº de altas)); el hueco restante es para las bajas. Recorre en orden marcando cada una.",
  solucion:`capacidad = int(input())
peticiones = [p.split(":") for p in input().split()]
altas = [i for i, p in peticiones if p == "alta"][:capacidad]
hueco = capacidad - len(altas)
bajas = [i for i, p in peticiones if p == "baja"][:hueco]
ok = set(altas) | set(bajas)
print(("atendidas: " + " ".join(i for i, _ in peticiones if i in ok)).strip())
print(("rechazadas: " + " ".join(i for i, _ in peticiones if i not in ok)).strip())
`,
  why:"Los sistemas grandes (Google, Netflix) clasifican las peticiones en varios niveles de criticidad y descartan de abajo arriba cuando se satura un servicio."}
]},

/* =============== U10 L3 =============== */
{
id:"ds10n2",
titulo:"Alta disponibilidad y recuperación ante desastres",
claves:["RPO: cuántos datos puedes perder; RTO: cuánto puedes tardar en volver","Multi-AZ para fallos de zona; multirregión (activo-pasivo o activo-activo) para desastres regionales","Radio de impacto: células, despliegues graduales y copias de seguridad que se prueban"],
pasos:[
 {t:"info", eti:"Objetivos", h:"RPO, RTO y estrategias",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">estrategias de recuperación, de más barata a más cara</div>
<table class="dg-tabla"><thead><tr><th>estrategia</th><th>RPO</th><th>RTO</th></tr></thead><tbody>
<tr><td>copia de seguridad y restaurar</td><td>horas (desde la última copia)</td><td>horas</td></tr>
<tr><td>piloto encendido (datos replicados, poca infraestructura)</td><td>minutos</td><td>decenas de minutos</td></tr>
<tr><td>en caliente a menor escala</td><td>segundos</td><td>minutos</td></tr>
<tr><td>activo-activo multirregión</td><td>~0 (según replicación)</td><td>~0 (el tráfico ya va a las dos)</td></tr>
</tbody></table></div>
     <ul><li><b>Multi-AZ</b> (varias zonas de una región, a pocos ms): lo mínimo para producción. Réplicas síncronas posibles.</li>
     <li><b>Multirregión</b>: la replicación entre regiones suele ser asíncrona (decenas de ms de distancia), así que el RPO no es cero salvo que pagues latencia en cada escritura.</li>
     <li><b>Activo-activo</b> exige resolver escrituras en dos regiones: particionar usuarios por región «de casa» o aceptar conflictos.</li></ul>`},
 {t:"info", eti:"Limitar el daño", h:"Radio de impacto",
  c:`<ul><li><b>Arquitectura celular</b>: en vez de un gran sistema, N copias independientes (células), cada una con una parte de los clientes. Un fallo o un mal despliegue afecta a una célula, no a todos.</li>
     <li><b>Despliegues graduales</b>: canario al 1%, luego a una zona, luego a una región, con marcha atrás automática si empeoran las métricas. La mayoría de incidentes los provoca un cambio.</li>
     <li><b>Estabilidad estática</b>: que el plano de datos siga funcionando aunque el plano de control (el que crea y configura) esté caído.</li>
     <li><b>Copias de seguridad</b>: una copia que nunca se ha restaurado es una hipótesis. Se prueba la restauración de forma periódica y se protegen de borrados (inmutables, en otra cuenta).</li>
     <li><b>Simulacros</b> (game days, ingeniería del caos): apagar una zona a propósito, en horario laboral y con el equipo mirando.</li></ul>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["RPO","Máxima pérdida de datos aceptable, medida en tiempo"],["RTO","Tiempo máximo aceptable hasta recuperar el servicio"],["Multi-AZ","Réplicas en varias zonas de la misma región"],["Célula","Copia independiente del sistema que atiende a una parte de los clientes"],["Canario","Desplegar primero a una fracción pequeña del tráfico"]],
  why:"RPO y RTO los fija el negocio; la arquitectura es la forma de cumplirlos al menor coste."},
 {t:"opcion", p:"«Si cae la región principal, el servicio debe volver en 15 minutos perdiendo como mucho 1 minuto de datos.» ¿Qué estrategia encaja?",
  ops:["Backups diarios","Réplica asíncrona continua en otra región (RPO ~1 min), infraestructura como código y failover de DNS con health checks, probado periódicamente (RTO 15 min)","Un servidor más grande","Multi-AZ en la misma región"],
  ok:1, why:"Traducir RPO y RTO a una estrategia concreta es lo que se evalúa. Multi-AZ no protege contra la pérdida de la región."},
 {t:"vf", p:"Tener copias de seguridad diarias garantiza que puedes recuperarte de un borrado accidental.",
  ok:false, why:"Solo si la restauración funciona, cabe en el RTO y la copia no se borró junto con los datos (ransomware, un script con permisos de más)."},
 {t:"opcion", p:"Un despliegue con un error de configuración tumba todo tu servicio en todas las regiones a la vez. ¿Qué práctica habría limitado el daño?",
  ops:["Más réplicas","Despliegue gradual (canario, luego zona a zona y región a región) con marcha atrás automática, también para los cambios de configuración","Más monitorización","Un servidor más grande"],
  ok:1, why:"La configuración es código: se despliega igual de gradual. Muchas de las grandes caídas públicas fueron cambios de configuración globales."},
 {t:"codigo", p:"Comprueba si una estrategia cumple el RPO y el RTO",
  lenguaje:"py",
  c:`<p>Lee cuatro enteros en minutos, uno por línea: intervalo entre copias (o retraso de replicación), tiempo de restauración, RPO objetivo y RTO objetivo. En el peor caso se pierde un intervalo completo. Imprime:</p>
<div class="termbox">rpo: 60 min (no cumple)
rto: 30 min (cumple)</div>`,
  plantilla:`intervalo = int(input())
restaurar = int(input())
rpo_obj = int(input())
rto_obj = int(input())
# compara con los objetivos
`,
  pruebas:[{entrada:"60\n30\n15\n60\n", salida:"rpo: 60 min (no cumple)\nrto: 30 min (cumple)"},{entrada:"1\n10\n5\n15\n", salida:"rpo: 1 min (cumple)\nrto: 10 min (cumple)"},{entrada:"1440\n240\n1440\n120\n", salida:"rpo: 1440 min (cumple)\nrto: 240 min (no cumple)", oculta:true}],
  pista:"Cumple si el valor es menor o igual que el objetivo.",
  solucion:`intervalo = int(input())
restaurar = int(input())
rpo_obj = int(input())
rto_obj = int(input())
def estado(valor, objetivo):
    return "cumple" if valor <= objetivo else "no cumple"
print(f"rpo: {intervalo} min ({estado(intervalo, rpo_obj)})")
print(f"rto: {restaurar} min ({estado(restaurar, rto_obj)})")
`,
  why:"Con copias diarias, el RPO del peor caso es un día entero. Para bajar el RPO hacen falta copias continuas (archivado del WAL, recuperación a un instante) o replicación."}
]},

/* =============== U10 L4 =============== */
{
id:"ds6l2",
titulo:"SLOs y observabilidad",
claves:["SLI mide (latencia, errores); SLO es el objetivo; el presupuesto de errores guía el ritmo de cambios","Alertar por síntomas que notan los usuarios, con alertas de tasa de consumo (burn rate)","Métricas, logs y trazas correlacionados por identificador de traza"],
pasos:[
 {t:"info", eti:"Medir la fiabilidad", h:"Del objetivo a la alerta",
  c:`<div class="dg"><div class="dg-tit">del indicador a la alerta</div>
<div class="dg-vert">
<div class="dg-caja doble">SLI<small>porcentaje de peticiones con éxito y en menos de 300 ms</small></div>
<div class="dg-caja acento doble">SLO<small>99,9% en 30 días</small></div>
<div class="dg-caja ok doble">presupuesto de errores<small>0,1% = ~43 minutos al mes</small></div>
<div class="dg-caja aviso doble">alerta<small>consumo rápido del presupuesto (burn rate) → avisar a guardia</small></div>
</div></div>
     <p>El <b>SLA</b> es el contrato con el cliente (con penalizaciones); el SLO interno se fija algo más estricto que el SLA para tener margen.</p>
     <p>El presupuesto es una herramienta de decisión: si queda, se despliega con alegría; si se ha gastado, se congelan los cambios arriesgados y se invierte en fiabilidad.</p>`},
 {t:"info", eti:"Ver dentro", h:"Observabilidad en el diseño",
  c:`<div class="dg"><div class="dg-tit">tres señales, un identificador</div>
<div class="dg-fila"><div class="dg-caja doble">métricas<small>tasa, errores, duración (RED) por endpoint</small></div><div class="dg-caja doble">trazas<small>el viaje de una petición entre servicios</small></div><div class="dg-caja doble">logs<small>estructurados, con trace_id</small></div></div>
<div class="dg-nota arriba">de la alerta (métrica) a la traza lenta, y de la traza a sus logs</div></div>
     <ul><li><b>Burn rate</b>: a qué velocidad se gasta el presupuesto. Una tasa de 14,4 sostenida una hora consume el 2% del presupuesto mensual: alerta de página. Tasas bajas y largas: aviso en horario laboral.</li>
     <li>OpenTelemetry para instrumentar una vez y enviar a cualquier backend.</li>
     <li>En una entrevista, cierra el diseño diciendo <b>qué medirías</b>: SLIs, retraso de colas, tasa de aciertos de la caché, retraso de réplicas.</li></ul>`},
 {t:"par", p:"Empareja cada disponibilidad con su tiempo de caída anual aproximado",
  pares:[["99%","~3,65 días"],["99,9%","~8,8 horas"],["99,99%","~53 minutos"],["99,999%","~5 minutos"]],
  why:"Cada nueve extra cuesta mucho más: se elige según el negocio."},
 {t:"opcion", p:"En un diseño, ¿qué deberías alertar para despertar a alguien por la noche?",
  ops:["CPU al 80%","Síntomas para el usuario: tasa de errores o latencia que consumen rápido el presupuesto del SLO","Cada error en los logs","Uso de disco al 50%"],
  ok:1, why:"Las causas (CPU, disco) van a paneles o avisos no urgentes."},
 {t:"vf", p:"Un SLO del 100% es el objetivo ideal para un servicio importante.",
  ok:false, why:"Es inalcanzable (las dependencias, la red y los propios clientes fallan) y congela cualquier cambio. Además, los usuarios no distinguen 99,99% de 100% porque su móvil o su wifi fallan más."},
 {t:"opcion", p:"Una petición tarda 3 s y pasa por 6 servicios. ¿Qué herramienta te dice dónde se va el tiempo?",
  ops:["Los logs de uno de ellos","Trazas distribuidas: cada servicio añade su tramo (span) con la misma traza","El uso de CPU","El SLA"],
  ok:1, why:"La traza muestra la cascada de tramos y cuál es lento o cuáles podrían ir en paralelo."},
 {t:"codigo", p:"Calcula el presupuesto de errores y la tasa de consumo",
  lenguaje:"py",
  c:`<p>Lee tres líneas: SLO en porcentaje, ventana en días y tasa de error actual en porcentaje. Imprime, con un decimal:</p>
<ul><li><code>presupuesto: X min</code>: minutos de «error total» que permite el SLO en la ventana.</li>
<li><code>burn rate: Y</code>: tasa de error actual / tasa permitida.</li>
<li><code>agotado en: Z dias</code>: ventana / burn rate.</li></ul>`,
  plantilla:`slo = float(input())
dias = float(input())
error = float(input())
# calcula
`,
  pruebas:[{entrada:"99.9\n30\n1.44\n", salida:"presupuesto: 43.2 min\nburn rate: 14.4\nagotado en: 2.1 dias"},{entrada:"99.5\n28\n0.25\n", salida:"presupuesto: 201.6 min\nburn rate: 0.5\nagotado en: 56.0 dias"},{entrada:"99.99\n30\n0.1\n", salida:"presupuesto: 4.3 min\nburn rate: 10.0\nagotado en: 3.0 dias", oculta:true}],
  pista:"permitido = (100 - slo) / 100; presupuesto = permitido * dias * 1440; burn = (error / 100) / permitido.",
  solucion:`slo = float(input())
dias = float(input())
error = float(input())
permitido = (100 - slo) / 100
presupuesto = permitido * dias * 1440
burn = (error / 100) / permitido
print(f"presupuesto: {presupuesto:.1f} min")
print(f"burn rate: {burn:.1f}")
print(f"agotado en: {dias / burn:.1f} dias")
`,
  why:"Con burn rate 14,4, un mes de presupuesto dura dos días: por eso ese umbral (medido en una hora) es el clásico para despertar a alguien."}
]}

]});
