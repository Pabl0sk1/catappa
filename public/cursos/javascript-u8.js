window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Asincronía",
resumen: "Callbacks, promesas, async y await, fetch para llamar a APIs, gestión de errores y operaciones en paralelo",
nivel: "Avanzado",
color: "#c5ab2a",
lecciones: [

{
id:"js8l1",
titulo:"Por qué asincronía",
claves:["JavaScript ejecuta tu código en un solo hilo","Las operaciones lentas (red, temporizadores, disco) no bloquean: avisan cuando terminan","Callbacks, promesas y async/await son tres formas de esperar un resultado"],
pasos:[
 {t:"info", eti:"Un solo hilo", h:"No bloquear",
  c:`<p>En el navegador, el mismo hilo que ejecuta tu JavaScript es el que pinta la página y responde a los clics. Si una petición a la red bloqueara ese hilo durante 2 segundos, la página se congelaría.</p>
     <p>Por eso las operaciones lentas son <b>asíncronas</b>: las pides, el navegador (o Node) las hace «por detrás», y cuando terminan te avisan para que continúes.</p>
     <div class="termbox">console.log("1");
setTimeout(() =&gt; console.log("2"), 0);
console.log("3");
// 1, 3, 2</div>`},
 {t:"info", eti:"El origen", h:"Callbacks y su problema",
  c:`<div class="termbox">obtenerUsuario(id, (err, usuario) =&gt; {
  if (err) return mostrarError(err);
  obtenerPedidos(usuario.id, (err, pedidos) =&gt; {
    if (err) return mostrarError(err);
    obtenerDetalle(pedidos[0].id, (err, detalle) =&gt; {
      // ... "callback hell": piramide dificil de leer y de gestionar errores
    });
  });
});</div>`},
 {t:"opcion", p:"¿En qué orden se imprime?", c:`<div class="termbox">console.log("A");
setTimeout(() =&gt; console.log("B"), 100);
setTimeout(() =&gt; console.log("C"), 0);
console.log("D");</div>`,
  ops:["A B C D","A D C B","A C D B","A D B C"],
  ok:1, why:"Primero todo el código síncrono (A, D); luego los temporizadores según su tiempo (C a los 0 ms, B a los 100)."},
 {t:"vf", p:"Una petición de red con fetch congela la página hasta que llega la respuesta.",
  ok:false, why:"fetch es asíncrono: la página sigue respondiendo mientras espera."}
]},

{
id:"js8l2",
titulo:"Promesas",
claves:["Una promesa representa un resultado futuro: pendiente, cumplida o rechazada","then encadena, catch captura errores, finally se ejecuta siempre","Promise.all, allSettled, race y any combinan varias"],
pasos:[
 {t:"info", eti:"Un valor futuro", h:"Qué es una promesa",
  c:`<div class="termbox">fetch("/api/usuario/7")                    // devuelve una Promise
  .then(respuesta =&gt; respuesta.json())      // otra promesa
  .then(usuario =&gt; mostrar(usuario))
  .catch(error =&gt; mostrarError(error))      // cualquier error de la cadena
  .finally(() =&gt; ocultarSpinner());

// crear una
const esperar = ms =&gt; new Promise(resolve =&gt; setTimeout(resolve, ms));</div>
     <p>Estados: <b>pending</b> (esperando), <b>fulfilled</b> (cumplida con un valor) o <b>rejected</b> (rechazada con un error). Una vez resuelta, no cambia.</p>`},
 {t:"par", p:"Empareja cada combinador con su comportamiento",
  pares:[["Promise.all","Espera a todas; falla en cuanto una falla"],["Promise.allSettled","Espera a todas y devuelve el resultado de cada una, falle o no"],["Promise.race","Se resuelve con la primera que termine (bien o mal)"],["Promise.any","La primera que se cumpla; falla solo si fallan todas"]],
  why:"allSettled es ideal cuando quieres mostrar lo que funcionó aunque algo falle."},
 {t:"opcion", p:"Necesitas los datos de 3 APIs independientes y sin ninguno no puedes seguir. ¿Qué usas?",
  ops:["Tres await seguidos","Promise.all([a(), b(), c()]): las tres en paralelo y falla si alguna falla","Promise.race","setTimeout"],
  ok:1, why:"En paralelo tardas lo que la más lenta, no la suma de las tres."},
 {t:"vf", p:"Un error lanzado dentro de un <code>then</code> puede capturarse con un <code>catch</code> al final de la cadena.",
  ok:true, why:"El error se propaga por la cadena hasta el primer catch."}
]},

{
id:"js8l3",
titulo:"async y await",
claves:["async marca una función que siempre devuelve una promesa","await pausa esa función hasta que la promesa se resuelve","try/catch para errores; no olvides await"],
pasos:[
 {t:"info", eti:"Legible", h:"Código asíncrono que parece síncrono",
  c:`<div class="termbox">async function cargarPerfil(id) {
  try {
    const res = await fetch(\`/api/usuarios/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const usuario = await res.json();
    const pedidos = await obtenerPedidos(usuario.id);
    return { usuario, pedidos };
  } catch (error) {
    console.error("No se pudo cargar el perfil", error);
    throw error;
  }
}

// en paralelo con await
const [usuario, ajustes] = await Promise.all([getUsuario(), getAjustes()]);</div>`},
 {t:"hueco", p:"Completa para esperar la respuesta de la API",
  tpl:"___ function cargar() {\n  const res = ___ fetch(\"/api/tareas\");\n  return res.json();\n}", banco:["async","await","then","yield"], sol:["async","await"],
  why:"await solo puede usarse dentro de funciones async (o en el nivel superior de un módulo)."},
 {t:"opcion", p:"¿Qué problema tiene este código?", c:`<div class="termbox">async function guardar(tareas) {
  tareas.forEach(async t =&gt; {
    await api.guardar(t);
  });
  console.log("Todo guardado");
}</div>`,
  ops:["Ninguno","forEach no espera a los callbacks async: «Todo guardado» se imprime antes de que terminen. Usa for...of con await o Promise.all","api.guardar no existe","Falta return"],
  ok:1, why:"Error muy común. Promise.all(tareas.map(t => api.guardar(t))) las guarda en paralelo y espera a todas."},
 {t:"vf", p:"Una función <code>async</code> que hace <code>return 5</code> devuelve el número 5 directamente.",
  ok:false, why:"Devuelve una promesa que se cumple con 5."}
]},

{
id:"js8l4",
titulo:"fetch y llamadas a APIs",
claves:["fetch no rechaza por errores HTTP (404, 500): comprueba res.ok","Envía JSON con method, headers y body: JSON.stringify","AbortController para cancelar y poner timeouts"],
pasos:[
 {t:"info", eti:"Hablar con el backend", h:"fetch completo",
  c:`<div class="termbox">async function crearTarea(titulo) {
  const res = await fetch("/api/tareas", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
    body: JSON.stringify({ titulo }),
    signal: AbortSignal.timeout(5000),          // cancelar a los 5 s
  });
  if (!res.ok) {
    const problema = await res.json().catch(() =&gt; ({}));
    throw new Error(problema.detail ?? \`Error \${res.status}\`);
  }
  return res.json();
}</div>`},
 {t:"par", p:"Empareja cada situación con lo que hace fetch",
  pares:[["El servidor responde 404","Resuelve la promesa con res.ok = false"],["Sin conexión a internet","Rechaza la promesa (TypeError)"],["Se supera AbortSignal.timeout","Rechaza con un error de tipo AbortError/TimeoutError"],["Respuesta 201 con JSON","Resuelve; res.json() da el objeto"]],
  why:"No comprobar res.ok hace que un 500 se trate como éxito."},
 {t:"opcion", p:"Tu código con fetch no entra en el catch cuando la API devuelve 500. ¿Por qué?",
  ops:["Un bug del navegador","fetch solo rechaza por fallos de red; los códigos HTTP de error hay que comprobarlos con res.ok","Falta await en catch","El servidor no responde"],
  ok:1, why:"Librerías como axios sí rechazan con 4xx y 5xx; fetch no."},
 {t:"vf", p:"Si el usuario escribe rápido en un buscador, conviene cancelar la petición anterior con AbortController.",
  ok:true, why:"Evita que una respuesta antigua llegue tarde y sobrescriba la buena (condición de carrera)."}
]}

]});
