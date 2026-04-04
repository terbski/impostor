// ============================================================
// ARCADE BOARD – uniwersalna tablica wyników w stylu retro
// Używana w: głosowaniu (live tally) i wynikach (wyniki końcowe)
// ============================================================

/**
 * Generuje pasek z bloków Unicode (8 znaków).
 * @param {number} count  – aktualna wartość
 * @param {number} max    – wartość maksymalna
 * @returns {string}
 */
function arcadeBar(count, max) {
  if (!max || count === 0) return '░░░░░░░░';
  var filled = Math.min(8, Math.round((count / max) * 8));
  return '█'.repeat(filled) + '░'.repeat(8 - filled);
}

/**
 * Renderuje tablicę arcade w podanym kontenerze.
 * @param {string}      containerId  – id elementu HTML do wypełnienia
 * @param {string}      title        – nagłówek tablicy (np. 'AKTUALNE GŁOSY')
 * @param {Array}       rows         – [{name, votes, nameClass?, roleLbl?, inTopka?}]
 * @param {string|null} winnerRow    – tekst wiersza zwycięzcy (null = brak)
 * @param {string|null} winnerColor  – kolor CSS zwycięzcy lub 'rainbow'
 */
function renderArcadeBoard(containerId, title, rows, winnerRow, winnerColor) {
  var maxVotes = Math.max(1, Math.max.apply(null, rows.map(function(r) { return r.votes || 0; })));

  var html = '<div class="arcade-board">';
  html += '<div class="arcade-board-title">' + escHtml(title) + '</div>';

  if (winnerRow) {
    if (winnerColor === 'rainbow') {
      html += '<div class="arcade-winner-row rainbow">' + winnerRow + '</div>';
    } else {
      html += '<div class="arcade-winner-row" style="color:' + winnerColor + '">' + winnerRow + '</div>';
    }
  }

  rows.forEach(function(row, i) {
    var bar     = arcadeBar(row.votes, maxVotes);
    var rowCls  = 'arcade-row' + (row.inTopka ? ' topka-row' : '');
    var nameCls = 'arcade-name ' + (row.nameClass || '');

    var nameInner = escHtml(row.name)
      + (row.roleLbl  ? ' <small>(' + row.roleLbl + ')</small>' : '')
      + (row.inTopka  ? ' <span class="arcade-topka">★</span>'  : '');

    html += '<div class="' + rowCls + '">'
      + '<span class="arcade-rank">' + (i + 1) + '.</span>'
      + '<span class="' + nameCls + '">' + nameInner + '</span>'
      + '<span class="arcade-bar">'   + bar + '</span>'
      + '<span class="arcade-score">' + (row.votes || 0) + '</span>'
      + '</div>';
  });

  html += '</div>';
  document.getElementById(containerId).innerHTML = html;
}
