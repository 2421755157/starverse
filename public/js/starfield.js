import * as THREE from 'three';

const TYPE_COLOR = {
  poem: 0x8fd3ff,
  essay: 0xffd9a0,
  quote: 0xc9a8ff
};

// 主题配色(中文主题名 → 十六进制)
export const THEME_COLORS = {
  '自然': 0x8fd3ff,
  '人生': 0xffd9a0,
  '爱情': 0xff9ec4,
  '励志': 0xb6ff9e,
  '哲思': 0xc9a8ff,
  '时间': 0xffe08a,
  '梦想': 0x9effe6,
  '孤独': 0xa8b6ff
};
function themeColor(theme) { return THEME_COLORS[theme] || 0xffffff; }

export function createStarfield(canvas, { onSelect, onHover }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060f, 0.00028);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 8000);
  camera.position.set(0, 120, 1200);

  // ===================== 动态变幻的星云背景(自定义着色器) =====================
  const bgGeo = new THREE.SphereGeometry(3600, 48, 48);
  const bgMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0x03040f) },
      uColorB: { value: new THREE.Color(0x06122e) },
      uColorC: { value: new THREE.Color(0x14063a) },
      uColorD: { value: new THREE.Color(0x021a24) }
    },
    vertexShader: `
      varying vec3 vDir;
      void main(){
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vDir;
      uniform float uTime;
      uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC; uniform vec3 uColorD;
      float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
      float noise(vec3 p){
        vec3 i=floor(p), f=fract(p);
        f=f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                       mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                   mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                       mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
      void main(){
        vec3 d = normalize(vDir);
        float t = uTime*0.025;
        float n1 = noise(d*2.5 + vec3(t, t*0.7, -t*0.5));
        float n2 = noise(d*5.0 - vec3(t*0.6, t*0.3, t*0.2));
        float n3 = noise(d*1.6 + vec3(-t*0.4, t*0.9, t*0.3));
        vec3 col = mix(uColorA, uColorB, smoothstep(0.0,1.0,n1));
        col = mix(col, uColorC, smoothstep(0.35,1.0,n2));
        col = mix(col, uColorD, smoothstep(0.55,1.0,n3));
        // 极光带(科幻感):流动的青/品红带状辉光
        float aurora = sin(d.x*3.5 + uTime*0.30) * sin(d.y*2.2 - uTime*0.22) * sin(d.z*2.8 + uTime*0.18);
        aurora = smoothstep(0.55, 1.0, aurora);
        col += aurora * vec3(0.0, 0.55, 0.75);                       // 青色极光
        col += smoothstep(0.85, 1.0, aurora) * vec3(0.85, 0.0, 0.6); // 品红高光
        // 远处星系核心辉光(指向 +Z 方向)
        float core = smoothstep(0.55, 1.0, dot(d, normalize(vec3(0.0, 0.18, 1.0))));
        col += core * vec3(0.10, 0.45, 0.75) * (0.6 + 0.4*sin(uTime*0.2));
        // 缓慢的色相漂移
        float hue = 0.5 + 0.5*sin(uTime*0.04);
        col += 0.05*hue*vec3(0.20, 0.10, 0.35);
        // 中心微亮,边缘更暗,增强纵深
        float vig = 0.7 + 0.3*smoothstep(0.15, 1.0, abs(d.y));
        gl_FragColor = vec4(col*vig, 1.0);
      }
    `
  });
  const bgMesh = new THREE.Mesh(bgGeo, bgMat);
  bgMesh.renderOrder = -999;
  scene.add(bgMesh);

  // ===================== 满天繁星 · 银河系(逐颗独立闪烁) =====================
  // 三层结构:① 球壳弥散繁星(HALO)  ② 银河盘面旋臂(DISK)  ③ 霓虹亮星(NEON)
  const STAR_HALO = 9000;    // 均匀铺满整个天球的繁星(密度适中,均匀散开)
  const STAR_DISK = 6500;    // 银河系盘面(旋臂 + 银心隆起)
  const NEON = 110;          // 少量高亮霓虹巨星
  const starCount = STAR_HALO + STAR_DISK + NEON;
  const starPos = new Float32Array(starCount * 3);
  const starPhase = new Float32Array(starCount);
  const starSize = new Float32Array(starCount);
  const starColor = new Float32Array(starCount * 3);
  const neonPal = [new THREE.Color(0x00e5ff), new THREE.Color(0xff2bd6), new THREE.Color(0x7a3cff), new THREE.Color(0x6effc8)];
  const tmpC = new THREE.Color();

  // 银河系盘面朝向:略微倾斜的平面,让银河带斜跨天空
  const DISK_TILT = 0.42;              // 盘面倾角(弧度)
  const cosT = Math.cos(DISK_TILT), sinT = Math.sin(DISK_TILT);
  const ARMS = 4;                      // 旋臂数
  const ARM_WIND = 2.6;                // 旋臂缠绕圈数
  const DISK_R = 2600;                 // 银盘半径

  let p = 0;
  // ① HALO —— 均匀弥散繁星(整片天球都是星)
  for (let i = 0; i < STAR_HALO; i++, p++) {
    const r = 1200 + Math.random() * 2100;   // 拉开最近距离,避免出现过大的星点
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[p * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[p * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[p * 3 + 2] = r * Math.cos(phi);
    starPhase[p] = Math.random() * Math.PI * 2;
    // 冷白偏蓝的微小繁星
    tmpC.setHSL(0.58 + Math.random() * 0.08, 0.35 + Math.random() * 0.35, 0.62 + Math.random() * 0.28);
    // 真实星等分布:绝大多数是细小微星,亮星稀少(幂律分布)
    starSize[p] = 0.6 + Math.pow(Math.random(), 2.6) * 2.2;
    starColor[p * 3] = tmpC.r; starColor[p * 3 + 1] = tmpC.g; starColor[p * 3 + 2] = tmpC.b;
  }
  // ② DISK —— 银河盘面 + 旋臂(密集恒星带,营造银河系)
  for (let i = 0; i < STAR_DISK; i++, p++) {
    // 半径分布:向银心聚集(sqrt 使外围也够密)
    const rad = Math.pow(Math.random(), 0.55) * DISK_R;
    const arm = (i % ARMS) / ARMS * Math.PI * 2;
    // 旋臂角度 + 抖动(越外围抖动越大,形成蓬松旋臂)
    const jitter = (Math.random() - 0.5) * (0.5 + rad / DISK_R * 0.9);
    const ang = arm + (rad / DISK_R) * ARM_WIND * Math.PI * 2 + jitter;
    // 盘面厚度:银心隆起(bulge)更厚,外围更薄
    const bulge = Math.max(0, 1 - rad / (DISK_R * 0.45));
    const thick = (60 + bulge * 320) * (Math.random() - 0.5) * 2 * 0.5;
    let dx = Math.cos(ang) * rad;
    let dz = Math.sin(ang) * rad;
    let dy = thick;
    // 倾斜盘面
    const ry = dy * cosT - dz * sinT;
    const rz = dy * sinT + dz * cosT;
    starPos[p * 3] = dx;
    starPos[p * 3 + 1] = ry;
    starPos[p * 3 + 2] = rz;
    starPhase[p] = Math.random() * Math.PI * 2;
    // 银心暖黄 → 外围冷蓝
    const warm = bulge;
    tmpC.setHSL(0.58 - warm * 0.45, 0.5 + warm * 0.3, 0.6 + Math.random() * 0.25);
    starSize[p] = 0.6 + Math.pow(Math.random(), 2.2) * (1.4 + bulge * 1.6);
    starColor[p * 3] = tmpC.r; starColor[p * 3 + 1] = tmpC.g; starColor[p * 3 + 2] = tmpC.b;
  }
  // ③ NEON —— 稀疏霓虹巨星(点缀)
  for (let i = 0; i < NEON; i++, p++) {
    const r = 1300 + Math.random() * 1800;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[p * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[p * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[p * 3 + 2] = r * Math.cos(phi);
    starPhase[p] = Math.random() * Math.PI * 2;
    const c = neonPal[(Math.random() * neonPal.length) | 0];
    starSize[p] = 2.2 + Math.random() * 2.4;
    starColor[p * 3] = c.r; starColor[p * 3 + 1] = c.g; starColor[p * 3 + 2] = c.b;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhase, 1));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSize, 1));
  starGeo.setAttribute('aColor', new THREE.BufferAttribute(starColor, 3));
  const starMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float aPhase; attribute float aSize; attribute vec3 aColor;
      uniform float uTime; varying float vTw; varying vec3 vColor;
      void main(){
        float tw = 0.5 + 0.5*sin(uTime*3.0 + aPhase);
        vTw = tw; vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        float s = aSize * (0.8 + 0.4*tw);
        // 尺寸封顶:相机靠近时星点不会膨胀成大光斑,保持细腻星空质感
        gl_PointSize = min(s * (300.0 / -mv.z), 6.5);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying float vTw; varying vec3 vColor;
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c)*2.0;
        // 锐利内核 + 微弱光晕:更接近真实星点,而非发糊的光斑
        float core = smoothstep(0.55, 0.0, d);
        float halo = smoothstep(1.0, 0.3, d)*0.22;
        float a = core + halo;
        vec3 col = vColor * (0.55 + 0.6*vTw) + vTw*vTw*0.1;
        gl_FragColor = vec4(col, a*(0.4 + 0.6*vTw));
      }
    `
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // ===================== 银河系发光雾带(银河带辉光) =====================
  const galaxyGeo = new THREE.PlaneGeometry(6400, 6400, 1, 1);
  const galaxyMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                   mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      void main(){
        vec2 uv = vUv - 0.5;
        float r = length(uv);
        // 旋臂状扰动 + 径向衰减,形成银河盘辉光
        float ang = atan(uv.y, uv.x);
        float spiral = sin(ang*2.0 + r*22.0 - uTime*0.15);
        float n = noise(uv*7.0 + vec2(uTime*0.03, -uTime*0.02));
        float band = smoothstep(0.5, 0.0, r);                 // 中心亮,外围暗
        float core = smoothstep(0.14, 0.0, r);                // 银心隆起
        float arms = 0.5 + 0.5*spiral;
        float glow = band*(0.35 + 0.5*n) * (0.6 + 0.4*arms) + core*0.9;
        vec3 cCore = vec3(1.0, 0.86, 0.55);                   // 银心暖黄
        vec3 cArm  = vec3(0.35, 0.55, 1.0);                   // 旋臂冷蓝
        vec3 cHaze = vec3(0.55, 0.30, 0.75);                  // 星际紫雾
        vec3 col = mix(cArm, cCore, core);
        col = mix(col, cHaze, n*0.4);
        gl_FragColor = vec4(col * glow, glow*0.7);
      }
    `
  });
  const galaxyHaze = new THREE.Mesh(galaxyGeo, galaxyMat);
  galaxyHaze.rotation.x = -Math.PI / 2 + DISK_TILT; // 与盘面星群同倾角
  galaxyHaze.renderOrder = -900;
  scene.add(galaxyHaze);

  // ===================== 科幻能量门(中心旋转光环) =====================
  const ringGroup = new THREE.Group();
  function makeRing(radius, color, tiltX, tiltZ) {
    const geo = new THREE.RingGeometry(radius, radius + 7, 160);
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.4, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = tiltX; m.rotation.z = tiltZ;
    return m;
  }
  ringGroup.add(makeRing(300, 0x00e5ff, Math.PI / 2.25, 0));
  ringGroup.add(makeRing(430, 0xff2bd6, Math.PI / 2.6, 0.6));
  ringGroup.add(makeRing(560, 0x7a3cff, Math.PI / 2.1, -0.4));
  scene.add(ringGroup);

  // ===================== 超空间星流(曲速线条) =====================
  const WARP = 600;
  const warpPos = new Float32Array(WARP * 2 * 3);
  const warpCol = new Float32Array(WARP * 2 * 3);
  const warpData = [];
  function spawnWarp(i, initial) {
    warpData[i] = {
      ox: (Math.random() - 0.5) * 1900,
      oy: (Math.random() - 0.5) * 1900,
      oz: initial ? (Math.random() * 2700 - 2200) : -(1500 + Math.random() * 2600),
      speed: 1100 + Math.random() * 1900
    };
  }
  for (let i = 0; i < WARP; i++) spawnWarp(i, true);
  const warpGeo = new THREE.BufferGeometry();
  warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPos, 3));
  warpGeo.setAttribute('color', new THREE.BufferAttribute(warpCol, 3));
  const warpMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const warpLines = new THREE.LineSegments(warpGeo, warpMat);
  warpLines.frustumCulled = false;
  warpLines.visible = false;   // 默认隐藏:仅在"进入地球村"的短暂曲速过渡中显示,平时不出现白色划痕
  scene.add(warpLines);

  // ===================== 科幻网格地面(Tron 风) =====================
  const gridGeo = new THREE.PlaneGeometry(7200, 7200, 1, 1);
  const gridMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vW;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vW = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vW; uniform float uTime;
      float gridLine(vec2 p, float scale){
        vec2 q = abs(fract(p/scale - 0.5) - 0.5);
        float line = min(q.x, q.y);
        return smoothstep(0.045, 0.0, line);
      }
      void main(){
        vec2 p = vW.xz + vec2(uTime*45.0, uTime*22.0);
        float g1 = gridLine(p, 140.0);
        float g2 = gridLine(p, 700.0);
        float dist = length(vW.xz);
        float fade = smoothstep(3200.0, 150.0, dist);
        float glow = g1*0.45 + g2*0.95;
        vec3 col = mix(vec3(0.0,0.85,1.0), vec3(0.7,0.3,1.0), g2) * glow * fade;
        float a = clamp(glow*fade, 0.0, 1.0) * 0.85;
        gl_FragColor = vec4(col, a);
      }
    `
  });
  const grid = new THREE.Mesh(gridGeo, gridMat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -460;
  scene.add(grid);

  // ===================== 缓慢漂移的星云团(柔和光斑) =====================
  function makeSoftTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.25)');
    g.addColorStop(0.7, 'rgba(255,255,255,0.06)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
  const softTex = makeSoftTexture();
  const nebulaColors = [0x00e5ff, 0xff2bd6, 0x7a3cff, 0x39d9c4, 0x4b6bff, 0xb46bff];
  const clouds = [];
  const cloudGroup = new THREE.Group();
  scene.add(cloudGroup);
  for (let i = 0; i < 18; i++) {
    const mat = new THREE.SpriteMaterial({
      map: softTex, color: nebulaColors[i % nebulaColors.length],
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.0
    });
    const cl = new THREE.Sprite(mat);
    const r = 500 + Math.random() * 1200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    cl.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta) * 0.7, r * Math.cos(phi));
    const sc = 260 + Math.random() * 360;
    cl.scale.setScalar(sc);
    cl.userData = { baseScale: sc, phase: Math.random() * Math.PI * 2, drift: 0.04 + Math.random() * 0.06 };
    cloudGroup.add(cl);
    clouds.push(cl);
  }

  // ===================== 内容光点(每颗 = 一篇不同内容) =====================
  const spriteGroup = new THREE.Group();
  scene.add(spriteGroup);
  let sprites = [];
  let hoveredSprite = null;

  function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.2, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.75, 'rgba(255,255,255,0.15)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const glowTex = makeGlowTexture();

  // 彗星拖尾贴图(横向渐变 + 头部亮核),用于真实感流星
  function makeStreakTexture() {
    const w = 128, h = 40;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.16)');
    g.addColorStop(0.82, 'rgba(255,255,255,0.66)');
    g.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const rg = ctx.createRadialGradient(w - 13, h / 2, 0, w - 13, h / 2, 13);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.5, 'rgba(255,255,255,0.6)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(w - 13, h / 2, 13, 0, Math.PI * 2); ctx.fill();
    return new THREE.CanvasTexture(c);
  }
  const streakTex = makeStreakTexture();
  const METEOR_COLORS = [0xffffff, 0xbfefff, 0xffe6b0, 0xb6fff0, 0xd9c2ff, 0xa9d8ff];

  // 主题簇心(供 setItems 与 addItem 复用,避免重复计算)
  let centers = {};
  const clusterR = 1000;

  function spawnSprite(it) {
    const color = themeColor(it.theme);
    const isUser = !!it.is_user;
    const dispColor = isUser ? 0xffd166 : color;
    const mat = new THREE.SpriteMaterial({
      map: glowTex, color: dispColor, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.95
    });
    const sp = new THREE.Sprite(mat);
    const c = centers[it.theme || '其他'] || new THREE.Vector3(0, 0, 0);
    const spread = 420;
    const g = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    sp.position.set(
      c.x + g() * spread,
      c.y + g() * spread,
      c.z + g() * spread
    );
    const baseScale = (isUser ? 48 : 34) + Math.random() * 18;
    sp.scale.setScalar(baseScale);
    sp.userData = { item: it, baseY: sp.position.y, theme: it.theme, baseScale, baseColor: new THREE.Color(dispColor), phase: Math.random() * Math.PI * 2, isUser };
    spriteGroup.add(sp);
    sprites.push(sp);
    return sp;
  }

  function setItems(items) {
    sprites.forEach(s => spriteGroup.remove(s));
    sprites = [];

    // 按主题分簇:每个主题一个簇心,环绕排布(内容星分布于银河各处)
    const themes = [];
    items.forEach(it => { const t = it.theme || '其他'; if (!themes.includes(t)) themes.push(t); });
    centers = {};
    themes.forEach((t, k) => {
      const ang = (k / Math.max(1, themes.length)) * Math.PI * 2;
      centers[t] = new THREE.Vector3(Math.cos(ang) * clusterR, (k % 2 ? 220 : -220), Math.sin(ang) * clusterR);
    });

    items.forEach(it => spawnSprite(it));
    return themes;
  }

  // 增量添加单颗星(发布作品时调用,避免全量重建造成的卡顿)
  function addItem(it) {
    if (!centers[it.theme || '其他']) {
      // 主题簇心尚未建立(如游客模式下新主题),补一个
      const k = Object.keys(centers).length;
      const ang = (k / Math.max(1, k + 1)) * Math.PI * 2;
      centers[it.theme || '其他'] = new THREE.Vector3(Math.cos(ang) * clusterR, (k % 2 ? 220 : -220), Math.sin(ang) * clusterR);
    }
    const sp = spawnSprite(it);
    if (it.is_user) spawnRipple(sp.position.clone(), new THREE.Color(0xffd166));
    return sp;
  }

  // 筛选:仅显示 id 在 visibleIds 中的光点
  function applyFilter(visibleIds) {
    const set = visibleIds ? new Set(visibleIds.map(String)) : null;
    sprites.forEach(s => {
      s.visible = !set || set.has(String(s.userData.item.id));
    });
  }

  // ===================== 流星 / 流星雨特效 =====================
  const meteors = [];
  let meteorTimer = 1.5 + Math.random() * 2;
  function spawnMeteor(opts) {
    opts = opts || {};
    const mat = new THREE.SpriteMaterial({
      map: streakTex, color: opts.color || METEOR_COLORS[(Math.random() * METEOR_COLORS.length) | 0],
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0, rotation: 0
    });
    const m = new THREE.Sprite(mat);
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const dist = 700 + Math.random() * 500;
    const ox = opts.ox != null ? opts.ox : (Math.random() - 0.5) * 700;
    const oy = opts.oy != null ? opts.oy : (Math.random() - 0.5) * 560;
    m.position.copy(camera.position).addScaledVector(fwd, dist)
      .addScaledVector(right, ox).addScaledVector(up, oy);
    // 默认朝斜下方掠过
    const ang = opts.ang != null ? opts.ang : ((Math.random() - 0.5) * 0.7 - 0.15);
    const dir = new THREE.Vector3().addScaledVector(right, Math.cos(ang)).addScaledVector(up, Math.sin(ang)).normalize();
    const sp = 950 + Math.random() * 600;
    const vel = dir.multiplyScalar(sp);
    mat.rotation = Math.atan2(dir.y, dir.x);
    const baseLen = 130 + Math.random() * 150;
    m.scale.set(baseLen, 8 + Math.random() * 5, 1);
    m.userData = { vel, life: 0, max: 1.0 + Math.random() * 0.7, baseLen };
    scene.add(m);
    meteors.push(m);
  }
  // 流星雨:同一辐射点方向落下多颗,更具真实感
  function spawnShower(n) {
    const rad = (Math.random() - 0.5) * 0.5 - 0.05;
    for (let i = 0; i < n; i++) {
      spawnMeteor({
        ox: (Math.random() - 0.5) * 950,
        oy: 280 + Math.random() * 380,
        ang: rad + (Math.random() - 0.5) * 0.28,
        color: METEOR_COLORS[(Math.random() * METEOR_COLORS.length) | 0]
      });
    }
  }

  // ===================== 选中涟漪脉冲 =====================
  const ripples = [];
  function spawnRipple(pos, color) {
    const mat = new THREE.SpriteMaterial({
      map: glowTex, color, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.95
    });
    const r = new THREE.Sprite(mat);
    r.position.copy(pos);
    r.userData = { life: 0, max: 0.85, base: 50 };
    scene.add(r);
    ripples.push(r);
  }

  // ---------- 飞行控制 ----------
  let yaw = 0, pitch = 0;
  let speed = 2.2;
  let warpBoost = 0;            // 曲速冲刺(进入星系/穿梭感)计时
  let lastHover = 0;           // 悬停拾取节流
  let paused = false;          // 时光飞船旅程期间暂停渲染,省算力
  const keys = {};
  let dragging = false;
  let lastX = 0, lastY = 0, downX = 0, downY = 0, moved = 0;

  function onPointerDown(e) {
    dragging = true;
    lastX = downX = e.clientX;
    lastY = downY = e.clientY;
    moved = 0;
  }
  function onPointerMove(e) {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      yaw -= dx * 0.0025;
      pitch -= dy * 0.0025;
      pitch = Math.max(-1.3, Math.min(1.3, pitch));
    } else {
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (now - lastHover > 55) { lastHover = now; hover(e); }
    }
  }
  function onPointerUp(e) {
    if (dragging && moved < 6) {
      const hit = pick(e);
      if (hit) {
        spawnRipple(hit.position.clone(), hit.material.color.clone());
        onSelect && onSelect(hit.userData.item.id);
      }
    }
    dragging = false;
  }
  function onWheel(e) {
    speed = Math.max(0.6, Math.min(14, speed - e.deltaY * 0.01));
  }
  function onKey(down, e) {
    keys[e.key.toLowerCase()] = down;
    if (['w', 'a', 's', 'd', 'q', 'e', ' '].includes(e.key.toLowerCase())) e.preventDefault();
  }

  function pick(e) {
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.params.Sprite = { threshold: 0 };
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(sprites, false);
    return hits.length ? hits[0].object : null;
  }

  function hover(e) {
    const hit = pick(e);
    hoveredSprite = hit;
    if (hit) {
      canvas.style.cursor = 'pointer';
      onHover && onHover(hit.userData.item, e.clientX, e.clientY);
    } else {
      canvas.style.cursor = dragging ? 'grabbing' : 'grab';
      onHover && onHover(null);
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('keydown', (e) => onKey(true, e));
  window.addEventListener('keyup', (e) => onKey(false, e));

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const clock = new THREE.Clock();
  const tmpColor = new THREE.Color();
  const WHITE = new THREE.Color(0xffffff);

  function animate() {
    if (paused) { requestAnimationFrame(animate); return; }
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (warpBoost > 0) {
      warpBoost = Math.max(0, warpBoost - dt);
      if (warpBoost === 0) warpLines.visible = false;  // 曲速结束即隐藏划痕
    }
    bgMat.uniforms.uTime.value = t;
    starMat.uniforms.uTime.value = t;
    warpMat.opacity = Math.min(1, 0.9 + warpBoost * 0.1);

    // 朝向
    const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);

    const v = speed * 60 * dt;
    if (keys['w']) camera.position.addScaledVector(forward, v);
    if (keys['s']) camera.position.addScaledVector(forward, -v);
    if (keys['d']) camera.position.addScaledVector(right, v);
    if (keys['a']) camera.position.addScaledVector(right, -v);
    if (keys['q'] || keys[' ']) camera.position.addScaledVector(up, v);
    if (keys['e']) camera.position.addScaledVector(up, -v);
    // 曲速冲刺:进入星系时给一脚油门,营造穿梭感
    if (warpBoost > 0) camera.position.addScaledVector(forward, v * warpBoost * 5);

    // 背景星云始终以相机为中心(无限深远感),并缓慢自转
    bgMesh.position.copy(camera.position);
    bgMesh.rotation.y += dt * 0.01;
    bgMesh.rotation.x += dt * 0.004;

    // 背景星海缓慢旋转
    starField.rotation.y += dt * 0.012;
    cloudGroup.rotation.y -= dt * 0.006;

    // 银河雾带:跟随相机(无限远) + 缓慢自转
    galaxyMat.uniforms.uTime.value = t;
    galaxyHaze.position.copy(camera.position);
    galaxyHaze.rotation.z += dt * 0.008;

    // 科幻能量门:整体旋转 + 每环呼吸式明灭
    ringGroup.rotation.z += dt * 0.06;
    ringGroup.rotation.x += dt * 0.02;
    ringGroup.children.forEach((r, idx) => {
      r.material.opacity = 0.30 + 0.28 * Math.sin(t * 0.8 + idx * 1.3);
    });

    // 超空间星流:仅在曲速过渡(warpBurst)时显示,平时隐藏,避免一直有白色划痕
    gridMat.uniforms.uTime.value = t;
    if (warpLines.visible) {
      const camX = camera.position.x, camY = camera.position.y, camZ = camera.position.z;
      for (let i = 0; i < WARP; i++) {
        const w = warpData[i];
        w.oz += w.speed * dt * (1 + warpBoost * 3);
        if (w.oz > 250) spawnWarp(i, false);
        const hx = camX + w.ox, hy = camY + w.oy, hz = camZ + w.oz;
        const streak = 30 + w.speed * 0.045 * (1 + warpBoost * 2);
        const i6 = i * 6;
        warpPos[i6] = hx; warpPos[i6 + 1] = hy; warpPos[i6 + 2] = hz;
        warpPos[i6 + 3] = hx; warpPos[i6 + 4] = hy; warpPos[i6 + 5] = hz - streak;
        warpCol[i6] = 0.55; warpCol[i6 + 1] = 0.95; warpCol[i6 + 2] = 1.0;
        warpCol[i6 + 3] = 0.04; warpCol[i6 + 4] = 0.14; warpCol[i6 + 5] = 0.34;
      }
      warpGeo.attributes.position.needsUpdate = true;
      warpGeo.attributes.color.needsUpdate = true;
    }

    // 内容光点:漂浮 + 独立相位闪烁(亮度和大小同步起伏,并带色相微闪)
    sprites.forEach((s, i) => {
      s.position.y = s.userData.baseY + Math.sin(t * 0.6 + i) * 3;
      const tw = 0.5 + 0.5 * Math.sin(t * 2.2 + s.userData.phase);
      let sc = s.userData.baseScale * (0.82 + 0.34 * tw);
      let op = 0.5 + 0.5 * tw;
      if (s === hoveredSprite) { sc *= 1.45; op = Math.min(1, op + 0.25); }
      s.scale.setScalar(sc);
      s.material.opacity = op;
      // 闪烁峰值处向白色微闪
      tmpColor.copy(s.userData.baseColor).lerp(WHITE, tw * 0.45);
      s.material.color.copy(tmpColor);
    });

    // 星云团缓慢呼吸
    clouds.forEach((cl) => {
      const tw = 0.5 + 0.5 * Math.sin(t * cl.userData.drift + cl.userData.phase);
      cl.material.opacity = 0.07 + 0.13 * tw;
      const sc = cl.userData.baseScale * (0.92 + 0.12 * tw);
      cl.scale.setScalar(sc);
      cl.position.y += Math.sin(t * 0.2 + cl.userData.phase) * 0.15;
    });

    // 流星雨:隔几秒来一场(单颗与成簇流星雨交替),主打真实感
    meteorTimer -= dt;
    if (meteorTimer <= 0) {
      if (Math.random() < 0.5) spawnShower(3 + ((Math.random() * 5) | 0));
      else spawnMeteor();
      meteorTimer = 2.2 + Math.random() * 3.0;
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]; const u = m.userData; u.life += dt;
      m.position.addScaledVector(u.vel, dt);
      const k = u.life / u.max;
      if (k >= 1) { scene.remove(m); meteors.splice(i, 1); continue; }
      const fade = Math.sin(k * Math.PI);
      m.material.opacity = 0.95 * fade;
      m.scale.set(u.baseLen * (1 + 1.6 * fade), 9 * (1 + 0.4 * fade), 1);
    }

    // 选中涟漪脉冲
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i]; const u = r.userData; u.life += dt;
      const k = u.life / u.max;
      if (k >= 1) { scene.remove(r); ripples.splice(i, 1); continue; }
      const grow = u.base * (1 + 5 * k);
      r.scale.setScalar(grow);
      r.material.opacity = 0.9 * (1 - k);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  function warpBurst(sec) { warpBoost = sec || 1.4; warpLines.visible = true; }

  function setPaused(p) { paused = !!p; }

  return { setItems, applyFilter, addItem, warpBurst, setPaused };
}
