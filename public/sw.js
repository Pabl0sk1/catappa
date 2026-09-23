/* =====================================================================
   CATAPPA — service worker
   - Instala la "carcasa" de la app para que abra sin conexión.
   - Los cursos que abres se guardan en caché y quedan disponibles offline.
   - La API siempre va a la red (la app gestiona el modo sin conexión).
   La línea VERSION la reescribe herramientas/indice.js en cada build: si
   cambia cualquier fichero, cambia la versión y el navegador ofrece actualizar.
   ===================================================================== */
var VERSION = "catappa-451c531f7b";
var CARCASA = "carcasa-" + VERSION;
var CONTENIDO = "contenido-" + VERSION;
var FUENTES = "fuentes-v1";

var FICHEROS = [
  "./", "index.html", "manifest.webmanifest",
  "css/app.css",
  "js/nucleo.js", "js/cata.js", "js/codigo.js", "js/cuenta.js",
  "js/stacks.js",
  "js/proyectos.js", "js/sonido.js", "js/leccion.js", "js/aprender.js", "js/comunidad.js", "js/perfil.js", "js/certificado.js", "js/app.js",
  "cursos/_catalogo.js", "cursos/_indice.js", "cursos/_stacks.js",
  "cursos/_proyectos.js",
  "iconos/icono-192.png", "iconos/icono-512.png", "iconos/icono.svg", "iconos/favicon-32.png", "iconos/favicon-16.png", "favicon.ico",
  "marca/cata-96.png", "marca/cata-256.png",
  "logos/ansible.svg", "logos/aws.svg", "logos/devops.svg", "logos/docker.svg", "logos/git.svg", "logos/go.svg", "logos/htmlcss.svg", "logos/java.svg", "logos/jenkins.svg", "logos/javascript.svg", "logos/kafka.svg", "logos/kubernetes.svg", "logos/linux.svg", "logos/mongodb.svg", "logos/nodejs.svg", "logos/observabilidad.svg", "logos/python.svg", "logos/react.svg", "logos/redis.svg", "logos/seguridad.svg", "logos/spring.svg", "logos/sql.svg", "logos/terraform.svg", "logos/typescript.svg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CARCASA).then(function (c) { return c.addAll(FICHEROS); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.filter(function (k) { return k !== CARCASA && k !== CONTENIDO && k !== FUENTES; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (e) { if (e.data === "activar") self.skipWaiting(); });

/* sirve de caché y actualiza en segundo plano */
function cacheYRed(cacheName, req) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(req).then(function (enCache) {
      var red = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
        return res;
      }).catch(function () { return enCache; });
      return enCache || red;
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // fuentes de Google: caché de larga duración
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(cacheYRed(FUENTES, req));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // la API nunca se cachea
  if (url.pathname.indexOf("/api/") === 0) return;

  // navegación: red primero, si no hay red, la app desde caché
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(function () { return caches.match("index.html", { ignoreSearch: true }); }));
    return;
  }

  // contenido de cursos: se guarda al abrirlo
  if (url.pathname.indexOf("/cursos/") >= 0 && !/_indice|_catalogo/.test(url.pathname)) {
    e.respondWith(cacheYRed(CONTENIDO, req));
    return;
  }

  e.respondWith(cacheYRed(CARCASA, req));
});
