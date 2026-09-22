window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Seguridad y operación",
resumen: "Credenciales y secretos, endurecer el controlador, permisos, copias de seguridad, monitorización, actualizaciones y diagnóstico de pipelines rotos",
nivel: "Experto",
color: "#b84a35",
lecciones: [

{
id:"jk7l1",
titulo:"Credenciales y secretos",
claves:["Tipos de credencial: usuario y contraseña, texto secreto, clave SSH, fichero, certificado","Alcance: global o de una carpeta; mejor por carpeta, con el mínimo acceso","Jenkins enmascara los secretos en la consola, pero no los protege si los escribes en ficheros o los transformas"],
pasos:[
 {t:"info", eti:"Secretos", h:"Usar credenciales bien",
  c:`<div class="termbox">withCredentials([
  string(credentialsId: 'token-sonar', variable: 'SONAR_TOKEN'),
  sshUserPrivateKey(credentialsId: 'deploy-ssh', keyFileVariable: 'CLAVE_SSH', usernameVariable: 'USU'),
  file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG')
]) {
  sh 'ssh -i "$CLAVE_SSH" "$USU"@servidor ./desplegar.sh'
  sh 'kubectl apply -f k8s/'
}</div>
     <p>Mejor aún que guardar claves de larga duración: credenciales <b>temporales</b> (por ejemplo, OIDC contra AWS o un gestor como Vault) que caducan solas.</p>`},
 {t:"par", p:"Empareja cada tipo de credencial con su uso",
  pares:[["usernamePassword","Registro de contenedores o repositorio de artefactos"],["string","Token de una API"],["sshUserPrivateKey","Conectar por SSH a un servidor"],["file","Un kubeconfig o un fichero de configuración entero"],["certificate","Certificado de cliente para TLS mutuo"]],
  why:"credentialsId es solo un nombre: el secreto nunca aparece en el Jenkinsfile."},
 {t:"opcion", p:"Un desarrollador hace <code>sh 'echo $TOKEN | base64'</code> dentro de withCredentials. ¿Qué pasa?",
  ops:["Jenkins lo enmascara igualmente","El token codificado en base64 aparece en claro en la consola: el enmascarado solo reconoce el valor exacto","El build falla","base64 cifra el token"],
  ok:1, why:"El enmascarado es una ayuda, no una barrera: nunca imprimas ni transformes secretos."},
 {t:"vf", p:"Dar alcance global a todas las credenciales es lo más seguro porque así se administran en un solo sitio.",
  ok:false, why:"Con alcance global, cualquier job puede usarlas; mejor por carpeta y con mínimo privilegio."}
]},

{
id:"jk7l2",
titulo:"Endurecer Jenkins",
claves:["Autenticación obligatoria y autorización por roles o matriz (plugins Matrix Authorization o Role-based)","Nada de builds en el controlador, agentes con permisos mínimos y script approval para Groovy no revisado","Jenkins actualizado (LTS) y detrás de HTTPS; nunca expuesto con acceso anónimo"],
pasos:[
 {t:"par", p:"Empareja cada medida con el riesgo que reduce",
  pares:[["0 executors en el controlador","Que un build lea JENKINS_HOME y las credenciales"],["Autorización por roles","Que cualquiera configure jobs o vea secretos"],["Script approval","Groovy arbitrario ejecutándose con permisos del controlador"],["Actualizar a la última LTS","Vulnerabilidades conocidas de Jenkins y sus plugins"],["HTTPS delante (proxy inverso)","Credenciales y cookies viajando en claro"],["Revisar PRs de forks antes de construirlos","Código malicioso ejecutándose en tus agentes"]],
  why:"Jenkins ejecuta código por definición: su seguridad importa tanto como la de producción."},
 {t:"opcion", p:"Un Jenkins con acceso anónimo de administrador expuesto a internet. ¿Qué puede hacer un atacante?",
  ops:["Solo ver los builds","Ejecutar código arbitrario en el controlador (Script Console), robar todas las credenciales y usar tus agentes","Nada si hay firewall en los agentes","Solo cambiar el tema"],
  ok:1, why:"La Script Console ejecuta Groovy con todos los permisos: es literalmente acceso root al CI y a lo que despliega."},
 {t:"vf", p:"Los plugins desactualizados son una de las fuentes más habituales de vulnerabilidades en Jenkins.",
  ok:true, why:"Revisa los avisos de seguridad (Manage Jenkins los muestra) y actualiza con frecuencia."}
]},

{
id:"jk7l3",
titulo:"Operar Jenkins",
claves:["Copia de seguridad de JENKINS_HOME (o reconstrucción con JCasC y restauración de jobs y credenciales)","Monitorizar la cola, los executors libres, la duración de los builds y el disco (plugin Prometheus)","Rotar builds antiguos, actualizar en una ventana planificada y probar primero en otro entorno"],
pasos:[
 {t:"info", eti:"En producción", h:"Mantener Jenkins sano",
  c:`<div class="diag">COPIAS          JENKINS_HOME: config.xml, jobs/, credentials.xml, secrets/  (¡secrets/ y credentials.xml juntos!)
MÉTRICAS        /prometheus: cola, executors ocupados, duración y resultado de builds
DISCO           buildDiscarder en cada job, limpiar workspaces, artefactos grandes al registro
ACTUALIZAR      LTS cada pocas semanas · probar en un Jenkins de pruebas · plugins al día
ALTA DISP.      un controlador; se recupera rápido con JCasC + copia de los datos</div>`},
 {t:"par", p:"Empareja cada síntoma con su causa probable",
  pares:[["La cola crece y los builds esperan","Faltan executors o agentes"],["El disco del controlador se llena","Builds y artefactos antiguos sin rotar"],["Tras una actualización fallan pipelines","Un plugin incompatible con la nueva versión"],["El controlador va lento con mucha memoria","Builds ejecutándose en él o demasiados jobs cargados"],["Credenciales restauradas que no se descifran","Se copió credentials.xml sin la carpeta secrets/"]],
  why:"El último es un clásico al restaurar copias de Jenkins."},
 {t:"opcion", p:"¿Qué se debe incluir en la copia de seguridad para poder restaurar las credenciales?",
  ops:["Solo credentials.xml","credentials.xml y la carpeta secrets/ (la clave que las cifra)","Solo la carpeta jobs/","Los workspaces"],
  ok:1, why:"Sin la clave maestra de secrets/, las credenciales cifradas son inservibles."}
]},

{
id:"jk7l4",
titulo:"Diagnosticar pipelines rotos",
claves:["Leer la consola desde el final y localizar el primer error real","Reproducir el paso fuera de Jenkins (mismo contenedor, mismos comandos)","Replay permite probar un cambio del Jenkinsfile sin hacer commit"],
pasos:[
 {t:"par", p:"Empareja cada error con su causa habitual",
  pares:[["sh: 1: ./mvnw: Permission denied","El wrapper no tiene permiso de ejecución en Git"],["No such DSL method 'withCredentials'","Falta el plugin Credentials Binding"],["Scripts not permitted to use method...","Groovy bloqueado por el sandbox: requiere script approval"],["docker: permission denied while trying to connect","El usuario del agente no puede usar Docker"],["Cannot connect to the Docker daemon","El agente no tiene Docker o el socket no está disponible"],["java.io.NotSerializableException","Un objeto no serializable guardado en una variable del pipeline"]],
  why:"Estos errores aparecen tarde o temprano en cualquier Jenkins."},
 {t:"orden", p:"Ordena cómo diagnosticar un build que falla",
  items:["Leer la consola y encontrar el primer error real","Comprobar qué cambió: commit, plugin, agente o imagen","Reproducir el paso en el mismo contenedor fuera de Jenkins","Probar la corrección con Replay o en una rama","Aplicar el arreglo y dejar una prueba o aviso para que no se repita"],
  why:"El primer error suele ser la causa; los siguientes, consecuencias."},
 {t:"escribe", p:"El build falla con <code>./mvnw: Permission denied</code>. Escribe el comando de Git que marca el fichero como ejecutable en el repositorio",
  sol:["git update-index --chmod=+x mvnw"], ph:"git update-index …", pista:"git update-index --chmod=+x y el fichero.", why:"Desde Windows el permiso de ejecución no se guarda solo; update-index lo registra en Git."}
]}

]});
