const Game = (() => {
  let state = {
    players: [],      // [{ name, role, word, revealed }]
    category: '',
    word: '',
    phase: 'setup',
    votes: {},
    roundNumber: 0,
    scores: {},
    chaosActive: false,
    settings: {
      playerNames: [],
      impostorCount: 1,
      enabledCategories: [],
      jesterMode: false,
      chaosMode: false
    }
  };

  function getState() { return state; }

  function updateSettings(s) {
    Object.assign(state.settings, s);
  }

  function startRound() {
    const { playerNames, impostorCount, enabledCategories, jesterMode, chaosMode } = state.settings;

    const category = enabledCategories[Math.floor(Math.random() * enabledCategories.length)];
    const words = DATABASE[category];
    const mainWord = words[Math.floor(Math.random() * words.length)];
    const chaosActive = chaosMode && Math.random() < 0.2;

    if (chaosActive) {
      // TRYB CHAOSU: wszyscy są impostorami, nikt nie zna hasła
      state.players = playerNames.map(name => ({
        name, role: 'chaos', word: null, revealed: false
      }));
    } else {
      // Normalne przypisanie ról
      const indices = playerNames.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const impostorSet = new Set(indices.slice(0, impostorCount));
      const jesterIdx = (jesterMode && indices.length > impostorCount) ? indices[impostorCount] : -1;

      state.players = playerNames.map((name, i) => {
        let role, word;
        if (impostorSet.has(i)) {
          role = 'impostor'; word = null;
        } else if (i === jesterIdx) {
          role = 'jester'; word = mainWord;
        } else {
          role = 'player'; word = mainWord;
        }
        return { name, role, word, revealed: false };
      });
    }

    state.category = category;
    state.word = mainWord;
    state.chaosActive = chaosActive;
    state.phase = 'cards';
    state.votes = {};
    state.roundNumber++;

    playerNames.forEach(n => { if (!state.scores[n]) state.scores[n] = 0; });
  }

  function castVote(voter, targets) {
    state.votes[voter] = targets;
  }

  function resolveResults() {
    const tally = {};
    state.players.forEach(p => { tally[p.name] = 0; });
    Object.values(state.votes).forEach(targets => {
      (targets || []).forEach(t => { tally[t] = (tally[t] || 0) + 1; });
    });

    const sorted = [...state.players]
      .map(p => ({ ...p, votes: tally[p.name] || 0 }))
      .sort((a, b) => b.votes - a.votes);

    // W trybie chaosu nie ma warunków wygranej
    if (state.chaosActive) {
      state.phase = 'results';
      return { sorted, topkaNames: new Set(), allImpostorsCaught: false, jesterWins: false, impostorsWin: false, isChaos: true };
    }

    const topSize = state.settings.impostorCount;
    const topThreshold = sorted[topSize - 1]?.votes ?? 0;
    const topka = sorted.filter(p => p.votes >= topThreshold && p.votes > 0);
    const topkaNames = new Set(topka.map(p => p.name));

    const impostors = state.players.filter(p => p.role === 'impostor');
    const jester = state.players.find(p => p.role === 'jester');

    const allImpostorsCaught = impostors.every(p => topkaNames.has(p.name));
    const jesterWins = !!(jester && topkaNames.has(jester.name));
    const impostorsWin = !allImpostorsCaught;

    if (jesterWins) state.scores[jester.name] = (state.scores[jester.name] || 0) + 3;
    if (!impostorsWin) {
      state.players.filter(p => p.role === 'player').forEach(p => {
        state.scores[p.name] = (state.scores[p.name] || 0) + 2;
      });
    } else {
      impostors.forEach(p => { state.scores[p.name] = (state.scores[p.name] || 0) + 3; });
    }

    state.phase = 'results';
    return { sorted, topkaNames, allImpostorsCaught, jesterWins, impostorsWin, isChaos: false };
  }

  return { getState, updateSettings, startRound, castVote, resolveResults };
})();
