/* =====================================================================
   CATAPPA — vistas de aprendizaje: inicio, curso (pipeline) y lección
   ===================================================================== */
(function () {
"use strict";
var F = window.F, $ = F.$, E = F.E;

function minutos(l) { return Math.max(3, Math.round(l.npasos * 0.6)); }
/* horas estimadas de un curso a partir de sus lecciones reales */
function horasCurso(c) { return Math.max(1, Math.round(F.lecciones(c.id).reduce(function (s, l) { return s + minutos(l.leccion || l); }, 0) / 60)); }

/* curso "activo": el último en el que se avanzó y que no está terminado */
function cursoActivo() {
  var mejor = null, fecha = "";
  F.cursos().forEach(function (c) {
    var h = F.hechas(c.id), p = F.porcentaje(c.id);
    if (p === 100) return;
    Object.keys(h).forEach(function (k) { var f = (h[k] && h[k].fecha) || ""; if (f >= fecha) { fecha = f; mejor = c; } });
  });
  return mejor || F.cursos().find(function (c) { return F.porcentaje(c.id) < 100; }) || F.cursos()[0];
}

function anillo(valor, max) {
  var r = 38, circ = 2 * Math.PI * r, p = Math.min(1, valor / max);
  return '<svg class="anillo" viewBox="0 0 92 92" role="img" aria-label="' + valor + " de " + max + ' XP hoy"><circle class="fondo" cx="46" cy="46" r="' + r + '"/><circle class="valor" cx="46" cy="46" r="' + r + '" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + (circ * (1 - p)).toFixed(1) + '" transform="rotate(-90 46 46)"/><text x="46" y="52" text-anchor="middle">' + Math.min(valor, 999) + "</text></svg>";
}

function tarjetaCurso(c) {
  var p = F.porcentaje(c.id), hechas = F.contarHechas(c.id), total = F.lecciones(c.id).length;
  return '<a class="curso-card" href="#/curso/' + c.id + '" style="--c:' + c.color + '">' +
    '<div class="cab">' + F.logoCurso(c) + "<div><h3>" + F.esc(c.titulo) + '</h3><div class="lema">' + F.esc(c.lema) + "</div></div></div>" +
    '<p class="desc">' + F.esc(c.descripcion) + "</p>" +
    '<div class="pie-c"><div class="datos"><span>' + c.unidades.length + " unidades</span><span>" + total + " lecciones</span><span>~" + horasCurso(c) + " h</span><span>" + F.esc(c.nivel) + "</span></div>" +
    '<div class="barra-prog" aria-label="' + p + '% completado"><i style="width:' + p + '%"></i></div>' +
    '<div class="datos"><span>' + hechas + "/" + total + " completadas</span><span>" + p + "%</span></div></div></a>";
}

function seccionesCursos() {
  var todos = F.cursos();
  var empezados = todos.filter(function (c) { var n = F.contarHechas(c.id); return n > 0 && F.porcentaje(c.id) < 100; });
  var terminados = todos.filter(function (c) { return F.porcentaje(c.id) === 100; });
  var nuevos = todos.filter(function (c) { return F.contarHechas(c.id) === 0; });
  var html = "";
  if (empezados.length) html += '<section class="seccion"><div class="seccion-cab"><h2>En curso</h2><span class="mono">' + empezados.length + '</span></div><div class="cursos-grid">' + empezados.map(tarjetaCurso).join("") + "</div></section>";
  html += bloqueRutas();
  if (nuevos.length) html += '<section class="seccion"><div class="seccion-cab"><h2>' + (empezados.length ? "Explora más" : "Elige por dónde empezar") + '</h2><a class="mono" href="#/cursos" style="text-decoration:none">catálogo completo (' + todos.length + ") →</a></div>" +
    '<div class="cursos-grid">' + nuevos.slice(0, empezados.length ? 3 : 6).map(tarjetaCurso).join("") + "</div></section>";
  if (terminados.length) html += '<section class="seccion"><div class="seccion-cab"><h2>Completados</h2><span class="mono">' + terminados.length + '</span></div><div class="cursos-grid">' + terminados.map(tarjetaCurso).join("") + "</div></section>";
  return html;
}

/* rutas: secuencias de cursos recomendadas */
function bloqueRutas() {
  var rutas = (window.CURSOS_RUTAS || []).map(function (r) {
    return Object.assign({}, r, { cursos: r.cursos.filter(function (id) { return F.curso(id); }) });
  }).filter(function (r) { return r.cursos.length >= 2; });
  if (!rutas.length) return "";
  return '<section class="seccion"><div class="seccion-cab"><h2>Rutas de carrera</h2><span class="mono">cursos en el orden recomendado</span></div><div class="rutas">' +
    rutas.map(function (r) {
      var hechos = 0, total = 0;
      r.cursos.forEach(function (id) { hechos += F.contarHechas(id); total += F.lecciones(id).length; });
      var p = total ? Math.round(hechos / total * 100) : 0;
      return '<div class="ruta-card panel"><div class="ruta-cab"><b>' + F.esc(r.titulo) + '</b><span class="mono">' + p + "%</span></div><p>" + F.esc(r.descripcion) + '</p><ol class="ruta-pasos">' +
        r.cursos.map(function (id) {
          var c = F.curso(id), pc = F.porcentaje(id);
          return '<li><a href="#/curso/' + id + '" style="--c:' + c.color + '">' + F.logoCurso(c, "mini") + F.esc(c.titulo) + (pc === 100 ? " " + F.icono("check").replace("<svg", '<svg style="width:13px;height:13px;color:var(--ok)"') : pc ? ' <span class="mono">' + pc + "%</span>" : "") + "</a></li>";
        }).join("") + "</ol></div>";
    }).join("") + "</div></section>";
}

/* ---------------- catálogo ---------------- */
F.vistaCatalogo = function (prm) {
  var cat = prm.query.get("categoria") || "", texto = (prm.query.get("q") || "").toLowerCase();
  var todos = F.cursos();
  var sinTildes = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var lista = todos.filter(function (c) {
    if (cat && c.categoria !== cat) return false;
    if (!texto) return true;
    return sinTildes(c.titulo + " " + c.lema + " " + c.descripcion + " " + (c.temas || []).join(" ")).indexOf(sinTildes(texto)) >= 0;
  });
  var totalL = F.totalLecciones();
  var chips = [["", "Todos"]].concat(F.categorias().map(function (x) { return [x, x]; })).map(function (x) {
    var n = x[0] ? todos.filter(function (c) { return c.categoria === x[0]; }).length : todos.length;
    return '<button data-cat="' + F.esc(x[0]) + '" aria-pressed="' + (cat === x[0]) + '">' + F.esc(x[1]) + ' <span class="mono" style="opacity:.6">' + n + "</span></button>";
  }).join("");
  F.pintar(
    '<div class="ancho">' +
      '<div class="eyebrow"><b>~/cursos</b><span>' + todos.length + " cursos</span><span>" + F.num(totalL) + " lecciones</span></div>" +
      '<h1 class="titulo-pag">Catálogo</h1><p class="subtitulo">Cada curso va de cero a nivel maestro: fundamentos, intermedio, avanzado, experto y un simulacro final de entrevista. Empieza por cualquiera; dentro de cada curso las lecciones se abren en orden.</p>' +
      '<div class="com-filtros"><div class="segmentado" id="seg-cat">' + chips + '</div><input class="entrada" id="buscar-cat" type="search" placeholder="Buscar tecnología o tema…" value="' + F.esc(texto) + '"></div>' +
      (lista.length ? '<div class="cursos-grid">' + lista.map(tarjetaCurso).join("") + "</div>" : '<div class="panel vacio"><b>No hay cursos con ese filtro.</b></div>') +
      (!cat && !texto ? bloqueRutas() : "") +
    "</div>"
  );
  F.$$("#seg-cat button").forEach(function (b) { b.addEventListener("click", function () { F.ir("/cursos" + (b.dataset.cat ? "?categoria=" + encodeURIComponent(b.dataset.cat) : "")); }); });
  var t;
  F.$("#buscar-cat").addEventListener("input", function (e) {
    clearTimeout(t); var v = e.target.value.trim();
    t = setTimeout(function () { history.replaceState(null, "", "#/cursos" + (v ? "?q=" + encodeURIComponent(v) : "")); F.vistaCatalogo({ query: new URLSearchParams(v ? "q=" + v : "") }); var i = F.$("#buscar-cat"); i.focus(); i.setSelectionRange(v.length, v.length); }, 220);
  });
};

/* ---------------- inicio ---------------- */
F.vistaInicio = function () {
  var c = cursoActivo(), sig = c ? F.siguiente(c.id) : null;
  var nombre = E.perfil ? E.perfil.nombre.split(" ")[0] : null;
  var usuarioTerm = E.perfil ? E.perfil.usuario : "invitado";
  var xpHoy = F.xpHoy(), meta = F.META_DIARIA;
  var totalHechas = F.cursos().reduce(function (a, x) { return a + F.contarHechas(x.id); }, 0);
  var aviso = "";
  if (!E.perfil && E.modo === "servidor") {
    aviso = '<div class="panel panel-pad" style="display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:18px">' +
      "<div><b>Estás aprendiendo como invitado.</b><div style=\"color:var(--ink-2);font-size:14px\">Tu progreso se guarda solo en este navegador. Crea una cuenta para conservarlo, aparecer en el ranking y participar en la comunidad.</div></div>" +
      '<a class="btn btn-primario" href="#/entrar?modo=registro">Crear cuenta</a></div>';
  }
  var html =
    '<div class="ancho">' +
      '<div class="eyebrow"><b>~/aprender</b><span>' + new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) + "</span></div>" +
      '<h1 class="titulo-pag">' + (nombre ? "Hola, " + F.esc(nombre) : "Aprende haciendo, paso a paso") + "</h1>" +
      '<p class="subtitulo">' + (totalHechas ? "Llevas " + totalHechas + " lecciones completadas. Sigue donde lo dejaste." : F.cursos().length + " cursos completos, de lo más básico a nivel experto. Cada concepto se explica antes de usarse y se practica antes de pasar al siguiente.") + "</p>" +
      aviso +
      '<div class="hola">' +
        '<div class="continuar">' +
          (c ? '<div class="continuar-logo">' + F.logoCurso(c, "grande") + "</div>" : "") + '<div class="prompt"><b>' + F.esc(usuarioTerm) + "@catappa</b>:~$ continuar " + F.esc(c ? c.id : "") + '<span class="cursor"></span></div>' +
          (sig
            ? "<h2>" + F.esc(sig.leccion.titulo) + "</h2><p>" + F.esc(c.titulo) + " · Unidad " + (sig.ui + 1) + ": " + F.esc(sig.unidad.titulo) + " · " + sig.leccion.npasos + " pasos, unos " + minutos(sig.leccion) + " minutos.</p>" +
              '<div class="acciones-c"><a class="btn btn-primario btn-grande" href="#/leccion/' + c.id + "/" + sig.leccion.id + '">' + F.icono("play") + (F.contarHechas(c.id) ? "Continuar" : "Empezar") + '</a><span class="progreso-c">' + F.porcentaje(c.id) + "% de " + F.esc(c.titulo) + "</span></div>"
            : "<h2>Has completado todos los cursos</h2><p>Repasa cualquier lección cuando quieras, o ayuda a otros en la comunidad.</p><div class=\"acciones-c\"><a class=\"btn btn-primario\" href=\"#/comunidad\">Ir a la comunidad</a></div>") +
        "</div>" +
        '<div class="panel meta-dia">' +
          '<div class="anillo-caja">' + anillo(xpHoy, meta) + "<div><b>Objetivo diario</b><div style=\"color:var(--ink-2);font-size:14px\">" + (xpHoy >= meta ? "¡Conseguido! Todo lo que hagas hoy es extra." : "Te faltan " + (meta - xpHoy) + " XP para el objetivo de hoy (" + meta + ").") + "</div></div></div>" +
          '<div class="stats-mini">' +
            '<div class="stat-mini"><b>' + F.racha() + "</b><span>días de racha</span></div>" +
            '<div class="stat-mini"><b>' + F.num(E.perfil ? E.perfil.xp : F.xpTotal()) + "</b><span>XP total</span></div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      seccionesCursos() +
      '<section class="seccion" id="inicio-comunidad"></section>' +
    "</div>";
  F.pintar(html);
  if (E.modo === "servidor") {
    F.api("GET", "/api/comunidad?orden=recientes").then(function (lista) {
      var z = $("#inicio-comunidad"); if (!z || !lista.length) return;
      z.innerHTML = '<div class="seccion-cab"><h2>Últimas dudas en la comunidad</h2><a class="mono" href="#/comunidad" style="text-decoration:none">ver todas →</a></div><div class="panel" style="padding:0 18px"><div class="posts">' + lista.slice(0, 4).map(F.filaPost).join("") + "</div></div>";
    }).catch(function () {});
  }
};

/* ---------------- curso: pipeline ---------------- */
F.vistaCurso = function (prm) {
  var c = F.curso(prm.id);
  if (!c) { F.pintar('<div class="vacio"><b>Ese curso no existe.</b></div>'); return; }
  var todas = F.lecciones(c.id), h = F.hechas(c.id), sig = F.siguiente(c.id);
  var hechasN = F.contarHechas(c.id), pct = F.porcentaje(c.id);
  var unidadesOk = c.unidades.filter(function (u) { return u.lecciones.every(function (l) { return h[l.id]; }); }).length;
  var xpCurso = (E.progreso[c.id] && E.progreso[c.id].xp) || 0;
  var plegadas = F.leerLocal("catappa-plegadas-" + c.id, null);

  var stages = c.unidades.map(function (u, ui) {
    var hechasU = u.lecciones.filter(function (l) { return h[l.id]; }).length;
    var completa = hechasU === u.lecciones.length;
    var contieneActual = sig && sig.ui === ui;
    var plegada = plegadas ? plegadas.indexOf(ui) >= 0 : (completa && !contieneActual);
    var icono = completa ? '<span class="st ok stage-ok">' + F.icono("check") + "</span>" : contieneActual ? '<span class="st cur stage-ok"></span>' : '<span class="st pend stage-ok"></span>';
    var jobs = u.lecciones.map(function (l, li) {
      var hecha = !!h[l.id], abierta = F.desbloqueada(c.id, l.id), actual = sig && sig.leccion.id === l.id;
      var st = hecha ? '<span class="st ok">' + F.icono("check") + "</span>" : actual ? '<span class="st cur"></span>' : abierta ? '<span class="st pend"></span>' : '<span class="st lock">' + F.icono("candado") + "</span>";
      var derecha = hecha ? "repasar" : actual ? (hechasN ? "continuar " : "empezar ") + F.icono("flecha").replace("<svg", '<svg style="width:14px;height:14px"') : abierta ? "abrir" : "";
      var tag = abierta ? "a" : "div";
      var perf = hecha && h[l.id].perfecta ? ' <span class="badge acento" title="Todo a la primera">' + F.icono("estrella").replace("<svg", '<svg style="width:11px;height:11px"') + "perfecta</span>" : "";
      return "<" + tag + ' class="job' + (actual ? " actual" : "") + (abierta ? "" : " bloq") + '"' + (abierta ? ' href="#/leccion/' + c.id + "/" + l.id + '"' : ' aria-disabled="true" title="Se abre al terminar la lección anterior"') + ">" +
        st + '<span><span class="t">' + F.esc(l.titulo) + perf + '</span><br><span class="s">' + (ui + 1) + "." + (li + 1) + " · " + l.npasos + " pasos · ~" + minutos(l) + " min</span></span>" +
        '<span class="ir">' + derecha + "</span></" + tag + ">";
    }).join("");
    // cabecera de nivel cuando cambia (fundamentos, intermedio, avanzado, experto)
    var cabNivel = "";
    if (u.nivel && (ui === 0 || c.unidades[ui - 1].nivel !== u.nivel)) {
      var enNivel = c.unidades.filter(function (x) { return x.nivel === u.nivel; });
      var lecNivel = enNivel.reduce(function (a, x) { return a + x.lecciones.length; }, 0);
      var hechasNivel = enNivel.reduce(function (a, x) { return a + x.lecciones.filter(function (l) { return h[l.id]; }).length; }, 0);
      cabNivel = '<div class="nivel-cab nivel-' + (F.NIVELES.indexOf(u.nivel) + 1) + '"><span class="mono">nivel ' + (F.NIVELES.indexOf(u.nivel) + 1) + "</span><b>" + F.esc(u.nivel) + '</b><span class="mono">' + hechasNivel + "/" + lecNivel + " lecciones</span></div>";
    }
    return cabNivel + '<section class="stage' + (plegada ? " plegado" : "") + '" data-ui="' + ui + '">' +
      '<div class="stage-cab" role="button" tabindex="0" aria-expanded="' + !plegada + '">' + icono +
        '<span class="stage-num">stage ' + ("0" + (ui + 1)).slice(-2) + "</span>" +
        '<div style="min-width:0"><h3>' + F.esc(u.titulo) + "</h3><p>" + F.esc(u.resumen || "") + "</p></div>" +
        '<div class="estado"><span class="contador">' + hechasU + "/" + u.lecciones.length + "</span>" + F.icono("abajo", "flecha") + "</div>" +
      '</div><div class="jobs">' + jobs + "</div></section>";
  }).join("");

  var html =
    '<div class="ancho-texto" style="max-width:900px">' +
      '<div class="curso-cab"><div>' +
        '<div class="eyebrow"><b>' + F.esc((c.categoria || "curso").toLowerCase()) + "</b><span>" + F.esc(c.nivel) + "</span><span>~" + horasCurso(c) + " h</span><span>" + todas.length + " lecciones</span></div>" +
        '<div class="curso-titulo">' + F.logoCurso(c, "grande") + '<h1 class="titulo-pag">' + F.esc(c.titulo) + "</h1></div>" +
        '<p class="subtitulo">' + F.esc(c.descripcion) + "</p>" +
        '<div class="curso-resumen"><span><b>' + pct + "%</b>completado</span><span><b>" + hechasN + "/" + todas.length + "</b>lecciones</span><span><b>" + unidadesOk + "/" + c.unidades.length + "</b>unidades</span><span><b>" + F.num(xpCurso) + "</b>XP en el curso</span></div>" +
      "</div>" +
      (sig ? '<a class="btn btn-primario btn-grande" href="#/leccion/' + c.id + "/" + sig.leccion.id + '">' + F.icono("play") + (hechasN ? "Continuar" : "Empezar") + "</a>" : '<span class="badge ok">' + F.icono("check").replace("<svg", '<svg style="width:12px;height:12px"') + "Curso completado</span>") +
      "</div>" +
      '<div class="barra-prog" style="--c:' + c.color + ';margin-top:22px;height:8px"><i style="width:' + pct + '%"></i></div>' +
      '<div class="pipeline">' + stages + "</div>" +
    "</div>";
  F.pintar(html);

  // plegar y desplegar etapas (se recuerda por curso)
  F.$$(".stage-cab").forEach(function (cab) {
    var alternar = function () {
      var st = cab.parentNode; st.classList.toggle("plegado");
      cab.setAttribute("aria-expanded", String(!st.classList.contains("plegado")));
      var lista = F.$$(".stage").filter(function (s) { return s.classList.contains("plegado"); }).map(function (s) { return +s.dataset.ui; });
      F.guardarLocal("catappa-plegadas-" + c.id, lista);
    };
    cab.addEventListener("click", alternar);
    cab.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alternar(); } });
  });
  var actual = $(".job.actual");
  if (actual && !prm.sinScroll) setTimeout(function () { actual.scrollIntoView({ block: "center", behavior: "smooth" }); }, 80);
};

F.vistaLeccion = function (prm) {
  F.vistaCurso({ id: prm.curso, sinScroll: true });
  F.abrirLeccion(prm.curso, prm.leccion);
};

})();
