window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Formularios",
resumen: "Inputs controlados y no controlados, acciones de formulario de React 19 con useActionState, useFormStatus y useOptimistic, y formularios grandes con React Hook Form y zod",
nivel: "Intermedio",
color: "#4fc8ea",
lecciones: [

/* =============== U4 L1 =============== */
{
id:"re4l1",
titulo:"Formularios controlados y no controlados",
claves:["Un input controlado toma su value del estado y lo actualiza con onChange","Un input no controlado guarda su valor en el DOM: defaultValue y se lee con FormData al enviar","checked para casillas, value en select y textarea; onSubmit en el form con preventDefault"],
pasos:[
 {t:"info", eti:"Formularios", h:"Inputs controlados",
  c:`<div class="termbox">function FormularioTarea({ onCrear }: { onCrear: (t: NuevaTarea) =&gt; void }) {
  const [titulo, setTitulo] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [urgente, setUrgente] = useState(false);
  const [error, setError] = useState&lt;string | null&gt;(null);

  function handleSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    if (titulo.trim().length === 0) return setError("El título es obligatorio");
    onCrear({ titulo: titulo.trim(), prioridad, urgente });
    setTitulo(""); setError(null);
  }

  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;label htmlFor="titulo"&gt;Tarea&lt;/label&gt;
      &lt;input id="titulo" value={titulo} onChange={e =&gt; setTitulo(e.target.value)}
             aria-invalid={!!error} aria-describedby="err-titulo" /&gt;
      {error &amp;&amp; &lt;p id="err-titulo" role="alert"&gt;{error}&lt;/p&gt;}
      &lt;select value={prioridad} onChange={e =&gt; setPrioridad(e.target.value)}&gt;
        &lt;option value="baja"&gt;Baja&lt;/option&gt;&lt;option value="media"&gt;Media&lt;/option&gt;
      &lt;/select&gt;
      &lt;label&gt;&lt;input type="checkbox" checked={urgente}
                    onChange={e =&gt; setUrgente(e.target.checked)} /&gt; Urgente&lt;/label&gt;
      &lt;button type="submit"&gt;Añadir&lt;/button&gt;
    &lt;/form&gt;
  );
}</div>
     <p>Controlado significa que <b>el estado de React es la fuente de verdad</b>: el input siempre muestra lo que dice el estado. Permite validar mientras se escribe, formatear (mayúsculas, máscaras) o deshabilitar el botón según el contenido.</p>`},
 {t:"info", eti:"La otra opción", h:"No controlados y FormData",
  c:`<div class="termbox">function Contacto() {
  function handleSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const email = String(datos.get("email"));
    const temas = datos.getAll("tema");             // varias casillas con el mismo name
    enviar({ email, temas });
  }
  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input name="email" type="email" defaultValue="" required /&gt;
      &lt;label&gt;&lt;input type="checkbox" name="tema" value="react" /&gt; React&lt;/label&gt;
      &lt;label&gt;&lt;input type="checkbox" name="tema" value="node" /&gt; Node&lt;/label&gt;
      &lt;button&gt;Enviar&lt;/button&gt;
    &lt;/form&gt;
  );
}</div>
     <div class="dg dg-tabla-caja"><div class="dg-tit">controlado frente a no controlado</div><table class="dg-tabla"><thead><tr><th></th><th>Controlado</th><th>No controlado</th></tr></thead><tbody>
       <tr><td>Fuente de verdad</td><td>estado de React</td><td>el DOM</td></tr>
       <tr><td>Valor inicial</td><td>value</td><td>defaultValue / defaultChecked</td></tr>
       <tr><td>Leer el valor</td><td>en cualquier momento</td><td>al enviar (FormData) o con ref</td></tr>
       <tr><td>Renders</td><td>uno por tecla</td><td>ninguno al escribir</td></tr>
       <tr><td>Ideal para</td><td>validación en vivo, campos dependientes</td><td>formularios simples, acciones de React 19</td></tr>
     </tbody></table></div>
     <p>Los <code>&lt;input type="file"&gt;</code> son siempre no controlados: su valor solo lo puede poner el usuario.</p>`},
 {t:"par", p:"Empareja cada parte con su función",
  pares:[["value={titulo}","El input muestra lo que hay en el estado"],["onChange={e => setTitulo(e.target.value)}","Cada tecla actualiza el estado"],["checked={urgente}","Estado de una casilla controlada"],["defaultValue","Valor inicial de un input no controlado"],["e.preventDefault()","Evita que el navegador recargue la página"],["htmlFor e id","Asocian la etiqueta al campo (accesibilidad)"]],
  why:"En una casilla se lee e.target.checked, no e.target.value."},
 {t:"opcion", p:"Pones <code>value={nombre}</code> en un input pero olvidas <code>onChange</code>. ¿Qué pasa?",
  ops:["Funciona normal","El campo queda de solo lectura: no se puede escribir, y React avisa en consola","Se borra al escribir","Error de compilación"],
  ok:1, why:"Controlado sin onChange = el valor siempre es el del estado, que nunca cambia. Si de verdad es de solo lectura, añade readOnly."},
 {t:"opcion", p:"En consola aparece «A component is changing an uncontrolled input to be controlled». El input tiene <code>value={usuario.apodo}</code> y al principio <code>apodo</code> es undefined. ¿Solución?",
  ops:["Quitar value","Dar siempre un valor definido: value={usuario.apodo ?? \"\"}","Añadir key","Usar defaultValue y value a la vez"],
  ok:1, why:"value={undefined} deja el input no controlado; cuando llega el dato pasa a controlado. Un input debe ser una cosa u otra durante toda su vida."},
 {t:"hueco", p:"Completa para leer los datos de un formulario no controlado al enviarlo",
  tpl:"function handleSubmit(e) {\n  e.preventDefault();\n  const datos = new ___(e.currentTarget);\n  const email = datos.___(\"email\");\n}",
  banco:["FormData","get","FormValues","value","getAll"], sol:["FormData","get"],
  why:"FormData lee los campos por su atributo name. getAll devuelve todos los valores de un name repetido."},
 {t:"vf", p:"Validar en el formulario de React hace innecesaria la validación en la API.",
  ok:false, why:"La validación del frontend es para la experiencia del usuario; la API debe validar siempre, porque cualquiera puede llamarla sin tu formulario."}
]},

/* =============== U4 L2 =============== */
{
id:"re4n1",
titulo:"Acciones de formulario y useActionState",
claves:["En React 19 un form acepta una función en action: recibe el FormData y React gestiona la transición","useActionState(accion, estadoInicial) devuelve [estado, accionEnvuelta, pendiente]","La acción devuelve el nuevo estado (errores, mensaje); los campos no controlados se vacían al terminar con éxito"],
pasos:[
 {t:"info", eti:"React 19", h:"Funciones como action",
  c:`<p>Desde React 19, <code>&lt;form action={funcion}&gt;</code> acepta una función (síncrona o asíncrona). Al enviar, React llama a la función con el <code>FormData</code>, sin que tengas que hacer <code>preventDefault</code>, y la ejecuta dentro de una <b>transición</b>: la interfaz sigue respondiendo mientras tanto.</p>
     <div class="termbox">async function crearTarea(datos: FormData) {
  await api.crear({ titulo: String(datos.get("titulo")) });
}

&lt;form action={crearTarea}&gt;
  &lt;input name="titulo" /&gt;
  &lt;button&gt;Añadir&lt;/button&gt;
&lt;/form&gt;</div>
     <p>Cuando la acción termina con éxito, React <b>reinicia los campos no controlados</b> del formulario. Un <code>&lt;button formAction={otra}&gt;</code> permite que un botón concreto dispare otra acción (por ejemplo «Guardar borrador»).</p>`},
 {t:"info", eti:"Estado de la acción", h:"useActionState",
  c:`<div class="termbox">type Estado = { errores: Record&lt;string, string&gt;; ok: boolean };

async function registrar(prev: Estado, datos: FormData): Promise&lt;Estado&gt; {
  const email = String(datos.get("email") ?? "");
  if (!email.includes("@")) return { errores: { email: "Email no válido" }, ok: false };
  const r = await api.registrar({ email });
  if (!r.ok) return { errores: { general: r.mensaje }, ok: false };
  return { errores: {}, ok: true };
}

function Registro() {
  const [estado, accion, pendiente] = useActionState(registrar, { errores: {}, ok: false });
  return (
    &lt;form action={accion}&gt;
      &lt;input name="email" aria-invalid={!!estado.errores.email} /&gt;
      {estado.errores.email &amp;&amp; &lt;p role="alert"&gt;{estado.errores.email}&lt;/p&gt;}
      &lt;button disabled={pendiente}&gt;{pendiente ? "Enviando..." : "Crear cuenta"}&lt;/button&gt;
      {estado.ok &amp;&amp; &lt;p&gt;¡Cuenta creada!&lt;/p&gt;}
    &lt;/form&gt;
  );
}</div>
     <p>La acción recibe el <b>estado anterior</b> como primer argumento y el <code>FormData</code> como segundo, y lo que devuelve es el nuevo estado. Con Server Actions (Next.js) esa misma función se ejecuta en el servidor y funciona incluso antes de que cargue el JavaScript.</p>`},
 {t:"par", p:"Empareja cada elemento de <code>const [estado, accion, pendiente] = useActionState(fn, inicial)</code>",
  pares:[["estado","Lo que devolvió la última ejecución (o inicial)"],["accion","Función que se pasa a <form action>"],["pendiente","true mientras la acción está en curso"],["fn(prev, datos)","Tu función: recibe el estado anterior y el FormData"],["inicial","Estado antes del primer envío"]],
  why:"El orden de los argumentos de tu función sorprende: primero el estado previo y después el FormData."},
 {t:"opcion", p:"Pasas a useActionState una función <code>async (datos) =&gt; { datos.get(\"email\") ... }</code> y falla con «datos.get is not a function». ¿Por qué?",
  ops:["FormData no existe en React","El primer argumento es el estado anterior; el FormData es el segundo: async (prev, datos) =&gt; ...","Falta await","Hay que usar useFormStatus"],
  ok:1, why:"Con useActionState la firma cambia respecto a una acción suelta en &lt;form action&gt;, que solo recibe el FormData."},
 {t:"orden", p:"Ordena lo que ocurre al enviar un formulario con <code>action={accion}</code> de useActionState",
  items:["El usuario pulsa el botón de envío","React construye el FormData y marca pendiente = true","Se ejecuta tu función con (estadoAnterior, formData)","La función devuelve el nuevo estado","React renderiza con el nuevo estado y pendiente = false"],
  why:"Todo ocurre dentro de una transición: el resto de la interfaz sigue respondiendo."},
 {t:"vf", p:"Con <code>&lt;form action={fn}&gt;</code> en React 19 hace falta llamar a <code>e.preventDefault()</code> para que no se recargue la página.",
  ok:false, why:"Con una función en action, React intercepta el envío. preventDefault solo es necesario con onSubmit."},
 {t:"codigo", p:"Escribe la validación que devolvería una acción de registro: un error por campo, en orden, o <code>OK</code>",
  lenguaje:"js",
  c:`<p>Por stdin llega un JSON con <code>nombre, email, edad, clave, repetir</code> (todo texto). Comprueba en este orden e imprime <code>campo: mensaje</code> por cada fallo:</p>
<ul><li><code>nombre: obligatorio</code> si vacío tras quitar espacios</li>
<li><code>email: no válido</code> si no cumple <code>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/</code></li>
<li><code>edad: mínimo 18</code> si no es un entero o es menor de 18</li>
<li><code>clave: mínimo 8 caracteres y un número</code></li>
<li><code>repetir: no coincide</code> si es distinta de clave</li></ul>
<p>Si no hay fallos, imprime <code>OK</code>.</p>`,
  plantilla:"const d = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst errores = [];\n// comprueba cada campo y añade \"campo: mensaje\"\nconsole.log(errores.length ? errores.join(\"\\n\") : \"OK\");\n",
  pruebas:[{entrada:'{"nombre":"Ana","email":"ana@correo.es","edad":"30","clave":"secreta99","repetir":"secreta99"}', salida:"OK"},{entrada:'{"nombre":"  ","email":"ana@correo","edad":"17","clave":"corta1","repetir":"otra"}', salida:"nombre: obligatorio\nemail: no válido\nedad: mínimo 18\nclave: mínimo 8 caracteres y un número\nrepetir: no coincide"},{entrada:'{"nombre":"Luis","email":"luis@x.com","edad":"18.5","clave":"sinnumeros","repetir":"sinnumeros"}', salida:"edad: mínimo 18\nclave: mínimo 8 caracteres y un número", oculta:true}],
  pista:"Number.isInteger(Number(d.edad)) para la edad; /\\d/.test(d.clave) y d.clave.length >= 8 para la clave.",
  solucion:"const d = JSON.parse(require(\"node:fs\").readFileSync(0, \"utf8\"));\nconst errores = [];\nif (d.nombre.trim() === \"\") errores.push(\"nombre: obligatorio\");\nif (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(d.email)) errores.push(\"email: no válido\");\nconst edad = Number(d.edad);\nif (!Number.isInteger(edad) || edad < 18) errores.push(\"edad: mínimo 18\");\nif (d.clave.length < 8 || !/\\d/.test(d.clave)) errores.push(\"clave: mínimo 8 caracteres y un número\");\nif (d.repetir !== d.clave) errores.push(\"repetir: no coincide\");\nconsole.log(errores.length ? errores.join(\"\\n\") : \"OK\");\n",
  why:"Esta lógica es pura y se prueba sin React. En una app real vive en un esquema de zod compartido entre la acción y el servidor."}
]},

/* =============== U4 L3 =============== */
{
id:"re4n2",
titulo:"useFormStatus y useOptimistic",
claves:["useFormStatus (react-dom) da pending, data y method del form padre: se usa en un componente hijo del form","useOptimistic muestra el resultado esperado mientras la acción está en curso y lo revierte si falla","Las acciones pueden lanzarse fuera de formularios con startTransition"],
pasos:[
 {t:"info", eti:"El botón que sabe", h:"useFormStatus",
  c:`<div class="termbox">import { useFormStatus } from "react-dom";

function BotonEnviar({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();           // estado del &lt;form&gt; que lo contiene
  return &lt;button type="submit" disabled={pending}&gt;{pending ? "Enviando..." : children}&lt;/button&gt;;
}

function Contacto() {
  return (
    &lt;form action={enviarMensaje}&gt;
      &lt;textarea name="mensaje" /&gt;
      &lt;BotonEnviar&gt;Enviar&lt;/BotonEnviar&gt;
    &lt;/form&gt;
  );
}</div>
     <p><code>useFormStatus</code> lee el estado del <code>&lt;form&gt;</code> <b>padre</b>, como si fuera un contexto. Por eso tiene que llamarse en un componente renderizado <b>dentro</b> del form; si lo llamas en el mismo componente que pinta el <code>&lt;form&gt;</code>, siempre dará <code>pending: false</code>. Es ideal para un botón reutilizable en todos los formularios de la app.</p>`},
 {t:"info", eti:"Parecer instantáneo", h:"useOptimistic",
  c:`<div class="termbox">function Mensajes({ mensajes, enviar }: Props) {
  const [optimistas, anadirOptimista] = useOptimistic(
    mensajes,
    (lista, nuevo: string) =&gt; [...lista, { texto: nuevo, enviando: true }]
  );

  async function accion(datos: FormData) {
    const texto = String(datos.get("texto"));
    anadirOptimista(texto);          // se ve ya, marcado como "enviando"
    await enviar(texto);             // si falla, la lista vuelve a "mensajes"
  }

  return (
    &lt;&gt;
      {optimistas.map((m, i) =&gt; &lt;p key={i} style={{ opacity: m.enviando ? 0.5 : 1 }}&gt;{m.texto}&lt;/p&gt;)}
      &lt;form action={accion}&gt;&lt;input name="texto" /&gt;&lt;button&gt;Enviar&lt;/button&gt;&lt;/form&gt;
    &lt;/&gt;
  );
}</div>
     <p>Mientras la acción está en curso, <code>optimistas</code> muestra el valor calculado; cuando termina, vuelve a ser <code>mensajes</code> (ya actualizado por el padre si todo fue bien). La actualización optimista debe hacerse <b>dentro de una acción o transición</b>.</p>
     <p>Fuera de un formulario, lanza una acción con <code>startTransition(async () =&gt; { ... })</code> de <code>useTransition</code>: obtienes el mismo <code>isPending</code>.</p>`},
 {t:"par", p:"Empareja cada API de React 19 con su función",
  pares:[["useActionState","Estado y resultado de una acción de formulario"],["useFormStatus","Saber si el formulario padre se está enviando"],["useOptimistic","Mostrar un cambio antes de que el servidor lo confirme"],["formAction en un botón","Que ese botón dispare una acción distinta"],["startTransition(async () => ...)","Lanzar una acción fuera de un formulario"]],
  why:"Las tres primeras forman el trío de los formularios modernos de React."},
 {t:"opcion", p:"Llamas a <code>useFormStatus()</code> en el componente <code>Formulario</code>, que es el que renderiza <code>&lt;form&gt;</code>. <code>pending</code> siempre es false. ¿Por qué?",
  ops:["Un bug de React 19","useFormStatus lee el form padre del componente; hay que usarlo en un hijo renderizado dentro del form","Falta useActionState","Solo funciona con Next.js"],
  ok:1, why:"Extrae el botón (o lo que necesite el estado) a un componente hijo."},
 {t:"opcion", p:"Con useOptimistic añades un «me gusta» y la petición falla. ¿Qué se renderiza cuando termina la acción?",
  ops:["El me gusta se queda","Vuelve al valor real (sin el me gusta): el estado optimista solo existe mientras dura la acción","La app se rompe","Se reintenta sola"],
  ok:1, why:"Es la gracia de useOptimistic: no tienes que deshacer a mano. Sí conviene avisar del error al usuario."},
 {t:"hueco", p:"Completa el botón reutilizable",
  tpl:"import { ___ } from \"react-dom\";\nfunction Boton() {\n  const { ___ } = useFormStatus();\n  return <button disabled={pending}>Guardar</button>;\n}",
  banco:["useFormStatus","pending","useActionState","loading","isPending"], sol:["useFormStatus","pending"],
  why:"Ojo: useFormStatus se importa de react-dom, no de react."},
 {t:"vf", p:"Las funciones que se pasan a <code>action</code> se ejecutan dentro de una transición, así que la interfaz sigue respondiendo mientras terminan.",
  ok:true, why:"Por eso se llaman acciones: funciones asíncronas en transición que gestionan pendiente, errores y optimismo."}
]},

/* =============== U4 L4 =============== */
{
id:"re4l4",
titulo:"Formularios grandes con React Hook Form",
claves:["React Hook Form gestiona valores, errores y envío con pocos renders (inputs no controlados)","zod define el esquema y los mensajes; el tipo se deriva del esquema con z.infer","Controller integra componentes controlados de terceros; useFieldArray, listas dinámicas"],
pasos:[
 {t:"info", eti:"Menos código", h:"React Hook Form + zod",
  c:`<div class="termbox">import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Esquema = z.object({
  nombre: z.string().min(1, "Obligatorio"),
  email: z.email("Email no válido"),                       // zod 4 (en zod 3: z.string().email())
  edad: z.coerce.number().int().min(18, "Debes ser mayor de edad"),
});
type Datos = z.infer&lt;typeof Esquema&gt;;

function Registro() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm&lt;Datos&gt;({ resolver: zodResolver(Esquema), mode: "onBlur" });

  return (
    &lt;form onSubmit={handleSubmit(async datos =&gt; { await api.registrar(datos); })}&gt;
      &lt;input {...register("email")} aria-invalid={!!errors.email} /&gt;
      {errors.email &amp;&amp; &lt;p role="alert"&gt;{errors.email.message}&lt;/p&gt;}
      &lt;button disabled={isSubmitting}&gt;Crear cuenta&lt;/button&gt;
    &lt;/form&gt;
  );
}</div>
     <p><code>register</code> devuelve <code>name</code>, <code>ref</code>, <code>onChange</code> y <code>onBlur</code>: el input queda <b>no controlado</b> y la librería lee su valor del DOM. Escribir no re-renderiza el formulario entero.</p>`},
 {t:"info", eti:"Casos reales", h:"Controller, watch y listas dinámicas",
  c:`<div class="termbox">// componentes controlados de terceros (selector de fechas, combobox)
&lt;Controller control={control} name="fecha"
  render={({ field }) =&gt; &lt;SelectorFecha value={field.value} onChange={field.onChange} /&gt;} /&gt;

// líneas de una factura que se añaden y quitan
const { fields, append, remove } = useFieldArray({ control, name: "lineas" });
{fields.map((f, i) =&gt; (
  &lt;div key={f.id}&gt;
    &lt;input {...register(\`lineas.\${i}.concepto\`)} /&gt;
    &lt;button type="button" onClick={() =&gt; remove(i)}&gt;Quitar&lt;/button&gt;
  &lt;/div&gt;
))}

const pais = watch("pais");                    // re-renderiza cuando cambia ese campo</div>
     <p>Fíjate en <code>key={f.id}</code>: <code>useFieldArray</code> genera ids estables precisamente para no usar el índice. Y en <code>type="button"</code>: dentro de un form, un botón sin tipo es de envío.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["register(\"email\")","Conecta el input con el formulario"],["handleSubmit","Valida y, si todo es correcto, llama a tu función"],["zodResolver(Esquema)","Usa el esquema de zod para validar"],["errors.email.message","Mensaje de error del campo"],["Controller","Envuelve un componente controlado de otra librería"],["useFieldArray","Listas de campos que se añaden y quitan"]],
  why:"El mismo esquema de zod puede validar en el backend si usas Node: una sola fuente de verdad."},
 {t:"opcion", p:"¿Qué ventaja tiene React Hook Form frente a un useState por campo en un formulario de 30 campos?",
  ops:["Ninguna","Menos código repetido y menos renders: los inputs no controlados no re-renderizan todo el formulario en cada tecla","Es obligatorio en React","No necesita validación"],
  ok:1, why:"Para 2 o 3 campos, useState o una acción con FormData bastan."},
 {t:"opcion", p:"En un formulario de factura, pulsar «Quitar línea» envía el formulario. ¿Qué falta?",
  ops:["preventDefault en el form","type=\"button\" en el botón: dentro de un form, un button sin tipo es submit","Un Controller","Un useEffect"],
  ok:1, why:"Es un error clásico: el valor por defecto de type en un &lt;button&gt; dentro de un formulario es submit."},
 {t:"hueco", p:"Completa para derivar el tipo TypeScript del esquema de zod",
  tpl:"type Datos = z.___<typeof ___>;",
  banco:["infer","Esquema","type","Datos","typeof"], sol:["infer","Esquema"],
  why:"Un solo esquema da validación en tiempo de ejecución y tipos en compilación."},
 {t:"vf", p:"Con React Hook Form, cada tecla en un campo registrado re-renderiza el componente del formulario.",
  ok:false, why:"Por defecto no: los valores viven en el DOM. Solo re-renderiza cuando cambian cosas suscritas (errores, watch, isSubmitting)."}
]}

]});
