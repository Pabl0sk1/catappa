/* =====================================================================
   CATAPPA — elección de stack
   Docker, Kubernetes o Jenkins se enseñan igual para cualquier lenguaje,
   pero los ejemplos hay que escribirlos en alguno. Aquí eliges el tuyo y
   el curso se adapta: Dockerfiles, comandos de prueba, puertos y rutas
   de salud pasan a ser los de tu stack.

   En el contenido se escriben marcas {{stack:campo}} y se sustituyen al
   pintar. Si no hay stack elegido, se usa el primero de la lista.
   ===================================================================== */
(function () {
"use strict";
var F = window.F, E = F.E, $ = F.$;

F.STACKS = window.STACKS || {};
F.CURSOS_CON_STACK = window.CURSOS_CON_STACK || [];
F.STACK_PREDETERMINADO = "java-spring";

F.cursoUsaStack = function (cursoId) { return F.CURSOS_CON_STACK.indexOf(cursoId) >= 0; };

/* el stack elegido para un curso (perfil si hay sesión, si no este navegador) */
F.stackDe = function (cursoId) {
  var guardados = (E.perfil && E.perfil.stacks) || F.leerLocal("catappa-stacks", {}) || {};
  var id = guardados[cursoId];
  return F.STACKS[id] ? id : F.STACK_PREDETERMINADO;
};
F.stack = function (cursoId) { return F.STACKS[F.stackDe(cursoId)] || {}; };
F.stackElegido = function (cursoId) {
  var guardados = (E.perfil && E.perfil.stacks) || F.leerLocal("catappa-stacks", {}) || {};
  return !!guardados[cursoId];
};

F.elegirStack = function (cursoId, id, alTerminar) {
  if (!F.STACKS[id]) return;
  var local = F.leerLocal("catappa-stacks", {}) || {};
  local[cursoId] = id;
  F.guardarLocal("catappa-stacks", local);
  if (E.perfil) {
    E.perfil.stacks = E.perfil.stacks || {};
    E.perfil.stacks[cursoId] = id;
    F.guardarSesionCache();
    if (E.modo === "servidor") F.api("POST", "/api/perfil", { stacks: E.perfil.stacks }).catch(function () {});
  }
  if (alTerminar) alTerminar(id);
};

/* sustituye {{stack:campo}} por el valor del stack elegido */
F.aplicarStack = function (texto, cursoId) {
  if (!texto || texto.indexOf("{{stack:") < 0) return texto;
  var s = F.stack(cursoId);
  return String(texto).replace(/\{\{stack:([a-zA-Z]+)\}\}/g, function (todo, campo) {
    var v = s[campo];
    if (v == null) return "";
    return campo === "dockerfile" ? F.esc(v) : F.esc(String(v));
  });
};

/* selector para la página del curso */
F.bloqueStack = function (cursoId) {
  if (!F.cursoUsaStack(cursoId)) return "";
  var actual = F.stackDe(cursoId), s = F.STACKS[actual] || {};
  var elegido = F.stackElegido(cursoId);
  return '<section class="stack-caja" id="stack-caja">' +
    '<div class="stack-info"><span class="mono">tu stack en este curso</span>' +
      "<b>" + F.esc(s.nombre || "") + "</b>" +
      "<span>" + (elegido
        ? "Los ejemplos, Dockerfiles y comandos de este curso están en " + F.esc(s.corto || s.nombre) + "."
        : "Todavía no has elegido: por ahora se usan ejemplos de " + F.esc(s.nombre) + ". Cámbialo cuando quieras.") + "</span></div>" +
    '<button class="btn btn-suave" id="stack-cambiar">' + F.icono("engranaje") + (elegido ? "Cambiar" : "Elegir stack") + "</button>" +
    "</section>";
};

F.conectarStack = function (cursoId, alCambiar) {
  var b = $("#stack-cambiar");
  if (!b) return;
  b.addEventListener("click", function () { F.dialogoStack(cursoId, alCambiar); });
};

F.dialogoStack = function (cursoId, alCambiar) {
  var actual = F.stackDe(cursoId);
  var html = '<div class="modal-fondo" id="stack-modal"><div class="modal" role="dialog" aria-label="Elegir stack">' +
    '<div class="modal-cab"><b>¿Con qué trabajas?</b><button class="icono-btn" id="stack-cerrar" aria-label="Cerrar">' + F.icono("x") + "</button></div>" +
    '<p class="subtitulo" style="margin:0 0 14px">Lo que aprendes es lo mismo para todos, pero los ejemplos se escribirán en el que elijas: Dockerfiles, comandos de prueba, puertos y rutas de salud.</p>' +
    '<div class="stack-lista">' + Object.keys(F.STACKS).map(function (id) {
      var s = F.STACKS[id];
      return '<button class="stack-op' + (id === actual ? " sel" : "") + '" data-stack="' + id + '">' +
        '<span class="stack-punto" style="background:' + F.esc(s.color || "#888") + '"></span>' +
        "<span><b>" + F.esc(s.nombre) + "</b><span>" + F.esc(s.lenguaje + " · " + s.gestor) + "</span></span>" +
        (id === actual ? '<span class="mono">actual</span>' : "") + "</button>";
    }).join("") + "</div></div></div>";
  var caja = document.createElement("div");
  caja.innerHTML = html;
  document.body.appendChild(caja.firstChild);
  var cerrar = function () { var m = $("#stack-modal"); if (m) m.remove(); };
  $("#stack-cerrar").addEventListener("click", cerrar);
  $("#stack-modal").addEventListener("click", function (e) { if (e.target.id === "stack-modal") cerrar(); });
  F.$$("#stack-modal [data-stack]").forEach(function (b) {
    b.addEventListener("click", function () {
      F.elegirStack(cursoId, b.dataset.stack, function (id) {
        cerrar();
        F.toast("Ejemplos en " + F.STACKS[id].nombre);
        if (alCambiar) alCambiar(id);
      });
    });
  });
};
})();
