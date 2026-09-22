window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Bash scripting",
resumen: "Scripts robustos: variables, condiciones, bucles, funciones, argumentos, errores y trampas",
nivel: "Avanzado",
color: "#c98a1c",
lecciones: [

{
id:"lx7l1",
titulo:"Tu primer script bien hecho",
claves:["Shebang #!/usr/bin/env bash en la primera línea","set -euo pipefail: fallar pronto y de forma visible","chmod +x y ./script.sh para ejecutarlo"],
pasos:[
 {t:"info", eti:"Esqueleto", h:"La plantilla que usan los profesionales",
  c:`<div class="termbox">#!/usr/bin/env bash
set -euo pipefail

# Descripcion: hace backup de la base de datos
# Uso: ./backup.sh [destino]

main() {
  local destino="\${1:-/backups}"
  echo "Guardando en $destino"
}

main "$@"</div>
     <ul><li><b>#!/usr/bin/env bash</b>: el <i>shebang</i> dice qué intérprete ejecuta el fichero. Con <code>env</code> se busca bash en el PATH.</li>
     <li><b>set -euo pipefail</b>: modo estricto (siguiente paso).</li>
     <li>Una función <code>main</code> y la llamada <code>main "$@"</code> al final: el script se lee de arriba abajo como un programa.</li></ul>`},
 {t:"info", eti:"Modo estricto", h:"set -euo pipefail, letra a letra",
  c:`<ul><li><b>-e</b>: si un comando falla, el script se detiene. Sin esto, sigue como si nada.</li>
     <li><b>-u</b>: usar una variable no definida es un error. Evita el clásico <code>rm -rf "$DIR"/</code> con DIR vacía.</li>
     <li><b>-o pipefail</b>: en <code>a | b</code>, si falla <code>a</code>, la tubería entera falla (por defecto solo cuenta el último).</li></ul>
     <p>Opcional para depurar: <code>set -x</code> imprime cada comando antes de ejecutarlo.</p>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["set -e","Parar al primer comando que falle"],["set -u","Error si se usa una variable no definida"],["set -o pipefail","Una tubería falla si falla cualquier parte"],["set -x","Mostrar cada comando antes de ejecutarlo"]],
  why:"Todo script que vaya a producción debería empezar con set -euo pipefail."},
 {t:"opcion", p:"Sin <code>pipefail</code>, ¿qué código de salida tiene <code>curl https://no-existe | tee salida.txt</code>?",
  ops:["El de curl (error)","El de tee (0, éxito), aunque curl haya fallado","Siempre 1","Depende del día"],
  ok:1, why:"Por defecto el estado de una tubería es el del último comando. pipefail lo corrige."},
 {t:"term", p:"Da permiso de ejecución a <code>backup.sh</code> y ejecútalo, en un solo comando encadenado",
  prompt:"pablo@servidor:~/scripts$", sol:["chmod +x backup.sh && ./backup.sh","chmod u+x backup.sh && ./backup.sh","chmod 755 backup.sh && ./backup.sh"],
  pista:"chmod +x, luego && y ./backup.sh.",
  salida:`Guardando en /backups`, why:"El ./ es necesario: el directorio actual no está en el PATH por seguridad."},
 {t:"vf", p:"Para ejecutar un script del directorio actual basta con escribir su nombre, <code>backup.sh</code>.",
  ok:false, why:"El directorio actual no está en el PATH (evita que un fichero malicioso llamado ls se ejecute sin querer). Hay que escribir ./backup.sh."}
]},

{
id:"lx7l2",
titulo:"Variables y parámetros",
claves:["VAR=valor sin espacios; usar con \"$VAR\"","$1 $2 argumentos, $# cuántos, \"$@\" todos, $0 el script, $? último código","${VAR:-defecto} valor por defecto; ${VAR:?mensaje} obligatoria"],
pasos:[
 {t:"info", eti:"Variables", h:"Asignar y usar",
  c:`<div class="termbox">NOMBRE="api-tareas"          <span class="cm"># SIN espacios alrededor del =</span>
VERSION=$(git describe --tags)
echo "Desplegando $NOMBRE $VERSION"
echo "Fichero: \${NOMBRE}_backup.tar"   <span class="cm"># llaves para delimitar</span>
readonly ENTORNO=prod        <span class="cm"># constante</span>
local contador=0             <span class="cm"># dentro de funciones: variable local</span></div>`},
 {t:"info", eti:"Parámetros especiales", h:"Lo que recibe tu script",
  c:`<div class="termbox">./desplegar.sh prod 1.4.0

$0   <span class="cm"># ./desplegar.sh</span>
$1   <span class="cm"># prod</span>
$2   <span class="cm"># 1.4.0</span>
$#   <span class="cm"># 2  (cuantos argumentos)</span>
"$@" <span class="cm"># todos los argumentos, cada uno como uno</span>
$?   <span class="cm"># codigo de salida del ultimo comando</span>
$$   <span class="cm"># PID del propio script</span></div>`},
 {t:"par", p:"Empareja cada parámetro con su significado",
  pares:[["$1","Primer argumento"],["$#","Número de argumentos"],["\"$@\"","Todos los argumentos, respetando espacios"],["$?","Código de salida del último comando"],["$0","Nombre del script"]],
  why:"\"$@\" con comillas es lo correcto para reenviar argumentos; $* los junta en uno."},
 {t:"info", eti:"Expansiones útiles", h:"Valores por defecto y manipulación",
  c:`<div class="termbox">\${ENTORNO:-dev}          <span class="cm"># si no esta definida o vacia, usa "dev"</span>
\${TOKEN:?Falta TOKEN}    <span class="cm"># si falta, error con ese mensaje y sale</span>
\${#NOMBRE}               <span class="cm"># longitud</span>
\${FICHERO%.tar.gz}       <span class="cm"># quitar sufijo: backup.tar.gz -> backup</span>
\${RUTA##*/}              <span class="cm"># quedarse con lo tras la ultima /: nombre del fichero</span>
\${TEXTO/viejo/nuevo}     <span class="cm"># sustituir la primera aparicion</span></div>`},
 {t:"opcion", p:"¿Qué hace <code>${1:?Uso: ./script.sh ENTORNO}</code> si llamas al script sin argumentos?",
  ops:["Usa un valor vacío","Termina con error mostrando «Uso: ./script.sh ENTORNO»","Pregunta el valor por teclado","Usa el valor ENTORNO"],
  ok:1, why:"Es la forma idiomática de exigir argumentos obligatorios con un mensaje claro."},
 {t:"hueco", p:"Completa para usar <code>8080</code> si la variable PUERTO no está definida",
  tpl:"echo \"Puerto: ${PUERTO___8080}\"", banco:[":-",":?","##","%"], sol:[":-"],
  why:"${VAR:-defecto}. Muy usado en scripts de entrada de contenedores."},
 {t:"vf", p:"<code>NOMBRE = pablo</code> (con espacios) asigna la variable correctamente.",
  ok:false, why:"Bash interpretaría NOMBRE como un comando con los argumentos = y pablo. Sin espacios: NOMBRE=pablo."}
]},

{
id:"lx7l3",
titulo:"Condiciones",
claves:["if se basa en códigos de salida: 0 es verdadero","[[ ]] para comparar texto y comprobar ficheros; (( )) para números","&& y || encadenan según el resultado"],
pasos:[
 {t:"info", eti:"La idea clave", h:"En bash, if comprueba códigos de salida",
  c:`<p><code>if</code> no evalúa «verdadero o falso» como en Java: ejecuta un comando y mira su <b>código de salida</b>. <b>0 es éxito</b> (verdadero), cualquier otro número es fallo.</p>
     <div class="termbox">if grep -q "ERROR" app.log; then
  echo "Hay errores"
elif [[ -s app.log ]]; then
  echo "Hay log pero sin errores"
else
  echo "Log vacio"
fi</div>`},
 {t:"info", eti:"Comprobaciones", h:"Las condiciones más usadas",
  c:`<div class="termbox">[[ -f "$F" ]]        <span class="cm"># existe y es un fichero</span>
[[ -d "$D" ]]        <span class="cm"># existe y es un directorio</span>
[[ -x "$F" ]]        <span class="cm"># es ejecutable</span>
[[ -s "$F" ]]        <span class="cm"># existe y no esta vacio</span>
[[ -z "$VAR" ]]      <span class="cm"># cadena vacia</span>
[[ -n "$VAR" ]]      <span class="cm"># cadena no vacia</span>
[[ "$A" == "$B" ]]   <span class="cm"># textos iguales</span>
[[ "$V" == 1.* ]]    <span class="cm"># coincide con un patron</span>
[[ "$V" =~ ^[0-9]+$ ]]  <span class="cm"># expresion regular</span>
(( N > 10 ))         <span class="cm"># comparacion numerica</span></div>`},
 {t:"par", p:"Empareja cada prueba con su significado",
  pares:[["-f","Es un fichero normal"],["-d","Es un directorio"],["-z","La cadena está vacía"],["-n","La cadena no está vacía"],["=~","Coincide con una expresión regular"]],
  why:"[[ ]] es la versión moderna de bash: más segura que [ ] con variables vacías y con patrones."},
 {t:"info", eti:"Atajos", h:"&& y ||",
  c:`<div class="termbox">mkdir -p /backups && echo "Carpeta lista"
[[ -f config.yml ]] || { echo "Falta config.yml" >&2; exit 1; }
ping -c1 -W1 db >/dev/null 2>&1 && echo "db accesible" || echo "db caida"</div>
     <p><code>&&</code>: ejecuta lo siguiente si lo anterior fue bien. <code>||</code>: si fue mal. <code>>&2</code> envía el mensaje al canal de errores, donde deben ir.</p>`},
 {t:"opcion", p:"¿Qué hace <code>[[ -d /backups ]] || mkdir -p /backups</code>?",
  ops:["Borra /backups si existe","Crea /backups solo si no existe","Siempre crea /backups","Comprueba permisos"],
  ok:1, why:"Si el test falla (no existe), se ejecuta mkdir. (Aunque mkdir -p ya es idempotente por sí solo.)"},
 {t:"hueco", p:"Completa: si el fichero de configuración no existe, termina con error",
  tpl:"if [[ ! ___ \"$CONFIG\" ]]; then\n  echo \"No existe $CONFIG\" >&2\n  ___ 1\nfi", banco:["-f","exit","-z","return"], sol:["-f","exit"],
  why:"! niega la prueba. exit 1 termina el script con código de error, para que quien lo llamó (cron, un pipeline) se entere."},
 {t:"vf", p:"En bash, un código de salida 1 se considera «verdadero» en un if.",
  ok:false, why:"Al contrario de muchos lenguajes: 0 es verdadero (éxito) y distinto de 0 es falso (fallo)."}
]},

{
id:"lx7l4",
titulo:"Bucles",
claves:["for recorre listas, ficheros o rangos","while read recorre líneas de un fichero o comando","break y continue controlan el bucle"],
pasos:[
 {t:"info", eti:"for", h:"Recorrer listas",
  c:`<div class="termbox">for servidor in web1 web2 web3; do
  ssh "$servidor" "uptime"
done

for f in /var/log/nginx/*.log; do
  gzip "$f"
done

for i in {1..5}; do echo "Intento $i"; done

for ((i=0; i&lt;10; i++)); do echo "$i"; done</div>`},
 {t:"info", eti:"while", h:"Leer línea a línea y reintentar",
  c:`<div class="termbox">while IFS= read -r linea; do
  echo "Procesando: $linea"
done &lt; servidores.txt

<span class="cm"># reintentos: esperar a que la base de datos responda</span>
intentos=0
until pg_isready -h db; do
  (( intentos++ >= 30 )) && { echo "BD no disponible" >&2; exit 1; }
  sleep 2
done</div>
     <p><code>IFS= read -r</code> es la forma correcta de leer líneas: conserva espacios y barras invertidas.</p>`},
 {t:"opcion", p:"¿Qué bucle usarías para esperar a que un servicio esté listo, con un máximo de intentos?",
  ops:["for i in *","until (o while) con un contador y sleep","if con sleep","case"],
  ok:1, why:"until repite mientras la condición falle. El contador evita esperar para siempre."},
 {t:"orden", p:"Ordena un bucle que comprime todos los .log de una carpeta",
  items:["for f in /var/log/app/*.log; do","  gzip \"$f\"","done"],
  why:"Las comillas en \"$f\" protegen los nombres con espacios."},
 {t:"vf", p:"<code>for linea in $(cat fichero)</code> recorre el fichero línea a línea correctamente.",
  ok:false, why:"Recorre palabras, no líneas: separa por espacios. Para líneas: while IFS= read -r linea; do ...; done < fichero."},
 {t:"escribe", p:"Escribe la cabecera de un bucle for que recorra los números del 1 al 10 con expansión de llaves",
  sol:["for i in {1..10}; do","for i in {1..10};do","for i in {1..10}"], ph:"for ...",
  pista:"for, variable, in, y {1..10}.", why:"for i in {1..10}; do ... done."}
]},

{
id:"lx7l5",
titulo:"Funciones, argumentos y case",
claves:["Las funciones reciben argumentos como $1, $2 y devuelven códigos con return","local evita variables globales accidentales","case para menús y opciones; getopts para flags"],
pasos:[
 {t:"info", eti:"Funciones", h:"Reutilizar código",
  c:`<div class="termbox">log() {
  local nivel="$1"; shift
  echo "$(date '+%F %T') [$nivel] $*" >&2
}

esta_vivo() {
  curl -sf "http://localhost:$1/actuator/health" >/dev/null
}

log INFO "Comprobando la API"
if esta_vivo 8080; then log INFO "API sana"; else log ERROR "API caida"; exit 1; fi</div>
     <p>Una función <b>devuelve un código</b> (con <code>return N</code>, o el del último comando). Para «devolver» texto, lo imprime y se captura con <code>$(funcion)</code>.</p>`},
 {t:"opcion", p:"¿Cómo devuelve una función de bash un texto a quien la llama?",
  ops:["Con return \"texto\"","Imprimiéndolo con echo y capturándolo con $(funcion)","Con una variable global obligatoriamente","No puede"],
  ok:1, why:"return solo admite números (0-255), que son códigos de salida."},
 {t:"info", eti:"case", h:"Elegir según un valor",
  c:`<div class="termbox">case "\${1:-}" in
  start)   systemctl start mi-api ;;
  stop)    systemctl stop mi-api ;;
  restart) systemctl restart mi-api ;;
  *.tar.gz) echo "Es un archivo comprimido" ;;
  *)       echo "Uso: $0 {start|stop|restart}" >&2; exit 2 ;;
esac</div>`},
 {t:"info", eti:"Opciones como las de verdad", h:"getopts",
  c:`<div class="termbox">ENTORNO=dev; VERBOSE=0
while getopts ":e:v" opt; do
  case "$opt" in
    e) ENTORNO="$OPTARG" ;;
    v) VERBOSE=1 ;;
    \\?) echo "Opcion invalida: -$OPTARG" >&2; exit 2 ;;
  esac
done
shift $((OPTIND - 1))    <span class="cm"># lo que queda son argumentos normales</span></div>
     <p>Así tu script admite <code>./desplegar.sh -e prod -v</code> como cualquier comando de Linux.</p>`},
 {t:"par", p:"Empareja cada construcción con su uso",
  pares:[["local","Variable visible solo dentro de la función"],["return","Devolver un código de salida desde una función"],["shift","Descartar el primer argumento y desplazar los demás"],["case","Elegir una rama según el valor de una variable"],["getopts","Procesar opciones tipo -e valor"]],
  why:"Con esto tus scripts se comportan como herramientas profesionales."},
 {t:"vf", p:"Las variables definidas dentro de una función de bash son locales por defecto.",
  ok:false, why:"Son globales salvo que las declares con local. Fuente clásica de errores en scripts largos."}
]},

{
id:"lx7l6",
titulo:"Scripts robustos: errores, trampas y buenas prácticas",
claves:["trap limpia recursos al salir (EXIT) o ante errores (ERR)","mktemp crea temporales seguros","shellcheck detecta errores antes de ejecutar"],
pasos:[
 {t:"info", eti:"Limpieza garantizada", h:"trap",
  c:`<div class="termbox">TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT          <span class="cm"># se ejecuta al salir, pase lo que pase</span>
trap 'echo "Fallo en la linea $LINENO" >&2' ERR

curl -sfo "$TMP/release.tar.gz" "$URL"
tar -xzf "$TMP/release.tar.gz" -C /opt/app</div>
     <p><code>trap ... EXIT</code> garantiza que el temporal se borra aunque el script falle a mitad (gracias a <code>set -e</code>) o lo interrumpas con Ctrl+C.</p>`},
 {t:"opcion", p:"¿Para qué sirve <code>trap 'rm -rf \"$TMP\"' EXIT</code>?",
  ops:["Para borrar el script al terminar","Para asegurar que el directorio temporal se borra al salir, incluso si el script falla","Para capturar Ctrl+C e ignorarlo","Para salir con código 0"],
  ok:1, why:"Es el equivalente a un bloque finally de Java."},
 {t:"info", eti:"Buenas prácticas", h:"Lista de comprobación de un script de producción",
  c:`<ul><li><code>#!/usr/bin/env bash</code> y <code>set -euo pipefail</code>.</li>
     <li><b>Todas</b> las variables entre comillas dobles: <code>"$VAR"</code>.</li>
     <li>Mensajes de error a stderr (<code>>&2</code>) y códigos de salida distintos de 0 al fallar.</li>
     <li>Temporales con <code>mktemp</code> y limpieza con <code>trap</code>.</li>
     <li>Idempotente: ejecutarlo dos veces no debe romper nada (<code>mkdir -p</code>, comprobar antes de crear).</li>
     <li>Un mensaje de uso si faltan argumentos.</li>
     <li>Pasarlo por <b>shellcheck</b> antes de subirlo.</li></ul>`},
 {t:"info", eti:"El corrector", h:"shellcheck",
  c:`<div class="termbox">shellcheck desplegar.sh
<span class="cm">In desplegar.sh line 12:
rm -rf $DIR/*
       ^--^ SC2086: Double quote to prevent globbing and word splitting.</span></div>
     <p>Detecta los errores clásicos (variables sin comillas, bucles mal hechos, comparaciones erróneas) antes de que causen un desastre. Se integra en editores y en el CI.</p>`},
 {t:"par", p:"Empareja cada herramienta con su propósito",
  pares:[["trap ... EXIT","Limpiar recursos al terminar"],["mktemp","Crear ficheros o carpetas temporales con nombre único"],["shellcheck","Análisis estático de scripts"],[">&2","Enviar mensajes al canal de errores"]],
  why:"Un script con estas cuatro cosas ya está por encima de la mayoría de lo que circula por ahí."},
 {t:"vf", p:"Un script idempotente puede ejecutarse varias veces seguidas dejando el sistema en el mismo estado.",
  ok:true, why:"Es la propiedad que hace seguros los reintentos, igual que en Ansible o Terraform."},
 {t:"escribe", p:"Escribe la línea que crea un directorio temporal seguro y guarda su ruta en la variable TMP",
  sol:["tmp=$(mktemp -d)","tmp=\"$(mktemp -d)\""], ph:"TMP=...",
  pista:"Sustitución de comandos con mktemp y la opción de directorio.",
  why:"TMP=$(mktemp -d). Crea algo como /tmp/tmp.X3k9aQ, sin colisiones con otros procesos."}
]}

]});
