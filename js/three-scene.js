/**
 * THREE.JS 3D SCENE & INTERACTIVE RINGS ENGINE
 * Constance Onyinyechi David & Onyekachi Onyedinma Wedding
 */

(function () {
  'use strict';

  // =========================================================================
  // PROCEDURAL STUDIO ENVIRONMENT MAP GENERATOR
  // Generates warm luxury studio lighting reflections for metals & diamonds
  // =========================================================================
  function createStudioEnvMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Rich studio backdrop gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#ffffff');      // Top overhead studio light
    grad.addColorStop(0.2, '#fff4db');    // Warm champagne softbox
    grad.addColorStop(0.45, '#78531e');   // Warm amber reflection
    grad.addColorStop(0.75, '#163b2c');   // Royal emerald floor reflection
    grad.addColorStop(1, '#05140e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Large main softbox
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(140, 70, 90, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Secondary fill softbox
    ctx.fillStyle = '#ffe2a3';
    ctx.beginPath();
    ctx.ellipse(370, 90, 100, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Intense sparkle spots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 40, 24, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }

  // =========================================================================
  // 1. BACKGROUND FLOATING PARTICLES & PETALS SCENE
  // =========================================================================
  function initBackgroundScene() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe5c378, 1.5);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    // 1A. GOLD PARTICLES (SPARKLES & DUST)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speed = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      speed.push({
        y: Math.random() * 0.04 + 0.015,
        x: (Math.random() - 0.5) * 0.01
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom circular soft glow particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 15);
    grad.addColorStop(0, 'rgba(255, 245, 210, 1)');
    grad.addColorStop(0.3, 'rgba(229, 195, 120, 0.8)');
    grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.beginPath();
    pCtx.arc(16, 16, 15, 0, Math.PI * 2);
    pCtx.fill();

    const particleTexture = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 1.2,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 1B. 3D FLOATING WHITE FLORAL & GOLDEN PETALS
    const petalCount = 35;
    const petalsGroup = new THREE.Group();

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.6, 1.2, 0, 2.2);
    petalShape.quadraticCurveTo(-0.6, 1.2, 0, 0);

    const petalGeo = new THREE.ShapeGeometry(petalShape, 8);

    const petalMatWhite = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    const petalMatGold = new THREE.MeshStandardMaterial({
      color: 0xe5c378,
      roughness: 0.2,
      metalness: 0.7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    const petals = [];
    for (let i = 0; i < petalCount; i++) {
      const mat = Math.random() > 0.35 ? petalMatWhite : petalMatGold;
      const mesh = new THREE.Mesh(petalGeo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 70,
        Math.random() * 60 - 30,
        (Math.random() - 0.5) * 35
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const s = Math.random() * 0.6 + 0.4;
      mesh.scale.set(s, s, s);

      mesh.userData = {
        vy: Math.random() * 0.03 + 0.015,
        rx: (Math.random() - 0.5) * 0.015,
        ry: (Math.random() - 0.5) * 0.02,
        swaySpeed: Math.random() * 0.02 + 0.01,
        initialX: mesh.position.x
      };

      petalsGroup.add(mesh);
      petals.push(mesh);
    }
    scene.add(petalsGroup);

    // Mouse parallax
    let targetCameraX = 0;
    let targetCameraY = 0;

    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCameraX = mouseX * 4;
      targetCameraY = -mouseY * 4;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      camera.position.x += (targetCameraX - camera.position.x) * 0.03;
      camera.position.y += (targetCameraY - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] -= speed[i].y;
        posArr[i * 3] += Math.sin(elapsedTime + i) * 0.015;

        if (posArr[i * 3 + 1] < -40) {
          posArr[i * 3 + 1] = 40;
          posArr[i * 3] = (Math.random() - 0.5) * 80;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.02;

      petals.forEach((p, idx) => {
        p.position.y -= p.userData.vy;
        p.position.x = p.userData.initialX + Math.sin(elapsedTime * p.userData.swaySpeed + idx) * 3;
        p.rotation.x += p.userData.rx;
        p.rotation.y += p.userData.ry;

        if (p.position.y < -35) {
          p.position.y = 35;
          p.position.x = (Math.random() - 0.5) * 70;
          p.userData.initialX = p.position.x;
        }
      });

      renderer.render(scene, camera);
    }

    animate();
  }

  // =========================================================================
  // 2. DEDICATED 3D INTERACTIVE RINGS STUDIO (THE ETERNAL EMBRACE)
  // =========================================================================
  function initRingsStudio() {
    const canvas = document.getElementById('rings-canvas');
    if (!canvas || typeof THREE === 'undefined') {
      console.warn('rings-canvas or THREE not found');
      return;
    }

    const parent = canvas.parentElement;
    const initialWidth = parent.clientWidth || 800;
    const initialHeight = parent.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, 13);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Environment Map for Mirror-like Gold & Facet Reflections
    const studioEnvMap = createStudioEnvMap();
    scene.environment = studioEnvMap;

    // LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xfffaed, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaea, 3.5);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe5c378, 2.5);
    fillLight.position.set(-10, -5, 8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffdf99, 2.0);
    rimLight.position.set(0, -10, -8);
    scene.add(rimLight);

    // Orbiting Sparkle Point Light
    const sparkleLight = new THREE.PointLight(0xffffff, 5.0, 25);
    sparkleLight.position.set(0, 4, 6);
    scene.add(sparkleLight);

    // RINGS ROOT GROUP
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    // MATERIALS
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd780,
      emissive: 0x3d2b05,
      metalness: 0.88,
      roughness: 0.15,
      envMap: studioEnvMap,
      envMapIntensity: 2.5
    });

    const roseGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5a898,
      emissive: 0x3a1712,
      metalness: 0.88,
      roughness: 0.16,
      envMap: studioEnvMap,
      envMapIntensity: 2.5
    });

    // Brilliant Cut Diamond Material (Faceted with sharp specular glints)
    const diamondMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x112233,
      specular: 0xffffff,
      shininess: 250,
      transparent: true,
      opacity: 0.92,
      flatShading: true,
      envMap: studioEnvMap,
      reflectivity: 0.95,
      combine: THREE.MixOperation
    });

    // -------------------------------------------------------------------------
    // 2A. RING 1 - CONSTANCE'S SOLITAIRE ENGAGEMENT RING
    // -------------------------------------------------------------------------
    const ring1Group = new THREE.Group();

    // Elegant Slender 18K Gold Band
    const band1Geo = new THREE.TorusGeometry(3.2, 0.38, 36, 120);
    const band1Mesh = new THREE.Mesh(band1Geo, goldMaterial);
    ring1Group.add(band1Mesh);

    // Solitaire Setting & 4 Gold Prongs
    const prongGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
    const prongPositions = [
      { x: 0.38, z: 0.38 },
      { x: -0.38, z: 0.38 },
      { x: 0.38, z: -0.38 },
      { x: -0.38, z: -0.38 }
    ];

    prongPositions.forEach(p => {
      const prong = new THREE.Mesh(prongGeo, goldMaterial);
      prong.position.set(p.x, 3.45, p.z);
      prong.rotation.z = -p.x * 0.25;
      prong.rotation.x = p.z * 0.25;
      ring1Group.add(prong);

      // Sphere tip on each prong
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), goldMaterial);
      tip.position.set(p.x * 0.9, 3.9, p.z * 0.9);
      ring1Group.add(tip);
    });

    // Solitaire Diamond Geometry (Classic Round Brilliant Cut with flat table & faceted pavilion)
    const diamondGroup = new THREE.Group();
    diamondGroup.position.set(0, 3.75, 0);

    // Diamond Crown (Upper faceted bevel with flat table)
    const crownGeo = new THREE.CylinderGeometry(0.65, 1.05, 0.45, 8);
    const crownMesh = new THREE.Mesh(crownGeo, diamondMaterial);
    crownMesh.position.y = 0.22;
    diamondGroup.add(crownMesh);

    // Diamond Pavilion (Lower cone facet pointing downward into prongs)
    const pavilionGeo = new THREE.ConeGeometry(1.05, 1.1, 8);
    pavilionGeo.rotateX(Math.PI);
    const pavilionMesh = new THREE.Mesh(pavilionGeo, diamondMaterial);
    pavilionMesh.position.y = -0.55;
    diamondGroup.add(pavilionMesh);

    // Internal Refraction Star
    const flareGeo = new THREE.OctahedronGeometry(0.4, 0);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const flareMesh = new THREE.Mesh(flareGeo, flareMat);
    diamondGroup.add(flareMesh);

    ring1Group.add(diamondGroup);

    // Pavé Accent Stones on Constance's Band Shoulders
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      const angle = Math.PI / 2 + (i * 0.08);
      const px = Math.cos(angle) * 3.2;
      const py = Math.sin(angle) * 3.2;

      const paveGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), diamondMaterial);
      paveGem.position.set(px, py, 0.32);
      ring1Group.add(paveGem);

      const paveGemBack = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), diamondMaterial);
      paveGemBack.position.set(px, py, -0.32);
      ring1Group.add(paveGemBack);
    }

    // -------------------------------------------------------------------------
    // 2B. RING 2 - ONYEKACHI'S SOLID ROYAL WEDDING BAND
    // -------------------------------------------------------------------------
    const ring2Group = new THREE.Group();

    // Wider, masculine comfort-fit band
    const band2Geo = new THREE.TorusGeometry(3.3, 0.52, 36, 120);
    const band2Mesh = new THREE.Mesh(band2Geo, goldMaterial);
    ring2Group.add(band2Mesh);

    // Inner bevel groove accent
    const innerGrooveGeo = new THREE.TorusGeometry(3.3, 0.53, 16, 120);
    const grooveMat = new THREE.MeshStandardMaterial({
      color: 0xe5c378,
      metalness: 0.95,
      roughness: 0.4
    });
    const grooveMesh = new THREE.Mesh(innerGrooveGeo, grooveMat);
    grooveMesh.scale.set(1, 1, 0.4);
    ring2Group.add(grooveMesh);

    // -------------------------------------------------------------------------
    // 2C. INTERLOCKING 3D EMBRACE POSITIONING
    // -------------------------------------------------------------------------
    ring1Group.position.set(-1.3, 0, 0);
    ring1Group.rotation.set(0.55, 0.4, 0);

    ring2Group.position.set(1.3, 0, 0);
    ring2Group.rotation.set(-0.55, -0.4, 0);

    ringsGroup.add(ring1Group);
    ringsGroup.add(ring2Group);

    // Floating Golden Dust around the rings
    const dustCount = 40;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0xffe2a3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    ringsGroup.add(dustPoints);

    // -------------------------------------------------------------------------
    // 2D. INTERACTION (DRAG & TOUCH ORBIT CONTROLS)
    // -------------------------------------------------------------------------
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelX = 0;
    let rotVelY = 0.005;

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rotVelY = deltaX * 0.008;
      rotVelX = deltaY * 0.008;

      ringsGroup.rotation.y += rotVelY;
      ringsGroup.rotation.x += rotVelX;
    });

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      rotVelY = deltaX * 0.008;
      rotVelX = deltaY * 0.008;

      ringsGroup.rotation.y += rotVelY;
      ringsGroup.rotation.x += rotVelX;
    }, { passive: true });

    // UI LIGHTING & MATERIAL BUTTONS
    const lightBtns = document.querySelectorAll('.ring-control-btn');
    lightBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        lightBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const mode = e.currentTarget.getAttribute('data-mode');
        if (mode === 'gold') {
          band1Mesh.material = goldMaterial;
          band2Mesh.material = goldMaterial;
          keyLight.color.setHex(0xfffaea);
          keyLight.intensity = 3.5;
          fillLight.color.setHex(0xe5c378);
        } else if (mode === 'rosegold') {
          band1Mesh.material = roseGoldMaterial;
          band2Mesh.material = roseGoldMaterial;
          keyLight.color.setHex(0xffdfd0);
          keyLight.intensity = 3.2;
          fillLight.color.setHex(0xf5a898);
        } else if (mode === 'candle') {
          band1Mesh.material = goldMaterial;
          band2Mesh.material = goldMaterial;
          keyLight.color.setHex(0xff9933);
          keyLight.intensity = 4.2;
          fillLight.color.setHex(0xc05820);
        } else if (mode === 'emerald') {
          band1Mesh.material = goldMaterial;
          band2Mesh.material = goldMaterial;
          keyLight.color.setHex(0xa8f0d0);
          keyLight.intensity = 3.0;
          fillLight.color.setHex(0x094d36);
        }
      });
    });

    // -------------------------------------------------------------------------
    // 2E. AUTO-RESIZING OBSERVER
    // -------------------------------------------------------------------------
    function updateRendererSize() {
      const w = parent.clientWidth || 800;
      const h = parent.clientHeight || 480;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    }

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        updateRendererSize();
      });
      ro.observe(parent);
    }
    window.addEventListener('resize', updateRendererSize);

    // Initial resize call
    updateRendererSize();

    // -------------------------------------------------------------------------
    // 2F. STUDIO ANIMATION LOOP
    // -------------------------------------------------------------------------
    let studioClock = new THREE.Clock();

    function renderStudio() {
      requestAnimationFrame(renderStudio);
      const elapsed = studioClock.getElapsedTime();

      if (!isDragging) {
        rotVelY = rotVelY * 0.95 + 0.005 * 0.05;
        rotVelX = rotVelX * 0.95;
        ringsGroup.rotation.y += rotVelY;
        ringsGroup.rotation.x += rotVelX;
      }

      // Rotate diamond flare & animate sparkle light orbit
      diamondGroup.rotation.y = elapsed * 0.6;
      flareMesh.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.2);

      sparkleLight.position.x = Math.sin(elapsed * 1.5) * 5;
      sparkleLight.position.y = 3.5 + Math.cos(elapsed * 2) * 1.5;
      sparkleLight.position.z = Math.cos(elapsed * 1.5) * 5;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    renderStudio();
  }

  // =========================================================================
  // BOOTSTRAP: GUARANTEED EXECUTION
  // =========================================================================
  function boot() {
    try {
      initBackgroundScene();
    } catch (e) {
      console.error('Error in background scene:', e);
    }

    try {
      initRingsStudio();
    } catch (e) {
      console.error('Error in rings studio:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
