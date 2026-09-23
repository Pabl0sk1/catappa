#!/usr/bin/env node
"use strict";
/* =====================================================================
   Genera public/cursos/_indice.js a partir del contenido de los cursos.
   El índice lleva la estructura (unidades, lecciones, número de pasos)
   pero no los pasos: así la app arranca rápido aunque haya muchos cursos,
   y el contenido completo de un curso se descarga solo al abrirlo.

   Uso:  node server/indice.js
   (el Dockerfile lo ejecuta en cada build)
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = path.join(__dirname, "..", "public", "cursos");
const ficheros = fs.readdirSync(DIR).filter(f => /^[a-z0-9-]+-u\d+\.js$/.test(f))
  .sort((a, b) => {
    const [ca, na] = [a.replace(/-u\d+\.js$/, ""), +a.match(/-u(\d+)\.js$/)[1]];
    const [cb, nb] = [b.replace(/-u\d+\.js$/, ""), +b.match(/-u(\d+)\.js$/)[1]];
    return ca === cb ? na - nb : ca.localeCompare(cb);
  });

const ctx = vm.createContext({});
ctx.window = ctx;
const indice = {};
const errores = [];

for (const f of ficheros) {
  const antes = {};
  for (const k of Object.keys(ctx.CURSOS || {})) antes[k] = ctx.CURSOS[k].length;
  try { vm.runInContext(fs.readFileSync(path.join(DIR, f), "utf8"), ctx, { filename: f }); }
  catch (e) { errores.push(f + ": " + e.message); continue; }
  for (const [cid, unidades] of Object.entries(ctx.CURSOS)) {
    for (let i = antes[cid] || 0; i < unidades.length; i++) {
      const u = unidades[i];
      (indice[cid] = indice[cid] || { ficheros: [], unidades: [] });
      if (!indice[cid].ficheros.includes(f)) indice[cid].ficheros.push(f);
      indice[cid].unidades.push({
        titulo: u.titulo, resumen: u.resumen || "", color: u.color || null, nivel: u.nivel || null, fichero: f,
        lecciones: u.lecciones.map(l => ({ id: l.id, titulo: l.titulo, npasos: l.pasos.length, claves: l.claves || [] }))
      });
    }
  }
}

if (errores.length) { console.error("ERRORES:\n" + errores.join("\n")); process.exit(1); }

const salida = "/* Generado por server/indice.js — no editar a mano */\nwindow.CURSOS_INDICE = " + JSON.stringify(indice) + ";\n";
fs.writeFileSync(path.join(DIR, "_indice.js"), salida);
let totL = 0, totP = 0;
for (const [cid, c] of Object.entries(indice)) {
  const l = c.unidades.reduce((a, u) => a + u.lecciones.length, 0);
  const p = c.unidades.reduce((a, u) => a + u.lecciones.reduce((b, x) => b + x.npasos, 0), 0);
  totL += l; totP += p;
  console.log(cid.padEnd(12), String(c.unidades.length).padStart(3), "unidades", String(l).padStart(4), "lecciones", String(p).padStart(5), "pasos");
}
console.log("TOTAL".padEnd(12), "    ", "        ", String(totL).padStart(4), "lecciones", String(totP).padStart(5), "pasos   ->", (salida.length / 1024).toFixed(0) + " KB de índice");

/* versión del service worker = hash de todos los ficheros públicos */
const crypto = require("crypto");
const PUB = path.join(__dirname, "..", "public");
const hash = crypto.createHash("sha1");
(function recorrer(dir) {
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) recorrer(p);
    else if (f !== "sw.js") { hash.update(path.relative(PUB, p)); hash.update(fs.readFileSync(p)); }
  }
})(PUB);
const version = hash.digest("hex").slice(0, 10);
const swPath = path.join(PUB, "sw.js");
const sw = fs.readFileSync(swPath, "utf8").replace(/var VERSION = "[^"]*";/, 'var VERSION = "catappa-' + version + '";');
fs.writeFileSync(swPath, sw);
console.log("service worker: versión catappa-" + version);
