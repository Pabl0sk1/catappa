window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Arquitectura y costes",
resumen: "Well-Architected Framework, alta disponibilidad y recuperación ante desastres, Route 53, arquitectura de referencia y optimización de costes",
nivel: "Experto",
color: "#d3781e",
lecciones: [

{
id:"aw10l1",
titulo:"Well-Architected y alta disponibilidad",
claves:["Seis pilares: excelencia operativa, seguridad, fiabilidad, eficiencia, costes y sostenibilidad","Multi-AZ para alta disponibilidad; estrategias de DR según RPO y RTO","Route 53 con health checks para conmutar entre regiones"],
pasos:[
 {t:"info", eti:"Diseñar bien", h:"Arquitectura de referencia",
  c:`<div class="diag">Route 53 (DNS) --&gt; CloudFront + WAF
                      |-- /      -&gt; S3 (SPA React)
                      '-- /api/* -&gt; ALB (2 AZ)
                                     -&gt; ECS Fargate o EKS (subredes privadas, 2+ AZ, autoescalado)
                                          -&gt; Aurora PostgreSQL Multi-AZ
                                          -&gt; ElastiCache Redis
                                          -&gt; SQS -&gt; workers
Secrets Manager, KMS, CloudWatch, CloudTrail, GuardDuty
Todo definido en Terraform y desplegado con GitHub Actions (OIDC)</div>`},
 {t:"par", p:"Empareja cada estrategia de recuperación ante desastres con su coste y RTO",
  pares:[["Backup y restauración","Barato, recuperación en horas"],["Pilot light","Datos replicados y lo mínimo encendido en otra región"],["Warm standby","Copia reducida funcionando en otra región, recuperación en minutos"],["Activo-activo multirregión","Lo más caro, casi sin interrupción"]],
  why:"La estrategia se elige según cuánto cuesta cada hora de caída al negocio."},
 {t:"opcion", p:"¿Qué pilar del Well-Architected Framework trata la recuperación automática ante fallos?",
  ops:["Costes","Fiabilidad","Sostenibilidad","Excelencia operativa"],
  ok:1, why:"Fiabilidad: diseñar para que los fallos se detecten y se recupere solo."}
]},

{
id:"aw10l2",
titulo:"Optimizar costes",
claves:["Apaga lo que no se usa y dimensiona según métricas reales","Savings Plans para uso estable; Spot para cargas tolerantes a interrupciones","Etiquetas, presupuestos y Cost Explorer para dar visibilidad a cada equipo"],
pasos:[
 {t:"info", eti:"FinOps", h:"Palancas de ahorro",
  c:`<ul><li><b>Dimensionar</b>: muchas instancias usan un 10% de CPU. Compute Optimizer sugiere tamaños.</li>
     <li><b>Apagar</b> entornos de desarrollo por la noche y los fines de semana.</li>
     <li><b>Savings Plans</b> (1 o 3 años) para la base estable: hasta un 70% menos.</li>
     <li><b>Spot</b> para CI, lotes y nodos sin estado: hasta un 90% menos.</li>
     <li><b>Graviton</b> (ARM): mejor precio por rendimiento.</li>
     <li><b>Almacenamiento</b>: ciclo de vida en S3, borrar snapshots y volúmenes huérfanos.</li>
     <li><b>Red</b>: VPC endpoints en vez de NAT; CloudFront para reducir salida.</li></ul>`},
 {t:"par", p:"Empareja cada situación con la medida de ahorro",
  pares:[["Base de 10 instancias encendidas todo el año","Savings Plan"],["Runners de CI que pueden interrumpirse","Instancias Spot"],["Entorno de desarrollo encendido 24/7","Apagado programado fuera de horario"],["Logs de hace 3 años en S3 Standard","Regla de ciclo de vida a Glacier o borrado"],["Instancias al 5% de CPU","Reducir su tamaño"]],
  why:"Un informe semanal de costes por etiqueta hace que cada equipo vea lo que gasta."},
 {t:"vf", p:"Las instancias Spot son adecuadas para la base de datos principal de producción.",
  ok:false, why:"Pueden interrumpirse con dos minutos de aviso: para cargas sin estado y tolerantes a fallos."}
]},

{
id:"aw10l3",
titulo:"Arquitecturas de referencia",
claves:["Web de tres capas: CDN y balanceador, cómputo sin estado, base de datos gestionada","Serverless: API Gateway, Lambda, DynamoDB, EventBridge","Datos: S3 como lago, Glue para catalogar, Athena para consultar con SQL"],
pasos:[
 {t:"info", eti:"Patrones probados", h:"Tres arquitecturas típicas",
  c:`<div class="diag">1. WEB CLASICA
   Route 53 -&gt; CloudFront -&gt; ALB -&gt; ECS/EKS (varias AZ) -&gt; Aurora + ElastiCache

2. SERVERLESS
   API Gateway -&gt; Lambda -&gt; DynamoDB
                     '-&gt; EventBridge -&gt; Lambda / Step Functions
   pago por uso, escala a cero, limites de duracion

3. DATOS
   aplicaciones -&gt; Kinesis/Firehose -&gt; S3 (lago, Parquet)
   Glue (catalogo) -&gt; Athena (SQL sobre S3) -&gt; QuickSight (paneles)</div>`},
 {t:"par", p:"Empareja cada requisito con la arquitectura más natural",
  pares:[["API de negocio con PostgreSQL y tráfico constante","Web clásica con contenedores y Aurora"],["Webhooks esporádicos y tareas por eventos","Serverless con Lambda"],["Analizar terabytes de logs con SQL de vez en cuando","S3 + Athena"],["Tu API de Spring con JPA","Web clásica (ECS o EKS + RDS)"]],
  why:"No hay una arquitectura mejor: hay requisitos que encajan mejor con cada una."},
 {t:"opcion", p:"¿Por qué Athena sobre S3 es atractivo para consultas analíticas ocasionales?",
  ops:["Porque es gratis siempre","No hay servidores ni base de datos que mantener: pagas por los datos que escanea cada consulta","Porque es más rápido que cualquier base de datos","Porque sustituye a PostgreSQL"],
  ok:1, why:"Con ficheros en Parquet y particiones por fecha, cada consulta escanea (y cuesta) mucho menos."}
]}

]});
