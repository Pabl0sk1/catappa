window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Render, reconciliación y rendimiento",
resumen: "Cuándo y por qué se renderiza, cómo reconcilia React con tipos y keys, memo, useMemo y useCallback, el React Compiler, medir con el Profiler, dividir código, listas largas y transiciones",
nivel: "Avanzado",
color: "#40b8dc",
lecciones: [

/* =============== U7 L1 =============== */
{
id:"re7l1",
titulo:"Cuándo y por qué se renderiza",
claves:["Un componente se renderiza al montarse, cuando cambia su estado o un contexto que usa, o cuando se renderiza su padre","Renderizar es llamar a tu función; el commit aplica al DOM solo las diferencias","Si el nuevo estado es igual (Object.is) al actual, React puede saltarse el render"],
pasos:[
 {t:"info", eti:"El ciclo", h:"Disparar, renderizar, confirmar",
  c:`<div class="dg"><div class="dg-tit">de un cambio de estado a la pantalla</div>
       <div class="dg-vert">
         <div class="dg-caja base">disparador<small>montaje inicial, setState, contexto</small></div>
         <div class="dg-caja acento doble">render<small>React llama a tus componentes y obtiene el nuevo árbol de elementos</small></div>
         <div class="dg-caja acento doble">reconciliación<small>compara con el árbol anterior</small></div>
         <div class="dg-caja ok doble">commit<small>aplica al DOM solo las diferencias, asigna refs</small></div>
         <div class="dg-caja">el navegador pinta · después, los efectos</div>
       </div>
     </div>
     <p>Cuando un componente se renderiza, React renderiza <b>también a todos sus descendientes</b>, cambien o no sus props (salvo que estén memorizados). Un render «de más» casi siempre es barato: es llamar a funciones y comparar objetos. Solo es un problema si el componente es costoso o se repite miles de veces. Por eso: <b>medir primero</b>.</p>`},
 {t:"info", eti:"Detalles", h:"Lo que no provoca un render",
  c:`<ul><li><b>Cambiar un ref</b> (<code>ref.current = x</code>): nunca renderiza.</li>
     <li><b>Poner el mismo valor</b>: <code>setN(5)</code> cuando ya vale 5 no renderiza a los hijos (React puede llamar una vez al componente y descartar el resultado).</li>
     <li><b>Mutar un objeto del estado</b>: tampoco renderiza, y ese es el problema.</li>
     <li><b>Cambiar una variable normal</b>: no renderiza ni se conserva.</li></ul>
     <div class="termbox">function Padre() {
  const [n, setN] = useState(0);
  console.log("Padre");
  return (&lt;&gt;&lt;button onClick={() =&gt; setN(n + 1)}&gt;{n}&lt;/button&gt;&lt;Hijo /&gt;&lt;/&gt;);
}
function Hijo() { console.log("Hijo"); return &lt;p&gt;Soy estático&lt;/p&gt;; }
// cada clic imprime "Padre" y "Hijo", aunque Hijo no reciba nada</div>`},
 {t:"par", p:"Empareja cada situación con si provoca un render del componente",
  pares:[["Cambia su propio estado","Se renderiza de nuevo"],["Se renderiza su componente padre","También se renderiza, aunque sus props no cambien (salvo memo)"],["Cambia un contexto que usa","Se renderiza con el nuevo valor"],["Cambia un ref","No provoca ningún render"],["setState con el mismo valor que ya tiene","No renderiza a los hijos (se descarta)"]],
  why:"Que el padre renderice a los hijos por defecto sorprende a mucha gente."},
 {t:"opcion", p:"Con el código de <code>Padre</code> e <code>Hijo</code>, ¿qué se imprime al pulsar el botón dos veces (sin StrictMode, sin contar el montaje)?",
  ops:["Padre, Padre","Padre, Hijo, Padre, Hijo","Hijo, Hijo","Nada"],
  ok:1, why:"Cada render del padre renderiza a sus hijos. Con memo(Hijo), solo se imprimiría Padre."},
 {t:"vf", p:"Cada render de un componente reescribe todo su HTML en el DOM.",
  ok:false, why:"React compara y solo actualiza en el commit lo que ha cambiado. Un render sin cambios no toca el DOM."},
 {t:"orden", p:"Ordena lo que ocurre tras un <code>setState</code> en un manejador de clic",
  items:["Se encola la actualización","Termina el manejador (se agrupan todas las actualizaciones)","React llama al componente y a sus descendientes","Compara el nuevo árbol con el anterior","Aplica las diferencias al DOM","El navegador pinta","Se ejecutan los efectos cuyas dependencias cambiaron"],
  why:"Los efectos van después del pintado; useLayoutEffect, antes."},
 {t:"opcion", p:"Un componente muestra un contador y un gráfico muy costoso que no depende del contador. Cada clic va lento. ¿Primera solución, antes de memorizar?",
  ops:["useMemo en todo","Bajar el estado: mover el contador a un componente propio para que su render no incluya el gráfico","Quitar StrictMode","Usar un ref para el contador"],
  ok:1, why:"Colocar el estado lo más abajo posible (o pasar lo costoso como children) evita renders sin memorizar nada."}
]},

/* =============== U7 L2 =============== */
{
id:"re7n1",
titulo:"Reconciliación a fondo",
claves:["React compara árboles con dos heurísticas: elementos de distinto tipo producen árboles distintos, y las keys identifican hijos","Si cambia el tipo de un elemento, se destruye todo su subárbol (estado y DOM)","Las keys permiten reordenar, insertar y borrar sin perder el estado de cada elemento"],
pasos:[
 {t:"info", eti:"El algoritmo", h:"Cómo compara React dos árboles",
  c:`<p>Comparar dos árboles cualesquiera de forma óptima es muy caro (del orden de n³). React usa un algoritmo <b>O(n)</b> basado en dos supuestos:</p>
     <ol><li><b>Distinto tipo, distinto árbol</b>: si en una posición había un <code>&lt;div&gt;</code> y ahora hay un <code>&lt;section&gt;</code> (o <code>&lt;A /&gt;</code> y ahora <code>&lt;B /&gt;</code>), React no compara dentro: destruye lo viejo y crea lo nuevo.</li>
     <li><b>Las keys identifican a los hijos</b>: en una lista, React empareja los hijos viejos y nuevos por key, no por posición.</li></ol>
     <div class="dg"><div class="dg-tit">lista con keys: de [a, b, c] a [c, a, d]</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">antes</div><div class="dg-pila"><div class="dg-caja">a</div><div class="dg-caja aviso">b</div><div class="dg-caja">c</div></div></div>
       <div class="dg-col"><div class="dg-col-tit">después</div><div class="dg-pila"><div class="dg-caja ok">c (movido, conserva estado)</div><div class="dg-caja ok">a (conserva estado)</div><div class="dg-caja acento">d (nuevo)</div></div></div>
     </div><div class="dg-leyenda"><span><i class="aviso"></i>b se destruye</span><span><i class="acento"></i>d se crea</span></div></div>`},
 {t:"info", eti:"Consecuencias", h:"Trampas que salen de aquí",
  c:`<div class="termbox">// 1. Cambiar el envoltorio destruye el estado de todo lo de dentro
return esMovil ? &lt;div&gt;&lt;Editor /&gt;&lt;/div&gt; : &lt;section&gt;&lt;Editor /&gt;&lt;/section&gt;;   // el Editor pierde su texto

// 2. Componente declarado dentro de otro: un tipo nuevo en cada render
function Lista() {
  function Fila() { ... }          // MAL
  return filas.map(f =&gt; &lt;Fila key={f.id} /&gt;);
}

// 3. Keys inestables: todo se recrea en cada render
items.map(i =&gt; &lt;Item key={crypto.randomUUID()} /&gt;)   // MAL</div>
     <p>En los tres casos el síntoma es el mismo: inputs que pierden el foco o el texto, animaciones que se reinician, efectos que se repiten y un rendimiento peor, porque React destruye y crea nodos del DOM en vez de actualizarlos.</p>`},
 {t:"opcion", p:"¿Qué se renderiza tras escribir «hola» en el input y cambiar <code>esMovil</code> de false a true?<br><code>esMovil ? &lt;div&gt;&lt;input /&gt;&lt;/div&gt; : &lt;section&gt;&lt;input /&gt;&lt;/section&gt;</code>",
  ops:["Un input con «hola»","Un input vacío: cambió el tipo del padre, así que React destruyó el subárbol","Dos inputs","Un error"],
  ok:1, why:"Mismo tipo (input) pero bajo un padre de otro tipo: la regla de «distinto tipo» se aplica al padre y a todo lo que cuelga de él."},
 {t:"opcion", p:"Una lista usa <code>key={Math.random()}</code>. ¿Qué efecto tiene?",
  ops:["Ninguno","En cada render todas las keys son nuevas: React destruye y recrea todos los elementos (se pierde el estado, el foco y el rendimiento)","Evita el aviso de consola sin coste","Ordena la lista al azar"],
  ok:1, why:"Una key debe ser estable entre renders. Si no hay id, se genera al crear el dato, no al renderizar."},
 {t:"par", p:"Empareja cada cambio con lo que hace React",
  pares:[["<A /> pasa a <B /> en la misma posición","Desmonta A y monta B"],["<A x={1} /> pasa a <A x={2} />","Actualiza A con la nueva prop"],["Hijo con key \"7\" pasa a otra posición de la lista","Lo mueve conservando su estado"],["Aparece un hijo con una key nueva","Lo crea y monta"],["Desaparece un hijo con su key","Lo desmonta y ejecuta sus limpiezas"]],
  why:"Tipo y key son la identidad de un elemento para React."},
 {t:"vf", p:"El Virtual DOM hace que React sea siempre más rápido que modificar el DOM a mano.",
  ok:false, why:"El DOM a mano, bien hecho, es más rápido. La ventaja de React es que puedes escribir de forma declarativa con un rendimiento suficientemente bueno sin pensar en cada cambio."},
 {t:"codigo", p:"Simula la reconciliación de una lista, con keys de verdad o con el índice como key",
  lenguaje:"js",
  c:`<p>Stdin: <code>key</code> o <code>indice</code>, la lista vieja y la nueva (elementos separados por espacios). Con <code>key</code>: por cada elemento nuevo, en orden, <code>conserva X</code> si estaba o <code>crea X</code> si no; después <code>destruye X</code> por cada viejo que ya no está (en su orden). Con <code>indice</code>: por cada posición nueva i, <code>conserva X</code> si es el mismo, <code>reutiliza i: VIEJO -&gt; NUEVO</code> si había otro (¡su estado se hereda!) o <code>crea X</code>; después <code>destruye X</code> por cada posición vieja que sobra.</p>`,
  plantilla:"const [modo, viejaTxt, nuevaTxt] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst vieja = viejaTxt.split(\" \"), nueva = nuevaTxt.split(\" \");\n// tu código\n",
  pruebas:[{entrada:"key\na b c\nc a d\n", salida:"conserva c\nconserva a\ncrea d\ndestruye b"},{entrada:"indice\npan leche huevos\nleche huevos\n", salida:"reutiliza 0: pan -> leche\nreutiliza 1: leche -> huevos\ndestruye huevos"},{entrada:"key\nx y\ny x z w\n", salida:"conserva y\nconserva x\ncrea z\ncrea w", oculta:true},{entrada:"indice\na b\na b c\n", salida:"conserva a\nconserva b\ncrea c", oculta:true}],
  pista:"Con key usa includes (o un Set) en las dos listas. Con índice compara vieja[i] y nueva[i] y, al final, recorre vieja desde nueva.length.",
  solucion:"const [modo, viejaTxt, nuevaTxt] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst vieja = viejaTxt.split(\" \"), nueva = nuevaTxt.split(\" \");\nif (modo === \"key\") {\n  const antes = new Set(vieja), despues = new Set(nueva);\n  for (const k of nueva) console.log((antes.has(k) ? \"conserva \" : \"crea \") + k);\n  for (const k of vieja) if (!despues.has(k)) console.log(\"destruye \" + k);\n} else {\n  nueva.forEach((x, i) => {\n    if (i >= vieja.length) console.log(\"crea \" + x);\n    else if (vieja[i] === x) console.log(\"conserva \" + x);\n    else console.log(\"reutiliza \" + i + \": \" + vieja[i] + \" -> \" + x);\n  });\n  for (let i = nueva.length; i < vieja.length; i++) console.log(\"destruye \" + vieja[i]);\n}\n",
  why:"Con el índice, borrar «pan» hace que la fila de la leche herede el estado del pan: el bug del texto que salta de fila."}
]},

/* =============== U7 L3 =============== */
{
id:"re7l2",
titulo:"memo, useMemo y useCallback",
claves:["memo evita renderizar un componente si sus props son superficialmente iguales (Object.is en cada prop)","useMemo memoriza el resultado de un cálculo; useCallback, la referencia de una función","Solo sirven si las props son estables: un objeto o función creados en línea anulan memo"],
pasos:[
 {t:"info", eti:"Memorizar", h:"Las tres herramientas",
  c:`<div class="termbox">const FilaTarea = memo(function FilaTarea({ tarea, onAlternar }: Props) { ... });

function Lista({ tareas, filtro }: Props) {
  const visibles = useMemo(
    () =&gt; tareas.filter(t =&gt; coincide(t, filtro)).toSorted(ordenar),   // cálculo costoso
    [tareas, filtro]
  );
  const onAlternar = useCallback((id: number) =&gt; despachar({ tipo: "alternar", id }), []);
  return visibles.map(t =&gt; &lt;FilaTarea key={t.id} tarea={t} onAlternar={onAlternar} /&gt;);
}</div>
     <p><code>memo</code> compara cada prop con <code>Object.is</code>. Sin <code>useCallback</code>, <code>onAlternar</code> sería una función nueva en cada render y <code>memo</code> no serviría: la prop «cambia» siempre. <code>useCallback(fn, deps)</code> es exactamente <code>useMemo(() =&gt; fn, deps)</code>.</p>`},
 {t:"info", eti:"Cuándo sí", h:"Cuándo memorizar compensa",
  c:`<ul><li><b>Cálculos costosos</b> (filtrar y ordenar miles de filas, transformar datos para un gráfico): mide con <code>console.time</code>; si tarda más de ~1 ms, <code>useMemo</code>.</li>
     <li><b>Props de un componente memorizado</b>: objetos y funciones que se pasan a un hijo con <code>memo</code>.</li>
     <li><b>Dependencias de otros hooks</b>: un objeto usado en las dependencias de un efecto.</li></ul>
     <p>Fuera de eso, memorizar tiene coste (memoria, comparaciones) y complica el código. Muchas veces es mejor <b>reestructurar</b>: bajar el estado, pasar JSX como children, no crear efectos que dependan de objetos.</p>
     <div class="nota"><b class="tit">El React Compiler</b>En proyectos con el compilador activado (siguiente lección), casi todo esto se hace automáticamente y ya no hace falta escribir memo, useMemo ni useCallback a mano.</div>`},
 {t:"par", p:"Empareja cada herramienta con lo que memoriza",
  pares:[["memo(Componente)","El resultado del componente si las props son iguales"],["useMemo","El resultado de un cálculo"],["useCallback","La referencia de una función"],["key distinta","Obliga a crear el componente de nuevo (reiniciar su estado)"]],
  why:"Cambiar la key de un formulario es un truco limpio para reiniciarlo."},
 {t:"opcion", p:"Envuelves un componente en <code>memo</code> pero sigue renderizándose siempre. El padre le pasa <code>onClick={() =&gt; guardar(id)}</code>. ¿Por qué?",
  ops:["memo no funciona","La función flecha es nueva en cada render del padre, así que la prop cambia; usa useCallback","Falta una key","Por el contexto"],
  ok:1, why:"Con objetos o funciones creadas en línea, memo compara referencias distintas."},
 {t:"opcion", p:"<code>const Grafico = memo(G)</code> y el padre renderiza <code>&lt;Grafico datos={datos} opciones={{ animar: true }} /&gt;</code>. ¿Qué se re-renderiza cuando el padre cambia otro estado?",
  ops:["Nada: memo lo impide","Grafico también: opciones es un objeto nuevo en cada render","Solo el padre y el DOM","Da error"],
  ok:1, why:"Saca el objeto constante fuera del componente (const OPCIONES = { animar: true }) o memorízalo."},
 {t:"vf", p:"Conviene envolver todos los componentes en memo y todos los cálculos en useMemo por si acaso.",
  ok:false, why:"Tiene coste y complica el código. Optimiza donde el Profiler muestre un problema, o deja que lo haga el compilador."},
 {t:"hueco", p:"Completa para que la función conserve su identidad entre renders mientras no cambie <code>id</code>",
  tpl:"const guardar = ___(() => api.guardar(id), [___]);",
  banco:["useCallback","id","useMemo","useRef","guardar"], sol:["useCallback","id"],
  why:"Con useMemo habría que escribir useMemo(() =&gt; () =&gt; api.guardar(id), [id])."},
 {t:"codigo", p:"Implementa la comparación superficial que usa <code>memo</code> y decide si el componente se renderiza o se salta",
  lenguaje:"js",
  c:`<p>Cada línea de stdin tiene las props anteriores y las nuevas en JSON, separadas por <code> | </code>. Son iguales si tienen las mismas claves y cada valor es igual con <code>Object.is</code> (sin mirar dentro de objetos). Imprime <code>se salta</code> o <code>renderiza</code>. Ojo: al parsear JSON, dos objetos anidados con el mismo contenido son referencias distintas, como un objeto creado en línea en cada render.</p>`,
  plantilla:"function igualSuperficial(a, b) {\n  // tu código\n}\nfor (const linea of require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\")) {\n  const [antes, despues] = linea.split(\" | \").map(t => JSON.parse(t));\n  console.log(igualSuperficial(antes, despues) ? \"se salta\" : \"renderiza\");\n}\n",
  pruebas:[{entrada:"{\"id\":1,\"titulo\":\"A\"} | {\"id\":1,\"titulo\":\"A\"}\n{\"id\":1} | {\"id\":2}\n", salida:"se salta\nrenderiza"},{entrada:"{\"id\":1,\"estilo\":{\"c\":\"red\"}} | {\"id\":1,\"estilo\":{\"c\":\"red\"}}\n{\"a\":1} | {\"a\":1,\"b\":2}\n", salida:"renderiza\nrenderiza"},{entrada:"{\"a\":1,\"b\":2} | {\"b\":2,\"a\":1}\n{\"a\":[]} | {\"a\":[]}\n{\"x\":null} | {\"y\":null}\n", salida:"se salta\nrenderiza\nrenderiza", oculta:true}],
  pista:"Compara el número de claves y, para cada clave de a, que b la tenga (Object.hasOwn) y que Object.is(a[k], b[k]).",
  solucion:"function igualSuperficial(a, b) {\n  if (Object.is(a, b)) return true;\n  const ka = Object.keys(a), kb = Object.keys(b);\n  if (ka.length !== kb.length) return false;\n  return ka.every(k => Object.hasOwn(b, k) && Object.is(a[k], b[k]));\n}\nfor (const linea of require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\")) {\n  const [antes, despues] = linea.split(\" | \").map(t => JSON.parse(t));\n  console.log(igualSuperficial(antes, despues) ? \"se salta\" : \"renderiza\");\n}\n",
  why:"Es el shallowEqual de React. Por eso memo solo sirve con props primitivas o referencias estables."}
]},

/* =============== U7 L4 =============== */
{
id:"re7n2",
titulo:"React Compiler y medir con el Profiler",
claves:["El React Compiler (estable desde octubre de 2025) memoriza componentes y valores automáticamente al compilar","Solo funciona bien con código que cumple las reglas de React: pureza, inmutabilidad y reglas de los hooks","Mide antes de optimizar: Profiler de React DevTools, «resaltar renders» y el rendimiento del navegador (INP)"],
pasos:[
 {t:"info", eti:"Memorización automática", h:"El React Compiler",
  c:`<p>El <b>React Compiler</b> es un plugin de compilación (Babel) que analiza tus componentes y hooks y añade la memorización necesaria: el equivalente a poner <code>memo</code>, <code>useMemo</code> y <code>useCallback</code> donde hace falta, con más precisión que a mano (puede memorizar incluso después de un <code>return</code> temprano).</p>
     <div class="termbox">npm install -D babel-plugin-react-compiler

// vite.config.ts
export default defineConfig({
  plugins: [
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
  ],
});

// excluir un componente problemático mientras lo arreglas
function Legado() {
  "use no memo";
  ...
}</div>
     <ul><li>Next.js lo activa con <code>reactCompiler: true</code> en su configuración.</li>
     <li>Asume que tu código es <b>puro</b> y no muta props ni estado: si incumples las reglas, puede saltarse ese componente o comportarse de forma inesperada. El plugin <code>eslint-plugin-react-hooks</code> (preset recomendado) incluye las reglas del compilador.</li>
     <li>En React DevTools, los componentes optimizados muestran la insignia «Memo ✨».</li></ul>`},
 {t:"info", eti:"Medir", h:"Profiler y métricas",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">herramientas para encontrar el problema</div><table class="dg-tabla"><thead><tr><th>Herramienta</th><th>Qué te dice</th></tr></thead><tbody>
       <tr><td>React DevTools · Profiler</td><td>qué componentes renderizó cada commit, cuánto tardó cada uno y por qué se renderizó («Why did this render?»)</td></tr>
       <tr><td>«Highlight updates»</td><td>resalta en pantalla lo que se re-renderiza al interactuar</td></tr>
       <tr><td>Chrome · Performance</td><td>tareas largas del hilo principal, tiempos de React en su propia pista</td></tr>
       <tr><td>Web Vitals (INP, LCP, CLS)</td><td>cómo lo viven los usuarios reales; INP mide la respuesta a las interacciones</td></tr>
       <tr><td>&lt;Profiler onRender&gt;</td><td>medir por código un subárbol concreto</td></tr>
     </tbody></table></div>
     <p>Mide siempre con el <b>build de producción</b> (<code>npm run build &amp;&amp; npm run preview</code>): el modo desarrollo es mucho más lento y StrictMode duplica renders. Y con la CPU ralentizada (×4) en DevTools para simular un móvil.</p>`},
 {t:"opcion", p:"Activas el React Compiler en un proyecto. ¿Qué pasa con los <code>useMemo</code> y <code>useCallback</code> que ya había?",
  ops:["Dan error","Siguen funcionando; puedes quitarlos poco a poco (con cuidado si se usan como dependencias de efectos)","Se borran solos","El compilador los ignora y rompe el código"],
  ok:1, why:"El compilador convive con la memorización manual. En código nuevo ya no hace falta escribirla."},
 {t:"opcion", p:"Un componente muta una prop durante el render y el compilador está activo. ¿Qué es lo más probable?",
  ops:["El compilador lo arregla","Incumple las reglas de React: el linter lo señala y el compilador puede saltarse ese componente o memorizar un valor que luego cambia","Nada, es válido","Se renderiza dos veces"],
  ok:1, why:"El compilador se apoya en que el código es puro. Por eso conviene tener el linter limpio antes de activarlo."},
 {t:"orden", p:"Ordena el proceso para arreglar una pantalla lenta",
  items:["Reproducir el problema con el build de producción y la CPU ralentizada","Grabar la interacción con el Profiler de React DevTools","Localizar los commits lentos y el componente que más tarda","Ver por qué se renderizó (props, estado, contexto)","Aplicar el arreglo mínimo (bajar estado, memorizar, virtualizar)","Volver a medir y comparar"],
  why:"Sin medir antes y después, no sabes si has arreglado algo o solo has añadido complejidad."},
 {t:"par", p:"Empareja cada síntoma con la herramienta para investigarlo",
  pares:[["Escribir en un input va a saltos","Profiler: qué se renderiza en cada tecla"],["Los usuarios reales se quejan de lentitud al pulsar","INP en Web Vitals o monitorización real"],["Una tarea de 400 ms bloquea el hilo principal","Pestaña Performance del navegador"],["No sabes por qué se re-renderiza un componente","«Why did this render?» del Profiler"]],
  why:"Cada herramienta responde a una pregunta distinta."},
 {t:"escribe", p:"¿Qué directiva, escrita al principio de un componente, le dice al React Compiler que no lo optimice?",
  sol:["\"use no memo\"","use no memo","'use no memo'"],
  pista:"Parecida a \"use client\".",
  why:"Es una vía de escape temporal para componentes que aún no cumplen las reglas."},
 {t:"vf", p:"Para medir el rendimiento real conviene usar el servidor de desarrollo, que es el que tienes abierto.",
  ok:false, why:"El modo desarrollo incluye comprobaciones, avisos y dobles renders: siempre más lento. Mide con el build de producción."}
]},

/* =============== U7 L5 =============== */
{
id:"re7l3",
titulo:"Cargar menos, listas largas y transiciones",
claves:["lazy y Suspense dividen el código por rutas o componentes pesados","Virtualizar listas largas: solo se pintan las filas visibles","useTransition y useDeferredValue marcan actualizaciones no urgentes para que la interfaz no se bloquee"],
pasos:[
 {t:"info", eti:"Menos JavaScript", h:"Carga diferida",
  c:`<div class="termbox">import { lazy, Suspense } from "react";
const Informes = lazy(() =&gt; import("./Informes"));      // el módulo debe tener export default

&lt;Suspense fallback={&lt;Cargando /&gt;}&gt;
  &lt;Informes /&gt;
&lt;/Suspense&gt;</div>
     <p>El código de <code>Informes</code> solo se descarga cuando se muestra: Vite genera un fichero aparte (<i>chunk</i>). Lo más rentable es dividir <b>por rutas</b> y por componentes pesados que no se ven al principio (editores, gráficos, mapas). Declara el <code>lazy</code> en el nivel superior del módulo, nunca dentro de un componente.</p>
     <p>Otras fuentes de peso: librerías enormes importadas enteras (importa solo lo que usas), polyfills innecesarios, imágenes sin optimizar. Analiza el paquete con <code>rollup-plugin-visualizer</code>.</p>`},
 {t:"info", eti:"Miles de filas", h:"Virtualización y transiciones",
  c:`<p>Pintar 10.000 filas crea 10.000 nodos del DOM. Con virtualización (TanStack Virtual, react-window) solo existen las ~30 visibles y se reciclan al hacer scroll.</p>
     <div class="termbox">// useTransition: tú controlas qué actualización no es urgente
const [pendiente, iniciarTransicion] = useTransition();
function onBuscar(texto: string) {
  setTexto(texto);                                   // urgente: el input responde ya
  iniciarTransicion(() =&gt; setFiltro(texto));         // no urgente: filtrar la lista
}

// useDeferredValue: cuando el valor te llega por props y no controlas el set
function Resultados({ consulta }: { consulta: string }) {
  const diferida = useDeferredValue(consulta);
  const obsoleto = consulta !== diferida;
  return &lt;div style={{ opacity: obsoleto ? 0.5 : 1 }}&gt;&lt;ListaLenta q={diferida} /&gt;&lt;/div&gt;;
}      // ListaLenta debe ir con memo para que el render urgente se la salte</div>
     <p>Un render dentro de una transición es <b>interrumpible</b>: si llega otra tecla, React abandona el render a medias y empieza con el valor nuevo. No hace menos trabajo, pero la interfaz nunca se bloquea.</p>`},
 {t:"par", p:"Empareja cada técnica con el problema que resuelve",
  pares:[["lazy + Suspense","Descargar al principio código que aún no se usa"],["Virtualización","Listas con miles de elementos"],["useTransition","Que escribir no se bloquee mientras se recalcula algo pesado"],["useDeferredValue","Retrasar un valor recibido por props para un render costoso"],["Debounce","Demasiadas peticiones mientras se escribe"]],
  why:"La mayoría de problemas de rendimiento en React vienen de enviar demasiado JavaScript o pintar demasiados nodos."},
 {t:"opcion", p:"Una tabla con 20.000 filas va muy lenta al hacer scroll. ¿Qué harías primero?",
  ops:["memo en cada celda","Virtualizar la lista (o paginar)","Más RAM","Quitar las keys"],
  ok:1, why:"El coste está en tener 20.000 filas en el DOM."},
 {t:"opcion", p:"¿En qué se diferencia <code>useTransition</code> de un debounce para un buscador que filtra en el cliente?",
  ops:["Son lo mismo","El debounce espera un tiempo fijo; la transición empieza ya, pero es interrumpible y cede el paso a lo urgente, sin retrasos artificiales","useTransition hace menos peticiones","El debounce es de React 19"],
  ok:1, why:"Para peticiones de red, debounce (o la caché de TanStack Query); para renders costosos en el cliente, transiciones."},
 {t:"hueco", p:"Completa la carga diferida de la página de ajustes",
  tpl:"const Ajustes = ___(() => ___(\"./Ajustes\"));",
  banco:["lazy","import","require","memo","fetch"], sol:["lazy","import"],
  why:"import() dinámico devuelve una promesa con el módulo: el empaquetador lo convierte en un fichero aparte."},
 {t:"vf", p:"Un componente cargado con lazy necesita un Suspense por encima para mostrar algo mientras se descarga.",
  ok:true, why:"Mientras llega el código, el componente «suspende» y React muestra el fallback del Suspense más cercano."}
]}

]});
