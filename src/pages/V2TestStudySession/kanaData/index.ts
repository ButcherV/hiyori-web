import { HIRAGANA_SEION } from './groups/h-seion';
import { KATAKANA_SEION } from './groups/k-seion';

import type { AnyKanaData } from './core';

export * from './core';

export const KANA_DB: Record<string, AnyKanaData> = {
  ...HIRAGANA_SEION,
  ...KATAKANA_SEION,
};
