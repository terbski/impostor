// ============================================================
// SETUP – stan i logika ekranu startowego
// Zależności: data.js, game.js, ui.js, cards.js
// ============================================================

var setupState = {
  playerNames:       [],
  impostorCount:     1,
  enabledCategories: new Set(Object.keys(DATABASE)),
  jesterMode:        false,
  chaosMode:         false
};

// ---------- Kategorie ----------

function renderCategoryToggles() {
  var container = document.getElementById('category-toggles');
  container.innerHTML = '';
  Object.keys(DATABASE).forEach(function(cat) {
    var btn = document.createElement('button');
    btn.className    = 'cat-toggle active';
    btn.textContent  = cat;
    btn.dataset.cat  = cat;
    btn.onclick = function() { toggleCategory(cat, btn); };
    container.appendChild(btn);
  });
}

function toggleCategory(cat, btn) {
  if (setupState.enabledCategories.has(cat)) {
    setupState.enabledCategories.delete(cat);
    btn.classList.remove('active');
  } else {
    setupState.enabledCategories.add(cat);
    btn.classList.add('active');
  }
  updateWordCount();
}

function updateWordCount() {
  var total = 0;
  setupState.enabledCategories.forEach(function(cat) {
    if (DATABASE[cat]) total += DATABASE[cat].length;
  });
  document.getElementById('words-count-badge').textContent = total + ' haseł';
}

// ---------- Gracze ----------

function addPlayer() {
  var input = document.getElementById('input-player');
  var name  = input.value.trim();
  if (!name || setupState.playerNames.includes(name)) return;
  setupState.playerNames.push(name);
  input.value = '';
  renderPlayerList();
  clampImpostors();
}

function removePlayer(i) {
  setupState.playerNames.splice(i, 1);
  renderPlayerList();
  clampImpostors();
}

function renderPlayerList() {
  var ul = document.getElementById('player-list');
  ul.innerHTML = '';
  setupState.playerNames.forEach(function(name, i) {
    var li = document.createElement('li');
    li.className = 'player-item';
    li.innerHTML = '<span>' + (i + 1) + '. ' + escHtml(name) + '</span>'
      + '<button class="btn-remove" onclick="removePlayer(' + i + ')">✕</button>';
    ul.appendChild(li);
  });
  document.getElementById('player-count-badge').textContent = setupState.playerNames.length;
}

// ---------- Liczba impostorów ----------

function changeImpostors(delta) {
  var max = Math.max(1, Math.floor(setupState.playerNames.length / 2));
  setupState.impostorCount = Math.max(1, Math.min(max, setupState.impostorCount + delta));
  document.getElementById('impostor-display').textContent = setupState.impostorCount;
}

function clampImpostors() {
  var max = Math.max(1, Math.floor(setupState.playerNames.length / 2));
  if (setupState.impostorCount > max) setupState.impostorCount = max;
  document.getElementById('impostor-display').textContent = setupState.impostorCount;
}

// ---------- Opcje dodatkowe ----------

function syncOptionStyle(which) {
  setTimeout(function() {
    var jChecked = document.getElementById('opt-jester').checked;
    var cChecked = document.getElementById('opt-chaos').checked;
    document.getElementById('lbl-jester').classList.toggle('opt-active-jester', jChecked);
    document.getElementById('lbl-chaos').classList.toggle('opt-active-chaos',   cChecked);
  }, 0);
}

// ---------- Start gry ----------

function handleStart() {
  if (setupState.playerNames.length < 3) {
    alert('Potrzeba co najmniej 3 graczy!'); return;
  }
  if (setupState.enabledCategories.size === 0) {
    alert('Wybierz co najmniej jedną kategorię!'); return;
  }

  var jesterMode = document.getElementById('opt-jester').checked;
  var chaosMode  = document.getElementById('opt-chaos').checked;
  var minPlayers = setupState.impostorCount + (jesterMode ? 2 : 1);

  if (setupState.playerNames.length < minPlayers) {
    alert('Za mało graczy! Potrzeba co najmniej ' + minPlayers + '.'); return;
  }

  setupState.jesterMode = jesterMode;
  setupState.chaosMode  = chaosMode;

  Game.updateSettings({
    playerNames:       setupState.playerNames.slice(),
    impostorCount:     setupState.impostorCount,
    enabledCategories: Array.from(setupState.enabledCategories),
    jesterMode:        jesterMode,
    chaosMode:         chaosMode
  });

  Game.startRound();
  startCardReveal();
}

// ---------- Inicjalizacja ----------

document.getElementById('input-player').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addPlayer();
});

renderCategoryToggles();
renderPlayerList();
updateWordCount();
