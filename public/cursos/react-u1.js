window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Qué es React",
resumen: "Interfaces con componentes, JSX, crear un proyecto con Vite y cómo React actualiza la pantalla",
nivel: "Fundamentos",
color: "#61dafb",
lecciones: [

{
id:"re1l1",
titulo:"Interfaces con componentes",
claves:["React es una librería para construir interfaces a partir de componentes","Describes cómo debe verse la interfaz según los datos; React actualiza el DOM","Un componente es una función que devuelve lo que se ve"],
pasos:[
 {t:"info", eti:"Empezamos", h:"¿Qué problema resuelve React?",
  c:`<p>Con JavaScript puro, cada vez que cambian los datos tienes que buscar los elementos del DOM y modificarlos a mano: fácil equivocarse y olvidar actualizar algo.</p>
     <p><b>React</b> cambia el enfoque: tú describes <b>cómo debe verse la interfaz para unos datos concretos</b>, y cuando los datos cambian, React calcula qué ha cambiado y actualiza solo eso en el DOM. A esto se le llama programación <b>declarativa</b>.</p>
     <div class="diag">datos (estado)  --&gt;  componentes (funciones)  --&gt;  interfaz
cambian los datos --&gt; React vuelve a llamar a los componentes --&gt; aplica solo las diferencias</div>`},
 {t:"info", eti:"Piezas", h:"Componentes",
  c:`<p>Una interfaz se divide en <b>componentes</b> reutilizables: <code>Cabecera</code>, <code>ListaTareas</code>, <code>Tarea</code>, <code>Boton</code>... Cada uno es una <b>función</b> que devuelve lo que se debe mostrar:</p>
     <div class="termbox">function Saludo() {
  return &lt;h1&gt;Hola, Catappa&lt;/h1&gt;;
}

function App() {
  return (
    &lt;main&gt;
      &lt;Saludo /&gt;
      &lt;Saludo /&gt;
    &lt;/main&gt;
  );
}</div>
     <p>Los nombres de componentes empiezan por <b>mayúscula</b>; las etiquetas en minúscula son HTML normal.</p>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["React","Librería para construir interfaces con componentes"],["Componente","Función que devuelve la interfaz de una parte de la pantalla"],["Declarativo","Describes el resultado y React se ocupa de los cambios"],["Estado","Datos que, al cambiar, actualizan la interfaz"]],
  why:"React es una librería de interfaz; enrutado o peticiones se añaden con otras librerías o con un framework como Next.js."},
 {t:"opcion", p:"¿Por qué <code>&lt;tarjeta /&gt;</code> no muestra tu componente <code>tarjeta</code>?",
  ops:["Falta importarlo","Los componentes deben empezar por mayúscula: en minúscula React lo trata como una etiqueta HTML","Falta un return","No se puede reutilizar"],
  ok:1, why:"Llámalo Tarjeta y úsalo como &lt;Tarjeta /&gt;."},
 {t:"vf", p:"Con React sueles modificar el DOM directamente con querySelector para reflejar cada cambio.",
  ok:false, why:"Cambias el estado y React actualiza el DOM. Tocar el DOM a mano es la excepción (con refs)."}
]},

{
id:"re1l2",
titulo:"JSX",
claves:["JSX mezcla marcado parecido a HTML con JavaScript","Expresiones entre llaves: {nombre}, {precio * 2}","className en vez de class, atributos en camelCase y un único elemento raíz (o fragmento)"],
pasos:[
 {t:"info", eti:"Marcado en JavaScript", h:"Qué es JSX",
  c:`<div class="termbox">function Producto() {
  const nombre = "Teclado";
  const precio = 89.9;
  const agotado = false;
  return (
    &lt;article className="producto"&gt;
      &lt;h2&gt;{nombre}&lt;/h2&gt;
      &lt;p&gt;{precio.toFixed(2)} €&lt;/p&gt;
      &lt;button disabled={agotado} onClick={() =&gt; alert("Añadido")}&gt;
        Añadir
      &lt;/button&gt;
    &lt;/article&gt;
  );
}</div>
     <p>JSX no es HTML: se compila a llamadas de JavaScript. Diferencias importantes: <code>className</code> en vez de <code>class</code>, <code>htmlFor</code> en vez de <code>for</code>, eventos en camelCase (<code>onClick</code>), etiquetas siempre cerradas (<code>&lt;img /&gt;</code>) y estilos como objeto: <code>style={{ color: "red" }}</code>.</p>`},
 {t:"par", p:"Empareja el HTML con su equivalente en JSX",
  pares:[["class=\"caja\"","className=\"caja\""],["for=\"email\"","htmlFor=\"email\""],["onclick=\"...\"","onClick={funcion}"],["<br>","<br />"],["style=\"color: red\"","style={{ color: \"red\" }}"]],
  why:"Las llaves dobles de style son: unas para la expresión y otras para el objeto."},
 {t:"info", eti:"Un solo padre", h:"Fragmentos",
  c:`<div class="termbox">return (
  &lt;&gt;
    &lt;h1&gt;Título&lt;/h1&gt;
    &lt;p&gt;Texto&lt;/p&gt;
  &lt;/&gt;
);</div>
     <p>Un componente devuelve un único elemento. Si no quieres un <code>div</code> extra, usa un <b>fragmento</b> <code>&lt;&gt;...&lt;/&gt;</code>.</p>`},
 {t:"opcion", p:"¿Qué muestra <code>&lt;p&gt;{2 + 3}&lt;/p&gt;</code>?",
  ops:["{2 + 3}","5","2 + 3","Error"],
  ok:1, why:"Las llaves evalúan cualquier expresión de JavaScript."},
 {t:"vf", p:"En JSX puedes escribir un <code>if</code> directamente dentro de las llaves.",
  ok:false, why:"Solo expresiones: usa el ternario (cond ? a : b), && o calcula antes del return."}
]},

{
id:"re1l3",
titulo:"Crear un proyecto",
claves:["npm create vite@latest crea un proyecto React con Vite","main.jsx monta la app con createRoot en el elemento #root","npm run dev para desarrollar, npm run build para producción"],
pasos:[
 {t:"info", eti:"Arrancar", h:"Vite",
  c:`<div class="termbox">npm create vite@latest tareas-web -- --template react-ts
cd tareas-web
npm install
npm run dev          # http://localhost:5173 con recarga instantanea</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">tareas-web/</div><table class="dg-tabla"><tbody><tr><td>index.html</td><td>&amp;lt;div id="root"&amp;gt;&amp;lt;/div&amp;gt;</td></tr><tr><td>src/main.tsx</td><td>monta la aplicacion</td></tr><tr><td>src/App.tsx</td><td>componente principal</td></tr><tr><td>package.json</td><td>vite.config.ts</td></tr></tbody></table></div>
     <div class="termbox">// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  &lt;StrictMode&gt;&lt;App /&gt;&lt;/StrictMode&gt;
);</div>`},
 {t:"term", p:"Crea un proyecto React con TypeScript llamado <code>tareas-web</code> usando Vite",
  prompt:"pablo@portatil:~$", sol:["npm create vite@latest tareas-web -- --template react-ts","npm create vite tareas-web -- --template react-ts","npm create vite@latest tareas-web --template react-ts"],
  pista:"npm create vite@latest, el nombre, -- y --template react-ts.",
  salida:`Scaffolding project in /home/pablo/tareas-web...
Done. Now run:
  cd tareas-web
  npm install
  npm run dev`, why:"Vite es hoy la forma estándar de empezar un proyecto React sin framework (Create React App está abandonado)."},
 {t:"par", p:"Empareja cada comando o fichero con su función",
  pares:[["npm run dev","Servidor de desarrollo con recarga instantánea"],["npm run build","Genera la versión optimizada en dist/"],["index.html","Página con el div donde se monta React"],["main.tsx","Arranca React con createRoot"],["StrictMode","Activa comprobaciones extra en desarrollo"]],
  why:"En desarrollo, StrictMode ejecuta algunos componentes y efectos dos veces a propósito para detectar errores."},
 {t:"vf", p:"La carpeta <code>dist/</code> que genera <code>npm run build</code> son ficheros estáticos que se pueden servir con Nginx.",
  ok:true, why:"Una SPA de React es HTML, JS y CSS estáticos: se sirve con Nginx, una CDN o un bucket."}
]},

{
id:"re1l4",
titulo:"Pensar en React",
claves:["Divide la interfaz en una jerarquía de componentes con una responsabilidad cada uno","Construye primero una versión estática con props","Identifica el estado mínimo y colócalo en el ancestro común más cercano"],
pasos:[
 {t:"info", eti:"Método", h:"De un diseño a componentes",
  c:`<div class="diag">PaginaTareas
 |- Cabecera
 |- BarraBusqueda          (texto de busqueda, "solo pendientes")
 '- ListaTareas
     |- GrupoFecha          ("Hoy", "Mañana")
     '- FilaTarea           (casilla, titulo, boton borrar)</div>
     <ol><li>Dibuja cajas sobre el diseño: cada caja con una sola responsabilidad es un componente.</li>
     <li>Haz una <b>versión estática</b> que recibe datos por props, sin estado.</li>
     <li>Busca el <b>estado mínimo</b>: lo que cambia con el tiempo y no se puede calcular. Aquí: la lista de tareas, el texto de búsqueda y el filtro.</li>
     <li>Colócalo en el <b>ancestro común</b> de quien lo usa: PaginaTareas.</li>
     <li>Añade el flujo inverso: los hijos avisan con funciones pasadas por props.</li></ol>`},
 {t:"orden", p:"Ordena los pasos del método «Pensar en React»",
  items:["Dividir la interfaz en una jerarquía de componentes","Construir una versión estática con props","Encontrar el estado mínimo","Decidir dónde vive cada estado","Añadir el flujo de datos inverso con callbacks"],
  why:"Es el método de la documentación oficial de React y funciona para cualquier pantalla."},
 {t:"par", p:"Empareja cada dato de la pantalla de tareas con cómo se obtiene",
  pares:[["La lista de tareas","Estado (o datos del servidor)"],["El texto del buscador","Estado"],["Las tareas filtradas visibles","Se calcula: lista + texto + filtro"],["El número de pendientes","Se calcula a partir de la lista"],["El título de la página","Constante o prop"]],
  why:"Todo lo que se puede calcular, se calcula: menos estado, menos errores."}
]}

]});
