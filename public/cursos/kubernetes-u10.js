window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Helm, Kustomize y GitOps",
resumen: "Empaquetar aplicaciones, gestionar entornos y desplegar desde Git con Argo CD",
nivel: "Experto",
color: "#3f6fc8",
lecciones: [

{
id:"k10l1",
titulo:"Helm",
claves:["Un chart es un paquete de plantillas de Kubernetes con valores configurables","helm install/upgrade/rollback gestionan releases","values.yaml por entorno; helm template para ver lo que se generará"],
pasos:[
 {t:"info", eti:"El gestor de paquetes", h:"Qué es Helm",
  c:`<p>Desplegar una aplicación real implica 8 o 10 manifiestos (Deployment, Service, Ingress, ConfigMap, HPA, PDB...), casi iguales entre entornos. <b>Helm</b> los empaqueta como un <b>chart</b>: plantillas con huecos que se rellenan con <b>valores</b>.</p>
     <div class="diag">api-chart/
├── Chart.yaml          nombre y version del chart
├── values.yaml         valores por defecto
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml</div>
     <div class="termbox"><span class="cm"># templates/deployment.yaml</span>
spec:
  replicas: {{ .Values.replicas }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.imagen.repositorio }}:{{ .Values.imagen.tag }}"</div>`},
 {t:"info", eti:"Uso", h:"Los comandos del día a día",
  c:`<div class="termbox">helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis -n datos --create-namespace
helm upgrade --install api ./api-chart -f values-prod.yaml --set imagen.tag=1.3.0
helm list -A                       <span class="cm"># releases instaladas</span>
helm history api                   <span class="cm"># revisiones</span>
helm rollback api 4                <span class="cm"># volver a la revision 4</span>
helm template api ./api-chart -f values-prod.yaml   <span class="cm"># ver el YAML sin aplicarlo</span>
helm uninstall api</div>`},
 {t:"par", p:"Empareja cada concepto de Helm con su definición",
  pares:[["Chart","El paquete de plantillas"],["values.yaml","Los valores configurables"],["Release","Una instalación concreta de un chart en el clúster"],["helm upgrade --install","Instalar o actualizar de forma idempotente"],["helm template","Generar el YAML final sin aplicarlo"]],
  why:"upgrade --install es lo que usan los pipelines: funciona tanto la primera vez como las siguientes."},
 {t:"opcion", p:"Quieres revisar exactamente qué YAML aplicará un chart con los valores de producción, sin tocar el clúster. ¿Qué usas?",
  ops:["helm install","helm template (o helm upgrade --dry-run)","helm rollback","helm list"],
  ok:1, why:"Revisar el YAML generado evita sorpresas, igual que terraform plan."},
 {t:"vf", p:"Helm permite volver a una revisión anterior de una release con un solo comando.",
  ok:true, why:"helm rollback nombre revisión. Guarda el historial en Secrets del namespace."}
]},

{
id:"k10l2",
titulo:"Kustomize",
claves:["Kustomize personaliza YAML sin plantillas: una base y overlays por entorno","Integrado en kubectl: kubectl apply -k","Patches, imágenes, réplicas y generadores de ConfigMaps con hash"],
pasos:[
 {t:"info", eti:"Sin plantillas", h:"Base y overlays",
  c:`<div class="diag">k8s/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays/
    ├── staging/kustomization.yaml
    └── produccion/
        ├── kustomization.yaml
        └── recursos.yaml         (patch: mas CPU y memoria)</div>
     <div class="termbox"><span class="cm"># overlays/produccion/kustomization.yaml</span>
resources: [../../base]
namespace: produccion
images:
  - name: ghcr.io/pablo/api
    newTag: "1.3.0"
replicas:
  - name: api
    count: 6
patches:
  - path: recursos.yaml
configMapGenerator:
  - name: api-config
    literals: [LOG_LEVEL=warn]</div>
     <div class="termbox">kubectl apply -k overlays/produccion
kubectl kustomize overlays/produccion     <span class="cm"># ver el resultado</span></div>`},
 {t:"par", p:"Empareja cada herramienta con su enfoque",
  pares:[["Helm","Plantillas con valores y gestión de releases"],["Kustomize","YAML normal con capas de parches por entorno"],["kubectl apply -k","Aplicar un directorio de Kustomize"],["configMapGenerator","Crear ConfigMaps con sufijo hash para forzar redespliegues"]],
  why:"Muchos equipos usan ambos: Helm para software de terceros y Kustomize para sus propias aplicaciones."},
 {t:"opcion", p:"¿Por qué el sufijo de hash del configMapGenerator es útil?",
  ops:["Por estética","Si cambia la configuración, cambia el nombre del ConfigMap referenciado en el Deployment, y eso provoca un rolling update automático","Para cifrar la configuración","Para ahorrar espacio"],
  ok:1, why:"Resuelve el problema de que cambiar un ConfigMap no reinicia los pods."},
 {t:"vf", p:"Kustomize necesita instalar un componente en el clúster.",
  ok:false, why:"Funciona en tu máquina (o en el CI) y genera YAML normal; kubectl lo trae integrado."}
]},

{
id:"k10l3",
titulo:"GitOps con Argo CD",
claves:["Git es la fuente de verdad del estado del clúster","Argo CD (o Flux) sincroniza el clúster con el repositorio y detecta desviaciones","Despliegue = Pull Request; rollback = git revert"],
pasos:[
 {t:"info", eti:"El modelo", h:"Qué es GitOps",
  c:`<p>En GitOps, el estado deseado del clúster vive en un <b>repositorio Git</b>. Un agente dentro del clúster (<b>Argo CD</b> o <b>Flux</b>) compara continuamente el repositorio con el clúster y los <b>sincroniza</b>.</p>
     <div class="diag">desarrollador --PR--> repo de manifiestos --(Argo CD observa)--> cluster
       CI: construye imagen y actualiza el tag en el repo  ^
                                                           | tira (pull), no empuja</div>
     <ul><li>Desplegar = fusionar un Pull Request.</li>
     <li>Rollback = <code>git revert</code>.</li>
     <li>Auditoría completa: quién cambió qué y cuándo está en Git.</li>
     <li>El CI no necesita credenciales del clúster: el agente <b>tira</b> de los cambios.</li></ul>`},
 {t:"info", eti:"Argo CD", h:"Una Application",
  c:`<div class="termbox">apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: api-produccion, namespace: argocd }
spec:
  project: default
  source:
    repoURL: https://github.com/pablo/despliegues.git
    path: api/overlays/produccion
    targetRevision: main
  destination: { server: https://kubernetes.default.svc, namespace: produccion }
  syncPolicy:
    automated:
      prune: true         <span class="cm"># borrar lo que ya no esta en Git</span>
      selfHeal: true      <span class="cm"># deshacer cambios manuales</span></div>`},
 {t:"par", p:"Empareja cada concepto de GitOps con su significado",
  pares:[["Fuente de verdad","El repositorio Git define el estado deseado"],["Sync","Aplicar al clúster lo que dice Git"],["Drift","El clúster se ha desviado de lo que dice Git"],["selfHeal","Deshacer automáticamente cambios manuales"],["prune","Eliminar recursos que ya no están en Git"]],
  why:"selfHeal hace que un kubectl edit manual en producción se revierta solo en segundos."},
 {t:"opcion", p:"Alguien cambia las réplicas en producción con <code>kubectl scale</code> y Argo CD tiene selfHeal. ¿Qué pasa?",
  ops:["Se mantiene el cambio","Argo CD detecta la desviación y vuelve a dejar las réplicas que dice Git","Se borra la aplicación","Se para Argo CD"],
  ok:1, why:"El cambio correcto se hace en Git. Por eso GitOps también es un control de cambios."},
 {t:"vf", p:"En GitOps el pipeline de CI necesita credenciales de administrador del clúster para desplegar.",
  ok:false, why:"El agente del clúster tira de Git; el CI solo publica la imagen y actualiza el repositorio. Menos credenciales sensibles repartidas."}
]},

{
id:"k10l4",
titulo:"Despliegues progresivos",
claves:["Argo Rollouts y Flagger hacen canary y blue-green automáticos","Análisis automático con métricas: si empeoran, rollback solo","Promoción por pasos: 10%, 30%, 60%, 100%"],
pasos:[
 {t:"info", eti:"Más allá del rolling update", h:"Canary automático",
  c:`<div class="termbox">apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata: { name: api }
spec:
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - analysis: { templates: [{ templateName: tasa-errores }] }
        - setWeight: 50
        - pause: { duration: 10m }
        - setWeight: 100</div>
     <p>El <b>análisis</b> consulta Prometheus («tasa de errores menor del 1%»). Si falla, <b>Argo Rollouts aborta y vuelve a la versión estable solo</b>, sin que nadie tenga que mirar.</p>`},
 {t:"orden", p:"Ordena un despliegue canary automatizado",
  items:["Enviar el 10% del tráfico a la versión nueva","Esperar y medir errores y latencia","Si el análisis pasa, subir al 50%","Volver a medir","Pasar al 100% y retirar la versión antigua"],
  why:"Si cualquier análisis falla, rollback automático: el daño queda limitado al porcentaje expuesto."},
 {t:"par", p:"Empareja cada herramienta con su papel",
  pares:[["Argo Rollouts","Canary y blue-green con análisis automático"],["Flagger","Despliegue progresivo integrado con mallas de servicio e Ingress"],["AnalysisTemplate","Qué métricas deben cumplirse para avanzar"],["Gateway API / malla de servicios","Repartir el tráfico por porcentajes"]],
  why:"Esto es entrega progresiva: la evolución madura del despliegue continuo."},
 {t:"vf", p:"Un despliegue canary con análisis automático puede revertir una versión mala sin intervención humana.",
  ok:true, why:"Es su principal ventaja: se reduce el tiempo de recuperación y el impacto."}
]}

]});
