window.CURSOS = window.CURSOS || {};
(CURSOS.html = CURSOS.html || []).push({
titulo: "Formularios completos",
resumen: "Anatomía de un formulario, todos los controles, validación nativa y Constraint Validation API, envío de datos y errores accesibles",
nivel: "Intermedio",
color: "#e8784c",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"hc2l2",
titulo:"Anatomía de un formulario",
claves:["form con action y method; cada campo con name (sin name no se envía)","Cada control con su label: explícito con for/id o implícito envolviéndolo","fieldset y legend agrupan; autocomplete ayuda a rellenar y es requisito WCAG"],
pasos:[
 {t:"info", eti:"Recoger datos", h:"Un formulario accesible",
  c:`<div class="termbox">&lt;form action="/api/registro" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input id="email" name="email" type="email" required autocomplete="email"&gt;

  &lt;label for="clave"&gt;Contraseña&lt;/label&gt;
  &lt;input id="clave" name="clave" type="password" required minlength="12"
         autocomplete="new-password" aria-describedby="ayuda-clave"&gt;
  &lt;p id="ayuda-clave"&gt;Mínimo 12 caracteres.&lt;/p&gt;

  &lt;label&gt;&lt;input type="checkbox" name="boletin"&gt; Quiero recibir novedades&lt;/label&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Plan&lt;/legend&gt;
    &lt;label&gt;&lt;input type="radio" name="plan" value="gratis" checked&gt; Gratis&lt;/label&gt;
    &lt;label&gt;&lt;input type="radio" name="plan" value="pro"&gt; Pro&lt;/label&gt;
  &lt;/fieldset&gt;

  &lt;button&gt;Crear cuenta&lt;/button&gt;
&lt;/form&gt;</div>`},
 {t:"info", eti:"Las piezas", h:"name, label, fieldset y autocomplete",
  c:`<ul><li><b>name</b> es la clave con la que viaja el valor. Un campo sin name <b>no se envía</b>, aunque tenga id.</li>
     <li><b>label</b> da el nombre accesible, amplía la zona de clic (pulsar la etiqueta marca la casilla) y no desaparece al escribir, a diferencia de <code>placeholder</code>, que es solo un ejemplo.</li>
     <li><b>fieldset + legend</b> agrupan controles relacionados. Imprescindible en radios: el lector dice «Plan, grupo; Gratis, botón de opción, 1 de 2».</li>
     <li><b>autocomplete</b> con tokens estándar (<code>name</code>, <code>email</code>, <code>tel</code>, <code>street-address</code>, <code>postal-code</code>, <code>cc-number</code>, <code>one-time-code</code>, <code>current-password</code>, <code>new-password</code>…) permite al navegador y al gestor de contraseñas rellenar, y es la forma de cumplir WCAG 1.3.5 (identificar el propósito de los campos con datos personales).</li></ul>
     <div class="nota ojo"><b class="tit">El botón sin type</b>Un <code>&lt;button&gt;</code> dentro de un form es <code>type="submit"</code> por defecto. Un botón «Mostrar contraseña» sin <code>type="button"</code> envía el formulario al pulsarlo.</div>`},
 {t:"par", p:"Empareja cada atributo con su papel",
  pares:[["name","Clave con la que se envía el valor"],["id","Enlaza el campo con su label"],["for","En el label, apunta al id del campo"],["autocomplete","Qué dato es, para rellenarlo solo"],["placeholder","Ejemplo de formato, no sustituye a la etiqueta"]],
  why:"id y name suelen coincidir, pero hacen cosas distintas: uno para el documento, otro para el envío."},
 {t:"opcion", p:"¿Para qué sirve asociar un <code>&lt;label for=\"email\"&gt;</code> al input con <code>id=\"email\"</code>?",
  ops:["Por estética","El lector de pantalla anuncia el campo con su nombre y al pulsar la etiqueta se enfoca el campo","Para enviarlo al servidor","No sirve para nada"],
  ok:1, why:"Un placeholder no sustituye a la etiqueta: desaparece al escribir."},
 {t:"vf", p:"La validación nativa del navegador (required, minlength) hace innecesaria la validación en el servidor.",
  ok:false, why:"Cualquiera puede saltársela con DevTools o enviando la petición a mano. Es una ayuda para el usuario; el servidor siempre valida."},
 {t:"opcion", p:"Al pulsar «Mostrar contraseña», el formulario se envía. ¿Qué falla?",
  ops:["Falta novalidate","El botón no tiene type=\"button\" y actúa como submit","El input password no admite botones","Falta un preventDefault en todos los botones"],
  ok:1, why:"El valor por defecto de <code>type</code> en un button es <code>submit</code>. Todo botón que no envía lleva <code>type=\"button\"</code>."},
 {t:"hueco", p:"Completa el grupo de opciones de envío",
  tpl:'<___>\n  <___>Tipo de envío</legend>\n  <label><input type="radio" name="envio" value="normal"> Normal</label>\n  <label><input type="radio" name="envio" value="urgente"> Urgente</label>\n</fieldset>',
  banco:["fieldset","legend","div","label","caption","group"], sol:["fieldset","legend"],
  why:"Todos los radios del grupo comparten <code>name</code>: eso es lo que hace que marcar uno desmarque los demás y que se envíe un solo valor."},
 {t:"escribe", p:"¿Qué valor de <code>autocomplete</code> pones en el campo de contraseña de un formulario de registro?",
  sol:["new-password"],
  pista:"No es la actual: es una nueva.",
  why:"Con <code>new-password</code> el gestor de contraseñas propone una generada; con <code>current-password</code> (en el login) ofrece la guardada."}
]},

/* =============== U4 L2 =============== */
{
id:"ht4n1",
titulo:"Todos los controles",
claves:["Cada type de input trae teclado, selector y validación propios","select, textarea y datalist completan el catálogo; output, meter y progress muestran resultados","inputmode y enterkeyhint ajustan el teclado del móvil sin cambiar el tipo"],
pasos:[
 {t:"info", eti:"El catálogo", h:"Tipos de input",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">tipos de input</div><table class="dg-tabla"><thead><tr><th>type</th><th>para</th><th>lo que da gratis</th></tr></thead><tbody>
     <tr><td>text, search</td><td>texto libre, búsquedas</td><td>search añade botón de borrar</td></tr>
     <tr><td>email, url, tel</td><td>contacto</td><td>teclado con @ o .com; email y url validan formato (tel no)</td></tr>
     <tr><td>password</td><td>claves</td><td>oculta el texto, gestores de contraseñas</td></tr>
     <tr><td>number</td><td>cantidades</td><td>min, max, step; <b>no</b> para DNI, teléfonos o tarjetas</td></tr>
     <tr><td>range</td><td>valor aproximado</td><td>deslizador</td></tr>
     <tr><td>date, time, datetime-local, month, week</td><td>fechas y horas</td><td>selector nativo, valor en ISO (2026-09-23)</td></tr>
     <tr><td>checkbox, radio</td><td>sí/no, una de varias</td><td>checked, grupos por name</td></tr>
     <tr><td>file</td><td>subir ficheros</td><td>accept, multiple, capture</td></tr>
     <tr><td>color</td><td>elegir color</td><td>selector nativo</td></tr>
     <tr><td>hidden</td><td>datos que viajan sin verse</td><td>no son secretos: se ven en el código</td></tr></tbody></table></div>`},
 {t:"info", eti:"Más controles", h:"select, textarea, datalist y compañía",
  c:`<div class="termbox">&lt;label for="pais"&gt;País&lt;/label&gt;
&lt;select id="pais" name="pais"&gt;
  &lt;option value=""&gt;Elige uno&lt;/option&gt;
  &lt;optgroup label="Europa"&gt;
    &lt;option value="es" selected&gt;España&lt;/option&gt;
    &lt;option value="pt"&gt;Portugal&lt;/option&gt;
  &lt;/optgroup&gt;
&lt;/select&gt;

&lt;label for="msg"&gt;Mensaje&lt;/label&gt;
&lt;textarea id="msg" name="msg" rows="5" maxlength="500"&gt;&lt;/textarea&gt;

&lt;label for="ciudad"&gt;Ciudad&lt;/label&gt;
&lt;input id="ciudad" name="ciudad" list="ciudades"&gt;          &lt;!-- sugerencias, texto libre --&gt;
&lt;datalist id="ciudades"&gt;&lt;option value="Madrid"&gt;&lt;option value="Sevilla"&gt;&lt;/datalist&gt;

&lt;input id="cp" name="cp" inputmode="numeric" autocomplete="postal-code"&gt;
&lt;progress value="70" max="100"&gt;70 %&lt;/progress&gt;      &lt;!-- avance de una tarea --&gt;
&lt;meter value="0.8" low="0.3" high="0.7"&gt;80 %&lt;/meter&gt;    &lt;!-- medida en un rango: uso de disco --&gt;
&lt;output name="total" for="cantidad precio"&gt;0 €&lt;/output&gt;</div>
     <p><code>inputmode</code> (<code>numeric</code>, <code>decimal</code>, <code>tel</code>, <code>email</code>, <code>search</code>) cambia solo el teclado virtual, sin la validación ni las flechas de <code>type="number"</code>. <code>enterkeyhint</code> cambia la etiqueta de la tecla Intro («Buscar», «Siguiente», «Enviar»).</p>`},
 {t:"par", p:"Empareja cada dato con el control más adecuado",
  pares:[["Fecha de nacimiento",'<input type="date">'],["Código postal",'<input inputmode="numeric">'],["Comentario largo","<textarea>"],["Provincia de una lista cerrada","<select>"],["Aceptar las condiciones",'<input type="checkbox">']],
  why:"Un código postal «00123» con type=\"number\" perdería los ceros y mostraría flechas para subir y bajar: absurdo. Número es solo lo que se suma o se compara."},
 {t:"opcion", p:"¿Qué tipo usas para el número de tarjeta de crédito?",
  ops:["type=\"number\"","type=\"text\" con inputmode=\"numeric\" y autocomplete=\"cc-number\"","type=\"tel\"","type=\"password\""],
  ok:1, why:"No es una cantidad: puede llevar espacios y tiene 16 dígitos que number redondearía. Con inputmode sale el teclado numérico y con autocomplete el navegador la rellena."},
 {t:"hueco", p:"Completa el campo con sugerencias que permite escribir otra cosa",
  tpl:'<input id="lenguaje" name="lenguaje" ___="lenguajes">\n<___ id="lenguajes">\n  <option value="JavaScript">\n  <option value="Python">\n</datalist>',
  banco:["list","datalist","select","options","for","menu"], sol:["list","datalist"],
  why:"A diferencia de <code>select</code>, datalist solo sugiere: se puede escribir cualquier valor. Útil para búsquedas y campos con valores frecuentes."},
 {t:"vf", p:"<code>&lt;progress&gt;</code> y <code>&lt;meter&gt;</code> son intercambiables.",
  ok:false, why:"progress mide el avance de una tarea hacia su fin (subida de un fichero); meter, un valor dentro de un rango conocido (espacio en disco, fuerza de una contraseña)."},
 {t:"escribe", p:"¿Qué atributo cambia el teclado del móvil a numérico sin usar <code>type=\"number\"</code>? (con su valor)",
  sol:["inputmode=\"numeric\"","inputmode=numeric","inputmode='numeric'","inputmode=\"decimal\""],
  pista:"input + mode.",
  why:"Es la opción correcta para códigos, PIN y verificaciones de un solo uso (junto con <code>autocomplete=\"one-time-code\"</code>)."},
 {t:"opcion", p:"¿Qué atributo de <code>&lt;input type=\"file\"&gt;</code> limita el selector a imágenes?",
  ops:["type=\"image\"","accept=\"image/*\"","filter=\"image\"","capture"],
  ok:1, why:"<code>accept</code> filtra el selector, pero no es seguridad: el servidor debe comprobar el tipo real del fichero. <code>type=\"image\"</code> es otra cosa (un botón de envío con imagen)."}
]},

/* =============== U4 L3 =============== */
{
id:"ht4n2",
titulo:"Validación nativa y Constraint Validation API",
claves:["required, minlength, maxlength, min, max, step, pattern y el propio type validan sin JavaScript","pattern se ancla entero: debe casar con todo el valor","checkValidity, reportValidity, setCustomValidity y validity permiten validación a medida"],
pasos:[
 {t:"info", eti:"Sin JavaScript", h:"Restricciones declarativas",
  c:`<div class="termbox">&lt;input name="usuario" required minlength="3" maxlength="20"
       pattern="[a-z0-9_]+" title="Minúsculas, números y guion bajo"&gt;
&lt;input name="edad" type="number" min="18" max="120" step="1"&gt;
&lt;input name="web" type="url"&gt;</div>
     <p>Al enviar, el navegador comprueba cada campo, bloquea el envío, enfoca el primero inválido y muestra un mensaje. En CSS: <code>:invalid</code> (siempre, incluso antes de tocar el campo) y <code>:user-invalid</code> (solo tras interactuar: el que quieres para pintar errores). <code>novalidate</code> en el form desactiva la validación al enviar, para usar la tuya.</p>
     <div class="nota ojo"><b class="tit">pattern va anclado</b><code>pattern="[0-9]{5}"</code> equivale a <code>^(?:[0-9]{5})$</code> y se evalúa con la bandera <code>v</code> de las expresiones regulares: «123456» no vale. No escribas tú ^ y $.</div>`},
 {t:"info", eti:"Con JavaScript", h:"La Constraint Validation API",
  c:`<div class="termbox">const clave = form.elements.clave, repite = form.elements.repite;

repite.addEventListener("input", () =&gt; {
  // mensaje propio: mientras no esté vacío, el campo es inválido
  repite.setCustomValidity(repite.value === clave.value ? "" : "Las contraseñas no coinciden");
});

form.addEventListener("submit", (e) =&gt; {
  if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); }
});

repite.validity        // { valueMissing, typeMismatch, patternMismatch, tooShort, tooLong,
                       //   rangeUnderflow, rangeOverflow, stepMismatch, badInput, customError, valid }
repite.validationMessage   // el texto que mostraría el navegador</div>
     <p><code>checkValidity()</code> devuelve true o false y lanza el evento <code>invalid</code>; <code>reportValidity()</code> además muestra los mensajes. <b>Error típico</b>: llamar a <code>setCustomValidity("…")</code> y no volver a llamarla con <code>""</code>: el campo queda inválido para siempre.</p>`},
 {t:"par", p:"Empareja cada propiedad de <code>validity</code> con su causa",
  pares:[["valueMissing","Campo required vacío"],["typeMismatch","Un email o URL con formato incorrecto"],["patternMismatch","No casa con pattern"],["tooShort","Menos caracteres que minlength"],["rangeOverflow","Número mayor que max"],["customError","Hay un mensaje de setCustomValidity"]],
  why:"Con estas propiedades escribes mensajes propios, en tu idioma y tono, sin reimplementar las reglas."},
 {t:"codigo", p:"Simula el atributo <code>pattern</code>: la primera línea es el patrón y cada línea siguiente un valor. Imprime <code>válido</code> o <code>inválido</code> para cada uno",
  lenguaje:"js",
  c:`<p>Recuerda que el navegador lo ancla: construye <code>new RegExp("^(?:" + patron + ")$", "v")</code>.</p>`,
  plantilla:"const [patron, ...valores] = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l !== \"\");\n// comprueba cada valor como lo haría pattern\n",
  pruebas:[
   {entrada:"[0-9]{5}\n28013\n280130\n2801a\n", salida:"válido\ninválido\ninválido"},
   {entrada:"[a-z0-9_]+\nana_92\nAna\n", salida:"válido\ninválido"},
   {entrada:"es|pt\nes\nesp\npt\n", salida:"válido\ninválido\nválido", oculta:true}],
  pista:"const re = new RegExp(\"^(?:\" + patron + \")$\", \"v\"); y luego re.test(valor).",
  solucion:"const [patron, ...valores] = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l !== \"\");\nconst re = new RegExp(\"^(?:\" + patron + \")$\", \"v\");\nfor (const v of valores) console.log(re.test(v) ? \"válido\" : \"inválido\");",
  why:"El último caso muestra por qué va entre <code>(?:…)</code>: sin el grupo, <code>^es|pt$</code> aceptaría «esp». Un campo vacío no se comprueba contra pattern: para eso está required."},
 {t:"opcion", p:"Pintas en rojo los campos con <code>input:invalid</code> y el formulario aparece lleno de errores antes de escribir nada. ¿Qué cambias?",
  ops:["Quitar required","Usar :user-invalid, que solo se activa tras interactuar con el campo","Añadir novalidate","Validarlo todo con JavaScript"],
  ok:1, why:"<code>:invalid</code> refleja el estado desde el principio (un required vacío ya es inválido). <code>:user-invalid</code>, disponible en todos los navegadores actuales, espera a que la persona toque el campo o intente enviar."},
 {t:"vf", p:"Tras <code>campo.setCustomValidity(\"Ya existe\")</code>, el campo vuelve a ser válido en cuanto el usuario escribe otra cosa.",
  ok:false, why:"El error personalizado se queda hasta que llamas a <code>setCustomValidity(\"\")</code>. Por eso se recalcula en cada evento input."},
 {t:"hueco", p:"Completa la validación manual antes de enviar",
  tpl:'form.addEventListener("submit", (e) => {\n  if (!form.___()) {\n    e.preventDefault();\n    form.___();\n  }\n});',
  banco:["checkValidity","reportValidity","validate","isValid","submit","setCustomValidity"], sol:["checkValidity","reportValidity"],
  why:"checkValidity comprueba en silencio; reportValidity comprueba y muestra el mensaje en el primer campo inválido."},
 {t:"escribe", p:"¿Qué atributo del <code>&lt;form&gt;</code> desactiva la validación nativa al enviar?",
  sol:["novalidate"],
  pista:"no + validate.",
  why:"Se usa cuando pintas tú los errores; las restricciones siguen disponibles vía <code>validity</code> y <code>checkValidity()</code>. Para un solo botón existe <code>formnovalidate</code> (por ejemplo, «Guardar borrador»)."}
]},

/* =============== U4 L4 =============== */
{
id:"ht4n3",
titulo:"Enviar datos: método, codificación y botones",
claves:["GET pone los datos en la URL (búsquedas); POST en el cuerpo (cambios, datos sensibles)","Para subir ficheros hace falta enctype=\"multipart/form-data\"","disabled no se envía, readonly sí; formaction y formmethod cambian el destino por botón"],
pasos:[
 {t:"info", eti:"Qué viaja y cómo", h:"GET, POST y enctype",
  c:`<div class="dg"><div class="dg-tit">el mismo formulario con dos métodos</div>
       <div class="dg-cols">
         <div class="dg-col"><div class="dg-col-tit">method="get"</div><div class="dg-pila">
           <div class="dg-caja doble">GET /buscar?q=mesa+roble&amp;orden=precio<small>los datos van en la URL</small></div>
           <div class="dg-caja ok doble">Se puede compartir, guardar y repetir<small>búsquedas y filtros</small></div>
           <div class="dg-caja aviso doble">Nunca datos sensibles<small>quedan en historial y logs</small></div></div></div>
         <div class="dg-col"><div class="dg-col-tit">method="post"</div><div class="dg-pila">
           <div class="dg-caja doble">POST /registro<small>los datos van en el cuerpo</small></div>
           <div class="dg-caja ok doble">Crear, modificar, iniciar sesión<small>acciones con efecto</small></div>
           <div class="dg-caja base doble">Recargar pregunta si reenviar<small>usa redirección tras POST</small></div></div></div>
       </div></div>
     <div class="dg dg-tabla-caja" style="margin-top:12px"><div class="dg-tit">enctype</div><table class="dg-tabla"><tbody>
     <tr><td>application/x-www-form-urlencoded</td><td>Por defecto: <code>nombre=Ana+Ruiz&amp;edad=30</code> (espacios como +, resto con %XX).</td></tr>
     <tr><td>multipart/form-data</td><td>Obligatorio con <code>input type="file"</code>: cada campo en su parte.</td></tr>
     <tr><td>text/plain</td><td>Solo para depurar.</td></tr></tbody></table></div>`},
 {t:"info", eti:"Detalles que muerden", h:"Qué se envía y qué no",
  c:`<ul><li>Solo se envían los controles con <b>name</b>, no <b>disabled</b>, y los checkbox/radio <b>marcados</b> (un checkbox sin marcar no manda nada; marcado sin value manda <code>on</code>).</li>
     <li><code>readonly</code> se ve, no se edita y <b>sí</b> se envía; <code>disabled</code> no se envía ni recibe foco.</li>
     <li>Pulsar Intro en un campo de texto envía el formulario (envío implícito) con el primer botón submit.</li>
     <li>Un botón puede cambiar el destino: <code>&lt;button formaction="/borrador" formnovalidate&gt;Guardar borrador&lt;/button&gt;</code>. También <code>formmethod</code>, <code>formenctype</code> y <code>formtarget</code>. Su propio <code>name</code>/<code>value</code> viaja solo si es el que se pulsó.</li>
     <li>Desde JavaScript: <code>new FormData(form)</code> recoge exactamente lo mismo que enviaría el formulario, y <code>fetch("/api", {method: "POST", body: formData})</code> lo manda como multipart.</li></ul>`},
 {t:"codigo", p:"Codifica un formulario como <code>application/x-www-form-urlencoded</code>: cada línea es <code>nombre=valor</code>; imprime el cuerpo que enviaría el navegador",
  lenguaje:"js",
  c:`<p>Usa <code>URLSearchParams</code>, que aplica la misma codificación que el formulario: los espacios se convierten en <code>+</code> y los caracteres especiales en <code>%XX</code>. Separa solo por el primer <code>=</code>.</p>`,
  plantilla:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l !== \"\");\nconst params = new URLSearchParams();\n// añade cada par y muestra el resultado\n",
  pruebas:[
   {entrada:"nombre=Ana Ruiz\nedad=30\n", salida:"nombre=Ana+Ruiz&edad=30"},
   {entrada:"q=mesa & silla\norden=precio\n", salida:"q=mesa+%26+silla&orden=precio"},
   {entrada:"formula=a=b+c\nciudad=Cádiz\n", salida:"formula=a%3Db%2Bc&ciudad=C%C3%A1diz", oculta:true}],
  pista:"const i = l.indexOf(\"=\"); params.append(l.slice(0, i), l.slice(i + 1)); y al final console.log(params.toString()).",
  solucion:"const lineas = require(\"node:fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(l => l !== \"\");\nconst params = new URLSearchParams();\nfor (const l of lineas) {\n  const i = l.indexOf(\"=\");\n  params.append(l.slice(0, i), l.slice(i + 1));\n}\nconsole.log(params.toString());",
  why:"Por eso un <code>&amp;</code> o un <code>=</code> dentro de un valor no rompe nada: se codifican. Y la «á» viaja como sus dos bytes UTF-8: <code>%C3%A1</code>."},
 {t:"opcion", p:"Un formulario con <code>&lt;input type=\"file\"&gt;</code> llega al servidor con el nombre del fichero pero sin su contenido. ¿Qué falta?",
  ops:["method=\"get\"","enctype=\"multipart/form-data\" (y method=\"post\")","accept=\"*/*\"","El atributo multiple"],
  ok:1, why:"Con la codificación por defecto solo se puede enviar texto, así que el navegador manda el nombre. multipart envía el binario en su propia parte."},
 {t:"par", p:"Empareja cada situación con lo que llega al servidor",
  pares:[["Campo con disabled","No se envía y no recibe foco"],["Campo con readonly","Se envía su valor"],["Checkbox sin marcar","No se envía nada"],["Checkbox marcado sin value","Se envía on"],["Campo sin name","Se ignora: no tiene clave con la que viajar"]],
  why:"Si necesitas saber que un checkbox está desmarcado, el servidor debe tratar la ausencia como «no», o añadir un hidden con el mismo name antes del checkbox."},
 {t:"opcion", p:"¿Qué método usas en el formulario de búsqueda de una tienda?",
  ops:["POST, para que no se vea","GET: la búsqueda no cambia nada y así la URL se puede compartir y guardar","PUT","DELETE"],
  ok:1, why:"Un formulario HTML solo admite <code>get</code>, <code>post</code> y <code>dialog</code>. GET para leer (idempotente), POST para acciones con efecto. PUT o DELETE se envían con fetch."},
 {t:"hueco", p:"Completa el botón que guarda un borrador en otra URL sin validar",
  tpl:'<button ___="/borrador" ___>Guardar borrador</button>',
  banco:["formaction","formnovalidate","action","novalidate","formmethod","href"], sol:["formaction","formnovalidate"],
  why:"Los atributos form* del botón mandan sobre los del form solo cuando se pulsa ese botón."},
 {t:"vf", p:"Si pulsas Intro en un campo de texto de un formulario con botón de envío, se envía el formulario.",
  ok:true, why:"Es el envío implícito. Por eso no hace falta capturar la tecla Intro con JavaScript, y por eso un botón «Cancelar» colocado antes del de enviar debe ser type=\"button\"."}
]},

/* =============== U4 L5 =============== */
{
id:"ht4n4",
titulo:"Errores y ayudas accesibles",
claves:["Cada error: texto visible junto al campo, asociado con aria-describedby y marcado con aria-invalid","Al enviar con errores, resumen al principio y foco en él o en el primer campo","Instrucciones antes del campo, nunca solo el color ni solo el placeholder"],
pasos:[
 {t:"info", eti:"Patrón", h:"Un campo con ayuda y error",
  c:`<div class="termbox">&lt;label for="dni"&gt;DNI&lt;/label&gt;
&lt;p id="dni-ayuda"&gt;8 números y una letra, sin guion.&lt;/p&gt;
&lt;input id="dni" name="dni" autocomplete="off" required
       aria-describedby="dni-ayuda dni-error" aria-invalid="true"&gt;
&lt;p id="dni-error" class="error"&gt;El DNI debe tener 8 números y una letra. Ejemplo: 12345678Z&lt;/p&gt;</div>
     <ul><li><code>aria-describedby</code> hace que el lector lea la ayuda y el error al llegar al campo, después de su nombre.</li>
     <li><code>aria-invalid="true"</code> anuncia «no válido». Solo tras validar, no desde el principio.</li>
     <li>El mensaje dice <b>qué pasa y cómo arreglarlo</b> (WCAG 3.3.1 y 3.3.3), no «Error en el campo».</li>
     <li>El error lleva texto e icono, no solo borde rojo (WCAG 1.4.1).</li></ul>`},
 {t:"info", eti:"Al enviar", h:"Resumen de errores y foco",
  c:`<div class="termbox">&lt;div id="resumen" role="alert" tabindex="-1"&gt;
  &lt;h2&gt;Hay 2 errores en el formulario&lt;/h2&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href="#dni"&gt;El DNI debe tener 8 números y una letra&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#email"&gt;Falta el email&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/div&gt;</div>
     <p>En formularios largos, un resumen con enlaces a cada campo (el patrón de GOV.UK) y el foco movido al resumen. En cortos, basta con enfocar el primer campo erróneo. Además, WCAG 2.2 añadió <b>3.3.7 Entrada redundante</b> (no pidas dos veces un dato que ya diste en el mismo proceso) y <b>3.3.8 Autenticación accesible</b> (no obligues a memorizar o transcribir: deja pegar la contraseña y usar gestores).</p>`},
 {t:"hueco", p:"Completa el campo con su mensaje de error asociado",
  tpl:'<input id="cp" name="cp" ___="true" ___="cp-error">\n<p id="cp-error">El código postal tiene 5 números.</p>',
  banco:["aria-invalid","aria-describedby","aria-label","aria-error","aria-hidden","title"], sol:["aria-invalid","aria-describedby"],
  why:"aria-describedby admite varios id separados por espacios: ayuda y error. aria-errormessage existe, pero su soporte en lectores es irregular; describedby funciona en todos."},
 {t:"opcion", p:"¿Cuál es el mejor mensaje de error para un campo de fecha?",
  ops:["Error","Campo inválido","La fecha no es válida. Escríbela como día/mes/año, por ejemplo 23/09/2026","Solo un borde rojo en el campo"],
  ok:2, why:"Dice qué falla y cómo arreglarlo, con un ejemplo. Nunca culpes a la persona ni uses jerga («formato ISO requerido»)."},
 {t:"orden", p:"Ordena lo que ocurre al enviar un formulario largo con errores",
  items:["Se valida en el cliente (o responde el servidor)","Se marca cada campo con aria-invalid y su mensaje visible","Se muestra el resumen de errores con enlaces a cada campo","Se mueve el foco al resumen para que se anuncie","La persona sigue un enlace, corrige y reenvía"],
  why:"Sin mover el foco, quien usa lector de pantalla pulsa «Enviar» y no percibe que nada ha pasado."},
 {t:"vf", p:"Bloquear el pegado en el campo «Repite tu contraseña» mejora la seguridad y la accesibilidad.",
  ok:false, why:"Impide usar gestores de contraseñas y obliga a transcribir, lo que va contra WCAG 2.2 (3.3.8). Y no aporta seguridad."},
 {t:"par", p:"Empareja cada problema con el criterio WCAG que incumple",
  pares:[["El error solo se ve como borde rojo","1.4.1 Uso del color"],["Faltan etiquetas e instrucciones","3.3.2 Etiquetas o instrucciones"],["El mensaje no dice cómo corregirlo","3.3.3 Sugerencias ante errores"],["Pide otra vez la dirección ya dada","3.3.7 Entrada redundante"],["No deja pegar la contraseña","3.3.8 Autenticación accesible"]],
  why:"No hace falta memorizar los números, pero sí saber que existen: aparecen en auditorías y en contratos públicos."},
 {t:"escribe", p:"¿Qué atributo ARIA con qué valor marcas en un campo que no ha pasado la validación?",
  sol:["aria-invalid=\"true\"","aria-invalid=true","aria-invalid='true'"],
  pista:"aria + «inválido».",
  why:"Y se quita (o se pone a false) cuando se corrige. Puedes estilarlo en CSS con <code>[aria-invalid=\"true\"]</code>."}
]}

]});
