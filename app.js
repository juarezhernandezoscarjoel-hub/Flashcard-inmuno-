(function () {
  "use strict";

  var STORE_KEY = "inmuno-flashcards-v1";
  var ESTACIONES = [2, 3, 4, 5];   // en cuántas estaciones se reparten las preguntas
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

  /* ---------- Dibujos de cada tema ---------- */
  function n(v) { return Math.round(v * 10) / 10; }

  function svgAnticuerpo() {
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<rect x="15" y="15" width="14" height="14" rx="3" transform="rotate(45 22 22)" fill="#ffc94d" stroke="#e0a52a" stroke-width="2"/>' +
      '<rect x="91" y="15" width="14" height="14" rx="3" transform="rotate(45 98 22)" fill="#ffc94d" stroke="#e0a52a" stroke-width="2"/>' +
      '<path d="M60 106V64L35 30M60 64l25-34" fill="none" stroke="#7d5ce6" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M41.6 59.2L25.3 37.1M78.4 59.2l16.3-22.1" stroke="#f08bb8" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M54 74h12M54 82h12" stroke="#ffd98a" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>';
  }

  function svgVirus() {
    var s = "";
    for (var k = 0; k < 12; k++) {
      var a = (k / 12) * Math.PI * 2 + 0.13, c = Math.cos(a), si = Math.sin(a);
      s += '<line x1="' + n(60 + c * 30) + '" y1="' + n(60 + si * 30) + '" x2="' + n(60 + c * 44) + '" y2="' + n(60 + si * 44) +
        '" stroke="#d9584a" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="' + n(60 + c * 47) + '" cy="' + n(60 + si * 47) + '" r="6" fill="#f59a8d" stroke="#d9584a" stroke-width="2.5"/>';
    }
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' + s +
      '<circle cx="60" cy="60" r="33" fill="#f27a6b" stroke="#d9584a" stroke-width="3"/>' +
      '<circle cx="51" cy="67" r="6" fill="#f9b3a9"/><circle cx="71" cy="53" r="4.5" fill="#f9b3a9"/>' +
      '<circle cx="69" cy="75" r="3.5" fill="#f9b3a9"/><circle cx="49" cy="49" r="3" fill="#f9b3a9"/>' +
      '<path d="M40 50a24 24 0 0 1 16-14" fill="none" stroke="#ffd9d3" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>';
  }

  function svgHongo() {
    var s = "", cx = 60, cy = 54;
    for (var k = 0; k <= 8; k++) {
      var a = Math.PI + (k / 8) * Math.PI, c = Math.cos(a), si = Math.sin(a);
      s += '<line x1="' + n(cx + c * 13) + '" y1="' + n(cy + si * 13) + '" x2="' + n(cx + c * 20) + '" y2="' + n(cy + si * 20) +
        '" stroke="#2f9e7e" stroke-width="3.5" stroke-linecap="round"/>';
      for (var j = 0; j < 3; j++) {
        var r = 24 + j * 8.5;
        s += '<circle cx="' + n(cx + c * r) + '" cy="' + n(cy + si * r) + '" r="' + (4.2 - j * 0.5) +
          '" fill="' + (j % 2 ? "#8fe0c4" : "#45bf98") + '" stroke="#2f9e7e" stroke-width="1.5"/>';
      }
    }
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<path d="M60 112c-3-14 3-26 0-46" fill="none" stroke="#2f9e7e" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M46 112h28" stroke="#2f9e7e" stroke-width="6" stroke-linecap="round"/>' + s +
      '<circle cx="60" cy="54" r="14" fill="#45bf98" stroke="#2f9e7e" stroke-width="3"/>' +
      '<path d="M52 51a9 9 0 0 1 8-7" stroke="#bff0de" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '</svg>';
  }

  function svgParasito() {
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<g fill="none" stroke="#e08a2a" stroke-width="2.6" stroke-linecap="round">' +
      '<path d="M57 100c-4 7 2 11-4 18M63 100c4 7-2 11 4 18"/>' +
      '<path d="M31 60c-8 2-10 10-18 10M89 60c8 2 10 10 18 10"/>' +
      '<path d="M42 84c-6 8-4 15-12 19M78 84c6 8 4 15 12 19"/></g>' +
      '<path d="M60 14c26 0 36 24 32 44-4 20-20 34-32 44-12-10-28-24-32-44-4-20 6-44 32-44z" fill="#ffb547" stroke="#e08a2a" stroke-width="3"/>' +
      '<ellipse cx="60" cy="44" rx="25" ry="19" fill="#ffd38c"/>' +
      '<path d="M60 58v42" stroke="#e08a2a" stroke-width="2"/>' +
      '<ellipse cx="49" cy="45" rx="8" ry="10" fill="#fff4e0" stroke="#c46d12" stroke-width="2"/>' +
      '<ellipse cx="71" cy="45" rx="8" ry="10" fill="#fff4e0" stroke="#c46d12" stroke-width="2"/>' +
      '<circle cx="49" cy="46" r="3" fill="#8a4a0c"/><circle cx="71" cy="46" r="3" fill="#8a4a0c"/>' +
      '<path d="M51 72q9-6 18 0" fill="none" stroke="#c46d12" stroke-width="3.5" stroke-linecap="round"/>' +
      '</svg>';
  }

  var ART = { anticuerpo: svgAnticuerpo(), virus: svgVirus(), hongo: svgHongo(), parasito: svgParasito() };

  function artHTML(src, foto) {
    if (ART[src]) return '<span class="art">' + ART[src] + "</span>";
    return '<span class="art' + (foto ? " photo" : "") + '"><img src="' + esc(src) + '" alt=""></span>';
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

  /* ---------- Datos ---------- */
  function normalizar(p, topicId) {
    if (!p || !p.pregunta) return null;
    var correcta, opciones;
    if (Array.isArray(p.opciones)) {
      opciones = p.opciones.map(String);
      correcta = typeof p.correcta === "number" ? opciones[p.correcta] : String(p.correcta == null ? "" : p.correcta);
      if (correcta && opciones.indexOf(correcta) < 0) opciones.unshift(correcta);
    } else {
      correcta = String(p.correcta == null ? "" : p.correcta);
      opciones = [correcta].concat((p.incorrectas || []).map(String));
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
      id: topicId + ":" + hash(String(p.pregunta)),
      topicId: topicId,
      apartado: p.apartado ? String(p.apartado).trim() : "General",
      grupo: grupo,
      texto: String(p.pregunta),
      correcta: correcta,
      incorrectas: incorrectas,
      excluir: (p.excluir || []).map(function (o) { return clave(String(o)); }),
      explicacion: p.explicacion ? String(p.explicacion) : "",
      imagen: p.imagen || null
    };
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

  var TOPICS = (Array.isArray(window.TEMAS) ? window.TEMAS : []).map(function (t, i) {
    var id = String(t.id || "tema" + i);
    return {
      id: id,
      nombre: t.nombre || "Tema " + (i + 1),
      icono: t.icono || "anticuerpo",
      preguntas: (t.preguntas || []).map(function (p) { return normalizar(p, id); }).filter(Boolean)
    };
  });
  var QUESTIONS = [];
  TOPICS.forEach(function (t) { QUESTIONS = QUESTIONS.concat(t.preguntas); });

  // Respuestas correctas de cada "grupo": sirven como opciones falsas para las otras preguntas del grupo.
  var GRUPOS = {};
  QUESTIONS.forEach(function (q) {
    if (!q.grupo) return;
    (GRUPOS[q.grupo] = GRUPOS[q.grupo] || []).push(q.correcta);
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
    var ajenas = shuffle(unicas((GRUPOS[q.grupo] || []).filter(function (o) {
      return libre(o) && q.incorrectas.map(clave).indexOf(clave(o)) < 0;
    })));
    var nAjenas = Math.floor(Math.random() * (Math.min(propias.length ? 2 : 3, ajenas.length) + 1));
    var malas = ajenas.slice(0, nAjenas);
    malas = malas.concat(propias.slice(0, 3 - malas.length));
    malas = malas.concat(ajenas.slice(nAjenas, nAjenas + 3 - malas.length));
    return shuffle([q.correcta].concat(malas));
  }

  function topicById(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return null;
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

  function stats(topicIds) {
    var answered = 0, correct = 0, total = 0;
    QUESTIONS.forEach(function (q) {
      if (topicIds.indexOf(q.topicId) < 0) return;
      total++;
      var r = store.progreso[q.id];
      if (r) { answered++; if (r.ok) correct++; }
    });
    return { answered: answered, correct: correct, total: total, pct: answered ? Math.round((correct / answered) * 100) : 0 };
  }

  function badgeClass(st) {
    if (!st.answered || st.pct === 0) return "";
    return st.pct >= 70 ? "good" : "mid";
  }

  function seleccionValida() {
    return store.seleccion.filter(function (id) {
      var t = topicById(id);
      return t && t.preguntas.length;
    });
  }

  /* ---------- Pantalla: Elige tus temas ---------- */
  function renderHome() {
    session = null;
    if (!TOPICS.length) {
      app.innerHTML = '<section class="screen"><header class="home-head"><h1>Elige tus temas</h1></header>' +
        '<div class="scroll"><p class="hint">Todavía no hay temas. Agrégalos en el archivo preguntas.js.</p></div></section>';
      return;
    }
    var sel = seleccionValida();
    app.innerHTML =
      '<section class="screen">' +
      '<header class="home-head"><h1>Elige tus temas</h1>' +
      '<button class="icon-btn" data-action="ajustes" aria-label="Ajustes">' + UI.gear + "</button></header>" +
      '<div class="scroll"><div class="topic-grid">' +
      TOPICS.map(function (t) {
        var st = stats([t.id]);
        return '<button class="topic" data-action="tema" data-id="' + esc(t.id) + '" aria-pressed="' + (sel.indexOf(t.id) >= 0) + '"' +
          (t.preguntas.length ? "" : " disabled") + ">" +
          '<span class="topic-circle">' + artHTML(t.icono) +
          '<span class="badge ' + badgeClass(st) + '">' + st.pct + "%</span></span>" +
          '<span class="topic-name">' + esc(t.nombre) + "</span>" +
          '<span class="topic-count">' + st.answered + "/" + st.total + "</span></button>";
      }).join("") +
      "</div></div>" +
      '<footer class="dock">' +
      '<p class="hint" id="hint"></p>' +
      '<div class="score-row"><strong>Puntaje promedio</strong><span class="mini" id="score-mini"></span>' +
      '<span class="val" id="score-val"></span></div>' +
      '<div class="bar"><i id="score-bar"></i></div>' +
      '<button class="btn btn-primary" data-action="empezar" id="btn-empezar">Comienza a aprender</button>' +
      "</footer></section>";
    updateHomeFooter();
  }

  function updateHomeFooter() {
    var sel = seleccionValida();
    var ids = sel.length ? sel : TOPICS.map(function (t) { return t.id; });
    var st = stats(ids);
    var one = sel.length === 1 ? topicById(sel[0]) : null;
    document.getElementById("score-mini").innerHTML = one ? artHTML(one.icono).replace('class="art"', 'class="art mini-art"') : "";
    document.getElementById("score-val").textContent = st.pct + "%";
    document.getElementById("score-bar").style.width = st.pct + "%";
    document.getElementById("btn-empezar").disabled = !sel.length;
    var hint = document.getElementById("hint");
    hint.textContent = sel.length ? "" : "Toca uno o varios temas para empezar.";
    hint.hidden = !!sel.length;
  }

  function toggleTopic(btn) {
    var id = btn.getAttribute("data-id");
    var i = store.seleccion.indexOf(id);
    if (i >= 0) store.seleccion.splice(i, 1); else store.seleccion.push(id);
    btn.setAttribute("aria-pressed", String(i < 0));
    save();
    updateHomeFooter();
  }

  /* ---------- Sesión de preguntas ---------- */
  var session = null;

  function poolDe(topicIds) {
    return QUESTIONS.filter(function (q) { return topicIds.indexOf(q.topicId) >= 0; });
  }

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

  /*
    Arma una estación: una parte de las preguntas que aún no salen en esta ronda.
    A veces se enfoca en uno o dos apartados (p. ej. Morfología) y a veces mezcla todo.
    Además mete algunas preguntas que fallaste en estaciones anteriores.
  */
  function armarEstacion(pool) {
    var total = Math.min(store.estaciones, pool.length);
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
    if (apartados.length > 1 && Math.random() < 0.65) {
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

  function startSession(topicIds, soloIds) {
    var pool = poolDe(topicIds);
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
      topicIds: topicIds,
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

  function renderQuestion() {
    var s = session, it = s.items[s.i], q = it.q, topic = topicById(q.topicId);
    s.elegido = null;
    s.enviado = false;
    var figura = q.imagen ? artHTML(q.imagen, true) : artHTML(topic.icono);
    app.innerHTML =
      '<section class="screen">' +
      '<header class="quiz-head">' +
      '<button class="icon-btn back" data-action="inicio" aria-label="Volver a los temas">' + UI.back + "</button>" +
      '<div class="quiz-title"><b>' + esc(topic.nombre) + "</b><small>" + etiquetaEstacion(s) + " · Pregunta " + (s.i + 1) + " de " + s.items.length + "</small></div>" +
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

    // Si la fallas, vuelve a salir más adelante en esta misma estación.
    s.veces[q.id] = (s.veces[q.id] || 0) + 1;
    var vuelve = !ok && s.veces[q.id] < MAX_VECES;
    if (vuelve) {
      var pos = Math.min(s.items.length, s.i + 1 + HUECO_REINTENTO);
      s.items.splice(pos, 0, { q: q, etiqueta: "Otra vez", opciones: armarOpciones(q) });
    }

    app.querySelectorAll(".opt").forEach(function (b) {
      var k = Number(b.getAttribute("data-k"));
      var esCorrecta = it.opciones[k] === q.correcta;
      b.disabled = true;
      if (esCorrecta) {
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
  function etiquetaEstacion(s) {
    return s.esRepaso ? "Repaso" : "Estación " + s.numero + " de " + s.total;
  }

  function renderResults() {
    var s = session;
    var ids = Object.keys(s.primero);
    var total = ids.length;
    var bien = ids.filter(function (id) { return s.primero[id]; }).length;
    var pct = total ? Math.round((bien / total) * 100) : 0;
    var fallas = s.fallidas;
    var rondaCompleta = !pendientesDe(poolDe(s.topicIds)).length;
    var titulo = pct >= 90 ? "¡Excelente!" : pct >= 70 ? "¡Muy bien!" : pct >= 50 ? "Vas por buen camino" : "Sigue practicando";
    var resumen = (s.esRepaso ? "Repaso terminado" : "Estación " + s.numero + " de " + s.total + " terminada") +
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
      "Las que falles vuelven a salir en la misma estación y en las siguientes.</p></div>" +
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
    var q = session && session.items[session.i].q;
    if (!q) return;
    closeOverlay();
    var src = q.imagen || topicById(q.topicId).icono;
    document.body.insertAdjacentHTML("beforeend",
      '<div class="overlay zoom-view" id="overlay" data-backdrop data-action="cerrar">' + artHTML(src, !!q.imagen) +
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
      case "empezar": startSession(seleccionValida()); break;
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
