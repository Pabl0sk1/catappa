window.CURSOS = window.CURSOS || {};
(CURSOS.nodejs = CURSOS.nodejs || []).push({
titulo: "Node.js en producción",
resumen: "Configuración y logs estructurados, apagado elegante, imagen Docker, frameworks como Fastify y NestJS, y observabilidad",
nivel: "Experto",
color: "#589834",
lecciones: [

{
id:"nd7l1",
titulo:"Configuración, logs y apagado elegante",
claves:["Configuración por variables de entorno validadas al arrancar","Logs JSON estructurados con pino, sin console.log en producción","Al recibir SIGTERM: dejar de aceptar peticiones, terminar las activas y cerrar conexiones"],
pasos:[
 {t:"info", eti:"Operable", h:"Listo para un orquestador",
  c:`<div class="termbox">import pino from "pino";
export const log = pino({ level: process.env.LOG_LEVEL ?? "info" });

const servidor = app.listen(env.PORT, () =&gt; log.info({ puerto: env.PORT }, "arrancado"));

async function apagar(senal) {
  log.info({ senal }, "apagando");
  servidor.close(async () =&gt; {           // no acepta nuevas; espera a las activas
    await pool.end();                     // cerrar la base de datos
    process.exit(0);
  });
  setTimeout(() =&gt; process.exit(1), 10_000).unref();   // plan B
}
process.on("SIGTERM", apagar);
process.on("SIGINT", apagar);</div>`},
 {t:"par", p:"Empareja cada práctica con el problema que evita",
  pares:[["Validar el entorno al arrancar","Fallar en la primera petición por una variable ausente"],["Logs JSON","No poder buscar ni filtrar logs en producción"],["Manejar SIGTERM","Cortar peticiones en curso durante un despliegue"],["No usar el usuario root en la imagen","Que un fallo dé control total del contenedor"]],
  why:"Esta misma plataforma hace el apagado elegante al recibir SIGTERM."},
 {t:"opcion", p:"¿Por qué el comando del contenedor debe ser <code>node server.js</code> y no <code>npm start</code>?",
  ops:["Por velocidad de arranque solamente","npm no reenvía bien las señales (SIGTERM) al proceso de Node, así que el apagado elegante no ocurre","npm no existe en la imagen","Da igual"],
  ok:1, why:"Con npm como PID 1, Docker acaba matando el proceso a los 10 s con SIGKILL."}
]},

{
id:"nd7l2",
titulo:"Imagen Docker y frameworks",
claves:["Imagen multi-stage: dependencias de build separadas, npm ci --omit=dev, usuario node","Fastify: rápido y con validación por esquemas; NestJS: estructura estilo Spring con módulos e inyección","Observabilidad con OpenTelemetry, métricas y trazas"],
pasos:[
 {t:"info", eti:"Empaquetar", h:"Dockerfile para Node",
  c:`<div class="termbox">FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev &amp;&amp; npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/salud || exit 1
CMD ["node", "dist/server.js"]</div>`},
 {t:"par", p:"Empareja cada framework con su estilo",
  pares:[["Express","Minimalista y el más extendido"],["Fastify","Alto rendimiento, esquemas JSON y plugins"],["NestJS","Módulos, controladores e inyección de dependencias al estilo Spring"],["Hono","Ligero, funciona en Node, Bun, Deno y edge"]],
  why:"Si vienes de Spring, NestJS te resultará muy familiar."},
 {t:"opcion", p:"¿Por qué copiar <code>package*.json</code> y ejecutar <code>npm ci</code> antes de copiar el resto del código?",
  ops:["Por orden alfabético","Para que la capa de dependencias quede en caché y no se reinstale en cada cambio de código","Porque npm lo exige","Para reducir el tamaño"],
  ok:1, why:"Es la misma técnica de capas que viste en el curso de Docker."},
 {t:"vf", p:"<code>npm ci --omit=dev</code> instala también herramientas como Vitest y ESLint en la imagen final.",
  ok:false, why:"Omite las devDependencies: imagen más pequeña y con menos superficie de ataque."}
]},

{
id:"nd7l3",
titulo:"NestJS: arquitectura al estilo Spring",
claves:["NestJS organiza la app en módulos, controladores y proveedores con inyección de dependencias","Decoradores para rutas, validación (class-validator) y guards de autorización","Muy familiar si vienes de Spring Boot"],
pasos:[
 {t:"info", eti:"Estructura", h:"Un controlador de NestJS",
  c:`<div class="termbox">@Controller("tareas")
export class TareasController {
  constructor(private readonly servicio: TareasService) {}     // inyeccion por constructor

  @Get(":id")
  obtener(@Param("id", ParseIntPipe) id: number) {
    return this.servicio.obtener(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Body() dto: CrearTareaDto) {                          // validado con class-validator
    return this.servicio.crear(dto);
  }
}

@Module({ controllers: [TareasController], providers: [TareasService] })
export class TareasModule {}</div>`},
 {t:"par", p:"Empareja cada concepto de NestJS con su equivalente en Spring",
  pares:[["@Controller","@RestController"],["@Injectable (provider)","@Service"],["@Module","Configuración y agrupación de beans"],["Guard","Reglas de Spring Security"],["Pipe de validación","@Valid con Bean Validation"]],
  why:"Si dominas Spring, NestJS se aprende en días."},
 {t:"opcion", p:"¿Cuándo elegirías NestJS en vez de Express a secas?",
  ops:["Nunca","En proyectos grandes con varios equipos, donde una estructura común, inyección de dependencias y convenciones ahorran discusiones","Solo para scripts","Para páginas estáticas"],
  ok:1, why:"Para una API pequeña, Express o Fastify son más directos."}
]}

]});
