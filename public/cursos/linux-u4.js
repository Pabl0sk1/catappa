window.CURSOS = window.CURSOS || {};
(CURSOS.linux = CURSOS.linux || []).push({
titulo: "Usuarios, grupos y permisos",
resumen: "Quién puede hacer qué: usuarios, sudo, chmod, chown, umask y permisos especiales",
nivel: "Intermedio",
color: "#e0a030",
lecciones: [

{
id:"lx4l1",
titulo:"Usuarios y grupos",
claves:["Cada usuario tiene un UID; root es el UID 0","/etc/passwd guarda los usuarios; /etc/shadow las contraseñas cifradas","Los grupos reparten permisos entre varios usuarios"],
pasos:[
 {t:"info", eti:"Multiusuario", h:"Linux nació para compartirse",
  c:`<p>Linux es un sistema <b>multiusuario</b>: varias personas y servicios comparten la misma máquina, cada uno con sus permisos. Cada usuario tiene:</p>
     <ul><li>un nombre (<code>pablo</code>) y un número, el <b>UID</b>,</li>
     <li>un grupo principal y quizá otros secundarios,</li>
     <li>una carpeta personal y una shell por defecto.</li></ul>
     <p>El usuario <b>root</b> (UID 0) es el administrador: puede hacerlo todo. Los servicios (nginx, postgres) suelen tener su propio usuario sin privilegios.</p>`},
 {t:"term", p:"Comprueba quién eres y a qué grupos perteneces", prompt:"pablo@servidor:~$",
  sol:["id"], pista:"Dos letras: identidad.",
  salida:`uid=1000(pablo) gid=1000(pablo) groups=1000(pablo),27(sudo),998(docker)`,
  why:"UID 1000 (el primer usuario humano suele ser el 1000), y pertenece a sudo (puede administrar) y a docker (puede usar Docker)."},
 {t:"info", eti:"Dónde se guardan", h:"/etc/passwd, /etc/shadow y /etc/group",
  c:`<div class="termbox">pablo:x:1000:1000:Pablo Ocampos:/home/pablo:/bin/bash
<span class="cm">^     ^ ^    ^    ^              ^           ^</span>
<span class="cm">nombre| UID  GID  descripcion    carpeta     shell</span>
<span class="cm">      +- "x": la contrasena NO esta aqui, esta en /etc/shadow</span></div>
     <ul><li><code>/etc/passwd</code> lo puede leer cualquiera.</li>
     <li><code>/etc/shadow</code> guarda los <b>hashes</b> de las contraseñas y solo lo lee root.</li>
     <li><code>/etc/group</code> lista los grupos y sus miembros.</li></ul>`},
 {t:"par", p:"Empareja cada fichero con su contenido",
  pares:[["/etc/passwd","Usuarios, UID, carpeta y shell"],["/etc/shadow","Hashes de las contraseñas"],["/etc/group","Grupos y sus miembros"],["/etc/sudoers","Quién puede usar sudo y cómo"]],
  why:"Nunca edites estos ficheros a mano salvo que sepas lo que haces: hay comandos para ello."},
 {t:"info", eti:"Gestionar", h:"Crear usuarios y grupos",
  c:`<div class="termbox">sudo adduser maria                  <span class="cm"># interactivo (Debian/Ubuntu)</span>
sudo useradd -m -s /bin/bash maria  <span class="cm"># bajo nivel, en todas las distros</span>
sudo passwd maria                   <span class="cm"># poner o cambiar contrasena</span>
sudo groupadd devs                  <span class="cm"># crear grupo</span>
sudo usermod -aG devs maria         <span class="cm"># ANADIR a un grupo secundario</span>
sudo userdel -r maria               <span class="cm"># borrar usuario y su carpeta</span>
sudo useradd --system --no-create-home mi-api   <span class="cm"># usuario de servicio</span></div>
     <div class="nota ojo"><b class="tit">La trampa de usermod</b><code>usermod -G devs maria</code> sin la <b>-a</b> <b>sustituye</b> todos sus grupos por «devs» y le quita, por ejemplo, sudo. Siempre <code>-aG</code>.</div>`},
 {t:"opcion", p:"Quieres añadir a maria al grupo <code>docker</code> sin quitarle sus otros grupos. ¿Qué ejecutas?",
  ops:["sudo usermod -G docker maria","sudo usermod -aG docker maria","sudo groupadd maria docker","sudo adduser docker"],
  ok:1, why:"-a de append. Y ojo: el cambio de grupos se aplica al volver a iniciar sesión."},
 {t:"vf", p:"Después de añadir tu usuario a un grupo, el cambio se aplica en la sesión actual sin hacer nada más.",
  ok:false, why:"Los grupos se leen al iniciar sesión. Hay que cerrar y volver a entrar (o usar newgrp docker). Por eso tras usermod -aG docker, docker sigue sin funcionar hasta reconectar."}
]},

{
id:"lx4l2",
titulo:"root y sudo",
claves:["No se trabaja como root: se usa sudo para cada tarea","sudo deja registro de quién hizo qué","visudo edita /etc/sudoers de forma segura"],
pasos:[
 {t:"info", eti:"El superusuario", h:"Por qué no se trabaja como root",
  c:`<p>Como root, cualquier error es total: un <code>rm</code> en el sitio equivocado borra el sistema. Además, si varias personas comparten la contraseña de root, no hay forma de saber quién hizo qué.</p>
     <p>La práctica profesional: cada persona entra con <b>su usuario</b> y usa <b>sudo</b> solo para lo que necesite privilegios.</p>
     <div class="termbox">sudo apt update             <span class="cm"># un comando como root</span>
sudo -u postgres psql       <span class="cm"># un comando como OTRO usuario</span>
sudo -i                     <span class="cm"># una shell de root (con moderacion)</span></div>`},
 {t:"opcion", p:"¿Qué ventaja tiene que cada persona use sudo con su propio usuario en lugar de compartir la contraseña de root?",
  ops:["Es más rápido","Queda registrado quién ejecutó cada comando y se pueden limitar permisos por persona","sudo no necesita contraseña","root no puede instalar programas"],
  ok:1, why:"Trazabilidad y control. Los usos de sudo quedan en /var/log/auth.log (o en el journal)."},
 {t:"info", eti:"Configurar", h:"/etc/sudoers y visudo",
  c:`<p>Quién puede usar sudo se define en <code>/etc/sudoers</code> y en los ficheros de <code>/etc/sudoers.d/</code>. Se edita <b>siempre</b> con:</p>
     <div class="termbox">sudo visudo</div>
     <p><code>visudo</code> comprueba la sintaxis antes de guardar. Un error en sudoers puede dejarte sin poder usar sudo nunca más.</p>
     <div class="termbox"><span class="cm"># todos los del grupo sudo pueden ejecutar cualquier cosa</span>
%sudo   ALL=(ALL:ALL) ALL
<span class="cm"># deploy puede reiniciar la api sin contrasena, y SOLO eso</span>
deploy  ALL=(root) NOPASSWD: /usr/bin/systemctl restart mi-api</div>`},
 {t:"opcion", p:"Tu pipeline de despliegue necesita reiniciar un servicio con sudo sin pedir contraseña. ¿Qué es lo correcto?",
  ops:["Darle NOPASSWD: ALL al usuario del pipeline","Una regla en sudoers que permita sin contraseña solo ese comando concreto","Hacer que el pipeline entre como root","Poner la contraseña en el script"],
  ok:1, why:"Mínimo privilegio: solo el comando exacto que necesita. Si alguien roba esa clave, no obtiene root completo."},
 {t:"vf", p:"Editar <code>/etc/sudoers</code> directamente con nano es tan seguro como usar visudo.",
  ok:false, why:"visudo valida la sintaxis. Un error guardado a mano puede romper sudo por completo."},
 {t:"escribe", p:"Escribe el comando que ejecuta <code>psql</code> como el usuario <code>postgres</code>",
  sol:["sudo -u postgres psql"], ph:"sudo ...", pista:"sudo con la opción de usuario.",
  why:"sudo -u postgres psql. Así se entra a PostgreSQL recién instalado."}
]},

{
id:"lx4l3",
titulo:"Leer y cambiar permisos",
claves:["r leer, w escribir, x ejecutar; para dueño, grupo y otros","En directorios, x significa poder entrar","chmod en modo simbólico (u+x) u octal (755)"],
pasos:[
 {t:"info", eti:"Las nueve letras", h:"rwx para tres tipos de persona",
  c:`<div class="termbox">-rwxr-x--- 1 pablo devs 812 sep 21 deploy.sh
 <span class="hi">rwx</span> <span class="hi">r-x</span> <span class="hi">---</span>
 <span class="cm">dueno grupo otros</span></div>
     <ul><li><b>r</b> (read): leer el contenido.</li>
     <li><b>w</b> (write): modificarlo.</li>
     <li><b>x</b> (execute): ejecutarlo como programa.</li></ul>
     <p>Aquí: pablo puede todo, los del grupo devs pueden leer y ejecutar, y el resto no puede nada.</p>`},
 {t:"info", eti:"Ojo con los directorios", h:"rwx no significa lo mismo en una carpeta",
  c:`<ul><li><b>r</b> en un directorio: listar su contenido (<code>ls</code>).</li>
     <li><b>w</b>: crear, borrar y renombrar ficheros <b>dentro</b>.</li>
     <li><b>x</b>: <b>entrar</b> en él (<code>cd</code>) y acceder a lo que contiene.</li></ul>
     <p>Consecuencia sorprendente: para borrar un fichero no necesitas permiso sobre el fichero, sino <b>w sobre el directorio</b> que lo contiene.</p>`},
 {t:"opcion", p:"Un usuario tiene <code>r</code> pero no <code>x</code> sobre un directorio. ¿Qué puede hacer?",
  ops:["Entrar y leer los ficheros","Ver los nombres de los ficheros pero no entrar ni abrirlos","Nada","Borrar ficheros"],
  ok:1, why:"r deja listar nombres; sin x no puede atravesar el directorio para acceder a su contenido."},
 {t:"info", eti:"Cambiar permisos", h:"chmod: simbólico y octal",
  c:`<p><b>Modo simbólico</b>: quién (u, g, o, a), qué operación (+, -, =) y qué permiso:</p>
     <div class="termbox">chmod u+x deploy.sh      <span class="cm"># dueno: anadir ejecucion</span>
chmod go-w config.yml    <span class="cm"># grupo y otros: quitar escritura</span>
chmod a=r publico.txt    <span class="cm"># todos: solo lectura</span></div>
     <p><b>Modo octal</b>: cada grupo de tres es un número que suma r=4, w=2, x=1:</p>
     <div class="termbox">chmod 755 script.sh   <span class="cm"># rwx r-x r-x  (7=4+2+1, 5=4+1)</span>
chmod 644 web.conf    <span class="cm"># rw- r-- r--</span>
chmod 600 id_ed25519  <span class="cm"># rw- --- ---  (claves privadas)</span>
chmod 700 ~/.ssh      <span class="cm"># rwx --- ---</span></div>`},
 {t:"par", p:"Empareja cada valor octal con sus permisos",
  pares:[["755","rwxr-xr-x"],["644","rw-r--r--"],["600","rw-------"],["700","rwx------"]],
  why:"755 para scripts y directorios públicos, 644 para ficheros normales, 600 para secretos, 700 para carpetas privadas."},
 {t:"opcion", p:"SSH se niega a usar tu clave privada con el error «permissions are too open». ¿Qué haces?",
  ops:["chmod 777 ~/.ssh/id_ed25519","chmod 600 ~/.ssh/id_ed25519","chmod 644 ~/.ssh/id_ed25519","Borrar la clave"],
  ok:1, why:"SSH exige que nadie más que tú pueda leer la clave privada. 600 es lo correcto."},
 {t:"term", p:"Haz ejecutable el script <code>deploy.sh</code> solo para su dueño", prompt:"pablo@servidor:~$",
  sol:["chmod u+x deploy.sh","chmod 744 deploy.sh","chmod 700 deploy.sh"], pista:"u (usuario dueño), +, x.",
  salida:``, why:"Ahora ./deploy.sh funciona. Sin la x, sale «Permission denied»."},
 {t:"vf", p:"<code>chmod 777</code> es una buena forma de arreglar cualquier problema de permisos.",
  ok:false, why:"Da escritura a cualquier usuario del sistema: un agujero de seguridad. Lo correcto es dar el permiso mínimo al usuario o grupo que lo necesita."}
]},

{
id:"lx4l4",
titulo:"Dueños y permisos por defecto",
claves:["chown cambia dueño y grupo; -R recursivo","umask define los permisos con que nacen los ficheros","Los servicios deben ser dueños solo de lo que necesitan"],
pasos:[
 {t:"info", eti:"Propiedad", h:"chown y chgrp",
  c:`<div class="termbox">sudo chown mi-api app.jar                 <span class="cm"># cambiar dueno</span>
sudo chown mi-api:mi-api /opt/mi-api       <span class="cm"># dueno y grupo</span>
sudo chown -R www-data:www-data /var/www   <span class="cm"># recursivo</span>
sudo chgrp devs informe.txt                <span class="cm"># solo el grupo</span></div>
     <p>Caso típico: tu aplicación corre como el usuario <code>mi-api</code> y no puede escribir sus logs porque la carpeta es de root. Solución: que la carpeta sea suya, no darle permisos a todo el mundo.</p>`},
 {t:"term", p:"Haz que el usuario y grupo <code>www-data</code> sean dueños de <code>/var/www</code> y todo su contenido",
  prompt:"pablo@servidor:~$", sol:["sudo chown -R www-data:www-data /var/www","sudo chown -r www-data:www-data /var/www","sudo chown www-data:www-data -R /var/www"],
  pista:"sudo, chown, recursivo, dueño:grupo y la ruta.",
  salida:``, why:"www-data es el usuario con el que corre nginx en Debian/Ubuntu."},
 {t:"info", eti:"Permisos de nacimiento", h:"umask",
  c:`<p>¿Con qué permisos nace un fichero nuevo? Con los máximos (666 ficheros, 777 directorios) <b>menos</b> la <b>umask</b>:</p>
     <div class="termbox">umask
<span class="cm">0022</span>
<span class="cm"># fichero nuevo:    666 - 022 = 644  (rw-r--r--)</span>
<span class="cm"># directorio nuevo: 777 - 022 = 755  (rwxr-xr-x)</span></div>
     <p>Con <code>umask 077</code>, lo que crees solo lo podrás leer tú: útil en servidores con datos sensibles.</p>`},
 {t:"opcion", p:"Con <code>umask 027</code>, ¿qué permisos tendrá un fichero nuevo?",
  ops:["640 (rw-r-----)","750","644","600"],
  ok:0, why:"666 menos 027 = 640: dueño lee y escribe, el grupo solo lee, el resto nada."},
 {t:"vf", p:"Los ficheros nuevos nacen con permiso de ejecución si la umask lo permite.",
  ok:false, why:"Los ficheros normales parten de 666: nunca nacen ejecutables. Hay que dárselo explícitamente con chmod +x."},
 {t:"escribe", p:"Escribe el comando que cambia solo el grupo de <code>informe.txt</code> a <code>devs</code>",
  sol:["chgrp devs informe.txt","sudo chgrp devs informe.txt","chown :devs informe.txt","sudo chown :devs informe.txt"], ph:"...",
  pista:"change group.", why:"chgrp devs informe.txt (o chown :devs informe.txt)."}
]},

{
id:"lx4l5",
titulo:"Permisos especiales y ACLs",
claves:["setuid: el programa se ejecuta con los permisos de su dueño","setgid en un directorio: lo creado dentro hereda el grupo","sticky bit: en /tmp solo el dueño puede borrar lo suyo; ACLs para permisos finos"],
pasos:[
 {t:"info", eti:"Nivel avanzado", h:"Tres bits especiales",
  c:`<ul><li><b>setuid</b> (<code>s</code> en el dueño, 4000): el programa se ejecuta con los permisos de <b>su dueño</b>, no de quien lo lanza. <code>passwd</code> lo usa para poder escribir en <code>/etc/shadow</code>.</li>
     <li><b>setgid</b> (2000): en un <b>directorio</b>, todo lo que se crea dentro <b>hereda su grupo</b>. Ideal para carpetas compartidas de equipo.</li>
     <li><b>sticky bit</b> (<code>t</code>, 1000): en un directorio compartido, cada usuario <b>solo puede borrar sus propios ficheros</b>. Es lo que tiene <code>/tmp</code>.</li></ul>
     <div class="termbox">ls -ld /tmp /usr/bin/passwd
<span class="cm">drwxrwxrwt  root root /tmp              &lt;- la t final: sticky
-rwsr-xr-x  root root /usr/bin/passwd   &lt;- la s: setuid</span></div>`},
 {t:"par", p:"Empareja cada bit especial con su efecto",
  pares:[["setuid","Ejecutar con los permisos del dueño del programa"],["setgid en directorio","Lo creado dentro hereda el grupo del directorio"],["sticky bit","Solo el dueño puede borrar sus ficheros en un directorio compartido"]],
  why:"Te lo pueden preguntar como «¿por qué cualquiera puede escribir en /tmp pero no borrar lo de otros?»"},
 {t:"opcion", p:"Tu equipo comparte <code>/srv/proyecto</code> y quieres que todo lo que se cree ahí pertenezca al grupo <code>devs</code>. ¿Qué aplicas?",
  ops:["chmod +t /srv/proyecto","chmod g+s /srv/proyecto","chmod u+s /srv/proyecto","chmod 777 /srv/proyecto"],
  ok:1, why:"setgid en el directorio. Con chgrp devs y chmod 2775 queda una carpeta colaborativa correcta."},
 {t:"info", eti:"Seguridad", h:"Por qué el setuid es peligroso",
  c:`<p>Un programa setuid de root con un fallo es una puerta a root para cualquier usuario. Una de las primeras cosas que revisa un auditor:</p>
     <div class="termbox">find / -perm -4000 -type f 2>/dev/null</div>
     <p>Lista todos los binarios setuid. Cualquiera inesperado es sospechoso.</p>`},
 {t:"info", eti:"Permisos finos", h:"ACLs: más allá de dueño, grupo y otros",
  c:`<p>¿Y si necesitas que <b>una persona concreta</b> lea un fichero sin cambiar su grupo? Las <b>ACLs</b> (listas de control de acceso) lo permiten:</p>
     <div class="termbox">setfacl -m u:maria:r informe.txt    <span class="cm"># maria puede leer</span>
setfacl -m g:auditores:rx /srv/logs
getfacl informe.txt                 <span class="cm"># ver las ACLs</span>
setfacl -x u:maria informe.txt      <span class="cm"># quitar</span></div>
     <p>Cuando un fichero tiene ACL, <code>ls -l</code> muestra un <code>+</code> al final de los permisos: <code>-rw-r--r--+</code>.</p>`},
 {t:"vf", p:"Un <code>+</code> al final de los permisos en <code>ls -l</code> indica que el fichero tiene ACLs.",
  ok:true, why:"Y entonces los permisos que ves no cuentan toda la historia: getfacl muestra el resto."},
 {t:"escribe", p:"Escribe el comando que busca todos los ficheros con setuid en el sistema, ocultando los errores",
  sol:["find / -perm -4000 -type f 2>/dev/null","find / -type f -perm -4000 2>/dev/null","sudo find / -perm -4000 -type f 2>/dev/null","find / -perm -u=s -type f 2>/dev/null"], ph:"find / ...",
  pista:"find desde la raíz, -perm -4000, solo ficheros, y los errores a /dev/null.",
  why:"Es una comprobación estándar de auditoría. 2>/dev/null descarta los «Permission denied» (lo verás en la unidad siguiente)."}
]}

]});
