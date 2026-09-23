window.CURSOS = window.CURSOS || {};
(CURSOS.htmlcss = CURSOS.htmlcss || []).push({
titulo: "Accesibilidad, rendimiento y buenas prácticas",
resumen: "Accesibilidad web y WCAG, rendimiento y Core Web Vitals, SEO básico, organización del CSS y herramientas",
nivel: "Experto",
color: "#dd7046",
lecciones: [

{
id:"hc6l1",
titulo:"Accesibilidad web",
claves:["WCAG: perceptible, operable, comprensible y robusto","Contraste suficiente, foco visible, navegación por teclado y textos alternativos","HTML semántico primero; ARIA solo cuando no hay alternativa nativa"],
pasos:[
 {t:"info", eti:"Para todas las personas", h:"Lo esencial",
  c:`<ul><li><b>Contraste</b> de al menos 4,5:1 entre texto y fondo (3:1 en textos grandes).</li>
     <li><b>Teclado</b>: todo lo interactivo se alcanza con Tab y se activa con Enter o Espacio; el <b>foco se ve</b> (<code>:focus-visible</code>).</li>
     <li><b>Textos alternativos</b> en imágenes con información.</li>
     <li><b>Etiquetas</b> en todos los campos; errores anunciados.</li>
     <li><b>Idioma</b> del documento (<code>lang="es"</code>) y jerarquía de títulos coherente.</li>
     <li>No transmitir información <b>solo con color</b> (un error en rojo también lleva texto o icono).</li></ul>`},
 {t:"par", p:"Empareja cada problema con su solución",
  pares:[["Texto gris claro sobre blanco","Aumentar el contraste"],["outline: none sin alternativa","Estilo de :focus-visible bien visible"],["Botón que es un div","Usar un button"],["Error indicado solo en rojo","Añadir texto e icono al error"],["Modal que no atrapa el foco","Mover el foco al abrirlo y devolverlo al cerrar (o usar dialog)"]],
  why:"La accesibilidad también es un requisito legal en muchos sectores y países."},
 {t:"opcion", p:"¿Cuál es la forma más rápida de detectar problemas de accesibilidad en tu página?",
  ops:["No hay forma","Recorrerla solo con el teclado y pasar Lighthouse o axe DevTools","Mirarla en otro navegador","Poner más imágenes"],
  ok:1, why:"Las herramientas automáticas detectan parte; el teclado revela lo demás."}
]},

{
id:"hc6l2",
titulo:"Rendimiento y SEO",
claves:["Core Web Vitals: LCP (carga), INP (respuesta) y CLS (estabilidad)","Menos bytes: imágenes optimizadas (AVIF, WebP), CSS y JS mínimos, caché y CDN","SEO: títulos, descripciones, HTML semántico, URLs limpias y páginas rápidas"],
pasos:[
 {t:"info", eti:"Rápida y encontrable", h:"Core Web Vitals",
  c:`<div class="dg dg-tabla-caja"><table class="dg-tabla"><tbody><tr><td>LCP</td><td>Largest Contentful Paint</td><td>&amp;lt; 2,5 s</td><td>cuanto tarda en verse lo principal</td></tr><tr><td>INP</td><td>Interaction to Next Paint</td><td>&amp;lt; 200 ms</td><td>cuanto tarda en responder a un clic</td></tr><tr><td>CLS</td><td>Cumulative Layout Shift</td><td>&amp;lt; 0,1</td><td>cuanto "salta" el contenido al cargar</td></tr></tbody></table></div>
     <ul><li>Imágenes en AVIF o WebP, con tamaño adecuado y <code>width</code>/<code>height</code> (evitan saltos).</li>
     <li>Precargar la fuente y la imagen principales; el resto, diferido.</li>
     <li>Menos JavaScript y dividido por rutas.</li>
     <li>Compresión (Brotli), caché larga con nombres con hash y CDN.</li></ul>`},
 {t:"par", p:"Empareja cada problema con la métrica que empeora",
  pares:[["Imagen principal enorme sin optimizar","LCP: tarda en verse lo principal"],["Un clic que tarda en responder por JavaScript pesado","INP: la interacción va lenta"],["Anuncio que aparece y empuja el contenido","CLS: el contenido salta"],["Fuente web que tarda en cargar y bloquea el texto","FCP y LCP: se ve la página en blanco más tiempo"]],
  why:"Google usa estas métricas como factor de posicionamiento."},
 {t:"par", p:"Empareja cada elemento con su papel en el SEO",
  pares:[["<title>","Título del resultado en el buscador"],["<meta name=\"description\">","Texto del resultado"],["Un único <h1> descriptivo","Tema principal de la página"],["alt en las imágenes","Que el buscador entienda las imágenes"],["URLs legibles","/cursos/docker mejor que /p?id=17"]],
  why:"Un buen HTML semántico ya es la mitad del SEO técnico."}
]},

{
id:"hc6l3",
titulo:"Organizar el CSS",
claves:["Nombres de clases con una metodología (BEM) o utilidades (Tailwind)","Tokens de diseño en variables y componentes reutilizables","Herramientas: DevTools, Stylelint, Prettier y un sistema de diseño"],
pasos:[
 {t:"info", eti:"A escala", h:"Mantener el CSS bajo control",
  c:`<div class="termbox">/* BEM: bloque__elemento--modificador */
.tarjeta { ... }
.tarjeta__titulo { ... }
.tarjeta--destacada { ... }

/* capas en cascada: orden explicito de prioridad */
@layer reset, base, componentes, utilidades;
@layer componentes { .boton { ... } }
@layer utilidades { .oculto { display: none; } }</div>
     <p>En las DevTools (pestaña Elements → Styles) ves qué reglas se aplican a un elemento, cuáles se han anulado y por qué: la herramienta número uno para depurar CSS.</p>`},
 {t:"par", p:"Empareja cada práctica con su beneficio",
  pares:[["BEM","Nombres predecibles que evitan choques de estilos"],["@layer","Controlar la prioridad entre grupos de reglas"],["Variables CSS","Cambiar colores o espacios en un solo sitio"],["Stylelint","Detectar errores y malas prácticas en el CSS"],["DevTools → Styles","Ver qué regla gana y por qué"]],
  why:"Sin convenciones, el CSS crece y nadie se atreve a borrar nada."},
 {t:"opcion", p:"Un estilo no se aplica y no sabes por qué. ¿Qué haces primero?",
  ops:["Añadir !important","Inspeccionar el elemento en DevTools y ver qué regla lo anula o si el selector no coincide","Reescribir todo el CSS","Cambiar de navegador"],
  ok:1, why:"DevTools muestra las reglas tachadas y su origen."}
]}

]});
