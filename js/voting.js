// ============================================================
// VOTING – logika fazy głosowania
// Zależności: game.js, ui.js, arcade.js, results.js
// ============================================================

var votingState = { order: [], currentIndex: 0, selected: [] };

function startVotingPhase() {
  var players = Game.getState().players;
  votingState.order        = players.map(function(p) { return p.name; });
  votingState.currentIndex = 0;
  votingState.selected     = [];
  showScreen('screen-voting');
  renderVotingRound();
}

function renderVotingRound() {
  var state    = Game.getState();
  var maxVotes = state.settings.impostorCount;
  var voter    = votingState.order[votingState.currentIndex];

  document.getElementById('voter-name').textContent = voter;
  document.getElementById('vote-hint').textContent  =
    'Wybierz maksymalnie ' + maxVotes + ' podejrzan' + (maxVotes === 1 ? 'ego' : 'ych');

  votingState.selected = [];

  var container = document.getElementById('vote-candidates');
  container.innerHTML = '';
  state.players.forEach(function(p) {
    if (p.name === voter) return;
    var btn = document.createElement('button');
    btn.className   = 'btn-candidate';
    btn.textContent = p.name;
    btn.dataset.name = p.name;
    btn.onclick = function() { toggleCandidate(btn, p.name); };
    container.appendChild(btn);
  });

  refreshVoteTally();
}

function toggleCandidate(btn, name) {
  var maxVotes = Game.getState().settings.impostorCount;
  var idx = votingState.selected.indexOf(name);
  if (idx !== -1) {
    votingState.selected.splice(idx, 1);
    btn.classList.remove('selected');
  } else if (votingState.selected.length < maxVotes) {
    votingState.selected.push(name);
    btn.classList.add('selected');
  }
}

function refreshVoteTally() {
  var state = Game.getState();
  var tally = {};
  state.players.forEach(function(p) { tally[p.name] = 0; });
  Object.values(state.votes).forEach(function(targets) {
    (targets || []).forEach(function(t) { tally[t] = (tally[t] || 0) + 1; });
  });

  var rows = Object.entries(tally)
    .sort(function(a, b) { return b[1] - a[1]; })
    .map(function(e) { return { name: e[0], votes: e[1] }; });

  renderArcadeBoard('vote-tally-section', 'AKTUALNE GŁOSY', rows, null, null);
}

function confirmVote() {
  var voter = votingState.order[votingState.currentIndex];
  Game.castVote(voter, votingState.selected.slice());
  advanceVote();
}

function skipVote() {
  var voter = votingState.order[votingState.currentIndex];
  Game.castVote(voter, []);
  advanceVote();
}

function advanceVote() {
  votingState.currentIndex++;
  if (votingState.currentIndex >= votingState.order.length) {
    showResultsScreen();
  } else {
    renderVotingRound();
  }
}
