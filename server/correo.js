/* =====================================================================
   CATAPPA — envío de correo
   Cliente SMTP mínimo, sin dependencias: lo justo para mandar códigos de
   verificación y de recuperación de contraseña.

   Se configura con variables de entorno:
     CATAPPA_SMTP_HOST      servidor (por ejemplo smtp.gmail.com)
     CATAPPA_SMTP_PUERTO    465 (TLS directo) o 587 (STARTTLS). Por defecto 587
     CATAPPA_SMTP_USUARIO   usuario
     CATAPPA_SMTP_CLAVE     contraseña (en Gmail, una contraseña de aplicación)
     CATAPPA_SMTP_DESDE     remitente; por defecto el usuario
     CATAPPA_SMTP_INSEGURO  "1" para aceptar certificados no verificados

   Si no hay servidor configurado funciona en MODO LOCAL: el mensaje se
   guarda en datos/correos/ y el código se devuelve a la propia interfaz,
   para que la plataforma siga siendo usable en una máquina personal sin
   configurar nada. En ese modo se avisa por pantalla de que es local.
   ===================================================================== */
"use strict";
const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");

const CFG = {
  host: process.env.CATAPPA_SMTP_HOST || "",
  puerto: Number(process.env.CATAPPA_SMTP_PUERTO || 587),
  usuario: process.env.CATAPPA_SMTP_USUARIO || "",
  clave: process.env.CATAPPA_SMTP_CLAVE || "",
  desde: process.env.CATAPPA_SMTP_DESDE || process.env.CATAPPA_SMTP_USUARIO || "catappa@localhost",
  inseguro: process.env.CATAPPA_SMTP_INSEGURO === "1"
};

const hayServidor = () => !!CFG.host;

/* ---------- diálogo SMTP ---------- */
function conversar(socket, pasos) {
  return new Promise((resolve, reject) => {
    let buffer = "", i = 0, esperando = null, cerrado = false;
    const limpiar = () => { socket.removeListener("data", alLlegar); };
    const fallar = e => { if (!cerrado) { cerrado = true; limpiar(); reject(e); } };

    function alLlegar(trozo) {
      buffer += trozo.toString("utf8");
      // una respuesta termina cuando la última línea lleva espacio tras el código (250 x) y no guion (250-x)
      const lineas = buffer.split(/\r?\n/).filter(Boolean);
      const ultima = lineas[lineas.length - 1] || "";
      if (!/^\d{3} /.test(ultima)) return;
      const respuesta = buffer; buffer = "";
      const codigo = Number(ultima.slice(0, 3));
      if (esperando) { const f = esperando; esperando = null; f({ codigo, respuesta }); }
    }
    const leer = () => new Promise(r => { esperando = r; });

    socket.on("data", alLlegar);
    socket.on("error", fallar);
    socket.on("close", () => { if (!cerrado) fallar(new Error("El servidor de correo cerró la conexión.")); });

    (async () => {
      try {
        let r = await leer();                                   // saludo del servidor
        if (r.codigo !== 220) throw new Error("Respuesta inesperada del servidor: " + r.respuesta.trim());
        for (const paso of pasos) {
          const linea = typeof paso.enviar === "function" ? paso.enviar() : paso.enviar;
          if (linea !== null) socket.write(linea + "\r\n");
          if (paso.sinRespuesta) continue;
          r = await leer();
          if (paso.espera && !paso.espera.includes(r.codigo)) {
            throw new Error("SMTP " + r.codigo + ": " + r.respuesta.trim().split(/\r?\n/).pop());
          }
          if (paso.alRecibir) paso.alRecibir(r);
        }
        cerrado = true; limpiar(); resolve();
      } catch (e) { fallar(e); }
    })();
  });
}

function cuerpoMensaje({ para, asunto, texto }) {
  const b64 = s => Buffer.from(s, "utf8").toString("base64");
  const cabeceras = [
    "From: Catappa <" + CFG.desde + ">",
    "To: " + para,
    "Subject: =?UTF-8?B?" + b64(asunto) + "?=",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "Date: " + new Date().toUTCString()
  ].join("\r\n");
  // base64 en líneas de 76 caracteres, como manda el formato
  const cuerpo = b64(texto).replace(/(.{1,76})/g, "$1\r\n");
  return cabeceras + "\r\n\r\n" + cuerpo;
}

async function enviarSMTP({ para, asunto, texto }) {
  const conectar = () => new Promise((resolve, reject) => {
    const opciones = { host: CFG.host, port: CFG.puerto, rejectUnauthorized: !CFG.inseguro, servername: CFG.host };
    const s = CFG.puerto === 465 ? tls.connect(opciones, () => resolve(s)) : net.connect(opciones, () => resolve(s));
    s.setTimeout(15000, () => { s.destroy(new Error("El servidor de correo no responde.")); });
    s.once("error", reject);
  });

  let socket = await conectar();
  const b64 = s => Buffer.from(s, "utf8").toString("base64");

  if (CFG.puerto !== 465) {
    // STARTTLS: saludo, subida a TLS y saludo otra vez
    await conversar(socket, [
      { enviar: "EHLO catappa", espera: [250] },
      { enviar: "STARTTLS", espera: [220] }
    ]);
    socket = await new Promise((resolve, reject) => {
      const seguro = tls.connect({ socket, servername: CFG.host, rejectUnauthorized: !CFG.inseguro }, () => resolve(seguro));
      seguro.once("error", reject);
    });
    // tras STARTTLS el servidor no vuelve a saludar: se simula para reutilizar el diálogo
    await new Promise((resolve, reject) => {
      socket.write("EHLO catappa\r\n");
      let acumulado = "";
      const alLlegar = d => {
        acumulado += d.toString("utf8");
        const ultima = acumulado.split(/\r?\n/).filter(Boolean).pop() || "";
        if (!/^\d{3} /.test(ultima)) return;
        socket.removeListener("data", alLlegar);
        Number(ultima.slice(0, 3)) === 250 ? resolve() : reject(new Error("EHLO rechazado: " + acumulado.trim()));
      };
      socket.on("data", alLlegar);
      socket.once("error", reject);
    });
    await dialogoEnvio(socket, { para, asunto, texto }, true);
    return;
  }

  await conversar(socket, [
    { enviar: "EHLO catappa", espera: [250] },
    ...pasosAutenticar(b64),
    ...pasosEnviar({ para, asunto, texto })
  ]);
  socket.end();
}

function pasosAutenticar(b64) {
  if (!CFG.usuario) return [];
  return [
    { enviar: "AUTH LOGIN", espera: [334] },
    { enviar: () => b64(CFG.usuario), espera: [334] },
    { enviar: () => b64(CFG.clave), espera: [235] }
  ];
}
function pasosEnviar({ para, asunto, texto }) {
  return [
    { enviar: "MAIL FROM:<" + CFG.desde + ">", espera: [250] },
    { enviar: "RCPT TO:<" + para + ">", espera: [250, 251] },
    { enviar: "DATA", espera: [354] },
    { enviar: () => cuerpoMensaje({ para, asunto, texto }) + "\r\n.", espera: [250] },
    { enviar: "QUIT", sinRespuesta: true }
  ];
}
/* tras STARTTLS el saludo ya está hecho: solo queda autenticar y enviar */
async function dialogoEnvio(socket, mensaje) {
  const b64 = s => Buffer.from(s, "utf8").toString("base64");
  await new Promise((resolve, reject) => {
    let buffer = "", esperando = null;
    const alLlegar = d => {
      buffer += d.toString("utf8");
      const ultima = buffer.split(/\r?\n/).filter(Boolean).pop() || "";
      if (!/^\d{3} /.test(ultima)) return;
      const r = { codigo: Number(ultima.slice(0, 3)), respuesta: buffer }; buffer = "";
      if (esperando) { const f = esperando; esperando = null; f(r); }
    };
    socket.on("data", alLlegar);
    socket.once("error", reject);
    const leer = () => new Promise(r => { esperando = r; });
    (async () => {
      try {
        for (const paso of [...pasosAutenticar(b64), ...pasosEnviar(mensaje)]) {
          const linea = typeof paso.enviar === "function" ? paso.enviar() : paso.enviar;
          socket.write(linea + "\r\n");
          if (paso.sinRespuesta) continue;
          const r = await leer();
          if (paso.espera && !paso.espera.includes(r.codigo)) throw new Error("SMTP " + r.codigo + ": " + r.respuesta.trim().split(/\r?\n/).pop());
        }
        socket.end(); resolve();
      } catch (e) { reject(e); }
    })();
  });
}

/* ---------- modo local ---------- */
function guardarLocal(dir, { para, asunto, texto }) {
  try {
    const carpeta = path.join(dir, "correos");
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });
    const nombre = new Date().toISOString().replace(/[:.]/g, "-") + "_" + para.replace(/[^a-z0-9@._-]/gi, "") + ".txt";
    fs.writeFileSync(path.join(carpeta, nombre), "Para: " + para + "\nAsunto: " + asunto + "\n\n" + texto + "\n");
    return path.join("correos", nombre);
  } catch (e) { return null; }
}

/* ---------- lo que usa el servidor ---------- */
async function enviar({ para, asunto, texto, dirDatos }) {
  if (!hayServidor()) {
    const fichero = guardarLocal(dirDatos || ".", { para, asunto, texto });
    console.log("[correo] sin SMTP configurado; guardado en " + (fichero || "(no se pudo guardar)"));
    return { enviado: false, local: true, fichero };
  }
  await enviarSMTP({ para, asunto, texto });
  return { enviado: true, local: false };
}

module.exports = { enviar, hayServidor, config: () => ({ host: CFG.host, puerto: CFG.puerto, desde: CFG.desde }) };
