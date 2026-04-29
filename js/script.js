// ============================================
// GSAP SETUP
// ============================================

gsap.registerPlugin(ScrollTrigger);

// ============================================
// THEME TOGGLE
// ============================================

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ============================================
// HERO CANVAS — PARTICLE NETWORK
// ============================================

const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

let particles = [];
const PARTICLE_COUNT = 70;

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.3,
            opacity: Math.random() * 0.35 + 0.08,
        });
    }
}
initParticles();

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = html.getAttribute('data-theme') !== 'light';
    const color = isDark ? '0, 194, 255' : '0, 122, 170';

    // Connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${color}, ${0.07 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.6;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // Dots
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ============================================
// HERO INTRO ANIMATION
// ============================================

const heroTl = gsap.timeline({ delay: 0.2 });

heroTl
    .to('.hero-tag', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    })
    .to('.hero-name .line', {
        opacity: 1, y: 0,
        duration: 1,
        stagger: 0.14,
        ease: 'power4.out'
    }, '-=0.4')
    .to('.hero-sub', {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
    }, '-=0.35')
    .to('.hero-ctas', {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
    }, '-=0.4')
    .to('.hero-scroll-indicator', {
        opacity: 1, duration: 0.6, ease: 'power3.out'
    }, '-=0.2');

// ============================================
// ROLE CYCLING TEXT
// ============================================

const roles = [
    'Trader',
    'Software Engineer',
    'Entrepreneur',
    'Creator',
    'Fitness Coach',
];

let roleIdx = 0;
const roleCycleEl = document.getElementById('roleCycle');

function nextRole() {
    gsap.to(roleCycleEl, {
        opacity: 0, y: -8, duration: 0.28,
        onComplete: () => {
            roleIdx = (roleIdx + 1) % roles.length;
            roleCycleEl.textContent = roles[roleIdx];
            gsap.fromTo(roleCycleEl,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
            );
        }
    });
}

setInterval(nextRole, 2800);

// ============================================
// NAV — SHOW BACKGROUND ON SCROLL
// ============================================

const nav = document.getElementById('nav');

ScrollTrigger.create({
    start: 'top -60px',
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
});

// ============================================
// SMOOTH SCROLL — NAV LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS — UTILITY
// ============================================

function fadeUp(selector, opts = {}) {
    const els = gsap.utils.toArray(selector);
    els.forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: opts.y ?? 40 },
            {
                scrollTrigger: { trigger: el, start: opts.start ?? 'top 85%' },
                opacity: 1, y: 0,
                duration: opts.duration ?? 0.8,
                delay: (opts.stagger ?? 0) * i,
                ease: opts.ease ?? 'power3.out',
            }
        );
    });
}

function fadeLeft(selector, opts = {}) {
    const els = gsap.utils.toArray(selector);
    els.forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, x: opts.x ?? -30 },
            {
                scrollTrigger: { trigger: el, start: opts.start ?? 'top 85%' },
                opacity: 1, x: 0,
                duration: opts.duration ?? 0.8,
                delay: (opts.stagger ?? 0) * i,
                ease: opts.ease ?? 'power3.out',
            }
        );
    });
}

// ============================================
// ABOUT SECTION
// ============================================

gsap.fromTo('.about-img-wrap',
    { opacity: 0, x: -50 },
    {
        scrollTrigger: { trigger: '#about', start: 'top 75%' },
        opacity: 1, x: 0, duration: 1, ease: 'power3.out'
    }
);

fadeUp('.about-text > *', { stagger: 0.1, y: 30 });

// ============================================
// WHAT I DO — CARDS
// ============================================

fadeUp('.card', { stagger: 0.1, y: 35, duration: 0.75 });

// ============================================
// PROJECTS
// ============================================

document.querySelectorAll('.project').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, x: -24 },
        {
            scrollTrigger: { trigger: el, start: 'top 88%' },
            opacity: 1, x: 0,
            duration: 0.75,
            delay: i * 0.07,
            ease: 'power3.out',
        }
    );
});

// ============================================
// SECTION HEADINGS & LABELS
// ============================================

fadeUp('.heading', { y: 40, duration: 0.9 });
fadeUp('.label',   { y: 20, duration: 0.6 });

// ============================================
// TRADING STATS — COUNTER ANIMATION
// ============================================

function animateCount(el, target, duration = 1800) {
    const start = performance.now();
    function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.count').forEach(el => {
            animateCount(el, parseInt(el.dataset.target, 10));
        });
        gsap.fromTo('.stat',
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        );
        statObserver.disconnect();
    });
}, { threshold: 0.3 });

const statsEl = document.querySelector('.stats');
if (statsEl) statObserver.observe(statsEl);

// ============================================
// TIMELINE
// ============================================

document.querySelectorAll('.tl-item').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, x: -24 },
        {
            scrollTrigger: { trigger: el, start: 'top 88%' },
            opacity: 1, x: 0,
            duration: 0.75,
            delay: i * 0.08,
            ease: 'power3.out',
        }
    );
});

// ============================================
// CONNECT SECTION
// ============================================

fadeUp('.email-link', { y: 20, duration: 0.7 });

document.querySelectorAll('.social').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, y: 16 },
        {
            scrollTrigger: { trigger: '.socials', start: 'top 88%' },
            opacity: 1, y: 0,
            duration: 0.5,
            delay: i * 0.05,
            ease: 'power3.out',
        }
    );
});

// ============================================
// CURSOR GLOW (subtle, optional)
// ============================================

const glow = document.createElement('div');
glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(0,194,255,0.04) 0%, transparent 70%);
    transition: opacity 0.3s;
`;
document.body.appendChild(glow);

document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
});
