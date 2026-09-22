window.CURSOS = window.CURSOS || {};
(CURSOS.sql = CURSOS.sql || []).push({
titulo: "Operar PostgreSQL en producción",
resumen: "Usuarios y permisos, copias de seguridad y PITR, replicación y alta disponibilidad, VACUUM, monitorización y migraciones sin caída",
nivel: "Experto",
color: "#27538c",
lecciones: [

{
id:"sq12l1",
titulo:"Usuarios, roles y permisos",
claves:["En PostgreSQL todo son roles; los usuarios son roles con LOGIN","Mínimo privilegio: la aplicación no debe ser superusuario ni dueña de las tablas","GRANT y REVOKE sobre esquemas, tablas y secuencias"],
pasos:[
 {t:"info", eti:"Quién puede qué", h:"Roles y permisos",
  c:`<div class="termbox">CREATE ROLE app_lectura NOLOGIN;
GRANT USAGE ON SCHEMA public TO app_lectura;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_lectura;

CREATE ROLE api LOGIN PASSWORD '...';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO api;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO api;

CREATE ROLE analista LOGIN PASSWORD '...' IN ROLE app_lectura;</div>
     <p>Separación habitual: un rol <b>propietario</b> que ejecuta las migraciones (crea y altera tablas), un rol de <b>aplicación</b> con permisos de datos y roles de <b>solo lectura</b> para análisis.</p>`},
 {t:"par", p:"Empareja cada rol con los permisos que le corresponden",
  pares:[["Rol de migraciones","Crear y alterar tablas (propietario del esquema)"],["Rol de la aplicación","SELECT, INSERT, UPDATE y DELETE en las tablas"],["Rol de analistas","Solo SELECT, idealmente sobre una réplica"],["postgres (superusuario)","Solo administración, nunca desde la aplicación"]],
  why:"Si la aplicación es comprometida, un rol limitado no puede borrar tablas ni leer otras bases de datos."},
 {t:"opcion", p:"¿Por qué no conectar la aplicación con el usuario <code>postgres</code>?",
  ops:["Por rendimiento","Es superusuario: un fallo o una inyección SQL podrían hacer cualquier cosa, incluso ejecutar comandos en el servidor","Porque no tiene contraseña","No hay problema"],
  ok:1, why:"Mínimo privilegio también en la base de datos."},
 {t:"vf", p:"Además de permisos, conviene exigir TLS en las conexiones y restringir en <code>pg_hba.conf</code> desde qué redes se puede conectar.",
  ok:true, why:"Defensa en profundidad: red, autenticación, cifrado y permisos."}
]},

{
id:"sq12l2",
titulo:"Copias de seguridad y recuperación",
claves:["pg_dump: copia lógica de una base de datos; pg_restore la restaura","Copia física + WAL archivado permite recuperar a un instante concreto (PITR)","Un backup que no se ha probado a restaurar no es un backup"],
pasos:[
 {t:"info", eti:"Lógicas", h:"pg_dump y pg_restore",
  c:`<div class="termbox">pg_dump -h db -U postgres -Fc tienda &gt; tienda.dump        <span class="cm"># formato comprimido</span>
pg_restore -h db -U postgres -d tienda_restaurada tienda.dump
pg_dump -U postgres --schema-only tienda &gt; esquema.sql     <span class="cm"># solo estructura</span></div>
     <p>Sencillo y portable entre versiones. Pero para bases de datos grandes es lento, y solo recupera al momento de la copia.</p>`},
 {t:"info", eti:"Físicas", h:"WAL y recuperación a un instante (PITR)",
  c:`<p>PostgreSQL escribe cada cambio primero en el <b>WAL</b> (write-ahead log). Si guardas una copia física periódica <b>más</b> todos los ficheros WAL, puedes reconstruir la base de datos <b>tal como estaba a las 14:31:07</b>, justo antes de aquel <code>DELETE</code> sin WHERE.</p>
     <p>Herramientas: <b>pgBackRest</b>, <b>Barman</b>, WAL-G. En la nube (RDS, Cloud SQL) viene incluido: eliges el instante y creas una instancia nueva.</p>`},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["pg_dump","Copia lógica en SQL o formato propio"],["WAL","Registro de todos los cambios antes de aplicarlos"],["PITR","Restaurar a un instante concreto"],["RPO","Cuántos datos puedes permitirte perder"],["RTO","Cuánto tiempo puedes tardar en recuperar"]],
  why:"RPO y RTO son la forma de hablar de backups con negocio."},
 {t:"opcion", p:"Alguien borró por error una tabla a las 11:02. ¿Qué te permite recuperar los datos de las 11:01?",
  ops:["El pg_dump de anoche","Una copia física con archivado de WAL (PITR) o la restauración a un instante del servicio gestionado","Una réplica en streaming","VACUUM"],
  ok:1, why:"Una réplica ya habría aplicado el DROP. La réplica no es un backup."},
 {t:"vf", p:"Una réplica de lectura sustituye a las copias de seguridad.",
  ok:false, why:"Replica también los errores (borrados, corrupciones lógicas) en segundos."}
]},

{
id:"sq12l3",
titulo:"Replicación y alta disponibilidad",
claves:["Replicación en streaming: réplicas que aplican el WAL del primario","Réplicas para leer y para conmutar si cae el primario (failover)","Síncrona (sin pérdida, más latencia) o asíncrona (posible pequeña pérdida)"],
pasos:[
 {t:"info", eti:"Copias vivas", h:"Primario y réplicas",
  c:`<div class="diag">aplicacion --escrituras--> PRIMARIO --WAL--> REPLICA 1 (lecturas, informes)
                                    \\--WAL--> REPLICA 2 (en otra zona, lista para failover)</div>
     <ul><li><b>Asíncrona</b>: el primario confirma sin esperar a la réplica. Si cae, se pueden perder los últimos segundos.</li>
     <li><b>Síncrona</b>: espera a que al menos una réplica lo tenga. Sin pérdida, a cambio de latencia.</li></ul>
     <p>El <b>failover</b> (promocionar una réplica a primario) lo automatizan Patroni, los operadores de Kubernetes (CloudNativePG) o los servicios gestionados (RDS Multi-AZ).</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Réplica de lectura","Descarga consultas del primario"],["Failover","Promocionar una réplica cuando cae el primario"],["Retraso de replicación","Distancia entre lo escrito en el primario y lo aplicado en la réplica"],["Replicación lógica","Replicar tablas concretas, incluso entre versiones distintas"]],
  why:"La replicación lógica se usa para migraciones de versión mayor con muy poca parada."},
 {t:"opcion", p:"Tras guardar un pedido, el usuario recarga y no lo ve: la lectura va a una réplica asíncrona. ¿Qué haces?",
  ops:["Nada","Leer de primario las lecturas que siguen a una escritura propia (read-your-writes) o esperar a que la réplica alcance ese punto","Quitar las réplicas","Usar SERIALIZABLE"],
  ok:1, why:"El retraso de replicación es normal; la aplicación debe tenerlo en cuenta."},
 {t:"vf", p:"Las escrituras pueden enviarse a cualquier réplica en la replicación en streaming de PostgreSQL.",
  ok:false, why:"Las réplicas son de solo lectura. Todas las escrituras van al primario."}
]},

{
id:"sq12l4",
titulo:"Mantenimiento, monitorización y migraciones sin caída",
claves:["VACUUM limpia versiones muertas; autovacuum lo hace solo, pero hay que vigilarlo","Vigilar conexiones, transacciones largas, bloqueos, tamaño y retraso de réplicas","Migraciones compatibles hacia atrás: expandir, migrar, contraer"],
pasos:[
 {t:"info", eti:"Higiene", h:"VACUUM y bloat",
  c:`<p>Por MVCC, cada UPDATE y DELETE deja versiones muertas. <b>autovacuum</b> las limpia y actualiza estadísticas. Problemas típicos:</p>
     <ul><li>Una <b>transacción abierta durante horas</b> (alguien dejó un <code>BEGIN</code> en psql) impide limpiar: las tablas se hinchan (<b>bloat</b>) y todo se ralentiza.</li>
     <li>Tablas con muchísimas escrituras necesitan un autovacuum más agresivo.</li></ul>
     <div class="termbox">SELECT pid, now() - xact_start AS duracion, state, query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY duracion DESC LIMIT 5;</div>`},
 {t:"par", p:"Empareja cada métrica con lo que indica",
  pares:[["Conexiones cerca de max_connections","Pools mal dimensionados o fugas de conexiones"],["Transacciones abiertas durante horas","Riesgo de bloat y bloqueos"],["Retraso de réplica creciente","La réplica no da abasto o la red falla"],["Tasa de aciertos de caché baja","La memoria no alcanza para los datos calientes"],["Consultas esperando bloqueos","Contención: transacciones largas o conflictos"]],
  why:"Con postgres_exporter y Grafana se tienen todas estas métricas en un panel."},
 {t:"info", eti:"Sin parar", h:"Expandir y contraer",
  c:`<p>Renombrar una columna de golpe rompe la versión de la aplicación que sigue en marcha durante el despliegue. El patrón seguro:</p>
     <ol><li><b>Expandir</b>: añadir la columna nueva (nullable). La app escribe en ambas.</li>
     <li><b>Migrar</b>: copiar los datos antiguos por lotes.</li>
     <li>Cambiar las lecturas a la columna nueva.</li>
     <li><b>Contraer</b>: en un despliegue posterior, eliminar la columna vieja.</li></ol>
     <p>Y: <code>CREATE INDEX CONCURRENTLY</code>, restricciones con <code>NOT VALID</code> y después <code>VALIDATE</code>, y <code>lock_timeout</code> para que una migración no bloquee la tabla indefinidamente.</p>`},
 {t:"orden", p:"Ordena un renombrado de columna sin caída",
  items:["Añadir la columna nueva","Desplegar la app escribiendo en ambas columnas","Copiar los datos antiguos por lotes","Desplegar la app leyendo solo la nueva","Eliminar la columna antigua"],
  why:"Cada paso es compatible con la versión anterior de la aplicación: se puede desplegar y revertir con seguridad."},
 {t:"opcion", p:"¿Por qué usar <code>CREATE INDEX CONCURRENTLY</code> en producción?",
  ops:["Es más rápido","Un CREATE INDEX normal bloquea las escrituras de la tabla mientras dura; CONCURRENTLY no","Crea varios índices a la vez","Es obligatorio"],
  ok:1, why:"Tarda más, pero la aplicación sigue escribiendo. No se puede ejecutar dentro de una transacción."}
]}

]});
