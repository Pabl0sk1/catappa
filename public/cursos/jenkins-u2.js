window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Cómo funciona Jenkins por dentro",
resumen: "El controlador, los agentes y los executors, los plugins y JENKINS_HOME, explicados con calma",
nivel: "Fundamentos",
color: "#d6503c",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"jn2l1",
titulo:"El controlador: el cerebro de Jenkins",
claves:["El controlador es el programa principal de Jenkins","Muestra la interfaz web, guarda la configuración y decide qué build se ejecuta y dónde","Antes se llamaba «master»; hoy se dice «controlador» (controller)"],
pasos:[
 {t:"info", eti:"La analogía", h:"Jenkins es una cocina",
  c:`<p>Para entender cómo está organizado Jenkins, piensa en la cocina de un restaurante:</p>
     <ul><li>Hay un <b>jefe de cocina</b> que recibe los pedidos, decide quién cocina cada plato y lleva el control.</li>
     <li>Hay <b>cocineros</b> que cocinan de verdad.</li>
     <li>Cada cocinero tiene unos <b>fogones</b>: en cada fogón se prepara un plato a la vez.</li></ul>
     <p>En Jenkins, el jefe de cocina es el <b>controlador</b>, los cocineros son los <b>agentes</b> y los fogones son los <b>executors</b>. Vamos a verlos uno por uno.</p>`},
 {t:"info", eti:"Pieza 1", h:"El controlador",
  c:`<p>El <b>controlador</b> (en inglés <i>controller</i>; en documentación antigua, <i>master</i>) es el programa principal de Jenkins. Se encarga de:</p>
     <ul><li>Mostrar la <b>interfaz web</b> (la página que abres en el navegador).</li>
     <li>Guardar la <b>configuración</b>: qué jobs hay, qué usuarios, qué contraseñas.</li>
     <li>Recibir los avisos (por ejemplo, «alguien hizo push») y poner los builds en una <b>cola</b>.</li>
     <li>Decidir <b>qué build se ejecuta y en qué máquina</b>.</li></ul>`},
 {t:"opcion", p:"En la analogía de la cocina, ¿quién es el controlador?",
  ops:["Un cocinero","El jefe de cocina, que recibe los pedidos y decide quién cocina qué","Un fogón","El cliente"],
  ok:1, why:"El controlador organiza y decide; no es el que hace el trabajo pesado."},
 {t:"par", p:"Empareja cada tarea con quién la hace en Jenkins",
  pares:[["Mostrar la página web de Jenkins","El controlador"],["Guardar la lista de jobs y usuarios","La configuración del controlador"],["Poner en espera los builds que llegan","La cola de builds"]],
  why:"Todo eso vive en el controlador."},
 {t:"vf", p:"«Master» y «controlador» son dos nombres para la misma pieza de Jenkins.",
  ok:true, why:"Jenkins cambió el nombre a «controller»; en tutoriales antiguos verás «master»."}
]},

/* =============== U2 L2 =============== */
{
id:"jn2l2",
titulo:"Agentes y executors",
claves:["Los agentes son las máquinas (o contenedores) donde se ejecutan los builds","Un executor es un hueco de un agente: ejecuta un build a la vez","Buena práctica: 0 executors en el controlador, para que los builds no corran junto a su configuración"],
pasos:[
 {t:"info", eti:"Pieza 2", h:"Los agentes",
  c:`<p>Un <b>agente</b> (antes llamado <i>slave</i> o <i>nodo</i>) es una máquina donde Jenkins <b>ejecuta los builds</b>. Puede ser un servidor, una máquina virtual, un contenedor Docker o un pod de Kubernetes.</p>
     <p>¿Por qué no ejecutarlo todo en el controlador? Porque los builds consumen mucha CPU y memoria (compilar Java es pesado), y porque cada proyecto puede necesitar herramientas distintas: uno Java 21, otro Node.js, otro Windows.</p>
     <div class="diag">                 CONTROLADOR
                 (decide y organiza)
          ┌───────────┼────────────┐
     AGENTE linux  AGENTE docker  AGENTE windows
     (Java 21)     (contenedores) (apps de Windows)</div>`},
 {t:"opcion", p:"¿Dónde se ejecutan los builds en una instalación bien organizada de Jenkins?",
  ops:["En el navegador del usuario","En los agentes","En GitHub","En la base de datos"],
  ok:1, why:"El controlador reparte el trabajo; los agentes lo hacen."},
 {t:"info", eti:"Pieza 3", h:"Los executors",
  c:`<p>Cada agente tiene uno o varios <b>executors</b>. Un executor es un «hueco» donde se ejecuta <b>un build a la vez</b>, como un fogón donde se cocina un plato a la vez.</p>
     <ul><li>Un agente con <b>2 executors</b> puede ejecutar <b>2 builds a la vez</b>.</li>
     <li>Si llegan más builds que executors libres, los que sobran <b>esperan en la cola</b>.</li></ul>`},
 {t:"opcion", p:"Tienes un agente con 2 executors y llegan 5 builds a la vez. ¿Qué pasa?",
  ops:["Se ejecutan los 5 a la vez","Se ejecutan 2 y los otros 3 esperan en la cola hasta que se libere un executor","Jenkins rechaza los 3 que sobran","Se ejecutan uno detrás de otro sin cola"],
  ok:1, why:"Si la cola crece mucho, necesitas más executors o más agentes."},
 {t:"par", p:"Empareja cada pieza de Jenkins con su papel en la cocina",
  pares:[["Controlador","Jefe de cocina"],["Agente","Cocinero"],["Executor","Fogón"],["Cola de builds","Pedidos esperando un fogón libre"]],
  why:"Si te acuerdas de la cocina, te acuerdas de la arquitectura de Jenkins."},
 {t:"info", eti:"Buena práctica", h:"Cero executors en el controlador",
  c:`<p>El controlador también puede tener executors, pero se recomienda ponerle <b>0</b>. El motivo: un build ejecuta el código de tu proyecto, que podría estar mal o incluso ser malicioso. Si se ejecuta en el controlador, podría leer o borrar la configuración de Jenkins y todas las contraseñas que guarda.</p>`},
 {t:"vf", p:"Se recomienda que el controlador ejecute builds para aprovechar su CPU.",
  ok:false, why:"Se recomienda 0 executors en el controlador: los builds, en los agentes, lejos de la configuración y los secretos."}
]},

/* =============== U2 L3 =============== */
{
id:"jn2l3",
titulo:"Plugins",
claves:["Casi todo lo que hace Jenkins lo aporta un plugin: Git, pipelines, Docker, credenciales…","Se instalan desde Administrar Jenkins → Plugins","Pocos, mantenidos y actualizados: cada plugin es código que puede fallar o tener vulnerabilidades"],
pasos:[
 {t:"info", eti:"Ampliar Jenkins", h:"Qué es un plugin",
  c:`<p>Jenkins, recién instalado, sabe hacer muy poco. Casi todo lo aportan los <b>plugins</b>: pequeños complementos que añaden funciones. Por ejemplo:</p>
     <ul><li><b>Git</b>: descargar código de repositorios Git.</li>
     <li><b>Pipeline</b>: escribir pipelines como código (lo verás en la unidad 5).</li>
     <li><b>Docker Pipeline</b>: ejecutar pasos dentro de contenedores.</li>
     <li><b>Credentials</b>: guardar contraseñas y tokens de forma segura.</li></ul>
     <p>Se instalan desde <b>Administrar Jenkins → Plugins</b> (en inglés, <i>Manage Jenkins → Plugins</i>).</p>
     <div class="nota"><b class="tit">La analogía</b>Como las extensiones de un navegador o las apps de un móvil: el sistema base es sencillo y lo amplías con lo que necesites.</div>`},
 {t:"opcion", p:"Quieres que Jenkins descargue el código de GitHub. ¿Qué necesitas?",
  ops:["Programarlo tú en Java","El plugin de Git (viene entre los plugins sugeridos al instalar)","Otro servidor","Nada, Jenkins no puede hacerlo"],
  ok:1, why:"Las integraciones con otras herramientas llegan casi siempre como plugins."},
 {t:"info", eti:"Con cuidado", h:"Más plugins no es mejor",
  c:`<p>Cada plugin es código de terceros que corre dentro de Jenkins. Por eso:</p>
     <ul><li>Un plugin <b>desactualizado</b> puede tener fallos de seguridad conocidos.</li>
     <li>Al actualizar Jenkins, un plugin viejo puede dejar de ser <b>compatible</b> y romper los pipelines.</li></ul>
     <p>Regla: instala solo los que necesites, de fuentes mantenidas, y actualízalos con frecuencia.</p>`},
 {t:"vf", p:"Instalar muchos plugins «por si acaso» es una buena práctica.",
  ok:false, why:"Cada plugin añade riesgo de fallos de compatibilidad y de seguridad. Solo los necesarios."},
 {t:"opcion", p:"Tras actualizar Jenkins, varios pipelines empiezan a fallar. ¿Cuál es una causa típica?",
  ops:["Que los desarrolladores olvidaron programar","Un plugin incompatible con la nueva versión de Jenkins","Que GitHub está caído siempre","Que el navegador es antiguo"],
  ok:1, why:"Por eso las actualizaciones se prueban antes en un Jenkins de pruebas."}
]},

/* =============== U2 L4 =============== */
{
id:"jn2l4",
titulo:"JENKINS_HOME: donde se guarda todo",
claves:["JENKINS_HOME es la carpeta con todo el estado: configuración, jobs, historial de builds, plugins y credenciales","En Docker es /var/jenkins_home y se guarda en un volumen","Es lo que hay que respaldar: si se pierde, se pierde todo Jenkins"],
pasos:[
 {t:"info", eti:"El disco de Jenkins", h:"Una carpeta con todo",
  c:`<p>Jenkins no usa una base de datos: guarda todo en ficheros dentro de una carpeta llamada <b>JENKINS_HOME</b>. Dentro hay:</p>
     <div class="diag">JENKINS_HOME/
├── config.xml          configuración general
├── jobs/               cada job y el historial de sus builds
├── plugins/            los plugins instalados
├── credentials.xml     contraseñas y tokens (cifrados)
├── secrets/            las claves para descifrarlos
└── workspace/          carpetas de trabajo de los builds</div>
     <p>Si usas Docker, esta carpeta es <code>/var/jenkins_home</code> dentro del contenedor.</p>`},
 {t:"opcion", p:"¿Dónde guarda Jenkins la lista de jobs y el historial de builds?",
  ops:["En una base de datos PostgreSQL","En ficheros dentro de la carpeta JENKINS_HOME","En GitHub","En la memoria del navegador"],
  ok:1, why:"Todo el estado de Jenkins son ficheros en JENKINS_HOME."},
 {t:"info", eti:"Recuerda Docker", h:"Por qué necesita un volumen",
  c:`<p>En el curso de Docker viste que lo que se escribe dentro de un contenedor <b>se pierde al borrarlo</b>, salvo que esté en un <b>volumen</b>. Con Jenkins esto es crítico: sin volumen, al borrar el contenedor perderías todos los jobs, el historial y las credenciales.</p>
     <p>Por eso siempre se arranca Jenkins con un volumen montado en <code>/var/jenkins_home</code>. Lo harás en la siguiente unidad.</p>`},
 {t:"vf", p:"Si ejecutas Jenkins en Docker sin volumen y borras el contenedor, pierdes toda su configuración.",
  ok:true, why:"Los datos vivían en la capa del contenedor, que desaparece con él."},
 {t:"par", p:"Empareja cada elemento de JENKINS_HOME con lo que guarda",
  pares:[["jobs/","Los jobs y el historial de sus builds"],["plugins/","Los plugins instalados"],["credentials.xml","Las credenciales cifradas"],["secrets/","Las claves que descifran las credenciales"]],
  why:"Para restaurar las credenciales hacen falta credentials.xml y secrets/ juntos."},
 {t:"opcion", p:"¿Qué es lo más importante de lo que hacer copia de seguridad en Jenkins?",
  ops:["El navegador","La carpeta JENKINS_HOME (o, como mínimo, su configuración, jobs y credenciales con secrets/)","Los agentes","El código de Jenkins"],
  ok:1, why:"Jenkins se reinstala en minutos; lo valioso es su estado."}
]}

]});
