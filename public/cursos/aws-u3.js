window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Redes: VPC",
resumen: "VPC y subredes públicas y privadas, Internet Gateway, NAT, tablas de rutas, grupos de seguridad, NACL, endpoints y conexión entre redes",
nivel: "Fundamentos",
color: "#eb9540",
lecciones: [

{
id:"aw3l1",
titulo:"Diseñar una VPC",
claves:["Una VPC es tu red privada en una región con un rango CIDR (10.0.0.0/16)","Subredes por AZ: públicas (ruta al Internet Gateway) y privadas (salida por NAT)","Balanceadores en públicas; aplicaciones y bases de datos en privadas"],
pasos:[
 {t:"info", eti:"Tu red", h:"Arquitectura típica",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">VPC 10.0.0.0/16 (eu-west-1)</div>
<table class="dg-tabla"><thead><tr><th>subred</th><th>AZ a</th><th>AZ b</th><th>tabla de rutas</th></tr></thead><tbody>
<tr><td>pública</td><td><code>10.0.1.0/24</code><br>ALB, NAT</td><td><code>10.0.2.0/24</code><br>ALB</td><td><code>0.0.0.0/0</code> → Internet Gateway</td></tr>
<tr><td>privada</td><td><code>10.0.11.0/24</code><br>app, app</td><td><code>10.0.12.0/24</code><br>app, app</td><td><code>0.0.0.0/0</code> → NAT Gateway</td></tr>
<tr><td>datos</td><td><code>10.0.21.0/24</code><br>RDS primaria</td><td><code>10.0.22.0/24</code><br>RDS standby</td><td>solo local</td></tr>
</tbody></table></div>
     <p>Lo que hace «pública» una subred es su <b>tabla de rutas</b> con salida al Internet Gateway. Todo lo demás lo viste en el curso de Redes.</p>`},
 {t:"par", p:"Empareja cada componente con su función",
  pares:[["Internet Gateway","Conexión de la VPC con internet"],["NAT Gateway","Salida a internet para subredes privadas"],["Tabla de rutas","Decide a dónde va el tráfico de cada subred"],["Subred","Rango de IPs dentro de una AZ"],["Elastic IP","IP pública fija"]],
  why:"Se crea un NAT por AZ para que la caída de una no deje sin salida a las demás."},
 {t:"opcion", p:"¿Dónde colocarías la base de datos RDS de producción?",
  ops:["En una subred pública con IP pública","En subredes privadas sin ruta a internet, en dos AZ","En la VPC por defecto","En cualquier subred"],
  ok:1, why:"Solo la aplicación necesita llegar a ella."},
 {t:"vf", p:"Una subred es pública porque tiene una etiqueta que lo indica.",
  ok:false, why:"Es pública si su tabla de rutas tiene 0.0.0.0/0 hacia un Internet Gateway."}
]},

{
id:"aw3l2",
titulo:"Grupos de seguridad y NACL",
claves:["Grupo de seguridad: cortafuegos con estado a nivel de instancia o interfaz","Se puede referenciar otro grupo como origen","NACL: sin estado, a nivel de subred, con reglas de permitir y denegar"],
pasos:[
 {t:"info", eti:"Filtrar", h:"Dos capas",
  c:`<div class="dg"><div class="dg-tit">grupos de seguridad encadenados</div>
<div class="dg-vert">
<div class="dg-caja acento doble">sg-alb<small>entrada 443 desde <code>0.0.0.0/0</code></small></div>
<div class="dg-caja doble">sg-app<small>entrada 8080 SOLO desde sg-alb</small></div>
<div class="dg-caja ok doble">sg-bd<small>entrada 5432 SOLO desde sg-app</small></div>
</div>
<div class="dg-nota arriba" style="margin-top:8px">salida: todo permitido por defecto</div>
</div>
     <p>Referenciar grupos en vez de IPs hace que las reglas sigan funcionando aunque las instancias cambien de IP con el autoescalado.</p>`},
 {t:"par", p:"Empareja cada característica con grupo de seguridad o NACL",
  pares:[["Grupo de seguridad","Con estado y solo reglas de permitir, por instancia"],["NACL","Sin estado, por subred, con reglas de permitir y denegar"],["Origen = otro grupo de seguridad","Permitir tráfico de cualquier recurso de ese grupo"],["Puertos efímeros en la NACL","Hay que abrirlos para que vuelvan las respuestas"]],
  why:"Para la mayoría de casos basta con grupos de seguridad bien diseñados."},
 {t:"opcion", p:"La aplicación no conecta con RDS: timeout. El grupo de RDS permite 5432 desde 10.0.1.0/24, pero las instancias están en 10.0.11.0/24. ¿Solución más robusta?",
  ops:["Abrir 5432 a 0.0.0.0/0","Permitir 5432 desde el grupo de seguridad de la aplicación","Poner RDS en pública","Cambiar el puerto"],
  ok:1, why:"Referenciar el grupo evita depender de rangos de IP."}
]},

{
id:"aw3l3",
titulo:"Conectar redes",
claves:["VPC endpoints: acceder a S3, ECR, Secrets Manager sin salir a internet","Peering para dos VPC; Transit Gateway para muchas","Site-to-Site VPN o Direct Connect hacia la oficina o el centro de datos"],
pasos:[
 {t:"info", eti:"Más allá de una VPC", h:"Opciones de conexión",
  c:`<ul><li><b>Gateway endpoint</b> (S3 y DynamoDB): gratis, se añade a la tabla de rutas.</li>
     <li><b>Interface endpoint</b> (PrivateLink): una interfaz privada para ECR, Secrets Manager, SSM...</li>
     <li><b>VPC Peering</b>: dos VPC como si fueran una (no transitivo).</li>
     <li><b>Transit Gateway</b>: centro de conexiones para muchas VPC y VPN.</li>
     <li><b>Site-to-Site VPN</b> y <b>Direct Connect</b> (línea dedicada) hacia tus instalaciones.</li></ul>`},
 {t:"par", p:"Empareja cada necesidad con la solución",
  pares:[["Nodos privados que descargan de S3 sin pasar por el NAT","Gateway endpoint de S3"],["Conectar 20 VPC de varias cuentas","Transit Gateway"],["Conectar la oficina de forma cifrada por internet","Site-to-Site VPN"],["Conexión dedicada de gran ancho de banda","Direct Connect"],["Acceder a Secrets Manager de forma privada","Interface endpoint (PrivateLink)"]],
  why:"Los endpoints mejoran la seguridad y reducen costes de NAT."},
 {t:"vf", p:"Si la VPC A está conectada por peering con B, y B con C, entonces A puede hablar con C.",
  ok:false, why:"El peering no es transitivo. Para eso existe Transit Gateway."}
]},

{
id:"aw3l4",
titulo:"DNS con Route 53",
claves:["Zonas alojadas públicas y privadas","Registros alias para apuntar a recursos de AWS sin coste de consulta","Políticas de enrutado: simple, ponderada, por latencia, por geolocalización y failover"],
pasos:[
 {t:"info", eti:"Nombres", h:"Route 53",
  c:`<ul><li><b>Zona pública</b>: los registros de <code>catappa.dev</code> visibles en internet.</li>
     <li><b>Zona privada</b>: nombres internos (<code>bd.interno</code>) solo dentro de tus VPC.</li>
     <li><b>Alias</b>: como un CNAME, pero permitido en el dominio raíz y apuntando a un ALB, CloudFront o S3; las consultas son gratuitas.</li></ul>
     <div class="dg dg-tabla-caja"><div class="dg-tit">registros alias con failover</div>
<table class="dg-tabla"><thead><tr><th>nombre</th><th>tipo</th><th>destino</th></tr></thead><tbody>
<tr><td>api.catappa.dev</td><td>ALIAS</td><td>ALB en eu-west-1<br><small>failover primario, con health check</small></td></tr>
<tr><td>api.catappa.dev</td><td>ALIAS</td><td>ALB en eu-central-1<br><small>failover secundario</small></td></tr>
<tr><td>www.catappa.dev</td><td>ALIAS</td><td>CloudFront</td></tr>
</tbody></table></div>`},
 {t:"par", p:"Empareja cada política de enrutado con su uso",
  pares:[["Simple","Un registro, uno o varios valores"],["Ponderada","Repartir tráfico por porcentajes (canary entre entornos)"],["Latencia","Enviar a la región más rápida para cada usuario"],["Geolocalización","Responder según el país del usuario"],["Failover","Pasar a la región secundaria si falla el health check"]],
  why:"Failover con health checks es la base de una recuperación ante desastres entre regiones."},
 {t:"opcion", p:"Quieres que <code>catappa.dev</code> (sin www) apunte a tu distribución de CloudFront. ¿Qué registro usas?",
  ops:["CNAME en el dominio raíz","Un registro A de tipo alias hacia la distribución","Un registro MX","Un TXT"],
  ok:1, why:"El CNAME no se permite en el dominio raíz; el alias de Route 53 sí."}
]}

]});
