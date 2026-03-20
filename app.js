/* ═══════════════════════════════════════════════
   CYBERPUNK TAROT — Main Application
   ═══════════════════════════════════════════════ */

const API = "__PORT_8000__".startsWith("__") ? "http://localhost:8000" : "__PORT_8000__";

// State
let currentMode = null;  // "single" or "three"
let selectedIndices = [];
let requiredCount = 0;
let drawnCards = [];

// ─── Screen Management ───
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
  // Re-trigger animation
  target.style.animation = 'none';
  target.offsetHeight; // reflow
  target.style.animation = '';
}

// ─── Start Reading ───
function startReading(mode) {
  currentMode = mode;
  selectedIndices = [];
  requiredCount = mode === 'single' ? 1 : 3;

  document.getElementById('select-count').textContent =
    `请选择 ${requiredCount} 张牌（已选 0/${requiredCount}）`;

  buildCardGrid();
  showScreen('screen-select');
}

// ─── Build Selection Grid ───
function buildCardGrid() {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = '';

  // Shuffle order for selection
  const indices = Array.from({ length: 22 }, (_, i) => i);
  shuffleArray(indices);

  indices.forEach(idx => {
    const card = document.createElement('button');
    card.className = 'tarot-card-pick';
    card.dataset.index = idx;
    card.setAttribute('aria-label', `塔罗牌 ${idx + 1}`);
    card.innerHTML = `
      <div class="card-back-pattern">
        <svg viewBox="0 0 40 60" fill="none">
          <path d="M20 5 L35 20 L20 55 L5 20 Z" stroke="currentColor" stroke-width="0.8"/>
          <circle cx="20" cy="25" r="8" stroke="currentColor" stroke-width="0.6"/>
          <line x1="20" y1="5" x2="20" y2="55" stroke="currentColor" stroke-width="0.4" stroke-dasharray="2 3"/>
        </svg>
      </div>
    `;
    card.addEventListener('click', () => toggleCard(card, idx));
    grid.appendChild(card);
  });
}

// ─── Toggle Card Selection ───
function toggleCard(el, idx) {
  const isSelected = selectedIndices.includes(idx);

  if (isSelected) {
    selectedIndices = selectedIndices.filter(i => i !== idx);
    el.classList.remove('selected');
  } else {
    if (selectedIndices.length >= requiredCount) return;
    selectedIndices.push(idx);
    el.classList.add('selected');
  }

  document.getElementById('select-count').textContent =
    `请选择 ${requiredCount} 张牌（已选 ${selectedIndices.length}/${requiredCount}）`;

  if (selectedIndices.length === requiredCount) {
    setTimeout(() => revealCards(), 400);
  }
}

// ─── Reveal Cards ───
function revealCards() {
  // Determine reversals randomly (30% chance)
  drawnCards = selectedIndices.map(idx => ({
    ...TAROT_CARDS[idx],
    is_reversed: Math.random() < 0.3
  }));

  const container = document.getElementById('drawn-cards');
  container.innerHTML = '';

  const positions = currentMode === 'three' ? ['过去', '现在', '未来'] : [null];

  drawnCards.forEach((card, i) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'revealed-card';

    const orientation = card.is_reversed ? '逆位' : '正位';
    const orientClass = card.is_reversed ? 'reversed-tag' : 'upright';
    const frontClass = card.is_reversed ? 'card-front reversed' : 'card-front';

    cardEl.innerHTML = `
      <div class="card-flipper" id="flipper-${i}">
        <div class="card-face card-back">
          <div class="card-back-inner">
            <svg viewBox="0 0 40 60" fill="none">
              <path d="M20 5 L35 20 L20 55 L5 20 Z" stroke="currentColor" stroke-width="0.8"/>
              <circle cx="20" cy="25" r="8" stroke="currentColor" stroke-width="0.6"/>
            </svg>
          </div>
        </div>
        <div class="card-face ${frontClass}">
          <span class="card-number">${toRoman(card.number)}</span>
          <span class="card-symbol">${card.symbol}</span>
          <span class="card-name-cn">${card.name}</span>
          <span class="card-name-en">${card.name_en}</span>
          <span class="card-orientation ${orientClass}">${orientation}</span>
        </div>
      </div>
      ${positions[i] ? `<div class="card-position-label">${positions[i]}</div>` : ''}
    `;
    container.appendChild(cardEl);
  });

  showScreen('screen-result');

  // Stagger flip animations
  drawnCards.forEach((_, i) => {
    setTimeout(() => {
      document.getElementById(`flipper-${i}`).classList.add('flipped');
    }, 300 + i * 400);
  });

  // Start AI reading after all cards flipped
  const flipDone = 300 + drawnCards.length * 400 + 500;
  setTimeout(() => fetchReading(), flipDone);
}

// ─── Fetch AI Reading ───
async function fetchReading() {
  const loader = document.getElementById('reading-loader');
  const textEl = document.getElementById('reading-text');
  const restartBtn = document.getElementById('restart-btn');

  loader.style.display = 'flex';
  textEl.classList.remove('visible');
  restartBtn.style.display = 'none';

  const question = document.getElementById('user-question').value.trim();

  try {
    const res = await fetch(`${API}/api/reading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: currentMode,
        cards: drawnCards.map(c => ({
          name: c.name,
          name_en: c.name_en,
          number: c.number,
          is_reversed: c.is_reversed
        })),
        question: question
      })
    });

    const data = await res.json();
    loader.style.display = 'none';
    textEl.textContent = data.reading;
    textEl.classList.add('visible');
    restartBtn.style.display = 'flex';
  } catch (err) {
    loader.style.display = 'none';
    textEl.textContent = '数据流中断... 神经网络连接异常，请稍后重试。';
    textEl.classList.add('visible');
    restartBtn.style.display = 'flex';
  }
}

// ─── Reset ───
function resetApp() {
  currentMode = null;
  selectedIndices = [];
  drawnCards = [];
  document.getElementById('user-question').value = '';
  showScreen('screen-landing');
}

// ─── Utilities ───
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function toRoman(num) {
  if (num === 0) return '0';
  const map = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let s = '';
  for (const [val, sym] of map) {
    while (num >= val) { s += sym; num -= val; }
  }
  return s;
}


/* ═══════════════════════════════════════════════
   BACKGROUND — Particle Network
   ═══════════════════════════════════════════════ */

(function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = Math.min(60, Math.floor(window.innerWidth / 25));

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(0,240,255,' : 'rgba(255,0,229,'
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw & update particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.5)';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
})();
