window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "Qué es una red",
resumen: "Dispositivos, paquetes, protocolos y los modelos OSI y TCP/IP explicados desde cero",
nivel: "Fundamentos",
color: "#6dd3f2",
lecciones: [

{
id:"rd1l1",
titulo:"Ordenadores que hablan entre sí",
claves:["Una red es un conjunto de dispositivos conectados que intercambian datos","LAN es una red local; WAN une redes lejanas; internet es la red de redes","Cliente pide, servidor responde"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué es una red?",
  c:`<p>Una <b>red</b> es un conjunto de dispositivos (ordenadores, móviles, servidores, impresoras) conectados para <b>intercambiar datos</b>. Cuando abres una web, tu navegador envía una petición por la red a un servidor, y el servidor te devuelve la página por el mismo camino.</p>
     <p>Todo lo que harás como desarrollador backend o DevOps pasa por la red: tu API recibe peticiones, se conecta a la base de datos, los contenedores hablan entre sí, Kubernetes enruta tráfico. Entender la red es entender por qué algo «no conecta».</p>`},
 {t:"info", eti:"Tamaños", h:"LAN, WAN e internet",
  c:`<ul><li><b>LAN</b> (Local Area Network): la red de tu casa u oficina. Los dispositivos están cerca y conectados por cable o Wi-Fi a un mismo equipo (el router de casa).</li>
     <li><b>WAN</b> (Wide Area Network): une redes lejanas entre sí, por ejemplo las oficinas de una empresa en dos ciudades.</li>
     <li><b>Internet</b>: la red de redes. Millones de redes independientes (de proveedores, empresas, universidades, nubes) interconectadas que se ponen de acuerdo en cómo intercambiar datos.</li></ul>
     <div class="dg"><div class="dg-tit">de tu casa al servidor web</div><div class="dg-flujo">
     <div class="dg-caja" style="flex-basis:80px">portátil · móvil · tele<small>LAN</small></div>
     <div class="dg-caja acento" style="flex-basis:80px">router de casa</div>
     <div class="dg-caja base" style="flex-basis:80px">tu proveedor</div>
     <div class="dg-caja base" style="flex-basis:80px">internet</div>
     <div class="dg-caja base" style="flex-basis:80px">red de la nube</div>
     <div class="dg-caja ok" style="flex-basis:80px">servidor web<small>centro de datos</small></div>
     </div></div>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["LAN","Red local: casa, oficina"],["WAN","Red que une ubicaciones lejanas"],["Internet","La red mundial formada por muchas redes"],["Router","Equipo que conecta una red con otras"],["Servidor","Máquina que ofrece un servicio a otras"]],
  why:"Estos términos aparecen en cualquier conversación técnica sobre infraestructura."},
 {t:"info", eti:"Roles", h:"Cliente y servidor",
  c:`<p>En casi toda comunicación hay dos papeles:</p>
     <ul><li>El <b>cliente</b> inicia la conversación: tu navegador, una app móvil, tu API cuando consulta la base de datos.</li>
     <li>El <b>servidor</b> espera peticiones y responde: un servidor web, PostgreSQL, tu API de Spring Boot.</li></ul>
     <p>Un mismo programa puede ser las dos cosas: tu API es <b>servidor</b> para el navegador y <b>cliente</b> de la base de datos.</p>`},
 {t:"opcion", p:"Tu API de Spring Boot consulta PostgreSQL. En esa conversación concreta, ¿qué papel tiene la API?",
  ops:["Servidor","Cliente","Router","Ninguno"],
  ok:1, why:"Quien inicia la conexión es el cliente. La API se conecta a PostgreSQL, que escucha y responde."},
 {t:"vf", p:"Internet es una única red gestionada por una sola empresa.",
  ok:false, why:"Es una interconexión de decenas de miles de redes independientes que acuerdan protocolos comunes."},
 {t:"opcion", p:"Tu portátil, tu móvil y la tele están conectados al Wi-Fi de casa. ¿Qué forman entre ellos?",
  ops:["Una WAN","Una LAN","Internet","Un centro de datos"],
  ok:1, why:"Están en la misma red local, detrás del mismo router. Para salir a internet, el router usa el enlace con tu proveedor, que ya es parte de la WAN."},
 {t:"escribe", p:"¿Cómo se llama el programa o máquina que <b>inicia</b> una comunicación pidiendo algo a otro?",
  sol:["cliente","el cliente"], pista:"Es el papel contrario al de servidor.",
  why:"El cliente abre la conexión; el servidor escucha en un puerto conocido y responde. Casi todos los diagnósticos empiezan por saber quién es cada uno."}
]},

{
id:"rd1l2",
titulo:"Paquetes y protocolos",
claves:["Los datos viajan troceados en paquetes","Un protocolo es un conjunto de reglas para comunicarse","Cada paquete lleva cabeceras con origen, destino y control"],
pasos:[
 {t:"info", eti:"Trocear", h:"Los datos viajan en paquetes",
  c:`<p>Una imagen de 2 MB no viaja «entera». Se divide en <b>paquetes</b> pequeños (normalmente de hasta unos 1500 bytes). Cada paquete viaja por su cuenta y, al llegar, se reordenan y se reconstruye el archivo.</p>
     <p>Ventajas: si se pierde un paquete, solo se reenvía ese; y muchas comunicaciones pueden compartir los mismos cables intercalando sus paquetes.</p>
     <div class="dg"><div class="dg-tit">un fichero troceado en paquetes</div><div class="dg-vert">
     <div class="dg-caja acento">imagen.png (2 MB)</div>
     <div class="dg-caja base" style="padding:8px"><div class="dg-fila" style="display:flex;flex-wrap:wrap"><div class="dg-caja" style="flex:1 1 96px;padding:0;overflow:hidden;font-size:12.5px;display:flex;white-space:nowrap"><span style="background:var(--accent-soft);color:var(--accent);font-weight:600;padding:6px 5px;border-right:1.5px solid var(--accent)">cab</span><span style="padding:6px 5px;flex:1">trozo 1</span></div><div class="dg-caja" style="flex:1 1 96px;padding:0;overflow:hidden;font-size:12.5px;display:flex;white-space:nowrap"><span style="background:var(--accent-soft);color:var(--accent);font-weight:600;padding:6px 5px;border-right:1.5px solid var(--accent)">cab</span><span style="padding:6px 5px;flex:1">trozo 2</span></div><div class="dg-caja" style="flex:1 1 96px;padding:0;overflow:hidden;font-size:12.5px;display:flex;white-space:nowrap"><span style="background:var(--accent-soft);color:var(--accent);font-weight:600;padding:6px 5px;border-right:1.5px solid var(--accent)">cab</span><span style="padding:6px 5px;flex:1">trozo 3</span></div><div class="dg-caja" style="flex:1 1 96px;padding:6px 5px;border-style:dashed;color:var(--ink-3)">…</div><div class="dg-caja" style="flex:1 1 96px;padding:0;overflow:hidden;font-size:12.5px;display:flex;white-space:nowrap"><span style="background:var(--accent-soft);color:var(--accent);font-weight:600;padding:6px 5px;border-right:1.5px solid var(--accent)">cab</span><span style="padding:6px 5px;flex:1">trozo 1400</span></div></div></div>
     </div>
     <div class="dg-nota arriba" style="margin-top:8px">cada «cab» (cabecera) dice: de dónde viene, a dónde va, qué número es</div></div>`},
 {t:"info", eti:"Reglas", h:"¿Qué es un protocolo?",
  c:`<p>Un <b>protocolo</b> es un acuerdo sobre <b>cómo</b> comunicarse: qué formato tienen los mensajes, quién habla primero, qué se responde, qué pasa si algo falla. Igual que al llamar por teléfono uno dice «¿diga?» y el otro se presenta.</p>
     <p>Protocolos que verás constantemente:</p>
     <ul><li><b>IP</b>: cómo direccionar y llevar paquetes de una máquina a otra.</li>
     <li><b>TCP</b> y <b>UDP</b>: cómo entregar datos a un programa concreto.</li>
     <li><b>DNS</b>: cómo traducir nombres (google.com) a direcciones.</li>
     <li><b>HTTP</b>: cómo pedir y devolver páginas y APIs.</li>
     <li><b>TLS</b>: cómo cifrar la comunicación (la «S» de HTTPS).</li></ul>`},
 {t:"par", p:"Empareja cada protocolo con su trabajo",
  pares:[["IP","Llevar paquetes de una máquina a otra"],["TCP","Entregar datos fiables y en orden a un programa"],["DNS","Traducir nombres a direcciones IP"],["HTTP","Pedir y servir páginas y APIs"],["TLS","Cifrar la comunicación"]],
  why:"Estos cinco protocolos cubren casi todo lo que ocurre cuando abres una web."},
 {t:"opcion", p:"¿Por qué se dividen los datos en paquetes?",
  ops:["Para que ocupen menos","Para reenviar solo lo que se pierde y compartir las líneas entre muchas comunicaciones","Porque los cables solo transmiten letras","Para cifrarlos"],
  ok:1, why:"La conmutación de paquetes es la idea fundamental de internet."},
 {t:"vf", p:"Todos los paquetes de un mismo fichero siguen obligatoriamente el mismo camino.",
  ok:false, why:"Cada paquete se enruta de forma independiente; pueden llegar por caminos distintos y desordenados. TCP los reordena."},
 {t:"escribe", p:"Los protocolos de internet se publican como documentos numerados de la IETF (por ejemplo, el 9293 describe TCP). ¿Cómo se llaman esos documentos? (siglas)",
  sol:["RFC","RFCs","Request for Comments"], pista:"Tres letras: Request For…",
  why:"Los RFC son la fuente de verdad. Cuando dos implementaciones discuten sobre cómo debe comportarse HTTP o DNS, se consulta el RFC."},
 {t:"opcion", p:"Descargas un fichero de 3 MB y se pierde un paquete por el camino. ¿Qué pasa con TCP?",
  ops:["Se vuelve a descargar el fichero entero","Se reenvía solo el paquete perdido","El fichero llega corrupto sin avisar","Se corta la conexión"],
  ok:1, why:"TCP detecta el hueco por los números de secuencia y retransmite solo lo que falta. Esa es una de las ventajas de trocear en paquetes."}
]},

{
id:"rd1l3",
titulo:"El modelo en capas: OSI y TCP/IP",
claves:["La red se organiza en capas; cada una resuelve un problema","OSI tiene 7 capas; TCP/IP, 4 (enlace, internet, transporte, aplicación)","Capa 2 = MAC/switch, capa 3 = IP/router, capa 4 = TCP/UDP, capa 7 = HTTP"],
pasos:[
 {t:"info", eti:"Dividir el problema", h:"¿Por qué capas?",
  c:`<p>Comunicar dos programas en continentes distintos es un problema enorme. Se divide en <b>capas</b>: cada una se ocupa de una parte y usa los servicios de la de abajo, sin preocuparse de cómo funcionan.</p>
     <p>Por ejemplo, HTTP no sabe si viajas por fibra, Wi-Fi o 5G. Solo le pide a TCP «entrega estos bytes». Y TCP le pide a IP «lleva este paquete a esta dirección».</p>`},
 {t:"info", eti:"El modelo teórico", h:"Las 7 capas de OSI",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">las 7 capas del modelo OSI</div><table class="dg-tabla"><thead><tr><th>Capa</th><th>Ejemplos</th><th>Qué resuelve</th></tr></thead><tbody><tr><td>7 Aplicación</td><td>HTTP, DNS, SSH, SMTP</td><td>lo que usan los programas</td></tr><tr><td>6 Presentación</td><td>formato, cifrado</td><td>(en la práctica, dentro de la 7)</td></tr><tr><td>5 Sesión</td><td>mantener diálogos</td><td>(en la práctica, dentro de la 7)</td></tr><tr><td>4 Transporte</td><td>TCP, UDP, puertos</td><td>de programa a programa</td></tr><tr><td>3 Red</td><td>IP, routers</td><td>de máquina a máquina, entre redes</td></tr><tr><td>2 Enlace</td><td>Ethernet, MAC, switches</td><td>dentro de la misma red local</td></tr><tr><td>1 Física</td><td>cables, radio, señales</td><td>bits por el medio físico</td></tr></tbody></table></div>
     <p>En el día a día se habla de «capa 2», «capa 3», «capa 4» y «capa 7». Un «balanceador de capa 4» reparte conexiones TCP; uno «de capa 7» entiende HTTP y puede decidir según la URL.</p>`},
 {t:"info", eti:"El modelo real", h:"TCP/IP: 4 capas",
  c:`<p>Internet usa en realidad el modelo <b>TCP/IP</b>, más simple:</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">las 4 capas de TCP/IP y su equivalencia en OSI</div><table class="dg-tabla"><thead><tr><th>Capa TCP/IP</th><th>Equivale en OSI</th><th>Protocolos</th></tr></thead><tbody><tr><td>Aplicación</td><td>(OSI 5-7)</td><td>HTTP, DNS, TLS, SSH</td></tr><tr><td>Transporte</td><td>(OSI 4)</td><td>TCP, UDP</td></tr><tr><td>Internet</td><td>(OSI 3)</td><td>IP, ICMP</td></tr><tr><td>Enlace</td><td>(OSI 1-2)</td><td>Ethernet, Wi-Fi</td></tr></tbody></table></div>`},
 {t:"orden", p:"Ordena las capas de OSI de abajo (1) a arriba (7)",
  items:["Física","Enlace","Red","Transporte","Sesión","Presentación","Aplicación"],
  why:"Truco para recordarlo: «Fui En Rojo Todo Sin Pensar Antes»."},
 {t:"par", p:"Empareja cada elemento con su capa",
  pares:[["Cable y señal eléctrica","Capa 1 (física)"],["Dirección MAC y switch","Capa 2 (enlace)"],["Dirección IP y router","Capa 3 (red)"],["Puertos TCP y UDP","Capa 4 (transporte)"],["HTTP y DNS","Capa 7 (aplicación)"]],
  why:"Saber en qué capa está un problema acota muchísimo dónde buscar."},
 {t:"opcion", p:"Un balanceador que decide a qué servidor enviar la petición según la ruta de la URL (<code>/api</code> o <code>/web</code>) es de capa...",
  ops:["2","3","4","7"],
  ok:3, why:"Para leer la URL tiene que entender HTTP, que es capa de aplicación (7)."},
 {t:"escribe", p:"¿En qué capa de OSI trabaja un router? (escribe el número)",
  sol:["3","capa 3","la 3"], pista:"Es la capa de las direcciones IP.",
  why:"El router decide por la IP de destino: capa 3. Por eso se habla de «switch de capa 3» cuando un switch también enruta."},
 {t:"vf", p:"En internet, las capas 5 y 6 de OSI casi nunca aparecen como protocolos separados: sus funciones las hace la propia aplicación o TLS.",
  ok:true, why:"OSI es un modelo de referencia; TCP/IP es lo que se implementó. Sirve para hablar («es un problema de capa 2»), no como mapa exacto de protocolos."}
]},

{
id:"rd1l4",
titulo:"Encapsulación: el viaje de un paquete",
claves:["Cada capa añade su cabecera al bajar y la quita al subir","Trama (capa 2) contiene paquete IP (capa 3) que contiene segmento TCP (capa 4) que contiene datos","Los routers miran hasta la capa 3; los switches hasta la 2"],
pasos:[
 {t:"info", eti:"Muñecas rusas", h:"Encapsular",
  c:`<p>Al enviar, cada capa <b>envuelve</b> lo que recibe de arriba con su propia cabecera:</p>
     <div class="dg"><div class="dg-tit">encapsulación: cada capa añade su cabecera</div><div class="dg-pila" style="gap:12px">
     <div class="dg-col"><div class="dg-col-tit" style="text-align:left;font-size:12.5px">datos HTTP</div><div class="dg-fila" style="display:flex"><div class="dg-caja ok" style="flex:2.5 1 70px;padding:7px 4px;font-size:12px">GET /api/tareas ...</div></div></div>
     <div class="dg-col"><div class="dg-col-tit" style="text-align:left;font-size:12.5px">+ cabecera TCP (puertos)</div><div class="dg-fila" style="display:flex"><div class="dg-caja acento" style="flex:1.5 1 80px;padding:7px 4px;font-size:12px">TCP 51234→443</div><div class="dg-caja ok" style="flex:2 1 70px;padding:7px 4px;font-size:12px">GET /api/tareas ...</div></div></div>
     <div class="dg-col"><div class="dg-col-tit" style="text-align:left;font-size:12.5px">+ cabecera IP (direcciones)</div><div class="dg-fila" style="display:flex"><div class="dg-caja acento" style="flex:1.2 1 60px;padding:7px 4px;font-size:12px">IP a→b</div><div class="dg-caja" style="flex:1.5 1 80px;padding:7px 4px;font-size:12px">TCP 51234→443</div><div class="dg-caja ok" style="flex:1.2 1 70px;padding:7px 4px;font-size:12px">GET ...</div></div></div>
     <div class="dg-col"><div class="dg-col-tit" style="text-align:left;font-size:12.5px">+ cabecera Ethernet (MAC)</div><div class="dg-fila" style="display:flex"><div class="dg-caja acento" style="flex:0.7 1 36px;padding:7px 4px;font-size:12px">Eth</div><div class="dg-caja" style="flex:1.2 1 60px;padding:7px 4px;font-size:12px">IP a→b</div><div class="dg-caja" style="flex:1.5 1 80px;padding:7px 4px;font-size:12px">TCP 51234→443</div><div class="dg-caja ok" style="flex:1.2 1 70px;padding:7px 4px;font-size:12px">GET ...</div><div class="dg-caja acento" style="flex:0.6 1 34px;padding:7px 4px;font-size:12px">fin</div></div></div>
     </div>
     <div class="dg-leyenda"><span><i class="acento"></i>cabecera que añade esa capa</span><span><i></i>cabeceras de capas de arriba</span><span><i style="border-color:var(--ok);background:var(--ok-soft)"></i>datos de la aplicación</span></div></div>
     <p>Al recibir, cada capa quita su cabecera y pasa el contenido a la de arriba. A esto se le llama <b>desencapsular</b>.</p>`},
 {t:"par", p:"Empareja cada nombre con la unidad de datos de su capa",
  pares:[["Trama (frame)","Capa 2: Ethernet"],["Paquete","Capa 3: IP"],["Segmento","Capa 4: TCP"],["Datagrama","Capa 4: UDP"],["Mensaje","Capa 7: aplicación"]],
  why:"En la práctica mucha gente dice «paquete» para todo, pero en una entrevista suma usar el nombre preciso."},
 {t:"info", eti:"Quién mira qué", h:"Cada equipo lee solo lo que necesita",
  c:`<ul><li>Un <b>switch</b> lee la cabecera Ethernet (capa 2) para saber a qué puerto enviar la trama.</li>
     <li>Un <b>router</b> quita la cabecera Ethernet, lee la IP de destino (capa 3), decide el siguiente salto y pone una cabecera Ethernet nueva para el siguiente tramo.</li>
     <li>Un <b>cortafuegos</b> suele mirar capas 3 y 4 (IPs y puertos).</li>
     <li>Un <b>proxy o balanceador de capa 7</b> llega hasta HTTP.</li></ul>
     <p>Consecuencia importante: las <b>direcciones MAC cambian en cada salto</b>, las <b>IP de origen y destino no</b> (salvo que haya NAT, que verás más adelante).</p>`},
 {t:"opcion", p:"Un paquete cruza tres routers hasta llegar al servidor. ¿Qué cambia en cada salto?",
  ops:["La IP de destino","Las direcciones MAC de la cabecera Ethernet","El puerto TCP","El contenido HTTP"],
  ok:1, why:"Cada tramo es una red local distinta con sus propias MAC. La IP identifica el destino final y se mantiene."},
 {t:"vf", p:"Un switch normal necesita leer la dirección IP para reenviar una trama.",
  ok:false, why:"Un switch clásico trabaja en capa 2: usa la MAC de destino. Los routers son los que usan la IP."},
 {t:"orden", p:"Ordena cómo el servidor desencapsula lo que recibe, de lo primero que quita a lo último",
  items:["Quita la cabecera Ethernet","Quita la cabecera IP","Quita la cabecera TCP","Entrega los datos HTTP a la aplicación"],
  why:"Al recibir se recorre la pila de abajo arriba: cada capa quita su cabecera y pasa el contenido a la siguiente."},
 {t:"escribe", p:"Una trama Ethernet lleva hasta 1500 bytes de datos. Si la cabecera IPv4 ocupa 20 bytes y la TCP otros 20 (sin opciones), ¿cuántos bytes de datos de la aplicación caben como máximo en un segmento?",
  sol:["1460","1460 bytes"], pista:"1500 − 20 − 20.",
  why:"Ese valor se llama MSS (Maximum Segment Size). Cada túnel o cabecera extra lo reduce, y de ahí salen muchos problemas de «las peticiones grandes se cuelgan»."}
]}

]});
