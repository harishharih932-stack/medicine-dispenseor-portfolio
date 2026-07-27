/* =============================================
   MEDDISPENSE — Portfolio App Logic
   Three.js Hero Canvas + Scroll Reveal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL SHADOW =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ===== THREE.JS HERO CANVAS =====
  const canvas = document.getElementById('heroCanvas');
  if (canvas && window.THREE) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 35;

    // Floating particles
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sizes[i] = Math.random() * 1.5 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.35,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3D ring (dispenser shape hint)
    const torusGeo = new THREE.TorusGeometry(8, 0.15, 12, 80);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.12 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(12, 0.08, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.08 })
    );
    scene.add(torus2);

    // Small floating cubes
    const cubes = [];
    for (let i = 0; i < 12; i++) {
      const size = Math.random() * 0.4 + 0.15;
      const cubeGeo = new THREE.BoxGeometry(size, size, size);
      const cubeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x0284c7 : 0xea580c,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.1
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 20
      );
      cube.userData = {
        rotSpeed: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.008 + 0.003,
        floatOffset: Math.random() * Math.PI * 2
      };
      scene.add(cube);
      cubes.push(cube);
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.008;

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      torus.rotation.z += 0.003;
      torus.rotation.x = Math.sin(t * 0.4) * 0.2;

      torus2.rotation.z -= 0.002;
      torus2.rotation.y = Math.cos(t * 0.3) * 0.15;

      cubes.forEach(c => {
        c.rotation.x += c.userData.rotSpeed;
        c.rotation.y += c.userData.rotSpeed * 1.3;
        c.position.y += Math.sin(t * c.userData.floatSpeed * 12 + c.userData.floatOffset) * 0.015;
      });

      // Gentle camera drift toward mouse
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
  }

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0) * 1000;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ===== HARDWARE PHOTO PARALLAX =====
  const hwMain = document.querySelector('.hw-photo-main .hw-img');
  if (hwMain) {
    window.addEventListener('scroll', () => {
      const rect = hwMain.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        hwMain.style.objectPosition = `center ${50 + (progress - 0.5) * 10}%`;
      }
    });
  }

  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.style.removeProperty('background'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) {
          active.style.background = '#e0f2fe';
          active.style.color = '#0369a1';
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

});
