// ============================================================
// UI HELPERS – nawigacja ekranów i narzędzia współdzielone
// ============================================================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function roleLabelShort(role) {
  return { impostor: 'Impostor', jester: 'Jester', player: 'Gracz', chaos: 'Impostor' }[role] || role;
}
