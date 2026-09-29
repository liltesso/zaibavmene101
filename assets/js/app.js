// =====================================================
// app.js — Interactions, Carousel, Scroll Reveal
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initCarousel();
  initScrollReveal();
  initTelegram();
  initHaptics();
  initTouchGlow();
});

// ── Splash Screen ──────────────────────────────────
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => splash.classList.add('out'), 1000);
  setTimeout(() => splash.remove(), 1800);
}

// ── Auto Carousel with dots ────────────────────────
function initCarousel() {
  const track = document.querySelector('.carousel-track-wrap');
  const cards = document.querySelectorAll('.carousel-card');
  const dots  = document.querySelectorAll('.c-dot');
  if (!track || cards.length === 0) return;

  let current = 0;
  const count = cards.length;

  function goTo(index) {
    current = (index + count) % count;
    const slideW = cards[0].offsetWidth + 14; // 14 = gap
    track.scrollTo({ left: slideW * current, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Auto-advance every 4.5s
  let timer = setInterval(() => goTo(current + 1), 4500);

  // Pause on touch
  track.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
  track.addEventListener('touchend',   () => { timer = setInterval(() => goTo(current + 1), 4500); });

  // Sync dot on manual scroll
  track.addEventListener('scroll', () => {
    const slideW = cards[0].offsetWidth + 14;
    const idx = Math.round(track.scrollLeft / slideW);
    if (idx !== current) { current = idx; dots.forEach((d, i) => d.classList.toggle('active', i === idx)); }
  }, { passive: true });

  // Dots click
  dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(timer); goTo(i); }));
}

// ── IntersectionObserver Spring Reveal ─────────────
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// ── Telegram WebApp ────────────────────────────────
function initTelegram() {
  if (!window.Telegram?.WebApp) return;
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor('#020712');     } catch(_) {}
  try { tg.setBackgroundColor('#020712'); } catch(_) {}
}

// ── Haptic Feedback on touch ───────────────────────
function initHaptics() {
  document.querySelectorAll('a, .pressable').forEach(el => {
    el.addEventListener('touchstart', () => {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    }, { passive: true });
  });
}

// ── Interactive Neon Touch Glow ──────────────────────
function initTouchGlow() {
  document.querySelectorAll('.pressable, .shop-card').forEach(el => {
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      el.style.setProperty('--tx', `${x}px`);
      el.style.setProperty('--ty', `${y}px`);
    };

    const handleDown = (e) => {
      handleMove(e);
      el.classList.add('is-touched');
    };

    const handleUp = () => el.classList.remove('is-touched');

    el.addEventListener('mousedown', handleDown);
    el.addEventListener('mousemove', (e) => { if (el.classList.contains('is-touched')) handleMove(e); });
    el.addEventListener('mouseup', handleUp);
    el.addEventListener('mouseleave', handleUp);

    el.addEventListener('touchstart', handleDown, { passive: true });
    el.addEventListener('touchmove', handleMove, { passive: true });
    el.addEventListener('touchend', handleUp);
    el.addEventListener('touchcancel', handleUp);
  });
}
