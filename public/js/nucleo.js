/* =====================================================================
   CATAPPA — núcleo: utilidades, estado, API, rutas y maquetación común
   ===================================================================== */
(function () {
"use strict";

var F = window.F = {};

/* ---------------- marca (cambiar aquí el nombre y el logo) ---------------- */
F.MARCA = {
  nombre: "Catappa",
  logo: '<img class="marca-logo" src="marca/cata-96.png" width="31" height="34" alt="">',
  mascota: "marca/cata-256.png"          // Cata, la mascota (PNG sin fondo)
};

/* ---------------- utilidades ---------------- */
F.$ = function (s, r) { return (r || document).querySelector(s); };
F.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
F.esc = function (s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
F.hoy = function () { return new Date().toISOString().slice(0, 10); };
F.diaMenos = function (n) { var d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
F.hace = function (iso) {
  var s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "ahora mismo";
  var m = Math.floor(s / 60); if (m < 60) return "hace " + m + " min";
  var h = Math.floor(m / 60); if (h < 24) return "hace " + h + " h";
  var d = Math.floor(h / 24); if (d < 30) return "hace " + d + (d === 1 ? " día" : " días");
  var me = Math.floor(d / 30); if (me < 12) return "hace " + me + (me === 1 ? " mes" : " meses");
  return "hace " + Math.floor(me / 12) + " años";
};
F.iniciales = function (nombre) {
  var p = String(nombre || "?").trim().split(/\s+/);
  return ((p[0] || "?")[0] + (p[1] ? p[1][0] : (p[0][1] || ""))).toUpperCase();
};
F.avatar = function (u, tam) {
  return '<span class="avatar ' + (tam || "") + '" style="background:' + F.esc(u.color || "#179493") + '">' + F.esc(F.iniciales(u.nombre || u.usuario)) + "</span>";
};
F.guardarLocal = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
F.leerLocal = function (k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } };
F.num = function (n) { return Number(n || 0).toLocaleString("es-ES"); };

/* ---------------- iconos (trazo, 24x24) ---------------- */
var I = {
  aprender: '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
  catalogo: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  descargar: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  nube: '<path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8.5a4.5 4.5 0 0 1-.5 9.5z"/>',
  sinred: '<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.4-1.7M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 12 5c-.9 0-1.8.1-2.6.2M12 20h.01"/>',
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>',
  datos: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  capas: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
  escudo: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  red: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  timon: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7M4.9 4.9l5 5M14.1 14.1l5 5M19.1 4.9l-5 5M9.9 14.1l-5 5"/>',
  taza: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1a3 3 0 0 1 0 6h-1M8 2v3M12 2v3"/>',
  hoja: '<path d="M5 21c0-9 5-15 15-17-1 10-6 16-15 17z"/><path d="M5 21 13 13"/>',
  serpiente: '<path d="M8 3h6a3 3 0 0 1 3 3v3H9a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h7a3 3 0 0 1 3 3"/><circle cx="11" cy="6" r=".6"/>',
  llaves: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>',
  atomo: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  hexagono: '<path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M12 8v8M9 10l3-2 3 2"/>',
  pinguino: '<path d="M12 3c-3 0-4.5 2.5-4.5 6 0 2-2.5 4.5-2.5 7.5S7 21 12 21s7-1.5 7-4.5S16.5 11 16.5 9c0-3.5-1.5-6-4.5-6z"/><path d="M10 7h.01M14 7h.01M11 9.5h2"/>',
  comunidad: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
  ranking: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3a2 2 0 0 1-2 4h-1M7 5H4a2 2 0 0 0 2 4h1"/>',
  perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  ajustes: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  luna: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  fuego: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-9-1 2-2 3-4 4 0-2-1-4-2-6-2 3-4 6-4 11 0 4 3 7 7 7z"/>',
  rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  abajo: '<path d="m6 9 6 6 6-6"/>',
  arriba: '<path d="m6 15 6-6 6 6"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  aceptada: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  papelera: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  container: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 4-6 3-12 7"/>',
  pipeline: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h5a3 3 0 0 1 3 3v6"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  terminal: '<path d="m5 8 4 4-4 4M12 16h7"/><rect x="2" y="3" width="20" height="18" rx="2"/>',
  estrella: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  grafo: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="12" cy="10" r="1.6"/><path d="M6.7 7.1 10.6 9.2M17.3 7.1l-3.9 2.1M12 11.6v4.4"/>',
  pagina: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01M8 13l-2 2 2 2M16 13l2 2-2 2M13 12l-2 6"/>',
  grafica: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  mensajes: '<rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/><path d="M7 6h.01M7 12h.01M7 18h.01"/>',
  engranaje: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
  velocidad: '<path d="M3 9h6M2 12h6M3 15h6"/><circle cx="15" cy="12" r="5"/><path d="M15 9.5V12l1.5 1.5"/>',
  documento: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  ojo: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  ojoNo: '<path d="M3 3l18 18M10.6 5.1A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  sonido: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  silencio: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
  plano: '<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="8.5" y="16" width="7" height="5" rx="1"/><path d="M6.5 8v3.5h11V8M12 11.5V16"/>'
};
/* logo oficial del curso (o su icono si la materia no tiene logo); tam: "" | "peq" | "grande" */
F.logoCurso = function (c, tam) {
  var cls = "glifo" + (c.logo ? " con-logo" : "") + (tam ? " glifo-" + tam : "");
  var dentro = c.logo ? '<img src="' + c.logo + '" alt="">' : F.icono(c.glifo);
  return '<span class="' + cls + '" style="--c:' + c.color + '" aria-hidden="true">' + dentro + "</span>";
};

F.icono = function (n, cls) {
  return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || "") + "</svg>";
};

/* ---------------- tema ---------------- */
/* tema: "sistema" (sigue al sistema operativo; es el predeterminado), "claro" u "oscuro".
   Solo se puede elegir con la sesión iniciada, y la elección se guarda en la cuenta:
   sin sesión (portada, invitados) siempre se usa el del sistema. */
F.TEMA_PREDETERMINADO = "sistema";
var TEMAS = ["sistema", "claro", "oscuro"];
F.tema = {
  puedeCambiar: function () { return !!E.perfil; },
  actual: function () {
    var t = E.perfil && E.perfil.tema;
    return E.perfil && TEMAS.indexOf(t) >= 0 ? t : F.TEMA_PREDETERMINADO;
  },
  /* solo pinta: no guarda nada */
  pintar: function (t) {
    var oscuro = t === "oscuro" || (t !== "claro" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", oscuro ? "dark" : "light");
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", oscuro ? "#0b1821" : "#f4f7f8");
    // copia para pintar sin parpadeo en la próxima visita (solo se usa si hay sesión)
    try { if (E.perfil) localStorage.setItem("catappa-tema", t); else localStorage.removeItem("catappa-tema"); } catch (e) {}
  },
  /* elegir un tema: solo con la sesión iniciada; se guarda en la cuenta */
  aplicar: function (t) {
    if (!F.tema.puedeCambiar() || TEMAS.indexOf(t) < 0) return false;
    E.perfil.tema = t;
    F.tema.pintar(t);
    F.guardarSesionCache();
    if (E.modo === "servidor") F.api("POST", "/api/perfil", { tema: t }).then(function (d) { E.perfil = d.perfil; F.guardarSesionCache(); }).catch(function () {});
    F.pintarBotonTema();
    return true;
  },
  alternar: function () {
    if (!F.tema.puedeCambiar()) return;
    var oscuro = document.documentElement.getAttribute("data-theme") === "dark";
    F.tema.aplicar(oscuro ? "claro" : "oscuro");
  },
  /* tras iniciar o cerrar sesión, o al cargar el perfil */
  sincronizar: function () { F.tema.pintar(F.tema.actual()); F.pintarBotonTema(); }
};

if (window.matchMedia) {
  var mqTema = matchMedia("(prefers-color-scheme: dark)");
  var cambioSistema = function () { if (F.tema.actual() === "sistema") F.tema.sincronizar(); };
  if (mqTema.addEventListener) mqTema.addEventListener("change", cambioSistema);
}

/* ---------------- catálogo de cursos ----------------
   La estructura (unidades, lecciones, nº de pasos) viene del índice ligero
   cursos/_indice.js. Los pasos de cada lección se cargan solo al abrir el curso. */
var NIVELES_ORDEN = ["Fundamentos", "Intermedio", "Avanzado", "Experto", "Maestro"];
F.NIVELES = NIVELES_ORDEN;
var cacheCursos = null;
F.cursos = function () {
  if (cacheCursos) return cacheCursos;
  var indice = window.CURSOS_INDICE || {};
  cacheCursos = (window.CURSOS_META || []).filter(function (m) { return indice[m.id]; }).map(function (m) {
    var unidades = indice[m.id].unidades.map(function (u, i) {
      return Object.assign({}, u, { nivel: u.nivel || (m.niveles && m.niveles[i]) || null });
    });
    return Object.assign({}, m, { unidades: unidades, ficheros: indice[m.id].ficheros });
  });
  return cacheCursos;
};
F.curso = function (id) { return F.cursos().find(function (c) { return c.id === id; }) || null; };
F.categorias = function () {
  var out = [];
  F.cursos().forEach(function (c) { if (c.categoria && out.indexOf(c.categoria) < 0) out.push(c.categoria); });
  return out;
};
F.totalLecciones = function () { return F.cursos().reduce(function (a, c) { return a + F.lecciones(c.id).length; }, 0); };

/* carga del contenido completo de un curso (una vez) */
var cargas = {};
F.cargarCurso = function (id) {
  var c = F.curso(id);
  if (!c) return Promise.reject(new Error("Curso desconocido"));
  if (cargas[id]) return cargas[id];
  cargas[id] = Promise.all(c.ficheros.map(function (f) {
    return new Promise(function (ok, ko) {
      if (document.querySelector('script[data-curso-fichero="' + f + '"]')) return ok();
      var s = document.createElement("script");
      s.src = "cursos/" + f; s.async = false; s.dataset.cursoFichero = f;
      s.onload = function () { ok(); };
      s.onerror = function () { ko(new Error("No se pudo cargar " + f)); };
      document.head.appendChild(s);
    });
  })).then(function () { return window.CURSOS[id]; })
    .catch(function (e) { delete cargas[id]; throw e; });
  return cargas[id];
};
F.leccionCompleta = function (cursoId, leccionId) {
  var unidades = (window.CURSOS && CURSOS[cursoId]) || [];
  for (var i = 0; i < unidades.length; i++) {
    for (var j = 0; j < unidades[i].lecciones.length; j++) if (unidades[i].lecciones[j].id === leccionId) return unidades[i].lecciones[j];
  }
  return null;
};
F.lecciones = function (cursoId) {
  var c = F.curso(cursoId); if (!c) return [];
  var out = [];
  c.unidades.forEach(function (u, ui) { u.lecciones.forEach(function (l, li) { out.push({ unidad: u, ui: ui, li: li, leccion: l }); }); });
  return out;
};
F.buscarLeccion = function (cursoId, leccionId) {
  return F.lecciones(cursoId).find(function (x) { return x.leccion.id === leccionId; }) || null;
};

/* ---------------- estado ---------------- */
var E = F.E = {
  modo: "local",          // "servidor" si la API responde, "local" si no (fichero abierto a pelo)
  token: null,
  perfil: null,           // perfil del usuario con sesión
  progreso: {},           // {cursoId: {lecciones: {id: {fecha, perfecta}}, xp}}
  insignias: []           // catálogo de insignias
};

/* progreso local (invitado o sin servidor) */
function progresoLocal() { return F.leerLocal("catappa-progreso-local", { progreso: {}, actividad: {} }); }
function guardarProgresoLocal(p) { F.guardarLocal("catappa-progreso-local", p); }

F.hechas = function (cursoId) { return (E.progreso[cursoId] && E.progreso[cursoId].lecciones) || {}; };
F.estaHecha = function (cursoId, leccionId) { return !!F.hechas(cursoId)[leccionId]; };
F.porcentaje = function (cursoId) {
  var todas = F.lecciones(cursoId); if (!todas.length) return 0;
  var h = F.hechas(cursoId);
  return Math.round(todas.filter(function (x) { return h[x.leccion.id]; }).length / todas.length * 100);
};
F.contarHechas = function (cursoId) {
  var h = F.hechas(cursoId);
  return F.lecciones(cursoId).filter(function (x) { return h[x.leccion.id]; }).length;
};
/* las lecciones de un curso se abren en orden */
F.desbloqueada = function (cursoId, leccionId) {
  var todas = F.lecciones(cursoId), h = F.hechas(cursoId);
  var i = todas.findIndex(function (x) { return x.leccion.id === leccionId; });
  if (i <= 0) return i === 0;
  return !!h[todas[i - 1].leccion.id] || !!h[leccionId];
};
F.siguiente = function (cursoId) {
  var todas = F.lecciones(cursoId), h = F.hechas(cursoId);
  return todas.find(function (x) { return !h[x.leccion.id]; }) || null;
};
F.xpTotal = function () {
  return Object.keys(E.progreso).reduce(function (a, k) { return a + (E.progreso[k].xp || 0); }, 0);
};
F.actividad = function () {
  if (E.perfil && E.perfil.actividad) return E.perfil.actividad;
  return progresoLocal().actividad || {};
};
F.racha = function () {
  if (E.perfil) return E.perfil.racha || 0;
  var act = F.actividad(), n = 0, i = act[F.hoy()] ? 0 : 1;
  while (act[F.diaMenos(i)]) { n++; i++; }
  return n;
};
F.xpHoy = function () { return F.actividad()[F.hoy()] || 0; };
F.META_DIARIA = 50;

/* ---------------- API ---------------- */
F.api = function (metodo, ruta, cuerpo) {
  var op = { method: metodo, headers: { "Content-Type": "application/json" } };
  if (E.token) op.headers["x-catappa-token"] = E.token;
  if (cuerpo !== undefined) op.body = JSON.stringify(cuerpo);
  return fetch(ruta, op).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (d) {
      if (!r.ok) {
        if (r.status === 401 && E.token && ruta !== "/api/login") { F.cerrarSesion(true); }
        var e = new Error(d.error || ("Error " + r.status)); e.estado = r.status; throw e;
      }
      return d;
    });
  });
};

F.comprobarServidor = function () {
  if (location.protocol === "file:") return Promise.resolve(false);
  var ctl = window.AbortController ? new AbortController() : null;
  var t = setTimeout(function () { if (ctl) ctl.abort(); }, 2500);
  return fetch("/api/estado", ctl ? { signal: ctl.signal } : {}).then(function (r) { clearTimeout(t); return r.ok; }).catch(function () { clearTimeout(t); return false; });
};

F.aplicarSesion = function (d) {
  if (d.token) { E.token = d.token; F.guardarLocal("catappa-token", d.token); }
  E.perfil = d.perfil || E.perfil;
  E.progreso = d.progreso || E.progreso || {};
  F.guardarSesionCache();
  F.tema.sincronizar();
};
F.cerrarSesion = function (silencioso) {
  if (E.token && !silencioso) F.api("POST", "/api/logout").catch(function () {});
  E.token = null; E.perfil = null;
  try { localStorage.removeItem("catappa-token"); localStorage.removeItem("catappa-sesion-cache"); localStorage.removeItem("catappa-cola"); } catch (e) {}
  E.progreso = progresoLocal().progreso || {};
  F.tema.sincronizar();
  if (!silencioso) F.toast("Sesión cerrada");
  location.hash = "#/entrar";
};

/* ---------------- sesión en caché y cola sin conexión ---------------- */
F.guardarSesionCache = function () {
  if (E.perfil) F.guardarLocal("catappa-sesion-cache", { perfil: E.perfil, progreso: E.progreso });
};
function aplicarLocalmente(cursoId, leccionId, aciertos, preguntas) {
  var c = E.progreso[cursoId] = E.progreso[cursoId] || { lecciones: {}, xp: 0 };
  var nueva = !c.lecciones[leccionId];
  var xp = Math.min(80, (nueva ? 20 : 8) + aciertos * 2);
  c.lecciones[leccionId] = { fecha: F.hoy(), perfecta: preguntas > 0 && aciertos === preguntas };
  c.xp += xp;
  if (E.perfil) {
    E.perfil.xp = (E.perfil.xp || 0) + xp;
    E.perfil.actividad = E.perfil.actividad || {};
    E.perfil.actividad[F.hoy()] = (E.perfil.actividad[F.hoy()] || 0) + xp;
  }
  return xp;
}
F.colaPendiente = function () { return F.leerLocal("catappa-cola", []); };
F.sincronizarCola = function () {
  var cola = F.colaPendiente();
  if (!cola.length || !E.token || E.modo !== "servidor") return Promise.resolve(0);
  var enviadas = 0;
  return cola.reduce(function (p, item) {
    return p.then(function () {
      return F.api("POST", "/api/progreso", item).then(function (d) {
        E.perfil = d.perfil; E.progreso = d.progreso; enviadas++;
        F.guardarLocal("catappa-cola", F.colaPendiente().slice(1));
      });
    });
  }, Promise.resolve()).then(function () {
    F.guardarSesionCache();
    if (enviadas) { F.toast(enviadas + (enviadas === 1 ? " lección sincronizada" : " lecciones sincronizadas")); F.pintarStats(); }
    return enviadas;
  }).catch(function () { return enviadas; });
};
window.addEventListener("online", function () {
  if (E.token && E.modo !== "servidor") {
    F.comprobarServidor().then(function (hay) { if (hay) { E.modo = "servidor"; F.sincronizarCola().then(function () { F.refrescarPerfil && F.refrescarPerfil(); F.navegar(); }); } });
  } else F.sincronizarCola();
});

/* registrar una lección terminada */
F.registrarLeccion = function (cursoId, leccionId, aciertos, preguntas) {
  if (E.perfil) {
    var datos = { cursoId: cursoId, leccionId: leccionId, aciertos: aciertos, preguntas: preguntas };
    var encolar = function () {
      var cola = F.colaPendiente(); cola.push(datos); F.guardarLocal("catappa-cola", cola);
      var xp = aplicarLocalmente(cursoId, leccionId, aciertos, preguntas);
      F.guardarSesionCache();
      F.toast("Sin conexión: la lección se guardará al volver la red", "↻");
      return { xp: xp, nuevas: [] };
    };
    if (E.modo !== "servidor") return Promise.resolve(encolar());
    return F.api("POST", "/api/progreso", datos).then(function (d) {
      E.perfil = d.perfil; E.progreso = d.progreso; F.guardarSesionCache();
      return { xp: d.xp, nuevas: d.nuevasInsignias || [] };
    }).catch(function (e) {
      if (e.estado) throw e;          // error del servidor: se muestra
      E.modo = "offline"; return encolar();   // fallo de red: a la cola
    });
  }
  // modo invitado / sin servidor
  var p = progresoLocal();
  p.progreso[cursoId] = p.progreso[cursoId] || { lecciones: {}, xp: 0 };
  var c = p.progreso[cursoId];
  var nueva = !c.lecciones[leccionId];
  var xp = Math.min(80, (nueva ? 20 : 8) + aciertos * 2);
  var perfecta = preguntas > 0 && aciertos === preguntas;
  c.lecciones[leccionId] = { fecha: F.hoy(), perfecta: perfecta || !!(c.lecciones[leccionId] && c.lecciones[leccionId].perfecta) };
  c.xp += xp;
  p.actividad[F.hoy()] = (p.actividad[F.hoy()] || 0) + xp;
  p.actividadCursos = p.actividadCursos || {};
  p.actividadCursos[cursoId] = p.actividadCursos[cursoId] || {};
  p.actividadCursos[cursoId][F.hoy()] = (p.actividadCursos[cursoId][F.hoy()] || 0) + xp;
  guardarProgresoLocal(p);
  E.progreso = p.progreso;
  return Promise.resolve({ xp: xp, nuevas: [] });
};

/* reiniciar un curso: vuelve a 0, como si nunca se hubiera empezado ni abierto.
   Se borran sus lecciones, su XP (y la actividad que sumó), las unidades plegadas,
   lo pendiente de sincronizar y, para Docker, el progreso del curso antiguo guardado
   en el navegador (si no, se volvería a importar al entrar). */
F.reiniciarCurso = function (cursoId) {
  try { localStorage.removeItem("catappa-plegadas-" + cursoId); } catch (e) {}
  F.guardarLocal("catappa-cola", F.colaPendiente().filter(function (x) { return x.cursoId !== cursoId; }));
  if (cursoId === "docker") {
    try { localStorage.removeItem("ruta-docker-v1"); } catch (e) {}
    F.guardarLocal("catappa-migrado-local", true);
  }
  // copia local (invitado, o caché de la sesión)
  var p = progresoLocal(), c = p.progreso[cursoId];
  var restar = function (dia, xp) { if (!p.actividad[dia] || xp <= 0) return; p.actividad[dia] = Math.max(0, p.actividad[dia] - xp); if (!p.actividad[dia]) delete p.actividad[dia]; };
  var porDia = (p.actividadCursos || {})[cursoId] || {}, anotada = 0;
  Object.keys(porDia).forEach(function (d) { restar(d, porDia[d]); anotada += porDia[d]; });
  if (c) {
    var propias = Object.keys(c.lecciones || {}).map(function (k) { return c.lecciones[k]; }).filter(function (l) { return !l.importada; });
    var importadas = Object.keys(c.lecciones || {}).length - propias.length;
    var pendiente = Math.max(0, (c.xp || 0) - anotada - importadas * 20);
    if (pendiente && propias.length) propias.forEach(function (l) { restar(l.fecha, Math.round(pendiente / propias.length)); });
    delete p.progreso[cursoId];
  }
  if (p.actividadCursos) delete p.actividadCursos[cursoId];
  guardarProgresoLocal(p);
  if (E.perfil) {
    if (E.modo !== "servidor") return Promise.reject(new Error("Necesitas conexión con el servidor para reiniciar un curso de tu cuenta"));
    return F.api("POST", "/api/progreso/reiniciar", { cursoId: cursoId }).then(function (d) {
      E.perfil = d.perfil; E.progreso = d.progreso; F.guardarSesionCache(); F.pintarStats();
      return d;
    });
  }
  E.progreso = p.progreso;
  F.pintarStats();
  return Promise.resolve({ reiniciado: !!c });
};

/* confirmación antes de reiniciar (se usa desde la página del curso y desde Ajustes) */
F.confirmarReinicio = function (cursoId, despues) {
  var c = F.curso(cursoId); if (!c) return;
  var hechas = F.contarHechas(cursoId);
  var m = F.modal("Reiniciar " + c.titulo,
    "<p>Vas a dejar <b>" + F.esc(c.titulo) + "</b> como si nunca lo hubieras empezado: se borran tus <b>" + hechas + " lecciones completadas</b>, la XP que ganaste en el curso y su actividad en tu racha y en el ranking.</p>" +
    '<p style="margin-top:10px;color:var(--ink-2)">Las insignias se recalculan con lo que te quede. Esta acción no se puede deshacer.</p>',
    '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-peligro-lleno" id="confirmar-reinicio">Sí, reiniciar ' + F.esc(c.titulo) + "</button>");
  F.$("#confirmar-reinicio", m.el).addEventListener("click", function () {
    var b = this; b.disabled = true; b.textContent = "Reiniciando…";
    F.reiniciarCurso(cursoId).then(function () {
      m.cerrar(); F.toast(c.titulo + " se ha reiniciado: empiezas de cero");
      if (despues) despues(); else F.navegar();
    }).catch(function (e) { b.disabled = false; b.textContent = "Sí, reiniciar " + c.titulo; F.toast(e.message, "!"); });
  });
};

/* ---------------- progreso del curso antiguo (Ruta Docker) ---------------- */
F.progresoAntiguo = function () {
  var viejo = F.leerLocal("ruta-docker-v1", null);
  if (!viejo || !viejo.hechas) return [];
  return Object.keys(viejo.hechas).filter(function (id) { return viejo.hechas[id]; });
};
/* hasta dónde llegó Pablo según su mensaje: Docker · Unidad 2 · Lección 4 */
F.PROGRESO_DECLARADO = ["u1l1", "u1l2", "u1l3", "u1l4", "u1l5", "u1l6", "u2l1", "u2l2", "u2l3", "u2l4"];

F.migrarAInvitado = function () {
  if (F.leerLocal("catappa-migrado-local", false)) return 0;
  var ids = F.progresoAntiguo();
  var p = progresoLocal(); var n = 0;
  if (ids.length) {
    p.progreso.docker = p.progreso.docker || { lecciones: {}, xp: 0 };
    ids.forEach(function (id) { if (!p.progreso.docker.lecciones[id]) { p.progreso.docker.lecciones[id] = { fecha: F.hoy(), importada: true }; p.progreso.docker.xp += 20; n++; } });
    guardarProgresoLocal(p);
  }
  F.guardarLocal("catappa-migrado-local", true);
  return n;
};
/* lo que el invitado ha hecho en local, más lo del curso antiguo, listo para subir a una cuenta */
F.progresoParaImportar = function () {
  var out = {}, p = progresoLocal().progreso || {};
  Object.keys(p).forEach(function (cid) { out[cid] = Object.keys(p[cid].lecciones || {}); });
  var viejo = F.progresoAntiguo();
  if (viejo.length) { out.docker = (out.docker || []).concat(viejo).filter(function (x, i, a) { return a.indexOf(x) === i; }); }
  return out;
};

/* ---------------- insignias (catálogo para mostrar) ---------------- */
F.INSIGNIAS = [
  { id: "primer-paso", nombre: "Primer paso", desc: "Completa tu primera lección" },
  { id: "diez", nombre: "Constante", desc: "Completa 10 lecciones" },
  { id: "cincuenta", nombre: "Imparable", desc: "Completa 50 lecciones" },
  { id: "unidad", nombre: "Unidad cerrada", desc: "Completa una unidad entera" },
  { id: "perfecta", nombre: "Sin fallos", desc: "Una lección con todo a la primera" },
  { id: "racha-3", nombre: "Racha de 3", desc: "Aprende 3 días seguidos" },
  { id: "racha-7", nombre: "Semana completa", desc: "Aprende 7 días seguidos" },
  { id: "xp-500", nombre: "500 XP", desc: "Llega a 500 puntos de experiencia" },
  { id: "xp-2000", nombre: "2000 XP", desc: "Llega a 2000 puntos de experiencia" },
  { id: "primer-curso", nombre: "Curso completo", desc: "Termina un curso entero" },
  { id: "tres-cursos", nombre: "Políglota", desc: "Termina tres cursos" },
  { id: "cien", nombre: "Centenario", desc: "Completa 100 lecciones" },
  { id: "docker", nombre: "Capitán de contenedores", desc: "Termina el curso de Docker" },
  { id: "git", nombre: "Guardián del historial", desc: "Termina el curso de Git y GitHub" },
  { id: "devops", nombre: "Ingeniería de flujo", desc: "Termina el curso de DevOps" },
  { id: "pregunta", nombre: "Curiosidad", desc: "Publica tu primera pregunta" },
  { id: "ayudante", nombre: "Echa una mano", desc: "Responde a alguien en la comunidad" },
  { id: "votado", nombre: "Útil", desc: "Recibe 3 votos en una aportación" }
];
F.insigniasGanadasLocal = function () {
  var out = [], total = 0, perfectas = 0, unidades = 0;
  F.cursos().forEach(function (c) {
    var h = F.hechas(c.id);
    total += Object.keys(h).length;
    Object.keys(h).forEach(function (k) { if (h[k] && h[k].perfecta) perfectas++; });
    c.unidades.forEach(function (u) { if (u.lecciones.every(function (l) { return h[l.id]; })) unidades++; });
    if (F.porcentaje(c.id) === 100) out.push(c.id);
  });
  var xp = F.xpTotal(), r = F.racha();
  var completos = F.cursos().filter(function (c) { return F.porcentaje(c.id) === 100; }).length;
  if (completos >= 1) out.push("primer-curso"); if (completos >= 3) out.push("tres-cursos"); if (total >= 100) out.push("cien");
  if (total >= 1) out.push("primer-paso"); if (total >= 10) out.push("diez"); if (total >= 50) out.push("cincuenta");
  if (unidades >= 1) out.push("unidad"); if (perfectas >= 1) out.push("perfecta");
  if (r >= 3) out.push("racha-3"); if (r >= 7) out.push("racha-7");
  if (xp >= 500) out.push("xp-500"); if (xp >= 2000) out.push("xp-2000");
  return out;
};
F.medalla = function (id, tam) {
  var colores = { "docker": "#7aa2f7", "git": "#f26d6d", "devops": "#7fd1b9", "pregunta": "#c49bf2", "ayudante": "#c49bf2", "votado": "#c49bf2", "racha-3": "#f08a2a", "racha-7": "#f08a2a" };
  var c = colores[id] || "var(--accent-fill)";
  return '<svg class="medalla" viewBox="0 0 40 40" width="' + (tam || 38) + '" height="' + (tam || 38) + '" aria-hidden="true"><path d="M20 2l15.6 9v18L20 38 4.4 29V11z" fill="' + c + '" opacity=".18"/><path d="M20 2l15.6 9v18L20 38 4.4 29V11z" fill="none" stroke="' + c + '" stroke-width="2"/><path d="M20 11.5l2.7 5.5 6 .9-4.35 4.25 1 6L20 25.3l-5.35 2.85 1-6L11.3 17.9l6-.9z" fill="' + c + '"/></svg>';
};

/* ---------------- avisos ---------------- */
F.toast = function (texto, icono) {
  var z = F.$("#toasts"); if (!z) return;
  var t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = '<span class="ico">' + (icono || "&#10003;") + "</span><span>" + F.esc(texto) + "</span>";
  z.appendChild(t);
  setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; }, 3200);
  setTimeout(function () { t.remove(); }, 3600);
};

/* ---------------- modal ---------------- */
F.modal = function (titulo, cuerpoHTML, pieHTML) {
  var v = document.createElement("div");
  v.className = "velo";
  v.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-label="' + F.esc(titulo) + '"><div class="modal-cab"><h2>' + F.esc(titulo) + '</h2><button class="boton-icono" data-cerrar aria-label="Cerrar">' + F.icono("x") + '</button></div><div class="modal-cuerpo">' + cuerpoHTML + "</div>" + (pieHTML ? '<div class="modal-pie">' + pieHTML + "</div>" : "") + "</div>";
  document.body.appendChild(v);
  var cerrar = function () { v.remove(); document.removeEventListener("keydown", esc); };
  var esc = function (e) { if (e.key === "Escape") cerrar(); };
  document.addEventListener("keydown", esc);
  v.addEventListener("click", function (e) { if (e.target === v || e.target.closest("[data-cerrar]")) cerrar(); });
  // foco inicial en el primer campo de texto, solo si el usuario no ha puesto el foco en otro sitio
  var foco = v.querySelector('input:not([type]), input[type="text"], input[type="search"], textarea');
  if (foco) setTimeout(function () { if (!v.contains(document.activeElement) || document.activeElement === document.body) foco.focus(); }, 30);
  return { el: v, cerrar: cerrar };
};

/* ---------------- markdown mínimo y seguro para la comunidad ---------------- */
F.md = function (texto) {
  var bloques = [], s = String(texto || "");
  // bloques de código ``` ... ```
  s = s.replace(/```[a-zA-Z0-9-]*\n?([\s\S]*?)```/g, function (_, cod) { bloques.push(cod.replace(/\n$/, "")); return "\u0000" + (bloques.length - 1) + "\u0000"; });
  s = F.esc(s);
  var inline = function (t) {
    return t.replace(/`([^`\n]+)`/g, "<code>$1</code>").replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  };
  var html = [], lista = null;
  s.split(/\n/).forEach(function (linea) {
    var mBloque = linea.match(/^\u0000(\d+)\u0000$/);
    var mLista = linea.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);
    if (mBloque) { if (lista) { html.push("</" + lista + ">"); lista = null; } html.push("<pre>" + F.esc(bloques[+mBloque[1]]) + "</pre>"); return; }
    if (mLista) {
      var tipo = /^\s*\d+\./.test(linea) ? "ol" : "ul";
      if (lista !== tipo) { if (lista) html.push("</" + lista + ">"); html.push("<" + tipo + ">"); lista = tipo; }
      html.push("<li>" + inline(mLista[1]) + "</li>"); return;
    }
    if (lista) { html.push("</" + lista + ">"); lista = null; }
    if (linea.trim()) html.push("<p>" + inline(linea) + "</p>");
  });
  if (lista) html.push("</" + lista + ">");
  // bloques incrustados dentro de un párrafo (poco habitual)
  return html.join("").replace(/\u0000(\d+)\u0000/g, function (_, i) { return "<pre>" + F.esc(bloques[+i]) + "</pre>"; });
};

/* ---------------- rutas (hash: funciona también abriendo el fichero) ---------------- */
var RUTAS = [];
F.ruta = function (patron, vista, opciones) {
  RUTAS.push({ re: new RegExp("^" + patron.replace(/:(\w+)/g, "([^/]+)") + "$"), claves: (patron.match(/:(\w+)/g) || []).map(function (k) { return k.slice(1); }), vista: vista, op: opciones || {} });
};
F.ir = function (ruta) { if (location.hash !== "#" + ruta) location.hash = "#" + ruta; else F.navegar(); };
F.rutaActual = function () {
  var h = location.hash.replace(/^#/, "") || "/";
  var partes = h.split("?");
  return { camino: partes[0] || "/", query: new URLSearchParams(partes[1] || "") };
};
F.navegar = function () {
  var r = F.rutaActual();
  for (var i = 0; i < RUTAS.length; i++) {
    var m = r.camino.match(RUTAS[i].re);
    if (m) {
      var params = {};
      RUTAS[i].claves.forEach(function (k, j) { params[k] = decodeURIComponent(m[j + 1]); });
      params.query = r.query;
      var def = RUTAS[i];
      if (!def.op.sinLayout) F.layout(def.op.seccion || "", def.op.migas ? def.op.migas(params) : null);
      window.scrollTo(0, 0);
      try { def.vista(params); } catch (e) { console.error(e); F.pintar('<div class="vacio"><b>Algo ha fallado al mostrar esta página.</b>' + F.esc(e.message) + "</div>"); }
      return;
    }
  }
  F.ir("/");
};
window.addEventListener("hashchange", function () { F.navegar(); });

/* ---------------- maquetación común ---------------- */
var NAV = [
  { id: "aprender", ruta: "/", texto: "Aprender", icono: "aprender" },
  { id: "catalogo", ruta: "/cursos", texto: "Cursos", icono: "catalogo" },
  { id: "comunidad", ruta: "/comunidad", texto: "Comunidad", icono: "comunidad" },
  { id: "ranking", ruta: "/ranking", texto: "Ranking", icono: "ranking" },
  { id: "perfil", ruta: "/perfil", texto: "Perfil", icono: "perfil" }
];
F.layout = function (seccion, migas) {
  var raiz = F.$("#raiz");
  if (!F.$(".app", raiz)) {
    raiz.innerHTML =
      '<div class="app">' +
        '<aside class="lateral">' +
          '<a class="marca" href="#/">' + F.MARCA.logo + '<span class="marca-nombre">' + F.esc(F.MARCA.nombre) + "</span></a>" +
          '<nav class="nav" id="nav-principal"></nav>' +
          '<div class="nav" id="nav-cursos"></div>' +
          '<div class="lateral-pie" id="lateral-pie"></div>' +
        "</aside>" +
        '<div class="principal">' +
          '<header class="barra-sup">' +
            '<a class="marca-movil" href="#/">' + F.MARCA.logo + '<span class="marca-nombre">' + F.esc(F.MARCA.nombre) + "</span></a>" +
            '<div class="ruta" id="migas"></div>' +
            '<div class="derecha">' +
              '<button class="buscador" id="abrir-paleta" aria-label="Buscar">' + F.icono("buscar") + "<span>Buscar lección…</span><kbd>Ctrl K</kbd></button>" +
              '<span class="chip racha" title="Días seguidos aprendiendo">' + F.icono("fuego") + '<span id="st-racha">0</span></span>' +
              '<span class="chip xp" title="Puntos de experiencia">' + F.icono("rayo") + '<span id="st-xp">0</span></span>' +
              '<button class="boton-icono" id="boton-tema" aria-label="Cambiar tema"></button>' +
            "</div>" +
          "</header>" +
          '<main class="contenido" id="vista"></main>' +
        "</div>" +
        '<nav class="tabbar" id="tabbar"></nav>' +
      "</div>";
    F.$("#boton-tema").addEventListener("click", F.tema.alternar);
    F.$("#abrir-paleta").addEventListener("click", F.paleta);
  }
  var nav = NAV.map(function (n) {
    return '<a href="#' + n.ruta + '"' + (n.id === seccion ? ' aria-current="page"' : "") + ">" + F.icono(n.icono) + "<span>" + n.texto + "</span></a>";
  }).join("");
  F.$("#nav-principal").innerHTML = '<div class="nav-sec">Navegar</div>' + nav;
  F.$("#tabbar").innerHTML = nav;
  // en el lateral, solo los cursos empezados (los más avanzados primero)
  var empezados = F.cursos().filter(function (c) { return F.contarHechas(c.id) > 0; })
    .sort(function (a, b) { return F.porcentaje(b.id) - F.porcentaje(a.id); }).slice(0, 6);
  F.$("#nav-cursos").innerHTML = '<div class="nav-sec">Tus cursos</div>' + (empezados.length ? empezados.map(function (c) {
    var p = F.porcentaje(c.id);
    return '<a class="mini-curso" href="#/curso/' + c.id + '"><span class="fila"><span class="mini-nombre">' + F.logoCurso(c, "mini") + F.esc(c.titulo) + "</span><span>" + p + '%</span></span><span class="mini-barra"><i style="width:' + p + "%;background:" + c.color + '"></i></span></a>';
  }).join("") : '<a href="#/cursos" class="nav-vacio">Aún no has empezado ninguno. Elige uno en el catálogo →</a>');
  var pie = "";
  if (E.perfil) {
    pie = '<a class="usuario-chip" href="#/perfil/' + F.esc(E.perfil.usuario) + '">' + F.avatar(E.perfil) + '<span><span class="nombre">' + F.esc(E.perfil.nombre) + '</span><br><span class="sub">@' + F.esc(E.perfil.usuario) + "</span></span></a>" +
      '<div class="nav"><a href="#/ajustes"' + (seccion === "ajustes" ? ' aria-current="page"' : "") + ">" + F.icono("ajustes") + "<span>Ajustes</span></a></div>";
  } else {
    pie = (E.modo === "servidor" ? '<a class="btn btn-primario" href="#/entrar">Crear cuenta o entrar</a>' : '<span class="badge">modo sin conexión</span>') +
      '<div class="nav"><a href="#/ajustes"' + (seccion === "ajustes" ? ' aria-current="page"' : "") + ">" + F.icono("ajustes") + "<span>Ajustes</span></a></div>";
  }
  var pendientes = F.colaPendiente().length;
  var estado = E.modo === "offline"
    ? '<span class="badge" title="Tu progreso se guarda y se sincroniza al volver la red">' + F.icono("sinred").replace("<svg", '<svg style="width:12px;height:12px"') + " sin conexión" + (pendientes ? " · " + pendientes + " pendiente" + (pendientes > 1 ? "s" : "") : "") + "</span>"
    : "";
  F.$("#lateral-pie").innerHTML = estado + '<button class="btn" id="instalar-app" hidden>' + F.icono("descargar") + "Instalar la app</button>" + pie;
  F.$("#instalar-app").addEventListener("click", F.instalarApp);
  F.pintarInstalar();
  F.$("#migas").innerHTML = migas || "~/" + (seccion || "");
  F.pintarStats();
  F.pintarBotonTema();
};

/* ---------------- web app instalable (PWA) ---------------- */
var avisoInstalar = null;
window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); avisoInstalar = e; F.pintarInstalar(); });
window.addEventListener("appinstalled", function () { avisoInstalar = null; F.pintarInstalar(); F.toast("App instalada"); });
F.puedeInstalar = function () { return !!avisoInstalar; };
F.esApp = function () { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; };
F.pintarInstalar = function () { F.$$("#instalar-app, [data-instalar]").forEach(function (b) { b.hidden = !avisoInstalar; }); };
F.instalarApp = function () {
  if (!avisoInstalar) return;
  avisoInstalar.prompt();
  avisoInstalar.userChoice.then(function () { avisoInstalar = null; F.pintarInstalar(); });
};
F.pintarStats = function () {
  var r = F.$("#st-racha"), x = F.$("#st-xp");
  if (r) r.textContent = F.racha();
  if (x) x.textContent = F.num(E.perfil ? E.perfil.xp : F.xpTotal());
};
F.pintarBotonTema = function () {
  var b = F.$("#boton-tema"); if (!b) return;
  b.hidden = !F.tema.puedeCambiar();   // sin sesión el tema no se puede cambiar
  var oscuro = document.documentElement.getAttribute("data-theme") === "dark";
  b.innerHTML = F.icono(oscuro ? "sol" : "luna");
  b.title = oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
};
/* ojo para ver u ocultar la contraseña: se añade solo a todos los campos de contraseña,
   también a los que aparezcan después (formularios, modales) */
F.mejorarClaves = function (raiz) {
  F.$$('input[type="password"]:not([data-ojo])', raiz || document).forEach(function (i) {
    i.setAttribute("data-ojo", "1");
    var env = document.createElement("span"); env.className = "clave-env";
    i.parentNode.insertBefore(env, i); env.appendChild(i);
    var b = document.createElement("button");
    b.type = "button"; b.className = "clave-ojo"; b.setAttribute("aria-pressed", "false");
    var pinta = function () {
      var visible = i.type === "text";
      b.innerHTML = F.icono(visible ? "ojoNo" : "ojo");
      b.setAttribute("aria-label", visible ? "Ocultar contraseña" : "Mostrar contraseña");
      b.title = visible ? "Ocultar contraseña" : "Mostrar contraseña";
      b.setAttribute("aria-pressed", String(visible));
    };
    b.addEventListener("click", function () {
      var pos = i.selectionStart;
      i.type = i.type === "password" ? "text" : "password";
      pinta(); i.focus();
      try { if (pos != null) i.setSelectionRange(pos, pos); } catch (e) {}
    });
    pinta(); env.appendChild(b);
  });
};
if (window.MutationObserver) {
  new MutationObserver(function () { F.mejorarClaves(); }).observe(document.documentElement, { childList: true, subtree: true });
}

F.pintar = function (html) { var v = F.$("#vista"); if (v) v.innerHTML = html; return v; };

/* ---------------- paleta de comandos (Ctrl+K) ---------------- */
F.paleta = function () {
  if (F.$(".paleta")) return;
  var items = [];
  [["Ir a Aprender", "#/", "página"], ["Ir a Comunidad", "#/comunidad", "página"], ["Ir a Ranking", "#/ranking", "página"], ["Mi perfil", "#/perfil", "página"], ["Ajustes", "#/ajustes", "página"]]
    .forEach(function (x) { items.push({ texto: x[0], href: x[1], extra: x[2], grupo: "Navegación" }); });
  F.cursos().forEach(function (c) {
    items.push({ texto: "Curso de " + c.titulo, href: "#/curso/" + c.id, extra: F.porcentaje(c.id) + "%", grupo: "Cursos" });
    F.lecciones(c.id).forEach(function (x) {
      items.push({ texto: x.leccion.titulo, href: "#/leccion/" + c.id + "/" + x.leccion.id, extra: c.titulo + " · U" + (x.ui + 1) + " L" + (x.li + 1), grupo: "Lecciones", cursoId: c.id, leccionId: x.leccion.id,
        busca: x.unidad.titulo + " " + (x.leccion.claves || []).join(" ") });
    });
  });
  var v = document.createElement("div");
  v.className = "velo";
  v.innerHTML = '<div class="paleta" role="dialog" aria-label="Buscar"><div class="paleta-in"><span>&gt;</span><input id="paleta-q" placeholder="Busca una lección, un curso o una sección…" autocomplete="off"><kbd>Esc</kbd></div><div class="paleta-res" id="paleta-res"></div></div>';
  document.body.appendChild(v);
  var q = F.$("#paleta-q"), res = F.$("#paleta-res"), activo = 0, visibles = [];
  var cerrar = function () { v.remove(); document.removeEventListener("keydown", tecla); };
  function pintar() {
    var t = q.value.trim().toLowerCase();
    var sinTildes = function (s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
    var palabras = sinTildes(t).split(/\s+/).filter(Boolean);
    visibles = items.filter(function (it) {
      var hay = sinTildes(it.texto + " " + it.extra + " " + (it.busca || ""));
      return palabras.every(function (w) { return hay.indexOf(w) >= 0; });
    }).sort(function (a, b) {
      // grupos juntos y, dentro de cada grupo, primero lo que coincide en el título
      var g = { "Navegación": 0, "Cursos": 1, "Lecciones": 2 };
      var ta = sinTildes(a.texto).indexOf(palabras[0] || "") >= 0 ? 0 : 1, tb = sinTildes(b.texto).indexOf(palabras[0] || "") >= 0 ? 0 : 1;
      return (g[a.grupo] - g[b.grupo]) || (ta - tb);
    }).slice(0, 40);
    if (activo >= visibles.length) activo = 0;
    var grupo = "", html = "";
    visibles.forEach(function (it, i) {
      if (it.grupo !== grupo) { grupo = it.grupo; html += '<div class="grupo">' + grupo + "</div>"; }
      var bloq = it.leccionId && !F.desbloqueada(it.cursoId, it.leccionId);
      html += '<a href="' + it.href + '" data-i="' + i + '"' + (i === activo ? ' class="activo"' : "") + ">" + F.esc(it.texto) + (bloq ? " " + F.icono("candado", "") .replace("<svg", '<svg style="width:13px;height:13px;color:var(--ink-3)"') : "") + "<small>" + F.esc(it.extra) + "</small></a>";
    });
    res.innerHTML = html || '<div class="vacio">Sin resultados</div>';
  }
  var tecla = function (e) {
    if (e.key === "Escape") return cerrar();
    if (e.key === "ArrowDown") { activo = Math.min(visibles.length - 1, activo + 1); pintar(); e.preventDefault(); }
    if (e.key === "ArrowUp") { activo = Math.max(0, activo - 1); pintar(); e.preventDefault(); }
    if (e.key === "Enter" && visibles[activo]) { location.hash = visibles[activo].href; cerrar(); }
  };
  document.addEventListener("keydown", tecla);
  q.addEventListener("input", function () { activo = 0; pintar(); });
  v.addEventListener("click", function (e) { if (e.target === v) cerrar(); if (e.target.closest("a")) cerrar(); });
  pintar(); q.focus();
};
document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (!F.$(".leccion-pant")) F.paleta(); }
});

})();
