window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Ficheros y texto",
resumen: "Crear, copiar, mover y borrar; leer ficheros; comodines; editar con nano y vim",
nivel: "Fundamentos",
color: "#f5b642",
lecciones: [

{
id:"lx3l1",
titulo:"Crear ficheros y directorios",
claves:["touch crea ficheros vacíos (o actualiza su fecha)","mkdir crea directorios; -p crea también los intermedios","Evita espacios en los nombres o pon comillas"],
pasos:[
 {t:"info", eti:"Crear", h:"touch y mkdir",
  c:`<div class="termbox">touch notas.txt             <span class="cm"># crea un fichero vacio (si existe, solo cambia su fecha)</span>
mkdir proyectos             <span class="cm"># crea un directorio</span>
mkdir -p api/src/main/java  <span class="cm"># crea toda la cadena de directorios de una vez</span>
mkdir a b c                 <span class="cm"># varios a la vez</span></div>
     <p>Sin <code>-p</code>, <code>mkdir api/src/main</code> falla si <code>api/src</code> no existe todavía.</p>`},
 {t:"term", p:"Crea de una sola vez la estructura <code>app/config/prod</code>", prompt:"pablo@servidor:~$",
  sol:["mkdir -p app/config/prod","mkdir -p app/config/prod/"], pista:"mkdir con la opción de crear los padres.",
  salida:``, why:"Con -p no importa que app o config no existan: los crea todos. Y si ya existen, no da error."},
 {t:"info", eti:"Nombres", h:"Espacios y caracteres raros",
  c:`<p>Linux admite casi cualquier carácter en un nombre, pero los espacios dan guerra porque la shell separa los argumentos por espacios:</p>
     <div class="termbox">mkdir mis documentos     <span class="cm"># crea DOS carpetas: "mis" y "documentos"</span>
mkdir "mis documentos"   <span class="cm"># crea una: "mis documentos"</span>
mkdir mis\\ documentos    <span class="cm"># lo mismo, escapando el espacio</span></div>
     <p>Costumbre profesional: nombres en minúsculas, con guiones o guiones bajos: <code>mis-documentos</code>.</p>`},
 {t:"opcion", p:"¿Qué crea <code>mkdir informe final</code>?",
  ops:["Una carpeta llamada «informe final»","Dos carpetas: «informe» y «final»","Da un error","Una carpeta «informe» con otra «final» dentro"],
  ok:1, why:"El espacio separa argumentos. Para un nombre con espacio, comillas."},
 {t:"vf", p:"<code>touch</code> sobre un fichero que ya existe borra su contenido.",
  ok:false, why:"Solo actualiza la fecha de modificación. Para vaciarlo se usa > fichero o truncate -s 0 fichero."},
 {t:"escribe", p:"Crea un fichero vacío llamado <code>README.md</code>",
  sol:["touch readme.md"], ph:"...", pista:"El comando que «toca» un fichero.", why:"touch README.md."}
]},

{
id:"lx3l2",
titulo:"Copiar, mover y renombrar",
claves:["cp copia; -r para directorios; -a conserva permisos y fechas","mv mueve y también renombra","-i pregunta antes de sobrescribir"],
pasos:[
 {t:"info", eti:"Copiar", h:"cp",
  c:`<div class="termbox">cp origen.txt copia.txt           <span class="cm"># copiar un fichero</span>
cp nginx.conf /tmp/                 <span class="cm"># copiar a otra carpeta con el mismo nombre</span>
cp -r proyecto/ proyecto-backup/    <span class="cm"># copiar un DIRECTORIO entero (recursivo)</span>
cp -a /etc/nginx /root/nginx.bak    <span class="cm"># archivo: conserva permisos, dueno y fechas</span>
cp -i a.txt b.txt                   <span class="cm"># pregunta si b.txt ya existe</span></div>
     <p>Sin <code>-r</code>, <code>cp</code> se niega a copiar directorios: «omitting directory».</p>`},
 {t:"opcion", p:"Antes de tocar la configuración, quieres una copia exacta de <code>/etc/nginx</code> conservando permisos y fechas. ¿Qué usas?",
  ops:["cp /etc/nginx /root/nginx.bak","cp -a /etc/nginx /root/nginx.bak","mv /etc/nginx /root/nginx.bak","cp -i /etc/nginx /root/nginx.bak"],
  ok:1, why:"-a (archive) implica recursivo y conserva todos los atributos. mv la movería, dejando a nginx sin configuración."},
 {t:"info", eti:"Mover y renombrar", h:"mv hace las dos cosas",
  c:`<div class="termbox">mv informe.txt informe-2026.txt    <span class="cm"># renombrar</span>
mv informe-2026.txt ~/documentos/  <span class="cm"># mover</span>
mv *.log /var/tmp/                 <span class="cm"># mover varios</span>
mv -i a b                          <span class="cm"># preguntar antes de sobrescribir</span>
mv -n a b                          <span class="cm"># no sobrescribir nunca</span></div>
     <p>En Linux no existe un comando «rename» para lo básico: renombrar es mover a un nombre nuevo.</p>`},
 {t:"term", p:"Renombra <code>app.jar</code> a <code>app-1.0.0.jar</code>", prompt:"pablo@servidor:/opt/api$",
  sol:["mv app.jar app-1.0.0.jar"], pista:"mv, nombre actual, nombre nuevo.",
  salida:``, why:"Renombrar dentro del mismo sistema de ficheros es instantáneo aunque el fichero pese gigas: solo cambia su entrada en el directorio."},
 {t:"vf", p:"<code>mv</code> sobrescribe sin avisar si el destino ya existe.",
  ok:true, why:"Por defecto sí. Por eso muchas distribuciones configuran alias como mv -i para el usuario root."},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["cp -r","Copiar directorios recursivamente"],["cp -a","Copia exacta conservando atributos"],["mv -i","Preguntar antes de sobrescribir"],["mv -n","No sobrescribir nunca"]],
  why:"-a es la opción que usan los scripts de backup."}
]},

{
id:"lx3l3",
titulo:"Borrar con cabeza",
claves:["rm borra ficheros sin papelera","rm -r borra directorios; -f fuerza sin preguntar","rmdir solo borra directorios vacíos"],
pasos:[
 {t:"info", eti:"Sin papelera", h:"Lo que borras, se va",
  c:`<p>En la terminal <b>no hay papelera</b>. <code>rm</code> elimina el fichero en el acto.</p>
     <div class="termbox">rm fichero.txt           <span class="cm"># borrar un fichero</span>
rm -i *.tmp              <span class="cm"># preguntar uno a uno</span>
rmdir carpeta-vacia      <span class="cm"># borrar un directorio VACIO</span>
rm -r carpeta            <span class="cm"># borrar un directorio y todo su contenido</span>
rm -rf carpeta           <span class="cm"># igual, sin preguntar nunca (peligroso)</span></div>`},
 {t:"opcion", p:"¿Qué diferencia hay entre <code>rmdir carpeta</code> y <code>rm -r carpeta</code>?",
  ops:["Ninguna","rmdir solo borra si la carpeta está vacía; rm -r borra la carpeta y todo lo que contiene","rm -r solo borra los ficheros, no la carpeta","rmdir es más rápido"],
  ok:1, why:"rmdir es la opción segura: si la carpeta tiene algo, se niega."},
 {t:"info", eti:"El comando que da miedo", h:"rm -rf y cómo no romper nada",
  c:`<p>Las reglas que siguen los administradores con experiencia:</p>
     <ul><li><b>Mira antes de borrar</b>: ejecuta primero <code>ls</code> con el mismo patrón. Si <code>ls *.log</code> muestra lo que esperas, entonces <code>rm *.log</code>.</li>
     <li><b>Comprueba dónde estás</b> con <code>pwd</code>.</li>
     <li><b>Cuidado con las variables vacías</b> en scripts: <code>rm -rf "$DIR"/</code> con <code>DIR</code> vacía se convierte en <code>rm -rf /</code>.</li>
     <li><b>Nunca</b> un espacio de más: <code>rm -rf /tmp/ app</code> borra /tmp entero <b>y</b> «app».</li></ul>`},
 {t:"opcion", p:"Quieres borrar <code>/tmp/app</code> pero escribes <code>rm -rf /tmp/ app</code>. ¿Qué pasa?",
  ops:["Borra /tmp/app","Borra todo /tmp y además un «app» del directorio actual","Da un error de sintaxis","No borra nada"],
  ok:1, why:"El espacio convierte una ruta en dos argumentos. Un espacio de más con -rf puede ser un desastre."},
 {t:"vf", p:"Los ficheros borrados con <code>rm</code> se pueden recuperar fácilmente desde la papelera.",
  ok:false, why:"No hay papelera. Solo quedan los backups, y a veces herramientas forenses que no garantizan nada. Por eso importan las copias de seguridad."},
 {t:"orden", p:"Ordena la forma segura de borrar todos los <code>.log</code> antiguos de una carpeta",
  items:["pwd  (confirmar dónde estás)","ls *.log  (ver exactamente qué coincide)","rm *.log  (borrar lo que has visto)","ls  (comprobar el resultado)"],
  why:"Mirar, borrar, verificar. El mismo patrón sirve para cualquier operación destructiva."}
]},

{
id:"lx3l4",
titulo:"Leer ficheros",
claves:["cat muestra todo; less pagina; head y tail el principio y el final","tail -f sigue un log en vivo","wc cuenta líneas, palabras y bytes"],
pasos:[
 {t:"info", eti:"Ver contenido", h:"Cada comando para una situación",
  c:`<div class="termbox">cat fichero.txt          <span class="cm"># todo de golpe (ficheros cortos)</span>
less /var/log/syslog     <span class="cm"># paginado: flechas, espacio, / buscar, q salir</span>
head -n 20 fichero       <span class="cm"># las 20 primeras lineas</span>
tail -n 50 fichero       <span class="cm"># las 50 ultimas</span>
tail -f app.log          <span class="cm"># seguir en vivo lo que se va escribiendo</span>
wc -l fichero            <span class="cm"># contar lineas</span></div>
     <p>Para ficheros grandes, <b>nunca</b> <code>cat</code>: un log de 2 GB inunda la terminal. Usa <code>less</code> o <code>tail</code>.</p>`},
 {t:"term", p:"Muestra en vivo las líneas nuevas que se escriben en <code>/var/log/nginx/access.log</code>",
  prompt:"pablo@servidor:~$", sol:["tail -f /var/log/nginx/access.log","sudo tail -f /var/log/nginx/access.log","tail -F /var/log/nginx/access.log"],
  pista:"tail con la opción de seguir.",
  salida:`203.0.113.7 - - [21/Sep/2026:10:14:02 +0000] "GET /api/tareas HTTP/1.1" 200 512
203.0.113.7 - - [21/Sep/2026:10:14:05 +0000] "POST /api/tareas HTTP/1.1" 201 88`,
  why:"Se queda escuchando: cada petición nueva aparece al instante. Ctrl+C para salir. Con -F sigue incluso si el log se rota."},
 {t:"par", p:"Empareja cada comando con su mejor uso",
  pares:[["cat","Ver un fichero corto entero"],["less","Navegar por un fichero grande"],["head","Ver el principio"],["tail -f","Seguir un log en tiempo real"],["wc -l","Contar líneas"]],
  why:"Elegir bien evita bloquear la terminal con millones de líneas."},
 {t:"info", eti:"Dentro de less", h:"Navegar como un profesional",
  c:`<div class="termbox">espacio / b     <span class="cm"># pagina siguiente / anterior</span>
g / G           <span class="cm"># ir al principio / al final</span>
/error          <span class="cm"># buscar "error" hacia delante (n siguiente, N anterior)</span>
F               <span class="cm"># modo seguimiento, como tail -f (Ctrl+C para parar)</span>
q               <span class="cm"># salir</span></div>
     <p>Muchos comandos (<code>man</code>, <code>git log</code>, <code>journalctl</code>) usan less por debajo: las mismas teclas funcionan en todos.</p>`},
 {t:"opcion", p:"Estás dentro de <code>less</code> con un log enorme y quieres buscar la palabra «timeout». ¿Qué tecleas?",
  ops:["Ctrl + F timeout","/timeout y Enter","grep timeout","find timeout"],
  ok:1, why:"La barra inicia una búsqueda en less, igual que en vim y en man."},
 {t:"escribe", p:"Escribe el comando que cuenta cuántas líneas tiene <code>access.log</code>",
  sol:["wc -l access.log"], ph:"wc ...", pista:"wc con la opción de líneas.",
  why:"wc -l access.log. Útil para saber cuántas peticiones hubo."}
]},

{
id:"lx3l5",
titulo:"Comodines y editores",
claves:["* cualquier cosa, ? un carácter, [abc] uno de la lista, {a,b} alternativas","La shell expande los comodines antes de ejecutar el comando","nano es sencillo; vim está en todas partes: i para escribir, Esc y :wq para guardar y salir"],
pasos:[
 {t:"info", eti:"Globbing", h:"Los comodines de la shell",
  c:`<div class="termbox">*.log            <span class="cm"># todos los que terminan en .log</span>
app-?.jar        <span class="cm"># app-1.jar, app-2.jar (un solo caracter)</span>
informe[12].pdf  <span class="cm"># informe1.pdf o informe2.pdf</span>
log-{dev,prod}.txt   <span class="cm"># expansion de llaves: log-dev.txt log-prod.txt</span>
mkdir -p src/{main,test}/java   <span class="cm"># crea las dos ramas de golpe</span></div>
     <p>Importante: <b>es la shell</b> la que convierte <code>*.log</code> en la lista de ficheros <b>antes</b> de llamar al comando. El comando nunca ve el asterisco.</p>`},
 {t:"opcion", p:"¿Qué ficheros coinciden con <code>backup-202?.tar</code>?",
  ops:["backup-2026.tar y backup-2027.tar","Todos los backup-*.tar","backup-20261.tar","Solo backup-202?.tar literalmente"],
  ok:0, why:"? sustituye exactamente un carácter."},
 {t:"hueco", p:"Completa para crear a la vez <code>src/main/java</code> y <code>src/test/java</code>",
  tpl:"mkdir -p src/___/java", banco:["{main,test}","[main,test]","(main,test)","*"], sol:["{main,test}"],
  why:"Las llaves generan una palabra por alternativa. Es un truco muy usado para crear estructuras de proyecto."},
 {t:"info", eti:"Editar en el servidor", h:"nano: el editor sencillo",
  c:`<div class="termbox">nano /etc/hosts</div>
     <p>Escribes directamente. Los atajos aparecen abajo (<code>^</code> significa Ctrl):</p>
     <ul><li><b>Ctrl + O</b> guardar (y Enter para confirmar el nombre).</li>
     <li><b>Ctrl + X</b> salir.</li>
     <li><b>Ctrl + W</b> buscar.</li></ul>`},
 {t:"info", eti:"Editar en cualquier servidor", h:"vim: lo mínimo para sobrevivir",
  c:`<p><code>vi</code>/<code>vim</code> está instalado en prácticamente cualquier máquina, incluso en contenedores mínimos. Tiene <b>modos</b>, y eso es lo que confunde:</p>
     <ul><li>Al abrirlo estás en modo <b>normal</b>: las teclas son órdenes, no texto.</li>
     <li><code>i</code> pasa a modo <b>inserción</b>: ahora sí escribes.</li>
     <li><code>Esc</code> vuelve al modo normal.</li>
     <li><code>:w</code> guarda, <code>:q</code> sale, <code>:wq</code> guarda y sale, <code>:q!</code> sale <b>sin guardar</b>.</li>
     <li>En modo normal: <code>dd</code> borra una línea, <code>u</code> deshace, <code>/texto</code> busca.</li></ul>`},
 {t:"orden", p:"Ordena cómo editar una línea en vim y guardar",
  items:["vim fichero.conf","Pulsar i para entrar en modo inserción","Escribir el cambio","Pulsar Esc para volver al modo normal","Escribir :wq y Enter"],
  why:"Si alguna vez te quedas atrapado en vim: Esc, luego :q! y Enter, y sales sin guardar."},
 {t:"vf", p:"En vim, nada más abrir un fichero, lo que tecleas se escribe en el texto.",
  ok:false, why:"Se empieza en modo normal, donde cada tecla es una orden. Hay que pulsar i para escribir."}
]}

]});
