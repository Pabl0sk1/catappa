window.CURSOS = window.CURSOS || {};
(CURSOS.react = CURSOS.react || []).push({
titulo: "Rutas y datos del servidor",
resumen: "Enrutado con React Router, rutas anidadas y parámetros, y datos del servidor con TanStack Query: caché, mutaciones e invalidación",
nivel: "Avanzado",
color: "#40b8dc",
lecciones: [

{
id:"re6l1",
titulo:"React Router",
claves:["Una SPA cambia de pantalla sin recargar: el router asocia URL y componente","Rutas anidadas con Outlet; parámetros con useParams","Link y useNavigate para navegar"],
pasos:[
 {t:"info", eti:"Varias pantallas", h:"Enrutado",
  c:`<div class="termbox">import { createBrowserRouter, RouterProvider, Link, Outlet, useParams } from "react-router";

const router = createBrowserRouter([
  { path: "/", element: &lt;Layout /&gt;, children: [
    { index: true, element: &lt;Inicio /&gt; },
    { path: "tareas", element: &lt;ListaTareas /&gt; },
    { path: "tareas/:id", element: &lt;DetalleTarea /&gt; },
    { path: "*", element: &lt;NoEncontrado /&gt; },
  ]},
]);

function Layout() {
  return (&lt;&gt;&lt;nav&gt;&lt;Link to="/tareas"&gt;Tareas&lt;/Link&gt;&lt;/nav&gt;&lt;Outlet /&gt;&lt;/&gt;);
}
function DetalleTarea() {
  const { id } = useParams();
  ...
}

createRoot(root).render(&lt;RouterProvider router={router} /&gt;);</div>`},
 {t:"par", p:"Empareja cada pieza con su función",
  pares:[["path: \"tareas/:id\"","Ruta con un parámetro"],["useParams()","Leer los parámetros de la URL"],["<Link to=\"...\">","Enlace que navega sin recargar"],["<Outlet />","Dónde se pintan las rutas hijas"],["useNavigate()","Navegar desde código (tras guardar un formulario)"]],
  why:"Usar &lt;a href&gt; en vez de &lt;Link&gt; recarga toda la aplicación."},
 {t:"opcion", p:"Despliegas la SPA en Nginx y al recargar <code>/tareas/7</code> sale un 404. ¿Por qué?",
  ops:["Un bug de React Router","Nginx busca el fichero /tareas/7, que no existe: hay que devolver index.html para cualquier ruta (try_files ... /index.html)","Falta la ruta en el router","El id no existe"],
  ok:1, why:"El enrutado ocurre en el navegador; el servidor debe servir siempre la SPA."}
]},

{
id:"re6l2",
titulo:"Datos del servidor con TanStack Query",
claves:["useQuery gestiona carga, error, caché, reintentos y revalidación","queryKey identifica los datos en caché","useMutation para escribir; invalidar las consultas afectadas al terminar"],
pasos:[
 {t:"info", eti:"Estado del servidor", h:"useQuery",
  c:`<div class="termbox">function ListaTareas() {
  const { data, isPending, error } = useQuery({
    queryKey: ["tareas"],
    queryFn: () =&gt; fetch("/api/tareas").then(r =&gt; { if (!r.ok) throw new Error(); return r.json(); }),
    staleTime: 30_000,
  });
  if (isPending) return &lt;Cargando /&gt;;
  if (error) return &lt;ErrorMensaje /&gt;;
  return &lt;ul&gt;{data.map((t: Tarea) =&gt; &lt;li key={t.id}&gt;{t.titulo}&lt;/li&gt;)}&lt;/ul&gt;;
}</div>
     <p>Los datos del servidor no son «estado» de tu componente: son una <b>caché</b> de algo que vive en otro sitio. TanStack Query la gestiona: si dos componentes piden <code>["tareas"]</code>, se hace una sola petición.</p>`},
 {t:"info", eti:"Escribir", h:"useMutation e invalidación",
  c:`<div class="termbox">const qc = useQueryClient();
const crear = useMutation({
  mutationFn: (t: NuevaTarea) =&gt; api.crearTarea(t),
  onSuccess: () =&gt; qc.invalidateQueries({ queryKey: ["tareas"] }),   // recargar la lista
});

&lt;button disabled={crear.isPending} onClick={() =&gt; crear.mutate({ titulo })}&gt;Añadir&lt;/button&gt;</div>`},
 {t:"par", p:"Empareja cada concepto con su función",
  pares:[["queryKey","Identifica los datos en la caché"],["staleTime","Cuánto tiempo se consideran frescos"],["invalidateQueries","Marcar datos como obsoletos para que se recarguen"],["useMutation","Crear, actualizar o borrar en el servidor"],["Actualización optimista","Mostrar el cambio antes de que responda el servidor"]],
  why:"Separar estado del cliente (UI) y del servidor (caché) simplifica muchísimo las aplicaciones."},
 {t:"opcion", p:"Tras crear una tarea con una mutación, la lista no muestra la nueva. ¿Qué falta?",
  ops:["Recargar la página","Invalidar la consulta [\"tareas\"] en onSuccess (o actualizar la caché)","Un useEffect","Otro useState"],
  ok:1, why:"La caché no sabe que el servidor cambió hasta que se lo dices."}
]},

{
id:"re6l3",
titulo:"Autenticación en el frontend",
claves:["El frontend solo muestra u oculta: la seguridad real está en la API","Rutas protegidas que redirigen al login si no hay sesión","Tokens: cookies HttpOnly si es posible; refresco transparente y cierre de sesión al caducar"],
pasos:[
 {t:"info", eti:"Sesión en la SPA", h:"Rutas protegidas",
  c:`<div class="termbox">function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useSesion();
  const ubicacion = useLocation();
  if (cargando) return &lt;Cargando /&gt;;
  if (!usuario) return &lt;Navigate to="/entrar" state={{ volver: ubicacion.pathname }} replace /&gt;;
  return children;
}

// en el router
{ path: "panel", element: &lt;RutaProtegida&gt;&lt;Panel /&gt;&lt;/RutaProtegida&gt; }</div>
     <p>Ocultar el panel no protege nada: si alguien llama a la API sin permiso, la API debe responder 401 o 403. El frontend solo mejora la experiencia.</p>`},
 {t:"par", p:"Empareja cada decisión con su motivo",
  pares:[["Cookie HttpOnly para la sesión","Un XSS no puede leer el token"],["Redirigir al login conservando la ruta","Volver donde estaba tras iniciar sesión"],["Interceptar 401 y cerrar sesión","No dejar al usuario en una pantalla rota con sesión caducada"],["Comprobar permisos en la API","La única protección real"]],
  why:"Con proveedores OIDC, librerías como oidc-client-ts gestionan el flujo con PKCE."},
 {t:"opcion", p:"Ocultas el botón «Borrar usuario» a quien no es administrador. ¿Es suficiente?",
  ops:["Sí","No: la API debe comprobar el rol en el endpoint; el frontend puede manipularse","Solo en producción","Solo si el botón está deshabilitado"],
  ok:1, why:"Cualquiera puede hacer la petición con curl o desde las DevTools."}
]}

]});
