window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "Casos clásicos",
resumen: "Acortador de URLs, limitador de peticiones, feed de una red social y sistema de chat, diseñados paso a paso",
nivel: "Experto",
color: "#c48642",
lecciones: [

{
id:"ds7l1",
titulo:"Acortador de URLs",
claves:["Generar identificadores cortos únicos: contador + base62 o hash con control de colisiones","Muchas más lecturas que escrituras: caché y CDN para las redirecciones","301 frente a 302 según se quieran contar las visitas"],
pasos:[
 {t:"info", eti:"Caso 1", h:"Diseño",
  c:`<div class="diag">POST /api/enlaces {url}      -&gt; genera codigo "aZ3k9Q" -&gt; guarda (codigo, url, dueno, fecha)
GET  /aZ3k9Q                 -&gt; busca url -&gt; 302 Location: url

codigo: 7 caracteres base62 (a-z, A-Z, 0-9) = 62^7 ~ 3,5 billones de combinaciones
generacion: contador distribuido (rangos por servidor) convertido a base62,
            o hash de la url + comprobar colision
lecturas: cache Redis codigo -&gt; url (y CDN); BD clave-valor o relacional con indice unico
analitica: eventos de visita a una cola -&gt; almacen analitico</div>`},
 {t:"par", p:"Empareja cada decisión con su justificación",
  pares:[["Base62 de 7 caracteres","Miles de millones de códigos cortos y legibles en URL"],["Caché de código a URL","Las redirecciones son la inmensa mayoría del tráfico"],["302 en vez de 301","Que cada visita pase por el servicio y se pueda contar"],["Eventos de visita a una cola","No ralentizar la redirección con la analítica"],["Índice único sobre el código","Garantizar que no hay duplicados"]],
  why:"El 301 lo cachean los navegadores: más rápido, pero no ves las visitas repetidas."},
 {t:"opcion", p:"¿Por qué no usar un hash MD5 de la URL recortado a 7 caracteres sin más?",
  ops:["Es perfecto","Puede haber colisiones entre URLs distintas: hay que detectarlas y resolverlas (o usar un contador)","MD5 es lento","No se puede convertir a texto"],
  ok:1, why:"Con miles de millones de enlaces, las colisiones son seguras."}
]},

{
id:"ds7l2",
titulo:"Limitador de peticiones",
claves:["Algoritmos: token bucket, ventana fija, ventana deslizante","Contadores atómicos en Redis con TTL","Dónde: en el API Gateway o como middleware, con cabeceras informativas"],
pasos:[
 {t:"info", eti:"Caso 2", h:"Diseño",
  c:`<div class="diag">requisito: 100 peticiones por minuto por usuario, en 20 replicas

ventana fija en Redis:
  clave = "rl:{usuario}:{minuto actual}"
  n = INCR clave; si n == 1: EXPIRE clave 60
  si n &gt; 100 -&gt; 429 Too Many Requests + Retry-After

token bucket: permite rafagas (hasta la capacidad) y limita el ritmo medio
ventana deslizante: evita el pico doble en el cambio de minuto</div>`},
 {t:"par", p:"Empareja cada algoritmo con su característica",
  pares:[["Ventana fija","Sencillo; permite el doble de peticiones en el borde entre ventanas"],["Ventana deslizante","Más preciso, algo más costoso"],["Token bucket","Permite ráfagas y limita la media"],["Leaky bucket","Procesa a ritmo constante, suaviza picos"]],
  why:"Explicar el problema del borde de la ventana fija suma puntos."},
 {t:"opcion", p:"¿Qué debería devolver la API cuando se supera el límite?",
  ops:["500","429 Too Many Requests con Retry-After","200 sin datos","404"],
  ok:1, why:"Y cabeceras como RateLimit-Remaining para que el cliente se adapte."}
]},

{
id:"ds7l3",
titulo:"Feed y chat",
claves:["Feed: fan-out al escribir (precalcular) o al leer (componer), y un híbrido para cuentas famosas","Chat: WebSockets, servicio de presencia, almacenamiento de mensajes por conversación","Entrega de mensajes: al menos una vez, ordenados por conversación e idempotentes"],
pasos:[
 {t:"info", eti:"Caso 3", h:"Feed de una red social",
  c:`<div class="diag">FAN-OUT AL ESCRIBIR: al publicar, insertar el post en el feed precalculado de cada seguidor
   + leer el feed es rapidisimo    - un famoso con 50M seguidores = 50M escrituras
FAN-OUT AL LEER: al abrir el feed, juntar los ultimos posts de a quien sigues
   + escribir es barato           - leer es caro
HIBRIDO: fan-out al escribir para cuentas normales; los posts de famosos se mezclan al leer</div>`},
 {t:"info", eti:"Caso 4", h:"Chat",
  c:`<div class="diag">cliente --WebSocket--&gt; gateway de conexiones (miles de conexiones por nodo)
   mensaje -&gt; servicio de chat -&gt; guarda (conversacion_id, timestamp, mensaje) en Cassandra
                                -&gt; pub/sub -&gt; gateway donde esta conectado el destinatario
   destinatario desconectado -&gt; notificacion push
presencia: "en linea" con latidos y TTL en Redis</div>`},
 {t:"par", p:"Empareja cada decisión con su motivo",
  pares:[["Fan-out al escribir","Leer el feed debe ser muy rápido"],["Híbrido para cuentas famosas","Evitar millones de escrituras por publicación"],["WebSockets","Entregar mensajes al instante en ambos sentidos"],["Partición por conversación","Mensajes de una conversación juntos y ordenados"],["Presencia con TTL","Saber quién está en línea sin estado permanente"]],
  why:"Los mismos componentes (cola, caché, pub/sub, base de datos particionada) aparecen en todos los diseños."}
]}

]});
