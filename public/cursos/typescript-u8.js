window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "TypeScript en proyectos reales",
resumen: "tsconfig y strict, validación en tiempo de ejecución con zod, tipos compartidos entre frontend y backend, y migrar desde JavaScript",
nivel: "Experto",
color: "#2f6bb2",
lecciones: [

{
id:"ts8l1",
titulo:"tsconfig y el modo estricto",
claves:["strict: true activa las comprobaciones importantes (null, any implícito...)","noUncheckedIndexedAccess y exactOptionalPropertyTypes afinan aún más","target, module y moduleResolution según dónde se ejecuta el código"],
pasos:[
 {t:"info", eti:"Configurar", h:"Un tsconfig moderno",
  c:`<div class="termbox">{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}</div>`},
 {t:"par", p:"Empareja cada opción con lo que detecta",
  pares:[["strictNullChecks (en strict)","Usar algo que puede ser null o undefined sin comprobarlo"],["noImplicitAny (en strict)","Parámetros sin tipo que se convierten en any en silencio"],["noUncheckedIndexedAccess","Que lista[i] o mapa[clave] pueden ser undefined"],["noImplicitOverride","Sobrescribir métodos sin la palabra override"]],
  why:"Un proyecto sin strict pierde gran parte del valor de TypeScript."},
 {t:"opcion", p:"Con <code>noUncheckedIndexedAccess</code>, ¿qué tipo tiene <code>nombres[0]</code> si nombres es <code>string[]</code>?",
  ops:["string","string | undefined","any","never"],
  ok:1, why:"Porque el array podría estar vacío: te obliga a comprobarlo."},
 {t:"vf", p:"Activar <code>strict</code> en un proyecto nuevo es la recomendación general.",
  ok:true, why:"En uno existente se puede activar por partes."}
]},

{
id:"ts8l2",
titulo:"Validar en tiempo de ejecución",
claves:["Los tipos no existen en ejecución: valida los datos externos","zod (o valibot) define un esquema y deriva el tipo de él","Valida en los bordes: peticiones, respuestas de APIs, variables de entorno, formularios"],
pasos:[
 {t:"info", eti:"Confiar pero verificar", h:"Esquemas con zod",
  c:`<div class="termbox">import { z } from "zod";

const TareaSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string().min(1).max(200),
  hecha: z.boolean(),
  fechaLimite: z.coerce.date().nullable(),
});
type Tarea = z.infer&lt;typeof TareaSchema&gt;;      // el tipo sale del esquema

const datos: unknown = await res.json();
const resultado = TareaSchema.array().safeParse(datos);
if (!resultado.success) {
  console.error(resultado.error.issues);
} else {
  resultado.data;                               // Tarea[] validado
}

const Env = z.object({ DATABASE_URL: z.string().url(), PORT: z.coerce.number().default(3000) });
export const env = Env.parse(process.env);      // falla al arrancar si falta algo</div>`},
 {t:"par", p:"Empareja cada dato con por qué hay que validarlo",
  pares:[["Cuerpo de una petición a tu API","Cualquiera puede enviar cualquier cosa"],["Respuesta de una API externa","Puede cambiar sin avisarte"],["Variables de entorno","Pueden faltar o tener un formato incorrecto"],["localStorage","Pudo guardarlo una versión antigua de tu app"]],
  why:"Dentro del sistema, los tipos te protegen; en los bordes, la validación."},
 {t:"opcion", p:"¿Qué ventaja tiene <code>z.infer&lt;typeof Esquema&gt;</code>?",
  ops:["Ninguna","El tipo y la validación salen de la misma definición: no pueden desincronizarse","Es más rápido","Evita instalar zod"],
  ok:1, why:"Sin él, tendrías una interface y una validación que mantener a la par."}
]},

{
id:"ts8l3",
titulo:"Compartir tipos y migrar desde JavaScript",
claves:["Genera tipos desde el contrato de la API (OpenAPI) o comparte un paquete de tipos","Migración gradual: allowJs, checkJs y convertir fichero a fichero","Mide el progreso: menos any, más strict"],
pasos:[
 {t:"info", eti:"Frontend y backend alineados", h:"Tipos desde el contrato",
  c:`<div class="termbox"># tu API de Spring publica /v3/api-docs (OpenAPI)
npx openapi-typescript http://localhost:8080/v3/api-docs -o src/api/tipos.ts</div>
     <p>Si el backend cambia un campo, al regenerar los tipos el frontend deja de compilar donde se usa: te enteras antes de desplegar. En monorepos TypeScript de punta a punta, herramientas como <b>tRPC</b> comparten los tipos directamente.</p>`},
 {t:"orden", p:"Ordena una migración gradual de JavaScript a TypeScript",
  items:["Añadir TypeScript y un tsconfig con allowJs","Comprobar tipos en el CI con tsc --noEmit","Renombrar ficheros a .ts empezando por los más usados y sencillos","Sustituir any por tipos reales poco a poco","Activar strict cuando el proyecto lo permita"],
  why:"Nunca hace falta pararlo todo para migrar."},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["openapi-typescript","Generar tipos desde la especificación OpenAPI de una API"],["allowJs","Mezclar .js y .ts en el mismo proyecto"],["checkJs","Comprobar tipos también en ficheros .js (con JSDoc)"],["tRPC","Compartir tipos de API entre backend y frontend en TypeScript"]],
  why:"El contrato OpenAPI conecta tu API de Spring con un frontend en TypeScript."}
]},

{
id:"ts8l4",
titulo:"TypeScript con React y con Node",
claves:["React: tipar props, estado, eventos y hooks propios","Node: ESM, tsx para ejecutar, tsc para compilar o ejecución nativa con eliminación de tipos","Comparte tipos entre frontend y backend en un paquete o desde OpenAPI"],
pasos:[
 {t:"info", eti:"En el frontend", h:"React con TypeScript",
  c:`<div class="termbox">type Props = { tarea: Tarea; alAlternar: (id: number) =&gt; void };

export function FilaTarea({ tarea, alAlternar }: Props) {
  const [editando, setEditando] = useState(false);           // boolean inferido
  const [error, setError] = useState&lt;string | null&gt;(null);   // union explicita
  const input = useRef&lt;HTMLInputElement&gt;(null);

  function onChange(e: React.ChangeEvent&lt;HTMLInputElement&gt;) { ... }
  return &lt;li onClick={() =&gt; alAlternar(tarea.id)}&gt;{tarea.titulo}&lt;/li&gt;;
}</div>`},
 {t:"info", eti:"En el backend", h:"Node con TypeScript",
  c:`<div class="termbox">npx tsx watch src/server.ts        # desarrollo: ejecuta .ts directamente
npx tsc -p tsconfig.build.json     # produccion: compila a dist/
node dist/server.js

node --experimental-strip-types src/server.ts   # Node 22.6+: elimina los tipos al vuelo (23.6+ sin la opcion)</div>`},
 {t:"par", p:"Empareja cada tipo de React con su uso",
  pares:[["React.ReactNode","Cualquier cosa que se pueda renderizar (children)"],["React.ChangeEvent<HTMLInputElement>","Evento onChange de un input"],["useState<string | null>(null)","Estado que empieza vacío y luego tiene texto"],["useRef<HTMLDivElement>(null)","Referencia a un elemento del DOM"]],
  why:"Casi todo lo demás se infiere solo."},
 {t:"opcion", p:"¿Por qué conviene tipar explícitamente <code>useState&lt;string | null&gt;(null)</code>?",
  ops:["No hace falta nunca","Porque con null como valor inicial se inferiría el tipo null y no podrías guardar texto después","Por rendimiento","Porque React lo exige"],
  ok:1, why:"Cuando el valor inicial no representa todos los valores posibles, indica el tipo."}
]}

]});
