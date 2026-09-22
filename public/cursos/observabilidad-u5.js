window.CURSOS = window.CURSOS || {};
(CURSOS.observabilidad = CURSOS.observabilidad || []).push({
titulo: "Alertas, SLOs y Kubernetes",
resumen: "Reglas de alerta y Alertmanager, alertas por SLO y burn rate, guardias y runbooks, y el stack de observabilidad en Kubernetes",
nivel: "Experto",
color: "#cf5454",
lecciones: [

{
id:"ob5l1",
titulo:"Alertas que merecen la pena",
claves:["Alertar por síntomas del usuario, no por cada causa posible","Alertmanager agrupa, silencia y enruta alertas (Slack, correo, PagerDuty)","Cada alerta con un runbook: qué significa y qué hacer"],
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
        labels: { severidad: critica }
        annotations:
          resumen: "Más del 2% de errores 5xx en tareas-api"
          runbook: "https://wiki.catappa.dev/runbooks/tareas-api-errores"</div>
     <p><code>for: 10m</code> evita alertas por picos de segundos. Alertmanager <b>agrupa</b> alertas relacionadas, permite <b>silenciar</b> durante un mantenimiento y las <b>enruta</b> según la severidad.</p>`},
 {t:"par", p:"Empareja cada práctica con su objetivo",
  pares:[["Alertar por síntomas","Avisar cuando los usuarios sufren, no por cada métrica rara"],["for: 10m","No disparar por picos momentáneos"],["Runbook enlazado","Saber qué hacer a las 3 de la madrugada"],["Agrupar en Alertmanager","Una notificación por incidente, no cien"],["Revisar alertas que nadie atiende","Evitar la fatiga de alertas"]],
  why:"Demasiadas alertas acaban ignoradas: todas deben ser accionables."},
 {t:"opcion", p:"¿Cuál es una mala alerta para despertar a alguien?",
  ops:["El 5% de las peticiones fallan desde hace 10 minutos","La CPU de un nodo está al 85% un momento","El presupuesto de errores del mes se agota en 2 horas","La API no responde en ninguna región"],
  ok:1, why:"Puede ser normal y no afectar a nadie: como mucho, un aviso no urgente."}
]},

{
id:"ob5l2",
titulo:"SLOs, burn rate y observabilidad en Kubernetes",
claves:["Alertas por burn rate: la velocidad a la que se consume el presupuesto de errores","Varias ventanas (1 h y 6 h) para detectar problemas rápidos y lentos","kube-prometheus-stack instala Prometheus, Alertmanager, Grafana y reglas para Kubernetes"],
pasos:[
 {t:"info", eti:"Alertar por objetivos", h:"Burn rate",
  c:`<div class="diag">SLO: 99,9% de exito en 30 dias -&gt; presupuesto de errores 0,1%
burn rate 1  = se gasta justo el presupuesto en 30 dias
burn rate 14 = se agotaria en ~2 dias  -&gt; alerta URGENTE (ventanas de 1 h y 5 min)
burn rate 6  = se agotaria en ~5 dias  -&gt; alerta urgente (ventanas de 6 h y 30 min)
burn rate 1  sostenido en 3 dias       -&gt; ticket, no urgente</div>`},
 {t:"info", eti:"En el clúster", h:"kube-prometheus-stack",
  c:`<div class="termbox">helm install monitorizacion prometheus-community/kube-prometheus-stack -n monitorizacion --create-namespace

# que Prometheus recoja las metricas de tu servicio
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata: { name: tareas-api, labels: { release: monitorizacion } }
spec:
  selector: { matchLabels: { app: tareas-api } }
  endpoints: [{ port: http, path: /actuator/prometheus, interval: 15s }]</div>`},
 {t:"par", p:"Empareja cada componente con su función",
  pares:[["ServiceMonitor","Declarar qué servicios debe recoger Prometheus"],["PrometheusRule","Reglas de alerta y de grabación como objeto de Kubernetes"],["kube-state-metrics","Estado de los objetos: réplicas, reinicios, pods pendientes"],["node-exporter","Métricas de cada nodo"],["Burn rate","Velocidad de consumo del presupuesto de errores"]],
  why:"Todo como código: las reglas y paneles viajan con la aplicación."},
 {t:"opcion", p:"¿Qué ventaja tiene alertar por burn rate frente a «error rate > 1%»?",
  ops:["Ninguna","Relaciona la alerta con el objetivo real: avisa rápido de lo grave y no molesta por picos que no ponen en riesgo el SLO","Es más fácil de escribir","No necesita métricas"],
  ok:1, why:"Es la recomendación del libro de SRE de Google."}
]},

{
id:"ob5l3",
titulo:"Guardias y gestión de incidentes",
claves:["Cada alerta enlaza a un runbook con los pasos a seguir","Roles en un incidente: coordinador, comunicación, operadores","Postmortem sin culpas con acciones concretas y responsables"],
pasos:[
 {t:"orden", p:"Ordena el ciclo de un incidente",
  items:["Detectar: salta una alerta basada en síntomas","Reconocer la alerta y declarar el incidente","Mitigar: rollback, escalar, desactivar la funcionalidad","Comunicar el estado a usuarios y equipo","Resolver la causa","Postmortem sin culpas con acciones"],
  why:"Primero mitigar, después investigar la causa a fondo."},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["Runbook enlazado en la alerta","Quien está de guardia sabe qué hacer a las 3 de la madrugada"],["Coordinador del incidente","Una persona decide y reparte el trabajo"],["Página de estado","Los usuarios saben qué pasa sin abrir tickets"],["Postmortem sin culpas","Aprender del sistema en vez de buscar culpables"],["MTTR","Medir cuánto se tarda en recuperar"]],
  why:"Esto se pregunta mucho en entrevistas de SRE y DevOps."},
 {t:"opcion", p:"Tras desplegar, los errores suben al 20 %. ¿Qué haces primero?",
  ops:["Leer todo el código del cambio","Revertir el despliegue para mitigar y luego investigar","Esperar a ver si baja","Añadir más réplicas"],
  ok:1, why:"Mitigar primero: cada minuto cuenta para el presupuesto de error."}
]}

]});
