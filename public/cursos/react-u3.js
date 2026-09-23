window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Estado y eventos",
resumen: "useState y la cola de actualizaciones, eventos y propagación, actualizar objetos y arrays sin mutar, dónde vive el estado y cuándo se conserva o se reinicia",
nivel: "Intermedio",
color: "#4fc8ea",
lecciones: [

/* =============== U3 L1 =============== */
{
id:"re3l1",
titulo:"useState",
claves:["useState guarda datos que, al cambiar, vuelven a renderizar el componente","Cada render ve una «foto» del estado: el nuevo valor llega en el siguiente render","Las actualizaciones se agrupan (batching); la forma con función encadena sobre el valor pendiente"],
pasos:[
 {t:"info", eti:"Memoria del componente", h:"useState",
  c:`<div class="termbox">import { useState } from "react";

function Contador() {
  const [cuenta, setCuenta] = useState(0);
  return (
    &lt;button onClick={() =&gt; setCuenta(cuenta + 1)}&gt;
      Has pulsado {cuenta} veces
    &lt;/button&gt;
  );
}</div>
     <p>Una variable normal se «reinicia» cada vez que React llama a la función. <code>useState</code> hace que React recuerde el valor <b>entre renderizados</b>, y llamar a <code>setCuenta</code> le pide volver a renderizar con el nuevo valor. El estado es <b>privado de cada instancia</b>: dos <code>&lt;Contador /&gt;</code> cuentan por separado.</p>
     <p>Si el valor inicial es caro de calcular, pasa una función (<b>inicializador perezoso</b>): <code>useState(() =&gt; leerDeDisco())</code>. Con <code>useState(leerDeDisco())</code> se ejecutaría en cada render aunque solo se use la primera vez.</p>`},
 {t:"info", eti:"La foto", h:"El estado no cambia al instante",
  c:`<div class="termbox">function Ejemplo() {
  const [n, setN] = useState(0);
  function tresVeces() {
    setN(n + 1);             // "sustituye por 0 + 1"
    setN(n + 1);             // "sustituye por 0 + 1"
    setN(n + 1);             // "sustituye por 0 + 1"
    console.log(n);          // 0: este render sigue viendo n = 0
  }                          // resultado: n pasa a 1, no a 3

  function tresVecesBien() {
    setN(prev =&gt; prev + 1);  // "súmale 1 a lo que haya"
    setN(prev =&gt; prev + 1);
    setN(prev =&gt; prev + 1);  // n pasa a 3
  }
}</div>
     <p>React <b>agrupa</b> (batching) todas las actualizaciones de un mismo evento en una cola y renderiza una sola vez al final. Al procesar la cola: un valor sustituye al estado; una función recibe el resultado pendiente y devuelve el siguiente. Desde React 18 el agrupamiento es automático también en promesas, <code>setTimeout</code> y eventos nativos.</p>
     <div class="dg"><div class="dg-tit">cola de setN(n + 5); setN(p =&gt; p + 1); con n = 0</div><div class="dg-flujo"><div class="dg-caja">pendiente: 0</div><div class="dg-caja acento">sustituir por 5<small>n + 5 con n = 0</small></div><div class="dg-caja acento">p =&gt; p + 1<small>5 + 1</small></div><div class="dg-caja ok">siguiente render: 6</div></div></div>`},
 {t:"opcion", p:"Tras pulsar una vez el botón que llama a <code>tresVeces()</code>, ¿qué valor muestra la pantalla?",
  ops:["3","1","0","Un error"],
  ok:1, why:"Las tres llamadas usan el mismo n (0) de ese render. Para encadenar, la forma con función: setN(prev =&gt; prev + 1)."},
 {t:"opcion", p:"Con <code>n = 0</code>, un clic ejecuta <code>setN(n + 5); setN(p =&gt; p + 1); setN(42);</code>. ¿Qué se renderiza después?",
  ops:["6","42","48","5"],
  ok:1, why:"La cola se procesa en orden: sustituir por 5, sumar 1 (6) y sustituir por 42. Gana el último reemplazo."},
 {t:"hueco", p:"Completa para declarar un estado <code>abierto</code> que empieza en false y un botón que lo alterna",
  tpl:"const [abierto, ___] = ___(false);\n<button onClick={() => setAbierto(a => ___)}>Menú</button>",
  banco:["setAbierto","useState","!a","useEffect","a","abrir"], sol:["setAbierto","useState","!a"],
  why:"Convención: [algo, setAlgo]. La forma con función evita depender de la «foto» de abierto."},
 {t:"vf", p:"Llamar a un setter de estado actualiza la variable inmediatamente en la misma función.",
  ok:false, why:"Programa un nuevo render; el valor nuevo se ve en ese render, no en el actual. Si necesitas el valor nuevo en la misma función, guárdalo en una constante antes de llamar al setter."},
 {t:"codigo", p:"Simula la cola de actualizaciones de estado de React y muestra el valor del siguiente render",
  lenguaje:"js",
  c:`<p>Por stdin llega el valor inicial en la primera línea y, después, una actualización por línea, todas del mismo evento:</p>
<ul><li><code>set 7</code>: <code>setN(7)</code></li><li><code>set n+K</code>: <code>setN(n + K)</code>, donde <code>n</code> es la foto del render (el valor inicial)</li><li><code>fn +K</code> y <code>fn *K</code>: <code>setN(p =&gt; p + K)</code> y <code>setN(p =&gt; p * K)</code></li></ul>
<p>Imprime el valor final.</p>`,
  plantilla:"const [primera, ...acciones] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst n = Number(primera);   // la foto de este render\nlet pendiente = n;\nfor (const a of acciones) {\n  // procesa cada actualización\n}\nconsole.log(pendiente);\n",
  pruebas:[{entrada:"0\nset n+1\nset n+1\nset n+1\n", salida:"1"},{entrada:"0\nfn +1\nfn +1\nfn +1\n", salida:"3"},{entrada:"5\nset n+1\nfn +1\nfn *2\n", salida:"14"},{entrada:"10\nfn +5\nset 0\nfn +1\nset n+2\n", salida:"12", oculta:true}],
  pista:"Separa cada línea en tipo y argumento. set n+K usa n (fijo), set X usa X; fn aplica la operación sobre pendiente.",
  solucion:"const [primera, ...acciones] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nconst n = Number(primera);\nlet pendiente = n;\nfor (const a of acciones) {\n  const [tipo, arg] = a.trim().split(\" \");\n  if (tipo === \"set\") {\n    pendiente = arg.startsWith(\"n+\") ? n + Number(arg.slice(2)) : Number(arg);\n  } else {\n    const k = Number(arg.slice(1));\n    pendiente = arg[0] === \"+\" ? pendiente + k : pendiente * k;\n  }\n}\nconsole.log(pendiente);\n",
  why:"Es exactamente el algoritmo que describe la documentación de React: los reemplazos ignoran lo pendiente; las funciones actualizadoras encadenan sobre ello."}
]},

/* =============== U3 L2 =============== */
{
id:"re3l2",
titulo:"Eventos",
claves:["Manejadores: onClick={fn}, no onClick={fn()}; con argumentos, una función flecha","Los eventos se propagan hacia arriba: stopPropagation y preventDefault","Convención: el componente expone props onAlgo y dentro define handleAlgo"],
pasos:[
 {t:"info", eti:"Reaccionar", h:"Manejadores de eventos",
  c:`<div class="termbox">&lt;button onClick={guardar}&gt;Guardar&lt;/button&gt;              // pasa la función
&lt;button onClick={() =&gt; borrar(tarea.id)}&gt;Borrar&lt;/button&gt;  // con argumentos
&lt;button onClick={guardar()}&gt;Guardar&lt;/button&gt;            // MAL: se ejecuta al renderizar

function Buscador({ onBuscar }: { onBuscar: (texto: string) =&gt; void }) {
  function handleKeyDown(e: React.KeyboardEvent&lt;HTMLInputElement&gt;) {
    if (e.key === "Enter") onBuscar(e.currentTarget.value);
  }
  return &lt;input onKeyDown={handleKeyDown} /&gt;;
}</div>
     <ul><li>El manejador recibe un <b>evento sintético</b> de React: misma interfaz que el nativo (<code>target</code>, <code>key</code>, <code>preventDefault</code>) y funciona igual en todos los navegadores.</li>
     <li>React no pone un listener en cada botón: delega en el nodo raíz de la aplicación.</li>
     <li>Los manejadores son el lugar natural para los <b>efectos secundarios</b>: llamar a la API, navegar, cambiar el estado.</li></ul>`},
 {t:"info", eti:"Hacia arriba", h:"Propagación y comportamiento por defecto",
  c:`<div class="termbox">&lt;div className="tarjeta" onClick={abrirDetalle}&gt;
  &lt;h3&gt;{producto.nombre}&lt;/h3&gt;
  &lt;button onClick={e =&gt; { e.stopPropagation(); anadirAlCarrito(producto); }}&gt;
    Añadir
  &lt;/button&gt;
&lt;/div&gt;

&lt;form onSubmit={e =&gt; { e.preventDefault(); enviar(); }}&gt;...&lt;/form&gt;</div>
     <div class="dg"><div class="dg-tit">clic en el botón</div><div class="dg-vert"><div class="dg-caja acento">button onClick<small>se ejecuta primero</small></div><div class="dg-caja">div.tarjeta onClick<small>se ejecuta después... salvo stopPropagation</small></div><div class="dg-caja base">raíz</div></div></div>
     <p><code>stopPropagation</code> corta la subida del evento a los padres; <code>preventDefault</code> evita lo que haría el navegador (enviar el formulario recargando, seguir un enlace). Son cosas distintas. Para capturar en bajada existe <code>onClickCapture</code>.</p>`},
 {t:"opcion", p:"¿Qué pasa con <code>&lt;button onClick={borrar(id)}&gt;</code>?",
  ops:["Borra al hacer clic","Llama a borrar durante el render (en cada render) y pasa su resultado como manejador","Error de sintaxis","Nada"],
  ok:1, why:"Las llaves evalúan la expresión ya. Para pasar argumentos: onClick={() =&gt; borrar(id)}."},
 {t:"opcion", p:"Una tarjeta abre el detalle al hacer clic, pero al pulsar su botón «Añadir» también se abre el detalle. ¿Qué falta?",
  ops:["preventDefault en el botón","stopPropagation en el manejador del botón","Una key","Cambiar a onMouseDown"],
  ok:1, why:"El clic sube del botón a la tarjeta. stopPropagation lo corta; preventDefault no tiene nada que ver con la propagación."},
 {t:"par", p:"Empareja cada llamada con su efecto",
  pares:[["e.preventDefault()","Evita el comportamiento por defecto del navegador"],["e.stopPropagation()","Evita que los padres reciban el evento"],["e.currentTarget","El elemento que tiene el manejador"],["e.target","El elemento donde se originó el evento"],["onClickCapture","Manejador en la fase de captura (de arriba abajo)"]],
  why:"target y currentTarget solo coinciden si el clic cae justo en el elemento del manejador y no en un hijo."},
 {t:"hueco", p:"Completa el formulario para que no recargue la página al enviarse",
  tpl:"<form ___={e => { e.___(); guardar(); }}>",
  banco:["onSubmit","preventDefault","onClick","stopPropagation","submit"], sol:["onSubmit","preventDefault"],
  why:"onSubmit en el form captura el botón y la tecla Enter; onClick en el botón se saltaría Enter."},
 {t:"vf", p:"Por convención, un componente que avisa de algo expone una prop <code>onAlgo</code> (onBuscar) y su función interna se llama <code>handleAlgo</code>.",
  ok:true, why:"Es la convención de la documentación y de casi todas las librerías: on = lo que recibes, handle = lo que defines."}
]},

/* =============== U3 L3 =============== */
{
id:"re3n1",
titulo:"Actualizar objetos y arrays",
claves:["El estado se trata como inmutable: se reemplaza por una copia, nunca se modifica","Spread para objetos; map, filter, toSorted y spread para arrays","En objetos anidados se copia cada nivel hasta el cambio (o se usa Immer)"],
pasos:[
 {t:"info", eti:"Nunca mutar", h:"Actualizar objetos y arrays",
  c:`<div class="termbox">const [tareas, setTareas] = useState&lt;Tarea[]&gt;([]);

// MAL: React no detecta el cambio (misma referencia)
tareas.push(nueva); setTareas(tareas);

// BIEN
setTareas(prev =&gt; [...prev, nueva]);                                        // añadir al final
setTareas(prev =&gt; [nueva, ...prev]);                                        // añadir al principio
setTareas(prev =&gt; prev.filter(t =&gt; t.id !== id));                           // borrar
setTareas(prev =&gt; prev.map(t =&gt; t.id === id ? { ...t, hecha: !t.hecha } : t));  // cambiar uno
setTareas(prev =&gt; prev.toSorted((a, b) =&gt; a.titulo.localeCompare(b.titulo)));   // ordenar
setTareas(prev =&gt; [...prev.slice(0, i), nueva, ...prev.slice(i)]);          // insertar en i</div>
     <p>React decide si hay cambios comparando con <code>Object.is</code>: si pasas el mismo array modificado, cree que nada ha cambiado y no renderiza. Además, mutar rompe cosas que dependen de valores antiguos: memo, el «deshacer», las DevTools.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">métodos de array</div><table class="dg-tabla"><thead><tr><th>Mutan (evitar)</th><th>Devuelven uno nuevo (usar)</th></tr></thead><tbody>
       <tr><td>push, unshift</td><td>[...arr, x], [x, ...arr]</td></tr>
       <tr><td>splice, pop, shift</td><td>filter, slice, toSpliced</td></tr>
       <tr><td>sort, reverse</td><td>toSorted, toReversed</td></tr>
       <tr><td>arr[i] = x</td><td>map, with(i, x)</td></tr>
     </tbody></table></div>`},
 {t:"info", eti:"Anidados", h:"Copiar cada nivel, o Immer",
  c:`<div class="termbox">const [usuario, setUsuario] = useState({
  nombre: "Ana",
  direccion: { ciudad: "Madrid", cp: "28001" },
});

// cambiar la ciudad: copiar usuario Y dirección
setUsuario(prev =&gt; ({ ...prev, direccion: { ...prev.direccion, ciudad: "Bilbao" } }));

// con Immer (use-immer): escribes como si mutaras, y genera la copia
const [usuario, actualizar] = useImmer(inicial);
actualizar(borrador =&gt; { borrador.direccion.ciudad = "Bilbao"; });</div>
     <p>El spread es una copia <b>superficial</b>: <code>{ ...prev }</code> copia el primer nivel, pero <code>prev.direccion</code> sigue siendo el mismo objeto. Las ramas que no cambian se <b>comparten</b> entre la versión vieja y la nueva: eso es barato y permite a <code>memo</code> saltarse lo que no cambió.</p>`},
 {t:"par", p:"Empareja cada operación con su código correcto",
  pares:[["Añadir una tarea","setTareas(p => [...p, nueva])"],["Borrar por id","setTareas(p => p.filter(t => t.id !== id))"],["Marcar una como hecha","setTareas(p => p.map(t => t.id === id ? { ...t, hecha: true } : t))"],["Cambiar un campo de un objeto","setUsuario(p => ({ ...p, email }))"],["Ordenar sin mutar","setTareas(p => p.toSorted(comparar))"]],
  why:"Los mismos patrones inmutables que viste en JavaScript."},
 {t:"opcion", p:"¿Por qué no se actualiza la pantalla con <code>tareas.push(t); setTareas(tareas);</code>?",
  ops:["push no funciona en React","Se pasa el mismo array (misma referencia) y React decide que no hay cambios","Falta un await","Hay que recargar"],
  ok:1, why:"Siempre un array u objeto nuevo."},
 {t:"opcion", p:"Haces <code>const copia = [...tareas]; copia[0].hecha = true; setTareas(copia);</code>. ¿Qué problema tiene?",
  ops:["Ninguno: el array es nuevo","El array es nuevo, pero el objeto tareas[0] es el mismo y se ha mutado: la versión anterior del estado también cambia","Da error de sintaxis","No renderiza"],
  ok:1, why:"La copia es superficial. Hay que copiar también el objeto: copia[0] = { ...copia[0], hecha: true }, o mejor map."},
 {t:"hueco", p:"Completa para cambiar el código postal sin mutar",
  tpl:"setUsuario(p => ({ ...p, direccion: { ___, cp: \"48001\" } }));",
  banco:["...p.direccion","...p","p.direccion","direccion"], sol:["...p.direccion"],
  why:"Hay que copiar el nivel intermedio; con ...p metería nombre y direccion dentro de direccion."},
 {t:"codigo", p:"Implementa <code>setIn(obj, claves, valor)</code>: devuelve una copia con el cambio en la ruta, sin mutar y compartiendo las ramas que no cambian",
  lenguaje:"js",
  c:`<p>Por stdin llega <code>{"estado":..., "ruta":"a.b.c", "valor":...}</code>. El programa ya imprime el nuevo estado, si el original quedó intacto y si las demás ramas del primer nivel son <b>el mismo objeto</b> (===) en el nuevo estado. Solo te falta <code>setIn</code>.</p>`,
  plantilla:"const { estado, ruta, valor } = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\nfunction setIn(obj, claves, v) {\n  // devuelve una copia con obj[claves[0]][claves[1]]... = v, sin mutar obj\n}\nconst antes = JSON.stringify(estado);\nconst claves = ruta.split(\".\");\nconst nuevo = setIn(estado, claves, valor);\nconsole.log(JSON.stringify(nuevo));\nconsole.log(\"original intacto: \" + (JSON.stringify(estado) === antes));\nconsole.log(\"ramas compartidas: \" + Object.keys(estado).filter(k => k !== claves[0]).every(k => nuevo && nuevo[k] === estado[k]));\n",
  pruebas:[{entrada:'{"estado":{"nombre":"Ana","direccion":{"ciudad":"Madrid","cp":"28001"},"prefs":{"tema":"oscuro"}},"ruta":"direccion.ciudad","valor":"Bilbao"}', salida:"{\"nombre\":\"Ana\",\"direccion\":{\"ciudad\":\"Bilbao\",\"cp\":\"28001\"},\"prefs\":{\"tema\":\"oscuro\"}}\noriginal intacto: true\nramas compartidas: true"},{entrada:'{"estado":{"a":{"b":{"c":1,"d":2}},"e":{"f":3}},"ruta":"a.b.c","valor":9}', salida:"{\"a\":{\"b\":{\"c\":9,\"d\":2}},\"e\":{\"f\":3}}\noriginal intacto: true\nramas compartidas: true"},{entrada:'{"estado":{"nombre":"Ana","prefs":{"tema":"oscuro","idioma":"es"}},"ruta":"nombre","valor":"Eva"}', salida:"{\"nombre\":\"Eva\",\"prefs\":{\"tema\":\"oscuro\",\"idioma\":\"es\"}}\noriginal intacto: true\nramas compartidas: true", oculta:true}],
  pista:"Recursión: si no quedan claves, devuelve v. Si no, copia obj con spread y reemplaza solo obj[primera] por setIn(obj[primera], resto, v).",
  solucion:"const { estado, ruta, valor } = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\nfunction setIn(obj, claves, v) {\n  if (claves.length === 0) return v;\n  const [k, ...resto] = claves;\n  return { ...obj, [k]: setIn(obj[k], resto, v) };\n}\nconst antes = JSON.stringify(estado);\nconst claves = ruta.split(\".\");\nconst nuevo = setIn(estado, claves, valor);\nconsole.log(JSON.stringify(nuevo));\nconsole.log(\"original intacto: \" + (JSON.stringify(estado) === antes));\nconsole.log(\"ramas compartidas: \" + Object.keys(estado).filter(k => k !== claves[0]).every(k => nuevo && nuevo[k] === estado[k]));\n",
  why:"Es lo que hace Immer por dentro (con proxies) y lo que hacían los reducers de Redux a mano: copiar el camino hasta el cambio y compartir el resto."}
]},

/* =============== U3 L4 =============== */
{
id:"re3l3",
titulo:"Levantar y estructurar el estado",
claves:["Si dos componentes necesitan el mismo dato, el estado vive en su ancestro común","Una única fuente de verdad por dato; lo derivable se calcula","Estructura el estado sin redundancias, sin duplicados, sin contradicciones y sin anidar de más"],
pasos:[
 {t:"info", eti:"Compartir datos", h:"Estado en el padre",
  c:`<div class="termbox">function PaginaTareas() {
  const [tareas, setTareas] = useState&lt;Tarea[]&gt;([]);
  const [filtro, setFiltro] = useState&lt;"todas" | "pendientes"&gt;("todas");

  const visibles = filtro === "todas" ? tareas : tareas.filter(t =&gt; !t.hecha);   // derivado

  return (
    &lt;&gt;
      &lt;FormularioTarea onCrear={t =&gt; setTareas(p =&gt; [...p, t])} /&gt;
      &lt;Filtros valor={filtro} onCambiar={setFiltro} /&gt;
      &lt;ListaTareas tareas={visibles} /&gt;
      &lt;Resumen pendientes={tareas.filter(t =&gt; !t.hecha).length} /&gt;
    &lt;/&gt;
  );
}</div>
     <p><code>visibles</code> no es estado: se <b>calcula</b> a partir del estado en cada render. Guardar datos derivados en otro estado provoca desincronizaciones.</p>
     <p>Un componente como <code>Filtros</code>, que recibe <code>valor</code> y <code>onCambiar</code> en vez de tener estado propio, se llama <b>controlado</b>: su padre manda.</p>`},
 {t:"info", eti:"Buen diseño", h:"Cinco principios para estructurar el estado",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">principios de la documentación de react</div><table class="dg-tabla"><thead><tr><th>Principio</th><th>Mal</th><th>Bien</th></tr></thead><tbody>
       <tr><td>Agrupar lo que cambia junto</td><td>x e y en dos estados</td><td>posicion {x, y}</td></tr>
       <tr><td>Evitar contradicciones</td><td>enviando y enviado como booleanos</td><td>estado: "escribiendo" | "enviando" | "enviado"</td></tr>
       <tr><td>Evitar redundancia</td><td>nombre, apellido y nombreCompleto</td><td>nombreCompleto se calcula</td></tr>
       <tr><td>Evitar duplicados</td><td>items y seleccionado (copia de un item)</td><td>items e idSeleccionado</td></tr>
       <tr><td>Evitar anidar de más</td><td>árbol profundo de objetos</td><td>normalizado: { porId, ids }</td></tr>
     </tbody></table></div>
     <p>Guardar el <b>id</b> del elemento seleccionado en vez de una copia del objeto evita el clásico fallo: editas el elemento en la lista y el panel de «seleccionado» sigue mostrando la versión vieja.</p>`},
 {t:"par", p:"Empareja cada situación con dónde debe vivir el estado",
  pares:[["Si un desplegable está abierto","En el propio componente del desplegable"],["Lista de tareas que usan el formulario y la lista","En el padre común de ambos"],["Número de pendientes","En ningún estado: se calcula de la lista"],["Usuario autenticado usado en toda la app","En un contexto o gestor de estado global"],["Página actual de una tabla que se quiere compartir por enlace","En la URL"]],
  why:"Estado lo más local posible, y nunca duplicado."},
 {t:"opcion", p:"Guardas <code>tareas</code> y también <code>numeroTareas</code> en dos useState. ¿Qué problema tiene?",
  ops:["Ninguno","Es un dato derivado: puede quedar desincronizado; calcúlalo con tareas.length","Consume demasiada memoria","React no permite dos useState"],
  ok:1, why:"Si se puede calcular a partir de props o estado, no es estado."},
 {t:"opcion", p:"Un formulario tiene <code>const [enviando, setEnviando]</code> y <code>const [enviado, setEnviado]</code>. Un fallo deja los dos a true. ¿Mejor diseño?",
  ops:["Añadir un tercer booleano de error","Un único estado con los valores posibles: \"escribiendo\" | \"enviando\" | \"enviado\" | \"error\"","Usar useRef","Poner un useEffect que los sincronice"],
  ok:1, why:"Con un único estado, las combinaciones imposibles no se pueden representar. Es una máquina de estados sencilla."},
 {t:"opcion", p:"Guardas <code>seleccionado</code> como copia del producto elegido. Al editar el precio en la lista, el panel lateral sigue mostrando el precio viejo. ¿Qué cambias?",
  ops:["Un efecto que copie el producto cada vez","Guardar idSeleccionado y calcular el producto con items.find(p =&gt; p.id === idSeleccionado)","Recargar la página","Usar key en el panel"],
  ok:1, why:"Una sola fuente de verdad: el producto vive en la lista; la selección solo guarda qué producto es."},
 {t:"vf", p:"Un estado que se inicializa con una prop (<code>useState(props.color)</code>) se actualiza solo cuando la prop cambia.",
  ok:false, why:"El valor inicial solo se usa en el primer render. Si quieres seguir la prop, no la copies en estado: úsala directamente (o llámala colorInicial para dejar claro que se ignoran los cambios)."}
]},

/* =============== U3 L5 =============== */
{
id:"re3n2",
titulo:"Conservar y reiniciar el estado",
claves:["El estado pertenece a la posición en el árbol, no a la variable ni al JSX","Mismo tipo de componente en la misma posición conserva el estado; otro tipo lo destruye","Cambiar la key obliga a crear una instancia nueva: la forma limpia de reiniciar"],
pasos:[
 {t:"info", eti:"Dónde vive el estado", h:"El estado está atado a la posición",
  c:`<p>React guarda el estado de cada componente asociado a su <b>posición en el árbol</b> de la interfaz. Mientras en esa posición se renderice el <b>mismo tipo</b> de componente, el estado se conserva, aunque cambien sus props.</p>
     <div class="termbox">function Marcador({ esAna }: { esAna: boolean }) {
  return (
    &lt;div&gt;
      {esAna ? &lt;Contador persona="Ana" /&gt; : &lt;Contador persona="Luis" /&gt;}
    &lt;/div&gt;
  );
}
// Ana suma 3 puntos. Cambias a Luis: ¡Luis empieza con 3!
// Es la misma posición y el mismo tipo (Contador): React ve el mismo componente con otra prop.</div>
     <div class="dg"><div class="dg-tit">qué hace react en cada posición</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">Mismo tipo y key</div><div class="dg-caja ok doble">conserva<small>actualiza props, mantiene estado y DOM</small></div></div>
       <div class="dg-col"><div class="dg-col-tit">Otro tipo o otra key</div><div class="dg-caja aviso doble">destruye y crea<small>estado nuevo, DOM nuevo, efectos otra vez</small></div></div>
     </div></div>`},
 {t:"info", eti:"Reiniciar", h:"Dos formas de reiniciar el estado",
  c:`<div class="termbox">// 1. Posiciones distintas
{esAna &amp;&amp; &lt;Contador persona="Ana" /&gt;}
{!esAna &amp;&amp; &lt;Contador persona="Luis" /&gt;}

// 2. Una key distinta: lo más claro
&lt;Contador key={persona} persona={persona} /&gt;

// caso real: el formulario de un chat debe vaciarse al cambiar de contacto
&lt;Chat key={contacto.id} contacto={contacto} /&gt;</div>
     <p>La key no es solo para listas: cualquier elemento puede llevarla, y cambiarla es decirle a React «esto es otro componente». Es mucho mejor que un <code>useEffect</code> que vacía los campos cuando cambia el contacto (que pinta un fotograma con datos viejos y es fácil de olvidar).</p>
     <div class="nota ojo"><b class="tit">Nunca declares componentes dentro de otros</b>Si defines <code>function Campo()</code> dentro del cuerpo de <code>Formulario</code>, en cada render es una función nueva, es decir, <b>otro tipo</b>: React destruye y recrea el input en cada tecla y pierde el foco.</div>`},
 {t:"opcion", p:"En <code>Marcador</code>, Ana suma 3 puntos y cambias a Luis. ¿Qué se renderiza?",
  ops:["Luis con 0 puntos","Luis con 3 puntos","Ana con 3 puntos","Un error"],
  ok:1, why:"Mismo tipo en la misma posición: React conserva el estado. Con key={persona} o en posiciones distintas, Luis empezaría en 0."},
 {t:"opcion", p:"Una app de chat conserva el texto a medio escribir al cambiar de contacto, y se envía a quien no era. ¿Solución más limpia?",
  ops:["Un useEffect que vacíe el texto cuando cambie el contacto","Renderizar &lt;Chat key={contacto.id} contacto={contacto} /&gt;","Recargar la página","Guardar el texto en localStorage"],
  ok:1, why:"Con la key, cada contacto tiene su propia instancia de Chat y su estado empieza de cero."},
 {t:"opcion", p:"Escribes en un input y pierde el foco con cada tecla. El input está en <code>function Campo()</code>, declarada dentro del cuerpo de <code>Formulario</code>. ¿Por qué?",
  ops:["Falta autoFocus","Cada render de Formulario crea una función Campo nueva: para React es otro tipo, así que desmonta el input y monta uno nuevo","El navegador tiene un bug","Falta un useRef"],
  ok:1, why:"Declara los componentes en el nivel superior del módulo. Es uno de los errores de React más desconcertantes."},
 {t:"par", p:"Empareja cada cambio entre dos renders con lo que ocurre con el estado",
  pares:[["<Contador /> pasa a <Contador color=\"rojo\" />","Se conserva: mismo tipo y posición"],["<Contador /> pasa a <p>...</p>","Se destruye: cambia el tipo"],["<Contador key=\"a\" /> pasa a <Contador key=\"b\" />","Se destruye: cambia la key"],["<div><Contador /></div> pasa a <section><Contador /></section>","Se destruye: cambia el tipo del padre y todo su subárbol"]],
  why:"Al cambiar el tipo de un elemento, React desmonta todo lo que cuelga de él."},
 {t:"vf", p:"Una key solo tiene sentido dentro de un <code>map</code>.",
  ok:false, why:"Se puede poner a cualquier elemento para controlar su identidad; reiniciar un formulario o un reproductor con una key nueva es un patrón muy habitual."}
]}

]});
