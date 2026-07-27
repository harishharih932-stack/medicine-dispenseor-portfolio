/* ===================================================
   MEDDISPENSE — Three.js Hero & Interactive Features
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL SHADOW =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 16px rgba(15,23,42,0.06)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // ===== THREE.JS HERO CANVAS =====
  const canvas = document.getElementById('heroCanvas');
  if (canvas && window.THREE) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 30;

    // Floating particles
    const count = 70;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.4,
      transparent: true,
      opacity: 0.5
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3D Ring hinting at dispenser structure
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(9, 0.1, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.15 })
    );
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(13, 0.06, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.1 })
    );
    scene.add(ring2);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.01;

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0004;

      ring.rotation.z += 0.002;
      ring.rotation.x = Math.sin(t * 0.5) * 0.15;

      ring2.rotation.z -= 0.0015;
      ring2.rotation.y = Math.cos(t * 0.4) * 0.12;

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.04;
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

});
