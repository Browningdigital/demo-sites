// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    animateHero();
  }, 1800);
});

// ===== THREE.JS 3D BACKGROUND =====
(function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Particle system - floating geometric shapes
  const particleCount = 120;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocities.push({
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.005
    });
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Wireframe torus knots
  const torusGeo = new THREE.TorusKnotGeometry(8, 0.3, 120, 8, 2, 3);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.04 });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  scene.add(torus);

  const torus2Geo = new THREE.TorusKnotGeometry(12, 0.2, 100, 6, 3, 5);
  const torus2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.02 });
  const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
  scene.add(torus2);

  // Line connections
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.03 });
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(60 * 3);
  for (let i = 0; i < 60; i++) {
    linePositions[i * 3] = (Math.random() - 0.5) * 50;
    linePositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    linePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.pageYOffset; });

  function animate() {
    requestAnimationFrame(animate);

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      if (Math.abs(pos[i * 3]) > 30) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 30) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 20) velocities[i].z *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    torus.rotation.x += 0.001;
    torus.rotation.y += 0.002;
    torus2.rotation.x -= 0.0008;
    torus2.rotation.z += 0.001;
    lines.rotation.y += 0.0005;

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
    camera.position.z = 30 - scrollY * 0.01;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('active', menuOpen);
  navToggle.classList.toggle('active', menuOpen);
});

document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ===== HERO ANIMATION =====
function animateHero() {
  gsap.fromTo('.hero-badge', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  gsap.fromTo('.hero-line', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.2 });
  gsap.fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.7 });
  gsap.fromTo('.hero-actions', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 });
  gsap.fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.5 });
}

// ===== GSAP SCROLL ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

// Animate elements on scroll
document.querySelectorAll('[data-animate]').forEach(el => {
  const delay = parseFloat(el.dataset.delay) || 0;
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => {
      setTimeout(() => el.classList.add('visible'), delay * 1000);
    }
  });
});

// Parallax hero content on scroll
gsap.to('.hero-content', {
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  y: -100, opacity: 0
});

// Section headers scale in
document.querySelectorAll('.section-header h2').forEach(h2 => {
  gsap.fromTo(h2, { scale: 0.9, opacity: 0 }, {
    scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: h2, start: 'top 80%' }
  });
});

// Feature cards stagger
gsap.fromTo('.feature-card', { y: 40, opacity: 0 }, {
  y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.features-grid', start: 'top 80%' }
});

// Schedule cards
gsap.fromTo('.schedule-card', { y: 30, opacity: 0, rotateX: 10 }, {
  y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.schedule-grid', start: 'top 80%' }
});

// Party cards
gsap.fromTo('.party-card', { y: 40, opacity: 0, scale: 0.95 }, {
  y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
  scrollTrigger: { trigger: '.party-grid', start: 'top 80%' }
});

// Counter animation
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target, duration: 2, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); }
      });
    },
    once: true
  });
});

// Marquee speed on scroll
gsap.to('.marquee-track', {
  scrollTrigger: { trigger: '.marquee-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
  x: -100
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Message Sent!';
    btn.style.background = '#22c55e';
    this.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1500);
});

// ===== 3D TILT ON CARDS =====
document.querySelectorAll('.feature-card, .schedule-card, .party-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -5;
    const rotateY = (x - centerX) / centerX * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
