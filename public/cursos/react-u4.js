window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Formularios y efectos",
resumen: "Inputs controlados, envío y validación de formularios, useEffect con dependencias y limpieza, y cuándo no usar efectos",
nivel: "Intermedio",
color: "#4fc8ea",
lecciones: [

{
id:"re4l1",
titulo:"Formularios controlados",
claves:["Un input controlado toma su value del estado y lo actualiza con onChange","onSubmit en el form con preventDefault","Valida antes de enviar y muestra errores junto a cada campo"],
pasos:[
 {t:"info", eti:"Formularios", h:"Inputs controlados",
  c:`<div class="termbox">function FormularioTarea({ alCrear }: { alCrear: (t: NuevaTarea) =&gt; void }) {
  const [titulo, setTitulo] = useState("");
  const [error, setError] = useState&lt;string | null&gt;(null);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (titulo.trim().length === 0) return setError("El título es obligatorio");
    alCrear({ titulo: titulo.trim() });
    setTitulo("");
    setError(null);
  }

  return (
    &lt;form onSubmit={enviar}&gt;
      &lt;label htmlFor="titulo"&gt;Tarea&lt;/label&gt;
      &lt;input id="titulo" value={titulo} onChange={e =&gt; setTitulo(e.target.value)}
             aria-invalid={!!error} /&gt;
      {error &amp;&amp; &lt;p role="alert"&gt;{error}&lt;/p&gt;}
      &lt;button type="submit"&gt;Añadir&lt;/button&gt;
    &lt;/form&gt;
  );
}</div>`},
 {t:"par", p:"Empareja cada parte con su función",
  pares:[["value={titulo}","El input muestra lo que hay en el estado"],["onChange={e => setTitulo(e.target.value)}","Cada tecla actualiza el estado"],["onSubmit={enviar}","Se ejecuta al pulsar el botón o Enter"],["e.preventDefault()","Evita que el navegador recargue la página"],["htmlFor y id","Asocian la etiqueta al campo (accesibilidad)"]],
  why:"Para formularios grandes, librerías como React Hook Form con zod ahorran mucho código."},
 {t:"opcion", p:"Pones <code>value={nombre}</code> en un input pero olvidas <code>onChange</code>. ¿Qué pasa?",
  ops:["Funciona normal","El campo queda de solo lectura: no se puede escribir, y React avisa en consola","Se borra al escribir","Error de compilación"],
  ok:1, why:"Controlado sin onChange = el valor siempre es el del estado, que nunca cambia."},
 {t:"vf", p:"Validar en el formulario de React hace innecesaria la validación en la API.",
  ok:false, why:"La validación del frontend es para la experiencia del usuario; la API debe validar siempre."}
]},

{
id:"re4l2",
titulo:"useEffect",
claves:["useEffect sincroniza el componente con algo externo (red, suscripciones, APIs del navegador)","El array de dependencias decide cuándo se vuelve a ejecutar","La función de limpieza deshace lo que hizo el efecto"],
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
  const controlador = new AbortController();
  fetch(\`/api/tareas?q=\${busqueda}\`, { signal: controlador.signal })
    .then(r =&gt; r.json()).then(setResultados)
    .catch(e =&gt; { if (e.name !== "AbortError") setError(e); });
  return () =&gt; controlador.abort();      // cancela la peticion anterior
}, [busqueda]);</div>`},
 {t:"par", p:"Empareja cada array de dependencias con cuándo se ejecuta el efecto",
  pares:[["Sin array","Después de cada render"],["[]","Solo al montar el componente"],["[id]","Al montar y cada vez que cambia id"],["return () => ...","Limpieza antes de repetir y al desmontar"]],
  why:"Olvidar una dependencia deja el efecto usando valores viejos; el linter de React Hooks lo detecta."},
 {t:"opcion", p:"Tu efecto hace <code>setDatos(...)</code> y tiene <code>datos</code> en sus dependencias, y además crea un objeto nuevo cada vez. ¿Qué pasa?",
  ops:["Nada","Bucle infinito: el efecto cambia datos, lo que vuelve a ejecutar el efecto","Se ejecuta una vez","Error de compilación"],
  ok:1, why:"Un efecto no debe depender de lo que él mismo actualiza sin una condición que lo detenga."},
 {t:"vf", p:"En desarrollo con StrictMode, React monta, desmonta y vuelve a montar los componentes para comprobar que tus efectos se limpian bien.",
  ok:true, why:"Por eso ves peticiones duplicadas en desarrollo: es a propósito."}
]},

{
id:"re4l3",
titulo:"Cuándo no usar efectos",
claves:["Los datos derivados se calculan durante el render, no en un efecto","Las acciones del usuario van en los manejadores de eventos","Para pedir datos, mejor una librería (TanStack Query) o el framework"],
pasos:[
 {t:"info", eti:"Menos efectos", h:"Errores comunes",
  c:`<div class="termbox">// MAL: estado derivado sincronizado con un efecto
const [total, setTotal] = useState(0);
useEffect(() =&gt; { setTotal(items.reduce((s, i) =&gt; s + i.precio, 0)); }, [items]);

// BIEN: se calcula al renderizar
const total = items.reduce((s, i) =&gt; s + i.precio, 0);

// MAL: reaccionar a un envio con un efecto
useEffect(() =&gt; { if (enviado) api.guardar(form); }, [enviado]);

// BIEN: en el manejador
function onSubmit() { api.guardar(form); }</div>
     <p>Un efecto es para sincronizar con sistemas <b>externos</b>. Si no hay nada externo, probablemente no necesitas un efecto.</p>`},
 {t:"par", p:"Empareja cada necesidad con dónde resolverla",
  pares:[["Total de un carrito","Calcularlo durante el render"],["Enviar un formulario","En el manejador onSubmit"],["Suscribirse al tamaño de la ventana","useEffect con limpieza"],["Pedir datos de una API con caché y reintentos","TanStack Query (o el framework)"],["Cálculo costoso a partir de props","useMemo"]],
  why:"«You might not need an effect» es una de las guías más útiles de la documentación de React."},
 {t:"opcion", p:"¿Qué problema tiene pedir datos en un useEffect «a mano» en una app grande?",
  ops:["Ninguno","Hay que gestionar tú carga, errores, caché, cancelación, condiciones de carrera y reintentos en cada componente","Es imposible","Es más rápido"],
  ok:1, why:"Por eso existen TanStack Query, SWR o los loaders de los frameworks."}
]},

{
id:"re4l4",
titulo:"Formularios grandes con React Hook Form",
claves:["React Hook Form gestiona valores, errores y envío con pocos renders","zod define el esquema y los mensajes; el tipo se deriva del esquema","Mostrar errores junto a cada campo y deshabilitar el envío mientras se procesa"],
pasos:[
 {t:"info", eti:"Menos código", h:"React Hook Form + zod",
  c:`<div class="termbox">const Esquema = z.object({
  nombre: z.string().min(1, "Obligatorio"),
  email: z.string().email("Email no válido"),
  edad: z.coerce.number().int().min(18, "Debes ser mayor de edad"),
});
type Datos = z.infer&lt;typeof Esquema&gt;;

function Registro() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm&lt;Datos&gt;({ resolver: zodResolver(Esquema) });

  return (
    &lt;form onSubmit={handleSubmit(async datos =&gt; { await api.registrar(datos); })}&gt;
      &lt;input {...register("email")} aria-invalid={!!errors.email} /&gt;
      {errors.email &amp;&amp; &lt;p role="alert"&gt;{errors.email.message}&lt;/p&gt;}
      &lt;button disabled={isSubmitting}&gt;Crear cuenta&lt;/button&gt;
    &lt;/form&gt;
  );
}</div>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["register(\"email\")","Conecta el input con el formulario"],["handleSubmit","Valida y, si todo es correcto, llama a tu función"],["zodResolver(Esquema)","Usa el esquema de zod para validar"],["errors.email.message","Mensaje de error del campo"],["isSubmitting","Si el envío está en curso"]],
  why:"El mismo esquema de zod puede validar en el backend si usas Node: una sola fuente de verdad."},
 {t:"opcion", p:"¿Qué ventaja tiene React Hook Form frente a un useState por campo en un formulario de 30 campos?",
  ops:["Ninguna","Menos código repetido y menos renders: los inputs no controlados no re-renderizan todo el formulario en cada tecla","Es obligatorio en React","No necesita validación"],
  ok:1, why:"Para 2 o 3 campos, useState basta."}
]}

]});
