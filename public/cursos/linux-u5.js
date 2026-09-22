window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "El poder de la shell",
resumen: "Redirecciones, tuberías, grep, sort, cut, awk, sed, xargs, variables y alias",
nivel: "Intermedio",
color: "#e0a030",
lecciones: [

{
id:"lx5l1",
titulo:"Entradas, salidas y redirecciones",
claves:["Todo proceso tiene stdin (0), stdout (1) y stderr (2)","> sobrescribe, >> añade, 2> redirige errores, 2>&1 junta ambos","/dev/null es el agujero negro"],
pasos:[
 {t:"info", eti:"Los tres canales", h:"stdin, stdout y stderr",
  c:`<p>Cada programa que se ejecuta tiene tres canales abiertos:</p>
     <ul><li><b>stdin</b> (0): por donde <b>recibe</b> datos (el teclado, por defecto).</li>
     <li><b>stdout</b> (1): por donde <b>escribe</b> su resultado normal (la pantalla).</li>
     <li><b>stderr</b> (2): por donde escribe los <b>errores</b> (también la pantalla, pero es un canal distinto).</li></ul>
     <p>Que los errores vayan por otro canal es genial: puedes guardar el resultado en un fichero y seguir viendo los errores, o al revés.</p>`},
 {t:"info", eti:"Redirigir", h:"Los operadores",
  c:`<div class="termbox">comando > salida.txt       <span class="cm"># stdout a fichero (SOBRESCRIBE)</span>
comando >> salida.txt      <span class="cm"># stdout a fichero (ANADE al final)</span>
comando 2> errores.txt     <span class="cm"># stderr a fichero</span>
comando > todo.txt 2>&1    <span class="cm"># stdout a fichero, y stderr al mismo sitio que stdout</span>
comando &> todo.txt        <span class="cm"># atajo de bash para lo anterior</span>
comando < entrada.txt      <span class="cm"># stdin desde un fichero</span>
comando 2>/dev/null        <span class="cm"># tirar los errores</span></div>
     <p><code>/dev/null</code> es un dispositivo especial que descarta todo lo que recibe.</p>`},
 {t:"par", p:"Empareja cada operador con su efecto",
  pares:[[">","Sobrescribir el fichero con la salida"],[">>","Añadir la salida al final"],["2>","Redirigir los errores"],["2>&1","Enviar los errores a donde va la salida normal"],["<","Leer la entrada desde un fichero"]],
  why:"2>&1 es el que más confunde: significa «el canal 2 va a donde ahora apunta el 1»."},
 {t:"opcion", p:"Un script de cron debe guardar en <code>/var/log/backup.log</code> tanto la salida como los errores, sin borrar lo anterior. ¿Qué usas?",
  ops:["backup.sh > /var/log/backup.log","backup.sh >> /var/log/backup.log 2>&1","backup.sh 2> /var/log/backup.log","backup.sh < /var/log/backup.log"],
  ok:1, why:">> para añadir y 2>&1 para incluir errores. Así el log conserva el historial de todas las ejecuciones."},
 {t:"info", eti:"Trampa de orden", h:"El orden de las redirecciones importa",
  c:`<div class="termbox">comando > todo.txt 2>&1    <span class="cm"># CORRECTO: ambos al fichero</span>
comando 2>&1 > todo.txt    <span class="cm"># stderr va a la PANTALLA (a donde apuntaba stdout antes)</span></div>
     <p>Las redirecciones se procesan de izquierda a derecha. Es una pregunta trampa clásica.</p>`},
 {t:"vf", p:"<code>echo hola > f.txt</code> ejecutado dos veces deja el fichero con dos líneas «hola».",
  ok:false, why:"> sobrescribe cada vez: queda una sola línea. Con >> quedarían dos."},
 {t:"escribe", p:"Escribe el comando que ejecuta <code>find / -name passwd</code> descartando los mensajes de error",
  sol:["find / -name passwd 2>/dev/null","find / -name passwd 2> /dev/null"], ph:"find ...",
  pista:"El canal de errores es el 2, y el destino el agujero negro.",
  why:"2>/dev/null. Sin eso, find llena la pantalla de «Permission denied»."}
]},

{
id:"lx5l2",
titulo:"Tuberías y grep",
claves:["| conecta la salida de un comando con la entrada del siguiente","grep filtra líneas; -i, -v, -r, -n, -c, -E","Las tuberías son la filosofía UNIX en acción"],
pasos:[
 {t:"info", eti:"El pegamento", h:"La tubería |",
  c:`<p>La <b>tubería</b> (pipe, <code>|</code>) envía la salida de un comando como entrada del siguiente. Así se combinan programas pequeños para hacer cosas grandes:</p>
     <div class="termbox">cat access.log | grep " 500 " | wc -l
<span class="cm"># cuantas peticiones dieron error 500</span>

ps aux | grep java
<span class="cm"># procesos que contienen "java"</span></div>`},
 {t:"info", eti:"Filtrar", h:"grep: buscar texto",
  c:`<div class="termbox">grep error app.log            <span class="cm"># lineas que contienen "error"</span>
grep -i error app.log         <span class="cm"># sin distinguir mayusculas</span>
grep -v DEBUG app.log         <span class="cm"># lineas que NO contienen DEBUG</span>
grep -n timeout app.log       <span class="cm"># con numero de linea</span>
grep -c 500 access.log        <span class="cm"># solo contar</span>
grep -r "localhost" /etc/nginx  <span class="cm"># buscar en todos los ficheros de una carpeta</span>
grep -A 3 -B 2 Exception app.log  <span class="cm"># 3 lineas despues y 2 antes (contexto)</span>
grep -E "error|warn" app.log  <span class="cm"># expresiones regulares extendidas</span></div>`},
 {t:"par", p:"Empareja cada opción de grep con su efecto",
  pares:[["-i","Ignorar mayúsculas y minúsculas"],["-v","Invertir: las que NO coinciden"],["-r","Buscar recursivamente en carpetas"],["-n","Mostrar el número de línea"],["-A 3","Mostrar 3 líneas de contexto después"]],
  why:"-A y -B son oro con los stack traces de Java: la excepción está en una línea y la causa, en las siguientes."},
 {t:"term", p:"Busca, sin distinguir mayúsculas, la palabra <code>error</code> en <code>app.log</code>, mostrando los números de línea",
  prompt:"pablo@servidor:/var/log/mi-api$", sol:["grep -in error app.log","grep -ni error app.log","grep -i -n error app.log","grep -n -i error app.log"],
  pista:"grep con -i y -n.",
  salida:`142:2026-09-21 10:14:02 ERROR Connection to db:5432 refused
388:2026-09-21 10:21:47 Error al validar la tarea: título vacío`,
  why:"Con -i encuentra ERROR y Error. El número de línea te permite ir directo con less +142 app.log."},
 {t:"opcion", p:"Quieres ver las líneas de un log que no son de nivel DEBUG ni INFO. ¿Qué usas?",
  ops:["grep DEBUG INFO app.log","grep -v -E \"DEBUG|INFO\" app.log","grep -c DEBUG app.log","grep -r INFO app.log"],
  ok:1, why:"-v invierte y -E permite la alternativa con |."},
 {t:"vf", p:"En <code>ps aux | grep java</code>, a veces aparece el propio proceso de grep en el resultado.",
  ok:true, why:"Porque la línea de grep también contiene «java». Truco: ps aux | grep [j]ava, o usar pgrep -a java."}
]},

{
id:"lx5l3",
titulo:"Ordenar, contar y recortar",
claves:["sort ordena, uniq quita duplicados (sobre entrada ordenada), wc cuenta","cut corta columnas por delimitador; tr cambia caracteres","sort | uniq -c | sort -rn: el ranking clásico"],
pasos:[
 {t:"info", eti:"Herramientas de texto", h:"sort, uniq, wc, cut, tr",
  c:`<div class="termbox">sort nombres.txt               <span class="cm"># orden alfabetico</span>
sort -n numeros.txt            <span class="cm"># orden numerico</span>
sort -rn                       <span class="cm"># numerico descendente</span>
sort -k 2                      <span class="cm"># por la segunda columna</span>
uniq                           <span class="cm"># quita lineas repetidas CONSECUTIVAS</span>
uniq -c                        <span class="cm"># y cuenta cuantas habia</span>
cut -d',' -f1,3 datos.csv      <span class="cm"># columnas 1 y 3 separadas por comas</span>
cut -d: -f1 /etc/passwd        <span class="cm"># nombres de usuario</span>
tr 'a-z' 'A-Z'                 <span class="cm"># pasar a mayusculas</span></div>
     <p><code>uniq</code> solo detecta duplicados <b>seguidos</b>: por eso casi siempre va después de <code>sort</code>.</p>`},
 {t:"info", eti:"El patrón estrella", h:"Qué IPs hacen más peticiones",
  c:`<div class="termbox">cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -5
<span class="cm">   4812 203.0.113.7
   1290 198.51.100.23
    310 192.0.2.44</span></div>
     <p>Léelo por partes: saca la primera columna (la IP), ordena, cuenta repeticiones, ordena por número de mayor a menor y quédate con las 5 primeras. Este patrón sirve para contar cualquier cosa: URLs más pedidas, errores más frecuentes, usuarios más activos...</p>`},
 {t:"orden", p:"Ordena la tubería que obtiene las 5 URLs más pedidas (la URL está en la columna 7)",
  items:["cut -d' ' -f7 access.log","sort","uniq -c","sort -rn","head -5"],
  why:"Extraer, ordenar, contar, ordenar por cuenta, cortar. Un clásico de entrevista y de guardia."},
 {t:"opcion", p:"¿Por qué <code>uniq</code> suele ir detrás de <code>sort</code>?",
  ops:["Por costumbre","Porque uniq solo elimina duplicados que están en líneas consecutivas","Porque sort borra duplicados","Porque uniq ordena al revés"],
  ok:1, why:"Sin ordenar antes, dos líneas iguales separadas por otras no se detectan como duplicadas. (sort -u hace ambas cosas.)"},
 {t:"escribe", p:"Escribe el comando que muestra solo los nombres de usuario de <code>/etc/passwd</code> (primer campo, separado por dos puntos)",
  sol:["cut -d: -f1 /etc/passwd","cut -d ':' -f1 /etc/passwd","cut -d: -f 1 /etc/passwd","cut -f1 -d: /etc/passwd"], ph:"cut ...",
  pista:"cut con delimitador dos puntos y el campo 1.",
  why:"cut -d: -f1 /etc/passwd."},
 {t:"vf", p:"<code>wc -l</code> cuenta el número de palabras de un fichero.",
  ok:false, why:"-l cuenta líneas; -w palabras; -c bytes."}
]},

{
id:"lx5l4",
titulo:"awk y sed: procesar texto como un experto",
claves:["awk trabaja por columnas: $1, $2, $NF; ideal para sumar y filtrar","sed edita flujos: sustituir con s/viejo/nuevo/g","sed -i edita ficheros en el sitio (haz copia antes)"],
pasos:[
 {t:"info", eti:"awk", h:"Un mini lenguaje para columnas",
  c:`<p><code>awk</code> divide cada línea en campos (por espacios, por defecto) y te deja trabajar con ellos:</p>
     <div class="termbox">awk '{print $1}' access.log                  <span class="cm"># primera columna</span>
awk '{print $1, $9}' access.log              <span class="cm"># IP y codigo de estado</span>
awk '$9 == 500' access.log                   <span class="cm"># solo lineas con estado 500</span>
awk -F: '{print $1, $7}' /etc/passwd         <span class="cm"># separador ":" — usuario y shell</span>
awk '{total += $10} END {print total}' access.log   <span class="cm"># sumar bytes enviados</span>
awk '{print $NF}' fichero                    <span class="cm"># ultima columna</span></div>
     <p><code>$0</code> es la línea entera, <code>$NF</code> el último campo y <code>NR</code> el número de línea.</p>`},
 {t:"opcion", p:"¿Qué hace <code>awk '$9 >= 500 {print $7}' access.log</code>?",
  ops:["Imprime las líneas 500 a 700","Imprime la URL (columna 7) de las peticiones con estado de error 5xx (columna 9)","Suma las columnas 7 y 9","Borra las líneas con error"],
  ok:1, why:"La condición filtra por la columna 9 y la acción imprime la 7. awk es condición + acción."},
 {t:"info", eti:"sed", h:"Editar texto en un flujo",
  c:`<div class="termbox">sed 's/localhost/db/' config.yml          <span class="cm"># sustituir la PRIMERA aparicion de cada linea</span>
sed 's/localhost/db/g' config.yml         <span class="cm"># g: TODAS las apariciones</span>
sed -i 's/8080/9090/g' application.properties   <span class="cm"># editar el fichero en el sitio</span>
sed -i.bak 's/a/b/g' fichero              <span class="cm"># igual, guardando copia fichero.bak</span>
sed -n '10,20p' app.log                   <span class="cm"># imprimir solo las lineas 10 a 20</span>
sed '/^#/d' nginx.conf                    <span class="cm"># borrar lineas de comentario</span></div>`},
 {t:"hueco", p:"Completa para cambiar TODAS las apariciones de <code>dev</code> por <code>prod</code> en el fichero, editándolo en el sitio",
  tpl:"sed ___ 's/dev/prod/___' app.env", banco:["-i","g","-n","p"], sol:["-i","g"],
  why:"-i edita el fichero; la g final aplica la sustitución a todas las coincidencias de cada línea."},
 {t:"vf", p:"<code>sed 's/a/b/'</code> sin la <code>g</code> sustituye todas las apariciones de cada línea.",
  ok:false, why:"Sin g solo cambia la primera aparición de cada línea. Un error clásico."},
 {t:"info", eti:"Cuándo usar qué", h:"grep, awk o sed",
  c:`<ul><li><b>grep</b>: ¿qué líneas contienen esto?</li>
     <li><b>awk</b>: ¿qué hay en tal columna?, sumas, condiciones sobre campos.</li>
     <li><b>sed</b>: cambiar texto, borrar o extraer rangos de líneas.</li></ul>
     <p>Para algo más complejo que un par de líneas, mejor un script en Python: el objetivo es resolver, no escribir el comando más críptico.</p>`},
 {t:"escribe", p:"Escribe el comando awk que imprime solo la primera columna de <code>access.log</code>",
  sol:["awk '{print $1}' access.log","awk \"{print $1}\" access.log"], ph:"awk ...",
  pista:"awk, entre comillas simples {print $1}, y el fichero.",
  why:"awk '{print $1}' access.log. Las comillas simples evitan que bash interprete $1."}
]},

{
id:"lx5l5",
titulo:"xargs, sustitución de comandos y expansiones",
claves:["xargs convierte líneas de entrada en argumentos de otro comando","$(comando) inserta la salida de un comando","Comillas dobles expanden variables; simples, no"],
pasos:[
 {t:"info", eti:"Convertir salida en argumentos", h:"xargs",
  c:`<p>Algunos comandos no leen de la entrada estándar, sino de sus argumentos (como <code>rm</code>). <code>xargs</code> hace de puente:</p>
     <div class="termbox">find . -name "*.tmp" | xargs rm             <span class="cm"># borrar lo encontrado</span>
find . -name "*.tmp" -print0 | xargs -0 rm  <span class="cm"># seguro con espacios en los nombres</span>
cat servidores.txt | xargs -I{} ssh {} uptime   <span class="cm"># un comando por linea</span>
ls *.log | xargs -P 4 -n 1 gzip             <span class="cm"># comprimir en paralelo, 4 a la vez</span></div>`},
 {t:"opcion", p:"¿Por qué se usa <code>-print0</code> con <code>xargs -0</code>?",
  ops:["Para ir más rápido","Para que los nombres con espacios o saltos de línea no se partan en varios argumentos","Para borrar sin confirmar","Para ordenar el resultado"],
  ok:1, why:"Separan los nombres con el carácter nulo, que no puede aparecer en un nombre de fichero. Así «mi informe.tmp» no se convierte en dos ficheros."},
 {t:"info", eti:"Sustitución de comandos", h:"$(comando)",
  c:`<div class="termbox">echo "Hoy es $(date +%F)"
<span class="cm">Hoy es 2026-09-21</span>

cp app.jar "app-$(date +%Y%m%d).jar"
kill $(pgrep -f mi-api)
cd "$(git rev-parse --show-toplevel)"</div>
     <p>La shell ejecuta lo de dentro y pone su salida en ese lugar. La forma antigua con comillas invertidas (<code>\`date\`</code>) funciona igual, pero <code>$( )</code> se lee mejor y se puede anidar.</p>`},
 {t:"info", eti:"Comillas", h:"Dobles, simples y ninguna",
  c:`<div class="termbox">NOMBRE="Pablo"
echo "Hola $NOMBRE"     <span class="cm"># Hola Pablo      (dobles: expanden variables)</span>
echo 'Hola $NOMBRE'     <span class="cm"># Hola $NOMBRE    (simples: literal)</span>
echo Hola      mundo    <span class="cm"># Hola mundo      (sin comillas: separa y junta espacios)</span></div>
     <p>Regla práctica: <b>pon siempre comillas dobles alrededor de las variables</b>: <code>"$FICHERO"</code>. Si el valor tiene espacios, sin comillas se parte en varios argumentos.</p>`},
 {t:"par", p:"Empareja cada forma con lo que produce",
  pares:[["\"$HOME\"","El valor de la variable, como un solo argumento"],["'$HOME'","El texto literal $HOME"],["$(whoami)","La salida del comando whoami"],["{1..3}","1 2 3 (expansión de secuencia)"]],
  why:"Entender cuándo la shell expande algo evita la mitad de los errores en scripts."},
 {t:"vf", p:"<code>echo '$HOME'</code> muestra la ruta de tu carpeta personal.",
  ok:false, why:"Las comillas simples impiden la expansión: muestra literalmente $HOME."},
 {t:"escribe", p:"Escribe el comando que imprime «Usuario: » seguido de la salida de <code>whoami</code>, usando sustitución de comandos",
  sol:["echo \"Usuario: $(whoami)\"","echo Usuario: $(whoami)","echo 'Usuario: '$(whoami)"], ph:"echo ...",
  pista:"echo, comillas dobles y $(whoami) dentro.", why:"echo \"Usuario: $(whoami)\"."}
]},

{
id:"lx5l6",
titulo:"Variables de entorno, alias y tu .bashrc",
claves:["export hace que una variable pase a los procesos hijos","PATH decide dónde se buscan los comandos","~/.bashrc personaliza tu shell; source lo recarga"],
pasos:[
 {t:"info", eti:"Variables", h:"De shell y de entorno",
  c:`<div class="termbox">NOMBRE=pablo           <span class="cm"># variable de shell: solo la ve esta shell</span>
export JAVA_HOME=/usr/lib/jvm/java-21   <span class="cm"># de ENTORNO: la heredan los programas que lances</span>
echo $JAVA_HOME
env                    <span class="cm"># todas las variables de entorno</span>
unset NOMBRE           <span class="cm"># borrar</span>
DEBUG=1 ./script.sh    <span class="cm"># variable solo para ese comando</span></div>
     <p>Cuando Docker o Kubernetes te pasan configuración, lo hacen exactamente así: como variables de entorno del proceso.</p>`},
 {t:"opcion", p:"Defines <code>PUERTO=8080</code> sin export y lanzas <code>java -jar app.jar</code>. ¿La aplicación ve PUERTO?",
  ops:["Sí, siempre","No: sin export la variable no pasa a los procesos hijos","Solo si es root","Solo si reinicias la shell"],
  ok:1, why:"Solo las variables exportadas forman parte del entorno que heredan los procesos."},
 {t:"info", eti:"PATH", h:"Dónde busca la shell los comandos",
  c:`<div class="termbox">echo $PATH
<span class="cm">/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin</span></div>
     <p>Al escribir <code>java</code>, la shell recorre esas carpetas <b>en orden</b> y ejecuta el primer <code>java</code> que encuentra. Si instalas algo en <code>/opt/herramienta/bin</code>, añádelo:</p>
     <div class="termbox">export PATH="$PATH:/opt/herramienta/bin"</div>
     <p>«command not found» casi siempre significa: no está instalado, o no está en el PATH.</p>`},
 {t:"info", eti:"Personalizar", h:"Alias y ~/.bashrc",
  c:`<div class="termbox"><span class="cm"># en ~/.bashrc</span>
alias ll='ls -lah'
alias k='kubectl'
alias gs='git status'
export EDITOR=vim
export PATH="$PATH:$HOME/bin"</div>
     <div class="termbox">source ~/.bashrc      <span class="cm"># aplicar los cambios sin cerrar la terminal</span></div>
     <p><code>~/.bashrc</code> se ejecuta cada vez que abres una shell interactiva. <code>~/.profile</code> (o <code>~/.bash_profile</code>) al iniciar sesión.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["export","Pasar una variable a los procesos hijos"],["PATH","Carpetas donde se buscan los comandos"],["alias","Atajo para un comando"],["~/.bashrc","Configuración de cada shell interactiva"],["source","Ejecutar un fichero en la shell actual"]],
  why:"source es clave: ejecutar ./fichero lanzaría otra shell y los cambios se perderían al terminar."},
 {t:"vf", p:"Si escribes <code>./.bashrc</code> en lugar de <code>source ~/.bashrc</code>, los alias quedan definidos en tu shell actual.",
  ok:false, why:"Ejecutarlo crea una shell hija que define los alias y muere. source lo ejecuta en la shell actual."},
 {t:"escribe", p:"Añade la carpeta <code>/opt/tools/bin</code> al final del PATH, para esta sesión",
  sol:["export PATH=\"$PATH:/opt/tools/bin\"","export PATH=$PATH:/opt/tools/bin","export PATH=\"${PATH}:/opt/tools/bin\""], ph:"export PATH=...",
  pista:"export PATH con el PATH actual, dos puntos y la carpeta nueva.",
  why:"export PATH=\"$PATH:/opt/tools/bin\". Para que sea permanente, ponlo en ~/.bashrc."}
]}

]});
