window.CURSOS = window.CURSOS || {};
(CURSOS.kafka = CURSOS.kafka || []).push({
titulo: "Seguridad e incidentes",
resumen: "TLS, SASL y ACL, y los problemas que de verdad aparecen en producción",
nivel: "Experto",
color: "#66738a",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"kf3l4",
titulo:"Seguridad en Kafka",
claves:["TLS para cifrar el tráfico entre clientes y brokers","Autenticación con SASL (SCRAM, OAUTHBEARER) o mTLS","Autorización con ACL: quién puede leer o escribir en qué topic"],
pasos:[
 {t:"info", eti:"Proteger los eventos", h:"Capas de seguridad",
  c:`<div class="termbox"># cliente
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="facturacion" password="...";

# ACL: el servicio de facturacion solo puede leer "pedidos" con su grupo
kafka-acls.sh --bootstrap-server kafka:9093 --command-config admin.properties \\
  --add --allow-principal User:facturacion --operation Read --topic pedidos --group facturacion</div>`},
 {t:"par", p:"Empareja cada mecanismo con lo que protege",
  pares:[["TLS","Que nadie lea o altere los mensajes en la red"],["SASL SCRAM","Autenticar a cada cliente con usuario y contraseña"],["mTLS","Autenticar con certificados de cliente"],["ACL","Qué puede hacer cada cliente en cada topic"],["Cifrado en reposo","Proteger los datos en los discos de los brokers"]],
  why:"Los eventos suelen llevar datos personales: trátalos como la base de datos."},
 {t:"vf", p:"Por defecto, cualquier cliente que llegue al puerto de Kafka puede leer y escribir en cualquier topic.",
  ok:true, why:"Sin autenticación ni ACL configuradas, sí. Por eso se configuran siempre en producción."},
 {t:"info", eti:"Un usuario por servicio", h:"Permisos mínimos de verdad",
  c:`<p>El error cómodo: un único usuario con permisos sobre todo, compartido por los diez servicios. El día que se filtra una credencial, se filtra el clúster entero.</p>
     <div class="termbox"># facturacion: solo LEE pedidos, y solo con su grupo
--add --allow-principal User:facturacion --operation Read --topic pedidos --group facturacion

# pedidos-api: solo ESCRIBE en pedidos
--add --allow-principal User:pedidos-api --operation Write --topic pedidos</div>
     <p>Con eso, un servicio comprometido no puede leer los topics de los demás ni borrar nada.</p>`},
 {t:"opcion", p:"¿Qué datos no deberían viajar nunca en claro dentro de un evento?",
  ops:["Ninguno, Kafka es interno","Datos personales sensibles, tarjetas o credenciales: aunque el tráfico vaya cifrado, quedan guardados en disco durante toda la retención","Los ids","Las fechas"],
  ok:1, why:"Un topic con siete días de retención es siete días de esos datos en los discos de varios brokers."},
 {t:"vf", p:"Activar TLS entre brokers y clientes tiene coste de CPU y latencia.",
  ok:true, why:"Existe, aunque con hardware moderno es pequeño. Y el coste de no tenerlo es incomparablemente mayor."},
 {t:"escribe", p:"¿Qué mecanismo de autenticación usa usuario y contraseña con reto cifrado? (una palabra)",
  sol:["SCRAM","scram","SASL/SCRAM","sasl/scram"],
  pista:"SASL/…",
  why:"La contraseña nunca viaja tal cual, y los usuarios se guardan en el propio clúster."}
]},

/* =============== U6 L2 =============== */
{
id:"kf7l1",
titulo:"Incidentes típicos y cómo salir de ellos",
claves:["Los problemas de Kafka se repiten: lag, particiones desequilibradas, consumidores expulsados","La reacción correcta casi nunca es reiniciar el clúster","Saber reiniciar offsets y drenar un DLT te saca de casi todo"],
pasos:[
 {t:"info", eti:"El más frecuente", h:"El lag se dispara",
  c:`<div class="termbox">kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group facturacion
# ¿el lag sube en TODAS las particiones o en una?
#   todas    -&gt; el consumidor va lento o esta caido: mira sus logs y su CPU
#   una sola -&gt; particion caliente (clave mal elegida) o un consumidor atascado</div>
     <p>Esa primera pregunta («¿todas o una?») orienta el diagnóstico en diez segundos y evita media hora de palos de ciego.</p>`},
 {t:"par", p:"Empareja cada síntoma con su causa más probable",
  pares:[["Lag que sube en una sola partición","Clave mal repartida o un consumidor atascado en un mensaje"],["Rebalanceos continuos","Procesado que supera max.poll.interval.ms"],["Under-replicated partitions","Un broker con disco lleno, red saturada o caído"],["El productor bloquea la aplicación","Buffer lleno: el clúster no acepta al ritmo que escribes"],["Consumidor que no recibe nada","Grupo con offsets ya avanzados, o ACL que no le deja leer"]],
  why:"Casi todos los incidentes de Kafka caen en una de estas cinco casillas."},
 {t:"opcion", p:"Un consumidor lleva parado tres días y el topic tiene 7 días de retención. ¿Qué haces al arrancarlo?",
  ops:["Nada, empezará por el principio","Nada: retomará desde su offset guardado y procesará lo pendiente; vigila el pico de carga que eso supone","Reiniciar offsets a latest","Borrar el grupo"],
  ok:1, why:"Y si estuviera parado más de la retención, habría perdido eventos: ahí sí habría que decidir a mano desde dónde seguir."},
 {t:"info", eti:"La herramienta de rescate", h:"Reiniciar offsets",
  c:`<div class="termbox"># SIEMPRE con el grupo parado, y primero con --dry-run
kafka-consumer-groups.sh --bootstrap-server kafka:9092 --group facturacion \\
  --reset-offsets --to-datetime 2026-09-22T08:00:00.000 --topic pedidos --dry-run

# cuando la salida convence, se ejecuta
... --execute</div>
     <p>Se puede volver a un instante, al principio, al final o avanzar N mensajes. Es la manera de reprocesar un día entero después de arreglar un error, o de saltarse un tramo envenenado.</p>`},
 {t:"opcion", p:"Has desplegado un consumidor con un fallo que procesó mal 4 horas de eventos. Ya está arreglado. ¿Cómo lo reparas?",
  ops:["No se puede","Parar el grupo, reiniciar sus offsets al instante anterior al fallo y dejar que reprocese (siendo idempotente, no duplica)","Republicar los eventos a mano","Restaurar la base de datos"],
  ok:1, why:"Esto es lo que hace especial a Kafka frente a una cola: los eventos siguen ahí."},
 {t:"vf", p:"Reiniciar el clúster de Kafka es una forma razonable de resolver un lag alto.",
  ok:false, why:"Empeora casi todo: provoca rebalanceos, cambios de líder y más carga justo cuando el sistema ya va justo."},
 {t:"escribe", p:"¿Qué opción de kafka-consumer-groups usarías para ver qué haría un reinicio de offsets sin aplicarlo?",
  sol:["--dry-run","dry-run","dry run"],
  pista:"«Ensayo en seco».",
  why:"Igual que con Terraform o Ansible: mirar el plan antes de ejecutarlo."}
]}

]});
