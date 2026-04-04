// ============================================================
// RESULTS – ekran wyników końcowych
// Zależności: game.js, ui.js, arcade.js, setup.js
// ============================================================

function showResultsScreen() {
  var result = Game.resolveResults();
  var state  = Game.getState();
  showScreen('screen-results');

  document.getElementById('result-word-reveal').textContent =
    'Hasło: ' + state.word + '  |  Kategoria: ' + state.category;

  // Wiersz zwycięzcy – kolor odpowiadający klasie wygrywającej
  var winnerRow, winnerColor;
  if (result.isChaos) {
    winnerRow   = '⚡ TRYB CHAOSU – WSZYSCY IMPOSTORAMI ⚡';
    winnerColor = '#ffd700';
  } else if (result.jesterWins && result.allImpostorsCaught) {
    winnerRow   = '🃏 JESTER + GRACZE WYGRYWAJĄ';
    winnerColor = 'rainbow';
  } else if (result.jesterWins) {
    winnerRow   = '🃏 JESTER WYGRYWA';
    winnerColor = 'rainbow';
  } else if (!result.impostorsWin) {
    winnerRow   = '🟢 GRACZE WYGRYWAJĄ';
    winnerColor = '#2d9d5e';
  } else {
    winnerRow   = '🔴 IMPOSTOR WYGRYWA';
    winnerColor = '#e63946';
  }

  var rows = result.sorted.map(function(p) {
    return {
      name:      p.name,
      votes:     p.votes,
      nameClass: 'role-text-' + p.role + (p.role === 'jester' ? ' rainbow' : ''),
      roleLbl:   roleLabelShort(p.role),
      inTopka:   result.topkaNames.has(p.name)
    };
  });

  renderArcadeBoard('result-table', 'WYNIKI KOŃCOWE', rows, winnerRow, winnerColor);
}

function handleNewGame() {
  // Przywróć ustawienia z poprzedniej rundy
  document.getElementById('opt-jester').checked = setupState.jesterMode;
  document.getElementById('opt-chaos').checked  = setupState.chaosMode;
  document.getElementById('lbl-jester').classList.toggle('opt-active-jester', setupState.jesterMode);
  document.getElementById('lbl-chaos').classList.toggle('opt-active-chaos',   setupState.chaosMode);

  document.querySelectorAll('.cat-toggle').forEach(function(btn) {
    if (setupState.enabledCategories.has(btn.dataset.cat)) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  updateWordCount();
  renderPlayerList();
  clampImpostors();
  showScreen('screen-setup');
}
