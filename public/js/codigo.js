/* =====================================================================
   CATAPPA — código real: editor, ejecución y Playground
   El código se ejecuta de verdad en el servidor (Node, Python, PHP, Java,
   SQL o terminal) y vuelve con su salida. Los ejercicios se corrigen con
   casos de prueba; los ocultos solo dicen si pasaron.
   ===================================================================== */
(function () {
"use strict";
var F = window.F, E = F.E, $ = F.$;

F.LENGUAJES = {
  js: { nombre: "JavaScript", ext: "js", ejemplo: "console.log(\"Hola, Catappa\");" },
  py: { nombre: "Python", ext: "py", ejemplo: "print(\"Hola, Catappa\")" },
  php: { nombre: "PHP", ext: "php", ejemplo: "<?php\necho \"Hola, Catappa\";" },
  java: { nombre: "Java", ext: "java", ejemplo: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hola, Catappa\");\n    }\n}" },
  sh: { nombre: "Terminal (bash)", ext: "sh", ejemplo: "echo \"Hola, Catappa\"\nls -la" },
  sql: { nombre: "SQL (SQLite)", ext: "sql", ejemplo: "CREATE TABLE tareas(id INTEGER, titulo TEXT);\nINSERT INTO tareas VALUES (1, 'Aprender SQL');\nSELECT * FROM tareas;" }
};

/* ---------------- editor sencillo: números de línea, tabulador y sangría ---------------- */
F.editorCodigo = function (opciones) {
  opciones = opciones || {};
  var env = document.createElement("div");
  env.className = "editor" + (opciones.clase ? " " + opciones.clase : "");
  env.innerHTML = '<div class="editor-cab"><span class="editor-leng"></span><span class="editor-ayuda">Tab para sangrar · Ctrl+Enter para ejecutar</span></div>' +
    '<div class="editor-cuerpo"><pre class="editor-lineas" aria-hidden="true"></pre><textarea class="editor-area" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off"></textarea></div>';
  var area = env.querySelector(".editor-area"), lineas = env.querySelector(".editor-lineas");
  env.querySelector(".editor-leng").textContent = (F.LENGUAJES[opciones.lenguaje] || {}).nombre || "";
  area.value = opciones.valor || "";
  if (opciones.etiqueta) area.setAttribute("aria-label", opciones.etiqueta);

  function pintarLineas() {
    var n = area.value.split("\n").length, txt = "";
    for (var i = 1; i <= n; i++) txt += i + "\n";
    lineas.textContent = txt;
    lineas.scrollTop = area.scrollTop;
  }
  area.addEventListener("input", pintarLineas);
  area.addEventListener("scroll", function () { lineas.scrollTop = area.scrollTop; });
  area.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {                      // tabulador: sangra en vez de cambiar de campo
      e.preventDefault();
      var i = area.selectionStart, f = area.selectionEnd;
      area.value = area.value.slice(0, i) + "    " + area.value.slice(f);
      area.selectionStart = area.selectionEnd = i + 4;
      pintarLineas();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (opciones.alEjecutar) opciones.alEjecutar();
    }
  });
  pintarLineas();
  return {
    el: env,
    valor: function () { return area.value; },
    poner: function (v) { area.value = v; pintarLineas(); },
    foco: function () { area.focus(); }
  };
};

/* ---------------- ejecutar en el servidor ---------------- */
F.ejecutarCodigo = function (lenguaje, codigo, entrada) {
  if (E.modo !== "servidor") return Promise.reject(new Error("Para ejecutar código hace falta el servidor de Catappa (docker compose up -d)."));
  return F.api("POST", "/api/ejecutar", { lenguaje: lenguaje, codigo: codigo, entrada: entrada || "" });
};
F.corregirEjercicio = function (cursoId, leccionId, paso, codigo) {
  return F.api("POST", "/api/ejercicio", { cursoId: cursoId, leccionId: leccionId, paso: paso, codigo: codigo });
};

/* pinta el resultado de una ejecución en un panel de salida */
F.pintarSalida = function (cont, r) {
  if (!cont) return;
  var partes = [];
  if (r.salida) partes.push('<pre class="salida-ok">' + F.esc(r.salida) + "</pre>");
  if (r.error) partes.push('<pre class="salida-error">' + F.esc(r.error) + "</pre>");
  if (!r.salida && !r.error) partes.push('<p class="salida-vacia">El programa no imprimió nada.</p>');
  if (r.cortada) partes.push('<p class="salida-vacia">(salida recortada)</p>');
  if (r.ms != null) partes.push('<p class="salida-ms">' + r.ms + " ms</p>");
  cont.innerHTML = partes.join("");
};

/* ---------------- Playground ---------------- */
F.vistaPlayground = function (prm) {
  var leng = prm.query && prm.query.get("l");
  if (!F.LENGUAJES[leng]) leng = F.leerLocal("catappa-play-leng", "js");
  var guardados = F.leerLocal("catappa-play-codigos", {});
  var codigo = guardados[leng] != null ? guardados[leng] : F.LENGUAJES[leng].ejemplo;

  F.pintar(
    '<div class="ancho">' +
      '<div class="eyebrow"><b>~/playground</b><span>ejecuta código de verdad</span></div>' +
      '<div class="play-cab"><h1 class="titulo-pag">Playground</h1>' +
        '<div class="play-lengs" id="play-lengs">' + Object.keys(F.LENGUAJES).map(function (k) {
          return '<button class="btn btn-suave' + (k === leng ? " activo" : "") + '" data-l="' + k + '">' + F.esc(F.LENGUAJES[k].nombre) + "</button>";
        }).join("") + "</div></div>" +
      '<p class="subtitulo">Escribe código y pulsa Ejecutar: corre de verdad en el servidor de Catappa y te devuelve su salida. Lo que escribas se guarda en este navegador.</p>' +
      '<div class="play-rejilla">' +
        '<div id="play-editor"></div>' +
        '<div class="play-lado">' +
          '<label class="play-etiqueta" for="play-entrada">Entrada (lo que el programa lee por teclado)</label>' +
          '<textarea id="play-entrada" class="entrada" rows="3" spellcheck="false"></textarea>' +
          '<div class="play-acciones"><button class="btn btn-primario" id="play-run">' + F.icono("play") + "Ejecutar</button>" +
            '<button class="btn" id="play-limpiar">Reiniciar ejemplo</button></div>' +
          '<div class="play-salida" id="play-salida"><p class="salida-vacia">Aquí aparecerá la salida.</p></div>' +
        "</div>" +
      "</div>" +
    "</div>");

  var ed = F.editorCodigo({ lenguaje: leng, valor: codigo, etiqueta: "Editor de código", alEjecutar: ejecutar });
  $("#play-editor").appendChild(ed.el);

  function ejecutar() {
    var salida = $("#play-salida");
    salida.innerHTML = '<p class="salida-vacia">Ejecutando…</p>';
    var g = F.leerLocal("catappa-play-codigos", {}); g[leng] = ed.valor(); F.guardarLocal("catappa-play-codigos", g);
    F.ejecutarCodigo(leng, ed.valor(), $("#play-entrada").value)
      .then(function (r) { F.pintarSalida(salida, r); F.sonido.tocar(r.ok ? "acierto" : "error"); })
      .catch(function (e) { salida.innerHTML = '<pre class="salida-error">' + F.esc(e.message) + "</pre>"; });
  }
  $("#play-run").addEventListener("click", ejecutar);
  $("#play-limpiar").addEventListener("click", function () { ed.poner(F.LENGUAJES[leng].ejemplo); });
  F.$$("#play-lengs button").forEach(function (b) {
    b.addEventListener("click", function () {
      F.guardarLocal("catappa-play-leng", b.dataset.l);
      F.ir("/playground?l=" + b.dataset.l);
    });
  });
  ed.foco();
};
})();
