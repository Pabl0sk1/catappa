/* =====================================================================
   CATAPPA — cuenta
   Todo lo que rodea a la cuenta: países con bandera, foto de perfil,
   correo verificado por código, contraseña, cerrar sesión y borrar la
   cuenta. Cada acción delicada pasa por un diálogo que pide confirmación.
   ===================================================================== */
(function () {
"use strict";
var F = window.F, E = F.E, $ = F.$;

/* ---------------- países ---------------- */
F.PAISES = [
  ["ar", "Argentina"], ["bo", "Bolivia"], ["br", "Brasil"], ["ca", "Canadá"], ["cl", "Chile"], ["co", "Colombia"],
  ["cr", "Costa Rica"], ["cu", "Cuba"], ["do", "República Dominicana"], ["ec", "Ecuador"], ["sv", "El Salvador"],
  ["gt", "Guatemala"], ["hn", "Honduras"], ["mx", "México"], ["ni", "Nicaragua"], ["pa", "Panamá"], ["py", "Paraguay"],
  ["pe", "Perú"], ["pr", "Puerto Rico"], ["us", "Estados Unidos"], ["uy", "Uruguay"], ["ve", "Venezuela"],
  ["de", "Alemania"], ["at", "Austria"], ["be", "Bélgica"], ["bg", "Bulgaria"], ["cz", "Chequia"], ["hr", "Croacia"],
  ["dk", "Dinamarca"], ["sk", "Eslovaquia"], ["si", "Eslovenia"], ["es", "España"], ["ee", "Estonia"], ["fi", "Finlandia"],
  ["fr", "Francia"], ["gr", "Grecia"], ["hu", "Hungría"], ["ie", "Irlanda"], ["it", "Italia"], ["lv", "Letonia"],
  ["lt", "Lituania"], ["lu", "Luxemburgo"], ["no", "Noruega"], ["nl", "Países Bajos"], ["pl", "Polonia"], ["pt", "Portugal"],
  ["gb", "Reino Unido"], ["ro", "Rumanía"], ["rs", "Serbia"], ["se", "Suecia"], ["ch", "Suiza"], ["ua", "Ucrania"],
  ["tr", "Turquía"], ["is", "Islandia"], ["mt", "Malta"], ["cy", "Chipre"], ["al", "Albania"], ["ba", "Bosnia y Herzegovina"],
  ["me", "Montenegro"], ["mk", "Macedonia del Norte"], ["md", "Moldavia"], ["by", "Bielorrusia"], ["ru", "Rusia"],
  ["ma", "Marruecos"], ["dz", "Argelia"], ["tn", "Túnez"], ["eg", "Egipto"], ["za", "Sudáfrica"], ["ng", "Nigeria"],
  ["ke", "Kenia"], ["gh", "Ghana"], ["et", "Etiopía"], ["ao", "Angola"], ["mz", "Mozambique"], ["sn", "Senegal"],
  ["ci", "Costa de Marfil"], ["cm", "Camerún"], ["gq", "Guinea Ecuatorial"], ["il", "Israel"], ["ae", "Emiratos Árabes Unidos"],
  ["sa", "Arabia Saudí"], ["qa", "Catar"], ["cn", "China"], ["jp", "Japón"], ["kr", "Corea del Sur"], ["in", "India"],
  ["id", "Indonesia"], ["ph", "Filipinas"], ["vn", "Vietnam"], ["th", "Tailandia"], ["my", "Malasia"], ["sg", "Singapur"],
  ["pk", "Pakistán"], ["bd", "Bangladés"], ["lk", "Sri Lanka"], ["np", "Nepal"], ["kz", "Kazajistán"], ["au", "Australia"],
  ["nz", "Nueva Zelanda"], ["tw", "Taiwán"], ["hk", "Hong Kong"]
];
F.nombrePais = function (codigo) {
  var p = F.PAISES.filter(function (x) { return x[0] === codigo; })[0];
  return p ? p[1] : "";
};
F.bandera = function (codigo, alto) {
  if (!codigo) return "";
  return '<img class="bandera" src="img/banderas/' + F.esc(codigo) + '.svg" alt="' + F.esc(F.nombrePais(codigo)) +
    '" width="' + Math.round((alto || 14) * 4 / 3) + '" height="' + (alto || 14) + '" loading="lazy">';
};

/* ---------------- avatar ---------------- */
/* el avatar es la foto si la hay; si no, las iniciales sobre el color elegido */
F.avatarHTML = function (perfil, tam, clase) {
  var t = tam || 40;
  var estilo = 'style="width:' + t + "px;height:" + t + "px;font-size:" + Math.round(t * 0.38) + 'px"';
  if (perfil && perfil.avatar) {
    return '<img class="avatar foto ' + (clase || "") + '" src="' + F.esc(perfil.avatar) + '" alt="" ' + estilo + ">";
  }
  var iniciales = String((perfil && perfil.nombre) || (perfil && perfil.usuario) || "?").trim().split(/\s+/)
    .slice(0, 2).map(function (x) { return x[0]; }).join("").toUpperCase();
  return '<span class="avatar ' + (clase || "") + '" ' + estilo.slice(0, -1) + ";background:" + F.esc((perfil && perfil.color) || "#179493") + '">' + F.esc(iniciales) + "</span>";
};

/* reduce la imagen antes de mandarla: 256px de lado y JPEG, para que no viaje un mamotreto */
function reducirImagen(archivo) {
  return new Promise(function (resolve, reject) {
    if (!/^image\/(png|jpeg|webp)$/.test(archivo.type)) return reject(new Error("Tiene que ser una imagen PNG, JPG o WEBP."));
    if (archivo.size > 8 * 1024 * 1024) return reject(new Error("Esa imagen pesa demasiado (máximo 8 MB)."));
    var lector = new FileReader();
    lector.onerror = function () { reject(new Error("No se ha podido leer el archivo.")); };
    lector.onload = function () {
      var img = new Image();
      img.onerror = function () { reject(new Error("Ese archivo no parece una imagen.")); };
      img.onload = function () {
        var L = 256;
        var lado = Math.min(img.width, img.height);
        var cx = (img.width - lado) / 2, cy = (img.height - lado) / 2;
        var c = document.createElement("canvas");
        c.width = L; c.height = L;
        var ctx = c.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, cx, cy, lado, lado, 0, 0, L, L);
        resolve(c.toDataURL("image/jpeg", 0.88));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}
F.reducirImagen = reducirImagen;

/* ---------------- diálogos ---------------- */
function campo(id, etiqueta, tipo, extra) {
  return '<div class="campo"><label for="' + id + '">' + etiqueta + '</label><input class="entrada" id="' + id + '" type="' + (tipo || "text") + '" ' + (extra || "") + "></div>";
}
function pintarError(m, texto) {
  var e = m.el.querySelector(".error-form");
  if (!e) return;
  e.textContent = texto; e.hidden = !texto;
}

/* correo: pedir código, y solo guardarlo cuando se confirma */
F.dialogoCorreo = function (alTerminar) {
  var actual = (E.perfil && E.perfil.correo) || "";
  var m = F.modal(actual ? "Cambiar tu correo" : "Añadir tu correo",
    "<p>Te mandamos un código de seis cifras. El correo no se guarda hasta que lo confirmes.</p>" +
    "<p class=\"nota-suave\">Sirve para recuperar la contraseña si la olvidas. Es opcional.</p>" +
    campo("c-correo", "Correo electrónico", "email", 'autocomplete="email" inputmode="email" value="' + F.esc(actual) + '"') +
    '<div id="c-paso2" hidden>' + campo("c-codigo", "Código recibido", "text", 'inputmode="numeric" maxlength="6" autocomplete="one-time-code"') +
      '<p class="nota-suave" id="c-local" hidden></p></div>' +
    '<p class="error-form" hidden></p>',
    '<button class="btn btn-suave" data-cerrar>Cancelar</button><button class="btn btn-primario" id="c-ok">Enviar código</button>');
  var paso = 1;
  var correoEnUso = F.vigilarDisponible(m.el.querySelector("#c-correo"), "correo", actual);
  m.el.querySelector("#c-ok").addEventListener("click", function () {
    var b = this; pintarError(m, "");
    if (paso === 1 && correoEnUso()) { pintarError(m, correoEnUso()); return; }
    b.disabled = true;
    if (paso === 1) {
      var dir = m.el.querySelector("#c-correo").value.trim();
      F.api("POST", "/api/correo/codigo", { correo: dir }).then(function (d) {
        paso = 2;
        m.el.querySelector("#c-paso2").hidden = false;
        m.el.querySelector("#c-correo").disabled = true;
        b.textContent = "Confirmar"; b.disabled = false;
        m.el.querySelector("#c-codigo").focus();
        if (d.local) {
          var n = m.el.querySelector("#c-local");
          n.innerHTML = "Este servidor no tiene correo configurado, así que el código es: <b>" + F.esc(d.codigo) + "</b>";
          n.hidden = false;
        } else if (!d.enviado) {
          pintarError(m, "No se ha podido enviar el correo" + (d.error ? " (" + d.error + ")" : "") + ".");
        } else {
          F.toast("Código enviado a " + dir);
        }
      }).catch(function (e) { pintarError(m, e.message); b.disabled = false; });
      return;
    }
    F.api("POST", "/api/correo/verificar", { codigo: m.el.querySelector("#c-codigo").value.trim() }).then(function (d) {
      E.perfil = d.perfil; F.guardarSesionCache();
      m.cerrar(); F.toast("Correo confirmado");
      if (alTerminar) alTerminar();
    }).catch(function (e) { pintarError(m, e.message); b.disabled = false; });
  });
};

F.dialogoQuitarCorreo = function (alTerminar) {
  var m = F.modal("Quitar el correo",
    "<p>Tu cuenta dejará de tener correo asociado. Seguirás entrando con tu usuario y contraseña, pero <b>no podrás recuperarla</b> si la olvidas.</p>" +
    '<p class="error-form" hidden></p>',
    '<button class="btn btn-suave" data-cerrar>Cancelar</button><button class="btn btn-peligro" id="q-ok">Quitar el correo</button>');
  m.el.querySelector("#q-ok").addEventListener("click", function () {
    var b = this; b.disabled = true;
    F.api("POST", "/api/correo/quitar", {}).then(function (d) {
      E.perfil = d.perfil; F.guardarSesionCache();
      m.cerrar(); F.toast("Correo desvinculado");
      if (alTerminar) alTerminar();
    }).catch(function (e) { pintarError(m, e.message); b.disabled = false; });
  });
};

F.dialogoClave = function () {
  var m = F.modal("Cambiar la contraseña",
    campo("k-actual", "Contraseña actual", "password", 'autocomplete="current-password"') +
    campo("k-nueva", "Contraseña nueva", "password", 'autocomplete="new-password" minlength="6"') +
    campo("k-nueva2", "Repite la nueva", "password", 'autocomplete="new-password" minlength="6"') +
    '<p class="error-form" hidden></p>',
    '<button class="btn btn-suave" data-cerrar>Cancelar</button><button class="btn btn-primario" id="k-ok">Guardar</button>');
  F.mejorarClaves(m.el);
  m.el.querySelector("#k-ok").addEventListener("click", function () {
    var b = this; b.disabled = true; pintarError(m, "");
    F.api("POST", "/api/clave/cambiar", {
      actual: m.el.querySelector("#k-actual").value,
      nueva: m.el.querySelector("#k-nueva").value,
      nueva2: m.el.querySelector("#k-nueva2").value
    }).then(function () {
      m.cerrar(); F.toast("Contraseña cambiada");
    }).catch(function (e) { pintarError(m, e.message); b.disabled = false; });
  });
};

F.dialogoBorrarCuenta = function () {
  var u = (E.perfil && E.perfil.usuario) || "";
  var m = F.modal("Borrar tu cuenta",
    "<p>Esto borra <b>para siempre</b> tu progreso, tus certificados, tus proyectos y tus mensajes de la comunidad. Tu correo queda desvinculado. No se puede deshacer.</p>" +
    campo("b-clave", "Tu contraseña", "password", 'autocomplete="current-password"') +
    campo("b-conf", "Escribe <b>" + F.esc(u) + "</b> para confirmar", "text", 'autocapitalize="off" spellcheck="false"') +
    '<p class="error-form" hidden></p>',
    '<button class="btn btn-suave" data-cerrar>Cancelar</button><button class="btn btn-peligro" id="b-ok" disabled>Borrar mi cuenta</button>');
  F.mejorarClaves(m.el);
  var conf = m.el.querySelector("#b-conf"), boton = m.el.querySelector("#b-ok");
  conf.addEventListener("input", function () { boton.disabled = conf.value.trim().toLowerCase() !== u; });
  boton.addEventListener("click", function () {
    boton.disabled = true; pintarError(m, "");
    F.api("POST", "/api/cuenta/borrar", { clave: m.el.querySelector("#b-clave").value, confirmacion: conf.value.trim() })
      .then(function () {
        m.cerrar();
        F.cerrarSesion(true);
        F.toast("Cuenta borrada. Hasta otra.");
      }).catch(function (e) { pintarError(m, e.message); boton.disabled = false; });
  });
};

/* cerrar sesión: siempre con confirmación, y con un diálogo, no con un alert del navegador */
F.dialogoSalir = function () {
  var nombre = (E.perfil && E.perfil.nombre) ? E.perfil.nombre.split(" ")[0] : "";
  var m = F.modal("Cerrar sesión",
    "<p>" + (nombre ? "Hasta luego, " + F.esc(nombre) + ". " : "") + "Tu progreso queda guardado en tu cuenta.</p>",
    '<button class="btn btn-suave" data-cerrar>Seguir aquí</button><button class="btn btn-primario" id="s-ok">Cerrar sesión</button>');
  var b = m.el.querySelector("#s-ok");
  b.addEventListener("click", function () { b.disabled = true; m.cerrar(); F.cerrarSesion(); });
  setTimeout(function () { b.focus(); }, 40);
};

/* selector de país con bandera y buscador */
F.dialogoPais = function (alElegir) {
  var actual = (E.perfil && E.perfil.pais) || "";
  var m = F.modal("¿De dónde eres?",
    '<div class="campo"><input class="entrada" id="p-buscar" placeholder="Busca tu país" autocomplete="off"></div>' +
    '<div class="paises" id="p-lista"></div>' +
    (actual ? '<div class="modal-quitar"><button class="btn btn-suave" id="p-quitar">Quitar el país</button></div>' : ""));
  var lista = m.el.querySelector("#p-lista");
  function pintar(filtro) {
    var f = (filtro || "").toLowerCase();
    lista.innerHTML = F.PAISES.filter(function (p) { return !f || p[1].toLowerCase().indexOf(f) >= 0; })
      .map(function (p) {
        return '<button class="pais-op' + (p[0] === actual ? " sel" : "") + '" data-pais="' + p[0] + '">' +
          F.bandera(p[0], 18) + "<span>" + F.esc(p[1]) + "</span></button>";
      }).join("") || '<p class="nota-suave">No hay ningún país con ese nombre.</p>';
    F.$$("[data-pais]", lista).forEach(function (b) {
      b.addEventListener("click", function () { m.cerrar(); alElegir(b.dataset.pais); });
    });
  }
  pintar("");
  m.el.querySelector("#p-buscar").addEventListener("input", function () { pintar(this.value); });
  var q = m.el.querySelector("#p-quitar");
  if (q) q.addEventListener("click", function () { m.cerrar(); alElegir(""); });
  setTimeout(function () { m.el.querySelector("#p-buscar").focus(); }, 40);
};
})();
