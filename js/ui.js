const UI = (() => {
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  function renderSetup() {
    showScreen("screen-setup");
    document.getElementById("player-list").innerHTML = "";
  }

  function renderReveal(players) {
    showScreen("screen-reveal");
    const container = document.getElementById("reveal-cards");
    container.innerHTML = "";
    players.forEach((player, index) => {
      const card = document.createElement("div");
      card.className = "reveal-card";
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"><span>${player.name}</span><p>Dotknij, aby zobaczyć rolę</p></div>
          <div class="card-back">
            ${player.isImpostor
              ? `<span class="impostor-label">IMPOSTOR</span><p>Kategoria: <strong>${Game.getState().category}</strong></p>`
              : `<span class="player-label">GRACZ</span><p>Hasło: <strong>${player.word}</strong></p>`
            }
          </div>
        </div>`;
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
        if (card.classList.contains("flipped")) {
          Game.revealPlayer(index);
          checkAllRevealed();
        }
      });
      container.appendChild(card);
    });
  }

  function checkAllRevealed() {
    const allRevealed = Game.getState().players.every(p => p.revealed);
    document.getElementById("btn-start-discussion").style.display = allRevealed ? "block" : "none";
  }

  function renderDiscussion() {
    showScreen("screen-discussion");
    const { players, category, roundNumber } = Game.getState();
    document.getElementById("discussion-round").textContent = `Runda ${roundNumber}`;
    document.getElementById("discussion-category").textContent = `Kategoria: ${category}`;
    const list = document.getElementById("player-order");
    list.innerHTML = "";
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    shuffled.forEach((p, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${p.name}`;
      list.appendChild(li);
    });
  }

  function renderVoting() {
    showScreen("screen-voting");
    const { players } = Game.getState();
    document.getElementById("voting-status").textContent = "";
    const container = document.getElementById("voting-buttons");
    container.innerHTML = "";
    players.forEach(player => {
      const btn = document.createElement("button");
      btn.className = "vote-btn";
      btn.textContent = player.name;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".vote-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        document.getElementById("btn-confirm-vote").dataset.target = player.name;
      });
      container.appendChild(btn);
    });
  }

  function renderResults(result) {
    showScreen("screen-results");
    const { word, category, players, scores } = Game.getState();
    const impostorName = players.find(p => p.isImpostor).name;

    document.getElementById("result-winner").textContent =
      result.winner === "gracze" ? "Gracze wygrali!" : "Impostor wygrał!";
    document.getElementById("result-impostor").textContent = `Impostorem był: ${impostorName}`;
    document.getElementById("result-word").textContent = `Hasło: ${word} (Kategoria: ${category})`;

    const tallyEl = document.getElementById("result-tally");
    tallyEl.innerHTML = "<h3>Głosy:</h3>" + Object.entries(result.tally)
      .map(([name, count]) => `<p>${name}: ${count} głos(y)</p>`).join("");

    const scoresEl = document.getElementById("result-scores");
    scoresEl.innerHTML = "<h3>Punkty:</h3>" + Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([name, pts]) => `<p>${name}: ${pts} pkt</p>`).join("");
  }

  return { showScreen, renderSetup, renderReveal, renderDiscussion, renderVoting, renderResults };
})();
