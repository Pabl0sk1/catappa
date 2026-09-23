window.CURSOS = window.CURSOS || {};
(CURSOS.docker = CURSOS.docker || []).push({
titulo: "Redes y almacenamiento a fondo",
resumen: "Drivers de red, publicar puertos con cabeza, volúmenes y copias de seguridad",
nivel: "Avanzado",
color: "#be185d",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"dk7l1",
titulo:"Las redes de Docker",
claves:["bridge es la red por defecto","La bridge por defecto NO tiene DNS; una red creada por ti, sí","host, none y overlay: cuándo se usan"],
pasos:[
 {t:"info", eti:"Los drivers", h:"Cuatro tipos de red, y solo usarás uno",
  c:`<ul><li><b>bridge</b> — red virtual privada dentro de tu máquina. <b>La de por defecto</b> y la que usarás siempre.</li>
     <li><b>host</b> — el contenedor usa directamente la red del anfitrión: sin aislamiento y sin <code>-p</code>. Para casos de rendimiento extremo o herramientas de red.</li>
     <li><b>none</b> — sin red. Para procesos que no deben comunicarse con nada.</li>
     <li><b>overlay</b> — conecta contenedores que están en <b>máquinas distintas</b>. Es la de Swarm y la idea detrás de las redes de Kubernetes.</li></ul>
     <p>Hay una quinta, <b>macvlan</b>, que da al contenedor una MAC propia en tu red física. Basta con saber que existe.</p>`},

 {t:"par", p:"Empareja cada driver con su uso",
  pares:[["bridge","Red privada en una máquina: la de por defecto"],
         ["host","Sin aislamiento de red, usa la del anfitrión"],
         ["none","Sin red"],
         ["overlay","Conecta contenedores de varias máquinas"]],
  why:"En una entrevista basta con nombrarlos y decir para qué sirve cada uno."},

 {t:"info", eti:"El matiz", h:"La bridge por defecto no tiene DNS",
  c:`<p>Detalle que diferencia a quien ha leído la documentación:</p>
     <ul><li>La red <b>bridge por defecto</b> (donde caen los contenedores si no dices nada) <b>no resuelve nombres</b>. Dos contenedores ahí solo se ven por IP.</li>
     <li>Una red bridge <b>creada por ti</b> (<code>docker network create mired</code>) <b>sí tiene DNS interno</b>: los contenedores se ven por nombre.</li></ul>
     <p>Y eso explica por qué Compose funciona tan bien: <b>crea automáticamente una red propia para cada proyecto</b>. Por eso puedes escribir <code>db:5432</code>.</p>`},

 {t:"opcion", p:"Arrancas dos contenedores sin especificar red y uno no encuentra al otro por su nombre. ¿Por qué?",
  ops:["Falta instalar un DNS",
       "Están en la bridge por defecto, que no resuelve nombres: hay que crear una red propia y conectarlos a ella",
       "Falta publicar puertos",
       "Los nombres deben ir en mayúsculas"],
  ok:1,
  why:"Solución: <code>docker network create mired</code> y arrancar ambos con <code>--network mired</code>. O, más fácil, usar Compose."},

 {t:"escribe", p:"Escribe el comando que crea una red llamada <code>lab</code>",
  sol:["docker network create lab","docker network create --driver bridge lab"],
  ph:"docker network ...",
  pista:"El sustantivo es network y el verbo, crear.",
  why:"<code>docker network create lab</code>. Por defecto usa el driver bridge, que es lo que quieres."},

 {t:"info", eti:"Ver qué hay", h:"Inspeccionar una red",
  c:`<div class="termbox">docker network ls                 <span class="cm"># listar redes</span>
docker network inspect lab        <span class="cm"># que contenedores hay y con que IP</span>
docker network connect lab web     <span class="cm"># conectar un contenedor ya creado</span>
docker network rm lab</div>
     <p><code>inspect</code> es el que usarás para depurar: te dice exactamente qué contenedores están en esa red. Si tu API no encuentra la base de datos, es lo primero que compruebas.</p>`},

 {t:"info", eti:"Segmentar", h:"La arquitectura que debes saber dibujar",
  c:`<div class="diag">  Internet
     |
 [ nginx ]  ---- red "frontend"
     |
 [  api  ]  ---- en AMBAS redes
     |
 [  db   ]  ---- red "backend" (internal: true)</div>
     <div class="termbox">networks:
  frontend:
  backend:
    <b>internal: true</b>      <span class="cm"># sin salida a internet ni entrada desde fuera</span></div>
     <p>Resultado: nginx <b>no puede</b> hablar con la base de datos aunque quisiera, porque no comparten red. Y la base de datos no tiene salida a internet.</p>
     <p>Eso se llama <b>segmentación de red</b>, y es un argumento de seguridad muy valorado.</p>`},

 {t:"opcion", p:"¿Qué consigues con <code>internal: true</code> en una red?",
  ops:["Que sea más rápida",
       "Que los contenedores de esa red no tengan acceso a internet ni sean accesibles desde fuera",
       "Que solo funcione en Linux",
       "Que se cifre el tráfico"],
  ok:1,
  why:"Aislamiento real para la base de datos. Solo los contenedores que estén también en otra red pueden hacer de puente."},

 {t:"vf", p:"Dos contenedores en redes distintas pueden comunicarse entre sí.",
  ok:false,
  why:"No, salvo que uno de ellos esté conectado a ambas redes. Eso es justo lo que hace la API en el diagrama."}
]},

/* =============== U7 L2 =============== */
{
id:"dk7l2",
titulo:"Publicar puertos con cabeza",
claves:["-p 127.0.0.1:8080:80 solo expone a tu máquina","Publicar solo lo imprescindible","EXPOSE documenta, ports publica"],
pasos:[
 {t:"info", eti:"Repaso y ampliación", h:"Las variantes de -p",
  c:`<div class="termbox">-p 8080:80                 <span class="cm"># accesible desde CUALQUIER sitio que llegue a tu maquina</span>
-p <b>127.0.0.1</b>:8080:80       <span class="cm"># accesible SOLO desde la propia maquina</span>
-p 80                      <span class="cm"># puerto aleatorio del host -> 80 del contenedor</span>
-P                         <span class="cm"># publica todos los EXPOSE en puertos aleatorios</span></div>
     <p>La segunda forma es importante en servidores: publicas el servicio solo en local y lo expones al mundo a través de nginx o de un túnel SSH.</p>`},

 {t:"opcion", p:"Tienes un panel de administración que solo debe verse desde el propio servidor. ¿Cómo lo publicas?",
  ops:["-p 8081:8080","-p 127.0.0.1:8081:8080","-P","No publicarlo y usar docker exec"],
  ok:1,
  why:"Atado a 127.0.0.1: nadie de fuera llega, pero tú puedes entrar por un túnel SSH. Responder esto demuestra criterio de seguridad."},

 {t:"info", eti:"Aviso serio", h:"Docker se salta tu cortafuegos",
  c:`<p>Algo que sorprende a mucha gente: Docker escribe sus propias reglas en el cortafuegos del sistema (iptables), y <b>puede pasar por encima de UFW</b> en un servidor Linux.</p>
     <p>Es decir: crees que tienes el puerto 5432 cerrado con UFW, publicas la base de datos con <code>-p 5432:5432</code> y <b>queda accesible desde internet</b>.</p>
     <div class="nota ojo"><b class="tit">Norma</b>Publica solo lo imprescindible. La base de datos <b>nunca</b> lleva <code>ports:</code>. Y si necesitas acceder a ella desde tu máquina, haz un túnel SSH en vez de abrirla.</div>`},

 {t:"vf", p:"Si tienes UFW activado en el servidor, publicar un puerto con Docker es seguro porque el cortafuegos lo bloqueará.",
  ok:false,
  why:"Falso, y es un fallo de seguridad muy común en servidores reales. Docker manipula iptables por su cuenta."},

 {t:"opcion", p:"Repaso: ¿qué diferencia hay entre <code>EXPOSE 8080</code> en el Dockerfile y <code>-p 8080:8080</code>?",
  ops:["Son lo mismo",
       "EXPOSE solo documenta que la app escucha ahí; -p es lo que realmente abre el puerto en tu máquina",
       "EXPOSE es para producción y -p para desarrollo",
       "EXPOSE abre el puerto y -p lo cierra"],
  ok:1,
  why:"Pregunta trampa clásica y ya la tienes dominada."},

 {t:"info", eti:"Desde dentro hacia fuera", h:"Llegar a tu propia máquina desde un contenedor",
  c:`<p>Caso real: tu contenedor necesita hablar con algo que corre en tu Windows (por ejemplo, una base de datos instalada de forma nativa).</p>
     <p>Dentro del contenedor, <code>localhost</code> es el contenedor. Para referirse al anfitrión hay un nombre especial:</p>
     <div class="termbox">host.docker.internal</div>
     <p>Funciona en Docker Desktop (Windows y Mac). En Linux hay que añadir <code>--add-host=host.docker.internal:host-gateway</code>.</p>`},

 {t:"escribe", p:"Escribe el comando que muestra qué puertos tiene publicados el contenedor <code>web</code>",
  sol:["docker port web"],
  ph:"docker ...",
  pista:"Un solo sustantivo, en singular.",
  why:"<code>docker port web</code>. Útil cuando publicaste en puerto aleatorio y no sabes cuál te tocó."}
]},

/* =============== U7 L3 =============== */
{
id:"dk7l3",
titulo:"Volúmenes a fondo",
claves:["Named volume: Docker gestiona la ruta, portable","Bind mount: tu carpeta, ideal en desarrollo","tmpfs: en memoria, no persiste"],
pasos:[
 {t:"info", eti:"Los tres tipos", h:"Cuándo usar cada uno",
  c:`<div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:14px">
     <tr><th style="text-align:left;padding:6px 8px">Tipo</th><th style="text-align:left;padding:6px 8px">Sintaxis</th><th style="text-align:left;padding:6px 8px">Para qué</th></tr>
     <tr><td style="padding:6px 8px"><b>Named volume</b></td><td style="padding:6px 8px"><code>-v pgdata:/var/lib/...</code></td><td style="padding:6px 8px">Datos de producción: bases de datos, ficheros subidos</td></tr>
     <tr><td style="padding:6px 8px"><b>Bind mount</b></td><td style="padding:6px 8px"><code>-v ./conf:/etc/nginx:ro</code></td><td style="padding:6px 8px">Configuración y desarrollo (editas y el contenedor lo ve)</td></tr>
     <tr><td style="padding:6px 8px"><b>tmpfs</b></td><td style="padding:6px 8px"><code>--tmpfs /tmp</code></td><td style="padding:6px 8px">Datos temporales o sensibles: viven en RAM</td></tr>
     </table></div>
     <p>La diferencia práctica entre los dos primeros: en el volumen <b>Docker decide dónde guardarlo</b> (dentro de su propio almacén) y en el bind mount <b>lo decides tú</b> (una carpeta concreta de tu disco).</p>`},

 {t:"opcion", p:"¿Por qué un named volume es mejor que un bind mount para los datos de PostgreSQL?",
  ops:["Porque es más rápido de escribir",
       "Porque lo gestiona Docker: es portable entre máquinas, evita problemas de permisos y de rendimiento (sobre todo en Windows y Mac) y se respalda con herramientas de Docker",
       "Porque ocupa menos",
       "Porque se cifra"],
  ok:1,
  why:"En Windows, un bind mount para una base de datos da problemas de rendimiento y de permisos. Named volume siempre para datos."},

 {t:"opcion", p:"¿Y para el <code>nginx.conf</code> que quieres editar con tu editor?",
  ops:["Named volume","Bind mount en solo lectura","tmpfs","Copiarlo dentro de la imagen siempre"],
  ok:1,
  why:"Bind mount con <code>:ro</code>: lo editas en tu máquina, reinicias nginx y ya. Para producción también es válido montar la configuración así."},

 {t:"info", eti:"Comandos", h:"Gestionar volúmenes",
  c:`<div class="termbox">docker volume ls                  <span class="cm"># listar</span>
docker volume create datos        <span class="cm"># crear</span>
docker volume inspect datos       <span class="cm"># ver donde vive de verdad</span>
docker volume rm datos            <span class="cm"># borrar</span>
docker system df -v               <span class="cm"># cuanto ocupa cada uno</span></div>
     <p><code>inspect</code> te da el <b>Mountpoint</b>: la ruta real en el disco del anfitrión. En Windows está dentro de la VM de WSL, así que no la verás desde el Explorador.</p>`},

 {t:"info", eti:"Desarrollo", h:"El bind mount que te ahorra reconstruir",
  c:`<p>En desarrollo no quieres reconstruir la imagen en cada cambio. Se monta el código:</p>
     <div class="termbox">services:
  api:
    volumes:
      - ./src:/app/src        <span class="cm"># editas en tu editor, el contenedor lo ve al instante</span></div>
     <p>Con lenguajes interpretados (Node, Python) el efecto es inmediato. Con Java hace falta además recompilar, así que ahí se usa con devtools o se acepta reconstruir.</p>
     <div class="nota ojo"><b class="tit">Nunca en producción</b>Montar código fuente en producción rompe la idea de artefacto inmutable: lo que corre ya no es lo que había en la imagen que probaste.</div>`},

 {t:"vf", p:"Montar el código fuente con un bind mount es buena práctica en producción.",
  ok:false,
  why:"No. En desarrollo sí; en producción, la imagen debe ser autosuficiente e inmutable."},

 {t:"hueco", p:"Completa: monta el volumen <code>pgdata</code> en la carpeta de datos de Postgres",
  tpl:"volumes:\n  - ___:___",
  banco:["pgdata","/var/lib/postgresql/data","./datos","/etc/postgresql"],
  sol:["pgdata","/var/lib/postgresql/data"],
  why:"Nombre del volumen : ruta dentro del contenedor. Siempre en ese orden."}
]},

/* =============== U7 L4 =============== */
{
id:"dk7l4",
titulo:"Copias de seguridad y limpieza",
claves:["Backup de volumen: contenedor efímero + tar","Para bases de datos, mejor un dump lógico (pg_dump)","prune libera espacio, pero -v y --volumes borran datos"],
pasos:[
 {t:"info", eti:"El problema", h:"¿Cómo se respalda un volumen?",
  c:`<p>Un volumen vive dentro del almacén de Docker, así que no puedes copiarlo con el Explorador de Windows. La técnica estándar es <b>montar el volumen en un contenedor temporal</b> y comprimirlo desde ahí:</p>
     <div class="termbox">docker run --rm \\
  -v pgdata:/datos \\
  -v "\${PWD}:/backup" \\
  alpine tar czf /backup/pgdata-backup.tar.gz -C /datos .</div>
     <p>Léelo: arranca un alpine de usar y tirar, que monta el volumen en <code>/datos</code> y tu carpeta actual en <code>/backup</code>, y comprime uno dentro del otro.</p>`},

 {t:"opcion", p:"¿Por qué se usa un contenedor temporal para hacer el backup del volumen?",
  ops:["Porque es más rápido",
       "Porque el volumen solo es accesible montándolo en un contenedor; desde el anfitrión no está a mano (en Windows vive dentro de WSL)",
       "Porque Docker lo obliga",
       "Porque así se cifra"],
  ok:1,
  why:"Es el patrón estándar y queda muy bien explicarlo en una entrevista de DevOps."},

 {t:"info", eti:"Mejor aún", h:"Para bases de datos, dump lógico",
  c:`<p>Copiar los ficheros de una base de datos mientras está escribiendo puede dar una copia inconsistente. Lo correcto es pedirle a la propia base de datos que se exporte:</p>
     <div class="termbox">docker compose exec db pg_dump -U tareas_user tareas > backup.sql</div>
     <p>Y para restaurar:</p>
     <div class="termbox">cat backup.sql | docker compose exec -T db psql -U tareas_user tareas</div>
     <div class="nota dato"><b class="tit">Respuesta completa</b>«Para volúmenes genéricos, tar desde un contenedor efímero. Para bases de datos, dump lógico con pg_dump programado, y la copia se guarda fuera del servidor.»</div>`},

 {t:"opcion", p:"¿Cuál es el riesgo de copiar los ficheros de la base de datos en caliente?",
  ops:["Ninguno",
       "Que la copia quede inconsistente si la base de datos estaba escribiendo en ese momento",
       "Que se borren los datos",
       "Que tarde más"],
  ok:1,
  why:"Por eso el dump lógico es preferible: la base de datos exporta un estado coherente."},

 {t:"info", eti:"Limpieza", h:"Los prune, de menos a más peligroso",
  c:`<div class="termbox">docker system df            <span class="cm"># PRIMERO: mirar que ocupa</span>
docker container prune      <span class="cm"># borra contenedores parados</span>
docker image prune          <span class="cm"># borra imagenes huerfanas (sin tag)</span>
docker image prune -a       <span class="cm"># borra toda imagen sin contenedor asociado</span>
docker builder prune        <span class="cm"># cache de construccion (suele ser la mas gorda)</span>
docker volume prune         <span class="cm"># CUIDADO: volumenes sin usar = DATOS</span>
docker system prune -a --volumes   <span class="cm"># LA BOMBA: todo lo anterior junto</span></div>
     <div class="nota ojo"><b class="tit">En tu máquina, ojo</b>Tienes contenedores y volúmenes parados de otros proyectos tuyos. Un <code>system prune -a --volumes</code> te borraría sus datos. Limpia por nombre o por proyecto, no en bloque.</div>`},

 {t:"opcion", p:"Se llena el disco del servidor. ¿Cuál es el primer comando?",
  ops:["docker system prune -a --volumes",
       "docker system df, para ver primero qué ocupa cada cosa",
       "Borrar /var/lib/docker a mano",
       "Reiniciar el servidor"],
  ok:1,
  why:"Medir antes de borrar. Casi siempre el culpable es la caché de build, que se limpia sin riesgo con <code>docker builder prune</code>."},

 {t:"par", p:"Empareja cada comando de limpieza con lo que borra",
  pares:[["docker container prune","Contenedores parados"],
         ["docker image prune -a","Imágenes sin contenedor asociado"],
         ["docker builder prune","La caché de construcción"],
         ["docker volume prune","Volúmenes sin usar (¡datos!)"]],
  why:"Saber cuál es seguro y cuál no te evita un incidente."},

 {t:"vf", p:"<code>docker builder prune</code> puede borrar datos de tus aplicaciones.",
  ok:false,
  why:"No: solo borra la caché de construcción. Lo peor que pasa es que el siguiente build tarde más. Es el prune más seguro."}
]}

]});
