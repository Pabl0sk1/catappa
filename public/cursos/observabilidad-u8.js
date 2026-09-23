window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Operar: Kubernetes, escala, guardias e incidentes",
resumen: "Observabilidad en Kubernetes, escalar Prometheus con retención larga y costes controlados, guardias sostenibles, gestión de incidentes y postmortems sin culpa",
nivel: "Experto",
color: "#c64c4c",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"ob8n1",
titulo:"Observabilidad en Kubernetes",
claves:["cAdvisor (en el kubelet) da el consumo de cada contenedor; kube-state-metrics, el estado de los objetos; node-exporter, el de cada nodo","kube-prometheus-stack instala Prometheus Operator, Alertmanager, Grafana, las reglas y los paneles; ServiceMonitor y PodMonitor declaran qué recoger","Consultas clave: reinicios, OOMKilled, throttling de CPU, pods pendientes y réplicas no disponibles"],
pasos:[
 {t:"info", eti:"De dónde sale cada dato", h:"Las fuentes de métricas del clúster",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">quién mide qué en kubernetes</div><table class="dg-tabla"><thead><tr><th>Fuente</th><th>Prefijo</th><th>Qué dice</th></tr></thead><tbody>
       <tr><td>cAdvisor (dentro del kubelet)</td><td><code>container_*</code></td><td>CPU, memoria, red y disco que usa cada contenedor</td></tr>
       <tr><td>kube-state-metrics</td><td><code>kube_*</code></td><td>estado de los objetos de la API: réplicas deseadas y disponibles, fase del pod, reinicios, requests y limits</td></tr>
       <tr><td>node-exporter</td><td><code>node_*</code></td><td>la máquina: CPU, memoria, disco, red</td></tr>
       <tr><td>plano de control</td><td><code>apiserver_*</code>, <code>etcd_*</code></td><td>latencia y errores de la API, salud de etcd</td></tr>
       <tr><td>metrics-server</td><td>—</td><td>solo para <code>kubectl top</code> y el HPA; no guarda historia ni es para Prometheus</td></tr>
     </tbody></table></div>
     <div class="termbox">helm install monitorizacion prometheus-community/kube-prometheus-stack -n monitorizacion --create-namespace

# que Prometheus recoja las métricas de tu servicio
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata: { name: tareas-api, labels: { release: monitorizacion } }
spec:
  selector: { matchLabels: { app: tareas-api } }
  endpoints: [{ port: http, path: /actuator/prometheus, interval: 15s }]</div>
     <p>La etiqueta <code>release: monitorizacion</code> no es decorativa: el Prometheus del chart solo mira los ServiceMonitor que la llevan. Es el motivo número uno de «mi ServiceMonitor no hace nada».</p>`},
 {t:"info", eti:"Lo que hay que vigilar", h:"Consultas del día a día",
  c:`<div class="termbox"># contenedores que se han reiniciado en la última hora
increase(kube_pod_container_status_restarts_total[1h]) &gt; 0

# el último reinicio fue por falta de memoria
kube_pod_container_status_last_terminated_reason{reason="OOMKilled"} == 1

# memoria usada frente al límite
sum by (namespace, pod, container) (container_memory_working_set_bytes{container!=""})
  / sum by (namespace, pod, container) (kube_pod_container_resource_limits{resource="memory"})

# fracción de periodos en que la CPU del contenedor fue estrangulada por su límite
sum by (pod) (rate(container_cpu_cfs_throttled_periods_total[5m]))
  / sum by (pod) (rate(container_cpu_cfs_periods_total[5m]))

# despliegues con réplicas no disponibles
kube_deployment_status_replicas_unavailable &gt; 0

# pods atascados en Pending
sum by (namespace) (kube_pod_status_phase{phase="Pending"}) &gt; 0</div>
     <div class="nota ojo"><b class="tit">Throttling</b>Un contenedor con límite de CPU puede ir lento con la CPU «al 40 %»: en los picos agota su cuota en cada periodo de 100 ms y espera. Si el throttling pasa del 25 %, revisa el límite (o quítalo y deja solo el request).</div>`},
 {t:"term", p:"Escribe la consulta que muestra los contenedores que se han reiniciado al menos una vez en la última hora",
  prompt:"PromQL ›",
  sol:["increase(kube_pod_container_status_restarts_total[1h]) > 0","increase(kube_pod_container_status_restarts_total[1h])>0","increase(kube_pod_container_status_restarts_total[60m]) > 0","changes(kube_pod_container_status_restarts_total[1h]) > 0"],
  salida:"{container=\"pagos\", namespace=\"pagos\", pod=\"pagos-7d9f8\"}   4\n{container=\"worker\", namespace=\"informes\", pod=\"worker-0\"}   1",
  pista:"increase del contador de reinicios de kube-state-metrics en [1h], mayor que 0.",
  why:"Cuatro reinicios en una hora es un CrashLoopBackOff en ciernes. Después miras el motivo con <code>kube_pod_container_status_last_terminated_reason</code> o <code>kubectl describe pod</code>."},
 {t:"term", p:"Escribe la fracción de throttling de CPU por pod: periodos estrangulados entre periodos totales, con rate a 5 minutos",
  prompt:"PromQL ›",
  sol:["sum by (pod) (rate(container_cpu_cfs_throttled_periods_total[5m])) / sum by (pod) (rate(container_cpu_cfs_periods_total[5m]))","sum(rate(container_cpu_cfs_throttled_periods_total[5m])) by (pod) / sum(rate(container_cpu_cfs_periods_total[5m])) by (pod)","sum by (pod) (rate(container_cpu_cfs_throttled_periods_total[5m]))/sum by (pod) (rate(container_cpu_cfs_periods_total[5m]))"],
  salida:"{pod=\"pagos-7d9f8\"}     0.41\n{pod=\"pedidos-5c4b2\"}   0.02",
  pista:"Dos sum by (pod) de rate: throttled_periods arriba, periods abajo.",
  why:"El 41 % de los periodos estrangulados explica latencias altas con CPU aparentemente baja. Es de las primeras cosas que mirar en un servicio lento en Kubernetes."},
 {t:"par", p:"Empareja cada componente con su función",
  pares:[["ServiceMonitor","Declarar qué servicios debe recoger Prometheus"],["PodMonitor","Recoger pods directamente, sin Service delante"],["PrometheusRule","Reglas de alerta y de grabación como objeto de Kubernetes"],["kube-state-metrics","Estado de los objetos: réplicas, reinicios, pods pendientes"],["node-exporter","Métricas de cada nodo"]],
  why:"Todo como código: las reglas y los monitores viajan en el chart de la aplicación, junto a su Deployment."},
 {t:"opcion", p:"Un pod se reinicia cada pocos minutos y <code>kubectl describe</code> dice «Last State: Terminated, Reason: OOMKilled». ¿Qué métrica lo habría anticipado?",
  ops:["La CPU del nodo","container_memory_working_set_bytes acercándose a kube_pod_container_resource_limits de memoria","up","El número de réplicas"],
  ok:1, why:"Una alerta cuando el working set pasa del 90 % del límite durante 15 minutos avisa antes de que el kernel mate el proceso. Y si crece sin parar, es una fuga: toca perfil de memoria."},
 {t:"vf", p:"kube-state-metrics mide cuánta CPU y memoria consume cada contenedor.",
  ok:false, why:"kube-state-metrics solo traduce el estado de la API (lo que dice el YAML y su estado): réplicas, fases, requests, limits. El consumo real viene de cAdvisor, a través del kubelet."},
 {t:"opcion", p:"Creaste un ServiceMonitor para tu API, pero en Prometheus no aparece ningún objetivo nuevo. El Service y el puerto están bien. ¿Qué miras primero?",
  ops:["La versión de Grafana","Que el ServiceMonitor tenga las etiquetas que selecciona el recurso Prometheus (por ejemplo release: monitorizacion) y que esté en un namespace que vigila","El número de réplicas","Los logs de la aplicación"],
  ok:1, why:"El recurso Prometheus tiene <code>serviceMonitorSelector</code> y <code>serviceMonitorNamespaceSelector</code>. Si tu objeto no cumple, el operador lo ignora sin quejarse."}
]},

/* =============== U8 L2 =============== */
{
id:"ob8n2",
titulo:"Escala, retención y costes",
claves:["Un Prometheus es un nodo: para alta disponibilidad, parejas idénticas; para retención larga y vista global, Thanos, Mimir o VictoriaMetrics","remote_write envía las muestras a un almacén central; el modo agente solo recoge y envía","Los costes crecen con series activas, GB de logs y spans guardados: se controlan descartando, muestreando y con retención por niveles"],
pasos:[
 {t:"info", eti:"Más allá de un nodo", h:"Alta disponibilidad y almacenamiento a largo plazo",
  c:`<div class="dg"><div class="dg-tit">arquitectura típica con thanos</div>
       <div class="dg-vert">
         <div class="dg-fila"><div class="dg-caja base">Prometheus A<small>replica="a" + sidecar</small></div><div class="dg-caja base">Prometheus B<small>replica="b" + sidecar</small></div></div>
         <div class="dg-caja ok">almacenamiento de objetos (S3)<small>los sidecars suben los bloques de 2 h</small></div>
         <div class="dg-caja acento doble">Thanos Querier<small>consulta los Prometheus y el almacén, y deduplica por la etiqueta replica</small></div>
         <div class="dg-caja">Grafana</div>
       </div>
     </div>
     <ul><li><b>Alta disponibilidad</b>: dos Prometheus idénticos recogen lo mismo. Si cae uno, el otro sigue; la capa de consulta elimina los duplicados.</li>
     <li><b>Thanos</b>: sidecar o Receive, Store Gateway, Compactor (compacta y reduce resolución a 5 min y 1 h para la historia larga) y Querier. <b>Mimir</b> y <b>VictoriaMetrics</b> reciben por <code>remote_write</code> y escalan horizontalmente con varios inquilinos.</li>
     <li><b>Federación</b>: un Prometheus central recoge <b>agregados</b> de otros (<code>/federate</code>). Sirve para resúmenes, no para copiar todas las series.</li>
     <li><b>Modo agente</b> (<code>prometheus --agent</code>): recoge y envía por <code>remote_write</code>, sin guardar ni evaluar reglas. Útil en clústeres periféricos.</li></ul>`},
 {t:"info", eti:"La factura", h:"Qué cuesta y cómo bajarlo",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">palancas de coste por señal</div><table class="dg-tabla"><thead><tr><th>Señal</th><th>Crece con</th><th>Palancas</th></tr></thead><tbody>
       <tr><td>Métricas</td><td>series activas y muestras por segundo</td><td>descartar métricas sin uso, quitar etiquetas, menos cubetas, scrape a 30 o 60 s donde baste, resolución reducida para la historia</td></tr>
       <tr><td>Logs</td><td>GB ingeridos y retención</td><td>filtrar DEBUG y comprobaciones de salud en el agente, muestrear logs repetitivos, retención distinta por tipo (auditoría frente a depuración)</td></tr>
       <tr><td>Trazas</td><td>spans guardados</td><td>muestreo por cola, quitar spans triviales, atributos acotados</td></tr>
     </tbody></table></div>
     <ul><li>Mide antes de recortar: <code>prometheus_tsdb_head_series</code>, <code>rate(prometheus_tsdb_head_samples_appended_total[5m])</code>, GB por día y por servicio en Loki, spans por segundo en el Collector.</li>
     <li><b>Repartir el coste</b> por equipo (etiquetas de namespace o equipo) cambia comportamientos: quien ve su factura limpia sus métricas.</li>
     <li>Retención típica: métricas en bruto 15–30 días y reducidas 13 meses (comparar con el año anterior); logs de depuración 7–30 días; logs de auditoría lo que exija la ley.</li></ul>`},
 {t:"term", p:"Escribe la consulta que muestra cuántas muestras por segundo está ingiriendo Prometheus (contador <code>prometheus_tsdb_head_samples_appended_total</code>)",
  prompt:"PromQL ›",
  sol:["rate(prometheus_tsdb_head_samples_appended_total[5m])","sum(rate(prometheus_tsdb_head_samples_appended_total[5m]))","rate(prometheus_tsdb_head_samples_appended_total[1m])","sum(rate(prometheus_tsdb_head_samples_appended_total[1m]))"],
  salida:"{instance=\"prometheus-0:9090\", job=\"prometheus\", type=\"float\"}   184320.5",
  pista:"rate del contador de muestras añadidas al head.",
  why:"Series activas y muestras por segundo son las dos cifras con las que se dimensiona Prometheus y con las que cobran los servicios gestionados."},
 {t:"hueco", p:"Completa la configuración para enviar todas las muestras a Mimir, descartando antes las series de <code>go_gc_</code>",
  tpl:"___:\n  - url: http://mimir:9009/api/v1/push\n    write_relabel_configs:\n      - source_labels: [__name__]\n        regex: \"go_gc_.*\"\n        action: ___",
  banco:["remote_write","drop","remote_read","keep","federate","replace"],
  sol:["remote_write","drop"],
  why:"<code>write_relabel_configs</code> filtra solo lo que se envía: puedes guardar en local con detalle y mandar al almacén central solo lo necesario."},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["Thanos Sidecar","Sube los bloques de Prometheus al almacenamiento de objetos"],["Thanos Querier","Consulta varias fuentes y deduplica réplicas"],["Thanos Compactor","Compacta bloques y reduce la resolución de la historia"],["remote_write","Envío continuo de muestras a un almacén central"],["Federación","Un Prometheus recoge agregados de otros"]],
  why:"Thanos añade piezas alrededor de Prometheus; Mimir y VictoriaMetrics reciben por remote_write. Las dos vías resuelven retención larga y vista global."},
 {t:"opcion", p:"Tienes dos Prometheus en alta disponibilidad y en Grafana cada línea sale duplicada. ¿Qué falta?",
  ops:["Apagar uno","Una capa de consulta que deduplique (Thanos Querier o el seguimiento de réplicas de Mimir) usando una etiqueta externa que distinga las réplicas","Bajar el scrape_interval","Cambiar de Grafana"],
  ok:1, why:"Cada réplica lleva <code>external_labels: { replica: a }</code> (o b); el Querier se queda con una de las dos series por cada pareja."},
 {t:"opcion", p:"La factura de logs se ha triplicado. El 60 % del volumen son líneas INFO de «GET /salud 200» de los balanceadores cada 5 segundos. ¿Qué haces primero?",
  ops:["Bajar la retención de todo a 1 día","Descartar esas líneas en el agente, antes de enviarlas: no aportan nada que no diga ya una métrica","Comprar más almacenamiento","Pasar todos los servicios a nivel ERROR"],
  ok:1, why:"Lo más barato es lo que no se envía. Recortar la retención de todo o silenciar los INFO útiles sacrifica capacidad de investigar para ahorrar lo que era ruido."},
 {t:"vf", p:"La federación es la forma recomendada de copiar todas las series de veinte Prometheus a uno central.",
  ok:false, why:"Federar todo satura el central y duplica el coste. Para una vista global con todo el detalle se usa remote_write a un almacén escalable o Thanos; la federación, para agregados."}
]},

/* =============== U8 L3 =============== */
{
id:"ob8n3",
titulo:"Guardias sostenibles",
claves:["Rotación con guardia principal y secundaria, relevo con notas y política de escalado con tiempos de reconocimiento","Carga limitada: pocas incidencias por turno, compensación y revisión semanal de las alertas","Runbooks: qué significa la alerta, cómo confirmarla, cómo mitigar y a quién escalar"],
pasos:[
 {t:"info", eti:"Estar de guardia", h:"Diseñar la rotación",
  c:`<ul><li><b>Principal y secundaria</b>: si la principal no reconoce la página en, por ejemplo, 5 minutos, salta a la secundaria; después, al responsable del equipo. Eso es la <b>política de escalado</b> (PagerDuty, Opsgenie, Grafana OnCall, incident.io…).</li>
     <li><b>Turnos</b> de una semana con relevo escrito (qué pasó, qué quedó abierto). Con equipos en varios husos horarios, <b>follow-the-sun</b>: nadie hace guardia de noche.</li>
     <li><b>Tamaño</b>: con menos de 5 o 6 personas en la rotación, cada una está de guardia demasiado a menudo y se quema.</li>
     <li><b>Carga</b>: el libro de SRE de Google propone como máximo unas 2 incidencias por turno de 12 horas, para poder investigar cada una a fondo y escribir su postmortem.</li>
     <li><b>Compensación</b> en tiempo o dinero, y derecho a descansar tras una noche mala.</li></ul>`},
 {t:"info", eti:"Medir la guardia", h:"Salud de las alertas y runbooks",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">indicadores de una guardia sana</div><table class="dg-tabla"><tbody>
       <tr><td>Páginas por turno</td><td>pocas, y en descenso</td></tr>
       <tr><td>% de páginas accionables</td><td>cerca del 100 %: si no había nada que hacer, la alerta sobra</td></tr>
       <tr><td>Páginas nocturnas</td><td>las que más desgastan: revísalas una a una</td></tr>
       <tr><td>MTTA</td><td>tiempo medio hasta reconocer la página</td></tr>
       <tr><td>Alertas repetidas</td><td>la misma alerta cinco veces a la semana pide un arreglo, no un reconocimiento</td></tr>
     </tbody></table></div>
     <div class="termbox"># Runbook: TasaErroresAlta (tareas-api)
Qué significa   más del 2 % de 5xx durante 10 minutos: los usuarios ven errores
Confirmar       panel "tareas-api / RED"; ¿un endpoint o todos? ¿una zona?
Mitigar         ¿despliegue reciente? → rollback (argocd app rollback tareas-api)
                ¿base de datos? → panel del pool; ver runbook "pool-agotado"
Escalar         si no mejora en 30 min: equipo de plataforma (#plataforma-guardia)</div>`},
 {t:"orden", p:"Ordena lo que pasa con una página que nadie contesta",
  items:["Salta la alerta y se notifica a la guardia principal","La principal no la reconoce en el tiempo marcado","Se escala a la guardia secundaria","Si tampoco responde, se escala al responsable del equipo","Quien la reconoce se hace cargo y lo anota en el canal del incidente"],
  why:"El escalado automático evita que una página se pierda porque alguien no oyó el móvil. Todo queda registrado para revisar después."},
 {t:"par", p:"Empareja cada término con su definición",
  pares:[["Política de escalado","A quién se avisa y cuándo si nadie reconoce la página"],["Follow-the-sun","Guardias repartidas por husos horarios para no cubrir noches"],["Relevo","Traspaso escrito del estado al terminar el turno"],["MTTA","Tiempo medio hasta que alguien reconoce la alerta"],["Runbook","Guía con los pasos para confirmar, mitigar y escalar una alerta"]],
  why:"Estas piezas son las que diferencian una guardia profesional de «el que sabe de esto tiene el móvil encendido»."},
 {t:"opcion", p:"El equipo recibe 40 páginas por semana, de las que 35 se resuelven solas antes de que nadie haga nada. ¿Qué haces?",
  ops:["Contratar a más gente para las guardias","Revisar esas alertas: degradar a ticket o panel las que no requieren acción, ajustar umbrales y for, o pasarlas a alertas por SLO","Silenciarlas todas de forma permanente","Poner el móvil en silencio de noche"],
  ok:1, why:"La fatiga de alertas es peligrosa: cuando llega la alerta que importa, se trata igual que las 35 falsas. Una revisión semanal de lo que sonó y por qué es la costumbre que lo evita."},
 {t:"vf", p:"Un equipo sano es el que tiene a una persona experta que resuelve todos los incidentes, aunque no esté de guardia.",
  ok:false, why:"Es un punto único de fallo y un camino rápido al agotamiento. El conocimiento debe estar en runbooks, paneles y en toda la rotación; los simulacros (<i>game days</i>) sirven para repartirlo."},
 {t:"escribe", p:"¿Cómo se llama la guía enlazada desde cada alerta con los pasos para confirmarla, mitigarla y escalarla?",
  sol:["runbook","runbooks","playbook","manual de operaciones"],
  pista:"En inglés; «libro de ejecución».",
  why:"Un buen runbook se escribe para alguien que no conoce el servicio y está medio dormido. Si un paso se repite siempre igual, se automatiza."},
 {t:"opcion", p:"¿Qué debe llevar como mínimo un runbook?",
  ops:["El código fuente del servicio","Qué significa la alerta y su impacto, cómo confirmarla, cómo mitigarla y a quién escalar","El organigrama de la empresa","Solo el nombre del responsable"],
  ok:1, why:"Con enlaces directos a los paneles y comandos listos para copiar. Se revisa después de cada incidente en el que se usó."}
]},

/* =============== U8 L4 =============== */
{
id:"ob5l3",
titulo:"Gestión de incidentes",
claves:["Declarar pronto, con severidad y un canal propio; roles separados: coordinador, operaciones, comunicación y quien toma notas","Primero mitigar (rollback, desactivar, desviar tráfico), después buscar la causa","Comunicar a intervalos fijos y medir MTTD, MTTA y MTTR"],
pasos:[
 {t:"info", eti:"Cuando algo se rompe", h:"Roles y severidades",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">roles en un incidente</div><table class="dg-tabla"><tbody>
       <tr><td>Coordinador (incident commander)</td><td>decide, reparte trabajo y mantiene la visión de conjunto; no depura</td></tr>
       <tr><td>Operaciones</td><td>investigan y aplican los cambios</td></tr>
       <tr><td>Comunicación</td><td>página de estado, clientes, dirección, soporte</td></tr>
       <tr><td>Escriba</td><td>anota la cronología: qué se vio, qué se decidió y cuándo</td></tr>
     </tbody></table></div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">severidades de ejemplo</div><table class="dg-tabla"><tbody>
       <tr><td>SEV1</td><td>caída total o pérdida de datos; todos a una, comunicación pública</td></tr>
       <tr><td>SEV2</td><td>función importante degradada para muchos usuarios</td></tr>
       <tr><td>SEV3</td><td>impacto menor o con alternativa; se resuelve en horario laboral</td></tr>
     </tbody></table></div>
     <p>Mejor declarar de más y cerrar pronto que declarar tarde. Un canal por incidente (<code>#inc-2026-09-22-pagos</code>), actualizaciones cada 30 minutos aunque no haya novedades y relevo explícito del coordinador si el incidente se alarga.</p>`},
 {t:"info", eti:"Parar la hemorragia", h:"Mitigar antes que entender",
  c:`<p>Las herramientas de mitigación deben estar preparadas <b>antes</b> del incidente:</p>
     <ul><li><b>Rollback</b> del último despliegue (la causa más frecuente de incidentes es un cambio).</li>
     <li><b>Desactivar</b> una funcionalidad con un <i>feature flag</i>.</li>
     <li><b>Desviar tráfico</b>: conmutar a otra región o zona, drenar un nodo.</li>
     <li><b>Escalar</b> o <b>descartar carga</b> (limitación de peticiones, apagar trabajos no críticos).</li></ul>
     <p>La causa raíz se busca con calma cuando los usuarios ya están bien. Métricas del proceso: <b>MTTD</b> (hasta detectar), <b>MTTA</b> (hasta reconocer), <b>MTTR</b> (hasta recuperar el servicio).</p>`},
 {t:"orden", p:"Ordena el ciclo de un incidente",
  items:["Detectar: salta una alerta basada en síntomas","Reconocer la alerta y declarar el incidente","Mitigar: rollback, escalar, desactivar la funcionalidad","Comunicar el estado a usuarios y equipo","Resolver la causa","Postmortem sin culpas con acciones"],
  why:"Primero mitigar, después investigar la causa a fondo. La comunicación, en realidad, empieza pronto y se repite durante todo el incidente."},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["Runbook enlazado en la alerta","Quien está de guardia sabe qué hacer a las 3 de la madrugada"],["Coordinador del incidente","Una persona decide y reparte el trabajo"],["Página de estado","Los usuarios saben qué pasa sin abrir tickets"],["Postmortem sin culpas","Aprender del sistema en vez de buscar culpables"],["MTTR","Medir cuánto se tarda en recuperar"]],
  why:"Esto se pregunta mucho en entrevistas de SRE y DevOps."},
 {t:"opcion", p:"Tras desplegar, los errores suben al 20 %. ¿Qué haces primero?",
  ops:["Leer todo el código del cambio","Revertir el despliegue para mitigar y luego investigar","Esperar a ver si baja","Añadir más réplicas"],
  ok:1, why:"Mitigar primero: cada minuto cuenta para el presupuesto de error. Si el rollback no lo arregla, también es información: la causa no era el despliegue."},
 {t:"vf", p:"El coordinador del incidente debe ser quien mejor conoce el sistema, y lo ideal es que depure él mismo el problema.",
  ok:false, why:"Si el coordinador se mete a depurar, nadie coordina: se duplican esfuerzos, nadie comunica y se pierden decisiones. El experto va a operaciones; el coordinador gestiona."},
 {t:"opcion", p:"El checkout falla para el 30 % de los usuarios desde hace 10 minutos. ¿Qué severidad y qué haces?",
  ops:["SEV3, lo miro mañana","SEV1 o SEV2 según vuestra escala: declarar ya, abrir canal, asignar coordinador y comunicar en la página de estado","Ninguna, es solo el 30 %","Esperar a que un cliente se queje"],
  ok:1, why:"Afecta al flujo que da dinero y a muchos usuarios. Mejor declararlo alto y rebajarlo luego que tardar en movilizar a la gente."},
 {t:"escribe", p:"¿Cómo se llama, en inglés y abreviado, la métrica del tiempo medio hasta recuperar el servicio?",
  sol:["MTTR","mttr"],
  pista:"Mean Time To…",
  why:"Mean Time To Recovery (o Restore). Junto con la frecuencia de cambios fallidos es una de las métricas DORA. Se baja con buena detección, runbooks y rollbacks rápidos."}
]},

/* =============== U8 L5 =============== */
{
id:"ob8n4",
titulo:"Postmortems sin culpa",
claves:["Se escriben tras cada incidente relevante: resumen, impacto, cronología, causas y factores contribuyentes, y acciones con responsable y fecha","Sin culpa: las personas actuaron con lo que sabían; se arregla el sistema que permitió el error","«Error humano» no es una causa; las acciones se clasifican en prevenir, detectar y mitigar, y se siguen hasta cerrarlas"],
pasos:[
 {t:"info", eti:"Aprender", h:"Qué lleva un postmortem",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">estructura de un postmortem</div><table class="dg-tabla"><tbody>
       <tr><td>Resumen</td><td>qué pasó en tres frases</td></tr>
       <tr><td>Impacto</td><td>usuarios afectados, duración, peticiones fallidas, presupuesto de error gastado, dinero</td></tr>
       <tr><td>Cronología</td><td>con horas: primer síntoma, detección, reconocimiento, mitigación, resolución</td></tr>
       <tr><td>Causas y factores contribuyentes</td><td>el desencadenante y todo lo que lo hizo posible o peor</td></tr>
       <tr><td>Qué fue bien, qué fue mal, dónde hubo suerte</td><td>la suerte es un riesgo que la próxima vez no estará</td></tr>
       <tr><td>Acciones</td><td>concretas, con responsable, fecha y prioridad</td></tr>
     </tbody></table></div>
     <p>Cuándo: caída visible para usuarios, pérdida de datos, intervención de la guardia, incumplimiento de SLO, o cuando la detección falló (lo encontró un cliente). Se revisa en grupo y se comparte: el valor está en que lo lea toda la organización.</p>`},
 {t:"info", eti:"Sin culpa", h:"Por qué y cómo",
  c:`<p>Si el postmortem busca culpables, la gente oculta información y el siguiente incidente será peor. El enfoque sin culpa asume que cada persona hizo lo razonable con lo que sabía en ese momento, y pregunta <b>qué del sistema</b> permitió el fallo.</p>
     <div class="dg"><div class="dg-tit">el mismo incidente, dos redacciones</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">con culpa</div><div class="dg-pila"><div class="dg-caja aviso">«Juan borró la tabla de producción por un descuido»</div><div class="dg-caja aviso">acción: «tener más cuidado»</div></div></div>
       <div class="dg-col"><div class="dg-col-tit">sin culpa</div><div class="dg-pila"><div class="dg-caja ok">«El script de limpieza aceptaba producción como destino sin confirmación, y las credenciales de pruebas daban acceso a producción»</div><div class="dg-caja ok">acciones: separar credenciales, confirmación en el script, restauración probada</div></div></div>
     </div></div>
     <p>Los «5 porqués» ayudan, pero empujan a una sola causa lineal. Los incidentes reales suelen tener varios <b>factores contribuyentes</b>: el cambio, la prueba que faltaba, la alerta que no saltó, el runbook desactualizado.</p>`},
 {t:"orden", p:"Ordena las secciones de un postmortem",
  items:["Resumen","Impacto","Cronología","Causas y factores contribuyentes","Qué fue bien, qué fue mal y dónde hubo suerte","Acciones con responsable y fecha"],
  why:"El resumen y el impacto arriba: mucha gente solo leerá eso. Las acciones al final, en una tabla que se pueda seguir."},
 {t:"par", p:"Empareja cada acción con su tipo",
  pares:[["Añadir una prueba de integración que habría detectado el fallo","Prevenir"],["Crear una alerta por burn rate para ese flujo","Detectar"],["Automatizar el rollback cuando falla la comprobación de salud","Mitigar"],["Actualizar el runbook con los pasos que funcionaron","Responder mejor la próxima vez"]],
  why:"Un buen postmortem tiene acciones de varios tipos: no solo evitar este fallo concreto, sino detectar y limitar los parecidos."},
 {t:"opcion", p:"¿Cómo reescribirías «La causa fue un error humano: María desplegó la configuración equivocada»?",
  ops:["Tal cual, es la verdad","«El despliegue permitió aplicar a producción una configuración de pruebas: no había validación del entorno ni revisión obligatoria de cambios de configuración»","«Alguien desplegó mal»","Quitar la frase del postmortem"],
  ok:1, why:"«Error humano» cierra la investigación justo donde empieza lo interesante: por qué el sistema dejó que un error normal llegara a producción."},
 {t:"vf", p:"Si las acciones de un postmortem no tienen responsable ni fecha, se considera terminado igualmente porque lo importante es haberlo escrito.",
  ok:false, why:"Las acciones sin dueño no se hacen, y el mismo incidente vuelve. Se siguen como cualquier otro trabajo del equipo y se revisa cuántas se cierran."},
 {t:"opcion", p:"Un incidente lo detectó un cliente por Twitter 40 minutos antes que vuestras alertas. ¿Qué debe recoger el postmortem sobre eso?",
  ops:["Nada, lo importante es la causa técnica","Que la detección falló: qué señal habría avisado antes (SLO, sonda sintética, métrica de negocio) y una acción para añadirla","Que el cliente exageró","Que hay que mirar Twitter más a menudo"],
  ok:1, why:"El tiempo de detección es parte del impacto. Un fallo de detección es un hallazgo tan importante como la causa del incidente."},
 {t:"escribe", p:"Si una acción consiste en «crear una alerta que avise en minutos si vuelve a pasar», ¿de qué tipo es: prevenir, detectar o mitigar?",
  sol:["detectar","detección","deteccion"],
  pista:"No evita que pase ni reduce el daño: hace que te enteres antes.",
  why:"Detectar antes reduce el impacto aunque la causa se repita. Prevenir evita que ocurra; mitigar limita el daño cuando ocurre."}
]}

]});
