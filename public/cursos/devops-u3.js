window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "CI/CD",
resumen: "Pipelines, GitHub Actions a fondo, secretos, caché y estrategias de despliegue",
nivel: "Intermedio",
color: "#f5b642",
lecciones: [

/* =============== O3 L1 =============== */
{
id:"o3l1",
titulo:"CI, CD y CD: tres ideas distintas",
claves:["CI: integrar a menudo y validar cada cambio automáticamente","Continuous Delivery: siempre listo para desplegar, con un botón","Continuous Deployment: se despliega solo si pasa todo"],
pasos:[
 {t:"info", eti:"Integración continua", h:"CI: nunca más «funcionaba en mi rama»",
  c:`<p>Sin CI, cada persona trabaja días en su rama y al final se integra todo de golpe: conflictos, cosas que no compilan, tests que nadie había ejecutado.</p>
     <p>La <b>integración continua</b> consiste en:</p>
     <ul><li>integrar en la rama principal <b>a menudo</b> (al menos a diario),</li>
     <li>y que <b>cada push</b> dispare automáticamente la compilación y los tests.</li></ul>
     <p>Si algo se rompe, se sabe en minutos y se sabe qué cambio fue.</p>`},

 {t:"info", eti:"Entrega y despliegue", h:"Las dos CD",
  c:`<div class="diag">CI                  -> build + tests en cada push
Continuous DELIVERY -> + el artefacto queda listo para produccion
                       (el paso final es un BOTON manual)
Continuous DEPLOYMENT -> + sin boton: si todo pasa, se despliega solo</div>
     <p>La mayoría de empresas hacen <b>entrega continua</b>: todo automatizado hasta producción, con una aprobación humana al final. Las más maduras, <b>despliegue continuo</b>.</p>`},

 {t:"par", p:"Empareja cada práctica con su definición",
  pares:[["Integración continua","Cada push se compila y se prueba automáticamente"],
         ["Entrega continua","El software está siempre listo; producción es un botón"],
         ["Despliegue continuo","Todo lo que pasa los tests llega solo a producción"]],
  why:"Pregunta de entrevista muy frecuente. Fíjate en que cada una incluye a la anterior."},

 {t:"opcion", p:"Tu pipeline construye, prueba y deja la imagen lista, y alguien pulsa «Aprobar» para que llegue a producción. ¿Qué practicas?",
  ops:["Solo CI","Entrega continua (Continuous Delivery)","Despliegue continuo","Ninguna"],
  ok:1,
  why:"Hay un paso manual final: entrega continua."},

 {t:"info", eti:"El requisito", h:"Sin tests, no hay CD",
  c:`<p>Desplegar automáticamente solo tiene sentido si confías en lo que despliegas. Eso exige <b>tests automáticos</b>: unitarios (rápidos, muchos), de integración (con base de datos real, por ejemplo con Testcontainers) y algunos de extremo a extremo.</p>
     <div class="nota dato"><b class="tit">La pirámide de tests</b>Muchos unitarios en la base, menos de integración en el medio y pocos end-to-end arriba. Los de arriba son lentos y frágiles; los de abajo, rápidos y baratos.</div>`},

 {t:"vf", p:"Se puede hacer despliegue continuo sin tests automáticos si el equipo es cuidadoso.",
  ok:false,
  why:"Sin tests, «despliegue continuo» es «romper producción de forma continua». Los tests son lo que da la confianza."}
]},

/* =============== O3 L2 =============== */
{
id:"o3l2",
titulo:"Anatomía de un pipeline",
claves:["Un pipeline se divide en etapas; cada etapa en jobs; cada job en pasos","Los runners son las máquinas que ejecutan los jobs","Los artefactos pasan resultados de una etapa a otra"],
pasos:[
 {t:"info", eti:"Vocabulario", h:"Las piezas de todo pipeline",
  c:`<p>Da igual la herramienta (GitHub Actions, GitLab CI, Jenkins, Azure Pipelines): todas comparten estos conceptos:</p>
     <ul><li><b>Disparador</b> (trigger): qué lo arranca. Un push, un PR, un tag, un horario.</li>
     <li><b>Etapas</b> (stages): fases en orden: build → test → deploy.</li>
     <li><b>Jobs</b>: unidades de trabajo. Los de la misma etapa pueden ir <b>en paralelo</b>.</li>
     <li><b>Pasos</b> (steps): los comandos concretos de un job.</li>
     <li><b>Runner</b> (o agente): la máquina que ejecuta el job.</li>
     <li><b>Artefacto</b>: un resultado que se guarda para usarlo después (un jar, un informe de tests).</li></ul>`},

 {t:"info", eti:"Dibujado", h:"Un pipeline típico",
  c:`<div class="diag">push a main
    |
[ build ]  compilar, empaquetar ---> artefacto: app.jar
    |
[ test  ]  unit   |  integracion  |  analisis estatico   (en paralelo)
    |
[ imagen ] docker build + escaneo + push al registry
    |
[ deploy staging ] -> smoke tests
    |
[ deploy produccion ] (aprobacion manual)</div>
     <p>Si <b>cualquier</b> paso falla (código de salida distinto de 0), el pipeline se para ahí y avisa.</p>`},

 {t:"orden", p:"Ordena las etapas de un pipeline típico",
  items:["Build (compilar y empaquetar)","Test (unitarios e integración)","Construir y escanear la imagen","Publicar la imagen en el registry","Desplegar en staging y probar","Desplegar en producción"],
  why:"De lo más barato y rápido a lo más caro y arriesgado. Si algo falla, que falle cuanto antes."},

 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Trigger","El evento que arranca el pipeline"],
         ["Job","Una unidad de trabajo que corre en un runner"],
         ["Runner","La máquina que ejecuta los jobs"],
         ["Artefacto","Un resultado guardado para usarlo en otra etapa"]],
  why:"Con este vocabulario puedes leer un pipeline de cualquier herramienta."},

 {t:"opcion", p:"¿Cómo sabe el pipeline que un paso ha fallado?",
  ops:["Porque alguien lo revisa",
       "Por el código de salida del comando: distinto de 0 significa fallo",
       "Por el tiempo que tarda",
       "Por el color de la terminal"],
  ok:1,
  why:"El mismo concepto que en bash y en Docker. Por eso tus scripts deben terminar con exit 1 cuando algo va mal."},

 {t:"info", eti:"Principio", h:"Fallar rápido",
  c:`<p>Ordena las comprobaciones para que <b>lo que más falla y menos cuesta vaya primero</b>: formato y análisis estático en segundos, tests unitarios en un minuto, y lo lento (integración, e2e, construir imágenes) después. Nadie quiere esperar 15 minutos para enterarse de que falta un punto y coma.</p>`},

 {t:"vf", p:"Los jobs de una misma etapa pueden ejecutarse en paralelo.",
  ok:true,
  why:"Sí, y es la forma habitual de acortar el pipeline: tests unitarios, lint y escaneo a la vez."}
]},

/* =============== O3 L3 =============== */
{
id:"o3l3",
titulo:"GitHub Actions por dentro",
claves:["Workflows en .github/workflows/*.yml","on: disparadores; jobs: trabajos; runs-on: el runner; steps: pasos","uses: reutiliza una action; run: ejecuta un comando"],
pasos:[
 {t:"info", eti:"Dónde vive", h:"Un fichero YAML en tu repositorio",
  c:`<p>Los pipelines de GitHub se llaman <b>workflows</b> y se escriben en YAML dentro de <code>.github/workflows/</code>. Aquí es donde se juntan lo que sabes de YAML, Git y Docker.</p>
     <div class="termbox">name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: "21"
          distribution: temurin
          cache: maven
      - run: mvn -B test</div>`},

 {t:"info", eti:"Línea a línea", h:"Las claves del workflow",
  c:`<ul><li><b>on</b>: cuándo se ejecuta. Aquí: en cada push a main y en cada Pull Request.</li>
     <li><b>jobs</b>: los trabajos. Aquí hay uno, llamado <code>test</code>.</li>
     <li><b>runs-on</b>: en qué runner. <code>ubuntu-latest</code> es una máquina virtual limpia que GitHub te presta.</li>
     <li><b>steps</b>: los pasos, en orden.</li>
     <li><b>uses</b>: usa una <b>action</b> ya hecha (código reutilizable del marketplace). <code>actions/checkout</code> descarga tu repositorio; sin ella, el runner está vacío.</li>
     <li><b>with</b>: parámetros de esa action.</li>
     <li><b>run</b>: ejecuta un comando de shell.</li></ul>`},

 {t:"par", p:"Empareja cada clave del workflow con su función",
  pares:[["on","Qué eventos disparan el workflow"],
         ["runs-on","En qué tipo de máquina se ejecuta el job"],
         ["uses","Reutilizar una action ya hecha"],
         ["run","Ejecutar un comando de shell"],
         ["with","Pasar parámetros a una action"]],
  why:"Con estas cinco claves lees el 90% de los workflows de GitHub."},

 {t:"opcion", p:"Un workflow falla con «pom.xml not found» en el paso de Maven. ¿Qué le falta casi seguro?",
  ops:["Instalar Java","El paso uses: actions/checkout para descargar el código del repositorio","Un runner más grande","Permisos de administrador"],
  ok:1,
  why:"El runner empieza vacío. Sin checkout no hay código. Es el primer paso de casi todo workflow."},

 {t:"hueco", p:"Completa el paso que descarga el código del repositorio",
  tpl:"steps:\n  - ___: actions/___@v4",
  banco:["uses","checkout","run","setup-java"],
  sol:["uses","checkout"],
  why:"uses: actions/checkout@v4. Primer paso de prácticamente todos los workflows."},

 {t:"info", eti:"Varios jobs", h:"Dependencias entre jobs con needs",
  c:`<div class="termbox">jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]
  imagen:
    <b>needs: test</b>                  <span class="cm"># solo si test ha pasado</span>
    runs-on: ubuntu-latest
    steps: [...]
  deploy:
    <b>needs: imagen</b>
    <b>if: github.ref == 'refs/heads/main'</b>   <span class="cm"># solo en main, no en los PR</span>
    runs-on: ubuntu-latest
    steps: [...]</div>
     <p>Sin <code>needs</code>, los jobs se ejecutan <b>en paralelo</b>. Con <code>needs</code>, en cadena. Y <code>if</code> permite condicionar (por ejemplo, que los PR no desplieguen).</p>`},

 {t:"vf", p:"En GitHub Actions, los jobs se ejecutan en orden por defecto, uno detrás de otro.",
  ok:false,
  why:"Por defecto van en paralelo. El orden se declara con needs."},

 {t:"escribe", p:"¿En qué carpeta del repositorio van los workflows de GitHub Actions? Escribe la ruta",
  sol:[".github/workflows",".github/workflows/"],
  ph:".github/...",
  pista:"Una carpeta oculta con el nombre de la plataforma, y dentro otra con el plural de workflow.",
  why:".github/workflows/. Cualquier .yml ahí dentro es un workflow."}
]},

/* =============== O3 L4 =============== */
{
id:"o3l4",
titulo:"Secretos, variables y entornos",
claves:["Los secretos se guardan cifrados en el repositorio y se usan como ${{ secrets.NOMBRE }}","GitHub los enmascara en los logs","Environments: reglas de aprobación por entorno"],
pasos:[
 {t:"info", eti:"El problema", h:"El pipeline necesita credenciales",
  c:`<p>Para publicar una imagen o desplegar por SSH, el pipeline necesita contraseñas, tokens o claves. <b>Nunca</b> van escritas en el YAML (está en el repositorio, lo ve todo el mundo).</p>
     <p>Se guardan como <b>secretos</b> en GitHub › Settings › Secrets and variables › Actions, y se usan así:</p>
     <div class="termbox">- uses: appleboy/ssh-action@v1
  with:
    host: \${{ secrets.SSH_HOST }}
    username: \${{ secrets.SSH_USER }}
    key: \${{ secrets.SSH_KEY }}</div>
     <p>GitHub los guarda cifrados, <b>no se pueden volver a leer</b> desde la web una vez guardados, y si aparecen en un log los sustituye por <code>***</code>.</p>`},

 {t:"opcion", p:"¿Dónde pones la clave SSH que usa el pipeline para desplegar?",
  ops:["En el workflow YAML",
       "En un fichero del repositorio",
       "En los secretos del repositorio (o del entorno) en GitHub, y se referencia con ${{ secrets.NOMBRE }}",
       "En el README"],
  ok:2,
  why:"Cifrados, fuera del código, y enmascarados en los logs."},

 {t:"info", eti:"El token automático", h:"GITHUB_TOKEN",
  c:`<p>En cada ejecución GitHub crea un token temporal, <code>secrets.GITHUB_TOKEN</code>, con permisos sobre el propio repositorio. Sirve, por ejemplo, para publicar imágenes en GitHub Container Registry sin crear ningún secreto:</p>
     <div class="termbox">permissions:
  contents: read
  packages: write        <span class="cm"># minimo privilegio: solo lo necesario</span></div>
     <p>Declarar <code>permissions</code> explícitamente es buena práctica: el token solo puede hacer lo que el job necesita.</p>`},

 {t:"info", eti:"Entornos", h:"Staging y producción con reglas propias",
  c:`<p>Los <b>environments</b> de GitHub (<code>staging</code>, <code>production</code>) permiten:</p>
     <ul><li>secretos <b>distintos por entorno</b> (la clave de producción solo existe en production),</li>
     <li><b>aprobación obligatoria</b> por personas concretas antes de desplegar,</li>
     <li>restringir qué ramas pueden desplegar ahí.</li></ul>
     <div class="termbox">deploy-prod:
  needs: deploy-staging
  environment: production      <span class="cm"># se para hasta que alguien aprueba</span>
  runs-on: ubuntu-latest</div>
     <p>Así se implementa la <b>entrega continua</b>: todo automático hasta el botón de aprobar producción.</p>`},

 {t:"par", p:"Empareja cada mecanismo con su utilidad",
  pares:[["secrets.NOMBRE","Credenciales cifradas fuera del código"],
         ["GITHUB_TOKEN","Token temporal automático para el propio repositorio"],
         ["permissions","Limitar lo que puede hacer el token del job"],
         ["environment: production","Aprobación manual y secretos propios de producción"]],
  why:"Seguridad del pipeline: una pregunta cada vez más frecuente en entrevistas."},

 {t:"vf", p:"Un PR abierto desde un fork puede leer los secretos del repositorio original.",
  ok:false,
  why:"Por seguridad, GitHub no expone los secretos a los workflows disparados desde forks. Si no, cualquiera podría robarlos con un PR."}
]},

/* =============== O3 L5 =============== */
{
id:"o3l5",
titulo:"Pipelines rápidos: caché, matrices y artefactos",
claves:["La caché reutiliza dependencias entre ejecuciones","Una matriz ejecuta el mismo job con varias combinaciones","Los artefactos pasan ficheros entre jobs"],
pasos:[
 {t:"info", eti:"Caché", h:"No descargues Internet en cada push",
  c:`<p>Cada ejecución empieza en una máquina limpia. Sin caché, Maven descarga todas las dependencias <b>cada vez</b>. Con caché:</p>
     <div class="termbox">- uses: actions/setup-java@v4
  with:
    java-version: "21"
    distribution: temurin
    cache: maven            <span class="cm"># reutiliza ~/.m2 entre ejecuciones</span></div>
     <p>Y para imágenes Docker, la caché de capas:</p>
     <div class="termbox">- uses: docker/build-push-action@v6
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max</div>
     <p>Es el mismo concepto que la caché de capas del Dockerfile, pero entre ejecuciones del pipeline.</p>`},

 {t:"opcion", p:"Tu pipeline tarda 9 minutos y 6 son descargando dependencias. ¿Qué haces primero?",
  ops:["Pagar runners más potentes","Activar la caché de dependencias (y de capas Docker)","Quitar los tests","Ejecutarlo solo por la noche"],
  ok:1,
  why:"Lo más barato y efectivo. Con caché, esos 6 minutos se quedan en segundos."},

 {t:"info", eti:"Matriz", h:"Probar varias versiones a la vez",
  c:`<div class="termbox">jobs:
  test:
    strategy:
      matrix:
        java: ["17", "21"]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/setup-java@v4
        with:
          java-version: \${{ matrix.java }}</div>
     <p>Esto genera <b>4 jobs en paralelo</b> (2 versiones × 2 sistemas). Útil en librerías que deben funcionar en varios entornos.</p>`},

 {t:"opcion", p:"Una matriz con 3 versiones de Java y 2 sistemas operativos, ¿cuántos jobs genera?",
  ops:["3","5","6","2"],
  ok:2,
  why:"Producto cartesiano: 3 × 2 = 6, todos en paralelo."},

 {t:"info", eti:"Artefactos", h:"Pasar ficheros entre jobs",
  c:`<p>Cada job corre en una máquina distinta, así que no comparten disco. Para pasar el jar del job de build al de despliegue:</p>
     <div class="termbox"><span class="cm"># job build</span>
- uses: actions/upload-artifact@v4
  with: { name: app, path: target/app.jar }

<span class="cm"># job deploy (needs: build)</span>
- uses: actions/download-artifact@v4
  with: { name: app }</div>
     <p>También sirve para guardar informes de tests o de cobertura y descargarlos después desde la web.</p>`},

 {t:"vf", p:"Dos jobs distintos de un mismo workflow comparten el mismo disco por defecto.",
  ok:false,
  why:"Cada job es una máquina nueva. Para compartir ficheros hacen falta artefactos (o publicar en un registry)."}
]},

/* =============== O3 L6 =============== */
{
id:"o3l6",
titulo:"Estrategias de despliegue",
claves:["Rolling: sustituir instancias poco a poco","Blue-green: dos entornos y cambiar el tráfico de golpe","Canary: un porcentaje pequeño primero; feature flags para separar desplegar de activar"],
pasos:[
 {t:"info", eti:"El problema", h:"¿Cómo se cambia una versión sin cortar el servicio?",
  c:`<p>Parar la versión vieja y arrancar la nueva deja el servicio caído unos segundos o minutos, y si la nueva falla, la caída se alarga. Hay estrategias para evitarlo.</p>`},

 {t:"info", eti:"Rolling", h:"Rolling update: poco a poco",
  c:`<div class="diag">[v1][v1][v1][v1]
[v2][v1][v1][v1]
[v2][v2][v1][v1]
[v2][v2][v2][v2]</div>
     <p>Se sustituyen las instancias <b>de una en una</b> (o en grupos). Siempre hay instancias atendiendo. Es lo que hace <b>Kubernetes por defecto</b>.</p>
     <p>Pega: durante un rato conviven v1 y v2, así que tienen que ser compatibles (por ejemplo, con la base de datos).</p>`},

 {t:"info", eti:"Blue-green", h:"Dos entornos idénticos",
  c:`<div class="diag">           +--> [ AZUL  v1 ]   (en produccion)
usuarios --+
 (router)  +..> [ VERDE v2 ]   (preparado y probado)

cambio del router: todo el trafico pasa a VERDE de golpe
si algo va mal: vuelta a AZUL en segundos</div>
     <p>Rollback instantáneo, pero necesitas <b>el doble de infraestructura</b> durante el cambio.</p>`},

 {t:"info", eti:"Canary", h:"El canario en la mina",
  c:`<p>Se envía la versión nueva a un <b>porcentaje pequeño</b> de usuarios (1%, 5%) y se vigilan las métricas: errores, latencia. Si todo va bien, se sube al 25%, 50%, 100%. Si algo va mal, solo afecta a unos pocos.</p>
     <p>El nombre viene de los canarios que usaban los mineros: si el canario se desmayaba, había gas y salían antes de que les afectara a ellos.</p>`},

 {t:"par", p:"Empareja cada estrategia con su característica",
  pares:[["Rolling update","Sustituye instancias poco a poco; conviven dos versiones"],
         ["Blue-green","Dos entornos completos y cambio del tráfico de golpe"],
         ["Canary","Un pequeño porcentaje de usuarios primero, vigilando métricas"],
         ["Recreate","Parar todo y arrancar lo nuevo: hay corte de servicio"]],
  why:"Una de las preguntas más típicas en entrevistas de DevOps."},

 {t:"opcion", p:"Quieres desplegar un cambio arriesgado en el sistema de pagos limitando el daño si falla. ¿Qué estrategia?",
  ops:["Recreate","Canary, con un porcentaje pequeño y vigilando errores","Desplegar el viernes por la tarde","Ninguna"],
  ok:1,
  why:"Canary acota el impacto y te da datos reales antes de exponer a todos."},

 {t:"info", eti:"Feature flags", h:"Desplegar no es activar",
  c:`<p>Una <b>feature flag</b> es un interruptor en configuración que enciende o apaga una funcionalidad sin desplegar:</p>
     <div class="termbox">if (flags.estaActivo("nuevo-checkout", usuario)) {
    return nuevoCheckout(pedido);
}
return checkoutActual(pedido);</div>
     <p>Permite desplegar código a medias apagado (trunk-based development), activarlo solo para empleados o para un 5% de usuarios, y apagarlo en segundos si falla, sin rollback.</p>`},

 {t:"vf", p:"Con feature flags se puede desactivar una funcionalidad problemática sin hacer un nuevo despliegue.",
  ok:true,
  why:"Sí: separar desplegar (poner el código) de lanzar (encenderlo) es una de las ideas más potentes de la entrega continua."},

 {t:"info", eti:"Siempre", h:"Rollback preparado",
  c:`<p>Sea cual sea la estrategia, el <b>rollback</b> tiene que estar ensayado y ser rápido. Con imágenes Docker etiquetadas por versión o SHA, volver atrás es desplegar el tag anterior. Con Kubernetes: <code>kubectl rollout undo</code>.</p>
     <p>Y cuidado con las <b>migraciones de base de datos</b>: deben ser compatibles hacia atrás (añadir antes de quitar), porque el código se puede revertir en segundos pero los datos no.</p>`}
]}

]});
