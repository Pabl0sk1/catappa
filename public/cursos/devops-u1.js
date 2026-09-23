window.CURSOS = window.CURSOS || {};
(CURSOS.devops = CURSOS.devops || []).push({
titulo: "Qué es DevOps de verdad",
resumen: "La cultura, el ciclo, las métricas DORA y los roles del sector",
nivel: "Fundamentos",
color: "#7fd1b9",
lecciones: [

/* =============== O1 L1 =============== */
{
id:"o1l1",
titulo:"El muro entre desarrollo y operaciones",
claves:["DevOps nace para romper la separación entre quien desarrolla y quien opera","No es una herramienta ni un puesto: es una forma de trabajar","Objetivo: entregar cambios rápido y con fiabilidad"],
pasos:[
 {t:"info", eti:"La historia", h:"Cómo se trabajaba antes",
  c:`<p>Durante años, en casi todas las empresas había dos equipos separados por un muro:</p>
     <ul><li><b>Desarrollo (Dev)</b>: escribe código nuevo. Le miden por <b>entregar funcionalidades</b>, así que quiere cambiar cosas rápido.</li>
     <li><b>Operaciones (Ops)</b>: mantiene los servidores funcionando. Le miden por la <b>estabilidad</b>, así que quiere cambiar lo menos posible.</li></ul>
     <p>Desarrollo terminaba una versión y la «tiraba por encima del muro». Operaciones la instalaba a mano un sábado de madrugada. Si fallaba, cada equipo culpaba al otro: «en mi máquina funciona» contra «vuestro código es un desastre».</p>`},

 {t:"info", eti:"Las consecuencias", h:"Por qué eso no escala",
  c:`<ul><li>Despliegues <b>una vez al trimestre</b>, enormes y con miedo.</li>
     <li>Cuanto más grande el despliegue, <b>más cosas fallan</b> a la vez y más difícil es saber cuál.</li>
     <li>Tiempos de espera entre equipos: tickets, aprobaciones, esperas.</li>
     <li>Nadie se siente responsable del sistema completo.</li></ul>
     <p>Mientras tanto, empresas como Amazon o Netflix empezaron a desplegar <b>miles de veces al día</b>. Algo estaban haciendo distinto.</p>`},

 {t:"opcion", p:"¿Cuál era el conflicto de fondo entre Dev y Ops?",
  ops:["Que usaban lenguajes distintos",
       "Que Dev buscaba cambiar rápido y Ops buscaba estabilidad, con objetivos enfrentados y sin responsabilidad compartida",
       "Que Ops no sabía programar",
       "Que trabajaban en horarios distintos"],
  ok:1,
  why:"Incentivos opuestos. DevOps alinea a ambos alrededor de un objetivo común."},

 {t:"info", eti:"La definición", h:"Entonces, ¿qué es DevOps?",
  c:`<p><b>DevOps</b> es una <b>cultura y un conjunto de prácticas</b> que unen el desarrollo y la operación del software para <b>entregar cambios de forma rápida, frecuente y fiable</b>.</p>
     <p>Se apoya en tres ideas:</p>
     <ul><li><b>Responsabilidad compartida</b>: quien construye algo también se preocupa de cómo funciona en producción («you build it, you run it»).</li>
     <li><b>Automatización</b> de todo lo repetitivo: tests, construcción, despliegue, infraestructura.</li>
     <li><b>Cambios pequeños y frecuentes</b> en lugar de grandes y escasos, con medición constante.</li></ul>`},

 {t:"vf", p:"DevOps es, sobre todo, un conjunto de herramientas como Docker, Jenkins o Kubernetes.",
  ok:false,
  why:"Las herramientas ayudan, pero DevOps es primero una forma de trabajar. Puedes tener Kubernetes y seguir trabajando con un muro entre equipos."},

 {t:"opcion", p:"«Cambios pequeños y frecuentes» es mejor que «grandes y escasos» porque...",
  ops:["Así se trabaja menos",
       "Cada cambio tiene menos riesgo, se revisa mejor y, si falla, es fácil saber qué lo causó y deshacerlo",
       "Los servidores lo prefieren",
       "Es obligatorio por ley"],
  ok:1,
  why:"Menos cosas cambian a la vez, menos cosas pueden fallar a la vez. Es contraintuitivo pero demostrado."},

 {t:"opcion", p:"En una entrevista: «¿Qué es DevOps para ti?»",
  ops:["Un puesto que maneja servidores",
       "Una cultura y prácticas que unen desarrollo y operaciones para entregar software rápido y fiable, con responsabilidad compartida, automatización y mejora continua medida",
       "Usar Docker",
       "Hacer deploys los viernes"],
  ok:1,
  why:"Cultura + prácticas + objetivo. Y si añades un ejemplo tuyo (un pipeline que montaste), mejor."}
]},

/* =============== O1 L2 =============== */
{
id:"o1l2",
titulo:"CALMS: los pilares de la cultura DevOps",
claves:["Culture, Automation, Lean, Measurement, Sharing","Sin cultura, la automatización no basta","Medir para mejorar; compartir para no depender de héroes"],
pasos:[
 {t:"info", eti:"El marco", h:"CALMS en cinco letras",
  c:`<p>Un marco muy usado para explicar DevOps son las siglas <b>CALMS</b>:</p>
     <ul><li><b>C</b>ulture — cultura: colaboración, confianza y responsabilidad compartida.</li>
     <li><b>A</b>utomation — automatizar lo repetitivo.</li>
     <li><b>L</b>ean — eliminar desperdicio: esperas, trabajo a medias, pasos que no aportan.</li>
     <li><b>M</b>easurement — medir para decidir con datos.</li>
     <li><b>S</b>haring — compartir conocimiento, herramientas y aprendizajes.</li></ul>`},

 {t:"par", p:"Empareja cada letra de CALMS con un ejemplo real",
  pares:[["Culture","Postmortems sin buscar culpables"],
         ["Automation","Un pipeline que prueba y despliega en cada push"],
         ["Lean","Reducir el tiempo que un cambio espera aprobación"],
         ["Measurement","Medir cuánto tardamos en recuperarnos de una caída"],
         ["Sharing","Documentar el runbook para que cualquiera pueda operar el servicio"]],
  why:"Cada letra se traduce en prácticas concretas. Así se explica en una entrevista sin quedarse en la teoría."},

 {t:"info", eti:"La C es la primera", h:"Por qué la cultura va antes que las herramientas",
  c:`<p>Si en tu empresa cuando algo falla se busca a quién despedir, la gente <b>esconde los errores</b>, no experimenta y no despliega. Da igual que tengas el mejor pipeline del mundo.</p>
     <p>Por eso las organizaciones DevOps practican la <b>cultura sin culpa</b> (blameless): ante un incidente se pregunta «¿qué falló en el sistema para que esto fuera posible?», no «¿quién ha sido?».</p>`},

 {t:"vf", p:"Una empresa puede ser DevOps comprando herramientas de automatización aunque sus equipos no colaboren.",
  ok:false,
  why:"La automatización sin colaboración solo automatiza el muro. La cultura es la base."},

 {t:"info", eti:"Sharing", h:"Evitar al «héroe»",
  c:`<p>Un antipatrón muy común: una sola persona sabe cómo desplegar o cómo arreglar la base de datos. Cuando se va de vacaciones, el equipo se paraliza. Se llama <b>factor autobús</b> (¿cuántas personas tendrían que caer para que el proyecto se pare?).</p>
     <p>Se combate con documentación (runbooks), automatización (el despliegue es un botón, no un ritual) y rotación de responsabilidades.</p>`},

 {t:"opcion", p:"Solo Carlos sabe cómo desplegar a producción. ¿Qué pilar de CALMS falla, sobre todo?",
  ops:["Measurement","Sharing (y Automation)","Lean","Ninguno"],
  ok:1,
  why:"El conocimiento no está compartido, y además el despliegue no está automatizado: si fuera un pipeline, no dependería de Carlos."}
]},

/* =============== O1 L3 =============== */
{
id:"o1l3",
titulo:"El ciclo DevOps",
claves:["Plan, code, build, test, release, deploy, operate, monitor","Es un bucle infinito: lo que aprendes operando vuelve a la planificación","Cada fase se automatiza todo lo posible"],
pasos:[
 {t:"info", eti:"El dibujo famoso", h:"El símbolo de infinito",
  c:`<div class="dg"><div class="dg-tit">el ciclo DevOps</div>
<svg viewBox="0 0 360 225" width="100%" style="max-width:480px;display:block;margin:auto" role="img" aria-label="Ocho tumbado: plan, code, build y test en el lazo DEV; release, deploy, operate y monitor en el lazo OPS; de monitor vuelve a plan (feedback)">
<defs><marker id="fl-devops1-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--accent)"/></marker></defs>
<path d="M72.3 43.0 L72.0 43.2 L71.8 43.4 L71.5 43.7 L71.2 43.9 L70.9 44.1 L70.7 44.3 L70.4 44.5 L70.1 44.7 L69.9 45.0 L69.6 45.2 L69.4 45.4 L69.1 45.7 L68.9 45.9 L68.6 46.2 L68.4 46.4 L68.1 46.7 L67.9 46.9 L67.6 47.2 L67.4 47.4 L67.1 47.7 L66.9 48.0 L66.6 48.2 L66.4 48.5 L66.2 48.8 L65.9 49.1 L65.7 49.4 L65.5 49.7 L65.2 50.0 L65.0 50.3 L64.8 50.6 L64.5 50.9 L64.3 51.2 L64.1 51.5 L63.9 51.8 L63.7 52.1 L63.4 52.4 L63.2 52.7 L63.0 53.1 L62.8 53.4 L62.6 53.7 L62.4 54.1 L62.2 54.4 L62.0 54.7 L61.8 55.1 L61.6 55.4 L61.4 55.8 L61.2 56.1 L61.0 56.5 L60.8 56.9 L60.6 57.2 L60.4 57.6 L60.2 57.9" fill="none" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-devops1-1)"/>
<path d="M51.0 90.6 L51.0 90.9 L50.9 91.3 L50.9 91.6 L50.9 92.0 L50.8 92.3 L50.8 92.6 L50.8 93.0 L50.7 93.3 L50.7 93.7 L50.7 94.0 L50.6 94.4 L50.6 94.7 L50.6 95.1 L50.5 95.4 L50.5 95.7 L50.5 96.1 L50.4 96.4 L50.4 96.8 L50.4 97.1 L50.4 97.5 L50.3 97.8 L50.3 98.2 L50.3 98.5 L50.3 98.9 L50.3 99.2 L50.2 99.6 L50.2 99.9 L50.2 100.3 L50.2 100.6 L50.2 101.0 L50.1 101.3 L50.1 101.7 L50.1 102.0 L50.1 102.4 L50.1 102.7 L50.1 103.1 L50.1 103.4 L50.1 103.8 L50.0 104.1 L50.0 104.5 L50.0 104.8 L50.0 105.2 L50.0 105.5 L50.0 105.9 L50.0 106.2 L50.0 106.6 L50.0 106.9 L50.0 107.3 L50.0 107.6 L50.0 108.0 L50.0 108.4 L50.0 108.7 L50.0 109.1 L50.0 109.4 L50.0 109.8 L50.0 110.1 L50.0 110.5 L50.0 110.8 L50.0 111.2 L50.0 111.5 L50.0 111.9 L50.1 112.2 L50.1 112.6 L50.1 112.9 L50.1 113.3 L50.1 113.6 L50.1 114.0 L50.1 114.3 L50.1 114.7 L50.2 115.0 L50.2 115.4 L50.2 115.7 L50.2 116.1 L50.2 116.4 L50.3 116.8 L50.3 117.1 L50.3 117.5 L50.3 117.8 L50.3 118.2 L50.4 118.5 L50.4 118.9 L50.4 119.2 L50.4 119.6 L50.5 119.9 L50.5 120.3 L50.5 120.6 L50.6 120.9 L50.6 121.3 L50.6 121.6 L50.7 122.0 L50.7 122.3 L50.7 122.7 L50.8 123.0 L50.8 123.4 L50.8 123.7 L50.9 124.0 L50.9 124.4 L50.9 124.7 L51.0 125.1 L51.0 125.4" fill="none" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-devops1-1)"/>
<path d="M60.2 158.1 L60.4 158.4 L60.6 158.8 L60.8 159.1 L61.0 159.5 L61.2 159.9 L61.4 160.2 L61.6 160.6 L61.8 160.9 L62.0 161.3 L62.2 161.6 L62.4 161.9 L62.6 162.3 L62.8 162.6 L63.0 162.9 L63.2 163.3 L63.4 163.6 L63.7 163.9 L63.9 164.2 L64.1 164.5 L64.3 164.8 L64.5 165.1 L64.8 165.4 L65.0 165.7 L65.2 166.0 L65.5 166.3 L65.7 166.6 L65.9 166.9 L66.2 167.2 L66.4 167.5 L66.6 167.8 L66.9 168.0 L67.1 168.3 L67.4 168.6 L67.6 168.8 L67.9 169.1 L68.1 169.3 L68.4 169.6 L68.6 169.8 L68.9 170.1 L69.1 170.3 L69.4 170.6 L69.6 170.8 L69.9 171.0 L70.1 171.3 L70.4 171.5 L70.7 171.7 L70.9 171.9 L71.2 172.1 L71.5 172.3 L71.8 172.6 L72.0 172.8 L72.3 173.0" fill="none" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-devops1-1)"/>
<path d="M133.3 154.9 L134.0 154.4 L134.7 153.8 L135.3 153.2 L136.0 152.6 L136.7 151.9 L137.4 151.3 L138.1 150.7 L138.8 150.1 L139.5 149.4 L140.2 148.8 L140.9 148.1 L141.6 147.5 L142.3 146.8 L143.0 146.2 L143.7 145.5 L144.4 144.8 L145.1 144.2 L145.9 143.5 L146.6 142.8 L147.3 142.1 L148.0 141.4 L148.7 140.7 L149.4 140.0 L150.1 139.3 L150.8 138.6 L151.6 137.9 L152.3 137.2 L153.0 136.4 L153.7 135.7 L154.4 135.0 L155.2 134.3 L155.9 133.5 L156.6 132.8 L157.3 132.0 L158.1 131.3 L158.8 130.5 L159.5 129.8 L160.2 129.0 L161.0 128.3 L161.7 127.5 L162.4 126.8 L163.1 126.0 L163.9 125.2 L164.6 124.5 L165.3 123.7 L166.1 122.9 L166.8 122.2 L167.5 121.4 L168.3 120.6 L169.0 119.8 L169.7 119.0 L170.5 118.3 L171.2 117.5 L171.9 116.7 L172.7 115.9 L173.4 115.1 L174.1 114.3 L174.9 113.5 L175.6 112.7 L176.3 112.0 L177.1 111.2 L177.8 110.4 L178.5 109.6 L179.3 108.8 L180.0 108.0 L180.7 107.2 L181.5 106.4 L182.2 105.6 L182.9 104.8 L183.7 104.0 L184.4 103.3 L185.1 102.5 L185.9 101.7 L186.6 100.9 L187.3 100.1 L188.1 99.3 L188.8 98.5 L189.5 97.7 L190.3 97.0 L191.0 96.2 L191.7 95.4 L192.5 94.6 L193.2 93.8 L193.9 93.1 L194.7 92.3 L195.4 91.5 L196.1 90.8 L196.9 90.0 L197.6 89.2 L198.3 88.5 L199.0 87.7 L199.8 87.0 L200.5 86.2 L201.2 85.5 L201.9 84.7 L202.7 84.0 L203.4 83.2 L204.1 82.5 L204.8 81.7 L205.6 81.0 L206.3 80.3 L207.0 79.6 L207.7 78.8 L208.4 78.1 L209.2 77.4 L209.9 76.7 L210.6 76.0 L211.3 75.3 L212.0 74.6 L212.7 73.9 L213.4 73.2 L214.1 72.5 L214.9 71.8 L215.6 71.2 L216.3 70.5 L217.0 69.8 L217.7 69.2 L218.4 68.5 L219.1 67.9 L219.8 67.2 L220.5 66.6 L221.2 65.9 L221.9 65.3 L222.6 64.7 L223.3 64.1 L224.0 63.4 L224.7 62.8 L225.3 62.2 L226.0 61.6 L226.7 61.1" fill="none" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-devops1-1)"/>
<path d="M287.7 43.0 L288.0 43.2 L288.2 43.4 L288.5 43.7 L288.8 43.9 L289.1 44.1 L289.3 44.3 L289.6 44.5 L289.9 44.7 L290.1 45.0 L290.4 45.2 L290.6 45.4 L290.9 45.7 L291.1 45.9 L291.4 46.2 L291.6 46.4 L291.9 46.7 L292.1 46.9 L292.4 47.2 L292.6 47.4 L292.9 47.7 L293.1 48.0 L293.4 48.2 L293.6 48.5 L293.8 48.8 L294.1 49.1 L294.3 49.4 L294.5 49.7 L294.8 50.0 L295.0 50.3 L295.2 50.6 L295.5 50.9 L295.7 51.2 L295.9 51.5 L296.1 51.8 L296.3 52.1 L296.6 52.4 L296.8 52.7 L297.0 53.1 L297.2 53.4 L297.4 53.7 L297.6 54.1 L297.8 54.4 L298.0 54.7 L298.2 55.1 L298.4 55.4 L298.6 55.8 L298.8 56.1 L299.0 56.5 L299.2 56.9 L299.4 57.2 L299.6 57.6 L299.8 57.9" fill="none" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-devops1-1)"/>
<path d="M309.0 90.6 L309.0 90.9 L309.1 91.3 L309.1 91.6 L309.1 92.0 L309.2 92.3 L309.2 92.6 L309.2 93.0 L309.3 93.3 L309.3 93.7 L309.3 94.0 L309.4 94.4 L309.4 94.7 L309.4 95.1 L309.5 95.4 L309.5 95.7 L309.5 96.1 L309.6 96.4 L309.6 96.8 L309.6 97.1 L309.6 97.5 L309.7 97.8 L309.7 98.2 L309.7 98.5 L309.7 98.9 L309.7 99.2 L309.8 99.6 L309.8 99.9 L309.8 100.3 L309.8 100.6 L309.8 101.0 L309.9 101.3 L309.9 101.7 L309.9 102.0 L309.9 102.4 L309.9 102.7 L309.9 103.1 L309.9 103.4 L309.9 103.8 L310.0 104.1 L310.0 104.5 L310.0 104.8 L310.0 105.2 L310.0 105.5 L310.0 105.9 L310.0 106.2 L310.0 106.6 L310.0 106.9 L310.0 107.3 L310.0 107.6 L310.0 108.0 L310.0 108.4 L310.0 108.7 L310.0 109.1 L310.0 109.4 L310.0 109.8 L310.0 110.1 L310.0 110.5 L310.0 110.8 L310.0 111.2 L310.0 111.5 L310.0 111.9 L309.9 112.2 L309.9 112.6 L309.9 112.9 L309.9 113.3 L309.9 113.6 L309.9 114.0 L309.9 114.3 L309.9 114.7 L309.8 115.0 L309.8 115.4 L309.8 115.7 L309.8 116.1 L309.8 116.4 L309.7 116.8 L309.7 117.1 L309.7 117.5 L309.7 117.8 L309.7 118.2 L309.6 118.5 L309.6 118.9 L309.6 119.2 L309.6 119.6 L309.5 119.9 L309.5 120.3 L309.5 120.6 L309.4 120.9 L309.4 121.3 L309.4 121.6 L309.3 122.0 L309.3 122.3 L309.3 122.7 L309.2 123.0 L309.2 123.4 L309.2 123.7 L309.1 124.0 L309.1 124.4 L309.1 124.7 L309.0 125.1 L309.0 125.4" fill="none" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-devops1-1)"/>
<path d="M299.8 158.1 L299.6 158.4 L299.4 158.8 L299.2 159.1 L299.0 159.5 L298.8 159.9 L298.6 160.2 L298.4 160.6 L298.2 160.9 L298.0 161.3 L297.8 161.6 L297.6 161.9 L297.4 162.3 L297.2 162.6 L297.0 162.9 L296.8 163.3 L296.6 163.6 L296.3 163.9 L296.1 164.2 L295.9 164.5 L295.7 164.8 L295.5 165.1 L295.2 165.4 L295.0 165.7 L294.8 166.0 L294.5 166.3 L294.3 166.6 L294.1 166.9 L293.8 167.2 L293.6 167.5 L293.4 167.8 L293.1 168.0 L292.9 168.3 L292.6 168.6 L292.4 168.8 L292.1 169.1 L291.9 169.3 L291.6 169.6 L291.4 169.8 L291.1 170.1 L290.9 170.3 L290.6 170.6 L290.4 170.8 L290.1 171.0 L289.9 171.3 L289.6 171.5 L289.3 171.7 L289.1 171.9 L288.8 172.1 L288.5 172.3 L288.2 172.6 L288.0 172.8 L287.7 173.0" fill="none" stroke="var(--line-2)" stroke-width="2" marker-end="url(#fl-devops1-1)"/>
<path d="M226.7 154.9 L226.0 154.4 L225.3 153.8 L224.7 153.2 L224.0 152.6 L223.3 151.9 L222.6 151.3 L221.9 150.7 L221.2 150.1 L220.5 149.4 L219.8 148.8 L219.1 148.1 L218.4 147.5 L217.7 146.8 L217.0 146.2 L216.3 145.5 L215.6 144.8 L214.9 144.2 L214.1 143.5 L213.4 142.8 L212.7 142.1 L212.0 141.4 L211.3 140.7 L210.6 140.0 L209.9 139.3 L209.2 138.6 L208.4 137.9 L207.7 137.2 L207.0 136.4 L206.3 135.7 L205.6 135.0 L204.8 134.3 L204.1 133.5 L203.4 132.8 L202.7 132.0 L201.9 131.3 L201.2 130.5 L200.5 129.8 L199.8 129.0 L199.0 128.3 L198.3 127.5 L197.6 126.8 L196.9 126.0 L196.1 125.2 L195.4 124.5 L194.7 123.7 L193.9 122.9 L193.2 122.2 L192.5 121.4 L191.7 120.6 L191.0 119.8 L190.3 119.0 L189.5 118.3 L188.8 117.5 L188.1 116.7 L187.3 115.9 L186.6 115.1 L185.9 114.3 L185.1 113.5 L184.4 112.7 L183.7 112.0 L182.9 111.2 L182.2 110.4 L181.5 109.6 L180.7 108.8 L180.0 108.0 L179.3 107.2 L178.5 106.4 L177.8 105.6 L177.1 104.8 L176.3 104.0 L175.6 103.3 L174.9 102.5 L174.1 101.7 L173.4 100.9 L172.7 100.1 L171.9 99.3 L171.2 98.5 L170.5 97.7 L169.7 97.0 L169.0 96.2 L168.3 95.4 L167.5 94.6 L166.8 93.8 L166.1 93.1 L165.3 92.3 L164.6 91.5 L163.9 90.8 L163.1 90.0 L162.4 89.2 L161.7 88.5 L161.0 87.7 L160.2 87.0 L159.5 86.2 L158.8 85.5 L158.1 84.7 L157.3 84.0 L156.6 83.2 L155.9 82.5 L155.2 81.7 L154.4 81.0 L153.7 80.3 L153.0 79.6 L152.3 78.8 L151.6 78.1 L150.8 77.4 L150.1 76.7 L149.4 76.0 L148.7 75.3 L148.0 74.6 L147.3 73.9 L146.6 73.2 L145.9 72.5 L145.1 71.8 L144.4 71.2 L143.7 70.5 L143.0 69.8 L142.3 69.2 L141.6 68.5 L140.9 67.9 L140.2 67.2 L139.5 66.6 L138.8 65.9 L138.1 65.3 L137.4 64.7 L136.7 64.1 L136.0 63.4 L135.3 62.8 L134.7 62.2 L134.0 61.6 L133.3 61.1" fill="none" stroke="var(--ink-3)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#fl-devops1-1)"/>
<rect x="76.3" y="32.7" width="68" height="24" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="110.3" y="49.2" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">plan</text>
<rect x="20.1" y="62.3" width="68" height="24" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="54.1" y="78.8" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">code</text>
<rect x="20.1" y="129.7" width="68" height="24" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="54.1" y="146.2" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">build</text>
<rect x="76.3" y="159.3" width="68" height="24" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/><text x="110.3" y="175.8" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">test</text>
<rect x="215.7" y="32.7" width="68" height="24" rx="6" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="1.5"/><text x="249.7" y="49.2" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">release</text>
<rect x="271.9" y="62.3" width="68" height="24" rx="6" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="1.5"/><text x="305.9" y="78.8" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">deploy</text>
<rect x="271.9" y="129.7" width="68" height="24" rx="6" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="1.5"/><text x="305.9" y="146.2" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">operate</text>
<rect x="215.7" y="159.3" width="68" height="24" rx="6" fill="var(--ok-soft)" stroke="var(--ok)" stroke-width="1.5"/><text x="249.7" y="175.8" text-anchor="middle" font-size="13" font-family="var(--mono)" fill="var(--ink)">monitor</text>
<text x="108" y="113" text-anchor="middle" font-size="15" font-weight="700" font-family="var(--sans)" fill="var(--accent)">DEV</text>
<text x="252" y="113" text-anchor="middle" font-size="15" font-weight="700" font-family="var(--sans)" fill="var(--ok)">OPS</text>
<text x="180" y="215" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--ink-3)">- - -  feedback: de monitor vuelve a plan</text>
</svg></div>
     <p>Se dibuja como un <b>ocho tumbado (∞)</b> porque no termina nunca: lo que aprendes al operar y monitorizar vuelve a la planificación de lo siguiente.</p>`},

 {t:"orden", p:"Ordena las fases del ciclo DevOps",
  items:["Plan","Code","Build","Test","Release","Deploy","Operate","Monitor"],
  why:"Y vuelta a empezar. En una entrevista es muy útil situar cada herramienta en su fase."},

 {t:"par", p:"Empareja cada fase con una herramienta típica",
  pares:[["Code","Git y GitHub"],
         ["Build","Maven, Docker build"],
         ["Test / CI","GitHub Actions, Jenkins, GitLab CI"],
         ["Deploy","Kubernetes, Argo CD, Ansible"],
         ["Monitor","Prometheus, Grafana"]],
  why:"Situar herramientas en el ciclo demuestra que entiendes para qué sirve cada una, no solo sus nombres."},

 {t:"info", eti:"Continuous everything", h:"Los «continuos»",
  c:`<ul><li><b>Integración continua (CI)</b>: cada cambio se integra en la rama principal y se valida automáticamente (build + tests), varias veces al día.</li>
     <li><b>Entrega continua (Continuous Delivery)</b>: el código está <b>siempre listo</b> para desplegarse; el paso a producción es un botón.</li>
     <li><b>Despliegue continuo (Continuous Deployment)</b>: ni botón: todo lo que pasa los tests <b>llega solo</b> a producción.</li></ul>
     <p>Los verás a fondo en la unidad de CI/CD.</p>`},

 {t:"opcion", p:"¿Diferencia entre entrega continua y despliegue continuo?",
  ops:["Son lo mismo",
       "En entrega continua el código está siempre listo y el paso a producción es manual; en despliegue continuo llega solo si pasa los tests",
       "La entrega continua no tiene tests",
       "El despliegue continuo es solo para móviles"],
  ok:1,
  why:"La diferencia es ese último botón. Pregunta frecuente."},

 {t:"vf", p:"La fase de monitorización es la última y no afecta a las demás.",
  ok:false,
  why:"Es la que cierra el bucle: lo que ves en producción (errores, lentitud, uso) decide qué se planifica después."}
]},

/* =============== O1 L4 =============== */
{
id:"o1l4",
titulo:"Métricas DORA: medir si lo haces bien",
claves:["Frecuencia de despliegue y tiempo de entrega miden la velocidad","Tasa de fallos y tiempo de recuperación miden la estabilidad","Los mejores equipos son rápidos Y estables a la vez"],
pasos:[
 {t:"info", eti:"El estudio", h:"Cuatro números que explican a un equipo",
  c:`<p>El equipo de investigación <b>DORA</b> (DevOps Research and Assessment, hoy en Google) estudió miles de organizaciones durante años y encontró <b>cuatro métricas</b> que distinguen a los equipos de alto rendimiento:</p>
     <ul><li><b>Frecuencia de despliegue</b>: cada cuánto llega un cambio a producción.</li>
     <li><b>Tiempo de entrega de cambios</b> (lead time): desde el commit hasta que está en producción.</li>
     <li><b>Tasa de fallos en cambios</b> (change failure rate): qué porcentaje de despliegues causa un problema.</li>
     <li><b>Tiempo de recuperación</b> (MTTR, time to restore): cuánto tardas en arreglar una caída.</li></ul>`},

 {t:"par", p:"Empareja cada métrica DORA con lo que mide",
  pares:[["Frecuencia de despliegue","Cuántas veces llegamos a producción"],
         ["Lead time de cambios","Del commit a producción, cuánto tiempo"],
         ["Change failure rate","Porcentaje de despliegues que causan fallos"],
         ["Tiempo de recuperación","Cuánto tardamos en restaurar el servicio"]],
  why:"Nombrar las cuatro métricas DORA en una entrevista de DevOps es un punto seguro."},

 {t:"info", eti:"El hallazgo clave", h:"Velocidad y estabilidad no se oponen",
  c:`<p>La intuición dice: «si despliegas más a menudo, romperás más cosas». Los datos de DORA dicen lo contrario: <b>los equipos que despliegan más a menudo también fallan menos y se recuperan antes</b>.</p>
     <p>¿Por qué? Porque para desplegar a menudo necesitas automatización, tests y cambios pequeños, y eso mismo es lo que te da estabilidad.</p>
     <div class="dg dg-tabla-caja"><table class="dg-tabla"><thead><tr><th></th><th>bajo rendimiento</th><th>alto rendimiento</th></tr></thead><tbody><tr><td>frecuencia</td><td>mensual</td><td>varias veces al dia</td></tr><tr><td>lead time</td><td>semanas o meses</td><td>menos de un dia</td></tr><tr><td>fallos</td><td>~40%</td><td>~5%</td></tr><tr><td>recuperacion</td><td>dias</td><td>menos de una hora</td></tr></tbody></table></div>`},

 {t:"vf", p:"Según DORA, los equipos que despliegan con más frecuencia tienden a tener más fallos.",
  ok:false,
  why:"Al contrario: los de alto rendimiento son a la vez más rápidos y más estables."},

 {t:"opcion", p:"Tu equipo despliega una vez al mes y cada despliegue rompe algo. ¿Qué recomendarías primero?",
  ops:["Desplegar todavía menos para romper menos",
       "Automatizar el pipeline y desplegar cambios más pequeños y frecuentes",
       "Añadir más aprobaciones manuales",
       "Contratar más testers manuales"],
  ok:1,
  why:"Lotes pequeños y automatización. Más aprobaciones solo alargan el lead time sin mejorar la estabilidad."},

 {t:"info", eti:"MTTR", h:"Recuperarse rápido importa más que no fallar nunca",
  c:`<p>Todo sistema falla alguna vez. Un equipo maduro no presume de «nunca caemos»; presume de <b>detectar y recuperar en minutos</b>. Eso se consigue con buena monitorización, alertas, rollback de un clic y runbooks. Lo trabajarás en la unidad de observabilidad.</p>`}
]},

/* =============== O1 L5 =============== */
{
id:"o1l5",
titulo:"Los roles: DevOps, SRE y Platform",
claves:["DevOps Engineer: automatiza entrega e infraestructura","SRE: aplica ingeniería a la fiabilidad, con SLOs y error budgets","Platform Engineering: construye una plataforma interna para los equipos"],
pasos:[
 {t:"info", eti:"El mercado", h:"Tres nombres que verás en las ofertas",
  c:`<p>Aunque DevOps es una cultura, en las ofertas de trabajo aparecen puestos concretos:</p>
     <ul><li><b>DevOps Engineer</b>: construye y mantiene pipelines de CI/CD, infraestructura como código, contenedores y el despliegue. Es el puente entre desarrollo y la infraestructura.</li>
     <li><b>SRE (Site Reliability Engineer)</b>: nació en Google. Trata la operación como un problema de ingeniería: mide la fiabilidad con <b>SLOs</b>, automatiza el trabajo manual repetitivo (<i>toil</i>) y lleva las guardias.</li>
     <li><b>Platform Engineer</b>: construye una <b>plataforma interna</b> (plantillas, pipelines estándar, un portal) para que los equipos de desarrollo desplieguen solos sin pelearse con la infraestructura.</li></ul>`},

 {t:"par", p:"Empareja cada rol con su foco principal",
  pares:[["DevOps Engineer","Pipelines, infraestructura como código y despliegues"],
         ["SRE","Fiabilidad medida con SLOs y reducción del trabajo manual"],
         ["Platform Engineer","Una plataforma interna de autoservicio para los equipos"]],
  why:"En la práctica se solapan mucho. Lo importante es entender el énfasis de cada uno."},

 {t:"info", eti:"Toil", h:"El enemigo del SRE",
  c:`<p>Google define el <b>toil</b> como el trabajo operativo que es <b>manual, repetitivo, automatizable</b> y que crece con el tamaño del servicio: reiniciar un servicio a mano cada semana, crear usuarios uno a uno, copiar ficheros de configuración...</p>
     <p>La regla de los SRE: como máximo el <b>50%</b> del tiempo en toil; el resto, en ingeniería que elimine ese toil.</p>`},

 {t:"opcion", p:"Cada lunes alguien reinicia a mano un servicio que se queda sin memoria. En términos SRE, eso es...",
  ops:["Un SLO","Toil: trabajo manual y repetitivo que habría que automatizar o, mejor, arreglar de raíz","Un runbook","Un error budget"],
  ok:1,
  why:"Toil. La solución no es un script que reinicie cada lunes: es encontrar la fuga de memoria."},

 {t:"info", eti:"Tu camino", h:"Dónde encajas tú",
  c:`<p>Con este curso más los de Docker y Git tienes la base de un perfil <b>DevOps junior</b>: sabes contenedores, control de versiones, pipelines, algo de infraestructura como código y Kubernetes, y los conceptos de fiabilidad.</p>
     <p>Viniendo de desarrollo (Java), tu gran ventaja es que <b>entiendes el código</b> que despliegas. Es exactamente el puente que DevOps quiere construir.</p>`},

 {t:"vf", p:"Un SRE mide la fiabilidad del servicio con objetivos concretos (SLOs) en lugar de intentar el 100% de disponibilidad.",
  ok:true,
  why:"Correcto. El 100% no existe y perseguirlo impide cambiar nada. Lo verás en la unidad de observabilidad."}
]}

]});
