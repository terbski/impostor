// ============================================================
// CARDS – logika odkrywania kart postaci
// Zależności: game.js, ui.js
// ============================================================

var cardState = { currentIndex: 0, flipped: false, locked: false };

function startCardReveal() {
  cardState.currentIndex = 0;
  cardState.flipped      = false;
  cardState.locked       = false;
  showScreen('screen-cards');
  renderCurrentCard();
}

function renderCurrentCard() {
  var players = Game.getState().players;
  var player  = players[cardState.currentIndex];

  document.getElementById('pass-overlay').classList.add('hidden');
  document.getElementById('card-wrap').classList.remove('hidden');

  var flipCard = document.getElementById('flip-card');
  flipCard.classList.remove('flipped');
  cardState.flipped = false;
  cardState.locked  = false;

  document.getElementById('card-front').innerHTML =
    '<p class="card-tap-hint">Dotknij, aby zobaczyć rolę</p>'
    + '<span class="card-player-name">' + escHtml(player.name) + '</span>';

  document.getElementById('card-back').innerHTML = buildCardBack(player);
}

function buildCardBack(player) {
  var cat = Game.getState().category;

  if (player.role === 'impostor' || player.role === 'chaos') {
    return '<span class="role-badge role-impostor">IMPOSTOR</span>'
      + '<p class="card-word-blank">– – –</p>'
      + '<p class="card-hint-bottom"><em>Wskazówka: ' + escHtml(cat) + '</em></p>';
  }
  if (player.role === 'jester') {
    return '<span class="role-badge role-jester rainbow">JESTER</span>'
      + '<p class="card-word">' + escHtml(player.word) + '</p>'
      + '<p class="card-hint-bottom"><em>Wskazówka: ' + escHtml(cat) + '</em></p>'
      + '<p class="card-jester-hint">Twoim zadaniem jest zostać wskazanym jako Impostor!</p>';
  }
  // Zwykły gracz
  return '<span class="role-badge role-player">GRACZ</span>'
    + '<p class="card-word">' + escHtml(player.word) + '</p>'
    + '<p class="card-hint-bottom"><em>Wskazówka: ' + escHtml(cat) + '</em></p>';
}

function handleCardClick() {
  if (cardState.locked) return;
  var flipCard = document.getElementById('flip-card');
  if (!cardState.flipped) {
    flipCard.classList.add('flipped');
    cardState.flipped = true;
  } else {
    flipCard.classList.remove('flipped');
    cardState.locked = true;
    setTimeout(showPassMessage, 500);
  }
}

function showPassMessage() {
  var players = Game.getState().players;
  document.getElementById('card-wrap').classList.add('hidden');
  document.getElementById('pass-overlay').classList.remove('hidden');

  var nextIdx = cardState.currentIndex + 1;
  var msgEl   = document.getElementById('pass-msg-text');

  if (nextIdx < players.length) {
    msgEl.innerHTML = 'Przekaż urządzenie graczowi:<br/><strong>'
      + escHtml(players[nextIdx].name) + '</strong>';
  } else {
    msgEl.textContent = 'Wszyscy gracze sprawdzili swoje karty!';
  }
}

function nextCard() {
  var players = Game.getState().players;
  cardState.currentIndex++;
  if (cardState.currentIndex >= players.length) {
    showScreen('screen-game');
  } else {
    renderCurrentCard();
  }
}
