// ===== NAVIGATION TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===== TYPEWRITER EFFECT — Hero rotating subtitles =====
const phrases = [
    'Seguridad & Operaciones de Infraestructura',
    'Homelab SOC · Wazuh · Suricata · Elastic',
    'IA Aplicada · Agentes · LLMs',
    'OSINT & Threat Intelligence',
    'CTF · HackTheBox · CyberDefenders'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');
const SPEED_TYPE = 65;
const SPEED_DELETE = 35;
const PAUSE_AFTER = 2200;
const PAUSE_BEFORE = 400;

function typeLoop() {
    if (!typedEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeLoop, PAUSE_AFTER);
            return;
        }
        setTimeout(typeLoop, SPEED_TYPE);
    } else {
        typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeLoop, PAUSE_BEFORE);
            return;
        }
        setTimeout(typeLoop, SPEED_DELETE);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeLoop, 800);
});

// ===== MATRIX CANVAS BACKGROUND =====
const canvas = document.getElementById('matrixCanvas');

if (canvas) {
    const ctx = canvas.getContext('2d');

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 13;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00d4ff';
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        // Update columns on resize
        if (Math.floor(canvas.width / fontSize) !== columns) {
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(1);
        }
    }

    setInterval(drawMatrix, 55);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.project-card, .skill-category, .timeline-item, .stat-card, .focus-item, .homelab-table tbody tr'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`;
        observer.observe(el);
    });
});

// ===== COUNTER ANIMATION for stat-card numbers =====
function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    const hasSuffix = el.textContent.includes('+');

    const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.textContent = current + (hasSuffix ? '+' : '');

        if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numEl = entry.target.querySelector('.stat-number');
            const targetVal = parseInt(entry.target.dataset.count);
            if (numEl && targetVal) animateCounter(numEl, targetVal);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card[data-count]').forEach(el => {
    statObserver.observe(el);
});

// ===== SKILL TAGS INTERACTIVE COLORS =====
const tagColorMap = {
    'tag-sec': 'rgba(0, 255, 136, 0.18)',
    'tag-osint': 'rgba(245, 158, 11, 0.18)',
    'tag-infra': 'rgba(124, 58, 237, 0.18)',
    'tag-ai': 'rgba(0, 212, 255, 0.18)',
    'tag-ctf': 'rgba(239, 68, 68, 0.18)',
};

document.querySelectorAll('.skill-tag').forEach(tag => {
    const colorClass = [...tag.classList].find(c => tagColorMap[c]);
    if (colorClass) {
        tag.addEventListener('mouseenter', () => {
            tag.style.background = tagColorMap[colorClass];
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.background = '';
        });
    }
});

// ===== CONSOLE EASTER EGG =====
console.log('%c👾 Alexis Sosa — Técnico en Ciberseguridad', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%c🛡️ Seguridad & Operaciones de Infraestructura', 'color: #00ff88; font-size: 13px;');
console.log('%c⚡ Build. Break. Defend. Automate.', 'color: #7c3aed; font-size: 13px;');
console.log('%c📌 GitHub: https://github.com/Alexso9410', 'color: #f59e0b; font-size: 12px;');
