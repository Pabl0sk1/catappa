window.CURSOS = window.CURSOS || {};
(CURSOS.javascript = CURSOS.javascript || []).push({
titulo: "Errores y depuración",
resumen: "Lanzar y capturar errores, tipos de error, causas encadenadas, errores propios, manejadores globales y depuración con DevTools y Node",
nivel: "Intermedio",
color: "#c9b02e",
lecciones: [

{
id:"js13n1",
titulo:"Lanzar y capturar errores",
claves:["throw lanza; try/catch captura; finally se ejecuta siempre","Errores nativos: TypeError, ReferenceError, RangeError, SyntaxError","Encadena la causa con new Error(\"…\", { cause }) para no perder el error original"],
pasos:[
 {t:"info", eti:"Cuando algo sale mal", h:"throw, try, catch y finally",
  c:`<div class="termbox">function dividir(a, b) {
  if (b === 0) throw new RangeError("No se puede dividir entre cero");
  return a / b;
}

try {
  const r = dividir(10, 0);
  console.log(r);                 // no se ejecuta
} catch (error) {
  console.error(error.name);      // "RangeError"
  console.error(error.message);   // "No se puede dividir entre cero"
  console.error(error.stack);     // dónde se lanzó, línea a línea
} finally {
  cerrarConexion();               // pase lo que pase
}</div>
     <p>Un error lanzado <b>sube</b> por la pila de llamadas hasta el primer <code>catch</code> que lo recoja. Si nadie lo captura, el programa (o esa tarea del event loop) se detiene y se muestra en la consola.</p>
     <p>Lanza siempre objetos <code>Error</code> (o subclases), no textos: <code>throw "fallo"</code> no tiene <code>stack</code> ni <code>name</code>.</p>`},
 {t:"info", eti:"Los tipos", h:"Errores nativos y causa encadenada",
  c:`<div class="dg dg-tabla-caja"><div class="dg-tit">errores que lanza el propio lenguaje</div>
<table class="dg-tabla"><tbody>
<tr><td>TypeError</td><td>operación sobre un tipo que no la admite: <code>undefined.nombre</code>, llamar a algo que no es función</td></tr>
<tr><td>ReferenceError</td><td>variable que no existe o en zona muerta temporal</td></tr>
<tr><td>RangeError</td><td>valor fuera de rango: <code>new Array(-1)</code>, pila desbordada</td></tr>
<tr><td>SyntaxError</td><td>código mal escrito, o <code>JSON.parse</code> de texto no válido</td></tr>
</tbody></table></div>
     <div class="termbox">try {
  config = JSON.parse(texto);
} catch (e) {
  throw new Error("No se pudo leer la configuración", { cause: e });   // ES2022
}
// arriba: error.message explica el QUÉ, error.cause conserva el POR QUÉ original</div>`},
 {t:"par", p:"Empareja cada código con el error que lanza",
  pares:[["null.length","TypeError"],["noExiste + 1","ReferenceError"],["JSON.parse(\"{mal}\")","SyntaxError"],["(1).toFixed(200)","RangeError"],["const x = 1; x = 2;","TypeError: asignación a constante"]],
  why:"Saber el tipo de error te dice dónde mirar: TypeError suele ser un undefined inesperado; ReferenceError, un nombre mal escrito."},
 {t:"opcion", p:"¿Qué devuelve <code>f()</code>?", c:`<div class="termbox">function f() {
  try {
    return "try";
  } finally {
    console.log("finally");
  }
}</div>`,
  ops:["undefined, y no imprime nada","\"try\", después de imprimir finally","\"finally\"","Lanza un error"],
  ok:1, why:"finally se ejecuta incluso tras un return. Ojo: si finally hace su propio return, sustituye al del try (mala práctica)."},
 {t:"codigo", p:"Escribe <code>parsearEdad(texto)</code>: devuelve el número o lanza <code>TypeError</code> si no es un entero, y <code>RangeError</code> si no está entre 0 y 130. Imprime el resultado o <code>Nombre: mensaje</code>",
  lenguaje:"js",
  plantilla:`function parsearEdad(texto) {
  // lanza TypeError("No es un número entero") o RangeError("Fuera de rango")
}
for (const t of require("fs").readFileSync(0, "utf8").trim().split("\\n")) {
  try {
    console.log(parsearEdad(t));
  } catch (e) {
    console.log(\`\${e.name}: \${e.message}\`);
  }
}
`,
  pruebas:[{entrada:"42\nabc\n200\n", salida:"42\nTypeError: No es un número entero\nRangeError: Fuera de rango"},{entrada:"0\n-3\n4.5\n130\n", salida:"0\nRangeError: Fuera de rango\nTypeError: No es un número entero\n130", oculta:true}],
  pista:"const n = Number(texto); if (!Number.isInteger(n)) throw new TypeError(...); if (n < 0 || n > 130) throw new RangeError(...); return n;",
  solucion:`function parsearEdad(texto) {
  const n = Number(texto);
  if (texto.trim() === "" || !Number.isInteger(n)) throw new TypeError("No es un número entero");
  if (n < 0 || n > 130) throw new RangeError("Fuera de rango");
  return n;
}
for (const t of require("fs").readFileSync(0, "utf8").trim().split("\\n")) {
  try {
    console.log(parsearEdad(t));
  } catch (e) {
    console.log(\`\${e.name}: \${e.message}\`);
  }
}`,
  why:"Un tipo de error distinto para cada problema permite a quien llama reaccionar de forma distinta (mensaje de formato o de rango)."},
 {t:"codigo", p:"Envuelve el fallo de <code>JSON.parse</code> en un error propio con <code>cause</code> e imprime el mensaje y el nombre del error original",
  lenguaje:"js",
  plantilla:`function leerConfig(texto) {
  // si JSON.parse falla, lanza new Error("Configuración corrupta", { cause: e })
  return JSON.parse(texto);
}
try {
  leerConfig("{ puerto: 80 }");
} catch (e) {
  console.log(e.message);
  console.log(e.cause?.name);
}
`,
  pruebas:[{salida:"Configuración corrupta\nSyntaxError"}],
  pista:"try { return JSON.parse(texto); } catch (e) { throw new Error(\"Configuración corrupta\", { cause: e }); }",
  solucion:`function leerConfig(texto) {
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error("Configuración corrupta", { cause: e });
  }
}
try {
  leerConfig("{ puerto: 80 }");
} catch (e) {
  console.log(e.message);
  console.log(e.cause?.name);
}`,
  why:"El mensaje de arriba habla el idioma del negocio; la causa conserva el detalle técnico para los logs."},
 {t:"vf", p:"<code>try/catch</code> captura los errores que ocurren dentro de un <code>setTimeout</code> programado desde el try.",
  ok:false, why:"El callback se ejecuta más tarde, cuando el try ya terminó. Hay que capturar dentro del callback (o usar promesas y await)."}
]},

{
id:"js13n2",
titulo:"Errores propios y estrategias",
claves:["Clases de error propias con name y datos extra; distingue con instanceof","Errores esperados (validación, 404) frente a bugs: los primeros se gestionan, los segundos se reportan","Nunca un catch vacío; manejadores globales como última red"],
pasos:[
 {t:"info", eti:"Errores con significado", h:"Clases de error propias",
  c:`<div class="termbox">class ErrorApp extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = this.constructor.name;   // "ErrorValidacion", "ErrorNoEncontrado"...
  }
}
class ErrorValidacion extends ErrorApp {
  constructor(campo, mensaje) { super(mensaje); this.campo = campo; }
}
class ErrorNoEncontrado extends ErrorApp {}

try {
  guardar(formulario);
} catch (e) {
  if (e instanceof ErrorValidacion) marcarCampo(e.campo, e.message);
  else if (e instanceof ErrorNoEncontrado) mostrar404();
  else throw e;                         // no te tragues lo que no sabes gestionar
}</div>`},
 {t:"info", eti:"Estrategia", h:"Qué hacer con cada error",
  c:`<div class="dg"><div class="dg-tit">dos familias de errores</div>
<div class="dg-cols">
<div class="dg-col"><div class="dg-col-tit">esperados (operacionales)</div><div class="dg-pila">
<div class="dg-caja ok doble">validación, 404, sin red<small>se gestionan: mensaje al usuario, reintento</small></div></div></div>
<div class="dg-col"><div class="dg-col-tit">bugs (del programador)</div><div class="dg-pila">
<div class="dg-caja aviso doble">undefined.x, lógica rota<small>no se «arreglan» en caliente: se reportan y se corrigen</small></div></div></div>
</div></div>
     <div class="termbox">// última red: registrar lo que se escapa (y enviarlo a Sentry o similar)
window.addEventListener("error", e =&gt; reportar(e.error));
window.addEventListener("unhandledrejection", e =&gt; reportar(e.reason));
// Node
process.on("uncaughtException", e =&gt; { log(e); process.exit(1); });   // estado dudoso: reinicia
process.on("unhandledRejection", e =&gt; { log(e); process.exit(1); });</div>
     <p><code>AggregateError</code> agrupa varios errores en uno (lo usa <code>Promise.any</code>): su propiedad <code>errors</code> es un array.</p>`},
 {t:"par", p:"Empareja cada situación con la reacción adecuada",
  pares:[["El email del formulario no es válido","Mensaje junto al campo"],["La API responde 503","Reintentar con espera o avisar de que está caído"],["TypeError: cannot read properties of undefined","Reportarlo con su stack y corregir el código"],["Error que tu catch no reconoce","Relanzarlo con throw"]],
  why:"Tratar un bug como error esperado lo esconde; tratar un error esperado como bug asusta al usuario sin motivo."},
 {t:"opcion", p:"Ves en el código <code>try { procesarPago(); } catch (e) {}</code>. ¿Qué problema hay?",
  ops:["Ninguno: evita que la aplicación falle","Traga cualquier error: el pago puede fallar sin que nadie se entere ni quede rastro","Es más lento","No compila"],
  ok:1, why:"Como mínimo, registra el error. Mejor: gestiona los tipos que entiendes y relanza el resto."},
 {t:"codigo", p:"Crea <code>ErrorValidacion</code> (con <code>campo</code>) y <code>validar(usuario)</code>; imprime <code>campo: mensaje</code> para errores de validación y relanza el resto",
  lenguaje:"js",
  plantilla:`class ErrorValidacion extends Error {
  // constructor(campo, mensaje): name y campo
}
function validar(u) {
  // nombre obligatorio; edad >= 18
  return "ok";
}
for (const u of [{ nombre: "Ana", edad: 30 }, { nombre: "", edad: 30 }, { nombre: "Luis", edad: 15 }]) {
  try {
    console.log(validar(u));
  } catch (e) {
    if (e instanceof ErrorValidacion) console.log(\`\${e.campo}: \${e.message}\`);
    else throw e;
  }
}
`,
  pruebas:[{salida:"ok\nnombre: Es obligatorio\nedad: Debe ser mayor de edad"}],
  pista:"constructor(campo, mensaje) { super(mensaje); this.name = \"ErrorValidacion\"; this.campo = campo; }",
  solucion:`class ErrorValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.campo = campo;
  }
}
function validar(u) {
  if (!u.nombre) throw new ErrorValidacion("nombre", "Es obligatorio");
  if (u.edad < 18) throw new ErrorValidacion("edad", "Debe ser mayor de edad");
  return "ok";
}
for (const u of [{ nombre: "Ana", edad: 30 }, { nombre: "", edad: 30 }, { nombre: "Luis", edad: 15 }]) {
  try {
    console.log(validar(u));
  } catch (e) {
    if (e instanceof ErrorValidacion) console.log(\`\${e.campo}: \${e.message}\`);
    else throw e;
  }
}`,
  why:"El dato extra (campo) viaja con el error y permite a la interfaz marcar exactamente dónde está el problema."},
 {t:"codigo", p:"Sin excepciones: escribe <code>intentar(fn)</code>, que devuelva <code>{ ok: true, valor }</code> o <code>{ ok: false, error }</code>",
  lenguaje:"js",
  c:`<p>Es el patrón «Result», habitual en Go o Rust, útil cuando el fallo es un resultado normal y no quieres try/catch en cada llamada.</p>`,
  plantilla:`function intentar(fn) {
  // completa
}
const a = intentar(() => JSON.parse("[1,2]"));
const b = intentar(() => JSON.parse("[1,"));
console.log(a.ok, a.valor?.length);
console.log(b.ok, b.error?.name);
`,
  pruebas:[{salida:"true 2\nfalse SyntaxError"}],
  pista:"try { return { ok: true, valor: fn() }; } catch (error) { return { ok: false, error }; }",
  solucion:`function intentar(fn) {
  try {
    return { ok: true, valor: fn() };
  } catch (error) {
    return { ok: false, error };
  }
}
const a = intentar(() => JSON.parse("[1,2]"));
const b = intentar(() => JSON.parse("[1,"));
console.log(a.ok, a.valor?.length);
console.log(b.ok, b.error?.name);`,
  why:"El que llama está obligado a mirar ok antes de usar valor: el fallo deja de ser invisible."},
 {t:"vf", p:"En Node, tras un <code>uncaughtException</code> lo recomendado es registrar el error y reiniciar el proceso.",
  ok:true, why:"El estado de la aplicación puede haber quedado inconsistente. Un gestor de procesos (systemd, Docker, Kubernetes) lo vuelve a levantar."}
]},

{
id:"js13n3",
titulo:"Depurar como un profesional",
claves:["Breakpoints (también condicionales y logpoints) y la sentencia debugger","console.table, console.trace, console.group, console.time y console.assert","node --inspect para depurar Node con las DevTools; source maps para ver tu código original"],
pasos:[
 {t:"info", eti:"Herramientas", h:"DevTools y consola",
  c:`<ul><li><b>Sources</b>: clic en el número de línea para un <b>breakpoint</b>. Clic derecho: <b>condicional</b> (<code>pedido.id === 42</code>) o <b>logpoint</b> (imprime sin tocar el código). La sentencia <code>debugger;</code> pausa si las DevTools están abiertas.</li>
     <li>En pausa: <b>Scope</b> (variables y closures), <b>Call Stack</b> (quién llamó a quién), paso a paso (entrar, saltar, salir).</li>
     <li><b>Network</b>: cada petición, estado, cabeceras, cuerpo y tiempo. <b>Performance</b>: qué bloquea el hilo.</li>
     <li>«Pause on exceptions»: se detiene justo donde se lanza el error.</li></ul>
     <div class="termbox">console.table(usuarios);              // array de objetos como tabla
console.group("Pedido 42"); ...; console.groupEnd();
console.time("render"); render(); console.timeEnd("render");   // render: 12.3 ms
console.trace("¿quién me llama?");    // imprime la pila
console.assert(total &gt;= 0, "total negativo", total);   // solo imprime si falla</div>`},
 {t:"info", eti:"Node y producción", h:"Depurar en Node y con código compilado",
  c:`<div class="termbox">node --inspect-brk app.js     # pausa en la primera línea; abre chrome://inspect
node --watch app.js           # reinicia al guardar
node --enable-source-maps dist/app.js   # stacks con tus ficheros .ts originales</div>
     <p>El código que llega al navegador suele estar empaquetado y minificado. Los <b>source maps</b> (<code>.map</code>) permiten a las DevTools y a herramientas como Sentry mostrarte el fichero y la línea originales.</p>
     <div class="dg"><div class="dg-tit">método para un bug que no entiendes</div>
<div class="dg-vert">
<div class="dg-caja">1. reprodúcelo de forma fiable</div>
<div class="dg-caja">2. lee el error completo y el stack</div>
<div class="dg-caja">3. formula una hipótesis y compruébala (breakpoint, log)</div>
<div class="dg-caja">4. reduce el caso hasta lo mínimo</div>
<div class="dg-caja ok">5. corrige y añade una prueba que lo cubra</div>
</div></div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["Breakpoint condicional","Pausar solo cuando se cumple una condición"],["Logpoint","Imprimir un valor sin modificar el código"],["console.trace","Ver qué cadena de llamadas llegó hasta aquí"],["Pestaña Network","Ver peticiones HTTP, estados y cuerpos"],["Source map","Traducir el código minificado a tu código original"]],
  why:"Un breakpoint condicional ahorra pulsar «continuar» 500 veces dentro de un bucle."},
 {t:"opcion", p:"Un error en producción muestra <code>at a.b (main.3f9c1.js:1:48213)</code>. ¿Qué te falta?",
  ops:["Nada, se entiende bien","Los source maps: sin ellos el stack apunta al código minificado","Un breakpoint","Otra versión de Node"],
  ok:1, why:"Súbelos a tu herramienta de errores (sin publicarlos si no quieres exponer el código) y el stack se verá con tus ficheros y líneas."},
 {t:"orden", p:"Ordena el método para atacar un bug",
  items:["Reproducirlo de forma fiable","Leer el mensaje y el stack completos","Formular una hipótesis y comprobarla","Reducir el caso al mínimo","Corregir y añadir una prueba que lo cubra"],
  why:"Saltar directamente a cambiar código «a ver si se arregla» suele crear dos bugs nuevos."},
 {t:"codigo", p:"Este código debería imprimir la media de las notas aprobadas (≥ 5), pero da un resultado incorrecto. Encuentra y corrige los dos fallos",
  lenguaje:"js",
  plantilla:`const notas = [4, 7, 5, 9, 3];
let suma = 0, n = 0;
for (let i = 1; i < notas.length; i++) {
  if (notas[i] > 5) { suma += notas[i]; n++; }
}
console.log(suma / n);
`,
  pruebas:[{salida:"7"}],
  pista:"Mira el índice inicial del bucle y el operador de la condición.",
  solucion:`const notas = [4, 7, 5, 9, 3];
let suma = 0, n = 0;
for (let i = 0; i < notas.length; i++) {
  if (notas[i] >= 5) { suma += notas[i]; n++; }
}
console.log(suma / n);`,
  why:"Dos clásicos: empezar en 1 (se salta el primero) y &gt; en lugar de &gt;= (excluye el 5). Aprobadas: 7, 5 y 9; media 7."},
 {t:"vf", p:"La sentencia <code>debugger;</code> no tiene efecto si las herramientas de desarrollo están cerradas.",
  ok:true, why:"Solo pausa con un depurador conectado. Aun así, no la dejes en el código que subes: un linter lo detecta (regla no-debugger)."}
]}

]});
