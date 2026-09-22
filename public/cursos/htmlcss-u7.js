window.CURSOS = window.CURSOS || {};
(CURSOS.htmlcss = CURSOS.htmlcss || []).push({
titulo: "Maestría: retos y entrevista",
resumen: "Retos de maquetación, preguntas frecuentes de entrevista de frontend y simulacro final",
nivel: "Maestro",
color: "#d2653d",
lecciones: [

{
id:"hc7l1",
titulo:"Retos de maquetación",
claves:["Elegir Flexbox o Grid según el problema","Centrar, repartir, pegar el pie abajo, rejillas adaptables","Pensar primero en el HTML semántico y luego en el CSS"],
pasos:[
 {t:"opcion", p:"¿Cómo haces que el pie de página quede abajo aunque el contenido sea corto?",
  ops:["position: absolute en el pie","body como flex en columna con min-height: 100vh y main con flex: 1","margin-top: 900px","Una tabla"],
  ok:1, why:"El «sticky footer» moderno sin trucos. Con Grid: grid-template-rows: auto 1fr auto."},
 {t:"opcion", p:"Quieres una galería que muestre tantas columnas de al menos 200px como quepan. ¿Qué usas?",
  ops:["Flexbox con anchos fijos","grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))","Una media query por cada ancho posible","float: left"],
  ok:1, why:"Rejilla adaptable sin media queries."},
 {t:"par", p:"Empareja cada problema con la solución",
  pares:[["Barra con logo a la izquierda y botones a la derecha","Flexbox con justify-content: space-between"],["Esqueleto con cabecera, lateral, contenido y pie","Grid con grid-template-areas"],["Texto largo que desborda su caja","overflow-wrap: anywhere o text-overflow: ellipsis"],["Imagen que se deforma","object-fit: cover"],["Mantener un vídeo en 16:9","aspect-ratio: 16 / 9"]],
  why:"Resolver estos casos rápido es lo que se espera en una prueba de maquetación."}
]},

{
id:"hc7l2",
titulo:"Simulacro de entrevista de HTML y CSS",
claves:["Sabes explicar semántica, cascada, especificidad y modelo de caja","Dominas Flexbox, Grid y diseño responsive","Tienes en cuenta la accesibilidad y el rendimiento"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Qué es el HTML semántico y por qué importa?»",
  ops:["Usar muchas clases","Usar las etiquetas que describen el significado (header, nav, main, button...): mejora accesibilidad, SEO y mantenimiento","Escribir HTML sin errores","Usar solo divs"],
  ok:1, why:"Añade un ejemplo: un botón de verdad frente a un div con onclick."},
 {t:"opcion", p:"«Explica la especificidad en CSS»",
  ops:["El orden del fichero únicamente","Un peso por tipo de selector (id, clases y atributos, etiquetas) que decide qué regla gana; a igualdad, gana la última","El tamaño de la letra","La velocidad del CSS"],
  ok:1, why:"Menciona que conviene mantenerla baja."},
 {t:"opcion", p:"«¿Flexbox o Grid?»",
  ops:["Siempre Grid","Flexbox para alinear en una dimensión (barras, componentes); Grid para dos dimensiones (esqueletos de página, rejillas). Se combinan","Siempre Flexbox","Ninguno, float"],
  ok:1, why:"La respuesta de alguien que maqueta a diario."},
 {t:"opcion", p:"«¿Cómo harías una web accesible?»",
  ops:["Añadiendo ARIA a todo","HTML semántico, etiquetas en formularios, textos alternativos, contraste suficiente, foco visible, todo operable con teclado y pruebas con Lighthouse o axe","Con letras grandes","Con un plugin"],
  ok:1, why:"Menciona las pruebas con teclado y lector de pantalla."},
 {t:"opcion", p:"«¿Qué harías si tu página tiene un CLS alto?»",
  ops:["Nada","Reservar el espacio de imágenes y anuncios (width, height, aspect-ratio), cargar las fuentes sin saltos y no insertar contenido encima del existente","Quitar el CSS","Usar más JavaScript"],
  ok:1, why:"CLS mide cuánto se mueve el contenido mientras carga."},
 {t:"info", eti:"Terminado", h:"Has completado HTML y CSS",
  c:`<p>Dominas la estructura y el HTML semántico, los formularios, CSS desde cero, la cascada, el modelo de caja, Flexbox y Grid, el diseño responsive, el CSS moderno, la accesibilidad y el rendimiento.</p>
     <p>Para consolidarlo: maqueta desde cero la portada de un producto real (cabecera, héroe, rejilla de tarjetas, formulario y pie), en claro y oscuro, que funcione con teclado y obtenga más de 90 en Lighthouse. Después, pasa al curso de JavaScript.</p>`}
]}

]});
