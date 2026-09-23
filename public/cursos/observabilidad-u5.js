window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Alertas y paneles",
resumen: "Reglas de alerta accionables sobre síntomas, Alertmanager a fondo (agrupar, enrutar, inhibir, silenciar) y paneles de Grafana que sirven en un incidente",
nivel: "Avanzado",
color: "#d45a5a",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"ob5l1",
titulo:"Alertas que merecen la pena",
claves:["Alertar por síntomas del usuario, no por cada causa posible; lo demás, a paneles o tickets","Una alerta pasa por inactive, pending (durante el for) y firing; keep_firing_for evita que parpadee","Cada alerta con severidad, resumen con datos y enlace al runbook"],
pasos:[
 {t:"info", eti:"Despertar solo cuando hace falta", h:"Reglas de alerta",
  c:`<div class="termbox">groups:
  - name: tareas-api
    rules:
      - alert: TasaErroresAlta
        expr: |
          sum(rate(http_server_requests_seconds_count{job="tareas-api",status=~"5.."}[5m]))
          / sum(rate(http_server_requests_seconds_count{job="tareas-api"}[5m])) &gt; 0.02
        for: 10m
        keep_firing_for: 5m
        labels:
          severidad: critica
          equipo: tareas
        annotations:
          resumen: "{{ $value | humanizePercentage }} de errores 5xx en tareas-api"
          runbook: "https://wiki.catappa.dev/runbooks/tareas-api-errores"</div>
     <ul><li><code>for: 10m</code>: la condición debe cumplirse 10 minutos seguidos; mientras tanto la alerta está <b>pending</b>. Evita alertas por picos de segundos.</li>
     <li><code>keep_firing_for</code>: sigue disparada un rato tras dejar de cumplirse, para que no se resuelva y vuelva a abrirse cada minuto.</li>
     <li><b>labels</b> sirven para enrutar (severidad, equipo); <b>annotations</b>, para que la persona entienda: resumen con el valor real (<code>{{ $value }}</code>, <code>{{ $labels.instance }}</code>) y runbook.</li></ul>`},
 {t:"info", eti:"El criterio", h:"Qué merece despertar a alguien",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">síntomas frente a causas</div><table class="dg-tabla"><thead><tr><th></th><th>Alerta por síntoma</th><th>Alerta por causa</th></tr></thead><tbody>
       <tr><td>Ejemplo</td><td>el 5 % de los pagos falla</td><td>CPU al 90 %, un pod reiniciado, réplica de base de datos con retraso</td></tr>
       <tr><td>¿Afecta al usuario?</td><td>siempre</td><td>a veces sí, a menudo no</td></tr>
       <tr><td>¿Cubre lo imprevisto?</td><td>sí: da igual qué lo cause</td><td>solo las causas que enumeraste</td></tr>
       <tr><td>Destino</td><td>aviso urgente (página)</td><td>panel, ticket o aviso no urgente</td></tr>
     </tbody></table></div>
     <p>Cada alerta que despierta a alguien debe ser <b>urgente</b>, <b>accionable</b> (hay algo que hacer ya) y <b>necesitar a una persona</b> (si un script lo arregla, automatízalo). Las que no cumplen, se degradan a ticket o se borran. Excepción razonable: causas que <b>van a</b> romper algo seguro y pronto (disco lleno en 4 horas, certificado que caduca en 7 días).</p>`},
 {t:"orden", p:"Ordena los estados por los que pasa una alerta con <code>for: 10m</code> cuando el problema aparece y luego se arregla",
  items:["inactive: la expresión no devuelve nada","pending: la expresión se cumple, pero aún no han pasado 10 minutos","firing: se cumple desde hace 10 minutos y se envía a Alertmanager","resuelta: la expresión deja de cumplirse (y pasa el keep_firing_for, si lo hay)"],
  why:"Si el problema desaparece durante <i>pending</i>, la alerta vuelve a inactive sin avisar a nadie: para eso existe el <code>for</code>."},
 {t:"par", p:"Empareja cada práctica con su objetivo",
  pares:[["Alertar por síntomas","Avisar cuando los usuarios sufren, no por cada métrica rara"],["for: 10m","No disparar por picos momentáneos"],["Runbook enlazado","Saber qué hacer a las 3 de la madrugada"],["Agrupar en Alertmanager","Una notificación por incidente, no cien"],["Revisar alertas que nadie atiende","Evitar la fatiga de alertas"]],
  why:"Demasiadas alertas acaban ignoradas: todas deben ser accionables."},
 {t:"opcion", p:"¿Cuál es una mala alerta para despertar a alguien?",
  ops:["El 5% de las peticiones fallan desde hace 10 minutos","La CPU de un nodo está al 85% un momento","El presupuesto de errores del mes se agota en 2 horas","La API no responde en ninguna región"],
  ok:1, why:"Puede ser normal y no afectar a nadie: como mucho, un aviso no urgente o un panel."},
 {t:"term", p:"En Prometheus, consulta qué alertas están disparadas ahora mismo",
  prompt:"PromQL ›",
  sol:['ALERTS{alertstate="firing"}','ALERTS{alertstate = "firing"}','ALERTS{alertstate=~"firing"}'],
  salida:"ALERTS{alertname=\"TasaErroresAlta\", alertstate=\"firing\", equipo=\"tareas\", severidad=\"critica\"}   1",
  pista:"Prometheus guarda las alertas en una serie especial llamada ALERTS, con la etiqueta alertstate.",
  why:"<code>ALERTS</code> también vale para paneles: cuántas alertas de cada severidad hubo por semana es un buen indicador de la salud de las guardias."},
 {t:"hueco", p:"Completa la regla para que solo avise si la condición dura 5 minutos y el resumen muestre la instancia",
  tpl:"- alert: InstanciaCaida\n  expr: up{job=\"api\"} == 0\n  ___: 5m\n  annotations:\n    resumen: \"{{ $labels.___ }} no responde al scrape\"",
  banco:["for","instance","keep_firing_for","job","value","wait"],
  sol:["for","instance"],
  why:"<code>$labels</code> tiene las etiquetas de la serie que disparó, y <code>$value</code> su valor. Un resumen con datos concretos ahorra el primer minuto de investigación."},
 {t:"escribe", p:"¿Cómo se llama el estado de una alerta cuya condición ya se cumple pero todavía no ha superado su <code>for</code>?",
  sol:["pending","pendiente"],
  pista:"En inglés, «pendiente».",
  why:"En la interfaz de Prometheus (Alerts) aparecen en amarillo. Muchas alertas que entran y salen de pending sin llegar a firing son una pista de umbrales mal ajustados."}
]},

/* =============== U5 L2 =============== */
{
id:"ob5n1",
titulo:"Alertmanager a fondo",
claves:["Prometheus evalúa y envía; Alertmanager deduplica, agrupa, inhibe, silencia y enruta","group_wait, group_interval y repeat_interval controlan cuándo y cada cuánto se notifica","Alta disponibilidad con varias réplicas en clúster y una alerta Watchdog como interruptor de hombre muerto"],
pasos:[
 {t:"info", eti:"El cartero", h:"Del disparo a la notificación",
  c:`<div class="dg"><div class="dg-tit">qué hace alertmanager con cada alerta</div>
       <div class="dg-flujo">
         <div class="dg-caja base">Prometheus envía alertas firing</div>
         <div class="dg-caja">deduplica<small>varias réplicas de Prometheus</small></div>
         <div class="dg-caja">agrupa<small>por group_by</small></div>
         <div class="dg-caja">inhibe y silencia</div>
         <div class="dg-caja acento">enruta<small>árbol de rutas</small></div>
         <div class="dg-caja ok">notifica<small>PagerDuty, Slack, correo, webhook</small></div>
       </div>
     </div>
     <div class="termbox">route:
  receiver: slack-general
  group_by: [alertname, servicio]
  group_wait: 30s        # espera antes del primer aviso de un grupo nuevo
  group_interval: 5m     # espera antes de avisar de cambios en un grupo ya avisado
  repeat_interval: 4h    # recordatorio si sigue igual
  routes:
    - matchers: ['severidad="critica"']
      receiver: pagerduty-guardia
    - matchers: ['equipo="pagos"']
      receiver: slack-pagos

inhibit_rules:
  - source_matchers: ['alertname="ClusterCaido"']
    target_matchers: ['severidad=~"aviso|critica"']
    equal: [cluster]

receivers:
  - name: slack-general
    slack_configs: [{ channel: "#alertas" }]
  - name: pagerduty-guardia
    pagerduty_configs: [{ routing_key: "..." }]
  - name: slack-pagos
    slack_configs: [{ channel: "#pagos-alertas" }]</div>`},
 {t:"info", eti:"Que no falle el que avisa", h:"Alta disponibilidad y Watchdog",
  c:`<ul><li><b>Árbol de rutas</b>: una alerta baja por las rutas y se queda en la <b>primera</b> que coincide (salvo <code>continue: true</code>). Lo que no coincide con ninguna va al receptor raíz.</li>
     <li><b>Inhibir</b> es automático y por reglas: si el clúster entero está caído, no mandes 300 alertas de sus servicios. <b>Silenciar</b> es manual y temporal: «durante el mantenimiento de 2 horas, calla las alertas de nodo-3».</li>
     <li><b>Alta disponibilidad</b>: tres réplicas de Alertmanager forman un clúster (se sincronizan silencios y notificaciones enviadas) y Prometheus envía a <b>todas</b>. No se ponen detrás de un balanceador.</li>
     <li><b>Watchdog</b>: una alerta que siempre está disparada (<code>expr: vector(1)</code>) y se envía a un servicio externo. Si deja de llegar, lo que falla es la cadena de alertas. Es el «interruptor de hombre muerto».</li></ul>
     <div class="nota ojo"><b class="tit">¿Quién vigila al vigilante?</b>Si Prometheus o Alertmanager se caen, ninguna alerta te lo dirá. El Watchdog, o una sonda externa sobre ellos, es obligatorio en producción.</div>`},
 {t:"term", p:"Valida el fichero <code>alertmanager.yml</code> antes de desplegarlo",
  prompt:"pablo@portatil:~/monitorizacion$",
  sol:["amtool check-config alertmanager.yml","amtool check-config ./alertmanager.yml"],
  salida:"Checking 'alertmanager.yml'  SUCCESS\nFound:\n - global config\n - route\n - 1 inhibit rules\n - 3 receivers\n - 0 templates",
  pista:"La herramienta de Alertmanager es amtool, y el subcomando lleva guion.",
  why:"Igual que <code>promtool</code> para Prometheus: a la tubería de CI, antes de desplegar."},
 {t:"term", p:"Comprueba a qué receptor iría una alerta con las etiquetas <code>severidad=critica</code> y <code>equipo=pagos</code>",
  prompt:"pablo@portatil:~/monitorizacion$",
  sol:["amtool config routes test --config.file=alertmanager.yml severidad=critica equipo=pagos","amtool config routes test --config.file alertmanager.yml severidad=critica equipo=pagos","amtool config routes test --config.file=alertmanager.yml equipo=pagos severidad=critica"],
  salida:"pagerduty-guardia",
  pista:"amtool config routes test, el fichero con --config.file, y las etiquetas al final.",
  why:"Va a PagerDuty y no a Slack de pagos porque la ruta de severidad crítica está antes y no tiene <code>continue</code>. Probar las rutas evita descubrir en un incidente que la alerta iba a un canal que nadie lee."},
 {t:"term", p:"Vas a ampliar el disco de <code>nodo-3</code>. Crea un silencio de 2 horas para la alerta <code>DiscoCasiLleno</code> de esa instancia, con un comentario",
  prompt:"pablo@portatil:~$",
  sol:["amtool silence add alertname=DiscoCasiLleno instance=nodo-3 --duration=2h --comment=\"Ampliando disco\"","amtool silence add alertname=DiscoCasiLleno instance=nodo-3 --duration 2h --comment \"Ampliando disco\"","amtool silence add --duration=2h --comment=\"Ampliando disco\" alertname=DiscoCasiLleno instance=nodo-3","amtool silence add alertname=DiscoCasiLleno instance=nodo-3 -d 2h -c \"Ampliando disco\""],
  salida:"d7b1c9e2-5a3f-4b8e-9f21-6c0a4e8b3d17",
  pista:"amtool silence add, los emparejadores etiqueta=valor, --duration y --comment.",
  why:"Siempre con duración y comentario: un silencio sin fecha de fin es la forma más común de que una alerta importante no suene nunca más."},
 {t:"par", p:"Empareja cada parámetro con su efecto",
  pares:[["group_wait","Cuánto esperar para juntar las primeras alertas de un grupo nuevo"],["group_interval","Cuánto esperar para avisar de alertas nuevas en un grupo ya notificado"],["repeat_interval","Cada cuánto recordar un grupo que sigue igual"],["group_by","Qué etiquetas definen un grupo"],["continue: true","Seguir evaluando rutas hermanas tras coincidir con una"]],
  why:"Con <code>group_by: [alertname, servicio]</code>, 40 pods del mismo servicio fallando llegan en una sola notificación."},
 {t:"opcion", p:"Se cae la red de un centro de datos y llegan 400 alertas: pods, bases de datos, sondas… todas por la misma causa. ¿Qué lo habría evitado?",
  ops:["Silenciar todo durante una semana","Una regla de inhibición: si está disparada la alerta del centro de datos caído, suprimir las de ese mismo centro de datos (equal: [datacenter])","Subir el repeat_interval","Quitar el group_by"],
  ok:1, why:"La inhibición deja visible la alerta que explica el problema y oculta sus consecuencias mientras dura. El silencio es manual; la inhibición, automática."},
 {t:"vf", p:"Para que Alertmanager sea de alta disponibilidad, se ponen varias réplicas detrás de un balanceador y Prometheus envía al balanceador.",
  ok:false, why:"Prometheus debe enviar a todas las réplicas; ellas se coordinan en clúster (gossip) para no notificar dos veces. Con un balanceador, cada réplica vería solo parte de las alertas."}
]},

/* =============== U5 L3 =============== */
{
id:"ob3l2",
titulo:"Paneles con Grafana",
claves:["Un buen panel responde en diez segundos: ¿funciona?, ¿desde cuándo no?, ¿dónde?","Síntomas arriba (RED frente al SLO), causas abajo (saturación, recursos), anotaciones de despliegue","Variables, $__rate_interval, unidades y paneles como código (JSON en Git, provisioning o Terraform)"],
pasos:[
 {t:"info", eti:"Visualizar", h:"Un panel útil",
  c:`<p>Un panel de servicio típico, de arriba abajo:</p>
     <ol><li>Tráfico, tasa de errores y p99 de latencia (RED), con las líneas de los SLO.</li>
     <li>Los mismos datos por endpoint.</li>
     <li>Saturación: pool de conexiones, hilos, colas.</li>
     <li>Recursos: CPU, memoria, GC.</li>
     <li>Marcas de despliegue (anotaciones) para ver si un cambio coincide con un problema.</li></ol>
     <p>Con <b>variables</b> (<code>$servicio</code>, <code>$entorno</code>) el mismo panel sirve para todos los servicios. Y guardado como JSON en Git (o con Terraform), se versiona como el código.</p>`},
 {t:"info", eti:"El oficio", h:"Tipos de panel, variables y paneles como código",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">qué panel para qué dato</div><table class="dg-tabla"><tbody>
       <tr><td>Time series</td><td>tasas, porcentajes y percentiles en el tiempo</td></tr>
       <tr><td>Stat</td><td>un número grande: disponibilidad del mes, presupuesto de errores restante</td></tr>
       <tr><td>Heatmap</td><td>la distribución completa de un histograma de latencias</td></tr>
       <tr><td>Table</td><td>listas: los 10 endpoints más lentos, pods con más reinicios</td></tr>
       <tr><td>Logs / Traces</td><td>resultados de Loki y Tempo junto a las métricas</td></tr>
     </tbody></table></div>
     <div class="termbox"># variable $servicio (tipo Query, fuente Prometheus)
label_values(up{entorno="$entorno"}, job)

# consulta del panel, usando la variable y la ventana automática
sum by (uri) (rate(http_server_requests_seconds_count{job="$servicio"}[$__rate_interval]))</div>
     <ul><li><b>Unidades</b> en cada panel (segundos, porcentaje, peticiones/s) y <b>umbrales</b> que coincidan con el SLO.</li>
     <li><b>Paneles como código</b>: ficheros JSON o YAML cargados con <i>provisioning</i>, el proveedor de Terraform o SDKs (Grafonnet, Grafana Foundation SDK). Un panel editado a mano en producción se pierde o diverge.</li>
     <li>Evita la <b>proliferación</b>: 400 paneles que nadie mantiene son peor que 20 buenos. Un panel por servicio con la misma estructura, y paneles de plataforma.</li></ul>`},
 {t:"par", p:"Empareja cada elemento de Grafana con su utilidad",
  pares:[["Fuente de datos","Prometheus, Loki, Tempo, PostgreSQL..."],["Variable de panel","Cambiar de servicio o entorno con un desplegable"],["Anotación","Marcar despliegues o incidentes en las gráficas"],["Umbral","Colorear cuando se supera un valor"],["Explore","Investigar consultas sin crear un panel"]],
  why:"Las anotaciones de despliegue ahorran mucho tiempo en los incidentes: la primera pregunta siempre es «¿qué cambió?»."},
 {t:"term", p:"Escribe la consulta de un panel que muestre las peticiones por segundo por <code>uri</code> del servicio elegido en la variable <code>$servicio</code> (etiqueta <code>job</code>), usando la ventana automática de Grafana",
  prompt:"PromQL ›",
  sol:['sum by (uri) (rate(http_server_requests_seconds_count{job="$servicio"}[$__rate_interval]))','sum(rate(http_server_requests_seconds_count{job="$servicio"}[$__rate_interval])) by (uri)','sum by (uri) (rate(http_server_requests_seconds_count{job=~"$servicio"}[$__rate_interval]))','sum(rate(http_server_requests_seconds_count{job=~"$servicio"}[$__rate_interval])) by (uri)'],
  salida:"{uri=\"/api/tareas\"}        48.2\n{uri=\"/api/tareas/{id}\"}   12.9",
  pista:"La misma consulta de tráfico de siempre, con job=\"$servicio\" y [$__rate_interval] como ventana.",
  why:"Si la variable admite varios valores, usa <code>=~</code>: Grafana la expande como <code>(a|b|c)</code>. <code>$__rate_interval</code> garantiza al menos cuatro scrapes por ventana sea cual sea el zoom."},
 {t:"hueco", p:"Completa la consulta de la variable que lista los <code>job</code> disponibles",
  tpl:"___(up, ___)",
  banco:["label_values","job","query_result","instance","metrics","label_names"],
  sol:["label_values","job"],
  why:"<code>label_values(métrica, etiqueta)</code> devuelve los valores distintos de esa etiqueta. Encadenando variables (la de servicio filtrada por la de entorno) se construyen paneles que sirven para todo."},
 {t:"opcion", p:"¿Qué debería mostrar arriba del todo el panel de un servicio?",
  ops:["La CPU de cada nodo","Tráfico, errores y latencia frente a sus objetivos: si los usuarios están bien o no","El número de commits","La temperatura del centro de datos"],
  ok:1, why:"Primero los síntomas; las causas, más abajo. En un incidente, quien abre el panel necesita saber en diez segundos si hay impacto."},
 {t:"vf", p:"Para ver la distribución de latencias de un histograma en el tiempo, lo mejor es un panel heatmap sobre las cubetas.",
  ok:true, why:"Consulta <code>sum by (le) (rate(x_bucket[$__rate_interval]))</code> con formato «heatmap». Se ven cosas que un percentil oculta, como dos grupos de peticiones rápidas y lentas."},
 {t:"opcion", p:"Alguien arregló a mano el panel de producción durante un incidente, y a la semana el cambio desapareció al redesplegar. ¿Qué práctica lo evita?",
  ops:["Prohibir editar paneles","Paneles como código: el JSON en Git, cambios por revisión y despliegue automático (provisioning o Terraform)","Hacer capturas de pantalla","Tener un panel por persona"],
  ok:1, why:"Igual que la infraestructura: si el panel está en Git, el arreglo se propone como cambio, se revisa y no se pierde."}
]}

]});
