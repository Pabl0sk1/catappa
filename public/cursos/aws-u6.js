window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Bases de datos gestionadas",
resumen: "RDS y Aurora, Multi-AZ y réplicas, copias y restauración, DynamoDB, ElastiCache y cómo elegir",
nivel: "Intermedio",
color: "#e38c35",
lecciones: [

{
id:"aw6l1",
titulo:"RDS y Aurora",
claves:["RDS gestiona PostgreSQL, MySQL, etc.: parches, copias, alta disponibilidad","Multi-AZ: réplica síncrona en otra AZ con failover automático","Réplicas de lectura para escalar lecturas; Aurora separa cómputo y almacenamiento"],
pasos:[
 {t:"info", eti:"Sin administrar servidores", h:"RDS",
  c:`<ul><li>Eliges motor (PostgreSQL 17), tamaño de instancia y almacenamiento.</li>
     <li><b>Multi-AZ</b>: una réplica en espera en otra AZ; si el primario cae, el endpoint apunta a la réplica en uno o dos minutos.</li>
     <li><b>Copias automáticas</b> con restauración a un instante (PITR) de hasta 35 días, y snapshots manuales.</li>
     <li><b>Réplicas de lectura</b>: para informes y lecturas intensivas.</li>
     <li><b>Aurora</b>: compatible con PostgreSQL/MySQL, almacenamiento replicado en 3 AZ, failover más rápido y opción Serverless v2.</li></ul>`},
 {t:"par", p:"Empareja cada función con su propósito",
  pares:[["Multi-AZ","Alta disponibilidad con failover automático"],["Réplica de lectura","Descargar consultas de lectura del primario"],["PITR","Restaurar la base de datos a un instante concreto"],["RDS Proxy","Agrupar conexiones (útil con Lambda)"],["Parameter group","Configuración del motor"]],
  why:"Multi-AZ no sirve para leer: la réplica en espera no admite consultas (salvo Multi-AZ con clúster)."},
 {t:"opcion", p:"Alguien borró por error una tabla a las 11:02. ¿Qué te permite RDS?",
  ops:["Nada","Restaurar a las 11:01 una instancia nueva con PITR y recuperar los datos desde ella","Deshacer con Ctrl+Z","Pedirlo a soporte"],
  ok:1, why:"Lo mismo que en el curso de SQL, pero gestionado."},
 {t:"vf", p:"Multi-AZ de RDS protege también frente a un DELETE accidental.",
  ok:false, why:"La réplica copia también el error. Para eso están las copias y PITR."}
]},

{
id:"aw6l2",
titulo:"DynamoDB y ElastiCache",
claves:["DynamoDB: NoSQL clave-valor gestionado, escala masiva y latencia de milisegundos","Diseño según los patrones de acceso: clave de partición y de ordenación","ElastiCache (Redis/Valkey) para caché, sesiones y colas"],
pasos:[
 {t:"info", eti:"NoSQL", h:"DynamoDB",
  c:`<p><b>DynamoDB</b> guarda elementos por <b>clave de partición</b> (y opcionalmente de ordenación). Escala a millones de peticiones por segundo sin administrar nada, pero exige diseñar las tablas pensando en <b>cómo vas a consultar</b>: no hay JOINs y las consultas flexibles son caras.</p>
     <div class="diag">tabla Pedidos
 PK = CLIENTE#42    SK = PEDIDO#2026-09-22#1001   total=45.9
 PK = CLIENTE#42    SK = PEDIDO#2026-09-23#1002   total=12.0
 consulta: todos los pedidos del cliente 42 ordenados por fecha</div>`},
 {t:"par", p:"Empareja cada caso con la base de datos más adecuada",
  pares:[["Aplicación de negocio con relaciones y transacciones","RDS o Aurora (PostgreSQL)"],["Carrito o sesiones con millones de accesos por clave","DynamoDB"],["Caché de consultas costosas","ElastiCache (Redis/Valkey)"],["Búsqueda de texto completo","OpenSearch"],["Analítica sobre terabytes","Redshift o Athena sobre S3"]],
  why:"Elegir base de datos por los patrones de acceso, no por moda."},
 {t:"opcion", p:"¿Cuál es el mayor riesgo de usar DynamoDB para una aplicación cuyos informes y consultas aún no están claros?",
  ops:["Es lento","Que cada consulta nueva no prevista requiera índices o rediseños, porque no admite consultas SQL flexibles","No escala","No es duradero"],
  ok:1, why:"Con requisitos cambiantes, una base relacional suele ser la opción más segura."}
]}

]});
