// ============================================
// FOREST CAFE — INTERACTION & SCROLL CHOREOGRAPHY (v3 - Fixed)
// ============================================
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
 
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
// ---- Nav background on scroll ----
const nav = document.getElementById('nav');
if (nav) {
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      if (self.scroll() > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  });
}
 
// ============================================
// HERO SECTION PIN & REVEAL
// ============================================

function revealHero() {

  if (typeof gsap === "undefined") return;

  const hero = document.querySelector("#hero");

  if (!hero) return;


  // Initial state

  gsap.set(
    [
      "#hero-layer-2 img",
      "#hero-layer-3 img",
      "#hero-layer-4 img"
    ],
    {
      yPercent: 100
    }
  );


  gsap.set(".hero-content", {
    opacity: 0,
    y: 50
  });


  gsap.set(
    [".card-left", ".card-right"],
    {
      opacity: 0,
      y: 50
    }
  );


  // Hero scroll animation

  const tl = gsap.timeline({

    scrollTrigger: {

      trigger: "#hero",

      start: "top top",

      end: "+=250%",

      scrub: 1,

      pin: true,

      anticipatePin: 1,

      invalidateOnRefresh: true

    }

  });


  tl
    .to(
      "#hero-layer-2 img",
      {
        yPercent: 12,
        ease: "none"
      }
    )

    .to(
      "#hero-layer-3 img",
      {
        yPercent: 8,
        ease: "none"
      },
      "-=0.3"
    )

    .to(
      "#hero-layer-4 img",
      {
        yPercent: 0,
        ease: "none"
      },
      "-=0.3"
    )

    .to(
      ".hero-content",
      {
        opacity: 1,
        y: 0,
        ease: "none"
      },
      "-=0.1"
    )

    .to(
      ".card-left",
      {
        opacity: 1,
        y: 0,
        ease: "none"
      },
      "<"
    )

    .to(
      ".card-right",
      {
        opacity: 1,
        y: 0,
        ease: "none"
      },
      "<"
    );

}
 
// ============================================
// LOADER → HERO START
// ============================================

window.addEventListener("DOMContentLoaded", () => {

  const loader = document.getElementById("loader");
  const loaderVideo = document.getElementById("loader-video");

  let finished = false;

  function startWebsite() {

    if (finished) return;

    finished = true;

    // Remove loader
    if (loader) {
      loader.classList.add("hidden");
    }

    // Allow scrolling
    document.body.style.overflow = "auto";

    // Small delay so browser can paint Hero
    requestAnimationFrame(() => {

      // HERO
      revealHero();

      // SOIL TO SIP
      initSoilToSip();

      // Recalculate GSAP positions
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }

    });

  }


  // ==========================================
  // REDUCED MOTION
  // ==========================================

  if (reduceMotion) {

    startWebsite();

    return;

  }


  // ==========================================
  // VIDEO LOADER
  // ==========================================

  if (loaderVideo) {

    // Make sure video starts
    loaderVideo.play().catch(() => {});


    // Video completed
    loaderVideo.addEventListener(
      "ended",
      startWebsite,
      { once: true }
    );


    // Safety fallback
    setTimeout(
      startWebsite,
      7000
    );

  } else {

    // No video → immediately start
    startWebsite();

  }

});

// ---- SOIL TO SIP — zigzag pinned scroll storytelling ----
const stages = gsap.utils.toArray('.sts-stage');
const notes = gsap.utils.toArray('.sts-cafe-note');
const dotsWrap = document.getElementById('sts-dots');

if (dotsWrap && stages.length > 0) {
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

  stages.forEach((stage, i) => {
    if (i === 0) return;
    const prevNote = notes[i - 1];
    const thisNote = notes[i];
    stsTl.to(stages[i - 1], { opacity: 0, x: (i % 2 === 1 ? -20 : 20), duration: 1 }, i);
    if (prevNote) stsTl.to(prevNote, { opacity: 0, duration: 0.7 }, i);
    stsTl.fromTo(stage, { opacity: 0, x: (i % 2 === 1 ? 20 : -20) }, { opacity: 1, x: 0, duration: 1 }, i);
    if (thisNote) stsTl.fromTo(thisNote, { opacity: 0 }, { opacity: 1, duration: 0.8 }, i + 0.1);
  });
}

// ---- LEAF MASK TRANSITION (Cafe -> Farmer) ----
const leafMask = document.getElementById('leaf-mask');
if (leafMask) {
  if (!reduceMotion) {
    gsap.to('#leaf-mask', {
      clipPath: 'circle(140% at 50% 50%)',
      ease: 'none',
      scrollTrigger: { trigger: '#leaf-transition', start: 'top 70%', end: 'bottom 30%', scrub: true }
    });
  } else {
    leafMask.style.clipPath = 'circle(140% at 50% 50%)';
  }
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
if (!reduceMotion && document.getElementById('cot-visual')) {
  gsap.fromTo('#cot-visual', { scale: 0.82, opacity: 0.7 }, {
    scale: 1, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '#tinycot', start: 'top 90%', end: 'top 20%', scrub: true }
  });
}

// ---- Owner layered parallax ----
if (!reduceMotion && document.getElementById('owner')) {
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

/* ============================================
   GLOBAL RESPONSIVE REFRESH
   ============================================ */

(function () {

  let resizeTimer;

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }

    }, 250);

  });

})();