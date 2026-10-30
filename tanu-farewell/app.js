const grid = document.getElementById('letterGrid');
const count = document.getElementById('noteCount');
const dialog = document.getElementById('letterDialog');
const dialogName = document.getElementById('dialogName');
const dialogMessage = document.getElementById('dialogMessage');
const dialogSignoff = document.getElementById('dialogSignoff');
const dialogPosition = document.getElementById('dialogPosition');
const prevButton = document.getElementById('prevLetter');
const nextButton = document.getElementById('nextLetter');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchNotes');
let letters = [];
let visibleLetters = [];
let activeIndex = 0;

const motifs = ['✳', '✧', '✿', '✦', '❋'];
function previewText(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > 112 ? `${clean.slice(0, 109).trim()}…` : clean;
}
function renderLetters(items) {
  grid.replaceChildren();
  visibleLetters = items;
  count.textContent = String(items.length).padStart(2, '0');
  emptyState.hidden = items.length !== 0;
  items.forEach((item, index) => {
    const originalIndex = letters.indexOf(item);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'message-card reveal';
    card.style.animationDelay = `${Math.min(index * 55, 440)}ms`;
    const idx = document.createElement('span');
    idx.className = 'card-index';
    idx.textContent = `A NOTE FOR TANU  /  ${String(originalIndex + 1).padStart(2, '0')}`;
    const flower = document.createElement('span');
    flower.className = 'card-flower';
    flower.setAttribute('aria-hidden', 'true');
    flower.textContent = motifs[originalIndex % motifs.length];
    const name = document.createElement('h3');
    name.className = 'card-name';
    name.textContent = item.name || 'A teammate';
    const preview = document.createElement('p');
    preview.className = 'card-preview';
    preview.textContent = `“${previewText(item.message)}”`;
    const open = document.createElement('span');
    open.className = 'card-open';
    open.textContent = 'Read the note  ↗';
    card.append(idx, flower, name, preview, open);
    card.addEventListener('click', () => openLetter(item));
    grid.append(card);
  });
}
function renderMessage(message) {
  dialogMessage.replaceChildren();
  String(message || '').split(/\n\s*\n/).forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    dialogMessage.append(p);
  });
}
function updateNavigation() {
  dialogPosition.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(visibleLetters.length).padStart(2, '0')}`;
  prevButton.disabled = activeIndex <= 0;
  nextButton.disabled = activeIndex >= visibleLetters.length - 1;
}
function openLetter(item) {
  activeIndex = visibleLetters.indexOf(item);
  if (activeIndex < 0) activeIndex = 0;
  showActiveLetter();
  if (!dialog.open) dialog.showModal();
}
function showActiveLetter() {
  const item = visibleLetters[activeIndex];
  if (!item) return;
  dialogName.textContent = item.name || 'A teammate';
  renderMessage(item.message);
  dialogSignoff.textContent = item.signoff || item.name || 'With love';
  updateNavigation();
}
function filterLetters() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filtered = letters.filter(item => item.name.toLocaleLowerCase().includes(query));
  renderLetters(filtered);
}
function launchConfetti(amount = 36) {
  const symbols = ['✳', '✦', '•', '✧', '♡'];
  const colors = ['#cb755e', '#9eaa8d', '#e9a989', '#d7bd8e', '#54786a'];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = `${10 + Math.random() * 15}px`;
    piece.style.setProperty('--drift', `${-110 + Math.random() * 220}px`);
    piece.style.animationDelay = `${Math.random() * .55}s`;
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 3500);
  }
}

document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
prevButton.addEventListener('click', () => { if (activeIndex > 0) { activeIndex--; showActiveLetter(); } });
nextButton.addEventListener('click', () => { if (activeIndex < visibleLetters.length - 1) { activeIndex++; showActiveLetter(); } });
document.getElementById('openLetters').addEventListener('click', () => {
  document.getElementById('letters').scrollIntoView({ behavior: 'smooth' });
  launchConfetti(30);
});
searchInput.addEventListener('input', filterLetters);
document.getElementById('surpriseMe').addEventListener('click', () => {
  if (!visibleLetters.length) return;
  const item = visibleLetters[Math.floor(Math.random() * visibleLetters.length)];
  openLetter(item);
});
document.getElementById('makeAWish').addEventListener('click', () => {
  document.getElementById('wishReveal').hidden = false;
  launchConfetti(55);
  document.getElementById('makeAWish').textContent = 'A little wish, sent with love ♡';
});

fetch('data/messages.json')
  .then(response => { if (!response.ok) throw new Error('Could not load the letters.'); return response.json(); })
  .then(items => {
    letters = Array.isArray(items) ? items : [];
    renderLetters(letters);
  })
  .catch(() => {
    grid.innerHTML = '<div class="loading-card">The letters could not be loaded. Please refresh the page.</div>';
    count.textContent = '—';
  });
