window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "El event loop",
resumen: "Pila de llamadas, APIs del entorno, cola de tareas y microtareas, orden de ejecución y cómo no bloquear el hilo",
nivel: "Avanzado",
color: "#baa020",
lecciones: [

{
id:"js9l1",
titulo:"Pila, APIs y colas",
claves:["La pila de llamadas ejecuta el código síncrono","El entorno (navegador o Node) hace el trabajo lento y encola los callbacks","El event loop pasa callbacks a la pila solo cuando está vacía"],
pasos:[
 {t:"info", eti:"El mecanismo", h:"Cómo funciona el event loop",
  c:`<div class="dg"><div class="dg-tit">el event loop</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">Pila de llamadas</div>
<div class="dg-caja base"><small>tu código</small></div>
<div class="dg-caja acento"><code>main()</code></div>
<div class="dg-caja">...</div></div>
<div class="dg-col"><div class="dg-col-tit">APIs del entorno</div>
<div class="dg-caja base"><small>navegador / Node</small></div>
<div class="dg-caja">temporizador<small>lo pide <code>setTimeout</code></small></div>
<div class="dg-caja">red<small>la pide <code>fetch</code></small></div></div>
<div class="dg-col"><div class="dg-col-tit">Colas</div>
<div class="dg-caja doble">cola de tareas (macrotareas)<small>setTimeout, eventos, E/S</small></div>
<div class="dg-caja doble ok">cola de microtareas<small>promesas (then, await), queueMicrotask</small></div></div>
</div>
<div style="margin:14px 0 8px;font-weight:700;font-size:13.5px;text-align:center">Event loop: cuando la pila queda vacía</div>
<div class="dg-vert">
<div class="dg-caja">1. ejecuta TODAS las microtareas pendientes</div>
<div class="dg-caja base">2. (el navegador puede repintar)</div>
<div class="dg-caja">3. toma UNA macrotarea y vuelve al paso 1</div>
</div></div>`},
 {t:"par", p:"Empareja cada elemento con su papel",
  pares:[["Pila de llamadas","Ejecuta las funciones una a una"],["APIs del entorno","Temporizadores, red, DOM: trabajan fuera de la pila"],["Cola de macrotareas","setTimeout, eventos de usuario, E/S"],["Cola de microtareas","Callbacks de promesas y queueMicrotask"],["Event loop","Mueve trabajo de las colas a la pila cuando está vacía"]],
  why:"Explicar este diagrama es una pregunta frecuente en entrevistas de frontend y de Node."},
 {t:"orden", p:"Ordena lo que ocurre con <code>setTimeout(cb, 0)</code>",
  items:["La pila ejecuta setTimeout y el entorno arranca el temporizador","El código síncrono restante sigue ejecutándose","El temporizador termina y cb pasa a la cola de macrotareas","La pila queda vacía y se vacían las microtareas pendientes","El event loop lleva cb a la pila y se ejecuta"],
  why:"Por eso 0 ms no significa «ahora mismo»."},
 {t:"vf", p:"Mientras un bucle síncrono muy largo se ejecuta, los clics del usuario se procesan en paralelo.",
  ok:false, why:"Se quedan en la cola: la página parece congelada hasta que la pila se vacía."}
]},

{
id:"js9l2",
titulo:"Microtareas frente a macrotareas",
claves:["Las microtareas (promesas) se ejecutan antes que la siguiente macrotarea (setTimeout)","Tras cada await, el resto de la función async es una microtarea","Orden típico: síncrono, microtareas, macrotareas"],
pasos:[
 {t:"info", eti:"El orden exacto", h:"Un ejemplo clásico",
  c:`<div class="termbox">console.log("1: sincrono");
setTimeout(() =&gt; console.log("2: macrotarea"), 0);
Promise.resolve().then(() =&gt; console.log("3: microtarea"));
queueMicrotask(() =&gt; console.log("4: microtarea"));
console.log("5: sincrono");

// 1: sincrono
// 5: sincrono
// 3: microtarea
// 4: microtarea
// 2: macrotarea</div>`},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">async function f() {
  console.log("A");
  await null;
  console.log("B");
}
f();
console.log("C");</div>`,
  ops:["A B C","A C B","C A B","B A C"],
  ok:1, why:"Hasta el primer await la función es síncrona (A). Lo que va después del await es una microtarea que se ejecuta cuando la pila se vacía (tras C)."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">setTimeout(() =&gt; console.log("T"), 0);
Promise.resolve().then(() =&gt; console.log("P1")).then(() =&gt; console.log("P2"));
console.log("S");</div>`,
  ops:["S T P1 P2","S P1 P2 T","T S P1 P2","P1 P2 S T"],
  ok:1, why:"Todas las microtareas (incluidas las que crean otras microtareas) van antes de la siguiente macrotarea."},
 {t:"vf", p:"Un bucle infinito de microtareas (cada una encola otra) impide que se ejecuten los setTimeout y que se repinte la página.",
  ok:true, why:"El event loop vacía todas las microtareas antes de seguir: nunca llega a la siguiente macrotarea."}
]},

{
id:"js9l3",
titulo:"No bloquear el hilo",
claves:["Tareas largas congelan la interfaz o, en Node, a todos los clientes","Trocear el trabajo, Web Workers o worker_threads para cálculo pesado","debounce y throttle para eventos muy frecuentes"],
pasos:[
 {t:"info", eti:"Mantener la fluidez", h:"Trabajo pesado",
  c:`<ul><li>En el navegador, cualquier tarea de más de ~50 ms se nota como «tirón».</li>
     <li>En <b>Node.js</b>, un cálculo síncrono de 2 s bloquea <b>todas</b> las peticiones del servidor durante 2 s.</li></ul>
     <div class="termbox">// navegador: calculo pesado en otro hilo
const worker = new Worker("calculo.js");
worker.postMessage(datos);
worker.onmessage = e =&gt; mostrar(e.data);

// Node: worker_threads, o evitar JSON.parse de ficheros enormes, bcrypt sincrono, regex costosas...</div>`},
 {t:"info", eti:"Eventos frecuentes", h:"debounce y throttle",
  c:`<div class="termbox">function debounce(fn, ms) {
  let t;
  return (...args) =&gt; {
    clearTimeout(t);
    t = setTimeout(() =&gt; fn(...args), ms);
  };
}
buscador.addEventListener("input", debounce(e =&gt; buscar(e.target.value), 300));</div>
     <p><b>debounce</b>: espera a que el usuario deje de escribir 300 ms antes de buscar. <b>throttle</b>: como mucho una vez cada X ms (útil para scroll).</p>`},
 {t:"par", p:"Empareja cada técnica con su caso",
  pares:[["debounce","Buscar cuando el usuario deja de escribir"],["throttle","Reaccionar al scroll como mucho cada 100 ms"],["Web Worker","Procesar una imagen grande sin congelar la página"],["worker_threads","Cálculo intensivo en Node sin bloquear el servidor"]],
  why:"debounce también ahorra muchísimas peticiones al backend."},
 {t:"opcion", p:"Tu API de Node comprime un PDF de forma síncrona y, mientras, las demás peticiones se quedan esperando. ¿Por qué?",
  ops:["Por falta de RAM","Node ejecuta el JavaScript en un solo hilo: el trabajo síncrono bloquea el event loop para todos","Por la red","Por Express"],
  ok:1, why:"Usa versiones asíncronas, worker_threads o una cola de trabajos aparte."}
]}

]});
