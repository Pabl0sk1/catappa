/* =====================================================================
   CATAPPA — certificados de finalización de curso
   El certificado se dibuja en un canvas (2000 × 1414 px, proporción A4
   apaisada) con los logos y fuentes de la marca: la misma imagen se ve en
   la página, se descarga como PNG y se imprime o guarda como PDF.
   Cualquiera puede verificarlo en #/certificado/<código>.
   ===================================================================== */
(function () {
"use strict";
var F = window.F, E = F.E, $ = F.$;

var AN = 2000, AL = 1414;
var C = { navy: "#072D44", teal: "#179493", tealOsc: "#117877", hoja: "#70B37D", hojaOsc: "#247A6A", papel: "#FBFDFD", tinta2: "#3B5567", tinta3: "#6B8291", linea: "#D3DEE2" };
var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function fechaLarga(iso) { var p = String(iso).split("-"); return +p[2] + " de " + MESES[+p[1] - 1] + " de " + p[0]; }
function imagen(src) {
  return new Promise(function (ok) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; });
}
function horas(cursoId) { return F.curso(cursoId) && F.horasCurso ? F.horasCurso(F.curso(cursoId)) : 1; }
/* texto centrado que se reduce si no cabe en el ancho */
function textoAjustado(ctx, texto, x, y, maxAncho, fuente, tam) {
  var t = tam;
  do { ctx.font = fuente.replace("{t}", t); t -= 2; } while (ctx.measureText(texto).width > maxAncho && t > 20);
  ctx.fillText(texto, x, y);
}

F.dibujarCertificado = function (cert) {
  var curso = F.curso(cert.curso) || { titulo: cert.titulo, logo: null, color: C.teal };
  var fuentes = document.fonts ? Promise.all([
    document.fonts.load("600 96px Montserrat"), document.fonts.load("700 40px Montserrat"),
    document.fonts.load("400 30px Geist"), document.fonts.load("500 26px 'Geist Mono'")
  ]).catch(function () {}) : Promise.resolve();
  return Promise.all([fuentes, imagen("marca/catappa-horizontal.png"), imagen("marca/cata-256.png"), curso.logo ? imagen(curso.logo) : null]).then(function (r) {
    var logoMarca = r[1], cata = r[2], logoCurso = r[3];
    var cv = document.createElement("canvas"); cv.width = AN; cv.height = AL;
    var x = cv.getContext("2d");
    x.textBaseline = "alphabetic"; x.textAlign = "center";

    // papel y marcos
    x.fillStyle = C.papel; x.fillRect(0, 0, AN, AL);
    x.strokeStyle = C.navy; x.lineWidth = 22; x.strokeRect(46, 46, AN - 92, AL - 92);
    x.strokeStyle = C.teal; x.lineWidth = 3; x.strokeRect(84, 84, AN - 168, AL - 168);
    // esquinas con hojas
    [[84, 84, 0], [AN - 84, 84, 1], [84, AL - 84, 3], [AN - 84, AL - 84, 2]].forEach(function (e) {
      x.save(); x.translate(e[0], e[1]); x.rotate(e[2] * Math.PI / 2);
      x.fillStyle = C.hoja; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(58, 6, 64, 64); x.quadraticCurveTo(6, 58, 0, 0); x.fill();
      x.strokeStyle = C.hojaOsc; x.lineWidth = 3; x.beginPath(); x.moveTo(4, 4); x.lineTo(56, 56); x.stroke();
      x.restore();
    });

    // cabecera: logo de Catappa
    if (logoMarca) { var hL = 118, wL = logoMarca.width * hL / logoMarca.height; x.drawImage(logoMarca, (AN - wL) / 2, 150, wL, hL); }
    x.fillStyle = C.teal; x.font = "700 40px Montserrat, sans-serif";
    if ("letterSpacing" in x) x.letterSpacing = "10px";
    x.fillText("CERTIFICADO DE FINALIZACIÓN", AN / 2, 358);
    if ("letterSpacing" in x) x.letterSpacing = "0px";

    // a quién
    x.fillStyle = C.tinta2; x.font = "400 32px Geist, sans-serif";
    x.fillText("Se otorga a", AN / 2, 450);
    x.fillStyle = C.navy;
    textoAjustado(x, cert.nombre, AN / 2, 560, 1400, "600 {t}px Montserrat, sans-serif", 104);
    x.strokeStyle = C.linea; x.lineWidth = 2; x.beginPath(); x.moveTo(AN / 2 - 520, 598); x.lineTo(AN / 2 + 520, 598); x.stroke();

    // por qué
    x.fillStyle = C.tinta2; x.font = "400 32px Geist, sans-serif";
    x.fillText("por completar con éxito el curso", AN / 2, 668);
    x.font = "600 72px Montserrat, sans-serif";
    var titulo = cert.titulo || curso.titulo, anchoT = Math.min(x.measureText(titulo).width, 1300);
    var conLogo = !!logoCurso, lado = 96, hueco = 30;
    var total = anchoT + (conLogo ? lado + hueco : 0), x0 = (AN - total) / 2;
    if (conLogo) {
      x.fillStyle = "#FFFFFF"; x.strokeStyle = C.linea; x.lineWidth = 2;
      x.beginPath(); x.roundRect ? x.roundRect(x0, 712, lado, lado, 20) : x.rect(x0, 712, lado, lado); x.fill(); x.stroke();
      x.drawImage(logoCurso, x0 + 14, 726, lado - 28, lado - 28);
    }
    x.fillStyle = C.teal; x.textAlign = "left";
    textoAjustado(x, titulo, x0 + (conLogo ? lado + hueco : 0), 785, 1300, "600 {t}px Montserrat, sans-serif", 72);
    x.textAlign = "center";
    x.fillStyle = C.tinta2; x.font = "400 30px Geist, sans-serif";
    var h = horas(cert.curso);
    x.fillText(cert.lecciones + " lecciones prácticas  ·  " + (h === 1 ? "1 hora" : "unas " + h + " horas") + " de práctica  ·  de cero a nivel maestro", AN / 2, 890);

    // pie: fecha y verificación (izquierda), firma (centro), Cata (derecha)
    x.textAlign = "left"; x.fillStyle = C.navy; x.font = "600 30px Geist, sans-serif";
    x.fillText("Emitido el " + fechaLarga(cert.fecha), 170, 1150);
    x.fillStyle = C.tinta3; x.font = "500 28px 'Geist Mono', monospace";
    x.fillText("Código: " + cert.codigo, 170, 1198);

    // firma
    x.textAlign = "center";
    x.strokeStyle = C.navy; x.lineWidth = 2; x.beginPath(); x.moveTo(960, 1140); x.lineTo(1340, 1140); x.stroke();
    x.fillStyle = C.navy; x.font = "600 32px Montserrat, sans-serif"; x.fillText("Equipo Catappa", 1150, 1186);
    x.fillStyle = C.tinta3; x.font = "400 24px Geist, sans-serif"; x.fillText("Aprende lenguajes de programación", 1150, 1222);

    // verificación: línea propia, centrada abajo
    x.fillStyle = C.tinta3; x.font = "500 22px 'Geist Mono', monospace";
    x.fillText("Verifica este certificado en " + location.origin + "/#/certificado/" + cert.codigo, AN / 2 - 60, 1296);

    if (cata) { var hC = 300, wC = cata.width * hC / cata.height; x.drawImage(cata, AN - 170 - wC, AL - 150 - hC, wC, hC); }
    return cv;
  });
};

/* ---------------- página del certificado (pública: sirve para verificarlo) ---------------- */
F.vistaCertificado = function (prm) {
  var codigo = String(prm.codigo || "").toUpperCase();
  F.pintar('<div class="ancho"><div class="vacio">Cargando certificado…</div></div>');
  if (E.modo !== "servidor") {
    F.pintar('<div class="ancho"><div class="vacio"><b>Sin conexión con el servidor.</b> Los certificados se consultan en el servidor de Catappa.</div></div>');
    return;
  }
  F.api("GET", "/api/certificados/" + encodeURIComponent(codigo)).then(function (cert) {
    var curso = F.curso(cert.curso);
    var mio = E.perfil && E.perfil.usuario === cert.usuario;
    F.pintar(
      '<div class="ancho cert-pagina">' +
        '<div class="eyebrow"><b>~/certificado</b><span>' + F.esc(cert.codigo) + "</span></div>" +
        '<div class="cert-cab"><div><h1 class="titulo-pag">' + (mio ? "Tu certificado de " : "Certificado de ") + F.esc(cert.titulo) + "</h1>" +
        '<p class="subtitulo"><span class="badge ok">' + F.icono("check").replace("<svg", '<svg style="width:12px;height:12px"') + "Certificado válido</span> Emitido por Catappa a <b>" + F.esc(cert.nombre) + "</b>" +
        (cert.usuario ? ' (<a href="#/perfil/' + encodeURIComponent(cert.usuario) + '">@' + F.esc(cert.usuario) + "</a>)" : "") + " el " + F.esc(fechaLarga(cert.fecha)) + ".</p></div></div>" +
        '<div class="cert-lienzo" id="cert-lienzo"><div class="vacio">Generando…</div></div>' +
        '<div class="cert-acciones">' +
          '<a class="btn btn-primario" id="cert-png" download="catappa-certificado-' + F.esc(cert.curso) + '.png">' + F.icono("descargar") + "Descargar imagen</a>" +
          '<button class="btn" id="cert-pdf">' + F.icono("documento") + "Guardar como PDF / imprimir</button>" +
          '<button class="btn" id="cert-copiar">' + F.icono("comunidad") + "Copiar enlace de verificación</button>" +
          (curso ? '<a class="btn btn-suave" href="#/curso/' + curso.id + '">Ver el curso</a>' : "") +
        "</div>" +
      "</div>");
    F.dibujarCertificado(cert).then(function (cv) {
      var url = cv.toDataURL("image/png");
      $("#cert-lienzo").innerHTML = '<img src="' + url + '" alt="Certificado de finalización del curso ' + F.esc(cert.titulo) + " emitido a " + F.esc(cert.nombre) + '">';
      $("#cert-png").href = url;
    });
    $("#cert-pdf").addEventListener("click", function () { window.print(); });
    $("#cert-copiar").addEventListener("click", function () {
      var enlace = location.origin + "/#/certificado/" + cert.codigo;
      (navigator.clipboard ? navigator.clipboard.writeText(enlace) : Promise.reject()).then(function () { F.toast("Enlace copiado"); }, function () { F.toast(enlace); });
    });
  }).catch(function (e) {
    F.pintar('<div class="ancho"><div class="vacio"><b>' + F.esc(e.message || "No se encontró el certificado") + '</b><p style="margin-top:8px">Revisa que el código esté bien escrito (por ejemplo, CAT-1A2B-3C4D-5E6F).</p></div></div>');
  });
};

/* tarjetas de certificados (perfil) */
F.bloqueCertificados = function (lista, mio) {
  if (!lista || !lista.length) return '<div class="panel vacio">' + (mio ? "Completa un curso entero para conseguir tu primer certificado." : "Todavía no tiene certificados.") + "</div>";
  return '<div class="certs">' + lista.map(function (c) {
    var curso = F.curso(c.curso) || { titulo: c.titulo, glifo: "documento", color: "#179493" };
    return '<a class="cert-tarjeta" href="#/certificado/' + encodeURIComponent(c.codigo) + '">' + F.logoCurso(curso) +
      "<div><b>" + F.esc(c.titulo) + "</b><span>" + F.esc(fechaLarga(c.fecha)) + " · " + c.lecciones + " lecciones</span></div>" + F.icono("certificado") + "</a>";
  }).join("") + "</div>";
};
F.fechaLarga = fechaLarga;
})();
