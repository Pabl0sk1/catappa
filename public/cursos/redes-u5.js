window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "DNS: los nombres de internet",
resumen: "Resolución paso a paso, tipos de registro, TTL y caché, dig y problemas de DNS en contenedores",
nivel: "Intermedio",
color: "#4fb8dc",
lecciones: [

{
id:"rd5l1",
titulo:"Cómo se resuelve un nombre",
claves:["DNS traduce nombres a direcciones IP","Jerarquía: raíz, dominios de primer nivel (.com), dominios autoritativos","El resolvedor recursivo hace el trabajo y guarda en caché"],
pasos:[
 {t:"info", eti:"La agenda de internet", h:"¿Qué es DNS?",
  c:`<p>Los ordenadores se conectan por IP, pero las personas recordamos nombres. El <b>DNS</b> (Domain Name System) es una base de datos distribuida por todo el mundo que traduce <code>api.miempresa.com</code> en <code>203.0.113.40</code>.</p>
     <p>Está organizada en <b>jerarquía</b>, leyendo el nombre de derecha a izquierda:</p>
     <div class="diag">.                         raiz (13 grupos de servidores en el mundo)
 '- com.                  dominio de primer nivel (TLD)
     '- miempresa.com.    dominio: sus servidores son los "autoritativos"
         '- api.miempresa.com   el nombre concreto</div>`},
 {t:"info", eti:"Paso a paso", h:"El viaje de una consulta",
  c:`<div class="diag">1. navegador: tengo api.miempresa.com en cache?  no
2. sistema operativo: en /etc/hosts o su cache?     no
3. pregunta al resolvedor recursivo (el del router, 8.8.8.8, 1.1.1.1...)
4. resolvedor -> raiz:         "quien lleva .com?"           -> "estos servidores"
5. resolvedor -> TLD .com:     "quien lleva miempresa.com?"  -> "ns1.proveedor.net"
6. resolvedor -> autoritativo: "api.miempresa.com?"          -> "203.0.113.40"
7. el resolvedor guarda la respuesta en cache y te la devuelve</div>
     <p>Casi siempre la respuesta ya está en alguna caché y todo tarda milisegundos.</p>`},
 {t:"orden", p:"Ordena la resolución de un nombre que nadie tiene en caché",
  items:["El equipo pregunta al resolvedor recursivo","El resolvedor pregunta a los servidores raíz","Pregunta a los servidores del TLD (.com)","Pregunta al servidor autoritativo del dominio","Guarda la respuesta en caché y la devuelve"],
  why:"Explicar este flujo es otra pregunta clásica de entrevista («¿qué pasa al escribir una URL en el navegador?»)."},
 {t:"par", p:"Empareja cada pieza del DNS con su papel",
  pares:[["Resolvedor recursivo","Hace las preguntas por ti y guarda en caché"],["Servidor raíz","Sabe quién gestiona cada TLD"],["Servidor del TLD","Sabe quién gestiona cada dominio .com"],["Servidor autoritativo","Tiene la respuesta definitiva del dominio"],["/etc/hosts","Tabla local que se consulta antes que el DNS"]],
  why:"/etc/hosts es útil para pruebas: fuerzas que un nombre apunte a la IP que quieras en tu máquina."},
 {t:"vf", p:"Cada vez que abres una web, tu ordenador consulta a los servidores raíz.",
  ok:false, why:"Casi siempre la respuesta está en caché (navegador, sistema, resolvedor). Los servidores raíz reciben solo una fracción."}
]},

{
id:"rd5l2",
titulo:"Tipos de registro y TTL",
claves:["A (IPv4), AAAA (IPv6), CNAME (alias), MX (correo), TXT (verificaciones), NS (servidores del dominio)","El TTL dice cuántos segundos puede cachearse una respuesta","Bajar el TTL antes de una migración para que el cambio se propague rápido"],
pasos:[
 {t:"info", eti:"El contenido", h:"Registros DNS",
  c:`<div class="termbox">miempresa.com.        3600  IN  A      203.0.113.40
miempresa.com.        3600  IN  AAAA   2001:db8::40
www.miempresa.com.    3600  IN  CNAME  miempresa.com.
api.miempresa.com.     300  IN  CNAME  mi-alb-123.eu-west-1.elb.amazonaws.com.
miempresa.com.        3600  IN  MX     10 mail.miempresa.com.
miempresa.com.        3600  IN  TXT    "v=spf1 include:_spf.google.com ~all"
miempresa.com.       86400  IN  NS     ns1.proveedor.net.</div>
     <p>El número tras el nombre es el <b>TTL</b> en segundos.</p>`},
 {t:"par", p:"Empareja cada tipo de registro con su uso",
  pares:[["A","Nombre a dirección IPv4"],["AAAA","Nombre a dirección IPv6"],["CNAME","Alias hacia otro nombre"],["MX","Servidores de correo del dominio"],["TXT","Texto libre: verificaciones, SPF, DKIM"],["NS","Servidores autoritativos del dominio"]],
  why:"Para validar un certificado o un dominio en Google o AWS casi siempre te piden crear un TXT o un CNAME."},
 {t:"info", eti:"Caché", h:"TTL y «propagación»",
  c:`<p>El <b>TTL</b> (Time To Live) indica cuánto tiempo pueden los resolvedores guardar la respuesta. Si cambias la IP de un registro con TTL de 86400 (un día), algunos usuarios seguirán yendo a la IP vieja hasta 24 horas.</p>
     <p>Por eso, antes de una migración: <b>bajas el TTL</b> (por ejemplo a 60) con antelación, esperas a que caduque el TTL antiguo, haces el cambio y, cuando todo va bien, lo subes de nuevo.</p>`},
 {t:"opcion", p:"Vas a mover tu web a otro servidor el viernes. El registro A tiene TTL de 86400. ¿Qué haces el miércoles?",
  ops:["Nada","Bajar el TTL a unos minutos para que el viernes el cambio llegue enseguida a todos","Borrar el registro","Subir el TTL"],
  ok:1, why:"Así el viernes, al cambiar la IP, las cachés solo guardan la antigua unos minutos."},
 {t:"opcion", p:"¿Por qué no puedes poner un CNAME en el dominio raíz (<code>miempresa.com</code>) en DNS estándar?",
  ops:["Porque es de pago","Porque un CNAME no puede coexistir con otros registros, y la raíz necesita NS y SOA","Porque los CNAME solo valen para correo","Sí se puede siempre"],
  ok:1, why:"Los proveedores lo resuelven con registros especiales (ALIAS, ANAME, o los alias de Route 53)."},
 {t:"vf", p:"Un registro CNAME apunta directamente a una dirección IP.",
  ok:false, why:"Un CNAME apunta a otro nombre, que a su vez se resuelve. Para una IP se usa A o AAAA."}
]},

{
id:"rd5l3",
titulo:"Consultar el DNS con dig",
claves:["dig nombre tipo muestra la respuesta completa","dig +short para solo el resultado; @servidor para preguntar a uno concreto","nslookup existe en casi todas partes, también en Windows"],
pasos:[
 {t:"info", eti:"La herramienta", h:"dig",
  c:`<div class="termbox">pablo@portatil:~$ dig api.miempresa.com
;; ANSWER SECTION:
api.miempresa.com.   300  IN  CNAME  mi-alb-123.eu-west-1.elb.amazonaws.com.
mi-alb-123.eu-west-1.elb.amazonaws.com. 60 IN A 52.18.4.10
mi-alb-123.eu-west-1.elb.amazonaws.com. 60 IN A 34.240.7.22
;; Query time: 23 msec
;; SERVER: 192.168.1.1#53</div>
     <div class="termbox">dig +short api.miempresa.com          <span class="cm"># solo las respuestas</span>
dig miempresa.com MX                  <span class="cm"># un tipo concreto</span>
dig @8.8.8.8 api.miempresa.com        <span class="cm"># preguntar a otro resolvedor</span>
dig +trace api.miempresa.com          <span class="cm"># seguir la cadena desde la raiz</span>
nslookup api.miempresa.com            <span class="cm"># alternativa universal</span></div>`},
 {t:"term", p:"Consulta solo el resultado de los registros MX de <code>miempresa.com</code>",
  prompt:"pablo@portatil:~$", sol:["dig +short miempresa.com mx","dig miempresa.com mx +short","dig +short mx miempresa.com","dig mx miempresa.com +short"],
  pista:"dig, +short, el dominio y el tipo MX.",
  salida:`10 mail.miempresa.com.
20 mail2.miempresa.com.`, why:"El número es la prioridad: primero se intenta el menor."},
 {t:"opcion", p:"En tu portátil un nombre resuelve a la IP vieja, pero <code>dig @8.8.8.8</code> ya da la nueva. ¿Qué pasa?",
  ops:["El DNS está roto","Tu resolvedor local (o tu sistema) tiene en caché la respuesta antigua hasta que caduque el TTL","8.8.8.8 miente","Hay que reiniciar el servidor web"],
  ok:1, why:"Preguntar a distintos resolvedores permite distinguir un problema de caché de uno de configuración."},
 {t:"par", p:"Empareja cada opción de dig con su efecto",
  pares:[["+short","Mostrar solo las respuestas"],["@1.1.1.1","Preguntar a ese resolvedor"],["+trace","Seguir la resolución desde la raíz"],["MX","Pedir los registros de correo"]],
  why:"dig +trace muestra exactamente en qué nivel de la jerarquía falla una delegación."},
 {t:"vf", p:"Si <code>dig</code> resuelve bien un nombre, está garantizado que el servicio en esa IP responde.",
  ok:false, why:"DNS solo da la dirección. Luego hay que comprobar la conectividad (puerto, cortafuegos) y el propio servicio."}
]},

{
id:"rd5l4",
titulo:"DNS dentro de Docker y Kubernetes",
claves:["Docker tiene un DNS interno (127.0.0.11) en las redes definidas por el usuario","En Kubernetes, CoreDNS resuelve servicio.namespace.svc.cluster.local","ndots y los dominios de búsqueda explican muchas consultas extra y lentitudes"],
pasos:[
 {t:"info", eti:"Contenedores", h:"Nombres entre contenedores",
  c:`<p>En una red de Docker creada por ti (o en Compose), cada contenedor puede llamar a otro <b>por el nombre del servicio</b>: <code>jdbc:postgresql://db:5432/app</code>. Lo resuelve el DNS interno de Docker en <code>127.0.0.11</code>.</p>
     <p>En la red <code>bridge</code> por defecto esto <b>no funciona</b>: solo en redes definidas por el usuario.</p>`},
 {t:"info", eti:"Kubernetes", h:"CoreDNS",
  c:`<p>Cada Service de Kubernetes recibe un nombre DNS:</p>
     <div class="diag">api                                  (desde el mismo namespace)
api.pagos                            (desde otro namespace)
api.pagos.svc.cluster.local          (nombre completo)</div>
     <p>El <code>/etc/resolv.conf</code> de cada pod incluye <b>dominios de búsqueda</b> y <code>ndots:5</code>: un nombre con menos de 5 puntos se prueba primero añadiendo cada dominio de búsqueda. Consultar <code>api.externa.com</code> genera varias consultas fallidas antes de la buena. Terminar el nombre en punto (<code>api.externa.com.</code>) lo evita.</p>`},
 {t:"par", p:"Empareja cada nombre con desde dónde funciona",
  pares:[["db (en Compose)","Otros contenedores de la misma red de Compose"],["api","Pods del mismo namespace de Kubernetes"],["api.pagos","Pods de cualquier namespace"],["api.pagos.svc.cluster.local","Nombre completo dentro del clúster"]],
  why:"Si una llamada entre namespaces falla con el nombre corto, casi siempre es porque falta el namespace."},
 {t:"opcion", p:"Dos contenedores lanzados con <code>docker run</code> sin especificar red no se encuentran por nombre. ¿Solución?",
  ops:["Usar IPs fijas","Crear una red con docker network create y conectar ambos a ella","Reiniciar Docker","Usar el puerto 53"],
  ok:1, why:"Las redes definidas por el usuario tienen DNS automático entre contenedores."},
 {t:"vf", p:"«It's always DNS» es una broma habitual porque muchos incidentes acaban siendo problemas de resolución de nombres.",
  ok:true, why:"Cachés, TTLs, dominios de búsqueda, CoreDNS saturado... Descarta DNS pronto al depurar."}
]}

]});
