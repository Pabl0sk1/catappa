window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Maestría: casos reales y entrevista",
resumen: "Resolver incidentes reales de principio a fin y las preguntas de entrevista de sistemas",
nivel: "Maestro",
color: "#a0620c",
lecciones: [

{
id:"lx12l1",
titulo:"Incidentes reales, paso a paso",
claves:["Siempre: medir, acotar, mitigar, corregir y documentar","Cada síntoma tiene un primer comando","Contar el razonamiento vale tanto como la solución"],
pasos:[
 {t:"info", eti:"Caso 1", h:"«La web va lentísima»",
  c:`<p>Recorrido de un experto, en voz alta:</p>
     <ol><li><code>uptime</code>: load de 14 en 4 núcleos. Hay saturación.</li>
     <li><code>vmstat 1</code>: <code>wa</code> al 60%. La CPU espera al disco.</li>
     <li><code>iostat -xz 1</code>: el disco de datos al 100%, await de 80 ms.</li>
     <li><code>iotop -o</code>: <code>pg_dump</code> leyendo sin parar. Alguien lanzó un backup a mediodía.</li>
     <li>Mitigar: bajar su prioridad de I/O (<code>ionice -c3 -p PID</code>) o pararlo.</li>
     <li>Corregir: programar backups de madrugada y desde una réplica. Documentarlo.</li></ol>`},
 {t:"orden", p:"Ordena el método general ante cualquier incidente",
  items:["Confirmar el síntoma y su impacto","Medir: qué recurso sufre (USE)","Acotar hasta encontrar el proceso o la causa","Mitigar para restaurar el servicio","Corregir la causa raíz","Documentar en un postmortem"],
  why:"Es el mismo método en Linux, en Docker y en Kubernetes."},
 {t:"opcion", p:"Caso 2: «No space left on device» en <code>/</code>. ¿Primeros comandos?",
  ops:["rm -rf /tmp/* directamente","df -h y df -i para ver si es espacio o inodos, y luego du -sh bajando por las carpetas","reboot","apt upgrade"],
  ok:1, why:"Primero saber qué se ha llenado. Culpables habituales: logs sin rotar, /var/lib/docker, backups viejos, ficheros borrados aún abiertos (lsof +L1)."},
 {t:"opcion", p:"Caso 3: la API Java muere cada pocas horas sin nada en su log. ¿Qué miras?",
  ops:["El código de la API","dmesg -T | grep -i killed y journalctl -k: casi seguro el OOM killer; luego la memoria del proceso y sus límites","El DNS","El cortafuegos"],
  ok:1, why:"Sin log propio = SIGKILL externo. El kernel deja constancia."},
 {t:"opcion", p:"Caso 4: «desde el servidor A no llego al B por el puerto 5432». ¿Cómo lo acotas?",
  ops:["Reinstalar Postgres","getent hosts B (DNS) → nc -zv B 5432 (refused o timeout) → en B, ss -tulpn (¿escucha y en qué IP?) → cortafuegos en B y en la red","Reiniciar ambos servidores","Abrir todos los puertos"],
  ok:1, why:"Nombre, conectividad, servicio escuchando, filtrado. Capa a capa."},
 {t:"par", p:"Empareja cada síntoma con su primer comando",
  pares:[["Servidor lento","uptime y vmstat 1"],["Disco lleno","df -h y df -i"],["Proceso desaparece","dmesg -T"],["No conecta a un puerto","nc -zv host puerto"],["No sé qué fichero busca un programa","strace -e trace=openat"]],
  why:"Tener este mapa en la cabeza es lo que distingue a alguien con experiencia de guardia."}
]},

{
id:"lx12l2",
titulo:"Simulacro de entrevista de Linux",
claves:["Has repasado las preguntas más frecuentes de sistemas","Sabes explicar el porqué, no solo el comando","Estás listo para una entrevista de backend, DevOps o SRE"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas, como en la entrevista",
  c:`<p>Contesta en voz alta antes de elegir. Si fallas, vuelve a la unidad correspondiente.</p>`},
 {t:"opcion", p:"«¿Qué diferencia hay entre un proceso y un hilo?»",
  ops:["Ninguna","Un proceso tiene su propio espacio de memoria; los hilos de un mismo proceso comparten memoria y recursos","Los hilos son más lentos","Los procesos solo existen en Windows"],
  ok:1, why:"Por eso un fallo de memoria en un hilo puede tumbar todo el proceso, y por eso la comunicación entre hilos es más barata que entre procesos."},
 {t:"opcion", p:"«¿Qué pasa cuando escribes <code>ls</code> y pulsas Enter?»",
  ops:["El kernel lista el directorio directamente","La shell busca ls en el PATH, hace fork para crear un hijo, este hace exec del binario, ls pide al kernel el contenido con llamadas al sistema, escribe en stdout y termina; la shell recoge su código de salida","Se abre una ventana nueva","Se ejecuta como root"],
  ok:1, why:"fork + exec + llamadas al sistema + wait: el ciclo de vida de cualquier comando."},
 {t:"opcion", p:"«¿Qué es un inodo?»",
  ops:["Un tipo de disco","La estructura que guarda los metadatos de un fichero (permisos, dueño, tamaño, bloques); el nombre está en el directorio que apunta a él","Un proceso del kernel","Un usuario del sistema"],
  ok:1, why:"Por eso un fichero puede tener varios nombres (enlaces duros) apuntando al mismo inodo."},
 {t:"opcion", p:"«¿Diferencia entre enlace duro y simbólico?»",
  ops:["Ninguna","El duro es otro nombre para el mismo inodo (no puede cruzar sistemas de ficheros ni apuntar a directorios); el simbólico es un fichero que contiene una ruta y se rompe si el destino desaparece","El simbólico ocupa más","El duro solo existe en Windows"],
  ok:1, why:"ln fichero enlace (duro), ln -s destino enlace (simbólico)."},
 {t:"opcion", p:"«¿Qué significa un load average de 8 en una máquina de 8 núcleos?»",
  ops:["Que está al 800%","Que en promedio hay 8 procesos ejecutándose o esperando: justo a plena capacidad","Que hay 8 usuarios","Que la memoria está al 8%"],
  ok:1, why:"Hay que compararlo siempre con el número de núcleos, y recordar que en Linux incluye procesos esperando disco (estado D)."},
 {t:"opcion", p:"«¿Qué harías si un disco está lleno y no encuentras qué lo ocupa con du?»",
  ops:["Formatearlo","Mirar ficheros borrados aún abiertos con lsof +L1, y los inodos con df -i","Reiniciar siempre","Ampliar el disco sin investigar"],
  ok:1, why:"du suma lo que ve en los directorios; un fichero borrado pero abierto no aparece y sigue ocupando."},
 {t:"opcion", p:"«¿Qué diferencia hay entre SIGTERM y SIGKILL?»",
  ops:["Ninguna","SIGTERM pide terminar y el proceso puede cerrar ordenadamente; SIGKILL lo mata el kernel sin darle opción","SIGKILL es más lento","SIGTERM solo lo puede enviar root"],
  ok:1, why:"Y enlázalo con docker stop y el apagado elegante: demuestra que conectas conceptos."},
 {t:"opcion", p:"«¿Cómo asegurarías un servidor recién creado?»",
  ops:["Con una contraseña de root larga","Parchear; usuario propio con sudo; SSH solo con claves y sin root; cortafuegos que deniegue por defecto; quitar servicios innecesarios; fail2ban; actualizaciones automáticas; logs enviados fuera","Instalando un antivirus","Cambiando el puerto de SSH"],
  ok:1, why:"Una lista ordenada y con motivos. Si además mencionas SELinux/AppArmor y mínimo privilegio en los servicios, nota alta."},
 {t:"info", eti:"Terminado", h:"Has completado Linux de cero a experto",
  c:`<p>Ya sabes moverte por el sistema, gestionar usuarios y permisos, dominar la shell y el texto, controlar procesos y servicios, escribir scripts robustos, manejar almacenamiento y arranque, diagnosticar redes y rendimiento, y endurecer un servidor.</p>
     <p>Siguiente paso natural: <b>Redes</b> para entender a fondo lo que viaja por el cable, y <b>Docker</b> y <b>Kubernetes</b>, que ahora vas a leer como lo que son: procesos de Linux muy bien organizados.</p>`}
]}

]});
