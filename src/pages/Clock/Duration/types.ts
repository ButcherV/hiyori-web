export interface TimePeriod {
  name: string;
  kana: string;
  start: number;
  end: number;
  i18nKey: string;
}

export const TIME_PERIODS: TimePeriod[] = [
  { name: '深夜',  kana: 'しんや',    start: 0,  end: 4,  i18nKey: 'shinnya'  },
  { name: '未明',  kana: 'みめい',    start: 2,  end: 5,  i18nKey: 'mimei'    },
  { name: '夜明け', kana: 'よあけ',   start: 4,  end: 6,  i18nKey: 'yoake'    },
  { name: '早朝',  kana: 'そうちょう', start: 5,  end: 7,  i18nKey: 'souchou'  },
  { name: '朝',   kana: 'あさ',      start: 6,  end: 10, i18nKey: 'asa'      },
  { name: '午前',  kana: 'ごぜん',    start: 0,  end: 12, i18nKey: 'gozen'    },
  { name: '昼',   kana: 'ひる',      start: 10, end: 14, i18nKey: 'hiru'     },
  { name: '正午',  kana: 'しょうご',  start: 12, end: 12, i18nKey: 'shougo'   },
  { name: '午後',  kana: 'ごご',      start: 12, end: 18, i18nKey: 'gogo'     },
  { name: '夕方',  kana: 'ゆうがた',  start: 16, end: 19, i18nKey: 'yuugata'  },
  { name: '夜',   kana: 'よる',      start: 19, end: 24, i18nKey: 'yoru'     },
  { name: '真夜中', kana: 'まよなか',  start: 0,  end: 0,  i18nKey: 'mayonaka' },
];
