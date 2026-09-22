window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Serverless y mensajería",
resumen: "Lambda, API Gateway, SQS, SNS, EventBridge y Step Functions para arquitecturas dirigidas por eventos",
nivel: "Avanzado",
color: "#db8229",
lecciones: [

{
id:"aw8l1",
titulo:"Lambda y API Gateway",
claves:["Lambda ejecuta funciones en respuesta a eventos; pagas por invocación y duración","Límites: 15 minutos, memoria configurable, arranques en frío","API Gateway o URLs de función exponen Lambdas por HTTP"],
pasos:[
 {t:"info", eti:"Sin servidores", h:"Lambda",
  c:`<div class="termbox"># handler.py
import json, boto3
s3 = boto3.client("s3")                    # fuera del handler: se reutiliza entre invocaciones

def handler(event, context):
    for registro in event["Records"]:      # disparada por un fichero nuevo en S3
        bucket = registro["s3"]["bucket"]["name"]
        clave = registro["s3"]["object"]["key"]
        generar_miniatura(bucket, clave)
    return {"statusCode": 200, "body": json.dumps({"ok": True})}</div>
     <p>Fuentes de eventos típicas: peticiones HTTP (API Gateway), ficheros en S3, mensajes de SQS, programaciones de EventBridge, cambios en DynamoDB.</p>`},
 {t:"par", p:"Empareja cada concepto con su significado",
  pares:[["Arranque en frío","La primera invocación tras un rato inactiva tarda más al crear el entorno"],["Concurrencia","Cuántas invocaciones se ejecutan a la vez"],["Timeout máximo","15 minutos por invocación"],["Capa (layer)","Dependencias compartidas entre funciones"],["SnapStart","Reduce el arranque en frío de funciones Java"]],
  why:"Para Java en Lambda, SnapStart o GraalVM reducen mucho el arranque en frío."},
 {t:"opcion", p:"¿Para qué NO es adecuada Lambda?",
  ops:["Procesar imágenes subidas a S3","Una tarea que tarda 2 horas sin interrupción","Una API con tráfico irregular","Tareas programadas cada noche"],
  ok:1, why:"El límite es de 15 minutos; para trabajos largos, ECS/Fargate, Batch o Step Functions."},
 {t:"vf", p:"Con Lambda no pagas nada mientras la función no se ejecuta.",
  ok:true, why:"Se paga por invocación y tiempo de ejecución (salvo concurrencia aprovisionada)."}
]},

{
id:"aw8l2",
titulo:"SQS, SNS, EventBridge y Step Functions",
claves:["SQS: colas para desacoplar productor y consumidor, con reintentos y DLQ","SNS: publicar a muchos suscriptores; EventBridge: bus de eventos con reglas","Step Functions orquesta flujos con pasos, reintentos y compensaciones"],
pasos:[
 {t:"info", eti:"Desacoplar", h:"Mensajería gestionada",
  c:`<div class="diag">API --"PedidoPagado"--&gt; EventBridge --regla--&gt; SQS facturacion --&gt; Lambda factura
                                   |--regla--&gt; SQS logistica   --&gt; servicio de envios (ECS)
                                   '--regla--&gt; SNS --&gt; correo al equipo si total &gt; 1000

Step Functions: reservar stock -&gt; cobrar -&gt; (si falla) liberar stock -&gt; confirmar</div>`},
 {t:"par", p:"Empareja cada servicio con su uso",
  pares:[["SQS","Cola de trabajos con reintentos: un mensaje lo procesa un consumidor"],["SNS","Difusión a muchos suscriptores (correo, SMS, colas)"],["EventBridge","Bus de eventos con reglas de enrutado y programación"],["Step Functions","Orquestar flujos de varios pasos con estado"],["Dead-letter queue","Guardar los mensajes que fallan repetidamente"]],
  why:"Son las versiones gestionadas de lo que viste con Kafka, RabbitMQ y sagas."},
 {t:"opcion", p:"Un mensaje de SQS falla siempre al procesarse y se reintenta sin fin. ¿Qué configuras?",
  ops:["Nada","Una dead-letter queue con un número máximo de recepciones, y una alarma sobre ella","Borrar la cola","Más consumidores"],
  ok:1, why:"Así no bloquea al resto y puedes investigarlo después."},
 {t:"vf", p:"Con SQS estándar, un mensaje puede entregarse más de una vez.",
  ok:true, why:"Entrega al menos una vez: los consumidores deben ser idempotentes. Las colas FIFO ofrecen deduplicación."}
]},

{
id:"aw8l3",
titulo:"Patrones dirigidos por eventos",
claves:["Fan-out: un evento, muchos consumidores (SNS o EventBridge hacia varias colas)","Colas como amortiguador entre sistemas de distinta velocidad","Idempotencia, orden y duplicados: diseñar para entrega al menos una vez"],
pasos:[
 {t:"info", eti:"Diseño", h:"Patrones habituales",
  c:`<ul><li><b>Fan-out</b>: «PedidoPagado» a EventBridge; reglas lo envían a colas de facturación, logística y analítica, cada una con su ritmo.</li>
     <li><b>Amortiguador</b>: una cola SQS delante de un servicio lento absorbe picos; el consumidor procesa a su velocidad.</li>
     <li><b>Colas FIFO</b> cuando el orden importa (por cliente, con MessageGroupId).</li>
     <li><b>Outbox</b> para publicar eventos de forma fiable desde una base de datos.</li>
     <li><b>Idempotencia</b>: guardar los ids de eventos procesados (por ejemplo, en DynamoDB con una condición).</li></ul>`},
 {t:"par", p:"Empareja cada problema con el patrón",
  pares:[["Tres servicios deben reaccionar al mismo evento","Fan-out con EventBridge o SNS"],["Picos de pedidos que saturan el servicio de facturas","Cola SQS como amortiguador"],["Los mensajes de un mismo cliente deben procesarse en orden","Cola FIFO con grupo por cliente"],["Un mensaje duplicado envía dos correos","Consumidor idempotente"],["Perder eventos si falla la publicación tras guardar","Transactional outbox"]],
  why:"Son los mismos patrones de Kafka y RabbitMQ, con servicios gestionados."},
 {t:"vf", p:"Con una cola SQS delante, si el servicio consumidor se cae una hora, los mensajes se pierden.",
  ok:false, why:"Se quedan en la cola (hasta 14 días de retención) y se procesan cuando vuelve."}
]}

]});
