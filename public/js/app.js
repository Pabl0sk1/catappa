/* =====================================================================
   CATAPPA — arranque, rutas y web app (service worker)
   ===================================================================== */
(function () {
"use strict";
var F = window.F, E = F.E;

/* al cambiar de página se cierra cualquier lección abierta */
function pagina(fn) { return function (p) { if (F.cerrarLeccion) F.cerrarLeccion(); fn(p); }; }
function miga(texto) { return function () { return texto; }; }

F.ruta("/", pagina(F.vistaInicio), { seccion: "aprender", migas: miga("~/<b>aprender</b>") });
F.ruta("/cursos", pagina(F.vistaCatalogo), { seccion: "catalogo", migas: miga("~/<b>cursos</b>") });
F.ruta("/curso/:id", pagina(F.vistaCurso), { seccion: "catalogo", migas: function (p) { return '<a href="#/cursos">~/cursos</a>/<b>' + F.esc(p.id) + "</b>"; } });
F.ruta("/leccion/:curso/:leccion", F.vistaLeccion, { seccion: "catalogo", migas: function (p) { return '<a href="#/cursos">~/cursos</a>/' + F.esc(p.curso) + "/<b>" + F.esc(p.leccion) + "</b>"; } });
F.ruta("/comunidad", pagina(F.vistaComunidad), { seccion: "comunidad", migas: miga("~/<b>comunidad</b>") });
F.ruta("/comunidad/:id", pagina(F.vistaPost), { seccion: "comunidad", migas: miga('<a href="#/comunidad">~/comunidad</a>/<b>hilo</b>') });
F.ruta("/ranking", pagina(F.vistaRanking), { seccion: "ranking", migas: miga("~/<b>ranking</b>") });
F.ruta("/perfil", pagina(F.vistaPerfil), { seccion: "perfil", migas: miga("~/<b>perfil</b>") });
F.ruta("/perfil/:usuario", pagina(F.vistaPerfil), { seccion: "perfil", migas: function (p) { return "~/perfil/<b>" + F.esc(p.usuario) + "</b>"; } });
F.ruta("/certificado/:codigo", pagina(F.vistaCertificado), { seccion: "perfil", migas: function (p) { return "~/certificado/<b>" + F.esc(p.codigo) + "</b>"; } });
F.ruta("/ajustes", pagina(F.vistaAjustes), { seccion: "ajustes", migas: miga("~/<b>ajustes</b>") });
F.ruta("/entrar", pagina(F.vistaEntrar), { sinLayout: true });

/* ---------------- service worker: app instalable y sin conexión ---------------- */
function registrarSW() {
  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
  // en la primera instalación no hay nada que recargar: solo al aplicar una actualización
  var habiaControlador = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js").then(function (reg) {
    // hay una versión nueva esperando: se ofrece actualizar sin interrumpir
    var avisar = function (sw) {
      if (!sw || !navigator.serviceWorker.controller) return;
      var t = document.createElement("div");
      t.className = "toast";
      t.innerHTML = '<span class="ico">↻</span><span>Hay una versión nueva de la app.</span><button class="btn btn-primario" style="height:30px;margin-left:8px">Actualizar</button>';
      t.querySelector("button").addEventListener("click", function () { sw.postMessage("activar"); });
      var z = F.$("#toasts"); if (z) z.appendChild(t);
    };
    if (reg.waiting) avisar(reg.waiting);
    reg.addEventListener("updatefound", function () {
      var nuevo = reg.installing;
      nuevo.addEventListener("statechange", function () { if (nuevo.state === "installed") avisar(nuevo); });
    });
    setInterval(function () { reg.update().catch(function () {}); }, 60 * 60 * 1000);
  }).catch(function () {});
  var recargado = false;
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (recargado || !habiaControlador) return; recargado = true;
    if (!F.$(".leccion-pant")) location.reload();
  });
}

function arrancar() {
  // progreso de invitado (incluye la migración del curso antiguo de Docker)
  var importadas = F.migrarAInvitado();
  E.progreso = F.leerLocal("catappa-progreso-local", { progreso: {} }).progreso || {};

  F.comprobarServidor().then(function (hay) {
    E.modo = hay ? "servidor" : "local";
    var token = F.leerLocal("catappa-token", null);
    if (!token) return;
    E.token = token;
    if (!hay) {
      // sin conexión pero con sesión guardada: se sigue con la última copia conocida
      var cache = F.leerLocal("catappa-sesion-cache", null);
      if (cache && cache.perfil) { E.perfil = cache.perfil; E.progreso = cache.progreso || {}; E.modo = "offline"; F.tema.sincronizar(); }
      return;
    }
    return F.api("GET", "/api/yo").then(function (d) {
      E.perfil = d.perfil; E.progreso = d.progreso; F.guardarSesionCache(); F.tema.sincronizar();
      var nuevos = d.nuevosCertificados || [];
      if (nuevos.length) setTimeout(function () { F.toast(nuevos.length === 1 ? "Tienes un certificado nuevo: " + nuevos[0].titulo + ". Míralo en tu perfil." : "Tienes " + nuevos.length + " certificados nuevos. Míralos en tu perfil.", "★"); }, 900);
      return F.sincronizarCola();
    })
      .catch(function (e) {
        if (!e.estado) return;   // fallo de red puntual: se mantiene el token
        E.token = null; try { localStorage.removeItem("catappa-token"); } catch (x) {}
        F.tema.sincronizar();
        E.progreso = F.leerLocal("catappa-progreso-local", { progreso: {} }).progreso || {};
      });
  }).then(function () {
    // primera visita con servidor y sin sesión: pantalla de bienvenida
    var r = F.rutaActual().camino;
    if (E.modo === "servidor" && !E.perfil && !F.leerLocal("catappa-visto-acceso", false) && r === "/") location.hash = "#/entrar?modo=registro";
    F.navegar();
    if (importadas) setTimeout(function () { F.toast("Recuperadas " + importadas + " lecciones de Docker que ya habías completado"); }, 700);
    registrarSW();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
else arrancar();

})();
