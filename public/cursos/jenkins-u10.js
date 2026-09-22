window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Seguridad y operación",
resumen: "Proteger Jenkins y sus secretos, permisos por usuario, copias de seguridad, monitorización y cómo diagnosticar errores típicos",
nivel: "Experto",
color: "#b84a35",
lecciones: [

/* =============== U10 L1 =============== */
{
id:"jn10l1",
titulo:"Por qué Jenkins es un objetivo",
claves:["Jenkins ejecuta código y guarda las llaves de producción: quien lo controla, controla los despliegues","Autenticación obligatoria, nada de acceso anónimo y siempre detrás de HTTPS","Nunca expuesto a internet sin necesidad; mejor en la red interna o con VPN"],
pasos:[
 {t:"info", eti:"La idea", h:"Jenkins tiene las llaves de todo",
  c:`<p>Piensa en lo que guarda y hace tu Jenkins:</p>
     <ul><li><b>Ejecuta código</b> automáticamente, con lo que sea que diga el repositorio.</li>
     <li>Guarda <b>credenciales</b> del registro de imágenes, de los servidores y de la nube.</li>
     <li><b>Despliega en producción</b>.</li></ul>
     <p>Por eso un Jenkins mal protegido es una de las piezas más peligrosas de una empresa: quien lo controla puede robar las credenciales y desplegar lo que quiera.</p>`},
 {t:"opcion", p:"¿Por qué un atacante querría entrar en tu Jenkins?",
  ops:["Para ver los logs","Porque desde ahí puede ejecutar código, robar credenciales y desplegar en producción","Para cambiar el idioma","No tiene interés"],
  ok:1, why:"Jenkins está conectado a todo lo demás: es una puerta muy valiosa."},
 {t:"info", eti:"Lo mínimo", h:"Tres medidas básicas",
  c:`<ol><li><b>Autenticación obligatoria</b>: nadie entra sin usuario. Nada de «cualquiera puede ver y construir».</li>
     <li><b>HTTPS</b>: normalmente con un proxy inverso (nginx) delante, para que las contraseñas y las sesiones no viajen en claro.</li>
     <li><b>No exponerlo a internet</b> si no hace falta: red interna o VPN. Si GitHub necesita enviar webhooks, se publica solo esa ruta.</li></ol>`},
 {t:"par", p:"Empareja cada medida con el riesgo que reduce",
  pares:[["Exigir iniciar sesión","Que cualquiera vea o lance builds"],["HTTPS con proxy delante","Que las contraseñas viajen en claro por la red"],["No exponerlo a internet","Que lo encuentre cualquiera desde fuera"]],
  why:"Son las tres primeras cosas que se revisan en una auditoría."},
 {t:"opcion", p:"Alguien deja un Jenkins en internet con acceso anónimo de administrador. ¿Qué es lo peor que puede pasar?",
  ops:["Que le cambien el tema visual","Que ejecuten código en el servidor, roben todas las credenciales y usen los agentes","Que se llene el disco","Nada grave"],
  ok:1, why:"La consola de scripts de Jenkins ejecuta código con todos los permisos: es control total."}
]},

/* =============== U10 L2 =============== */
{
id:"jn10l2",
titulo:"Permisos y separación",
claves:["Autorización por matriz o por roles: cada persona solo lo que necesita","0 executors en el controlador y builds solo en agentes","Cuidado con los Pull Requests de repositorios ajenos (forks): ejecutan código de terceros"],
pasos:[
 {t:"info", eti:"Quién puede qué", h:"Modelos de autorización",
  c:`<p>Jenkins ofrece varios modelos en <b>Administrar Jenkins → Seguridad</b>:</p>
     <ul><li><b>Cualquier usuario autenticado puede hacer cualquier cosa</b>: sencillo, válido para un equipo pequeño y de confianza.</li>
     <li><b>Matriz de seguridad</b>: una tabla donde marcas, permiso a permiso, qué puede hacer cada usuario o grupo (leer, construir, configurar, administrar).</li>
     <li><b>Estrategia basada en roles</b> (plugin Role-based Authorization): defines roles (desarrollo, operaciones, lectura) y se los asignas a grupos. Es lo más práctico cuando hay muchos equipos.</li></ul>`},
 {t:"par", p:"Empareja cada perfil con los permisos razonables",
  pares:[["Desarrollador de un equipo","Ver y lanzar los builds de sus proyectos"],["Responsable de plataforma","Administrar Jenkins, agentes y credenciales"],["Persona de otro equipo","Solo lectura"],["Cuenta de servicio de un script","Solo lo que necesita, nada de administración"]],
  why:"Es el principio de mínimo privilegio aplicado a Jenkins."},
 {t:"info", eti:"Recordatorio", h:"Los builds, lejos del controlador",
  c:`<p>Ya lo viste en la unidad 2 y aquí se entiende del todo: un build ejecuta el código del repositorio. Si se ejecuta en el controlador, ese código está <b>al lado de las credenciales y la configuración</b> de Jenkins.</p>
     <p>Por eso: <b>0 executors en el controlador</b> y builds solo en agentes, a ser posible efímeros.</p>`},
 {t:"opcion", p:"¿Por qué es peligroso construir automáticamente los Pull Requests que llegan de un fork (repositorio de un desconocido)?",
  ops:["Porque tardan más","Porque el Jenkinsfile y el código vienen de esa persona: se ejecutaría su código en tus agentes","Porque GitHub lo prohíbe","Porque gastan disco"],
  ok:1, why:"Por eso los proyectos abiertos exigen aprobación antes de construir PRs de terceros."},
 {t:"vf", p:"Dar permisos de administración a todo el equipo «para ir más rápido» es aceptable si son de confianza.",
  ok:false, why:"Un error humano con permisos de administración puede borrar jobs o filtrar credenciales. Mínimo privilegio."}
]},

/* =============== U10 L3 =============== */
{
id:"jn10l3",
titulo:"Copias de seguridad y actualizaciones",
claves:["Lo que hay que respaldar es JENKINS_HOME; las credenciales necesitan credentials.xml y secrets/ juntos","Probar la restauración: una copia que nunca se ha restaurado no sirve","Actualizar a versiones LTS con regularidad, probando antes en otro Jenkins"],
pasos:[
 {t:"info", eti:"Qué respaldar", h:"JENKINS_HOME",
  c:`<p>Ya sabes que todo el estado vive en <b>JENKINS_HOME</b>. Una copia de seguridad debe incluir al menos:</p>
     <ul><li><code>config.xml</code> y demás configuración del sistema.</li>
     <li><code>jobs/</code>: los jobs y su historial.</li>
     <li><code>credentials.xml</code> <b>y</b> la carpeta <code>secrets/</code>.</li></ul>
     <div class="nota"><b class="tit">El error clásico</b>Copiar <code>credentials.xml</code> sin <code>secrets/</code>. Las credenciales están cifradas con una clave que vive en <code>secrets/</code>: sin ella, al restaurar son ilegibles.</div>`},
 {t:"opcion", p:"Restauras Jenkins y ninguna credencial funciona. ¿Qué falta con más probabilidad?",
  ops:["Los plugins","La carpeta secrets/, que guarda la clave con la que se cifraron","Los agentes","El historial de builds"],
  ok:1, why:"credentials.xml y secrets/ van siempre juntos."},
 {t:"info", eti:"Practicar", h:"Restaurar también se ensaya",
  c:`<p>Una copia de seguridad solo vale si se ha probado a restaurarla. La forma cómoda de comprobarlo: levantar otro Jenkins con esa copia y ver si arranca con sus jobs y credenciales. Si además tienes <b>JCasC</b> (unidad 9), la mitad del trabajo ya está hecha: la configuración se aplica sola y solo hay que restaurar los datos.</p>`},
 {t:"vf", p:"Una copia de seguridad que nunca se ha probado a restaurar puede considerarse fiable.",
  ok:false, why:"Muchos equipos descubren que su copia estaba incompleta justo el día que la necesitan."},
 {t:"info", eti:"Mantener", h:"Actualizaciones y vigilancia",
  c:`<ul><li><b>Actualizar</b> Jenkins (LTS) y sus plugins con regularidad: muchos avisos de seguridad afectan a plugins.</li>
     <li><b>Probar antes</b> en un Jenkins de pruebas: una actualización puede romper un plugin del que dependen tus pipelines.</li>
     <li><b>Vigilar</b>: la cola de builds, los executors ocupados, la duración de los builds y el espacio en disco (hay un plugin que expone métricas para Prometheus).</li>
     <li><b>Rotar builds</b> con buildDiscarder para que el disco no se llene.</li></ul>`},
 {t:"par", p:"Empareja cada síntoma con su causa más probable",
  pares:[["La cola crece y los builds esperan mucho","Faltan executors o agentes"],["El disco del controlador se llena","Builds y artefactos antiguos sin rotar"],["Tras actualizar fallan varios pipelines","Un plugin incompatible con la versión nueva"],["Las credenciales restauradas no se descifran","Se copió credentials.xml sin secrets/"]],
  why:"Estos cuatro casos cubren la mayoría de incidencias de operación."}
]},

/* =============== U10 L4 =============== */
{
id:"jn10l4",
titulo:"Diagnosticar errores típicos",
claves:["Leer la consola desde el final hasta el primer error real","Reproducir el paso fuera de Jenkins, con la misma imagen y los mismos comandos","Replay permite probar un cambio del Jenkinsfile sin hacer commit"],
pasos:[
 {t:"info", eti:"Método", h:"Cómo se busca un fallo",
  c:`<ol><li>Abrir la <b>consola</b> del build y buscar el <b>primer</b> error (los siguientes suelen ser consecuencia).</li>
     <li>Preguntarse <b>qué cambió</b>: un commit, un plugin, la imagen del agente.</li>
     <li><b>Reproducirlo fuera</b> de Jenkins: ejecutar el mismo comando en el mismo contenedor.</li>
     <li>Probar el arreglo con <b>Replay</b> (Jenkins permite relanzar un build con un Jenkinsfile modificado, sin hacer commit) y, cuando funcione, subirlo.</li></ol>`},
 {t:"par", p:"Empareja cada mensaje de error con su causa habitual",
  pares:[["./mvnw: Permission denied","El fichero no tiene permiso de ejecución en el repositorio"],["docker: command not found","El agente no tiene Docker o no es el agente adecuado"],["No such DSL method 'withCredentials'","Falta el plugin de credenciales"],["Scripts not permitted to use method","Groovy bloqueado por el sandbox: requiere aprobación"],["expected:404 but was:500","Una prueba falla: el problema está en el código"]],
  why:"Casi todos los errores de Jenkins caen en una de estas categorías."},
 {t:"opcion", p:"El build falla con <code>./mvnw: Permission denied</code>. ¿Dónde está el problema?",
  ops:["En Jenkins, que necesita permisos de administrador","En el repositorio: el fichero mvnw no está marcado como ejecutable","En el agente, que no tiene Java","En GitHub"],
  ok:1, why:"Ocurre al subir el proyecto desde Windows, que no guarda el permiso de ejecución."},
 {t:"escribe", p:"Escribe el comando de Git que marca <code>mvnw</code> como ejecutable en el repositorio",
  sol:["git update-index --chmod=+x mvnw"], ph:"git update-index …", pista:"git update-index --chmod=+x y el nombre del fichero.", why:"Después hay que hacer commit y push del cambio."},
 {t:"opcion", p:"¿Para qué sirve la función Replay de un build?",
  ops:["Para repetir el build igual","Para relanzarlo con el Jenkinsfile modificado y probar un arreglo sin hacer commit","Para borrar el build","Para ver el vídeo del build"],
  ok:1, why:"Evita llenar el historial de Git con commits del tipo «probando pipeline»."},
 {t:"orden", p:"Ordena el método para diagnosticar un build roto",
  items:["Leer la consola y encontrar el primer error","Ver qué cambió: commit, plugin o agente","Reproducir el paso fuera de Jenkins","Probar el arreglo con Replay","Subir el arreglo al repositorio"],
  why:"Con este método se resuelve la mayoría de fallos sin dar palos de ciego."}
]}

]});
