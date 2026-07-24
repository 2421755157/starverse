import * as THREE from 'three';

// 科幻霓虹银河盘:5 条旋臂 + 银心强辉光 + 多彩星云 + 能量带,静态倾斜,
// 作为稳定背景幕布(不随视角旋转,主打科幻纵深感)。
// 供开场页(intro.js)与时光飞船旅程(travel.js)复用。
export function buildGalaxy(scene) {
  const glowTex = makeGlow();

  const GAL_N = 13000;
  const galPos = new Float32Array(GAL_N * 3);
  const galCol = new Float32Array(GAL_N * 3);
  const ARMS = 5, ARM_OFF = (Math.PI * 2) / ARMS, TWIST = 4.2;
  const galC = new THREE.Color();
  for (let i = 0; i < GAL_N; i++) {
    const arm = i % ARMS;
    const t = Math.pow(Math.random(), 0.5);          // 内密外疏
    const radius = 60 + t * 1150;
    const baseAng = arm * ARM_OFF + t * TWIST;
    const spread = (1 - t) * 0.5 + 0.08;
    const ang = baseAng + (Math.random() - 0.5) * spread;
    galPos[i * 3] = Math.cos(ang) * radius;
    galPos[i * 3 + 1] = (Math.random() - 0.5) * (24 + (1 - t) * 120);
    galPos[i * 3 + 2] = Math.sin(ang) * radius;
    // 科幻霓虹配色:银心暖白青 → 旋臂青/品红/紫/蓝交替
    const warm = 1 - t;
    if (warm > 0.55) galC.setHSL(0.52, 0.5, 0.86);                 // 银心亮青白
    else {
      const pick = (arm + (i % 3)) % 4;
      if (pick === 0) galC.setHSL(0.55, 0.9, 0.6);     // 青
      else if (pick === 1) galC.setHSL(0.83, 0.9, 0.66); // 品红
      else if (pick === 2) galC.setHSL(0.72, 0.9, 0.62); // 紫
      else galC.setHSL(0.62, 0.85, 0.6);                // 蓝
    }
    galCol[i * 3] = galC.r; galCol[i * 3 + 1] = galC.g; galCol[i * 3 + 2] = galC.b;
  }
  const galGeo = new THREE.BufferGeometry();
  galGeo.setAttribute('position', new THREE.BufferAttribute(galPos, 3));
  galGeo.setAttribute('color', new THREE.BufferAttribute(galCol, 3));
  const galMat = new THREE.PointsMaterial({
    size: 3.4, vertexColors: true, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  });
  const galaxy = new THREE.Points(galGeo, galMat);
  galaxy.rotation.x = -0.52;
  scene.add(galaxy);

  // 银心强辉光(呼吸脉动,不旋转)
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xbfeaff, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9
  }));
  coreGlow.scale.setScalar(560);
  galaxy.add(coreGlow);

  // 银心更大柔光晕(增强体积感)
  const coreHalo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0x9fd8ff, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.45
  }));
  coreHalo.scale.setScalar(1000);
  galaxy.add(coreHalo);

  // 多彩星云(霓虹弥漫辉光,散布盘面)
  const NEB = [0x35e0ff, 0xff4fd8, 0x9b5cff, 0x4f7bff, 0x35ffd0, 0x7a5cff];
  const nebGroup = new THREE.Group();
  for (let i = 0; i < 26; i++) {
    const m = new THREE.SpriteMaterial({
      map: glowTex, color: NEB[i % NEB.length], transparent: true,
      opacity: 0.12 + Math.random() * 0.13, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const s = new THREE.Sprite(m);
    const ang = Math.random() * Math.PI * 2, rad = 120 + Math.random() * 820;
    s.position.set(Math.cos(ang) * rad, (Math.random() - 0.5) * 360, Math.sin(ang) * rad);
    s.scale.setScalar(360 + Math.random() * 620);
    nebGroup.add(s);
  }
  nebGroup.rotation.x = -0.52;
  scene.add(nebGroup);

  // 银河能量带(盘面柔光平面,强化霓虹光雾)
  const bandGeo = new THREE.PlaneGeometry(3000, 1200);
  const bandMat = new THREE.MeshBasicMaterial({
    map: glowTex, color: 0x6fb6ff, transparent: true, opacity: 0.12,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
  });
  const mwBand = new THREE.Mesh(bandGeo, bandMat);
  mwBand.rotation.x = -Math.PI / 2;
  galaxy.add(mwBand);

  return { galaxy, coreGlow };
}

function makeGlow() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.4)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
