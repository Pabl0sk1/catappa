window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Props, listas y condiciones",
resumen: "Pasar datos con props y children, mostrar contenido condicional, renderizar listas con key, componer componentes y mantenerlos puros",
nivel: "Fundamentos",
color: "#61dafb",
lecciones: [

/* =============== U2 L1 =============== */
{
id:"re2l1",
titulo:"Props",
claves:["Las props son los parámetros de un componente: un único objeto que se suele desestructurar","Fluyen de padre a hijo y son de solo lectura","children es el contenido entre las etiquetas; se pueden reenviar props con spread"],
pasos:[
 {t:"info", eti:"Pasar datos", h:"Props",
  c:`<div class="termbox">type TarjetaProps = { titulo: string; precio: number; destacado?: boolean };

function Tarjeta({ titulo, precio, destacado = false }: TarjetaProps) {
  return (
    &lt;div className={destacado ? "tarjeta destacada" : "tarjeta"}&gt;
      &lt;h3&gt;{titulo}&lt;/h3&gt;
      &lt;p&gt;{precio} €&lt;/p&gt;
    &lt;/div&gt;
  );
}

&lt;Tarjeta titulo="Teclado" precio={89.9} destacado /&gt;</div>
     <ul><li>Un componente recibe <b>un solo argumento</b>: el objeto <code>props</code>. Lo habitual es desestructurarlo en la firma.</li>
     <li>Los textos van entre comillas; cualquier otro valor (números, objetos, funciones, elementos), entre llaves.</li>
     <li>Una prop sin valor (<code>destacado</code>) vale <code>true</code>. Los valores por defecto se ponen en la desestructuración.</li>
     <li><code>key</code> y <code>ref</code> son especiales: <code>key</code> nunca llega al componente como prop.</li></ul>`},
 {t:"info", eti:"Envolver contenido", h:"children y reenviar props",
  c:`<div class="termbox">function Panel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    &lt;section className="panel"&gt;
      &lt;h2&gt;{titulo}&lt;/h2&gt;
      {children}
    &lt;/section&gt;
  );
}

&lt;Panel titulo="Resumen"&gt;
  &lt;p&gt;Tienes 3 tareas pendientes.&lt;/p&gt;
&lt;/Panel&gt;

// reenviar el resto de props a un elemento nativo
function Boton({ variante = "normal", ...resto }: BotonProps) {
  return &lt;button className={"btn btn-" + variante} {...resto} /&gt;;
}
&lt;Boton variante="peligro" onClick={borrar} disabled={cargando}&gt;Borrar&lt;/Boton&gt;</div>
     <p>Las props son <b>de solo lectura</b>: un componente nunca modifica las suyas. Si necesita cambiar algo, usa estado propio o avisa al padre con una función que le llegó por props.</p>`},
 {t:"par", p:"Empareja cada forma de pasar una prop con su valor",
  pares:[["titulo=\"Hola\"","El texto Hola"],["precio={10}","El número 10"],["activo","true"],["onClick={guardar}","La función guardar"],["<Panel>texto</Panel>","children = texto"],["{...datos}","Todas las propiedades del objeto datos como props"]],
  why:"Pasar funciones como props es como los hijos avisan a los padres de lo que ocurre."},
 {t:"opcion", p:"Un componente hijo hace <code>props.titulo = \"Otro\"</code>. ¿Qué ocurre?",
  ops:["Cambia el título en el padre","Es un error: las props son de solo lectura (el objeto está congelado en desarrollo); para cambiar datos se usa estado","Se actualiza la pantalla","Nada, es válido"],
  ok:1, why:"Los datos bajan por props; los cambios suben mediante funciones que pasa el padre."},
 {t:"opcion", p:"¿Qué se renderiza?<br><code>function Saludo({ nombre = \"invitado\" }) { return &lt;p&gt;Hola, {nombre}&lt;/p&gt;; }</code><br><code>&lt;Saludo nombre={undefined} /&gt;&lt;Saludo nombre={null} /&gt;</code>",
  ops:["Hola, invitado · Hola, invitado","Hola, invitado · Hola,","Hola, · Hola,","Hola, undefined · Hola, null"],
  ok:1, why:"El valor por defecto de la desestructuración solo se aplica con undefined. null es un valor y se pinta como nada."},
 {t:"hueco", p:"Completa el componente para que muestre el contenido que se pone entre sus etiquetas",
  tpl:"function Caja({ titulo, ___ }) {\n  return <div className=\"caja\"><h3>{___}</h3>{children}</div>;\n}",
  banco:["children","titulo","props","contenido"], sol:["children","titulo"],
  why:"children es la prop especial con lo que va entre &lt;Caja&gt; y &lt;/Caja&gt;."},
 {t:"vf", p:"Un componente puede leer su propia <code>key</code> como <code>props.key</code>.",
  ok:false, why:"key la usa React para identificar el elemento y no se pasa al componente. Si necesitas el id, pásalo también como otra prop (id={t.id})."}
]},

/* =============== U2 L2 =============== */
{
id:"re2l3",
titulo:"Renderizado condicional",
claves:["Ternario para elegir entre dos elementos, && para mostrar algo solo si se cumple","Salida temprana con return, o return null para no mostrar nada","Cuidado con 0 && ...: pinta un 0; usa comparaciones booleanas"],
pasos:[
 {t:"info", eti:"Mostrar u ocultar", h:"Condiciones en JSX",
  c:`<div class="termbox">function Carrito({ items, usuario }: Props) {
  if (!usuario) return &lt;BotonEntrar /&gt;;                   // salida temprana

  return (
    &lt;div&gt;
      {items.length &gt; 0 ? &lt;ListaItems items={items} /&gt; : &lt;p&gt;Carrito vacío&lt;/p&gt;}
      {usuario.esVip &amp;&amp; &lt;Insignia texto="VIP" /&gt;}
    &lt;/div&gt;
  );
}</div>
     <p>Si la lógica crece (tres o más casos), no anides ternarios: calcula el contenido en una variable o extrae un componente.</p>
     <div class="termbox">let contenido;
if (cargando) contenido = &lt;Spinner /&gt;;
else if (error) contenido = &lt;Error mensaje={error} /&gt;;
else contenido = &lt;Tabla filas={filas} /&gt;;
return &lt;section&gt;{contenido}&lt;/section&gt;;</div>`},
 {t:"info", eti:"Trampas", h:"El 0 suelto y ocultar frente a desmontar",
  c:`<p><code>&amp;&amp;</code> devuelve el primer operando si es «falsy». Si es <code>0</code>, React lo pinta:</p>
     <div class="termbox">{mensajes.length &amp;&amp; &lt;Contador n={mensajes.length} /&gt;}     // con 0 mensajes pinta "0"
{mensajes.length &gt; 0 &amp;&amp; &lt;Contador n={mensajes.length} /&gt;} // bien</div>
     <p>Otra diferencia importante: quitar un componente con una condición lo <b>desmonta</b> (pierde su estado). Ocultarlo con CSS (<code>hidden</code>, <code>display:none</code>) lo mantiene montado y conserva su estado. Elige según quieras que el estado sobreviva o no.</p>`},
 {t:"opcion", p:"¿Qué se ve con <code>{items.length &amp;&amp; &lt;Lista /&gt;}</code> si el carrito está vacío?",
  ops:["Nada","Un 0 en la pantalla","La lista vacía","Un error"],
  ok:1, why:"0 &amp;&amp; ... devuelve 0, y React pinta los números. Usa items.length &gt; 0 &amp;&amp; ..."},
 {t:"par", p:"Empareja cada patrón con su uso",
  pares:[["cond ? <A /> : <B />","Elegir entre dos opciones"],["cond && <A />","Mostrar A solo si se cumple"],["if (...) return <X />","Salida temprana antes del JSX principal"],["return null","No mostrar nada"],["Variable calculada antes del return","Tres o más casos sin anidar ternarios"]],
  why:"Si la lógica crece, calcula el contenido en variables antes del return."},
 {t:"opcion", p:"¿Qué se renderiza con <code>const n = 3;</code> y <code>&lt;p&gt;{n &gt; 5 ? \"muchas\" : n === 0 ? \"ninguna\" : \"pocas\"}&lt;/p&gt;</code>?",
  ops:["muchas","pocas","ninguna","Nada"],
  ok:1, why:"3 no es mayor que 5 ni igual a 0: el ternario anidado llega al último caso. Legible con dos niveles; con más, mejor una variable."},
 {t:"vf", p:"Un componente puede devolver <code>null</code> para no mostrar nada.",
  ok:true, why:"Es válido y habitual. Sus efectos y estado siguen funcionando mientras esté montado."},
 {t:"opcion", p:"Un panel con un formulario a medias se oculta con <code>{abierto &amp;&amp; &lt;Panel /&gt;}</code> y al volver a abrirlo el formulario está vacío. ¿Por qué?",
  ops:["Un bug de React","Al quitarlo del árbol se desmonta y su estado se pierde; si debe conservarse, ocúltalo con CSS o sube el estado","Falta una key","El navegador borra los inputs"],
  ok:1, why:"Desmontar = destruir el estado. En React 19.2 también existe &lt;Activity mode=\"hidden\"&gt;, que oculta conservando el estado."}
]},

/* =============== U2 L3 =============== */
{
id:"re2l2",
titulo:"Listas y key",
claves:["Se renderizan listas con array.map devolviendo elementos, tras filtrar u ordenar","Cada elemento necesita una key estable y única entre hermanos","No uses el índice como key si la lista cambia de orden, se filtra o se inserta en medio"],
pasos:[
 {t:"info", eti:"Repetir", h:"map y key",
  c:`<div class="termbox">function ListaTareas({ tareas }: { tareas: Tarea[] }) {
  if (tareas.length === 0) return &lt;p&gt;No hay tareas&lt;/p&gt;;
  const pendientes = tareas.filter(t =&gt; !t.hecha)
                           .toSorted((a, b) =&gt; a.prioridad - b.prioridad);
  return (
    &lt;ul&gt;
      {pendientes.map(t =&gt; (
        &lt;FilaTarea key={t.id} tarea={t} /&gt;
      ))}
    &lt;/ul&gt;
  );
}</div>
     <p>La <b>key</b> permite a React saber qué elemento es cuál entre renderizados: si insertas una tarea al principio, sabe que las demás son las mismas y conserva su estado y sus nodos del DOM.</p>
     <p>Nota el <code>toSorted</code>: <code>sort</code> ordena <b>en el sitio</b> y mutaría el array de las props.</p>`},
 {t:"info", eti:"Por qué importa", h:"Qué pasa con key={indice}",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">borrar la primera fila con key = índice</div><table class="dg-tabla"><thead><tr><th>key</th><th>antes</th><th>después</th></tr></thead><tbody>
       <tr><td>0</td><td>Pan · input: «integral»</td><td>Leche · input: «integral»</td></tr>
       <tr><td>1</td><td>Leche · input: vacío</td><td>Huevos · input: vacío</td></tr>
       <tr><td>2</td><td>Huevos · input: vacío</td><td>(se destruye)</td></tr>
     </tbody></table></div>
     <p>React ve que desapareció la key 2 y que las keys 0 y 1 siguen: reutiliza sus componentes (con su estado) y solo cambia las props. El texto «integral» que escribiste para el pan aparece ahora en la leche. Con <code>key={t.id}</code> React sabe que desapareció el pan.</p>
     <p>El índice solo es aceptable si la lista es estática: nunca se reordena, filtra ni inserta en medio. Si los datos no traen id, genéralo al crear el elemento (<code>crypto.randomUUID()</code>), <b>no</b> al renderizar.</p>`},
 {t:"opcion", p:"¿Qué key es la más adecuada para una lista de tareas que se puede reordenar y filtrar?",
  ops:["El índice del array","El id de la tarea","Math.random()","El título"],
  ok:1, why:"El índice cambia al reordenar (estado mezclado entre filas); random cambia en cada render; el título puede repetirse."},
 {t:"par", p:"Empareja cada key con su problema o ventaja",
  pares:[["key={t.id}","Estable y única: correcta"],["key={indice}","Mezcla el estado de las filas al reordenar o borrar"],["key={Math.random()}","Recrea todos los elementos en cada render"],["Sin key","Aviso en consola y actualizaciones menos eficientes"]],
  why:"Un síntoma típico de keys malas: escribes en un input de una fila y el texto aparece en otra al borrar."},
 {t:"vf", p:"Las keys deben ser únicas en toda la aplicación.",
  ok:false, why:"Solo entre hermanos de la misma lista. Dos listas distintas pueden usar las mismas keys."},
 {t:"hueco", p:"Completa para pintar un <code>&lt;li&gt;</code> por producto",
  tpl:"<ul>\n  {productos.___(p => <li ___={p.id}>{p.nombre}</li>)}\n</ul>",
  banco:["map","key","forEach","id","filter"], sol:["map","key"],
  why:"forEach devuelve undefined, así que no pintaría nada: hace falta map, que devuelve un array de elementos."},
 {t:"codigo", p:"Simula el render de una lista: avisa de keys duplicadas y pinta solo las tareas pendientes",
  lenguaje:"js",
  c:`<p>Por stdin llega un array JSON de tareas <code>{id, titulo, hecha}</code>. Primero, por cada id repetido (a partir de su segunda aparición) imprime <code>AVISO: key duplicada &lt;id&gt;</code>. Después imprime <code>&lt;li key=ID&gt;TITULO&lt;/li&gt;</code> por cada tarea no hecha, en su orden. Si no queda ninguna, imprime <code>&lt;p&gt;No hay tareas&lt;/p&gt;</code>.</p>`,
  plantilla:"const tareas = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\n// 1) avisos de keys duplicadas\n// 2) filas pendientes (o el mensaje de lista vacía)\n",
  pruebas:[{entrada:'[{"id":1,"titulo":"Comprar pan","hecha":false},{"id":2,"titulo":"Estudiar","hecha":true},{"id":3,"titulo":"Correr","hecha":false}]', salida:"<li key=1>Comprar pan</li>\n<li key=3>Correr</li>"},{entrada:'[{"id":7,"titulo":"A","hecha":false},{"id":7,"titulo":"B","hecha":false}]', salida:"AVISO: key duplicada 7\n<li key=7>A</li>\n<li key=7>B</li>"},{entrada:'[{"id":"a","titulo":"X","hecha":true},{"id":"b","titulo":"Y","hecha":true},{"id":"a","titulo":"Z","hecha":true}]', salida:"AVISO: key duplicada a\n<p>No hay tareas</p>", oculta:true}],
  pista:"Un Set para recordar los ids vistos. Luego filter(t => !t.hecha) y, si queda vacío, el mensaje.",
  solucion:"const tareas = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst vistas = new Set();\nfor (const t of tareas) {\n  if (vistas.has(t.id)) console.log(\"AVISO: key duplicada \" + t.id);\n  vistas.add(t.id);\n}\nconst pendientes = tareas.filter(t => !t.hecha);\nif (pendientes.length === 0) console.log(\"<p>No hay tareas</p>\");\nfor (const t of pendientes) console.log(\"<li key=\" + t.id + \">\" + t.titulo + \"</li>\");\n",
  why:"React hace esta misma comprobación en desarrollo («Encountered two children with the same key») porque dos keys iguales hacen que confunda qué elemento es cuál."}
]},

/* =============== U2 L4 =============== */
{
id:"re2l4",
titulo:"Composición de componentes",
claves:["Componer con children y huecos (props con elementos) antes que con muchas props de configuración","Componentes compuestos: Tabs, Tabs.Lista, Tabs.Panel comparten estado por contexto","La composición evita el prop drilling sin necesidad de contexto"],
pasos:[
 {t:"info", eti:"Piezas que encajan", h:"Composición",
  c:`<div class="termbox">// en vez de &lt;Tarjeta titulo=... mostrarBoton icono=... textoBoton=... /&gt;
&lt;Tarjeta&gt;
  &lt;Tarjeta.Cabecera&gt;Resumen&lt;/Tarjeta.Cabecera&gt;
  &lt;p&gt;3 tareas pendientes&lt;/p&gt;
  &lt;Tarjeta.Acciones&gt;&lt;Boton&gt;Ver todas&lt;/Boton&gt;&lt;/Tarjeta.Acciones&gt;
&lt;/Tarjeta&gt;

// layout que recibe "huecos"
function Layout({ lateral, children }: { lateral: React.ReactNode; children: React.ReactNode }) {
  return &lt;div className="layout"&gt;&lt;aside&gt;{lateral}&lt;/aside&gt;&lt;main&gt;{children}&lt;/main&gt;&lt;/div&gt;;
}
&lt;Layout lateral={&lt;Menu usuario={usuario} /&gt;}&gt;&lt;Panel /&gt;&lt;/Layout&gt;</div>
     <p>La composición evita componentes con 20 props booleanas y también el <b>prop drilling</b>: <code>Layout</code> no necesita recibir <code>usuario</code> para pasárselo a <code>Menu</code>; el padre crea <code>&lt;Menu usuario={usuario} /&gt;</code> directamente.</p>`},
 {t:"info", eti:"Contenedor y contenido", h:"Separar lógica y presentación",
  c:`<p>Un patrón clásico que sigue siendo útil: un componente que <b>obtiene y prepara datos</b> y otro que <b>solo pinta</b> lo que recibe por props. El segundo es fácil de reutilizar, de probar y de mostrar en Storybook.</p>
     <div class="termbox">function PaginaPerfil() {                         // obtiene datos
  const { data } = useQuery({ queryKey: ["yo"], queryFn: api.yo });
  return data ? &lt;TarjetaPerfil usuario={data} /&gt; : &lt;Spinner /&gt;;
}

function TarjetaPerfil({ usuario }: { usuario: Usuario }) {   // solo pinta
  return &lt;article&gt;&lt;h2&gt;{usuario.nombre}&lt;/h2&gt;&lt;p&gt;{usuario.email}&lt;/p&gt;&lt;/article&gt;;
}</div>
     <p>Hoy la lógica reutilizable se extrae más a <b>hooks propios</b> que a componentes contenedores, pero la idea de fondo es la misma.</p>`},
 {t:"par", p:"Empareja cada técnica con el problema que resuelve",
  pares:[["children","Un componente contenedor que no sabe qué tendrá dentro"],["Props con elementos (lateral={...})","Varios huecos en un mismo layout"],["Componentes compuestos","Piezas relacionadas que comparten estado (pestañas, menús)"],["Contexto","Datos globales que necesitan muchos componentes lejanos"],["Componente de presentación","Pintar sin saber de dónde vienen los datos"]],
  why:"Las librerías de componentes accesibles (Radix, React Aria) usan mucho los componentes compuestos."},
 {t:"opcion", p:"Un componente <code>Boton</code> ha acumulado props <code>esGrande, esRojo, conIcono, iconoDerecha, soloIcono...</code>. ¿Qué mejora propondrías?",
  ops:["Añadir más props","Pocas variantes con nombre (variante=\"peligro\", tamano=\"lg\") y composición con children para el contenido","Duplicar el componente por cada caso","Usar clases globales"],
  ok:1, why:"Menos combinaciones imposibles (esRojo y esVerde a la vez) y una API más clara."},
 {t:"opcion", p:"<code>App</code> tiene el usuario y lo pasa por <code>Pagina</code> → <code>Contenido</code> → <code>Barra</code> → <code>Avatar</code>, y solo Avatar lo usa. ¿Primera solución a probar?",
  ops:["Una variable global","Composición: que App cree &lt;Avatar usuario={usuario} /&gt; y lo pase como hueco o children","Duplicar el estado en Avatar","Pedir el usuario a la API en Avatar"],
  ok:1, why:"La documentación de React recomienda probar la composición antes que el contexto: es más explícita."},
 {t:"hueco", p:"Completa el layout para que reciba el menú como un hueco aparte del contenido principal",
  tpl:"function Layout({ menu, ___ }) {\n  return <div><nav>{___}</nav><main>{children}</main></div>;\n}",
  banco:["children","menu","props","lateral"], sol:["children","menu"],
  why:"Cualquier prop puede recibir elementos de React, no solo children."},
 {t:"vf", p:"Un componente que recibe <code>children</code> vuelve a crear esos hijos cada vez que él cambia de estado.",
  ok:false, why:"Los elementos de children los creó el padre. Si solo cambia el estado del contenedor, children es el mismo objeto y React puede saltarse ese subárbol. Es un truco de rendimiento clásico."}
]},

/* =============== U2 L5 =============== */
{
id:"re2n1",
titulo:"Componentes puros",
claves:["Un componente debe ser puro: mismas props, estado y contexto producen el mismo JSX","Durante el render no se cambia nada que existiera antes (variables externas, props, DOM)","Los efectos secundarios van en manejadores de eventos o, si no hay otra opción, en efectos"],
pasos:[
 {t:"info", eti:"La regla de oro", h:"Renderizar es calcular",
  c:`<p>React asume que tus componentes son <b>funciones puras</b>: dadas las mismas entradas, devuelven el mismo resultado y no cambian nada fuera de sí mismas. Gracias a eso puede renderizar cuando quiera, las veces que quiera, pausar un render o descartarlo.</p>
     <div class="termbox">let invitados = 0;

function Taza() {
  invitados = invitados + 1;              // MAL: cambia una variable de fuera
  return &lt;h2&gt;Taza para el invitado {invitados}&lt;/h2&gt;;
}

function Mesa() {
  return (&lt;&gt;&lt;Taza /&gt;&lt;Taza /&gt;&lt;Taza /&gt;&lt;/&gt;);
}
// en producción: 1, 2, 3 ... y en desarrollo con StrictMode: 2, 4, 6</div>
     <p>La versión pura recibe el dato: <code>function Taza({ invitado })</code>. Mutar variables <b>creadas dentro</b> del render sí está permitido (mutación local): crear un array y hacerle <code>push</code> antes de devolverlo no afecta a nadie.</p>`},
 {t:"info", eti:"Dónde van los efectos", h:"Qué no se hace al renderizar",
  c:`<div class="dg"><div class="dg-tit">cada cosa en su sitio</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">Durante el render</div><div class="dg-pila"><div class="dg-caja ok">calcular valores</div><div class="dg-caja ok">leer props, estado, contexto</div><div class="dg-caja ok">devolver JSX</div></div></div>
       <div class="dg-col"><div class="dg-col-tit">Nunca en el render</div><div class="dg-pila"><div class="dg-caja aviso">fetch, localStorage.setItem</div><div class="dg-caja aviso">modificar props o variables externas</div><div class="dg-caja aviso">tocar el DOM, setTimeout</div><div class="dg-caja aviso">llamar a setState sin condición</div></div></div>
       <div class="dg-col"><div class="dg-col-tit">Dónde van</div><div class="dg-pila"><div class="dg-caja acento">manejadores de eventos</div><div class="dg-caja acento">useEffect (último recurso)</div></div></div>
     </div></div>
     <p>Por eso StrictMode llama dos veces a tus componentes en desarrollo: si son puros, el resultado es idéntico; si no, el fallo salta a la vista.</p>`},
 {t:"opcion", p:"Con el código de <code>Taza</code> que modifica la variable <code>invitados</code>, en desarrollo con StrictMode, ¿qué se renderiza?",
  ops:["1, 2, 3","2, 4, 6","1, 1, 1","3, 3, 3"],
  ok:1, why:"StrictMode renderiza cada componente dos veces, así que la variable global se incrementa dos veces por taza. El fallo existe también en producción: cualquier render extra lo descuadra."},
 {t:"par", p:"Empareja cada línea escrita dentro del cuerpo de un componente con si es correcta",
  pares:[["const total = items.reduce(...)","Correcto: cálculo puro"],["props.items.sort()","Incorrecto: muta las props (usa toSorted)"],["const filas = []; filas.push(<Fila />)","Correcto: mutación local de algo recién creado"],["document.title = titulo","Incorrecto en el render: va en un efecto"],["localStorage.setItem(\"x\", v)","Incorrecto en el render: va en un manejador o efecto"]],
  why:"La pregunta clave: ¿existía eso antes de que empezara este render? Si sí, no lo toques."},
 {t:"vf", p:"Un componente puro no puede tener estado.",
  ok:false, why:"El estado es una entrada más, como las props. Pureza significa que con las mismas entradas (props, estado, contexto) el resultado es el mismo."},
 {t:"opcion", p:"¿Por qué es importante que el render sea puro en React 18 y 19?",
  ops:["Por estética","Porque React puede interrumpir, repetir o descartar renders (renderizado concurrente, transiciones, Suspense) y el React Compiler asume pureza para memorizar","Porque hace el código más corto","Porque TypeScript lo exige"],
  ok:1, why:"Un render con efectos secundarios se ejecutaría un número imprevisible de veces."},
 {t:"escribe", p:"¿Qué componente de React renderiza dos veces en desarrollo para destapar componentes impuros?",
  sol:["StrictMode","<StrictMode>","React.StrictMode","strict mode","modo estricto"],
  pista:"Se pone envolviendo a App en main.tsx.",
  why:"Solo en desarrollo: en producción no tiene coste."}
]}

]});
