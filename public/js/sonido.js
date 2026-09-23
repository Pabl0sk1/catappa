/* =====================================================================
   CATAPPA — sonidos
   Se sintetizan con Web Audio: no hay ficheros que descargar y funcionan
   sin conexión. Se activan o desactivan en Ajustes y en la barra de la
   lección; la preferencia se guarda en este navegador.
   ===================================================================== */
(function () {
"use strict";
var F = window.F;
var CLAVE = "catappa-sonido", CLAVE_VOL = "catappa-volumen";
var ctx = null, maestro = null;

function leer(k, def) { try { var v = localStorage.getItem(k); return v == null ? def : v; } catch (e) { return def; } }
function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

function contexto() {
  if (!ctx) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    maestro = ctx.createGain();
    maestro.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  maestro.gain.value = +leer(CLAVE_VOL, "0.6") * 0.5;
  return ctx;
}

/* una nota con envolvente corta; t0 relativo a "ahora" */
function nota(frec, t0, dur, tipo, vol, frecFin) {
  var c = contexto(); if (!c) return;
  var ini = c.currentTime + t0;
  var o = c.createOscillator(), g = c.createGain();
  o.type = tipo || "sine";
  o.frequency.setValueAtTime(frec, ini);
  if (frecFin) o.frequency.exponentialRampToValueAtTime(frecFin, ini + dur);
  g.gain.setValueAtTime(0.0001, ini);
  g.gain.exponentialRampToValueAtTime(vol || 0.5, ini + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, ini + dur);
  o.connect(g); g.connect(maestro);
  o.start(ini); o.stop(ini + dur + 0.02);
}

var SONIDOS = {
  // respuesta correcta: dos notas ascendentes, claras
  acierto: function () { nota(659.25, 0, 0.13, "triangle", 0.55); nota(987.77, 0.09, 0.26, "triangle", 0.5); nota(1975.5, 0.09, 0.2, "sine", 0.08); },
  // respuesta incorrecta: dos notas graves descendentes, suaves
  error: function () { nota(220, 0, 0.16, "square", 0.16, 200); nota(164.8, 0.13, 0.28, "square", 0.16, 150); nota(110, 0, 0.4, "sine", 0.35); },
  // emparejar: pareja correcta / incorrecta (más cortos que los de comprobar)
  parOk: function () { nota(880, 0, 0.09, "triangle", 0.4); nota(1318.5, 0.05, 0.12, "triangle", 0.3); },
  parMal: function () { nota(196, 0, 0.14, "square", 0.12, 170); nota(98, 0, 0.18, "sine", 0.3); },
  // tocar una opción o una ficha
  toque: function () { nota(1400, 0, 0.035, "sine", 0.12); },
  // pasar al siguiente paso: un toque breve y suave, para que no canse al repetirse
  continuar: function () { nota(587.33, 0, 0.07, "triangle", 0.26); nota(880, 0.045, 0.1, "sine", 0.14); },
  // lección terminada: arpegio
  fin: function () {
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { nota(f, i * 0.11, 0.3, "triangle", 0.45); });
    nota(1046.5, 0.44, 0.7, "sine", 0.25); nota(1567.98, 0.44, 0.7, "sine", 0.12);
  },
  // insignia nueva: brillo
  insignia: function () { [1318.5, 1567.98, 2093, 2637].forEach(function (f, i) { nota(f, 0.6 + i * 0.07, 0.35, "sine", 0.18); }); }
};

F.sonido = {
  activo: function () { return leer(CLAVE, "1") === "1"; },
  activar: function (si) { guardar(CLAVE, si ? "1" : "0"); if (si) contexto(); },
  volumen: function (v) { if (v != null) { guardar(CLAVE_VOL, String(v)); contexto(); } return +leer(CLAVE_VOL, "0.6"); },
  tocar: function (nombre) {
    if (!F.sonido.activo() || !SONIDOS[nombre]) return;
    try { SONIDOS[nombre](); } catch (e) { /* sin audio disponible: se ignora */ }
  }
};
})();
