window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Maestría: diseño real y entrevista",
resumen: "El guion de la entrevista de diseño de sénior y staff, errores de producción que enseñan, migraciones y evolución de sistemas, y un simulacro final",
nivel: "Maestro",
color: "#b87b36",
lecciones: [

/* =============== U14 L1 =============== */
{
id:"ds8l1",
titulo:"El guion de la entrevista",
claves:["Requisitos y estimaciones, API y datos, diseño de alto nivel, profundizar, y cuellos de botella","Hablar de compromisos en cada decisión y dejar que el entrevistador elija dónde profundizar","En staff se espera además: evolución, coste, operación, riesgos y cómo lo llevarías a cabo con equipos"],
pasos:[
 {t:"info", eti:"La ronda", h:"45 minutos con estructura",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">reparto orientativo de una entrevista de 45 minutos</div>
<table class="dg-tabla"><thead><tr><th>fase</th><th>min</th><th>qué sale de ella</th></tr></thead><tbody>
<tr><td>requisitos</td><td>5</td><td>3–5 funciones dentro, lo que queda fuera, no funcionales con números</td></tr>
<tr><td>estimación</td><td>5</td><td>peticiones/s de lectura y escritura, datos, conclusiones («lectura dominante»)</td></tr>
<tr><td>API y modelo de datos</td><td>5</td><td>endpoints principales, entidades, claves de acceso</td></tr>
<tr><td>alto nivel</td><td>10</td><td>el diagrama de extremo a extremo que ya funciona</td></tr>
<tr><td>profundizar</td><td>15</td><td>1–2 piezas difíciles: generación de ids, fan-out, consistencia…</td></tr>
<tr><td>cierre</td><td>5</td><td>cuellos de botella, fallos, qué medirías, qué harías después</td></tr>
</tbody></table></div>
     <ul><li>Primero un diseño <b>simple que funcione</b>; luego se escala donde las cuentas lo piden. Empezar con 15 microservicios es una señal de alarma.</li>
     <li>Piensa en voz alta, pregunta «¿profundizo aquí o en X?» y escribe los números en la pizarra.</li></ul>`},
 {t:"info", eti:"Nivel", h:"Qué distingue a sénior y staff",
  c:`<div class="dg"><div class="dg-tit">qué se evalúa</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Sénior</div><div class="dg-caja">diseño correcto y completo</div><div class="dg-caja">conoce las piezas y sus límites</div><div class="dg-caja">justifica cada elección con su precio</div><div class="dg-caja">detecta cuellos de botella y fallos</div></div>
<div class="dg-col"><div class="dg-col-tit">Staff</div><div class="dg-caja acento">todo lo anterior, y además…</div><div class="dg-caja acento">evolución: qué construir hoy y qué dentro de un año</div><div class="dg-caja acento">coste, operación y equipos (quién lo mantiene)</div><div class="dg-caja acento">riesgos, migración y cómo medir el éxito</div><div class="dg-caja acento">lleva la conversación, no la sigue</div></div>
</div></div>
     <div class="nota ojo"><b class="tit">Errores que suspenden</b>Diseñar sin requisitos, no dar ningún número, nombrar tecnologías sin decir por qué, ignorar los fallos, defender una decisión cuando el entrevistador te da un dato que la invalida.</div>`},
 {t:"orden", p:"Ordena las fases de una entrevista de diseño de sistemas",
  items:["Aclarar requisitos funcionales y no funcionales","Estimar la escala (peticiones por segundo, datos)","Definir la API y el modelo de datos","Dibujar el diseño de alto nivel","Profundizar en uno o dos componentes críticos","Identificar cuellos de botella, fallos y mejoras"],
  why:"Unos 5, 5, 5, 10, 15 y 5 minutos de una entrevista de 45."},
 {t:"par", p:"Empareja cada frase con la fase en la que la dirías",
  pares:[["«¿Cuántos usuarios activos diarios esperamos?»","Requisitos y estimación"],["«POST /enlaces devuelve el código creado»","API"],["«El balanceador reparte entre réplicas sin estado»","Alto nivel"],["«Veamos cómo generar identificadores únicos sin coordinación»","Profundizar"],["«Si Redis cae, las redirecciones irían todas a la base de datos...»","Cuellos de botella y fallos"]],
  why:"Guiar la conversación con estructura transmite seniority."},
 {t:"opcion", p:"El entrevistador pregunta «¿por qué Cassandra y no PostgreSQL?». ¿Qué tipo de respuesta buscan?",
  ops:["«Porque es más moderna»","El compromiso: escrituras masivas particionadas por conversación y escala horizontal, a cambio de consultas menos flexibles y consistencia ajustable","«Porque lo usa Facebook»","«No lo sé, cualquiera vale»"],
  ok:1, why:"Cada elección con su ventaja y su precio."},
 {t:"opcion", p:"A mitad del diseño, el entrevistador dice: «ahora el tráfico es 100 veces mayor». ¿Qué haces?",
  ops:["Empezar de cero","Rehacer las cuentas, señalar qué pieza se rompe primero con ese volumen y cambiar solo esa (caché, particionado, colas)","Decir que tu diseño ya aguanta cualquier cosa","Añadir más servidores sin más"],
  ok:1, why:"Evalúan si sabes dónde está el siguiente cuello de botella, no si tu primer diseño era perfecto."},
 {t:"codigo", p:"Tu calculadora de servilleta para la entrevista",
  lenguaje:"py",
  c:`<p>Lee seis líneas: usuarios activos diarios, lecturas por usuario y día, escrituras por usuario y día, bytes por escritura, años de retención y peticiones por segundo que aguanta un servidor. Con 86.400 s/día, 365 días/año y un pico de ×3, imprime:</p>
<div class="termbox">lecturas: 11574/s
escrituras: 579/s
datos: 182.5 TB
servidores: 37</div>
<p>(Lecturas y escrituras de media, redondeadas; datos en TB decimales = bytes / 10^12 con un decimal; servidores = pico de (lecturas + escrituras) ÷ capacidad, redondeando hacia arriba.)</p>`,
  plantilla:`import math
dau = int(input())
lecturas_u = int(input())
escrituras_u = int(input())
bytes_esc = int(input())
anos = int(input())
capacidad = int(input())
# calcula
`,
  pruebas:[{entrada:"10000000\n100\n5\n1000\n10\n1000\n", salida:"lecturas: 11574/s\nescrituras: 579/s\ndatos: 182.5 TB\nservidores: 37"},{entrada:"1000000\n20\n2\n500\n5\n500\n", salida:"lecturas: 231/s\nescrituras: 23/s\ndatos: 1.8 TB\nservidores: 2"},{entrada:"200000000\n50\n1\n2000\n3\n2000\n", salida:"lecturas: 115741/s\nescrituras: 2315/s\ndatos: 438.0 TB\nservidores: 178", oculta:true}],
  pista:"datos = dau * escrituras_u * bytes_esc * 365 * anos / 1e12; servidores = math.ceil((lect + esc) * 3 / capacidad) con los valores sin redondear.",
  solucion:`import math
dau = int(input())
lecturas_u = int(input())
escrituras_u = int(input())
bytes_esc = int(input())
anos = int(input())
capacidad = int(input())
lect = dau * lecturas_u / 86400
esc = dau * escrituras_u / 86400
datos = dau * escrituras_u * bytes_esc * 365 * anos / 1e12
print(f"lecturas: {round(lect)}/s")
print(f"escrituras: {round(esc)}/s")
print(f"datos: {datos:.1f} TB")
print(f"servidores: {math.ceil((lect + esc) * 3 / capacidad)}")
`,
  why:"Con estas cuatro cifras ya puedes decir si cabe en una base de datos, si hace falta caché y cuántas réplicas pedir. Luego se multiplica por las réplicas de datos (×3) y se deja margen."}
]},

/* =============== U14 L2 =============== */
{
id:"ds14n1",
titulo:"Errores de producción que enseñan",
claves:["La mayoría de grandes caídas combinan un cambio, una dependencia compartida y un bucle de realimentación (reintentos, reconexiones, health checks)","Reintentos en cada capa multiplican la carga; los health checks profundos sacan a todas las réplicas a la vez","Postmortems sin culpables: línea de tiempo, causa, qué lo agravó y acciones con dueño"],
pasos:[
 {t:"info", eti:"Patrones de caída", h:"Cómo se rompen los sistemas de verdad",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">incidentes clásicos</div>
<table class="dg-tabla"><thead><tr><th>incidente</th><th>qué pasa</th><th>defensa</th></tr></thead><tbody>
<tr><td>tormenta de reintentos</td><td>un servicio va lento, todos reintentan y la carga se multiplica</td><td>reintentar en una capa, presupuesto de reintentos, circuit breaker</td></tr>
<tr><td>caché vaciada</td><td>un despliegue o reinicio vacía la caché y la BD recibe todo</td><td>calentar, arrancar poco a poco, recálculo único</td></tr>
<tr><td>partición caliente</td><td>una clave (un famoso, un cliente enorme) satura un nodo</td><td>salar la clave, caché local, aislar clientes grandes</td></tr>
<tr><td>health check profundo</td><td>la BD va lenta y el balanceador saca todas las réplicas</td><td>health checks superficiales; la dependencia se mide aparte</td></tr>
<tr><td>cambio de configuración global</td><td>un valor erróneo llega a todas las regiones a la vez</td><td>configuración desplegada por fases y validada</td></tr>
<tr><td>cerebro dividido</td><td>dos primarias aceptan escrituras tras un failover</td><td>consenso, vallado, apagar la vieja (STONITH)</td></tr>
<tr><td>certificado o dominio caducado</td><td>todo funciona hasta que un día deja de funcionar</td><td>renovación automática y alertas de caducidad</td></tr>
</tbody></table></div>`},
 {t:"info", eti:"Aprender", h:"Metaestabilidad y postmortems",
  c:`<p>Algunos fallos son <b>metaestables</b>: un disparador pequeño (un pico, un despliegue) mete al sistema en un estado del que no sale aunque el disparador desaparezca, porque el propio fallo genera más carga (reintentos, reconexiones, caché fría). Para salir hay que <b>cortar el bucle</b>: descartar carga, abrir circuitos, dejar entrar el tráfico poco a poco.</p>
     <div class="dg"><div class="dg-tit">un postmortem útil</div>
<div class="dg-vert"><div class="dg-caja">impacto: quién, cuánto tiempo, cuánto</div><div class="dg-caja">línea de tiempo: detección, diagnóstico, mitigación</div><div class="dg-caja">causas: la que lo disparó y las que lo agravaron</div><div class="dg-caja ok">acciones concretas, con dueño y fecha</div></div>
<div class="dg-nota arriba">sin culpables: se pregunta qué permitió el error, no quién lo cometió</div></div>`},
 {t:"par", p:"Empareja cada síntoma con el incidente más probable",
  pares:[["Tras un despliegue, la BD pasa del 20% al 100% de CPU","Caché vaciada"],["Un nodo de Redis al 100% y el resto al 5%","Clave o partición caliente"],["Todas las réplicas fuera del balanceador a la vez","Health check que depende de algo compartido"],["El tráfico al servicio caído es 8 veces el normal","Tormenta de reintentos"],["Dos nodos se creen primaria y los datos divergen","Cerebro dividido"]],
  why:"Reconocer el patrón acorta el diagnóstico de horas a minutos."},
 {t:"opcion", p:"El servicio de inventario tuvo un pico de 2 minutos; el pico pasó, pero sigue caído una hora después con el triple de tráfico del normal. ¿Qué está pasando y qué haces?",
  ops:["Un fallo de hardware; cambiar la máquina","Un fallo metaestable: reintentos y reconexiones lo mantienen saturado; cortar el bucle descartando carga o abriendo circuitos y readmitir tráfico gradualmente","Nada, se arreglará solo","Subir los timeouts"],
  ok:1, why:"Escalar a veces ayuda, pero lo que rompe el ciclo es reducir la carga que genera el propio fallo."},
 {t:"vf", p:"Un buen postmortem identifica a la persona que cometió el error para que no vuelva a pasar.",
  ok:false, why:"Si la persona pudo romperlo, el sistema lo permitía: se arregla el sistema (validaciones, despliegues graduales, permisos). Culpar hace que la gente esconda los errores."},
 {t:"opcion", p:"Tras un failover automático, la primaria antigua vuelve a la red y sigue aceptando escrituras. ¿Qué medida faltaba?",
  ops:["Más réplicas","Vallado (fencing): impedir que el antiguo líder escriba, con tokens de época o aislándolo antes de promover al nuevo","Una caché","Más monitorización"],
  ok:1, why:"El failover no termina al promover la réplica nueva: hay que garantizar que la vieja no puede escribir."},
 {t:"codigo", p:"Calcula la amplificación de reintentos por capas",
  lenguaje:"py",
  c:`<p>Lee en una línea los intentos totales que hace cada capa por petición (1 = sin reintentos). Si la capa más profunda falla siempre, cada capa multiplica los intentos. Imprime <code>peticiones al fondo: X</code> (el producto) y <code>amplificacion: X veces</code>. Si dos o más capas hacen más de 1 intento, añade la línea <code>consejo: reintenta solo en una capa</code>.</p>`,
  plantilla:`intentos = list(map(int, input().split()))
# calcula
`,
  pruebas:[{entrada:"3 3 3\n", salida:"peticiones al fondo: 27\namplificacion: 27 veces\nconsejo: reintenta solo en una capa"},{entrada:"1 1 3\n", salida:"peticiones al fondo: 3\namplificacion: 3 veces"},{entrada:"2 1 4 5\n", salida:"peticiones al fondo: 40\namplificacion: 40 veces\nconsejo: reintenta solo en una capa", oculta:true}],
  pista:"math.prod(intentos) da el producto; cuenta las capas con intentos &gt; 1.",
  solucion:`import math
intentos = list(map(int, input().split()))
total = math.prod(intentos)
print(f"peticiones al fondo: {total}")
print(f"amplificacion: {total} veces")
if sum(1 for i in intentos if i > 1) >= 2:
    print("consejo: reintenta solo en una capa")
`,
  why:"Cuatro capas con 3 intentos cada una son 81 peticiones por cada petición del usuario: justo cuando el servicio de abajo menos puede aguantarlas."}
]},

/* =============== U14 L3 =============== */
{
id:"ds14n2",
titulo:"Evolucionar sistemas: migraciones, coste y decisiones",
claves:["Migrar sin cortar: expandir y contraer, doble escritura controlada, relleno por lotes, lecturas en sombra y cambio gradual","El coste es un requisito: datos, tráfico entre zonas y regiones, y horas de operación","Decisiones documentadas (ADR): contexto, opciones, decisión y consecuencias; construir o comprar"],
pasos:[
 {t:"info", eti:"Cambiar en marcha", h:"Migrar datos sin parar el servicio",
  c:`<div class="dg"><div class="dg-tit">migrar de la BD vieja a la nueva</div>
<div class="dg-vert">
<div class="dg-caja doble">1. doble escritura<small>se escribe en las dos (o CDC de la vieja a la nueva); se sigue leyendo de la vieja</small></div>
<div class="dg-caja doble">2. relleno (backfill)<small>copiar el histórico por lotes, con ritmo controlado e idempotente</small></div>
<div class="dg-caja doble">3. lecturas en sombra<small>leer de las dos, devolver la vieja y registrar diferencias</small></div>
<div class="dg-caja acento doble">4. cambiar las lecturas poco a poco<small>1%, 10%, 50%, 100%, con marcha atrás</small></div>
<div class="dg-caja ok doble">5. dejar de escribir en la vieja y retirarla</div>
</div></div>
     <p>Para esquemas, <b>expandir y contraer</b>: añadir la columna nueva (compatible), escribir en las dos, rellenar, pasar lecturas, y solo al final quitar la vieja. Cada paso se puede desplegar y deshacer por separado.</p>`},
 {t:"info", eti:"Dinero y decisiones", h:"Coste y registros de decisión",
  c:`<ul><li><b>Coste</b> en el diseño: almacenamiento (y sus réplicas y copias), cómputo, y a menudo lo que más sorprende: <b>transferencia de datos</b> entre zonas, entre regiones y hacia Internet, y los servicios gestionados cobrados por petición.</li>
     <li>Palancas: clases de almacenamiento y ciclos de vida, cachés que evitan tráfico, compresión, instancias reservadas o spot para trabajos por lotes, apagar lo que no se usa.</li>
     <li><b>Construir o comprar</b>: un servicio gestionado cuesta dinero; uno propio cuesta personas, guardias y conocimiento. Se construye lo que diferencia al negocio.</li>
     <li><b>ADR</b> (Architecture Decision Record): una página por decisión importante con contexto, opciones, decisión y consecuencias. Dentro de dos años alguien preguntará «¿por qué Kafka?» y la respuesta estará escrita.</li></ul>`},
 {t:"orden", p:"Ordena los pasos para renombrar la columna <code>nombre</code> a <code>nombre_completo</code> sin cortar el servicio",
  items:["Añadir la columna nombre_completo (nullable)","Desplegar código que escribe en las dos columnas","Rellenar nombre_completo en las filas antiguas por lotes","Desplegar código que lee de nombre_completo","Dejar de escribir en nombre y borrar la columna"],
  why:"Es el patrón expandir-contraer: en cada momento, la versión anterior y la nueva del código funcionan con el esquema que hay."},
 {t:"par", p:"Empareja cada técnica de migración con lo que aporta",
  pares:[["Doble escritura o CDC","Mantener las dos fuentes al día durante la transición"],["Backfill por lotes","Copiar el histórico sin saturar la base de datos"],["Lecturas en sombra","Detectar diferencias sin afectar a los usuarios"],["Cambio gradual por porcentaje","Limitar el daño y poder volver atrás"],["ADR","Dejar escrito por qué se tomó una decisión"]],
  why:"Una migración grande es una serie de pasos pequeños, reversibles y medibles."},
 {t:"opcion", p:"Tu factura de nube se dispara y el mayor concepto es «transferencia entre zonas». ¿Qué sospechas primero?",
  ops:["Demasiada CPU","Servicios muy habladores repartidos entre zonas (o réplicas y cachés en otra zona) que mueven gigas en cada petición","El DNS","Los logs locales"],
  ok:1, why:"Mantener el tráfico intenso dentro de la zona (enrutado consciente de zona) y comprimir suele recortar mucho, sin perder la tolerancia a fallos."},
 {t:"vf", p:"Para migrar a una base de datos nueva, lo más seguro es un fin de semana de corte con la aplicación parada.",
  ok:false, why:"A veces es aceptable para sistemas pequeños, pero no tiene marcha atrás fácil ni se valida con tráfico real. La migración gradual con lecturas en sombra detecta los problemas antes de depender de la base nueva."},
 {t:"opcion", p:"Tu equipo de 4 personas quiere montar y operar su propio clúster de Kafka para 200 mensajes por segundo. ¿Qué le dirías?",
  ops:["Perfecto, así aprenden","Para ese volumen, un servicio gestionado (o una cola sencilla) suele salir más barato en total: operar Kafka exige guardias, actualizaciones y conocimiento","Que usen ficheros compartidos","Que escriban su propio broker"],
  ok:1, why:"El coste de operación en personas se olvida en las comparativas. Se construye y opera lo que diferencia al negocio."}
]},

/* =============== U14 L4 =============== */
{
id:"ds8l2",
titulo:"Simulacro de diseño de sistemas",
claves:["Sabes aplicar caché, réplicas, particionado, colas, CDN y consenso según el problema","Razonas sobre consistencia, disponibilidad, latencia y coste","Estás preparado para la ronda de diseño de una entrevista de sénior o staff"],
pasos:[
 {t:"info", eti:"Último paso", h:"Decisiones mezcladas",
  c:`<p>Para cada situación, piensa primero en el cuello de botella o en el riesgo, y después en la pieza. Es exactamente lo que harás en la pizarra.</p>`},
 {t:"opcion", p:"«La base de datos está saturada de lecturas repetidas de los mismos productos.»",
  ops:["Particionar escrituras","Caché cache-aside en Redis con TTL e invalidación al actualizar, y réplicas de lectura","Más CPU en el servidor web","Quitar índices"],
  ok:1, why:"Lecturas repetidas = caché primero."},
 {t:"opcion", p:"«Generar miniaturas de fotos hace que la subida tarde 8 segundos.»",
  ops:["Servidor más grande","Guardar el original en S3, responder enseguida y generar las miniaturas de forma asíncrona con una cola y workers","Comprimir en el navegador y ya","Quitar las miniaturas"],
  ok:1, why:"Sacar el trabajo lento del camino de la petición."},
 {t:"opcion", p:"«Una sola base de datos ya no admite el volumen de escrituras de eventos.»",
  ops:["Réplicas de lectura","Particionar por una clave que reparta bien (o un almacén diseñado para escrituras masivas) y agrupar escrituras","Más caché","Un índice más"],
  ok:1, why:"Las réplicas no ayudan a escribir: todas las escrituras van al primario."},
 {t:"opcion", p:"«Los usuarios de Asia tienen 300 ms más de latencia que los de Europa.»",
  ops:["Más réplicas en Europa","CDN para el contenido estático y cacheable y, si hace falta, despliegue en una región de Asia con datos replicados","Comprimir el JSON","Nada que hacer"],
  ok:1, why:"La distancia física solo se vence acercando los datos."},
 {t:"opcion", p:"«Si cae la región principal, el servicio debe volver en 15 minutos perdiendo como mucho 1 minuto de datos.»",
  ops:["Backups diarios","Réplica asíncrona continua en otra región (RPO ~1 min), infraestructura como código y failover de DNS con health checks, probado periódicamente (RTO 15 min)","Un servidor más grande","Multi-AZ en la misma región"],
  ok:1, why:"Traducir RPO y RTO a una estrategia concreta es lo que se evalúa."},
 {t:"opcion", p:"«Tras guardar el pedido, a veces el evento PedidoCreado no llega a Kafka.»",
  ops:["Reintentar el envío más veces","Patrón outbox: el evento se guarda en la misma transacción y un relé o CDC lo publica; consumidores idempotentes","Enviar el evento antes de guardar","Quitar Kafka"],
  ok:1, why:"La doble escritura sin transacción común siempre acaba perdiendo o inventando eventos."},
 {t:"opcion", p:"«Dos procesos de facturación a veces se ejecutan a la vez y emiten facturas duplicadas.»",
  ops:["Un cerrojo en memoria","Elección de líder o cerrojo con consenso y token de vallado, y además facturas con clave única por periodo (idempotencia)","Ejecutarlo menos veces","Un sleep aleatorio"],
  ok:1, why:"Defensa en dos capas: evitar la ejecución doble y, si ocurre, que no tenga efecto doble."},
 {t:"par", p:"Empareja cada requisito con la pieza que más aporta",
  pares:[["Búsqueda por texto con filtros","Índice invertido alimentado por CDC"],["Mensajes en orden por conversación","Partición por conversación y número de secuencia"],["No cobrar dos veces","Clave de idempotencia de punta a punta"],["Aguantar un pico de 50 veces el tráfico en una venta","Sala de espera virtual y descarte de carga"],["Saber si cumplimos con los usuarios","SLO con alertas de tasa de consumo"]],
  why:"Si puedes justificar cada una de estas parejas en voz alta, estás listo para la ronda."},
 {t:"info", eti:"Terminado", h:"Has completado Diseño de sistemas",
  c:`<p>Dominas requisitos y estimaciones, escalado, balanceo, CDN, cachés, bases de datos, replicación y particionado, consistencia y consenso, mensajería, idempotencia, sagas, APIs, arquitectura de servicios, almacenamiento de objetos, búsqueda, tiempo real, fiabilidad, seguridad y los casos clásicos de entrevista.</p>
     <p>Para consolidarlo: practica en voz alta con un temporizador de 45 minutos, dibujando en una pizarra o en Excalidraw. Buenas fuentes: «Designing Data-Intensive Applications» (Martin Kleppmann), «System Design Interview» (Alex Xu), el repositorio «System Design Primer» y los blogs de ingeniería y postmortems públicos de las grandes empresas.</p>`}
]}

]});
