window.CURSOS = window.CURSOS || {};
(CURSOS.jenkins = CURSOS.jenkins || []).push({
titulo: "Maestría: Jenkins en una entrevista",
resumen: "Jenkins frente a GitHub Actions, GitLab CI y Argo CD, diseño de un pipeline completo y simulacro de entrevista",
nivel: "Maestro",
color: "#a8432f",
lecciones: [

/* =============== U11 L1 =============== */
{
id:"jn11l1",
titulo:"Jenkins frente a las alternativas",
claves:["GitHub Actions y GitLab CI están integradas en el repositorio y usan YAML, con máquinas gestionadas","Jenkins es autoalojado y más flexible, a cambio de mantenerlo","Argo CD hace la parte de despliegue con GitOps en Kubernetes: se complementa con el CI"],
pasos:[
 {t:"info", eti:"El panorama", h:"Quién es quién",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">jenkins y las alternativas</div><table class="dg-tabla"><tbody>
<tr><td>Jenkins</td><td>lo instalas tú · miles de plugins · Groovy · llega a redes internas<br>coste: mantener controlador, agentes, plugins y seguridad</td></tr>
<tr><td>GitHub Actions</td><td>dentro de GitHub · ficheros YAML · máquinas gestionadas</td></tr>
<tr><td>GitLab CI</td><td>dentro de GitLab · <code>.gitlab-ci.yml</code> · runners propios o gestionados</td></tr>
<tr><td>Argo CD</td><td>GitOps: mantiene Kubernetes igual a lo que dice un repositorio</td></tr>
</tbody></table></div>
     <p><b>GitOps</b> significa que el estado deseado del sistema está declarado en un repositorio y una herramienta se encarga de que la realidad coincida. Argo CD no compila ni prueba: se ocupa del despliegue. Por eso suele combinarse: Jenkins (o Actions) construye y publica la imagen, y Argo CD la despliega.</p>`},
 {t:"par", p:"Empareja cada situación con la herramienta que mejor encaja",
  pares:[["Empresa con muchos pipelines y servidores en su red interna","Jenkins"],["Proyecto pequeño alojado en GitHub, sin equipo de plataforma","GitHub Actions"],["Todo el código y las incidencias ya están en GitLab","GitLab CI"],["Mantener un clúster de Kubernetes igual a lo declarado en Git","Argo CD"]],
  why:"No hay una respuesta única; se valora que justifiques la elección."},
 {t:"opcion", p:"«¿Qué desventajas tiene Jenkins?» ¿Cuál es la mejor respuesta?",
  ops:["Ninguna, es la mejor herramienta","Que hay que mantenerlo: actualizaciones, plugins que se rompen, seguridad del controlador, agentes y copias de seguridad","Que es de pago","Que no funciona con Docker"],
  ok:1, why:"Reconocer los costes de operación demuestra experiencia real."},
 {t:"opcion", p:"«¿Jenkins o GitHub Actions?» ¿Cómo enfocarías la respuesta?",
  ops:["Decir que Jenkins siempre es mejor","Preguntar por el contexto: dónde está el código, si hay equipo de plataforma, si hay que llegar a redes internas y qué integraciones hacen falta","Decir que da igual","Decir que Actions siempre es mejor"],
  ok:1, why:"En las entrevistas de sistemas se valora más el criterio que el fanatismo por una herramienta."}
]},

/* =============== U11 L2 =============== */
{
id:"jn11l2",
titulo:"Diseñar un pipeline completo",
claves:["Estructura típica: descargar, compilar, probar, análisis, imagen, staging, humo, aprobación, producción","Decir dónde se ejecuta cada etapa, cómo se gestionan los secretos y cómo se protege producción","Build once, deploy many y marcha atrás preparada"],
pasos:[
 {t:"info", eti:"El ejercicio típico", h:"«Diséñame el pipeline de esta aplicación»",
  c:`<p>Es la pregunta estrella. Una respuesta completa menciona <b>etapas</b>, <b>dónde</b> se ejecutan, <b>secretos</b> y <b>protección de producción</b>:</p>
     <div class="dg"><div class="dg-tit">el pipeline completo</div>
<div class="dg-vert">
<div class="dg-caja doble">1. Descargar el código<small>multibranch: ramas y PRs</small></div>
<div class="dg-caja doble">2. Compilar y probar<small>agente con imagen de Maven; publicar informes con <code>junit</code></small></div>
<div class="dg-caja">3. En paralelo<div class="dg-fila" style="margin-top:6px"><div class="dg-caja">análisis de seguridad</div><div class="dg-caja">análisis de calidad</div></div></div>
<div class="dg-caja doble">4. Construir la imagen<small>etiquetada con el commit</small></div>
<div class="dg-caja doble">5. Subirla al registro<small>credenciales con <code>withCredentials</code></small></div>
<div class="dg-caja">6. Desplegar en staging</div>
<div class="dg-caja doble">7. Pruebas de humo<small><code>/actuator/health</code></small></div>
<div class="dg-caja doble acento">8. Aprobación manual<small><code>input</code> con timeout, solo desde <code>main</code></small></div>
<div class="dg-caja doble ok">9. Desplegar en producción<small>la MISMA imagen</small></div>
</div></div>`},
 {t:"orden", p:"Ordena las etapas del pipeline completo",
  items:["Descargar el código","Compilar y pasar las pruebas","Análisis de seguridad y calidad","Construir la imagen etiquetada con el commit","Subir la imagen al registro","Desplegar en staging","Pruebas de humo","Aprobación manual","Desplegar en producción"],
  why:"Este orden es el guion de tu respuesta en la entrevista."},
 {t:"opcion", p:"Te preguntan cómo evitarías que un despliegue malo tumbe producción. ¿Qué respondes?",
  ops:["Desplegar solo los viernes","Probar en staging con pruebas de humo, desplegar la misma imagen ya probada, exigir aprobación y tener preparada la vuelta atrás a la versión anterior","Desplegar sin pruebas para ir rápido","No desplegar nunca"],
  ok:1, why:"Mencionar la marcha atrás (rollback) suma puntos: los despliegues fallan y hay que poder volver."},
 {t:"par", p:"Empareja cada pregunta de la entrevista con la idea clave de la respuesta",
  pares:[["¿Dónde se ejecutan tus builds?","En agentes, nunca en el controlador"],["¿Cómo gestionas los secretos?","Credenciales de Jenkins con withCredentials, sin imprimirlos"],["¿Cómo evitas repetir el mismo pipeline?","Con una librería compartida versionada"],["¿Cómo recuperarías Jenkins si se pierde?","JCasC más copia de JENKINS_HOME con secrets/"],["¿Cómo aceleras un pipeline lento?","Medir, paralelizar, cachear y agentes efímeros"]],
  why:"Respuestas cortas, con el porqué: eso es lo que se evalúa."},
 {t:"opcion", p:"«Los builds tardan 40 minutos, ¿qué harías?»",
  ops:["Comprar un servidor más grande y ya","Primero medir qué etapa tarda más; después paralelizar pruebas, cachear dependencias, no repetir trabajo y añadir agentes si falta capacidad","Quitar las pruebas","Hacer menos commits"],
  ok:1, why:"Primero medir; optimizar a ciegas suele no servir de nada."}
]},

/* =============== U11 L3 =============== */
{
id:"jn11l3",
titulo:"Simulacro de entrevista de Jenkins",
claves:["Sabes explicar CI/CD, la arquitectura de Jenkins y el pipeline as code","Sabes diseñar, acelerar y proteger un pipeline real","Sabes operar Jenkins: seguridad, copias, actualizaciones y diagnóstico"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Contesta en voz alta antes de elegir la opción: así es como te lo van a preguntar.</p>`},
 {t:"opcion", p:"«¿Qué es Jenkins y para qué se usa?»",
  ops:["Un repositorio de código","Un servidor de automatización que ejecuta pipelines de CI/CD: con cada cambio compila, prueba, empaqueta y despliega","Un lenguaje de programación","Una base de datos"],
  ok:1, why:"Empieza siempre por la definición corta y después pon un ejemplo de tu experiencia."},
 {t:"opcion", p:"«¿Cuál es la diferencia entre el controlador y los agentes?»",
  ops:["Ninguna","El controlador organiza, guarda la configuración y muestra la interfaz; los agentes ejecutan los builds, y conviene que el controlador no ejecute ninguno","El controlador ejecuta los builds y los agentes los revisan","Los agentes guardan las credenciales"],
  ok:1, why:"Añade el porqué: seguridad y rendimiento."},
 {t:"opcion", p:"«¿Qué es un Jenkinsfile y qué ventajas tiene?»",
  ops:["Un fichero de configuración de Docker","El pipeline escrito como código y guardado en el repositorio: tiene historial, se revisa en Pull Requests y cada rama puede tener el suyo","Un registro de builds","Un plugin"],
  ok:1, why:"Es el concepto central del Jenkins moderno."},
 {t:"opcion", p:"«¿Cómo manejas los secretos?»",
  ops:["En variables dentro del Jenkinsfile","En el almacén de credenciales, inyectados con withCredentials, con el mínimo alcance, sin imprimirlos ni interpolarlos en comillas dobles; mejor aún, credenciales temporales","En un fichero del repositorio","Como parámetros del job"],
  ok:1, why:"Una de las preguntas más frecuentes en entrevistas de DevOps."},
 {t:"opcion", p:"«Un pipeline falla solo a veces, sin cambios en el código. ¿Qué haces?»",
  ops:["Reintentarlo hasta que pase y olvidarlo","Buscar la causa: pruebas inestables, dependencias descargadas de internet, falta de limpieza entre builds o agentes con estado distinto; mientras tanto, aislarlo con retry solo si es algo externo","Borrar el job","Quitar las pruebas que fallan"],
  ok:1, why:"Los fallos intermitentes casi siempre vienen de estado compartido o de dependencias externas."},
 {t:"par", p:"Empareja cada concepto con su definición, como repaso final",
  pares:[["Integración continua","Validar automáticamente cada cambio integrado"],["Entrega continua","Dejar cada cambio listo para desplegar con una decisión humana"],["Pipeline","La cadena de etapas automáticas que recorre un cambio"],["Agente","La máquina donde se ejecutan los builds"],["Executor","El hueco que ejecuta un build a la vez"],["JENKINS_HOME","La carpeta con toda la configuración y el historial"]],
  why:"Si puedes explicar estas seis con tus palabras, tienes la base cubierta."},
 {t:"info", eti:"Terminado", h:"Has completado el curso de Jenkins",
  c:`<p>Has recorrido el camino entero: qué problema resuelve la integración continua, cómo está hecho Jenkins, cómo instalarlo, tu primer job, los pipelines como código, el pipeline completo de una API Spring Boot, agentes y paralelismo, multibranch y librerías compartidas, seguridad, operación y entrevista.</p>
     <p><b>Para consolidarlo</b>: levanta Jenkins con Docker, crea un job de pipeline que apunte a un repositorio tuyo con un Jenkinsfile de dos etapas (compilar y probar) y haz que se lance solo con cada push. Cuando eso funcione, añade la etapa de imagen Docker.</p>`}
]}

]});
