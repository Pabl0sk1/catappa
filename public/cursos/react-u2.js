window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Props, listas y condiciones",
resumen: "Pasar datos con props, children, tipar props con TypeScript, renderizar listas con key y mostrar contenido condicional",
nivel: "Fundamentos",
color: "#61dafb",
lecciones: [

{
id:"re2l1",
titulo:"Props",
claves:["Las props son los parámetros de un componente","Fluyen de padre a hijo y son de solo lectura","children es el contenido entre las etiquetas del componente"],
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
     <p>Los textos van entre comillas; cualquier otro valor, entre llaves. Una prop sin valor (<code>destacado</code>) vale <code>true</code>.</p>`},
 {t:"info", eti:"Envolver contenido", h:"children",
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
&lt;/Panel&gt;</div>`},
 {t:"par", p:"Empareja cada forma de pasar una prop con su valor",
  pares:[["titulo=\"Hola\"","El texto Hola"],["precio={10}","El número 10"],["activo","true"],["onClick={guardar}","La función guardar"],["<Panel>texto</Panel>","children = texto"]],
  why:"Pasar funciones como props es como los hijos avisan a los padres de lo que ocurre."},
 {t:"opcion", p:"Un componente hijo hace <code>props.titulo = \"Otro\"</code>. ¿Qué ocurre?",
  ops:["Cambia el título en el padre","Error o comportamiento incorrecto: las props son de solo lectura; para cambiar datos se usa estado","Se actualiza la pantalla","Nada, es válido"],
  ok:1, why:"Los datos bajan por props; los cambios suben mediante funciones que pasa el padre."}
]},

{
id:"re2l2",
titulo:"Listas y key",
claves:["Se renderizan listas con array.map devolviendo elementos","Cada elemento necesita una key estable y única entre hermanos","No uses el índice como key si la lista cambia de orden o se filtra"],
pasos:[
 {t:"info", eti:"Repetir", h:"map y key",
  c:`<div class="termbox">function ListaTareas({ tareas }: { tareas: Tarea[] }) {
  if (tareas.length === 0) return &lt;p&gt;No hay tareas&lt;/p&gt;;
  return (
    &lt;ul&gt;
      {tareas.map(t =&gt; (
        &lt;li key={t.id}&gt;{t.titulo}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</div>
     <p>La <b>key</b> permite a React saber qué elemento es cuál entre renderizados: si insertas una tarea al principio, sabe que las demás son las mismas y no las recrea.</p>`},
 {t:"opcion", p:"¿Qué key es la más adecuada para una lista de tareas que se puede reordenar y filtrar?",
  ops:["El índice del array","El id de la tarea","Math.random()","El título"],
  ok:1, why:"El índice cambia al reordenar (bugs de estado mezclado entre filas); random cambia en cada render; el título puede repetirse."},
 {t:"par", p:"Empareja cada key con su problema o ventaja",
  pares:[["key={t.id}","Estable y única: correcta"],["key={indice}","Mezcla el estado de las filas al reordenar o borrar"],["key={Math.random()}","Recrea todos los elementos en cada render"],["Sin key","Aviso en consola y actualizaciones menos eficientes"]],
  why:"Un síntoma típico de keys malas: escribes en un input de una fila y el texto aparece en otra al borrar."},
 {t:"vf", p:"Las keys deben ser únicas en toda la aplicación.",
  ok:false, why:"Solo entre hermanos de la misma lista."}
]},

{
id:"re2l3",
titulo:"Renderizado condicional",
claves:["Ternario para elegir entre dos elementos","&& para mostrar algo solo si se cumple una condición","Cuidado con 0 && ...: muestra un 0"],
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
}</div>`},
 {t:"opcion", p:"¿Qué se ve con <code>{items.length &amp;&amp; &lt;Lista /&gt;}</code> si el carrito está vacío?",
  ops:["Nada","Un 0 en la pantalla","La lista vacía","Error"],
  ok:1, why:"0 && ... devuelve 0, y React pinta los números. Usa items.length > 0 && ..."},
 {t:"par", p:"Empareja cada patrón con su uso",
  pares:[["cond ? <A /> : <B />","Elegir entre dos opciones"],["cond && <A />","Mostrar A solo si se cumple"],["if (...) return <X />","Salida temprana antes del JSX principal"],["return null","No mostrar nada"]],
  why:"Si la lógica crece, calcula el contenido en variables antes del return."},
 {t:"vf", p:"Un componente puede devolver <code>null</code> para no mostrar nada.",
  ok:true, why:"Es válido y habitual."}
]},

{
id:"re2l4",
titulo:"Composición de componentes",
claves:["Componer con children antes que con muchas props de configuración","Componentes compuestos: Tabs, Tabs.Lista, Tabs.Panel comparten estado por contexto","Evita el prop drilling con composición o contexto"],
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
}</div>
     <p>La composición evita componentes con 20 props booleanas y también el <b>prop drilling</b> (pasar un dato por cinco niveles que no lo usan).</p>`},
 {t:"par", p:"Empareja cada técnica con el problema que resuelve",
  pares:[["children","Un componente contenedor que no sabe qué tendrá dentro"],["Props con elementos (lateral={...})","Varios huecos en un mismo layout"],["Componentes compuestos","Piezas relacionadas que comparten estado (pestañas, menús)"],["Contexto","Evitar pasar un dato por muchos niveles intermedios"]],
  why:"Las librerías de componentes accesibles (Radix, React Aria) usan mucho los componentes compuestos."},
 {t:"opcion", p:"Un componente <code>Boton</code> ha acumulado props <code>esGrande, esRojo, conIcono, iconoDerecha, soloIcono...</code>. ¿Qué mejora propondrías?",
  ops:["Añadir más props","Pocas variantes con nombre (variante=\"peligro\", tamano=\"lg\") y composición con children para el contenido","Duplicar el componente por cada caso","Usar clases globales"],
  ok:1, why:"Menos combinaciones imposibles y una API más clara."}
]}

]});
