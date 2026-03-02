export type NodeKey =
  | 'father' | 'mother'
  | 'olderBrother' | 'youngerBrother'
  | 'olderSister' | 'youngerSister'
  | 'son' | 'daughter'
  | 'husband' | 'wife';

export type InputLang = 'zh' | 'en' | 'ja';

export interface JaEntry {
  kanji: string;
  kana: string;
  uchi?: string;
  soto: string;
  tanin: string;
}

export interface KinshipEntry {
  zh: string;
  en: string;
  ja: JaEntry;
}

export const NODE_LABELS: Record<InputLang, Record<NodeKey | 'me', string>> = {
  zh: {
    me: '我',
    father: '父', mother: '母',
    olderBrother: '兄', youngerBrother: '弟',
    olderSister: '姐', youngerSister: '妹',
    son: '子', daughter: '女',
    husband: '夫', wife: '妻',
  },
  en: {
    me: 'Me',
    father: 'Father', mother: 'Mother',
    olderBrother: 'Older Bro.', youngerBrother: 'Younger Bro.',
    olderSister: 'Older Sis.', youngerSister: 'Younger Sis.',
    son: 'Son', daughter: 'Daughter',
    husband: 'Husband', wife: 'Wife',
  },
  ja: {
    me: '私',
    father: '父', mother: '母',
    olderBrother: '兄', youngerBrother: '弟',
    olderSister: '姉', youngerSister: '妹',
    son: '息子', daughter: '娘',
    husband: '夫', wife: '妻',
  },
};

export const NODE_KANA: Partial<Record<NodeKey, string>> = {
  father: 'ちち', mother: 'はは',
  olderBrother: 'あに', youngerBrother: 'おとうと',
  olderSister: 'あね', youngerSister: 'いもうと',
  son: 'むすこ', daughter: 'むすめ',
  husband: 'おっと', wife: 'つま',
};

// ==========================================
// 核心计算引擎 (State Machine Reducer)
// ==========================================

const REDUCTION_RULES: Record<string, string> = {
  // ── 祖辈化简 ──
  'father+father': 'paternal_grandfather',
  'father+mother': 'paternal_grandmother',
  'mother+father': 'maternal_grandfather',
  'mother+mother': 'maternal_grandmother',

  // ── 曾祖辈 (引擎的延伸能力) ──
  'paternal_grandfather+father': 'paternal_great_grandfather',
  'paternal_grandmother+father': 'paternal_great_grandfather',
  'maternal_grandfather+mother': 'maternal_great_grandmother',
  'maternal_grandmother+mother': 'maternal_great_grandmother',

  // ── 旁系长辈化简 ──
  'father+olderBrother': 'paternal_uncle_older',
  'father+youngerBrother': 'paternal_uncle_younger',
  'father+olderSister': 'paternal_aunt_older',
  'father+youngerSister': 'paternal_aunt_younger',
  'mother+olderBrother': 'maternal_uncle_older',
  'mother+youngerBrother': 'maternal_uncle_younger',
  'mother+olderSister': 'maternal_aunt_older',
  'mother+youngerSister': 'maternal_aunt_younger',

  // ── 旁系晚辈化简 (侄/甥) ──
  'olderBrother+son': 'nephew_brother',
  'youngerBrother+son': 'nephew_brother',
  'olderBrother+daughter': 'niece_brother',
  'youngerBrother+daughter': 'niece_brother',
  'olderSister+son': 'nephew_sister',
  'youngerSister+son': 'nephew_sister',
  'olderSister+daughter': 'niece_sister',
  'youngerSister+daughter': 'niece_sister',

  // ── 孙辈化简 ──
  'son+son': 'grandson_son',
  'son+daughter': 'granddaughter_son',
  'daughter+son': 'grandson_daughter',
  'daughter+daughter': 'granddaughter_daughter',

  // ── 姻亲化简 ──
  'husband+father': 'father_in_law_husband',
  'husband+mother': 'mother_in_law_husband',
  'wife+father': 'father_in_law_wife',
  'wife+mother': 'mother_in_law_wife',
  'son+wife': 'daughter_in_law',
  'daughter+husband': 'son_in_law',

  // ── 伦理闭环与抵消 ──
  'olderBrother+father': 'father',
  'youngerBrother+father': 'father',
  'olderSister+father': 'father',
  'youngerSister+father': 'father',
  'olderBrother+mother': 'mother',
  'youngerBrother+mother': 'mother',
  'olderSister+mother': 'mother',
  'youngerSister+mother': 'mother',
  'father+wife': 'step_mother',
  'mother+husband': 'step_father',
};

/**
 * 核心路径折叠算法
 */
export function reducePath(path: string[]): string {
  if (path.length === 0) return 'me';
  if (path.length === 1) return path[0];

  let current = [...path];
  let changed = true;

  while (changed && current.length > 1) {
    changed = false;
    for (let i = 0; i < current.length - 1; i++) {
      const pairKey = `${current[i]}+${current[i + 1]}`;
      const reducedNode = REDUCTION_RULES[pairKey];

      if (reducedNode) {
        current.splice(i, 2, reducedNode);
        changed = true;
        break; 
      }
    }
  }
  return current.join('_');
}

// ==========================================
// 亲属数据库 (使用化简后的标准 Key)
// ==========================================

export const kinshipDB: Record<string, KinshipEntry> = {
  // ── 1层: 基础节点 ──
  'father': { zh: '父亲', en: 'Father', ja: { kanji: '父', kana: 'ちち', uchi: 'お父さん', soto: '父', tanin: 'お父さん' } },
  'mother': { zh: '母亲', en: 'Mother', ja: { kanji: '母', kana: 'はは', uchi: 'お母さん', soto: '母', tanin: 'お母さん' } },
  'olderBrother': { zh: '哥哥', en: 'Older brother', ja: { kanji: '兄', kana: 'あに', uchi: 'お兄さん', soto: '兄', tanin: 'お兄さん' } },
  'youngerBrother': { zh: '弟弟', en: 'Younger brother', ja: { kanji: '弟', kana: 'おとうと', uchi: '弟 ＋名前', soto: '弟', tanin: '弟さん' } },
  'olderSister': { zh: '姐姐', en: 'Older sister', ja: { kanji: '姉', kana: 'あね', uchi: 'お姉さん', soto: '姉', tanin: 'お姉さん' } },
  'youngerSister': { zh: '妹妹', en: 'Younger sister', ja: { kanji: '妹', kana: 'いもうと', uchi: '妹 ＋名前', soto: '妹', tanin: '妹さん' } },
  'son': { zh: '儿子', en: 'Son', ja: { kanji: '息子', kana: 'むすこ', uchi: '息子 ＋名前', soto: '息子', tanin: '息子さん' } },
  'daughter': { zh: '女儿', en: 'Daughter', ja: { kanji: '娘', kana: 'むすめ', uchi: '娘 ＋名前', soto: '娘', tanin: '娘さん' } },
  'husband': { zh: '丈夫', en: 'Husband', ja: { kanji: '夫', kana: 'おっと', uchi: 'あなた', soto: '主人', tanin: 'ご主人' } },
  'wife': { zh: '妻子', en: 'Wife', ja: { kanji: '妻', kana: 'つま', uchi: '妻 ＋名前', soto: '家内', tanin: '奥さん' } },

  // ── 2层: 祖辈 ──
  'paternal_grandfather': { zh: '爷爷（祖父）', en: 'Paternal grandfather', ja: { kanji: '祖父', kana: 'そふ', uchi: 'おじいさん', soto: '祖父', tanin: 'おじいさん' } },
  'paternal_grandmother': { zh: '奶奶（祖母）', en: 'Paternal grandmother', ja: { kanji: '祖母', kana: 'そぼ', uchi: 'おばあさん', soto: '祖母', tanin: 'おばあさん' } },
  'maternal_grandfather': { zh: '外公（姥爷）', en: 'Maternal grandfather', ja: { kanji: '祖父', kana: 'そふ', uchi: 'おじいさん', soto: '祖父', tanin: 'おじいさん' } },
  'maternal_grandmother': { zh: '外婆（姥姥）', en: 'Maternal grandmother', ja: { kanji: '祖母', kana: 'そぼ', uchi: 'おばあさん', soto: '祖母', tanin: 'おばあさん' } },

  // ── 3层: 曾祖辈 (演示引擎化简能力) ──
  'paternal_great_grandfather': { zh: '曾祖父（太爷爷）', en: 'Great-grandfather', ja: { kanji: '曾祖父', kana: 'そうそふ', uchi: 'ひいおじいさん', soto: '曾祖父', tanin: 'ひいおじいさん' } },
  'maternal_great_grandmother': { zh: '外曾祖母（太姥姥）', en: 'Great-grandmother', ja: { kanji: '曾祖母', kana: 'そうそぼ', uchi: 'ひいおばあさん', soto: '曾祖母', tanin: 'ひいおばあさん' } },

  // ── 2层: 旁系长辈 ──
  'paternal_uncle_older': { zh: '伯父（大爷/大伯）', en: "Father's older brother", ja: { kanji: '伯父', kana: 'おじ', uchi: 'おじさん', soto: '伯父', tanin: 'おじさん' } },
  'paternal_uncle_younger': { zh: '叔父（叔叔）', en: "Father's younger brother", ja: { kanji: '叔父', kana: 'おじ', uchi: 'おじさん', soto: '叔父', tanin: 'おじさん' } },
  'paternal_aunt_older': { zh: '姑母（大姑/姑妈）', en: "Father's older sister", ja: { kanji: '伯母', kana: 'おば', uchi: 'おばさん', soto: '伯母', tanin: 'おばさん' } },
  'paternal_aunt_younger': { zh: '姑母（小姑）', en: "Father's younger sister", ja: { kanji: '叔母', kana: 'おば', uchi: 'おばさん', soto: '叔母', tanin: 'おばさん' } },
  'maternal_uncle_older': { zh: '舅父（大舅）', en: "Mother's older brother", ja: { kanji: '伯父', kana: 'おじ', uchi: 'おじさん', soto: '伯父', tanin: 'おじさん' } },
  'maternal_uncle_younger': { zh: '舅父（舅舅）', en: "Mother's younger brother", ja: { kanji: '叔父', kana: 'おじ', uchi: 'おじさん', soto: '叔父', tanin: 'おじさん' } },
  'maternal_aunt_older': { zh: '姨母（大姨）', en: "Mother's older sister", ja: { kanji: '伯母', kana: 'おば', uchi: 'おばさん', soto: '伯母', tanin: 'おばさん' } },
  'maternal_aunt_younger': { zh: '姨母（小姨）', en: "Mother's younger sister", ja: { kanji: '叔母', kana: 'おば', uchi: 'おばさん', soto: '叔母', tanin: 'おばさん' } },

  // ── 2层: 旁系晚辈 ──
  'nephew_brother': { zh: '侄子', en: "Brother's son (nephew)", ja: { kanji: '甥', kana: 'おい', soto: '甥', tanin: '甥御さん' } },
  'niece_brother': { zh: '侄女', en: "Brother's daughter (niece)", ja: { kanji: '姪', kana: 'めい', soto: '姪', tanin: '姪御さん' } },
  'nephew_sister': { zh: '外甥', en: "Sister's son (nephew)", ja: { kanji: '甥', kana: 'おい', soto: '甥', tanin: '甥御さん' } },
  'niece_sister': { zh: '外甥女', en: "Sister's daughter (niece)", ja: { kanji: '姪', kana: 'めい', soto: '姪', tanin: '姪御さん' } },

  // ── 2层: 姻亲 ──
  'father_in_law_husband': { zh: '公公（爸爸）', en: "Husband's father", ja: { kanji: '義父', kana: 'ぎふ', uchi: 'お父さん', soto: '義父', tanin: 'お父さん' } },
  'mother_in_law_husband': { zh: '婆婆（妈妈）', en: "Husband's mother", ja: { kanji: '義母', kana: 'ぎぼ', uchi: 'お母さん', soto: '義母', tanin: 'お母さん' } },
  'father_in_law_wife': { zh: '岳父（老丈人）', en: "Wife's father", ja: { kanji: '義父', kana: 'ぎふ', uchi: 'お父さん', soto: '義父', tanin: 'お父さん' } },
  'mother_in_law_wife': { zh: '岳母（丈母娘）', en: "Wife's mother", ja: { kanji: '義母', kana: 'ぎぼ', uchi: 'お母さん', soto: '義母', tanin: 'お母さん' } },
  'daughter_in_law': { zh: '儿媳（媳妇）', en: "Daughter-in-law", ja: { kanji: '嫁', kana: 'よめ', soto: '嫁', tanin: 'お嫁さん' } },
  'son_in_law': { zh: '女婿', en: "Son-in-law", ja: { kanji: '婿', kana: 'むこ', soto: '婿', tanin: '婿さん' } },

  // ── 2层: 孙辈 ──
  'grandson_son': { zh: '孙子', en: "Son's son", ja: { kanji: '孫', kana: 'まご', soto: '孫', tanin: 'お孫さん' } },
  'granddaughter_son': { zh: '孙女', en: "Son's daughter", ja: { kanji: '孫', kana: 'まご', soto: '孫', tanin: 'お孫さん' } },
  'grandson_daughter': { zh: '外孙', en: "Daughter's son", ja: { kanji: '孫', kana: 'まご', soto: '孫', tanin: 'お孫さん' } },
  'granddaughter_daughter': { zh: '外孙女', en: "Daughter's daughter", ja: { kanji: '孫', kana: 'まご', soto: '孫', tanin: 'お孫さん' } },

  // ── 伦理抵消 ──
  'step_mother': { zh: '继母', en: 'Stepmother', ja: { kanji: '継母', kana: 'けいぼ', uchi: 'お母さん', soto: '継母', tanin: 'お母さん' } },
  'step_father': { zh: '继父', en: 'Stepfather', ja: { kanji: '継父', kana: 'けいふ', uchi: 'お父さん', soto: '継父', tanin: 'お父さん' } },
};