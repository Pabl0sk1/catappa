/* =====================================================================
   CATAPPA — ejecución real de código
   El servidor escribe el código en una carpeta temporal y lo ejecuta con
   el intérprete correspondiente, con límite de tiempo, de salida y de
   ejecuciones a la vez. Al terminar borra la carpeta.
   Pensado para ejecutarse dentro del contenedor de Catappa, con un usuario
   sin privilegios: es tu propio código, en tu propia máquina.
   ===================================================================== */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const LIMITE_CODIGO = 64 * 1024;     // 64 KB de código
const LIMITE_SALIDA = 64 * 1024;     // 64 KB de salida
const MS_EJECUCION = 6000;           // 6 s de ejecución
const MS_COMPILACION = 20000;        // 20 s para compilar (Java)
const A_LA_VEZ = 3;                  // ejecuciones simultáneas

/* el mismo intérprete se llama distinto según el sistema */
function primero(candidatos, prueba, esperado) {
  for (const c of candidatos) {
    try {
      const r = spawnSync(c, prueba || ["--version"], { timeout: 12000, encoding: "utf8", shell: false });
      if (r.error || r.status !== 0) continue;
      const salida = (r.stdout || "") + (r.stderr || "");
      if (esperado && salida.indexOf(esperado) < 0) continue;   // en Windows, python3 es un acceso directo a la tienda
      return c;
    } catch (e) { /* siguiente */ }
  }
  return null;
}

const BIN = {
  node: primero(["node"]),
  python: primero(["python3", "python"], ["-c", "print(\"catappa\")"], "catappa"),
  php: primero(["php", "php83", "php82", "php81"]),
  java: primero(["java"]),
  javac: primero(["javac"]),
  bash: primero(["bash", "sh"], ["-c", "echo catappa"], "catappa"),
  sqlite: primero(["sqlite3"], ["-version"])
};

const LENGUAJES = {
  js:   { nombre: "JavaScript", fichero: "main.js",    bin: "node",   args: ["main.js"] },
  py:   { nombre: "Python",     fichero: "main.py",    bin: "python", args: ["main.py"] },
  php:  { nombre: "PHP",        fichero: "main.php",   bin: "php",    args: ["main.php"] },
  java: { nombre: "Java",       fichero: "Main.java",  bin: "java",   args: ["-Duser.language=en", "-Duser.country=US", "-cp", ".", "Main"], compilador: "javac", argsCompilar: ["Main.java"] },
  sh:   { nombre: "Terminal",   fichero: "main.sh",    bin: "bash",   args: ["main.sh"] },
  sql:  { nombre: "SQL",        fichero: "main.sql",   bin: "sqlite", args: ["-batch", "-noheader", "-list", ":memory:"], porEntrada: true }
};

/* qué lenguajes puede ejecutar este servidor ahora mismo */
function disponibles() {
  const out = {};
  for (const [id, l] of Object.entries(LENGUAJES)) {
    out[id] = { nombre: l.nombre, disponible: !!BIN[l.bin] && (!l.compilador || !!BIN[l.compilador]) };
  }
  return out;
}

let enCurso = 0;
const cola = [];
function turno() {
  return new Promise((ok) => {
    const intentar = () => {
      if (enCurso < A_LA_VEZ) { enCurso++; ok(() => { enCurso--; const s = cola.shift(); if (s) s(); }); }
      else cola.push(intentar);
    };
    intentar();
  });
}

function lanzar(bin, args, opciones) {
  return new Promise((ok) => {
    let salida = "", errores = "", cortada = false, matado = false;
    const p = spawn(bin, args, { cwd: opciones.dir, env: { PATH: process.env.PATH, HOME: opciones.dir, LANG: "C.UTF-8" }, shell: false });
    const reloj = setTimeout(() => { matado = true; p.kill("SIGKILL"); }, opciones.ms);
    const recoge = (buf, cual) => {
      const t = buf.toString();
      if ((salida.length + errores.length) > LIMITE_SALIDA) { cortada = true; return; }
      if (cual === 1) salida += t; else errores += t;
    };
    p.stdout.on("data", (b) => recoge(b, 1));
    p.stderr.on("data", (b) => recoge(b, 2));
    p.on("error", (e) => { clearTimeout(reloj); ok({ codigo: -1, salida, errores: errores + e.message, matado, cortada }); });
    p.on("close", (codigo) => { clearTimeout(reloj); ok({ codigo, salida, errores, matado, cortada }); });
    if (opciones.entrada) p.stdin.write(opciones.entrada);
    p.stdin.end();
  });
}

/* ejecuta código y devuelve { ok, salida, error, ms } */
async function ejecutar({ lenguaje, codigo, entrada }) {
  const l = LENGUAJES[lenguaje];
  if (!l) return { ok: false, error: "Lenguaje no soportado: " + lenguaje };
  if (!BIN[l.bin] || (l.compilador && !BIN[l.compilador])) return { ok: false, error: "Este servidor no tiene instalado " + l.nombre + "." };
  codigo = String(codigo == null ? "" : codigo);
  if (codigo.length > LIMITE_CODIGO) return { ok: false, error: "El código es demasiado largo (máximo 64 KB)." };
  entrada = String(entrada == null ? "" : entrada).slice(0, LIMITE_CODIGO);

  const libera = await turno();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "catappa-"));
  const t0 = Date.now();
  try {
    if (l.porEntrada) entrada = codigo + "\n" + entrada;            // SQL: el código entra por la entrada estándar
    else fs.writeFileSync(path.join(dir, l.fichero), codigo);

    if (l.compilador) {
      const c = await lanzar(BIN[l.compilador], l.argsCompilar, { dir, ms: MS_COMPILACION });
      if (c.matado) return { ok: false, error: "La compilación tardó demasiado.", ms: Date.now() - t0 };
      if (c.codigo !== 0) return { ok: false, salida: c.salida, error: (c.errores || "Error de compilación").trim(), compilacion: true, ms: Date.now() - t0 };
    }
    const r = await lanzar(BIN[l.bin], l.args, { dir, ms: MS_EJECUCION, entrada });
    const ms = Date.now() - t0;
    if (r.matado) return { ok: false, salida: r.salida, error: "Tiempo agotado: el programa tardó más de " + (MS_EJECUCION / 1000) + " segundos (¿un bucle infinito?).", ms };
    return {
      ok: r.codigo === 0,
      salida: r.salida.slice(0, LIMITE_SALIDA),
      error: r.errores.slice(0, LIMITE_SALIDA).trim(),
      codigoSalida: r.codigo,
      cortada: r.cortada,
      ms
    };
  } catch (e) {
    return { ok: false, error: "No se pudo ejecutar: " + e.message, ms: Date.now() - t0 };
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* ya no está */ }
    libera();
  }
}

/* comprueba la solución de un ejercicio contra sus casos de prueba */
async function corregir({ lenguaje, codigo, pruebas }) {
  const resultados = [];
  let pasadas = 0;
  for (const prueba of (pruebas || []).slice(0, 12)) {
    const r = await ejecutar({ lenguaje, codigo, entrada: prueba.entrada || "" });
    const obtenido = (r.salida || "").replace(/\r/g, "").trim();
    const esperado = String(prueba.salida == null ? "" : prueba.salida).replace(/\r/g, "").trim();
    const bien = r.ok && obtenido === esperado;
    if (bien) pasadas++;
    resultados.push({
      nombre: prueba.nombre || "", entrada: prueba.entrada || "", esperado, obtenido,
      error: r.error || "", bien, oculta: !!prueba.oculta
    });
    if (!r.ok && r.error && !r.salida) break;   // error de compilación o de ejecución: no seguir
  }
  return { pasadas, total: (pruebas || []).length, todo: pasadas === (pruebas || []).length && pasadas > 0, resultados };
}

module.exports = { ejecutar, corregir, disponibles, LENGUAJES };
