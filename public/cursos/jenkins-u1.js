window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Qué es Jenkins",
resumen: "Integración y entrega continuas, la arquitectura de Jenkins (controlador, agentes, executors, plugins) y cómo levantarlo con Docker",
nivel: "Fundamentos",
color: "#d24939",
lecciones: [

{
id:"jk1l1",
titulo:"Integración y entrega continuas",
claves:["CI: integrar el código varias veces al día y comprobar cada cambio automáticamente","CD: dejar cada cambio listo para desplegar (entrega) o desplegarlo solo (despliegue continuo)","Jenkins es un servidor de automatización de código abierto que ejecuta esos procesos"],
pasos:[
 {t:"info", eti:"Empezamos", h:"El problema que resuelve",
  c:`<p>Sin automatización, cada persona compila y prueba «en su máquina», y los errores aparecen días después, al juntar el trabajo de todos. La <b>integración continua</b> (CI) cambia eso: <b>cada vez que alguien sube código</b>, un servidor lo descarga, lo compila y pasa las pruebas. Si algo se rompe, se sabe en minutos y se sabe qué cambio fue.</p>
     <p>La <b>entrega continua</b> (CD) va un paso más allá: el resultado de cada cambio que pasa las pruebas queda <b>listo para producción</b> (una imagen Docker, un .jar). Con <b>despliegue continuo</b>, además, se despliega solo.</p>
     <p><b>Jenkins</b> es el servidor de automatización más veterano y extendido: de código abierto, escrito en Java y ampliable con miles de plugins.</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Integración continua","Compilar y probar automáticamente cada cambio que se sube"],["Entrega continua","Cada cambio aprobado queda listo para desplegar con un clic"],["Despliegue continuo","Cada cambio aprobado llega solo a producción"],["Pipeline","La secuencia automatizada de pasos: compilar, probar, empaquetar, desplegar"],["Build","Una ejecución concreta de ese proceso, con su número y su resultado"]],
  why:"En entrevistas se pregunta mucho la diferencia entre entrega y despliegue continuo."},
 {t:"opcion", p:"Un equipo integra su código una vez al mes y cada integración tarda una semana en estabilizarse. ¿Qué práctica ataca directamente ese problema?",
  ops:["Escribir más documentación","Integración continua: integrar a menudo y validar cada cambio automáticamente","Contratar más testers","Hacer despliegues los viernes"],
  ok:1, why:"Integrar poco y tarde acumula conflictos; integrar a menudo los hace pequeños y fáciles de arreglar."},
 {t:"vf", p:"Entrega continua y despliegue continuo significan exactamente lo mismo.",
  ok:false, why:"En la entrega continua el paso a producción es una decisión humana; en el despliegue continuo es automático."}
]},

{
id:"jk1l2",
titulo:"Arquitectura de Jenkins",
claves:["El controlador guarda la configuración, programa los builds y muestra la interfaz","Los agentes ejecutan el trabajo; cada executor es un hueco para un build a la vez","Casi todo en Jenkins lo aportan plugins; JENKINS_HOME guarda todo su estado"],
pasos:[
 {t:"info", eti:"Por dentro", h:"Controlador, agentes y executors",
  c:`<div class="diag">            ┌──────────────── CONTROLADOR (antes «master») ───────────────┐
 webhook ─▶ │ interfaz web · cola de builds · configuración · plugins     │
            │ JENKINS_HOME: jobs, historial de builds, credenciales       │
            └───────┬───────────────────────┬─────────────────────────────┘
                    │ reparte el trabajo      │
          ┌─────────▼────────┐      ┌─────────▼────────┐
          │ AGENTE linux-1   │      │ AGENTE docker    │
          │ 2 executors      │      │ contenedores     │
          └──────────────────┘      └──────────────────┘</div>
     <p>El <b>controlador</b> decide qué se ejecuta y dónde; los <b>agentes</b> (máquinas, contenedores o pods) hacen el trabajo pesado. Cada agente tiene uno o varios <b>executors</b>: huecos donde corre un build a la vez. Buena práctica: <b>0 executors en el controlador</b>, para que ningún build pueda tocar su configuración.</p>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["Controlador","Programa los builds, guarda la configuración y sirve la interfaz"],["Agente","Máquina o contenedor que ejecuta los pasos del pipeline"],["Executor","Hueco de un agente para ejecutar un build a la vez"],["Plugin","Extensión que añade integraciones y funciones"],["JENKINS_HOME","Directorio con todo el estado: jobs, builds, credenciales"],["Cola de builds","Builds esperando un executor libre"]],
  why:"Si la cola crece, faltan executors o agentes; es un síntoma típico que se pregunta."},
 {t:"opcion", p:"¿Por qué se recomienda dejar el controlador con 0 executors?",
  ops:["Para ahorrar licencias","Para que los builds no se ejecuten en el controlador: no le roben recursos ni puedan leer o modificar su configuración y credenciales","Porque el controlador no sabe ejecutar comandos","Para que Jenkins arranque más rápido"],
  ok:1, why:"Un build es código arbitrario: ejecutarlo junto a JENKINS_HOME es un riesgo de seguridad y de estabilidad."},
 {t:"hueco", p:"Completa: el trabajo de los builds lo hacen los…",
  tpl:"El controlador reparte los builds entre los ___, y cada uno tiene uno o varios ___.", banco:["agentes","executors","plugins","workspaces"], sol:["agentes","executors"],
  why:"Controlador = cerebro; agentes y executors = manos."}
]},

{
id:"jk1l3",
titulo:"Levantar Jenkins con Docker",
claves:["Imagen oficial jenkins/jenkins:lts-jdk17 (versión LTS: la estable)","Volumen para /var/jenkins_home: sin él, se pierde todo al borrar el contenedor","La contraseña inicial está en secrets/initialAdminPassword"],
pasos:[
 {t:"info", eti:"Práctica", h:"Jenkins en un contenedor",
  c:`<div class="termbox">docker run -d --name jenkins \\
  -p 8080:8080 -p 50000:50000 \\
  -v jenkins_home:/var/jenkins_home \\
  jenkins/jenkins:lts-jdk17</div>
     <p><code>8080</code> es la interfaz web; <code>50000</code> es el puerto por el que se conectan los agentes. El volumen <code>jenkins_home</code> guarda jobs, builds, plugins y credenciales: si borras el contenedor, los datos siguen ahí.</p>
     <p>Al abrir <code>http://localhost:8080</code> por primera vez, Jenkins pide una contraseña de desbloqueo que escribe en su registro y en un fichero.</p>`},
 {t:"term", p:"Muestra la contraseña inicial de administrador del contenedor <code>jenkins</code>",
  prompt:"pablo@portatil:~$", sol:["docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword","docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword"],
  pista:"docker exec jenkins cat /var/jenkins_home/secrets/...",
  salida:`3f9c1a7e5b2d4c8e9a0b1c2d3e4f5a6b`, why:"También aparece en docker logs jenkins. Después, el asistente instala los plugins sugeridos y crea tu usuario."},
 {t:"orden", p:"Ordena la puesta en marcha de Jenkins",
  items:["Arrancar el contenedor con el volumen jenkins_home","Abrir http://localhost:8080","Pegar la contraseña de initialAdminPassword","Instalar los plugins sugeridos","Crear el usuario administrador","Crear el primer job"],
  why:"El volumen va desde el principio: si lo añades después, empiezas de cero."},
 {t:"opcion", p:"¿Qué imagen deberías usar para un Jenkins de trabajo?",
  ops:["jenkins/jenkins:latest, siempre lo más nuevo","jenkins/jenkins:lts-jdk17, la versión LTS estable con la versión de Java fijada","jenkins:alpine, la más pequeña","Cualquiera, son iguales"],
  ok:1, why:"LTS (Long Term Support) recibe correcciones durante más tiempo y cambia menos: es la que se usa en producción."},
 {t:"vf", p:"Si borras el contenedor pero conservas el volumen jenkins_home, al crear otro contenedor con ese volumen recuperas los jobs y su historial.",
  ok:true, why:"Todo el estado de Jenkins vive en JENKINS_HOME; por eso es lo que hay que respaldar."}
]}

]});
