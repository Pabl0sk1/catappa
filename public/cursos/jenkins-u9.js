window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Escalar a muchos proyectos",
resumen: "Un pipeline por rama y por Pull Request, librerías compartidas para no repetir código y Jenkins configurado como código",
nivel: "Avanzado",
color: "#c4513a",
lecciones: [

/* =============== U9 L1 =============== */
{
id:"jn9l1",
titulo:"Multibranch: un pipeline por rama",
claves:["Un Multibranch Pipeline descubre solo las ramas y Pull Requests que tienen Jenkinsfile","BRANCH_NAME indica qué rama se construye; CHANGE_ID, el número del Pull Request","El resultado se publica en GitHub y puede exigirse antes de fusionar"],
pasos:[
 {t:"info", eti:"El problema", h:"Un job por rama no escala",
  c:`<p>Hasta ahora has creado un job que construye una rama. Pero en un equipo hay muchas ramas a la vez: cada persona trabaja en la suya y abre un <b>Pull Request</b> (una propuesta de cambio) para fusionarla.</p>
     <p>Crear a mano un job por rama sería imposible de mantener. Para eso existe el <b>Multibranch Pipeline</b>: Jenkins mira el repositorio y <b>crea un job automáticamente</b> para cada rama y cada Pull Request que tenga Jenkinsfile. Cuando una rama se borra, su job desaparece.</p>
     <div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom">api-tareas (Multibranch Pipeline)</span></div><div class="rama" style="--n:1"><span class="nom">main</span><span class="coment">#212 ✔</span></div><div class="rama" style="--n:1"><span class="nom">feature/login</span><span class="coment">#7   ✔</span></div><div class="rama" style="--n:1"><span class="nom">PR-58</span><span class="coment">#3   ✘</span></div><div class="rama" style="--n:1"><span class="nom">PR-61</span><span class="coment">#1   ▶ en curso</span></div></div>`},
 {t:"opcion", p:"¿Qué hace un Multibranch Pipeline?",
  ops:["Ejecutar varias etapas a la vez","Crear y mantener automáticamente un job por cada rama y Pull Request con Jenkinsfile","Fusionar ramas","Instalar plugins"],
  ok:1, why:"Descubre las ramas solo: no hay que crear ni borrar jobs a mano."},
 {t:"info", eti:"Ventaja doble", h:"El resultado llega a GitHub",
  c:`<p>Cuando Jenkins construye un Pull Request, publica el resultado en GitHub como una comprobación (<i>check</i>). GitHub puede <b>exigir que esa comprobación pase</b> antes de permitir la fusión (protección de rama).</p>
     <p>Resultado: el código que llega a <code>main</code> siempre ha pasado el pipeline.</p>`},
 {t:"par", p:"Empareja cada variable o idea con su significado",
  pares:[["BRANCH_NAME","La rama que se está construyendo"],["CHANGE_ID","El número del Pull Request"],["Check en GitHub","El resultado del build mostrado en el PR"],["Protección de rama","No dejar fusionar si el build falla"]],
  why:"Con esto, la rama principal se mantiene sana."},
 {t:"opcion", p:"¿Qué consigue exigir el check de Jenkins antes de fusionar?",
  ops:["Que los builds vayan más rápido","Que no entre en la rama principal código que no compila o que rompe pruebas","Que no haga falta revisar el código","Que se creen menos ramas"],
  ok:1, why:"Es la red de seguridad de la integración continua."},
 {t:"vf", p:"En un multibranch, cada rama usa el Jenkinsfile que tiene esa rama.",
  ok:true, why:"Así puedes probar un cambio del pipeline en tu rama antes de llevarlo a main."}
]},

/* =============== U9 L2 =============== */
{
id:"jn9l2",
titulo:"Librerías compartidas",
claves:["Una shared library es un repositorio con pipeline reutilizable","vars/ define pasos que se llaman como funciones; src/ contiene clases","@Library('nombre@version') fija la versión que usa cada proyecto"],
pasos:[
 {t:"info", eti:"El problema", h:"Veinte Jenkinsfiles casi iguales",
  c:`<p>Cuando una empresa tiene veinte servicios Java, sus Jenkinsfiles son casi idénticos. Si hay que cambiar algo (por ejemplo, añadir un análisis de seguridad), habría que tocar veinte repositorios.</p>
     <p>La solución es una <b>librería compartida</b> (<i>shared library</i>): un repositorio aparte con el pipeline común, que los demás proyectos usan.</p>`},
 {t:"info", eti:"Cómo es", h:"Estructura de una librería",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom carpeta">jenkins-comun/</span><span class="coment">(repositorio de la librería)</span></div><div class="rama" style="--n:1"><span class="nom carpeta">vars/</span></div><div class="rama" style="--n:2"><span class="nom">pipelineJava.groovy</span><span class="coment">paso global: se llama como pipelineJava(...)</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/</span></div><div class="rama" style="--n:2"><span class="nom">com/empresa/Util.groovy</span><span class="coment">clases para lógica más compleja</span></div><div class="rama" style="--n:1"><span class="nom carpeta">resources/</span><span class="coment">ficheros de apoyo</span></div></div>
     <div class="termbox">// Jenkinsfile de cada servicio: dos líneas
@Library('jenkins-comun@v2') _
pipelineJava(imagen: 'ghcr.io/empresa/pagos')</div>
     <p>El <code>@v2</code> fija la <b>versión</b> de la librería (una etiqueta de Git). Así, un cambio en la librería no rompe de golpe los veinte proyectos: cada uno sube de versión cuando quiere.</p>`},
 {t:"par", p:"Empareja cada parte con su función",
  pares:[["vars/","Pasos globales que se usan como funciones"],["src/","Clases con lógica más compleja"],["resources/","Ficheros de apoyo, como plantillas"],["@Library('lib@v2')","Cargar la librería fijando su versión"]],
  why:"La mayoría de equipos solo necesitan vars/."},
 {t:"opcion", p:"¿Por qué se fija la versión con <code>@v2</code> al cargar la librería?",
  ops:["Por estética","Para que un cambio en la librería no rompa a la vez todos los pipelines que la usan","Porque es obligatorio","Para que vaya más rápido"],
  ok:1, why:"Igual que se fijan las versiones de las dependencias de un proyecto."},
 {t:"vf", p:"Con una librería compartida, el Jenkinsfile de cada proyecto puede quedar en dos o tres líneas.",
  ok:true, why:"Todo el proceso común vive en la librería; cada proyecto solo pasa sus datos."}
]},

/* =============== U9 L3 =============== */
{
id:"jn9l3",
titulo:"Jenkins configurado como código",
claves:["JCasC (Configuration as Code) describe la configuración de Jenkins en un fichero jenkins.yaml","plugins.txt más un Dockerfile propio fijan qué plugins lleva la imagen","Objetivo: poder reconstruir el Jenkins entero desde cero, sin clics"],
pasos:[
 {t:"info", eti:"El problema", h:"El servidor que nadie sabe reproducir",
  c:`<p>Un Jenkins configurado a base de clics durante años se convierte en un servidor que <b>nadie sabe reconstruir</b>: si se pierde, nadie recuerda qué opciones tenía. Se le llama «servidor copo de nieve»: único e irrepetible.</p>
     <p>La solución es la misma idea que ya conoces: <b>escribirlo como código</b>.</p>`},
 {t:"info", eti:"Las piezas", h:"plugins.txt y jenkins.yaml",
  c:`<div class="termbox"># plugins.txt: qué plugins lleva
configuration-as-code
workflow-aggregator
git
credentials-binding

# Dockerfile: una imagen propia de Jenkins
FROM jenkins/jenkins:lts-jdk17
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt
COPY jenkins.yaml /var/jenkins_home/casc/jenkins.yaml
ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc/jenkins.yaml

# jenkins.yaml: la configuración (JCasC)
jenkins:
  numExecutors: 0
  securityRealm:
    local:
      allowsSignup: false</div>
     <p>Con esto, levantar un Jenkins idéntico es construir la imagen y arrancarla.</p>`},
 {t:"par", p:"Empareja cada fichero con su papel",
  pares:[["plugins.txt","La lista de plugins que lleva la imagen"],["Dockerfile","Construye una imagen propia de Jenkins con todo dentro"],["jenkins.yaml","La configuración del controlador (JCasC)"],["CASC_JENKINS_CONFIG","Indica dónde está ese jenkins.yaml"]],
  why:"Es la forma moderna de operar Jenkins."},
 {t:"opcion", p:"¿Qué problema evita configurar Jenkins con JCasC?",
  ops:["Ninguno, es igual de rápido","Depender de una configuración hecha a clics que nadie sabe reproducir ni revisar","Que haga falta Docker","Que haya agentes"],
  ok:1, why:"Con JCasC la configuración está en Git: se revisa, se versiona y se aplica igual siempre."},
 {t:"vf", p:"Con JCasC también se puede fijar que el controlador tenga 0 executors.",
  ok:true, why:"En el ejemplo, numExecutors: 0. La buena práctica queda escrita y no depende de que alguien la recuerde."}
]}

]});
