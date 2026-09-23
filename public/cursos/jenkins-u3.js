window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Instalar Jenkins y conocer su interfaz",
resumen: "Levantar Jenkins con Docker entendiendo cada parte del comando, el asistente inicial y un recorrido por la interfaz",
nivel: "Fundamentos",
color: "#d9573f",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"jn3l1",
titulo:"Levantar Jenkins con Docker",
claves:["Imagen oficial: jenkins/jenkins:lts-jdk17 (LTS = versión estable de soporte largo)","Puerto 8080: la web; puerto 50000: conexión de los agentes","Volumen en /var/jenkins_home para no perder nada"],
pasos:[
 {t:"info", eti:"Elegir la imagen", h:"jenkins/jenkins:lts-jdk17",
  c:`<p>La forma más sencilla de probar Jenkins es con Docker, que ya conoces. La imagen oficial es <code>jenkins/jenkins</code>, y la etiqueta importa:</p>
     <ul><li><b>lts</b> significa <i>Long Term Support</i>: la versión <b>estable</b>, que recibe correcciones durante más tiempo. Es la que se usa en empresas.</li>
     <li><b>jdk17</b> indica la versión de Java con la que funciona Jenkins por dentro.</li></ul>
     <p>Evita <code>latest</code>: cambia cada semana y puede traer cambios inesperados.</p>`},
 {t:"opcion", p:"¿Qué significa «lts» en la etiqueta <code>jenkins/jenkins:lts-jdk17</code>?",
  ops:["Que es la versión más nueva","Long Term Support: la versión estable, con soporte más largo","Que es más ligera","Que solo funciona en Linux"],
  ok:1, why:"En producción se usan versiones LTS: cambian menos y se corrigen durante más tiempo."},
 {t:"info", eti:"El comando", h:"Parte por parte",
  c:`<div class="termbox">docker run -d --name jenkins \\
  -p 8080:8080 \\
  -p 50000:50000 \\
  -v jenkins_home:/var/jenkins_home \\
  jenkins/jenkins:lts-jdk17</div>
     <ul><li><code>-d</code>: en segundo plano, para que no ocupe tu terminal.</li>
     <li><code>--name jenkins</code>: le pone nombre al contenedor.</li>
     <li><code>-p 8080:8080</code>: la <b>interfaz web</b>; la abrirás en <code>http://localhost:8080</code>.</li>
     <li><code>-p 50000:50000</code>: el puerto por el que se <b>conectan los agentes</b>.</li>
     <li><code>-v jenkins_home:/var/jenkins_home</code>: el <b>volumen</b> con todo el estado (JENKINS_HOME).</li></ul>
     <p>La barra invertida al final de cada línea solo sirve para partir un comando largo en varias líneas.</p>`},
 {t:"par", p:"Empareja cada parte del comando con su función",
  pares:[["-d","Ejecutar en segundo plano"],["-p 8080:8080","Publicar la interfaz web"],["-p 50000:50000","Puerto para que se conecten los agentes"],["-v jenkins_home:/var/jenkins_home","Guardar el estado de Jenkins en un volumen"],["--name jenkins","Dar un nombre al contenedor"]],
  why:"Todo lo aprendiste en el curso de Docker; aquí solo se aplica a Jenkins."},
 {t:"hueco", p:"Completa el comando para que Jenkins no pierda sus datos",
  tpl:"docker run -d -p 8080:8080 -v ___:/var/jenkins_home jenkins/jenkins:___", banco:["jenkins_home","lts-jdk17","latest","/tmp"], sol:["jenkins_home","lts-jdk17"],
  why:"Volumen con nombre para los datos e imagen LTS con la versión de Java fijada."},
 {t:"term", p:"Arranca Jenkins en segundo plano con el nombre <code>jenkins</code>, los puertos 8080 y 50000, el volumen <code>jenkins_home</code> y la imagen <code>jenkins/jenkins:lts-jdk17</code>",
  prompt:"pablo@portatil:~$", re:"^docker run (?=.*-d)(?=.*--name jenkins)(?=.*-p 8080:8080)(?=.*-p 50000:50000)(?=.*-v jenkins_home:/var/jenkins_home).*jenkins/jenkins:lts-jdk17$",
  sol:["docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts-jdk17"],
  pista:"docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts-jdk17",
  salida:`Unable to find image 'jenkins/jenkins:lts-jdk17' locally
lts-jdk17: Pulling from jenkins/jenkins
Status: Downloaded newer image for jenkins/jenkins:lts-jdk17
8d2f1c7a9b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a`, why:"La primera vez descarga la imagen (unos 500 MB). Después, arrancar tarda unos segundos."},
 {t:"vf", p:"Si más adelante borras este contenedor y creas otro con el mismo volumen jenkins_home, Jenkins conserva sus jobs y su configuración.",
  ok:true, why:"Todo el estado está en el volumen, no en el contenedor."}
]},

/* =============== U3 L2 =============== */
{
id:"jn3l2",
titulo:"El asistente inicial",
claves:["La primera vez Jenkins pide una contraseña de desbloqueo guardada en secrets/initialAdminPassword","Después instala plugins (los sugeridos son un buen comienzo) y crea tu usuario administrador","Por último se confirma la URL con la que se accede a Jenkins"],
pasos:[
 {t:"info", eti:"Primer arranque", h:"Desbloquear Jenkins",
  c:`<p>Al abrir <code>http://localhost:8080</code> por primera vez, Jenkins muestra la pantalla <b>«Unlock Jenkins»</b> (desbloquear Jenkins). Pide una contraseña que él mismo generó al arrancar, para asegurarse de que quien lo configura tiene acceso al servidor.</p>
     <p>Esa contraseña está en el fichero <code>/var/jenkins_home/secrets/initialAdminPassword</code> dentro del contenedor, y también aparece en su registro (<code>docker logs jenkins</code>).</p>`},
 {t:"term", p:"Muestra la contraseña inicial leyendo ese fichero dentro del contenedor <code>jenkins</code>",
  prompt:"pablo@portatil:~$", sol:["docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword","docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword"],
  pista:"docker exec jenkins cat y la ruta del fichero.",
  salida:`3f9c1a7e5b2d4c8e9a0b1c2d3e4f5a6b`, why:"docker exec ejecuta un comando dentro del contenedor; cat muestra el contenido del fichero."},
 {t:"info", eti:"Siguientes pantallas", h:"Plugins, usuario y URL",
  c:`<ol><li><b>Customize Jenkins</b>: elige <b>«Install suggested plugins»</b> (instalar los plugins sugeridos). Incluye Git, Pipeline y Credentials, que usarás en el curso.</li>
     <li><b>Create First Admin User</b>: crea tu usuario administrador (usuario, contraseña, nombre y correo). A partir de ahora entrarás con él.</li>
     <li><b>Instance Configuration</b>: confirma la URL de Jenkins, por ejemplo <code>http://localhost:8080/</code>. Se usa en los enlaces que envía Jenkins.</li>
     <li><b>Jenkins is ready!</b>: listo.</li></ol>`},
 {t:"orden", p:"Ordena el asistente inicial de Jenkins",
  items:["Pegar la contraseña de initialAdminPassword","Instalar los plugins sugeridos","Crear el usuario administrador","Confirmar la URL de Jenkins","Empezar a usar Jenkins"],
  why:"Solo se hace una vez; queda guardado en JENKINS_HOME."},
 {t:"opcion", p:"¿Por qué Jenkins pide una contraseña que está en un fichero del propio servidor?",
  ops:["Para molestar","Para comprobar que quien lo configura tiene acceso al servidor, y no cualquiera que llegue a la página","Porque no tiene usuarios","Para cifrar los plugins"],
  ok:1, why:"Si no, el primero que abriera la página podría quedarse con el control de Jenkins."},
 {t:"vf", p:"Los plugins sugeridos incluyen lo necesario para empezar con Git y pipelines.",
  ok:true, why:"Es la opción recomendada para empezar; más adelante puedes añadir o quitar plugins."}
]},

/* =============== U3 L3 =============== */
{
id:"jn3l3",
titulo:"Un recorrido por la interfaz",
claves:["El panel principal (Dashboard) lista los jobs con su último resultado","Nueva tarea (New Item) crea jobs; Administrar Jenkins (Manage Jenkins) configura el sistema","A la izquierda se ven la cola de builds y el estado de los executors"],
pasos:[
 {t:"info", eti:"Orientarse", h:"La pantalla principal",
  c:`<div class="dg dg-arbol"><div class="rama" style="--n:0"><span class="nom">┌─────────────────────────────────────────────────────────────┐</span></div><div class="rama" style="--n:0"><span class="nom">Jenkins</span><span class="coment">pablo ▾      │</span></div><div class="rama" style="--n:1"><span class="nom">┬──────────────────────────────────────┤</span></div><div class="rama" style="--n:0"><span class="nom">+ Nueva tarea</span><span class="coment">│  Panel de control (Dashboard)        │</span></div><div class="rama" style="--n:0"><span class="nom">Personas</span><span class="coment">│  ┌────┬──────────────┬─────────────┐ │</span></div><div class="rama" style="--n:0"><span class="nom">Historial</span><span class="coment">│  │ ✔  │ api-tareas   │ hace 2 h #48│ │</span></div><div class="rama" style="--n:0"><span class="nom">⚙ Administrar Jenkins│</span><span class="coment">│ ✘  │ web-tienda   │ hace 5 m #12│ │</span></div><div class="rama" style="--n:8"><span class="nom">┴──────────────┴─────────────┘ │</span></div><div class="rama" style="--n:0"><span class="nom">Cola de builds (1)</span><span class="coment">│                                      │</span></div><div class="rama" style="--n:0"><span class="nom">Estado de executors</span><span class="coment">│                                      │</span></div><div class="rama" style="--n:0"><span class="nom">1 En espera</span><span class="coment">│                                      │</span></div><div class="rama" style="--n:0"><span class="nom">2 api-tareas #49</span><span class="coment">│                                      │</span></div><div class="rama" style="--n:1"><span class="nom">┴──────────────────────────────────────┘</span></div></div>
     <p>Jenkins muestra la interfaz en el idioma de tu navegador; aquí verás los nombres en español y entre paréntesis en inglés, porque en internet los encontrarás de las dos formas.</p>`},
 {t:"par", p:"Empareja cada parte de la interfaz con su función",
  pares:[["Nueva tarea (New Item)","Crear un job nuevo"],["Panel de control (Dashboard)","Ver todos los jobs y su último resultado"],["Administrar Jenkins (Manage Jenkins)","Configurar el sistema, plugins, credenciales y agentes"],["Cola de builds (Build Queue)","Builds esperando un executor libre"],["Estado de executors (Build Executor Status)","Qué está ejecutando cada executor ahora mismo"]],
  why:"Con estas cinco zonas te mueves por todo Jenkins."},
 {t:"opcion", p:"Quieres instalar un plugin. ¿Dónde entras?",
  ops:["Nueva tarea","Administrar Jenkins → Plugins","Historial de builds","Personas"],
  ok:1, why:"Todo lo que afecta al sistema entero está en Administrar Jenkins."},
 {t:"info", eti:"Colores", h:"Cómo leer el estado de un job",
  c:`<p>En el panel, cada job muestra el resultado de su <b>último build</b>:</p>
     <ul><li><b>Verde</b> (✔): el último build terminó bien.</li>
     <li><b>Rojo</b> (✘): el último build falló.</li>
     <li><b>Amarillo</b>: el build terminó pero hay pruebas que fallaron (lo verás en detalle más adelante).</li>
     <li><b>Gris</b>: nunca se ha ejecutado o se canceló.</li></ul>
     <p>También hay un icono del tiempo (sol, nubes, tormenta) que resume <b>los últimos builds</b>: sol si casi todos fueron bien, tormenta si casi todos fallaron.</p>`},
 {t:"opcion", p:"Un job aparece en rojo en el panel. ¿Qué significa?",
  ops:["Que está desactivado","Que su último build falló","Que nunca se ha ejecutado","Que está en la cola"],
  ok:1, why:"El color refleja el último build; el icono del tiempo, la tendencia reciente."},
 {t:"vf", p:"La cola de builds con muchos elementos esperando indica que faltan executors o agentes.",
  ok:true, why:"Es la primera señal de que Jenkins necesita más capacidad."}
]}

]});
