window.CURSOS = window.CURSOS || {};
(CURSOS.typescript = CURSOS.typescript || []).push({
titulo: "Tipos utilitarios",
resumen: "Partial, Required, Readonly, Pick, Omit, Record, ReturnType, Parameters, Awaited, NonNullable y typeof para derivar tipos",
nivel: "Avanzado",
color: "#3b77bf",
lecciones: [

{
id:"ts6l1",
titulo:"Transformar objetos",
claves:["Partial, Required y Readonly cambian los modificadores de todas las propiedades","Pick y Omit eligen o quitan propiedades","Record&lt;K, V&gt; crea objetos con claves y valores tipados"],
pasos:[
 {t:"info", eti:"Derivar en vez de repetir", h:"Utilitarios de objetos",
  c:`<div class="termbox">interface Usuario { id: number; nombre: string; email: string; clave: string }

type CambioUsuario  = Partial&lt;Omit&lt;Usuario, "id"&gt;&gt;;     // todo opcional salvo que no hay id
type UsuarioPublico = Omit&lt;Usuario, "clave"&gt;;            // sin la clave
type Credenciales   = Pick&lt;Usuario, "email" | "clave"&gt;;
type Congelado      = Readonly&lt;Usuario&gt;;
type Completo       = Required&lt;Configuracion&gt;;

const permisosPorRol: Record&lt;"admin" | "editor" | "lector", string[]&gt; = {
  admin: ["*"], editor: ["leer", "escribir"], lector: ["leer"],
};</div>
     <p>Si cambias <code>Usuario</code>, todos los tipos derivados se actualizan solos.</p>`},
 {t:"par", p:"Empareja cada utilitario con su efecto",
  pares:[["Partial<T>","Todas las propiedades opcionales"],["Required<T>","Todas las propiedades obligatorias"],["Pick<T, K>","Solo las propiedades K"],["Omit<T, K>","Todas menos las propiedades K"],["Record<K, V>","Objeto con claves K y valores V"]],
  why:"Partial&lt;T&gt; es perfecto para el cuerpo de un PATCH."},
 {t:"opcion", p:"Quieres el tipo de la respuesta pública de usuario, igual que Usuario pero sin <code>clave</code>. ¿Qué escribes?",
  ops:["Partial&lt;Usuario&gt;","Omit&lt;Usuario, \"clave\"&gt;","Pick&lt;Usuario, \"clave\"&gt;","Readonly&lt;Usuario&gt;"],
  ok:1, why:"Omit quita propiedades; Pick las selecciona."},
 {t:"vf", p:"Un Record con claves de tipo unión obliga a definir todas las claves de esa unión.",
  ok:true, why:"Si añades un rol nuevo a la unión, el compilador te pedirá sus permisos."}
]},

{
id:"ts6l2",
titulo:"Derivar tipos de valores y funciones",
claves:["typeof valor obtiene el tipo de una variable","ReturnType, Parameters y Awaited extraen tipos de funciones y promesas","NonNullable quita null y undefined"],
pasos:[
 {t:"info", eti:"Una sola fuente de verdad", h:"typeof y compañía",
  c:`<div class="termbox">const configPorDefecto = { tema: "oscuro", idioma: "es", avisos: true };
type Config = typeof configPorDefecto;       // { tema: string; idioma: string; avisos: boolean }

async function cargarPerfil(id: number) {
  return { id, nombre: "Ana", pedidos: [] as Pedido[] };
}
type Perfil = Awaited&lt;ReturnType&lt;typeof cargarPerfil&gt;&gt;;     // el objeto, sin la Promise
type ArgsPerfil = Parameters&lt;typeof cargarPerfil&gt;;             // [id: number]

type Email = NonNullable&lt;string | null | undefined&gt;;          // string</div>`},
 {t:"par", p:"Empareja cada utilitario con lo que extrae",
  pares:[["ReturnType<typeof f>","El tipo que devuelve f"],["Parameters<typeof f>","Tupla con los tipos de los parámetros de f"],["Awaited<Promise<T>>","T, el valor de la promesa"],["NonNullable<T>","T sin null ni undefined"],["typeof variable","El tipo de un valor existente"]],
  why:"Útil con librerías que no exportan sus tipos: los derivas de sus funciones."},
 {t:"opcion", p:"¿Qué es <code>typeof</code> en <code>type Config = typeof configPorDefecto</code>?",
  ops:["El typeof de JavaScript que devuelve un string","El operador de tipos de TypeScript: obtiene el tipo de ese valor","Un error","Una función"],
  ok:1, why:"En posición de tipo, typeof es de TypeScript; en una expresión, es el de JavaScript."}
]}

]});
