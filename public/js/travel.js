import * as THREE from 'three';
import { buildGalaxy } from './galaxy.js';

// 地球文明符号:文字系统、世界建筑、文明符号、艺术与科学里程碑。
// 竖排文字如时光碎片,从隧道四周缓缓划过,体现地球文明的多元与辉煌。
const QUOTES = [
  // 文字系统
  { text: '诗\n海\n星\n河', lang: '文字 · 中文', color: '#8fd3ff' },
  { text: '梦\n光\n文\n明', lang: '文字 · 中文', color: '#ffd9a0' },
  { text: 'A\nB\nC\nD\nE', lang: '文字 · 拉丁', color: '#9effe6' },
  { text: 'L\nI\nG\nH\nT', lang: '文字 · 英文', color: '#a8b6ff' },
  { text: 'ا\nب\nت\nث\nج', lang: '文字 · 阿拉伯', color: '#35e0ff' },
  { text: 'α\nβ\nγ\nδ\nε', lang: '文字 · 希腊', color: '#ff4fd8' },
  { text: 'あ\nい\nう\nえ\nお', lang: '文字 · 假名', color: '#8fe0e6' },
  { text: 'А\nБ\nВ\nГ\nД', lang: '文字 · 西里尔', color: '#ff9ec4' },
  { text: '가\n나\n다\n라\n마', lang: '文字 · 韩文', color: '#ffd9a0' },
  { text: 'Ω\nΦ\nΨ\nΣ\nΠ', lang: '文字 · 希腊字母', color: '#c9a8ff' },

  // 世界著名建筑
  { text: '金字塔\n吉萨', lang: '建筑 · 埃及', color: '#ffe08a' },
  { text: '埃菲尔\n铁塔', lang: '建筑 · 法国', color: '#ff9ec4' },
  { text: '万里\n长城', lang: '建筑 · 中国', color: '#b6ff9e' },
  { text: '泰姬陵', lang: '建筑 · 印度', color: '#9effe6' },
  { text: '自由\n女神', lang: '建筑 · 美国', color: '#8fd3ff' },
  { text: '悉尼\n歌剧院', lang: '建筑 · 澳洲', color: '#a8b6ff' },
  { text: '罗马\n斗兽场', lang: '建筑 · 意大利', color: '#ffd9a0' },
  { text: '比萨\n斜塔', lang: '建筑 · 意大利', color: '#35e0ff' },
  { text: '巴黎\n圣母院', lang: '建筑 · 法国', color: '#c9a8ff' },
  { text: '凯旋门', lang: '建筑 · 法国', color: '#ff4fd8' },
  { text: '大本钟', lang: '建筑 · 英国', color: '#8fe0e6' },
  { text: '布达拉\n宫', lang: '建筑 · 中国', color: '#ffe08a' },
  { text: '圣家族\n大教堂', lang: '建筑 · 西班牙', color: '#b6ff9e' },
  { text: '哈利法塔', lang: '建筑 · 迪拜', color: '#9effe6' },
  { text: '金门\n大桥', lang: '建筑 · 美国', color: '#a8b6ff' },
  { text: '吴哥窟', lang: '建筑 · 柬埔寨', color: '#ffd9a0' },

  // 人类文明符号
  { text: 'π\n3.14', lang: '符号 · 数学', color: '#35e0ff' },
  { text: '∞\n永恒', lang: '符号 · 数学', color: '#ff4fd8' },
  { text: 'Σ\n求和', lang: '符号 · 数学', color: '#8fd3ff' },
  { text: '♪\n♫\n♬', lang: '符号 · 音乐', color: '#c9a8ff' },
  { text: '⚛', lang: '符号 · 原子', color: '#9effe6' },
  { text: '☯', lang: '符号 · 太极', color: '#b6ff9e' },
  { text: '✡', lang: '符号 · 文明', color: '#ffd9a0' },
  { text: '☪', lang: '符号 · 文明', color: '#8fe0e6' },
  { text: '✝', lang: '符号 · 文明', color: '#a8b6ff' },
  { text: '卍', lang: '符号 · 文明', color: '#ffe08a' },
  { text: '0\n1\n0\n1', lang: '符号 · 二进制', color: '#ff9ec4' },
  { text: '≈\n≡\n≠', lang: '符号 · 逻辑', color: '#8fd3ff' },

  // 艺术与科学里程碑
  { text: '蒙娜\n丽莎', lang: '艺术 · 达芬奇', color: '#9effe6' },
  { text: '大卫', lang: '艺术 · 米开朗基罗', color: '#ffd9a0' },
  { text: '星空', lang: '艺术 · 梵高', color: '#8fd3ff' },
  { text: '向日葵', lang: '艺术 · 梵高', color: '#ffe08a' },
  { text: 'E = mc²', lang: '科学 · 相对论', color: '#ff4fd8' },
  { text: '万有\n引力', lang: '科学 · 牛顿', color: '#b6ff9e' },
  { text: '元素\n周期表', lang: '科学 · 门捷列夫', color: '#35e0ff' },
  { text: 'DNA\n双螺旋', lang: '科学 · 生命', color: '#c9a8ff' },
  { text: '日心说', lang: '科学 · 哥白尼', color: '#a8b6ff' },
  { text: '进化论', lang: '科学 · 达尔文', color: '#ff9ec4' },
  { text: '哈姆\n雷特', lang: '文学 · 莎士比亚', color: '#8fe0e6' },
  { text: '浮士德', lang: '文学 · 歌德', color: '#ffd9a0' },

  // 经典诗词 · 名句(逐字竖排,如时光长卷)
  { text: '床前明月光', lang: '诗词 · 李白', color: '#8fd3ff' },
  { text: '举头望明月', lang: '诗词 · 李白', color: '#ffd9a0' },
  { text: '长风破浪会有时', lang: '诗词 · 李白', color: '#9effe6' },
  { text: '天生我材必有用', lang: '诗词 · 李白', color: '#ffe08a' },
  { text: '疑是银河落九天', lang: '诗词 · 李白', color: '#35e0ff' },
  { text: '海内存知己', lang: '诗词 · 王勃', color: '#a8b6ff' },
  { text: '天涯若比邻', lang: '诗词 · 王勃', color: '#ff9ec4' },
  { text: '会当凌绝顶', lang: '诗词 · 杜甫', color: '#b6ff9e' },
  { text: '一览众山小', lang: '诗词 · 杜甫', color: '#8fe0e6' },
  { text: '海上生明月', lang: '诗词 · 张九龄', color: '#c9a8ff' },
  { text: '天涯共此时', lang: '诗词 · 张九龄', color: '#8fd3ff' },
  { text: '欲穷千里目', lang: '诗词 · 王之涣', color: '#ffd9a0' },
  { text: '更上一层楼', lang: '诗词 · 王之涣', color: '#9effe6' },
  { text: '但愿人长久', lang: '诗词 · 苏轼', color: '#ff4fd8' },
  { text: '千里共婵娟', lang: '诗词 · 苏轼', color: '#ffe08a' },
  { text: '路漫漫其修远兮', lang: '诗词 · 屈原', color: '#35e0ff' },
  { text: '吾将上下而求索', lang: '诗词 · 屈原', color: '#a8b6ff' },
  { text: '生如夏花之绚烂', lang: '诗句 · 泰戈尔', color: '#ff9ec4' },
  { text: 'To be,\nor not\nto be', lang: '诗句 · 莎士比亚', color: '#8fd3ff' },
  { text: 'Carpe\nDiem', lang: '诗句 · 贺拉斯', color: '#b6ff9e' },
  { text: 'The road\nnot taken', lang: '诗句 · 弗罗斯特', color: '#9effe6' },
  { text: 'And miles\nto go before\nI sleep', lang: '诗句 · 弗罗斯特', color: '#c9a8ff' }
];

  // 第一视角"时光飞船"穿越隧道:背景为科幻银河,可见飞船剪影,
  // 霓虹隧道环从远方飞来,地面网格向身后退去,竖排地球文明符号从四周缓缓划过。
// 约 14 秒后淡出并回调 onDone;点击任意处或按空格 / 回车可跳过。
export function createTravel({ onDone } = {}) {
  const overlay = document.createElement('div');
  overlay.id = 'travel';
  overlay.innerHTML =
    '<div id="travel-flash"></div>' +
    '<canvas id="travel-canvas"></canvas>' +
    '<div id="travel-cockpit">' +
      '<span class="tc-frame"></span>' +
      '<span class="tc-corner tl"></span><span class="tc-corner tr"></span>' +
      '<span class="tc-corner bl"></span><span class="tc-corner br"></span>' +
      '<span class="tc-reticle"></span>' +
    '</div>' +
    '<div id="travel-caption"><span class="tc-kicker">时光飞船 · 穿越文明的星河</span><span class="tc-line"></span></div>' +
    '<div id="travel-skip">点击任意处 · 跳过这段旅程</div>';
  document.body.appendChild(overlay);
  const canvas = overlay.querySelector('#travel-canvas');
  const flash = overlay.querySelector('#travel-flash');
  const tcLine = overlay.querySelector('.tc-line');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04050e);
  scene.fog = new THREE.FogExp2(0x04050e, 0.00035);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 8000);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -1);

  // 科幻银河背景(与开场页同款),旅途中缓慢自转作为流动幕布
  const { galaxy, coreGlow } = buildGalaxy(scene);

  // ===================== 霓虹时光隧道环 =====================
  const RING_N = 36;
  const rings = [];
  const ringColors = [0x35e0ff, 0xff4fd8, 0x9b5cff, 0x4f7bff, 0x35ffd0];
  const ringGeo = new THREE.RingGeometry(180, 188, 64);
  for (let i = 0; i < RING_N; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: ringColors[i % ringColors.length], side: THREE.DoubleSide,
      transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const m = new THREE.Mesh(ringGeo, mat);
    m.position.z = -200 - i * 110;
    m.rotation.z = Math.random() * Math.PI;
    m.userData = { speed: 150 + Math.random() * 60, rotSp: (Math.random() - 0.5) * 0.15 };
    scene.add(m);
    rings.push(m);
  }

  // 隧道纵向光束(12 条从远到近的霓虹线)
  const beamGeo = new THREE.BufferGeometry();
  const beamPos = new Float32Array(12 * 2 * 3);
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const r = 185;
    beamPos[i * 6] = Math.cos(ang) * r; beamPos[i * 6 + 1] = Math.sin(ang) * r; beamPos[i * 6 + 2] = 200;
    beamPos[i * 6 + 3] = Math.cos(ang) * r; beamPos[i * 6 + 4] = Math.sin(ang) * r; beamPos[i * 6 + 5] = -4200;
  }
  beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPos, 3));
  const beamMat = new THREE.LineBasicMaterial({ color: 0x5c7dff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending });
  const beams = new THREE.LineSegments(beamGeo, beamMat);
  scene.add(beams);

  // ===================== 透视网格地面 / 天花 =====================
  const gridTex = makeGridTexture();
  gridTex.wrapS = THREE.RepeatWrapping; gridTex.wrapT = THREE.RepeatWrapping;
  gridTex.repeat.set(8, 40);
  const gridMat = new THREE.MeshBasicMaterial({
    map: gridTex, transparent: true, opacity: 0.35,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 6000), gridMat);
  floor.rotation.x = -Math.PI / 2.18;
  floor.position.set(0, -260, -2000);
  scene.add(floor);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(900, 6000), gridMat.clone());
  ceiling.rotation.x = Math.PI / 2.18;
  ceiling.position.set(0, 260, -2000);
  scene.add(ceiling);

  // ===================== 可见飞船剪影(底部座舱 + 机翼) =====================
  const shipTex = makeShipTexture();
  const shipMat = new THREE.SpriteMaterial({ map: shipTex, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const ship = new THREE.Sprite(shipMat);
  ship.scale.set(420, 140, 1);
  ship.position.set(0, -130, -120);
  scene.add(ship);

  // 飞船两侧舷窗微光
  const winGeo = new THREE.BufferGeometry();
  const winPos = new Float32Array([
    -130, -105, -118, -90, -105, -118,
    90, -105, -118, 130, -105, -118
  ]);
  winGeo.setAttribute('position', new THREE.BufferAttribute(winPos, 3));
  const winMat = new THREE.PointsMaterial({ color: 0x8fd3ff, size: 6, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
  const shipWindows = new THREE.Points(winGeo, winMat);
  scene.add(shipWindows);

  // ===================== 竖排名句流光 =====================
  const pool = QUOTES.map(q => {
    const tex = makeVerticalTextTexture(q.text, q.color);
    // 行数越多(如整句诗)竖条越长,单字符号保持紧凑,保证每个字都清晰完整
    const boost = Math.min(1.9, Math.max(1, tex.lineCount / 3.2));
    return { tex, aspect: tex.image.width / tex.image.height, color: q.color, lang: q.lang, boost };
  });
  const POEM_N = 22;
  const poemSprites = [];
  const poemGroup = new THREE.Group();
  scene.add(poemGroup);
  for (let i = 0; i < POEM_N; i++) {
    const k = i % pool.length;
    const p = pool[k];
    const mat = new THREE.SpriteMaterial({ map: p.tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 });
    const s = new THREE.Sprite(mat);
    const baseH = (120 + Math.random() * 55) * p.boost; // 竖条高度随字数自适应,整句诗完整呈现
    const baseW = baseH * p.aspect;               // 竖条宽度
    s.scale.set(baseW, baseH, 1);
    const angle = Math.random() * Math.PI * 2;
    const radius = 100 + Math.random() * 360;
    s.userData = {
      baseW, baseH,
      speed: 150 + Math.random() * 60,            // 稍快,悠然但不拖沓
      x: Math.cos(angle) * radius,
      y: (Math.random() - 0.5) * 380,
      z: -3500 + Math.random() * 3600,
      radius, angle,
      rotOffset: (Math.random() - 0.5) * 0.22,    // 轻微倾斜,不像刻板的标语
      poolIdx: k
    };
    s.position.set(s.userData.x, s.userData.y, s.userData.z);
    s.material.rotation = s.userData.rotOffset;
    poemGroup.add(s);
    poemSprites.push(s);
  }
  function resetPoem(s) {
    const u = s.userData;
    const k = (Math.random() * pool.length) | 0;
    const p = pool[k];
    u.poolIdx = k;
    u.baseH = (120 + Math.random() * 55) * p.boost;
    u.baseW = u.baseH * p.aspect;
    s.material.map = p.tex;
    s.material.needsUpdate = true;
    u.z = -3600 - Math.random() * 600;
    u.angle = Math.random() * Math.PI * 2;
    u.radius = 100 + Math.random() * 360;
    u.x = Math.cos(u.angle) * u.radius;
    u.y = (Math.random() - 0.5) * 380;
    u.speed = 150 + Math.random() * 60;
    u.rotOffset = (Math.random() - 0.5) * 0.22;
    s.material.rotation = u.rotOffset;
    s.scale.set(u.baseW, u.baseH, 1);
  }

  // 底部字幕:跟随最接近相机(可读)的名句语言切换
  let lastLang = '';
  function updateCaption() {
    let best = null, bestZ = -1e9;
    for (const s of poemSprites) {
      const z = s.userData.z;
      if (z > -2200 && z < 40 && z > bestZ) { bestZ = z; best = s; }
    }
    const lang = best ? pool[best.userData.poolIdx].lang : '';
    if (lang && lang !== lastLang) {
      lastLang = lang;
      tcLine.textContent = lang;
      tcLine.style.opacity = '0.92';
    }
  }

  // ===================== 环境微光(增强飞船内立体感) =====================
  const ambient = new THREE.AmbientLight(0x1a3050, 0.6);
  scene.add(ambient);
  const dashLight = new THREE.PointLight(0x4f7bff, 1.2, 600);
  dashLight.position.set(0, -80, -60);
  scene.add(dashLight);

  const clock = new THREE.Clock();
  let elapsed = 0;
  const DURATION = 13;
  let skipped = false, finishing = false, raf = 0;

  function finish() {
    if (finishing) return;
    finishing = true;
    overlay.classList.add('fade');
    setTimeout(() => { cleanup(); if (onDone) onDone(); }, 1000);
  }
  function skip() { if (!finishing) { skipped = true; finish(); } }
  overlay.addEventListener('click', skip);
  window.addEventListener('keydown', onKey);
  function onKey(e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); skip(); } }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;
    const t = elapsed;

    if (flash) flash.style.opacity = Math.max(0, 1 - t / 0.7).toFixed(3);

    // 霓虹隧道环:从远方飞向相机,超过后回收到远处
    for (const r of rings) {
      r.position.z += r.userData.speed * dt;
      r.rotation.z += r.userData.rotSp * dt;
      if (r.position.z > 160) r.position.z = -3800 - Math.random() * 400;
      const prox = THREE.MathUtils.clamp(1 - (r.position.z + 3800) / 4000, 0, 1);
      r.material.opacity = 0.08 + prox * 0.28;
    }

    // 网格地面/天花:纹理向后滚动,营造飞船前行
    gridTex.offset.y -= 0.3 * dt;

    // 竖排名句:缓缓向前,完整竖条清晰可读,轻微绕隧道中心摆动
    for (const s of poemSprites) {
      const u = s.userData;
      u.z += u.speed * dt;
      if (u.z > 140) resetPoem(s);
      const drift = Math.sin(t * 0.4 + u.angle) * 18;
      s.position.set(u.x + drift, u.y, u.z);
      const prox = THREE.MathUtils.clamp((u.z + 3600) / 3700, 0, 1);
      // 靠近时整体放大(等比例,文字不变形),远离时略小
      s.scale.set(u.baseW * (0.82 + prox * 0.42), u.baseH * (0.9 + prox * 0.28), 1);
      let op = 1;
      if (u.z < -3000) op = (u.z + 3600) / 600;        // 远处缓缓淡入
      else if (u.z > 60) op = 1 - (u.z - 60) / 220;    // 很近才淡出,全程停留更久
      s.material.opacity = Math.max(0, Math.min(1, op)) * (0.78 + prox * 0.22);
    }
    updateCaption();

    // 飞船轻微呼吸(跃迁震动)
    ship.position.y = -130 + Math.sin(t * 1.8) * 2.2 + Math.sin(t * 5.5) * 0.8;
    ship.position.x = Math.sin(t * 0.6) * 4;
    shipWindows.position.y = ship.position.y + 25;
    shipWindows.position.x = ship.position.x;

    // 相机:低速轻微摇摆 + 视场呼吸
    const warp = 1 + 0.03 * Math.sin(t * 1.1);
    camera.fov = 70 * warp; camera.updateProjectionMatrix();
    camera.rotation.z = Math.sin(t * 0.25) * 0.015;
    camera.position.y = Math.sin(t * 0.35) * 5;
    camera.position.x = Math.sin(t * 0.22) * 4;

    // 背景银河缓慢自转 + 银心呼吸
    galaxy.rotation.z += dt * 0.015;
    if (coreGlow) coreGlow.material.opacity = 0.7 + 0.2 * Math.sin(t * 0.7);

    renderer.render(scene, camera);
    if (elapsed < DURATION && !skipped) raf = requestAnimationFrame(animate);
    else finish();
  }
  animate();

  function cleanup() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('keydown', onKey);
    overlay.remove();
    renderer.dispose();
  }
}

function makeGridTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = 'rgba(120,200,255,0.55)';
  ctx.lineWidth = 2;
  // 横线(透视感:远处密,近处疏由纹理 repeat 自动处理)
  for (let y = 0; y <= c.height; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke();
  }
  // 竖线
  for (let x = 0; x <= c.width; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke();
  }
  // 中央亮线
  ctx.strokeStyle = 'rgba(255,120,220,0.45)';
  ctx.beginPath(); ctx.moveTo(c.width / 2, 0); ctx.lineTo(c.width / 2, c.height); ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function makeShipTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 170;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  const cx = c.width / 2, cy = c.height / 2 + 25;
  // 绘制飞船底部剪影:两侧机翼 + 中央座舱
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(80,180,255,0.92)';
  ctx.shadowColor = 'rgba(53,224,255,0.8)'; ctx.shadowBlur = 18;
  ctx.beginPath();
  // 左翼
  ctx.moveTo(cx - 220, cy + 30);
  ctx.lineTo(cx - 120, cy - 10);
  ctx.lineTo(cx - 70, cy + 10);
  // 中央座舱
  ctx.lineTo(cx - 50, cy - 25);
  ctx.lineTo(cx + 50, cy - 25);
  ctx.lineTo(cx + 70, cy + 10);
  // 右翼
  ctx.lineTo(cx + 120, cy - 10);
  ctx.lineTo(cx + 220, cy + 30);
  ctx.lineTo(cx + 160, cy + 35);
  ctx.lineTo(cx - 160, cy + 35);
  ctx.closePath();
  ctx.stroke();
  // 内部填充(深色半透明)
  ctx.fillStyle = 'rgba(8,16,34,0.72)';
  ctx.shadowBlur = 0;
  ctx.fill();
  // 仪表盘线条
  ctx.strokeStyle = 'rgba(120,210,255,0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 45, cy - 15); ctx.lineTo(cx + 45, cy - 15);
  ctx.moveTo(cx - 35, cy - 5); ctx.lineTo(cx + 35, cy - 5);
  ctx.moveTo(cx - 20, cy + 5); ctx.lineTo(cx + 20, cy + 5);
  ctx.stroke();
  // 中心准星灯
  ctx.fillStyle = 'rgba(255,79,216,0.95)';
  ctx.shadowColor = 'rgba(255,79,216,0.9)'; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.arc(cx, cy - 45, 5, 0, Math.PI * 2); ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter; tex.needsUpdate = true;
  return tex;
}

function makeVerticalTextTexture(text, color) {
  const fontSize = 64;
  const pad = 38;
  const lineH = fontSize * 1.18;
  // 纯中日韩文本(无换行标记的整句)自动逐字竖排,呈现完整的竖长条
  const CJK_ONLY = /^[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af·]+$/;
  let lines = [];
  for (const seg of text.split('\n')) {
    if (CJK_ONLY.test(seg) && seg.length > 2) lines.push(...seg.split(''));
    else lines.push(seg);
  }
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `bold ${fontSize}px "PingFang SC","Microsoft YaHei",system-ui,sans-serif`;
  let maxW = fontSize;
  for (const line of lines) maxW = Math.max(maxW, measure.measureText(line).width);
  // 关键修复:画布宽度按实际最宽行计算,任何名称都完整显示、不再裁切
  const w = Math.ceil(maxW) + pad * 2;
  const h = lines.length * lineH + pad * 2;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.font = `bold ${fontSize}px "PingFang SC","Microsoft YaHei",system-ui,sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 26;
  ctx.fillStyle = '#ffffff';
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, pad + i * lineH + lineH / 2);
  });
  ctx.shadowBlur = 12;
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = color;
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, pad + i * lineH + lineH / 2);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  tex.lineCount = lines.length;
  return tex;
}
