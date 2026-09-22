window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Clases, enums y módulos",
resumen: "Clases con modificadores de acceso, implements, enums frente a uniones, módulos, ficheros de declaración y @types",
nivel: "Avanzado",
color: "#3b77bf",
lecciones: [

{
id:"ts5l1",
titulo:"Clases en TypeScript",
claves:["public, private, protected y readonly en propiedades","Parámetros de propiedad en el constructor","implements comprueba que la clase cumple una interfaz"],
pasos:[
 {t:"info", eti:"POO tipada", h:"Clases",
  c:`<div class="termbox">interface Repositorio&lt;T&gt; {
  buscar(id: number): Promise&lt;T | undefined&gt;;
  guardar(item: T): Promise&lt;void&gt;;
}

class TareaRepoHttp implements Repositorio&lt;Tarea&gt; {
  constructor(private readonly baseUrl: string) {}      // crea y asigna la propiedad

  async buscar(id: number) {
    const res = await fetch(\`\${this.baseUrl}/tareas/\${id}\`);
    return res.ok ? (await res.json() as Tarea) : undefined;
  }
  async guardar(t: Tarea) { ... }
}

abstract class Figura {
  abstract area(): number;
  protected describir() { return \`Área: \${this.area()}\`; }
}</div>`},
 {t:"par", p:"Empareja cada modificador con su efecto",
  pares:[["private","Solo accesible dentro de la clase (comprobado al compilar)"],["#campo","Privado real del lenguaje, también en ejecución"],["protected","Clase y subclases"],["readonly","No se puede reasignar tras el constructor"],["implements","La clase debe cumplir la interfaz"]],
  why:"private de TypeScript desaparece al compilar; #campo es privado de verdad en JavaScript."},
 {t:"vf", p:"<code>constructor(private nombre: string) {}</code> declara y asigna la propiedad nombre automáticamente.",
  ok:true, why:"Son los parámetros de propiedad: ahorran la declaración y la asignación."}
]},

{
id:"ts5l2",
titulo:"Enums o uniones de literales",
claves:["enum genera código JavaScript; las uniones de literales no","Las uniones suelen ser la opción preferida","Objetos as const cuando necesitas los valores en ejecución"],
pasos:[
 {t:"info", eti:"Dos opciones", h:"Comparación",
  c:`<div class="termbox">// enum: existe en ejecucion (genera un objeto)
enum Estado { Pendiente = "pendiente", Pagado = "pagado" }
const e = Estado.Pagado;

// union de literales: sin codigo extra
type Estado2 = "pendiente" | "pagado";

// objeto as const: valores en ejecucion + tipo derivado
const ESTADO = { Pendiente: "pendiente", Pagado: "pagado" } as const;
type Estado3 = typeof ESTADO[keyof typeof ESTADO];   // "pendiente" | "pagado"</div>
     <p>Muchos equipos evitan <code>enum</code> (sobre todo los numéricos, que aceptan cualquier número) y usan uniones de literales. Con <code>erasableSyntaxOnly</code> o al ejecutar TypeScript directamente en Node, los enums ni siquiera están permitidos.</p>`},
 {t:"par", p:"Empareja cada opción con su característica",
  pares:[["enum numérico","Genera código y acepta números arbitrarios: poco seguro"],["enum de strings","Genera un objeto en ejecución"],["Unión de literales","Solo existe en tipos, cero coste"],["Objeto as const","Valores en ejecución y tipo derivado de ellos"]],
  why:"La opción más simple suele ser la unión de literales."},
 {t:"opcion", p:"Necesitas un tipo para el rol del usuario y también mostrar la lista de roles en un desplegable. ¿Qué eliges?",
  ops:["Un enum numérico","Un array as const de roles y el tipo derivado con typeof ROLES[number]","any","Un string"],
  ok:1, why:"Una sola fuente de verdad para valores y tipo."}
]},

{
id:"ts5l3",
titulo:"Módulos y ficheros de declaración",
claves:["import type para importar solo tipos","Los paquetes de JavaScript traen tipos o se instalan con @types/paquete","Un .d.ts declara tipos sin implementación"],
pasos:[
 {t:"info", eti:"Tipos de terceros", h:"@types y .d.ts",
  c:`<div class="termbox">import type { Request, Response } from "express";    // solo tipos: se borra al compilar
npm install -D @types/express                          // tipos de un paquete JS

// tipos.d.ts: declarar algo que no tiene tipos
declare module "libreria-antigua" {
  export function calcular(x: number): number;
}

// ampliar tipos existentes
declare global {
  interface Window { analytics: { track(evento: string): void } }
}</div>
     <p>Muchos paquetes modernos ya incluyen sus tipos; para los que no, la comunidad los publica en <b>DefinitelyTyped</b> como <code>@types/nombre</code>.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["@types/node","Tipos de las APIs de Node.js"],["import type","Importar solo tipos, sin código"],["archivo.d.ts","Declaraciones de tipos sin implementación"],["declare module","Describir un módulo que no trae tipos"],["declare global","Añadir tipos al ámbito global"]],
  why:"«Could not find a declaration file for module» se resuelve con @types o un declare module."},
 {t:"term", p:"Instala los tipos de Node como dependencia de desarrollo",
  prompt:"pablo@portatil:~/api$", sol:["npm install -D @types/node","npm i -D @types/node","npm install --save-dev @types/node","npm i --save-dev @types/node"],
  pista:"npm install -D y el paquete @types/node.",
  salida:`added 2 packages in 1s`, why:"Los tipos solo se usan al compilar: siempre en devDependencies."}
]},

{
id:"ts5l4",
titulo:"Decoradores y fusión de declaraciones",
claves:["Decoradores estándar (TS 5): funciones que envuelven clases, métodos o campos","Muy usados en NestJS, Angular y ORMs como TypeORM","Las interfaces con el mismo nombre se fusionan (declaration merging)"],
pasos:[
 {t:"info", eti:"Anotaciones", h:"Decoradores",
  c:`<div class="termbox">function registrar(metodo: Function, contexto: ClassMethodDecoratorContext) {
  return function (this: unknown, ...args: unknown[]) {
    console.log(\`→ \${String(contexto.name)}\`, args);
    return metodo.apply(this, args);
  };
}

class PedidoService {
  @registrar
  confirmar(id: number) { ... }
}</div>
     <p>Es la misma idea que los decoradores de Python o las anotaciones con proxies de Spring. NestJS y Angular los usan intensamente (en su variante «experimental», anterior al estándar).</p>`},
 {t:"info", eti:"Ampliar tipos", h:"Declaration merging",
  c:`<div class="termbox">// ampliar el objeto Request de Express con el usuario autenticado
declare global {
  namespace Express {
    interface Request { usuario?: { id: string; rol: "admin" | "usuario" } }
  }
}</div>`},
 {t:"par", p:"Empareja cada elemento con su uso",
  pares:[["@Decorador en un método","Envolver el método con lógica extra (logs, caché, permisos)"],["experimentalDecorators","Variante antigua usada por NestJS y Angular"],["declare global","Añadir tipos al ámbito global"],["Fusión de interfaces","Ampliar una interfaz existente con nuevas propiedades"]],
  why:"Ampliar Request de Express es el uso más habitual de la fusión de declaraciones."},
 {t:"vf", p:"Dos declaraciones <code>interface Usuario</code> en el mismo ámbito se combinan en una sola.",
  ok:true, why:"Con type daría error de identificador duplicado."}
]}

]});
