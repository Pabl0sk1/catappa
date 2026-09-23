/* =====================================================================
   CATAPPA — proyectos
   Los proyectos viven dentro del camino del curso: aparecen como una
   parada más al terminar la unidad que los desbloquea.

   Un proyecto se hace aquí dentro, misión a misión, y cada misión se
   comprueba de verdad:
     · term    → escribes el comando en la terminal y se valida
     · codigo  → se ejecuta con casos de prueba (algunos ocultos)
     · salida  → lo haces en tu máquina y pegas la salida real; se valida
                 contra patrones (así hay prueba, no palabra de honor)
     · check   → lo único que no se puede comprobar: lo confirmas tú
   Los proyectos antiguos, sin misiones, siguen funcionando con su
   entrega de código o su lista de criterios.
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
/* proyectos que cuelgan de una unidad concreta (la unidad ui es la número ui+1) */
F.proyectosDeUnidad = function (cursoId, ui) {
  return F.proyectos(cursoId).filter(function (p) { return (p.desdeUnidad || 1) === ui + 1; });
};
F.misiones = function (p) { return (p && p.misiones) || []; };

/* ---------------- estado local del proyecto en curso ---------------- */
function clave(cursoId, id) { return "catappa-proy-" + cursoId + "-" + id; }
function estado(cursoId, id) {
  var e = F.leerLocal(clave(cursoId, id), null);
  if (!e || typeof e !== "object" || Array.isArray(e)) e = { hechas: {}, resp: {} };
  e.hechas = e.hechas || {}; e.resp = e.resp || {};
  return e;
}
function guardarEstado(cursoId, id, e) { F.guardarLocal(clave(cursoId, id), e); }

/* guarda el proyecto entregado (sin cuenta, en este navegador) */
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

/* ---------------- fila del proyecto dentro del camino ---------------- */
F.filaProyectos = function (cursoId, ui) {
  var lista = F.proyectosDeUnidad(cursoId, ui);
  if (!lista.length) return "";
  var abierto = F.unidadCompleta(cursoId, ui);
  return lista.map(function (p) {
    var hecho = F.proyectoHecho(cursoId, p.id);
    var e = estado(cursoId, p.id), ms = F.misiones(p);
    var hechas = ms.filter(function (m) { return e.hechas[m.id]; }).length;
    var empezado = hechas > 0 && !hecho;
    var estadoTxt = !abierto ? "Termina la unidad para desbloquearlo"
      : hecho ? "Entregado y comprobado"
      : empezado ? "En marcha: " + hechas + " de " + ms.length + " misiones"
      : (ms.length ? ms.length + " misiones · " : "") + (p.tiempo || "") + " · " + p.resumen;
    var tag = abierto ? "a" : "div";
    return "<" + tag + ' class="job proyecto' + (abierto ? "" : " bloqueada") + (hecho ? " hecha" : "") + '"' +
      (abierto ? ' href="#/proyecto/' + cursoId + "/" + p.id + '"' : ' aria-disabled="true" title="Se abre al terminar esta unidad"') + ">" +
      '<span class="marca">' + F.icono(hecho ? "aceptada" : abierto ? "carpeta" : "candado") + "</span>" +
      '<div class="txt"><b>Proyecto · ' + F.esc(p.titulo) + ' <span class="badge">' + F.esc(p.nivel) + "</span></b><span>" + F.esc(estadoTxt) + "</span></div>" +
      (abierto ? '<span class="derecha">' + (hecho ? "repetir" : empezado ? "seguir" : "abrir") + "</span>" : "") +
      "</" + tag + ">";
  }).join("");
};

/* se mantiene por compatibilidad: ya no se pinta el bloque del final */
F.bloqueProyectos = function () { return ""; };

/* ---------------- página de un proyecto ---------------- */
F.vistaProyecto = function (prm) {
  var cursoId = prm.curso, p = F.proyecto(cursoId, prm.id), c = F.curso(cursoId);
  if (!p || !c) { F.toast("Ese proyecto no existe"); return F.ir("/cursos"); }
  if (!F.proyectoDesbloqueado(cursoId, p)) {
    F.toast("Termina antes la unidad " + p.desdeUnidad + " de " + c.titulo, "!");
    return F.ir("/curso/" + cursoId);
  }
  if (!F.misiones(p).length) return vistaAntigua(prm, p, c);

  var ms = F.misiones(p), est = estado(cursoId, p.id), hecho = F.proyectoHecho(cursoId, p.id);
  var editores = {};

  function hechasN() { return ms.filter(function (m) { return est.hechas[m.id]; }).length; }
  function actual() {
    for (var i = 0; i < ms.length; i++) if (!est.hechas[ms[i].id]) return i;
    return ms.length;
  }

  function pintar() {
    var act = actual(), n = hechasN(), pct = Math.round((n / ms.length) * 100);
    F.pintar(
      '<div class="ancho-texto proy-pag" style="max-width:900px">' +
        '<div class="eyebrow"><a href="#/curso/' + cursoId + '">~/' + F.esc(cursoId) + "</a><b>proyecto</b><span>" + F.esc(p.nivel) + "</span><span>" + F.esc(p.tiempo || "") + "</span></div>" +
        '<div class="curso-titulo">' + F.cata({ expr: n === ms.length ? "celebra" : "normal", nivel: p.nivel, brillo: n > 0, alto: 74 }) +
          '<h1 class="titulo-pag">' + F.esc(p.titulo) + "</h1></div>" +
        '<p class="subtitulo">' + F.esc(p.resumen) + "</p>" +
        (hecho ? '<div class="aviso-ok">' + F.icono("aceptada") + "Ya entregaste este proyecto. Puedes repetirlo o mejorarlo cuando quieras.</div>" : "") +
        '<div class="proy-barra"><div class="barra-prog" style="--c:' + c.color + '"><i style="width:' + pct + '%"></i></div>' +
          '<span class="mono">' + n + "/" + ms.length + " misiones</span></div>" +
        ((p.objetivos || []).length
          ? '<section class="panel proy-obj"><b>Qué vas a practicar</b><ul class="lista-obj">' +
            p.objetivos.map(function (o) { return "<li>" + F.esc(o) + "</li>"; }).join("") + "</ul></section>" : "") +
        '<div class="misiones">' + ms.map(function (m, i) { return tarjeta(m, i, act); }).join("") + "</div>" +
        '<section class="proy-fin' + (n === ms.length ? " lista" : "") + '">' +
          (n === ms.length
            ? "<div><b>Proyecto terminado</b><span>Todas las misiones comprobadas. Entrégalo para sumar la experiencia.</span></div>" +
              '<button class="btn btn-primario btn-grande" id="proy-entregar">' + F.icono("check") + (hecho ? "Volver a entregar" : "Entregar proyecto") + "</button>"
            : "<div><b>Te falta" + (ms.length - n > 1 ? "n " + (ms.length - n) + " misiones" : " 1 misión") + "</b><span>Cada misión se comprueba sola: no puedes entregar algo que no funcione.</span></div>") +
        "</section>" +
        '<div class="cod-acciones"><a class="btn btn-suave" href="#/curso/' + cursoId + '">Volver al curso</a>' +
          (n ? '<button class="btn btn-suave btn-peligro" id="proy-limpiar">' + F.icono("papelera") + "Empezar el proyecto de cero</button>" : "") + "</div>" +
      "</div>");
    conectar(act);
  }

  /* una misión: cabecera plegable + guía + herramienta de comprobación */
  function tarjeta(m, i, act) {
    var ok = !!est.hechas[m.id], abierta = i === act;
    var num = ok ? F.icono("check") : String(i + 1);
    var etiqueta = { term: "terminal", codigo: "código", salida: "en tu máquina", check: "confirmación", info: "lectura" }[m.tipo] || m.tipo;
    return '<section class="mis' + (ok ? " hecha" : "") + (abierta ? " abierta" : "") + '" data-mis="' + F.esc(m.id) + '" data-i="' + i + '">' +
      '<div class="mis-cab" role="button" tabindex="0" aria-expanded="' + abierta + '">' +
        '<span class="mis-num">' + num + "</span>" +
        '<div class="mis-tit"><b>' + F.esc(m.titulo) + '</b><span class="mono">misión ' + (i + 1) + " · " + F.esc(etiqueta) + "</span></div>" +
        '<span class="mis-estado">' + (ok ? "hecha" : abierta ? "en curso" : "") + "</span>" +
      "</div>" +
      '<div class="mis-cuerpo">' +
        '<div class="mis-guia">' + F.aplicarStack(m.guia || "", cursoId) + "</div>" +
        (m.pista ? '<details class="mis-pista"><summary>Ver pista</summary>' + pista(m) + "</details>" : "") +
        herramienta(m) +
        '<div class="mis-acciones">' + boton(m) + "</div>" +
        '<div class="mis-fb" id="fb-' + F.esc(m.id) + '"></div>' +
      "</div></section>";
  }

  /* la pista puede traer un fichero entero (por ejemplo el Dockerfile del stack):
     si tiene saltos de línea se enseña como bloque de código, no como párrafo */
  function pista(m) {
    var t = F.aplicarStack(m.pista, cursoId);
    return t.indexOf("\n") >= 0 ? '<pre class="dg-pre">' + t + "</pre>" : "<p>" + t + "</p>";
  }

  function boton(m) {
    var t = { info: "Entendido", term: "Comprobar comando", codigo: "Comprobar código", salida: "Verificar mi salida", check: "Confirmar" }[m.tipo] || "Comprobar";
    return (m.tipo === "codigo" ? '<button class="btn" data-run="' + F.esc(m.id) + '">' + F.icono("play") + "Ejecutar</button>" : "") +
      '<button class="btn btn-primario" data-ok="' + F.esc(m.id) + '">' + F.icono("check") + t + "</button>";
  }

  function herramienta(m) {
    if (m.tipo === "term") {
      return '<div class="mini-term mis-term"><div class="cab-t"><i></i><i></i><i></i><span>' + F.esc(m.host || "terminal") + "</span></div>" +
        '<div class="cuerpo-t"><div class="salida" id="ts-' + F.esc(m.id) + '"></div>' +
        '<div class="mini-linea"><span>' + F.esc(m.prompt || "PS C:\\practicar-docker>") + '</span><input data-term="' + F.esc(m.id) + '" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="escribe el comando y pulsa Enter"></div></div></div>';
    }
    if (m.tipo === "codigo") {
      return '<div class="mis-editor" id="ed-' + F.esc(m.id) + '"></div><div class="play-salida" id="sal-' + F.esc(m.id) + '"><p class="salida-vacia">Ejecuta para ver la salida, o comprueba directamente con los casos de prueba.</p></div>';
    }
    if (m.tipo === "salida") {
      return (m.comando ? '<div class="mis-cmd"><span class="mono">ejecútalo en tu máquina</span><pre>' + F.aplicarStack(F.esc(m.comando), cursoId) + '</pre><button class="btn btn-suave" data-copiar="' + F.esc(m.id) + '">' + F.icono("copiar") + "Copiar</button></div>" : "") +
        '<textarea class="mis-pega" data-pega="' + F.esc(m.id) + '" rows="7" spellcheck="false" placeholder="Pega aquí la salida tal cual te la dio tu terminal"></textarea>';
    }
    if (m.tipo === "check") {
      return '<div class="criterios">' + (m.criterios || []).map(function (x, i) {
        return '<label class="criterio"><input type="checkbox" data-crit="' + F.esc(m.id) + "-" + i + '"><span>' + F.esc(x) + "</span></label>";
      }).join("") + "</div>";
    }
    return "";
  }

  /* ---- eventos ---- */
  function conectar(act) {
    F.$$(".mis-cab").forEach(function (cab) {
      var alternar = function () {
        var s = cab.parentNode, abrir = !s.classList.contains("abierta");
        F.$$(".mis").forEach(function (x) { x.classList.remove("abierta"); x.querySelector(".mis-cab").setAttribute("aria-expanded", "false"); });
        if (abrir) { s.classList.add("abierta"); cab.setAttribute("aria-expanded", "true"); }
      };
      cab.addEventListener("click", alternar);
      cab.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alternar(); } });
    });

    ms.forEach(function (m, i) {
      if (m.tipo === "codigo") {
        var caja = $("#ed-" + m.id); if (!caja) return;
        var ed = F.editorCodigo({
          lenguaje: m.lenguaje, valor: est.resp[m.id] != null ? est.resp[m.id] : (m.plantilla || ""),
          etiqueta: "Editor de la misión", alEjecutar: function () { ejecutar(m); }
        });
        caja.appendChild(ed.el); editores[m.id] = ed;
      }
      if (m.tipo === "term") {
        var campo = F.$$('[data-term="' + m.id + '"]')[0];
        if (campo) {
          if (est.hechas[m.id] && est.resp[m.id]) { campo.value = est.resp[m.id]; verTerminal(m, est.resp[m.id], m.salida || ""); }
          campo.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); comprobar(m); } });
        }
      }
      if (m.tipo === "salida") {
        var ta = F.$$('[data-pega="' + m.id + '"]')[0];
        if (ta && est.resp[m.id]) ta.value = est.resp[m.id];
      }
      if (m.tipo === "check" && est.hechas[m.id]) {
        F.$$('[data-crit^="' + m.id + '-"]').forEach(function (x) { x.checked = true; });
      }
      if (est.hechas[m.id]) {
        var fb = $("#fb-" + m.id);
        if (fb) fb.innerHTML = '<div class="mis-res bien">' + F.icono("aceptada") + "<span>Misión comprobada.</span></div>";
      }
    });

    F.$$("[data-ok]").forEach(function (b) {
      b.addEventListener("click", function () { comprobar(porId(b.dataset.ok)); });
    });
    F.$$("[data-run]").forEach(function (b) {
      b.addEventListener("click", function () { ejecutar(porId(b.dataset.run)); });
    });
    F.$$("[data-copiar]").forEach(function (b) {
      b.addEventListener("click", function () {
        var m = porId(b.dataset.copiar);
        if (navigator.clipboard) navigator.clipboard.writeText(m.comando).then(function () { F.toast("Comando copiado"); });
      });
    });

    var lim = $("#proy-limpiar");
    if (lim) lim.addEventListener("click", function () {
      F.confirmar({
        titulo: "Empezar de cero",
        texto: "Se borran las misiones que ya has comprobado de este proyecto. Tu progreso del curso no se toca.",
        aceptar: "Empezar de cero", peligro: true
      }).then(function (si) {
        if (!si) return;
        est = { hechas: {}, resp: {} }; guardarEstado(cursoId, p.id, est); pintar(); F.arriba();
      });
    });
    var ent = $("#proy-entregar");
    if (ent) ent.addEventListener("click", entregar);

    var abierta = F.$$(".mis.abierta")[0];
    if (abierta && act > 0) setTimeout(function () { abierta.scrollIntoView({ block: "center", behavior: "smooth" }); }, 80);
  }

  function porId(id) { return ms.filter(function (m) { return m.id === id; })[0]; }

  function verTerminal(m, cmd, salida) {
    var z = $("#ts-" + m.id); if (!z) return;
    z.innerHTML = '<span class="pr">' + F.esc(m.prompt || "PS C:\\practicar-docker>") + "</span> " + F.esc(cmd) + "\n" +
      (salida ? F.esc(salida) + "\n" : "");
  }

  function ejecutar(m) {
    var sal = $("#sal-" + m.id), ed = editores[m.id];
    if (!sal || !ed) return;
    sal.innerHTML = '<p class="salida-vacia">Ejecutando…</p>';
    est.resp[m.id] = ed.valor(); guardarEstado(cursoId, p.id, est);
    F.ejecutarCodigo(m.lenguaje, ed.valor(), ((m.pruebas || [])[0] || {}).entrada || "")
      .then(function (r) { F.pintarSalida(sal, r); })
      .catch(function (e) { sal.innerHTML = '<pre class="salida-error">' + F.esc(e.message) + "</pre>"; });
  }

  /* respuesta que se envía a comprobar según el tipo de misión */
  function respuestaDe(m) {
    if (m.tipo === "info") return true;
    if (m.tipo === "term") { var c1 = F.$$('[data-term="' + m.id + '"]')[0]; return c1 ? c1.value : ""; }
    if (m.tipo === "codigo") return editores[m.id] ? editores[m.id].valor() : "";
    if (m.tipo === "salida") { var t = F.$$('[data-pega="' + m.id + '"]')[0]; return t ? t.value : ""; }
    if (m.tipo === "check") {
      var todos = F.$$('[data-crit^="' + m.id + '-"]');
      return todos.length > 0 && todos.every(function (x) { return x.checked; });
    }
    return null;
  }

  /* comprobación local, para cuando no hay servidor (misma lógica que el servidor) */
  function verificarAqui(m, r) {
    var norm = function (x) { return String(x || "").trim().replace(/\s+/g, " ").replace(/^\$\s*/, "").replace(/["']/g, "'").toLowerCase(); };
    if (m.tipo === "info") return { bien: true };
    if (m.tipo === "check") return r === true ? { bien: true, detalle: "Confirmado. Esta parte la verificas tú." } : { bien: false, detalle: "Marca todas las confirmaciones." };
    if (m.tipo === "term") {
      if (!norm(r)) return { bien: false, detalle: "Escribe el comando." };
      if (m.re && new RegExp(m.re, "i").test(String(r).trim())) return { bien: true, detalle: m.salida || "" };
      return (m.sol || []).some(function (x) { return norm(x) === norm(r); })
        ? { bien: true, detalle: m.salida || "" }
        : { bien: false, detalle: "Ese comando todavía no es el que buscamos." };
    }
    if (m.tipo === "salida") {
      var texto = String(r || "");
      if (!texto.trim()) return { bien: false, detalle: "Pega aquí la salida que te dio tu máquina." };
      var faltan = (m.patrones || []).filter(function (x) { return !new RegExp(x, "i").test(texto); });
      var sobran = (m.prohibidos || []).filter(function (x) { return new RegExp(x, "i").test(texto); });
      if (faltan.length) return { bien: false, detalle: "En esa salida no aparece: " + faltan.map(function (x) { return "«" + x + "»"; }).join(", ") };
      if (sobran.length) return { bien: false, detalle: "Esa salida delata un problema: " + sobran.map(function (x) { return "«" + x + "»"; }).join(", ") };
      return { bien: true, detalle: "Salida verificada." };
    }
    return { bien: false, detalle: "Para comprobar código hace falta el servidor de Catappa." };
  }

  function comprobar(m) {
    if (!m) return;
    var r = respuestaDe(m), fb = $("#fb-" + m.id);
    if (fb) fb.innerHTML = '<div class="mis-res espera">Comprobando…</div>';
    est.resp[m.id] = r === true ? true : r; guardarEstado(cursoId, p.id, est);

    var promesa;
    if (E.modo === "servidor") {
      promesa = F.api("POST", "/api/proyecto/paso", { cursoId: cursoId, proyectoId: p.id, misionId: m.id, respuesta: r });
    } else {
      promesa = Promise.resolve(verificarAqui(m, r));
    }
    promesa.then(function (d) { resultado(m, d); })
      .catch(function (e) { if (fb) fb.innerHTML = '<div class="mis-res mal">' + F.icono("x") + "<span>" + F.esc(e.message) + "</span></div>"; });
  }

  function resultado(m, d) {
    var fb = $("#fb-" + m.id);
    if (d.bien) {
      est.hechas[m.id] = true; guardarEstado(cursoId, p.id, est);
      F.sonido.tocar("acierto");
      if (m.tipo === "term") verTerminal(m, est.resp[m.id], m.salida || "");
      if (fb) fb.innerHTML = '<div class="mis-res bien">' + F.icono("aceptada") + "<span>" + F.esc(m.exito || "Misión comprobada. " + (d.detalle && m.tipo !== "term" ? d.detalle : "")) + "</span></div>" +
        (d.resultado ? casos(d.resultado) : "");
      var n = hechasN();
      setTimeout(function () { pintar(); if (n === ms.length) { F.sonido.tocar("fin"); F.toast("¡Todas las misiones comprobadas!"); } }, 650);
      return;
    }
    F.sonido.tocar("error");
    if (fb) fb.innerHTML = '<div class="mis-res mal">' + F.icono("x") + "<span>" + F.esc(d.detalle || "Todavía no.") + "</span></div>" +
      (d.resultado ? casos(d.resultado) : "");
  }

  function casos(res) {
    if (!res || !res.resultados) return "";
    return '<div class="cod-resultados">' + res.resultados.map(function (x) {
      if (x.oculta) return '<div class="cod-res ' + (x.bien ? "bien" : "mal") + '">' + F.icono(x.bien ? "check" : "x") + "<span>Caso oculto</span></div>";
      return '<div class="cod-res ' + (x.bien ? "bien" : "mal") + '">' + F.icono(x.bien ? "check" : "x") +
        "<span>" + (x.entrada ? "entrada " + F.esc(x.entrada.replace(/\n/g, " ⏎ ")) + " · " : "") + "esperado <b>" + F.esc(x.esperado) + "</b>" +
        (x.bien ? "" : " · obtenido <b>" + F.esc(x.obtenido || "(nada)") + "</b>") + "</span></div>" +
        (x.error && !x.bien ? '<pre class="salida-error">' + F.esc(x.error) + "</pre>" : "");
    }).join("") + "</div>";
  }

  function entregar() {
    var b = $("#proy-entregar");
    b.disabled = true; b.textContent = "Comprobando el proyecto entero…";
    if (E.perfil && E.modo === "servidor") {
      F.api("POST", "/api/proyecto", { cursoId: cursoId, proyectoId: p.id, respuestas: est.resp }).then(function (d) {
        if (!d.hecho) {
          b.disabled = false; b.innerHTML = F.icono("check") + "Entregar proyecto";
          var falla = Object.keys(d.misiones || {}).filter(function (k) { return !d.misiones[k].bien; });
          falla.forEach(function (k) { delete est.hechas[k]; });
          guardarEstado(cursoId, p.id, est);
          F.sonido.tocar("error");
          F.toast("Al revisarlo entero hay misiones que ya no pasan", "!");
          pintar();
          return;
        }
        E.perfil = d.perfil; E.progreso = d.progreso; F.guardarSesionCache(); F.pintarStats();
        F.sonido.tocar("fin");
        F.toast(d.xp ? "¡Proyecto entregado! +" + d.xp + " XP" : "Proyecto entregado de nuevo");
        F.ir("/curso/" + cursoId);
      }).catch(function (e) {
        b.disabled = false; b.innerHTML = F.icono("check") + "Entregar proyecto";
        F.toast(e.message, "!");
      });
      return;
    }
    var xp = guardarLocal(cursoId, p);
    F.sonido.tocar("fin");
    F.toast(xp ? "¡Proyecto entregado! +" + xp + " XP" : "Proyecto entregado de nuevo");
    F.ir("/curso/" + cursoId);
  }

  pintar();
  F.arriba();
};

/* ---------------- proyectos antiguos (sin misiones) ---------------- */
function vistaAntigua(prm, p, c) {
  var cursoId = prm.curso;
  var hecho = F.proyectoHecho(cursoId, p.id), esCodigo = p.entrega && p.entrega.tipo === "codigo";
  var guardado = F.leerLocal("catappa-proy-viejo-" + cursoId + "-" + p.id, null);

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
        $("#proy-entregar").disabled = !F.$$("[data-crit]").every(function (y) { return y.checked; });
      });
    });
  }
  function ejecutar() {
    var sal = $("#proy-salida");
    sal.innerHTML = '<p class="salida-vacia">Ejecutando…</p>';
    F.guardarLocal("catappa-proy-viejo-" + cursoId + "-" + p.id, ed.valor());
    F.ejecutarCodigo(p.entrega.lenguaje, ed.valor(), (p.entrega.pruebas[0] || {}).entrada || "")
      .then(function (r) { F.pintarSalida(sal, r); })
      .catch(function (e) { sal.innerHTML = '<pre class="salida-error">' + F.esc(e.message) + "</pre>"; });
  }

  $("#proy-entregar").addEventListener("click", function () {
    var b = this; b.disabled = true; b.textContent = "Comprobando…";
    var cuerpo = { cursoId: cursoId, proyectoId: p.id, criterios: !esCodigo };
    if (esCodigo) { cuerpo.codigo = ed.valor(); F.guardarLocal("catappa-proy-viejo-" + cursoId + "-" + p.id, ed.valor()); }
    var fin = function (xp) {
      F.sonido.tocar("fin");
      F.toast(xp ? "¡Proyecto terminado! +" + xp + " XP" : "Proyecto entregado de nuevo");
      F.ir("/curso/" + cursoId);
    };
    if (E.perfil && E.modo === "servidor") {
      F.api("POST", "/api/proyecto", cuerpo).then(function (d) {
        if (!d.hecho) {
          b.disabled = false; b.innerHTML = F.icono("check") + "Comprobar y entregar";
          F.sonido.tocar("error"); F.toast("Todavía no pasa todos los casos de prueba", "!");
          return;
        }
        E.perfil = d.perfil; E.progreso = d.progreso; F.guardarSesionCache(); F.pintarStats();
        fin(d.xp);
      }).catch(function (e) {
        b.disabled = false; b.innerHTML = F.icono("check") + "Comprobar y entregar";
        F.toast(e.message, "!");
      });
      return;
    }
    if (esCodigo && E.modo !== "servidor") { b.disabled = false; F.toast("Para comprobar código hace falta el servidor de Catappa", "!"); return; }
    fin(guardarLocal(cursoId, p));
  });
}
})();
