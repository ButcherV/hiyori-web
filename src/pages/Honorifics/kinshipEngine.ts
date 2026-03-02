// Honorifics/kinshipEngine.ts

/**
 * 核心化简规则表 (Reduction Rules)
 * 格式: "节点A+节点B" : "化简后的新节点"
 * * 这就像乘法口诀表，只要引擎遇到相邻的两个节点符合规则，就会把它们合并。
 */
const REDUCTION_RULES: Record<string, string> = {
  // === 向上推导 (长辈) ===
  'father+father': 'paternal_grandfather', // 父 + 父 = 爷爷
  'father+mother': 'paternal_grandmother', // 父 + 母 = 奶奶
  'mother+father': 'maternal_grandfather', // 母 + 父 = 外公
  'mother+mother': 'maternal_grandmother', // 母 + 母 = 外婆

  // 突破三代：曾祖辈 (这就是引擎的威力，不用穷举长链条)
  'paternal_grandfather+father': 'paternal_great_grandfather', // 爷爷 + 父 = 曾祖父
  'paternal_grandfather+mother': 'paternal_great_grandmother', // 爷爷 + 母 = 曾祖母
  'maternal_grandfather+father': 'maternal_great_grandfather', // 外公 + 父 = 外曾祖父
  'maternal_grandfather+mother': 'maternal_great_grandmother', // 外公 + 母 = 外曾祖母

  // === 旁系推导 (叔伯姑舅) ===
  'father+olderBrother': 'paternal_uncle_older', // 父 + 兄 = 伯父
  'father+youngerBrother': 'paternal_uncle_younger', // 父 + 弟 = 叔父
  'father+olderSister': 'paternal_aunt_older', // 父 + 姐 = 姑妈
  'father+youngerSister': 'paternal_aunt_younger', // 父 + 妹 = 小姑
  'mother+olderBrother': 'maternal_uncle_older', // 母 + 兄 = 大舅
  'mother+youngerBrother': 'maternal_uncle_younger', // 母 + 弟 = 小舅
  'mother+olderSister': 'maternal_aunt_older', // 母 + 姐 = 大姨
  'mother+youngerSister': 'maternal_aunt_younger', // 母 + 妹 = 小姨

  // === 向下推导 (晚辈) ===
  'son+son': 'grandson_paternal', // 子 + 子 = 孙子
  'son+daughter': 'granddaughter_paternal', // 子 + 女 = 孙女
  'daughter+son': 'grandson_maternal', // 女 + 子 = 外孙
  'daughter+daughter': 'granddaughter_maternal', // 女 + 女 = 外孙女

  // === 抵消/回归逻辑 (伦理闭环) ===
  // 哥哥的爸爸，依然是爸爸
  'olderBrother+father': 'father',
  'youngerBrother+father': 'father',
  'olderSister+father': 'father',
  'youngerSister+father': 'father',
  // 姐姐的妈妈，依然是妈妈
  'olderBrother+mother': 'mother',
  'olderSister+mother': 'mother',

  // 爸爸的妻子 = 继母 (这里假设默认不是亲妈，亲妈按抵消算的话太复杂，MVP先按继母算)
  'father+wife': 'step_mother',
  'mother+husband': 'step_father',
};

/**
 * 核心折叠算法 (Path Reducer)
 * @param path 用户输入的原始按键路径，例如 ['father', 'father', 'father']
 * @returns 化简后的最终节点 ID
 */
export function reducePath(path: string[]): string {
  if (path.length === 0) return 'me';
  if (path.length === 1) return path[0];

  let current = [...path];
  let changed = true;

  // 只要数组里还有超过1个元素，并且上一轮发生了化简，就继续尝试合并
  while (changed && current.length > 1) {
    changed = false;

    // 从左到右扫描相邻的节点对
    for (let i = 0; i < current.length - 1; i++) {
      const pairKey = `${current[i]}+${current[i + 1]}`;
      const reducedNode = REDUCTION_RULES[pairKey];

      if (reducedNode) {
        // 匹配成功！用合并后的新节点，替换掉原来的两个节点
        current.splice(i, 2, reducedNode);
        changed = true;
        break; // 数组结构变了，跳出 for 循环，重新从头扫描
      }
    }
  }

  // 如果无法继续化简了，就把剩下的节点用 '_' 连起来。
  // 比如 ['paternal_uncle_older', 'son'] (伯父的儿子)，如果在规则表里没定义，就会返回 'paternal_uncle_older_son'
  return current.join('_');
}
