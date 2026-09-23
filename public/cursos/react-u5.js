window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Efectos y refs",
resumen: "useEffect para sincronizar con sistemas externos, dependencias y limpieza, useEffectEvent, cuándo no hace falta un efecto, reglas de los hooks, useRef y manipular el DOM",
nivel: "Intermedio",
color: "#4fc8ea",
lecciones: [

/* =============== U5 L1 =============== */
{
id:"re4l2",
titulo:"useEffect",
claves:["useEffect sincroniza el componente con algo externo (red, suscripciones, APIs del navegador, widgets)","Se ejecuta después de pintar; el array de dependencias decide cuándo se repite","La función de limpieza deshace lo que hizo el efecto: antes de repetirlo y al desmontar"],
pasos:[
 {t:"info", eti:"Sincronizar", h:"Efectos",
  c:`<div class="termbox">useEffect(() =&gt; {
  document.title = \`(\${pendientes}) Tareas\`;
}, [pendientes]);                        // se ejecuta cuando cambia pendientes

useEffect(() =&gt; {
  const id = setInterval(() =&gt; setAhora(new Date()), 1000);
  return () =&gt; clearInterval(id);        // limpieza al desmontar o antes de repetir
}, []);                                  // [] = solo al montar

useEffect(() =&gt; {
  const conexion = crearConexion(servidor, sala);
  conexion.conectar();
  return () =&gt; conexion.desconectar();
}, [servidor, sala]);                    // al cambiar de sala: desconecta la vieja y conecta la nueva</div>
     <p>Piensa en un efecto como una <b>sincronización</b>, no como un «ciclo de vida»: «mientras este componente esté en pantalla con la sala X, debe haber una conexión abierta a la sala X». React lo arranca después de pintar, lo para cuando ya no aplica y lo vuelve a arrancar con los valores nuevos.</p>
     <div class="dg"><div class="dg-tit">vida de un efecto con [sala]</div><div class="dg-flujo"><div class="dg-caja ok">montar<small>conectar(general)</small></div><div class="dg-caja">sala cambia<small>desconectar(general) · conectar(viajes)</small></div><div class="dg-caja">render sin cambios<small>nada</small></div><div class="dg-caja aviso">desmontar<small>desconectar(viajes)</small></div></div></div>`},
 {t:"par", p:"Empareja cada array de dependencias con cuándo se ejecuta el efecto",
  pares:[["Sin array","Después de cada render"],["[]","Solo al montar el componente"],["[id]","Al montar y cada vez que cambia id"],["return () => ...","Limpieza antes de repetir y al desmontar"]],
  why:"Olvidar una dependencia deja el efecto usando valores viejos; el linter de React Hooks lo detecta."},
 {t:"opcion", p:"Tu efecto hace <code>setDatos(...)</code> y tiene <code>datos</code> en sus dependencias, sin ninguna condición. ¿Qué pasa?",
  ops:["Nada","Bucle infinito: el efecto cambia datos, lo que vuelve a ejecutar el efecto","Se ejecuta una vez","Error de compilación"],
  ok:1, why:"Un efecto no debe depender de lo que él mismo actualiza sin una condición que lo detenga. Casi siempre significa que ese efecto sobra."},
 {t:"vf", p:"En desarrollo con StrictMode, React monta, desmonta y vuelve a montar los componentes para comprobar que tus efectos se limpian bien.",
  ok:true, why:"Por eso ves la conexión abrirse, cerrarse y abrirse otra vez en desarrollo. Si tu efecto se rompe con eso, le falta la limpieza."},
 {t:"hueco", p:"Completa el efecto para que escuche el tamaño de la ventana y deje de hacerlo al desmontar",
  tpl:"useEffect(() => {\n  const f = () => setAncho(window.innerWidth);\n  window.addEventListener(\"resize\", f);\n  ___ () => window.___(\"resize\", f);\n}, ___);",
  banco:["return","removeEventListener","[]","[f]","addEventListener","await"], sol:["return","removeEventListener","[]"],
  why:"Sin la limpieza, cada montaje añade un listener más que nunca se quita: una fuga de memoria clásica."},
 {t:"codigo", p:"Simula la vida de un efecto de conexión con dependencias <code>[sala]</code> e imprime cada conectar y desconectar",
  lenguaje:"js",
  c:`<p>La primera línea es <code>prod</code> o <code>strict</code>. Después, cada línea es un render con el valor de <code>sala</code>, o <code>desmontar</code>. Reglas: al montar, <code>conectar SALA</code> (en <code>strict</code>, cada montaje hace además <code>desconectar SALA</code> y <code>conectar SALA</code>); si la sala cambia, <code>desconectar VIEJA</code> y <code>conectar NUEVA</code>; si no cambia, nada; al desmontar, <code>desconectar SALA</code>. Tras desmontar, el siguiente render vuelve a montar.</p>`,
  plantilla:"const [modo, ...renders] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nlet actual = null;   // sala conectada, o null si no está montado\nfor (const r of renders) {\n  // tu código\n}\n",
  pruebas:[{entrada:"prod\ngeneral\ngeneral\nviajes\ndesmontar\n", salida:"conectar general\ndesconectar general\nconectar viajes\ndesconectar viajes"},{entrada:"strict\ngeneral\nviajes\n", salida:"conectar general\ndesconectar general\nconectar general\ndesconectar general\nconectar viajes"},{entrada:"prod\na\ndesmontar\nb\nb\n", salida:"conectar a\ndesconectar a\nconectar b", oculta:true}],
  pista:"Tres casos: r === \"desmontar\"; actual === null (montaje); actual !== r (cambio de dependencia).",
  solucion:"const [modo, ...renders] = require(\"node:fs\").readFileSync(0, \"utf8\").trim().split(\"\\n\");\nlet actual = null;\nfor (const r of renders) {\n  if (r === \"desmontar\") {\n    if (actual !== null) console.log(\"desconectar \" + actual);\n    actual = null;\n  } else if (actual === null) {\n    console.log(\"conectar \" + r);\n    if (modo === \"strict\") { console.log(\"desconectar \" + r); console.log(\"conectar \" + r); }\n    actual = r;\n  } else if (actual !== r) {\n    console.log(\"desconectar \" + actual);\n    console.log(\"conectar \" + r);\n    actual = r;\n  }\n}\n",
  why:"Si tu efecto es una sincronización bien escrita, da igual cuántas veces se conecte y desconecte: el estado final es el correcto. Eso es lo que comprueba StrictMode."}
]},

/* =============== U5 L2 =============== */
{
id:"re5n1",
titulo:"Dependencias, carreras y useEffectEvent",
claves:["Todo valor reactivo que lee el efecto (props, estado, lo calculado a partir de ellos) va en las dependencias","Objetos y funciones creados en el render cambian en cada render: créalos dentro del efecto","useEffectEvent (React 19.2) lee el último valor sin convertirlo en dependencia; AbortController evita carreras"],
pasos:[
 {t:"info", eti:"No mientas al linter", h:"Qué va en las dependencias",
  c:`<p>Las dependencias no se «eligen»: son <b>todos los valores reactivos</b> que el efecto lee (props, estado, variables calculadas en el cuerpo del componente). El plugin <code>eslint-plugin-react-hooks</code> las comprueba. Si una dependencia hace que el efecto se repita demasiado, no la quites: <b>cambia el código</b> para que no la necesite.</p>
     <div class="termbox">// MAL: opciones es un objeto nuevo en cada render → el efecto se repite siempre
const opciones = { servidor, sala };
useEffect(() =&gt; { const c = crearConexion(opciones); c.conectar(); return () =&gt; c.desconectar(); },
  [opciones]);

// BIEN: créalo dentro del efecto y depende de primitivos
useEffect(() =&gt; {
  const c = crearConexion({ servidor, sala }); c.conectar(); return () =&gt; c.desconectar();
}, [servidor, sala]);

// BIEN: actualización con función para no depender del estado
useEffect(() =&gt; {
  const id = setInterval(() =&gt; setCuenta(c =&gt; c + 1), 1000);
  return () =&gt; clearInterval(id);
}, []);</div>`},
 {t:"info", eti:"Leer sin reaccionar", h:"useEffectEvent y condiciones de carrera",
  c:`<div class="termbox">import { useEffect, useEffectEvent } from "react";

function Sala({ sala, tema }: Props) {
  // lógica "de evento": lee el tema actual, pero cambiar de tema no debe reconectar
  const alConectar = useEffectEvent(() =&gt; avisar("Conectado", tema));

  useEffect(() =&gt; {
    const c = crearConexion(sala);
    c.on("conectado", () =&gt; alConectar());
    c.conectar();
    return () =&gt; c.desconectar();
  }, [sala]);                               // tema no es dependencia
}

// carrera: la respuesta de "rea" llega después que la de "react"
useEffect(() =&gt; {
  const control = new AbortController();
  fetch(\`/api/buscar?q=\${q}\`, { signal: control.signal })
    .then(r =&gt; r.json()).then(setResultados)
    .catch(e =&gt; { if (e.name !== "AbortError") setError(e); });
  return () =&gt; control.abort();             // la petición vieja se cancela
}, [q]);</div>
     <p><code>useEffectEvent</code> es estable desde React 19.2: la función que devuelve siempre ve los valores más recientes y no se pone en las dependencias. Solo se llama desde dentro de efectos.</p>`},
 {t:"opcion", p:"Un efecto con dependencias <code>[filtros]</code> se ejecuta en cada render, aunque el usuario no toque nada. <code>filtros</code> se define como <code>const filtros = { estado, orden }</code> en el componente. ¿Qué pasa?",
  ops:["Un bug de React","filtros es un objeto nuevo en cada render; Object.is lo ve distinto. Usa [estado, orden] o crea el objeto dentro del efecto","Falta una key","Hay que usar useRef"],
  ok:1, why:"React compara dependencias con Object.is: dos objetos con el mismo contenido son distintos."},
 {t:"opcion", p:"Un contador con <code>setInterval(() =&gt; setN(n + 1), 1000)</code> en un efecto con <code>[]</code> se queda en 1. ¿Por qué?",
  ops:["setInterval no funciona en React","El callback captura el n del primer render (closure obsoleto): siempre calcula 0 + 1. Usa setN(p =&gt; p + 1)","Falta la limpieza","StrictMode lo bloquea"],
  ok:1, why:"Los closures obsoletos (stale closures) son el error clásico con hooks. La forma con función no necesita leer n."},
 {t:"opcion", p:"Un buscador a veces muestra los resultados de una búsqueda anterior. El efecto hace fetch con <code>q</code> y <code>setResultados</code>. ¿Causa y solución?",
  ops:["El servidor es lento; poner un spinner","Condición de carrera: una respuesta vieja llega después de la nueva. Cancela con AbortController en la limpieza (o usa TanStack Query)","Falta await","Hay que quitar q de las dependencias"],
  ok:1, why:"La limpieza se ejecuta antes de la siguiente ejecución del efecto: justo el momento de descartar la petición anterior."},
 {t:"par", p:"Empareja cada problema de dependencias con su solución",
  pares:[["Objeto creado en el render como dependencia","Crearlo dentro del efecto"],["Leer el estado solo para calcular el siguiente","Actualización con función: setX(p => ...)"],["Leer un valor reciente sin querer reconectar","useEffectEvent"],["Función del componente usada en el efecto","Moverla dentro del efecto o fuera del componente"],["Respuestas de red desordenadas","AbortController o una bandera ignorar en la limpieza"]],
  why:"En todos los casos se cambia el código para no necesitar la dependencia, en vez de engañar al linter."},
 {t:"vf", p:"Si el linter pide una dependencia que provoca repeticiones, lo correcto es desactivar la regla con un comentario.",
  ok:false, why:"Silenciar el linter produce errores de valores viejos muy difíciles de encontrar. Reestructura el efecto para que no necesite esa dependencia."}
]},

/* =============== U5 L3 =============== */
{
id:"re4l3",
titulo:"Cuándo no usar efectos",
claves:["Los datos derivados se calculan durante el render, no en un efecto","Las acciones del usuario van en los manejadores de eventos, no en efectos que «reaccionan» a un estado","Reiniciar estado con key; pedir datos con una librería (TanStack Query) o el framework"],
pasos:[
 {t:"info", eti:"Menos efectos", h:"Errores comunes",
  c:`<div class="termbox">// MAL: estado derivado sincronizado con un efecto (un render de más con datos viejos)
const [total, setTotal] = useState(0);
useEffect(() =&gt; { setTotal(items.reduce((s, i) =&gt; s + i.precio, 0)); }, [items]);

// BIEN: se calcula al renderizar
const total = items.reduce((s, i) =&gt; s + i.precio, 0);

// MAL: reaccionar a un envío con un efecto
useEffect(() =&gt; { if (enviado) api.guardar(form); }, [enviado]);

// BIEN: en el manejador, que es donde ocurre la acción
function handleSubmit() { api.guardar(form); }

// MAL: vaciar el comentario cuando cambia el usuario
useEffect(() =&gt; { setComentario(""); }, [usuarioId]);

// BIEN: una key distinta crea otra instancia
&lt;Perfil key={usuarioId} usuarioId={usuarioId} /&gt;</div>
     <p>Un efecto es para sincronizar con sistemas <b>externos</b> a React. Si no hay nada externo, probablemente no necesitas un efecto.</p>`},
 {t:"info", eti:"La pregunta clave", h:"¿Por qué se ejecuta este código?",
  c:`<div class="dg"><div class="dg-tit">dónde va cada código</div><div class="dg-cols">
       <div class="dg-col"><div class="dg-col-tit">Porque el usuario hizo algo</div><div class="dg-caja acento doble">manejador de evento<small>comprar, enviar, borrar, notificar</small></div></div>
       <div class="dg-col"><div class="dg-col-tit">Porque se ve en pantalla</div><div class="dg-caja acento doble">efecto<small>conectar, suscribirse, registrar una visita</small></div></div>
       <div class="dg-col"><div class="dg-col-tit">Porque se puede calcular</div><div class="dg-caja ok doble">render<small>totales, filtros, formatos</small></div></div>
     </div></div>
     <p>Ejemplo: una notificación «Añadido al carrito». Si la pones en un efecto que observa el carrito, saltará también al recargar la página con el carrito lleno. Va en el manejador del botón.</p>
     <p>Para <b>pedir datos</b>, un efecto funciona, pero en una app real tendrías que gestionar carga, errores, caché, carreras, reintentos y peticiones en cascada. Por eso la documentación recomienda el framework o librerías como TanStack Query.</p>`},
 {t:"par", p:"Empareja cada necesidad con dónde resolverla",
  pares:[["Total de un carrito","Calcularlo durante el render"],["Enviar un formulario","En el manejador onSubmit o en una acción"],["Suscribirse al tamaño de la ventana","useEffect con limpieza"],["Pedir datos de una API con caché y reintentos","TanStack Query (o el framework)"],["Cálculo costoso a partir de props","useMemo"],["Reiniciar un formulario al cambiar de elemento","Una key distinta"]],
  why:"«You might not need an effect» es una de las guías más útiles de la documentación de React."},
 {t:"opcion", p:"¿Qué problema tiene pedir datos en un useEffect «a mano» en una app grande?",
  ops:["Ninguno","Hay que gestionar tú carga, errores, caché, cancelación, condiciones de carrera y reintentos en cada componente","Es imposible","Es más rápido"],
  ok:1, why:"Por eso existen TanStack Query, SWR o los loaders de los frameworks."},
 {t:"opcion", p:"Quieres mostrar «Producto añadido» cuando el usuario pulsa «Comprar». ¿Dónde va?",
  ops:["En un useEffect que observa el carrito","En el manejador del clic del botón Comprar","En el render","En un useLayoutEffect"],
  ok:1, why:"Lo provoca una interacción concreta, no el hecho de mostrarse. En un efecto saltaría también al recargar."},
 {t:"opcion", p:"Un componente hace <code>useEffect(() =&gt; { setVisibles(tareas.filter(t =&gt; !t.hecha)); }, [tareas]);</code>. ¿Qué harías?",
  ops:["Nada, está bien","Quitar el estado y el efecto: const visibles = tareas.filter(t =&gt; !t.hecha) (con useMemo si fuera costoso)","Añadir más dependencias","Pasarlo a useLayoutEffect"],
  ok:1, why:"El efecto provoca un render extra con la lista vieja y otro con la nueva. Calcularlo es más simple y más rápido."},
 {t:"vf", p:"Registrar una visita a la página en analítica cuando se muestra un componente es un uso razonable de useEffect.",
  ok:true, why:"Se ejecuta porque el componente se mostró, no por un clic. En desarrollo se enviará dos veces por StrictMode, y está bien: en producción no."}
]},

/* =============== U5 L4 =============== */
{
id:"re5l1",
titulo:"Reglas de los hooks y useRef",
claves:["Los hooks se llaman siempre en el mismo orden: nunca dentro de if, bucles, tras un return temprano o en funciones anidadas","useRef guarda un valor mutable que persiste entre renders sin provocarlos","No leas ni escribas ref.current durante el render: solo en manejadores y efectos"],
pasos:[
 {t:"info", eti:"Las reglas", h:"Reglas de los hooks",
  c:`<ul><li>Llama a los hooks solo en el <b>nivel superior</b> del componente (o de otro hook).</li>
     <li>Nunca dentro de condiciones, bucles o después de un <code>return</code> temprano.</li>
     <li>Solo desde componentes o hooks propios (funciones que empiezan por <code>use</code>).</li></ul>
     <p>React no sabe los nombres de tus estados: los identifica por el <b>orden</b> en que se llaman los hooks. Si ese orden cambia entre renders, el segundo <code>useState</code> recibe el valor del primero.</p>
     <div class="dg dg-tabla-caja"><div class="dg-tit">cómo ve react los hooks de un componente</div><table class="dg-tabla"><thead><tr><th>Posición</th><th>Render 1</th><th>Render 2 con un if que salta el primero</th></tr></thead><tbody>
       <tr><td>1</td><td>useState → nombre</td><td>useState → apellido (¡recibe nombre!)</td></tr>
       <tr><td>2</td><td>useState → apellido</td><td>useEffect (¡esperaba un useState!)</td></tr>
       <tr><td>3</td><td>useEffect</td><td>—</td></tr>
     </tbody></table></div>
     <p>La excepción es <code>use()</code> (React 19), que sí puede llamarse dentro de condiciones.</p>`},
 {t:"info", eti:"Referencias", h:"useRef",
  c:`<div class="termbox">function Cronometro() {
  const [inicio, setInicio] = useState&lt;number | null&gt;(null);
  const [ahora, setAhora] = useState&lt;number | null&gt;(null);
  const intervalo = useRef&lt;number | null&gt;(null);     // no se pinta: ref

  function empezar() {
    setInicio(Date.now()); setAhora(Date.now());
    intervalo.current = window.setInterval(() =&gt; setAhora(Date.now()), 10);
  }
  function parar() {
    if (intervalo.current) clearInterval(intervalo.current);
  }
  const segundos = inicio &amp;&amp; ahora ? (ahora - inicio) / 1000 : 0;
  return (&lt;&gt;&lt;p&gt;{segundos.toFixed(2)} s&lt;/p&gt;
    &lt;button onClick={empezar}&gt;Empezar&lt;/button&gt;&lt;button onClick={parar}&gt;Parar&lt;/button&gt;&lt;/&gt;);
}</div>
     <p>Un ref es una «caja» <code>{ current }</code> que React mantiene entre renders. Cambiar <code>.current</code> no provoca render. Regla: si al cambiar debe verse en pantalla, <b>estado</b>; si no, <b>ref</b> (ids de temporizadores, instancias de librerías, el valor anterior). No leas ni escribas <code>ref.current</code> durante el render (salvo inicializarlo): el resultado dejaría de ser predecible.</p>`},
 {t:"par", p:"Empareja cada necesidad con la herramienta",
  pares:[["Texto que se muestra en pantalla","useState: al cambiar debe verse"],["Id de un setInterval para poder cancelarlo","useRef: se guarda sin provocar render"],["Acceder a un input para darle el foco","useRef con el atributo ref"],["Lógica de estado con muchas transiciones","useReducer"],["Instancia de un mapa de Leaflet","useRef"]],
  why:"Regla: si al cambiar debe verse en pantalla, estado; si no, ref."},
 {t:"opcion", p:"¿Qué problema tiene <code>if (usuario) { const [x, setX] = useState(0); }</code>?",
  ops:["Ninguno","Viola las reglas de los hooks: si usuario cambia, el orden de los hooks cambia y el estado se corrompe","Es más lento","useState no admite 0"],
  ok:1, why:"El plugin eslint-plugin-react-hooks lo detecta. Llama al hook siempre y usa la condición después."},
 {t:"opcion", p:"¿Qué se renderiza tras pulsar tres veces <code>&lt;button onClick={() =&gt; { ref.current++; }}&gt;{ref.current}&lt;/button&gt;</code> (ref empieza en 0)?",
  ops:["3","0: cambiar un ref no provoca render, así que la pantalla no se actualiza","1","Un error"],
  ok:1, why:"El valor interno es 3, pero nada pidió a React volver a pintar. Por eso lo que se muestra debe ir en estado."},
 {t:"hueco", p:"Completa para guardar el id del temporizador sin provocar renders",
  tpl:"const id = ___(null);\nfunction empezar() {\n  id.___ = setInterval(tic, 1000);\n}",
  banco:["useRef","current","useState","value","ref"], sol:["useRef","current"],
  why:"useRef devuelve siempre el mismo objeto; su propiedad current es mutable."},
 {t:"vf", p:"Los hooks propios también deben cumplir las reglas de los hooks.",
  ok:true, why:"Un hook propio es una función que llama a otros hooks: si los llamara de forma condicional, rompería el orden del componente que lo usa."}
]},

/* =============== U5 L5 =============== */
{
id:"re5n2",
titulo:"Manipular el DOM con refs",
claves:["ref={miRef} da acceso al nodo del DOM tras el commit: foco, scroll, medidas, librerías externas","En React 19 ref es una prop normal en componentes de función (forwardRef ya no hace falta)","Refs con callback (con limpieza en React 19), useImperativeHandle para exponer una API limitada y flushSync para leer el DOM ya actualizado"],
pasos:[
 {t:"info", eti:"Tocar el DOM", h:"Refs a nodos",
  c:`<div class="termbox">function Buscador() {
  const input = useRef&lt;HTMLInputElement&gt;(null);
  return (
    &lt;&gt;
      &lt;input ref={input} /&gt;
      &lt;button onClick={() =&gt; input.current?.focus()}&gt;Buscar&lt;/button&gt;
    &lt;/&gt;
  );
}

// React 19: ref es una prop más
function CampoTexto({ etiqueta, ref, ...resto }: { etiqueta: string; ref?: React.Ref&lt;HTMLInputElement&gt; }) {
  return &lt;label&gt;{etiqueta}&lt;input ref={ref} {...resto} /&gt;&lt;/label&gt;;
}
&lt;CampoTexto etiqueta="Email" ref={emailRef} /&gt;</div>
     <p>React rellena <code>ref.current</code> en el <b>commit</b>, después de crear el nodo, y lo pone a <code>null</code> al quitarlo. Por eso durante el primer render aún es <code>null</code>: úsalo en manejadores o efectos. Usos legítimos: foco, scroll, medir tamaños, reproducir un vídeo, integrar librerías que no son de React (mapas, gráficos, editores).</p>
     <div class="nota ojo"><b class="tit">No modifiques lo que React gestiona</b>Borrar o mover con el DOM un nodo que React pinta deja a React con un árbol que no coincide con la realidad y acaba en errores. Toca solo lo que React no controla (foco, scroll, nodos vacíos que tú rellenas).</div>`},
 {t:"info", eti:"Casos avanzados", h:"Callback refs, useImperativeHandle y flushSync",
  c:`<div class="termbox">// ref con callback: útil para listas o para observar un nodo (con limpieza en React 19)
&lt;div ref={nodo =&gt; {
  const obs = new ResizeObserver(() =&gt; medir(nodo));
  obs.observe(nodo);
  return () =&gt; obs.disconnect();
}} /&gt;

// exponer solo lo necesario al padre
function Video({ src, ref }: Props) {
  const v = useRef&lt;HTMLVideoElement&gt;(null);
  useImperativeHandle(ref, () =&gt; ({ play: () =&gt; v.current?.play(), pause: () =&gt; v.current?.pause() }), []);
  return &lt;video ref={v} src={src} /&gt;;
}

// hacer scroll al elemento recién añadido
function anadir(texto: string) {
  flushSync(() =&gt; setMensajes(m =&gt; [...m, texto]));    // fuerza el commit ahora
  lista.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
}</div>
     <p>Sin <code>flushSync</code>, el <code>scrollIntoView</code> se ejecutaría antes de que el nuevo mensaje exista en el DOM (el estado se aplica después). Úsalo con moderación: se salta el agrupamiento de actualizaciones.</p>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["ref={miRef}","Obtener el nodo del DOM de un elemento"],["ref como prop (React 19)","Pasar un ref a un componente propio sin forwardRef"],["Callback ref","Ejecutar código cuando un nodo aparece o desaparece"],["useImperativeHandle","Exponer al padre solo algunos métodos"],["flushSync","Aplicar un cambio de estado al DOM antes de seguir"]],
  why:"forwardRef sigue funcionando en React 19, pero ya no es necesario y se retirará en el futuro."},
 {t:"opcion", p:"Haces <code>const r = useRef(null); console.log(r.current.offsetWidth);</code> en el cuerpo del componente y falla en el primer render. ¿Por qué?",
  ops:["offsetWidth no existe","En el primer render el nodo aún no existe: React asigna current en el commit. Mide en un efecto (o useLayoutEffect si debe ser antes de pintar)","Falta un key","Falta flushSync"],
  ok:1, why:"Render = calcular; el DOM existe después. useLayoutEffect se usa cuando la medida decide lo que se pinta (tooltips) para evitar un parpadeo."},
 {t:"opcion", p:"Un chat añade un mensaje con <code>setMensajes</code> y justo después hace scroll al último nodo, pero siempre se queda uno por detrás. ¿Qué falta?",
  ops:["Un useMemo","Envolver el setMensajes en flushSync para que el DOM se actualice antes del scroll (o hacer el scroll en un efecto)","Una key en la lista","Un await"],
  ok:1, why:"El set solo programa el render. flushSync lo aplica de inmediato."},
 {t:"hueco", p:"Completa para dar el foco al input cuando se monte el componente",
  tpl:"const campo = useRef(null);\n___(() => {\n  campo.current.___();\n}, []);\nreturn <input ref={___} />;",
  banco:["useEffect","focus","campo","useMemo","select","current"], sol:["useEffect","focus","campo"],
  why:"Para un caso tan simple también vale el atributo autoFocus."},
 {t:"vf", p:"En React 19 un componente de función puede recibir <code>ref</code> como prop sin envolverse en <code>forwardRef</code>.",
  ok:true, why:"Es una de las novedades de React 19 que más código simplifica."}
]}

]});
