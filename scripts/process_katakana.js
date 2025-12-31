import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

// --- 自动计算路径，解决运行目录偏移问题 ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 输入目录：scripts/kanji/
const INPUT_DIR = path.resolve(__dirname, 'kanji');
// 输出目录：public/katakanaOrigin/
const OUTPUT_DIR = path.resolve(__dirname, '../public/katakanaOrigin');
const FILE_PREFIX = 'kata_';

// --- 完整的 46 个片假名映射表 ---
const katakanaMapping = [
  { char: 'ア', romaji: 'a', kanji: '阿' },
  { char: 'イ', romaji: 'i', kanji: '伊' },
  { char: 'ウ', romaji: 'u', kanji: '宇' },
  { char: 'エ', romaji: 'e', kanji: '江' },
  { char: 'オ', romaji: 'o', kanji: '於' },
  { char: 'カ', romaji: 'ka', kanji: '加' },
  { char: 'キ', romaji: 'ki', kanji: '幾' },
  { char: 'ク', romaji: 'ku', kanji: '久' },
  { char: 'ケ', romaji: 'ke', kanji: '介' },
  { char: 'コ', romaji: 'ko', kanji: '己' },
  { char: 'サ', romaji: 'sa', kanji: '散' },
  { char: 'シ', romaji: 'shi', kanji: '之' },
  { char: 'ス', romaji: 'su', kanji: '須' },
  { char: 'セ', romaji: 'se', kanji: '世' },
  { char: 'ソ', romaji: 'so', kanji: '曾' },
  { char: 'タ', romaji: 'ta', kanji: '多' },
  { char: 'チ', romaji: 'chi', kanji: '千' },
  { char: 'ツ', romaji: 'tsu', kanji: '州' },
  { char: 'テ', romaji: 'te', kanji: '天' },
  { char: 'ト', romaji: 'to', kanji: '止' },
  { char: 'ナ', romaji: 'na', kanji: '奈' },
  { char: 'ニ', romaji: 'ni', kanji: '仁' },
  { char: 'ヌ', romaji: 'nu', kanji: '奴' },
  { char: 'ネ', romaji: 'ne', kanji: '祢' },
  { char: 'ノ', romaji: 'no', kanji: '乃' },
  { char: 'ハ', romaji: 'ha', kanji: '八' },
  { char: 'ヒ', romaji: 'hi', kanji: '比' },
  { char: 'フ', romaji: 'fu', kanji: '不' },
  { char: 'ヘ', romaji: 'he', kanji: '部' },
  { char: 'ホ', romaji: 'ho', kanji: '保' },
  { char: 'マ', romaji: 'ma', kanji: '末' },
  { char: 'ミ', romaji: 'mi', kanji: '三' },
  { char: 'ム', romaji: 'mu', kanji: '牟' },
  { char: 'メ', romaji: 'me', kanji: '女' },
  { char: 'モ', romaji: 'mo', kanji: '毛' },
  { char: 'ヤ', romaji: 'ya', kanji: '也' },
  { char: 'ユ', romaji: 'yu', kanji: '由' },
  { char: 'ヨ', romaji: 'yo', kanji: '與' },
  { char: 'ラ', romaji: 'ra', kanji: '良' },
  { char: 'リ', romaji: 'ri', kanji: '利' },
  { char: 'ル', romaji: 'ru', kanji: '流' },
  { char: 'レ', romaji: 're', kanji: '礼' },
  { char: 'ロ', romaji: 'ro', kanji: '吕' },
  { char: 'ワ', romaji: 'wa', kanji: '和' },
  { char: 'ヲ', romaji: 'wo', kanji: '乎' },
  { char: 'ン', romaji: 'n', kanji: '尓' },
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 启动终极处理脚本...');

katakanaMapping.forEach((item) => {
  const { char, romaji, kanji } = item;
  const hexId = kanji.codePointAt(0).toString(16).padStart(5, '0');
  const inputFilePath = path.join(INPUT_DIR, `${hexId}.svg`);

  if (!fs.existsSync(inputFilePath)) {
    console.warn(`⚠️ 跳过: ${char} (${kanji}) - 未找到文件 ${hexId}.svg`);
    return;
  }

  const content = fs.readFileSync(inputFilePath, 'utf-8');

  // 💡 重点 1: decodeEntities: false 确保汉字不被转义成数字码
  const $ = cheerio.load(content, {
    xmlMode: true,
    decodeEntities: false,
  });

  // 1. 注入全局类名
  $('svg').addClass('kana-origin-char');

  // 2. 移除笔顺数字标签
  $('[id^="kvg:StrokeNumbers"]').remove();

  const outputName = `${FILE_PREFIX}${romaji.toLowerCase()}.svg`;
  const outputPath = path.join(OUTPUT_DIR, outputName);

  // 💡 重点 2: 重新拼接 XML 头以支持预览
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n';

  // 💡 重点 3: 只导出 <svg> 节点，彻底隔离残留的 ]> 声明
  const cleanSvgBody = $.xml('svg');

  const finalFileContent = header + cleanSvgBody;

  fs.writeFileSync(outputPath, finalFileContent);
  console.log(`✅ 已完成: ${char} (${kanji}) -> ${outputName}`);
});

console.log('\n✨ 处理全部结束！');
console.log(`📂 请检查: ${path.resolve(OUTPUT_DIR)}`);
