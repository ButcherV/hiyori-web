// 定义类型 (为了能在其他地方复用)
export type LessonCategory = 'seion' | 'dakuon' | 'yoon';

export interface LessonItem {
  id: string;
  category: LessonCategory;
  title: string;
  preview: string;
}

// --- 搬运过来的平假名数据 ---
export const HIRAGANA_DATA: LessonItem[] = [
  // --- 清音 (Seion) ---
  {
    id: 'row-a',
    category: 'seion',
    title: 'A - Row',
    preview: 'あ い う え お',
  },
  {
    id: 'row-ka',
    category: 'seion',
    title: 'Ka - Row',
    preview: 'か き く け こ',
  },
  {
    id: 'row-sa',
    category: 'seion',
    title: 'Sa - Row',
    preview: 'さ し す せ そ',
  },
  {
    id: 'row-ta',
    category: 'seion',
    title: 'Ta - Row',
    preview: 'た ち つ て と',
  },
  {
    id: 'row-na',
    category: 'seion',
    title: 'Na - Row',
    preview: 'な に ぬ ね の',
  },
  {
    id: 'row-ha',
    category: 'seion',
    title: 'Ha - Row',
    preview: 'は ひ ふ へ ほ',
  },
  {
    id: 'row-ma',
    category: 'seion',
    title: 'Ma - Row',
    preview: 'ま み む め も',
  },
  { id: 'row-ya', category: 'seion', title: 'Ya - Row', preview: 'や ゆ よ' },
  {
    id: 'row-ra',
    category: 'seion',
    title: 'Ra - Row',
    preview: 'ら り る れ ろ',
  },
  { id: 'row-wa', category: 'seion', title: 'Wa - Row', preview: 'わ を ん' },
  // --- 浊音 ---
  {
    id: 'row-ga',
    category: 'dakuon',
    title: 'Ga - Row',
    preview: 'が ぎ ぐ げ ご',
  },
  {
    id: 'row-za',
    category: 'dakuon',
    title: 'Za - Row',
    preview: 'ざ じ ず ぜ ぞ',
  },
  {
    id: 'row-da',
    category: 'dakuon',
    title: 'Da - Row',
    preview: 'だ ぢ づ で ど',
  },
  {
    id: 'row-ba',
    category: 'dakuon',
    title: 'Ba - Row',
    preview: 'ば び ぶ べ ぼ',
  },
  {
    id: 'row-pa',
    category: 'dakuon',
    title: 'Pa - Row',
    preview: 'ぱ ぴ ぷ ぺ ぽ',
  },
  // --- 拗音 ---
  {
    id: 'row-kya',
    category: 'yoon',
    title: 'Kya - Row',
    preview: 'きゃ きゅ きょ',
  },
  {
    id: 'row-sha',
    category: 'yoon',
    title: 'Sha - Row',
    preview: 'しゃ しゅ しょ',
  },
  {
    id: 'row-cha',
    category: 'yoon',
    title: 'Cha - Row',
    preview: 'ちゃ ちゅ ちょ',
  },
  {
    id: 'row-nya',
    category: 'yoon',
    title: 'Nya - Row',
    preview: 'にゃ にゅ にょ',
  },
  {
    id: 'row-hya',
    category: 'yoon',
    title: 'Hya - Row',
    preview: 'ひゃ ひゅ ひょ',
  },
  {
    id: 'row-mya',
    category: 'yoon',
    title: 'Mya - Row',
    preview: 'みゃ みゅ みょ',
  },
  {
    id: 'row-rya',
    category: 'yoon',
    title: 'Rya - Row',
    preview: 'りゃ りゅ りょ',
  },
  {
    id: 'row-gya',
    category: 'yoon',
    title: 'Gya - Row',
    preview: 'ぎゃ ぎゅ ぎょ',
  },
  {
    id: 'row-ja',
    category: 'yoon',
    title: 'Ja - Row',
    preview: 'じゃ じゅ じょ',
  },
  {
    id: 'row-bya',
    category: 'yoon',
    title: 'Bya - Row',
    preview: 'びゃ びゅ びょ',
  },
  {
    id: 'row-pya',
    category: 'yoon',
    title: 'Pya - Row',
    preview: 'ぴゃ ぴゅ ぴょ',
  },
];

// --- 搬运过来的片假名数据 ---
export const KATAKANA_DATA: LessonItem[] = [
  // --- 清音 ---
  {
    id: 'k-row-a',
    category: 'seion',
    title: 'A - Row',
    preview: 'ア イ ウ エ オ',
  },
  {
    id: 'k-row-ka',
    category: 'seion',
    title: 'Ka - Row',
    preview: 'カ キ ク ケ コ',
  },
  {
    id: 'k-row-sa',
    category: 'seion',
    title: 'Sa - Row',
    preview: 'サ シ ス セ ソ',
  },
  {
    id: 'k-row-ta',
    category: 'seion',
    title: 'Ta - Row',
    preview: 'タ チ ツ テ ト',
  },
  {
    id: 'k-row-na',
    category: 'seion',
    title: 'Na - Row',
    preview: 'ナ ニ ヌ ネ ノ',
  },
  {
    id: 'k-row-ha',
    category: 'seion',
    title: 'Ha - Row',
    preview: 'ハ ヒ フ ヘ ホ',
  },
  {
    id: 'k-row-ma',
    category: 'seion',
    title: 'Ma - Row',
    preview: 'マ ミ ム メ モ',
  },
  { id: 'k-row-ya', category: 'seion', title: 'Ya - Row', preview: 'ヤ ユ ヨ' },
  {
    id: 'k-row-ra',
    category: 'seion',
    title: 'Ra - Row',
    preview: 'ラ リ ル レ ロ',
  },
  { id: 'k-row-wa', category: 'seion', title: 'Wa - Row', preview: 'ワ ヲ ン' },
  // --- 浊音 ---
  {
    id: 'k-row-ga',
    category: 'dakuon',
    title: 'Ga - Row',
    preview: 'ガ ギ グ ゲ ゴ',
  },
  {
    id: 'k-row-za',
    category: 'dakuon',
    title: 'Za - Row',
    preview: 'ザ ジ ズ ゼ ゾ',
  },
  {
    id: 'k-row-da',
    category: 'dakuon',
    title: 'Da - Row',
    preview: 'ダ ヂ ヅ デ ド',
  },
  {
    id: 'k-row-ba',
    category: 'dakuon',
    title: 'Ba - Row',
    preview: 'バ ビ ブ ベ ボ',
  },
  {
    id: 'k-row-pa',
    category: 'dakuon',
    title: 'Pa - Row',
    preview: 'パ ピ プ ペ ポ',
  },
  // --- 拗音 ---
  {
    id: 'k-row-kya',
    category: 'yoon',
    title: 'Kya - Row',
    preview: 'キャ キュ キョ',
  },
  {
    id: 'k-row-sha',
    category: 'yoon',
    title: 'Sha - Row',
    preview: 'シャ シュ ショ',
  },
  {
    id: 'k-row-cha',
    category: 'yoon',
    title: 'Cha - Row',
    preview: 'チャ チュ チョ',
  },
  {
    id: 'k-row-nya',
    category: 'yoon',
    title: 'Nya - Row',
    preview: 'ニャ ニュ ニョ',
  },
  {
    id: 'k-row-hya',
    category: 'yoon',
    title: 'Hya - Row',
    preview: 'ヒャ ヒュ ヒョ',
  },
  {
    id: 'k-row-mya',
    category: 'yoon',
    title: 'Mya - Row',
    preview: 'ミャ ミュ ミョ',
  },
  {
    id: 'k-row-rya',
    category: 'yoon',
    title: 'Rya - Row',
    preview: 'リャ リュ リョ',
  },
  {
    id: 'k-row-gya',
    category: 'yoon',
    title: 'Gya - Row',
    preview: 'ギャ ギュ ギョ',
  },
  {
    id: 'k-row-ja',
    category: 'yoon',
    title: 'Ja - Row',
    preview: 'ジャ ジュ ジョ',
  },
  {
    id: 'k-row-bya',
    category: 'yoon',
    title: 'Bya - Row',
    preview: 'ビャ ビュ ビョ',
  },
  {
    id: 'k-row-pya',
    category: 'yoon',
    title: 'Pya - Row',
    preview: 'ピャ ピュ ピョ',
  },
];
