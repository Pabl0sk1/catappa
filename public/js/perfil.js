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
        '<div class="usuario-p">@' + F.esc(p.usuario) + (p.pais ? " · " + F.bandera(p.pais, 13) + " " + F.esc(F.nombrePais(p.pais)) : "") + " · en " + F.esc(F.MARCA.nombre) + " desde " + new Date(p.creado).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) + "</div>" +
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
      (mio ? F.bloqueCuenta() : "") +
    "</div>"
  );
  var be = $("#editar-perfil"); if (be) be.addEventListener("click", editarPerfil);
  if (mio) F.conectarCuenta();
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
  var p = E.perfil;
  var colores = ["#179493", "#f5b642", "#7fd1b9", "#7aa2f7", "#f26d6d", "#c49bf2", "#8fd16a", "#f29e6d", "#6dd3f2"];
  var estado = { color: p.color, pais: p.pais || "", avatar: undefined };   // avatar undefined = no se toca

  var m = F.modal("Editar perfil",
    '<div class="ep-foto">' +
      '<div id="ep-vista">' + F.avatar({ nombre: p.nombre, usuario: p.usuario, color: p.color, avatar: p.avatar }, "l") + "</div>" +
      '<div class="ep-foto-acc">' +
        '<button class="btn btn-suave" id="ep-subir">' + F.icono("descargar").replace("<svg", '<svg style="transform:rotate(180deg)"') + "Subir foto</button>" +
        (p.avatar ? '<button class="btn btn-suave" id="ep-quitar-foto">Quitar foto</button>' : "") +
        '<input type="file" id="ep-archivo" accept="image/png,image/jpeg,image/webp" hidden>' +
        '<small>Cuadrada, se reduce a 256 px. PNG, JPG o WEBP.</small>' +
      "</div>" +
    "</div>" +
    '<div class="campo"><label for="ep-nombre">Nombre</label><input class="entrada" id="ep-nombre" maxlength="40" value="' + F.esc(p.nombre) + '"></div>' +
    '<div class="campo"><label>Usuario</label><input class="entrada" value="@' + F.esc(p.usuario) + '" disabled><small>El nombre de usuario no se puede cambiar.</small></div>' +
    '<div class="campo"><label for="ep-nac">Fecha de nacimiento</label><input class="entrada" id="ep-nac" type="date" max="' + new Date().toISOString().slice(0, 10) + '" value="' + F.esc(p.nacimiento || "") + '"><small>No se enseña a nadie.</small></div>' +
    '<div class="campo"><label>País de origen</label>' +
      '<button type="button" class="entrada selector-pais" id="ep-pais">' + pintaPais(estado.pais) + "</button></div>" +
    '<div class="campo"><label for="ep-bio">Sobre ti</label><textarea class="area" id="ep-bio" maxlength="240" style="min-height:90px" placeholder="Qué haces, qué estás aprendiendo, qué buscas…">' + F.esc(p.bio || "") + "</textarea><small>Máximo 240 caracteres.</small></div>" +
    '<div class="campo"><label>Color del avatar</label><div class="colores">' +
      colores.map(function (c) { return '<button type="button" style="background:' + c + '" data-color="' + c + '" aria-label="Color ' + c + '" aria-pressed="' + (c === estado.color) + '"></button>'; }).join("") + "</div></div>" +
    '<p class="error-form" hidden></p>',
    '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-primario" id="ep-guardar">Guardar</button>');

  function refrescarFoto() {
    var vista = m.el.querySelector("#ep-vista");
    var foto = estado.avatar === undefined ? p.avatar : estado.avatar;
    vista.innerHTML = F.avatar({ nombre: m.el.querySelector("#ep-nombre").value || p.nombre, usuario: p.usuario, color: estado.color, avatar: foto }, "l");
  }
  $$("[data-color]", m.el).forEach(function (b) {
    b.addEventListener("click", function () {
      estado.color = b.dataset.color;
      $$("[data-color]", m.el).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      refrescarFoto();
    });
  });
  m.el.querySelector("#ep-nombre").addEventListener("input", refrescarFoto);
  m.el.querySelector("#ep-subir").addEventListener("click", function () { m.el.querySelector("#ep-archivo").click(); });
  m.el.querySelector("#ep-archivo").addEventListener("change", function () {
    var archivo = this.files && this.files[0];
    if (!archivo) return;
    F.reducirImagen(archivo).then(function (dataUrl) {
      estado.avatar = dataUrl; refrescarFoto();
    }).catch(function (e) {
      var err = m.el.querySelector(".error-form"); err.textContent = e.message; err.hidden = false;
    });
  });
  var bq = m.el.querySelector("#ep-quitar-foto");
  if (bq) bq.addEventListener("click", function () { estado.avatar = ""; refrescarFoto(); });
  m.el.querySelector("#ep-pais").addEventListener("click", function () {
    var boton = this;
    F.dialogoPais(function (codigo) { estado.pais = codigo; boton.innerHTML = pintaPais(codigo); });
  });

  m.el.querySelector("#ep-guardar").addEventListener("click", function () {
    var b = this; b.disabled = true;
    var datos = {
      nombre: m.el.querySelector("#ep-nombre").value,
      bio: m.el.querySelector("#ep-bio").value,
      color: estado.color,
      pais: estado.pais,
      nacimiento: m.el.querySelector("#ep-nac").value
    };
    if (estado.avatar !== undefined) datos.avatar = estado.avatar;
    F.api("POST", "/api/perfil", datos).then(function (d) {
      E.perfil = d.perfil; F.guardarSesionCache();
      m.cerrar(); F.toast("Perfil actualizado"); F.navegar();
    }).catch(function (e) {
      var err = m.el.querySelector(".error-form"); err.textContent = e.message; err.hidden = false;
      b.disabled = false;
    });
  });
}

function pintaPais(codigo) {
  return codigo
    ? F.bandera(codigo, 16) + "<span>" + F.esc(F.nombrePais(codigo)) + "</span>"
    : '<span style="color:var(--ink-3)">Sin especificar</span>';
}

/* bloque de cuenta del perfil propio: correo, contraseña y borrado */
F.bloqueCuenta = function () {
  var p = E.perfil;
  if (!p) return "";
  return '<section class="seccion"><div class="seccion-cab"><h2>Tu cuenta</h2><span class="mono">solo lo ves tú</span></div>' +
    '<div class="panel panel-pad filas-cuenta">' +
      '<div class="fila-cuenta"><div><b>Correo electrónico</b>' +
        (p.correo
          ? '<span>' + F.esc(p.correo) + (p.correoVerificado ? ' <span class="badge ok">verificado</span>' : "") + "</span>"
          : "<span>Sin correo. Añádelo para poder recuperar la contraseña si la olvidas.</span>") + "</div>" +
        '<div class="fila-acc"><button class="btn btn-suave" id="cu-correo">' + (p.correo ? "Cambiar" : "Añadir correo") + "</button>" +
        (p.correo ? '<button class="btn btn-suave" id="cu-quitar">Quitar</button>' : "") + "</div></div>" +
      '<div class="fila-cuenta"><div><b>Contraseña</b><span>Cámbiala cuando quieras. Se cerrarán las demás sesiones.</span></div>' +
        '<div class="fila-acc"><button class="btn btn-suave" id="cu-clave">Cambiar contraseña</button></div></div>' +
      '<div class="fila-cuenta"><div><b>Cerrar sesión</b><span>En este dispositivo.</span></div>' +
        '<div class="fila-acc"><button class="btn btn-suave" id="cu-salir">' + F.icono("salir") + "Cerrar sesión</button></div></div>" +
      '<div class="fila-cuenta peligro"><div><b>Borrar la cuenta</b><span>Se borra todo tu progreso y se desvincula tu correo. No se puede deshacer.</span></div>' +
        '<div class="fila-acc"><button class="btn btn-peligro" id="cu-borrar">Borrar mi cuenta</button></div></div>' +
    "</div></section>";
};

F.conectarCuenta = function () {
  var c = $("#cu-correo"); if (c) c.addEventListener("click", function () { F.dialogoCorreo(function () { F.navegar(); }); });
  var q = $("#cu-quitar"); if (q) q.addEventListener("click", function () { F.dialogoQuitarCorreo(function () { F.navegar(); }); });
  var k = $("#cu-clave"); if (k) k.addEventListener("click", F.dialogoClave);
  var s2 = $("#cu-salir"); if (s2) s2.addEventListener("click", F.dialogoSalir);
  var b = $("#cu-borrar"); if (b) b.addEventListener("click", F.dialogoBorrarCuenta);
};

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
      "";
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
        (E.perfil ? "<span>Sesión iniciada como <b>@" + F.esc(E.perfil.usuario) + "</b>. Tus datos, correo y contraseña están en <a href=\"#/perfil\">tu perfil</a>.</span>" +
            '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-suave" href="#/perfil">Ver mi perfil</a><button class="btn" id="salir">' + F.icono("salir") + "Cerrar sesión</button></div>"
          : "<span>Modo sin conexión: se está usando la última copia guardada. Arranca el servidor con <code>docker compose up -d</code>.</span>") +
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
  var bs = $("#salir"); if (bs) bs.addEventListener("click", F.dialogoSalir);
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
};

/* ---------------- acceso ----------------
   Pantalla de entrada y de registro. Una sola animación de terminal viva
   a la vez (antes se acumulaban al cambiar de modo y parpadeaba), y el
   prompt es root@ hasta que hay sesión, momento en el que pasa a ser el
   nombre de quien entra. */
var DEMO = [
  ["pr", "", "docker run -d -p 8080:80 nginx:alpine"],
  ["dim", "", "a7c3e1f9b2d8…  contenedor en marcha"],
  ["pr", "", "git switch -c feature/login"],
  ["dim", "", "Switched to a new branch 'feature/login'"],
  ["pr", "", "kubectl rollout status deploy/api"],
  ["acc", "", "deployment \"api\" successfully rolled out ✓"]
];
var demoGen = 0;                      // cada animación lleva su número: si cambia, la vieja se calla
F.usuarioTerminal = function () {
  return (E.perfil && E.perfil.usuario) ? E.perfil.usuario : "root";
};
function animarDemo() {
  var z = $("#term-demo"); if (!z) return;
  var gen = ++demoGen;                // invalida cualquier animación anterior
  var prompt = F.usuarioTerminal() + "@catappa:~$ ";
  var li = 0, ci = 0, html = "";
  (function paso() {
    if (gen !== demoGen) return;      // se ha repintado la pantalla: esta animación ya no manda
    z = $("#term-demo"); if (!z) return;
    if (li >= DEMO.length) { setTimeout(function () { if (gen !== demoGen) return; html = ""; li = 0; ci = 0; paso(); }, 2600); return; }
    var d = DEMO[li];
    if (d[0] !== "pr") { html += '<span class="' + d[0] + '">' + F.esc(d[2]) + "</span>\n"; li++; z.innerHTML = html; return setTimeout(paso, 500); }
    ci++;
    z.innerHTML = html + '<span class="pr">' + F.esc(prompt) + "</span>" + F.esc(d[2].slice(0, ci)) + '<span class="cursor"></span>';
    if (ci >= d[2].length) { html += '<span class="pr">' + F.esc(prompt) + "</span>" + F.esc(d[2]) + "\n"; li++; ci = 0; return setTimeout(paso, 420); }
    setTimeout(paso, 38 + Math.random() * 40);
  })();
}

/* los tres modos de la pantalla: entrar, crear cuenta y recuperar contraseña */
function formulario(modo, hayAntiguo) {
  var c = {
    login: {
      titulo: "Entra en tu cuenta", sub: "Continúa donde lo dejaste.", boton: "Entrar",
      campos:
        '<div class="campo"><label for="f-id">Usuario o correo</label>' +
          '<input class="entrada" id="f-id" autocomplete="username" autocapitalize="off" spellcheck="false" maxlength="120" placeholder="tu usuario o tu correo" required></div>' +
        '<div class="campo"><label for="f-clave">Contraseña</label>' +
          '<input class="entrada" id="f-clave" type="password" autocomplete="current-password" required>' +
          '<button type="button" class="enlace-sutil" id="f-olvide">¿Has olvidado la contraseña?</button></div>',
      pie: '¿Primera vez? <button id="cambiar-modo" data-a="registro">Crea una cuenta</button>'
    },
    registro: {
      titulo: "Crea tu cuenta", sub: "Solo cuatro datos. El correo puedes añadirlo después.", boton: "Crear cuenta",
      campos:
        '<div class="campo"><label for="f-nombre">Nombre</label>' +
          '<input class="entrada" id="f-nombre" autocomplete="name" maxlength="40" placeholder="Nombre y apellido" required></div>' +
        '<div class="campo"><label for="f-usuario">Usuario</label>' +
          '<input class="entrada" id="f-usuario" autocomplete="username" autocapitalize="off" spellcheck="false" maxlength="20" placeholder="p. ej. ana_dev" required>' +
          "<small>3–20 caracteres: minúsculas, números, guion o guion bajo.</small></div>" +
        '<div class="campo"><label for="f-clave">Contraseña</label>' +
          '<input class="entrada" id="f-clave" type="password" autocomplete="new-password" minlength="6" required><small>Mínimo 6 caracteres.</small></div>' +
        '<div class="campo"><label for="f-clave2">Repite la contraseña</label>' +
          '<input class="entrada" id="f-clave2" type="password" autocomplete="new-password" minlength="6" required></div>' +
        (hayAntiguo ? '<div class="aviso-local">Hemos encontrado <b>' + hayAntiguo + " lecciones</b> de Docker que completaste antes en este navegador. Se añadirán a tu cuenta.</div>" : ""),
      pie: '¿Ya tienes cuenta? <button id="cambiar-modo" data-a="login">Entra</button>'
    },
    recuperar: {
      titulo: "Recupera tu contraseña", sub: "Te mandamos un código al correo de tu cuenta.", boton: "Enviar código",
      campos:
        '<div class="campo"><label for="f-correo">Correo de tu cuenta</label>' +
          '<input class="entrada" id="f-correo" type="email" autocomplete="email" inputmode="email" maxlength="120" required></div>' +
        '<div id="f-paso2" hidden>' +
          '<div class="campo"><label for="f-codigo">Código recibido</label>' +
            '<input class="entrada" id="f-codigo" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>' +
          '<div class="campo"><label for="f-nueva">Contraseña nueva</label>' +
            '<input class="entrada" id="f-nueva" type="password" autocomplete="new-password" minlength="6"></div>' +
          '<div class="campo"><label for="f-nueva2">Repite la nueva</label>' +
            '<input class="entrada" id="f-nueva2" type="password" autocomplete="new-password" minlength="6"></div>' +
          '<p class="nota-suave" id="f-local" hidden></p></div>',
      pie: '<button id="cambiar-modo" data-a="login">Volver a entrar</button>'
    }
  };
  return c[modo];
}

F.vistaEntrar = function (prm) {
  var q = prm.query.get("modo");
  var modo = q === "registro" ? "registro" : q === "recuperar" ? "recuperar" : "login";
  var raiz = $("#raiz");
  var hayAntiguo = F.progresoAntiguo().length;
  var cfg = formulario(modo, hayAntiguo);

  raiz.innerHTML =
    '<div class="acceso">' +
      '<div class="acceso-lado">' +
        '<div class="acceso-lado-int">' +
          '<a class="marca" href="#/entrar" style="padding:0">' + F.MARCA.logo + '<span class="marca-nombre">' + F.esc(F.MARCA.nombre) + "</span></a>" +
          '<img class="acceso-cata" src="' + F.MARCA.mascota + '" width="232" height="256" alt="Cata, la mascota de Catappa">' +
          "<h1>Aprende tecnología <em>practicando</em>, no leyendo diapositivas.</h1>" +
          "<p>" + F.cursos().length + " cursos completos, de cero a nivel maestro: Linux, Docker, Kubernetes, AWS, Java, Spring Boot, SQL, Python, JavaScript, React y más. Cada concepto se explica y se practica al momento.</p>" +
          '<div class="term-demo" id="term-demo"></div>' +
          '<div class="puntos-a"><span>' + F.icono("terminal").replace("<svg", '<svg style="width:18px;height:18px;flex:none"') + "<b>" + F.totalLecciones() + " lecciones</b> con ejercicios y terminal</span>" +
          "<span>" + F.icono("carpeta").replace("<svg", '<svg style="width:18px;height:18px;flex:none"') + "<b>Proyectos</b> que se comprueban de verdad</span>" +
          "<span>" + F.icono("fuego").replace("<svg", '<svg style="width:18px;height:18px;flex:none"') + "<b>Rachas, XP e insignias</b> sin límite de intentos</span></div>" +
        "</div>" +
      "</div>" +
      '<div class="acceso-form"><div class="caja">' +
        '<a class="marca solo-movil" href="#/entrar">' + F.MARCA.logo + '<span class="marca-nombre">' + F.esc(F.MARCA.nombre) + "</span></a>" +
        "<div><h2>" + cfg.titulo + '</h2><p class="caja-sub">' + cfg.sub + "</p></div>" +
        (E.modo !== "servidor" ? '<div class="aviso-local">No hay conexión con el servidor de Catappa, así que no se puede entrar ahora mismo. Comprueba que está levantado y recarga.</div>' : "") +
        '<form id="form-acc">' + cfg.campos +
          '<p class="error-form" id="f-error" hidden></p>' +
          '<button class="btn btn-primario btn-grande" type="submit"' + (E.modo !== "servidor" ? " disabled" : "") + ">" + cfg.boton + "</button>" +
        "</form>" +
        '<p class="alt">' + cfg.pie + "</p>" +
      "</div></div>" +
    "</div>";

  F.mejorarClaves(raiz);
  animarDemo();
  var err = $("#f-error");
  var mostrarError = function (t) { err.textContent = t; err.hidden = !t; };

  $("#cambiar-modo").addEventListener("click", function () { F.ir("/entrar?modo=" + this.dataset.a); });
  var olvide = $("#f-olvide");
  if (olvide) olvide.addEventListener("click", function () { F.ir("/entrar?modo=recuperar"); });

  var paso = 1;
  $("#form-acc").addEventListener("submit", function (e) {
    e.preventDefault();
    var boton = this.querySelector("button[type=submit]");
    mostrarError(""); boton.disabled = true;

    if (modo === "recuperar") return recuperar(boton, mostrarError);

    var datos = modo === "registro"
      ? { usuario: $("#f-usuario").value.trim().toLowerCase(), nombre: $("#f-nombre").value.trim(),
          clave: $("#f-clave").value, clave2: $("#f-clave2").value, importar: F.progresoParaImportar() }
      : { identificador: $("#f-id").value.trim(), clave: $("#f-clave").value };

    if (modo === "registro" && datos.clave !== datos.clave2) {
      mostrarError("Las dos contraseñas no coinciden."); boton.disabled = false; return;
    }

    F.api("POST", modo === "registro" ? "/api/registro" : "/api/login", datos).then(function (d) {
      F.aplicarSesion(d);
      F.guardarLocal("catappa-visto-acceso", true);
      var pendiente = modo === "login" ? F.progresoParaImportar() : null;
      var hayPendiente = pendiente && Object.keys(pendiente).some(function (k) { return pendiente[k].length; });
      return (hayPendiente ? F.api("POST", "/api/importar", { progreso: pendiente }).then(function (r) { E.perfil = r.perfil; E.progreso = r.progreso; return r.importadas; }) : Promise.resolve(0)).then(function (n) {
        F.toast(modo === "registro" ? "Cuenta creada. ¡Bienvenido, " + E.perfil.nombre.split(" ")[0] + "!" : "Hola de nuevo, " + E.perfil.nombre.split(" ")[0]);
        if (n) setTimeout(function () { F.toast(n + " lecciones de tu progreso anterior añadidas a tu cuenta"); }, 600);
        var destino = F.leerLocal("catappa-destino", "");
        try { localStorage.removeItem("catappa-destino"); } catch (x) {}
        location.hash = "#" + (destino || "/");
      });
    }).catch(function (e2) { mostrarError(e2.message); boton.disabled = false; });
  });

  function recuperar(boton, mostrarError) {
    if (paso === 1) {
      F.api("POST", "/api/clave/olvidada", { correo: $("#f-correo").value.trim() }).then(function (d) {
        paso = 2;
        $("#f-paso2").hidden = false;
        $("#f-correo").readOnly = true;
        boton.textContent = "Cambiar la contraseña"; boton.disabled = false;
        F.mejorarClaves(raiz);
        $("#f-codigo").focus();
        if (d.local && d.codigo) {
          var n = $("#f-local");
          n.innerHTML = "Este servidor no tiene correo configurado, así que el código es: <b>" + F.esc(d.codigo) + "</b>";
          n.hidden = false;
        } else {
          F.toast("Si esa cuenta existe, ya tiene un código en el correo");
        }
      }).catch(function (e) { mostrarError(e.message); boton.disabled = false; });
      return;
    }
    var nueva = $("#f-nueva").value, nueva2 = $("#f-nueva2").value;
    if (nueva !== nueva2) { mostrarError("Las dos contraseñas no coinciden."); boton.disabled = false; return; }
    F.api("POST", "/api/clave/restablecer", {
      correo: $("#f-correo").value.trim(), codigo: $("#f-codigo").value.trim(), clave: nueva, clave2: nueva2
    }).then(function () {
      F.toast("Contraseña cambiada. Ya puedes entrar.");
      F.ir("/entrar?modo=login");
    }).catch(function (e) { mostrarError(e.message); boton.disabled = false; });
  }
};

})();
