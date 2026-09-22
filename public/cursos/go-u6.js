window.CURSOS = window.CURSOS || {};
(CURSOS.go = CURSOS.go || []).push({
titulo: "Maestría: entrevista de Go",
resumen: "Preguntas frecuentes sobre Go y su modelo de concurrencia, y simulacro final",
nivel: "Maestro",
color: "#3199b2",
lecciones: [

{
id:"go6l1",
titulo:"Simulacro de entrevista de Go",
claves:["Sabes explicar slices, interfaces implícitas y gestión de errores","Dominas goroutines, canales, sync y context","Conoces las herramientas: pruebas, race detector, pprof y despliegue"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Diferencia entre un array y un slice en Go?»",
  ops:["Ninguna","El array tiene tamaño fijo que forma parte de su tipo; el slice es una vista (puntero, longitud y capacidad) sobre un array que puede crecer con append","El slice es más lento","El array es dinámico"],
  ok:1, why:"Menciona que dos slices pueden compartir el mismo array por debajo."},
 {t:"opcion", p:"«¿Cómo gestiona Go los errores?»",
  ops:["Con excepciones","Como valores devueltos (resultado, error) que se comprueban explícitamente, con wrapping mediante %w y errors.Is/As; panic solo para lo irrecuperable","Ignorándolos","Con códigos de salida"],
  ok:1, why:"Explícito y algo verboso, pero muy claro."},
 {t:"opcion", p:"«¿Canales o Mutex?»",
  ops:["Siempre canales","Canales para comunicar y coordinar trabajo entre goroutines; Mutex para proteger un estado compartido sencillo. Se usa lo que deje el código más claro","Siempre Mutex","Ninguno"],
  ok:1, why:"«No comuniques compartiendo memoria; comparte memoria comunicando», con pragmatismo."},
 {t:"opcion", p:"«¿Para qué sirve context?»",
  ops:["Para guardar variables globales","Para propagar cancelación, plazos y valores de petición a través de las llamadas, de modo que el trabajo se detenga si ya no hace falta","Para los logs","Para los tests"],
  ok:1, why:"Cada función que hace E/S recibe ctx como primer parámetro."},
 {t:"info", eti:"Terminado", h:"Has completado Go",
  c:`<p>Dominas la sintaxis, slices, maps y structs, interfaces, errores y genéricos, concurrencia con goroutines, canales y context, servicios HTTP, pruebas, perfiles e imágenes mínimas.</p>
     <p>Para consolidarlo: reescribe en Go un servicio pequeño (por ejemplo, un comprobador de salud de tus URLs con goroutines y un endpoint /metrics para Prometheus), con pruebas por tablas y una imagen distroless.</p>`}
]}

]});
