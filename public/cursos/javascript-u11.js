window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "JavaScript avanzado",
resumen: "Iteradores y generadores, Proxy y Reflect, memoria y fugas, rendimiento, seguridad y patrones funcionales",
nivel: "Experto",
color: "#ae9518",
lecciones: [

{
id:"js11l1",
titulo:"Iteradores y generadores",
claves:["Un iterable implementa Symbol.iterator; for...of y el spread lo usan","Una función generadora (function*) produce valores bajo demanda con yield","Generadores asíncronos y for await...of para flujos de datos"],
pasos:[
 {t:"info", eti:"Recorrer a medida", h:"El protocolo de iteración",
  c:`<div class="termbox">class Rango {
  constructor(desde, hasta) { this.desde = desde; this.hasta = hasta; }
  *[Symbol.iterator]() {                  // generador como iterador
    for (let i = this.desde; i &lt;= this.hasta; i++) yield i;
  }
}
[...new Rango(1, 5)];          // [1, 2, 3, 4, 5]

function* ids() {               // secuencia infinita, perezosa
  let id = 1;
  while (true) yield id++;
}
const gen = ids();
gen.next();                     // { value: 1, done: false }

// paginar una API sin cargar todo
async function* todasLasPaginas(url) {
  while (url) {
    const res = await fetch(url).then(r =&gt; r.json());
    yield* res.items;
    url = res.siguiente;
  }
}
for await (const item of todasLasPaginas("/api/pedidos")) procesar(item);</div>`},
 {t:"par", p:"Empareja cada concepto con su definición",
  pares:[["Iterable","Objeto con Symbol.iterator que se puede recorrer con for...of"],["function*","Función generadora que puede pausarse"],["yield","Entrega un valor y pausa el generador"],["next()","Reanuda el generador hasta el siguiente yield"],["for await...of","Recorre un iterable asíncrono"]],
  why:"Los generadores permiten procesar secuencias enormes o infinitas con memoria constante."},
 {t:"opcion", p:"¿Qué ventaja tiene el generador <code>todasLasPaginas</code> frente a cargar todas las páginas en un array?",
  ops:["Ninguna","Procesa los elementos a medida que llegan, sin guardar todo en memoria, y puede parar en cualquier momento","Es síncrono","Descarga en paralelo"],
  ok:1, why:"Evaluación perezosa: se pide la siguiente página solo cuando hace falta."},
 {t:"vf", p:"Un generador ejecuta todo su cuerpo al llamarlo, antes del primer next().",
  ok:false, why:"Llamarlo solo crea el objeto generador; el cuerpo avanza con cada next()."}
]},

{
id:"js11l2",
titulo:"Proxy, Reflect y metaprogramación",
claves:["Proxy intercepta operaciones sobre un objeto (leer, escribir, borrar)","Reflect ofrece las operaciones por defecto para delegar","Base de la reactividad de Vue y de validaciones y observadores"],
pasos:[
 {t:"info", eti:"Interceptar", h:"Proxy",
  c:`<div class="termbox">function observable(obj, alCambiar) {
  return new Proxy(obj, {
    set(objetivo, prop, valor, receptor) {
      const ok = Reflect.set(objetivo, prop, valor, receptor);
      alCambiar(prop, valor);
      return ok;
    },
  });
}

const estado = observable({ contador: 0 }, (p, v) =&gt; console.log(p, "=", v));
estado.contador++;     // contador = 1</div>
     <p>Así funciona, simplificado, la reactividad de <b>Vue 3</b>: al modificar el estado, se actualiza la interfaz.</p>`},
 {t:"par", p:"Empareja cada trampa (trap) de Proxy con la operación que intercepta",
  pares:[["get","Leer una propiedad"],["set","Asignar una propiedad"],["has","El operador in"],["deleteProperty","delete obj.prop"],["apply","Llamar a una función"]],
  why:"Reflect tiene un método por cada trampa para aplicar el comportamiento normal."},
 {t:"opcion", p:"¿Para qué NO usarías un Proxy en código de aplicación normal?",
  ops:["Validar asignaciones en un objeto de configuración","Registrar accesos para depurar","Para todo: sustituir objetos simples por proxies por si acaso","Implementar reactividad"],
  ok:2, why:"Añaden coste y magia difícil de seguir: úsalos cuando aporten algo claro."}
]},

{
id:"js11l3",
titulo:"Memoria, rendimiento y seguridad",
claves:["Fugas típicas: listeners no eliminados, temporizadores, cachés que crecen, closures que retienen","WeakMap y WeakRef no impiden la recolección","Seguridad: XSS, dependencias comprometidas, prototype pollution, CSP"],
pasos:[
 {t:"info", eti:"Memoria", h:"Fugas en JavaScript",
  c:`<p>JavaScript tiene recolector de basura, pero hay fugas cuando algo sigue referenciando lo que ya no usas:</p>
     <ul><li><b>Event listeners</b> sobre elementos que ya no existen, o sobre window, sin removeEventListener.</li>
     <li><b>setInterval</b> que nunca se limpia.</li>
     <li><b>Cachés</b> en un Map global que crecen sin límite.</li>
     <li><b>Closures</b> que retienen objetos grandes.</li></ul>
     <div class="termbox">const controlador = new AbortController();
window.addEventListener("resize", recalcular, { signal: controlador.signal });
controlador.abort();          // quita todos los listeners asociados

const metadatos = new WeakMap();   // si el objeto clave desaparece, la entrada tambien</div>`},
 {t:"par", p:"Empareja cada amenaza con su defensa",
  pares:[["XSS","textContent, escapar la salida y Content-Security-Policy"],["Dependencia de npm comprometida","npm audit, lock commiteado, revisar dependencias y pocas dependencias"],["Prototype pollution","No fusionar objetos de entrada sin validar claves como __proto__"],["Secretos en el frontend","Nunca: todo el JavaScript del navegador es público"]],
  why:"Cualquier clave de API en el código del frontend la puede leer cualquiera."},
 {t:"info", eti:"Rendimiento", h:"Lo que más importa en la web",
  c:`<ul><li>Enviar <b>menos JavaScript</b>: dividir por rutas, eliminar dependencias pesadas.</li>
     <li>No bloquear el hilo principal (tareas largas, workers).</li>
     <li>Evitar reflujos forzados: leer medidas del DOM y escribir en bloques separados.</li>
     <li>Medir con Lighthouse y las Core Web Vitals (LCP, INP, CLS).</li></ul>`},
 {t:"opcion", p:"Un compañero pone la clave secreta de la API de pagos en el código de React «porque está minificado». ¿Qué le dices?",
  ops:["Está bien","Todo el código del navegador es público: la clave debe estar en el backend, que hace la llamada","Que la ofusque más","Que la guarde en localStorage"],
  ok:1, why:"Minificar no oculta nada: cualquiera puede leerla en DevTools."},
 {t:"vf", p:"Un <code>setInterval</code> que no se limpia al salir de una pantalla puede provocar una fuga de memoria.",
  ok:true, why:"Sigue ejecutándose y reteniendo lo que su callback referencia."}
]}

]});
