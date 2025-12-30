// kanji svg - https://github.com/KanjiVG/kanjivg/tree/master/kanji

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

// 在 ESM (type: module) 模式下，必须这样获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

// --- 配置路径 ---
// 确保你的脚本位置是 scripts/extract-kana.js
// 且 SVG 放在 scripts/kanjivg/kanji/ 目录下
const KANJI_DIR = path.join(__dirname, '/kanji');
const OUTPUT_FILE = path.join(__dirname, '../src/datas/newKanaPath.ts');

const isKana = (hex) => {
  const code = parseInt(hex, 16);
  // 平假名 & 片假名范围
  return (
    (code >= 0x3041 && code <= 0x3096) || (code >= 0x30a1 && code <= 0x30f6)
  );
};

const result = {};

try {
  console.log('正在扫描目录:', KANJI_DIR);
  const files = fs.readdirSync(KANJI_DIR);

  files.forEach((file) => {
    if (!file.endsWith('.svg')) return;

    const hexName = file.split('.')[0];
    if (isKana(hexName)) {
      const char = String.fromCharCode(parseInt(hexName, 16));
      const xmlData = fs.readFileSync(path.join(KANJI_DIR, file), 'utf-8');
      const jsonObj = parser.parse(xmlData);

      const paths = [];

      // 递归提取所有 path 的 d 属性
      const extractPaths = (node) => {
        if (!node) return;

        // 处理当前层的 path
        const p = node.path;
        if (Array.isArray(p)) {
          p.forEach((item) => paths.push(item['@_d']));
        } else if (p) {
          paths.push(p['@_d']);
        }

        // 处理嵌套的 g 标签
        const g = node.g;
        if (Array.isArray(g)) {
          g.forEach(extractPaths);
        } else if (g) {
          extractPaths(g);
        }
      };

      if (jsonObj.svg) {
        extractPaths(jsonObj.svg);
      }

      if (paths.length > 0) {
        result[char] = paths;
      }
    }
  });

  // 生成 TS 内容
  const tsContent = `// 自动生成的数据文件，请勿手动修改\nexport const KANA_PATHS: Record<string, string[]> = ${JSON.stringify(result, null, 2)};\n`;

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log(`\n✨ 处理完成！`);
  console.log(`✅ 总计提取假名: ${Object.keys(result).length} 个`);
  console.log(`📂 输出文件: ${OUTPUT_FILE}`);
} catch (err) {
  console.error('\n❌ 出错了:');
  console.error(err.message);
  if (err.code === 'ENOENT') {
    console.error(
      '提示：请检查 scripts/kanjivg/kanji 目录是否存在且包含 .svg 文件。'
    );
  }
}
