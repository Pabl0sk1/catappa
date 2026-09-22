window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Configuración y secretos",
resumen: "ConfigMaps, Secrets, cómo inyectarlos, recargarlos y protegerlos de verdad",
nivel: "Intermedio",
color: "#5b8ce6",
lecciones: [

{
id:"k5l1",
titulo:"ConfigMaps",
claves:["Un ConfigMap guarda configuración no sensible fuera de la imagen","Se inyecta como variables de entorno o como ficheros montados","Las variables no se actualizan en caliente; los ficheros montados sí (con retraso)"],
pasos:[
 {t:"info", eti:"Separar configuración", h:"La misma imagen en todos los entornos",
  c:`<p>Como en Docker: la imagen es la misma en desarrollo, staging y producción; cambia la configuración. En Kubernetes se guarda en un <b>ConfigMap</b>:</p>
     <div class="termbox">apiVersion: v1
kind: ConfigMap
metadata: { name: api-config }
data:
  SPRING_PROFILES_ACTIVE: prod
  LOG_LEVEL: info
  application.yml: |              <span class="cm"># tambien ficheros enteros</span>
    server:
      shutdown: graceful</div>`},
 {t:"info", eti:"Inyectar", h:"Como variables o como ficheros",
  c:`<div class="termbox">containers:
  - name: api
    envFrom:
      - configMapRef: { name: api-config }     <span class="cm"># todas las claves como variables</span>
    env:
      - name: NIVEL
        valueFrom:
          configMapKeyRef: { name: api-config, key: LOG_LEVEL }   <span class="cm"># una concreta</span>
    volumeMounts:
      - name: config
        mountPath: /app/config                  <span class="cm"># cada clave, un fichero</span>
volumes:
  - name: config
    configMap: { name: api-config }</div>`},
 {t:"par", p:"Empareja cada forma de uso con su efecto",
  pares:[["envFrom + configMapRef","Todas las claves como variables de entorno"],["valueFrom.configMapKeyRef","Una clave concreta como variable"],["volume con configMap","Cada clave como fichero en una carpeta"],["subPath","Montar un solo fichero sin tapar la carpeta (pero sin actualizaciones en caliente)"]],
  why:"Montar como volumen es lo habitual para ficheros de configuración completos (nginx.conf, application.yml)."},
 {t:"opcion", p:"Cambias un valor del ConfigMap que la API recibe como variable de entorno. ¿Cuándo lo ve la API?",
  ops:["Al instante","Cuando se recrean los pods (por ejemplo, con kubectl rollout restart); las variables se fijan al arrancar el contenedor","Nunca","En 24 horas"],
  ok:1, why:"Las variables de entorno se leen al arrancar el proceso. Los ficheros montados sí se actualizan (con un retraso de hasta un minuto), aunque la aplicación tenga que releerlos."},
 {t:"info", eti:"Truco profesional", h:"Reiniciar al cambiar la configuración",
  c:`<p>Para que un cambio de configuración provoque un despliegue controlado, se añade a la plantilla del pod una anotación con el <b>hash</b> del ConfigMap. Si cambia la configuración, cambia la plantilla, y el Deployment hace un rolling update. Helm y Kustomize lo hacen automáticamente (Kustomize añade un sufijo con hash al nombre del ConfigMap).</p>`},
 {t:"vf", p:"Un ConfigMap es un buen sitio para guardar la contraseña de la base de datos.",
  ok:false, why:"Los ConfigMaps no tienen ninguna protección especial. Lo sensible va en Secrets (y aun así, protegidos como en la lección siguiente)."}
]},

{
id:"k5l2",
titulo:"Secrets",
claves:["Un Secret guarda datos sensibles; se usan igual que los ConfigMaps","base64 NO es cifrado: hay que activar cifrado en reposo y restringir RBAC","Tipos: Opaque, kubernetes.io/tls, dockerconfigjson..."],
pasos:[
 {t:"info", eti:"Datos sensibles", h:"Un Secret",
  c:`<div class="termbox">apiVersion: v1
kind: Secret
metadata: { name: api-secretos }
type: Opaque
stringData:                        <span class="cm"># en claro al escribirlo; se guarda en base64</span>
  SPRING_DATASOURCE_PASSWORD: cambia-esto
  JWT_SECRET: otro-secreto</div>
     <div class="termbox">kubectl create secret generic api-secretos \\
  --from-literal=SPRING_DATASOURCE_PASSWORD=cambia-esto
kubectl create secret tls tareas-tls --cert=tls.crt --key=tls.key
kubectl create secret docker-registry ghcr --docker-server=ghcr.io \\
  --docker-username=pablo --docker-password=$TOKEN   <span class="cm"># para descargar imagenes privadas</span></div>`},
 {t:"info", eti:"La trampa", h:"base64 no protege nada",
  c:`<div class="termbox">kubectl get secret api-secretos -o jsonpath='{.data.JWT_SECRET}' | base64 -d
<span class="cm">otro-secreto</span></div>
     <p>Cualquiera con permiso de leer Secrets los ve en claro. Protegerlos de verdad requiere:</p>
     <ul><li><b>Cifrado en reposo</b> de etcd (en EKS/GKE/AKS se activa con una clave KMS).</li>
     <li><b>RBAC</b> estricto: casi nadie debería poder hacer <code>get secret</code>.</li>
     <li>No guardarlos en Git sin cifrar (siguiente lección).</li></ul>`},
 {t:"opcion", p:"Un compañero dice que los Secrets de Kubernetes son seguros porque están en base64. ¿Qué le respondes?",
  ops:["Tiene razón","base64 es una codificación reversible, no un cifrado: la seguridad viene del cifrado en reposo de etcd, de RBAC y de no filtrarlos","Hay que usar base32","Solo son seguros en namespaces"],
  ok:1, why:"Pregunta trampa muy frecuente en entrevistas."},
 {t:"par", p:"Empareja cada tipo de Secret con su uso",
  pares:[["Opaque","Datos genéricos: contraseñas, tokens"],["kubernetes.io/tls","Certificado y clave TLS"],["kubernetes.io/dockerconfigjson","Credenciales para descargar imágenes privadas"],["Token de ServiceAccount","Identidad de un pod ante la API (hoy, tokens proyectados temporales)"]],
  why:"imagePullSecrets referencia el de tipo dockerconfigjson en el pod o en la ServiceAccount."},
 {t:"vf", p:"Montar los secretos como ficheros es más seguro que como variables de entorno.",
  ok:true, why:"Las variables se heredan por procesos hijos, aparecen en volcados y a veces en logs de errores. Los ficheros montados en tmpfs se leen solo cuando hace falta."},
 {t:"escribe", p:"Escribe el comando que crea un Secret genérico <code>bd</code> con la clave <code>PASSWORD=s3cr3to</code>",
  sol:["kubectl create secret generic bd --from-literal=password=s3cr3to","kubectl create secret generic bd --from-literal password=s3cr3to"], ph:"kubectl create secret ...",
  pista:"kubectl create secret generic, el nombre y --from-literal.", why:"kubectl create secret generic bd --from-literal=PASSWORD=s3cr3to."}
]},

{
id:"k5l3",
titulo:"Secretos en GitOps y gestores externos",
claves:["Nunca Secrets en claro en Git","Sealed Secrets o SOPS para guardarlos cifrados en el repositorio","External Secrets Operator sincroniza desde Vault, AWS Secrets Manager, etc."],
pasos:[
 {t:"info", eti:"El problema", h:"Todo en Git... ¿también los secretos?",
  c:`<p>Si el estado del clúster vive en Git (GitOps), ¿dónde van los secretos? Nunca en claro. Tres enfoques:</p>
     <ul><li><b>Sealed Secrets</b>: cifras el Secret con la clave pública de un controlador del clúster; en Git guardas un <code>SealedSecret</code> que solo ese clúster puede descifrar.</li>
     <li><b>SOPS</b> (con age o KMS): cifra los valores dentro del YAML; Argo CD o Flux los descifran al aplicar.</li>
     <li><b>External Secrets Operator</b>: en Git solo va una referencia («trae la clave X de AWS Secrets Manager»); el operador crea y mantiene el Secret.</li></ul>`},
 {t:"info", eti:"El más usado en empresa", h:"External Secrets Operator",
  c:`<div class="termbox">apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata: { name: api-secretos }
spec:
  refreshInterval: 1h
  secretStoreRef: { name: aws-secrets-manager, kind: ClusterSecretStore }
  target: { name: api-secretos }             <span class="cm"># el Secret que creara</span>
  data:
    - secretKey: SPRING_DATASOURCE_PASSWORD
      remoteRef: { key: prod/api/bd, property: password }</div>
     <p>La rotación se hace en el gestor central; el operador la propaga. El clúster accede al gestor con una identidad (IRSA en EKS, Workload Identity en GKE), no con otra contraseña.</p>`},
 {t:"par", p:"Empareja cada herramienta con cómo funciona",
  pares:[["Sealed Secrets","Secret cifrado con la clave del clúster, seguro en Git"],["SOPS","Valores cifrados dentro del YAML con age o KMS"],["External Secrets Operator","Sincroniza secretos desde un gestor externo"],["Vault Agent Injector","Un sidecar inyecta secretos de Vault como ficheros"]],
  why:"Saber nombrar estas opciones y cuándo usarlas es de nivel senior."},
 {t:"opcion", p:"Tu empresa ya usa AWS Secrets Manager y rota las contraseñas cada 30 días. ¿Qué encaja mejor en Kubernetes?",
  ops:["Copiar las contraseñas a mano en Secrets","External Secrets Operator, que sincroniza desde Secrets Manager y recoge las rotaciones","Guardarlas en un ConfigMap","Ponerlas en la imagen"],
  ok:1, why:"Una única fuente de verdad, rotación centralizada y nada sensible en Git."},
 {t:"vf", p:"Borrar un Secret de Git con un commit nuevo es suficiente si se subió por error.",
  ok:false, why:"Sigue en el historial. Hay que rotar el secreto inmediatamente (lo viste en el curso de Git)."}
]}

]});
