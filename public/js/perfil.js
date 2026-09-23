/* =====================================================================
   CATAPPA — perfil, ranking, ajustes y acceso (registro / login)
   ===================================================================== */
(function () {
"use strict";
var F = window.F, $ = F.$, $$ = F.$$, E = F.E;

F.refrescarPerfil = function () {
  if (!E.token) return Promise.resolve();
  return F.api("GET", "/api/yo").then(function (d) { E.perfil = d.perfil; E.progreso = d.progreso; F.pintarStats(); }).catch(function () {});
};

/* ---------------- heatmap de actividad (estilo GitHub) ---------------- */
function heatmap(actividad) {
  var semanas = 52, dias = semanas * 7, hoyD = new Date();
  var inicio = new Date(hoyD); inicio.setUTCDate(inicio.getUTCDate() - (dias - 1));
  // alinear para que la primera columna empiece en lunes
  var desfase = (inicio.getUTCDay() + 6) % 7;
  inicio.setUTCDate(inicio.getUTCDate() - desfase);
  var celdas = "", total = 0, diasActivos = 0;
  for (var d = new Date(inicio); d <= hoyD; d.setUTCDate(d.getUTCDate() + 1)) {
    var k = d.toISOString().slice(0, 10), xp = actividad[k] || 0;
    var n = xp === 0 ? 0 : xp <= 20 ? 1 : xp <= 50 ? 2 : xp <= 100 ? 3 : 4;
    if (xp) { total += xp; diasActivos++; }
    celdas += '<i data-n="' + n + '" title="' + k + ": " + xp + ' XP"></i>';
  }
  return '<div class="panel heatmap-caja"><div class="seccion-cab" style="margin-bottom:10px"><h2 style="font-size:15px">Actividad</h2><span class="mono">' + diasActivos + (diasActivos === 1 ? " día activo" : " días activos") + " · " + F.num(total) + ' XP en el último año</span></div>' +
    '<div class="heatmap" role="img" aria-label="Mapa de actividad de las últimas ' + semanas + ' semanas">' + celdas + "</div>" +
    '<div class="heat-ley">menos <i style="background:var(--heat-0)"></i><i style="background:var(--heat-1)"></i><i style="background:var(--heat-2)"></i><i style="background:var(--heat-3)"></i><i style="background:var(--heat-4)"></i> más</div></div>';
}

function bloqueInsignias(ganadas) {
  return '<div class="insignias">' + F.INSIGNIAS.map(function (i) {
    var ok = ganadas.indexOf(i.id) >= 0;
    return '<div class="insignia' + (ok ? "" : " bloqueada") + '" title="' + F.esc(i.desc) + '">' + F.medalla(i.id) + "<div><b>" + F.esc(i.nombre) + "</b><span>" + F.esc(i.desc) + "</span></div></div>";
  }).join("") + "</div>";
}

function bloqueCursos(cursosP) {
  return '<div class="panel panel-pad progreso-cursos">' + F.cursos().map(function (c) {
    var d = cursosP[c.id] || { hechas: 0, total: F.lecciones(c.id).length };
    var p = d.total ? Math.round(d.hechas / d.total * 100) : 0;
    return '<div class="pc-fila"><a href="#/curso/' + c.id + '" style="text-decoration:none;font-weight:500;display:flex;align-items:center;gap:8px">' + F.logoCurso(c, "mini") + F.esc(c.titulo) + '</a><div class="barra-prog" style="--c:' + c.color + '"><i style="width:' + p + '%"></i></div><span class="mono">' + d.hechas + "/" + d.total + "</span></div>";
  }).join("") + "</div>";
}

/* ---------------- perfil ---------------- */
F.vistaPerfil = function (prm) {
  var usuario = prm.usuario || (E.perfil && E.perfil.usuario);
  if (!usuario) return perfilInvitado();
  if (E.modo !== "servidor") return perfilInvitado();
  F.pintar('<div class="ancho"><div class="vacio">Cargando perfil…</div></div>');
  F.api("GET", "/api/perfil/" + encodeURIComponent(usuario)).then(function (p) { pintarPerfil(p); })
    .catch(function (e) { F.pintar('<div class="ancho"><div class="vacio"><b>' + F.esc(e.message) + "</b></div></div>"); });
};

function pintarPerfil(p) {
  var mio = E.perfil && E.perfil.usuario === p.usuario;
  F.$("#migas").innerHTML = "~/perfil/<b>" + F.esc(p.usuario) + "</b>";
  F.pintar(
    '<div class="ancho">' +
      '<div class="perfil-cab">' + F.avatar(p, "l") +
        '<div class="datos-p"><h1>' + F.esc(p.nombre) + (p.rol === "mentor" ? ' <span class="badge mentor" style="vertical-align:middle">mentor</span>' : "") + "</h1>" +
        '<div class="usuario-p">@' + F.esc(p.usuario) + " · en " + F.esc(F.MARCA.nombre) + " desde " + new Date(p.creado).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) + "</div>" +
        (p.bio ? '<p class="bio">' + F.esc(p.bio) + "</p>" : mio ? '<p class="bio" style="color:var(--ink-3)">Aún no has escrito nada sobre ti.</p>' : "") + "</div>" +
        (mio ? '<button class="btn" id="editar-perfil">Editar perfil</button>' : "") +
      "</div>" +
      (mio ? '<div class="panel panel-pad cata-perfil">' + F.cata({ expr: p.racha > 0 ? "feliz" : "normal", nivel: F.nivelMaximo(), brillo: p.racha > 0, alto: 120 }) +
        "<div><b>" + F.esc(F.MARCA.mascotaNombre) + " lleva tu nivel en la hoja</b><span>Ahora mismo, tu nivel más alto es <b>" + F.esc(F.nivelMaximo()) + "</b>" +
        (p.racha > 0 ? ", y la hoja brilla porque llevas una racha de " + p.racha + (p.racha === 1 ? " día" : " días") : "") + ".</span></div></div>" : "") +
      '<div class="stats-p">' +
        '<div class="panel stat-p"><b>' + F.num(p.xp) + "</b><span>XP total</span></div>" +
        '<div class="panel stat-p"><b>' + p.racha + "</b><span>días de racha</span></div>" +
        '<div class="panel stat-p"><b>' + p.lecciones + "</b><span>lecciones completadas</span></div>" +
        '<div class="panel stat-p"><b>' + p.insignias.length + "/" + F.INSIGNIAS.length + "</b><span>insignias</span></div>" +
        '<div class="panel stat-p"><b>' + Object.values(p.proyectos || {}).reduce(function (a, x) { return a + Object.keys(x).length; }, 0) + "</b><span>proyectos hechos</span></div>" +
      "</div>" +
      '<section class="seccion">' + heatmap(p.actividad || {}) + "</section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Progreso por curso</h2></div>' + bloqueCursos(p.cursos || {}) + "</section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Certificados</h2><span class="mono">' + (p.certificados || []).length + "</span></div>" + F.bloqueCertificados(p.certificados, mio) + "</section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Insignias</h2><span class="mono">' + p.insignias.length + " conseguidas</span></div>" + bloqueInsignias(p.insignias) + "</section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Publicaciones</h2><span class="mono">' + (p.posts || []).length + "</span></div>" +
        ((p.posts || []).length ? '<div class="panel" style="padding:0 18px"><div class="posts">' + p.posts.map(F.filaPost).join("") + "</div></div>" : '<div class="panel vacio">Todavía no ha publicado nada.</div>') + "</section>" +
    "</div>"
  );
  var be = $("#editar-perfil"); if (be) be.addEventListener("click", editarPerfil);
}

function perfilInvitado() {
  var cursosP = {};
  F.cursos().forEach(function (c) { cursosP[c.id] = { hechas: F.contarHechas(c.id), total: F.lecciones(c.id).length }; });
  var ganadas = F.insigniasGanadasLocal();
  var total = F.cursos().reduce(function (a, c) { return a + F.contarHechas(c.id); }, 0);
  F.pintar(
    '<div class="ancho">' +
      '<div class="perfil-cab">' + F.avatar({ nombre: "Invitado", color: "#8a8375" }, "l") +
        '<div class="datos-p"><h1>Invitado</h1><div class="usuario-p">progreso guardado en este navegador</div>' +
        '<p class="bio">' + (E.modo === "servidor" ? "Crea una cuenta para no perder tu progreso, aparecer en el ranking y participar en la comunidad. Todo lo que has hecho se importa automáticamente." : "Estás en modo sin conexión: la plataforma funciona, pero sin cuentas ni comunidad.") + "</p></div>" +
        (E.modo === "servidor" ? '<a class="btn btn-primario" href="#/entrar?modo=registro">Crear cuenta</a>' : "") +
      "</div>" +
      '<div class="stats-p">' +
        '<div class="panel stat-p"><b>' + F.num(F.xpTotal()) + "</b><span>XP total</span></div>" +
        '<div class="panel stat-p"><b>' + F.racha() + "</b><span>días de racha</span></div>" +
        '<div class="panel stat-p"><b>' + total + "</b><span>lecciones completadas</span></div>" +
        '<div class="panel stat-p"><b>' + ganadas.length + "</b><span>insignias</span></div>" +
      "</div>" +
      '<section class="seccion">' + heatmap(F.actividad()) + "</section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Progreso por curso</h2></div>' + bloqueCursos(cursosP) + "</section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Insignias</h2></div>' + bloqueInsignias(ganadas) + "</section>" +
    "</div>"
  );
}

function editarPerfil() {
  var p = E.perfil, colores = ["#179493", "#f5b642", "#7fd1b9", "#7aa2f7", "#f26d6d", "#c49bf2", "#8fd16a", "#f29e6d", "#6dd3f2"], elegido = p.color;
  var m = F.modal("Editar perfil",
    '<div class="campo"><label for="ep-nombre">Nombre visible</label><input class="entrada" id="ep-nombre" maxlength="40" value="' + F.esc(p.nombre) + '"></div>' +
    '<div class="campo"><label for="ep-bio">Sobre ti</label><textarea class="area" id="ep-bio" maxlength="240" style="min-height:90px" placeholder="Qué haces, qué estás aprendiendo, qué buscas…">' + F.esc(p.bio || "") + "</textarea><small>Máximo 240 caracteres.</small></div>" +
    '<div class="campo"><label>Color del avatar</label><div class="colores">' + colores.map(function (c) { return '<button type="button" style="background:' + c + '" data-color="' + c + '" aria-label="Color ' + c + '" aria-pressed="' + (c === elegido) + '"></button>'; }).join("") + "</div></div>",
    '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-primario" id="ep-guardar">Guardar</button>');
  $$("[data-color]", m.el).forEach(function (b) {
    b.addEventListener("click", function () { elegido = b.dataset.color; $$("[data-color]", m.el).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); });
  });
  $("#ep-guardar").addEventListener("click", function () {
    F.api("POST", "/api/perfil", { nombre: $("#ep-nombre").value, bio: $("#ep-bio").value, color: elegido }).then(function (d) {
      E.perfil = d.perfil; m.cerrar(); F.toast("Perfil actualizado"); F.navegar();
    }).catch(function (e) { F.toast(e.message, "!"); });
  });
}

/* ---------------- ranking ---------------- */
F.vistaRanking = function (prm) {
  var rango = prm.query.get("rango") === "global" ? "global" : "semana";
  var cab = '<div class="ancho-texto" style="max-width:860px"><div class="eyebrow"><b>~/ranking</b><span>' + (rango === "semana" ? "últimos 7 días" : "desde siempre") + "</span></div>" +
    '<div style="display:flex;align-items:end;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><h1 class="titulo-pag">Ranking</h1><p class="subtitulo">XP ganada completando lecciones. La tabla semanal se reinicia cada día con la ventana de los últimos 7.</p></div>' +
    '<div class="segmentado"><button data-r="semana" aria-pressed="' + (rango === "semana") + '">Esta semana</button><button data-r="global" aria-pressed="' + (rango === "global") + '">Global</button></div></div>';
  if (E.modo !== "servidor") { F.pintar(cab + '<div class="panel vacio" style="margin-top:20px"><b>El ranking necesita el servidor.</b></div></div>'); return; }
  F.pintar(cab + '<div class="vacio">Cargando…</div></div>');
  $$("[data-r]").forEach(function (b) { b.addEventListener("click", function () { F.ir("/ranking?rango=" + b.dataset.r); }); });
  F.api("GET", "/api/ranking?rango=" + rango).then(function (lista) {
    var yo = E.perfil && E.perfil.usuario;
    var podio = [lista[1], lista[0], lista[2]].map(function (u, i) {
      if (!u) return "<div></div>";
      var pos = [2, 1, 3][i];
      return '<a class="podio-item p' + pos + '" href="#/perfil/' + F.esc(u.usuario) + '"><span class="pos">#' + pos + "</span>" + F.avatar(u, pos === 1 ? "l" : "") + '<span class="nom">' + F.esc(u.nombre) + '</span><span class="xp">' + F.num(u.xp) + " XP</span></a>";
    }).join("");
    var filas = lista.map(function (u, i) {
      return '<tr class="' + (u.usuario === yo ? "yo" : "") + '"><td class="pos">' + (i + 1) + '</td><td><a class="quien" href="#/perfil/' + F.esc(u.usuario) + '">' + F.avatar(u, "s") + "<span>" + F.esc(u.nombre) + (u.rol === "mentor" ? ' <span class="badge mentor">mentor</span>' : "") + '<br><span class="mono" style="font-size:11.5px;color:var(--ink-3)">@' + F.esc(u.usuario) + '</span></span></a></td><td class="num">' + u.racha + '</td><td class="num">' + u.lecciones + '</td><td class="num"><b>' + F.num(u.xp) + "</b></td></tr>";
    }).join("");
    var cuerpo = (lista.length >= 3 ? '<div class="podio">' + podio + "</div>" : "") +
      '<div class="panel scroll"><table class="tabla-rank"><thead><tr><th>#</th><th>Persona</th><th class="num">Racha</th><th class="num">Lecciones</th><th class="num">XP</th></tr></thead><tbody>' + filas + "</tbody></table></div>" +
      (!E.perfil ? '<p style="margin-top:14px;color:var(--ink-3);font-size:14px">Como invitado no apareces en el ranking. <a href="#/entrar?modo=registro">Crea una cuenta</a> para entrar en la tabla.</p>' : "");
    F.pintar(cab + cuerpo + "</div>");
    $$("[data-r]").forEach(function (b) { b.addEventListener("click", function () { F.ir("/ranking?rango=" + b.dataset.r); }); });
  }).catch(function (e) { F.pintar(cab + '<div class="vacio"><b>' + F.esc(e.message) + "</b></div></div>"); });
};

/* ---------------- ajustes ---------------- */
F.vistaAjustes = function () {
  var tema = F.tema.actual();
  var antiguo = F.progresoAntiguo();
  F.pintar(
    '<div class="ancho-texto">' +
      '<div class="eyebrow"><b>~/ajustes</b></div><h1 class="titulo-pag">Ajustes</h1>' +
      '<section class="seccion"><div class="seccion-cab"><h2>Apariencia</h2></div><div class="panel panel-pad" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">' +
      (F.tema.puedeCambiar() ? '<span>Tema de la interfaz<small style="display:block;color:var(--ink-3);font-size:13px">Se guarda en tu cuenta.</small></span>' +
        '<div class="segmentado" id="seg-tema"><button data-t="sistema" aria-pressed="' + (tema === "sistema") + '">Sistema (predeterminado)</button><button data-t="claro" aria-pressed="' + (tema === "claro") + '">' + F.icono("sol").replace("<svg", '<svg style="width:14px;height:14px;vertical-align:-2px"') + ' Claro</button><button data-t="oscuro" aria-pressed="' + (tema === "oscuro") + '">' + F.icono("luna").replace("<svg", '<svg style="width:14px;height:14px;vertical-align:-2px"') + " Oscuro</button></div></div></section>"
      : '<span>El tema sigue al de tu sistema. <b>Inicia sesión</b> para elegir claro u oscuro.</span>' + (E.modo === "servidor" ? '<a class="btn" href="#/entrar">Iniciar sesión</a>' : "") + "</div></section>") +
      "" +
        "" +
      '<section class="seccion"><div class="seccion-cab"><h2>Sonido</h2></div><div class="panel panel-pad" style="display:grid;gap:14px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><span>Sonidos al acertar, fallar y terminar lecciones</span>' +
          '<div class="segmentado" id="seg-sonido"><button data-s="1" aria-pressed="' + F.sonido.activo() + '">' + F.icono("sonido").replace("<svg", '<svg style="width:14px;height:14px;vertical-align:-2px"') + ' Activado</button><button data-s="0" aria-pressed="' + !F.sonido.activo() + '">' + F.icono("silencio").replace("<svg", '<svg style="width:14px;height:14px;vertical-align:-2px"') + ' Silencio</button></div></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><label for="vol-sonido">Volumen</label>' +
          '<div style="display:flex;gap:10px;align-items:center"><input type="range" id="vol-sonido" min="0.1" max="1" step="0.1" value="' + F.sonido.volumen() + '" style="width:160px;accent-color:var(--accent-fill)"><button class="btn" id="probar-sonido">Probar</button></div></div>' +
      "</div></section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>App</h2></div><div class="panel panel-pad" style="display:grid;gap:12px">' +
        (F.esApp() ? "<p>Estás usando Catappa como <b>app instalada</b>.</p>"
          : '<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><span>Instala Catappa como una app: icono propio, ventana sin barra del navegador y funciona sin conexión.</span><button class="btn btn-primario" data-instalar hidden>' + F.icono("descargar") + "Instalar</button></div>" +
            '<p style="color:var(--ink-3);font-size:13.5px">Si no aparece el botón: en Chrome o Edge, icono de instalar en la barra de direcciones. En iPhone, Safari → Compartir → <b>Añadir a pantalla de inicio</b>. En Android, menú ⋮ → <b>Instalar aplicación</b>.</p>') +
        '<p style="color:var(--ink-3);font-size:13.5px">Sin conexión: los cursos que ya has abierto quedan guardados en el dispositivo. Las lecciones que completes sin red se sincronizan solas al volver.</p>' +
      "</div></section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Cuenta</h2></div><div class="panel panel-pad" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">' +
        (E.perfil ? "<span>Sesión iniciada como <b>@" + F.esc(E.perfil.usuario) + '</b></span><button class="btn" id="salir">' + F.icono("salir") + "Cerrar sesión</button>"
          : E.modo === "servidor" ? "<span>Estás como invitado. Tu progreso vive solo en este navegador.</span><a class=\"btn btn-primario\" href=\"#/entrar?modo=registro\">Crear cuenta</a>"
          : "<span>Modo sin conexión: sin cuentas ni comunidad. Arranca el servidor con <code>docker compose up -d</code>.</span>") +
      "</div></section>" +
      (function () {
        var empezados = F.cursos().filter(function (c) { return F.contarHechas(c.id) > 0; });
        return '<section class="seccion"><div class="seccion-cab"><h2>Reiniciar un curso</h2></div><div class="panel panel-pad" style="display:grid;gap:12px">' +
          '<p style="color:var(--ink-2)">Deja un curso como si nunca lo hubieras empezado: se borran sus lecciones completadas, su XP y su actividad.</p>' +
          (empezados.length ? '<div class="lista-reinicio">' + empezados.map(function (c) {
            return '<div class="fila-reinicio">' + F.logoCurso(c, "mini") + "<span><b>" + F.esc(c.titulo) + "</b> · " + F.contarHechas(c.id) + " de " + F.lecciones(c.id).length + ' lecciones</span><button class="btn btn-suave btn-peligro" data-reiniciar="' + c.id + '">Reiniciar</button></div>';
          }).join("") + "</div>" : '<p style="color:var(--ink-3)">Todavía no has empezado ningún curso.</p>') +
          "</div></section>";
      })() +
      '<section class="seccion"><div class="seccion-cab"><h2>Progreso anterior</h2></div><div class="panel panel-pad" style="display:grid;gap:14px">' +
        "<p style=\"color:var(--ink-2)\">" + (antiguo.length ? "Este navegador tiene " + antiguo.length + " lecciones completadas del curso antiguo de Docker. Se importan automáticamente, pero puedes repetirlo aquí." : "No se ha encontrado progreso del curso antiguo en este navegador.") + " Si lo hiciste en otro navegador, puedes marcar directamente hasta donde llegaste: <b>Docker › Unidad 2 › Lección 4</b>.</p>" +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' + (antiguo.length ? '<button class="btn" id="imp-antiguo">Importar ' + antiguo.length + " lecciones del curso antiguo</button>" : "") + '<button class="btn" id="imp-declarado">Marcar Docker hasta la Unidad 2 · Lección 4</button></div>' +
      "</div></section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Atajos de teclado</h2></div><div class="panel panel-pad" style="display:grid;gap:10px;font-size:14px">' +
        "<div><kbd>Ctrl</kbd> + <kbd>K</kbd> &nbsp;buscar cualquier lección o página</div><div><kbd>1</kbd>–<kbd>5</kbd> &nbsp;elegir una opción en la lección</div><div><kbd>Enter</kbd> &nbsp;comprobar y continuar</div><div><kbd>Esc</kbd> &nbsp;salir de la lección o cerrar ventanas</div></div></section>" +
      (!E.perfil ? '<section class="seccion"><div class="seccion-cab"><h2>Zona de peligro</h2></div><div class="panel panel-pad" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><span>Borrar el progreso de invitado de este navegador.</span><button class="btn btn-peligro" id="reset-local">Borrar progreso local</button></div></section>' : "") +
      '<p class="mono" style="margin-top:30px;font-size:12px;color:var(--ink-3)">' + F.esc(F.MARCA.nombre) + " · modo " + E.modo + " · " + F.cursos().map(function (c) { return c.id + ":" + F.lecciones(c.id).length; }).join(" ") + "</p>" +
    "</div>"
  );
  $$("[data-instalar]").forEach(function (b) { b.addEventListener("click", F.instalarApp); });
  F.pintarInstalar();
  $$("#seg-sonido button").forEach(function (b) {
    b.addEventListener("click", function () {
      F.sonido.activar(b.dataset.s === "1");
      $$("#seg-sonido button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      F.sonido.tocar("acierto");
    });
  });
  var pruebas = ["acierto", "error", "fin"], nPrueba = 0;
  $("#vol-sonido").addEventListener("change", function () { F.sonido.volumen(this.value); F.sonido.tocar("acierto"); });
  $("#probar-sonido").addEventListener("click", function () {
    if (!F.sonido.activo()) return F.toast("El sonido está en silencio");
    F.sonido.tocar(pruebas[nPrueba++ % pruebas.length]);
  });
  $$("#seg-tema button").forEach(function (b) {
    b.addEventListener("click", function () { if (F.tema.aplicar(b.dataset.t)) $$("#seg-tema button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); });
  });
  var bs = $("#salir"); if (bs) bs.addEventListener("click", function () { F.cerrarSesion(); });
  $$("[data-reiniciar]").forEach(function (b) { b.addEventListener("click", function () { F.confirmarReinicio(b.dataset.reiniciar); }); });
  var importar = function (ids) {
    if (E.perfil) {
      F.api("POST", "/api/importar", { progreso: { docker: ids } }).then(function (d) {
        E.perfil = d.perfil; E.progreso = d.progreso; F.toast(d.importadas ? d.importadas + " lecciones importadas" : "Ya estaban todas importadas"); F.navegar();
      }).catch(function (e) { F.toast(e.message, "!"); });
    } else {
      var p = F.leerLocal("catappa-progreso-local", { progreso: {}, actividad: {} }), n = 0;
      p.progreso.docker = p.progreso.docker || { lecciones: {}, xp: 0 };
      ids.forEach(function (id) { if (!p.progreso.docker.lecciones[id]) { p.progreso.docker.lecciones[id] = { fecha: F.hoy(), importada: true }; p.progreso.docker.xp += 20; n++; } });
      F.guardarLocal("catappa-progreso-local", p); E.progreso = p.progreso;
      F.toast(n ? n + " lecciones marcadas como completadas" : "Ya estaban todas completadas"); F.navegar();
    }
  };
  var ba = $("#imp-antiguo"); if (ba) ba.addEventListener("click", function () { importar(antiguo); });
  $("#imp-declarado").addEventListener("click", function () { importar(F.PROGRESO_DECLARADO); });
  var br = $("#reset-local");
  if (br) br.addEventListener("click", function () {
    if (!confirm("Se borrará todo tu progreso de invitado en este navegador. ¿Seguro?")) return;
    F.guardarLocal("catappa-progreso-local", { progreso: {}, actividad: {} }); E.progreso = {}; F.toast("Progreso local borrado"); F.navegar();
  });
};

/* ---------------- acceso ---------------- */
var DEMO = [
  ["pr", "pablo@catappa:~$ ", "docker run -d -p 8080:80 nginx:alpine"],
  ["dim", "", "a7c3e1f9b2d8…  contenedor en marcha"],
  ["pr", "pablo@catappa:~$ ", "git switch -c feature/login"],
  ["dim", "", "Switched to a new branch 'feature/login'"],
  ["pr", "pablo@catappa:~$ ", "kubectl rollout status deploy/api"],
  ["acc", "", "deployment \"api\" successfully rolled out ✓"]
];
function animarDemo() {
  var z = $("#term-demo"); if (!z) return;
  var li = 0, ci = 0, html = "";
  (function paso() {
    z = $("#term-demo"); if (!z) return;
    if (li >= DEMO.length) { setTimeout(function () { html = ""; li = 0; ci = 0; paso(); }, 2600); return; }
    var d = DEMO[li];
    if (d[0] !== "pr") { html += '<span class="' + d[0] + '">' + F.esc(d[2]) + "</span>\n"; li++; z.innerHTML = html; return setTimeout(paso, 500); }
    ci++;
    z.innerHTML = html + '<span class="pr">' + F.esc(d[1]) + "</span>" + F.esc(d[2].slice(0, ci)) + '<span class="cursor"></span>';
    if (ci >= d[2].length) { html += '<span class="pr">' + F.esc(d[1]) + "</span>" + F.esc(d[2]) + "\n"; li++; ci = 0; return setTimeout(paso, 420); }
    setTimeout(paso, 38 + Math.random() * 40);
  })();
}

F.vistaEntrar = function (prm) {
  var modo = prm.query.get("modo") === "registro" ? "registro" : "login";
  var raiz = $("#raiz");
  var hayAntiguo = F.progresoAntiguo().length;
  raiz.innerHTML =
    '<div class="acceso">' +
      '<div class="acceso-lado">' +
        '<a class="marca" href="#/" style="padding:0">' + F.MARCA.logo + '<span class="marca-nombre">' + F.esc(F.MARCA.nombre) + "</span></a>" +
        '<img class="acceso-cata" src="' + F.MARCA.mascota + '" width="232" height="256" alt="Cata, la mascota de Catappa">' +
        "<h1>Aprende tecnología <em>practicando</em>, no leyendo diapositivas.</h1>" +
        "<p>" + F.cursos().length + " cursos completos, de cero a nivel maestro: Linux, Docker, Kubernetes, AWS, Java, Spring Boot, SQL, Python, JavaScript, React y más. Cada concepto se explica y se practica al momento, con comunidad para resolver dudas.</p>" +
        '<div class="term-demo" id="term-demo"></div>' +
        '<div class="puntos-a"><span>' + F.icono("terminal").replace("<svg", '<svg style="width:18px;height:18px;flex:none"') + "<b>" + F.totalLecciones() + " lecciones</b> con ejercicios y terminal simulada</span>" +
        "<span>" + F.icono("comunidad").replace("<svg", '<svg style="width:18px;height:18px;flex:none"') + "<b>Comunidad</b> de preguntas y respuestas por lección</span>" +
        "<span>" + F.icono("fuego").replace("<svg", '<svg style="width:18px;height:18px;flex:none"') + "<b>Rachas, XP e insignias</b> sin límite de intentos</span></div>" +
      "</div>" +
      '<div class="acceso-form"><div class="caja">' +

        "<div><h2>" + (modo === "registro" ? "Crea tu cuenta" : "Entra en tu cuenta") + '</h2><p style="color:var(--ink-2);margin-top:4px">' + (modo === "registro" ? "Gratis, sin correo: solo un usuario y una contraseña." : "Continúa donde lo dejaste.") + "</p></div>" +
        (E.modo !== "servidor" ? '<div class="aviso-local">Estás abriendo la plataforma sin servidor: las cuentas no están disponibles. Puedes seguir como invitado.</div>' : "") +
        '<form id="form-acc" style="display:grid;gap:14px">' +
          (modo === "registro" ? '<div class="campo"><label for="f-nombre">Nombre</label><input class="entrada" id="f-nombre" autocomplete="name" maxlength="40" placeholder="Pablo Ocampos"></div>' : "") +
          '<div class="campo"><label for="f-usuario">Usuario</label><input class="entrada" id="f-usuario" autocomplete="username" autocapitalize="off" spellcheck="false" maxlength="20" placeholder="pablo">' + (modo === "registro" ? "<small>3–20 caracteres: minúsculas, números, guion o guion bajo.</small>" : "") + "</div>" +
          '<div class="campo"><label for="f-clave">Contraseña</label><input class="entrada" id="f-clave" type="password" autocomplete="' + (modo === "registro" ? "new-password" : "current-password") + '" minlength="6">' + (modo === "registro" ? "<small>Mínimo 6 caracteres.</small>" : "") + "</div>" +
          (modo === "registro" && hayAntiguo ? '<div class="aviso-local">Hemos encontrado <b>' + hayAntiguo + " lecciones</b> de Docker que completaste en el curso anterior. Se añadirán a tu cuenta.</div>" : "") +
          '<p class="error-form" id="f-error" hidden></p>' +
          '<button class="btn btn-primario btn-grande" type="submit"' + (E.modo !== "servidor" ? " disabled" : "") + ">" + (modo === "registro" ? "Crear cuenta" : "Entrar") + "</button>" +
        "</form>" +
        '<p class="alt">' + (modo === "registro" ? '¿Ya tienes cuenta? <button id="cambiar-modo">Entra</button>' : '¿Primera vez? <button id="cambiar-modo">Crea una cuenta</button>') + "</p>" +
        '<div class="separador">o</div>' +
        '<a class="btn" href="#/" id="invitado">Seguir como invitado</a>' +
      "</div></div>" +
    "</div>";
  $("#cambiar-modo").addEventListener("click", function () { F.ir("/entrar?modo=" + (modo === "registro" ? "login" : "registro")); });
  $("#invitado").addEventListener("click", function () { F.guardarLocal("catappa-visto-acceso", true); });
  animarDemo();
  $("#form-acc").addEventListener("submit", function (e) {
    e.preventDefault();
    var boton = this.querySelector("button[type=submit]"), err = $("#f-error");
    err.hidden = true; boton.disabled = true;
    var datos = { usuario: $("#f-usuario").value.trim().toLowerCase(), clave: $("#f-clave").value };
    if (modo === "registro") { datos.nombre = $("#f-nombre").value.trim(); datos.importar = F.progresoParaImportar(); }
    F.api("POST", modo === "registro" ? "/api/registro" : "/api/login", datos).then(function (d) {
      F.aplicarSesion(d);
      F.guardarLocal("catappa-visto-acceso", true);
      // al entrar en una cuenta existente, subir también lo hecho como invitado
      var pendiente = modo === "login" ? F.progresoParaImportar() : null;
      var hayPendiente = pendiente && Object.keys(pendiente).some(function (k) { return pendiente[k].length; });
      return (hayPendiente ? F.api("POST", "/api/importar", { progreso: pendiente }).then(function (r) { E.perfil = r.perfil; E.progreso = r.progreso; return r.importadas; }) : Promise.resolve(0)).then(function (n) {
        F.toast(modo === "registro" ? "Cuenta creada. ¡Bienvenido, " + E.perfil.nombre.split(" ")[0] + "!" : "Hola de nuevo, " + E.perfil.nombre.split(" ")[0]);
        if (n) setTimeout(function () { F.toast(n + " lecciones de tu progreso anterior añadidas a tu cuenta"); }, 600);
        location.hash = "#/";
      });
    }).catch(function (e2) { err.textContent = e2.message; err.hidden = false; boton.disabled = false; });
  });
};

})();
