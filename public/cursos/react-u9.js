window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "React moderno y frameworks",
resumen: "Renderizado en cliente y en servidor, Next.js, Server Components, Server Actions y las novedades de React 19",
nivel: "Experto",
color: "#279ac2",
lecciones: [

{
id:"re9l1",
titulo:"Dónde se renderiza",
claves:["CSR: el navegador construye la página; SSR: el servidor envía HTML ya renderizado","SSG genera HTML al compilar; ISR lo regenera cada cierto tiempo","La hidratación conecta el HTML del servidor con React en el navegador"],
pasos:[
 {t:"info", eti:"Estrategias", h:"CSR, SSR y SSG",
  c:`<div class="diag">CSR (SPA con Vite)   el servidor envia un HTML vacio + JS; el navegador pinta todo
                     + simple de desplegar   - primera carga y SEO peores
SSR                  el servidor genera el HTML en cada peticion
                     + contenido visible antes, bueno para SEO   - necesita servidor
SSG                  el HTML se genera al compilar (blog, documentacion)
                     + rapidisimo y barato   - contenido estatico
ISR                  SSG que se regenera cada X segundos</div>
     <p>Con SSR, el navegador recibe HTML ya pintado y luego React se «engancha» a él para hacerlo interactivo: la <b>hidratación</b>.</p>`},
 {t:"par", p:"Empareja cada tipo de aplicación con la estrategia más natural",
  pares:[["Panel interno detrás de login","CSR (SPA)"],["Tienda online que debe posicionar en Google","SSR o SSG según la frecuencia de cambio"],["Documentación o blog","SSG"],["Catálogo que cambia cada hora","ISR"]],
  why:"Para tu API de Spring con un panel de administración, una SPA con Vite es perfectamente válida."},
 {t:"vf", p:"Una SPA pura con Vite necesita un servidor Node en producción.",
  ok:false, why:"Son ficheros estáticos: basta Nginx, una CDN o un bucket."}
]},

{
id:"re9l2",
titulo:"Next.js, Server Components y Server Actions",
claves:["Next.js es el framework de React más usado: enrutado por carpetas, SSR, SSG y API","Server Components se ejecutan solo en el servidor: pueden leer datos directamente y no envían su JS","\"use client\" marca los componentes interactivos; Server Actions ejecutan mutaciones en el servidor"],
pasos:[
 {t:"info", eti:"Componentes en el servidor", h:"Server Components",
  c:`<div class="termbox">// app/tareas/page.tsx (Server Component por defecto)
export default async function PaginaTareas() {
  const tareas = await db.tarea.findMany();          // acceso directo, en el servidor
  return (
    &lt;main&gt;
      &lt;h1&gt;Tareas&lt;/h1&gt;
      &lt;ListaTareas tareas={tareas} /&gt;
      &lt;FormularioTarea /&gt;
    &lt;/main&gt;
  );
}

// app/tareas/FormularioTarea.tsx
"use client";                                        // interactivo: se envia al navegador
export function FormularioTarea() {
  const [titulo, setTitulo] = useState("");
  return &lt;form action={crearTarea}&gt;...&lt;/form&gt;;
}

// app/tareas/acciones.ts
"use server";
export async function crearTarea(datos: FormData) {
  await db.tarea.create({ data: { titulo: String(datos.get("titulo")) } });
  revalidatePath("/tareas");
}</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Server Component","Se ejecuta en el servidor y no envía su JavaScript al navegador"],["\"use client\"","Marca un componente que necesita estado, efectos o eventos"],["Server Action","Función que se ejecuta en el servidor al enviar un formulario o invocarla"],["revalidatePath","Refrescar los datos cacheados de una ruta tras un cambio"]],
  why:"Las Server Actions son endpoints: valida y autoriza dentro de ellas igual que en una API."},
 {t:"opcion", p:"¿Puede un Server Component usar <code>useState</code>?",
  ops:["Sí","No: no tiene interactividad ni estado en el navegador; esa parte va en un componente con \"use client\"","Solo en desarrollo","Solo con Suspense"],
  ok:1, why:"La regla: servidor para datos y contenido, cliente para interacción."},
 {t:"vf", p:"Una Server Action puede confiar en los datos que recibe porque viene de tu propio formulario.",
  ok:false, why:"Cualquiera puede invocarla con datos manipulados: valida y comprueba permisos."}
]},

{
id:"re9l3",
titulo:"Novedades de React 19",
claves:["Actions: useActionState y useFormStatus para formularios con estado pendiente y errores","useOptimistic muestra el resultado antes de la confirmación del servidor","use() lee promesas y contexto; ref como prop sin forwardRef; React Compiler"],
pasos:[
 {t:"info", eti:"Lo nuevo", h:"Formularios y acciones",
  c:`<div class="termbox">function FormularioTarea() {
  const [estado, accion, pendiente] = useActionState(async (_prev: Estado, datos: FormData) =&gt; {
    const r = await crearTarea(datos);
    return r.ok ? { error: null } : { error: r.mensaje };
  }, { error: null });

  return (
    &lt;form action={accion}&gt;
      &lt;input name="titulo" /&gt;
      &lt;button disabled={pendiente}&gt;{pendiente ? "Guardando..." : "Añadir"}&lt;/button&gt;
      {estado.error &amp;&amp; &lt;p role="alert"&gt;{estado.error}&lt;/p&gt;}
    &lt;/form&gt;
  );
}

const [optimistas, anadirOptimista] = useOptimistic(tareas, (lista, nueva: Tarea) =&gt; [...lista, nueva]);</div>`},
 {t:"par", p:"Empareja cada API con su función",
  pares:[["useActionState","Estado y resultado de una acción de formulario"],["useFormStatus","Saber si el formulario padre se está enviando"],["useOptimistic","Mostrar un cambio antes de que el servidor lo confirme"],["use(promesa)","Leer el valor de una promesa dentro del render con Suspense"],["React Compiler","Memorización automática sin useMemo ni useCallback manuales"]],
  why:"Conocer las novedades demuestra que estás al día, aunque la base sigue siendo la misma."},
 {t:"vf", p:"En React 19 se puede pasar <code>ref</code> como una prop normal a los componentes de función.",
  ok:true, why:"Ya no hace falta forwardRef en la mayoría de casos."}
]}

]});
