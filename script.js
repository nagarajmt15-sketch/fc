// ============================================
// FOREST CAFE — INTERACTION & SCROLL CHOREOGRAPHY (v2)
// ============================================
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Loading screen: Play full video before reveal ----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const loaderVideo = document.getElementById('loader-video');
  const MAX_LOADER_MS = 7000; // Video duration cap (7s)

  const finishLoading = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    revealHero();
    ScrollTrigger.refresh();
  };

  if (reduceMotion) { setTimeout(finishLoading, 100); return; }

  let done = false;
  const safeFinish = () => { if (!done) { done = true; finishLoading(); } };

  // Video full-a play aagi mudicha apram thaan website reveal aagum
  if (loaderVideo) {
    loaderVideo.addEventListener('ended', safeFinish, { once: true });
  }
  
  // Fallback safety timeout
  setTimeout(safeFinish, MAX_LOADER_MS);
});


// ---- Nav background on scroll ----
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 100,
  onUpdate: (self) => {
    if (self.scroll() > 80) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});

// ---- Hero parallax + seed pulse ----
if (!reduceMotion) {
  gsap.to('#hero-img', {
    yPercent: 15, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('#hero-seed', { scale: 1.25, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

// ---- Generic reveal-on-scroll ----
document.querySelectorAll('section:not(#hero) .reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

// ---- SOIL TO SIP — zigzag pinned scroll storytelling ----
const stages = gsap.utils.toArray('.sts-stage');
const notes = gsap.utils.toArray('.sts-cafe-note');
const dotsWrap = document.getElementById('sts-dots');
stages.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'sts-dot' + (i === 0 ? ' active' : '');
  dotsWrap.appendChild(dot);
});
const dots = gsap.utils.toArray('.sts-dot');

gsap.set(stages[0], { opacity: 1 });
if (notes[0]) gsap.set(notes[0], { opacity: 1 });

const stsTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#soil-to-sip',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => {
      const idx = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }
});

// Each stage image pairs 1:1 with the cafe-note on the opposite side;
// both fade out together as the next stage/note pair fades in.
stages.forEach((stage, i) => {
  if (i === 0) return;
  const prevNote = notes[i - 1];
  const thisNote = notes[i];
  stsTl.to(stages[i - 1], { opacity: 0, x: (i % 2 === 1 ? -20 : 20), duration: 1 }, i);
  if (prevNote) stsTl.to(prevNote, { opacity: 0, duration: 0.7 }, i);
  stsTl.fromTo(stage, { opacity: 0, x: (i % 2 === 1 ? 20 : -20) }, { opacity: 1, x: 0, duration: 1 }, i);
  if (thisNote) stsTl.fromTo(thisNote, { opacity: 0 }, { opacity: 1, duration: 0.8 }, i + 0.1);
});

// ---- LEAF MASK TRANSITION (Cafe -> Farmer) ----
if (!reduceMotion) {
  gsap.to('#leaf-mask', {
    clipPath: 'circle(140% at 50% 50%)',
    ease: 'none',
    scrollTrigger: { trigger: '#leaf-transition', start: 'top 70%', end: 'bottom 30%', scrub: true }
  });
} else {
  document.getElementById('leaf-mask').style.clipPath = 'circle(140% at 50% 50%)';
}

// ---- TINY COT PATH JOURNEY — MotionPathPlugin ----
const pathEl = document.getElementById('path-line');
const marker = document.getElementById('path-marker');
if (pathEl && marker) {
  gsap.set(marker, { motionPath: { path: pathEl, align: pathEl, alignOrigin: [0.5, 0.5], start: 0 } });
  gsap.to(marker, {
    motionPath: { path: pathEl, align: pathEl, alignOrigin: [0.5, 0.5], start: 0, end: 1 },
    ease: 'none',
    scrollTrigger: { trigger: '#tinycot-path', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });

  const caps = ['#cap-1', '#cap-2', '#cap-3', '#cap-4'];
  caps.forEach((sel, i) => {
    gsap.to(sel, {
      opacity: 1, duration: 0.5,
      scrollTrigger: {
        trigger: '#tinycot-path',
        start: `top+=${i * 22}% top`,
        end: `top+=${i * 22 + 18}% top`,
        scrub: 0.4
      }
    });
  });
}

// ---- Tiny Cot camera-approach ----
if (!reduceMotion) {
  gsap.fromTo('#cot-visual', { scale: 0.82, opacity: 0.7 }, {
    scale: 1, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '#tinycot', start: 'top 90%', end: 'top 20%', scrub: true }
  });
}

// ---- Owner layered parallax ----
if (!reduceMotion) {
  gsap.to('#owner-layer-back', {
    yPercent: -14, ease: 'none',
    scrollTrigger: { trigger: '#owner', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.to('#owner-layer-front', {
    yPercent: 10, ease: 'none',
    scrollTrigger: { trigger: '#owner', start: 'top bottom', end: 'bottom top', scrub: true }
  });
}

// ---- Menu track: wheel-to-horizontal-scroll ----
const menuTrack = document.getElementById('menu-track');
if (menuTrack) {
  menuTrack.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) menuTrack.scrollLeft += e.deltaY;
  }, { passive: true });
}
