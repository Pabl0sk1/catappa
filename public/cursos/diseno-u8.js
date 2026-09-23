window.CURSOS = window.CURSOS || {};
(CURSOS.diseno = CURSOS.diseno || []).push({
titulo: "APIs y arquitectura de servicios",
resumen: "Diseño de APIs REST, gRPC y GraphQL, paginación por cursor, versionado y compatibilidad, y cuándo partir un monolito en microservicios",
nivel: "Avanzado",
color: "#cf9150",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"ds8n1",
titulo:"Diseño de APIs: REST, gRPC y GraphQL",
claves:["REST: recursos con nombre, verbos HTTP con su semántica y códigos de estado precisos","gRPC: contratos Protobuf sobre HTTP/2, ideal entre servicios; GraphQL: el cliente elige los campos","Errores con un formato estable (Problem Details, RFC 9457) y operaciones largas con 202 Accepted"],
pasos:[
 {t:"info", eti:"REST bien hecho", h:"Recursos, verbos y códigos",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">una API de pedidos</div>
<table class="dg-tabla"><thead><tr><th>petición</th><th>qué hace</th><th>respuesta</th></tr></thead><tbody>
<tr><td><code>POST /pedidos</code></td><td>crear (con Idempotency-Key)</td><td>201 Created + Location: /pedidos/81</td></tr>
<tr><td><code>GET /pedidos/81</code></td><td>leer</td><td>200, o 404</td></tr>
<tr><td><code>GET /clientes/7/pedidos?estado=pagado</code></td><td>listar con filtro</td><td>200 con página y cursor</td></tr>
<tr><td><code>PATCH /pedidos/81</code></td><td>cambio parcial</td><td>200, o 409 si hay conflicto de versión</td></tr>
<tr><td><code>DELETE /pedidos/81</code></td><td>borrar</td><td>204 No Content</td></tr>
<tr><td><code>POST /informes</code></td><td>trabajo largo</td><td>202 Accepted + Location: /informes/5 (consultar estado)</td></tr>
</tbody></table></div>
     <ul><li>Nombres de recursos en plural, sin verbos en la URL (<code>/pedidos/81/cancelacion</code> mejor que <code>/cancelarPedido</code>).</li>
     <li>400 para una petición mal formada, 401 sin autenticar, 403 sin permiso, 404 no existe, 409 conflicto, 422 validación, 429 demasiadas peticiones, 503 no disponible.</li>
     <li>Errores con un formato estable: <code>application/problem+json</code> (RFC 9457) con <code>type</code>, <code>title</code>, <code>status</code> y <code>detail</code>.</li></ul>`},
 {t:"info", eti:"Alternativas", h:"gRPC y GraphQL",
  c:`<div class="dg"><div class="dg-tit">tres estilos</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">REST</div><div class="dg-caja ok">universal, cacheable por HTTP</div><div class="dg-caja aviso">sobrecarga o carencia de campos</div><div class="dg-caja base">APIs públicas</div></div>
<div class="dg-col"><div class="dg-col-tit">gRPC</div><div class="dg-caja ok">Protobuf binario, HTTP/2, streaming, deadlines</div><div class="dg-caja aviso">el navegador necesita gRPC-Web o Connect</div><div class="dg-caja base">entre servicios</div></div>
<div class="dg-col"><div class="dg-col-tit">GraphQL</div><div class="dg-caja ok">el cliente pide justo lo que usa, un solo endpoint</div><div class="dg-caja aviso">caché HTTP difícil, consultas caras, N+1</div><div class="dg-caja base">frontends con pantallas muy variadas</div></div>
</div></div>
     <div class="termbox">syntax = "proto3";
service Pedidos {
  rpc Obtener (ObtenerPedido) returns (Pedido);
  rpc Seguir (ObtenerPedido) returns (stream EstadoPedido);   // streaming del servidor
}
message ObtenerPedido { int64 id = 1; }</div>
     <p>En Protobuf lo que viaja son los <b>números de campo</b>, no los nombres: nunca reutilices un número; los campos que quites se marcan como <code>reserved</code>.</p>`},
 {t:"par", p:"Empareja cada situación con el código de estado",
  pares:[["Se creó el recurso","201 Created"],["La exportación tardará minutos","202 Accepted"],["El token es válido pero no puede ver ese pedido","403 Forbidden"],["La versión que envía el cliente ya no es la actual","409 Conflict"],["Ha superado su límite de peticiones","429 Too Many Requests"],["El servicio está en mantenimiento","503 Service Unavailable"]],
  why:"Códigos precisos permiten a clientes y balanceadores reaccionar sin leer el cuerpo: reintentar un 503, no reintentar un 403."},
 {t:"opcion", p:"Una app móvil hace 7 peticiones REST para pintar la pantalla de inicio, cada una con muchos campos que no usa. ¿Qué opción ataca justo ese problema?",
  ops:["Pasar a gRPC entre microservicios","Un BFF (backend para el frontend) o GraphQL que componga lo que necesita esa pantalla en una sola respuesta","Subir el timeout","Más réplicas"],
  ok:1, why:"El problema es de forma de la API (muchos viajes y campos sobrantes), no de velocidad del protocolo."},
 {t:"opcion", p:"En GraphQL, una consulta pide 50 pedidos y el autor de cada uno. El servidor hace 1 + 50 consultas a la base de datos. ¿Cómo se llama y cómo se arregla?",
  ops:["Consulta cartesiana; con un índice","Problema N+1; con agrupación por lotes (DataLoader) que junta los 50 autores en una consulta","Deadlock; con reintentos","No es un problema"],
  ok:1, why:"Y conviene limitar la profundidad y el coste de las consultas: un cliente puede pedir un grafo enorme en una sola petición."},
 {t:"vf", p:"En Protobuf puedes renombrar un campo sin romper a los clientes existentes siempre que mantengas su número.",
  ok:true, why:"En el binario viaja el número. Lo que rompe es cambiar el número o el tipo, o reutilizar el número de un campo borrado."},
 {t:"hueco", p:"Completa la respuesta a un <code>POST /pedidos</code> que ha creado el pedido 81",
  tpl:"HTTP/1.1 ___ Created · ___: /pedidos/81",
  banco:["201","200","Location","Host","204"],
  sol:["201","Location"],
  why:"201 con Location indica dónde está el recurso nuevo; el cuerpo suele incluir su representación."},
 {t:"escribe", p:"¿Qué tipo de contenido (media type) define el RFC 9457 para los errores de una API HTTP?",
  sol:["application/problem+json","problem+json"],
  pista:"application/…+json",
  why:"Spring Boot lo genera con ProblemDetail y muchos frameworks ya lo soportan: los clientes aprenden un único formato de error."}
]},

/* =============== U8 L2 =============== */
{
id:"ds8n2",
titulo:"Paginación, versionado y evolución",
claves:["Paginación por desplazamiento (OFFSET) es simple pero lenta y se descuadra; por cursor (keyset) es estable y rápida","Cambios compatibles: añadir campos opcionales; incompatibles: quitar, renombrar, cambiar tipos o significado","Versionar solo cuando haces un cambio incompatible, y retirar con aviso (cabeceras Deprecation y Sunset)"],
pasos:[
 {t:"info", eti:"Páginas", h:"Offset frente a cursor",
  c:`<div class="dg"><div class="dg-tit">dos formas de paginar</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Offset</div>
<div class="dg-caja"><code>?pagina=500&amp;tam=20</code><small><code>LIMIT 20 OFFSET 9980</code></small></div>
<div class="dg-caja aviso">la BD lee y descarta 9.980 filas</div>
<div class="dg-caja aviso">si entra un elemento nuevo, se repite o se salta uno</div>
<div class="dg-caja ok">saltar a la página 37</div></div>
<div class="dg-col"><div class="dg-col-tit">Cursor (keyset)</div>
<div class="dg-caja"><code>?despues=eyJmIjoiMjAyNi0wOS0...</code><small><code>WHERE (fecha, id) &lt; (?, ?) ORDER BY fecha DESC, id DESC LIMIT 20</code></small></div>
<div class="dg-caja ok">usa el índice: igual de rápida en la página 1 que en la 10.000</div>
<div class="dg-caja ok">estable aunque entren datos</div>
<div class="dg-caja aviso">solo «siguiente» y «anterior»</div></div>
</div></div>
     <p>El cursor es opaco para el cliente (base64 de la última clave vista) y el orden debe ser <b>total</b>: se añade el id como desempate para que dos filas con la misma fecha no se pierdan.</p>`},
 {t:"info", eti:"Cambiar sin romper", h:"Versionado y evolución",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">¿rompe a los clientes?</div>
<table class="dg-tabla"><thead><tr><th>cambio</th><th>compatible</th></tr></thead><tbody>
<tr><td>añadir un campo a la respuesta</td><td>sí (si los clientes ignoran lo desconocido)</td></tr>
<tr><td>añadir un parámetro opcional</td><td>sí</td></tr>
<tr><td>añadir un valor a un enum</td><td>con cuidado: clientes con <code>switch</code> cerrado fallan</td></tr>
<tr><td>quitar o renombrar un campo</td><td>no</td></tr>
<tr><td>hacer obligatorio un parámetro</td><td>no</td></tr>
<tr><td>cambiar tipo o significado (céntimos → euros)</td><td>no, y es el peor: no falla, calcula mal</td></tr>
</tbody></table></div>
     <ul><li>Versión en la URL (<code>/v2/pedidos</code>): visible y fácil de enrutar. En cabecera o media type: URLs más limpias, menos visible.</li>
     <li>Las apps móviles viejas viven años: una versión se retira avisando con las cabeceras <code>Deprecation</code> y <code>Sunset</code> y midiendo quién la sigue usando.</li>
     <li>Principio de robustez para clientes: ignorar los campos desconocidos.</li></ul>`},
 {t:"opcion", p:"Un listado infinito del feed usa <code>OFFSET</code> y los usuarios ven publicaciones repetidas al hacer scroll. ¿Por qué?",
  ops:["Un fallo del navegador","Entraron publicaciones nuevas arriba y desplazaron todo: la página 2 empieza ahora con elementos de la página 1","La caché de la CDN","La base de datos está corrupta"],
  ok:1, why:"Con cursor («dame las anteriores a esta») el resultado no depende de lo que entre por arriba."},
 {t:"par", p:"Empareja cada cambio con su efecto",
  pares:[["Añadir el campo opcional «notas»","Compatible con clientes existentes"],["Renombrar «total» a «importe»","Incompatible: los clientes leen un campo que ya no existe"],["Pasar «precio» de céntimos a euros sin cambiar el nombre","Incompatible y silencioso: cálculos erróneos"],["Hacer obligatorio «telefono» en el alta","Incompatible: las peticiones viejas fallan"]],
  why:"Los cambios silenciosos son los peores: no hay error, solo datos equivocados."},
 {t:"vf", p:"Con paginación por cursor puedes ofrecer un enlace directo a la página 37 de forma eficiente.",
  ok:false, why:"El cursor solo sabe «después de esto». Si el producto necesita saltar a páginas numeradas (poco común en listados grandes), offset o una búsqueda con filtros."},
 {t:"opcion", p:"Tienes que retirar <code>/v1</code> de tu API pública. ¿Qué haces?",
  ops:["Apagarla un viernes","Anunciar la fecha, enviar cabeceras Deprecation y Sunset, medir el tráfico por cliente, contactar a los que la usan y apagar cuando el uso sea residual","Devolver errores aleatorios para que migren","Mantenerla para siempre sin decir nada"],
  ok:1, why:"Retirar una versión es un proceso con datos, no una fecha en el calendario."},
 {t:"codigo", p:"Implementa la paginación por cursor",
  lenguaje:"py",
  c:`<p>Primera línea: ids ordenados de menor a mayor. Segunda: tamaño de página. Tercera: el cursor (último id visto) o <code>-</code> para la primera página. Imprime <code>pagina: ids</code> con los ids mayores que el cursor (como mucho el tamaño), y <code>siguiente: X</code> con el último id de la página si quedan más elementos, o <code>siguiente: -</code> si no.</p>`,
  plantilla:`ids = list(map(int, input().split()))
tam = int(input())
cursor = input().strip()
# devuelve la página y el siguiente cursor
`,
  pruebas:[{entrada:"3 5 8 13 21 34 55\n3\n-\n", salida:"pagina: 3 5 8\nsiguiente: 8"},{entrada:"3 5 8 13 21 34 55\n3\n8\n", salida:"pagina: 13 21 34\nsiguiente: 34"},{entrada:"3 5 8 13 21 34 55\n3\n34\n", salida:"pagina: 55\nsiguiente: -"},{entrada:"10 20 30 40\n2\n20\n", salida:"pagina: 30 40\nsiguiente: -", oculta:true}],
  pista:"Filtra los ids &gt; cursor (todos si el cursor es «-»), coge los tam primeros y mira si había más de tam.",
  solucion:`ids = list(map(int, input().split()))
tam = int(input())
cursor = input().strip()
resto = ids if cursor == "-" else [i for i in ids if i > int(cursor)]
pagina = resto[:tam]
print("pagina: " + " ".join(map(str, pagina)))
print("siguiente: " + (str(pagina[-1]) if len(resto) > tam else "-"))
`,
  why:"En SQL es WHERE id &gt; ? ORDER BY id LIMIT tam + 1: pedir uno de más te dice si hay página siguiente sin contar toda la tabla."}
]},

/* =============== U8 L3 =============== */
{
id:"ds8n3",
titulo:"Monolito, monolito modular y microservicios",
claves:["Los microservicios resuelven un problema de organización (equipos que despliegan por separado) a cambio de complejidad distribuida","Monolito modular: límites claros por dominio dentro de un solo despliegue; un buen punto de partida","Piezas: API gateway, BFF, una base de datos por servicio, service mesh; migrar con el patrón estrangulador"],
pasos:[
 {t:"info", eti:"Arquitectura", h:"Tres formas de organizar el código",
  c:`<div class="dg"><div class="dg-tit">del monolito a los microservicios</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Monolito</div><div class="dg-caja acento">un despliegue, una BD</div><div class="dg-caja ok">simple de depurar, transacciones locales</div><div class="dg-caja aviso">con 80 personas, todo el mundo se pisa</div></div>
<div class="dg-col"><div class="dg-col-tit">Monolito modular</div><div class="dg-caja acento">un despliegue, módulos con fronteras</div><div class="dg-caja ok">límites claros sin coste de red</div><div class="dg-caja aviso">exige disciplina (nada de atajos entre módulos)</div></div>
<div class="dg-col"><div class="dg-col-tit">Microservicios</div><div class="dg-caja acento">N despliegues, BD por servicio</div><div class="dg-caja ok">equipos y escalado independientes</div><div class="dg-caja aviso">red, consistencia eventual, observabilidad, operación</div></div>
</div></div>
     <p>La <b>ley de Conway</b>: los sistemas acaban copiando la estructura de comunicación de la organización. Los microservicios tienen sentido cuando hay varios equipos que necesitan desplegar sin coordinarse. Con un equipo de seis personas, suelen ser un coste sin beneficio.</p>
     <div class="nota ojo"><b class="tit">El monolito distribuido</b>Servicios que comparten base de datos o que deben desplegarse juntos: lo peor de los dos mundos.</div>`},
 {t:"info", eti:"Piezas", h:"Gateway, BFF, mesh y estrangulador",
  c:`<div class="dg"><div class="dg-tit">entrada a los servicios</div>
<div class="dg-vert">
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja base">app móvil</div><div class="dg-caja base">web</div><div class="dg-caja base">socios (API pública)</div></div></div>
<div class="dg-caja acento doble">API gateway<small>autenticación, límites de tasa, enrutado, TLS</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja doble">BFF móvil<small>compone para la app</small></div><div class="dg-caja doble">BFF web</div></div></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja ok">pedidos + su BD</div><div class="dg-caja ok">catálogo + su BD</div><div class="dg-caja ok">pagos + su BD</div></div></div>
</div>
<div class="dg-nota arriba">entre servicios, un service mesh (Istio, Linkerd) puede poner mTLS, reintentos y métricas sin tocar el código</div></div>
     <p><b>Patrón estrangulador</b> (strangler fig): para migrar un monolito, se pone un proxy delante y se van desviando rutas una a una a servicios nuevos, hasta que el monolito queda vacío. Nunca una reescritura «big bang».</p>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["API gateway","Punto de entrada único: autenticación, límites, enrutado"],["BFF","Backend específico que compone datos para un tipo de cliente"],["Service mesh","mTLS, reintentos y telemetría entre servicios mediante proxies"],["Base de datos por servicio","Cada servicio es dueño de sus datos y nadie más los toca"],["Patrón estrangulador","Migrar un monolito ruta a ruta detrás de un proxy"]],
  why:"En una entrevista, justificar por qué NO partir (todavía) también es una respuesta de sénior."},
 {t:"opcion", p:"Una startup de 5 ingenieros quiere empezar con 12 microservicios «para escalar». ¿Qué le recomendarías?",
  ops:["Adelante, cuantos más mejor","Un monolito modular con límites claros por dominio, y extraer servicios cuando haya equipos o necesidades de escalado distintas que lo justifiquen","Un único fichero","Serverless para todo sin pensar"],
  ok:1, why:"Los límites mal elegidos al principio son carísimos de mover entre servicios; dentro de un monolito se mueven con un refactor."},
 {t:"opcion", p:"El servicio de pedidos lee directamente las tablas del servicio de clientes para ahorrarse una llamada. ¿Qué problema crea?",
  ops:["Ninguno, es más rápido","Acoplamiento: clientes ya no puede cambiar su esquema sin romper a pedidos; es un monolito distribuido","Más latencia","Problemas de TLS"],
  ok:1, why:"Si necesita los datos, que los pida por API o mantenga una copia local alimentada por eventos."},
 {t:"vf", p:"Pasar a microservicios mejora automáticamente el rendimiento de la aplicación.",
  ok:false, why:"Cada llamada que antes era una función ahora es una petición de red con su latencia y sus fallos. Se gana en independencia de equipos y en escalado selectivo, no en velocidad bruta."},
 {t:"orden", p:"Ordena los pasos para extraer el módulo de facturación de un monolito con el patrón estrangulador",
  items:["Aislar facturación como módulo con una interfaz clara dentro del monolito","Crear el servicio nuevo con su propia base de datos","Sincronizar los datos (doble escritura controlada o CDC) y comparar resultados","Desviar el tráfico de facturación al servicio nuevo poco a poco","Retirar el código y las tablas viejas del monolito"],
  why:"Primero la frontera en código (barato de corregir), luego la frontera de red. Y siempre con marcha atrás posible hasta el final."}
]}

]});
