window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Más hooks y hooks propios",
resumen: "Reglas de los hooks, useRef, useReducer, contexto con useContext y cómo crear tus propios hooks",
nivel: "Avanzado",
color: "#40b8dc",
lecciones: [

{
id:"re5l1",
titulo:"Reglas de los hooks y useRef",
claves:["Los hooks se llaman siempre en el mismo orden: nunca dentro de if, bucles o funciones anidadas","useRef guarda un valor que persiste sin provocar renders","useRef también da acceso a un elemento del DOM"],
pasos:[
 {t:"info", eti:"Las reglas", h:"Reglas de los hooks",
  c:`<ul><li>Llama a los hooks solo en el <b>nivel superior</b> del componente (o de otro hook).</li>
     <li>Nunca dentro de condiciones, bucles o después de un <code>return</code> temprano.</li>
     <li>Solo desde componentes o hooks propios (funciones que empiezan por <code>use</code>).</li></ul>
     <p>React identifica cada estado por el <b>orden</b> en que se llaman los hooks. Si ese orden cambia entre renders, los estados se mezclan.</p>`},
 {t:"info", eti:"Referencias", h:"useRef",
  c:`<div class="termbox">function Buscador() {
  const input = useRef&lt;HTMLInputElement&gt;(null);
  const renders = useRef(0);
  renders.current++;                        // cambiar .current NO provoca render

  return (
    &lt;&gt;
      &lt;input ref={input} /&gt;
      &lt;button onClick={() =&gt; input.current?.focus()}&gt;Buscar&lt;/button&gt;
    &lt;/&gt;
  );
}</div>`},
 {t:"par", p:"Empareja cada necesidad con useState o useRef",
  pares:[["Texto que se muestra en pantalla","useState: al cambiar debe verse"],["Id de un setInterval para poder cancelarlo","useRef: se guarda sin provocar render"],["Acceder a un input para darle el foco","useRef con el atributo ref"],["Lógica de estado con muchas transiciones","useReducer"]],
  why:"Regla: si al cambiar debe verse en pantalla, estado; si no, ref."},
 {t:"opcion", p:"¿Qué problema tiene <code>if (usuario) { const [x, setX] = useState(0); }</code>?",
  ops:["Ninguno","Viola las reglas de los hooks: si usuario cambia, el orden de los hooks cambia y el estado se corrompe","Es más lento","useState no admite 0"],
  ok:1, why:"El plugin eslint-plugin-react-hooks lo detecta."}
]},

{
id:"re5l2",
titulo:"useReducer y useContext",
claves:["useReducer centraliza lógica de estado compleja en una función (estado, acción) => nuevo estado","Context evita pasar props a través de muchos niveles","Un contexto que cambia a menudo re-renderiza a todos sus consumidores"],
pasos:[
 {t:"info", eti:"Estado complejo", h:"useReducer",
  c:`<div class="termbox">type Accion =
  | { tipo: "anadir"; titulo: string }
  | { tipo: "alternar"; id: number }
  | { tipo: "borrar"; id: number };

function reductor(tareas: Tarea[], a: Accion): Tarea[] {
  switch (a.tipo) {
    case "anadir":   return [...tareas, { id: Date.now(), titulo: a.titulo, hecha: false }];
    case "alternar": return tareas.map(t =&gt; t.id === a.id ? { ...t, hecha: !t.hecha } : t);
    case "borrar":   return tareas.filter(t =&gt; t.id !== a.id);
  }
}

const [tareas, despachar] = useReducer(reductor, []);
despachar({ tipo: "alternar", id: 3 });</div>
     <p>La lógica queda en una función pura, fácil de probar sin React. Es la misma idea que Redux.</p>`},
 {t:"info", eti:"Datos globales", h:"Context",
  c:`<div class="termbox">const SesionContext = createContext&lt;Sesion | null&gt;(null);

function ProveedorSesion({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState&lt;Usuario | null&gt;(null);
  const valor = useMemo(() =&gt; ({ usuario, entrar: setUsuario }), [usuario]);
  return &lt;SesionContext.Provider value={valor}&gt;{children}&lt;/SesionContext.Provider&gt;;
}

function useSesion() {
  const s = useContext(SesionContext);
  if (!s) throw new Error("useSesion fuera de ProveedorSesion");
  return s;
}</div>`},
 {t:"par", p:"Empareja cada herramienta con su mejor uso",
  pares:[["useState","Estado simple y local"],["useReducer","Estado con muchas transiciones relacionadas"],["Context","Datos que muchos componentes necesitan (tema, sesión, idioma)"],["Zustand o Redux Toolkit","Estado global complejo que cambia a menudo"]],
  why:"Context no es un gestor de estado: es una forma de pasar valores sin props intermedias."},
 {t:"opcion", p:"Metes en un único contexto el usuario y también la posición del ratón, que cambia constantemente. ¿Qué pasa?",
  ops:["Nada","Cada movimiento re-renderiza todos los componentes que usan el contexto, aunque solo necesiten el usuario","El ratón deja de funcionar","Mejora el rendimiento"],
  ok:1, why:"Separa contextos por frecuencia de cambio o usa un gestor con selectores."}
]},

{
id:"re5l3",
titulo:"Hooks propios",
claves:["Un hook propio es una función que empieza por use y usa otros hooks","Reutiliza lógica con estado, no el estado en sí: cada uso tiene el suyo","Ejemplos: useFetch, useDebounce, useLocalStorage"],
pasos:[
 {t:"info", eti:"Reutilizar lógica", h:"Crear hooks",
  c:`<div class="termbox">function useDebounce&lt;T&gt;(valor: T, ms = 300): T {
  const [retrasado, setRetrasado] = useState(valor);
  useEffect(() =&gt; {
    const t = setTimeout(() =&gt; setRetrasado(valor), ms);
    return () =&gt; clearTimeout(t);
  }, [valor, ms]);
  return retrasado;
}

function useLocalStorage&lt;T&gt;(clave: string, inicial: T) {
  const [valor, setValor] = useState&lt;T&gt;(() =&gt; {
    try { const g = localStorage.getItem(clave); return g ? JSON.parse(g) : inicial; }
    catch { return inicial; }
  });
  useEffect(() =&gt; {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch {}
  }, [clave, valor]);
  return [valor, setValor] as const;
}

// uso
const busquedaLenta = useDebounce(busqueda, 400);
const [tema, setTema] = useLocalStorage("tema", "oscuro");</div>`},
 {t:"par", p:"Empareja cada hook propio con lo que encapsula",
  pares:[["useDebounce","Retrasar un valor hasta que deja de cambiar"],["useLocalStorage","Estado que se guarda en el navegador"],["useMediaQuery","Saber si la pantalla es de móvil"],["useSesion","Acceder al contexto de sesión con comprobación"]],
  why:"Los hooks propios hacen que los componentes lean como una lista de intenciones."},
 {t:"vf", p:"Dos componentes que llaman al mismo hook propio comparten su estado.",
  ok:false, why:"Cada llamada tiene su propio estado. Para compartir, contexto o un store."}
]},

{
id:"re5l4",
titulo:"Error boundaries, portales y Suspense",
claves:["Un error boundary captura errores de renderizado de sus hijos y muestra una alternativa","createPortal pinta un componente fuera de su padre en el DOM (modales)","Suspense muestra un fallback mientras se carga código o datos"],
pasos:[
 {t:"info", eti:"Robustez", h:"Tres herramientas",
  c:`<div class="termbox">// error boundary (con la libreria react-error-boundary)
&lt;ErrorBoundary fallback={&lt;p&gt;Algo ha fallado en el panel.&lt;/p&gt;}&gt;
  &lt;PanelInformes /&gt;
&lt;/ErrorBoundary&gt;

// portal: el modal se pinta en document.body, fuera de contenedores con overflow
function Modal({ children }: { children: React.ReactNode }) {
  return createPortal(&lt;div className="modal"&gt;{children}&lt;/div&gt;, document.body);
}

// Suspense con carga diferida
&lt;Suspense fallback={&lt;Cargando /&gt;}&gt;
  &lt;Informes /&gt;
&lt;/Suspense&gt;</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["Error boundary","Que un error en un widget no deje la página en blanco"],["createPortal","Modales, menús y avisos por encima de todo"],["Suspense","Mostrar un indicador mientras llega código o datos"],["Fallback","Lo que se ve mientras tanto (o si falla)"]],
  why:"Un error de render sin boundary desmonta toda la aplicación."},
 {t:"vf", p:"Un error boundary captura también los errores lanzados dentro de un manejador onClick.",
  ok:false, why:"Solo los de renderizado y ciclo de vida. Los de eventos se gestionan con try/catch en el manejador."}
]}

]});
