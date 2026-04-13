// ============================================================
// TYPEWRITER ANIMATION
//
// Hey Everett! Change or add words to this list.
// Each word will type out and erase, one by one.
// ============================================================
const typewriterWords = [
    "Gamer.",
    "Hunter.",
    "Angler.",
    "Coder."
    // ← Add more words here! Example: "Athlete.", "Legend."
];

let twWordIdx = 0;
let twCharIdx = 0;
let twDeleting = false;
const twEl = document.getElementById('typewriterWord');

function runTypewriter() {
    const word = typewriterWords[twWordIdx];

    if (twDeleting) {
        twEl.textContent = word.substring(0, twCharIdx - 1);
        twCharIdx--;
    } else {
        twEl.textContent = word.substring(0, twCharIdx + 1);
        twCharIdx++;
    }

    let delay = twDeleting ? 75 : 120;

    if (!twDeleting && twCharIdx === word.length) {
        // Finished typing — pause then start deleting
        delay = 2000;
        twDeleting = true;
    } else if (twDeleting && twCharIdx === 0) {
        // Finished deleting — move to next word
        twDeleting = false;
        twWordIdx = (twWordIdx + 1) % typewriterWords.length;
        delay = 450;
    }

    setTimeout(runTypewriter, delay);
}

// Kick off the typewriter after the hero has faded in
setTimeout(runTypewriter, 1600);

// ---- Visitor counter (localStorage-based) ----
(function() {
    const BASE = 2000;
    const el = document.getElementById('visitor-count');
    let v = parseInt(localStorage.getItem('sz_visits') || '0') + 1;
    localStorage.setItem('sz_visits', v);
    el.textContent = (BASE + v).toLocaleString();
})();


// ============================================================
// DARK / LIGHT MODE TOGGLE
// ============================================================
function toggleTheme() {
    const html  = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeIcon').textContent  = isDark ? '🌙' : '☀️';
    document.getElementById('themeLabel').textContent = isDark ? 'DARK' : 'LIGHT';
}


// ============================================================
// MOBILE NAV HAMBURGER TOGGLE
// ============================================================
function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
}

// Close mobile menu when any link is tapped
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// ============================================================
// SAVAGE FACTS — RANDOM FACT GENERATOR
//
// Hey Everett! This is your fact vault. Add your own facts!
// Just copy any line below and change the text.
// The "category" label shows what topic the fact is from.
// ============================================================
const facts = [

    // ===== HUNTING FACTS — add more hunting facts here! =====
    {
        category: "🦌 Hunting",
        text: "White-tailed deer can sprint up to 30 mph and leap 8 feet into the air — they're basically superheroes of the forest."
    },
    {
        category: "🦌 Hunting",
        text: "A male turkey is called a 'tom' and they can gobble loud enough to be heard an entire mile away."
    },
    {
        category: "🦌 Hunting",
        text: "Deer can detect your scent from half a mile away — that's why hunters use scent-blocking sprays!"
    },
    {
        category: "🦌 Hunting",
        text: "A group of turkeys is called a 'rafter.' A group of deer is called a 'herd.' Random, but true."
    },
    {
        category: "🦌 Hunting",
        text: "Whitetail bucks shed and fully regrow their antlers EVERY single year. They're basically living skyscrapers on their heads."
    },
    {
        category: "🦌 Hunting",
        text: "The oldest hunting tools ever found are wooden spears from 400,000 years ago. Humans have always been hunters."
    },

    // ===== FISHING FACTS — add more fishing facts here! =====
    {
        category: "🎣 Fishing",
        text: "Largemouth bass have nearly 360-degree vision — they can see in almost every direction at once."
    },
    {
        category: "🎣 Fishing",
        text: "The world record largemouth bass weighed 22 lbs 4 oz. It was caught in Japan in 2009."
    },
    {
        category: "🎣 Fishing",
        text: "Fish don't have eyelids, so they literally never close their eyes. They sleep with their eyes open. Creepy? Yeah."
    },
    {
        category: "🎣 Fishing",
        text: "Catfish have about 100,000 taste buds spread all over their entire body — their SKIN can taste!"
    },
    {
        category: "🎣 Fishing",
        text: "The oldest fish fossil ever found is 530 million years old. Fish have been around way longer than dinosaurs."
    },
    {
        category: "🎣 Fishing",
        text: "Bass can sense vibrations in the water through a special organ called the 'lateral line' that runs down their sides."
    },

    // ===== BASEBALL FACTS — add more baseball facts here! =====
    {
        category: "⚾ Baseball",
        text: "A Major League baseball only lasts about 6-7 pitches before it gets replaced. Each game uses roughly 100 baseballs!"
    },
    {
        category: "⚾ Baseball",
        text: "The fastest pitch ever thrown was 105.1 mph by Aroldis Chapman in 2010. That's basically a speeding car."
    },
    {
        category: "⚾ Baseball",
        text: "Baseball is the only major team sport where the defense controls the ball. Pretty unique!"
    },
    {
        category: "⚾ Baseball",
        text: "The official rules of baseball were written in 1845. The game is almost 180 years old."
    },
    {
        category: "⚾ Baseball",
        text: "MLB teams play 162 games in a regular season — that's nearly one game every single day for 6 months."
    },
    {
        category: "⚾ Baseball",
        text: "There are exactly 108 double stitches on every official baseball. Someone has to sew all of those by hand."
    },

    // ===== ROBLOX FACTS — add more Roblox facts here! =====
    {
        category: "🎮 Roblox",
        text: "Roblox has over 200 million registered users and over 50 million people log in every single day."
    },
    {
        category: "🎮 Roblox",
        text: "Roblox was created in 2004 but didn't launch publicly until 2006 — it's been around longer than you have!"
    },
    {
        category: "🎮 Roblox",
        text: "There are over 40 million games on Roblox, and almost all of them were built by regular players."
    },
    {
        category: "🎮 Roblox",
        text: "The most-visited Roblox game of all time, MeepCity, has had over 10 BILLION visits. 10 billion!"
    },
    {
        category: "🎮 Roblox",
        text: "Roblox games are built with a real programming language called Lua. Playing Roblox teaches you actual coding!"
    },
    {
        category: "🎮 Roblox",
        text: "Some Roblox developers make over $1 million dollars a year selling virtual items. Gaming is a real career."
    }

    // ← Keep adding your own facts here! Copy the format above.
];

let factsDropped = 0;
let lastFactIdx   = -1;

function dropFact() {
    // Pick a random fact, making sure it's not the same as last time
    let idx;
    do {
        idx = Math.floor(Math.random() * facts.length);
    } while (idx === lastFactIdx && facts.length > 1);
    lastFactIdx = idx;

    const fact = facts[idx];
    factsDropped++;

    // Elements
    const box      = document.getElementById('factBox');
    const prompt   = document.getElementById('factPrompt');
    const catEl    = document.getElementById('factCat');
    const textEl   = document.getElementById('factText');
    const tallyEl  = document.getElementById('factTally');

    // Hide placeholder on first drop
    if (prompt) prompt.style.display = 'none';

    // Show fact elements
    catEl.style.display  = 'block';
    textEl.style.display = 'block';

    // Animate: briefly hide then fade in new content
    textEl.classList.remove('show');
    catEl.style.opacity = '0';

    setTimeout(() => {
        textEl.textContent = fact.text;
        catEl.textContent  = fact.category;

        textEl.classList.add('show');
        catEl.style.opacity   = '1';
        catEl.style.transition = 'opacity 0.4s ease';

        box.classList.add('lit');
    }, 180);

    // Update tally
    tallyEl.textContent = `${factsDropped} fact${factsDropped !== 1 ? 's' : ''} dropped  ·  ${facts.length} total in the vault`;
}


// ============================================================
// SCROLL REVEAL ANIMATION
//
// Watches for elements with class "reveal" and fades them in
// when they scroll into view. No changes needed here!
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Stagger cards in the grid for a cool sequential effect
        const grid  = entry.target.closest('.interests-grid');
        const delay = grid
            ? Array.from(grid.children).indexOf(entry.target) * 110
            : 0;

        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ============================================================
// HUNTING & FISHING GALLERY
// ============================================================
function openGallery() {
    document.getElementById('galleryModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeGallery(e) {
    if (e && e.target !== document.getElementById('galleryModal')) return;
    document.getElementById('galleryModal').classList.remove('open');
    document.body.style.overflow = '';
}

function openLightbox(src, label) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxLabel').textContent = label;
    lb.classList.add('open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        document.getElementById('galleryModal').classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ============================================================
// ARTEMIS III COUNTDOWN
// ============================================================
(function() {
    const A3_TARGET = new Date('2027-07-01T00:00:00Z');

    function a3Tick() {
        const now  = new Date();
        const diff = A3_TARGET - now;
        const set  = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        if (diff <= 0) {
            set('a3-days', '00');
            set('a3-hours', '00');
            set('a3-min', '00');
            set('a3-sec', '00');
            return;
        }

        set('a3-days',  String(Math.floor(diff / 86400000)));
        set('a3-hours', String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'));
        set('a3-min',   String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'));
        set('a3-sec',   String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'));
    }

    a3Tick();
    setInterval(a3Tick, 1000);
})();


// ============================================================
// AUTO FOOTER YEAR
//
// Updates itself automatically every year — no changes needed!
// ============================================================
document.getElementById('footerYear').textContent = new Date().getFullYear();
