// Minimal UI helpers – main logic lives in index.html's inline script
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function roleLabel(role) {
  return { impostor: 'Impostor', jester: 'Jester', player: 'Gracz' }[role] || role;
}

function roleBadgeClass(role) {
  return `role-${role}`;
}
