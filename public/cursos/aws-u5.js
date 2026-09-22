window.CURSOS = window.CURSOS || {};
(CURSOS.aws = CURSOS.aws || []).push({
titulo: "Almacenamiento: S3",
resumen: "Buckets y objetos, clases de almacenamiento y ciclo de vida, permisos y bloqueo de acceso público, cifrado, versionado, URLs prefirmadas y webs estáticas",
nivel: "Intermedio",
color: "#e38c35",
lecciones: [

{
id:"aw5l1",
titulo:"Buckets y objetos",
claves:["S3 guarda objetos (ficheros) en buckets con nombre único global","Durabilidad de 11 nueves; accesible por API HTTP","Clases de almacenamiento y reglas de ciclo de vida para pagar menos"],
pasos:[
 {t:"info", eti:"Almacenamiento de objetos", h:"Qué es S3",
  c:`<p><b>S3</b> guarda <b>objetos</b> (un fichero y sus metadatos) en <b>buckets</b>. No es un disco: se accede por API (PUT, GET, DELETE). Prácticamente ilimitado y muy duradero.</p>
     <div class="termbox">aws s3 mb s3://facturas-catappa-prod
aws s3 cp factura-42.pdf s3://facturas-catappa-prod/2026/09/
aws s3 ls s3://facturas-catappa-prod/2026/ --recursive
aws s3 sync ./dist s3://web-catappa --delete</div>
     <p>Las «carpetas» son solo prefijos del nombre del objeto (<code>2026/09/factura-42.pdf</code>).</p>`},
 {t:"par", p:"Empareja cada clase de almacenamiento con su uso",
  pares:[["S3 Standard","Datos de uso frecuente"],["S3 Standard-IA","Acceso poco frecuente pero inmediato"],["S3 Intelligent-Tiering","Patrón de acceso desconocido: mueve solo los objetos"],["S3 Glacier Flexible Retrieval","Archivo que puede tardar horas en recuperarse"],["S3 Glacier Deep Archive","Archivo a largo plazo muy barato"]],
  why:"Una regla de ciclo de vida puede pasar los logs a Glacier a los 90 días y borrarlos a los 2 años."},
 {t:"term", p:"Copia el fichero <code>backup.sql.gz</code> al bucket <code>backups-catappa</code>",
  prompt:"pablo@servidor:~$", sol:["aws s3 cp backup.sql.gz s3://backups-catappa/","aws s3 cp backup.sql.gz s3://backups-catappa","aws s3 cp ./backup.sql.gz s3://backups-catappa/"],
  pista:"aws s3 cp, el fichero y s3://nombre-del-bucket/",
  salida:`upload: ./backup.sql.gz to s3://backups-catappa/backup.sql.gz`, why:"Así se suben las copias de la base de datos que viste en el curso de DevOps."},
 {t:"vf", p:"Los nombres de bucket de S3 son únicos en todo AWS, no solo en tu cuenta.",
  ok:true, why:"Por eso se suelen prefijar con la empresa o el proyecto."}
]},

{
id:"aw5l2",
titulo:"Seguridad en S3",
claves:["Block Public Access activado salvo necesidad explícita","Acceso mediante políticas de IAM y de bucket; cifrado por defecto (SSE-S3 o SSE-KMS)","Versionado y Object Lock protegen contra borrados y ransomware"],
pasos:[
 {t:"info", eti:"El error más caro", h:"Buckets públicos",
  c:`<p>Muchas filtraciones de datos famosas fueron buckets S3 públicos por error. Por eso:</p>
     <ul><li><b>Block Public Access</b> activado a nivel de cuenta y de bucket.</li>
     <li>Acceso mediante <b>roles</b> y políticas con mínimo privilegio.</li>
     <li><b>Cifrado</b> en reposo (activado por defecto) y en tránsito (denegar peticiones sin HTTPS).</li>
     <li><b>Versionado</b>: un borrado o sobrescritura se puede deshacer.</li>
     <li><b>Object Lock</b> en modo compliance para copias que nadie puede borrar durante X días.</li></ul>`},
 {t:"info", eti:"Compartir sin abrir", h:"URLs prefirmadas",
  c:`<div class="termbox"># boto3: enlace temporal de descarga, valido 10 minutos
url = s3.generate_presigned_url("get_object",
        Params={"Bucket": "facturas-catappa-prod", "Key": "2026/09/factura-42.pdf"},
        ExpiresIn=600)</div>
     <p>Tu API comprueba que el usuario puede ver esa factura y le devuelve una URL que caduca. El bucket sigue siendo privado. También sirve para <b>subidas</b> directas desde el navegador.</p>`},
 {t:"par", p:"Empareja cada medida con el riesgo que reduce",
  pares:[["Block Public Access","Exponer datos por un error de configuración"],["Versionado","Borrados o sobrescrituras accidentales"],["Object Lock","Ransomware que borra las copias de seguridad"],["URL prefirmada","Tener que hacer público un fichero para compartirlo"],["SSE-KMS","Control y auditoría de quién puede descifrar"]],
  why:"Copias de seguridad inmutables: la última línea de defensa ante ransomware."},
 {t:"opcion", p:"Los usuarios deben descargar sus facturas, que están en S3. ¿Cómo lo harías?",
  ops:["Hacer público el bucket","La API comprueba permisos y devuelve una URL prefirmada de corta duración","Enviar las claves de AWS al navegador","Copiar las facturas a la base de datos"],
  ok:1, why:"Seguro y además la descarga no pasa por tu servidor."}
]},

{
id:"aw5l3",
titulo:"Webs estáticas y CloudFront",
claves:["Una SPA (React, Vue) se sirve desde S3 detrás de CloudFront","Origin Access Control: el bucket solo acepta peticiones de CloudFront","Caché larga para ficheros con hash e invalidación del index.html"],
pasos:[
 {t:"info", eti:"Frontend en la nube", h:"S3 + CloudFront",
  c:`<div class="diag">usuario --HTTPS--&gt; CloudFront (CDN, certificado de ACM, WAF opcional)
                      |  /api/*  -&gt; ALB de la API
                      |  /*      -&gt; bucket S3 privado (Origin Access Control)
                      '-- error 403/404 -&gt; /index.html (para el router de la SPA)</div>
     <div class="termbox">npm run build
aws s3 sync dist/ s3://web-catappa --delete
aws cloudfront create-invalidation --distribution-id E123ABC --paths "/index.html"</div>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["CloudFront","CDN global con HTTPS y caché"],["ACM","Certificados TLS gratuitos y renovados automáticamente"],["Origin Access Control","Que solo CloudFront pueda leer el bucket"],["Invalidación","Forzar a la CDN a pedir de nuevo un fichero cambiado"]],
  why:"Para CloudFront, el certificado de ACM debe estar en us-east-1."},
 {t:"opcion", p:"Tras desplegar una nueva versión, algunos usuarios ven la antigua. ¿Qué haces?",
  ops:["Esperar un día","Invalidar el index.html en CloudFront (los JS y CSS con hash no lo necesitan)","Borrar el bucket","Cambiar de región"],
  ok:1, why:"El mismo patrón de caché que viste en el curso de Redes."}
]},

{
id:"aw5l4",
titulo:"Otros almacenamientos y copias",
claves:["EFS: sistema de ficheros compartido entre instancias y contenedores","AWS Backup centraliza copias de EBS, RDS, EFS, DynamoDB... con políticas","Copias entre regiones y cuentas para sobrevivir a desastres y a ataques"],
pasos:[
 {t:"info", eti:"Más opciones", h:"EFS y AWS Backup",
  c:`<ul><li><b>EFS</b>: NFS gestionado, crece solo, montable desde muchas EC2, ECS o pods de EKS a la vez en varias AZ.</li>
     <li><b>FSx</b>: sistemas de ficheros especializados (Windows, Lustre para HPC, NetApp).</li>
     <li><b>AWS Backup</b>: planes de copia (diaria, retención 35 días, copia mensual a otra región) aplicados por etiquetas a muchos servicios, con <b>Vault Lock</b> para copias inmutables.</li></ul>`},
 {t:"par", p:"Empareja cada necesidad con el servicio",
  pares:[["Varios contenedores comparten ficheros subidos","EFS"],["Política única de copias para RDS, EBS y EFS","AWS Backup"],["Copias que ni un administrador puede borrar","AWS Backup Vault Lock (o S3 Object Lock)"],["Guardar objetos a través de una API","S3"],["Disco rápido de una sola instancia","EBS"]],
  why:"Una copia en otra cuenta y región protege frente a errores, desastres y ransomware."},
 {t:"opcion", p:"Un atacante con credenciales de administrador de la cuenta de producción intenta borrar todas las copias. ¿Qué lo impide?",
  ops:["Nada","Copias en una cuenta separada de copias de seguridad y vaults con bloqueo (Vault Lock en modo compliance)","Una contraseña larga","Cambiar de región"],
  ok:1, why:"Separar cuentas e inmutabilidad: las copias sobreviven aunque caiga la cuenta principal."}
]}

]});
