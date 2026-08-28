// ============================================
// FOREST CAFE — INTERACTION & SCROLL CHOREOGRAPHY
// Desktop: 4-layer parallax
// Mobile: Single image + subtle parallax
// ============================================

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// ============================================
// NAV BACKGROUND ON SCROLL
// ============================================

const nav = document.getElementById("nav");

if (nav) {

  ScrollTrigger.create({

    start: 100,

    onUpdate: (self) => {

      if (self.scroll() > 80) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

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


  // ==========================================
  // DESKTOP HERO
  // ==========================================

  const desktopMedia = gsap.matchMedia();

  desktopMedia.add(
    "(min-width: 769px)",
    () => {

      // -------------------------------
      // Initial states
      // -------------------------------

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


      gsap.set(
        ".hero-content",
        {
          opacity: 0,
          y: 50
        }
      );


      gsap.set(
        [".card-left", ".card-right"],
        {
          opacity: 0,
          y: 50
        }
      );


      // -------------------------------
      // Desktop parallax timeline
      // -------------------------------

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

        // TREELINE
        .to(
          "#hero-layer-2 img",
          {
            yPercent: 12,
            ease: "none"
          }
        )


        // CAFE
        .to(
          "#hero-layer-3 img",
          {
            yPercent: 8,
            ease: "none"
          },
          "-=0.3"
        )


        // FOREGROUND
        .to(
          "#hero-layer-4 img",
          {
            yPercent: 0,
            ease: "none"
          },
          "-=0.3"
        )


        // HERO CONTENT
        .to(
          ".hero-content",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "-=0.1"
        )


        // LEFT CARD
        .to(
          ".card-left",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "<"
        )


        // RIGHT CARD
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
  );


  // ==========================================
  // MOBILE HERO
  // ==========================================

  desktopMedia.add(
    "(max-width: 768px)",
    () => {

      const mobileImage = hero.querySelector(
        ".hero-mobile-image img"
      );

      const mobileContent = hero.querySelector(
        ".hero-content"
      );


      if (!mobileImage) return;


      // ----------------------------------------
      // Initial mobile state
      // ----------------------------------------

      gsap.set(
        mobileImage,
        {
          yPercent: 0,
          scale: 1.04
        }
      );


      if (mobileContent) {

        gsap.set(
          mobileContent,
          {
            opacity: 0,
            y: 25
          }
        );

      }


      // ----------------------------------------
      // MOBILE SUBTLE PARALLAX
      // ----------------------------------------

      const mobileTimeline = gsap.timeline({

        scrollTrigger: {

          trigger: hero,

          start: "top top",

          /*
            Smaller than desktop.
            Only a little scroll movement.
          */

          end: "+=110%",

          scrub: 0.8,

          pin: true,

          anticipatePin: 1,

          invalidateOnRefresh: true

        }

      });


      mobileTimeline

        // --------------------------------------
        // Image moves VERY SLOWLY
        // --------------------------------------

        .to(
          mobileImage,
          {
            yPercent: -6,
            scale: 1,
            ease: "none"
          }
        )


        // --------------------------------------
        // Content gently appears
        // --------------------------------------

        .to(
          mobileContent,
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "-=0.25"
        );

    }
  );

}


// ============================================
// LOADER → HERO START
// ============================================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const loader =
      document.getElementById("loader");

    const loaderVideo =
      document.getElementById("loader-video");


    let finished = false;


    function startWebsite() {

      if (finished) return;

      finished = true;


      // ----------------------------------------
      // Remove loader
      // ----------------------------------------

      if (loader) {
        loader.classList.add("hidden");
      }


      // ----------------------------------------
      // Allow scrolling
      // ----------------------------------------

      document.body.style.overflow = "auto";


      // ----------------------------------------
      // Start website
      // ----------------------------------------

      requestAnimationFrame(() => {


        // HERO
        revealHero();


        // SOIL TO SIP
        initSoilToSip();



        // Refresh GSAP
        if (
          typeof ScrollTrigger !== "undefined"
        ) {

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

      loaderVideo
        .play()
        .catch(() => {});


      // Video completed

      loaderVideo.addEventListener(
        "ended",
        startWebsite,
        {
          once: true
        }
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

  }
);

/* ============================================
   SOIL TO SIP — 10 CARD SCROLL JOURNEY
   ============================================ */

function initSoilToSip() {

  const section = document.querySelector("#soil-to-sip");

  if (!section) return;


  const line = document.querySelector("#sts-line-active");
  const dot = document.querySelector("#sts-moving-dot");

  const cards = gsap.utils.toArray(".sts-card");


  if (!line || !dot || !cards.length) return;


  /* ==========================================
     SVG PATH SETUP
     ========================================== */

  const pathLength = line.getTotalLength();

  line.style.strokeDasharray = pathLength;
  line.style.strokeDashoffset = pathLength;


  /* ==========================================
     CARD INITIAL STATE
     ========================================== */

  cards.forEach((card, index) => {

    gsap.set(card, {
      opacity: 0,
      y: 120,
      scale: 0.92,
      rotation: parseFloat(
        getComputedStyle(card)
          .getPropertyValue("--card-angle")
      ) || 0
    });

  });


  /* ==========================================
     CARD STACK SETTINGS
     ========================================== */

  const stackPositions = [

    {
      x: -28,
      y: 20,
      scale: 0.86,
      rotation: -7
    },

    {
      x: 20,
      y: 12,
      scale: 0.88,
      rotation: 6
    },

    {
      x: -15,
      y: 8,
      scale: 0.90,
      rotation: -4
    },

    {
      x: 18,
      y: 4,
      scale: 0.92,
      rotation: 8
    },

    {
      x: -12,
      y: 0,
      scale: 0.94,
      rotation: -6
    },

    {
      x: 10,
      y: -4,
      scale: 0.95,
      rotation: 5
    },

    {
      x: -8,
      y: -7,
      scale: 0.96,
      rotation: -8
    },

    {
      x: 7,
      y: -10,
      scale: 0.97,
      rotation: 4
    },

    {
      x: -4,
      y: -13,
      scale: 0.985,
      rotation: -5
    },

    {
      x: 0,
      y: -16,
      scale: 1,
      rotation: 7
    }

  ];


  /* ==========================================
     UPDATE CARD STACK
     ========================================== */

  function updateCards(progress) {

    const total = cards.length;

    /*
      Progress:
      0 → 1

      Each card gets its own portion
      of the scroll.
    */

    cards.forEach((card, index) => {

      const cardStart = index / total;

      const cardEnd = (index + 1) / total;

      let localProgress =
        (progress - cardStart) /
        (cardEnd - cardStart);

      localProgress = gsap.utils.clamp(
        0,
        1,
        localProgress
      );


      /*
        Before card enters
      */

      if (progress < cardStart) {

        gsap.set(card, {
          opacity: 0,
          y: 120,
          scale: 0.88,
          rotation: stackPositions[index].rotation
        });

        return;
      }


      /*
        Card enters
      */

      const position =
        stackPositions[index];


      /*
        Falling / sliding movement
      */

      const eased =
        gsap.parseEase("power3.out")(
          localProgress
        );


      const y =
        gsap.utils.interpolate(
          120,
          position.y,
          eased
        );


      const scale =
        gsap.utils.interpolate(
          0.88,
          position.scale,
          eased
        );


      /*
        Slight rotation movement
      */

      const rotation =
        gsap.utils.interpolate(
          position.rotation - 8,
          position.rotation,
          eased
        );


      /*
        Old cards stay visible
      */

      gsap.set(card, {

        opacity: 1,

        x: position.x,

        y: y,

        scale: scale,

        rotation: rotation

      });

    });

  }


  /* ==========================================
     SCROLLTRIGGER
     ========================================== */

  const trigger = ScrollTrigger.create({

    trigger: section,

    start: "top top",

    end: "bottom bottom",

    scrub: true,

    onUpdate: self => {

      const progress = self.progress;


      /* ======================================
         DRAW CURVED LINE
         ====================================== */

      const currentLength =
        pathLength * progress;

      line.style.strokeDashoffset =
        pathLength - currentLength;


      /* ======================================
         MOVE DOT ALONG SVG PATH
         ====================================== */

      const point =
        line.getPointAtLength(
          pathLength * progress
        );


      /*
        SVG coordinates → CSS coordinates
      */

      const svg =
        document.querySelector(
          ".sts-line-svg"
        );


      const svgRect =
        svg.getBoundingClientRect();


      const viewBox =
        svg.viewBox.baseVal;


      const x =
        (point.x / viewBox.width) *
        svgRect.width;


      const y =
        (point.y / viewBox.height) *
        svgRect.height;


      dot.style.left =
        `${x}px`;

      dot.style.top =
        `${y}px`;


      /* ======================================
         UPDATE CARDS
         ====================================== */

      updateCards(progress);

    }

  });


  /* ==========================================
     INITIAL POSITION
     ========================================== */

  updateCards(0);


  /* ==========================================
     REFRESH
     ========================================== */

  window.addEventListener(
    "resize",
    () => {

      ScrollTrigger.refresh();

    }
  );

}


/* ============================================
   INIT
   ============================================ */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initSoilToSip
  );

} else {

  initSoilToSip();

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
      opacity: 1,
      duration: 0.5,
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
 
// ============================================
// 07. THE PERSON BEHIND THE FOREST
// Scroll Reveal & Organic Motion
// ============================================

function initPersonBehindForest() {

  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger === "undefined") return;

  const section = document.querySelector("#person-behind-forest");

  if (!section) return;

  // ------------------------------------------
  // Respect reduced motion
  // ------------------------------------------

  if (reduceMotion) {
    gsap.set(
      [
        ".person-story",
        ".person-visual",
        ".person-philosophy",
        ".art-class-card",
        ".person-articles"
      ],
      {
        opacity: 1,
        y: 0,
        x: 0
      }
    );

    return;
  }


  // ------------------------------------------
  // Initial states
  // ------------------------------------------

  gsap.set(".person-story", {
    opacity: 0,
    x: -50
  });

  gsap.set(".person-visual", {
    opacity: 0,
    x: 50
  });

  gsap.set(".person-philosophy", {
    opacity: 0,
    y: 50
  });

  gsap.set(".art-class-card", {
    opacity: 0,
    y: 60
  });

  gsap.set(".person-articles", {
    opacity: 0,
    y: 60
  });


  // ------------------------------------------
  // Main story reveal
  // ------------------------------------------

  gsap.timeline({

    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      end: "top 30%",
      scrub: 1,
      invalidateOnRefresh: true
    }

  })

  .to(".person-story", {
    opacity: 1,
    x: 0,
    ease: "power2.out"
  })

  .to(".person-visual", {
    opacity: 1,
    x: 0,
    ease: "power2.out"
  }, "<0.15");


  // ------------------------------------------
  // Owner visual subtle parallax
  // ------------------------------------------

  const visual = section.querySelector(".person-image-frame");

  if (visual) {

    gsap.fromTo(
      visual,
      {
        y: 35
      },
      {
        y: -35,
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      }
    );

  }


  // ------------------------------------------
  // Creative Philosophy
  // ------------------------------------------

  gsap.to(".person-philosophy", {

    opacity: 1,
    y: 0,

    ease: "power2.out",

    scrollTrigger: {
      trigger: ".person-philosophy",
      start: "top 80%",
      end: "top 45%",
      scrub: 1
    }

  });


  // ------------------------------------------
  // Art Class Announcement
  // ------------------------------------------

  gsap.to(".art-class-card", {

    opacity: 1,
    y: 0,

    ease: "power2.out",

    scrollTrigger: {
      trigger: ".art-class-card",
      start: "top 82%",
      end: "top 48%",
      scrub: 1
    }

  });


  // ------------------------------------------
  // Articles section
  // ------------------------------------------

  gsap.to(".person-articles", {

    opacity: 1,
    y: 0,

    ease: "power2.out",

    scrollTrigger: {
      trigger: ".person-articles",
      start: "top 82%",
      end: "top 50%",
      scrub: 1
    }

  });


  // ------------------------------------------
  // Article cards stagger
  // ------------------------------------------

  gsap.fromTo(
    ".article-placeholder-card",

    {
      opacity: 0,
      y: 30
    },

    {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      ease: "power2.out",

      scrollTrigger: {
        trigger: ".articles-placeholder",
        start: "top 85%",
        end: "top 55%",
        scrub: 1
      }

    }
  );


  // ------------------------------------------
  // Refresh ScrollTrigger
  // ------------------------------------------

  ScrollTrigger.refresh();
}


// ============================================
// START PERSON SECTION
// ============================================

window.addEventListener("DOMContentLoaded", () => {

  // Small delay so all sections are ready
  requestAnimationFrame(() => {

    initPersonBehindForest();

  });

});
 
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