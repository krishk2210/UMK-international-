/* ===================================================
   UMK International — Interactive Scripts
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PARTICLE CANVAS ==========
    const canvas  = document.getElementById('particleCanvas');
    const ctx     = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
        canvas.width  = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
        constructor() { this.reset(); }

        reset() {
            this.x      = Math.random() * canvas.width;
            this.y      = Math.random() * canvas.height;
            this.size   = Math.random() * 2 + .5;
            this.speedX = (Math.random() - .5) * .4;
            this.speedY = (Math.random() - .5) * .4;
            this.opacity = Math.random() * .5 + .1;
            this.gold   = Math.random() > .6;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.gold
                ? `rgba(212, 175, 55, ${this.opacity})`
                : `rgba(245, 240, 225, ${this.opacity * .6})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 175, 55, ${.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = .5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        animFrame = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    function handleNavScroll() {
        const scrolled = window.scrollY > 60;
        navbar.classList.toggle('scrolled', scrolled);

        // Active link highlight
        let currentSection = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.toggle('active',
                link.getAttribute('href') === `#${currentSection}`);
        });
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ========== MOBILE MENU ==========
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========== SCROLL REVEAL ==========
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // ========== ANIMATED COUNTERS ==========
    const counterEls = document.querySelectorAll('.counter-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counterEls.forEach(el => {
            const target = +el.getAttribute('data-target');
            const duration = 2000;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                el.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target;
                }
            }

            requestAnimationFrame(tick);
        });
    }

    const counterSection = document.querySelector('.counters-grid');
    if (counterSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(counterSection);
    }

    // ========== CONTACT FORM ==========
    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Visual feedback
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            submitBtn.classList.add('success');
            submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            form.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('success');
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
            }, 3000);
        }, 1500);
    });

    // ========== SMOOTH SCROLL (fallback) ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
