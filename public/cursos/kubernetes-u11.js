window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Operar clústeres y extender Kubernetes",
resumen: "Observabilidad, depuración avanzada, actualizaciones del clúster, CRDs y el patrón operador",
nivel: "Experto",
color: "#3f6fc8",
lecciones: [

{
id:"k11l1",
titulo:"Observabilidad en Kubernetes",
claves:["metrics-server para kubectl top y el HPA; Prometheus para el resto","kube-state-metrics expone el estado de los objetos; node-exporter el de los nodos","Logs a stdout recogidos por un DaemonSet (Fluent Bit) hacia Loki o Elasticsearch"],
pasos:[
 {t:"info", eti:"El stack típico", h:"Métricas, logs y trazas en el clúster",
  c:`<ul><li><b>metrics-server</b>: CPU y memoria actuales. Alimenta <code>kubectl top</code> y el HPA. No guarda histórico.</li>
     <li><b>kube-prometheus-stack</b> (Helm): Prometheus + Alertmanager + Grafana + <b>kube-state-metrics</b> (estado de Deployments, pods, reinicios) + <b>node-exporter</b> (métricas de cada nodo) + reglas y paneles listos.</li>
     <li><b>Logs</b>: las aplicaciones escriben a stdout; un DaemonSet (<b>Fluent Bit</b>, Promtail, Vector) los recoge de cada nodo y los envía a <b>Loki</b> o Elasticsearch.</li>
     <li><b>Trazas</b>: OpenTelemetry Collector → Tempo o Jaeger.</li></ul>`},
 {t:"par", p:"Empareja cada componente con lo que aporta",
  pares:[["metrics-server","CPU y memoria actuales para kubectl top y el HPA"],["kube-state-metrics","Métricas del estado de los objetos (réplicas, reinicios)"],["node-exporter","Métricas del sistema operativo de cada nodo"],["Fluent Bit (DaemonSet)","Recoger los logs de todos los pods"],["Prometheus Operator","Gestionar Prometheus con objetos como ServiceMonitor"]],
  why:"Con ServiceMonitor, cada equipo declara cómo recoger las métricas de su servicio sin tocar la configuración central."},
 {t:"info", eti:"Alertas básicas", h:"Lo que siempre debería avisar",
  c:`<ul><li>Pods en <b>CrashLoopBackOff</b> o con muchos reinicios.</li>
     <li>Deployments con menos réplicas disponibles que las deseadas durante minutos.</li>
     <li>Nodos <b>NotReady</b>, o con presión de memoria o disco.</li>
     <li>PVCs cerca de llenarse.</li>
     <li>Y, sobre todo, los síntomas del servicio: tasa de errores y latencia (SLOs).</li></ul>`},
 {t:"opcion", p:"<code>kubectl top pods</code> devuelve «Metrics API not available». ¿Qué falta?",
  ops:["Prometheus","metrics-server instalado en el clúster","Un Ingress","Más nodos"],
  ok:1, why:"kubectl top y el HPA dependen de la Metrics API que expone metrics-server."},
 {t:"vf", p:"En Kubernetes, lo recomendable es que cada aplicación escriba sus logs en ficheros dentro de un volumen persistente.",
  ok:false, why:"stdout/stderr, y que la plataforma los recoja. Los ficheros dentro del pod se pierden y complican la recogida."}
]},

{
id:"k11l2",
titulo:"Depuración avanzada",
claves:["Eventos del clúster ordenados por tiempo: el primer sitio donde mirar","kubectl debug con contenedores efímeros para imágenes sin shell","Pods de prueba de red (netshoot) para diagnosticar DNS y conectividad"],
pasos:[
 {t:"info", eti:"Método", h:"De lo general a lo concreto",
  c:`<div class="termbox">kubectl get pods -A | grep -v Running            <span class="cm"># que no esta bien</span>
kubectl get events -A --sort-by=.lastTimestamp   <span class="cm"># que ha pasado ultimamente</span>
kubectl describe pod api-7d9f                    <span class="cm"># eventos de ese pod</span>
kubectl logs api-7d9f --previous                 <span class="cm"># el intento que murio</span>
kubectl get pod api-7d9f -o yaml                 <span class="cm"># estado completo (lastState, exitCode, reason)</span></div>`},
 {t:"info", eti:"Imágenes sin shell", h:"kubectl debug y contenedores efímeros",
  c:`<p>Las imágenes de producción buenas no tienen shell (distroless). ¿Cómo depurar?</p>
     <div class="termbox"><span class="cm"># contenedor efimero con herramientas, compartiendo procesos con "api"</span>
kubectl debug -it api-7d9f --image=nicolaka/netshoot --target=api

<span class="cm"># copia del pod con otro comando (para uno que no arranca)</span>
kubectl debug api-7d9f -it --copy-to=api-debug --container=api -- sh

<span class="cm"># depurar el propio nodo</span>
kubectl debug node/nodo-3 -it --image=ubuntu</div>`},
 {t:"par", p:"Empareja cada situación con la herramienta adecuada",
  pares:[["Imagen distroless sin shell","kubectl debug con un contenedor efímero"],["Pod que no arranca","kubectl debug --copy-to cambiando el comando"],["Probar DNS y conectividad","Un pod temporal con netshoot o busybox"],["Qué ha pasado en el clúster","kubectl get events --sort-by"],["Problema en el propio nodo","kubectl debug node/..."]],
  why:"kubectl debug es de las herramientas que distinguen a alguien que opera clústeres de verdad."},
 {t:"term", p:"Lanza un pod temporal de busybox para probar la resolución DNS de <code>api.pagos</code>, que se borre al terminar",
  prompt:"pablo@portatil:~$", sol:["kubectl run prueba --rm -it --image=busybox:1.36 -- nslookup api.pagos","kubectl run prueba -it --rm --image=busybox:1.36 -- nslookup api.pagos","kubectl run prueba --rm -it --image=busybox -- nslookup api.pagos","kubectl run -it --rm prueba --image=busybox:1.36 -- nslookup api.pagos"],
  pista:"kubectl run, --rm -it, --image=busybox:1.36, y tras -- el comando nslookup.",
  salida:`Server:    10.96.0.10
Address:   10.96.0.10:53
Name:      api.pagos.svc.cluster.local
Address:   10.96.143.22
pod "prueba" deleted`, why:"Si esto falla, el problema es DNS (CoreDNS o NetworkPolicies bloqueando el puerto 53), no tu aplicación."},
 {t:"vf", p:"Un contenedor efímero añadido con kubectl debug se puede quitar del pod después.",
  ok:false, why:"Los contenedores efímeros no se pueden eliminar del pod: desaparecen cuando el pod se recrea. Por eso se usan solo para depurar."}
]},

{
id:"k11l3",
titulo:"Actualizar el clúster",
claves:["Kubernetes publica una versión menor cada ~4 meses y mantiene unas 3","Orden: plano de control primero, luego nodos, versión a versión","Revisar APIs obsoletas antes (pluto, kubent)"],
pasos:[
 {t:"info", eti:"Ciclo de vida", h:"Un clúster hay que actualizarlo",
  c:`<p>Kubernetes saca una versión menor (1.30, 1.31, 1.32...) aproximadamente cada 4 meses, y cada una recibe parches alrededor de un año. En los servicios gestionados, quedarse atrás significa soporte extendido de pago o actualizaciones forzadas.</p>
     <p>Reglas de oro:</p>
     <ul><li>Se sube <b>una versión menor cada vez</b> (1.30 → 1.31 → 1.32).</li>
     <li>Primero el <b>plano de control</b>, después los <b>nodos</b> (el kubelet puede ir algo por detrás, nunca por delante).</li>
     <li>Antes, se buscan <b>APIs eliminadas</b> que aún uses (herramientas como pluto o kubent).</li></ul>`},
 {t:"orden", p:"Ordena una actualización de versión menor del clúster",
  items:["Leer las notas de la versión y buscar APIs eliminadas que uses","Actualizar manifiestos, charts y complementos incompatibles","Actualizar el plano de control","Actualizar los complementos del clúster (CNI, CoreDNS, kube-proxy)","Actualizar los nodos uno a uno (cordon, drain, reemplazar)","Verificar las aplicaciones y las alertas"],
  why:"Con PDBs bien configurados y réplicas repartidas, las aplicaciones no notan nada."},
 {t:"opcion", p:"Tu clúster está en 1.28 y quieres llegar a 1.31. ¿Cómo lo haces?",
  ops:["Directamente a 1.31","1.28 → 1.29 → 1.30 → 1.31, una versión menor cada vez","Borrar y crear uno nuevo siempre","Actualizar solo los nodos"],
  ok:1, why:"No se admite saltar versiones menores en el plano de control. Alternativa válida: un clúster nuevo y migrar (blue-green de clústeres)."},
 {t:"vf", p:"Los nodos pueden ejecutar una versión de kubelet más nueva que la del plano de control.",
  ok:false, why:"El kubelet nunca puede ser más nuevo que el API server; sí puede ir unas versiones por detrás. Por eso el plano de control se actualiza primero."}
]},

{
id:"k11l4",
titulo:"CRDs y operadores",
claves:["Una CustomResourceDefinition añade tipos nuevos a la API","Un operador es un controlador que gestiona esos recursos con conocimiento del dominio","Ejemplos: cert-manager, Prometheus Operator, CloudNativePG, Argo CD"],
pasos:[
 {t:"info", eti:"Extender la API", h:"CustomResourceDefinitions",
  c:`<p>Kubernetes se puede ampliar con tipos de objeto nuevos. Una <b>CRD</b> define, por ejemplo, el tipo <code>Certificate</code> o <code>Cluster</code> (de PostgreSQL), y a partir de ahí se crean con <code>kubectl apply</code> como cualquier otro objeto, con validación y RBAC.</p>
     <div class="termbox">kubectl get crds
kubectl get certificates -A          <span class="cm"># un tipo que antes no existia</span></div>`},
 {t:"info", eti:"El patrón", h:"Operador = CRD + controlador con conocimiento",
  c:`<p>Una CRD solo guarda datos. Un <b>operador</b> es un controlador que observa esos objetos y hace lo necesario para cumplirlos, con el conocimiento de un experto humano:</p>
     <div class="diag">tu escribes:   kind: Cluster (postgres), instances: 3, backup a S3
el operador:   crea StatefulSets, Services, configura la replicacion,
               programa backups, hace failover si cae el primario,
               actualiza versiones en orden</div>
     <p>Es el mismo bucle de reconciliación que los controladores internos, aplicado a tu dominio. Se construyen con frameworks como <b>Kubebuilder</b> u <b>Operator SDK</b> (en Go).</p>`},
 {t:"par", p:"Empareja cada operador con lo que gestiona",
  pares:[["cert-manager","Certificados TLS y su renovación"],["Prometheus Operator","Prometheus, alertas y ServiceMonitors"],["CloudNativePG","Clústeres de PostgreSQL"],["Strimzi","Clústeres de Kafka"],["Argo CD","Aplicaciones sincronizadas desde Git"]],
  why:"Casi todas las herramientas serias del ecosistema se instalan como operadores."},
 {t:"opcion", p:"¿Qué distingue a un operador de un simple chart de Helm?",
  ops:["Nada","Helm instala recursos una vez; un operador sigue vigilando y actuando continuamente (failover, backups, actualizaciones)","Los operadores no usan YAML","Helm es más potente"],
  ok:1, why:"Helm es instalación; un operador es operación continua automatizada."},
 {t:"vf", p:"Los controladores internos de Kubernetes (Deployments, ReplicaSets) siguen el mismo patrón que los operadores.",
  ok:true, why:"Observar el estado deseado, comparar con el real y actuar. Los operadores aplican ese patrón a tus propios recursos."}
]}

]});
