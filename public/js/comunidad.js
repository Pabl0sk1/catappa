/* =====================================================================
   CATAPPA — comunidad: preguntas, debates y recursos con votos y respuestas
   ===================================================================== */
(function () {
"use strict";
var F = window.F, $ = F.$, $$ = F.$$, E = F.E;

var TIPOS = { pregunta: "Pregunta", debate: "Debate", recurso: "Recurso" };

function nombreCurso(id) { var c = F.curso(id); return c ? c.titulo : "General"; }
function colorCurso(id) { var c = F.curso(id); return c ? c.color : "var(--ink-3)"; }
function tituloLeccion(cursoId, leccionId) {
  var x = cursoId && leccionId ? F.buscarLeccion(cursoId, leccionId) : null;
  return x ? x.leccion.titulo : null;
}

F.filaPost = function (p) {
  return '<a class="post" href="#/comunidad/' + F.esc(p.id) + '">' +
    '<div class="post-cifras"><span>' + p.votos + " votos</span><span class=\"resp" + (p.resuelta ? " resuelta" : "") + '">' + p.respuestas + " resp.</span></div>" +
    "<div><div class=\"post-t\">" + F.esc(p.titulo) + '</div><div class="post-ex">' + F.esc(p.extracto.replace(/```[\s\S]*?(```|$)/g, " […código…] ").replace(/[`*]/g, "")) + "</div>" +
    '<div class="post-meta"><span class="badge">' + TIPOS[p.tipo] + '</span><span class="badge"><span class="punto" style="background:' + colorCurso(p.cursoId) + '"></span>' + F.esc(nombreCurso(p.cursoId)) + "</span>" +
    (p.etiquetas || []).map(function (t) { return '<span class="badge">#' + F.esc(t) + "</span>"; }).join("") +
    '<span class="autor">' + F.avatar(p.autor, "s") + F.esc(p.autor.nombre) + (p.autor.rol === "mentor" ? ' <span class="badge mentor">mentor</span>' : "") + "</span><span>" + F.hace(p.creado) + "</span></div></div></a>";
};

function sinServidor() {
  F.pintar('<div class="ancho-texto"><div class="eyebrow"><b>~/comunidad</b></div><h1 class="titulo-pag">Comunidad</h1><div class="panel vacio"><b>La comunidad necesita el servidor.</b>Estás usando la plataforma abriendo el fichero directamente. Arráncala con <code>docker compose up -d</code> en la carpeta <code>plataforma</code> y entra en http://localhost:8090.</div></div>');
}

function pedirCuenta(accion) {
  var m = F.modal("Necesitas una cuenta", "<p>Para " + accion + " hace falta iniciar sesión. Tu progreso de invitado se importa automáticamente al crear la cuenta.</p>",
    '<button class="btn" data-cerrar>Ahora no</button><a class="btn btn-primario" href="#/entrar?modo=registro">Crear cuenta</a>');
  m.el.querySelector("a").addEventListener("click", function () { m.cerrar(); });
}

/* ---------------- listado ---------------- */
F.vistaComunidad = function (prm) {
  if (E.modo !== "servidor") return sinServidor();
  var q = prm.query;
  var filtro = { curso: q.get("curso") || "", leccion: q.get("leccion") || "", orden: q.get("orden") || "recientes", texto: q.get("q") || "", tipo: q.get("tipo") || "" };
  var tLeccion = tituloLeccion(filtro.curso, filtro.leccion);

  var segCurso = [["", "Todo"]].concat(F.cursos().map(function (c) { return [c.id, c.titulo]; })).map(function (x) {
    return '<button data-curso="' + x[0] + '" aria-pressed="' + (filtro.curso === x[0]) + '">' + F.esc(x[1]) + "</button>";
  }).join("");
  var segOrden = [["recientes", "Recientes"], ["votos", "Más votadas"], ["sin-respuesta", "Sin respuesta"]].map(function (x) {
    return '<button data-orden="' + x[0] + '" aria-pressed="' + (filtro.orden === x[0]) + '">' + x[1] + "</button>";
  }).join("");

  F.pintar(
    '<div class="ancho">' +
      '<div class="eyebrow"><b>~/comunidad</b><span>preguntas · debates · recursos</span></div>' +
      '<div style="display:flex;align-items:end;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><h1 class="titulo-pag">Comunidad</h1><p class="subtitulo">Pregunta lo que no te quede claro de una lección, comparte recursos y ayuda a otros. Explicar algo es la mejor forma de aprenderlo.</p></div>' +
      '<button class="btn btn-primario" id="nuevo-post">' + F.icono("mas") + "Nueva publicación</button></div>" +
      (tLeccion ? '<div class="panel panel-pad" style="margin-top:18px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><span>Mostrando dudas de la lección <b>' + F.esc(tLeccion) + '</b> (' + F.esc(nombreCurso(filtro.curso)) + ')</span><a class="btn btn-suave" href="#/comunidad?curso=' + filtro.curso + '">Ver todo el curso</a></div>' : "") +
      '<div class="com-layout"><div>' +
        '<div class="com-filtros"><div class="segmentado" id="seg-curso">' + segCurso + '</div><div class="segmentado" id="seg-orden">' + segOrden + "</div>" +
        '<input class="entrada" id="buscar-com" type="search" placeholder="Buscar en la comunidad…" value="' + F.esc(filtro.texto) + '"></div>' +
        '<div class="posts" id="lista-posts"><div class="vacio">Cargando…</div></div>' +
      "</div>" +
      '<aside class="lateral-com">' +
        '<div class="panel panel-pad"><h3>Cómo preguntar bien</h3><ul><li>Di qué intentabas hacer y qué esperabas que pasara.</li><li>Pega el comando y el error exacto entre <code>```</code>.</li><li>Indica la lección si viene de un curso.</li><li>Cuando te ayuden, marca la respuesta aceptada.</li></ul></div>' +
        '<div class="panel panel-pad"><h3>Normas</h3><ul><li>Se critica el código, nunca a la persona.</li><li>Nada de contraseñas ni tokens en lo que publiques.</li><li>Si encuentras la solución tú, compártela.</li></ul></div>' +
      "</aside></div>" +
    "</div>"
  );

  var actualizarRuta = function (cambios) {
    var f = Object.assign({}, filtro, cambios), qs = new URLSearchParams();
    if (f.curso) qs.set("curso", f.curso);
    if (f.leccion && f.curso === filtro.curso) qs.set("leccion", f.leccion);
    if (f.orden !== "recientes") qs.set("orden", f.orden);
    if (f.texto) qs.set("q", f.texto);
    F.ir("/comunidad" + (qs.toString() ? "?" + qs.toString() : ""));
  };
  $$("#seg-curso button").forEach(function (b) { b.addEventListener("click", function () { actualizarRuta({ curso: b.dataset.curso, leccion: "" }); }); });
  $$("#seg-orden button").forEach(function (b) { b.addEventListener("click", function () { actualizarRuta({ orden: b.dataset.orden }); }); });
  var tBuscar;
  $("#buscar-com").addEventListener("input", function (e) { clearTimeout(tBuscar); var v = e.target.value; tBuscar = setTimeout(function () { cargar(v); }, 250); });
  $("#buscar-com").addEventListener("keydown", function (e) { if (e.key === "Enter") actualizarRuta({ texto: e.target.value.trim() }); });
  $("#nuevo-post").addEventListener("click", function () {
    if (!E.perfil) return pedirCuenta("publicar en la comunidad");
    F.nuevoPost({ cursoId: filtro.curso, leccionId: filtro.leccion });
  });

  function cargar(texto) {
    var qs = new URLSearchParams();
    if (filtro.curso) qs.set("curso", filtro.curso);
    if (filtro.leccion) qs.set("leccion", filtro.leccion);
    qs.set("orden", filtro.orden);
    if (texto) qs.set("q", texto);
    F.api("GET", "/api/comunidad?" + qs.toString()).then(function (lista) {
      var z = $("#lista-posts"); if (!z) return;
      z.innerHTML = lista.length ? lista.map(F.filaPost).join("") :
        '<div class="vacio"><b>' + (tLeccion ? "Nadie ha preguntado todavía sobre esta lección." : "No hay publicaciones con estos filtros.") + "</b>Sé la primera persona en abrir el tema.</div>";
    }).catch(function (e) { var z = $("#lista-posts"); if (z) z.innerHTML = '<div class="vacio"><b>No se pudo cargar la comunidad.</b>' + F.esc(e.message) + "</div>"; });
  }
  cargar(filtro.texto);
};

/* ---------------- nueva publicación ---------------- */
F.nuevoPost = function (pre) {
  pre = pre || {};
  var opcionesCurso = '<option value="">General</option>' + F.cursos().map(function (c) { return '<option value="' + c.id + '"' + (pre.cursoId === c.id ? " selected" : "") + ">" + F.esc(c.titulo) + "</option>"; }).join("");
  var tLec = tituloLeccion(pre.cursoId, pre.leccionId);
  var m = F.modal("Nueva publicación",
    '<div class="dos-col"><div class="campo"><label for="np-tipo">Tipo</label><select class="select" id="np-tipo"><option value="pregunta">Pregunta</option><option value="debate">Debate</option><option value="recurso">Recurso</option></select></div>' +
    '<div class="campo"><label for="np-curso">Curso</label><select class="select" id="np-curso">' + opcionesCurso + "</select></div></div>" +
    (tLec ? '<div class="aviso-local">Se vinculará a la lección <b>' + F.esc(tLec) + "</b>.</div>" : "") +
    '<div class="campo"><label for="np-titulo">Título</label><input class="entrada" id="np-titulo" maxlength="140" placeholder="Ej.: Mi contenedor se para nada más arrancar con Exited (1)"></div>' +
    '<div class="campo"><label for="np-cuerpo">Detalle</label><textarea class="area" id="np-cuerpo" maxlength="8000" placeholder="Qué intentabas, qué comando usaste y qué error sale. El código, entre ```."></textarea><small>Admite <code>`código`</code>, bloques con <code>```</code>, <b>**negrita**</b> y listas con guion.</small></div>' +
    '<div class="campo"><label for="np-tags">Etiquetas (opcional, separadas por comas)</label><input class="entrada" id="np-tags" placeholder="compose, redes"></div>' +
    '<p class="error-form" id="np-error" hidden></p>',
    '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-primario" id="np-enviar">Publicar</button>');
  $("#np-enviar").addEventListener("click", function () {
    var b = this; b.disabled = true;
    F.api("POST", "/api/comunidad", {
      tipo: $("#np-tipo").value, cursoId: $("#np-curso").value || null,
      leccionId: $("#np-curso").value === pre.cursoId ? (pre.leccionId || null) : null,
      titulo: $("#np-titulo").value, cuerpo: $("#np-cuerpo").value,
      etiquetas: $("#np-tags").value.split(",").map(function (x) { return x.trim(); }).filter(Boolean)
    }).then(function (p) {
      m.cerrar(); F.toast("Publicado"); F.refrescarPerfil(); F.ir("/comunidad/" + p.id);
    }).catch(function (e) { var er = $("#np-error"); er.textContent = e.message; er.hidden = false; b.disabled = false; });
  });
};

/* ---------------- hilo ---------------- */
F.vistaPost = function (prm) {
  if (E.modo !== "servidor") return sinServidor();
  F.pintar('<div class="ancho-texto"><div class="vacio">Cargando…</div></div>');
  F.api("GET", "/api/comunidad/" + encodeURIComponent(prm.id)).then(function (p) { pintarPost(p); })
    .catch(function (e) { F.pintar('<div class="ancho-texto"><div class="vacio"><b>' + F.esc(e.message) + '</b><a href="#/comunidad">Volver a la comunidad</a></div></div>'); });
};

function bloqueVoto(votos, votado, datos) {
  return '<div class="votar"><button aria-label="Votar como útil" aria-pressed="' + !!votado + '" ' + datos + ">" + F.icono("arriba") + "</button><b>" + votos + "</b></div>";
}

function pintarPost(p) {
  var tLec = tituloLeccion(p.cursoId, p.leccionId);
  var respuestas = p.respuestas.map(function (r) {
    return '<div class="hilo-item respuesta' + (r.aceptada ? " aceptada" : "") + '">' +
      '<div>' + bloqueVoto(r.votos, r.votado, 'data-voto-resp="' + r.id + '"') + (r.aceptada ? '<div class="aceptada-marca" title="Respuesta aceptada" style="display:grid;justify-items:center;margin-top:8px">' + F.icono("aceptada") + "</div>" : "") + "</div>" +
      '<div><div class="md">' + F.md(r.cuerpo) + "</div>" +
      '<div class="hilo-meta"><a href="#/perfil/' + F.esc(r.autor.usuario) + '" class="post-meta autor" style="margin:0;text-decoration:none">' + F.avatar(r.autor, "s") + F.esc(r.autor.nombre) + "</a>" + (r.autor.rol === "mentor" ? '<span class="badge mentor">mentor</span>' : "") + "<span>" + F.hace(r.creado) + "</span>" +
      (p.esMio && !r.esMia ? '<span class="acciones-h"><button class="btn btn-suave" data-aceptar="' + r.id + '">' + (r.aceptada ? "Quitar aceptada" : F.icono("aceptada") + "Marcar como aceptada") + "</button></span>" : "") + "</div></div></div>";
  }).join("");

  F.pintar(
    '<div class="ancho-texto">' +
      '<a class="mono" href="#/comunidad' + (p.cursoId ? "?curso=" + p.cursoId : "") + '" style="text-decoration:none;color:var(--ink-3);font-size:12.5px">← comunidad' + (p.cursoId ? " / " + F.esc(nombreCurso(p.cursoId).toLowerCase()) : "") + "</a>" +
      '<h1 class="titulo-pag" style="font-size:clamp(22px,3vw,30px)">' + F.esc(p.titulo) + "</h1>" +
      '<div class="post-meta" style="margin-top:0"><span class="badge">' + TIPOS[p.tipo] + '</span><span class="badge"><span class="punto" style="background:' + colorCurso(p.cursoId) + '"></span>' + F.esc(nombreCurso(p.cursoId)) + "</span>" +
      (tLec ? '<a class="badge info" href="#/leccion/' + p.cursoId + "/" + p.leccionId + '" style="text-decoration:none">lección: ' + F.esc(tLec) + "</a>" : "") +
      (p.etiquetas || []).map(function (t) { return '<span class="badge">#' + F.esc(t) + "</span>"; }).join("") + "</div>" +
      '<div class="hilo">' +
        '<div class="hilo-item">' + bloqueVoto(p.votos, p.votado, "data-voto-post") +
          '<div><div class="md">' + F.md(p.cuerpo) + "</div>" +
          '<div class="hilo-meta"><a href="#/perfil/' + F.esc(p.autor.usuario) + '" class="post-meta autor" style="margin:0;text-decoration:none">' + F.avatar(p.autor, "s") + F.esc(p.autor.nombre) + "</a>" + (p.autor.rol === "mentor" ? '<span class="badge mentor">mentor</span>' : "") + "<span>" + F.hace(p.creado) + "</span>" +
          (p.esMio ? '<span class="acciones-h"><button class="btn btn-suave btn-peligro" id="borrar-post">' + F.icono("papelera") + "Borrar</button></span>" : "") + "</div></div>" +
        "</div>" +
        '<div class="seccion-cab" style="margin:26px 0 0"><h2>' + p.respuestas.length + (p.respuestas.length === 1 ? " respuesta" : " respuestas") + "</h2></div>" +
        (respuestas || '<div class="vacio" style="padding:26px 0"><b>Todavía sin respuestas.</b>¿Sabes la respuesta? Échale una mano.</div>') +
      "</div>" +
      '<div class="panel panel-pad" style="margin-top:22px;display:grid;gap:12px">' +
        (E.perfil
          ? '<label for="resp-cuerpo" style="font-weight:600">Tu respuesta</label><textarea class="area" id="resp-cuerpo" placeholder="Explica el porqué, no solo el qué. El código, entre ```."></textarea><p class="error-form" id="resp-error" hidden></p><div style="display:flex;justify-content:flex-end"><button class="btn btn-primario" id="resp-enviar">Responder</button></div>'
          : '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span>Inicia sesión para responder y votar.</span><a class="btn btn-primario" href="#/entrar">Entrar</a></div>') +
      "</div>" +
    "</div>"
  );

  var recargar = function () { F.api("GET", "/api/comunidad/" + p.id).then(pintarPost); };
  var votar = function (cuerpo) {
    if (!E.perfil) return pedirCuenta("votar");
    F.api("POST", "/api/comunidad/" + p.id + "/voto", cuerpo).then(recargar).catch(function (e) { F.toast(e.message, "!"); });
  };
  var vp = $("[data-voto-post]"); if (vp) vp.addEventListener("click", function () { votar({}); });
  $$("[data-voto-resp]").forEach(function (b) { b.addEventListener("click", function () { votar({ respuesta: b.dataset.votoResp }); }); });
  $$("[data-aceptar]").forEach(function (b) {
    b.addEventListener("click", function () { F.api("POST", "/api/comunidad/" + p.id + "/aceptar", { respuesta: b.dataset.aceptar }).then(recargar).catch(function (e) { F.toast(e.message, "!"); }); });
  });
  var bb = $("#borrar-post");
  if (bb) bb.addEventListener("click", function () {
    F.confirmar({ titulo: "Borrar la publicación", texto: "Se borrará esta publicación y todas sus respuestas. No se puede deshacer.", aceptar: "Borrar", peligro: true }).then(function (si) {
      if (!si) return;
      F.api("DELETE", "/api/comunidad/" + p.id).then(function () { F.toast("Publicación borrada"); F.ir("/comunidad"); }).catch(function (e) { F.toast(e.message, "!"); });
    });
  });
  var be = $("#resp-enviar");
  if (be) be.addEventListener("click", function () {
    be.disabled = true;
    F.api("POST", "/api/comunidad/" + p.id + "/respuestas", { cuerpo: $("#resp-cuerpo").value }).then(function () {
      F.toast("Respuesta publicada"); F.refrescarPerfil(); recargar();
    }).catch(function (e) { var er = $("#resp-error"); er.textContent = e.message; er.hidden = false; be.disabled = false; });
  });
}

})();
