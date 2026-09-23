window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Antes de Jenkins: el problema y las ideas",
resumen: "Qué es un repositorio, compilar y probar, y por qué existen la integración continua, la entrega continua y los pipelines",
nivel: "Fundamentos",
color: "#d24939",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"jn1l1",
titulo:"Cómo trabaja un equipo de desarrollo",
claves:["El código del equipo vive en un repositorio (por ejemplo, en GitHub)","Un commit es un cambio guardado; un push lo sube al repositorio compartido","Antes de publicar un programa hay que compilarlo y probarlo"],
pasos:[
 {t:"info", eti:"Empezamos", h:"Antes de hablar de Jenkins",
  c:`<p>Jenkins es una herramienta que <b>automatiza el trabajo repetitivo</b> de un equipo de programación. Para entender qué automatiza, primero hay que ver cómo trabaja ese equipo. Vamos despacio: en esta lección no hay nada de Jenkins todavía.</p>
     <p>Imagina un equipo de cuatro personas que hace una API en Java con Spring Boot, como la que tú programarías.</p>`},
 {t:"info", eti:"Concepto 1", h:"El repositorio: el código de todos, en un sitio",
  c:`<p>El código del equipo no vive en el portátil de nadie en concreto: vive en un <b>repositorio</b>, que es una carpeta compartida con historial, gestionada con <b>Git</b> y normalmente alojada en <b>GitHub</b> o GitLab.</p>
     <ul><li>Cuando alguien termina un cambio, lo guarda con un <b>commit</b> (una «foto» del código con un mensaje).</li>
     <li>Después lo sube al repositorio compartido con un <b>push</b>.</li>
     <li>El resto del equipo descarga esos cambios con un <b>pull</b>.</li></ul>
     <div class="nota"><b class="tit">La analogía</b>El repositorio es como un documento compartido en la nube, pero para código y con un historial de cada cambio: quién lo hizo, cuándo y por qué.</div>`},
 {t:"opcion", p:"¿Dónde vive el código de un equipo de desarrollo?",
  ops:["En el portátil del jefe del equipo","En un repositorio compartido, gestionado con Git (por ejemplo en GitHub)","En un correo que se reenvían","En un pendrive"],
  ok:1, why:"El repositorio es la fuente de verdad: todo el equipo sube y baja cambios de ahí."},
 {t:"par", p:"Empareja cada palabra con su significado",
  pares:[["Repositorio","Carpeta compartida con el código y su historial"],["Commit","Un cambio guardado con un mensaje"],["Push","Subir tus commits al repositorio compartido"],["Pull","Descargar los cambios de los demás"]],
  why:"Son las cuatro palabras de Git que más vas a oír junto a Jenkins."},
 {t:"info", eti:"Concepto 2", h:"Compilar y probar",
  c:`<p>Antes de que un programa en Java pueda publicarse hay dos tareas que se repiten siempre:</p>
     <ul><li><b>Compilar</b>: convertir el código que escribimos (ficheros <code>.java</code>) en algo que la máquina puede ejecutar. En Java, el resultado final suele ser un fichero <code>.jar</code>.</li>
     <li><b>Probar</b>: ejecutar las <b>pruebas automáticas</b> (tests), que son pequeños programas que comprueban que el código hace lo que debe. Por ejemplo: «si pido la tarea 7, me devuelve la tarea 7».</li></ul>
     <p>En Java, las dos cosas las hace una herramienta llamada <b>Maven</b> con un solo comando: <code>./mvnw package</code>.</p>`},
 {t:"vf", p:"Compilar significa ejecutar las pruebas automáticas del programa.",
  ok:false, why:"Compilar es convertir el código fuente en algo ejecutable (en Java, un .jar). Probar es ejecutar los tests."},
 {t:"opcion", p:"¿Para qué sirven las pruebas automáticas (tests)?",
  ops:["Para que el programa vaya más rápido","Para comprobar, sin hacerlo a mano, que el código sigue haciendo lo que debe","Para subir el código a GitHub","Para compilar el programa"],
  ok:1, why:"Un test es código que comprueba otro código. Se pueden ejecutar cientos en segundos."},
 {t:"info", eti:"El problema", h:"Lo que pasa si nadie automatiza",
  c:`<p>Sin automatización, cada persona compila y prueba «cuando se acuerda», en su propio ordenador. Resultado:</p>
     <ul><li>Alguien sube código que <b>no compila</b> y el resto no puede trabajar hasta que se arregla.</li>
     <li>Alguien olvida pasar las pruebas y un error llega a los usuarios.</li>
     <li>Cuando por fin se juntan los cambios de todos, aparecen conflictos que nadie sabe de quién son.</li></ul>
     <p>Hacer esas tareas a mano es lento, aburrido y fácil de olvidar. Justo el tipo de trabajo que conviene que haga <b>una máquina, siempre igual</b>. Ahí entra Jenkins.</p>`},
 {t:"opcion", p:"¿Qué tipo de trabajo quiere quitar Jenkins a las personas?",
  ops:["Escribir el código de la aplicación","Las tareas repetitivas como compilar, probar y publicar cada cambio","Hablar con los clientes","Diseñar la base de datos"],
  ok:1, why:"Jenkins no programa por ti: repite, siempre igual y sin olvidarse, las tareas que hay que hacer con cada cambio."}
]},

/* =============== U1 L2 =============== */
{
id:"jn1l2",
titulo:"Integración continua (CI)",
claves:["Integrar = juntar tu cambio con el código de los demás","Integración continua: con cada push, una máquina descarga el código, lo compila y pasa las pruebas","Si algo falla, el equipo se entera en minutos y sabe qué cambio lo rompió"],
pasos:[
 {t:"info", eti:"La palabra clave", h:"Qué significa «integrar»",
  c:`<p><b>Integrar</b> es juntar tu cambio con el código de todos los demás en el repositorio. Cuando haces push, estás integrando.</p>
     <p>El peligro es que tu cambio funcione solo, pero <b>rompa algo al juntarse</b> con el de otra persona. Por ejemplo, tú cambias el nombre de un método y tu compañera, el mismo día, añade código que usa el nombre antiguo. Cada uno por separado funciona; juntos, no compila.</p>`},
 {t:"vf", p:"Un cambio que funciona en tu ordenador puede romper el programa al juntarlo con los cambios de otra persona.",
  ok:true, why:"Por eso no basta con probar en tu máquina: hay que comprobar el código ya integrado."},
 {t:"info", eti:"La idea", h:"Integración continua",
  c:`<p>La <b>integración continua</b> (en inglés <b>Continuous Integration</b>, CI) consiste en dos hábitos:</p>
     <ol><li>Integrar <b>a menudo</b>: varias veces al día, cambios pequeños.</li>
     <li>Que <b>cada integración se compruebe sola</b>: con cada push, una máquina descarga el código, lo compila y pasa todas las pruebas.</li></ol>
     <div class="dg"><div class="dg-tit">integración continua</div>
<div class="dg-flujo" style="row-gap:8px">
<div class="dg-caja acento">tú haces push</div>
<div class="dg-caja">la máquina descarga el código</div>
<div class="dg-caja">compila</div>
<div class="dg-caja">pasa las pruebas</div>
<div class="dg-caja ok">✔ o ✘ en minutos</div>
</div></div>
     <p>Esa «máquina» que lo hace todo sola es un <b>servidor de integración continua</b>. Jenkins es el más conocido.</p>`},
 {t:"orden", p:"Ordena lo que ocurre en integración continua cuando alguien sube un cambio",
  items:["Una persona hace push de su cambio","El servidor de CI descarga el código del repositorio","Lo compila","Pasa las pruebas automáticas","Avisa al equipo del resultado"],
  why:"Todo sin intervención humana, en unos minutos."},
 {t:"info", eti:"Vocabulario", h:"Build: cada ejecución",
  c:`<p>Cada vez que el servidor de CI hace ese trabajo (descargar, compilar, probar) se llama un <b>build</b> (se pronuncia «bild»; significa «construcción»).</p>
     <ul><li>Si todo va bien, el build está <b>en verde</b> (correcto).</li>
     <li>Si algo falla, el build está <b>en rojo</b> (roto) y hay que arreglarlo antes de seguir.</li></ul>
     <p>Los builds se numeran: #1, #2, #3… Así puedes decir «el build #48 se rompió con el cambio de Lucía».</p>`},
 {t:"opcion", p:"¿Qué es un build?",
  ops:["Un tipo de servidor","Cada ejecución automática del proceso: descargar el código, compilarlo y probarlo","El código fuente de la aplicación","Un plugin de Jenkins"],
  ok:1, why:"Un build es una ejecución concreta, con su número y su resultado (verde o rojo)."},
 {t:"opcion", p:"El build #48 está en rojo justo después de que Lucía subiera un cambio. ¿Qué te dice eso?",
  ops:["Que el servidor está roto","Que el cambio de Lucía (o su combinación con el código existente) rompió la compilación o alguna prueba","Que hay que reinstalar Jenkins","Nada útil"],
  ok:1, why:"Esa es la gran ventaja de la CI: saber enseguida qué cambio rompió qué, cuando aún es fácil arreglarlo."},
 {t:"par", p:"Empareja cada término con su significado",
  pares:[["Integrar","Juntar tu cambio con el código de los demás"],["Integración continua (CI)","Comprobar automáticamente cada cambio integrado"],["Build","Una ejecución de ese proceso automático"],["Build en rojo","Algo falló: no compila o una prueba no pasa"]],
  why:"Con estas cuatro ideas ya entiendes para qué sirve Jenkins."}
]},

/* =============== U1 L3 =============== */
{
id:"jn1l3",
titulo:"Entrega y despliegue continuos (CD)",
claves:["Un artefacto es el resultado listo para instalar (un .jar o una imagen Docker)","Los entornos típicos son desarrollo, staging (pruebas) y producción (usuarios reales)","Entrega continua: siempre listo para desplegar con un clic; despliegue continuo: se despliega solo"],
pasos:[
 {t:"info", eti:"Después de probar", h:"El artefacto",
  c:`<p>Cuando el build pasa las pruebas, queda un resultado listo para instalar: en Java, un fichero <code>.jar</code>; si usas Docker, una <b>imagen</b>. A ese resultado se le llama <b>artefacto</b>.</p>
     <div class="nota"><b class="tit">La analogía</b>En una panadería, el código es la receta y el artefacto es el pan ya horneado, listo para llevar a la tienda.</div>`},
 {t:"opcion", p:"¿Qué es un artefacto?",
  ops:["Un error en el código","El resultado del build listo para instalar, como un .jar o una imagen Docker","Un tipo de prueba","Un comando de Git"],
  ok:1, why:"El artefacto es lo que se instala después en los servidores."},
 {t:"info", eti:"Dónde se instala", h:"Los entornos",
  c:`<p>Un artefacto no va directo a los usuarios. Normalmente pasa por varios <b>entornos</b>, que son copias de la aplicación en servidores distintos:</p>
     <ul><li><b>Desarrollo</b>: donde los programadores prueban cosas a medias.</li>
     <li><b>Staging</b> (o preproducción): una copia lo más parecida posible a la real, para comprobarlo todo antes.</li>
     <li><b>Producción</b>: la aplicación de verdad, la que usan los clientes.</li></ul>
     <p><b>Desplegar</b> es instalar una versión del artefacto en un entorno.</p>`},
 {t:"par", p:"Empareja cada entorno con su propósito",
  pares:[["Desarrollo","Probar cambios a medias del equipo"],["Staging","Comprobar todo en una copia casi idéntica a la real"],["Producción","La aplicación que usan los clientes"],["Desplegar","Instalar una versión en un entorno"]],
  why:"Un error en staging es un susto; en producción, un problema para los clientes."},
 {t:"info", eti:"La idea", h:"Entrega continua y despliegue continuo",
  c:`<p>La <b>entrega continua</b> (<b>Continuous Delivery</b>, CD) lleva la CI un paso más allá: cada cambio que pasa las pruebas genera un artefacto y lo deja <b>listo para desplegar en producción con un solo clic</b>. La decisión de publicarlo la toma una persona.</p>
     <p>El <b>despliegue continuo</b> (<b>Continuous Deployment</b>, también CD) va aún más lejos: si todo está en verde, <b>se despliega en producción solo</b>, sin que nadie pulse nada.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">hasta dónde llega cada práctica</div><table class="dg-tabla"><thead><tr><th></th><th>compilar</th><th>probar</th><th>artefacto</th><th>staging</th><th>producción</th></tr></thead><tbody>
<tr><td>CI</td><td>✔</td><td>✔</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>Entrega continua</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td><td><b>una persona decide</b></td></tr>
<tr><td>Despliegue continuo</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td><td><b style="color:var(--ok)">automático</b></td></tr>
</tbody></table></div>`},
 {t:"vf", p:"En la entrega continua, el paso final a producción lo decide una persona.",
  ok:true, why:"Todo está listo y automatizado, pero alguien pulsa el botón. En el despliegue continuo ni eso."},
 {t:"opcion", p:"En tu empresa, cada cambio aprobado llega a los clientes sin que nadie pulse nada. ¿Qué practican?",
  ops:["Solo integración continua","Despliegue continuo","Entrega manual","Ninguna práctica"],
  ok:1, why:"Si el paso a producción es automático, es despliegue continuo."},
 {t:"opcion", p:"En una entrevista te preguntan la diferencia entre entrega continua y despliegue continuo. ¿Qué respondes?",
  ops:["Son lo mismo","En los dos se automatiza todo hasta dejar el artefacto listo; en la entrega continua una persona decide el paso a producción y en el despliegue continuo ocurre solo","La entrega continua no tiene pruebas","El despliegue continuo no usa servidores"],
  ok:1, why:"Es una de las preguntas más frecuentes sobre CI/CD. Apréndela con tus palabras."}
]},

/* =============== U1 L4 =============== */
{
id:"jn1l4",
titulo:"Qué es un pipeline",
claves:["Un pipeline es la cadena de pasos automáticos que recorre cada cambio","Se divide en etapas (stages): compilar, probar, empaquetar, desplegar","Si una etapa falla, las siguientes no se ejecutan"],
pasos:[
 {t:"info", eti:"La palabra", h:"Pipeline = tubería",
  c:`<p><b>Pipeline</b> significa «tubería». En CI/CD es la <b>cadena de pasos automáticos</b> que recorre cada cambio desde que se sube hasta que está listo (o desplegado).</p>
     <div class="dg"><div class="dg-tit">un pipeline típico</div>
<div class="dg-flujo" style="row-gap:8px">
<div class="dg-caja">Descargar</div><div class="dg-caja">Compilar</div><div class="dg-caja">Probar</div><div class="dg-caja">Empaquetar</div><div class="dg-caja ok">Desplegar en staging</div>
</div></div>
     <p>Cada caja es una <b>etapa</b> (en inglés, <b>stage</b>). Cada etapa tiene uno o varios <b>pasos</b> (steps), que son los comandos concretos.</p>
     <div class="nota"><b class="tit">La analogía</b>Una cadena de montaje de coches: el chasis pasa por la estación de motor, luego por la de pintura, luego por la de control de calidad. Si falla el control de calidad, el coche no sale de la fábrica.</div>`},
 {t:"par", p:"Empareja cada término con su significado",
  pares:[["Pipeline","La cadena completa de pasos automáticos"],["Etapa (stage)","Cada fase del pipeline, como «Probar»"],["Paso (step)","Un comando concreto dentro de una etapa"]],
  why:"pipeline → etapas → pasos: esa es la jerarquía que verás en Jenkins."},
 {t:"orden", p:"Ordena las etapas de un pipeline típico de una API Java",
  items:["Descargar el código del repositorio","Compilar","Pasar las pruebas","Empaquetar (crear el .jar o la imagen)","Desplegar en staging"],
  why:"No tiene sentido empaquetar algo que no pasa las pruebas, por eso las pruebas van antes."},
 {t:"info", eti:"Regla importante", h:"Si una etapa falla, el pipeline se detiene",
  c:`<p>Las etapas se ejecutan en orden y cada una depende de la anterior. Si la etapa <b>Probar</b> falla, el pipeline se detiene: <b>no se empaqueta ni se despliega</b> nada. Así un error nunca llega más lejos de donde se detectó.</p>
     <div class="dg"><div class="dg-tit">si falla una etapa</div>
<div class="dg-flujo" style="row-gap:8px">
<div class="dg-caja ok">Compilar ✔</div><div class="dg-caja aviso">Probar ✘</div><div class="dg-caja base">Empaquetar —</div><div class="dg-caja base">Desplegar —</div>
</div>
<div class="dg-nota arriba" style="margin-top:8px">las dos últimas no se ejecutan</div></div>`},
 {t:"opcion", p:"En un pipeline, la etapa «Probar» falla. ¿Qué pasa con la etapa «Desplegar»?",
  ops:["Se ejecuta igualmente","No se ejecuta: el pipeline se detiene en la etapa que falló","Se ejecuta dos veces","Se salta solo la de empaquetar"],
  ok:1, why:"Es el mecanismo de seguridad del pipeline: lo que no pasa las pruebas no se despliega."},
 {t:"vf", p:"Un pipeline es lo mismo que un build.",
  ok:false, why:"El pipeline es la definición (la cadena de pasos); cada vez que se ejecuta se produce un build."},
 {t:"opcion", p:"Ya conoces CI, CD y pipeline. ¿Cuál es el papel de Jenkins?",
  ops:["Escribir las pruebas","Ejecutar pipelines automáticamente con cada cambio: descargar, compilar, probar, empaquetar y desplegar","Guardar el código como GitHub","Sustituir a Maven"],
  ok:1, why:"Jenkins es el motor que ejecuta tus pipelines. En la siguiente lección lo vemos de cerca."}
]},

/* =============== U1 L5 =============== */
{
id:"jn1l5",
titulo:"Qué es Jenkins",
claves:["Jenkins es un servidor de automatización de código abierto y gratuito, escrito en Java","Tú lo instalas y lo mantienes (autoalojado); funciona en tu red","Se amplía con miles de plugins; alternativas: GitHub Actions, GitLab CI"],
pasos:[
 {t:"info", eti:"Por fin", h:"Jenkins en una frase",
  c:`<p><b>Jenkins</b> es un <b>servidor de automatización</b>: un programa que está siempre encendido, esperando a que ocurra algo (por ejemplo, un push) para ejecutar el pipeline que le hayas indicado.</p>
     <ul><li>Es de <b>código abierto</b> y <b>gratuito</b>.</li>
     <li>Está escrito en <b>Java</b>, así que necesita Java para funcionar (en Docker ya viene incluido).</li>
     <li>Lo <b>instalas tú</b> en un servidor de tu empresa (se dice que es <b>autoalojado</b>), así que puede llegar a tus redes internas.</li>
     <li>Tiene miles de <b>plugins</b> para conectarse con casi cualquier herramienta: GitHub, Docker, Kubernetes, Slack…</li></ul>`},
 {t:"opcion", p:"¿Qué es Jenkins?",
  ops:["Un lenguaje de programación","Un servidor de automatización que ejecuta pipelines cuando ocurre algo, como un push","Una base de datos","Un editor de código"],
  ok:1, why:"Jenkins espera eventos y ejecuta los pasos que le hayas definido."},
 {t:"vf", p:"Jenkins es un servicio de pago que solo funciona en la nube de una empresa.",
  ok:false, why:"Es gratuito, de código abierto y lo instalas donde quieras: tu portátil, un servidor o un clúster."},
 {t:"info", eti:"Contexto", h:"Jenkins y las alternativas",
  c:`<p>Jenkins no es la única herramienta de CI/CD. Las más habituales:</p>
     <ul><li><b>GitHub Actions</b>: integrada en GitHub; los pipelines se escriben en ficheros YAML dentro del repositorio.</li>
     <li><b>GitLab CI</b>: lo mismo, integrado en GitLab.</li>
     <li><b>Jenkins</b>: la más veterana y flexible; muy usada en empresas grandes y en bancos, sobre todo con Java.</li></ul>
     <p>La diferencia principal: GitHub Actions y GitLab CI te dan las máquinas ya gestionadas; con Jenkins <b>tú mantienes el servidor</b> (a cambio, puedes hacer casi cualquier cosa).</p>`},
 {t:"par", p:"Empareja cada herramienta con su característica",
  pares:[["Jenkins","Lo instalas y mantienes tú; muy flexible con plugins"],["GitHub Actions","Integrada en GitHub, con máquinas gestionadas"],["GitLab CI","Integrada en GitLab"]],
  why:"En una entrevista es bueno saber situar Jenkins frente a las alternativas."},
 {t:"opcion", p:"¿Cuál es el principal «precio» de usar Jenkins frente a GitHub Actions?",
  ops:["Que es de pago","Que tienes que instalarlo, actualizarlo y mantenerlo tú","Que no funciona con Java","Que no tiene plugins"],
  ok:1, why:"La flexibilidad de Jenkins viene con el trabajo de mantenerlo. Lo verás en la unidad de operación."},
 {t:"info", eti:"Lo que viene", h:"El mapa del curso",
  c:`<p>Ya tienes las ideas de base. A partir de aquí:</p>
     <ol><li>Cómo funciona Jenkins por dentro.</li><li>Instalarlo con Docker y conocer su interfaz.</li><li>Tu primer job.</li>
     <li>Pipelines escritos como código (Jenkinsfile).</li><li>El pipeline completo de una API Spring Boot.</li>
     <li>Agentes, paralelismo, seguridad, operación y simulacro de entrevista.</li></ol>`},
 {t:"opcion", p:"Resumen de la unidad: ¿qué hace Jenkins cuando alguien sube un cambio al repositorio?",
  ops:["Nada, hay que avisarle por correo","Ejecuta el pipeline: descarga el código, lo compila, pasa las pruebas y, si todo va bien, sigue con las siguientes etapas","Borra el cambio si tiene errores","Escribe las pruebas que faltan"],
  ok:1, why:"Con esto ya sabes para qué sirve Jenkins. Ahora vamos a ver cómo lo hace."}
]}

]});
