window.CURSOS = window.CURSOS || {};
(CURSOS.htmlcss = CURSOS.htmlcss || []).push({
titulo: "Modelo de caja y maquetación",
resumen: "El modelo de caja, box-sizing, display, posicionamiento, Flexbox y Grid",
nivel: "Intermedio",
color: "#e87c50",
lecciones: [

{
id:"hc4l1",
titulo:"El modelo de caja",
claves:["Cada elemento es una caja: contenido, padding, borde y margen","box-sizing: border-box hace que width incluya padding y borde","display: block, inline, inline-block, none, flex y grid"],
pasos:[
 {t:"info", eti:"Todo son cajas", h:"Contenido, relleno, borde y margen",
  c:`<div class="diag">+------------------- margin -------------------+
|  +--------------- border ----------------+   |
|  |  +----------- padding -------------+  |   |
|  |  |          contenido              |  |   |
|  |  +---------------------------------+  |   |
|  +---------------------------------------+   |
+----------------------------------------------+</div>
     <div class="termbox">*, *::before, *::after { box-sizing: border-box; }   /* casi todos los proyectos lo ponen */
.tarjeta { width: 300px; padding: 16px; border: 1px solid #ddd; margin-bottom: 24px; }
/* con border-box la tarjeta mide 300px en total; sin el, 334px */</div>`},
 {t:"par", p:"Empareja cada parte de la caja con su definición",
  pares:[["Contenido","El texto o los elementos de dentro"],["Padding","Espacio interior entre el contenido y el borde"],["Border","El borde de la caja"],["Margin","Espacio exterior que separa de otras cajas"],["box-sizing: border-box","El ancho incluye padding y borde"]],
  why:"Los márgenes verticales de bloques contiguos se «colapsan»: se aplica el mayor, no la suma."},
 {t:"par", p:"Empareja cada valor de display con su comportamiento",
  pares:[["block","Ocupa todo el ancho y empieza en línea nueva (div, p)"],["inline","Fluye con el texto; ignora width y height (span, a)"],["inline-block","Fluye con el texto pero acepta tamaño"],["none","No se muestra ni ocupa espacio"],["flex / grid","Activa un sistema de maquetación para sus hijos"]],
  why:"visibility: hidden oculta pero sigue ocupando espacio; display: none no."}
]},

{
id:"hc4l2",
titulo:"Posicionamiento",
claves:["static (normal), relative, absolute, fixed y sticky","absolute se coloca respecto al ancestro posicionado más cercano","z-index ordena lo que se superpone dentro de su contexto de apilamiento"],
pasos:[
 {t:"info", eti:"Sacar del flujo", h:"position",
  c:`<div class="termbox">.tarjeta { position: relative; }            /* referencia para sus hijos absolute */
.tarjeta .insignia {
  position: absolute; top: 8px; right: 8px; /* esquina superior derecha de la tarjeta */
}
.cabecera { position: sticky; top: 0; }      /* se pega arriba al hacer scroll */
.aviso-cookies { position: fixed; bottom: 16px; left: 16px; }   /* fijo en la ventana */
.modal { position: fixed; inset: 0; z-index: 100; }</div>`},
 {t:"par", p:"Empareja cada valor de position con su comportamiento",
  pares:[["static","Flujo normal (por defecto)"],["relative","Flujo normal, desplazable y referencia para hijos absolute"],["absolute","Fuera del flujo, respecto al ancestro posicionado"],["fixed","Respecto a la ventana: no se mueve al hacer scroll"],["sticky","Normal hasta un umbral de scroll, luego se queda pegado"]],
  why:"El error clásico: un absolute que aparece en una esquina de la página porque su padre no es relative."},
 {t:"opcion", p:"Tu insignia con <code>position: absolute; top: 0; right: 0</code> aparece en la esquina de la página, no de la tarjeta. ¿Qué falta?",
  ops:["Un z-index","position: relative en la tarjeta","display: flex","Un margin"],
  ok:1, why:"absolute busca el ancestro posicionado más cercano."}
]},

{
id:"hc4l3",
titulo:"Flexbox y Grid",
claves:["Flexbox reparte elementos en una dimensión (fila o columna)","Grid organiza en dos dimensiones con filas y columnas","gap para el espacio entre elementos; repeat(auto-fill, minmax()) para rejillas adaptables"],
pasos:[
 {t:"info", eti:"Una dimensión", h:"Flexbox",
  c:`<div class="termbox">.barra {
  display: flex;
  justify-content: space-between;   /* eje principal */
  align-items: center;              /* eje cruzado */
  gap: 12px;
}
.barra .buscador { flex: 1; }       /* ocupa el espacio sobrante */
.centrar { display: flex; justify-content: center; align-items: center; }   /* centrar de verdad */
.columna { display: flex; flex-direction: column; }
.envolver { display: flex; flex-wrap: wrap; }</div>`},
 {t:"info", eti:"Dos dimensiones", h:"Grid",
  c:`<div class="termbox">.catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));   /* tantas columnas como quepan */
  gap: 16px;
}

.pagina {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "lateral contenido";
}
.lateral { grid-area: lateral; }
.contenido { grid-area: contenido; }</div>
     <p>El catálogo de esta plataforma usa exactamente <code>repeat(auto-fill, minmax(...))</code>: 3 columnas en escritorio, 1 en móvil, sin media queries.</p>`},
 {t:"par", p:"Empareja cada propiedad con su efecto",
  pares:[["justify-content","Alinea en el eje principal"],["align-items","Alinea en el eje cruzado"],["flex: 1","El elemento crece para ocupar el espacio libre"],["gap","Espacio entre elementos"],["grid-template-columns","Define las columnas de la rejilla"]],
  why:"Regla práctica: Flexbox para componentes en línea, Grid para el esqueleto de la página y rejillas."},
 {t:"opcion", p:"¿Qué CSS centra un elemento vertical y horizontalmente dentro de su contenedor?",
  ops:["margin: auto sin más","display: flex; justify-content: center; align-items: center en el contenedor","text-align: center","vertical-align: middle en el hijo"],
  ok:1, why:"O con Grid: display: grid; place-items: center."}
]}

]});
