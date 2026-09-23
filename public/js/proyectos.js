/* =====================================================================
   CATAPPA — proyectos
   Cada curso tiene proyectos que se desbloquean según las unidades que
   llevas terminadas, de más fácil a más difícil. Dos formas de entregar:
     · código  → se ejecuta de verdad y se corrige con casos de prueba
     · criterios → lo haces en tu máquina y confirmas cada punto
   ===================================================================== */
(function () {
"use strict";
var F = window.F, E = F.E, $ = F.$;

F.proyectos = function (cursoId) { return (window.PROYECTOS || {})[cursoId] || []; };
F.proyecto = function (cursoId, id) { return F.proyectos(cursoId).filter(function (p) { return p.id === id; })[0] || null; };
F.proyectosHechos = function (cursoId) {
  var todos = E.perfil ? (E.perfil.proyectos || {}) : (F.leerLocal("catappa-progreso-local", {}).proyectos || {});
  return todos[cursoId] || {};
};
F.proyectoHecho = function (cursoId, id) { return !!F.proyectosHechos(cursoId)[id]; };
/* unidades terminadas de un curso (para saber qué proyectos se desbloquean) */
F.unidadesCompletas = function (cursoId) {
  var c = F.curso(cursoId); if (!c) return 0;
  var n = 0;
  for (var i = 0; i < c.unidades.length; i++) if (F.unidadCompleta(cursoId, i)) n++;
  return n;
};
F.proyectoDesbloqueado = function (cursoId, p) { return F.unidadesCompletas(cursoId) >= (p.desdeUnidad || 1); };

/* guarda el proyecto entregado (servidor o, sin cuenta, en este navegador) */
function guardarLocal(cursoId, p) {
  var loc = F.leerLocal("catappa-progreso-local", { progreso: {}, actividad: {} });
  loc.proyectos = loc.proyectos || {}; loc.proyectos[cursoId] = loc.proyectos[cursoId] || {};
  if (!loc.proyectos[cursoId][p.id]) {
    var xp = { Fundamentos: 60, Intermedio: 90, Avanzado: 130, Experto: 180, Maestro: 220 }[p.nivel] || 80;
    loc.proyectos[cursoId][p.id] = { fecha: F.hoy(), xp: xp };
    loc.progreso[cursoId] = loc.progreso[cursoId] || { lecciones: {}, xp: 0 };
    loc.progreso[cursoId].xp += xp;
    loc.actividad[F.hoy()] = (loc.actividad[F.hoy()] || 0) + xp;
    loc.actividadCursos = loc.actividadCursos || {}; loc.actividadCursos[cursoId] = loc.actividadCursos[cursoId] || {};
    loc.actividadCursos[cursoId][F.hoy()] = (loc.actividadCursos[cursoId][F.hoy()] || 0) + xp;
    F.guardarLocal("catappa-progreso-local", loc);
    E.progreso = loc.progreso; F.pintarStats();
    return xp;
  }
  return 0;
}

/* tarjetas de proyectos en la página del curso */
F.bloqueProyectos = function (cursoId) {
  var lista = F.proyectos(cursoId);
  if (!lista.length) return "";
  var hechas = F.unidadesCompletas(cursoId);
  return '<section class="seccion"><div class="seccion-cab"><h2>Proyectos</h2><span class="mono">' +
      Object.keys(F.proyectosHechos(cursoId)).length + "/" + lista.length + " hechos</span></div>" +
    '<p class="subtitulo" style="margin-bottom:12px">Práctica de verdad: cada proyecto se abre cuando ya tienes lo necesario para hacerlo.</p>' +
    '<div class="proyectos">' + lista.map(function (p) {
      var abierto = hechas >= (p.desdeUnidad || 1), hecho = F.proyectoHecho(cursoId, p.id);
      return '<' + (abierto ? 'a class="proy" href="#/proyecto/' + cursoId + "/" + p.id + '"' : 'div class="proy bloqueado"') + '>' +
        '<div class="proy-cab"><span class="badge' + (hecho ? " ok" : "") + '">' + F.esc(p.nivel) + "</span>" +
          (hecho ? '<span class="proy-hecho">' + F.icono("aceptada") + "hecho</span>" : abierto ? '<span class="mono">' + F.esc(p.tiempo || "") + "</span>" : '<span class="mono">' + F.icono("candado").replace("<svg", '<svg style="width:12px;height:12px"') + " unidad " + p.desdeUnidad + "</span>") + "</div>" +
        "<b>" + F.esc(p.titulo) + "</b><span>" + F.esc(p.resumen) + "</span>" +
        (abierto ? "" : '<span class="proy-nota">Termina ' + p.desdeUnidad + " unidad" + (p.desdeUnidad > 1 ? "es" : "") + " para desbloquearlo</span>") +
        "</" + (abierto ? "a" : "div") + ">";
    }).join("") + "</div></section>";
};

/* ---------------- página de un proyecto ---------------- */
F.vistaProyecto = function (prm) {
  var cursoId = prm.curso, p = F.proyecto(cursoId, prm.id), c = F.curso(cursoId);
  if (!p || !c) { F.toast("Ese proyecto no existe"); return F.ir("/cursos"); }
  if (!F.proyectoDesbloqueado(cursoId, p)) {
    F.toast("Termina antes " + p.desdeUnidad + " unidad(es) de " + c.titulo, "!");
    return F.ir("/curso/" + cursoId);
  }
  var hecho = F.proyectoHecho(cursoId, p.id), esCodigo = p.entrega && p.entrega.tipo === "codigo";
  var guardado = F.leerLocal("catappa-proy-" + cursoId + "-" + p.id, null);

  F.pintar(
    '<div class="ancho-texto" style="max-width:900px">' +
      '<div class="eyebrow"><a href="#/curso/' + cursoId + '">~/' + F.esc(cursoId) + "</a><b>proyecto</b><span>" + F.esc(p.nivel) + "</span><span>" + F.esc(p.tiempo || "") + "</span></div>" +
      '<div class="curso-titulo">' + F.cata({ expr: hecho ? "celebra" : "normal", nivel: p.nivel, alto: 74 }) +
        '<h1 class="titulo-pag">' + F.esc(p.titulo) + "</h1></div>" +
      '<p class="subtitulo">' + F.esc(p.resumen) + "</p>" +
      (hecho ? '<div class="aviso-ok">' + F.icono("aceptada") + "Ya entregaste este proyecto. Puedes repetirlo cuando quieras.</div>" : "") +
      '<section class="seccion"><div class="seccion-cab"><h2>Qué vas a practicar</h2></div><ul class="lista-obj">' +
        (p.objetivos || []).map(function (o) { return "<li>" + F.esc(o) + "</li>"; }).join("") + "</ul></section>" +
      '<section class="seccion"><div class="seccion-cab"><h2>Pasos</h2></div><ol class="lista-pasos">' +
        (p.pasos || []).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol></section>" +
      (esCodigo
        ? '<section class="seccion"><div class="seccion-cab"><h2>Tu solución</h2><span class="mono">' + F.esc((F.LENGUAJES[p.entrega.lenguaje] || {}).nombre || "") + '</span></div><div id="proy-editor"></div>' +
          '<div class="cod-acciones"><button class="btn" id="proy-run">' + F.icono("play") + 'Ejecutar</button>' +
          '<button class="btn btn-primario" id="proy-entregar">' + F.icono("check") + "Comprobar y entregar</button></div>" +
          '<div class="play-salida" id="proy-salida"><p class="salida-vacia">Ejecuta tu código o entrégalo para que lo comprobemos con los casos de prueba.</p></div></section>'
        : '<section class="seccion"><div class="seccion-cab"><h2>Criterios</h2><span class="mono">márcalos cuando los cumplas</span></div>' +
          '<div class="criterios">' + (p.criterios || []).map(function (x, i) {
            return '<label class="criterio"><input type="checkbox" data-crit="' + i + '"><span>' + F.esc(x) + "</span></label>";
          }).join("") + "</div>" +
          '<div class="cod-acciones"><button class="btn btn-primario" id="proy-entregar" disabled>' + F.icono("check") + "Marcar como terminado</button></div></section>") +
      (esCodigo && p.criterios ? '<section class="seccion"><div class="seccion-cab"><h2>Se comprueba que</h2></div><ul class="lista-obj">' +
        p.criterios.map(function (x) { return "<li>" + F.esc(x) + "</li>"; }).join("") + "</ul></section>" : "") +
      '<div class="cod-acciones"><a class="btn btn-suave" href="#/curso/' + cursoId + '">Volver al curso</a></div>' +
    "</div>");

  var ed = null;
  if (esCodigo) {
    ed = F.editorCodigo({
      lenguaje: p.entrega.lenguaje, valor: guardado != null ? guardado : (p.entrega.plantilla || ""),
      etiqueta: "Editor del proyecto", alEjecutar: function () { ejecutar(); }
    });
    $("#proy-editor").appendChild(ed.el);
    $("#proy-run").addEventListener("click", ejecutar);
  } else {
    F.$$("[data-crit]").forEach(function (x) {
      x.addEventListener("change", function () {
        var todos = F.$$("[data-crit]").every(function (y) { return y.checked; });
        $("#proy-entregar").disabled = !todos;
      });
    });
  }
  function ejecutar() {
    var sal = $("#proy-salida");
    sal.innerHTML = '<p class="salida-vacia">Ejecutando…</p>';
    F.guardarLocal("catappa-proy-" + cursoId + "-" + p.id, ed.valor());
    F.ejecutarCodigo(p.entrega.lenguaje, ed.valor(), (p.entrega.pruebas[0] || {}).entrada || "")
      .then(function (r) { F.pintarSalida(sal, r); })
      .catch(function (e) { sal.innerHTML = '<pre class="salida-error">' + F.esc(e.message) + "</pre>"; });
  }

  $("#proy-entregar").addEventListener("click", function () {
    var b = this; b.disabled = true; b.textContent = "Comprobando…";
    var cuerpo = { cursoId: cursoId, proyectoId: p.id, criterios: !esCodigo };
    if (esCodigo) { cuerpo.codigo = ed.valor(); F.guardarLocal("catappa-proy-" + cursoId + "-" + p.id, ed.valor()); }
    var fin = function (xp, res) {
      if (res) pintarResultado(res);
      F.sonido.tocar("fin");
      F.toast(xp ? "¡Proyecto terminado! +" + xp + " XP" : "Proyecto entregado de nuevo");
      F.ir("/curso/" + cursoId);
    };
    if (E.perfil && E.modo === "servidor") {
      F.api("POST", "/api/proyecto", cuerpo).then(function (d) {
        if (!d.hecho) {
          pintarResultado(d.resultado);
          b.disabled = false; b.innerHTML = F.icono("check") + "Comprobar y entregar";
          F.sonido.tocar("error");
          F.toast("Todavía no pasa todos los casos de prueba", "!");
          return;
        }
        E.perfil = d.perfil; E.progreso = d.progreso; F.guardarSesionCache(); F.pintarStats();
        fin(d.xp, d.resultado);
      }).catch(function (e) {
        b.disabled = false; b.innerHTML = F.icono("check") + "Comprobar y entregar";
        F.toast(e.message, "!");
      });
      return;
    }
    // sin cuenta: los proyectos de código necesitan servidor; los de criterios se guardan aquí
    if (esCodigo && E.modo !== "servidor") { b.disabled = false; F.toast("Para comprobar código hace falta el servidor de Catappa", "!"); return; }
    if (esCodigo) {
      F.api("POST", "/api/ejecutar", { lenguaje: p.entrega.lenguaje, codigo: ed.valor() }).then(function () { fin(guardarLocal(cursoId, p)); });
      return;
    }
    fin(guardarLocal(cursoId, p));
  });

  function pintarResultado(res) {
    if (!res || !res.resultados) return;
    var sal = $("#proy-salida"); if (!sal) return;
    sal.innerHTML = '<div class="cod-resultados">' + res.resultados.map(function (x) {
      if (x.oculta) return '<div class="cod-res ' + (x.bien ? "bien" : "mal") + '">' + F.icono(x.bien ? "check" : "x") + "<span>Caso oculto</span></div>";
      return '<div class="cod-res ' + (x.bien ? "bien" : "mal") + '">' + F.icono(x.bien ? "check" : "x") +
        "<span>" + (x.entrada ? "entrada " + F.esc(x.entrada.replace(/\n/g, " ⏎ ")) + " · " : "") + "esperado <b>" + F.esc(x.esperado) + "</b>" +
        (x.bien ? "" : " · obtenido <b>" + F.esc(x.obtenido || "(nada)") + "</b>") + "</span></div>" +
        (x.error && !x.bien ? '<pre class="salida-error">' + F.esc(x.error) + "</pre>" : "");
    }).join("") + "</div>";
  }
};
})();
