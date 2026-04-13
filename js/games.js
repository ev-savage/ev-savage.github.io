// ============================================================
// SAVAGE HUNT — whack-a-mole style game
// ============================================================
const HUNT_DURATION = 30;
const HUNT_HOLES    = 16;

// Targets: emoji, points, how long they stay visible (ms)
const HUNT_TARGETS = [
    { emoji: '🦌', pts: 1, speed: 1100 },
    { emoji: '🦆', pts: 2, speed: 900  },
    { emoji: '🐟', pts: 3, speed: 750  },
    { emoji: '🦃', pts: 5, speed: 580  },
];
// Spawn weights (out of 100) — deer most common, turkey rarest
const HUNT_WEIGHTS = [50, 25, 15, 10];

let huntScore         = 0;
let huntTimeLeft      = HUNT_DURATION;
let huntRunning       = false;
let huntTimerInterval = null;
let huntSpawnTimeout  = null;
let huntActiveHoles   = new Set();
let huntHoleTimers    = {};

// Build the 16-hole grid
const huntGrid = document.getElementById('huntGrid');
for (let i = 0; i < HUNT_HOLES; i++) {
    const hole = document.createElement('div');
    hole.className = 'hunt-hole';
    hole.innerHTML = `<div class="hunt-target" id="htarget-${i}"></div>`;
    hole.addEventListener('click', () => huntHit(i));
    huntGrid.appendChild(hole);
}

// Load saved high score
let huntBest = parseInt(localStorage.getItem('savageHuntBest') || '0');
document.getElementById('huntBest').textContent = huntBest;

function startHunt() {
    huntScore    = 0;
    huntTimeLeft = HUNT_DURATION;
    huntRunning  = true;
    huntActiveHoles.clear();

    for (let i = 0; i < HUNT_HOLES; i++) huntClearHole(i);

    document.getElementById('huntScore').textContent = '0';
    document.getElementById('huntTimer').textContent = HUNT_DURATION;
    document.getElementById('huntTimer').classList.remove('timer-urgent');
    const bar = document.getElementById('huntTimerBar');
    bar.style.width = '100%';
    bar.classList.remove('urgent');
    document.getElementById('huntOverlay').style.display = 'none';

    huntTimerInterval = setInterval(() => {
        huntTimeLeft--;
        const timerEl = document.getElementById('huntTimer');
        const barEl   = document.getElementById('huntTimerBar');
        timerEl.textContent = huntTimeLeft;
        barEl.style.width   = (huntTimeLeft / HUNT_DURATION * 100) + '%';
        if (huntTimeLeft <= 10) {
            timerEl.classList.add('timer-urgent');
            barEl.classList.add('urgent');
        }
        if (huntTimeLeft <= 0) huntEnd();
    }, 1000);

    huntScheduleSpawn();
}

function huntScheduleSpawn() {
    if (!huntRunning) return;
    const elapsed   = HUNT_DURATION - huntTimeLeft;
    const maxActive = elapsed < 5 ? 1 : elapsed < 12 ? 2 : elapsed < 20 ? 3 : 4;
    if (huntActiveHoles.size < maxActive) huntSpawn();
    const interval = Math.max(280, 880 - elapsed * 20);
    huntSpawnTimeout = setTimeout(huntScheduleSpawn, interval);
}

function huntSpawn() {
    const empty = [];
    for (let i = 0; i < HUNT_HOLES; i++) {
        if (!huntActiveHoles.has(i)) empty.push(i);
    }
    if (!empty.length) return;

    const idx  = empty[Math.floor(Math.random() * empty.length)];
    const roll = Math.random() * 100;
    let cum = 0, ti = 0;
    for (let i = 0; i < HUNT_WEIGHTS.length; i++) {
        cum += HUNT_WEIGHTS[i];
        if (roll < cum) { ti = i; break; }
    }
    const target   = HUNT_TARGETS[ti];
    const hole     = huntGrid.children[idx];
    const targetEl = document.getElementById(`htarget-${idx}`);

    targetEl.textContent  = target.emoji;
    targetEl.dataset.pts  = target.pts;
    huntActiveHoles.add(idx);
    hole.classList.add('active');

    huntHoleTimers[idx] = setTimeout(() => huntClearHole(idx), target.speed);
}

function huntClearHole(idx) {
    huntActiveHoles.delete(idx);
    clearTimeout(huntHoleTimers[idx]);
    const hole = huntGrid.children[idx];
    hole.classList.remove('active', 'hit', 'miss');
}

function huntHit(idx) {
    if (!huntRunning) return;
    const hole     = huntGrid.children[idx];
    const targetEl = document.getElementById(`htarget-${idx}`);

    if (huntActiveHoles.has(idx)) {
        const pts  = parseInt(targetEl.dataset.pts);
        huntScore += pts;
        document.getElementById('huntScore').textContent = huntScore;
        clearTimeout(huntHoleTimers[idx]);
        huntActiveHoles.delete(idx);
        hole.classList.add('hit');
        huntScorePop(hole, pts);
        setTimeout(() => {
            hole.classList.remove('active');
            setTimeout(() => hole.classList.remove('hit'), 150);
        }, 80);
    } else {
        hole.classList.add('miss');
        setTimeout(() => hole.classList.remove('miss'), 250);
    }
}

function huntScorePop(hole, pts) {
    const pop = document.createElement('div');
    pop.className = `score-pop pts-${pts}`;
    pop.textContent = `+${pts}`;
    hole.appendChild(pop);
    setTimeout(() => pop.remove(), 700);
}

function huntEnd() {
    huntRunning = false;
    clearInterval(huntTimerInterval);
    clearTimeout(huntSpawnTimeout);
    for (let i = 0; i < HUNT_HOLES; i++) huntClearHole(i);

    const isNewBest = huntScore > huntBest;
    if (isNewBest) {
        huntBest = huntScore;
        localStorage.setItem('savageHuntBest', huntBest);
        document.getElementById('huntBest').textContent = huntBest;
    }

    const overlay  = document.getElementById('huntOverlay');
    const titleEl  = document.getElementById('huntOverlayTitle');
    const subEl    = document.getElementById('huntOverlaySub');
    const btnEl    = document.getElementById('huntStartBtn');

    overlay.style.display = '';
    titleEl.textContent   = isNewBest ? '🏆 NEW HIGH SCORE!' : '🎯 TIME\'S UP!';
    subEl.innerHTML       = `You scored&nbsp;<strong style="color:var(--accent-green);font-family:'Orbitron',sans-serif;font-size:1.5em">${huntScore}</strong>&nbsp;points`
                          + (isNewBest ? '<br>🔥 That\'s a new best!' : `<br>Best so far: <strong>${huntBest}</strong>`);
    btnEl.textContent     = '🔄 PLAY AGAIN';
}


// ============================================================
// GAME TAB SWITCHER
// ============================================================
function switchGame(name) {
    document.querySelectorAll('.games-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.game === name);
    });
    ['snake', 'tetris', 'hunt', 'clicks'].forEach(g => {
        document.getElementById('panel-' + g).style.display = g === name ? '' : 'none';
    });
    if (name === 'snake')  setTimeout(snakeResize, 30);
    if (name === 'tetris') setTimeout(tetResize, 30);
}


// ============================================================
// SAVAGE TETRIS
// ============================================================
const TET_COLS = 10, TET_ROWS = 20;

const TET_PIECES = [
    { shape: [[1,1,1,1]],                         color: '#00d4ff' }, // I
    { shape: [[1,1],[1,1]],                       color: '#ffd700' }, // O
    { shape: [[0,1,0],[1,1,1]],                   color: '#b06aff' }, // T
    { shape: [[1,0],[1,0],[1,1]],                 color: '#ff7043' }, // L
    { shape: [[0,1],[0,1],[1,1]],                 color: '#00ff88' }, // J (flipped)
    { shape: [[0,1,1],[1,1,0]],                   color: '#ff4444' }, // S
    { shape: [[1,1,0],[0,1,1]],                   color: '#44ff88' }, // Z
];

let tBoard, tPiece, tNext, tScore, tLevel, tLines, tRunning, tInterval, tLockDelay;
let tBest = parseInt(localStorage.getItem('savageTetrisBest') || '0');
let tCell = 28;

const tCanvas  = document.getElementById('tetCanvas');
const tCtx     = tCanvas.getContext('2d');
const tNCanvas = document.getElementById('tetNext');
const tNCtx    = tNCanvas.getContext('2d');

document.getElementById('tetBest').textContent = tBest;

function tetResize() {
    const wrap = document.getElementById('tetCanvasWrap');
    if (!wrap || wrap.clientWidth === 0) return;
    tCell = Math.floor(Math.min(wrap.clientWidth - 100, 320) / TET_COLS);
    tCell = Math.max(18, tCell);
    tCanvas.width  = tCell * TET_COLS;
    tCanvas.height = tCell * TET_ROWS;
    tetDraw();
}
window.addEventListener('resize', tetResize);
setTimeout(tetResize, 80);

function tNewBoard() {
    return Array.from({ length: TET_ROWS }, () => Array(TET_COLS).fill(0));
}

function tRandomPiece() {
    const p = TET_PIECES[Math.floor(Math.random() * TET_PIECES.length)];
    return {
        shape: p.shape.map(r => [...r]),
        color: p.color,
        x: Math.floor((TET_COLS - p.shape[0].length) / 2),
        y: 0,
    };
}

function startTetris() {
    tBoard   = tNewBoard();
    tScore   = 0;
    tLevel   = 1;
    tLines   = 0;
    tRunning = true;
    document.getElementById('tetScore').textContent = '0';
    document.getElementById('tetLevel').textContent = '1';
    document.getElementById('tetOverlay').style.display = 'none';
    tNext  = tRandomPiece();
    tPiece = tRandomPiece();
    tPiece.x = Math.floor((TET_COLS - tPiece.shape[0].length) / 2);
    tPiece.y = 0;
    tetDrawNext();
    clearInterval(tInterval);
    tInterval = setInterval(tetTick, tetSpeed());
}

function tetSpeed() { return Math.max(80, 800 - (tLevel - 1) * 70); }

function tCollides(shape, ox, oy) {
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
            if (shape[r][c]) {
                const nx = ox + c, ny = oy + r;
                if (nx < 0 || nx >= TET_COLS || ny >= TET_ROWS) return true;
                if (ny >= 0 && tBoard[ny][nx]) return true;
            }
    return false;
}

function tLock() {
    for (let r = 0; r < tPiece.shape.length; r++)
        for (let c = 0; c < tPiece.shape[r].length; c++)
            if (tPiece.shape[r][c]) {
                if (tPiece.y + r < 0) { tetGameOver(); return; }
                tBoard[tPiece.y + r][tPiece.x + c] = tPiece.color;
            }
    tClearLines();
    tPiece = tNext;
    tPiece.x = Math.floor((TET_COLS - tPiece.shape[0].length) / 2);
    tPiece.y = 0;
    tNext = tRandomPiece();
    tetDrawNext();
    if (tCollides(tPiece.shape, tPiece.x, tPiece.y)) { tetGameOver(); return; }
}

function tClearLines() {
    let cleared = 0;
    for (let r = TET_ROWS - 1; r >= 0; r--) {
        if (tBoard[r].every(c => c !== 0)) {
            tBoard.splice(r, 1);
            tBoard.unshift(Array(TET_COLS).fill(0));
            cleared++;
            r++; // recheck same row index
        }
    }
    if (!cleared) return;
    tLines += cleared;
    const pts = [0, 100, 300, 500, 800][cleared] * tLevel;
    tScore += pts;
    document.getElementById('tetScore').textContent = tScore;
    const newLv = Math.min(15, 1 + Math.floor(tLines / 10));
    if (newLv > tLevel) {
        tLevel = newLv;
        document.getElementById('tetLevel').textContent = tLevel;
        clearInterval(tInterval);
        tInterval = setInterval(tetTick, tetSpeed());
    }
}

function tetTick() {
    if (!tRunning) return;
    if (tCollides(tPiece.shape, tPiece.x, tPiece.y + 1)) {
        tLock();
    } else {
        tPiece.y++;
    }
    tetDraw();
}

function tetMove(dir) {
    if (!tRunning) return;
    if (!tCollides(tPiece.shape, tPiece.x + dir, tPiece.y)) tPiece.x += dir;
    tetDraw();
}

function tetRotate() {
    if (!tRunning) return;
    const rot = tPiece.shape[0].map((_, i) => tPiece.shape.map(r => r[i]).reverse());
    // wall kick: try center, then shift left/right
    for (const kick of [0, 1, -1, 2, -2]) {
        if (!tCollides(rot, tPiece.x + kick, tPiece.y)) {
            tPiece.shape = rot;
            tPiece.x += kick;
            break;
        }
    }
    tetDraw();
}

function tetSoftDrop() {
    if (!tRunning) return;
    if (!tCollides(tPiece.shape, tPiece.x, tPiece.y + 1)) {
        tPiece.y++;
        tScore++;
        document.getElementById('tetScore').textContent = tScore;
    }
    tetDraw();
}

function tetHardDrop() {
    if (!tRunning) return;
    let dropped = 0;
    while (!tCollides(tPiece.shape, tPiece.x, tPiece.y + 1)) { tPiece.y++; dropped++; }
    tScore += dropped * 2;
    document.getElementById('tetScore').textContent = tScore;
    tLock();
    tetDraw();
}

function tGhostY() {
    let gy = tPiece.y;
    while (!tCollides(tPiece.shape, tPiece.x, gy + 1)) gy++;
    return gy;
}

function tetDraw() {
    tCtx.fillStyle = '#0a0a0a';
    tCtx.fillRect(0, 0, tCanvas.width, tCanvas.height);

    // Grid lines
    tCtx.strokeStyle = 'rgba(0,255,136,0.05)';
    tCtx.lineWidth = 0.5;
    for (let x = 0; x <= TET_COLS; x++) {
        tCtx.beginPath(); tCtx.moveTo(x * tCell, 0); tCtx.lineTo(x * tCell, tCanvas.height); tCtx.stroke();
    }
    for (let y = 0; y <= TET_ROWS; y++) {
        tCtx.beginPath(); tCtx.moveTo(0, y * tCell); tCtx.lineTo(tCanvas.width, y * tCell); tCtx.stroke();
    }

    // Locked board cells
    for (let r = 0; r < TET_ROWS; r++)
        for (let c = 0; c < TET_COLS; c++)
            if (tBoard[r][c]) tDrawCell(tCtx, c, r, tBoard[r][c], tCell, 1);

    if (!tPiece) return;

    // Ghost piece
    const gy = tGhostY();
    if (gy !== tPiece.y) {
        for (let r = 0; r < tPiece.shape.length; r++)
            for (let c = 0; c < tPiece.shape[r].length; c++)
                if (tPiece.shape[r][c])
                    tDrawCell(tCtx, tPiece.x + c, gy + r, tPiece.color, tCell, 0.18);
    }

    // Active piece
    for (let r = 0; r < tPiece.shape.length; r++)
        for (let c = 0; c < tPiece.shape[r].length; c++)
            if (tPiece.shape[r][c])
                tDrawCell(tCtx, tPiece.x + c, tPiece.y + r, tPiece.color, tCell, 1);
}

function tDrawCell(ctx, cx, cy, color, cell, alpha) {
    const gap = Math.max(1, Math.round(cell * 0.07));
    const r   = Math.max(2, Math.round(cell * 0.18));
    const x   = cx * cell + gap, y = cy * cell + gap;
    const w   = cell - gap * 2,  h = cell - gap * 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    if (alpha > 0.5) { ctx.shadowColor = color; ctx.shadowBlur = 8; }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x,     y + h, x,         y + h - r, r);
    ctx.lineTo(x,     y + r); ctx.arcTo(x,     y,     x + r,     y,         r);
    ctx.closePath();
    ctx.fill();
    // Shine highlight
    if (alpha > 0.5) {
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + gap, y + gap, w - gap * 2, Math.round(h * 0.35));
    }
    ctx.restore();
}

function tetDrawNext() {
    tNCtx.fillStyle = '#0a0a0a';
    tNCtx.fillRect(0, 0, tNCanvas.width, tNCanvas.height);
    if (!tNext) return;
    const cell  = Math.floor(Math.min(tNCanvas.width, tNCanvas.height) / 5);
    const offX  = Math.floor((tNCanvas.width  - tNext.shape[0].length * cell) / 2);
    const offY  = Math.floor((tNCanvas.height - tNext.shape.length    * cell) / 2);
    for (let r = 0; r < tNext.shape.length; r++)
        for (let c = 0; c < tNext.shape[r].length; c++)
            if (tNext.shape[r][c]) {
                const px = offX + c * cell, py = offY + r * cell;
                tNCtx.save();
                tNCtx.fillStyle   = tNext.color;
                tNCtx.shadowColor = tNext.color;
                tNCtx.shadowBlur  = 8;
                tNCtx.fillRect(px + 1, py + 1, cell - 2, cell - 2);
                tNCtx.restore();
            }
}

function tetGameOver() {
    tRunning = false;
    clearInterval(tInterval);
    const isNewBest = tScore > tBest;
    if (isNewBest) {
        tBest = tScore;
        localStorage.setItem('savageTetrisBest', tBest);
        document.getElementById('tetBest').textContent = tBest;
    }
    document.getElementById('tetOverlay').style.display = '';
    document.getElementById('tetOverlayTitle').textContent = isNewBest ? '🏆 NEW HIGH SCORE!' : '💀 GAME OVER';
    document.getElementById('tetOverlaySub').innerHTML =
        `Score: <strong style="color:var(--accent-green);font-family:'Orbitron',sans-serif;font-size:1.4em">${tScore}</strong>`
        + (isNewBest ? '<br>🔥 New record!' : `<br>Best so far: <strong>${tBest}</strong>`);
    document.getElementById('tetStartBtn').textContent = '🔄 PLAY AGAIN';
}

// Keyboard controls for Tetris
document.addEventListener('keydown', e => {
    const tetPanel = document.getElementById('panel-tetris');
    if (!tetPanel || tetPanel.style.display === 'none') return;
    const preventKeys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '];
    if (preventKeys.includes(e.key)) e.preventDefault();
    if (!tRunning) return;
    if (e.key === 'ArrowLeft')  tetMove(-1);
    if (e.key === 'ArrowRight') tetMove(1);
    if (e.key === 'ArrowUp')    tetRotate();
    if (e.key === 'ArrowDown')  tetSoftDrop();
    if (e.key === ' ')          tetHardDrop();
});


// ============================================================
// SAVAGE SNAKE
// ============================================================
const SCOLS = 20, SROWS = 20;
const SFOODS = [
    { emoji: '🦌', pts: 1, color: '#00ff88' },
    { emoji: '🦆', pts: 2, color: '#00d4ff' },
    { emoji: '🐟', pts: 3, color: '#b06aff' },
    { emoji: '🦃', pts: 5, color: '#ffd700' },
];
const SFOOD_W = [50, 28, 15, 7];

let sSnake, sDir, sNextDir, sFood, sScore, sFoodEaten, sLevel, sRunning, sInterval;
let sBest = parseInt(localStorage.getItem('savageSnakeBest') || '0');

const sCanvas = document.getElementById('snakeCanvas');
const sCtx    = sCanvas.getContext('2d');
let sCell = 20;
let sFlash = 0; // frames to flash green on eat

document.getElementById('snakeBestEl').textContent = sBest;

function snakeResize() {
    const wrap = document.getElementById('snakeCanvasWrap');
    if (!wrap || wrap.clientWidth === 0) return;
    sCell = Math.floor(Math.min(wrap.clientWidth, 440) / SCOLS);
    sCanvas.width  = sCell * SCOLS;
    sCanvas.height = sCell * SROWS;
    snakeDraw();
}

window.addEventListener('resize', snakeResize);
setTimeout(snakeResize, 80);

function sRR(x, y, w, h, r) {
    sCtx.beginPath();
    sCtx.moveTo(x + r, y);
    sCtx.lineTo(x + w - r, y);
    sCtx.arcTo(x + w, y,     x + w, y + r,     r);
    sCtx.lineTo(x + w, y + h - r);
    sCtx.arcTo(x + w, y + h, x + w - r, y + h, r);
    sCtx.lineTo(x + r, y + h);
    sCtx.arcTo(x,     y + h, x,         y + h - r, r);
    sCtx.lineTo(x,     y + r);
    sCtx.arcTo(x,     y,     x + r,     y,         r);
    sCtx.closePath();
}

// 3-2-1 countdown then go
function startSnake() {
    document.getElementById('snakeOverlay').style.display = 'none';
    let count = 3;
    sRunning = false;

    // Show countdown on canvas
    function drawCountdown(n) {
        snakeDraw();
        sCtx.save();
        sCtx.font = `bold ${Math.round(sCell * 4)}px Orbitron, sans-serif`;
        sCtx.textAlign = 'center';
        sCtx.textBaseline = 'middle';
        sCtx.fillStyle = n === 0 ? '#00ff88' : '#ffffff';
        sCtx.shadowColor = n === 0 ? '#00ff88' : '#ffffff';
        sCtx.shadowBlur = 30;
        sCtx.fillText(n === 0 ? 'GO!' : n, sCanvas.width / 2, sCanvas.height / 2);
        sCtx.restore();
    }

    // Reset state
    sSnake     = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    sDir       = { x: 1, y: 0 };
    sNextDir   = { x: 1, y: 0 };
    sScore     = 0;
    sFoodEaten = 0;
    sLevel     = 1;
    sFlash     = 0;
    document.getElementById('snakeScore').textContent = '0';
    document.getElementById('snakeLevel').textContent = '1';
    sSpawnFood();
    snakeDraw();
    drawCountdown(3);

    const tick = setInterval(() => {
        count--;
        snakeDraw();
        if (count > 0) {
            drawCountdown(count);
        } else {
            drawCountdown(0);
            clearInterval(tick);
            setTimeout(() => {
                sRunning = true;
                clearInterval(sInterval);
                sInterval = setInterval(snakeTick, 220);
            }, 500);
        }
    }, 800);
}

function snakeTick() {
    sDir = sNextDir;
    const head = { x: sSnake[0].x + sDir.x, y: sSnake[0].y + sDir.y };

    // Wrap walls — pass through edges instead of dying (more fun for beginners)
    head.x = (head.x + SCOLS) % SCOLS;
    head.y = (head.y + SROWS) % SROWS;

    // Only die if you hit yourself
    if (sSnake.some(s => s.x === head.x && s.y === head.y)) return snakeEnd();

    sSnake.unshift(head);
    if (head.x === sFood.x && head.y === sFood.y) {
        sScore += sFood.pts;
        sFoodEaten++;
        sFlash = 3;
        document.getElementById('snakeScore').textContent = sScore;
        // Speed up gently every 5 eaten, cap at 110ms
        const newLv = Math.min(8, 1 + Math.floor(sFoodEaten / 5));
        if (newLv > sLevel) {
            sLevel = newLv;
            document.getElementById('snakeLevel').textContent = sLevel;
            clearInterval(sInterval);
            sInterval = setInterval(snakeTick, Math.max(110, 220 - (sLevel - 1) * 14));
        }
        sSpawnFood();
    } else {
        sSnake.pop();
    }
    if (sFlash > 0) sFlash--;
    snakeDraw();
}

function sSpawnFood() {
    const empty = [];
    for (let x = 0; x < SCOLS; x++)
        for (let y = 0; y < SROWS; y++)
            if (!sSnake.some(s => s.x === x && s.y === y)) empty.push({ x, y });
    const pos = empty[Math.floor(Math.random() * empty.length)];
    const roll = Math.random() * 100;
    let cum = 0, fi = 0;
    for (let i = 0; i < SFOOD_W.length; i++) { cum += SFOOD_W[i]; if (roll < cum) { fi = i; break; } }
    sFood = { ...pos, ...SFOODS[fi] };
}

function snakeDraw() {
    // Background
    sCtx.fillStyle = sFlash > 0 ? 'rgba(0,255,136,0.08)' : '#0a0a0a';
    sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);

    // Grid
    sCtx.strokeStyle = 'rgba(0,255,136,0.05)';
    sCtx.lineWidth = 0.5;
    for (let x = 0; x <= SCOLS; x++) {
        sCtx.beginPath(); sCtx.moveTo(x * sCell, 0); sCtx.lineTo(x * sCell, sCanvas.height); sCtx.stroke();
    }
    for (let y = 0; y <= SROWS; y++) {
        sCtx.beginPath(); sCtx.moveTo(0, y * sCell); sCtx.lineTo(sCanvas.width, y * sCell); sCtx.stroke();
    }

    if (!sSnake || !sFood) return;

    // Food glow + emoji
    const fp = Math.round(sCell * 0.08);
    sCtx.save();
    sCtx.shadowColor = sFood.color;
    sCtx.shadowBlur  = 18;
    sCtx.fillStyle   = sFood.color + '30';
    sRR(sFood.x * sCell + fp, sFood.y * sCell + fp, sCell - fp * 2, sCell - fp * 2, 5);
    sCtx.fill();
    sCtx.restore();
    sCtx.font = `${Math.round(sCell * 0.76)}px serif`;
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(sFood.emoji, sFood.x * sCell + sCell / 2, sFood.y * sCell + sCell / 2 + 1);

    // Snake body
    const gap = Math.max(1, Math.floor(sCell * 0.1));
    const rad = Math.max(2, Math.round(sCell * 0.28));
    for (let i = sSnake.length - 1; i >= 0; i--) {
        const seg    = sSnake[i];
        const isHead = i === 0;
        const t      = 1 - i / sSnake.length;
        sCtx.save();
        if (isHead) {
            sCtx.shadowColor = '#00ff88';
            sCtx.shadowBlur  = 16;
            sCtx.fillStyle   = '#00ff88';
        } else {
            const g = Math.round(120 + t * 115);
            const a = (0.35 + t * 0.65).toFixed(2);
            sCtx.fillStyle = `rgba(0,${g},68,${a})`;
        }
        sRR(seg.x * sCell + gap, seg.y * sCell + gap, sCell - gap * 2, sCell - gap * 2, rad);
        sCtx.fill();
        sCtx.restore();

        if (isHead) {
            const es = Math.max(2, Math.round(sCell * 0.13));
            const c  = sCell;
            let e1x, e1y, e2x, e2y;
            if      (sDir.x ===  1) { e1x=0.70; e1y=0.28; e2x=0.70; e2y=0.72; }
            else if (sDir.x === -1) { e1x=0.30; e1y=0.28; e2x=0.30; e2y=0.72; }
            else if (sDir.y === -1) { e1x=0.28; e1y=0.30; e2x=0.72; e2y=0.30; }
            else                    { e1x=0.28; e1y=0.70; e2x=0.72; e2y=0.70; }
            sCtx.fillStyle = '#030303';
            sCtx.beginPath(); sCtx.arc(seg.x*c + e1x*c, seg.y*c + e1y*c, es, 0, Math.PI*2); sCtx.fill();
            sCtx.beginPath(); sCtx.arc(seg.x*c + e2x*c, seg.y*c + e2y*c, es, 0, Math.PI*2); sCtx.fill();
        }
    }
}

function snakeEnd() {
    sRunning = false;
    clearInterval(sInterval);

    // Flash red on death
    sCtx.save();
    sCtx.fillStyle = 'rgba(255,50,50,0.18)';
    sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
    sCtx.restore();

    const isNewBest = sScore > sBest;
    if (isNewBest) {
        sBest = sScore;
        localStorage.setItem('savageSnakeBest', sBest);
        document.getElementById('snakeBestEl').textContent = sBest;
    }
    document.getElementById('snakeOverlay').style.display = '';
    document.getElementById('snakeOverlayTitle').textContent = isNewBest ? '🏆 NEW HIGH SCORE!' : '💀 GAME OVER';
    document.getElementById('snakeOverlaySub').innerHTML =
        `Score: <strong style="color:var(--accent-green);font-family:'Orbitron',sans-serif;font-size:1.4em">${sScore}</strong>`
        + (isNewBest ? '<br>🔥 New record!' : `<br>Best so far: <strong>${sBest}</strong>`);
    document.getElementById('snakeStartBtn').textContent = '🔄 PLAY AGAIN';
}

// Arrow / WASD — always prevent scroll when snake tab is active
document.addEventListener('keydown', e => {
    const arrowKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    const snakePanel = document.getElementById('panel-snake');
    if (arrowKeys.includes(e.key) && snakePanel && snakePanel.style.display !== 'none') {
        e.preventDefault();
    }
    if (!sRunning) return;
    const map = {
        ArrowUp:    {x:0,y:-1}, W:{x:0,y:-1}, w:{x:0,y:-1},
        ArrowDown:  {x:0,y:1},  S:{x:0,y:1},  s:{x:0,y:1},
        ArrowLeft:  {x:-1,y:0}, A:{x:-1,y:0}, a:{x:-1,y:0},
        ArrowRight: {x:1,y:0},  D:{x:1,y:0},  d:{x:1,y:0},
    };
    if (!map[e.key]) return;
    const nd = map[e.key];
    if (nd.x !== -sDir.x || nd.y !== -sDir.y) sNextDir = nd;
});

function snakeSetDir(x, y) {
    if (!sRunning) return;
    if (x !== -sDir.x || y !== -sDir.y) sNextDir = { x, y };
}

// Swipe on canvas
let sTX = 0, sTY = 0;
sCanvas.addEventListener('touchstart', e => { sTX = e.touches[0].clientX; sTY = e.touches[0].clientY; e.preventDefault(); }, { passive: false });
sCanvas.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sTX;
    const dy = e.changedTouches[0].clientY - sTY;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    Math.abs(dx) > Math.abs(dy) ? snakeSetDir(dx > 0 ? 1 : -1, 0) : snakeSetDir(0, dy > 0 ? 1 : -1);
    e.preventDefault();
}, { passive: false });


// ============================================================
// SAVAGE CLICKS — COUNTER + MILESTONE REACTIONS
// ============================================================
let clicks = 0;

const milestones = [
    [0,    "Can you handle the Savage Zone? 👀"],
    [1,    "LET'S GO! Keep clicking! 🔥"],
    [5,    "You're warming up... 😏"],
    [10,   "Not bad... not bad at all."],
    [25,   "Getting into beast mode! 💪"],
    [50,   "FIFTY CLICKS! Going full savage! 🐻"],
    [75,   "You cannot stop. I respect it."],
    [100,  "ONE HUNDRED CLICKS! ABSOLUTELY SAVAGE! 🔥🔥🔥"],
    [150,  "At this point you just live here 😂"],
    [200,  "200 CLICKS?! You're built different. 🤯"],
    [300,  "Legend status: UNLOCKED 🏆"],
    [500,  "FIVE HUNDRED! YOU ARE THE SAVAGE ZONE! 👑"],
    [750,  "Okay this is getting out of hand..."],
    [1000, "1,000 CLICKS — HALL OF FAME! 🌟🌟🌟"]
];

function getReaction(n) {
    let msg = milestones[0][1];
    for (const [t, text] of milestones) { if (n >= t) msg = text; }
    return msg;
}

function handleClick() {
    clicks++;
    const numEl = document.getElementById('clickNumber');
    numEl.textContent = clicks.toLocaleString();
    numEl.classList.remove('pop');
    void numEl.offsetWidth;
    numEl.classList.add('pop');
    setTimeout(() => numEl.classList.remove('pop'), 200);
    document.getElementById('clickReaction').textContent = getReaction(clicks);
}
