// 启动入口:先做 Node 版本检查(本项目依赖内置 node:sqlite,需 Node >= 22.5.0),
// 通过后再动态加载真正的服务。这样版本不够时给出清晰提示,而不是崩溃堆栈。
const [maj, min] = process.versions.node.split('.').map(Number);
if (maj < 22 || (maj === 22 && min < 5)) {
  console.error(
    `\n✖ 星海 English Verse 需要 Node.js >= 22.5.0,当前版本为 ${process.versions.node}。\n` +
    `  请从 https://nodejs.org 下载安装 Node.js 22 LTS(或更高)版本后重试。\n`
  );
  process.exit(1);
}

// 版本满足,加载并启动服务
await import('./server.js');
