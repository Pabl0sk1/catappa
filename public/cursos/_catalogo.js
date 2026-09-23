/* =====================================================================
   Ficha de cada curso (aspecto en el catálogo) y rutas de carrera.
   Un curso solo aparece si tiene contenido (ficheros <id>-uN.js).
   niveles: nivel de cada unidad cuando la propia unidad no lo declara.
   ===================================================================== */
window.CURSOS_META = [
  {
    id: "linux", titulo: "Linux", categoria: "Sistemas",
    lema: "El sistema operativo de los servidores, de cero a administración experta",
    descripcion: "Terminal, sistema de ficheros, permisos, procesos, bash scripting, redes, systemd, almacenamiento, seguridad y rendimiento. La base de todo lo demás.",
    nivel: "Desde cero · hasta maestro", horas: 22, color: "#f5b642", glifo: "pinguino", logo: "logos/linux.svg",
    temas: ["bash", "shell", "terminal", "permisos", "systemd", "procesos", "scripting", "ssh", "kernel"]
  },
  {
    id: "git", titulo: "Git y GitHub", categoria: "Control de versiones",
    lema: "Control de versiones como en un equipo real",
    descripcion: "Las tres zonas, commits, deshacer sin miedo, ramas, conflictos, rebase, remotos, Pull Requests, code review, flujos de trabajo y releases.",
    nivel: "Desde cero · hasta maestro", horas: 10, color: "#f26d6d", glifo: "branch", logo: "logos/git.svg",
    niveles: ["Fundamentos", "Fundamentos", "Intermedio", "Intermedio", "Intermedio", "Avanzado", "Experto"],
    temas: ["github", "commit", "rama", "merge", "rebase", "pull request"]
  },
  {
    id: "docker", titulo: "Docker", categoria: "Contenedores",
    lema: "Contenedores desde cero hasta producción",
    descripcion: "Qué es un contenedor de verdad, comandos, Linux por dentro, Dockerfile y multi-stage, YAML, Compose, redes, volúmenes, despliegue en servidor y preparación de entrevista.",
    nivel: "Desde cero · hasta maestro", horas: 12, color: "#7aa2f7", glifo: "container", logo: "logos/docker.svg",
    niveles: ["Fundamentos", "Fundamentos", "Fundamentos", "Intermedio", "Intermedio", "Intermedio", "Avanzado", "Experto"],
    temas: ["contenedor", "imagen", "dockerfile", "compose", "volumen"]
  },
  {
    id: "kubernetes", titulo: "Kubernetes", categoria: "Contenedores",
    lema: "Orquestación de contenedores, de tu primer pod a operar clústeres",
    descripcion: "Arquitectura, pods, deployments, services, ingress, configuración, almacenamiento, scheduling, autoscaling, RBAC, redes, Helm, operadores, GitOps y operación en producción.",
    nivel: "Desde cero · hasta maestro", horas: 24, color: "#6d9cf2", glifo: "timon", logo: "logos/kubernetes.svg",
    temas: ["k8s", "kubectl", "pod", "helm", "ingress", "operador", "gitops"]
  },
  {
    id: "devops", titulo: "DevOps", categoria: "Infraestructura",
    lema: "Del commit a producción, y mantenerlo vivo",
    descripcion: "Cultura y métricas DORA, Linux de servidor, CI/CD con GitHub Actions, Terraform y Ansible, Kubernetes, observabilidad, SLOs, incidentes, cloud y seguridad.",
    nivel: "Desde cero · hasta maestro", horas: 14, color: "#7fd1b9", glifo: "pipeline", logo: "logos/devops.svg",
    niveles: ["Fundamentos", "Fundamentos", "Intermedio", "Intermedio", "Avanzado", "Avanzado", "Experto"],
    temas: ["ci", "cd", "pipeline", "sre", "observabilidad"]
  },
  {
    id: "jenkins", titulo: "Jenkins", categoria: "Infraestructura",
    lema: "De qué es la integración continua al pipeline de producción",
    descripcion: "Desde qué es un repositorio y qué significa integrar código: CI y CD explicadas paso a paso, instalar Jenkins con Docker, tu primer job, pipelines en un Jenkinsfile, el pipeline completo de una API Spring Boot, agentes y paralelismo, multibranch, librerías compartidas, seguridad, operación y simulacro de entrevista.",
    nivel: "Desde cero · hasta maestro", horas: 8, color: "#d24939", glifo: "pipeline", logo: "logos/jenkins.svg",
    temas: ["ci", "cd", "jenkinsfile", "pipeline", "groovy", "integracion continua", "entrega continua"]
  },
  {
    id: "terraform", titulo: "Terraform", categoria: "Infraestructura",
    lema: "Infraestructura como código a nivel profesional",
    descripcion: "HCL, providers, recursos, estado, variables, módulos, workspaces, backends remotos, importación, pruebas, políticas y patrones para equipos grandes.",
    nivel: "Desde cero · hasta maestro", horas: 14, color: "#b58cf5", glifo: "capas", logo: "logos/terraform.svg",
    temas: ["iac", "hcl", "opentofu", "estado", "modulos"]
  },
  {
    id: "aws", titulo: "AWS", categoria: "Cloud",
    lema: "La nube más usada, servicio a servicio",
    descripcion: "Cuentas e IAM, redes VPC, EC2, almacenamiento S3 y EBS, bases de datos, contenedores, serverless, observabilidad, costes, seguridad y arquitecturas bien diseñadas.",
    nivel: "Desde cero · hasta maestro", horas: 22, color: "#f29e4c", glifo: "nube", logo: "logos/aws.svg",
    temas: ["amazon", "ec2", "s3", "iam", "vpc", "lambda", "rds", "eks"]
  },
  {
    id: "redes", titulo: "Redes", categoria: "Sistemas",
    lema: "Cómo viaja un paquete de verdad",
    descripcion: "Modelo OSI y TCP/IP, direcciones IP y subredes, TCP y UDP, DNS, HTTP y TLS, enrutamiento, NAT, cortafuegos, balanceo y diagnóstico de problemas de red.",
    nivel: "Desde cero · hasta maestro", horas: 14, color: "#6dd3f2", glifo: "red",
    temas: ["tcp", "ip", "dns", "http", "tls", "subred", "cidr", "osi"]
  },
  {
    id: "sql", titulo: "PostgreSQL", categoria: "Datos",
    lema: "Bases de datos relacionales, de SELECT a tuning",
    descripcion: "Consultas, joins, agregaciones, subconsultas y CTEs, funciones de ventana, diseño y normalización, índices, transacciones, planes de ejecución, rendimiento y operación de PostgreSQL.",
    nivel: "Desde cero · hasta maestro", horas: 20, color: "#5b9bd5", glifo: "datos", logo: "logos/sql.svg",
    temas: ["postgres", "base de datos", "select", "join", "indice", "transaccion"]
  },
  {
    id: "java", titulo: "Java", categoria: "Lenguajes",
    lema: "El lenguaje, a fondo: de variables a la JVM",
    descripcion: "Sintaxis, orientación a objetos, colecciones, genéricos, excepciones, lambdas y streams, records y Java moderno, concurrencia, la JVM, memoria y rendimiento.",
    nivel: "Desde cero · hasta maestro", horas: 26, color: "#e07b53", glifo: "taza", logo: "logos/java.svg",
    temas: ["jvm", "oop", "streams", "lambda", "hilos", "gc", "colecciones"]
  },
  {
    id: "spring", titulo: "Spring Boot", categoria: "Backend",
    lema: "APIs Java de producción",
    descripcion: "Inyección de dependencias, APIs REST, validación, JPA y Hibernate, transacciones, seguridad con JWT, pruebas, configuración, Actuator, observabilidad y despliegue.",
    nivel: "Desde cero · hasta maestro", horas: 20, color: "#8fd16a", glifo: "hoja", logo: "logos/spring.svg",
    temas: ["spring", "rest", "jpa", "hibernate", "security", "jwt", "api"]
  },
  {
    id: "python", titulo: "Python", categoria: "Lenguajes",
    lema: "El lenguaje más versátil, de cero a experto",
    descripcion: "Sintaxis, estructuras de datos, funciones, módulos, POO, errores, ficheros, iteradores y generadores, decoradores, tipado, asincronía, pruebas y automatización.",
    nivel: "Desde cero · hasta maestro", horas: 20, color: "#f2d16d", glifo: "serpiente", logo: "logos/python.svg",
    temas: ["py", "scripting", "automatizacion", "pip", "venv", "asyncio"]
  },
  {
    id: "html", titulo: "HTML", categoria: "Frontend",
    lema: "La estructura de toda página web",
    descripcion: "Cómo convierte el navegador el HTML en DOM, estructura del documento y head, texto semántico, enlaces y rutas, imágenes responsive (srcset, sizes, picture), audio, vídeo e iframes, SVG, landmarks y tablas accesibles, formularios completos con validación nativa y Constraint Validation API, details, dialog y popover, accesibilidad a fondo (WCAG 2.2, ARIA, teclado, lectores de pantalla), SEO técnico, Open Graph y JSON-LD, carga de recursos y Core Web Vitals, template y Web Components.",
    nivel: "Desde cero · hasta maestro", horas: 16, color: "#f0875a", glifo: "pagina", logo: "logos/html.svg",
    temas: ["html", "semantico", "formulario", "accesibilidad", "seo", "frontend"]
  },
  {
    id: "css", titulo: "CSS", categoria: "Frontend",
    lema: "El aspecto de la web, de los selectores a las interfaces modernas",
    descripcion: "Cascada completa con @layer, todos los selectores (:is, :where, :has), color moderno (oklch, color-mix), unidades y tipografía fluida, modelo de caja y flujo, posicionamiento y apilamiento, Flexbox y Grid a fondo con subgrid, responsive con container queries, variables y temas, animaciones y view transitions, arquitectura, rendimiento y depuración.",
    nivel: "Desde cero · hasta maestro", horas: 24, color: "#5b8def", glifo: "pagina", logo: "logos/css.svg",
    temas: ["css", "flexbox", "grid", "responsive", "animacion", "frontend"]
  },
  {
    id: "javascript", titulo: "JavaScript", categoria: "Lenguajes",
    lema: "El lenguaje de la web, entendido de verdad",
    descripcion: "Tipos, funciones y closures, objetos y prototipos, arrays, el DOM, asincronía con promesas y async/await, el event loop, módulos y patrones modernos.",
    nivel: "Desde cero · hasta maestro", horas: 20, color: "#e8d44d", glifo: "llaves", logo: "logos/javascript.svg",
    temas: ["js", "ecmascript", "dom", "promesas", "async", "closure", "event loop"]
  },
  {
    id: "typescript", titulo: "TypeScript", categoria: "Lenguajes",
    lema: "JavaScript con tipos, hasta el sistema de tipos avanzado",
    descripcion: "Tipos básicos, interfaces, uniones, narrowing, genéricos, tipos utilitarios, tipos condicionales y mapeados, configuración del compilador y patrones en proyectos reales.",
    nivel: "Desde cero · hasta maestro", horas: 12, color: "#4f8fd9", glifo: "code", logo: "logos/typescript.svg",
    temas: ["ts", "tipos", "genericos", "interfaces", "tsconfig"]
  },
  {
    id: "react", titulo: "React", categoria: "Frontend",
    lema: "Interfaces modernas con componentes",
    descripcion: "JSX, componentes y props, estado, efectos, formularios, listas, hooks personalizados, contexto, rendimiento, enrutado, obtención de datos y pruebas.",
    nivel: "Desde cero · hasta maestro", horas: 16, color: "#61dafb", glifo: "atomo", logo: "logos/react.svg",
    temas: ["jsx", "hooks", "componentes", "estado", "useeffect", "frontend"]
  },
  {
    id: "nodejs", titulo: "Node.js", categoria: "Backend",
    lema: "JavaScript en el servidor",
    descripcion: "El runtime y su event loop, módulos, npm, ficheros y streams, HTTP, Express, bases de datos, autenticación, pruebas, rendimiento y despliegue.",
    nivel: "Desde cero · hasta maestro", horas: 14, color: "#7fbf5a", glifo: "hexagono", logo: "logos/nodejs.svg",
    temas: ["node", "npm", "express", "servidor", "streams"]
  },
  {
    id: "seguridad", titulo: "Seguridad web", categoria: "Seguridad",
    lema: "Cómo atacan las aplicaciones y cómo se defienden",
    descripcion: "OWASP Top 10, inyección, XSS, CSRF, autenticación y sesiones, OAuth y JWT, criptografía aplicada, gestión de secretos, cabeceras de seguridad y seguridad de la cadena de suministro.",
    nivel: "Desde cero · hasta maestro", horas: 14, color: "#f27a6d", glifo: "escudo", logo: "logos/seguridad.svg",
    temas: ["owasp", "xss", "csrf", "inyeccion", "oauth", "jwt", "cifrado"]
  },
  {
    id: "algoritmos", titulo: "Algoritmos y estructuras de datos", categoria: "Ingeniería",
    lema: "Pensar como en una entrevista técnica",
    descripcion: "Complejidad y notación O, arrays y cadenas, hashing, dos punteros y ventana deslizante, pilas y colas, listas enlazadas, árboles, grafos, montículos, recursión, búsqueda binaria, programación dinámica y patrones de entrevista.",
    nivel: "Desde cero · hasta maestro", horas: 16, color: "#9fd36a", glifo: "grafo",
    temas: ["big o", "leetcode", "estructuras", "arboles", "grafos", "dinamica", "entrevista"]
  },
  {
    id: "diseno", titulo: "Diseño de sistemas", categoria: "Ingeniería",
    lema: "Arquitecturas que escalan, explicadas paso a paso",
    descripcion: "Requisitos y estimaciones, latencia y percentiles, escalado y balanceo, DNS y CDN, cachés, bases de datos e índices, transacciones, replicación, particionado y hashing consistente, CAP y PACELC, quórums y consenso (Raft), colas y streaming, idempotencia, sagas y outbox, diseño de APIs, microservicios, almacenamiento de objetos, búsqueda, tiempo real, fiabilidad y SLOs, seguridad de arquitectura, limitación de tasa, casos clásicos de entrevista (acortador, feed, chat, notificaciones, ficheros, pagos, reservas, autocompletado) y simulacro final.",
    nivel: "Desde cero · hasta maestro", horas: 30, color: "#e3a86b", glifo: "plano",
    temas: ["system design", "escalabilidad", "cache", "sharding", "cap", "microservicios", "entrevista"]
  },
  {
    id: "observabilidad", titulo: "Observabilidad", categoria: "Infraestructura",
    lema: "Saber qué pasa dentro de tus sistemas",
    descripcion: "Monitorizar frente a observar, RED, USE y percentiles, logs estructurados con Loki y OpenSearch, Prometheus y PromQL a fondo, Alertmanager y Grafana, trazas con OpenTelemetry y Tempo, profiling continuo, SLOs con burn rate, Kubernetes, costes, guardias, incidentes y postmortems.",
    nivel: "Desde cero · hasta maestro", horas: 28, color: "#e46a6a", glifo: "grafica", logo: "logos/observabilidad.svg",
    temas: ["prometheus", "grafana", "loki", "opentelemetry", "metricas", "alertas", "slo"]
  },
  {
    id: "ansible", titulo: "Ansible", categoria: "Infraestructura",
    lema: "Configurar cien servidores como si fuera uno",
    descripcion: "Arquitectura sin agentes, inventarios estáticos y dinámicos, ad hoc, playbooks y módulos, variables y precedencia, facts, condicionales, bucles, handlers, Jinja2, roles y colecciones, Vault, check y tags, errores, delegación, rendimiento, despliegues rodantes, ansible-lint, Molecule, CI/CD, execution environments, AWX y Terraform.",
    nivel: "Desde cero · hasta maestro", horas: 20, color: "#ee6b6b", glifo: "engranaje", logo: "logos/ansible.svg",
    temas: ["playbook", "yaml", "roles", "inventario", "configuracion", "automatizacion"]
  },
  {
    id: "kafka", titulo: "Apache Kafka", categoria: "Datos",
    lema: "Streaming de eventos a gran escala",
    descripcion: "Topics, particiones y offsets, productores y consumidores, grupos, garantías de entrega, esquemas, Kafka Connect, Kafka Streams y operación del clúster.",
    nivel: "Desde cero · hasta maestro", horas: 10, color: "#9aa5b8", glifo: "mensajes", logo: "logos/kafka.svg",
    temas: ["eventos", "streaming", "topic", "particion", "consumidor", "mensajeria"]
  },
  {
    id: "redis", titulo: "Redis", categoria: "Datos",
    lema: "Datos en memoria para ir rápido",
    descripcion: "Estructuras de datos, caché, sesiones, contadores y límites de uso, pub/sub y streams, persistencia, replicación, clúster y buenas prácticas.",
    nivel: "Desde cero · hasta maestro", horas: 10, color: "#e3564f", glifo: "rayo", logo: "logos/redis.svg",
    temas: ["cache", "clave valor", "memoria", "sesiones", "pubsub"]
  },
  {
    id: "mongodb", titulo: "MongoDB", categoria: "Datos",
    lema: "Bases de datos de documentos",
    descripcion: "Documentos y colecciones, consultas y proyecciones, modelado embebido o referenciado, índices, agregaciones, transacciones, réplicas y sharding.",
    nivel: "Desde cero · hasta maestro", horas: 10, color: "#5fb35a", glifo: "documento", logo: "logos/mongodb.svg",
    temas: ["nosql", "documentos", "json", "agregacion", "indices"]
  },
  {
    id: "go", titulo: "Go", categoria: "Lenguajes",
    lema: "El lenguaje de la nube",
    descripcion: "Toolchain y módulos, tipos, constantes e iota, funciones, closures y punteros, slices, mapas y strings por dentro, structs, métodos e interfaces, errores con wrapping, panic y recover, genéricos e iteradores, paquetes, goroutines, canales, select, sync, atomic y context, patrones de concurrencia, pruebas con fuzzing y benchmarks, net/http, JSON, database/sql, slog, pprof, GC, compilación cruzada e imágenes mínimas.",
    nivel: "Desde cero · hasta maestro", horas: 24, color: "#4fc3dc", glifo: "velocidad", logo: "logos/go.svg",
    temas: ["golang", "goroutines", "canales", "concurrencia", "cli", "microservicios"]
  }
];

/* rutas de carrera: cursos en el orden recomendado */
window.CURSOS_RUTAS = [
  { id: "devops", titulo: "Ingeniería DevOps", descripcion: "Del sistema operativo a operar plataformas en la nube.", cursos: ["linux", "redes", "git", "docker", "kubernetes", "devops", "jenkins", "terraform", "ansible", "aws", "observabilidad"] },
  { id: "backend-java", titulo: "Backend con Java", descripcion: "Construir, persistir y desplegar APIs profesionales.", cursos: ["git", "java", "sql", "spring", "docker", "jenkins", "seguridad"] },
  { id: "fullstack-js", titulo: "Full stack JavaScript", descripcion: "De la web en el navegador al servidor con Node.", cursos: ["git", "html", "css", "javascript", "typescript", "react", "nodejs", "sql", "docker"] },
  { id: "python", titulo: "Python y automatización", descripcion: "Scripting, datos y automatización de sistemas.", cursos: ["linux", "git", "python", "sql", "docker"] },
  { id: "entrevistas", titulo: "Preparar entrevistas técnicas", descripcion: "Lo que se pregunta en una entrevista de backend.", cursos: ["java", "spring", "sql", "algoritmos", "diseno", "docker", "redes"] }
];
