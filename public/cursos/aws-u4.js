window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Cómputo: EC2 y balanceo",
resumen: "Instancias EC2, tipos y AMI, user data, EBS, acceso con SSM, Auto Scaling y balanceadores ALB y NLB",
nivel: "Intermedio",
color: "#eb9540",
lecciones: [

{
id:"aw4l1",
titulo:"Instancias EC2",
claves:["EC2 son máquinas virtuales: eliges tipo (CPU y memoria), AMI (sistema) y red","Familias: t (ráfagas), m (general), c (CPU), r (memoria), g (GPU); Graviton (ARM) es más barato","Acceso con SSM Session Manager en vez de abrir SSH"],
pasos:[
 {t:"info", eti:"Servidores virtuales", h:"Lanzar una instancia",
  c:`<p>Al lanzar una EC2 decides:</p>
     <ul><li><b>AMI</b>: la imagen del sistema (Amazon Linux, Ubuntu, una imagen propia).</li>
     <li><b>Tipo</b>: <code>t4g.small</code>, <code>m7i.large</code>... (familia, generación, tamaño).</li>
     <li><b>Red</b>: VPC, subred y grupos de seguridad.</li>
     <li><b>Almacenamiento</b>: volúmenes EBS.</li>
     <li><b>Rol IAM</b> (perfil de instancia) y <b>user data</b>: un script que se ejecuta al primer arranque.</li></ul>
     <div class="termbox">#!/bin/bash
dnf install -y docker
systemctl enable --now docker
docker run -d -p 80:8080 --restart unless-stopped 123456789012.dkr.ecr.eu-west-1.amazonaws.com/api:1.4.0</div>`},
 {t:"par", p:"Empareja cada familia de instancia con su uso",
  pares:[["t (t4g, t3)","Cargas pequeñas con picos ocasionales (créditos de CPU)"],["m (m7i, m7g)","Propósito general equilibrado"],["c (c7g)","Cálculo intensivo"],["r (r7g)","Mucha memoria: bases de datos, cachés"],["g / p","GPU: IA y gráficos"]],
  why:"La «g» al final (m7g, t4g) indica procesadores Graviton de ARM: mejor precio por rendimiento."},
 {t:"opcion", p:"¿Cuál es la forma recomendada de entrar a una instancia en una subred privada?",
  ops:["Abrir el puerto 22 a 0.0.0.0/0","SSM Session Manager: sin puertos abiertos, con IAM y auditoría","Poner la instancia en pública","Compartir la clave .pem por correo"],
  ok:1, why:"Sin bastión, sin claves y con cada sesión registrada."},
 {t:"vf", p:"Una instancia <code>t3</code> puede usar el 100% de CPU de forma indefinida sin coste ni penalización.",
  ok:false, why:"Las t funcionan con créditos: al agotarlos se limitan (o se paga extra en modo unlimited)."}
]},

{
id:"aw4l2",
titulo:"Almacenamiento de bloque: EBS",
claves:["EBS son discos de red que se conectan a una instancia en la misma AZ","gp3 por defecto; io2 para mucha E/S","Snapshots incrementales en S3 para copias y para copiar entre AZ o regiones"],
pasos:[
 {t:"info", eti:"Discos", h:"EBS e instance store",
  c:`<ul><li><b>EBS</b>: disco persistente que sobrevive a parar la instancia. Vive en una AZ.</li>
     <li><b>gp3</b>: SSD de uso general, con IOPS configurables. <b>io2</b>: IOPS altísimas para bases de datos exigentes.</li>
     <li><b>Snapshots</b>: copias incrementales; sirven para backups y para crear volúmenes en otra AZ o región.</li>
     <li><b>Instance store</b>: disco local muy rápido pero <b>efímero</b>: se pierde al parar la instancia.</li>
     <li><b>EFS</b>: sistema de ficheros compartido (NFS) entre varias instancias y AZ.</li></ul>`},
 {t:"par", p:"Empareja cada almacenamiento con su característica",
  pares:[["EBS","Disco persistente de una instancia en una AZ"],["Instance store","Disco local rapidísimo que se pierde al parar"],["EFS","Ficheros compartidos entre muchas instancias"],["S3","Objetos a través de una API, prácticamente ilimitado"],["Snapshot","Copia incremental de un volumen EBS"]],
  why:"Elegir el almacenamiento adecuado es una pregunta clásica de certificación."},
 {t:"opcion", p:"Necesitas mover un volumen EBS de eu-west-1a a eu-west-1b. ¿Cómo?",
  ops:["Arrastrarlo en la consola","Crear un snapshot y restaurar un volumen nuevo en la otra AZ","No se puede","Copiarlo por SSH"],
  ok:1, why:"Los volúmenes están ligados a su AZ; los snapshots, a la región."}
]},

{
id:"aw4l3",
titulo:"Auto Scaling y balanceadores",
claves:["Auto Scaling Group mantiene N instancias sanas y escala según métricas","Launch template: la receta de cada instancia","ALB (capa 7, HTTP) y NLB (capa 4, TCP/UDP) con health checks y target groups"],
pasos:[
 {t:"info", eti:"Elasticidad", h:"ASG y ELB",
  c:`<div class="dg"><div class="dg-tit">balanceador y grupo de autoescalado</div>
<div class="dg-vert">
<div class="dg-caja base">internet</div>
<div class="dg-caja acento doble">ALB<small>subredes públicas, 2 AZ</small></div>
<div class="dg-caja" style="border:0;background:none;padding:0"><div class="dg-fila"><div class="dg-caja doble">regla <code>/api/*</code><small>→ target group "api"</small></div><div class="dg-caja doble">regla <code>/*</code><small>→ target group "web"</small></div></div></div>
<div class="dg-caja ok doble">Auto Scaling Group<small>subredes privadas, 2 AZ · mín. 2, deseado 3, máx. 10 · política: CPU media 60%</small></div>
</div></div>
     <p>Si una instancia falla el health check, el ASG la sustituye. Si sube la carga, añade instancias y el ALB las incluye automáticamente.</p>`},
 {t:"par", p:"Empareja cada balanceador con su caso",
  pares:[["Application Load Balancer","HTTP/HTTPS con reglas por ruta o dominio y TLS"],["Network Load Balancer","TCP/UDP de altísimo rendimiento e IP fija"],["Gateway Load Balancer","Insertar appliances de red (cortafuegos)"],["Target group","Conjunto de destinos al que el balanceador envía tráfico"]],
  why:"El Ingress de EKS con el AWS Load Balancer Controller crea ALBs por ti."},
 {t:"opcion", p:"Con min 2 y deseado 2, una de las instancias se estropea. ¿Qué hace el Auto Scaling Group?",
  ops:["Nada","La marca como no sana, la termina y lanza otra para volver a 2","Avisa por correo solamente","Reinicia toda la VPC"],
  ok:1, why:"Autorreparación: el mismo principio que el ReplicaSet de Kubernetes."},
 {t:"vf", p:"Un ALB debe estar en subredes de al menos dos zonas de disponibilidad.",
  ok:true, why:"Es un requisito: garantiza que el balanceador sobrevive a la caída de una AZ."}
]},

{
id:"aw4l4",
titulo:"Laboratorio: una API en EC2 con buenas prácticas",
claves:["Instancia en subred privada, detrás de un ALB, con rol IAM y sin SSH","user_data que instala Docker y arranca el contenedor","Auto Scaling Group con plantilla para reemplazar instancias automáticamente"],
pasos:[
 {t:"orden", p:"Ordena los pasos para publicar tu API en EC2 correctamente",
  items:["Subir la imagen de la API a ECR","Crear un rol IAM con lectura de ECR y SSM para la instancia","Crear una launch template con user_data que instala Docker y arranca el contenedor","Crear un Auto Scaling Group en subredes privadas de dos AZ","Crear un ALB en subredes públicas con un target group y health check","Comprobar la API a través del DNS del ALB"],
  why:"Sin IPs públicas ni SSH en las instancias: todo el tráfico entra por el ALB."},
 {t:"hueco", p:"Completa el grupo de seguridad de las instancias para que solo el balanceador llegue al puerto 8080",
  tpl:"ingress 8080 desde ___", banco:["el grupo de seguridad del ALB","0.0.0.0/0","la subred pública","tu IP"], sol:["el grupo de seguridad del ALB"],
  why:"Referenciar el grupo del ALB sigue funcionando aunque cambien sus IPs."},
 {t:"opcion", p:"Una instancia del grupo deja de responder en /actuator/health. ¿Qué pasa?",
  ops:["Nada hasta que alguien la reinicie","El ALB deja de enviarle tráfico y, si el ASG usa el health check del ELB, la reemplaza por otra","Se cae el ALB","Se borra la imagen"],
  ok:1, why:"Autorreparación: activa el tipo de health check ELB en el ASG."},
 {t:"vf", p:"En este diseño, para entrar a una instancia a depurar se usa SSM Session Manager.",
  ok:true, why:"Sin abrir el puerto 22 ni gestionar claves SSH."}
]}

]});
