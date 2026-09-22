window.CURSOS = window.CURSOS || {};
(CURSOS.htmlcss = CURSOS.htmlcss || []).push({
titulo: "Diseño responsive y CSS moderno",
resumen: "Mobile first y media queries, imágenes adaptables, variables CSS y temas, animaciones, container queries y :has",
nivel: "Avanzado",
color: "#dd7046",
lecciones: [

{
id:"hc5l1",
titulo:"Diseño responsive",
claves:["Mobile first: estilos base para móvil y media queries para pantallas mayores","Diseños fluidos con porcentajes, min(), max(), clamp() y rejillas adaptables","Imágenes con max-width: 100% y srcset para servir el tamaño adecuado"],
pasos:[
 {t:"info", eti:"Todas las pantallas", h:"Mobile first",
  c:`<div class="termbox">/* base: movil */
.pagina { display: grid; gap: 16px; padding: 16px; }
.lateral { display: none; }

/* tabletas y escritorio */
@media (min-width: 768px) {
  .pagina { grid-template-columns: 240px 1fr; }
  .lateral { display: block; }
}

img { max-width: 100%; height: auto; }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}</div>
     <div class="termbox">&lt;img src="foto-800.jpg"
     srcset="foto-400.jpg 400w, foto-800.jpg 800w, foto-1600.jpg 1600w"
     sizes="(min-width: 768px) 50vw, 100vw"
     alt="..." loading="lazy"&gt;</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["@media (min-width: 768px)","Aplicar estilos a partir de cierto ancho"],["srcset y sizes","Que el navegador descargue la imagen del tamaño adecuado"],["loading=\"lazy\"","No descargar imágenes hasta que se acercan a la pantalla"],["prefers-reduced-motion","Respetar a quien pide menos animaciones"],["prefers-color-scheme","Adaptarse al modo claro u oscuro del sistema"]],
  why:"Esta plataforma usa prefers-color-scheme para el tema «sistema»."},
 {t:"opcion", p:"¿Qué significa diseñar «mobile first»?",
  ops:["Hacer solo la versión móvil","Escribir los estilos base para pantallas pequeñas y añadir con min-width lo necesario para las grandes","Usar solo porcentajes","Usar una app nativa"],
  ok:1, why:"Suele dar CSS más sencillo: se añade complejidad cuando hay más espacio."}
]},

{
id:"hc5l2",
titulo:"Variables, temas y animaciones",
claves:["Variables CSS (custom properties) para colores, espacios y radios","Temas claro y oscuro redefiniendo variables","transition para cambios suaves; @keyframes para animaciones; anima transform y opacity"],
pasos:[
 {t:"info", eti:"Tokens de diseño", h:"Variables y temas",
  c:`<div class="termbox">:root {
  --fondo: #ffffff;
  --texto: #1f2328;
  --acento: #f5b642;
  --radio: 12px;
}
@media (prefers-color-scheme: dark) {
  :root { --fondo: #0d1016; --texto: #e6e9ef; }
}
[data-theme="dark"] { --fondo: #0d1016; --texto: #e6e9ef; }

body { background: var(--fondo); color: var(--texto); }
.boton { background: var(--acento); border-radius: var(--radio);
         transition: transform .15s ease, box-shadow .15s ease; }
.boton:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgb(0 0 0 / 15%); }

@keyframes aparecer { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.toast { animation: aparecer .25s ease-out; }</div>`},
 {t:"par", p:"Empareja cada técnica con su uso",
  pares:[["--acento: #f5b642","Definir un token reutilizable"],["var(--acento)","Usar el token"],["transition","Animar el cambio entre dos estados"],["@keyframes","Definir una animación con varios pasos"],["transform y opacity","Propiedades baratas de animar (sin recalcular el diseño)"]],
  why:"Animar width, height o top obliga a recalcular la maquetación: menos fluido."},
 {t:"opcion", p:"¿Cuál es la forma más sencilla de implementar modo claro y oscuro?",
  ops:["Dos hojas de estilo completas","Variables CSS con valores distintos según el tema o la preferencia del sistema","JavaScript cambiando cada color","Imágenes distintas"],
  ok:1, why:"Todo el CSS usa las variables y solo cambian sus valores."}
]},

{
id:"hc5l3",
titulo:"CSS moderno",
claves:["Container queries: estilos según el tamaño del contenedor, no de la pantalla","Selector :has() para estilizar un padre según sus hijos","Anidamiento nativo, clamp(), aspect-ratio y logical properties"],
pasos:[
 {t:"info", eti:"Lo nuevo", h:"Funciones recientes",
  c:`<div class="termbox">/* container queries: la tarjeta se adapta al hueco donde la pongas */
.zona { container-type: inline-size; }
@container (min-width: 400px) {
  .tarjeta { display: grid; grid-template-columns: 120px 1fr; }
}

/* :has(): el formulario se marca si contiene un campo invalido */
form:has(input:invalid) .enviar { opacity: .5; }
.tarjeta:has(img) { padding-top: 0; }

/* anidamiento nativo */
.tarjeta {
  padding: 16px;
  &amp;:hover { border-color: var(--acento); }
  .titulo { font-weight: 700; }
}

.video { aspect-ratio: 16 / 9; }
.caja { margin-inline: auto; padding-block: 24px; }    /* propiedades logicas */</div>`},
 {t:"par", p:"Empareja cada función con su utilidad",
  pares:[["@container","Adaptar un componente al espacio de su contenedor"],[":has()","Estilizar un elemento según lo que contiene"],["Anidamiento con &","Escribir reglas relacionadas dentro de su bloque"],["aspect-ratio","Mantener una proporción (16/9) sin trucos"],["margin-inline","Márgenes laterales que respetan la dirección del texto"]],
  why:"Muchas cosas que antes requerían Sass o JavaScript ya son CSS nativo."},
 {t:"vf", p:"Las media queries y las container queries son lo mismo.",
  ok:false, why:"Las media queries miran la ventana; las container queries, el tamaño del contenedor del componente."}
]}

]});
