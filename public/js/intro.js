import * as THREE from 'three';
import { buildGalaxy } from './galaxy.js';

// 开场星系场景:太阳系行星(地球/月球/火星/木星…)各自带名称 + 坐标,
// 名人欢迎词,点击进入后曲速穿梭进入主银河系。
export function createIntro({ onEnterStart, onEnter } = {}) {
  const introEl = document.getElementById('intro');
  const canvas = document.getElementById('intro-canvas');
  const labelsEl = document.getElementById('planet-labels');
  const flashEl = document.getElementById('intro-flash');
  const enterBtn = document.getElementById('intro-enter');

  // 不透明渲染:背景银河由 Three.js 程序生成绘制(科幻霓虹风格),不再依赖 CSS 图片
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04050e);
  scene.fog = new THREE.FogExp2(0x04050e, 0.00055);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 6000);
  camera.position.set(0, 70, 640);
  camera.lookAt(0, 0, 0);

  // 太阳系整体作为一个倾斜的组,使行星公转平面"嵌"进银河星盘里,
  // 而非悬浮在银河前的平面 —— 满足"行星转动的局域在银河的背景里"。
  const solarGroup = new THREE.Group();
  solarGroup.rotation.x = -0.26;
  scene.add(solarGroup);

  // 灯光:太阳为点光源(提亮行星主体)+ 环境弱光(压暗背景,拉高对比度)
  const sunLight = new THREE.PointLight(0xfff2cc, 4.0, 0, 0.0);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x1a2440, 0.40));

  // 太阳
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(36, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xffd24a })
  );
  solarGroup.add(sun);
  // 太阳光晕
  const glowTex = makeGlow();
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd24a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 }));
  sunGlow.scale.setScalar(150);
  solarGroup.add(sunGlow);

  // ===================== 多层真实星空(远景/中景/明亮星,视差纵深) =====================
  // 远景:少量细小暗星,点缀深空
  const farN = 1100;
  const farPos = new Float32Array(farN * 3);
  for (let i = 0; i < farN; i++) {
    const r = 2400 + Math.random() * 3400;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    farPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    farPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    farPos[i * 3 + 2] = r * Math.cos(ph);
  }
  const farGeo = new THREE.BufferGeometry();
  farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
  const farStars = new THREE.Points(farGeo, new THREE.PointsMaterial({ color: 0x6f80a8, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.3 }));
  scene.add(farStars);

  // 中景:少量中等亮星,带色温变化,缓慢自转产生视差
  const midN = 450;
  const midPos = new Float32Array(midN * 3);
  const midCol = new Float32Array(midN * 3);
  const midC = new THREE.Color();
  for (let i = 0; i < midN; i++) {
    const r = 1300 + Math.random() * 1900;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    midPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    midPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    midPos[i * 3 + 2] = r * Math.cos(ph);
    const tnt = Math.random();
    if (tnt < 0.32) midC.setHSL(0.58, 0.5, 0.82);
    else if (tnt < 0.64) midC.setHSL(0.0, 0.0, 0.92);
    else if (tnt < 0.84) midC.setHSL(0.09, 0.6, 0.78);
    else midC.setHSL(0.75, 0.45, 0.82);
    midCol[i * 3] = midC.r; midCol[i * 3 + 1] = midC.g; midCol[i * 3 + 2] = midC.b;
  }
  const midGeo = new THREE.BufferGeometry();
  midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
  midGeo.setAttribute('color', new THREE.BufferAttribute(midCol, 3));
  const midStars = new THREE.Points(midGeo, new THREE.PointsMaterial({ size: 3.0, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(midStars);

  // 明亮星(带辉光,模拟天文摄影的星芒泛光,增强立体真实感)
  const heroStars = new THREE.Group();
  const HERO_N = 28;
  const heroTints = [0xffffff, 0xbcd4ff, 0xfff0c2, 0xc9b8ff, 0xbfeaff];
  for (let i = 0; i < HERO_N; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: heroTints[(Math.random() * heroTints.length) | 0],
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9
    }));
    const r = 850 + Math.random() * 2800;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    m.position.set(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph));
    const sc = 14 + Math.random() * 26;
    m.scale.setScalar(sc);
    m.userData = { base: sc, phase: Math.random() * Math.PI * 2, sp: 0.6 + Math.random() * 1.4 };
    heroStars.add(m);
  }
  scene.add(heroStars);

  // ===================== 科幻星系背景(程序生成,霓虹风) =====================
  // 倾斜的发光银河盘:多条旋臂 + 银心强辉光 + 多彩星云 + 能量带,
  // 作为稳定背景幕布(静态倾斜,不随视角旋转),主打科幻纵深感。
  // 抽成公共模块,开场页与时光飞船旅程共用。
  const { coreGlow } = buildGalaxy(scene);

  // 行星数据(name 中/英, 颜色, 显示半径, 轨道半径, 真实AU, 直径km, 特征)
  // 轨道半径均匀外扩;speed 内快外慢(近似开普勒);incl 为各自轨道倾角,
  // 让行星分布在略微不同的平面,轨迹更分散、标签不易叠在一起。
  const PLANETS = [
    { name: '水星', en: 'Mercury', color: 0x9c8e7e, size: 7, orbit: 92, speed: 0.160, au: 0.39, dia: 4879, fact: '最靠近太阳的行星', spin: 0.010, incl: 0.06 },
    { name: '金星', en: 'Venus', color: 0xe6c98c, size: 12, orbit: 142, speed: 0.122, au: 0.72, dia: 12040, fact: '最炽热的行星,硫酸云笼罩', spin: 0.006, incl: -0.05 },
    { name: '地球', en: 'Earth', color: 0x2e6fd6, size: 13, orbit: 196, speed: 0.100, au: 1.00, dia: 12742, fact: '已知唯一孕育生命的蔚蓝星球', spin: 0.018, hero: true, incl: 0.04, moon: { size: 4, dist: 28, color: 0xc9c9c9 } },
    { name: '火星', en: 'Mars', color: 0xc1440e, size: 10, orbit: 250, speed: 0.082, au: 1.52, dia: 6779, fact: '赤红星球,奥林匹斯山耸立', spin: 0.017, incl: -0.07 },
    { name: '木星', en: 'Jupiter', color: 0xd8a47f, size: 30, orbit: 330, speed: 0.046, au: 5.20, dia: 139820, fact: '最大的行星,大红斑风暴', spin: 0.040, incl: 0.05 },
    { name: '土星', en: 'Saturn', color: 0xe3c08a, size: 25, orbit: 414, speed: 0.034, au: 9.58, dia: 116460, fact: '环系壮丽的气态巨行星', spin: 0.038, ring: true, incl: -0.04 },
    { name: '天王星', en: 'Uranus', color: 0x8fe0e6, size: 18, orbit: 480, speed: 0.026, au: 19.2, dia: 50724, fact: '侧躺自转的冰巨星', spin: 0.030, incl: 0.07 },
    { name: '海王星', en: 'Neptune', color: 0x3b5bdb, size: 17, orbit: 540, speed: 0.020, au: 30.1, dia: 49244, fact: '最遥远的行星,狂风呼啸', spin: 0.032, incl: -0.06 }
  ];

  const bodies = [];
  PLANETS.forEach((p, i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.size, 40, 40),
      new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.95, metalness: 0, emissive: new THREE.Color(p.color).multiplyScalar(0.18) })
    );
    solarGroup.add(mesh);
    const label = document.createElement('div');
    label.className = 'planet-label' + (p.hero ? ' hero' : '');
    labelsEl.appendChild(label);
    let ringMesh = null;
    if (p.ring) {
      const rg = new THREE.RingGeometry(p.size * 1.4, p.size * 2.3, 64);
      const rm = new THREE.MeshBasicMaterial({ color: 0xd9c79a, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
      ringMesh = new THREE.Mesh(rg, rm);
      ringMesh.rotation.x = Math.PI / 2.2;
      mesh.add(ringMesh);
    }
    let moonMesh = null;
    if (p.moon) {
      moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.moon.size, 24, 24),
        new THREE.MeshStandardMaterial({ color: p.moon.color, roughness: 0.95, metalness: 0, emissive: new THREE.Color(p.moon.color).multiplyScalar(0.2) })
      );
      solarGroup.add(moonMesh);
      const ml = document.createElement('div');
      ml.className = 'planet-label small';
      labelsEl.appendChild(ml);
      p._moonLabel = ml;
    }
    // 初始相位均匀错开,避免所有行星一开始挤在同一侧
    const startAngle = (i / PLANETS.length) * Math.PI * 2 + Math.random() * 0.4;
    // 标签稳定偏好位:相邻行星交替上/下,避免每帧重排造成的上下游动
    const side = i % 2; // 0 = 上方, 1 = 下方
    bodies.push({ ...p, mesh, label, ringMesh, moonMesh, angle: startAngle, speed: p.speed != null ? p.speed : 0.08, incl: p.incl || 0, side });
  });

  // 投影辅助
  const proj = new THREE.Vector3();
  const _wp = new THREE.Vector3();
  // 屏幕空间标签防重叠:每帧收集所有标签的屏幕坐标,近的优先放置,
  // 冲突的标签做垂直偏移;都放不下则淡出,避免名称/坐标/特征互相叠在一起。
  const labelQueue = [];
  function queueLabel(el, obj, extra, side) {
    obj.getWorldPosition(_wp);
    proj.copy(_wp).project(camera);
    if (proj.z > 1) { el.style.opacity = '0'; return; }
    if (extra != null) el.innerHTML = extra;
    const w = el.offsetWidth || 160;
    const h = el.offsetHeight || 46;
    const x = (proj.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-proj.y * 0.5 + 0.5) * window.innerHeight;
    labelQueue.push({ el, x, y, w, h, depth: proj.z, side: side || 0 });
  }
  function resolveLabels() {
    labelQueue.sort((a, b) => a.depth - b.depth); // 近的先放
    const placed = [];
    for (const L of labelQueue) {
      const step = L.h * 1.4;
      // 稳定偏好位:上方行星 off=0,下方行星 off=+1.7h(标签落在行星下方)
      const pref = L.side ? L.h * 1.7 : 0;
      // 优先用稳定位,冲突时再向两侧扩展 —— 不再每帧全量重排,避免标签上下游动
      const offs = [pref, pref - step, pref + step, pref - step * 2, pref + step * 2, 0];
      let ok = false;
      for (const off of offs) {
        const ny = L.y + off;
        const box = {
          left: L.x - L.w / 2 - 4, right: L.x + L.w / 2 + 4,
          top: ny - 1.4 * L.h - 4, bottom: ny - 0.4 * L.h + 4
        };
        if (!placed.some(p => box.left < p.right && box.right > p.left && box.top < p.bottom && box.bottom > p.top)) {
          L.el.style.transform = `translate(-50%,-140%) translate(${L.x}px,${ny}px)`;
          L.el.style.opacity = '1';
          placed.push(box);
          ok = true;
          break;
        }
      }
      if (!ok) L.el.style.opacity = '0';
    }
    labelQueue.length = 0;
  }

  let raf = 0;
  const clock = new THREE.Clock();
  const state = { entering: false, enterT: 0, faded: false };

  function enter() {
    if (state.entering) return;
    state.entering = true;
    state.enterT = 0;
    enterBtn && (enterBtn.disabled = true);
    // 进入瞬间即开始构建主星海场景(在曲速过渡中进行,不阻塞开场动画),消除开场卡顿
    if (onEnterStart) onEnterStart();
  }
  enterBtn && (enterBtn.onclick = enter);

  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // 行星公转 + 自转(各自轨道倾角,轨迹更分散)
    bodies.forEach(b => {
      b.angle += b.speed * dt;
      const x = Math.cos(b.angle) * b.orbit;
      const z = Math.sin(b.angle) * b.orbit;
      const y = z * Math.sin(b.incl);
      const zr = z * Math.cos(b.incl);
      b.mesh.position.set(x, y, zr);
      b.mesh.rotation.y += b.spin;
      const ra = ((b.angle * 180 / Math.PI) % 360 + 360) % 360;
      const coord = `坐标 RA ${ra.toFixed(1)}° · 距日 ${b.au} AU`;
      queueLabel(b.label, b.mesh,
        `<span class="pl-name">${b.name} <em>${b.en}</em></span><span class="pl-coord">${coord}</span><span class="pl-fact">${b.fact}</span>`, b.side);
      if (b.moonMesh) {
        const ma = t * 0.8 + b.angle;
        b.moonMesh.position.set(x + Math.cos(ma) * b.moon.dist, y, zr + Math.sin(ma) * b.moon.dist);
        queueLabel(b._moonLabel, b.moonMesh,
          `<span class="pl-name">月球 <em>Moon</em></span><span class="pl-coord">地球天然卫星</span>`, 1);
      }
    });
    resolveLabels();

    sun.rotation.y += dt * 0.05;
    sunGlow.material.opacity = 0.75 + 0.2 * Math.sin(t * 0.8);
    coreGlow.material.opacity = 0.7 + 0.18 * Math.sin(t * 0.7);
    // 多层星空视差(点缀星光增强纵深感)
    farStars.rotation.y += dt * 0.006;
    midStars.rotation.y -= dt * 0.011;
    heroStars.rotation.y += dt * 0.009;
    heroStars.children.forEach(s => {
      const u = s.userData;
      const tw = 0.55 + 0.45 * Math.sin(t * u.sp + u.phase);
      s.material.opacity = 0.45 + 0.55 * tw;
      s.scale.setScalar(u.base * (0.85 + 0.3 * tw));
    });
    camera.position.x = Math.sin(t * 0.04) * 60;
    camera.position.y = 70 + Math.sin(t * 0.06) * 24;
    camera.position.z = 640 + Math.sin(t * 0.03) * 18;
    camera.lookAt(0, 0, 0);
    camera.rotation.z = Math.sin(t * 0.05) * 0.012;

    if (state.entering) {
      state.enterT += dt;
      const k = Math.min(1, state.enterT / 1.1);
      const e = k * k;
      camera.position.z = 640 - (640 - 60) * e;
      camera.position.x *= (1 - e);
      camera.position.y *= (1 - e);
      if (flashEl) flashEl.style.opacity = (k * 0.95).toFixed(2);
      if (k >= 1 && !state.faded) {
        state.faded = true;
        introEl.style.opacity = '0';
        setTimeout(() => {
          onEnter && onEnter();
          cleanup();
        }, 720);
      }
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  function cleanup() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    introEl && introEl.remove();
    renderer.dispose();
  }

  return { enter, cleanup };
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
