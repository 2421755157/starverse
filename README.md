# 星海 · English Verse

沉浸式 3D 英语学习站：星空化作词汇的银河，点击进入可穿越"时光飞船"隧道，在科幻星河中遇见多国语言的诗词与名句。

## 一、环境要求

- **Node.js ≥ 22.5.0**（本项目使用 Node 内置的 `node:sqlite` 作为数据库，旧版本无法运行）
  - 下载：https://nodejs.org （选 Node 22 LTS 或更高）
  - 检查版本：`node --version`

## 二、运行（三步即可）

1. 把整个 `english-verse` 文件夹复制到任意电脑。
2. 在文件夹内打开终端（命令行），执行：

   ```bash
   node server/start.js
   ```

   或（等价）：

   ```bash
   npm start
   ```

3. 浏览器打开：<http://localhost:3000>

首次启动会自动把内置的 3000 篇诗词/名句导入数据库（约 1–2 秒，控制台会提示 `已自动导入 3000 篇内容`），之后直接进首页即可。

## 三、局域网内其他设备访问

电脑和手机/其他电脑连**同一个 WiFi**，在浏览器打开：

```
http://<本机IP>:3000
```

本机 IP 可在终端用 `ipconfig`（Windows）/ `ifconfig`（Mac/Linux）查看。

## 四、自定义端口

```bash
PORT=8080 node server/start.js
```

## 五、重新导入内容 / 重置数据

```bash
npm run seed      # 从 server/data/content.json 重新导入全部内容
```

重置整个数据库（清空账号、收藏等）：

```bash
rm server/app.db   # 删除后重新启动会按内置内容重建
node server/start.js
```

## 六、技术说明（为什么无需 npm install）

- **后端零运行时依赖**：仅用 Node 内置模块（`node:http` 静态服务、`node:sqlite` 数据库、`node:crypto` 密码哈希），因此**不需要 `npm install`**。
- **前端 Three.js 已内置**：3D 场景依赖的 `three.module.js` 已放在 `public/vendor/`，通过 importmap 本地加载，**不依赖网络、不依赖 node_modules**。
- `node_modules/` 在本项目中并未被运行使用，仅为本地调试产物，**可放心删除**（删除后项目依然正常运行）。

## 七、目录结构

```
english-verse/
├─ server/
│  ├─ start.js        # 启动入口(含 Node 版本检查)
│  ├─ server.js       # HTTP 服务 + 全部 API
│  ├─ db.js           # 数据库(首次自动导入内置内容)
│  ├─ auth.js         # 注册/登录/会话
│  ├─ seed.js         # 手动导入内容脚本
│  ├─ data/content.json  # 3000 篇内置诗词/名句(数据源)
│  └─ app.db          # 运行时数据库(自动生成)
├─ public/            # 前端(HTML/CSS/JS + 内置 three)
│  ├─ index.html
│  ├─ vendor/three.module.js
│  └─ js/  (intro/travel/starfield/app/store/... )
└─ package.json
```

## 八、部署到 GitHub Pages（免费 · 别人直接访问）

前端已设计为「双模式」：有 Node 后端时走 API；纯静态托管（如 GitHub Pages）时自动降级为 `public/content.json` + 浏览器 localStorage，因此**可直接作为静态站点公开访问**——浏览、朗读、时光飞船穿越、游客本地收藏全部可用。

> 说明：GitHub Pages 只托管前端静态文件，不运行 Node 后端。因此「账号登录 / 跨设备同步」在纯静态部署下不可用；游客模式下的收藏、生词本、上传会保存在各自浏览器本地。

### 方式一：用本项目自带的 GitHub Actions（推荐）

1. 在 GitHub 新建一个 **Public** 仓库（例如 `starverse`）。
2. 仓库已包含 `.github/workflows/pages.yml`，把代码推到 `main` 分支即可触发部署：

   ```bash
   git remote add origin git@github.com:<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 等待 Actions 跑完（约 1–2 分钟），访问：

   ```
   https://<你的用户名>.github.io/<仓库名>/
   ```

### 方式二：任意静态托管

把 `public/` 目录整体上传到 Vercel / Netlify / Cloudflare Pages / 对象存储，即是一个可公开访问的站点，无需后端。

