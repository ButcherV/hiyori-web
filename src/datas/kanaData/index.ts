import { HIRAGANA_SEION } from './groups/h-seion';
import { KATAKANA_SEION } from './groups/k-seion';
import { HIRAGANA_DAKUON } from './groups/h-dakuon';
import { KATAKANA_DAKUON } from './groups/k-dakuon';
import { HIRAGANA_YOON } from './groups/h-yoon';
import { KATAKANA_YOON } from './groups/k-yoon';

import type { AnyKanaData } from './core';

export * from './core';

export const KANA_DB: Record<string, AnyKanaData> = {
  ...HIRAGANA_SEION,
  ...KATAKANA_SEION,
  ...HIRAGANA_DAKUON,
  ...KATAKANA_DAKUON,
  ...HIRAGANA_YOON,
  ...KATAKANA_YOON,
};
