(function () {
  "use strict";

  var STORE_KEY = "inmuno-flashcards-v1";
  var ESTACIONES = [2, 3, 4, 5];   // en cuántas estaciones se reparten las preguntas
  var MIN_POR_ESTACION = 6;         // con pocas preguntas se usan menos estaciones
  var HUECO_REINTENTO = 3;          // una fallada vuelve a salir después de ~3 preguntas
  var MAX_VECES = 3;                // veces máximas que sale la misma pregunta en una estación
  var app = document.getElementById("app");

  /* ---------- Iconos de la interfaz ---------- */
  var UI = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.6-4.6M10.5 7.5v6M7.5 10.5h6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  /* ---------- Dibujos de cada tema ----------
     Usan tres tonos (--c1 base, --c2 oscuro, --c3 claro) que salen del "color" del tema. */
  function n(v) { return Math.round(v * 10) / 10; }
  var HL = 'stroke="#fff" stroke-opacity=".6" fill="none" stroke-linecap="round"';

  function svgVirus() {
    var s = "";
    for (var k = 0; k < 12; k++) {
      var a = (k / 12) * Math.PI * 2 + 0.13, c = Math.cos(a), si = Math.sin(a);
      s += '<line x1="' + n(60 + c * 30) + '" y1="' + n(60 + si * 30) + '" x2="' + n(60 + c * 44) + '" y2="' + n(60 + si * 44) +
        '" stroke="var(--c2)" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="' + n(60 + c * 47) + '" cy="' + n(60 + si * 47) + '" r="6" fill="var(--c3)" stroke="var(--c2)" stroke-width="2.5"/>';
    }
    return s + '<circle cx="60" cy="60" r="33" fill="var(--c1)" stroke="var(--c2)" stroke-width="3"/>' +
      '<g fill="var(--c3)"><circle cx="51" cy="67" r="6"/><circle cx="71" cy="53" r="4.5"/><circle cx="69" cy="75" r="3.5"/><circle cx="49" cy="49" r="3"/></g>' +
      '<path d="M40 50a24 24 0 0 1 16-14" stroke-width="4" ' + HL + "/>";
  }

  function svgHongo() {
    var s = "", cx = 60, cy = 54;
    for (var k = 0; k <= 8; k++) {
      var a = Math.PI + (k / 8) * Math.PI, c = Math.cos(a), si = Math.sin(a);
      s += '<line x1="' + n(cx + c * 13) + '" y1="' + n(cy + si * 13) + '" x2="' + n(cx + c * 20) + '" y2="' + n(cy + si * 20) +
        '" stroke="var(--c2)" stroke-width="3.5" stroke-linecap="round"/>';
      for (var j = 0; j < 3; j++) {
        var r = 24 + j * 8.5;
        s += '<circle cx="' + n(cx + c * r) + '" cy="' + n(cy + si * r) + '" r="' + (4.2 - j * 0.5) +
          '" fill="var(' + (j % 2 ? "--c3" : "--c1") + ')" stroke="var(--c2)" stroke-width="1.5"/>';
      }
    }
    return '<path d="M60 112c-3-14 3-26 0-46" fill="none" stroke="var(--c2)" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M46 112h28" stroke="var(--c2)" stroke-width="6" stroke-linecap="round"/>' + s +
      '<circle cx="60" cy="54" r="14" fill="var(--c1)" stroke="var(--c2)" stroke-width="3"/>' +
      '<path d="M52 51a9 9 0 0 1 8-7" stroke-width="3" ' + HL + "/>";
  }

  function svgLevadura() {
    return '<ellipse cx="50" cy="66" rx="30" ry="34" fill="var(--c1)" stroke="var(--c2)" stroke-width="3"/>' +
      '<ellipse cx="86" cy="34" rx="17" ry="19" fill="var(--c1)" stroke="var(--c2)" stroke-width="3"/>' +
      '<circle cx="50" cy="68" r="10" fill="var(--c3)" stroke="var(--c2)" stroke-width="2"/>' +
      '<circle cx="88" cy="36" r="5" fill="var(--c3)"/><circle cx="36" cy="86" r="4" fill="var(--c3)"/>' +
      '<path d="M30 54a24 26 0 0 1 12-16" stroke-width="4" ' + HL + "/>";
  }

  function svgParasito() {
    return '<g fill="none" stroke="var(--c2)" stroke-width="2.6" stroke-linecap="round">' +
      '<path d="M57 100c-4 7 2 11-4 18M63 100c4 7-2 11 4 18"/>' +
      '<path d="M31 60c-8 2-10 10-18 10M89 60c8 2 10 10 18 10"/>' +
      '<path d="M42 84c-6 8-4 15-12 19M78 84c6 8 4 15 12 19"/></g>' +
      '<path d="M60 14c26 0 36 24 32 44-4 20-20 34-32 44-12-10-28-24-32-44-4-20 6-44 32-44z" fill="var(--c1)" stroke="var(--c2)" stroke-width="3"/>' +
      '<ellipse cx="60" cy="44" rx="25" ry="19" fill="var(--c3)"/>' +
      '<path d="M60 58v42" stroke="var(--c2)" stroke-width="2"/>' +
      '<ellipse cx="49" cy="45" rx="8" ry="10" fill="#fff" stroke="var(--c2)" stroke-width="2"/>' +
      '<ellipse cx="71" cy="45" rx="8" ry="10" fill="#fff" stroke="var(--c2)" stroke-width="2"/>' +
      '<circle cx="49" cy="46" r="3" fill="var(--c2)"/><circle cx="71" cy="46" r="3" fill="var(--c2)"/>' +
      '<path d="M51 72q9-6 18 0" fill="none" stroke="var(--c2)" stroke-width="3.5" stroke-linecap="round"/>';
  }

  function svgGusano() {
    var d = "M22 92C30 64 58 98 66 70S98 40 96 24";
    return '<path d="' + d + '" fill="none" stroke="var(--c2)" stroke-width="19" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="var(--c1)" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="var(--c3)" stroke-width="13" stroke-dasharray="2 8"/>' +
      '<circle cx="96" cy="25" r="2.5" fill="var(--c2)"/>';
  }

  function svgAmeba() {
    return '<path d="M60 18c14 0 18 12 30 12 12 0 18 14 12 24-5 9 6 16 2 28-5 14-20 10-28 18-9 9-24 4-30-4-7-9-22-6-26-20-4-13 8-18 6-30-2-14 10-20 20-18 6 1 8-10 14-10z" fill="var(--c1)" stroke="var(--c2)" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="56" cy="60" r="12" fill="var(--c3)" stroke="var(--c2)" stroke-width="2"/><circle cx="56" cy="60" r="3.5" fill="var(--c2)"/>' +
      '<circle cx="82" cy="74" r="6" fill="var(--c3)"/><circle cx="36" cy="76" r="4" fill="var(--c3)"/>' +
      '<circle cx="80" cy="46" r="5" fill="#e11d48" fill-opacity=".75"/>' +
      '<path d="M36 40a20 20 0 0 1 12-10" stroke-width="4" ' + HL + "/>";
  }

  function svgAdn() {
    var a = "", b = "", r = "";
    for (var y = 12; y <= 108; y += 2) {
      var t = ((y - 12) / 96) * Math.PI * 2.5, x = 26 * Math.sin(t);
      a += (y === 12 ? "M" : "L") + n(60 + x) + " " + y;
      b += (y === 12 ? "M" : "L") + n(60 - x) + " " + y;
      if ((y - 12) % 8 === 4) r += '<line x1="' + n(60 + x) + '" y1="' + y + '" x2="' + n(60 - x) + '" y2="' + y + '"/>';
    }
    return '<g stroke="var(--c3)" stroke-width="4" stroke-linecap="round">' + r + "</g>" +
      '<path d="' + a + '" fill="none" stroke="var(--c1)" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="' + b + '" fill="none" stroke="var(--c2)" stroke-width="7" stroke-linecap="round"/>';
  }

  function svgAnticuerpo() {
    return '<rect x="15" y="15" width="14" height="14" rx="3" transform="rotate(45 22 22)" fill="#ffc94d" stroke="#e0a52a" stroke-width="2"/>' +
      '<rect x="91" y="15" width="14" height="14" rx="3" transform="rotate(45 98 22)" fill="#ffc94d" stroke="#e0a52a" stroke-width="2"/>' +
      '<path d="M60 106V64L35 30M60 64l25-34" fill="none" stroke="var(--c1)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M41.6 59.2L25.3 37.1M78.4 59.2l16.3-22.1" stroke="#f08bb8" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M54 74h12M54 82h12" stroke="#ffd98a" stroke-width="3" stroke-linecap="round"/>';
  }

  function svgLupa() {
    return '<path d="M74 74l26 26" stroke="var(--c2)" stroke-width="12" stroke-linecap="round"/>' +
      '<circle cx="50" cy="50" r="32" fill="var(--c3)" stroke="var(--c2)" stroke-width="8"/>' +
      '<g fill="var(--c1)"><circle cx="41" cy="46" r="7"/><circle cx="61" cy="60" r="5"/>' +
      '<ellipse cx="59" cy="38" rx="8" ry="4" transform="rotate(30 59 38)"/><circle cx="42" cy="64" r="3.5"/></g>' +
      '<path d="M30 40a22 22 0 0 1 12-14" stroke-width="4" ' + HL + "/>";
  }

  function svgBacteria() {
    var s = "";
    [[36, 40], [80, 38], [58, 82]].forEach(function (p) {
      s += '<ellipse cx="' + (p[0] - 9) + '" cy="' + p[1] + '" rx="10" ry="12" fill="var(--c1)" stroke="var(--c2)" stroke-width="2.5"/>' +
        '<ellipse cx="' + (p[0] + 9) + '" cy="' + p[1] + '" rx="10" ry="12" fill="var(--c1)" stroke="var(--c2)" stroke-width="2.5"/>' +
        '<path d="M' + (p[0] - 14) + " " + (p[1] - 4) + 'a6 6 0 0 1 4-5" stroke-width="2.5" ' + HL + "/>";
    });
    return '<circle cx="60" cy="60" r="52" fill="var(--c3)" fill-opacity=".45"/>' + s;
  }

  function svgCelula() {
    var v = function (ang, rad, r) {
      var a = (ang * Math.PI) / 180;
      return '<circle cx="' + n(56 + Math.cos(a) * rad) + '" cy="' + n(62 + Math.sin(a) * rad) + '" r="' + r + '" fill="var(--c1)" stroke="var(--c2)" stroke-width="2"/>';
    };
    return '<circle cx="56" cy="62" r="40" fill="var(--c3)" stroke="var(--c2)" stroke-width="3"/>' +
      '<circle cx="50" cy="66" r="15" fill="var(--c1)" stroke="var(--c2)" stroke-width="2"/>' +
      '<g fill="var(--c2)"><circle cx="74" cy="72" r="3.5"/><circle cx="68" cy="86" r="3.5"/><circle cx="36" cy="44" r="3.5"/></g>' +
      v(-35, 40, 8) + v(-60, 54, 7) + v(10, 52, 6);
  }

  function svgEritrocito() {
    var gr = function (cx, cy, r, rx, ry) {
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--c1)" stroke="var(--c2)" stroke-width="3"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + n(r * 0.45) + '" fill="var(--c3)" fill-opacity=".7"/>' +
        '<circle cx="' + rx + '" cy="' + ry + '" r="' + n(r * 0.25) + '" fill="none" stroke="#5b21b6" stroke-width="3"/>' +
        '<circle cx="' + n(rx + r * 0.22) + '" cy="' + n(ry - r * 0.18) + '" r="3" fill="#5b21b6"/>';
    };
    return gr(48, 54, 32, 56, 46) + gr(84, 86, 21, 88, 82);
  }

  var ICONOS = {
    virus: [svgVirus(), "#f27a6b"],
    hongo: [svgHongo(), "#45bf98"],
    levadura: [svgLevadura(), "#e9a23b"],
    parasito: [svgParasito(), "#ffb547"],
    gusano: [svgGusano(), "#f08bb8"],
    ameba: [svgAmeba(), "#ef6f6c"],
    adn: [svgAdn(), "#7d5ce6"],
    anticuerpo: [svgAnticuerpo(), "#7d5ce6"],
    lupa: [svgLupa(), "#3b82f6"],
    bacteria: [svgBacteria(), "#2563eb"],
    celula: [svgCelula(), "#14b8a6"],
    eritrocito: [svgEritrocito(), "#e5484d"]
  };

  function hexToHsl(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return null;
    var v = parseInt(m[1], 16), r = ((v >> 16) & 255) / 255, g = ((v >> 8) & 255) / 255, b = (v & 255) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, h = 0, s = 0, d = max - min;
    if (d) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return { h: h, s: s, l: l };
  }

  function hsl(h, s, l) {
    return "hsl(" + Math.round(h) + ", " + Math.round(Math.min(1, s) * 100) + "%, " + Math.round(l * 100) + "%)";
  }

  function paleta(hex) {
    var c = hexToHsl(hex) || hexToHsl("#7d5ce6");
    return "--c1:" + hsl(c.h, c.s, c.l) +
      ";--c2:" + hsl(c.h, c.s * 1.05, Math.max(0.14, c.l - 0.17)) +
      ";--c3:" + hsl(c.h, c.s * 0.9, Math.min(0.93, c.l + 0.24));
  }

  function artHTML(icono, color, foto) {
    var ic = ICONOS[icono];
    if (ic) {
      return '<span class="art" style="' + paleta(color || ic[1]) + '"><svg viewBox="0 0 120 120" aria-hidden="true">' + ic[0] + "</svg></span>";
    }
    return '<span class="art' + (foto ? " photo" : "") + '"><img src="' + esc(icono) + '" alt=""></span>';
  }

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function clave(s) { return String(s).trim().toLowerCase(); }

  function unicas(lista) {
    var vistas = {};
    return lista.filter(function (o) {
      var k = clave(o);
      if (!k || vistas[k]) return false;
      vistas[k] = true;
      return true;
    });
  }

  function cruza(a, b) {
    for (var i = 0; i < a.length; i++) if (b.indexOf(a[i]) >= 0) return true;
    return false;
  }

  /* ---------- Datos ----------
     window.TEMAS = [ { id, nombre, subtemas: [ { id, nombre, icono, color, preguntas: [...] } ] } ]
     (también acepta temas sin subtemas, con "preguntas" directo). */
  function normalizar(p, subId) {
    if (!p || !p.pregunta) return null;
    var correcta, opciones;
    if (Array.isArray(p.opciones)) {
      opciones = p.opciones.map(String);
      correcta = typeof p.correcta === "number" ? opciones[p.correcta] : String(p.correcta == null ? "" : p.correcta);
    } else {
      correcta = String(p.correcta == null ? "" : p.correcta);
      opciones = (p.incorrectas || []).map(String);
    }
    correcta = correcta.trim();
    var incorrectas = unicas(opciones.map(function (o) { return o.trim(); }))
      .filter(function (o) { return clave(o) !== clave(correcta); });
    var grupo = p.grupo ? String(p.grupo).trim() : "";
    if (!correcta || (!incorrectas.length && !grupo)) {
      console.warn("Pregunta incompleta (falta la respuesta correcta o las opciones):", p);
      return null;
    }
    return {
      id: subId + ":" + hash(String(p.pregunta)),
      topicId: subId,
      tambien: (p.tambien || []).map(String),
      temas: [subId],
      apartado: p.apartado ? String(p.apartado).trim() : "General",
      grupo: grupo,
      texto: String(p.pregunta),
      correcta: correcta,
      incorrectas: incorrectas,
      excluir: (p.excluir || []).map(clave),
      explicacion: p.explicacion ? String(p.explicacion) : "",
      imagen: p.imagen || null
    };
  }

  var GRUPOS = [], SUBTEMAS = [], SUB = {}, QUESTIONS = [];
  (Array.isArray(window.TEMAS) ? window.TEMAS : []).forEach(function (g, gi) {
    var gid = String(g.id || "grupo" + gi);
    var subs = Array.isArray(g.subtemas) ? g.subtemas
      : [{ id: gid, nombre: g.nombre, icono: g.icono, color: g.color, preguntas: g.preguntas || [] }];
    var grupo = { id: gid, nombre: g.nombre || "Temas", subtemas: [] };
    subs.forEach(function (t, ti) {
      var id = String(t.id || gid + "-" + ti);
      if (SUB[id]) { console.warn("Subtema con id repetido:", id); return; }
      var sub = { id: id, grupo: gid, nombre: t.nombre || "Tema", icono: t.icono || g.icono || "virus", color: t.color || null, total: 0 };
      SUB[id] = sub;
      SUBTEMAS.push(sub);
      grupo.subtemas.push(sub);
      (t.preguntas || []).forEach(function (p) {
        var q = normalizar(p, id);
        if (q) QUESTIONS.push(q);
      });
    });
    GRUPOS.push(grupo);
  });
  QUESTIONS.forEach(function (q) {
    q.tambien.forEach(function (id) {
      if (!SUB[id]) console.warn('"tambien" apunta a un subtema que no existe:', id, q.texto);
      else if (q.temas.indexOf(id) < 0) q.temas.push(id);
    });
    q.temas.forEach(function (id) { SUB[id].total++; });
  });

  // Respuestas correctas de cada "grupo": sirven como opciones falsas para las otras preguntas del grupo.
  var FALSAS = {};
  QUESTIONS.forEach(function (q) {
    if (q.grupo) (FALSAS[q.grupo] = FALSAS[q.grupo] || []).push(q.correcta);
  });

  /*
    Arma las 4 opciones de una pregunta cada vez que sale, para que las opciones
    falsas cambien y no te aprendas cuáles sobran: toma algunas de sus propias
    incorrectas y, si la pregunta tiene grupo, mezcla respuestas de otras preguntas del grupo.
  */
  function armarOpciones(q) {
    var usadas = [clave(q.correcta)].concat(q.excluir);
    var libre = function (o) { return usadas.indexOf(clave(o)) < 0; };
    var propias = shuffle(q.incorrectas.filter(libre));
    var ajenas = shuffle(unicas((FALSAS[q.grupo] || []).filter(function (o) {
      return libre(o) && q.incorrectas.map(clave).indexOf(clave(o)) < 0;
    })));
    var nAjenas = Math.floor(Math.random() * (Math.min(propias.length ? 2 : 3, ajenas.length) + 1));
    var malas = ajenas.slice(0, nAjenas);
    malas = malas.concat(propias.slice(0, 3 - malas.length));
    malas = malas.concat(ajenas.slice(nAjenas, nAjenas + 3 - malas.length));
    return shuffle([q.correcta].concat(malas));
  }

  /* ---------- Guardado local ---------- */
  function load() {
    var d = {};
    try { d = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (e) { d = {}; }
    return {
      progreso: d.progreso && typeof d.progreso === "object" ? d.progreso : {},
      estaciones: ESTACIONES.indexOf(d.estaciones) >= 0 ? d.estaciones : 3,
      ciclo: d.ciclo && typeof d.ciclo === "object" ? d.ciclo : {},
      seleccion: Array.isArray(d.seleccion) ? d.seleccion : []
    };
  }
  var store = load();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* sin guardado disponible */ }
  }

  function poolDe(ids) {
    return QUESTIONS.filter(function (q) { return cruza(q.temas, ids); });
  }

  function stats(ids) {
    var answered = 0, correct = 0, pool = poolDe(ids);
    pool.forEach(function (q) {
      var r = store.progreso[q.id];
      if (r) { answered++; if (r.ok) correct++; }
    });
    return { answered: answered, correct: correct, total: pool.length, pct: answered ? Math.round((correct / answered) * 100) : 0 };
  }

  function badgeClass(st) {
    if (!st.answered || st.pct === 0) return "";
    return st.pct >= 70 ? "good" : "mid";
  }

  function seleccionValida() {
    return store.seleccion.filter(function (id) { return SUB[id] && SUB[id].total; });
  }

  /* ---------- Pantalla: Elige tus temas ---------- */
  var homeScroll = 0;

  function topicHTML(t, sel) {
    var st = stats([t.id]);
    return '<button class="topic" data-action="tema" data-id="' + esc(t.id) + '" aria-pressed="' + (sel.indexOf(t.id) >= 0) + '"' +
      (t.total ? "" : " disabled") + ">" +
      '<span class="topic-circle">' + artHTML(t.icono, t.color) +
      '<span class="badge ' + badgeClass(st) + '">' + st.pct + "%</span></span>" +
      '<span class="topic-name">' + esc(t.nombre) + "</span>" +
      '<span class="topic-count">' + st.answered + "/" + st.total + "</span></button>";
  }

  function idsDeGrupo(g) {
    return g.subtemas.filter(function (t) { return t.total; }).map(function (t) { return t.id; });
  }

  function renderHome() {
    session = null;
    if (!QUESTIONS.length) {
      app.innerHTML = '<section class="screen"><header class="home-head"><h1>Elige tus temas</h1></header>' +
        '<div class="scroll"><p class="hint">Todavía no hay preguntas. Agrégalas en la carpeta "preguntas".</p></div></section>';
      return;
    }
    var sel = seleccionValida();
    var secciones = GRUPOS.map(function (g) {
      var ids = idsDeGrupo(g);
      if (!ids.length) return "";
      var una = GRUPOS.length === 1;
      return '<section class="group">' +
        (una ? "" : '<div class="group-head"><div class="group-title"><h2>' + esc(g.nombre) + "</h2>" +
          "<span>" + poolDe(ids).length + " preguntas</span></div>" +
          '<button class="pill" data-action="grupo" data-id="' + esc(g.id) + '">' +
          (ids.every(function (id) { return sel.indexOf(id) >= 0; }) ? "Quitar todos" : "Elegir todos") + "</button></div>") +
        '<div class="topic-grid">' + g.subtemas.map(function (t) { return topicHTML(t, sel); }).join("") + "</div></section>";
    }).join("");
    app.innerHTML =
      '<section class="screen">' +
      '<header class="home-head"><h1>Elige tus temas</h1>' +
      '<button class="icon-btn" data-action="ajustes" aria-label="Ajustes">' + UI.gear + "</button></header>" +
      '<div class="scroll" id="home-scroll">' + secciones + "</div>" +
      '<footer class="dock">' +
      '<p class="hint" id="hint"></p>' +
      '<div class="score-row"><strong>Puntaje promedio</strong><span class="mini" id="score-mini"></span>' +
      '<span class="val" id="score-val"></span></div>' +
      '<div class="bar"><i id="score-bar"></i></div>' +
      '<button class="btn btn-primary" data-action="empezar" id="btn-empezar">Comienza a aprender</button>' +
      "</footer></section>";
    document.getElementById("home-scroll").scrollTop = homeScroll;
    updateHomeFooter();
  }

  function updateHomeFooter() {
    var sel = seleccionValida();
    var st = stats(sel.length ? sel : SUBTEMAS.map(function (t) { return t.id; }));
    var one = sel.length === 1 ? SUB[sel[0]] : null;
    document.getElementById("score-mini").innerHTML = one ? artHTML(one.icono, one.color) : "";
    document.getElementById("score-val").textContent = st.pct + "%";
    document.getElementById("score-bar").style.width = st.pct + "%";
    document.getElementById("btn-empezar").disabled = !sel.length;
    document.getElementById("hint").textContent = sel.length
      ? (sel.length === 1 ? SUB[sel[0]].nombre : sel.length + " temas") + " · " + st.total + " preguntas"
      : "Toca uno o varios temas para empezar.";
    GRUPOS.forEach(function (g) {
      var b = app.querySelector('[data-action="grupo"][data-id="' + g.id + '"]');
      var ids = idsDeGrupo(g);
      if (b) b.textContent = ids.every(function (id) { return sel.indexOf(id) >= 0; }) ? "Quitar todos" : "Elegir todos";
    });
  }

  function toggleTopic(btn) {
    var id = btn.getAttribute("data-id");
    var i = store.seleccion.indexOf(id);
    if (i >= 0) store.seleccion.splice(i, 1); else store.seleccion.push(id);
    btn.setAttribute("aria-pressed", String(i < 0));
    save();
    updateHomeFooter();
  }

  function toggleGrupo(gid) {
    var g = GRUPOS.filter(function (x) { return x.id === gid; })[0];
    if (!g) return;
    var ids = idsDeGrupo(g);
    var todos = ids.every(function (id) { return store.seleccion.indexOf(id) >= 0; });
    store.seleccion = store.seleccion.filter(function (id) { return ids.indexOf(id) < 0; });
    if (!todos) store.seleccion = store.seleccion.concat(ids);
    ids.forEach(function (id) {
      var b = app.querySelector('.topic[data-id="' + id + '"]');
      if (b) b.setAttribute("aria-pressed", String(!todos));
    });
    save();
    updateHomeFooter();
  }

  /* ---------- Estaciones ---------- */
  var session = null;

  function pendientesDe(pool) {
    return pool.filter(function (q) { return !store.ciclo[q.id]; });
  }

  function tomar(lista, cuantas, yaElegidas) {
    var out = [];
    for (var i = 0; i < lista.length && out.length < cuantas; i++) {
      if (yaElegidas.indexOf(lista[i]) < 0) out.push(lista[i]);
    }
    return out;
  }

  function totalEstaciones(pool) {
    return Math.max(1, Math.min(store.estaciones, Math.floor(pool.length / MIN_POR_ESTACION)));
  }

  /*
    Arma una estación: una parte de las preguntas que aún no salen en esta ronda.
    A veces se enfoca en uno o dos apartados (p. ej. Morfología) y a veces mezcla todo.
    Además mete algunas preguntas que fallaste en estaciones anteriores.
  */
  function armarEstacion(pool) {
    var total = totalEstaciones(pool);
    var pendientes = pendientesDe(pool);
    if (!pendientes.length) {
      pool.forEach(function (q) { delete store.ciclo[q.id]; });
      pendientes = pool.slice();
    }
    var vistas = pool.length - pendientes.length;
    var numero = Math.min(total, Math.round(vistas / (pool.length / total)) + 1);
    var tam = Math.ceil(pendientes.length / (total - numero + 1));

    var apartados = [];
    pendientes.forEach(function (q) { if (apartados.indexOf(q.apartado) < 0) apartados.push(q.apartado); });
    var elegidas;
    if (total > 1 && apartados.length > 1 && Math.random() < 0.65) {
      var foco = shuffle(apartados.slice()).slice(0, apartados.length > 2 && Math.random() < 0.5 ? 2 : 1);
      var dentro = shuffle(pendientes.filter(function (q) { return foco.indexOf(q.apartado) >= 0; }));
      var fuera = shuffle(pendientes.filter(function (q) { return foco.indexOf(q.apartado) < 0; }));
      elegidas = tomar(dentro, Math.ceil(tam * 0.7), []);
      elegidas = elegidas.concat(tomar(fuera, tam - elegidas.length, elegidas));
      elegidas = elegidas.concat(tomar(dentro, tam - elegidas.length, elegidas));
    } else {
      elegidas = shuffle(pendientes.slice()).slice(0, tam);
    }

    var repasos = shuffle(pool.filter(function (q) {
      var r = store.progreso[q.id];
      return r && r.repasar && elegidas.indexOf(q) < 0;
    })).slice(0, Math.max(1, Math.ceil(tam / 3)));

    var items = elegidas.map(function (q) { return { q: q, etiqueta: "" }; })
      .concat(repasos.map(function (q) { return { q: q, etiqueta: "Repaso" }; }));
    return { items: shuffle(items), numero: numero, total: total };
  }

  function startSession(ids, soloIds) {
    var pool = poolDe(ids);
    if (!pool.length) return;
    var est;
    if (soloIds) {
      est = {
        items: shuffle(pool.filter(function (q) { return soloIds.indexOf(q.id) >= 0; }))
          .map(function (q) { return { q: q, etiqueta: "Repaso" }; }),
        numero: 0,
        total: 0
      };
    } else {
      est = armarEstacion(pool);
      save();
    }
    if (!est.items.length) return;
    est.items.forEach(function (it) { it.opciones = armarOpciones(it.q); });
    session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      topicIds: ids,
      items: est.items,
      numero: est.numero,
      total: est.total,
      esRepaso: !!soloIds,
      i: 0,
      elegido: null,
      enviado: false,
      veces: {},
      primero: {},
      fallidas: []
    };
    renderQuestion();
  }

  function etiquetaEstacion(s) {
    if (s.esRepaso) return "Repaso";
    return s.total > 1 ? "Estación " + s.numero + " de " + s.total : "Estación única";
  }

  function subDe(q, s) {
    for (var i = 0; i < q.temas.length; i++) if (s.topicIds.indexOf(q.temas[i]) >= 0) return SUB[q.temas[i]];
    return SUB[q.topicId];
  }

  /* ---------- Pantalla: Pregunta ---------- */
  function renderQuestion() {
    var s = session, it = s.items[s.i], q = it.q, sub = subDe(q, s);
    s.elegido = null;
    s.enviado = false;
    var figura = q.imagen ? artHTML(q.imagen, null, true) : artHTML(sub.icono, sub.color);
    app.innerHTML =
      '<section class="screen">' +
      '<header class="quiz-head">' +
      '<button class="icon-btn back" data-action="inicio" aria-label="Volver a los temas">' + UI.back + "</button>" +
      '<div class="quiz-title"><b>' + esc(sub.nombre) + "</b><small>" + etiquetaEstacion(s) + " · Pregunta " + (s.i + 1) + " de " + s.items.length + "</small></div>" +
      "<span></span></header>" +
      '<div class="progress"><i id="prog" style="width:' + (s.i / s.items.length) * 100 + '%"></i></div>' +
      '<div class="scroll" id="scroll">' +
      '<div class="figure">' + figura +
      '<button class="icon-btn zoom" data-action="zoom" aria-label="Ampliar imagen">' + UI.zoom + "</button></div>" +
      '<div class="chips"><span class="chip">' + esc(q.apartado) + "</span>" +
      (it.etiqueta ? '<span class="chip again">' + esc(it.etiqueta) + "</span>" : "") + "</div>" +
      '<p class="question">' + esc(q.texto) + "</p>" +
      '<div class="options" role="radiogroup" aria-label="Opciones de respuesta">' +
      it.opciones.map(function (o, k) {
        return '<button class="opt" role="radio" aria-checked="false" data-action="opcion" data-k="' + k + '">' +
          '<span class="dot"></span><span>' + esc(o) + "</span></button>";
      }).join("") +
      "</div>" +
      '<div id="feedback" aria-live="polite"></div>' +
      "</div>" +
      '<footer class="dock"><button class="btn btn-primary" data-action="principal" id="btn-main" disabled>Enviar respuesta</button></footer>' +
      "</section>";
    document.getElementById("scroll").scrollTop = 0;
  }

  function choose(k) {
    var s = session;
    if (!s || s.enviado) return;
    s.elegido = k;
    app.querySelectorAll(".opt").forEach(function (b) {
      b.setAttribute("aria-checked", String(Number(b.getAttribute("data-k")) === k));
    });
    document.getElementById("btn-main").disabled = false;
  }

  function submit() {
    var s = session, it = s.items[s.i], q = it.q;
    if (s.elegido == null || s.enviado) return;
    s.enviado = true;
    var ok = it.opciones[s.elegido] === q.correcta;

    // Progreso guardado: si la fallas, queda marcada para repasar en otra estación.
    // Se desmarca cuando la contestas bien en una estación distinta a la que la fallaste.
    var prev = store.progreso[q.id] || {};
    var rec = { ok: ok, veces: (prev.veces || 0) + 1, repasar: !!prev.repasar, fallo: prev.fallo || null };
    if (!ok) { rec.repasar = true; rec.fallo = s.id; }
    else if (rec.repasar && rec.fallo !== s.id) { rec.repasar = false; rec.fallo = null; }
    store.progreso[q.id] = rec;
    store.ciclo[q.id] = true;
    save();

    if (!(q.id in s.primero)) s.primero[q.id] = ok;
    if (!ok && s.fallidas.indexOf(q) < 0) s.fallidas.push(q);

    // Si la fallas, vuelve a salir más adelante en esta misma estación (con otras opciones).
    s.veces[q.id] = (s.veces[q.id] || 0) + 1;
    var vuelve = !ok && s.veces[q.id] < MAX_VECES;
    if (vuelve) {
      var pos = Math.min(s.items.length, s.i + 1 + HUECO_REINTENTO);
      s.items.splice(pos, 0, { q: q, etiqueta: "Otra vez", opciones: armarOpciones(q) });
    }

    app.querySelectorAll(".opt").forEach(function (b) {
      var k = Number(b.getAttribute("data-k"));
      b.disabled = true;
      if (it.opciones[k] === q.correcta) {
        b.classList.add("is-correct");
        b.querySelector(".dot").innerHTML = UI.check;
      } else if (k === s.elegido) {
        b.classList.add("is-wrong");
        b.querySelector(".dot").innerHTML = UI.cross;
      }
    });

    var fb = document.getElementById("feedback");
    fb.innerHTML = '<div class="feedback">' +
      (ok ? '<p class="fb-title ok">¡Correcto! ¡Bien hecho!</p>' : '<p class="fb-title bad">Respuesta incorrecta</p>') +
      (vuelve ? '<p class="fb-note">Te la vuelvo a preguntar más adelante.</p>' : "") +
      (q.explicacion ? '<div class="explain"><span>Explicación</span>' + esc(q.explicacion) + "</div>" : "") +
      "</div>";
    document.getElementById("prog").style.width = ((s.i + 1) / s.items.length) * 100 + "%";
    var sub = app.querySelector(".quiz-title small");
    if (sub) sub.textContent = etiquetaEstacion(s) + " · Pregunta " + (s.i + 1) + " de " + s.items.length;
    var main = document.getElementById("btn-main");
    main.textContent = s.i + 1 < s.items.length ? "Próxima pregunta" : "Ver resultados";
    main.focus({ preventScroll: true });
    requestAnimationFrame(function () {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      fb.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    });
  }

  function next() {
    session.i++;
    if (session.i < session.items.length) renderQuestion(); else renderResults();
  }

  /* ---------- Pantalla: Resultados ---------- */
  function renderResults() {
    var s = session;
    var ids = Object.keys(s.primero);
    var total = ids.length;
    var bien = ids.filter(function (id) { return s.primero[id]; }).length;
    var pct = total ? Math.round((bien / total) * 100) : 0;
    var fallas = s.fallidas;
    var rondaCompleta = !pendientesDe(poolDe(s.topicIds)).length;
    var titulo = pct >= 90 ? "¡Excelente!" : pct >= 70 ? "¡Muy bien!" : pct >= 50 ? "Vas por buen camino" : "Sigue practicando";
    var resumen = (s.esRepaso ? "Repaso terminado" : s.total > 1 ? "Estación " + s.numero + " de " + s.total + " terminada" : "Estación terminada") +
      "<br>" + bien + " de " + total + " correctas a la primera";
    if (!s.esRepaso && rondaCompleta) resumen += "<br>Ya viste todas las preguntas de esta ronda.";
    var R = 66, C = 2 * Math.PI * R;
    app.innerHTML =
      '<section class="screen">' +
      '<header class="quiz-head">' +
      '<button class="icon-btn back" data-action="inicio" aria-label="Volver a los temas">' + UI.back + "</button>" +
      '<div class="quiz-title"><b>Resultados</b></div><span></span></header>' +
      '<div class="scroll">' +
      '<div class="res-hero"><div class="ring">' +
      '<svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="' + R + '" fill="none" stroke="var(--ok-soft)" stroke-width="12"/>' +
      '<circle cx="75" cy="75" r="' + R + '" fill="none" stroke="var(--ok)" stroke-width="12" stroke-linecap="round" stroke-dasharray="' +
      n((C * pct) / 100) + " " + n(C) + '"/></svg>' +
      "<b>" + pct + "%</b></div>" +
      "<h2>" + titulo + "</h2><p>" + resumen + "</p></div>" +
      (fallas.length
        ? '<div class="review"><h3>Para repasar</h3>' +
          fallas.map(function (q) {
            return '<div class="review-item"><span class="q">' + esc(q.texto) + '</span><span class="a">' + esc(q.correcta) + "</span></div>";
          }).join("") + "</div>"
        : "") +
      "</div>" +
      '<footer class="dock">' +
      (fallas.length ? '<button class="btn btn-soft" data-action="repasar">Repasar errores (' + fallas.length + ")</button>" : "") +
      '<button class="btn btn-primary" data-action="siguiente">' + (rondaCompleta ? "Empezar nueva ronda" : "Siguiente estación") + "</button>" +
      "</footer></section>";
  }

  /* ---------- Ajustes y zoom ---------- */
  function closeOverlay() {
    var ov = document.getElementById("overlay");
    if (ov) ov.remove();
  }

  function openSettings(confirmando) {
    closeOverlay();
    document.body.insertAdjacentHTML("beforeend",
      '<div class="overlay" id="overlay" data-backdrop>' +
      '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="aj-titulo">' +
      '<h2 id="aj-titulo">Ajustes</h2>' +
      '<div class="field"><span>Dividir las preguntas en estaciones</span><div class="seg">' +
      ESTACIONES.map(function (v) {
        return '<button data-action="estaciones" data-v="' + v + '" aria-pressed="' + (store.estaciones === v) + '">' + v + "</button>";
      }).join("") + "</div>" +
      '<p class="note">Cada estación trae una parte distinta de las preguntas, revueltas por apartado. ' +
      "Las que falles vuelven a salir en la misma estación y en las siguientes. Si eliges pocas preguntas, se usan menos estaciones.</p></div>" +
      '<div class="field"><span>Progreso</span>' +
      (confirmando
        ? '<div class="confirm"><p>Se borrarán los porcentajes de todos los temas.</p><div class="row">' +
          '<button class="btn btn-soft" data-action="reset-no">Cancelar</button>' +
          '<button class="btn btn-danger" data-action="reset-si">Sí, borrar</button></div></div>'
        : '<button class="btn btn-danger" data-action="reset">Reiniciar progreso</button>') +
      "</div>" +
      '<button class="btn btn-primary" data-action="cerrar">Listo</button>' +
      "</div></div>");
  }

  function openZoom() {
    if (!session) return;
    var q = session.items[session.i].q, sub = subDe(q, session);
    closeOverlay();
    document.body.insertAdjacentHTML("beforeend",
      '<div class="overlay zoom-view" id="overlay" data-backdrop data-action="cerrar">' +
      (q.imagen ? artHTML(q.imagen, null, true) : artHTML(sub.icono, sub.color)) +
      '<button class="icon-btn" data-action="cerrar" aria-label="Cerrar">' + UI.close + "</button></div>");
  }

  /* ---------- Eventos ---------- */
  document.addEventListener("click", function (e) {
    var ov = document.getElementById("overlay");
    if (ov && e.target === ov && ov.hasAttribute("data-backdrop")) { closeOverlay(); return; }
    var el = e.target.closest("[data-action]");
    if (!el) return;
    switch (el.getAttribute("data-action")) {
      case "tema": toggleTopic(el); break;
      case "grupo": toggleGrupo(el.getAttribute("data-id")); break;
      case "empezar":
        var hs = document.getElementById("home-scroll");
        if (hs) homeScroll = hs.scrollTop;
        startSession(seleccionValida());
        break;
      case "ajustes": openSettings(false); break;
      case "opcion": choose(Number(el.getAttribute("data-k"))); break;
      case "principal": if (session && session.enviado) next(); else submit(); break;
      case "zoom": openZoom(); break;
      case "inicio": renderHome(); break;
      case "repasar":
        startSession(session.topicIds, session.fallidas.map(function (q) { return q.id; }));
        break;
      case "siguiente": startSession(session.topicIds); break;
      case "cerrar": closeOverlay(); break;
      case "estaciones":
        store.estaciones = Number(el.getAttribute("data-v"));
        save();
        el.parentNode.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === el)); });
        break;
      case "reset": openSettings(true); break;
      case "reset-no": openSettings(false); break;
      case "reset-si":
        store.progreso = {};
        store.ciclo = {};
        save();
        if (!session) renderHome();
        openSettings(false);
        break;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (document.getElementById("overlay")) {
      if (e.key === "Escape") closeOverlay();
      return;
    }
    if (!session || !document.getElementById("btn-main")) return;
    var k = Number(e.key);
    if (k >= 1 && k <= session.items[session.i].opciones.length) { choose(k - 1); return; }
    if (e.key === "Enter" && !(document.activeElement && document.activeElement.tagName === "BUTTON")) {
      var main = document.getElementById("btn-main");
      if (!main.disabled) main.click();
    }
  });

  renderHome();
})();
