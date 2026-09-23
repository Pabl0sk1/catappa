"use strict";
/* =====================================================================
   Almacén de datos: JSON en disco, caché en memoria, escritura atómica.
   Sin dependencias externas a propósito: menos superficie, menos sorpresas.
   ===================================================================== */
const fs = require("fs");
const path = require("path");

const DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");

const ESQUEMA = {
  usuarios: [],      // {id, usuario, nombre, hash, salt, color, bio, creado, rol}
  progreso: {},      // {usuarioId: {cursoId: {lecciones:{}, xp, aciertos, intentos}}}
  actividad: {},     // {usuarioId: {"2026-09-21": xpDelDia}}
  actividadCursos: {}, // {usuarioId: {cursoId: {"2026-09-21": xpDelDia}}}: permite reiniciar un curso sin dejar rastro
  certificados: {},  // {usuarioId: {cursoId: {codigo, curso, titulo, lecciones, nombre, fecha}}}
  examenes: {},      // {usuarioId: {cursoId: {indiceUnidad: {nota, aciertos, preguntas, fecha, intentos}}}}
  proyectos: {},     // {usuarioId: {cursoId: {proyectoId: {fecha, intentos, xp}}}}
  posts: [],         // {id, autor, cursoId, leccionId, tipo, titulo, cuerpo, creado, votos:[], respuestas:[]}
  sesiones: {},      // {token: {uid, creado}}
  meta: { creado: null, version: 1 }
};

const cache = {};
const pendientes = new Set();
let temporizador = null;

function ruta(col) { return path.join(DIR, col + ".json"); }

function cargar() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  for (const col of Object.keys(ESQUEMA)) {
    try {
      cache[col] = JSON.parse(fs.readFileSync(ruta(col), "utf8"));
    } catch (e) {
      cache[col] = JSON.parse(JSON.stringify(ESQUEMA[col]));
      marcar(col);
    }
  }
  if (!cache.meta.creado) { cache.meta.creado = new Date().toISOString(); marcar("meta"); }
  volcar();
}

function marcar(col) {
  pendientes.add(col);
  if (temporizador) return;
  temporizador = setTimeout(() => { temporizador = null; volcar(); }, 300);
}

function volcar() {
  for (const col of pendientes) {
    const destino = ruta(col);
    const tmp = destino + ".tmp";
    try {
      fs.writeFileSync(tmp, JSON.stringify(cache[col], null, 1));
      fs.renameSync(tmp, destino);   // atómico: o está el fichero viejo o el nuevo
    } catch (e) {
      console.error("[db] no se pudo guardar", col, e.message);
    }
  }
  pendientes.clear();
}

process.on("SIGTERM", () => { volcar(); process.exit(0); });
process.on("SIGINT", () => { volcar(); process.exit(0); });

module.exports = {
  DIR,
  cargar,
  volcar,
  get(col) { return cache[col]; },
  guardar(col) { marcar(col); },
  id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
};
