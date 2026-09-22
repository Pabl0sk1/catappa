window.CURSOS = window.CURSOS || {};
(CURSOS.kubernetes = CURSOS.kubernetes || []).push({
titulo: "Seguridad en Kubernetes",
resumen: "RBAC y ServiceAccounts, securityContext y Pod Security Standards, políticas de admisión y cadena de suministro",
nivel: "Experto",
color: "#3f6fc8",
lecciones: [

{
id:"k9l1",
titulo:"RBAC y ServiceAccounts",
claves:["Role/ClusterRole definen permisos; RoleBinding/ClusterRoleBinding los asignan","Cada pod actúa con una ServiceAccount; por defecto no necesita permisos","Mínimo privilegio: nada de cluster-admin para aplicaciones"],
pasos:[
 {t:"info", eti:"Quién puede qué", h:"Las cuatro piezas de RBAC",
  c:`<ul><li><b>Role</b>: permisos dentro de <b>un namespace</b> (verbos sobre recursos).</li>
     <li><b>ClusterRole</b>: permisos en todo el clúster o sobre recursos sin namespace (nodos).</li>
     <li><b>RoleBinding</b>: asigna un Role (o ClusterRole) a usuarios, grupos o ServiceAccounts en un namespace.</li>
     <li><b>ClusterRoleBinding</b>: lo asigna en todo el clúster.</li></ul>
     <div class="termbox">apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: leer-pods, namespace: pagos }
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: soporte-lee-pods, namespace: pagos }
subjects: [{ kind: Group, name: soporte }]
roleRef: { kind: Role, name: leer-pods, apiGroup: rbac.authorization.k8s.io }</div>`},
 {t:"par", p:"Empareja cada objeto RBAC con su función",
  pares:[["Role","Permisos dentro de un namespace"],["ClusterRole","Permisos a nivel de clúster"],["RoleBinding","Asignar permisos en un namespace"],["ClusterRoleBinding","Asignar permisos en todo el clúster"],["ServiceAccount","La identidad con la que actúa un pod"]],
  why:"RBAC es aditivo: no hay reglas de «denegar»; lo que no se concede está prohibido."},
 {t:"info", eti:"Identidad de los pods", h:"ServiceAccounts",
  c:`<p>Cada pod se ejecuta con una <b>ServiceAccount</b> (la <code>default</code> del namespace si no dices nada) y recibe un token para hablar con la API. La mayoría de aplicaciones <b>no necesita hablar con la API</b>:</p>
     <div class="termbox">apiVersion: v1
kind: ServiceAccount
metadata: { name: api }
automountServiceAccountToken: false     <span class="cm"># si no la necesita, sin token</span></div>
     <p>En la nube, la ServiceAccount también se enlaza con una identidad del proveedor (IRSA en EKS, Workload Identity en GKE) para acceder a S3 o a Secrets Manager sin claves.</p>`},
 {t:"term", p:"Comprueba si la ServiceAccount <code>api</code> del namespace <code>pagos</code> puede borrar pods",
  prompt:"pablo@portatil:~$", sol:["kubectl auth can-i delete pods --as=system:serviceaccount:pagos:api -n pagos","kubectl auth can-i delete pods -n pagos --as=system:serviceaccount:pagos:api","kubectl auth can-i delete pods --as system:serviceaccount:pagos:api -n pagos"],
  pista:"kubectl auth can-i, el verbo y recurso, --as con la identidad y -n.",
  salida:`no`, why:"kubectl auth can-i es la forma de auditar permisos sin adivinar."},
 {t:"opcion", p:"Un pod de la aplicación tiene cluster-admin «para que no dé problemas». ¿Cuál es el riesgo?",
  ops:["Ninguno","Si alguien compromete ese pod, controla el clúster entero con su token","Que va más lento","Que no puede escalar"],
  ok:1, why:"Mínimo privilegio también dentro del clúster."},
 {t:"vf", p:"RBAC permite escribir reglas explícitas de denegación.",
  ok:false, why:"Solo concede. Todo lo que no se conceda está denegado. Para prohibiciones explícitas se usan políticas de admisión."}
]},

{
id:"k9l2",
titulo:"securityContext y Pod Security Standards",
claves:["runAsNonRoot, readOnlyRootFilesystem, allowPrivilegeEscalation: false, capabilities drop ALL","Pod Security Standards: privileged, baseline, restricted","Se aplican por namespace con labels de Pod Security Admission"],
pasos:[
 {t:"info", eti:"Endurecer el pod", h:"El securityContext recomendado",
  c:`<div class="termbox">spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    fsGroup: 10001
    seccompProfile: { type: RuntimeDefault }
  containers:
    - name: api
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities: { drop: ["ALL"] }
      volumeMounts:
        - { name: tmp, mountPath: /tmp }    <span class="cm"># lo unico escribible</span>
  volumes:
    - { name: tmp, emptyDir: {} }</div>
     <p>Es la versión Kubernetes de lo que viste en Docker (<code>USER</code>, <code>--read-only</code>, <code>--cap-drop ALL</code>).</p>`},
 {t:"par", p:"Empareja cada ajuste con lo que previene",
  pares:[["runAsNonRoot","Que el proceso corra como root"],["readOnlyRootFilesystem","Que se modifiquen los ficheros de la imagen (malware persistente)"],["allowPrivilegeEscalation: false","Ganar privilegios con binarios setuid"],["capabilities drop ALL","Usar poderes especiales del kernel"],["seccompProfile RuntimeDefault","Llamadas al sistema peligrosas"]],
  why:"Con estos cinco ajustes, un pod comprometido tiene muy poco margen de maniobra."},
 {t:"info", eti:"Estándares", h:"Pod Security Standards",
  c:`<ul><li><b>privileged</b>: sin restricciones (solo para componentes del sistema).</li>
     <li><b>baseline</b>: impide lo claramente peligroso (hostNetwork, privileged, hostPath...).</li>
     <li><b>restricted</b>: las buenas prácticas completas (no root, drop ALL, seccomp...).</li></ul>
     <div class="termbox">kubectl label namespace pagos \\
  pod-security.kubernetes.io/enforce=restricted \\
  pod-security.kubernetes.io/warn=restricted</div>
     <p>El controlador integrado <b>Pod Security Admission</b> rechaza los pods que no cumplen el nivel del namespace.</p>`},
 {t:"opcion", p:"Aplicas <code>enforce=restricted</code> a un namespace y un Deployment deja de crear pods. ¿Qué miras?",
  ops:["Los logs del pod (no existe)","Los eventos del ReplicaSet (kubectl describe rs): dirán qué campo viola la política, por ejemplo runAsNonRoot","El DNS","El Ingress"],
  ok:1, why:"El pod ni siquiera se crea: el rechazo aparece en los eventos del controlador que intenta crearlo."},
 {t:"vf", p:"Un contenedor con <code>privileged: true</code> tiene prácticamente acceso total al nodo.",
  ok:true, why:"Por eso está prohibido en baseline y restricted. Solo para casos muy concretos del sistema."}
]},

{
id:"k9l3",
titulo:"Políticas de admisión y cadena de suministro",
claves:["Kyverno u OPA Gatekeeper validan y modifican objetos antes de crearse","Ejemplos: prohibir latest, exigir requests, exigir labels, solo registries propios","Firmar imágenes (cosign) y verificar la firma en la admisión"],
pasos:[
 {t:"info", eti:"Reglas del clúster", h:"Admission controllers",
  c:`<p>Antes de guardar un objeto, el API server lo pasa por <b>controladores de admisión</b> que pueden <b>rechazarlo</b> (validación) o <b>modificarlo</b> (mutación). Con <b>Kyverno</b> o <b>OPA Gatekeeper</b> escribes tus propias reglas:</p>
     <div class="termbox">apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata: { name: prohibir-latest }
spec:
  validationFailureAction: Enforce
  rules:
    - name: tag-fijo
      match: { any: [{ resources: { kinds: [Pod] } }] }
      validate:
        message: "Usa un tag de imagen fijo, no latest"
        pattern:
          spec:
            containers:
              - image: "!*:latest"</div>`},
 {t:"par", p:"Empareja cada política con el riesgo que evita",
  pares:[["Prohibir :latest","Despliegues no reproducibles"],["Exigir requests y limits","Pods que desestabilizan los nodos"],["Solo registries propios","Imágenes de origen desconocido"],["Exigir imágenes firmadas","Imágenes manipuladas en la cadena de suministro"]],
  why:"Las políticas convierten las buenas prácticas en obligatorias para todos los equipos."},
 {t:"info", eti:"Cadena de suministro", h:"Firmar y verificar imágenes",
  c:`<div class="termbox">cosign sign ghcr.io/pablo/api@sha256:9f3c...       <span class="cm"># en el CI, tras construir</span>
cosign verify ghcr.io/pablo/api@sha256:9f3c... \\
  --certificate-identity-regexp "github.com/pablo/.*" \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com</div>
     <p>Con firma sin claves (keyless) desde GitHub Actions, y una política de admisión que exige la firma, solo pueden ejecutarse imágenes construidas por tu pipeline. Referenciar la imagen por <b>digest</b> (<code>@sha256:...</code>) garantiza que nadie la cambia bajo el mismo tag.</p>`},
 {t:"opcion", p:"¿Por qué referenciar imágenes por digest (<code>@sha256:...</code>) en lugar de solo por tag?",
  ops:["Porque es más corto","Porque un tag se puede reasignar a otra imagen; el digest identifica exactamente un contenido","Porque los tags no existen en Kubernetes","Porque es más rápido de descargar"],
  ok:1, why:"Inmutabilidad real: lo que se probó es exactamente lo que se ejecuta."},
 {t:"vf", p:"Una política de mutación puede añadir automáticamente un securityContext por defecto a los pods que no lo tengan.",
  ok:true, why:"Kyverno puede tanto validar como mutar. Útil para aplicar buenos valores por defecto sin depender de cada equipo."}
]}

]});
