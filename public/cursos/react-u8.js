window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Calidad: pruebas, accesibilidad y arquitectura",
resumen: "Pruebas con Testing Library y Vitest, accesibilidad, estilos, estado global y cómo organizar una aplicación React",
nivel: "Experto",
color: "#33a9cf",
lecciones: [

{
id:"re8l1",
titulo:"Pruebas con Testing Library",
claves:["Prueba lo que ve y hace el usuario, no los detalles internos","Busca por rol y texto: getByRole, getByLabelText","userEvent simula interacciones reales; MSW simula la API"],
pasos:[
 {t:"info", eti:"Probar como un usuario", h:"Testing Library",
  c:`<div class="termbox">import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("añade una tarea", async () =&gt; {
  const usuario = userEvent.setup();
  render(&lt;PaginaTareas /&gt;);

  await usuario.type(screen.getByLabelText("Tarea"), "Repasar React");
  await usuario.click(screen.getByRole("button", { name: "Añadir" }));

  expect(screen.getByText("Repasar React")).toBeInTheDocument();
});

test("muestra error si el título está vacío", async () =&gt; {
  render(&lt;PaginaTareas /&gt;);
  await userEvent.click(screen.getByRole("button", { name: "Añadir" }));
  expect(screen.getByRole("alert")).toHaveTextContent("obligatorio");
});</div>
     <p>Para los datos, <b>MSW</b> (Mock Service Worker) intercepta las peticiones y devuelve respuestas falsas: tus componentes usan fetch de verdad.</p>`},
 {t:"par", p:"Empareja cada consulta con cuándo usarla",
  pares:[["getByRole(\"button\", { name })","Elementos interactivos: la opción preferida"],["getByLabelText","Campos de formulario por su etiqueta"],["getByText","Texto visible"],["findBy...","Elementos que aparecen de forma asíncrona"],["queryBy...","Comprobar que algo NO está"]],
  why:"Si no puedes encontrar un botón por su rol y nombre, un lector de pantalla tampoco: el test también mide accesibilidad."},
 {t:"opcion", p:"¿Por qué evitar probar el estado interno de un componente (por ejemplo, el valor de un useState)?",
  ops:["Porque no se puede","Porque ata la prueba a la implementación: un refactor que no cambia el comportamiento la rompería","Porque es lento","Porque React lo prohíbe"],
  ok:1, why:"Prueba el comportamiento observable: lo que se ve y lo que pasa al interactuar."}
]},

{
id:"re8l2",
titulo:"Accesibilidad",
claves:["HTML semántico primero: button, label, nav, main, h1-h6","Todo manejable con teclado y con foco visible","Textos alternativos, contraste y ARIA solo cuando el HTML no basta"],
pasos:[
 {t:"info", eti:"Para todas las personas", h:"Lo esencial",
  c:`<div class="termbox">&lt;div onClick={borrar}&gt;Borrar&lt;/div&gt;            // MAL: no llega con teclado ni lo anuncia un lector
&lt;button onClick={borrar}&gt;Borrar&lt;/button&gt;      // BIEN

&lt;img src="grafico.png" /&gt;                        // MAL: sin alternativa
&lt;img src="grafico.png" alt="Ventas de septiembre: suben un 12%" /&gt;

&lt;button aria-label="Cerrar diálogo"&gt;&lt;IconoX /&gt;&lt;/button&gt;   // boton solo con icono

&lt;label htmlFor="email"&gt;Email&lt;/label&gt;&lt;input id="email" type="email" /&gt;</div>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Div con onClick como botón","Usar <button>"],["Imagen informativa sin texto","Atributo alt descriptivo"],["Botón que solo tiene un icono","aria-label"],["Campo sin etiqueta","<label htmlFor> asociado al id"],["Mensaje de error que no se anuncia","role=\"alert\" o aria-live"]],
  why:"Herramientas: Lighthouse, axe DevTools y navegar tu propia app solo con el teclado."},
 {t:"vf", p:"Añadir ARIA a todo mejora siempre la accesibilidad.",
  ok:false, why:"La primera regla de ARIA es no usarla si hay un elemento HTML nativo que ya lo hace. ARIA mal usado empeora las cosas."}
]},

{
id:"re8l3",
titulo:"Estilos, estado global y arquitectura",
claves:["Estilos: CSS Modules, Tailwind o CSS-in-JS; elige uno y sé coherente","Estado global solo para lo realmente global: Zustand o Redux Toolkit","Organiza por funcionalidad y separa componentes de presentación de la lógica"],
pasos:[
 {t:"info", eti:"Decisiones", h:"Las piezas de una app real",
  c:`<div class="diag">src/
  app/            router, proveedores, layout
  features/
    tareas/       componentes, hooks (useTareas), api, tipos, tests
    sesion/
  shared/
    ui/           Boton, Modal, Campo... (sin logica de negocio)
    lib/          cliente http, utilidades</div>
     <div class="termbox">// estado global sencillo con Zustand
const useCarrito = create&lt;Carrito&gt;(set =&gt; ({
  items: [],
  anadir: (p) =&gt; set(s =&gt; ({ items: [...s.items, p] })),
}));
const total = useCarrito(s =&gt; s.items.length);   // selector: solo re-renderiza si cambia</div>`},
 {t:"par", p:"Empareja cada tipo de estado con dónde vive mejor",
  pares:[["Datos de la API","TanStack Query (caché del servidor)"],["Estado de un formulario","Local (useState o React Hook Form)"],["Filtros de una lista compartibles por enlace","En la URL (parámetros de búsqueda)"],["Carrito o tema en toda la app","Store global ligero (Zustand) o contexto"]],
  why:"La mayoría del «estado global» de las apps antiguas era en realidad caché del servidor."},
 {t:"opcion", p:"¿Dónde guardarías los filtros de una lista de pedidos para que el usuario pueda compartir el enlace con esos filtros?",
  ops:["En un useState","En la URL como parámetros de búsqueda","En localStorage","En una variable global"],
  ok:1, why:"La URL también es estado: y se puede compartir, recargar y usar con el botón atrás."}
]},

{
id:"re8l4",
titulo:"Estilos y sistemas de diseño",
claves:["CSS Modules: clases con ámbito por componente","Tailwind: utilidades en el marcado, rápido y consistente","Un sistema de diseño con tokens (colores, espacios) y componentes base accesibles"],
pasos:[
 {t:"info", eti:"Dar estilo", h:"Opciones habituales",
  c:`<div class="termbox">// CSS Modules
import estilos from "./Tarjeta.module.css";
&lt;div className={estilos.tarjeta}&gt;...&lt;/div&gt;

// Tailwind
&lt;div className="rounded-lg border p-4 shadow-sm dark:bg-zinc-900"&gt;...&lt;/div&gt;

// tokens de diseno con variables CSS (como en esta plataforma)
:root { --acento: #f5b642; --radio: 10px; --espacio: 16px; }
[data-theme="dark"] { --fondo: #0d1016; }</div>`},
 {t:"par", p:"Empareja cada enfoque con su característica",
  pares:[["CSS Modules","CSS normal con nombres de clase únicos por componente"],["Tailwind","Clases utilitarias directamente en el JSX"],["CSS-in-JS (styled-components)","Estilos escritos en JavaScript junto al componente"],["Variables CSS","Tokens de tema que cambian en claro y oscuro"],["shadcn/ui o Radix","Componentes base accesibles para construir tu sistema de diseño"]],
  why:"Lo importante no es la herramienta, sino ser coherente en todo el proyecto."},
 {t:"opcion", p:"¿Cómo implementarías el modo claro y oscuro de forma sencilla?",
  ops:["Duplicando todos los estilos","Con variables CSS (tokens) que cambian según un atributo o la preferencia del sistema","Con imágenes","Recargando la página"],
  ok:1, why:"Es exactamente como está hecho el tema de esta plataforma."}
]}

]});
