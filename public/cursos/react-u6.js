window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Reducers, contexto y hooks propios",
resumen: "useReducer para lógica de estado compleja, contexto para datos que atraviesan el árbol, combinarlos, crear hooks propios y los hooks para casos especiales: useId, useSyncExternalStore y useLayoutEffect",
nivel: "Avanzado",
color: "#40b8dc",
lecciones: [

/* =============== U6 L1 =============== */
{
id:"re5l2",
titulo:"useReducer",
claves:["useReducer centraliza la lógica en una función pura (estado, acción) => nuevo estado","Los componentes despachan acciones que describen qué pasó; el reductor decide cómo cambia el estado","Útil cuando muchas actualizaciones tocan el mismo estado o dependen unas de otras"],
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
    default: { const _nunca: never = a; throw new Error("Acción desconocida"); }
  }
}

function Tareas() {
  const [tareas, despachar] = useReducer(reductor, []);
  return &lt;Lista tareas={tareas} onAlternar={id =&gt; despachar({ tipo: "alternar", id })} /&gt;;
}</div>
     <p>La lógica queda en una función <b>pura</b>, fuera del componente, fácil de probar sin React. Las acciones describen <b>qué ocurrió</b> («alternar la tarea 3»), no cómo cambiar el estado. Es la misma idea que Redux.</p>
     <p>El <code>never</code> del <code>default</code> hace que TypeScript avise si añades un tipo de acción y olvidas tratarlo.</p>`},
 {t:"info", eti:"Cuándo", h:"useState o useReducer",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">comparación</div><table class="dg-tabla"><thead><tr><th></th><th>useState</th><th>useReducer</th></tr></thead><tbody>
       <tr><td>Código</td><td>menos para casos simples</td><td>más, pero la lógica queda junta</td></tr>
       <tr><td>Legibilidad</td><td>buena con pocas actualizaciones</td><td>mejor con muchas y relacionadas</td></tr>
       <tr><td>Depurar</td><td>set repartidos por el componente</td><td>un console.log en el reductor ve todas las acciones</td></tr>
       <tr><td>Probar</td><td>necesita el componente</td><td>el reductor es una función pura</td></tr>
     </tbody></table></div>
     <p>El tercer argumento, <code>useReducer(reductor, arg, init)</code>, es el inicializador perezoso: el estado inicial se calcula con <code>init(arg)</code> solo una vez. Y <code>despachar</code> tiene identidad estable: se puede pasar a hijos memorizados sin <code>useCallback</code>.</p>`},
 {t:"par", p:"Empareja cada pieza con su papel",
  pares:[["reductor(estado, accion)","Calcula el siguiente estado sin efectos secundarios"],["despachar({ tipo: \"borrar\", id })","Informa de lo que pasó"],["{ tipo, ...datos }","Acción: describe el suceso"],["useReducer(reductor, inicial)","Conecta el reductor con el componente"],["Unión discriminada por tipo","Tipar todas las acciones posibles"]],
  why:"Un reductor nunca hace fetch ni setTimeout: debe devolver lo mismo con la misma entrada, igual que un componente."},
 {t:"opcion", p:"Un reductor hace <code>case \"anadir\": estado.push(a.item); return estado;</code>. ¿Qué pasa?",
  ops:["Funciona bien","No se re-renderiza: devuelve la misma referencia mutada; hay que devolver [...estado, a.item]","Da un error de sintaxis","Se añade dos veces siempre"],
  ok:1, why:"Mismas reglas que con useState: el estado se reemplaza, nunca se muta. En StrictMode el reductor además se ejecuta dos veces y la mutación duplicaría el elemento."},
 {t:"opcion", p:"¿Dónde deberías llamar a la API para guardar una tarea en una app con useReducer?",
  ops:["Dentro del reductor","En el manejador del evento (o una acción) y despachar según el resultado","En el return del componente","En el estado inicial"],
  ok:1, why:"El reductor debe ser puro. Los efectos secundarios van en manejadores; el reductor solo calcula."},
 {t:"hueco", p:"Completa la declaración",
  tpl:"const [estado, ___] = useReducer(___, { cuenta: 0 });",
  banco:["despachar","reductor","setEstado","useState","accion"], sol:["despachar","reductor"],
  why:"El nombre en inglés habitual es dispatch."},
 {t:"codigo", p:"Escribe el reductor de un carrito y muestra el estado final tras una serie de acciones",
  lenguaje:"js",
  c:`<p>Cada línea de stdin es una acción en JSON: <code>{"tipo":"anadir","id","precio"}</code> (si ya está, suma 1 a su cantidad; si no, entra con cantidad 1 al final), <code>{"tipo":"quitar","id"}</code>, <code>{"tipo":"cantidad","id","n"}</code> (si n ≤ 0, lo quita) y <code>{"tipo":"vaciar"}</code>. El estado se congela (<code>Object.freeze</code>) entre acciones: si mutas, fallará. El programa imprime <code>id xCANT = SUBTOTAL</code> por artículo y <code>total: T</code>, o <code>carrito vacío</code>.</p>`,
  plantilla:"\"use strict\";\nconst acciones = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(l => JSON.parse(l));\nfunction reductor(items, a) {\n  // devuelve el nuevo array de { id, precio, cantidad } sin mutar items\n  return items;\n}\nconst congelar = items => Object.freeze(items.map(i => Object.freeze(i)));\nlet estado = congelar([]);\nfor (const a of acciones) estado = congelar(reductor(estado, a));\nif (estado.length === 0) console.log(\"carrito vacío\");\nelse {\n  for (const i of estado) console.log(i.id + \" x\" + i.cantidad + \" = \" + i.precio * i.cantidad);\n  console.log(\"total: \" + estado.reduce((s, i) => s + i.precio * i.cantidad, 0));\n}\n",
  pruebas:[{entrada:'{"tipo":"anadir","id":"p1","precio":10}\n{"tipo":"anadir","id":"p2","precio":5}\n{"tipo":"anadir","id":"p1","precio":10}\n', salida:"p1 x2 = 20\np2 x1 = 5\ntotal: 25"},{entrada:'{"tipo":"anadir","id":"a","precio":3}\n{"tipo":"cantidad","id":"a","n":4}\n{"tipo":"anadir","id":"b","precio":1}\n{"tipo":"quitar","id":"a"}\n', salida:"b x1 = 1\ntotal: 1"},{entrada:'{"tipo":"anadir","id":"a","precio":2}\n{"tipo":"cantidad","id":"a","n":0}\n{"tipo":"anadir","id":"c","precio":7}\n{"tipo":"vaciar"}\n{"tipo":"anadir","id":"d","precio":1.5}\n{"tipo":"anadir","id":"d","precio":1.5}\n', salida:"d x2 = 3\ntotal: 3", oculta:true}],
  pista:"Un switch por a.tipo. Para anadir: si items.some(i => i.id === a.id), map sumando 1; si no, [...items, { id: a.id, precio: a.precio, cantidad: 1 }].",
  solucion:"\"use strict\";\nconst acciones = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\").map(l => JSON.parse(l));\nfunction reductor(items, a) {\n  switch (a.tipo) {\n    case \"anadir\":\n      return items.some(i => i.id === a.id)\n        ? items.map(i => i.id === a.id ? { ...i, cantidad: i.cantidad + 1 } : i)\n        : [...items, { id: a.id, precio: a.precio, cantidad: 1 }];\n    case \"quitar\": return items.filter(i => i.id !== a.id);\n    case \"cantidad\":\n      return a.n <= 0 ? items.filter(i => i.id !== a.id) : items.map(i => i.id === a.id ? { ...i, cantidad: a.n } : i);\n    case \"vaciar\": return [];\n    default: throw new Error(\"Acción desconocida: \" + a.tipo);\n  }\n}\nconst congelar = items => Object.freeze(items.map(i => Object.freeze(i)));\nlet estado = congelar([]);\nfor (const a of acciones) estado = congelar(reductor(estado, a));\nif (estado.length === 0) console.log(\"carrito vacío\");\nelse {\n  for (const i of estado) console.log(i.id + \" x\" + i.cantidad + \" = \" + i.precio * i.cantidad);\n  console.log(\"total: \" + estado.reduce((s, i) => s + i.precio * i.cantidad, 0));\n}\n",
  why:"Este reductor se puede usar tal cual con useReducer, con Redux Toolkit (createSlice) o probar con Vitest sin montar ningún componente."}
]},

/* =============== U6 L2 =============== */
{
id:"re6n1",
titulo:"Contexto",
claves:["Context pasa un valor a todo un subárbol sin props intermedias: createContext, proveedor y useContext (o use)","En React 19 el propio contexto hace de proveedor: <TemaContext value={...}>","Cuando cambia el valor, se re-renderizan todos los consumidores: memoriza el valor y separa contextos por frecuencia de cambio"],
pasos:[
 {t:"info", eti:"Datos que atraviesan el árbol", h:"createContext y useContext",
  c:`<div class="termbox">type Sesion = { usuario: Usuario | null; entrar: (u: Usuario) =&gt; void; salir: () =&gt; void };
const SesionContext = createContext&lt;Sesion | null&gt;(null);

export function ProveedorSesion({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState&lt;Usuario | null&gt;(null);
  const valor = useMemo(() =&gt; ({ usuario, entrar: setUsuario, salir: () =&gt; setUsuario(null) }), [usuario]);
  return &lt;SesionContext value={valor}&gt;{children}&lt;/SesionContext&gt;;     // React 19
}                                   // antes de React 19: &lt;SesionContext.Provider value={valor}&gt;

export function useSesion() {
  const s = useContext(SesionContext);
  if (!s) throw new Error("useSesion debe usarse dentro de ProveedorSesion");
  return s;
}</div>
     <p>Un componente lee el valor del <b>proveedor más cercano</b> por encima en el árbol; si no hay ninguno, recibe el valor por defecto de <code>createContext</code>. Los proveedores se pueden anidar para sobrescribir un valor en una parte del árbol (un tema oscuro solo en la barra lateral).</p>
     <p>Usos típicos: tema, idioma, usuario autenticado, configuración, y el estado compartido de componentes compuestos (Tabs, Menu).</p>`},
 {t:"info", eti:"Escalar", h:"Reductor + contexto, y el coste de los renders",
  c:`<div class="termbox">const TareasContext = createContext&lt;Tarea[]&gt;([]);
const DespacharContext = createContext&lt;React.Dispatch&lt;Accion&gt;&gt;(() =&gt; {});

function ProveedorTareas({ children }: { children: React.ReactNode }) {
  const [tareas, despachar] = useReducer(reductor, []);
  return (
    &lt;TareasContext value={tareas}&gt;
      &lt;DespacharContext value={despachar}&gt;{children}&lt;/DespacharContext&gt;
    &lt;/TareasContext&gt;
  );
}
// un botón que solo despacha no se re-renderiza cuando cambian las tareas</div>
     <p>Cuando el valor de un contexto cambia (por <code>Object.is</code>), <b>todos</b> sus consumidores se re-renderizan, aunque solo usen una parte. Por eso:</p>
     <ul><li>Memoriza el objeto <code>value</code> con <code>useMemo</code> (o deja que lo haga el React Compiler); si no, es nuevo en cada render del proveedor.</li>
     <li>Separa en contextos distintos lo que cambia a menudo y lo que casi no cambia (datos y funciones, como arriba).</li>
     <li>Para estado global que cambia mucho, un store con <b>selectores</b> (Zustand, Redux) re-renderiza solo a quien usa la parte que cambió.</li></ul>`},
 {t:"par", p:"Empareja cada herramienta con su mejor uso",
  pares:[["useState","Estado simple y local"],["useReducer","Estado con muchas transiciones relacionadas"],["Context","Datos que muchos componentes lejanos necesitan (tema, sesión, idioma)"],["Zustand o Redux Toolkit","Estado global complejo que cambia a menudo"],["Composición con children","Evitar pasar props por niveles intermedios sin contexto"]],
  why:"Context no es un gestor de estado: es una forma de pasar valores sin props intermedias."},
 {t:"opcion", p:"Metes en un único contexto el usuario y también la posición del ratón, que cambia constantemente. ¿Qué pasa?",
  ops:["Nada","Cada movimiento re-renderiza todos los componentes que usan el contexto, aunque solo necesiten el usuario","El ratón deja de funcionar","Mejora el rendimiento"],
  ok:1, why:"Separa contextos por frecuencia de cambio o usa un gestor con selectores."},
 {t:"opcion", p:"¿Qué se renderiza?<br><code>const Tema = createContext(\"claro\");</code><br><code>function Etiqueta() { return &lt;p&gt;{useContext(Tema)}&lt;/p&gt;; }</code><br><code>&lt;Tema value=\"oscuro\"&gt;&lt;Etiqueta /&gt;&lt;Tema value=\"azul\"&gt;&lt;Etiqueta /&gt;&lt;/Tema&gt;&lt;/Tema&gt;&lt;Etiqueta /&gt;</code>",
  ops:["oscuro · oscuro · oscuro","oscuro · azul · claro","azul · azul · claro","claro · claro · claro"],
  ok:1, why:"Cada Etiqueta lee el proveedor más cercano por encima; la última no tiene ninguno y usa el valor por defecto."},
 {t:"hueco", p:"Completa el hook que protege el uso del contexto",
  tpl:"function useTema() {\n  const t = ___(TemaContext);\n  if (t === null) throw new ___(\"useTema fuera del proveedor\");\n  return t;\n}",
  banco:["useContext","Error","useState","createContext","console"], sol:["useContext","Error"],
  why:"El error explícito ahorra media hora de «¿por qué es undefined?» cuando alguien olvida el proveedor."},
 {t:"vf", p:"Si el proveedor crea el objeto <code>value={{ usuario, salir }}</code> directamente en el JSX, los consumidores se re-renderizan cada vez que el proveedor renderiza, aunque usuario no cambie.",
  ok:true, why:"Es un objeto nuevo en cada render. useMemo (o el React Compiler) lo evita."}
]},

/* =============== U6 L3 =============== */
{
id:"re5l3",
titulo:"Hooks propios",
claves:["Un hook propio es una función que empieza por use y llama a otros hooks","Reutiliza lógica con estado, no el estado en sí: cada llamada tiene el suyo","Un buen hook tiene un propósito concreto (useOnline, useDebounce) y no es un simple envoltorio de un efecto"],
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

// uso: el componente se lee como una lista de intenciones
const busquedaLenta = useDebounce(busqueda, 400);
const [tema, setTema] = useLocalStorage("tema", "oscuro");</div>`},
 {t:"info", eti:"Buen diseño", h:"Qué hace un buen hook propio",
  c:`<ul><li><b>El nombre empieza por <code>use</code></b>: así el linter aplica las reglas de los hooks. Si una función no llama a ningún hook, no la llames <code>useAlgo</code>: es una función normal.</li>
     <li><b>Propósito concreto</b>: <code>useOnline()</code>, <code>useMediaQuery(q)</code>, <code>useCarrito()</code>. Evita hooks de «ciclo de vida» como <code>useMount(fn)</code>: ocultan la sincronización y engañan al linter.</li>
     <li><b>Comparten lógica, no estado</b>: dos componentes que llaman a <code>useDebounce</code> tienen cada uno su estado. Para compartir estado de verdad hace falta contexto o un store.</li>
     <li><b>Devuelve lo mínimo</b>: una tupla si es como useState, un objeto si devuelve varias cosas con nombre.</li></ul>
     <div class="termbox">function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() =&gt; {
    const on = () =&gt; setOnline(true), off = () =&gt; setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () =&gt; { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}</div>`},
 {t:"par", p:"Empareja cada hook propio con lo que encapsula",
  pares:[["useDebounce","Retrasar un valor hasta que deja de cambiar"],["useLocalStorage","Estado que se guarda en el navegador"],["useMediaQuery","Saber si la pantalla es de móvil"],["useSesion","Acceder al contexto de sesión con comprobación"],["useOnline","Saber si hay conexión a Internet"]],
  why:"Los hooks propios hacen que los componentes lean como una lista de intenciones."},
 {t:"vf", p:"Dos componentes que llaman al mismo hook propio comparten su estado.",
  ok:false, why:"Cada llamada tiene su propio estado. Para compartir, contexto o un store."},
 {t:"opcion", p:"Una función <code>useFormatearFecha(fecha)</code> solo hace <code>return fecha.toLocaleDateString(\"es\")</code>. ¿Qué opinas?",
  ops:["Perfecta","No usa hooks: debería ser una función normal (formatearFecha), que además se puede llamar donde quieras, incluso en condiciones","Debería usar useEffect","Debería usar useMemo siempre"],
  ok:1, why:"El prefijo use promete que dentro hay hooks y obliga a cumplir sus reglas sin necesidad."},
 {t:"opcion", p:"Un buscador usa <code>const q2 = useDebounce(q, 400)</code> y un efecto que busca con <code>q2</code>. El usuario escribe «react» rápido. ¿Cuántas búsquedas se lanzan?",
  ops:["Cinco, una por letra","Una, 400 ms después de la última tecla","Ninguna","Dos"],
  ok:1, why:"Cada tecla cancela el temporizador anterior en la limpieza; solo el último llega a actualizar q2."},
 {t:"hueco", p:"Completa el hook para que devuelva el valor anterior de una variable",
  tpl:"function usePrevio(valor) {\n  const [actual, setActual] = useState(valor);\n  const [previo, setPrevio] = useState(null);\n  if (valor !== ___) {\n    setPrevio(actual);\n    ___(valor);\n  }\n  return previo;\n}",
  banco:["actual","setActual","previo","setPrevio","valor"], sol:["actual","setActual"],
  why:"Actualizar estado durante el render, con condición, es el patrón que recomienda React para ajustar estado cuando cambia una prop, en lugar de un efecto."}
]},

/* =============== U6 L4 =============== */
{
id:"re6n2",
titulo:"Hooks para casos especiales",
claves:["useId genera ids únicos y estables, iguales en servidor y cliente, para asociar etiquetas y ARIA","useSyncExternalStore suscribe un componente a un almacén externo (APIs del navegador, stores) sin desgarros","useLayoutEffect se ejecuta antes de que el navegador pinte: solo para medir y colocar sin parpadeo"],
pasos:[
 {t:"info", eti:"Ids accesibles", h:"useId",
  c:`<div class="termbox">function Campo({ etiqueta, ayuda }: { etiqueta: string; ayuda: string }) {
  const id = useId();                      // id opaco, estable y único
  return (
    &lt;&gt;
      &lt;label htmlFor={id}&gt;{etiqueta}&lt;/label&gt;
      &lt;input id={id} aria-describedby={id + "-ayuda"} /&gt;
      &lt;p id={id + "-ayuda"}&gt;{ayuda}&lt;/p&gt;
    &lt;/&gt;
  );
}</div>
     <p>Si <code>Campo</code> aparece dos veces en la página, cada uno tiene su id. Un contador global o <code>Math.random()</code> no sirve: con renderizado en servidor el id del HTML y el del cliente no coincidirían (error de hidratación). <code>useId</code> <b>no</b> sirve para keys de listas.</p>`},
 {t:"info", eti:"Fuera de React", h:"useSyncExternalStore y useLayoutEffect",
  c:`<div class="termbox">// suscribirse a algo que no es de React
function suscribir(cb: () =&gt; void) {
  window.addEventListener("online", cb); window.addEventListener("offline", cb);
  return () =&gt; { window.removeEventListener("online", cb); window.removeEventListener("offline", cb); };
}
function useOnline() {
  return useSyncExternalStore(suscribir, () =&gt; navigator.onLine, () =&gt; true);
}          //                  subscribe   getSnapshot            getServerSnapshot

// medir antes de pintar para colocar un tooltip sin parpadeo
useLayoutEffect(() =&gt; {
  const { height } = ref.current!.getBoundingClientRect();
  setAlto(height);
}, []);</div>
     <p><code>useSyncExternalStore</code> es lo que usan Zustand, Redux y TanStack Query por dentro. Garantiza que, con renderizado concurrente, todos los componentes ven la <b>misma versión</b> del almacén en un render (sin «desgarros»). <code>getSnapshot</code> debe devolver el mismo valor si nada cambió (no un objeto nuevo cada vez) o provocará renders infinitos.</p>
     <p><code>useLayoutEffect</code> bloquea el pintado: úsalo solo cuando una medida decide lo que se ve. Para todo lo demás, <code>useEffect</code>.</p>`},
 {t:"par", p:"Empareja cada hook con su caso de uso",
  pares:[["useId","Asociar un label con su input en un componente reutilizable"],["useSyncExternalStore","Leer el estado de un store externo o una API del navegador"],["useLayoutEffect","Medir un elemento y recolocarlo antes de que se pinte"],["useDebugValue","Mostrar una etiqueta de un hook propio en React DevTools"],["useInsertionEffect","Insertar estilos antes que nada (librerías de CSS-in-JS)"]],
  why:"Los dos últimos son para autores de librerías; en una app normal casi nunca hacen falta."},
 {t:"opcion", p:"Generas ids de campos con <code>let n = 0; const id = \"campo-\" + n++;</code> y con SSR aparece un error de hidratación. ¿Solución?",
  ops:["Usar Math.random()","Usar useId(), que produce el mismo id en servidor y cliente","Desactivar SSR","Usar el índice"],
  ok:1, why:"El contador global avanza distinto en el servidor (que atiende muchas peticiones) y en el navegador."},
 {t:"opcion", p:"Tu <code>getSnapshot</code> devuelve <code>{ ancho: window.innerWidth }</code> y el componente entra en un bucle de renders. ¿Por qué?",
  ops:["useSyncExternalStore no admite objetos","Devuelve un objeto nuevo en cada llamada: React cree que el almacén cambió siempre. Devuelve un primitivo (window.innerWidth) o un objeto cacheado","Falta getServerSnapshot","Falta un useEffect"],
  ok:1, why:"React llama a getSnapshot varias veces y compara con Object.is."},
 {t:"vf", p:"useLayoutEffect es la opción por defecto para cualquier efecto porque se ejecuta antes.",
  ok:false, why:"Bloquea el pintado y empeora el rendimiento percibido. Solo para medir y ajustar el diseño antes de pintar."},
 {t:"codigo", p:"Implementa <code>crearStore(inicial)</code>, un almacén externo compatible con useSyncExternalStore",
  lenguaje:"js",
  c:`<p>Debe devolver <code>{ getSnapshot, subscribe, setState }</code>. <code>subscribe(fn)</code> guarda el oyente y devuelve una función para darlo de baja. <code>setState(v)</code>: si <code>Object.is(v, estado)</code>, no hace nada y devuelve <code>false</code>; si cambia, guarda el valor, avisa a los oyentes en orden de alta y devuelve <code>true</code>. El programa lee órdenes <code>sub X</code>, <code>unsub X</code> y <code>set N</code>, e imprime lo que ve cada oyente o <code>sin cambios</code>.</p>`,
  plantilla:"function crearStore(inicial) {\n  // tu código\n  return {};\n}\nconst store = crearStore(0);\nconst bajas = {};\nfor (const linea of require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\")) {\n  const [orden, arg] = linea.split(\" \");\n  if (orden === \"sub\") bajas[arg] = store.subscribe(() => console.log(arg + \" ve \" + store.getSnapshot()));\n  if (orden === \"unsub\") bajas[arg]();\n  if (orden === \"set\" && !store.setState(Number(arg))) console.log(\"sin cambios\");\n}\n",
  pruebas:[{entrada:"sub A\nsub B\nset 1\nset 1\nunsub A\nset 2\n", salida:"A ve 1\nB ve 1\nsin cambios\nB ve 2"},{entrada:"set 5\nsub X\nset 6\n", salida:"X ve 6"},{entrada:"sub A\nset 0\nset 3\nunsub A\nset 4\nsub B\nset 4\n", salida:"sin cambios\nA ve 3\nsin cambios", oculta:true}],
  pista:"Un let estado y un Set de oyentes (mantiene el orden de inserción). subscribe devuelve () => oyentes.delete(fn).",
  solucion:"function crearStore(inicial) {\n  let estado = inicial;\n  const oyentes = new Set();\n  return {\n    getSnapshot: () => estado,\n    subscribe(fn) { oyentes.add(fn); return () => oyentes.delete(fn); },\n    setState(v) {\n      if (Object.is(v, estado)) return false;\n      estado = v;\n      oyentes.forEach(fn => fn());\n      return true;\n    },\n  };\n}\nconst store = crearStore(0);\nconst bajas = {};\nfor (const linea of require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\")) {\n  const [orden, arg] = linea.split(\" \");\n  if (orden === \"sub\") bajas[arg] = store.subscribe(() => console.log(arg + \" ve \" + store.getSnapshot()));\n  if (orden === \"unsub\") bajas[arg]();\n  if (orden === \"set\" && !store.setState(Number(arg))) console.log(\"sin cambios\");\n}\n",
  why:"Con esto y useSyncExternalStore(store.subscribe, store.getSnapshot) tienes un Zustand en miniatura."}
]}

]});
