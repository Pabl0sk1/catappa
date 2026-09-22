window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Maestría: entrevista de React",
resumen: "Errores típicos, preguntas de entrevista y simulacro final de React",
nivel: "Maestro",
color: "#1c89b0",
lecciones: [

{
id:"re10l1",
titulo:"Errores típicos",
claves:["Mutar el estado, keys con índice, efectos innecesarios y dependencias olvidadas","Estado duplicado o derivado guardado aparte","Pedir datos sin cancelar y sin gestionar errores"],
pasos:[
 {t:"opcion", p:"Al borrar la primera fila de una lista editable, el texto escrito en ella aparece en la siguiente. ¿Causa más probable?",
  ops:["Un bug de React","key={indice}: tras borrar, React reutiliza el estado de la fila por posición","Falta memo","Falta useEffect"],
  ok:1, why:"Usa un id estable como key."},
 {t:"opcion", p:"Un efecto que pide datos según <code>busqueda</code> muestra a veces resultados de una búsqueda anterior. ¿Qué pasa?",
  ops:["El servidor es lento","Condición de carrera: una respuesta vieja llega después de la nueva. Cancela con AbortController en la limpieza (o usa TanStack Query)","Falta un await","Hay que usar var"],
  ok:1, why:"La limpieza del efecto existe precisamente para esto."},
 {t:"opcion", p:"El contador muestra un valor viejo dentro de un setInterval creado en un efecto con <code>[]</code>. ¿Por qué?",
  ops:["setInterval es asíncrono","El callback captura el valor del primer render (closure obsoleto); usa la forma setN(prev => prev + 1) o añade la dependencia","Falta memo","Es un bug del navegador"],
  ok:1, why:"Los closures obsoletos (stale closures) son el error clásico con hooks."},
 {t:"par", p:"Empareja cada síntoma con su causa típica",
  pares:[["La pantalla no se actualiza tras cambiar el estado","Se mutó el array u objeto en vez de crear uno nuevo"],["Bucle infinito de renders","Un efecto actualiza algo que está en sus dependencias"],["Aparece un 0 suelto en la interfaz","cantidad && <Algo />"],["Error de hooks al añadir un if","Hook llamado de forma condicional"]],
  why:"Reconocer estos síntomas al instante es lo que se espera de alguien con experiencia."}
]},

{
id:"re10l2",
titulo:"Simulacro de entrevista de React",
claves:["Sabes explicar el modelo de React: estado, render y reconciliación","Dominas hooks, efectos, rendimiento y datos del servidor","Estás preparado para entrevistas de frontend con React"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Qué es el Virtual DOM o la reconciliación?»",
  ops:["Una copia del servidor","React genera una descripción del árbol de interfaz en cada render, la compara con la anterior y aplica al DOM real solo las diferencias","Un navegador interno","Una base de datos"],
  ok:1, why:"Añade el papel de las keys en la comparación de listas."},
 {t:"opcion", p:"«¿Diferencia entre props y estado?»",
  ops:["Ninguna","Las props llegan del padre y son de solo lectura; el estado pertenece al componente y al cambiar provoca un nuevo render","El estado es global","Las props son asíncronas"],
  ok:1, why:"Los datos bajan por props; los eventos suben con funciones pasadas como props."},
 {t:"opcion", p:"«¿Para qué sirve useEffect y cuándo lo evitarías?»",
  ops:["Para todo","Para sincronizar con sistemas externos (suscripciones, APIs del navegador, red) con limpieza; se evita para datos derivados o acciones que pertenecen a un manejador de eventos","Solo para peticiones","Para estilos"],
  ok:1, why:"Esta respuesta demuestra que conoces el React actual y no solo el de 2019."},
 {t:"opcion", p:"«¿Cómo optimizarías una aplicación React lenta?»",
  ops:["memo en todos los componentes","Medir con el Profiler; luego dividir código con lazy, virtualizar listas largas, evitar renders costosos con memo, useMemo o useCallback donde se vea el problema, y mover estado más cerca de donde se usa","Cambiar a otro framework","Quitar TypeScript"],
  ok:1, why:"Primero medir: es lo que distingue una respuesta de senior."},
 {t:"opcion", p:"«¿Cómo gestionas el estado en una aplicación grande?»",
  ops:["Todo en Redux","Separando tipos: servidor con TanStack Query, UI local con useState, URL para filtros, y un store ligero (Zustand, Redux Toolkit) o contexto solo para lo realmente global","Todo en contexto","En localStorage"],
  ok:1, why:"Clasificar el estado es la clave."},
 {t:"info", eti:"Terminado", h:"Has completado React",
  c:`<p>Dominas componentes y JSX, props, estado y eventos, formularios y efectos, hooks propios y contexto, enrutado y datos del servidor, rendimiento, pruebas y accesibilidad, y el React moderno con frameworks.</p>
     <p>Para consolidarlo: construye el frontend de tu API de tareas de Spring con Vite, React, TypeScript, React Router y TanStack Query, con pruebas en Testing Library, y despliégalo en un contenedor Nginx junto a la API con Docker Compose.</p>`}
]}

]});
