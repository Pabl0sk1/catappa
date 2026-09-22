window.CURSOS = window.CURSOS || {};
(CURSOS.htmlcss = CURSOS.htmlcss || []).push({
titulo: "CSS desde cero",
resumen: "Cómo se aplica CSS, selectores, la cascada, especificidad y herencia, colores, unidades y tipografía",
nivel: "Fundamentos",
color: "#e87c50",
lecciones: [

{
id:"hc3l1",
titulo:"Reglas y selectores",
claves:["Una regla CSS: selector { propiedad: valor; }","Selectores de etiqueta, clase (.clase), id (#id), atributo y combinadores","Pseudoclases (:hover, :focus-visible) y pseudoelementos (::before)"],
pasos:[
 {t:"info", eti:"Dar estilo", h:"Anatomía de una regla",
  c:`<div class="termbox">/* estilos.css, enlazado con &lt;link rel="stylesheet" href="estilos.css"&gt; */
p { color: #333; line-height: 1.6; }
.tarjeta { padding: 16px; border-radius: 12px; }
#principal { max-width: 960px; }
nav a { text-decoration: none; }                 /* a dentro de nav */
.menu &gt; li { display: inline-block; }           /* hijos directos */
input[type="email"] { width: 100%; }             /* por atributo */
button:hover { background: #f5b642; }
a:focus-visible { outline: 2px solid #f5b642; }  /* foco con teclado */
.obligatorio::after { content: " *"; color: tomato; }</div>`},
 {t:"par", p:"Empareja cada selector con lo que selecciona",
  pares:[["p","Todos los párrafos"],[".tarjeta","Elementos con class=\"tarjeta\""],["#principal","El elemento con id=\"principal\""],["nav a","Enlaces dentro de un nav, a cualquier profundidad"],[".menu > li","li que son hijos directos de .menu"]],
  why:"En la práctica se estiliza casi todo con clases."},
 {t:"escribe", p:"Escribe el selector que aplica a los elementos con la clase <code>boton</code> cuando el ratón está encima",
  sol:[".boton:hover"], ph:".boton...", pista:"Punto, nombre de la clase y la pseudoclase :hover.", why:".boton:hover { ... }"},
 {t:"vf", p:"Un mismo elemento puede tener varias clases: <code>class=\"boton primario grande\"</code>.",
  ok:true, why:"Y se combinan en CSS: .boton.primario selecciona los que tienen ambas."}
]},

{
id:"hc3l2",
titulo:"Cascada, especificidad y herencia",
claves:["Cuando dos reglas chocan gana la más específica; a igualdad, la última","Especificidad: id > clase, atributo y pseudoclase > etiqueta","Algunas propiedades se heredan (color, font); otras no (margin, border)"],
pasos:[
 {t:"info", eti:"Quién gana", h:"La cascada",
  c:`<div class="termbox">p { color: gray; }                 /* especificidad 0-0-1 */
.aviso { color: orange; }          /* 0-1-0: gana a p */
#alerta { color: red; }            /* 1-0-0: gana a todo lo anterior */
p.aviso { color: gold; }           /* 0-1-1: gana a .aviso */

.aviso { color: orange; }
.aviso { color: purple; }          /* misma especificidad: gana la ultima */

.aviso { color: blue !important; } /* se salta la cascada: evitalo */</div>
     <p>Mantén la especificidad baja (casi todo con una sola clase) para que los estilos sean fáciles de sobrescribir. <code>!important</code> suele ser síntoma de una guerra de especificidad.</p>`},
 {t:"orden", p:"Ordena estos selectores de menor a mayor especificidad",
  items:["p",".aviso",".tarjeta .titulo","#principal"],
  why:"Etiqueta < una clase < dos clases < id."},
 {t:"par", p:"Empareja cada propiedad con si se hereda",
  pares:[["color","Se hereda: los hijos toman el color del padre"],["font-family","Se hereda: basta con ponerla en body"],["margin","No se hereda: cada caja tiene el suyo"],["border","No se hereda: sería raro que los hijos tuvieran borde"],["inherit (valor)","Fuerza a tomar el valor del padre"]],
  why:"Por eso basta con poner la fuente en body para toda la página."},
 {t:"opcion", p:"<code>.titulo { color: blue }</code> y más abajo <code>h2 { color: red }</code>. ¿De qué color es <code>&lt;h2 class=\"titulo\"&gt;</code>?",
  ops:["Rojo, porque está después","Azul, porque la clase es más específica que la etiqueta","Morado","Negro"],
  ok:1, why:"El orden solo desempata a igualdad de especificidad."}
]},

{
id:"hc3l3",
titulo:"Colores, unidades y tipografía",
claves:["Colores en hex, rgb, hsl u oklch; transparencias con alfa","Unidades: px fijas, rem relativas a la raíz, % y vw/vh relativas al contenedor o pantalla","Tipografía: font-family con alternativas, tamaños en rem y line-height sin unidad"],
pasos:[
 {t:"info", eti:"Aspecto", h:"Valores habituales",
  c:`<div class="termbox">:root { font-size: 100%; }                   /* 1rem = 16px por defecto */
body {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #1f2328;
  background: hsl(220 20% 98%);
}
h1 { font-size: clamp(1.8rem, 4vw, 3rem); }   /* crece con la pantalla, con limites */
.nota { color: rgb(0 0 0 / 60%); }            /* negro al 60% */
.contenedor { width: min(100% - 32px, 960px); margin-inline: auto; }</div>`},
 {t:"par", p:"Empareja cada unidad con su referencia",
  pares:[["px","Píxel CSS, tamaño fijo"],["rem","Tamaño de letra de la raíz (html)"],["em","Tamaño de letra del propio elemento"],["%","Porcentaje del contenedor"],["vw / vh","1% del ancho o alto de la ventana"]],
  why:"rem para textos y espacios respeta el tamaño de letra que el usuario elija en su navegador."},
 {t:"opcion", p:"¿Por qué usar <code>rem</code> para el tamaño de los textos en lugar de <code>px</code>?",
  ops:["Por estética","Porque escala si el usuario aumenta el tamaño de letra del navegador (accesibilidad)","Porque px no funciona en móviles","Por rendimiento"],
  ok:1, why:"Muchos usuarios con baja visión aumentan el tamaño base."},
 {t:"vf", p:"<code>line-height: 1.6</code> (sin unidad) se multiplica por el tamaño de letra de cada elemento.",
  ok:true, why:"Sin unidad se hereda como factor, lo que evita alturas de línea raras en elementos con otro tamaño."}
]}

]});
