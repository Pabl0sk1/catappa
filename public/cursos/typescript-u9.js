window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Maestría: entrevista de TypeScript",
resumen: "Preguntas y ejercicios de tipos típicos de entrevista y simulacro final",
nivel: "Maestro",
color: "#23599a",
lecciones: [

{
id:"ts9l1",
titulo:"Simulacro de entrevista de TypeScript",
claves:["Sabes explicar type frente a interface, unknown frente a any y los genéricos","Dominas uniones discriminadas, narrowing y tipos utilitarios","Sabes por qué validar en tiempo de ejecución"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Diferencia entre type e interface?»",
  ops:["Ninguna","Ambas describen objetos; interface se puede ampliar por declaración y usar extends; type admite uniones, intersecciones, tipos condicionales y mapeados. Para objetos, cualquiera, con una convención de equipo","interface es más rápida","type no admite objetos"],
  ok:1, why:"Una respuesta matizada vale más que «son iguales»."},
 {t:"opcion", p:"«¿any o unknown?»",
  ops:["Son iguales","any desactiva las comprobaciones; unknown acepta cualquier valor pero obliga a estrecharlo antes de usarlo, así que es la opción segura para datos externos","unknown es más permisivo","any es más seguro"],
  ok:1, why:"Menciona catch (e: unknown) con strict."},
 {t:"opcion", p:"«Implementa un tipo que haga opcionales solo algunas propiedades»",
  ops:["type P&lt;T, K&gt; = Partial&lt;T&gt;","type Opcionales&lt;T, K extends keyof T&gt; = Omit&lt;T, K&gt; & Partial&lt;Pick&lt;T, K&gt;&gt;","type P&lt;T&gt; = T | undefined","No se puede"],
  ok:1, why:"Combinar Omit, Pick y Partial es un ejercicio típico."},
 {t:"opcion", p:"«¿Qué es una unión discriminada y por qué es útil?»",
  ops:["Un enum","Una unión de objetos con una propiedad literal común que permite al compilador estrechar a cada variante; hace imposibles los estados incoherentes y, con never, garantiza tratar todos los casos","Una intersección","Un tipo genérico"],
  ok:1, why:"Ejemplo: estados de una petición (cargando, éxito, error)."},
 {t:"opcion", p:"«Si todo está tipado, ¿por qué validar las peticiones?»",
  ops:["No hace falta","Porque los tipos se borran al compilar: en ejecución llega cualquier JSON; se valida en los bordes (zod) y de ahí se derivan los tipos","Por rendimiento","Porque lo exige Node"],
  ok:1, why:"Es la pregunta que separa a quien usa TypeScript de quien lo entiende."},
 {t:"par", p:"Empareja cada problema con la herramienta de TypeScript",
  pares:[["Mezclar ids de entidades distintas","Branded types"],["Olvidar tratar un estado nuevo","Unión discriminada con comprobación never"],["Repetir tipos derivados de otro","Tipos utilitarios (Pick, Omit, Partial)"],["Tipo y validación desincronizados","z.infer a partir del esquema"]],
  why:"Cada técnica resuelve un tipo de error real."},
 {t:"info", eti:"Terminado", h:"Has completado TypeScript",
  c:`<p>Dominas los tipos básicos, objetos y funciones tipados, uniones y narrowing, genéricos, clases y módulos, tipos utilitarios, el sistema de tipos avanzado y su uso en proyectos reales.</p>
     <p>Siguiente paso: <b>React</b> y <b>Node.js</b> con TypeScript. Practica tipando la respuesta de tu API de tareas con tipos generados desde su OpenAPI.</p>`}
]},

{
id:"ts9l2",
titulo:"Ejercicios de tipos",
claves:["Implementar utilitarios a mano demuestra dominio del sistema de tipos","Mapeados + keyof + condicionales cubren casi todos los retos","Explica el razonamiento paso a paso"],
pasos:[
 {t:"opcion", p:"¿Cuál es una implementación correcta de <code>MiPick&lt;T, K&gt;</code>?",
  ops:["type MiPick&lt;T, K&gt; = T[K]","type MiPick&lt;T, K extends keyof T&gt; = { [P in K]: T[P] }","type MiPick&lt;T, K&gt; = Omit&lt;T, K&gt;","type MiPick&lt;T, K&gt; = K"],
  ok:1, why:"Recorre solo las claves K (que deben existir en T) y copia su tipo."},
 {t:"opcion", p:"¿Cuál implementa <code>SoloLectura&lt;T&gt;</code> de forma profunda?",
  ops:["type SoloLectura&lt;T&gt; = Readonly&lt;T&gt;","type SoloLectura&lt;T&gt; = { readonly [K in keyof T]: T[K] extends object ? SoloLectura&lt;T[K]&gt; : T[K] }","type SoloLectura&lt;T&gt; = T","type SoloLectura&lt;T&gt; = keyof T"],
  ok:1, why:"Readonly solo afecta al primer nivel; la recursión llega a los objetos anidados."},
 {t:"opcion", p:"¿Qué tipo resulta de <code>type X = Awaited&lt;ReturnType&lt;typeof fetch&gt;&gt;</code>?",
  ops:["Promise&lt;Response&gt;","Response","typeof fetch","unknown"],
  ok:1, why:"ReturnType da Promise&lt;Response&gt; y Awaited la desenvuelve."},
 {t:"par", p:"Empareja cada utilitario con su implementación conceptual",
  pares:[["Partial<T>","{ [K in keyof T]?: T[K] }"],["Exclude<T, U>","T extends U ? never : T"],["ReturnType<F>","F extends (...a: any) => infer R ? R : never"],["NonNullable<T>","T & {}"]],
  why:"Todos los utilitarios estándar están construidos con estas piezas."}
]}

]});
