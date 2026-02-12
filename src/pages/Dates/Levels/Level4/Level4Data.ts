// src/pages/Dates/Levels/Level4/Level4Data.ts

export interface Era {
  key: string;
  kanji: string;
  romaji: string;
  startYear: number; // 西历起始年
  endYear: number; // 西历结束年
  color: string; // 代表色
}

export const ERAS: Era[] = [
  {
    key: 'meiji',
    kanji: '明治',
    romaji: 'Meiji',
    startYear: 1868,
    endYear: 1912,
    color: '#fca5a5',
  }, // 这里的颜色暂时占位
  {
    key: 'taisho',
    kanji: '大正',
    romaji: 'Taisho',
    startYear: 1912,
    endYear: 1926,
    color: '#86efac',
  },
  {
    key: 'showa',
    kanji: '昭和',
    romaji: 'Showa',
    startYear: 1926,
    endYear: 1989,
    color: '#fde047',
  },
  {
    key: 'heisei',
    kanji: '平成',
    romaji: 'Heisei',
    startYear: 1989,
    endYear: 2019,
    color: '#93c5fd',
  },
  {
    key: 'reiwa',
    kanji: '令和',
    romaji: 'Reiwa',
    startYear: 2019,
    endYear: 2030,
    color: '#c4b5fd',
  }, // 假设到2030用于教学
];

export interface YearData {
  year: number; // 西历 2024
  era: Era; // 所属年号对象
  eraYear: number; // 年号第几年 (1=元年)
  kanji: string; // 令和6年
  kana: string; // れいわろくねん
  romaji: string; // rei·wa·ro·ku·nen
  isTrap: boolean; // 是否是陷阱发音 (4, 7, 9, 元)
  specialTag?: string; // 今年, 去年, 明年
}

// 实际上年份读法有特殊规则，我们需要专门处理后缀
const getYearSuffixData = (
  yearNum: number
): { kana: string; romaji: string; isTrap: boolean } => {
  // 处理末尾数字
  const lastDigit = yearNum % 10;

  // 特殊规则：
  // 4年: yo-nen (Trap)
  if (lastDigit === 4)
    return { kana: 'よねん', romaji: 'yo·nen', isTrap: true };
  // 7年: shichi-nen (Trap, though nana is sometimes used, shichi is preferred in formal contexts)
  if (lastDigit === 7)
    return { kana: 'しちねん', romaji: 'shi·chi·nen', isTrap: true };
  // 9年: ku-nen (Trap)
  if (lastDigit === 9)
    return { kana: 'くねん', romaji: 'ku·nen', isTrap: true };

  // 普通规则 (这里简化处理，实际需要完整数字转假名逻辑，暂且只处理个位数+nen用于示例)
  // 在完整项目中，建议复用你的数字转换 hook，这里为了独立性简单写一下映射
  const map: Record<number, [string, string]> = {
    0: ['ぜろねん', 'ze·ro·nen'],
    1: ['いちねん', 'i·chi·nen'],
    2: ['にねん', 'ni·nen'],
    3: ['さんねん', 'sa·n·nen'],
    5: ['ごねん', 'go·nen'],
    6: ['ろくねん', 'ro·ku·nen'],
    8: ['はちねん', 'ha·chi·nen'],
  };

  if (map[lastDigit]) {
    return {
      kana: map[lastDigit][0],
      romaji: map[lastDigit][1],
      isTrap: false,
    };
  }

  // Fallback
  return { kana: 'ねん', romaji: 'nen', isTrap: false };
};

// 核心工厂函数：生成某年的详细数据
export const getYearData = (year: number): YearData => {
  // 1. 确定年号 (倒序查找，优先匹配最新的)
  const era = [...ERAS].reverse().find((e) => year >= e.startYear) || ERAS[0];

  // 2. 计算年号年
  const eraYear = year - era.startYear + 1;

  // 3. 处理元年
  const isGannen = eraYear === 1;

  // 4. 构建显示文本
  const kanji = `${era.kanji}${isGannen ? '元' : eraYear}年`;

  // 5. 构建发音 (简易版，只处理后缀逻辑用于演示)
  // 实际读音 = 年号读音 + 数字读音 + 年
  // 注意：元年读 gannen
  // let suffixKana = '';
  // let suffixRomaji = '';
  let isTrap = false;

  if (isGannen) {
    // suffixKana = 'がんねん';
    // suffixRomaji = 'ga·n·nen';
    isTrap = true;
  } else {
    // 这里简单处理：实际应用中你需要一个 numberToKana 的转换器
    // 为了 Level4 演示，我们只关注 4, 7, 9 的陷阱提示
    const suffixData = getYearSuffixData(eraYear);
    // suffixKana = suffixData.kana; // 注意：这里只是后缀，没包含前面的十位百位
    // suffixRomaji = suffixData.romaji;
    isTrap = suffixData.isTrap;

    // 补全前面的数字读音 (略，假设 Level 4 用户已经会读数字了，重点在后缀)
    // 如果需要完整读音，需要引入更复杂的数字转换库
  }

  // 6. 特殊标签
  const currentYear = new Date().getFullYear();
  let specialTag = undefined;
  if (year === currentYear) specialTag = '今年 (Kotoshi)';
  if (year === currentYear - 1) specialTag = '去年 (Kyonen)';
  if (year === currentYear + 1) specialTag = '来年 (Rainen)';

  return {
    year,
    era,
    eraYear,
    kanji,
    kana: `${era.romaji} ${eraYear}`, // 暂时用 Romaji 占位，实际应为全假名
    romaji: `${era.romaji} · ${isGannen ? 'gan·nen' : eraYear + ' · nen'}`, // 简略示意
    isTrap,
    specialTag,
  };
};
