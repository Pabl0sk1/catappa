window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Rendimiento",
resumen: "Cuándo se renderiza un componente, memo, useMemo y useCallback, el compilador de React, carga diferida y listas largas",
nivel: "Avanzado",
color: "#33a9cf",
lecciones: [

{
id:"re7l1",
titulo:"Cuándo y por qué se renderiza",
claves:["Un componente se renderiza cuando cambia su estado, su contexto o se renderiza su padre","Renderizar no es tocar el DOM: React solo aplica las diferencias","Mide con React DevTools Profiler antes de optimizar"],
pasos:[
 {t:"info", eti:"El ciclo", h:"Render y commit",
  c:`<div class="diag">disparador (setState, padre, contexto)
   -&gt; RENDER: React llama a tus componentes y obtiene el nuevo arbol
   -&gt; RECONCILIACION: compara con el anterior (diffing)
   -&gt; COMMIT: aplica al DOM solo las diferencias
   -&gt; efectos</div>
     <p>Un render «de más» casi siempre es barato. Solo es un problema cuando el componente es costoso o hay muchísimos. Por eso: <b>medir primero</b> con el Profiler de React DevTools.</p>`},
 {t:"par", p:"Empareja cada situación con si provoca un render del componente",
  pares:[["Cambia su propio estado","Se renderiza de nuevo"],["Se renderiza su componente padre","También se renderiza, aunque sus props no cambien (salvo memo)"],["Cambia un contexto que usa","Se renderiza con el nuevo valor"],["Cambia un ref","No provoca ningún render"]],
  why:"Que el padre renderice a los hijos por defecto sorprende a mucha gente."},
 {t:"vf", p:"Cada render de un componente reescribe todo su HTML en el DOM.",
  ok:false, why:"React compara y solo actualiza lo que ha cambiado."}
]},

{
id:"re7l2",
titulo:"memo, useMemo y useCallback",
claves:["memo evita renderizar un componente si sus props no cambian","useMemo memoriza un cálculo; useCallback, una función","El compilador de React (React 19) aplica muchas de estas optimizaciones automáticamente"],
pasos:[
 {t:"info", eti:"Memorizar", h:"Las tres herramientas",
  c:`<div class="termbox">const FilaTarea = memo(function FilaTarea({ tarea, alAlternar }: Props) { ... });

function Lista({ tareas, filtro }: Props) {
  const visibles = useMemo(
    () =&gt; tareas.filter(t =&gt; coincide(t, filtro)).sort(ordenar),   // calculo costoso
    [tareas, filtro]
  );
  const alAlternar = useCallback((id: number) =&gt; despachar({ tipo: "alternar", id }), []);
  return visibles.map(t =&gt; &lt;FilaTarea key={t.id} tarea={t} alAlternar={alAlternar} /&gt;);
}</div>
     <p>Sin <code>useCallback</code>, <code>alAlternar</code> sería una función nueva en cada render y <code>memo</code> no serviría (las props «cambian»). El <b>React Compiler</b> puede memorizar esto automáticamente en proyectos que lo activan.</p>`},
 {t:"par", p:"Empareja cada herramienta con lo que memoriza",
  pares:[["memo(Componente)","El resultado del componente si las props son iguales"],["useMemo","El resultado de un cálculo"],["useCallback","La referencia de una función"],["key distinta","Obliga a crear el componente de nuevo (reiniciar su estado)"]],
  why:"Cambiar la key de un formulario es un truco limpio para reiniciarlo."},
 {t:"opcion", p:"Envuelves un componente en <code>memo</code> pero sigue renderizándose siempre. El padre le pasa <code>onClick={() =&gt; guardar(id)}</code>. ¿Por qué?",
  ops:["memo no funciona","La función flecha es nueva en cada render del padre, así que la prop cambia; usa useCallback","Falta una key","Por el contexto"],
  ok:1, why:"Con objetos o funciones creadas en línea, memo compara referencias distintas."},
 {t:"vf", p:"Conviene envolver todos los componentes en memo y todos los cálculos en useMemo por si acaso.",
  ok:false, why:"Tiene coste y complica el código. Optimiza donde el Profiler muestre un problema."}
]},

{
id:"re7l3",
titulo:"Cargar menos y listas largas",
claves:["lazy y Suspense dividen el código por rutas o componentes pesados","Virtualizar listas largas: solo se pintan las filas visibles","useTransition marca actualizaciones no urgentes"],
pasos:[
 {t:"info", eti:"Menos JavaScript", h:"Carga diferida",
  c:`<div class="termbox">const Informes = lazy(() =&gt; import("./Informes"));

&lt;Suspense fallback={&lt;Cargando /&gt;}&gt;
  &lt;Informes /&gt;
&lt;/Suspense&gt;</div>
     <p>El código de <code>Informes</code> solo se descarga cuando se muestra. Ideal por rutas.</p>`},
 {t:"info", eti:"Miles de filas", h:"Virtualización y transiciones",
  c:`<p>Pintar 10.000 filas crea 10.000 nodos del DOM. Con virtualización (TanStack Virtual, react-window) solo existen las ~30 visibles y se reciclan al hacer scroll.</p>
     <div class="termbox">const [pendiente, iniciarTransicion] = useTransition();
function onBuscar(texto: string) {
  setTexto(texto);                                   // urgente: el input responde ya
  iniciarTransicion(() =&gt; setFiltro(texto));         // no urgente: filtrar la lista
}</div>`},
 {t:"par", p:"Empareja cada técnica con el problema que resuelve",
  pares:[["lazy + Suspense","Descargar al principio código que aún no se usa"],["Virtualización","Listas con miles de elementos"],["useTransition","Que escribir no se bloquee mientras se recalcula algo pesado"],["Debounce","Demasiadas peticiones mientras se escribe"]],
  why:"La mayoría de problemas de rendimiento en React vienen de enviar demasiado JavaScript o pintar demasiados nodos."},
 {t:"opcion", p:"Una tabla con 20.000 filas va muy lenta al hacer scroll. ¿Qué harías primero?",
  ops:["memo en cada celda","Virtualizar la lista (o paginar)","Más RAM","Quitar las keys"],
  ok:1, why:"El coste está en tener 20.000 filas en el DOM."}
]}

]});
