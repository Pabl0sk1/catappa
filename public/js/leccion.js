/* =====================================================================
   CATAPPA — motor de lecciones
   Tipos de paso: info, opcion, vf, hueco, escribe, orden, par, term
   Sin vidas: fallar solo hace que la pregunta vuelva al final.
   ===================================================================== */
(function () {
"use strict";
var F = window.F, $ = F.$, $$ = F.$$;

function norm(s) {
  return String(s == null ? "" : s).toLowerCase().replace(/[“”"']/g, "").replace(/\s+/g, " ").replace(/\s*=\s*/g, "=")
    .replace(/\s*,\s*/g, ",").replace(/\s*\(\s*/g, "(").replace(/\s*\)\s*/g, ")").trim().replace(/\s*;+$/, "");
}
function baraja(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

var S = null;       // sesión de la lección en curso
var PANT = null;    // contenedor a pantalla completa

F.abrirLeccion = function (cursoId, leccionId) {
  var info = F.buscarLeccion(cursoId, leccionId);
  if (!info) { F.toast("Esa lección no existe"); return F.ir("/curso/" + cursoId); }
  if (!F.desbloqueada(cursoId, leccionId)) { F.toast("Termina antes la lección anterior", "!"); return F.ir("/curso/" + cursoId); }
  var completa = F.leccionCompleta(cursoId, leccionId);
  if (completa) return montar(cursoId, info, completa);
  // el contenido del curso aún no está descargado: pantalla de carga mientras llega
  cerrarPantalla();
  PANT = el("div", "leccion-pant", '<div class="vacio" style="margin:auto">Cargando lección…</div>');
  document.body.appendChild(PANT);
  document.body.style.overflow = "hidden";
  F.cargarCurso(cursoId).then(function () {
    var l = F.leccionCompleta(cursoId, leccionId);
    if (!l) throw new Error("La lección no está en el contenido descargado");
    montar(cursoId, info, l);
  }).catch(function (e) {
    cerrarPantalla(); F.toast("No se pudo cargar la lección: " + e.message, "!"); F.ir("/curso/" + cursoId);
  });
};

function montar(cursoId, info, l) {
  S = {
    cursoId: cursoId, info: info, l: l,
    cola: l.pasos.map(function (p, i) { return { p: p, i: i, reintento: false }; }),
    hechos: 0, preguntas: 0, aciertosPrimera: 0, falladas: [], inicio: Date.now(), estado: "responder", resp: null
  };
  cerrarPantalla();
  PANT = el("div", "leccion-pant");
  PANT.setAttribute("role", "dialog");
  PANT.setAttribute("aria-label", "Lección: " + l.titulo);
  PANT.innerHTML =
    '<div class="lec-top">' +
      '<button class="lec-cerrar" id="lec-salir" aria-label="Salir de la lección">' + F.icono("x") + "</button>" +
      '<div class="lec-barra" role="progressbar" aria-label="Progreso de la lección"><i id="lec-prog"></i></div>' +
      '<span class="lec-cuenta" id="lec-cuenta"></span>' +
      '<button class="lec-cerrar lec-sonido" id="lec-sonido"></button>' +
    "</div>" +
    '<div class="lec-cuerpo" id="lec-scroll"><div class="lec-in" id="lec-in"></div></div>' +
    '<div class="lec-pie" id="lec-pie">' +
      '<div class="fb" id="fb" role="status" aria-live="assertive" hidden><div class="fb-cab"><span class="fb-cata" id="fb-cata" aria-hidden="true"></span><span class="fb-ico" id="fb-ico"></span><span id="fb-tit"></span></div><p class="fb-txt" id="fb-txt"></p><p class="fb-tuya" id="fb-tuya" hidden></p><p class="fb-sol" id="fb-sol" hidden></p></div>' +
      '<div class="lec-acciones"><button class="tactil secundario" id="lec-saltar" hidden>Saltar</button><button class="tactil principal-l" id="lec-ppal">Comprobar</button></div>' +
    "</div>";
  document.body.appendChild(PANT);
  document.body.style.overflow = "hidden";
  $("#lec-ppal").addEventListener("click", accion);
  pintarBotonSonido();
  $("#lec-sonido").addEventListener("click", function () {
    F.sonido.activar(!F.sonido.activo()); pintarBotonSonido(); F.sonido.tocar("toque");
  });
  $("#lec-saltar").addEventListener("click", function () {
    var it = S.cola.shift(); S.cola.push({ p: it.p, i: it.i, reintento: true }); siguiente();
  });
  $("#lec-salir").addEventListener("click", function () {
    if (S && S.hechos > 2 && !confirm("¿Salir de la lección? Se perderá lo que llevas de esta lección.")) return;
    cerrarPantalla(); F.ir("/curso/" + cursoId);
  });
  siguiente();
};

function pintarBotonSonido() {
  var b = $("#lec-sonido"); if (!b) return;
  var on = F.sonido.activo();
  b.innerHTML = F.icono(on ? "sonido" : "silencio");
  b.setAttribute("aria-label", on ? "Silenciar sonidos" : "Activar sonidos");
  b.title = on ? "Sonido activado" : "Sonido desactivado";
  b.setAttribute("aria-pressed", String(on));
}

function cerrarPantalla() {
  if (PANT) { PANT.remove(); PANT = null; }
  document.body.style.overflow = "";
}
F.cerrarLeccion = cerrarPantalla;

document.addEventListener("keydown", function (e) {
  if (!PANT || !S) return;
  if (e.repeat) return;   // mantener Enter pulsado no debe saltarse la corrección
  var enInput = document.activeElement && document.activeElement.tagName === "INPUT";
  if (e.key === "Enter" && !enInput) {
    var b = $("#lec-ppal"); if (b && !b.disabled) { e.preventDefault(); accion(); }
  }
  if (/^[1-5]$/.test(e.key) && !enInput) {
    var ops = $$(".op", PANT), n = +e.key - 1;
    if (ops[n] && !ops[n].disabled) ops[n].click();
  }
  if (e.key === "Escape") $("#lec-salir").click();
});

/* ---------------- flujo ---------------- */
function siguiente() {
  var pie = $("#lec-pie");
  pie.classList.remove("bien", "mal");
  $("#fb").hidden = true; $("#fb-sol").hidden = true; $("#fb-tuya").hidden = true; $("#lec-saltar").hidden = true;
  $("#lec-in").classList.remove("sacude");
  S.estado = "responder"; S.resp = null;
  if (!S.cola.length) return fin();
  var paso = S.cola[0].p;
  var pendientes = S.cola.length;
  $("#lec-prog").style.width = Math.min(100, Math.round(S.hechos / (S.hechos + pendientes) * 100)) + "%";
  $("#lec-cuenta").textContent = "quedan " + pendientes;
  var c = $("#lec-in"); c.innerHTML = ""; $("#lec-scroll").scrollTop = 0;
  (PINTA[paso.t] || PINTA.info)(c, paso);
  var b = $("#lec-ppal");
  if (paso.t === "info") { b.textContent = "Continuar"; b.disabled = false; }
  else { b.textContent = "Comprobar"; b.disabled = true; }
  b.focus({ preventScroll: true });
}

function cabecera(c, paso, eti) {
  c.appendChild(el("div", "lec-eti", F.esc(paso.eti || eti)));
  if (paso.h) c.appendChild(el("h2", "lec-enun", paso.h));
  if (paso.p) c.appendChild(el("div", "lec-enun", paso.p));
}

var PINTA = {
  info: function (c, paso) {
    cabecera(c, paso, "Concepto");
    c.appendChild(el("div", "lec-texto", paso.c || ""));
  },

  opcion: function (c, paso) {
    cabecera(c, paso, "Elige la respuesta correcta");
    if (paso.c) c.appendChild(el("div", "lec-texto", paso.c));
    var caja = el("div", "ops");
    var orden = paso._orden || (paso._orden = baraja(paso.ops.map(function (_, i) { return i; })));
    orden.forEach(function (idx, n) {
      var b = el("button", "op", '<span class="letra">' + "ABCDE"[n] + "</span><span>" + paso.ops[idx] + "</span>");
      b.dataset.idx = String(idx);
      b.addEventListener("click", function () {
        if (S.estado !== "responder") return;
        $$(".op", caja).forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel"); S.resp = idx; $("#lec-ppal").disabled = false; F.sonido.tocar("toque");
      });
      caja.appendChild(b);
    });
    c.appendChild(caja);
  },

  vf: function (c, paso) {
    cabecera(c, paso, "¿Verdadero o falso?");
    var caja = el("div", "ops");
    [["Verdadero", true], ["Falso", false]].forEach(function (par, n) {
      var b = el("button", "op", '<span class="letra">' + "VF"[n] + "</span><span>" + par[0] + "</span>");
      b.dataset.val = par[1] ? "1" : "0";
      b.addEventListener("click", function () {
        if (S.estado !== "responder") return;
        $$(".op", caja).forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel"); S.resp = par[1]; $("#lec-ppal").disabled = false; F.sonido.tocar("toque");
      });
      caja.appendChild(b);
    });
    c.appendChild(caja);
  },

  hueco: function (c, paso) {
    cabecera(c, paso, "Completa el hueco");
    if (paso.c) c.appendChild(el("div", "lec-texto", paso.c));
    var partes = paso.tpl.split("___");
    var tpl = el("div", "plantilla");
    S.huecos = []; S.huecosFicha = [];
    var spans = [];
    partes.forEach(function (t, i) {
      tpl.appendChild(document.createTextNode(t));
      if (i < partes.length - 1) {
        var h = el("span", "hueco", "&nbsp;&nbsp;&nbsp;&nbsp;");
        h.addEventListener("click", function () {
          if (S.estado !== "responder" || S.huecos[i] == null) return;
          if (S.huecosFicha[i]) S.huecosFicha[i].classList.remove("usada");
          S.huecos[i] = null; S.huecosFicha[i] = null; h.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
          $("#lec-ppal").disabled = true;
        });
        tpl.appendChild(h); spans.push(h); S.huecos.push(null); S.huecosFicha.push(null);
      }
    });
    c.appendChild(tpl);
    var banco = el("div", "banco");
    baraja(paso.banco).forEach(function (v) {
      var f = el("button", "ficha"); f.textContent = v;
      f.addEventListener("click", function () {
        if (S.estado !== "responder") return;
        var libre = S.huecos.indexOf(null); if (libre === -1) return;
        S.huecos[libre] = v; S.huecosFicha[libre] = f; spans[libre].textContent = v; f.classList.add("usada"); F.sonido.tocar("toque");
        $("#lec-ppal").disabled = S.huecos.indexOf(null) !== -1;
      });
      banco.appendChild(f);
    });
    c.appendChild(banco);
  },

  escribe: function (c, paso) {
    cabecera(c, paso, "Escribe la respuesta");
    if (paso.c) c.appendChild(el("div", "lec-texto", paso.c));
    var i = el("input", "escribir"); i.id = "campo";
    i.placeholder = paso.ph || "escribe aquí…"; i.autocomplete = "off"; i.spellcheck = false;
    i.setAttribute("autocapitalize", "off");
    i.addEventListener("input", function () { S.resp = i.value; $("#lec-ppal").disabled = !i.value.trim(); });
    i.addEventListener("keydown", function (e) { if (e.key === "Enter" && i.value.trim()) { e.preventDefault(); accion(); } });
    c.appendChild(i);
    if (paso.pista) c.appendChild(el("div", "nota", '<b class="tit">Pista</b>' + paso.pista));
    setTimeout(function () { i.focus(); }, 60);
    $("#lec-saltar").hidden = false;
  },

  orden: function (c, paso) {
    cabecera(c, paso, "Ponlo en orden");
    if (paso.c) c.appendChild(el("div", "lec-texto", paso.c));
    var zona = el("div", "zona"), banco = el("div", "lista-orden");
    S.orden = [];
    c.appendChild(zona); c.appendChild(banco);
    function renum() {
      $$(".linea", zona).forEach(function (l, n) { l.querySelector(".num").textContent = n + 1; l.classList.add("puesta"); });
      $$(".linea", banco).forEach(function (l) { l.querySelector(".num").textContent = ""; l.classList.remove("puesta"); });
    }
    baraja(paso.items.map(function (t, i) { return { t: t, i: i }; })).forEach(function (o) {
      var b = el("button", "linea", '<span class="num"></span><span></span>');
      b.lastChild.textContent = o.t;
      b.dataset.i = String(o.i);
      b.addEventListener("click", function () {
        if (S.estado !== "responder") return;
        if (b.parentNode === banco) { zona.appendChild(b); S.orden.push(o.i); }
        else { banco.appendChild(b); S.orden = S.orden.filter(function (x) { return x !== o.i; }); }
        renum(); F.sonido.tocar("toque");
        $("#lec-ppal").disabled = S.orden.length !== paso.items.length;
      });
      banco.appendChild(b);
    });
  },

  par: function (c, paso) {
    cabecera(c, paso, "Empareja cada elemento");
    var wrap = el("div", "pares"), izq = el("div", "par-col"), der = el("div", "par-col");
    wrap.appendChild(izq); wrap.appendChild(der); c.appendChild(wrap);
    var aviso = el("div", "par-fallos"); aviso.id = "par-fallos"; aviso.hidden = true; aviso.setAttribute("aria-live", "polite"); c.appendChild(aviso);
    var sel = null, hechos = 0;
    S.fallosPar = 0;
    function pick(b, lado) {
      if (S.estado !== "responder" || b.classList.contains("ok")) return;
      if (!sel) { sel = { b: b, lado: lado }; b.classList.add("sel"); F.sonido.tocar("toque"); return; }
      if (sel.lado === lado) { sel.b.classList.remove("sel"); sel = { b: b, lado: lado }; b.classList.add("sel"); return; }
      var a = sel.b, iz = lado === "izq" ? b : a, de = lado === "izq" ? a : b;
      // se compara por texto de la definición: dos definiciones idénticas son intercambiables
      if (paso.pares[+iz.dataset.i][1] === paso.pares[+de.dataset.i][1]) {
        a.classList.remove("sel"); a.classList.add("ok"); b.classList.add("ok"); hechos++; sel = null;
        if (hechos === paso.pares.length) {
          // deja ver la última pareja en verde y corrige: con algún fallo, la pregunta vuelve al final
          S.resp = true; S.estado = "cerrando";
          setTimeout(function () { if (S && S.estado === "cerrando") { S.estado = "responder"; accion(); } }, 380);
        } else F.sonido.tocar("parOk");
      } else {
        a.classList.add("err"); b.classList.add("err"); sel = null; S.fallosPar++; F.sonido.tocar("parMal");
        var n = $("#par-fallos"); if (n) { n.hidden = false; n.textContent = S.fallosPar === 1 ? "1 pareja incorrecta" : S.fallosPar + " parejas incorrectas"; }
        setTimeout(function () { a.classList.remove("err", "sel"); b.classList.remove("err"); }, 420);
      }
    }
    baraja(paso.pares.map(function (p, i) { return i; })).forEach(function (i) {
      var b = el("button", "par izq"); b.textContent = paso.pares[i][0]; b.dataset.i = String(i);
      b.addEventListener("click", function () { pick(b, "izq"); }); izq.appendChild(b);
    });
    baraja(paso.pares.map(function (p, i) { return i; })).forEach(function (i) {
      var b = el("button", "par der"); b.textContent = paso.pares[i][1]; b.dataset.i = String(i);
      b.addEventListener("click", function () { pick(b, "der"); }); der.appendChild(b);
    });
  },

  term: function (c, paso) {
    cabecera(c, paso, "Escríbelo en la terminal");
    if (paso.c) c.appendChild(el("div", "lec-texto", paso.c));
    var prompt = paso.prompt || "PS C:\\practicar-docker>";
    var box = el("div", "mini-term");
    box.innerHTML = '<div class="cab-t"><i></i><i></i><i></i><span>terminal</span></div><div class="cuerpo-t"><div class="salida" id="salida"></div><div class="mini-linea"><span></span><input id="campo" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="escribe el comando y pulsa Enter"></div></div>';
    box.querySelector(".mini-linea span").textContent = prompt;
    if (paso.antes) box.querySelector("#salida").innerHTML = paso.antes + "\n";
    c.appendChild(box);
    var i = box.querySelector("input");
    i.addEventListener("input", function () { S.resp = i.value; $("#lec-ppal").disabled = !i.value.trim(); });
    i.addEventListener("keydown", function (e) { if (e.key === "Enter" && i.value.trim()) { e.preventDefault(); accion(); } });
    box.addEventListener("click", function () { i.focus(); });
    if (paso.pista) c.appendChild(el("div", "nota", '<b class="tit">Pista</b>' + paso.pista));
    setTimeout(function () { i.focus(); }, 60);
    $("#lec-saltar").hidden = false;
  }
};

function aceptaTexto(paso, v) {
  v = norm(v);
  if (paso.re && new RegExp(paso.re, "i").test(v)) return true;
  return (paso.sol || []).some(function (s) { return norm(s) === v; });
}

var CORRIGE = {
  opcion: function (paso) {
    var ok = S.resp === paso.ok;
    $$(".op", PANT).forEach(function (b) {
      var i = +b.dataset.idx; b.disabled = true; b.classList.remove("sel");
      if (i === paso.ok) b.classList.add("bien"); else if (i === S.resp) b.classList.add("mal");
    });
    return ok;
  },
  vf: function (paso) {
    var ok = S.resp === paso.ok;
    $$(".op", PANT).forEach(function (b) {
      var v = b.dataset.val === "1"; b.disabled = true; b.classList.remove("sel");
      if (v === paso.ok) b.classList.add("bien"); else if (v === S.resp) b.classList.add("mal");
    });
    return ok;
  },
  hueco: function (paso) {
    var ok = paso.sol.every(function (s, i) { return norm(S.huecos[i]) === norm(s); });
    $$(".hueco", PANT).forEach(function (h, i) { h.style.color = norm(S.huecos[i]) === norm(paso.sol[i]) ? "var(--term-ok)" : "#ff8b7f"; });
    return ok;
  },
  escribe: function (paso) {
    var ok = aceptaTexto(paso, S.resp), c = $("#campo", PANT);
    if (c) { c.classList.add(ok ? "bien" : "mal"); c.disabled = true; }
    return ok;
  },
  orden: function () {
    var ok = S.orden.every(function (v, i) { return v === i; });
    $$(".zona .linea", PANT).forEach(function (l, n) { l.classList.add(+l.dataset.i === n ? "bien" : "mal"); });
    return ok;
  },
  par: function () { return S.fallosPar === 0; },
  term: function (paso) {
    var ok = aceptaTexto(paso, S.resp), c = $("#campo", PANT), sal = $("#salida", PANT);
    if (c) c.disabled = true;
    if (ok && sal) {
      var linea = document.createElement("div");
      linea.innerHTML = '<span class="pr"></span> <b></b>';
      linea.querySelector(".pr").textContent = paso.prompt || "PS C:\\practicar-docker>";
      linea.querySelector("b").textContent = S.resp;
      sal.appendChild(linea);
      if (paso.salida) { var o = document.createElement("div"); o.textContent = paso.salida; sal.appendChild(o); }
      var lm = $(".mini-linea", PANT); if (lm) lm.style.display = "none";
    }
    return ok;
  }
};

var FRASES_OK = ["¡Bien!", "¡Exacto!", "¡Eso es!", "¡Perfecto!", "¡Correcto!"];
var FRASES_NO = ["Incorrecto", "No es correcto", "Esa no es", "Todavía no"];
var ESPERA_MIN = 450;   // ms que la corrección queda visible antes de poder continuar

function azar(a) { return a[Math.floor(Math.random() * a.length)]; }
function textoPlano(html) { var d = document.createElement("div"); d.innerHTML = html; return d.textContent; }

/* respuesta correcta en texto, para mostrarla al fallar (null si ya se ve en pantalla) */
function solucion(paso) {
  switch (paso.t) {
    case "opcion": return textoPlano(paso.ops[paso.ok]);
    case "vf": return paso.ok ? "Verdadero" : "Falso";
    case "hueco": var k = 0; return paso.tpl.replace(/___/g, function () { return paso.sol[k++]; });
    case "orden": return paso.items.map(function (t, i) { return (i + 1) + ". " + t; }).join("\n");
    case "escribe": case "term": return paso.sol ? paso.sol[0] : null;
    default: return null;
  }
}
/* lo que respondió la persona, para compararlo con la solución */
function suRespuesta(paso) {
  switch (paso.t) {
    case "opcion": return S.resp == null ? null : textoPlano(paso.ops[S.resp]);
    case "vf": return S.resp ? "Verdadero" : "Falso";
    case "hueco": var k = 0; return paso.tpl.replace(/___/g, function () { return S.huecos[k++] || "…"; });
    case "escribe": case "term": return S.resp;
    default: return null;
  }
}

/* al fallar, la explicación no debe empezar felicitando ("Exacto: ...") */
function explicacion(why, ok) {
  if (!why) return ok ? "Correcto." : "";
  if (ok) return why;
  var sin = why.replace(/^\s*¡?(exacto|correcto|eso es|bien|muy bien|perfecto|así es)\s*[!.:,]+\s*/i, "");
  return sin.charAt(0).toUpperCase() + sin.slice(1);
}

function accion() {
  if (!S) return;
  var item = S.cola[0]; if (!item) return;
  var paso = item.p;
  if (paso.t === "info") { S.cola.shift(); S.hechos++; return siguiente(); }
  if (S.estado === "corregido") {
    // un doble clic o un Enter rápido no debe ocultar la corrección
    if (Date.now() - S.corregidoEn < ESPERA_MIN) return;
    S.cola.shift(); S.hechos++; return siguiente();
  }
  if (S.estado !== "responder") return;
  var ok = !!(CORRIGE[paso.t] || function () { return true; })(paso);
  S.estado = "corregido"; S.corregidoEn = Date.now(); S.preguntas++;
  if (ok && !item.reintento) S.aciertosPrimera++;
  if (!ok) {
    if (S.falladas.indexOf(paso) === -1) S.falladas.push(paso);
    S.cola.push({ p: paso, i: item.i, reintento: true });
  }
  // feedback: siempre visible, con icono, título, explicación y, si falla, la respuesta correcta
  var pie = $("#lec-pie");
  pie.classList.remove("bien", "mal");
  void pie.offsetWidth;   // reinicia la animación de entrada
  pie.classList.add(ok ? "bien" : "mal");
  $("#fb").hidden = false; $("#lec-saltar").hidden = true;
  $("#fb-ico").innerHTML = F.icono(ok ? "check" : "x");
  $("#fb-cata").innerHTML = F.cata({ expr: ok ? "feliz" : "duda", nivel: F.nivelCurso(S.cursoId), alto: 54 });
  var titulo = ok ? azar(FRASES_OK) : azar(FRASES_NO);
  if (paso.t === "par") titulo = ok ? "¡Todas a la primera!" : (S.fallosPar === 1 ? "1 pareja incorrecta" : S.fallosPar + " parejas incorrectas");
  $("#fb-tit").textContent = titulo;
  $("#fb-txt").innerHTML = explicacion(paso.why, ok) +
    (ok ? "" : ' <span class="fb-vuelve">Volverá a salir al final de la lección.</span>');
  if (!ok) {
    var tuya = suRespuesta(paso), sol = solucion(paso);
    if (tuya != null && sol != null && tuya !== sol) { $("#fb-tuya").textContent = "Tu respuesta: " + tuya; $("#fb-tuya").hidden = false; }
    if (sol) { $("#fb-sol").textContent = "Respuesta correcta: " + sol; $("#fb-sol").hidden = false; }
    var cuerpo = $("#lec-in"); cuerpo.classList.remove("sacude"); void cuerpo.offsetWidth; cuerpo.classList.add("sacude");
  }
  F.sonido.tocar(ok ? "acierto" : "error");
  var b = $("#lec-ppal"); b.disabled = false;
  b.textContent = S.cola.length > 1 ? "Continuar" : "Terminar";
  b.focus({ preventScroll: true });
  // que la corrección se vea aunque el pie quede fuera de pantalla en móviles pequeños
  if ($("#fb").scrollIntoView) $("#fb").scrollIntoView({ block: "nearest" });
}

/* ---------------- fin de lección ---------------- */
function fin() {
  var seg = Math.round((Date.now() - S.inicio) / 1000);
  var pct = S.preguntas ? Math.round(S.aciertosPrimera / S.preguntas * 100) : 100;
  var cursoId = S.cursoId, l = S.l, falladas = S.falladas.slice();
  var boton = $("#lec-ppal"); boton.disabled = true; boton.textContent = "Guardando…";
  F.registrarLeccion(cursoId, l.id, S.aciertosPrimera, S.preguntas).then(function (r) {
    pintarFin(r, pct, seg, cursoId, l, falladas);
  }).catch(function (e) {
    F.toast("No se pudo guardar el progreso: " + e.message, "!");
    pintarFin({ xp: 0, nuevas: [] }, pct, seg, cursoId, l, falladas);
  });
}

function pintarFin(r, pct, seg, cursoId, l, falladas) {
  F.sonido.tocar("fin");
  if ((r.nuevas && r.nuevas.length) || (r.certificados && r.certificados.length)) F.sonido.tocar("insignia");
  var sig = F.siguiente(cursoId);
  var medalla = '<div class="fin-cata">' + F.cata({ expr: "celebra", nivel: F.nivelCurso(cursoId), brillo: F.racha() > 0, alto: 154, etiqueta: "Cata celebra que has terminado la lección" }) + '<svg class="fin-medalla" viewBox="0 0 104 104" aria-hidden="true"><circle cx="52" cy="52" r="48" fill="var(--ok-soft)"/><circle cx="52" cy="52" r="48" fill="none" stroke="var(--ok)" stroke-width="3" stroke-dasharray="6 5"/>' +
    (pct >= 90 ? '<path d="m52 26 7.6 15.4 17 2.5-12.3 12 2.9 16.9L52 64.8l-15.2 8 2.9-16.9-12.3-12 17-2.5z" fill="var(--accent-fill)"/>' : '<path d="m34 53 12 12 24-26" fill="none" stroke="var(--ok)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>') + "</svg></div>";
  var nuevas = (r.nuevas || []).map(function (id) {
    var ins = F.INSIGNIAS.find(function (x) { return x.id === id; }) || { nombre: id, desc: "" };
    return '<div class="insignia-nueva">' + F.medalla(id, 40) + "<div><b>Nueva insignia: " + F.esc(ins.nombre) + "</b><span>" + F.esc(ins.desc) + "</span></div></div>";
  }).join("");
  var cert = (r.certificados || []).filter(function (x) { return x.curso === cursoId; })[0];
  var cursoHecho = F.porcentaje(cursoId) === 100;
  var bloqueCert = cert
    ? '<div class="fin-certificado">' + F.icono("certificado") + "<div><b>¡Has completado " + F.esc(cert.titulo) + "!</b><span>Tu certificado está listo, con un código que cualquiera puede verificar.</span></div>" +
      '<button class="btn btn-primario" id="fin-cert">Ver mi certificado</button></div>'
    : cursoHecho && !E.perfil
      ? '<div class="fin-certificado">' + F.icono("certificado") + "<div><b>¡Has completado el curso!</b><span>Crea una cuenta y tu progreso se guardará con tu certificado.</span></div>" +
        '<a class="btn btn-primario" href="#/entrar?modo=registro" id="fin-cert-registro">Crear cuenta</a></div>'
      : "";
  var claves = (l.claves || []).map(function (c) { return "<li>" + c + "</li>"; }).join("");
  var fall = falladas.map(function (p) { return "<li>" + F.esc(String(p.p || p.h || "").replace(/<[^>]+>/g, "").slice(0, 120)) + "</li>"; }).join("");
  var c = $("#lec-in");
  $("#lec-pie").hidden = true;
  $("#lec-prog").style.width = "100%";
  $("#lec-cuenta").textContent = "completada";
  c.innerHTML =
    '<div class="fin">' + medalla +
      "<div><h2>" + (pct >= 90 ? "¡Lección dominada!" : "Lección completada") + '</h2><p class="sub">' + F.esc(l.titulo) + "</p></div>" +
      '<div class="fin-cajas">' +
        '<div class="fin-caja xp"><small>XP</small><b>+' + (r.xp || 0) + "</b></div>" +
        '<div class="fin-caja ac"><small>A la primera</small><b>' + pct + "%</b></div>" +
        '<div class="fin-caja tm"><small>Tiempo</small><b>' + Math.floor(seg / 60) + ":" + ("0" + (seg % 60)).slice(-2) + "</b></div>" +
      "</div>" + bloqueCert + nuevas +
      '<div class="fin-resumen panel panel-pad">' +
        (claves ? "<h3>Lo que acabas de aprender</h3><ul>" + claves + "</ul>" : "") +
        (fall ? '<h3>Repasa esto</h3><ul class="falladas">' + fall + "</ul>" : "") +
      "</div>" +
      '<div style="display:grid;gap:10px">' +
        (sig ? '<button class="tactil" id="fin-sig" style="width:100%">Siguiente: ' + F.esc(sig.leccion.titulo) + "</button>" : '<button class="tactil" id="fin-curso" style="width:100%">¡Curso terminado! Ver el curso</button>') +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
          '<button class="btn" id="fin-volver">Volver al curso</button>' +
          '<button class="btn" id="fin-comentar">' + F.icono("comunidad") + " Dudas sobre esta lección</button>" +
        "</div>" +
      "</div>" +
    "</div>";
  var sc = $("#lec-scroll"); if (sc) sc.scrollTop = 0;   // el resumen empieza arriba, con Cata a la vista
  var cerrarE = function (ruta) { cerrarPantalla(); F.ir(ruta); };
  var bs = $("#fin-sig"); if (bs) bs.addEventListener("click", function () { F.abrirLeccion(cursoId, sig.leccion.id); history.replaceState(null, "", "#/leccion/" + cursoId + "/" + sig.leccion.id); });
  var bc = $("#fin-curso"); if (bc) bc.addEventListener("click", function () { cerrarE("/curso/" + cursoId); });
  $("#fin-volver").addEventListener("click", function () { cerrarE("/curso/" + cursoId); });
  $("#fin-comentar").addEventListener("click", function () { cerrarE("/comunidad?curso=" + cursoId + "&leccion=" + l.id); });
  var bcert = $("#fin-cert"); if (bcert) bcert.addEventListener("click", function () { cerrarE("/certificado/" + cert.codigo); });
  var breg = $("#fin-cert-registro"); if (breg) breg.addEventListener("click", function () { cerrarPantalla(); });
  S = null;
  (bs || bc).focus({ preventScroll: true });   // sin desplazar: el resumen se ve desde arriba
  F.pintarStats();
}

})();
