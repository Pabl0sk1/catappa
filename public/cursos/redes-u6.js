window.CURSOS = window.CURSOS || {};
(CURSOS.redes = CURSOS.redes || []).push({
titulo: "DNS: los nombres de internet",
resumen: "Resolución paso a paso, tipos de registro, TTL y caché, dig, DNS en contenedores, delegación, DNSSEC y DNS cifrado",
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
     <div class="dg dg-arbol"><div class="dg-tit">la jerarquía de nombres</div><div class="rama" style="--n:0"><span class="nom carpeta">.</span><span class="coment">raíz (13 grupos de servidores en el mundo)</span></div><div class="rama" style="--n:1"><span class="nom carpeta">com.</span><span class="coment">dominio de primer nivel (TLD)</span></div><div class="rama" style="--n:2"><span class="nom carpeta">miempresa.com.</span><span class="coment">dominio: sus servidores son los «autoritativos»</span></div><div class="rama" style="--n:3"><span class="nom">api.miempresa.com</span><span class="coment">el nombre concreto</span></div></div>`},
 {t:"info", eti:"Paso a paso", h:"El viaje de una consulta",
  c:`<div class="dg"><div class="dg-tit">resolución de api.miempresa.com</div><svg viewBox="0 0 400 514" width="100%" style="max-width:540px;display:block;margin:auto" role="img" aria-label="El resolvedor pregunta a la raíz, al TLD .com y al servidor autoritativo hasta obtener 203.0.113.40"><defs><marker id="fl-redes5-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker><marker id="fl-redes5-1-ok" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ok)"/></marker></defs><line x1="42" y1="46" x2="42" y2="510" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="2.4099999999999966" y="8" width="79.18" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="42" y="31.333333333333332" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">tu equipo</text><line x1="128" y1="46" x2="128" y2="510" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="84.9" y="8" width="86.2" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="128" y="31.333333333333332" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">resolvedor</text><line x1="200" y1="46" x2="200" y2="510" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="177.96" y="8" width="44.08" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="200" y="31.333333333333332" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">raíz</text><line x1="268" y1="46" x2="268" y2="510" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="245.18" y="8" width="45.64" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="268" y="24" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">TLD</text><text x="268" y="39" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-3)">.com</text><line x1="348" y1="46" x2="348" y2="510" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="297.88" y="8" width="100.24000000000001" height="38" rx="7" fill="var(--bg)" stroke="var(--line-2)" stroke-width="1.5"/><text x="348" y="31.333333333333332" text-anchor="middle" font-size="13" font-weight="700" font-family="var(--sans)" fill="var(--ink)">autoritativo</text><rect x="2" y="64" width="80" height="44" rx="6" fill="var(--bg-3)" stroke="var(--line-2)" stroke-width="1.5"/><text x="42" y="82" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)">1 navegador</text><text x="42" y="98" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)">2 SO</text><text x="85" y="135" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">3</tspan></text><line x1="42" y1="147" x2="125" y2="147" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes5-1)"/><text x="164" y="176" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">4</tspan> ¿.com?</text><line x1="128" y1="188" x2="197" y2="188" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes5-1)"/><text x="164" y="217" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round">servidores</text><line x1="200" y1="229" x2="131" y2="229" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#fl-redes5-1)"/><text x="198" y="258" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">5</tspan> ¿miempresa.com?</text><line x1="128" y1="270" x2="265" y2="270" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes5-1)"/><text x="198" y="299" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-family="var(--mono)">ns1.proveedor.net</tspan></text><line x1="268" y1="311" x2="131" y2="311" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#fl-redes5-1)"/><text x="238" y="340" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">6</tspan> ¿api.miempresa.com?</text><line x1="128" y1="352" x2="345" y2="352" stroke="var(--accent)" stroke-width="2" marker-end="url(#fl-redes5-1)"/><text x="238" y="381" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-family="var(--mono)">203.0.113.40</tspan></text><line x1="348" y1="393" x2="131" y2="393" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#fl-redes5-1)"/><rect x="74" y="411" width="108" height="28" rx="6" fill="var(--bg-3)" stroke="var(--line-2)" stroke-width="1.5"/><text x="128" y="429" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)">guarda en caché</text><text x="85" y="466" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-weight="700" font-family="var(--mono)">7</tspan></text><text x="85" y="482" text-anchor="middle" font-size="13" font-family="var(--sans)" fill="var(--ink)" paint-order="stroke" stroke="var(--bg-2)" stroke-width="4" stroke-linejoin="round"><tspan font-family="var(--mono)">203.0.113.40</tspan></text><line x1="128" y1="494" x2="45" y2="494" stroke="var(--ok)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#fl-redes5-1-ok)"/></svg><table class="dg-tabla" style="margin-top:12px"><tbody>
     <tr><td>1</td><td>navegador: ¿tengo api.miempresa.com en caché? No.</td></tr>
     <tr><td>2</td><td>sistema operativo: ¿en <code>/etc/hosts</code> o su caché? No.</td></tr>
     <tr><td>3</td><td>pregunta al resolvedor recursivo (el del router, 8.8.8.8, 1.1.1.1...)</td></tr>
     <tr><td>4</td><td>resolvedor → raíz: «¿quién lleva .com?» → «estos servidores»</td></tr>
     <tr><td>5</td><td>resolvedor → TLD .com: «¿quién lleva miempresa.com?» → «ns1.proveedor.net»</td></tr>
     <tr><td>6</td><td>resolvedor → autoritativo: «¿api.miempresa.com?» → «203.0.113.40»</td></tr>
     <tr><td>7</td><td>el resolvedor guarda la respuesta en caché y te la devuelve</td></tr>
     </tbody></table></div>
     <p>Casi siempre la respuesta ya está en alguna caché y todo tarda milisegundos.</p>`},
 {t:"orden", p:"Ordena la resolución de un nombre que nadie tiene en caché",
  items:["El equipo pregunta al resolvedor recursivo","El resolvedor pregunta a los servidores raíz","Pregunta a los servidores del TLD (.com)","Pregunta al servidor autoritativo del dominio","Guarda la respuesta en caché y la devuelve"],
  why:"Explicar este flujo es otra pregunta clásica de entrevista («¿qué pasa al escribir una URL en el navegador?»)."},
 {t:"par", p:"Empareja cada pieza del DNS con su papel",
  pares:[["Resolvedor recursivo","Hace las preguntas por ti y guarda en caché"],["Servidor raíz","Sabe quién gestiona cada TLD"],["Servidor del TLD","Sabe quién gestiona cada dominio .com"],["Servidor autoritativo","Tiene la respuesta definitiva del dominio"],["/etc/hosts","Tabla local que se consulta antes que el DNS"]],
  why:"/etc/hosts es útil para pruebas: fuerzas que un nombre apunte a la IP que quieras en tu máquina."},
 {t:"vf", p:"Cada vez que abres una web, tu ordenador consulta a los servidores raíz.",
  ok:false, why:"Casi siempre la respuesta está en caché (navegador, sistema, resolvedor). Los servidores raíz reciben solo una fracción."},
 {t:"term", p:"Mira qué resolvedor DNS tiene configurado tu Linux leyendo el fichero clásico de configuración",
  prompt:"pablo@portatil:~$", sol:["cat /etc/resolv.conf","less /etc/resolv.conf","more /etc/resolv.conf"],
  salida:`# This is /run/systemd/resolve/stub-resolv.conf managed by man:systemd-resolved(8).
nameserver 127.0.0.53
options edns0 trust-ad
search lan`,
  pista:"Está en /etc y se llama resolv.conf.",
  why:"Con systemd-resolved, el sistema pregunta a un resolvedor local en 127.0.0.53 que a su vez reenvía a los reales. Para verlos: <code>resolvectl status</code>."},
 {t:"opcion", p:"Tu portátil pide <code>api.miempresa.com</code> al resolvedor y este hace todo el recorrido (raíz, TLD, autoritativo) por ti. ¿Cómo se llama cada tipo de consulta?",
  ops:["Las dos son recursivas","Tu equipo hace una consulta recursiva; el resolvedor, consultas iterativas a cada nivel","Las dos son iterativas","Tu equipo hace consultas iterativas y el resolvedor una recursiva"],
  ok:1, why:"Recursiva: «dame la respuesta final». Iterativa: «dime a quién preguntar después». Los raíz y TLD solo responden de forma iterativa, con referencias."}
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
  ok:false, why:"Un CNAME apunta a otro nombre, que a su vez se resuelve. Para una IP se usa A o AAAA."},
 {t:"info", eti:"Más registros", h:"SOA, PTR, SRV, CAA y HTTPS",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">otros registros que verás en producción</div><table class="dg-tabla"><thead><tr><th>tipo</th><th>para qué</th><th>ejemplo</th></tr></thead><tbody><tr><td>SOA</td><td>datos de la zona: servidor primario, número de serie y el TTL de las respuestas negativas</td><td><code>ns1.proveedor.net. admin... 2026092301 ...</code></td></tr><tr><td>PTR</td><td>DNS inverso: de IP a nombre. Lo gestiona quien es dueño de la IP (tu nube o tu operador)</td><td><code>40.113.0.203.in-addr.arpa. PTR api.miempresa.com.</code></td></tr><tr><td>SRV</td><td>servicio, puerto y prioridad</td><td><code>_sip._tcp.miempresa.com. SRV 10 5 5060 sip.miempresa.com.</code></td></tr><tr><td>CAA</td><td>qué autoridades pueden emitir certificados para el dominio</td><td><code>miempresa.com. CAA 0 issue "letsencrypt.org"</code></td></tr><tr><td>HTTPS / SVCB</td><td>anuncia HTTP/3, puertos y ECH antes de conectar</td><td><code>miempresa.com. HTTPS 1 . alpn="h2,h3"</code></td></tr></tbody></table></div>
     <p>El PTR importa sobre todo para el correo: muchos servidores rechazan mensajes de IPs sin DNS inverso coherente.</p>`},
 {t:"term", p:"Haz una consulta inversa de <code>8.8.8.8</code> y muestra solo el resultado",
  prompt:"pablo@portatil:~$", sol:["dig -x 8.8.8.8 +short","dig +short -x 8.8.8.8"],
  salida:`dns.google.`,
  pista:"dig tiene la opción -x para consultas inversas (PTR).",
  why:"<code>dig -x</code> construye por ti el nombre <code>8.8.8.8.in-addr.arpa</code> y pide su PTR. Útil para saber de quién es una IP que aparece en los logs."},
 {t:"opcion", p:"Let's Encrypt se niega a emitir un certificado para tu dominio con el error «CAA record prevents issuance». ¿Qué pasa?",
  ops:["El dominio ha caducado","Hay un registro CAA que solo autoriza a otra autoridad de certificación","El TTL es demasiado alto","Falta un registro MX"],
  ok:1, why:"CAA limita quién puede emitir certificados para tu dominio. Añade <code>0 issue \"letsencrypt.org\"</code> o elimina el registro que lo restringe."}
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
dig +trace api.miempresa.com          <span class="cm"># seguir la cadena desde la raíz</span>
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
  ok:false, why:"DNS solo da la dirección. Luego hay que comprobar la conectividad (puerto, cortafuegos) y el propio servicio."},
 {t:"par", p:"Empareja cada estado de la respuesta de <code>dig</code> (<code>status:</code>) con su significado",
  pares:[["NOERROR con respuestas","El nombre existe y tiene registros de ese tipo"],["NOERROR sin respuestas","El nombre existe pero no tiene registros de ese tipo (NODATA)"],["NXDOMAIN","El nombre no existe"],["SERVFAIL","El resolvedor no pudo obtener respuesta: autoritativos caídos o DNSSEC inválido"],["REFUSED","El servidor no acepta tu consulta"]],
  why:"NXDOMAIN apunta a un error de escritura o a un registro que no se creó; SERVFAIL, a un problema del lado de los servidores o de la firma DNSSEC."},
 {t:"term", p:"Pregunta directamente al resolvedor <code>1.1.1.1</code> por la IP de <code>api.miempresa.com</code>, mostrando solo el resultado",
  prompt:"pablo@portatil:~$", sol:["dig @1.1.1.1 +short api.miempresa.com","dig @1.1.1.1 api.miempresa.com +short","dig +short @1.1.1.1 api.miempresa.com","dig +short api.miempresa.com @1.1.1.1","dig api.miempresa.com @1.1.1.1 +short"],
  salida:`mi-alb-123.eu-west-1.elb.amazonaws.com.
52.18.4.10
34.240.7.22`,
  pista:"El servidor se indica con @ delante de su IP.",
  why:"Con +short se ve la cadena completa: primero el CNAME y luego las A del balanceador. Dos IPs porque el balanceador está en dos zonas."}
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
     <div class="dg dg-tabla-caja"><div class="dg-tit">nombres del Service api del namespace pagos</div><table class="dg-tabla"><tbody><tr><td>api</td><td>(desde el mismo namespace)</td></tr><tr><td>api.pagos</td><td>(desde otro namespace)</td></tr><tr><td>api.pagos.svc.cluster.local</td><td>(nombre completo)</td></tr></tbody></table></div>
     <p>El <code>/etc/resolv.conf</code> de cada pod incluye <b>dominios de búsqueda</b> y <code>ndots:5</code>: un nombre con menos de 5 puntos se prueba primero añadiendo cada dominio de búsqueda. Consultar <code>api.externa.com</code> genera varias consultas fallidas antes de la buena. Terminar el nombre en punto (<code>api.externa.com.</code>) lo evita.</p>`},
 {t:"par", p:"Empareja cada nombre con desde dónde funciona",
  pares:[["db (en Compose)","Otros contenedores de la misma red de Compose"],["api","Pods del mismo namespace de Kubernetes"],["api.pagos","Pods de cualquier namespace"],["api.pagos.svc.cluster.local","Nombre completo dentro del clúster"]],
  why:"Si una llamada entre namespaces falla con el nombre corto, casi siempre es porque falta el namespace."},
 {t:"opcion", p:"Dos contenedores lanzados con <code>docker run</code> sin especificar red no se encuentran por nombre. ¿Solución?",
  ops:["Usar IPs fijas","Crear una red con docker network create y conectar ambos a ella","Reiniciar Docker","Usar el puerto 53"],
  ok:1, why:"Las redes definidas por el usuario tienen DNS automático entre contenedores."},
 {t:"vf", p:"«It's always DNS» es una broma habitual porque muchos incidentes acaban siendo problemas de resolución de nombres.",
  ok:true, why:"Cachés, TTLs, dominios de búsqueda, CoreDNS saturado... Descarta DNS pronto al depurar."},
 {t:"term", p:"Muestra el fichero de configuración DNS dentro del pod <code>api-7c9f</code> (namespace <code>pagos</code>)",
  prompt:"pablo@portatil:~$", sol:["kubectl exec api-7c9f -n pagos -- cat /etc/resolv.conf","kubectl -n pagos exec api-7c9f -- cat /etc/resolv.conf","kubectl exec -n pagos api-7c9f -- cat /etc/resolv.conf","kubectl exec -it api-7c9f -n pagos -- cat /etc/resolv.conf","kubectl -n pagos exec -it api-7c9f -- cat /etc/resolv.conf"],
  salida:`search pagos.svc.cluster.local svc.cluster.local cluster.local eu-west-1.compute.internal
nameserver 10.96.0.10
options ndots:5`,
  pista:"kubectl exec, el pod, el namespace con -n y, tras --, el comando cat.",
  why:"<code>10.96.0.10</code> es el Service de CoreDNS. Con cuatro dominios de búsqueda y <code>ndots:5</code>, pedir <code>api.stripe.com</code> puede costar hasta 8 consultas (A y AAAA por cada sufijo) antes de la buena."},
 {t:"opcion", p:"Un pod hace miles de llamadas por minuto a <code>api.stripe.com</code> y CoreDNS va saturado de consultas NXDOMAIN. ¿Qué cambio es más directo?",
  ops:["Subir la CPU del pod","Usar el nombre completo con punto final (api.stripe.com.) o bajar ndots en el dnsConfig del pod","Quitar CoreDNS","Poner TTL 0"],
  ok:1, why:"Con el punto final el nombre se considera absoluto y no se prueban los dominios de búsqueda. También ayuda NodeLocal DNSCache, una caché DNS en cada nodo."}
]},

{
id:"rd6n1",
titulo:"DNS avanzado: delegación, DNSSEC y DNS cifrado",
claves:["Delegar una zona es publicar sus NS en la zona padre; si el nombre del NS está dentro de la zona, hacen falta registros glue","DNSSEC firma las respuestas (RRSIG, DNSKEY, DS): da autenticidad, no confidencialidad","DoT (853) y DoH (443) cifran la consulta entre el cliente y el resolvedor"],
pasos:[
 {t:"info", eti:"Delegación", h:"Zonas, delegación y caché negativa",
  c:`<p>Una <b>zona</b> es la parte del árbol DNS que gestiona un conjunto de servidores. <b>Delegar</b> <code>dev.miempresa.com</code> a otro equipo es crear en la zona <code>miempresa.com</code> sus registros NS apuntando a los servidores del equipo. Si esos servidores se llaman <code>ns1.dev.miempresa.com</code> (dentro de la propia zona delegada), la zona padre publica además sus IPs: son los registros <b>glue</b>, sin los que nadie podría encontrarlos.</p>
     <ul><li><b>Caché negativa</b>: un NXDOMAIN también se cachea, durante el mínimo entre el TTL del SOA y su último campo. Si consultaste un nombre antes de crearlo, puede seguir «sin existir» un rato.</li>
     <li><b>DNS de horizonte dividido</b> (<i>split horizon</i>): el mismo nombre resuelve a IP privada desde dentro de la red y a pública desde fuera. En AWS se hace con zonas privadas de Route 53 asociadas a la VPC.</li>
     <li><b>Anycast</b>: 1.1.1.1 u 8.8.8.8 no son un servidor, sino cientos anunciando la misma IP por BGP; respondes con el más cercano.</li></ul>`},
 {t:"info", eti:"Seguridad", h:"DNSSEC, DoT y DoH",
  c:`<p>El DNS clásico viaja <b>sin cifrar y sin firmar</b>: cualquiera en el camino puede leerlo y un atacante puede intentar colar respuestas falsas (envenenamiento de caché).</p>
     <ul><li><b>DNSSEC</b> añade <b>firmas</b>: cada conjunto de registros lleva un <code>RRSIG</code>, la zona publica su clave en <code>DNSKEY</code> y la zona padre publica un resumen de esa clave en un <code>DS</code>. Así se forma una <b>cadena de confianza</b> desde la raíz. Si una firma no cuadra, el resolvedor validador responde <b>SERVFAIL</b>. No cifra nada.</li>
     <li><b>DoT</b> (DNS over TLS, puerto <b>853</b>) y <b>DoH</b> (DNS over HTTPS, puerto 443) <b>cifran</b> la consulta entre tu equipo y el resolvedor. Los navegadores usan DoH, lo que puede saltarse el DNS interno de la empresa (se desactiva por política).</li></ul>
     <div class="nota ojo"><b class="tit">Error típico en producción</b>Cambiar de proveedor DNS, o rotar claves, sin actualizar el registro DS en el registrador. Los resolvedores validadores (8.8.8.8, 1.1.1.1) empiezan a devolver SERVFAIL y el dominio «desaparece» para medio internet.</div>`},
 {t:"orden", p:"Ordena la cadena de confianza de DNSSEC, de la raíz a la respuesta",
  items:["La clave de la raíz, conocida por el resolvedor","Registro DS de .com, firmado por la raíz","DNSKEY de .com, que coincide con ese DS","Registro DS de miempresa.com, firmado por .com","DNSKEY de miempresa.com","RRSIG que firma el registro A consultado"],
  why:"Cada eslabón firma el resumen de la clave del siguiente. Si uno falla, la validación entera falla."},
 {t:"vf", p:"DNSSEC impide que alguien en tu red vea qué dominios consultas.",
  ok:false, why:"DNSSEC garantiza autenticidad e integridad, no confidencialidad. Para ocultar las consultas hace falta DoT o DoH."},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["Registro glue","IP de un servidor de nombres que está dentro de la zona que sirve"],["RRSIG","Firma de un conjunto de registros"],["DS","Resumen de la clave de la zona hija, publicado en la padre"],["DoT","DNS cifrado con TLS en el puerto 853"],["Split horizon","Respuestas distintas según desde dónde se pregunte"]],
  why:"Con esto puedes leer cualquier <code>dig +dnssec</code> o <code>dig +trace</code> y saber qué falla."},
 {t:"opcion", p:"Creas el registro <code>nuevo.miempresa.com</code>, pero tu resolvedor sigue diciendo NXDOMAIN durante 30 minutos, aunque el autoritativo ya lo sirve. ¿Por qué?",
  ops:["El registro está mal creado","Alguien lo consultó antes de crearlo y el NXDOMAIN quedó en caché negativa según el SOA","Los cambios DNS tardan siempre 48 h","DNSSEC lo bloquea"],
  ok:1, why:"La caché negativa es real. Comprueba el autoritativo directamente con <code>dig @ns1.proveedor.net nuevo.miempresa.com</code> y, si urge, vacía la caché del resolvedor que controlas."},
 {t:"opcion", p:"Tras migrar el DNS de un dominio con DNSSEC a otro proveedor, <code>dig @8.8.8.8</code> devuelve SERVFAIL, pero <code>dig @nuevo-ns</code> responde bien. ¿Qué revisas?",
  ops:["El TTL del registro A","El registro DS en el registrador: sigue apuntando a la clave del proveedor antiguo","Los registros MX","La MTU"],
  ok:1, why:"El resolvedor validador ve firmas de una clave que no coincide con el DS de la zona padre y rechaza la respuesta. <code>dig +cd</code> (desactiva la comprobación) confirma el diagnóstico si entonces sí resuelve."},
 {t:"escribe", p:"¿En qué puerto TCP escucha un resolvedor de DNS sobre TLS (DoT)?",
  sol:["853"], pista:"No es el 53 ni el 443.",
  why:"DoT usa un puerto propio, fácil de bloquear o de permitir. DoH se mezcla con el resto del tráfico HTTPS en el 443."}
]}

]});
