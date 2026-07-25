// ── GSAP REGISTER ─────────────────────────────────────
if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

// ── AOS ───────────────────────────────────────────────
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 90 });
}

// ── HEADER SCROLL ────────────────────────────────────
const header = document.getElementById('mainHeader');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// ── MOBILE NAV ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
    });
    navMenu.querySelectorAll('.nav-link').forEach(l =>
        l.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        })
    );
}

// ── HERO SLIDESHOW ───────────────────────────────────
function initSlideshow() {
    const slides   = document.querySelectorAll('.hero-slide');
    const dotsWrap = document.getElementById('slideDots');
    let current = 0, timer;
    if (!slides.length || !dotsWrap) return;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `slide-dot${i === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
        if (!dotsWrap.children[current]) return;
        slides[current].classList.remove('active');
        dotsWrap.children[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        dotsWrap.children[current].classList.add('active');
        clearInterval(timer);
        timer = setInterval(next, 5800);
    }

    const next = () => goTo((current + 1) % slides.length);
    timer = setInterval(next, 5800);
}
initSlideshow();

// ── FLOATING PARTICLES ───────────────────────────────
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 5 + 2;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random() * 100}%;
            animation-duration:${Math.random() * 14 + 8}s;
            animation-delay:${Math.random() * 10}s;
            opacity:${Math.random() * 0.4 + 0.15};
        `;
        container.appendChild(p);
    }
}
initParticles();

// ── GSAP HERO ENTRANCE ───────────────────────────────
function initHeroGSAP() {
    if (!window.gsap) return;
    const card = document.getElementById('heroCard');

    const tl = gsap.timeline({ delay: 0.4 });
    tl.to('.gsap-hero-1', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' })
      .to('.gsap-hero-2', { opacity: 1, y: 0, duration: 0.9,  ease: 'power3.out' }, '-=0.4')
      .to('.gsap-hero-3', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.55')
      .to('.gsap-hero-4', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.4')
      .to('.gsap-hero-5', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.35')
      .to(card,           { opacity: 1, x: 0, duration: 0.75, ease: 'back.out(1.2)' }, '-=0.7');
}
initHeroGSAP();

// ── ANIMATED COUNTERS ────────────────────────────────
function initCounters() {
    if (!window.gsap || !window.ScrollTrigger) return;
    document.querySelectorAll('.counter').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        gsap.to(el, {
            innerText: target, duration: 2.2, ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate() { el.textContent = Math.round(parseFloat(el.innerText)); },
        });
    });
}
initCounters();

// ── DIRECTIONAL SCROLL ANIMATIONS ───────────────────
function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    // Services: odd from left, even from right
    document.querySelectorAll('.gsap-from-left').forEach(el => {
        gsap.to(el, {
            opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
    });
    document.querySelectorAll('.gsap-from-right').forEach(el => {
        gsap.to(el, {
            opacity: 1, x: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
    });
    document.querySelectorAll('.gsap-from-below').forEach(el => {
        gsap.to(el, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
    });

    // Featured service card from below
    gsap.from('#svc2', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '#svc2', start: 'top 82%', once: true },
    });
    gsap.from('#svc5', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '#svc5', start: 'top 82%', once: true },
    });

    // Gallery items
    gsap.from('.gallery-item', {
        scale: 0.9, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 82%', once: true },
    });

    // Area pills
    gsap.from('.area-pill', {
        scale: 0, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.areas-grid', start: 'top 82%', once: true },
    });
}
initScrollAnimations();

// ── LOAD FIRESTORE CONTENT ───────────────────────────
async function loadContent() {
    if (!window.firebaseDb) return;
    try {
        const snap = await window.firebaseDb.doc('content/homepage').get();
        if (!snap.exists) return;
        const d = snap.data();
        if (d.heroTitle)    setById('dynHeroTitle',    d.heroTitle);
        if (d.heroSubtitle) setById('dynHeroSubtitle', d.heroSubtitle);
        if (d.scienceTitle) setById('dynScienceTitle', d.scienceTitle);
        if (d.scienceDesc)  setById('dynScienceDesc',  d.scienceDesc);
        if (d.phoneNumber) {
            setById('dynPhoneNumber',  d.phoneNumber);
            setById('dynPhoneNumber2', d.phoneNumber);
        }
        if (d.heroImageUrl) {
            const heroSlides = document.getElementById('heroSlides');
            if (heroSlides) {
                const slide = document.createElement('div');
                slide.className = 'hero-slide';
                slide.style.backgroundImage = `url('${d.heroImageUrl}')`;
                heroSlides.prepend(slide);
            }
        }
    } catch (e) {
        console.warn('CMS load skipped:', e.message);
    }
}
function setById(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
loadContent();

// ── MULTI-STEP QUOTE: FIRESTORE LISTENER ─────────────
document.addEventListener('multiQuoteSubmit', async (e) => {
    if (!window.firebaseDb) {
        console.warn('Firestore database reference is not initialized');
        return;
    }
    try {
        await window.firebaseDb.collection('enquiries').add({
            ...e.detail,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'new',
            source: 'multi-step-form',
        });
        console.log('✅ Enquiry saved to Firestore');
    } catch (err) {
        console.error('Firestore save failed:', err);
    }
});
