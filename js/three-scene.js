// 3D Scene - 粒子系统 + 摄像机运动 + 背景效果
// Uses global THREE from CDN

(function() {
  "use strict";

  const canvas = document.getElementById("three-canvas");
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 14;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Mouse
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  document.addEventListener("mousemove", function(e) {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  document.addEventListener("touchmove", function(e) {
    var t = e.touches[0];
    mouse.tx = (t.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (t.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Create particle texture
  function makeTexture() {
    var c = document.createElement("canvas");
    c.width = 32; c.height = 32;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  }

  // Particles
  var count = 3000;
  var pos = new Float32Array(count * 3);
  var col = new Float32Array(count * 3);
  var colors = [
    new THREE.Color(0x00d4ff),
    new THREE.Color(0x7c3aed),
    new THREE.Color(0x40e0ff)
  ];

  for (var i = 0; i < count; i++) {
    var r = 5 + Math.random() * 15;
    var t = Math.random() * Math.PI * 2;
    var p = Math.acos(2 * Math.random() - 1);
    pos[i*3] = Math.sin(p) * Math.cos(t) * r;
    pos[i*3+1] = Math.sin(p) * Math.sin(t) * r;
    pos[i*3+2] = Math.cos(p) * r;
    var c = colors[Math.floor(Math.random() * colors.length)];
    col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

  var mat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    map: makeTexture()
  });

  var particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Floating shapes
  var shapes = [];
  var shapeGeos = [
    new THREE.IcosahedronGeometry(0.3, 0),
    new THREE.OctahedronGeometry(0.25, 0),
    new THREE.TorusGeometry(0.2, 0.08, 8, 12),
    new THREE.TetrahedronGeometry(0.3, 0)
  ];

  for (var i = 0; i < 20; i++) {
    var g = shapeGeos[i % 4];
    var m = new THREE.Mesh(g.clone(), new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x00d4ff : 0x7c3aed,
      transparent: true,
      opacity: 0.08 + Math.random() * 0.1,
      wireframe: Math.random() > 0.5
    }));
    var rad = 3 + Math.random() * 8;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    m.position.set(
      Math.sin(phi) * Math.cos(theta) * rad,
      Math.sin(phi) * Math.sin(theta) * rad,
      Math.cos(phi) * rad
    );
    m.scale.setScalar(0.5 + Math.random() * 2);
    scene.add(m);
    shapes.push({
      m: m,
      rs: { x: (Math.random()-0.5)*0.02, y: (Math.random()-0.5)*0.02 },
      bp: m.position.clone(),
      ph: Math.random() * 6.28
    });
  }

  // Glow rings
  var rings = [];
  for (var i = 0; i < 3; i++) {
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(1 + i*2, 1.5 + i*2, 64),
      new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.03 + i*0.01,
        side: THREE.DoubleSide,
        wireframe: true
      })
    );
    ring.position.z = -3 - i*3;
    scene.add(ring);
    rings.push(ring);
  }

  // Animation
  var time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    camera.position.x = mouse.x * 1.5;
    camera.position.y = mouse.y * 1;
    camera.lookAt(scene.position);

    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.001;

    shapes.forEach(function(s) {
      s.m.rotation.x += s.rs.x;
      s.m.rotation.y += s.rs.y;
      s.m.position.y = s.bp.y + Math.sin(time * 0.3 + s.ph) * 0.5;
    });

    rings.forEach(function(r, i) {
      r.rotation.x += 0.001 * (i + 1);
      r.rotation.y += 0.002 * (i + 1);
    });

    renderer.render(scene, camera);
  }

  // Only animate if canvas is visible
  setTimeout(animate, 100);

  console.log("Three.js scene started");
})();
