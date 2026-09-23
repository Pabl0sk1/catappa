/* =====================================================================
   CATAPPA — Cata, la mascota
   Se dibuja en vector desde el código para que pueda cambiar:
     · el color de la hoja, según tu nivel en el curso
       (verde Fundamentos · amarillo Intermedio · naranja Avanzado ·
        rojo Experto · dorado Maestro, como la hoja del almendro catappa)
     · la expresión: normal, feliz (acierto), duda (fallo),
       celebra (lección terminada) y dormida (hace días que no entras)
     · el brillo de la hoja cuando llevas racha
   Uso:  F.cata({ expr: "feliz", nivel: "Intermedio", brillo: true, alto: 96 })
   ===================================================================== */
(function () {
"use strict";
var F = window.F;

var NAVY = "#072D44", TEAL = "#179493", BLANCO = "#FFFFFF", T = 22;

/* color de la hoja por nivel del curso */
var HOJAS = {
  "Fundamentos": { claro: "#70B37D", oscuro: "#247A6A" },
  "Intermedio":  { claro: "#E3C45C", oscuro: "#B98E2C" },
  "Avanzado":    { claro: "#E59148", oscuro: "#B45F22" },
  "Experto":     { claro: "#D9603F", oscuro: "#A33A22" },
  "Maestro":     { claro: "#E8BE45", oscuro: "#A87C15" }
};
F.NIVELES_HOJA = HOJAS;
F.colorHoja = function (nivel) { return (HOJAS[nivel] || HOJAS.Fundamentos).claro; };

var pts = function (a) { return a.map(function (p) { return p.join(","); }).join(" "); };
var poly = function (a, fill) { return '<polygon points="' + pts(a) + '" fill="' + fill + '"/>'; };
var linea = function (a, w) { return '<polyline points="' + pts(a) + '" fill="none" stroke="' + NAVY + '" stroke-width="' + (w || T) + '" stroke-linejoin="miter" stroke-miterlimit="6" stroke-linecap="square"/>'; };
var camino = function (d, fill, trazo) {
  return '<path d="' + d + '" fill="' + (fill || "none") + '"' + (trazo ? ' stroke="' + NAVY + '" stroke-width="' + trazo + '" stroke-linejoin="round" stroke-linecap="round"' : "") + "/>";
};

/* puntos del dibujo (misma rejilla que el logo) */
var OI = [258, 26], OD = [557, 26], OIb = [258, 205], ODb = [557, 205];
var CI = [352, 131], CD = [460, 131], MI = [233, 328], MD = [584, 328], BAR = [408, 420];
var HOM = [283, 360], ESP = [47, 548], SUE_I = [47, 851], SUE_D = [493, 851], CUE_D = [493, 376];
var HOJA = "M742,345 C802,395 830,492 792,588 C764,655 718,688 680,694 C618,655 570,585 576,505 C584,420 650,362 742,345 Z";
var NERVIO = "M740,352 C720,445 696,578 672,690";

/* ojos, nariz y detalles según la expresión */
function cara(expr) {
  var nariz = poly([[378, 315], [440, 315], [408, 355]], NAVY);
  var ojosNormales = poly([[308, 236], [366, 250], [372, 282], [318, 257]], NAVY) +
                     poly([[508, 236], [450, 250], [444, 282], [498, 257]], NAVY);
  var ojosFeliz = camino("M304,272 Q338,230 372,266", null, 18) + camino("M512,272 Q478,230 444,266", null, 18);
  var sonrisa = camino("M370,372 Q408,402 446,372", null, 15);
  var ojosDormida = camino("M306,250 Q338,288 370,252", null, 16) + camino("M510,250 Q478,288 446,252", null, 16);
  var letra = function (x, y, tam, op) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + tam + '" font-weight="700" fill="' + NAVY + '" opacity="' + op + '" font-family="Montserrat, system-ui, sans-serif">z</text>';
  };
  if (expr === "feliz" || expr === "celebra") return ojosFeliz + nariz + sonrisa;
  if (expr === "duda") {
    // un ojo normal y una ceja levantada: cara de «¿eh?», nunca de regañina
    return poly([[308, 246], [366, 236], [372, 268], [318, 271]], NAVY) +
           camino("M446,258 Q478,236 512,254", null, 18) + nariz +
           camino("M382,376 Q408,362 434,378", null, 14) +
           '<text x="626" y="150" font-size="170" font-weight="700" fill="' + NAVY + '" font-family="Montserrat, system-ui, sans-serif">?</text>';
  }
  if (expr === "dormida") return ojosDormida + nariz + letra(600, 120, 120, 0.9) + letra(700, 40, 90, 0.6) + letra(772, -20, 62, 0.4);
  return ojosNormales + nariz;
}

/* la hoja, con el color del nivel */
function hoja(nivel, uid) {
  var c = HOJAS[nivel] || HOJAS.Fundamentos;
  return '<clipPath id="' + uid + '"><path d="' + HOJA + '"/></clipPath>' +
    camino(HOJA, c.claro) +
    '<g clip-path="url(#' + uid + ')">' + camino(NERVIO + " L900,690 L900,338 Z", c.oscuro) + "</g>" +
    camino(NERVIO, null, 16) +
    camino("M718,448 L676,404 M704,522 L640,462 M690,596 L620,540", null, 14) +
    camino("M716,458 L772,428 M702,530 L782,500 M688,604 L762,578", null, 14) +
    camino(HOJA, null, T);
}

var n = 0;
/* opciones: expr, nivel, brillo, alto, clase, etiqueta */
F.cata = function (o) {
  o = o || {};
  var expr = o.expr || "normal", nivel = o.nivel || "Fundamentos";
  var uid = "cata-hoja-" + (++n);
  var cuerpo =
    poly([HOM, BAR, CUE_D, SUE_D, SUE_I, ESP], BLANCO) +
    poly([HOM, BAR, [484, 392], [433, 621]], TEAL) +
    poly([[433, 621], [484, 392], [493, 392], [493, 790], [433, 790]], TEAL) +
    poly([[318, 650], [262, 775], [355, 770]], TEAL) +
    linea([HOM, ESP, SUE_I, SUE_D, CUE_D]) +
    linea([[484, 390], [433, 621], [433, 790], [493, 790]]) +
    linea([[63, 550], [313, 625]]) +
    linea([[313, 566], [400, 845]]) +
    linea([[307, 648], [240, 788], [333, 781]]) +
    camino("M333,781 C352,783 366,805 373,838", null, T);
  var cola = '<g class="cata-cola">' +
    camino("M493,851 L545,851 C645,851 712,792 716,694 L666,694 C656,738 614,775 560,775 L505,775 Z", BLANCO) +
    camino("M493,851 L545,851 C645,851 712,792 716,694", null, T) +
    camino("M505,775 L560,775 C614,775 656,738 666,694", null, T) + "</g>";
  var cabeza = '<g class="cata-cabeza">' +
    poly([CI, CD, ODb, MD, BAR, MI, OIb], BLANCO) +
    poly([OI, CI, OIb], TEAL) + poly([OD, CD, ODb], TEAL) +
    linea([OIb, OI, CI, CD, OD, ODb]) +
    linea([CI, OIb, MI, BAR, MD, ODb, CD]) +
    cara(expr) + "</g>";
  var laHoja = '<g class="cata-hoja">' + hoja(nivel, uid) + "</g>";
  var clases = ["cata", "cata-" + expr].concat(o.brillo ? ["cata-brillo"] : [], o.clase ? [o.clase] : []).join(" ");
  var etiqueta = o.etiqueta || ("Cata, la mascota de Catappa" + (o.nivel ? ", con la hoja de nivel " + nivel : ""));
  var alto = o.alto ? ' style="height:' + o.alto + 'px"' : "";
  return '<svg class="' + clases + '" viewBox="-40 -80 920 1000"' + alto + ' role="img" aria-label="' + F.esc(etiqueta) + '">' +
    cuerpo + cola + laHoja + cabeza + "</svg>";
};

/* nivel en el que vas dentro de un curso: el de la unidad de tu próxima lección
   (o el de la última unidad si ya lo terminaste) */
F.nivelCurso = function (cursoId) {
  var c = F.curso(cursoId);
  if (!c || !c.unidades || !c.unidades.length) return "Fundamentos";
  var sig = F.siguiente(cursoId);
  var u = sig ? c.unidades[sig.ui] : c.unidades[c.unidades.length - 1];
  return (u && u.nivel) || "Fundamentos";
};
/* el nivel más alto alcanzado en cualquier curso, para el perfil */
var ORDEN = ["Fundamentos", "Intermedio", "Avanzado", "Experto", "Maestro"];
F.nivelMaximo = function () {
  var mejor = 0;
  F.cursos().forEach(function (c) {
    if (!F.contarHechas(c.id)) return;
    var i = ORDEN.indexOf(F.nivelCurso(c.id));
    if (i > mejor) mejor = i;
  });
  return ORDEN[mejor];
};
/* días desde la última actividad (para que Cata se duerma) */
F.diasSinAprender = function () {
  var act = (E_actividad() || {}), dias = Object.keys(act).filter(function (d) { return act[d] > 0; }).sort();
  if (!dias.length) return null;
  var ultima = new Date(dias[dias.length - 1] + "T00:00:00Z");
  return Math.floor((Date.now() - ultima.getTime()) / 86400000);
};
function E_actividad() {
  var E = F.E;
  if (E.perfil && E.perfil.actividad) return E.perfil.actividad;
  return F.leerLocal("catappa-progreso-local", { actividad: {} }).actividad || {};
}
})();
