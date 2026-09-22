window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Maestría: retos y entrevista",
resumen: "Ejercicios de código típicos, preguntas trampa del lenguaje y simulacro de entrevista de JavaScript",
nivel: "Maestro",
color: "#9c850f",
lecciones: [

{
id:"js12l1",
titulo:"Retos y preguntas trampa",
claves:["Implementar debounce, deep clone o un contador con closures","Conocer == frente a ===, this, hoisting y el orden del event loop","Explicar en voz alta el razonamiento"],
pasos:[
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">console.log(typeof NaN);</div>`,
  ops:["\"NaN\"","\"number\"","\"undefined\"","\"object\""],
  ok:1, why:"NaN significa «Not a Number», pero su tipo es number."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">const a = [1, 2, 3];
a[10] = 11;
console.log(a.length);</div>`,
  ops:["4","11","10","3"],
  ok:1, why:"length es el mayor índice más uno; las posiciones intermedias quedan vacías."},
 {t:"opcion", p:"¿Qué imprime?", c:`<div class="termbox">console.log([] + []);
console.log([1, 2] + [3]);</div>`,
  ops:["[] y [1, 2, 3]","\"\" y \"1,23\"","0 y 6","Error"],
  ok:1, why:"+ con arrays los convierte a texto: \"\" + \"\" y \"1,2\" + \"3\"."},
 {t:"opcion", p:"«Escribe una función que devuelva una versión de <code>fn</code> que solo pueda ejecutarse una vez». ¿Cuál es correcta?",
  ops:["function once(fn) { return fn; }","function once(fn) { let hecho = false, r; return (...a) =&gt; { if (!hecho) { hecho = true; r = fn(...a); } return r; }; }","function once(fn) { fn(); fn = null; }","const once = fn =&gt; setTimeout(fn, 0);"],
  ok:1, why:"Un closure guarda si ya se ejecutó y el resultado."},
 {t:"par", p:"Empareja cada reto con la técnica clave",
  pares:[["Eliminar duplicados","[...new Set(array)]"],["Agrupar por una propiedad","reduce u Object.groupBy"],["Contador privado","Closure"],["Limitar llamadas al escribir","debounce"],["Copia profunda","structuredClone"]],
  why:"Object.groupBy(lista, x => x.categoria) llegó en ES2024."}
]},

{
id:"js12l2",
titulo:"Simulacro de entrevista de JavaScript",
claves:["Has repasado las preguntas más frecuentes de JavaScript","Sabes explicar closures, this, prototipos, asincronía y el event loop","Estás preparado para entrevistas de frontend, fullstack y Node"],
pasos:[
 {t:"info", eti:"Último paso", h:"Preguntas mezcladas",
  c:`<p>Responde en voz alta antes de elegir.</p>`},
 {t:"opcion", p:"«¿Qué es un closure?»",
  ops:["Un tipo de bucle","Una función que recuerda y puede usar las variables del ámbito en el que se creó, aunque ese ámbito ya haya terminado","Una forma de cerrar el navegador","Un objeto congelado"],
  ok:1, why:"Acompáñalo con el ejemplo del contador o de una función configurada."},
 {t:"opcion", p:"«¿Diferencias entre var, let y const?»",
  ops:["Ninguna","var tiene ámbito de función y hoisting con undefined; let y const tienen ámbito de bloque y zona muerta temporal; const no se puede reasignar","const es inmutable del todo","let es global"],
  ok:1, why:"Menciona que const no hace inmutable el objeto."},
 {t:"opcion", p:"«Explica el event loop»",
  ops:["Un bucle for especial","El código se ejecuta en una pila; las operaciones asíncronas las hace el entorno y encolan callbacks; cuando la pila se vacía se ejecutan todas las microtareas (promesas) y después la siguiente macrotarea (temporizadores, eventos)","Un hilo por cada petición","Un sistema de reintentos"],
  ok:1, why:"Un ejemplo con setTimeout y Promise.then lo deja clarísimo."},
 {t:"opcion", p:"«¿Qué diferencia hay entre == y ===?»",
  ops:["Ninguna","== convierte tipos antes de comparar; === compara valor y tipo sin conversiones, y es lo que se debe usar","=== es más lento","== compara referencias"],
  ok:1, why:"Ejemplo: 0 == \"\" es true; 0 === \"\" es false."},
 {t:"opcion", p:"«¿Cómo funciona this en JavaScript?»",
  ops:["Siempre es window","Depende de cómo se llama la función: el objeto en obj.metodo(), el nuevo objeto con new, el indicado con call/apply/bind, y en las flechas el del ámbito exterior","Es el nombre de la función","Es la clase"],
  ok:1, why:"El caso trampa: pasar un método como callback pierde el this."},
 {t:"opcion", p:"«¿Promesas o async/await?»",
  ops:["Son cosas distintas sin relación","async/await es sintaxis sobre promesas: más legible y con try/catch; para paralelismo sigues usando Promise.all","async/await es más rápido","Las promesas están obsoletas"],
  ok:1, why:"Y el fallo típico: await dentro de forEach."},
 {t:"info", eti:"Terminado", h:"Has completado JavaScript de cero a experto",
  c:`<p>Dominas tipos y operadores, funciones y closures, arrays y objetos, this, prototipos y clases, el DOM y los eventos, la asincronía y el event loop, módulos y herramientas, y los aspectos avanzados de rendimiento y seguridad.</p>
     <p>Siguientes pasos naturales: <b>TypeScript</b> para añadir tipos, <b>React</b> para interfaces y <b>Node.js</b> para el backend. Para practicar: construye el frontend de tu API de tareas con JavaScript puro (fetch, DOM, localStorage) antes de pasar a React.</p>`}
]}

]});
