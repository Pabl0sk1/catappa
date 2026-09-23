window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Qué es React",
resumen: "Interfaces con componentes, JSX y lo que hay debajo, crear un proyecto con Vite y el método para pasar de un diseño a componentes",
nivel: "Fundamentos",
color: "#61dafb",
lecciones: [

/* =============== U1 L1 =============== */
{
id:"re1l1",
titulo:"Interfaces con componentes",
claves:["React es una librería para construir interfaces a partir de componentes","Describes cómo debe verse la interfaz según los datos; React actualiza el DOM","Un componente es una función que devuelve lo que se ve, y su nombre empieza por mayúscula"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué problema resuelve React?",
  c:`<p>Con JavaScript puro, cada vez que cambian los datos tienes que buscar los elementos del DOM y modificarlos a mano: añadir una fila, cambiar un contador, ocultar un aviso. En una pantalla con veinte cosas que dependen unas de otras es muy fácil olvidar actualizar alguna.</p>
     <p><b>React</b> cambia el enfoque: tú describes <b>cómo debe verse la interfaz para unos datos concretos</b>, y cuando los datos cambian, React vuelve a pedir esa descripción, calcula qué ha cambiado y actualiza solo eso en el DOM. A esto se le llama programación <b>declarativa</b>: dices el «qué», no el «cómo».</p>
     <div class="dg"><div class="dg-tit">la idea de react</div>
       <div class="dg-flujo"><div class="dg-caja">datos<small>props y estado</small></div><div class="dg-caja acento">componentes<small>funciones</small></div><div class="dg-caja ok">interfaz</div></div>
       <div class="dg-flujo" style="margin-top:12px"><div class="dg-caja">cambian los datos</div><div class="dg-caja acento">React vuelve a llamar a los componentes</div><div class="dg-caja ok">aplica solo las diferencias</div></div>
     </div>
     <p>Fórmula que resume React: <b>UI = f(estado)</b>. La interfaz es el resultado de una función aplicada a los datos.</p>`},
 {t:"info", eti:"Piezas", h:"Componentes",
  c:`<p>Una interfaz se divide en <b>componentes</b> reutilizables: <code>Cabecera</code>, <code>ListaTareas</code>, <code>Tarea</code>, <code>Boton</code>... Cada uno es una <b>función</b> que devuelve lo que se debe mostrar:</p>
     <div class="termbox">function Saludo() {
  return &lt;h1&gt;Hola, Catappa&lt;/h1&gt;;
}

export default function App() {
  return (
    &lt;main&gt;
      &lt;Saludo /&gt;
      &lt;Saludo /&gt;
    &lt;/main&gt;
  );
}</div>
     <ul><li>Los nombres de componentes empiezan por <b>mayúscula</b>; las etiquetas en minúscula son HTML normal.</li>
     <li>Se declaran en el nivel superior del módulo, <b>nunca dentro de otro componente</b> (verás por qué en la unidad de reconciliación).</li>
     <li>Cada componente suele vivir en su propio fichero y se exporta/importa como cualquier módulo de JavaScript.</li></ul>
     <div class="nota"><b class="tit">Librería, no framework</b>React solo se ocupa de la interfaz. El enrutado, la carga de datos o el renderizado en servidor los añaden otras librerías (React Router, TanStack Query) o un framework construido sobre React (Next.js, React Router en modo framework).</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["React","Librería para construir interfaces con componentes"],["Componente","Función que devuelve la interfaz de una parte de la pantalla"],["Declarativo","Describes el resultado y React se ocupa de los cambios"],["Estado","Datos que, al cambiar, actualizan la interfaz"],["DOM","Árbol de nodos que el navegador pinta en pantalla"]],
  why:"React es una librería de interfaz; enrutado o peticiones se añaden con otras librerías o con un framework como Next.js."},
 {t:"opcion", p:"¿Por qué <code>&lt;tarjeta /&gt;</code> no muestra tu componente <code>tarjeta</code>?",
  ops:["Falta importarlo","Los componentes deben empezar por mayúscula: en minúscula React lo trata como una etiqueta HTML","Falta un return","No se puede reutilizar"],
  ok:1, why:"JSX decide por la inicial: minúscula es un elemento del DOM (&lt;div&gt;, &lt;tarjeta&gt;), mayúscula es una variable de tu código. Llámalo Tarjeta y úsalo como &lt;Tarjeta /&gt;."},
 {t:"vf", p:"Con React sueles modificar el DOM directamente con querySelector para reflejar cada cambio.",
  ok:false, why:"Cambias el estado y React actualiza el DOM. Tocar el DOM a mano es la excepción (con refs: foco, medir, integrar librerías externas)."},
 {t:"hueco", p:"Completa el componente para que se pueda importar desde otro fichero",
  tpl:"___ default function ___() {\n  return <h1>Hola</h1>;\n}",
  banco:["export","Saludo","saludo","import","return"], sol:["export","Saludo"],
  why:"export default permite importarlo con import Saludo from \"./Saludo\". El nombre en mayúscula es obligatorio para usarlo como &lt;Saludo /&gt;."},
 {t:"opcion", p:"¿Qué se renderiza?<br><code>function Hola() { return &lt;p&gt;Hola&lt;/p&gt;; }</code><br><code>function App() { return &lt;div&gt;&lt;Hola /&gt;&lt;Hola /&gt;&lt;Hola /&gt;&lt;/div&gt;; }</code>",
  ops:["Un solo párrafo «Hola»","Un div con tres párrafos «Hola»","Un error: no se puede usar un componente varias veces","Tres divs"],
  ok:1, why:"Cada &lt;Hola /&gt; es una instancia independiente: React llama a la función una vez por cada uso."},
 {t:"escribe", p:"¿Cómo se llama el estilo de programación en el que describes el resultado deseado y no los pasos para conseguirlo?",
  sol:["declarativo","declarativa","programación declarativa","programacion declarativa"],
  pista:"Lo contrario de imperativo.",
  why:"Con el DOM a mano programas de forma imperativa (busca, crea, cambia); con React, declarativa."}
]},

/* =============== U1 L2 =============== */
{
id:"re1l2",
titulo:"JSX y lo que hay debajo",
claves:["JSX mezcla marcado parecido a HTML con expresiones de JavaScript entre llaves","className, htmlFor, eventos en camelCase, etiquetas cerradas y un único elemento raíz (o fragmento)","JSX se compila a llamadas que crean objetos (elementos de React): null, true y false no pintan nada, pero 0 sí"],
pasos:[
 {t:"info", eti:"Marcado en JavaScript", h:"Qué es JSX",
  c:`<div class="termbox">function Producto() {
  const nombre = "Teclado";
  const precio = 89.9;
  const agotado = false;
  return (
    &lt;article className="producto"&gt;
      &lt;h2&gt;{nombre.toUpperCase()}&lt;/h2&gt;
      &lt;p&gt;{precio.toFixed(2)} €&lt;/p&gt;
      &lt;img src="/teclado.webp" alt="Teclado mecánico" /&gt;
      &lt;button disabled={agotado} onClick={() =&gt; alert("Añadido")}&gt;
        Añadir
      &lt;/button&gt;
    &lt;/article&gt;
  );
}</div>
     <p>JSX no es HTML: es sintaxis de JavaScript que se compila. Diferencias importantes:</p>
     <ul><li><code>className</code> en vez de <code>class</code> y <code>htmlFor</code> en vez de <code>for</code> (son palabras reservadas de JS).</li>
     <li>Atributos y eventos en camelCase: <code>onClick</code>, <code>tabIndex</code>, <code>strokeWidth</code>. Excepción: <code>aria-*</code> y <code>data-*</code> van con guiones.</li>
     <li>Todas las etiquetas se cierran: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>, <code>&lt;input /&gt;</code>.</li>
     <li><code>style</code> es un objeto con propiedades en camelCase: <code>style={{ backgroundColor: "red" }}</code>.</li>
     <li>Entre llaves va cualquier <b>expresión</b> (algo que da un valor), nunca una sentencia como <code>if</code> o <code>for</code>.</li></ul>`},
 {t:"par", p:"Empareja el HTML con su equivalente en JSX",
  pares:[["class=\"caja\"","className=\"caja\""],["for=\"email\"","htmlFor=\"email\""],["onclick=\"...\"","onClick={funcion}"],["<br>","<br />"],["style=\"color: red\"","style={{ color: \"red\" }}"],["tabindex=\"0\"","tabIndex={0}"]],
  why:"Las llaves dobles de style son: unas para la expresión y otras para el objeto."},
 {t:"info", eti:"Por debajo", h:"JSX se convierte en objetos",
  c:`<p>El compilador (Babel, SWC o esbuild dentro de Vite) transforma cada etiqueta en una llamada a una función del runtime de JSX, que devuelve un <b>objeto plano</b> que describe lo que hay que pintar: un <b>elemento de React</b>.</p>
     <div class="termbox">// lo que escribes
&lt;p className="aviso"&gt;Tienes {n} tareas&lt;/p&gt;

// lo que genera el compilador (runtime automático)
import { jsx as _jsx } from "react/jsx-runtime";
_jsx("p", { className: "aviso", children: ["Tienes ", n, " tareas"] });

// lo que devuelve: un objeto, no un nodo del DOM
{ type: "p", props: { className: "aviso", children: ["Tienes ", 3, " tareas"] }, key: null }</div>
     <p>Por eso un componente puede devolver elementos, guardarlos en variables o pasarlos como props: son valores normales. Y por eso se exige un único elemento raíz: una función solo puede devolver un valor. Para no añadir un <code>div</code> extra se usa un <b>fragmento</b>: <code>&lt;&gt;...&lt;/&gt;</code> (o <code>&lt;Fragment key={...}&gt;</code> si necesita key).</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">qué pinta cada valor entre llaves</div><table class="dg-tabla"><thead><tr><th>Valor</th><th>Resultado</th></tr></thead><tbody>
       <tr><td>"texto", 42</td><td>se pinta como texto</td></tr>
       <tr><td>0, NaN</td><td>se pintan (¡ojo con <code>{lista.length &amp;&amp; ...}</code>!)</td></tr>
       <tr><td>null, undefined, true, false</td><td>no pintan nada</td></tr>
       <tr><td>array</td><td>pinta cada elemento (con key)</td></tr>
       <tr><td>objeto plano</td><td>error: «Objects are not valid as a React child»</td></tr>
     </tbody></table></div>`},
 {t:"opcion", p:"¿Qué se renderiza con <code>&lt;p&gt;{2 + 3}&lt;/p&gt;</code>?",
  ops:["{2 + 3}","5","2 + 3","Un error"],
  ok:1, why:"Las llaves evalúan cualquier expresión de JavaScript y pintan el resultado."},
 {t:"opcion", p:"¿Qué se renderiza con <code>&lt;p&gt;{false}{null}{0}{\"hola\"}&lt;/p&gt;</code>?",
  ops:["falsenull0 hola","0hola","hola","Un error"],
  ok:1, why:"false y null no pintan nada; 0 es un número y sí se pinta. Es el origen del famoso 0 suelto en pantalla."},
 {t:"opcion", p:"Tienes <code>const usuario = { nombre: \"Ana\" }</code> y escribes <code>&lt;p&gt;{usuario}&lt;/p&gt;</code>. ¿Qué pasa?",
  ops:["Se pinta [object Object]","Error: los objetos no son hijos válidos; hay que pintar usuario.nombre","Se pinta Ana","No se pinta nada"],
  ok:1, why:"React no sabe cómo pintar un objeto plano. Pinta sus campos: {usuario.nombre}."},
 {t:"vf", p:"En JSX puedes escribir un <code>if</code> directamente dentro de las llaves.",
  ok:false, why:"Solo expresiones: usa el ternario (cond ? a : b), &amp;&amp; o calcula el valor en una variable antes del return."},
 {t:"codigo", p:"JSX produce objetos. Escribe <code>html(nodo)</code> que convierta un árbol de elementos (en JSON por stdin) en HTML, con las reglas de React",
  lenguaje:"js",
  c:`<p>Un nodo puede ser: texto o número (se pinta tal cual), <code>null</code>, <code>true</code> o <code>false</code> (no pintan nada), un array (se pinta cada elemento) o un elemento <code>{type, props}</code>. En un elemento, <code>props.children</code> es su contenido y el resto de props son atributos (<code>className</code> se escribe <code>class</code>). Formato: <code>&lt;p class="x"&gt;hijos&lt;/p&gt;</code>.</p>`,
  plantilla:"const raiz = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\nfunction html(n) {\n  // tu código\n  return \"\";\n}\nconsole.log(html(raiz));\n",
  pruebas:[{entrada:'{"type":"p","props":{"children":["Tienes ",3," tareas"]}}', salida:"<p>Tienes 3 tareas</p>"},{entrada:'{"type":"div","props":{"className":"caja","children":[false,{"type":"b","props":{"children":0}},null]}}', salida:"<div class=\"caja\"><b>0</b></div>"},{entrada:'{"type":"ul","props":{"children":[{"type":"li","props":{"children":"uno"}},true,{"type":"li","props":{"id":"x","children":["dos",null]}}]}}', salida:"<ul><li>uno</li><li id=\"x\">dos</li></ul>", oculta:true}],
  pista:"Primero los casos simples: null, undefined o booleano devuelven \"\"; texto o número, String(n); array, n.map(html).join(\"\"). Para un elemento, separa children del resto con const { children, ...resto } = n.props.",
  solucion:"const raiz = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\nfunction html(n) {\n  if (n === null || n === undefined || typeof n === \"boolean\") return \"\";\n  if (typeof n === \"string\" || typeof n === \"number\") return String(n);\n  if (Array.isArray(n)) return n.map(html).join(\"\");\n  const { children, ...resto } = n.props || {};\n  const attrs = Object.entries(resto).map(([k, v]) => \" \" + (k === \"className\" ? \"class\" : k) + \"=\\\"\" + v + \"\\\"\").join(\"\");\n  return \"<\" + n.type + attrs + \">\" + html(children) + \"</\" + n.type + \">\";\n}\nconsole.log(html(raiz));\n",
  why:"Es, en miniatura, lo que hace renderToString de react-dom/server: recorrer el árbol de elementos. Fíjate en que el 0 sí se pinta y el false no."}
]},

/* =============== U1 L3 =============== */
{
id:"re1l3",
titulo:"Crear un proyecto",
claves:["npm create vite@latest crea un proyecto React con Vite (Create React App está abandonado)","main.tsx monta la app con createRoot en el elemento #root dentro de StrictMode","npm run dev para desarrollar, npm run build genera dist/ y npm run preview lo sirve para probarlo"],
pasos:[
 {t:"info", eti:"Arrancar", h:"Vite",
  c:`<div class="termbox">npm create vite@latest tareas-web -- --template react-ts
cd tareas-web
npm install
npm run dev          # http://localhost:5173 con recarga instantánea (HMR)</div>
     <div class="dg dg-arbol"><div class="dg-tit">estructura generada</div><div class="rama" style="--n:0"><span class="nom carpeta">tareas-web/</span></div><div class="rama" style="--n:1"><span class="nom">index.html</span><span class="coment">contiene &lt;div id="root"&gt;&lt;/div&gt; y carga src/main.tsx</span></div><div class="rama" style="--n:1"><span class="nom">package.json</span><span class="coment">scripts dev, build, preview, lint</span></div><div class="rama" style="--n:1"><span class="nom">vite.config.ts</span><span class="coment">plugin @vitejs/plugin-react</span></div><div class="rama" style="--n:1"><span class="nom carpeta">public/</span><span class="coment">ficheros que se copian tal cual (favicon)</span></div><div class="rama" style="--n:1"><span class="nom carpeta">src/</span></div><div class="rama" style="--n:2"><span class="nom">main.tsx</span><span class="coment">monta la aplicación</span></div><div class="rama" style="--n:2"><span class="nom">App.tsx</span><span class="coment">componente principal</span></div></div>
     <div class="termbox">// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  &lt;StrictMode&gt;
    &lt;App /&gt;
  &lt;/StrictMode&gt;
);</div>`},
 {t:"info", eti:"Por qué así", h:"Vite, StrictMode y alternativas",
  c:`<ul><li><b>Vite</b> sirve los módulos ES directamente en desarrollo (arranque casi instantáneo) y en producción empaqueta con Rollup/Rolldown. Es hoy la forma estándar de crear una SPA con React.</li>
     <li><b>Create React App</b> quedó oficialmente deprecado en 2025: no lo uses en proyectos nuevos.</li>
     <li>Si necesitas renderizado en servidor, rutas por ficheros o Server Components, la documentación de React recomienda empezar con un <b>framework</b>: Next.js o React Router (modo framework).</li>
     <li><b>StrictMode</b> solo actúa en desarrollo: renderiza dos veces los componentes y monta, desmonta y vuelve a montar los efectos para destapar código impuro o efectos sin limpieza. En producción no hace nada.</li></ul>
     <div class="nota ojo"><b class="tit">Ver dos console.log es normal</b>Si en desarrollo ves cada log dos veces o una petición duplicada, es StrictMode. No lo quites: arregla lo que te está señalando.</div>`},
 {t:"term", p:"Crea un proyecto React con TypeScript llamado <code>tareas-web</code> usando Vite",
  prompt:"pablo@portatil:~$", sol:["npm create vite@latest tareas-web -- --template react-ts","npm create vite tareas-web -- --template react-ts","npm create vite@latest tareas-web --template react-ts","npm create vite@latest tareas-web -- -t react-ts"],
  pista:"npm create vite@latest, el nombre, -- y --template react-ts.",
  salida:`Scaffolding project in /home/pablo/tareas-web...
Done. Now run:
  cd tareas-web
  npm install
  npm run dev`, why:"El -- separa los argumentos de npm de los de create-vite. Con --template react usarías JavaScript en vez de TypeScript."},
 {t:"term", p:"Genera la versión de producción del proyecto",
  prompt:"pablo@portatil:~/tareas-web$", sol:["npm run build"],
  pista:"Es un script de package.json.",
  salida:`vite v7.1.3 building for production...
✓ 34 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-D8b4DHJx.css    1.39 kB │ gzip:  0.71 kB
dist/assets/index-C2lZ0V3a.js   195.12 kB │ gzip: 61.40 kB
✓ built in 812ms`, why:"Los nombres llevan un hash del contenido: se pueden cachear «para siempre» porque si cambia el código, cambia el nombre."},
 {t:"par", p:"Empareja cada comando o fichero con su función",
  pares:[["npm run dev","Servidor de desarrollo con recarga instantánea"],["npm run build","Genera la versión optimizada en dist/"],["npm run preview","Sirve dist/ en local para probar el build"],["index.html","Página con el div donde se monta React"],["main.tsx","Arranca React con createRoot"],["StrictMode","Activa comprobaciones extra en desarrollo"]],
  why:"Prueba siempre el build con preview antes de desplegar: hay errores que solo aparecen al empaquetar."},
 {t:"orden", p:"Ordena lo que ocurre al abrir la aplicación en el navegador",
  items:["El navegador descarga index.html","index.html carga el script de main.tsx (ya empaquetado)","createRoot toma el div #root","render monta el componente App","React crea los nodos del DOM y los inserta en #root"],
  why:"En una SPA el HTML inicial está vacío: todo lo que ves lo crea JavaScript. Por eso el SEO y la primera carga son peores que con renderizado en servidor."},
 {t:"vf", p:"La carpeta <code>dist/</code> que genera <code>npm run build</code> son ficheros estáticos que se pueden servir con Nginx.",
  ok:true, why:"Una SPA de React es HTML, JS y CSS estáticos: se sirve con Nginx, una CDN o un bucket."},
 {t:"opcion", p:"En desarrollo ves que tu componente escribe dos veces el mismo <code>console.log</code> en cada render. ¿Qué ocurre?",
  ops:["Hay un bucle infinito","StrictMode renderiza dos veces a propósito en desarrollo para detectar código impuro","Vite duplica los módulos","Tienes dos React instalados"],
  ok:1, why:"Si el resultado cambia entre las dos llamadas, tu componente tiene efectos secundarios durante el render. En producción solo se renderiza una vez."}
]},

/* =============== U1 L4 =============== */
{
id:"re1l4",
titulo:"Pensar en React",
claves:["Divide la interfaz en una jerarquía de componentes con una responsabilidad cada uno","Construye primero una versión estática con props y luego identifica el estado mínimo","Coloca cada estado en el ancestro común más cercano y haz que los hijos avisen con funciones"],
pasos:[
 {t:"info", eti:"Método", h:"De un diseño a componentes",
  c:`<div class="dg dg-arbol"><div class="dg-tit">árbol de componentes</div><div class="rama" style="--n:0"><span class="nom carpeta">PaginaTareas</span></div><div class="rama" style="--n:1"><span class="nom">Cabecera</span></div><div class="rama" style="--n:1"><span class="nom">BarraBusqueda</span><span class="coment">texto de búsqueda, "solo pendientes"</span></div><div class="rama" style="--n:1"><span class="nom carpeta">ListaTareas</span></div><div class="rama" style="--n:2"><span class="nom">GrupoFecha</span><span class="coment">"Hoy", "Mañana"</span></div><div class="rama" style="--n:2"><span class="nom">FilaTarea</span><span class="coment">casilla, título, botón borrar</span></div></div>
     <ol><li>Dibuja cajas sobre el diseño: cada caja con una sola responsabilidad es un componente.</li>
     <li>Haz una <b>versión estática</b> que recibe datos por props, sin estado.</li>
     <li>Busca el <b>estado mínimo</b>: lo que cambia con el tiempo y no se puede calcular. Aquí: la lista de tareas, el texto de búsqueda y el filtro.</li>
     <li>Colócalo en el <b>ancestro común</b> de quien lo usa: PaginaTareas.</li>
     <li>Añade el flujo inverso: los hijos avisan con funciones pasadas por props.</li></ol>`},
 {t:"info", eti:"El estado mínimo", h:"Tres preguntas para cada dato",
  c:`<div class="dg"><div class="dg-tit">¿es estado?</div>
       <div class="dg-vert">
         <div class="dg-caja">¿llega del padre por props?<small>sí: no es estado de este componente</small></div>
         <div class="dg-caja">¿se queda igual todo el tiempo?<small>sí: es una constante</small></div>
         <div class="dg-caja">¿se puede calcular a partir de otras props o estado?<small>sí: se calcula en el render</small></div>
         <div class="dg-caja acento">si las tres respuestas son «no»: es estado</div>
       </div></div>
     <p>Los datos fluyen <b>en un solo sentido</b>: de arriba abajo por props. Para que un hijo cambie algo del padre, el padre le pasa una función (<code>alCambiarFiltro</code>) y el hijo la llama. Este flujo unidireccional es lo que hace que una app de React sea fácil de seguir: si un dato está mal, sabes dónde vive.</p>`},
 {t:"orden", p:"Ordena los pasos del método «Pensar en React»",
  items:["Dividir la interfaz en una jerarquía de componentes","Construir una versión estática con props","Encontrar el estado mínimo","Decidir dónde vive cada estado","Añadir el flujo de datos inverso con callbacks"],
  why:"Es el método de la documentación oficial de React y funciona para cualquier pantalla."},
 {t:"par", p:"Empareja cada dato de la pantalla de tareas con cómo se obtiene",
  pares:[["La lista de tareas","Estado (o datos del servidor)"],["El texto del buscador","Estado"],["Las tareas filtradas visibles","Se calcula: lista + texto + filtro"],["El número de pendientes","Se calcula a partir de la lista"],["El título de la página","Constante o prop"]],
  why:"Todo lo que se puede calcular, se calcula: menos estado, menos errores."},
 {t:"opcion", p:"El buscador (<code>BarraBusqueda</code>) y la lista (<code>ListaTareas</code>) necesitan el texto de búsqueda. ¿Dónde debe vivir ese estado?",
  ops:["En BarraBusqueda, y la lista lo lee con querySelector","En PaginaTareas, su ancestro común, que lo pasa a los dos","Duplicado en los dos componentes","En una variable global"],
  ok:1, why:"El padre común guarda el texto, pasa el valor a los dos y una función alCambiar a la barra."},
 {t:"vf", p:"En React los datos pueden fluir de hijo a padre directamente modificando las props.",
  ok:false, why:"Flujo unidireccional: bajan por props y los hijos avisan llamando a funciones que el padre les pasa."},
 {t:"escribe", p:"¿Cómo se llama el problema de pasar una prop a través de varios niveles de componentes que no la usan, solo para que llegue abajo?",
  sol:["prop drilling","props drilling","drilling"],
  pista:"En inglés: «taladrar» con props.",
  why:"Se evita con composición (children) o, para datos realmente globales, con contexto."}
]}

]});
