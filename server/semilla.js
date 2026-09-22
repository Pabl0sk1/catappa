"use strict";
/* =====================================================================
   Contenido inicial de la comunidad: se crea UNA sola vez, al primer arranque.
   Son preguntas reales y frecuentes, con respuestas correctas, para que la
   comunidad no empiece vacía.
   ===================================================================== */
const crypto = require("crypto");

const MENTORES = [
  { usuario: "equipo-catappa", nombre: "Equipo Catappa", color: "#179493", bio: "Cuenta oficial. Resolvemos dudas de los cursos." },
  { usuario: "marta_ops", nombre: "Marta · SRE", color: "#7fd1b9", bio: "SRE en producción desde hace 8 años. Kubernetes, observabilidad y guardias." },
  { usuario: "leo_backend", nombre: "Leo · Backend", color: "#7aa2f7", bio: "Java y Spring Boot. Dockerizo todo lo que se mueve." }
];

function hace(horas) { return new Date(Date.now() - horas * 3600 * 1000).toISOString(); }

const POSTS = [
  {
    autor: "leo_backend", cursoId: "docker", leccionId: "u6l3", tipo: "pregunta", horas: 30, etiquetas: ["compose", "postgres", "redes"],
    titulo: "Mi API no conecta con Postgres en docker compose, pero en local sí",
    cuerpo: "Tengo Spring Boot y Postgres en el mismo compose.yml. En mi máquina funciona con esta URL:\n\n```\nspring.datasource.url=jdbc:postgresql://localhost:5432/tareas\n```\n\nPero dentro de Docker la API muere con `Connection to localhost:5432 refused`. El contenedor de Postgres está levantado y healthy. ¿Qué me falta?",
    respuestas: [
      { autor: "marta_ops", votos: ["equipo-catappa", "leo_backend"], aceptada: true,
        cuerpo: "El clásico. Dentro del contenedor de la API, `localhost` es **el propio contenedor de la API**, no tu máquina ni el de Postgres.\n\nCompose crea una red con DNS interno donde cada servicio se llama como su clave en `services:`. Si tu servicio se llama `db`:\n\n```\nSPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/tareas\n```\n\nY de paso: pon un healthcheck en `db` y `depends_on: db: condition: service_healthy` en la API, porque `depends_on` a secas solo ordena el arranque, no espera a que Postgres acepte conexiones." },
      { autor: "equipo-catappa", votos: ["leo_backend"],
        cuerpo: "Lo tienes explicado paso a paso en Docker › Unidad 6 › *Cómo se hablan los servicios*. Regla para recordar: **entre contenedores, nombre del servicio y puerto interno; desde tu navegador, localhost y puerto publicado.**" }
    ]
  },
  {
    autor: "equipo-catappa", cursoId: "docker", leccionId: "u4l7", tipo: "recurso", horas: 52, etiquetas: ["dockerfile", "java", "multi-stage"],
    titulo: "Plantilla: Dockerfile multi-stage para Spring Boot (949 MB → 372 MB)",
    cuerpo: "La plantilla que usamos en el curso, lista para copiar:\n\n```\nFROM maven:3.9-eclipse-temurin-21 AS builder\nWORKDIR /build\nCOPY pom.xml .\nRUN mvn dependency:go-offline -B\nCOPY src ./src\nRUN mvn clean package -DskipTests -B\n\nFROM eclipse-temurin:21-jre-alpine\nRUN addgroup -S spring && adduser -S spring -G spring\nWORKDIR /app\nCOPY --from=builder /build/target/app.jar app.jar\nUSER spring\nEXPOSE 8080\nHEALTHCHECK CMD wget -qO- http://localhost:8080/actuator/health || exit 1\nENTRYPOINT [\"java\",\"-jar\",\"/app/app.jar\"]\n```\n\nClaves: el `pom.xml` se copia antes que `src` para cachear dependencias, la imagen final solo lleva JRE, corre sin root y arranca en forma exec para recibir SIGTERM.",
    respuestas: [
      { autor: "leo_backend", votos: ["marta_ops"],
        cuerpo: "Añadiría `ENV JAVA_OPTS=\"-XX:MaxRAMPercentage=75.0\"` y arrancar con `sh -c \"exec java $JAVA_OPTS -jar /app/app.jar\"`. Sin eso he visto contenedores Java morir con Exited (137) por memoria." }
    ]
  },
  {
    autor: "leo_backend", cursoId: "git", leccionId: null, tipo: "pregunta", horas: 20, etiquetas: ["ramas", "reset"],
    titulo: "Hice commit en main por error, ¿cómo lo muevo a una rama nueva?",
    cuerpo: "Hice dos commits directamente en `main` que tenían que ir en una rama de feature. Todavía **no he hecho push**. ¿Cómo lo arreglo sin perder el trabajo?",
    respuestas: [
      { autor: "marta_ops", votos: ["equipo-catappa", "leo_backend"], aceptada: true,
        cuerpo: "Como no has hecho push, es fácil y seguro:\n\n```\ngit branch feature/mi-cambio      # la rama nueva apunta a tus 2 commits\ngit reset --hard HEAD~2            # main vuelve 2 commits atrás\ngit switch feature/mi-cambio       # sigues trabajando aquí\n```\n\nNo pierdes nada porque la rama nueva conserva los commits. Si ya hubieras hecho push, en vez de `reset` en main tendrías que usar `git revert` para no reescribir historia compartida." }
    ]
  },
  {
    autor: "marta_ops", cursoId: "git", leccionId: null, tipo: "debate", horas: 70, etiquetas: ["merge", "rebase", "equipos"],
    titulo: "¿Merge o rebase? Cómo lo decidimos en mi equipo",
    cuerpo: "Nuestra regla, por si os sirve:\n\n- **Rebase** de tu rama local sobre `main` antes de abrir el PR, para tener un historial lineal y limpio.\n- **Nunca** rebase de ramas que otra persona ya tiene descargadas.\n- Al integrar el PR, *squash merge* para que cada feature sea un commit en `main`.\n\n¿Cómo lo hacéis vosotros?",
    respuestas: [
      { autor: "leo_backend", votos: ["marta_ops"],
        cuerpo: "Igual, salvo que nosotros no hacemos squash en PRs grandes: preferimos conservar los commits si están bien escritos (conventional commits), porque ayuda con `git bisect`." }
    ]
  },
  {
    autor: "leo_backend", cursoId: "devops", leccionId: null, tipo: "pregunta", horas: 9, etiquetas: ["kubernetes", "compose"],
    titulo: "Ya domino Compose, ¿por dónde empiezo con Kubernetes?",
    cuerpo: "Tengo varios proyectos con docker compose en un VPS. Me piden Kubernetes en ofertas. ¿Qué conceptos debería aprender primero para no perderme?",
    respuestas: [
      { autor: "marta_ops", votos: ["equipo-catappa", "leo_backend"],
        cuerpo: "Mapa mental desde Compose:\n\n- Tu `service:` de compose → un **Deployment** (réplicas + actualizaciones) que crea **Pods**.\n- La red por nombre de compose → un **Service** (IP estable y DNS interno).\n- `ports:` hacia fuera → un **Ingress** (o un Service tipo LoadBalancer).\n- `environment:` y `.env` → **ConfigMap** y **Secret**.\n- Volúmenes → **PersistentVolumeClaim**.\n\nMonta un clúster local con kind o minikube y traduce uno de tus compose a esos objetos. Lo tienes en DevOps › Unidad 5." }
    ]
  },
  {
    autor: "equipo-catappa", cursoId: null, leccionId: null, tipo: "debate", horas: 100, etiquetas: ["entrevista", "consejos"],
    titulo: "Cómo contar tu método en una entrevista técnica (y por qué importa más que la respuesta)",
    cuerpo: "En las entrevistas de DevOps casi siempre aparece un «esto no funciona, ¿qué harías?». Lo que buscan es **tu método**, no adivinar la causa.\n\nPara contenedores, por ejemplo:\n\n1. `docker ps -a` → ¿corre? ¿exit code?\n2. `docker logs` → ¿qué dice la app?\n3. `docker inspect` → red, puertos, variables\n4. `docker exec -it X sh` → reproducirlo dentro\n\nY si no sabes algo: «No lo he usado en producción, pero lo que entiendo es esto... ¿va por ahí?». Contad aquí vuestras experiencias.",
    respuestas: [
      { autor: "marta_ops", votos: ["leo_backend", "equipo-catappa"],
        cuerpo: "Confirmo desde el otro lado de la mesa: cuando entrevisto, alguien que piensa en voz alta y descarta hipótesis con orden puntúa más que alguien que acierta de chiripa." }
    ]
  },
  {
    autor: "marta_ops", cursoId: "devops", leccionId: null, tipo: "recurso", horas: 44, etiquetas: ["ci-cd", "github-actions"],
    titulo: "Pipeline mínimo de GitHub Actions: test, imagen y push",
    cuerpo: "Para empezar no hace falta más:\n\n```\nname: ci\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    permissions: { contents: read, packages: write }\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: { java-version: '21', distribution: temurin, cache: maven }\n      - run: mvn -B test\n      - uses: docker/login-action@v3\n        with: { registry: ghcr.io, username: ${{ github.actor }}, password: ${{ secrets.GITHUB_TOKEN }} }\n      - uses: docker/build-push-action@v6\n        with: { push: true, tags: ghcr.io/${{ github.repository }}:sha-${{ github.sha }} }\n```\n\nTag por SHA del commit: sabes exactamente qué hay desplegado y el rollback es trivial.",
    respuestas: []
  }
];

function aplicar(db, hashClave) {
  const meta = db.get("meta");
  if (meta.sembrado) return;
  const usuarios = db.get("usuarios");
  const ids = {};
  for (const m of MENTORES) {
    let u = usuarios.find(x => x.usuario === m.usuario);
    if (!u) {
      const salt = crypto.randomBytes(16).toString("hex");
      // contraseña aleatoria: estas cuentas no están pensadas para iniciar sesión
      u = Object.assign({ id: db.id(), salt, hash: hashClave(crypto.randomBytes(24).toString("hex"), salt), creado: hace(24 * 40), rol: "mentor" }, m);
      usuarios.push(u);
    }
    ids[m.usuario] = u.id;
  }
  const posts = db.get("posts");
  for (const p of POSTS) {
    posts.push({
      id: db.id(), autor: ids[p.autor], cursoId: p.cursoId, leccionId: p.leccionId, tipo: p.tipo,
      titulo: p.titulo, cuerpo: p.cuerpo, etiquetas: p.etiquetas, creado: hace(p.horas),
      votos: [], respuestas: p.respuestas.map((r, i) => ({
        id: db.id(), autor: ids[r.autor], cuerpo: r.cuerpo, creado: hace(p.horas - 2 - i * 3),
        votos: r.votos.map(v => ids[v]), aceptada: !!r.aceptada
      }))
    });
  }
  // algunos votos a las publicaciones para que el orden por votos tenga sentido
  posts.forEach((p, i) => { if (i % 2 === 0) p.votos.push(ids["marta_ops"]); if (i % 3 !== 2) p.votos.push(ids["leo_backend"]); p.votos = p.votos.filter(v => v !== p.autor); });
  meta.sembrado = new Date().toISOString();
  db.guardar("usuarios"); db.guardar("posts"); db.guardar("meta");
  console.log("[semilla] comunidad inicial creada:", POSTS.length, "publicaciones");
}

module.exports = { aplicar };
