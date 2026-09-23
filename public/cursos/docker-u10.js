window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Maestría: la entrevista de Docker",
resumen: "Las preguntas que más se repiten, por bloques: conceptos, comandos, Dockerfile, Compose y producción, más el simulacro final y cómo contarlo",
nivel: "Maestro",
color: "#154a94",
lecciones: [

/* =============== U10 L1 =============== */
{
id:"dk10l1",
titulo:"Conceptos: las preguntas de siempre",
claves:["Contenedor: proceso aislado que comparte el núcleo del anfitrión; no es una máquina virtual","Imagen: plantilla inmutable por capas; contenedor: esa imagen en ejecución","Docker resuelve reproducibilidad y aislamiento, no velocidad de ejecución"],
pasos:[
 {t:"info", eti:"Cómo usar esta unidad", h:"Responde en voz alta",
  c:`<p>Estas lecciones son un repaso en formato entrevista. Lee la pregunta, <b>di tu respuesta en voz alta</b> y solo entonces elige la opción. Si dudas, vuelve a la unidad correspondiente: todo esto ya lo has visto.</p>`},
 {t:"opcion", p:"«¿Qué es un contenedor?»",
  ops:["Una máquina virtual ligera","Un proceso del sistema anfitrión aislado con namespaces y limitado con cgroups, que comparte el núcleo","Un programa que emula hardware","Una carpeta comprimida"],
  ok:1, why:"Mencionar namespaces (lo que ve) y cgroups (lo que consume) es lo que distingue una buena respuesta."},
 {t:"opcion", p:"«¿En qué se diferencia de una máquina virtual?»",
  ops:["En nada","La máquina virtual lleva su propio sistema operativo completo sobre un hipervisor; el contenedor comparte el núcleo del anfitrión, así que arranca en segundos y ocupa mucho menos","El contenedor es más seguro siempre","La máquina virtual no necesita disco"],
  ok:1, why:"Y añade el matiz: la máquina virtual aísla más, porque no comparte núcleo."},
 {t:"opcion", p:"«Imagen y contenedor, ¿cuál es la diferencia?»",
  ops:["Son sinónimos","La imagen es la plantilla inmutable formada por capas; el contenedor es una instancia en ejecución de esa imagen, con una capa de escritura propia","La imagen se ejecuta y el contenedor se guarda","El contenedor se construye con docker build"],
  ok:1, why:"La comparación con «clase y objeto» ayuda si el entrevistador es programador."},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Registry","El almacén de imágenes, como Docker Hub"],["Capa","Cada paso del Dockerfile, reutilizable y cacheable"],["Volumen","Almacenamiento gestionado por Docker que sobrevive al contenedor"],["Namespace","Lo que un proceso ve: red, procesos, ficheros"],["cgroup","Lo que un proceso puede consumir: CPU y memoria"]],
  why:"Vocabulario básico: si lo usas bien, se nota."},
 {t:"opcion", p:"«¿Docker hace que mi aplicación vaya más rápido?»",
  ops:["Sí, mucho","No: resuelve reproducibilidad, aislamiento y despliegue; el rendimiento es prácticamente el del proceso nativo","Sí, porque comprime el código","Solo en Linux"],
  ok:1, why:"Decir que «va más rápido» es un error típico; la ventaja es otra."}
]},

/* =============== U10 L2 =============== */
{
id:"dk10l2",
titulo:"Comandos y Dockerfile: preguntas rápidas",
claves:["run crea y arranca; start rearranca uno parado; exec entra en uno en marcha","CMD se puede sobrescribir al arrancar; ENTRYPOINT define el ejecutable","Multi-stage separa compilar de ejecutar y reduce muchísimo el tamaño"],
pasos:[
 {t:"opcion", p:"«¿Diferencia entre <code>docker run</code> y <code>docker start</code>?»",
  ops:["Ninguna","run crea un contenedor nuevo a partir de una imagen; start vuelve a arrancar uno que ya existe y estaba parado","run es para imágenes y start para volúmenes","start crea el contenedor"],
  ok:1, why:"De ahí viene el clásico «tengo 40 contenedores parados»: cada run crea uno nuevo."},
 {t:"par", p:"Empareja cada comando con lo que hace",
  pares:[["docker ps -a","Lista todos los contenedores, también los parados"],["docker logs -f","Muestra la salida y se queda siguiéndola"],["docker exec -it","Ejecuta un comando dentro de uno en marcha"],["docker inspect","Muestra toda la configuración real en JSON"],["docker build -t","Construye una imagen y le pone nombre y etiqueta"],["docker system df","Muestra cuánto espacio ocupa Docker"]],
  why:"Son los que más se usan en el día a día y en las pruebas prácticas."},
 {t:"opcion", p:"«¿CMD o ENTRYPOINT?»",
  ops:["Son iguales","ENTRYPOINT fija el ejecutable y CMD da los argumentos por defecto (y es lo que se sobrescribe al lanzar el contenedor)","CMD solo vale para Windows","ENTRYPOINT no existe ya"],
  ok:1, why:"Y ambos en forma exec, con corchetes, para que el proceso sea PID 1 y reciba las señales."},
 {t:"opcion", p:"«¿Por qué usar multi-stage?»",
  ops:["Por estética","Para compilar en una imagen con las herramientas y copiar a la imagen final solo el resultado: la final es mucho más pequeña y sin compilador","Para poder usar varios FROM por gusto","Para acelerar la ejecución"],
  ok:1, why:"El ejemplo del curso: de 949 MB a 372 MB, y sin Maven ni el JDK en producción."},
 {t:"opcion", p:"«¿Cómo reduces el tamaño de una imagen?»",
  ops:["Comprimiéndola con zip","Imagen base pequeña (alpine o jre en vez de jdk), multi-stage, .dockerignore, menos capas y borrar cachés en el mismo RUN","Borrando los logs","Usando latest"],
  ok:1, why:"Enumerar tres o cuatro técnicas concretas demuestra práctica."},
 {t:"vf", p:"Cada instrucción RUN, COPY o ADD crea una capa nueva en la imagen.",
  ok:true, why:"Por eso el orden importa: lo que menos cambia, primero."}
]},

/* =============== U10 L3 =============== */
{
id:"dk10l3",
titulo:"Compose, redes, volúmenes y producción",
claves:["Compose describe varios servicios en un fichero y los levanta con un comando","Los servicios se hablan por su nombre dentro de la red del proyecto","En producción: imágenes fijadas, healthchecks, límites, logs rotados y nada de secretos en la imagen"],
pasos:[
 {t:"opcion", p:"«¿Para qué sirve Docker Compose?»",
  ops:["Para construir imágenes más rápido","Para describir en un fichero varios servicios (API, base de datos, proxy) con sus redes y volúmenes, y levantarlos juntos con docker compose up","Para sustituir a Kubernetes en producción a gran escala","Para publicar imágenes"],
  ok:1, why:"Añade que es ideal en desarrollo y en servidores pequeños."},
 {t:"opcion", p:"«¿Cómo se comunican dos contenedores del mismo compose?»",
  ops:["Por localhost","Por el nombre del servicio, que Docker resuelve dentro de la red del proyecto","Por su IP fija","Por un volumen compartido"],
  ok:1, why:"Y recuerda: dentro de un contenedor, localhost es ese mismo contenedor."},
 {t:"par", p:"Empareja cada necesidad con la solución",
  pares:[["Que los datos sobrevivan al contenedor","Volumen con nombre"],["Editar código y verlo al momento en desarrollo","Bind mount de la carpeta del proyecto"],["Esperar a que la base de datos acepte conexiones","healthcheck más depends_on con condition"],["Que no se llenen los discos de logs","Opciones de logging con max-size y max-file"],["Configurar la app por entorno","Variables de entorno y fichero .env"]],
  why:"Cada una es una pregunta de entrevista por sí sola."},
 {t:"opcion", p:"«¿Qué cambia entre tu compose de desarrollo y el de producción?»",
  ops:["Nada","En producción: imagen fijada en vez de build, sin bind mounts de código, variables y secretos desde el entorno, restart: unless-stopped, healthchecks, límites de recursos y rotación de logs","Solo el puerto","En producción no se usa Compose nunca"],
  ok:1, why:"Mencionar restart y healthchecks demuestra que has operado algo de verdad."},
 {t:"opcion", p:"«¿Cómo gestionas los secretos?»",
  ops:["En el Dockerfile con ENV","Fuera de la imagen: variables de entorno inyectadas en el despliegue, ficheros .env fuera del repositorio o un gestor de secretos; nunca dentro de la imagen ni en el código","En el código, cifrados","En el nombre de la imagen"],
  ok:1, why:"Un ENV con una contraseña queda en la imagen y lo ve cualquiera con docker history."},
 {t:"par", p:"Empareja cada práctica de seguridad con su motivo",
  pares:[["Usuario sin privilegios (USER)","Que un fallo no dé root dentro del contenedor"],["Imagen base pequeña y fijada","Menos superficie de ataque y builds reproducibles"],["Escanear imágenes","Detectar vulnerabilidades conocidas"],["No montar el socket de Docker","Montarlo equivale a dar root del anfitrión"],["Actualizar imágenes base","Recibir los parches de seguridad"]],
  why:"Esta lista es la que se espera que recites si te preguntan por seguridad."}
]},

/* =============== U10 L4 =============== */
{
id:"dk10l4",
titulo:"Simulacro final y cómo contarlo",
claves:["Estructura para responder: qué es, para qué sirve, un ejemplo tuyo y un matiz","Si no sabes algo: dilo, explica cómo lo averiguarías y no te lo inventes","Cuenta lo que has practicado: levantar un stack, reducir una imagen, depurar un contenedor"],
pasos:[
 {t:"info", eti:"Cómo responder", h:"Una estructura que funciona",
  c:`<p>Para cualquier pregunta técnica:</p>
     <ol><li><b>Qué es</b>, en una frase.</li>
     <li><b>Para qué sirve</b> o qué problema resuelve.</li>
     <li><b>Un ejemplo tuyo</b>: «en mi proyecto de prácticas levanté una API Spring Boot con PostgreSQL usando Compose…».</li>
     <li><b>Un matiz</b> que demuestre criterio: «…aunque en producción usaría imágenes fijadas y healthchecks».</li></ol>`},
 {t:"orden", p:"Ordena la estructura de una buena respuesta",
  items:["Decir qué es en una frase","Explicar qué problema resuelve","Poner un ejemplo propio","Añadir un matiz o una limitación"],
  why:"Responder solo con la definición suena a memorizado; el ejemplo es lo que convence."},
 {t:"opcion", p:"Te preguntan algo que no sabes. ¿Qué haces?",
  ops:["Inventarte una respuesta","Decir que no lo has usado, explicar cómo lo averiguarías y enlazarlo con algo parecido que sí conoces","Cambiar de tema","Quedarte callado"],
  ok:1, why:"Reconocerlo con naturalidad suma; inventar se nota enseguida y resta mucho."},
 {t:"opcion", p:"«Cuéntame algo que hayas hecho con Docker.»",
  ops:["He leído documentación","He levantado una API Spring Boot con PostgreSQL y Adminer con Compose, he reducido su imagen con multi-stage de 949 MB a 372 MB y he depurado contenedores que se paraban al arrancar leyendo los logs","He instalado Docker Desktop","Nada todavía"],
  ok:1, why:"Concreto, con números y con un problema resuelto: es lo que se recuerda."},
 {t:"par", p:"Empareja cada pregunta final con la idea clave",
  pares:[["¿Qué problema resuelve Docker?","Reproducibilidad y aislamiento"],["¿Cómo depuras un contenedor?","ps -a, logs, exec o inspect"],["¿Cómo persisten los datos?","Volúmenes"],["¿Cómo llega la imagen al servidor?","Registry, y en el servidor se descarga y se levanta"],["¿Qué falta para producción?","Healthchecks, límites, logs rotados, secretos fuera y copias"]],
  why:"Si puedes desarrollar estas cinco, tienes cubierta la entrevista de Docker."},
 {t:"info", eti:"Terminado", h:"Has completado el curso de Docker",
  c:`<p>Has recorrido el curso entero: qué es un contenedor de verdad, los comandos del día a día, el Linux de dentro, construir imágenes con Dockerfile, YAML, Compose, redes y volúmenes, despliegue en un servidor con nginx y CI/CD, depuración de los fallos más habituales y la entrevista.</p>
     <p><b>Para consolidarlo</b>: coge un proyecto tuyo, escríbele un Dockerfile multi-stage, levántalo junto a una base de datos con Compose, rómpelo a propósito (quita el volumen, cambia el puerto, apunta a localhost) y arréglalo usando el método de la unidad 9.</p>`}
]}

]});
