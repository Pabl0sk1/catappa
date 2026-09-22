window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Maestría: entrevista de Node.js",
resumen: "Preguntas frecuentes, casos reales y simulacro final de Node.js",
nivel: "Maestro",
color: "#4b8a28",
lecciones: [

{
id:"nd8l1",
titulo:"Simulacro de entrevista de Node.js",
claves:["Sabes explicar el event loop, la E/S no bloqueante y sus límites","Dominas Express, bases de datos, seguridad y pruebas","Sabes llevar Node a producción: señales, logs, réplicas y Docker"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Cómo atiende Node miles de conexiones con un solo hilo?»",
  ops:["Crea un hilo por conexión","La E/S es asíncrona: se delega al sistema operativo (y al pool de libuv) y el event loop ejecuta los callbacks cuando terminan, así el hilo nunca espera parado","Usa varios procesos siempre","No puede"],
  ok:1, why:"Añade el límite: el trabajo de CPU sí bloquea."},
 {t:"opcion", p:"«¿Qué ocurre si haces un cálculo síncrono de 2 segundos en una ruta?»",
  ops:["Solo se retrasa esa petición","Se bloquea el event loop: todas las peticiones del proceso esperan esos 2 segundos","Node lo pasa a otro hilo automáticamente","Nada"],
  ok:1, why:"Soluciones: worker_threads, colas o un servicio aparte."},
 {t:"opcion", p:"«¿Diferencia entre process.nextTick, microtareas y setImmediate?»",
  ops:["Son lo mismo","nextTick se ejecuta antes que las microtareas de promesas, ambas antes de la siguiente fase del event loop; setImmediate se ejecuta en la fase check, tras la E/S","setImmediate es inmediato","nextTick es un temporizador"],
  ok:1, why:"Pregunta avanzada; basta con el orden general y saber que abusar de nextTick puede bloquear la E/S."},
 {t:"opcion", p:"«¿Cómo escalarías una API de Node en un servidor de 8 núcleos o en Kubernetes?»",
  ops:["Subiendo la memoria","Varias réplicas del proceso (cluster, PM2 o pods), sin estado en memoria: sesiones y caché en Redis, y un balanceador delante","Un solo proceso más rápido","Con setTimeout"],
  ok:1, why:"Igual que con cualquier servicio sin estado."},
 {t:"opcion", p:"«¿Cómo manejas los errores en una API de Express?»",
  ops:["try/catch en cada línea","Validar la entrada, lanzar errores con significado, un middleware de errores central que responde de forma coherente sin filtrar detalles, y process.on(\"unhandledRejection\") para registrar y reiniciar si hace falta","Ignorarlos","console.log y seguir"],
  ok:1, why:"Un proceso en estado desconocido es mejor reiniciarlo: el orquestador lo levantará."},
 {t:"par", p:"Empareja cada síntoma con su causa típica en Node",
  pares:[["Todas las rutas lentas a la vez","Código síncrono que bloquea el event loop"],["La API se cuelga tras un rato con carga","Conexiones del pool no liberadas"],["Memoria que crece sin parar","Fuga: cachés sin límite o listeners acumulados"],["Peticiones cortadas en cada despliegue","No se maneja SIGTERM"]],
  why:"Los mismos patrones de incidentes que en Java, con otro vocabulario."},
 {t:"info", eti:"Terminado", h:"Has completado Node.js",
  c:`<p>Dominas el runtime y su event loop, ficheros y streams, servidores con Express, bases de datos, autenticación y seguridad, pruebas, rendimiento y producción.</p>
     <p>Para consolidarlo: reescribe la API de tareas en Node con Express (o NestJS), PostgreSQL con Prisma, validación con zod y pruebas con Supertest, y despliégala con el mismo Docker Compose que tu versión en Spring. Comparar ambas es un gran tema de conversación en una entrevista.</p>`}
]},

{
id:"nd8l2",
titulo:"Casos reales de Node en producción",
claves:["Latencia global alta: event loop bloqueado","Memoria creciente: fugas por cachés o listeners","Reinicios en bucle: errores no capturados o memoria insuficiente"],
pasos:[
 {t:"opcion", p:"Caso 1: tras añadir una validación con una expresión regular compleja, algunas peticiones tardan 30 segundos y todo el servidor se congela. ¿Qué es?",
  ops:["La red","ReDoS: una regex con retroceso catastrófico bloquea el event loop con ciertas entradas","Falta memoria","Un bug de Express"],
  ok:1, why:"Evita regex con cuantificadores anidados sobre entrada del usuario, limita la longitud y usa librerías probadas."},
 {t:"opcion", p:"Caso 2: el contenedor reinicia cada pocas horas con «JavaScript heap out of memory». ¿Qué haces?",
  ops:["Subir la memoria sin más","Tomar un heap snapshot (--heapsnapshot-near-heap-limit o el inspector), comparar dos momentos y buscar qué crece: cachés sin límite, listeners o closures","Reiniciar cada hora","Quitar los logs"],
  ok:1, why:"Y ajustar --max-old-space-size al límite del contenedor, igual que en Java."},
 {t:"opcion", p:"Caso 3: en cada despliegue en Kubernetes aparecen errores 502 durante unos segundos. ¿Qué revisas?",
  ops:["El DNS","Que la app maneje SIGTERM (terminar peticiones en curso), que el contenedor no arranque con npm, y que haya readinessProbe y un pequeño preStop","El tamaño de la imagen","La versión de npm"],
  ok:1, why:"El apagado elegante del curso de Kubernetes, aplicado a Node."},
 {t:"par", p:"Empareja cada síntoma con la herramienta de diagnóstico",
  pares:[["CPU al 100% sin saber por qué","--cpu-prof o clinic flame"],["Memoria creciente","Heap snapshots comparados"],["Latencia alta en todas las rutas","Retraso del event loop (monitorEventLoopDelay)"],["Promesas rechazadas sin gestionar","process.on(\"unhandledRejection\") y logs"]],
  why:"Medir antes de cambiar nada, como siempre."}
]}

]});
