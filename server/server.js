"use strict";
/* =====================================================================
   CATAPPA — servidor
   Node puro (sin dependencias): sirve la web y la API REST.
   ===================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const db = require("./db");
const semilla = require("./semilla");

const PUERTO = +process.env.PORT || 3000;
const PUBLICO = path.join(__dirname, "..", "public");
const MAX_BODY = 64 * 1024;

/* ---------------- catálogo de cursos (leído de los mismos ficheros que usa el navegador) ---------------- */
const CATALOGO = {};   // {cursoId: {lecciones: Set, unidades: [[ids]], total, titulo}}
function cargarCatalogo() {
  const dir = path.join(PUBLICO, "cursos");
  const ctx = vm.createContext({});
  ctx.window = ctx;
  const ficheros = fs.readdirSync(dir).filter(f => f.endsWith(".js")).sort();
  for (const f of ficheros) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f });
  const C = ctx.CURSOS || {};
  for (const id of Object.keys(C)) {
    const unidades = C[id].map(u => u.lecciones.map(l => l.id));
    CATALOGO[id] = { unidades, lecciones: new Set(unidades.flat()), total: unidades.flat().length };
  }
  for (const m of ctx.CURSOS_META || []) if (CATALOGO[m.id]) CATALOGO[m.id].titulo = m.titulo;
  console.log("[catalogo]", Object.entries(CATALOGO).map(([k, v]) => k + ":" + v.total).join("  "));
}

/* ---------------- utilidades ---------------- */
const hoy = () => new Date().toISOString().slice(0, 10);
const diaMenos = (n) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };

function hashClave(clave, salt) {
  return crypto.scryptSync(clave, salt, 64).toString("hex");
}
function limpiarTexto(s, max) {
  return String(s == null ? "" : s).replace(/\u0000/g, "").trim().slice(0, max);
}
const COLORES = ["#179493", "#f5b642", "#7fd1b9", "#7aa2f7", "#f26d6d", "#c49bf2", "#8fd16a", "#f29e6d", "#6dd3f2"];

/* el curso de Docker pasó a usar ids con prefijo (u1l1 -> dk1l1): se renombra el progreso guardado */
function migrarIdsDocker() {
  const prog = db.get("progreso");
  let n = 0;
  for (const uid of Object.keys(prog)) {
    const c = prog[uid].docker;
    if (!c || !c.lecciones) continue;
    for (const id of Object.keys(c.lecciones)) {
      if (!/^u\d+l\d+$/.test(id)) continue;
      const nuevo = "dk" + id.slice(1);
      if (!c.lecciones[nuevo]) c.lecciones[nuevo] = c.lecciones[id];
      delete c.lecciones[id];
      n++;
    }
  }
  if (n) { db.guardar("progreso"); console.log("[migracion] " + n + " lecciones de Docker renombradas a dk*"); }
}

/* ---------------- certificados ----------------
   Al completar todas las lecciones de un curso se emite un certificado con un código
   único que cualquiera puede verificar en /#/certificado/<código>. Se emite una sola vez
   por curso (conserva el nombre y la fecha de ese momento) y se borra si se reinicia el curso. */
function nuevoCodigo() {
  const todos = new Set(Object.values(db.get("certificados")).flatMap(c => Object.values(c).map(x => x.codigo)));
  let c;
  do { const h = crypto.randomBytes(6).toString("hex").toUpperCase(); c = "CAT-" + h.slice(0, 4) + "-" + h.slice(4, 8) + "-" + h.slice(8); } while (todos.has(c));
  return c;
}
function emitirCertificados(u) {
  const certs = db.get("certificados"), p = db.get("progreso")[u.id] || {};
  const mios = certs[u.id] = certs[u.id] || {};
  const nuevos = [];
  for (const [cid, cat] of Object.entries(CATALOGO)) {
    if (mios[cid] || !cat.total) continue;
    const hechas = Object.keys((p[cid] && p[cid].lecciones) || {}).filter(l => cat.lecciones.has(l)).length;
    if (hechas < cat.total) continue;
    mios[cid] = { codigo: nuevoCodigo(), curso: cid, titulo: cat.titulo || cid, lecciones: cat.total, nombre: u.nombre || u.usuario, fecha: hoy() };
    nuevos.push(mios[cid]);
  }
  if (nuevos.length) db.guardar("certificados");
  return nuevos;
}
const certificadosDe = (uid) => Object.values(db.get("certificados")[uid] || {}).sort((a, b) => a.fecha < b.fecha ? 1 : -1);

/* ---------------- lógica de juego ---------------- */
function racha(uid) {
  const act = db.get("actividad")[uid] || {};
  let n = 0;
  // la racha sigue viva si hubo actividad hoy o ayer
  let i = act[hoy()] ? 0 : 1;
  while (act[diaMenos(i)]) { n++; i++; }
  return n;
}
function xpTotal(uid) {
  const p = db.get("progreso")[uid] || {};
  return Object.values(p).reduce((a, c) => a + (c.xp || 0), 0);
}
function xpSemana(uid) {
  const act = db.get("actividad")[uid] || {};
  let t = 0;
  for (let i = 0; i < 7; i++) t += act[diaMenos(i)] || 0;
  return t;
}
function leccionesHechas(uid) {
  const p = db.get("progreso")[uid] || {};
  return Object.values(p).reduce((a, c) => a + Object.keys(c.lecciones || {}).length, 0);
}

const INSIGNIAS = [
  { id: "primer-paso",  nombre: "Primer paso",       desc: "Completa tu primera lección",            ok: (u) => u.hechas >= 1 },
  { id: "diez",         nombre: "Constante",         desc: "Completa 10 lecciones",                  ok: (u) => u.hechas >= 10 },
  { id: "cincuenta",    nombre: "Imparable",         desc: "Completa 50 lecciones",                  ok: (u) => u.hechas >= 50 },
  { id: "unidad",       nombre: "Unidad cerrada",    desc: "Completa una unidad entera",             ok: (u) => u.unidades >= 1 },
  { id: "perfecta",     nombre: "Sin fallos",        desc: "Una lección con todo a la primera",      ok: (u) => u.perfectas >= 1 },
  { id: "racha-3",      nombre: "Racha de 3",        desc: "Aprende 3 días seguidos",                ok: (u) => u.racha >= 3 },
  { id: "racha-7",      nombre: "Semana completa",   desc: "Aprende 7 días seguidos",                ok: (u) => u.racha >= 7 },
  { id: "xp-500",       nombre: "500 XP",            desc: "Llega a 500 puntos de experiencia",      ok: (u) => u.xp >= 500 },
  { id: "xp-2000",      nombre: "2000 XP",           desc: "Llega a 2000 puntos de experiencia",     ok: (u) => u.xp >= 2000 },
  { id: "primer-curso", nombre: "Curso completo",    desc: "Termina un curso entero",                ok: (u) => Object.values(u.cursos).some(Boolean) },
  { id: "tres-cursos",  nombre: "Políglota",         desc: "Termina tres cursos",                    ok: (u) => Object.values(u.cursos).filter(Boolean).length >= 3 },
  { id: "cien",         nombre: "Centenario",        desc: "Completa 100 lecciones",                 ok: (u) => u.hechas >= 100 },
  { id: "docker",       nombre: "Capitán de contenedores", desc: "Termina el curso de Docker",        ok: (u) => u.cursos.docker },
  { id: "git",          nombre: "Guardián del historial",  desc: "Termina el curso de Git y GitHub",  ok: (u) => u.cursos.git },
  { id: "devops",       nombre: "Ingeniería de flujo",     desc: "Termina el curso de DevOps",        ok: (u) => u.cursos.devops },
  { id: "pregunta",     nombre: "Curiosidad",        desc: "Publica tu primera pregunta",            ok: (u) => u.posts >= 1 },
  { id: "ayudante",     nombre: "Echa una mano",     desc: "Responde a alguien en la comunidad",     ok: (u) => u.respuestas >= 1 },
  { id: "votado",       nombre: "Útil",              desc: "Recibe 3 votos en una aportación",       ok: (u) => u.maxVotos >= 3 }
];

function resumenUsuario(uid) {
  const p = db.get("progreso")[uid] || {};
  let unidades = 0, perfectas = 0;
  const cursos = {};
  for (const [cid, cat] of Object.entries(CATALOGO)) {
    const hechas = (p[cid] && p[cid].lecciones) || {};
    unidades += cat.unidades.filter(u => u.length && u.every(l => hechas[l])).length;
    cursos[cid] = cat.total > 0 && cat.total === Object.keys(hechas).filter(l => cat.lecciones.has(l)).length;
    perfectas += Object.values(hechas).filter(h => h && h.perfecta).length;
  }
  const posts = db.get("posts");
  const mios = posts.filter(x => x.autor === uid);
  const resps = posts.flatMap(x => x.respuestas).filter(r => r.autor === uid);
  const maxVotos = Math.max(0, ...mios.map(x => x.votos.length), ...resps.map(r => r.votos.length));
  return {
    xp: xpTotal(uid), hechas: leccionesHechas(uid), racha: racha(uid), unidades, perfectas, cursos,
    posts: mios.length, respuestas: resps.length, maxVotos
  };
}

function perfilPublico(u, completo) {
  const r = resumenUsuario(u.id);
  const out = {
    usuario: u.usuario, nombre: u.nombre, color: u.color, bio: u.bio || "", rol: u.rol || "alumno",
    creado: u.creado, xp: r.xp, racha: r.racha, lecciones: r.hechas,
    insignias: INSIGNIAS.filter(i => i.ok(r)).map(i => i.id),
    certificados: certificadosDe(u.id).map(({ codigo, curso, titulo, fecha, lecciones }) => ({ codigo, curso, titulo, fecha, lecciones }))
  };
  if (completo) {
    out.tema = u.tema || "sistema";   // preferencia privada: solo en el perfil propio
    const p = db.get("progreso")[u.id] || {};
    out.cursos = {};
    for (const [cid, cat] of Object.entries(CATALOGO)) {
      const hechas = (p[cid] && p[cid].lecciones) || {};
      out.cursos[cid] = { hechas: Object.keys(hechas).filter(l => cat.lecciones.has(l)).length, total: cat.total, xp: (p[cid] && p[cid].xp) || 0 };
    }
    out.actividad = db.get("actividad")[u.id] || {};
  }
  return out;
}

/* ---------------- sesión ---------------- */
function usuarioDe(req) {
  const t = req.headers["x-catappa-token"] || req.headers["x-forja-token"];   // x-forja-token: pestañas con la versión anterior en caché
  if (!t) return null;
  const s = db.get("sesiones")[t];
  if (!s) return null;
  return db.get("usuarios").find(u => u.id === s.uid) || null;
}
function crearSesion(uid) {
  const token = crypto.randomBytes(24).toString("hex");
  db.get("sesiones")[token] = { uid, creado: Date.now() };
  db.guardar("sesiones");
  return token;
}

/* ---------------- HTTP ---------------- */
function enviar(res, codigo, datos) {
  const cuerpo = JSON.stringify(datos);
  res.writeHead(codigo, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(cuerpo);
}
const error = (res, codigo, msg) => enviar(res, codigo, { error: msg });

function leerCuerpo(req) {
  return new Promise((ok, ko) => {
    let n = 0; const trozos = [];
    req.on("data", c => { n += c.length; if (n > MAX_BODY) { ko(new Error("demasiado grande")); req.destroy(); } else trozos.push(c); });
    req.on("end", () => { try { ok(trozos.length ? JSON.parse(Buffer.concat(trozos).toString("utf8")) : {}); } catch (e) { ko(new Error("JSON inválido")); } });
    req.on("error", ko);
  });
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json"
};
function estatico(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  const fichero = path.normalize(path.join(PUBLICO, rel));
  if (!fichero.startsWith(PUBLICO)) { res.writeHead(403); return res.end(); }
  fs.stat(fichero, (err, st) => {
    const servir = (f) => {
      res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-cache" });
      fs.createReadStream(f).pipe(res);
    };
    if (!err && st.isFile()) return servir(fichero);
    // rutas de la SPA (/comunidad, /perfil/pablo...) -> index.html
    if (!path.extname(rel)) return servir(path.join(PUBLICO, "index.html"));
    res.writeHead(404, { "Content-Type": "text/plain" }); res.end("No encontrado");
  });
}

/* ---------------- API ---------------- */
const RUTAS = [];
const ruta = (metodo, patron, fn, auth) => RUTAS.push({ metodo, re: new RegExp("^" + patron.replace(/:(\w+)/g, "(?<$1>[^/]+)") + "$"), fn, auth });

ruta("GET", "/api/estado", (req, res) => enviar(res, 200, { ok: true, cursos: Object.fromEntries(Object.entries(CATALOGO).map(([k, v]) => [k, v.total])), usuarios: db.get("usuarios").length }));

ruta("POST", "/api/registro", async (req, res, b) => {
  const usuario = limpiarTexto(b.usuario, 20).toLowerCase();
  const nombre = limpiarTexto(b.nombre, 40) || usuario;
  const clave = String(b.clave || "");
  if (!/^[a-z0-9_-]{3,20}$/.test(usuario)) return error(res, 400, "El usuario debe tener entre 3 y 20 caracteres: letras minúsculas, números, - o _.");
  if (clave.length < 6) return error(res, 400, "La contraseña debe tener al menos 6 caracteres.");
  const us = db.get("usuarios");
  if (us.some(u => u.usuario === usuario)) return error(res, 409, "Ese nombre de usuario ya existe.");
  const salt = crypto.randomBytes(16).toString("hex");
  const u = { id: db.id(), usuario, nombre, salt, hash: hashClave(clave, salt), color: COLORES[us.length % COLORES.length], bio: "", creado: new Date().toISOString(), rol: "alumno" };
  us.push(u); db.guardar("usuarios");
  // importación de progreso previo (del curso antiguo, guardado en el navegador)
  if (b.importar && typeof b.importar === "object") importarProgreso(u.id, b.importar);
  enviar(res, 201, { token: crearSesion(u.id), perfil: perfilPublico(u, true), progreso: db.get("progreso")[u.id] || {} });
});

ruta("POST", "/api/login", async (req, res, b) => {
  const usuario = limpiarTexto(b.usuario, 20).toLowerCase();
  const u = db.get("usuarios").find(x => x.usuario === usuario);
  if (!u || u.hash !== hashClave(String(b.clave || ""), u.salt)) return error(res, 401, "Usuario o contraseña incorrectos.");
  enviar(res, 200, { token: crearSesion(u.id), perfil: perfilPublico(u, true), progreso: db.get("progreso")[u.id] || {} });
});

ruta("POST", "/api/logout", (req, res) => {
  const t = req.headers["x-catappa-token"] || req.headers["x-forja-token"];   // x-forja-token: pestañas con la versión anterior en caché
  if (t) { delete db.get("sesiones")[t]; db.guardar("sesiones"); }
  enviar(res, 200, { ok: true });
}, true);

ruta("GET", "/api/yo", (req, res, b, u) => {
  const nuevos = emitirCertificados(u);
  enviar(res, 200, { perfil: perfilPublico(u, true), progreso: db.get("progreso")[u.id] || {}, nuevosCertificados: nuevos });
}, true);

ruta("POST", "/api/perfil", (req, res, b, u) => {
  if (b.nombre !== undefined) u.nombre = limpiarTexto(b.nombre, 40) || u.usuario;
  if (b.bio !== undefined) u.bio = limpiarTexto(b.bio, 240);
  if (b.color && /^#[0-9a-fA-F]{6}$/.test(b.color)) u.color = b.color;
  if (b.tema !== undefined && ["sistema", "claro", "oscuro"].includes(b.tema)) u.tema = b.tema;
  db.guardar("usuarios");
  enviar(res, 200, { perfil: perfilPublico(u, true) });
}, true);

function importarProgreso(uid, datos) {
  // los navegadores con el curso antiguo de Docker envían ids u1l1: se traducen a dk1l1
  for (const cid of Object.keys(datos)) if (cid === "docker") datos[cid] = (datos[cid] || []).map(x => /^u\d+l\d+$/.test(x) ? "dk" + x.slice(1) : x);
  // datos: {cursoId: [leccionIds]}
  const prog = db.get("progreso");
  prog[uid] = prog[uid] || {};
  let n = 0;
  for (const [cid, ids] of Object.entries(datos)) {
    const cat = CATALOGO[cid]; if (!cat || !Array.isArray(ids)) continue;
    const c = prog[uid][cid] = prog[uid][cid] || { lecciones: {}, xp: 0 };
    for (const id of ids) if (cat.lecciones.has(id) && !c.lecciones[id]) { c.lecciones[id] = { fecha: hoy(), importada: true }; c.xp += 20; n++; }
  }
  // lo importado suma XP, pero no cuenta como actividad de hoy (no se hizo hoy): no infla racha ni objetivo diario
  db.guardar("progreso");
  return n;
}
ruta("POST", "/api/importar", (req, res, b, u) => {
  const n = importarProgreso(u.id, b.progreso || {});
  emitirCertificados(u);
  enviar(res, 200, { importadas: n, perfil: perfilPublico(u, true), progreso: db.get("progreso")[u.id] || {} });
}, true);

ruta("POST", "/api/progreso", (req, res, b, u) => {
  const cat = CATALOGO[b.cursoId];
  if (!cat || !cat.lecciones.has(b.leccionId)) return error(res, 400, "Lección desconocida.");
  const antes = new Set(perfilPublico(u).insignias);
  const prog = db.get("progreso");
  prog[u.id] = prog[u.id] || {};
  const c = prog[u.id][b.cursoId] = prog[u.id][b.cursoId] || { lecciones: {}, xp: 0 };
  const nueva = !c.lecciones[b.leccionId];
  const aciertos = Math.max(0, +b.aciertos || 0), preguntas = Math.max(0, +b.preguntas || 0);
  const xp = Math.min(80, (nueva ? 20 : 8) + aciertos * 2);   // tope por lección: el XP no se puede inflar
  const perfecta = preguntas > 0 && aciertos === preguntas;
  c.lecciones[b.leccionId] = { fecha: hoy(), perfecta: perfecta || !!(c.lecciones[b.leccionId] && c.lecciones[b.leccionId].perfecta) };
  c.xp += xp;
  const act = db.get("actividad");
  act[u.id] = act[u.id] || {};
  act[u.id][hoy()] = (act[u.id][hoy()] || 0) + xp;
  const ac = db.get("actividadCursos");
  ac[u.id] = ac[u.id] || {}; ac[u.id][b.cursoId] = ac[u.id][b.cursoId] || {};
  ac[u.id][b.cursoId][hoy()] = (ac[u.id][b.cursoId][hoy()] || 0) + xp;
  db.guardar("progreso"); db.guardar("actividad"); db.guardar("actividadCursos");
  const certificados = emitirCertificados(u);
  const perfil = perfilPublico(u, true);
  const nuevas = perfil.insignias.filter(i => !antes.has(i));
  enviar(res, 200, { xp, perfil, progreso: prog[u.id], nuevasInsignias: nuevas, nuevosCertificados: certificados });
}, true);

/* reiniciar un curso: se borran sus lecciones y su XP, y esa XP se descuenta de la actividad
   (mapa, racha, ranking semanal), como si nunca se hubiera empezado */
function reiniciarCurso(uid, cid) {
  const prog = db.get("progreso"), act = db.get("actividad"), ac = db.get("actividadCursos");
  const c = (prog[uid] || {})[cid];
  const dias = act[uid] || {};
  const restar = (dia, xp) => { if (!dias[dia] || xp <= 0) return; dias[dia] = Math.max(0, dias[dia] - xp); if (!dias[dia]) delete dias[dia]; };
  const porDia = (ac[uid] || {})[cid] || {};
  let anotada = 0;
  for (const [dia, xp] of Object.entries(porDia)) { restar(dia, xp); anotada += xp; }
  if (c) {
    // progreso anterior al registro por curso: se descuenta en el día de cada lección
    // (lo importado del curso antiguo no contó como actividad, así que no se descuenta)
    const propias = Object.values(c.lecciones || {}).filter(l => !l.importada);
    const importadas = Object.keys(c.lecciones || {}).length - propias.length;
    const pendiente = Math.max(0, (c.xp || 0) - anotada - importadas * 20);
    if (pendiente && propias.length) {
      const cada = Math.round(pendiente / propias.length);
      for (const l of propias) restar(l.fecha, cada);
    }
    delete prog[uid][cid];
  }
  if (ac[uid]) delete ac[uid][cid];
  const certs = db.get("certificados");
  if (certs[uid]) delete certs[uid][cid];
  db.guardar("progreso"); db.guardar("actividad"); db.guardar("actividadCursos"); db.guardar("certificados");
  return !!c;
}
ruta("POST", "/api/progreso/reiniciar", (req, res, b, u) => {
  if (!CATALOGO[b.cursoId]) return error(res, 400, "Curso desconocido.");
  const habia = reiniciarCurso(u.id, b.cursoId);
  enviar(res, 200, { reiniciado: habia, perfil: perfilPublico(u, true), progreso: db.get("progreso")[u.id] || {} });
}, true);

ruta("GET", "/api/certificados/:codigo", (req, res, b, u, q, prm) => {
  const codigo = String(prm.codigo || "").toUpperCase();
  for (const [uid, cs] of Object.entries(db.get("certificados"))) {
    const c = Object.values(cs).find(x => x.codigo === codigo);
    if (!c) continue;
    const dueño = db.get("usuarios").find(x => x.id === uid);
    return enviar(res, 200, Object.assign({ valido: true, usuario: dueño ? dueño.usuario : null }, c));
  }
  error(res, 404, "No existe ningún certificado con ese código.");
});

ruta("GET", "/api/insignias", (req, res) => enviar(res, 200, INSIGNIAS.map(({ id, nombre, desc }) => ({ id, nombre, desc }))));

ruta("GET", "/api/ranking", (req, res, b, u, q) => {
  const semana = q.get("rango") === "semana";
  const lista = db.get("usuarios").map(x => ({
    usuario: x.usuario, nombre: x.nombre, color: x.color, rol: x.rol,
    xp: semana ? xpSemana(x.id) : xpTotal(x.id), racha: racha(x.id), lecciones: leccionesHechas(x.id)
  })).sort((a, b2) => b2.xp - a.xp || b2.lecciones - a.lecciones).slice(0, 100);
  enviar(res, 200, lista);
});

ruta("GET", "/api/perfil/:usuario", (req, res, b, u, q, p) => {
  const x = db.get("usuarios").find(y => y.usuario === p.usuario);
  if (!x) return error(res, 404, "No existe ese usuario.");
  const out = perfilPublico(x, true);
  delete out.tema;   // preferencia privada
  out.posts = db.get("posts").filter(y => y.autor === x.id).slice(-20).reverse().map(y => resumenPost(y));
  enviar(res, 200, out);
});

/* ---- comunidad ---- */
function autor(uid) {
  const x = db.get("usuarios").find(y => y.id === uid);
  return x ? { usuario: x.usuario, nombre: x.nombre, color: x.color, rol: x.rol } : { usuario: "?", nombre: "Usuario eliminado", color: "#888888" };
}
function resumenPost(p, uid) {
  return {
    id: p.id, tipo: p.tipo, titulo: p.titulo, extracto: p.cuerpo.slice(0, 220), cursoId: p.cursoId, leccionId: p.leccionId,
    creado: p.creado, autor: autor(p.autor), votos: p.votos.length, votado: uid ? p.votos.includes(uid) : false,
    respuestas: p.respuestas.length, resuelta: p.respuestas.some(r => r.aceptada), etiquetas: p.etiquetas || []
  };
}
ruta("GET", "/api/comunidad", (req, res, b, u, q) => {
  const curso = q.get("curso"), leccion = q.get("leccion"), orden = q.get("orden") || "recientes", texto = (q.get("q") || "").toLowerCase(), tipo = q.get("tipo");
  let lista = db.get("posts").slice();
  if (curso) lista = lista.filter(p => p.cursoId === curso);
  if (leccion) lista = lista.filter(p => p.leccionId === leccion);
  if (tipo) lista = lista.filter(p => p.tipo === tipo);
  if (texto) lista = lista.filter(p => (p.titulo + " " + p.cuerpo + " " + (p.etiquetas || []).join(" ")).toLowerCase().includes(texto));
  if (orden === "votos") lista.sort((a, b2) => b2.votos.length - a.votos.length || b2.creado.localeCompare(a.creado));
  else if (orden === "sin-respuesta") lista = lista.filter(p => !p.respuestas.length).sort((a, b2) => b2.creado.localeCompare(a.creado));
  else lista.sort((a, b2) => b2.creado.localeCompare(a.creado));
  enviar(res, 200, lista.slice(0, 80).map(p => resumenPost(p, u && u.id)));
}, false, true);

ruta("POST", "/api/comunidad", (req, res, b, u) => {
  const titulo = limpiarTexto(b.titulo, 140), cuerpo = limpiarTexto(b.cuerpo, 8000);
  if (titulo.length < 8) return error(res, 400, "El título es demasiado corto (mínimo 8 caracteres).");
  if (cuerpo.length < 10) return error(res, 400, "Cuenta un poco más en el cuerpo (mínimo 10 caracteres).");
  const tipo = ["pregunta", "debate", "recurso"].includes(b.tipo) ? b.tipo : "pregunta";
  const etiquetas = (Array.isArray(b.etiquetas) ? b.etiquetas : []).map(e => limpiarTexto(e, 20).toLowerCase().replace(/[^a-z0-9áéíóúñ.-]/g, "")).filter(Boolean).slice(0, 4);
  const p = { id: db.id(), autor: u.id, cursoId: CATALOGO[b.cursoId] ? b.cursoId : null, leccionId: limpiarTexto(b.leccionId, 20) || null,
    tipo, titulo, cuerpo, etiquetas, creado: new Date().toISOString(), votos: [], respuestas: [] };
  db.get("posts").push(p); db.guardar("posts");
  enviar(res, 201, resumenPost(p, u.id));
}, true);

ruta("GET", "/api/comunidad/:id", (req, res, b, u, q, prm) => {
  const p = db.get("posts").find(x => x.id === prm.id);
  if (!p) return error(res, 404, "Esa publicación no existe.");
  const uid = u && u.id;
  enviar(res, 200, Object.assign(resumenPost(p, uid), {
    cuerpo: p.cuerpo, esMio: uid === p.autor,
    respuestas: p.respuestas.slice().sort((a, b2) => (b2.aceptada - a.aceptada) || (b2.votos.length - a.votos.length) || a.creado.localeCompare(b2.creado))
      .map(r => ({ id: r.id, cuerpo: r.cuerpo, creado: r.creado, autor: autor(r.autor), votos: r.votos.length, votado: uid ? r.votos.includes(uid) : false, aceptada: !!r.aceptada, esMia: uid === r.autor }))
  }));
}, false, true);

ruta("POST", "/api/comunidad/:id/respuestas", (req, res, b, u, q, prm) => {
  const p = db.get("posts").find(x => x.id === prm.id);
  if (!p) return error(res, 404, "Esa publicación no existe.");
  const cuerpo = limpiarTexto(b.cuerpo, 8000);
  if (cuerpo.length < 5) return error(res, 400, "La respuesta está vacía.");
  p.respuestas.push({ id: db.id(), autor: u.id, cuerpo, creado: new Date().toISOString(), votos: [], aceptada: false });
  db.guardar("posts");
  enviar(res, 201, { ok: true });
}, true);

ruta("POST", "/api/comunidad/:id/voto", (req, res, b, u, q, prm) => {
  const p = db.get("posts").find(x => x.id === prm.id);
  if (!p) return error(res, 404, "Esa publicación no existe.");
  let obj = p;
  if (b.respuesta) { obj = p.respuestas.find(r => r.id === b.respuesta); if (!obj) return error(res, 404, "Esa respuesta no existe."); }
  if (obj.autor === u.id) return error(res, 400, "No puedes votar tu propia aportación.");
  const i = obj.votos.indexOf(u.id);
  if (i >= 0) obj.votos.splice(i, 1); else obj.votos.push(u.id);
  db.guardar("posts");
  enviar(res, 200, { votos: obj.votos.length, votado: i < 0 });
}, true);

ruta("POST", "/api/comunidad/:id/aceptar", (req, res, b, u, q, prm) => {
  const p = db.get("posts").find(x => x.id === prm.id);
  if (!p) return error(res, 404, "Esa publicación no existe.");
  if (p.autor !== u.id) return error(res, 403, "Solo quien pregunta puede marcar la respuesta aceptada.");
  p.respuestas.forEach(r => { r.aceptada = r.id === b.respuesta ? !r.aceptada : false; });
  db.guardar("posts");
  enviar(res, 200, { ok: true });
}, true);

ruta("DELETE", "/api/comunidad/:id", (req, res, b, u, q, prm) => {
  const posts = db.get("posts");
  const i = posts.findIndex(x => x.id === prm.id);
  if (i < 0) return error(res, 404, "Esa publicación no existe.");
  if (posts[i].autor !== u.id) return error(res, 403, "Solo puedes borrar tus publicaciones.");
  posts.splice(i, 1); db.guardar("posts");
  enviar(res, 200, { ok: true });
}, true);

/* ---------------- servidor ---------------- */
const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (!url.pathname.startsWith("/api/")) {
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
    return estatico(req, res, url);
  }
  const r = RUTAS.find(x => x.metodo === req.method && x.re.test(url.pathname));
  if (!r) return error(res, 404, "Ruta de API desconocida.");
  const params = url.pathname.match(r.re).groups || {};
  const u = usuarioDe(req);
  if (r.auth && !u) return error(res, 401, "Necesitas iniciar sesión.");
  let cuerpo = {};
  if (req.method === "POST") {
    try { cuerpo = await leerCuerpo(req); } catch (e) { return error(res, 400, e.message); }
  }
  try { await r.fn(req, res, cuerpo, u, url.searchParams, params); }
  catch (e) { console.error(e); if (!res.headersSent) error(res, 500, "Error interno del servidor."); }
});

db.cargar();
cargarCatalogo();
migrarIdsDocker();
semilla.aplicar(db, hashClave);
servidor.listen(PUERTO, () => console.log(`[catappa] escuchando en http://localhost:${PUERTO}  datos en ${db.DIR}`));
