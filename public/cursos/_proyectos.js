/* =====================================================================
   CATAPPA — proyectos por curso
   Cada proyecto se desbloquea cuando llevas terminadas las unidades que
   necesita (desdeUnidad), así que van de fácil a difícil según lo que ya
   sabes. Dos formas de entregarlo:
     · codigo    → se corrige de verdad, con casos de prueba
     · checklist → lo haces en tu máquina y marcas los criterios
   ===================================================================== */
window.PROYECTOS = {

/* ---------------- Git ---------------- */
git: [
{
    id: "gt-p1", titulo: "Tu primer repositorio con historia limpia", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "30 min",
    resumen: "Un repositorio de verdad: commits con sentido, cambios descartados sin drama y una historia que se lee.",
    objetivos: ["Iniciar un repositorio y hacer commits", "Escribir mensajes útiles", "Deshacer sin perder trabajo"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "Crea el repositorio",
        guia: "<p>Crea una carpeta nueva, entra en ella y conviértela en repositorio. Es un solo comando, y lo único que hace es crear la carpeta oculta <code>.git</code>.</p>",
        pista: "El comando de «inicializar», sin argumentos.",
        sol: ["git init", "git init ."],
        salida: "Initialized empty Git repository in /home/tu/proyecto/.git/",
        exito: "Ya tienes repositorio. Todo lo demás vive dentro de esa carpeta .git."
      },
      {
        id: "m2", tipo: "salida", titulo: "Tres commits con mensajes de persona",
        guia: "<p>Crea un <code>README.md</code> y haz <b>tres commits pequeños</b>, cada uno con un cambio y un mensaje en imperativo: «añade instalación», «corrige el enlace roto»…</p>" +
          "<p>Nada de «cambios», «wip» ni «arreglos». El mensaje es lo que leerá tu yo de dentro de seis meses.</p>" +
          "<p>Cuando los tengas, pega la historia.</p>",
        comando: "git log --oneline",
        patrones: ["([0-9a-f]{7,} .+\n){2}[0-9a-f]{7,} .+"],
        prohibidos: ["(^| )(wip|cambios|arreglos|test|asdf)( |$)"],
        pista: "git add README.md y luego git commit -m \"añade …\", tres veces.",
        exito: "Tres commits con mensajes que se entienden. Esa es la mitad del trabajo de Git bien hecho."
      },
      {
        id: "m3", tipo: "term", titulo: "Descarta un cambio que no querías",
        guia: "<p>Edita el README y arrepiéntete: quieres volver a como estaba <b>ese fichero</b>, sin tocar el resto.</p>" +
          "<p>Escribe el comando moderno para descartar los cambios del directorio de trabajo en <code>README.md</code>.</p>",
        pista: "El verbo es «restaurar», y lleva el nombre del fichero.",
        sol: ["git restore README.md", "git checkout -- README.md", "git restore readme.md"],
        salida: "",
        exito: "Cambio descartado. Ojo: esto no tiene deshacer, porque ese trabajo nunca llegó a Git."
      },
      {
        id: "m4", tipo: "term", titulo: "Deshaz el último commit, pero no el trabajo",
        guia: "<p>El último commit se te fue: querías separar dos cosas. Deshazlo <b>conservando los cambios</b> preparados, para volver a confirmarlos mejor.</p>" +
          "<p>Es el reset con la opción más suave.</p>",
        pista: "reset, la bandera que conserva todo en el área de preparación, y el commit anterior.",
        re: "^git reset --soft (head~1|head\^)$",
        sol: ["git reset --soft HEAD~1"],
        salida: "",
        exito: "El commit desapareció, tu trabajo no. Con --hard sí lo habrías perdido: esa es la diferencia que hay que tener grabada."
      },
      {
        id: "m5", tipo: "salida", titulo: "Mira tu historia de un vistazo",
        guia: "<p>Vuelve a confirmar lo que deshiciste y enseña la historia en formato compacto y con el grafo.</p>",
        comando: "git log --oneline --graph --all",
        patrones: ["[*]", "[0-9a-f]{7,}"],
        exito: "Historia limpia y legible. Esto es lo que verá quien revise tu trabajo."
      }
    ]
  },
  {
    id: "gt-p2", titulo: "Rama, conflicto y Pull Request", nivel: "Intermedio", desdeUnidad: 4, tiempo: "45 min",
    resumen: "Provoca un conflicto a propósito, resuélvelo bien y súbelo como Pull Request.",
    objetivos: ["Trabajar con ramas", "Resolver un conflicto de fusión", "Abrir un PR que se entienda"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "Crea la rama y cámbiate a ella",
        guia: "<p>Crea la rama <code>mejora-readme</code> y sitúate en ella con un solo comando.</p>",
        pista: "Hay dos formas: la clásica con checkout -b y la moderna con switch -c.",
        re: "^git (checkout -b|switch -c) mejora-readme$",
        sol: ["git checkout -b mejora-readme", "git switch -c mejora-readme"],
        salida: "Switched to a new branch 'mejora-readme'",
        exito: "Estás en la rama. Una rama no es una copia: es un puntero a un commit."
      },
      {
        id: "m2", tipo: "info", titulo: "Provoca el conflicto",
        guia: "<p>Ahora, a romperlo aposta:</p><ol>" +
          "<li>En <code>mejora-readme</code>, cambia la <b>primera línea</b> del README y haz commit.</li>" +
          "<li>Vuelve a <code>main</code> y cambia <b>esa misma línea</b> de otra forma. Commit.</li>" +
          "<li>Fusiona la rama: <code>git merge mejora-readme</code>.</li></ol>" +
          "<p>Git no puede decidir por ti cuál de las dos versiones vale. Eso es un conflicto, y no es un error: es Git pidiéndote criterio.</p>"
      },
      {
        id: "m3", tipo: "salida", titulo: "Mira el conflicto de frente",
        guia: "<p>Antes de arreglar nada, entiende qué te está diciendo. Pega el estado del repositorio con el conflicto abierto.</p>",
        comando: "git status",
        patrones: ["(both modified|ambos modificados|Unmerged paths|no fusionadas)"],
        pista: "Si ya lo resolviste, vuelve atrás con git merge --abort y repítelo.",
        exito: "Ahí está: fichero en conflicto y Git esperando tu decisión."
      },
      {
        id: "m4", tipo: "salida", titulo: "Resuélvelo y cierra la fusión",
        guia: "<p>Abre el fichero, borra los marcadores <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> y <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> y deja la versión buena (puede ser una mezcla de las dos).</p>" +
          "<p>Luego <code>git add</code> del fichero y <code>git commit</code>. Pega el README final.</p>",
        comando: "cat README.md",
        patrones: ["."],
        prohibidos: ["<<<<<<<", "=======", ">>>>>>>"],
        pista: "Si te dejas un marcador, el fichero queda roto. Por eso se revisa siempre después de resolver.",
        exito: "Sin marcadores y con tu versión. Conflicto resuelto como se debe."
      },
      {
        id: "m5", tipo: "salida", titulo: "Súbelo y ábrelo como Pull Request",
        guia: "<p>Sube la rama con <code>git push -u origin mejora-readme</code> y abre el Pull Request en GitHub.</p>" +
          "<p>En la descripción, tres cosas: qué cambia, por qué, y cómo comprobarlo.</p>" +
          "<p>Pega aquí el enlace del PR.</p>",
        comando: "(copia la URL del Pull Request)",
        patrones: ["https?://(github|gitlab|bitbucket).*(/pull/|/merge_requests/|/pull-requests/)[0-9]+"],
        exito: "PR abierto. A partir de aquí la conversación pasa a ser sobre el código, no sobre quién lo escribió."
      },
      {
        id: "m6", tipo: "check", titulo: "Cierra el ciclo",
        guia: "<p>Fusiona el PR desde GitHub, trae los cambios a tu main local y borra la rama.</p>",
        criterios: [
          "El PR está fusionado y la rama borrada",
          "Mi main local tiene ya el cambio (git pull)",
          "Sé explicar por qué el conflicto era inevitable"
        ]
      }
    ]
  },
  {
    id: "gt-p3", titulo: "Historia ordenada con rebase", nivel: "Avanzado", desdeUnidad: 5, tiempo: "40 min",
    resumen: "Coge una rama con commits desordenados y déjala presentable antes de fusionar.",
    objetivos: ["Usar rebase interactivo", "Juntar y renombrar commits", "Saber cuándo NO tocar la historia"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Fabrica el desorden",
        guia: "<p>En una rama nueva, haz <b>cinco commits</b> a lo bruto: un par que sean del mismo tema, alguno con mensaje malo tipo «wip», y otro que solo arregle una errata del anterior.</p>" +
          "<p>Así es como sale el trabajo de verdad: primero se resuelve, después se ordena.</p>"
      },
      {
        id: "m2", tipo: "term", titulo: "Abre el rebase interactivo",
        guia: "<p>Vas a reordenar tus commits tomando como base <code>main</code>. Escribe el comando que abre el editor con la lista.</p>",
        pista: "rebase, la bandera de interactivo, y la rama base.",
        re: "^git rebase (-i|--interactive) (main|master|head~5)$",
        sol: ["git rebase -i main"],
        salida: "pick a1b2c3d añade el lector\npick e4f5g6h wip\npick i7j8k9l corrige errata\npick m0n1o2p mas cosas\npick q3r4s5t ajustes\n\n# Rebase 9f8e7d6..q3r4s5t onto 9f8e7d6 (5 commands)",
        exito: "Esa lista es tu historia editable: cambia «pick» por «squash» o «reword» y Git la reescribe."
      },
      {
        id: "m3", tipo: "salida", titulo: "Deja la historia presentable",
        guia: "<p>Junta con <code>squash</code> (o <code>fixup</code>) los commits del mismo tema y usa <code>reword</code> para arreglar los mensajes malos.</p>" +
          "<p>El objetivo: que cada commit cuente <b>una idea completa</b> y compile por sí solo. Pega la historia resultante.</p>",
        comando: "git log --oneline main..HEAD",
        patrones: ["[0-9a-f]{7,} .+"],
        prohibidos: ["(^| )(wip|asdf|mas cosas|ajustes)( |$)", "(fixup!|squash!)"],
        pista: "Si te pierdes a mitad, git rebase --abort te devuelve a como estaba.",
        exito: "Menos commits y mejores mensajes. Quien revise esto va a tardar la mitad."
      },
      {
        id: "m4", tipo: "check", titulo: "La regla que no se rompe",
        guia: "<p>Rebase reescribe commits: los que había ya no existen, hay otros nuevos con el mismo contenido. Por eso hay una regla:</p>" +
          "<p><b>no reescribas historia que otros ya tienen</b>, salvo que lo habléis antes.</p>",
        criterios: [
          "Sé por qué rebase obliga a un push --force-with-lease",
          "Sé por qué eso es peligroso en una rama compartida",
          "Tengo claro cuándo usar merge en vez de rebase"
        ]
      }
    ]
  }
],

/* ---------------- Kubernetes ---------------- */
kubernetes: [
{
    id: "k8-p1", titulo: "Tu primer Deployment y Service", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "40 min",
    resumen: "Despliega una web con tres réplicas, publícala dentro del clúster y comprueba que se cura sola.",
    objetivos: ["Escribir un Deployment", "Exponerlo con un Service", "Ver que Kubernetes repone lo que falta"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Ten un clúster delante",
        guia: "<p>Necesitas un clúster local: <code>kind create cluster</code>, minikube o el de Docker Desktop.</p>" +
          "<p>Comprueba que tu <code>kubectl</code> habla con él y pega la salida.</p>",
        comando: "kubectl get nodes",
        patrones: ["Ready"],
        prohibidos: ["(refused|Unable to connect|no such host)"],
        pista: "Si da «connection refused», kubectl apunta a un clúster que no existe: revisa kubectl config current-context.",
        exito: "Clúster vivo y kubectl apuntando bien."
      },
      {
        id: "m2", tipo: "salida", titulo: "Escribe el Deployment",
        guia: "<p>Crea <code>deployment.yaml</code> con la imagen <code>nginx:1.27-alpine</code> y <code>replicas: 3</code>.</p>" +
          "<p>Acuérdate de que el <code>selector.matchLabels</code> tiene que coincidir con las etiquetas de la plantilla del pod: si no, el Deployment no encuentra sus propios pods.</p>" +
          "<p>Aplícalo y pega el fichero.</p>",
        comando: "cat deployment.yaml",
        patrones: ["kind: *Deployment", "replicas: *3", "nginx", "matchLabels"],
        prohibidos: ["image: *[a-z]+ *$", "nginx:latest"],
        exito: "Deployment bien formado, con versión fijada y selector coherente."
      },
      {
        id: "m3", tipo: "salida", titulo: "Tres pods en marcha",
        guia: "<p>Aplícalo con <code>kubectl apply -f deployment.yaml</code> y comprueba que los tres pods están <b>Running</b>.</p>",
        comando: "kubectl get pods -l app=web",
        patrones: ["(Running.*\n){2}.*Running"],
        prohibidos: ["(CrashLoopBackOff|ImagePullBackOff|ErrImagePull|Pending)"],
        pista: "Si se quedan en Pending, el clúster no tiene recursos; si es ImagePullBackOff, el nombre de la imagen está mal.",
        exito: "Tres pods corriendo. Kubernetes ya está manteniendo el estado que pediste."
      },
      {
        id: "m4", tipo: "salida", titulo: "Publícalo con un Service",
        guia: "<p>Crea un Service de tipo ClusterIP que apunte a esos pods y pruébalo con <code>kubectl port-forward svc/web 8080:80</code>.</p>" +
          "<p>Con el reenvío abierto, pide la página desde otra terminal y pega la respuesta.</p>",
        comando: "curl -s http://localhost:8080 | head -5",
        patrones: ["(nginx|<html|<!DOCTYPE)"],
        pista: "Si no responde, casi siempre el selector del Service no coincide con las etiquetas de los pods: kubectl get endpoints web te lo dice (sale vacío).",
        exito: "El Service reparte entre los tres pods. Los pods van y vienen; el Service es la dirección estable."
      },
      {
        id: "m5", tipo: "salida", titulo: "Mátalo y mira cómo se cura",
        guia: "<p>Borra un pod a mano. Kubernetes no lo va a resucitar: va a crear <b>uno nuevo</b>, porque tú pediste tres y él mantiene tres.</p>" +
          "<p>Bórralo y pega la lista justo después.</p>",
        comando: "kubectl delete pod -l app=web --field-selector status.phase=Running --wait=false; kubectl get pods -l app=web",
        patrones: ["(ContainerCreating|Running|Terminating)"],
        exito: "Ahí está el bucle de reconciliación: tú declaras el destino, Kubernetes se encarga del camino."
      }
    ]
  },
  {
    id: "k8-p2", titulo: "Configuración, secretos y sondas", nivel: "Intermedio", desdeUnidad: 6, tiempo: "50 min",
    resumen: "Saca la configuración de la imagen y enséñale a Kubernetes a distinguir «vivo» de «listo».",
    objetivos: ["Separar configuración del contenedor", "Guardar secretos fuera de la imagen", "Usar liveness y readiness"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Configuración fuera de la imagen",
        guia: "<p>Crea un ConfigMap con la configuración de la aplicación y móntalo como variables de entorno en el pod.</p>" +
          "<p>La misma imagen tiene que servir para desarrollo y para producción: lo único que cambia es esto.</p>",
        comando: "kubectl get configmap app-config -o yaml",
        patrones: ["kind: *ConfigMap", "data:"],
        exito: "Configuración fuera del contenedor. La imagen vuelve a ser la misma en todos los entornos."
      },
      {
        id: "m2", tipo: "salida", titulo: "El secreto, en su sitio",
        guia: "<p>Crea un Secret con la contraseña y úsalo en el pod con <code>valueFrom.secretKeyRef</code>.</p>" +
          "<p>Aviso importante: un Secret va en base64, que <b>no es cifrado</b>. Protege quién puede leerlo, no lo que contiene.</p>" +
          "<p>Pega la descripción del Secret (no su contenido).</p>",
        comando: "kubectl describe secret app-secret",
        patrones: ["Type: *Opaque", "bytes"],
        prohibidos: ["password: *[a-z0-9]{4,}"],
        exito: "Secreto creado y referenciado, sin contraseñas escritas en el YAML del Deployment."
      },
      {
        id: "m3", tipo: "salida", titulo: "Las dos sondas",
        guia: "<p>Añade al contenedor:</p><ul>" +
          "<li><code>readinessProbe</code>: ¿puedo recibir tráfico ya? Si falla, el Service deja de mandarle peticiones.</li>" +
          "<li><code>livenessProbe</code>: ¿sigo vivo? Si falla, Kubernetes reinicia el contenedor.</li></ul>" +
          "<p>Confundirlas es un clásico: un liveness demasiado agresivo reinicia en bucle una aplicación que solo tardaba en arrancar.</p>",
        comando: "kubectl get deploy web -o jsonpath=\"{.spec.template.spec.containers[0]}\" | tr ',' '\\n' | grep -i probe -A3",
        patrones: ["(readinessProbe|readiness)", "(livenessProbe|liveness)"],
        pista: "Si arranca lento, usa startupProbe en vez de subir el initialDelaySeconds del liveness.",
        exito: "Las dos sondas puestas y con distinto papel."
      },
      {
        id: "m4", tipo: "salida", titulo: "Rómpelo y míralo reiniciar",
        guia: "<p>Haz que la ruta de salud devuelva error (o para el proceso dentro del contenedor) y espera.</p>" +
          "<p>Pega la lista de pods: quiero ver la cuenta de reinicios subiendo.</p>",
        comando: "kubectl get pods -l app=web",
        patrones: ["[1-9][0-9]* *([0-9]+[smhd]|<invalid>)"],
        pista: "La columna RESTARTS es la que tiene que dejar de ser 0.",
        exito: "Reinicio automático funcionando. Eso es el liveness haciendo su trabajo."
      },
      {
        id: "m5", tipo: "check", titulo: "Lo que hay que tener claro",
        guia: "<p>Confirma que entiendes la diferencia, que en una entrevista cae seguro.</p>",
        criterios: [
          "Sé qué pasa si falla la readiness (deja de recibir tráfico, no se reinicia)",
          "Sé qué pasa si falla la liveness (se reinicia el contenedor)",
          "Sé por qué un Secret en base64 no está cifrado"
        ]
      }
    ]
  },
  {
    id: "k8-p3", titulo: "Escalar y actualizar sin cortes", nivel: "Avanzado", desdeUnidad: 9, tiempo: "55 min",
    resumen: "Cambia de versión con tráfico encima y demuestra, con datos, que nadie recibió un error.",
    objetivos: ["Configurar una actualización progresiva", "Medir el corte real", "Volver atrás cuando algo falla"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Configura el despliegue progresivo",
        guia: "<p>En el Deployment, pon <code>strategy.rollingUpdate</code> con <code>maxUnavailable: 0</code> y <code>maxSurge: 1</code>: primero se levanta el nuevo, después se retira el viejo.</p>",
        comando: "kubectl get deploy web -o yaml | grep -A5 strategy",
        patrones: ["RollingUpdate", "maxUnavailable: *0", "maxSurge"],
        exito: "Con maxUnavailable en 0 nunca bajas de la capacidad que tienes ahora."
      },
      {
        id: "m2", tipo: "info", titulo: "Pon el tráfico a correr",
        guia: "<p>Abre una terminal aparte y deja este bucle dando guerra mientras actualizas:</p>" +
          "<pre class=\"dg-pre\">while true; do curl -s -o /dev/null -w \"%{http_code} \" http://localhost:8080; sleep 0.2; done</pre>" +
          "<p>Sin tráfico durante el despliegue no estás probando nada: los cortes solo se ven con alguien llamando.</p>"
      },
      {
        id: "m3", tipo: "salida", titulo: "Cambia de versión y demuestra que no hubo corte",
        guia: "<p>Actualiza la imagen (<code>kubectl set image</code> o editando el YAML) y espera a que termine.</p>" +
          "<p>Pega la salida del bucle durante el despliegue: quiero ver solo doscientos.</p>",
        comando: "(pega lo que imprimió el bucle durante el despliegue)",
        patrones: ["200 200 200"],
        prohibidos: ["(000|502|503|504)"],
        pista: "Si aparecen 502 o 503, te falta readinessProbe: el Service manda tráfico a pods que aún no están listos.",
        exito: "Cambio de versión con tráfico encima y ni un error. Esto es lo que significa «sin cortes»."
      },
      {
        id: "m4", tipo: "salida", titulo: "Despliega algo roto y vuelve atrás",
        guia: "<p>Ahora a propósito: pon una imagen que no existe. Verás que el despliegue se queda atascado, pero <b>los pods viejos siguen sirviendo</b>.</p>" +
          "<p>Vuelve atrás con <code>kubectl rollout undo deployment/web</code> y pega el historial.</p>",
        comando: "kubectl rollout history deployment/web",
        patrones: ["REVISION", "[0-9]+"],
        exito: "Vuelta atrás en un comando. Por eso el despliegue progresivo no da miedo: siempre hay marcha atrás."
      },
      {
        id: "m5", tipo: "salida", titulo: "Escala y reparte",
        guia: "<p>Sube a cinco réplicas y comprueba que el Service reparte entre todas.</p>",
        comando: "kubectl scale deploy web --replicas=5 && kubectl get pods -l app=web --no-headers | wc -l",
        patrones: ["^ *5 *$"],
        exito: "Cinco réplicas. Con esto ya sabes lo básico para aguantar un pico de tráfico."
      }
    ]
  }
],

/* ---------------- DevOps ---------------- */
devops: [
{
    id: "dv-p1", titulo: "Mide tu proceso con las métricas DORA", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "40 min",
    resumen: "Saca los cuatro números que dicen si tu equipo entrega bien, y propón mejoras con datos delante.",
    objetivos: ["Entender las métricas DORA", "Medir antes de opinar", "Proponer mejoras priorizadas"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Los cuatro números",
        guia: "<p>DORA mide dos cosas: velocidad y estabilidad. Y resulta que los buenos equipos son buenos en las dos a la vez.</p><ul>" +
          "<li><b>Frecuencia de despliegue</b>: cada cuánto llega algo a producción.</li>" +
          "<li><b>Tiempo de entrega</b>: del commit a producción.</li>" +
          "<li><b>Porcentaje de cambios fallidos</b>: cuántos despliegues causan un incidente.</li>" +
          "<li><b>Tiempo de recuperación</b>: cuánto tardas en volver a estar bien.</li></ul>" +
          "<p>Elige un repositorio tuyo con algo de historia (o uno público activo) y vamos a calcularlos.</p>"
      },
      {
        id: "m2", tipo: "salida", titulo: "Frecuencia de despliegue",
        guia: "<p>Si despliegas por etiquetas o por merges a main, eso es tu proxy. Cuenta cuántos hubo en los últimos 30 días.</p>",
        comando: "git log --since=30.days --oneline --merges | wc -l",
        patrones: ["^ *[0-9]+ *$"],
        pista: "Sin merges, usa: git log --since=30.days --oneline main | wc -l",
        exito: "Ese es tu ritmo real. Menos de uno al mes es «bajo»; varios al día es «élite»."
      },
      {
        id: "m3", tipo: "salida", titulo: "Tiempo de entrega",
        guia: "<p>Coge los últimos commits que llegaron a producción y mira cuánto pasó entre que se escribieron y que se desplegaron.</p>" +
          "<p>Pega las fechas de los últimos diez commits de main.</p>",
        comando: "git log -10 --date=short --pretty=\"%ad %h %s\" main",
        patrones: ["[0-9]{4}-[0-9]{2}-[0-9]{2}"],
        exito: "Con esas fechas ya puedes estimar el retraso entre escribir y entregar."
      },
      {
        id: "m4", tipo: "check", titulo: "Estabilidad y plan",
        guia: "<p>Los otros dos números casi nunca están en Git: salen de incidencias, del canal de avisos o de la memoria del equipo. Estímalos con honestidad.</p>" +
          "<p>Escribe un <code>DORA.md</code> con los cuatro números y <b>tres mejoras ordenadas por impacto</b>. Una mejora buena es concreta: «pruebas automáticas en el PR», no «mejorar la calidad».</p>",
        criterios: [
          "Tengo un número para cada una de las cuatro métricas",
          "Las tres mejoras son concretas y accionables",
          "Sé cuál de las cuatro está peor y por qué"
        ]
      }
    ]
  },
  {
    id: "dv-p2", titulo: "Pipeline de CI en GitHub Actions", nivel: "Intermedio", desdeUnidad: 4, tiempo: "50 min",
    resumen: "Un flujo que compila, prueba y publica en cada push, con caché y secretos bien puestos.",
    objetivos: ["Escribir un workflow", "Aprovechar la caché", "Publicar sin filtrar credenciales"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El workflow mínimo",
        guia: "<p>Crea <code>.github/workflows/ci.yml</code> que se dispare en <code>push</code> y en <code>pull_request</code>, instale dependencias y ejecute las pruebas.</p>" +
          "<p>Fija las versiones de las acciones (<code>actions/checkout@v4</code>), no uses ramas móviles.</p>",
        comando: "cat .github/workflows/ci.yml",
        patrones: ["on:", "push", "pull_request", "runs-on:", "actions/checkout@v[0-9]"],
        prohibidos: ["@master", "@main"],
        exito: "Flujo disparado en cada push y en cada PR, con acciones fijadas."
      },
      {
        id: "m2", tipo: "salida", titulo: "Que el segundo build sea rápido",
        guia: "<p>Añade caché de dependencias (con <code>actions/cache</code> o el <code>cache:</code> de la acción de tu lenguaje).</p>" +
          "<p>Lanza dos veces y pega el trozo del log donde se ve que la segunda acertó la caché.</p>",
        comando: "(pega el paso de caché del segundo build)",
        patrones: ["(cache hit|Cache restored|cache-hit: *true|restored from cache)"],
        pista: "La clave de la caché debe incluir el hash del fichero de dependencias: si cambia, se invalida sola.",
        exito: "Caché acertada. Cada minuto que ahorras aquí lo ahorras en cada push del equipo."
      },
      {
        id: "m3", tipo: "salida", titulo: "Publica la imagen con secretos",
        guia: "<p>Construye la imagen y súbela al registro autenticando con <code>secrets</code> del repositorio.</p>" +
          "<p>Nunca escribas un token en el YAML, ni lo imprimas: GitHub enmascara los secretos, pero solo si vienen de ahí.</p>",
        comando: "cat .github/workflows/ci.yml",
        patrones: ["secrets[.]"],
        prohibidos: ["(ghp_|AKIA|password: *[a-z0-9]{6,})"],
        exito: "Credenciales fuera del repositorio."
      },
      {
        id: "m4", tipo: "check", titulo: "Que el flujo tenga autoridad",
        guia: "<p>Un CI que puedes ignorar no sirve de nada. En Settings → Branches, protege <code>main</code> exigiendo que el flujo pase antes de fusionar.</p>",
        criterios: [
          "main está protegida y exige el check en verde",
          "He comprobado que un PR con pruebas rotas no se puede fusionar",
          "El flujo tarda menos de 10 minutos"
        ]
      }
    ]
  },
  {
    id: "dv-p3", titulo: "Guardia: de la alerta al postmortem", nivel: "Avanzado", desdeUnidad: 6, tiempo: "50 min",
    resumen: "Simula un incidente completo: detectar, mitigar, comunicar y aprender sin buscar culpables.",
    objetivos: ["Alertar por síntomas", "Escribir un runbook usable de madrugada", "Redactar un postmortem útil"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "La alerta, por síntoma",
        guia: "<p>Elige un fallo plausible: la base de datos deja de aceptar conexiones.</p>" +
          "<p>Escribe la alerta que lo detectaría. Regla de oro: <b>alerta por lo que sufre el usuario</b> (errores, latencia), no por la causa (CPU al 90%). Una CPU alta a las 3 de la mañana que no molesta a nadie no es una alerta, es un gráfico.</p>" +
          "<p>Pega la definición (PrometheusRule, alerta de Grafana o similar).</p>",
        comando: "cat alerta.yml",
        patrones: ["(alert|expr|for:|condition|threshold)"],
        exito: "Alerta por síntoma, que es la que merece despertar a alguien."
      },
      {
        id: "m2", tipo: "salida", titulo: "El runbook",
        guia: "<p>Escribe <code>RUNBOOK.md</code> para esa alerta. Tiene que servir a alguien medio dormido que no escribió el sistema:</p><ul>" +
          "<li>qué significa la alerta, en una línea</li>" +
          "<li>los tres primeros comandos a ejecutar</li>" +
          "<li>cómo mitigar (aunque sea una chapuza temporal)</li>" +
          "<li>a quién escalar si no se arregla en 15 minutos</li></ul>",
        comando: "cat RUNBOOK.md",
        patrones: ["(diagn|comprob|primer)", "(mitig|solucion|arregl)", "(escal|avisar|contacto)"],
        exito: "Runbook que se puede seguir de madrugada. Eso es lo que separa una guardia llevadera de una noche horrible."
      },
      {
        id: "m3", tipo: "salida", titulo: "El postmortem",
        guia: "<p>Escribe <code>POSTMORTEM.md</code> con: cronología con horas, impacto (cuántos usuarios y cuánto rato), causa raíz, qué funcionó y <b>acciones con responsable y fecha</b>.</p>" +
          "<p>Sin nombres propios en la causa. Si alguien pudo tirar producción con un comando, el problema es que el sistema lo permitía.</p>",
        comando: "cat POSTMORTEM.md",
        patrones: ["(cronolog|timeline)", "(impacto|usuarios)", "(causa|raíz|raiz)", "(acci|siguiente|pendiente)"],
        prohibidos: ["(culpa de|fue culpa|por culpa)"],
        exito: "Postmortem sin culpables y con acciones. Así es como un incidente se convierte en algo que no vuelve a pasar."
      },
      {
        id: "m4", tipo: "check", titulo: "Revisa tu propio incidente",
        guia: "<p>Léelo como si fueras otra persona del equipo.</p>",
        criterios: [
          "Las acciones tienen responsable y fecha",
          "La cronología deja claro cuándo se detectó y cuándo se mitigó",
          "Sé explicar la diferencia entre mitigar y arreglar"
        ]
      }
    ]
  }
],

/* ---------------- Jenkins ---------------- */
jenkins: [
{
    id: "jk-p1", titulo: "Jenkins en marcha y tu primer job", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "35 min",
    resumen: "Levanta Jenkins con su volumen, complétalo y haz que ejecute algo de verdad.",
    objetivos: ["Instalar Jenkins sin perder la configuración", "Completar el asistente", "Crear y leer un job"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "Levanta Jenkins",
        guia: "<p>Arranca Jenkins en un contenedor con:</p><ul>" +
          "<li>el puerto <code>8080</code> publicado</li>" +
          "<li>el puerto <code>50000</code> publicado (para los agentes)</li>" +
          "<li>el volumen <code>jenkins_home</code> montado en <code>/var/jenkins_home</code></li></ul>" +
          "<p>Sin ese volumen pierdes jobs, plugins y usuarios en cuanto borres el contenedor. La imagen: <code>jenkins/jenkins:lts</code>.</p>",
        pista: "docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts",
        re: "^(?=.* -d( |$))(?=.*-p 8080:8080)(?=.*-p 50000:50000)(?=.*-v jenkins_home:/var/jenkins_home)(?=.*jenkins/jenkins)docker run .*",
        sol: ["docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts"],
        salida: "Unable to find image 'jenkins/jenkins:lts' locally\nlts: Pulling from jenkins/jenkins\nStatus: Downloaded newer image for jenkins/jenkins:lts\n3f1c9a7b2d8e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
        exito: "Jenkins arrancando. Tarda un minuto largo la primera vez."
      },
      {
        id: "m2", tipo: "salida", titulo: "Desbloquéalo",
        guia: "<p>Jenkins arranca bloqueado y pide una contraseña que escribió en su log y en un fichero. Sácala:</p>" +
          "<p><code>docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword</code></p>" +
          "<p>Entra en <code>http://localhost:8080</code>, pégala, instala los plugins sugeridos y crea tu usuario.</p>" +
          "<p>Cuando estés dentro, pega la versión que te devuelve la API.</p>",
        comando: "curl -s -I http://localhost:8080/login | head -3",
        patrones: ["(200|302|403)", "(X-Jenkins|HTTP)"],
        pista: "Si no responde, mira docker logs jenkins: todavía estará arrancando.",
        exito: "Jenkins vivo y accesible."
      },
      {
        id: "m3", tipo: "check", titulo: "Un job que ejecuta de verdad",
        guia: "<p>Crea un job <b>freestyle</b> llamado <code>hola</code> con un paso de shell que ejecute <code>echo</code>, <code>date</code> y <code>java -version</code>.</p>" +
          "<p>Lánzalo y abre la <b>salida de consola</b>: ahí está todo lo que pasó, y es lo primero que vas a mirar el resto de tu vida cuando un build falle.</p>",
        criterios: [
          "El job termina en SUCCESS (bola azul o verde)",
          "He leído la salida de consola entera",
          "Sé dónde se guarda el historial de ejecuciones"
        ]
      },
      {
        id: "m4", tipo: "salida", titulo: "Demuestra que no pierdes nada al reiniciar",
        guia: "<p>La prueba del volumen: borra el contenedor con <code>docker rm -f jenkins</code>, vuelve a levantarlo con el mismo comando de antes y entra.</p>" +
          "<p>Tu job <code>hola</code> tiene que seguir ahí. Pega la lista de jobs.</p>",
        comando: "docker exec jenkins ls /var/jenkins_home/jobs",
        patrones: ["hola"],
        pista: "Si está vacío, olvidaste el -v jenkins_home:/var/jenkins_home al volver a arrancar.",
        exito: "Configuración intacta tras destruir el contenedor. Eso es tener bien puesto el volumen."
      }
    ]
  },
  {
    id: "jk-p2", titulo: "Pipeline como código con Jenkinsfile", nivel: "Intermedio", desdeUnidad: 5, tiempo: "50 min",
    resumen: "Saca el job de la interfaz y métele el pipeline en el repositorio, con etapas e informes.",
    objetivos: ["Escribir un pipeline declarativo", "Conectar el job al repositorio", "Publicar resultados de pruebas"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Escribe el Jenkinsfile",
        guia: "<p>Crea un <code>Jenkinsfile</code> declarativo en la raíz del repositorio con tres etapas: <b>Compilar</b>, <b>Probar</b> y <b>Empaquetar</b>.</p>" +
          "<p>Estructura mínima: <code>pipeline { agent any; stages { stage('Compilar') { steps { … } } … } }</code>.</p>" +
          "<p>Pega el fichero.</p>",
        comando: "cat Jenkinsfile",
        patrones: ["pipeline *[{]", "agent", "stages *[{]", "stage *[(]'?\"?(Compilar|Build)", "steps *[{]"],
        exito: "Pipeline como código: ahora vive en el repositorio, se revisa en un PR y vuelve atrás con un git revert."
      },
      {
        id: "m2", tipo: "check", titulo: "Que Jenkins lo lea del repositorio",
        guia: "<p>Crea un job de tipo <b>Pipeline</b>, elige «Pipeline script from SCM», apunta a tu repositorio y deja <code>Jenkinsfile</code> como ruta.</p>" +
          "<p>Lánzalo: deberías ver las tres etapas por separado en la vista de etapas.</p>",
        criterios: [
          "El job lee el Jenkinsfile del repositorio, no de la interfaz",
          "Veo las tres etapas por separado",
          "Un cambio en el Jenkinsfile se aplica en la siguiente ejecución"
        ]
      },
      {
        id: "m3", tipo: "salida", titulo: "Publica los resultados de las pruebas",
        guia: "<p>Añade un bloque <code>post { always { junit 'target/surefire-reports/*.xml' } }</code> (ajusta la ruta a tu herramienta).</p>" +
          "<p>La gracia del <code>always</code>: los informes se publican <b>aunque las pruebas fallen</b>, que es justo cuando los necesitas.</p>",
        comando: "cat Jenkinsfile",
        patrones: ["post *[{]", "always", "junit"],
        exito: "Con esto Jenkins ya te enseña qué prueba falló, sin bucear en el log."
      },
      {
        id: "m4", tipo: "check", titulo: "Rompe una prueba a propósito",
        guia: "<p>Haz que una prueba falle y vuelve a lanzar. Fíjate en el estado del build: no es rojo, es <b>UNSTABLE</b> (amarillo).</p>" +
          "<p>FAILURE es «el build se cayó»; UNSTABLE es «se construyó, pero las pruebas dicen que algo está mal».</p>",
        criterios: [
          "He visto el build en UNSTABLE, no en FAILURE",
          "Sé dónde ver qué prueba concreta falló",
          "Sé explicar la diferencia entre FAILURE y UNSTABLE"
        ]
      }
    ]
  },
  {
    id: "jk-p3", titulo: "Hasta producción con aprobación", nivel: "Avanzado", desdeUnidad: 7, tiempo: "1 h",
    resumen: "Imagen etiquetada con el commit, credenciales que no se filtran, staging automático y producción con permiso.",
    objetivos: ["Gestionar secretos con credenciales", "Publicar la imagen", "Controlar el paso a producción"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Credenciales que no aparecen en el log",
        guia: "<p>Guarda el usuario y la contraseña del registro en <b>Credenciales</b> de Jenkins y úsalas con <code>withCredentials</code> o <code>credentials()</code>.</p>" +
          "<p>Jenkins enmascara esos valores en la consola: donde estaría la contraseña saldrá <code>****</code>. Nunca las pongas con <code>echo</code> «para depurar».</p>" +
          "<p>Pega el trozo del Jenkinsfile donde las usas.</p>",
        comando: "grep -n -A6 -i credential Jenkinsfile",
        patrones: ["(withCredentials|credentials[(])"],
        prohibidos: ["password *= *['\"][^'\"]{3,}", "echo .*[$][{]?PASS"],
        exito: "Secretos fuera del código y enmascarados en la consola."
      },
      {
        id: "m2", tipo: "salida", titulo: "Etiqueta la imagen con el commit",
        guia: "<p>Construye la imagen y etiquétala con el commit corto (<code>GIT_COMMIT</code>), no con <code>latest</code>.</p>" +
          "<p>Con <code>latest</code> nunca sabes qué hay desplegado. Con el commit, cualquiera puede ir del contenedor al código exacto que lo produjo.</p>",
        comando: "grep -n -i 'docker build' Jenkinsfile",
        patrones: ["docker build"],
        prohibidos: [":latest"],
        exito: "Cada imagen es rastreable hasta su commit."
      },
      {
        id: "m3", tipo: "salida", titulo: "Staging y prueba de humo",
        guia: "<p>Añade la etapa de despliegue en staging y, justo después, una <b>prueba de humo</b>: una petición a la ruta de salud que falle el build si no responde.</p>" +
          "<p>Desplegar sin comprobar es rezar.</p>",
        comando: "grep -n -i -A4 'stage' Jenkinsfile | grep -i -E 'staging|smoke|humo|curl'",
        patrones: ["(staging|smoke|humo|curl)"],
        exito: "Despliegue verificado, no solo lanzado."
      },
      {
        id: "m4", tipo: "salida", titulo: "Producción, solo desde main y con permiso",
        guia: "<p>La última etapa lleva dos candados:</p><ul>" +
          "<li><code>when { branch 'main' }</code> para que solo pase desde main</li>" +
          "<li><code>input message: '¿Desplegamos?'</code> con <code>timeout</code>, para que alguien lo apruebe y el pipeline no se quede colgado para siempre</li></ul>" +
          "<p>Y se despliega <b>la misma imagen</b> que pasó por staging, no una recién construida.</p>",
        comando: "grep -n -A8 -i 'produccion\\|production' Jenkinsfile",
        patrones: ["when", "branch", "input", "timeout"],
        exito: "Producción con freno de mano y trazabilidad. Ya es un pipeline de verdad."
      },
      {
        id: "m5", tipo: "check", titulo: "Repasa los riesgos",
        guia: "<p>Antes de entregar, confirma lo que has entendido.</p>",
        criterios: [
          "Ninguna credencial aparece en la salida de consola",
          "La imagen que llega a producción es la misma que pasó por staging",
          "Sé por qué input sin timeout es un problema"
        ]
      }
    ]
  }
],

/* ---------------- Terraform ---------------- */
terraform: [
{
    id: "tf-p1", titulo: "Tu primera infraestructura declarada", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "35 min",
    resumen: "El ciclo completo (init, plan, apply, destroy) con recursos locales, sin gastar un céntimo.",
    objetivos: ["Entender el ciclo de vida", "Leer un plan antes de aplicarlo", "Usar variables y salidas"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Declara dos ficheros",
        guia: "<p>Con el proveedor <code>local</code> (no necesitas nube ni cuenta), declara dos recursos <code>local_file</code> con su contenido.</p>" +
          "<p>Terraform no es «ejecutar comandos»: tú describes el <b>resultado</b> y él calcula qué hacer para llegar.</p>",
        comando: "cat main.tf",
        patrones: ["resource *\"local_file\"", "content", "filename"],
        exito: "Infraestructura declarada. Fíjate en que no has dicho en ningún momento «crea», solo «esto debe existir»."
      },
      {
        id: "m2", tipo: "salida", titulo: "Lee el plan antes de aplicar",
        guia: "<p><code>terraform init</code> y luego <code>terraform plan</code>. Léelo entero: los <code>+</code> son creaciones.</p>" +
          "<p>Leer el plan es el hábito más importante de Terraform. El día que no lo leas, borrará algo.</p>",
        comando: "terraform plan",
        patrones: ["Plan: *[0-9]+ to add", "[+] *resource"],
        prohibidos: ["Error:"],
        exito: "Plan leído y entendido antes de tocar nada."
      },
      {
        id: "m3", tipo: "salida", titulo: "Aplica y luego cambia algo",
        guia: "<p>Aplica con <code>terraform apply</code>. Después cambia el contenido de uno de los ficheros y vuelve a planificar.</p>" +
          "<p>Fíjate en que ahora no dice «crear»: dice <b>cambiar</b>, y solo uno. Terraform compara lo que pides con lo que hay guardado en el estado.</p>",
        comando: "terraform plan",
        patrones: ["Plan: *0 to add, *1 to change|~ *resource|1 to change"],
        exito: "Ha detectado exactamente lo que cambió. Eso es el estado haciendo su trabajo."
      },
      {
        id: "m4", tipo: "salida", titulo: "Variables y salidas",
        guia: "<p>Saca un valor fijo a una <code>variable</code> con descripción y valor por defecto, y expón algo con un <code>output</code>.</p>" +
          "<p>Los outputs son el contrato de tu módulo con el mundo: lo que otros pueden usar.</p>",
        comando: "terraform output && cat variables.tf",
        patrones: ["variable *\"", "(description|default)"],
        exito: "Ya no hay valores fijos dispersos: entran por arriba y salen por abajo."
      },
      {
        id: "m5", tipo: "term", titulo: "Destruye lo que creaste",
        guia: "<p>Lo último del ciclo: deshacerlo todo. Un comando, y te pedirá confirmación.</p>" +
          "<p>Esto es exactamente igual de fácil en la nube. Por eso el estado y los permisos importan tanto.</p>",
        pista: "El verbo es «destruir».",
        sol: ["terraform destroy", "terraform destroy -auto-approve"],
        salida: "Plan: 0 to add, 0 to change, 2 to destroy.\n\nDestroy complete! Resources: 2 destroyed.",
        exito: "Ciclo completo: init, plan, apply, destroy."
      }
    ]
  },
  {
    id: "tf-p2", titulo: "Módulo reutilizable con entornos", nivel: "Intermedio", desdeUnidad: 4, tiempo: "55 min",
    resumen: "Empaqueta tu infraestructura en un módulo y úsalo dos veces, con estados separados.",
    objetivos: ["Escribir un módulo con variables y salidas", "Reutilizarlo por entorno", "No mezclar estados"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Extrae el módulo",
        guia: "<p>Mueve los recursos a <code>modules/app/</code> con sus <code>variables.tf</code> y <code>outputs.tf</code>.</p>" +
          "<p>Regla: dentro del módulo <b>no puede haber ni un valor de un entorno concreto</b>. Si aparece «staging» escrito, va fuera, a una variable.</p>",
        comando: "cat modules/app/variables.tf",
        patrones: ["variable *\""],
        prohibidos: ["(staging|produccion|production)"],
        exito: "Módulo sin contaminar. Ya se puede usar en cualquier entorno."
      },
      {
        id: "m2", tipo: "salida", titulo: "Dos entornos, misma receta",
        guia: "<p>Crea <code>entornos/staging</code> y <code>entornos/produccion</code>, cada uno llamando al módulo con valores distintos (tamaños, réplicas, nombres).</p>",
        comando: "cat entornos/produccion/main.tf",
        patrones: ["module *\"", "source *="],
        exito: "Una receta, dos entornos. Lo que cambia son los ingredientes, no el código."
      },
      {
        id: "m3", tipo: "salida", titulo: "Estados separados",
        guia: "<p>Aplica cada entorno desde su carpeta y comprueba que cada uno tiene su propio estado.</p>" +
          "<p>Si compartieran estado, aplicar staging podría destrozar producción. Esto no es teoría: pasa.</p>",
        comando: "ls entornos/*/terraform.tfstate* 2>/dev/null || terraform workspace list",
        patrones: ["(tfstate|default|staging|produccion)"],
        exito: "Cada entorno con su estado. Ya puedes tocar staging sin sudar."
      },
      {
        id: "m4", tipo: "check", titulo: "Documenta el módulo",
        guia: "<p>Un módulo sin README es un módulo que nadie va a usar. Escribe uno con: qué hace, variables de entrada, salidas y un ejemplo de uso.</p>",
        criterios: [
          "El README explica cada variable y cada salida",
          "Hay un ejemplo de uso copiable",
          "El módulo no tiene valores fijos de ningún entorno"
        ]
      }
    ]
  },
  {
    id: "tf-p3", titulo: "Estado remoto y trabajo en equipo", nivel: "Avanzado", desdeUnidad: 6, tiempo: "45 min",
    resumen: "Saca el estado de tu portátil, pon bloqueo y revisa los planes antes de aplicar.",
    objetivos: ["Configurar un backend remoto", "Entender el bloqueo", "Revisar planes en CI"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Por qué el estado local es una bomba",
        guia: "<p>El fichero <code>terraform.tfstate</code> es la memoria de Terraform: qué recursos existen y cómo se llaman de verdad.</p><ul>" +
          "<li>Si está en tu portátil, nadie más puede aplicar sin pisarte.</li>" +
          "<li>Si dos aplicáis a la vez, el estado se corrompe.</li>" +
          "<li>Si lo pierdes, Terraform cree que no existe nada… y lo vuelve a crear todo.</li>" +
          "<li>Y encima guarda secretos en claro, así que <b>jamás</b> al repositorio.</li></ul>" +
          "<p>Solución: backend remoto con bloqueo.</p>"
      },
      {
        id: "m2", tipo: "salida", titulo: "Configura el backend",
        guia: "<p>Configura un backend remoto: S3 con DynamoDB para el bloqueo, Terraform Cloud, GCS o Azure Storage.</p>" +
          "<p>Migra el estado con <code>terraform init -migrate-state</code> y pega el resultado.</p>",
        comando: "terraform init -migrate-state",
        patrones: ["(Successfully configured|backend|migrat)"],
        prohibidos: ["Error:"],
        exito: "Estado fuera de tu máquina. Ahora el equipo puede trabajar."
      },
      {
        id: "m3", tipo: "salida", titulo: "Comprueba el bloqueo",
        guia: "<p>Abre dos terminales y lanza <code>terraform apply</code> en las dos a la vez. La segunda debe quedarse esperando o avisar de que el estado está bloqueado.</p>" +
          "<p>Pega el mensaje de bloqueo.</p>",
        comando: "(pega el mensaje de la segunda terminal)",
        patrones: ["(Lock|bloque|locked|Lock Info)"],
        exito: "Bloqueo funcionando: ya no se pueden pisar dos aplicaciones a la vez."
      },
      {
        id: "m4", tipo: "salida", titulo: "El plan se revisa en el PR",
        guia: "<p>Añade un flujo de CI que ejecute <code>terraform plan</code> en cada Pull Request y publique el resultado.</p>" +
          "<p>Así el cambio de infraestructura se revisa como se revisa el código: antes, no después.</p>",
        comando: "cat .github/workflows/terraform.yml",
        patrones: ["(terraform|plan)", "pull_request"],
        exito: "Infraestructura revisada en el PR."
      },
      {
        id: "m5", tipo: "check", titulo: "Quién aplica en producción",
        guia: "<p>Escríbelo en el README, aunque trabajes solo. El día que entre alguien nuevo, eso es lo primero que va a preguntar.</p>",
        criterios: [
          "Está escrito quién puede aplicar en producción y cómo",
          "El fichero de estado no está en el repositorio (y .gitignore lo cubre)",
          "Sé por qué el estado puede contener secretos en claro"
        ]
      }
    ]
  }
],

/* ---------------- AWS ---------------- */
aws: [
{
    id: "aw-p1", titulo: "Una web estática servida desde la nube", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "45 min",
    resumen: "Publica una web en S3 con CloudFront delante, sin dejar el bucket abierto al mundo.",
    objetivos: ["Crear un bucket y subir ficheros", "Servirlo con CDN", "Cerrar el acceso directo"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El bucket, privado",
        guia: "<p>Crea el bucket y sube tu <code>index.html</code>. <b>No</b> lo hagas público: el acceso lo dará CloudFront.</p>" +
          "<p>Los buckets públicos por accidente son de las filtraciones más comunes que existen.</p>",
        comando: "aws s3 ls s3://TU-BUCKET/",
        patrones: ["index.html"],
        exito: "Contenido subido a un bucket privado."
      },
      {
        id: "m2", tipo: "salida", titulo: "Comprueba que NO es accesible directo",
        guia: "<p>Pide el objeto por la URL directa de S3. Tiene que negarte el acceso.</p>" +
          "<p>Que falle es justo lo que queremos: el único camino debe ser el CDN.</p>",
        comando: "curl -s https://TU-BUCKET.s3.amazonaws.com/index.html | head -5",
        patrones: ["(AccessDenied|Access Denied|<Error>)"],
        prohibidos: ["<h1"],
        exito: "Bucket cerrado. Bien."
      },
      {
        id: "m3", tipo: "salida", titulo: "CloudFront delante",
        guia: "<p>Crea la distribución de CloudFront apuntando al bucket con <b>Origin Access Control</b>, para que solo CloudFront pueda leerlo.</p>" +
          "<p>Pide la web por el dominio de CloudFront y pega las cabeceras.</p>",
        comando: "curl -s -I https://TU-DOMINIO.cloudfront.net/",
        patrones: ["200", "(cloudfront|x-cache)"],
        pista: "La distribución tarda unos minutos en desplegarse. Si da 403, revisa la política del bucket para el OAC.",
        exito: "Servida por CDN, con el origen cerrado. Así es como se hace."
      },
      {
        id: "m4", tipo: "salida", titulo: "Cambia algo e invalida la caché",
        guia: "<p>Cambia el HTML, súbelo y vuelve a pedirlo: seguirá saliendo el viejo, porque el CDN lo tiene cacheado.</p>" +
          "<p>Crea una invalidación de <code>/*</code>, espera y comprueba que ya sale el nuevo. Pega el resultado del <code>x-cache</code>.</p>",
        comando: "curl -s -I https://TU-DOMINIO.cloudfront.net/ | grep -i x-cache",
        patrones: ["x-cache"],
        exito: "Ya sabes por qué «he desplegado y no se ve el cambio» casi siempre es la caché."
      },
      {
        id: "m5", tipo: "check", titulo: "Lo que cuesta",
        guia: "<p>Antes de dejarlo puesto: mira en la calculadora de AWS cuánto costaría esto con 10.000 visitas al mes.</p>",
        criterios: [
          "Sé cuánto costaría al mes aproximadamente",
          "El bucket no es público",
          "Sé qué pasaría si alguien descargara 1 TB desde mi CDN"
        ]
      }
    ]
  },
  {
    id: "aw-p2", titulo: "API con balanceador y red privada", nivel: "Intermedio", desdeUnidad: 6, tiempo: "1 h 15 min",
    resumen: "La API en subredes privadas, el balanceador delante y la base de datos sin salida a internet.",
    objetivos: ["Diseñar una VPC con subredes públicas y privadas", "Usar grupos de seguridad bien", "Publicar solo lo necesario"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "La red",
        guia: "<p>Crea una VPC con dos subredes públicas y dos privadas, en zonas distintas.</p>" +
          "<p>La diferencia entre pública y privada no es un interruptor: es si su tabla de rutas tiene salida por el Internet Gateway.</p>",
        comando: "aws ec2 describe-subnets --query \"Subnets[].{Id:SubnetId,AZ:AvailabilityZone,Public:MapPublicIpOnLaunch}\" --output table",
        patrones: ["(True|False)", "[a-z]{2}-[a-z]+-[0-9][a-z]"],
        exito: "Red repartida en dos zonas. Si se cae una, sigues en pie."
      },
      {
        id: "m2", tipo: "salida", titulo: "Solo el balanceador da la cara",
        guia: "<p>Pon el balanceador en las subredes públicas y las instancias de la API en las privadas.</p>" +
          "<p>Comprueba que las instancias de la API <b>no tienen IP pública</b>.</p>",
        comando: "aws ec2 describe-instances --query \"Reservations[].Instances[].{Id:InstanceId,Pub:PublicIpAddress}\" --output text",
        patrones: ["(None|null)"],
        pista: "Si necesitan salir a internet para actualizarse, eso lo da un NAT Gateway, no una IP pública.",
        exito: "La API no es alcanzable desde internet. Solo el balanceador."
      },
      {
        id: "m3", tipo: "salida", titulo: "Grupos de seguridad que se referencian",
        guia: "<p>En vez de abrir el puerto de la API a <code>0.0.0.0/0</code>, permite solo el origen del <b>grupo de seguridad del balanceador</b>.</p>" +
          "<p>Así, aunque alguien entre en la red, no llega a la API si no viene por donde debe.</p>",
        comando: "aws ec2 describe-security-groups --query \"SecurityGroups[].IpPermissions\" --output json | head -40",
        patrones: ["(GroupId|UserIdGroupPairs)"],
        prohibidos: ["0[.]0[.]0[.]0/0.*(22|3306|5432)"],
        exito: "Permisos por referencia, no por rango abierto."
      },
      {
        id: "m4", tipo: "salida", titulo: "La base de datos, aislada",
        guia: "<p>La base de datos va en subredes privadas, sin acceso público, y solo acepta conexiones del grupo de la API.</p>",
        comando: "aws rds describe-db-instances --query \"DBInstances[].{Id:DBInstanceIdentifier,Public:PubliclyAccessible}\" --output text",
        patrones: ["(False|false)"],
        exito: "Base de datos fuera del alcance de internet. Esto por sí solo evita un porcentaje enorme de incidentes."
      },
      {
        id: "m5", tipo: "check", titulo: "Cuenta el camino de una petición",
        guia: "<p>Explícate a ti mismo, en voz alta, el recorrido: del navegador al balanceador, del balanceador a la API, de la API a la base de datos, y la respuesta de vuelta.</p>",
        criterios: [
          "Sé decir qué componente tiene IP pública y cuál no",
          "Sé qué pasa si se cae una zona de disponibilidad",
          "Sé por qué los grupos de seguridad se referencian entre sí"
        ]
      }
    ]
  },
  {
    id: "aw-p3", titulo: "Permisos mínimos y coste bajo control", nivel: "Avanzado", desdeUnidad: 8, tiempo: "50 min",
    resumen: "Cierra los permisos, pon alarmas de gasto y etiqueta todo para saber qué cuesta qué.",
    objetivos: ["Aplicar el mínimo privilegio", "Controlar el gasto", "Etiquetar para poder auditar"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Caza los comodines",
        guia: "<p>Busca políticas con <code>\"Action\": \"*\"</code> o <code>\"Resource\": \"*\"</code>. Casi siempre son de cuando «solo era para probar».</p>",
        comando: "aws iam list-policies --scope Local --query \"Policies[].PolicyName\" --output text",
        patrones: ["."],
        exito: "Ya sabes qué políticas tienes que revisar."
      },
      {
        id: "m2", tipo: "salida", titulo: "Sustituye una por otra ajustada",
        guia: "<p>Coge la más gorda y reescríbela con <b>las acciones justas</b> sobre <b>los recursos justos</b>.</p>" +
          "<p>Truco: mira en CloudTrail qué llamadas hace de verdad ese rol. Casi nunca son las que crees.</p>",
        comando: "aws iam get-policy-version --policy-arn TU-ARN --version-id v1 --output json",
        patrones: ["Action", "Resource"],
        prohibidos: ["\"Action\": *\"[*]\"", "\"Resource\": *\"[*]\""],
        exito: "Permisos mínimos de verdad, no de eslogan."
      },
      {
        id: "m3", tipo: "salida", titulo: "Alarma de gasto",
        guia: "<p>Crea un presupuesto con alarma por correo al 50%, 80% y 100%.</p>" +
          "<p>Todo el mundo que ha usado la nube tiene una historia de una factura sorpresa. Esto es el seguro.</p>",
        comando: "aws budgets describe-budgets --account-id TU-CUENTA --query \"Budgets[].BudgetName\" --output text",
        patrones: ["."],
        exito: "Con alarma no hay sustos a fin de mes."
      },
      {
        id: "m4", tipo: "salida", titulo: "Etiqueta y mira quién gasta",
        guia: "<p>Etiqueta los recursos por <code>Proyecto</code> y <code>Entorno</code>, activa las etiquetas de reparto de costes y mira el informe.</p>" +
          "<p>Sin etiquetas, la factura es un número. Con etiquetas, es una conversación.</p>",
        comando: "aws resourcegroupstaggingapi get-resources --query \"ResourceTagMappingList[].Tags\" --output json | head -30",
        patrones: ["(Proyecto|Project|Entorno|Environment)"],
        exito: "Ya puedes decir qué proyecto se lleva el dinero."
      },
      {
        id: "m5", tipo: "check", titulo: "El informe",
        guia: "<p>Escribe un resumen de una página con lo que encontraste y lo que arreglaste.</p>",
        criterios: [
          "Ninguna política tiene comodines sin justificar",
          "Hay alarma de presupuesto activa",
          "Sé cuál es mi mayor gasto y por qué"
        ]
      }
    ]
  }
],

/* ---------------- Redes ---------------- */
redes: [
{
    id: "rd-p1", titulo: "Diagnostica una conexión paso a paso", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "40 min",
    resumen: "Sigue el camino completo de una petición: DNS, TCP, TLS y HTTP, con las herramientas de la terminal.",
    objetivos: ["Resolver nombres y leer la respuesta", "Comprobar puertos y latencia", "Ver la negociación TLS"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Resuelve el nombre",
        guia: "<p>Todo empieza por traducir un nombre a una dirección IP. Resuelve un dominio cualquiera y fíjate en el TTL: es cuánto tiempo puede cachearse esa respuesta.</p>" +
          "<p>Cuando alguien dice «es que el DNS tarda en propagarse», está hablando del TTL.</p>",
        comando: "dig +noall +answer example.com",
        patrones: ["[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+|[0-9a-f]{1,4}:", "(A|AAAA|CNAME)"],
        pista: "En Windows: nslookup example.com. En Linux o Mac: dig o host.",
        exito: "Nombre resuelto. Si esto falla, todo lo demás da igual."
      },
      {
        id: "m2", tipo: "salida", titulo: "¿Hay alguien escuchando?",
        guia: "<p>Que el nombre resuelva no significa que el servicio responda. Comprueba el puerto 443 y mide la latencia.</p>" +
          "<p>Distinguir «no resuelve» de «resuelve pero no conecta» te ahorra media hora en cada avería.</p>",
        comando: "nc -zv example.com 443",
        patrones: ["(succeeded|open|Connected|abierto)"],
        prohibidos: ["(refused|timed out|rechazada)"],
        pista: "Alternativas: telnet example.com 443, o Test-NetConnection example.com -Port 443 en PowerShell.",
        exito: "Puerto abierto y alguien contestando."
      },
      {
        id: "m3", tipo: "salida", titulo: "Mira el certificado",
        guia: "<p>Antes de que viaje un solo byte de tu petición, hay un apretón de manos TLS donde el servidor enseña su certificado.</p>" +
          "<p>Mira quién lo emitió y hasta cuándo vale: los certificados caducados son una causa de caída sorprendentemente común.</p>",
        comando: "echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates",
        patrones: ["(subject|issuer)", "notAfter"],
        exito: "Certificado leído: emisor y fecha de caducidad."
      },
      {
        id: "m4", tipo: "salida", titulo: "La petición completa, fase a fase",
        guia: "<p><code>curl -v</code> te enseña todo el recorrido: resolución, conexión TCP, TLS, petición y respuesta.</p>" +
          "<p>Léelo entero al menos una vez en tu vida: es el mejor mapa de cómo funciona la web.</p>",
        comando: "curl -v -s -o /dev/null https://example.com 2>&1 | head -25",
        patrones: ["(Connected to|Conectado)", "(TLS|SSL)", "(HTTP/|< HTTP)"],
        exito: "Ahí tienes las cuatro fases, en orden, en la misma pantalla."
      },
      {
        id: "m5", tipo: "check", titulo: "Ordena el proceso mentalmente",
        guia: "<p>Si mañana una web «no va», este es tu orden de sospechas.</p>",
        criterios: [
          "Sé distinguir un fallo de DNS de uno de conexión",
          "Sé qué significa un timeout frente a un connection refused",
          "Sé por qué un certificado caducado tira el sitio aunque el servidor funcione"
        ]
      }
    ]
  },
  {
    id: "rd-p2", titulo: "Calculadora de subredes", nivel: "Intermedio", desdeUnidad: 4, tiempo: "40 min",
    resumen: "Escribe el programa que todo el mundo acaba necesitando: dada una red en CIDR, cuántas direcciones útiles tiene y cuáles son.",
    objetivos: ["Entender máscaras y CIDR", "Calcular rangos", "Dar formato exacto a la salida"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Qué dice una máscara",
        guia: "<p>En <code>192.168.1.0/24</code>, el <code>/24</code> son los bits fijos: los 24 primeros identifican la red y los 8 restantes, las máquinas.</p>" +
          "<p>Con 8 bits hay 256 combinaciones, pero dos no se pueden usar: la primera es la dirección <b>de red</b> y la última es la de <b>difusión</b>. Quedan 254.</p>" +
          "<p>Ese «menos dos» es la respuesta que se falla en las entrevistas.</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "Escribe la calculadora",
        guia: "<p>Lee una red en formato CIDR y escribe exactamente tres líneas:</p>" +
          "<pre class=\"dg-pre\">utiles=254\nprimera=192.168.1.1\nultima=192.168.1.254</pre>" +
          "<p>El módulo <code>ipaddress</code> de Python ya hace el trabajo sucio: <code>.hosts()</code> te da justo las utilizables.</p>",
        lenguaje: "py",
        plantilla: "import ipaddress\nred = ipaddress.ip_network(input().strip())\n# imprime utiles=, primera= y ultima=\n",
        pruebas: [
          { entrada: "192.168.1.0/24", salida: "utiles=254\nprimera=192.168.1.1\nultima=192.168.1.254" },
          { entrada: "10.0.0.0/30", salida: "utiles=2\nprimera=10.0.0.1\nultima=10.0.0.2" },
          { entrada: "172.16.0.0/16", salida: "utiles=65534\nprimera=172.16.0.1\nultima=172.16.255.254", oculta: true },
          { entrada: "192.168.100.0/26", salida: "utiles=62\nprimera=192.168.100.1\nultima=192.168.100.62", oculta: true }
        ],
        solucion: "import ipaddress\nred = ipaddress.ip_network(input().strip())\nutiles = list(red.hosts())\nprint(f\"utiles={len(utiles)}\")\nprint(f\"primera={utiles[0]}\")\nprint(f\"ultima={utiles[-1]}\")",
        exito: "Calculadora funcionando, incluidos los casos raros."
      },
      {
        id: "m3", tipo: "check", titulo: "Comprueba que lo entiendes, no que compila",
        guia: "<p>Responde sin ejecutar nada: ¿cuántas máquinas caben en un /30? ¿Y por qué se usa tanto para enlaces punto a punto?</p>",
        criterios: [
          "Sé por qué se restan dos direcciones",
          "Sé cuántas máquinas caben en un /30 y para qué sirve",
          "Sé qué significa que una máscara sea más «grande» (más bits de red)"
        ]
      }
    ]
  },
  {
    id: "rd-p3", titulo: "Captura y explica el tráfico", nivel: "Avanzado", desdeUnidad: 7, tiempo: "50 min",
    resumen: "Captura una conexión de verdad y reconoce el saludo TCP, el inicio de TLS y el cierre.",
    objetivos: ["Capturar con tcpdump o Wireshark", "Reconocer el saludo de tres vías", "Saber qué se ve y qué no con TLS"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El saludo de tres vías",
        guia: "<p>Captura mientras abres una web y busca los tres paquetes del principio: <b>SYN</b>, <b>SYN-ACK</b> y <b>ACK</b>.</p>" +
          "<p>Esos tres viajes son lo que hace que cada conexión nueva cueste una ida y vuelta. Por eso se reutilizan las conexiones.</p>",
        comando: "sudo tcpdump -i any -n -c 20 'host example.com and tcp'",
        patrones: ["Flags .*S", "Flags .*[.]"],
        pista: "En Wireshark: filtro tcp.flags.syn==1. En Windows puedes usar Wireshark directamente.",
        exito: "Saludo de tres vías identificado."
      },
      {
        id: "m2", tipo: "salida", titulo: "Lo que viaja en claro",
        guia: "<p>Busca el <b>ClientHello</b> de TLS. Aunque el contenido va cifrado, ahí viaja en claro el nombre del servidor (SNI).</p>" +
          "<p>Conclusión práctica: con TLS nadie ve <i>qué</i> pides, pero sí <i>a quién</i> se lo pides.</p>",
        comando: "sudo tcpdump -i any -n -A -c 40 'tcp port 443' | grep -a -i -m3 'example\\|hello'",
        patrones: ["(example|hello|[.]com)"],
        exito: "Ahí está el nombre del servidor viajando sin cifrar."
      },
      {
        id: "m3", tipo: "salida", titulo: "El final de la conversación",
        guia: "<p>Localiza el cierre. Hay dos formas:</p><ul>" +
          "<li><b>FIN</b>: cierre ordenado, cada lado se despide.</li>" +
          "<li><b>RST</b>: corte en seco, normalmente porque algo se rompió o alguien cortó por medio.</li></ul>",
        comando: "sudo tcpdump -i any -n -c 40 'tcp[tcpflags] & (tcp-fin|tcp-rst) != 0'",
        patrones: ["Flags .*(F|R)"],
        exito: "Cierre localizado. Un RST inesperado en producción casi siempre es un firewall o un timeout de alguien intermedio."
      },
      {
        id: "m4", tipo: "check", titulo: "Cuenta lo que viste",
        guia: "<p>Escribe cuatro líneas explicando la captura, como se lo explicarías a alguien del equipo.</p>",
        criterios: [
          "Identifico SYN, SYN-ACK y ACK en la captura",
          "Sé qué información viaja en claro aunque haya TLS",
          "Sé distinguir un cierre ordenado de un corte abrupto"
        ]
      }
    ]
  }
],

/* ---------------- Spring ---------------- */
spring: [
{
    id: "sp-p1", titulo: "Validador de altas", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "40 min",
    resumen: "La lógica de validación que va antes de guardar cualquier cosa: acumular errores y explicarlos.",
    objetivos: ["Validar entrada", "Devolver todos los errores, no solo el primero", "Pensar como una capa de servicio"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Por qué se acumulan los errores",
        guia: "<p>Un formulario que te dice «el correo está mal», lo corriges, y entonces te dice «y la edad también» es un formulario que odias.</p>" +
          "<p>La regla: <b>valida todo y devuelve la lista completa</b>. En Spring eso es lo que hace <code>@Valid</code> con su <code>BindingResult</code>; aquí lo vas a escribir a mano para entender qué hay debajo.</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "Escribe el validador",
        guia: "<p>Lee tres líneas: nombre, correo y edad. Comprueba:</p><ul>" +
          "<li>nombre no vacío → <code>nombre vacio</code></li>" +
          "<li>correo con arroba y con punto después de la arroba → <code>correo invalido</code></li>" +
          "<li>edad entre 18 y 120 → <code>edad invalida</code></li></ul>" +
          "<p>Si todo está bien, imprime <code>OK</code>. Si no, un error por línea <b>en ese orden</b>.</p>",
        lenguaje: "java",
        plantilla: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] a) {\n    Scanner sc = new Scanner(System.in);\n    String nombre = sc.nextLine();\n    String correo = sc.nextLine();\n    int edad = Integer.parseInt(sc.nextLine().trim());\n    // valida y escribe el resultado\n  }\n}\n",
        pruebas: [
          { entrada: "Ana\nana@correo.com\n30", salida: "OK" },
          { entrada: "\nana-correo\n15", salida: "nombre vacio\ncorreo invalido\nedad invalida" },
          { entrada: "Luis\nluis@correo.com\n17", salida: "edad invalida", oculta: true },
          { entrada: "Eva\neva@dominio\n44", salida: "correo invalido", oculta: true }
        ],
        solucion: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] a) {\n    Scanner sc = new Scanner(System.in);\n    String nombre = sc.nextLine();\n    String correo = sc.nextLine();\n    int edad = Integer.parseInt(sc.nextLine().trim());\n    List<String> e = new ArrayList<>();\n    if (nombre.trim().isEmpty()) e.add(\"nombre vacio\");\n    int ar = correo.indexOf('@');\n    if (ar < 1 || !correo.substring(ar).contains(\".\")) e.add(\"correo invalido\");\n    if (edad < 18 || edad > 120) e.add(\"edad invalida\");\n    if (e.isEmpty()) System.out.println(\"OK\");\n    else for (String x : e) System.out.println(x);\n  }\n}",
        exito: "Validación completa, con todos los errores de una vez."
      },
      {
        id: "m3", tipo: "check", titulo: "Llévalo a Spring",
        guia: "<p>Ahora la versión real: en un proyecto Spring Boot, esto se escribe con anotaciones (<code>@NotBlank</code>, <code>@Email</code>, <code>@Min</code>) sobre el DTO, y el controlador recibe el resultado con <code>@Valid</code>.</p>" +
          "<p>Escríbelo así en un proyecto tuyo y comprueba que devuelve 400 con la lista de errores.</p>",
        criterios: [
          "Tengo un DTO con anotaciones de validación",
          "El controlador usa @Valid y devuelve 400 con los errores",
          "Sé qué hace @RestControllerAdvice con esos errores"
        ]
      }
    ]
  },
  {
    id: "sp-p2", titulo: "API REST de tareas", nivel: "Intermedio", desdeUnidad: 5, tiempo: "1 h",
    resumen: "El CRUD completo con Spring Boot, con los códigos HTTP que tocan y no los que salgan.",
    objetivos: ["Crear un proyecto Spring Boot", "Escribir un controlador REST", "Devolver los códigos correctos"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Arranca el proyecto",
        guia: "<p>Genera el proyecto en <b>start.spring.io</b> con Web y Validation, arráncalo y comprueba que responde.</p>" +
          "<p>Añade el actuator si quieres una ruta de salud de regalo.</p>",
        comando: "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:8080/tareas",
        patrones: ["(200|404|401)"],
        prohibidos: ["000"],
        pista: "Si sale 000 nadie escucha: mira la consola de arranque, casi siempre es el puerto ocupado.",
        exito: "Aplicación viva."
      },
      {
        id: "m2", tipo: "salida", titulo: "Crear devuelve 201 y Location",
        guia: "<p><code>POST /tareas</code> debe devolver <b>201 Created</b> y la cabecera <code>Location</code> con la URL del recurso nuevo.</p>" +
          "<p>Devolver 200 con el objeto también «funciona», pero 201 + Location es lo que dice el estándar y lo que esperan los clientes.</p>",
        comando: "curl -s -i -X POST http://localhost:8080/tareas -H 'Content-Type: application/json' -d '{\"titulo\":\"comprar pan\"}' | head -8",
        patrones: ["201", "[Ll]ocation:"],
        exito: "Creación como manda el estándar."
      },
      {
        id: "m3", tipo: "salida", titulo: "Lo que no existe es 404, no 500",
        guia: "<p>Pide una tarea con un id inventado. Si sale 500, es que una excepción se te escapó hasta arriba.</p>" +
          "<p>404 significa «esto no existe»; 500 significa «me he roto». Confundirlos hace que los errores reales se pierdan entre el ruido.</p>",
        comando: "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:8080/tareas/999999",
        patrones: ["404"],
        prohibidos: ["500"],
        exito: "El error dice la verdad."
      },
      {
        id: "m4", tipo: "salida", titulo: "Datos inválidos: 400 con detalle",
        guia: "<p>Manda una tarea sin título. Debe responder <b>400</b> y decir <b>qué campo</b> está mal.</p>",
        comando: "curl -s -i -X POST http://localhost:8080/tareas -H 'Content-Type: application/json' -d '{}' | head -20",
        patrones: ["400", "(titulo|title|must not be|no debe)"],
        exito: "Errores de validación útiles para quien consume la API."
      },
      {
        id: "m5", tipo: "check", titulo: "Completa el CRUD",
        guia: "<p>Termina con <code>PUT</code> y <code>DELETE</code>. El borrado suele devolver <b>204 No Content</b>: se hizo, y no hay nada que contar.</p>",
        criterios: [
          "DELETE devuelve 204 y borrar dos veces no revienta",
          "PUT sobre un id inexistente devuelve 404",
          "GET /tareas devuelve la lista, aunque esté vacía (y no 404)"
        ]
      }
    ]
  },
  {
    id: "sp-p3", titulo: "Persistencia, perfiles y pruebas", nivel: "Avanzado", desdeUnidad: 7, tiempo: "1 h 20 min",
    resumen: "De memoria a base de datos real, con configuración por entorno y pruebas que protegen de verdad.",
    objetivos: ["Usar Spring Data JPA", "Separar configuración por perfiles", "Escribir pruebas de integración"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Base de datos de verdad",
        guia: "<p>Cambia el repositorio en memoria por JPA contra PostgreSQL en Docker.</p>" +
          "<p>La prueba de que funciona no es que arranque: es que reinicies la aplicación y los datos sigan ahí.</p>",
        comando: "curl -s http://localhost:8080/tareas",
        patrones: ["[[]"],
        exito: "Los datos ya no viven en la memoria del proceso."
      },
      {
        id: "m2", tipo: "salida", titulo: "Un perfil por entorno",
        guia: "<p>Separa <code>application-dev.yml</code> y <code>application-prod.yml</code>. Y lo importante: <b>ninguna contraseña escrita</b>, que vengan de variables de entorno.</p>" +
          "<p>La misma aplicación, con distinta configuración. Eso es lo que permite que el artefacto que probaste sea el que despliegas.</p>",
        comando: "cat src/main/resources/application-prod.yml",
        patrones: ["(datasource|url|spring)"],
        prohibidos: ["password: *[a-zA-Z0-9]{4,}"],
        exito: "Configuración separada y sin secretos en el repositorio."
      },
      {
        id: "m3", tipo: "salida", titulo: "Pruebas que tocan la API entera",
        guia: "<p>Escribe pruebas con <code>@SpringBootTest</code> y <code>MockMvc</code> (o <code>WebTestClient</code>) para las cuatro operaciones, <b>incluidos los casos de error</b>: 404 y 400.</p>" +
          "<p>Las pruebas del camino feliz solo te dicen que el código funciona cuando todo va bien, que es justo cuando no necesitas pruebas.</p>",
        comando: "./mvnw -q test 2>&1 | tail -20",
        patrones: ["(BUILD SUCCESS|Tests run|tests? passed)"],
        prohibidos: ["(BUILD FAILURE|Tests run:.*Failures: [1-9])"],
        exito: "Pruebas en verde, con los errores cubiertos."
      },
      {
        id: "m4", tipo: "salida", titulo: "Un solo formato de error",
        guia: "<p>Añade un <code>@RestControllerAdvice</code> que convierta cualquier excepción en la misma forma de respuesta: código, mensaje y, si aplica, los campos con problema.</p>" +
          "<p>Quien consume tu API te lo agradecerá: un solo formato que parsear.</p>",
        comando: "curl -s http://localhost:8080/tareas/999999",
        patrones: ["[{]", "(mensaje|message|error)"],
        exito: "Errores uniformes en toda la API."
      },
      {
        id: "m5", tipo: "check", titulo: "Repaso final",
        guia: "<p>Lo que un revisor miraría antes de aprobar esto.</p>",
        criterios: [
          "Los datos sobreviven a reiniciar la aplicación",
          "No hay ninguna credencial en el repositorio",
          "Las pruebas fallan si rompo a propósito un endpoint"
        ]
      }
    ]
  }
],

/* ---------------- CSS ---------------- */
css: [
{
    id: "hc-p1", titulo: "Tu página de presentación", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "45 min",
    resumen: "Una página personal con HTML semántico y estilos propios. Sin frameworks, sin plantillas.",
    objetivos: ["Usar etiquetas semánticas", "Aplicar estilos con variables", "Escribir HTML accesible"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Estructura semántica",
        guia: "<p>Monta la página con <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code> y <code>&lt;footer&gt;</code>.</p>" +
          "<p>No es postureo: un lector de pantalla usa esas etiquetas para saltar por la página. Con todo en <code>&lt;div&gt;</code>, no hay dónde saltar.</p>",
        comando: "cat index.html",
        patrones: ["<header", "<main", "<footer", "<h1"],
        prohibidos: ["<center", "<font"],
        exito: "Estructura con significado, no solo cajas."
      },
      {
        id: "m2", tipo: "salida", titulo: "Imágenes con alt de verdad",
        guia: "<p>Añade tu foto con un <code>alt</code> que describa lo que se ve. Un <code>alt=\"imagen\"</code> es peor que no ponerlo.</p>" +
          "<p>Y pon <code>lang=\"es\"</code> en el <code>&lt;html&gt;</code>, que es lo que le dice al lector de pantalla en qué idioma leer.</p>",
        comando: "cat index.html",
        patrones: ["lang=\"es\"", "alt=\"[^\"]{8,}\""],
        exito: "Accesible desde el primer día, que es cuando cuesta cero."
      },
      {
        id: "m3", tipo: "salida", titulo: "Colores y tipografía con variables",
        guia: "<p>Define los colores y tamaños en <code>:root</code> con variables CSS y úsalos con <code>var(--…)</code>.</p>" +
          "<p>La ventaja llega cuando quieras cambiar el color principal: un sitio, no cuarenta.</p>",
        comando: "cat estilos.css",
        patrones: [":root", "--[a-z-]+ *:", "var[(]--"],
        exito: "Estilos con un sistema detrás."
      },
      {
        id: "m4", tipo: "check", titulo: "Pruébala como la usaría otra persona",
        guia: "<p>Navega la página entera con el tabulador, sin ratón. Y mira el contraste del texto (las DevTools te lo dicen).</p>",
        criterios: [
          "Puedo llegar a todos los enlaces con el tabulador y veo dónde estoy",
          "El texto tiene contraste suficiente sobre el fondo",
          "La página se entiende con las imágenes desactivadas"
        ]
      }
    ]
  },
  {
    id: "hc-p2", titulo: "Tarjetas que se adaptan", nivel: "Avanzado", desdeUnidad: 6, tiempo: "50 min",
    resumen: "Una rejilla que funciona igual en un móvil de 360px que en una pantalla de 27 pulgadas, sin mil consultas de medios.",
    objetivos: ["Usar Grid y Flexbox donde toca", "Diseñar primero para móvil", "Evitar medidas fijas"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "La rejilla que se adapta sola",
        guia: "<p>Seis tarjetas con imagen, título y texto. Colócalas con:</p>" +
          "<pre class=\"dg-pre\">grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));</pre>" +
          "<p>Esta línea sustituye a tres consultas de medios: cabe lo que quepa, y lo que no, baja.</p>",
        comando: "cat estilos.css",
        patrones: ["grid-template-columns", "(auto-fit|auto-fill)", "minmax"],
        exito: "Rejilla fluida sin puntos de ruptura a mano."
      },
      {
        id: "m2", tipo: "salida", titulo: "Que todas midan igual",
        guia: "<p>Dentro de cada tarjeta, usa Flexbox en columna y empuja el pie hacia abajo (<code>margin-top: auto</code>) para que todas queden alineadas aunque el texto varíe.</p>",
        comando: "cat estilos.css",
        patrones: ["display: *flex", "flex-direction: *column", "margin-top: *auto"],
        exito: "Tarjetas parejas aunque el contenido no lo sea."
      },
      {
        id: "m3", tipo: "salida", titulo: "Sin anchos fijos",
        guia: "<p>Busca en tu CSS anchos en píxeles que puedan desbordar en móvil. Cámbialos por <code>max-width</code>, porcentajes o <code>ch</code>.</p>" +
          "<p>Un <code>width: 600px</code> en una pantalla de 360 es una barra de desplazamiento horizontal garantizada.</p>",
        comando: "grep -n 'width' estilos.css",
        patrones: ["(max-width|%|rem|ch|fr|minmax)"],
        prohibidos: ["[^-]width: *[0-9]{3,}px"],
        exito: "Nada de anchos fijos grandes."
      },
      {
        id: "m4", tipo: "check", titulo: "Pruébalo a tres anchos",
        guia: "<p>En las DevTools, prueba a 360px, 768px y 1440px.</p>",
        criterios: [
          "No hay desplazamiento horizontal a 360px",
          "Las imágenes no se deforman al cambiar el ancho",
          "El diseño cambia sin saltos raros ni huecos enormes"
        ]
      }
    ]
  },
  {
    id: "hc-p3", titulo: "Formulario accesible con tema claro y oscuro", nivel: "Avanzado", desdeUnidad: 8, tiempo: "55 min",
    resumen: "Un formulario que cualquiera pueda usar, con errores que se entienden y dos temas.",
    objetivos: ["Etiquetar campos", "Mostrar errores accesibles", "Seguir el tema del sistema"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Cada campo con su etiqueta",
        guia: "<p>Cada <code>input</code> necesita un <code>label</code> con <code>for</code> apuntando a su <code>id</code>. Un <code>placeholder</code> <b>no es</b> una etiqueta: desaparece al escribir.</p>" +
          "<p>Las ayudas se asocian con <code>aria-describedby</code>.</p>",
        comando: "cat formulario.html",
        patrones: ["<label", "for=\"", "aria-describedby"],
        exito: "Campos etiquetados de verdad."
      },
      {
        id: "m2", tipo: "salida", titulo: "Errores que no dependen del color",
        guia: "<p>Marca los campos con problema con <code>aria-invalid=\"true\"</code> y un <b>texto visible</b>. Nunca solo con un borde rojo: hay gente que no distingue ese rojo.</p>" +
          "<p>Y anuncia el error con <code>role=\"alert\"</code> para que el lector de pantalla lo diga.</p>",
        comando: "cat formulario.html",
        patrones: ["aria-invalid", "(role=\"alert\"|aria-live)"],
        exito: "Errores perceptibles por todos, no solo por quien ve el color."
      },
      {
        id: "m3", tipo: "salida", titulo: "Tema claro y oscuro",
        guia: "<p>Define los colores en variables y redefínelas dentro de <code>@media (prefers-color-scheme: dark)</code>.</p>" +
          "<p>Con eso, la página respeta lo que la persona ya eligió en su sistema, sin preguntar nada.</p>",
        comando: "cat estilos.css",
        patrones: ["prefers-color-scheme", ":root", "var[(]--"],
        exito: "Los dos temas, sin duplicar el CSS."
      },
      {
        id: "m4", tipo: "salida", titulo: "El foco siempre visible",
        guia: "<p>Busca en tu CSS cualquier <code>outline: none</code> sin alternativa. Quitar el foco visible deja la página inservible con teclado.</p>" +
          "<p>Si no te gusta el de por defecto, pon el tuyo con <code>:focus-visible</code>.</p>",
        comando: "grep -n -E 'outline|focus' estilos.css",
        patrones: ["focus"],
        prohibidos: ["outline: *none *;? *[}]"],
        exito: "Foco visible y con tu estilo."
      },
      {
        id: "m5", tipo: "check", titulo: "Revisión final",
        guia: "<p>Pasa el formulario por la pestaña de accesibilidad (Lighthouse o el inspector).</p>",
        criterios: [
          "Puedo rellenar y enviar el formulario sin ratón",
          "Los mensajes de error se entienden sin ver el color",
          "El tema oscuro tiene contraste suficiente"
        ]
      }
    ]
  },
{
    id: "cs-p4", titulo: "Rescata una maqueta rota", nivel: "Intermedio", desdeUnidad: 4, tiempo: "45 min",
    resumen: "Una página con los fallos de siempre: scroll horizontal, una cabecera sticky que no se pega, un menú tapado y un margen que se escapa. Arréglalos de verdad, sin taparlos.",
    objetivos: ["Diagnosticar con DevTools", "Entender el colapso de márgenes y los contextos de apilamiento", "Arreglar la causa, no el síntoma"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El margen que se escapa",
        guia: "<p>Crea una cabecera con fondo de color que contenga un <code>&lt;h1&gt;</code>. Verás una franja sin color encima: es el margen del h1 saliéndose de la cabecera.</p>" +
          "<p>Arréglalo sin quitar el margen del título: haz que la cabecera sea un contexto de formato de bloque.</p>",
        comando: "cat estilos.css",
        patrones: ["display: *flow-root"],
        exito: "Margen contenido. flow-root sirve también para contener floats."
      },
      {
        id: "m2", tipo: "salida", titulo: "La cabecera que no se pega",
        guia: "<p>Haz la cabecera <code>position: sticky</code> con <code>top: 0</code>. Si algún ancestro tiene <code>overflow: hidden</code>, no se pegará: cámbialo por <code>overflow: clip</code> o quítalo (en este ejercicio no debe quedar ningún <code>overflow: hidden</code>).</p>",
        comando: "cat estilos.css",
        patrones: ["position: *sticky", "top: *0"],
        prohibidos: ["overflow(-x)?: *hidden"],
        exito: "Sticky funcionando: ningún contenedor de scroll por medio."
      },
      {
        id: "m3", tipo: "salida", titulo: "El menú que queda debajo",
        guia: "<p>Tu menú desplegable queda tapado por el contenido aunque tenga un z-index enorme. En vez de subir el número, pon una escala de z-index en variables y aísla los componentes con <code>isolation: isolate</code>.</p>",
        comando: "cat estilos.css",
        patrones: ["--z-[a-z-]+ *:", "var[(]--z-", "isolation: *isolate"],
        prohibidos: ["z-index: *9{3,}"],
        exito: "Capas con nombre: cualquiera entiende qué tapa a qué."
      },
      {
        id: "m4", tipo: "check", titulo: "Sin scroll horizontal",
        guia: "<p>Abre la página a 320px en el modo dispositivo de DevTools. Si hay scroll horizontal, busca el elemento que se sale (<code>* { outline: 1px solid red }</code>) y corrige su ancho.</p>",
        criterios: [
          "A 320px no hay desplazamiento horizontal",
          "No he usado overflow-x: hidden en html ni en body para esconderlo",
          "Las imágenes tienen max-width: 100% y los textos largos se parten"
        ]
      }
    ]
  },
  {
    id: "cs-p5", titulo: "Animaciones que respetan a todos", nivel: "Experto", desdeUnidad: 9, tiempo: "50 min",
    resumen: "Microinteracciones fluidas en una interfaz: un aviso que entra, un menú que se despliega y tarjetas que reaccionan, sin tirones y sin marear a nadie.",
    objetivos: ["Animar transform y opacity", "Animar la aparición con @starting-style", "Respetar prefers-reduced-motion"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Transiciones con nombre",
        guia: "<p>Añade transiciones al hover de botones y tarjetas nombrando las propiedades (nada de <code>transition: all</code>) y animando solo <code>transform</code>, <code>translate</code>, <code>scale</code> u <code>opacity</code>.</p>",
        comando: "cat estilos.css",
        patrones: ["transition:", "(transform|translate|scale|opacity)"],
        prohibidos: ["transition: *all", "transition: *(width|height|top|left|margin)"],
        exito: "Transiciones baratas: solo composición."
      },
      {
        id: "m2", tipo: "salida", titulo: "Un aviso que entra y sale",
        guia: "<p>Haz que un aviso aparezca con un fundido y un pequeño desplazamiento usando <code>@starting-style</code>, y que al ocultarlo con <code>display: none</code> también se anime (<code>allow-discrete</code>).</p>",
        comando: "cat estilos.css",
        patrones: ["@starting-style", "allow-discrete"],
        exito: "Entrada y salida animadas sin una línea de JavaScript."
      },
      {
        id: "m3", tipo: "salida", titulo: "Menos movimiento para quien lo pide",
        guia: "<p>Envuelve los desplazamientos y zooms en <code>@media (prefers-reduced-motion: no-preference)</code>, o sustitúyelos por fundidos dentro de <code>(prefers-reduced-motion: reduce)</code>.</p>",
        comando: "cat estilos.css",
        patrones: ["prefers-reduced-motion"],
        exito: "Tu interfaz ya no marea a nadie."
      },
      {
        id: "m4", tipo: "check", titulo: "Mídelo",
        guia: "<p>Graba la interacción en la pestaña Performance de DevTools con la CPU ralentizada 4× y emula el movimiento reducido en la pestaña Rendering.</p>",
        criterios: [
          "No aparecen bloques de Layout en cada fotograma de las animaciones",
          "Con movimiento reducido emulado no hay desplazamientos ni zooms",
          "Ninguna animación de interfaz dura más de 400 ms"
        ]
      }
    ]
  },
  {
    id: "cs-p6", titulo: "La arquitectura CSS de una aplicación", nivel: "Experto", desdeUnidad: 10, tiempo: "60 min",
    resumen: "Organiza el CSS de una aplicación como en un equipo profesional: capas, reset moderno, tokens semánticos y una librería externa que nunca te pisa.",
    objetivos: ["Ordenar el CSS con @layer", "Separar tokens primitivos y semánticos", "Aislar el CSS de terceros"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Capas declaradas",
        guia: "<p>En <code>main.css</code>, declara el orden de capas (<code>reset</code>, <code>terceros</code>, <code>base</code>, <code>componentes</code>, <code>utilidades</code>) e importa una librería externa dentro de la capa de terceros.</p>",
        comando: "cat main.css",
        patrones: ["@layer +reset *,", "utilidades", "layer[(]terceros[)]"],
        exito: "Prioridades explícitas: la librería ya no puede ganar a tus componentes."
      },
      {
        id: "m2", tipo: "salida", titulo: "Tokens en dos niveles",
        guia: "<p>En <code>tokens.css</code>, define primitivos (<code>--azul-600</code>…) y semánticos que los usan (<code>--acento: var(--azul-600)</code>). Los componentes solo usan los semánticos.</p>",
        comando: "cat tokens.css",
        patrones: [":root", "--[a-z]+-[0-9]{2,3} *:", "--(acento|fondo|texto)[a-z-]* *: *var[(]--"],
        exito: "Cambiar de tema o de marca es tocar un fichero."
      },
      {
        id: "m3", tipo: "salida", titulo: "Componentes sin colores sueltos",
        guia: "<p>Revisa que tus componentes no tengan colores en hex escritos a mano: todo debe salir de <code>var(--…)</code>. Stylelint puede vigilarlo por ti.</p>",
        comando: "grep -c -E '#[0-9a-fA-F]{3,8}' componentes/*.css",
        patrones: [":0"],
        prohibidos: [":[1-9][0-9]*"],
        exito: "Ni un color fuera del sistema."
      },
      {
        id: "m4", tipo: "check", titulo: "Revisión de la arquitectura",
        guia: "<p>Abre la aplicación y comprueba en DevTools el orden de capas de un botón (el panel Styles muestra la capa de cada regla).</p>",
        criterios: [
          "No hay ningún !important fuera de la capa de utilidades",
          "El reset es corto y está en su propia capa",
          "Los estilos base usan :where() o selectores de tipo con especificidad baja"
        ]
      }
    ]
  },
  {
    id: "cs-p7", titulo: "Portada de producto de nivel producción", nivel: "Maestro", desdeUnidad: 11, tiempo: "90 min",
    resumen: "El proyecto final: una portada completa que aguanta textos largos, 320px, zoom al 200 %, modo oscuro, alto contraste y movimiento reducido.",
    objetivos: ["Combinar Grid, Flexbox y container queries", "Temas y accesibilidad completos", "Rendimiento medido con Lighthouse"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Maqueta intrínseca",
        guia: "<p>Monta el esqueleto con Grid, una rejilla de tarjetas con <code>repeat(auto-fill, minmax(min(…, 100%), 1fr))</code> y tipografía fluida con <code>clamp()</code>.</p>",
        comando: "cat estilos.css",
        patrones: ["display: *grid", "minmax[(]min[(]", "clamp[(]"],
        exito: "Se adapta sola antes de escribir una sola media query."
      },
      {
        id: "m2", tipo: "salida", titulo: "Tarjetas que saben dónde están",
        guia: "<p>Las tarjetas deben cambiar de disposición según el hueco de su contenedor, no según la ventana: usa container queries.</p>",
        comando: "cat estilos.css",
        patrones: ["container(-type)?: *[a-z /-]*inline-size", "@container"],
        exito: "Componentes que funcionan en cualquier columna."
      },
      {
        id: "m3", tipo: "salida", titulo: "Temas y preferencias",
        guia: "<p>Tema claro y oscuro con <code>color-scheme</code> y tokens, estilos para <code>forced-colors</code> y movimiento reducido respetado.</p>",
        comando: "cat estilos.css",
        patrones: ["color-scheme", "prefers-color-scheme|light-dark[(]", "forced-colors", "prefers-reduced-motion"],
        exito: "Respeta todo lo que el usuario ya configuró en su sistema."
      },
      {
        id: "m4", tipo: "check", titulo: "Prueba de estrés",
        guia: "<p>Pon textos el triple de largos, vacía una lista, abre a 320px, haz zoom al 200 % y pasa Lighthouse en móvil.</p>",
        criterios: [
          "Nada se desborda ni se solapa con textos largos ni a 320px",
          "Con zoom al 200 % todo se lee y se puede usar",
          "El foco se ve siempre y todo funciona con teclado",
          "Lighthouse da más de 90 en rendimiento y accesibilidad, con CLS menor de 0,1"
        ]
      }
    ]
  }
],

/* ---------------- TypeScript ---------------- */
typescript: [
{
    id: "ts-p1", titulo: "Carrito con tipos que no dejan equivocarse", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "40 min",
    resumen: "La lógica de un carrito con descuentos, primero funcionando y después bien tipada.",
    objetivos: ["Modelar datos", "Calcular sin errores de redondeo", "Dar formato exacto"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Calcula el total",
        guia: "<p>Lee líneas con el formato <code>producto:precio:cantidad</code> y saca el total.</p>" +
          "<p>Si el total pasa de 100, aplica un 10% de descuento. Imprime una sola línea: <code>total=</code> con <b>dos decimales siempre</b>.</p>" +
          "<p>Ojo con el redondeo: <code>toFixed(2)</code> es tu amigo aquí.</p>",
        lenguaje: "js",
        plantilla: "const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").filter(Boolean);\n// calcula el total e imprime total=\n",
        pruebas: [
          { entrada: "pan:1.50:2\nleche:0.90:3", salida: "total=5.70" },
          { entrada: "tele:80.00:1\nmando:30.00:1", salida: "total=99.00" },
          { entrada: "portatil:600.00:1", salida: "total=540.00", oculta: true },
          { entrada: "cafe:2.25:4", salida: "total=9.00", oculta: true }
        ],
        solucion: "const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").filter(Boolean);\nlet total = 0;\nfor (const l of lineas) { const p = l.split(\":\"); total += Number(p[1]) * Number(p[2]); }\nif (total > 100) total *= 0.9;\nconsole.log(\"total=\" + total.toFixed(2));",
        exito: "Cuentas correctas, incluido el caso justo en el límite de 100."
      },
      {
        id: "m2", tipo: "salida", titulo: "Ahora con tipos",
        guia: "<p>Pásalo a TypeScript: define <code>type Producto = { nombre: string; precio: number; cantidad: number }</code> y una función <code>total(items: Producto[]): number</code>.</p>" +
          "<p>Activa <code>strict</code> en el <code>tsconfig.json</code>. El modo estricto es la mitad del valor de TypeScript; sin él, casi da igual.</p>",
        comando: "cat tsconfig.json",
        patrones: ["\"strict\": *true"],
        prohibidos: ["\"strict\": *false"],
        exito: "Modo estricto activo."
      },
      {
        id: "m3", tipo: "salida", titulo: "Que compile sin trampas",
        guia: "<p>Compila con <code>tsc --noEmit</code>. Y busca los <code>any</code>: cada uno es un agujero por el que se cuela justo el error que TypeScript debía evitar.</p>",
        comando: "npx tsc --noEmit && grep -c ': *any' *.ts",
        patrones: ["^ *0 *$|^$"],
        prohibidos: ["error TS"],
        pista: "Si necesitas un tipo que no conoces, usa unknown y estrecha con comprobaciones, no any.",
        exito: "Compila en estricto y sin any. Eso ya es TypeScript de verdad."
      }
    ]
  },
  {
    id: "ts-p2", titulo: "Librería tipada y publicada", nivel: "Intermedio", desdeUnidad: 5, tiempo: "55 min",
    resumen: "Convierte el carrito en un paquete con tipos exportados, compilación y pruebas.",
    objetivos: ["Configurar el proyecto", "Exportar tipos junto al código", "Probar el comportamiento"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Genera los .d.ts",
        guia: "<p>Activa <code>declaration: true</code> y compila a <code>dist/</code>.</p>" +
          "<p>Los <code>.d.ts</code> son lo que hace que quien instale tu paquete tenga autocompletado. Sin ellos, tu librería es una caja negra.</p>",
        comando: "ls dist/*.d.ts",
        patrones: ["[.]d[.]ts"],
        exito: "Tipos publicables generados."
      },
      {
        id: "m2", tipo: "salida", titulo: "El package.json apuntando bien",
        guia: "<p>Rellena <code>main</code>, <code>types</code> y <code>files</code>. Si <code>types</code> no apunta al <code>.d.ts</code>, nadie verá tus tipos aunque existan.</p>",
        comando: "cat package.json",
        patrones: ["\"types\"", "\"main\"|\"exports\""],
        exito: "Paquete bien declarado."
      },
      {
        id: "m3", tipo: "salida", titulo: "Pruebas de comportamiento",
        guia: "<p>Con Vitest o Jest, prueba tres cosas: el descuento, el carrito vacío y un caso justo en el límite (100.00 exactos).</p>" +
          "<p>Los límites son donde viven los errores.</p>",
        comando: "npx vitest run 2>&1 | tail -12",
        patrones: ["([0-9]+ passed|Tests:.*passed)"],
        prohibidos: ["([1-9][0-9]* failed|FAIL )"],
        exito: "Pruebas en verde, incluidos los bordes."
      },
      {
        id: "m4", tipo: "check", titulo: "Antes de publicar",
        guia: "<p>Lo que revisarías si fueras a subirlo a npm de verdad.</p>",
        criterios: [
          "El paquete no incluye el código fuente ni las pruebas en el tarball",
          "La versión sigue semver y hay un CHANGELOG",
          "El README tiene un ejemplo de uso que funciona"
        ]
      }
    ]
  },
  {
    id: "ts-p3", titulo: "Tipos avanzados en un cliente de API", nivel: "Avanzado", desdeUnidad: 7, tiempo: "1 h",
    resumen: "Que el tipo de la respuesta dependa de la ruta que pides, y que los errores sean valores.",
    objetivos: ["Usar genéricos y tipos mapeados", "Modelar errores como valores", "Estrechar tipos con guardas"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Un mapa de rutas a tipos",
        guia: "<p>Define el mapa:</p>" +
          "<pre class=\"dg-pre\">type Rutas = {\n  \"/usuarios\": Usuario[];\n  \"/tareas\": Tarea[];\n};</pre>" +
          "<p>Y la función <code>get&lt;R extends keyof Rutas&gt;(ruta: R): Promise&lt;Rutas[R]&gt;</code>.</p>" +
          "<p>A partir de ahí, el editor sabe qué devuelve cada llamada sin que tú anotes nada.</p>",
        comando: "cat cliente.ts",
        patrones: ["keyof", "extends", "Promise<"],
        exito: "El tipo de la respuesta lo deduce la ruta."
      },
      {
        id: "m2", tipo: "salida", titulo: "Errores como valores",
        guia: "<p>En vez de lanzar excepciones, devuelve un resultado explícito:</p>" +
          "<pre class=\"dg-pre\">type Resultado&lt;T&gt; =\n  | { ok: true; valor: T }\n  | { ok: false; error: string };</pre>" +
          "<p>Con esto TypeScript te <b>obliga</b> a mirar el error antes de tocar el valor. Un try/catch no obliga a nada.</p>",
        comando: "cat cliente.ts",
        patrones: ["ok: *true", "ok: *false"],
        exito: "Los errores forman parte del tipo, no son una sorpresa en tiempo de ejecución."
      },
      {
        id: "m3", tipo: "salida", titulo: "Sin casts",
        guia: "<p>Busca los <code>as</code> de tu código. Cada uno es un «créeme» que apaga al compilador. Sustitúyelos por guardas de tipo (<code>function esUsuario(x: unknown): x is Usuario</code>).</p>",
        comando: "grep -n ' as ' *.ts | grep -v 'as const'",
        patrones: ["^$|^ *$"],
        pista: "«as const» sí está bien: ese no apaga nada, fija literales.",
        exito: "Sin atajos: el compilador sigue trabajando para ti."
      },
      {
        id: "m4", tipo: "check", titulo: "Comprueba la ergonomía",
        guia: "<p>Úsalo desde otro fichero y fíjate en lo que te ofrece el editor.</p>",
        criterios: [
          "Al escribir get(\"/usuarios\") el editor ya sabe que devuelve Usuario[]",
          "Si me olvido de comprobar ok, el compilador se queja",
          "Una ruta inventada da error de compilación"
        ]
      }
    ]
  }
],

/* ---------------- React ---------------- */
react: [
{
    id: "rc-p1", titulo: "Lista de tareas con estado", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "50 min",
    resumen: "Tu primera aplicación de React, con el estado en el sitio correcto desde el principio.",
    objetivos: ["Componer componentes", "Manejar estado", "No mutar lo que React vigila"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Componentes separados",
        guia: "<p>Crea el proyecto con Vite y divide en <code>Formulario</code>, <code>Lista</code> y <code>Tarea</code>.</p>" +
          "<p>El estado vive en el padre y baja por props: si dos componentes necesitan el mismo dato, sube el estado hasta el ancestro común.</p>",
        comando: "ls src/components/ 2>/dev/null || ls src/",
        patrones: ["(Formulario|Lista|Tarea|[.]jsx|[.]tsx)"],
        exito: "Componentes con una responsabilidad cada uno."
      },
      {
        id: "m2", tipo: "salida", titulo: "Estado sin mutar",
        guia: "<p>Al añadir o borrar, crea un array nuevo (<code>[...tareas, nueva]</code>, <code>filter</code>, <code>map</code>). Nada de <code>push</code> sobre el estado.</p>" +
          "<p>React compara referencias: si mutas el mismo array, no ve ningún cambio y no vuelve a pintar.</p>",
        comando: "grep -rn 'setTareas\\|useState' src/",
        patrones: ["useState"],
        prohibidos: ["tareas[.]push[(]", "tareas[.]splice[(]"],
        exito: "Estado inmutable, que es como React espera que lo trates."
      },
      {
        id: "m3", tipo: "salida", titulo: "Keys que identifican",
        guia: "<p>Usa como <code>key</code> el id de la tarea, no el índice.</p>" +
          "<p>Con el índice, si borras el primer elemento, React cree que cambió el contenido de todos: pierdes el foco, el texto escrito y el estado interno.</p>",
        comando: "grep -rn 'key=' src/",
        patrones: ["key=[{]"],
        prohibidos: ["key=[{]i[}]", "key=[{]index[}]", "key=[{]idx[}]"],
        exito: "Keys estables. Este fallo lo comete todo el mundo una vez."
      },
      {
        id: "m4", tipo: "check", titulo: "Pruébala como usuario",
        guia: "<p>Añade cinco tareas, marca alguna, borra la primera y comprueba que no se descoloca nada.</p>",
        criterios: [
          "No hay errores ni avisos en la consola",
          "Al borrar un elemento, los demás mantienen su estado",
          "Sé explicar por qué el estado vive en el componente padre"
        ]
      }
    ]
  },
  {
    id: "rc-p2", titulo: "Datos de una API con carga y errores", nivel: "Intermedio", desdeUnidad: 5, tiempo: "55 min",
    resumen: "Los tres estados que siempre existen aunque casi nadie los pinta: cargando, error y datos.",
    objetivos: ["Pedir datos en un efecto", "Cancelar al desmontar", "Pintar los tres estados"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Los tres estados",
        guia: "<p>Pide datos a una API pública y pinta:</p><ul>" +
          "<li>un indicador mientras carga</li>" +
          "<li>un mensaje si falla (con opción de reintentar)</li>" +
          "<li>los datos cuando llegan</li></ul>" +
          "<p>La pantalla en blanco durante dos segundos es un fallo de diseño, no un detalle.</p>",
        comando: "grep -rn 'cargando\\|loading\\|error' src/ | head -10",
        patrones: ["(cargando|loading)", "error"],
        exito: "Los tres caminos contemplados."
      },
      {
        id: "m2", tipo: "salida", titulo: "Cancela al desmontar",
        guia: "<p>Usa <code>AbortController</code> y aborta en la limpieza del efecto.</p>" +
          "<p>Si el componente se desmonta antes de que llegue la respuesta, sin esto te comes un aviso y, a veces, un error de estado en un componente que ya no existe.</p>",
        comando: "grep -rn -A3 'AbortController' src/",
        patrones: ["AbortController", "(abort[(][)]|signal)"],
        exito: "Peticiones que se cancelan solas. Detalle de profesional."
      },
      {
        id: "m3", tipo: "salida", titulo: "Buscador con retardo",
        guia: "<p>Añade un campo de búsqueda que espere ~300 ms antes de pedir (debounce).</p>" +
          "<p>Sin eso, escribir «kubernetes» dispara diez peticiones y llegan desordenadas: la respuesta de «kube» puede pisar a la de «kubernetes».</p>",
        comando: "grep -rn 'setTimeout\\|debounce' src/",
        patrones: ["(setTimeout|debounce)"],
        exito: "Una petición por búsqueda, no una por tecla."
      },
      {
        id: "m4", tipo: "check", titulo: "Comprueba el comportamiento raro",
        guia: "<p>Prueba lo que nadie prueba: desconecta la red a mitad de carga, escribe rápido y borra, navega a otra página mientras carga.</p>",
        criterios: [
          "Sin red, sale el mensaje de error y puedo reintentar",
          "No hay avisos de actualizar un componente desmontado",
          "El array de dependencias del efecto es correcto (sin bucles infinitos)"
        ]
      }
    ]
  },
  {
    id: "rc-p3", titulo: "Rutas, contexto y rendimiento", nivel: "Avanzado", desdeUnidad: 7, tiempo: "1 h 10 min",
    resumen: "Varias páginas, estado global sin sufrir, y una mejora de rendimiento que puedas demostrar con números.",
    objetivos: ["Usar React Router", "Compartir estado con contexto", "Medir antes de optimizar"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Rutas, incluida la de error",
        guia: "<p>Añade listado, detalle (<code>/cosa/:id</code>) y una ruta comodín para el 404.</p>" +
          "<p>La página de error es parte de la aplicación: una URL vieja no debe acabar en pantalla blanca.</p>",
        comando: "grep -rn 'path=' src/",
        patrones: ["path=", "(path=\"[*]\"|NotFound|404)"],
        exito: "Navegación completa, errores incluidos."
      },
      {
        id: "m2", tipo: "salida", titulo: "Contexto con su hook",
        guia: "<p>Crea el contexto (tema o sesión) y expón un hook <code>useTema()</code> que avise si se usa fuera del proveedor.</p>" +
          "<p>Ese error explícito ahorra media hora de «por qué es undefined».</p>",
        comando: "grep -rn 'createContext\\|useContext' src/",
        patrones: ["createContext", "useContext"],
        exito: "Estado global accesible y con red de seguridad."
      },
      {
        id: "m3", tipo: "salida", titulo: "Mide y mejora",
        guia: "<p>Con el Profiler de las React DevTools, graba una interacción y busca los componentes que se repintan sin motivo.</p>" +
          "<p>Arréglalo donde importe (memo, useMemo, useCallback o partir el contexto en dos). <b>Primero medir</b>: memoizar a ciegas suele empeorar las cosas.</p>",
        comando: "(pega los tiempos del Profiler: antes y después)",
        patrones: ["[0-9]+([.,][0-9]+)? *ms"],
        exito: "Mejora medida, no intuida."
      },
      {
        id: "m4", tipo: "salida", titulo: "Divide el código",
        guia: "<p>Carga la página de detalle con <code>lazy</code> y <code>Suspense</code>, y comprueba en la construcción que salen varios trozos.</p>",
        comando: "npm run build 2>&1 | tail -15",
        patrones: ["([0-9]+([.,][0-9]+)? *kB|chunk|assets)"],
        exito: "El usuario ya no se descarga la aplicación entera para ver la portada."
      }
    ]
  }
],

/* ---------------- Node.js ---------------- */
nodejs: [
{
    id: "nd-p1", titulo: "Herramienta de terminal: estadísticas de un texto", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "40 min",
    resumen: "Lee de la entrada estándar y saca líneas, palabras y la palabra más repetida. Como los comandos de Unix de siempre.",
    objetivos: ["Leer de la entrada estándar", "Procesar texto", "Imprimir un informe exacto"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "La idea de las herramientas de terminal",
        guia: "<p>Las herramientas de Unix hacen una cosa y leen de la entrada estándar, para poder encadenarlas con tuberías.</p>" +
          "<p>Tu programa va a hacer lo mismo: <code>cat texto.txt | node stats.js</code>. Nada de pedir la ruta ni hacer preguntas.</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "Escribe el contador",
        guia: "<p>Imprime exactamente tres líneas:</p>" +
          "<pre class=\"dg-pre\">lineas=2\npalabras=5\ntop=hola:2</pre>" +
          "<p>Reglas: la palabra más repetida se compara <b>en minúsculas y sin signos</b>; si hay empate, gana la que apareció primero.</p>",
        lenguaje: "js",
        plantilla: "const texto = require(\"fs\").readFileSync(0, \"utf8\");\n// imprime lineas=, palabras= y top=\n",
        pruebas: [
          { entrada: "hola mundo\nhola de nuevo", salida: "lineas=2\npalabras=5\ntop=hola:2" },
          { entrada: "uno dos tres", salida: "lineas=1\npalabras=3\ntop=uno:1" },
          { entrada: "Gato gato GATO perro\nperro", salida: "lineas=2\npalabras=5\ntop=gato:3", oculta: true },
          { entrada: "a, a. b", salida: "lineas=1\npalabras=3\ntop=a:2", oculta: true }
        ],
        solucion: "const texto = require(\"fs\").readFileSync(0, \"utf8\").replace(/\\s+$/, \"\");\nconst lineas = texto.split(\"\\n\");\nconst palabras = texto.split(/\\s+/).filter(Boolean);\nconst cuenta = new Map();\nfor (const p of palabras) { const k = p.toLowerCase().replace(/[^\\p{L}\\p{N}]/gu, \"\"); if (!k) continue; cuenta.set(k, (cuenta.get(k) || 0) + 1); }\nlet mejor = \"\", veces = 0;\nfor (const [k, v] of cuenta) if (v > veces) { mejor = k; veces = v; }\nconsole.log(\"lineas=\" + lineas.length);\nconsole.log(\"palabras=\" + palabras.length);\nconsole.log(\"top=\" + mejor + \":\" + veces);",
        exito: "Contador correcto, empates incluidos."
      },
      {
        id: "m3", tipo: "salida", titulo: "Úsalo de verdad, con una tubería",
        guia: "<p>Guarda tu programa como <code>stats.js</code> y pásale un fichero real por tubería.</p>",
        comando: "cat README.md | node stats.js",
        patrones: ["lineas=[0-9]+", "palabras=[0-9]+", "top=.+:[0-9]+"],
        exito: "Tu primera herramienta de terminal, encadenable con cualquier otra."
      }
    ]
  },
  {
    id: "nd-p2", titulo: "API HTTP sin dependencias", nivel: "Intermedio", desdeUnidad: 5, tiempo: "1 h",
    resumen: "Un servidor con la biblioteca estándar: enrutado a mano, JSON en disco y escritura que no corrompe datos.",
    objetivos: ["Servir HTTP sin frameworks", "Leer cuerpos JSON", "Guardar de forma segura"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El servidor responde",
        guia: "<p>Con <code>http.createServer</code>, monta un enrutador simple (método + ruta) y una ruta de salud.</p>" +
          "<p>Sin Express. La idea es ver qué hace un framework por ti, para saber qué te estás ahorrando.</p>",
        comando: "curl -s -i http://localhost:3000/salud | head -5",
        patrones: ["200"],
        prohibidos: ["000"],
        exito: "Servidor propio en marcha."
      },
      {
        id: "m2", tipo: "salida", titulo: "Crear y listar",
        guia: "<p>Implementa <code>POST</code> y <code>GET</code> de una colección. Acuérdate de leer el cuerpo por trozos: en Node el cuerpo llega en fragmentos, no de golpe.</p>" +
          "<p>Y pon un límite de tamaño: sin él, cualquiera puede tumbarte mandando un cuerpo gigante.</p>",
        comando: "curl -s -X POST http://localhost:3000/cosas -H 'Content-Type: application/json' -d '{\"nombre\":\"prueba\"}' && curl -s http://localhost:3000/cosas",
        patrones: ["prueba"],
        exito: "Crear y listar funcionando."
      },
      {
        id: "m3", tipo: "salida", titulo: "Escritura atómica",
        guia: "<p>Guarda escribiendo primero en un fichero temporal y renombrando después (<code>rename</code> es atómico en el mismo sistema de ficheros).</p>" +
          "<p>Si escribes directamente y el proceso muere a mitad, te quedas con un JSON cortado y sin datos.</p>",
        comando: "grep -n 'rename\\|tmp' *.js",
        patrones: ["rename"],
        exito: "Datos a salvo de un corte a mitad de escritura."
      },
      {
        id: "m4", tipo: "salida", titulo: "Los códigos correctos",
        guia: "<p>Comprueba: 201 al crear, 404 en lo que no existe, 400 con JSON inválido. Y que un JSON roto <b>no</b> tire el servidor.</p>",
        comando: "curl -s -o /dev/null -w \"%{http_code}\" -X POST http://localhost:3000/cosas -H 'Content-Type: application/json' -d 'esto no es json'",
        patrones: ["400"],
        prohibidos: ["(000|500)"],
        exito: "Entrada basura controlada, que es la que siempre llega."
      }
    ]
  },
  {
    id: "nd-p3", titulo: "Streams, procesos y cierre ordenado", nivel: "Avanzado", desdeUnidad: 7, tiempo: "1 h 15 min",
    resumen: "Procesa un fichero enorme sin quedarte sin memoria y apaga el servidor sin cortar peticiones.",
    objetivos: ["Usar streams", "Repartir trabajo", "Apagar con gracia"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El fichero grande",
        guia: "<p>Genera un CSV de varios cientos de megas (un bucle escribiendo líneas vale).</p>" +
          "<p>Pega el tamaño.</p>",
        comando: "ls -lh datos.csv",
        patrones: ["[0-9]+([.,][0-9]+)? *[MG]"],
        exito: "Ya tienes un fichero que no cabe cómodamente en memoria."
      },
      {
        id: "m2", tipo: "salida", titulo: "Compara memoria: entero contra streams",
        guia: "<p>Procésalo de las dos formas y mide la memoria máxima:</p><ul>" +
          "<li><code>readFileSync</code> entero → la memoria sube con el fichero</li>" +
          "<li><code>createReadStream</code> + <code>pipeline</code> → la memoria se queda plana</li></ul>" +
          "<p>Pega las dos mediciones (<code>process.memoryUsage().heapUsed</code> o <code>/usr/bin/time -v</code>).</p>",
        comando: "node --expose-gc procesar-stream.js datos.csv",
        patrones: ["[0-9]+"],
        exito: "Ahí está la diferencia entre «funciona en mi portátil» y «aguanta en producción»."
      },
      {
        id: "m3", tipo: "salida", titulo: "Reparte el trabajo",
        guia: "<p>Divide el procesamiento entre varios procesos (<code>child_process</code>) o hilos (<code>worker_threads</code>) y compara tiempos.</p>" +
          "<p>Node es de un solo hilo para tu código: si la tarea es de CPU, esta es la única salida.</p>",
        comando: "(pega los tiempos: 1 proceso frente a N procesos)",
        patrones: ["[0-9]+([.,][0-9]+)? *(s|ms|segundos)"],
        exito: "Trabajo repartido y tiempo medido."
      },
      {
        id: "m4", tipo: "salida", titulo: "Apagado ordenado",
        guia: "<p>Atiende <code>SIGTERM</code>: deja de aceptar conexiones nuevas, termina las que están en curso y sal con código 0.</p>" +
          "<p>Esto es lo que espera Docker o Kubernetes cuando te para. Sin ello, cada despliegue corta peticiones a medias.</p>",
        comando: "grep -n -A5 'SIGTERM' *.js",
        patrones: ["SIGTERM", "(close[(]|server[.]close)"],
        exito: "Se apaga sin dejar a nadie colgado."
      },
      {
        id: "m5", tipo: "check", titulo: "Compruébalo de verdad",
        guia: "<p>Lanza peticiones lentas y manda SIGTERM a mitad.</p>",
        criterios: [
          "Las peticiones en curso terminan bien tras el SIGTERM",
          "No se aceptan conexiones nuevas después de la señal",
          "El proceso sale solo, sin necesidad de SIGKILL"
        ]
      }
    ]
  }
],

/* ---------------- Seguridad ---------------- */
seguridad: [
{
    id: "sg-p1", titulo: "Medidor de contraseñas", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "35 min",
    resumen: "Evalúa una contraseña con las reglas que de verdad importan, no con las que molestan.",
    objetivos: ["Saber qué hace fuerte a una contraseña", "Dar consejos accionables", "Evitar reglas absurdas"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Lo que importa y lo que no",
        guia: "<p>Las reglas típicas («una mayúscula, un número y un símbolo») empujan a la gente a <code>Password1!</code>, que es de las primeras que prueba cualquier atacante.</p>" +
          "<p>Lo que de verdad cuenta:</p><ul>" +
          "<li><b>Longitud</b>: cada carácter multiplica el trabajo del atacante.</li>" +
          "<li><b>Variedad</b>: amplía el alfabeto a probar.</li>" +
          "<li><b>Que no esté filtrada</b>: si está en una lista conocida, da igual lo larga que sea.</li></ul>" +
          "<p>Por eso tu medidor va a tener una lista negra que manda sobre todo lo demás.</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "Escribe el medidor",
        guia: "<p>Lee una contraseña y puntúa de 0 a 5: un punto por tener 12 o más caracteres, uno por minúsculas, uno por mayúsculas, uno por dígitos y uno por símbolos.</p>" +
          "<p>Si está en la lista negra (<code>123456</code>, <code>password</code>, <code>qwerty</code>, <code>admin</code>), la puntuación es <b>0</b> aunque cumpla todo.</p>" +
          "<p>Imprime <code>puntos=N</code> y <code>nivel=</code> con <i>debil</i> (0-2), <i>media</i> (3) o <i>fuerte</i> (4-5).</p>",
        lenguaje: "py",
        plantilla: "clave = input()\n# calcula puntos e imprime puntos= y nivel=\n",
        pruebas: [
          { entrada: "Contrasena123!", salida: "puntos=5\nnivel=fuerte" },
          { entrada: "password", salida: "puntos=0\nnivel=debil" },
          { entrada: "abcdefghijkl", salida: "puntos=2\nnivel=debil" },
          { entrada: "Abc123!x", salida: "puntos=4\nnivel=fuerte", oculta: true },
          { entrada: "QWERTY", salida: "puntos=0\nnivel=debil", oculta: true }
        ],
        solucion: "clave = input()\nnegras = {\"123456\", \"password\", \"qwerty\", \"admin\"}\nif clave.lower() in negras:\n    puntos = 0\nelse:\n    puntos = 0\n    if len(clave) >= 12: puntos += 1\n    if any(c.islower() for c in clave): puntos += 1\n    if any(c.isupper() for c in clave): puntos += 1\n    if any(c.isdigit() for c in clave): puntos += 1\n    if any(not c.isalnum() for c in clave): puntos += 1\nnivel = \"debil\" if puntos <= 2 else (\"media\" if puntos == 3 else \"fuerte\")\nprint(f\"puntos={puntos}\")\nprint(f\"nivel={nivel}\")",
        exito: "Medidor funcionando, con la lista negra mandando sobre todo."
      },
      {
        id: "m3", tipo: "check", titulo: "Lo que harías en un sistema real",
        guia: "<p>En producción no se guardan contraseñas: se guardan <b>hashes</b> con un algoritmo lento y con sal (bcrypt, scrypt o Argon2). Nunca MD5 ni SHA-1, que son rápidos y por eso malos para esto.</p>",
        criterios: [
          "Sé por qué un hash rápido es malo para contraseñas",
          "Sé qué aporta la sal frente a las tablas precalculadas",
          "Sé qué servicio consultar para saber si una contraseña está filtrada"
        ]
      }
    ]
  },
  {
    id: "sg-p2", titulo: "Rompe y arregla una aplicación vulnerable", nivel: "Intermedio", desdeUnidad: 4, tiempo: "1 h 10 min",
    resumen: "Explota inyección SQL y XSS en un entorno de prácticas, y después corrige el código.",
    objetivos: ["Ver el daño de verdad", "Corregir con consultas preparadas y escapado", "Comprobar que el arreglo funciona"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Dónde se practica esto",
        guia: "<p>Solo en entornos preparados para ello: <b>OWASP Juice Shop</b>, <b>DVWA</b> o un laboratorio tuyo. Levántalo en Docker y desconéctalo de internet.</p>" +
          "<p>Probar esto en un sistema que no es tuyo y sin permiso por escrito es un delito. No hay matices.</p>"
      },
      {
        id: "m2", tipo: "salida", titulo: "Inyección SQL, y por qué funciona",
        guia: "<p>En el formulario de acceso, entra sin contraseña. Lo clásico: <code>' OR '1'='1</code>.</p>" +
          "<p>Funciona porque la consulta se construye pegando texto:</p>" +
          "<pre class=\"dg-pre\">\"SELECT * FROM users WHERE user='\" + u + \"' AND pass='\" + p + \"'\"</pre>" +
          "<p>Tu entrada deja de ser un dato y pasa a ser <b>parte de la consulta</b>. Ese es todo el truco.</p>" +
          "<p>Pega la consulta vulnerable que encontraste (o la que reproduce el fallo).</p>",
        comando: "(pega el trozo de código vulnerable)",
        patrones: ["(SELECT|select)", "([+]|[.]|concat|f\"|[$][{])"],
        exito: "Localizado el pegado de cadenas. Ahí es donde entra el ataque."
      },
      {
        id: "m3", tipo: "salida", titulo: "Arréglalo con consultas preparadas",
        guia: "<p>Reescríbelo con parámetros: la consulta va por un lado y los datos por otro, así que el motor <b>nunca</b> interpreta tu entrada como SQL.</p>" +
          "<p>Escapar a mano no vale: siempre se escapa un caso.</p>",
        comando: "(pega tu versión corregida)",
        patrones: ["([?]|[$][0-9]|:[a-z_]+|prepare|PreparedStatement|execute[(].*,)"],
        prohibidos: ["(SELECT|select).*[+] *(u|user|usuario|input)"],
        exito: "Consulta parametrizada. Este arreglo sirve para el 100% de las inyecciones SQL."
      },
      {
        id: "m4", tipo: "salida", titulo: "XSS almacenado y su arreglo",
        guia: "<p>Mete <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> en un comentario y recarga: si salta, el sitio guarda HTML y lo devuelve tal cual.</p>" +
          "<p>Se arregla <b>escapando al pintar</b> (y, en una plantilla moderna, no usando <code>innerHTML</code> ni <code>dangerouslySetInnerHTML</code>). Pega tu arreglo.</p>",
        comando: "(pega el código de pintado corregido)",
        patrones: ["(escape|textContent|innerText|htmlspecialchars|[{][{] *[a-z]|esc[(])"],
        prohibidos: ["innerHTML *=", "dangerouslySetInnerHTML"],
        exito: "Escapado al pintar: el texto vuelve a ser texto."
      },
      {
        id: "m5", tipo: "check", titulo: "Vuelve a intentarlo",
        guia: "<p>Repite los dos ataques sobre tu versión corregida. Un arreglo que no compruebas es una esperanza.</p>",
        criterios: [
          "La inyección ya no entra",
          "El script del comentario se ve como texto, no se ejecuta",
          "Sé explicar por qué escapar a mano no es suficiente contra SQL"
        ]
      }
    ]
  },
  {
    id: "sg-p3", titulo: "Revisión de seguridad de un despliegue", nivel: "Avanzado", desdeUnidad: 6, tiempo: "1 h",
    resumen: "Audita algo tuyo: secretos, dependencias, cabeceras, imagen y permisos.",
    objetivos: ["Buscar secretos filtrados", "Analizar dependencias e imagen", "Endurecer la configuración"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Secretos en el historial",
        guia: "<p>Borrar un token en un commit posterior <b>no lo borra</b>: sigue en la historia y se puede recuperar. Busca con <code>gitleaks detect</code> o similar.</p>" +
          "<p>Si encuentras alguno: lo primero es <b>revocarlo</b>, no limpiar el historial. Asume que ya lo leyeron.</p>",
        comando: "gitleaks detect --no-banner --redact 2>&1 | tail -20",
        patrones: ["(no leaks found|leaks found|findings|Finding)"],
        exito: "Historial revisado."
      },
      {
        id: "m2", tipo: "salida", titulo: "Dependencias e imagen",
        guia: "<p>Analiza dependencias (<code>npm audit</code>, <code>pip-audit</code>, <code>mvn dependency-check</code>) y la imagen con Trivy.</p>" +
          "<p>No hace falta llegar a cero: lo que importa es que las críticas estén corregidas o justificadas por escrito.</p>",
        comando: "trivy image --severity HIGH,CRITICAL TU-IMAGEN 2>&1 | tail -25",
        patrones: ["(Total|HIGH|CRITICAL|vulnerabilit)"],
        exito: "Ya sabes qué arrastras. La mayoría se arregla actualizando la imagen base."
      },
      {
        id: "m3", tipo: "salida", titulo: "Cabeceras de seguridad",
        guia: "<p>Comprueba que la aplicación manda al menos: <code>Strict-Transport-Security</code>, <code>X-Content-Type-Options: nosniff</code> y una <code>Content-Security-Policy</code>.</p>" +
          "<p>Son tres líneas de configuración que cortan de raíz familias enteras de ataques.</p>",
        comando: "curl -s -I https://TU-DOMINIO/ | grep -i -E 'strict-transport|content-type-options|content-security|x-frame'",
        patrones: ["(strict-transport-security|content-security-policy|x-content-type-options)"],
        exito: "Cabeceras puestas."
      },
      {
        id: "m4", tipo: "salida", titulo: "El contenedor, sin privilegios",
        guia: "<p>Comprueba que no corre como root y que el sistema de ficheros es de solo lectura si puede serlo.</p>",
        comando: "docker inspect --format \"{{.Config.User}}\" TU-CONTENEDOR && docker exec TU-CONTENEDOR id -u",
        patrones: ["[1-9][0-9]*"],
        prohibidos: ["^ *0 *$"],
        exito: "Sin root dentro del contenedor."
      },
      {
        id: "m5", tipo: "check", titulo: "El informe con prioridades",
        guia: "<p>Escribe <code>SEGURIDAD.md</code>: qué encontraste, qué arreglaste y qué queda, ordenado por riesgo real (no por el color que le pone la herramienta).</p>",
        criterios: [
          "No queda ningún secreto vivo en el repositorio",
          "Las vulnerabilidades críticas están corregidas o justificadas",
          "El informe prioriza por impacto real, no por severidad nominal"
        ]
      }
    ]
  }
],

/* ---------------- Docker ---------------- */
docker: [
  {
    id: "dk-p1", titulo: "Tu primer contenedor servido", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "25 min",
    resumen: "Sirve una web tuya dentro de un contenedor de nginx, publicada en el puerto 8080 de tu máquina.",
    objetivos: ["Publicar un puerto con docker run", "Montar tu carpeta dentro del contenedor", "Leer logs y limpiar al terminar"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Prepara la carpeta y la página",
        guia: "<p>Crea una carpeta <code>web/</code> con un fichero <code>index.html</code> dentro. Que tenga al menos un título con tu nombre:</p>" +
          "<pre class=\"dg-pre\">&lt;!doctype html&gt;\n&lt;html lang=\"es\"&gt;\n  &lt;h1&gt;Hola, soy TU NOMBRE&lt;/h1&gt;\n&lt;/html&gt;</pre>" +
          "<p>Cuando lo tengas, enséñamelo: ejecuta el comando de abajo y pega aquí lo que salga.</p>",
        comando: "cat web/index.html",
        patrones: ["<h1", "html"],
        exito: "La página existe y tiene un encabezado. Ya hay algo que servir."
      },
      {
        id: "m2", tipo: "term", titulo: "Levanta nginx con tu carpeta montada",
        guia: "<p>Ahora el comando que lo junta todo. Necesitas cuatro cosas:</p><ul>" +
          "<li><code>-d</code> para que quede en segundo plano</li>" +
          "<li><code>--name mi-web</code> para poder llamarlo por su nombre</li>" +
          "<li><code>-p 8080:80</code> para publicar el puerto 80 del contenedor en el 8080 tuyo</li>" +
          "<li><code>-v \"$PWD/web:/usr/share/nginx/html:ro\"</code> para que sirva TU carpeta, en solo lectura</li></ul>" +
          "<p>La imagen: <code>nginx:1.27-alpine</code>. Escríbelo aquí abajo.</p>",
        pista: "docker run -d --name mi-web -p 8080:80 -v \"$PWD/web:/usr/share/nginx/html:ro\" nginx:1.27-alpine",
        re: "^(?=.* -d( |$))(?=.*--name mi-web)(?=.*-p 8080:80)(?=.*-v )(?=.*web)(?=.*nginx)docker run .*",
        sol: ["docker run -d --name mi-web -p 8080:80 -v \"$PWD/web:/usr/share/nginx/html:ro\" nginx:1.27-alpine"],
        salida: "Unable to find image 'nginx:1.27-alpine' locally\n1.27-alpine: Pulling from library/nginx\nStatus: Downloaded newer image for nginx:1.27-alpine\n7f3c1b0a9e64d1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7081920",
        exito: "Ese es el comando. Ejecútalo también en tu máquina antes de seguir."
      },
      {
        id: "m3", tipo: "salida", titulo: "Comprueba que está en marcha y con el puerto publicado",
        guia: "<p>Un contenedor puede existir y estar parado. Queremos verlo <b>Up</b> y con el puerto mapeado.</p>" +
          "<p>Ejecuta esto en tu máquina y pega la salida entera.</p>",
        comando: "docker ps --filter name=mi-web",
        patrones: ["mi-web", "Up", "8080"],
        prohibidos: ["Exited", "Created"],
        pista: "Si no aparece nada, el contenedor no arrancó: mira «docker ps -a» y «docker logs mi-web».",
        exito: "Contenedor arriba y puerto 8080 publicado."
      },
      {
        id: "m4", tipo: "salida", titulo: "Que responda de verdad tu página",
        guia: "<p>Que el contenedor esté Up no significa que sirva lo tuyo. Pídele la página y comprueba que sale TU HTML, no el de bienvenida de nginx.</p>" +
          "<p>Abre también <code>http://localhost:8080</code> en el navegador.</p>",
        comando: "curl -s http://localhost:8080",
        patrones: ["<h1"],
        prohibidos: ["Welcome to nginx"],
        pista: "Si sale «Welcome to nginx», el montaje no está funcionando: revisa la ruta del -v y que dentro sea /usr/share/nginx/html.",
        exito: "Tu página se sirve desde el contenedor. El montaje funciona."
      },
      {
        id: "m5", tipo: "salida", titulo: "Encuentra tu petición en los logs",
        guia: "<p>Todo lo que el contenedor escribe por salida estándar acaba en los logs. Tu visita al navegador dejó una línea ahí.</p>",
        comando: "docker logs mi-web",
        patrones: ["GET /"],
        exito: "Ahí está tu petición. Los logs son lo primero que se mira cuando algo falla."
      },
      {
        id: "m6", tipo: "term", titulo: "Recoge la mesa",
        guia: "<p>Para terminar, borra el contenedor. Un solo comando, que lo para y lo elimina aunque esté en marcha.</p>",
        pista: "La orden de borrar, con la bandera de forzar, y el nombre.",
        sol: ["docker rm -f mi-web", "docker container rm -f mi-web"],
        salida: "mi-web",
        exito: "Limpio. Tu carpeta web/ sigue intacta: el contenedor era lo desechable."
      }
    ]
  },
  {
    id: "dk-p2", titulo: "Empaqueta una API en una imagen pequeña", nivel: "Intermedio", desdeUnidad: 4, tiempo: "50 min",
    resumen: "Escribe un Dockerfile multi-stage, con caché aprovechada y usuario sin privilegios, y mide cuánto adelgaza la imagen.",
    objetivos: ["Separar compilación y ejecución", "Ordenar las capas para la caché", "No ejecutar como root"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Escribe el Dockerfile multi-stage",
        guia: "<p>Vas a empaquetar una aplicación de <b>{{stack:nombre}}</b>. Escribe un <code>Dockerfile</code> con <b>dos etapas</b>:</p><ul>" +
          "<li>una de construcción, con el compilador y las dependencias, nombrada con <code>AS build</code></li>" +
          "<li>una final, ligera, que solo copia el resultado con <code>COPY --from=build</code></li></ul>" +
          "<p>Para tu stack, la etapa de construcción parte de <code>{{stack:baseBuild}}</code> y la final de <code>{{stack:base}}</code>. Copia primero <code>{{stack:deps}}</code>, instala, y solo después el código.</p>" +
          "<p>Reglas de la casa: nada de <code>:latest</code>, y la etapa final termina con un <code>USER</code> sin privilegios.</p>" +
          "<p><i>{{stack:nota}}</i></p><p>Pega aquí tu Dockerfile entero.</p>",
        comando: "cat Dockerfile",
        patrones: ["FROM .* AS ", "COPY --from=", "^ *USER "],
        prohibidos: [":latest"],
        pista: "Una referencia válida para {{stack:nombre}}:\n\n{{stack:dockerfile}}",
        exito: "Dos etapas, copia entre ellas, versiones fijadas y sin root. Eso es un Dockerfile de los buenos."
      },
      {
        id: "m2", tipo: "salida", titulo: "Constrúyela",
        guia: "<p>Construye la imagen con la etiqueta <code>api:multi</code> y pega la parte final de la salida, donde se ve que terminó bien.</p>",
        comando: "docker build -t api:multi .",
        patrones: ["(naming to|writing image|Successfully built|FINISHED|DONE)"],
        pista: "Si falla en una capa, el error te dice exactamente en qué instrucción: léelo de abajo arriba.",
        exito: "Imagen construida."
      },
      {
        id: "m3", tipo: "salida", titulo: "Demuestra que la caché funciona",
        guia: "<p>Cambia una línea de tu código (no de <code>{{stack:deps}}</code>) y vuelve a construir. Si ordenaste bien las capas, la instalación de dependencias debe salir de la caché.</p>" +
          "<p>Pega la salida de la segunda construcción: tiene que aparecer <code>CACHED</code>.</p>",
        comando: "docker build -t api:multi .",
        patrones: ["CACHED"],
        pista: "Copia primero {{stack:deps}}, ejecuta «{{stack:instalar}}», y solo después copia el resto del código.",
        exito: "Caché aprovechada: las construcciones siguientes te van a costar segundos, no minutos."
      },
      {
        id: "m4", tipo: "salida", titulo: "Comprueba que no corre como root",
        guia: "<p>Un contenedor que corre como root es root en tu kernel si se escapa. Compruébalo de la forma más directa: pregúntale al propio contenedor quién es.</p>",
        comando: "docker run --rm api:multi id -u",
        patrones: ["^ *[1-9][0-9]*"],
        prohibidos: ["^ *0 *$"],
        pista: "Si devuelve 0, eres root. Añade un usuario en el Dockerfile y ponlo con USER antes del CMD.",
        exito: "Usuario sin privilegios confirmado."
      },
      {
        id: "m5", tipo: "salida", titulo: "Mide el antes y el después",
        guia: "<p>Construye también la versión de una sola etapa con la etiqueta <code>api:gorda</code> y compara los tamaños.</p>" +
          "<p>Pega la tabla: quiero ver las dos.</p>",
        comando: "docker images --format \"table {{.Repository}}:{{.Tag}}\\t{{.Size}}\" | grep api",
        patrones: ["api:multi", "api:gorda"],
        exito: "Ahí tienes la diferencia, en megas. Eso es lo que ahorras en cada despliegue."
      },
      {
        id: "m6", tipo: "check", titulo: "Repasa lo que has aprendido",
        guia: "<p>Antes de entregar, confirma que entiendes lo que hiciste. Esto no lo puede comprobar la plataforma: es cosa tuya ser honesto.</p>",
        criterios: [
          "Sé explicar por qué la etapa final no necesita el compilador",
          "Sé por qué se copia el fichero de dependencias antes que el código",
          "Sé qué riesgo tiene ejecutar como root dentro del contenedor"
        ]
      }
    ]
  },
  {
    id: "dk-p3", titulo: "Un stack completo con Compose", nivel: "Avanzado", desdeUnidad: 6, tiempo: "1 h",
    resumen: "API, base de datos y panel de administración con un solo comando, con datos que sobreviven a los reinicios.",
    objetivos: ["Escribir un compose con varios servicios", "Usar volúmenes con nombre y healthchecks", "Configurar por variables de entorno"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Escribe el compose y valídalo",
        guia: "<p>Crea un <code>compose.yml</code> con tres servicios: <code>api</code>, <code>db</code> (PostgreSQL) y <code>adminer</code>.</p>" +
          "<p>La API se conecta a la base de datos por el <b>nombre del servicio</b> (<code>db</code>), nunca por <code>localhost</code>. Las contraseñas vienen de variables, no escritas a mano en el fichero.</p>" +
          "<p><code>docker compose config</code> resuelve el fichero y te lo devuelve ya interpretado: si hay un error de YAML, lo canta ahí. Pega su salida.</p>",
        comando: "docker compose config",
        patrones: ["api", "db", "adminer", "volumes"],
        prohibidos: ["localhost:5432"],
        pista: "Si config se queja de indentación, casi siempre hay un tabulador. YAML solo acepta espacios.",
        exito: "El compose es válido y tiene los tres servicios."
      },
      {
        id: "m2", tipo: "salida", titulo: "Levántalo entero",
        guia: "<p>Un comando, todo el stack. Pega la salida de los contenedores en marcha.</p>",
        comando: "docker compose up -d && docker compose ps",
        patrones: ["api", "db", "adminer", "(running|Up)"],
        prohibidos: ["(Exit|restarting)"],
        exito: "Tres servicios en marcha con un solo comando. Esta es la gracia de Compose."
      },
      {
        id: "m3", tipo: "salida", titulo: "La base de datos, sana de verdad",
        guia: "<p>Añade un <code>healthcheck</code> a <code>db</code> (con <code>pg_isready</code>) y haz que la API espere con <code>depends_on</code> y <code>condition: service_healthy</code>.</p>" +
          "<p>Pregúntale a Docker por el estado de salud y pégalo.</p>",
        comando: "docker inspect --format \"{{.State.Health.Status}}\" $(docker compose ps -q db)",
        patrones: ["healthy"],
        prohibidos: ["starting", "unhealthy"],
        pista: "test: [\"CMD-SHELL\", \"pg_isready -U postgres\"] con su interval, timeout y retries.",
        exito: "Sana. Ahora la API ya no arranca contra una base de datos que todavía no acepta conexiones."
      },
      {
        id: "m4", tipo: "salida", titulo: "Que los datos sobrevivan",
        guia: "<p>La prueba de fuego del volumen: crea una tabla con datos, tira el stack con <code>docker compose down</code> (sin <code>-v</code>), vuelve a levantarlo y comprueba que siguen ahí.</p>" +
          "<p>Pega la consulta final con sus filas.</p>",
        comando: "docker compose exec -T db psql -U postgres -c \"select * from prueba;\"",
        patrones: ["[0-9]+ rows?|[(][0-9]+ fila"],
        pista: "Si los datos desaparecen, el volumen no es con nombre o hiciste down -v, que sí los borra.",
        exito: "Los datos siguen ahí después de destruir los contenedores. Eso es un volumen bien puesto."
      },
      {
        id: "m5", tipo: "check", titulo: "Revisa la configuración",
        guia: "<p>Lo último, que solo puedes confirmar tú.</p>",
        criterios: [
          "Ninguna contraseña está escrita dentro del compose.yml",
          "El fichero .env no está subido al repositorio",
          "Sé explicar por qué la API llega a la base de datos por el nombre «db»"
        ]
      }
    ]
  },
  {
    id: "dk-p4", titulo: "Arregla un stack roto", nivel: "Experto", desdeUnidad: 9, tiempo: "45 min",
    resumen: "Te damos ficheros con los fallos más típicos. Encuéntralos, arréglalos y demuestra que el stack arranca.",
    objetivos: ["Leer errores y llegar a la causa", "Reconocer los fallos clásicos de YAML y Dockerfile", "Validar antes de levantar"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "El paciente",
        guia: "<p>Copia estos dos ficheros tal cual en una carpeta nueva. Están rotos a propósito, con fallos reales de producción:</p>" +
          "<pre class=\"dg-pre\">services:\n  api:\n    build: .\n    ports:\n      - 8080:80\n    depends_on: db\n  db:\n\timage: postgres:16\n    environment:\n      POSTGRES_PASSWORD: 1234</pre>" +
          "<pre class=\"dg-pre\">FROM openjdk:latest\nCOPY . .\nRUN mvn package\nCMD mvn spring-boot:run</pre>" +
          "<p>Hay cinco problemas. Tu trabajo: encontrarlos con las herramientas, no adivinando.</p>"
      },
      {
        id: "m2", tipo: "salida", titulo: "Que el YAML deje de quejarse",
        guia: "<p>Ejecuta <code>docker compose config</code> y ve arreglando lo que te diga, de uno en uno. Los sospechosos habituales:</p><ul>" +
          "<li>un tabulador donde deberían ir espacios</li>" +
          "<li><code>depends_on</code> esperando una lista, no un texto suelto</li>" +
          "<li>puertos sin comillas, que YAML interpreta como base 60</li></ul>" +
          "<p>Cuando <code>config</code> devuelva el fichero limpio, pégalo aquí.</p>",
        comando: "docker compose config",
        patrones: ["api", "db", "depends_on"],
        prohibidos: ["error|cannot|Additional property|yaml:"],
        exito: "YAML válido. Fíjate en cómo config te devolvió el fichero ya interpretado: ahí se ve lo que Docker entiende de verdad."
      },
      {
        id: "m3", tipo: "salida", titulo: "El Dockerfile, como debe ser",
        guia: "<p>Reescribe el Dockerfile arreglando lo que está mal:</p><ul>" +
          "<li><code>openjdk:latest</code> es una ruleta: fija la versión</li>" +
          "<li>copiar todo antes de las dependencias mata la caché</li>" +
          "<li>arrancar con Maven en producción mete el compilador en la imagen: usa multi-stage y ejecuta el jar</li></ul>" +
          "<p>Pega el Dockerfile corregido.</p>",
        comando: "cat Dockerfile",
        patrones: ["FROM .* AS ", "COPY --from=", "java -jar|ENTRYPOINT"],
        prohibidos: [":latest", "mvn spring-boot:run"],
        exito: "Versión fijada, dos etapas y arranque con el jar. Esto ya se puede desplegar."
      },
      {
        id: "m4", tipo: "salida", titulo: "Demuestra que arranca y responde",
        guia: "<p>Levanta el stack arreglado y comprueba que la API contesta de verdad, no solo que el contenedor existe.</p>",
        comando: "docker compose up -d && curl -s -o /dev/null -w \"%{http_code}\" http://localhost:8080",
        patrones: ["(200|302|404)"],
        prohibidos: ["(000|refused)"],
        pista: "Si sale 000, nadie escucha: mira «docker compose logs api» y revisa el puerto publicado.",
        exito: "Responde. Fallo diagnosticado y arreglado de punta a punta."
      },
      {
        id: "m5", tipo: "check", titulo: "Escribe lo que cambiaste",
        guia: "<p>En una avería real, lo que queda es la explicación. Anota en un fichero <code>ARREGLOS.md</code> los cinco fallos y por qué cada arreglo es el correcto.</p>",
        criterios: [
          "Tengo escritos los cinco fallos y su arreglo",
          "Sé explicar por qué 8080:80 sin comillas puede salir mal",
          "Sé por qué depends_on no garantiza que la base de datos esté lista"
        ]
      }
    ]
  }
],

/* ---------------- Python ---------------- */
python: [
{
    id: "py-p1", titulo: "Calculadora de propinas", nivel: "Fundamentos", desdeUnidad: 1, tiempo: "25 min",
    resumen: "Tu primer programa útil: lee dos números, calcula y da formato. Más difícil de lo que parece por los decimales.",
    objetivos: ["Leer entrada y convertir tipos", "Calcular porcentajes", "Dar formato con decimales fijos"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Propina y total",
        guia: "<p>Lee dos líneas: el importe y el porcentaje de propina.</p>" +
          "<p>Imprime dos líneas, <b>siempre con dos decimales</b>: primero la propina y después el total.</p>" +
          "<p>Fíjate en que <code>input()</code> devuelve texto: si no conviertes a número, <code>50 * 10</code> te repite la cadena cincuenta veces.</p>",
        lenguaje: "py",
        plantilla: "importe = float(input())\nporcentaje = float(input())\n# calcula e imprime la propina y el total\n",
        pruebas: [
          { entrada: "50\n10", salida: "5.00\n55.00" },
          { entrada: "23.45\n15", salida: "3.52\n26.97" },
          { entrada: "100\n0", salida: "0.00\n100.00", oculta: true },
          { entrada: "7.99\n20", salida: "1.60\n9.59", oculta: true }
        ],
        solucion: "importe = float(input())\nporcentaje = float(input())\npropina = importe * porcentaje / 100\nprint(f\"{propina:.2f}\")\nprint(f\"{importe + propina:.2f}\")",
        exito: "Formato exacto, incluidos los redondeos feos."
      },
      {
        id: "m2", tipo: "salida", titulo: "Ejecútalo en tu máquina",
        guia: "<p>Guárdalo como <code>propina.py</code> y ejecútalo en tu ordenador con Python instalado.</p>" +
          "<p>Escribir código en el navegador está bien; tenerlo corriendo en tu máquina es lo que te hace autónomo.</p>",
        comando: "printf '50\\n10\\n' | python3 propina.py",
        patrones: ["5[.,]00", "55[.,]00"],
        pista: "En Windows: echo 50 10 | python propina.py, o simplemente ejecútalo y escribe los números.",
        exito: "Corriendo en tu propio equipo."
      },
      {
        id: "m3", tipo: "check", titulo: "Piensa en el usuario",
        guia: "<p>¿Qué pasa si alguien escribe «cincuenta» en vez de 50? Pruébalo.</p>",
        criterios: [
          "He visto qué error da al meter texto donde va un número",
          "Sé cómo capturarlo con try/except ValueError",
          "Sé por qué el redondeo de dinero es delicado"
        ]
      }
    ]
  },
  {
    id: "py-p2", titulo: "Analizador de texto", nivel: "Intermedio", desdeUnidad: 3, tiempo: "40 min",
    resumen: "Un informe de un texto: líneas, palabras y la más repetida. El primer programa que se parece a una herramienta.",
    objetivos: ["Leer toda la entrada", "Contar con diccionarios", "Elegir la estructura adecuada"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "El informe",
        guia: "<p>Lee todo el texto y saca tres líneas:</p>" +
          "<pre class=\"dg-pre\">lineas=2\npalabras=4\ntop=hola</pre>" +
          "<p>Las líneas vacías no cuentan. La palabra más repetida se compara en minúsculas.</p>" +
          "<p><code>collections.Counter</code> hace esto en una línea, pero prueba primero con un diccionario normal para entender qué hace por dentro.</p>",
        lenguaje: "py",
        plantilla: "import sys\ntexto = sys.stdin.read()\n# imprime lineas=, palabras= y top=\n",
        pruebas: [
          { entrada: "hola mundo\nhola catappa", salida: "lineas=2\npalabras=4\ntop=hola" },
          { entrada: "uno dos dos tres tres tres", salida: "lineas=1\npalabras=6\ntop=tres" },
          { entrada: "Sol sol SOL luna", salida: "lineas=1\npalabras=4\ntop=sol", oculta: true }
        ],
        solucion: "import sys\nfrom collections import Counter\ntexto = sys.stdin.read()\nlineas = [l for l in texto.split(\"\\n\") if l.strip()]\npalabras = texto.split()\nc = Counter(p.lower() for p in palabras)\nprint(f\"lineas={len(lineas)}\")\nprint(f\"palabras={len(palabras)}\")\nprint(f\"top={c.most_common(1)[0][0]}\")",
        exito: "Informe correcto, mayúsculas incluidas."
      },
      {
        id: "m2", tipo: "salida", titulo: "Pásale un texto de verdad",
        guia: "<p>Aplícalo a un fichero real tuyo, por tubería.</p>",
        comando: "cat README.md | python3 analizar.py",
        patrones: ["lineas=[0-9]+", "palabras=[0-9]+", "top=.+"],
        exito: "Funciona con datos reales, que siempre son más sucios que los de prueba."
      },
      {
        id: "m3", tipo: "check", titulo: "Piensa en los casos raros",
        guia: "<p>Pruébalo con entrada vacía y con un texto con signos de puntuación pegados.</p>",
        criterios: [
          "Sé qué hace mi programa con la entrada vacía",
          "Sé por qué «hola,» y «hola» cuentan como distintas si no limpio los signos",
          "Sé qué ventaja tiene Counter frente a un diccionario a mano"
        ]
      }
    ]
  },
  {
    id: "py-p3", titulo: "Agenda de tareas por consola", nivel: "Avanzado", desdeUnidad: 6, tiempo: "50 min",
    resumen: "Un programa con estado: procesa órdenes y mantiene una lista viva.",
    objetivos: ["Procesar órdenes", "Mantener estado", "Formatear una salida legible"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Añadir, completar y listar",
        guia: "<p>Lee órdenes línea a línea:</p><ul>" +
          "<li><code>add titulo</code> añade una tarea</li>" +
          "<li><code>done N</code> marca la tarea N (empezando en 1)</li>" +
          "<li><code>list</code> imprime todas</li></ul>" +
          "<p>Formato de salida: <code>[x] titulo</code> si está hecha, <code>[ ] titulo</code> si no.</p>" +
          "<p>Ojo con <code>done</code> de un número que no existe: no debe reventar.</p>",
        lenguaje: "py",
        plantilla: "import sys\nfor linea in sys.stdin:\n    linea = linea.strip()\n    # procesa add / done / list\n",
        pruebas: [
          { entrada: "add comprar pan\nadd estudiar docker\ndone 1\nlist", salida: "[x] comprar pan\n[ ] estudiar docker" },
          { entrada: "add uno\nlist", salida: "[ ] uno" },
          { entrada: "add uno\ndone 9\nlist", salida: "[ ] uno", oculta: true },
          { entrada: "add a\nadd b\ndone 2\nlist", salida: "[ ] a\n[x] b", oculta: true }
        ],
        solucion: "import sys\ntareas = []\nfor linea in sys.stdin:\n    linea = linea.strip()\n    if linea.startswith(\"add \"):\n        tareas.append([linea[4:], False])\n    elif linea.startswith(\"done \"):\n        i = int(linea.split()[1]) - 1\n        if 0 <= i < len(tareas):\n            tareas[i][1] = True\n    elif linea == \"list\":\n        for titulo, hecha in tareas:\n            print(f\"[{'x' if hecha else ' '}] {titulo}\")",
        exito: "Agenda funcionando, con los índices fuera de rango controlados."
      },
      {
        id: "m2", tipo: "check", titulo: "Guárdalas en disco",
        guia: "<p>Amplíalo en tu máquina: que las tareas se guarden en un <code>tareas.json</code> y se recuperen al arrancar.</p>" +
          "<p>Ahí descubrirás el problema clásico: qué pasa si el fichero no existe la primera vez.</p>",
        criterios: [
          "Las tareas sobreviven a cerrar el programa",
          "La primera ejecución, sin fichero, no falla",
          "Sé por qué conviene escribir en temporal y renombrar"
        ]
      }
    ]
  },
  {
    id: "py-p4", titulo: "Cliente de API con errores bajo control", nivel: "Experto", desdeUnidad: 9, tiempo: "1 h",
    resumen: "Consume una API real: reintentos con espera creciente, tiempos límite y datos que no te fías.",
    objetivos: ["Manejar fallos de red", "Reintentar bien", "Validar lo que llega"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Espera creciente",
        guia: "<p>Antes de tocar la red, la lógica: calcula el tiempo de espera entre reintentos con <b>retroceso exponencial</b>.</p>" +
          "<p>Lee dos números: el intento (empezando en 0) y la base en segundos. Imprime <code>espera=</code> con el resultado de <code>base * 2^intento</code>, con un decimal, y con un tope de 30.0.</p>" +
          "<p>El tope importa: sin él, el sexto reintento espera un minuto y el décimo, veinte.</p>",
        lenguaje: "py",
        plantilla: "intento = int(input())\nbase = float(input())\n# imprime espera= con un decimal, con tope de 30.0\n",
        pruebas: [
          { entrada: "0\n1", salida: "espera=1.0" },
          { entrada: "3\n1", salida: "espera=8.0" },
          { entrada: "10\n1", salida: "espera=30.0" },
          { entrada: "2\n0.5", salida: "espera=2.0", oculta: true }
        ],
        solucion: "intento = int(input())\nbase = float(input())\nespera = min(base * (2 ** intento), 30.0)\nprint(f\"espera={espera:.1f}\")",
        exito: "Retroceso exponencial con tope. Esta fórmula la vas a usar toda tu carrera."
      },
      {
        id: "m2", tipo: "salida", titulo: "Llama a una API de verdad",
        guia: "<p>Con <code>httpx</code> o <code>requests</code>, llama a una API pública. Obligatorio:</p><ul>" +
          "<li><b>timeout</b> siempre (sin él, una petición puede colgarse para siempre)</li>" +
          "<li>reintentar solo los fallos temporales: 429, 5xx y errores de red</li>" +
          "<li>no reintentar un 400 o un 404: eso no mejora repitiendo</li></ul>",
        comando: "python3 cliente.py",
        patrones: ["."],
        exito: "Cliente que no se cuelga y que reintenta lo que tiene sentido reintentar."
      },
      {
        id: "m3", tipo: "salida", titulo: "No te fíes de lo que llega",
        guia: "<p>Valida la respuesta antes de usarla: con <code>pydantic</code>, o comprobando a mano que los campos existen y son del tipo que esperas.</p>" +
          "<p>Un <code>datos[\"items\"][0][\"nombre\"]</code> sin comprobar es un <code>KeyError</code> esperando el día que la API cambie.</p>",
        comando: "grep -n -E 'pydantic|BaseModel|isinstance|[.]get[(]' cliente.py",
        patrones: ["(pydantic|BaseModel|isinstance|[.]get[(])"],
        exito: "Datos validados en la frontera, que es donde hay que hacerlo."
      },
      {
        id: "m4", tipo: "check", titulo: "Pruébalo con la red en contra",
        guia: "<p>Simula los fallos: corta la red a mitad, apunta a un puerto cerrado, y mete una respuesta con un campo que falta.</p>",
        criterios: [
          "Sin red, falla con un mensaje claro y no se queda colgado",
          "Un 404 no provoca reintentos",
          "Una respuesta con un campo que falta da un error entendible"
        ]
      }
    ]
  }
],

/* ---------------- JavaScript ---------------- */
javascript: [
{
    id: "js-p1", titulo: "Formateador de precios", nivel: "Fundamentos", desdeUnidad: 1, tiempo: "20 min",
    resumen: "Convierte números sueltos en precios presentables. Lo primero que hace todo programa que muestra dinero.",
    objetivos: ["Recorrer un array", "Dar formato a números", "Escribir en consola"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Dos decimales y el símbolo",
        guia: "<p>Parte del array de la plantilla e imprime una línea por precio, con dos decimales y <code> €</code> al final:</p>" +
          "<pre class=\"dg-pre\">3.00 €\n12.50 €\n0.99 €</pre>" +
          "<p><code>toFixed(2)</code> devuelve <b>texto</b>, no número. Es justo lo que quieres aquí, pero no lo uses para seguir calculando.</p>",
        lenguaje: "js",
        plantilla: "const precios = [3, 12.5, 0.99];\n// imprime cada uno como 3.00 €\n",
        pruebas: [{ salida: "3.00 €\n12.50 €\n0.99 €" }],
        solucion: "const precios = [3, 12.5, 0.99];\nfor (const p of precios) console.log(p.toFixed(2) + \" €\");",
        exito: "Formato correcto en los tres casos, incluido el que no tenía decimales."
      },
      {
        id: "m2", tipo: "check", titulo: "La forma profesional",
        guia: "<p>En una aplicación real esto se hace con <code>Intl.NumberFormat</code>:</p>" +
          "<pre class=\"dg-pre\">new Intl.NumberFormat(\"es-ES\", { style: \"currency\", currency: \"EUR\" }).format(3)</pre>" +
          "<p>Porque el formato del dinero cambia por país: en España es <code>3,00 €</code> y en Estados Unidos <code>$3.00</code>. Pruébalo en la consola del navegador.</p>",
        criterios: [
          "He probado Intl.NumberFormat con es-ES y con en-US",
          "Sé por qué toFixed no vale para una aplicación internacional",
          "Sé que el separador decimal cambia según el idioma"
        ]
      }
    ]
  },
  {
    id: "js-p2", titulo: "Resumen de un carrito", nivel: "Intermedio", desdeUnidad: 4, tiempo: "35 min",
    resumen: "Recorre una lista de objetos y saca tres datos: unidades, total y el más caro.",
    objetivos: ["Usar reduce con criterio", "Trabajar con objetos", "Componer una salida exacta"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Las tres cuentas",
        guia: "<p>Del carrito de la plantilla, saca:</p>" +
          "<pre class=\"dg-pre\">unidades=4\ntotal=284.30\ncaro=monitor</pre>" +
          "<p>«El más caro» es por precio unitario, no por importe de línea. Léelo dos veces: este tipo de ambigüedad es la que causa errores en producción.</p>",
        lenguaje: "js",
        plantilla: "const carrito = [\n  { nombre: \"teclado\", precio: 45.5, cantidad: 1 },\n  { nombre: \"raton\", precio: 19.9, cantidad: 2 },\n  { nombre: \"monitor\", precio: 199, cantidad: 1 }\n];\n// imprime unidades=, total= y caro=\n",
        pruebas: [{ salida: "unidades=4\ntotal=284.30\ncaro=monitor" }],
        solucion: "const carrito = [\n  { nombre: \"teclado\", precio: 45.5, cantidad: 1 },\n  { nombre: \"raton\", precio: 19.9, cantidad: 2 },\n  { nombre: \"monitor\", precio: 199, cantidad: 1 }\n];\nconst unidades = carrito.reduce((a, p) => a + p.cantidad, 0);\nconst total = carrito.reduce((a, p) => a + p.precio * p.cantidad, 0);\nconst caro = carrito.reduce((a, p) => p.precio > a.precio ? p : a).nombre;\nconsole.log(\`unidades=\${unidades}\`);\nconsole.log(\`total=\${total.toFixed(2)}\`);\nconsole.log(\`caro=\${caro}\`);",
        exito: "Las tres cuentas correctas."
      },
      {
        id: "m2", tipo: "codigo", titulo: "Ahora con descuentos por cantidad",
        guia: "<p>Súbele un punto: si de un producto hay <b>3 o más unidades</b>, esa línea lleva un 5% de descuento.</p>" +
          "<p>Imprime <code>total=</code> con dos decimales. El carrito viene en la plantilla.</p>",
        lenguaje: "js",
        plantilla: "const carrito = [\n  { nombre: \"teclado\", precio: 10, cantidad: 3 },\n  { nombre: \"raton\", precio: 20, cantidad: 1 }\n];\n// 5% de descuento en las líneas con 3 o más unidades\n",
        pruebas: [{ salida: "total=48.50" }],
        solucion: "const carrito = [\n  { nombre: \"teclado\", precio: 10, cantidad: 3 },\n  { nombre: \"raton\", precio: 20, cantidad: 1 }\n];\nconst total = carrito.reduce((a, p) => {\n  const linea = p.precio * p.cantidad;\n  return a + (p.cantidad >= 3 ? linea * 0.95 : linea);\n}, 0);\nconsole.log(\`total=\${total.toFixed(2)}\`);",
        exito: "Descuento por línea aplicado. Fíjate en que el descuento va por línea, no sobre el total."
      },
      {
        id: "m3", tipo: "check", titulo: "El problema del dinero en coma flotante",
        guia: "<p>Prueba en la consola: <code>0.1 + 0.2</code>. No da 0.3.</p>" +
          "<p>Por eso en sistemas de pago el dinero se guarda en <b>céntimos como enteros</b>, o con una librería decimal. Con céntimos, 0.1 + 0.2 son 10 + 20 = 30, y no hay sorpresas.</p>",
        criterios: [
          "He comprobado que 0.1 + 0.2 no da 0.3",
          "Sé por qué pasa (los binarios no representan 0.1 exacto)",
          "Sé cómo se evita en un sistema real"
        ]
      }
    ]
  },
  {
    id: "js-p3", titulo: "Asincronía sin pisarse", nivel: "Avanzado", desdeUnidad: 10, tiempo: "50 min",
    resumen: "Varias promesas a la vez, errores que no se pierden y resultados que llegan en orden.",
    objetivos: ["Usar async/await bien", "Paralelizar con Promise.all", "Manejar errores parciales"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "En serie contra en paralelo",
        guia: "<p>Simula tres tareas que tardan. Ejecútalas <b>a la vez</b> con <code>Promise.all</code> y espera el resultado.</p>" +
          "<p>Imprime los resultados separados por coma. El fallo típico es hacer <code>await</code> dentro de un bucle: eso las pone en fila india y tardas la suma en vez del máximo.</p>",
        lenguaje: "js",
        plantilla: "const tarea = (n, ms) => new Promise(r => setTimeout(() => r(n * 2), ms));\n// ejecuta tarea(1,30), tarea(2,10) y tarea(3,20) a la vez\n// e imprime los resultados separados por coma, en el orden de entrada\n",
        pruebas: [{ salida: "2,4,6" }],
        solucion: "const tarea = (n, ms) => new Promise(r => setTimeout(() => r(n * 2), ms));\n(async () => {\n  const r = await Promise.all([tarea(1, 30), tarea(2, 10), tarea(3, 20)]);\n  console.log(r.join(\",\"));\n})();",
        exito: "En paralelo y en orden: Promise.all respeta el orden de entrada aunque terminen desordenadas."
      },
      {
        id: "m2", tipo: "codigo", titulo: "Cuando una falla",
        guia: "<p><code>Promise.all</code> se rinde en cuanto una falla. Si quieres el resultado de todas, usa <code>Promise.allSettled</code>.</p>" +
          "<p>Con tres tareas, una de las cuales falla, imprime <code>ok=2</code> y <code>fallos=1</code>.</p>",
        lenguaje: "js",
        plantilla: "const ok = n => Promise.resolve(n);\nconst falla = () => Promise.reject(new Error(\"vaya\"));\n// usa allSettled con [ok(1), falla(), ok(3)] e imprime ok= y fallos=\n",
        pruebas: [{ salida: "ok=2\nfallos=1" }],
        solucion: "const ok = n => Promise.resolve(n);\nconst falla = () => Promise.reject(new Error(\"vaya\"));\n(async () => {\n  const r = await Promise.allSettled([ok(1), falla(), ok(3)]);\n  const buenos = r.filter(x => x.status === \"fulfilled\").length;\n  console.log(\"ok=\" + buenos);\n  console.log(\"fallos=\" + (r.length - buenos));\n})();",
        exito: "Fallos parciales controlados. Esto es lo que quieres cuando pides datos a cinco sitios y uno está caído."
      },
      {
        id: "m3", tipo: "check", titulo: "Los errores que nadie ve",
        guia: "<p>Una promesa rechazada sin <code>catch</code> es un error silencioso. En Node se ve como <code>UnhandledPromiseRejection</code>; en el navegador, en la consola.</p>",
        criterios: [
          "Sé qué es una unhandled rejection y cómo detectarla",
          "Sé por qué await dentro de un for serializa el trabajo",
          "Sé cuándo usar Promise.all y cuándo allSettled"
        ]
      }
    ]
  }
],

/* ---------------- Java ---------------- */
java: [
{
    id: "jv-p1", titulo: "Conversor de temperaturas", nivel: "Fundamentos", desdeUnidad: 1, tiempo: "25 min",
    resumen: "Lee un número y conviértelo a dos escalas. Tu primer programa con entrada, cálculo y formato.",
    objetivos: ["Leer con Scanner", "Calcular con decimales", "Dar formato con printf"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Celsius a Fahrenheit y Kelvin",
        guia: "<p>Lee una temperatura en grados Celsius. Calcula:</p><ul>" +
          "<li>F = C × 9/5 + 32</li><li>K = C + 273.15</li></ul>" +
          "<p>Imprime dos líneas con <b>un decimal</b>: primero Fahrenheit, después Kelvin.</p>" +
          "<p>Cuidado con <code>9/5</code>: entre enteros, en Java eso vale 1. Usa <code>9.0/5</code> o multiplica primero.</p>",
        lenguaje: "java",
        plantilla: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        // imprime Fahrenheit y Kelvin\n    }\n}\n",
        pruebas: [
          { entrada: "100", salida: "212.0\n373.2" },
          { entrada: "0", salida: "32.0\n273.2" },
          { entrada: "-40", salida: "-40.0\n233.1", oculta: true }
        ],
        solucion: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        System.out.printf(\"%.1f%n\", c * 9 / 5 + 32);\n        System.out.printf(\"%.1f%n\", c + 273.15);\n    }\n}",
        exito: "Conversión correcta, incluido el -40, donde las dos escalas coinciden."
      },
      {
        id: "m2", tipo: "salida", titulo: "Compílalo en tu máquina",
        guia: "<p>Guárdalo como <code>Main.java</code>, compílalo y ejecútalo.</p>" +
          "<p>Java separa compilar de ejecutar: <code>javac</code> produce un <code>.class</code> y <code>java</code> lo ejecuta. Entender esa separación es media entrevista de Java.</p>",
        comando: "javac Main.java && echo 100 | java Main",
        patrones: ["212[.,]0", "373[.,]2"],
        pista: "Si tu sistema está en español, puede imprimir 212,0 con coma. Es correcto: es el formato local.",
        exito: "Compilado y ejecutado en tu equipo."
      }
    ]
  },
  {
    id: "jv-p2", titulo: "Notas de una clase", nivel: "Intermedio", desdeUnidad: 5, tiempo: "40 min",
    resumen: "Lee pares de nombre y nota hasta el final, y saca la media y quién va primero.",
    objetivos: ["Leer entrada de longitud desconocida", "Acumular y comparar", "Formatear con decimales"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Media y mejor nota",
        guia: "<p>Lee líneas con <code>nombre nota</code> hasta que se acabe la entrada.</p>" +
          "<p>Imprime:</p><pre class=\"dg-pre\">media=7.92\nmejor=marta</pre>" +
          "<p>La media con dos decimales. Si hay empate en la nota más alta, gana quien apareció primero.</p>",
        lenguaje: "java",
        plantilla: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // lee nombre y nota mientras haya líneas\n    }\n}\n",
        pruebas: [
          { entrada: "ana 8\nluis 6.5\nmarta 9.25", salida: "media=7.92\nmejor=marta" },
          { entrada: "pablo 10", salida: "media=10.00\nmejor=pablo" },
          { entrada: "a 5\nb 5", salida: "media=5.00\nmejor=a", oculta: true }
        ],
        solucion: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double suma = 0, mejorNota = -1;\n        int n = 0;\n        String mejor = \"\";\n        while (sc.hasNext()) {\n            String nombre = sc.next();\n            double nota = sc.nextDouble();\n            suma += nota; n++;\n            if (nota > mejorNota) { mejorNota = nota; mejor = nombre; }\n        }\n        System.out.printf(\"media=%.2f%n\", suma / n);\n        System.out.println(\"mejor=\" + mejor);\n    }\n}",
        exito: "Correcto, con el empate resuelto por orden de llegada."
      },
      {
        id: "m2", tipo: "check", titulo: "Hazlo con objetos",
        guia: "<p>Reescríbelo en tu IDE con un <code>record Alumno(String nombre, double nota)</code> y streams:</p>" +
          "<pre class=\"dg-pre\">alumnos.stream().mapToDouble(Alumno::nota).average()</pre>" +
          "<p>Compara las dos versiones: la de bucles es más rápida de escribir, la de streams se lee mejor cuando el proceso crece.</p>",
        criterios: [
          "Tengo la versión con record y streams funcionando",
          "Sé qué devuelve average() y por qué es un OptionalDouble",
          "Sé cuándo un stream se lee mejor que un bucle y cuándo no"
        ]
      }
    ]
  },
  {
    id: "jv-p3", titulo: "Inventario con colecciones y excepciones", nivel: "Avanzado", desdeUnidad: 9, tiempo: "55 min",
    resumen: "Un inventario que procesa órdenes, no acepta estados imposibles y avisa cuando algo va mal.",
    objetivos: ["Elegir la colección adecuada", "Usar excepciones con criterio", "Mantener invariantes"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Entradas, salidas y stock",
        guia: "<p>Procesa órdenes línea a línea:</p><ul>" +
          "<li><code>in producto cantidad</code> suma stock</li>" +
          "<li><code>out producto cantidad</code> resta, pero <b>nunca por debajo de cero</b>: si no hay bastante, imprime <code>ERROR producto</code> y no toca el stock</li>" +
          "<li><code>report</code> imprime <code>producto:cantidad</code> ordenado alfabéticamente</li></ul>" +
          "<p>Un <code>TreeMap</code> te da el orden gratis.</p>",
        lenguaje: "java",
        plantilla: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Map<String, Integer> stock = new TreeMap<>();\n        // procesa in / out / report\n    }\n}\n",
        pruebas: [
          { entrada: "in pan 5\nin leche 2\nout pan 3\nreport", salida: "leche:2\npan:2" },
          { entrada: "in pan 1\nout pan 5\nreport", salida: "ERROR pan\npan:1" },
          { entrada: "in b 1\nin a 1\nreport", salida: "a:1\nb:1", oculta: true }
        ],
        solucion: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Map<String, Integer> stock = new TreeMap<>();\n        while (sc.hasNext()) {\n            String op = sc.next();\n            if (op.equals(\"report\")) {\n                for (Map.Entry<String, Integer> e : stock.entrySet()) System.out.println(e.getKey() + \":\" + e.getValue());\n                continue;\n            }\n            String prod = sc.next();\n            int cant = sc.nextInt();\n            int actual = stock.getOrDefault(prod, 0);\n            if (op.equals(\"in\")) stock.put(prod, actual + cant);\n            else if (op.equals(\"out\")) {\n                if (cant > actual) System.out.println(\"ERROR \" + prod);\n                else stock.put(prod, actual - cant);\n            }\n        }\n    }\n}",
        exito: "Invariante respetada: el stock nunca queda negativo."
      },
      {
        id: "m2", tipo: "check", titulo: "Excepciones con criterio",
        guia: "<p>En una aplicación real, ese <code>ERROR</code> sería una excepción propia: <code>StockInsuficienteException</code>, con el producto y la cantidad que faltaba.</p>" +
          "<p>Regla práctica: excepción para lo excepcional, valor de retorno para lo que pasa a menudo. Y nunca un <code>catch</code> vacío: eso es esconder el fallo, no tratarlo.</p>",
        criterios: [
          "Tengo una excepción propia con la información útil dentro",
          "No hay ningún catch vacío en mi código",
          "Sé la diferencia entre excepción comprobada y no comprobada en Java"
        ]
      }
    ]
  }
],

/* ---------------- SQL ---------------- */
sql: [
{
    id: "sq-p1", titulo: "Consulta una tabla de pedidos", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "30 min",
    resumen: "Agrupa, suma y ordena: las tres cosas que hace el 80% de las consultas de tu vida.",
    objetivos: ["Agrupar con GROUP BY", "Agregar con SUM", "Ordenar el resultado"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Gasto por cliente",
        guia: "<p>La plantilla ya crea la tabla y mete filas: <b>no la borres</b>, añade tu consulta al final.</p>" +
          "<p>Saca el total gastado por cada cliente, de mayor a menor.</p>" +
          "<p>La regla de oro del GROUP BY: en el SELECT solo puede aparecer lo que agrupas o funciones de agregación. Lo demás es ambiguo.</p>",
        lenguaje: "sql",
        plantilla: "CREATE TABLE pedidos (cliente TEXT, importe REAL);\nINSERT INTO pedidos VALUES ('ana', 30), ('luis', 12.5), ('ana', 20), ('marta', 99);\n\n-- escribe aquí tu consulta\n",
        pruebas: [{ salida: "marta|99.0\nana|50.0\nluis|12.5" }],
        solucion: "CREATE TABLE pedidos (cliente TEXT, importe REAL);\nINSERT INTO pedidos VALUES ('ana', 30), ('luis', 12.5), ('ana', 20), ('marta', 99);\n\nSELECT cliente, SUM(importe) FROM pedidos GROUP BY cliente ORDER BY SUM(importe) DESC;",
        exito: "Agrupado y ordenado. Fíjate en que ana suma sus dos pedidos en una sola fila."
      },
      {
        id: "m2", tipo: "codigo", titulo: "Solo los que gastan de verdad",
        guia: "<p>Ahora filtra: solo los clientes que hayan gastado <b>más de 40</b> en total.</p>" +
          "<p>Aquí está la trampa clásica: <code>WHERE</code> filtra <b>filas antes</b> de agrupar; <code>HAVING</code> filtra <b>grupos después</b>. Para esto necesitas HAVING.</p>",
        lenguaje: "sql",
        plantilla: "CREATE TABLE pedidos (cliente TEXT, importe REAL);\nINSERT INTO pedidos VALUES ('ana', 30), ('luis', 12.5), ('ana', 20), ('marta', 99);\n\n-- clientes con más de 40 en total, de mayor a menor\n",
        pruebas: [{ salida: "marta|99.0\nana|50.0" }],
        solucion: "CREATE TABLE pedidos (cliente TEXT, importe REAL);\nINSERT INTO pedidos VALUES ('ana', 30), ('luis', 12.5), ('ana', 20), ('marta', 99);\n\nSELECT cliente, SUM(importe) FROM pedidos GROUP BY cliente HAVING SUM(importe) > 40 ORDER BY SUM(importe) DESC;",
        exito: "HAVING en su sitio. Esta pregunta cae en casi todas las entrevistas de SQL."
      }
    ]
  },
  {
    id: "sq-p2", titulo: "Unir tablas sin perder filas", nivel: "Intermedio", desdeUnidad: 6, tiempo: "40 min",
    resumen: "El JOIN, y la diferencia entre INNER y LEFT que hace que falten filas en los informes.",
    objetivos: ["Unir tablas relacionadas", "Distinguir INNER de LEFT", "Contar sin perder a nadie"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Cliente y sus pedidos",
        guia: "<p>Une clientes con pedidos y saca el nombre y el importe de cada pedido, ordenado por nombre y luego por importe.</p>" +
          "<p>La unión se hace por la clave: <code>ON p.cliente_id = c.id</code>.</p>",
        lenguaje: "sql",
        plantilla: "CREATE TABLE clientes (id INTEGER, nombre TEXT);\nCREATE TABLE pedidos (cliente_id INTEGER, importe REAL);\nINSERT INTO clientes VALUES (1, 'ana'), (2, 'luis'), (3, 'marta');\nINSERT INTO pedidos VALUES (1, 30), (1, 20), (2, 12.5);\n\n-- nombre e importe de cada pedido\n",
        pruebas: [{ salida: "ana|20.0\nana|30.0\nluis|12.5" }],
        solucion: "CREATE TABLE clientes (id INTEGER, nombre TEXT);\nCREATE TABLE pedidos (cliente_id INTEGER, importe REAL);\nINSERT INTO clientes VALUES (1, 'ana'), (2, 'luis'), (3, 'marta');\nINSERT INTO pedidos VALUES (1, 30), (1, 20), (2, 12.5);\n\nSELECT c.nombre, p.importe FROM clientes c INNER JOIN pedidos p ON p.cliente_id = c.id ORDER BY c.nombre, p.importe;",
        exito: "Unión correcta. Fíjate: marta no aparece, porque no tiene pedidos."
      },
      {
        id: "m2", tipo: "codigo", titulo: "Que no falte nadie",
        guia: "<p>Ahora el informe que de verdad te piden: <b>todos</b> los clientes con su número de pedidos, incluidos los que no tienen ninguno (con 0).</p>" +
          "<p>Necesitas <code>LEFT JOIN</code> y <code>COUNT</code> de una columna de la tabla derecha (no <code>COUNT(*)</code>, que contaría la fila vacía como 1).</p>" +
          "<p>Ese detalle es el que convierte «marta: 1 pedido» en un informe incorrecto.</p>",
        lenguaje: "sql",
        plantilla: "CREATE TABLE clientes (id INTEGER, nombre TEXT);\nCREATE TABLE pedidos (cliente_id INTEGER, importe REAL);\nINSERT INTO clientes VALUES (1, 'ana'), (2, 'luis'), (3, 'marta');\nINSERT INTO pedidos VALUES (1, 30), (1, 20), (2, 12.5);\n\n-- todos los clientes y su número de pedidos, ordenado por nombre\n",
        pruebas: [{ salida: "ana|2\nluis|1\nmarta|0" }],
        solucion: "CREATE TABLE clientes (id INTEGER, nombre TEXT);\nCREATE TABLE pedidos (cliente_id INTEGER, importe REAL);\nINSERT INTO clientes VALUES (1, 'ana'), (2, 'luis'), (3, 'marta');\nINSERT INTO pedidos VALUES (1, 30), (1, 20), (2, 12.5);\n\nSELECT c.nombre, COUNT(p.cliente_id) FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id GROUP BY c.id, c.nombre ORDER BY c.nombre;",
        exito: "Marta aparece con 0. Ese es el informe que querían."
      },
      {
        id: "m3", tipo: "check", titulo: "El JOIN que multiplica",
        guia: "<p>Si olvidas la condición <code>ON</code>, SQL hace un producto cartesiano: 1.000 clientes × 10.000 pedidos = diez millones de filas.</p>" +
          "<p>Ese es el origen de la mitad de las consultas que «se quedan colgadas».</p>",
        criterios: [
          "Sé qué es un producto cartesiano y cómo se provoca sin querer",
          "Sé por qué COUNT(*) y COUNT(columna) dan distinto con LEFT JOIN",
          "Sé cuándo necesito INNER y cuándo LEFT"
        ]
      }
    ]
  },
  {
    id: "sq-p3", titulo: "Índices: de segundos a milisegundos", nivel: "Avanzado", desdeUnidad: 10, tiempo: "50 min",
    resumen: "Mide una consulta lenta, entiende el plan de ejecución y arréglala con el índice correcto.",
    objetivos: ["Leer un plan de ejecución", "Crear el índice adecuado", "Saber qué cuesta un índice"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Mide antes de tocar",
        guia: "<p>En una tabla tuya con datos (o genera 100.000 filas), lanza una consulta que filtre por una columna sin índice y mide el tiempo.</p>" +
          "<p>Sin el número de antes no puedes demostrar la mejora, y «va más rápido» no es un dato.</p>",
        comando: "(pega el tiempo de la consulta antes del índice)",
        patrones: ["[0-9]+([.,][0-9]+)? *(ms|s|seg)"],
        exito: "Punto de partida medido."
      },
      {
        id: "m2", tipo: "salida", titulo: "Lee el plan",
        guia: "<p>Pide el plan: <code>EXPLAIN QUERY PLAN</code> en SQLite, <code>EXPLAIN ANALYZE</code> en PostgreSQL.</p>" +
          "<p>Busca <b>SCAN</b> o <b>Seq Scan</b>: significa que está leyendo la tabla entera, fila por fila.</p>",
        comando: "(pega el plan de ejecución)",
        patrones: ["(SCAN|Seq Scan|TABLE ACCESS|SEARCH)"],
        exito: "Ahí tienes la prueba: recorrido completo de la tabla."
      },
      {
        id: "m3", tipo: "salida", titulo: "El índice, y la diferencia",
        guia: "<p>Crea el índice sobre la columna del filtro, repite la consulta y vuelve a mirar el plan.</p>" +
          "<p>Debería pasar de <code>SCAN</code> a <code>SEARCH … USING INDEX</code> (o <code>Index Scan</code>), y el tiempo caer en picado.</p>",
        comando: "(pega el plan y el tiempo después del índice)",
        patrones: ["(USING INDEX|Index Scan|SEARCH)", "[0-9]+([.,][0-9]+)? *(ms|s|seg)"],
        prohibidos: ["Seq Scan"],
        exito: "De recorrer la tabla a saltar directo. Esa es la diferencia entre 2 segundos y 2 milisegundos."
      },
      {
        id: "m4", tipo: "check", titulo: "Lo que cuesta un índice",
        guia: "<p>Un índice no es gratis: ocupa espacio y hay que actualizarlo en cada INSERT, UPDATE y DELETE.</p>" +
          "<p>Por eso no se indexa todo: se indexa lo que se consulta mucho.</p>",
        criterios: [
          "Sé por qué un índice ralentiza las escrituras",
          "Sé qué es un índice compuesto y por qué importa el orden de las columnas",
          "Sé por qué un índice sobre una columna con pocos valores distintos sirve de poco"
        ]
      }
    ]
  }
],

/* ---------------- Linux ---------------- */
linux: [
{
    id: "lx-p1", titulo: "Informe de una carpeta", nivel: "Fundamentos", desdeUnidad: 4, tiempo: "35 min",
    resumen: "Cuenta ficheros por extensión encadenando comandos. La filosofía de Unix en una línea.",
    objetivos: ["Encadenar comandos con tuberías", "Transformar texto", "Contar y ordenar"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "La idea de la tubería",
        guia: "<p>Unix no tiene un comando para «contar ficheros por extensión». Tiene comandos pequeños que se encadenan:</p>" +
          "<pre class=\"dg-pre\">quitar el nombre  →  ordenar  →  contar repetidos  →  dar formato</pre>" +
          "<p>Cada uno hace una cosa y pasa el resultado al siguiente. Esa es toda la filosofía, y por eso sigue viva 50 años después.</p>" +
          "<p>Ojo con <code>uniq -c</code>: solo cuenta repeticiones <b>consecutivas</b>. Por eso hay que ordenar antes.</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "Cuenta por extensión",
        guia: "<p>Los nombres llegan por la entrada estándar. Imprime <code>extension numero</code>, ordenado alfabéticamente por extensión:</p>" +
          "<pre class=\"dg-pre\">md 1\ntxt 2</pre>",
        lenguaje: "sh",
        plantilla: "# los nombres llegan por la entrada estándar\n",
        pruebas: [
          { entrada: "a.txt\nb.txt\nc.md", salida: "md 1\ntxt 2" },
          { entrada: "solo.sh", salida: "sh 1" },
          { entrada: "x.py\ny.py\nz.py", salida: "py 3", oculta: true }
        ],
        solucion: "sed 's/.*\\.//' | sort | uniq -c | awk '{print $2, $1}'",
        exito: "Cuatro comandos encadenados y el trabajo hecho, sin escribir un bucle."
      },
      {
        id: "m3", tipo: "salida", titulo: "Úsalo en una carpeta de verdad",
        guia: "<p>Aplícalo a tus ficheros reales.</p>",
        comando: "ls | grep '\\.' | sed 's/.*\\.//' | sort | uniq -c | sort -rn | head -5",
        patrones: ["[0-9]+ +[a-z0-9]+"],
        exito: "Ya sabes de qué está hecha tu carpeta."
      }
    ]
  },
  {
    id: "lx-p2", titulo: "Script con argumentos y errores", nivel: "Intermedio", desdeUnidad: 7, tiempo: "45 min",
    resumen: "Un script que se comporta: valida lo que recibe, falla pronto y devuelve códigos correctos.",
    objetivos: ["Leer argumentos", "Fallar pronto y claro", "Devolver códigos de salida útiles"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Valida y responde",
        guia: "<p>Escribe un script que reciba un número por la entrada estándar y diga si es par o impar.</p>" +
          "<p>Si no es un número, imprime <code>ERROR</code>. Salida esperada: <code>par</code>, <code>impar</code> o <code>ERROR</code>.</p>",
        lenguaje: "sh",
        plantilla: "read n\n# imprime par, impar o ERROR\n",
        pruebas: [
          { entrada: "4", salida: "par" },
          { entrada: "7", salida: "impar" },
          { entrada: "hola", salida: "ERROR" },
          { entrada: "0", salida: "par", oculta: true },
          { entrada: "-3", salida: "impar", oculta: true }
        ],
        solucion: "read n\ncase \"$n\" in\n  ''|*[!0-9-]*|-) echo ERROR ;;\n  *) if [ $((n % 2)) -eq 0 ]; then echo par; else echo impar; fi ;;\nesac",
        exito: "Valida la entrada antes de calcular, incluidos el cero y los negativos."
      },
      {
        id: "m2", tipo: "salida", titulo: "Las tres líneas que van arriba",
        guia: "<p>En tu máquina, escribe un script de verdad que empiece así:</p>" +
          "<pre class=\"dg-pre\">#!/usr/bin/env bash\nset -euo pipefail</pre>" +
          "<p>Eso es: parar al primer error (<code>-e</code>), fallar si usas una variable no definida (<code>-u</code>) y no tragarse el error de una tubería (<code>-o pipefail</code>).</p>" +
          "<p>Sin esto, un script sigue adelante después de fallar, y acaba borrando lo que no debía.</p>",
        comando: "head -3 mi-script.sh",
        patrones: ["#!/usr/bin/env bash|#!/bin/bash", "set -e"],
        exito: "Script que se para cuando algo va mal, en vez de seguir a ciegas."
      },
      {
        id: "m3", tipo: "salida", titulo: "Códigos de salida",
        guia: "<p>Haz que tu script devuelva <code>0</code> si todo fue bien y <code>1</code> (u otro) si falló. Compruébalo con <code>echo $?</code>.</p>" +
          "<p>Esto es lo que mira todo lo demás: el <code>&amp;&amp;</code>, un cron, un pipeline de CI. Un script que siempre devuelve 0 es un script que nunca falla… aunque falle.</p>",
        comando: "./mi-script.sh argumento-malo; echo \"codigo=$?\"",
        patrones: ["codigo=[1-9]"],
        exito: "Códigos de salida honestos."
      },
      {
        id: "m4", tipo: "check", titulo: "Pásale shellcheck",
        guia: "<p><code>shellcheck</code> es el corrector ortográfico de bash: encuentra las comillas que faltan y las expansiones peligrosas.</p>",
        criterios: [
          "shellcheck no da avisos importantes",
          "Todas las variables van entre comillas dobles",
          "Sé por qué rm -rf $VAR sin comillas es peligroso"
        ]
      }
    ]
  },
  {
    id: "lx-p3", titulo: "Diagnostica una máquina lenta", nivel: "Avanzado", desdeUnidad: 9, tiempo: "50 min",
    resumen: "El método de los sospechosos habituales: CPU, memoria, disco y red, en ese orden.",
    objetivos: ["Leer la carga del sistema", "Saber si falta memoria de verdad", "Encontrar quién ocupa el disco"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Carga y CPU",
        guia: "<p>Mira la carga media. La clave: compárala con el <b>número de núcleos</b>. Una carga de 4 en una máquina de 8 núcleos está bien; en una de 2, está ahogada.</p>",
        comando: "uptime && nproc",
        patrones: ["load average|carga", "[0-9]+"],
        exito: "Carga en contexto, que es la única forma de interpretarla."
      },
      {
        id: "m2", tipo: "salida", titulo: "Memoria: la trampa del «disponible»",
        guia: "<p><code>free -h</code> asusta a todo el mundo: parece que no queda memoria. Pero Linux usa la libre como caché de disco, y la suelta en cuanto haga falta.</p>" +
          "<p>La columna que importa es <b>available</b>, no «free». Y si <code>swap</code> está usándose mucho, ahí sí hay un problema.</p>",
        comando: "free -h",
        patrones: ["(available|disponible)", "(Mem|Memoria)"],
        exito: "Ya sabes mirar la columna correcta."
      },
      {
        id: "m3", tipo: "salida", titulo: "Quién se come el disco",
        guia: "<p>Primero cuánto queda (<code>df -h</code>), y después quién lo ocupa (<code>du</code> por carpetas).</p>" +
          "<p>Aviso: un disco al 100% rompe cosas de formas rarísimas, porque los programas no pueden ni escribir sus logs. Si algo falla «sin motivo», mira el disco pronto.</p>",
        comando: "df -h / && du -sh /var/log 2>/dev/null",
        patrones: ["[0-9]+%", "[0-9]+([.,][0-9]+)?[KMGT]"],
        exito: "Espacio controlado."
      },
      {
        id: "m4", tipo: "salida", titulo: "Quién consume ahora mismo",
        guia: "<p>Los cinco procesos que más CPU están usando, con su PID.</p>",
        comando: "ps aux --sort=-%cpu | head -6",
        patrones: ["(PID|%CPU)", "[0-9]+"],
        exito: "Culpable identificado, o al menos el primer sospechoso."
      },
      {
        id: "m5", tipo: "check", titulo: "Tu método",
        guia: "<p>Escribe tu checklist de diagnóstico en cuatro pasos, en el orden en que los harías.</p>",
        criterios: [
          "Tengo escrito mi orden de comprobación",
          "Sé por qué la carga media hay que compararla con los núcleos",
          "Sé por qué «poca memoria libre» no significa falta de memoria"
        ]
      }
    ]
  }
],


/* ---------------- Algoritmos ---------------- */
algoritmos: [
{
    id: "al-p1", titulo: "Buscar rápido: de recorrer a partir por la mitad", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "40 min",
    resumen: "Implementa la búsqueda lineal y la binaria, y comprueba con números por qué una escala y la otra no.",
    objetivos: ["Implementar búsqueda binaria", "Entender el coste logarítmico", "Cuidar los límites del bucle"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Por qué importa",
        guia: "<p>Buscar recorriendo un millón de elementos son un millón de comparaciones. Buscar partiendo por la mitad son <b>veinte</b>.</p>" +
          "<p>La condición: la lista tiene que estar <b>ordenada</b>. Ese es el precio.</p>" +
          "<p>Y el detalle que casi todo el mundo falla la primera vez: los límites. Un <code>&lt;</code> donde va un <code>&lt;=</code> y tu búsqueda se cuelga o se salta el último elemento.</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "Búsqueda binaria",
        guia: "<p>Primera línea: los números ordenados separados por espacios. Segunda línea: el número a buscar.</p>" +
          "<p>Imprime <code>pos=N</code> con la posición empezando en 0, o <code>pos=-1</code> si no está.</p>",
        lenguaje: "py",
        plantilla: "nums = [int(x) for x in input().split()]\nobjetivo = int(input())\n# imprime pos=\n",
        pruebas: [
          { entrada: "1 3 5 7 9 11\n7", salida: "pos=3" },
          { entrada: "1 3 5 7 9 11\n1", salida: "pos=0" },
          { entrada: "1 3 5 7 9 11\n11", salida: "pos=5", oculta: true },
          { entrada: "1 3 5 7 9 11\n4", salida: "pos=-1", oculta: true },
          { entrada: "5\n5", salida: "pos=0", oculta: true }
        ],
        solucion: "nums = [int(x) for x in input().split()]\nobjetivo = int(input())\nizq, der = 0, len(nums) - 1\npos = -1\nwhile izq <= der:\n    medio = (izq + der) // 2\n    if nums[medio] == objetivo:\n        pos = medio\n        break\n    if nums[medio] < objetivo:\n        izq = medio + 1\n    else:\n        der = medio - 1\nprint(f\"pos={pos}\")",
        exito: "Correcta en los bordes: el primero, el último, el que no está y la lista de un solo elemento."
      },
      {
        id: "m3", tipo: "codigo", titulo: "Cuenta las comparaciones",
        guia: "<p>Ahora demuéstralo con números. Lee el tamaño de la lista e imprime <code>comparaciones=N</code>: cuántas veces partirías por la mitad en el peor caso.</p>" +
          "<p>Es el logaritmo en base 2, redondeado hacia arriba… más uno. Piensa: con 1 elemento, 1 comparación; con 2, dos.</p>",
        lenguaje: "py",
        plantilla: "n = int(input())\n# imprime comparaciones= (peor caso de la búsqueda binaria)\n",
        pruebas: [
          { entrada: "1", salida: "comparaciones=1" },
          { entrada: "8", salida: "comparaciones=4" },
          { entrada: "1000000", salida: "comparaciones=20" },
          { entrada: "16", salida: "comparaciones=5", oculta: true }
        ],
        solucion: "import math\nn = int(input())\nprint(f\"comparaciones={math.floor(math.log2(n)) + 1}\")",
        exito: "Un millón de elementos, veinte comparaciones. Ahí está la diferencia entre O(n) y O(log n), en números."
      }
    ]
  },
  {
    id: "al-p2", titulo: "La estructura correcta cambia todo", nivel: "Intermedio", desdeUnidad: 5, tiempo: "45 min",
    resumen: "El mismo problema con lista y con conjunto: mismo resultado, coste completamente distinto.",
    objetivos: ["Elegir estructura de datos", "Entender el coste de buscar", "Usar diccionarios para contar"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "El primer repetido",
        guia: "<p>Dada una lista de números, imprime <code>primero=N</code> con el primer valor que se repite, o <code>primero=-1</code> si no hay ninguno.</p>" +
          "<p>Se puede hacer con dos bucles (coste n²) o guardando lo visto en un conjunto (coste n). Haz la segunda: con 100.000 números, la primera tarda minutos.</p>",
        lenguaje: "py",
        plantilla: "nums = [int(x) for x in input().split()]\n# imprime primero=\n",
        pruebas: [
          { entrada: "2 1 3 5 3 2", salida: "primero=3" },
          { entrada: "1 2 3", salida: "primero=-1" },
          { entrada: "7 7", salida: "primero=7", oculta: true },
          { entrada: "1 2 1 2", salida: "primero=1", oculta: true }
        ],
        solucion: "nums = [int(x) for x in input().split()]\nvistos = set()\nres = -1\nfor n in nums:\n    if n in vistos:\n        res = n\n        break\n    vistos.add(n)\nprint(f\"primero={res}\")",
        exito: "Una pasada y listo. Buscar en un conjunto es prácticamente instantáneo; en una lista, hay que recorrerla."
      },
      {
        id: "m2", tipo: "codigo", titulo: "Los tres más frecuentes",
        guia: "<p>Lee palabras separadas por espacios e imprime las tres más repetidas, una por línea, como <code>palabra:veces</code>.</p>" +
          "<p>Orden: por número de repeticiones de mayor a menor; en caso de empate, alfabético.</p>" +
          "<p>Ese desempate es lo que convierte un ejercicio fácil en uno que hay que pensar.</p>",
        lenguaje: "py",
        plantilla: "palabras = input().split()\n# imprime las tres más frecuentes como palabra:veces\n",
        pruebas: [
          { entrada: "a b a c b a c c d", salida: "a:3\nc:3\nb:2" },
          { entrada: "sol luna sol", salida: "sol:2\nluna:1" },
          { entrada: "x y z", salida: "x:1\ny:1\nz:1", oculta: true }
        ],
        solucion: "from collections import Counter\npalabras = input().split()\nc = Counter(palabras)\nordenadas = sorted(c.items(), key=lambda p: (-p[1], p[0]))\nfor palabra, veces in ordenadas[:3]:\n    print(f\"{palabra}:{veces}\")",
        exito: "Ordenación por dos criterios a la vez, que es el truco de la clave con tupla."
      },
      {
        id: "m3", tipo: "check", titulo: "Ponle números a la diferencia",
        guia: "<p>En tu máquina, genera 100.000 números y resuelve el primer ejercicio de las dos formas, midiendo el tiempo.</p>",
        criterios: [
          "He medido las dos versiones y la diferencia es abismal",
          "Sé por qué buscar en un set es O(1) de media",
          "Sé qué coste tiene ordenar y por qué es n log n"
        ]
      }
    ]
  },
  {
    id: "al-p3", titulo: "Recursión y memoria", nivel: "Avanzado", desdeUnidad: 8, tiempo: "55 min",
    resumen: "El caso donde recordar resultados convierte lo imposible en instantáneo.",
    objetivos: ["Escribir una función recursiva", "Reconocer el trabajo repetido", "Aplicar memoización"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Fibonacci que no tarda una eternidad",
        guia: "<p>Imprime el número de Fibonacci N.</p>" +
          "<p>La versión recursiva sin más recalcula lo mismo millones de veces: para N=50 no termina nunca. Guarda los resultados ya calculados (un diccionario, o <code>functools.lru_cache</code>).</p>",
        lenguaje: "py",
        plantilla: "n = int(input())\n# imprime fib(n)\n",
        pruebas: [
          { entrada: "10", salida: "55" },
          { entrada: "1", salida: "1" },
          { entrada: "50", salida: "12586269025" },
          { entrada: "0", salida: "0", oculta: true },
          { entrada: "90", salida: "2880067194370816120", oculta: true }
        ],
        solucion: "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(k):\n    return k if k < 2 else fib(k - 1) + fib(k - 2)\n\nn = int(input())\nprint(fib(n))",
        exito: "N=90 al instante. Sin memoización, esa llamada tardaría más que tu vida."
      },
      {
        id: "m2", tipo: "codigo", titulo: "Cuántas formas de subir la escalera",
        guia: "<p>Una escalera de N escalones que se suben de 1 o de 2 en 2: ¿de cuántas formas se puede subir?</p>" +
          "<p>Imprime <code>formas=N</code>. Pista: para llegar al escalón N vienes del N-1 o del N-2… lo cual es Fibonacci disfrazado.</p>" +
          "<p>Reconocer un problema conocido bajo otro enunciado es la mitad del trabajo de un algoritmo.</p>",
        lenguaje: "py",
        plantilla: "n = int(input())\n# imprime formas=\n",
        pruebas: [
          { entrada: "1", salida: "formas=1" },
          { entrada: "2", salida: "formas=2" },
          { entrada: "5", salida: "formas=8" },
          { entrada: "10", salida: "formas=89", oculta: true }
        ],
        solucion: "n = int(input())\na, b = 1, 1\nfor _ in range(n - 1):\n    a, b = b, a + b\nprint(f\"formas={b}\")",
        exito: "Resuelto, y además con la versión iterativa: sin recursión y con memoria constante."
      },
      {
        id: "m3", tipo: "check", titulo: "Cuándo recursión y cuándo no",
        guia: "<p>La recursión es elegante para árboles y divide y vencerás. Para recorridos lineales largos, el riesgo es quedarte sin pila.</p>",
        criterios: [
          "Sé qué es un desbordamiento de pila y cuándo pasa",
          "Sé convertir esta recursión en bucle",
          "Sé reconocer el trabajo repetido que justifica memoizar"
        ]
      }
    ]
  }
],


/* ---------------- Go ---------------- */
go: [
{
    id: "go-p1", titulo: "Tu primer programa y sus pruebas", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "40 min",
    resumen: "Un módulo de Go con una función, sus pruebas y el formateo automático. Todo con la herramienta estándar.",
    objetivos: ["Crear un módulo", "Escribir pruebas con la biblioteca estándar", "Usar gofmt y go vet"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "Crea el módulo",
        guia: "<p>Go organiza el código en módulos. Crea el tuyo en una carpeta nueva con el nombre <code>ejemplo/saludo</code>.</p>",
        pista: "Es «go mod» seguido de «init» y el nombre del módulo.",
        sol: ["go mod init ejemplo/saludo"],
        salida: "go: creating new go.mod: module ejemplo/saludo",
        exito: "Módulo creado. Ese go.mod es el equivalente al package.json o al pom.xml."
      },
      {
        id: "m2", tipo: "salida", titulo: "La función y su prueba",
        guia: "<p>Escribe <code>Saludo(nombre string) string</code> que devuelva <code>Hola, X</code>, y su prueba en <code>saludo_test.go</code>.</p>" +
          "<p>En Go las pruebas van <b>al lado del código</b>, con la biblioteca estándar: sin frameworks ni dependencias. Ejecuta y pega la salida.</p>",
        comando: "go test ./...",
        patrones: ["(ok|PASS)"],
        prohibidos: ["(FAIL|--- FAIL)"],
        pista: "La función de prueba se llama TestSaludo(t *testing.T) y el fichero tiene que acabar en _test.go.",
        exito: "Pruebas en verde con cero dependencias."
      },
      {
        id: "m3", tipo: "salida", titulo: "Formato y sospechas",
        guia: "<p>Dos comandos que deberías ejecutar siempre:</p><ul>" +
          "<li><code>gofmt -l .</code> lista los ficheros mal formateados. En Go no se discute el estilo: hay uno y lo aplica la herramienta.</li>" +
          "<li><code>go vet ./...</code> busca errores sospechosos que compilan igualmente.</li></ul>" +
          "<p>Pega la salida de los dos: <code>gofmt -l</code> debe salir vacío.</p>",
        comando: "gofmt -l . ; go vet ./... && echo VET-OK",
        patrones: ["VET-OK"],
        prohibidos: ["[.]go"],
        exito: "Formateado y sin sospechas. Esto se pone en el CI el primer día."
      }
    ]
  },
  {
    id: "go-p2", titulo: "Concurrencia sin miedo", nivel: "Avanzado", desdeUnidad: 8, tiempo: "50 min",
    resumen: "Goroutines, canales y el detector de carreras: la razón por la que mucha gente viene a Go.",
    objetivos: ["Lanzar goroutines", "Comunicar con canales", "Detectar condiciones de carrera"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Trabajo en paralelo",
        guia: "<p>Lanza varias goroutines que procesen elementos y devuelvan el resultado por un canal. Coordina el final con <code>sync.WaitGroup</code>.</p>" +
          "<p>El lema de Go: <i>no comuniques compartiendo memoria; comparte memoria comunicando</i>. Es decir: pásate los datos por canales en vez de tocar la misma variable.</p>",
        comando: "go run .",
        patrones: ["."],
        pista: "Acuérdate de cerrar el canal cuando termines de escribir, o el for range sobre él se queda esperando para siempre.",
        exito: "Trabajo repartido y recogido por canal."
      },
      {
        id: "m2", tipo: "salida", titulo: "El detector de carreras",
        guia: "<p>Ahora a propósito: haz que dos goroutines incrementen la misma variable sin protección y ejecuta con <code>-race</code>.</p>" +
          "<p>Go trae detector de carreras de serie, y es de las mejores herramientas que existen para esto. Pega el aviso.</p>",
        comando: "go run -race .",
        patrones: ["(DATA RACE|WARNING)"],
        exito: "Ahí está la carrera, con las dos pilas que chocan. Sin -race, este fallo aparecería una vez cada mil ejecuciones… en producción."
      },
      {
        id: "m3", tipo: "salida", titulo: "Arréglalo",
        guia: "<p>Dos caminos: un <code>sync.Mutex</code> alrededor del acceso, o quitar la variable compartida y pasar los resultados por un canal.</p>" +
          "<p>Vuelve a ejecutar con <code>-race</code>: no debe quedar ni un aviso.</p>",
        comando: "go run -race . && echo SIN-CARRERAS",
        patrones: ["SIN-CARRERAS"],
        prohibidos: ["DATA RACE"],
        exito: "Concurrencia correcta y comprobada por una herramienta, no por confianza."
      },
      {
        id: "m4", tipo: "check", titulo: "Los clásicos",
        guia: "<p>Repasa los tropiezos habituales de concurrencia en Go.</p>",
        criterios: [
          "Sé qué pasa si escribo en un canal que nadie lee",
          "Sé por qué hay que cerrar el canal y quién debe hacerlo",
          "Sé para qué sirve un context con cancelación"
        ]
      }
    ]
  },
  {
    id: "go-p3", titulo: "Servicio HTTP listo para producción", nivel: "Experto", desdeUnidad: 11, tiempo: "1 h",
    resumen: "Un servicio pequeño con rutas, tiempos límite, apagado ordenado y su imagen mínima.",
    objetivos: ["Servir HTTP con la estándar", "Poner tiempos límite", "Apagar sin cortar peticiones"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El servicio responde",
        guia: "<p>Con <code>net/http</code>, monta un servicio con una ruta de salud y otra que devuelva JSON. Sin frameworks: la biblioteca estándar de Go llega de sobra.</p>",
        comando: "curl -s -i http://localhost:8080/salud | head -3",
        patrones: ["200"],
        prohibidos: ["000"],
        exito: "Servicio en marcha."
      },
      {
        id: "m2", tipo: "salida", titulo: "Tiempos límite",
        guia: "<p>No uses <code>http.ListenAndServe</code> a pelo: crea un <code>http.Server</code> con <code>ReadTimeout</code>, <code>WriteTimeout</code> e <code>IdleTimeout</code>.</p>" +
          "<p>Sin ellos, un cliente lento puede mantener conexiones abiertas indefinidamente hasta agotarte los recursos.</p>",
        comando: "grep -n -E 'Timeout' *.go",
        patrones: ["ReadTimeout", "WriteTimeout"],
        exito: "Con tiempos límite. Este es de los detalles que separan un ejemplo de un servicio."
      },
      {
        id: "m3", tipo: "salida", titulo: "Apagado ordenado",
        guia: "<p>Escucha <code>SIGTERM</code> y llama a <code>server.Shutdown(ctx)</code> con un contexto con plazo: deja de aceptar, termina lo que hay y sale.</p>",
        comando: "grep -n -A4 -E 'signal.Notify|Shutdown' *.go",
        patrones: ["Shutdown", "(signal|SIGTERM)"],
        exito: "Se apaga sin cortar peticiones a medias."
      },
      {
        id: "m4", tipo: "salida", titulo: "Una imagen de pocos megas",
        guia: "<p>Go compila a un binario estático, así que la imagen final puede ser <code>scratch</code> o <code>distroless</code>: solo tu binario, nada más.</p>" +
          "<p>Construye con multi-stage y enseña el tamaño.</p>",
        comando: "docker images mi-servicio --format \"{{.Repository}} {{.Size}}\"",
        patrones: ["[0-9]+([.,][0-9]+)? *MB"],
        pista: "CGO_ENABLED=0 go build -ldflags=\"-s -w\" y después FROM scratch con COPY --from=build.",
        exito: "Unos pocos megas frente a los cientos de otros lenguajes. Esa es una de las razones por las que Go domina en infraestructura."
      }
    ]
  },
{
    id: "go-p4", titulo: "Un inventario con tipos, interfaces y errores de verdad", nivel: "Intermedio", desdeUnidad: 5, tiempo: "1 h",
    resumen: "Modela un pequeño almacén con structs y métodos, sepáralo del almacenamiento con una interfaz y devuelve errores que quien llama pueda distinguir.",
    objetivos: ["Diseñar structs con métodos de receptor puntero", "Definir una interfaz pequeña en el consumidor", "Usar errores centinela, tipos de error y wrapping con %w"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "El módulo",
        guia: "<p>Crea una carpeta nueva y dentro el módulo <code>github.com/tu/inventario</code>. Todo el proyecto vive en un único paquete por ahora: ya lo dividirás cuando duela.</p>",
        pista: "go mod init y la ruta del módulo.",
        sol: ["go mod init github.com/tu/inventario"],
        salida: "go: creating new go.mod: module github.com/tu/inventario",
        exito: "Módulo creado."
      },
      {
        id: "m2", tipo: "salida", titulo: "Errores que se pueden distinguir",
        guia: "<p>Escribe un tipo <code>Almacen</code> con un método <code>Reservar(sku string, n int) error</code>. Declara dos centinelas, <code>ErrNoExiste</code> y <code>ErrSinStock</code>, y un tipo <code>*ErrCantidad</code> para cantidades no válidas.</p>" +
          "<p>Cada error que devuelvas hacia arriba debe llevar contexto con <code>fmt.Errorf(\"…: %w\", err)</code>. Enseña dónde los declaras y los envuelves.</p>",
        comando: "grep -n -E 'errors.New|%w|func \\(e \\*ErrCantidad\\) Error' *.go",
        patrones: ["ErrNoExiste", "ErrSinStock", "%w", "ErrCantidad\\) Error"],
        pista: "var ErrSinStock = errors.New(\"sin stock\") a nivel de paquete; func (e *ErrCantidad) Error() string { … }.",
        exito: "Errores con identidad y con contexto: quien llame podrá decidir qué hacer con cada uno."
      },
      {
        id: "m3", tipo: "salida", titulo: "La interfaz en el consumidor",
        guia: "<p>Crea un <code>Servicio</code> de pedidos que necesite «algo que reserve stock». Declara en su fichero una interfaz <code>Reservador</code> con <b>solo</b> el método que usa, y comprueba al compilar que <code>*Almacen</code> la cumple.</p>",
        comando: "grep -n -E 'type Reservador interface|var _ Reservador' *.go",
        patrones: ["type Reservador interface", "var _ Reservador = \\(\\*Almacen\\)\\(nil\\)"],
        pista: "var _ Reservador = (*Almacen)(nil) falla al compilar si Almacen deja de cumplirla.",
        exito: "Servicio y almacén ya no dependen uno del otro: en las pruebas podrás pasar un falso."
      },
      {
        id: "m4", tipo: "salida", titulo: "Pruebas por tablas con errors.Is y errors.As",
        guia: "<p>Escribe <code>TestReservar</code> con una tabla de casos: reserva correcta, SKU inexistente, sin stock y cantidad negativa. Comprueba el error esperado con <code>errors.Is</code> (centinelas) y <code>errors.As</code> (el tipo), nunca comparando textos.</p>",
        comando: "go test -v ./... 2>&1 | tail -8",
        patrones: ["--- PASS: TestReservar", "(ok|PASS)"],
        prohibidos: ["FAIL"],
        pista: "Un campo quiereErr error en la tabla y if !errors.Is(err, c.quiereErr) { t.Errorf(…) }.",
        exito: "Cuatro caminos probados, incluidos los de error, que son los que más fallan en producción."
      },
      {
        id: "m5", tipo: "check", titulo: "Revisión",
        guia: "<p>Repasa tu código con ojos de revisor.</p>",
        criterios: [
          "Ningún método que modifica el almacén tiene receptor por valor",
          "Ninguna función devuelve un puntero nil tipado como error",
          "Los mensajes de error van en minúscula y sin punto final",
          "go vet ./... no muestra nada"
        ]
      }
    ]
  },
  {
    id: "go-p5", titulo: "Tu primera librería genérica, publicada como módulo", nivel: "Intermedio", desdeUnidad: 6, tiempo: "1 h",
    resumen: "Una pequeña colección genérica con iteradores, documentada, probada y lista para que otros la importen con go get.",
    objetivos: ["Escribir tipos y funciones genéricas con restricciones", "Ofrecer iteradores con iter.Seq", "Publicar un módulo con versión semántica"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Un conjunto genérico",
        guia: "<p>Crea el paquete <code>conjunto</code> con <code>type Conjunto[T comparable] struct{…}</code> y los métodos <code>Añadir</code>, <code>Contiene</code>, <code>Len</code> y una función <code>Union[T comparable](a, b *Conjunto[T]) *Conjunto[T]</code>.</p>" +
          "<p>Recuerda: un método no puede declarar parámetros de tipo propios; lo que necesite otro tipo va como función.</p>",
        comando: "grep -n -E 'Conjunto\\[T comparable\\]|func Union\\[' *.go",
        patrones: ["Conjunto\\[T comparable\\]", "func Union\\["],
        exito: "Un contenedor que funciona con cualquier tipo comparable, comprobado por el compilador."
      },
      {
        id: "m2", tipo: "salida", titulo: "Recorrible con range",
        guia: "<p>Añade <code>func (c *Conjunto[T]) Todos() iter.Seq[T]</code>. Respeta el contrato: si <code>yield</code> devuelve false, el iterador para. Escribe una prueba que haga <code>break</code> a mitad y otra que use <code>slices.Collect</code>.</p>",
        comando: "go test -run 'Todos' -v ./... 2>&1 | tail -6",
        patrones: ["--- PASS", "(ok|PASS)"],
        prohibidos: ["FAIL", "panic"],
        pista: "if !yield(v) { return } dentro del bucle sobre el map interno.",
        exito: "Tu tipo se recorre como un slice, y un break no lo rompe."
      },
      {
        id: "m3", tipo: "salida", titulo: "Documentación que se lee en go doc",
        guia: "<p>Documenta cada identificador exportado con un comentario que empiece por su nombre y añade un <code>ExampleConjunto_Union</code> con su comentario <code>// Output:</code>: go test lo ejecuta y comprueba la salida.</p>",
        comando: "go doc -all . | head -20 && go test -run Example ./...",
        patrones: ["func Union", "ok"],
        prohibidos: ["FAIL"],
        exito: "La documentación y sus ejemplos se prueban igual que el código."
      },
      {
        id: "m4", tipo: "term", titulo: "Publica la versión",
        guia: "<p>Con el código en un repositorio público cuya ruta coincida con la del módulo, crea la etiqueta de git que publica la primera versión preliminar.</p>",
        pista: "git tag con v, mayor 0, menor 1, parche 0.",
        sol: ["git tag v0.1.0"],
        salida: "",
        exito: "Tras git push --tags, cualquiera puede hacer go get github.com/tu/conjunto@v0.1.0. Mientras la versión mayor sea 0, puedes romper la API; en v1 ya no."
      },
      {
        id: "m5", tipo: "check", titulo: "Buen ciudadano del ecosistema",
        guia: "<p>Antes de anunciarla, revisa lo que esperará quien la use.</p>",
        criterios: [
          "go.mod declara una versión de Go razonable y go mod tidy no cambia nada",
          "La API exportada es mínima: lo interno va en minúscula o en internal/",
          "govulncheck ./... no encuentra nada",
          "Sé que un cambio incompatible tras v1 exigiría la ruta /v2"
        ]
      }
    ]
  },
  {
    id: "go-p6", titulo: "Una suite de pruebas de nivel profesional", nivel: "Experto", desdeUnidad: 9, tiempo: "1 h 30 min",
    resumen: "Coge un parser de ficheros CSV de pedidos y rodéalo de pruebas por tablas, fuzzing, benchmarks, cobertura y detector de carreras.",
    objetivos: ["Probar por tablas con subtests y ayudantes", "Encontrar fallos con fuzzing", "Medir y mejorar con benchmarks y benchstat"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Tabla, subtests y cobertura",
        guia: "<p>Escribe <code>ParsearPedidos(r io.Reader) ([]Pedido, error)</code> para líneas <code>id,cliente,importe_en_centimos</code>. Pruébalo con una tabla que incluya líneas vacías, importes negativos, campos de más y comillas.</p>" +
          "<p>Pega la cobertura: el objetivo es superar el 80% con los caminos de error incluidos.</p>",
        comando: "go test -cover ./...",
        patrones: ["coverage: ([89][0-9]|100)(\\.[0-9])?% of statements"],
        prohibidos: ["FAIL"],
        pista: "go test -coverprofile=cover.out y go tool cover -html=cover.out te enseñan las líneas en rojo.",
        exito: "Por encima del 80% y probando los errores, no solo el camino feliz."
      },
      {
        id: "m2", tipo: "salida", titulo: "Que lo rompa el fuzzer",
        guia: "<p>Escribe <code>FuzzParsearPedidos</code> con un par de semillas. La propiedad: para cualquier entrada, la función no entra en pánico y, si no devuelve error, todos los importes son mayores o iguales que 0.</p>" +
          "<p>Déjalo un minuto. Si encuentra algo, arréglalo y deja el caso en <code>testdata/fuzz</code>. Pega el listado de esa carpeta (o la salida del fuzzer si no encontró nada).</p>",
        comando: "go test -fuzz=FuzzParsearPedidos -fuzztime=60s 2>&1 | tail -3; ls testdata/fuzz/FuzzParsearPedidos 2>/dev/null",
        patrones: ["(PASS|ok|[0-9a-f]{16})"],
        exito: "Cada entrada rara que encuentra el fuzzer se queda como prueba de regresión para siempre."
      },
      {
        id: "m3", tipo: "salida", titulo: "Benchmark con memoria",
        guia: "<p>Añade <code>BenchmarkParsearPedidos</code> con <code>for b.Loop()</code> sobre 10.000 líneas generadas antes del bucle. Mide con <code>-benchmem</code> y pega el resultado.</p>",
        comando: "go test -run='^$' -bench=Parsear -benchmem",
        patrones: ["BenchmarkParsearPedidos", "ns/op", "allocs/op"],
        exito: "Ya tienes la línea base. Sin ella, cualquier «optimización» es una opinión."
      },
      {
        id: "m4", tipo: "salida", titulo: "Mejora demostrada",
        guia: "<p>Reduce asignaciones (reserva capacidad para el slice, evita conversiones string/[]byte repetidas, usa <code>strings.Cut</code>…). Guarda 10 ejecuciones antes y después y compáralas con <code>benchstat</code> (<code>go install golang.org/x/perf/cmd/benchstat@latest</code>).</p>",
        comando: "benchstat viejo.txt nuevo.txt",
        patrones: ["sec/op", "allocs/op", "(~|-[0-9]+\\.[0-9]+%)"],
        exito: "Una mejora con intervalo de confianza, no una impresión."
      },
      {
        id: "m5", tipo: "salida", titulo: "Concurrencia comprobada",
        guia: "<p>Añade <code>ParsearEnParalelo(ficheros []string) ([]Pedido, error)</code> con errgroup y un límite de 4. Escribe una prueba que lo ejecute sobre varios ficheros de <code>t.TempDir()</code> y pásala con el detector de carreras.</p>",
        comando: "go test -race -count=3 ./... && echo SIN-CARRERAS",
        patrones: ["SIN-CARRERAS"],
        prohibidos: ["DATA RACE", "FAIL"],
        exito: "Probado en paralelo, tres veces, bajo el detector de carreras."
      }
    ]
  },
  {
    id: "go-p7", titulo: "Un servicio que se puede operar", nivel: "Experto", desdeUnidad: 11, tiempo: "1 h 30 min",
    resumen: "Convierte un servicio HTTP en algo que un equipo de guardia agradecería: logs estructurados, perfiles, versión en el binario y límites de memoria.",
    objetivos: ["Registrar con slog en JSON con id de petición", "Perfilar con pprof en un puerto interno", "Compilar con versión y ajustar el runtime al contenedor"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Logs en JSON con id de petición",
        guia: "<p>Añade un middleware que genere (o lea de <code>X-Request-ID</code>) un id por petición, cree un <code>logger.With(\"peticion_id\", id)</code> y registre método, ruta, código y duración al terminar.</p>" +
          "<p>Haz un par de peticiones y pega las líneas de log.</p>",
        comando: "curl -s localhost:8080/salud > /dev/null; docker logs --tail 3 mi-servicio",
        patrones: ["\"level\":\"INFO\"", "\"peticion_id\"", "\"codigo\":200"],
        pista: "Envuelve el ResponseWriter para capturar el código; el nivel sale como \"INFO\" con JSONHandler.",
        exito: "Cada línea se puede filtrar por petición, código o duración en tu sistema de logs."
      },
      {
        id: "m2", tipo: "salida", titulo: "pprof, pero solo por dentro",
        guia: "<p>Registra los perfiles en un <code>http.ServeMux</code> propio servido en <code>localhost:6060</code>, separado de la API. Genera algo de carga y captura 10 segundos de CPU.</p>",
        comando: "go tool pprof -top -seconds=10 http://localhost:6060/debug/pprof/profile 2>/dev/null | head -12",
        patrones: ["flat", "cum"],
        pista: "import _ \"net/http/pprof\" registra en DefaultServeMux; o registra pprof.Index, pprof.Profile… en tu propio mux.",
        exito: "Ya sabes en qué se va la CPU, sin exponer nada a Internet."
      },
      {
        id: "m3", tipo: "salida", titulo: "Versión dentro del binario",
        guia: "<p>Compila con <code>-trimpath -ldflags=\"-s -w -X main.version=…\"</code> usando la etiqueta de git como versión, y expón la versión en <code>/version</code>. Pega lo que dice el binario de sí mismo.</p>",
        comando: "go version -m ./api | head -12",
        patrones: ["path", "(vcs\\.revision|-X main\\.version|build)"],
        exito: "En un incidente sabrás exactamente qué código y con qué Go se compiló lo que está corriendo."
      },
      {
        id: "m4", tipo: "salida", titulo: "Ajustado al contenedor",
        guia: "<p>Despliega en Kubernetes (kind o minikube valen) con límites de CPU y memoria. Pasa <code>GOMEMLIMIT</code> desde <code>resourceFieldRef</code> y añade sondas <code>/salud</code> y <code>/listo</code>.</p>",
        comando: "kubectl get deploy mi-servicio -o yaml | grep -n -E 'GOMEMLIMIT|limits.memory|readinessProbe|livenessProbe'",
        patrones: ["GOMEMLIMIT", "readinessProbe"],
        exito: "El GC sabe cuánta memoria tiene y el balanceador sabe cuándo enviarte tráfico."
      },
      {
        id: "m5", tipo: "check", titulo: "Lista de guardia",
        guia: "<p>Comprueba que el servicio aguanta lo que pasa en producción.</p>",
        criterios: [
          "Al hacer kubectl rollout restart, ninguna petición en curso se corta (SIGTERM + Shutdown)",
          "Todas las llamadas salientes tienen timeout y usan el contexto de la petición",
          "La métrica o el log del número de goroutines se mantiene estable bajo carga",
          "No se registran secretos ni datos personales en claro (LogValuer donde haga falta)"
        ]
      }
    ]
  }
],


/* ---------------- Diseño de interfaces ---------------- */
diseno: [
{
    id: "ds-p4", titulo: "Dimensiona un servicio con números", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "45 min",
    resumen: "Antes de dibujar cajas, cuentas: peticiones por segundo, ancho de banda y servidores, y luego una prueba de carga que las confirme o las desmienta.",
    objetivos: ["Estimar capacidad con cuentas de servilleta", "Traducir la estimación a servidores con redundancia", "Contrastar la estimación con una prueba de carga real"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Supuestos primero",
        guia: "<p>Toda estimación empieza con supuestos escritos: usuarios activos diarios, peticiones por usuario, tamaño de respuesta y factor de pico. Si mañana cambia un supuesto, sabrás qué número cambia.</p>" +
          "<p>Elige un servicio que conozcas (una API de tu trabajo o un proyecto propio) y anota esos cuatro valores antes de seguir.</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "La calculadora de capacidad",
        guia: "<p>Lee cinco líneas: usuarios activos diarios, peticiones por usuario al día, tamaño de respuesta en KB, factor de pico y peticiones por segundo que aguanta un servidor. Con 86.400 s/día, imprime:</p><ul>" +
          "<li><code>media: X/s</code> (redondeada)</li>" +
          "<li><code>pico: Y/s</code> (media × factor, redondeada)</li>" +
          "<li><code>ancho de banda: Z MB/s</code> en el pico (pico sin redondear × KB / 1000, con un decimal)</li>" +
          "<li><code>servidores: N</code>: los que hacen falta para el pico (redondeando hacia arriba) <b>más uno</b> de redundancia (N+1)</li></ul>",
        lenguaje: "py",
        plantilla: `import math
dau = int(input())
por_usuario = int(input())
kb = float(input())
factor = float(input())
capacidad = int(input())
# calcula y escribe las cuatro líneas
`,
        pruebas: [
          { entrada: "10000000\n20\n15\n3\n1500\n", salida: "media: 2315/s\npico: 6944/s\nancho de banda: 104.2 MB/s\nservidores: 6" },
          { entrada: "500000\n40\n4\n2\n800\n", salida: "media: 231/s\npico: 463/s\nancho de banda: 1.9 MB/s\nservidores: 2" },
          { entrada: "300000000\n30\n8\n4\n2000\n", salida: "media: 104167/s\npico: 416667/s\nancho de banda: 3333.3 MB/s\nservidores: 210", oculta: true }
        ],
        solucion: `import math
dau = int(input())
por_usuario = int(input())
kb = float(input())
factor = float(input())
capacidad = int(input())
media = dau * por_usuario / 86400
pico = media * factor
print(f"media: {round(media)}/s")
print(f"pico: {round(pico)}/s")
print(f"ancho de banda: {pico * kb / 1000:.1f} MB/s")
print(f"servidores: {math.ceil(pico / capacidad) + 1}")
`,
        exito: "Ya tienes los cuatro números que abren cualquier diseño."
      },
      {
        id: "m3", tipo: "salida", titulo: "Mide lo que aguanta un servidor",
        guia: "<p>El dato más dudoso de tu estimación es cuánto aguanta un servidor. Mídelo: arranca tu servicio en local y lánzale carga con <code>hey</code>, <code>ab</code> o <code>wrk</code> durante 30 segundos contra un endpoint representativo.</p>" +
          "<p>Pega la salida. Fíjate también en los percentiles de latencia: el máximo que aguanta es el ritmo al que el p99 sigue siendo aceptable, no aquel en el que empieza a fallar.</p>",
        comando: "hey -z 30s -c 50 http://localhost:8080/api/recurso",
        patrones: ["(Requests/sec|Requests per second):\\s*[0-9]+"],
        pista: "Con ApacheBench: ab -n 20000 -c 50 http://localhost:8080/api/recurso",
        exito: "Ahora tu estimación se apoya en un dato medido, no en uno inventado."
      },
      {
        id: "m4", tipo: "check", titulo: "Saca conclusiones",
        guia: "<p>Escribe media página: con esos números, ¿basta un servidor o hacen falta muchos? ¿El cuello de botella es la CPU, la base de datos o la red? ¿Qué harías primero si el tráfico se multiplicara por diez?</p>",
        criterios: [
          "Tengo los supuestos, los cálculos y la medida real en un mismo documento",
          "He identificado qué recurso se agota primero",
          "Sé qué cambiaría si el tráfico se multiplicara por diez"
        ]
      }
    ]
  },
  {
    id: "ds-p5", titulo: "Una caché que no se desploma", nivel: "Intermedio", desdeUnidad: 3, tiempo: "1 h",
    resumen: "Una caché LRU con caducidad escrita a mano, y después la de verdad con Redis, midiendo aciertos y protegiéndola de la estampida.",
    objetivos: ["Implementar LRU con TTL", "Medir la tasa de aciertos", "Evitar estampidas y avalanchas"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "LRU con caducidad",
        guia: "<p>Primera línea: capacidad. Después, órdenes <code>set clave valor ttl t</code> y <code>get clave t</code> (t en segundos, creciente). Una entrada guardada en t con ttl caduca en t + ttl: un <code>get</code> con tiempo mayor o igual ya no la encuentra (y la borra).</p>" +
          "<p>Al llenarse, se expulsa la menos usada recientemente (un set o un get con acierto cuentan como uso). Imprime el valor o <code>-1</code> por cada get, y al final <code>aciertos: A fallos: F</code>.</p>",
        lenguaje: "py",
        plantilla: `import sys
from collections import OrderedDict
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
capacidad = int(lineas[0][0])
cache = OrderedDict()  # clave -> (valor, caduca)
aciertos = fallos = 0
for p in lineas[1:]:
    pass  # procesa set y get
print(f"aciertos: {aciertos} fallos: {fallos}")
`,
        pruebas: [
          { entrada: "2\nset a 1 10 0\nset b 2 10 1\nget a 2\nset c 3 10 3\nget b 4\nget a 5\nget a 10\n", salida: "1\n-1\n1\n-1\naciertos: 2 fallos: 2" },
          { entrada: "3\nset x 7 5 0\nget x 4\nget x 5\nget y 5\n", salida: "7\n-1\n-1\naciertos: 1 fallos: 2" },
          { entrada: "1\nset a 1 100 0\nset b 2 100 1\nget a 2\nget b 3\nset b 9 1 4\nget b 5\n", salida: "-1\n2\n-1\naciertos: 1 fallos: 2", oculta: true }
        ],
        solucion: `import sys
from collections import OrderedDict
lineas = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
capacidad = int(lineas[0][0])
cache = OrderedDict()  # clave -> (valor, caduca)
aciertos = fallos = 0
for p in lineas[1:]:
    if p[0] == "set":
        k, v, ttl, t = p[1], p[2], int(p[3]), int(p[4])
        if k in cache:
            del cache[k]
        cache[k] = (v, t + ttl)
        if len(cache) > capacidad:
            cache.popitem(last=False)
    else:
        k, t = p[1], int(p[2])
        if k in cache and t < cache[k][1]:
            cache.move_to_end(k)
            aciertos += 1
            print(cache[k][0])
        else:
            cache.pop(k, None)
            fallos += 1
            print(-1)
print(f"aciertos: {aciertos} fallos: {fallos}")
`,
        exito: "LRU y TTL juntos: las dos formas en que una entrada sale de una caché real."
      },
      {
        id: "m2", tipo: "salida", titulo: "Cache-aside con Redis y su tasa de aciertos",
        guia: "<p>En un servicio tuyo, cachea con cache-aside una consulta lenta en Redis: leer de Redis, y si no está, de la base de datos y guardarlo con <code>SET clave valor EX 300</code>. Al actualizar el dato, <b>borra</b> la clave.</p>" +
          "<p>Lanza tráfico un rato y pega las estadísticas de Redis. La tasa de aciertos es hits / (hits + misses).</p>",
        comando: "redis-cli INFO stats | grep keyspace",
        patrones: ["keyspace_hits:[0-9]+", "keyspace_misses:[0-9]+"],
        exito: "Tienes una caché funcionando y una cifra para saber si merece la pena."
      },
      {
        id: "m3", tipo: "check", titulo: "Protégela de la estampida y la avalancha",
        guia: "<p>Haz que tu caché aguante lo que tumba a las cachés ingenuas:</p><ul>" +
          "<li>TTL con variación aleatoria (por ejemplo 300 ± 60 s) para que no caduquen todas a la vez.</li>" +
          "<li>Un solo recálculo por clave: <code>SET lock:clave 1 NX EX 10</code>; quien no obtiene el cerrojo espera un poco y vuelve a leer, o sirve el valor anterior.</li>" +
          "<li>Cachear también el «no existe» con un TTL corto.</li></ul>" +
          "<p>Pruébalo: borra una clave muy pedida bajo carga y comprueba en los logs de la base de datos que solo llega una consulta.</p>",
        criterios: [
          "Los TTL llevan variación aleatoria",
          "Bajo carga, al caducar una clave solo una petición consulta la base de datos",
          "Las claves inexistentes no atraviesan la caché en cada petición"
        ]
      }
    ]
  },
  {
    id: "ds-p6", titulo: "Reparte datos con hashing consistente", nivel: "Intermedio", desdeUnidad: 5, tiempo: "1 h",
    resumen: "Un anillo de hashing consistente con nodos virtuales, y la prueba de que al quitar un nodo solo se mueven sus claves.",
    objetivos: ["Implementar un anillo con nodos virtuales", "Medir el reparto de claves", "Comprobar cuántas claves se mueven al cambiar los nodos"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "La función de hash",
        guia: "<p>Usarás <b>FNV-1a de 32 bits</b> con una mezcla final (la de MurmurHash3) para que textos parecidos como <code>A#0</code> y <code>A#1</code> caigan lejos en el anillo. La plantilla ya trae la función <code>fnv1a</code>: no hace falta que la escribas.</p>" +
          "<p>Cada nodo físico aparece en el anillo V veces con los nombres <code>A#0</code>, <code>A#1</code>… Las claves son <code>k0</code>, <code>k1</code>…</p>"
      },
      {
        id: "m2", tipo: "codigo", titulo: "El anillo con nodos virtuales",
        guia: "<p>Entrada: nodos separados por espacios; V (nodos virtuales por nodo); K (número de claves <code>k0</code>…<code>k{K-1}</code>); y el nodo que se va a retirar.</p>" +
          "<p>Coloca en el anillo los nodos virtuales por su hash (ordénalos por hash y, en empate, por nombre). Cada clave va al primer nodo virtual con hash <b>mayor o igual</b> que el suyo (o al primero del anillo si no hay). Imprime cuántas claves tiene cada nodo físico, en orden alfabético (<code>A: 34</code>), después retira el nodo indicado, reasigna y escribe <code>movidas: M</code> con cuántas claves cambiaron de nodo.</p>",
        lenguaje: "py",
        plantilla: `def fnv1a(texto):
    h = 2166136261
    for b in texto.encode():
        h ^= b
        h = (h * 16777619) % 2**32
    h ^= h >> 16
    h = (h * 0x85ebca6b) % 2**32
    h ^= h >> 13
    h = (h * 0xc2b2ae35) % 2**32
    h ^= h >> 16
    return h

nodos = input().split()
v = int(input())
k = int(input())
retirar = input().strip()
# construye el anillo, asigna, retira y cuenta
`,
        pruebas: [
          { entrada: "A B C\n50\n300\nB\n", salida: "A: 97\nB: 93\nC: 110\nmovidas: 93" },
          { entrada: "A B C D\n1\n200\nD\n", salida: "A: 53\nB: 34\nC: 104\nD: 9\nmovidas: 9" },
          { entrada: "n1 n2 n3 n4 n5\n100\n1000\nn3\n", salida: "n1: 196\nn2: 188\nn3: 171\nn4: 249\nn5: 196\nmovidas: 171", oculta: true }
        ],
        solucion: `def fnv1a(texto):
    h = 2166136261
    for b in texto.encode():
        h ^= b
        h = (h * 16777619) % 2**32
    h ^= h >> 16
    h = (h * 0x85ebca6b) % 2**32
    h ^= h >> 13
    h = (h * 0xc2b2ae35) % 2**32
    h ^= h >> 16
    return h

nodos = input().split()
v = int(input())
k = int(input())
retirar = input().strip()

def anillo(fisicos):
    return sorted((fnv1a(f"{n}#{i}"), f"{n}#{i}", n) for n in fisicos for i in range(v))

def asignar(ring):
    res = {}
    for j in range(k):
        h = fnv1a(f"k{j}")
        destino = next((n for p, _, n in ring if p >= h), ring[0][2])
        res[j] = destino
    return res

antes = asignar(anillo(nodos))
for n in sorted(nodos):
    print(f"{n}: {sum(1 for x in antes.values() if x == n)}")
despues = asignar(anillo([n for n in nodos if n != retirar]))
print(f"movidas: {sum(1 for j in range(k) if antes[j] != despues[j])}")
`,
        exito: "Las claves movidas coinciden con las que tenía el nodo retirado: ninguna otra se ha movido."
      },
      {
        id: "m3", tipo: "check", titulo: "Compara con hash módulo y con pocos nodos virtuales",
        guia: "<p>Con tu programa, compara tres cosas y apunta los resultados:</p><ul>" +
          "<li>El reparto con V = 1 frente a V = 100: ¿cuánto se desequilibra?</li>" +
          "<li>Cuántas claves se mueven al pasar de 4 a 5 nodos con <code>hash mod N</code> frente al anillo.</li>" +
          "<li>Qué nodo recibe las claves del retirado con V = 1 y con V = 100.</li></ul>",
        criterios: [
          "Sé explicar por qué los nodos virtuales igualan el reparto",
          "He medido que hash mod N mueve casi todas las claves y el anillo solo ~1/N",
          "Entiendo por qué, sin nodos virtuales, un fallo sobrecarga al vecino"
        ]
      }
    ]
  },
  {
    id: "ds-p7", titulo: "Pagos idempotentes con outbox", nivel: "Avanzado", desdeUnidad: 7, tiempo: "1 h 30 min",
    resumen: "Un endpoint de pagos que no cobra dos veces aunque el cliente reintente, y que publica sus eventos sin perder ninguno.",
    objetivos: ["Implementar claves de idempotencia", "Aplicar el patrón outbox", "Escribir un consumidor idempotente"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "La lógica de idempotencia y outbox",
        guia: "<p>Cada línea es <code>POST clave importe</code>. Simula el servidor:</p><ul>" +
          "<li>Clave nueva: crea el pago <code>p1</code>, <code>p2</code>… (numerados por orden de creación), añade a la outbox <code>PagoCreado pN importe</code> e imprime <code>201 pN</code>.</li>" +
          "<li>Clave ya vista con el mismo importe: <code>200 pN</code> (el mismo pago de antes, sin crear nada).</li>" +
          "<li>Clave ya vista con otro importe: <code>422 clave reutilizada</code>.</li></ul>" +
          "<p>Al final, imprime cada evento de la outbox como <code>outbox: PagoCreado pN importe</code>.</p>",
        lenguaje: "py",
        plantilla: `import sys
peticiones = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
claves = {}   # clave -> (pago, importe)
outbox = []
for _, clave, importe in peticiones:
    pass  # aplica la idempotencia
for e in outbox:
    print(f"outbox: {e}")
`,
        pruebas: [
          { entrada: "POST k1 500\nPOST k1 500\nPOST k2 300\nPOST k1 900\n", salida: "201 p1\n200 p1\n201 p2\n422 clave reutilizada\noutbox: PagoCreado p1 500\noutbox: PagoCreado p2 300" },
          { entrada: "POST a 10\n", salida: "201 p1\noutbox: PagoCreado p1 10" },
          { entrada: "POST x 1\nPOST y 1\nPOST x 1\nPOST y 2\nPOST z 5\n", salida: "201 p1\n201 p2\n200 p1\n422 clave reutilizada\n201 p3\noutbox: PagoCreado p1 1\noutbox: PagoCreado p2 1\noutbox: PagoCreado p3 5", oculta: true }
        ],
        solucion: `import sys
peticiones = [l.split() for l in sys.stdin.read().split("\\n") if l.strip()]
claves = {}   # clave -> (pago, importe)
outbox = []
for _, clave, importe in peticiones:
    if clave in claves:
        pago, imp = claves[clave]
        print(f"200 {pago}" if imp == importe else "422 clave reutilizada")
        continue
    pago = f"p{len(claves) + 1}"
    claves[clave] = (pago, importe)
    outbox.append(f"PagoCreado {pago} {importe}")
    print(f"201 {pago}")
for e in outbox:
    print(f"outbox: {e}")
`,
        exito: "Reintentar ya no cobra dos veces, y cada pago deja su evento pendiente de publicar."
      },
      {
        id: "m2", tipo: "salida", titulo: "Llévalo a tu base de datos",
        guia: "<p>En tu stack (Spring, Node, Django…), crea las tablas <code>pagos</code>, <code>claves_idempotencia</code> (con la clave como clave primaria) y <code>outbox</code>, y haz que el endpoint inserte las tres cosas <b>en la misma transacción</b>.</p>" +
          "<p>Envía dos veces la misma petición con la misma cabecera <code>Idempotency-Key</code> y pega el conteo de filas.</p>",
        comando: "psql -c \"SELECT (SELECT count(*) FROM pagos) AS pagos, (SELECT count(*) FROM outbox) AS eventos;\"",
        patrones: ["pagos", "eventos", "\\b1\\s*\\|\\s*1\\b"],
        pista: "Tras dos peticiones idénticas debe haber un pago y un evento: 1 | 1.",
        exito: "La base de datos garantiza la idempotencia con una restricción, no con buena voluntad."
      },
      {
        id: "m3", tipo: "check", titulo: "El relé y el consumidor",
        guia: "<p>Escribe un proceso que lea la outbox en orden, publique en Kafka o RabbitMQ y marque cada evento como enviado. Después, un consumidor que registre el id del evento en una tabla <code>procesados</code> en la misma transacción que su efecto.</p>" +
          "<p>Prueba el caso feo: mata el relé justo después de publicar y antes de marcar. Al arrancar, publicará el evento otra vez; el consumidor debe ignorarlo.</p>",
        criterios: [
          "El relé publica los eventos pendientes en orden y los marca como enviados",
          "Si el relé muere a mitad, ningún evento se pierde",
          "Un evento duplicado no produce un efecto duplicado en el consumidor"
        ]
      }
    ]
  },
  {
    id: "ds-p8", titulo: "Resiliencia: reintentos y circuit breaker", nivel: "Experto", desdeUnidad: 10, tiempo: "1 h",
    resumen: "Llamar a una dependencia que falla sin tumbarte con ella: timeouts, espera exponencial con tope y un disyuntor.",
    objetivos: ["Calcular esperas exponenciales con tope", "Poner timeouts y circuit breaker a una llamada real", "Provocar fallos a propósito y observar"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Espera exponencial con tope",
        guia: "<p>Primera línea: <code>base tope maximo</code> (milisegundos y número máximo de intentos). Segunda: el resultado de cada intento posible (<code>fallo</code> u <code>ok</code>). Antes del intento n+1 se espera <code>min(tope, base × 2^(n−1))</code>, donde n es el número de intentos fallidos hasta ese momento.</p>" +
          "<p>Imprime <code>intento N: resultado</code> por cada intento hecho y <code>espera: X ms</code> antes de cada reintento. Termina en el primer <code>ok</code> o al agotar el máximo, e imprime <code>total esperado: T ms</code> y <code>resultado: ok</code> o <code>resultado: agotado</code>.</p>",
        lenguaje: "py",
        plantilla: `base, tope, maximo = map(int, input().split())
resultados = input().split()
total = 0
# simula los intentos
`,
        pruebas: [
          { entrada: "100 1000 5\nfallo fallo ok\n", salida: "intento 1: fallo\nespera: 100 ms\nintento 2: fallo\nespera: 200 ms\nintento 3: ok\ntotal esperado: 300 ms\nresultado: ok" },
          { entrada: "200 500 4\nfallo fallo fallo fallo fallo\n", salida: "intento 1: fallo\nespera: 200 ms\nintento 2: fallo\nespera: 400 ms\nintento 3: fallo\nespera: 500 ms\nintento 4: fallo\ntotal esperado: 1100 ms\nresultado: agotado" },
          { entrada: "50 10000 3\nok\n", salida: "intento 1: ok\ntotal esperado: 0 ms\nresultado: ok", oculta: true }
        ],
        solucion: `base, tope, maximo = map(int, input().split())
resultados = input().split()
total = 0
estado = "agotado"
for n in range(1, maximo + 1):
    r = resultados[n - 1] if n - 1 < len(resultados) else "fallo"
    print(f"intento {n}: {r}")
    if r == "ok":
        estado = "ok"
        break
    if n < maximo:
        espera = min(tope, base * 2 ** (n - 1))
        total += espera
        print(f"espera: {espera} ms")
print(f"total esperado: {total} ms")
print(f"resultado: {estado}")
`,
        exito: "Esperas que crecen y se detienen en un tope: el esqueleto de cualquier política de reintentos. En producción, añade jitter."
      },
      {
        id: "m2", tipo: "check", titulo: "Protege una llamada real",
        guia: "<p>En un servicio tuyo que llame a otro por HTTP, añade: timeout de conexión y de respuesta, reintentos solo para operaciones idempotentes con espera exponencial y jitter, y un circuit breaker (Resilience4j, opossum, pybreaker o el de tu service mesh) con un plan B.</p>",
        criterios: [
          "Toda llamada remota tiene timeout explícito",
          "Solo se reintentan operaciones idempotentes, con jitter y un máximo",
          "Con la dependencia caída, el circuito se abre y se sirve el plan B al instante"
        ]
      },
      {
        id: "m3", tipo: "salida", titulo: "Rómpelo a propósito",
        guia: "<p>Haz que la dependencia falle o vaya lenta (apágala, o mete latencia con Toxiproxy o <code>tc netem</code>) y lanza carga. Pega el recuento de códigos de respuesta de tu servicio: deberían ser respuestas degradadas rápidas, no timeouts en cadena.</p>",
        comando: "for i in $(seq 1 50); do curl -s -o /dev/null -w \"%{http_code}\\n\" http://localhost:8080/api/producto/1; done | sort | uniq -c",
        patrones: ["[0-9]+ (200|503)"],
        prohibidos: ["[0-9]+ 504"],
        pista: "Un 504 significa que alguien esperó hasta el timeout del proxy: el circuito no se abrió o el timeout de tu cliente es más largo que el del proxy.",
        exito: "Tu servicio falla rápido y con plan B en vez de arrastrar a los demás."
      }
    ]
  },
  {
    id: "ds-p9", titulo: "Limitador de peticiones distribuido", nivel: "Experto", desdeUnidad: 11, tiempo: "1 h 30 min",
    resumen: "Un token bucket por cliente, primero en código y luego en Redis con un script atómico, compartido por varias réplicas.",
    objetivos: ["Implementar token bucket por cliente", "Hacerlo atómico y compartido con Redis", "Responder 429 con las cabeceras correctas"],
    misiones: [
      {
        id: "m1", tipo: "codigo", titulo: "Token bucket por cliente",
        guia: "<p>Primera línea: <code>capacidad ritmo</code> (fichas por segundo). Después, líneas <code>t cliente</code> con t creciente. Cada cliente tiene su propio cubo, que empieza lleno la primera vez que aparece. Rellena con <code>(t − último_t_del_cliente) × ritmo</code> sin pasar de la capacidad; si hay al menos una ficha, gasta una e imprime <code>t cliente ok</code>; si no, <code>t cliente 429</code>.</p>",
        lenguaje: "js",
        plantilla: `const lineas = require("fs").readFileSync(0, "utf8").trim().split("\\n").map(l => l.trim()).filter(Boolean);
const [capacidad, ritmo] = lineas[0].split(" ").map(Number);
const cubos = new Map(); // cliente -> { fichas, ultimo }
const salida = [];
for (const l of lineas.slice(1)) {
  const [ts, cliente] = l.split(" ");
  const t = Number(ts);
  // rellena, decide y guarda
}
console.log(salida.join("\\n"));
`,
        pruebas: [
          { entrada: "2 1\n0 ana\n0 ana\n0 ana\n0 luis\n1 ana\n", salida: "0 ana ok\n0 ana ok\n0 ana 429\n0 luis ok\n1 ana ok" },
          { entrada: "1 0.5\n0 x\n1 x\n2 x\n2 y\n", salida: "0 x ok\n1 x 429\n2 x ok\n2 y ok" },
          { entrada: "3 1\n0 a\n0 a\n0 a\n0 a\n10 a\n10 a\n10 a\n10 a\n", salida: "0 a ok\n0 a ok\n0 a ok\n0 a 429\n10 a ok\n10 a ok\n10 a ok\n10 a 429", oculta: true }
        ],
        solucion: `const lineas = require("fs").readFileSync(0, "utf8").trim().split("\\n").map(l => l.trim()).filter(Boolean);
const [capacidad, ritmo] = lineas[0].split(" ").map(Number);
const cubos = new Map(); // cliente -> { fichas, ultimo }
const salida = [];
for (const l of lineas.slice(1)) {
  const [ts, cliente] = l.split(" ");
  const t = Number(ts);
  const c = cubos.get(cliente) || { fichas: capacidad, ultimo: t };
  c.fichas = Math.min(capacidad, c.fichas + (t - c.ultimo) * ritmo);
  c.ultimo = t;
  if (c.fichas >= 1) {
    c.fichas -= 1;
    salida.push(ts + " " + cliente + " ok");
  } else {
    salida.push(ts + " " + cliente + " 429");
  }
  cubos.set(cliente, c);
}
console.log(salida.join("\\n"));
`,
        exito: "Un cubo por cliente, dos números por cubo: así de barato es limitar."
      },
      {
        id: "m2", tipo: "check", titulo: "Atómico y compartido en Redis",
        guia: "<p>Lleva la lógica a un script Lua que reciba la clave del cliente, la capacidad, el ritmo y el instante, y haga en un solo paso: leer <code>fichas</code> y <code>ultimo</code> (un hash), rellenar, decidir, guardar y poner caducidad a la clave. Llámalo con <code>EVALSHA</code> desde un middleware de tu API.</p>" +
          "<p>Decide y documenta qué pasa si Redis no responde: dejar pasar con un límite local de emergencia (fail open) o rechazar (fail closed).</p>",
        criterios: [
          "La decisión se toma en un único script atómico",
          "Las claves de clientes inactivos caducan solas",
          "Está decidido y documentado el comportamiento si Redis cae"
        ]
      },
      {
        id: "m3", tipo: "salida", titulo: "Compruébalo con dos réplicas",
        guia: "<p>Arranca dos réplicas de tu API detrás de un balanceador (o en dos puertos) con un límite de 10 peticiones y lanza 30 seguidas repartidas entre las dos. Si el límite es de verdad compartido, deben pasar unas 10, no 20.</p>" +
          "<p>Devuelve <code>429</code> con <code>Retry-After</code>. Pega el recuento de códigos.</p>",
        comando: "for i in $(seq 1 30); do curl -s -o /dev/null -w \"%{http_code}\\n\" http://localhost:8080/api/recurso; done | sort | uniq -c",
        patrones: ["\\b(9|1[01]) 200\\b", "[0-9]+ 429"],
        pista: "Si ves unas 20 respuestas 200, cada réplica está contando por su cuenta.",
        exito: "Un límite global, respetado por todas las réplicas."
      }
    ]
  },
  {
    id: "ds-p10", titulo: "Tu documento de diseño completo", nivel: "Maestro", desdeUnidad: 14, tiempo: "3 h",
    resumen: "Un documento de diseño de verdad para un sistema de reservas (o el caso que elijas), con números, compromisos, fallos y un simulacro de defensa.",
    objetivos: ["Escribir un documento de diseño completo", "Justificar cada decisión con su precio", "Defenderlo en una entrevista simulada de 45 minutos"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El documento",
        guia: "<p>Escribe <code>DISENO.md</code> para un sistema de venta de entradas con picos de 1 millón de personas a la vez (o el caso clásico que prefieras) con estas secciones:</p><ul>" +
          "<li><b>Requisitos</b> funcionales y no funcionales con números.</li>" +
          "<li><b>Estimación</b>: peticiones por segundo, datos, ancho de banda.</li>" +
          "<li><b>API</b> y <b>modelo de datos</b>.</li>" +
          "<li><b>Arquitectura</b> de alto nivel con un diagrama.</li>" +
          "<li><b>Profundización</b> en dos piezas difíciles (por ejemplo, retención de asientos y sala de espera).</li>" +
          "<li><b>Fallos</b> y riesgos: qué pasa si cae cada pieza.</li>" +
          "<li><b>SLOs</b> y qué medirías.</li>" +
          "<li><b>Decisiones</b> (ADR) con las alternativas descartadas.</li></ul>",
        comando: "grep -E '^#' DISENO.md",
        patrones: ["requisitos", "estimaci", "api", "datos", "arquitectura", "(fallos|riesgos)", "slo", "(decisi|adr)"],
        exito: "Un documento que cualquier ingeniero del equipo podría revisar y cuestionar."
      },
      {
        id: "m2", tipo: "check", titulo: "Que te lo destrocen",
        guia: "<p>Pásale el documento a alguien con experiencia (o revísalo tú al día siguiente como si fueras el revisor más duro) con estas preguntas: ¿qué pasa si el tráfico es 10 veces mayor?, ¿qué pieza cae primero?, ¿dónde se puede vender un asiento dos veces?, ¿cuánto cuesta al mes?</p>",
        criterios: [
          "He recibido (o escrito) al menos cinco preguntas difíciles",
          "He respondido cada una en el documento o he cambiado el diseño",
          "Tengo una estimación de coste mensual, aunque sea aproximada"
        ]
      },
      {
        id: "m3", tipo: "check", titulo: "El simulacro de 45 minutos",
        guia: "<p>Con un temporizador y una pizarra en blanco (sin mirar el documento), diseña el sistema en voz alta siguiendo el guion: requisitos, estimación, API y datos, alto nivel, profundización y fallos. Grábate si puedes y revisa dónde perdiste el tiempo.</p>",
        criterios: [
          "He terminado las seis fases dentro de los 45 minutos",
          "He dado números en la estimación y los he usado para decidir",
          "He explicado al menos tres compromisos con su precio"
        ]
      }
    ]
  }
],


/* ---------------- Observabilidad ---------------- */
observabilidad: [
{
    id: "ob-p1", titulo: "Métricas que sirven para algo", nivel: "Intermedio", desdeUnidad: 4, tiempo: "50 min",
    resumen: "Instrumenta una aplicación, recógela con Prometheus y responde preguntas reales con PromQL.",
    objetivos: ["Exponer métricas", "Recogerlas con Prometheus", "Consultar con PromQL"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Expón las métricas",
        guia: "<p>Añade a tu aplicación un <code>/metrics</code> con la librería de Prometheus de tu lenguaje.</p>" +
          "<p>Empieza por las cuatro que importan (las «señales doradas»): peticiones, errores, latencia y saturación.</p>",
        comando: "curl -s http://localhost:8080/metrics | head -20",
        patrones: ["(# HELP|# TYPE)", "[a-z_]+(_total|_seconds|_count)"],
        exito: "Métricas expuestas en formato Prometheus."
      },
      {
        id: "m2", tipo: "salida", titulo: "Que Prometheus las recoja",
        guia: "<p>Levanta Prometheus con un <code>prometheus.yml</code> que apunte a tu aplicación y comprueba en <b>Targets</b> que el objetivo está <code>UP</code>.</p>",
        comando: "curl -s http://localhost:9090/api/v1/targets | head -c 500",
        patrones: ["(\"health\": *\"up\"|up)"],
        prohibidos: ["\"health\": *\"down\""],
        pista: "Desde un contenedor, «localhost» es el propio contenedor: usa el nombre del servicio o host.docker.internal.",
        exito: "Recogida funcionando."
      },
      {
        id: "m3", tipo: "salida", titulo: "Tasa de errores en PromQL",
        guia: "<p>Escribe la consulta del porcentaje de peticiones que fallan en los últimos 5 minutos:</p>" +
          "<pre class=\"dg-pre\">sum(rate(http_requests_total{status=~\"5..\"}[5m]))\n  / sum(rate(http_requests_total[5m]))</pre>" +
          "<p>Fíjate en <code>rate</code>: los contadores solo suben, así que el valor absoluto no dice nada. Lo que importa es el ritmo.</p>",
        comando: "(pega tu consulta y su resultado)",
        patrones: ["rate[(]", "[0-9]"],
        exito: "Tasa de error calculada como se hace de verdad."
      },
      {
        id: "m4", tipo: "salida", titulo: "El percentil 95",
        guia: "<p>La latencia media miente: si 95 peticiones tardan 10 ms y 5 tardan 10 segundos, la media parece buena y hay gente sufriendo.</p>" +
          "<p>Calcula el p95 con <code>histogram_quantile(0.95, sum(rate(..._bucket[5m])) by (le))</code>.</p>",
        comando: "(pega la consulta del p95 y su resultado)",
        patrones: ["histogram_quantile", "0[.,]95"],
        exito: "Percentil en vez de media. Este cambio de mentalidad vale el curso entero."
      }
    ]
  },
  {
    id: "ob-p2", titulo: "Panel y alerta que no molestan", nivel: "Avanzado", desdeUnidad: 5, tiempo: "55 min",
    resumen: "Un panel que se lee en diez segundos y una alerta que solo suena cuando hay que levantarse.",
    objetivos: ["Diseñar un panel útil", "Alertar por síntomas", "Evitar la fatiga de alertas"],
    misiones: [
      {
        id: "m1", tipo: "check", titulo: "El panel de las cuatro señales",
        guia: "<p>Un panel por servicio, con cuatro gráficas arriba: <b>tráfico, errores, latencia (p95) y saturación</b>.</p>" +
          "<p>Nada de veinte gráficas. Si hay que buscar, el panel no sirve durante un incidente.</p>",
        criterios: [
          "El panel cabe en una pantalla sin desplazarse",
          "Las cuatro señales están arriba del todo",
          "Cada gráfica tiene unidades y un umbral visible"
        ]
      },
      {
        id: "m2", tipo: "salida", titulo: "La alerta, con for",
        guia: "<p>Define una alerta sobre la tasa de errores con un <code>for: 5m</code>: solo salta si el problema <b>persiste</b>.</p>" +
          "<p>Sin ese <code>for</code>, un pico de dos segundos te despierta de madrugada para nada, y en dos semanas nadie hace caso a las alertas.</p>",
        comando: "cat alertas.yml",
        patrones: ["(alert|expr)", "for: *[0-9]+[ms]"],
        exito: "Alerta con histéresis. Ya no avisa por ruido."
      },
      {
        id: "m3", tipo: "salida", titulo: "Que diga qué hacer",
        guia: "<p>Añade anotaciones con el resumen, el impacto y el <b>enlace al runbook</b>.</p>" +
          "<p>Una alerta que dice «CPU alta» y nada más obliga a investigar desde cero cada vez.</p>",
        comando: "cat alertas.yml",
        patrones: ["annotations", "(summary|resumen)", "(runbook|http)"],
        exito: "Alerta accionable."
      },
      {
        id: "m4", tipo: "check", titulo: "Pruébala provocando el fallo",
        guia: "<p>Provoca errores de verdad (mete un 500 forzado) y comprueba que salta, y que se apaga sola al arreglarlo.</p>",
        criterios: [
          "He visto la alerta pasar a firing y volver a resolved",
          "Sé cuánto tarda en saltar y por qué",
          "La alerta apunta a algo que puedo hacer"
        ]
      }
    ]
  },
  {
    id: "ob-p3", titulo: "Sigue una petición de punta a punta", nivel: "Avanzado", desdeUnidad: 6, tiempo: "1 h",
    resumen: "Trazas distribuidas y logs correlacionados: dónde se van de verdad los milisegundos.",
    objetivos: ["Instrumentar con OpenTelemetry", "Propagar el contexto", "Correlacionar logs y trazas"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "La primera traza",
        guia: "<p>Instrumenta el servicio con OpenTelemetry y manda las trazas a Jaeger o Tempo.</p>" +
          "<p>Cada operación es un <i>span</i>; el conjunto de una petición es una <i>traza</i>.</p>",
        comando: "(pega el id de una traza y sus spans)",
        patrones: ["[0-9a-f]{8,}"],
        exito: "Primera traza capturada."
      },
      {
        id: "m2", tipo: "salida", titulo: "Que el contexto cruce servicios",
        guia: "<p>Con dos servicios, propaga el contexto en las cabeceras (<code>traceparent</code>). Si no se propaga, tendrás dos trazas sueltas en vez de una completa.</p>" +
          "<p>Esa propagación es <b>todo</b> el valor del trazado distribuido.</p>",
        comando: "curl -s -D - http://localhost:8080/api -o /dev/null | grep -i trace",
        patrones: ["(traceparent|trace-id|x-trace)"],
        exito: "Contexto propagado: una sola traza para toda la petición."
      },
      {
        id: "m3", tipo: "salida", titulo: "Logs con el id de traza",
        guia: "<p>Añade el <code>trace_id</code> a cada línea de log, en formato estructurado (JSON).</p>" +
          "<p>Así, desde una traza lenta saltas a sus logs exactos, sin buscar por hora.</p>",
        comando: "(pega una línea de log con su trace_id)",
        patrones: ["(trace_id|traceId|trace-id)", "[0-9a-f]{8,}"],
        exito: "Logs y trazas cosidos."
      },
      {
        id: "m4", tipo: "check", titulo: "Encuentra el cuello de botella",
        guia: "<p>Busca la traza más lenta y mira qué span se lleva el tiempo. Casi siempre es una consulta a base de datos o una llamada externa.</p>",
        criterios: [
          "He identificado el span que más tarda",
          "Sé cuánto del total se va en ese span",
          "Tengo una hipótesis de por qué y cómo comprobarla"
        ]
      }
    ]
  },
{
    id: "ob-p4", titulo: "Logs que se pueden consultar", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "45 min",
    resumen: "Pasa tu aplicación a logs estructurados, recógelos con un agente y responde preguntas reales con LogQL.",
    objetivos: ["Escribir logs en JSON con contexto", "Centralizarlos en Loki", "Consultar y agregar con LogQL"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Logs en JSON",
        guia: "<p>Cambia la configuración de logs de tu aplicación para que escriba <b>JSON a stdout</b>: nivel, servicio, mensaje fijo y los datos en campos aparte.</p>" +
          "<p>Nada de «Usuario 42 ha comprado 3 productos» dentro del mensaje: <code>msg</code> fijo y <code>usuario</code> y <code>productos</code> como campos.</p>",
        comando: "docker logs --tail 3 mi-api",
        patrones: ["\\{.*\"(nivel|level)\"", "\"(msg|message|mensaje)\""],
        prohibidos: ["(password|contrase[ñn]a|authorization|bearer )"],
        pista: "En Spring Boot 3.4+ basta con logging.structured.format.console=ecs; en Node, pino ya escribe JSON.",
        exito: "Logs estructurados: ya se pueden filtrar y agregar por campos."
      },
      {
        id: "m2", tipo: "salida", titulo: "Loki recibiendo",
        guia: "<p>Levanta Loki y un agente (Grafana Alloy, Fluent Bit o el Collector de OpenTelemetry) que lea los logs de tus contenedores y los envíe con etiquetas de <b>baja cardinalidad</b>: servicio y entorno.</p>" +
          "<p>No uses Promtail: está obsoleto.</p>",
        comando: "curl -s http://localhost:3100/ready",
        patrones: ["ready"],
        exito: "Loki listo para recibir."
      },
      {
        id: "m3", tipo: "term", titulo: "Los errores de un servicio",
        guia: "<p>Escribe la consulta LogQL que devuelve las líneas del servicio <code>api</code> cuyo campo JSON <code>nivel</code> es <code>ERROR</code>.</p>",
        pista: "Selector de flujo, parser json y filtro por el campo.",
        sol: ["{servicio=\"api\"} | json | nivel=\"ERROR\"", "{servicio=\"api\"} | json | nivel = \"ERROR\"", "{servicio=\"api\"}|json|nivel=\"ERROR\""],
        salida: "",
        exito: "El filtro por campo solo es posible porque los logs son JSON."
      },
      {
        id: "m4", tipo: "salida", titulo: "Una métrica a partir de logs",
        guia: "<p>Con <code>logcli</code> (o en Grafana Explore), calcula los errores por minuto de cada servicio en la última hora:</p>" +
          "<pre class=\"dg-pre\">sum by (servicio) (count_over_time({entorno=\"local\"} | json | nivel=\"ERROR\" [1m]))</pre>" +
          "<p>Provoca algún error en tu API para que salga algo.</p>",
        comando: "logcli query 'sum by (servicio) (count_over_time({entorno=\"local\"} | json | nivel=\"ERROR\" [1m]))' --since=1h",
        patrones: ["servicio", "[0-9]"],
        exito: "Ya sabes sacar números de los logs. Si esa consulta la necesitas a menudo, conviértela en una métrica de verdad."
      },
      {
        id: "m5", tipo: "check", titulo: "Revisión de privacidad y coste",
        guia: "<p>Repasa tus logs como si fueras el responsable de protección de datos y el que paga la factura.</p>",
        criterios: [
          "No aparecen contraseñas, tokens ni cabeceras Authorization",
          "Los datos personales imprescindibles están minimizados o seudonimizados",
          "Las comprobaciones de salud y el nivel DEBUG no se envían a Loki",
          "Las etiquetas de Loki tienen pocos valores posibles (nada de ids)"
        ]
      }
    ]
  },
  {
    id: "ob-p5", titulo: "Un SLO con alertas por burn rate", nivel: "Experto", desdeUnidad: 7, tiempo: "1 h 15 min",
    resumen: "Define un SLO de verdad para tu API, precalcula sus tasas con reglas de grabación probadas y alerta por burn rate multiventana.",
    objetivos: ["Definir un SLI y un SLO", "Escribir y probar reglas de grabación", "Alertar por burn rate en varias ventanas"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El SLI",
        guia: "<p>Elige el SLI de disponibilidad de tu API (peticiones sin 5xx entre todas) y calcula su valor en la última hora en Prometheus.</p>",
        comando: "(pega tu consulta y su resultado)",
        patrones: ["(rate|increase)[(]", "5\\.\\.", "0[.,]9"],
        exito: "SLI medido. Ahora decide el objetivo con lo que necesita el usuario y lo que el sistema consigue hoy."
      },
      {
        id: "m2", tipo: "codigo", titulo: "El presupuesto, en números",
        guia: "<p>Antes de alertar, echa la cuenta. Lee <code>slo total fallidas</code> e imprime el presupuesto en peticiones (redondeado) y el porcentaje consumido con un decimal:</p>" +
          "<pre class=\"dg-pre\">presupuesto=10000\nconsumido=40.0%</pre>",
        lenguaje: "js",
        plantilla: "const [slo, total, fallidas] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\n// imprime presupuesto= y consumido=\n",
        pruebas: [
          { entrada: "99.9 10000000 4000", salida: "presupuesto=10000\nconsumido=40.0%" },
          { entrada: "99 50000 0", salida: "presupuesto=500\nconsumido=0.0%" },
          { entrada: "99.95 2000000 1500", salida: "presupuesto=1000\nconsumido=150.0%", oculta: true }
        ],
        solucion: "const [slo, total, fallidas] = require(\"fs\").readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\nconst presupuesto = Math.round(total * (100 - slo) / 100);\nconsole.log(\"presupuesto=\" + presupuesto);\nconsole.log(\"consumido=\" + (fallidas / presupuesto * 100).toFixed(1) + \"%\");",
        exito: "Presupuesto calculado. Más del 100 % consumido significa SLO incumplido en la ventana."
      },
      {
        id: "m3", tipo: "salida", titulo: "Reglas de grabación",
        guia: "<p>Escribe las reglas <code>job:slo_errors:ratio_rate5m</code>, <code>30m</code>, <code>1h</code>, <code>6h</code> y <code>3d</code>, y la alerta con las parejas 1 h + 5 min (14,4×) y 6 h + 30 min (6×). Valida el fichero.</p>",
        comando: "promtool check rules reglas/slo.yml",
        patrones: ["SUCCESS: *[0-9]+ rules found"],
        prohibidos: ["FAILED"],
        exito: "Reglas válidas."
      },
      {
        id: "m4", tipo: "salida", titulo: "Prueba que la alerta salta",
        guia: "<p>Escribe una prueba unitaria con <code>input_series</code> que simule un 2 % de errores durante una hora y comprueba con <code>alert_rule_test</code> que la alerta rápida está disparada. Añade otro caso con un 0,05 % en el que no debe saltar.</p>",
        comando: "promtool test rules tests/slo_test.yml",
        patrones: ["SUCCESS"],
        prohibidos: ["FAILED"],
        exito: "La alerta está probada antes del primer incidente, que es cuando debe estarlo."
      },
      {
        id: "m5", tipo: "check", titulo: "Que sea accionable",
        guia: "<p>Una alerta por SLO sin contexto obliga a investigar desde cero. Complétala.</p>",
        criterios: [
          "La alerta lleva resumen con el valor y enlace a un runbook",
          "Existe un panel con el SLI, el objetivo y el presupuesto restante",
          "La alerta lenta (3 días + 6 h) va a ticket, no a página",
          "Hay una alerta absent() por si desaparece la métrica del SLI"
        ]
      }
    ]
  },
  {
    id: "ob-p6", titulo: "Día de juego: incidente simulado y postmortem", nivel: "Maestro", desdeUnidad: 9, tiempo: "1 h 30 min",
    resumen: "Rompe tu propio sistema a propósito, detecta el fallo con tus alertas, investígalo de la métrica a la traza y al log, y escribe el postmortem.",
    objetivos: ["Probar la detección de extremo a extremo", "Investigar con las tres señales conectadas", "Escribir un postmortem sin culpa con acciones"],
    misiones: [
      {
        id: "m1", tipo: "check", titulo: "Prepara el simulacro",
        guia: "<p>Con tu pila (API con OpenTelemetry, Prometheus, Alertmanager, Grafana, Loki y Tempo), elige un fallo realista y no lo cuentes a quien haga de guardia: latencia añadida en la base de datos, un pool de conexiones pequeño o un despliegue con un error.</p>",
        criterios: [
          "El fallo está elegido y se puede revertir con un comando",
          "Hay alguien (o tú mismo) en el papel de guardia y alguien de coordinador",
          "Se ha acordado el canal donde se anotará la cronología"
        ]
      },
      {
        id: "m2", tipo: "salida", titulo: "Que lo detecten las alertas",
        guia: "<p>Provoca el fallo y espera. La detección debe venir de una alerta por síntomas, no de alguien mirando un panel.</p>",
        comando: "amtool alert query",
        patrones: ["[A-Za-z]+"],
        pista: "Si no aparece nada tras 15 minutos, eso ya es un hallazgo para el postmortem: la detección falló.",
        exito: "Alerta disparada. Anota cuánto tardó desde que provocaste el fallo: es tu tiempo de detección."
      },
      {
        id: "m3", tipo: "salida", titulo: "De la métrica a la traza",
        guia: "<p>Desde el panel, salta a una traza lenta o con error (con un exemplar o con TraceQL) y localiza el span responsable.</p>",
        comando: "(pega el trace_id y el span que se lleva el tiempo)",
        patrones: ["[0-9a-f]{16,}"],
        exito: "Localizado el tramo que falla."
      },
      {
        id: "m4", tipo: "salida", titulo: "De la traza al log",
        guia: "<p>Con ese trace_id, busca en Loki los logs de la petición y encuentra el mensaje que explica el fallo.</p>",
        comando: "logcli query '{entorno=\"local\"} |= \"TU_TRACE_ID\"' --since=1h",
        patrones: ["(trace_id|traceId)", "(ERROR|WARN|error|warn)"],
        exito: "Las tres señales conectadas: métrica, traza y log de la misma petición."
      },
      {
        id: "m5", tipo: "check", titulo: "El postmortem",
        guia: "<p>Revierte el fallo y escribe el postmortem sin culpas.</p>",
        criterios: [
          "Tiene resumen, impacto, cronología con horas y factores contribuyentes",
          "No aparece «error humano» como causa",
          "Recoge qué fue bien, qué fue mal y dónde hubo suerte",
          "Tiene acciones de prevenir, detectar y mitigar, con responsable y fecha"
        ]
      }
    ]
  }
],


/* ---------------- Ansible ---------------- */
ansible: [
{
    id: "an-p1", titulo: "Tu primer playbook idempotente", nivel: "Fundamentos", desdeUnidad: 3, tiempo: "45 min",
    resumen: "Configura una máquina sin entrar en ella, y compruébalo con la prueba de fuego: ejecutarlo dos veces.",
    objetivos: ["Escribir un inventario y un playbook", "Entender la idempotencia", "Usar módulos en vez de comandos"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Que Ansible llegue a la máquina",
        guia: "<p>Escribe el inventario y comprueba la conexión. Usa una máquina virtual, un contenedor o <code>localhost</code>.</p>" +
          "<p>Ansible no instala nada en el destino: va por SSH y usa el Python que ya hay. Esa es su gracia.</p>",
        comando: "ansible all -i inventario.ini -m ping",
        patrones: ["(SUCCESS|pong)"],
        prohibidos: ["(UNREACHABLE|FAILED)"],
        exito: "Conexión establecida."
      },
      {
        id: "m2", tipo: "salida", titulo: "El playbook",
        guia: "<p>Escribe un playbook que instale nginx, deje un fichero de configuración y se asegure de que el servicio está arrancado.</p>" +
          "<p>Usa <b>módulos</b> (<code>apt</code>, <code>copy</code>, <code>service</code>), no <code>shell</code>. Los módulos saben si hace falta cambiar algo; un <code>shell</code> ejecuta siempre.</p>",
        comando: "ansible-playbook -i inventario.ini sitio.yml",
        patrones: ["(ok=[0-9]+|changed=[0-9]+)", "PLAY RECAP"],
        prohibidos: ["failed=[1-9]"],
        exito: "Playbook aplicado."
      },
      {
        id: "m3", tipo: "salida", titulo: "La prueba de la idempotencia",
        guia: "<p>Ejecútalo <b>otra vez</b>, sin cambiar nada. Debe salir <code>changed=0</code>.</p>" +
          "<p>Eso es idempotencia: aplicar dos veces da el mismo resultado que aplicar una. Si sale <code>changed</code> en la segunda, algo tuyo está haciendo trabajo innecesario, y probablemente reiniciando servicios sin motivo.</p>",
        comando: "ansible-playbook -i inventario.ini sitio.yml",
        patrones: ["changed=0"],
        prohibidos: ["failed=[1-9]"],
        pista: "El culpable suele ser un task con shell o command sin creates/when.",
        exito: "Idempotente de verdad. Esta es la diferencia entre Ansible y un script de bash."
      },
      {
        id: "m4", tipo: "salida", titulo: "Ensayo en seco",
        guia: "<p><code>--check</code> te dice qué cambiaría sin tocar nada, y <code>--diff</code> te enseña las diferencias de los ficheros.</p>" +
          "<p>Es el equivalente al plan de Terraform, y debería ser tu costumbre antes de tocar producción.</p>",
        comando: "ansible-playbook -i inventario.ini sitio.yml --check --diff",
        patrones: ["(PLAY RECAP|changed=|ok=)"],
        exito: "Ya puedes ver el futuro antes de provocarlo."
      }
    ]
  },
  {
    id: "an-p2", titulo: "Roles, variables y secretos", nivel: "Avanzado", desdeUnidad: 8, tiempo: "55 min",
    resumen: "Organiza el playbook en roles reutilizables y guarda los secretos cifrados con Vault.",
    objetivos: ["Estructurar en roles", "Usar plantillas con variables", "Cifrar secretos"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El rol",
        guia: "<p>Extrae a un rol con su estructura: <code>tasks/</code>, <code>templates/</code>, <code>defaults/</code> y <code>handlers/</code>.</p>" +
          "<p>Los <b>handlers</b> son la joya: se ejecutan <i>solo si algo cambió</i>. Así el servicio se reinicia cuando cambia su configuración, y no en cada ejecución.</p>",
        comando: "find roles -maxdepth 2 -type d",
        patrones: ["tasks", "(templates|defaults|handlers)"],
        exito: "Rol estructurado y reutilizable."
      },
      {
        id: "m2", tipo: "salida", titulo: "Plantillas, no ficheros fijos",
        guia: "<p>Convierte la configuración en una plantilla Jinja2 (<code>.j2</code>) con variables: puertos, rutas, número de procesos.</p>",
        comando: "ls roles/*/templates/",
        patrones: ["[.]j2"],
        exito: "Configuración parametrizada."
      },
      {
        id: "m3", tipo: "salida", titulo: "Secretos cifrados",
        guia: "<p>Cifra el fichero de secretos con <code>ansible-vault encrypt</code>. Queda ilegible en el repositorio y Ansible lo descifra al ejecutar.</p>" +
          "<p>Enseña la <b>primera línea</b> del fichero cifrado: debe empezar por <code>$ANSIBLE_VAULT</code>.</p>",
        comando: "head -1 group_vars/all/secretos.yml",
        patrones: ["ANSIBLE_VAULT"],
        prohibidos: ["(password|clave|token): *[a-zA-Z0-9]{4,}"],
        exito: "Secretos cifrados en el repositorio."
      },
      {
        id: "m4", tipo: "check", titulo: "La precedencia de variables",
        guia: "<p>Ansible tiene más de veinte niveles de precedencia. No hay que saberlos todos, pero sí el orden práctico: <code>defaults</code> pierde contra casi todo; <code>-e</code> en la línea de comandos gana contra todo.</p>",
        criterios: [
          "Sé dónde poner un valor por defecto y dónde uno obligatorio",
          "Sé por qué defaults/ es el sitio correcto para lo que se puede sobrescribir",
          "He comprobado que -e gana sobre group_vars"
        ]
      }
    ]
  },
  {
    id: "an-p3", titulo: "Despliegue sin cortes con Ansible", nivel: "Experto", desdeUnidad: 9, tiempo: "1 h",
    resumen: "Actualiza una flota de servidores por tandas, sacándolos del balanceador y comprobando antes de seguir.",
    objetivos: ["Desplegar por tandas", "Comprobar salud antes de continuar", "Parar a la primera señal de humo"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Por tandas, no todos a la vez",
        guia: "<p>Usa <code>serial: 1</code> (o un porcentaje) para actualizar de uno en uno.</p>" +
          "<p>Sin eso, Ansible actualiza los diez servidores a la vez y, si el despliegue está roto, te quedas sin servicio en todos a la vez.</p>",
        comando: "grep -n -E 'serial|max_fail' despliegue.yml",
        patrones: ["serial"],
        exito: "Despliegue por tandas."
      },
      {
        id: "m2", tipo: "salida", titulo: "Saca y devuelve del balanceador",
        guia: "<p>Antes de tocar un servidor, quítalo del balanceador; al terminar y comprobar que está sano, devuélvelo.</p>" +
          "<p><code>pre_tasks</code> y <code>post_tasks</code> son exactamente para esto.</p>",
        comando: "grep -n -E 'pre_tasks|post_tasks|wait_for|uri' despliegue.yml",
        patrones: ["(pre_tasks|post_tasks)", "(wait_for|uri)"],
        exito: "Ningún servidor recibe tráfico mientras se actualiza."
      },
      {
        id: "m3", tipo: "salida", titulo: "Para al primer fallo",
        guia: "<p>Pon <code>max_fail_percentage: 0</code>: si el primer servidor falla, el despliegue se detiene y los demás se quedan como estaban.</p>" +
          "<p>Es la diferencia entre un servidor caído y toda la flota caída.</p>",
        comando: "grep -n 'max_fail_percentage' despliegue.yml",
        patrones: ["max_fail_percentage"],
        exito: "Freno de emergencia puesto."
      },
      {
        id: "m4", tipo: "check", titulo: "Pruébalo rompiéndolo",
        guia: "<p>Haz que la comprobación de salud falle a propósito en el primer servidor y comprueba que el resto no se toca.</p>",
        criterios: [
          "El despliegue se detuvo en el primer servidor",
          "Los demás servidores siguen con la versión anterior",
          "Sé cómo volver atrás el que quedó a medias"
        ]
      }
    ]
  },
{
    id: "an-p4", titulo: "Un balanceador que se configura solo", nivel: "Intermedio", desdeUnidad: 6, tiempo: "1 h",
    resumen: "Genera la configuración de Nginx a partir del inventario: añades un servidor al grupo y el balanceador lo incorpora sin tocar la plantilla.",
    objetivos: ["Escribir plantillas Jinja2 con bucles y condiciones", "Usar hostvars y groups", "Recargar solo cuando cambia la configuración"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Inventario con dos grupos",
        guia: "<p>Crea un inventario con un grupo <code>balanceadores</code> (un host) y un grupo <code>api</code> (al menos dos hosts; valen contenedores o máquinas virtuales).</p>" +
          "<p>Enseña el árbol de grupos para comprobar que está bien.</p>",
        comando: "ansible-inventory -i inventario.ini --graph",
        patrones: ["@balanceadores", "@api"],
        exito: "Inventario listo."
      },
      {
        id: "m2", tipo: "salida", titulo: "La plantilla del upstream",
        guia: "<p>Escribe <code>templates/upstream.conf.j2</code> con un <code>{% for h in groups['api'] %}</code> que genere una línea <code>server</code> por cada host, usando la IP de sus facts.</p>" +
          "<p>Para que existan los facts de los hosts de <code>api</code>, el playbook debe recogerlos antes (un play previo sobre <code>api</code>).</p>",
        comando: "grep -n -E 'for .* in groups|endfor|hostvars' templates/upstream.conf.j2",
        patrones: ["for .* in groups", "endfor"],
        exito: "Plantilla generada desde el inventario."
      },
      {
        id: "m3", tipo: "salida", titulo: "Recarga solo si cambia",
        guia: "<p>La tarea de la plantilla debe notificar un handler que recargue Nginx. Ejecuta el playbook dos veces: la segunda no debe recargar nada.</p>",
        comando: "ansible-playbook -i inventario.ini balanceador.yml",
        patrones: ["changed=0"],
        prohibidos: ["failed=[1-9]", "RUNNING HANDLER"],
        pista: "Si el handler se ejecuta en la segunda pasada, algo en la plantilla cambia cada vez (¿una fecha?).",
        exito: "Idempotente: sin recargas innecesarias."
      },
      {
        id: "m4", tipo: "salida", titulo: "Añade un servidor",
        guia: "<p>Añade un host más al grupo <code>api</code> y ensaya con <code>--check --diff</code>: debe aparecer solo la línea nueva del upstream.</p>",
        comando: "ansible-playbook -i inventario.ini balanceador.yml --check --diff",
        patrones: ["\\+\\s*server "],
        exito: "El balanceador sigue al inventario, sin editar a mano."
      }
    ]
  },
  {
    id: "an-p5", titulo: "Un rol con pruebas y pipeline", nivel: "Experto", desdeUnidad: 10, tiempo: "1 h 30 min",
    resumen: "Convierte un rol en código de calidad: ansible-lint en perfil production, Molecule en dos distribuciones y un pipeline que lo comprueba en cada cambio.",
    objetivos: ["Pasar ansible-lint con el perfil production", "Probar un rol con Molecule, idempotencia incluida", "Automatizarlo en CI"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Lint limpio",
        guia: "<p>Crea un <code>.ansible-lint</code> con <code>profile: production</code> y corrige tu rol hasta que no haya fallos. Prueba <code>ansible-lint --fix</code> para lo automático (FQCN, formato).</p>",
        comando: "ansible-lint",
        patrones: ["(Passed|passed)"],
        prohibidos: ["Failed: [1-9]"],
        exito: "Rol limpio en el perfil más exigente."
      },
      {
        id: "m2", tipo: "salida", titulo: "Molecule en dos plataformas",
        guia: "<p>Configura <code>molecule/default/molecule.yml</code> con una plataforma Ubuntu y otra de la familia RHEL (Rocky o Alma).</p>",
        comando: "grep -n -E 'name:|image:' molecule/default/molecule.yml",
        patrones: ["(ubuntu|debian)", "(rocky|alma|rhel|ubi)"],
        exito: "El rol se probará en las dos familias."
      },
      {
        id: "m3", tipo: "salida", titulo: "El ciclo completo, idempotencia incluida",
        guia: "<p>Ejecuta <code>molecule test</code>. La fase <code>idempotence</code> debe pasar: la segunda aplicación del rol no cambia nada.</p>",
        comando: "molecule test",
        patrones: ["idempotence"],
        prohibidos: ["Idempotence test failed", "CRITICAL"],
        pista: "Si falla la idempotencia, Molecule te dice qué tarea: suele ser un command sin creates o changed_when.",
        exito: "Rol probado de verdad."
      },
      {
        id: "m4", tipo: "check", titulo: "En el pipeline",
        guia: "<p>Añade un flujo de CI (GitHub Actions, GitLab CI…) que instale versiones fijadas de ansible-core, ansible-lint y Molecule, y ejecute lint y <code>molecule test</code> en cada pull request.</p>",
        criterios: [
          "El pipeline se ejecuta en cada pull request",
          "Las versiones de las herramientas están fijadas en un fichero del repositorio",
          "He comprobado que un cambio no idempotente hace fallar el pipeline"
        ]
      }
    ]
  },
  {
    id: "an-p6", titulo: "Parcheo de flota con canario", nivel: "Maestro", desdeUnidad: 12, tiempo: "1 h 30 min",
    resumen: "Aplica actualizaciones de seguridad a una flota detrás de un balanceador: canario, tandas crecientes, reinicio solo cuando hace falta y marcha atrás si algo sale mal.",
    objetivos: ["Diseñar un despliegue rodante con canario", "Reiniciar de forma controlada con el módulo reboot", "Recuperarse de fallos con block y rescue"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Canario y tandas",
        guia: "<p>Escribe <code>parche.yml</code> con <code>serial</code> en forma de lista creciente (1, luego porcentajes) y <code>max_fail_percentage: 0</code>.</p>",
        comando: "grep -n -A3 -E 'serial|max_fail_percentage' parche.yml",
        patrones: ["serial", "max_fail_percentage: *0", "%"],
        exito: "Si el canario falla, no se toca nada más."
      },
      {
        id: "m2", tipo: "salida", titulo: "Reiniciar solo si hace falta",
        guia: "<p>Comprueba con <code>stat</code> si existe <code>/var/run/reboot-required</code> (o usa <code>needs-restarting -r</code> en RHEL) y reinicia con el módulo <code>reboot</code> solo en ese caso.</p>",
        comando: "grep -n -E 'reboot|reboot-required|needs-restarting' parche.yml",
        patrones: ["ansible.builtin.reboot", "(reboot-required|needs-restarting)"],
        prohibidos: ["shell: *reboot", "command: *reboot"],
        exito: "Reinicios controlados y solo los necesarios."
      },
      {
        id: "m3", tipo: "salida", titulo: "Fuera del balanceador mientras tanto",
        guia: "<p>Saca cada servidor del balanceador en <code>pre_tasks</code> (delegando en el balanceador o en localhost), comprueba la salud con <code>until</code> y devuélvelo en <code>post_tasks</code>.</p>",
        comando: "grep -n -E 'pre_tasks|post_tasks|delegate_to|until' parche.yml",
        patrones: ["pre_tasks", "post_tasks", "delegate_to", "until"],
        exito: "Los usuarios no ven los reinicios."
      },
      {
        id: "m4", tipo: "check", titulo: "Rómpelo a propósito",
        guia: "<p>Haz que la comprobación de salud falle en el primer servidor (por ejemplo, parando la app en un <code>post_task</code> de prueba) y lanza el parcheo.</p>",
        criterios: [
          "El despliegue se detuvo tras el canario",
          "El canario quedó fuera del balanceador y el resto de la flota intacta",
          "Tengo un block/rescue o un procedimiento escrito para devolver el canario a su estado"
        ]
      }
    ]
  }
],


/* ---------------- Kafka ---------------- */
kafka: [
{
    id: "kf-p1", titulo: "Produce y consume tu primer evento", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "45 min",
    resumen: "Levanta Kafka, crea un topic y ve con tus ojos qué significa que los mensajes se quedan.",
    objetivos: ["Levantar Kafka", "Crear topics y particiones", "Producir y consumir"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Kafka en marcha",
        guia: "<p>Levanta Kafka con Docker Compose (en modo KRaft ya no necesitas ZooKeeper) y comprueba que responde.</p>",
        comando: "docker compose ps",
        patrones: ["kafka", "(running|Up)"],
        prohibidos: ["(Exit|restarting)"],
        exito: "Kafka arriba."
      },
      {
        id: "m2", tipo: "term", titulo: "Crea el topic",
        guia: "<p>Crea un topic llamado <code>pedidos</code> con <b>3 particiones</b> y factor de replicación 1.</p>" +
          "<p>Las particiones son la unidad de paralelismo: nunca podrás tener más consumidores activos en un grupo que particiones.</p>",
        pista: "kafka-topics.sh --create --topic pedidos --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092",
        re: "^(?=.*--create)(?=.*--topic pedidos)(?=.*--partitions 3).*kafka-topics.*",
        sol: ["kafka-topics.sh --create --topic pedidos --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092"],
        salida: "Created topic pedidos.",
        exito: "Topic creado con tres particiones."
      },
      {
        id: "m3", tipo: "salida", titulo: "Produce y consume",
        guia: "<p>En una terminal, produce mensajes con la consola de productor. En otra, consúmelos con <code>--from-beginning</code>.</p>" +
          "<p>Fíjate en lo importante: <b>consumir no borra</b>. Puedes volver a leer desde el principio las veces que quieras. Kafka es un registro, no una cola que se vacía.</p>",
        comando: "kafka-console-consumer.sh --topic pedidos --from-beginning --bootstrap-server localhost:9092 --timeout-ms 5000",
        patrones: ["."],
        exito: "Mensajes leídos desde el principio."
      },
      {
        id: "m4", tipo: "salida", titulo: "El orden vive en la partición",
        guia: "<p>Produce mensajes <b>con clave</b> (<code>--property \"parse.key=true\"</code>). Todos los que compartan clave caen en la misma partición y mantienen el orden entre ellos.</p>" +
          "<p>Kafka no garantiza orden global, solo por partición. Por eso la clave se elige con cuidado: pedido_id sí, timestamp no.</p>",
        comando: "kafka-topics.sh --describe --topic pedidos --bootstrap-server localhost:9092",
        patrones: ["(Partition: *0|PartitionCount)"],
        exito: "Ya sabes dónde vive el orden en Kafka."
      }
    ]
  },
  {
    id: "kf-p2", titulo: "Grupos de consumo y reparto", nivel: "Intermedio", desdeUnidad: 3, tiempo: "50 min",
    resumen: "Varios consumidores repartiéndose el trabajo, y qué pasa cuando uno se cae.",
    objetivos: ["Entender los grupos de consumo", "Ver el rebalanceo", "Vigilar el retraso"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Dos consumidores, un grupo",
        guia: "<p>Arranca dos consumidores con el mismo <code>--group</code>. Cada uno se queda con unas particiones: el trabajo se reparte.</p>" +
          "<p>Con grupos distintos, en cambio, cada uno recibe <b>todos</b> los mensajes. Esa es la diferencia entre repartir trabajo y difundir.</p>",
        comando: "kafka-consumer-groups.sh --describe --group mi-grupo --bootstrap-server localhost:9092",
        patrones: ["(PARTITION|CURRENT-OFFSET)", "[0-9]+"],
        exito: "Reparto en marcha."
      },
      {
        id: "m2", tipo: "salida", titulo: "Mata uno y mira el rebalanceo",
        guia: "<p>Para uno de los consumidores. Sus particiones se reparten entre los que quedan, solos.</p>" +
          "<p>Durante el rebalanceo el consumo se detiene un momento: por eso los rebalanceos frecuentes son un problema de rendimiento.</p>",
        comando: "kafka-consumer-groups.sh --describe --group mi-grupo --bootstrap-server localhost:9092",
        patrones: ["(CONSUMER-ID|HOST|CLIENT-ID|PARTITION)"],
        exito: "Rebalanceo visto en directo."
      },
      {
        id: "m3", tipo: "salida", titulo: "El retraso (lag)",
        guia: "<p>Mira la columna <code>LAG</code>: cuántos mensajes le faltan por leer al grupo.</p>" +
          "<p>Es <b>la</b> métrica de Kafka. Si crece sin parar, tus consumidores van más lentos que los productores y el problema solo se agranda.</p>",
        comando: "kafka-consumer-groups.sh --describe --group mi-grupo --bootstrap-server localhost:9092",
        patrones: ["LAG"],
        exito: "Ya sabes qué vigilar en producción."
      },
      {
        id: "m4", tipo: "check", titulo: "Más consumidores que particiones",
        guia: "<p>Arranca cuatro consumidores en un topic de tres particiones. El cuarto se queda <b>sin nada que hacer</b>.</p>",
        criterios: [
          "He comprobado que el cuarto consumidor queda ocioso",
          "Sé por qué las particiones limitan el paralelismo",
          "Sé qué implica añadir particiones a un topic con datos"
        ]
      }
    ]
  },
  {
    id: "kf-p3", titulo: "Entregas, duplicados y reintentos", nivel: "Avanzado", desdeUnidad: 4, tiempo: "1 h",
    resumen: "Confirmaciones, mensajes repetidos y qué hacer con los que no se pueden procesar.",
    objetivos: ["Controlar la confirmación de offsets", "Diseñar consumidores idempotentes", "Usar una cola de descartes"],
    misiones: [
      {
        id: "m1", tipo: "info", titulo: "Las tres garantías",
        guia: "<ul><li><b>Como mucho una vez</b>: confirmas antes de procesar. Si te caes, pierdes el mensaje.</li>" +
          "<li><b>Al menos una vez</b>: confirmas después de procesar. Si te caes, lo repites. Es lo normal.</li>" +
          "<li><b>Exactamente una vez</b>: existe, pero cuesta y no cubre los efectos externos (si mandas un correo, ya está mandado).</li></ul>" +
          "<p>La solución práctica casi siempre es <b>al menos una vez</b> + consumidor idempotente: si llega repetido, no pasa nada.</p>"
      },
      {
        id: "m2", tipo: "salida", titulo: "Confirma después de procesar",
        guia: "<p>Desactiva el <code>enable.auto.commit</code> y confirma manualmente <b>después</b> de procesar con éxito.</p>" +
          "<p>Con la confirmación automática, un mensaje puede darse por procesado sin haberlo estado.</p>",
        comando: "grep -n -E 'auto.commit|commitSync|commit_async|commitAsync' *.*",
        patrones: ["(auto[._]commit|commitSync|commitAsync|commit[(])"],
        exito: "Control de la confirmación en tus manos."
      },
      {
        id: "m3", tipo: "salida", titulo: "Idempotencia de verdad",
        guia: "<p>Haz que procesar el mismo mensaje dos veces no cambie el resultado: guarda los ids ya procesados, o usa un <i>upsert</i> por clave.</p>" +
          "<p>Pruébalo: reprocesa a propósito el mismo mensaje y comprueba que el estado final es idéntico.</p>",
        comando: "(pega el estado antes y después de reprocesar)",
        patrones: ["."],
        exito: "Duplicados inofensivos. Con esto, «al menos una vez» ya es suficiente."
      },
      {
        id: "m4", tipo: "salida", titulo: "El mensaje envenenado",
        guia: "<p>Manda un mensaje que tu consumidor no pueda procesar (JSON roto). Sin protección, lo reintenta para siempre y <b>bloquea la partición</b>.</p>" +
          "<p>Solución: tras N intentos, a un topic de descartes (<i>dead letter</i>) y a seguir.</p>",
        comando: "kafka-console-consumer.sh --topic pedidos-dlq --from-beginning --bootstrap-server localhost:9092 --timeout-ms 5000",
        patrones: ["."],
        exito: "Mensaje apartado y consumo desbloqueado."
      }
    ]
  }
],


/* ---------------- Redis ---------------- */
redis: [
{
    id: "rs-p1", titulo: "Caché que de verdad acelera", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "45 min",
    resumen: "Pon Redis delante de una consulta lenta y mide la diferencia, con caducidad bien puesta.",
    objetivos: ["Usar GET, SET y TTL", "Aplicar el patrón cache-aside", "Medir la mejora"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "Guarda con caducidad",
        guia: "<p>Guarda la clave <code>usuario:1</code> con el valor <code>ana</code> y una caducidad de <b>60 segundos</b>, en un solo comando.</p>" +
          "<p>Una caché sin caducidad no es una caché: es una copia desactualizada que crece para siempre.</p>",
        pista: "SET clave valor EX segundos",
        re: "^set +usuario:1 +ana +ex +60$",
        sol: ["SET usuario:1 ana EX 60"],
        salida: "OK",
        exito: "Guardado con fecha de caducidad."
      },
      {
        id: "m2", tipo: "salida", titulo: "Comprueba lo que queda",
        guia: "<p><code>TTL clave</code> te dice los segundos que le quedan. Devuelve -1 si no caduca y -2 si la clave ya no existe.</p>",
        comando: "redis-cli TTL usuario:1",
        patrones: ["[0-9]+"],
        prohibidos: ["^-2"],
        exito: "Caducidad activa."
      },
      {
        id: "m3", tipo: "salida", titulo: "Cache-aside y la diferencia",
        guia: "<p>En tu aplicación: mira la caché; si no está, consulta la base de datos y guarda el resultado.</p>" +
          "<p>Mide una consulta sin caché y otra con caché. Pega los dos tiempos.</p>",
        comando: "(pega el tiempo sin caché y con caché)",
        patrones: ["[0-9]+([.,][0-9]+)? *(ms|s)"],
        exito: "Ahí está la razón por la que Redis está en todas partes."
      },
      {
        id: "m4", tipo: "check", titulo: "Lo difícil de las cachés",
        guia: "<p>Invalidar la caché es de los problemas clásicos de la informática. Piensa qué pasa cuando el dato cambia.</p>",
        criterios: [
          "Sé qué hago cuando el dato original cambia (invalidar o esperar al TTL)",
          "Sé qué es una estampida de caché y cómo evitarla",
          "Sé por qué no debo cachear datos personales sin pensarlo"
        ]
      }
    ]
  },
  {
    id: "rs-p2", titulo: "Estructuras más allá de la clave-valor", nivel: "Intermedio", desdeUnidad: 3, tiempo: "50 min",
    resumen: "Listas, conjuntos, hashes y sorted sets: cada uno resuelve un problema que con cadenas sería horrible.",
    objetivos: ["Elegir la estructura adecuada", "Construir un ranking", "Limitar peticiones por usuario"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "Un ranking con sorted set",
        guia: "<p>Añade a <code>ranking</code> el jugador <code>ana</code> con 50 puntos.</p>" +
          "<p>El sorted set mantiene todo ordenado por puntuación automáticamente: sacar el top 10 es instantáneo, sin ordenar nada.</p>",
        pista: "ZADD clave puntuacion miembro",
        re: "^zadd +ranking +50 +ana$",
        sol: ["ZADD ranking 50 ana"],
        salida: "(integer) 1",
        exito: "Ranking alimentado."
      },
      {
        id: "m2", tipo: "salida", titulo: "El top 3",
        guia: "<p>Añade varios jugadores y saca los tres mejores con sus puntuaciones (<code>ZREVRANGE ranking 0 2 WITHSCORES</code>).</p>",
        comando: "redis-cli ZREVRANGE ranking 0 2 WITHSCORES",
        patrones: ["[0-9]+"],
        exito: "Top 3 en una sola llamada, siempre ordenado."
      },
      {
        id: "m3", tipo: "salida", titulo: "Limitador de peticiones",
        guia: "<p>Implementa un límite por usuario: <code>INCR</code> de una clave <code>rate:usuario:minuto</code> y, si es la primera vez, ponle un <code>EXPIRE</code> de 60.</p>" +
          "<p>Si el contador pasa del límite, rechazas. Es el limitador más usado del mundo y son dos comandos.</p>",
        comando: "redis-cli INCR rate:prueba && redis-cli EXPIRE rate:prueba 60 && redis-cli TTL rate:prueba",
        patrones: ["[0-9]+"],
        exito: "Limitador funcionando."
      },
      {
        id: "m4", tipo: "check", titulo: "Qué estructura para qué",
        guia: "<p>Repasa: hash para objetos con campos, lista para colas, set para pertenencia, sorted set para rankings.</p>",
        criterios: [
          "Sé cuándo usar un hash en vez de guardar JSON en una cadena",
          "Sé por qué KEYS * es peligroso en producción (y qué usar en su lugar)",
          "Sé que Redis es de un solo hilo y qué implica eso"
        ]
      }
    ]
  },
  {
    id: "rs-p3", titulo: "Persistencia y qué pasa si se cae", nivel: "Avanzado", desdeUnidad: 4, tiempo: "50 min",
    resumen: "RDB, AOF y la pregunta incómoda: ¿cuántos datos estás dispuesto a perder?",
    objetivos: ["Entender RDB y AOF", "Configurar según el caso", "Probar la recuperación"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Qué tienes configurado",
        guia: "<p>Mira la configuración actual de persistencia.</p><ul>" +
          "<li><b>RDB</b>: foto cada X tiempo. Rápido, pero pierdes lo de entre fotos.</li>" +
          "<li><b>AOF</b>: registro de cada escritura. Pierdes casi nada, pero ocupa y cuesta más.</li></ul>",
        comando: "redis-cli CONFIG GET save && redis-cli CONFIG GET appendonly",
        patrones: ["(save|appendonly)"],
        exito: "Ya sabes qué política tienes."
      },
      {
        id: "m2", tipo: "salida", titulo: "La prueba del reinicio",
        guia: "<p>Escribe unas claves, reinicia Redis y comprueba qué sobrevive.</p>" +
          "<p>Esta es la prueba que casi nadie hace hasta el día del incidente.</p>",
        comando: "redis-cli DBSIZE",
        patrones: ["[0-9]+"],
        exito: "Ya sabes qué se salva y qué no en tu configuración."
      },
      {
        id: "m3", tipo: "salida", titulo: "Qué hacer cuando se llena",
        guia: "<p>Configura <code>maxmemory</code> y una política de expulsión (<code>maxmemory-policy</code>).</p>" +
          "<p>Para una caché, <code>allkeys-lru</code> tiene sentido: tira lo menos usado. Para datos que no puedes perder, <code>noeviction</code>… pero entonces Redis no es el sitio.</p>",
        comando: "redis-cli CONFIG GET maxmemory-policy",
        patrones: ["(allkeys|volatile|noeviction)"],
        exito: "Comportamiento definido antes de que se llene, no durante."
      },
      {
        id: "m4", tipo: "check", titulo: "Decide con criterio",
        guia: "<p>Responde por escrito: para tu caso, ¿cuántos segundos de datos puedes permitirte perder?</p>",
        criterios: [
          "Tengo una respuesta concreta a cuántos datos puedo perder",
          "Mi configuración de persistencia es coherente con esa respuesta",
          "Sé por qué usar Redis como base de datos principal es arriesgado"
        ]
      }
    ]
  }
],


/* ---------------- MongoDB ---------------- */
mongodb: [
{
    id: "mg-p1", titulo: "Tu primera colección", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "45 min",
    resumen: "Inserta, consulta y actualiza documentos, y entiende en qué se parece y en qué no a una tabla.",
    objetivos: ["Insertar y consultar documentos", "Filtrar con operadores", "Actualizar sin pisar campos"],
    misiones: [
      {
        id: "m1", tipo: "term", titulo: "Inserta un documento",
        guia: "<p>En <code>mongosh</code>, inserta en la colección <code>usuarios</code> un documento con <code>nombre: \"ana\"</code> y <code>edad: 30</code>.</p>" +
          "<p>No hace falta crear la colección antes: aparece al insertar. Y tampoco hay esquema fijo, lo cual es cómodo y peligroso a partes iguales.</p>",
        pista: "db.coleccion.insertOne({ ... })",
        re: "^db[.]usuarios[.]insertone[(] *[{].*nombre.*ana.*edad.*30.*[}] *[)];?$",
        sol: ["db.usuarios.insertOne({ nombre: 'ana', edad: 30 })"],
        salida: "{ acknowledged: true, insertedId: ObjectId('66f0a1b2c3d4e5f6a7b8c9d0') }",
        exito: "Documento insertado, con su _id generado automáticamente."
      },
      {
        id: "m2", tipo: "salida", titulo: "Consulta con operadores",
        guia: "<p>Busca los usuarios mayores de 25 años: <code>db.usuarios.find({ edad: { $gt: 25 } })</code>.</p>" +
          "<p>Los operadores van con <code>$</code>: <code>$gt</code>, <code>$lt</code>, <code>$in</code>, <code>$ne</code>…</p>",
        comando: "mongosh --quiet --eval 'db.usuarios.find({ edad: { $gt: 25 } }).toArray()'",
        patrones: ["(nombre|_id)"],
        exito: "Consulta con filtro funcionando."
      },
      {
        id: "m3", tipo: "salida", titulo: "Actualiza sin destrozar",
        guia: "<p>Actualiza la edad con <code>$set</code>. Y cuidado: si pasas el documento <b>sin</b> <code>$set</code>, Mongo <b>reemplaza el documento entero</b> y se lleva por delante los campos que no incluiste.</p>" +
          "<p>Ese es el error que a todo el mundo le cuesta una tarde la primera vez.</p>",
        comando: "mongosh --quiet --eval 'db.usuarios.updateOne({nombre:\"ana\"},{$set:{edad:31}}); db.usuarios.findOne({nombre:\"ana\"})'",
        patrones: ["31", "nombre"],
        exito: "Actualización parcial correcta."
      },
      {
        id: "m4", tipo: "check", titulo: "Documentos frente a tablas",
        guia: "<p>Piensa en las diferencias reales, no en el eslogan.</p>",
        criterios: [
          "Sé qué es el _id y quién lo genera",
          "Sé qué significa que no haya esquema y por qué eso puede volverse en tu contra",
          "Sé cuándo conviene incrustar datos y cuándo referenciarlos"
        ]
      }
    ]
  },
  {
    id: "mg-p2", titulo: "Agregaciones: los informes de verdad", nivel: "Intermedio", desdeUnidad: 3, tiempo: "55 min",
    resumen: "El pipeline de agregación, que es el equivalente al GROUP BY y bastante más.",
    objetivos: ["Encadenar etapas", "Agrupar y sumar", "Ordenar y limitar"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Gasto por cliente",
        guia: "<p>Con una colección de pedidos, agrupa por cliente y suma importes:</p>" +
          "<pre class=\"dg-pre\">db.pedidos.aggregate([\n  { $group: { _id: \"$cliente\", total: { $sum: \"$importe\" } } },\n  { $sort: { total: -1 } }\n])</pre>" +
          "<p>El pipeline es una tubería: cada etapa recibe lo que soltó la anterior.</p>",
        comando: "(pega el resultado de tu agregación)",
        patrones: ["(_id|total)"],
        exito: "Primera agregación funcionando."
      },
      {
        id: "m2", tipo: "salida", titulo: "Filtra antes de agrupar",
        guia: "<p>Añade un <code>$match</code> <b>al principio</b> del pipeline, no al final.</p>" +
          "<p>Filtrar primero reduce los documentos que pasan por las etapas siguientes, y además puede aprovechar un índice. Al final, ya has hecho todo el trabajo para nada.</p>",
        comando: "(pega tu pipeline completo)",
        patrones: ["[$]match", "[$]group"],
        exito: "Pipeline ordenado como debe: filtrar, agrupar, ordenar."
      },
      {
        id: "m3", tipo: "salida", titulo: "Une dos colecciones",
        guia: "<p>Usa <code>$lookup</code> para traer datos de otra colección (el «join» de Mongo).</p>" +
          "<p>Funciona, pero si lo necesitas en todas las consultas, quizá el modelo de datos debería tener esos datos incrustados.</p>",
        comando: "(pega el resultado con el lookup)",
        patrones: ["[[]|[{]"],
        exito: "Unión hecha. Y de paso, una pregunta sobre tu modelo de datos."
      },
      {
        id: "m4", tipo: "salida", titulo: "Mira el plan",
        guia: "<p><code>.explain(\"executionStats\")</code> te dice si usó índice o recorrió toda la colección (<code>COLLSCAN</code>).</p>",
        comando: "(pega la parte del plan con el stage)",
        patrones: ["(COLLSCAN|IXSCAN|stage)"],
        exito: "Ya sabes si tu consulta escala o solo funciona con pocos datos."
      }
    ]
  },
  {
    id: "mg-p3", titulo: "Índices y modelado que aguanta", nivel: "Avanzado", desdeUnidad: 4, tiempo: "1 h",
    resumen: "Decide qué incrustar y qué referenciar, y pon los índices que hacen que siga siendo rápido con datos de verdad.",
    objetivos: ["Modelar según las consultas", "Crear los índices correctos", "Conocer los límites"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "De COLLSCAN a IXSCAN",
        guia: "<p>Crea el índice de la consulta que más usas y comprueba el cambio en el plan.</p>",
        comando: "(pega el plan antes y después del índice)",
        patrones: ["IXSCAN"],
        exito: "Consulta por índice."
      },
      {
        id: "m2", tipo: "salida", titulo: "Índice compuesto y el orden",
        guia: "<p>Para una consulta que filtra por dos campos y ordena por un tercero, el orden de las columnas del índice importa.</p>" +
          "<p>La regla práctica: <b>igualdad, orden, rango</b> (ESR). Primero los campos de igualdad, luego el de ordenación, luego el de rango.</p>",
        comando: "mongosh --quiet --eval 'db.pedidos.getIndexes()'",
        patrones: ["(key|name)"],
        exito: "Índice compuesto con el orden correcto."
      },
      {
        id: "m3", tipo: "check", titulo: "Incrustar o referenciar",
        guia: "<p>En Mongo no se modela por las entidades, se modela por <b>las consultas</b>.</p><ul>" +
          "<li>Se consulta siempre junto y no crece sin límite → incrusta.</li>" +
          "<li>Crece sin límite (comentarios, eventos) o se consulta aparte → referencia.</li></ul>" +
          "<p>Y recuerda el límite duro: un documento no puede pasar de <b>16 MB</b>.</p>",
        criterios: [
          "Tengo escrito qué incrusto y qué referencio, y por qué",
          "Sé cuál es el límite de tamaño de un documento",
          "Ninguna parte de mi modelo crece sin límite dentro de un documento"
        ]
      },
      {
        id: "m4", tipo: "check", titulo: "Lo que no se puede ignorar",
        guia: "<p>Dos cosas que en producción importan mucho.</p>",
        criterios: [
          "Sé qué es el write concern y qué significa w:1 frente a majority",
          "Sé que las transacciones existen pero cuestan, y cuándo hacen falta",
          "Sé por qué un índice de más también penaliza las escrituras"
        ]
      }
    ]
  }
],

html: [
{
    id: "ht-p1", titulo: "Tu primera página con estructura de verdad", nivel: "Fundamentos", desdeUnidad: 2, tiempo: "45 min",
    resumen: "Una página sobre un tema que te guste, escrita a mano: documento completo, títulos con jerarquía, listas, enlaces e imágenes bien puestas. Sin CSS todavía: que el HTML se sostenga solo.",
    objetivos: ["Escribir un documento HTML completo y válido", "Jerarquizar el contenido con títulos y listas", "Enlazar e insertar imágenes accesibles y sin saltos"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "El esqueleto completo",
        guia: "<p>Crea <code>index.html</code> con <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html lang=\"es\"&gt;</code>, y en el head la codificación, el viewport y un <code>&lt;title&gt;</code> que diga de qué va la página (no «Home»).</p>" +
          "<p>Son cuatro líneas que casi nadie recuerda y que evitan tildes rotas, páginas diminutas en el móvil y el modo quirks.</p>",
        comando: "head -n 15 index.html",
        patrones: ["<!doctype html>", "<html[^>]+lang=\"es\"", "<meta charset=\"?utf-8", "name=\"viewport\"", "<title>[^<]{5,}</title>"],
        prohibidos: ["maximum-scale", "user-scalable *= *no", "<title>(home|inicio|document|untitled)</title>"],
        pista: "La meta viewport estándar es width=device-width, initial-scale=1.",
        exito: "Documento en modo estándar, en español y listo para móvil."
      },
      {
        id: "m2", tipo: "salida", titulo: "Títulos y listas con sentido",
        guia: "<p>Un solo <code>&lt;h1&gt;</code> con el tema, al menos dos apartados con <code>&lt;h2&gt;</code> y, dentro de uno, un <code>&lt;h3&gt;</code>. Añade una lista ordenada (unos pasos) y otra sin orden.</p>" +
          "<p>Lista los títulos y listas para comprobar que no saltas niveles.</p>",
        comando: "grep -n -o -E '<(h[1-6]|ul|ol)[ >]' index.html",
        patrones: ["<h1", "<h2", "<h3", "<ol", "<ul"],
        exito: "Un índice que un lector de pantalla puede recorrer con la tecla H."
      },
      {
        id: "m3", tipo: "salida", titulo: "Imágenes que no hacen saltar la página",
        guia: "<p>Inserta al menos dos imágenes con <code>alt</code> descriptivo (o <code>alt=\"\"</code> si son decorativas) y con <code>width</code> y <code>height</code>. Si alguna está fuera de la primera pantalla, ponle <code>loading=\"lazy\"</code>.</p>" +
          "<p>Una de ellas dentro de <code>&lt;figure&gt;</code> con su <code>&lt;figcaption&gt;</code>.</p>",
        comando: "grep -n -E '<img|figcaption' index.html",
        patrones: ["<img[^>]+alt=", "<img[^>]+width=\"?[0-9]+", "<img[^>]+height=\"?[0-9]+", "<figcaption"],
        prohibidos: ["alt=\"(imagen|foto|image|img)\""],
        pista: "width y height en píxeles, sin unidad: son la proporción, no el tamaño final.",
        exito: "Imágenes accesibles y sin saltos de maquetación."
      },
      {
        id: "m4", tipo: "salida", titulo: "Enlaces que se entienden",
        guia: "<p>Añade un índice al principio con enlaces a cada apartado (<code>href=\"#id\"</code>), un enlace externo y un <code>mailto:</code>. Ninguno puede decir «haz clic aquí» ni «aquí».</p>",
        comando: "grep -n -o -E '<a [^>]*>[^<]*</a>' index.html",
        patrones: ["href=\"#[a-z]", "href=\"https?://", "href=\"mailto:"],
        prohibidos: [">\\s*(haz clic aquí|pulsa aquí|aquí|click here)\\s*<"],
        exito: "Enlaces con sentido fuera de contexto, como los oye quien usa lector de pantalla."
      },
      {
        id: "m5", tipo: "check", titulo: "Pásala por el validador",
        guia: "<p>Sube el fichero a <code>validator.w3.org/nu</code> (pestaña «Validate by File Upload») y corrige lo que salga. Después ábrela en el navegador con el CSS desactivado: debe entenderse igual.</p>",
        criterios: [
          "El validador no muestra errores",
          "La página se lee bien de arriba abajo sin estilos",
          "Los enlaces del índice llevan a cada apartado"
        ]
      }
    ]
  },
  {
    id: "ht-p2", titulo: "Formulario de inscripción accesible y validado", nivel: "Intermedio", desdeUnidad: 4, tiempo: "1 h",
    resumen: "El formulario de inscripción a un curso: controles adecuados, autocompletado, validación nativa, un DNI comprobado de verdad y errores que se entienden con y sin lector de pantalla.",
    objetivos: ["Elegir el control y el autocomplete correctos para cada dato", "Validar con restricciones nativas y la Constraint Validation API", "Mostrar errores accesibles"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Campos con etiqueta, nombre y autocompletado",
        guia: "<p>Crea <code>inscripcion.html</code> con un <code>form</code> (<code>method=\"post\"</code>) que pida nombre, email, teléfono, DNI, fecha de nacimiento y turno (mañana o tarde, con radios en un <code>fieldset</code>).</p>" +
          "<p>Cada campo con su <code>label for</code>, su <code>name</code> y el <code>autocomplete</code> que le toque (<code>name</code>, <code>email</code>, <code>tel</code>, <code>bday</code>).</p>",
        comando: "grep -n -E '<(form|label|input|fieldset|legend)' inscripcion.html",
        patrones: ["method=\"post\"", "<label for=", "autocomplete=\"email\"", "autocomplete=\"tel\"", "type=\"email\"", "type=\"date\"", "<fieldset", "<legend", "type=\"radio\""],
        prohibidos: ["type=\"number\"[^>]*(tel|dni|telefono)"],
        pista: "El teléfono es type=\"tel\", no number: no es una cantidad.",
        exito: "Formulario que el navegador sabe rellenar y el lector sabe anunciar."
      },
      {
        id: "m2", tipo: "codigo", titulo: "Comprueba el DNI de verdad",
        guia: "<p>El <code>pattern</code> solo mira el formato. La letra del DNI se calcula: el número módulo 23 da la posición en <code>TRWAGMYFPDXBNJZSQVHLCKE</code>. En un NIE, la X, Y o Z inicial valen 0, 1 y 2.</p>" +
          "<p>Escribe la función que usarás con <code>setCustomValidity</code>: por cada línea de la entrada imprime <code>válido</code> o <code>inválido</code>. Acepta minúsculas; el formato es 8 cifras (o X/Y/Z + 7 cifras) y una letra.</p>",
        lenguaje: "js",
        plantilla: "const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").filter(Boolean);\nconst LETRAS = \"TRWAGMYFPDXBNJZSQVHLCKE\";\n// imprime válido o inválido por cada línea\n",
        pruebas: [
          { entrada: "12345678Z\n12345678A", salida: "válido\ninválido" },
          { entrada: "x1234567l\n1234567Z", salida: "válido\ninválido" },
          { entrada: "Y0000000Z\nZ7654321A\n00000000T", salida: "válido\ninválido\nválido", oculta: true }
        ],
        solucion: "const lineas = require(\"fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").filter(Boolean);\nconst LETRAS = \"TRWAGMYFPDXBNJZSQVHLCKE\";\nfunction dniValido(s) {\n  s = s.trim().toUpperCase();\n  if (!/^[0-9XYZ][0-9]{7}[A-Z]$/.test(s)) return false;\n  const n = Number(s.slice(0, 8).replace(/^[XYZ]/, c => \"XYZ\".indexOf(c)));\n  return LETRAS[n % 23] === s[8];\n}\nfor (const l of lineas) console.log(dniValido(l) ? \"válido\" : \"inválido\");",
        exito: "Letra comprobada. En la página, llama a setCustomValidity(dniValido(v) ? \"\" : \"La letra del DNI no corresponde al número\") en cada input."
      },
      {
        id: "m3", tipo: "salida", titulo: "Errores que se oyen y se leen",
        guia: "<p>Desactiva la validación al enviar con <code>novalidate</code> y pinta tú los errores: cada campo erróneo con <code>aria-invalid=\"true\"</code> y un mensaje visible asociado con <code>aria-describedby</code>. Al enviar con errores, un resumen con <code>role=\"alert\"</code> y enlaces a cada campo.</p>" +
          "<p>Usa <code>checkValidity()</code> y <code>validity</code> para no reescribir las reglas.</p>",
        comando: "grep -n -o -E 'novalidate|aria-invalid|aria-describedby|role=\"alert\"|checkValidity|setCustomValidity' inscripcion.html",
        patrones: ["novalidate", "aria-invalid", "aria-describedby", "role=\"alert\"", "(checkValidity|reportValidity)", "setCustomValidity"],
        exito: "Errores perceptibles sin depender del color ni de la vista."
      },
      {
        id: "m4", tipo: "check", titulo: "Rellénalo como lo haría otra persona",
        guia: "<p>Rellena y envía el formulario solo con el teclado, luego con NVDA o VoiceOver, y por último en el móvil.</p>",
        criterios: [
          "Puedo rellenarlo y enviarlo sin ratón, y el foco va al resumen de errores",
          "El lector anuncia el nombre, la ayuda y el error de cada campo",
          "En el móvil sale el teclado adecuado en email, teléfono y fecha",
          "El navegador me ofrece autocompletar nombre, email y teléfono"
        ]
      }
    ]
  },
  {
    id: "ht-p3", titulo: "Componentes interactivos sin librerías", nivel: "Avanzado", desdeUnidad: 6, tiempo: "1 h",
    resumen: "La página de ayuda de una aplicación: preguntas frecuentes desplegables, un menú de usuario, una confirmación modal y navegación por teclado impecable, todo con elementos nativos y el mínimo JavaScript.",
    objetivos: ["Usar details, dialog y popover en lugar de widgets propios", "Gestionar el foco con intención", "Auditar con teclado, lector de pantalla y axe"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Landmarks y salto al contenido",
        guia: "<p>Crea <code>ayuda.html</code> con <code>header</code>, un <code>nav</code> con <code>aria-label</code>, <code>main</code> y <code>footer</code>. Lo primero del body: un enlace «Saltar al contenido» que lleve al main.</p>",
        comando: "grep -n -o -E '<(header|nav|main|footer)[^>]*>|href=\"#[a-z-]+\"' ayuda.html",
        patrones: ["<header", "<nav[^>]+aria-label", "<main[^>]+id=", "<footer", "href=\"#"],
        exito: "Página que se hojea por regiones."
      },
      {
        id: "m2", tipo: "salida", titulo: "Preguntas frecuentes en acordeón",
        guia: "<p>Al menos cuatro preguntas con <code>details</code> y <code>summary</code>, todas con el mismo <code>name</code> para que solo haya una abierta.</p>" +
          "<p>Cero JavaScript en esta parte.</p>",
        comando: "grep -n -E '<details|<summary' ayuda.html",
        patrones: ["(<details[^>]+name=\"[a-z-]+\"[\\s\\S]*){4}", "<summary"],
        exito: "Acordeón accesible con teclado sin escribir ni un manejador."
      },
      {
        id: "m3", tipo: "salida", titulo: "Menú de usuario con popover y confirmación con dialog",
        guia: "<p>Un botón «Mi cuenta» con <code>popovertarget</code> que abre un menú (<code>popover</code>) con tres enlaces. Uno de ellos, «Cerrar sesión», abre un <code>dialog</code> con <code>showModal()</code> y un <code>&lt;form method=\"dialog\"&gt;</code> con «Cancelar» (con <code>autofocus</code>) y «Cerrar sesión».</p>",
        comando: "grep -n -o -E 'popovertarget|popover|<dialog|showModal|method=\"dialog\"|autofocus|returnValue' ayuda.html",
        patrones: ["popovertarget", "<dialog", "showModal", "method=\"dialog\"", "autofocus"],
        prohibidos: ["z-index: *9999"],
        exito: "Capa superior, Escape, foco dentro y de vuelta: gratis."
      },
      {
        id: "m4", tipo: "salida", titulo: "Pasa axe",
        guia: "<p>Sirve la página en local y pásale axe desde la terminal (<code>npx @axe-core/cli</code>) o la extensión axe DevTools. Arregla lo que salga y pega la salida final.</p>",
        comando: "npx @axe-core/cli http://localhost:8080/ayuda.html",
        patrones: ["0 violations"],
        pista: "Sirve la carpeta con npx serve -l 8080 (o cualquier servidor estático) antes de lanzar axe.",
        exito: "Sin violaciones automáticas. Ahora falta lo que axe no ve."
      },
      {
        id: "m5", tipo: "check", titulo: "Lo que ninguna herramienta comprueba",
        guia: "<p>Recorre la página con el teclado y con un lector de pantalla (NVDA con Firefox o Chrome, o VoiceOver con Safari).</p>",
        criterios: [
          "El enlace de salto es lo primero que alcanza el tabulador y se ve al recibir el foco",
          "El menú se cierra con Escape o al pulsar fuera, y el foco vuelve a «Mi cuenta»",
          "Con el modal abierto no puedo tabular a la página de detrás",
          "Al cerrar el modal, el foco vuelve al enlace que lo abrió",
          "Con la tecla D del lector salto entre las regiones y con H entre los títulos"
        ]
      }
    ]
  },
  {
    id: "ht-p4", titulo: "Página lista para producción", nivel: "Experto", desdeUnidad: 8, tiempo: "1 h 30 min",
    resumen: "La landing de un curso preparada como la de un equipo profesional: SEO técnico, vista previa al compartir, datos estructurados, imágenes responsive, carga optimizada, un Web Component y validación automática.",
    objetivos: ["Completar el head para buscadores y redes", "Optimizar la carga para Core Web Vitals", "Crear un custom element con mejora progresiva", "Automatizar la validación"],
    misiones: [
      {
        id: "m1", tipo: "salida", titulo: "Head para buscadores y redes",
        guia: "<p>En <code>landing.html</code>: <code>title</code> y <code>meta description</code> propios, <code>link rel=\"canonical\"</code> con URL absoluta, las etiquetas Open Graph (<code>og:title</code>, <code>og:description</code>, <code>og:image</code> absoluta, <code>og:url</code>) y <code>twitter:card</code>.</p>",
        comando: "grep -n -E 'canonical|og:|twitter:|name=\"description\"' landing.html",
        patrones: ["rel=\"canonical\" href=\"https://", "property=\"og:title\"", "property=\"og:image\" content=\"https://", "name=\"twitter:card\"", "name=\"description\""],
        prohibidos: ["name=\"robots\" content=\"[^\"]*noindex", "og:image\" content=\"/"],
        exito: "Encontrable y con buena pinta al compartirla."
      },
      {
        id: "m2", tipo: "salida", titulo: "Datos estructurados",
        guia: "<p>Añade un bloque <code>application/ld+json</code> de tipo <code>Course</code> con <code>name</code>, <code>description</code> y <code>provider</code> (una <code>Organization</code>). Todo lo marcado debe verse en la página.</p>" +
          "<p>Compruébalo en la Prueba de resultados enriquecidos de Google o en <code>validator.schema.org</code>.</p>",
        comando: "grep -n -A 12 'application/ld+json' landing.html",
        patrones: ["application/ld\\+json", "\"@context\": *\"https://schema.org\"", "\"@type\": *\"Course\"", "\"provider\""],
        exito: "La página se describe a sí misma a los buscadores."
      },
      {
        id: "m3", tipo: "salida", titulo: "Imagen principal y scripts sin bloqueos",
        guia: "<p>La imagen de cabecera en un <code>picture</code> con fuentes AVIF y WebP, <code>srcset</code> con descriptores <code>w</code>, <code>sizes</code>, dimensiones y <code>fetchpriority=\"high\"</code> (y sin lazy). El resto de imágenes, con <code>loading=\"lazy\"</code>.</p>" +
          "<p>Todos los scripts con <code>defer</code> o <code>type=\"module\"</code>.</p>",
        comando: "grep -n -E '<picture|<source|<img|<script' landing.html",
        patrones: ["<picture", "type=\"image/avif\"", "srcset=\"[^\"]+ [0-9]+w", "sizes=\"", "fetchpriority=\"high\""],
        prohibidos: ["fetchpriority=\"high\"[^>]*loading=\"lazy\"", "loading=\"lazy\"[^>]*fetchpriority=\"high\"", "<script src=\"[^\"]+\"></script>"],
        pista: "El prohibido del final atrapa scripts clásicos sin defer ni type=module.",
        exito: "LCP a favor: la imagen principal se pide la primera y nada bloquea el análisis."
      },
      {
        id: "m4", tipo: "salida", titulo: "Un Web Component con mejora progresiva",
        guia: "<p>Crea <code>&lt;cuenta-atras fin=\"2026-12-01T09:00\"&gt;</code> que muestre cuánto falta para el inicio del curso. Dentro, antes de que cargue el JS, debe haber un texto útil con la fecha (<code>&lt;time datetime&gt;</code>).</p>" +
          "<p>La clase extiende <code>HTMLElement</code>, observa el atributo <code>fin</code> y limpia su intervalo en <code>disconnectedCallback</code>.</p>",
        comando: "grep -n -E 'customElements.define|observedAttributes|connectedCallback|disconnectedCallback|clearInterval|<cuenta-atras|<time' landing.html js/*.js",
        patrones: ["customElements\\.define\\(\"cuenta-atras\"", "observedAttributes", "disconnectedCallback", "clearInterval", "<time datetime="],
        exito: "Componente nativo que no deja la página vacía si falla el JavaScript."
      },
      {
        id: "m5", tipo: "salida", titulo: "Validación automática",
        guia: "<p>Valida con html-validate (la configuración recomendada ya incluye reglas de accesibilidad) y deja la página sin errores. Este comando es el que pondrías en el pipeline de CI.</p>",
        comando: "npx html-validate landing.html && echo VALIDA",
        patrones: ["VALIDA"],
        prohibidos: ["error"],
        exito: "Validación en verde: lista para ir a CI."
      },
      {
        id: "m6", tipo: "check", titulo: "Mídelo",
        guia: "<p>Pasa Lighthouse en modo móvil y revisa el panel Rendimiento de DevTools con la CPU ralentizada 4×.</p>",
        criterios: [
          "LCP por debajo de 2,5 s y CLS por debajo de 0,1 en Lighthouse móvil",
          "Accesibilidad, buenas prácticas y SEO a 100 (y sé que eso no lo es todo)",
          "La vista previa se ve bien en el depurador de Open Graph de una red social",
          "Con JavaScript desactivado, la página se entiende y la fecha de inicio se ve"
        ]
      }
    ]
  }
]

};
