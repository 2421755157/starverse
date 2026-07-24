import { fetchPoetryDB, fetchQuotable, importFromFile } from './importers.js';

// 用法:
//   node server/import.js --poetrydb 20     从 PoetryDB 拉取 20 首公共领域诗歌
//   node server/import.js --quotable 20     从 Quotable 拉取 20 条名言
//   node server/import.js --file ./my.json   导入本地 JSON(内容或词表)
// 内容 JSON 格式: [{ "type":"poem|essay|quote", "title":"", "author":"",
//                    "original":"英文原文", "translation":"中文(可空)",
//                    "vocab":[{"word":"","pos":"","meaning":""}], "tags":[], "theme":"", "difficulty":1 }]

const args = process.argv.slice(2);
async function main() {
  let total = 0;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--poetrydb') {
      const n = parseInt(args[++i], 10) || 20;
      console.log(`正在从 PoetryDB 拉取 ${n} 首...`);
      total += await fetchPoetryDB(n);
    } else if (a === '--quotable') {
      const n = parseInt(args[++i], 10) || 20;
      console.log(`正在从 Quotable 拉取 ${n} 条...`);
      total += await fetchQuotable(n);
    } else if (a === '--file') {
      const path = args[++i];
      console.log(`正在导入文件 ${path}...`);
      total += importFromFile(path);
    }
  }
  if (!total) {
    console.log('未指定来源。用法见文件顶部注释。');
    console.log('示例: node server/import.js --poetrydb 20 --quotable 20');
  } else {
    console.log(`导入完成,本次新增/更新 ${total} 篇。`);
  }
}

main().catch((e) => { console.error('导入失败:', e.message); process.exit(1); });
