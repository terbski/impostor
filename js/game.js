const Game = (() => {
  let state = {
    players: [],       // [{ name, isImpostor, word }]
    category: "",
    word: "",
    impostorIndex: -1,
    phase: "setup",    // setup | reveal | discussion | voting | results
    votes: {},
    roundNumber: 0,
    scores: {}
  };

  function getState() {
    return state;
  }

  function startGame(playerNames) {
    if (playerNames.length < 3) {
      throw new Error("Potrzeba co najmniej 3 graczy.");
    }

    const categories = Object.keys(DATABASE);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const words = DATABASE[category];
    const word = words[Math.floor(Math.random() * words.length)];

    const impostorIndex = Math.floor(Math.random() * playerNames.length);

    state.players = playerNames.map((name, i) => ({
      name,
      isImpostor: i === impostorIndex,
      word: i === impostorIndex ? null : word,
      revealed: false
    }));

    state.category = category;
    state.word = word;
    state.impostorIndex = impostorIndex;
    state.phase = "reveal";
    state.votes = {};
    state.roundNumber += 1;

    playerNames.forEach(name => {
      if (!state.scores[name]) state.scores[name] = 0;
    });
  }

  function revealPlayer(index) {
    state.players[index].revealed = true;
    const allRevealed = state.players.every(p => p.revealed);
    if (allRevealed) state.phase = "discussion";
  }

  function startVoting() {
    state.phase = "voting";
  }

  function castVote(voterName, targetName) {
    state.votes[voterName] = targetName;
  }

  function resolveVoting() {
    const tally = {};
    Object.values(state.votes).forEach(target => {
      tally[target] = (tally[target] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(tally));
    const eliminated = Object.keys(tally).filter(k => tally[k] === maxVotes);
    const impostorName = state.players[state.impostorIndex].name;

    let result;
    if (eliminated.length === 1 && eliminated[0] === impostorName) {
      result = { winner: "gracze", eliminated: eliminated[0], tally };
      state.scores[impostorName] = (state.scores[impostorName] || 0);
    } else {
      result = { winner: "impostor", eliminated: eliminated, tally };
      state.scores[impostorName] = (state.scores[impostorName] || 0) + 2;
    }

    state.phase = "results";
    return result;
  }

  function resetRound() {
    state.phase = "setup";
    state.players = [];
    state.category = "";
    state.word = "";
    state.votes = {};
  }

  return { getState, startGame, revealPlayer, startVoting, castVote, resolveVoting, resetRound };
})();
