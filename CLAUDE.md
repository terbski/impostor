# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Impostor** is a browser-based party game (no build step, no npm, no server). Open `index.html` directly in a browser to run it. All logic is vanilla JS with no dependencies.

## Running the Game

Open `index.html` in any browser. No build, install, or server required.

## Architecture

Single-page app with 5 screens managed by CSS `.active` class switching via `ui.js:showScreen()`. Script load order in `index.html` is significant — each file depends on the ones before it:

1. `js/data.js` — `DATABASE` constant: category name → array of words
2. `js/game.js` — `Game` IIFE module: single source of truth for all game state. Contains `state` (players, votes, scores, settings), plus `startRound()`, `castVote()`, `resolveResults()`
3. `js/ui.js` — shared helpers: `showScreen()`, `escHtml()`, `roleLabelShort()`
4. `js/arcade.js` — `renderArcadeBoard()`: reusable retro-style vote/score table used in both voting and results screens
5. `js/setup.js` — screen-setup logic; owns `setupState` (players list, category toggles, option checkboxes)
6. `js/cards.js` — screen-cards logic; flip animation, sequential per-player card reveal
7. `js/voting.js` — screen-voting logic; owns `votingState`, calls `Game.castVote()`
8. `js/results.js` — screen-results logic; calls `Game.resolveResults()`, renders arcade board with winner row

## Game Flow

```
screen-setup → screen-cards → screen-game → screen-voting → screen-results
     ↑                                                              |
     └──────────────────── handleNewGame() ────────────────────────┘
```

## Roles & Scoring

- `player` — knows word (+2 pts if impostors caught)
- `impostor` — knows only category (+3 pts if NOT caught)
- `jester` — knows word, wins if voted into topka (+3 pts)
- `chaos` — all players become impostors (20% chance when Chaos Mode enabled); no winner

"Topka" = top N players by votes (N = impostor count). Win condition is evaluated in `game.js:resolveResults()`.

## Adding Words / Categories

Edit `js/data.js` — add a key to `DATABASE` or append strings to an existing array. The category toggle buttons in setup are auto-generated from `Object.keys(DATABASE)`.
