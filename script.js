// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP ScrollTrigger Integration with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Custom Cursor Logic
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
const cursorText = follower.querySelector('.cursor-text');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
});

function updateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(follower, { x: followerX - 20, y: followerY - 20 });
    requestAnimationFrame(updateFollower);
}
updateFollower();

// Cursor Interactions
document.querySelectorAll('a, button, .portfolio-grid img').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (el.tagName === 'IMG') {
            gsap.to(follower, { width: 80, height: 80, xPercent: -25, yPercent: -25, backgroundColor: '#000', borderColor: '#000', duration: 0.3 });
            gsap.to(cursor, { opacity: 0 });
            cursorText.classList.remove('hidden');
            cursorText.style.display = 'flex';
        } else {
            gsap.to(cursor, { scale: 4, opacity: 0.3 });
            gsap.to(follower, { scale: 1.5, borderColor: '#000' });
        }
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, opacity: 1 });
        gsap.to(follower, { scale: 1, width: 40, height: 40, xPercent: 0, yPercent: 0, backgroundColor: 'transparent', borderColor: '#000' });
        cursorText.classList.add('hidden');
    });
});

// --- Advanced Scroll Animation System ---
gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Section & Element Reveals (Excluding Instagram Mockup)
document.querySelectorAll('section:not(#focus-carousel)').forEach(el => {
    let xOffset = 0;
    let yOffset = 40;

    gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        y: yOffset, x: xOffset, opacity: 0, duration: 1.2, ease: "power3.out"
    });
});

// 2. Premium Text Reveal Animation for Headings (Staggered Lines/Chars)
document.querySelectorAll('.line-reveal, h2:not(:has(.line-reveal)), .honesty-text').forEach(h => {
    if (!h.querySelector('.char-span')) {
        const text = h.innerText;
        h.innerHTML = text.split('').map(char => {
            if (char === ' ') return '<span class="char-span inline-block">&nbsp;</span>';
            return `<span class="inline-block overflow-hidden"><span class="char-span inline-block translate-y-full" style="display: inline-block;">${char}</span></span>`;
        }).join('');
    }
    
    gsap.to(h.querySelectorAll('.char-span'), {
        y: "0%",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.012,
        scrollTrigger: {
            trigger: h,
            start: "top 95%",
            toggleActions: "play none none none"
        }
    });
});

// 3. Staggered List Animations
document.querySelectorAll('ul').forEach(list => {
    gsap.from(list.querySelectorAll('li'), {
        scrollTrigger: { trigger: list, start: "top 85%" },
        opacity: 0, x: -30, stagger: 0.15, duration: 1, ease: "power2.out"
    });
});

// 4. Parallax Effect for Footer Background
gsap.to("footer", {
    backgroundPositionY: "20%",
    ease: "none",
    scrollTrigger: { trigger: "footer", start: "top bottom", end: "bottom top", scrub: true }
});

// --- Existing Specialized Animations (Preserved) ---

// Magnetic Hero Showcase
const showcaseItems = document.querySelectorAll('.showcase-item');
if (showcaseItems.length > 0) {
    gsap.set(showcaseItems, { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8 });
    const heroTl = gsap.timeline({
        scrollTrigger: { trigger: ".showcase-item", start: "top 95%", toggleActions: "play reverse play reverse" }
    });
    heroTl.to(showcaseItems, { opacity: 1, scale: 1, duration: 1.2, stagger: 0.08, ease: "power4.out" })
    .to(showcaseItems[0], { x: -480, rotate: -18, duration: 1.5, ease: "power3.out" }, "-=0.8")
    .to(showcaseItems[1], { x: -240, rotate: -9, duration: 1.5, ease: "power3.out" }, "-=1.4")
    .to(showcaseItems[2], { y: -40, rotate: 0, duration: 1.5, ease: "power3.out" }, "-=1.4")
    .to(showcaseItems[3], { x: 240, rotate: 9, duration: 1.5, ease: "power3.out" }, "-=1.4")
    .to(showcaseItems[4], { x: 480, rotate: 18, duration: 1.5, ease: "power3.out" }, "-=1.4");

    showcaseItems.forEach((item, i) => {
        gsap.to(item, { y: "+=20", duration: 2 + i * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.2 });
    });
}

// 3D Floating Icons
document.querySelectorAll('.floating-icon').forEach((icon, i) => {
    gsap.to(icon, { y: "+=30", x: "+=15", rotate: i % 2 === 0 ? 15 : -15, duration: 3 + i, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.5 });
});

// Automated 10-Second Interval Slideshow (Instagram Mockup)
const bgRibbon = document.querySelector('.main-bg-ribbon');
const internalRibbon = document.querySelector('.internal-sharp-ribbon');
if (bgRibbon && internalRibbon) {
    const slideWidth = 480;
    const tl = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= 13; i++) {
        tl.to([bgRibbon, internalRibbon], { x: `+=${-slideWidth}`, duration: 1.2, ease: "power2.inOut" }, "+=10");
    }
}

// Grid 'Fly-in'
gsap.from(".portfolio-grid div", {
    scrollTrigger: { trigger: ".portfolio-grid", start: "top 80%", toggleActions: "play none none none" },
    x: () => (Math.random() - 0.5) * 400, y: () => (Math.random() - 0.5) * 400,
    rotate: () => (Math.random() - 0.5) * 45, scale: 0, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power4.out"
});

// 3D Tilt for Grid
document.querySelectorAll('.portfolio-grid div').forEach(item => {
    item.classList.add('perspective-1000');
    const img = item.querySelector('img');
    if (img) {
        img.classList.add('transition-all', 'duration-300');
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 10;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 10;
            gsap.to(img, { rotateX, rotateY, scale: 1.1, duration: 0.5, ease: "power2.out", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", filter: "brightness(1.1)" });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(img, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: "power2.out", boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)", filter: "brightness(1)" });
        });
    }
});

// Hero Mouse Tracking
const heroSection = document.querySelector('.hero-gradient');
if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const moveX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const moveY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        showcaseItems.forEach((item, i) => {
            const strength = [-60, -30, 10, 30, 60][i];
            gsap.to(item, { xPercent: moveX * strength, yPercent: moveY * strength, rotate: (moveX * strength) * 0.1, duration: 1, ease: "power2.out" });
        });
    });
    heroSection.addEventListener('mouseleave', () => {
        showcaseItems.forEach((item) => gsap.to(item, { xPercent: 0, yPercent: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }));
    });
}

// Magnetic Buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }));
});

console.log("Premium animations synchronized.");
