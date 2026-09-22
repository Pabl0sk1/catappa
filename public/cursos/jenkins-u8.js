window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Maestría: Jenkins en una entrevista",
resumen: "Jenkins frente a GitHub Actions, GitLab CI y Argo CD, diseño de un pipeline completo y simulacro de entrevista",
nivel: "Maestro",
color: "#a8432f",
lecciones: [

{
id:"jk8l1",
titulo:"Jenkins y sus alternativas",
claves:["Jenkins: autoalojado, extensible y flexible, a cambio de mantenerlo tú","GitHub Actions y GitLab CI: integrados con el repositorio, YAML y runners gestionados","Argo CD: entrega continua con GitOps en Kubernetes; complementa al CI, no lo sustituye"],
pasos:[
 {t:"info", eti:"Elegir herramienta", h:"Cuándo usar cada una",
  c:`<div class="diag">JENKINS          autoalojado · miles de plugins · Groovy · redes internas y casos complejos
                 coste: mantener controlador, agentes, plugins y seguridad
GITHUB ACTIONS   integrado en GitHub · YAML · marketplace de acciones · runners gestionados
GITLAB CI        integrado en GitLab · .gitlab-ci.yml · runners propios o gestionados
ARGO CD          GitOps: sincroniza Kubernetes con lo declarado en Git (la parte de CD)</div>
     <p>Una combinación muy común: <b>CI</b> (Jenkins o Actions) compila, prueba y publica la imagen, y actualiza un repositorio de despliegue; <b>Argo CD</b> detecta el cambio y lo aplica en el clúster.</p>`},
 {t:"par", p:"Empareja cada situación con la herramienta que mejor encaja",
  pares:[["Empresa con cientos de pipelines internos y redes privadas","Jenkins"],["Proyecto nuevo alojado en GitHub, sin equipo de plataforma","GitHub Actions"],["Todo el código y los issues ya están en GitLab","GitLab CI"],["Desplegar en Kubernetes a partir de lo que dice un repositorio","Argo CD"]],
  why:"No hay una respuesta única: se valora que justifiques la elección."},
 {t:"opcion", p:"«¿Qué desventajas tiene Jenkins?» ¿Qué respuesta es más completa?",
  ops:["Ninguna","Hay que mantenerlo: actualizaciones, plugins que se rompen, seguridad del controlador, agentes y copias; y Groovy tiene su curva","Que es de pago","Que no soporta Docker"],
  ok:1, why:"Reconocer los costes de operación demuestra experiencia real."}
]},

{
id:"jk8l2",
titulo:"Simulacro de entrevista de Jenkins",
claves:["Sabes explicar CI/CD y la arquitectura de Jenkins","Sabes diseñar un pipeline declarativo completo con pruebas, imagen, credenciales y despliegue","Sabes operarlo y protegerlo: agentes, secretos, copias, actualizaciones y diagnóstico"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Contesta en voz alta antes de elegir: así es como te lo preguntarán.</p>`},
 {t:"opcion", p:"«Diseña el pipeline de una API Spring Boot que se despliega en Kubernetes.»",
  ops:["Un solo paso que hace todo","Multibranch con Jenkinsfile: compilar y probar con Maven en un agente Docker, publicar pruebas, análisis de seguridad en paralelo, imagen etiquetada con el commit, push con credenciales, despliegue en staging, pruebas de humo, aprobación y producción solo desde main","Compilar en local y subir el .jar por FTP","Desplegar directamente en producción en cada commit a cualquier rama"],
  ok:1, why:"Menciona las etapas, dónde se ejecutan, cómo gestionas secretos y cómo proteges producción."},
 {t:"opcion", p:"«¿Cómo manejas los secretos en Jenkins?»",
  ops:["En variables del Jenkinsfile","En el almacén de credenciales con alcance mínimo, inyectados con withCredentials, sin imprimirlos ni interpolarlos en Groovy, y mejor aún con credenciales temporales (OIDC o Vault)","En un fichero .env del repositorio","En parámetros del job"],
  ok:1, why:"Es una de las preguntas más frecuentes en entrevistas de DevOps."},
 {t:"opcion", p:"«Los builds tardan 40 minutos. ¿Qué harías?»",
  ops:["Comprar un servidor más grande y ya","Medir qué etapa tarda más, paralelizar pruebas, cachear dependencias, agentes efímeros para escalar, no repetir trabajo (stash, build once) y separar pruebas lentas a builds nocturnos","Quitar las pruebas","Hacer menos commits"],
  ok:1, why:"Primero medir; después atacar la etapa más lenta."},
 {t:"par", p:"Empareja cada pregunta de entrevista con la idea clave de la respuesta",
  pares:[["¿Declarativo o scripted?","Declarativo, con script o shared libraries para la lógica"],["¿Cómo evitas repetir pipelines?","Shared libraries versionadas"],["¿Dónde se ejecutan los builds?","En agentes, nunca en el controlador"],["¿Cómo recuperas Jenkins si se pierde?","JCasC más copia de JENKINS_HOME con secrets/"],["¿Cómo proteges producción?","Solo desde main, con aprobación y la misma imagen probada"]],
  why:"Respuestas cortas y con el porqué: eso es lo que se evalúa."},
 {t:"info", eti:"Terminado", h:"Has completado Jenkins",
  c:`<p>Dominas CI/CD, la arquitectura de Jenkins, los pipelines declarativos, el pipeline completo de una API Java, agentes y paralelismo, multibranch, shared libraries, JCasC, seguridad, operación y diagnóstico.</p>
     <p>Para consolidarlo: levanta Jenkins con Docker y crea un Multibranch Pipeline para el proyecto de Spring Boot del laboratorio (<code>laboratorio/05-compose</code>) que pruebe, construya la imagen y la despliegue con Docker Compose.</p>`}
]}

]});
