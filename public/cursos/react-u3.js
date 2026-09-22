window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Estado y eventos",
resumen: "useState, eventos, actualizar estado sin mutar, actualizaciones basadas en el valor anterior y levantar el estado",
nivel: "Intermedio",
color: "#4fc8ea",
lecciones: [

{
id:"re3l1",
titulo:"useState",
claves:["useState guarda datos que, al cambiar, vuelven a renderizar el componente","Devuelve [valor, setValor]; nunca modifiques el valor directamente","Cada render ve una «foto» del estado: el nuevo valor llega en el siguiente render"],
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
     <p>Una variable normal se «reinicia» cada vez que React llama a la función. <code>useState</code> hace que React recuerde el valor entre renderizados, y llamar a <code>setCuenta</code> le pide volver a renderizar con el nuevo valor.</p>`},
 {t:"info", eti:"La foto", h:"El estado no cambia al instante",
  c:`<div class="termbox">function Ejemplo() {
  const [n, setN] = useState(0);
  function tresVeces() {
    setN(n + 1);
    setN(n + 1);
    setN(n + 1);
    console.log(n);          // 0: este render sigue viendo n = 0
  }
  // resultado: n pasa a 1, no a 3

  function tresVecesBien() {
    setN(prev =&gt; prev + 1);  // actualizacion basada en el valor anterior
    setN(prev =&gt; prev + 1);
    setN(prev =&gt; prev + 1);  // n pasa a 3
  }
}</div>`},
 {t:"opcion", p:"Tras pulsar una vez el botón que llama a <code>tresVeces()</code>, ¿qué valor tiene n?",
  ops:["3","1","0","Error"],
  ok:1, why:"Las tres llamadas usan el mismo n (0) de ese render. Para encadenar, la forma con función: setN(prev => prev + 1)."},
 {t:"hueco", p:"Completa para declarar un estado <code>abierto</code> que empieza en false",
  tpl:"const [abierto, ___] = ___(false);", banco:["setAbierto","useState","useEffect","abrir"], sol:["setAbierto","useState"],
  why:"Convención: [algo, setAlgo]."},
 {t:"vf", p:"Llamar a un setter de estado actualiza la variable inmediatamente en la misma función.",
  ok:false, why:"Programa un nuevo render; el valor nuevo se ve en ese render, no en el actual."}
]},

{
id:"re3l2",
titulo:"Eventos y estado inmutable",
claves:["Manejadores: onClick={fn}, no onClick={fn()}","Objetos y arrays en el estado se reemplazan, no se mutan","Spread, map y filter para crear el nuevo valor"],
pasos:[
 {t:"info", eti:"Reaccionar", h:"Manejadores de eventos",
  c:`<div class="termbox">&lt;button onClick={guardar}&gt;Guardar&lt;/button&gt;              // pasa la funcion
&lt;button onClick={() =&gt; borrar(tarea.id)}&gt;Borrar&lt;/button&gt;  // con argumentos
&lt;button onClick={guardar()}&gt;Guardar&lt;/button&gt;            // MAL: se ejecuta al renderizar</div>`},
 {t:"info", eti:"Nunca mutar", h:"Actualizar objetos y arrays",
  c:`<div class="termbox">const [tareas, setTareas] = useState&lt;Tarea[]&gt;([]);

// MAL: React no detecta el cambio (misma referencia)
tareas.push(nueva); setTareas(tareas);

// BIEN
setTareas(prev =&gt; [...prev, nueva]);                                       // anadir
setTareas(prev =&gt; prev.filter(t =&gt; t.id !== id));                          // borrar
setTareas(prev =&gt; prev.map(t =&gt; t.id === id ? { ...t, hecha: !t.hecha } : t));  // cambiar

const [usuario, setUsuario] = useState({ nombre: "", email: "" });
setUsuario(prev =&gt; ({ ...prev, email: "ana@x.com" }));</div>
     <p>React compara referencias: si pasas el mismo array modificado, cree que nada ha cambiado.</p>`},
 {t:"par", p:"Empareja cada operación con su código correcto",
  pares:[["Añadir una tarea","setTareas(p => [...p, nueva])"],["Borrar por id","setTareas(p => p.filter(t => t.id !== id))"],["Marcar una como hecha","setTareas(p => p.map(t => t.id === id ? { ...t, hecha: true } : t))"],["Cambiar un campo de un objeto","setUsuario(p => ({ ...p, email }))"]],
  why:"Los mismos patrones inmutables que viste en JavaScript."},
 {t:"opcion", p:"¿Por qué no se actualiza la pantalla con <code>tareas.push(t); setTareas(tareas);</code>?",
  ops:["push no funciona en React","Se pasa el mismo array (misma referencia) y React decide que no hay cambios","Falta un await","Hay que recargar"],
  ok:1, why:"Siempre un array u objeto nuevo."}
]},

{
id:"re3l3",
titulo:"Levantar el estado",
claves:["Si dos componentes necesitan el mismo dato, el estado vive en su ancestro común","El padre pasa el valor y una función para cambiarlo","Una única fuente de verdad por dato"],
pasos:[
 {t:"info", eti:"Compartir datos", h:"Estado en el padre",
  c:`<div class="termbox">function PaginaTareas() {
  const [tareas, setTareas] = useState&lt;Tarea[]&gt;([]);
  const [filtro, setFiltro] = useState&lt;"todas" | "pendientes"&gt;("todas");

  const visibles = filtro === "todas" ? tareas : tareas.filter(t =&gt; !t.hecha);   // derivado

  return (
    &lt;&gt;
      &lt;FormularioTarea alCrear={t =&gt; setTareas(p =&gt; [...p, t])} /&gt;
      &lt;Filtros valor={filtro} alCambiar={setFiltro} /&gt;
      &lt;ListaTareas tareas={visibles} /&gt;
      &lt;Resumen pendientes={tareas.filter(t =&gt; !t.hecha).length} /&gt;
    &lt;/&gt;
  );
}</div>
     <p><code>visibles</code> no es estado: se <b>calcula</b> a partir del estado en cada render. Guardar datos derivados en otro estado provoca desincronizaciones.</p>`},
 {t:"par", p:"Empareja cada situación con dónde debe vivir el estado",
  pares:[["Si un desplegable está abierto","En el propio componente del desplegable"],["Lista de tareas que usan el formulario y la lista","En el padre común de ambos"],["Número de pendientes","En ningún estado: se calcula de la lista"],["Usuario autenticado usado en toda la app","En un contexto o gestor de estado global"]],
  why:"Estado lo más local posible, y nunca duplicado."},
 {t:"opcion", p:"Guardas <code>tareas</code> y también <code>numeroTareas</code> en dos useState. ¿Qué problema tiene?",
  ops:["Ninguno","Es un dato derivado: puede quedar desincronizado; calcúlalo con tareas.length","Consume demasiada memoria","React no permite dos useState"],
  ok:1, why:"Si se puede calcular a partir de props o estado, no es estado."}
]}

]});
