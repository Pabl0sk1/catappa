window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Maestría: casos reales y entrevista",
resumen: "Diagnosticar incidentes de extremo a extremo y responder como alguien que opera Kubernetes",
nivel: "Maestro",
color: "#2f5fb8",
lecciones: [

{
id:"k12l1",
titulo:"Incidentes reales",
claves:["Síntoma → eventos → logs → estado del objeto → red","Cada estado de error tiene causas típicas conocidas","Mitigar primero (rollback), investigar después"],
pasos:[
 {t:"info", eti:"Caso 1", h:"«Tras el despliegue, 502 intermitentes»",
  c:`<ol><li><code>kubectl rollout status</code>: el despliegue terminó bien.</li>
     <li><code>kubectl get pods</code>: todos Running, algunos con reinicios.</li>
     <li><code>kubectl describe pod</code>: «Liveness probe failed» cada pocos minutos.</li>
     <li>La liveness llama a <code>/health</code>, que consulta la base de datos, que va lenta en picos: la liveness falla, se reinicia el pod, y mientras arranca, 502.</li>
     <li>Mitigar: aumentar el umbral. Corregir: liveness sin dependencias externas; la BD solo en readiness.</li></ol>`},
 {t:"opcion", p:"Caso 2: un Deployment nuevo tiene todos sus pods en <code>ImagePullBackOff</code>. ¿Qué compruebas?",
  ops:["La memoria del nodo","Nombre y tag de la imagen (existe en el registry), y las credenciales: imagePullSecrets o la identidad del nodo para ese registry privado","El Ingress","El HPA"],
  ok:1, why:"kubectl describe pod muestra el error exacto: «not found» (tag mal escrito) o «unauthorized» (credenciales)."},
 {t:"opcion", p:"Caso 3: pods en <code>Pending</code> con el evento «0/5 nodes are available: 3 Insufficient memory, 2 node(s) had untolerated taint». ¿Qué significa?",
  ops:["Un fallo de red","Tres nodos no tienen memoria suficiente para los requests y los otros dos tienen un taint que el pod no tolera","El pod no tiene imagen","El DNS falla"],
  ok:1, why:"Soluciones: bajar requests si están inflados, más capacidad (autoscaler) o una toleration si debe ir a esos nodos."},
 {t:"opcion", p:"Caso 4: la API no puede conectar con la base de datos desde que el equipo de plataforma aplicó políticas de red. ¿Qué miras?",
  ops:["Reiniciar la base de datos","Las NetworkPolicies de ambos namespaces: si hay «deny all», falta permitir el tráfico al puerto 5432 y también la salida DNS al 53","El HPA","Las requests"],
  ok:1, why:"Con egress restringido, olvidar el DNS hace que falle incluso resolver el nombre."},
 {t:"par", p:"Empareja cada síntoma con la causa más probable",
  pares:[["CrashLoopBackOff","La aplicación arranca y termina con error (config, dependencias)"],["OOMKilled","Límite de memoria insuficiente o fuga"],["Pending","Requests que no caben, taints o afinidades imposibles"],["Service sin endpoints","Selector que no coincide o pods no listos"],["Ingress sin respuesta","Falta Ingress Controller o ingressClassName"]],
  why:"Este mapa mental resuelve la mayoría de incidencias del día a día."},
 {t:"orden", p:"Ordena el método general de depuración en Kubernetes",
  items:["kubectl get pods (estado y reinicios)","kubectl describe (eventos)","kubectl logs --previous (qué dijo antes de morir)","kubectl get -o yaml (estado detallado, exit codes)","Pruebas de red desde dentro (debug, netshoot)"],
  why:"Dicho en voz alta en una entrevista, este método ya es media respuesta."}
]},

{
id:"k12l2",
titulo:"Simulacro de entrevista de Kubernetes",
claves:["Has repasado las preguntas más frecuentes de Kubernetes","Sabes explicar arquitectura, redes, despliegues y seguridad","Estás preparado para un puesto de DevOps, SRE o plataforma"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas, como en la entrevista",
  c:`<p>Contesta en voz alta antes de elegir. Si fallas, vuelve a la unidad correspondiente.</p>`},
 {t:"opcion", p:"«¿Qué ocurre, paso a paso, al hacer kubectl apply de un Deployment?»",
  ops:["El nodo descarga el YAML","El API server valida y guarda en etcd; el controlador de Deployments crea un ReplicaSet; este crea pods; el scheduler les asigna nodo; el kubelet de cada nodo pide al runtime arrancar los contenedores","kubectl conecta por SSH a los nodos","Se reinicia el clúster"],
  ok:1, why:"Mostrar el flujo entre componentes es lo que busca esta pregunta."},
 {t:"opcion", p:"«¿Diferencia entre Deployment y StatefulSet?»",
  ops:["Ninguna","Deployment: réplicas intercambiables sin estado. StatefulSet: identidad estable (nombres ordenados, DNS por pod) y un volumen propio por réplica","StatefulSet es más rápido","Deployment no permite réplicas"],
  ok:1, why:"Y añade: los StatefulSets arrancan y paran en orden."},
 {t:"opcion", p:"«¿Qué diferencia hay entre readiness y liveness?»",
  ops:["Son sinónimos","Readiness decide si el pod recibe tráfico (sin reiniciarlo); liveness decide si hay que reiniciarlo. La liveness no debe depender de servicios externos","Liveness solo existe en Jobs","Readiness reinicia el pod"],
  ok:1, why:"Mencionar la startupProbe para aplicaciones lentas suma puntos."},
 {t:"opcion", p:"«¿Cómo expones una aplicación a internet?»",
  ops:["Con un pod con IP pública","Con un Service ClusterIP detrás de un Ingress (o Gateway) servido por un Ingress Controller, con TLS de cert-manager; o un Service LoadBalancer si es tráfico no HTTP","Con NodePort en producción siempre","Abriendo el puerto del nodo"],
  ok:1, why:"Un solo punto de entrada, TLS centralizado, y servicios internos privados."},
 {t:"opcion", p:"«¿Cómo gestionas los secretos?»",
  ops:["En ConfigMaps","En Secrets con cifrado en reposo y RBAC estricto, y fuera de Git: External Secrets desde un gestor como Vault o AWS Secrets Manager, o Sealed Secrets/SOPS si deben vivir en Git","En la imagen","En variables del Dockerfile"],
  ok:1, why:"Y recuerda: base64 no es cifrado."},
 {t:"opcion", p:"«Un pod está en CrashLoopBackOff. ¿Qué haces?»",
  ops:["Borrar el namespace","kubectl describe para ver eventos y exit code; kubectl logs --previous para ver por qué murió; revisar configuración, secretos, dependencias y límites de memoria (OOMKilled)","Escalar a cero","Reiniciar el nodo"],
  ok:1, why:"Método ordenado: eventos, logs del intento anterior, estado del contenedor."},
 {t:"opcion", p:"«¿Cómo harías despliegues sin caída?»",
  ops:["Recreate","RollingUpdate con maxUnavailable 0, readinessProbe correcta, preStop y apagado elegante, PDB para mantenimientos; y canary con análisis automático para cambios arriesgados","Borrando y creando","Solo por la noche"],
  ok:1, why:"La respuesta completa encadena probes, apagado elegante, PDB y entrega progresiva."},
 {t:"opcion", p:"«¿Qué es GitOps y por qué lo usarías?»",
  ops:["Usar Git para el código","Git como fuente de verdad del estado del clúster; un agente (Argo CD, Flux) sincroniza y corrige desviaciones. Despliegues por PR, rollback con git revert, auditoría y menos credenciales en el CI","Un tipo de Service","Un plugin de red"],
  ok:1, why:"Y ventaja operativa: selfHeal revierte cambios manuales."},
 {t:"info", eti:"Terminado", h:"Has completado Kubernetes de cero a experto",
  c:`<p>Dominas la arquitectura, pods y controladores, redes y exposición, configuración y secretos, almacenamiento y aplicaciones con estado, salud y colocación, escalado, seguridad, empaquetado, GitOps, operación y extensibilidad.</p>
     <p>Para consolidarlo: monta un clúster con kind, despliega tu API de tareas con Kustomize, Postgres con CloudNativePG, un Ingress con TLS, y sincronízalo todo con Argo CD. Ese proyecto, en tu GitHub, vale más que cualquier certificado. Si quieres certificarte igualmente: CKA (administración) y CKAD (desarrollo).</p>`}
]}

]});
